# SISTEMA-STEAM-01 · dois cliques mortos ganharam dono, e o pior tique das dez abas caiu 71×

Árvore: `hefesto-voo/SISTEMA-STEAM-01-C-SISTEMA-STEAM-01`, branch
`voo/SISTEMA-STEAM-01-C-SISTEMA-STEAM-01`. Nasceu em `3f6855a6` e foi
**adiantada DUAS vezes** — para `f0811a23` antes da primeira linha (a contagem
do cabeçalho que voltava zerada; sem ela a 09 sairia com `0 USB · 0 BT`) e para
`6454caa1` no fecho, para herdar as três coisas que a costura pediu.

---

## 0. O ESTADO, EM UMA LINHA

**O tique da 09 caiu de 1.341 ms para 18,6 ms** · **dois botões que estavam
mortos respondem, clicados no produto vivo** · **a frase do exame parou de
mandar clicar num botão que não existe** · **as duas linhas do Perfil de
Bateria deixaram de ser literal** · **quinze mordidas coladas** · **42 dos 44
portões verdes**, e os dois vermelhos são registro que falta, não código:

* **`paridade-gtk-html`** — o CSV é o DONO do fato, o fato mudou, e o arquivo
  está no meu `nao_toca` (a sprint manda RELATAR). **O diff, linha a linha,
  está na §7.2 e na §10 — pronto para colar.**
* **`desenho-aprovado`** — chegou vermelho no rebase de fecho, da leva dos
  gatilhos, e o texto que o fecha já está escrito por quem mediu. **§14.**

**E DOIS CASOS DE `test_steam_input_ponteiros.py` ficam VERMELHOS de
propósito** — é a consequência da cura que a costura pediu, o arquivo não é da
minha posse, e o diff que os fecha já está escrito na §6.1 da `GTK-2`. Ver §12.

**O `ruff` chegou VERMELHO na base `f0811a23`**, por um nome de teste que a
costura escreveu. Curado com uma letra; ver §8.

---

## 1. O TIQUE DE 1.329 ms — MEDIDO, DIAGNOSTICADO E CURADO

### O número, antes e depois

```
ANTES   custo do tique: mediana 1,37 ms · max 1.341,29 ms · teto 100 ms
        custo do IPC:   mediana 0,93 ms · max 1.150,41 ms
        oito tiques lentos em 100 · 8 tiques pulados pelo custo do anterior
        100 tiques levaram 15,2 s de relógio (deviam levar 10)

DEPOIS  custo do tique: mediana 1,41 ms · max 18,63 ms · teto 100 ms
        custo do IPC:   mediana 0,98 ms · max 8,25 ms
        ZERO tique lento · 100 tiques em 10,1 s
```

As irmãs, medidas no mesmo dia para calibrar: **01-jogar max 13,30 ms** ·
**02-controles max 35,11 ms**. A 09 estava sozinha na casa dos segundos.

### O que era, e a hipótese que caiu

O comentário de `_faixa_lenta` já suspeitava do prontuário e culpava **o disco**:
*"enquanto ele varre, o disco fica disputado"*. A cura de 03/09 tirou a
varredura do laço do GTK e a pôs numa thread — e o tique continuou em 1,3 s.

**Medição que fecha a causa** (arranquei a thread e devolvi):

| | max do tique | max do IPC |
| --- | --- | --- |
| com a varredura de 7 s | 1.323 ms | 1.316 ms |
| sem ela | **19,41 ms** | 7,95 ms |

O custo está **dentro do `t_ipc`**, que mede `mesa_viva.estado_do_daemon()` — um
round-trip de socket que o daemon responde em ~1 ms. Não é o disco e não é o
daemon: é o **interpretador**. Os 7 s são Python puro abrindo milhares de
arquivos pequenos; cada volta solta e retoma o GIL, e a thread principal —
que soltou o GIL para esperar o socket — fica na fila atrás dela por mais de um
segundo. A thread não bastava porque o problema nunca foi *onde* o trabalho
roda: é *quanto* trabalho existe.

### A cura: os 7 s não eram necessários

`medir_prontuario_dos_jogos()` (`daemon_actions.py:820`) é a composição de dois
donos — `prontuario_dos_jogos.levantar_censo()` e
`interpretar_prontuario_dos_jogos(censo)`. O `examinar=True` do censo abre o
executável de **cada jogo instalado** para descobrir a API de entrada, e é ele,
sozinho, que leva os 7 s.

**O único campo que esta tela lê do censo é `ponte_divergente`, e ele não
encosta na varredura.** Quem diz isso é o docstring do dono
(`prontuario_dos_jogos.py:519`): *"O carimbo não depende de ler executável
nenhum"*. `ponte_divergente` é *"há carimbo de ponte confirmada"* × *"a lista de
exceções de hoje"* — os dois lidos do disco em milissegundos. A `evidencia`,
que é tudo o que os 7 s produzem, alimenta `NAO_SEI` e `IMPEDIDO`, e nenhum dos
dois chega a esta aba.

**Medido nesta máquina, com o veredito conferido nas duas formas:**

```
examinar=False     18,3 ms · 12,0 ms   22 jogos   divergentes=0   veredito=None
examinar=True   6.911,5 ms · 6.897,2 ms 22 jogos   divergentes=0   veredito=None
medir_prontuario_dos_jogos()  6.909,9 ms -> None
```

**380× mais barato, mesma resposta.**

