# PARIDADE-NO-JOGO-D1 — o cabo, o rádio e a terceira coluna

Árvore: `/mnt/Apate/Desenvolvimento/hefesto-voo/PARIDADE-NO-JOGO-D1-opus`,
branch `voo/PARIDADE-NO-JOGO-D1-opus`, nascida de `dev` em `b794eb1b`.

**Nenhuma linha de produto foi tocada.** `src/` e `docs/data/mapa-controles.csv`
estão em `nao_toca` e o `git status` dos dois está vazio. Esta entrega é um
arquivo: este.

A encomenda dela:

> *"agora que finalmente deixamos o modo BT totalmente pareado com o modo cabo.*  <!-- noqa-acento: citação literal dela -->
> *Incluindo até os sons e mic (…) e se essas features vão funcionar nos jogos.*  <!-- noqa-acento: citação literal dela -->
> *Preciso de uma auditoria nesse sentido pra procurar por falhas de conexões e*  <!-- noqa-acento: citação literal dela -->
> *afins"*  <!-- noqa-acento: citação literal dela -->

---

## §0 — A RESPOSTA, e ela cabe em quatro frases

1. **Dentro do jogo, o transporte quase sempre é INVISÍVEL — e isso é desenho,
   não sorte.** O gamepad virtual apresenta ao jogo, sempre, o descritor HID do
   CABO: 289 bytes, byte a byte iguais aos do DualSense no fio. Medido hoje, na
   máquina dela, com o controle no cabo (§1).
2. **Seis das dez features dela não mudam nada entre cabo e rádio dentro do
   jogo. Quatro mudam** — microfone, alto-falante, barra de luz e LED de
   jogador —, e as quatro mudam por razões diferentes (§4).
3. **A terceira coluna tem 40 células — 10 features × 4 caminhos de jogo — e
   SETE estão medidas.** As outras 33 são `não medido`. **Os dois caminhos com
   ZERO medições são justamente os dois que o produto menos cobre**: o jogo
   nativo aberto do terminal e o Proton fora da Steam (§3, §5).
4. **A pergunta da terceira coluna não é uma, são três**, e trocá-las é a
   armadilha desta auditoria: para as features de ENTRADA pergunta-se *o jogo
   recebeu?*; para as de SAÍDA a escada da casa **acaba antes do jogo**, e a
   pergunta certa é *quem vence quando o jogo também escreve?* (§2).

```
TERCEIRA COLUNA: 40 células (10 features x 4 caminhos) · 7 medidas dentro do jogo · 33 não medido
por caminho: {'C1 nativo': 0, 'C2 Steam+SI': 4, 'C3 Steam−SI': 3, 'C4 Proton fora': 0}
o transporte muda dentro do jogo? respondido para 10/10 features
   SIM: 4 · NÃO: 6
mapa INTEIRO: 311 linhas x 2 transportes = 622 células · 0 num degrau de JOGO
```

O programa que produziu esses números, com a mordida, está na §9.

**E das SETE medidas, uma responde «não funciona» — é a resposta mais dura desta
página:** o touchpad **não responde dentro do jogo pelo rádio**, medido por ela
em 16/08/2026, com o repasse ao vpad íntegro e sem causa isolada até hoje. É a
única célula negativa das quarenta, é a mais antiga em aberto, e a §4 desta
auditoria oferece uma causa candidata que ninguém testou (§5.1).

---

## §1 — O ACHADO QUE ORGANIZA TUDO: o vpad é sempre um DualSense de CABO

**MEDIDO HOJE, 11/09/2026, na máquina dela**, com um DualSense no cabo e o
daemon vivo. Leitura pura de `sysfs`: nenhum byte escrito, nenhum nó aberto,
nenhuma disputa com o daemon.

```
físico  0003:054C:0CE6  →  report_descriptor  289 bytes
vpad    0003:054C:0DF2  →  report_descriptor  289 bytes
cmp -s  →  IDENTICOS
```

Os dois começam `05010905a1018501...` e terminam `...09369503b102c0`. É o
`CANONICAL_DESCRIPTOR_USB` de `src/hefesto_dualsense4unix/integrations/uhid_blueprint.py`,
fossilizado de um DualSense no fio em 16/07/2026, e o próprio módulo diz por quê:

> *"O vpad é sempre `BUS_USB` emitindo report 0x01 de 64 B, independente do
> transporte do físico — por design (o descriptor BT com `85 31` é impróprio por
> construção)."*

**A CONSEQUÊNCIA É O ARGUMENTO INTEIRO DESTA AUDITORIA.** Para toda feature que
atravessa o vpad, a pergunta *"funciona no rádio dentro do jogo?"* **não é uma
pergunta de transporte**. O jogo não vê rádio: ele vê um DualSense USB. A
pergunta se degenera em *"o daemon consegue ler do físico / escrever no físico
pelo rádio?"* — que é a coluna 1 e a coluna 2, e o `mapa-controles.csv` já as
responde linha a linha.

**A terceira coluna, então, só ganha conteúdo próprio onde o vpad NÃO é o
caminho.** É exatamente aí que estão as quatro features que mudam (§4), e é por
isso que a pergunta dela — *"incluindo até os sons e mic"* — mira certo: **som e
microfone são as duas que não passam pelo vpad de jeito nenhum.**

### 1.1 O que mais ficou medido hoje, na mesma leitura

Os quatro nós de entrada do físico e os quatro do vpad são os mesmos, com as
mesmas capacidades declaradas:

| | físico (cabo) | vpad (uhid) |
| --- | --- | --- |
| gamepad | `EV=20000b KEY=7fdb… ABS=3003f FF=107030000` | **idênticos** |
| Motion Sensors | `PROP=40 EV=19 ABS=3f` | **idênticos** |
| Touchpad | `PROP=5 EV=b ABS=260800000000003` | **idênticos** |
| Headset Jack | `EV=21 SW=14`, com os kcontrols de ALSA | `EV=21 SW=14`, **sem** os kcontrols |

A última linha é a assimetria de hoje, e ela é a §4 antecipada: **o vpad tem o
nó de jack e não tem placa de som.** Som e microfone não moram ali.

E as permissões, que decidem quem alcança o quê:

```
/dev/hidraw4  (vpad   054c:0df2)  crw-rw----+   ← ACL: a sessão dela abre
/dev/hidraw5  (físico 054c:0ce6)  crw-------    ← só root: o broker escondeu
```

**Isto é o invariante funcionando, medido no nó e não no código.** O
`esconder_o_fisico_para_o_jogo` de
`src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py` mantém o `hidraw` do
físico fora do alcance de qualquer processo da sessão, e o `daemon.state_full`
confirma `primary_grab_state: "held"` no evdev.

**E isto CORRIGE uma leitura confortável desta casa sobre o caminho do Proton.**
A preocupação registrada é que o `winebus` entrega `hidraw` à família Sony
inteira por padrão, e que sem `PROTON_DISABLE_HIDRAW` o jogo escreveria no
físico. **Com o broker escondendo, ele não conseguiria nem abrir o nó** — o
`winebus` roda como ela, e o nó é `crw-------`. A env é a segunda tranca, não a
primeira. Onde a primeira NÃO existe está dito na própria função: Modo Nativo,
emulação desligada ou vpad morto ⇒ **não esconde nada**, porque *duplicado >
zero controles*.

---

