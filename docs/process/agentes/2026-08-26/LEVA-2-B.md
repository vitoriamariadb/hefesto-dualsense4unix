# LEVA-2-B — a volta do controle secundário traz o áudio, e a queda fala no journal

**26/08/2026.** Frente B da LEVA 2. Nasce da fusão BQ-4 + RES-1: as duas abrem
`core/backend_pydualsense.py` na mesma borda — a de UM controle caindo enquanto
outro segue de pé.

**Os dois defeitos existiam.** Foram medidos antes de curados, e a medição está
num teste (`test_o_agregado_diz_sim_enquanto_o_alvo_diz_quem_caiu`).

## O que mudou

Dois arquivos de produto, dois de teste — a posse declarada, e nada fora dela.

### 1. O som volta no controle que voltou, não no primário

`reapply_speaker_after_connect(daemon)` **sem `uniq`** cai no `_handle_for(None)`
do backend, que é *o primário e mais ninguém*. Os dois chamadores passavam sem
ele:

- `daemon/connection.py::connect_with_retry` — a reabertura do handle depois de
  um erro de leitura;
- `daemon/connection.py::reconnect_loop` — a transição `offline→online` do probe.

Quando o Controle 2 caía no rádio e voltava, quem recebia o volume e a rota
configuradas era o **Controle 1**, que nem tinha perdido a posse dos bytes; o
que voltou ficava com o volume do firmware, calado. É o sintoma *"a config que
eu deixo nunca é respeitada"*, do lado do som.

Os dois chamadores passaram a usar `reaplicar_som_em_todos_os_alvos(daemon)`,
que reaplica **uma vez por controle da mesa**, cada um pelo endereço dele.

### 2. A queda de um secundário deixou de ser silêncio

`PyDualSenseController.is_connected()` é `any(...)` sobre os handles. Com dois
na mesa, a queda de um **não muda a resposta**: a transição `online→offline` do
`reconnect_loop` (o ramo que publica `CONTROLLER_DISCONNECTED`) nunca dispara, e
o controle some sem um evento sequer.

- **Novo em `backend_pydualsense.py`: `alvos_conectados()`** — `{key: uniq}` dos
  controles conectados agora. Pega a queda nas DUAS formas possíveis: o handle
  podado de `_handles` (`_close_handles`) e o handle que fica no mapa com
  `connected=False`. Só getattrs sob o `_io_lock`, sem HID I/O — diferente do
  `describe_controllers()`, não lê bateria nem transporte.
- **Novo em `connection.py`: `alvos_conectados_de` / `anunciar_bordas_por_alvo`**
  e um terceiro ramo no `reconnect_loop`, que só roda **quando o agregado não se
  mexeu**. Os dois ramos históricos continuam donos das bordas deles — nada é
  duplicado.

A queda vira `controller_disconnected` com `reason="alvo_sumiu"` e o `uniq` de
quem caiu; a volta reaplica o som **daquele** controle.

Duas coisas que ele deliberadamente **não** faz, e cada uma tem razão escrita no
código:

- **não chama `registrar_queda_da_bateria`** — aquela é agregada (escreve a
  última carga de TODOS) e o `DiarioDaBateria` já escreve a queda deste controle
  sozinho, pelo caminho `sumiu_do_backend`. As duas dariam duas linhas contando
  a mesma coisa;
- **não notifica o desktop** — *"controle desconectado"* numa mesa em que três
  seguem de pé leria como a mesa inteira ter caído. Frase nova de tela é decisão
  dela (ver *o que sobrou*).

`alvos_conectados_de` devolve `None`, e nunca `{}`, quando o backend não tem o
método (`FakeController`, dublês, backend legado). **`None` é "não pergunte por
alvo"; `{}` seria "olhei e não há ninguém"** — confundir os dois publicaria uma
queda falsa a cada tique em toda instalação com backend enxuto. Há teste para
isso.

### 3. Os três desfechos da reserva do posto falam no nível padrão

