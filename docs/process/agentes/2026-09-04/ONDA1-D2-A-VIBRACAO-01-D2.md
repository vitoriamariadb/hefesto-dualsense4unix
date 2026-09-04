# ONDA1-D2 · A VIBRAÇÃO — o multiplicador por motor compõe com o degrau

Agente **D2**, 04/09/2026. Árvore `hefesto-voo/ONDA1-D2-A-VIBRACAO-D2`, branch
`voo/ONDA1-D2-A-VIBRACAO-D2`, nascida de `dev` em `bf863a49`.

Sprint:
[2026-09-04-ONDA1-D2-A-VIBRACAO-01](../../sprints/2026-09-04-ONDA1-D2-A-VIBRACAO-01-o-multiplicador-por-motor-compoe-com-o-degrau.md).

## O que mudou

**A conta dela virou código, e ela vive em UM lugar.**

> *"os slcers do botão esquerdo e direito (forte e fraco) se multiplicam
> (interagem com os botões economia, moderado, máximo, se eu tiver 150% do
> perfil de vibração e as duas linhas estiverem 100 entao a vibração dos 2 será
> 150%, mas se so a do motor fraco tiver 100 e a outrqa 50% então será 150 em um
> e 75% no outro entende?"* <!-- noqa-acento: citação literal dela -->

```
efetivo(motor) = degrau(coluna) x barra(motor)
```

### `profiles/schema.py` — o número ganha dono e vida

`ControllerRumbleOverride` ganha **`motor_forte_pct`** e **`motor_fraco_pct`**
(0–100, `None` = sem opinião). Junto vieram:

| peça | o que é |
| --- | --- |
| `MOTOR_PCT_PADRAO = 100` | o valor de quem não arrastou nada — um dono só |
| `MOTOR_PCT_MAX = 100` | o teto, e **não** é o `RUMBLE_CUSTOM_MULT_MAX` |
| `pcts_dos_motores(rumble)` | o ÚNICO lugar que resolve "campo não escrito = sem opinião" |
| `motores_dos_controles(controllers)` | `{uniq: (forte, fraco)}` — espelho de `_controllers_to_rumble_scales` |
| `_validate_barras_de_motor` | a recusa na BORDA, com a razão na mensagem |

**Por que o teto da barra é 100 e não 200:** a barra é o SEGUNDO fator, e quem
amplifica é o degrau (`Máximo` = 150 %, `custom` até 200 %). Uma barra acima de
100 daria à mesma peça **duas portas para o mesmo estouro** — HARM-19 pela outra
porta, e a nota SATURA-01 diz o preço.

**O disco de quem não usa não muda.** `_payload_do_perfil` serializa as entradas
de `controllers` com `exclude_unset=True`, então um override que só tem `policy`
NÃO ganha `"motor_forte_pct": null` — que era o defeito medido em PERFIL-02 e em
SOM-02/E4 (um hefesto antigo com `extra="forbid"` rejeitaria o perfil inteiro num
downgrade). Há teste.

### `daemon/subsystems/gamepad.py` — a multiplicação, num lugar só

* `_chave_da_peca(uniq)` — o MAC normalizado como o perfil o chaveia (sem
  dois-pontos, minúsculo). Sem isso o endereço com `:` não casa chave nenhuma e o
  mapa fica **mudo em silêncio**.
* `_motores_do_perfil_ativo(daemon)` — o mapa do perfil ATIVO,
  **memoizado pelo nome do perfil** em `daemon._rumble_motores_pct`. O FF do jogo
  chega a centenas de Hz; ler o disco por report seria uma tempestade de syscalls
  no caminho mais quente do daemon. Perfil ilegível cai em mapa vazio e a
  vibração segue — derrubá-la por um JSON torto trocaria um ajuste perdido por
  uma partida muda.
* `_pcts_dos_motores(daemon, target_uniq)` — `(100, 100)` quando `target_uniq is
  None`: **sem endereço não há peça**, mesma disciplina do BROADCAST-PROIBIDO-01.
* `_mults_por_motor(daemon, now, target_uniq)` — **a conta, e é o único lugar
  onde a multiplicação acontece.**
* `apply_game_rumble` deixou de chamar `_game_rumble_mult` e passou a chamar
  `_mults_por_motor`; `weak` e `strong` agora podem sair com fatores diferentes
  do MESMO controle.

`_game_rumble_mult` **continua existindo e continua sendo o degrau** — três
docstrings do produto e dois testes o apontam como o espelho de
`reassert_rumble`. Mudar o tipo de retorno dele tornaria essas cinco referências
sutilmente falsas; a docstring dele agora diz, com todas as letras, que quem
escreve no motor não o chama.

### Como a conta compõe com o TETO por controle (`08-conexoes`), sem apagá-lo

Medido, e os dois juntos:

```
degrau (política global)  ->  apply_game_rumble
   x barra(motor)         ->  apply_game_rumble   <- o que esta sprint acrescenta
   x teto da peça         ->  backend._escalar_rumble (um andar ABAIXO)
```

São três fatores em andares diferentes; nenhum come o outro. O teste
`TestCompoeComOTeto` percorre os dois andares com o backend REAL
(`PyDualSenseController` com handles falsos) e o fator do produto
(`_controllers_to_rumble_scales`), nunca digitado.

### O que foi CRIADO

* `tests/unit/test_cada_motor_tem_o_seu_multiplicador.py` — **54 testes** (30 da
  metade de daemon, 24 da metade de IPC);
* `scripts/ensaios/o_multiplicador_chega_ao_motor.py` — o ensaio de bancada.

### Dois arquivos que a MINHA edição obrigou a mexer, e não são de ninguém

`docs/data/mapa-controles.csv` e `html/specs.html`. Nenhum dos dois está no
`posse:` ou no `nao_toca:` de sprint alguma em voo (conferido no frontmatter de
`ONDA1-D1-O-SOM-01`, a única outra da onda). O portão `citacoes-de-linha`
reprovou porque minha inserção em `gamepad.py` **moveu as linhas** que 21
citações do mapa apontam — a afirmação continua verdadeira, o endereço é que
caducou, e o próprio portão manda reapontar em vez de apagar.

Reapontadas com um **mapa exato de linha velha → linha nova** (`difflib` sobre
`git show HEAD:` versus o disco), nunca somando um deslocamento à mão — o
deslocamento não é constante, porque também acrescentei linhas *dentro* de
`apply_game_rumble`. Uma citação NÃO foi tocada de propósito:
`gamepad.py:1527, :1542, :975-977`, que aparece numa nota histórica sob o
rótulo *"os velhos"* — ali o endereço caduco **é** o assunto.

`html/specs.html` é gerado do CSV (`scripts/gerar-mapa.py`, que o portão
`mapa-de-canais` nomeia). Regenerado: **3 linhas** de diferença, todas do JSON
embutido. Se outro agente também mexer no CSV, o conflito cai nessas linhas — que
é o barulho que se quer.

## Qual mordida prova

**Três curas arrancadas, três réguas vermelhas, e as saídas estão coladas.**

### Mordida 1 — a multiplicação por motor (a que a sprint pede)

`_mults_por_motor` devolvendo `(degrau, degrau)`:

```
E  AssertionError: o par efetivo saiu (150, 150), e a conta dela pede (150, 75):
   degrau 150% x barra fraca 100% no `weak`, e o MESMO degrau x barra forte 50%
   no `strong`. Se os dois vieram iguais, a barra não entrou na conta.
E  assert (150, 150) == (150, 75)
E    At index 1 diff: 150 != 75
...
8 failed, 22 passed in 0.97s
```

É exatamente o que a sprint manda ver: *"degrau 150 · fraca 100 · forte 50 tem
de sair 150 e 75, e sem a cura sai 150 e 150"*.

### Mordida 2 — o degrau escapando sozinho (o defeito que volta num merge)

`apply_game_rumble` voltando a chamar `_game_rumble_mult` direto — que é o
estado literal de antes desta sprint:

```
E  AssertionError: `apply_game_rumble` deixou de compor o par por motor
E  assert '_mults_por_motor' in {'_game_rumble_mult', 'callable', 'getattr',
                                 'max', 'min', 'round', ...}
1 failed
```

Esta é a régua que mais importa: com um perfil de suíte SEM barra escrita,
nenhum teste de valor fica vermelho quando o degrau volta a escapar. A leitura
por AST pega a chamada.

### Mordida 3 — a borda do esquema

`_validate_barras_de_motor` apagado:

```
E  Failed: DID NOT RAISE ValueError
...
6 failed, 5 passed in 0.44s
```

### AS CINCO MORDIDAS DA METADE DE IPC (segunda passada)

| cura arrancada | o que a régua disse |
| --- | --- |
| `esquecer_motores_do_perfil` no handler | `o segundo FF tinha de sair com o forte pela metade — o cache do mapa não caiu na gravação` · `[..., 200, 200] != [..., 200, 100]` |
| o bloco `rumble_motores` do `state_full` | `o state_full deixou de ler o MESMO mapa que apply_game_rumble multiplica` (+ o padrão sumindo) — 2 vermelhos |
| a linha do despacho em `ipc_server` | `'"rumble.motores.set": self._handle_rumble_motores_set' in ...` — o método vira inalcançável e só isto pega |
| `_chave_de_peca_que_grava` → `norm_mac` cru | `assert 'ok' == 'sem_endereco'` nos DOIS casos (o `path:` e o vpad) |
| a advertência da docstring de `rumble_stop` | `a ponte não diz qual é o gesto que DEVOLVE a vibração ao jogo` |

### Com as três curas de volta

```
54 passed, 1 warning in 1.14s
```

E os vizinhos, agora com os de IPC junto: **362 passed**.

### Os portões

```
git add -A && bash scripts/portoes.sh
TODOS VERDES — 40 portões.        (as duas passadas)
```

(Na primeira passada: `citacoes-de-linha` vermelho por 3 endereços que a minha
inserção moveu; depois `mapa-de-canais`, porque reapontar o CSV desatualiza a
página gerada. Os dois curados, e a razão está acima.)

E os vizinhos, que é onde uma mudança de esquema costuma quebrar sem avisar
(`test_vpad_ff_passthrough`, `test_por_unidade_01_todas_as_abas`,
`test_perfil_por_controle_o_campo_espera_o_caminho`,
`test_a_forca_da_vibracao_e_por_controle`, `test_o_teto_da_vibracao_e_por_controle`,
`test_rumble_mult_um_dono`, `test_orcamento_e_teto_nao_troca`,
`test_rumble_por_jogador_01`, `test_profile_rumble_policy`,
`test_p4_alvo_ausente_nao_vira_broadcast`):

```
213 passed, 1 warning in 10.55s
```

### A BANCADA — o que o aparelho respondeu

Bancada **LIVRE**; `scripts/bancada.sh exigir` deu rc=0; um DualSense na mesa
(USB) e o vpad do P1 vivo. Rodado
`scripts/ensaios/o_multiplicador_chega_ao_motor.py --segundos 0.8`:

```
A CONTA DO PRODUTO, com os números dela (degrau 'max', barra fraca 100%, barra forte 50%):
  mult do motor FRACO ... 1.5000
  mult do motor FORTE ... 0.7500
  razão forte/fraco ..... 0.5000   <- É ISTO que a mão tem de sentir
  par sobre a base 160 .. weak=240  strong=120

  daemon ...... vivo · degrau global 'balanceado' · perfil 'Navegação'

  PAR SIMÉTRICO  (controle POSITIVO): weak=160 strong=160 · o daemon guarda: [160, 160]
  O PAR DA CONTA:                     weak=240 strong=120 · o daemon guarda: [240, 120]
  SÓ O FRACO:                         weak=160 strong=0   · o daemon guarda: [160, 0]
  SÓ O FORTE:                         weak=0   strong=160 · o daemon guarda: [0, 160]
  SILÊNCIO       (controle NEGATIVO): weak=0   strong=0   · o daemon guarda: [0, 0]

  motores parados · rumble_active=None · passthrough=True
```

**O que isso prova:** o par ASSIMÉTRICO que a conta produz atravessa o daemon
**como par** — o produto não iguala os motores em lugar nenhum do caminho, que é
a premissa física de que a barra por motor depende.

**E ACHOU UM DEFEITO NO PRÓPRIO INSTRUMENTO, na primeira execução** — a
armadilha 3 do `CLAUDE.md` na forma mais cara. `rumble.stop` **não devolve o
passthrough**: ele deixa `rumble_active=(0,0)`, e com o rumble FIXADO o
`apply_game_rumble` descarta o FF do jogo na primeira linha. O ensaio saía
deixando a máquina dela **sem vibração em jogo nenhum, em silêncio**. Curado no
mesmo ato: o ensaio agora fotografa `rumble_active` antes, devolve o estado no
fim, e RECLAMA em `stderr` se a devolução não bater. O estado dela foi devolvido
à mão e conferido (`rumble_active=None · passthrough=True`).

### O daemon VIVO contra o método novo — medido, não suposto

```
rumble_motores_set(forte_pct=50, fraco_pct=100)  ->  (False, None)
state_full tem rumble_motores?                   ->  False
rumble_active = None · passthrough = True        (a máquina dela, intocada)
```

O daemon instalado é o da árvore DELA e não conhece o método. **Isso mede duas
coisas de uma vez:** que a afirmação *"não verifiquei contra o daemon instalado"*
é fato e não desculpa; e que a ponte **degrada em silêncio correto** — devolve
`(False, None)`, o mesmo que "daemon fora do ar", em vez de estourar na tela de
quem estiver com uma janela nova contra um daemon velho.

## O que NÃO verifiquei

* **NÃO verifiquei o plástico.** O ensaio mede o que o DAEMON guarda; qual motor
  treme mais é o veredito da **mão dela**, e ela não estava com o controle na
  mão. O ensaio está escrito, rodado e pronto para ela repetir em segundos.
* **NÃO verifiquei o daemon INSTALADO fazendo a conta**, e não havia como: o
  daemon vivo é o da árvore DELA, sem este código. Provar isso exigiria
  `install.sh` ou reiniciar a unit systemd — as duas coisas que agente nenhum
  faz enquanto ela usa a máquina.
* **NÃO verifiquei a tela.** A metade de TELA da aba 05 é de outra frente
  (`interface/pacotes/a05_vibracao.py`, `interface/aba05.py`, no `nao_toca:`
  desta sprint). Nenhum pixel mudou aqui.
* **NÃO verifiquei o `rumble.motores.set` contra um daemon VIVO que o conheça**
  — o instalado é o dela e não tem este código (medido acima). O que está medido
  é o handler REAL contra um perfil REAL no disco, com o `IpcHandlersMixin`
  instanciado; o que falta é o mesmo caminho por cima do socket, e ele só existe
  depois do merge e de um `install.sh` — que agente nenhum roda.
* **NÃO rodei a suíte inteira** (regra: é de quem coordena, e no fim). Rodei o
  meu escopo e os dez vizinhos de vibração/perfil.
* **NÃO verifiquei `auto` por bateria com a barra.** A barra não tem
  denominador — ela compõe, não normaliza —, então ela deve valer sob `auto`
  também, e é assim que `motores_dos_controles` está escrito. Não medi com a
  bateria variando de verdade.

## O que sobrou para o próximo

### 1. A metade de IPC — FECHADA na segunda passada (e a premissa que eu li errado)

**A primeira passada desta sprint parou aqui, e por um erro meu de leitura de
`git`.** Eu medi `git log --oneline dev..voo/ONDA1-D1-O-SOM-01-D1` → `0` e
concluí *"D1 não fechou"*. **O sentido é o contrário:** `dev..branch` vazio
quer dizer que a branch está INTEIRA dentro de `dev` — ou seja, D1 fechou e já
foi integrada. Quem despacha mediu o outro lado
(`voo/ONDA1-D1-O-SOM-01-D1..dev` → 21) e a prova direta (`_handle_mic_canal_set`
vivo em `daemon/ipc_handlers.py`), confirmou a posse, e o resto desta seção é o
que foi feito depois.

**A lição, e ela é de instrumento, não de código:** `A..B` lista o que está em
**B** e não em **A**. Um vazio nunca é a resposta sozinho — ele responde a
pergunta na direção em que foi feito, e eu li a direção errada. A abstenção de
posse continua tendo sido a atitude certa sobre a premissa que eu tinha; o que
faltou foi medir os DOIS sentidos antes de afirmar.

Antes de começar, `git merge dev` (limpo, um documento de handoff).

#### `rumble.motores.set` — o método que grava

`daemon/ipc_handlers._handle_rumble_motores_set`, registrado em
`daemon/ipc_server._handlers`. Params `{uniq?, forte_pct?, fraco_pct?}`.

| decisão | por quê |
| --- | --- |
| grava no **perfil**, por peça | a barra é POLÍTICA, não comando — decisão dela |
| campo omitido **não mexe** naquela barra | duas barras independentes é o caso dela |
| `100` **apaga** o campo | no aparelho "escreveu 100" e "não escreveu" são o mesmo fator 1,0; a chave a menos é o que mantém o downgrade possível |
| a seção `rumble` só cai **vazia** | o degrau da peça (`policy`, o teto do card do cabo) mora ali e não é deste gesto |
| nada mudou → **não regrava** | um `save` troca a data do arquivo e faz o daemon reaplicar o perfil; no meio de uma partida isso não é de graça |
| a **faixa é da borda do esquema** | uma segunda faixa aqui seria o HARM-19 renascendo — foi assim que `rumble.policy_custom` divergiu do esquema em 0–1 contra 0–2 |

Quatro recusas, todas com motivo escrito: `sem_controle` (mesa vazia),
`sem_endereco`, `sem_perfil`, e o `ValueError` da borda.

#### `state_full` — os dois números de volta

`rumble_motores` = `{uniq: {forte_pct, fraco_pct}}`, **só de quem tem opinião**,
mais `rumble_motor_pct_padrao` (o 100, para a tela não digitá-lo).

**A fonte é a MESMA que o motor lê** — `gamepad._motores_do_perfil_ativo`, o
mapa memoizado que `apply_game_rumble` multiplica. Não é economia de linhas: uma
segunda leitura do disco no `state_full` poderia pintar um número que o motor
não está usando, que é o "aplicado" falso que esta casa passou 04/09 inteiro
arrancando. Há régua por AST que reprova quem abrir a segunda leitura.

#### A linha que faz a barra valer AGORA

Ela virou uma função com nome, `gamepad.esquecer_motores_do_perfil(daemon)`,
chamada pelo handler no mesmo ato. Mora ao lado do cache que esquece — e não
como um `daemon._rumble_motores_pct = None` escrito no handler — porque `daemon`
é `Any` só naquele arquivo: o `DaemonProtocol` não declara o atributo (ele nasce
em runtime, como `_grab_retry_falhas`), e escrever direto levava um
`attr-defined` do mypy que só um `cast` calaria. Nomear é melhor que esconder.

#### `app/ipc_bridge.rumble_motores_set`

Devolve `(ok, corpo)` com o corpo do daemon inteiro (`_corpo_do_daemon`), e não
um `bool` estreito — é a lição do ELO-MUDO-01: invólucro que estreita faz a tela
re-deduzir o que o daemon já sabia.

#### `docs/protocol/ipc-unix-socket.md`

Gerado (`scripts/gerar-contrato-ipc.py`): 42 → **43 métodos**. E ganhou a seção
em PROSA do `rumble.motores.set` — a conta dela, o que cada `status` quer dizer,
e como a tela lê de volta. Sem ela o método entrava na tabela como um dos 21
"sem contrato em prosa", e a frente da aba 05 teria de ler o handler para saber
o que mandar.

### 1b. O `rumble_stop`: o que eu decidi, e por que NÃO mudei o comportamento

**Não é defeito, e a leitura da primeira passada estava incompleta.** Fui ler o
handler: `_handle_rumble_stop` fixa `(0, 0)` **de propósito e com a razão
escrita** — o poll loop re-afirma o silêncio para que outra escrita HID não
reative os motores por acidente (HARM-16), e a docstring já mandava *"use
rumble.passthrough para liberar controle completo ao jogo"*. Trocar isso seria
repropor decisão medida, que esta casa não faz — e ainda desarmaria a HARM-16
num caminho que existe para armá-la.

**O defeito real é de VOCABULÁRIO, e está na ponte.** `app/ipc_bridge.rumble_stop`
chamava-se "parar" e não dizia uma palavra sobre a consequência: enquanto o par
fixado estiver de pé, `apply_game_rumble` descarta o FF de **todo jogo** na
primeira linha. Foi assim que o meu próprio ensaio deixou a máquina dela sem
vibração em jogo nenhum, em silêncio — e nenhuma régua viu, porque nenhuma
mentia: o produto fazia exatamente o que prometia a quem tivesse lido o handler.

**A cura é a frase, e ela tem mordida:** a docstring de `rumble_stop` agora diz o
que o par fixado faz com o FF e nomeia `rumble_passthrough` como o gesto que
devolve a vibração ao jogo; a de `rumble_passthrough` aponta de volta.
`TestAPonte::test_parar_avisa_que_nao_devolve_a_vibracao_ao_jogo` reprova se
qualquer das duas metades sumir. **Não abri sprint** porque o conserto de
comportamento seria errado e o de vocabulário coube em duas docstrings.

### 1c. Um defeito VIVO que a régua nova achou — `norm_mac` não serve para GRAVAR

`core.sysfs_leds.norm_mac` promete `None` *"quando não há nenhum dígito hex
(ex.: `key` que é um `path`)"*. **A promessa não se cumpre para um path que por
acaso tem letras hex:**

```
norm_mac("path:/dev/input/event9")  ->  "adeee9"
```

Uma chave que **parece** boa e que motor nenhum casa. Para LER é inofensivo (a
chave não bate, e `a08_conexoes._so_hex` já registrava que *"as duas erram, e
errar de um jeito só é o ponto"*); para **GRAVAR** é o defeito mais caro desta
casa — a escolha dela vai para o disco e some calada.

A cura é `_chave_de_peca_que_grava`, com duas condições verificáveis: **doze
dígitos hex** e **não é vpad** (`02fe…`). Refusa em voz alta (`sem_endereco` com
motivo) em vez de gravar um override fantasma. **O achado é da régua, não meu:**
eu escrevi o teste esperando `sem_endereco` e ele saiu `ok`.

**Relatado e não consertado:** a docstring de `norm_mac`
(`core/sysfs_leds.py:38-43`) afirma um `None` que ela não entrega. `sysfs_leds`
não é desta posse, e a afirmação é usada por vários chamadores de LEITURA, onde
ela é inofensiva — mas é um fato errado e a regra da casa manda substituí-lo.

### 1d. Duas dívidas DECLARADAS, no molde que a ONDA1-D1 abriu no mesmo dia

`rumble_motores_set` não tem chamador em `src/`, e não pode ter: quem atravessa
é a aba 05, que está no `nao_toca:` desta sprint. Fiar a rota daqui seria a
frente do motor editando arquivo de outra frente. Declarada nos dois portões que
cobram, com o endereço exato de onde o caminho se fecha:

* `tests/unit/test_ipc_bridge.py::_SEM_TRAVESSIA_DECLARADA`;
* `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py::_SEM_CAMINHO_HOJE`.

**Quando a aba 05 fechar, as duas linhas saem** — e as réguas voltam a cobrá-las
sozinhas, que é o desenho delas.

### 2. Para a frente da aba 05, sem redecidir nada

* `SEM_DONO["barra:motor"]` (`interface/pacotes/a05_vibracao.py:64`) **pode
  morrer, com a razão datada.** Ele dizia que faltavam duas metades e que a
  segunda era **a palavra dela** — *"uma barra por lado manda meio par, e é ela
  que decide se as duas viram um controle só"*. **Ela decidiu em 04/09/2026:** as
  duas barras NÃO mandam `rumble.set`; elas são política por motor. A metade (a)
  — o desenho, `aba05._coluna` chamando `_barra(..., arrasta=True,
  papel="motor")` — continua sendo a única que falta, e é dessa frente.
* A aba 05 **lê** os dois números do `state_full` (por peça) e **escreve** por
  `rumble.motores.set {uniq, forte_pct, fraco_pct}`.
* **A faixa da barra é 0–100, e o `0` é escolha válida** ("este motor não treme
  neste perfil"). O acima de 100 é recusado na borda, com a razão pronta para a
  tela reproduzir em vez de digitar.
* A aba 05 recebe também, e **nenhuma das duas é desta sprint**: a **linha de
  estado por coluna** (D-14, três estados) e o **recado de sucesso no cartão**
  (D-01). As duas já decididas.

### 3. Um achado de outra posse, relatado e não consertado

`app/ipc_bridge.rumble_stop()` **não devolve o passthrough** — deixa
`rumble_active=(0,0)`, e a partir daí `apply_game_rumble` descarta o FF de todo
jogo (primeira linha da função). Quem chamar `rumble_stop` achando que "parou de
mexer" deixa a máquina sem vibração em jogo, sem nenhum sinal. O meu instrumento
já se defende sozinho (fotografa e devolve), mas **a assimetria entre
`rumble_stop` e `rumble_passthrough` é do produto**, e vale uma frase na tela ou
um `rumble_stop(devolver_passthrough=True)`. Não editei: `ipc_bridge.py` não é
desta posse.
