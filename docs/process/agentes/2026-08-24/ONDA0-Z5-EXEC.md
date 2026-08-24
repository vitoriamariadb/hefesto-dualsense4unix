# ONDA0-Z5 — execução única (A1+A2+A3+A4), 24/08/2026

Executor único da árvore `ONDA0-Z5-exec` (branch `voo/ONDA0-Z5-exec`), cobrindo
as tarefas T1..T14 que a sprint dividiu entre quatro agentes conceituais
(A1 daemon, A2 janela, A3 pulso/mapa, A4 dono de cada fato).

## O que mudou

**A1 — a fonte única no daemon**

- `src/hefesto_dualsense4unix/daemon/state_store.py`: novo método
  `clear_controller_state()` — limpa `_controller_state` para `None` (T1).
- `src/hefesto_dualsense4unix/daemon/lifecycle.py`: no ramo
  `if not self.controller.is_connected():`, na BORDA de queda (`was_connected`
  ainda True), chama `store.clear_controller_state()` e `self._last_state =
  None`, uma vez por borda (T1).
- `src/hefesto_dualsense4unix/daemon/ipc_handlers.py`: T2 tentado como a
  sprint propôs (função `mesa_do_daemon()` lendo handles abertos, consumida
  pelos três handlers) — **revertido** após reprovar 3 testes medidos (ver
  "o que a sprint não previu" abaixo). O que ficou: notas explicando por que
  `daemon.status`/`daemon.state_full` continuam lendo `snap.controller`/
  `_last_state` (T1 já os corrige) e por que isso é deliberado. Também: nota
  substituindo o fato errado sobre `active_profile.txt` (T14, ver abaixo).
- Testes: `tests/unit/test_daemon_lifecycle.py` (+47 linhas, 1 teste novo),
  `tests/unit/test_tres_rotas_concordam_apos_a_queda.py` (novo, T2/T3
  revisado), `tests/unit/test_portao_connected_nao_se_escreve_a_mao.py`
  (novo, T4 — portão AST).

**A2 — a régua única na janela**

- `src/hefesto_dualsense4unix/app/mesa.py` (NOVO): `ContagemDeControles`,
  `contagem_de_controles`, `controles_conectados`, `texto_de_contagem` —
  migrados de `status_actions.py`, sem GTK, sem IPC (T5).
- `src/hefesto_dualsense4unix/app/actions/status_actions.py`: os quatro nomes
  viram espelho de `app.mesa` (`ContagemDeControles = mesa.ContagemDeControles`
  etc.); `_render_online` e `_render_slow_state` param de usar
  `state["connected"]` (topo) como PORTÃO — passam a usar a MESA
  (`conectados`/`_connected_controllers`) quando o daemon publica o bloco
  `controllers`, com fallback para a regra antiga (compat, daemon sem o
  bloco) (T6, [ESTRUTURAL]).
- `src/hefesto_dualsense4unix/app/compact_window.py`: mesmo padrão — usa
  `app.mesa.controles_conectados` quando `conhece_a_mesa` (T7, [COSMÉTICA]).
- Testes novos: `tests/unit/test_app_mesa_dono_unico.py` (T5),
  `tests/unit/test_render_online_gate_e_a_mesa.py` (T6),
  `tests/unit/test_compact_window_bebe_da_mesa.py` (T7).

**A3 — o pulso e o mapa**

- `src/hefesto_dualsense4unix/app/app.py`: nova `ClassVar`
  `_ISENTAS_DO_REFRESH_POR_ABA` (duas entradas: `tab_status_box`,
  `tab_no_jogo_box`, cada uma com o motivo escrito) (T8). O laço de
  `_on_notebook_switch_page` ganhou `try`/`except` por refresher, logando
  `refresh_por_aba_levantou` com aba+refresher+erro (T9).
- `tests/unit/test_notebook_switch_page.py`: dois testes novos para T8
  (glade→mapa-ou-isenção, e a mordida nomeando `tab_lightbar_box`), dois para
  T9 (o segundo refresher roda mesmo com o primeiro levantando; e a mordida
  que prova que sem o try/except ele não rodaria).

