# RUMBLE — POR JOGADOR-01 — grava na peça e manda na mesa

**24/08/2026.** **Onda 9 · Rumble** da fila da leva das onze abas ([SPRINT_ORDER](../SPRINT_ORDER.md),
§0.3). Aba **Rumble** — a **6ª** da tira. A ordem real do `main_notebook`,
conferida no `main.glade` e na foto de hoje, é Início, Status, No jogo, Gatilhos,
Lightbar, **Rumble**, Perfis, Sistema, Emulação, Navegação, Configurações.


> **Cabeçalho corrigido em 24/08/2026.** Ele dizia "Onda 10" — número da fila das 19h30 de 23/08, anterior à renumeração das 22h. A ordem viva é a da §0.2/§0.3 do [SPRINT_ORDER](../SPRINT_ORDER.md), e a regra de lá vale aqui: **o número vale pelo NOME DA ABA**.

| | |
|---|---|
| **Grau** | **MEDIDO** em tudo que tem comando ao lado (§2.1 e §2.2): três leituras read-only do daemon vivo, `json.load` sobre os 34 perfis dela, varredura por AST e cruzamento com o [mapa de canais](../../data/mapa-controles.csv). **DESENHO** na coreografia, nas tarefas e no custo. |
| **Fecha** | O clique que grava na peça e manda na mesa sem dizer uma palavra; o "Auto" que apaga o ajuste da peça em silêncio e escala os quatro pela bateria de um; o 7º applier que falta na saída do Modo Nativo; a trava manual de vibração que congela a mesa inteira; a aba que congela ao ser aberta; o contador que soma os quatro jogadores; três fatos errados vivos (dois no mapa, um num teste); e o caminho por peça DA ABA, que hoje não tem uma linha de teste. |
| **NÃO faz** | **Não faz a vibração por peça** (a E1 da [MESA-CHEIA-05](2026-08-13-MESA-CHEIA-05-o-rumble-por-mac-a-rota-que-ninguem-ligou.md), ~11 h medidas) — esta onda executa o ramo "rótulo honesto agora" da **D-G** dela. Não mede rádio: a trilha de Bluetooth é dela com o assistente, na mesa do specs (§6). Não mexe na escada de 11/08 (30 % / 100 % / 150 %). Não toca nenhuma outra aba além do rótulo compartilhado com a Configurações (RUM-7). |
| **Depende de** | **Onda 1** — Configurações ([CONFIGURACOES-FECHA-01](2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md)), porque o teto do orçamento nasce lá e morde aqui. E das frentes transversais **Z1**, **Z2**, **Z3** (dura), **Z5** e **Z6**. |
| **Não depende de Z0** | Esta aba **tem** host de retrato (`_montar_aba_rumble`, `scripts/gui-captura/retratar_abas.py:1470`, chamado em `:2212`). A foto de hoje é a tela de verdade, não o XML cru — ela não está entre as cinco da Z0. |

---

## 1. O defeito, em uma frase

**Com o Controle 2 escolhido no seletor, o clique grava a intensidade na peça e
manda o comando para a mesa inteira** — e a tela, que afirma o alvo três
centímetros acima, não diz nada sobre isso.

---

## 2. O que está medido, e o que é hipótese

### 2.1 Medido no daemon vivo, agora (23/08, nada parado, nada clicado, zero byte escrito)

Régua declarada: `daemon.state_full` pelo socket, lido direto.

```
$ .venv/bin/python -c "import json,socket; s=socket.socket(socket.AF_UNIX, socket.SOCK_STREAM); \
    s.connect('/run/user/1000/hefesto-dualsense4unix/hefesto-dualsense4unix.sock'); \
    s.sendall(json.dumps({'jsonrpc':'2.0','id':1,'method':'daemon.state_full','params':{}}).encode()+b'\n'); ..."

rumble_policy          = "balanceado"      <- mult canônico 1,0
rumble_mult_applied    = 0.7               <- a régua que mente
rumble_policy_custom_mult = 0.7
rumble_passthrough     = false
rumble_active          = [0, 0]            <- travada em SILÊNCIO agora
rumble_ff.vpads        = 1
rumble_ff.per_vpad     = [ {player: 1, ff_play_count: 0, ff_nao_nulo_count: 0, …} ]
connected (topo)       = true, transport "bt", battery 75%
controllers[0]         = {connected: false, transport: null}
```

**Quatro fatos saem daí, e os quatro mandam nesta sprint:**

1. **A régua mente e o dono é conhecido.** `policy="balanceado"` (1,0) com
   `rumble_mult_applied=0.7`. O 0,7 é o default de `DaemonConfig._last_auto_mult`
   (`daemon/lifecycle.py:624`), e o seed que existe para curar isso
   (`_seed_rumble_mult_observability`, `:3412`) só roda na ativação de perfil —
   num daemon que nunca ativou política, o campo fica preso no default. Quem
   diagnosticar por este número vai caçar atenuação onde não há. **É o MISC-08
   item 1 de volta pela porta do boot.**
2. **A foto de hoje e a máquina de hoje discordam.** O retrato usa a bancada
   `retratar_abas.py:1395-1399` (`rumble_passthrough: True`, `rumble_active: None`),
   e por isso a foto mostra, em verde, *"o JOGO controla a vibração"*. O daemon
   vivo diz `passthrough=false` e `active=[0,0]` — a linha real seria *"travada
   em silêncio"*. A foto é honesta com o dublê dela; ela **não** descreve a
   máquina.
3. **O contador por jogador EXISTE e a aba não o usa.** `rumble_ff.per_vpad`
   traz `ff_play_count`/`ff_nao_nulo_count` por vpad. Quem lê é o card do
   controle (`app/widgets/controller_card.py:1219-1224`, `:1423`), que mora na
   Status. A aba Rumble lê só o agregado (`rumble_actions.py:172-215`).
