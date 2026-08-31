# Rodada 2 — os nove dossiês de fonte

*31/08/2026 · workflow `wf_be4d2607-8ce` · resultado `wzuxu703q`*

As mesmas nove fontes da rodada 1, relidas contra **outras 20 lacunas** do mapa
de canais (25 células-alvo, 24 delas vazias). Cada agente leu a fonte **inteira**
e devolveu tudo que viu; só o que casava com as lacunas pedidas virou proposta.

**A conta que justifica este arquivo:**

| | |
| --- | --- |
| achados devolvidos pelas nove fontes | **215** |
| divergências entre fontes devolvidas | **58** |
| propostas montadas a partir deles | 25 |
| propostas que sobreviveram aos três céticos | 11 |
| **achados que viraram célula no mapa** | **24** |
| **achados que ninguém leu depois — o que este arquivo passa a existir para guardar** | **191** |

Nenhuma fonte ficou fora do alcance: as nove responderam.

**Convenções.** O endereço vem sem crase de propósito — crase aqui é símbolo de
código, não caminho. Endereço sem projeto na frente é desta árvore; o resto traz
o repositório. `código` = inferido do código lido; `doc` = afirmado em comentário,
README, página de fabricante ou rastreador; `incerto` = o agente marcou como
hipótese. A coluna **célula** traz o id que o achado sustenta no mapa — quando
está vazia, o achado **não virou nada**, e essa é a lista de trabalho.

Atalho de caminho, para a tabela caber: `hid-playstation.c` é
assets/dkms/hid-playstation/hid-playstation.c e `hid-nintendo.c` é
assets/dkms/hid-nintendo/hid-nintendo.c, os dois desta árvore.

---

## Fonte 1 — `hid-playstation.c`, o driver do kernel (DualSense)

**O que foi lido.** O arquivo inteiro do disco (3.171 linhas, sha256
`3729dd2e…adaf55fb`, que é o `SHA256_PATCHED_C` do BASELINE = Pop!\_OS v7.0.11,
commit `3af2f9de4317` + os dois patches da casa), conferido linha a linha contra
o `torvalds/linux` master. **Todo trecho de DualSense-por-rádio citado abaixo é
idêntico nas duas cópias** — os patches locais (retry de feature report; pairing
info curto do DualShock4) não tocam código de rádio.

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| envelope | **1.1** Entrada: cabo `0x01`/64 B; rádio `DS_INPUT_REPORT_BT` = `0x31`/78 B | :140-143 | código | |
| envelope | **1.2** Saída: cabo `0x02`/63 B; rádio `0x31`/78 B. **Por rádio o MESMO id `0x31` serve para entrada e para saída**; no cabo são dois ids | :144-147 | código | |
| envelope | **1.3** Bloco comum de saída = 47 B (`static_assert`). Índices dentro do comum: 0 `valid_flag0`, 1 `valid_flag1`, 2 motor direito, 3 motor esquerdo, 4 fone, 5 alto-falante, 6 microfone, 7 `audio_control`, **8 `mute_button_led`**, 9 `power_save_control`, 10-36 `reserved2[27]`, 37 `audio_control2`, 38 `valid_flag2`, 39-40 reservado, 41 `lightbar_setup`, 42 brilho, 43 LEDs de jogador, 44/45/46 R/G/B | :320-349 | código | luz.led_microfone@dualsense |
| envelope | **1.4** Cabeçalho da saída por rádio são **3 bytes**, não 1: [0] id `0x31`, [1] `seq_tag`, [2] `tag`; comum em 3-49; 50-73 reservado nunca escrito; 74-77 CRC32 LE | :351-366 | código | |
| envelope | **1.5** Offsets ABSOLUTOS da saída por rádio: 3 `valid_flag0`, 4 `valid_flag1`, 5 motor dir., 6 motor esq., 7 fone, 8 alto-falante, 9 mic, 10 `audio_control`, 11 `mute_button_led`, 12 `power_save`, 13-39 reservado, 40 `audio_control2`, 41 `valid_flag2`, 44 `lightbar_setup`, 45 brilho, 46 LEDs de jogador, **47/48/49 R/G/B**. Logo: **saída rádio = cabo + 2** | :320-366 (aritmética sobre os structs) | código | |
| envelope | **1.6** Entrada: struct de 63 B começando em `data[1]` no cabo e **`data[2]` no rádio**. Absolutos por rádio: eixos 2-7, `seq_number` 8, botões 9-12, giro 17-22, acel 23-28, timestamp 29-32, toque 34-41, status 54-56. Logo: **entrada rádio = cabo + 1** | :295-317, :1581, :1592 | código | toque.touchpad.clique@dualsense · movimento.acelerometro.jogo@dualsense · movimento.giroscopio@dualsense |
| envelope | **1.7** O byte 1 da ENTRADA por rádio **não tem nome**: o driver salta de `data[0]` para `data[2]`. Não é o `seq_number` — esse fica dentro do corpo (8 por rádio) | :1592 | incerto | |
| CRC | **1.8** `crc32_le(0xFFFFFFFF, &semente, 1)` e depois `~crc32_le(crc, data, len)` = CRC-32/ISO-HDLC de (semente ‖ report) | :794-803, :1434-1442 | código | |
| CRC | **1.9** Sementes: entrada `0xA1`, saída `0xA2`, feature `0xA3` | :135-138 | código | movimento.acelerometro.jogo@dualsense |
| CRC | **1.10** Cobre os 74 primeiros bytes **incluindo o report ID**; valor em LE nos bytes 74-77 | :1585-1590, :1434-1442, :873-881 | código | |
| CRC | **1.11** CRC de entrada errado  `-EILSEQ` e o pacote inteiro é descartado. Sem contador, sem tolerância, sem retry | :1587-1590 | código | |
| sequência | **1.12** `seq_tag` = nibble ALTO é o contador 0-15 (volta a 0 em 16), nibble baixo é 0. `tag` = `0x10` fixo, com o comentário do próprio driver: *"Tag must be set. Exact meaning is unclear."* Nenhum dos dois existe no cabo | :203-205, :1386-1396, :283 | código | luz.led_microfone@dualsense |
| sequência | **1.13** O `seq_number` da ENTRADA existe no struct e o driver **nunca o lê** — a string aparece uma vez no arquivo, na declaração. Não há detecção de pacote perdido | :299 | código | |
| partida | **1.14** Feature reports do DualSense são os MESMOS nos dois transportes: `0x05`/41 B calibração, `0x09`/20 B pairing, `0x20`/64 B firmware. Não há variante `_BT` — ao contrário do DualShock4, que tem. Por rádio só muda a conferência do CRC | :149-154, :396-401, :873-881 | código | |
| partida | **1.15** **O driver não faz handshake nenhum.** Não há enable, magic packet nem `#define` de modo. A primeira transação por rádio é um GET_REPORT do feature `0x09`; depois `0x20`, depois `0x05`, depois o primeiro report de saída (reset da lightbar). O driver não afirma que nada disso comuta o controle | :1851-2005, :1574-1577 | código | |
| partida | **1.16** Se chegar `0x01` por rádio, o driver responde `Unhandled reportID=1` e devolve -1. **O DualShock4 tem tratamento de modo mínimo (`0x01`/10 B) e o DualSense não tem** | :1578-1596 vs :387-388, :2623-2635 | código | |
| partida | **1.17** Custo de rádio na probe, medido e escrito **no patch local**: dois DualSense pareando com ~1 s de diferença — o primeiro fechou em 74 ms, o segundo pegou o `0x09` e perdeu o `0x20` com -5 (que é falso: o uhid achata todo erro em `-EIO`; o real foi o timeout de 3 s do BlueZ). O backoff de 100/200 ms foi REPROVADO — 6 de 6 abortos em 08/08 | :886-960, :31-62 (ausente no upstream) | código | |
| áudio | **1.18** Áudio por rádio é declarado **não suportado, em dois lugares**: o jack input device nem é criado (`if bus == BUS_USB`), e a leitura de `status[1] & JACK_DETECT` também é guardada por cabo. Consequência: por rádio o driver nunca envia roteamento de áudio, `speaker_volume` nem o pré-amp | :1956-1962, :1643-1668, :1489-1550 | código | luz.led_microfone@dualsense |
| gatilhos | **1.19** **Gatilho adaptativo: nada, em transporte nenhum.** `grep` por *trigger* e *adaptive* no arquivo inteiro = zero. Os 27 bytes `reserved2` (absolutos 13-39 por rádio) são zerados e nunca escritos | :339 + ausência por grep | código | |
| campos mortos | **1.20** `led_brightness`, `headphone_volume` e `mic_volume` aparecem UMA vez cada — na declaração. `speaker_volume` só é escrito no bloco que roda por cabo | :329, :331, :343, :356 | código | |
| taxa | **1.21** O DualShock4 tem `hw_control` no report de saída por rádio, com 6 bits de intervalo (1-62 ms, `0x3F` desliga) e os bits de CRC32 e HID. **O DualSense não tem nada disso: não há como mudar a taxa de report por rádio** | :428-441, :2559-2572 vs :351-359 | código | |
| idêntico | **1.22** Achado o início do corpo, o parser é literalmente o mesmo código: eixos, hat, botões, mute do mic, giro e acel calibrados, timestamp (0,33 µs, com tratamento de wrap), touchpad de 2 pontos 1920×1080, bateria (`status[0]`: nibble baixo capacidade em passos de 10%, nibble alto carga — `0x0` descarregando, `0x1` carregando, `0x2` cheia, `0xa`/`0xb` erro de tensão/temperatura, `0xf` erro de carga). Do lado da saída, idem | :1597-1760, :1448-1560 | código | |
| identidade | **1.23** VID `054c`, PIDs `0ce6` (DualSense) e `0df2` (Edge), cada um DUAS vezes na tabela — `HID_BLUETOOTH_DEVICE` e `HID_USB_DEVICE`. Rumble v2 no `0ce6` só se firmware ≥ 2.21; no `0df2` é sempre | :3131-3139, :1918-1923 | código | |
| identidade | **1.24** Não há `.report_fixup`. O descritor HID que o aparelho entrega por rádio chega ao userspace **como o aparelho o entrega** | :3143-3152, :1878 | código | |
| lightbar | **1.25** Por rádio a lightbar exige um passo a mais no boot, e o driver diz por quê: *"On Bluetooth the DualSense outputs an animation on the lightbar during startup… We need to explicitly reconfigure the lightbar before we can do any programming later on."* O report leva `valid_flag2` = LIGHTBAR_SETUP_CONTROL_ENABLE e `lightbar_setup` = LIGHT_OUT | :1791-1814, :218, :223 | código | |

---

## Fonte 2 — libsdl-org/SDL, `SDL_hidapi_ps5.c`

