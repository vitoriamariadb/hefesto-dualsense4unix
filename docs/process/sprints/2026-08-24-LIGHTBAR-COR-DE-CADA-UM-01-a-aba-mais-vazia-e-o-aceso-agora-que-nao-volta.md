# LIGHTBAR — COR DE CADA UM-01 — a aba mais vazia, e o "Aceso agora" que não volta

**24/08/2026.** Onda 7 da leva das onze abas. Aba **Lightbar** — a **5ª** da
tira (ordem real do `main_notebook`: Início, Status, No jogo, Gatilhos,
**Lightbar**, Rumble, Perfis, Sistema, Emulação, Navegação, Configurações).

| | |
|---|---|
| **Grau** | **MEDIDO** em tudo do §2.1 e do §2.2 — cada item tem o comando ou o `arquivo:linha` ao lado, e dois foram reproduzidos com o interpretador. **DESENHO** na coreografia, nas tarefas e no custo. |
| **Fecha** | O ramo degradado que apaga `auto_player_colors` do perfil dela sem gesto dela; o "Voltar ao automático" que não chega ao daemon; o "Aceso agora" que mente depois de uma recusa e que afirma uma leitura sem canal; a aba passando a ler os quatro campos que o daemon já publica sobre a barra; a prévia deixando de depender do português da fita; o `_edit_uniq` deixando de ser propriedade privada desta aba; o "Todos" que pinta o mesmo número de jogador nos quatro; o vão vertical; e o handler morto. |
| **NÃO faz** | Não mede rádio — a trilha de Bluetooth é dela com o assistente, na mesa do specs (§6). Não redesenha a aba: [LIGHTBAR-JOGADOR-01](2026-07-27-LIGHTBAR-JOGADOR-01-a-cor-e-consequencia-do-jogador.md), [ONDE-A-COR-MORA-01](2026-08-15-ONDE-A-COR-MORA-01-a-borda-diz-quem-e-e-o-anel-diz-o-que-esta-escolhido.md) e [MESA-CHEIA-03](2026-08-13-MESA-CHEIA-03-a-mesma-marca-na-aba-lightbar.md) são propostas para o olho dela e continuam dela. Não toca outra aba. Não mexe na política `LIGHTBAR-BT-NEVER-01`. |
| **Depende de** | **Z2** (dura: o `_edit_uniq` sai daqui), **Z3**, **Z5**, **Z6**. **A Z0 desta aba já está feita** — ver §2.3. |
| **Origem** | Batedor próprio nesta leva. Régua declarada: `Gtk.Builder` sobre o `main.glade` real, com os mixins reais de produção, sob Xvfb; mais leitura de código com endereço e três leituras read-only da bancada. |

---

## 1. O defeito, em uma frase

**A aba que existe para dar uma cor a cada um é a única do produto que não lê
nada do que o produto já sabe sobre a barra** — e, quando a janela perde de
vista quem está na mesa, um clique de cor apaga a identidade automática de
todo mundo, para sempre, sem uma palavra na tela.

---

## 2. O que está medido, e o que é hipótese

### 2.1 Na bancada, agora (23/08, ~22h, daemon vivo, nada parado, nada clicado)

Régua: o `state_full` do daemon e o `/sys`, lidos direto. Nenhum byte escrito
no aparelho.

```
$ .venv/bin/python -c "from hefesto_dualsense4unix.app import ipc_bridge; \
    print(ipc_bridge.daemon_state_full())"
topo:          connected=True   transport=bt
controllers:   1 registro — connected=False, transport=None, player=None,
               lightbar_rgb=None, lightbar_on=False,
               lightbar_source='desconhecida', lightbar_disputada=False
coop:          enabled=True, players=1, mesa=[]

$ ls /sys/class/leds/ | grep -c player                       # 5
$ ls -d /sys/devices/virtual/misc/uhid/*054C:0DF2* | wc -l    # 1
```

**Três fatos, e os três mandam nesta sprint:**

1. **A F6/Z5 está viva agora, nesta janela.** O topo do `state_full` diz
   `connected` e o registro de controle diz o contrário, no MESMO payload.
   Toda afirmação desta aba sobre "o controle" herda essa divergência.
2. **`coop.mesa == []`**, logo `_uniqs_conectados()` (`lightbar_actions.py:235`)
   devolve `[]`. Este é **exatamente** o estado em que o ramo degradado do
   §2.2/M1 dispara.
3. **O daemon publica QUATRO campos de barra por controle** —
   `lightbar_rgb`, `lightbar_on`, `lightbar_source`, `lightbar_disputada`
   (semântica em `daemon/ipc_handlers.py:2995-3018`) — e todos os quatro
   chegam à janela hoje.

> **Correção ao briefing desta leva.** Ele diz "2 DualSense no rádio". Havia
> **um** nó uhid às 19h20 e o mesmo um agora, e ele está `connected: false`
> para o daemon. Nenhum número desta onda sobre 2 ou 4 controles é medição
> viva; o §8/bloco 4 diz o que fazer com isso.

### 2.2 Por leitura de código, com endereço

**M1 — Um clique de cor apaga `auto_player_colors` do perfil dela, e esse
campo governa a paleta E a numeração dos DualSense E a dos externos.**

`_aplicar_cor_no_controle` (`lightbar_actions.py:638`) tem três ramos
(`:668-693`):

```python
alvos = self._uniqs_conectados() if self._edit_uniq() is None else []
if   self._edit_uniq() is None and alvos:              # (a) led.set por MAC — R-14
elif self._edit_uniq() is None and draft is not None:  # (b) DEGRADADO
else:                                                  # (c) led.set com uniq
```

O ramo **(b)** chama `_d4_disable_auto_for_single_color()` (`:673-674`), que
grava `auto_player_colors: False` no rascunho e no perfil. O que ele custa
está escrito no próprio código (`:322-332`, R-14): *"além da paleta, o flag
governava a numeração dos DualSense E a dos externos (Pro Nintendo/8BitDo
paravam de receber número) (…) um clique de cor em 'Todos' apagava a
identidade automática de todo mundo, para sempre"*.

O defeito não é o ramo existir — é **quando** ele roda. `_edit_uniq()`
(`:259`) devolve `getattr(self, "_edit_target_uniq", None)`, e esse atributo
tem **um escritor só**: o tique de 2 Hz da aba Status. Com a Status não
montada, o tique parado ou o mapa vazio — que é o estado medido em §2.1/item 2
—, a fita do cabeçalho continua dizendo "Controle 2" e a aba cai no ramo (b).