4. **A mesa está vazia para a lista de controles** e cheia para o topo do
   payload. É a Z5 em pessoa, e é o estado exato em que a aba comemora (§2.2/2).

### 2.2 Medido no código, hoje

**1 — O clique grava na peça e manda na mesa.** `_gravar_intensidade_no_rascunho`
(`app/actions/rumble_actions.py:672-707`) escreve `with_controller_rumble(uniq, …)`
quando há alvo; logo abaixo, `_set_policy` (`:576-593`) manda
`rumble_policy_set_checked(policy)` **sem endereço**, e o handler escreve
`daemon_cfg.rumble_policy`, que é da máquina inteira. A própria docstring do
método já diz a verdade — *"o que ela ouve na hora é o global; o que ela SALVA é
da peça"* — e **essa frase não está em lugar nenhum da tela.**

**2 — Mesa vazia comemora.** `_handle_rumble_set` (`daemon/ipc_handlers.py:3905-3919`)
devolve `{"status": "ok", "desfecho": RUMBLE_APLICADO}` sem consultar ninguém
sobre quem está na mesa; `_for_each_com_key` sem handles loga
`output_offline_noop` (`core/backend_pydualsense.py:2775`) e volta. Zero byte, e
o toast diz *"Vibração travada (fraca=160, forte=220)"*.

**E a cura já está escrita e nunca foi ligada.** `alvo_de_output_ausente`
(`core/backend_pydualsense.py:2661-2696`) responde exatamente *"o alvo está
apontado e fora da mesa"*, e a própria docstring declara a dívida: *"a metade «e
DIZ» ainda não chega à tela"*. Censo:

```
$ grep -rn "alvo_de_output_ausente" --include="*.py" src/ | wc -l    # 3 (1 def + 2 docstrings)
$ grep -rln "alvo_de_output_ausente" --include="*.py" tests/ | wc -l # 1 arquivo VERDE
```

**Zero chamadores de produção, um arquivo de teste verde.** É a forma F2, na
letra.

**3 — O "Auto" apaga o ajuste da peça em silêncio.** Medido rodando o modelo:

```
$ .venv/bin/python -c "from hefesto_dualsense4unix.app.draft_config import DraftConfig; \
    d=DraftConfig.default(); d=d.with_controller_rumble('aa:bb:cc:00:00:02', \
    d.rumble.model_copy(update={'policy':'auto','custom_mult':None})); \
    print(d.effective_rumble_for('aa:bb:cc:00:00:02').policy, d.to_ipc_dict().get('controllers'))"
None None
```

`with_controller_rumble` (`app/draft_config.py:1136`) trata `auto` como "limpa o
override e devolve a peça ao global", e isso é **deliberado e documentado** — o
esquema recusa `auto` por unidade porque ele escala pela bateria do PRIMÁRIO
(`profiles/schema.py:778-810`). O defeito não é a regra: é que **a tela não conta**.
O toast diz *"Intensidade da vibração: Auto"*, o botão fica afundado, o daemon
recebe `auto` global — e o override da peça foi apagado.

**4 — O "Auto" escala os QUATRO pela bateria de UM.** `apply_rumble_policy`
(`daemon/ipc_rumble_policy.py:32-42`) e `reassert_rumble`
(`daemon/subsystems/rumble.py:274-281`) leem `store.snapshot().controller` — o
primário — e o rótulo da tela diz *"conforme a bateria **do controle**"*
(`gui/main.glade:1795-1812`), no singular, sem dizer qual. Com quatro na mesa, o
jogador 1 decide a força dos outros três.

**5 — O 7º applier continua faltando na saída do Modo Nativo.** Varredura por
AST, hoje:

```
$ .venv/bin/python -c "import ast; t=ast.parse(open('src/hefesto_dualsense4unix/daemon/lifecycle.py').read()); \
    [print(n.lineno, [k.arg for k in n.keywords if k.arg and k.arg.endswith('_applier')]) \
     for n in ast.walk(t) if isinstance(n, ast.Call) and getattr(n.func,'id',None)=='ProfileManager']"
1196 ['mouse_applier','suppression_applier','mode_applier','rumble_policy_applier','speaker_applier','mic_applier']
```

Seis de sete. Falta `rumble_passthrough_applier`, e a construção é a de
`_reapply_last_profile` (`daemon/lifecycle.py:1178`), a rota que roda ao
**desligar o Modo Nativo**. Applier ausente não levanta: a seção é ignorada em
silêncio. O perfil manda `passthrough: true` e ninguém lê — a vibração não volta
para o jogo. A [A-FÁBRICA-COM-UM-CLIENTE-01](2026-08-22-A-FABRICA-COM-UM-CLIENTE-01-a-saida-do-modo-nativo-perde-um-applier.md)
diagnosticou isto em 22/08 e a E1 dela **continua aberta**.

**6 — A aba não tem pulso.** O único temporizador do arquivo é o do teste de
500 ms (`rumble_actions.py:777`). A aba se pinta em `install_rumble_tab`
(`app/app.py:1339`, `:1604`) e na troca de aba (`app/app.py:1017`). Aberta e
deixada aberta, ela **nunca mais atualiza**: se o jogo começar a pedir vibração,
ou o controle sair da mesa, a linha de estado continua dizendo o de antes.

**7 — A trava manual congela a mesa inteira.** `rumble.set`/`rumble.stop` armam
`mark_manual_trigger_active("rumble")` (`daemon/ipc_handlers.py:3914`, `:4021`),
e `manual_override_categories` é um `set[str]` **sem chave por MAC**
(`daemon/state_store.py:297-310`). Enquanto armada, o autoswitch não reaplica
perfil para **nenhum** controle. É o Defeito 1 da
[POSSE-POR-CONTROLE-01](2026-08-03-POSSE-POR-CONTROLE-01-a-trava-de-um-controle-congela-os-quatro.md),
vivo: *"mexi na vibração do controle 3, e desde então nenhum perfil pega em
nenhum"*.