**O que foi lido.** Branch main, blob `bc5d4d53fc24` (sha do arquivo baixado
conferido contra o que a API do GitHub devolve para main). Último commit que
tocou o arquivo: `0c8feecce6e5`, 04/06/2026. Apoio: `SDL_hidapijoystick.c` e o
`hid-playstation.c` do disco.

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| envelope | **2.1** `k_EPS5ReportIdBluetoothEffects` e `k_EPS5ReportIdBluetoothState` são **dois nomes para o mesmo `0x31`**, no mesmo enum. Feature: `0x03` capacidades, `0x05` calibração, `0x09` serial, `0x20` firmware | SDL\_hidapi\_ps5.c:56-70 | código | |
| envelope | **2.2** Saída por rádio: buffer 78 B, [0]=`0x31`, [1]=`0x00` (*"Tag and sequence"*), [2]=`0x10` (*"Magic value"*), carga a partir do byte 3; 50-73 zerados; 74-77 CRC | :1099-1113 | código | |
| envelope | **2.3** Saída por cabo: [0]=`0x02`, tamanho **48**, offset 1, sem CRC | :1106-1111 | código | |
| envelope | **2.4** `DS5EffectsState_t`, 47 B, com os offsets no comentário do próprio código: 0/1 enable bits, 2/3 rumble, 4/5/6 volumes, 7 `ucAudioEnableBits`, 8 `ucMicLightMode`, 9 `ucAudioMuteBits`, **10-20 gatilho direito, 21-31 gatilho esquerdo**, 32-37 desconhecido, 38 `ucEnableBits3`, 41 `ucLedAnim`, 42 brilho, 43 `ucPadLights`, 44/45/46 RGB | :164-187 | código | |
| envelope | **2.5** Absolutos por rádio (soma de 3): gatilho direito 13-23, esquerdo 24-34, `ucEnableBits3` 41, RGB **47/48/49**. Confere byte a byte com o struct do kernel | :164-187 + :1099-1113 | código | |
| envelope | **2.6** Na saída, o deslocamento rádio-menos-cabo é **+2, não +1** — 1 byte de cabeçalho no cabo, 3 no rádio | :1099-1111 | código | |
| CRC | **2.7** Saída: semente `0xA2` (*"hidp header is part of the CRC calculation"*), sobre `data[0..73]`, gravado com `memcpy` (LE na máquina). Comentário: *"at least on Linux"* | :1115-1122 | código | |
| CRC | **2.8** Entrada: semente `0xA1`, sobre `size-4`; **só o `0x31` é verificado**, e um CRC ruim descarta o pacote. O `0x01` do cabo não é verificado. O tamanho usado é o `size` lido do hidraw, não um 78 fixo | :1540-1553, :1576-1580 | código | |
| flags | **2.9** `ucEnableBits1` — só dois bits escritos: `0x01` rumble emulado, `0x02` desliga háptica de áudio. Batem com `COMPATIBLE_VIBRATION` e `HAPTICS_SELECT` do kernel | :729, :735, :741 | código | |
| flags | **2.10** `ucEnableBits2` — quatro bits: `0x01` luz do mic, `0x04` cor da lightbar, `0x08` reset de LED, `0x10` luzes de jogador. Batem um a um com o kernel | :749, :752, :766, :776 | código | |
| flags | **2.11** `ucEnableBits3` — um bit, `0x04`, *"improved rumble emulation on 2.24 firmware and newer"*. Ligado se Edge, **ou** firmware ≥ `0x0224`, **ou** firmware == 0 — e este último tem comentário: *"Assume that it's updated firmware over Bluetooth"* | :442-448, :723-727 | código | |
| gatilhos | **2.12** **O SDL nomeia os 22 bytes de gatilho e nunca escreve neles.** As palavras aparecem em duas linhas do arquivo inteiro: as declarações. Quem quer gatilho monta o struct por fora e manda por `SDL_SendGamepadEffect`, que só embrulha (offset 3 no rádio) e assina — truncando em 75 B | :176-177, :1113, :1149-1154 | código | |
| sensores | **2.13** `SetJoystickSensorsEnabled` **não envia pacote nenhum**: carrega a calibração (`0x05`) e marca uma flag. Giro e acel vêm de graça dentro do `0x31` — o que precisa ser ligado é o modo, não o sensor. Taxa declarada: **1000 Hz por rádio** (*"appears to be"*), 250 Hz no cabo, 1000 Hz no cabo se for Edge. Resoluções: 1024 LSB/°/s e 8192 LSB/g | :1156-1172, :850-864, :42-43 | código | |
| partida | **2.14** **Três caminhos ligam o `0x31`**, todos no código: (1) ler um feature report — o comentário aparece duas vezes literal, *"This will also enable enhanced reports over Bluetooth"*, para o `0x09` e para o `0x20`; (2) mandar **qualquer** pacote de efeitos, mesmo inválido — *"We can't even send an invalid effects packet, or it will put the controller in enhanced mode"*; (3) receber um `0x31` já basta. E é irreversível: *"enhanced mode is a one-way ticket"* | :425-440, :830-835, :907-914, :894-896 | código | |
| envelope | **2.15** Modo do transporte descoberto pela primeira leitura (timeout 16 ms): 64 B = cabo; `data[0]==0x31` = rádio já em modo cheio; senão, rádio em report simples (*"DirectInput enabled"*) | :406-423 | código | |
| envelope | **2.16** A decisão cabo/rádio de verdade **não vem do report**: `is_bluetooth` é atribuído uma vez, do `bus_type` do hidapi | SDL\_hidapijoystick.c:936 | código | |
| entrada | **2.17** No despacho, `0x01` lê o estado em `&data[1]` e `0x31` em `&data[2]` — entrada rádio = cabo + 1 | :1617-1637 | código | toque.touchpad.clique@dualsense |
| entrada | **2.18** `PS5StatePacket_t`, offsets no comentário do código (some 1 no cabo, 2 no rádio): 0-3 analógicos, 4/5 gatilhos, 6 contador, 7-10 botões e hat, 11-14 sequência do pacote (32 bits LE), 15-20 giro, 21-26 acel, 27-30 timestamp, 31 temperatura, 32-39 os dois toques, 48-51 `timer2`, 52 bateria, 53 estado de conexão | :104-133 | código | toque.touchpad.clique@dualsense |
| entrada | **2.19** O campo que diria *"estou no cabo"* — `ucConnectState` no offset 53, comentado como `0x08 = USB, 0x01 = headphone` — **o SDL nunca lê**. Aparece uma vez no arquivo | :130 | doc | |
| entrada | **2.20** `0x01` com 78 bytes é tratado como pacote SIMPLES: `if (size == 10 \|\| size == 78)` chama o parser curto. O SDL espera ver o `0x01` preenchido até o tamanho do quadro de rádio | :1618-1627 | código | |
| rádio | **2.21** Tique de sobrevivência: passados **500 ms** sem pacote válido, manda um `0x31` de 78 B zerado com `data[1] = 0x02` e **sem CRC** — de propósito: *"a dummy packet that should have no effect, since we don't set the CRC"*. Se o controle ainda não estiver em modo cheio, não manda nada e declara desconexão, para não virar a chave sem querer | :44, :814-836, :1650-1657 | código | |
| rádio | **2.22** **A lightbar por rádio nasce retida.** Todo efeito de LED é ADIADO até a animação de conexão terminar, e o critério é numérico: o timestamp de sensor do `0x31` tem de alcançar **10.200.000**. Só então sai o LED reset e depois cor e luzes de jogador | :710-717, :784-812, :1638-1640 | código | |
| rádio | **2.23** O rádio perde para o cabo: mesmo serial nos dois transportes  o SDL não abre o joystick pelo rádio (*"Prefer the USB device over the Bluetooth device"*). Quando o USB some, o rádio volta sozinho | :575-580, :1658-1664 | código | |
| rumble | **2.24** Toma os 8 bits altos dos valores de 16; sem `enhanced_rumble` desloca mais um (*"to match Xbox controllers"*). Deixar os bits de rumble emulado desligados **restaura a háptica de áudio**. Rumble de gatilho é recusado com `SDL_Unsupported()` | :1023-1024, :722-738, :1029-1032 | código | |
| LEDs | **2.25** Cores por jogador (as mesmas do `hid-sony.c`): azul `00,00,40`; vermelho `40,00,00`; verde `00,40,00`; rosa `20,00,20`; laranja `20,10,00`; petróleo `00,10,10`; branco `10,10,10`. Luzes de jogador: `04,0A,15,1B,1F,11,0E`, sempre com `\|0x20` — *"0x1F enables all lights, 0x20 changes instantly instead of fade"* | :328-372 | código | |
| bateria | **2.26** Nibble alto = status, baixo = nível; percentual = `min(nível*10+5, 100)` | :1431-1453 | código | |
| terceiros | **2.27** Feature `0x03`: se voltar com 48 B e `data[2]==0x28`, é terceiro suportado. Capacidades: `data[4]` bit `0x02` sensores, `0x04` lightbar, `0x08` vibração, `0x40` touchpad; `data[20]` bit `0x80` LED de jogador, `0x01` bateria; `data[5]` é o tipo (0 gamepad, 1 guitarra, 2 bateria, 6 volante, 7 arcade, 8 flight stick). Todo terceiro assim detectado passa a usar `PS5StatePacketAlt_t` — timestamp de 16 bits e touchpad em outros offsets. **Para Sony, todas as capacidades são assumidas sem consulta** | :311-320, :451-523 | código | |
| tempo | **2.28** A unidade do timestamp muda com o TIPO de report, não com o transporte: 0,33 µs no pacote cheio, 1 µs no alternativo dos terceiros | :1360-1396 | código | |
| envio | **2.29** Antes de enfileirar, o SDL sobrescreve um rumble pendente se `report_size`, `ucEnableBits1` e `ucEnableBits2` baterem. **`ucEnableBits3` não entra na comparação** | :1128-1140 | código | |

---

## Fonte 3 — flok/pydualsense 0.7.5

**O que foi lido.** Commit `01445f5ed6ba` (master, 29/05/2025). Âncora forte: o
master é **byte-idêntico ao instalado nesta árvore** (md5 conferido para
`pydualsense.py` e `checksum.py`), então os números de linha valem para o
upstream e para o código que roda aqui. O CRC foi verificado **por execução**
contra `zlib`, não só por leitura.

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| envelope | **3.1** Saída por rádio: `0x31`, 78 B — e o tamanho **não é fixo no código**, é herdado do tamanho do report de entrada lido no handshake | pydualsense.py:36, :164-166, :577-579 | código | |
| envelope | **3.2** Saída por cabo: `0x02`, 64 B, também herdado. **Sem CRC** — o cálculo está dentro do ramo do rádio | :35, :160-162, :641-646 | código | |
| envelope | **3.3** O byte [1] do rádio é **`0x02` literal**, sem contador. Não há variável de sequência em todo o arquivo | :581 | código | luz.led_microfone@dualsense |
| envelope | **3.4** O byte [2] do rádio é **`0xFF`**, com o comentário `# [1]` denunciando a intenção: é o `valid_flag0` do cabo movido de +1. O firmware espera ali o `tag` `0x10`. A pydualsense **nunca escreve `0x10`** | :591 | código | luz.led_microfone@dualsense |
| CRC | **3.5** Cobre `range(74)` incluindo o report ID; gravado LE em 74-77. **Esta parte está de acordo com o driver** | checksum.py:46-47, pydualsense.py:641-646 | código | |
| CRC | **3.6** A semente `0xA2` não aparece literal: há o registrador pré-carregado `0xEADA2D49` sobre tabela já invertida. **Provado por execução**: `compute(buf) == zlib.crc32(bytes([0xA2]) + buf[0:74])` em 200/200 buffers, e `zlib.crc32(b'\xa2') == 0xEADA2D49` | checksum.py:44, :6-39 | código | |
| envelope | **3.7** Offsets do ramo de rádio, campo a campo: [0]=`0x31`; [1]=`0x02`; [2]=`0xFF`; [3]=`0x57`; [4] motor dir.; [5] motor esq.; **[10] LED do microfone**; [11] mudo; [12] modo do gatilho dir.; [13..18] forças 0-5; [21] força 6; [23] modo do esq.; [24..29]; [32]; [40] `ledOption`; [43] pulse; [44] brilho; [45] jogador; [46][47][48] R,G,B; [74..77] CRC | :579-646 | código | luz.led_microfone@dualsense |
| envelope | **3.8** Offsets do ramo de cabo: [0]=`0x02`; [1]=`0xFF`; [2]=`0x57`; [3]/[4] motores; [9] LED do mic; [10] mudo; [11] gatilho dir.; [39] `ledOption`; [42] pulse; [43] brilho; [44] jogador; [45][46][47] RGB | :517-575 | código | |
| envelope | **3.9** A diferença cabo->rádio DENTRO desta biblioteca é **+1 uniforme, sem exceção** — e o próprio autor deixou a prova, nos comentários `# [1]`, `# [2]`, `# [9]` do ramo de rádio, que carregam o índice do cabo | :515-575 vs :577-639 | código | |
| âncora | **3.10** **O ramo de CABO casa byte a byte com o kernel**, e o casamento é semântico: no offset 10 a pydualsense escreve `0x10` para silenciar o microfone, e o kernel define `POWER_SAVE_CONTROL_MIC_MUTE = BIT(4) = 0x10` nesse mesmo campo. É isto que torna a divergência do rádio crível em vez de ruído | hid-playstation.c:302-331, :222 vs pydualsense.py:548 | código | |
| consequência | **3.11** **No rádio, o azul da lightbar nunca é escrito.** Pelo struct do kernel R/G/B são 47/48/49; a pydualsense escreve em 46/47/48 — o azul dela cai sobre o verde do firmware e o byte 49 fica no zero com que o buffer nasceu. Pelo cabo o mesmo código acerta os três | :637-639 vs hid-playstation.c:326-330 | código | |
| transporte | **3.12** Não lê bus nem hidraw: pede `device.read(100)` e **mede o comprimento** — 64  cabo, 78  rádio, outra coisa  exceção. O docstring admite: *"This way of determining is not pretty but it works"* | :143-169 | código | |
| gatilhos | **3.13** Sete forças por gatilho, **com dois buracos no meio**: as forças 0-5 saem contíguas depois do byte de modo, mas a força 6 salta dois bytes (rádio: modo 12, forças 13-18, força 6 em **21**, com 19 e 20 zerados) | :929, :946-948, :615-631 | código | |
| envio | **3.14** Um report de saída **para cada** report de entrada: laço apertado que lê, decodifica, remonta a saída inteira do zero e escreve. A taxa de saída fica colada na de entrada, e todo campo é reafirmado a cada volta, **sem gate de mudança** | :252-274, :495-502 | código | |
| pista | **3.15** Evidência de que o +1 foi mecânico: o ramo de rádio carrega o comentário `# outReport[5] - outReport[8] audio related` copiado do cabo sem deslocar — e duas linhas acima o próprio código escreve o motor esquerdo em [5] | :607 vs :605 | código | |

---

## Fonte 4 — Ohjurot/DualSense-Windows (e Paliverse/DualSenseX)

**O que foi lido.** Branch main, commit `a78fbab1fbc0` (10/03/2025): `DS5_Input`,
`DS5_Output`, `DS_CRC32`, `IO.cpp`, `DS5State.h`, `Device.h`, `Helpers.h`.
Cruzado contra o `hid-playstation.c` do disco.

