# LEVA-2-C — a tela para de mentir no rótulo e no recibo, e de mandar para a aba errada

BG-TOAST-01 + BG-PALAVRA-02 + BG-NAV-01, fundidas. Três commits em
`voo/LEVA-2-C`.

## O que mudou

### 1. `b9ebd571` — o recibo do "Xbox 360" carrega a mesma ressalva do rótulo

O tooltip do botão foi corrigido em 25/08 pela EMULACAO-UM-DONO-SO-01/E8 e
passou a dizer *"A vibração ainda não foi conferida no aparelho — nem no cabo,
nem no rádio"*. O recibo do **mesmo botão** continuou dizendo *"Gamepad Xbox
360 ligado (vibra no jogo)"* — e quem clica lê o toast, não o tooltip, que
precisa de meio segundo parado em cima do botão para aparecer.

`app/actions/emulation_actions.py`: o toast passa a colar a ressalva de
`RESSALVA_DE_TRANSPORTE["vibracao.rumble.passthrough@dualsense"]` **por
referência à constante**, não por cópia — uma cópia só nesta casa, que é a
regra sobre fato errado. Nenhuma palavra inventada.

Por que R1 não alcançava: ela lê o `gui/main.glade`, e o toast é montado em
Python.

### 2. `2a7ce888` — os cinco rótulos de jargão saem da tela, e a dívida sai junto

As substituições são as que a própria tabela do portão já trazia:

| onde | era | virou |
|---|---|---|
| `main.glade:2974` (Sistema) | `Aplicar correções` | `Consertar problemas conhecidos` |
| `main.glade:2995` (Sistema) | `Travar Proton validado` | `Fixar a versão que funciona` |
| `main.glade:3147` (Emulação) | `VID:PID:` | `Código do fabricante:` |
| `main.glade:3160` (Emulação) | `Gamepads:` | `Controles detectados:` |
| `main.glade:4224` (`footer_box`) | `Restaurar Default` | `Voltar ao padrão` |

O último mora **fora do notebook**, embaixo das onze abas.

As cinco entradas de `DIVIDA_DA_PALAVRA_01` saem no mesmo commit — a lista fica
**vazia**, e o `dict` fica de pé porque o mecanismo continua valendo.

**CORREÇÃO DE FATO:** a entrada de `VID:PID:` dizia que o rótulo morava na aba
**Sistema**. Morava na **Emulação**, no cartão de diagnóstico, ao lado do
`Controles detectados:`. A nota corrigida ficou acima da lista (a entrada que a
carregava foi apagada com o conserto).

Duas frases de `emulation_actions.py` que mandavam clicar em "Aplicar
correções" mudaram junto (`:496` teclado sem device, `:1387` aviso do mic),
senão a tela mandaria clicar num botão que não existe mais.

### 3. `565c28cf` — a dica e a linha de estado apontam para o mesmo lugar, e ele existe

A aba Navegação dizia **duas coisas** sobre o mesmo pré-requisito: a dica
(`main.glade:3932`) mandava *"ver aba Emulação"* para a regra udev, e a linha
de estado da coluna do mouse (`mouse_actions.py:611`) mandava *"abra a aba
Sistema e clique em 'Aplicar correções'"*.

**Medido:** nenhuma aba do produto confere a regra udev do `uinput`, e
`on_storm_fix_safe` (o handler daquele botão) roda `disable_steam_input.sh
--apply-quiet` e `fix_wireplumber_default_source.sh --install` — nem um nem
outro cria o mouse virtual nem escreve a regra udev. **O ponteiro estava errado
no ALVO, não só no nome.**

- as duas frases de estado passam a dar `como_atualizar_esta_instalacao()`, que
  é o que o ramo do componente ausente logo acima (`:608`) e o campo UINPUT da
  aba Emulação (`emulation_actions.py:1079-1092`, *"reinstale o Hefesto"*) já
  diziam para a mesma condição;
- a dica passa a apontar para a linha de estado que está logo acima dela, na
  mesma coluna;