`_perguntar_o_prontuario` passou a compor os dois donos com `examinar=False`.
Não é um segundo dono do fato: é o mesmo par, com o parâmetro que esta tela
pode pagar — e `interpretar_…` é PURA de propósito, porque *"a leitura do disco
é lenta o bastante para nunca rodar na linha do GTK"*. `daemon_actions.py` está
no `nao_toca`; o diff de uma linha que devolveria o dono único está na §7.

---

## 2. OS DOIS CLIQUES MORTOS — E ELES FORAM CLICADOS

O CSV registrava a mesma frase para os dois: *"Botão presente, sem dono. Clique
morto."* Os dois seguem o mesmo desenho, e ele é o que o rótulo de cada um
promete:

```
clique 1 → MEDE (e não muda nada) → escreve o achado no painel → ARMA
clique 2 → AGE, com o que o clique 1 mediu → escreve o recibo no painel
```

**O clique 1 é read-only de propósito**, e isso não é zelo: é o que faz a
`--prova-gesto` desta casa poder clicá-los sem mexer na máquina dela. E é
também o que o rótulo pede — o `title` do Vulkan promete TRÊS tempos
(*"Mostra, jogo por jogo, (…) e só então tira"*) e o dos consertos só pode
contar quantos jogos tinham Steam Input se contar ANTES de desligá-lo (a D-33,
que a janela antiga já paga em `daemon_actions.py:1148`).

### O CLIQUE, no produto vivo — WebKit do piloto, `--oculta`, daemon dela de pé

**"Refazer os consertos automáticos"** (`--prova-clique "refazer-consertos"`):

```
[gesto] 09-sistema.html · refazer-consertos → aplicado, e a resposta foi para a tela
```

O botão passou a dizer **"Confirma?"** e o painel "Detalhes técnicos" mostra:

```
Vou rodar 2 conserto(s) automático(s), sem pedir senha e sem fechar nada.
  Nenhum jogo com Steam Input ligado fora da sua lista de exceções. Nada a desligar aí.
  Clique de novo para confirmar.
```

**"Tirar a sobreposição Vulkan"** (`--prova-clique "procurar-camadas"`) — e este
é o censo REAL do disco dela:

```
    EOSOverlayVkLayer-Win64.json — ligada
    EOSOverlayVkLayer-Win32.json — ligada

O que estiver ligado acima entra na frente de cada quadro que o jogo desenha. Já
medimos tirar isso no Sackboy e o engasgo continuou

Clique de novo para TIRAR.
```

**O tempo do meio existe, e a tela dele já existia.** O que segurava este botão
era *"uma tela que ainda não existe. É desenho, e desenho é dela"* — e o painel
de registro desta mesma faixa é onde esta aba já põe o que `ver-plugins`,
`ver-detalhes` e `refazer-proton` respondem. Zero pixel novo, zero decisão de
desenho.

As duas fotos estão em `<scratchpad>/SISTEMA-STEAM-01/clique-consertos.png` e
`clique-camadas.png`.

### O que cada gesto reusa, e nada é reescrito

| | o handler da janela (não usado) | o ATO (chamado) |
| --- | --- | --- |
| `refazer-consertos` | `on_storm_fix_safe:1218` — toast + `GLib.idle_add` | `medir_jogos_com_steam_input`, `_find_repo_file`, `format_fix_safe_result` |
| `procurar-camadas` | `on_camadas_engasgo:2086` — o diálogo | `camadas_vulkan.censo`, `pastas_compatdata`, `curar_todos`, `frase_do_censo`, `frase_do_resultado` |