## §2 — A TERCEIRA COLUNA NÃO É UMA PERGUNTA, SÃO TRÊS

### 2.1 A escada da casa tem CINCO degraus, e o enunciado desta sprint colapsa dois

O dono é `scripts/check_paridade_transporte.py`, `ESCADA`:

| degrau | direção | quem fecha |
| --- | --- | --- |
| `MONTOU` | saída | a suíte |
| `SAIU NO FIO` | saída | a bancada |
| `O APARELHO OBEDECEU` | saída | **a mão dela** |
| `O JOGO RECEBEU` | entrada | **um instrumento** (o inode do vpad em `/proc/<pid>/fd`) |
| `O JOGO REAGIU` | entrada | **só ela** |

O enunciado desta sprint diz «`CHEGOU AO JOGO`» como quarto degrau. **A casa
separa os dois de propósito, e a diferença decide o custo:** `O JOGO RECEBEU`
fecha com um script rodando de fora, sem ela; `O JOGO REAGIU` não tem
instrumento nenhum e nunca vai ter — *"nenhum instrumento desta casa lê o estado
interno de um jogo sob Proton, e nenhum vai ler"*. Uso o vocabulário do dono,
não o do enunciado.

### 2.2 Para as features de SAÍDA a escada ACABA antes do jogo — e isso não é buraco

`DIRECAO_POR_CANAL`, no mesmo arquivo, diz que `hidraw`, `sysfs`, `dbus` e
`alsa-pipewire` andam **para o aparelho**, e `evdev` e `uhid` andam **para o
jogo**. Logo:

| feature | canal | último degrau possível |
| --- | --- | --- |
| giroscópio · acelerômetro · touchpad · bateria · jack | `evdev`/`uhid` | `O JOGO REAGIU` |
| gatilhos · vibração · barra de luz · LED de jogador · som · microfone | `hidraw`/`sysfs`/`alsa-pipewire` | **`O APARELHO OBEDECEU`** |

**Cobrar «o jogo recebeu a barra de luz» é cobrar um degrau que não existe.** A
irmã AUDITORIA-SOM-GIRO-01, desta mesma leva, chegou à mesma conclusão pelo lado
do áudio, e a frase vale igual aqui.

**Então qual é a pergunta certa para as seis de saída?** É esta, e ela é a
entrega conceitual desta auditoria:

> **Com o jogo aberto, quem VENCE quando o jogo — ou a Steam — também escreve no
> mesmo canal?**

Não é «funciona». É **disputa**. E ela tem três resultados possíveis, todos já
observados nesta casa: *ela vence*, *o jogo vence*, *a Steam vence*.

### 2.3 A tabela das três perguntas

| direção | a pergunta de «dentro do jogo» | quem fecha | instrumento |
| --- | --- | --- | --- |
| **ENTRADA** (giro, accel, touchpad, bateria, jack) | o jogo abriu o nó, e reagiu? | instrumento + ela | `scripts/ensaios/o_jogo_segura_o_nosso_no.py` (o inode) |
| **SAÍDA HID** (gatilhos, vibração, luz, LED) | **quem vence a disputa** | **só ela, com o jogo aberto** | nenhum — a régua é o olho dela |
| **SOM** (alto-falante, microfone) | algum fluxo da árvore do jogo aponta para o nó daquele controle? | instrumento | existe para o microfone (`integrations/quem_ouve_o_microfone.py`); **não existe para o alto-falante** |

O buraco do alto-falante foi achado pela irmã desta leva e eu o confirmo aqui
por um caminho diferente: **o produto SABE quando um jogo escreve áudio, e joga
fora.** Ver §5.4 — com uma amostra viva, medida hoje.

---

## §3 — OS QUATRO CAMINHOS, medidos no código

Os quatro nomes que uso no resto da página:

| | o que é | o wrapper roda? | o que o jogo recebe |
| --- | --- | --- | --- |
| **C1** | jogo nativo aberto do terminal / AppImage, sem lançador | **não** (`$SteamAppId` vazio) | nada de ambiente |
| **C2** | jogo da Steam com Steam Input **LIGADO** (appid na lista de exceção) | sim | a mesma env de qualquer outro jogo |
| **C3** | jogo da Steam com Steam Input **DESLIGADO** — o padrão | sim | `IGNORE_DEVICES` (com cobertura), `PROTON_DISABLE_HIDRAW`, `SDL_JOYSTICK_HIDAPI` |
| **C4** | Proton/Wine por lançador **fora** da Steam (Heroic, Lutris) | **não** | nada de ambiente |

**O portão que separa C1/C4 de C2/C3 é uma linha de shell:**
`assets/hefesto-launch.sh` sai sem exportar coisa alguma quando `$SteamAppId`
está vazio, é `0` ou não é numérico. Nenhum jogo do Heroic, do Lutris, do
RetroArch, do Dolphin ou do mGBA tem um — e o próprio produto diz isso na tela,
em `src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py`.

**A única cura escrita para os outros lançadores está SEM CHAMADOR.**
`src/hefesto_dualsense4unix/integrations/cura_por_estrada.py` sabe escrever o
`config.json` do Heroic e o override de Flatpak, e o botão que a chamava saiu da
tela em 10/09/2026. Hoje ela é código que ninguém executa.

**E o Steam em Flatpak/Snap também fica de fora**, de propósito:
`src/hefesto_dualsense4unix/integrations/steam_launch_options.py` pula o `vdf` de
instalação em caixa, porque o wrapper do hospedeiro é invisível lá dentro.

### 3.1 O que cada caminho faz com a disputa da SAÍDA

Esta é a metade que decide as seis features de saída, e ela é **ortogonal ao
transporte**:

| caminho | ENTRADA (quem o jogo enxerga) | SAÍDA (luz, gatilhos, LED) |
| --- | --- | --- |
| **C1** | vpad + o físico ainda ENUMERA (o `EVIOCGRAB` cala o físico, não o apaga da lista do SDL) ⇒ **dois controles, um mudo** | o Hefesto, salvo se o jogo achar o `hidraw` do vpad |
| **C2** | o Hefesto **perde**: solta o grab e esconde o físico; a Steam entrega a entrada | o Hefesto **ganha**: medido, os ajustes dela venceram |
| **C3** | o Hefesto **ganha**: o vpad é o único dispositivo | o Hefesto **perde** para um jogo que fale DualSense nativo: medido |
| **C4** | vpad + físico enumerando, sem `IGNORE` ⇒ **dois controles, um mudo** | o Hefesto, e o `hidraw` do físico está fechado pelo broker (§1.1) |

A inversão de C2 × C3 é medida, com o olho dela, em
`docs/process/sprints/2026-08-06-CONTROLE-SONY-MEDIDO-01-o-experimento-que-decide-metade-da-doutrina.md`.
Ela **não vale para a vibração**: no rumble a política é a contrária, e a
usuária vence mesmo fora da lista.

### 3.2 A caixa do Flatpak — um buraco que ninguém tinha nomeado deste lado

`src/hefesto_dualsense4unix/integrations/sandbox_dos_lancadores.py` responde *"o
controle entra na caixa?"* lendo `[Context] devices=`, e aceita **dois** tokens:
`all` e `input`.