**Zero achados desta fonte viraram célula.** É a fonte com o mapa mais completo
de gatilho adaptativo desta rodada — e o mapa inteiro segue fora do CSV.

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| entrada | **4.1** Concorda com o kernel: payload do `0x31` começa no byte 2, do `0x01` no byte 1. Quadro de 78 B: [0] id, [1] sequência/tag (nenhuma das duas fontes o lê na entrada), [2..64] payload, [65..73] **9 bytes não mapeados por ninguém**, [74..77] CRC | IO.cpp:299-305 · hid-playstation.c:1579-1592 | código | |
| entrada | **4.2** Absolutos, batendo bit a bit com o kernel: 2-5 sticks, 6 L2, 7 R2, 8 sequência, 9-12 botões. `buttons[0]` nibble baixo = hat; bit4 Quadrado, bit5 X, bit6 Bola, bit7 Triângulo. `buttons[1]`: L1, R1, L2, R2, Create, Options, L3, R3. `buttons[2]`: bit0 PS, bit1 Touchpad, bit2 mudo do mic | DS5\_Input.cpp:5-53 · hid-playstation.c:157-172 | código | |
| entrada | **4.3** Touchpad: ponto 1 em 34-37, ponto 2 em 38-41. `b0` bit7 = contato **inativo**; `b0` bits 0-6 = id; X = `b1 \| ((b2 & 0x0F) << 8)`; Y = `(b2 >> 4) \| (b3 << 4)`. Concordância total com o kernel | DS5\_Input.cpp:61-73 · hid-playstation.c:1706-1718 | código | |
| entrada | **4.4** **Dois bytes de retorno de força dos gatilhos na ENTRADA**: absoluto 43 = gatilho DIREITO, 44 = ESQUERDO (o direito vem antes). Caem dentro do `reserved3[12]` do kernel — **fonte única, sem segunda régua** | DS5\_Input.cpp:78-80 · hid-playstation.c:312 | código | |
| CRC | **4.5** O DS5W **não confere CRC nenhum na entrada** — nem em `IO.cpp` nem no parser. Se o produto daqui ler hidraw cru, a conferência tem de vir do nosso lado | ausência conferida em IO.cpp:260-309 | código | |
| CRC | **4.6** Saída: `crcSeed = 0xEADA2D49` sobre 74 bytes, gravado LE em 74-77. **Verificado numericamente**: `0xEADA2D49` é a entrada `0xA2` da tabela do próprio DS5W, e `compute(x) == zlib.crc32(b'\xA2' + x)` em 200 amostras. **Vetor de conferência**: 74 bytes `0x31,0x02` + 72 zeros  CRC `0xF7E7A126` | DS\_CRC32.cpp:40-54, IO.cpp:344-350 | código | |
| saída | **4.7** O bloco comum de 47 B é **byte-idêntico ao do kernel** — o que torna a divergência de cabeçalho cirúrgica, e não estrutural | DS5\_Output.cpp:5-36 · hid-playstation.c:320-349 | código | |
| saída | **4.8** Rumble: relativo 2 = motor DIREITO, 3 = ESQUERDO. O DS5W liga tudo em vez de selecionar bits: `valid_flag0 = 0xFF`, `valid_flag1 = 0xF7` | DS5\_Output.cpp:5-10 | código | |
| saída | **4.9** Lightbar: relativo 41 = `lightbar_setup`, 44/45/46 = RGB. Escreve `0x01` para apagar tudo e `0x02` no uso normal. Ao liberar o dispositivo manda um report zerado com `disableLeds` e os gatilhos em NoResistance, **para não deixar efeito preso** | DS5\_Output.cpp:26-32, IO.cpp:216-231 | código | |
| saída | **4.10** LEDs de jogador: bitmask `0x01` esquerdo … `0x10` direito; o bit `0x20` do mesmo byte controla o desvanecimento **com lógica invertida** (limpa `0x20` quando quer fade). Brilho também invertido: `0x00` alto, `0x01` médio, `0x02` baixo. E escreve `0x03` fixo em `valid_flag2` para o bloco ser aceito | DS5State.h:34-38, :265-280 · DS5\_Output.cpp:15-27 | código | |
| saída | **4.11** LED do microfone: relativo 8. Valores `0x00` apagado, `0x01` aceso, **`0x02` pulsando** — o `0x02` vem apenas desta fonte; o kernel só liga/desliga | DS5State.h:120-135 · hid-playstation.c:333 | código | |
| gatilhos | **4.12** **O mapa de gatilho adaptativo mais detalhado da rodada.** Direito no relativo 10, esquerdo no 21 (passo de 11 B). Dentro de cada bloco, +0 é o MODO: `0x00` sem resistência (zera +0,+1,+2); `0x01` resistência contínua (+1 posição inicial, +2 força); `0x02` por seção; **`0x26`** efeito estendido (+1 = `0xFF` menos a posição inicial, +2 = `0x02` para manter, +4/+5/+6 forças inicial/meio/final, +9 = `max(1, freq/2)`); `0xFC` calibrar. **O kernel não confirma nada disto** — a região inteira é `reserved2[27]` | DS5\_Output.cpp:34-98 · DS5State.h:140-165 | código | |
| tamanhos | **4.13** Cuidado com o **547**: o DS5W escreve 547 B no handle por rádio, mas é o comprimento declarado nas capabilities do HID do Windows, **não o tamanho no ar** — e o próprio fonte se contradiz (o comentário diz 78, a linha seguinte atribui 547) numa variável que **nunca é lida**. Não tome o 547 como fato de protocolo | IO.cpp:194-213, :322-331 | código | |
| cobertura | **4.14** **Paliverse/DualSenseX: cheguei, e não há o que ler.** Árvore inteira listada pela API: 74 blobs, sem truncamento; um único arquivo com extensão de código, e ele é o README colado dentro de uma classe vazia. O resto são JSONs de tradução, PNGs e dois ZIPs de release. **Código fechado — não serve como segunda régua** | api.github.com/repos/Paliverse/DualSenseX | código | |

---

## Fonte 5 — ValveSoftware/steam-devices (+ SDL como o público mais próximo do Steam)

**O que foi lido.** Clone raso, HEAD `22ec85e5ff5e` (25/06/2026), **mais o
`60-steam-input.rules` realmente instalado nesta máquina** (pacote
steam-devices 1:1.0.0.85~ds-2pop1), mais o driver PS5 do SDL em `46498bc24781`,
mais o `hid-playstation.c` deste repo, mais a issue 12297 do steam-for-linux.

**Zero achados desta fonte viraram célula.**

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| escopo | **5.1** O repositório inteiro tem **três arquivos**: duas regras udev e a licença. Não há README, não há código, não há lógica de transporte — toda linha termina em `MODE="0660", TAG+="uaccess"`. **Quem distingue transporte é o cliente Steam, que é fechado e não está aqui** | steam-devices @22ec85e5 | código | |
| udev | **5.2** Duas formas por aparelho: cabo casa o pai USB por `ATTRS{idVendor}`; rádio casa o **nome do device HID pai**, `KERNELS=="*054C:0CE6*"`, porque no rádio não existe pai USB | 60-steam-input.rules:40-50 | código | |
| udev | **5.3** A regra "de Bluetooth" **não é só de Bluetooth**: o curinga dos dois lados casa qualquer barramento HID — `0003` (USB), `0005` (BT) e `0006` (virtual). Só nos aparelhos da própria Valve o Steam enumera o barramento de propósito. **Consequência: a linha do Edge casaria o hidraw do nosso vpad UHID**, que nasce `0003:054C:0DF2.*` | :11, :44, :47 | código | |
| udev | **5.4** **O steam-devices instalado nesta bancada não tem DualSense Edge.** O arquivo instalado tem 142 linhas e **apenas `0CE6`**; nenhuma ocorrência de `0DF2`. As linhas do Edge só existem no upstream, que hoje tem 248 | instalado :35, :38 vs upstream :46-50 | código | |
| udev | **5.5** O Steam pede `uaccess` para `/dev/uinput` com `static_node` — é assim que o Steam Input cria o pad virtual dele. **Não há nenhuma regra para `/dev/uhid` no arquivo inteiro** | :5 | código | |
| udev | **5.6** Wakeup e evdev só valem para o VID `28de` (Valve). Para Sony o Steam **não pede evdev nem toca em energia**: pede hidraw, e só | :13-17 | código | |
| SDL | **5.7** No SDL há dois mecanismos de descoberta: o `bus_type` do hidapi, e o MODO pela primeira leitura (64 B = cabo; `0x31` = rádio cheio; senão rádio simples) | SDL\_hidapi\_ps5.c:415-423 | código | |
| SDL | **5.8** Offset: **+1 na entrada, +2 na saída**, confirmado nas duas bases independentes | SDL\_hidapi\_ps5.c:1625, :1636, :1105, :1110 · hid-playstation.c:1581, :1592 | código | |
| SDL | **5.9** Três sementes, **só no rádio**: `0xA1`, `0xA2`, `0xA3`. O kernel rejeita com `-EILSEQ`; o SDL descarta em silêncio | hid-playstation.c:136-138 · SDL\_hidapi\_ps5.c:1540-1552 | código | |
| SDL | **5.10** 47, 48 e 63 são **três coisas diferentes**: 47 é o miolo comum; 63 é o report inteiro por cabo no kernel; 48 é o que o SDL escreve — ele **trunca os 15 bytes reservados**. Por rádio os dois usam 78 | :144-147, :319-366 · SDL:164-187, :1104-1110 | código | |
| disputa | **5.11** **É aqui que o nosso produto e o Steam Input disputam o mesmo controle.** Por rádio o DualSense nasce no report simples (`0x01`, 10 B: só analógicos, botões e gatilhos). Ele passa ao `0x31` quando alguém lê `0x09`/`0x20` **ou** manda um report de efeitos — e a doc do hint do SDL fecha: *"Once enhanced reports are enabled, they can't be disabled on PlayStation controllers without power cycling the controller."* **Quem entrar primeiro vira a chave para todo mundo, e ela não volta sem desligar o controle** | SDL:425-439, :814-836, :907-938 · SDL\_hints.h:1442-1465 | código | |
| SDL | **5.12** Taxa de sensor: 250 Hz por cabo, **1000 Hz por rádio** — com o *"appears to be"* do próprio autor marcando a incerteza | SDL:850-864 | código | |
| SDL | **5.13** O SDL **derruba o rádio do mesmo controle** quando o cabo aparece, desempatando pelo serial (que é o endereço de rádio lido invertido do feature `0x09`). Quando o USB some, o rádio volta | SDL:426-432, :570-583, :1650-1660 | código | |
| SDL | **5.14** Rumble aprimorado depende de firmware — e **por rádio o SDL chuta**: como o firmware só é lido depois do modo cheio, no modo simples `firmware==0` e ele assume o caminho aprimorado sem ter lido nada | SDL:425-448, :721-735 | código | |
| terceiro | **5.15** Issue 12297 do steam-for-linux, aberta em 30/08/2025: afirma que o DualSense não tem háptica HD por rádio e que *"all features only work when connected via USB"*. **Sem resposta de desenvolvedor da Valve no conteúdo lido**; a issue continua aberta, o que só diz que ninguém a fechou | ValveSoftware/steam-for-linux#12297 | doc | |
| terceiro | **5.16** O sintoma dos **"botões girados" por Bluetooth** (fórum Steam e boilingsteam): eixos do analógico direito confundidos com gatilhos, botões girados no sentido horário. **Não confirmado em código nenhum.** Registrado porque a FORMA da queixa é exatamente a de quem lê o `0x31` como se fosse `0x01` — um deslocamento de um byte. **Hipótese, não medição: não repassar como fato** | resultados de busca, sem arquivo:linha | incerto | |

---

## Fonte 6 — nsfm/dualsense-ts + TechAntohere/Senshi

