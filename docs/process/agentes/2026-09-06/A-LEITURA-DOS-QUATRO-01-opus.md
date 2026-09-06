# A-LEITURA-DOS-QUATRO-01 — os quatro na mesa, e ninguém escreveu um byte

**06/09/2026, 20h00 às 21h · árvore `A-LEITURA-DOS-QUATRO-01-opus` · branch
`voo/A-LEITURA-DOS-QUATRO-01-opus`, nascida de `c15d2e3e`.**

Não é sprint de código. É **medição no aparelho**, e a janela era rara: quatro
DualSense conectados ao mesmo tempo — os primeiros quatro desde que esta casa
existe — **com o daemon do Hefesto parado**, logo sem ninguém disputando o
hidraw.

**A regra desta tarefa era uma só: SÓ LER.** Ela foi cumprida. Nenhum output
report, nenhum `SET_FEATURE`, nenhuma luz, vibração, gatilho, som ou LED. O que
foi ao fio, além de abrir o nó em `O_RDONLY`, foram os três `GET_FEATURE` de
**consulta** — `0x09`, `0x20` e `0x05` —, e a licença é do próprio driver:
*"Reading a feature report is a pure read with no side effects"*
(`assets/dkms/hid-playstation/hid-playstation.c:915-916`).

**O daemon foi conferido ANTES e DEPOIS de cada bloco de medição** — sete
blocos, catorze conferências, `inactive` nas catorze. Ele não subiu no meio, e
por isso nenhuma leitura desta página mede o produto no lugar do aparelho.

---

## 0. A MESA, e o que cada instrumento leu

| nó | transporte | endereço (máscara da casa) | `hw_version` | evdev |
| --- | --- | --- | --- | --- |
| `/dev/hidraw4` | cabo (USB, `3-1.3`) | `a0:fa:9c:00:00:f0` | `0x00000710` | 4 nós |
| `/dev/hidraw7` | cabo (USB, `3-1.1.3`) | `44:46:48:00:00:03` | `0x00000811` | 4 nós |
| `/dev/hidraw5` | rádio (uhid) | `14:3a:9a:00:00:ab` | `0x00000711` | 3 nós |
| `/dev/hidraw6` | rádio (uhid) | `d4:2f:4b:00:00:d8` | `0x00001111` | 3 nós |

Os **quatro** rodam o mesmo firmware — `fw_version 0x0110002a`, build
`Jul  4 2025` — e **quatro revisões de placa diferentes**. Os dois do cabo têm
o nó `Headset Jack`; os dois do rádio não, e é a única diferença de contagem de
nós evdev.

**Qual biblioteca leu cada número**, porque medir contra a biblioteca errada
produz alarme convincente e falso:

| número | instrumento |
| --- | --- |
| taxa, offsets, CRC, bateria crua, contador, giro/acel/toque | **hidraw cru** (`os.open` `O_RDONLY` + `os.read`), nada mais |
| nome, `uniq`, barramento, VID:PID | **ioctl de consulta ao kernel** (`HIDIOCGRAWNAME`/`UNIQ`/`INFO`) — não vai ao fio |
| MAC, host pareado, firmware, calibração | **`HIDIOCGFEATURE`** — vai ao fio, e só lê |
| nós, `SYN_REPORT`, `EV_ABS` | **`python-evdev` do sistema** (`/usr/lib/python3/dist-packages/evdev`) |
| estado e capacidade de bateria | **sysfs** `/sys/class/power_supply` |

---

## O que mudou

### 1. O rádio entrega **de duas a duas vezes e meia** o que o cabo entrega

É o achado maior do dia, e ele derruba a intuição de que rádio é o lado pobre.

| | quadros/s medidos | intervalo típico |
| --- | --- | --- |
| cabo (`hidraw4`, `hidraw7`) | **250,0** e **254,0** | 12.236 unidades (4,08 ms) |
| rádio (`hidraw5`, `hidraw6`) | **641,1** e **591,2** | 3.765 unidades (1,25 ms) |

A **unidade do `sensor_timestamp` saiu da própria medição, sem tabela**:
15.000.761 unidades em 5,000 s dá **0,3333 µs por unidade**, e os quatro
controles concordam até a quarta casa, nos dois transportes.

**E a rajada é real, com grão medido.** O intervalo entre quadros do rádio não é
contínuo: é múltiplo de ~1882 unidades (**0,627 ms — o par de slots de 625 µs do
Bluetooth clássico**), e as três classes observadas são de 2, 3 e 4 slots
(3765, 5647, 7530), com o degrau de dois slots levando a maioria.

