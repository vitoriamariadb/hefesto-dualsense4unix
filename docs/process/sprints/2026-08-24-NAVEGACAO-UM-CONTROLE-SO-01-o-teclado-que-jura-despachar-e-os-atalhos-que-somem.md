# NAVEGAÇÃO — UM CONTROLE SÓ-01 — o teclado que jura despachar e os atalhos que somem

- **Escrita em:** 23/08/2026, ~21h, na `dev`, sobre `f0632cf`.
- **Grau:** **MEDIDO** nos achados 1 a 6 (comando ao lado de cada um, e o
  achado nº 1 tem repro que roda com o código de produto). **DESENHO** nas
  curas, que ninguém escreveu ainda.
- **Posição na fila:** onda **10** de 12. Roda **depois** da Onda 0 inteira, da
  **Onda 5** (Emulação, dona de metade do código desta aba) e da **Onda 6**
  (Perfis).
- **O que esta sprint fecha:** a aba Navegação para de apagar configuração dela
  em silêncio, para de comemorar o que não fez, e passa a dizer **quem** dos
  quatro controles comanda o PC.
- **O que ela NÃO faz:** não mede Bluetooth (trilha dela, D2 — ver §6); não
  devolve as três regiões do touchpad ao Hefesto (decisão dela, e é a mesma
  decisão do arquivo de regra udev, não desta sprint); não muda o desenho da
  aba (duas colunas, moldura Mapeamento, sliders) — o que muda é o que a tela
  **afirma**.

Leia antes: [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md) e a foto de hoje,
[`readme_navegacao_dsx.png`](../../usage/assets/readme_navegacao_dsx.png)
(18h15). **Não rode o `retratar_abas.py`** durante a leva paralela: ele
reescreve as onze de uma vez.

---

## 1. O defeito, em uma frase

**Mexer numa linha da lista de atalhos apaga, sem dizer nada, os três atalhos
do touchpad que o perfil dela guardava — e a lista nunca os mostrou para ela
poder notar a falta.**

---

## 2. O que está medido, e o que é hipótese

### 2.1 MEDIDO — o achado nº 1: um gesto na aba apaga três atalhos do perfil

`CANONICAL_BUTTONS` (`app/actions/input_actions.py:83-121`) perdeu as três
regiões do touchpad em 09/08 (TOUCHPAD-DO-SISTEMA-01, decisão correta dela) e
`DEFAULT_BUTTON_BINDINGS` (`core/keyboard_mappings.py:58-61`) **as manteve**.
Duas consequências, e a segunda é perda de dado:

- `_refresh_key_bindings_from_draft` (`input_actions.py:337`) só cria linha
  para botão que está em `CANONICAL_BUTTONS` — o que o perfil guarda fora dessa
  lista **não aparece**;
- `_persist_key_bindings_to_draft` (`input_actions.py:456-465`) serializa **a
  lista da tela** por cima de `draft.key_bindings` — o que não aparece é
  **descartado** no primeiro gesto (editar célula, "Adicionar", "Remover").

O perfil `point_and_click.json` dela guarda sete atalhos, três deles do
touchpad (`E`, `U`, `P` — Grim Fandango). Repro com o código de produto de
verdade (`InputActionsMixin` real, `DraftConfig` real, o JSON dela lido do
disco):

```python
# guarde como nav_repro.py e rode com:
#   xvfb-run -a .venv/bin/python nav_repro.py \
#     ~/.config/hefesto-dualsense4unix/profiles/point_and_click.json
import json, sys, gi
gi.require_version("Gtk", "3.0")
from gi.repository import Gtk
from hefesto_dualsense4unix.app.actions.input_actions import InputActionsMixin
from hefesto_dualsense4unix.app.draft_config import DraftConfig

class Host(InputActionsMixin):
    def __init__(self, draft):
        self.draft = draft
        self._w = {"key_bindings_treeview": Gtk.TreeView(),
                   "key_bindings_legend": Gtk.Label()}
    def _get(self, name): return self._w.get(name)
    def _status_toast(self, ctx, msg): pass

kb = json.load(open(sys.argv[1]))["key_bindings"]
h = Host(DraftConfig(key_bindings=kb))
h._install_key_bindings_treeview()
h._refresh_key_bindings_from_draft()
print("na TELA :", [r[0] for r in h._key_bindings_store])
h._persist_key_bindings_to_draft()   # é o que TODO gesto da aba faz
print("PERDIDOS:", sorted(set(kb) - set(h.draft.key_bindings or {})))
```

```
no DISCO: ['create', 'l1', 'options', 'r1', 'touchpad_left_press',
           'touchpad_middle_press', 'touchpad_right_press']
na TELA : ['l1', 'r1', 'options', 'create']
no DRAFT depois de UM gesto: ['create', 'l1', 'options', 'r1']
PERDIDOS: ['touchpad_left_press', 'touchpad_middle_press', 'touchpad_right_press']
```

