# GATILHO-NÃO-PERDIDO-01 · agente E4

| | |
|---|---|
| **Árvore** | `hefesto-voo/GATILHO-NAO-PERDIDO-E4`, branch `voo/GATILHO-NAO-PERDIDO-E4` |
| **Base** | `9cfd638` (merge de `dev` em `onda/atual`) |
| **Fechou** | a sprint, com **nota datada** (a cura de código já estava na árvore desde 23/08) — e **uma régua falsa VIVA**, achada na varredura, com portão para a classe |
| **Não fez** | a seção *"O que continua ABERTO, e é dela"* da sprint: é **bancada**, e a bancada não existia nesta madrugada |
| **Commits** | `c580f2f`, `a12c9d0`, `15ecc29` |
| **Portões** | `bash scripts/portoes.sh` → **TODOS VERDES — 24 portões** (rodado duas vezes: reprovou `ruff` na primeira, consertado) |
| **`src/` tocado** | **nenhum arquivo entregue.** As três mordidas arrancaram cura de `src/` e a devolveram por `git checkout --`; `git status` confirmado limpo antes de cada commit |
| **Bancada** | não usada. Não parei daemon, não rodei `systemctl`, não escrevi no aparelho |

---

## O que mudou

### 1 — a sprint fecha, e a cura dela entrou no commit que a escreveu (`c580f2f`)

**Conferi antes de tocar em código, como o despacho mandou.** A sprint é de
23/08 e a árvore andou muito; ela estava fechada.

**A régua falsa nunca foi versionada.** O `.get("trigger")` no singular era
medição de mesa, feita à mão e jogada fora. Varri `src/`, `tests/` e `scripts/`
por `"trigger"`/`'trigger'` no singular: **toda ocorrência é a CATEGORIA do
relatório de ativação** — `relatorio["trigger"]`, `daemon/state_store.py`,
`mark_manual_trigger_active`, o subcomando `test trigger` da CLI. O nome certo
no lugar certo. **Não havia régua a consertar.**

**E a cura de código que a sprint descreve entrou no MESMO commit que criou o
documento**, `4fd14bb` (23/08 03:35): `_RESULTADO_PARA_RELATORIO`
(`profiles/manager.py:106`) já traduz `registrado` → `adiado_sem_controle`, o
`setdefault(categoria, "aplicado")` não existe mais, e
`tests/unit/test_o_relato_do_gatilho_nao_promete_byte_que_nao_saiu.py` passa
**10/10** nesta árvore.

**A medição refeita com o mesmo instrumento declarado** (`json.load` do disco,
sem camada do produto):

| medida | 23/08 | **25/08** |
|---|---|---|
| perfis no disco | 34 | **33** |
| `d.get("trigger") is None` | 34 de 34 | **33 de 33** |
| chave `"trigger"` no JSON | 0 | **0** |
| chave `"triggers"` no JSON | 34 | **33** |
| com efeito de verdade | 15 | **15** |
| `Off/Off` | 19 | **18** |

**O que fecha a pergunta é o Sackboy.** Em 23/08 ele gravava `Feedback [5, 4]`;
hoje grava **`SemiAutoGun` na esquerda e `AutoGun` na direita**. O disco guardou
uma edição POSTERIOR da aba Gatilhos, campo a campo — o caminho de gravação não
só estava inteiro, ele continuou funcionando. Nota datada, e não substituição:
os números de 23/08 continuam certos **para** 23/08.

### 2 — a régua do preset falava com um widget que a aba não tem (`a12c9d0`)

