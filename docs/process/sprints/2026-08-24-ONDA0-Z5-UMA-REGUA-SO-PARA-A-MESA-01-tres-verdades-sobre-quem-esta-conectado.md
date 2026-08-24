# ONDA 0 · Z5 — uma régua só para a mesa: três verdades sobre quem está conectado

**24/08/2026. GRAU: MEDIDO**, exceto onde a linha diz DESENHO ou NÃO VERIFICADO.
Frente **Z5** da Onda 0 — as invariantes, na
[§0.2 do SPRINT_ORDER](../SPRINT_ORDER.md). Diagnóstico:
[ONDE PARAMOS de 23/08](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md).
Coreografia: [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md).

**Bancada da medição:** daemon vivo desde `Sun 2026-08-23 18:33:39 -03`
(PID 282194), medido às **22h30-22h35 de 23/08**. Árvore: commit `c111d74`,
branch `dev`. **Todas as âncoras `arquivo:linha` abaixo foram conferidas contra
essa árvore, uma a uma.**

**Os defeitos de forma que esta frente cura:** **F6** (três réguas do mesmo
daemon discordam sobre quem está na mesa) e, por consequência, **F5** (oito
pares de abas com duas verdades sobre o mesmo fato). Junto vêm as duas metades
gêmeas: **F2** (o daemon publica e ninguém lê) e **F13** (a tela lê uma vez e
nunca mais).

**O que esta sprint fecha**

1. As **quatro** respostas que o mesmo daemon dá, no mesmo minuto, para *"tem
   controle na mesa?"* — e três delas estão erradas.
2. A causa: o laço do daemon **só escreve estado enquanto há controle**, então a
   última carga boa fica publicada para sempre.
3. A janela mistura as duas fontes **dentro da mesma função** — o portão do
   cabeçalho é a fonte estagnada e a contagem é a fonte viva.
4. Das onze abas, **nove** só releem ao serem abertas e **duas** têm pulso; o
   portão que existe olha só para um lado do mapa.
5. **41 chaves publicadas sem um leitor na janela**, das 158 que o payload vivo
   carrega — o censo, com a régua declarada.
6. O **perfil ativo** tem três rotas persistidas e elas divergem **agora**, na
   máquina dela.

**O que esta sprint NÃO faz**

- **Não mede Bluetooth.** É trilha dela (D2). O que esta frente não pode afirmar
  na tela até a medição existir está na §7.
- **Não conserta aba nenhuma.** Ela entrega a régua; quem repinta é cada onda de
  aba, com a régua já de pé.
- **Não decide qual das três rotas do perfil ativo vence** — é palavra dela
  (proposta **D-N**, §10).
- Não toca o alvo de edição (`_edit_target_uniq`): é a **Z2**, e a Z2 depende
  desta.
- Não fotografa. `retratar_abas.py` é de quem coordena, depois da leva
  ([R4](../COMO-REGER-AGENTES.md)).

---

## 1. O defeito, em uma frase

**Com nenhum controle na mesa, o Hefesto continua dizendo que tem um DualSense
conectado por Bluetooth com 75% de bateria — e diz isso em quatro telas, porque
ele guardou a última vez em que era verdade e nunca mais escreveu por cima.**

---

## 2. O que está medido

### 2.1 A bancada de HOJE tem ZERO DualSense — e o briefing dizia dois

Medido às 22h30 de 23/08, régua independente do daemon:

```bash
for d in /sys/class/hidraw/hidraw*; do
  echo "$d -> $(grep HID_NAME $d/device/uevent)"; done
```

```
hidraw0 -> HID_NAME=Compx 2.4G Wireless Receiver
hidraw1 -> HID_NAME=Compx 2.4G Wireless Receiver
hidraw2 -> HID_NAME=BY Tech Gaming Keyboard
hidraw3 -> HID_NAME=BY Tech Gaming Keyboard
hidraw4 -> HID_NAME=DualSense Wireless Controller (Hefesto P1)
```

O único "DualSense" do sistema é **o nosso próprio vpad**. É a mesma armadilha
registrada na [§0.1 do SPRINT_ORDER](../SPRINT_ORDER.md): *"a bancada mudou
debaixo dos batedores"*. **Quem for medir mesa cheia, meça de novo antes de
acreditar em qualquer número desta seção sobre 2 ou 4 controles.**

### 2.2 As quatro respostas, no mesmo minuto, do mesmo daemon

Régua: cliente JSON-RPC de 12 linhas contra
`$XDG_RUNTIME_DIR/hefesto-dualsense4unix/hefesto-dualsense4unix.sock`.

| # | rota | o que respondeu às 22h31 | está certo? |
|---|---|---|---|
| 1 | `daemon.status` | `connected: true`, `transport: "bt"`, `battery_pct: 75` | **não** |
| 2 | `daemon.state_full`, topo | `connected: true`, `transport: "bt"`, `battery_pct: 75` | **não** |
| 3 | `daemon.state_full` → `controllers[0]` | `connected: false`, `transport: null` | sim |
| 4 | `controller.list` | `connected: false`, `transport: null` | sim |

E a quinta superfície, que repete a mentira fora da janela:

```bash
timeout 30 .venv/bin/hefesto-dualsense4unix status
# │ connected      │ True  │
# │ transport      │ bt    │
# │ active_profile │ n/d   │
# │ battery_pct    │ 75    │
```

**As duas primeiras nascem no MESMO arquivo, a 322 linhas de distância:**