**A assimetria que prova que é defeito e não desenho está dentro da MESMA
aba:** a metade das 5 luzes já recusa esse caso com frase própria
(`_enviar_player_leds:965-967` → `_AVISO_SEM_DESTINATARIO`), porque a
PLAYER-01/entrega 6 mediu que escrever sem destinatário "voltava sozinho". A
metade da cor não recusa: degrada, e leva o perfil junto.

**M2 — "Voltar ao automático" não chega ao daemon quando é o último. MEDIDO,
reproduzido.**

`on_lightbar_auto_reset_target` (`:856`) limpa a cor do override
(`:877`), o toast promete *"a cor automática volta a valer neste controle no
próximo Aplicar"* — e o próximo Aplicar não a remove.

```
$ .venv/bin/python - <<'EOF'
from hefesto_dualsense4unix.app.draft_config import DraftConfig, LedsDraft
d = DraftConfig(); U = "aa:bb:cc:00:00:11"
d2 = d.with_controller_leds(U, LedsDraft(lightbar_rgb=(255,0,0), lightbar_brightness=100))
print(d2.to_ipc_dict()["controllers"])
d3 = d2.with_controller_fields_cleared(U, "leds", {"lightbar","lightbar_brightness"})
print(d3.to_ipc_dict()["controllers"])
EOF
{'aa:bb:cc:00:00:11': {'leds': {'lightbar_rgb': [255, 0, 0], 'lightbar_brightness': 1.0}}}
None
```

A cadeia inteira, com endereço: o override esvazia →
`_controllers_to_ipc` devolve `None` (`draft_config.py:1295, :1313`) →
`to_ipc_dict` emite `"controllers": None` (`:1552`) → `_apply_section` sai na
primeira linha (`daemon/ipc_draft_applier.py:121`, `if raw is None: return`) →
`_apply_controllers` **não roda** → `reset_output_overrides` **não roda**. E é
o `reset_output_overrides` que apaga o override antigo: o próprio
`_apply_controllers` (`:284-300`) documenta que sem ele *"um ajuste especial
que a usuária TIROU de um controle na GUI (…) seguiria vivo no controle até a
próxima troca de perfil"*. A cura existe e **é pulada exatamente no caso em
que ela é necessária**.

**Com DOIS overrides, limpar um funciona** (medido na mesma sessão: a seção
viaja com o que sobrou e o `reset` substitui o mapa inteiro). O buraco é **só
o último** — o que o torna invisível em teste com dois dublês e certeiro para
quem tem um controle. **E é transversal:** o mesmo `to_ipc_dict` carrega
gatilho, vibração e alto-falante por controle. Tirar o último de qualquer um
deles tem o mesmo destino.

**M3 — O "Aceso agora" mente logo depois de uma recusa.**

`_set_player_leds` (`:1078`) faz, nesta ordem: persiste no rascunho
(`:1099`), envia (`:1100` → `ok, motivo`), mostra o toast com o resultado
(`:1111`) e então chama `_atualizar_estado_das_luzes(bits)` (`:1115`)
**sem olhar `ok`**. Com a mesa vazia o envio recusa
(`_AVISO_SEM_DESTINATARIO`), o toast diz que não deu — e o rótulo três
centímetros acima passa a dizer *"Aceso agora: desenho do P2 — escolha sua."*
Duas afirmações contraditórias, na mesma aba, do mesmo clique.

**M4 — O "Aceso agora" afirma uma leitura que o mapa mede como inexistente.**

`texto_do_desenho_aceso` (`:165`) é função **pura do rascunho**: nada nela
consulta o aparelho. E o mapa diz que consultar não é possível —
`luz.led_jogador.leitura@dualsense`: `cabo_aceita = não`, `radio_aceita =
não`, `aciona = parcial` nos dois. A afirmação de tela mais forte está em
[`interface.md`](../../usage/interface.md), que diz que a linha "Aceso agora"
mostra o que está aceso neste instante. Não mostra: mostra o que foi PEDIDO.

**M5 — A aba da barra é a única do produto que não lê nada do que o daemon
sabe da barra.**

```
$ grep -rln "lightbar_source\|lightbar_disputada\|lightbar_on" \
    src/hefesto_dualsense4unix/app/
src/hefesto_dualsense4unix/app/widgets/controller_card.py
```

Um leitor só, e é o **card do controle**, que mora na Status, na Início e na
"No jogo". Consequência direta: quem está **na aba da cor** é justamente quem
não é avisado de que a Steam segura o `hidraw` deste controle
(`lightbar_disputada`, `controller_card.py:1153`) e de que a cor no rótulo é a
pedida, não a acesa (`lightbar_source`).

**M6 — A prévia depende de uma expressão regular sobre o TEXTO em português
da fita — e traduzir a interface a faz voltar a mentir.**

`_auto_preview_slot` (`:271`) existe por um achado ao vivo de 17/07: com as
cores automáticas ligadas e um controle escolhido, a prévia mostrava a cor
manual em vez da da paleta — **mentindo**. A cura descobre o número assim
(`:286-289`):

```python
label = getattr(self, "_edit_target_label", None)
match = re.search(r"Controle\s+(\d+)", label)
```

O rótulo é `translatable="yes"`. Em inglês ele vira "Controller 2", a busca
falha, a função devolve `None` e a prévia volta a mostrar a cor manual — **o
defeito exato que ela foi criada para curar, ressuscitado por um idioma.** E o
número canônico está a sete linhas de distância: `_edit_target_slot`, mantido
pela Status (`status_actions.py:2017`), que **este mesmo arquivo** já usa em
`_atualizar_estado_das_luzes` (`:492`).

**M7 — "Todos" pinta o mesmo número de jogador nos quatro, e há teste verde
travando isso.**

`_enviar_player_leds` (`:968`) manda o **mesmo** bitmask para cada MAC da
mesa, e `_persist_leds_update` grava esse mesmo desenho no override de cada
um. Clicar "Desenho do P2" com o alvo em "Todos" faz os quatro controles
exibirem o desenho do jogador 2 — e salva assim no perfil.
`tests/unit/test_lightbar_todos_por_mac_r14.py:166` afirma isso como correto
(`for uniq in (UNIQ_1, UNIQ_2): assert ... player_leds == p3`). É a invariante
de co-op quebrada na superfície que existe justamente para distinguir
jogadores.