**8 — Três fatos errados vivos.** Cruzamento com o mapa e com a suíte:

| onde | o que diz | o que é |
|---|---|---|
| `docs/data/mapa-controles.csv`, `vibracao.rumble.ff` + `combinacao.rumble_simultaneo`, célula `*_ressalva` | *"o multiplicador de intensidade da GUI (Economia 0,3x / Balanceado 0,7x / máximo 1,0x)"* | a escada dela desde 11/08 é **0,3 / 1,0 / 1,5** (`daemon/subsystems/rumble.py:82-86`) |
| `docs/data/mapa-controles.csv`, `vibracao.rumble.ff`, célula `estado_hoje` | *"A cura ainda NAO foi escrita"* | está escrita **e ligada**: `OUT_REPORT_KEEPALIVE_CONFIRMACAO_SEC = 2.0` (`core/backend_pydualsense.py:264`), consumida no laço vivo em `:844-851`, com mordida em `tests/unit/test_rumble_sem_dono_01.py` |
| `tests/unit/test_politica_de_vibracao_a_escada_que_amplifica.py:236` | *"Máximo passou a valer 200%"* | 150 %. O mesmo arquivo diz 1,5 na linha 8 — **ele se contradiz consigo mesmo** |

**9 — O caminho por peça DA ABA não tem um teste.** Os dois métodos que o fazem
(`_rumble_edit_uniq`, `_gravar_intensidade_no_rascunho`) aparecem em
`tests/unit/test_rumble_actions.py:288-289` **só na lista de composição do dublê**.
Nenhum teste desta casa arma `_edit_target_uniq` num host de Rumble e afirma o
que acontece:

```
$ grep -rn "_edit_target_uniq" tests/ | grep -ci rumble    # 0
```

Os dois testes de `with_controller_rumble` que existem
(`tests/unit/test_por_unidade_01_todas_as_abas.py:540`, `:565`) exercitam o
**modelo**, não a aba.

**10 — O perfil dela não guarda nada disto.** `json.load` sobre os 34 perfis em
`~/.config/hefesto-dualsense4unix/profiles/`:

```
perfis: 34   |   com a seção "controllers": 0   |   rumble.policy = null em 27 de 34
sackboy.json -> rumble: {"passthrough": true, "policy": null, "custom_mult": null}
```

O `sackboy.json` — o jogo de quatro pessoas desta casa — não tem opinião de
intensidade e não tem seção por controle. É a Z4 nesta aba, e é por isso que
`_sync_policy_from_state(indicar_sem_opiniao=True)` dispara ao abrir a aba com o
Sackboy ativo.

**11 — A linha do teto do orçamento nunca apareceu na máquina dela.**

```
$ ls ~/.config/hefesto-dualsense4unix/maquina.json
ls: não foi possível acessar ... : Arquivo ou diretório inexistente
$ .venv/bin/python -c "from hefesto_dualsense4unix.utils.maquina import carregar_maquina; \
    from hefesto_dualsense4unix.core.rumble import teto_do_orcamento; \
    print(carregar_maquina().orcamento.teto, teto_do_orcamento(carregar_maquina().orcamento.teto))"
None None
```

A CONFIG-05 foi entregue em 22/08 e o caminho está inteiro; o que falta é o
arquivo onde a escolha mora, e ele nunca nasceu porque a aba é diferida e ela
nunca apertou "Aplicar" (Z7/F8). **Consequência para esta onda:** nenhuma
medição desta bancada sobre o teto é medição do caminho vivo — só do código.

### 2.3 NÃO VERIFICADO — e continua não verificado

1. **Se quatro controles vibram ao mesmo tempo hoje.** O mapa registra `sim` nos
   dois transportes, medido em 11/08 — mas medido **antes** da cura do keepalive
   (item 8 acima). Ninguém remediu depois. E a bancada de hoje tem, no máximo,
   um DualSense: nenhum número desta leva sobre 2 ou 4 controles é medição viva.
2. **Se o rumble FIXADO pela aba chega ao motor por rádio.** A mordida do CSV
   (`test_paridade_transporte_rumble.py`) prova o **BYTE** no envelope, não o
   motor girando.
3. **Se a vibração do JOGO chega ao motor por rádio.** Ver §6.
4. **Se o `rumble_mult_applied` preso em 0,7 já mandou alguém caçar errado.** O
   número está errado; o custo dele não foi medido.

---

## 3. A coreografia dos agentes

**Sete agentes.** Dois deles fazem primeiro a auditoria que não houve, e o
desenho das onze tarefas seguintes só fecha depois disso.

### Rodada 0 — os dois batedores, em paralelo, NADA de código

| agente | faixa | devolve |
|---|---|---|
| **A1 — o batedor do código e da bancada** | `app/actions/rumble_actions.py` (1038 linhas), `daemon/ipc_handlers.py` nos handlers `rumble.*`, `daemon/subsystems/rumble.py`, `daemon/ipc_rumble_policy.py`, `core/rumble.py`, `core/backend_pydualsense.py` na parte de rumble, e os 15 arquivos de teste de `tests/unit/*rumble*` | Achados com `arquivo:linha`; para cada um, se ele sobrevive à Z1/Z2/Z3/Z5 (várias tarefas daqui podem virar no-op); e o resultado de **arrancar a cura** de cada teste listado — quais passam com a cura fora |
| **A7 — o batedor da tela e do mapa** | a foto `../../usage/assets/readme_rumble.png`, `docs/usage/interface.md` na seção da aba, as 8 chaves `vibracao.*` e a `combinacao.rumble_simultaneo` do CSV, e o `specs.html` | Cruzamento linha a linha tela↔mapa; toda promessa da tela sem lastro; todo fato caduco além dos três do §2.2/8; e a redação PROPOSTA das frases novas de RUM-1, RUM-3, RUM-4 e RUM-7, para irem juntas ao olho dela num lote só |

