# QUATRO-MICROFONES-01 · E3 — o censo, a arbitragem na porta e o portão 5.b

25/08/2026, madrugada. Árvore `hefesto-voo/QUATRO-MICROFONES-E3`, branch
`voo/QUATRO-MICROFONES-E3`.

A sprint é `bancada: true` e a bancada está impossível: `/sys/class/bluetooth/`
vazio desde as 02h36. **O ensaio dos quatro microfones continua DELA e não foi
tentado.** O que saiu é o que estava embaixo dele, na ordem que quem coordena
pediu.

## O que mudou

### 1. O censo — e ele derrubou a premissa do briefing

**FATO SUBSTITUÍDO.** O briefing (e o `SPRINT_ORDER.md`) dizem que
*"`bt_mic_enabled` é lido por TRÊS lugares e escrito por NENHUM"*. **Isso
descreve 22/08.** A entrega de 23/08 derrubou o campo:

```
grep -rn "bt_mic_enabled" src/   ->  DUAS ocorrências, as duas em NOTA DATADA
  daemon/subsystems/bt_mic.py:41            explica por que o `bool` saiu
  app/actions/config/secao_controles.py:383 idem
```

Não há declaração, não há leitor, não há escritor. **O campo não existe.** O
gate de hoje é outro, e tem dois escritores:

| papel | onde, com linha |
|---|---|
| **o valor** | `src/hefesto_dualsense4unix/utils/maquina.py:462` — `ControleDeclarado.microfone: bool \| None` |
| **escritor 1/2** | `src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:1017` — `_ao_alternar_o_microfone` → `_ao_declarar` (rascunho; quem grava é o "Aplicar" do rodapé) |
| **escritor 2/2** | `src/hefesto_dualsense4unix/daemon/ipc_handlers.py:4941` — `_handle_machine_declare`: grava o `maquina.json`, rebinda `daemon._maquina` e chama `reconciliar_bt_mic` (`:5034`) |
| leitor | `src/hefesto_dualsense4unix/daemon/lifecycle.py:804` — fia `DaemonConfig.bt_mic_uniqs = lambda: uniqs_declarados(self._maquina)` |
| leitor | `src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py:142` `uniqs_pedidos` · `:175` `alvos()` — o filtro do "por controle" |
| leitor | `src/hefesto_dualsense4unix/daemon/lifecycle.py:3658` `_start_bt_mic` (`is_enabled`) · `:3702` `reconciliar_bt_mic` |
| leitor | `src/hefesto_dualsense4unix/daemon/ipc_handlers.py:3047` — publica `bt_mic.{enabled,running,uniqs}` |
| leitor | `src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py:825` e `secao_orcamento.py:660` — a barra do rádio |

**Portanto a `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ` desta sprint está FECHADA desde
23/08.** O que continua aberto é o preço que ninguém pôs na mesa — e é dele que
tratam os itens 2 e 3.

### 2. `src/hefesto_dualsense4unix/cli/cmd_mic.py` — a arbitragem na porta

**O achado, medido no fonte:** a ponte de microfone tem **duas portas de
produção**, em **dois processos**, e nenhuma sabia da outra.

```
cli/cmd_mic.py::_mic_bt                     -> GerenciadorMicBluetooth()
daemon/subsystems/bt_mic.py::BtMicSubsystem -> GerenciadorMicBluetooth()
```

Cada `PonteMicBluetooth` carrega o **próprio** contador de sequência do `0x32`.
As duas no mesmo controle reproduzem exatamente o quadro que o estudo
`2026-08-16-O-PS-PRESO` nomeou como causa provável de um DualSense travado —
**dois donos da sequência do `0x32`** — e desta vez sem kernel nenhum no meio,
feito pelo próprio produto contra si.

A cura não inventa dado nenhum: usa `daemon.state_full` → `bt_mic.uniqs`, a
chave que a **E2 desta mesma sprint** publica desde 23/08. `mic bt` lê a lista e
**não sobe ponte em cima de quem já tem uma** — na entrada e a cada volta do
laço, para o caso de o daemon subir a dele no meio da sessão.

Três respostas, e a do meio é a que importa:

| o que o daemon diz | a régua conclui | `mic bt` faz |
|---|---|---|
| offline | ninguém do produto segura ponte | sobe, como sempre foi |
| `bt_mic.uniqs: [...]` | sei exatamente quem | pula os tomados, sobe nos livres |
| `running: true` sem `uniqs`, ou sem o bloco | **não sei** | RECUSA (rc=1), dizendo o quê, por quê e o que fazer |

A terceira linha é a lição do `O-PRODUTO-RESPONDE-PELO-TRANSPORTE`: **ausência
de notícia não é notícia boa.** É o daemon de 22/08, que publicava duas chaves —
e "o daemon vivo é mais velho que o código" é situação corrente nesta casa.

**O LIMITE, DECLARADO:** isto fecha o sentido **CLI → daemon**, e só ele. O
daemon não sabe que este processo existe, então uma ponte que ELE suba depois
ainda passa por cima. Fechar os dois sentidos **é o 5.a** — a arbitragem do nó
no broker, que não existe.

### 3. `tests/unit/test_portao_a_ponte_do_mic_espera_a_arbitragem.py` (novo) — o portão 5.b

O `2026-08-16-O-QUE-FICOU-ABERTO-01` tabelou treze portões e escreveu embaixo:
*"Nenhum deles existe hoje"*. Este é o **5.b**.

**Ele NÃO reprova a entrega de 22/08**, e isso é decisão consciente: manter o
interruptor por controle é dela, e portão vermelho todo dia é portão que alguém
apaga na segunda-feira — o argumento é do próprio
`portao_a_casa_sabe_e_o_produto_nao_faz`. Ele **congela o tamanho da dívida**.

