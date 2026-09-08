# ONDA1-D1 · O SOM — o microfone virou um ato, e o alto-falante lê as duas camadas

**Sprint:** `docs/process/sprints/2026-09-04-ONDA1-D1-O-SOM-01-o-microfone-e-um-ato-e-o-alto-falante-tem-dois-canais.md`
**Árvore:** `/mnt/Apate/Desenvolvimento/hefesto-voo/ONDA1-D1-O-SOM-01-D1` · branch `voo/ONDA1-D1-O-SOM-01-D1`
**Bancada:** reservada e liberada três vezes; o daemon dela foi trocado pelo desta
árvore por ~90 s a cada prova e devolvido (`systemctl --user start` → `active`).

---

## O que mudou

### 1. O microfone é UM ATO — `mic.canal.set`, e o botão do plástico chama a MESMA função

| arquivo | o que ganhou |
| --- | --- |
| `daemon/subsystems/hotkey.py` | `ligar_o_microfone(daemon, uniq, *, ligado)` — o ato, com as duas metades; `_metade_do_canal`, `_metade_do_firmware`, o eco-guard e o laço `canal_do_microfone_loop` |
| `daemon/ipc_handlers.py` | `_handle_mic_canal_set` (chama `ligar_o_microfone`), `_uniq_do_primario`, e as **três faces novas** no `state_full` |
| `daemon/ipc_server.py` | `"mic.canal.set": self._handle_mic_canal_set` — uma linha |
| `app/ipc_bridge.py` | `mic_canal_set`, `mic_canal_set_detalhado`, `frase_do_ato_do_microfone`; `mic_set_detalhado` passou a DELEGAR ao ato |

**Uma função, dois chamadores, por nome.** `mic_button_loop` (a borda do
plástico) e `_handle_mic_canal_set` (o [mic] da tela) apontam os dois para
`ligar_o_microfone`. `_eleger_ou_devolver` passou a DEVOLVER o
`ResultadoDaEleicao` que já produzia — sem isso o ato não tinha como saber se
metade dele aconteceu.

**Três decisões de desenho, e cada uma sai de uma medição desta bancada:**