Achado na varredura que o despacho pediu (*"procure OUTRAS réguas que perguntam
pelo campo errado"*). **Esta estava viva.**

`_mk_widgets`, o dublê de `tests/unit/test_triggers_actions.py`, publicava
`trigger_{lado}_preset_combo` — **um id que o glade não tem e que o produto
nunca pede.** Sobrou da `FEAT-DSX-COMBO-TO-SEGMENTED-01`, que trocou o combo do
preset por um segmentado empacotado em `trigger_{lado}_preset_slot`
(`triggers_actions.py:146`): **a troca foi feita no seletor de MODO e esquecida
no de PRESET.** O `test_t8_as_dezenove_frases_sem_aplicar_nada.py`, escrito hoje,
já usa o id certo — dois dublês da mesma aba discordavam sobre quais widgets ela
tem, e o mais velho estava errado.

**O preço não era cosmético, e é a A2 do `COMO-REGER-AGENTES.md` literal.** O
órfão era um `_FakeComboBox`, cujo `set_active_id` aceita **qualquer** id; o
`_FakeSegmentedSelector` — como o widget real — **RECUSA** id que não está entre
os itens. Três testes pegavam o órfão, mandavam `rampa_crescente` nele e ficavam
verdes **sem que a aba tivesse publicado esse preset**. *"O dublê que só sabe
passar"*, dentro do arquivo cuja própria docstring de dublê cita essa regra.

O que entrou:

- os três testes passam a falar com `self._trigger_preset[lado]`, o seletor que
  a aba wira, e **afirmam que o id foi aceito** — que é a prova de que
  `_populate_preset_combo` publicou o preset;
- `_mk_widgets` publica `trigger_{lado}_preset_slot` (o id do glade) no lugar do
  órfão, e com isso o segmentado de preset passa a ser **empacotado** nos testes
  deste arquivo, coisa que nunca foi;
- nasce `test_os_dois_seletores_chegam_ao_slot_que_o_glade_tem`:
  `install_triggers_tab` pula o `pack_start` em silêncio quando o slot não vem
  (`if slot is not None`), então guardar o seletor num atributo sem empacotá-lo
  deixava um widget que existe para o código e **não existe para ela**;
- `_FakeComboBox` sai junto com o último uso — a aba não tem combo nenhum desde
  a `FEAT-DSX-COMBO-TO-SEGMENTED-01`, e guardar um dublê de combo ao lado do de
  segmentado convidava o próximo teste a escolher o errado.

### 3 — a regra da sprint ganha máquina (`15ecc29`)

A sprint fecha com uma regra e **nenhum portão a cobrava**. Nasce
`tests/unit/test_o_duble_nao_inventa_widget.py`: **todo id que um dublê publica
num mapa de widget tem de existir** — no glade **ou** pedido pelo produto por
`_get`/`get_object`. Régua dupla de propósito, a mesma disciplina dos dois
portões de MAC do `CLAUDE.md`: só o glade reprovaria widget montado em código;
só o produto reprovaria id que já está na tela e ainda não tem leitor.

**A dívida nasce declarada, e não reprovando** — precedente do
`check_colisao_de_sprints.py`, e pelo mesmo motivo: portão que reprova o que já
estava lá é portão que alguém desliga com `--no-verify`. `DIVIDA_DECLARADA` tem
**uma** linha, e é defeito real que **não curei porque o arquivo é de outra
frente** (R1) — está na seção *"O que fica aberto"* abaixo. Um segundo teste
impede a lista de envelhecer em silêncio: curado o id, a linha **sai**.

**O portão achou um defeito em SI MESMO antes do commit.** A primeira versão lia
só `ast.Assign` e ficava cega para `self._widgets: dict[str, Any] = {...}`, que é
`ast.AnnAssign` — a forma que os dublês de janela mais usam. Quem denunciou foi o
teste da dívida, ao dizer que o `profile_preview_label` *"não é mais publicado"*.
Uma régua que não se mede a si mesma teria nascido cega.

---

## Qual mordida prova

Três, todas arrancadas **por linha** (nunca por âncora de texto), com o
`__pycache__` limpo entre arrancar e devolver.

### M1 — a régua do preset: a nova morde, a antiga era cega

Mesma cura arrancada nas duas: a linha `combo.set_items(items)` de
`_populate_preset_combo` (`app/actions/triggers_actions.py:470`), por
`sed -i '470d'`.

```
# CURA ARRANCADA — régua NOVA
$ pytest tests/unit/test_triggers_actions.py -q
E   AssertionError: o segmentado de preset RECUSA id que a aba não publicou —
E   sem esta linha o teste mediria o rascunho de um preset que a aba não oferece
E   assert None == 'rampa_crescente'
5 failed, 27 passed

# MESMA CURA ARRANCADA — régua ANTIGA (git checkout do arquivo de teste)
$ pytest tests/unit/test_triggers_actions.py -q -k "preset_changed or custom_noop"
3 passed, 29 deselected                      <- CEGA

# CURA DEVOLVIDA (git checkout -- src/.../triggers_actions.py)
33 passed
```

Os outros 2 vermelhos da régua nova são
`test_populate_preset_combo_sem_duplicar_personalizar[…]`, que já existiam e já
mordiam essa linha — declaro para que ninguém leia 5 onde a minha cura responde
por 3.

### M2 — o seletor que ela não vê

Cura arrancada: `preset_slot.pack_start(preset_sel, True, True, 0)`
(`triggers_actions.py:148`), por `sed -i '148d'`.

```
# CURA ARRANCADA
E   AssertionError: o segmentado de preset do lado left ficou fora de
E   `trigger_left_preset_slot`: a aba o guarda no atributo e ela não o vê na tela
1 failed, 32 passed          <- só o teste novo

# CURA DEVOLVIDA
33 passed
```

### M3 — o portão da classe, nos dois sentidos

```
# defeito plantado: o id órfão de volta em _mk_widgets
E   AssertionError: dublê publicando widget que o produto não conhece …
E       tests/unit/test_triggers_actions.py:371  ->  'trigger_left_preset_combo'
1 failed, 1 passed

# defeito plantado do outro lado: apagar `profile_preview_label` do dublê alheio
E   AssertionError: 'profile_preview_label' não é mais publicado por dublê
E   nenhum. Tire a linha de `DIVIDA_DECLARADA`
1 failed, 1 passed

# TUDO DEVOLVIDO (git checkout dos dois arquivos)
2 passed
```

### O que rodei, e só isso

```
pytest tests/unit/test_triggers_actions.py                       33 passed
pytest tests/unit/test_o_duble_nao_inventa_widget.py              2 passed
pytest <escopo alargado de gatilhos: triggers_actions + t8 +
        trigger_canon_01 + z4_conversor + o_relato_do_gatilho>   123 passed
bash scripts/portoes.sh                       TODOS VERDES — 24 portões
mypy / ruff nos arquivos novos                              limpos
```

**Não rodei a suíte inteira** (R2), e não fotografei nada (R4).

---

## O que fica aberto

### A1 — `profile_preview_label`, e é de outra frente

`tests/unit/test_r12_editor_simples_gui.py:190` publica
`"profile_preview_label": _FakeEntry("")` no dublê `_Editor._widgets`. **O glade
não o declara e nenhum `_get`/`get_object` do produto o pede** — conferido:
`grep -rn "profile_preview" src/` volta vazio. É a mesma família curada na aba
Gatilhos, no território da aba **Perfis**.

**A linha exata do conserto:** apagar `tests/unit/test_r12_editor_simples_gui.py:190`
e tirar a entrada de `DIVIDA_DECLARADA` em
`tests/unit/test_o_duble_nao_inventa_widget.py:76`. O portão da dívida **cobra
as duas metades**: curar uma sem a outra reprova.

Não editei porque é arquivo alheio nesta leva (R1).

### A2 — `profile_radio_any`, o mesmo cheiro, e não é portão nenhum

`tests/unit/test_lightbar_persist.py:218` e `:240` têm um ramo
`elif widget_id == "profile_radio_any":` dentro do `fake_get`, e **o produto não
pede esse id**. O ramo é morto. O portão novo **não** o pega — ele lê mapa de
widget, não `if`/`elif` de dublê de `_get`, e alargá-lo para isso exigiria
adivinhar quais comparações de string são id de widget, que é como uma régua
começa a acusar quem não errou.

O que torna isto pior que estética: aquele `fake_get` devolve um `MagicMock` para
**qualquer** id, então os ids que `_build_profile_from_editor` realmente lê
respondem com um mock truthy. É "o dublê que só sabe passar" de novo. Território
de Lightbar/Perfis — registrado, não tocado.

### A3 — a seção que a própria sprint deixou para ela

*"O que continua ABERTO, e é dela"* não se mexeu, e conferi que nada nesta
madrugada a fechou: **o gatilho continua sem reafirmação depois da rajada da
Steam**, e **ninguém mediu se a rajada o derruba**. É bancada — e a bancada
esteve indisponível (`/sys/class/bluetooth/` vazio desde 02:36). O mecanismo
genérico para a cura, se a medição pedir, já existe:
`core/gatilho_fim_de_sequencia.py`.

---

## O que o bloco `posse:` desta sprint tem de errado

Reportando porque o despacho pediu explicitamente.

| declarado | realidade |
|---|---|
| `src/hefesto_dualsense4unix/core/trigger_curves.py` | **não existe.** O módulo de curvas de gatilho é `core/trigger_effects.py`; há também `profiles/curva_propria.py` e `profiles/trigger_presets.py` |
| `src/hefesto_dualsense4unix/app/actions/trigger_specs.py` | existe, e eu **não precisei tocá-lo** |

E a posse não cobria o trabalho real: a cura que a sprint descreve mora em
`core/backend_pydualsense.py`, `core/controller.py` e `profiles/manager.py` — os
três **fora** do bloco `posse:` e **fora** do `nao_toca:`. Não foi problema
porque a cura já estava entregue; se não estivesse, eu teria travado no primeiro
arquivo.

**O que entreguei ficou em `tests/`**, que nenhuma sprint desta leva reivindica —
conferido por `grep` nos frontmatters. E o `nao_toca:` foi respeitado: nenhum dos
quatro arquivos dele saiu alterado.
