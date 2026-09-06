---
sprint: ONDA0-Z3-BROADCAST-PROIBIDO-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# ONDA 0 · Z3 — BROADCAST PROIBIDO-01 — o pulso do jogador 2 na mão dos outros

**24/08/2026.** Frente **Z3** da **Onda 0**, as invariantes que valem para as
onze abas ([SPRINT_ORDER](../SPRINT_ORDER.md), §0.2). Não é aba: é regra que
manda em três delas — Lightbar, Gatilhos e Rumble.

| | |
|---|---|
| **Grau** | **MEDIDO** em tudo que tem comando ao lado: quatro medições novas de hoje, três delas **por mordida** (arrancar a cura e ver reprovar), com a saída literal copiada no §2.1. **DESENHO** na coreografia, nas tarefas e no custo. **NÃO VERIFICADO** está separado no §2.4, e é curto de propósito. |
| **Fecha** | A invariante *"alvo escolhido que sai da mesa não vira todo mundo"* nas **três** rotas que hoje a violam ou a contradizem: o rumble **do jogo** (`gamepad.py`), o fan-out do **daemon** (`ipc_handlers.py`, onde o broadcast voltou por outra porta e está **vivo hoje**) e a **palavra** que o daemon devolve (`aplicado_em` nomeando três controles que não receberam nada). Fecha também o portão que impede a volta, os dois testes verdes que hoje **travam** o broadcast, e a família que falta no teste da invariante (gatilho). |
| **NÃO faz** | Não escreve texto de aba. As frases de Lightbar, Gatilhos e Rumble são das Ondas 7, 8 e 9 — esta frente entrega o **contrato** para elas terem o que dizer. Não mede rádio (D2, §6). Não mexe no alcance por peça do rumble (é a **D-G** dela, na [RUMBLE-POR-JOGADOR-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md)). Não toca no seletor da aba Status nem no dono do alvo — isso é a **Z2**. |
| **Defeito de forma que cura** | **F4** — *"grava na peça, manda na mesa"* ([SPRINT_ORDER](../SPRINT_ORDER.md) §0.1). E, no caminho, uma instância de **F1** (palavra sem prova) e uma de **F2** (cura escrita e nunca ligada). |
| **Depende de** | **Z2** — o alvo ganha dono próprio. Transitivamente, da **Z5** (a régua da mesa), de que a Z2 depende. Nada aqui pode ser fechado antes de o alvo ter um escritor só. |
| **Quem depende** | **Onda 7 · Lightbar**, **Onda 8 · Gatilhos** e **Onda 9 · Rumble** (dura). Detalhe no §7. |

---

## 1. O defeito, em uma frase

**O Controle 2 sai da mesa no meio da partida, ela clica, e o pulso do jogador 2
vai para a mão dos outros três** — que estão jogando.

E a forma nova, que é a que assusta: **em 25/07 isso foi curado, e voltou.** Não
voltou pelo mesmo lugar — voltou por uma porta ao lado.

---

## 2. O que está medido, e o que é hipótese

### 2.1 Medido HOJE, por mordida

Régua declarada: `pytest` da árvore de trabalho, `.venv/bin/python -m pytest`,
com o backend **real** (`PyDualSenseController`) e handles de dublê, no molde do
`tests/unit/test_p4_alvo_ausente_nao_vira_broadcast.py`. Os quatro MACs são os do
fixture versionado `tests/fixtures/state_full_quatro_controles.json`. **Nenhum
byte foi escrito em aparelho nenhum, e o daemon não foi parado.**

#### (a) A cura do F4 existe, está viva, e a mordida MORDE

```bash
.venv/bin/python -m pytest -q \
  tests/unit/test_p4_alvo_ausente_nao_vira_broadcast.py \
  tests/unit/test_vpad_ff_passthrough.py
# 39 passed
```

Mordida: devolver o `else` histórico de `_resolver_escopo`
(`core/backend_pydualsense.py:491-535`) — alvo ausente volta a devolver
`list(handles.items())`. Feita **sem tocar em `src/`**, por troca do atributo de
módulo num plugin de pytest de rascunho:

```
4 failed, 10 passed
  TestOExemplar::test_o_rumble_nao_vai_para_os_outros_tres
  TestAInsistencia::test_tres_reasserts_depois_continua_ninguem
  TestOsOutrosSetores::test_a_cor_nao_vai_para_os_outros
  TestOsOutrosSetores::test_o_led_do_mic_nao_vai_para_os_outros
```

E as duas contra-classes — `TestAMiraContinuaMirando` e
`TestOBroadcastLegitimoContinua`, que existem para a cura não virar *"nunca manda
nada"* — **continuaram verdes**. É a forma de mordida que esta casa quer, e ela
está de pé. **Nada nesta frente a desfaz.**

#### (b) O BROADCAST ESTÁ VIVO — e entra por `_registrar_em_todos`

**É o achado mais caro da frente.** `daemon/ipc_handlers.py:1002-1068`
(`_registrar_em_todos`, chamado em `:1275` por `led.set` e em `:1340` por
`player_leds.set`) escreve em **cada controle conectado** via `apply_output_for`,
e **não consulta o seletor de alvo em momento nenhum**. Ele nasceu certo — a
BROADCAST-QUE-NAO-MENTE-01, de 02/08, existe porque *"Todos"* não grudava — mas
foi escrito para o caso `alvo = Todos` e roda também quando há alvo.

Medido, com o Controle 2 (`aabbcc000003`) escolhido no seletor e **fora da
mesa**, `led.set` sem `uniq`:

```
RESPOSTA led.set: {'status': 'ok',
                   'aplicado_em': ['aabbcc0000d8', 'aabbcc0000f0', 'aabbcc0000ab'],
                   'guardado_em': []}
cores escritas no fio: {'aabbcc0000d8': [(0,255,0)],
                        'aabbcc0000f0': [(0,255,0)],
                        'aabbcc0000ab': [(0,255,0)]}
```

