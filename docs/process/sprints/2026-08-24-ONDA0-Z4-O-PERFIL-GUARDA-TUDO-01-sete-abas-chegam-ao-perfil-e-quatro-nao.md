# ONDA 0 · Z4 — o perfil guarda tudo: sete abas chegam ao perfil e quatro não

**24/08/2026. GRAU: MEDIDO**, exceto onde a linha diz DESENHO ou NÃO VERIFICADO.
Frente **Z4** da Onda 0 — as invariantes que valem para as onze abas
([SPRINT_ORDER §0.2](../SPRINT_ORDER.md)). **Depende de Z2 e Z5.**

**Qual defeito de forma esta frente cura:** **F12 — "o perfil não guarda tudo,
e cada aba tem seu buraco"**, com uma fatia de **F2** (a cura escrita e nunca
ligada) e uma de **F15** (verde que não protege: *nenhum teste abre um perfil
real pela porta da janela*). O diagnóstico está em
[2026-08-23-ONDE-PARAMOS](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md),
§1 F12 e F15.

**O que esta sprint fecha**

1. **Dois dos doze presets de FÁBRICA não abrem no editor** — não são "dois
   perfis dela": são `assets/profiles_default/aventura.json` e
   `corrida.json`, que toda instalação recebe. E a suíte está verde.
2. O `sackboy.json` — o jogo de quatro pessoas desta casa — não tem `mode`, nem
   `controllers`, nem `ponte`. **22 dos 34 perfis dela não têm `mode`; ZERO têm
   `controllers`.**
3. O último ajuste por controle de QUALQUER aba **não chega ao daemon**: a janela
   emite `controllers: None` e o applier pula seção `None`.
4. A decisão dela de 18/08 (mic, som, touch, giro, acelerômetro no perfil) foi
   executada **pela metade**: mic e som entraram; touch, giro e acelerômetro
   ainda não.

   > **FATO ERRADO, SUBSTITUÍDO em 29/08/2026.** Este item dizia que *"touch,
   > giro e acelerômetro dependem da máscara, que só existe no perfil dentro de
   > `mode`"*. **Não dependem** — não para chegar à INTERFACE. O giroscópio já
   > chega hoje, sem máscara nenhuma: `daemon/sensor_hub.py`, `leitura`, monta a
   > chave `gyro` a partir do nó evdev `Motion Sensors`, e o acelerômetro sai do
   > **mesmo nó** (`ABS_X/Y/Z`, `resolution = 8192`, medido ao vivo em
   > 29/08/2026: |v| = 0,9936 g e 0,9972 g nos dois controles dela).
   >
   > A dependência da máscara é real, mas do caminho para o **JOGO** — o vpad e
   > o que ele expõe —, não do caminho para a tela e o perfil. Confundir os dois
   > fez este item orçar como "preso atrás do `mode`" o que está a uma chave de
   > distância, e foi um dos argumentos que tiraram o acelerômetro do desenho
   > antes de ela o devolver (*"não era pra ele sair. era pra ele funcionar"*,
   > 29/08).
5. O portão que existe hoje mede **campo do esquema → escritor**. Falta a direção
   inversa — **widget de escolha → depósito** — e é nela que moram os quatro
   buracos por aba.

**O que esta sprint NÃO faz**

- **Não mede Bluetooth.** É trilha dela (D2). O que o perfil não pode afirmar até
  lá está na seção 7.
- **Não mexe na aba Perfis.** O editor, o perfil removido que ressuscita e a
  caixinha do Steam Input são da
  [PERFIS-ABRE-O-QUE-GUARDA-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md)
  (Onda 6). Z4 é a INVARIANTE: o que o perfil guarda e o que sobrevive ao ciclo
  fechar/reabrir. A aba é dela.
- **Não desenha widget novo em aba nenhuma.** Onde falta gesto (touch, giro,
  teclado emulado), esta frente entrega o **campo de perfil e o portão**; o
  widget é da onda da aba.
- **Não redistribui o alvo de edição.** `_edit_target_uniq` é da **Z2**; Z4
  consome o alvo, não o move.
- **Não toca a régua da mesa.** Quem está conectado é da **Z5**.

---

## 1. O defeito, em uma frase

**Ela ajusta o controle em sete abas, clica em Salvar, fecha o programa, reabre —
e o que volta depende de qual aba ela usou; em duas das doze receitas de fábrica,
o perfil nem abre.**

---

## 2. O que está MEDIDO

Régua de árvore: `dev`, commit `c111d74`. Perfis dela: 34 no disco, medidos na
casa dela. Todos os comandos abaixo foram rodados por mim em 24/08 e a saída está
colada.

### 2.1 Dois presets de FÁBRICA não abrem no editor, e a suíte está verde

```bash
.venv/bin/python -c "
import json, glob, os
from hefesto_dualsense4unix.profiles.schema import Profile
from hefesto_dualsense4unix.app.draft_config import DraftConfig
mau=[]
for f in sorted(glob.glob('assets/profiles_default/*.json')):
    n=os.path.basename(f); p=Profile.model_validate(json.load(open(f)))
    try: DraftConfig.from_profile(p)
    except Exception: mau.append(n)
print(mau, 'de', len(glob.glob('assets/profiles_default/*.json')))"
```

```
['aventura.json', 'corrida.json'] de 12
```

A mesma régua contra os **34 perfis dela**: os mesmos dois, e só eles.

```
validam como Profile mas NÃO abrem no editor: ['aventura.json', 'corrida.json']
nem validam como Profile: []            abrem: 32
```

**A causa é uma incompatibilidade de tipo entre o disco e o rascunho, e ela está
escrita ao contrário no código:**

| onde | o que declara |
|---|---|
| `src/hefesto_dualsense4unix/profiles/schema.py:202` | `params: list[int] \| list[list[int]]` — o disco aceita **aninhado** |
| `src/hefesto_dualsense4unix/app/draft_config.py:47` | `params: tuple[int, ...] = ()` — o rascunho aceita **só plano** |
| `src/hefesto_dualsense4unix/app/draft_config.py:316-318` | *"TriggerConfig.params é Union[list[int], list[list[int]]]; **TriggerDraft aceita ambos via tuple**, mas mypy precisa cast."* |

A terceira linha é **fato errado**: `TriggerDraft` não aceita aninhado, e o
`cast("list[int]", ...)` de `:323` e `:327` cala o mypy sem converter nada. A
mensagem que sai é literal:

```
aventura REPROVA: ValidationError  10 validation errors for TriggerDraft
  params.0  Input should be a valid integer [input_value=[1], input_type=list]
```

**Por que a suíte não pega, medido:**

```bash
comm -12 <(grep -rl 'from_profile' tests/ | sort) \
         <(grep -rl 'MultiPositionFeedback\|MultiPositionVibration' tests/ | sort)
# tests/unit/test_gui_review_fixes.py   (o único cruzamento, de 37 x 9 arquivos)
```