**`input` é aprovado — e `--device=input` abre `/dev/input`, não `/dev/hidraw`.**
O próprio módulo escreve isso, e conclui que *"para o controle do Hefesto isso
não muda nada, porque o que o jogo lê é o virtual"*. **A conclusão vale só para o
caminho evdev.** As dez linhas que `integrations/ponte_escada.py` declara como
«só chegam ao jogo por `uhid`» — giroscópio, acelerômetro, os dois pontos de
toque, o clique, o rumble por FF e o roteado, a réplica do output, o jack e a
bateria — **viajam pelo `hidraw` do vpad**, e `devices=input` não o abre.

Hoje isso é latente, não vivo: os cinco lançadores dela trazem `devices=all`,
medido em 09/09. **Mas a régua da caixa daria VERDE para uma caixa que custa
dez features**, e essa é a definição de instrumento que responde sobre outra
coisa.

---

## §4 — O TRANSPORTE MUDA DENTRO DO JOGO? — dez de dez, respondido

Esta é a coluna que ela pediu, reduzida à pergunta que importa. **Leitura de
código desta árvore, com a medição de hoje por trás.**

| # | feature | muda? | por quê, medido |
| --- | --- | --- | --- |
| 1 | **giroscópio** | **NÃO** ¹ | atravessa a janela crua de 25 B copiada ao report `0x01` do vpad, que é sempre o do cabo. Zero matemática no caminho |
| 2 | **acelerômetro** | **NÃO** ¹ | mesma janela, bytes 21-26 |
| 3 | **touchpad** | **NÃO** ¹ | mesma janela, pontos em 32-35 e 36-39; o clique por caminho próprio, bit `0x02` do byte 9 |
| 4 | **microfone** | **SIM, e é a maior** | cabo: placa ALSA de verdade (medida hoje, `card 3`). rádio: **não existe placa nenhuma** — é Opus tunelado no HID, decodificado à mão pelo produto, e o `0x32` tem de estar ligado |
| 5 | **alto-falante** | **SIM** | cabo: sink do PipeWire com `module-loopback`. rádio: report `0x35` a cada 10,667 ms, ponte do produto desde 10/09 |
| 6 | **gatilhos adaptativos** | **NÃO** | nenhum gate de transporte em ponto nenhum do caminho; a única ramificação é a escolha do envelope (`0x02` × `0x31`) |
| 7 | **vibração** | **NÃO** | idem, e está escrito na célula: *"Não existe filtro de transporte em NENHUM ponto do caminho de vibração"* |
| 8 | **barra de luz** | **SIM, na ROTA** | por Bluetooth a escrita de LED no fluxo é suprimida, e a réplica do jogo sai por um `0x31` **avulso**, com gate explícito `if transporte != "bt": return False` |
| 9 | **LED de jogador** | **SIM, na ROTA** | mesmo par de gates, mesmo byte (`common[43]`) |
| 10 | **bateria** | **NÃO** | nibble baixo do byte 52 do report do vpad; mesmo caminho nos dois |

**¹ A EXCEÇÃO DAS TRÊS PRIMEIRAS, e ela é o achado novo desta auditoria.**

O portão de leitura do físico, por rádio, exige três coisas:
`len(report) == 78`, **bit de áudio DESLIGADO** e CRC-32 válido —
`src/hefesto_dualsense4unix/core/physical_report_reader.py`:

```python
    if report[1] & INPUT_FLAG_AUDIO:
        # Áudio, não input. Descartar é o certo: o payload aqui é Opus.
        return None
```

Descartar é o certo — foi essa linha que curou o PS-PRESO-01, *"o teclado e o
mouse com vida própria"*. **Mas o report descartado é o MESMO `0x31` de 78 bytes
que carregaria a janela de motion.** Com o microfone por rádio no ar, cada quadro
de áudio é um report a menos de giroscópio, acelerômetro e touchpad, e o
contador `bt_drops` os conta.

**A ordem de grandeza está medida nesta casa, e ela é grande:** no A/B de
25/07/2026 o fluxo por rádio se parte em **170,5 Hz de input + 106,2 Hz de
áudio** com o microfone ligado, contra **260,4 Hz de input** sem ele
(`docs/data/mapa-controles.csv`, chave `audio.microfone`). **A entrada cai 34%.**

**E o número tem uma ressalva que a própria célula carrega, e ela não pode ser
omitida:** aquele A/B tinha **UM controle**, e o `260,4 Hz` **deixou de valer
como número POR CONTROLE em 23/08/2026** — o orçamento é do **ADAPTADOR**
(~800 rel/s pelo relógio do sensor) e os controles o dividem. Ou seja: a
proporção *áudio contra input* é o que está medido; **o número absoluto com
quatro controles na mesa não existe**, e é razão para esperar o efeito PIOR,
não melhor.

> **Ligar o microfone por rádio custa giroscópio, acelerômetro e touchpad — e o
> custo é do JOGO, não da interface.**

**E SEJA PRECISO SOBRE O QUE É NOVO AQUI, porque metade disto a casa já dizia.**
A célula do mapa já diz *"o áudio não abre canal novo — divide a fila"*, e
`docs/protocol/paridade-bluetooth-versus-cabo.md` já dizia, **antes da cura**,
que *"mic por BT e giroscópio não coexistem"* — ali como defeito a consertar, e
o filtro do bit de áudio o consertou em 16/08/2026.

**O que nenhuma página junta é o degrau seguinte:** o filtro curou a *corrupção*
(o Opus lido como botão) e **não curou a divisão da fila** — os reports
continuam sendo gastos com áudio, e o que sobra menos é a **janela de motion que
vai para o vpad**, isto é, para o JOGO. A casa registra o custo como uma TAXA de
entrada; ninguém o escreveu como **perda de feature dentro do jogo**, e a tela
não avisa. É exatamente o par que ela nomeou na encomenda — *"incluindo até os
sons e mic"* — e é o gesto **P2** da §7.

---

## §5 — A TERCEIRA COLUNA, célula a célula

Sete de quarenta. Cada linha medida traz a data e a testemunha; `não medido` é
resposta legítima e está escrita como tal.

| feature | C1 nativo | C2 Steam+SI | C3 Steam−SI | C4 Proton fora |
| --- | --- | --- | --- | --- |
| giroscópio | não medido | não medido ² | não medido | não medido |
| acelerômetro | não medido | não medido ² | não medido | não medido |
| touchpad | não medido | não medido ² | **16/08, olho dela: NÃO reage, no rádio** | não medido |
| microfone | não medido | não medido | não medido | não medido |
| alto-falante | não medido | não medido | não medido | não medido |
| gatilhos adaptativos | não medido | **06/08: o preset DELA segurou** | **06/08: o JOGO venceu (moles)** | não medido |
| vibração | não medido | **11/08: 4 controles, 2 transportes** | não medido | não medido |
| barra de luz | não medido | **06/08: a cor DELA ficou** | **06/08: o JOGO venceu (azul)** | não medido |
| LED de jogador | não medido | **11/08: 4 controles, 2 transportes** | não medido | não medido |
| bateria | não medido | não medido | não medido | não medido |

**² O RISCO DE C2 TEM MECANISMO, e está escrito para não virar surpresa.** Com o
Steam Input ligado, a Steam cria **um espelho Xbox 360 (`28de:11ff`) por
controle que enxerga**. O pacote do Xbox 360 tem vinte bytes desde 2005, treze
consumidos, e **não há onde pôr** três eixos de giro, três de acelerômetro e dois
pontos de toque — a razão inteira está em
`docs/protocol/pilha-steam-input-xpad-sdl.md`, §1.5. **Se o jogo escolher o
espelho, as três primeiras features desta tabela não têm por onde viajar.** Em
11/08, com o jogo aberto, a varredura não achou espelho nenhum — mas isso foi
uma medição de um dia, e o mecanismo continua de pé.

