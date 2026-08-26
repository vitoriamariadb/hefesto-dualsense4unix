# LEVA-2-A — o toque curto ganha teto: religar o controle para de abrir a Steam

**26/08/2026.** Nasce da `2026-08-03-PS-TOQUE-CURTO-01`, entregas E1 e E2. A E3
(o `wmctrl`) fica de fora por decisão de produto — está relatada no fim.

## O que mudou

**O defeito.** O controle dela cai no rádio; ela segura o botão PS por cinco
segundos para religá-lo — que é como se liga um DualSense —, solta, e **a Steam
abre**. Com a Steam já aberta, abre uma segunda. Duas vezes em 45 segundos na
sessão dela.

**Por que acontecia — e é COMPOSIÇÃO, não descuido.** `_observe_ps_solo`
(`integrations/hotkey_daemon.py`) calculava `held_ms` no release, **logava** o
valor e chamava `_fire_ps_solo()` sem comparar com teto nenhum. A única barreira
era `_ps_long_press_fired`, e ela **nunca arma**, porque o long-press nasce
desligado (`DEFAULT_PS_LONG_PRESS_MS = 0`) — decisão certa, tomada porque o
long-press causava modo-jogo ACIDENTAL. As duas decisões estão certas
isoladamente; desligar o long-press removeu, sem querer, o único teto que
existia. Toda duração de release caía no mesmo ramo: 200 ms ou 5.038 ms.

**A cura**, toda em `src/hefesto_dualsense4unix/integrations/hotkey_daemon.py`:

1. `DEFAULT_PS_TOQUE_CURTO_TETO_MS = 700` — o teto, em ms. É a saída **(a)** que
   a sprint recomenda: número único, sem configuração nova para ela entender.
   A sprint recusa explicitamente a saída (b) (reaproveitar `ps_long_press_ms`),
   e a recusa está copiada no comentário da constante: amarrar dois gestos
   independentes ao mesmo número faria o toque curto virar 2 s no dia em que ela
   ligasse o long-press em 2000 ms.
   **Por que 700:** um clique intencional humano fica em 80-250 ms; o
   religamento medido no journal dela foi de 5.038 ms. 700 fica entre os dois
   com folga dos dois lados.
2. `HotkeyConfig.ps_toque_curto_teto_ms` — o campo, na linha de baixo do
   `ps_long_press_ms`, com a mesma semântica de desligar: **0 ou negativo
   restaura o comportamento anterior** (qualquer duração vira toque).
3. `ENV_PS_TOQUE_CURTO_TETO_MS` /
   `HEFESTO_DUALSENSE4UNIX_PS_TOQUE_CURTO_TETO_MS` — o ajuste em runtime, pelo
   mesmo mecanismo do `ps_long_press_ms` (este módulo não lê `daemon.toml`; a
   config efetiva vem de env + IPC, e a docstring do topo já dizia isso). Valor
   ilegível **não** desliga o teto nem derruba o daemon: cai no default e loga
   `ps_toque_curto_teto_ms_ilegivel`. Desligar é escolha explícita, `=0`.
4. **O gate**, no ramo do release: `if teto_ms > 0 and held_ms > teto_ms:` →
   `return None`, sem disparar nada. A borda pertence ao toque (`==` teto ainda
   é toque).
5. **E2 — a recusa aparece** (`logger.info`):
   `ps_solo_ignorado_hold_longo  held_ms=5038.2  teto_ms=700`. Sem ela, o hold
   longo continuaria sumindo em silêncio e a próxima investigação procuraria o
   que não existe. O `teto_ms` vai junto de propósito: sem ele não dá para
   saber, lendo um journal antigo, se o teto de então era o de hoje.
6. Três comentários que **mentiam por omissão** foram corrigidos no mesmo
   arquivo: a docstring do módulo (`PS sozinho → abre/foca a Steam (buffer de
   150 ms)` virou `(toque de até 700 ms)` — o buffer de 150 ms nunca foi teto,
   é o atraso de repasse ao uinput), a lista de políticas e a docstring do
   `_observe_ps_solo`, que descrevia "toque curto" sem teto nenhum.

Também entrou **uma linha** em `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`
(posse DE LINHA, R-B): a env nova precisa de classificação ou o portão reprova
por ESTAR SEM CLASSIFICAÇÃO. Entrou em `_INSTRUMENTO_DE_AMBIENTE`, ao lado da
irmã `HEFESTO_DUALSENSE4UNIX_PS_LONG_PRESS_MS` e pela mesma razão: calibração de
gesto, afinada por quem mede, não escolhida por quem usa — o teto já nasce
LIGADO, então não é promessa que espera uma mão. **Nenhum outro bloco daquele
arquivo foi tocado.**

`daemon/lifecycle.py` estava na minha posse e **não foi tocado**. O porquê está
no "O que sobrou".

## Qual mordida prova