A barra dos **três outros jogadores** mudou de cor. O `_for_each_led` fez a coisa
certa (registrou `output_alvo_ausente_noop` e não escreveu em ninguém); o
`_registrar_em_todos` logo abaixo pintou os três assim mesmo.

E a variante com o alvo **PRESENTE** é pior, porque não precisa de ninguém sair
da mesa:

```
RESPOSTA led.set (alvo PRESENTE): 'aplicado_em': ['...d8','...03','...f0','...ab']
cores no fio: {'...d8': [(0,255,0)], '...03': [(0,255,0), (0,255,0)],
               '...f0': [(0,255,0)], '...ab': [(0,255,0)]}
```

**"Escolhi o Controle 2 e mudou todos"** — a frase que o comentário do PERFIL-05
em `:1259-1262` declara resolvida. O alvo recebe **duas** escritas (uma por
`set_led`, outra pelo fan-out) e os outros três recebem uma.

**O que salva a janela hoje, e é o motivo de isto não ter aparecido:** a GUI
sempre manda `uniq` (`app/actions/lightbar_actions.py:692`, `:801`, `:934`), e o
ramo com `uniq` é o honesto. **Quem cai aqui é a CLI** — `hefesto test lightbar`
(`cli/cmd_test.py:190` manda `led.set` **sem** `uniq`) — e qualquer cliente IPC.
Portanto: **não é defeito alcançável pela tela hoje; é defeito de contrato**, e é
exatamente o que uma frente transversal existe para pegar antes que a próxima
aba o alcance.

#### (c) A palavra: `aplicado_em` nomeia três que não receberam nada

`daemon/ipc_handlers.py:1069-1129` (`_destinos_do_broadcast`). Com o alvo fora da
mesa, `get_output_target_index()` devolve `None` — e devolver `None` ali é
ambíguo por construção, o próprio getter diz isso em
`core/backend_pydualsense.py:5004-5010`. O ramo `:1121-1122` lê esse `None` como
*"Todos"* e responde com a mesa inteira.

Medido em `trigger.set` sem `uniq`, com o alvo fora:

```
[info] output_alvo_ausente_noop  alvo=AA:BB:CC:00:00:03 guardado=True op=set_trigger
RESPOSTA trigger.set: {'status': 'ok',
                       'aplicado_em': ['aabbcc0000d8','aabbcc0000f0','aabbcc0000ab'],
                       'guardado_em': []}
```

O backend diz, na mesma passada, que **não escreveu em ninguém** e que
**guardou** no ausente. O handler responde que aplicou nos três. **A resposta
honesta está inteira no log e é descartada na volta** — é F1 no formato exato de
`ipc_bridge.py`, e aqui nem ponte precisa: é a linha ao lado.

> **Armadilha do instrumento, e ela custou três tentativas.** A primeira medição
> devolveu `aplicado_em: []` e eu quase a registrei como "está certo". Não
> estava: o `daemon` do fixture é um `MagicMock`, `is_native_mode()` devolve um
> mock **verdadeiro**, e `_destinos_do_broadcast` sai em `:1111-1112` antes de
> chegar ao ramo que interessa. Só com `is_native_mode.return_value = False`
> **e** com `_uniqs_conectados` devolvendo mesa viva o ramo é alcançado. Quem
> escrever o teste de Z3-4 **tem de fixar as duas coisas**, ou escreve um teste
> que passa verde sem nunca ter chegado ao código que ele diz medir.

#### (d) O rumble do JOGO continua caindo em broadcast — a continuação do F4

`daemon/subsystems/gamepad.py:1140-1201` (`apply_game_rumble`). O executor do F4
declarou e não pôde tocar (arquivo alheio). **Está lá:**

* `:1173-1176`, no docstring: *"Sem a API (ex.: FakeController) ou com MAC que
  não casa nenhum handle, cai no broadcast histórico — limitação documentada:
  TODOS os controles vibram juntos."*
* `:1194`: `# MAC não casou nenhum handle → broadcast histórico (documentado).`
* `:1196`: `controller.set_rumble(weak=weak_eff, strong=strong_eff)`

E os dois irmãos, na mesma família e no mesmo arquivo, fazem o **contrário** —
são o molde a copiar, e ele já existe:

* `apply_game_trigger` (`:1203-1224`): *"Sem broadcast de propósito (diferente do
  rumble): replicar um efeito de gatilho em TODOS os controles pintaria o jogador
  errado. (…) a réplica é descartada com log — nunca degrada para broadcast."*
* `apply_game_lightbar` (`:1227-1242`) e `apply_game_player_leds` (`:1244-1262`):
  idem.

**Três rotas de réplica, uma decisão diferente na do meio.** Não é desenho: é
resto.

#### (e) Dois testes VERDES travam esse broadcast

`tests/unit/test_vpad_ff_passthrough.py:537` (`test_mac_desconhecido_cai_em_broadcast`)
e `:544` (`test_backend_sem_targeting_cai_em_broadcast`). O primeiro **exige**
`backend.rumbles == [(None, 90, 90)]` — isto é: exige que um MAC que não casa
nenhum handle vibre a mesa inteira. **É F2 na forma canônica:** o comportamento
que a invariante proíbe está protegido por teste, e quem consertar sem tocar no
teste vê vermelho e conclui que errou.

### 2.2 Medido por leitura de fonte, âncoras conferidas contra a árvore de HOJE

1. **`alvo_de_output_ausente` tem ZERO chamadores de produção.**
   `core/backend_pydualsense.py:2661-2695`. `grep -rn "alvo_de_output_ausente"
   src/ tests/` devolve **só** a definição e o teste do F4. É o método que separa
   *"Todos"* de *"o alvo sumiu"*, e nada no produto pergunta. **É F2.**