### 5.1 A célula que responde «não funciona», e é a mais antiga em aberto

`toque.touchpad@dualsense`, `radio_ressalva`, 16/08/2026, com o controle na mão
dela e o jogo aberto por `winedevice.exe` (ou seja: Proton, pela Steam — C3):

> *"engraçado que o touch tá funcionando fora do jogo no modo bt mas no jogo*  <!-- noqa-acento: citação literal dela -->
> *não"*  <!-- noqa-acento: citação literal dela -->

E a célula é honesta sobre o que isso significa:

> *"Como o repasse está íntegro, a falha é DEPOIS do vpad e continua SEM CAUSA.
> Quem ler `radio_aciona = sim` aqui está lendo «o vpad entrega», não «o jogo
> reage»."*

**O QUE ESTA AUDITORIA ACRESCENTA, e muda o que a medição vale:** ela mediu
*rádio-fora-do-jogo* contra *rádio-dentro-do-jogo*. **O braço do CABO dentro do
jogo nunca foi medido.** Logo não se sabe se isto é uma falha de PARIDADE (o
rádio falha e o cabo não) ou uma falha dos DOIS que só se olhou de um lado. A
§1 dá a razão para suspeitar do segundo: dentro do jogo o vpad é idêntico nos
dois transportes, e não há gate de transporte no caminho do touchpad depois do
portão de leitura.

**E a §4 dá uma hipótese candidata, que eu declaro FRACA de propósito:** se o
microfone por rádio estivesse no ar naquela bancada, 34% dos reports estavam
sendo descartados — e o touchpad viaja neles. **O que enfraquece a hipótese é
medido:** a ponte do microfone **nasce desligada**, por opt-in, e o ensaio de
16/08 **não registra** se ela estava de pé. Então isto não é uma causa proposta;
é uma variável que aquela bancada não controlou, e que a próxima tem de
controlar. O P2 da §7 a separa em dez minutos, nos dois sentidos.

### 5.2 O que a medição de C2/C3 REALMENTE diz — e a armadilha de ler mais

As quatro células de C2 e as duas de C3 **não dizem «a feature funciona»**.
Dizem quem ganhou a disputa. A diferença é cara:

- em **C2** (Mullet Mad Jack, na lista) *"os gatilhos dela seguraram e a cor dela
  ficou"* — isto é **o Hefesto não sendo atropelado**, não o jogo comandando o
  gatilho;
- em **C3** (Sackboy, fora da lista) os gatilhos ficaram **moles** e a barra
  **azul** — isto é **o jogo comandando e o aparelho obedecendo**, que é a
  feature funcionando no jogo, com a configuração dela perdida.

**São resultados opostos e os dois são «funciona», dependendo de quem pergunta.**
É por isso que a tabela diz *quem venceu* e não *sim/não*.

### 5.3 O que a medição de 11/08 acrescenta, e ela está no mapa sem contar

O aceite dela, com um jogo em sessão, quatro controles na mesa, **dois no cabo e
dois no rádio**:

> *"na hora do vamos ver os 4 conectaram certinho. cada qual com seu player*  <!-- noqa-acento: citação literal dela -->
> *rumble e afins"*  <!-- noqa-acento: citação literal dela -->

Esse texto está HOJE em `cabo_evidencia` **e** em `radio_evidencia` de três
linhas do mapa: `luz.led_jogador`, `vibracao.rumble.direito` e
`vibracao.rumble.esquerdo`. **É a única medição in-game da casa que cobre os dois
transportes ao mesmo tempo, e o `ate_onde_foi` dessas células nunca passou de
`MONTOU` / `O APARELHO OBEDECEU`** — porque, como a §2.2 mostra, para features
de saída não há degrau acima. A evidência está guardada num campo que nenhuma
régua lê como degrau.

### 5.4 O produto MEDE o jogo escrevendo áudio no vpad — e joga fora. Com amostra viva

Medido **hoje**, pelo `daemon.state_full` da máquina dela (leitura pura por
JSON-RPC, o mesmo `daemon.status` que o wrapper faz a cada lançamento):

```
output_count: 3          visto_ha_s.output: 8437.8
audio_do_jogo_amostra: {flag0: 160, fone: 0, alto_falante: 100, microfone: 0, rota: 48}
ff_ultimos_reports[0]: {ha_s: 8443.6, flag0: 0, flag1: 0, flag2: 2,
                        weak: 0, strong: 0, ramo: "parada_sdl"}
trigger_replicas: 0   lightbar_replicas: 0   player_led_replicas: 0
```

Alguém escreveu **três** output reports no `hidraw` do vpad há ~2h20, e um deles
pediu **volume de alto-falante 100 e rota `0x30`**. O produto guardou a amostra e
**não replicou um byte** — está escrito no fonte:
`integrations/uhid_gamepad.py`, *"**O carimbo NÃO replica nada.** Ele mede. A
replicação dos bytes de áudio continua não existindo."*

**E AQUI EU APLICO A ARMADILHA Nº 1 A MIM MESMO.** Seria fácil escrever *"um
jogo pediu som no controle e o Hefesto ignorou"*. **Não há jogo nenhum nesta
máquina agora** — nem Steam, nem Proton, nem lançador (varredura de processos,
hoje). Os dois candidatos a autor são o **`hid-playstation` do kernel**, que
está ligado ao vpad e escreve output na probe e emite um efeito zerado no
`input_ff_flush` de todo `close()` — e a forma do report bate exatamente com
isso (`flag0=0, flag1=0`, motores zerados, ramo `parada_sdl`). **A atribuição
honesta é: o canal foi exercido, o autor mais provável é o kernel, e nenhum jogo
foi observado.** O que o dado prova é o mecanismo — os bytes de áudio do jogo
chegam e morrem ali —, não que um jogo os tenha mandado.

### 5.5 E o que o caminho de ENTRADA está entregando agora

Do mesmo `state_full`, e serve de linha de base para o roteiro:

```
motion_hz: 248.6        motion_forwards: 2.110.131
battery_forwards: 2     bateria_no_jogo: {pct: 100, carregando: true}
jack_forwards: 0        touchpad_clicks: 0
game_open: true         game_signal.authority: "daemon"
```

`motion_hz: 248,6` é o cabo entregando os 250,0 Hz previstos, **até o vpad**.
`game_open: true` **não é jogo** — é a sessão uhid aberta, e o próprio produto
veta a leitura: *"é «alguém segura este nó», nunca «o jogo recebeu»"*. Sem jogo
na máquina, quem a segura é o driver.

---

## §6 — AS FALHAS QUE ACHEI, e os endereços

### 6.1 Falhas de paridade cabo × rádio que tocam o jogo