* **A metade do firmware é IDEMPOTENTE.** Vindo do plástico o kernel já pôs o
  bit no valor certo; escrever ali tomaria a posse do `hid-playstation` e o
  **próximo aperto dela não faria nada** (`_handle_mic_set`: *"enquanto ela
  vigorar o botão físico não manda mais"*). É a decisão dela de 30/08 — *"o
  botão do Controle sempre controla a interface"* — virada em guarda.
* **A posse VOLTA ao kernel, e a devolução é AGENDADA.** Devolver na linha
  seguinte apagaria o bit de validação antes de o report sair. A task
  `_confirmar_e_devolver` relê até o aparelho concordar (teto de 3 s) e só
  então solta. Medido: **a posse voltou em 0,6 s**.
* **Ela NÃO devolve quando a confirmação não vem.** Em Modo Nativo o
  `report_thread` não escreve nada; devolver ali mataria o pedido dela em
  silêncio. Ele fica represado, a posse fica nossa, e nasce o recado.

**O `state_full.audio` ganhou as outras faces:** `canal_ativo`, `canal_mudo`,
`volume_captura`, `canal_fonte`. Elas **não são lidas no tique** — o
`state_full` roda a 20 Hz no loop do daemon e cada resposta do PipeWire custa um
subprocesso. Quem pergunta é o `canal_do_microfone_loop`, a cada 2 s, numa
thread; o tique só lê o dicionário pronto. **Enquanto ele não perguntou, as
chaves não aparecem** — ausência fala, como no `gyro` e no `touchpad`.

### 2. O alto-falante — a leitura de volta é das DUAS camadas

`app/audio_saida.py` ganhou `botao_da_rota_aceso` (função **pura**),
`recado_da_rota`, `RotaDasDuasCamadas`, `ler_as_duas_camadas`, os dois bytes
nomeados (`BYTE_SONS_DO_JOGO` = 2, `BYTE_TODO_O_SOM_DO_PC` = 3, importados do
dono em `core/ds_output_report`) e `MOTIVO_ROTA_SO_NO_BYTE`.

A tabela, e a segunda linha é a que não se adivinha:

| byte | camada 1 | acende |
| --- | --- | --- |
| 3 | o padrão do sistema É este controle | `"pc"` |
| 3 | o padrão é outra saída | **nada** — e nasce o recado |
| 2 | qualquer | `"jogo"` |
| 0, 1 ou ausente | qualquer | nada |

E `scripts/ensaios/a_rota_do_som_vai_e_volta.py`: fotografa a saída, manda as
duas camadas, **lê de volta as duas**, e devolve no `finally`. Sem a volta o
som dela ficaria preso no controle — era por isso que o gesto `rota` estava em
`PERIGOSOS` e a régua de clique nunca o tinha clicado.

---

## Qual mordida prova

**Os dois testes: 37 casos, todos verdes com a cura no lugar.**

### As seis mordidas de código

| # | o que arranquei | quem reprovou |
| --- | --- | --- |
| 1 | `mic_button_loop` chamando `_eleger_ou_devolver` direto | `test_o_botao_do_plastico_e_o_da_tela_chamam_a_mesma_funcao` |
| 2 | um `if daemon.is_native_mode()` dentro do ato | `…_nao_muda_de_caminho_com_o_modo_nativo[True]` + `…e_identico_nos_dois_modos` |
| 3 | o `_borda_e_eco_do_ato` do laço | `…o_eco_da_nossa_escrita_nao_executa_o_ato_de_novo` + `…o_eco_vale_uma_vez_so` |
| 4 | a guarda de idempotência do firmware | `test_o_botao_do_plastico_nao_toma_a_posse_do_byte` |
| 5 | `**kwargs` devolvido ao `_run_blocking` do dublê | `…o_run_blocking_do_duble_e_tao_estrito_quanto_o_do_daemon` |
| 6 | a leitura do sink em `botao_da_rota_aceso` | 4 casos, entre eles `test_o_byte_sozinho_nao_acende_todo_o_som_do_pc` |

```
##### MORDIDA 1 #####   FAILED …::test_o_botao_do_plastico_e_o_da_tela_chamam_a_mesma_funcao
##### MORDIDA 2 #####   FAILED …::test_o_ato_nao_muda_de_caminho_com_o_modo_nativo[True]
                        FAILED …::test_o_ato_e_identico_nos_dois_modos
##### MORDIDA 3 #####   FAILED …::test_o_eco_da_nossa_escrita_nao_executa_o_ato_de_novo
##### MORDIDA 4 #####   FAILED …::test_o_botao_do_plastico_nao_toma_a_posse_do_byte
##### MORDIDA 5 #####   FAILED …::test_o_run_blocking_do_duble_e_tao_estrito_quanto_o_do_daemon
##### MORDIDA 6 #####   FAILED …::test_o_byte_sozinho_nao_acende_todo_o_som_do_pc  (+3)
##### CURA DEVOLVIDA #####   37 passed
```

E o ensaio morde sozinho: `--sem-volta` arranca a devolução da camada 1 e o
ensaio **reprova com rc=1**, dizendo que a saída padrão não voltou.

### A prova no APARELHO — os dois modos, no cabo

Com um DualSense no cabo, daemon desta árvore, `mic_mudo` partindo DIVERGENTE
do que o ato ia pedir (para a escrita do byte ser de fato exercida):

```
--- mudo, posse do kernel — o ato TEM de escrever
    native=False  mic_mudo=True   posse=kernel  canal_ativo=False
    default-source: …HD_Pro_Webcam_C920…

  mic.canal.set{ligado:true} -> {"status":"ok","canal_feito":true,
     "firmware_pedido":true,"ativo":"…DualSense_Wireless_Controller…"}

--- depois do ATO em VIRTUAL
    native=False  mic_mudo=False  posse=kernel  canal_ativo=True
    default-source: …DualSense_Wireless_Controller…
```

As duas metades feitas, e **a posse de volta ao kernel** — o botão do plástico
dela continua vivo. No log do daemon:

```
microphone_mute_set   muted=False ok=True uniq=d42f…    ← COM endereço
mic_ato_posse_devolvida  esperou_s=0.6 uniq=d42f…
```

Em **Modo Nativo**, o mesmo ato, sem uma linha de caminho diferente:

```
mic.canal.set{ligado:false} em NATIVO:
  {"status":"incompleto", "canal_feito":true, "firmware_pedido":true, …}

--- depois do ATO em NATIVO
    native=True   mic_mudo=False  posse=HEFESTO  canal_ativo=False
    default-source: …HD_Pro_Webcam_C920…       ← a metade do CANAL funcionou

--- saiu do nativo — o desejo represado vai ao fio
    native=False  mic_mudo=True   posse=HEFESTO
```

E o recado chegou ao `state_full`, que é o que vai ao cartão dela:

```json
{"uniq":"d42f…","gesto":"recusa","ok":false,
 "motivo":"o microfone foi ligado no canal deste controle, mas o Hefesto não
  conseguiu escrever o mudo no aparelho — enquanto um jogo estiver com o
  controle (Modo Nativo) quem manda no plástico é ele, e o pedido fica
  guardado até o Hefesto poder escrever"}
```

**A regra dela, provada:** *"indepente se nativo ou virtual"* — o ato é o
mesmo, a metade do canal funciona nos dois modos, e a do firmware fica guardada
e acontece quando o aparelho permite. O produto **diz** qual metade faltou, em
vez de responder `ok` sobre nada.

### O ensaio da rota, no aparelho

```
saída ANTES : …hdmi-stereo
IDA camada 1: ok=True sink=…DualSense…analog-surround-40
IDA camada 2: {'status':'ok','speaker':{'volume':102,'muted':False,'rota':3}}
LEITURA byte : 3
LEITURA sink : …DualSense…analog-surround-40
botão aceso  : 'pc'   concordam: True
VOLTA camada 1: ok=True
saída DEPOIS  : …hdmi-stereo
PASSOU — as duas camadas foram escritas, lidas de volta e devolvidas.
```

**Os dois transportes:** o cabo está medido acima. O **rádio** não foi medido
com controle na mesa — havia um só DualSense, no cabo. O que o produto faz no
rádio está declarado, não medido por mim: `sink_do_controle` devolve `""`
(o DualSense não publica placa de som por Bluetooth, medido em 15/08 e
registrado no `mapa-controles.csv`, `audio.alto_falante` `radio_aciona=não`),
e o ensaio **recusa com rc=2 dizendo isso** em vez de fingir. Para o microfone,
o CSV diz `audio.microfone.mudo` cabo=`sim` / rádio=`parcial`, e a parcialidade
é do canal BT (`bt_mic`), não da regra do ato.

---

## O que medi e derrubou uma suposição

### 1. As duas metades JÁ estavam acopladas — por acidente, e num sentido só

O enunciado da sprint dizia que faltava *"método IPC de eleição"* e que ligar o
microfone hoje *"é só a metade do firmware"*. **É mais grave que isso.** Medido
com o daemon dela, antes de eu escrever uma linha:

```
mic.set {muted: true}   -> default-source: …HD_Pro_Webcam_C920…
mic.set {muted: false}  -> default-source: …DualSense_Wireless_Controller…
```

O `mic.set` da TELA **trocava o microfone padrão do sistema dela** — porque o
bit mudava, o laço das bordas via a mudança e elegia o canal, sem que método
nenhum tivesse dito isso e sem uma palavra na resposta. O acoplamento existia;
o que faltava era o ato DECLARADO. É também por isso que o eco-guard precisou
existir: sem ele o ato roda duas vezes, e a segunda cai no ramo da recusa.

### 2. O ato responde `ok` em ~550 ms de atraso — e isso decidiu o desenho

Medido nos dois sentidos, com o daemon vivo: o `state_full` publica o valor
novo em **547 ms** e **548 ms**. É o keepalive de 0,5 s do `report_thread`. A
ponte da GUI corta em 250 ms, então **o ato não pode confirmar o firmware
sincronamente** — quem diz a verdade conferida é o `state_full`, e é de lá que
o selo composto se pinta.

### 3. O que Modo Nativo faz com o `mic.set` — e o `ok` que era falso

Antes desta frente, em Modo Nativo:

```
mic.set {muted: true} -> {"status": "ok", "mic_mudo_desejado": true}
   e o aparelho:            mic_mudo = false   (parado)
speaker.set {rota:2}  -> {"status":"ok","speaker":{...,"rota":2}}   ← puro ECO
```

É o padrão de 04/09 outra vez — *o daemon respondendo `aplicado_em` com as
lâmpadas paradas*. O ato novo separa `canal_feito` de `firmware_pedido` e só
diz `ok` com as duas.

### 4. EU COMETI A CICATRIZ DE 04/09, E QUEM REVELOU FOI O APARELHO

`_run_blocking(self, fn, *args)` **não aceita keywords** — nem em
`daemon/lifecycle.py` nem no protocolo; por baixo é um `run_in_executor`. Eu
escrevi `await daemon._run_blocking(setter, mudo_desejado, uniq=uniq)`. O
`TypeError` morria dentro de um `suppress` e a metade do firmware **nunca
escrevia um byte** — com os 17 testes VERDES, porque o dublê da minha régua
tinha `async def _run_blocking(self, fn, *a, **kw)`.

**É exatamente a máscara que nunca gravou um byte**, com outro nome: o dublê
era mais frouxo que a ponte real. Quem revelou foi a bancada — o ato respondeu
"não conseguiu escrever" com o backend intacto. A cura é o envelope `_mutar`
(o mesmo padrão do `_acender` que já existia neste arquivo), e a régua nova
(`test_o_run_blocking_do_duble_e_tao_estrito_quanto_o_do_daemon`) compara as
duas assinaturas por `inspect` **e** varre o produto atrás de keyword passada
ao `_run_blocking`.

### 5. `recado_do_microfone.GESTOS` é uma tupla FECHADA — e o portão foi a bancada

Minha primeira redação anotava `gesto="firmware-represado"`. `anotar` **levanta**
em gesto desconhecido (de propósito: a tela não pode receber palavra que não
sabe pintar). O `ValueError` subiu dentro da task, o log dizia
`mic_ato_represado` e **o recado nunca chegava ao `state_full`**. Verde no
teste; a foto do estado é que mostrou. Curado com `gesto="recusa"` (que já
significa *"o produto não fez, e a razão é esta"*), o `anotar` embrulhado em
`suppress`, e uma régua nova que confere a palavra contra `GESTOS`.

### 6. Uma lápide alheia ficou "curada" por ACIDENTE DE NOME

O `casa-sabe` acusou `interface/pacotes/mapa.py::canal` como lápide que a cura
alcançou — e nada meu chama aquela função. A régua daquele portão declara que
*"o que não dá para resolver sem inferir tipo (literal de texto e atributo de
objeto) conta plano"*: o meu `AtoDoMicrofone.canal`, o `canal=canal` da
construção e o `canal = canal_do_microfone(uniq)` do `_merge_audio` bastaram
para o identificador `canal` aparecer em módulo alcançado.