**O que foi lido.** Branch main dos dois, por `raw.githubusercontent.com` em
31/08/2026. Âncora independente do disco: o `hid-playstation.c`.

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| entrada | **6.1** O dualsense-ts parseia `0x31` e `0x01` lado a lado, e **cada campo do rádio é o do cabo + 1**: sticks 1-4->2-5, gatilhos 5/6->6/7, botões 8->9, giro 16-21->17-22, acel 22-27->23-28, timestamp 28->29, toques 33/37->34/38, bateria 53->54, status 54->55 | dualsense-ts hid\_provider.ts:315-372 e :378-439 | código | toque.touchpad.clique@dualsense |
| entrada | **6.2** Tamanhos confirmados por buffers de teste construídos no próprio repo: 78 B no rádio, 64 B no cabo | hid\_provider\_reports.spec.ts:100-101, :190-191, :253-254 | código | |
| partida | **6.3** **Esta fonte diz que quem destrava o `0x31` é o feature `0x05`** — o comentário do parser mínimo afirma isso, e o provider de node executa exatamente `device.getFeatureReport(0x05, 41)` na conexão: mesmo report e mesmo tamanho que o kernel chama de calibração. No modo mínimo o repo marca `limited = true` e lê só sticks, gatilhos e três bytes de botões | hid\_provider.ts:266-312, node\_hid\_provider.ts:126 | código | |
| saída | **6.4** O dualsense-ts monta o report de CABO e depois o **embrulha**: 78 B, [0]=`0x31`, [1]=`0x02`, [2]=`usb[1]`, [3]=`usb[2]`, e `bt[i+1]=usb[i]` para i de 3 a 47. Deslocamento **+1 uniforme**, com o próprio comentário descrevendo assim | dualsense\_hid.ts:344-391 | código | |
| saída | **6.5** Mapa tipado do report de cabo (48 B), que é a base do de rádio: [1] escopo A, [2] escopo B, [3] rumble dir., [4] esq., [5] fone `0x00-0x7F`, [6] alto-falante `0x00-0xFF` (útil `0x3D-0x64`), [7] mic `0x00-0x40`, [8] flags de áudio (bits 0-3 fonte do mic, 4-5 roteamento, 6-7 modo), [9] LED do mute, [10] power save, **[11..21] gatilho direito, [22..32] esquerdo**, [37] flags de áudio 2 (bits 0-2 pré-amp 0-7, bit 4 beam forming), [39] `LedOptions`, [42] `PulseOptions`, [43] brilho, [44] jogador, [45/46/47] RGB | command.ts:109-173 | código | |
| saída | **6.6** Os dois bytes de escopo, nomeados: A = `0x01` háptica, `0x02` rumble primário, `0x04`/`0x08` retorno dos gatilhos, `0x10`/`0x20`/`0x40` volumes, `0x80` flags de áudio. B = `0x01` LED do mic, `0x02` power save, `0x04` LEDs do touchpad, `0x08` desliga LEDs, `0x10` LEDs de jogador, `0x40` `MotorPower`, `0x80` flags de áudio 2 | command.ts:82-101 | código | |
| CRC | **6.7** dualsense-ts e Senshi implementam **o mesmo algoritmo, a mesma semente `0xEADA2D49` e a mesma tabela de 256 entradas** — e o dualsense-ts declara a origem: *"Ported from pydualsense/checksum.py"*. Cobre 74 bytes incluindo o ID; resultado LE em 74-77 | bt\_checksum.ts:1-57 · DualSenseBtCrc.kt:7-85 | código | |
| CRC | **6.8** **Verificado numericamente contra o kernel**: as sementes cruas não batem (`crc32_le(0xFFFFFFFF,[0xA2])` = `0x1525D2B6`), porque as formulações diferem na inversão — mas em 200 buffers de 78 B aleatórios os dois **dão sempre o mesmo valor**. Vetor de conferência: report zerado exceto [0]=`0x31` e [1]=`0x02`  CRC `0xF7E7A126` | hid-playstation.c:136-137, :1434-1443 | código | |
| saída | **6.9** Mapa do `0x31` segundo o Senshi (esquema +1, `PAYLOAD_OFFSET=2`): motor dir. 4, esq. 5, fone 6, alto-falante 7, mic 8, modo de áudio 9, flag do mic 10, power save 11, gatilhos 12-21 e 23-32, `feature reduce` 38, flag BT 40, `lightbar_setup` 42, brilho 44, máscara de jogador 45, **RGB 46/47/48**, `tail marker` 49 (fixo `0x03`), CRC em 74 | DualSenseBtReportBuilder.kt:25-49 | código | |
| sequência | **6.10** Senshi: `((seq & 0x0F) << 4) \| flagsNibble`, incrementando a cada chamada (wrap 256). Kernel: nibble alto = sequência, nibble baixo = tag, wrap 16. **Concordam na forma**; divergem no wrap, sem efeito visível. **O dualsense-ts não tem sequência nenhuma** — grava `0x02` fixo, o que sob a leitura do kernel é mandar sempre a mesma sequência | DualSenseBtReportBuilder.kt:1428-1434 · hid-playstation.c:1389-1396 | código | |
| CRC | **6.11** **CRC dos FEATURE reports por rádio é outro**: CRC-32 padrão semeado primeiro com o byte `0x53` (o código de SET_REPORT), depois o report ID, depois o corpo até 4 bytes do fim; LE nos últimos 4. As duas fontes concordam no algoritmo | bt\_checksum.ts:72-96 · DualSenseInfoParser.kt:69-76 | código | |
| áudio | **6.12** **O Senshi existe para mandar áudio e háptica pelo rádio**, e é a única fonte da rodada com um mapa disso: report **`0x39` de 547 B** carregando **dois quadros Opus de 200 B** (offsets 13 e 213) mais uma cauda de háptica de 130 B derivada do PCM no offset 413, CRC em 543; áudio 48 kHz, 2 canais, 480 amostras por canal por quadro. E o **`0x32` de 142 B** para háptica/áudio curto (amostras a partir do offset 13, CRC em 138), com um bit de roteamento `0x82` no byte 2 | DualSenseBtSpeakerAudio.kt:12-25, :44-53, :120-134 · DualSenseBtAudioHapticsBuilder.kt:11-21, :230-264 | código | |
| áudio | **6.13** A ordem de partida do áudio por rádio, segundo o comentário de cabeçalho do Senshi: (1) `0x31` de preparo; (2) `0x31` no estilo "USB embrulhado" para rotear; (3) `0x32` com `ledReady=false`; (4) `0x32` com `ledReady=true`; (5) de novo o `0x31` embrulhado; (6) a torrente de `0x39` no relógio do controle. **O próprio comentário diz que isso é a leitura que os autores fizeram de outra implementação (uma ponte Windows)** — não é testemunha independente | DualSenseBtSpeakerAudio.kt:12-25 | doc | |
| entrada | **6.14** **O dualsense-ts não confere o CRC da entrada.** Herdar esse comportamento significa aceitar quadro corrompido em silêncio — o modo de falha mais caro desta casa | hid\_provider.ts:315-372 | código | |
| cobertura | **6.15** **O Senshi não é fonte para o report de ENTRADA**: ele lê botões pela API `InputDevice` do Android, e o único `parseInput` que existe decodifica um feature report de diagnóstico, não o `0x31` | DualSenseInputFilterProbe.kt · DualSenseInfoParser.kt:98 | código | |
| gatilhos | **6.16** **O modo "desligado" do gatilho é `0x05`, não `0x00`** — e o Senshi diz por quê: *"Sending 0x00 leaves the mode byte undefined; on some firmware the trigger stays partially actuated."* Ou seja, zerar o bloco pode deixar o gatilho preso pela metade | DualSenseBtReportBuilder.kt:102-105 | código | |
| gatilhos | **6.17** Bloco de gatilho: o dualsense-ts reserva **11 B** e escreve os 11; o Senshi declara 22 para os dois (concordando com 11), mas as cópias efetivas usam `minOf(10, size)` e deixam o 11º zerado — **inconsistência interna do Senshi**, não de layout | command.ts:132-155 · DualSenseBtReportBuilder.kt:37-38, :1312-1335 | código | |
| volumes | **6.18** dualsense-ts limita por código: fone `0x00-0x7F`, alto-falante `0x00-0x64` (`0x64` = cheio), mic `0x00-0x40`. O Senshi usa `0x7C` como padrão para os três e mapeia porcentagem para 50-127 no alto-falante | dualsense\_hid.ts:447-469 · DualSenseBtReportBuilder.kt:87, :1465-1479 | código | |
| contradição | **6.19** **O Senshi contradiz a si mesmo dentro do mesmo arquivo**: os construtores nativos usam `PAYLOAD_OFFSET=2` (+1), mas `buildBluetoothWrappedUsbOutputReport` põe [1]=`seqTag`, **[2]=`0x10`** e copia `usb[1..47]` para `report[3..49]` — isto é +2, e o `0x10` é literalmente o `DS_OUTPUT_TAG` do kernel | DualSenseBtReportBuilder.kt:26 vs :1368-1381 | código | |
| áudio | **6.20** O README do dualsense-ts afirma o contrário do Senshi: *"Over Bluetooth, there is no audio transport. Audio controls (volume, routing, muting) work over both USB and Bluetooth, but they only affect audio playback over USB."* | dualsense-ts README.md:779 | doc | |

---

## Fonte 7 — dualshock-tools.github.io

**O que foi lido.** Clone raso, commit `58004b10b7b0` ("Bump to v2.34",
29/08/2026). Integrais: `ds5-controller.js` (906 linhas), `base-controller.js`,
`ds5-edge-controller.js`, `LINUX.md`. Em trecho: `controller-manager.js`,
`core.js`, `vr2-controller.js`, `utils.js`, os dois modais de calibração.

**Zero achados desta fonte viraram célula** — e a razão está no primeiro deles.

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| escopo | **7.1** A constante `BT_REPORT_ID: 0x31` existe e **nunca é referenciada em lugar nenhum do repositório**. O único envio de saída é sempre o `USB_REPORT_ID`. O `0x31` está lá como nota, não como caminho exercitado | ds5-controller.js:58-61, :594 | código | |
| escopo | **7.2** **A ferramenta recusa Bluetooth de propósito**: no primeiro input report, se o comprimento não for 63 bytes ela mostra *"The device is connected via Bluetooth. Disconnect and reconnect using a USB cable instead."* e desconecta. **Tudo que este repo afirma sobre rádio é teoria, não prática dele** | core.js:220-227 | código | |
| CRC | **7.3** `grep -rniE 'crc'` em `js/`, `templates/` e `index.html` devolve **ZERO ocorrências**. O dualshock-tools não calcula, não confere e não menciona CRC. **Quem o citar como fonte de CRC está citando errado** | grep integral | código | |
| entrada | **7.4** Os offsets de entrada batem **byte a byte** com o driver: dpad 7, L2 4, R2 5, IMU 15, touchpad 32, sticks 0-3, bateria 52. Duas fontes independentes, mesmo mapa | ds5-controller.js:40-47 · hid-playstation.c:295-317 | código | |
| entrada | **7.5** Touchpad: a partir do 32, dois pontos de 4 B; bit 7 do byte 0 ligado = dedo LEVANTADO; X e Y de 12 bits. Bate com o struct do driver | controller-manager.js:665-684 | código | |
| saída | **7.6** O `pack()` monta 47 B e coincide com o bloco comum do driver em `valid_flag0/1`, motores, volumes, `audio_control`, LED do mudo, LEDs de jogador e RGB | ds5-controller.js:139-194 | código | |
| gatilhos | **7.7** Gatilho direito em 10-20 do bloco comum (modo em 10, três parâmetros em 11/12/13), esquerdo em 21-31. Modos: `0x00` OFF, `0x01` RESISTANCE, `0x02` TRIGGER, `0x06` AUTO_TRIGGER; parâmetros `start`, `end`, `force`. **O driver não contradiz nem confirma** — a faixa inteira é `reserved2` | ds5-controller.js:50-55, :160-178, :648-683 | código | |
| saída | **7.8** `DS5_VALID_FLAG2` existe (LED_BRIGHTNESS `0x01`, LIGHTBAR_SETUP `0x02`) mas **o `pack()` nunca o escreve** — o laço de zeragem cobre 32-42 e o offset é 38. **Brilho de LED e lightbar setup não chegam a sair.** É código morto | ds5-controller.js:85-100, :180-183 | código | |
| rumble | **7.9** O driver escolhe o caminho de vibração pela `update_version` (v2 se ≥ 2.21). **O dualshock-tools lê a `update_version` do `0x20` só para EXIBIR**, nunca decide nada com ela, e marca sempre os bits 0 e 1 do `valid_flag0` | ds5-controller.js:307, :333, :690-707 · hid-playstation.c:1302, :1458-1467 | código | |
| firmware | **7.10** Feature `0x20`, 64 B com o ID no byte 0, **offsets idênticos nas duas fontes**: `build_date` ASCII 1-11, `build_time` 12-19, `fwtype` u16 em 20, `swseries` 22, `hwinfo` u32 em 24, `fwversion` u32 em 28, `updversion` u16 em 44, e três u32 em 48/52/56 rotulados SBL, Venom e Spider | ds5-controller.js:293-312 · hid-playstation.c:1285-1302 | código | |
| IMU | **7.11** **A ferramenta não lê o feature `0x05`.** Converte o IMU com sensibilidades NOMINAIS fixas, escritas no próprio comentário como *"uncalibrated"*: **14,31 LSB por °/s** e 8192 LSB/g, com o giro vindo antes do acelerômetro. O 8192 bate com o driver; o 14,31 **não tem contraparte** — o driver deriva a sensibilidade por aparelho | controller-manager.js:705-716 | código | |
| IMU | **7.12** Layout do feature `0x05` (só o driver tem): 41 B, ID no byte 0, u16 LE — viés de pitch em 1, yaw 3, roll 5; pitch± 7/9, yaw± 11/13, roll± 15/17; `speed_plus/minus` 19/21; acel x± 23/25, y± 27/29, z± 31/33. Normaliza para 1/1024 °/s e 1/8192 g, com fallback se a calibração vier degenerada | hid-playstation.c:1176-1266, :226-229 | código | |
| calibração | **7.13** **O que a ferramenta de fato FAZ não passa pelo `0x05`**: são comandos de fabricante. CENTRO: `0x82 [1,1,1]` começa e espera `0x83` cujos 4 primeiros bytes em **big-endian** valham `0x83010101`; `0x82 [3,1,1]` amostra (três amostras, 150 ms entre elas); `0x82 [2,1,1]` grava e espera `0x83010102`. ALCANCE: `[1,1,2]`->`0x83010201`, `[2,1,2]`->`0x83010202`. Depois grava com `nvsUnlock` seguido de `nvsLock` | ds5-controller.js:424-525, :363-374 | código | |
| calibração | **7.14** No Edge o comando de gravar vai **duas vezes** e as respostas mudam (`0x83010103` OU `0x83010312`; `0x83010203`). O flash do Edge tem ritual próprio: destranca módulo esquerdo `0x80 [21,6,0,11]` e direito `[21,6,1,11]`, destranca NVS, lê e reescreve o finetune, tranca módulos `[21,4,i,8]` e NVS, com esperas de 50 a 250 ms | ds5-edge-controller.js:98-260 | código | |
| NVS | **7.15** `0x80 [3,1]` tranca; `0x80 [3,2, 101, 50, 64, 12]` destranca (**a chave está literal no fonte**); `0x80 [3,3]` consulta e a resposta vem no `0x81` como u32 big-endian a partir do byte 1: `0x15010100` pendente de reinício, `0x03030201` trancado/temporário, `0x03030200` destrancado/permanente. `0x80 [1,1]` é reset do controle | ds5-controller.js:376-404, :527-548 | código | |
| finetune | **7.16** Leitura: `0x80 [12,2]` (Edge: `[12,4]`), espera 100 ms, lê `0x81`, valida `cmd=129, byte1=12, byte2∈{2,4}, byte3=2`, e depois **12 u16 little-endian a partir do byte 4**. Escrita: `0x80 [12,1]` seguido dos 12 em pares. Ordem: LL, LT, RL, RT, LR, LB, RR, RB, LX, LY, RX, RY. Máximo 65535 no DS5, 4095 no Edge | ds5-controller.js:565-582 · finetune-modal.js:9 · ds5-edge-controller.js:262-279 | código | |
| identidade | **7.17** **Dois caminhos diferentes para o mesmo endereço de rádio**: a ferramenta usa o comando de fabricante `0x80 [9,2]`, lê a resposta no `0x81` e pega SEIS bytes a partir do índice 4 **em ordem invertida**; o driver usa o feature `0x09` ("pairing info", 20 B) e copia de `buf[1]` em diante | ds5-controller.js:406-410, utils.js:68-75 · hid-playstation.c:151-152, :1314-1325 | código | |
| identidade | **7.18** Catálogo de info pelo `0x80 [base,num]`, com carga a partir do byte 4: número de série (1,19,17), MCU Unique ID (1,9,9), PCBA ID (1,17,14 — **string invertida**), código de barras da bateria (1,24,23), VCM esquerdo (1,26,16) e direito (1,28,16), ID do touchpad (5,2,8), firmware do touchpad (5,4,8). No Edge, `0x80 [21,34,0/1]` devolve os códigos de barras dos módulos | ds5-controller.js:412-422, :314-340 | código | |
| identidade | **7.19** Modelo da placa por `(hw_ver >> 8) & 0xff`: `0x03` BDM-010, `0x04` BDM-020, `0x05` BDM-030, `0x06` BDM-040, `0x07`/`0x08` BDM-050, `0x09` BDM-060R, `0x11` BDM-060M, `0x13` BDM-060X. O próprio fonte marca `0x10` e `0x12` como desconhecidos. **O driver lê o mesmo `hw_version` e não tem essa tabela** | ds5-controller.js:550-563 | código | |
| identidade | **7.20** **A cor do plástico, que já é nossa, confere na íntegra**: 5º e 6º caracteres do número de série, 28 códigos — de `00` White a `ZF` 007 First Light. Bate com os 28 modelos que a casa já tem. **Nada a incorporar nesta versão** | ds5-controller.js:197-234 | código | |
| Edge | **7.21** Os quatro botões extras do Edge ficam no byte 9 do payload (o mesmo de PS/touchpad/mute): `fn_left 0x10`, `fn_right 0x20`, `paddle_left 0x40`, `paddle_right 0x80`. Limitadores de curso no byte 49: bits 4-5 = L2, 6-7 = R2. O driver trata 40-51 como reservado — **não contradiz nem confirma** | ds5-edge-controller.js:17-31, :52-58 | código | |
| áudio | **7.22** **Comandos de fabricante para tom de teste**, sem contraparte no driver: `0x80 [6,4,0,0,0,0,4,0,6]` configura o caminho do FONE; `[6,4,0,0,8]` o do ALTO-FALANTE; `[6,2,1,1,0]` liga o tom; `[6,2,0,1,0]` desliga. Volumes usados: alto-falante 85, fone 55, com `validFlag0` marcando HEADPHONE\|SPEAKER\|AUDIO\_CONTROL. **Material exclusivo desta fonte, não confirmado** | ds5-controller.js:714-769 | código | |
| bateria | **7.23** Byte 52, carga no nibble baixo, estado no alto, fórmula `min(carga*10+5, 100)` para os estados 0 e 1 e 100 fixo para o estado 2 — **idêntico ao driver**, que documenta o porquê ("cada unidade corresponde a 10%") | ds5-controller.js:861-888 · hid-playstation.c:1724-1743 | código | |
| jack | **7.24** `status[1]` (byte 53): bit 0 fone plugado, bit 1 mic plugado, bit 2 mic mudo — **só o driver lê**. O dualshock-tools nem toca esse byte. Se a casa quiser saber "tem fone plugado", o endereço é o driver | hid-playstation.c:177-180, :1487-1552 | código | |
| volumes | **7.25** **Só o driver declara faixa**, e em comentário dentro do struct: fone `0x0-0x7f`, alto-falante `0x0-0xff`, mic `0x0-0x40`. O dualshock-tools não impõe faixa nenhuma | hid-playstation.c:329-331 | código | |
| partida | **7.26** Ao conectar, a ferramenta zera tudo e força `validFlag1 = 0xF7` (todos os bits menos o 3) com a barra em azul puro, como "init default states". **O bit 3 que ela deliberadamente não marca é justamente o `RELEASE_LEDS` do driver** — e não há comentário explicando a escolha | ds5-controller.js:621-643 · hid-playstation.c:215 | código | |
| censo | **7.27** Censo integral dos feature reports que a ferramenta toca no caminho DS5: `0x20`, `0x80`/128, `0x81`/129, `0x82`, `0x83`. **Não há `0x05` nem `0x09` em lugar nenhum** — tudo que ela sabe de IMU é nominal, e o endereço ela pega pelo `0x80 [9,2]` | grep integral de `sendFeatureReport`/`receiveFeatureReport` | código | |
| rádio | **7.28** A **única frase do repo inteiro** que descreve a diferença cabo/rádio está no controlador do PS VR2 Sense: *"aquele gist documenta pacotes Bluetooth, que carregam o report ID `0x31` mais um byte extra; o USB via WebHID descarta os dois"*, e por isso o layout foi deslocado DOIS bytes. **É comentário, e é sobre o VR2, não sobre o DualSense** | vr2-controller.js:16-22 | doc | |

