# As nove fontes da rodada 3 — os dossiês inteiros

31/08/2026. Nove fontes inéditas, lidas no fonte por nove agentes, uma fonte por
agente. Cada um devolveu **tudo** o que viu; só o que casava com as 30 lacunas
pedidas virou proposta, e só 16 propostas viraram célula no
`docs/data/mapa-controles.csv`. **Este documento é onde o resto passa a existir.**

| | |
| --- | --- |
| Fontes | 9 |
| Achados | **200** |
| Divergências declaradas pelos próprios agentes | 48 |
| Achados que viraram célula | 15 (duas células são NO-OP: o valor já estava na árvore) |
| Achados que **não** viraram nada | o resto — a lista de trabalho de quem vier |

**Como ler.** Cada achado tem endereço (arquivo:linha ou URL) e o grau que o
agente declarou. Onde não há marca, o grau é `inferido-do-codigo` — o agente leu
o código que faz a coisa. `[doc]` = `afirmado-no-doc`, é palavra de alguém.
`[incerto]` = o próprio agente marcou como não resolvido. Onde um achado
alimentou uma célula, está escrito **-> célula `id`/`coluna`**.

**Aviso de procedência que vale para tudo aqui:** nada nesta rodada é medição de
bancada. É leitura de fonte. Três fontes (RPCS3, hid-tools, OpenRGB) descrevem o
DualSense sem nunca escreverem nos campos que nomeiam — o nome é afirmação do
autor da `struct`, não comportamento exercitado.

## O índice, e o que cada fonte rendeu

| # | Fonte | Achados | Células |
| --- | --- | --- | --- |
| 1 | awalol/DS5Dongle (firmware de dongle RP2350) | 27 | 1 |
| 2 | yuzu, pelo fork vivo Eden (+ Ryujinx, descartado) | 23 | 2 |
| 3 | Dolphin + Cemu | 14 | **0** |
| 4 | RPCS3, handler nativo do DualSense | 31 | **0** |
| 5 | OpenRGB | 15 | **0** |
| 6 | linux-input (LKML), por espelho marc.info | 24 | 3 |
| 7 | hid-tools + Godot + game-devices-udev | 24 | 2 |
| 8 | BlueZ + HIDP + L2CAP + Wireshark + l2cap_proxy | 25 | 1 |
| 9 | 8BitDo a fundo (8bitdo-spec, fwupd, xpadneo, issues) | 17 | 1 |

Três fontes renderam **zero células** e mesmo assim são as mais densas do lote —
RPCS3 sozinho trouxe 31 achados. Isso não é fracasso de fonte: é o recorte das
30 lacunas sendo estreito. O que elas trouxeram está abaixo.

---

## 1. awalol/DS5Dongle — o firmware que um DualSense real aceita

**O que é.** Firmware C++ de um dongle RP2350/Pico2W que fala L2CAP/HID direto com
o DualSense e o serve ao host como aparelho USB. Branch `master` (o repo **não**
tem `main`). Lidos byte a byte: `src/utils.h` (423 l.), `src/audio.cpp` (526 l.),
`src/bt.cpp` (924 l.), `src/main.cpp` (382 l.), `src/battery_led.cpp`,
`src/wake.cpp`, `src/ps_shortcut.cpp`, `src/dse.cpp/.h`, `src/config.h`,
`tools/wireshark_dualsense_setstate.lua`, `README.md`.

**Por que ela pesa mais que as outras oito:** é o único código do lote que roda
num aparelho físico conversando com um DualSense real. Todo o resto é host lendo
o controle; este é um par falando com ele.

### Envelope e deslocamento

- **Saída 0x31 por rádio: o deslocamento é +2, e o mapa é completo.**
  `outputData[0]=0x31; outputData[1]=reportSeqCounter<<4; outputData[2]=0x10;` e
  então `memcpy(outputData+3, &state, sizeof(SetStateData))`. Layout inteiro:
  `[0]`=0x31, `[1]`=seq<<4, `[2]`=0x10, `[3..65]`=SetStateData (63 B),
  `[66..73]`=zeros, `[74..77]`=CRC32 LE. Total 78. Offsets derivados: flag0->[3],
  flag1->[4], VolumeHeadphones->[7], VolumeSpeaker->[8], VolumeMic->[9],
  AudioControl->[10], MuteLightMode->[11], MuteControl->[12],
  RightTriggerFFB->[13..23], LeftTriggerFFB->[24..34], HostTimestamp->[35..38],
  MotorPowerLevel->[39], SpeakerCompPreGain->[40], HapticLowPassFilter->[42],
  LightFadeAnimation->[44], LightBrightness->[45], PlayerIndicators->[46],
  Led R/G/B->[47],[48],[49]. — `main.cpp:243-273`, `utils.h:293-416`
- **Entrada 0x31 por rádio: +1, provado por `memcpy` explícito.**
  `memcpy(interrupt_in_data, data+3, 63)`, com `data[0]`=0xA1 e `data[1]`=report
  id. Confirmação independente no mesmo repo: `bt.cpp:656-662` lê `packet[3..6]`
  como os quatro eixos (repouso 120..140), `[7]`/`[8]` como gatilhos, `[10]` como
  D-pad+faces (repouso 0x08), `[11]`/`[12]` como botões. — `main.cpp:135,149`
- **O byte `report[1]` da ENTRADA não é só sequência — tem dois bits com dono.**
  Bit 0 = "traz estado HID" (`bt.cpp:653`: `if (!(packet[2] & 1) …) return;`);
  bit 1 = "traz áudio de microfone" (`main.cpp:99`: `if ((data[2]>>1)&1)`,
  despacha e retorna sem tocar no estado). O **mesmo** report id 0x31 carrega dois
  enquadramentos por rádio. — `main.cpp:96-103`, `bt.cpp:653`
- **Um contador de sequência de 4 bits, compartilhado entre TODOS os reports de
  saída.** `reportSeqCounter` é `extern` e incrementa igual nos três caminhos
  (0x31, 0x32, 0x39): `pkt[1] = seq<<4; seq = (seq+1) & 0x0F;`. O 0x39 tem um
  SEGUNDO contador independente: `pkt[9] = packetCounter += 2` (passo 2 porque
  cada report leva dois quadros). — `audio.cpp:44-45,94-95,120-121,135`;
  `main.cpp:245-246`
- **Estado neutro canônico de 63 bytes, literal.** O mesmo vetor aparece como
  `interrupt_in_data[63]` e dentro de `state_init_data[66]` precedido de
  `0xa2,0x31,0x01`, injetado no INTERRUPT quando o Bluetooth cai. Começa
  `7f 7d 7f 7e 00 00 a7 08 00 00 00`. É tabela de verdade: valida offset por
  offset a leitura do common em repouso. — `main.cpp:42-53`, `bt.cpp:83-93,626`

### A gramática TLV do rádio — o achado estrutural desta fonte

- **O 0x39 (547 B) é uma CADEIA TLV, não uma tabela de offsets fixos.** Cada
  bloco é precedido de {tag, comprimento}. Montagem literal: `pkt[0]=0x39`,
  `pkt[1]=seq<<4`, `pkt[2]=0x91` (=`0x11|1<<7`, controle de áudio), `pkt[3]=6`
  (comprimento), `pkt[4]`=máscara (0b01111111 mic ligado / 0b01111110),
  `pkt[5..8]`=audio_buffer_length, `pkt[9]`=packetCounter, `pkt[10]=0xD2`
  (`0x12|1<<6|1<<7`, haptics), `pkt[11]=64`, `pkt[12..75]` e `[76..139]` = dois
  quadros de haptics de 64 B, `pkt[140]`=0xD6 ou 0xD3 (alto-falante),
  `pkt[141]=200`, `[142..341]` e `[342..541]` = dois quadros opus de 200 B, CRC32
  em `[543..546]`. **O nibble baixo da tag é o TIPO:** `0x10`=SetState,
  `0x11`=controle de áudio/mic, `0x12`=haptics PCM, `0x13`=alto-falante interno,
  `0x16`=fone no jack. — `audio.cpp:118-173` (constantes em `:28-38`)
- **O comprimento do bloco de controle é VARIÁVEL — e é isso que gera a
  "divergência" de offsets.** Comentário do autor, em chinês, sobre o `pkt[4]`:
  «o bit 6 é obrigatório; a cada bit A MAIS zerado é preciso decrementar `pkt[3]`
  em 1 e encurtar os dados seguintes em um byte; medindo, dá para ficar só com um
  `buf_len` + `packetCounter`». **Não há offset "certo" a desempatar no 0x39:**
  quem for reproduzir tem de LER a cadeia, não indexar posição fixa. —
  `audio.cpp:124-129`
- **O 0x32 (142 B) é um SEGUNDO portador de SetStateData, com o mesmo cabeçalho
  TLV.** `pkt[0]=0x32; pkt[1]=0x10; pkt[2]=0x90; pkt[3]=0x3f; memcpy(pkt+4,
  &state, 63)` — `[2]`=tag 0x10|bit7, `[3]`=63=comprimento. Logo no 0x32
  common[N] cai em `report[4+N]`: LedRGB->[48],[49],[50]; PlayerIndicators->[47];
  SpeakerCompPreGain->[41]. É por aqui que o dongle acende a lightbar na conexão.
  — `bt.cpp:916-924`, uso em `:779-792` e `main.cpp:108-113`
- **O 0x32 também liga/desliga o streaming do microfone.** `update_mic_status()`:
  mesmo TLV, bloco de tag `0x11` e comprimento 1, `pkt[4] = mic ? 0b011 : 0b010`.
  Comentário na reconexão: «o controle que reconecta enquanto o host ainda segura
  a interface de mic aberta **nunca é avisado a transmitir, e o mic fica mudo**» —
  é preciso remandar o 0x32. — `audio.cpp:91-100`; comentário em `bt.cpp:756-761`
- **NEGATIVO com valor: o dongle NÃO usa 0x33 a 0x38.** Varredura dos quatro
  arquivos de protocolo: os únicos reports de saída emitidos são **0x31 (78 B),
  0x32 (142 B) e 0x39 (547 B)**. Um dongle completo — áudio, haptics, mic,
  alto-falante — precisa de exatamente três. Isso enfraquece qualquer leitura da
  "escada" como oito degraus obrigatórios. — varredura de `src/`; as únicas
  atribuições de report id de saída são `bt.cpp:918`, `audio.cpp:33,93`,
  `main.cpp:244`

### Áudio por rádio

- **Microfone: entra no 0x31, opus, 71 bytes por quadro.** Com o bit 1 do byte de
  flags ligado, o quadro começa em `data+4` (= `report[3]`);
  `mic_add_queue(data+4, len-4)`; `#define MIC_OPUS_SIZE 71`; decodifica com
  OpusDecoder mono 48000 Hz, `MIC_FRAMES 480` (10 ms). — `main.cpp:99-102`,
  `audio.cpp:36-38,486,517-526`
- **Haptics VCM: int8 estéreo entrelaçado a 3000 Hz, 64 B por bloco.**
  `resampler.SetRates(48000, 3000)`, cada amostra vira int8 com `clamp(-128,127)`
  alternando esquerda/direita em `int8_t haptic_buf[64]` = 32 quadros × 2 canais.
  **Como o autor descobriu a taxa** (comentário): varredura de frequência, o
  padrão sobe-e-desce se repete em bandas de 3 kHz — logo 3000 Hz e sem filtro
  passa-baixas. — `audio.cpp:318-344,347-358`
- **A ponte cabo->rádio dos haptics: canais 3-4 do sink ALSA viram o bloco tag
  0x12.** `#define INPUT_CHANNELS 4`; `raw[i*4]` e `raw[i*4+1]` vão ao
  ALTO-FALANTE, `raw[i*4+2]` e `raw[i*4+3]` vão aos HAPTICS. Amarra o registro de
  cabo que a casa já tinha ao bloco TLV do rádio. — `audio.cpp:295-316`
- **A ROTA da saída de áudio é a tag: 0x13 interno vs 0x16 no jack.**
  `pkt[140] = ((speaker_select==2 || (speaker_select==0 && plug_headset)) ? 0x16 :
  0x13) | 1<<6 | 1<<7;`. `plug_headset` vem de `set_headset(data[56] & 1)` = bit 0
  de common[53]. O áudio é opus estéreo 48000 Hz, 10 ms, **CBR 160 kbps**
  (`OPUS_SET_BITRATE(200*8*100)`), complexidade 0, 200 B/quadro, com resample
  51200->48000 antes «para resolver o problema de ruído». — `audio.cpp:151-157`,
  `:473-485`, `:400-410`; `main.cpp:105-107`
- **[doc] O bug de mudo que o autor mediu no CABO e desistiu de contornar.** Bloco
  comentado: se o mudo do alto-falante está ligado e então se aperta o mudo do
  microfone, o do alto-falante se solta; **medido, o DS5 no cabo tem o mesmo
  defeito**; e medido também que no cabo, fora do jogo, o liga-desliga de mudo não
  é suportado. — `main.cpp:115-124`

### CRC — as duas sementes, e uma delas validada contra o aparelho

- **CRC32 de SAÍDA: semente `0xEADA2D49`, e ela É `crc32(0xA2)`.** Verificado
  numericamente: `zlib.crc32(b'\xa2') = 0xeada2d49`, exato.
  `fill_output_report_checksum` calcula sobre `len-4` e grava nos quatro últimos
  em LE; `bt_write` prega o `0xA2`. — `utils.h:116-137`, `bt.cpp:846-861`
- **CRC32 de ESCRITA DE FEATURE: semente `0x2060EFC3` = `crc32(0x53)`, NÃO 0xA3.**
  `set_feature_data` monta `{0x53, reportId, dados}` e assina sobre isso. As
  outras duas transações aparecem separadas: LEITURA pede `{0x43, reportId}` (dois
  bytes, sem CRC) e a RESPOSTA chega com `0xA3`. **Três bytes de transação
  distintos, contextos de CRC distintos.** — `utils.h:139-150`, `bt.cpp:892-906`,
  leitura `:882-883`, resposta `:671-673`
- **[doc] A semente 0x53 foi validada contra o APARELHO.** Comentário no caminho
  do DualSense Edge: «SET 0x80 {0x70,0x01,…}: profile unlock. **Must carry a valid
  CRC32 trailer or the controller rejects it with HANDSHAKE 0x04
  (ERR_INVALID_PARAMETER).**» E o parser confirma o canal de retorno: HANDSHAKE de
  1 byte, `0x00`=SUCCESS, `0x04`=ERR_INVALID_PARAMETER. Contraste deliberado no
  mesmo arquivo: o SET 0x65 anterior sai VERBATIM, «native sends 63 bytes, no CRC
  recompute» — **nem toda escrita de feature leva CRC recalculado.** —
  `dse.cpp:54-78,80-87`

### Entrada — campos com consumidor vivo

- **Bateria: common[52] = report[54].** `b & 0x0F` = nível (×10 = percentual),
  `(b>>4) & 0x0F` = estado; `POWER_STATE_DISCHARGING = 0x0`. Não é comentário de
  struct: é um consumidor que pisca o LED do dongle, com invalidação por report
  obsoleto de 2 s. — `battery_led.cpp:66-69` (constantes `:17-20`)
- **Gatilhos: common[4] e common[5], com consumidor vivo** — a lacuna registrava
  "nenhum consumidor". A detecção de silêncio testa `packet[7] > 0 || packet[8] >
  0`. A struct documenta ainda o RETORNO de estado do gatilho adaptativo:
  common[41] nibble baixo = `TriggerRightStopLocation` (0..9), nibble alto =
  `TriggerRightStatus`; common[42] idem para o esquerdo; common[47] nibbles =
  `TriggerRight/LeftEffect` (0 reset, 1 feedback, 2 arma, 3 vibração).
  **-> célula `gatilho.leitura@dualsense`/`radio_offset` e `radio_evidencia`** (a
  célula cita `utils.h:225-234`; o consumidor de silêncio não entrou). —
  `bt.cpp:656-662`, `utils.h:190-191,225-240`
- **Botões: common[7], [8], [9] — e PS é o bit 0 de common[9].** Comentário
  explícito: «byte 7 low nibble D-pad (0x08 idle), high nibble faces / byte 8 L1,
  R1, L2 click, R2 click, share, options, L3, R3 / byte 9 PS (bit 0),
  touchpad-click (bit 1), mute (bit 2)». Segundo consumidor independente:
  `bool raw_ps = (data[9] & 0x01) != 0;`. — `wake.cpp:188-191,208-210`,
  `ps_shortcut.cpp:35`
- **Fone plugado e mudo do mic: common[53], bits 0 e 2.** `data[56]` e
  `interrupt_in_data[53]` são o MESMO byte pelos dois lados do `memcpy(+3)` — o
  que fecha a aritmética. Bits nomeados: 0 PluggedHeadphones, 1 PluggedMic, 2
  MicMuted, 3 PluggedUsbData, 4 PluggedUsbPower, 5 UsbPowerOnBT. E common[54] bit
  1 = HapticLowPassFilter. — `main.cpp:105-113`, `utils.h:244-254`

### Saída — campos acionados de verdade