| # | o quê | onde | grau |
| --- | --- | --- | --- |
| **F1** | **O microfone por rádio come 34% dos reports de entrada** — e com eles a janela de motion que vai ao JOGO: giroscópio, acelerômetro e touchpad. A casa registra o custo como TAXA; ninguém o escreveu como perda de feature dentro do jogo, e a tela não avisa (§4) | `core/physical_report_reader.py` (o gate de áudio); os números em `mapa-controles.csv`, `audio.microfone` | **derivado de duas medições desta casa**, nunca observado junto |
| **F2** | **A barra de luz e o LED de jogador saem por ROTAS diferentes** por transporte: o fluxo suprimido por BT e um `0x31` avulso no lugar. O caminho de rádio é o único com gate explícito | `core/backend_pydualsense.py` (`_suppress_leds`, `_pintar_por_hidraw_bt`) | lido no fonte |
| **F3** | **O alto-falante e o microfone são mecanismos DIFERENTES**, não o mesmo degradado — placa ALSA × túnel Opus em HID | `integrations/audio_control.py`, `integrations/alto_falante_bt.py`, `integrations/dualsense_bt_audio.py` | medido (placa hoje; `0x35` em 10/09) |
| **F4** | **O touchpad não reage no jogo pelo rádio** — e o braço do cabo nunca foi medido, então nem se sabe se é assimetria | `mapa-controles.csv`, `toque.touchpad` | olho dela, 16/08 |

### 6.2 Falhas que NÃO são de transporte, e mordem o jogo igual

| # | o quê | onde |
| --- | --- | --- |
| **F5** | **Trocar «Sons do jogo» ↔ «No controle e na TV» num controle cujo nó já está publicado não religa loopback nenhum.** `_ligar_a_rota` tem um único chamador, dentro do `iniciar()`, e o reconciliador pula quem já tem nó. A escolha dela só vale quando o nó for reconstruído | `integrations/alto_falante_bt.py`, `daemon/subsystems/alto_falante.py` |
| **F6** | **`devices=input` é aprovado pela régua da caixa e não abre o `/dev/hidraw`** — as dez features de `uhid` cairiam com a régua verde (§3.2) | `integrations/sandbox_dos_lancadores.py` |
| **F7** | **C1 e C4 entregam o jogo com DOIS controles, um mudo.** O `EVIOCGRAB` cala o físico, não o apaga da enumeração do SDL; quem o apaga é o `IGNORE_DEVICES`, que nesses dois caminhos nunca sai | `daemon/subsystems/gamepad.py`, `assets/hefesto-launch.sh` |
| **F8** | **A única cura escrita para os lançadores fora da Steam está sem chamador** desde 10/09 | `integrations/cura_por_estrada.py` |

**F5, F6 e F8 não são meus para consertar** — e nenhum deles é sequer de
transporte. Ficam escritos com endereço, que é o que a §5 da sprint pede.

### 6.3 O que eu proponho mudar no `mapa-controles.csv` — e NÃO toquei

O arquivo está em `nao_toca` e o `git status` dele está vazio. Duas células que
a leitura de hoje derruba:

**[1] `audio.microfone.mudo@dualsense`, `assimetria_declarada` — CADUCA.**
Ela diz hoje:

> *"`_mic_mute_desejado` é atributo de INSTÂNCIA do handle, o handle é recriado
> a cada reconexão e o `_reapply_desired` não o re-pendura. Como reconexão é
> rotina no rádio e exceção no cabo, o mesmo defeito aparece como `parcial` por
> BT e como `sim` por USB."*

**A cura entrou em 06/09/2026 (MIC-BT-DONO-01).** Hoje existe
`_mic_mute_by_uniq` no CONTROLADOR, gravado por `_registrar_posse_do_mudo` e
**rependurado no handle novo pelo `_reapply_desired`**, antes do
`_write_partial_output` e de propósito — tudo em
`src/hefesto_dualsense4unix/core/backend_pydualsense.py`, com régua viva em
`tests/unit/test_o_mudo_do_microfone_sobrevive_a_reconexao.py`, cujo docstring
começa dizendo que o atributo do handle *"**era**"* a fonte. O atributo continua
existindo, mas virou o eco. **Proposta: substituir o texto e reavaliar o
`radio_aciona = parcial`, que tinha esta como causa declarada.**

**[2] `audio.alto_falante@dualsense`, `radio_aciona = não` — NÃO mudar ainda, e
digo por quê.** O som saiu pelo rádio em 10/09 com a orelha dela, 70 segundos
sem corte. A célula fica em `não` **por disciplina**: faltam o negativo de rota e
o teste cego, que são os gestos G1 e G2 de
`docs/process/sprints/2026-09-10-OS-GESTOS-QUE-SO-ELA-PODE-FAZER.md`. Registro
aqui para que ninguém a suba por engano lendo a canônica.

**E uma observação estrutural sobre a coluna `ponte_alcanca`:** ela existe no
mapa, está preenchida em **10 das 111** linhas `@dualsense`, todas com
`gamepad/dualsense` e todas `inferido-do-codigo`. **Ela modela a MÁSCARA, não o
caminho do jogo** — não há nela noção de Steam Input, de Proton, nem de
lançador. É por isso que a terceira coluna desta auditoria não cabe no mapa como
ele é hoje, e a decisão de como (ou se) acomodá-la é de quem tem a posse dele.

---

## §7 — O ROTEIRO DELA — cinco gestos, 65 minutos

Escritos no molde de
`docs/process/sprints/2026-09-07-O-COMO-DO-MAPA-o-gesto-das-178-celulas.md`.

**Eles NÃO repetem** os sete de
`docs/process/sprints/2026-09-10-OS-GESTOS-QUE-SO-ELA-PODE-FAZER.md` (que são da
direção de saída, fora do jogo) nem os sete da AUDITORIA-SOM-GIRO-01 desta mesma
leva (que são de som, movimento e toque). **Estes cobrem o que nenhum dos dois
cobre: gatilhos, vibração, luz, LED de jogador e bateria DENTRO do jogo, e a
bifurcação Steam Input ligado × desligado.**

**Se o tempo der para um só, é o P1.** Ele fecha quatro das dez features de uma
vez, nos dois transportes, e é o único que pode derrubar a leitura mais
confortável desta casa — a de que a saída do Hefesto sobrevive ao jogo.

---

### P1 · A disputa da saída, com o Steam Input ligado e desligado — 25 min, 2 controles, 1 jogo

**O que isto prova.** Prova quem ganha a barra de luz, o gatilho, o LED de
jogador e a vibração quando o jogo está aberto — e prova se a resposta muda
entre o controle no cabo e o controle no rádio. As quatro features de saída, os
dois transportes, os dois modos da Steam, numa sessão só.

**Onde olhar.** No CONTROLE, não na tela: a barra de luz do P1 e a do P2, as
lâmpadas de numeração de cada um, o gatilho L2 debaixo do dedo e o tremor na
mão. Na tela do Hefesto você só prepara: aba Iluminação para pôr uma cor que o
jogo nunca escolheria, e aba Gatilhos para pôr uma resistência que se sinta.

**Os passos.**

1. Ponha o **P1 no cabo** e o **P2 no rádio**, e confira na fita do topo que os
   dois dizem isso.
2. Na aba Iluminação, pinte os DOIS de **magenta** — uma cor que nenhum jogo
   escolhe sozinho.
3. Na aba Gatilhos, aplique uma resistência FORTE nos dois, e aperte o L2 de
   cada um fora do jogo para sentir que ela está lá.
4. Abra um jogo que **não** esteja na lista de exceção do Steam Input (o padrão).
5. Com o jogo aberto e o controle na mão, olhe as duas barras: **anote a cor de
   cada uma**.