2. **O próprio docstring declara a dívida e nomeia o dono** (`:2675-2691`):
   *"DÍVIDA ABERTA — a metade «e DIZ» ainda não chega à tela. (…)
   `_handle_rumble_set` continua respondendo `{"status": "ok", "desfecho":
   RUMBLE_APLICADO}` sem consultar isto — e aquele arquivo é de outra frente."*
   **Esta frente é aquele "outra frente".** E ele já deixou a redação
   provisória escrita, com a ressalva de que a palavra final é dela.
3. **`rumble.set` escreve sem perguntar.** `daemon/ipc_handlers.py:3906` grava
   `rumble_active`, `:3910` chama `set_rumble`. A única recusa que existe ali é a
   do Modo Nativo (NATIVO-RUMBLE-01, `:3885-3905`) — e ela é o **molde de forma**
   pronto: `{"status": "recusado", "desfecho": …, "motivo": …}`, que
   `app/ipc_bridge.py:600` (`rumble_set_checked`) já sabe ler.
4. **A aba Rumble é a única das três que não usa o léxico do guardado.**
   `alvo_fora_da_mesa` (`app/textos_de_aplicacao.py:85`) é lido por Lightbar
   (`lightbar_actions.py:717`, `:813`, `:1160`) e Gatilhos
   (`triggers_actions.py:695`). Em `app/actions/rumble_actions.py`: **zero
   ocorrências**. Os dois cliques (`on_rumble_apply` em `:732-756` e
   `on_rumble_test_500ms` em `:757-777`) chamam `rumble_set_checked(weak,
   strong)` **sem endereço** e comemoram *"Vibração travada"*.
5. **Dois fatos errados vivos no `backend_pydualsense.py`**, os dois sobre esta
   invariante, os dois desmentidos pela cura de 23/08:
   * `:1462-1463` — *"Se a key alvo sumir (controle desconectou), o `_for_each`
     cai de volta em broadcast."* **Falso desde o F4.**
   * `:1849-1850` — *"`target_key=None` (broadcast — sem alvo, **ou alvo que
     desconectou**, o mesmo fallback do `_for_each`)"*. **Falso:** alvo que
     desconectou hoje devolve `target_key = alvo`, não `None` — é o que faz o
     valor virar override por-uniq em vez de virar o padrão do perfil.
   Pela regra da casa isso não é decisão medida a preservar: é número errado, e
   **sai**, dos dois lugares.
6. **A família que falta no teste da invariante.** `TestOsOutrosSetores`
   (`tests/unit/test_p4_alvo_ausente_nao_vira_broadcast.py:228`) cobre **cor** e
   **LED de microfone**; `TestOExemplar` e `TestAInsistencia` cobrem **rumble**.
   **Gatilho não tem teste** — e `set_trigger`
   (`core/backend_pydualsense.py:3486-3500`) passa pelo `_for_each`, logo está
   curado e **sem rede**. O aceite da §0.2 pede *"um teste por família"* e hoje
   são duas de três.

### 2.3 A bancada de agora — e por que ela NÃO serve de prova

Lido às 22h31 de 23/08, read-only, pelo socket do daemon vivo:

```
daemon.status   → connected: true, transport: "bt", battery_pct: 75,
                  output_target_index: null
controller.list → n = 1, com uniq=None, transport=None, connected=False
```

**As duas réguas do MESMO daemon discordam.** É o F6 acontecendo na frente, agora
— e é por isso que **nenhuma afirmação desta sprint sobre 2 ou 4 controles vivos
é medição de bancada**. Tudo que o §2.1 mede é a árvore, com fixture versionado.
A prova no plástico é da bancada dela e está no §9.

### 2.4 NÃO VERIFICADO — e continua não verificado

* **Se `player_leds.set` (`:1340`) tem o mesmo furo de `led.set`.** O sítio é o
  mesmo (`_registrar_em_todos`) e a leitura diz que sim, mas **não rodei**. Z3-0b
  mede antes de Z3-3 consertar.
* **Se o `_registrar_em_todos` com alvo escolhido também derruba o carimbo de
  dono** dos overrides dos outros. O docstring em `:1081-1088` afirma que
  `_record_desired_locked(None, …)` limpa e solta o dono; se o fan-out por-uniq
  logo depois o reescreve como `usuaria`, os três outros ficam com override e
  dono que ninguém pediu. **Não medido.**
* **Quantas escritas de LED por gesto a mesa cheia aguenta.** É pergunta de BT e
  é da §0.7 — mas Z3-3 muda a contagem de escritas por gesto, então a medição
  dela **muda de valor** depois desta frente. Registrado para não se perder.
* **Se existe uma quarta rota de fan-out** fora de `_resolver_escopo`. Achei uma
  (`_registrar_em_todos`) procurando por uma. Z3-0c faz a varredura completa —
  e o portão de Z3-8 é o que impede a quinta.

---

## 3. Por que esta frente vem antes das abas

A **D1** dela: transversal primeiro, porque as invariantes **mudam o que cada aba
tem de fazer**. Concretamente, o que muda em cada uma:

| Aba | O que muda por causa da Z3 |
|---|---|
| **Onda 7 · Lightbar** | A aba tem hoje três chamadas a `alvo_fora_da_mesa` e um léxico completo de *"guardado"*. Sem Z3-3, esse texto é **verdade na janela e mentira no fio**: a tela diz "guardado até o Controle 2 voltar" enquanto a cor já foi para os outros três pela rota da CLI. A aba não tem como consertar isso: o furo é do daemon |
| **Onda 8 · Gatilhos** | A aba lê `aplicado_em` para dizer em quem pegou. Enquanto `_destinos_do_broadcast` nomear três que não receberam, **toda frase de sucesso da aba herda a mentira** — e a Onda 8 gastaria o orçamento dela reescrevendo texto sobre um número errado |
| **Onda 9 · Rumble** | A RUM-1 confessa o alcance e a RUM-2 faz `rumble.set` recusar. **A RUM-2 é a Z3-5 desta frente** (§7): feita aqui uma vez, a Onda 9 fica só com a palavra da tela, que é o trabalho dela |
| **Onda 4 · No jogo** | O card do rumble do jogo mostra o par efetivo que chegou ao motor. Com `apply_game_rumble` degradando para broadcast, esse par é verdade sobre **quatro** motores enquanto o card fala de um jogador |
| **as onze** | O portão de Z3-8 é o que impede a próxima onda de reintroduzir isto num refactor. Foi curado em 25/07 (ABAS-06, em [ABAS-01:83](2026-07-25-ABAS-01-as-abas-brigam-pelo-mesmo-estado.md)), voltou, e a segunda cura (F4, 23/08) já foi contornada por outra porta **na mesma árvore**. Sem portão, a terceira também será |

**A ordem interna também é decisão, e é curta:** Z3 espera a **Z2**. Enquanto o
alvo tiver um escritor e nove leitores por `getattr(..., None)`, a invariante
protege um endereço que a janela pode não saber qual é — e o resultado é uma
recusa em cima do alvo errado, que é pior que o broadcast, porque parece
correção.

---

## 4. A coreografia dos agentes

**Três agentes**, o número da linha da §0.2. Cada um faz a **própria** batida na
própria faixa antes de escrever uma linha, e a posse de arquivo é exclusiva
([COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md), R1).

| agente | posse EXCLUSIVA de arquivo | o que devolve na batida |
|---|---|---|
| **A — o dono da rota do JOGO** | `daemon/subsystems/gamepad.py`, `tests/unit/test_vpad_ff_passthrough.py` | Quantos chamadores de `apply_game_rumble` existem e por que caminho o `target_uniq` chega `None` em cada um; se `make_primary_rumble_sink` (`:1782-1806`) pode legitimamente não ter MAC com mesa de UM; e a saída vermelha da mordida de cada um dos dois testes de `:537` e `:544` |
| **B — o dono da rota do DAEMON** | `daemon/ipc_handlers.py`, `tests/unit/test_z3_broadcast_proibido_ipc.py` (**novo**) | O censo das rotas de saída do IPC (`led.set`, `player_leds.set`, `trigger.set`, `trigger.reset`, `rumble.set`, `rumble.stop`, `lightbar.reset`): para cada uma, se consulta o seletor, se consulta `alvo_de_output_ausente`, e o que devolve com o alvo fora da mesa. **Reproduzir (b) e (c) do §2.1 e medir os dois NÃO VERIFICADOS do §2.4** | <!-- ref-externa: arquivo que ESTA sprint propõe criar; a ausência dele é o assunto -->
| **C — o dono da invariante, do portão e da palavra** | `core/backend_pydualsense.py` (**só comentários e docstrings** — nenhuma mudança de comportamento), `tests/unit/test_p4_alvo_ausente_nao_vira_broadcast.py`, `scripts/check_broadcast_proibido.py` (**novo**) | A varredura completa de fan-out fora de `_resolver_escopo` em `src/` (o quarto sítio do §2.4), com a lista de exceções DELIBERADAS e a justificativa escrita de cada uma — `force_rumble_stop` (`:3589`) é uma, e o docstring dela já diz por quê | <!-- ref-externa: arquivo que ESTA sprint propõe criar; a ausência dele é o assunto -->

**Portão de replanejamento.** Quem rege relê Z3-1..Z3-9 depois das três batidas e
**antes** da rodada 1. Achado novo entra numerado; tarefa derrubada sai com nota
datada. Se a batida de C achar um quarto sítio de fan-out, ele vira Z3-10 e a
posse é de quem for dono do arquivo — **não** de C, que não tem posse de
comportamento em lugar nenhum.

**Rodada 0 — as três batidas, em paralelo, NADA de código.**

**Rodada 1 — os três em paralelo, faixas disjuntas.**

| agente | tarefas |
|---|---|
| **A** | Z3-1, Z3-2 |
| **B** | Z3-3, Z3-4, Z3-5 |
| **C** | Z3-6, Z3-7, Z3-9 |

Os três arquivos não se tocam. **Z3-8 (o portão) fica FORA da rodada 1 de
propósito:** um portão escrito contra a árvore doente nasce calibrado para a
doença.

**Rodada 2 — em série, e é curta.** C escreve Z3-8 contra a árvore **já curada**,
e o primeiro gesto dele é rodar o portão contra o `git stash` da árvore de antes:
**se o portão não reprovar a árvore doente, ele não é portão.**

**Regras de bancada desta frente.** Nenhum agente para o daemon (R3). Ninguém
roda a suíte inteira — cada um roda só os próprios arquivos (R2). Ninguém
fotografa: não há tela nova aqui (R4).

---

## 5. As tarefas

**Doze.** Três de batida (§4) e nove de execução.

---

### Z3-1 — O rumble do jogo para de degradar para broadcast *(A)*

**Arquivo:** `daemon/subsystems/gamepad.py:1140-1201`.

**O conserto:** `apply_game_rumble` passa a ter a **mesma** decisão que os três
irmãos dele no mesmo arquivo (`apply_game_trigger:1203`,
`apply_game_lightbar:1227`, `apply_game_player_leds:1244`) — com `target_uniq`
pedido e não casado, **descarta com log e devolve `None`**, nunca `set_rumble`
global. O `logger.debug` já tem nome de família:
`game_rumble_sem_alvo_descartado`.