- **Pré-amplificador do alto-falante: common[37] bits 0-2, faixa 0..7**, guardado
  pelo bit 7 do flag1 (`AllowAudioControl2`). O dongle aciona de fato:
  `if (config.speaker_gain > 0) { state.AllowAudioControl2 = 1;
  state.SpeakerCompPreGain = config.speaker_gain; }`. Por rádio no 0x31 ->
  `report[40]`; no 0x32 -> `report[41]`. — `main.cpp:256-259`, `utils.h:321,367`,
  `config.h:15`
- **Redução de potência do motor do gatilho, acionada por rádio.** common[36]:
  nibble baixo `RumbleMotorPowerReduction` (0x0-0x7, reduções de 12,5%), nibble
  alto `TriggerMotorPowerReduction` (0x0-0xA); flag guardiã = bit 6 do flag1. Por
  rádio: `report[39]` no 0x31, `report[40]` no 0x32. — `main.cpp:252-255`,
  `utils.h:320,363-364`, `config.h:26`
- **Lightbar e LEDs de jogador: dois report ids possíveis, ambos exercitados.** Na
  conexão o dongle acende pelo **0x32** (LedRGB em `report[48..50]`); na passagem
  do host, os mesmos campos saem no **0x31** (`report[47..49]`). LEDs de jogador
  (common[43]) -> `report[46]` no 0x31, `report[47]` no 0x32, guardados pelo bit 4
  do flag1. A struct registra a diferença de geração: «Generation 0x03 Full
  Functionality / 0x04 Mirrored Only; detecção sugerida
  `(HardwareInfo & 0x00FFFF00) == 0x00000400`», com o mapa do PS5 (0x04 P1, 0x06
  P2, 0x15 P3, 0x1B P4, 0x1F P5 não confirmado). — `bt.cpp:779-792`,
  `utils.h:386-413`

### Ressalvas da própria fonte

- **O dissector Wireshark do repo cobre só o CABO.** `if data(0,1):uint() ~= 0x02
  then return end`, `local s = data(1,47)`. Não reconhece 0x31/0x32/0x39 — foi
  procurado como terceiro testemunho para o rádio e não serve. —
  `tools/wireshark_dualsense_setstate.lua:280-304,201-202`
- **[doc] O README afirma alcance, sem número.** «Supports HD haptics», «Headset
  audio output — controller speaker and 3.5 mm jack», «Headset microphone input»,
  e «the firmware runs the full audio path … at the stock 150 MHz clock — no
  overclock». Também: «**Pico W only has haptics support, no speaker**» — a
  variante de rádio mais fraca perde o alto-falante, não os haptics. —
  `README.md:17-19,147,184-186`

**O que sobrou desta fonte (nada disto virou célula):** a gramática TLV inteira, o
mapa completo da saída 0x31 e do 0x32, as duas sementes de CRC, o microfone opus,
os haptics a 3000 Hz, a rota 0x13/0x16, e o negativo dos 0x33-0x38.

---

## 2. yuzu, pelo fork vivo Eden — o protocolo Joy-Con/Pro por dentro

**O que é.** O código do protocolo Joy-Con/Pro do yuzu, servido pelo fork Eden
(`git.eden-emu.dev/eden-emu/eden`, `master`) porque o upstream está morto
(`raw.githubusercontent` do yuzu-emu caiu; `git.computernewb.com` bloqueia;
`git.suyu.dev` e `gitlab.hugofnm.fr` recusaram). Os arquivos ainda carregam
«Copyright 2022 yuzu Emulator Project». Lidos na íntegra: `joycon_types.h`,
`common_protocol.cpp/.h`, `calibration.cpp`, `generic_functions.cpp`, `poller.cpp`,
`rumble.cpp`, `joycon_driver.cpp`, `drivers/joycon.cpp`.

- **Ryujinx não serve de fonte, e isso é resposta.** `src/Ryujinx.Input.SDL2/` tem
  cinco arquivos e nenhum parser de report; delega 100% ao SDL2. A premissa
  «emuladores têm o mapa de reports melhor documentado que o kernel» é verdadeira
  para o yuzu e **falsa para o Ryujinx**. — API Gitea de `mirrors/Ryujinx`

### Reports de entrada

- **Layout do 0x30 (STANDARD_FULL), com o report ID DENTRO da struct.**
  `static_assert` de 41 bytes, `#pragma pack(1)`: `0` report_mode (0x30), `1`
  packet_id, `2` battery_status, `3..5` button_input[3], `6..8` left_stick,
  `9..11` right_stick, `12` vibration_code, `13..36` motion_input (12 × s16),
  `37..38` padding, `39..40` ring_input (s16). **O offset é o mesmo por cabo e por
  rádio — não há variante deslocada em lugar nenhum do arquivo.** —
  `joycon_types.h:526-538`
- **O yuzu lê só 1 dos 3 quadros de IMU, e admite.** `motion_input` é 12 s16 (24
  B), não 18 s16 (36 B); `GetMotionInput` usa os índices 0..5 e termina com
  `// TODO(German77): Return all three samples data`. Quem copiar esta struct
  herda um modelo TRUNCADO e perde 2/3 da taxa de IMU.
  **-> célula `movimento.giroscopio@sn30`/`radio_evidencia`** (entrou como segunda
  fonte do "o layout não muda com o transporte", com a truncagem declarada). —
  `joycon_types.h:534`, `poller.cpp:345-375`
- **Ordem dos eixos da IMU: X e Y vêm TROCADOS.** `raw_accel_x = motion_input[1]`,
  `raw_accel_y = motion_input[0]`, z=[2]; gyro x=[4], y=[3], z=[5] — o quadro no
  fio é (Y, X, Z). A calibração usa o índice cruzado também. Para o Pro, depois
  ainda se inverte o sinal de gyro_x, accel_y e accel_z. — `poller.cpp:355-371`,
  `:206-213`
- **Bitmap de botões do 0x30, e a remontagem DIFERE por controle.** `PadButton` é
  u32: Down 0x000001, Up 0x000002, Right 0x000004, Left 0x000008, LeftSR 0x10,
  LeftSL 0x20, L 0x40, ZL 0x80, Y 0x100, X 0x200, B 0x400, A 0x800, RightSR
  0x1000, RightSL 0x2000, R 0x4000, ZR 0x8000, Minus 0x10000, Plus 0x20000,
  StickR 0x40000, StickL 0x80000, Home 0x100000, Capture 0x200000. Pro:
  `b[2] | (b[0]<<8) | (b[1]<<16)`; Joy-Con esq.: `b[2] | ((b[1] & 0b00101001)<<16)`;
  dir.: `(b[0]<<8) | (b[1]<<16)`. — `joycon_types.h:61-84`, `poller.cpp:106,142,180`
- **Report 0x3F (SIMPLE_HID): 14 bytes, e o Pro empacota DOIS chapéus num byte
  só.** `InputReportPassive`: `0` report_mode, `1..2` button_input (u16), `3`
  stick_state, `4..13` unknown. O bitmap do modo simples é OUTRO (`PassivePadButton`):
  Down_A 0x0001, Right_X 0x0002, Left_B 0x0004, Up_Y 0x0008, SL 0x0010, SR 0x0020,
  Minus 0x0100, Plus 0x0200, StickL 0x0400, StickR 0x0800, Home 0x1000, Capture
  0x2000, L_R 0x4000, ZL_ZR 0x8000. Joy-Con solto: `stick_state` é chapéu 0..8
  (Right=0, horário, Neutral=8). **Pro: o yuzu lê `(s & 0xF)` como analógico
  esquerdo e `(s >> 4)` como direito** — ver divergências. —
  `joycon_types.h:86-113,518-524`, `poller.cpp:216-279`
- **Byte de bateria do 0x30: um nibble, cinco níveis e um bit de carga.** Offset 2:
  `[0..3]` desconhecido, `[4]` carregando, `[5..7]` status (0 vazio, 1 crítico, 2
  baixo, 3 médio, ≥4 cheio); o bit de carga tem prioridade. **Não existe leitura de
  alta resolução:** `GetBattery` é stub que devolve 0 e `NotSupported`, e
  `GET_REGULATED_VOLTAGE = 0x50` nunca é chamado. — `joycon_types.h:486-494,157`,
  `generic_functions.cpp:71-75`
- **O Ring-Con sai de DENTRO do report 0x30, offsets 39..40** — dentro da faixa que
  o terceiro quadro de IMU ocuparia (13+36 = 49 é o tamanho cheio do 0x30). Entra
  por hidbus: `SET_EXTERNAL_CONFIG 0x58`, `GET_EXTERNAL_DEVICE_INFO 0x59`,
  `ENABLE_EXTERNAL_POLLING 0x5A`, `DISABLE 0x5B`, `SET_EXTERNAL_FORMAT_CONFIG
  0x5C`; `RingController=0x2000`, `Starlink=0x2800`. —
  `joycon_types.h:526-538,158-162,403-406`, `poller.cpp:84-95`

### Analógicos, calibração e IMU

- **Empacotamento de 12 bits:** `X = s[0] | ((s[1] & 0xF) << 8)`;
  `Y = (s[1] >> 4) | (s[2] << 4)`. Mesma desempacotagem nos blocos de calibração
  SPI. Normalização `(raw-center)/max` ou `/min`. Defaults quando a calibração vem
  vazia: **centro 0x800, curso 0x6cc**. — `poller.cpp:114-117,188-195,281-287`,
  `calibration.cpp:168-187`
- **Calibração da IMU: endereços SPI e o fallback de fábrica.** Magic
  `USER_IMU_MAGIC 0x8026`; se for `0xB2 0xA1`, usa a do USUÁRIO em
  `USER_IMU_DATA 0x8028`, senão `FACT_IMU_DATA 0x6020`. `ImuSpiCalibration` = 24 B:
  accel_offset[3], accel_scale[3], gyro_offset[3], gyro_scale[3], todos s16. Se um
  valor vier 0 ou 0xFFF: escala do acelerômetro 0x4000, escala do giro 0x3be7,
  offset 0. — `joycon_types.h:176-201,465-471`, `calibration.cpp:92-134,156-202`
- **Fórmula de conversão da IMU, com as quatro escalas.** Giro:
  `(raw - offset) * (936.0f / (scale - offset)) / 360.0f` — resultado em **VOLTAS
  por segundo**, depois dividido por 8/4/2/1 (DPS250/500/1000/2000). Acelerômetro:
  `raw * (1.0f/(scale-offset)) * 4`, depois /4, /2, /1 ou ×2 (G2/G4/G8/G16). **O
  acelerômetro NÃO subtrai o offset** — ver divergências. — `poller.cpp:313-343`
- **Carga do subcomando 0x41 (sensibilidade/taxa da IMU), na ordem exata:**
  `{sensibilidade do giro, sensibilidade do acel., desempenho do giro, desempenho
  do acel.}` — as duas SENSIBILIDADES vêm juntas primeiro. Valores: giro
  DPS250=0, DPS500=1, DPS1000=2, DPS2000=3; acel. G8=0, G4=1, G2=2, G16=3; giro
  HZ833=0, HZ208=1; acel. HZ200=0, HZ100=1. O driver escolhe DPS2000+HZ833+G8+HZ100.
  — `generic_functions.cpp:61-69`, `joycon_types.h:216-238`
- **Leitura de SPI:** `SPI_FLASH_READ = 0x10` com 5 bytes (endereço u16, 2 de
  enchimento, 1 de tamanho). Resposta `SubCommandResponse` de 64 B = 14 B de
  `InputReportPassive` + 1 de subcomando + 48 de dados + 1 de CRC («// This is
  never used»); dados úteis começam após 5 bytes de cabeçalho. Reenvia até 5 vezes
  se o endereço não bater; timeout 66 ms, 10 tentativas. —
  `common_protocol.cpp:78-98,165-196`, `joycon_types.h:752-772`

### Saída

- **Tamanho EXATO de cada pacote, o mesmo por cabo e por rádio.** Subcomando
  (`SubCommandPacket`) = **49 B**: `[0]=0x01`, `[1]`=contador, `[2..9]`=8 B de
  vibração, `[10]`=subcomando, `[11..48]`=38 B de dados. Vibração pura
  (`VibrationPacket`) = **10 B**: `[0]=0x10`, `[1]`=contador, `[2..9]`. **Não há
  variante mais longa para USB nem enchimento até 64 B.** Buffer de leitura: 368 B.
  — `joycon_types.h:24,733-750`, `common_protocol.h:62-68`
- **Contador de 4 bits, e NENHUM CRC na saída do Joy-Con/Pro.** `(packet_counter+1)
  & 0x0F`. A única CRC do arquivo é CRC-8-CCITT (poly 0x07) usada SÓ no miolo da
  configuração do MCU, no byte 37 do buffer de 38, sobre os bytes 1..36. Contraste
  direto com o DualSense por rádio, que exige CRC32 em todo output. —
  `common_protocol.cpp:15-18,209-222,296-322`
- **O handshake USB do Pro é CÓDIGO MORTO no yuzu.** `OutputReport::USB_CMD = 0x80`
  e o enum inteiro (`CONN_STATUS 0x01`, `HADSHAKE 0x02`, `BAUDRATE_3M 0x03`,
  `NO_TIMEOUT 0x04`, `EN_TIMEOUT 0x05`, `RESET 0x06`, `PRE_HANDSHAKE 0x91`,
  `SEND_UART 0x92`) estão declarados e **nunca usados**; não existe ramificação
  cabo/rádio no driver. **-> célula `plataforma.handshake_usb@pro`/`radio_report_id`**
  (como corroboração ampliada: no yuzu ele não existe em transporte nenhum). —
  `joycon_types.h:115-121,165-174`, `joycon_driver.cpp:35-54`
- **Sequência de ligação do Pro, na ordem exata:** (1) `REQ_DEV_INFO 0x02` — se
  falhar, marca `input_only_device`; (2) `LOW_POWER_MODE 0x08` com 0; (3) SPI
  `COLOR_DATA 0x6050` (12 B: corpo, botões, dois punhos, 3 B RGB cada); (4) SPI
  `DEVICE_TYPE 0x6012`; (5) SPI `SERIAL_NUMBER 0x6000` (15 B, pulando o primeiro);
  (6) calibração dos analógicos e da IMU; (7) `SET_PLAYER_LIGHTS`; (8)
  `SetPollingMode` = `ENABLE_VIBRATION 0x48`, `ENABLE_IMU 0x40`,
  `SET_IMU_SENSITIVITY 0x41`, `SET_REPORT_MODE 0x03` com 0x30 e, por fim,
  `TRIGGERS_ELAPSED 0x04` — «// Switch calls this function after enabling active
  mode». — `joycon_driver.cpp:56-137,273-359`, `generic_functions.cpp:16-104`
- **Codificação do rumble HD: 8 bytes, dois canais, e o pacote NEUTRO literal.**
  Neutro: `{0x00, 0x01, 0x40, 0x40, 0x00, 0x01, 0x40, 0x40}`. Com amplitude, monta
  4 bytes e DUPLICA para o segundo motor: `b0 = hf & 0xFF`;
  `b1 = amp_alta | ((hf>>8) & 0x01)`; `b2 = lf | ((amp_baixa>>8) & 0x80)`;
  `b3 = amp_baixa & 0xFF`. Frequências:
  `hf = (u8(clamp(log2(f/10)*32,0,255)) - 0x60)*4` e
  `lf = u8(clamp(log2(f/10)*32,0,255)) - 0x40`. Duas tabelas de 101 pares (alta de
  0x00 a 0xC8 de 2 em 2; baixa de 0x0040 a 0x0072 alternando o bit 0x8000). Trava
  anti-dano: `clamp = 1/max(1, amp_alta + amp_baixa)`. — `joycon_types.h:25`,
  `rumble.cpp:26-67,73-175,190-292`
- **LEDs de jogador: um byte, e PISCAR é o mesmo byte deslocado 4 bits.**
  `SET_PLAYER_LIGHTS = 0x30`, carga de 1 B; aceso fixo = nibble baixo, piscando =
  `SetLedPattern(leds << 4)`. `GET_PLAYER_LIGHTS = 0x31` existe e não é usado. Ao
  inicializar, o yuzu acende em modo PISCA com padrão `(1 + porta)`. `SetLedBusy()`
  é `NotSupported`. — `generic_functions.cpp:127-139`, `joycon_driver.cpp:119`
- **LED HOME: subcomando 0x38 com três bytes fixos, sem animação.** Carga literal e
  constante `{0x0f, 0xf0, 0x00}` — nada configurável, nenhuma tabela de ciclos, sem
  caminho para apagar nem pulsar. **É MENOS do que o protocolo permite:** o 0x38 é
  conhecido por aceitar até 25 bytes de ciclos. — `generic_functions.cpp:121-125`
- **Temporização real do laço, e a média móvel do delta da IMU.**
  `SDL_hid_read_timeout` com `ThreadDelay = 3 ms`, precedido de «// Max update rate
  is 5ms». O delta entregue à IMU não é cru: `delta = ((delta*8) + (novo*2))/10` —
  média exponencial 80/20, em µs, «to provide a smoother motion experience». A fila
  de vibração descarta acima de 6 («We can't keep up with vibrations. Start
  skipping.»). Sanidade: `status <= -1` conta erro, `== 0` é sem dado, `buffer[0] ==
  0x00` conta erro («No reply ever starts with zero»); após 50 erros, encerra.
  — `joycon_driver.cpp:139-201,384-414`