E esse único arquivo tem a classe `TestDraftMultiPosRoundTrip`
(`tests/unit/test_gui_review_fixes.py:75`), cuja docstring diz *"Salvar
(to_profile) e recarregar (from_profile) preserva os params"* — e que **parte do
rascunho, com params PLANOS** (`:79`). O formato aninhado é exercido só contra
`build_from_name` (`:52`), que nunca passa pelo rascunho. **É o F15 na forma
exata: a função pura tem teste, o fio que a chama não tem.**

### 2.2 O `sackboy.json` dela, campo a campo

```bash
python3 -c "
import json,glob,os
for f in sorted(glob.glob('$HOME/.config/hefesto-dualsense4unix/profiles/*.json')):
    d=json.load(open(f))
    print('%-38s'%os.path.basename(f),
          [k for k in ('mode','controllers','ponte','mic','speaker','key_bindings','mouse') if k in d])"
```

`sackboy.json` traz `['mic', 'speaker']`. **Não traz `mode`, `controllers` nem
`ponte`.** O censo das 34, pela mesma régua:

```
Counter({'name': 34, 'version': 34, 'match': 34, 'priority': 34,
         'triggers': 34, 'leds': 34, 'rumble': 34,
         'suppress_desktop_emulation': 31, 'mode': 12, 'speaker': 9,
         'key_bindings': 4, 'mic': 3, 'ponte': 2, 'mouse': 1})
```

| campo | perfis que o têm | o que a ausência significa na prática |
|---|---|---|
| `controllers` | **0 de 34** | nenhum perfil dela guarda um único ajuste POR CONTROLE — a mesa de quatro nunca virou receita |
| `ponte` | 2 de 34 (`big_walk`, `duskfade`) | em 32 jogos, a escada de ponte recomeça do primeiro degrau a cada lançamento |
| `mode` | 12 de 34 | ativar o perfil **não pede modo gamepad nem co-op**; é a D-A, e o `sackboy.json` é o caso que ela nomeou |
| `mic` | 3 de 34 | — |
| `mouse` | 1 de 34 | — |

**A consequência que fecha o diagnóstico do co-op:** `coop` mora dentro de
`ProfileModeConfig` (`src/hefesto_dualsense4unix/profiles/schema.py:601`). Perfil
sem `mode` é perfil sem opinião sobre co-op. **O jogo de quatro pessoas desta
casa é um dos 22.**

### 2.3 O último ajuste por controle não chega ao daemon

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.app.draft_config import DraftConfig, LedsDraft
d = DraftConfig.default().with_controller_leds('02:fe:00:11:22:33', LedsDraft(lightbar_rgb=(10,20,30)))
print('com override:', list((d.to_ipc_dict().get('controllers') or {}).keys()))
d = d.with_controller_fields_cleared('02:fe:00:11:22:33', 'leds', {'lightbar','lightbar_brightness'})
print('source_controllers:', d.source_controllers)
print('controllers no IPC:', d.to_ipc_dict().get('controllers'))
print('a chave viaja?', 'controllers' in d.to_ipc_dict())"
```

```
com override: ['02:fe:00:11:22:33']
source_controllers: None
controllers no IPC: None
a chave viaja? True
```

Os dois lados, com âncora:

- **a janela** — `_controllers_to_ipc`
  (`src/hefesto_dualsense4unix/app/draft_config.py:1295`), linha **1313**:
  `if not isinstance(mapa, dict) or not mapa: return None`. Mapa vazio e mapa
  inexistente produzem **o mesmo** `None`;
- **o daemon** — `_apply_section`
  (`src/hefesto_dualsense4unix/daemon/ipc_draft_applier.py:114`), linha **121**:
  `if raw is None: return`.

**`None` carrega duas coisas diferentes**: *"não tenho opinião sobre overrides"* e
*"apague os overrides que existiam"*. A segunda cai silenciosamente na primeira —
é **literalmente o defeito que o `app/alvo_de_edicao.py` curou em 23/08**, no
outro campo, e a regra da casa é a mesma: *ausência de informação se declara,
nunca vira ação padrão silenciosa*.

E há um segundo efeito, no mesmo arquivo: `apply`
(`ipc_draft_applier.py:56`) monta as categorias de trava manual a partir de
`params.get(secao) is not None` (`:67-78`). Com `controllers: None`, a limpeza
**também não arma a trava** de led/trigger/rumble — o `AutoSwitcher` pode
reescrever por cima no tique seguinte. O mesmo `None` custa duas vezes.

O padrão se repete em `with_override_fields_cleared`
(`draft_config.py:1231`, a mesma linha textual). São **dois** pontos, não um.

### 2.4 Sete abas chegam ao perfil e quatro não

Régua declarada, e ela conta **escritor de rascunho no mixin da aba** — não
menção, não leitura:

```bash
for f in home status triggers lightbar rumble profiles daemon emulation mouse input footer; do
  echo "$(grep -c 'self\.draft *=\|janela\.draft *=' \
       src/hefesto_dualsense4unix/app/actions/${f}_actions.py)  ${f}_actions"; done