**M8 — A aba sabe nomear o P5 e não sabe oferecê-lo.**

`core/led_control.py:105-114` define padrões para **1..8** (R-25) e
`:146-153` define cores para **1..8**, porque o espaço de numeração é único
entre DualSense, externos e co-op (R-24) — um DualSense cai legitimamente no
slot 5 quando há externos numerados antes. O glade oferece **quatro** botões:
`player_leds_preset_p1..p4` (`main.glade:1471-1495`). Com a mesa dela cheia e
um Pro Controller na conta, o slot 5 existe e a aba não tem como pedi-lo.

**M9 — Handler morto, registrado no dicionário de sinais.**

`on_player_led_toggled` (`:1049`, 27 linhas) está em `app.py:339`. Os
`<signal name="toggled">` **saíram do glade** na BOTÃO-QUE-NÃO-MENTE-01,
e o próprio XML registra a medição (`main.glade:1395-1410`): a caixa é
`visible=False`/`no-show-all`, ninguém clica, e os dois lugares que chamam
`set_active` já se protegem por guard. Nada o chama. É F2 na forma mais barata
de matar.

**M10 — Os ~600 px mortos.** Na foto de hoje (1920x1080) o conteúdo da coluna
esquerda termina em y≈460 e o da direita em y≈455; as duas molduras vão até
y≈1065. É o único achado que a geometria sustenta sozinha.

**M11 — Nada na aba diz em qual controle ela está mexendo.**
`tab_lightbar_box` (`main.glade:1155-1630`) não tem um widget de alvo. Os
tooltips falam do *"controle selecionado no seletor acima"*, e o "acima" é a
fita do `header_bar`, **fora do recorte de toda foto de aba**.

**M12 — Os Gatilhos dependem de um método privado desta aba.**
`lightbar_actions.py:259` é a única definição de `_edit_uniq`.
`triggers_actions.py:587` e `:654` fazem `getattr(self, "_edit_uniq", lambda:
None)()`, com o comentário literal *"segue global, como antes"*. Sumindo o
mixin da Lightbar da MRO — um refactor de outra aba basta — **os Gatilhos
passam a escrever nos quatro controles em silêncio**, que é a regressão que a
ABAS-06 curou em 25/07. É a razão de esta onda vir antes da dos Gatilhos.

**M13 — A "Luminosidade (%)" não tem linha no mapa.** O brilho de **hardware**
da barra (`luz.lightbar.brilho@dualsense`) tem `aciona = não` nos dois
transportes. O que o controle deslizante faz é **multiplicar o RGB em Python**
(`core/backend_pydualsense.py:819`) — outra grandeza, que **funciona** e não
tem chave. É buraco de censo, não fato errado; e a ressalva da linha irmã já
avisa: *"Quem lê a doc e a tela pode concluir que são o mesmo controle. Não
são."*

**M14 — O `LEIA-PRIMEIRO` do mapa conta 47 colunas; são 49.**
`head -1 docs/data/mapa-controles.csv | tr ',' '\n' | wc -l` → **49**. O par
que falta na conta é `cabo_por_que_nao_aciona`/`radio_por_que_nao_aciona`.
Não é desta onda curar — é da Z6 — mas quem cruzar tela e mapa aqui vai
tropeçar nele, e fica dito.

### 2.3 Três fatos que caducaram, e esta sprint os SUBSTITUI

Nenhum dos três é decisão medida: são afirmações que a medição derrubou.
Aplicando o teste da casa — *apagar isto faria alguém repetir trabalho já
pago?* — a resposta é **não** nos três.

1. **"A foto desta aba é o XML cru."** Era verdade até o commit `3de95ff` de
   hoje. `scripts/gui-captura/retratar_abas.py:1420` tem
   `_montar_aba_lightbar`, chamado em `:2211`; a foto publicada
   (`docs/usage/assets/readme_lightbar.png`, 23/08 21h12) mostra a prévia
   pintada e o "Aceso agora" com frase real. **A Z0 desta aba está feita** e
   a tarefa de host que o plano anterior previa sai da fila.
2. **"`LIGHTBAR-BT-NEVER-01` e `ROTA-BT-EM-REGIME-01` se contradizem e uma
   está velha."** Está no [SPRINT_ORDER](../SPRINT_ORDER.md) em duas linhas, e
   **o mapa já reconciliou as duas em 16/08**: em
   `luz.lightbar.cor@dualsense/radio_comando` — *"O que segue SUPRIMIDO por BT
   é o FLUXO do report_thread (`handle._suppress_leds`), nunca a escrita
   avulsa (…) SUBSTITUIU, em 16/08/2026, 'ÚNICA rota: sysfs'"*. As duas rotas
   saem. Quem executar **não precisa reabrir isso**; o que continua sem
   medição é outra pergunta, e ela está no §6. A correção no `SPRINT_ORDER`
   é do dono dele, não desta sprint.
3. **"A aba Lightbar não tem buraco de Z4."** O plano anterior a declarou
   exceção da leva. O M2 derruba: o **último** ajuste por controle não chega
   ao daemon. Ela tem buraco, e ele é transversal.

### 2.4 O que continua HIPÓTESE, e continua sendo

- **NÃO VERIFICADO:** se o ramo (b) do M1 já queimou a paleta dela na prática.
  O mecanismo está provado no código; a ocorrência, não. Nenhum log foi lido.
- **NÃO VERIFICADO:** o M2 com o daemon na ponta. A cadeia foi provada no
  interpretador, do rascunho até a linha do applier que sai; ninguém viu o
  controle continuar com a cor antiga depois de um Aplicar real.
- **NÃO VERIFICADO:** quantos testes desta aba morrem com cada cura arrancada.
  Os dezesseis arquivos de `tests/unit/*lightbar*|*player_led*` foram
  **listados**, não mutados.
- **NÃO MEDIDO NESTA ONDA:** qualquer coisa com o controle na mão. A bancada
  tinha um DualSense, `connected: false` para o daemon (§2.1).

---

## 3. A coreografia dos agentes

**Oito agentes, três rodadas.** Não há rodada de batedor: ela já aconteceu, e
o resultado é o §2. O que substitui o portão de replanejamento é mais barato:
**cada agente relê o §2 antes de escrever a primeira linha, e um achado que
não bater com o código de hoje vira nota no §9 em vez de conserto às cegas.**