- **Terceiros em modo Switch (o caso SN30): dois fallbacks e um modo degradado.**
  (a) se a SPI 0x6012 devolve `None`, ASSUME Pro («// Fallback to 3rd party pro
  controllers»); (b) se `REQ_DEV_INFO` falha, marca `input_only_device` («the device
  doesn't accept configuration commands»); (c) para `input_only_device` ainda tenta
  `ENABLE_VIBRATION` e `ENABLE_IMU` e só DEPOIS devolve `NotSupported`, **antes** do
  `SET_REPORT_MODE` — logo o pad de terceiro **nunca é comutado para 0x30 e
  permanece no modo em que nasceu**; (d) só para `type==Pro` reconsulta a SPI
  («Some 3rd party controllers aren't pro controllers»). —
  `common_protocol.cpp:28-39`, `joycon_driver.cpp:94-109,279-291`
- **Nada sobre o DualSense — e isso é a resposta.** O driver Joy-Con só liga com
  `enable_joycon_driver`/`enable_procon_driver` marcados, «to avoid conflicting with
  SDL driver», e a varredura filtra pelo vendor `0x057e`. Nenhuma das lacunas que
  dependa do 0x31, da escada 0x32..0x39 ou do CRC32 pode ser respondida aqui. —
  `drivers/joycon.cpp:20-32,82-101`

---

## 3. Dolphin + Cemu — a fonte cujo enunciado estava errado

**O que é.** `dolphin-emu/dolphin` (master) e `cemu-project/Cemu` (main), lidos no
fonte via `raw.githubusercontent.com` e busca de código da API do GitHub.

- **NEGATIVA CENTRAL: o Dolphin NÃO tem backend próprio de DualSense nem de Pro.**
  `Source/Core/InputCommon/ControllerInterface/` tem 12 backends (Android, DInput,
  DualShockUDPClient, ForceFeedback, Pipes, Quartz, SDL, SteamDeck, Touch, WGInput,
  Wiimote, Win32, XInput, Xlib, evdev) e nenhum é de PlayStation ou Switch. Busca no
  repo: «DualSense» em 3 arquivos (dois de UI de hints e o `SDL.cpp`), «Pro
  Controller» em 1 (um COMENTÁRIO), o VID `0x054c` em **0** arquivos do código
  próprio, o PID `0x2009` em **0**. **A premissa do enunciado desta rodada é falsa.**
- **NEGATIVA: o Cemu também delega, por hint.** `InitSDL` liga
  `SDL_HINT_JOYSTICK_ENHANCED_REPORTS=1`, `HIDAPI_PS4=1`, `HIDAPI_PS5=1`,
  `HIDAPI_GAMECUBE=1`, `HIDAPI_SWITCH=1`, `HIDAPI_SWITCH2=1`, `HIDAPI_JOY_CONS=1`,
  `HIDAPI_STADIA/STEAM/LUNA=1` e sai de cena. «DualSense» devolve ZERO arquivos. —
  `src/input/api/SDL/SDLControllerProvider.cpp:116-133`
- **O Dolphin usa SDL upstream, sem fork nem patch** — `.gitmodules` aponta para
  `libsdl-org/SDL` e `libusb/hidapi`. Fecha a porta: nada a garimpar aqui sobre
  protocolo.
- **Política de rumble: janela de 10 SEGUNDOS re-armada a cada mudança.**
  `RUMBLE_LENGTH_MS = 1000*10`, `RUMBLE_PERIOD_MS = 10` (100 Hz). Nunca usa duração
  infinita nem zero. O comentário diz por quê: «This needs to be at least as long as
  the longest rumble that might ever be played. Too short and it's going to stop in
  the middle of a long effect. Infinite values are invalid for ramp effects and
  probably not sensible.» Ao destruir, `SDL_RumbleGamepad(gp, 0, 0, 0)`. —
  `CoreDevice.h:23-31`, `SDL/SDLGamepad.h:347-355`, `.cpp:251-256`
- **Rumble de gatilho é oferecido por CAPACIDADE declarada, nunca por modelo.** As
  saídas "Trigger L/R" só existem se `SDL_PROP_GAMEPAD_CAP_TRIGGER_RUMBLE_BOOLEAN`;
  "Motor L/R" só com `CAP_RUMBLE`. Nenhum ramo por VID/PID nem por transporte. Mesmo
  padrão para touchpad e para os seis sensores. — `SDL/SDLGamepad.cpp:91-136`
- **Nomear botão do Pro: o SDL entrega POSIÇÃO, e o rótulo Nintendo diverge.**
  Casamento posicional com nomes XInput: SOUTH->"Button A", EAST->"Button B",
  WEST->"Button X", NORTH->"Button Y". O comentário declara a consequência: «e.g.
  Switch Pro controller A-button matches "Button B"». **Quem rotular a tela para o
  Pro (ou o SN30 em modo Switch) não pode usar o nome vindo do SDL como rótulo do
  plástico.** — `SDL/SDLGamepad.cpp:312-323`
- **Enquadramento BT-HID: o prefixo 0xA2/0xA1 existe no L2CAP e NÃO existe no
  hidraw.** `WR_SET_REPORT = 0xA0` (interrupção, Linux/macOS) ou `0x50` (comando,
  Windows), `BT_INPUT = 0x01`, `BT_OUTPUT = 0x02`; PSMs `0x0011` e `0x0013`. No
  caminho hidapi o Dolphin lê para `buf+1` e escreve ele mesmo o `buf[0]`, e ao
  escrever passa `buf+1`/`len-1` para `hid_write`. **Prova por código de que sobre
  hidraw o byte 0 é o report ID.** (Lido no caminho do Wiimote — é genérico de
  BT-HID.) — `WiimoteReal.h:41-51`, `IOLinux.cpp:29-30`, `IOhidapi.cpp:176-206`
- **O único gamepad que o Dolphin fala em HID cru é o Steam Deck — e o padrão de
  validação dele.** `hid_enumerate(0x28de, 0x1205)`, cast para struct empacotada, e
  VALIDA quatro campos antes de acreditar: `major_ver==0x01`, `minor_ver==0x00`,
  `report_type==0x09`, `report_sz==sizeof(rpt)`; divergência vira `ERROR_LOG "Steam
  Deck bad report"`. **A competência de HID cru existe no projeto e mesmo assim não
  foi apontada ao DualSense — foi decisão, não falta de meio.** —
  `SteamDeck/SteamDeck.cpp:17-61,143,301-313`
- **Caborádio como IDENTIDADE: mudar de transporte é OUTRO controle.** No cliente
  DSU o Dolphin compara `pad_id`, `pad_state`, `model`, `connection_type` e
  `pad_mac_address`, ignorando de propósito só o `battery_status` («compare
  everything but battery_status»). Como `connection_type` entra, o mesmo controle que
  migra de USB para Bluetooth é dispositivo DIFERENTE e o hotplug o recria. **É
  precedente de projeto maduro para a decisão de identidade cabo/rádio.** —
  `DualShockUDPClient.cpp:227-233`
- **Vocabulário do protocolo DSU** (não é HID do DualSense): `DsConnection {None=0,
  Usb=1, Bluetooth=2}`; `DsBattery {None=0, Dying=1, Low=2, Medium=3, High=4, Full=5,
  Charging=0xEE, Charged=0xEF}`; `DsModel {None=0, PartialGyro=1, FullGyro=2,
  Generic=3}`. O movimento trafega em UNIDADE FÍSICA: `accelerometer_*_g` (float, em
  g) e `gyro_*_deg_s` (float, °/s), com timestamp em µs. —
  `DualShockUDPProto.h:37-62,144-187`
- **Charging/Charged caem no mesmo ramo** e devolvem o máximo, «We don't actually
  know the battery level in this case». No caminho SDL a bateria vem de
  `SDL_GetJoystickPowerInfo` e o input só é criado se não devolver
  `SDL_POWERSTATE_ERROR` — sem distinção de transporte. —
  `DualShockUDPClient.cpp:100-125`, `SDLGamepad.cpp:226-239`
- **Padrões de hint que o Dolphin escolheu para DualSense, com o motivo no
  comentário:** (1) `SDL_JOYSTICK_ENHANCED_REPORTS = "1"` por padrão; (2)
  `SDL_JOYSTICK_HIDAPI_PS5_PLAYER_LED = "0"` — «Disable DualSense Player LEDs; We
  already colorize the Primary LED»; (3) `SDL_JOYSTICK_WGI = "0"` porque tem backend
  próprio. — `SDL/SDL.cpp:137-162`, `MainSettings.cpp:534-550`
- **[doc] Conflito relatado entre 8BitDo e DualSense/DS4 no DirectInput (Windows).**
  Comentário e tooltip: desligar o DirectInput «apparently solves hangs on shutdown
  for users with "8BitDo Ultimate 2" controllers, however, it also breaks hotplug
  support for Dual Sense and DS4 Controllers, so we leave it enabled for now.»
  Caminho Windows — não vale para o nosso Linux/hidraw; registrado só porque nomeia
  um conflito 8BitDo × DualSense na mesma pilha. — `SDL/SDL.cpp:149-155`,
  `SDLHintsWindow.cpp:85-93`
- **ARMADILHA DE NOME: "PRO_CONTROLLER" no Cemu é o Wii U Pro.**
  `PRO_CONTROLLER_NAME = L"Nintendo RVL-CNT-01-UC"` existe só para EXCLUIR o Wii U
  Pro da lista de Wiimotes (VID 0x057e, PIDs 0x0306/0x0330). Quem buscar «Pro
  Controller» no Cemu cai aqui. — `HidapiWiimote.cpp:5-9,28-49`

---

## 4. RPCS3 — 31 achados, zero células, e o mapa de saída mais completo do lote

**O que é.** `RPCS3/rpcs3`, handler nativo do DualSense.
`rpcs3/Input/dualsense_pad_handler.h` (commit 6e6dd603, 261 l.) e `.cpp` (commit
5578edf9, 18/03/2026, 1087 l.), mais `Utilities/CRC.h` e `Emu/Io/PadHandler.h`.
**O arquivo `ds5_pad_handler.cpp` do enunciado não existe (404).**

### Reports de saída, com `static_assert` provando cada tamanho

- **Dois report IDs e seus tamanhos totais.** Cabo: `0x02`, **63 bytes** (o id
  conta). Rádio: `0x31`, **78 bytes**. O `hid_write` começa em `&report.report_id`.
  — `.cpp:912,923,927,930`; `.h:14-15`
- **Layout do bloco `common` de SAÍDA (47 B), offsets relativos:** `valid_flag_0`@0,
  `valid_flag_1`@1, `motor_right`@2, `motor_left`@3, `headphone_volume`@4,
  `speaker_volume`@5, `microphone_volume`@6, `audio_enable_bits`@7,
  `mute_button_led`@8, `power_save_control`@9, `right_trigger_effect[11]`@10-20,
  `left_trigger_effect[11]`@21-31, `reserved[6]`@32-37, `valid_flag_2`@38,
  `effect_strength_1:4|effect_strength_2:4`@39, `reserved2`@40, `lightbar_setup`@41,
  `led_brightness`@42, `player_leds`@43, `lightbar_r/g/b`@44/45/46. Soma 47, com
  `static_assert`. — `.h:109-135`
- **Offsets ABSOLUTOS por CABO (0x02, 63 B):** id@0, então tudo +1, com
  `reserved[15]`@48-62. — `.h:148-154`
- **Offsets ABSOLUTOS por RÁDIO (0x31, 78 B):** `report_id`@0, `seq_tag`@1, `tag`@2,
  common@3..49 (lightbar_r/g/b@47/48/49), `reserved[24]`@50-73, `crc32`@74-77. —
  `.h:137-146`
- **Na SAÍDA o deslocamento cabo->rádio é +2, não +1** — o rádio insere DOIS bytes
  antes do common. Ver divergências. — `.h:148-153` vs `:137-145`
- **O byte de sequência da saída por rádio é o nibble ALTO.** `seq_tag =
  (bt_sequence << 4) | 0x0`, incrementado a cada envio e zerado em 16; o contador é
  por dispositivo. — `.cpp:908-909`, `.h:173`
- **O byte `tag` é fixo `0x10` no offset 2**, comentado no fonte como «magic
  number», e entra no CRC. — `.cpp:914`

### CRC32

- **Parâmetros exatos e os TRÊS prefixos.** Poly `0x04C11DB7`, init `0xFFFFFFFF`,
  finalXOR `0xFFFFFFFF`, reflete entrada e saída = **CRC-32/ISO-HDLC, o do zlib**.
  Prefixos por tipo de transação: `0xA2` saída, `0xA1` entrada, `0xA3` feature
  (GET_REPORT de calibração). — `Utilities/CRC.h:1560-1564`; `.cpp:917,325,409`
- **É `zlib.crc32` puro sobre `[prefixo] || payload` — não há truque de
  semeadura.** O RPCS3 calcula em duas chamadas, mas o overload de 4 argumentos faz
  `UndoFinalize(seed)` antes e `Finalize()` depois, e como `reflectInput ==
  reflectOutput` os dois são o mesmo XOR e se cancelam. Em Python:
  `zlib.crc32(bytes([0xA2]) + pacote[0:74])`. — `CRC.h:502-513`, `.cpp:918-919`
- **A extensão coberta:** `sizeof(bt) - 4` = **74 bytes** (0..73), gravados LE em
  74..77. Na ENTRADA: 74 bytes também, prefixo `0xA1`, comparado com `buf[74]`. —
  `.cpp:919-921,327-328`

### Campos nomeados que o kernel deixa anônimos

- **ÁUDIO: os quatro bytes que o kernel chama de `reserved`.** common 4,5,6,7 =
  `headphone_volume`, `speaker_volume`, `microphone_volume`, `audio_enable_bits`
  (cabo 5-8, rádio 7-10). **É o ganho mais concreto desta fonte sobre o
  `hid-playstation.c`** — mas o `.cpp` nunca escreve nesses bytes. — `.h:115-118`
- **Bits de habilitação de áudio e de economia de energia.**
  `AUDIO_BIT_FORCE_INTERNAL_MIC=0x01`, `FORCE_EXTERNAL_MIC=0x02`,
  `PAD_EXTERNAL_MIC=0x04`, `PAD_INTERNAL_MIC=0x08`, `DISABLE_EXTERNAL_SPEAKERS=0x10`,
  `ENABLE_INTERNAL_SPEAKERS=0x20`; `POWER_SAVE_CONTROL_MIC_MUTE=0x10`,
  `AUDIO_MUTE=0x40`. — `.h:46-54`
- **Os três `valid_flag`, tabela completa.** `flag_0`: COMPATIBLE_VIBRATION 0x01,
  HAPTICS_SELECT 0x02, SET_LEFT_TRIGGER_MOTOR 0x04, SET_RIGHT_TRIGGER_MOTOR 0x08,
  SET_AUDIO_VOLUME 0x10, TOGGLE_AUDIO 0x20, SET_MICROPHONE_VOLUME 0x40,
  TOGGLE_MICROPHONE 0x80. `flag_1`: TOGGLE_MIC_BUTTON_LED 0x01,
  POWER_SAVE_CONTROL_ENABLE 0x02, LIGHTBAR_CONTROL_ENABLE 0x04, RELEASE_LEDS 0x08,
  PLAYER_INDICATOR_CONTROL_ENABLE 0x10, EFFECT_POWER 0x40 (**0x20 não tem nome**).
  `flag_2`: SET_PLAYER_LED_BRIGHTNESS 0x01, LIGHTBAR_SETUP_CONTROL_ENABLE 0x02,
  IMPROVED_RUMBLE_EMULATION 0x04. — `.h:26-44`
- **Gatilhos adaptativos: o DIREITO vem ANTES do esquerdo.** Cabo: dir.@11-21,
  esq.@22-32; rádio: dir.@13-23, esq.@24-34. **RESSALVA:** o RPCS3 só DECLARA — grep
  por `trigger_effect` no `.cpp` não retorna atribuição nenhuma. O offset é forte
  (provado pelo `static_assert`); a semântica dos 11 bytes não é exercitada. —
  `.h:121-122`
- **LED do microfone: campo, flag e TRÊS estados.** `mute_button_led`@8 (cabo 9,
  rádio 11), destravado por `VALID_FLAG_1_TOGGLE_MIC_BUTTON_LED=0x01`;
  `MIC_BUTTON_LED_ON=0x01`, `MIC_BUTTON_LED_PULSE=0x02`. — `.h:119,35,57-58`
- **LEDs de jogador: bitmask de 5 bits e os padrões.** `player_leds`@43 (cabo 44,
  rádio 46), flag `0x10`. Da esquerda para a direita: 0x01, 0x02, 0x04, 0x08, 0x10.
  Padrões: p0=`0b00100`, p1=`0b01010`, p2=`0b10101`, p3=`0b11011`, p4=`0b11111`,
  p5=`0b10111`, p6=`0b11101`. — `.cpp:880-902`
- **Lightbar e o `setup` de acender/apagar com fade.** `lightbar_r/g/b`@44/45/46
  (rádio 47/48/49), flag `0x04`. Separado, `lightbar_setup`@41 (rádio 44), flag_2
  `0x02`, com `LIGHT_ON=0x01` e `LIGHT_OFF=0x02`. **O RPCS3 manda LIGHT_OFF no
  PRIMEIRO report de todos**, comentando que é para a luz sumir em fade e que sem
  isso os LEDs de jogador não atualizavam direito. — `.cpp:830-838,858-871`
- **Rumble: motor DIREITO antes do esquerdo, e o RPCS3 liga QUATRO bits juntos** —
  `COMPATIBLE_VIBRATION|HAPTICS_SELECT`, `POWER_SAVE_CONTROL_ENABLE` e
  `IMPROVED_RUMBLE_EMULATION`. Atribui `motor_left = large_motor`, `motor_right =
  small_motor`. — `.cpp:846-852`, `.h:113-114`

### Reports de entrada

- **Layout do `common` de ENTRADA (63 B) e os absolutos nos dois transportes.**
  Relativo: `x`@0, `y`@1, `rx`@2, `ry`@3, `z(L2)`@4, `rz(R2)`@5, `seq_number`@6,
  `buttons[4]`@7-10, `reserved[4]`@11-14, `gyro[3]` u16 LE@15-20, `accel[3]`@21-26,
  `sensor_timestamp` u32 LE@27-30, `reserved2`@31, `points[2]`@32-39,
  `reserved3[12]`@40-51, `status`@52, `reserved4[10]`@53-62. Cabo (0x01, 64 B, common
  @1): gyro@16-21, status@53. Rádio (0x31, 78 B, common @2 porque há um byte
  `something`@1): gyro@17-22, points@34-41, status@54, `reserved[9]`@65-73,
  crc32@74-77. **O +1 da entrada está confirmado**, e o offset relativo do gyro tem
  confirmação independente na constante
  `DUALSENSE_INPUT_REPORT_GYRO_X_OFFSET=15`. — `.h:71-107,19`
- **MODO SIMPLES (0x01 curto): os campos trocam de LUGAR, não só de offset.**
  Achado que nenhuma âncora cobre. L2/R2 saem de `buttons[0]`/`buttons[1]`; D-pad e
  faces saem de `z`; L1/R1/Share/Options/L3/R3 saem de `rz`; PS/TouchPad/Mic saem de
  `seq_number`. Em bytes crus: LX@1 LY@2 RX@3 RY@4, botões0@5, botões1@6, botões2@7,
  L2@8, R2@9. **O report simples NÃO é o cheio truncado — é outra ordenação.** —
  `.cpp:665-668,734,740,750`
- **Bitmap dos botões no modo Enhanced.** `buttons[0]` nibble baixo = D-pad como hat
  0-7 (0x08 = nenhum); nibble alto: Square 0x01, Cross 0x02, Circle 0x04, Triangle
  0x08. `buttons[1]`: L1 0x01, R1 0x02, L2 dig. 0x04, R2 dig. 0x08, Share 0x10,
  Options 0x20, L3 0x40, R3 0x80. `buttons[2]`: PS 0x01, TouchPad 0x02, Mic 0x04; **no
  DualSense EDGE os quatro bits altos do mesmo byte são FnL 0x10, FnR 0x20, LB 0x40,
  RB 0x80**. — `.cpp:668-780`
- **O byte `status`: bateria no nibble baixo, carga no alto.** `battery = status &
  0x0F` em unidades de 10% (100% é a unidade 10); `charge_info = (status & 0xF0)>>4`:
  0x0 descarregando, 0x1 carregando, 0x2 completa (força bateria=10). Conversão final
  `min(nivel*10+5, 100)`. — `.cpp:357-380,1086`
- **O feature report 0x09 é o que LIGA o modo enhanced por rádio.** Comentário
  literal: «This will give us the bluetooth mac address … Will also enable enhanced
  feature reports for bluetooth.» **Ler o 0x09 é o gatilho que faz o DualSense passar
  a mandar 0x31 em vez de 0x01.** O MAC sai em `buf[1..6]` em ordem INVERTIDA.
  Tamanho esperado 20, mas o teste de sucesso é `res==21`. — `.cpp:128-147`, `.h:13`
- **Calibração: feature 0x05, 41 bytes, e o CRC só existe no rádio.** Mesmo id e
  mesmo tamanho nos dois transportes; **por rádio confere CRC32 (prefixo 0xA3, sobre
  os 37 primeiros, esperado em `buf[37..40]`) e RETENTA até 3 vezes; por cabo lê uma
  vez e não confere nada.** Offsets: bias pitch@1, yaw@3, roll@5; pitch+@7, pitch-@9,
  yaw+@11, yaw-@13, roll+@15, roll-@17; `gyro_speed_scale` = s16@19 + s16@21; accel
  x+@23, x-@25, y+@27, y-@29, z+@31, z-@33 — todos s16 LE. — `.cpp:396-488`
- **Feature 0x20: versão de firmware e hardware.** 64 bytes; `hw_version` u32 LE@24,
  `fw_version2` u32 LE@28, `fw_version` u16 LE@44. Comentário: «Old versions return
  65, newer versions return 64». — `.cpp:173-185`, `.h:12`
- **Touchpad: 1920 × 1080, ponto de 4 bytes, e o bit de "sem contato".** `contact`,
  `x_lo`, um byte partido em `x_hi:4|y_lo:4`, `y_hi`; `x = (x_hi<<8)|x_lo`,
  `y = (y_hi<<4)|y_lo`, ambos 12 bits. Ponto INATIVO quando `contact & 0x80`; os 7
  bits baixos são o id do toque. Dois pontos, common@32-39. — `.h:20-22,61-69,86`,
  `.cpp:756-761`
- **Resoluções adotadas.** `ACC_RES_PER_G = 8192`. `GYRO_RES_PER_DEG_S = 86`, com
  comentário: «technically this could be 1024, but keeping it at 86 keeps us within
  16 bits of precision». **É ESCOLHA do RPCS3, não propriedade do aparelho.** —
  `.h:9-10`, `.cpp:616-623`
- **O RPCS3 reenvia o report de saída a cada 300 ms mesmo sem mudança.**
  `min_output_interval = 300ms`; o reenvio carrega os valores ATUAIS de motor e **não**
  liga `LIGHTBAR_CONTROL_ENABLE`, então não mexe na cor. **Relevante para a questão
  de keepalive desta casa: um emulador grande reenvia a 300 ms sem zerar o rumble.**
  Ressalva: `min_output_interval` é genérico de `PadHandler`. — `.cpp:1014-1028`,
  `PadHandler.h:165`
- **VID/PID e a detecção do Edge.** `054C:0CE6` DualSense, `054C:0DF2` Edge; o Edge é
  detectado só pelo PID, e a única diferença de tratamento é ler os quatro botões
  extras. — `.cpp:28-29,198-205,774-780`
- **NEGATIVA: o RPCS3 não usa a escada 0x32-0x39.** Varredura completa das 1087
  linhas: os únicos report ids são 0x01, 0x02, 0x05, 0x09, 0x20 e 0x31, e **zero**
  ocorrências de `audio/haptic/speaker/volume` no `.cpp`. **Para rumble + lightbar +
  LEDs de jogador por rádio, o 0x31 BASTA.**
- **NEGATIVA: nenhum handler nativo de Nintendo** em `rpcs3/Input/` (52 arquivos:
  ds3, ds4, dualsense, ps_move, skateboard, evdev, xinput, mm_joystick, sdl).

---

## 5. OpenRGB — a única fonte que ESCREVE no byte de brilho

**O que é.** `CalcProgrammer1/OpenRGB`, clone raso em 31/08/2026, commit
`1198d3ed3c85c4fcfab185cb2dc84430e4bece69`. `Controllers/SonyGamepadController/`
(`SonyDualSenseController`, `SonyDS4Controller`, `SonyGamepadControllerDetect.cpp`)
e `dependencies/CRCpp/CRC.h`.

- **Cor por RÁDIO: report `0x31`, 78 bytes contando o id.** O buffer de montagem tem
  79 porque o byte 0 é o selo `0xA2`, removido antes do `hid_write`. Na fita:
  `outbuffer[0]=0x31`, R/G/B em `[46],[47],[48]`. **Esses offsets divergem do
  SDL/kernel em 1 byte** — ver divergências. — `SonyDualSenseController.cpp:56-103`,
  `.h:21`
- **Cor por CABO: confirma a âncora byte a byte.** `0x02`, 48 B (1+47), R/G/B em
  `usb_buf[45],[46],[47]` = common[44..46], **sem CRC**. — `.cpp:107-127`, `.h:22`
- **CRC32 por rádio: `Calculate(buffer, 75)`** = selo `0xA2` + os 74 primeiros bytes
  do relatório, resultado LE em `[74..77]`; parâmetros do `CRC_32` da CRCpp = o
  CRC-32 de sempre. Segunda implementação independente confirmando a âncora. —
  `.cpp:82,98-101`, `CRC.h:1950`
- **ACRÉSCIMO — o brilho mora em common[42], tem TRÊS degraus e é INVERTIDO.** O
  OpenRGB escreve `0x02 - brightness`, com `min=0x00`, `max=0x02`, `default=0x01`:
  **o byte na fita é ATENUAÇÃO**, 0x00 é o mais claro. O SDL apenas DECLARA
  (`ucLedBrightness; // 42`) e nunca escreve; o kernel também não. **O OpenRGB é a
  única das três fontes que escreve nesse byte.** — `.cpp:115,70`, `.h:29-31`
- **ACRÉSCIMO — por RÁDIO há um azul padrão, e o byte que o desliga é common[41] =
  0x02.** Só no ramo Bluetooth, com o comentário literal «// bypass default blue
  color when connected to bluetooth»; no cabo esse byte fica zero. É o
  `lightbar_setup` do kernel / `ucLedAnim` do SDL — que também só declaram. **Se for
  verdade, explica por que a lightbar por rádio nasce azul e não obedece.** — `.cpp:69`
- **ACRÉSCIMO — `valid_flag2` (common[38]) tem de ser > 0 para o brilho valer.** O
  OpenRGB escreve `0xFF` nos dois transportes, com o comentário «// Must be > 0x00 to
  control birghtness» [sic]. — `.cpp:114,68`
- **Receita de escrita SÓ-DE-LUZ:** `valid_flag0 = 0x0F` e `valid_flag1 = 0x55`,
  iguais nos dois transportes. O `0x55` decompõe em `0x01|0x04|0x10|0x40` — os três
  primeiros são mic-mute-led, lightbar e indicador de jogador; **o `0x40` não tem nome
  em fonte nenhuma que o agente leu.** — `.cpp:111-112,63-64`
- **ACRÉSCIMO — o LED do microfone tem TRÊS estados, e o terceiro é PULSO.** common[8]
  recebe 0x00 «Mic Off», 0x01 «Direct», 0x02 «Mic Pulse». **CORROBORADO de forma
  independente pelo SDL**, que comenta o mesmo campo: «0x00 = off, 0x01 = solid, 0x02
  = pulse». Duas fontes que não se copiam. — `.h:26-28`, `.cpp:113,67`;
  `SDL_hidapi_ps5.c:776-778`
- **Como o OpenRGB decide cabo vs rádio: uma linha.** `bool is_bluetooth =
  (info->interface_number == -1);` — o hidapi devolve −1 para nó Bluetooth. Contraste
  DENTRO do mesmo projeto: no DS4 ele **sonda**, lendo até cinco relatórios e
  concluindo rádio se `data[0]==0x11`. — `SonyGamepadControllerDetect.cpp:57`;
  `SonyDS4Controller.cpp:20-33`
- **O Edge é tratado pelo MESMO protocolo de luz** — `0x0CE6` e `0x0DF2` no mesmo
  detector e na mesma classe, sem distinção. — `SonyGamepadControllerDetect.cpp:22,27-28,70-71`
- **LED de jogador: common[43], bits 0..4 (Player 1 = bit 0), monocromáticos** (acende
  se `colors[n] > 0`). **O ACRÉSCIMO:** o OpenRGB **sempre soma `0x20`** nesse byte,
  nos dois transportes, sem comentário explicando; o kernel não nomeia o bit 5. —
  `.cpp:116-121,71-76`
- **De graça, do DS4: o selo `0xA2` é padrão da FAMÍLIA Sony por rádio.** Por rádio
  report `0x11`, buffer de 79 com `0xA2` na frente, 78 escritos, mesmo CRC sobre 75, LE
  em `[74..77]`, R/G/B em `buffer[9],[10],[11]`. Por cabo `0x05`, 11 bytes, R/G/B em
  `[6],[7],[8]`. **Achado secundário:** o `is_bluetooth` do DS4 nasce `false` e só é
  ligado pela sondagem — se as cinco leituras falharem, o caminho de rádio nunca é
  usado. — `SonyDS4Controller.cpp:73-126`, `.h:30`
- **[doc] O autor AFIRMA que o rádio funciona — e isso contradiz o achado do
  deslocamento.** O MR !1003 diz «Implemented support for the DualSense RGB lightbar in
  wired and wireless modes», sem nota técnica sobre offsets, CRC, selo ou prova de
  teste por rádio. — `gitlab.com/CalcProgrammer1/OpenRGB/-/merge_requests/1003`
- **NÃO ACHEI: o OpenRGB não toca Pro Controller nem 8BitDo.** Grep por `057e`,
  `2dc8`, «8BitDo», «Nintendo» em `Controllers/` inteiro: ZERO. **Não é "não
  confirmou": é ausência total de código.**

---

## 6. linux-input (LKML), por espelho marc.info — a fonte com as MEDIÇÕES

**O que é.** A lista `linux-input`, lida via espelho `marc.info` porque
`lore.kernel.org` e `patchwork.kernel.org` estão atrás do desafio anti-bot Anubis
(HTTP 200 servindo «Making sure you're not a bot!»). Fonte secundária para conferir
toda afirmação: `torvalds/linux` master baixado em 31/08/2026 —
`drivers/hid/hid-playstation.c` (94.073 B), `hid-nintendo.c` (92.269 B),
`drivers/input/joydev.c`, `sound/usb/mixer_quirks.c` (138.075 B). **Todo número de
linha é desse master.**

### Áudio do DualSense no Linux

- **Existe um quirk dedicado no ALSA, e ele casa por `USB_ID`.**
  `snd_dualsense_controls_create()` para `USB_ID(0x054c,0x0ce6)` e
  `(0x054c,0x0df2)`, dentro de `#if IS_REACHABLE(CONFIG_INPUT)`. Cria dois kcontrols
  de jack: «Headphone Jack» e «Headset Mic Jack». O comentário: «Since this is an UAC
  1 device, it doesn't support jack detection. However, the controller hid-playstation
  driver reports HP & MIC insert events through a dedicated input device.» Terminal
  IDs OUT=3, IN=4; o estado vem de `EV_SW`/`SW_HEADPHONE_INSERT`/
  `SW_MICROPHONE_INSERT` lidos do evdev por um `input_handler` registrado pelo ALSA.
  **O casamento é por `usb_id` e a estrutura é `usb_mixer_interface` — este caminho
  inteiro NÃO EXISTE por rádio.**
  **-> célula `audio.alto_falante@dualsense`/`radio_evidencia`** —
  `mixer_quirks.c:4443-4446,536-545,702-775`
- **A contraparte dentro do hid-playstation.** `ps_headset_jack_create()` cria um
  QUARTO evdev, «Headset Jack»; os eventos saem de `DS_STATUS1_HP_DETECT` e
  `DS_STATUS1_MIC_DETECT`. **Os quatro evdevs do DualSense no Linux são: gamepad,
  "Motion Sensors", "Touchpad" e "Headset Jack".** —
  `hid-playstation.c:975-991,1362-1408,761/916/953/980`
- **O alto-falante do DualSense é MONO e recebe SÓ o canal direito.** Tabela ASCII
  dentro do `dualsense_output_worker`: `DS_OUTPUT_AUDIO_FLAGS_OUTPUT_PATH_SEL =
  GENMASK(5,4)` seleciona 4 rotas — 0: L-R X (alto-falante MUDO); 1: L-L X; 2: L-L R;
  3: X-X R (fone mudo, alto-falante = canal R). **Não existe rota que mande L nem uma
  soma L+R ao alto-falante interno.** Com o fone desconectado, o kernel escolhe a rota
  3. — `hid-playstation.c:1367-1386,167`
- **Faixa aceita do volume de hardware: `[0x3d..0x64]`, e preamp de +6 dB = `0x2`.**
  «Set SP hardware volume to 100%. Note the accepted range seems to be [0x3d..0x64]»,
  seguido de `speaker_volume = 0x64`. `FIELD_PREP(DS_OUTPUT_AUDIO_FLAGS2_SP_PREAMP_GAIN,
  0x2)` sobre `GENMASK(2,0)`. **Divergência interna do próprio arquivo:** a struct
  declara `u8 speaker_volume; /* 0x0 - 0xff */`. — `hid-playstation.c:1386-1398,280,156,168`
- **O bloco de controle de áudio NÃO é filtrado por transporte — ele SAI por rádio.**
  O `dualsense_output_worker` escreve tudo em `report.common` (47 B, compartilhada) e
  **não há nenhum teste de `hdev->bus` no worker inteiro**; o
  `dualsense_send_output_report` só difere por acrescentar CRC32 quando `report->bt`.
  **Por rádio o kernel MANDA os bytes; mas, como o quirk do ALSA casa por `usb_id`, não
  há placa de som por rádio, logo não há stream para rotear. Comando enviado ≠ stream
  existente.** — `hid-playstation.c:1322-1434,1303-1320,269-299`
- **O byte `led_brightness` existe na struct e NUNCA é usado pelo kernel.** É a única
  ocorrência do identificador como campo; coerente com isso, `DS_OUTPUT_VALID_FLAG2` só
  define BIT(1) e BIT(2) — **o bit 0, que habilitaria o brilho, não existe no
  mainline.** — `hid-playstation.c:293,165-166`

### Os patches que NÃO entraram, e o porquê

- **[doc] Brilho dos LEDs de jogador: patch com valores concretos, RECUSADO por ABI de
  Android.** Kateřina Medvědová, [PATCH v2] «HID: playstation: Support DualSense player
  LED brightness control», 14/07/2026. Afirma que o firmware suporta um nível **GLOBAL**
  (não por LED); define
  `DS_OUTPUT_VALID_FLAG2_LED_BRIGHTNESS_CONTROL_ENABLE = BIT(0)` e a **codificação
  INVERTIDA: HIGH=0, MEDIUM=1, LOW=2**. Testado no `0x0ce6` «using Bluetooth and USB».
  Veredito de Roderick Colenbrander (autor do driver, Sony), 03/08/2026: «it could work
  … However, I do have some concerns as this is a userspace change… The problem is
  applications on Android use the LEDs.» **Ele NÃO contestou a capacidade do hardware —
  só o custo de ABI.** — `marc.info/?l=linux-input&m=178405462897456` e `&m=178578391156949`
- **[doc] * O intervalo de polling por rádio do DS4: o autor do driver o tirou DE
  PROPÓSITO, e disse por quê.** Roderick Colenbrander, 08/06/2025: «This is the only
  code I left out during hid-playstation creation… we later found out **the console
  wasn't even using this code itself**… The code had **significant impact on battery**
  (especially when set to like 1ms). **The timing itself was not that stable**, it made
  it better from the hardware side (**measured using a BT packet sniffer**), but there
  is overhead in bluetooth stacks, which makes the timing not that predictable.» Campos
  do diff: `DS4_OUTPUT_HWCTL_BT_POLL_MASK 0x3F`,
  `DS4_BT_DEFAULT_POLL_INTERVAL_MS 4`, `0x3F = disabled`. Ele corrige ainda o
  proponente: o «not adjustable» se referia ao USB. **O patch não entrou.** —
  `marc.info/?l=linux-input&m=174940609615784`
- **[doc] Rumble HD: o evdev NÃO TEM API para atuador linear — dito por quem escreveu
  o driver.** Vicki Pfau, 12/08/2026, [PATCH v13 2/3]: «since there's currently no API
  for exposing full control of LRAs with evdev, it only simulates a basic rumble for
  now.» O que o Linux faz hoje: `joycon_encode_rumble()` empacota 4 bytes por lado de
  duas tabelas; `JC_RUMBLE_DFLT_LOW_FREQ = 160 Hz`, `HIGH = 320 Hz`; limites 41-626 Hz
  (low) e 82-1253 Hz (high); reenvio a cada `JC_RUMBLE_PERIOD_MS = 50`; 5 pacotes de
  amplitude zero para parar; fila de 8 × 8 bytes. **O hardware é HD, a interface do
  Linux não é.** — `marc.info/…m=178649763827970`; `hid-nintendo.c:1928-1948,300-304,563-564`
- **[doc] Switch 2: interface partida, e por rádio o obstáculo é o BlueZ.** Vicki Pfau,
  [PATCH v13 1/3]: «The Switch 2 uses an unusual split-interface design such that input
  and rumble occur on the main HID interface, but all other communication occurs over a
  "configuration" interface… Due to using a non-standard pairing interface as well as
  Bluetooth communications being extremely limited in the kernel, a custom interface
  between userspace and the kernel will need to be designed, along with bringup in
  BlueZ.» Kconfig: «Switch 2 controllers currently only support USB mode.» IDs novos
  (VID 0x057e): Joy-Con 2 R 0x2066, L 0x2067, Pro Controller 2 0x2069, GameCube NSO
  0x2073. Arquivo novo: `drivers/input/joystick/nintendo-switch2-usb.c`. —
  `marc.info/…m=178649764327977`
- *** O DualSense ganha DOIS nós `jsN` — e o Pro Controller não. Quatro submissões,
  nenhuma aplicada.** `joydev.c` mantém lista negra por VID/PID + `INPUT_PROP_ACCELEROMETER`
  para impedir que o evdev de sensores ganhe seu próprio `/dev/input/jsN`. Cobre PS3
  (0x0268), PS4 (0x05c4, 0x09cc, 0x0ba0), uDraw, **Pro Controller (0x2009)**, Charging
  Grip (0x200E), Joy-Con L/R — e **não cobre o DualSense (0x0ce6) nem o Edge (0x0df2)**.
  Max Staudt, 24/08/2026: «Without this, DualSense (PS5) gamepads are allocated a second
  jsX device for their gyroscope/accelerometer, confusing programs such as
  `/lib/udev/js-set-enum-leds` which look at jsX device numbers to determine the player
  number.» O MESMO conserto foi mandado **quatro vezes** (03/2025, 05/2025, 02/2026 e o
  RESEND de 08/2026) e nenhuma versão está no master. **ASSIMETRIA MEDÍVEL: contar `jsN`
  para descobrir número de jogador funciona com Pro Controller e falha com DualSense.**
  — `joydev.c:751-762,766-775,791-801`; `marc.info/…m=178759673417776`

### Pro Controller e clones

- **O report 0x3F é DEFINIDO e NUNCA LIDO pelo Linux.** `#define
  JC_INPUT_BUTTON_EVENT 0x3F` é a ÚNICA ocorrência do símbolo no arquivo;
  `joycon_ctlr_read_handler()` só encaminha `0x21`, `0x30` e `0x31`. **O 0x3F cai fora
  do `if` e é descartado em silêncio.** O driver força 0x30 no init.
  **-> célula `entrada.stick@sn30`/`radio_report_id`** — `hid-nintendo.c:83,2640-2658,2614-2619`
- **Clones do Pro têm um tipo que o PRÓPRIO APARELHO declara — `0x06`, "licensed
  Pro".** `enum joycon_ctlr_type` com o comentário «Controller type received as part of
  device info»: JCL=0x01, JCR=0x02, **PRO=0x03, LIC_PRO=0x06**, NESL=0x09, NESR=0x0A,
  SNES=0x0B, N64=0x0C, GEN=0x0D. **O tipo não vem do VID/PID: vem da resposta do
  subcomando de device info.** — `hid-nintendo.c:314-325,2554-2559`
- **Nos clones o Linux pula a calibração dos analógicos — mas NÃO a do IMU.** Para
  `LIC_PRO`: «Licensed controllers may have incompatible SPI flash layouts. Use default
  calibration values.» Logo em seguida, `joycon_request_imu_calibration()` é chamado
  **sem nenhum gate de tipo** — a mesma flash declarada incompatível é lida como
  calibração de giroscópio. A revisão automática da lista marcou como [High]:
  «Incompatible SPI flash data is parsed as IMU calibration for licensed controllers,
  leading to invalid sensor scaling and broken IMU output.» **Continua assim no master
  de hoje.** — `hid-nintendo.c:2561-2576` vs `:2590-2599`
- **Nos clones, falhar ao ligar IMU ou rumble é TOLERADO em silêncio.** `hid_dbg("IMU
  enable failed for licensed controller, continuing")` e `ret=0`; idem para o rumble.
  Para um Pro genuíno os mesmos erros são `hid_err` e abortam o init. **Num clone o IMU
  e o rumble podem nunca ter sido habilitados, o controle enumera normalmente, e o único
  vestígio é uma linha de `hid_dbg` — invisível sem dynamic debug ligado.** —
  `hid-nintendo.c:2601-2609,2621-2631`
- **[doc] FF_RUMBLE fantasma: um clone sem motor nenhum anuncia force feedback.**
  `joycon_type_is_procon()` devolve `true` também para `LIC_PRO`, logo
  `joycon_config_rumble()` registra FF_RUMBLE no evdev. Mas o commit que introduziu o
  tipo (HORI Wireless Switch Pad) fala em «the lack of hardware vibration». [Medium] da
  revisão: «creating a phantom rumble device». **REGRA PRÁTICA: a presença de FF_RUMBLE
  no evdev não prova que o controle vibra.** — `hid-nintendo.c:719-722`
- **[doc] A troca X/Y dos "licensed Pro" é quirk de HORI, e o mainline aplica larga
  demais.** `lic_procon_button_mappings` troca North/West e é aplicado a TODO
  `LIC_PRO`. Aiman Najjar, 15/08/2026: o PDP Afterglow (`0e6f:018c`, nome Bluetooth «Lic
  Pro Controller») sai com North/West trocados por isso — «The swapped layout seems to be
  specific to HORI». A correção proposta troca o teste para `hdev->vendor ==
  USB_VENDOR_ID_HORI`; **ainda não aplicada.** Testes dele por rádio: 14 botões corretos,
  LED de jogador acende, sticks com calibração PADRÃO, «IMU/gyro data streams at
  consistent 15ms avg delta». Nota: HORI Wireless Switch Pad `0f0d:00f6` é a ÚNICA
  entrada não-Nintendo da `id_table`. — `hid-nintendo.c:436-450,1769-1772,2214-2217,2905-2907`;
  `marc.info/…m=178682020332856`
- **** A MEDIÇÃO DO 8BITDO PRO 2 POR RÁDIO — e por que o rumble morre nos clones.**
  Alexandre Derumier, 01/08/2026, «HID: nintendo: fix rumble starved by the input report
  cadence gate». **APLICADO** (Jiri Kosina, 03/08/2026). O que ele mediu por rádio —
  fração de reports que cumprem o requisito de cadência: **Pro oficial 95%; clone
  Datafrog 46-52%; 8BitDo Pro 2 2,5-4%.** Explicação: «The Pro 2 delivers reports in
  pairs, so 11-19% of its deltas are 0ms and reset the counter.» O gate:
  `joycon_enforce_subcmd_rate()` exige 3 reports consecutivos espaçados 8-17 ms antes de
  liberar QUALQUER subcomando — e rumble é subcomando. Resultado: «Rumble on third-party
  controllers speaking the Switch protocol is weak and intermittent over bluetooth, and
  absent on some units.» **DUAS FRASES QUE VALEM OURO:** «Affected controllers report
  Nintendo's USB IDs» e «the MAC is no better: **the Datafrog clone reports an OUI
  registered to Nintendo**, so identifying them by vendor would misclassify it». Cura
  aplicada: após 4 esgotamentos CUMULATIVOS, cai para o throttle legado (25 ms) e loga
  «input report cadence does not fit the 8-17ms window; using the legacy subcommand
  throttle» — **linha que o produto pode procurar no dmesg**. Constantes:
  MIN_DELTA 8, MAX_DELTA 17, TX_OFFSET_MS 4, VALID_DELTA_REQ 3, MAX_ATTEMPTS 25,
  MAX_FAILURES 4, LIMITER_USB_MS 20, LIMITER_BT_MS 60. **Por USB o contador é fixado no
  requisito, então o gate só morde por rádio.**
  **-> célula `vibracao.rumble.ff@sn30`/`radio_evidencia`** —
  `hid-nintendo.c:836-901,612-613,879-886,902-922,1805-1812`; `marc.info/…m=178557480543416`
- **O resume por rádio do hid-nintendo é um no-op.** Se `!joycon_using_usb`, loga «no-op
  resume for bt ctlr», devolve o estado para READ e retorna 0 **sem reexecutar
  `joycon_init()`**. Por USB, reexecuta tudo. **Depois de suspender/retomar, um Pro (ou
  clone) por rádio não teve modo de report, IMU, rumble nem LEDs reenviados.** —
  `hid-nintendo.c:2841-2881`
- **Escalas do IMU do Pro, com a correção do fabricante.** Acelerômetro: ±8000 mG,
  `JC_IMU_ACCEL_RES_PER_G = 4096`, máx. 32767, fuzz 10, flat 0. Giroscópio: ±2000 °/s =
  16,38375 dígitos/dps na conta crua; **mas o driver aplica a recomendação do datasheet
  da STMicro de somar 15%** «to allow the full sensitivity range to be saturated without
  clipping», chegando a 0,0702 dps/dígito e **14,247 dígitos por dps** — e é esse o
  número usado. — `hid-nintendo.c:152-178`

### Duas coisas que mudam como se cita esta fonte

- **O `uniq` de todo evdev é o MAC — e é ele que costura os vários evdevs de um
  controle.** `ps_allocate_input_dev()` atribui `input_dev->uniq = hdev->uniq` a TODOS
  os evdevs, e `hdev->uniq` é escrito com `snprintf("%pMR", mac_address)` sobre um campo
  documentado como «stored in little endian order». O hid-nintendo faz o mesmo. A
  convenção está enunciada num patch de terceiro (Denis Benato, HID: flydigi): «spawning
  two evdevs that share the same uniqid so that SDL can match the two and expose them as
  a single controller.» **O casamento SDL de gamepad+sensores é feito pelo MAC, não pelo
  caminho de dispositivo.** — `hid-playstation.c:652,1788,2789,51,2166-2176`;
  `hid-nintendo.c:2132,2196`
- **ARMADILHA DE ANONIMATO, e é desta casa:** `ps_battery_register()` nomeia a
  `power_supply` com `devm_kasprintf(…, "ps-controller-battery-%pMR", dev->mac_address)`
  — o diretório é `/sys/class/power_supply/ps-controller-battery-XX:XX:XX:XX:XX:XX/`.
  **Qualquer `ls` dessa pasta, log de diagnóstico ou screenshot vaza o endereço real, na
  forma separada por dois-pontos que os dois portões desta casa procuram.** —
  `hid-playstation.c:720-722`
- **[incerto] DualSense Edge por rádio: byte nulo no fim do descritor e queda de link ao
  enviar output report.** Caleb Adrian, 27/05/2026 (relato de bug, **sem resposta de
  mantenedor**): o Edge por Bluetooth termina o descritor em «… c0 00»; o driver loga
  «unknown main item tag 0x0» e a linha final diz «Registered DualSense controller», não
  «DualSense Edge». **Ao enviar QUALQUER output report aparecem «Bluetooth: hci0: link tx
  timeout» e «killing stalled connection».** Por USB tudo funciona. Ele afirma ainda que
  os descritores diferem em estrutura: USB com 6 eixos e 15 botões; BT com 4 eixos, 14
  botões e «different vendor report IDs». Firmware 0217, kernel 7.0.5, BlueZ 5.84,
  adaptador MediaTek MT7925. **Ressalva do agente:** a parte de «cai para tratamento
  genérico» é INFERÊNCIA dele — a `id_table` casa por VID/PID. —
  `marc.info/…m=177985878564261`
- **AVISO DE PROCEDÊNCIA: parte da "discussão" da linux-input hoje é gerada por
  máquina.** Um robô `sashiko-bot@kernel.org` responde automaticamente patches de
  hid-nintendo e hid-playstation com achados [High]/[Medium]/[Low] e se apresenta como
  «Sashiko AI review» — **vários achados sobre clones vieram de mensagens DELE**, e o
  agente conferiu cada um contra o código do master antes de repassar. Além disso, dois
  palavra de mantenedor de saída de robô.** — `marc.info/…m=177990090495575`

---

## 7. hid-tools + Godot + game-devices-udev — a fonte que o enunciado não listou

**O que é.** `bentiss/hid-tools` (master), `godotengine/godot` (master),
`fabiscafe/game-devices-udev` (master), `univrsal/libgamepad`, `zeth/inputs`. Lidos no
fonte via `curl` em `raw.githubusercontent.com`.

- **hid-tools TEM descritor HID gravado de DualSense real nos DOIS transportes — e NÃO
  tem nenhum do Pro nem do 8BitDo.** O repo tem 107 arquivos e `hidtools/device/` contém
  só `base_device.py`, `base_gamepad.py` e `sony_gamepad.py`; zero ocorrências de
  nintendo/switch/joycon/8bitdo. **O ouro esperado não existe.** O que existe: DualSense
  (`054C:0CE6`) em **279 bytes por Bluetooth e 257 por USB**, mais DS4 (364/507) e DS3. —
  `sony_gamepad.py:1686,1933`
- **A escada 0x32–0x39 é SÓ de saída; o único ID bidirecional é o 0x31.** Parseando o
  descritor BT: os únicos Input declarados são `0x01` (10 B) e `0x31` (78 B). O 0x31
  declara Output E Input; **`0x32` a `0x39` declaram APENAS Output.** Contraste medido no
  mesmo arquivo: no DS4 por rádio a escada `0x11–0x19` é bidirecional.
  **-> célula `audio.alto_falante@dualsense`/`radio_evidencia`** —
  `sony_gamepad.py:1734-1769`; contraste `:718-897`
- **Tamanhos exatos de toda a escada, nas duas convenções** (payload / com o ID): 0x31 =
  77/78; 0x32 = 141/142; 0x33 = 205/206; 0x34 = 269/270; 0x35 = 333/334; 0x36 = 397/398;
  0x37 = 461/462; 0x38 = 525/526; 0x39 = 546/547. **Passo de +64 B por degrau de 0x31 a
  0x38; o último degrau sobe só +21 — o 0x39 é o teto, não a continuação.** —
  `sony_gamepad.py:1733,1741,1769`
- **O +1 do rádio, medido em QUATRO campos independentes.** USB (0x01): giro@16,
  acel@22, touchpad@33, bateria@53. Bluetooth (0x31): giro@17, acel@23, touchpad@34,
  bateria@54. — `sony_gamepad.py:1466-1478`
- **A CAUSA estrutural do +1: um byte extra em `report[1]`, que fica em branco.** Por
  USB o 0x01 é `[0]` ID, `[1..6]` os seis eixos, `[7]` sequência, `[8..11]` hat+botões,
  `[12..63]` blob vendor. Por Bluetooth o 0x31 é `[0]` ID=49, **`[1]` BYTE EXTRA que o
  dublê nunca escreve**, `[2..7]` os seis eixos, `[8]` sequência, `[9..11]` botões. **O
  deslocamento não é campo a campo: é UM byte inserido logo depois do ID.** —
  `sony_gamepad.py:1889-1899,1937-1982`
- **CRC32: sementes, extensão e posição.** `crc32(bytes([semente]))` usado como seed de
  `crc32(report[0:n])`, gravado LE nos quatro bytes seguintes. 0x31: semente `0xA1`,
  n=74, CRC em `[74..77]`. Feature reports por rádio: semente `0xA3`. —
  `sony_gamepad.py:1832-1841,1915,1923-1926`
- **Por rádio, só DOIS feature reports são assinados, e com contagens diferentes.**
  `0x05` (calibração): assinado sobre os 37 primeiros, total 41 B. `0x09` (pairing/MAC):
  sobre os 16 primeiros, total 20 B. **O `0x20` (firmware, 64 B) não recebe assinatura
  nenhuma.** — `sony_gamepad.py:1922-1927,1605-1640`
- **SEIS feature reports existem no cabo e NÃO no rádio; nenhum é exclusivo do rádio.**
  Só USB: `0x0a` (27 B), `0x21` (5), `0x84` (64), `0x85` (3), `0xa0` (2), `0xe0` (64).
  Comuns: `0x05` (41), `0x08` (48), `0x09` (20), `0x20` (64), `0x22` (64),
  `0x80/0x81/0x83` (64), `0x82` (10), `0xf0/0xf1` (64), `0xf2` (16). **O conjunto do
  rádio é subconjunto próprio do do cabo.** Nota: o `0x08` tem 47 B de payload —
  exatamente o tamanho do `common` de saída. — `sony_gamepad.py:1987-2058` vs `:1772-1819`
- **O report compat 0x01 declara 15 botões no cabo e 14 no rádio.** `Usage Maximum (15)`
  / `Report Count (15)` no descritor USB; `(14)` / `(14)` no BT. O DualSense tem 15
  botões. **Por rádio, no report que um parser HID genérico entende, falta um.** —
  `sony_gamepad.py:1966,1970` vs `:1712,1716`
- **O banco do SDL concorda, por caminho independente:** para `054c:0ce6` e
  `054c:0df2`, as entradas de bus 0x03 (USB) trazem `misc1:b14` e as de bus 0x05 (BT)
  não, com todo o resto idêntico; as quatro têm `driver_signature = 0x00` (caminho do
  kernel). **`b14` é o 15º botão — o mesmo que falta no descritor BT. Duas fontes que
  nunca se falaram apontam para o mesmo botão.** — `gamecontrollerdb.txt:1641,1643,1645,1647`
- **A ORDEM dos campos difere entre os dois reports compat 0x01 — não é só o
  deslocamento.** Por USB: seis eixos juntos em `[1..6]`. Por Bluetooth (10 B):
  `[1..4]`=LX,LY,RX,RY, `[5..7]`=hat+14 botões+6 bits de padding, e **os dois gatilhos vão
  para o FIM, em `[8]` e `[9]`**. — `sony_gamepad.py:1690-1728` vs `:1937-1948`
- **Touchpad: o DualSense não muda com o transporte; o DS4 muda.** DualSense: UM touch
  report com 2 pontos, idêntico nos dois. DS4: até 3 reports por USB e 4 por Bluetooth
  (28 B no cabo, 37 no rádio).
  **-> célula `toque.touchpad.cursor@dualsense`/`radio_evidencia`** (via
  `tests_kernel/test_sony.py`, que exercita o touchpad num DualSense de bus BLUETOOTH). —
  `sony_gamepad.py:1543-1546,1589` vs `:512-527,594-598`
- **O nibble de carga tem SEIS estados nomeados, não dois.** Nibble baixo 0..10 =
  0-100%; nibble ALTO: 0 descarregando, 1 carregando, 2 completa, **10 carga proibida
  (tensão ou temperatura fora de faixa), 11 erro de temperatura, 15 erro de carga**. —
  `sony_gamepad.py:1505-1519`
- **"Descarregando" é inobservável no cabo.** O dublê força `charging_status = 1` sempre
  que `bus == USB`, e o teste do kernel diz com todas as letras `# Discharging tests only
  make sense for BlueTooth`. — `sony_gamepad.py:1524-1527`; `test_sony.py:118-121`
- **Pro Controller: sob o driver, o layout evdev é IGUAL no cabo e no rádio.** Há quatro
  entradas para `057e:2009` no banco do SDL; decodificando os GUIDs, `:1543` (USB, version
  0x8111) e `:1545` (BT, 0x8001) são **idênticas byte a byte**; `:1544` (BT, version
  0x0001) difere; `:1542` é do driver hidapi do próprio SDL. **A diferença é de CAMINHO,
  não de transporte.** — `gamecontrollerdb.txt:1542-1545`
- **8BitDo: três modelos com diferença REAL cabo/rádio no mapeamento evdev, todos no
  caminho do kernel.** SN30 Pro (`2dc8:6101`): USB `rightx:a3, righty:a4`, sem guide; BT
  `rightx:a2, righty:a3`, `guide:b2` — **o analógico direito muda de eixo entre os
  transportes**. SF30 Pro (`2dc8:6000`): `guide:b12` por USB, sem guide por BT. Ultimate
  (`2dc8:3012`): por USB «8BitDo Ultimate Wireless» com `paddle1:b2`/`paddle2:b5`; por BT
  «8BitDo Ultimate» e **nenhuma palheta**. **RESSALVA: este `6101` é o SN30 Pro sob o VID
  da 8BitDo, NÃO o modo Switch (`057e:2009`) que a casa mediu.** —
  `gamecontrollerdb.txt:1230,1232,1219,1220,1248,1237`
- **O X-mode da 8BitDo colapsa muitos modelos num PID USB único.** A regra «8BitDo
  Generic Device» casa `2dc8:3106`, e o arquivo comenta duas vezes «X-mode uses the 8BitDo
  Generic Device rule». PIDs por modo: Pro 2 D-mode 6006/6003, B-mode com fio 3010, X-mode
  3106; Ultimate 2.4G D-mode 3012, X-mode 3106; Pro 3 D-mode 6009; Ultimate 2C 310a;
  Ultimate 2 Wireless 310b; Ultimate Wired for Xbox 2003. **Em X-mode o PID não distingue
  o modelo.** — `8bitdo-gdu.rules:1-3,54,68,50-80`
- **Regra prática de identificação por transporte: por rádio não existe
  `idVendor`/`idProduct` USB.** Todo aparelho que fala nos dois transportes ganha DUAS
  regras: uma casando `KERNELS=="*054C:0CE6*"` (o nome HID BUS:VID:PID, que existe também
  por Bluetooth) e outra casando `ATTRS{idVendor}`/`ATTRS{idProduct}` (que só existe com
  pai USB). **Quem detectar aparelho só por `idVendor`/`idProduct` perde todo controle por
  rádio.** — `sony-gdu.rules:22-27`; `nintendo-gdu.rules:16-17`
- **O Pro Controller ganha uma regra de acesso USB bruto que o DualSense não tem** —
  `SUBSYSTEM=="usb", ATTR{idVendor}=="057e", ATTR{idProduct}=="2009"`, comentada «Grand
  access for some userspace tools, if connected via USB». Nenhum aparelho Sony tem
  equivalente. (A leitura de que isso existe por causa do handshake USB é **inferência do
  agente**.) — `nintendo-gdu.rules:18-19`
- **Os aparelhos 8BitDo não recebem NENHUMA regra de hidraw; Sony e Nintendo recebem.**
  80 linhas, zero ocorrências de `hidraw`. **Ressalva: ausência de regra pode significar
  só que ninguém contribuiu.** — `8bitdo-gdu.rules`
- **Godot NÃO acrescenta.** O driver de joypad é um invólucro de 373 linhas sobre o SDL3
  vendorizado, sem uma menção a DualSense, Nintendo, 8BitDo, VID, PID ou report. O banco
  PRÓPRIO (`godotcontrollerdb.txt`, 52 linhas) não tem uma entrada sequer desses três; o
  `gamecontrollerdb.txt` embutido é o banco do SDL. — `drivers/sdl/joypad_sdl.cpp`
- **Mas o patch de blocklist do Godot registra dois controles de Switch que só carregam
  no cabo.** São nove patches, nenhum mexe em report map; o `0009` mantém `0x20d6:0x0002`
  «PowerA Enhanced Wireless Controller for Nintendo Switch (charging port only)» e
  acrescenta `0x0e6f:0x018a` «PDP REALMz Wireless Controller for Switch, USB charging».
  **É a classe de comportamento cabo/rádio mais hostil que existe: o aparelho aparece e
  não responde.** — `thirdparty/sdl/patches/0009-update-device-blocklist.patch`
- **libgamepad e `inputs` NÃO acrescentam.** Grep de `hidraw`, `054c`, `0ce6`, `057e`,
  `2dc8`, dualsense, nintendo, 8bitdo, bluetooth e report nos quatro arquivos centrais:
  ZERO. Ambas operam só em `/dev/input`. — `device-linux.cpp:50,95`; `manager.py:162-183`
- **Padrão observado (fraco): o `version` do `input_id` muda com o transporte.** GUID com
  version `0x0111` por USB e `0x0100` por Bluetooth em DualSense, Edge, SF30 Pro e
  Ultimate. **Ressalva: são quatro exemplos e o SN30 Pro `6101` foge do padrão (0x0000 por
  USB).** — `gamecontrollerdb.txt:1219,1220,1230,1232,1237,1248,1641,1643,1645,1647`

---

## 8. BlueZ + HIDP + L2CAP — o envelope, medido em código

**O que é.** Kernel HIDP (`net/bluetooth/hidp/{hidp.h,core.c}`), kernel L2CAP
(`include/net/bluetooth/l2cap.h`, `net/bluetooth/l2cap_core.c`, `l2cap_sock.c`),
`drivers/hid/hidraw.c`, BlueZ userspace (`profiles/input/{device.c,server.c,hog-lib.c,
sixaxis.h,input.conf}`, `src/shared/uhid.c`, `src/device.c`, `btio/btio.c`,
`monitor/l2cap.c`), dissectores do Wireshark (`packet-bthid.c`, `packet-btl2cap.h`) e o
`l2cap_proxy` do matlo (MITM em L2CAP usado em engenharia reversa de DS3/DS4).

- **O envelope de ENTRADA tem exatamente UM byte, e o host o remove.** Todo relatório
  chega como `[0xA1][reportID][payload]`; `0xA1` = `HIDP_TRANS_DATA (0xa0) |
  HIDP_DATA_RTYPE_INPUT (0x01)`. O kernel faz `skb_pull_data(skb, 1)`; o BlueZ faz
  `uhid_send_input_report(idev, data+1, len-1)`. **O que chega ao `/dev/hidraw` por rádio
  é byte a byte o que o aparelho pôs DEPOIS do 0xA1. L2CAP SDU = relatório HID + 1.**
  **-> célula `luz.led_home@pro`/`radio_offset`** (o «o rádio NÃO desloca» da célula é
  este fato). — `hidp.h:42,66`, `core.c:601-625`; `device.c:354-390`
- **O envelope de SAÍDA tem exatamente UM byte (0xA2), também invisível ao hidraw.** O
  kernel aloca `size+1` e escreve o cabeçalho com `skb_put_u8`; o BlueZ usa `writev` com
  `iov[0]` de 1 byte. — `core.c:95-126,393-400`; `device.c:231-269,685-697`
- **REFUTA a hipótese do transporte: o +1 do DualSense por rádio NÃO vem do envelope.**
  Como os dois únicos caminhos de host retiram exatamente um byte e não inserem nada, é
  impossível que o transporte produza o deslocamento. **Prova cruzada: no MESMO transporte
  o DS4 desloca +2 e o DualSense +1 — deslocamentos diferentes num envelope idêntico só
  podem vir do aparelho.** — `core.c:608,619-620`; `device.c:387`
- **ONDE o deslocamento pode nascer: por rádio o descritor vem do SDP, não do
  aparelho.** O BlueZ extrai o descritor do atributo `HIDDescriptorList` do registro SDP
  (e ainda o corrige com `epox_endian_quirk`). Por cabo, vem da interface HID USB. **São
  duas fontes independentes do mesmo desenho, escritas pelo fabricante em lugares
  separados — é aí que cabo e rádio podem legitimamente divergir de layout.** —
  `device.c:839-885`
- **O registro SDP é CACHEADO em disco e não é reconsultado.** Os `ServiceRecords` são
  persistidos em `<storage_dir>/cache/<BDADDR>`; se o grupo existe, `svc_resolved` vira
  `true` e o SDP não é consultado de novo. **O descritor que um controle por rádio recebe é
  o gravado no primeiro pareamento; uma atualização de firmware que mude o descritor só é
  vista depois de apagar esse arquivo.** — `src/device.c:4435-4467`
- **O `btmon` NÃO decodifica HID — e é ISSO que faz o capturado parecer deslocado +1.**
  No despacho por PSM há caso para SDP, RFCOMM, BNEP, ATT, AVCTP e AVDTP; **os PSM de HID
  (0x0011 e 0x0013) caem no `default` e saem como `packet_hexdump` cru**, incluindo o byte
  0xA1/0xA2 e sem rotular campo. **Quem comparar um dump de btmon com um de hidraw vê tudo
  um byte adiante — a origem prática da confusão "o rádio desloca".** —
  `monitor/l2cap.c:2679-2705`
- **O Wireshark decodifica, mas rotula o report ID do gamepad como "Protocol Code".** O
  dissector `bthid` decodifica o cabeçalho de 1 byte, mas `dissect_hid_data` CONSOME o
  primeiro byte do payload como «Protocol Code» (1=Keyboard, 2=Mouse) — campo que só existe
  em boot protocol. **Num DualSense o byte 0x31 aparece na tela como "Protocol Code: unknown
  type".** — `packet-bthid.c:122-152,276-284,414-415`
- **Qual canal cada operação usa — e o que o retorno prova.** `write()` em
  `/dev/hidraw` vira HIDP DATA/OUTPUT no canal de **INTERRUPÇÃO**: dispara e esquece, sem
  ACK. `HIDIOCSFEATURE`/`HIDIOCSOUTPUT` viram SET_REPORT no canal de **CONTROLE** e
  BLOQUEIAM esperando um HANDSHAKE; se não for `SUCCESSFUL`, o retorno é `-EIO` **mesmo
  tendo o relatório saído**. **Por rádio, um `write()` positivo não prova entrega, e um
  `-EIO` de SET_REPORT não prova não-entrega.** — `hidraw.c:113-181`; `core.c:243-400,459-470`
- **Uma requisição de cada vez, por sessão.** O kernel serializa com `report_mutex`; o
  BlueZ recusa com `EBUSY` se já houver pendente. — `core.c:271,349`; `device.c:722-756`
- **O host nunca pede tamanho no GET_REPORT — quem decide o comprimento é o aparelho.**
  O HIDP prevê um `BufferSize` opcional de 2 bytes, ligado pelo bit `0x08` do parâmetro;
  **nem o kernel nem o BlueZ ligam esse bit**. O host apenas TRUNCA no buffer do chamador.
  — `core.c:257-308`; `device.c:758-775`; `packet-bthid.c:100-104,203-226`
- **O canal HID é L2CAP em Basic Mode: sem segmentação e sem retransmissão de camada.**
  O BlueZ abre `SOCK_SEQPACKET`, o que implica `L2CAP_MODE_BASIC`. **Quadro maior que o
  `omtu` devolve `-EMSGSIZE` em vez de fragmentar; na recepção, quadro maior que o `imtu` é
  DESCARTADO em silêncio** (só um `BT_ERR "Dropping L2CAP data: receive buffer overflow"`).
  — `btio.c:2007`; `l2cap_sock.c:1990-2003`; `l2cap_core.c:2640-2643,7006-7015`
- **O teto real por quadro é 672 bytes, porque o BlueZ não mexe no MTU do canal HID.**
  `profiles/input/device.c` só passa PSM e SEC_LEVEL ao `bt_io_connect` — nunca
  `BT_IO_OPT_MTU` — logo vale `L2CAP_DEFAULT_MTU = 672`. **Teto de 671 bytes de relatório
  HID por quadro. A escada do DualSense cabe folgada: o maior, 547 B, vira 548 no canal.
  Nenhum relatório do DualSense precisa de fragmentação em L2CAP.** —
  `device.c:1314-1365`; `btio.c:974,698-706`; `l2cap.h:31,200`
- **Confirmação independente de que esse teto é parede real, de quem fez engenharia
  reversa de controle Sony.** O `l2cap_proxy` do matlo tem uma função cujo comentário é
  «This function can be used to bypass the l2cap outgoing MTU check of the Linux kernel»:
  acima do `L2CAP_DEFAULT_MTU` ele deixa de escrever no socket e monta os quadros HCI ACL à
  mão. E, ao abrir o socket, **sobe `imtu` e `omtu` para 1024 via `setsockopt(SOL_L2CAP,
  L2CAP_OPTIONS)` — exatamente o botão que o perfil de input do BlueZ não toca.** —
  `l2cap_con.c:30-35,158-184,243-262`
- **O envelope completo, camada a camada, escrito em código.** `[0x02 =
  HCI_ACLDATA_PKT][hci_acl_hdr: handle com ACL_START, dlen][l2cap_hdr: len, cid][0xA1 ou
  0xA2][reportID][payload]`, com continuações repetindo em `ACL_CONT`. **Nada acima do byte
  0xA1/0xA2 chega ao hidraw.** — `l2cap_con.c:36-155`
- **O enlace não descarta relatório no ar.** `l2cap_do_send` marca os quadros como
  `ACL_START_NO_FLUSH` sempre que o controlador suporta e ninguém pediu `FLAG_FLUSHABLE`
  (o perfil de input não pede), e o flush timeout padrão é `0xFFFF` = infinito. **A banda
  base retransmite até entregar: um relatório de saída por rádio não some por timeout — ou
  é entregue, ou o enlace cai.** — `l2cap_core.c:1028-1049`; `l2cap.h:34`
- **MODO DE FALHA ESPETACULAR: relatório de saída rejeitado DERRUBA o controle, não
  devolve erro.** No caminho padrão (BlueZ userspace), se o `writev` falhar — e `-EMSGSIZE`
  por passar do `omtu` é exatamente esse caso — `hidp_send_message` devolve `false` e
  `hidp_send_output` chama `uhid_disconnect(idev, true)`, que força `UHID_DESTROY`. **O
  sintoma não é "o write falhou": é o controle DESAPARECER do sistema.** O mesmo vale para
  um GET_REPORT que não consiga ser enviado. — `device.c:254-264,685-697,783-788`
- **Ninguém no host implementa DATC — fragmentação em nível HIDP é descartada calada.**
  `HIDP_TRANS_DATC (0xb0)` existe na definição e o Wireshark o decodifica (como obsoleto),
  mas os dois hosts só aceitam cabeçalho de entrada IGUAL a `0xA1`. — `hidp.h:43`,
  `core.c:612,623-625`; `device.c:377-380`
- **O caso CONTRÁRIO, onde o host de fato ACRESCENTA: HID over GATT (BLE).** Em HoGP o
  report ID **não** viaja na notificação ATT: o BlueZ o lê do descritor Report Reference e
  o PREFIXA ao payload antes de entregar ao uhid. No HIDP clássico chama a mesma função com
  `number = 0`, porque o ID já veio no fio. **É a única situação em que o host inventa um
  byte — e não se aplica a DualSense nem Pro, que são BR/EDR.** —
  `hog-lib.c:437-458,333-351`; `shared/uhid.c:460-492`; `device.c:330-351`
- **Sem par não há HID por rádio.** `classic_bonded_only` nasce `true` e o `input.conf`
  confirma «Defaults to true for security». — `device.c:94,115-121`
- **O BlueZ NÃO tem pareamento por cabo para o DualSense nem para o Pro Controller.** A
  tabela de cable pairing cobre quatro produtos: `054c:0268` (PS3), `054c:042f`
  (Navigation), `054c:05c4` (DS4 v1) e `054c:09cc` (DS4 v2). **O DualSense (`0ce6`), o Edge
  (`0df2`) e todo PID da Nintendo ficam de fora — para esses, o botão de pareamento é
  obrigatório.** — `sixaxis.h:16-91`; `hid-ids.h:1340-1344`
- **Os tetos de buffer do host são muito maiores que o teto real do canal.**
  `HID_MAX_BUFFER_SIZE = 16384` no kernel, `UHID_DATA_MAX + 1` no BlueZ. **Quem investigar
  "relatório grande não chega" deve olhar o MTU, não esses tetos.** — `core.c:449-457`;
  `device.c:359,562`
- **O kernel sobrescreve o primeiro byte do buffer do chamador** em GET/SET_REPORT
  (`data[0] = número do relatório`). Coerente com a convenção, mas o buffer é modificado in
  loco. — `core.c:278,353`
- **[doc] O que o dsremap afirma sobre o byte extra (fonte nova, sem código visto).** Para
  o DS4: «Over BT, the report ID is 0x11 and it's followed by two bytes (0xc0 0x00)». Para
  o DualSense: «after GET_REPORT 0x20 it becomes 0x31 … but the report ID is followed by a
  single byte (**0x51**), so offsets have to be adjusted». **Repassado como afirmação de
  página, não como medição.** — `dsremap.readthedocs.io/en/latest/reverse.html`
- **Aviso sobre reaproveitar o `l2cap_proxy`: o trecho de fragmentação parece errado.** No
  laço de continuação, `acl_hdr.dlen` recebe `plen` (o que ainda falta) em vez de
  `data_len`, e `iov_len` recebe `htobs(data_len)` — troca de ordem de bytes num campo em
  ordem do host. **A ferramenta serve como REFERÊNCIA do envelope; o caminho de fragmentação
  não deve ser copiado.** — `l2cap_con.c:117-137`

---

## 9. 8BitDo a fundo — a sonda que identifica o clone

**O que é.** `TheJayMann/8bitdo-spec` (SwitchMode, SN30ProPlus, Pro2), plugin `ebitdo` do
fwupd (`fu-ebitdo.rs`, `fu-ebitdo-device.c`), xpadneo (descritor HID do SN30 Pro+ em modo
Windows + captura btmon), páginas oficiais da 8BitDo, issues do Linux sobre SN30 Pro/Pro+
em modo Switch (DanielOgorchock/linux #10, #16, #37; nicman23/dkms-hid-nintendo #4),
commits do hid-nintendo e as linhas do `SDL_hidapi_switch.c` que falam de 8BitDo.

- **[doc] O SN30 Pro NÃO TEM HD rumble — a fabricante afirma.** Nota de rodapé das Tech
  Specs: «The SN30 Pro features regular rumble vibration, not HD Rumble.» O FAQ repete e dá
  a peça: «SN30 Pro — **eccentric shaft gear motor**», em contraste explícito com «N30 Pro
  2 — Linear vibration motor». **Num motor de eixo excêntrico a frequência é consequência
  da amplitude, não parâmetro comandável.** Isso não diz que o report 0x10 é recusado — o
  que cai é o EFEITO.
  **-> célula `vibracao.rumble.frequencia@sn30`/`radio_evidencia`** —
  `8bitdo.com/sn30-pro-…` e `support.8bitdo.com/faq/sn30-pro.html`
- **[doc] A IMU EXISTE, e a própria 8BitDo delimita onde.** Tech Specs, Special Features:
  «Motion control (**for Switch only**)»; Controller Mode: «Switch mode / X-input /
  D-input». Corrobora por baixo: **o descritor HID do SN30 Pro+ em X-input por rádio não
  tem uma única usage de sensor.** — página do produto; `xpadneo/docs/descriptors/8bitso_sn30_windows.md`
- *** Há um INTERROGATÓRIO ATIVO que identifica um 8BitDo mesmo em modo Switch, onde ele
  usa VID:PID idêntico ao Pro genuíno.** Escreve-se no hidraw a sequência de 6 bytes
  **`01 66 AA 00 21 01`**, repetida até a resposta vir no formato certo («in testing, this
  always works at least by the second try»). A resposta de 64 bytes começa **`81 66 A5`**,
  seguida do **PID do 8BitDo em big-endian nos bytes 3-4**, depois `22`, e 58 bytes
  restantes. Medido pelo autor: SN30 Pro+ devolve **0x6002** e `F8 01 00 00 01 01`; Pro2
  devolve **0x6003**. Scripts: `swGetVer.sh`, `swChangeDinput.sh`, `swExitDinput.sh`.
  **Testado só em 0x6002 e 0x6003 — o SN30 Pro (0x6001) NÃO foi testado.** —
  `8bitdo-spec/SwitchMode/README.md` §Version Request; `swGetVer.sh:4-7`
- **Corroboração independente do numeramento, pelo fwupd** (que existe porque a 8BitDo
  abriu o código da ferramenta de flash): o enum declara `GetVersion = 0x21 // get fw ver
  joystick mode` e `GetVersionResponse = 0x22`, e o parser diz `/* get-version (firmware)
  -- not a packet, just raw data! */`: quando o primeiro byte é `0x22`, **os 4 bytes
  seguintes são a versão de firmware em LE**, formatada como `%u.%02u`. Aplicado ao byte de
  teste: `F8 01 00 00` = 504 -> **firmware 5.04** do SN30 Pro+. — `fu-ebitdo.rs:39-40`;
  `fu-ebitdo-device.c:167-188`
- **Troca de modo por software, sem tocar no botão.** `01 66 AA 00 51 01` no hidraw faz o
  controle em modo Switch reconectar como 8BitDo (mesmo VID/PID do D-input) — o hidraw é
  fechado e apagado antes de dar tempo de ler resposta. Caminho de volta: `81 05 00 51 04`
  (padded a 64 B). Testado no 0x6002 e no 0x6003. — `SwitchMode/README.md:7-15`
- **[doc] Corroboração externa da OUI de clone.** Em dois relatos distintos, de anos e
  países diferentes, o 8BitDo em modo Switch aparece com MAC começando em **E4:17:D8**
  (mascarados pela regra da casa: `E4:17:D8:00:00:74` e `E4:17:D8:00:00:7F`) — exatamente a
  OUI que `externos-referencia-canonica.md:939` chama de "clone". **Sobe o grau da metade
  de rádio dessa linha, que a casa mesma marcou como frouxa.** No mesmo par de logs: **por
  USB o 8BitDo em modo Switch enumera `057e:2009`, "Pro Controller", "Nintendo Co., Ltd.",
  bcdDevice 2.00** — o lado "0200 = clone" do discriminador udev, agora com um 8BitDo real.
  — `nicman23/dkms-hid-nintendo#4`; `DanielOgorchock/linux#16`
- **ARMADILHA REFUTADA, para ninguém propor isto como discriminador:** nos logs aparece
  sempre `BLUETOOTH HID v80.01`, enquanto um Pro sob `hid-generic` aparece como `v0.01`.
  **Não é sinal de clone: é o próprio driver fazendo `hdev->version |= 0x8000`** em toda
  entrada, para o SDL2 distinguir o mapeamento. **Quem vê `v80.01` está vendo o
  hid-nintendo carregado, não um aparelho falso.** — `hid-nintendo.c`, no probe
- **[doc] Relatos concordantes: por rádio, já pareado, o 8BitDo em modo Switch não
  responde a subcomando nenhum.** Textual: «If home led creation is disabled in driver
  8bitdo works when connected by pairing. But with normal connection (already paired) then
  nothing work. **It seems none of subcmd works.** … if connected by USB then it works.» E,
  de quem foi ao hidraw com o `hid_nintendo` removido: «/dev/hidraw1 delivers the packets
  for buttons/axis but not for imu/gyros. When I try to write to the device and configure
  it to enable the imu … it seems that the message is not sent. At least, no answer is
  returned.» **A receita que faz funcionar: esquecer o pareamento e parear de novo.**
  Relatos de 2021, SN30 Pro+ — convergentes, não medição. — `DanielOgorchock/linux#10`
- **energia.bateria — a RESSALVA que faltava.** O SDL comenta, no ponto onde lê o byte de
  bateria: «High nibble of battery/connection byte is battery level, low nibble is
  connection status (**always 0 on 8BitDo Pro 2**) … The battery level is reported from
  0(empty)-8(full)». **Num 8BitDo o nibble ALTO vale, mas o nibble BAIXO — de onde sai "bit0
  = alimentado pelo host" — lê zero sempre.** O comentário nomeia o Pro 2, não o SN30 Pro.
  — `SDL_hidapi_switch.c`, antes de `int charging = (… & 0x10)`
- **Achado de segurança: mandar o subcmd 0x38 (SET_HOME_LIGHT) a um clone pode DESLIGAR o
  controle.** O SDL recusa acender o LED do Home em terceiros com a justificativa «Third
  party controllers don't have a home LED and **will shut off if we try to set it**»,
  recusando pelos tipos `Unknown` e `LicProController`. O kernel chegou ao mesmo por outro
  caminho (commit 8b30fb40f8f2, «HID: nintendo: deregister home LED when it fails»): «Some
  Pro Controller compatible controllers do not support home LED, and will fail when setting
  it. Currently this leads to probe failure.» **Nos quatro logs de 8BitDo/clone lidos, é
  exatamente o subcmd de home LED que devolve −110 (ETIMEDOUT).** — `SDL_hidapi_switch.c`
- **Por rádio dá para PEDIR o tipo ao firmware.** O SDL, **por Bluetooth**, manda
  `RequestDeviceInfo` e lê o tipo no byte 2 da resposta — «// Byte 2: Controller ID (1=LJC,
  2=RJC, 3=Pro)»; o enum traz «These values come directly out of the hardware, so don't
  change them» e lista `ProController = 3` ao lado de `LicProController = 6`. **O que NÃO
  foi achado: qual valor um SN30 Pro devolve.** — `SDL_hidapi_switch.c` `BReadDeviceInfo`;
  `SDL_hidapi_nintendo.h:27-31`
- **O modo X-input por RÁDIO do SN30 Pro+ está inteiramente mapeado — mas é OUTRO modo.**
  Identidade `0005:045E:02E0` (VID Microsoft). Entrada `0x01`: X,Y (16 bits), Rx,Ry (16
  bits), Z e Rz (10 bits + 6 de padding), hat de 4 bits, 10 botões. A captura btmon confirma
  os offsets: bytes 1-8 os quatro eixos (0x8000 no neutro), byte 14 os botões (bit0 B, bit1
  A, bit2 Y, bit3 X, bit4 L, bit5 R). Saída `0x03` (PID Page, Set Effect): 4 bits de «enable
  actuators», **4 magnitudes de 1 byte, lógico 0..100**, duração (unidade 10 ms), atraso e
  loop count. Entrada `0x04`: Battery Strength, **1 byte, lógico 0..255**. O kernel bate:
  `struct xb1s_ff_report`, `XB1S_FF_REPORT 3`, `magnitude[2]` = atuador ESQUERDO,
  `magnitude[3]` = DIREITO, os dois primeiros zerados. **Sem sensor de movimento no
  descritor.** — `xpadneo/docs/descriptors/8bitso_sn30_windows.md`; `hid-microsoft.c:40-53,285-301`
- **Dois PIDs de X-input diferentes conforme o modelo.** O fwupd lista `0x028e /* SF30/SN30
  pro: Xinput mode */` (o PID do Xbox 360 com fio) ao lado de `0x6000 SF30 pro: Dinput`,
  `0x6001 SN30 pro: Dinput`, `0x6002 SN30 pro+: Dinput`. **Já o SN30 Pro *Plus* em X-input
  por Bluetooth é `045E:02E0` (Xbox One S). São perfis de rádio diferentes: o achado de
  rumble acima é do Pro+ e não se transfere ao SN30 Pro sem medição.** —
  `fu-ebitdo-device.c`, bloco de `case` do probe
- **Protocolo de CONFIGURAÇÃO em modo D-input, inteiramente por hidraw — caminho que esta
  casa não conhecia.** Cabeçalho de pedido de 3 bytes: `81 <tamanho total sem o 1º byte>
  <seção; 4 = dados de configuração>`, seguido de um pedido de 16 bytes (tipo no offset 0: 1
  escrever, 2 ler, 6 finalizar; tamanho do bloco LE no offset 8; total LE no offset 10;
  offset corrente LE no 12) e até 45 bytes de dados. Resposta de 18 bytes + até 46 de dados,
  começando `02 04 04`. **A configuração do SN30 Pro+ tem 1952 bytes**, lidos em 43 voltas de
  45 B + uma de 17 B. Nela, **a força de rumble é guardada por perfil, como dois floats de 4
  bytes (esquerdo e direito), 0 = motor desligado a 1 = força total**, e a Ultimate Software
  só escreve 0; 0,2; 0,4; 0,6; 0,8 ou 1. Documentado para SN30 Pro+ (firmware > v3.02) e
  Pro2; **não testado no SN30 Pro**. — `8bitdo-spec/SN30ProPlus/README.md`; `Pro2/README.md:242-262`
- **Numeração dos modos gravada no próprio aparelho:** no cabeçalho da configuração, o campo
  «Gamepad Mode» (2 bytes LE no offset 0x10) vale **0 = Switch, 1 = DInput, 2 = Mac, 3 =
  XInput**, com um valor 4 que aparece e não é usado. **Confirma, do lado do firmware, que o
  modo macOS é de primeira classe.** — `Pro2/README.md:199-216`; `Pro2/config.hexpat:7-12`
- **O handshake USB confirmado, com ressalva de cabo sobre 8BitDo.** O SDL usa a ausência
  de resposta como detector de barramento: «Luckily this command is not supported over
  Bluetooth, so we can use the controller's lack of response as a way to determine if the
  connection is over USB or Bluetooth». E, no comando seguinte: «**The 8BitDo M30 and SF30
  Pro don't respond to this command, but otherwise work correctly**» — e segue em frente. O
  kernel fez o mesmo num commit dedicado (28ba6011f5df, «Don't fail on setting baud rate»):
  «Some third-party controllers can't change the baud rate. We can still use the gamepad
  as-is.» — `SDL_hidapi_switch.c`
- **[incerto] NÃO ACHEI os offsets de rádio em modo Switch.** O que há é o relato de que,
  com o `hid_nintendo` removido, botões e sticks chegam por Bluetooth e IMU não — **sem
  report ID e sem layout**. A leitura óbvia (sem resposta ao subcomando de modo, o aparelho
  ficaria no 0x3F, que não carrega IMU) é **hipótese do agente, sem uma linha de fonte**. Os
  offsets de rádio medidos num 8BitDo são do modo X-input, que é outro protocolo. —
  `DanielOgorchock/linux#10`

---

## As divergências — nenhuma resolvida, nenhum lado escolhido

### Entre fontes

1. **O deslocamento da SAÍDA por rádio: +1, +2, ou os dois.** A âncora das rodadas
   anteriores diz «+1 em relação ao cabo» nomeando o report de SAÍDA. **DS5Dongle e RPCS3
   concordam entre si: entrada +1, saída +2** — a saída leva DOIS bytes de cabeçalho
   (`seq<<4` em `[1]` e tag `0x10` em `[2]`). No DS5Dongle as duas evidências são `memcpy`s
   explícitos e opostos no mesmo arquivo (`main.cpp:135/149` contra `:272`); no RPCS3 são
   duas `struct` com `static_assert`. **A âncora colou o número da entrada no nome do report
   de saída.** Não escolhido: os dois valores são corretos, cada um no seu sentido.
2. **OpenRGB × SDL/kernel/RPCS3/DS5Dongle: o OpenRGB usa +1 na SAÍDA e sozinho.** O pacote
   BT do OpenRGB é o relatório USB copiado VERBATIM com `0x31` na frente — **tanto que o
   `0x02` que fica em `buffer[2]` é o report id do USB reaproveitado como byte de
   sequência**, e o byte de tag `0x10` nunca é enviado (no lugar dele vai `0x0F`, que na
   conta dele é o `valid_flag0`). Todos os campos ficam UM byte antes. **Contra isso, o MR
   !1003 do OpenRGB afirma que o modo sem fio funciona.** Se o firmware exigir `tag ==
   0x10`, o pacote inteiro é rejeitado e a afirmação do MR é falsa. Ninguém resolveu.
3. **Tamanho do 0x32: 141 ou 142.** A âncora da casa diz «escada de 0x32 (141 B) a 0x39
   (547 B)». DS5Dongle declara `uint8_t pkt[142]` em DOIS lugares independentes; o Senshi
   declara `REPORT_SIZE = 142`. **O hid-tools desempata a UNIDADE, não o número:** do
   descritor gravado, 141 é o *payload* do 0x32 e 142 o total com o ID; 546 é o payload do
   0x39 e 547 o total. **A âncora conta o 0x39 com o ID e o 0x32 sem** — os números estão
   certos, a convenção não é a mesma nos dois extremos.
4. **DS5Dongle × Senshi no arranjo do 0x39 — REAL nos números, FALSA como contradição de
   formato.** DS5Dongle põe haptics em `[12..75]+[76..139]` e opus em
   `[142..341]+[342..541]`; o Senshi, no `buildTwoFrameHapticsCatchupReport`, põe opus em
   `[13..412]` e haptics em `[415..542]`. Estão espelhados. **Mas (a) o formato é TLV — a
   ORDEM é escolha do remetente; (b) o comentário do autor do DS5Dongle diz que mudar o
   comprimento do bloco de controle desloca tudo o que vem depois; (c) o próprio Senshi tem
   a OUTRA ordem noutro builder.** Os dois CONCORDAM no que importa: 0x39, 547 bytes, CRC32
   em `[543..546]`, tag de haptics `0xD2`, quadro de 64 bytes. **E o Senshi não é testemunha
   independente: ele CITA o DS5Dongle** («DS5Dongle's working Classic BT 0x36 haptics
   report», `RB.kt:76`). O que distingue os dois não é correção, é status: um é firmware que
   um DualSense real aceita, o outro chama o próprio builder de *catchup* e é sonda.
5. **Semente de CRC de feature: `0x53` × `0xA3`.** DS5Dongle verifica numericamente
   `crc32(b'\x53') = 0x2060efc3`; a literatura de driver (e o RPCS3, e o hid-tools) registra
   `0xA3`. **Não é necessariamente contradição — são transações HID distintas:** `0x53` =
   SET_REPORT(feature), requisição do host; `0xA3` = DATA(feature), resposta do controle;
   `0x43` = GET_REPORT, sem CRC. O DS5Dongle usa os três em lugares diferentes. **Mas só o
   `0x53` foi verificado nesta rodada. Hipótese de reconciliação NÃO testada.**
6. **O byte extra do 0x31: sequência (variável) ou `0x51` (fixo).** A âncora da casa o
   chama de "byte de sequência"; o dsremap afirma que o report ID «is followed by a single
   byte (0x51)», o que soa como constante. Pode ser amostra única lida como valor fixo. E o
   OpenRGB manda `0x02` fixo, o SDL manda `0x00` fixo — **nenhum dos dois incrementa
   contador nesse ponto na SAÍDA.** Se o firmware exigir contador crescente, as duas
   implementações estariam contando com a tolerância dele.
7. **Timeout de GET/SET_REPORT por rádio: 5 s/10 s (kernel) contra 3 s/3 s (BlueZ).** As
   duas implementações coexistem no mesmo sistema; **a ativa por padrão é a do BlueZ**
   (`uhid_state` nasce `UHID_ENABLED`, e o `input.conf` documenta «UserspaceHID … Defaults to
   true»). Quem calibrar tempo contra o número do kernel calibra contra o caminho que
   provavelmente não está em uso. Verificável lendo o `input.conf` da máquina.
8. **O `l2cap_proxy` usa 672 como limiar; o cheque real do kernel é contra o `omtu`
   NEGOCIADO**, que pode ser diferente. **Não se sabe qual `omtu` um DualSense negocia** —
   isso exige o aparelho na mesa e um btmon.
9. **Nome do byte common[43]:** o kernel chama `player_leds`, o OpenRGB «Player LEDs», e o
   **SDL chama `ucPadLights` com o comentário «// Enable touchpad lights»** no flag `0x10`,
   apesar de guardá-lo sob `playerled_supported`. Mesmo byte, mesmo flag, três nomes — **o do
   SDL induz a erro e é o único que fala em touchpad.**
10. **SDL contra os relatos, sobre clone por rádio.** O SDL afirma em comentário que «Third
    party controllers use the full Switch Pro wireless protocol over Bluetooth» e só marca
    `m_bInputOnly` quando NÃO é Bluetooth — assume que o clone aceita subcomando por rádio.
    **Os relatos de 2021 dizem o oposto para o 8BitDo já pareado.** Pode ser firmware antigo,
    pode ser que o SDL reinicialize de outro jeito. Não resolvido.
11. **O aviso do 8bitdo-spec contra a âncora medida desta casa.** O repo avisa que «the
    `hid_nintendo` module may not properly create the `hidraw` file, as 8bitdo controllers in
    Switch mode has been known not to load properly with this module». **A casa mediu o
    contrário.** Explicação possível, não provada: o aviso é de antes do commit 8b30fb40f8f2
    (2022), que parou de derrubar o probe quando o home LED falha — que é exatamente o que
    quebrava o carregamento nos quatro logs lidos.
12. **A âncora do SN30 e a CADÊNCIA.** A âncora diz «SN30 em modo Switch: fala o protocolo
    do Pro; medido que NÃO desloca offsets por rádio». Nada a contradiz. **Mas a lista
    ACRESCENTA um eixo que a âncora não cobre: offset igual não implica cadência igual — e é
    a cadência que mata o rumble.** A medição do patch é do **8BitDo Pro 2**, não do SN30. O
    agente se recusou a estender.

### Dentro da mesma fonte

- **hid-playstation.c:** `u8 speaker_volume; /* 0x0 - 0xff */` (linha 280) contra «the
  accepted range seems to be [0x3d..0x64]» (linha 1387). **As duas afirmações estão vivas no
  mesmo arquivo.** Resolver exige o aparelho na mesa.
- **hid-tools, em DOIS arquivos:** o comentário diz que a calibração se obtém pelo feature
  `0x09`; **o CÓDIGO trata `0x05` como "Calibration info" e `0x09` como "Pairing info" com o
  MAC.** Os tamanhos (41 B / 20 B) e o conteúdo sustentam o código. O comentário parece cópia
  da classe do DS4. — E ainda: o comentário diz «MAC address is stored in byte 1-7», mas o
  código escreve `r[6-id]` para id 0..5 = **seis** bytes. Um MAC tem seis.
- **yuzu/Eden, taxa do 0x30:** o enum chama o modo de `STANDARD_FULL_60HZ` (16,6 ms), o
  comentário do laço diz «// Max update rate is 5ms» (200 Hz). **As duas afirmações no mesmo
  repositório.**
- **yuzu/Eden, IMU:** o giro subtrai o offset, **o acelerômetro não** (`poller.cpp:331` vs
  `:315`). Ou é intencional (offset de fábrica ~0) ou é defeito do yuzu. **Não copiar sem
  medir.**
- **yuzu/Eden, `0x3F` do Pro em dois nibbles:** nenhuma linha do código prova que o Pro
  empacota dois chapéus num byte — **é o que o yuzu ASSUME**, e para o Joy-Con solto ele usa
  o byte inteiro como um chapéu só.
- **yuzu/Eden, `ValidateValue`:** troca por default qualquer valor igual a 0 ou a `0xFFF`.
  Para os analógicos de 12 bits, `0xFFF` é o marcador de flash apagada; **mas a MESMA função é
  aplicada a offsets e escalas s16 da IMU, onde `0xFFF` = 4095 é leitura legítima.** Defeito
  provável, não regra do protocolo.
- **yuzu/Eden, "default" da taxa do giro:** o header marca `HZ208` como «// Default» e o
  driver escolhe `HZ833`. **O comentário descreve o padrão do APARELHO; a escolha do yuzu é
  outra.**
- **RPCS3:** `DUALSENSE_USB_REPORT_SIZE = 63` com o comentário «64 in hid, because of the
  report ID being added», mas a struct JÁ inclui o `report_id` e tem `static_assert(63)`. **O
  valor escrito no fio é 63 incluindo o ID — o mesmo do kernel.**
- **RPCS3, heurística dependente de plataforma:** o caso do report `0x01` decide «é Bluetooth
  em modo simples» quando `res == 78`. **Pressupõe que o hidapi devolva o buffer preenchido
  até o tamanho do maior report de entrada; se numa plataforma o hidraw devolver o tamanho
  REAL do report simples, a classificação inverte.** Não verificado.
- **RPCS3, ordem dos nibbles:** `effect_strength_1:4` e `:2` dividem um byte; **qual é qual
  depende da ordem de alocação de bitfields do compilador**, e o próprio comentário admite:
  «one for motors, the other for trigger motors, not sure which is which».
- **8bitdo-spec:** o `SwitchMode/README.md` lê o último byte de `81 05 00 51 04` como «mudar
  para o modo Switch», isto é **4 = Switch**; o `Pro2/README.md` do MESMO autor documenta **0
  = Switch** e o 4 como «unused». Ou são campos com numerações diferentes, ou uma das leituras
  está errada.
- **A 8BitDo contra a 8BitDo:** a página do produto lista TRÊS modos; o FAQ lista QUATRO
  pelos LEDs («LED 3: macOS mode») e a configuração gravada tem `2 = Mac`. **A página está
  incompleta, mas não há como provar.**

### Ressalvas de MODELO e de REVISÃO que valem para tudo acima

- **A página oficial lida é do SN30 Pro com sticks Hall Effect (revisão atual, Switch 2,
  480 mAh). A unidade desta casa é o `2dc8:6001` de 2018 — mesmo nome comercial, revisão
  diferente.** O FAQ não distingue revisões.
- **Quase toda a evidência de RÁDIO sobre 8BitDo é do SN30 Pro *Plus* (0x6002) ou do Pro2
  (0x6003).** O 8bitdo-spec testou 6002 e 6003; o descritor do xpadneo e o rumble do
  hid-microsoft são do Pro+; o comentário de bateria do SDL nomeia o Pro 2. **Só os dmesg da
  issue nicman23#4 são de um SN30 Pro declarado.**
- **O discriminador clone-vs-original não é VID/PID nem OUI, e isso está medido:**
  «Affected controllers report Nintendo's USB IDs» e «the Datafrog clone reports an OUI
  registered to Nintendo». O único discriminador visto em código é o byte de tipo do device
  info (`PRO=0x03` vs `LIC_PRO=0x06`). **Se o SN30 devolve 0x03 ou 0x06 é pergunta de bancada
  — e a resposta muda o comportamento do kernel em quatro lugares** (calibração de stick,
  tolerância de falha de IMU, tolerância de falha de rumble, troca X/Y).

---

## A lista de trabalho — o que ninguém pegou

Ordenado por quanto muda o produto. Nada disto virou célula.

1. **A gramática TLV do rádio, inteira** (DS5Dongle). Tags `0x10` SetState, `0x11`
   controle de áudio/mic, `0x12` haptics PCM, `0x13` alto-falante interno, `0x16` fone —
   cada bloco com {tag, comprimento}. **Converte a "escada 0x32..0x39" de uma tabela de
   tamanhos num protocolo que dá para escrever.** Com ela vêm: haptics VCM int8 estéreo a
   3000 Hz em blocos de 64 B; microfone opus de 71 B por quadro chegando **dentro do 0x31**
   com o bit 1 do byte de flags; alto-falante opus estéreo 48 kHz CBR 160 kbps em quadros de
   200 B; e o mapeamento dos canais 3-4 do sink ALSA para o bloco de tag `0x12`.
2. **A sonda ativa que identifica um 8BitDo em modo Switch** — `01 66 AA 00 21 01` no
   hidraw, resposta `81 66 A5 <PID big-endian> 22 …`, com o firmware nos 4 bytes seguintes ao
   `0x22` (corroborado pelo fwupd). **Resolve por interrogatório o que VID/PID e OUI não
   resolvem.** Não testada no `0x6001` desta casa.
3. **O modo de falha do BlueZ: relatório de saída rejeitado DERRUBA o controle** via
   `uhid_disconnect`/`UHID_DESTROY`, em vez de devolver erro. Com o teto de 672 B do L2CAP
   (que o perfil de input nunca ajusta) e o `-EMSGSIZE` do Basic Mode, **é o caminho pelo
   qual um report grande demais faz o controle sumir do sistema.**
4. **`ps-controller-battery-<MAC>` em `/sys/class/power_supply/`** — o nome do nó de bateria
   contém o endereço real, na forma exata que os dois portões de anonimato desta casa
   procuram. Qualquer log, `ls` ou screenshot vaza.
5. **O DualSense ganha DOIS nós `jsN` e o Pro não** — a lista negra do `joydev.c` não cobre
   `0x0ce6` nem `0x0df2`, e o conserto foi submetido quatro vezes sem ser aplicado. **Contar
   `jsN` para descobrir número de jogador funciona com Pro e falha com DualSense.**
6. **O feature `0x09` é o gatilho do modo enhanced por rádio** (RPCS3): lê-lo é o que faz o
   DualSense passar a mandar `0x31` em vez de `0x01`.
7. **Os três bytes do brilho da lightbar** — common[42] é ATENUAÇÃO com três degraus
   (0x00 mais claro), guardado por `valid_flag2 > 0`; **e common[41] = `0x02` é o byte que
   "bypassa o azul padrão" no rádio**, sem o qual a cor enviada talvez não vença o firmware.
   Só o OpenRGB escreve nesses dois.
8. **O `0x32` (142 B) como caminho alternativo para SetStateData e para ligar o streaming
   do microfone** — e o aviso de que **o controle não retoma o mic sozinho depois de
   reconectar**.
9. **O LED do microfone tem três estados, e o terceiro é PULSO** (`0x02`) — corroborado por
   OpenRGB, RPCS3 e SDL, três fontes independentes.
10. **A política de reenvio periódico de outro projeto grande:** RPCS3 reenvia o report de
    saída a cada 300 ms sem zerar o rumble e sem ligar o controle de lightbar; Dolphin usa
    janela de 10 s re-armada a cada mudança. **Precedente medido para a questão de keepalive
    desta casa.**
11. **O modo simples do DualSense não é o cheio truncado — é outra ordenação** (RPCS3), e
    o report compat `0x01` por rádio ainda **move os dois gatilhos para o fim** (hid-tools).
12. **Mandar o subcmd `0x38` a um clone pode DESLIGAR o controle** (SDL), e o report `0x3F`
    do Pro é descartado em silêncio pelo Linux — sem mensagem de erro.
13. **O descritor por rádio vem do SDP e fica cacheado em disco** — atualização de firmware
    que mude o descritor só é vista depois de apagar `<storage_dir>/cache/<BDADDR>`.
14. **O resume por rádio do hid-nintendo é no-op**: depois de suspender/retomar, modo de
    report, IMU, rumble e LEDs não são reenviados.
15. **Caborádio como identidade**: o Dolphin trata mudança de transporte como controle
    DIFERENTE, de propósito, comparando `connection_type` no casamento de dispositivo.