grep -rc 'self\.draft *=' src/hefesto_dualsense4unix/app/actions/config/*.py
```

| aba (posição na tira) | arquivo | escritores | chega ao perfil? |
|---|---|---|---|
| 1 · Início | `home_actions.py` | 1 | **sim** (`mode`) |
| 2 · Status | `status_actions.py` | **0** | **não** — ver abaixo |
| 3 · No jogo | dentro de `status_actions.py:548-869` | **0** | **não** |
| 4 · Gatilhos | `triggers_actions.py` | 2 | **sim** (`triggers`) |
| 5 · Lightbar | `lightbar_actions.py` | 6 | **sim** (`leds`, `controllers`) |
| 6 · Rumble | `rumble_actions.py` | 4 | **sim** (`rumble`) |
| 7 · Perfis | `profiles_actions.py` | 1 | **sim** (identidade) |
| 8 · Sistema | `daemon_actions.py` | **0** | **não** |
| 9 · Emulação | `emulation_actions.py` | 1 | **sim** (`suppress_desktop_emulation`) |
| 10 · Navegação | `mouse_actions.py` 4 + `input_actions.py` 2 | 6 | **sim** (`mouse`, `key_bindings`) |
| 11 · Configurações | `app/actions/config/*.py` | **0** | **não** — e é POR DECISÃO |

**Sete sim, quatro não.** Mas as quatro não são iguais, e tratá-las como iguais
seria o erro desta frente:

- **Configurações não é buraco.** Ela declara no `maquina.json` de propósito
  (D-A4, e a
  [CONFIGURACOES-FECHA-01](2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md)
  é dona disso). O que Z4 precisa dela é **a declaração escrita**, para o portão
  da T11 não a acusar.
- **Sistema é a D-A ao contrário:** os sete gestos são da MÁQUINA, não do
  controle. A recomendação da D-A é que virem *receita do jogo*, não perfil.
  Z4 entrega o **depósito declarado**, não o campo.
- **Status e No jogo são o buraco de verdade.** O mixin tem zero escritores; mic
  e som chegam ao perfil por um caminho lateral, o widget compartilhado
  `src/hefesto_dualsense4unix/app/widgets/controller_card.py:3976` e `:4026`
  (`registrar_alto_falante_no_rascunho` / `registrar_microfone_no_rascunho`).
  **Touch, giroscópio e acelerômetro não chegam por caminho nenhum** — no card
  eles são VISTA, não escolha (`TouchpadView`, `controller_card.py:127`).

### 2.5 O portão que existe mede a direção certa e falta a inversa

Isto é **crédito, não crítica**, e apagá-lo faria a próxima leva reinventá-lo:

- `tests/unit/test_perfil_salva_tudo_ida_e_volta.py:99` — `SECOES_COBERTAS`,
  dicionário LITERAL, 13 entradas, cada uma nomeando a aba e o escritor;
- `tests/unit/test_perfil_salva_tudo_cobertura_das_secoes.py:60` — `ISENTOS`
  (`version`, `ponte`, com a razão escrita), e o portão que lê o irmão **por
  AST** para não pular onde não há GTK.

Rodada agora: `Profile.model_fields` tem 15 campos; 13 cobertos, 2 isentos,
**zero descobertos**. O portão está fechado na direção *campo → escritor*.

**A direção que falta é a inversa.** Ninguém pergunta *"este widget de escolha
tem depósito?"*. Ordem de grandeza do território:

```bash
grep -c 'GtkSwitch\|GtkComboBoxText\|GtkCheckButton\|GtkScale\|GtkSpinButton\|GtkToggleButton' \
     src/hefesto_dualsense4unix/gui/main.glade                          # 23
grep -rn 'Gtk.Switch()\|Gtk.ComboBoxText()\|Gtk.CheckButton\|Gtk.Scale\|Gtk.SpinButton\|Gtk.ToggleButton' \
     src/hefesto_dualsense4unix/app/ | wc -l                            # 35
```

**58 widgets de escolha, e nenhuma régua pergunta onde cada um pousa.** O
`keyboard_emulation.flag` é o exemplo caro: a escolha do teclado emulado mora em
arquivo global (`src/hefesto_dualsense4unix/utils/session.py:372`) enquanto o
mouse ao lado é por jogo (`Profile.mouse`, `schema.py:963`) — dois destinos para
dois interruptores vizinhos na mesma aba.

### 2.6 O que já está CERTO, e que não se deve refazer

- **a ida e volta pura não perde nada.** Rodei `from_profile` → `to_profile` nos
  32 perfis que abrem e comparei `model_dump` campo a campo: **zero
  divergências**. O defeito **não** está na função pura — está na porta da
  janela. Quem for consertar não deve procurar em `to_profile`;
- **o crachá é o mesmo nos dois transportes** — `identidade.cracha_nos_dois_transportes`
  no [mapa de canais](../../data/mapa-controles.csv): `cabo=sim`, `rádio=sim`,
  `medido`, ressalva *"n = 4, e é AMOSTRA"*. **A chave de `controllers` (o MAC)
  sobrevive à troca de cabo para rádio**, o que retira uma pergunta de BT desta
  frente;
- **`mic.volume` e `mic.muted` não custam a mesma coisa**, e a exceção está
  nomeada em `schema.py:426-436` (MIC-GRAVACAO-01): `volume` aplica em toda
  ativação, `muted` só em troca explícita. **Não unifique os dois** — há decisão
  medida proibindo o perfil de apagar o LED vermelho como colateral;
- **registrar não é aplicar** (HARM-05), e o portão estrutural disso existe em
  `tests/unit/test_perfil_salva_tudo_registrar_nao_e_aplicar.py`. Toda tarefa
  desta frente que escreva no rascunho tem de continuar passando nele.

### 2.7 Três locks órfãos no diretório de perfis dela

```bash
cd ~/.config/hefesto-dualsense4unix/profiles/ && \
  for l in *.lock; do [ -f "${l%.lock}" ] || echo "ORFAO: $l"; done
# ORFAO: meu_perfil.json.lock
# ORFAO: sackboy_nativo.json.lock
# ORFAO: vitoria.json.lock
```

34 `.json` e **37 `.lock`**. Nenhum dos três tem perfil. `meu_perfil` é o nome que
o rodapé usa como base (`footer_actions.py:61`), e `load_profile(_MEU_PERFIL_NOME)`
(`:1343`) hoje cai no `except` e usa o perfil recém-gravado — **o caminho de
resgate funciona**, mas o lock que sobrou é rastro de perfil apagado, e o
diretório é o que a aba Perfis lista.

---

## 3. O que é HIPÓTESE

- **DESENHO:** que a cura da 2.1 seja alargar `TriggerDraft.params` para
  `tuple[int, ...] | tuple[tuple[int, ...], ...]`. É a hipótese de trabalho da
  T4, mas a alternativa — **normalizar para plano na fronteira**, já que
  `build_from_name` aceita as duas formas (`test_gui_review_fixes.py:52`) — pode
  ser mais barata e deixa **um** formato vivo no rascunho. A T4 mede as duas
  antes de escolher.
- **NÃO VERIFICADO:** quantos dos 58 widgets de escolha têm depósito. Eu contei o
  território, não o consumo. **O número entra na T10 como pergunta, nunca como
  fato** — esta casa já provou três portões verdes cegos em 23/08.
- **NÃO VERIFICADO:** o que a JANELA perde no ciclo salvar → fechar → reabrir. A
  ida e volta pura é limpa (2.6); o ciclo pela porta da janela **nunca foi
  medido por ninguém**, e é exatamente o que a T2 constrói. Toda afirmação sobre
  "a aba X perde o campo Y" nesta sprint é **derivada da ausência de escritor**
  (2.4), não de um ciclo observado.
- **NÃO VERIFICADO:** se `aventura` e `corrida` chegam a ser LISTADOS na aba
  Perfis, ou se a aba inteira falha ao montar quando um deles é o ativo. Medi a
  conversão, não a montagem. É a primeira coisa que a T2 responde.
- **NÃO RODEI A SUÍTE.** Há outros agentes editando `src/` neste instante, e
  *medir árvore em movimento não mede nada* ([COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md),
  R2). A linha de base da seção 8 é um comando **para o executor rodar com a leva
  parada**, não um número que eu esteja publicando.

---

## 4. POR QUE ESTA FRENTE VEM ANTES DAS ABAS

A pergunta que Z4 responde é *"onde este gesto pousa?"*. Cada aba tem gesto; se
cada onda responder sozinha, saem onze respostas.

| aba | o que MUDA nela por causa da Z4 |
|---|---|
| **Início** | o `mode` que ela grava é a única porta de `coop` e da máscara. Sem a T13, a aba não sabe dizer o que acontece ao ativar um perfil dos 22 sem `mode` |
| **Status** e **No jogo** | descobrem que touch, giro e acelerômetro **não são escolha** hoje — são vista. A onda das duas passa de "guardar o interruptor" para "decidir se o interruptor existe" (T12) |
| **Gatilhos** | **dura**: o conversor é daqui (T4). Enquanto ele reprovar, dois dos dezenove modos não podem ser oferecidos com honestidade, porque um perfil salvo com eles não reabre |
| **Lightbar** | é a única aba que escreve `controllers` hoje. A T7/T8 decidem o que acontece quando ela **apaga** o último override — hoje, nada |
| **Rumble** | o override por peça (`ControllerRumbleOverride`, `schema.py:762`) mora no mesmo mapa, e cai no mesmo `None` |
| **Emulação** | o `suppress_desktop_emulation` chega; o liga/desliga do teclado ao lado, não (T14). Duas escolhas vizinhas com dois destinos |
| **Navegação** | idem, do outro lado do mesmo par: `mouse` é por jogo, teclado é global |
| **Sistema** | ganha o **depósito declarado** dos sete gestos e para de ser acusada de buraco (T12) |
| **Perfis** | é a consumidora direta: o editor abre o que Z4 garante que abre. **A PERFIS-ABRE-O-QUE-GUARDA-01 declara Z4 como dependência DURA** |
| **Configurações** | só precisa da isenção escrita (T11) |

**E o motivo de ordem, curto:** arrumar o layout de uma aba antes de saber se o
gesto dela tem onde pousar é retrabalho garantido — é a D1 dela, aplicada.

---

## 5. A COREOGRAFIA DOS AGENTES

**Cinco agentes**, como a tabela §0.2 fixa. Leia
[COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md) antes de despachar o primeiro:
posse de arquivo (R1), suíte só do próprio escopo (R2), bancada dela durante a
medição (R3), foto e portão no fim (R4).

```
   dia 1                        dia 1-2                        fecho
   ┌────────────────┐
   │ A1  a porta da │───── o corpo de prova + o ciclo ──┬──> aceite
   │     janela     │                                   │
   └────────────────┘                                   │
   ┌────────────────┐                                   │
   │ A2  o conversor│──── contrato `controllers: {}` ──> A3 ──┤
   └────────────────┘         (série curta, T7 antes de T8)   │
   ┌────────────────┐                                   │
   │ A4  a matriz   │───────────────────────────────────┤
   └────────────────┘                                   │
   ┌────────────────┐                                   │
   │ A5  o modo que │───────────────────────────────────┘
   │     falta      │
   └────────────────┘
```

| agente | tarefas | POSSE DE ARQUIVO (exclusiva) | o que devolve |
|---|---|---|---|
| **A1 — a porta da janela** | T1, T2, T3 | `tests/fixtures/perfis_do_ciclo/**` (novo), `tests/unit/test_z4_o_ciclo_da_janela.py` (novo) <!-- ref-externa: nasce nesta sprint -->. **Nada em `src/`** | a matriz *aba × campo × sobreviveu ao ciclo*, com o ciclo REAL rodado; e a lista do que relatou sem editar |
| **A2 — o conversor** | T4, T5, T6 | `src/hefesto_dualsense4unix/app/draft_config.py`, `tests/unit/test_z4_conversor_de_gatilho.py` (novo) <!-- ref-externa: nasce nesta sprint --> | as duas medições da T4 com o custo de cada uma, a escolha feita, e o comentário falso substituído |
| **A3 — o `controllers` que não sabe apagar** | T7, T8, T9 | `src/hefesto_dualsense4unix/daemon/ipc_draft_applier.py`, `tests/unit/test_z4_apagar_override.py` (novo) <!-- ref-externa: nasce nesta sprint -->. **Toca `draft_config.py` SÓ na T8, e SÓ depois de A2 liberar** | o contrato `{}` = apagar, escrito, com a mordida dos dois lados |
| **A4 — a matriz** | T10, T11, T12 | `tests/unit/test_z4_matriz_widget_deposito.py` (novo) <!-- ref-externa: nasce nesta sprint -->, `docs/process/agentes/` (a saída pelo sanitizador) | o censo dos 58 widgets com o depósito de cada um, e o portão nascendo reprovando |
| **A5 — o modo que falta** | T13, T14, T15 | `src/hefesto_dualsense4unix/profiles/schema.py`, `src/hefesto_dualsense4unix/profiles/loader.py`, `tests/unit/test_z4_perfil_sem_modo.py` (novo) <!-- ref-externa: nasce nesta sprint --> | o que significa perfil sem `mode`, a proposta de campo do teclado, e a higiene do diretório |

**As regras desta coreografia, e cada uma tem cicatriz:**

1. **A2 antes de A3 na fronteira do `controllers`.** A3 faz o daemon ACEITAR `{}`
   primeiro (aditivo, daemon novo com janela velha continua funcionando); só
   então A2 emite `{}`. Inverter isso deixa uma janela nova falando com o daemon
   vivo dela, que é **mais velho que o código**
   (cura de daemon só vale no próximo start, e o sintoma é a AUSÊNCIA de dado).
2. **Ninguém edita `app/actions/*.py`.** Os mixins de aba são das ondas de aba, e
   elas estão vivas agora. Quando o conserto pedir um mixin, **relate, não
   edite** (R1). Daí nascem as continuações.
3. **Ninguém roda `scripts/gui-captura/retratar_abas.py`.** Ele reescreve as onze
   fotos de uma vez (R4). Quem precisar de foto no meio do trabalho passa um
   diretório como argumento.
4. **A1 não usa os perfis VIVOS dela como fixture.** Copia, anonimiza e versiona
   (T1). Rodar teste contra `~/.config` escreve no diretório dela.
5. **A4 não conserta nada.** Ela mede e constrói o portão. Todo conserto que ela
   achar vira linha de relato para a onda da aba dona.
6. **Nenhum agente para o daemon.** Se a bancada estiver sendo usada para a
   medição de rádio dela, **espere e diga que está esperando** (R3). Se parar,
   religue.

---

## 6. As tarefas

Carimbo de classe de tela (D3): **[COSMÉTICA]** = pré-aprovada, foto depois em
lote · **[ESTRUTURAL]** = precisa do olho dela ANTES · **[SEM TELA]** = não toca
a interface.

Grande parte desta frente é **[SEM TELA]** de propósito: Z4 é invariante de
persistência. Onde ela toca a tela, é porque a tela afirma algo sobre o que foi
guardado.

### A1 — a porta da janela

#### T1 — o corpo de prova: os 34 perfis dela viram fixture versionado · [SEM TELA]

Copiar os 34 `.json` de `~/.config/hefesto-dualsense4unix/profiles/` para
`tests/fixtures/perfis_do_ciclo/`, **mais os 12 de `assets/profiles_default/`**.
Anonimizar antes de versionar:

- **nenhum MAC real.** Medi hoje: `grep -lE '([0-9a-f]{2}:){5}[0-9a-f]{2}'` sobre
  os 34 devolve **vazio** — nenhum perfil dela tem MAC, porque **zero têm
  `controllers`**. Mas o corpo de prova PRECISA de perfis com `controllers`
  (é metade do que a T3 mede), e esses você vai **fabricar**: use a faixa da casa
  (`02:fe:00:…`, `aa:bb:cc:…`, `e8:47:3a:…`) e **não use sequência simples** —
  uma já bateu por acaso com um literal de segredo;
- nomes de jogo podem ficar: são títulos publicados, não dado dela. Nome de
  pessoa em nome de arquivo, não (há um `.lock` assim — ver T15).

Rode `bash scripts/check_anonymity.sh` **depois do `git add`** — os portões são
cegos a arquivo novo.

**A mordida:** plante um MAC fora da máscara da casa num dos fixtures e veja
`check_anonymity.sh` reprovar. Se ele passar, o portão não olha para
`tests/fixtures/` e **isso é o achado**, não o fixture.

**Custo:** 0 linhas de produto, ~46 arquivos de fixture, 2 h.

#### T2 — o ciclo de verdade: abrir pela JANELA, salvar, FECHAR o processo, reabrir · [SEM TELA]

**Esta é a tarefa central de toda a frente.** Não é teste de função pura — é a
porta da janela, e é por não existir que dois presets de fábrica estão quebrados
com a suíte verde (2.1).

O ciclo, por perfil do corpo de prova:

1. subir a janela real com `HOME` apontado para um diretório temporário que
   contenha os fixtures (`Gtk.OffscreenWindow` — **sob Xvfb não há gerenciador de
   janelas e uma `Gtk.Window` fica 1x1 para sempre**, armadilha 2 do
   [COMO-OLHAR-A-TELA](../COMO-OLHAR-A-TELA.md));
2. ativar o perfil pela porta da aba Perfis, não por `load_profile`;
3. tocar, aba por aba, o gesto que cada uma expõe (a lista de gestos já existe:
   `_GESTOS` em `tests/unit/test_perfil_salva_tudo_ida_e_volta.py` — **reuse, não
   reescreva**);
4. Salvar pelo funil do rodapé;
5. **matar o processo** — não recarregar o objeto: `subprocess`, saída limpa,
   processo novo;
6. reabrir e comparar campo a campo com o esperado.

O passo 5 é o que separa esta tarefa de tudo que já existe. Recarregar no mesmo
processo não vê estado que sobreviveu em memória.

**Referência de veículo:** `scripts/gui-captura/retratar_abas.py:2132` e `:2187`
já montam a janela real com `Gtk.OffscreenWindow` e dublês; e há precedente de
teste pela porta da janela em `tests/unit/test_o_campo_do_jogo_na_janela_de_verdade.py`.
**Não invente um terceiro caminho.**

**A mordida:** rode o ciclo contra `aventura.json` **antes** de a T4 existir. Ele
tem de FALHAR, e a falha tem de nomear o perfil e o campo. Um ciclo que passe
hoje está medindo outra coisa — é o teste da A2 do
[COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md): *régua que só sabe passar não é
régua*.

**Custo:** ~250 linhas de teste, 0 de produto, 6 h.

#### T3 — a matriz aba × campo × sobreviveu · [SEM TELA]

O resultado da T2 vira tabela, com uma linha por par (aba, campo) e três colunas:
*o gesto existe?* · *chega ao rascunho?* · *sobrevive ao ciclo?*. Três colunas, não
duas — **um campo que chega ao rascunho e some no reabrir não é o mesmo defeito
de um campo que não tem gesto**, e o conserto é em lugares diferentes.

Toda linha "não" ganha o dono: Z4 (invariante), a onda da aba (widget), ou D-A
(palavra dela).

**A mordida:** a matriz é derivada em RUNTIME de `Profile.model_fields` e do
resultado do ciclo — **nunca uma lista escrita à mão**, que envelhece junto com o
defeito que deveria pegar. É a mesma doutrina de
`test_perfil_salva_tudo_cobertura_das_secoes.py`. Acrescente um campo inventado
ao esquema num teste e veja a matriz crescer sozinha.

**Custo:** ~60 linhas de teste, 2 h.

### A2 — o conversor

#### T4 — `aventura` e `corrida` abrem no editor · [SEM TELA]

`_triggers_config_to_draft` (`src/hefesto_dualsense4unix/app/draft_config.py:314`).
**Meça as duas saídas antes de escolher** (seção 3):

- **(a) alargar o rascunho** para aceitar aninhado. Custo: o tipo, e todo leitor
  de `params` no caminho da GUI e do IPC passa a lidar com duas formas;
- **(b) normalizar na fronteira** para plano, já que `build_from_name` aceita as
  duas (`tests/unit/test_gui_review_fixes.py:52`). Custo: o `to_profile` tem de
  devolver a forma que o disco tinha, ou o arquivo dela muda de forma sozinho ao
  salvar — **e isso é perda de dado disfarçada de conserto**.

Devolva o custo dos dois lados com o comando ao lado. **A escolha é técnica e é
sua**; o que não pode é a forma do arquivo dela mudar sem ninguém pedir.

**A mordida:** o ciclo da T2 contra `aventura.json` e `corrida.json`. E a segunda
metade, que é a que morde de verdade: **salve sem tocar em nada e compare o
arquivo byte a byte com o original.** Se a forma dos `params` mudou, a cura (b)
está trocando um defeito por outro.

**Custo:** 10 a 60 linhas de produto conforme a escolha, ~80 de teste, 4 h.

#### T5 — o comentário que afirma o contrário sai · [SEM TELA]

`draft_config.py:316-318` diz *"TriggerDraft aceita ambos via tuple"*. É falso, e
foi medido falso hoje (2.1). Pela regra da casa, **fato errado se SUBSTITUI, e
sai de todos os lugares onde aparece** — não ganha nota datada, porque não é
decisão medida: é uma afirmação que a medição derrubou.

Régua: `grep -rn "aceita ambos\|via tuple" src/ tests/ docs/`. **Rode-a antes de
acreditar nela**, contra `draft_config.py`, que você sabe que contém a ocorrência.

E confira os dois `cast("list[int]", ...)` de `:323` e `:327`: um cast que mente
para o mypy é a razão de o portão de tipos não ter pegado isto. Se a escolha da
T4 tornar o cast desnecessário, ele **sai**.

**A mordida:** `.venv/bin/mypy src/hefesto_dualsense4unix` continua verde **sem**
os casts. Se precisar do cast de volta, o tipo ainda está errado.

**Custo:** ~5 linhas, 40 min.

#### T6 — os dezenove modos entram e voltam pelo ciclo · [SEM TELA]

Hoje o cruzamento entre "teste que usa modo aninhado" e "teste que chama
`from_profile`" é **um arquivo só**, e ele testa a forma plana (2.1). O conserto
é derivar a lista dos modos de `app/actions/trigger_specs.py` em runtime e passar
**cada um** pelo ciclo da T2.

**Cuidado com o dublê:** `build_from_name` precisa **saber recusar**. Um modo com
params inválidos tem de reprovar com `ValueError` claro — o arquivo já faz isso
em `test_gui_review_fixes.py:44`. Exercite as duas respostas (A2).

**A mordida:** arranque a normalização/alargamento da T4 e veja **dois** modos
reprovarem, nomeados. Se reprovarem dezenove, o teste está medindo o conversor
inteiro e não o buraco.

**Custo:** ~70 linhas de teste, 2 h.

### A3 — o `controllers` que não sabe apagar

#### T7 — o daemon aprende que `{}` significa "apague os overrides" · [SEM TELA]

`_apply_section` (`daemon/ipc_draft_applier.py:114`, linha 121) e `apply`
(`:56`, o mapa de categorias em `:67-78`). O contrato novo, aditivo:

| valor de `controllers` | significado |
|---|---|
| chave ausente ou `None` | **sem opinião** — não mexe (comportamento de hoje, preservado) |
| `{}` (objeto vazio) | **apague os overrides por controle** e arme a trava manual das três categorias |
| `{uniq: {...}}` | como hoje |

**Aditivo de propósito:** janela velha continua mandando `None` e o daemon
continua sem mexer. Faça esta metade PRIMEIRO — o daemon vivo dela é mais velho
que o código, e cura de daemon só vale no próximo start.

**A mordida:** grave um override, mande `{}`, e exija que o backend receba a
ordem de limpar. Arranque o ramo do `{}` e veja o teste reprovar **por não ter
havido escrita nenhuma** — não por exceção. Um teste que só confira o retorno de
`apply()` passa com a cura arrancada, porque a lista `applied` é fácil de
satisfazer.

**Custo:** ~35 linhas de produto, ~70 de teste, 3 h.

#### T8 — a janela emite `{}` quando o último override cai · [SEM TELA]

`_controllers_to_ipc` (`app/draft_config.py:1295`, linha **1313**) e o gêmeo
`with_override_fields_cleared` (**:1231**). São **dois** pontos com a mesma linha
textual, e consertar um deixa o sintoma idêntico. Cada ponto precisa da
sua própria mordida.

A distinção a fazer é a mesma do `alvo_de_edicao.py`: **mapa inexistente** (nunca
houve override) é `None`; **mapa esvaziado** (havia, ela apagou) é `{}`.

**SÓ DEPOIS de A3 entregar a T7.** Este é o único arquivo que A3 toca fora da
sua posse, e ele é de A2 — combine a passagem por escrito.

**A mordida:** o ciclo da T2, com override na Lightbar, apagado, Salvar, **fechar
o programa**, reabrir. O override tem de estar ausente no disco **e** ausente no
daemon. Arranque o `{}` e veja o daemon continuar com o override velho — hoje ele
continua, e é esse o defeito.

**Custo:** ~20 linhas de produto, ~60 de teste, 3 h.

#### T9 — as outras seções: `None` significa duas coisas em quantas delas? · [SEM TELA]

Censo, não conserto. Para cada seção do payload de `profile.apply_draft` (`leds`,
`triggers`, `controllers`, `rumble`, `mouse`, `keyboard`, `mic`, `speaker`),
responder: **existe gesto que ESVAZIA a seção?** Se existe, `None` está carregando
duas coisas ali também.

`mic` e `speaker` já têm o contrato certo do outro lado (`None` = sem opinião,
`schema.py:410-415`), e o `mic` tem exceção nomeada (2.6) — **não os unifique**.

**A mordida:** a régua tem de acusar `controllers` **antes** da T8. Uma régua que
nasça sem achar o caso que já se sabe existir não mediu nada (A5 do
COMO-REGER-AGENTES).

**Custo:** 0 de produto, ~40 de teste de censo, 2 h.

### A4 — a matriz widget → depósito

#### T10 — o censo dos 58 widgets de escolha · [SEM TELA]

58 é o território medido hoje (2.5), não o resultado. Para cada widget de escolha
das onze abas, três colunas: **aba** · **widget** · **depósito**, onde depósito é
um de: `Profile.<campo>`, `maquina.json`, `gui_preferences.json`, flag global de
sessão, estado só-de-sessão, **ou NENHUM**.

Comece pelos casos que você já sabe, para validar a régua antes de acreditar
nela: `mouse` (depósito `Profile.mouse`) e o teclado emulado (depósito
`keyboard_emulation.flag`, `utils/session.py:372`). Se a régua não achar esses
dois, ela não mediu nada.

**A mordida:** a régua rodada duas vezes devolve a mesma lista; e plantar um
`Gtk.Switch` novo num mixin faz a contagem subir em 1.

**Custo:** 0 de produto, 4 h.

#### T11 — o portão que reprova widget sem depósito declarado · [SEM TELA]

Nasce do censo da T10, no molde de
`tests/unit/test_perfil_salva_tudo_cobertura_das_secoes.py`: dicionário LITERAL
lido por **AST**, para o portão rodar sem GTK e não pular no CI headless.

Duas listas, e a diferença importa:

- `DEPOSITOS` — widget → onde pousa, com o comando que prova;
- `SEM_DEPOSITO_POR_DECISAO` — os isentos, **cada um com a razão escrita**. As
  cinco seções da aba Configurações entram aqui (D-A4); os sete gestos da aba
  Sistema entram aqui apontando para a D-A.

**A mordida:** o portão **nasce reprovando**. Se nascer verde, ou o censo está
incompleto ou a régua não olha para onde deveria. Depois: acrescente um widget de
escolha novo a qualquer mixin e veja reprovar **nomeando aba e widget** — é a
frase literal do aceite da tabela §0.2.

**Custo:** ~120 linhas de teste, 3 h.

#### T12 — os quatro buracos nomeados, cada um com seu dono · [SEM TELA]

Fechar a §2.4 com dono para cada uma das quatro:

| aba | o que Z4 entrega | o que fica para outra frente |
|---|---|---|
| **Status** | o campo de perfil para touch/giro/acelerômetro **pela via da máscara** (D-A), ou a declaração de que não há campo porque não há escolha | o widget é da Onda 3 · Status |
| **No jogo** | idem, e ela **compartilha o widget** com a Status | a restrição dura *"mesmo arquivo, mesmo agente, sequencial"* vale (F5) |
| **Sistema** | a isenção escrita: os sete gestos são da MÁQUINA, e a D-A recomenda *receita do jogo* | a receita do jogo é decisão dela |
| **Configurações** | a isenção escrita, apontando para o `maquina.json` | nada — a Onda 1 é dona |

**Não invente o campo de touch/giro no esquema nesta tarefa.** A D-A diz *"pela
via da MÁSCARA"*, e a máscara mora em `mode.gamepad_flavor`. Se o caminho da
máscara bastar, **nenhum campo novo nasce** — e essa é a resposta mais barata.
Meça antes de acrescentar.

**A mordida:** cada isenção da T11 tem de citar um arquivo e uma linha que
existam. Arranque a linha citada e veja o portão reprovar por citação morta
(`python3 scripts/validar-citacoes-de-linha.py --all` já faz isso).

**Custo:** 0 a 30 linhas de produto, 3 h.

### A5 — o modo que falta

#### T13 — o que significa perfil sem `mode`, e o `sackboy.json` é um dos 22 · [ESTRUTURAL]

Medido: 22 dos 34 não têm `mode`; `coop` mora dentro dele (`schema.py:601`);
`sackboy.json` é o caso que ela nomeou (2.2).

**A pergunta a responder ANTES de escrever código:** ativar um perfil sem `mode`
deve (a) deixar o modo como está — comportamento de hoje —, (b) voltar ao padrão,
ou (c) **dizer na tela que aquele perfil não tem opinião sobre modo**?

A recomendação é **(c)**, e o motivo é a família F7 desta casa: *o estado vazio é
indistinguível do estado bom*. Hoje ativar `sackboy` e ativar `coop_local` (que
**tem** `mode`) produzem a mesma tela, e só um dos dois pediu co-op.

**[ESTRUTURAL]** porque é texto novo. **Leve a frase à mesa dela, não o código.**

**Não migre os 22 automaticamente.** Gravar `mode` sozinho é *o default entrando
disfarçado de escolha dela* — o mesmo argumento que o `utils/maquina.py` usa, e
a mesma regra. A cura é o produto **dizer**, não adivinhar.

**A mordida:** dois perfis, um com `mode` e um sem, ativados pela mesma rota — a
tela tem de ficar **diferente**. Arranque a distinção e veja as duas telas ficarem
byte a byte iguais.

**Custo:** ~30 linhas de produto, ~50 de teste, 3 h + o tempo dela.

#### T14 — o teclado emulado sai da flag global e ganha campo de perfil · [ESTRUTURAL]

D-A, literal: *"o liga/desliga do teclado emulado"* entra no perfil. Hoje mora em
`keyboard_emulation.flag` (`utils/session.py:372`), enquanto o `mouse` ao lado é
por jogo (`schema.py:963`) — **duas escolhas vizinhas com dois destinos**.

O que Z4 entrega: o **campo no esquema** com contrato `None` = sem opinião (o
mesmo do `mouse`, `mic` e `speaker`), a entrada em `SECOES_COBERTAS`, e a
precedência escrita: **perfil com opinião vence a flag; perfil sem opinião deixa
a flag mandar.** A flag **não morre** — ela continua sendo o estado quando nenhum
perfil opina, e o daemon a lê no boot (`daemon/lifecycle.py:193`).

O widget que escreve o campo é da **Onda 9 · Emulação** e da **Onda 10 ·
Navegação**. **Relate, não edite** os mixins delas.

**[ESTRUTURAL]** porque muda o que a aba diz sobre onde a escolha pousa.

**A mordida:** grave um perfil com o teclado desligado, deixe a flag LIGADA no
disco, ative o perfil, feche o programa, reabra — o teclado tem de estar
desligado. Arranque a precedência e veja a flag vencer. E o inverso: perfil sem
opinião **não pode** apagar a flag — é a mesma regra do `mic.muted` (2.6).

**Custo:** ~50 linhas de produto, ~90 de teste, 4 h + o tempo dela.

#### T15 — os três locks órfãos, e a higiene do diretório · [SEM TELA]

37 `.lock` para 34 `.json` (2.7). O apagar de perfil deixa o lock para trás, e o
diretório é o que a aba Perfis lista.

Duas metades, e só a primeira é de Z4:

1. **apagar perfil apaga o lock** — é o conserto, e é pequeno;
2. **os órfãos já no disco dela** — varredura na carga, ou nada. Recomendação:
   **nada automático**. Apagar arquivo do disco dela sem ela pedir é o oposto da
   regra da casa. Se for para limpar, é gesto com nome na aba Perfis, e a aba é
   da Onda 6.

Um dos três é `vitoria.json.lock` — **nome de pessoa em nome de arquivo**. Ele
não entra no corpo de prova da T1 com esse nome.

**A mordida:** crie perfil, apague, e exija que **nem** o `.json` **nem** o
`.lock` sobrevivam. Arranque a remoção do lock e veja reprovar contando arquivos,
não conferindo um caminho — a contagem pega o caso que o caminho fixo não pega.

**Custo:** ~15 linhas de produto, ~30 de teste, 1 h.

---

## 7. O que o Bluetooth bloqueia

D2: o mapeamento de BT é trilha dela com o assistente, na mesa do specs. Esta
sprint **não o planeja**. O que o produto **não pode afirmar na tela** sobre o
perfil até a medição existir:

| # | a pergunta de BT | o que não se pode dizer enquanto ela estiver aberta |
|---|---|---|
| **BT-Z4-1** | ativar um perfil por rádio aplica as MESMAS seções que no cabo? | que o perfil foi *"reaplicado no controle"* sem qualificar transporte. O LED de jogador é `parcial` no mapa e o passthrough de vibração é `inferido-do-codigo`: **as duas seções que o perfil guarda com mais confiança são as duas com menos medição no rádio** |
| **BT-Z4-2** | o `speaker` guardado no perfil chega ao aparelho por rádio? | que o som volta ao ativar o perfil. `audio.alto_falante` no mapa: `cabo=parcial`, **`rádio=não`**, `inferido-do-codigo`. O perfil pode **guardar** volume, mudo e rota; a tela **não pode** prometer que eles valem no rádio |
| **BT-Z4-3** | o `mic` guardado no perfil vale por rádio? | que ativar o perfil restaura o microfone no rádio. Medido em 23/08: **não existe fonte de captura por rádio** sem a ponte. `mic.volume` é do CAMINHO (PipeWire) e vale nos dois; `mic.muted` é firmware, e `audio.microfone` é `rádio=parcial` |
| **BT-Z4-4** | com quatro no rádio, o perfil aplica os quatro overrides? | que o perfil "vale para a mesa". **Quantos DualSense por rádio o produto sustenta é pergunta aberta da §0.7**, e `controllers` é o único campo cujo custo cresce com o tamanho da mesa |

**A pergunta que NÃO bloqueia esta frente, e é bom que não bloqueie:** *a chave de
`controllers` (o MAC) é a mesma no cabo e no rádio?* Medido — linha
`identidade.cracha_nos_dois_transportes` do
[mapa de canais](../../data/mapa-controles.csv): `cabo=sim`, `rádio=sim`,
`medido`, com a ressalva *"n = 4, e é AMOSTRA"*. O override por peça acha o dono
depois de ela trocar de transporte. **Mas o 8BitDo é outra história** — um
aparelho com dois MACs come slot e faz a numeração dançar (balde de identidade,
§0.6), e **isso é NÃO VERIFICADO para `controllers`**.

**A advertência de bancada que vale para todo executor:** em 23/08 três réguas
independentes mostraram a mesa passando de dois DualSense para ZERO entre 18h15 e
20h45, e o que sobrava em `/sys/class/hidraw` era **o nosso próprio vpad**.
Nenhum número desta leva sobre 2 ou 4 controles é medição viva. Quem for medir
mesa cheia, meça de novo.

---

## 8. As dependências

**Z4 depende de** (§0.2 do [SPRINT_ORDER](../SPRINT_ORDER.md), conferido):

| frente | por que, concretamente |
|---|---|
| **Z2 — o alvo ganha dono próprio** | `controllers` é indexado pelo alvo de edição. Enquanto `_edit_target_uniq` puder faltar em silêncio, escrever um override é escrever no controle errado — ou na mesa inteira. **A T8 não fecha sem Z2** |
| **Z5 — uma régua só para quem está na mesa** | o ciclo da T2 precisa saber quem está conectado para decidir a quem o override se aplica ao reabrir. Com três réguas discordando (F6), o ciclo mede a régua, não o perfil |

**Dependem de Z4:**

| onda | o quê |
|---|---|
| **Onda 6 · Perfis** | **dura**. A [PERFIS-ABRE-O-QUE-GUARDA-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) declara Z4 como primeira dependência |
| **Onda 8 · Gatilhos** | **dura — o conversor** (T4). A [GATILHOS-APLICADO-COM-PROVA-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) traz "dois perfis dela não abrem" **no próprio título** |
| **Onda 3 · Status** | T12 — o que touch/giro/acelerômetro guardam, se guardam |
| **Onda 10 · Navegação** | T14 — o campo do teclado emulado |

**Z4 NÃO depende de Z0, Z1, Z3, Z6 nem Z7**, e é bom dizer o que isso significa:
esta frente pode rodar com as fotos ainda mentindo (Z0), porque quase tudo nela é
`[SEM TELA]`. As duas tarefas `[ESTRUTURAL]` (T13, T14) **esperam o olho dela**, e
até lá entregam esquema e portão, não frase de tela.

**Sprints que esta frente absorve** — nenhuma inteira. Ela **destrava** e
consome:
[PERFIL-SALVA-TUDO-01](2026-07-29-PERFIL-SALVA-TUDO-01-salvei-todas-as-abas-e-so-parte-ficou.md)
(a queixa-mãe: *"fiz alterações em todas as abas e salvei, e essas configs não
ficam salvas"* — a T3 é a resposta medida dela),
[POR-UNIDADE-01](2026-08-10-POR-UNIDADE-01-o-override-por-peca-alcanca-mais-abas.md)
(o `controllers` que a T7/T8 conserta) e
[MASCARA-POR-JOGADOR-01](2026-08-15-MASCARA-POR-JOGADOR-01-a-decisao-de-14-08-esbarra-na-de-10-08.md)
(a via da máscara, que a T12 mede antes de acrescentar campo). As três continuam
sendo da **Onda 6 · Perfis** para a metade que é de aba.

---

## 9. O aceite

**O da tabela §0.2 é o piso, não o teto.** Ele está aqui palavra por palavra, e
cada linha aponta a tarefa que a prova:

1. **abrir os perfis REAIS dela na janela (34 no disco), mexer em cada aba,
   Salvar, FECHAR o programa, reabrir e comparar campo a campo — não teste de
   função pura.** → T1, T2, T3;
2. **`DraftConfig.from_profile` com os params aninhados de "Aventura" e "Corrida"
   reprova hoje.** → T4, e a mordida da T2 contra os dois **antes** do conserto;
3. **widget de escolha novo sem campo de perfil nem depósito declarado faz a
   matriz REPROVAR nomeando aba e widget.** → T11.

**Linha de base, a medir com a leva PARADA** (eu não a rodei — seção 3):

```bash
timeout 560 xvfb-run -a .venv/bin/python -m pytest tests/unit/ \
  -k "perfil or profile or draft or trigger" -q
```

A sprint fecha quando tudo abaixo está verde:

```bash
git add -A                                  # os portões não veem arquivo novo
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
python3 scripts/validar-citacoes-de-linha.py --all
python3 scripts/validar-palavra-de-tela.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
.venv/bin/python scripts/check_paridade_transporte.py
```

e mais **as seis provas próprias desta frente**:

1. **os 12 presets de fábrica abrem no editor, os 12.** A régua da §2.1 devolve
   lista vazia. Hoje devolve dois;
2. **o ciclo pela porta da janela existe e roda contra os 46 perfis do corpo de
   prova** (34 dela + 12 de fábrica), e **mata o processo** entre salvar e
   reabrir;
3. **apagar o último override chega ao daemon.** Override na Lightbar, apagado,
   Salvar, fechar, reabrir: ausente no disco **e** ausente no daemon. Arrancar o
   `{}` faz reprovar;
4. **o portão widget → depósito nasceu reprovando** e hoje passa, com cada
   isenção citando arquivo e linha que existem;
5. **`grep -rn "aceita ambos\|via tuple" src/`** volta vazio, e o mypy fica verde
   sem os dois `cast`;
6. **a matriz da T3 é derivada em runtime** — acrescentar um campo ao `Profile`
   num teste faz a matriz crescer sozinha, sem ninguém editar lista.

**As duas tarefas `[ESTRUTURAL]` — T13 e T14 — não fecham sem a palavra dela.**
Elas entregam esquema, precedência e portão; a frase de tela espera.

---

## 10. O que fica aberto, e de quem é

**Dela, e só dela:**

- **D-A, a parte que ainda não tem resposta:** touch, giroscópio e acelerômetro
  entram no perfil **pela via da máscara** (nenhum campo novo) ou ganham campo
  próprio? A T12 mede e devolve o custo dos dois lados; a escolha é dela;
- **a frase da T13** — o que a tela diz ao ativar um perfil sem `mode`. É a
  família F7 (estado vazio indistinguível do bom) na aba Perfis;
- **a precedência da T14** — perfil vence flag, e perfil sem opinião não apaga a
  flag. Está recomendada com motivo; falta a palavra;
- **os locks órfãos no disco dela** (T15): apagar é gesto com nome, e o gesto é da
  aba Perfis;
- **se `aventura` e `corrida` de fábrica deviam usar params aninhados.** A T4
  conserta o conversor; se a resposta for *"o preset é que está no formato
  errado"*, o conserto é outro e mais barato — mas **muda o arquivo dela**, e por
  isso é dela.

**Da trilha de BT dela com o assistente:** BT-Z4-1 a BT-Z4-4 (seção 7).

**De outras frentes, e esta sprint NÃO as toca:**

- **Z2** — `_edit_target_uniq` sai de `getattr(..., None)` e ganha dono. A T8 fica
  em pé sobre isso;
- **Z5** — a régua única de quem está na mesa. O ciclo da T2 a consome;
- **Z1** — a ponte que sabe dizer não. Quando a gravação do perfil falhar, a tela
  tem de dizer; hoje `_call_checked` termina em `return True, None`. **Z4 mede o
  que foi guardado, não o que a tela diz sobre ter guardado**;
- **Onda 6 · Perfis** — o editor, o perfil removido que ressuscita, a caixinha do
  Steam Input (D-D) e a redação de tudo o que aparece nessa aba;
- **o balde de identidade da Onda 12** — um aparelho com dois MACs contra a chave
  de `controllers`. **NÃO VERIFICADO** aqui, e a medição de 2 minutos que o
  destrava é dela (ligar o 8BitDo em cada modo e anotar o MAC).