---

## Fonte 8 — `hid-nintendo.c` + dekuNukem/Nintendo_Switch_Reverse_Engineering

**O que foi lido.** A cópia DKMS do disco, mais `torvalds/linux` nas tags v6.8,
v6.12 e em master. Do repositório de engenharia reversa:
bluetooth_hid_notes.md, bluetooth_hid_subcommands_notes.md, USB-HID-Notes.md,
imu_sensor_notes.md, rumble_data_table.md.

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| modo | **8.1** `JC_INPUT_BUTTON_EVENT 0x3F` está **definido e nunca referenciado**. O read handler só chama o parser para `0x21`, `0x30` e `0x31`, **sem ramo por barramento**. Consequência direta: um Pro que fique no modo simples `0x3F` por rádio **não gera um único evento de input** — o silêncio não é falha de link, é o parser não conhecer o report. Conferido nas duas cópias | hid-nintendo.c:152, :2991-2999 | código | movimento.acelerometro@sn30 · movimento.acelerometro@pro |
| modo | **8.2** O **único** ato que tira o Pro do `0x3F` é o subcomando `0x03` com `data[0] = 0x30` (*"standard, full report mode"*), com timeout de HZ. É o único lugar do driver que muda o modo | :1543-1554 | código | |
| partida | **8.3** Todo o handshake roda sob `joycon_using_usb()`, que é literalmente `hdev->bus == BUS_USB`. A sequência do cabo: `0x80+0x01` status -> `0x80+0x02` handshake -> `0x80+0x03` baudrate 3M (falha vira aviso) -> **`0x80+0x02` handshake DE NOVO** -> `0x80+0x04` no-timeout com resultado ignorado. **Por rádio nada disso acontece** — cai direto no `REQ_DEV_INFO`. É a única diferença de conteúdo entre os dois barramentos no Pro | :862-865, :168-176, :2839-2895 | código | |
| partida | **8.4** **Por que o handshake vai duas vezes** — explicação que não estava citada em lugar nenhum daqui: o `0x80 0x02` é o handshake com o chip Broadcom e *"can only be called once per session"*; o `0x80 0x03` (baudrate, *"needed for improved Joy-Con latency"*) **permite um novo `0x80 0x02`**. O documento também diz que o `0x80 0x04` é NECESSÁRIO para o Pro, e que o `0x80 0x05` é o inverso — deixa o controle *"time out and talk Bluetooth again"* | dekuNukem USB-HID-Notes.md | doc | |
| partida | **8.5** No mainline, `joycon_send_usb` monta `u8 buf[2]` e transmite 2 bytes. **O mainline não tem module_param nenhum no arquivo.** O padding para 64 B desta casa é remendo local e continua fora do upstream — a aposta do README daqui segue sendo aposta | torvalds master · hid-nintendo.c:1101-1124 | código | |
| identidade | **8.6** O documento de USB HID dá um exemplo literal da resposta `0x81 0x01` e lê o tipo no byte 3 e o endereço nos bytes 4-9 **invertido**. O remendo local copia `resp + 4` por 6 bytes **sem inverter**. Os offsets batem; a ordem, não | dekuNukem USB-HID-Notes.md · hid-nintendo.c:1137-1183 | doc | |
| identidade | **8.7** No `REQ_DEV_INFO` (subcmd `0x02`) **as duas fontes concordam**: bytes 0-1 firmware, byte 2 tipo (1 esquerdo, 2 direito, 3 Pro), byte 3 sempre `0x02`, bytes 4-9 endereço **em big endian**, byte 10 sempre `0x01`, byte 11 flag de cores na SPI. Este é o endereço que vira o `uniq` do evdev | :2696-2741 · dekuNukem bluetooth_hid_subcommands_notes.md | código | |
| NFC | **8.8** **O driver declara NFC/MCU inteiro e não emite nada.** As sete únicas atribuições de `subcmd_id` são SET_PLAYER_LIGHTS, SET_HOME_LIGHT, SPI_FLASH_READ, SET_REPORT_MODE, ENABLE_VIBRATION, ENABLE_IMU e REQ_DEV_INFO. Nenhuma é RESET_MCU, SET_MCU_CONFIG ou SET_MCU_STATE, embora as três estejam definidas. O output `0x11` está definido e nunca é montado. **Zero NFC/amiibo no kernel, nos dois transportes** | :123, :138-140, :155, :2991-2999 | código | |
| modo | **8.9** Modos que o `0x03` aceita: `0x00` polling da câmera NFC/IR, `0x01` config do MCU, `0x02` dados NFC/IR, `0x03` câmera IR, `0x23` update do MCU, **`0x30` standard full a 60 Hz**, `0x31` NFC/IR a 60 Hz, `0x33`/`0x35` desconhecidos, `0x3F` simple HID. Tamanhos: `0x3F` 12 B dirigido a evento; `0x21` até 50 B; `0x30`/`0x32`/`0x33` 49 B; `0x31` até 362 B. Saída: `0x01` rumble+subcomando, `0x10` só rumble, `0x11` MCU, `0x12` desconhecido — todos de 64 B | dekuNukem bluetooth\_hid\_subcommands\_notes.md e bluetooth\_hid\_notes.md | doc | |
| envelope | **8.10** **O envelope do `0x30` é o mesmo no cabo e no rádio, confirmado byte a byte**: [0] ID, [1] timer, [2] nibble alto bateria / baixo connection info, [3-5] botões, [6-8] analógico esquerdo, [9-11] direito, [12] vibrator input, **[13-48] seis eixos em três quadros de dois grupos de 3 int16 LE, acelerômetro antes do giroscópio**. É exatamente a `struct joycon_input_report` do driver, que é uma só, sem ramo de barramento. Calibração da SPI: sticks de fábrica em 0x603d/0x6046, IMU em 0x6020-0x6037, usuário em 0x8010/0x8026 | :589-618, :195-210, :1600-1619 · dekuNukem bluetooth\_hid\_notes.md | código | movimento.acelerometro@sn30 · movimento.acelerometro@pro |
| taxa | **8.11** Taxa do `0x30` no Pro por rádio: **três números, nenhum medido aqui**. (a) O comentário do driver diz 8 ms — *"this is the wildcard"*, escrito pelo próprio autor. (b) O parágrafo seguinte, do mesmo autor, relata 11 ms **ou** 15 ms no aparelho dele, sem saber o que decide, e diz que pilhas Bluetooth alteram isso (o Android fixa o SSR em 11 ms). (c) O documento externo diz 60 Hz, *"120Hz Pro Controller"* = 8,33 ms. O default do driver enquanto não mediu é 15 ms | :1633-1672, :223 · dekuNukem bluetooth\_hid\_notes.md | doc | |
| perda | **8.12** A fórmula exata, e **ela não consulta o barramento**: `dropped_threshold = avg_delta_ms * 3 / 2`; `dropped_pkts = (delta - min(delta, threshold)) / avg_delta_ms`; avisa só se `> 3`. Logo o piso real é **4 relatórios perdidos numa rajada**, com teste estrito | :227, :1713-1726 | código | |
| perda | **8.13** **A contagem tem QUATRO pisos, não dois.** Além dos dois já mapeados (rajadas de 1-3 não aparecem; N conta RELATÓRIOS e cada um vale 3 amostras): (3) o aviso sai por `hid_warn_ratelimited`, então sob perda contínua o limitador do kernel **engole episódios que qualificaram**; (4) `imu_avg_delta_ms` só é recalculado a cada 300 amostras, e até lá vale o default de 15 ms — num link que roda a 8 ms, **os ~300 primeiros relatórios são medidos contra uma régua quase o dobro do certo**, e o limiar de 22,5 ms que sai daí esconde perda real | :225, :1690-1700, :1718-1725 | código | |
| ritmo | **8.14** **O ritmo é o que separa rádio de cabo**, e o driver diz a causa: *"Sending subcommands and/or rumble data at too high a rate can cause bluetooth controller disconnections"*. Janela de delta válido 8-17 ms; exigidos 3 deltas válidos consecutivos; limitador **20 ms no USB contra 60 ms no Bluetooth**; 25 tentativas de achar janela; 4 ms de espera após um report antes de transmitir. **Por cabo o driver ATALHA a regra**, satisfazendo os 3 deltas à força. O documento externo **não faz** essa afirmação sobre queda de link — ela é do kernel | :968-980, :981-1049, :2016-2023 | código | movimento.imu.ligar@sn30 · luz.led_home@pro · luz.led_jogador@sn30 |
| rumble | **8.15** **O rumble HD existe no encoder e está inacessível de fora.** A saída é o `0x10` com contador de 4 bits e 8 bytes; `joycon_encode_rumble` escreve 4 B por motor codificando frequência alta, amplitude alta, frequência baixa e amplitude baixa, grampeadas a 41-626 Hz e 82-1253 Hz (o documento externo dá 40,875-1252,572 Hz, que casa). **Mas as quatro frequências são fixadas em 160/320 Hz na configuração e nunca mudam: não há sysfs, ioctl nem interface que as altere.** O único caminho de userspace é `FF_RUMBLE`, que vira só amplitude. Ritmo: um pacote a cada 50 ms, fila de 8, e 5 pacotes de amplitude zero após parar | :2140-2185, :2317-2330, :2044-2077 · dekuNukem rumble\_data\_table.md | código | |
| link | **8.16** **Sniff / política de link não existe nas duas fontes.** `sniff` aparece ZERO vezes no arquivo; não há uma linha de L2CAP ou HCI (a única constante parecida, `SET_HCI_STATE`, está declarada e nunca enviada). O repositório de engenharia reversa documenta o protocolo HID, não a camada BR/EDR. **A cura de sniff desta casa não tem contraparte upstream para conferir** — ela vive inteiramente na camada BlueZ | :133 · DanielOgorchock/linux#33 | código | |
| clone | **8.17** **O driver não tem NENHUM discriminador de clone.** A tabela casa o Pro por USB e por Bluetooth com o mesmo par; a identidade vem só do byte de tipo do `REQ_DEV_INFO` e do `hdev->product`. O comentário do fonte registra que **nem o PID é confiável** — o NSO Genesis reporta `0x201E` por USB e `0x2017` por Bluetooth, PID de SNES. Nada disso alcança um clone que responde tudo certo mentindo o mesmo PID. O `bcdDevice` é descritor USB e **não existe por rádio** | :3249-3273, :2726-2739, :2765-2795 | código | plataforma.distinguir_clone@sn30 |
| evdev | **8.18** O driver cria **dois** input devices, o gamepad e um `<nome> (IMU)`. Os dois herdam `id.bustype = hdev->bus`, vendor, product, version, `phys` e `uniq` = o endereço do `REQ_DEV_INFO`. **Duas consequências para o vpad**: (1) o `bustype` do Pro real muda com o transporte, enquanto o vpad nasce sempre `BUS_USB` — quem deduplica por bustype vê coisas diferentes conforme o cabo; (2) o driver faz `hdev->version \|= 0x8000` de propósito, para o SDL2 distinguir o mapeamento HID default do mapeamento do Linux game controller spec | :2336-2420, :3099-3106 | código | |
| bateria | **8.19** `bat_con`: bit 0 `host_powered`, bit 4 `battery_charging`, e os 3 bits altos dão o nível em **cinco degraus** — 0 vazio, 1 baixo, 2 médio, 3 alto, 4 cheio; qualquer outro vira UNKNOWN com aviso. Casa com o documento externo. **Sem ramo por transporte** | :1843-1878 | código | |