6. Aperte o L2 dos dois: **anote se a resistência continua**.
7. Faça o jogo vibrar (um tiro, uma batida) e **anote se os dois vibram**.
8. Olhe as lâmpadas de numeração dos dois e **anote quantas acendem em cada um**.
9. Feche o jogo.
10. Marque esse jogo em «Este jogo não funciona» (a exceção do Steam Input),
    feche a Steam, abra a Steam de novo e abra o jogo de novo.
11. Repita os passos 5 a 8 e anote as quatro respostas de novo.
12. Ponha as oito anotações lado a lado: P1 e P2, antes e depois da exceção.

**Passa quando.** Não há «passa» aqui: **o que se entrega é a tabela**. O que se
espera, pelo que já foi medido, é que **com a exceção LIGADA** o magenta e a
resistência dela sobrevivam nos dois controles, e que **com a exceção DESLIGADA**
um jogo que fale DualSense nativo devolva a barra ao azul e amoleça o gatilho.
**O resultado que mudaria a casa é qualquer diferença entre o P1 e o P2** — entre
cabo e rádio —, porque nenhum caminho de gatilho ou vibração tem gate de
transporte e a luz tem rota diferente.

**Por controle.**

* **P1** — No cabo, e é a referência. É nele que os quatro resultados de 06/08
  foram medidos; se ele se comportar diferente de lá, o que mudou foi o produto,
  não o transporte.
* **P2** — No rádio, e é onde a novidade pode aparecer. **A barra de luz é a
  suspeita nomeada**: por rádio ela sai por uma rota própria (o `0x31` avulso) e
  o cabo não usa essa rota. Se o magenta sobreviver no P1 e cair no P2, é achado,
  e é o primeiro da casa.
* Se você tiver **quatro** controles, ponha dois em cada braço: dois no cabo e
  dois no rádio. As testemunhas não são enfeite — se a cor cair nos dois do
  rádio, é o transporte; se cair num só, é aquele aparelho.

**A armadilha.** São três, e as três já custaram caro aqui. **(1) Um controle
respondendo não prova que o comando dele chegou**: se a barra ficar magenta, isso
pode ser o Hefesto repintando, não o jogo respeitando — por isso a cor tem de ser
uma que o jogo não escolheria, e por isso o gatilho e o LED entram junto: três
respostas concordando valem o que uma não vale. **(2) A exceção do Steam Input só
sobrevive com a Steam FECHADA** — abrir o jogo sem fechar e reabrir a Steam mede
o estado antigo e o resultado não diz nada. **(3) A ordem dos passos 5-8 importa
e não pode ser encurtada**: cada anotação é um gesto próprio, num controle
próprio; juntar duas faz você julgar duas features com uma lembrança só, que foi
exatamente o erro de régua de 16/08 (*"gire o controle E passe o dedo"* produziu
uma ausência falsa).

---

### P2 · O microfone por rádio contra o giroscópio — 10 min, 1 controle no rádio, 1 jogo

**O que isto prova.** Prova, ou derruba, o achado da §4 desta auditoria: que
ligar o microfone por rádio **rouba** reports de giroscópio, acelerômetro e
touchpad, porque os dois viajam no mesmo `0x31` de 78 bytes e o produto descarta
o de áudio.

**Ele NÃO é o J1 nem o J4 da auditoria irmã, e a diferença é o método.** O J1
pergunta *"o jogo abriu o nó?"* e responde com um instrumento lendo o inode; o
J4 pergunta *"quem está com a fonte do microfone aberta?"*. **Este pergunta se
as duas features se atrapalham**, e o único sensor que responde é ela: nenhum
instrumento desta casa mede giro e microfone no mesmo instante.

**Onde olhar.** Na aba Controles, no cartão do controle: o bloco do Microfone
(para ligar e desligar) e, depois, **dentro do jogo**, a mira — um jogo que use
giroscópio para mirar, ou o menu de um emulador que mostre os sensores.

**Os passos.**

1. Ponha um controle **no rádio** e confira na fita do topo.
2. Abra um jogo que use giroscópio, ou um menu que mostre o movimento.
3. Com o **microfone DESLIGADO**, gire o controle devagar e anote se a mira anda
   e se ela anda liso ou aos trancos.
4. Passe o dedo no touchpad e anote se ele responde.
5. **Ligue o microfone do controle** e fale alguma coisa, para confirmar que ele
   está no ar.
6. Gire o controle de novo, **do mesmo jeito**, e anote se a mira ficou pior —
   mais lenta, aos saltos, ou parada.
7. Passe o dedo no touchpad de novo e anote.
8. **Desligue o microfone** e repita os passos 3 e 4.
9. Anote as três voltas lado a lado: sem mic, com mic, sem mic de novo.

**Passa quando.** O achado se confirma se o movimento e o toque **pioram
visivelmente** com o microfone no ar e **voltam** quando ele sai. Ele cai — e
isso é resultado igualmente bom — se as três voltas forem indistinguíveis.

**Por controle.** Um só basta, e tem de estar **no rádio**: no cabo o microfone é
uma placa de som comum e não divide fio nenhum com o report de entrada, então
não há o que medir. **Se você tiver um segundo controle no cabo, deixe-o como
testemunha**: gire os dois juntos no passo 6 e veja se só o do rádio piora. Isso
separa «é o microfone» de «é o jogo engasgando».

**A armadilha.** **A volta do passo 8 é obrigatória e não é formalidade.** Esta
casa já publicou uma mordida furada por ter medido depois de uma corrida
anterior, sem desfazer o estado — *o aparelho tem memória, e ela sobrevive ao
processo que a escreveu*. Segunda: **controle parado dá zero amostras**, e zero
por imobilidade se lê como zero por defeito — gire de verdade nas três voltas.
Terceira, e é a que engana: **se nada piorar, isso não prova que o descarte não
acontece** — prova que ele não é grande o bastante para a mira sentir. O número
que fecharia de vez é o contador `bt_drops`, e ele não está na tela.

---

### P3 · A bateria dentro do jogo — 10 min, 1 controle, 1 jogo

**O que isto prova.** Prova que o nível de bateria do controle físico atravessa o
vpad e **aparece dentro do jogo**. É a única das dez features com ZERO medição em
qualquer caminho, e o gesto é barato.

**Onde olhar.** Na tela do JOGO: os jogos que mostram bateria a mostram no menu
de controles ou num ícone de canto. Do lado do Hefesto, a aba Controles mostra o
percentual do aparelho.

**Os passos.**

1. Com o controle **no cabo** e carregando, abra o jogo e procure onde ele mostra
   a bateria.
2. Anote o que o jogo diz e o que a aba Controles diz. Os dois têm de bater.
3. Feche o jogo, tire o cabo, conecte o mesmo controle **no rádio** e deixe-o
   descarregar um pouco (ou use um que já esteja pela metade).
4. Abra o jogo de novo e anote os dois números outra vez.
5. Se o jogo não mostrar bateria nenhuma, **anote isso como resultado** e diga
   qual jogo era.

**Passa quando.** O jogo mostra um nível, e ele bate com o da aba Controles, nos
dois transportes. **Um jogo que não mostre bateria nenhuma não reprova nada** —
reprova se ele mostrar e o número estiver errado, ou se mostrar «cheio e
carregando» com o controle no rádio pela metade.