**A ressalva que impede a cura de virar "nunca vibra", e ela é obrigatória:**
`target_uniq is None` **não** é o mesmo caso. Um backend sem `primary_uniq`
(`FakeController`) ou uma mesa de um controle só nunca pediu endereço, e ali
broadcast e mira são a mesma coisa. **A recusa vale só quando um endereço foi
pedido e não casou.** É a lição das contra-classes do F4, e quem a ignorar
entrega um produto que não vibra.

**A mordida:** com dois MACs no `_FakeBackend` e `target_uniq` de um terceiro,
exigir `backend.rumbles == []`. Devolva o `set_rumble` do fallback e o teste tem
de reprovar mostrando `[(None, 90, 90)]`. **E a contra-mordida, no mesmo
arquivo:** com `target_uniq=None` e um controle só, `rumbles` tem de continuar
tendo **uma** entrada — arrancar a ressalva faz *esse* teste reprovar.

**Custo:** ~20 linhas em `src/`, ~40 em teste. 2 h.
**Carimbo:** **SEM TELA** — não passa pela D3.

---

### Z3-2 — Os dois testes verdes que travam o broadcast do jogo *(A)*

**Arquivo:** `tests/unit/test_vpad_ff_passthrough.py:537-548`.

**O conserto:** `test_mac_desconhecido_cai_em_broadcast` e
`test_backend_sem_targeting_cai_em_broadcast` afirmam hoje, como contrato, o que
a invariante proíbe. O primeiro **inverte** (MAC pedido e não casado ⇒ zero
escritas) e passa a se chamar pelo que prova. O segundo **fica**, com o nome e o
docstring dizendo que ele é a **contra-classe**: sem endereço pedido, o broadcast
é legítimo e tem de continuar.

**Não se apaga a decisão que eles guardavam.** O par ganha nota datada
apontando a limitação declarada em `:1173-1176` e por que ela caducou: os três
irmãos de réplica já decidiram o contrário no mesmo arquivo, e o preço é co-op.

**A mordida:** é o par de Z3-1 — os dois têm de reprovar por motivos **opostos**
quando se arranca a metade errada da cura. Se arrancar uma coisa só faz os dois
ficarem vermelhos, o par não separa nada e tem de ser reescrito.

**Custo:** ~35 linhas. 1 h.
**Carimbo:** **SEM TELA**.

---

### Z3-3 — `_registrar_em_todos` passa a respeitar o seletor *(B)*

**É a tarefa central da frente.** O broadcast que a ABAS-06 curou em 25/07 está
vivo hoje por aqui (§2.1(b)).

**Arquivo:** `daemon/ipc_handlers.py:1002-1068`, chamado em `:1275` (`led.set`) e
`:1340` (`player_leds.set`).

**O conserto:** o fan-out passa a resolver o escopo **antes** de escrever, com a
mesma regra de três casos do `_resolver_escopo`:

* seletor em *"Todos"* → todos os conectados, **byte-idêntico ao de hoje** (é o
  caso para que ele nasceu, e a BROADCAST-QUE-NAO-MENTE-01 continua valendo);
* alvo escolhido e **presente** → **só ele**, e some a escrita dupla que o §2.1(b)
  mediu;
* alvo escolhido e **ausente** → **ninguém**, e o valor fica no override
  por-uniq do ausente, que é o que o backend já faz e que o log
  `output_alvo_ausente_noop` já registra.

A decisão de escopo vem do backend, não é recalculada aqui: `alvo_de_output_ausente`
(§2.2/1) mais `get_output_target_uniq`. **Duas cópias da mesma regra é como este
defeito nasceu das duas vezes.**

**A mordida:** o teste arma o alvo no Controle 2, tira o Controle 2 da mesa,
manda `led.set` **sem** `uniq` e exige **zero** cor no fio dos outros três e o
override no ausente. Arranque a resolução e ele reprova mostrando os três MACs —
que é literalmente a saída do §2.1(b). **E a contra-mordida:** com o seletor em
*"Todos"*, os três continuam recebendo; arrancar isso faz reprovar por
"nivelamento não pegou".

**Armadilha, do §2.1(c):** o teste precisa de `is_native_mode()` fixado em
`False` **e** de `_uniqs_conectados` com mesa viva. Sem os dois, ele passa verde
sem executar o código que diz medir.

**Custo:** ~45 linhas em `src/`, ~90 em teste. 4 h.
**Carimbo:** **SEM TELA** no código. A **consequência** é visível (o toast da
Lightbar deixa de listar três MACs), e essa frase é da **Onda 7** — vai no lote
de fotos dela, não desta frente.

---

### Z3-4 — `_destinos_do_broadcast` para de nomear quem não recebeu *(B)*

**Arquivo:** `daemon/ipc_handlers.py:1069-1129`, o ramo `:1121-1122`.

**O conserto:** antes de ler `get_output_target_index()`, o método pergunta
`alvo_de_output_ausente()`. Com alvo ausente, devolve `([], [alvo])` — **as duas
listas**, porque o valor **está** guardado: o backend disse `guardado=True` no
mesmo log. Hoje o ramo `indice is None` funde *"Todos"* com *"o alvo sumiu"*, que
é a mesma fusão de dois destinos opostos que o F4 desfez um andar abaixo. **A
ambiguidade não é acidente e está documentada** em
`core/backend_pydualsense.py:5004-5010`; o que falta é o chamador perguntar.

**A mordida:** é a medição do §2.1(c) virada em teste — `trigger.set` sem `uniq`,
alvo fora, exigir `aplicado_em == []` e `guardado_em == [alvo]`. Arranque a
consulta e ele reprova com os três MACs. **Contra-mordida:** com o alvo
presente, `aplicado_em == [alvo]`; com *"Todos"*, a mesa inteira.