### Rodada 1 — quatro agentes em paralelo, arquivos disjuntos

| agente | tarefas | arquivos |
|---|---|---|
| **A2** — o dono do "Voltar ao automático" | L3 | `app/draft_config.py`, `daemon/ipc_draft_applier.py` |
| **A6** — o dono da prévia | L7 | `app/actions/lightbar_actions.py:271-289` (bloco isolado) |
| **A7** — o dono do vão e do P5 | L8, L9 | `gui/main.glade`, `core/led_control.py` (só leitura) |
| **A8** — o dono das mordidas | L10, L11 | `tests/unit/` (arquivo novo), `app/app.py:339` |

**Por que A6 pode correr junto com A1/A3/A5 apesar do arquivo comum:**
`_auto_preview_slot` é um bloco de 19 linhas que ninguém mais toca nesta
sprint. Quem orquestra confere o `git diff` antes de mesclar; se houver
sobreposição, A6 desce para a rodada 2.

### Rodada 2 — três agentes em SÉRIE na faixa `lightbar_actions.py`

Série, não paralelo: os três mexem no mesmo arquivo, e **L1 depende do alvo já
resolvido por L2**.

| ordem | agente | tarefas |
|---|---|---|
| 1º | **A1** — o dono do ramo degradado | L2 (consome a Z2) e **depois** L1 (a cor recusa em vez de degradar) |
| 2º | **A3** — o dono do "Aceso agora" | L4 (para de mentir depois da recusa) e L5 (para de afirmar leitura) |
| 3º | **A5** — o dono da leitura do daemon | L6 (os quatro campos chegam à aba, e a disputa da Steam aparece aqui) |

### Rodada 3 — o dono do "Todos", e o fechamento

| agente | tarefa |
|---|---|
| **A4** — o dono do "Todos" | L12 — o desenho por controle. **Começa levantando a pergunta para ela** (§9) e só escreve depois da resposta; enquanto ela não vier, entrega a mordida vermelha e o texto de tela que para de esconder o efeito |

Ao fim, A7 roda `scripts/gui-captura/retratar_abas.py`, o lote de fotos vai
para o olho dela, e A8 fecha as mordidas contra a árvore já curada.

### O que quebra se alguém mexer sozinho

| gancho | quem depende | o que acontece se ignorar |
|---|---|---|
| `_edit_uniq` mora aqui e os Gatilhos o leem por `getattr` | Gatilhos | broadcast **em silêncio** (M12). É por isso que esta onda vem antes da deles |
| `_edit_target_uniq`/`_slot`/`_coop_ligado`/`_target_uniq_by_index` nascem na Status | Lightbar, Gatilhos, Rumble, Configurações | tudo do M1 e do M6. É a Z2 |
| `to_ipc_dict` é um só para as onze abas | Gatilhos, Rumble, Perfis, rodapé | L3 conserta os quatro de uma vez, ou nenhum |
| `lightbar_*` já são lidos pelo `controller_card` | Status, Início, No jogo | se L6 duplicar a interpretação, o produto ganha **duas** semânticas para `lightbar_source` |
| `retratar_abas.py` é um arquivo só | todas as ondas | a foto sai **em série** com as outras ondas, nunca em paralelo |

---

## 4. As tarefas

Doze.

---

### L1 — A cor recusa em vez de degradar (Z3) *(A1, depois de L2)*

**Arquivos:** `app/actions/lightbar_actions.py:668-693` (o ramo (b)) e
`:753-820` (o gêmeo dentro de `on_lightbar_off`).

**O conserto:** o ramo (b) só roda quando o alvo é **de verdade** "Todos".
Quando `_edit_uniq()` devolve `None` **porque a mesa é desconhecida** — e não
porque ela escolheu "Todos" —, o caminho da cor recusa com motivo, como
`_enviar_player_leds` (`:965`) já faz. A distinção entre os dois casos é o que
a Z2 entrega (`app/alvo_de_edicao.py` separa `TODOS` de `DESCONHECIDO`); sem
ela esta tarefa não tem como ser escrita, e é por isso que L2 vem antes.

**O que NÃO muda:** `_enviar_led_em_todos` (`:914`) é broadcast **por
desenho**, medido e defendido (R-14, um `led.set` por MAC). Fica como está.

**A mordida:** host com a fita dizendo "Controle 2" e `_target_uniq_by_index`
vazio → "Aplicar no controle" **recusa**, e `draft.leds.auto_player_colors`
continua `True`. Arranque a recusa: reprova em duas asserções — a escrita saiu
para a mesa e a paleta foi desligada.

**Custo:** ~45 linhas, 2 h. **Carimbo:** **não toca a tela** (a recusa reusa o
`_AVISO_SEM_DESTINATARIO` que já está lá).

---

### L2 — O `_edit_uniq` deixa de ser propriedade privada desta aba (Z2) *(A1)*

**Arquivos:** `app/actions/lightbar_actions.py:235-265` (remove),
`app/actions/triggers_actions.py:587, :654` (passa a importar do dono).

**O conserto:** `_edit_uniq` e `_uniqs_conectados` saem daqui e passam a vir de
`app/alvo_de_edicao.py`, que declara na própria docstring que a migração dos
nove leitores ficou para outra leva — **esta é a leva, do lado da Lightbar**.
Aqui fica só o consumo. Os dois `getattr(self, "_edit_uniq", lambda: None)()`
dos Gatilhos deixam de ter default silencioso: sem o dono, é erro alto, não
escrita global.

**A mordida:** monte um host **sem** o `LightbarActionsMixin` e chame o caminho
de `triggers_actions.py:587`. Hoje ele escreve global e passa; depois desta
tarefa **reprova em voz alta**. Arranque o dono da Z2 e veja os dois lados
reprovarem.

**Custo:** ~40 linhas movidas, 1 h 30. **Carimbo:** não toca a tela.

---

### L3 — O último ajuste por controle chega ao daemon (Z4) *(A2)*

**Arquivos:** `app/draft_config.py:1295` (`_controllers_to_ipc`), `:1552` (a
emissão) e/ou `daemon/ipc_draft_applier.py:121`.