**Portão de replanejamento.** Quem orquestra relê RUM-1..RUM-11 à luz dos dois
relatórios **antes** de disparar a rodada 1. Tarefa derrubada sai com nota
datada; achado novo entra numerado.

### Rodada 1 — quatro agentes em paralelo, faixas disjuntas

| agente | tarefas | faixa |
|---|---|---|
| **A3 — o dono do daemon desta aba** | RUM-5, RUM-6 | `daemon/lifecycle.py`, `daemon/state_store.py`, `daemon/ipc_handlers.py` |
| **A5 — o dono do pulso** | RUM-8 | `app/app.py`, `app/actions/rumble_actions.py` (só o método de tique) |
| **A6 — o dono do contador** | RUM-9 | `app/actions/rumble_actions.py` (só `texto_dos_pedidos_de_vibracao`) |
| **A7 — o dono do mapa e das mordidas** | RUM-10, RUM-11 | `docs/data/mapa-controles.csv`, `tests/unit/` |

A5 e A6 tocam o mesmo arquivo em funções disjuntas e não adjacentes; se o
batedor A1 disser que colidem, os dois passam para série na rodada 2.

### Rodada 2 — em SÉRIE na faixa `rumble_actions.py` + `main.glade`

Série, não paralelo: as quatro tarefas mexem no mesmo par de arquivos, e RUM-2
depende do alcance já nomeado por RUM-1.

| agente | tarefas |
|---|---|
| **A1 — o dono do alcance** | RUM-1 e, **depois**, RUM-2 |
| **A2 — o dono do "Auto"** | RUM-3 e, **depois**, RUM-4 |
| **A4 — o dono do vocabulário** | RUM-7 |

### Rodada 3 — o fechamento

A7 roda `scripts/gui-captura/retratar_abas.py`, o lote de fotos vai para o olho
dela junto com as quatro redações novas (D3, classe estrutural), e A7 fecha as
mordidas de RUM-11 contra a árvore já curada.

---

## 4. As tarefas

**Treze.** Duas de auditoria, onze de execução.

---

### RUM-0a — A auditoria de código e de bancada que não houve *(A1)*

**Arquivos:** os do §3, rodada 0. **Nenhuma linha escrita em produto.**
**A mordida:** não se aplica — é medição. O que a substitui: **todo achado vem
com `arquivo:linha` e com o comando que o produziu**; achado sem endereço é
descartado na leitura. E para cada um dos 15 arquivos de teste de rumble, o
relatório diz se ele **morde** (arrancar a cura reprova) ou se é verde decorativo.
**Custo:** ~2 h 30. **Carimbo:** não toca a tela.

---

### RUM-0b — A auditoria de tela e do mapa *(A7)*

**Arquivos:** os do §3, rodada 0. **Nenhuma linha escrita.**
**A mordida:** não se aplica. O que a substitui: **toda divergência tela↔mapa vem
com a célula do CSV citada**, e as quatro redações propostas vêm em UM bloco, para
o olho dela decidir de uma vez.
**Custo:** ~1 h 30. **Carimbo:** não toca a tela.

---

### RUM-1 — O alcance vira texto: a aba diz onde grava e onde manda *(A1)*

Este é o ramo **"rótulo honesto agora"** da **D-G** dela. A granularidade por
peça fica para a 1.0 (§9).

**Arquivos:** `gui/main.glade` (card "Intensidade da vibração dos jogos"),
`app/actions/rumble_actions.py:576-593` e `:672-707` (os toasts).

**O conserto:** com um alvo escolhido no seletor, a aba passa a dizer as duas
coisas que ela hoje cala — que o comando vivo vai para a mesa e que só o **perfil**
fica da peça. A frase é a que a docstring já escreveu e nunca publicou; a
redação final é dela (A7 propõe em RUM-0b). Com "Todos" no seletor a linha **não
aparece**: ali não há divergência a confessar.

**A mordida:** arranque a linha e monte o host de Rumble com `_edit_target_uniq`
apontando para uma peça; o teste tem de reprovar dizendo que a aba afirmou o
alvo sem dizer o alcance. Régua: o texto lido do `Gtk.Label` depois da montagem,
no molde do `test_a_mesa_cheia_na_foto.py` — **não** OCR.

**Custo:** ~40 linhas, 2 h.
**Carimbo:** **estrutural — espera o olho dela** (texto novo na tela).

---

### RUM-2 — Mesa vazia deixa de comemorar *(A1)*

**Arquivos:** `daemon/ipc_handlers.py:3905-3919` (`rumble.set`) e o irmão em
`:4019-4030` (`rumble.stop`); `app/actions/rumble_actions.py` nos dois toasts.

**O conserto:** os dois handlers consultam
`core/backend_pydualsense.py:2661` (`alvo_de_output_ausente`) **antes** de
escrever, e devolvem `{"status": "recusado", "motivo": …}` no molde que a
NATIVO-RUMBLE-01 já usa três linhas acima. A aba já sabe ler esse molde
(`rumble_set_checked`, `rumble_stop_checked`) — **nenhuma frase nova precisa
nascer para o caminho de recusa**, só a do motivo. Isto é a Z1 nesta aba, e é
o chamador de produção que falta ao método órfão do §2.2/2.

