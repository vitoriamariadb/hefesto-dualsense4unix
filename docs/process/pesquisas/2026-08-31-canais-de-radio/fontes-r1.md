# Os dossiês das fontes — rodada 1 (31/08/2026)

Nove agentes leram nove fontes INTEIRAS atrás dos canais de rádio que faltam no
`docs/data/mapa-controles.csv`. Devolveram **199 achados e 64 divergências**.
Dessas nove leituras saíram **43 propostas**, das quais **13 viraram célula**.

**Este documento existe por causa do resto.** Só o que casava com as 30 lacunas
pedidas virou proposta; o que sobrou — a maior parte — não foi lido por mais
ninguém e desapareceria com o journal. Aqui ele passa a existir, com endereço.

| | |
| --- | --- |
| Journal cru | `bruto/journal-wf_82d96300-e59.jsonl` |
| Resultado | `bruto/resultado-w6f1jxfra.json` (`["result"]["celulas"]`) |
| Fontes | 9 · Achados | 199 · Divergências | 64 · Propostas | 43 · Células | 13 |

**Como ler.** Cada achado tem um identificador `[F.n]` que é a posição no
journal (fonte, achado) — é por ele que se volta ao cru. O `grau` é o
vocabulário da casa: `inferido-do-codigo` (alguém leu o fonte), `afirmado-no-doc`
(alguém leu a prosa de terceiro), `incerto`. **Nada aqui foi medido nesta
bancada.** Onde uma fonte afirma sozinha, está escrito que é uma fonte só.

**A marcação `-> CÉLULA` é da rodada 1.** As rodadas 2 e 3 releram parte destas
mesmas fontes (a 3 releu as nove) e produziram outras 27 células; um achado sem
marca aqui pode ter sido usado lá. Confira em `bruto/resultado-w67p1y0q2.json` e
`bruto/resultado-wzuxu703q.json` antes de tratar um item como inédito.

---

## As nove fontes, e o que cada uma pode provar

| # | Fonte | Prova | NÃO prova |
| --- | --- | --- | --- |
| F4 | `hid-playstation.c` (cópia DKMS desta árvore, 3171 linhas) | envelope, CRC, structs, o que o kernel escreve | gatilho adaptativo, áudio por rádio, handshake de modo |
| F5 | SDL `SDL_hidapi_ps5.c` (1734 linhas) | envelope, CRC, convivência, hints, keepalive | conteúdo dos 22 bytes de gatilho (nunca os escreve) |
| F1 | `flok/pydualsense` | CRC verificado numericamente; um mapa completo de saída | nada por prosa — o README não fala de BT |
| F2 | `Ohjurot/DualSense-Windows` | entrada byte a byte; modos estendidos de gatilho | CRC de entrada (não confere); rotulagem do IMU |
| F7 | `dualshock-tools.github.io` | os canais 0x80/0x81/0x82/0x83, NVS, calibração, gatilho | **nada sobre rádio — ela RECUSA Bluetooth** |
| F8 | `dualsense-ts` + `Senshi` | os reports de áudio/háptico 0x32/0x35/0x36/0x39 | independência: o Senshi cita o DS5Dongle |
| F3 | `steam-devices` + SDL | as regras udev da Valve | o comportamento do cliente Steam (é fechado) |
| F6 | `hid-nintendo` + dekuNukem | o Pro inteiro: subcomandos, rumble, IMU, sniff | a taxa real de push por rádio (três números vivos) |
| F9 | 8BitDo (SDL, kernel, fwupd, manual) | o SN30 Pro em D-input e em modo Switch | o modo X-input por rádio; a revisão Hall Effect |

---

# F4 · `hid-playstation.c` — o driver do kernel

**O que é:** o driver que a máquina dela usa. É a régua contra a qual as outras
seis fontes de DualSense foram medidas.

**O que foi lido:** integralmente, do disco, em
`assets/dkms/hid-playstation/hid-playstation.c` — 3171 linhas, sha256
`3729dd2e25650d5162463b408cd26727a46c41c481ee7212ef3e9ae2adaf55fb`, que é o
vanilla do Pop!\_OS v7.0.11 mais os dois patches desta casa. Os valores foram
reconferidos contra `torvalds/linux` master.

### Envelope

- **[4.1] Entrada.** Rádio: `DS_INPUT_REPORT_BT` 0x31, 78 B. Cabo: 0x01, 64 B.
  O comentário do driver diz que por Bluetooth o reportID 1 é um report MÍNIMO e
  o completo vem no 49 decimal. — `:140-147`, `:1574-1584`
- **[4.2] Saída.** Rádio: 0x31, 78 B. Cabo: 0x02, 63 B. **O mesmo número 0x31
  serve de entrada e de saída no rádio**; no cabo os IDs diferem. — `:140-147`
- **[4.3] O deslocamento da SAÍDA é +2, não +1.** `struct
  dualsense_output_report_bt` = `report_id(0x31) + seq_tag + tag + common[47] +
  reserved[24] + __le32 crc32` = 78 B; a de cabo é `report_id(0x02) +
  common[47] + reserved[15]` = 63 B. Payload comum no byte 3 (rádio) e no byte 1
  (cabo). Conferido compilando as structs e imprimindo `offsetof`. — `:320-366`
- **[4.4] Saída 0x31, índice a índice:** 0 id · 1 seq_tag · 2 tag(0x10) ·
  3 valid_flag0 · 4 valid_flag1 · 5 motor_right · 6 motor_left · 7
  headphone_volume(0x00-0x7f) · 8 speaker_volume(0x00-0xff) · 9
  mic_volume(0x00-0x40) · 10 audio_control · 11 mute_button_led · 12
  power_save_control · 13-39 reservado[27] · 40 audio_control2 · 41 valid_flag2 ·
  42-43 reservado · 44 lightbar_setup · 45 led_brightness · 46 player_leds ·
  47/48/49 lightbar R/G/B · 50-73 reservado[24] · 74-77 crc32 LE. No cabo os
  mesmos campos ficam em 1..47. — `:320-366`
- **[4.5] Entrada 0x31, índice a índice:** 0 id · **1 não lido** · 2 x · 3 y ·
  4 rx · 5 ry · 6 z(L2) · 7 rz(R2) · 8 seq_number · 9-12 buttons[0..3] · 13-16
  reservado · 17-22 giro X/Y/Z · 23-28 acel X/Y/Z (todos `__le16`) · 29-32
  sensor_timestamp `__le32` · 33 reservado · 34-37 toque 0 · 38-41 toque 1 ·
  42-53 reservado[12] · 54/55/56 status[0..2] · 57-64 reservado[8] ·
  **65-73 fora da struct** · 74-77 crc32. — `:295-317`, `:1583-1592`
- **[4.6] Dez bytes de rádio sobre os quais este driver não afirma nada:** o
  byte 1 da entrada (ele pula de `data[0]` para `data[2]`) e os bytes 65..73,
  porque a struct de 63 B acaba no índice 64 e o CRC começa no 74. Além disso o
  campo `seq_number` da entrada existe na struct e **não aparece em nenhum outro
  lugar do arquivo**. — `:1590`, `:295-317`
- **[4.13] Como a saída é entregue:** `hid_hw_output_report()` — canal de
  interrupção, não `SET_REPORT` no canal de controle. A mesma chamada nos dois
  barramentos; só o buffer montado antes é que muda. Não há um único
  `hid_hw_raw_request` com `HID_OUTPUT_REPORT` para o DualSense no arquivo. — `:1445`

### CRC e sementes

- **[4.7] Algoritmo:** `crc = crc32_le(0xFFFFFFFF, &seed, 1); crc = ~crc32_le(crc,
  data, len)`. CRC-32 padrão (polinômio refletido) sobre a cadeia
  `semente || dados`, gravado e lido em little-endian. — `:794-802`
- **[4.8] Três sementes, uma por tipo de transação:** `PS_INPUT_CRC32_SEED` 0xA1,
  `PS_OUTPUT_CRC32_SEED` 0xA2, `PS_FEATURE_CRC32_SEED` 0xA3. Compartilhadas com o
  DualShock4 — o comentário do driver diz isso. — `:135-138`
- **[4.9] O que cada um cobre:** saída, 0xA2 + bytes 0..73 (report id incluído),
  resultado em 74..77; entrada, 0xA1 + `data[0..73]`, esperado em 74..77;
  feature, 0xA3 + `buf[0 .. tam-5]`. **Em todos os três o report ID entra na
  conta.** — `:1434-1442`, `:1584-1590`, `:873-881`
- **[4.10] CRC só existe no rádio.** Todas as três verificações são guardadas por
  `bus == BUS_BLUETOOTH`. Entrada 0x31 com CRC ruim -> `-EILSEQ`, log
  "DualSense input CRC's check failed", pacote inteiro descartado. — `:873`, `:1583-1589`

### Os dois bytes de cabeçalho do rádio

- **[4.11] `seq_tag` (byte 1):** nibble ALTO = número de sequência
  (`GENMASK(7,4)`), nibble BAIXO = tag, deixada em 0. O contador incrementa a
  cada report e volta a zero em 16. Comentário: *"Highest 4-bit is a sequence
  number, which needs to be increased every report."* — `:203-205`, `:1389-1396`
- **[4.12] `tag` (byte 2) = 0x10, e o driver não sabe por quê.** Comentário
  literal: *"Magic value required in tag field of Bluetooth output report" / "Tag
  must be set. Exact meaning is unclear."* — `:202-203`, `:1387`

### Feature reports e identidade

- **[4.14] Três feature reports, e por rádio os três passam por CRC**
  (`check_crc = true` nas três chamadas): 0x09 pairing info, 20 B, MAC em
  `buf[1..6]`; 0x20 firmware, 64 B, hw_version em 24..27, fw_version em 28..31,
  update_version `__le16` em 44..45; 0x05 calibração, 41 B, 17 valores `__le16`
  de `buf[1]` a `buf[33]`. **IDs e tamanhos iguais no cabo e no rádio** — ao
  contrário do DualShock4, que troca 0x02/37 B por 0x05/41 B. — `:149-155`, `:1169`, `:1285`, `:1318`
- **[4.15] Assimetria dentro do mesmo driver:** `dualsense_get_mac_address()` lê o
  feature 0x09 incondicionalmente, inclusive por Bluetooth;
  `dualshock4_get_mac_address()` só lê no cabo e por rádio tira o endereço do
  `hdev->uniq` do HIDP. — `:1309-1330`
- **[4.26] IDs por Bluetooth:** dois produtos casam
  (`PS5_CONTROLLER` e `PS5_CONTROLLER_2`), ambos `PS_TYPE_PS5_DUALSENSE`. O
  segundo (Edge) sempre usa vibração v2; o primeiro só a partir de
  `DS_FEATURE_VERSION(2,21)`, lida do `update_version` em `buf[44..45]` do 0x20. — `:3127-3134`, `:1917-1923`

### O que o driver NÃO faz — e é isto que abre trabalho

- **[4.16] Não há handshake de troca de modo.** Nenhum report de saída nem
  feature report é enviado com o propósito declarado de tirar o DualSense do 0x01
  e pô-lo no 0x31. A ordem da probe é: `hid_parse` -> `hid_hw_start` ->
  `hid_hw_open` -> GET 0x09 -> GET 0x20 -> GET 0x05 -> input devices ->
  `dualsense_reset_leds()` (a PRIMEIRA escrita). Três leituras de feature
  precedem qualquer escrita — se o gatilho do modo completo for uma delas, o
  driver não diz. — `:3056-3095`, `:1851-2000`
- **[4.17] Entrada 0x01 por BT não é tratada.** O ramo BT só aceita 0x31 com 78 B;
  o resto imprime "Unhandled reportID". O DualShock4 TEM o ramo do report mínimo,
  com o comentário *"Some third-party pads never switch to the full 0x11
  report"* — o DualSense não ganhou esse tratamento. — `:1592-1595`, `:2623-2635`
- **[4.18] A primeira escrita no rádio existe por causa da animação da lightbar.**
  `dualsense_reset_leds()` manda `valid_flag2 = LIGHTBAR_SETUP_CONTROL_ENABLE` e
  `lightbar_setup = LIGHT_OUT`. Comentário: *"On Bluetooth the DualSense outputs
  an animation on the lightbar during startup and maintains a color afterwards.
  We need to explicitly reconfigure the lightbar before we can do any programming
  later on."* — `:1791-1814`
- **[4.19] Áudio por BT: não implementado.** O jack de headset só é criado quando
  `bus == BUS_USB`; o roteamento (`audio_control`, `speaker_volume` 0x64, preamp
  +6 dB) depende de `plugged_state`, atualizado só no ramo USB. Comentário:
  *"Bluetooth audio is currently not supported."* — `:1955-1962`, `:1644-1667`
- **[4.20] Gatilhos adaptativos: ZERO.** Busca por `adaptive`/`trigger` no arquivo
  inteiro só devolve rumble clássico. Os 27 bytes de `reserved2` (índices 13-39
  no rádio) e os 24 de `reserved` (50-73) são exatamente o espaço que o driver não
  nomeia. — `:320-359`
- **[4.21] Intervalo de poll por BT: o DS4 tem, o DualSense não.** O DualShock4
  tem `DS4_OUTPUT_HWCTL_BT_POLL_MASK 0x3F` e `DS4_BT_DEFAULT_POLL_INTERVAL_MS 4`
  num byte `hw_control`; o DualSense não tem campo equivalente nem função. **Por
  rádio o driver não pede taxa nenhuma ao DualSense.** — `:435-439`, `:2566-2570`
- **[4.22] Duas flags definidas e nunca usadas** (uma ocorrência cada, só o
  `#define`): `VALID_FLAG0_MIC_VOLUME_ENABLE` BIT(6) e
  `VALID_FLAG1_RELEASE_LEDS` BIT(3). O campo `mic_volume` existe na struct e
  nunca é escrito. — `:210`, `:215`

### O que muda entre cabo e rádio, e o que não muda

- **[4.23] Nada de comportamento, só de embalagem.** O `dualsense_output_worker`
  monta o MESMO payload de 47 B nos dois casos; só cabeçalho e CRC diferem, e só o
  bloco de roteamento de áudio fica de fora no rádio. **Rumble, lightbar, LEDs de
  jogador e mudo do microfone funcionam por rádio no driver.** — `:1448-1560`