**O conserto, e a escolha do lado importa.** Duas saídas, e a segunda é a
certa: (a) `_controllers_to_ipc` devolver `{}` em vez de `None` quando o mapa
esvaziou — mas `{}` é falso em Python e o `if raw is None` do applier não é o
único guard na cadeia; (b) o rascunho **distinguir** "nunca teve override" de
"tinha e não tem mais", e emitir a seção vazia só no segundo caso. **(b) é a
que explica o que já funcionava** — a seção continua ausente para quem nunca
teve override, e daemon antigo segue ignorando a chave (aditivo). Contorno em
(a) é gambiarra: apagaria overrides de quem nunca pediu nada.

**Isto conserta gatilho, vibração e alto-falante junto**, porque a seção é a
mesma. Diga isso no commit — e diga também que **não** conserta o `mode` nem o
`suppress_desktop_emulation`, que não viajam no Aplicar por decisão medida
(HARM-05, `draft_config.py:1394`).

**A mordida:** dois testes. (1) rascunho com UM override → limpar o campo →
`to_ipc_dict()["controllers"]` tem de ser `{}`, não `None`; (2) applier
recebendo `{}` tem de chamar `reset_output_overrides(None)`. Arranque a
distinção e veja o primeiro voltar a `None` e o segundo a zero chamadas.
Junte a saída literal do pytest ao commit.

**Custo:** ~35 linhas, 2 h 30. **Carimbo:** não toca a tela.

---

### L4 — O "Aceso agora" para de mentir depois de uma recusa *(A3)*

**Arquivo:** `app/actions/lightbar_actions.py:1100-1115`.

**O conserto:** `_atualizar_estado_das_luzes` só afirma o desenho novo quando
`ok` é verdadeiro. Na recusa, o rótulo mantém o que estava **ou** diz que não
foi aplicado — nunca anuncia como aceso um desenho que o produto acabou de
declarar que não conseguiu enviar. Os outros dois caminhos que compartilham
`_enviar_player_leds` (`:1040`, `:1064`) ganham o mesmo tratamento.

**A mordida:** host com `_uniqs_conectados()` vazio → clique em "Desenho do
P2" → o toast diz que não deu **e** o rótulo `player_leds_estado` não contém
`"P2"`. Arranque o gate de `ok` e veja o rótulo voltar a afirmar.

**Custo:** ~20 linhas, 1 h 30. **Carimbo:** **ESTRUTURAL — o olho dela ANTES**
(a frase de "não foi aplicado" é texto novo na tela).

---

### L5 — O "Aceso agora" para de afirmar leitura que não existe *(A3)*

**Arquivos:** `app/actions/lightbar_actions.py:165-208`
(`texto_do_desenho_aceso`), [`docs/usage/interface.md`](../../usage/interface.md).

**O conserto:** o texto separa o que o produto **mandou** do que a barra
**está fazendo**, porque `luz.led_jogador.leitura@dualsense` mede que não há
canal de leitura (`aceita = não` nos dois transportes). E o fato errado do
`interface.md` — que a linha diz o que está aceso neste instante — é
**SUBSTITUÍDO**, não anotado, e sai de **todos** os lugares onde a afirmação
aparece, não só de onde foi notado.

**A mordida:** portão de léxico. Nenhum rótulo desta aba pode afirmar estado
de barra sem que o mapa registre canal de leitura para a chave correspondente.
Arranque a regra e veja a frase de hoje reprovar. **Onde esta mordida encosta
na Z6:** o portão de hoje não lê uma linha de `main.glade` — sem a Z6, a regra
vale para o `interface.md` e não para a tela. Diga isso no commit em vez de
fingir cobertura.

**Custo:** ~25 linhas de código, ~8 de doc, 2 h. **Carimbo:** **ESTRUTURAL —
o olho dela ANTES.**

---

### L6 — A aba passa a ler o que o daemon sabe da barra (Z5) *(A5)*

**Arquivos:** `app/actions/lightbar_actions.py:475-497`, `gui/main.glade` (um
rótulo na coluna esquerda).

**O conserto, em duas metades:**

- **O dado.** A aba consome `lightbar_rgb`, `lightbar_on` e `lightbar_source`
  do `state_full` para o controle em edição. Com `lightbar_source == "sysfs"`
  a tela pode dizer a cor efetiva; com `"desired"` diz *"a última cor que
  mandamos"*; com `"desconhecida"` **não diz cor nenhuma**. A terceira é a que
  importa, e é a mesma disciplina que `secao_controles.py` já aplica: um "não
  sei" não vira aviso. **Reuse a interpretação do `controller_card.py:1106-1160`
  em vez de reescrevê-la** — duas semânticas para o mesmo campo é o defeito
  F5 nascendo dentro da cura.
- **A disputa.** `lightbar_disputada` ganha leitor aqui. Hoje o único leitor
  mora em outras três abas, então quem está na aba da cor é justamente quem
  não é avisado de que a Steam segura o `hidraw`. É a entrega que faltava da
  [ESCRITOR-CRU-01](2026-08-16-ESCRITOR-CRU-01-a-steam-apaga-a-barra-e-o-produto-nao-reagia.md).

**A mordida:** `lightbar_source: "desconhecida"` → o rótulo não nomeia cor nem
usa a palavra "aceso". `lightbar_disputada: True` → o aviso aparece e o rótulo
rebaixa a afirmação. Arranque cada leitor e veja reprovar com a frase antiga.

**Custo:** ~90 linhas, 3 h 30. **Carimbo:** **ESTRUTURAL — o olho dela ANTES**
(nasce visível ou colapsado é decisão dela).

---

### L7 — A prévia deixa de depender do português da fita *(A6)*

**Arquivo:** `app/actions/lightbar_actions.py:271-289`.

**O conserto:** `_auto_preview_slot` passa a ler `_edit_target_slot` — o
número canônico, mantido pela Status (`status_actions.py:2017`) e já usado
neste mesmo arquivo em `:492`. A expressão regular sobre o rótulo sai. O
`getattr` defensivo fica: sem slot conhecido, devolve `None` como hoje.

**A mordida:** host com `_edit_target_label = "Controller 2"` (inglês) e
`_edit_target_slot = 2` → a prévia tem de mostrar a cor da paleta do jogador
2. Arranque a leitura do slot e veja reprovar mostrando a cor manual — que é
o defeito de 17/07 ressuscitado. Um segundo caso: rótulo em português e slot
`None` → devolve `None` (o defensivo sobrevive).