**A mordida:** arranque a consulta; o teste arma o alvo num MAC que não está nos
handles, chama `rumble.set(160, 220)` e exige `status == "recusado"` com zero
escritas no `FakeController`. Hoje ele devolve `ok` e escreve zero — **é essa a
diferença que morde**: o teste separa "não fez" de "fez e não contou".

**Custo:** ~35 linhas, 2 h.
**Carimbo:** **estrutural** (o motivo é texto novo) — vai no mesmo lote de RUM-1.

---

### RUM-3 — O "Auto" com peça escolhida para de apagar em silêncio *(A2)*

**Arquivos:** `app/actions/rumble_actions.py:676-707`, `gui/main.glade` (o
`rumble_policy_auto_label`).

**O conserto:** com uma peça escolhida, clicar "Auto" passa a **dizer** o que
faz: devolve aquela peça ao ajuste geral (é a leitura honesta do gesto, e a regra
do `with_controller_rumble` está certa — ver `app/draft_config.py:1122-1128`) e
liga o Auto para a mesa. Hoje ele faz exatamente isso e não conta, com o botão
afundado e o toast dizendo só *"Intensidade da vibração: Auto"*.

**A mordida:** arranque a frase; o teste grava `policy="max"` na peça, arma o
alvo nela, clica Auto e exige que o toast **nomeie** o apagamento. Sem a cura, o
toast é indistinguível do caso "Todos", e o override some sem uma palavra.

**Custo:** ~25 linhas, 1 h 30.
**Carimbo:** **estrutural — espera o olho dela**.

---

### RUM-4 — O "Auto" diz de qual bateria *(A2)*

**Arquivos:** `gui/main.glade:1683-1717` (a dica do botão) e `:1795-1812` (o
rótulo educativo).

**O conserto:** *"a bateria do controle"* vira *"a bateria do controle principal"*
— porque é isso que `daemon/ipc_rumble_policy.py:32-42` lê, e é isso que
`profiles/schema.py:778-786` já explica por escrito no esquema. A frase de hoje
promete, com quatro na mesa, um comportamento por jogador que o produto não faz.
**Não é a granularidade** (essa é da 1.0): é a tela parar de prometê-la.

**A mordida:** o portão `scripts/validar-palavra-de-tela.py` ganha a regra de que
a promessa de "bateria" nesta aba tem de nomear o escopo; plantar de volta o
texto singular reprova nomeando o `id` do widget.

**Custo:** ~12 linhas, 1 h.
**Carimbo:** **estrutural — espera o olho dela** (texto reescrito).

---

### RUM-5 — O sétimo applier na saída do Modo Nativo *(A3)*

**Arquivo:** `daemon/lifecycle.py:1196`.

**O conserto:** a construção à mão sai e entra `gerente_do_daemon`
(`profiles/manager.py:1719`), que é a fábrica que existe exatamente para isto e
já é o cliente de seis outras rotas. É a **E1** da A-FÁBRICA-COM-UM-CLIENTE-01,
e ela morre aqui.

**A mordida:** o teste roda a varredura por AST sobre `src/` e exige que
**nenhuma** construção de `ProfileManager` numa rota de daemon tenha menos que os
sete de `APPLIERS_DO_DAEMON`. Trocar a fábrica de volta pela lista à mão reprova
nomeando `lifecycle.py:1196`. Sem ela, o defeito volta na próxima rota nova — foi
assim que ele nasceu.

**Custo:** ~10 linhas de produto + ~40 de teste, 1 h 30.
**Carimbo:** não toca a tela.

---

### RUM-6 — A trava manual de vibração deixa de congelar os quatro *(A3)*

**Arquivos:** `daemon/state_store.py:297-331`, `daemon/ipc_handlers.py:3914`,
`:4021`, `:4058`; o leitor em `profiles/manager.py`.

**O conserto:** `manual_override_categories` ganha chave por MAC — `(categoria,
uniq)` — com `uniq=None` significando "a mesa toda", que é o que o gesto
"Todos" quer dizer. Quem arma passa o dono congelado no gesto
(`uniq_do_alvo_de_output`, `daemon/ipc_rumble_policy.py:75`, que já existe e já é
usado pelo rumble por dono). É o Defeito 1 da POSSE-POR-CONTROLE-01, na fatia de
vibração — **só a de vibração**: LED e gatilho são das Ondas 7 · Lightbar e 8 · Gatilhos, e cada uma
carrega a sua.

**A mordida:** o teste arma a trava de vibração no Controle 2, muda a janela em
foco e exige que o autoswitch **reaplique** o perfil no Controle 3. Hoje ele não
reaplica em nenhum. Arrancar a chave por MAC reprova.

**Custo:** ~60 linhas, 3 h.
**Carimbo:** não toca a tela.

---

### RUM-7 — A aba admite que existe um teto de mesa *(A4)*

**Arquivos:** `gui/main.glade` (as três dicas de botão), `app/actions/rumble_actions.py`
nas funções `texto_do_teto_do_orcamento` e `_pintar_a_linha_do_teto`.

**O defeito:** Economia / Balanceado / Máximo significam **PEDIDO** aqui e
**TETO** na aba Configurações, e as três dicas desta aba não dizem uma palavra
sobre a existência do teto. A linha que avisa quando ele morde já está escrita e
correta (CONFIG-05, entregue em 22/08) — e **nunca apareceu na máquina dela**,
porque `maquina.json` não existe (§2.2/11).

**O conserto:** as dicas dos três botões passam a nomear o teto de mesa em uma
oração, no vocabulário que a Configurações já usa (`SEM_TETO`, `TETO_ALCANCE` em
`app/actions/config/secao_orcamento.py`) — sem redigitar nada: o dono dos rótulos
já é público (`ROTULOS_DO_ORCAMENTO`).