`tests/unit/test_hotkey_ps_solo_gate.py` — **o arquivo já existia** (quatro
casos do M5: o gate de QUEM pode disparar, por Modo Nativo / modo jogo /
`ps_button_action="none"`). Os quatro **continuam lá, intactos**; os dez novos
entraram embaixo, sob um cabeçalho próprio, e a docstring do módulo passou a ter
duas partes. Conferido pelo diff: as únicas linhas REMOVIDAS do arquivo antigo
são as seis da docstring original, e o texto delas está absorvido na "Parte 1"
da nova. O arquivo fecha em **14 passed**.

O que morde é
`test_segurar_para_religar_nao_abre_a_steam`: os dois holds no mesmo teste, de
propósito — 5.038 ms (o religamento) e 200 ms (o toque). Um teste que só
afirmasse "o hold longo não dispara" passaria com a cura virando *"o botão PS
parou de funcionar"*; um que só afirmasse "o toque dispara" passaria com a cura
arrancada. Juntos, mordem dos dois lados, e a mensagem imprime os dois `held_ms`
lado a lado.

**Com a cura no lugar:**

```
$ .venv/bin/python -m pytest tests/unit/test_hotkey_ps_solo_gate.py -q
..............                                                           [100%]
14 passed in 0.24s
```

**Com a cura ARRANCADA** (removido o bloco `if teto_ms > 0 and held_ms > teto_ms`
de `_observe_ps_solo`, e nada mais):

```
$ .venv/bin/python -m pytest tests/unit/test_hotkey_ps_solo_gate.py -q
E       AssertionError: o gesto de RELIGAR o controle abriu a Steam: hold de
        5038.2 ms passou pelo teto de 700 ms (o toque humano de comparação é
        200.0 ms)
E       assert (['solo'] == []

FAILED tests/unit/test_hotkey_ps_solo_gate.py::test_segurar_para_religar_nao_abre_a_steam
FAILED tests/unit/test_hotkey_ps_solo_gate.py::test_o_hold_longo_nao_arma_o_proximo_toque
FAILED tests/unit/test_hotkey_ps_solo_gate.py::test_a_recusa_do_hold_longo_vai_para_o_journal
FAILED tests/unit/test_hotkey_ps_solo_gate.py::test_as_tres_saidas_do_botao_tem_eventos_distintos
4 failed, 10 passed in 0.26s
```

E a cura foi devolvida: os 14 voltaram a passar (primeira saída acima, rodada
depois da devolução).

Os outros nove casos novos guardam as bordas que a cura poderia estragar: o release
**exatamente** no teto ainda é toque; `teto=0` restaura o comportamento antigo
inteiro; recusar um release não deixa estado sujo para o toque seguinte; com o
long-press LIGADO quem suprime continua sendo ele; o default fica **entre** as
duas durações medidas (um teto que não separasse nada passaria nos outros
testes); e a env ilegível cai no default em vez de desligar o teto por acidente.

**Portões.** `bash scripts/portoes.sh --rapido` → **TODOS VERDES, 19 portões**
(depois de `git add -A`, que é o que os torna não-cegos ao arquivo novo).
`pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q` → **35 passed**.
`mypy src/hefesto_dualsense4unix/integrations/hotkey_daemon.py` → **Success**.

## O que NÃO verifiquei

- **O aparelho.** Não toquei a bancada. Que um religamento real de DualSense
  produza um hold de ~5 s no `_observe_ps_solo` vem do journal de 02/08 citado
  na sprint, não de medição minha de hoje. Se o gesto de religar, em algum
  firmware, produzir um press/release **curto** em vez de um hold longo, esta
  cura não o pega — e o sintoma dela voltaria idêntico.
- **Se 700 ms é o número certo PARA ELA.** É o número que a sprint recomenda e
  que separa as duas durações medidas. O toque dela nunca foi cronometrado: se
  ela clicar o PS com mais de 700 ms de hábito, o botão vai parar de responder
  para ela e o sintoma será o oposto do curado. O `teto_ms` no journal existe
  justamente para isso aparecer em uma leitura, não em duas semanas.
- **O daemon vivo.** Não reiniciei nada nem li journal de execução real. A cura
  é no `HotkeyManager`, que o `subsystems/hotkey.py` instancia no start — logo
  ela só vale no **próximo start do daemon**, e não conferi isso rodando.
- **A suíte inteira.** Não rodei `pytest` sem argumento (ela cria nós uinput de
  verdade; é de quem coordena, no fim). Rodei
  `pytest tests/unit -k "hotkey or ps_solo or ps_button or steam_launcher or gamemode"`
  → **1 failed, 102 passed** (a falha está no bloco abaixo). Testes fora desse
  filtro que dependam de um release longo do PS eu não vi. Os arquivos que
  mencionam `ps_solo` são cinco, e os cinco estão dentro do filtro:
  `test_daemon_reload.py`, `test_gamemode_combo_wip.py`, `test_hotkey_ps_button.py`,
  `test_ps_preso_01_audio_lido_como_botao.py` e o meu.
- **O texto do README.** `README.md:156` já diz *"PS (toque curto) | abre a Steam
  (configurável)"* — ficou **verdadeiro** com esta cura, então não mexi. Não
  conferi se alguma outra página descreve o gesto sem teto.

## O que sobrou para o próximo