**A4 — o dono declarado de cada fato**

- `src/hefesto_dualsense4unix/utils/session.py`: fato substituído em duas
  ocorrências — o cabeçalho e `read_active_marker()` não prometem mais um
  consumidor CLI que não existe; passam a citar `cli/cmd_profile.py:402`. Nota
  nova no topo nomeando as três rotas do perfil ativo (T13, PROVISÓRIO — D-N
  em aberto).
- `src/hefesto_dualsense4unix/daemon/ipc_handlers.py`: mesma substituição, na
  docstring de `_handle_profile_switch` (T14).
- `src/hefesto_dualsense4unix/daemon/state_store.py`: docstring de
  `active_profile` nomeada como "em vigor agora", distinta das duas rotas em
  disco (T13, PROVISÓRIO).
- `src/hefesto_dualsense4unix/cli/cmd_status.py`: a linha `active_profile` da
  tabela de `status` ganha o rótulo `active_profile (em vigor agora)` (T13,
  PROVISÓRIO — marcado no fonte, não decide D-N).
- Testes novos: `tests/unit/test_marker_de_perfil_nao_promete_cli_que_nao_existe.py`
  (T14 — a régua do grep, com mordida auto-contida), `tests/unit/test_cmd_status_rotulo_do_perfil_ativo.py`
  (T13).
- **T11 (censo das 158 chaves) e T12 (portão de chave nova sem leitor): NÃO
  feitos.** Ver "o que sobrou para o próximo".

## A MORDIDA — por tarefa, com a saída da reprovação

Todas seguem o protocolo: escrever, arrancar, rodar e VER reprovar, devolver,
rodar e ver passar. Colo só a reprovação (a aprovação já está confirmada pela
suíte verde reportada abaixo).

**T1** (`test_daemon_lifecycle.py::test_borda_de_queda_limpa_o_estado_publicado`),
arrancando o `if was_connected: ...` (trocado por `if False:`):

```
AssertionError: o store guardou a última leitura boa em vez de limpar na
queda — é a mentira medida na ONDA0-Z5 (bt/75% sobrevivendo à desconexão)
assert ControllerState(battery_pct=80, ..., connected=True, transport='bt', ...) is None
```

**T2/T3** (`test_tres_rotas_concordam_apos_a_queda.py`) — este arquivo prova o
estado FINAL (T1 sozinho); a mordida do T2-como-a-sprint-propôs está descrita
abaixo, em "o que a sprint não previu" (reprovou 3 testes JÁ existentes, que
são a mordida real desta descoberta).

**T4** (`test_portao_connected_nao_se_escreve_a_mao.py`), fonte sintética com
um handler novo escrevendo `"connected": True` fora da lista:

```
AssertionError: daemon.status
assert True is False
```
(este é o teste embutido `test_mordida_um_quarto_handler_publicando_connected_reprova_nomeando`,
que já roda sempre — a régua reprova por padrão contra fonte fabricada.)

**T5** (`test_app_mesa_dono_unico.py`), com `app/mesa.py` importando `gi`/GTK:

```
AssertionError: stdout='' stderr='...AssertionError: app.mesa importou
gi/GTK — não é dono, é atalho'
assert 1 == 0
```

**T6** (`test_render_online_gate_e_a_mesa.py`), voltando o gate para
`state.get("connected")` puro (o payload exato medido em 23/08 — topo `true`/
`bt`, `controllers: []`):

```
AssertionError: cabeçalho mentiu 'conectado' com mesa vazia:
'<span foreground="#50fa7b">&#9679; Conectado Via BT</span>'
```
(e a segunda variante, isolando só `_render_slow_state`:)
```
AssertionError: assert 'Conectado' == 'Desconectado'
```

**T7** (`test_compact_window_bebe_da_mesa.py`), mesma reversão em
`compact_window.py`:

```
AssertionError: janela compacta mentiu 'conectado' com mesa vazia:
'<span foreground="#50fa7b">&#9679; BT · vitoria</span>'
```

**T8** (`test_notebook_switch_page.py::test_toda_pagina_do_notebook_esta_no_mapa_ou_isenta`),
esvaziando `_ISENTAS_DO_REFRESH_POR_ABA`:

```
AssertionError: páginas do notebook fora do mapa de refresh E fora da lista
de isenção (sem motivo escrito): ['tab_status_box', 'tab_no_jogo_box']. ...
```

**T9** (`test_notebook_switch_page.py::test_refresher_que_levanta_nao_cala_o_seguinte_da_mesma_aba`),
voltando o laço ao formato sem `try`/`except`:

```
RuntimeError: refresher quebrado de propósito (T9)
```
(propaga e derruba o teste — o segundo refresher nunca roda.)

**T13** (`test_cmd_status_rotulo_do_perfil_ativo.py`), esvaziando
`_ROTULOS_DE_CAMPO`:

```
AssertionError: ... assert 'active_profile (em vigor agora)' in '...
active_profile │ vitoria │...'
```

**T14** (`test_marker_de_perfil_nao_promete_cli_que_nao_existe.py`) — mordida
auto-contida: o próprio teste reintroduz a string "profile current" em
`session.py`, prova que a régua acusa, e devolve o arquivo. Rodou verde nas
duas pontas (régua limpa hoje; régua acusa quando contaminada de propósito).

## Testes rodados e resultado

Escopo local pedido pelo despacho:

```
.venv/bin/ruff check src/ tests/      -> All checks passed!
.venv/bin/mypy src/hefesto_dualsense4unix  -> Success: no issues found in 209 source files
python3 scripts/validar-acentuacao.py --all -> silencioso, exit 0
python3 scripts/validar-glifos.py --all      -> silencioso, exit 0
```

Rede de regressão (91 arquivos de teste relacionados aos módulos tocados —
`daemon/ipc_handlers.py`, `daemon/lifecycle.py`, `daemon/state_store.py`,
`app/actions/status_actions.py`, `app/app.py`, `app/compact_window.py`,
`app/mesa.py`, `cli/cmd_status.py`, `utils/session.py` — mais os 9 arquivos
novos/alterados de teste):

```
1783 passed, 2 skipped, 1 failed in 95.23s
```

O único vermelho é **pré-existente e não relacionado**:
`portao_a_casa_sabe_e_o_produto_nao_faz.py::TestTodaPromessaPublicaTemCaminho::test_toda_promessa_solta_esta_classificada`,
acusando `app/ipc_bridge.py::machine_declare` e `utils/maquina.py::gravar_maquina`
— dois arquivos que esta leva NUNCA tocou (`git diff --stat` confirma). É
varredura de toda `src/`, então pega dívida de fora do meu escopo. Não
consertei — não é meu arquivo e a Z5 não tem posse ali.

Não rodei a suíte inteira (`pytest` sem alvo) — proibido pelo protocolo, cria
nós uinput reais.

## O que NÃO fez e por quê