**Aviso ao executor:** o `TOOLTIPS.md` e o mockup da pasta da Configurações ainda
carregam a versão antiga de uma dica corrigida em 22/08 (a terceira correção
datada do CONFIG-05). Corrija os dois na mesma leva — correção pela metade deixa
as duas versões vivas.

**A mordida:** o portão de palavra de tela exige que toda dica dos quatro botões
que fale de força nomeie o teto quando ele existe; apagar a oração reprova.

**Custo:** ~20 linhas, 1 h 30.
**Carimbo:** **estrutural — espera o olho dela**.

---

### RUM-8 — O pulso: a aba deixa de congelar *(A5)*

**Arquivos:** `app/app.py:1017` (o mapa de refresh), `app/actions/rumble_actions.py`
(um método de tique).

**O conserto:** a aba entra no relógio único que a **Z5** cria — não um
temporizador próprio, que é como o produto ganharia onze relógios. O que ela
repinta a cada tique é o que já muda sozinho: o rótulo de estado
(`_update_rumble_state_label`) e o aviso de alcance. Os quatro botões e os dois
deslizadores **não** são repintados enquanto um popup estiver aberto: repintar
widget sob o dedo dela é o defeito que o `_rumble_guard_refresh` existe para
evitar.

**A mordida:** tire a entrada da aba Rumble do mapa de refresh da Z5 e o teste
tem de reprovar **nomeando a aba**. É a mordida que a Z5 já pede para todas — o
que esta tarefa acrescenta é a linha da Rumble nela.

**Custo:** ~20 linhas, 1 h 30.
**Carimbo:** não toca a tela — nenhum texto novo, nenhuma ordem nova; muda só a
frequência com que a linha existente se atualiza.

---

### RUM-9 — O contador de pedidos, por jogador *(A6)*

**Arquivo:** `app/actions/rumble_actions.py:105-215` (`texto_dos_pedidos_de_vibracao`).

**O conserto:** quando `rumble_ff.per_vpad` traz mais de um jogador, a linha
passa a dizer **por jogador** em vez de somar. O dado já está no payload e o
formato já foi resolvido pelo card do controle
(`app/widgets/controller_card.py:1412-1430`) — copie a leitura, não invente
outra. Com um jogador só, a frase fica **byte-idêntica** à de hoje: nenhum
usuário de um controle vê mudança.

**A ordem da verdade não muda.** As sete perguntas do docstring (Conexão Nativa →
dado ausente → estranhos → descartados → não-nulos → força zero → sem vpad)
continuam na mesma ordem e pelo mesmo motivo; o que muda é o **escopo** da
resposta.

**A mordida:** monte um `state` com dois vpads, um pedindo 40x e o outro 0x, e
exija que a linha nomeie os dois. Somar (o comportamento de hoje) reprova, porque
"o jogo pediu 40x" com um jogador mudo manda caçar no lugar errado.

**Custo:** ~45 linhas, 2 h.
**Carimbo:** **estrutural — espera o olho dela** (texto novo com a mesa cheia).

---

### RUM-10 — Os três fatos errados: dois no mapa, um no teste *(A7)*

**Arquivos:** `docs/data/mapa-controles.csv` (as células do §2.2/8) e
`tests/unit/test_politica_de_vibracao_a_escada_que_amplifica.py:236`.

**O conserto:** número errado **sai**, sem nota nem data — é a regra dela de
11/08. A escada `0,3 / 0,7 / 1,0` das duas células vira `0,3 / 1,0 / 1,5`; o
*"a cura ainda NAO foi escrita"* vira o endereço da cura que está viva; e o
*"200 %"* do teste vira 150 %. **E sai de TODOS os lugares onde aparece** — a
varredura roda sobre `docs/`, `tests/` e `src/` de uma vez, não só nos três
endereços conhecidos.

**Não confundir com decisão medida:** a dose-resposta de 11/08 (0,5 s → pulso;
8,0 s → oito segundos) é medição e **fica**, com a data. O que sai é a afirmação
de que a cura não existe, que a árvore de hoje desmente.

**Já corrigido, não refaça:** a nota da §5 do SPRINT_ORDER diz que a linha 89
daquele teste importa a tabela de `daemon/lifecycle.py`. Ela importa do dono
declarado (`daemon/subsystems/rumble.py`) desde então — conferido hoje nas linhas
39-42.

**A mordida:** `scripts/check_paridade_transporte.py` ganha a régua que compara os
números de multiplicador citados em célula de CSV com `RUMBLE_POLICY_MULT`;
replantar a escada velha reprova nomeando a chave e a coluna. **Sem esta régua a
tarefa é faxina, e faxina volta** — é o mesmo portão cego que a
[AUDITORIA-DE-PERDA-01](2026-08-23-AUDITORIA-DE-PERDA-01-tres-portoes-verdes-que-nao-medem-nada.md)
mediu em 23/08.

**Custo:** ~30 linhas de portão + as células, 2 h.
**Carimbo:** não toca a tela.

---

### RUM-11 — O arquivo de mordidas do caminho por peça DA ABA *(A7)*

**Arquivo novo:** `tests/unit/test_rumble_por_jogador_01.py`. <!-- ref-externa: arquivo a CRIAR por esta entrega, ainda não existe -->

**O conserto:** o caminho por peça da aba passa a ter teste. Quatro mordidas,
todas com `FakeController` e host de composição, no molde do
`tests/unit/test_rumble_actions.py`:

| # | arranque | por que reprova |
|---|---|---|
| 1 | a linha de alcance de RUM-1 | com alvo escolhido, a aba afirma o alvo e cala o escopo |
| 2 | a consulta de RUM-2 | `rumble.set` com alvo fora da mesa devolve `ok` e escreve zero byte |
| 3 | a frase de RUM-3 | clicar Auto com peça escolhida apaga o override sem uma palavra |
| 4 | a leitura por vpad de RUM-9 | dois jogadores viram um número somado |