---

## Fonte 9 — 8BitDo SN30 Pro por Bluetooth

**O que foi lido.** (a) kernel v6.12: `hid-microsoft.c`, `hid-ids.h`,
`hid-nintendo.c`, `xpad.c`; (b) SDL `release-3.4.14`: `SDL_hidapi_8bitdo.c`,
`SDL_hidapi_switch.c`, `SDL_hidapi_nintendo.h`, `usb_ids.h`, mais a PR #12964;
(c) `ebitdo.quirk` do fwupd; (d) TheJayMann/8bitdo-spec; (e) o patch LKML de
rumble do SN30 Pro+; (f) as páginas oficiais da 8BitDo; (g) os dois DKMS do
disco.

**Foi a fonte mais produtiva da rodada: 9 dos 24 achados que viraram célula.**

| grupo | o que a fonte diz | endereço | grau | célula |
| --- | --- | --- | --- | --- |
| X-input | **9.1** O kernel tem **uma única** entrada 8BitDo no driver de rumble da Microsoft, e é **`HID_BLUETOOTH_DEVICE` do SN30 Pro PLUS** (`045e:02e0`) com `MS_QUIRK_FF`. Entrada de rádio apenas: não há `HID_USB_DEVICE` correspondente | hid-microsoft.c:460-461, hid-ids.h:953 | código | |
| X-input | **9.2** Report de saída ID 3, 9 bytes: [1] enable `0x03`, [2] forte, [3] fraco, [6] duração `0xFF`, [7] atraso 0, [8] loop `0xFF`. **Magnitude é 0-100, não 0-255.** Sem CRC e sem cabeçalho próprio de rádio | hid-microsoft.c:40-57, :281-324 | código | |
| X-input | **9.3** Para o SN30 Pro **liso** não há entrada no kernel, e o autor do patch escreveu: *"Other controllers like the N30 Pro 2, SF30 Pro, SN30 Pro, etc. probably also need this quirk, but I do not have the hardware to test."* **Hipótese declarada, não fato** | spinics linux-input msg68898 | doc | |
| nativo | **9.4** PIDs: `USB_VENDOR_8BITDO 0x2dc8`; SN30 Pro **`0x6001` no cabo e `0x6101` no rádio**; SF30 Pro `0x6000`/`0x6100`; Pro 2 `0x6003`/`0x6006`; Pro 3 `0x6009` | SDL usb\_ids.h:27, :73-81 | código | |
| nativo | **9.5** Três report IDs de entrada, nomeados pelo SDL: **`0x01` = report de rádio em modo aprimorado**, `0x04` = report de cabo aprimorado, `0x03` = firmware sem modo aprimorado. Qualquer outro é descartado | SDL\_hidapi\_8bitdo.c:51-55, :539-547 | código | |
| nativo | **9.6** **Não há deslocamento de offset entre cabo e rádio no modo nativo**: o mesmo parser trata `0x01`, `0x04` e `0x03` com offsets idênticos. Só o report ID muda. **Sem byte de sequência a mais, sem CRC** — o oposto do DualSense | SDL\_hidapi\_8bitdo.c:534-719 | código | |
| nativo | **9.7** Mapa do `0x01` (rádio): [1] chapéu (0-7 horário a partir de cima, ≥8 centrado); [2-5] LX,LY,RX,RY; **[6] gatilho DIREITO, [7] ESQUERDO**; [8] botões A (bit0 Sul, 1 Leste, 2 PR, 3 Oeste, 4 Norte, 5 PL, 6 L1, 7 R1); [9] botões B (bit2 Back, 3 Start, 4 Guide, 5 L3, 6 R3, 7 Share); [10] L4/R4; [14] bateria; **[15..26] IMU**; [27..30] carimbo de tempo em µs LE32 | SDL\_hidapi\_8bitdo.c:549-673 | código | |
| nativo | **9.8** Sticks de **8 bits**, centro `0x7f`, iguais no cabo e no rádio. **Não é o 12 bits do modo Switch** | SDL\_hidapi\_8bitdo.c:613-625 | código | |
| nativo | **9.9** Gatilhos: **analógicos de 8 bits** no report aprimorado ([7] e [6]), mas **DIGITAIS** no report de 9 bytes do firmware antigo (`data[1] & 0x01` e `& 0x02`), onde o SDL manda MAX ou MIN sem meio-termo | SDL\_hidapi\_8bitdo.c:627-635, :513-514 | código | |
| nativo | **9.10** Bateria no modo nativo é **percentual, não degrau**: `data[14] >> 7` é o status e `data[14] & 0x7f` é lido **diretamente como porcentagem 0-100**; 100 vira CARREGADA | SDL\_hidapi\_8bitdo.c:637-663 | código | |
| nativo | **9.11** IMU a partir de `data[15]`: seis int16 LE na ordem accelX/Y/Z, gyroX/Y/Z. Escalas **4096 LSB/g** e **±2000 °/s** mapeados em ±INT16_MAX. O SDL ainda gira o sistema: o X do hardware é ROLL (eixo do conector de energia), o Y é PITCH, o Z é YAW | SDL\_hidapi\_8bitdo.c:58-59, :112-123, :666-715 | código | |
| nativo | **9.12** Taxa de IMU no SN30 Pro **por rádio: 70 Hz**, com o comentário do autor — *"Observed to be anywhere between 60-90 hz. Possibly lossy in current state."* Por cabo: 200 Hz com carimbo de tempo, 100 Hz sem. Pro 2/Pro 3 no rádio: 85 Hz | SDL\_hidapi\_8bitdo.c:286-332 | código | |
| nativo | **9.13** **IMU, rumble e bateria dependem todos de UM único feature report.** Se o `0x06` responder, liga de uma vez `sensors_supported`, `rumble_supported` e `powerstate_supported` — e ainda tira o endereço de rádio de `data[5..10]` invertido. Se não responder em 5 tentativas de 10 ms, **nenhuma das três liga** e o aparelho cai no report de 9 bytes sem sensor, sem rumble e sem bateria. **É um interruptor único: as três lacunas se respondem juntas** | SDL\_hidapi\_8bitdo.c:232-262, :143-148 | código | |
| nativo | **9.14** Firmware mínimo declarado na mensagem do commit que criou o driver: *"Pro 2 v3.06 above / SF30 Pro/SN30 Pro v2.05 above"* | SDL PR #12964, commit 2b3c481215 | doc | |
| nativo | **9.15** Rumble no modo nativo: cinco bytes `{0x05, low>>8, high>>8, gatilho esq., gatilho dir.}`. Os dois últimos só são preenchidos se `trigger_rumble_supported`, **que é ramo do Ultimate 3, não do SN30 Pro**. Sem diferença entre cabo e rádio | SDL\_hidapi\_8bitdo.c:378-422 | código | |
| nativo | **9.16** Para o SN30 Pro o SDL declara `nbuttons = 11` (os 15 e 16 são de Pro 2, Pro 3 e Ultimate). Sensores só registrados se `sensors_supported` | SDL\_hidapi\_8bitdo.c:347-373 | código | |
| nativo | **9.17** **LED e efeitos: recusa explícita.** `SetJoystickLED` devolve `SDL_Unsupported()` incondicionalmente, `SendJoystickEffect` também, `rgb_supported` nunca é ligado, `GetDevicePlayerIndex` devolve -1 e `SetDevicePlayerIndex` não faz nada. **Não há LED de jogador escrevível nem legível por este caminho** | SDL\_hidapi\_8bitdo.c:277-284, :424-445 | código | |
| Switch | **9.18** No modo Switch a bateria é de **cinco degraus nomeados**, sem percentual em lugar nenhum. Vale igual por cabo e por rádio | hid-nintendo.c:1843-1878 | código | |
| Switch | **9.19** **`grep -n 'crc\|CRC'` no `hid-nintendo.c` inteiro devolve ZERO ocorrências**, e o arquivo não inclui `linux/crc32.h`. O protocolo do Pro **não assina report nem por cabo nem por rádio** — o oposto do DualSense | hid-nintendo.c integral · torvalds v6.12 | código | plataforma.escrita_crua@sn30 |
| Switch | **9.20** Os mesmos report IDs nos dois transportes. Saída: `0x01` rumble+subcomando, `0x10` rumble só, `0x11` MCU, `0x80` comando USB. Entrada: `0x30`, `0x21`, `0x3F`, `0x31`, `0x81`. **O driver não troca nenhum ID conforme o barramento** — só o `0x80`/`0x81` é intrinsecamente do cabo | hid-nintendo.c:120-175, :864 | código | plataforma.escrita_crua@sn30 |
| Switch | **9.21** **O limitador de subcomando é três vezes mais lento no rádio**: 20 ms no USB contra 60 ms no Bluetooth, escolhidos por `hdev->bus`. Isso governa TODA escrita — LED de jogador, LED de Home, ligar IMU, ligar vibração | hid-nintendo.c:825-828 (v6.12) | código | movimento.imu.ligar@sn30 |
| Switch | **9.22** A taxa do `0x30` declarada no comentário do driver: joy-con por BT 15 ms; grip por USB 15 ms; Pro por USB 15 ms; **Pro por Bluetooth 8 ms — "this is the wildcard"**. Cada report traz TRÊS amostras de IMU, tipicamente 5 ms entre si | hid-nintendo.c:1385-1400 (v6.12) | código | |
| Switch | **9.23** Escala do IMU: acelerômetro 16 bits, ±8000 mG, **4096 LSB/g**; giroscópio 16 bits, ±2000 °/s, **14247** (já com os 15% que a STMicro recomenda somar, reescalado por 1000). Sticks: `JC_MAX_STICK_MAG 32767` depois da calibração de 12 bits lida da SPI | hid-nintendo.c:230-261, :213-214 | código | movimento.acelerometro@pro · movimento.acelerometro@sn30 |
| clone | **9.24** **O discriminador de clone mais direto da rodada, e ele vive no MESMO subcomando que a casa já usa para tirar endereço de rádio.** O SDL lê a resposta do `REQ_DEV_INFO` como `{firmware[2], ucDeviceType, filler, endereço[6] big-endian, filler, colorLocation}`, e a enum dele diz: 1 Joy-Con esquerdo, 2 direito, **3 Pro genuíno**, **6 `LicProController` (Pro licenciado de terceiro)**, 7-13 os clássicos do NSO, 0 desconhecido | SDL\_hidapi\_nintendo.h:25-39 · SDL\_hidapi\_switch.c:205-213, :662-671 | código | plataforma.distinguir_clone@sn30 |
| clone | **9.25** **A consequência prática do tipo 6, e ela não é cosmética:** o SDL recusa `HasHomeLED` para `Unknown` e `LicProController`, com o comentário *"Third party controllers don't have a home LED and will shut off if we try to set it"*. **Tentar acender DESLIGA o controle.** O `hid-nintendo`, ao contrário, registra o LED de Home e escreve nele por padrão | SDL\_hidapi\_switch.c:1277-1281 · hid-nintendo.c:975-990, :2296-2315 | código | plataforma.distinguir_clone@sn30 · luz.led_home@pro |
| clone | **9.26** **O kernel não conhece o tipo 6.** O enum tem `0x01, 0x02, 0x03, 0x09, 0x0A, 0x0B, 0x0C, 0x0D` — não há `0x06`. O driver grava o byte cru e depois só compara contra esses valores; um clone que se declare 6 cai fora de todos os `joycon_type_is_*`. O comentário ali perto já avisa: *"some NSO devices lie about themselves"* | hid-nintendo.c:314-322, :652-665, :2452-2459 (v6.12) | código | plataforma.distinguir_clone@sn30 |
| clone | **9.27** Método 2: o comando proprietário da 8BitDo. Escrever `01 66 AA 00 21 01` no hidraw repetidamente até a resposta vir no formato certo (*"sempre funciona no máximo na segunda tentativa"*). A resposta boa começa com `81 66 A5` e **os dois bytes seguintes são o PID em big-endian**. **Ressalva do autor: testou com SN30 Pro+ e Pro 2, NÃO com o SN30 Pro liso, e não declara se foi por cabo ou por rádio** | TheJayMann/8bitdo-spec, SwitchMode | doc | |
| clone | **9.28** **Trocar de modo por comando, sem combo de botão**: `01 66 AA 00 51 01` faz o controle sair do modo Switch e reconectar como aparelho 8BitDo com o mesmo VID:PID do D-input; o hidraw é fechado antes de dar tempo de ler a resposta. A volta é `81 05 00 51 04`. O mesmo texto avisa que o `hid_nintendo` **frequentemente não cria o hidraw** para 8BitDo em modo Switch — o que casa com o histórico desta casa | TheJayMann/8bitdo-spec, SwitchMode | doc | |
| fabricante | **9.29** A tabela oficial de Tech Specs do SN30 Pro lista, em Special Features: *"Hall Effect joysticks / Rumble vibration / **Motion control (for Switch only)** / Turbo function / USB-C"*. Se valer, **giroscópio e acelerômetro não existem em D-input nem em X-input** — nem por cabo nem por rádio | 8bitdo.com, página do SN30 Pro | doc | movimento.acelerometro@sn30 |
| fabricante | **9.30** Rodapé 2 da página de specs: *"The SN30 Pro features regular rumble vibration, not HD Rumble."* E o FAQ repete. **Em modo Switch o firmware aceita o envelope de HD rumble do protocolo Nintendo, mas o que existe atrás dele é um motor comum** — o FAQ o descreve como *"eccentric shaft gear motor"* | 8bitdo.com specs (rodapé 2) e FAQ | doc | |
| fabricante | **9.31** **As quatro luzinhas de baixo são indicador de MODO** — é o jeito de saber em que modo ele está, verbatim do FAQ: *"LED 1 blinking: D-input mode / LED 2 blinking: X-input mode (Xbox 360 mode) / LED 3 blinking: macOS mode / LED Rotating: Switch mode or pairing mode / Solid LED: connection is successful"*, com a nota *"It also indicates the player mode when connected to Switch"* | 8bitdo.com FAQ do SN30 Pro | doc | |
| fabricante | **9.32** Bateria 480 mAh, 18 h de jogo com 1-2 h de carga; **Bluetooth 4.0**, alcance de 10 m com melhor desempenho dentro de 5 m. **Em nenhum lugar oficial há menção a leitura de percentual de bateria pelo host** | 8bitdo.com specs e FAQ | doc | |
| modos | **9.33** O combo do modo D-input por **duas fontes independentes**: o `ebitdo.quirk` do fwupd rotula `0x6000`/`0x6001` com *"Dinput mode (Start + B)"*, e o `usb_ids.h` do SDL comenta os mesmos PIDs com *"B + START"* | fwupd ebitdo.quirk:74-82 · SDL usb\_ids.h:75-76 | código | |
| X-input | **9.34** **O `xpad` do kernel não conhece nenhum 8BitDo sem fio.** A tabela tem exatamente três, todos com fio, e nenhum é SN30 Pro. Os dois curingas por fornecedor casam por CLASSE de interface USB — **e portanto não alcançam rádio** | xpad.c:375-377, :527-528 (v6.12) | código | |
| macOS | **9.35** **Se o clone falar em modo macOS (`054c:05c4`) por rádio, o envelope TEM CRC32** — no `hid-playstation` o DualShock 4 por Bluetooth usa entrada e saída `0x11` de 78 B, ambas com CRC no fim, sementes `0xA1`/`0xA2`/`0xA3`. É o oposto do modo Switch e do modo nativo 8BitDo, que não têm nenhum | hid-playstation.c:135-138, :387-394, :794-800 | código | |
| teste | **9.36** **O SDL detecta IMU no modo Switch por MEDIÇÃO, não por identidade**: só marca `m_bHasSensorData` depois de ver algum eixo de acelerômetro diferente de zero. Um clone sem IMU manda zeros e **nunca é reconhecido como tendo sensor, sem erro e sem aviso**. É um teste que esta casa pode reproduzir sem depender de tabela de identidade nenhuma | SDL\_hidapi\_switch.c:2653-2666 | código | |
| ausência | **9.37** Busca por `audio\|speaker\|microphone\|lightbar\|adaptive\|trigger_mode` no `hid-nintendo.c` do mainline: **ZERO ocorrências**. Não há caminho no driver, em transporte nenhum, para alto-falante, microfone, jack, lightbar, gatilho adaptativo ou câmera IR | hid-nintendo.c integral (v6.12) | código | |
| LED | **9.38** `JC_SUBCMD_GET_PLAYER_LIGHTS 0x31` está **definido e não aparece em nenhum outro lugar** do arquivo. Escrever o LED de jogador dá; **ler de volta o que está aceso, não — e a diferença é do driver, não do aparelho** | hid-nintendo.c:72-74, :963-973 (v6.12) | código | luz.led_jogador@sn30 |
| limite | **9.39** **O que nenhuma pesquisa externa responde, e é honesto dizer.** Das 39 linhas `sn30` sem resposta de rádio no mapa, um bloco inteiro não é sobre o APARELHO e sim sobre ESTA bancada e ESTE produto: as dez `combinacao.*`, `plataforma.probe`, `plataforma.vpad`, `plataforma.udev_autosuspend`, `plataforma.referencias_nintendo`, `energia.bateria.jogo`, `energia.bateria.leitura_hefesto` e `entrada.combo.ponte`. **Exigem `medido` ou leitura do `src/` desta casa. Nenhum palpite devolvido** | — | incerto | |