**Apagar a lápide seria mentir** — `mapa.py::canal` continua sem chamador. O
conserto é meu: o campo virou `canal_no_sistema`, as locais viraram
`no_sistema` / `lido` / `tarefa_do_canal`, e a lápide alheia continua de pé,
honesta. **A lição:** num portão que conta citação plana, um nome curto e
genérico em módulo de produção ressuscita a lápide de outra pessoa.

### 7. `scripts/portoes.sh` roda com o python de OUTRA árvore

Dentro deste worktree o cabeçalho imprimia
`python /mnt/…/hefesto-dualsense4unix-estavel/venv/bin/python` — uma venv sem
pytest e sem playwright. Ela produziu **seis vermelhos falsos**
(`mac-por-oui`, `mac-de-fixture`, `casa-sabe`, `portao-tem-chamador`,
`pecas-do-dualsense`, `cores-do-dualsense`). O coordenador confirmou o mesmo na
árvore vizinha. **Os dois resultados estão na §Portões abaixo.** O conserto do
script é de quem coordena.

---

## O que NÃO verifiquei

* **O rádio, com controle na mesa.** Havia um DualSense só, no cabo. O
  comportamento no rádio está declarado a partir do `mapa-controles.csv` e do
  código, **não medido por mim nesta sessão**.
