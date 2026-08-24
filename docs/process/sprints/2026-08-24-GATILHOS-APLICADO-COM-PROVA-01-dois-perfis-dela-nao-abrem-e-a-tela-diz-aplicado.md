# GATILHOS — APLICADO COM PROVA-01 — dois perfis dela não abrem, e a tela diz "aplicado"

**24/08/2026.** Aba **Gatilhos** — a **4ª** da tira (`Início · Status · No jogo ·
**Gatilhos** · Lightbar · Rumble · Perfis · Sistema · Emulação · Navegação ·
Configurações`, conferida no `src/hefesto_dualsense4unix/gui/main.glade`). A fila
das ondas está em [SPRINT_ORDER §0.3](../SPRINT_ORDER.md); esta onda corre
**depois** da onda da Lightbar (que é dona do `_edit_uniq`) e da de Perfis (dona
do rascunho), e antes da do Rumble.

| | |
|---|---|
| **Grau** | **MEDIDO** em tudo que tem comando ao lado (§2). **DESENHO** na coreografia, nas tarefas e no custo. |
| **Fecha** | Os **dois perfis de fábrica que não abrem na janela**; o "aplicado" que não sabe se saiu byte; a posse do jogo que vence em silêncio; a trava manual que o daemon arma e nenhuma aba mostra; a queda para escrita global que **apaga override de gatilho do perfil inteiro**; o preset que não volta; as dicas que só se leem aplicando o efeito no controle de alguém; o estado vazio idêntico ao estado bom; e o vão vertical. |
| **NÃO faz** | Não mede rádio — a trilha de Bluetooth é dela com o assistente, na mesa do specs (§6). Não escolhe os dezenove rótulos (é a [GATILHO-PALAVRA-01](2026-07-29-GATILHO-PALAVRA-01-os-dezenove-modos-em-portugues.md), e a palavra é dela). Não põe as quatro marcas de jogador na grade (é a [MESA-CHEIA-02](2026-08-13-MESA-CHEIA-02-a-marca-de-quem-escolheu-na-aba-gatilhos.md), e ela **espera** esta). Não toca nenhuma outra aba. |
| **Depende de** | **Z1** (a ponte que sabe dizer não), **Z2** (o alvo com dono próprio), **Z3** (broadcast proibido), **Z4** (o perfil guarda tudo), **Z5** (o dado que existe e não chega à tela), **Z6** (comunhão com o specs). E de **duas ondas**: a da **Lightbar** (que move o `_edit_uniq` para fora, e ao fazê-lo toca `app/actions/triggers_actions.py:587` e `:654`) e a de **Perfis** (o rascunho). |
| **Por que é a última fila de abas** | O achado nº 1 é de **território alheio**: o conversor que engole dois perfis é o mesmo `DraftConfig` que a Z4 e a onda de Perfis arrumam. Consertar aqui primeiro seria curar o sintoma na aba e deixar a causa no rascunho — que é literalmente o defeito `BUG-DRAFT-NEVER-LOADED-01`, já curado uma vez (`app/app.py:884`). |

---

## 1. O defeito, em uma frase

**Dois dos doze perfis que o próprio produto instala não abrem nesta aba** — a
janela cai no padrão de fábrica em silêncio e passa a sessão inteira pronta para
gravar esse padrão por cima do perfil dela — **e, quando ela clica, a aba diz
"aplicado" sem ter como saber se algum byte saiu**.

---

## 2. O que está medido, e o que é hipótese

Régua declarada: o `.venv` deste repositório, a árvore de trabalho de hoje, o
`state_full` do daemon vivo lido em modo leitura, e os JSON de perfil lidos do
disco por `json.load`, sem passar por camada nenhuma do produto. **Nada foi
escrito no aparelho e o daemon não foi parado.**

### 2.0 O estado da bancada AGORA — e ele desmente o briefing

```
$ ls /sys/class/hidraw/*/device/uevent | xargs grep -h HID_NAME
Compx 2.4G Wireless Receiver / BY Tech Gaming Keyboard (x2 cada)
DualSense Wireless Controller (Hefesto P1)      <- o NOSSO vpad
$ .venv/bin/python -c "from hefesto_dualsense4unix.app.ipc_bridge import daemon_state_full as s; print(s())"
connected(topo): True | transport: bt     <- a régua velha (F6)
controllers[0]: connected=False, transport=None, player=None
coop: {'enabled': True, 'players': 1, 'mesa': []}
active_profile: None
```

**ZERO DualSense físicos.** O único nó de `hidraw` que parece um controle é o
vpad do Hefesto. Quem executar **não pode presumir mesa cheia**; o §8 diz o que
fazer com isso.

### 2.1 Os dois perfis de FÁBRICA que a janela não abre

O produto instala doze perfis (`assets/profiles_default/`). **Dois deles não
sobrevivem à porta de entrada da janela.**

```
$ .venv/bin/python -c "
from hefesto_dualsense4unix.profiles.schema import Profile
from hefesto_dualsense4unix.app.draft_config import DraftConfig
import json
for n in ('aventura','corrida','sackboy'):
    p=Profile.model_validate(json.load(open(f'assets/profiles_default/{n}.json')))
    try: print(n,'->',DraftConfig.from_profile(p).triggers.left.mode)
    except Exception as e: print(n,'-> EXPLODIU:',type(e).__name__)"
aventura -> EXPLODIU: ValidationError     (10 erros)
corrida  -> EXPLODIU: ValidationError     (10 erros)
sackboy  -> SemiAutoGun
```

**A causa, com endereço.** `profiles/schema.py:202` aceita dois formatos
canônicos e o valida em `:226-261`: `list[int]` e `list[list[int]]`. Os dois
perfis usam o aninhado, que é o formato dos modos por posição:

```
assets/profiles_default/aventura.json  left/right MultiPositionFeedback
    [[1],[2],[3],[4],[5],[6],[7],[8],[8],[8]]
assets/profiles_default/corrida.json   right      MultiPositionVibration
    [[0],[1],[2],[3],[4],[5],[6],[7],[8],[8]]
```

E `app/draft_config.py:41-47` declara `TriggerDraft.params: tuple[int, ...]` —
**só o formato plano**. O conversor `_triggers_config_to_draft`
(`app/draft_config.py:314-329`) faz um `cast` que engana o mypy e não converte
nada: o pydantic recusa as dez sublistas em tempo de execução.

**O daemon não tem esse problema, e é isso que prova que o conserto é achatar:**

```
$ .venv/bin/python -c "
from hefesto_dualsense4unix.core.trigger_effects import build_from_name
a=build_from_name('MultiPositionFeedback',[[1],[2],[3],[4],[5],[6],[7],[8],[8],[8]])
b=build_from_name('MultiPositionFeedback',[1,2,3,4,5,6,7,8,8,8])
print(a==b, a)"
True TriggerEffect(mode=FEEDBACK, forces=(255, 3, 136, 198, 250, 63, 0))
```

Os mesmos sete bytes. **Aninhado e plano são a mesma coisa para o aparelho**, e
a própria aba já grava plano desde o `BUG-TRIGGER-FLAT-MULTIPOS-01`
(`app/actions/triggers_actions.py:333-378`). O que falta é a porta de entrada
aceitar o que o produto instalou.

### 2.2 E a queda é SILENCIOSA — a sessão inteira no padrão de fábrica

`app/app.py:842` chama `DraftConfig.from_profile`. O `except Exception` de
`app/app.py:872` engole a exceção, loga `draft_load_falhou` e devolve
`(None, "")` — que em `_bootstrap_draft_async` (`app/app.py:895-900`) significa
**não trocar o rascunho**. Ele fica em `DraftConfig.default()`.

O preço já está escrito no próprio arquivo, em `app/app.py:884`:

> *"`BUG-DRAFT-NEVER-LOADED-01`: (…) então `self.draft` ficava em
> `DraftConfig.default()` a sessão inteira. Consequência: o rodapé 'Salvar
> Perfil' gravava defaults por cima do perfil ativo (perda de dados) e 'Aplicar'
> resetava o hardware."*

**É o mesmo dano, por outra porta, e a porta é um perfil que o produto
instalou.** Quem instalar o Hefesto e escolher "Aventura" ou "Corrida" tem
exatamente isso — sem uma palavra na tela.

### 2.3 "Aplicado" sem saber: a cura existe, está escrita, e a aba não a chama

Isto é o F2 desta casa na forma mais pura. Em 23/08 a `ELO-MUDO-01` construiu a
resposta e **deixou a ligação para depois, de propósito**, porque os chamadores
moravam em arquivo que outra frente estava editando. A dívida está registrada,
com endereço, em `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1024-1044`:

| existe na ponte | chamadores de produção | o que a fecha |
|---|---|---|
| `trigger_set_detalhado` (`app/ipc_bridge.py:411`) | **0** | `app/actions/triggers_actions.py:593, :609, :613, :618` |
| `trigger_reset_detalhado` (`app/ipc_bridge.py:501`) | **0** | `app/actions/triggers_actions.py:655` |
| `destinos_da_aplicacao` | **0** | `app/actions/triggers_actions.py:658` (`_toast_trigger`) |

```
$ grep -rn "trigger_set_detalhado" src/ | grep -v ipc_bridge.py
(nada)
```

O daemon **já responde** `aplicado_em` e `guardado_em`
(`daemon/ipc_handlers.py:1176-1177` no `trigger.set`, `:1227-1228` no
`trigger.reset`). A aba chama `trigger_set_checked`, que estreita tudo para
`bool`, e o `_toast_trigger` (`app/actions/triggers_actions.py:658-712`)
**re-deduz o destino do estado da própria janela**. A medição da `ELO-MUDO-01`,
com a mesa vazia: o daemon respondeu `aplicado_em: [], guardado_em: []` — zero
destino — e a aba disse *"SimpleRigid aplicado"*.

### 2.4 A posse do jogo VENCE, e nada no produto sabe disso

`core/backend_pydualsense.py:1213-1229`, `REPLICA-03`:

```python
raw_r = getattr(self, "_raw_trigger_right", None)
if raw_r is not None and len(raw_r) == GAME_TRIGGER_BLOCK_LEN:
    common[10 : 10 + GAME_TRIGGER_BLOCK_LEN] = raw_r     # o bloco do JOGO
else:
    common[10] = int(self.triggerR.mode.value) & 0xFF    # o nosso
```

Com um jogo escrevendo gatilho, o "Aplicar em L2" grava em `self.triggerL` e o
bloco é **descartado na montagem do report**. E o report SAI — logo até o
`aplicado_em` da §2.3, sozinho, diria "aplicado".

**A posse está registrada e não tem leitor:**

```
$ grep -rn "_game_triggers_by_uniq" src/ | grep -v backend_pydualsense.py
(nada)
```

Quatro ocorrências, todas dentro do backend. **Nunca chega ao `state_full`, nunca
chega à janela.** É o F2 de novo, num dado que responde à pergunta "por que o
meu gatilho não mudou?".

### 2.5 A trava manual: o daemon arma a cada clique e nenhuma aba mostra

`daemon/ipc_handlers.py:1164` — **todo** `trigger.set` chama
`store.mark_manual_trigger_active("trigger")`, e enquanto qualquer categoria
estiver armada o `AutoSwitcher` não reaplica perfil por troca de janela
(`profiles/autoswitch.py:859, :904`). Como cada clique de modo agenda um
`trigger.set` em 300 ms (`app/actions/triggers_actions.py:313-331`), **navegar
pela grade pausa a troca automática de perfil.**

A bandeira existe no `StoreSnapshot` (`daemon/state_store.py:71` e `:722`) e
**não sai no `state_full`**:

```
$ .venv/bin/python -c "from hefesto_dualsense4unix.app.ipc_bridge import daemon_state_full as s; \
    print([k for k in s() if 'manual' in k or 'trava' in k or 'lock' in k])"
['autoswitch_locked']        <- outra coisa: o cadeado que ELA liga na Início
```

```
$ grep -rn "manual_trigger_active" src/hefesto_dualsense4unix/app/
(nada)
```

É a queixa histórica *"a config que eu deixo não fica"* pelo lado inverso: a
troca automática está pausada e nada diz isso. A
[MESA-CHEIA-08](2026-08-13-MESA-CHEIA-08-o-desligar-que-re-arma-a-trava.md)
curou o caso do "Desligar" (a cura está viva em
`app/actions/triggers_actions.py:247-312`); **o que sobrou é a INVISIBILIDADE.**

### 2.6 Alvo ausente = apagar override do perfil inteiro, em silêncio

`_persist_params_to_draft` (`app/actions/triggers_actions.py:361-378`) lê
`getattr(self, "_edit_target_uniq", None)` e, no ramo `None`, chama
`with_override_fields_cleared("triggers", {side})`. Medido:

```
$ .venv/bin/python -c "
from hefesto_dualsense4unix.app.draft_config import DraftConfig, TriggerDraft, TriggersDraft
d = DraftConfig.default().with_controller_triggers('AC:A7:F1:00:00:41',
    TriggersDraft(left=TriggerDraft(mode='Rigid', params=(3,8)),
                  right=TriggerDraft(mode='Bow', params=(1,5,4,3))))
print(d.with_override_fields_cleared('triggers', {'left'}).source_controllers)"
{'AC:A7:F1:00:00:41': ControllerOverrides(triggers=TriggersConfig(
    left=TriggerConfig(mode='Off', params=[]),          <- APAGADO
    right=TriggerConfig(mode='Bow', params=[1,5,4,3])))}
```

**Um clique de modo, com a mesa vazia, zera o gatilho esquerdo de TODOS os
controles do perfil.** É exatamente o defeito que `app/alvo_de_edicao.py`
descreve e mede para a Lightbar — *"`None` carregava duas coisas diferentes:
'ela clicou em Todos' e 'eu não sei quem é o alvo'"* — vivo aqui também. E os
dois eixos desta aba leem por caminhos diferentes: a leitura usa
`_edit_target_uniq` (`:164-166`), a escrita usa `_edit_uniq()`
(`:587`, `:654`), que é método da **Lightbar** (`app/actions/lightbar_actions.py:259`).

### 2.7 O preset volta como "Personalizar"

Onze presets de curva (`profiles/trigger_presets.py`: 6 de feedback, 5 de
vibração). O **valor** volta — ele viaja nos `params`. O **nome** não: não há
campo para ele no esquema (`TriggerConfig` tem `mode` e `params`, e mais nada), e
`_populate_preset_combo` termina com `set_active_id("custom")`
(`app/actions/triggers_actions.py:456`), sempre. Reabrir a janela com a "Rampa
crescente" exata no disco mostra **"Personalizar"**.

### 2.8 Para comparar seis modos parecidos, hoje, é preciso APLICAR todos

Os 19 modos **têm** descrição, e ela aparece — para **um** modo por vez, o
selecionado (`app/actions/triggers_actions.py:509`; na foto de hoje é o
*"Sem resistência."* do `Off`). Para ler a de outro modo é preciso clicá-lo, e
clicar **aplica no controle 300 ms depois** (§2.5). São 38 botões na tela e uma
frase visível.

O mecanismo de dica já existe e **já tem quatro chamadores de produção** —
`app/widgets/segmented_selector.py:97`, usado por `secao_orcamento.py:255`,
`controller_card.py:3538`, `profiles_actions.py:1137`, `external_card.py:308`.
A aba com mais botões do produto é a única que não o chama.

E o campo que existiria para a dica fina está vazio inteiro:

```
$ .venv/bin/python -c "
from hefesto_dualsense4unix.app.actions.trigger_specs import PRESETS
print(len(PRESETS),'modos;',sum(len(p.params) for p in PRESETS),'parâmetros;',
      sum(1 for p in PRESETS for q in p.params if not q.help_text),'sem help_text')"
19 modos; 73 parâmetros; 73 sem help_text
```

`TriggerParamSpec.help_text` (`app/actions/trigger_specs.py:22`): **73 vazios,
zero leitores**. O único tooltip da linha de parâmetro repete o próprio rótulo
(`:542`).

> **Correção ao briefing:** ele fala em "19 frases e 38 dicas ausentes". As 19
> frases **existem e aparecem**; os parâmetros são **73**, não 38. O defeito é
> que a frase custa uma aplicação no aparelho para ser lida.

### 2.9 O estado vazio é o estado bom, e a foto prova

A aba **não pergunta a ninguém quem está na mesa**: `alvo_fora_da_mesa` é o único
consumidor, e ele mora dentro do toast (`app/actions/triggers_actions.py:695`).
Nenhum `set_sensitive` no arquivo inteiro. Com zero controles, os 38 botões estão
lá, clicáveis, e o "Aplicar em L2" está lá, verde.

**E a foto que a casa manda olhar primeiro é a prova disso.** O host de retrato
desta aba (`scripts/gui-captura/retratar_abas.py:1797-1850`) monta pelo **método
de produção** — `install_triggers_tab()` — **sem daemon e sem rascunho**. Ou
seja: `docs/usage/assets/readme_gatilhos.png` é a aba com **zero** controles, e
é indistinguível da aba com quatro.

> Esta aba **tem** host de retrato e a foto dela é o produto, não o XML cru — é
> uma das seis. Vale registrar porque o mesmo arquivo guarda a lição contrária:
> em 22/08 esta função montava o layout à mão e a moldura saía com 1016 px em vez
> de 482 px, e **ela decidiu a fila de interface olhando aquela foto**.