**O que faltava às cinco janelas de 11/08 (363,3 / 239,9 / 334,1 / 55,4 /
69,7 Hz) era um árbitro** para separar *"o aparelho pausou"* de *"o leitor
perdeu quadro"* — e o árbitro estava escrito neste mapa sem ninguém o ler: o
`__le32` de `corpo[11..14]`. **Ele foi medido:** sobre 600 reports seguidos de
**cada um dos quatro**, o contador anda de **um em um, sempre, sem um único
salto** (599 deltas de valor 1 em 599, nos quatro). Nada se perdeu — logo as
taxas acima são do aparelho, não do leitor.

O mapa **afirmava** que `corpo[11..14]` é contador de reports **nos dois
transportes** e que o produto não o lê em transporte nenhum. A primeira metade
**agora está medida nos quatro**. A segunda continua sendo dívida.

**O custo disso está na célula ao lado:** o teto `MOTION_EMIT_MAX_HZ = 250,0` do
produto **joga fora mais da metade do que o rádio entrega**.

### 2. O CRC: onde ele está, e onde ele **não** está

`plataforma.crc32@dualsense` tinha `cabo_por_que_nao_aciona = nao-medido`.
**Deixou de ter.**

- **Entrada por cabo — não há CRC, e agora isso é medida.** Sobre 200 quadros
  seguidos de cada controle do cabo, o CRC-32 de semente `0xA1` sobre
  `report[0:60]` **não confere em nenhum** (0/200 nos dois), e a busca varreu
  **todos** os cortes plausíveis (`[0:56]` a `[0:60]`) sem achar um que
  conferisse. Os quatro últimos bytes caem em `reserved4` e mudam a cada quadro.
  A causa virou `nada-a-acionar`: não há campo a conferir.
- **Entrada por rádio — confere em 200/200** nos dois, e `report[0:74]` é o
  **único** corte que confere.
- **ACHADO NOVO, que não estava no mapa:** o CRC de semente `0xA3` das respostas
  de **FEATURE** também só existe por rádio — e **não é acrescentado ao
  tamanho**. Ele **ocupa** os quatro últimos bytes do **mesmo tamanho** que o
  cabo devolve. `0x09` (20 B), `0x20` (64 B) e `0x05` (41 B) voltam com o mesmo
  número de bytes nos dois transportes; por cabo os quatro últimos são zeros e
  não conferem, por rádio carregam o CRC e conferem — **nos três reports dos
  dois controles**.

**Isto derrubou uma frase do mapa.** `identidade.pareamento` dizia que a
resposta do `0x09` por rádio traz *"mais os quatro bytes de CRC-32 no fim"*.
**Não são a mais.** Pedindo 20 bytes vêm 20; **pedindo 24 vêm 20 também**. O CRC
mora em `buf[16..19]`, que são exatamente os bytes que a célula do cabo chama de
*enchimento*. O aparelho ganhou da célula, e a célula mudou.

### 3. Pelo **cabo** se lê a que host o controle está pareado

O layout do `0x09` era `afirmado-no-doc`. **Foi lido do aparelho nos quatro
controles e nos dois transportes**, e bate campo a campo: `buf[1..6]` o endereço
próprio em little-endian — que invertido é **igual ao `HID_UNIQ`** do nó, nos
quatro —, as três constantes `0x08`/`0x25`/`0x00` idênticas nos quatro, e
`buf[10..15]` o endereço do **host**.

**O `buf[10..15]` foi conferido contra outra fonte em vez de aceito:** invertido,
ele é exatamente o `HID_PHYS` de um dos **dois adaptadores Bluetooth em uso**
nesta máquina (o sistema expõe três nós `hci`; dois estavam com controle) —
e, para cada controle **no cabo**, ele apontou o adaptador por onde o **outro**
controle daquele par está conectado por rádio. É capacidade que o mapa
não registrava: **o pareamento se lê pelo cabo, sem ligar o rádio.**

### 4. A bateria dos quatro, e a prova pelo avesso da decisão dela

| nó | byte cru | nibble | estado | sysfs | batem? |
| --- | --- | --- | --- | --- | --- |
| `hidraw4` (cabo) | `report[53] = 0x2a` | `0x2` | cheio, 100% | `Full`, 100% | **sim** |
| `hidraw7` (cabo) | `report[53] = 0x2a` | `0x2` | cheio, 100% | `Full`, 100% | **sim** |
| `hidraw5` (rádio) | `report[54] = 0x28` | `0x2` | cheio, 100% | `Full`, 100% | **sim** |
| `hidraw6` (rádio) | `report[54] = 0x2a` | `0x2` | cheio, 100% | `Full`, 100% | **sim** |