* **O botão FÍSICO apertado por mão humana.** Ela está usando a máquina; o bit
  só muda por dedo ou por escrita nossa. O caminho do plástico foi exercido
  pelo laço de bordas (a borda que a minha escrita provocou o percorreu, e é
  por isso que o eco-guard nasceu) e pela régua de idempotência, **não por um
  aperto**. Quem fechar isso precisa de um toque dela.
* **A mesa CHEIA.** Um controle só. A regra *"só o eleito devolve"* e o
  `_apagar_a_luz_de_quem_perdeu_o_canal` não foram exercidos com dois donos.
* **A tela.** Não abri a interface: os três arquivos dela são de outras
  frentes desta mesma onda (R1).
* **A suíte inteira.** Rodei só o meu escopo (37 casos), como manda o
  protocolo.

---

## O que sobrou para o próximo

### Para a ABA 02 (`interface/pacotes/a02_controles.py`) e o PILOTO

Três linhas, e as três já têm o dado do lado do daemon:

1. **O [mic] vira o ato explícito.** O gesto `mudo`, ramo `microfone`, hoje faz
   `p.mic_set(not agora, uniq=uniq)` — **e isso já executa o ato inteiro**,
   porque `ipc_bridge.mic_set_detalhado` passou a delegar. O que falta é a
   FRASE: troque por `p.mic_canal_set(ligado=not agora, uniq=uniq)` e, na
   recusa, use `ipc_bridge.frase_do_ato_do_microfone(corpo)` em vez do
   `RuntimeError` genérico — é ela que diz **qual metade** faltou.
   *`mic_set` NÃO mudou de significado de propósito*: o `status` continua
   querendo dizer "o backend aceitou o pedido do firmware", para não trocar o
   comportamento de um arquivo que outra frente edita agora.