`primario_deposto_reservado` (`_reservar_o_posto_de_primario`) e
`primario_reserva_caducou` (`_posto_reservado_de_volta`) eram `logger.debug`; o
nível padrão do produto é **INFO** (`utils/logging_config.py`). Só
`primario_retomou_o_posto` — o desfecho **bem-sucedido** — aparecia no journal
dela. Perguntar a esse journal com que frequência o posto se perde é contar
apenas as amostras que confirmam a resposta desejada.

Os dois subiram para `info`, com a **mesma chave de correlação** da retomada
(`key=`), que é o que casa reserva → caducou/retomou.

**`PRIMARIO_RESERVA_SEC` não foi tocada** — o valor só se decide depois da
bancada, e a bancada é dela (`RESERVA-DO-POSTO-01` §5). A posse aqui foi de
LINHA: os dois `logger.debug` e nada mais.

## Qual mordida prova

Três curas, três arrancadas, as saídas coladas.

### Arrancada 1 — o `uniq` sai das duas chamadas

```
E  AssertionError: o volume do Controle 2 foi parar em ['o primário (uniq=None)'] — o esperado era só aabbcc0000f2
E  AssertionError: a reconexão só reaplicou em [None] — os dois controles perderam a posse dos bytes de áudio, os dois precisam do volume de volta
E  AssertionError: a volta do Controle 2 reaplicou o som em [None] — o volume dela tinha de voltar no controle que voltou, e em nenhum outro
FAILED tests/unit/test_borda_de_queda_01_audio_por_mac.py::test_a_volta_do_secundario_reaplica_o_volume_dele
FAILED tests/unit/test_borda_de_queda_01_audio_por_mac.py::test_a_reconexao_reaplica_o_som_em_cada_controle
FAILED tests/unit/test_borda_de_queda_01_audio_por_mac.py::test_o_laco_ve_a_queda_e_a_volta_que_o_agregado_escondia
3 failed, 6 passed in 0.28s
```

### Arrancada 2 — o ramo por alvo sai do `reconnect_loop`

```
E  AssertionError: o laço publicou [] — esperava-se UMA queda, a do Controle 2
E  assert [] == ['aabbcc0000f2']
FAILED tests/unit/test_borda_de_queda_01_audio_por_mac.py::test_o_laco_ve_a_queda_e_a_volta_que_o_agregado_escondia
1 failed, 8 passed in 0.29s
```

Esta é a mordida do laço INTEIRO: `reconnect_loop` rodando de verdade, com o
Controle 1 de pé o tempo todo — o agregado nunca se mexe, e é por isso que os
dois ramos históricos ficam calados.

### Arrancada 3 — os dois eventos voltam a `debug`

```
E  AssertionError: no nível padrão (INFO) o journal não guardou ['primario_deposto_reservado', 'primario_reserva_caducou'] — só ['primario_retomou_o_posto'] aparece, e medir a reserva com esse instrumento é contar apenas as amostras que confirmam o resultado bom
E  AssertionError: assert 1 == 4
FAILED tests/unit/test_reserva_do_posto_01_os_eventos_falam.py::test_a_queda_aparece_no_nivel_padrao
FAILED tests/unit/test_reserva_do_posto_01_os_eventos_falam.py::test_os_tres_eventos_correlacionam_pelo_mesmo_endereco
2 failed, 1 passed in 0.39s
```

### Com as curas devolvidas

```
$ .venv/bin/python -m pytest tests/unit/test_borda_de_queda_01_audio_por_mac.py \
      tests/unit/test_reserva_do_posto_01_os_eventos_falam.py -q
............                                                             [100%]
12 passed in 0.40s
```

### A régua da régua

`test_a_regua_recusa_o_que_esta_abaixo_do_padrao` escreve um `info` e um `debug`
no mesmo buffer e exige que só o primeiro apareça. Sem ela, um buffer que
capturasse TUDO faria os três eventos aparecerem mesmo em `debug`, e a régua
diria "verde" para o defeito.

### O instrumento que estragava a medição do vizinho — e a cicatriz

A **primeira** versão dessa régua chamava `logging_config.reset_for_tests()` +
`configure_logging(stream=buf)`. Isso troca a **lista** de processadores do
structlog por outra. O `structlog.testing.capture_logs()` — que outros testes
desta suíte usam — mexe naquela lista **no lugar**, de propósito, para alcançar
os loggers já cacheados (`cache_logger_on_first_use=True`); com a lista trocada
ele passa a mexer numa lista que ninguém mais lê.