---

## As divergências entre fontes

**Nenhuma foi resolvida aqui.** Cinquenta e oito divergências devolvidas,
agrupadas por assunto. Onde uma delas foi FECHADA por cálculo, está dito.

### D1 — O deslocamento da SAÍDA por rádio: +1 ou +2

**A divergência mais cara da rodada, e seis fontes a levantaram sozinhas.**

- **+2** (cabeçalho de 3 bytes: id, `seq_tag`, `tag`=`0x10`): `hid-playstation.c`
  (1.4), SDL (2.2), o caminho `buildBluetoothWrappedUsbOutputReport` do Senshi (6.19).
- **+1** (cabeçalho de 2 bytes): pydualsense (3.4), DS5W (4.13 e o cabeçalho de
  `IO.cpp:337-342`), dualsense-ts (6.4), construtores nativos do Senshi (6.9).

**Efeito medível:** a lightbar fica em **47/48/49** pelo kernel e **46/47/48**
pelo userspace. O azul da pydualsense cai sobre o verde do firmware e o byte 49
nunca é escrito (3.11).

**E a âncora que o enunciado do trabalho carregava estava pela metade:** *"um
offset de rádio costuma ser offset do cabo + 1 (o byte de sequência)"* vale para
a **ENTRADA** — confirmado em cinco fontes independentes — e **não vale para a
SAÍDA**. Cinco agentes devolveram essa correção separadamente.

### D2 — Tamanho do report de saída por cabo: 47, 48, 63 e 64

Quatro números, e **nenhum é erro**: 47 é o bloco comum (`static_assert`); 63 é
o report inteiro no kernel (1 + 47 + 15 reservados); 48 é o que o SDL e o DS5W
escrevem — eles **truncam** os 15; 64 é o que a pydualsense aloca. Escrever só
"47 B" para o report de cabo faz a próxima pessoa montar pacote errado.

### D3 — O byte de sequência da saída por rádio

Kernel: contador que **deve** incrementar (wrap 16), com o comentário
imperativo. SDL: grava `0x00` sempre e nunca incrementa. pydualsense, DS5W e
dualsense-ts: `0x02` literal. Senshi: incrementa (wrap 256, mas só o nibble alto
importa). **Duas implementações que funcionam, uma delas sem sequência** — ou o
"needs" do kernel é mais forte que o necessário, ou o SDL depende de algo que
ninguém mediu. Se o firmware descartar repetição de sequência, este é candidato
a *"o comando não pega"*.

### D4 — O byte `tag`

Kernel e SDL: `0x10`, com *"Tag must be set. Exact meaning is unclear."*
pydualsense: `0xFF`. DS5W: o byte nem existe. Senshi: `0x10` num caminho, ausente
no outro. **Divergência de valor E de significado.**

### D5 — A forma do cálculo do CRC — **FECHADA por cálculo**

Mesmas sementes em todas as fontes (`0xA1` entrada, `0xA2` saída, `0xA3`
feature), expressões diferentes. **Três agentes verificaram numericamente e
independentemente** que kernel, pydualsense, DS5W e dualsense-ts produzem o
**mesmo CRC-32**: 200 amostras cada, resultado idêntico (3.6, 4.6, 6.8). Um
quarto (SDL, 2.7) declarou **não** ter verificado.

**Vetor de conferência que as duas verificações produziram:** 74 bytes
`0x31, 0x02` seguidos de 72 zeros  CRC `0xF7E7A126`.

### D6 — O que ocupa os bytes 10 a 37 do bloco comum

- **SDL**: `rgucRightTriggerEffect[11]` em 10-20, `rgucLeftTriggerEffect[11]` em
  21-31, `rgucUnknown1[6]` em 32-37 — **nomeia e nunca escreve**.
- **Kernel**: `reserved2[27]` em 10-36 mais `audio_control2` em 37 — o byte 37,
  que para o kernel é funcional, cai DENTRO do `rgucUnknown1` do SDL.
- **DS5W** (4.12) e **dualshock-tools** (7.7) dão modos concretos, e **eles
  discordam entre si**: DS5W tem `0x00/0x01/0x02/0x26/0xFC` com 3 a 7
  parâmetros; dualshock-tools tem `0x00/0x01/0x02/0x06` com três parâmetros
  (`start`, `end`, `force`). **Nenhuma das quatro fontes mostra um efeito de
  gatilho sendo montado por rádio e confirmado.**

### D7 — O byte 37 (`audio_control2`): três leituras incompatíveis

dualsense-ts: bits 0-2 ganho do pré-amp do alto-falante, bit 4 beam forming, com
setter próprio. Senshi: nibble alto = suavidade do gatilho, nibble baixo =
redução do rumble. Kernel: só o nome, sem bits. **Nenhuma foi medida.**

### D8 — Nomes que divergem com offsets que batem

| byte do comum | SDL | kernel | dualshock-tools |
| --- | --- | --- | --- |
| 9 | `ucAudioMuteBits` | `power_save_control` (bit 4 = MIC_MUTE) | escreve 0, comenta *"Reserved"* |
| 41 | `ucLedAnim` (nunca escrito) | `lightbar_setup` | `LIGHTBAR_SETUP` em `valid_flag2` |
| `valid_flag0` bits 0/1 | COMPATIBLE_VIBRATION / HAPTICS_SELECT | idem | **RIGHT_VIBRATION / LEFT_VIBRATION** |
| `valid_flag1` bit 3 | RELEASE_LEDS | RELEASE_LEDS | `RESERVED_BIT_3` — e é o único bit que ela evita marcar no `0xF7` inicial, **sem dizer por quê** |
| `valid_flag1` bit 7 | — | AUDIO_CONTROL2_ENABLE | `RESERVED_BIT_7` |

O caso do byte 9 tem consequência: **o dualshock-tools está zerando um campo
funcional** — é ali que o kernel escreve o bit que muta o microfone por hardware.

### D9 — IMU do DualSense: os mesmos offsets, os nomes trocados

Bytes absolutos 17-22 e 23-28 do `0x31`. **Kernel**: giroscópio depois
acelerômetro, e aplica tabelas de calibração distintas a cada bloco (viés só no
acelerômetro). **DS5W**: acelerômetro depois giroscópio. Não escolhido — mas o
próprio DS5W marca a linha como provisória: `//TEMP: Copy gyro data (no
processing currently done!)`.

### D10 — Bateria do DualSense

- **Escala no topo**: `min(nível*10+5, 100)` no kernel, SDL e dualshock-tools
  nibble 8 = **85%**. `(nibble*100)/8` no DS5W  nibble 8 = **100%**.
- **Estado de carga**: o kernel lê o nibble ALTO do byte 54 como enum de 4 bits;
  o DS5W lê o **bit 3 do byte 55** para "carregando" e o **bit 5 do byte 56**
  para "cheia" — byte e bit que o kernel não associa a carga.
- **Código `0xf`**: dualshock-tools diz *"Battery is flat"* e devolve
  `is_charging = true`; o kernel diz *"charging error"* e devolve capacidade 0
  com status UNKNOWN. **Interpretações opostas do mesmo valor.**
- **Código `0xb`**: o dualshock-tools escreve *"not sure yet what this error
  means"*; o kernel diz "erro de temperatura" e o agrupa com `0xa`. **O driver
  sabe o que a ferramenta admite não saber** — e ela não trata `0xa` de forma
  alguma.

### D11 — Sensibilidade do giroscópio do DualSense

dualshock-tools: **14,31 LSB por °/s**, fixo, com o próprio comentário admitindo
*"nominal, uncalibrated"*. Kernel: **lê o feature `0x05` e deriva a
sensibilidade por aparelho**, normalizando para 1/1024 °/s. **Os dois números
não se convertem um no outro sem os dados de calibração do aparelho.** Quem usar
14,31 está usando um valor de fábrica, não o do controle na mesa. *(O
acelerômetro concorda: 8192 LSB/g nas duas fontes.)*

### D12 — Áudio por Bluetooth: existe ou não

- **dualsense-ts (README)**: *"Over Bluetooth, there is no audio transport."*
- **kernel**: *"Bluetooth audio is currently not supported"* — e o jack input
  device nem é criado por rádio (1.18).
- **Senshi**: o repositório inteiro é a refutação — `0x39` de 547 B com dois
  quadros Opus, `0x32` de 142 B, bit de roteamento (6.12).
- **issue 12297 da Valve**: *"all features only work when connected via USB"*.
- **código do SDL**: contradiz a versão forte disso — por rádio, em modo cheio,
  ele manda rumble, lightbar, LEDs e efeitos no mesmo `0x31`.

**Leitura possível, não medida:** a frase do README e a queixa da issue podem
falar só do caminho UAC/ALSA e da háptica de alta definição, e o Senshi do
caminho por report HID cru. **Como estão escritas, são fortes demais.**

**E o `0x39` do Senshi não é testemunha independente:** o próprio comentário de
cabeçalho dele (6.13) declara que a ordem de partida é a leitura que os autores
fizeram **de outra implementação** (uma ponte Windows). Nesta rodada, o arranjo
do `0x39` vem de **uma fonte só, que cita uma terceira**.

### D13 — Quem destrava o report `0x31` por rádio

**SDL**: ler `0x09` ou `0x20`, **ou** mandar qualquer pacote de efeitos, **ou**
simplesmente receber um `0x31`; e é irreversível sem desligar o controle.
**dualsense-ts**: o feature **`0x05`**, e o provider dele executa exatamente
isso na conexão. **Kernel**: não manda handshake nenhum — a primeira transação
por rádio é um GET_REPORT do `0x09`, e ele não afirma que isso comute nada.