**O dado chega igual pelo cabo e pelo rádio** — mesmo nibble, mesma
decodificação, mesma resposta do sysfs. O byte cai um adiante no rádio porque o
envelope do `0x31` tem dois bytes de cabeçalho em vez de um.

**A prova viva que ela esperava não veio, e não foi forçada: nenhum dos quatro
estava carregando.** Os quatro em `cheio`.

**Mas há a prova pelo avesso, e ela vale igual:** os **dois que estão NO CABO
não dizem `carregando` — dizem `cheio`**. Um ícone que inferisse a carga do
transporte estaria **errado nos dois, agora**. É
`D-0609-A-CARGA-POR-ICONE-E-SEM-TRANSPORTE` medida do outro lado.

A ressalva de `energia.bateria.leitura_hefesto` sobre o sysfs **foi ao aparelho
e não se confirmou hoje**: os dois controles no cabo **têm** o nó
`ps-controller-battery-<endereço>` e ele responde. A ressalva fica de pé (é
sobre outras versões do driver), mas nesta máquina o nó existe no cabo.

### 5. Giroscópio, acelerômetro e touchpad nos quatro, com o daemon parado

**Os quatro publicam giro e acelerômetro, nos dois transportes, sozinhos** — sem
daemon, sem output report, sem ninguém "ligar" nada. O acelerômetro dá módulo
mediano de 8.038 a 8.225 nos quatro (≈1 g em ~8.192), e o giroscópio em repouso
não é zero, como a linha `movimento.giroscopio` já dizia.

**O campo de touchpad existe e é parseável nos quatro**, e a última posição
retida delata o uso: `hidraw5` guarda o contato `0x83` (dedo solto, id 3) em
(859, 1013) e `hidraw7` guarda o `0x9c` (id 28), enquanto `hidraw4` e `hidraw6`
estão em `0x80` (id 0) — nunca tocados desde que ligaram. **Ninguém tocou os
pads nesta janela**, então isto é o que dá para provar sem a mão dela; ver
§*O que NÃO verifiquei*.

### 6. A assimetria byte a byte, report a report

| | cabo | rádio |
| --- | --- | --- |
| report de entrada | `0x01`, **64 B** | `0x31`, **78 B** |
| cabeçalho antes do corpo | **1 byte** (só o id) | **2 bytes** (id + `data[1]`) |
| `gyro` / `accel` / `sensor_timestamp` | `[16..21]` / `[22..27]` / `[28..31]` | **+1**: `[17..22]` / `[23..28]` / `[29..32]` |
| toque, status | `[33..40]`, `[53..55]` | `[34..41]`, `[54..56]` |
| CRC de entrada | **não existe** | `[74..77]`, semente `0xA1` |
| `seq_number` (`corpo[6]`) | **conta**: 256 valores, zero saltos | **congelado em `0x01`** |
| contador de reports (`corpo[11..14]`) | anda de 1 em 1 | anda de 1 em 1 |
| feature `0x09`/`0x20`/`0x05` | 20/64/41 B, cauda zerada | 20/64/41 B, cauda = CRC `0xA3` |

**O que o aparelho derrubou:** a ideia de que o `seq_number` serve nos dois
lados. **Por rádio ele não conta** — fica em `0x01` em 3.205 quadros seguidos.
Quem conta por rádio é o **nibble alto de `data[1]`**, o byte de cabeçalho do
`0x31`, que percorre os 16 valores de 0 a 15 enquanto o **nibble baixo fica
sempre em `1`**. Ou seja: **por rádio o contador de sequência mudou de lugar e
encolheu de 8 bits para 4** — e quem quiser um contador que sirva nos dois
transportes tem de usar o `corpo[11..14]`, que é de 32 bits e anda igual nos
quatro.

**O que o aparelho confirmou:** o `crc32@60` dentro dos 64 do `0x20` e o
"4 últimos bytes = CRC `0xA3`" dos 41 do `0x05`, ambos escritos no mapa como
inferência e agora medidos.

### 7. E uma armadilha de instrumento, que quase entrou nesta página

**Não se mede taxa contando `EV_ABS`.** O input core **suprime o eixo cujo valor
não mudou**, então a contagem de `EV_ABS` do mesmo trecho dá **1065 a 1328 por
segundo** onde a taxa real é 250 — quatro a cinco vezes mais, e plausível. A
régua certa é `SYN_REPORT`, um por quadro entregue: contada assim, o
`python-evdev` deu **250,0 e 254,0** no cabo e **450,9 e 484,2** no rádio,
concordando em direção e ordem de grandeza com o hidraw cru, que é a fonte.