Resultado medido: `test_session_persist.py::test_boot_marker_orfao_cai_no_session_json`
reprovava **a dez arquivos de distância**, e passava sozinho. A régua atual não
reconfigura nada: ela pega o `wrapper_class` de `structlog.get_config()` — o
mesmo objeto que o `configure_logging` do produto instalou — e só troca o
destino da escrita. **O filtro de nível medido continua sendo o do produto.**

```
$ pytest <os 16 arquivos do lote, com o meu no meio> -q
203 passed in 20.10s
```

## O que NÃO verifiquei

- **Nada foi medido no aparelho.** A frente é `bancada: false` e não encostei em
  hidraw, `btmon`, daemon vivo ou controle físico. Que o volume REALMENTE chegue
  ao Controle 2 pelo rádio depois desta mudança é **inferência do código**
  (`_handle_for(uniq)` resolve o handle por MAC), não medição.
- **O `uniq` de uma mesa com key por path.** Quando o backend cai no fallback de
  path (`/dev/hidrawN`), `_key_to_uniq` devolve `None` e a reaplicação volta a
  mirar o primário. Está coberto por teste como COMPORTAMENTO, mas não sei
  quantas mesas reais caem nesse fallback nem por quanto tempo.
- **A ordem em que as duas bordas chegam.** O `poll_loop` também detecta queda
  (via exceção em `read_state`) e dispara `reconnect()`. Não medi se, numa queda
  de secundário, ele chega antes do probe e muda o que o meu ramo vê. O ramo
  agregado tem essa nota desde 2026-07; o meu não foi exercido contra ela.
- **Quantas linhas por hora os dois eventos que subiram para INFO acrescentam ao
  journal dela.** Num rádio instável a reserva pode ser frequente. Se virar
  ruído, quem medir tem o número; eu não tenho.
- **O `describe_controllers()` como alternativa.** Preferi um método novo e mais
  barato a reusar aquele; não medi a diferença de custo, só a evitei por
  construção (ele lê bateria e transporte por handle).
- **A suíte inteira.** Rodei o meu escopo e os 90 arquivos de teste que citam
  `backend_pydualsense` ou `daemon.connection`, em quatro lotes: 368 + 351 +
  (406 + 1 skip + 2 xfail) + 359, todos verdes. O resto da suíte é de quem
  coordena.

## O que sobrou para o próximo

- **A frase de tela da queda por controle — decisão dela.** Hoje a queda de um
  secundário NÃO notifica o desktop, de propósito: a frase existente é
  `notify_controller_disconnected("probe offline")`, e ela leria como a mesa
  inteira ter caído. Se ela quiser aviso por controle, é frase nova, e frase
  nova sai do léxico que já existe. Não escrevi nenhuma.
- **Os outros consumidores de `is_connected()`.** Curei o `reconnect_loop`
  porque é o meu arquivo. `is_connected()` é `any(...)` para todo mundo, e há
  chamadores fora da minha posse (`daemon/lifecycle.py`, handlers IPC) que podem
  estar respondendo pelo agregado onde a pergunta é por controle. **Não olhei um
  por um** — é censo, não conserto, e `lifecycle.py` é da L2-A.
- **`PRIMARIO_RESERVA_SEC` continua em 30,0 s e espera a bancada dela.** Os
  eventos agora aparecem no journal, que era a peça que faltava para medir. A
  medição é dela.
- **A ponte para o card da GUI.** O evento novo carrega o `uniq`; nada na
  interface o consome ainda. Fora da posse.

## Portões

`bash scripts/portoes.sh --rapido` — **19 portões, TODOS VERDES**. Nenhum estava
vermelho antes.

`pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
tests/unit/test_portao_a_lista_de_portoes_e_uma_so.py -q` — 44 passed. Não
editei nenhuma entrada do portão de lápides: os símbolos que criei nasceram com
chamador, e nenhum símbolo sumiu.

Nenhuma linha acrescentada a `scripts/portoes.sh` nem ao `ci.yml`; o
`retratar_abas.py` não foi executado; a bancada não foi tocada.
