# NO-JOGO-SEM-FALSO-VERDE-01 — a palavra verde que não prova que chegou

- **Escrita em:** 23/08/2026, noite, na bancada dela (daemon vivo desde 18:33:39,
  **zero DualSense físico** na mesa, um vpad de pé)
- **Onda:** 4 da fila em ondas do
  [SPRINT_ORDER](../SPRINT_ORDER.md) — a aba **No jogo**, que é a **3ª** da
  tira, não a 10ª
- **Grau:** **MEDIDO** nas seções 1 a 3 e nas dez tarefas (o comando está ao lado
  de cada número). **DESENHO** só na §4 e nas classes de tela
- **O que esta sprint fecha:** as seis linhas desta aba param de dizer verde sem
  poder provar; o cabeçalho para de afirmar uma máscara que o daemon já sabe
  estar divergente; a aba para de ficar na tira depois de o jogo fechar; os
  painéis ganham a cor do jogador; e as duas linhas que o daemon publica sem
  leitor (bateria e jack) chegam à tela
- **O que ela NÃO faz:** não mede Bluetooth (trilha dela, D2 — a §6 diz o que
  fica travado por isso); não mexe na aba Status, embora divida o arquivo e o
  widget com ela; não reescreve a régua de casamento controle→vpad
  (`_item_do_vpad`, dono único desde a PAINEL-DA-VERDADE-01); não roda o
  `retratar_abas.py` enquanto houver onda em paralelo

**Restrição dura de execução:** esta aba mora dentro de
`app/actions/status_actions.py` (2976 linhas, blocos `:569-901`) e o widget dela
importa a regra da aba Status de `app/widgets/controller_card.py` (5476 linhas).
**O agente-dono é o MESMO da Onda 3 (Status), sequencial, nunca em paralelo.**

---

## 1. O defeito, em uma frase

**A aba que existe para dizer se o recurso está chegando ao jogo pinta a palavra
"no jogo agora" em verde quando ninguém jogou nada** — o verde da vibração sai de
um pedido de **PARAR**, o do som sai de qualquer programa que tenha o hidraw do
controle virtual aberto (o cliente da Steam basta), e o do giroscópio e o do
toque saem de uma escrita que quem faz somos **nós**, não o jogo.

---

## 2. O que está MEDIDO

Instrumento declarado em todas: `.venv/bin/python` da árvore, funções de
**produção** chamadas direto, sem GUI e sem dublê de regra. O estado vivo saiu do
próprio daemon via `app.ipc_bridge._run_call("daemon.state_full")`.

### 2.1 O verde da vibração sai de um pedido de PARAR

```python
# entry: player 1, is_primary; state: gamepad/dualsense, per_vpad com o
# carimbo de rumble FRESCO (0,5 s) e ff_nao_nulo_count=0, ff_parada_sdl_count=1
linhas_do_controle(entry, state)
```

```
giroscópio          | nunca    | sem pedido ainda
vibração            | chegando | no jogo agora        <- VERDE, sem um byte pedido
gatilho             | nunca    | sem pedido ainda
luz                 | nunca    | sem pedido ainda
clique do touchpad  | nunca    | sem pedido ainda
som do controle     | nunca    | sem pedido ainda
```

O mecanismo está escrito no fonte, e os dois ramos carimbam a **mesma** chave:
`integrations/uhid_gamepad.py:2091` carimba `ATIVIDADE_RUMBLE` na **parada do
SDL** (`_e_a_parada_do_sdl`, `:719` — flags zerados, motores zerados) e `:2159`
carimba a mesma chave num pedido de verdade. `estado_do_recurso`
(`app/widgets/controller_card.py:1504`) lê só `visto_ha_s["rumble"]` e não tem
como separar os dois.

**E o pedido de parar chega sozinho.** Medido na bancada às 21h50, com **zero**
DualSense físico e nenhum jogo aberto:

```
rumble_ff.per_vpad[0].ff_ultimos_reports:
  [{"ha_s": 4493.5, "flag0": 0, "flag1": 0, "flag2": 2,
    "weak": 0, "strong": 0, "ramo": "parada_sdl"}]
  ff_play_count: 0 · ff_nao_nulo_count: 0 · ff_parada_sdl_count: 1
  visto_ha_s: {"output": 4493.5, "rumble": 4493.5}
```

Uma parada, zero pedidos — e por três segundos aquela linha esteve verde.

### 2.2 O verde do som só prova que ALGUÉM tinha o hidraw aberto

O carimbo `audio_do_jogo` (`uhid_gamepad.py:2071`) exige `_replicating()`, que é
`_game_open` mais meio segundo de graça (`:2241`). E `_game_open` é o
`UHID_OPEN` de **qualquer** processo — o que a própria árvore declara, em letra
grande, na docstring de `game_open` (`uhid_gamepad.py:1328-1338`):