**Custo:** ~12 linhas, 1 h. **Carimbo:** **não toca a tela** (nenhum texto
muda; muda o que a prévia pinta, e ela já deveria pintar isso).

---

### L8 — Os ~600 px mortos em cada coluna *(A7)*

**Arquivo:** `gui/main.glade:1155-1630` (as duas molduras).

**O conserto:** as duas colunas param na altura natural em vez de esticarem
até o fim da página. Mesma classe de conserto do teto elástico que a
LARGURA-01/E5 já aplicou na largura desta aba
(`app.py:_PAGINAS_COM_TETO_ELASTICO` já lista `tab_lightbar_box`), e a mesma
queixa da [VAO-01](2026-07-27-VAO-01-a-tela-sobra-e-o-conteudo-aperta.md).

**A mordida:** geometria sob Xvfb (`xvfb-run -a --server-args="-screen 0
1920x1080x24"`), no molde do `test_layout_orcamento_altura.py`: a soma das
alturas naturais das duas colunas não pode ficar a mais de N px da alocada.
Arranque o `valign` e veja reprovar com o número de hoje.

**Custo:** ~10 linhas, 1 h 30 (quase tudo é a régua). **Carimbo:**
**COSMÉTICA — pré-aprovada pela D3.** Foto vai no lote, sem esperar.

---

### L9 — Os desenhos 5..8, que a aba sabe nomear e não sabe oferecer *(A7)*

**Arquivos:** `gui/main.glade:1440-1520`, `app/actions/lightbar_actions.py:1004-1022`.

**O conserto:** os presets deixam de ser quatro botões escritos à mão e passam
a sair de `player_led_pattern(n)` (`core/led_control.py:122`), que já cobre
1..8 e tem padrão de overflow para ≥9. O desenho de quantos botões mostrar —
sempre oito, ou só até o maior slot vivo na mesa — **é dela** (§9); o que esta
tarefa entrega é a fiação que torna as duas respostas baratas, e o fim do
`[False, True, False, True, False]` literal repetido quatro vezes no código.

**A mordida:** um teste que compara cada preset com `player_led_pattern(n)`
para n em 1..4. Troque um bit de `_PLAYER_LED_PATTERNS[2]` e veja o botão P2
reprovar — hoje ele não reprova, porque o literal e a tabela são cópias
independentes que ninguém amarra.

**Custo:** ~30 linhas, 2 h. **Carimbo:** **ESTRUTURAL se mudar quantos botões
aparecem** (é o que se vê ao abrir); **não toca a tela** se ficar só na
fiação. Entregue a fiação primeiro e a pergunta dela depois.

---

### L10 — O handler morto sai, e a mordida que o pegaria nasce *(A8)*

**Arquivos:** `app/actions/lightbar_actions.py:1049-1075` (remove),
`app/app.py:339` (remove a entrada), `tests/unit/` (portão novo).

**O conserto:** as 27 linhas de `on_player_led_toggled` saem, e a entrada do
dicionário de sinais sai junto. As **caixas ficam** — o glade já mediu por que
(`main.glade:1410-1420`): `get_current_player_leds` (`:1116`) as lê por id, e
sumir com elas faria "Aplicar o desenho" apagar as cinco luzes e gravar "tudo
apagado" no perfil dela.

**A mordida — e ela vale muito mais que a remoção.** A forma que falta em
todos os portões desta casa é a mesma: *"existe chamador de PRODUÇÃO?"*.
Escreva-a aqui, com escopo declarado nesta aba (o `lightbar_actions.py` e o
dicionário de sinais de `app.py`), não no repositório inteiro — um portão que
nasce global nasce ignorado. Arranque a remoção e veja o portão reprovar
nomeando `on_player_led_toggled`.

**Custo:** ~35 linhas removidas, ~50 de portão, 2 h. **Carimbo:** não toca a
tela.

---

### L11 — O arquivo de mordidas desta onda *(A8)*

**Arquivo:** `tests/unit/` — arquivo novo.

Hoje dezesseis arquivos exercem esta aba e **nenhum** cobre os seis casos que
são os seis consertos desta onda:

1. mesa desconhecida + fita dizendo "Controle 2" → a cor **recusa** e a paleta
   sobrevive (L1);
2. host **sem** o `LightbarActionsMixin` → os Gatilhos **falham alto** (L2);
3. último override limpo → a seção `controllers` **viaja vazia** (L3);
4. envio recusado → o rótulo **não** afirma o desenho (L4);
5. `lightbar_source: "desconhecida"` → o rótulo não nomeia cor (L6);
6. rótulo em inglês + slot conhecido → a prévia mostra a cor da paleta (L7).

**A mordida:** cada um reprova com a cura correspondente arrancada, e a saída
literal do pytest vai no commit — no molde do `mordida_provada_em` de
`luz.lightbar.aviso_de_modo@dualsense`, que é o padrão de prova mais alto
deste repositório.

**Custo:** ~240 linhas, 3 h 30. **Carimbo:** não toca a tela.

---

### L12 — O "Todos" e o desenho de cada um *(A4)*

**Arquivos:** `app/actions/lightbar_actions.py:938-970`,
`tests/unit/test_lightbar_todos_por_mac_r14.py:166`.

**O fato (M7):** "Desenho do P2" com o alvo em "Todos" faz os quatro
controles exibirem o desenho do jogador 2, e salva assim no perfil de cada um.
Isso apaga exatamente a distinção que as cinco luzes existem para dar.

**As duas respostas possíveis, e a escolha é dela** (§9): (a) os botões P1..P4
**recusam** com o alvo em "Todos", como `_enviar_player_leds` já sabe recusar;
(b) "Todos" passa a significar *"cada um com o desenho do próprio número"*, o
que o `player_led_pattern(slot)` já sabe produzir. **"Todas acesas" e "Todas
apagadas" não entram na pergunta** — para-todos é o sentido delas.

**O que A4 entrega antes da resposta:** a mordida vermelha para as duas, e o
texto de tela que **para de esconder o efeito** — hoje nada avisa que o clique
vai para os quatro.

**O teste verde tem de ser RE-APONTADO, nunca apagado.** Ele mede duas coisas:
que o automático **não** é desligado (decisão medida do U9/R-14, fica, com
nota datada explicando o recorte) e que o P3 vai para todos (incidental, sai
com a resposta dela).