### 2.10 A suíte é verde e nenhuma mordida abre um perfil pela porta da janela

```
$ .venv/bin/python -m pytest tests/unit/test_triggers_actions.py \
    tests/unit/test_trigger_presets.py tests/unit/test_trigger_canon_01.py \
    tests/unit/test_gatilho_palavra_rotulos.py \
    tests/unit/test_mesa_cheia_09_toasts_honestos.py --collect-only -q | tail -1
145 tests collected
```

145 verdes, e **nenhum** chama `DraftConfig.from_profile` sobre um perfil com
`params` aninhado — por isso os dois perfis de fábrica quebrados passaram
despercebidos. É o P11 do `SPRINT_ORDER` na aba: *"a função pura tem oito testes
e o fio que a chama não tem nenhum"*.

### 2.11 O que é HIPÓTESE, e fica marcado como tal

1. **Que o "Aplicar em L2" seja redundante.** Toda troca de modo já aplica em
   300 ms (`:313-331`), então o botão parece repetir o que acabou de acontecer.
   **Não medido com o dedo dela** — pode haver caso (mexer só no slider e não no
   modo) em que ele é o único caminho. A T10 mede antes de mexer.
2. **Que o preset por nome caiba no esquema sem quebrar perfil dela.**
   Plausível (campo novo opcional), **não provado**.
3. **NÃO VERIFICADO:** o que apaga o gatilho depois de MINUTOS. O mapa registra
   que um `rigid(3,8)` sobreviveu a 8 s e a 30 s, e que *"alguns minutos depois
   ela relatou os DOIS soltos"*, sem suspeito nomeado. Candidatos escritos lá:
   o tique de 30 s do daemon e o `reassert_resolved_outputs`. Continua aberto.

---

## 3. A coreografia dos agentes

**Oito agentes, quatro rodadas.** A regra que separa as rodadas é o arquivo: a
rodada 1 mexe no rascunho e na ponte (fora da aba), a rodada 2 mexe na aba, a
rodada 3 na tela e a rodada 4 fecha.

### Rodada 0 — a espera (nenhum agente desta sprint)

Esta onda **não começa** antes de: a Z2 ter dono do alvo, a onda da Lightbar ter
movido o `_edit_uniq`, e a Z1 ter definido a palavra da recusa. Se qualquer uma
não estiver de pé, o executor **para e diz**, em vez de escrever a versão local
delas — que é o defeito que a Onda 0 existe para impedir.

### Rodada 1 — dois agentes em PARALELO, arquivos disjuntos

| agente | tarefas | arquivos |
|---|---|---|
| **A1 — o dono do rascunho** | **T1** (o conversor achata) e **T2** (a queda deixa de ser silenciosa) | `app/draft_config.py`, `app/app.py` |
| **A2 — o dono do "aplicado"** | **T3** (a aba consome a resposta do daemon) | `app/actions/triggers_actions.py` (só `_apply_trigger`/`_send_trigger_named`/`_reset_trigger`/`_toast_trigger`) |

> A1 e A2 tocam arquivos diferentes de propósito. **Se colidirem, A1 vem
> primeiro** — sem a T1 não há perfil para a T3 provar nada em cima.

### Rodada 2 — três agentes em PARALELO (depende da rodada 1)

| agente | tarefas |
|---|---|
| **A3 — o dono da posse e da trava** | **T4** (a posse do jogo chega à tela) e **T5** (a trava manual sai do daemon) — as duas publicam campo novo no `state_full`, e é o mesmo par de linhas (`daemon/ipc_handlers.py:1895` e `:2217`) |
| **A4 — o dono do alvo** | **T6** (consumir a Z2; alvo desconhecido recusa em vez de apagar) |
| **A5 — o dono do perfil** | **T7** (o preset volta) — encosta na Z4, e o campo novo do esquema passa pelo dono da onda de Perfis |

### Rodada 3 — dois agentes, tela

| agente | tarefas |
|---|---|
| **A6 — o dono da palavra** | **T8** (as 19 dicas sem aplicar; o campo morto decide) |
| **A7 — o dono do que se vê ao abrir** | **T9** (o estado vazio), **T10** (o "Aplicar" deixa de ser eco) e **T11** (o vão vertical e a largura) |

> **T11 é cosmética pré-aprovada e não espera ninguém.** T9 e T10 são
> estruturais e **esperam o olho dela** — mas o código pode ficar pronto atrás
> de foto, para o lote sair inteiro.

### Rodada 4 — o fechamento

**A8 — o dono das mordidas** roda **T12** contra a árvore já curada, executa
`scripts/gui-captura/retratar_abas.py`, e monta o lote de fotos antes/depois
para o olho dela.

---

## 4. As tarefas

Doze. Onze de execução, uma de prova.

---

### T1 — O conversor achata, e os dois perfis de fábrica abrem *(A1)*

**Arquivos:** `app/draft_config.py:314-329` (`_triggers_config_to_draft`).

**O conserto:** achatar `list[list[int]]` para a lista posicional plana antes de
montar o `TriggerDraft`. **Não** mexer no esquema — o formato aninhado é
canônico no disco e o `build_from_name` prova que produz os mesmos bytes
(§2.1). O `cast` de hoje sai junto: ele mentia para o mypy.

**A mordida:** arranque o achatamento e rode o teste novo que abre
`assets/profiles_default/aventura.json` e `corrida.json` por
`DraftConfig.from_profile` — ele tem de **reprovar nomeando o arquivo**. Hoje
não existe teste nenhum que faça isso (§2.10).

**Custo:** ~12 linhas, 1 h. **Carimbo:** **não toca a tela.**

---

### T2 — A queda deixa de ser silenciosa *(A1)*

**Arquivos:** `app/app.py:872-880` e `app/app.py:906-918` (`_falhou`).