> *"Veto permanente da síntese da Onda N: sessão aberta JAMAIS é evidência de
> jogo (o CLIENTE Steam também abre — mecanismo do incidente 14:42)"*

Vivo agora: `game_open: true`, `jogo_steam: {"lido": true, "appid": null}`,
`output_count: 2`. **Nenhum jogo, e a sessão está aberta.** Com o carimbo de
áudio fresco, a mesma chamada da §2.1 devolve `som do controle | chegando | no
jogo agora`.

**E há um fato errado escrito no fonte, no comentário do próprio recurso**
(`controller_card.py:1345-1355`):

> *"Por isso 'sem pedido ainda' aqui significa mesmo 'nenhum jogo pediu', e não
> 'o kernel ainda não passou por aqui'."*

Não significa. É a T2.

### 2.3 Duas das seis linhas medem a NOSSA escrita, não a do jogo

`giroscopio` responde por `motion_streaming`/`motion_hz` e `touchpad` por
`visto_ha_s["touchpad_click"]`. Quem alimenta os dois é o
`core/physical_report_reader.py`, chamando `vpad.forward_motion` e
`vpad.forward_touchpad_click` — **o daemon escrevendo no controle virtual**.
Nenhum jogo participa. A tela diz "no jogo agora"; o payload sabe "nós
escrevemos e ninguém confirmou leitura".

A honestidade está no lugar errado: a docstring do módulo
(`app/widgets/painel_no_jogo.py:37-46`) declara que *"nenhuma linha afirma que o
JOGO consumiu o dado"* — e a única coisa que a pessoa lê é a frase.

### 2.4 O cabeçalho ignora a máscara divergente que o daemon publica

`texto_do_contexto` (`painel_no_jogo.py:434`) imprime *"O jogo vê o controle
como: …"* a partir de `gamepad_emulation.flavor`. O daemon publica, no MESMO
bloco, `mascara_divergente` (`daemon/ipc_handlers.py:2501`) — o alarme de que o
jogo em cena vê máscara **diferente** da que ela escolheu. Leitores na janela:

```
$ grep -rn "mascara_divergente" src/hefesto_dualsense4unix/app/
(vazio)
```

O comentário que o publica (`ipc_handlers.py:2486-2489`) diz, com todas as
letras, *"e a GUI decide se mostra"*. A GUI não sabe que ele existe.

### 2.5 Duas linhas publicadas por controle, sem um leitor

```
$ grep -rn "bateria_no_jogo" src/  -> só ipc_handlers.py:2862 (o escritor)
$ grep -rn '\["jack"\]\|get("jack")' src/hefesto_dualsense4unix/app/  -> vazio
```

`per_vpad` carrega `bateria_no_jogo`, `battery_forwards`, `jack` e
`jack_forwards` (`ipc_handlers.py:2851-2864`). O mapa de canais tem as duas
chaves com `aciona = sim` nos dois transportes e mordida nomeada
(`energia.bateria.jogo@dualsense`, `audio.jack.deteccao@dualsense`). É F2 na
forma clássica: a casa sabe e o produto não faz.

### 2.6 A aba fica na tira depois de o jogo fechar

`_sync_paineis_no_jogo` (`status_actions.py:794`) chama o gate de existência na
primeira linha, e ele funciona. Só que o chamador dele,
`_render_slow_state` (`:2685`), **sai na linha 2688** quando há qualquer popup
com grab GTK aberto em **qualquer** aba. E `_on_profile_state_failure` (`:2402`)
solta o guard de inflight e **não faz mais nada** — um poll que falhou não
esvazia painel nenhum. Nos dois casos a aba fica na tira e os painéis congelam
com o último estado bom.

O contrato que isso quebra está escrito na docstring da própria função
(`:804-811`): *"Painel parado com número de três minutos atrás ao lado da
palavra 'no jogo agora' é a mentira confortável que esta aba existe para não
contar."*

### 2.7 A cor das seis linhas não tem UMA asserção, e o portão de timers é cego

```
$ grep -rn "COR_DA_SITUACAO" tests/
tests/unit/test_no_jogo_a_aba_que_responde_pelo_jogo.py:445  (comentário)
tests/unit/test_no_jogo_a_aba_que_responde_pelo_jogo.py:610  (comentário)
```