O rodapé "Salvar Perfil" emite `key_bindings=self.key_bindings`
(`app/draft_config.py:746`) — o draft podado vira o arquivo podado.

**Honestidade sobre o alcance:** hoje esses três **não disparam** com o
touchpad devolvido ao sistema (`daemon/subsystems/keyboard.py:378-381`, o gate
`ponteiro_do_sistema`). A perda é de **configuração gravada**, não de
comportamento vivo. Isso não a torna aceitável: é o único registro do que ela
escolheu, e ele some sem uma palavra.

**Nenhum teste tranca o comportamento atual** — `grep -rl CANONICAL_BUTTONS
tests/` devolve só `test_o_teclado_que_nao_digita.py`, que usa a constante como
universo de botões, não como filtro de persistência.

### 2.2 MEDIDO — o irmão do lado sabe dizer não; o mouse não

Estado vivo do daemon agora (`daemon.state_full` pelo socket, PID de
18:33:39):

```
keyboard_emulation: {"enabled": false, "device_ativo": false,
                     "despachando": false, "bloqueio": "desligada",
                     "osk_disponivel": true}
mouse_emulation:    {"enabled": false, "speed": 6, "scroll_speed": 1}
```

O teclado publica **por que** não anda (`ipc_handlers.py:1930-2009`) e a janela
traduz (`emulation_actions.py:424-444`). O mouse publica três números
(`ipc_handlers.py:2387-2391`) e **nenhum motivo**. Resultado na tela: o
interruptor do mouse fica **apagado e mudo** — `texto = MODE_GATE_HINT if
blocked and mode is not None else ""` (`mouse_actions.py:117`): com o daemon
offline, `mode` é `None`, o interruptor morre e **nada é dito**. É exatamente o
que a foto das 18h15 mostra (§2.6).

E quando o daemon **recusa**, a janela culpa a rede: `status != "ok"` cai no
mesmo `_on_err` do timeout, cujo texto é *"Falha ao comunicar com o daemon"*
(`mouse_actions.py:225`). É a [ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md)
ao contrário: em vez de comemorar o que não fez, acusa um defeito que não houve.

### 2.3 MEDIDO — três textos para a MESMA sonda, e o rótulo nunca é relido

A sonda é uma só (`import uinput` + `os.access("/dev/uinput", W_OK)`), escrita
duas vezes:

| onde | veredito ruim | para onde manda |
|---|---|---|
| `mouse_actions.py:355-386` | "O mouse virtual está sem permissão" | **aba Sistema** → "Aplicar correções" |
| `emulation_actions.py:918-947` | "Gamepad virtual sem acesso" | **reinstale o Hefesto** |
| `main.glade:3855` (o itálico da aba) | — | **aba Emulação** |

Três destinos para um problema só. E o rótulo desta aba **nunca é relido**:
`_refresh_mouse_view` tem dois chamadores (`mouse_actions.py:85` e `:220` —
instalação e sucesso do toggle) e **não está** na lista de refresh por troca de
aba (`app/app.py:1069-1071`, a entrada `tab_navegacao_dsx`). Consertar a
permissão na aba Sistema e voltar aqui não muda o texto.

Na bancada agora o veredito é o verde: `/dev/uinput` é `crw-rw----+ root
hefesto` e `os.access(..., W_OK)` é `True`.

### 2.4 MEDIDO — a aba não diz quem comanda o PC, e promete um co-op que o modo desmonta

Nada nesta aba lê `uniq` nem `is_primary` (`grep -n "uniq\|is_primary"` nos dois
arquivos da aba: **vazio**). O dono do cursor é o **primário**, e primário é a
chave mais antiga ainda presente (`core/backend_pydualsense.py:2318-2340`): se
ele cai, `next(iter(self._handles))` promove outro e o cursor **troca de mão
sem aviso**. O esquema declara que isso é por construção
(`profiles/schema.py:884-890`: *"INPUT vem SEMPRE do controle PRIMÁRIO"*).

E há duas frases contraditórias na mesma aba, a três widgets de distância:

- tooltip do interruptor (`main.glade:3621`): *"quem move o mouse é sempre um
  controle — **os outros seguem jogando**"*;
- `MODE_GATE_HINT` (`mouse_actions.py:32-36`): ligar o mouse fora de "Controlar
  o PC" *"derrubaria o controle virtual e os jogadores do co-op"*.