**Custo:** ~25 linhas em `src/`, ~60 em teste. 2 h 30.
**Carimbo:** **SEM TELA** (nenhum texto novo; muda o conteúdo de uma lista que a
aba já lê).

---

### Z3-5 — `rumble.set` consulta antes de escrever — e o método órfão ganha chamador *(B)*

**Arquivo:** `daemon/ipc_handlers.py:3850-3919` (a escrita em `:3906` e `:3910`).

**O conserto:** com o alvo fora da mesa, o handler devolve
`{"status": "recusado", "desfecho": …, "motivo": …}` **antes** de qualquer
escrita — a mesma ordem e o mesmo molde da recusa de Modo Nativo que já mora em
`:3885-3905`, três linhas acima. `app/ipc_bridge.py:600` (`rumble_set_checked`)
já lê esse molde: **nenhuma ponte precisa nascer.**

Isto é, ao mesmo tempo, o **chamador de produção** que falta a
`alvo_de_output_ausente` (§2.2/1) — o formato de mordida que a Z2 pede para toda
a família F2.

**A redação, e ela é a única desta frente:** a provisória já está escrita no
docstring do backend (`:2686-2691`) — *"O Controle 2 não está na mesa — nada foi
enviado."* Vai ao olho dela **no lote da Onda 9**, junto das frases de RUM-1 e
RUM-2, não sozinha: uma frase avulsa custa a ela uma decisão inteira.

**A mordida:** alvo armado num MAC fora dos handles, `rumble.set(160, 220)`,
exigir `status == "recusado"` e **zero** escrita no dublê. Hoje ele responde
`ok` e escreve zero — **e é essa a diferença que morde**: o teste separa *"não
fez"* de *"fez e não contou"*. Arranque a consulta e ele volta a dizer `ok`.

**Custo:** ~30 linhas em `src/`, ~50 em teste. 2 h 30.
**Carimbo:** **ESTRUTURAL** — o motivo é texto novo. Vai no lote da Onda 9.

> **Colisão declarada, e a recomendação.** Esta tarefa é a **RUM-2** da
> [RUMBLE-POR-JOGADOR-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md).
> Pela regra da §0.5 (*dona é quem MEXE NO CÓDIGO*), e porque a Z3 roda **antes**
> da Onda 9, **recomendo que a RUM-2 seja marcada como absorvida por esta
> tarefa** e que a Onda 9 fique só com a palavra da tela. Quem rege decide — eu
> não edito o `SPRINT_ORDER.md`. Se a decisão for a inversa, **Z3-5 sai desta
> sprint inteira** em vez de ser feita duas vezes.

---

### Z3-6 — A terceira família: o gatilho entra no teste da invariante *(C)*

**Arquivo:** `tests/unit/test_p4_alvo_ausente_nao_vira_broadcast.py`, classe
`TestOsOutrosSetores` (`:228`).

**O conserto:** o aceite da §0.2 pede *"um teste por família — rumble, gatilho e
lightbar"*. Rumble e lightbar existem; **gatilho não**. `set_trigger`
(`core/backend_pydualsense.py:3486-3500`) passa pelo `_for_each`, logo já está
curado — e é exatamente por isso que um refactor o quebra em silêncio: **está
curado e sem rede**. Entra um `test_o_gatilho_nao_vai_para_os_outros` no molde
literal dos dois vizinhos.

**A mordida:** é a do §2.1(a), estendida — com o `else` histórico devolvido, o
teste novo tem de entrar na lista de vermelhos, que passa de 4 para 5.

**Custo:** ~35 linhas. 1 h.
**Carimbo:** **SEM TELA**.

---

### Z3-7 — As contra-classes da rota do JOGO *(C)*

**Arquivo:** o mesmo de Z3-6.

**O conserto:** o teste do F4 tem duas contra-classes para a rota da **usuária**
(`TestAMiraContinuaMirando`, `TestOBroadcastLegitimoContinua`) e **nenhuma** para
a rota do **jogo**, que é a que Z3-1 muda. Entra uma classe que prova, com o
backend real, que a réplica do jogo continua chegando: `set_rumble_for` no MAC
certo com o controle presente escreve **naquele** motor, e a mesa de um controle
só continua vibrando.

**Por que aqui e não no arquivo de A:** o de A usa dublê de backend
(`_FakeBackend`); este usa o backend **real** com handles de dublê. São réguas
diferentes e o §2.1 desta casa já mostrou que uma delas pode passar verde sem
tocar no código — **duas réguas independentes é o que revela**.

**A mordida:** arranque a ressalva `target_uniq is None` de Z3-1 (isto é, faça a
recusa valer também para quem não pediu endereço) e esta classe tem de reprovar
dizendo que o produto parou de vibrar. Se ela **não** reprovar, ela não é
contra-classe e não vale nada.

**Custo:** ~50 linhas. 1 h 30.
**Carimbo:** **SEM TELA**.

---

### Z3-8 — O portão: `scripts/check_broadcast_proibido.py` *(C, rodada 2)* <!-- ref-externa: arquivo que ESTA sprint propõe criar; a ausência dele é o assunto -->

**Arquivo:** `scripts/check_broadcast_proibido.py` (**novo**). <!-- ref-externa: arquivo que ESTA sprint propõe criar; a ausência dele é o assunto -->

**O conserto:** varredura por AST que reprova **rota de saída que faz fan-out
sem resolver escopo**. A régua, e ela tem de ser dita em uma frase para não
apodrecer: *toda função que escreve output em mais de um destino consulta
`_resolver_escopo` ou `alvo_de_output_ausente` antes, ou está na lista de
exceções deliberadas com justificativa escrita.*