**Duas bibliotecas, dois caminhos, a mesma conclusão** — e a menor das duas
(evdev, lendo quatro nós num processo só) é a que perde quadro, não o aparelho.

### O que foi escrito em arquivo

`docs/data/mapa-controles.csv`, **cinco linhas**, todas `@dualsense`:

| linha | o que mudou |
| --- | --- |
| `plataforma.crc32` | `cabo_por_que_nao_aciona`: `nao-medido` → **`nada-a-acionar`**; `cabo_de_onde_sei` → **`medido`**; `provado_por`: `fonte-do-driver` → **`aparelho`**; as duas ressalvas escritas |
| `identidade.pareamento` | os dois `de_onde_sei` → **`medido`**; a frase do CRC "a mais" **corrigida pelo aparelho**; o cruzamento com o `HID_PHYS` registrado; `provado_por = aparelho` |
| `plataforma.taxa_relatorios` | as duas evidências ganharam a medição de hoje **e o contador como árbitro**; as cinco janelas de 11/08 **ficam** |
| `energia.bateria.leitura_hefesto` | os dois `de_onde_sei` → **`medido`**; `provado_por = aparelho`; a ressalva do sysfs medida; a prova pelo avesso da decisão dela |
| `energia.bateria.degraus` | **NÃO subiu de grau**, e a ressalva diz por quê — ver abaixo |

---

## Qual mordida prova

Nesta tarefa a mordida é outra coisa: **provar que a medição MEDE**, em vez de
devolver um número plausível. Cinco, e todas rodaram.

**M1 — nó que não existe.** `/dev/hidraw99` →
`FileNotFoundError: [Errno 2]`. **Acusou.** Não devolveu "0 Hz".

**M2 — nó que existe e não é DualSense.** `/dev/hidraw0` é um
`CX 2.4G Wireless Receiver` (`3554:fa09`). O instrumento leu o nome e o VID:PID
certos, **não achou quadro do report principal e devolveu `ERRO: nenhum
quadro`** — sem bateria, sem giroscópio, **sem inventar campo nenhum**.

**M3 — a mordida do offset, e é a que mais importa.** Li um quadro **de rádio**
com o offset **do cabo**:

| | `status0` | nibble de carga | acelerômetro |
| --- | --- | --- | --- |
| offset certo (`data[2]`) | `0x28` | `0x2` = cheio, 100% | `[-53, 2533, -7634]` |
| offset errado (`data[1]`) | `0xdc` | `0xd` = **estado nenhum** | `[-13313, -6657, 11785]` |

Se o offset errado devolvesse o mesmo estado, a medição não estaria medindo o
offset. **Ela está.**

**M4 — `power_supply` que não existe.** Ler
`ps-controller-battery-00:00:00:00:00:00` → `FileNotFoundError`. **Acusou.**

**M5 — o CRC com um bit virado.** Peguei um quadro real do rádio e virei **um
bit** em cada um de três bytes diferentes (10, 20 e 73). Intacto: confere.
Bytes 10, 20 e 73 com um bit virado: **não confere nas três**. Régua que só sabe
dizer que sim não mede nada.

**E a mordida do processo:** o daemon foi lido `is-active` **antes e depois de
cada um dos sete blocos**. Se ele tivesse subido, todas as leituras passariam a
medir uma disputa em vez do aparelho — e esta página diria isso. Ele não subiu.

---

## O que NÃO verifiquei

**Nada que exija escrever.** Está tudo em
*escrita que ela precisa autorizar*, abaixo.

**A escada de onze degraus da bateria.** Os quatro estavam no **mesmo** estado
(`0x2`, cheio) e o nibble baixo só mostrou **dois** dos onze níveis (8 e 10).
Dois pontos não desenham uma escada, então `energia.bateria.degraus`
**continua `inferido-do-codigo`** de propósito. Quem subiu de grau foi a
**leitura do byte**, não a escada.

**O estado `carregando` (nibble `0x1`).** Nenhum dos quatro estava carregando.
Não forcei, e não infiro: a metade `carregando` da tabela continua sem prova de
aparelho, nos dois transportes.

**O toque no touchpad.** O campo existe e é parseável nos quatro, e a posição
retida prova que dois deles já registraram toque — mas **ninguém encostou nos
pads nesta janela**, e por isso não posso afirmar entrega de coordenada viva. O
evdev de touchpad devolveu **0 eventos em 3 s nos quatro**, o que é o esperado
com os pads intocados, e **não** é prova de que funcionem.