| linha | quem é | de onde tira a verdade |
|---|---|---|
| `src/hefesto_dualsense4unix/daemon/ipc_handlers.py:1895` | `_handle_daemon_status` (`:1876`) | `self.store.snapshot().controller` |
| `src/hefesto_dualsense4unix/daemon/ipc_handlers.py:2217` | `_handle_daemon_state_full` (`:2166`) | `daemon._last_state or snap.controller` (`:2185-2187`) |
| `src/hefesto_dualsense4unix/daemon/ipc_handlers.py:3737` | `_handle_controller_list` (`:3709`) | `controller.describe_controllers()` |
| `core/backend_pydualsense.py:4797-4818` | `describe_controllers` | os **handles abertos**, agora |

O `state_full` publica as duas fontes no mesmo payload: o topo (`:2217`, da
fonte estagnada) e `controllers` (da fonte viva).

**A prova de que o handler TEM a verdade viva ao lado e não a usa:**
`ipc_handlers.py:2198` chama `self.controller.is_connected()` **dentro da mesma
função**, dezenove linhas acima do `connected` que ele publica — e a usa só para
decidir se emite um `logger.warning` de diagnóstico.

### 2.3 Por que estagna: o laço só escreve quando há controle

`src/hefesto_dualsense4unix/daemon/lifecycle.py`:

```python
# :4485
if not self.controller.is_connected():
    was_connected = False
    previous_buttons = frozenset()
    ...
    continue          # <- sai do tick sem escrever nada no store
...
# :4536
self.store.update_controller_state(state)
self._last_state = state
```

`update_controller_state` (`daemon/state_store.py:203`) tem **um** chamador de
produção, e ele mora no ramo conectado. Quando o último controle sai da mesa,
ninguém escreve "desconectado": o `_controller_state`
(`daemon/state_store.py:84`) e o `_last_state` guardam a última leitura boa até
o daemon reiniciar. **Não é cache com validade: é ausência de escrita.** Por
isso a bateria de 75% sobrevive à desconexão — e sobreviveria a uma troca de
controle.

### 2.4 A janela mistura as duas fontes DENTRO da mesma função

`src/hefesto_dualsense4unix/app/actions/status_actions.py`:

| linha | o que faz |
|---|---|
| `:2510-2523` | `_connected_controllers` — lê `state["controllers"]`, a fonte **viva** |
| `:2557` | `_render_online`: `connected = bool(state.get("connected"))` — a fonte **estagnada** |
| `:2697` | `_render_slow_state`: idem |

Nas duas funções o `connected` estagnado é o **portão** e a lista viva é o
**conteúdo**: `if connected and texto_contagem:`. Com o estado de agora
(topo `true`, lista vazia), o portão abre e o conteúdo vem de uma mesa vazia.

O censo dos leitores das duas chaves, na janela inteira:

```bash
grep -rn 'get("connected")' src/hefesto_dualsense4unix/app --include="*.py"
grep -rn 'get("controllers")' src/hefesto_dualsense4unix/app --include="*.py"
```

| superfície | lê o topo estagnado | lê a lista viva |
|---|---|---|
| `app/compact_window.py` | `:292` | `:298-301` |
| `app/tray.py` | — | `:430-434` |
| `app/actions/status_actions.py` | `:2557`, `:2697` | `:2518-2522` |
| `app/actions/home_actions.py` | — | `:2101`, `:2142` |
| `app/actions/config/secao_controles.py` | — | `:706-722` |
| `app/actions/config/secao_mesa.py` | — | `:787` |

**Não há um só lugar que responda "quem está na mesa".** São seis arquivos com
seis derivações, e a única função canônica que existe
(`ContagemDeControles`, `status_actions.py:130`, e `texto_de_contagem`, `:170`,
da CONTAGEM-E-COOP-01) mora **dentro do mixin da Status** — a mesma doença da
F3, num fato diferente.

### 2.5 O pulso: onze abas, nove no mapa, duas com pulso

O mapa é `HefestoApp._REFRESH_POR_ABA` (`src/hefesto_dualsense4unix/app/app.py:1064`),
disparado por `_on_notebook_switch_page` (`:1158`), que chama cada refresher em
`:1187-1190`.

```bash
.venv/bin/python - <<'PY'
import xml.etree.ElementTree as ET
from hefesto_dualsense4unix.app.app import HefestoApp
from hefesto_dualsense4unix.app.constants import MAIN_GLADE
arv = ET.parse(str(MAIN_GLADE))
for nb in arv.getroot().iter('object'):
    if nb.get('class') == 'GtkNotebook':
        print([(c.find('object').get('id')) for c in nb.findall('child')
               if c.get('type') != 'tab'])
        break
print(sorted(HefestoApp._REFRESH_POR_ABA))
PY
```

- **11 páginas** no `main_notebook` (a ordem da tira confirmada mais uma vez:
  Início, Status, No jogo, Gatilhos, Lightbar, Rumble, Perfis, Sistema,
  Emulação, Navegação, Configurações);
- **9 entradas** no mapa: `tab_home_box`, `tab_triggers_box`,
  `tab_lightbar_box`, `tab_rumble_box`, `profiles_paned`, `daemon_box`,
  `emulation_box`, `tab_navegacao_dsx`, `tab_config_box`;
- **fora do mapa:** `tab_status_box` e `tab_no_jogo_box`.

E o pulso de verdade (`GLib.timeout_add` de repetição, na janela principal):

| arquivo | tique | quem serve |
|---|---|---|
| `app/actions/home_actions.py:1797` | `HOME_POLL_INTERVAL_MS` | aba Início |
| `app/actions/status_actions.py:528` | `LIVE_POLL_INTERVAL_MS` (100 ms) | aba Status |
| `app/actions/status_actions.py:529` | `STATE_POLL_INTERVAL_MS` (500 ms) | aba Status |
| `app/actions/status_actions.py:530` | `RECONNECT_POLL_INTERVAL_S` | aba Status |