2. **O SELO do microfone pinta o estado COMPOSTO** (conflito C-2 do PO). As
   quatro faces estão todas no `state_full.audio` de cada controle:

   | face | chave |
   | --- | --- |
   | o botão da tela / a posse | `mic_mudo_desejado` (`null` = o kernel manda) |
   | o plástico / o firmware | `mic_mudo` |
   | a luz vermelha | `mic_da_mesa.eleito` + `mic_da_mesa.recados[uniq]` |
   | a fonte no PipeWire | `canal_ativo`, `canal_mudo`, `volume_captura`, `canal_fonte` |

   **ATIVO só quando as quatro concordam.** As três últimas chaves são NOVAS e
   podem estar AUSENTES — ausência é "ainda não perguntamos" (o laço tem ciclo
   de 2 s) e não deve virar `false` na tela. E o recado com `gesto: "recusa"` e
   `ok: false` agora também carrega o **represamento do firmware**, que é o
   caso do Modo Nativo.

3. **`rota_na_tela` passa a ler as duas camadas.** Hoje ela lê só
   `speaker.rota` — foi assim que em 03/09 o card 2 acendeu "Todo o som do PC"
   com o som na TV. Monte um `audio_saida.RotaDasDuasCamadas(byte=…,
   sink_do_controle=…, sink_padrao=…)` e devolva `.botao_aceso`; `.recado`
   traz a frase do desacordo. A leitura de PipeWire é bloqueante — vai por
   `ipc_bridge.run_in_thread`, na mesma thread de 0,5 Hz que a aba já usa para
   a rota. E o campo invisível `alto-estado` sai do desenho: o botão acende
   por leitura.