Quem decide é o produto, e ele já respondeu: entrar em "Controlar o PC" manda
`gamepad.emulation.set {enabled: false}` (`app/actions/mode_transition.py:114-127`,
e o comentário do próprio código diz *"desligar o gamepad já desmonta os
jogadores"*). **O único modo em que o mouse pode ser ligado é o modo que
desmonta o co-op.** O tooltip é fato errado — e fato errado se substitui.

### 2.5 MEDIDO — o dado do teclado na tela existe, chega no fio e ninguém o lê

`osk_disponivel` é publicado no bloco `keyboard_emulation` (§2.2) e
`grep -rn "osk_disponivel" src/hefesto_dualsense4unix/app/` devolve **vazio**.
A legenda da aba (`input_actions.py:61-65`) nomeia `onboard` e `wvkbd-mobintl`
como texto fixo e **nunca diz se algum está instalado** — enquanto o L3 é o
único caminho do produto para **escrever texto**, porque nenhum atalho de
fábrica digita letra.

Duas correções à suspeita de "cura escrita e nunca ligada" nesta aba, e as duas
são boas notícias que ninguém precisa reinvestigar:

- `notify_teclado_na_tela_ausente` **tem chamador de produção**
  (`daemon/subsystems/keyboard.py:210-213`). Não é cura morta;
- o instalador **instala** o teclado na tela (`install.sh`, passo `4f`), e na
  bancada `wvkbd-mobintl` está em `/usr/bin` (sessão `wayland`/`COSMIC`). O
  buraco não é o binário: é a tela não saber dizer que ele existe.

### 2.6 MEDIDO — a foto de hoje, e uma correção à Z0

A Z0 registra esta aba como *"lista de atalhos vazia, interruptor LIGADO"*.
Na foto oficial das 18h15 (`retratar_abas.py`, não o retrato cru) **não é isso**,
e a diferença importa para quem for executar. Medido recortando o PNG:

- a lista tem as **seis** linhas de fábrica (L1, R1, L3, R3, Options,
  Share/Create) — é `DEFAULT_BUTTON_BINDINGS`, o que a aba mostra com
  `key_bindings=None`;
- os **dois** interruptores estão **desligados**; o do mouse está **cinza
  (insensível)** e o do teclado, branco (sensível);
- **não há uma palavra** explicando o interruptor apagado — é o `mode is None`
  da §2.2 fotografado.

Quem for auditar a Navegação pela foto: o retrato cru do Glade e o retrato do
produto divergem **nesta aba**, e o que vale é o segundo.

### 2.7 HIPÓTESE — o que esta sprint NÃO sabe

- **se o gatilho e o analógico movem o cursor no rádio.** O mapa registra a
  observação dela de 11/08 (*"a exceção do touch os demais não funcionam no
  modo bt"*) e deixa as células **vazias** de propósito, nas duas linhas
  (`entrada.emulacao_mouse.gatilhos`, `entrada.emulacao_mouse.analogico` em
  [`docs/data/mapa-controles.csv`](../../data/mapa-controles.csv)). `◌ ninguém
  respondeu` continua sendo a verdade;
- **se os atalhos de teclado e o teclado na tela funcionam no rádio.** Não há
  **uma** linha no mapa sobre isso (§ tarefa N13);
- **se o primário é estável com quatro no rádio.** A bancada mudou debaixo dos
  batedores hoje (dois DualSense às 18h15; zero às 19h29 e às 20h45) e agora
  `controllers` tem **um** item com `connected:false`. Nenhum número desta leva
  sobre 2 ou 4 controles é medição viva.

---

## 3. A coreografia dos agentes

**Seis agentes.** A regra que manda no paralelismo é uma só: **dois agentes
nunca abrem o mesmo arquivo na mesma onda.**

### Onda A — em paralelo (arquivos disjuntos)

| agente | arquivos | tarefas | devolve |
|---|---|---|---|
| **A1 — dono da lista de atalhos** | `app/actions/input_actions.py` | N1, N2 (desenho), N3 (desenho) | o repro da §2.1 rodando **antes e depois**, e a proposta de texto de N2/N3 para o olho dela |
| **A2 — dono do interruptor mudo** | `app/actions/mouse_actions.py`, `daemon/ipc_handlers.py` | N4 (desenho), N5, N6 (desenho) | o bloco `mouse_emulation` novo, medido com o daemon em modo jogo e desligado |
| **A6 — dono das mordidas e do mapa** | `docs/data/mapa-controles.csv`, `tests/`, `scripts/` | N13 | as cinco linhas novas com célula de rádio **vazia**, e o parecer sobre o portão de N14 |

A6 começa **medindo**, sem escrever código de produto: para cada cura das ondas
A e B, ele arranca a cura, roda a mordida, vê reprovar e devolve. É ele quem
reprova uma cura que passa com o remédio arrancado.

### Onda B — em série sobre o que a Onda A abriu

| agente | arquivos | tarefas | depende de |
|---|---|---|---|
| **A3 — dono do veredito de uinput** | `app/actions/mouse_actions.py`, `app/actions/emulation_actions.py`, `app/app.py` | N7 (desenho), N8 | **A2** (mesmo arquivo) e a Onda 5, que é dona da `emulation_actions.py` |
| **A5 — dono do teclado na tela** | `app/actions/emulation_actions.py` (`descrever_teclado_emulado`), `app/actions/input_actions.py` (legenda) | N12 (desenho) | **A3** (mesmo arquivo, função diferente) e **A1** (mesmo arquivo) |

### Onda C — o passe único no Glade, e a folha dela

| agente | arquivos | tarefas |
|---|---|---|
| **A4 — dono do dono do PC** | `app/actions/mouse_actions.py`, `app/widgets/`, `main.glade` | N9 (desenho), N10 (desenho), N11 |

**O `main.glade` tem UM escritor.** As três tarefas que mexem nele — N3
(título), N10 (tooltip), N14 (moldura Mapeamento) — passam por A4, **nesta
ordem**, num commit por tarefa. Quem escrever fora dessa fila colide.

**Ninguém commita texto de tela sem a folha.** As tarefas marcadas *estrutural*
(§5) juntam-se numa folha única, com a foto de antes ao lado da proposta, e
esperam a palavra dela. As *cosméticas* entram e a foto vai depois, em lote.

---

## 4. Antes de qualquer tarefa

O daemon vivo é mais velho que o código no disco (armadilha canônica em
[COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md)). Cura de daemon (N5) só vale
no **próximo start**, e **reiniciar é decisão dela**:

```bash
systemctl --user show hefesto-dualsense4unix.service -p ExecMainStartTimestamp --value
```

O socket para ler estado sem passar pela janela:

```bash
.venv/bin/python - <<'EOF'
import json, socket
s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM); s.settimeout(5)
s.connect("/run/user/1000/hefesto-dualsense4unix/hefesto-dualsense4unix.sock")
s.sendall((json.dumps({"jsonrpc":"2.0","id":1,"method":"daemon.state_full","params":{}})+"\n").encode())
buf = b""
while not buf.endswith(b"\n"):
    c = s.recv(65536)
    if not c: break
    buf += c
r = json.loads(buf.decode())["result"]
print(r["keyboard_emulation"], r["mouse_emulation"])
EOF
```

---

## 5. As tarefas

Carimbo de tela, pelas regras dela de hoje: **[cosmética]** entra sem o olho
dela (foto depois, em lote); **[estrutural]** espera a palavra dela; **[sem
tela]** não muda pixel nenhum.

### N1 — o gesto para de apagar o que a aba não mostra · A1 · [sem tela]

- **Onde:** `app/actions/input_actions.py:443-465`.
- **Conserto:** `_persist_key_bindings_to_draft` deixa de **substituir** e passa
  a **fundir**: parte de `_resolve_effective_bindings()`, sobrepõe o que a lista
  da tela diz, e preserva as chaves que estão no draft e **não** têm linha na
  tela. Um comentário datado explica por que existe chave fora de
  `CANONICAL_BUTTONS` (TOUCHPAD-DO-SISTEMA-01) e diz que fundir é o que impede
  a poda.
- **A mordida:** `tests/unit/test_atalho_fora_da_lista_nao_some.py` <!-- ref-externa: o teste nasce nesta tarefa --> — carrega
  `key_bindings` com as três chaves de touchpad, roda refresh + persist, exige
  as sete de volta. **Arranque a fusão** (volte ao `new_bindings` puro) e o
  teste tem de reprovar nomeando as três chaves. O repro da §2.1 é a segunda
  régua, independente do pytest.
- **Custo:** ~12 linhas de produto, ~40 de teste. Estimativa: 1h.

### N2 — a lista mostra o que o perfil guarda · A1 · [estrutural]

- **Onde:** `app/actions/input_actions.py:325-346`.
- **Conserto:** as chaves fora de `CANONICAL_BUTTONS` ganham linha, depois das
  canônicas, com o nome humano que `_BUTTON_LABELS` já tem (as três regiões
  estão lá, `:147-149`). **Não decida sozinho o texto:** a aba tirou essas
  linhas de propósito em 09/08, e devolvê-las mudas faz o produto oferecer o
  que não dispara. Leve a ela **duas** opções, com a foto de antes:
  (a) a linha aparece com um sufixo dizendo que hoje o touchpad é do sistema;
  (b) a linha não aparece e uma frase abaixo da lista diz que o perfil guarda
  três atalhos de touchpad que esta versão não dispara.
- **A mordida:** um teste sobre a função pura de montagem das linhas (mesma
  disciplina de `frase_dos_botoes_sem_tecla`): arranque a inclusão das chaves
  extras e o teste reprova. Prova de tela: foto antes/depois.
- **Custo:** ~15 linhas + o texto que ela escolher. Estimativa: 1h + a espera.

### N3 — o título para de dizer "perfil ativo" sem perfil ativo · A1/A4 · [estrutural]

- **Onde:** `main.glade:3936` (*"Atalhos de teclado do perfil ativo"*), com o
  dado em `daemon.state_full → active_profile`, medido **agora** como `None`.
- **Conserto:** o título diz de onde vêm as linhas — o nome do perfil quando há
  um, e "de fábrica" quando o draft herda (`key_bindings is None`). O rótulo
  passa a ser escrito em código, com o texto que ela aprovar.
- **A mordida:** teste do rótulo com `active_profile=None` e com `"Sackboy"`;
  arranque a escrita em código e o teste vê o texto fixo do Glade voltar.
- **Custo:** ~10 linhas. Estimativa: 40 min. **Depende da Onda 6** (quem é o
  dono do fato "perfil ativo" — hoje há duas respostas na janela).

### N4 — o interruptor apagado diz por que · A2 · [estrutural]

- **Onde:** `app/actions/mouse_actions.py:98-119` (o `else ""` da linha 117).
- **Conserto:** o caso `mode is None` ganha frase própria — não a do modo jogo,
  que afirmaria o que não se sabe. Algo como "não consigo falar com o Hefesto
  agora", com o destino certo. Texto novo ⇒ palavra dela.
- **A mordida:** teste sobre `_sync_mouse_mode_gate(None)`: interruptor
  insensível **e** frase visível. Arranque a frase e o teste reprova — hoje ele
  reprovaria na árvore de hoje, que é o ponto.
- **Custo:** ~8 linhas. Estimativa: 30 min.

### N5 — o payload do mouse aprende a dizer não · A2 · [sem tela]

- **Onde:** `daemon/ipc_handlers.py:2387-2391`, no molde de
  `_keyboard_emulation_payload` (`:1930-2009`).
- **Conserto:** o bloco `mouse_emulation` passa a publicar `device_ativo`,
  `despachando` e `bloqueio` (`"desligada"`, `"sem_device"`, `"modo_jogo"`,
  `"vpad_suspenso_pelo_steam_input"`, `null`). **A verdade já está no daemon** —
  é a mesma conjunção que o teclado já publica; nada de sonda nova.
- **A mordida:** teste de handler com daemon dublado em modo jogo: `bloqueio ==
  "modo_jogo"`. Arranque o cálculo do bloqueio e o teste reprova. Segunda
  régua, viva: o socket da §4 com a emulação de gamepad ligada tem de trazer
  `bloqueio` preenchido — **e lembre do relógio do processo** (§4).
- **Custo:** ~25 linhas de daemon, ~50 de teste. Estimativa: 1h30.

### N6 — recusa não é queda de linha · A2 · [estrutural]

- **Onde:** `app/actions/mouse_actions.py:190-232` (`_on_ok` que desvia para
  `_on_err`, e o texto da `:225`).
- **Conserto:** três saídas distintas — **ok**, **recusado com motivo** (o
  `bloqueio` da N5, traduzido como o teclado já traduz) e **sem resposta**. A
  reversão do interruptor continua como está (`BUG-MOUSE-TOGGLE-STALE-REVERT-01`).
- **A mordida:** teste que responde `{"status": "failed", "bloqueio":
  "modo_jogo"}` e exige o toast do motivo; arranque o desvio e o texto de
  comunicação volta, reprovando.
- **Custo:** ~20 linhas. Estimativa: 1h. **Depende de N5.**

### N7 — um veredito de uinput, um destino · A3 · [estrutural]

- **Onde:** `app/actions/mouse_actions.py:355-386`,
  `app/actions/emulation_actions.py:918-947`, `main.glade:3855`.
- **Conserto:** uma função pura — módulo próprio, no molde de
  `descrever_teclado_emulado` — devolve `(estado, frase, destino)`. As duas abas
  a chamam; o itálico do Glade perde o "ver aba Emulação" e passa a apontar para
  o mesmo lugar que a frase. Texto muda em **duas** abas ⇒ folha dela, com as
  duas fotos.
- **A mordida:** teste que roda a função nos quatro estados e exige que as duas
  abas produzam a **mesma** frase para o mesmo estado. Arranque a chamada de uma
  delas e o teste reprova por divergência.
- **Custo:** ~60 linhas (função + duas chamadas + teste). Estimativa: 2h.
  **Coordene com a Onda 5**, dona da `emulation_actions.py`.

### N8 — o veredito é relido ao entrar na aba · A3 · [cosmética]

- **Onde:** `app/app.py:1069-1071`, a entrada `tab_navegacao_dsx`.
- **Conserto:** somar `_refresh_mouse_view` à tupla. Nenhuma palavra nova na
  tela: o mesmo rótulo passa a ser recalculado quando ela volta da aba Sistema.
- **A mordida:** teste que troca de aba com a sonda dublada em "sem permissão" →
  "pronto" e exige o rótulo mudar. Arranque a entrada da tupla e o teste vê o
  texto velho ficar.
- **Custo:** 1 linha de produto, ~30 de teste. Estimativa: 40 min.

### N9 — a aba diz quem comanda o PC · A4 · [estrutural]

- **Onde:** coluna do mouse, abaixo do interruptor; dado em
  `controllers[*].is_primary` (já publicado).
- **Conserto:** uma linha dizendo qual controle está com o cursor, e — quando a
  mesa tem mais de um — que os outros **não** estão jogando enquanto o modo for
  "Controlar o PC" (§2.4). Mesa vazia diz mesa vazia, nunca silêncio.
- **A mordida:** teste com `state_full` de quatro controles: a linha nomeia o
  que tem `is_primary: true`; com zero, a linha diz que não há ninguém.
  Arranque a leitura e o teste reprova. **Depende da Z5** — sem uma régua só
  para quem está na mesa, esta linha herda a divergência de F6.
- **Custo:** ~40 linhas. Estimativa: 2h.

### N10 — o tooltip para de prometer o co-op que o modo desmonta · A4 · [estrutural]

- **Onde:** `main.glade:3621`, a frase *"os outros seguem jogando"*.
- **Conserto:** **substituir** (fato errado sai de todos os lugares, e este
  aparece uma vez). O que o produto faz está em
  `app/actions/mode_transition.py:114-127`. O texto novo é dela.
- **A mordida:** teste de texto de tela que reprova a frase antiga por
  substring — e que **também** falha se o passo `gamepad.emulation.set
  {enabled: false}` sair do plano do modo desktop, que é o fato que a frase
  descreve.
- **Custo:** ~5 linhas + teste. Estimativa: 40 min.

### N11 — a troca de mão do primário aparece · A4 · [sem tela]

- **Onde:** `core/backend_pydualsense.py:2318-2340` (a promoção) e a linha da N9.
- **Conserto:** nenhuma regra nova de eleição — só garantir que a linha da N9
  siga o tique e que a promoção seja observável de fora (o `is_primary` do
  `state_full` já é). Se a promoção não publicar nada, some um log com o `uniq`
  de antes e o de depois.
- **A mordida:** teste com dois handles: derrube o primeiro e exija `is_primary`
  no segundo **no payload**; arranque o `_recompute_primary` do caminho de
  desconexão e o teste reprova.
- **Custo:** ~30 linhas de teste, ~5 de produto. Estimativa: 1h.

### N12 — o teclado na tela deixa de ser promessa cega · A5 · [estrutural]

- **Onde:** `app/actions/emulation_actions.py:424-444` (`descrever_teclado_emulado`)
  e `app/actions/input_actions.py:55-66` (a legenda).
- **Conserto:** a janela lê `osk_disponivel` — o dado já viaja (§2.5). Com
  `false`, a legenda diz que **não há** teclado na tela instalado e que L3 não
  abrirá nada (é o único caminho para escrever texto); com `true`, para de
  recitar os dois nomes de programa. A linha "L3 → Abrir teclado na tela" da
  lista acompanha.
- **A mordida:** teste da função pura com os dois valores; arranque a leitura de
  `osk_disponivel` e as duas frases ficam iguais, reprovando.
- **Custo:** ~30 linhas. Estimativa: 1h30. **Depende de A3** (mesmo arquivo).

### N13 — as cinco linhas que faltam no mapa · A6 · [sem tela]

- **Onde:** [`docs/data/mapa-controles.csv`](../../data/mapa-controles.csv).
  Hoje esta aba tem **duas** linhas (`entrada.emulacao_mouse.gatilhos` e
  `.analogico`, ambas com cabo/rádio **vazios**) mais `toque.touchpad.cursor`
  (`sim`/`sim`). **Metade da aba não tem linha nenhuma** — e o que não tem linha
  o portão não reprova.
- **Conserto:** cinco linhas novas, cada uma com `teste_que_morde` preenchido e
  **célula de rádio vazia** (`◌ ninguém respondeu` é a verdade; preencher por
  analogia destrói o arquivo):
  1. `entrada.emulacao_mouse.botoes` — Cruz/Triângulo/R3 como cliques;
  2. `entrada.emulacao_mouse.rolagem` — analógico direito como rolagem;
  3. `entrada.emulacao_teclado.atalhos` — L1/R1/Options/Share como teclas;
  4. `entrada.emulacao_teclado.osk` — L3/R3 abrindo e fechando o teclado na tela;
  5. `entrada.emulacao_teclado.touchpad_regioes` — as três regiões, com a nota
     de que hoje o gate `ponteiro_do_sistema` as cala.
- **A mordida:** rode `scripts/gerar-mapa.py` e
  `scripts/check_paridade_transporte.py`; depois **plante** numa das cinco uma
  afirmação forte de rádio sem medição e exija reprovação. Se o portão passar,
  é a AUDITORIA-DE-PERDA-01 acontecendo de novo, e o achado é do A6.
- **Custo:** ~5 linhas de CSV (largas) + o parecer. Estimativa: 2h.

### N14 — a moldura Mapeamento para de afirmar no rádio · A4 · [estrutural]

- **Onde:** `main.glade:3729-3845`, as oito linhas da moldura **Mapeamento**.
- **Conserto:** as três linhas que a observação dela contradiz no rádio —
  `Cruz (X) ou L2`, `Triângulo (△) ou R2`, `Analógico esquerdo` (e a rolagem, do
  direito) — não podem seguir afirmando sem ressalva enquanto a medição não
  existir (§6). Leve a ela **duas** opções: (a) uma ressalva de rádio na
  moldura; (b) a moldura fica como está e a ressalva mora numa frase única
  abaixo. **Não invente número nem escreva "funciona no rádio".**
- **A mordida:** o portão de N13 tem de enxergar **este** texto. Plante
  *"funciona no cabo e no rádio"* na moldura e exija reprovação — foi
  exatamente essa plantação que passou verde na auditoria de 23/08.
- **Custo:** ~10 linhas + o portão. Estimativa: 1h30 (mais o portão, se o A6
  provar que ele é cego aqui).

---

## 6. O que o Bluetooth bloqueia

Trilha dela (D2). Esta sprint **não** planeja a medição — declara o que a aba
**não pode afirmar** enquanto ela não existir.

| pergunta | quem depende | o que a tela NÃO pode afirmar até a medição |
|---|---|---|
| gatilho e analógico movem/clicam o cursor no rádio? (a observação dela de 11/08 diz que **não**, e diz que **só o touchpad** funciona no rádio) | N14, a moldura Mapeamento inteira | as três linhas de `L2`, `R2` e analógico **como se valessem nos dois transportes** |
| no rádio chegam os **dois** nós evdev (gamepad e touchpad)? | N14, e o rumo do conserto | nada — mas a resposta decide se o defeito é de **código** (o leitor) ou de **rádio**. Pista já escrita na `nota` das duas linhas do mapa |
| os atalhos de teclado chegam no rádio? | N13 (linha 3), N12 | que "cada botão do controle pode digitar uma tecla" **sem transporte** |
| o teclado na tela abre no rádio? | N13 (linha 4), N12 | que L3 é o caminho para escrever texto **em qualquer transporte** |
| com quatro no rádio, o primário é estável ou troca quando um reconecta? | N9, N11 | que o controle nomeado na linha "quem comanda o PC" **continua** sendo o mesmo |

Enquanto qualquer uma estiver aberta, a regra é a da casa: célula vazia no mapa
e **silêncio** na tela — nunca uma afirmação por analogia.

---

## 7. As sprints absorvidas

| sprint | o que ela contribui aqui | morre ao fim desta? |
|---|---|---|
| [NAVEGA-PELO-CONTROLE-01](2026-08-15-NAVEGA-PELO-CONTROLE-01-quem-tem-o-foco-decide-o-que-o-R1-faz.md) | as decisões D-19 a D-23 dela, e a que manda nesta sprint: **um mapeamento de navegação para todos, sem tabela por controle** (D-23) — é o que faz N9 ser uma **linha que informa**, não um seletor | **não.** Navegar a janela pelo controle (R1/L1 na tira de abas) é entrega própria, e continua aberta |
| [NAVEGAR-ESTA-JANELA-01](2026-08-15-NAVEGAR-ESTA-JANELA-01-a-decisao-ja-esta-tomada-e-o-dado-ja-esta-no-fio.md) | o dado já no fio e as duas perguntas da seção 8 | **não** — mesma razão |
| [JANELA-QUE-RESPIRA-01](2026-08-01-JANELA-QUE-RESPIRA-01-os-consertos-de-largura-que-a-casa-ja-tinha-decidido.md) | o aceite dela na janela real, que esta aba nunca teve | **em parte:** a foto desta aba sai da folha desta sprint; o aceite das outras abas continua sendo dela |
| [PROVA-DE-TELA-01](2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md) | a folha respondida — o passo 4 do procedimento, que hoje não entra | **não.** É portão humano permanente; esta sprint só o cumpre |
| [PALAVRA-01](2026-07-27-PALAVRA-01-a-janela-fala-a-lingua-de-quem-joga.md) | a língua de quem joga nos textos novos de N2, N3, N4, N6, N7, N9, N10, N12, N14 | **não.** O portão `validar-palavra-de-tela.py` é permanente |
| [LINGUA-DO-PRODUTO-01](2026-08-07-LINGUA-DO-PRODUTO-01-o-convite-a-traduzir-era-falso.md) | português é a língua do produto: nenhum texto novo desta aba nasce esperando tradução | **não** |

---

## 8. O aceite

Nada fecha sem os dois blocos.

### 8.1 As mordidas desta sprint

```bash
# N1 — o repro da §2.1 (o script está lá), antes e depois
xvfb-run -a .venv/bin/python nav_repro.py \
  ~/.config/hefesto-dualsense4unix/profiles/point_and_click.json
# depois da cura: PERDIDOS: []

# os testes novos de N1 a N12 entram nesta lista à medida que nascerem
.venv/bin/python -m pytest -q \
  tests/unit/test_o_teclado_que_nao_digita.py \
  tests/unit/test_mouse_actions_gui_sync.py \
  tests/unit/test_emulacao_no_jogo_teclado.py \
  tests/unit/test_osk_handler.py

# N5 — o motivo chega no fio (com o daemon reiniciado POR ELA)
# use o bloco da §4 e confira `bloqueio` preenchido em modo jogo

# N13/N14 — o portão vê o texto desta aba
.venv/bin/python scripts/gerar-mapa.py
.venv/bin/python scripts/check_paridade_transporte.py
# e a plantação: uma promessa forte de rádio na moldura Mapeamento TEM de reprovar
```

**Regra que vale para cada uma:** arranque a cura, veja reprovar, devolva. Uma
mordida que não foi vista reprovando não mordeu.

### 8.2 Os portões da casa

```bash
git add -A                                  # os portões não veem arquivo novo
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
```

### 8.3 A prova de tela

`scripts/gui-captura/retratar_abas.py` **no fim da leva** (nunca durante, com as
ondas irmãs correndo), e a foto desta aba ao lado da de 18h15. As tarefas
**[estrutural]** só entram com a palavra dela na folha.

---

## 9. O que fica aberto, e de quem é

**Dela:**

1. **A trilha do Bluetooth** (§6) — as cinco perguntas. Sem elas, N14 fica no
   silêncio e o mapa fica com as células vazias, que é o certo.
2. **O texto de N2, N3, N4, N6, N7, N9, N10, N12 e N14** — tudo que muda o que
   se lê ao abrir a aba.
3. **As três regiões do touchpad voltam a ser do Hefesto?** É a mesma decisão
   dos dois lados: a reversão está escrita no cabeçalho de
   [`assets/76-dualsense-touchpad-libinput-ignore.rules`](../../../assets/76-dualsense-touchpad-libinput-ignore.rules)
   e *"uma coisa não vai sem a outra"*. Esta sprint só garante que a
   configuração dela **não seja apagada** enquanto a decisão não vem.
4. **Uma pessoa pode ESCOLHER qual controle comanda o PC?** Hoje não pode: o
   esquema declara mouse e teclado como single-controller por construção
   (`profiles/schema.py:884-890`) e o dono é o primário mais antigo. Mudar isso
   é produto, não conserto — e a D-23 dela já disse "sem tabela por controle",
   o que sugere que a resposta é **informar**, não escolher.

**Das outras ondas, e esta sprint não anda sem:**

- **Onda 5 (Emulação)** — dona da `emulation_actions.py`, que hospeda metade do
  código desta aba (o interruptor do teclado e o `descrever_teclado_emulado`).
  Ver [EMULAÇÃO — UM DONO SÓ-01](2026-08-24-EMULACAO-UM-DONO-SO-01-a-mascara-com-cinco-donos-e-o-verde-que-nao-tem-alvo.md);
- **Onda 6 (Perfis)** — dona do fato "perfil ativo" (N3) e do contrato do que o
  perfil guarda: hoje "Emular mouse" tem seção no perfil e "Emular teclado" só
  tem arquivo de flag, lado a lado na mesma aba, sem nada na tela dizendo qual
  é qual;
- **Z1** (a ponte que sabe dizer não) para N6, **Z5** (uma régua só para quem
  está na mesa) para N9 e N11, **Z6** (o portão que liga o mapa à tela) para
  N13 e N14, **Z7** (o ambiente presumido) para N12 — o teclado na tela é
  presunção de ambiente, e é ela que decide se o L3 vale fora desta máquina.

**Do executor, e fica registrado para não se reaprender:** a divergência entre o
retrato cru do Glade e o retrato do produto **nesta aba** (§2.6). Quem auditar
pela foto errada audita uma tela que não existe.