A aba **No jogo** não tem timer próprio por decisão registrada
(`status_actions.py:548-551`, *"ela NÃO ganha timer próprio"*): ela é repintada
por `_sync_paineis_no_jogo` (`:794`), chamado de dentro dos tiques da Status
(`:2656` e `:2769`). **É pulso emprestado, e some junto com o da Status.**

**As outras nove abas mostram o estado do momento em que foram abertas.** Se a
mesa mudar com a aba aberta, nada as avisa.

E o laço que chama os refreshers (`app.py:1187-1190`) **não tem `try`/`except`**:
um refresher que levante deixa os seguintes da mesma aba sem rodar, calados.

### 2.6 O portão que existe olha para um lado só do mapa

**Correção de fato:** a linha da Z5 na §0.2 diz *"hoje não existe teste nenhum,
provado por grep"*. **Existem dois testes, e nenhum dos dois mede o que a Z5
precisa** — o que é pior que a ausência, porque parece cobertura:

| teste | direção | o que pega |
|---|---|---|
| `tests/unit/test_notebook_switch_page.py:172` `test_todo_id_do_mapa_existe_no_glade` | mapa → glade | id no mapa que não existe no glade |
| `tests/unit/test_notebook_switch_page.py:189` `test_nenhuma_aba_aparece_duas_vezes_no_mapa_de_refresh` | mapa → mapa | chave repetida no literal |

A asserção é `set(HefestoApp._REFRESH_POR_ABA) - ids_no_glade` (`:184`). **Tirar
uma aba do mapa não mexe nesse conjunto.** O inverso — toda página do notebook
está no mapa ou tem isenção nomeada — não existe.

### 2.7 O censo das chaves publicadas: 158 chaves, 41 sem leitor

Régua, declarada e **validada antes de eu acreditar nela** (rodada primeiro
contra `controles_sem_driver`, que TEM leitor, e contra `mascara_divergente`,
que não tem — acusou os dois certo):

```bash
# anda o payload vivo do state_full em profundidade e procura cada nome
# de chave dentro de src/hefesto_dualsense4unix/app/
```

- **158** nomes de chave distintos no payload vivo;
- **41** sem uma única ocorrência do nome em `app/`.

Os que a §0.2 nomeia, conferidos um a um:

| chave | onde é publicada | leitor na janela |
|---|---|---|
| `mascara_divergente` | `ipc_handlers.py:2490-2501`, dentro de `gamepad_emulation` | **nenhum** |
| `bateria_no_jogo` | `ipc_handlers.py:2862`, dentro de `rumble_ff.per_vpad[*]` | **nenhum** |
| `jack` | `ipc_handlers.py:2851` (`_jack_do_vpad`, `:370`), idem | **nenhum** |
| `osk_disponivel` | dentro de `keyboard_emulation` | **nenhum** |
| `controles_sem_driver` | `ipc_handlers.py:2370` (`:3684`) | **TEM** — `status_actions.py:251` (`texto_de_controle_nao_adotado`, `:218`), pintado em `:2945` |

**Dois fatos errados do briefing saem daqui, e saem de todos os lugares:**

1. **`controles_sem_driver` NÃO é chave órfã.** Ela tem leitor, texto e cinco
   testes (`tests/unit/test_controle_ligado_que_o_sistema_nao_adotou.py`).
   Mantê-la na lista de órfãs faria o executor "ligar" uma cura já ligada.
2. **`osk_instalado` não existe.** O nome real é `osk_disponivel`, dentro do
   bloco `keyboard_emulation`. Procurar pelo nome errado devolve vazio e parece
   confirmar a órfã pelo motivo errado.

### 2.8 O perfil ativo tem TRÊS rotas, e elas divergem AGORA

O terceiro fato que "toda aba lê" é *qual perfil está ativo*. Ele tem três
persistências, e o próprio fonte já registra que elas brigam
(`src/hefesto_dualsense4unix/utils/session.py:1-16`).

Medido às 22h33, sem tocar em nada:

```bash
cat ~/.config/hefesto-dualsense4unix/session.json
# {"last_profile": "Sackboy"}
cat ~/.config/hefesto-dualsense4unix/active_profile.txt
# Sackboy
# e o daemon vivo, pelo IPC: active_profile = null
```

| rota | quem escreve | quem lê | diz hoje |
|---|---|---|---|
| `store.active_profile` | `profiles/manager.py:295` | `daemon.status`, `state_full`, o cabeçalho da janela | **nada** |
| `session.json` → `last_profile` | `utils/session.py:41` | `resolve_boot_profile` (`:114`) | **Sackboy** |
| `active_profile.txt` | `utils/session.py:74` | `cli/cmd_profile.py:402` (`profile save --from-active`) | **Sackboy** |

O motivo da divergência está no journal, e **é deliberado**:

```
ago 23 18:33:40 ... last_profile_restore_pulado_perfil_de_janela name=Sackboy
```

O daemon pulou o restauro porque `Sackboy` é perfil casado por janela. **A
decisão é defensável; o silêncio não é:** a CLI `profile save --from-active`
clonaria o `Sackboy` neste instante, e a janela diz "Nenhum". **Nenhuma das três
rotas se declara dona**, que é a causa comum da F5 escrita na §0.1.

**Fato errado, substituído:** o cabeçalho de `utils/session.py:9-11` diz que o
marcador serve à CLI legada `hefesto-dualsense4unix profile current`. Medido:

```bash
timeout 30 .venv/bin/hefesto-dualsense4unix profile current
# No such command 'current'. Did you mean 'create'?
```

O consumidor real do marcador é `cmd_profile.py:402`. Ver **T14**.

---

## 3. O que é hipótese, e o que NÃO foi verificado