**O estado de repouso do rádio (`0x01` de 10 B).** `plataforma.modo_relatorio`
diz que por rádio o aparelho manda `0x01` curto até um gatilho e depois `0x31`.
**Não observei o `0x01`**: os dois do rádio já estavam em `0x31` quando cheguei,
porque a probe do `hid-playstation` já tinha passado. Medi o estado **depois** da
probe, não o de antes — a célula fica como está.

**As 61 células `nao-medido` do mapa não eram o que a tarefa supunha.** Elas
estão **todas** nas colunas `*_por_que_nao_aciona`, e **52 das 61 são de `pro` e
`sn30`** — Pro Controller e 8BitDo, que **não estavam na mesa**. Das nove de
`dualsense`, **uma** se fechava por leitura pura e foi fechada
(`plataforma.crc32`, lado do cabo). As outras oito (`luz.lightbar.brilho`,
`luz.lightbar.fade`, `luz.recursos_proprios`, `energia.desligar`,
`plataforma.link_parametros`, `audio.leitura_de_volta`,
`audio.saida_dedicada.payload_do_degrau`, `plataforma.diagnostico_morte_radio`)
**exigem escrever** ou dependem de aparelho que não estava aqui.

**Não rodei a suíte.** Ela é de quem coordena e toca nós uinput de verdade;
esta tarefa tinha a mesa dela ocupada por quatro controles vivos.

---

## O que sobrou para o próximo

1. **Repetir esta janela com um controle DESCARREGADO no rádio.** É o único
   jeito de fechar o nibble `0x1` e provar a decisão dela pelo lado direito. São
   dez segundos de leitura, e o valor é alto.
2. **Passar um dedo em cada um dos quatro touchpads** enquanto a leitura roda.
   Não é escrita e não precisa de autorização — precisa da mão dela, ou de
   alguém na frente da máquina.
3. **O `corpo[11..14]` tem dono e ninguém o lê.** Ele está medido nos quatro,
   nos dois transportes, e é o único contador que serve nos dois — o
   `seq_number` está congelado por rádio. Parseá-lo daria ao cabo o contador de
   perda que ele nunca teve e ao rádio um que mede perda **do fio**, em vez do
   `bt_drops`, que conta o que o **produto** descartou. É uma sprint de leitura,
   sem risco.
4. **O teto de 250 Hz merece a pergunta dela.** O rádio entrega de 591 a 658
   reports/s e o produto descarta mais da metade. Se isso é desperdício ou
   proteção é decisão de produto, e o número agora existe para ela decidir.
5. **As 52 células `nao-medido` de `pro` e `sn30`** esperam o Pro Controller e o
   8BitDo na mesa. Metade delas fecha por leitura, exatamente como esta leva.
6. **A `identidade.pareamento` ganhou uma capacidade nova** — ler pelo cabo a
   que host o controle está pareado. Nada no produto usa isso, e ela responde a
   uma pergunta que a interface faz hoje ("este controle é meu?").

---

## Escrita que ela precisa autorizar

Cada linha diz **o que ela vai ver ou sentir** se autorizar. Nenhuma foi feita.

1. **O som pelo rádio** — vou mandar áudio pelo degrau `0x39` do Bluetooth num
   dos dois controles do rádio; **ela vai ouvir, ou não ouvir, um bipe saindo do
   alto-falante do controle na mão dela**, e é a orelha dela que decide o ensaio
   `som-no-radio-observado-nao-replicado`, aberto desde 16/08.
2. **A luz** — vou pintar a lightbar de uma cor combinada nos quatro ao mesmo
   tempo; **ela vai ver os quatro controles mudarem de cor juntos**, e isso
   fecha `luz.lightbar.brilho` e `luz.lightbar.fade`, hoje `nao-medido` nos dois
   lados.
3. **A vibração** — vou pulsar os dois motores de um controle por meio segundo;
   **ela vai sentir o controle tremer na mão**, e é o que separa "o report saiu"
   de "o motor girou".
4. **O gatilho adaptativo** — vou travar o gatilho direito de um controle;
   **ela vai sentir o gatilho endurecer e depois soltar**, e sem o dedo dela
   isso não se mede.
5. **O mudo do microfone** — vou apagar e acender o LED do botão do microfone;
   **ela vai ver a luzinha do microfone piscar**, que é a única confirmação de
   que a máscara chegou ao aparelho.
6. **Desligar o controle pelo comando** (`energia.desligar`, `nao-medido` nos
   dois lados) — **ela vai ver um controle apagar sozinho e sumir da lista**, e
   terá de ligá-lo de novo no botão.
7. **Escrever o pareamento (`0x0A`)** — **ela pode perder o pareamento de um
   controle que está usando** se o report sair mal formado. É a única desta
   lista que eu recomendo fazer com o controle sobressalente, nunca com o dela.