- **[4.24] Status e bateria, iguais nos dois:** `status[0]` (índice 54 no rádio,
  53 no cabo) — nibble baixo capacidade, nibble alto carga (0x0 descarregando,
  0x1 carregando, 0x2 cheia, 0xa fora de faixa, 0xb erro de temperatura, 0xf erro
  de carga); capacidade = `min(dado*10 + 5, 100)`. `status[1]` traz HP_DETECT
  BIT(0) e MIC_DETECT BIT(1), **só lidos por cabo**. `status[2]` nunca é lido.
  `DS_STATUS1_MIC_MUTE` BIT(2) está definido e nunca é usado — o mudo vem da
  BORDA do botão em `buttons[2]` BIT(2). — `:175-180`, `:1724-1752`
- **[4.25] Sensores e toque, iguais, só deslocados:** acelerômetro 8192 unidades
  por g (faixa 4×8192); giroscópio 1024 unidades por grau/s (faixa 2048×1024);
  `sensor_timestamp` em unidades de 0,33 µs, dividido por 3, com tratamento de
  volta ao zero em `U32_MAX`. Touchpad 1920×1080, dois pontos, bit 7 do byte de
  contato = ponto INATIVO, X e Y de 12 bits. — `:192-231`, `:1669-1723`
- **[4.27] A cópia local não é vanilla.** Ela traz o módulo param `feature_retries`
  (default 0 = uma tentativa, igual ao vanilla) com backoff derivado do
  `REPORT_REQ_TIMEOUT` do BlueZ — 2×3000 ms, teto 4×3000 ms, dobrando; por USB o
  atraso é 100 ms. O comentário registra a medição: `hid_hw_raw_request` por BT vai
  para o uhid, que achata TODO erro do transporte em `-EIO`, e o que acontecia era o
  `hidp_report_req_timeout()` do bluetoothd (3 s) com dois DualSense subindo no
  mesmo adaptador com ~1 s de diferença. — `:24-60`, `:892-965`, `patch/BASELINE`

---

# F5 · SDL — `SDL_hidapi_ps5.c`

**O que é:** o driver PS5 do SDL, escrito pela Valve. É a base do HIDAPI que o
Steam usa — e por isso a fonte que mais diz sobre CONVIVÊNCIA.

**O que foi lido:** `src/joystick/hidapi/SDL_hidapi_ps5.c` no commit
`0c8feecce6e57a7a8c1b1eb06631e0a7a56fcd8f`, 1734 linhas, md5
`fda3c11389d8ac02268f35bfac29b8e9`, conferido contra o `main` de 31/08/2026.
Mais `SDL_hidapijoystick.c`, `SDL_crc32.c` e `SDL_hints.h`, no mesmo commit.

### Envelope e CRC

- **[5.1] Saída:** rádio 0x31, 78 B, payload em `offset = 3`; cabo 0x02, **48 B**,
  payload em `offset = 1`. — `:1099-1113`
- **[5.2] Cabeçalho:** `data[1] = 0x00` (comentário do SDL: *"Tag and sequence"*)
  e `data[2] = 0x10` (*"Magic value"*). **O SDL nunca incrementa o byte 1 em
  ponto nenhum do arquivo.** — `:1100-1102`
- **[5.3] Mapa do pacote de saída BT:** `Uint8 data[78]` zerado; [0]=0x31;
  [1]=0x00; [2]=0x10; [3..49] payload de 47 B; [50..73] zeros; [74..77] CRC. O 74
  vem de `report_size - sizeof(unCRC)`. O envio exige retorno exatamente 78. — `:1072`, `:1097-1142`