A lista de exceções nasce da batida de C e **cada linha carrega o porquê no
próprio arquivo** — `force_rumble_stop` (`core/backend_pydualsense.py:3589`) é a
primeira, e o docstring dela já explica: *"sair de modo para TODO mundo"*.
Exceção sem justificativa **reprova o portão**, que é o que impede a lista de
virar tapete.

**A mordida — e ela é a razão de Z3-8 estar na rodada 2:**

1. o portão roda contra a árvore curada e passa;
2. `git stash` da leva inteira, o portão roda contra a árvore de **antes** e tem
   de reprovar **nomeando `_registrar_em_todos` e `apply_game_rumble`**;
3. plantar um fan-out novo de mentira num quarto arquivo faz reprovar nomeando
   arquivo, linha e função.

**Se ele não reprovar a árvore de antes, ele não é portão** — e esta casa já
publicou três portões cegos num dia (F9). O relatório de C traz a saída vermelha
literal dos três passos.

**Custo:** ~150 linhas. 4 h.
**Carimbo:** **SEM TELA**.

---

### Z3-9 — Os dois fatos errados, e a dívida que sai do docstring *(C)*

**Arquivo:** `core/backend_pydualsense.py` — `:1462-1463`, `:1849-1850` e
`:2675-2691`. **Só comentário e docstring: nenhuma linha de comportamento.**

**O conserto:** os dois comentários do §2.2/5 afirmam o broadcast que a cura de
23/08 removeu. Pela regra da casa — *fato errado se SUBSTITUI, e sai de TODOS os
lugares onde aparece* — eles são trocados pela afirmação certa, não anotados ao
lado dela. E a **DÍVIDA ABERTA** declarada em `:2675-2691` deixa de ser dívida no
momento em que Z3-5 entra: vira ponteiro para o chamador, com a data.

**A mordida, e ela é diferente das outras porque comentário não tem teste:** a
varredura por `grep` das duas afirmações roda **duas vezes** — a segunda depois
de a leva inteira estar fechada — e não acha nada na segunda. É a disciplina da
Z6, e é o que impede a correção pela metade que deixa as duas versões vivas.

**Custo:** ~15 linhas. 45 min.
**Carimbo:** **SEM TELA**.

---

### O custo, somado

| | |
|---|---|
| Batidas (Z3-0a, 0b, 0c) | ~3 h, os três em paralelo |
| Rodada 1 (Z3-1..Z3-7, Z3-9) | A ~3 h · B ~9 h · C ~3 h 15, em paralelo |
| Rodada 2 (Z3-8) | ~4 h |
| **Caminho crítico** | **~16 h**, mandado por B |

B carrega o dobro dos outros dois. **Se a colisão de Z3-5 for resolvida a favor
da Onda 9** (§5), B cai para ~6 h 30 e o caminho crítico para ~13 h 30.

---

## 6. O que o Bluetooth bloqueia

A trilha de rádio é dela com o assistente, na mesa do specs (**D2**,
[SPRINT_ORDER](../SPRINT_ORDER.md) §0.7). O que **esta frente não pode afirmar**
até a medição existir:

| A frente entrega | Pode afirmar no rádio? |
|---|---|
| *"nada foi enviado"* / *"guardado até o Controle 2 voltar"* | **Sim.** São afirmações **negativas** sobre escrita, e a ausência de destinatário não depende de transporte. É o que torna esta frente segura de entregar antes da trilha de BT |
| `aplicado_em: [MAC]` | **Só até o fio.** Quer dizer *"o desejado está armado e o fio não está mudo"* — o teto de verdade que o `_destinos_do_broadcast` já declara em `:1103-1106`. **Não** quer dizer que o motor girou, que o gatilho endureceu ou que a barra pintou. Para as três famílias o mapa tem furo no rádio: `vibracao.passthrough` é `inferido-do-codigo`, `gatilho.leitura` é `não/não` (nada confirma que o efeito entrou) e a barra tem **duas sprints que se contradizem** (`LIGHTBAR-BT-NEVER-01` × `ROTA-BT-EM-REGIME-01`) |
| a contagem de escritas por gesto | **Não.** *"Com quatro no rádio, quantas escritas de LED por gesto a fila aguenta"* é pergunta aberta da §0.7 — e Z3-3 **muda esse número**, porque hoje o alvo presente recebe duas escritas por gesto. **Quem medir isso mede depois desta frente**, ou mede o produto de ontem |

Nenhuma tarefa desta sprint escreve promessa de transporte na tela. As que
mudariam texto de aba pertencem às Ondas 7, 8 e 9, e é lá que a ressalva de rádio
tem de aparecer.

---

## 7. As dependências

**De quem esta frente depende:**

* **Z2 — o alvo ganha dono próprio.** Dura. A invariante protege *um endereço*;
  enquanto `_edit_target_uniq` tiver um escritor e nove leitores por
  `getattr(..., None)`, a janela pode recusar sobre o alvo errado. **Z3-5 não
  fecha antes da Z2**, e as outras oito podem correr (mexem em daemon e teste,
  não na janela).
* **Z5 — a régua da mesa**, por transitividade: é dela que a Z2 tira o domínio do
  alvo. Esta frente **não** a toca.

**Quem depende desta frente** (copiado da §0.3 do
[SPRINT_ORDER](../SPRINT_ORDER.md) e conferido contra os arquivos):

* **Onda 7 · Lightbar** — depende de Z2 (dura), **Z3**, Z5, Z0, Z6. Z3-3 é o que
  faz o texto de guardado da aba deixar de ser verdade só na janela.
* **Onda 8 · Gatilhos** — depende de Z1 (dura), Z2, **Z3**, Z4 (dura), Z5, Z6.
  Z3-4 e Z3-6 são as dela.
* **Onda 9 · Rumble** — depende de **Z3 (dura)**, mais Onda 1, Z1, Z2, Z5, Z6.
  Z3-1 e Z3-5 são as dela, e a Z3-5 é literalmente a RUM-2 (§5).