- `BLOQUEIO_DO_MOUSE_EM_PORTUGUES["sem_device"]` muda junto — senão o toast da
  recusa e o rótulo diriam coisas diferentes sobre a mesma condição, que é a
  contradição que este commit existe para matar. O gesto entra por `{gesto}` em
  `frase_da_recusa_do_mouse`; resolvê-lo na tabela seria um `stat` no disco em
  tempo de importação, e a resposta muda por instalação;
- as duas entradas de `mouse_actions` saem de `DIVIDA_DA_PALAVRA_01_PY`.

`"módulo uinput"` e `"regra udev"` **não** foram reescritos em português de
quem joga — é um segundo passo, com o olho dela.

## Qual mordida prova

### A régua nova: `test_o_recibo_carrega_a_mesma_ressalva_do_rotulo`

Para cada **botão** de `AFIRMACOES_DE_TRANSPORTE_DA_ABA`, ela lê o handler de
`clicked` no glade, acha a função por AST em `emulation_actions.py`, remonta o
texto que chega a `_apply_mode`/`_toast_emulation` (resolvendo
`RESSALVA_DE_TRANSPORTE["…"]` para o valor real) e exige a ressalva sempre que
o recibo cita um radical de `RADICAIS_DE_TRANSPORTE` cuja célula não tem lastro
nos dois transportes. `emulation_actions.py` é lido por AST e nunca importado:
ele puxa GTK, e um runner sem GTK transformaria `ImportError` em "zero recibos"
— o jeito silencioso de o portão se desligar.

Ela também recusa o silêncio: `assert conferidos` reprova se nenhum recibo for
encontrado, e `assert recibos` reprova se um botão declarado deixar de mandar
recibo.

**Cura arrancada** (`_apply_mode(MODE_GAMEPAD, "xbox", "Gamepad Xbox 360 ligado
(vibra no jogo)")` devolvido):

```
E       AssertionError: o recibo promete o que o rótulo já ressalvou — quem clica lê o toast:
E           emulation_gamepad_xbox_button (on_emulation_gamepad_xbox) afirma vibracao.rumble.passthrough@dualsense nos DOIS lugares, e só o tooltip carrega a ressalva:
E             tooltip: 'Xbox 360 Máscara Xbox 360: os controles não aparecem duplicados e os jogos mostram prompts de Xbox (A/B/X/Y). A vibração ainda não foi conferida no aparelho — nem no cabo, nem no rádio: o caminho está montado. É a única máscara que jogos XInput-only entendem; nessa API não existe giroscópio.'
E             recibo : 'Gamepad Xbox 360 ligado (vibra no jogo)'
E             falta  : 'vibração ainda não foi conferida no aparelho — nem no cabo, nem no rádio'
tests/unit/test_a_aba_emulacao_nao_promete_transporte_sem_lastro.py:540: AssertionError
=========================== short test summary info ============================
FAILED tests/unit/test_a_aba_emulacao_nao_promete_transporte_sem_lastro.py::test_o_recibo_carrega_a_mesma_ressalva_do_rotulo
1 failed, 7 passed in 0.36s
```

**Cura devolvida:**

```
........                                                                 [100%]
8 passed in 0.35s
```

### O portão da palavra: `validar-palavra-de-tela.py --all`

Estado entregue — **rc=0 com as cinco entradas de dívida do glade e as duas de
`app/` apagadas**.

**Mordida A — rótulo devolvido com a entrada já removida** (`Controles
detectados:` → `Gamepads:` no glade):

```
.../src/hefesto_dualsense4unix/gui/main.glade:3160: o rótulo 'Gamepads:' (label) contém o jargão 'Gamepads:', aposentado pela E3 da PALAVRA-01.
    Diga 'Controles detectados:'. Quem joga não é obrigado a saber o que é um daemon.

1 reprovação(ões) da palavra de tela.
rc=1
```

**Mordida B — a frase de `app/` devolvida com a entrada já removida**
(`mouse_actions.py`, ramo "sem permissão"):