**A mordida:** dois controles na mesa, alvo "Todos", clique em "Desenho do
P2" → nenhum dos dois pode ficar com um desenho que não é o dele (resposta b)
ou nenhum recebe byte (resposta a). Arranque o novo comportamento e veja o
teste de hoje passar — o que é a prova de que ele travava o defeito.

**Custo:** ~50 linhas, 2 h 30 depois da resposta dela.
**Carimbo:** **ESTRUTURAL — o olho dela ANTES**, e antes disso a **pergunta**.

---

## 5. O que o Bluetooth bloqueia

**Esta sprint não mede rádio.** Ela declara o que a aba **não pode afirmar na
tela** enquanto a medição não existir. Fonte de cada linha: o
[mapa de canais](../../data/mapa-controles.csv).

**A aba PODE afirmar** que a **cor** chega à barra por rádio:
`luz.lightbar.cor@dualsense` tem `radio_aciona = sim`, grau `O APARELHO
OBEDECEU`, 12/08/2026, validade 180 dias — cor arbitrária, daemon parado, olho
dela.

| a aba **não pode** afirmar | por quê |
|---|---|
| que a barra **está acesa**, em transporte nenhum | `luz.led_jogador.leitura@dualsense`: `aceita = não` nos dois. E o `multi_intensity` leu `[0 255 0]` com a barra apagada e com ela verde (ensaio `lightbar-sysfs-nao-sabe`, 16/08) |
| que o **desenho das 5 luzes** foi aplicado por rádio | `luz.led_jogador.escrita_hefesto@dualsense`: `radio_aciona = **parcial**`, `radio_canal = sysfs`, e a ressalva: *"Sem nó de sysfs gravável, o rádio fica SEM escrita de LED de jogador"*. Na bancada dela a regra udev **está** aplicada (§2.1) — **é vício de bancada por definição** |
| que a **"Luminosidade"** mexe no brilho da barra | `luz.lightbar.brilho@dualsense`: `aciona = não` nos dois. O deslizante escala o RGB — outra grandeza, sem chave (M13) |
| que a cor **sobrevive à Steam** por rádio | ganha quem escreve por último (ESCRITOR-CRU-01) |
| que a **cor de fábrica do plástico** pode ser lida por rádio | [UNIDADE-COR-01](2026-08-15-UNIDADE-COR-01-o-controle-sabe-de-que-cor-ele-e.md): **MEDIDO E RECUSADO** — o firmware responde `HANDSHAKE 0x04` em ~5 ms, nos dois aparelhos, com e sem CRC |

**As quatro perguntas de BT que bloqueiam esta aba.** Nenhuma delas é a
contradição `LIGHTBAR-BT-NEVER-01` × `ROTA-BT-EM-REGIME-01` — ela já está
reconciliada no mapa (§2.3/item 2).

1. **Com outro processo segurando o `hidraw` (Steam ou o jogo), a cor sai pela
   rota avulsa `0x31` por rádio — e ACENDE?** As duas rotas saem; ninguém viu
   o resultado com o nó tomado. **Bloqueia L5 e L6:** enquanto não existir,
   nenhuma frase pode prometer resultado com a Steam aberta — só descrever a
   disputa.
2. **O DESENHO das 5 luzes sai por rádio?** Por rádio sobra o sysfs, e a
   mordida existente prova a rota do **report**, não a do sysfs — a própria
   célula avisa: *"nenhuma delas prova a rota sysfs, que é a única que sobra
   no rádio"*. **Bloqueia L12:** não prometa desenho por rádio.
3. **O detector de escritor estrangeiro funciona por rádio?** Deu **ZERO** com
   a barra apagada (medido, três horas, 16/08), porque a Steam escreve cru por
   hidraw e isso não atualiza a classe LED. O produto passou a detectar pelo fd
   (`core/escritor_cru.py`); **que essa detecção funcione por rádio nunca foi
   medido**. **Bloqueia a metade da disputa em L6.**
4. **Com quatro no rádio, quantas escritas de LED por gesto a fila aguenta?**
   Sem número. Cada escrita disputa a mesma fila dos relatórios de input, e o
   "aplicar ao soltar" existe por causa disso (`:918` em diante). **Bloqueia
   qualquer decisão de L12 que multiplique escritas por quatro.**

---

## 6. As sprints absorvidas

| sprint | o que contribui | morre ao fim desta? |
|---|---|---|
| [LIGHTBAR-JOGADOR-01](2026-07-27-LIGHTBAR-JOGADOR-01-a-cor-e-consequencia-do-jogador.md) | A queixa dela: a aba oferece três superfícies para dizer qual jogador é este controle. L4/L5/L12 tiram parte da ambiguidade | **NÃO.** O redesenho é dela |
| [MESA-CHEIA-03](2026-08-13-MESA-CHEIA-03-a-mesma-marca-na-aba-lightbar.md) | "Quem escolheu isto" nas duas metades, e a descoberta de que as duas não aceitam a mesma marca | **NÃO.** A D-11 é dela |
| [ONDE-A-COR-MORA-01](2026-08-15-ONDE-A-COR-MORA-01-a-borda-diz-quem-e-e-o-anel-diz-o-que-esta-escolhido.md) | As decisões D-16/D-17/D-18 sobre borda e anel | **NÃO.** Proposta para o olho dela |
| [UNIDADE-COR-01](2026-08-15-UNIDADE-COR-01-o-controle-sabe-de-que-cor-ele-e.md) | A restrição do §5: cor de fábrica recusada pelo firmware no rádio | **SIM** como investigação. Vira ressalva de tela |
| [ESCRITOR-CRU-01](2026-08-16-ESCRITOR-CRU-01-a-steam-apaga-a-barra-e-o-produto-nao-reagia.md) | O detector `lightbar_disputada` e o par de eliminação dela | **SIM**, quando L6 lhe der leitor aqui — hoje a cura para no card |
| [BARRA-MUDA-01](2026-08-22-BARRA-MUDA-01-a-lampada-nao-se-le-o-nascimento-sim.md) | O sinal honesto de nascimento. **Tem chamador** (`daemon/connection.py` e a aba Configurações) | **NÃO.** A pendência é o experimento com o olho dela |
| [LUZ-CEGA-01](2026-08-22-LUZ-CEGA-01-a-barra-apagada-e-o-exame-que-nao-olha-o-radio.md) | O rótulo de `lightbar_disputada` que L6 reusa, e o aviso de que mexer nisso encosta na `LIGHTBAR-BT-NEVER-01` | **NÃO.** A parte de política é dela |
| [LED-SEM-DONO-01](2026-08-03-LED-SEM-DONO-01-o-common8-ganha-dono-e-os-textos-param-de-mentir.md) | Já **CONCLUÍDA**. Contribui a regra: LED forçado não serve de evidência | **SIM** — entra aqui só para sair da fila |
| [PLAYER-LED-01](2026-07-25-PLAYER-LED-01-o-numero-do-jogo-chega-ao-controle.md) | A dessincronia entre numeração física, jogo e interface | **PARCIAL.** A metade da tela morre com L4/L5; a do co-op é da onda da Status |
| [SEGUNDO-ESCRITOR-01](2026-08-08-SEGUNDO-ESCRITOR-01-o-driver-do-kernel-tambem-escreve-a-barra.md) | O driver do kernel **também** escreve a barra — o terceiro escritor | **NÃO.** É diagnóstico; `lightbar_source` é a resposta parcial dele |
| [VAO-01](2026-07-27-VAO-01-a-tela-sobra-e-o-conteudo-aperta.md) | A queixa de geometria que L8 fecha nesta aba | **PARCIAL.** Fecha para a Lightbar; as outras abas são das ondas delas |