### Achados que não são meus para consertar

* **`recado_do_microfone.GESTOS` não tem palavra para "o firmware ficou
  represado".** Usei `recusa`, que é honesto e não mente na tela, mas o dono
  daquele módulo pode querer um quarto gesto — a tela ganharia um estado
  próprio para "guardado até o Hefesto poder escrever".
* **`mic_da_mesa.eleito` pode mentir**, e eu vi mentir: com o canal trocado por
  fora (`pactl set-default-source`), o `state_full` seguiu dizendo
  `eleito: d42f…` com o ativo sendo a webcam. O `EleitorDeMicrofone` só se
  corrige em gesto. Quem pintar o selo composto deve confiar em `canal_ativo`
  (leitura) e não em `eleito` (memória).
* **`scripts/portoes.sh`** — ver §6 acima. Conserto de quem coordena.

### Para as duas frentes que esperavam esta

`daemon/ipc_handlers.py` está livre. O que acrescentei ali é local: o handler
`_handle_mic_canal_set` + `_uniq_do_primario` (logo antes de
`_handle_mic_led_set`) e quatro linhas dentro de `_merge_audio`. Também
acrescentei **uma linha** ao dicionário `_handlers` de `daemon/ipc_server.py`
(`"mic.canal.set"`), que não estava na minha posse — quem registrar método novo
ali vai encostar nela.

---

## Portões

**Com o cabeçalho ERRADO** (o `portoes.sh` resolvendo sozinho o python de
`hefesto-dualsense4unix-estavel/venv`):

```
REPROVOU: 12 vermelho(s) de 36 -> contrato-ipc citacoes-de-linha curvas
  mac-por-oui mac-de-fixture casa-sabe portao-tem-chamador pecas-do-dualsense
  cores-do-dualsense ruff acentuacao mypy
```

Seis daqueles eram do INSTRUMENTO (`No module named pytest`, `No module named
playwright`), não do código.

**Com o cabeçalho CERTO** — e é este que vale:

```
python  /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
PYTHONPATH /mnt/Apate/Desenvolvimento/hefesto-voo/ONDA1-D1-O-SOM-01-D1/src
```

```
TODOS VERDES — 36 portões.
```

Os vermelhos que sobraram depois do cabeçalho certo eram meus e fecharam um a
um: `ruff` (ordem do
`__all__` e três citações dela passando de 100 colunas), `acentuacao` (as
citações literais dela ganharam `# noqa-acento`), `mypy` (`_run_blocking`
devolve `Any` e `_eleger_ou_devolver` passou a ter tipo de retorno),
`contrato-ipc`/`citacoes-de-linha` (`scripts/gerar-contrato-ipc.py` regenerado:
41 → 42 métodos) e `casa-sabe` (as três promessas novas declaradas em
`_SEM_CAMINHO_HOJE`, com o endereço exato de onde o caminho se fecha, mais o
campo renomeado da §6).

**Suíte:** só o escopo desta frente — `test_o_microfone_e_um_estado_so.py` e
`test_a_rota_do_som_le_as_duas_camadas.py`, **37 passed**; e o portão
`portao_a_casa_sabe_e_o_produto_nao_faz.py`, **42 passed**. A suíte inteira é
de quem coordena, e roda no fim.