* **Onda 4 · No jogo** — não lista Z3 na §0.3, mas o card do rumble do jogo lê o
  par efetivo de `apply_game_rumble`. **Registro a dependência não declarada
  aqui** para que a Onda 4 a confira; não edito a fila.

---

## 8. O aceite

O da §0.2 do [SPRINT_ORDER](../SPRINT_ORDER.md) é o **piso**, palavra por
palavra: *"escolher o Controle 2, REMOVÊ-LO da mesa, disparar o gesto e exigir
**ZERO** escritas — reprovando ao ver 4 quando a cura é arrancada; vale para
rumble, gatilho e lightbar, um teste por família. E: o comando vivo e o que o
perfil guarda têm o MESMO alcance, ou a tela diz que não têm."*

**Como cada metade fecha:**

1. **Zero escritas, nas três famílias.** Rumble e lightbar já têm o teste
   (§2.1(a)); gatilho entra em **Z3-6**. Os três têm de aparecer na lista de
   vermelhos quando o `else` histórico é devolvido — hoje são 4 nomes, depois
   têm de ser 5.
2. **Reprovando ao ver 4.** As mordidas de **Z3-1**, **Z3-3**, **Z3-4** e
   **Z3-5** são exatamente isso, cada uma na sua rota. Mordida não rodada em
   vermelho não conta, e o relatório do agente traz a saída literal.
3. **"O comando vivo e o perfil têm o MESMO alcance, ou a tela diz que não
   têm."** Medido, e a resposta é **não têm, por decisão declarada**:
   `app/draft_config.py:1094-1112` diz, no docstring, que `weak`/`strong`
   *"são o teste de motores e nunca foram do perfil"*, enquanto o comando vivo
   segue o seletor. **Não é defeito a consertar — é divergência a confessar**, e
   quem confessa é a **RUM-1 da Onda 9**. Esta frente fecha a metade que é dela:
   **quando não há destinatário, o comando vivo não vai a lugar nenhum e o valor
   fica guardado no alvo** (Z3-3, Z3-4, Z3-5). Consertar o alcance por peça é a
   **D-G** dela, ~11 h medidas, e **não** entra aqui.

**E o teto, que é o que esta frente acrescenta ao piso:**

4. **`alvo_de_output_ausente` tem chamador de produção.** `grep -rn
   "alvo_de_output_ausente" src/` traz ao menos um endereço fora de docstring.
   Hoje traz **zero** (§2.2/1).
5. **O portão de Z3-8 reprovou a árvore de ANTES**, nomeando
   `_registrar_em_todos` e `apply_game_rumble`. Sem esse vermelho o portão não
   está provado e a frente não fecha.
6. **Nenhuma contra-classe reprovou.** Cura que vira *"nunca manda nada"* é
   defeito novo com cara de conserto.
7. **As duas afirmações caducas não existem mais em lugar nenhum** — a varredura
   de Z3-9 roda duas vezes e a segunda vem vazia.

Os portões da casa, depois do `git add -A`:

```bash
git add -A                                  # os portões não veem arquivo novo
.venv/bin/python -m pytest -q               # UMA vez, no fim, com a leva parada
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
.venv/bin/python scripts/check_broadcast_proibido.py   # o portão novo de Z3-8
```

**Não** roda `retratar_abas.py`: esta frente não tem tela. Quem fotografa é a
onda de aba que a consome.

---

## 9. O que fica aberto, e de quem é

**Dela:**

| item | o que é |
|---|---|
| **A redação de Z3-5** | *"O Controle 2 não está na mesa — nada foi enviado."* — provisória desde 23/08, escrita pelo F4 no docstring do backend. Vai no **lote da Onda 9**, com as frases de RUM-1 e RUM-2, nunca sozinha |
| **D-G — vibração por peça: agora ou na 1.0?** | Esta frente **não** decide. Ela garante que, sem destinatário, ninguém recebe; o alcance por peça continua sendo a E1 da [MESA-CHEIA-05](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md), ~11 h medidas |
| **O `_registrar_em_todos` com alvo escolhido: recusar ou nivelar?** | Z3-3 propõe **respeitar o seletor**, e o argumento é que a rota por-`uniq` da GUI já faz isso desde a R-14. Mas quem chama sem `uniq` hoje é a **CLI**, e talvez `hefesto test lightbar` queira mesmo dizer *"pinte todos"*. **Se quiser, ele tem de dizer isso explicitamente** (`--todos`), não por omissão. A palavra é dela |

**Da bancada dela, e só ela fecha:**

* **Que o Controle 1 fica quieto quando o alvo é o 2 e o 2 caiu** — a prova
  inteira desta frente no plástico, e exige dois controles na mão. **A bancada de
  hoje não serve** (§2.3): as duas réguas do daemon discordam sobre quem está na
  mesa, e é o F6 que a **Z5** cura.
* **E a metade que vale tanto quanto a ida: que o motor PARA.** Regra da casa
  desde 10/08.
* **As três perguntas de rádio do §6**, na trilha dela.

**De outra frente:**

* **Z2** entrega o dono do alvo. Sem ela, Z3-5 recusa sobre um endereço que a
  janela pode ter perdido — e recusa no alvo errado **parece correção**, o que é
  pior que o defeito.
* **Z5** entrega a régua da mesa. Enquanto `daemon.status` e `controller.list`
  discordarem (§2.3), *"o Controle 2 não está na mesa"* é uma afirmação que o
  produto faz sem ter como saber.
* **Onda 7, 8 e 9** entregam a palavra na tela. Esta frente entrega o **fato**;
  sem elas, o produto passa a fazer a coisa certa **e a não contar**, que é o
  padrão que a queixa do Sackboy revelou — *ausência de notícia é lida como
  sucesso*.