**O conserto:** perfil que não converte deixa de virar `draft_load_falhou` em
`warning` e vira **recusa visível**: a janela diz qual perfil não abriu e **não
adota** a identidade dele — sem isso o "Salvar Perfil" grava fábrica por cima
(o dano que `app/app.py:884` já nomeia). O `except Exception` continua
existindo, porque perfil corrompido não pode derrubar o latch de I/O a 2 Hz; o
que muda é que ele **fala**.

**A mordida:** ponha um perfil deliberadamente inválido no diretório e ative-o;
arranque a frase de recusa e o teste tem de reprovar mostrando que a janela
seguiu com `DraftConfig.default()` **e** com o nome do perfil ativo — a
combinação exata que perde dado.

**Custo:** ~25 linhas, 2 h.
**Carimbo:** **estrutural — precisa do olho dela** (texto novo de recusa).

---

### T3 — "Aplicado" passa a vir de quem viu *(A2)*

**Arquivos:** `app/actions/triggers_actions.py:593, :609, :613, :618` (trocam
`trigger_set_checked` por `trigger_set_detalhado`), `:655` (`trigger_reset` →
`trigger_reset_detalhado`) e `:658-712` (`_toast_trigger` decide por
`destinos_da_aplicacao`, não pela heurística da janela).

**O conserto:** é a ligação que a `ELO-MUDO-01` deixou escrita e pendurada. As
três entradas de `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1024-1080`
saem do registro **na mesma edição** — se saírem sem os chamadores, o portão
reprova, e é assim que se prova que a ligação aconteceu.

**A mordida:** com a mesa vazia (o estado da §2.0), "Aplicar em L2" tem de dizer
que **não** aplicou, com motivo. Arranque a leitura de `aplicado_em`/`guardado_em`
e o teste reprova; arranque as entradas do registro do portão **sem** trocar os
chamadores e o portão reprova. **Duas mordidas independentes, e essa é a regra
das réguas em série.**

**Custo:** ~45 linhas, 2 h 30.
**Carimbo:** **estrutural — precisa do olho dela** (a frase da recusa muda o que
ela lê depois de cada clique). A palavra sai do vocabulário da Z1, não daqui.

---

### T4 — A posse do jogo chega à tela *(A3)*

**Arquivos:** `core/backend_pydualsense.py:1213-1229` e `:4522-4537` (expor a
posse por `uniq`), `daemon/ipc_handlers.py:1895` e `:2217` (publicar), e
`app/actions/triggers_actions.py:658-712` (a aba recusa).