**Por controle.** Um só, passando pelos dois braços. Trocar o MESMO aparelho de
braço é o que separa transporte de unidade — foi a troca de braços de 15/08 que
provou que a placa de áudio segue o BRAÇO e não a unidade.

**A armadilha.** **O valor de repouso do vpad é `0x1F`, que quer dizer «cheio e
carregando», e ele é deliberado** — zerado, o vpad anunciaria 5% descarregando
para sempre. Então um jogo mostrando «100%, carregando» com o controle no rádio
pela metade **não é o jogo mentindo: é o padrão do vpad aparecendo**, e isso é o
achado. Segunda: o nível chega ao report por BORDA, só quando o byte muda — um
controle que não mexe de nível durante a partida não gera evento nenhum, e
«não mudou» não é «não chegou».

---

### P4 · A luz e o gatilho num jogo FORA da Steam — 15 min, 1 controle, 1 jogo do Heroic ou do Lutris

**O que isto prova.** Prova o que acontece no caminho que o produto **não
alcança**: o wrapper não roda, nenhuma variável de ambiente sai, e o jogo abre
vendo o mundo como ele é. É a coluna C4 desta auditoria, hoje com zero medições
de dez.

**Onde olhar.** No menu de controles do jogo, para **contar quantos controles ele
lista**; e no controle, para a cor da barra e a resistência do gatilho.

**Os passos.**

1. Na aba Iluminação, pinte o controle de **magenta**; na aba Gatilhos, aplique
   uma resistência forte.
2. Abra um jogo pelo **Heroic** ou pelo **Lutris**.
3. No menu de controles do jogo, **conte quantos controles ele lista** e anote os
   nomes.
4. Mexa nos analógicos e veja **qual deles responde** — se houver dois, um deles
   vai estar mudo.
5. Olhe a barra de luz e anote a cor.
6. Aperte o L2 e anote se a resistência continua.
7. Faça o jogo vibrar e anote.
8. Feche o jogo e repita do passo 2 com o controle **no rádio**.

**Passa quando.** De novo, **o que se entrega é a tabela**. O esperado, pela
leitura de código, é que o jogo liste **DOIS** controles — o virtual do Hefesto e
o físico, que continua na lista mesmo calado. Se ele listar **um**, é achado
bom e muda o que a casa acredita sobre este caminho. Se listar dois e o jogador 1
cair no mudo, está explicada uma classe inteira de *"o controle não funciona
nesse jogo"*.

**Por controle.** Um só, nos dois braços. **Não ponha dois controles nesta
medição**: com dois físicos e dois virtuais a lista do jogo tem quatro entradas e
a contagem deixa de dizer o que se quer saber.

**A armadilha.** **O nome engana.** O controle físico e o virtual se chamam quase
igual — o virtual traz «(Hefesto P1)» no nome e o físico não. Anote o nome
INTEIRO dos dois, não «tem dois». Segunda: **se o jogo listar um só, confira qual
é antes de comemorar** — se for o físico e não o virtual, o perfil dela não está
valendo e o resultado é o contrário do que parece.

---

### P5 · A fileira das três rotas do som, trocada com o controle já na lista — 5 min, 1 controle

**O que isto prova.** Prova (ou derruba) o defeito **F5** da §6.2: que trocar
entre «Sons do jogo» e «No controle e na TV» num controle que **já está na
lista** não religa o caminho do som, porque quem liga a rota só roda quando o nó
nasce.

**Onde olhar.** Na aba Controles, no cartão do controle, a fileira dos três
botões de rota. E na TV e no controle, com o ouvido.

**Os passos.**

1. Com o controle já conectado e aparecendo na lista, toque uma música.
2. Clique em **«No controle e na TV»**.
3. Encoste o ouvido no controle: **o som tem de sair por ali, e continuar saindo
   na TV**.
4. Clique em **«Sons do jogo»** e confira que o som do PC voltou só para a TV.
5. Clique em **«No controle e na TV»** de novo e escute o controle mais uma vez.
6. Agora desconecte o controle, conecte de novo, espere ele voltar à lista, e
   **sem tocar em mais nada** encoste o ouvido nele com a música tocando.
7. Anote as três escutas: a primeira, a segunda (passo 5) e a de depois da
   reconexão.

**Passa quando.** O som sai do controle nas TRÊS escutas. **O defeito se
confirma se a primeira funcionar, a segunda (depois de ir e voltar no botão) não
funcionar, e a terceira (depois da reconexão) funcionar de novo** — porque aí o
que cura é o nó nascer, que é exatamente o que o código diz.

**Por controle.** Um só. **Este teste não é de transporte** — vale igual no cabo
e no rádio, e é por isso que ele é o mais barato da lista.

**A armadilha.** **«No controle e na TV» só tem som se o controle tiver rota de
saída** — no cabo isso quer dizer a placa dele, no rádio quer dizer a ponte de
pé. Se não sair som na PRIMEIRA escuta, o teste não começou e o resultado não é
sobre este defeito. Segunda, e ela vale para toda a fileira: **«Só no controle»
tira o som da TV** — se você passar por ele por engano e esquecer de voltar, a
máquina fica muda e parece defeito sem ser.

---

## §8 — O QUE ESTA AUDITORIA NÃO FEZ

- **Nenhum jogo foi aberto.** As 33 células `não medido` são `não medido` porque
  ninguém mediu, e as 7 medidas vêm de bancadas dela já registradas — 06/08,
  11/08 e 16/08. Esta sprint declara `bancada: false`.
- **Nada foi escrito em aparelho nenhum.** Tudo o que medi hoje é leitura:
  `sysfs`, `/proc`, `pactl`, e um `daemon.status`/`daemon.state_full` por
  JSON-RPC — a mesma chamada que o wrapper faz a cada lançamento de jogo. Nenhum
  `hidraw` foi aberto, o que é a armadilha nº 2 da sprint: **o instrumento que
  abre o `hidraw` disputa com o daemon e mente.**
- **Só havia UM controle na mesa, no CABO.** Tudo o que digo do rádio hoje é
  leitura de código e de medições anteriores desta casa. As duas colunas do
  rádio da §1.1 **não foram medidas hoje**.
- **Não abri janela nenhuma.** Esta sprint não toca tela.
- **Não toquei o mapa nem o `src/`.** As duas propostas de célula da §6.3 são
  propostas, e o `git status` dos dois caminhos está vazio.
- **Não li os símbolos de binário de jogo nenhum.** A distinção «jogo que fala
  DualSense por Steamworks» × «por HID direto», que explica C2 × C3, continua
  **SUSPEITA COM MECANISMO** desde 06/08 — e só abrir os executáveis a fecha.
- **O Pro Controller e o 8BitDo ficaram fora**, por decisão dela de 06/09: a
  tela é dos quatro DualSense.

---

## §9 — O CONTADOR, a mordida, e o aviso de que ele NÃO TEM GUARDA

O `40 / 7 / 33` da §0 é contagem, não impressão. O programa completo, tal como
rodou, com as dez features casadas às chaves do mapa e a terceira coluna
declarada célula a célula:

```python
# contar-a-terceira-coluna.py — rodado do scratchpad, fora da árvore
FEATURES = {"giroscópio": ["movimento.giroscopio", "movimento.giroscopio.jogo",
                           "movimento.giroscopio.taxa"], ...}   # 10 features, 35 chaves
CAMINHOS = ("C1 nativo", "C2 Steam+SI", "C3 Steam−SI", "C4 Proton fora")
TERCEIRA = {("touchpad", "C3 Steam−SI"): "16/08 olho-dela: no RÁDIO não reage", ...}  # 7 entradas
# as duas primeiras colunas vêm de cabo_ate_onde_foi / radio_ate_onde_foi do mapa,
# reduzidas pelo PIOR degrau entre as chaves da feature — nunca digitadas.
```

**A SAÍDA DE HOJE:**

```
TERCEIRA COLUNA: 40 células (10 features x 4 caminhos) · 7 medidas dentro do jogo · 33 não medido
por caminho: {'C1 nativo': 0, 'C2 Steam+SI': 4, 'C3 Steam−SI': 3, 'C4 Proton fora': 0}
o transporte muda dentro do jogo? respondido para 10/10 features
   SIM: 4 · NÃO: 6
mapa INTEIRO: 311 linhas x 2 transportes = 622 células · 0 num degrau de JOGO
```

**AS DUAS MORDIDAS, e as duas com a cura arrancada e devolvida.**

**1. O contador vê o mapa.** Uma CÓPIA do mapa, no scratchpad, com
`toque.touchpad` levado a `O JOGO REAGIU` no cabo:

```
COM A CURA (o mapa de verdade):
  mapa INTEIRO: 311 linhas x 2 transportes = 622 células · 0 num degrau de JOGO
MORDIDA (a cópia, uma célula em O JOGO REAGIU):
  mapa INTEIRO: 311 linhas x 2 transportes = 622 células · 1 num degrau de JOGO
git status --short docs/data/mapa-controles.csv  →  (vazio: intocado)
```

**2. O contador vê a terceira coluna.** Uma cópia do programa com UMA medição
apagada:

```
COM A CURA:
  40 células · 7 medidas dentro do jogo · 33 não medido
  por caminho: {'C1 nativo': 0, 'C2 Steam+SI': 4, 'C3 Steam−SI': 3, 'C4 Proton fora': 0}
MORDIDA (a medição da barra de luz em C2 apagada):
  40 células · 6 medidas dentro do jogo · 34 não medido
  por caminho: {'C1 nativo': 0, 'C2 Steam+SI': 3, 'C3 Steam−SI': 3, 'C4 Proton fora': 0}
```

Se o contador fosse cego, os dois lados dariam o mesmo número nas duas mordidas.

**3. A régua que guarda ESTE arquivo — e ela não é a que eu esperava.** Pus um
endereço com a forma completa (`XX:XX:XX:XX:XX:XX`, sintético) no fim deste
laudo e rodei as duas réguas de endereço:

```
MORDIDA (endereço de forma completa neste arquivo):
  scripts/check_endereco_de_radio.py   →  REPROVOU, apontando este arquivo
  tests/unit/test_saida_de_agente_sanitizada.py  →  643 passed  (não pegou)
CURA DEVOLVIDA:
  scripts/check_endereco_de_radio.py   →  OK: nenhum endereço de rádio real
```

**As duas discordarem é o desenho, e o `CLAUDE.md` já o explica:** a régua por
OUI tem um ponto cego ESTRUTURAL e a régua por FORMA alcança o que ela não pode.
O par funcionou aqui exatamente como está escrito que deveria.

**E o achado de processo, que vale para quem escrever o próximo laudo de
agente:** `scripts/validar-referencias-docs.py` **NÃO LÊ** este arquivo.
`docs/process/agentes/` está em `PREFIXOS_IGNORADOS`, por decisão datada de
06/08/2026 — *"é saída BRUTA de agente, e um relatório cita o caminho que existia
no instante da medição"*. Logo **a mordida que a irmã desta leva usou para
guardar o documento dela não funciona aqui**, e as 5 referências mortas que o
`portoes.sh` acusa hoje não são minhas nem podiam ser: as cinco são das sprints
`LINGUA-A1` a `A5`, apontando para os laudos que aqueles agentes ainda não
escreveram. Conferi cada `arquivo:linha` deste laudo à mão.

**O AVISO, e ele é o mesmo que a irmã desta leva deixou:** **nenhum portão desta
casa recalcula este número.** A `posse:` desta sprint tem um arquivo — este — e
criar um script em `scripts/` sem o alargamento colidiria com os outros agentes
da leva. Enquanto o programa não tiver dono versionado, **o `7 de 40` envelhece
em silêncio**: no dia em que ela fechar o P1, ele continuará dizendo 7. A
pergunta do alargamento é de quem coordena.

---

## §10 — OS PORTÕES

```
git add -A && bash scripts/portoes.sh
  →  REPROVOU: 1 vermelho(s) de 56 -> referencias-docs
     5 referência(s) morta(s) em 946 documento(s):
       docs/process/sprints/2026-09-11-LINGUA-A1-o-sistema-e-as-conexoes.md:40
       docs/process/sprints/2026-09-11-LINGUA-A2-os-lancadores.md:38
       docs/process/sprints/2026-09-11-LINGUA-A3-o-jogar-e-os-controles.md:51
       docs/process/sprints/2026-09-11-LINGUA-A4-gatilhos-iluminacao-vibracao.md:44
       docs/process/sprints/2026-09-11-LINGUA-A5-navegacao-e-perfis.md:42
```

**55 verdes de 56, e o vermelho não é meu — nem podia ser** (§9, mordida 3): as
cinco linhas são das sprints da ONDA A desta mesma leva, apontando para os
laudos dos agentes que ainda estão em voo. Cada uma some quando aquele agente
escrever o arquivo dele. **Nada nesta árvore além deste laudo mudou:**
`git status --short` tem uma linha, e ela é a criação dele.

E, de propósito, **não rodei a suíte**: ela toca nós uinput de verdade, ela está
com a máquina, e esta sprint não mexeu em `src/`.

---

## §11 — O QUE SOBRA PARA O PRÓXIMO

1. **O P1 desbloqueia mais que qualquer outra coisa nesta lista.** Quatro
   features, dois transportes, dois modos da Steam. Hoje **C1 e C4 têm ZERO
   medições de dez** — e o P4 é o primeiro gesto da história desta casa nesse
   caminho.
2. **A F1 é a única falha nova de transporte que toca o jogo, e ela liga as duas
   coisas que ela nomeou na encomenda.** Som e mic, e o custo é do giroscópio.
   Se o P2 confirmar, isso muda a tela: hoje nada avisa.
3. **A F4 pode não ser falha de paridade nenhuma** — o braço do cabo dentro do
   jogo nunca foi medido. O P1 e o P2 juntos fecham isso de lado.
4. **A escada de pontes não conhece o Proton nem o lançador.**
   `integrations/ponte_escada.py` tem quatro degraus, todos sobre a MÁSCARA e o
   Steam Input. Um jogo do Heroic e um jogo da Steam caem no mesmo degrau e
   recebem coisas completamente diferentes. Isso não é defeito de código — é
   **um eixo que falta ao modelo**, e nomeá-lo é metade do conserto.
5. **O `0 de 622` do mapa não é falta de trabalho: é a escada dizendo a verdade.**
   Para seis das dez features dela, o degrau de jogo **não existe por desenho**
   (§2.2). Quem for mexer no mapa para «preencher a terceira coluna» precisa
   decidir antes se a escada ganha um degrau de DISPUTA — e essa decisão não é
   de auditoria.