```
.../src/hefesto_dualsense4unix/app/actions/mouse_actions.py:630: o texto de tela '<span foreground="#ff5555">O mouse virtual está sem permissão — abra a aba Sistema e clique em “Aplicar correções”</span>' (texto de tela) contém o jargão 'Aplicar correções', aposentado pela E3 da PALAVRA-01.
    Diga 'Consertar problemas conhecidos'. Quem joga não é obrigado a saber o que é um daemon.

1 reprovação(ões) da palavra de tela.
rc=1
```

Devolvidas as curas, `rc=0` nas duas.

### Portões

`bash scripts/portoes.sh --rapido` → **TODOS VERDES — 19 portões**.
`pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` → verde (nenhuma
lápide tocada).

## O que NÃO verifiquei

- **Não olhei a tela.** Não rodei `retratar_abas.py` (R-C), então **não vi** os
  cinco rótulos novos na janela real. Em particular: **`Consertar problemas
  conhecidos` tem 30 caracteres contra 17 do antigo, e `Fixar a versão que
  funciona` tem 28 contra 22** — os dois ficam lado a lado na mesma fileira do
  bloco Avançado da aba Sistema, com mais três botões. Se aquela fileira
  esticar a aba ou cortar na borda, **é este commit**, e só a foto diz. A
  LARGURA-01 e a JANELA-CORTADA-01 já pagaram esse preço antes.
- **Não medi o efeito de `Voltar ao padrão` aparecer duas vezes.** O rótulo já
  existia em `key_binding_restore_btn` (`main.glade:4082`, aba Navegação, coluna
  do teclado: *"Devolve todos os atalhos ao que vem de fábrica"*). Agora o botão
  do rodapé global tem o mesmo texto e faz outra coisa (devolve o `meu_perfil`
  de fábrica). Os dois nunca aparecem na mesma fileira, e o rodapé está fora do
  notebook — mas **isto é palavra dela**, e a troca veio da tabela do portão,
  não de mim.
- **Não conferi a bancada.** Nada aqui toca o aparelho; a ressalva da vibração
  continua sendo a medição de 25/08 lida do `docs/data/mapa-controles.csv`.
- **Não rodei a suíte inteira** (R do executor): rodei por caminho os arquivos
  que citam qualquer um dos cinco rótulos ou as tabelas que mexi.
- **Não sei se `como_atualizar_esta_instalacao()` é o conselho CERTO para
  "mouse virtual sem permissão".** Sei que o conselho antigo era errado (o botão
  não toca no `uinput`) e que o novo é o que o produto já dá para a mesma
  condição em dois outros lugares. Se o conserto real for outro (recarregar o
  módulo, um `udevadm trigger`), a frase certa é dela e de quem tem a bancada.

## O que sobrou para o próximo

### DOIS TESTES VERMELHOS QUE EU NÃO POSSO CONSERTAR (R-A) — a costura precisa de UM commit

Renomear `Aplicar correções` deixou **três frases fora da minha posse** citando
um botão que não existe mais. Duas delas são conferidas por portão. Os
consertos são mecânicos e estão escritos aqui:

1. `src/hefesto_dualsense4unix/integrations/storm_doctor.py:236` — **posse da
   L2-G**
   `"jogo, não é escolha por jogo) — clique 'Aplicar correções' na "`
   → `"jogo, não é escolha por jogo) — clique 'Consertar problemas conhecidos' na "`
2. `src/hefesto_dualsense4unix/integrations/storm_doctor.py:342` — **posse da
   L2-G**
   `"e reconecte os controles (o botão 'Aplicar correções' não instala "`
   → `"e reconecte os controles (o botão 'Consertar problemas conhecidos' não instala "`

   Sem (1) e (2), `tests/unit/test_steam_input_ponteiros.py` reprova em dois
   casos — e reprova **certo**: ele confere o rótulo citado contra o glade, e é
   por isso que ele existe.

   ```
   E       AssertionError: assert None == 'Sistema'
   E        +  where None = _aba_do_botao('Aplicar correções')
   FAILED tests/unit/test_steam_input_ponteiros.py::test_botao_citado_pelo_diagnostico_existe_na_janela
   FAILED tests/unit/test_steam_input_ponteiros.py::test_aba_citada_e_a_aba_onde_o_botao_mora
   ```