- **T11 (censo das 158 chaves)**: exigiria reconstruir a régua "anda o
  payload vivo do state_full em profundidade e procura cada nome de chave em
  `app/`" do zero, validada contra os 5 casos já conferidos à mão na sprint
  (`controles_sem_driver` deve ser absolvida, `mascara_divergente` deve ser
  acusada). O tempo que sobrava não dava para fazer isso com o rigor que a
  sprint exige ("não aplique a régua em lote"; "apagar por resultado de régua
  frouxa é como se apaga cura viva"). Uma régua malfeita aqui seria pior que
  nenhuma — o próprio padrão que a AUDITORIA-DE-PERDA-01 já puniu três vezes.
- **T12 (portão de chave nova sem leitor)**: depende do inventário do T11
  como lista-base declarada. Sem T11, T12 não tem o que consumir.
- **T13 (decisão D-N)**: fiz só a metade que a sprint autoriza sem esperar —
  NOMEAR o que cada rota responde, no fonte e na CLI, marcado PROVISÓRIO. Não
  decidi qual das três rotas "vence" quando divergem — isso é dela.
- **T10**: a sprint já marcava como DESENHO/[ESTRUTURAL] e "NÃO VERIFICADO"
  (custo estimado, sem medição de quantos leitores precisam de inscrição). Não
  toquei.
- Não fotografei a interface (`retratar_abas.py`) — proibido para o executor,
  é do coordenador depois da leva (R4).
- Não toquei a bancada física — nenhuma tarefa exigiu.

## O que você notou que a sprint não previu

**T2, como a sprint literalmente propôs (uma função `mesa_do_daemon()` lendo
handles abertos, substituindo a leitura de `_last_state`/`snap.controller` em
`daemon.status` E `daemon.state_full`), CONFLITA com um desenho medido e
testado que a sprint não tinha visto.**

Implementei `mesa_do_daemon()` exatamente como a T2 descreveu e troquei as
duas leituras. Rodando a rede de regressão, três testes JÁ EXISTENTES
reprovaram:

1. `test_conserto_1_7_o_ramo_sem_mesa_e_o_plural_do_doctor.py::TestORamoDaMesaDesconhecida::test_a_mesa_conhecida_manda_mais_que_o_transporte_do_topo`
2. o vizinho dele, `test_lista_sem_ninguem_conectado_volta_para_a_regra_antiga`
3. `test_ipc_state_full_live.py::test_state_full_neutro_quando_ambos_none`

O motivo: `state_full`'s campo `transport`/`connected` do TOPO tem propósito
PRÓPRIO, medido em 14/08 (CONSERTO-1.7) — é a leitura do PRIMÁRIO no último
tick do poll (`daemon._last_state`), e PODE DIVERGIR de propósito da lista
`controllers` (que vem dos handles abertos, via `describe_controllers`). A
lógica `native_bt_fragil` (o aviso de Bluetooth frágil no Modo Nativo) usa
EXATAMENTE essa divergência: quando a mesa é conhecida, ela ignora o topo de
propósito; quando não é, cai na regra antiga que só o topo sustenta. Colapsar
as duas fontes na mesma derivação (o que a T2 pedia) apaga essa distinção sem
nota — e o `test_ipc_state_full_live.py` mostrou o segundo ângulo: o
`_fc` do fixture está FISICAMENTE conectado, mas o teste espera
`connected: false` porque `daemon._last_state` e o store estão limpos — ou
seja, `state_full` DELIBERADAMENTE não responde "o hardware está plugado
agora?", responde "o que o daemon leu da última vez?".

**Reverti a T2 como proposta.** O que ficou: T1 sozinho (a escrita na borda de
queda) já satisfaz o aceite §9.1 da sprint — as três rotas concordam com mesa
vazia — porque `daemon.status` e `state_full` JÁ tratavam `controller=None`/
`state=None` corretamente; só nunca recebiam esse `None` na hora certa. Isso
está provado em `test_tres_rotas_concordam_apos_a_queda.py`, com uma queda
REAL via `Daemon.run()` + `IpcServer` de verdade, não um estado montado à
mão. Documentei a reversão em nota datada nos dois handlers, para o próximo
agente não tentar a mesma consolidação sem ver os três testes que ela
derruba.

**Segundo achado, menor**: o `app/tray.py` já lia só a lista viva (linhas
430-434, como a sprint registrou) — mas `app/compact_window.py` misturava as
duas fontes do MESMO jeito que `status_actions.py`, e a sprint só tinha
medido a metade fácil (`connected` do topo como portão). Curado no T7 com o
mesmo padrão de `conhece_a_mesa` do T6.

**Terceiro achado**: a sprint (§2.6) já sabia que os dois testes de
`test_notebook_switch_page.py` "olham para o outro lado" (mapa→glade,
mapa→mapa) e não pegam aba REMOVIDA do mapa. Confirmado — e o T8 fecha
exatamente esse buraco, com uma isenção NOMEADA em vez de uma lista implícita.