**O conserto:** `_game_triggers_by_uniq` ganha leitor: um campo por controle
dizendo que **o jogo é o dono do bloco de gatilho deste lado**. Com ele ligado, a
aba **recusa antes de mandar** — o mesmo desenho da recusa por Modo Nativo que
`_toast_trigger` já aplica (`:690-696`), e o mesmo precedente da HARM-16 (*"o
daemon recusa com motivo"*).

**A mordida:** pendure um bloco cru falso em `_raw_trigger_left` de um handle
dublê, mande um `trigger.set` e exija que o toast **não** diga "aplicado".
Arranque a publicação do campo e veja reprovar. Prova adicional, barata e
independente: `grep -rn "_game_triggers_by_uniq" src/ | grep -v backend_` tem de
deixar de ser vazio.

**Custo:** ~55 linhas, 3 h. **Carimbo:** **estrutural — precisa do olho dela.**

---

### T5 — A trava manual sai do daemon e aparece *(A3)*

**Arquivos:** `daemon/ipc_handlers.py:1895` e `:2217` (publicar
`store.manual_trigger_active`, que `daemon/state_store.py:722` já calcula), e a
aba lendo-a.

**O conserto:** a bandeira e o motivo (qual categoria armou) entram no
`state_full`, e a aba diz, em uma linha, que **a troca automática de perfil está
pausada porque você ajustou o gatilho à mão** — com o caminho de volta, que é o
botão "Desligar" que já existe e já solta só a categoria certa
(`app/ipc_bridge.py:481-485`).

**A mordida:** o teste lê o `state_full` depois de um `trigger.set` e exige a
bandeira; arranque a linha de publicação e ele reprova. Segunda mordida, que é
a que morde de verdade: **arranque o leitor da aba** e o portão do dado sem
consumidor (Z5) tem de reprovar nomeando a chave.

**Custo:** ~35 linhas, 2 h. **Carimbo:** **estrutural — precisa do olho dela.**

---

### T6 — O alvo tem dono, e "não sei" recusa em vez de apagar *(A4)*

**Arquivos:** `app/actions/triggers_actions.py:164-166` (leitura), `:361-378`
(escrita), `:587` e `:654` (os dois `getattr(self, "_edit_uniq", lambda: None)()`).

**O conserto:** os três eixos passam a perguntar ao dono que a **Z2** criou
(`app/alvo_de_edicao.py`), e o estado `DESCONHECIDO` deixa de cair no ramo
"Todos". Com alvo desconhecido a aba **não persiste e não manda** — recusa com
motivo. O `getattr` com `lambda: None` sai: sem dono é erro alto, não escrita
global silenciosa.

> A remoção do `_edit_uniq` de dentro da Lightbar é tarefa **da onda da
> Lightbar** (a L2 de lá cita `triggers_actions.py:587` e `:654` por nome). Aqui
> só se **consome**. Duas ondas escrevendo a mesma linha é como a cura volta
> pela metade.

**A mordida:** monte o host **sem** o mixin da Status e clique um modo. Hoje ele
apaga o override de gatilho de todos os controles do perfil (§2.6) e passa.
Depois, tem de **reprovar em voz alta**. Arranque o dono da Z2 e veja Gatilhos e
Lightbar reprovarem juntos.

**Custo:** ~30 linhas, 2 h. **Carimbo:** **estrutural** (a recusa é texto novo).

---

### T7 — O preset volta com o nome que ela escolheu *(A5)*

**Arquivos:** `profiles/schema.py` (campo opcional no `TriggerConfig`),
`app/draft_config.py` (ida e volta), `app/actions/triggers_actions.py:437-456`
(parar de forçar `"custom"`) e `:378-425`.

**O conserto:** o nome do preset por posição passa a viajar no perfil. Campo
**opcional**, para os 34 perfis dela continuarem abrindo. Quando o nome existe e
os valores batem com a curva daquele nome, a aba mostra o nome; quando ela mexeu
num slider, mostra "Personalizar" — que é o que `_update_preset_to_custom`
(`:475-495`) já faz ao vivo, e que hoje se perde ao fechar.

**A mordida:** grave "Rampa crescente", **feche** a janela, reabra, e exija o
nome. Arranque a leitura do campo e veja reprovar. Esta é a mordida da Z4, e ela
é do tipo que a Z4 exige: **abrir de verdade, não comparar função pura.**

**Custo:** ~50 linhas, 3 h. **Carimbo:** **não toca a tela** (o rótulo já existe).

---

### T8 — As dezenove frases sem aplicar nada em ninguém *(A6)*

**Arquivos:** `app/actions/triggers_actions.py:104-153` (`install_triggers_tab`
passa a chamar `sel.set_tooltips(...)`), com o texto vindo de
`trigger_specs.PRESETS[*].description` — a mesma fonte que a aba já mostra.

**O conserto, e é uma linha e meia:** o mecanismo existe e tem quatro chamadores
de produção (§2.8). O dicionário sai do `PRESETS`, nunca de uma cópia — cópia
seria um segundo dono dos rótulos, e é o que o próprio `retratar_abas.py`
proíbe por escrito.

**A metade que é decisão:** `TriggerParamSpec.help_text` tem 73 vazios e zero
leitores. **Ou ganha leitor, ou sai com nota datada.** O padrão desta sprint é
**sair** — é campo morto, e a regra da casa é que o meio-termo é o defeito mais
caro daqui. Se ela quiser as dicas finas, é texto novo e vira tarefa dela.

**A mordida:** arranque o `set_tooltips` e o teste tem de reprovar comparando o
tooltip lido do botão com a `description` do `PRESETS`. Arranque uma descrição do
`PRESETS` e o mesmo teste reprova — as duas pontas presas na mesma fonte.

**Custo:** ~20 linhas, 1 h.
**Carimbo:** **cosmética pré-aprovada** — "tornar dica visível" está na classe
que a D3 liberou, e o texto **não é novo**: é a frase que a aba já mostra para o
modo selecionado. **Se o executor reescrever qualquer uma das 19, vira
estrutural e espera o olho dela.**

---

### T9 — O estado vazio deixa de ser igual ao estado bom *(A7)*

**Arquivos:** `app/actions/triggers_actions.py` (a aba passa a consumir a mesa
da Z5) e `src/hefesto_dualsense4unix/gui/main.glade` (o lugar da frase).

**O conserto:** sem DualSense na mesa, a aba diz isso, e os 38 botões param de
prometer. **A frase tem de distinguir três coisas** — não há controle; há
controle e a janela não sabe qual é o alvo; e o alvo escolhido saiu da mesa (que
o `alvo_fora_da_mesa` já sabe responder). Colapsar as três em uma é repetir o
defeito da §2.6 na tela.

**A mordida:** rode `retratar_abas.py` com a fixture de mesa vazia e exija que o
PNG contenha a frase; arranque o consumo e o teste reprova. Régua: rótulo lido do
`Gtk.Label` depois da montagem, no molde do `test_a_mesa_cheia_na_foto.py` —
**OCR não.**

**Custo:** ~40 linhas, 2 h 30. **Carimbo:** **estrutural — o olho dela.**

---

### T10 — O "Aplicar em L2" deixa de ser eco (ou ganha razão de existir) *(A7)*

**Arquivos:** `app/actions/triggers_actions.py:213-226`, `:227-246`, `:313-331`.

**Ordem obrigatória: MEDIR ANTES.** A hipótese da §2.11 é que o botão repete o
que o live-preview já fez 300 ms atrás. O agente **primeiro** registra as
sequências em que o botão faz diferença (mexer só no slider; mexer e clicar
dentro dos 300 ms; clicar com o preview cancelado pelo "Desligar"). Só então
decide entre as duas saídas: **o botão some** porque é eco, ou **o botão fica e
a tela diz o que ele faz de diferente**.

**Por que não pode ser contorno:** a `MESA-CHEIA-08` e a cura de 14/08
(`_adiantar_live_preview`, `:274-312`) provam que o par botão↔preview tem
sequências que o senso comum erra. **Hipótese que não explica o que já
funcionava é gambiarra**, e aqui já se pagou por isso.

**A mordida:** as sete sequências de clique que a `MESA-CHEIA-08` deixou
registradas rodam contra o fonte de antes e o de depois, chamada por chamada, e
só as que a tarefa declarar podem divergir. Arranque a cura e veja reprovar.

**Custo:** ~1 h de medição + o que a medição decidir (estimativa: 20 a 60 linhas,
2 h). **Carimbo:** **estrutural — o olho dela.**

---

### T11 — O vão vertical e a largura *(A7)*

**Arquivos:** `src/hefesto_dualsense4unix/gui/main.glade` (as duas molduras
L2/R2 e o `valign` do contêiner).

**O conserto:** na foto de hoje as duas molduras terminam a menos de dois terços
da altura e o resto é vazio; e a caixa de parâmetros fica com 4 linhas de slider
num espaço que comporta mais. É a metade desta aba das sprints
[LARGURA-01](2026-07-29-LARGURA-01-a-mesma-largura-em-todas-as-abas.md) e
[LEGIBILIDADE-01](2026-07-25-LEGIBILIDADE-01-texto-legivel-alvo-clicavel.md).

**A mordida:** teste sob `Xvfb` com `Gtk.OffscreenWindow` (nunca `Gtk.Window` —
sem gerenciador de janelas ela fica 1x1 para sempre, e está em
[COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md)) medindo a altura da moldura;
arranque o `valign` e veja reprovar.

**Custo:** ~15 linhas, 1 h. **Carimbo:** **cosmética pré-aprovada** — foto
depois, no lote, sem esperar.

---

### T12 — A mordida que faltava: um perfil de verdade pela porta da janela *(A8)*

**Arquivo:** teste novo em `tests/unit/`.

**O conserto:** um teste que, para **cada** um dos doze
`assets/profiles_default/*.json`, faz `Profile.model_validate` →
`DraftConfig.from_profile` → `to_profile` e compara a seção `triggers` campo a
campo. Hoje isso não existe (§2.10), e é o buraco por onde os dois perfis de
fábrica passaram.

**A mordida:** este teste **é** a mordida — arranque a T1 e ele reprova nomeando
`aventura` e `corrida`. Prova de que ele morde, exigida no commit: a saída
literal do pytest com a T1 arrancada.

**Custo:** ~60 linhas, 1 h 30. **Carimbo:** **não toca a tela.**

---

## 5. O que esta sprint NÃO conserta, e por quê

- **As quatro marcas de jogador na grade** ([MESA-CHEIA-02](2026-08-13-MESA-CHEIA-02-a-marca-de-quem-escolheu-na-aba-gatilhos.md)):
  a própria sprint diz por que espera — *"uma marca colorida em cima de uma aba
  que afirma 'aplicado' sem ter aplicado torna a mentira mais bonita"*. Depois
  da T3 e da T6 ela fica barata; antes, é dano.
- **Os dezenove rótulos em português**: é palavra dela.
- **O que apaga o gatilho depois de minutos**: NÃO VERIFICADO (§2.11).

---

## 6. O que o Bluetooth bloqueia nesta aba

**A trilha de rádio é dela com o assistente (D2). Esta sprint não a planeja** —
declara o que a tela **não pode afirmar** enquanto a medição não existir.

| a tela NÃO pode afirmar | a célula do [mapa de canais](../../data/mapa-controles.csv) que barra |
|---|---|
| que **um modo específico** funciona no rádio | `gatilho.adaptativo`: `radio_aciona = sim`, mas a ressalva diz *"um MODO só foi exercitado, `Rigid`, com um único jogo de parâmetros (posição 3, força 8) — o firmware tem oito modos e nenhum dos outros foi tocado"*. **Dezoito dos dezenove botões estão fora da medição.** |
| que o "Disparo (Weapon)" e a "Vibração" fazem o que o nome diz | `gatilho.modos_firmware`: `aciona = parcial` nos dois transportes, com **DIVERGÊNCIA VIVA** — `weapon()` manda `0x06` e `vibration()` manda `0x22`, os dois fora do grupo medido. É a **decisão D-H** do [SPRINT_ORDER](../SPRINT_ORDER.md), e ela pede **1 h de bancada com o dedo dela antes de qualquer código**. |
| que "aplicado" virou **confirmado no aparelho** | `gatilho.leitura`: `não/não` nos dois transportes, `afirmado-no-doc`, sem consumidor. **Não existe leitura de estado de gatilho.** O que a T3 entrega é "o daemon escreveu", nunca "o controle obedeceu" — só o dedo dela fecha essa distância, e a E5 da [TRIGGER-CANON-01](2026-08-01-TRIGGER-CANON-01-os-modos-de-gatilho-contra-a-enum-da-sony.md) ficou aberta por isso. |
| qualquer coisa sobre **quatro** DualSense no rádio | a medição de 11/08 foi **2 no cabo + 2 no rádio**. Quatro no rádio nunca foi medido para gatilho. |
| que a Steam **não** derruba o efeito | a rajada de repintura da Steam está medida (98 reports contra 6), a cor ganhou reafirmação e **o gatilho não tem equivalente**. A [GATILHO-NÃO-PERDIDO-01](2026-08-23-GATILHO-NAO-PERDIDO-01-a-regua-perguntou-pelo-campo-errado.md) e a [pilha do Steam Input](../../protocol/pilha-steam-input-xpad-sdl.md) deixam isso explícito. |

**A pergunta única de BT que destrava esta aba:**

> **Com o efeito aplicado por rádio, o dedo dela sente diferença entre os
> dezenove modos — e o efeito sobrevive à rajada da Steam?**

O ensaio já está escrito e é dela: abrir o Sackboy pela Steam com um `Rigid` bem
duro, sentir o L2 antes e depois da rajada. Enquanto não existir, **nenhuma
tarefa desta sprint escreve frase que prometa resultado por rádio** — só descreve
o que o produto mandou.

---

## 7. As sprints absorvidas

| sprint | o que contribui | morre ao fim desta? |
|---|---|---|
| [MESA-CHEIA-09](2026-08-13-MESA-CHEIA-09-aplicado-sem-byte-nenhum.md) | O diagnóstico do "aplicado" sem byte e o vocabulário `ResultadoDeSaida` que a `ELO-MUDO-01` estendeu | **SIM** — a T3 é a última milha dela nesta aba |
| [GATILHO-NÃO-PERDIDO-01](2026-08-23-GATILHO-NAO-PERDIDO-01-a-regua-perguntou-pelo-campo-errado.md) | Que a gravação de gatilho **está inteira** (34 de 34 perfis guardam `triggers`) — o que faz o achado da §2.1 ser de LEITURA, não de escrita | **NÃO.** O ensaio da rajada da Steam é dela |
| [MESA-CHEIA-08](2026-08-13-MESA-CHEIA-08-o-desligar-que-re-arma-a-trava.md) | Já **CONCLUÍDA** (cura viva em `app/actions/triggers_actions.py:247-312`). Contribui as sete sequências de clique que a T10 usa como régua, e a trava que a T5 torna visível | **SIM** — já estava morta, entra aqui só para sair da fila |
| [MESA-CHEIA-02](2026-08-13-MESA-CHEIA-02-a-marca-de-quem-escolheu-na-aba-gatilhos.md) | A queixa original ("não dá para ver quem escolheu o quê") e a prova de que `effective_triggers_for` já responde por qualquer MAC | **NÃO.** A marca espera esta sprint por decisão da própria sprint (§5) |
| [TRIGGER-CANON-01](2026-08-01-TRIGGER-CANON-01-os-modos-de-gatilho-contra-a-enum-da-sony.md) | Os modos contra a enum da Sony, entregues. Contribui a lição dos sete presets que existiam na tela e não faziam nada, e deixa a **E5** aberta | **PARCIAL.** A E5 (ler o estado do gatilho) é do §6 e continua sem canal |
| [GATILHO-PALAVRA-01](2026-07-29-GATILHO-PALAVRA-01-os-dezenove-modos-em-portugues.md) | A separação `name` (contrato) × `label` (tela) e o teto medido de 22 caracteres, que a T8 e a T11 têm de respeitar | **NÃO.** As dezenove palavras são dela |
| [LARGURA-01](2026-07-29-LARGURA-01-a-mesma-largura-em-todas-as-abas.md) | A metade desta aba, na T11 | **PARCIAL** — só a parte de Gatilhos |
| [LEGIBILIDADE-01](2026-07-25-LEGIBILIDADE-01-texto-legivel-alvo-clicavel.md) | O alvo clicável e o texto legível dos 38 botões e dos sliders | **PARCIAL** — o aceite da fonte já fechou em 07/08; sobra o alvo |
| [BOTÃO-QUE-NÃO-MENTE-01](2026-07-26-BOTAO-QUE-NAO-MENTE-01-clico-e-nao-acontece-nada.md) | A regra em pessoa: *"clico e não acontece nada"*. É o critério da T3, da T4 e da T10 | **PARCIAL.** O que é de outras abas continua nelas |

**Absorvida não é fechada.** O que cada uma tem de bancada, de rádio ou de
palavra dela continua dela.

---

## 8. O aceite

Nada fecha sem os quatro blocos. **Rode `git add -A` antes: os portões são cegos
a arquivo novo.**

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

**Bloco 1 — as mordidas.** Cada uma das doze reprova com a cura arrancada, com a
**saída literal do pytest no commit**. As três que não podem faltar:

1. **T1/T12** — os doze perfis de fábrica abrem; com a T1 arrancada, o teste
   reprova nomeando `aventura` e `corrida`;
2. **T3** — mesa vazia diz que não aplicou; e o portão
   `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` reprova se as três
   entradas saírem do registro sem os chamadores;
3. **T6** — host sem o mixin da Status reprova em voz alta em vez de escrever
   global.

**Bloco 2 — a foto.** `scripts/gui-captura/retratar_abas.py` roda depois da
rodada 3 e `docs/usage/assets/readme_gatilhos.png` passa a mostrar o estado
vazio dizendo que está vazio. **Sem este bloco o aceite é um PNG que mente** —
e esta aba é uma das que **têm** host de retrato, então não há desculpa.

**Bloco 3 — o olho dela.** T2, T3, T4, T5, T6, T9 e T10 são **estruturais** e
esperam a palavra dela ([PROVA-DE-TELA-01](2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md)).
T8 e T11 são **cosméticas pré-aprovadas** e vão no mesmo lote **sem** esperar.

**Bloco 4 — quatro controles.** **Na bancada de 23/08 havia ZERO DualSense
físicos** (§2.0). Então: ou a mesa cheia acontece e a prova é feita com os
quatro, ou **este bloco fica declarado ABERTO com o motivo escrito** — nunca
fechado por analogia. O que **pode** fechar sem aparelho é a Z3 nesta aba: alvo
que saiu da mesa exige **zero** escritas, e o teste reprova ao ver quatro.

---

## 9. O que fica aberto, e de quem é

**Dela:**

- **A decisão D-H** — os dois botões que mandam o byte de outro modo. 1 h de
  bancada com o dedo dela, e a sprint não escreve código antes.
- **As dezenove palavras** da GATILHO-PALAVRA-01.
- **As quatro marcas de jogador na grade** (MESA-CHEIA-02), depois desta.
- **O ensaio da rajada da Steam** (§6) — só o dedo dela fecha.
- **O `help_text`**: 73 campos vazios saem, ou ela pede as dicas finas e vira
  texto novo (T8).

**Da trilha de Bluetooth (dela com o assistente, na mesa do specs):**

- A pergunta única do §6.
- Os dezoito modos que nunca foram sentidos no rádio, e os quatro controles no
  rádio que nunca foram medidos para gatilho.

**Das outras ondas, e esta sprint PARA se faltarem:**

- **Z1** — a palavra da recusa. Esta aba é o caso mais documentado dela (três
  entradas no registro do portão, com o conserto escrito linha a linha), e por
  isso serve de molde — mas **não** inventa o vocabulário.
- **Z2 + onda da Lightbar** — o dono do alvo e a saída do `_edit_uniq`.
- **Z4 + onda de Perfis** — o campo do preset (T7) passa pelo dono do esquema.
- **Z5** — o portão do dado sem consumidor é o que faz a T4 e a T5 morderem de
  verdade; sem ele elas viram publicação sem leitor, que é o defeito que estão
  curando.
- **Z6** — sem o portão que olha a tela, as frases do §6 são conselho, não regra.

**Aberto e sem dono, declarado:** o que apaga o gatilho com período de **minutos**
(§2.11, item 3). Se a rodada 1 não produzir um suspeito nomeado, isto sobe para
cá com o nome de quem ficou.