Duas menções, zero asserções. O ramo que pinta (`painel_no_jogo.py:607-615`) só
existe no `PainelNoJogo` **real**, e o único teste que o instancia com GTK de
verdade (`test_o_status_nao_samba_no_ritmo_do_giroscopio.py:413`) mede geometria.
O dublê sem GTK (`painel_no_jogo.py:621`) não pinta nada. A cor da linha do
**perfil** tem asserção (`COR_DO_AVISO_DE_PERFIL`); a das seis linhas não tem.

E o portão de timers promete cobrir este arquivo:

> `painel_no_jogo.py:499-502` — *"O gate de timers da `status_actions` conta as
> ocorrências de `GLib.timeout_add` no fonte — este widget não acrescenta
> nenhuma, de propósito."*

`test_status_cards.py:706-718` lê `status_actions.py` e `controller_card.py`.
**Não lê `painel_no_jogo.py`.** Um `GLib.timeout_add` plantado ali passa.

### 2.8 Quatro painéis lilás idênticos

```
$ grep -c "lightbar\|accent\|swatch\|player_slot" src/.../painel_no_jogo.py
0
```

O mesmo número que a MESA-CHEIA-07 mediu em 13/08. O título já é o do card
(`titulo_do_painel` → `titulo_do_card`); a cor ficou para trás. Com quatro
controles são quatro molduras idênticas na frente de quatro barras acesas em
quatro cores.

### 2.9 A foto oficial desta aba publica o falso verde

`docs/usage/assets/readme_no_jogo.png`, Controle 2, linha **vibração**: verde,
"no jogo agora", **sem motores**. Vem do dublê `_NO_JOGO_ESTADO`
(`scripts/gui-captura/retratar_abas.py:513-585`), cujo Controle 2 tem
`visto_ha_s: {"rumble": 0.9}` e nenhum `rumble_no_fisico`. É a forma exata do
defeito da §2.1, impressa no `README.md`.

**E aquela foto não pode mostrar o gate de existência**: o dublê não tem a chave
`jogo_steam` (logo `jogo_steam_aberto` devolve `None`) e o `_get("main_notebook")`
devolve `None` de propósito. A foto é fiel ao miolo e **muda** sobre a tira.

---

## 3. O que é HIPÓTESE (e continua sendo até alguém medir)

| hipótese | por que é plausível | o que a derrubaria ou confirmaria |
|---|---|---|
| o cliente da Steam escreve **lightbar** no hidraw do nosso vpad, acendendo a linha "luz" sem jogo | está MEDIDO que ela repinta a barra dos físicos em rajada (98 reports contra 6), e o espelho Xbox do Steam Input enxerga o vpad | ler `ff_ultimos_reports` e `lightbar_replicas` com a Steam aberta e nenhum jogo. O instrumento já existe no payload |
| `output_count: 2` com `ff_parada_sdl_count: 1` significa que o segundo output foi de outra categoria | o anel só grava report que fala (ou parece falar) de vibração | ampliar o anel, ou ler `output_id_estranho_amostra` — hoje `null` |
| os quatro painéis coloridos ainda se leem de relance com a mesa cheia | é a aposta da MESA-CHEIA-07/E2 | **só a bancada dela**, com jogo aberto. Não é decidível aqui |

**NÃO VERIFICADO nesta leva**, e fica dito: nenhum número desta sprint sobre 2 ou
4 controles é medição viva — a mesa estava **vazia** às 21h50 (`controllers[0]:
connected false`, `coop.mesa: []`, `coop.players: 1`, e o único vpad é o nosso).

---

## 4. A coreografia dos agentes

**Seis agentes, um só de cada vez, e o MESMO agente-dono da Onda 3.** Não é
preferência: a aba inteira mora em `status_actions.py:569-901` e o widget importa
`estado_do_recurso`, `titulo_do_card` e `_NOME_NA_FRASE` de um arquivo de 5476
linhas que a Onda 3 também edita. Dois agentes ali colidem.

```
   A6 (1ª passagem)  ->  A1  ->  A4  ->  A3  ->  A5  ->  A2  ->  A6 (2ª passagem)
   prova que os          o que    o que    o que    o que    a cor    as curas
   portões são cegos     o dado   a tela   a tela   falta             e o mapa
                         significa mostra   afirma
```