**A mordida da mordida:** o arquivo nasce **vermelho** na rodada 1, antes de
qualquer cura — e A7 registra a saída do vermelho no relatório. Um arquivo de
teste que nasce verde não provou nada.

**Custo:** ~180 linhas, 3 h.
**Carimbo:** não toca a tela.

---

## 5. O custo, somado

| rodada | tarefas | custo |
|---|---|---|
| 0 | RUM-0a, RUM-0b | ~4 h |
| 1 | RUM-5, RUM-6, RUM-8, RUM-9, RUM-10, RUM-11 | ~13 h 30 (quatro agentes em paralelo → ~5 h de relógio) |
| 2 | RUM-1, RUM-2, RUM-3, RUM-4, RUM-7 | ~8 h (três agentes, dois em série → ~4 h de relógio) |
| 3 | fotos + olho dela + fechamento das mordidas | ~1 h + o tempo dela |

**~26 h de agente, ~14 h de relógio.** Não inclui a vibração por peça (§9).

---

## 6. O que o Bluetooth bloqueia

A trilha de BT é dela com o assistente, na mesa do specs (**D2**). Esta sprint
**não** planeja medição de rádio. O que ela declara é o que a aba **não pode
afirmar na tela** enquanto a medição não existir.

| pergunta de BT | o que ela trava aqui | onde está registrado |
|---|---|---|
| **A vibração do JOGO chega ao motor por rádio?** | **É a frase central do card de cima.** `vibracao.rumble.passthrough` tem `radio_de_onde_sei = inferido-do-codigo` e a ressalva literal *"Implementado sem gate, mas NÃO MEDIDO por Bluetooth"*. Enquanto isso valer, a aba **não pode** dizer que o multiplicador dela alcança a vibração do jogo por rádio — o aviso de alcance (`texto_do_alcance_da_intensidade`) fala de gamepad virtual, não de transporte, e é isso que ele tem de continuar fazendo | [mapa](../../data/mapa-controles.csv), `vibracao.rumble.passthrough`, controle `dualsense` |
| **O rumble FIXADO pela aba chega ao motor por rádio?** | "Testar por 500 ms" e "Aplicar" **não podem prometer o motor** por rádio. A mordida do CSV (`test_paridade_transporte_rumble.py`) prova que os bytes saem nos offsets certos nos dois envelopes — **o BYTE, não o motor** | `vibracao.rumble.esquerdo` / `.direito`, coluna `mordida` |
| **Quatro no rádio vibrando ao mesmo tempo, com quantos adaptadores?** | A aba **não pode** afirmar nada sobre mesa cheia por rádio. `combinacao.rumble_simultaneo` diz `sim` nos dois transportes, medido em 11/08 **com três adaptadores e antes da cura do keepalive** — e a bancada de hoje tem no máximo um DualSense | `combinacao.rumble_simultaneo`, `provado_em: 2026-08-11` |
| **O keepalive ainda cancela rumble de terceiro por rádio?** | Trava RUM-10: a célula não pode ser reescrita como "curado" sem medição. O que RUM-10 corrige é a afirmação **falsa** de que a cura não foi escrita — não a de que ela funciona no aparelho | `core/backend_pydualsense.py:255-264`; mordida em `tests/unit/test_rumble_sem_dono_01.py`, que prova o LAÇO, não o motor |

**A regra para o executor:** nenhuma frase nova desta onda pode afirmar
comportamento **por transporte**. Onde a frase precisar falar de rádio, ela fala
do que o produto MANDA, nunca do que o motor FAZ — é o padrão que a queixa do
Sackboy revelou (*"o produto responde pelo transporte, não pelo efeito"*).

---

## 7. As sprints absorvidas

| sprint | o que ela contribui | morre aqui? |
|---|---|---|
| [MESA-CHEIA-05](2026-08-13-MESA-CHEIA-05-o-rumble-por-mac-a-rota-que-ninguem-ligou.md) | O diagnóstico inteiro de "grava na peça, manda na mesa" (§1.b), o custo medido da E1 (~11 h) e a **D-4** dela. A **E0** (o rumble que migrava de dono) **já foi entregue** — conferido hoje: `rumble_active_uniq`, `escrever_rumble_no_dono` e `silenciar_dono_abandonado` estão vivos em `daemon/subsystems/rumble.py` | **Não.** Sobrevive com a E1, que é a vibração por peça (§9) |
| [A-FÁBRICA-COM-UM-CLIENTE-01](2026-08-22-A-FABRICA-COM-UM-CLIENTE-01-a-saida-do-modo-nativo-perde-um-applier.md) | A **E1**, o último item aberto dela: `lifecycle.py:1196` com 6 de 7 appliers | **Sim.** RUM-5 a fecha |
| [POSSE-POR-CONTROLE-01](2026-08-03-POSSE-POR-CONTROLE-01-a-trava-de-um-controle-congela-os-quatro.md) | O **Defeito 1** (trava manual global) na fatia de vibração | **Não.** Fica com as fatias de LED (Onda 8) e gatilho (Onda 9) |
| [CONFIG-05](2026-08-21-ABA-CONFIGURACOES/CONFIG-05-orcamento-como-teto.md) | O teto como invariante "teto, não troca", os rótulos compartilhados e a correção datada que ficou pela metade no `TOOLTIPS.md` | **Sim.** RUM-7 a fecha |
| [OITO-DEFEITOS-01](2026-08-08-OITO-DEFEITOS-01-a-fila-que-a-verificacao-adversarial-derrubou-inteira.md) | A §2.5: a hipótese de máscara **caiu por correção dela** e o rumble ficou sem causa provada. O que esta onda acrescenta é onde procurar: mesa vazia (RUM-2), applier ausente (RUM-5) e alcance (RUM-1) | **Não.** As §2.3, §2.6 e §2.8 são de outras ondas |
| [O-LAÇO-DE-ESCRITA-01](2026-08-15-O-LACO-DE-ESCRITA-01-o-suspeito-que-sobrou.md) | A dívida da §8: com a mesa cheia o laço lê 31,25 reports/s de um fluxo de 200-360/s, e **a bateria que a tela mostra está ~2 s atrasada**. É a bateria que o "Auto" usa (RUM-4) | **Não.** O ensaio de saturação é dela |
| [O-LAÇO-DE-ESCRITA-02](2026-08-15-O-LACO-DE-ESCRITA-02-os-dois-achados-viram-cura.md) | Já **CONCLUÍDA**. Entra como contexto: é o laço que carrega o keepalive e os bytes de motor, e é ele que RUM-10 descreve | **Já morta.** Nada a fazer |
| [ABAS-01](2026-07-25-ABAS-01-as-abas-brigam-pelo-mesmo-estado.md) | A **ABAS-04**, dentro dela: "Parar" e "Deixar o jogo controlar" escrevendo no rascunho — a cura está viva em `_zerar_rumble_no_rascunho`. E a invariante "espelhar estado entre abas é o defeito", que RUM-7 obedece ao **exibir** em vez de reescrever | **Não.** Ela espera a validação dela na janela |