- **DESENHO:** que a cura da 2.3 seja escrever um estado desconectado no store.
  É o que a T1 propõe, mas o custo real depende de `ControllerState` aceitar um
  neutro sem mentir sobre bateria e transporte — **não medi** se há campo
  obrigatório sem valor honesto para "não sei". Quem executar mede antes.
- **NÃO VERIFICADO:** o que a tela mostra HOJE, com este estado. Não fotografei
  — a foto é de quem coordena, depois da leva (R4), e as fotos de
  `docs/usage/assets/` são de 18h15 de 23/08, anteriores aos cinco hosts novos
  do `retratar_abas.py` (F14). **A frente Z0 é quem devolve a foto confiável.**
- **NÃO VERIFICADO:** se a divergência do perfil ativo alcança a aba Perfis em
  negrito. `_sync_selection_with_active_profile` está no mapa de refresh
  (`app.py:1087`), então ela relê ao entrar — mas não medi qual das três rotas
  ela lê.
- **NÃO VERIFICADO:** a mordida do `Sackboy` de ponta a ponta. Ela grava estado
  na máquina dela (`profile.switch`) e o estado de hoje é `null` — **não há como
  devolver o nulo depois**. Fica para o executor, com a bancada dele.
- **NÃO VERIFICADO:** quantos dos 41 nomes sem leitor são chave morta e quantos
  são cura por ligar. A régua responde "ninguém cita este nome em `app/`" — não
  responde "isto deveria estar na tela". É a pergunta da T11, e ela é dela em
  pelo menos dois casos (§10).
- **Régua frouxa, declarada:** o censo procura o NOME da chave como texto. Um
  nome curto e comum (`degraded`, `flag1`) pode ter leitor sob outro caminho, e
  um nome citado num comentário conta como leitor. Por isso a T11 confere linha
  a linha antes de remover qualquer coisa — e por isso os cinco casos da tabela
  2.7 foram conferidos à mão.

---

## 4. Por que esta frente vem ANTES das abas

**Toda aba lê a mesa.** A régua de hoje responde diferente conforme a rota, e a
onda que fechar primeiro fixa a rota errada na sua aba — e as dez seguintes
copiam.

| onda · aba | o que MUDA nela por causa da Z5 |
|---|---|
| 1 · Configurações | `secao_controles.py:706-722` já lê a lista viva; o exame e o medidor de rádio passam a poder dizer "a mesa está vazia" em vez de medir sobre um controle fantasma |
| 2 · Início | é a aba que afirma "Nenhum controle conectado" com dois acesos (F7). O gate dela sai da fonte estagnada |
| 3 · Status | `_render_online` (`:2557`) e `_render_slow_state` (`:2697`) param de misturar as duas fontes; a contagem canônica sai do mixin e vira módulo |
| 4 · No jogo | herda o pulso da Status (2.5). Enquanto a Status for o relógio dela, a aba mente sozinha quando a Status não está montada |
| 5 · Emulação | "Microfone: Ligado" com zero placa (F7) é o mesmo padrão: estado de bloco publicado sem checar se há alguém na mesa |
| 6 · Perfis | o negrito do perfil ativo depende de qual das três rotas da 2.8 vence |
| 7 · Lightbar | "Aceso agora: consultando…" nunca volta porque nada a repinta (F13) — ela é uma das nove sem pulso |
| 8 · Gatilhos | 38 botões clicáveis com a mesa vazia (F7): o gate é a mesa, e ele não existe |
| 9 · Rumble | "o JOGO controla a vibração" em verde com a mesa vazia; o alvo que sai da mesa vira broadcast (F4), e quem sabe que ele saiu é a régua desta frente |
| 10 · Navegação | o primário é escolhido a partir da mesa; sem régua, "o cursor é do controle 1" não tem sujeito |
| 11 · Sistema | o vigia e o "Este jogo não funciona" contam controles para prometer que os jogadores continuam valendo |