| # | agente | arquivos que ele toca | tarefas | o que devolve |
|---|---|---|---|---|
| **A6·1** | **as réguas, antes de tudo** | nenhum de produto | prova de cegueira de T7, T8 | uma nota com o comando e a saída: o `GLib.timeout_add` plantado em `painel_no_jogo.py` passou pelo portão; a `set_text` no lugar da `set_markup` passou pelos 110 testes. **Sem isto as curas de T7/T8 não têm o que provar** |
| **A1** | `integrations/uhid_gamepad.py`, `app/widgets/controller_card.py` | T1, T2 | o carimbo novo do PEDIDO de vibração, o fato errado do som substituído em todos os lugares, e a lista dos arquivos onde ele aparecia |
| **A4** | `app/actions/status_actions.py` | T4 | o gate de existência fora do gate de popup, o caminho de falha esvaziando os painéis, e o teste que prova os dois |
| **A3** | `app/widgets/painel_no_jogo.py` | T3 | o cabeçalho lendo `mascara_divergente`, **com o texto proposto e NÃO commitado até a palavra dela** (T3 é estrutural) |
| **A5** | `app/widgets/controller_card.py`, `app/widgets/painel_no_jogo.py` | T6 | as duas linhas novas propostas, a decisão **D-L** escrita para ela, e a nota de que `_NOME_NA_FRASE` é lista-dona das DUAS abas |
| **A2** | `app/widgets/painel_no_jogo.py` | T5 | a cor por reuso de `accent_do_card`, com a asserção de identidade byte a byte |
| **A6·2** | `tests/unit/`, `docs/data/mapa-controles.csv`, `scripts/gui-captura/` | T7, T8, T9, T10 | os dois portões curados (e reprovando o que a 1ª passagem plantou), a linha nova do gatilho no mapa, e o dublê da foto |

**Regra de parada:** se A1 não fechar, A3/A5/A2 rodam mesmo assim (arquivos
disjuntos da cura de A1), mas **A6·2 não fecha** — a T9 depende do vocabulário
que A1 cria.

---

## 5. As tarefas

Legenda da classe de tela (D3): **[COS]** cosmética pré-aprovada, foto depois em
lote · **[EST]** estrutural, precisa do olho dela ANTES · **[—]** não toca a tela.

### T1 — a vibração verde que sai de um pedido de PARAR **[COS]**

- **Onde:** `integrations/uhid_gamepad.py:283` (as chaves), `:2091` (o ramo da
  parada), `:2159` (o ramo do pedido); `app/widgets/controller_card.py:1504`
- **O conserto:** uma categoria nova, `ATIVIDADE_RUMBLE_PEDIDO`, carimbada **só**
  quando `weak or strong` — o pedido de verdade. A parada continua carimbando
  `rumble` (ela É prova de que o jogo está falando conosco, e o
  `ff_parada_sdl_count` existe justamente por isso). `estado_do_recurso` passa a
  ler a chave nova para a linha `vibracao`; chave ausente (daemon mais velho que
  o código, que aqui é rotina) cai em `SITUACAO_NUNCA`, que é apagado e calado
- **Nenhuma palavra nova na tela:** a linha passa a dizer **"parou"**, que já é o
  vocabulário desta mesma linha desde a PAINEL-DA-VERDADE-01. Por isso [COS]
- **A mordida:** `visto_ha_s = {"rumble": 0.5}`, `ff_nao_nulo_count: 0`,
  `ff_parada_sdl_count: 1` tem de devolver `("parado", …)`. **Arranque** a
  leitura da chave nova e devolva a antiga: volta "no jogo agora", e a asserção
  reprova
- **Custo:** ~35 linhas de produto, ~40 de teste, 50 min

### T2 — "sem pedido ainda" no som não significa "nenhum jogo pediu" **[—]**

- **Onde:** `app/widgets/controller_card.py:1345-1355` (o comentário falso), e
  todo lugar que o repete
- **O conserto:** **fato errado se SUBSTITUI, e sai de TODOS os lugares.** O que
  o carimbo `audio_do_jogo` prova é: *alguém com o hidraw do vpad aberto mandou
  bytes de áudio não nulos*. Quem tem o hidraw aberto pode ser o cliente da
  Steam — está escrito na docstring de `game_open` (`uhid_gamepad.py:1328-1338`)
  como **veto permanente**. O comentário passa a dizer isso; a condição do
  carimbo **não muda** (ela é a certa para o que significa)
- **A mordida:** um teste que ARMA a contradição — `jogo_steam.appid = None` e
  `game_open = True`, e exige que o carimbo de áudio possa sair. Ele documenta em
  código que a frase antiga era falsa. **Arranque** o veto de `game_open` (isto
  é, faça o teste presumir que sessão aberta é jogo) e ele reprova
- **Custo:** ~15 linhas de comentário, ~25 de teste, 30 min

### T3 — o cabeçalho ignora a máscara divergente **[EST]**

- **Onde:** `app/widgets/painel_no_jogo.py:434` (`texto_do_contexto`)
- **O conserto:** quando `gamepad_emulation.mascara_divergente` não for `None`, a
  linha de contexto diz o que o jogo em cena **vê**, e não só o que está de pé.
  A lista inteira (`mascara_divergencias`) fica de fora: divergência de jogo
  fechado é antecipação, e o próprio daemon separa as duas chaves por isso