---

## 8. O aceite

Tudo verde, com a mesa vazia **e** com a mesa cheia (o que a mesa cheia só ela
fecha está no §9).

```bash
git add -A                                  # os portões não veem arquivo novo
.venv/bin/python -m pytest -q
.venv/bin/python -m pytest -q tests/unit/test_rumble_por_jogador_01.py    # o arquivo novo de RUM-11
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
python3 scripts/check_paridade_transporte.py    # com a régua nova de RUM-10
scripts/gui-captura/retratar_abas.py            # a foto acompanha a leva
```

E, além dos portões, a lista do que tem de estar verificado:

1. **Cada uma das onze tarefas tem a sua mordida rodada com a cura ARRANCADA**, e
   o relatório de A1/A7 diz qual foi a saída vermelha. Mordida não rodada em
   vermelho não conta.
2. **`alvo_de_output_ausente` tem chamador de produção** — o censo do §2.2/2
   repetido tem de trazer ao menos um endereço em `src/` que não seja docstring.
3. **A varredura por AST de `ProfileManager` não acha construção com menos de
   sete appliers** em rota de daemon.
4. **A escada `0,3 / 0,7 / 1,0` não existe mais em lugar nenhum** de `docs/`,
   `tests/` ou `src/` — a varredura roda **duas vezes** e não acha nada na
   segunda. É a disciplina da Z6.
5. **O daemon foi reiniciado antes de qualquer medição de bancada.** Com install
   editable, cura de daemon só vale no próximo start, e o sintoma de esquecer é a
   **ausência** de dado novo, nunca um erro.
6. **As quatro frases novas passaram pelo olho dela**, em um lote (D3, classe
   estrutural: RUM-1, RUM-3, RUM-4, RUM-7 — e o motivo de recusa de RUM-2).
7. **Se algum agente parou o daemon, ele o religou e confirmou.**

---

## 9. O que fica aberto, e de quem é

**Dela:**

| item | o que é |
|---|---|
| **D-G — vibração por peça: agora ou na 1.0?** | Esta onda executa o ramo *"rótulo honesto agora"* (RUM-1, ~2 h). O outro ramo — a política por peça de verdade — está desenhado na **E1** da MESA-CHEIA-05 e custa **~11 h medidas**: `rumble_active` vira par + mapa por MAC, o `rumble.set` do bridge ganha endereço, o `state_full` expõe os quatro estados. **A mentira é o que fere; a granularidade é conforto** — mas a palavra é dela |
| **D-4 — a intensidade é da PEÇA ou da MÁQUINA?** | A pergunta de 13/08 que trava a E1. Hoje o produto responde as duas ao mesmo tempo, e é isso que RUM-1 confessa em vez de resolver |
| **O `rumble.passthrough` continua um só?** | A recusa de 10/08 (`profiles/schema.py:768-777`) diz que ele descreve *quem manda na vibração agora*, não a peça. Recomendo manter. Quem revoga decisão dela é ela |
| **O "Parar" dentro do Modo Nativo: soltar ou recusar?** | A medição de 19/08 levantou a pergunta e não a respondeu (`daemon/ipc_handlers.py`, docstring de `_handle_rumble_stop`) |

**Da bancada dela, e só ela fecha:**

- **que o Controle 1 fica quieto enquanto o 2 vibra** — a prova inteira do
  alcance, e exige dois controles na mão;
- **e a metade que vale tanto quanto a ida: que o motor PARA.** Regra da casa
  desde 10/08 — uma feature que liga e não desliga passaria por aprovada;
- **as quatro perguntas de BT do §6**, na trilha dela com o assistente.

**De outra onda:**

- **Z5** entrega o relógio único de que RUM-8 depende. Sem ele, RUM-8 vira um
  temporizador próprio, e aí o produto ganha o décimo primeiro relógio — **não
  faça**;
- **Z2** entrega o dono do alvo. Hoje `_rumble_edit_uniq` lê
  `getattr(self, "_edit_target_uniq", None)` (`rumble_actions.py:661-671`), e o
  default silencioso é a queda para escrita global. Enquanto a Z2 não chegar,
  RUM-1 confessa o alcance mas **não** conserta a queda;
- **Onda 1 (Configurações)** entrega o teto vivo. Enquanto `maquina.json` não
  nascer no disco dela (Z7), a linha de teto de RUM-7 é código provado e
  comportamento não observado.