3. `tests/unit/test_emulation_mic_quirk.py:143` — **de ninguém nesta leva**
   `assert "Aplicar correções" in msg`
   → `assert "Consertar problemas conhecidos" in msg`

   ```
   E       AssertionError: assert 'Aplicar correções' in 'Mic ligado — atenção: sem o ajuste de áudio o controle pode travar no meio do jogo. Abra a aba Sistema e clique em “Consertar problemas conhecidos” (vale no próximo boot).'
   FAILED tests/unit/test_emulation_mic_quirk.py::test_mic_on_avisa_quando_quirk_ausente
   ```

**Eu não escrevi em nenhum dos três** (R-A). Como a L2-G está com o
`storm_doctor.py` aberto AGORA, o commit tem de sair **depois** do merge dela.

### Ponteiros mortos que NÃO estão sob portão (não deixam nada vermelho)

- `scripts/doctor.sh:3815` — *"use o botão 'Travar Proton validado' (aba Sistema
  da GUI…)"*. Posse da **L2-G**. Vira `'Fixar a versão que funciona'`.
- `src/hefesto_dualsense4unix/app/actions/footer_actions.py:1502` — *"Asset
  'meu_perfil.json' não encontrado — Restaurar Default indisponível."* Continua
  em `DIVIDA_DA_PALAVRA_01_PY` (o portão segue verde porque a frase não mudou),
  e agora ela cita um botão que se chama `Voltar ao padrão`. **Fora da minha
  posse.**
- `docs/usage/interface.md:494,496,1051` e `docs/usage/quickstart.md:159`
  nomeiam os rótulos antigos. `quickstart.md` é posse da **L2-F**;
  `interface.md` não é de ninguém nesta leva.

### O sufixo `/dev/input/js*` NÃO foi trocado, e é uma medição, não um esquecimento

A ordem pedia trocar `f"… — {nos} nós em /dev/input/js*"`
(`emulation_actions.py:311`), que publica um caminho de `/dev` na tela. **Não
troquei, por dois motivos medidos:**

1. **A troca exige arquivo fora da minha posse.**
   `tests/unit/test_contagem_emulacao_conta_aparelho.py` prende a forma exata em
   dois lugares — `:104-109` (`assert texto == "… — 6 nós em /dev/input/js*"`) e
   `:115` (`assert "6 nós" in …`). Trocar o sufixo sem tocar naquele arquivo
   deixa **mais** um vermelho, e tocá-lo viola a R-A.
2. **É texto NOVO de tela, e não há substituição escrita em portão nenhum.**
   As cinco trocas deste commit vieram todas da tabela `JARGAO_BANIDO`; esta
   não está lá — nem `/dev`, nem `nós`, nem `js`. Escrever a frase nova em
   silêncio seria fato consumado (R-E).

**Proposta para ela, provisória e não aplicada:**
`… — o sistema vê {nos} entradas de controle`, que preserva o motivo do número
cru (*"um controle na mesa pode render seis nós"*, o comentário de
`rotulo_gamepads`) sem publicar um caminho de `/dev`. Quem executar troca a
frase **e** as duas asserções do teste no mesmo commit — e a palavra `nós` cai
junto, que é o outro jargão da mesma linha.

### A foto

`tests/unit/test_as_fotos_acompanham_a_versao.py` está **vermelho** nesta
árvore, como R-C prevê para toda frente que toca `app/`/`gui/`:

```
E       AssertionError: a interface mudou em 565c28c e as fotos de `docs/usage/assets` são de a6423e8, que veio ANTES.
```

Não rodei `retratar_abas.py`. Quem coordena fotografa uma vez em `onda/atual`,
no fim da leva.

### Texto novo de tela que espera o olho dela (R-E)

Um só, marcado `PROVISÓRIO — decisão dela` no `main.glade` e na mensagem do
commit `565c28cf`:

- **aba Navegação, dica do bloco do mouse:** `(ver aba Emulação)` →
  `(o estado aparece na linha acima)`.

O resto é vocabulário que já existia: as cinco trocas são verbatim da tabela do
portão, e a ressalva do recibo é verbatim de `RESSALVA_DE_TRANSPORTE`.