- **[EST] porque é texto novo no topo da aba** — a primeira coisa que se lê ao
  abrir. O agente escreve a proposta e **para**: nada commitado antes da palavra
  dela
- **A mordida:** estado com `mascara_divergente = {"appid": 1234, "em_cena":
  true, "perfil": "xbox", "viva": "dualsense"}` tem de imprimir as **duas**
  máscaras. **Arranque** o leitor: volta a imprimir só a viva, e reprova
- **Custo:** ~25 linhas de produto, ~35 de teste, 45 min mais a espera dela

### T4 — a aba fica na tira depois de o jogo fechar **[—]**

- **Onde:** `app/actions/status_actions.py:2688` (o gate de popup) e `:2402`
  (`_on_profile_state_failure`)
- **O conserto, em duas metades:**
  1. o gate de **existência** (`_sync_visibilidade_no_jogo`, `:732`) sai de
     dentro de `_sync_paineis_no_jogo` e passa a rodar **antes** do
     `if self._popup_is_open(): return`. Mostrar ou esconder uma página do
     notebook não toca a árvore de widgets do popup — o motivo do gate
     (BUG-COMBO-POPUP-FLICKER-02) é re-layout, e aqui não há;
  2. `_on_profile_state_failure` passa a esvaziar os painéis depois de N falhas
     seguidas, do mesmo jeito que `_render_offline` (`:2656`) já faz com
     `_sync_paineis_no_jogo(None)`