**Os botões seguem o que existe**, que é a regra escrita em
`_build_camadas_dialog` (*"Botão que aparece e não faz nada ensina que a tela é
enfeite"*). Aqui o botão é um só, e quem segue o que existe é o **armar**: sem
nada a tirar e sem nada a devolver, o clique 1 mostra o achado e **não arma**.
O painel do clique 1 diz qual dos dois atos o clique 2 vai fazer.

### A DÍVIDA QUE FICA, e ela é do `SEM_MOTOR`

`SEM_MOTOR` foi de três para **um**. O que sobra é `restaurar-de-fabrica`, e ele
**não espera motor** — o caminho está medido desde 04/09. Espera a linha
`("09-sistema.html", "restaurar-de-fabrica")` em `hefesto_vivo.PERIGOSOS`, e
esse arquivo está no meu `nao_toca`. Sem ela, `test_todo_gesto_que_escreve_esta_na_lista`
reprova — e com razão: a régua de clique restauraria o perfil DELA para provar
que sabe clicar.

---

## 3. O PERFIL DE BATERIA DEIXOU DE SER LITERAL

*"O teto alcança"* e *"Ainda sem teto"* eram derivadas de `LINHAS_DO_TETO` **no
instante em que alguém rodava o gerador** e ficavam cravadas no HTML. No dia em
que os "Gatilhos" ganharem ponto de aplicação no daemon, a tela dela continuaria
dizendo que o teto não os alcança — e ninguém veria.

Agora as duas têm `data-campo` e saem do dono a cada tique
(`a09_sistema.frases_do_teto()`).

**O BLOQUEIO QUE O CSV DECLARAVA ERA EVITÁVEL.** A linha 329 diz, com todas as
letras: *"O BLOQUEIO É DE UM NOME (…) `aba_sistema.ENDERECOS` tem UM endereço
(`bateria-frase`) para DUAS linhas (…) Falta uma segunda chave lá
(`bateria-sem-teto`), que é a camada do produto e território de outra frente"*.
**Não faltava.** O segundo endereço se DERIVA do primeiro
(`bateria-frase-pendentes`), que é a mesma regra do `-razao` do botão cinza e do
`-g` do glifo, já em produção nesta aba desde 03 e 04/09: as duas linhas leem o
MESMO dono, e o sufixo diz qual metade dele está sendo escrita. Nenhuma linha
nova no contrato, nenhuma frente esperando outra.

**E o apelido da tela ganhou um dono só.** `APELIDO_NA_TELA` (o encurtamento de
"Barra de luz" → "luz", pedido dela em 01/09) morava no gerador e passou a ter
DOIS leitores — o gerador escreve o desenho, o pacote escreve o valor vivo.
Digitado nos dois, ele se afastaria no dia em que um mudasse, que é como a fita
viva morreu calada em 27/08. Ele mudou de casa para o pacote, e o gerador o lê
de lá por `aba09._constantes` — sem importar nada.

**O que fica declarado:** as quatro chaves (`bateria-frase`, `-g`,
`-pendentes`, `-pendentes-g`) entraram em `ESPERA_A_PUBLICACAO`, porque a
bancada as tem e a página publicada não — publicar é ato dela. E
`NAO_CHEGA_NA_TELA` ficou **vazia**: a única entrada dela era `bateria-frase`,
declarando uma ausência que acabou.

---

## 4. O ACHADO DA COSTURA, APLICADO: `aba09.py` escrevia a bancada no import

Aplicada a cura que o coordenador mediu na `aba05`: as instruções finais do
módulo (`monta(...)`, o remendo da fita e o `print`) desceram para
`escrever_a_bancada()`, chamada só do `if __name__ == "__main__":`.

**Provado nos dois sentidos:**

```
md5 antes           d12bc4f2310b2d87fe549bd96f5789de
import aba09        → "import OK, nada escrito"
md5 depois          d12bc4f2310b2d87fe549bd96f5789de   ← não mexeu
python3 aba09.py    → "09-sistema: OK, 59 divs · …"
md5 depois          d12bc4f2310b2d87fe549bd96f5789de   ← escreveu, idêntico
```

**As réguas 1 a 9 continuam no import, e é de propósito:** elas leem `MIOLO`,
que é memória, e são o que faz `import aba09` reprovar um desenho quebrado sem
tocar em disco nenhum. O que desceu foi só quem ESCREVE.

**O diff que amplia o glob da mordida** — `tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py`
não está na minha posse:

```diff
-  aba0[45].py
+  aba0[4569].py
```

(ou o glob que cobrir as oito, se a costura já tiver curado as outras.)

---

## 5. QUAL MORDIDA PROVA CADA CURA — as doze, executadas

Cada uma: arranquei a cura, rodei a régua, colei a saída, devolvi a cura.

```
===== A · o prontuário volta a varrer os executáveis (o tique de 1,3 s) =====
E AssertionError: a releitura voltou a varrer os executáveis de todo jogo
  instalado. Ela pediu o censo com {}, e o `examinar=True` é o que fez o tique
  da 09 custar 1.329 ms num teto de 100 — treze vezes o teto, com a mesa parada.

===== B · o clique 1 do consertos deixa de perguntar e AGE =====
E AssertionError: o primeiro clique RODOU os scripts. Ele tem de MEDIR e
  perguntar — é o consentimento em dois cliques que ela escolheu em 03/09/2026.
E assert not [['bash', '…/disable_steam_input.sh', '--apply-quiet'], …]

===== C · CONSERTOS fica vazio (o botão que diz pronto sem rodar nada) =====
E AssertionError: - Correções aplicadas (sem senha). Steam Input: a correção
    rodou sem erro …
  + Correções aplicadas (sem senha). A cura anti-storm …

===== D · um nome de script errado em CONSERTOS =====
E AssertionError: o localizador do produto achou 1 dos 2 scripts de `CONSERTOS`.
  Um nome errado aqui é um botão que diz 'Correções aplicadas' sem ter rodado nada.

===== E · o clique 1 das camadas TIRA em vez de mostrar =====
E AssertionError: o primeiro clique TIROU. Ele tem de olhar e perguntar.

===== F · o botão arma mesmo sem nada a fazer =====
E AssertionError: o botão ficou armado sem ter o que fazer no segundo clique.

===== G · o segundo clique crava `religar=False` e ignora o censo =====
E AssertionError: (False, True, [False]) · assert [False] == [True]

===== H · o portão do jogo aberto sai =====
E Failed: DID NOT RAISE RuntimeError

===== I · o `procurar-camadas` volta a `SEM_MOTOR` com dono =====
E AssertionError: 'procurar-camadas' está declarado em `SEM_MOTOR` E tem gesto.
  Se ele ganhou dono, TIRE a declaração.

===== J · a frase do teto volta a ser CRAVADA =====
E AssertionError: os 'Gatilhos' ganharam ponto de aplicação no produto e a linha
  'O teto alcança' continuou dizendo 'vibração'. O valor não veio do dono — veio
  do instante em que alguém rodou o gerador.

===== K · o pacote deixa de escrever as quatro =====
E AssertionError: o pacote não escreve em 'bateria-frase'. O endereço está na
  bancada e ninguém o preenche — a linha volta a mostrar o literal do desenho.

===== L · o gerador volta a DIGITAR o apelido =====
E AssertionError: o apelido da tela divergiu entre o gerador e o pacote.
```

**E DUAS MORDIDAS FORAM REESCRITAS PORQUE NÃO MORDIAM.** Vale registro, porque
as duas são a forma de defeito que esta casa persegue:

1. **A L, na primeira escrita, mudava o DONO** (o apelido no pacote) — e os dois
   lados o liam de lá, então concordavam e a régua passava. Mordida que move a
   fonte única não testa a unicidade: ela a confirma. Refeita contra o
   GERADOR, dando-lhe uma cópia própria de novo, ela morde.
2. **A régua J reprovou a CURA na primeira escrita**, exigindo `"Gatilhos"` com
   maiúscula. A frase do produto é em CAIXA DE FRASE (regra dela, 30/08), então
   o valor certo é `'Vibração e gatilhos'`. Uma régua que exigisse a maiúscula
   estaria cobrando exatamente a caixa que ela mandou tirar — é o erro de forma
   das onze réguas de 26/08. Comparação passou a ser sem caixa.

**E UMA RÉGUA ALHEIA MEDIA A LISTA DE ONTEM.**
`test_o_que_espera_a_publicacao_esta_declarado_nos_dois_sentidos` calculava o
"o que falta publicar" como uma lista CRAVADA (os três `-razao` do botão cinza),
não como uma pergunta ao disco. Quando as duas linhas do teto entraram na
bancada, ela disse que o que falta na publicada *"é `[]`"* — sobre três
endereços que faltavam de verdade. A conta passou a ser a pergunta inteira: *o
que o pacote EMITE, o desenho TEM e a publicada ainda NÃO tem?*

---

## 6. UM FATO FALSO NA MINHA POSSE, e ele desprotege um botão destrutivo

O docstring de `refazer_proton` afirmava: *"NÃO É CLICADO POR RÉGUA NENHUMA:
`("09-sistema.html", "refazer-proton")` já está em `hefesto_vivo.PERIGOSOS`
desde antes de ele ter dono"*.

**Ele não está.** Medido com `print(sorted(hefesto_vivo.PERIGOSOS))`: a entrada
foi apagada de lá, e o comentário que sobrou no arquivo deixa a linha
justamente comentada. A `--prova-gesto` clica cada gesto **uma vez por
execução** (`_proximo_da_fila`), então os dois cliques o protegem numa volta;
**duas execuções dentro de `segundos_para_confirmar` o disparam de verdade**,
com o `config.vdf` dela do outro lado.

O fato falso foi substituído no meu arquivo. A cura é uma linha em
`hefesto_vivo.py`, que está no meu `nao_toca` — o diff está na §7, junto com as
duas irmãs que esta sprint acrescentou.

---

## 7. O QUE ESTÁ FORA DA MINHA POSSE — os diffs, prontos para a costura

### 7.1 `src/hefesto_dualsense4unix/interface/hefesto_vivo.py` — `PERIGOSOS`

Três linhas, e a terceira é a que desbloqueia o `restaurar-de-fabrica`:

```diff
 PERIGOSOS = {
     ("09-sistema.html", "desligar"), ("09-sistema.html", "reiniciar"),
+    # OS TRÊS QUE A `SISTEMA-STEAM-01` PRECISA — 06/09/2026.
+    # O `refazer-proton` já se DIZIA protegido desde 03/09 e não estava: a
+    # entrada tinha sido apagada e o docstring do gesto continuou afirmando.
+    # Os dois de baixo ganharam dono nesta sprint. Os três pedem dois cliques,
+    # o que os protege numa volta da prova — mas duas execuções dentro dos
+    # segundos do consentimento disparam o segundo clique de verdade.
+    ("09-sistema.html", "refazer-proton"),
+    ("09-sistema.html", "refazer-consertos"),
+    ("09-sistema.html", "procurar-camadas"),
     ("09-sistema.html", "autostart"),
```

**E a quarta, que ainda não pode entrar:** `("09-sistema.html",
"restaurar-de-fabrica")` só faz sentido no MESMO commit que der dono ao gesto —
sozinha, ela reprova `test_a_lista_nao_protege_gesto_que_nao_existe`. Quem
fizer as duas coisas juntas fecha o último `SEM_MOTOR` desta aba.

### 7.2 `docs/data/paridade-gtk-html.csv` — TRÊS LINHAS, e o portão está VERMELHO por elas

**Este é o único portão vermelho da minha branch**, e ele está certo: o CSV é o
DONO do fato, o fato mudou, e o arquivo está no meu `nao_toca` (a sprint manda
RELATAR — é da `PARIDADE-REMEDIR-01`).

| linha | o que a régua diz | o que medi |
| --- | --- | --- |
| **329** — Perfil de Bateria, a tabela de consequências | `divida-fechada`: `data-campo="bateria-frase"` APARECEU no `mockup/09-sistema.html`; o CSV diz `FALTA_NO_HTML` | **A dívida fechou pela METADE, e o veredito honesto é `DIFERENTE`, não `IGUAL`.** As duas linhas de estado passaram a ser VIVAS e lidas do dono; a GTK tem uma `Gtk.Grid` de **5 linhas × 3 perfis** e o HTML tem **2 linhas × o perfil escolhido**. A tabela cheia não cabe nos 154px do bloco (o portão do gerador exige que ele acabe no mesmo `y` do irmão), então ela é **decisão de desenho dela**. E o `porque` desta linha precisa perder a frase *"Falta uma segunda chave lá (`bateria-sem-teto`)"*: **não falta** — o segundo endereço se deriva, e está em produção. |
| **333** — Exame, o achado "prontuário dos jogos" | `sinal-sumiu`: `_daemon.medir_prontuario_dos_jogos()` não está mais no pacote | O sinal mudou de nome porque a porta mudou. O sinal de hoje é **`interpretar_prontuario_dos_jogos`**, e o veredito continua `IGUAL` — a feature é a mesma, e ficou 380× mais barata. O `html_faz` desta linha precisa trocar *"ele leva **7,1 s** nesta máquina"* por *"12–18 ms, porque o censo é pedido com `examinar=False`"*, e o `porque` ganha o par de medições da §1. |
| **338** — Steam, "Refazer os consertos automáticos" | `divida-fechada`: `fix_wireplumber_default_source` APARECEU no pacote | **A dívida fechou.** O `html_faz` deixa de ser *"Botão presente, sem dono. Clique morto."* e passa a ser o que a §2 mostra, com a foto do clique. Veredito: `IGUAL` — os dois lados rodam os mesmos dois scripts, medem os jogos ANTES e usam o mesmo `format_fix_safe_result`. A diferença é o canal do recibo (toast lá, painel de registro aqui). |

**Uma quarta linha (253, `[07-lancadores]` Vulkan) chegou a reprovar e eu a
curei sem tocar no CSV:** o sinal `on_camadas_engasgo` sumira porque eu apaguei
a entrada de `SEM_MOTOR` que o citava. A citação voltou onde ela pertence — o
docstring do gesto novo, nomeando o handler cujo ato ele reusa. **Esta linha
253 também merece remedição pela `PARIDADE-REMEDIR-01`:** ela diz
`html_faz = "O BOTÃO EXISTE E ESTÁ MORTO"`, e ele não está mais.

### 7.3 `src/hefesto_dualsense4unix/app/actions/daemon_actions.py` — o dono único do prontuário

Hoje esta aba compõe os dois donos porque `medir_prontuario_dos_jogos` não tem
por onde receber o parâmetro. Uma linha devolve o dono único:

```diff
-def medir_prontuario_dos_jogos() -> tuple[str, str] | None:
+def medir_prontuario_dos_jogos(*, examinar: bool = True) -> tuple[str, str] | None:
@@
-        censo = prontuario_dos_jogos.levantar_censo()
+        censo = prontuario_dos_jogos.levantar_censo(examinar=examinar)
```

**E vale medir se o `True` ainda é o padrão certo:** o outro chamador é o
`_refresh_storm_diag` da janela antiga (`:1157`), que consome o MESMO
`interpretar_prontuario_dos_jogos` e portanto o mesmo `ponte_divergente`. Se a
medição confirmar, os 7 s saem do produto inteiro, não só desta aba — e o
comentário de lá que diz *"leva ~1 s"* já está derrubado por duas medições
independentes.

### 7.4 `tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py`

O glob da mordida do gerador — §4.

---

## 8. ARQUIVOS ALHEIOS QUE TOQUEI, e por quê

Nenhum deles está no meu `nao_toca`; nenhum está na minha `posse`. Declarados um
a um, no molde da `ONDA5-09-02`:

| arquivo | o que mudou | por quê |
| --- | --- | --- |
| `tests/unit/test_a_09_sistema_sai_do_desenho.py` | o dublê do prontuário passou a ser `levantar_censo` e a cobrar `examinar=False` | a porta mudou; um dublê na porta velha daria VERDE sobre uma função que ninguém chama mais |
| `tests/unit/test_a_aba_09_sistema_fecha_as_linhas.py` | `esperados` deixou de ser lista cravada e virou pergunta ao disco | ela media a lista de ontem — ver §5 |
| `tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py` | UMA letra: `test_a_mesa_do_DESENHO_…` → `test_a_mesa_do_desenho_…` | **o `ruff` está VERMELHO NA BASE** — ver abaixo |

**O `ruff` chega VERMELHO em `f0811a23`, e não é meu.** O portão reprova com
`N802 Function name 'test_a_mesa_do_DESENHO_tambem_publica_a_chave_crua' should
be lowercase`, num arquivo que a própria costura escreveu e que eu não toco por
outro motivo. Conferido: o nome está assim no `git show f0811a23:`, e a função
não é citada em lugar nenhum além da própria definição. Renomeei — é uma letra,
sem alcance —, e fica declarado aqui para quem costurar não levar a mudança de
surpresa. **É o mesmo arquivo cujo glob a §4 pede para ampliar**, então as duas
edições chegam juntas.

---

## 9. O QUE **NÃO** VERIFIQUEI, E O QUE **NÃO** CONSTRUÍ

### Não verifiquei

* **O segundo clique dos dois botões, no produto vivo.** Cliquei os dois no
  WebKit com o daemon dela de pé, e parei no primeiro tempo **de propósito**: o
  segundo roda `disable_steam_input.sh --apply-quiet` e
  `fix_wireplumber_default_source.sh --install` na máquina dela, e mexe no
  `system.reg` dos prefixos. Isso é bancada, e a bancada é dela. O segundo
  clique está provado por régua, com o `subprocess.run` e o `curar_todos`
  dublados (mordidas B, C, E, G, H).
* **A publicação.** `interface/paginas/09-sistema.html` está no `nao_toca` e
  publicar é ato dela. O que ela vê hoje continua com as duas linhas do teto
  congeladas — o valor está CERTO hoje, e a divergência está declarada em
  `mockup/DIVERGENCIAS.md`.
* **A suíte inteira.** Rodei o escopo da aba 09 e as réguas vizinhas — doze
  arquivos, **186 verdes** (33 deles novos). A suíte é de quem coordena e roda
  no fim.
* **A bancada** (`scripts/bancada.sh`): **não foi reservada, e não precisou**.
  Nenhum caminho meu parou o serviço, chamou `systemctl` ou escreveu no
  aparelho. O que os cliques tocaram no disco dela foi **leitura**: o
  `localconfig.vdf` e os `compatdata`.
* **`aba08.py` e `aba10.py` reproduzindo a bancada.** Os dois reprovam
  `test_os_dez_geradores_rodam.py::test_o_gerador_reproduz_a_bancada` — e
  **reprovam na base, antes de eu tocar em nada** (conferido com `git stash`).
  Não são meus e não são da minha posse.

### Não construí (e por quê)

* **"Aplicar aos jogos da Steam"** (Passo 2) e **"Corrigir modo de execução"**
  (Passo 3). Os dois pedem um `data-gesto` NOVO, e `aba09._gesto()` recusa
  qualquer nome que não esteja em `gui/aba_sistema.GESTOS` — arquivo que a
  `GTK-1` está movendo de casa nesta mesma leva (o relatório dela o lista como
  *"FICA e MUDA DE CASA"*). Tocá-lo aqui é conflito garantido na costura.
  **O motor dos dois está pronto e é limpo:**
  `steam_launch_options.apply_wrapper_to_all_games` (preserva as opções
  existentes e deixa backup ao lado de cada arquivo) com
  `format_apply_wrapper_result` e `format_steam_janela_recusa`; e, para o modo
  de execução, `_systemctl` + `ativar_o_servico`, que já moram nesta aba.
  **O segundo tem um custo de desenho que a régua do gerador cobra:** a coluna
  do serviço tem quatro botões (4×34 + 3×6 = 154px) e o Perfil de Bateria mede
  156; um quinto botão a levaria a 194 e o portão das duas colunas irmãs
  reprova. O "Aplicar aos jogos" cabe na coluna **"Preparar os jogos"**, que é
  literalmente o nome da seção e não é medida por aquele portão.
* **A tabela cheia de 5 × 3 e a conta de slots por adaptador** (a outra metade
  do Passo 4). As duas são **decisão de desenho dela**: não cabem nos 154px do
  bloco, e o bloco só pode crescer junto com o irmão. Ver §7.2, linha 329.
* **`restaurar-de-fabrica`** — §2 e §7.1.
* **"Este jogo não funciona"** (a allowlist). A própria sprint manda deixá-la
  para a `STEAM-INPUT-01`: ela aparece duas vezes no CSV e é a MESMA feature.
  Não escrevi uma segunda implementação.

---

## 10. AS LINHAS PARA O CSV DA PARIDADE

Prontas para a `PARIDADE-REMEDIR-01`, com o endereço lido no código:

```
329  veredito: FALTA_NO_HTML -> DIFERENTE
     sinal:    data-campo="bateria-frase"  (mantém; agora PRESENTE)
     html_onde: src/…/interface/pacotes/a09_sistema.py:frases_do_teto
                · src/…/interface/aba09.py:CAMPO_DO_ALCANCE
                · mockup/09-sistema.html (bancada; publicado espera o OK dela)
     html_faz: "Duas linhas de estado VIVAS, lidas de `LINHAS_DO_TETO` a cada
                tique. A GTK tem 5 linhas × 3 perfis; aqui são 2 linhas × o
                perfil escolhido — a tabela cheia não cabe nos 154px do bloco e
                é decisão de desenho dela."

333  veredito: IGUAL (mantém)
     sinal:    _daemon.medir_prontuario_dos_jogos() -> interpretar_prontuario_dos_jogos
     html_faz: trocar "leva 7,1 s … thread própria a cada 5 min" por
               "12–18 ms: o censo é pedido sem a varredura dos executáveis, que
                era 6,9 s e que `ponte_divergente` não lê."

338  veredito: FALTA_NO_HTML -> IGUAL
     sinal:    fix_wireplumber_default_source  (mantém; agora PRESENTE)
     html_onde: src/…/interface/pacotes/a09_sistema.py:refazer_consertos
                · src/…/interface/paginas/09-sistema.html:1206
     html_faz: "Dois cliques: o primeiro mede os jogos com Steam Input e mostra
                no painel de registro; o segundo roda os mesmos dois scripts da
                janela antiga e escreve `format_fix_safe_result`."

253  html_faz: "O BOTÃO EXISTE E ESTÁ MORTO" -> deixou de estar. Ver a linha 338;
                o mesmo desenho de dois tempos, com o censo no painel.
```

---

## 11. O TEXTO PARA `mockup/DIVERGENCIAS.md` — JÁ ESCRITO

A seção `## 09-sistema.html` ganhou a entrada das duas linhas do teto, com a
medição de que **nenhum pixel muda** (os quatro atributos novos estão nos
INVISÍVEIS do `check_o_desenho_aprovado.py`, que compara o que se VÊ — decisão
dela em 01/09) e com o custo da espera dito por inteiro: o valor congelado está
CERTO hoje, e o preço da divergência é futuro.

---

## 12. O DEFEITO VIVO DA COSTURA — a frase mandava clicar num botão que não existe

A `GTK-2` achou e o coordenador confirmou: o `storm_doctor` diz *"clique
'**Consertar problemas conhecidos**' na aba Sistema"*, e na aba Sistema que ela
usa o botão se chama *"**Refazer os consertos automáticos**"*. A frase chega a
essa tela — `a09_sistema._achados()` pinta o `storm_report` —, e é a forma que o
glossário proíbe com todas as letras: *"qualquer frase que mande a pessoa
procurar um botão ou uma janela que não existe"*.

### O ACHADO: a cura proposta não curava

A §6.1 da `GTK-2` propõe trocar o `se_faltar` dos dois `rotulo_do_botao`.
**Medido antes de aplicar, com o glade ainda no disco:**

```
rotulo_do_botao('btn_storm_fix_safe', 'Refazer os consertos automáticos')
  -> 'Consertar problemas conhecidos'      ← o GLADE venceu
rotulos_de_reserva() == {}                  ← a reserva nem chegou a ser usada
```

`rotulo_do_botao` lê o glade PRIMEIRO e a leitura dá certo, então o `se_faltar`
nunca sai. **Trocar o literal só passa a valer no dia em que a `GTK-3` apagar o
XML** — é uma cura para o mês que vem, sobre a tela que ela tem hoje. É a mesma
assinatura dos seis instrumentos falsos de 05/09: *o instrumento respondia sobre
outra coisa que não o produto*.

### QUAL LADO CEDEU, E POR QUÊ — a decisão é minha, e é medida

**Cedeu a FRASE, e ela cedeu MUDANDO DE TELA, não de palavra.** Três medições:

1. **`rotulo_do_botao` é um LEITOR, não um dono.** Ele existe exatamente para a
   frase não virar o segundo dono do rótulo — o comentário dele conta a história
   de 26/08, quando a frase citava um botão renomeado. O defeito não é o que ele
   diz: **é a tela a quem ele pergunta.** Editar o literal seria dar-lhe o
   defeito que ele foi escrito para não ter.
2. **O rótulo da tela nova NÃO é palavra dela, e não está livre para mover.**
   Ele é do mockup, e está sob dúvida DECLARADA desde 29/08 — a
   `MIGRA-SISTEMA-07`, em *"O que é dela decidir"*, põe a ela justamente esta
   pergunta e oferece três opções: *"'Consertar problemas conhecidos' é o nome
   antigo e é honesto; 'Refazer os consertos automáticos' só vale depois de
   haver o que refazer"*. **Ela nunca respondeu.** Mover uma palavra que espera
   a decisão dela, para agradar a uma frase de uma janela que está saindo, é o
   avesso da ordem das coisas.
3. **A janela GTK sai inteira** (`D-0609-GTK-LEVA-INTEIRA`). Alinhar a tela viva
   à que morre é trabalho para desfazer no mesmo mês.

### A CURA: a ordem das fontes

`storm_doctor.rotulo_do_botao` passou a ter TRÊS fontes, nesta ordem:

1. **a página que o produto renderiza** — `_NA_TELA_VIVA` mapeia o id do glade
   para `(página, data-gesto)`, e a leitura é por `data-gesto`, que é o endereço
   que o desenho já tem;
2. **o `gui/main.glade`**, enquanto ele existir;
3. **`se_faltar`**, agora com a palavra da tela nova (a diff (a) da `GTK-2`, que
   deixa de ser futura e passa a ser a rede).

Medido depois: `-> 'Refazer os consertos automáticos'`, `rotulos_de_reserva() ==
{}`. **E a página lida é a PUBLICADA, nunca a bancada:** citar o rótulo do
`mockup/` mandaria clicar num nome que ela só vê depois de publicar.

**O gêmeo está declarado e tem régua.** `a09_sistema._rotulo_do_desenho` lê o
mesmo `<button>` pelo mesmo `data-gesto`; os dois não podem virar um só sem um
ciclo de import (aquele módulo importa este). Quem segura o par é
`test_os_dois_leitores_do_rotulo_nao_divergem`.

### AS TRÊS MORDIDAS

```
===== M · o `_NA_TELA_VIVA` esvazia e o glade volta a vencer =====
E AssertionError: o exame manda clicar em 'Consertar problemas conhecidos' e a
  página que o produto renderiza não tem botão nenhum com esse nome. É a forma
  que o glossário proíbe.

===== N · o gêmeo aponta para outro botão =====
E AssertionError: os dois leitores do mesmo botão discordam: o `storm_doctor`
  lê 'Refazer a fixação do Proton' e o pacote lê 'Refazer os consertos
  automáticos'.

===== O · o `__main__` do `aba09.py` sai =====
E AssertionError: ['aba09.py'] escrevem a bancada dela no nível do módulo:
  qualquer `import` — inclusive a COLETA do pytest — reescreve o desenho
  aprovado no disco, com o estado vivo da mesa dentro.
```

### O QUE FICA VERMELHO, e o diff que fecha

**`tests/unit/test_steam_input_ponteiros.py`, dois casos** — exatamente os que a
costura previu. A saída, colada:

```
E AssertionError: a mensagem "… O que fazer: clique 'Refazer os consertos
  automáticos' na aba Sistema para desligar." manda procurar o botão 'Refazer
  os consertos automáticos', que não existe NA JANELA
E AssertionError: assert None == 'Sistema'
   where None = _aba_do_botao('Refazer os consertos automáticos')
```

**Leia o "NA JANELA": a régua mede a tela que está morrendo.** Ela é o irmão do
mesmo defeito — um instrumento apontado para o glade num dia em que a tela dela
é outra. O diff que a reaponta para as páginas está escrito, palavra por
palavra, na **§6.1 (b) da `GTK-2`**: as três funções de leitura (`_paginas`,
`_aba_do_botao`, `_rotulos_de_botao`) passam a ler os `<button>` de
`interface/paginas/*.html`, e `_ABA_CITADA` passa a casar o nome da aba com o do
arquivo. **O arquivo não é da minha posse e a costura pediu o diff, não a
edição** — ele fica aqui, e os dois casos ficam vermelhos até a costura aplicar.

### OS TRÊS ARQUIVOS QUE TOQUEI POR CAUSA DISTO

| arquivo | o que mudou |
| --- | --- |
| `integrations/storm_doctor.py` | `_NA_TELA_VIVA`, `_rotulo_na_tela_viva()`, a ordem das fontes em `rotulo_do_botao`, e as duas reservas |
| `tests/unit/test_os_leitores_do_glade_tem_dono.py` | `RESERVA_DO_BOTAO` acompanha a tela viva, e nasceu `_sem_fonte_nenhuma()` — **os três casos da reserva passaram a medir o caminho feliz** quando a página respondia e só o `__file__` era desviado. Um caso que diz medir a ausência e mede a presença é o instrumento falso que aquele arquivo inteiro existe para pegar |
| `tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py` | **`"aba09.py"` entrou em `CURADOS`** — a costura pediu o diff, e eu o APLIQUEI em vez de só relatá-lo, porque sem ele a guarda `__main__` que acabei de pôr no gerador não tem régua nenhuma. É uma string numa tupla; se colidir com a costura, a resolução é trivial |

## 13. AS DUAS OUTRAS COISAS QUE A COSTURA MANDOU CONFERIR

* **A `--prova-clique` passou a consultar `PERIGOSOS`.** Herdada no rebase e
  conferida: os dois cliques que fiz (`refazer-consertos` e `procurar-camadas`)
  continuam passando, porque **nenhum dos dois está em `PERIGOSOS` hoje** — e é
  precisamente isso que a §7.1 pede que mude. **Depois que a costura aplicar
  aquelas três linhas, os cliques desta entrega passam a exigir
  `--incluir-perigosos`**, e isso é o certo: o primeiro clique é read-only por
  desenho, mas quem roda é que decide correr o risco do segundo.
* **`scripts/validar-palavra-de-tela.py` LÊ o glade** (`:132`, `:876`) e é
  portão da camada `--rapido`. **A minha medição encostou nisso**: o `:168`
  guarda o par `{"Aplicar correções": "Consertar problemas conhecidos"}`, que é
  o registro da renomeação de 26/08 — e a palavra da direita acabou de deixar de
  ser a que a tela dela mostra. O portão continua VERDE (conferido), porque ele
  cobra a palavra VELHA sumir, não a nova aparecer. **Mas a linha envelheceu:**
  no dia em que o glade sair, esse guarda mede uma tela a menos, calado, e o par
  dele passa a apontar para um rótulo que não existe em tela nenhuma. Não está
  no plano D-19 nem no inventário da `GTK-1`. **RELATADO, não tocado** — é
  vizinhança, não posse.

## 14. TRÊS PORTÕES CHEGARAM VERMELHOS NO REBASE DE FECHO — e dois eu fechei

Medidos com o meu trabalho `git stash`-ado, contra o `6454caa1` puro:

| portão | o que era | o que fiz |
| --- | --- | --- |
| `ruff` | `N806 Variable 'CURADOS' in function should be lowercase`, em `test_a_palavra_do_transporte_tem_um_dono_so.py` — a lista que a costura acabou de criar | renomeada para `curados`. É o **segundo** N806 desta mesma leva e do mesmo arquivo: o primeiro foi o `test_a_mesa_do_DESENHO_…` da §8 |
| `acentuacao` | três `paginas` em `test_as_bancadas_vivas_abrem_a_pagina_que_prometem.py` | a palavra é o **nome da pasta no disco** (`interface/paginas/`) e as duas ocorrências de baixo estão DENTRO de comparações de string — acentuá-las quebraria o teste. O docstring foi reescrito para não citar o caminho, e as duas linhas de código levam `# (noqa-acento) pasta` |
| `desenho-aprovado` | `03-gatilhos.html`: *"o produto está ATRÁS do desenho em 1 página(s), sem declaração"* | **NÃO TOQUEI — e o texto já existe, escrito por quem mediu.** Ver abaixo. |

**O `desenho-aprovado` é uma COSTURA PELA METADE, e o conserto é um `cat`.** O
commit `31542720` (`ONDA5-03-02`) trouxe o desenho novo da 03 e **não trouxe a
declaração**. A frente escreveu o texto e o deixou para a costura — está dito na
§6.1 do relato dela, e o arquivo continua no disco:

```
/tmp/claude-1000/.../scratchpad/C-ONDA5-03-02-DIVERGENCIAS.txt   (2.581 bytes)
    ## 03-gatilhos.html
    - **06/09/2026 — O BOTÃO DE REENVIO SAIU DO DESENHO** (`ONDA5-03-02`, …
```

**Não o apliquei de propósito:** a declaração é o registro de uma medição, e a
medição é dela — copiá-la para o meu commit tiraria o nome de quem responde por
ela. O que eu podia fazer era achar o arquivo e dizer onde está.

*É o mesmo par de metades que o `paridade-gtk-html` cobra de mim: código que
entra sem o registro que o explica.*

**O `# noqa-acento` no fim de uma linha de código tem forma:** `# (noqa-acento)`,
com parênteses. A forma `# noqa-acento: razão` faz o **ruff** avisar
`Invalid # noqa directive` — ele lê o prefixo `# noqa` como diretiva dele. A
árvore tem nove desses avisos hoje, todos de outras frentes; não são erro, mas
são ruído que o portão imprime a cada volta.