Três medições, nenhuma delas uma frase:

1. **a arbitragem existe?** medida no COMPORTAMENTO do `BrokerState` **real** —
   duas conexões pedem `open` do mesmo nó, e hoje as duas são servidas com um fd
   cru indistinguível. A régua sabe dizer "existe" também: exercida contra um
   dublê que RECUSA o segundo pedido (armadilha **A2**);
2. **quantas portas sobem a ponte?** AST sobre `src/`, contando só quem importa
   um nome que ABRE o hidraw e escreve `0x32` — as três flags de status que o
   `backend_pydualsense.py:3653` importa não contam. Igualdade, não continência:
   porta declarada que sumiu também reprova;
3. **a janela alcança a ponte?** nenhum módulo de `app/` pode importar um desses
   nomes. É a promessa que a docstring de `_ao_alternar_o_microfone` faz —
   *"o processo da janela não pode ter esse gesto ao alcance de um clique"* — e
   que até hoje ninguém cobrava.

O arquivo começa com `test_` de propósito: `portao_*.py` só roda quando alguém o
passa na linha de comando, e `scripts/portoes.sh` é de outra frente nesta leva.

### 4. `docs/.../QUATRO-MICROFONES-01...md` — a nota datada e o `posse:`

A nota de entrega de 25/08 no fim do documento, o ponteiro para o portão dentro
da nota de 23/08, e o frontmatter: `posse:` apontava para
`src/hefesto_dualsense4unix/integrations/bt_mic.py`, **que não existe** (o módulo
é `integrations/dualsense_bt_audio.py`; o subsystem é
`daemon/subsystems/bt_mic.py`, que eu não toquei e não reivindico). `cria:`
estava vazio e ganhou os dois arquivos de teste.

## As mordidas

**Mordida 1 — a arbitragem da porta.** Arrancado o bloco **por LINHA**
(`_mic_bt`: o teste contra `_DAEMON_VELHO`, o `_livres(...)`/`if not livres:`, e
o `reconciliar(alvos)` devolvido a `reconciliar()`), `__pycache__` limpo:

```
4 failed, 5 passed
  test_recusa_quando_o_daemon_nao_diz_de_quem_sao_as_pontes  AssertionError
  test_recusa_quando_todo_controle_ja_tem_ponte_do_daemon    AssertionError
  test_sobe_so_no_controle_que_o_daemon_nao_segura           AssertionError
  test_sem_daemon_o_caminho_a_mao_continua_livre             AssertionError
```

Devolvida: **9 passed**. As quatro reprovaram por `AssertionError`, nunca por
`AttributeError` — a cura foi recortada por linha, não por âncora.

**Mordida 2 — o portão, a porta nova.** Criado
`src/hefesto_dualsense4unix/app/_porta_de_mordida.py` importando
`GerenciadorMicBluetooth`:

```
2 failed, 3 passed
  test_a_ponte_nao_ganhou_porta_nova    AssertionError: ... app/_porta_de_mordida.py
  test_a_janela_nao_alcanca_a_ponte     AssertionError: ... app/_porta_de_mordida.py
```

Apagado: **5 passed**.

**Mordida 3 — o portão, a arbitragem chegando.** Inserida **por LINHA** em
`broker/hidraw_broker.py::_cmd_open` uma arbitragem postiça (um `dict` de dono
por nó, recusando a segunda conexão):

```
1 failed, 4 passed
  test_a_arbitragem_do_no_ainda_nao_existe   assert True is False
```

Revertido do backup: **5 passed**. Esta é a mordida que importa: ela prova que a
medição 1 está fiada ao **broker real**, e não a um dublê que sempre diz não.

## Os portões

`git add -A && bash scripts/portoes.sh` → **TODOS VERDES — 24 portões**
(`casa-sabe` 57,6 s, `acentuacao` 43,3 s, `mypy` 4,9 s).

Escopo de pytest rodado, e só ele: os sete arquivos de teste do microfone mais os
dois novos — **70 passed**. A suíte inteira é de quem coordena.

## O que ficou ABERTO

* **O 5.a** — arbitrar o nó no `broker/hidraw_broker.py`. Não é meu arquivo, e
  não é obra para uma madrugada sem bancada. **É decisão dela:** arbitrar, ou
  aceitar o risco sabendo qual é. O preço está na mesa desde 23/08 e agora tem
  régua que não deixa a dívida crescer.
* **O ensaio dos quatro microfones (E3 propriamente dita)** — precisa dos três
  adaptadores de volta no barramento, do daemon reiniciado sobre a árvore
  fechada, e dela na sala.
* **`docs/process/SPRINT_ORDER.md:760` e `:970`** — carregam no PRESENTE o fato
  que a medição derrubou. Não editei: o índice é de quem coordena. O texto de
  troca, para as duas linhas:

  > de: `` `bt_mic_enabled` é lido por três lugares e escrito por nenhum``
  > para: `E1/E2 entregues em 23/08 (o `bool` saiu; o gate é `ControleDeclarado.microfone`, por controle). Falta o portão 5.a — a arbitragem do hidraw`

* **Três `MagicMock(..., bt_mic_enabled=False)` órfãos** —
  `tests/unit/test_som_02_devolucao_da_posse.py:286`,
  `test_mic_usb_01_tres_camadas.py:132`, `test_state_full_audio_speaker.py:71`.
  Nomeiam um campo que não existe mais; inofensivos (o `MagicMock` aceita
  qualquer kwarg), mas são fato errado em três lugares. Não são meus arquivos.