- **Nada muda na tela num caminho feliz.** Por isso [—]: isto restaura o
  contrato ABA-DO-JOGO-01 que ela pediu (*"essa aba no jogo só deveria aparecer
  quando efetivamente eu tivesse com um jogo steam aberto"*)
- **A mordida:** dublê de `Gtk.grab_get_current` devolvendo um grab, estado sem
  jogo, e a aba tem de **sair** da tira. **Arranque** a mudança de ordem: ela
  fica, e reprova. A segunda metade: três falhas seguidas de poll e o painel
  tem de esvaziar em vez de manter "no jogo agora"
- **Custo:** ~30 linhas de produto, ~50 de teste, 1 h

### T5 — quatro painéis lilás idênticos ganham a cor do jogador **[COS]**

- **Onde:** `app/widgets/painel_no_jogo.py:505` (`__init__`) e `:575`
  (`atualizar`)
- **O conserto:** o mesmo `accent_do_card`
  (`app/widgets/controller_card.py:2042`) que o card da Status já usa, no swatch
  ao lado do título — que já é o mesmo título. **Por reuso, nunca por cópia:** o
  cabeçalho do módulo promete *"Este módulo chama aquela função; não reimplementa
  nem uma linha dela"*
- **[COS] porque a cor por jogador é paleta JÁ DECIDIDA desta casa** (COR-03,
  `core/led_control.py:147`, azul/vermelho/verde/rosa) e nenhum texto, nenhuma
  ordem e nenhuma seção muda. Foto depois, em lote
- **A mordida:** as três já estão escritas na
  [MESA-CHEIA-07](2026-08-13-MESA-CHEIA-07-a-decima-aba-que-ninguem-mediu.md),
  §3 — identidade byte a byte contra o card, o `strict=True` do
  `zip(keys, conectados)`, e o timer novo. **Não as reescreva aqui**
- **Trava:** a **D-1** do índice de 14/08 (a cor é a viva ou a da paleta?) é
  decisão dela e vale para todas as abas coloridas
- **Custo:** ~40 linhas de produto, ~60 de teste, 1 h 15

### T6 — as duas linhas que faltam: bateria e jack para o jogo **[EST]**

- **Onde:** `app/widgets/controller_card.py:1383` (`_NOME_NA_FRASE`, a
  lista-dona) e `:1328` (`_CATEGORIA_DO_RECURSO`); o payload já está em
  `daemon/ipc_handlers.py:2851-2864`
- **O conserto:** duas linhas novas nos painéis — a carga que o jogo recebe
  (`bateria_no_jogo.pct` + `battery_forwards`) e o fone/microfone plugados que o
  jogo enxerga (`jack` + `jack_forwards`)
- **Estas duas NÃO têm recência**, e a redação tem de respeitar isso: não há
  carimbo em `visto_ha_s` para nenhuma das duas, só um contador cumulativo e um
  valor atual. **A palavra "agora" não pode aparecer nelas.** Contador zero = a
  linha some (a tela cala em vez de escrever zero)
- **[EST] por dois motivos:** são duas frases novas, e `_NOME_NA_FRASE` é
  lista-dona **das duas abas** — mexer nela muda também a linha da verdade do
  card da aba Status. É a **D-L** da §9
- **A mordida:** `battery_forwards > 0` e `bateria_no_jogo.pct = 75` tem de virar
  linha; `battery_forwards = 0` tem de sumir. **Arranque** o leitor e as duas
  linhas somem com o payload cheio — reprova. O mapa já nomeia a mordida do lado
  do daemon (`energia.bateria.jogo@dualsense`)
- **Custo:** ~50 linhas de produto, ~70 de teste, 1 h 30 mais a espera dela

### T7 — a cor das seis linhas não tem uma asserção **[—]**

- **Onde:** `tests/unit/test_no_jogo_a_aba_que_responde_pelo_jogo.py` (o arquivo
  já existe, com 21 testes)
- **O conserto:** um teste com **GTK real** (`Gtk.OffscreenWindow`, o molde de
  `test_o_status_nao_samba_no_ritmo_do_giroscopio.py:413`) que assere o markup de
  uma linha verde, o de uma amarela, e a classe `dim-label` de uma apagada
- **A mordida:** trocar `set_markup` por `set_text` em `painel_no_jogo.py:611`.
  Hoje isso passa nos 110 testes desta aba — a 1ª passagem de A6 tem de mostrar
  isso rodando, com a saída colada, antes de a cura entrar
- **Custo:** ~70 linhas de teste, 50 min

### T8 — o portão de timers promete cobrir este arquivo e lê outros dois **[—]**

- **Onde:** `tests/unit/test_status_cards.py:706-718`
- **O conserto:** o portão passa a ler também `app/widgets/painel_no_jogo.py` e
  a exigir **zero** `GLib.timeout_add`, `GLib.timeout_add_seconds` e
  `GLib.idle_add` nele — que é exatamente o que a docstring de `:499-502`
  promete
- **A mordida:** plantar `GLib.timeout_add(500, lambda: True)` no widget. Hoje
  passa (prova da 1ª passagem de A6); com a cura, reprova nomeando o arquivo
- **Custo:** ~10 linhas de teste, 20 min

### T9 — o gatilho replicado não tem linha própria no mapa **[—]**

- **Onde:** `docs/data/mapa-controles.csv`, `luz.replica_output_jogo`
- **O defeito:** uma linha só cobre lightbar, LED de jogador **e** gatilho, com
  `radio_aciona = parcial`. E a própria célula `assimetria_declarada` daquela
  linha diz que a divergência é **só na luz**: *"o bloco de gatilho que o jogo
  manda é replicado verbatim nos dois transportes, mas a lightbar e o LED de
  jogador por Bluetooth caem na supressão de escrita crua"*. A linha "gatilho"
  desta aba herda um `parcial` que é de outro mecanismo
- **O conserto:** uma chave nova, `gatilho.replica_output_jogo`, nas três
  famílias de controle, com `radio_aciona = sim` e
  `radio_de_onde_sei = inferido-do-codigo` (não `medido` — ninguém sentiu o L2
  por rádio depois de uma réplica). A linha da luz fica com `parcial` e perde a
  metade do gatilho do texto: **fato errado se substitui**
- **A mordida:** `python3 scripts/gerar-mapa.py --check` e
  `python3 scripts/check_paridade_transporte.py` têm de passar. E a mordida de
  verdade é a regra `integridade`: plante o `id` novo **igual** ao da linha da
  luz e veja o portão reprovar por duplicata
- **Custo:** 3 linhas de CSV (uma por família), 40 min

### T10 — a foto oficial publica o falso verde **[COS]**

- **Onde:** `scripts/gui-captura/retratar_abas.py:513-585` (`_NO_JOGO_ESTADO`)
- **O conserto:** o Controle 2 do dublê declara qual dos dois casos ele retrata.
  Com T1 no lugar, o `visto_ha_s: {"rumble": 0.9}` sem pedido passa a desenhar
  **"parou"** — que é o retrato honesto, e ensina a procurar o caso. Se a
  documentação quiser o caso bom, o dublê ganha o carimbo do pedido, explícito
- **Regra de execução:** **NÃO rode o `retratar_abas.py` enquanto houver onda em
  paralelo** — ele reescreve as onze fotos de uma vez. A foto sai no lote do fim
  da onda
- **A mordida:** é a de T1. Esta tarefa não inventa régua nova; ela impede que a
  foto do `README.md` continue a ensinar o defeito
- **Custo:** ~8 linhas no dublê, 20 min mais o lote da foto

---

## 6. O que o Bluetooth bloqueia (D2 — trilha dela, na mesa do specs)

Enquanto a medição não existir, **esta aba não pode afirmar**:

| a linha | o que o mapa diz hoje | o que ela NÃO pode dizer na tela |
|---|---|---|
| **vibração** (o número) | `vibracao.rumble.passthrough@dualsense`: `sim/sim`, mas **`inferido-do-codigo` nos DOIS lados** e `radio_ate_onde_foi` **vazio**. A mordida da própria célula diz: *"Não desce até o envelope do físico, então nem o cabo nem o rádio são provados de ponta a ponta"* | que os **motores** receberam. `rumble_no_fisico` é o par que a política devolveu ao sink, não uma leitura do aparelho |
| **luz** | `luz.replica_output_jogo@dualsense`: rádio **`parcial`** (LIGHTBAR-BT-NEVER-01 — a escrita crua é suprimida e sobra o sysfs). E **duas sprints se contradizem** sobre o rádio, uma delas velha | que a cor pintada pelo jogo chega à barra por rádio |
| **gatilho** | **não tem linha própria** — herda o `parcial` da luz (T9) | nada, até a T9 entrar |
| **giroscópio** (o Hz) | `movimento.giroscopio.jogo@dualsense`: **FURO ABERTO** declarado no `radio_ressalva` — `_struct_base` não testa o bit de áudio (`INPUT_FLAG_AUDIO = 0x02`), e o pacote do microfone tem o **mesmo id 0x31, o mesmo tamanho e CRC válido**. Inerte só porque a ponte de mic nasce desligada (vivo agora: `bt_mic.enabled: false`) | que o número em Hz é giroscópio, se um dia a ponte de mic ligar. Hoje é seguro, e é seguro **por acidente** |
| **som do controle** | `audio.alto_falante@dualsense`: rádio **`não`**, `radio_comando: NÃO IMPLEMENTADO` — `BLOCO_SPEAKER = 0x13` está declarado numa linha e não é referenciado em caminho de escrita nenhum | que o som sai do alto-falante de um controle no rádio. A linha mede o **pedido**, não o som |
| **clique do touchpad** | `toque.touchpad.clique@dualsense`: `sim/sim`, com mordida nomeada | — **livre** |
| **bateria e jack** (T6) | `sim/sim` nos dois, mas `inferido-do-codigo` | dizer `medido`. A linha pode existir; a proveniência não |

**A pergunta dela que fecha esta seção** — *"se decidirmos hoje que o caminho X
faz a feature Y funcionar no BT, isso chega na interface?"* — continua com a
resposta medida da Z6: **chega por alguém lembrar**. Nenhuma linha desta aba lê
o CSV.

---

## 7. As sprints absorvidas

| sprint | o que ela contribui | morre ao fim desta? |
|---|---|---|
| [MESA-CHEIA-07](2026-08-13-MESA-CHEIA-07-a-decima-aba-que-ninguem-mediu.md) | a E1 (medir a aba) está feita por esta sprint; a **E2 é a T5 inteira**, com as três mordidas já escritas lá | **SIM**, quando T5 fechar |
| [PARIDADE-SONY-01](2026-08-01-PARIDADE-SONY-01-o-que-o-jogo-manda-ao-alto-falante.md) | o carimbo `audio_do_jogo` e a refutação de 02/08 (*"quem escreve os bytes de áudio é o SISTEMA, não um jogo"*), que é a raiz da T2 | **NÃO.** A E2 (replicar o áudio ao controle) continua trancada pelo portão dela, e o rádio é `não` no mapa |
| [ESTADO-DA-NOITE-01](2026-08-10-ESTADO-DA-NOITE-01-o-que-ela-achou-com-o-controle-na-mao.md) | o PERFIL-MUDO-01 (o aviso amarelo que já está na aba) e a regra que sustenta a §3: a observação dela é fonte primária | **NÃO** — é ponto de retomada, não dívida |
| [SENSOR-VIVO-01](2026-07-29-SENSOR-VIVO-01-touchpad-giroscopio-microfone-e-som-dentro-do-jogo.md) | as quatro medições que deram origem às linhas do giroscópio, touchpad e som; já CONCLUÍDA | **NÃO** — já morreu em 21/08 |
| [JOGO-COMPLETO-01](2026-08-01-JOGO-COMPLETO-01-os-nove-recursos-dentro-do-jogo.md) | a lista dos nove recursos dela; as seis linhas de hoje são seis deles, e a T6 leva a **oito** | **NÃO** — CONCLUÍDA; fica como a lista contra a qual se conta |
| [QUEM-É-QUEM-01](2026-08-15-QUEM-E-QUEM-01-o-estado-publicado-nao-diz-qual-vpad-e-de-qual-controle.md) | `vpad_uniq`/`vpad_nome`/`vpad_indice` no `per_vpad`, que é o que permite a T5 casar painel com controle sem inventar régua | **NÃO** — falta o fecho da dica com o olho dela, que é dela |

---

## 8. O aceite

Fecha quando **tudo** abaixo estiver verde, nesta ordem:

```bash
git add -A                                  # os portões não veem arquivo novo

# 1. as duas provas de cegueira da 1ª passagem de A6 têm de REPROVAR agora
.venv/bin/python -m pytest -q tests/unit/test_status_cards.py -k timers
.venv/bin/python -m pytest -q tests/unit/test_no_jogo_a_aba_que_responde_pelo_jogo.py

# 2. os 110 testes desta aba, mais os novos
.venv/bin/python -m pytest -q \
  tests/unit/test_no_jogo_a_aba_que_responde_pelo_jogo.py \
  tests/unit/test_aba_no_jogo_entra_e_sai_da_tira.py \
  tests/unit/test_aba_no_jogo_so_com_jogo_aberto.py \
  tests/unit/test_painel_da_verdade_01.py \
  tests/unit/test_o_som_e_a_bateria_que_faltavam_no_jogo.py \
  tests/unit/test_touchpad_click_no_jogo.py

# 3. a suíte inteira e os portões da casa
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
.venv/bin/mypy src/hefesto_dualsense4unix
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh

# 4. o mapa (T9)
python3 scripts/gerar-mapa.py --check
python3 scripts/check_paridade_transporte.py
```

E, fora do terminal:

1. **a foto**, no lote do fim da onda (`scripts/gui-captura/retratar_abas.py`,
   **nunca** com outra onda rodando), e o Controle 2 do `readme_no_jogo.png` não
   pode mais mostrar verde sem motores;
2. **a palavra dela** nas duas tarefas [EST] — T3 (o cabeçalho) e T6 (as duas
   linhas novas). Sem ela, as duas ficam escritas e **não commitadas**;
3. **a bancada dela**, e só ela: com um jogo aberto, um controle no cabo e um no
   rádio, conferir que a linha "vibração" fica verde **quando vibra** e amarela
   quando o jogo manda parar. É a prova que nenhum teste desta casa dá.

---

## 9. O que fica aberto, e de quem é

| # | o que | de quem |
|---|---|---|
| **D-1** | a cor do painel é a **viva** da barra ou a da **paleta** COR-03? Trava T5 e todas as abas coloridas | **DELA** |
| **D-E** | o gate de existência com daemon velho: `jogo_steam_aberto` devolve `None`, a aba **não volta** e a cura é o restart. Está documentado como o desfecho seguro (`painel_no_jogo.py:394-432`). Continua sendo o certo, ou a aba deve nascer visível e sumir na primeira resposta? | **DELA** |
| **D-L** | as duas linhas novas de T6 entram também na **frase única do card** da aba Status (`_NOME_NA_FRASE` é lista-dona das duas), ou só nesta aba? | **DELA** |
| **T3** | o texto do cabeçalho quando a máscara diverge | **DELA** (escrito por A3, parado até a palavra) |
| — | o cliente da Steam escreve lightbar no nosso vpad? (§3) | **da Onda 8** (Lightbar), que já tem `LIGHTBAR-BT-NEVER-01` × `ROTA-BT-EM-REGIME-01` para desempatar |
| — | o rumble do jogo chega ao **motor** por rádio de ponta a ponta | **DELA**, na trilha de BT (D2). Sem isso a linha "vibração" não pode falar de motores no rádio |
| — | o alto-falante por rádio (`BLOCO_SPEAKER = 0x13`, declarado e nunca chamado) | **DELA**, D2 — e é a E2 da PARIDADE-SONY-01, atrás do portão dela |
| — | a densidade de quatro painéis coloridos com o jogo aberto | **DELA**, na bancada |

**Duas correções de fato que esta sprint faz ao diagnóstico da onda**, porque
número errado se substitui:

1. **Esta aba TEM pulso.** O diagnóstico holístico diz que "Rumble, No jogo e
   Emulação não têm nenhum". Ela pega carona no tique de 2 Hz —
   `_tick_profile_state` (`status_actions.py:2379`) → `_render_slow_state`
   (`:2685`) → `_sync_paineis_no_jogo` (`:2769`). O defeito real não é falta de
   pulso: é o pulso **sair cedo** no gate de popup e no caminho de falha (T4).
2. **O widget tem arquivo próprio.** A aba é montada dentro de
   `status_actions.py`, mas o painel mora em `app/widgets/painel_no_jogo.py`
   (667 linhas). A restrição de agente único continua valendo — o que ela
   importa (`_NOME_NA_FRASE`, `estado_do_recurso`, `titulo_do_card`) é do
   `controller_card.py` da Onda 3.