- **[5.4] / [5.5] CRC:** saída semente 0xA2 (*"hidp header is part of the CRC
  calculation"*) sobre os 74 primeiros bytes; entrada semente 0xA1 sobre `size-4`,
  lido em LE explícito. **Pacote 0x31 com CRC ruim é descartado e nem conta para
  `packet_count`.** O 0x01 do cabo não tem CRC e é aceito direto. — `:1115-1122`, `:1540-1608`
- **[5.6] O CRC do SDL é o CRC-32 padrão — verificado numericamente.**
  `SDL_crc32` começa em 0 e dobra a inversão inicial/final dentro de
  `crc32_for_byte` pelo `^ 0xFF000000`; polinômio refletido `0xEDB88320`. A
  função foi reimplementada em Python e comparada com `zlib.crc32` encadeado:
  batem. Exemplos rodados: 0xA2 + 74 B -> `0x4c17ba24`; 0xA1 + 74 B ->
  `0xe8e5c431`. O arquivo carrega o aviso *"DO NOT CHANGE THIS ALGORITHM"*. — `SDL_crc32.c:29-56`

### O payload de 47 bytes

- **[5.7] `DS5EffectsState_t`, campo a campo** (some 3 no rádio, 1 no cabo):
  0 ucEnableBits1 · 1 ucEnableBits2 · 2 ucRumbleRight · 3 ucRumbleLeft ·
  4 ucHeadphoneVolume · 5 ucSpeakerVolume · 6 ucMicrophoneVolume ·
  7 ucAudioEnableBits · 8 ucMicLightMode · 9 ucAudioMuteBits ·
  **10..20 rgucRightTriggerEffect[11]** · **21..31 rgucLeftTriggerEffect[11]** ·
  32..37 rgucUnknown1[6] · 38 ucEnableBits3 · 39..40 rgucUnknown2[2] ·
  41 ucLedAnim · 42 ucLedBrightness · 43 ucPadLights · 44/45/46 R/G/B. Bate byte a
  byte com a struct do kernel. — `:164-187`
- **[5.8] Só sete bits são escritos pelo SDL,** cada um com o comentário original:
  EnableBits1 |= 0x01 *"Enable rumble emulation"*; |= 0x02 *"Disable audio
  haptics"*; EnableBits2 |= 0x01 *"Enable microphone light"*; |= 0x04 *"Enable LED
  color"*; |= 0x08 *"Reset LED state"*; |= 0x10 *"Enable touchpad lights"*;
  EnableBits3 |= 0x04 *"Enable improved rumble emulation on 2.24 firmware and
  newer"*. Correspondem bit a bit aos `valid_flag0/1/2` do kernel. — `:191-197`
- **[5.10] O SDL NÃO monta gatilho adaptativo — e este é o achado negativo mais
  importante para quem for copiá-lo.** `rgucRightTriggerEffect` e
  `rgucLeftTriggerEffect` aparecem DUAS vezes no arquivo inteiro, e as duas são as
  declarações da struct. Ele também nunca escreve `ucHeadphoneVolume`,
  `ucSpeakerVolume`, `ucMicrophoneVolume`, `ucAudioEnableBits`, `ucLedAnim` nem
  `ucLedBrightness`. Gatilho só chega ao aparelho se a APLICAÇÃO montar o
  `DS5EffectsState_t` cru e mandar por `SDL_SendGamepadEffect`. **O que o SDL
  entrega de graça é o envelope 0x31 + CRC.** — `:176-177`, `:1149-1153`
- **[5.21] Coalescência:** antes de mandar, o SDL tenta ATUALIZAR um envio pendente
  com o mesmo `report_size` e os mesmos `ucEnableBits1`/`ucEnableBits2`, e não
  enfileira outro. **`ucEnableBits3` não entra na comparação.** — `:1124-1146`
- **[5.22] Cores e luzes por índice de jogador:** tabela de 7 cores que o SDL diz
  ser *"the same as what hid-sony.c uses"* — azul `{00,00,40}`, vermelho
  `{40,00,00}`, verde `{00,40,00}`, rosa `{20,00,20}`, laranja `{20,10,00}`, ciano
  `{00,10,10}`, branco `{10,10,10}`. `ucPadLights` sai de
  `{0x04,0x0A,0x15,0x1B,0x1F,0x11,0x0E}` com `| 0x20` — *"0x1F enables all lights,
  0x20 changes instantly instead of fade"*. Jogador negativo apaga tudo. — `:328-373`
- **[5.23] Luz do microfone:** `ucEnableBits2 |= 0x01` e `ucMicLightMode = 0`, com o
  comentário que dá a tabela inteira — *"0x00 = off, 0x01 = solid, 0x02 = pulse"*.
  **Na prática o SDL só usa o 0; os outros dois só existem no comentário.** — `:775-779`

### Rádio: o que só existe lá

- **[5.13] Um único booleano governa tudo:** `device->is_bluetooth`, atribuído de
  `info->bus_type` pela camada HIDAPI — **nunca do conteúdo do relatório**. Ele
  decide o ID de saída, se acrescenta CRC, se espera a animação de LED, a taxa de
  sensor declarada, o keepalive e o estado WIRELESS/WIRED. Achado negativo: o
  campo `ucConnectState` do pacote (offset 53, documentado como *"0x08 = USB,
  0x01 = headphone"*) é declarado e **nunca lido** — `grep -c` devolve 1. — `SDL_hidapijoystick.c:923`
- **[5.14] Um segundo teste, feito uma vez só:** lê um relatório com timeout de
  16 ms — `size == 64` -> cabo; `data[0] == 0x31` -> rádio avançado; qualquer outra
  coisa -> *"Bluetooth, using simple reports (DirectInput enabled)"*. **Não define
  `is_bluetooth`; define só se o aparelho já está em modo estendido.** — `:406-423`
- **[5.15] O que LIGA os relatórios estendidos por BT:** ler os feature reports
  0x09 (série / endereço de rádio) e 0x20 (firmware) — *"This will also enable
  enhanced reports over Bluetooth"*, diz o código nas duas ocorrências. O segundo
  caminho é mandar qualquer 0x31 válido. Feature reports usados: 0x03
  capacidades, 0x05 calibração, 0x09 série, 0x20 firmware. A série sai de
  `data[6]..data[1]` (byte invertido) e o firmware de `data[44] | data[45]<<8`. — `:64-70`, `:425-439`
- **[5.16] O modo estendido é bilhete só de ida.** `SDL_HINT_JOYSTICK_ENHANCED_REPORTS`:
  por cabo o SDL força sempre ON; por rádio obedece ao hint, cujo padrão é
  LIGADO. O cabeçalho documenta: *"Once enhanced reports are enabled, they can't
  be disabled on PlayStation controllers without power cycling the controller"* —
  e o caso OFF no código tem o comentário *"Nothing to do, enhanced mode is a
  one-way ticket"*. — `:891-938`, `SDL_hints.h:1423-1446`
- **[5.17] Keepalive de 500 ms, exclusivo do rádio.** Sem pacote por
  `BLUETOOTH_DISCONNECT_TIMEOUT_MS`, o SDL manda um 0x31 de 78 B com `[1] = 0x02`
  (*"Magic value"* — **diferente do 0x00 do pacote de efeitos**) e todo o resto
  zero, DE PROPÓSITO SEM CRC: *"This is just a dummy packet that should have no
  effect, since we don't set the CRC"*. Se o aparelho estiver em modo simples ele
  nem isso manda — **desconecta**, porque *"We can't even send an invalid effects
  packet, or it will put the controller in enhanced mode"*. — `:44`, `:814-836`, `:1650-1657`
- **[5.11] A cor do LED espera ~3,4 s no rádio.** Se `is_bluetooth &&
  enhanced_reports` e o efeito toca LED ou luzes do touchpad, o SDL **não manda
  nada** e marca `led_reset_state = Pending`. A cor só sai quando o timestamp de
  sensor alcança `connection_complete = 10200000` — que, na unidade de 0,33 µs que
  o próprio arquivo declara, dá ≈ 3,4 s de aparelho ligado. Aí ele manda primeiro
  um pacote só com 0x08 (*Reset LED state*) e depois o da cor. **Pelo cabo não há
  espera nenhuma.** — `:710-717`, `:784-812`
- **[5.12] Taxa de sensores:** 250 Hz por cabo, **1000 Hz por rádio** — comentário
  literal *"Bluetooth sensor update rate appears to be 1000 Hz"* (o hedge é do
  autor do SDL). Edge por cabo também 1000 Hz. Timestamp do relatório principal:
  32 bits em 0,33 µs; o alternativo (terceiros) usa 16 bits em 1 µs. O SDL acumula
  delta com tratamento de estouro. — `:850-864`, `:1360-1396`
- **[5.9] Rumble: dois caminhos e um corte de força.** Com `enhanced_rumble`, usa
  `ucEnableBits3 |= 0x04` e manda sem atenuação; sem ele usa `ucEnableBits1 |= 0x01`
  e **desloca 1 bit à direita** — *"Shift to reduce effective rumble strength to
  match Xbox controllers"*. Nos dois liga 0x02 (*Disable audio haptics*).
  `enhanced_rumble` liga se for Edge, **ou se `firmware_version == 0`** (*"Assume
  that it's updated firmware over Bluetooth"* — exatamente o cenário de rádio em
  modo simples), ou se `>= 0x0224`. — `:442-448`, `:721-746`
- **[5.20] O cabo derruba o rádio.** Se o aparelho veio por rádio e já existe um
  irmão por USB com o mesmo serial, o SDL registra mas **não conecta**; se veio por
  cabo, ele **desconecta ativamente** o mesmo aparelho no rádio. Quando o USB some,
  o rádio volta sozinho. **O casamento é sempre por número de série — que no
  DualSense é o endereço de rádio.** — `:575-583`, `:1658-1664`
- **[5.18] Entrada:** rádio = cabo + 1 (corpo em `&data[2]` contra `&data[1]`).
  Corpo idêntico nos dois: eixos 0..5, contador 6, botões 7..10, sequência 11..14,
  giro 15/17/19, acelerômetro 21/23/25, timestamp 27..30, temperatura 31, touchpad
  32..39, timer2 48..51, bateria 52, `ucConnectState` 53. Comentário da struct:
  *"There's more unknown data at the end, and a 32-bit CRC on Bluetooth"*. — `:104-133`, `:1617-1641`
- **[5.19] Bateria:** `status = (byte >> 4) & 0x0F`, `nível = byte & 0x0F`;
  0 descarregando, 1 carregando, 2 carregado; percentual `min(nível*10 + 5, 100)`.
  Igual em cabo e rádio; muda só o offset (52 no principal, 29 no alternativo). — `:1429-1500`

---

# F1 · `flok/pydualsense`

**O que é:** biblioteca Python de terceiro, muito copiada. É a fonte que dá o
mapa de saída mais explícito — e a que mais diverge do kernel.

**O que foi lido:** commit `01445f5ed6ba23ca83bc2893a2260d69122a73e9`
(29/05/2025), arquivos inteiros: `pydualsense.py` (996 linhas), `checksum.py`
(49), `enums.py` (57), `README.md`.

- **[1.1] / [1.2] / [1.3]** Saída: `OUTPUT_REPORT_BT = 0x31`, 78 B;
  `OUTPUT_REPORT_USB = 0x02`, **64 B**. O tamanho não é constante: ele vem do
  comprimento do primeiro report de ENTRADA lido. — `:35-36`, `:157-169`, `:511-513`
- **[1.4] Detecção de transporte por adivinhação.** Não há consulta a barramento
  nem a udev: `self.device.read(100)` e o comprimento decide — 64  USB, 78  BT,
  outro  `Exception("Couldn't determine connection type")`. Comentário do próprio
  autor: *"This way of determining is not pretty but it works.."*. — `:143-169`
- **[1.5] Saída por BT, índice a índice (a convenção +1):** [0]=0x31 · **[1]=0x02
  CONSTANTE** · [2]=0xFF flags · [3]=0x57 flags2 · [4] motor direito · [5] motor
  esquerdo · [6..9] áudio, não escritos · [10] LED do mic · [11] 0x10 se mudo ·
  [12] modo do gatilho DIREITO, [13..18] forces[0..5], [21] forces[6] · [23] modo
  do ESQUERDO, [24..29] forces, [32] forces[6] · [40] ledOption · [43]
  pulseOptions · [44] brilho · [45] jogador · [46/47/48] R/G/B · [49..73] zeros ·
  [74..77] CRC32 LE. — `:577-646`
- **[1.6] Saída por cabo, para comparar:** [0]=0x02 · [1]=0xFF · [2]=0x57 ·
  [3]/[4] motores · [9] LED do mic · [10] mudo · [11] gatilho direito ·
  [22] esquerdo · [39] ledOption · [43] brilho · [44] jogador · [45..47] RGB.
  **Sem CRC.** — `:515-575`
- **[1.7] O deslocamento cabo->rádio, pela conta desta fonte, é +1 em TODOS os
  campos,** e o byte extra é o índice 1 preenchido com a constante 0x02 — nunca
  com um contador. — `:515-575` vs `:577-639`
- **[1.8] / [1.9] CRC verificado numericamente.** `compute()` parte de
  `0xEADA2D49` e roda um laço de tabela **cravado em `range(74)`**. Duas
  identidades comprovadas rodando o módulo: `0xEADA2D49 == zlib.crc32(b'\xA2')` e
  `compute(buf) == zlib.crc32(b'\xA2' + bytes(buf[:74]))` em 5 amostras
  aleatórias. Gravado LE em [74..77]. Pela indentação, **o ramo do CABO não
  calcula nem grava CRC nenhum**. — `checksum.py:6-49`, `pydualsense.py:641-646`
- **[1.10] O kernel faz a MESMA conta,** com `PS_OUTPUT_CRC32_SEED = 0xA2` sobre
  `report->len - 4` = os mesmos 74 bytes. **As duas fontes concordam no CRC.** — `hid-playstation.c:1434-1443`
- **[1.11] Escrita:** `self.device.write(bytes(outReport))` — buffer cru, o report
  ID já no índice 0. O laço de vida é uma thread que lê e escreve a cada volta,
  **sem espera nem taxa fixa**, e morre em IOError marcando `connected = False`. — `:495-502`, `:252-272`
- **[1.12] Na ENTRADA ele descarta o primeiro byte quando é BT,** com o comentário
  *"the reports for BT and USB are structured the same, but there is one more byte
  at the start of the bluetooth report"*. Isso vale para a entrada; o +1 da saída é
  outro assunto, e ali ele diverge do driver. — `:284-287`
- **[1.13] Armadilha do enum:** `ConnectionType.BT = 0x0`. **`if self.conType:` é
  FALSO para rádio.** — `enums.py:4-7`
- **[1.14] O README não fala de Bluetooth.** Lido inteiro: nenhuma linha sobre BT,
  CRC, 0x31, offsets ou tamanho. A única menção a transporte é baixar a DLL do
  hidapi no Windows. **Se um mapa registrar estas linhas como "extraído da prosa"
  do pydualsense, essa prosa não existe** — os fatos estão só no código. — `README.md:12,69`
- **[1.15] Corroboração cruzada de um byte:** o `outReport[10] = 0x10` do cabo
  (BT: [11]) cai no `power_save_control` do driver, cujo BIT(4) é
  `MIC_MUTE`. As duas fontes concordam nesse byte, apesar de o pydualsense não
  lhe dar nome. — `hid-playstation.c:222`, `:1546`

---

# F2 · `Ohjurot/DualSense-Windows`

**O que é:** biblioteca C++ para Windows. É a fonte mais detalhada sobre a
ENTRADA e sobre os modos ESTENDIDOS de gatilho adaptativo.

**O que foi lido:** branch `main`, commit-tree
`a78fbab1fbc021115f37d297f4eb3bf393d633d6`, via `raw.githubusercontent.com`.

- **[2.1] / [2.2] Entrada:** BT 0x31, 78 B, parser chamado com `&hidBuffer[2]`;
  cabo 0x01, 64 B, `&hidBuffer[1]`. O mesmo parser serve aos dois, sem nenhum
  campo trocado de lugar. **O kernel faz exatamente o mesmo — as duas fontes
  concordam no +1 da entrada.** — `IO.cpp:276-305`
- **[2.3] Sticks e gatilhos** (payload = absoluto BT − 2): leftStick 0x00/0x01,
  rightStick 0x02/0x03, leftTrigger 0x04, rightTrigger 0x05. O payload 0x06 é
  pulado pelo DS5W — **é o `seq_number`, que só o kernel nomeia**. — `DS5_Input.cpp:5-12`
- **[2.4] Botões e dpad:** payload 0x07 = nibble alto quadrado 0x10 / X 0x20 /
  bola 0x40 / triângulo 0x80, nibble baixo HAT (0=cima, 2=direita, 4=baixo,
  6=esquerda, diagonais ímpares). 0x08 = L1 0x01, R1 0x02, L2 0x04, R2 0x08,
  Create 0x10, Options 0x20, L3 0x40, R3 0x80. 0x09 = PS 0x01, touchpad 0x02,
  microfone 0x04. **Idênticos aos `DS_BUTTONS0/1/2`.** — `DS5_Input.cpp:15-53`
- **[2.6] Touchpad:** dois pontos de 4 B, payload 0x20 e 0x24. Lendo como u32 LE:
  id = bits 0..6; **encostado = bit 7 ZERADO**; x = `(raw>>8)&0xFFF`; y = `raw>>20`.
  O kernel descreve o mesmo por campos de bits. Concordam. — `DS5_Input.cpp:62-73`
- **[2.7] Retorno de força dos gatilhos** — e aqui o DS5W afirma MAIS que o
  kernel: `leftTriggerFeedback` em payload 0x2A e `rightTriggerFeedback` em 0x29 —
  **o DIREITO vem ANTES**. Um byte cada. Caem dentro do `reserved3[12]` do kernel,
  que não os nomeia. **Não há contraprova.** — `DS5_Input.cpp:79-80`
- **[2.9] O DS5W NÃO confere o CRC de entrada.** Lê os 78 B e chama o parser sem
  tocar nos 4 últimos. O kernel confere e descarta com `-EILSEQ`. **Quem
  implementar entrada por rádio a partir do DS5W herda essa lacuna.** — `IO.cpp:299-305`
- **[2.10] Saída por BT:** `[0]=0x31`, `[1]=0x02` fixo, payload em `[2]` — a
  convenção +1. — `IO.cpp:337-358`
- **[2.11] CRC verificado numericamente:** semente `0xeada2d49`, 74 primeiros
  bytes, gravado LE em 0x4A..0x4D. Conferido em Python: `0xeada2d49 ==
  zlib.crc32(b'\xA2')`, `table[i] == zlib.crc32(bytes([i]))`, e `compute(buf,n)`
  = `zlib.crc32(b'\xA2' + buf[:n])` para n = 1, 10 e 74. **Concorda com o
  kernel.** — `DS_CRC32.cpp:40-54`
- **[2.12] Payload de saída (o mesmo por cabo e BT):** 0x00 valid_flag0 (escrito
  0xFF) · 0x01 valid_flag1 (0xF7) · 0x02 rumble DIREITO · 0x03 ESQUERDO · 0x08 LED
  do mic · **0x0A gatilho DIREITO · 0x15 ESQUERDO** · 0x26 valid_flag2 (0x03) ·
  0x29 lightbar_setup · 0x2A brilho · 0x2B bitmask dos LEDs · 0x2C/2D/2E R/G/B.
  Batem um a um com a struct de 47 B do kernel. — `DS5_Output.cpp:5-36`
- **[2.13] LEDs de jogador, com as duas polaridades invertidas:** bitmask em 0x2B
  (esquerdo 0x01 … direito 0x10). **O bit 0x20 do mesmo byte é o "fade", e o DS5W
  LIGA 0x20 quando NÃO quer fade.** Brilho em 0x2A com ALTO=0x00, MÉDIO=0x01,
  BAIXO=0x02 — também invertido em relação à intuição. O 0x26 é fixado em 0x03
  para que os LEDs sejam aceitos. — `DS5_Output.cpp:16-27`, `DS5State.h:34-38`
- **[2.16] Modos estendidos de gatilho — o que nenhum driver tem.** Duas regiões
  no payload, DIREITO em 0x0A e ESQUERDO em 0x15, pelo menos 10 bytes cada.
  Modos no primeiro byte: **0x00** sem resistência (zera os dois seguintes);
  **0x01** resistência contínua, [+1] posição inicial, [+2] força; **0x02**
  resistência por seção, mesmos parâmetros; **0x26** (= 0x02|0x04|0x20) efeito
  estendido, com [+1] = `0xFF - posição inicial`, [+2] = 0x02 se "manter efeito",
  [+4]/[+5]/[+6] = força inicial/meio/fim, [+9] = `max(1, frequência/2)`;
  **0xFC** calibrar. Tudo isso cai no `reserved2[27]` do kernel. — `DS5_Output.cpp:39-98`
- **[2.15] LED do microfone:** payload 0x08, OFF=0x00, ON=0x01, PULSE=0x02.
  Corresponde ao `mute_button_led` do kernel, no mesmo offset. — `DS5State.h:120-136`
- **[2.17] Identificação:** VID 0x054C, PID 0x0CE6; transporte decidido pelo
  comprimento do report declarado no descritor (64 = cabo, 78 = BT). — `IO.cpp:91-129`
- **[2.18] `Paliverse/DualSenseX` não serve de fonte** — foi aberto e descartado.
  O repositório responde 200 mas é vitrine de aplicativo fechado: README, imagens,
  traduções, um `.bat`, um zip de instalador e um `DualSenseX.cs` de 333 linhas que
  está **quebrado** — abre `namespace DualSenseX { class DualSenseX {` e cola o
  texto do README em Markdown dentro da classe. Zero offsets. — `DualSenseX.cs:1-60`

---

# F7 · `dualshock-tools.github.io`

**O que é:** a ferramenta web de calibração de DualSense. **Ela RECUSA
Bluetooth** — e por isso não tem uma linha sobre rádio. Em compensação, é a
única fonte lida que conhece os canais de comando 0x80/0x81/0x82/0x83, a NVS e a
calibração de fábrica. **É a fonte com mais conteúdo inédito e menos uso.**

**O que foi lido:** commit `58004b10b7b017a152d06b637738cc6ed83b3a92` ("Bump to
v2.34", 29/08/2026); principal `js/controllers/ds5-controller.js` (906 linhas),
mais `base-controller.js`, `controller-manager.js`, `core.js`, `utils.js`,
`vr2-controller.js`, `finetune-modal.js`, `calib-center-modal.js`,
`quick-test/imu-test.js`.

### O que ela NÃO sabe, e é honesto registrar

- **[7.1]** `BT_REPORT_ID: 0x31` existe como constante e **nunca é usada**. O
  único envio é `sendReport(0x02, ...)`. Não há em lugar nenhum do repositório
  byte de sequência, tag, CRC32, semente ou montagem de 78 bytes. — `:58-61`, `:588-598`
- **[7.2]** Na conexão ela mede o primeiro report e desiste se não for 63 bytes:
  *"The device is connected via Bluetooth. Disconnect and reconnect using a USB
  cable instead."* 63 = os 64 do 0x01 menos o ReportID que a WebHID não entrega;
  um DS5 por rádio entregaria 77. **Todos os offsets desta fonte são de CABO.** — `core.js:221-227`
- **[7.24]** A única frase sobre BT no repositório é um comentário no controlador
  do **VR2 Sense**: *"that gist documents Bluetooth packets, which carry the 0x31
  report ID plus one extra byte; USB via WebHID drops both"*. Corrobora o +1 de
  entrada, mas é sobre outro aparelho e é comentário, não código. — `vr2-controller.js:16-22`

### O canal de comando 0x80/0x81 — só esta fonte tem

- **[7.11] Gramática:** escreve-se feature 0x80 com `[base, num, ...]` e lê-se
  0x81; a resposta é validada por `byte1==base`, `byte2==num`, `byte3==2`, e **a
  carga começa no offset 4**. Comandos vistos: `[1,1]` reset do controle;
  `[3,1]` **travar NVS**; `[3,2,101,50,64,12]` **destravar NVS** (a chave, em hex:
  `0x65,0x32,0x40,0x0C`); `[3,3]` consultar estado da NVS; `[9,2]` endereço de
  rádio (6 bytes a partir do offset 4, **em ordem invertida**); `[12,2]` ler os 12
  valores de calibração em memória; `[12,1]` + 24 bytes gravar de volta. — `:376-422`, `:527-582`
- **[7.13] Estado da NVS** — u32 BIG-endian a partir do offset 1 da resposta a
  `[3,3]`: `0x15010100` esperando reinício; `0x03030201` travada, modo
  "temporário"; `0x03030200` destravada, modo "permanente". **Sem isso não se sabe
  se uma gravação vai pegar.** — `:527-548`
- **[7.12] Dados de fábrica por `(base, num, tamanho)`:** número de série
  `(1,19,17)` ASCII; MCU Unique ID `(1,9,9)` hex; PCBA ID `(1,17,14)` ASCII
  invertido; código de barras da bateria `(1,24,23)`; VCM esquerdo `(1,26,16)` e
  direito `(1,28,16)`; ID do touchpad `(5,2,8)`; firmware do touchpad `(5,4,8)`. — `:281-283`, `:314-340`
- **[7.14] Calibração de analógico pelo canal 0x82/0x83, com as respostas
  exatas.** CENTRO: início `0x82 [1,1,1]` -> resposta `0x83` começando com u32 BE
  `0x83010101`; amostra `0x82 [3,1,1]`, mesma resposta (5 amostras com 100 ms no
  modo automático, ou 3 passos manuais); gravação `0x82 [2,1,1]` -> `0x83010102`.
  AMPLITUDE: início `0x82 [1,1,2]` -> `0x83010201`; gravação `0x82 [2,1,2]` ->
  `0x83010202`. Depois de calibrar, a gravação definitiva é `nvsUnlock` seguido de
  `nvsLock`. — `:424-525`
- **[7.15] Os 12 valores de "finetune", na ordem em que se grava de volta:**
  `LL, LT, RL, RT, LR, LB, RR, RB, LX, LY, RX, RY` — quatro extremos do analógico
  esquerdo, quatro do direito, e depois centro X/Y de cada um. u16 LE a partir do
  offset 4 da resposta a `[12,2]`; validação `cmd==129, p1==12, p2 ∈ {2,4},
  p3==2`; máximo 65535. **O DS5 Edge usa `[12,4]`.** — `:565-582`
- **[7.10] Três canais de feature, e dois só existem aqui:** 0x20 de leitura
  (64 B: data de build ASCII em 1..11, hora 12..19, fwtype u16 em 20, swseries em
  22, hwinfo u32 em 24, fwversion u32 em 28, updversion u16 em 44, e três versões
  u32 em 48/52/56 — SBL, Venom, Spider); o par **0x80/0x81**; o par **0x82/0x83**.
  Do driver desta casa só existem 0x05, 0x09 e 0x20. — `:289-341`
- **[7.21] Modelo de placa a partir do `hwinfo`:** `(hw >> 8) & 0xff` -> 0x03
  BDM-010, 0x04 BDM-020, 0x05 BDM-030, 0x06 BDM-040, 0x07 e 0x08 BDM-050, 0x09
  BDM-060R, 0x11 BDM-060M, 0x13 BDM-060X. O próprio código marca 0x10 e 0x12 como
  TODO. — `:550-563`
- **[7.20] Cor do plástico:** `ds5_color()` toma os caracteres 5 e 6 do número de
  série e consulta **28 códigos** — '00' White … '15' HyperPop Rhythm Blue, '30'
  30th Anniversary, e as edições 'Z1' God of War Ragnarök … 'ZF' 007 First Light.
  **O mesmo número que esta casa já registra.** — `:197-234`

### Saída, gatilho, áudio, IMU

- **[7.6] O bloco comum de 47 bytes, e o que esta fonte ACRESCENTA:**
  0 validFlag0 · 1 validFlag1 · 2 vibração direita · 3 esquerda · 4 volume do fone
  · 5 alto-falante · 6 mic · 7 audioControl · 8 LED do mudo · 9 zero ·
  **10 modo do gatilho DIREITO + 11/12/13 param0/1/2 (14-20 zerados) · 21 modo do
  ESQUERDO + 22/23/24 param (25-31 zerados)** · 32-42 zerados · 43 LEDs de jogador
  · 44/45/46 R/G/B. **O ganho real é a faixa 10-31**, que o driver marca como
  `reserved2[27]`. — `:91-195`
- **[7.7] Modos e presets de gatilho:** `{OFF: 0x00, RESISTANCE: 0x01, TRIGGER:
  0x02, AUTO_TRIGGER: 0x06}`. Presets em (start, end, force): off (0,0,0);
  light (10,80,150); medium (15,100,200); heavy (20,120,255) — todos em modo
  'single' = TRIGGER 0x02; 'auto' = 0x06. O bit que autoriza a escrita é
  validFlag0 bit2 (esquerdo) / bit3 (direito), e **o código LIMPA esses bits logo
  depois de enviar**. — `:50-55`, `:648-683`
- **[7.8] validFlag0/1/2 como esta fonte os nomeia:** flag0 0x01 RIGHT_VIBRATION,
  0x02 LEFT_VIBRATION, 0x04 LEFT_TRIGGER, 0x08 RIGHT_TRIGGER, 0x10
  HEADPHONE_VOLUME, 0x20 SPEAKER_VOLUME, 0x40 MIC_VOLUME, 0x80 AUDIO_CONTROL;
  flag1 0x01 MUTE_LED, 0x02 POWER_SAVE_MUTE, 0x04 LIGHTBAR_COLOR, 0x10
  PLAYER_INDICATOR, 0x20 LED_BRIGHTNESS, 0x40 LIGHTBAR_SETUP; flag2 0x01
  LED_BRIGHTNESS, 0x02 LIGHTBAR_SETUP. **Bate com o driver em flag0 bits 5/6/7,
  flag1 bits 0/1/2/4 e flag2 bit 1; diverge no resto.** — `:63-88`
- **[7.22] Áudio — a SEQUÊNCIA importa.** Para tocar um tom ela escreve primeiro
  no bloco de saída `speakerVolume=85`, `headphoneVolume=55` com `validFlag0 =
  HEADPHONE|SPEAKER|AUDIO_CONTROL`, **e só então** manda os feature reports: fone
  = `0x80 [6,4,0,0,0,0,4,0,6]` seguido de `0x80 [6,2,1,1,0]`; alto-falante =
  `0x80 [6,4,0,0,8]` seguido do mesmo; parar = `0x80 [6,2,0,1,0]` e volume 0. As
  FAIXAS (fone 0x00-0x7f, alto-falante 0x00-0xff, mic 0x00-0x40) vêm do driver. — `:714-769`
- **[7.23] Estado inicial que ela impõe ao conectar:** um bloco com
  `validFlag1 = 0b1111_0111` (todos menos o bit 3) e barra AZUL (0,0,255), como
  "estado conhecido". LED do mudo aceita 0/1/2; LEDs de jogador são 5 bits (0-31);
  vibração 0-255 por motor. — `:621-643`, `:836-852`
- **[7.16] / [7.17] IMU:** ela **não lê calibração nenhuma** — divide o cru por
  constantes que o próprio comentário chama de nominais: `GYRO 14.31 LSB/dps` e
  `ACCEL 8192 LSB/g`; giroscópio PRIMEIRO (imuOffset +0/2/4), acelerômetro depois
  (+6/8/10). A tela rotula giro como X=Pitch, Y=Yaw, Z=Roll e zera o viés **por
  software** após 50 amostras quietas. Para o acelerômetro: com o controle deitado,
  o eixo Y aponta para cima e lê ~+1 g, X e Z perto de 0, soma vetorial ~1,00 g. — `controller-manager.js:705-726`, `imu-test.js:10-108`
- **[7.3] / [7.18] / [7.19] Entrada, touchpad e bateria** batem byte a byte com a
  struct do driver: `{dpadByte: 7, l2AnalogByte: 4, r2AnalogByte: 5, imuOffset: 15,
  touchpadOffset: 32}`, bateria no byte 52 dividida em nibbles com a conta
  `min(carga*10+5, 100)`. **Duas réguas independentes concordando.** — `:40-47`, `:861-903`

---

# F8 · `nsfm/dualsense-ts` + `TechAntohere/Senshi`

**O que é:** uma biblioteca TypeScript e um aplicativo Android. **O Senshi é a
única fonte lida que fala os reports de ÁUDIO e HÁPTICO por rádio.**

**O que foi lido:** `dualsense-ts` commit
`6922a0e84e4c2dde6a5555e34e4e2b7300750f83` (25/08/2026) e `Senshi` commit
`1de83a58f5ea29d12d06c2a38d4d7641090d49ff` (15/06/2026), pelo conteúdo bruto
dos arquivos, com o `hid-playstation.c` do disco como âncora.

- **[8.1] / [8.2] / [8.3] / [8.4] / [8.5] / [8.6] / [8.7] Entrada 0x31 confirmada
  em três fontes,** e os offsets são os do kernel. O 0x01 por rádio é MÍNIMO — só
  analógicos, gatilhos e botões, sem giro, sem acelerômetro, sem touchpad. Y é
  invertido na leitura pelo `dualsense-ts`. Byte 55: bit0 fone, bit1 mic (jack),
  bit2 mic MUDO, **bit3 e bit4 dados/energia USB (leitura só do Senshi)**; byte 56
  bit1 = filtro passa-baixa do háptico (só Senshi). — `hid_provider.ts:315-372`
- **[8.8] O byte 1 da entrada 0x31 tem nome numa fonte só:** o Senshi lê
  `report[1]` como `sequenceTag` e o exibe na tela de diagnóstico. O kernel pula
  esse byte e não o nomeia; o `dualsense-ts` nem toca nele. — `DualSenseInfoParser.kt:112,167`
- **[8.9] O rádio começa MUDO de sensores, e o feature 0x05 é o que destrava o
  0x31.** O `dualsense-ts` registra isso em comentário; o kernel de fato lê o 0x05
  no probe. **Consequência prática: se outro processo (Steam, o navegador pela
  Gamepad API) já leu o 0x05, o 0x31 já está ligado.** — `hid_provider.ts:304-310`
- **[8.11] CRC: os três algoritmos são o MESMO, conferido numericamente.** Kernel:
  `crc32_le(0xFFFFFFFF,[0xA2],1)` + `~crc32_le(...)`. Os dois userspace: tabela de
  256 com semente `0xEADA2D49` e sem inversão final. Rodados em Python sobre **200
  buffers aleatórios** de 74, 138, 330, 394 e 543 bytes: idênticos. E
  `0xEADA2D49 == crc32(b'\xa2')`. — `bt_checksum.ts:4-57`, `DualSenseBtCrc.kt:7-18`
- **[8.12] / [8.13] `seq_tag` e `tag`:** o Senshi implementa o incremento
  (`((outputSeqTag and 0x0F) shl 4) or (flagsNibble and 0x0F)`) e crava 0x10 no
  byte 2 no caminho que embrulha um report de cabo; o `dualsense-ts` crava 0x02
  fixo no byte 1 e não tem o byte 2. — `DualSenseBtReportBuilder.kt:1377-1434`
- **[8.15] O modo "desligado" do gatilho é 0x05, não 0x00.** O Senshi registra
  que com 0x00 *"em alguns firmwares o gatilho fica parcialmente acionado"*. O
  DIREITO ocupa 11 bytes e vem ANTES do esquerdo; o Senshi reserva 22 bytes
  contíguos (`TRIGGER_STATE_LENGTH = 22`) e copia 10 em cada slot. — `command.ts:132-155`, `DualSenseBtReportBuilder.kt:33-38`
- **[8.16] Os mesmos bits, três vocabulários.** O `dualsense-ts` nomeia
  valid_flag0 como escopo A (0x01 háptico, 0x02 rumble primário, **0x04 gatilho
  direito, 0x08 gatilho esquerdo**, 0x10/0x20/0x40 volumes, 0x80 flags de áudio) e
  valid_flag1 como escopo B (0x01 LED do mic, 0x02 power save, 0x04 LEDs do
  touchpad, 0x08 desliga LEDs, 0x10 LEDs de jogador, **0x40 potência do motor**,
  0x80 áudio 2). **Os bits 2 e 3 do flag0 e o 0x40 do flag1 só aparecem nele.** — `command.ts:82-101`
- **[8.17] `power_save_control` — sete bits que uma fonte só afirma.** O kernel só
  nomeia o bit 4 (MIC_MUTE). O `dualsense-ts` declara o byte inteiro: 0x01 desliga
  touch, 0x02 desliga movimento, 0x04 desliga hápticos, 0x08 desliga áudio, 0x10
  muta microfone, 0x20 muta alto-falante, 0x40 muta fone, 0x80 muta hápticos.
  **Só o 0x10 tem confirmação cruzada.** — `command.ts:70-80`
- **[8.18] `audio_control` decomposto — também uma fonte só.** Bits 0-3 fonte do
  microfone (0x01 interno, 0x02 headset, 0x04 cancelamento de eco, 0x08 de ruído);
  bits 4-5 roteamento (0x00 estéreo no fone, 0x10 mono no fone, 0x20 esquerdo no
  fone e direito no alto-falante, **0x30 só alto-falante**); bits 6-7 modo do
  microfone (0x00 padrão, 0x40 chat, 0x80 ASR). O Senshi trata 0x30 como rota do
  alto-falante e usa 0x05 como modo padrão — coerente. **O kernel não decompõe
  esse byte.** — `command.ts:34-68`
- **[8.19] Quatro reports de saída por rádio ALÉM do 0x31 -> uma virou CÉLULA.**
  **0x32** com 142 B (CRC em 138..141), **0x35** com 334 (CRC em 330..333),
  **0x36** com 398 (CRC em 394..397) e **0x39** com 547 (CRC em 543..546). Todos
  com `[0]` id, `[1]` seq tag e CRC32 nos 4 últimos pela MESMA função. O 0x36
  carrega, num pacote só: controller-data no offset 2, config de áudio no 67,
  200 B de quadro Opus no 78 e 116 B de cauda de háptico no 278. O háptico
  empacotado tem **64 B por quadro (32 amostras estéreo, 3000 Hz, período de
  10,666 ms)**. -> `audio.alto_falante@dualsense` / `radio_offset` — `DualSenseBtReportBuilder.kt:50-75`, `DualSenseBtAudioHapticsBuilder.kt:11-17`
- **[8.20] O subpacote de controller-data do Senshi** (dentro do 0x32 e do 0x36),
  a partir do offset 2: +0 `0x90` · +1 `0x3F` · +2 `0xFD` · +3 `0xF7` · +6 volume
  do fone · +7 do alto-falante · +8 `0xFF` · +9 `0x09` · +10 LED do mic · +11
  `0x0F` · +12..+22 gatilho direito · +23..+33 esquerdo · +39 beamforming
  (`0x08 | valor`) · +40 `0x07` · +43 lightbar_setup · +44 brilho · +45 máscara
  de LEDs · +46/47/48 R/G/B. Ele zera 117 bytes antes de escrever. — `:1519-1564`
- **[8.21] Máscara de LEDs de jogador — o Senshi NORMALIZA.** Ele tem uma lista
  fechada de 17 máscaras aceitas (0x02, 0x04, 0x05, 0x0A, 0x0B, 0x14, 0x15, 0x1B,
  0x21, 0x22, 0x24, 0x25, 0x2A, 0x2B, 0x34, 0x35, 0x3B) e força `or 0x20` em
  qualquer outra. O `dualsense-ts` só mascara com 0x1F. Os canônicos dele (4, 10,
  21, 27, 31) estão dentro da lista do Senshi. — `:61-73`
- **[8.23] CRC de feature: dois prefixos, e são DIREÇÕES diferentes.** O kernel
  verifica o que LÊ com 0xA3; o `dualsense-ts` define um CRC de feature com
  prefixo **0x53 seguido do report id** — 0x53 é o cabeçalho `SET_REPORT` do
  HIDP, isto é, a direção de ESCRITA. **Nenhuma das duas fontes cobre as duas
  direções.** — `bt_checksum.ts:72-96`
- **[8.22] Feature reports usados por rádio:** 0x05 calibração (41 B), 0x09
  pareamento (20 B, de onde sai o MAC), 0x20 firmware (64 B), e o par **0x80/0x81
  como comando de teste do DSP** no `dualsense-ts` — formato
  `[reportId, deviceId, actionId, ...params]`, com deviceId 0x06 = áudio,
  action 0x04 = configurar rota, action 0x02 = tocar/parar forma de onda. — `dualsense_hid.ts:522-649`
- **[8.24] O byte 0 vai no fio nas duas bibliotecas** — conferido de propósito
  para não errar a contagem: no `dualsense-ts` o node-hid recebe o array inteiro e
  o WebHID separa `data[0]` como reportId; no Senshi o `ByteArray` inteiro vai por
  reflexão à `BluetoothHidHost`. **Todos os índices citados são absolutos, com o id
  como 0.** — `node_hid_provider.ts:151-155`, `DualSenseBtHidBridge.kt:542`

---

# F3 · `ValveSoftware/steam-devices` (+ SDL)

**O que é:** as regras udev que a Valve publica. **O cliente Steam é fechado —
nada sobre o comportamento dele é verificável em código.** O que existe de
auditável são (a) essas regras e (b) o driver PS5 do SDL, escrito pela Valve.
Onde o SDL não prova o Steam, o dossiê diz.

**O que foi lido:** `60-steam-input.rules` (master) e o `SDL_hidapi_ps5.c`, com o
`hid-playstation.c` do disco como contraprova.

- **[3.1] Duas gramáticas no mesmo arquivo.** Cabo: `KERNEL=="hidraw*",
  ATTRS{idVendor}=="054c", ATTRS{idProduct}=="0ce6"` (e `0df2` para o Edge).
  Rádio: `KERNEL=="hidraw*", KERNELS=="*054C:0CE6*"` (e `*054C:0DF2*`) — casa o
  NOME do nó, que codifica BARRAMENTO:VID:PID. **Repare no caso das letras:
  minúsculo no atributo USB, MAIÚSCULO no nome de kernel.** Todas terminam em
  `MODE="0660", TAG+="uaccess"`. — `:41-50`
- **[3.2] A regra de rádio da Valve NÃO ancora o barramento — e alcança o nosso
  vpad.** O glob `*054C:0DF2*` casa `0005:054C:0DF2.*` (BT) **e também
  `0003:054C:0DF2.*`**, que é o nome do nó do DualSense Edge VIRTUAL que o nosso
  daemon cria por UHID. Isto é: **o pacote steam-devices, instalado, dá `uaccess`
  ao nosso vpad sem saber que ele existe** — e confirma em código o comentário que
  já está em `assets/70-ps5-controller.rules:16`. Contraste: para os aparelhos
  DELA a Valve ancora — `KERNELS=="000[356]:28DE:*"`. — `:47`, `:11`
- **[3.3] O Steam pede `/dev/uinput` no udev:** `KERNEL=="uinput",
  SUBSYSTEM=="misc", TAG+="uaccess", OPTIONS+="static_node=uinput"`. É a única
  regra do arquivo que não é sobre um aparelho — é como ele fabrica o pad virtual.
  A nossa `71-uinput.rules` faz o mesmo e ainda acrescenta `GROUP="hefesto"`. — `:5`
- **[3.4] O repositório tem três arquivos e nenhum README.** A API do GitHub lista
  `60-steam-input.rules`, `60-steam-vr.rules` e `LICENSE`; o `README.md` devolve
  404. A descrição do repo é a única prosa da Valve. **Não existe documento de
  instalação publicado por ela — quem instala é a distribuição.**
- **[3.5] / [3.6] Duas réguas de transporte, e nenhuma errada.** O SDL abre, lê UM
  relatório e decide entre três estados (cabo / rádio-avançado / rádio-simples). O
  kernel decide por `hdev->bus`, e o comentário dele explica o desenho da Sony:
  *"DualSense in USB uses the full HID report for reportID 1, but Bluetooth uses a
  minimal HID report for reportID 1 and reports the full report using reportID 49."* — `SDL:416-423`, `kernel:1575-1595`
- **[3.16] O que o Steam liga por controle:** para VID Sony ele **não pergunta
  nada** — assume `sensors/lightbar/vibration/playerled/touchpad` todos suportados.
  Só para terceiros lê o feature 0x03 (Capabilities). Nada disso é condicionado a
  transporte. Interruptores públicos: `SDL_HINT_JOYSTICK_HIDAPI_PS5` (liga/desliga
  o driver inteiro) e `SDL_HINT_JOYSTICK_HIDAPI_PS5_PLAYER_LED` (padrão true). — `:451-459`, `:985`, `:1005`

Os achados [3.7]–[3.15] repetem, com endereço próprio, o que F4 e F5 já provam:
envelope 0x31/0x02, as três sementes de CRC, o `tag` 0x10, o keepalive de 500 ms,
a trava de LED, os 1000 Hz do rádio, o `enhanced_rumble` por firmware e a
preferência pelo cabo casada por número de série.

---

# F6 · `hid-nintendo` + engenharia reversa do Switch

**O que é:** o driver do Pro Controller (cópia DKMS desta árvore, 3303 linhas =
vanilla v7.0.11 + os 4 patches da casa) cruzado com
`dekuNukem/Nintendo_Switch_Reverse_Engineering` (`bluetooth_hid_notes.md`,
`bluetooth_hid_subcommands_notes.md`, `USB-HID-Notes.md`, `imu_sensor_notes.md`,
`rumble_data_table.md`). **É a fonte que mais virou célula: 5 das 13.**

- **[6.27] Procedência:** os defines de protocolo, os offsets, o rumble e a IMU são
  **upstream**. Tudo que é opt-in por module param (`usb_cmd_pad_to_report`,
  `usb_send_conn_status`, `usb_probe_degrade`, `skip_tx_on_rate_exceeded`,
  `register_leds_on_set_failure`, `bt_probe_retries`, `subcmd_silence_streak_max`)
  é remendo da casa, com default idêntico ao upstream. — `assets/dkms/hid-nintendo/README.md:12-22`

### Reports

- **[6.1] Cinco IDs de entrada declarados, três aceitos.** `JC_INPUT_BUTTON_EVENT`
  0x3F, `SUBCMD_REPLY` 0x21, `IMU_DATA` 0x30, `MCU_DATA` 0x31, `USB_RESPONSE` 0x81
  — mas `joycon_ctlr_read_handler()` só aceita 0x21, 0x30 e 0x31 (e exige
  `size >= 12`). **O 0x3F aparece UMA vez no arquivo inteiro: a linha do
  `#define`. O driver nunca lê o report simples.** — `:152-156`, `:2993-2999`
- **[6.2] O 0x3F, pelo doc externo:** [0] id · [1-2] botões · [3] hat (7,6,5 /
  0,8,4 / 1,2,3 com o controle deitado; 8 = centro) · [4-11] recheio no Joy-Con,
  analógico no Pro. *"pushed to the host when a button is pressed or released"* —
  por evento, não por período. — `bluetooth_hid_notes.md`
- **[6.3] O 0x30 completo -> CÉLULA (duas).** Struct `__packed`, idêntica ao doc:
  [0] id · [1] timer · **[2] `bat_con`** · [3-5] `button_status[3]` ·
  **[6-8] left_stick · [9-11] right_stick** · [12] `vibrator_report` · [13..] união
  (no 0x21 a resposta de subcomando; no 0x30/0x31, 36 bytes = 3 amostras de IMU de
  12 B). **Não há byte de sequência extra nem CRC por rádio — ao contrário do
  DualSense, o envelope do Pro é o MESMO nos dois barramentos.**
  -> `entrada.stick@sn30` / `radio_offset` e `energia.bateria.degraus@sn30` /
  `radio_offset` — `:603-618`
- **[6.4] `bat_con` pelo doc:** nibble alto = bateria (8 cheia, 6 média, 4 baixa,
  2 crítica, 0 vazia), com o LSB desse nibble = carregando; nibble baixo =
  conexão, `(con_info >> 1) & 3` dá o tipo (3 Joy-Con, 0 Pro/Grip) e
  `con_info & 1` diz se está alimentado. — `bluetooth_hid_notes.md`
- **[6.26] O canal de saída é o MESMO objeto nos dois transportes.**
  `__joycon_hid_send()` usa `hid_hw_output_report()` para tudo — subcomando 0x01,
  rumble 0x10 e comando USB 0x80. **Não há `hid_hw_raw_request`, não há feature
  report em uso**: as seis constantes `JC_FEATURE_*` são letra morta. — `:892-905`

### Handshake — a ausência é a resposta -> CÉLULA (duas)

- **[6.5]** Todo o ramo de handshake roda sob `joycon_using_usb(ctlr)`, que é
  literalmente `return ctlr->hdev->bus == BUS_USB;`. **Por rádio o `joycon_init()`
  pula direto para `joycon_read_info()`.** A sequência por cabo é `[CONN_STATUS
  0x01, opt-in da casa] -> HANDSHAKE 0x02 -> BAUDRATE_3M 0x03 -> HANDSHAKE 0x02 ->
  NO_TIMEOUT 0x04` (este não responde; o timeout é ignorado de propósito).
  Comandos USB são saída 0x80 com dois bytes (`buf[0]=0x80; buf[1]=cmd`) e
  resposta na entrada 0x81 casada por `data[1]`.
  -> `plataforma.handshake_usb@pro` / `radio_canal` e `radio_offset` — `:862-864`, `:2846-2876`
- **[6.6] Por que não há análogo no rádio:** o doc externo explica que o 0x80 é um
  **túnel para a UART entre o chip Bluetooth e o host** — 0x01 CONN_STATUS manda
  `19 01 03 07 00 00 92 00 …` pela UART; 0x02 HANDSHAKE fala com o chip Broadcom;
  0x03 troca o baudrate para 3 Mbit (*"needed for improved Joy-Con latency"*);
  0x04 força USB HID sem timeout; 0x05 deixa expirar e VOLTAR ao Bluetooth; 0x06
  reset; 0x91 pre-handshake; 0x92 UART cru. **Por rádio esse túnel não existe
  porque o link já é o rádio do mesmo chip.** — `USB-HID-Notes.md`
- **[6.7] A resposta 0x81 carrega o MAC — só no cabo.** [0] 0x81 · [1] 0x01 ·
  [2] 0x00 · [3] tipo · [4..9] MAC. Amostra do doc, **com os octetos 4 e 5
  mascarados pela regra da casa**: `81 01 00 02 57 00 00 8a bb 7c` ->
  `7c:bb:8a:00:00:57`. O remendo desta casa usa esses 6 bytes como identidade de
  último recurso, e **ignora o byte de tipo de propósito** (*"a wrong type
  silently strips inputs from the controller"*). — `:1155-1180`

### Subcomandos

- **[6.8] Sete subcomandos são emitidos, e nem um a mais.** `grep -n "subcmd_id =
  JC_SUBCMD"` devolve exatamente sete linhas: SET_PLAYER_LIGHTS 0x30,
  SET_HOME_LIGHT 0x38, SPI_FLASH_READ 0x10, SET_REPORT_MODE 0x03,
  ENABLE_VIBRATION 0x48, ENABLE_IMU 0x40, REQ_DEV_INFO 0x02. **Os outros vinte e
  um `#define` são letra morta, e nenhum dos sete tem ramo por barramento.** — `:1226-2704`
- **[6.9] Envelope do subcomando:** `{u8 output_id; u8 packet_num; u8
  rumble_data[8]; u8 subcmd_id; u8 data[]}` `__packed`. `output_id` = 0x01 para
  subcomando, 0x10 para rumble puro; `packet_num` envolve em 0xF. **TODO
  subcomando carrega os 8 bytes de rumble atuais junto — não há como mandar
  subcomando sem carona de rumble.** — `:574-586`, `:1180-1215`
- **[6.10] A lista completa do doc externo:** 0x00 Get Only Controller State ·
  **0x01 Bluetooth Manual Pairing** (tipo + BD_ADDR do host, 6 B LE, em 3 passos:
  `x01 x01 [BD_ADDR]` -> `x01 x02` (hash LTK XORado) -> `x01 x03` (grava)) · 0x02
  Request Device Info · 0x03 Set Input Report Mode · 0x04 Trigger Buttons Elapsed
  Time · **0x06 Set HCI State** (x00 desconecta/sleep, x01 reboot+reconnect, x02
  reboot+discoverable, x04 reboot+reconnect) · 0x08 Shipment Low Power · 0x10 SPI
  Read (addr int32 LE + size máx 0x1D) · 0x11 SPI Write · 0x20 Reset MCU · 0x21 Set
  MCU Config · 0x22 Set MCU State · 0x30 Player Lights · 0x38 HOME Light (25 B, 49
  elementos) · 0x40 Enable IMU · 0x41 IMU Sensitivity · 0x48 Enable Vibration ·
  0x50 Get Regulated Voltage. — `bluetooth_hid_subcommands_notes.md`
- **[6.11] Modos do 0x03:** x00-x03 polling ativo, x23 update de MCU, **x30
  "Standard full mode. Pushes current state @60Hz"**, x31 NFC/IR, x33 e x35
  desconhecidos, **x3F "Simple HID mode"**. O driver só escreve UM valor: 0x30. — `:1543-1553`
- **[6.12] A identidade por rádio — offsets idênticos nas duas fontes:** data[0-1]
  firmware · **data[2] TIPO** (1 Joy-Con esq, 2 dir, 3 Pro; o enum do driver
  acrescenta 0x09 NESL, 0x0A NESR, 0x0B SNES, 0x0C N64, 0x0D Genesis) · data[3]
  sempre 0x02 · **data[4..9] MAC em BIG ENDIAN** · data[10] 0x01 · data[11] 01 se
  as cores estão na SPI. — `:391-401`, `:2712-2738`

### Rumble e IMU

- **[6.13] Os 8 bytes -> CÉLULA.** `joycon_encode_rumble()` escreve 4 bytes:
  `[0] = (freq_high.high >> 8) & 0xFF`; `[1] = (freq_high.high & 0xFF) +
  amp.high`; `[2] = freq_low.low + ((amp.low >> 8) & 0xFF)`; `[3] = amp.low &
  0xFF`. `joycon_set_rumble` chama duas vezes — **ESQUERDA em 0..3, direita em
  4..7**. Limites: alta 82..1253 Hz, baixa 41..626 Hz, amplitude máx 1003;
  padrões 160/320 Hz. Reenvio a cada `JC_RUMBLE_PERIOD_MS = 50` e **5 pacotes de
  amplitude zero para calar**. -> `vibracao.rumble.passthrough@sn30` /
  `radio_offset` — `:2146-2216`
- **[6.14] A matemática, pelo doc:** banda alta `log2(freq/10.0)*32.0`, 16 bits BE,
  faixa 0x0004-0x01FC em passos de 4; banda baixa mesmo log, 8 bits,
  0x01-0x7F; amplitude `log2f(8.7f*amp)*32.0f` na faixa alta e
  `log2f(17.0f*amp)*16.0f` na média. Acima de ~1.002 o doc avisa: *"not safe for
  the integrity of the linear resonant actuators"*. **O driver não recalcula — usa
  tabelas com esses números já assados.** — `rumble_data_table.md`
- **[6.15] O rumble precisa ser habilitado antes:** `ENABLE_VIBRATION 0x48` com
  `data[0]=0x01` no init, com o comentário `/* note: 0x00 would disable */`. **A
  tabela do dekuNukem não menciona esse pré-requisito.** — `:1556-1566`
- **[6.17] IMU:** cada 0x30 traz TRÊS amostras de 12 bytes a partir do byte 13 —
  accel X/Y/Z e gyro X/Y/Z, s16 LE. O controle amostra a cada 1,35 ms e as três
  amostras ficam ~5 ms entre si. Conversão crua: accel `raw * 0.000244 G` (±8G),
  gyro `raw * 0.06103 dps` (±2000 dps), ou 0.070 com a compensação de saturação do
  LSM6DS3. Padrões do 0x41: giro 208 Hz ±2000 dps, accel 1,66 kHz ±8G com filtro
  de 100 Hz — e **mandar `0x40 0x01` com a IMU antes desligada RESETA a
  configuração para esses padrões**. — `:1596-1646`
- **[6.16] A perda de IMU é ESTIMADA, não contada.** Não há número de sequência
  utilizável: o driver guarda a média do delta (300 amostras por recálculo,
  semente 15 ms), usa `dropped_threshold = avg_delta * 3 / 2` e
  `dropped_pkts = (delta - min(delta, threshold)) / avg_delta`, e **só loga quando
  passa de 3**. Não há ramo por barramento. Duas consequências: **perdas de 1 a 3
  relatórios são invisíveis no journal**, e N conta RELATÓRIOS, cada um valendo 3
  amostras. — `:224-227`, `:1686-1726`

### Rádio: o que só existe lá

- **[6.18] O SSR aparece no código, e liga sniff a taxa de IMU.** Comentário
  literal: *"some bluetooth stacks are known to alter the controller's packet rate
  by hardcoding the bluetooth SSR for the switch controllers (android's stack
  currently sets the SSR to 11ms for both the joy-cons and pro controllers)"*.
  **SSR = Sniff Subrating — é o elo entre a política de link do rádio e a cadência
  de IMU.** Fora esse comentário o driver não toca link policy: `sniff` tem ZERO
  ocorrências e o subcomando de HCI 0x06 nunca é emitido. — `:1653-1665`
- **[6.19] O rate limiter é 3× mais lento no rádio.** `USB_MS = 20`, `BT_MS = 60`,
  escolhidos por `bus == BUS_USB`. Exige ainda 3 deltas consecutivos entre 8 e
  17 ms e dorme 4 ms depois do relatório antes de transmitir — mas **por USB os
  deltas válidos são FORÇADOS**, isto é, o rastreio de janela segura é mecanismo
  EXCLUSIVO DE RÁDIO. Justificativa no próprio driver: *"Sending subcommands
  and/or rumble data at too high a rate can cause bluetooth controller
  disconnections"*. — `:971-980`, `:2009-2023`
- **[6.20] NFC: o aparelho tem, o kernel não emite NADA -> CÉLULA.** Contagem
  literal: `JC_OUTPUT_MCU_DATA` (0x11) 1 ocorrência (só o define);
  `RESET_MCU` (0x20), `SET_MCU_CONFIG` (0x21), `SET_MCU_STATE` (0x22) 1 cada;
  `JC_INPUT_MCU_DATA` (0x31) 2 — o define e a linha que apenas ACEITA o report.
  **Zero emissão em qualquer barramento.** -> `plataforma.nfc@pro` /
  `radio_evidencia` — `:121-155`, `:2995`
- **[6.21] Tamanhos do canal MCU, pelo doc:** entrada 0x31 = *"49-361 … NFC/IR data
  input report. Max 313 bytes"*; saída 0x11 pede dados ao MCU e **também pode
  mandar rumble**; 0x12 desconhecido; entradas 0x32 e 0x33 mandam relatório padrão,
  propósito desconhecido. — `bluetooth_hid_notes.md`
- **[6.22] O PID MENTE por transporte nesta família — caso documentado no
  código.** Comentário do driver: *"Unfortantly the hdev->product can't always be
  used due to a ?bug? with the NSO Genesis controller. Over USB, it will report the
  PID as 0x201E, but over bluetooth it will report the PID as 0x2017 which is the
  same as the NSO SNES controller."* **Precedente citável: nesta família, um mesmo
  controle já muda de PID conforme o barramento.** — `:2727-2738`
- **[6.23] O driver mexe no `hdev->version`.** No probe, ANTES do `hid_hw_start`:
  `hdev->version |= 0x8000`, para o SDL2 distinguir mapeamentos. **Quem ler a
  versão pela camada HID vê 0x8210 no genuíno e 0x8200 no clone**, não 0x0210 /
  0x0200. A regra udev 84 desta casa lê `ATTRS{bcdDevice}` no `usb_device` PAI,
  que o driver não toca — essa continua íntegra. **Por rádio não há `bcdDevice`
  nenhum**, e o byte de tipo do REQ_DEV_INFO é o mesmo num clone que se declare
  Pro. — `:3099-3106`
- **[6.24] O giroscópio nasce num SEGUNDO nó evdev.** `joycon_imu_input_create()`
  aloca um input device separado, `"<nome> (IMU)"`, com `id.bustype = hdev->bus`,
  `uniq = mac_addr_str`, publicando ABS_X/Y/Z (accel), ABS_RX/RY/RZ (giro) e
  MSC_TIMESTAMP. **É o mecanismo por trás do "giroscópio NEUTRO" do vpad: quem
  espelha só o nó do gamepad nunca vê motion, em transporte nenhum.** — `:2333-2390`
- **[6.25] O `uniq` tem três origens, e só uma existe no rádio:** (1) REQ_DEV_INFO
  `data[4..9]` — **a única rota por rádio**; (2) a resposta 0x81 do CONN_STATUS —
  só cabo, opt-in; (3) um MAC SINTETIZADO `02:VV:VV:PP:PP:BB` quando nada
  respondeu — só cabo, opt-in. O comentário avisa: *"Two identical clones plugged
  at once would share it"*. — `:2793-2836`

---

# F9 · 8BitDo SN30 Pro por Bluetooth

**O que é:** um levantamento sobre um aparelho **que não tem driver próprio no
kernel**. A resposta que ele traz é estrutural: quase toda pergunta sobre o SN30
Pro muda de resposta conforme o MODO.

**O que foi lido:** SDL (`SDL_hidapi_8bitdo.c`, `SDL_hidapi_switch.c`,
`SDL_hidapi_nintendo.h`, `usb_ids.h`, `SDL_gamepad_db.h`), Linux mainline
(`hid-ids.h`, `hid-microsoft.c`, `hid-quirks.c`, `hid-nintendo.c`),
`fwupd/8bitdo-firmware`, e a documentação oficial 8BitDo (FAQ, manual PDF, página
de produto, histórico de firmware). Mais o `assets/dkms/hid-nintendo/` do disco e
as 99 linhas `sn30` do CSV.

- **[9.1] Não existe `hid-8bitdo.c` no mainline.** A ÚNICA linha do vendor
  `0x2dc8` no kernel inteiro é um quirk — `{HID_USB_DEVICE(8BITDO, PRO_3),
  HID_QUIRK_ALWAYS_POLL}` — **que é USB, não Bluetooth, e é do Pro 3 (0x6009), não
  do SN30 Pro**. Por Bluetooth em D-input ou X-input o SN30 Pro é atendido por
  `hid-generic`, sem driver de protocolo nenhum. — `hid-quirks.c:28`
- **[9.2] Cinco identidades para o mesmo hardware,** declaradas no manifesto de
  firmware: `057E:2009` (Switch Pro), `2DC8:6000` (SF30 Pro), `2DC8:6001` (SN30
  Pro), `045E:028E` (Xbox 360 = X-input) e `054C:05C4` (DualShock 4). **Não é
  boilerplate**: o manifesto do SN30 Pro+ ao lado lista só duas. — `fwupd/8bitdo-firmware .../1.37/sf30sn30pro.metainfo.xml`
- **[9.3] O rádio tem PID PRÓPRIO, e a regra é +0x0100.** `SN30_PRO 0x6001` /
  `SN30_PRO_BT 0x6101`; SF30 Pro 0x6000/0x6100; SN30 Pro+ 0x6002/0x6102. O
  comentário do SDL diz o combo que entra no modo: `B + START`. — `usb_ids.h:75-76`
- **[9.4] Três report IDs de entrada, e o do rádio é o 0x01:** `BT_REPORTID 0x01`
  (*"Enhanced mode Bluetooth report"*), `REPORTID 0x04` (*"Enhanced mode USB
  report"*), `NOT_SUPPORTED 0x03` (*"Firmware without enhanced mode"*). **Os TRÊS
  são decodificados com os MESMOS offsets — aqui não há o +1 do DualSense.** — `SDL_hidapi_8bitdo.c:51-55`
- **[9.5] Offsets do 0x01 (rádio, D-input enhanced):** [0] id · [1] hat (0=cima …
  7=cima-esq, outro=centro) · [2] LX · [3] LY · [4] RX · [5] RY (centro 0x7f) ·
  **[6] gatilho DIREITO · [7] ESQUERDO** (lidos como `data[off]*257-32768`) ·
  [8] A/B/X/Y/L/R + PL/PR · [9] Guide/Back/Start/L3/R3 · [10] L4/R4 (só se
  size>10) · **[14] bateria** · **[15..26] IMU** · [27..30] timestamp em µs. — `:548-724`
- **[9.6] O handshake deste modo é LER o feature report 0x06** — até 5 tentativas
  com 10 ms entre elas. Se devolve algo, o driver marca `sensors_supported`,
  `rumble_supported` e `powerstate_supported`; se `size >= 14 && data[13] ==
  0xAA`, também timestamp. **E se `size >= 12 && data[10] != 0`, os bytes
  `data[10]..data[5]` (ordem invertida) são o ENDEREÇO DE RÁDIO**, usado como
  número de série. — `:232-259`
- **[9.7] Rumble por rádio: saída 0x05, cinco bytes.** `{0x05, low>>8 (forte),
  high>>8 (fraco), 0, 0}`, os dois últimos para rumble de gatilho. Escala 0..255.
  **O MESMO pacote por cabo e por rádio — sem variante, sem CRC.** — `:379-420`
- **[9.8] Sticks: 8 bits em D-input, 12 bits em modo Switch.** D-input: um byte por
  eixo, centro 0x7f. Modo Switch (0x30): 12 bits empacotados 3 bytes por stick.
  **O modo Switch entrega 16× mais resolução.** — `:612-628`, `SDL_hidapi_switch.c:2670-2685`
- **[9.9] Gatilhos: analógicos no firmware novo, DIGITAIS no velho.** Quando o
  report tem `size == 9` (*"Old firmware USB report for the SF30 Pro and SN30
  Pro"*), os gatilhos vêm como BITS (`data[1] & 0x01` / `& 0x02`) saturando em
  ±MAX_SINT16. **O banco de mapeamentos confirma a divisão: v1.26 mapeia
  `lefttrigger:b8` (botão), outra linha do mesmo PID mapeia `lefttrigger:a4`
  (eixo).** — `:455-529`, `SDL_gamepad_db.h:69-71`
- **[9.10] IMU no D-input com firmware novo:** `ACCEL_SCALE 4096.f` (LSB/g) e
  `GYRO_MAX 2000.f` (°/s em ±INT16_MAX). Seis int16 LE em `data[15..26]`, na ordem
  accelXYZ, gyroXYZ. **O SDL faz rotação de eixos porque o hardware reporta
  x=roll, y=pitch, z=yaw.** Commit `a26e5f32`: *"Gyro degrees per second is 2000
  across all 8bitdo controllers"*. — `:58-119`, `:667-716`
- **[9.11] Taxa de IMU por rádio: ~70 Hz, e o próprio SDL declara PERDA.**
  Comentário: *"estimated by observation of Bluetooth packets received in the
  testcontroller tool — Observed to be anywhere between 60-90 hz. Possibly lossy in
  current state"*. Por cabo é 200 Hz (com timestamp) ou 100 Hz. Pro 2: 85 Hz por
  rádio; Ultimate 2 Wireless: 120 Hz. **O commit `1e886c8a` classifica o SN30
  Pro_BT como "Very Lossy".** — `:285-303`
- **[9.12] Bateria em D-input é PERCENTUAL:** `status = data[14] >> 7`,
  `level = data[14] & 0x7f` — bits 0..6 são o percentual direto, e `level == 100`
  vira "carregado". **O oposto do modo Switch.** — `:638-666`
- **[9.13] Bateria em modo Switch são CINCO degraus,** no mesmo byte do Joy-Con:
  `bat_con` bit 0 alimentado, bit 4 carregando, `tmp >> 5` dá 0 CRITICAL … 4 FULL.
  O SDL lê o mesmo byte de outro jeito (`(x & 0xE0) >> 4`, escala 0..8) e anota:
  *"low nibble is connection status (always 0 on 8BitDo Pro 2)"*. — `hid-nintendo.c:1638-1672`
- **[9.14] Por RÁDIO em modo Switch, o 8BitDo fala o protocolo Pro COMPLETO.**
  Comentário literal do SDL: *"Third party controllers use the full Switch Pro
  wireless protocol over Bluetooth"* — e o `m_bInputOnly` (que desliga a escrita)
  **só é calculado quando NÃO é Bluetooth**. Valem os mesmos IDs do Pro genuíno. — `SDL_hidapi_switch.c:1587`
- **[9.15] Offsets do 0x30, idênticos por cabo e rádio:** [1] contador · [2]
  bateria/conexão · [3..5] botões · [6..8] stick esquerdo · [9..11] direito · [12]
  código de vibração · [13..48] três quadros de IMU de 12 B. **Saída: 49 bytes por
  Bluetooth contra 64 por USB.** — `:167-192`
- **[9.16] Como distinguir um clone sem depender de OUI:** o enum de tipo *"comes
  directly out of the hardware"* — 0 Unknown, 1/2 Joy-Con, 3 ProController,
  **6 LicProController**, 7..13 HVC/NES/SNES/N64/Genesis. É o
  `deviceInfo.ucDeviceType` da resposta ao 0x02, logo depois dos 2 bytes de
  firmware. O SDL trata Unknown e Lic como "third party". **ATENÇÃO: o código não
  prova que um SN30 Pro devolva 6 — prova que o campo existe e é lido.** — `SDL_hidapi_nintendo.h:25-39`
- **[9.17] Armadilha de ESCRITA, não ausência:** *"Third party controllers don't
  have a home LED and will shut off if we try to set it"*. O SDL recusa
  `SetHomeLight` (subcmd 0x38) quando o tipo é Unknown ou Lic. **A tentativa
  desliga o aparelho.** — `SDL_hidapi_switch.c:1317-1321`
- **[9.18] O handshake USB do modo Switch é o discriminador de transporte** — o
  comentário diz que ele *"is not supported over Bluetooth, so we can use the
  controller's lack of response as a way to determine if the connection is over
  USB or Bluetooth"*. E, ainda por cabo, *"The 8BitDo M30 and SF30 Pro don't
  respond to this command"* (o `HighSpeed` 0x03) *"but otherwise work correctly"* —
  a checagem de retorno está COMENTADA por causa disso. — `:708-729`
- **[9.19] Rumble por rádio em X-input só existe no SN30 Pro PLUS, e por quirk.**
  O kernel declara `USB_DEVICE_ID_8BITDO_SN30_PRO_PLUS 0x02e0` **dentro da seção
  do vendor Microsoft** e uma linha `HID_BLUETOOTH_DEVICE(MICROSOFT, …) =
  MS_QUIRK_FF`. O envio é o report 3 (`XB1S_FF_REPORT`), 9 bytes
  `{id, enable, magnitude[4], duration_10ms, start_delay_10ms, loop_count}`, com
  magnitude[2] = esquerdo (forte) e [3] = direito (fraco), **escala 0..100, não
  0..255**. **O SN30 Pro simples não tem entrada nenhuma nesse driver.** — `hid-microsoft.c:278-438`
- **[9.20] Combos e LEDs (manual oficial):** START+Y Switch (LEDs giram); START+B
  Android/D-input (LED 1 pisca); START+X Windows/X-input (LEDs 1 e 2); START+A por
  1 s macOS (LEDs 1, 2 e 3). Pareamento: PAIR por 2 s. Ligar START; desligar 3 s;
  forçar 8 s. Firmware: L1+R1+START por 3 s. **LED sólido = conectado; no modo
  Switch os mesmos LEDs viram o número do jogador.** — manual PDF + FAQ
- **[9.21] O modo macOS pareia com o NOME de um DualShock 4.** O manual manda
  *"pair with [Wireless Controller]"* — que é o nome de rádio do DS4 — e o
  manifesto de firmware declara `054C:05C4`. **Duas fontes independentes apontando
  para a mesma impersonação.**
- **[9.22] Bateria (número oficial):** Li-ion 480 mAh; indicação **por LED, não por
  degraus**: baixa = POWER LED PISCA, carregando = sólido, cheia = APAGA. Dorme em
  1 min sem conexão e em 15 min com conexão mas sem uso; START acorda.
- **[9.23] O que NÃO tem — e a hipótese honesta do enunciado se confirma:** nada
  em nenhuma das fontes menciona, para o SN30 Pro, alto-falante, microfone, jack
  de fone, lightbar/RGB, gatilhos adaptativos, touchpad, câmera IR ou CRC no
  envelope de rádio. O driver do SDL devolve `SDL_Unsupported()` em
  `SetJoystickLED` e `SendJoystickEffect`, e `rgb_supported` nunca é ligado. A FAQ
  oficial diz que o rumble é *"normal rumble, not HD rumble"*.
- **[9.24] Qual firmware liga o modo enhanced:** o commit que criou o driver
  (`2b3c4812`, 07/05/2025, PR #12964, **contribuído pela própria 8BitDo**) declara
  *"Supported versions: Pro 2 v3.06 above; SF30 Pro/SN30 Pro v2.05 above"*. O site
  oficial lista hoje **v2.07**; o repositório do fwupd só chega a **v1.37**
  (16/07/2021) — duas gerações atrás. Cuidado: *"SN30 Pro for Android"* (v2.02) e
  *"SN30 Pro USB"* (v1.06) são produtos DIFERENTES na mesma página.
- **[9.25] Endereço de rádio e calibração de fábrica no modo Switch:** endereço em
  `deviceInfo.rgucMACAddress[6]` (resposta ao 0x02). Calibração de stick por SPI
  (subcmd 0x10) em `0x603D..0x604E` (fábrica, 18 B) e `0x8010..0x8025` (usuário,
  22 B; só vale se os mágicos forem `0xB2 0xA1`). Escalas de IMU em
  `0x6020..0x6037` e `0x8026..0x8039`. A de usuário *"isn't readable on all
  controllers"*; **a de fábrica é obrigatória — falha derruba a abertura do
  joystick**. — `:979-1030`

---

# As divergências, sem escolher lado

64 divergências foram devolvidas; agrupadas por assunto, são estas. **Nenhuma foi
resolvida — resolver exige o aparelho na mesa.**

### 1. O deslocamento cabo->rádio na SAÍDA: +1 ou +2

A divergência mais pesada do lote, porque erra TODOS os campos por um byte.

| Diz +2 (três bytes de cabeçalho) | Diz +1 (dois bytes, `[1]` = 0x02 fixo) |
| --- | --- |
| kernel `hid-playstation.c:351-359` | `pydualsense.py:579-581` |
| SDL `SDL_hidapi_ps5.c:1099-1111` (`offset = 3`) | DS5-Windows `IO.cpp:337-342` |
| Senshi `buildBluetoothWrappedUsbOutputReport` (`RB.kt:1374-1379`) | `dualsense-ts` `dualsense_hid.ts:369-382` |
| | Senshi, construtores à mão (`PAYLOAD_OFFSET = 2`) |

**Consequência medível:** a cor da barra sai em 46/47/48 num lado e 47/48/49 no
outro; o modo do gatilho direito em 12 contra 13.
**Agravantes registrados:** o Senshi carrega as DUAS convenções ao mesmo tempo e
nenhum comentário do repo explica (D8.2); o ramo BT do DS5W tem um
`//return DS5W_E_CURRENTLY_NOT_SUPPORTED;` comentado — foi declarado sem suporte
pelo próprio autor e destravado depois (D2.3).
**Na ENTRADA não há disputa:** rádio = cabo + 1, confirmado em cinco fontes.

### 2. O byte 1 da saída por rádio

Kernel: nibble alto é um contador que **precisa** subir a cada report, com volta
em 16. SDL: `0x00` fixo, nunca incrementa. pydualsense e `dualsense-ts`: `0x02`
fixo. Senshi: incrementa. **Os que não incrementam funcionam** — ou o aparelho
ignora o campo, ou ignora em algum modo. E o keepalive do SDL usa `0x02` no byte
1, diferente do `0x00` do pacote de efeitos dele mesmo.

### 3. Tamanho do report de saída por CABO — quatro números, e três não se contradizem

**47** = o payload comum (`static_assert` do kernel; é o número que o enunciado
desta casa usava para o report inteiro). **48** = id + payload, o que SDL,
`dualsense-ts` e o wrapper do Senshi escrevem. **63** = `DS_OUTPUT_REPORT_USB_SIZE`
do kernel, id + payload + `reserved[15]`. **64** = o que o pydualsense escreve
(o tamanho do report de ENTRADA). Por RÁDIO ninguém diverge: 78.
**Correção ao enunciado da casa, registrada em quatro dossiês:** "0x02 (47 B)"
confunde payload com report.

### 4. Giroscópio ou acelerômetro primeiro

DS5-Windows diz acelerômetro no payload 0x0F e giro no 0x15. Kernel,
`dualsense-ts` e dualshock-tools dizem o inverso: `gyro[3]` primeiro. Mesmos
bytes, rótulo trocado. **A própria fonte que discorda marca a linha com
`//TEMP: Copy gyro data (no processing currently done!)`.**

### 5. Bateria — escala, origem do estado e os códigos de erro

- **Escala:** DS5W faz `(nibble)*100/8` (fundo 8); kernel, SDL e dualshock-tools
  fazem `min(nibble*10+5, 100)` (fundo 10). **Se o kernel estiver certo, o DS5W
  satura em 125%.**
- **Origem do estado:** DS5W lê "carregando" em `status[1]` bit 3 e "cheia" em
  `status[2]` bit 5; o kernel lê um código de 4 bits no **nibble alto de
  `status[0]`**, o mesmo byte do nível. **São bytes diferentes, não bits.**
- **Código 0xf:** dualshock-tools lê como *"battery is flat"* e devolve
  carregando=true; o kernel lê como *charging error* e devolve UNKNOWN. **Leituras
  opostas do mesmo nibble.**
- **Código 0xb:** o kernel distingue 0xa (tensão/temperatura fora de faixa) de 0xb
  (erro de temperatura); a dualshock-tools escreve `// not sure yet what this
  error means`.
- **Fone de ouvido é o único byte de status em que DS5W e kernel batem:**
  `status[1]` bit 0.

### 6. Nomes de campo e de bit — mesmo byte, vocabulários incompatíveis

| Byte | kernel | outras fontes |
| --- | --- | --- |
| valid_flag0 bit0/bit1 | COMPATIBLE_VIBRATION / HAPTICS_SELECT | RIGHT_/LEFT_VIBRATION (dualshock-tools); háptico / rumble primário (`dualsense-ts`) |
| valid_flag0 bit2/bit3 | — | gatilho esquerdo / direito (dualshock-tools e `dualsense-ts`) |
| valid_flag1 bit3 | RELEASE_LEDS | "reservado" (dualshock-tools) |
| valid_flag1 bit7 | AUDIO_CONTROL2_ENABLE | "reservado" (dualshock-tools) |
| valid_flag2 bit0/bit2 | não define bit0; bit2 = COMPATIBLE_VIBRATION2 | bit0 = LED_BRIGHTNESS (dualshock-tools), que não tem o bit2 |
| payload 9 | `power_save_control` (BIT(4) = mic mute) | `ucAudioMuteBits` (SDL) |
| payload 39/40 | `valid_flag2` | `light.ledOption` (pydualsense) |
| payload 41 | `lightbar_setup` | `ucLedAnim` (SDL) |
| payload 43 | `player_leds` | `ucPadLights` (SDL) |
| payload 37 | `audio_control2` | engolido em `rgucUnknown1[6]` (SDL) |

### 7. O byte `audio_control2` — três nomes para bytes vizinhos

Kernel: `audio_control2` no corpo[37] (byte 38 do cabo). `dualsense-ts`: byte 37
do cabo, um antes, chamado *"flags de áudio 2: bits 0-2 ganho do pré-amp, bit 4
beam forming"*. Senshi: escreve `audioControl2` no byte 38 do cabo (concordando
com o kernel) **mas no slot equivalente do rádio escreve outra coisa** —
`(trigger softness << 4) | rumble reduce`. **Nenhuma das três é confirmável sem o
aparelho.**

### 8. Teto do volume do alto-falante

Kernel: `0x00-0xff`. `dualsense-ts`: limita duro em `0x64`, com o comentário
"faixa efetiva 0x3D-0x64". Senshi: padrão `0x7C`, e o comentário diz que 0-100%
mapeia para "unidades de hardware 50-127" (`0x32..0x7F`). **Três tetos.**

### 9. `power_save_control` e `audio_control` decompostos por uma fonte só

O `dualsense-ts` declara os oito bits de `power_save_control` e a decomposição
inteira de `audio_control`. **Só o bit 0x10 (mudo do microfone) tem confirmação
cruzada; o resto é afirmação de uma fonte.**

### 10. Os bits 3 e 4 do byte 55 da entrada

`dualsense-ts` chama o bit 3 de `Status` e o bit 2 de `MuteLed`; o Senshi chama o
bit 2 de `micMuted`, o 3 de `usbData` e o 4 de `usbPower`; o kernel nomeia só até
o bit 2 e **concorda com o Senshi**. Para o bit 2 o desempate é 2 a 1. **Bits 3 e
4 só o Senshi nomeia.**

### 11. O report 0x39 de áudio — e a testemunha que não é independente

A célula `audio.alto_falante@dualsense`/`radio_offset` foi montada sobre o
`awalol/DS5Dongle` (fonte da **rodada 2**) com o Senshi como corroboração. **O
Senshi NÃO é testemunha independente:** o comentário dele em `RB.kt:76` cita
*"DS5Dongle's working Classic BT 0x36 haptics report"* — ele leu a mesma fonte.
E as duas leituras do byte `0x13` divergem: para o Senshi/DSX é uma **ROTA**
(`report[2] = 0x91 or 0x82` -> 0x93 = 0x13|0x80), com o háptico seguindo em
amostras cruas de 8 bits no bloco 0x12; para o DS5Dongle é um **bloco que carrega
200 B de Opus**. Mesmo byte, dois conteúdos.

### 12. Método de detectar o transporte

Kernel: `hdev->bus`, autoritativo. SDL, pydualsense, DS5-Windows e
dualshock-tools: **adivinham pelo comprimento do primeiro report**. Consequência:
o SDL tem TRÊS estados (cabo / rádio-avançado / rádio-simples) onde o kernel tem
dois. Nenhuma está errada; são réguas diferentes.

### 13. Tamanho escrito na saída por rádio

Kernel e SDL escrevem 78. **O DS5-Windows escreve 547** (o buffer em `Device.h:79`
tem exatamente 547) — os 469 bytes a mais podem ser peculiaridade do stack HID do
Windows, mas o CRC dele é calculado sobre 74 e gravado em 0x4A..0x4D nos dois
casos.

### 14. Pro Controller — a taxa de push do 0x30 por rádio: três números vivos

dekuNukem: *"Pushes current state @60Hz, or @120Hz if Pro Controller"*. O driver:
*"pro controller (bluetooth): every 8 ms (this is the wildcard)"* — **8 ms são
125 Hz, não 120**. E o mesmo autor, três linhas abaixo, diz que o Pro DELE reporta
lotes de IMU a **11 ms OU 15 ms**, estável após conectar, *"It isn't 100% clear
what determines this rate"*. **Nada disto foi medido nesta casa. O journal já dá o
instrumento de graça** (ver [6.16]).

### 15. Pro Controller — três notas menores, todas com consequência

- **O doc do rumble se contradiz internamente:** a tabela diz "Bytes 2-9: Rumble
  data" (8 bytes) e a prosa diz "A timing byte, then 4 bytes … followed by 4
  bytes" (9). **O código resolve:** o "timing byte" É o `packet_num` do byte 1;
  `rumble_data[8]` são os bytes 2..9. Não há byte a mais.
- **O doc não menciona o pré-requisito do rumble** (`ENABLE_VIBRATION 0x48`).
  Quem implementar só pelo doc escreve os 8 bytes certos num controle que não
  vibra — **e o sintoma é a AUSÊNCIA de resposta, não erro**.
- **Tamanho do 0x31 (NFC):** o doc diz "49-361 … Max 313 bytes" = 362 bytes de
  report total; a linha do nosso mapa registra "361 bytes", que é o **índice do
  último byte**, não a contagem. Diferença de referencial — e é exatamente o tipo
  de número que alguém usa para dimensionar buffer.
- **IMU em ±8G: conferido e SEM divergência** — `0.000244 G/LSB` é 8/32768.

### 16. 8BitDo — a fabricante contra ela mesma

- **Motion.** A página oficial de produto diz *"Motion control (for Switch
  only)"*. O driver do SDL — **escrito pela própria 8BitDo no PR #12964** — trata
  o SN30 Pro em D-input por Bluetooth (PID 0x6101) como tendo giro E acelerômetro,
  com escala declarada e taxa observada. **As duas não podem ser ambas literais.**
  Leituras possíveis, nenhuma provada: a página fala do que a 8BitDo suporta e não
  do que o hardware emite; o suporte é posterior à página; ou o dado existe e é
  inútil sem consumidor.
- **Modos:** manual (rev. 13/05/2022) e FAQ listam QUATRO (Switch, D-input,
  X-input, macOS); a página de produto de hoje lista TRÊS — sem macOS.
- **Autonomia:** 16 h no manual, 18 h na FAQ e na página. Mesma bateria (480 mAh).
- **Revisão de hardware:** a página descreve um SN30 Pro *"Now upgraded with Hall
  Effect joysticks"*, compatível com Switch 2. Manual e FAQ descrevem a geração de
  2017-2019. **Não foi possível estabelecer se a revisão Hall Effect mantém o
  mesmo `2dc8:6001/6101`.**
- **Bateria, degraus contra percentual:** o MESMO aparelho responde de duas formas
  incompatíveis conforme o modo — cinco degraus em modo Switch, percentual 0..100
  em D-input.

### 17. **MODO é um eixo AUSENTE no nosso mapa** — achado sobre o CSV, não sobre o aparelho

As 99 linhas `sn30` de `docs/data/mapa-controles.csv` assumem, pelo vocabulário
(`subcmd 0x10`, `resposta no 0x21`, `entrada 0x30`, `saída 0x80; resposta 0x81`,
`REQ_DEV_INFO`), que o SN30 está **sempre em modo Switch**. Praticamente toda
resposta muda com o modo: report ID, resolução de stick, se o gatilho é eixo ou
bit, se a bateria é degrau ou percentual, se há rumble de kernel, qual driver
assume. **Sem uma coluna de modo, metade das lacunas não tem resposta única — e
preencher qualquer uma com um valor só é fixar uma verdade parcial.**

### 18. Defeitos DENTRO de uma fonte só (não são divergência entre fontes)

- **pydualsense:** no ramo BT, o comentário da linha 607 diz *"outReport[5] -
  outReport[8] audio related"*, mas `[5]` já é o motor esquerdo — os comentários
  foram copiados do ramo USB sem deslocar o +1. **Quem ler a fonte pelos
  comentários lê os offsets ERRADOS.** E o `compute()` tem `range(74)` cravado, sem
  consultar o tamanho: reaproveitá-lo para um feature report calcula sobre a
  janela errada **em silêncio**.
- **DS5-Windows:** centra x subtraindo 128 e y subtraindo 127, nos dois sticks —
  o eixo vertical fica deslocado meio passo. **Quem copiar a fórmula copia o
  desvio.**
- **dualshock-tools:** `LED_BRIGHTNESS: 0x20, // Bit 6` e `LIGHTBAR_SETUP: 0x40,
  // Bit 6` — 0x20 é bit 5, e um dos dois comentários está errado, sem contraprova
  no driver. E o `pack()` **zera os bytes 32-42 e o 9**, que no layout do driver
  são `power_save_control`, `audio_control2`, `valid_flag2`, `lightbar_setup` e
  `led_brightness`: usar esse `pack()` como modelo **apaga campos que o driver
  conhece**, inclusive o próprio `valid_flag2` que a fonte declara em outro lugar.
- **Valve:** o comentário do arquivo diz *"over bluetooth hidraw"*, mas o padrão
  `KERNELS=="*054C:0CE6*"` **não ancora barramento e casa qualquer bus**. O
  comentário e o efeito divergem — e é por isso que o steam-devices acabava
  cobrindo o nosso vpad.
- **SDL, ponto não explicado:** no despacho de entrada, o caso do report `0x01` (o
  ID do CABO) aceita `size == 10 || size == 78`. O 10 se explica (o DirectInput por
  rádio). **O 78 com ID 0x01 não se explica por nada que tenha sido lido.**

### 19. Limites da coleta, declarados

- A confirmação upstream do `hid-playstation.c` é **por VALOR conferido**, não por
  leitura literal: a primeira tentativa de `WebFetch` pedindo o código verbatim foi
  recusada (reprodução de fonte licenciado). O texto integral lido de verdade é o
  do disco desta árvore. — D4.6
- **A cópia local do `hid-playstation.c` não é a upstream**, mas os dois patches
  desta casa não tocam a região do DualSense por Bluetooth: o 0001 mexe nas linhas
  ~9, ~21, ~787 e ~823 do vanilla e o 0002 nas ~61, ~382, ~2228 e ~2243. **Os
  valores devolvidos são vanilla.** — D4.4
- O `dualsense-ts` **nunca passou por régua nenhuma na saída por rádio**:
  `hid_provider_reports.spec.ts` só exercita a ENTRADA. — D8.8
- Sobre o Steam: **nada do binário foi lido, porque ele é fechado.** Tudo saiu das
  regras udev públicas ou do SDL.

---

# O que virou célula — 13, das 43 propostas

| Célula | Coluna | De onde saiu |
| --- | --- | --- |
| `plataforma.handshake_usb@pro` | `radio_canal` = `outro` | [6.5] — não há canal porque não há transação |
| `plataforma.handshake_usb@pro` | `radio_offset` = `—` | [6.5], [6.6] — as cinco constantes `JC_USB_CMD_*` são só de cabo |
| `plataforma.vpad@pro` | `radio_report_id` | nosso `uhid_gamepad.py`, com [6.26] de contexto |
| `plataforma.nfc@pro` | `radio_evidencia` | [6.20] — contagem literal: zero emissão |
| `plataforma.sniff@pro` | `radio_offset` | nossas regras udev 82, com [6.18]/[6.19] de contexto |
| `audio.alto_falante@dualsense` | `radio_canal` = `hidraw` | nosso `dualsense_bt_audio.py` |
| `audio.alto_falante@dualsense` | `radio_offset` | **DS5Dongle (rodada 2)** + [8.19] como corroboração parcial |
| `entrada.stick@sn30` | `radio_offset` | [6.3] — bytes 6-8 e 9-11 |
| `vibracao.rumble.passthrough@sn30` | `radio_offset` | [6.13], [6.9] |
| `vibracao.rumble.passthrough@sn30` | `radio_evidencia` | nosso `evdev_reader.py` |
| `energia.bateria.degraus@sn30` | `radio_offset` | [6.3], [6.4] |
| `luz.led_jogador@dualsense` | `radio_evidencia` | **NÃO ACHEI**, e o dossiê diz por quê |
| `toque.touchpad.cursor@dualsense` | `radio_offset` | nosso `evdev_reader.py` |

**O padrão vale ser lido:** das sete fontes de DualSense (F1, F2, F3, F4, F5, F7,
F8) saíram **147 achados e exatamente UM** alimentou célula — o [8.19]. As cinco
células de Pro/SN30 vieram quase todas de uma fonte só, o `hid-nintendo`. As
outras quatro células saíram do **nosso próprio código**, não das fontes externas.

---

# O que ficou por usar — a lista de trabalho

Cada item abaixo tem endereço acima. Nenhum foi medido nesta bancada.

### Gatilhos adaptativos — 22 bytes que nenhum driver nomeia
`reserved2[27]` no kernel; declarado e nunca escrito no SDL. Três fontes
independentes descrevem o conteúdo: **[2.16]** (modos 0x00/0x01/0x02/**0x26
estendido**/0xFC, com parâmetros posição/força/frequência), **[7.6]/[7.7]**
(payload 10-31, modos `OFF/RESISTANCE/TRIGGER/AUTO_TRIGGER`, presets
light/medium/heavy, e o bit de autorização que se limpa após enviar), **[8.15]**
(o modo "desligado" é **0x05, não 0x00** — com 0x00 o gatilho fica parcialmente
acionado em alguns firmwares). Zero células.

### Calibração e NVS do DualSense — só a dualshock-tools tem
**[7.10]–[7.15]** e **[7.21]**: os canais 0x80/0x81 e 0x82/0x83, a **chave de
destravamento da NVS** (`0x65,0x32,0x40,0x0C`), os três códigos de estado da NVS,
o protocolo de calibração de centro e de amplitude com as respostas exatas, os
**12 valores de finetune na ordem de gravação**, os dados de fábrica por
`(base,num,tamanho)` e o modelo de placa pelo `hwinfo`. **É USB-only — e foi
descartado por isso, não por ser falso.**

### Convivência com o Steam — o que ele faz por baixo
**[5.20]/[3.15]** o cabo DESCONECTA o rádio, casando por serial (= endereço de
rádio); **[5.17]/[3.11]** o keepalive de 500 ms exclusivo do rádio, um 0x31 zerado
e sem CRC de propósito; **[5.11]/[3.12]** a cor do LED trancada por ~3,4 s;
**[5.16]** o modo estendido é bilhete só de ida — não se desliga sem desligar o
controle; **[3.10]/[8.9]** ler o feature 0x05 (ou 0x09, ou 0x20) ACORDA o
aparelho, **e qualquer escrita também**; **[5.12]** 1000 Hz de sensor no rádio
contra 250 Hz no cabo; **[5.21]** a coalescência que compara só dois bytes de
flag; **[5.9]** o `enhanced_rumble` que se liga sozinho quando não consegue ler o
firmware — cenário típico de rádio.

### udev e o nosso vpad
**[3.2]** a regra da Valve sem âncora de barramento alcança o nosso DualSense Edge
virtual; **[3.3]** a regra de `/dev/uinput`; **[3.1]** as duas gramáticas e o caso
das letras.

### Áudio e háptico por rádio
**[8.19]** os quatro reports do Senshi (0x32/142, 0x35/334, 0x36/398, 0x39/547) —
só o offset do 0x39 virou célula; o 0x36 e o 0x35 não; **[8.20]** o subpacote de
controller-data; **[7.22]** a SEQUÊNCIA de áudio da dualshock-tools (volume no
bloco de saída ANTES dos feature reports); **[8.18]** a decomposição do
`audio_control`; **[4.19]** o kernel não faz áudio por rádio, e o roteamento
depende de um `plugged_state` que só o ramo USB atualiza.

### Pro Controller
**[6.18]** o SSR/sniff amarrado à cadência de IMU, escrito no comentário do
driver; **[6.19]** o rate limiter de 60 ms e o rastreio de janela segura, ambos
exclusivos do rádio; **[6.22]** o PID que muda por transporte no NSO Genesis —
precedente de que o PID não discrimina por rádio; **[6.23]** o `hdev->version |=
0x8000` que muda o que o SDL e o evdev veem; **[6.24]** a IMU no segundo nó evdev,
que explica o giroscópio neutro do vpad; **[6.25]** as três origens do `uniq` e a
única que existe no rádio; **[6.10]** os subcomandos que existem e o driver nunca
emite — inclusive o **0x01 de pareamento manual** e o **0x06 de estado do HCI**.

### 8BitDo
**[9.1]** não há driver 8BitDo no kernel — em D-input por rádio é `hid-generic`;
**[9.2]/[9.3]** as cinco identidades e a regra +0x0100 do rádio; **[9.5]** os
offsets do 0x01 enhanced; **[9.6]** ler o feature 0x06 é o handshake **e** a via de
identidade; **[9.7]** o rumble 0x05 de 5 bytes, igual nos dois transportes;
**[9.11]** ~70 Hz e "Very Lossy" por rádio; **[9.17]** escrever no LED Home de um
terceiro **desliga o aparelho**; **[9.19]** rumble em X-input só no Plus, e por
quirk do `hid-microsoft`; **[9.25]** os endereços SPI da calibração de fábrica;
**[9.24]** os pisos de firmware (SN30 Pro v2.05) e o fwupd duas gerações atrás.

### Buracos declarados — onde nenhuma fonte lida sabe
**[4.6]** dez bytes do 0x31 de entrada que o driver não lê (o byte 1 e os 65..73);
**[4.16]** não existe, no kernel, handshake declarado de troca de modo;
**[4.17]** o report mínimo 0x01 por BT não é tratado para o DualSense — mas é para
o DualShock4; **[4.21]** o DualShock4 tem controle de intervalo de poll no rádio e
o DualSense não tem nada equivalente; **[4.22]** duas flags definidas e nunca
usadas e um campo `mic_volume` que nunca é escrito; **[5.13]** o `ucConnectState`
declarado e nunca lido; **[9.23]** o que o SN30 Pro comprovadamente não tem;
**[9.7 negativos]/[D9.7]** o VID:PID do SN30 Pro simples em X-input por rádio, o
layout desse modo, e se ele devolve 3 ou 6 no byte de tipo — **nada disso foi
achado, e estimar seria inventar**.