E as duas frentes da própria Onda 0 que **esperam** esta: a **Z2** (o alvo só
tem domínio depois de a mesa ter dono) e a **Z4** (o perfil só guarda "por
controle" o que a mesa souber nomear).

---

## 5. A coreografia dos agentes

**Quatro agentes** — o número da linha da Z5 na §0.2. A1 abre sozinho: ele
produz a derivação única de que A2 e A4 dependem. A3 é disjunto de todos desde
o primeiro minuto.

```
   dia 1                       dia 1-2                    fecho
   ┌───────────────┐
   │ A1  o daemon  │─── a derivação única ──┬──> A2  a janela ──┐
   │  (fonte única)│                        └──> A4  os donos ──┼──> aceite
   └───────────────┘                                            │
   ┌───────────────┐                                            │
   │ A3  o pulso   │────────────────────────────────────────────┘
   └───────────────┘   (paralelo: só `app/app.py` e o teste do mapa)
```

| agente | tarefas | POSSE EXCLUSIVA | o que devolve |
|---|---|---|---|
| **A1 — a fonte única no daemon** | T1..T4 | `daemon/lifecycle.py`, `daemon/state_store.py`, `daemon/ipc_handlers.py` (só os três handlers: `:1876`, `:2166`, `:3709`) | a função de derivação, o nome dela, e as três mordidas rodadas |
| **A2 — a régua única na janela** | T5..T7 | `app/mesa.py` (novo), `app/actions/status_actions.py`, `app/compact_window.py`, `app/tray.py` | o módulo dono, a lista dos seis leitores migrados, e o que ficou para o olho dela | <!-- ref-externa: `app/mesa.py` é o módulo que ESTA sprint propõe criar (T5); a ausência dele é o assunto -->
| **A3 — o pulso e o mapa** | T8..T10 | `app/app.py`, `tests/unit/test_notebook_switch_page.py` | o portão glade→mapa nascendo reprovando, e a lista de isenções nomeadas |
| **A4 — o dono declarado de cada fato** | T11..T14 | `utils/session.py`, `cli/cmd_profile.py`, `daemon/ipc_handlers.py` **herdado de A1, em série** | o censo das 158 chaves com veredito por chave, e a proposta **D-N** para ela |

**Regras desta coreografia, e cada uma tem cicatriz:**

1. **A4 não abre `ipc_handlers.py` antes de A1 fechar.** É o mesmo arquivo;
   duas edições válidas em paralelo e a última grava por cima
   ([R1](../COMO-REGER-AGENTES.md)).
2. **A2 é dono de `status_actions.py` durante a Z5, e as Ondas 3 e 4 não
   começam antes.** É o arquivo de 2917 linhas que a Status e a No jogo
   dividem (F5) — a restrição dura já está escrita na §0.3.
3. **A2 toca `home_actions.py:2101` e `:2142`? Não.** Se a migração pedir,
   **relata, não edita** — o arquivo é da Onda 2 · Início.
4. **Ninguém roda a suíte inteira** ([R2](../COMO-REGER-AGENTES.md)): `pytest`
   sem alvo cria nós uinput de verdade. Cada agente roda o próprio escopo, e o
   prompt dele diz qual é.
5. **Ninguém roda `retratar_abas.py`** ([R4](../COMO-REGER-AGENTES.md)). Quem
   precisar olhar no meio do trabalho passa um diretório como argumento.
6. **Enquanto ela mede Bluetooth, ninguém para o daemon nem escreve no
   aparelho** ([R3](../COMO-REGER-AGENTES.md)). Quem precisar, espera e diz que
   está esperando.

---

## 6. As tarefas

Carimbo de classe de tela (D3): **[COSMÉTICA]** = pré-aprovada, foto depois em
lote · **[ESTRUTURAL]** = precisa do olho dela ANTES · **[SEM TELA]** = não toca
a interface.

### A1 — a fonte única no daemon

#### T1 — a queda escreve estado · **[SEM TELA]**

`daemon/lifecycle.py:4485-4500`: o ramo `if not self.controller.is_connected():`
sai por `continue` sem escrever. Passa a publicar o estado desconectado no
store e a zerar `_last_state` **uma vez por borda de queda** (não a cada tick —
o laço roda a 100 Hz e isso é ruído no journal).

Antes de escrever, medir o que `ControllerState` exige: se houver campo sem
valor honesto para "não sei", a cura é `None` declarado, nunca um zero
(precedente: `app/alvo_de_edicao.py`, que separa *"ela escolheu Todos"* de
*"eu não sei"*).

**A mordida:** com zero controles, `daemon.status` tem de dizer
`connected: false`. Arranque a escrita da borda e o handler volta a publicar
`connected: true, bt, 75` — é o estado de hoje, e é o teste.

**Custo:** ~25 linhas de produto, ~60 de teste, 2 h.

#### T2 — as três rotas saem da MESMA derivação · **[SEM TELA]**

Uma função dona única — nome proposto `mesa_do_daemon()`, no molde do
`alvo_de_edicao.py` — consumida pelos três handlers:
`ipc_handlers.py:1895`, `:2217` e `:3737`. Ela responde a partir dos handles
abertos (`core/backend_pydualsense.py:4797-4818`), que é a fonte que já acerta.

O `state_full` **continua** publicando `controllers`: a lista responde "quem",
a derivação responde "tem alguém". O que não pode continuar é duas respostas
para a segunda pergunta.

**A mordida:** um teste que chama os três handlers com backend sem handles e
exige `connected: false` nos três. Arranque a derivação de UM deles e veja
reprovar **nomeando a rota** — três asserções, três mensagens.

**Custo:** ~40 linhas de produto, ~90 de teste, 3 h.

#### T3 — `transport` e `battery_pct` seguem o mesmo destino · **[SEM TELA]**

`bt` e `75%` com a mesa vazia são o mesmo defeito com outro nome, e o segundo é
o mais caro: a aba Status **desenha uma barra** com esse número. Sem controle,
os dois são `None`.

**Cuidado medido:** a bateria por rádio já teve o grau REBAIXADO para inferência
em 15/08 (§0.3, linha da Status). Esta tarefa **não** conserta a precisão do
número — ela impede que um número velho sobreviva ao controle que o produziu.

**A mordida:** o mesmo teste da T2, estendido: com a mesa vazia,
`battery_pct is None` e `transport is None` nas três rotas. Arranque e veja
reaparecer o `75`.

**Custo:** ~10 linhas de produto, ~40 de teste, 1 h.

#### T4 — portão: `connected` não se escreve à mão · **[SEM TELA]**

Portão que varre `daemon/ipc_handlers.py` e reprova todo literal
`"connected":` que não venha da derivação da T2. Hoje há **três** ocorrências
de publicação (`:1895`, `:2217`, `:3737`) mais duas de leitura (`:540`, `:995`)
— a régua tem de distinguir as duas coisas, e a mordida é o que prova que
distingue.

**A mordida:** acrescente um quarto handler que publique `connected` fora da
derivação e veja o portão reprovar nomeando arquivo e linha; depois acrescente
uma LEITURA e veja o portão **passar**. Régua que reprova as duas não separa
nada.

**Custo:** ~50 linhas de portão, ~40 de teste, 2 h.

### A2 — a régua única na janela

#### T5 — nasce `app/mesa.py`, dono único da mesa na janela · **[SEM TELA]** <!-- ref-externa: `app/mesa.py` é o módulo que ESTA sprint propõe criar (T5); a ausência dele é o assunto -->

Move para lá, sem mudar comportamento: `ContagemDeControles`
(`status_actions.py:130`), `texto_de_contagem` (`:170`) e
`_connected_controllers` (`:2510`). O molde é `app/alvo_de_edicao.py`, de
23/08: módulo novo, dono único, os leitores antigos continuam funcionando por
espelho enquanto migram.

**Por que sair do mixin:** nove abas precisam da resposta e o mixin é da
Status. É exatamente a F3 aplicada a outro fato — e a F3 já custou perda de
dado dela em 23/08.

**A mordida:** um teste importa `app/mesa.py` **sem** montar a janela e sem <!-- ref-externa: `app/mesa.py` é o módulo que ESTA sprint propõe criar (T5); a ausência dele é o assunto -->
importar `status_actions`. Se falhar por dependência de GTK ou do mixin, o
módulo não é dono de nada — é atalho.

**Custo:** ~120 linhas movidas, ~30 de teste novo, 3 h.

#### T6 — o cabeçalho para de misturar as duas fontes · **[ESTRUTURAL]**

`status_actions.py:2557` e `:2697`: o portão passa a ser a mesa (T5), não o
`state["connected"]`. Com a mesa vazia, a aba cai no caminho offline que **já
existe** — nenhuma palavra nova é inventada aqui.

**[ESTRUTURAL] mesmo assim**, e a razão é a D3: muda o que se vê ao abrir. O que
vai à mesa dela é curto: *com zero controles, a aba Status passa a dizer o que
já diz quando o daemon está parado — está certo, ou o vazio merece frase
própria?* Levar a **foto**, não o diff.

**A mordida:** dublê de `state` com topo `connected: true` e
`controllers: []` — o cabeçalho tem de dizer desconectado. É o payload literal
de hoje, copiado da §2.2. Arranque a cura e ele volta a dizer conectado.

**Custo:** ~30 linhas de produto, ~70 de teste, 2 h + o tempo dela.

#### T7 — bandeja e janela compacta bebem da mesma fonte · **[COSMÉTICA]**

`app/tray.py:430-434` já lê a lista viva; `app/compact_window.py:292-301` lê as
duas. Os dois passam a chamar `app/mesa.py`. <!-- ref-externa: `app/mesa.py` é o módulo que ESTA sprint propõe criar (T5); a ausência dele é o assunto -->

**[COSMÉTICA]** porque, com a derivação certa, o texto não muda — muda de onde
ele vem. **Se mudar alguma palavra, a tarefa vira [ESTRUTURAL] e para**: quem
executa carimba de novo em vez de decidir sozinho.

**A mordida:** o mesmo dublê da T6 contra as duas superfícies. Arrancar a fonte
única faz as três (Status, bandeja, compacta) divergirem no mesmo teste.

**Custo:** ~20 linhas, ~40 de teste, 1 h.

### A3 — o pulso e o mapa

#### T8 — o portão glade→mapa, que hoje não existe · **[SEM TELA]**

Teste novo em `tests/unit/test_notebook_switch_page.py`: **toda** página do
`main_notebook` está em `_REFRESH_POR_ABA` **ou** numa lista de isenções
nomeadas, cada isenção com o motivo escrito.

Ele **nasce reprovando duas abas** (`tab_status_box` e `tab_no_jogo_box`, §2.5),
e as duas entram como isenção com o motivo medido: têm pulso próprio
(`status_actions.py:528-530`) e emprestado (`:548-551`). A isenção é uma frase
no fonte, não uma ausência.

**A mordida:** tire `tab_lightbar_box` do mapa e veja reprovar **dizendo
"Lightbar"** — não "id ausente". A mensagem é o produto desta tarefa: quem lê a
falha tem de saber qual aba parou de atualizar.

**Custo:** ~60 linhas de teste, 2 h.

#### T9 — um refresher que levanta não cala os outros · **[SEM TELA]**

`app/app.py:1187-1190`: o laço chama `fn()` sem `try`/`except`. Passa a
capturar, logar com o nome do refresher e seguir para o próximo.

**Não engolir em silêncio:** o log é o produto. O defeito que isto cura é a aba
desenhando o passado sem uma linha no journal (F13).

**A mordida:** dublê com dois refreshers na mesma aba, o primeiro levantando —
o segundo tem de rodar, e o log tem de nomear o primeiro. Arranque o `try` e o
segundo não roda: é o teste. O dublê tem de saber **recusar** (armadilha A2 do
COMO-REGER-AGENTES).

**Custo:** ~15 linhas de produto, ~50 de teste, 1 h.

#### T10 — a mesa que muda com a aba aberta chega às nove · **[ESTRUTURAL]**

Hoje só Início e Status sabem que a mesa mudou (§2.5). A proposta: `app/mesa.py` <!-- ref-externa: `app/mesa.py` é o módulo que ESTA sprint propõe criar (T5); a ausência dele é o assunto -->
(T5) guarda a última mesa vista e **avisa** quem se inscreveu; o tique que já
existe na Início/Status vira o produtor, e nenhuma aba ganha timer novo.

**[ESTRUTURAL]** porque muda o que se vê **sem** a pessoa mexer em nada — uma
aba que se repinta sozinha é comportamento novo, e ela decide se quer isso em
todas ou só nas que afirmam algo sobre a mesa.

**DESENHO, e o custo é estimativa:** não medi quantos leitores precisam de
inscrição, nem o custo de repintura com quatro cards. **NÃO VERIFICADO.**

**A mordida:** com a aba Lightbar aberta, o produtor publica uma mesa vazia e a
aba tem de repintar sem troca de aba. Arranque a inscrição e a aba fica no
passado — que é o comportamento de hoje, e por isso o teste morde de verdade.

**Custo:** ~80 linhas de produto, ~90 de teste, 5 h — **estimativa**.

### A4 — o dono declarado de cada fato

#### T11 — o censo das 158 chaves, com veredito por chave · **[SEM TELA]**

Para cada uma das 41 sem leitor (§2.7): **ou** um teste que prova que uma tela a
mostra, **ou** um commit que a remove com data e motivo. Terceira saída
permitida, e só ela: **isenção nomeada** para chave de diagnóstico que existe
para o journal e nunca para a tela (`poll.tick`, `udp.parse_error` e as três
`battery.*` são candidatas óbvias) — a isenção é uma linha no fonte, com o
porquê.

**Comece pelas cinco conferidas à mão** na tabela da §2.7. **Não** aplique a
régua em lote: ela procura o nome como texto (§3), e apagar por resultado de
régua frouxa é como se apaga cura viva.

**A mordida:** a régua tem de acusar `mascara_divergente` (sem leitor) e
**absolver** `controles_sem_driver` (com leitor em `status_actions.py:251`).
Uma régua que acusa os dois não mede nada — e essa é a falha que a
[AUDITORIA-DE-PERDA-01](2026-08-23-AUDITORIA-DE-PERDA-01-tres-portoes-verdes-que-nao-medem-nada.md)
achou três vezes num dia.

**Custo:** ~0 de produto na varredura, 4 h; o custo de cada remoção é da chave.

#### T12 — portão: chave nova no `state_full` sem leitor declarado reprova · **[SEM TELA]**

O mecanismo que impede a lista de 41 de voltar a crescer. Ele consome o
inventário da T11 como lista base, e reprova o que estiver fora dela sem
leitor nem isenção.

**A mordida:** acrescente uma chave ao payload e veja reprovar nomeando a
chave; declare o leitor e veja passar. **Este é o formato da mordida que falta
em toda a família F2** — o mesmo desenho que a Z2 pede para
`set_mask`/`clear_mask`.

**Custo:** ~70 linhas de portão, ~50 de teste, 3 h.

#### T13 — o perfil ativo ganha dono declarado · **[ESTRUTURAL]**

Três rotas, três respostas (§2.8). **O conserto não é fazer as três iguais à
força** — o daemon pula o restauro de perfil de janela por decisão medida, e
apagar isso seria pagar de novo um custo já pago. O conserto é declarar o dono:
uma rota responde *"o que está em vigor agora"*, e as outras duas dizem
explicitamente que respondem *"o que foi escolhido da última vez"*.

Qual delas vence é **palavra dela** (D-N, §10). O que a tarefa faz sem esperar:
faz as três rotas **nomearem** o que respondem, no fonte e na tela da CLI.

**A mordida — e ela é o aceite literal da §0.2:** grave `Sackboy` por uma rota,
leia pelas outras duas. As três têm de responder igual **ou** dizer, cada uma,
de qual pergunta está falando. Arranque a declaração e volta o estado de hoje:
disco `Sackboy`, janela "Nenhum", e `profile save --from-active` clonando um
perfil que a janela não conhece.

**Custo:** ~50 linhas de produto, ~80 de teste, 3 h + a decisão dela.

#### T14 — o consumidor que não existe mais sai do cabeçalho · **[SEM TELA]**

`utils/session.py:9-11` promete o marcador à CLI `profile current`, que **não
existe** (§2.8). Substituir pelo consumidor real: `cli/cmd_profile.py:402`,
`profile save --from-active`.

Fato errado se substitui, e sai de **todos** os lugares:

```bash
grep -rn "profile current" src/ docs/ README.md
```

**A mordida:** a régua acima volta vazia **depois** de ter voltado cheia antes.
Rode-a antes de acreditar no resultado dela, contra `utils/session.py`, que
você sabe que contém pelo menos uma ocorrência.

**Custo:** ~5 linhas, 30 min.

---

## 7. O que o Bluetooth bloqueia

D2: o mapeamento de rádio é trilha dela com o assistente, na mesa do specs.
Esta frente não o planeja. O que ela **não pode afirmar** até a medição existir:

| # | a pergunta de BT | o que a Z5 não pode afirmar |
|---|---|---|
| **BT-Z5-1** | a queda de um DualSense **no rádio** produz borda observável, ou some sem evento? | que a régua da T1 acorda no mesmo instante no cabo e no rádio. A cura vale para as duas vias porque lê handles; **o tempo até perceber é diferente e não foi medido** |
| **BT-Z5-2** | a bateria por rádio bate com o aparelho? | nada além do que a T3 faz: que o número não sobrevive ao controle. O grau do número foi REBAIXADO para inferência em 15/08 e a barra afirma valor exato — isso é da Onda 3 · Status |
| **BT-Z5-3** | quantos DualSense por rádio o produto sustenta, e com quantos adaptadores? | que a régua conta certo com mesa cheia. `slot_jogador` é `inferido-do-codigo`, sem ensaio; e **a bancada de hoje tem ZERO controles** (§2.1) — nenhum número desta sprint sobre 2 ou 4 é medição viva |
| **BT-Z5-4** | `transport: "bt"` distingue rádio de vpad? | que "bt" na tela significa "este controle está no rádio". `_detect_transport` (`core/backend_pydualsense.py:5053`) não foi auditado nesta sprint — **NÃO VERIFICADO** |

---

## 8. As dependências

**Esta frente não depende de nenhuma outra da Onda 0** — é por isso que ela é
raiz. A única coisa que a antecede é a **Z0** (a foto), e só para a T6 e a T10,
que têm carimbo estrutural: sem foto confiável, o olho dela julga ficção.

**Quem depende da Z5** (copiado da §0.2 e da §0.3 do `SPRINT_ORDER`, conferido
linha a linha):

| depende | como |
|---|---|
| **Z2 — o alvo ganha dono próprio** | dura: *"sem régua da mesa, o alvo não tem domínio"* |
| **Z4 — o perfil guarda tudo** | dura: depende de Z2 **e** Z5 |
| Ondas 1 a 11 (**as onze abas**) | **todas** listam Z5 nas dependências |

**Restrições duras herdadas, que valem para o executor:**

- **Onda 3 · Status e Onda 4 · No jogo** dividem `status_actions.py` e o mesmo
  widget: mesmo agente-dono, sequencial. A Z5 mexe nesse arquivo (T5, T6), logo
  **as duas ondas esperam a Z5 fechar**;
- a **Onda 1 · Configurações** é o piloto do formato e **não** depende da Z2,
  mas depende da Z5;
- a metade da mesa que a Z6 carrega (medição → CSV → tela) é da
  [PAREAMENTO-01](2026-08-24-PAREAMENTO-01-a-medicao-nova-tem-de-chegar-sozinha-na-tela.md).
  A Z5 não afirma nada sobre transporte; ela diz **se há alguém**, não **o que
  o alguém sabe fazer**.

**Sprints que esta frente absorve pela raiz** (o achado vem para cá; a metade de
tela fica com a onda da aba):
[QUEM-É-QUEM-01](2026-08-15-QUEM-E-QUEM-01-o-estado-publicado-nao-diz-qual-vpad-e-de-qual-controle.md),
[MESA-CHEIA-11](2026-08-13-MESA-CHEIA-11-a-janela-conta-um-quando-sao-quatro.md)
e a régua de contagem da
[CONTAGEM-E-COOP-01](2026-07-31-CONTAGEM-E-COOP-01-o-aviso-antes-de-derrubar-tres-jogadores.md).
**Absorvida não é fechada.**

---

## 9. O aceite

O da tabela da §0.2 é o **piso**. As quatro provas dela, com o comando:

**1. As três rotas dizem desconectado, e arrancar a derivação reprova.**

```bash
# com a mesa vazia (é o estado da bancada de hoje):
.venv/bin/python -m pytest tests/unit/ -k "mesa or state_full or controller_list" -q
```
As três rotas (`daemon.status`, topo do `state_full`, `controllers`/
`controller.list`) respondem `connected: false`, `transport: None`,
`battery_pct: None`. **Arranque a derivação de uma delas e o teste nomeia qual.**

**2. `Sackboy` gravado por uma rota, lido pelas outras duas.**
Grave por `profile.switch`; leia por `session.json`, por `active_profile.txt` e
pelo `state_full`. As três respondem igual **ou** cada uma declara de qual
pergunta fala (T13). Hoje: disco `Sackboy`, daemon `null` — medido às 22h33.

**3. Tirar QUALQUER aba do `_REFRESH_POR_ABA` reprova nomeando a aba.**

```bash
.venv/bin/python -m pytest tests/unit/test_notebook_switch_page.py -q
```
Hoje passa com a aba removida — os dois testes que existem olham para o outro
lado (§2.6).

**4. Para cada chave órfã: leitor provado, ou remoção com data, ou isenção
nomeada.** O portão da T12 passa, e reprova ao se acrescentar uma chave nova
sem leitor.

**E os portões da casa, depois do `git add -A`** (eles não veem arquivo novo):

```bash
git add -A
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
python3 scripts/validar-citacoes-de-linha.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
```

**A prova de ponta que nenhum teste substitui:** com a mesa vazia, abrir a
janela e percorrer as onze abas. **Nenhuma delas pode afirmar que há controle
conectado.** É o que a régua existe para garantir, e é o gesto que a Onda 0
entrega às onze ondas seguintes.

---

## 10. O que fica aberto, e de quem é

**Dela, e só dela:**

- **D-N (nova, proposta aqui)** — **qual das três rotas do perfil ativo é a
  dona?** Recomendação: o **daemon** responde *"o que está em vigor"* e as duas
  rotas em disco passam a se chamar *"a última escolha"*, na tela e no fonte.
  Motivo: o restauro pulado de perfil de janela é decisão medida
  (`last_profile_restore_pulado_perfil_de_janela`, journal de 18h33) e forçar as
  três a coincidir a desfaria. **Custo do outro lado:** se o disco vencer, o
  daemon passa a restaurar perfil de janela no boot, e o produto volta a ativar
  perfil de um jogo que não está aberto;
- a frase do estado vazio da Status (T6) e o comportamento novo da T10 — as
  duas são **[ESTRUTURAL]**, e a T10 muda o que se vê sem ela mexer em nada;
- dois dos 41 nomes sem leitor são **cura escrita e nunca ligada**, não lixo:
  `mascara_divergente` (três abas deveriam lê-la) e `bateria_no_jogo`. **Ligar
  ou caducar com data é decisão de produto**, e a segunda tem de ser por escrito
  — senão o próximo agente "termina" o trabalho.

**Da trilha de BT dela com o assistente:** BT-Z5-1 a BT-Z5-4 (§7).

**De outras frentes, e esta sprint NÃO as toca:**

- `_edit_target_uniq` e os nove leitores por `getattr` — **Z2**;
- o contrato de resposta da ponte (`_call_checked`/`_safe_call` terminando em
  `return True, None`) — **Z1**. A Z5 conserta o que o daemon **diz**; a Z1
  conserta o que a ponte **entrega**;
- a foto das cinco abas que publicam o XML cru — **Z0**, e a T6/T10 esperam por
  ela;
- o elo medição → CSV → tela —
  [PAREAMENTO-01](2026-08-24-PAREAMENTO-01-a-medicao-nova-tem-de-chegar-sozinha-na-tela.md)
  (**Z6**);
- o teto de 4 jogadores que a GUI escreve e o daemon não tem
  (`status_actions.py:1289` — na árvore de hoje é linha de **docstring**, e a
  verificação de onde o teto é imposto de verdade é do balde) — é o **balde de
  co-op da Onda 12**, dono único,
  sequencial. A Z5 relata e não edita.