As três podem ser verdadeiras ao mesmo tempo (qualquer feature read servindo), e
**nenhuma fonte diz isso**. É a pergunta aberta mais barata de medir da rodada.

### D14 — Conferência do CRC de entrada

Kernel confere e **descarta com `-EILSEQ`**. SDL confere e descarta em silêncio.
**DS5W, dualsense-ts e dualshock-tools não conferem nada.** Herdar o
comportamento dos três últimos é aceitar quadro corrompido em silêncio — o modo
de falha mais caro desta casa.

### D15 — Report `0x01` por rádio

**SDL**: trata `0x01` de 78 bytes como pacote SIMPLES (`if size == 10 || size ==
78`). **Kernel**: recusa `0x01` por rádio com `Unhandled reportID=1` e -1, e
enche o log. O DualShock4, no mesmo arquivo, TEM tratamento de modo mínimo; o
DualSense não tem.

### D16 — Tamanho do feature report por rádio

Senshi: 64 bytes **com** o report ID dentro. dualsense-ts: 64 de payload **sem**
o ID, mais o ID prefixado = 65 entregues ao node-hid. **Pode ser só a convenção
da API, mas não foi confirmado.**

### D17 — Gatilho: o modo "desligado" e o comprimento do bloco

Senshi: `CLEAR_TRIGGER` começa em **`0x05`**, e diz por quê — zerar deixa o modo
indefinido e *"on some firmware the trigger stays partially actuated"*.
dualshock-tools: OFF é `0x00`. E o bloco tem 11 bytes pelo dualsense-ts e pela
declaração do Senshi, mas as cópias do Senshi copiam 10.

### D18 — Volume do alto-falante

`0x00-0x64` (dualsense-ts, por clamp, com `0x64` = cheio) contra `0x0-0xff`
(comentário do kernel). O próprio dualsense-ts anota "faixa efetiva `0x3D-0x64`".
Senshi usa `0x7C` como padrão.

### D19 — Pro Controller: a ordem dos bytes do endereço na resposta `0x81 0x01`

O documento dekuNukem lê os bytes 4-9 **invertidos**; o remendo local desta casa
copia sem inverter, citando justamente essas notas. **Os offsets concordam; a
ordem, não.** Se o documento estiver certo, o endereço de reserva do
`usb_probe_degrade` nasce espelhado — e como ele vira o `uniq` do evdev, a
numeração por endereço passaria a chavear num valor invertido. **O caminho
normal não é afetado**: o `joycon_read_info` usa o subcmd `0x02`, onde as duas
fontes concordam.

### D20 — Pro Controller: a linha `imu_timestamp_us` no mainline

Ela **não vem de patch desta casa** (é baseline) e **existe** em v6.8 e v6.12.
Em master, **três leituras independentes do arquivo bruto**, com três perguntas
diferentes, concordaram na **ausência**. Um resumo de busca na web afirmou o
oposto — é a régua mais fraca das quatro, e estava resumindo trechos de
resultado, não o arquivo. **O agente não afirma que a linha foi removida**:
afirma que as leituras divergem e que isso precisa de um `git log -p` de verdade.

**Consequência aritmética, derivada do arquivo do disco:** por relatório de IMU,
o timestamp entregue ao userspace avança `avg_delta_ms` uma vez mais três vezes
`avg_delta_ms/3` dentro do laço — **~2× por relatório contra ~1× de tempo de
parede**. O `MSC_TIMESTAMP` do nó `(IMU)` pareceria correr ao dobro do relógio, e
a mensagem *"compensating for N dropped IMU reports"* **não compensa nada pelo
número de perdidos** (o incremento é incondicional). **Não é defeito provado —
ninguém mediu o `MSC_TIMESTAMP` de um aparelho.**

### D21 — Pro Controller: a guarda de tamanho no read handler

Cópia local: `size >= 12`. Mainline: `size >= sizeof(struct joycon_input_report)`
= **49**. **Não é cosmético**: com 12, um `0x21` truncado entra no parser e é
lido como se tivesse sticks e IMU. Não vem dos patches da casa — é diferença
entre o baseline e o mainline. **Vale conferir no rebase do DKMS.**

### D22 — Pro Controller: a taxa do `0x30` por rádio

Quatro números que não fecham, e **todos de fonte fraca**: 8 ms (comentário do
driver, chamado de *"wildcard"* pelo próprio autor); 11 ms ou 15 ms (relato do
mesmo autor no parágrafo seguinte); 120 Hz = 8,33 ms (documento externo); 15 ms
(default do código enquanto não mediu). **A diferença importa porque o limiar de
perda de IMU é derivado dessa média** (8.13).

### D23 — Pro Controller: a aposta do README do DKMS não tem fonte

O README daqui aposta que o clone *"é plausível que transmita [`0x30`] por conta
própria — é o que faz o clone funcionar sob hid-generic"*, e já se declara não
validado. **A sustentação externa foi procurada e não existe**: o documento de
Bluetooth descreve o `0x3F` como *"pushed to the host when a button is pressed
or released"* e **não afirma** que ele seja o modo padrão após conectar. A
hipótese mais natural para "funciona sob hid-generic" seria justamente o `0x3F`
— **que é o report que o `hid-nintendo` não lê**.

### D24 — 8BitDo: movimento

**SDL implementa** giroscópio e acelerômetro para o SN30 Pro no modo nativo,
**inclusive por Bluetooth** (report `0x01`, bytes 15-26, 4096 LSB/g, ±2000 °/s),
condicionado só a o feature `0x06` responder — que o commit amarra a firmware ≥
v2.05. **A 8BitDo escreve, na tabela oficial: *"Motion control (for Switch
only)"*.** As duas não podem estar certas.

**Custo de resolver: um comando.** Ler o feature `0x06` do `2DC8:6101` e ver se
responde; depois olhar se os bytes 15-26 mexem quando o controle mexe.

### D25 — 8BitDo: os PIDs do modo D-input

A documentação desta casa afirma que `2DC8:6001` e `2DC8:6002` são o par do modo
D-input. **As duas fontes externas separam esses PIDs por MODELO, não por
transporte**: o `ebitdo.quirk` rotula `0x6000`/`0x6001` como SF30 Pro/SN30 Pro e
`0x6002` como **SN30 Pro+**; e o `usb_ids.h` diz que o par de rádio do SN30 Pro é
**`0x6101`**. Isto contradiz uma linha escrita — **relatado, não aplicado**.

### D26 — 8BitDo: três modos ou quatro

A página de specs lista TRÊS em "Controller Mode" (Switch, X-input, D-input). O
FAQ do MESMO produto, na explicação das luzinhas, lista QUATRO — *"LED 3
blinking: macOS mode"*. **As duas páginas são da 8BitDo e discordam**, e esta
casa depende do modo macOS nas medições de 11/08.

### D27 — 8BitDo: degraus de bateria no modo Switch

Kernel: `bat_con >> 5`, **cinco** degraus nomeados. SDL: `(byte & 0xE0) >> 4`,
com o comentário *"reported from 0(empty)-8(full)"*. **Aritmeticamente o valor
do SDL é o dobro, e os dois leem os mesmos três bits** — quem copiar o
comentário do SDL escreverá "oito degraus" onde o aparelho tem cinco.

### D28 — 8BitDo: rumble em X-input por rádio, e o modelo

O kernel tem o caminho **só para o SN30 Pro Plus**. Para o liso, o autor do
patch escreveu que "provavelmente também precisa, mas não tenho o hardware". Se
o controle desta bancada for o liso, **a linha honesta é `incerto`, não `sim`**.
E a página oficial lida hoje é a do SN30 Pro ATUAL, com joysticks Hall e
compatibilidade Switch 2 — **todo achado de fabricante pode não valer para uma
unidade de 2018**. Os achados de código não dependem do ano: dependem do VID:PID
e do firmware.

### D29 — Steam: o que o código público NÃO prova

**SDL não é o cliente Steam.** Tudo o que foi devolvido sobre "como o Steam
distingue transporte" e "o que ele faz por rádio" foi lido no driver PS5 do SDL,
que é o mais próximo que existe — **mas o cliente Steam é fechado**. Para
afirmar isto como comportamento DO STEAM, o grau cai para `afirmado-no-doc`, ou
alguém põe o aparelho na mesa.

### D30 — Steam: o comentário da nossa própria regra udev está desatualizado

A regra desta casa afirma que, sem a nossa linha, o acesso do jogo ao hidraw do
vpad *"dependia do pacote steam-devices (terceiro)"* — e o mesmo teste repete a
afirmação. **No steam-devices instalado nesta máquina não existe uma única linha
`0DF2`** (5.4). Na bancada dela, portanto, **nunca dependeu**.

### D31 — Erro interno do dualshock-tools, e vale como alerta a quem copiar de lá

O comentário de `LED_BRIGHTNESS = 0x20` diz *"Bit 6"* (`0x20` é o bit 5), e o de
`LIGHTBAR_SETUP = 0x40` **também** diz *"Bit 6"*. Os VALORES estão coerentes; os
comentários é que estão errados. **Copiar o comentário em vez do valor produz um
bit trocado.**

---

## O que NÃO virou célula — a lista de trabalho

**191 dos 215 achados.** Agrupados pelo que destravam, com o achado que os
sustenta entre parênteses.

**1. O envelope de saída do DualSense por rádio.** O mapa não tem uma linha
sobre ele. Estão lidos e sem dono: os offsets absolutos campo a campo (1.5, 2.5),
o `seq_tag` e o `tag` `0x10` (1.12), o CRC de saída com semente `0xA2` e o vetor
de conferência `0xF7E7A126` (1.9, 4.6, 6.8), os 24 bytes reservados que ninguém
escreve (1.4), e o CRC **diferente** dos feature reports, semeado com `0x53`
(6.11). **É o bloco de conhecimento mais completo da rodada, e o mais órfão.**

**2. Gatilho adaptativo por rádio.** Três fontes com layout — DS5W (4.12),
dualshock-tools (7.7), dualsense-ts/Senshi (6.5, 6.16, 6.17) — que **discordam
entre si** e que o kernel não confirma (1.19). Mais o detalhe que só uma fonte
tem: **o modo "desligado" é `0x05`, e `0x00` pode deixar o gatilho preso pela
metade** (6.16). E os dois bytes de retorno de força **na entrada** (4.4).

**3. Áudio por rádio.** O `0x39` de 547 B com dois quadros Opus e o `0x32` de
142 B (6.12), a ordem de partida (6.13), os comandos de fabricante `0x80 [6,*]`
para tom de teste (7.22), as faixas de volume (1.20, 6.18, 7.25), o jack em
`status[1]` que só o driver lê (7.24), e o fato de o kernel **nem criar o input
device de jack por rádio** (1.18).

**4. O modo aprimorado, e a disputa com o Steam Input.** Como se destrava (2.14,
6.3, D13), que é **bilhete só de ida** (2.14, 5.11), o tique de 500 ms sem CRC
(2.21), a lightbar **retida até o timestamp alcançar 10.200.000** (2.22), e o
SDL derrubando o rádio quando o cabo aparece (2.23, 5.13). **Nada disso está no
mapa, e é o que decide quem fala com o controle primeiro.**

**5. Calibração e comandos de fabricante do DualSense.** O feature `0x05` campo
a campo (7.12), os comandos `0x82`/`0x83` de centro e alcance com as respostas
esperadas (7.13, 7.14), o NVS com a chave literal (7.15), o finetune de 12 u16
(7.16), o catálogo `0x80 [base,num]` (7.18), a tabela `hwinfo`->BDM (7.19) e o
segundo caminho para o endereço de rádio (7.17).

**6. Detecção de terceiros e capacidades.** O feature `0x03` do SDL, com o
`data[2]==0x28`, os bits de capacidade e o pacote alternativo de timestamp de 16
bits (2.27). **Para Sony o SDL assume tudo sem consultar.**

**7. 8BitDo em modo nativo por rádio.** O report `0x01` byte a byte (9.7), os
sticks de 8 bits (9.8), os gatilhos que são digitais no firmware antigo (9.9), a
bateria em percentual (9.10), o IMU com rotação de eixos (9.11), a taxa de 70 Hz
com *"possibly lossy"* (9.12), o rumble `0x05` (9.15), a recusa explícita de LED
(9.17) — **e o interruptor único: o feature `0x06` decide sozinho se há sensor,
rumble e bateria** (9.13). Mais os dois métodos de troca de modo por comando
(9.27, 9.28) e o teste de IMU por medição que esta casa pode reproduzir hoje
(9.36).

**8. Pro Controller.** NFC/MCU inteiro declarado e nunca emitido (8.8), o rumble
HD que existe no encoder e está inacessível de fora (8.15), o handshake USB
duplo e o porquê (8.3, 8.4), os **quatro** pisos da contagem de perda de IMU
(8.13), a ausência total de sniff nas duas fontes (8.16), e o que o Pro publica
no evdev — inclusive o `bustype` que muda com o transporte enquanto o vpad nasce
sempre `BUS_USB` (8.18).

**9. Steam e udev.** O curinga que casa qualquer barramento e alcançaria o nosso
vpad (5.3), o steam-devices instalado sem `0DF2` (5.4), a ausência de qualquer
regra para `/dev/uhid` (5.5), e o sintoma dos "botões girados" cuja FORMA é a de
um deslocamento de um byte (5.16 — **hipótese, não repassar como fato**).

**10. O que fonte externa nenhuma pode responder.** As dez linhas
`combinacao.*`, `plataforma.probe`, `plataforma.vpad`,
`plataforma.udev_autosuspend`, `plataforma.referencias_nintendo`,
`energia.bateria.jogo`, `energia.bateria.leitura_hefesto` e
`entrada.combo.ponte` (9.39). **Exigem a bancada ou o `src/` desta casa. Nenhum
palpite foi devolvido para elas, e isso é o comportamento certo.**