### 1. UM TESTE-MURALHA VERMELHO, e ele não é meu para consertar (R-A)

```
FAILED tests/unit/test_gamemode_combo_wip.py::test_ps_long_press_zero_nao_alterna_em_hold
E   AssertionError: PS solo deve abrir a Steam no release
E   assert [] == ['steam']
[info] ps_solo_ignorado_hold_longo  held_ms=2050.0  teto_ms=700
```

Ele segura o PS por **2.050 ms** e exige que o release abra a Steam. O propósito
declarado dele é outro — *"long-press desligado não deve alternar no hold"* —,
e essa metade continua passando. A segunda asserção trava a **ausência de teto**,
que é exatamente o que a sprint mandou encarar: *"Se algum exigir que toda
duração dispare, ele É a regressão — encare-o, não afrouxe a cura."*

**Não o editei porque o arquivo não está na minha posse** e a R-A é lista
fechada. A correção é de uma linha, e o dono dela é quem integra:

```python
# tests/unit/test_gamemode_combo_wip.py:92-94
hm.observe({"ps"}, now=2.0)   # segurou 2s   → passa a 0.2 (dentro do teto)
...
hm.observe(set(), now=2.05)   #              → passa a 0.25
assert calls == ["steam"], "PS solo deve abrir a Steam no release"
```

Baixar o hold de 2 s para 0,2 s preserva o que o teste testa (o long-press
desligado não alterna nada durante o hold) e para de travar o teto. **A
alternativa — `config=HotkeyConfig(ps_long_press_ms=0, ps_toque_curto_teto_ms=0)`
— é pior:** desligaria a cura dentro do teste e deixaria a muralha de pé.

Este arquivo não está em nenhum portão do `portoes.sh` (só na camada `suite`),
então o `--rapido` fica verde e **isto só aparece na suíte de quem coordena.**

### 2. E3 — sem `wmctrl`, "trazer para frente" continua virando "abrir"

Ficou de fora por ordem: é decisão de produto, e a própria sprint recusa
escolher. **Conferido hoje nesta árvore:**

```
$ grep -c wmctrl install.sh packaging/debian/control scripts/doctor.sh
install.sh:0
packaging/debian/control:0
scripts/doctor.sh:0
```

O `wmctrl` é usado só em `integrations/steam_launcher.py`
(`WMCTRL_BINARY = "wmctrl"`), não está instalado na máquina dela, ninguém o
declara e ninguém o confere. Sem ele o refoco cai em `refocus_fallback_spawn`.

**O que a minha cura muda e o que ela NÃO muda.** Ela mata o gatilho ACIDENTAL
(o religamento), que era metade do dano. A outra metade continua viva: quando
ela dá um toque curto de verdade com a Steam **já aberta**, o produto abre uma
**segunda** janela em vez de trazer a primeira para a frente. As duas saídas
honestas estão na E3 da sprint, e a recomendação de lá é a **(b)** — usar os
backends de janela que o projeto já tem (`integrations/window_backends/`, com
xlib, portal e wlrctl) —, porque o `wmctrl` é X11-only e ela roda
COSMIC/Wayland: declarar dependência que não funciona no compositor dela é
dívida nova.

### 3. O teto não chega ao `DaemonConfig`, e o motivo é de posse

O ajuste de hoje é por env var e por argumento de `HotkeyConfig`. Fazê-lo virar
campo de `DaemonConfig` — o "mesmo lugar" literal do `ps_long_press_ms` —
exigiria **dois arquivos fora da minha posse**: `daemon/main.py` (que lê a env e
constrói o `DaemonConfig`) e `daemon/subsystems/hotkey.py:699` (o único lugar
que constrói o `HotkeyConfig` a partir do `daemon.config`, e que está na minha
lista de NÃO TOCA, é da L3-A).

**Acrescentar o campo só em `lifecycle.py` seria pior que não acrescentar:** ele
não teria quem o transportasse até o `HotkeyManager` e nasceria config MORTA —
o defeito mais caro desta casa, *a casa sabe e o produto não faz*. Por isso
`daemon/lifecycle.py` ficou intocado apesar de estar na minha posse.

**E há um segundo preço, medido:** `tests/unit/test_doc_verdade_02_contagens_derivadas.py`
ancora que o `DaemonConfig` é construído com **quatro** parâmetros exatos e
exige que três páginas (README, ADR-016 e o sprint DOC-VERDADE-02) mudem a frase
*"com quatro parâmetros"* junto. Um quinto campo custa esse conjunto inteiro.
Quem quiser o campo, pague os dois preços de uma vez — não meio.

### 4. Não há superfície na interface para o teto

Nem deveria haver, pela recomendação (a) da sprint: é calibração, não escolha
dela. Fica registrado para que ninguém a invente por engano.

### 5. Não é isto que faz o controle cair

Esta frente cura a **reação** ruim à queda, não a queda. A queda é a
`BT-QUE-NAO-CAI-01`, e a sprint já refutou (pela ordem dos milissegundos no
journal) a hipótese inversa de que o `ps_solo` causasse a queda. Quem inverter
vai mandar a cura para o lugar errado.