---

## 7. O aceite

Nada fecha sem os quatro blocos. **Rode `git add -A` antes: os portões são
cegos a arquivo novo.**

```bash
git add -A
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
.venv/bin/python scripts/check_paridade_transporte.py
```

**Bloco 1 — as mordidas.** As seis de L11 reprovam com a cura arrancada, com a
saída literal do pytest no commit. A de L3 reprova nos dois lados (rascunho e
applier). A de L8 reprova sob Xvfb com o `valign` arrancado. A de L10 reprova
nomeando o handler morto.

**Bloco 2 — a foto.** `scripts/gui-captura/retratar_abas.py` roda depois de
L6/L8/L9 e `readme_lightbar.png` é regerado. **Atenção à régua:** o host
(`retratar_abas.py:1444-1450`) fixa `_coop_ligado = True` e
`_edit_target_slot = 1`, então a foto publicada mostra a frase do co-op. Isso
é bancada declarada, não o estado padrão — quem ler a foto para julgar texto
tem de saber disso.

**Bloco 3 — o olho dela.** L4, L5, L6 e L12 são estruturais (D3): foto de
antes e de depois no lote, e a palavra final é dela
([PROVA-DE-TELA-01](2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md)).
L8 é cosmética pré-aprovada e vai no mesmo lote **sem** esperar. L9 depende de
qual metade for entregue.

**Bloco 4 — quatro controles.** A pergunta dela não fecha por leitura. **Na
bancada de 23/08 havia UM DualSense, `connected: false` para o daemon**
(§2.1). Então: ou a mesa cheia acontece e sai `retratar_abas.py --mesa-cheia`,
ou **este bloco fica declarado ABERTO** com o motivo — nunca fechado por
analogia. A foto de mesa cheia mais recente é de 14/08 e mostra coisas que o
produto já não faz.

---

## 8. O que fica aberto, e de quem é

**Dela — e duas destas são perguntas que travam tarefa:**

- **O "Todos" e o desenho de cada um** (L12): recusar, ou dar a cada um o
  desenho do próprio número? **A4 não escreve sem esta resposta.**
- **Quantos botões de desenho aparecem** (L9): sempre oito, ou só até o maior
  slot vivo na mesa? O código já sabe 1..8.
- **O redesenho da aba.** A LIGHTBAR-JOGADOR-01 é queixa direta de 27/07, sem
  uma linha desde então: *"eu preferia o modo anterior que era pra escolher o
  player daquele controle (…) área de desenho das 5 luzes é meio nonsense"*.
  Nada nesta onda a responde — esta onda arruma o que a aba **diz**, não o que
  ela **é**.
- **A borda e o anel** (ONDE-A-COR-MORA-01) e **a marca de quem escolheu**
  (MESA-CHEIA-03).
- **A prévia como duas tiras.** A lightbar são duas tiras nas bordas do
  touchpad, medido por foto dela em 11/08; a prévia é um retângulo. O desenho
  certo já existe em `assets/control-svg/dualsense.svg`. Custo baixo.
- **O experimento da BARRA-MUDA-01**, que só o olho dela fecha.

**Da trilha de Bluetooth (dela com o assistente, na mesa do specs):** as
quatro perguntas do §5, e mais uma que o mapa marca sem causa isolada — **o
que faz uma conexão de rádio nascer com a barra travada**. Há alerta dela de
12/08 de que *"reconectar cura"* é falso positivo recorrente nesta casa; ver
[A-LIGHTBAR-TRAVADA](../estudos/2026-08-15-A-LIGHTBAR-TRAVADA-o-que-ja-caiu-e-o-que-nunca-foi-tentado.md).

**Das outras ondas:**

- **Z1** (a ponte que sabe dizer não): esta aba já tem parte da cura
  (`apply_draft_detalhado` + `mensagem_de_secao_fora`, `lightbar_actions.py:112`),
  e ela é **o precedente** que as outras abas devem copiar, não o contrário.
- **Z6**: sem o portão que olha a TELA, a mordida de léxico do L5 vale para o
  `interface.md` e não para o `main.glade`, e a chave que falta para a
  "Luminosidade" (M13) entraria no CSV sem defesa. Por isso M13 **não** virou
  tarefa aqui: é da [PAREAMENTO-01](2026-08-24-PAREAMENTO-01-a-medicao-nova-tem-de-chegar-sozinha-na-tela.md).

**Do dono do [SPRINT_ORDER](../SPRINT_ORDER.md):** as duas linhas que ainda
dizem que `LIGHTBAR-BT-NEVER-01` e `ROTA-BT-EM-REGIME-01` se contradizem, e a
linha que diz que esta onda depende de uma auditoria que não existe. As três
caducaram hoje (§2.3). Esta sprint não as edita — declara.

**Aberto e sem dono, declarado:** o M2 com o daemon na ponta. A cadeia está
provada no interpretador; ninguém viu o controle continuar com a cor antiga
depois de um Aplicar real. Quem tiver dois controles na mesa fecha isso em
dez minutos, e é a prova mais barata desta sprint inteira.
