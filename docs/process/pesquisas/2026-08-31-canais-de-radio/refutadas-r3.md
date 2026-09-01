# Rodada 3 — as 28 propostas que caíram, e por quê

31/08/2026. Terceira e última rodada da varredura de fontes externas atrás dos canais de
**rádio** que faltam em `docs/data/mapa-controles.csv`.

**Isto é uma lista do que NÃO se deve propor de novo.** Cada item traz o que foi proposto,
o `arquivo:linha` que o cético conferiu para derrubar, e — quando existe — a lição que vale
além do caso. As sobreviventes estão no relatório da rodada
(`bruto/resultado-w67p1y0q2.json`, campo `result.relatorio`); aqui só mora o negativo.

**Como as contas fecham (e onde elas não fecham).** O journal
(`bruto/journal-wf_bb551be6-318.jsonl`) tem **46** propostas de 16 propositores e **132**
resultados de cético — exatamente 44 × 3. As duas propostas que não foram julgadas são
`audio.saida_dedicada@dualsense` nas colunas `radio_report_id` e `radio_offset`: as duas
nasceram com valor `NÃO ACHEI` e grau `incerto`, e não chegaram aos céticos. Daí o
cabeçalho do resultado dizer `total_propostas: 44` / `sobreviveram: 16`, enquanto o corpo
do próprio relatório diz «68 + 46 propostas, 44 + 30 refutadas». **São 28 propostas
derrubadas por cético, mais 2 que se declararam vazias — 30 que não viraram célula.**

O casamento entre refutação e proposta não é explícito no journal; foi reconstruído por
conteúdo (id, coluna, endereços citados) e confirmado caso a caso. Onde três céticos
julgaram a mesma proposta, os três estão contados juntos.

---

## Contagem por padrão de erro

| # | Padrão | Propostas | Onde
|---|---|---|---
| A | **Fonte derivada vendida como testemunha independente** | 4 | `entrada.stick@sn30`, `energia.bateria.degraus@sn30`, `movimento.acelerometro@sn30`, `plataforma.nfc@pro`
| B | **Valor do CABO, ou de OUTRO controle, na coluna de rádio** | 4 | `entrada.botoes@sn30`, `vibracao.haptics_vcm@dualsense`, `movimento.giroscopio@sn30`, `luz.led_jogador@sn30`
| C | **A citação diz o CONTRÁRIO do que a proposta afirma** | 3 | `vibracao.haptics_vcm@dualsense/radio_codigo_ref`, `vibracao.rumble.passthrough@sn30`, `plataforma.handshake_usb@pro/radio_evidencia`
| D | **Ausência afirmada com confiança e desmentida no mesmo arquivo** | 4 | `vibracao.rumble.ff@sn30/radio_offset`, `plataforma.escrita_crua@sn30`, `plataforma.distinguir_clone@pro/radio_evidencia`, `plataforma.limitador_subcomando@pro`
| E | **Endereço `arquivo:linha` que não confere** | 3 | `movimento.imu.ligar@sn30/radio_offset`, `movimento.imu.perda@pro/radio_offset`, `plataforma.distinguir_clone@sn30/radio_report_id`
| F | **Aritmética ou fórmula errada, com número plausível** | 2 | `vibracao.rumble.frequencia@sn30/radio_offset`, `plataforma.taxa_relatorios@pro/radio_offset`
| G | **Coluna errada (o fato é bom; o lugar, não)** | 2 | `gatilho.leitura@dualsense/radio_codigo_ref`, `plataforma.declarado_sem_resposta@dualsense`
| H | **A lente do aparelho: esta árvore não faz isso** | 2 | `plataforma.vpad@pro` (`radio_offset` e `radio_evidencia`)
| I | **Medição que a casa JÁ PAGOU, pedida de novo (ou ineditismo falso)** | 3 | `luz.led_jogador@dualsense/radio_evidencia`, `plataforma.distinguir_clone@pro/radio_offset`, `plataforma.sniff@pro`
| J | **Convenção da casa inventada a partir da minoria** | 1 | `movimento.giroscopio@dualsense/radio_report_id`
| | **Total** | **28** |

Padrões que aparecem como defeito **secundário** em quase todos: duplicar célula irmã com
endereços divergentes; e carimbo de grau que não casa com o conteúdo.

---

## A — Fonte derivada vendida como testemunha independente (4)

**Uma só frase derruba as quatro**, e ela está no topo do arquivo que todas citam.
`eden-emu/eden`, `src/input_common/helpers/joycon_protocol/joycon_types.h:7-10`:

```
// Based on dkms-hid-nintendo implementation, CTCaer joycon toolkit and dekuNukem reverse
// engineering https://github.com/nicman23/dkms-hid-nintendo/blob/master/src/hid-nintendo.c
// https://github.com/CTCaer/jc_toolkit
// https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering
```

A primeira base é o **mesmo driver** que esta árvore embarca em
`assets/dkms/hid-nintendo/hid-nintendo.c`; a terceira, o **dekuNukem**, já foi varrido nas
rodadas 1 e 2. A identidade byte a byte entre `InputReportActive` (`:526-538`) e
`struct joycon_input_report` (`:603-617`) não é convergência de duas testemunhas — é
**cópia declarada**, e cópia é o resultado esperado quando o autor diz que copiou.

**Lição transferível:** *toda concordância entre o Eden/yuzu e o `hid-nintendo` tem peso
evidencial ZERO, porque o Eden declara ter copiado o `hid-nintendo`.* Antes de chamar uma
fonte de independente, leia o cabeçalho do arquivo. A casa já tinha registrado a forma
exata deste erro em `audio.alto_falante@dualsense` («O Senshi não é fonte independente:
cita o DS5Dongle»).

| Proposta | O que se propôs | O que a derrubou além do cabeçalho
|---|---|---
| `entrada.stick@sn30` / `radio_evidencia` | A cadeia de código que fixa o 0x30, com «DUAS testemunhas independentes (o driver local e o Eden, que nunca se leram)» | O Eden tem `InputReportPassive` (`joycon_types.h:518-524`) para o modo `SIMPLE_HID_MODE = 0x3F` (`:212`), com OUTRA planta — logo «por rádio não há um segundo id candidato» é falso. O que é verdade é só que o `hid-nintendo` **descarta** o 0x3F em silêncio (`:2994-2995`); a proposta inflou «o driver não parseia» para «o aparelho não manda»
| `energia.bateria.degraus@sn30` / `radio_evidencia` | «É a terceira leitura independente do byte, depois do driver e do dekuNukem» | O argumento do grep («`usb`/`bluetooth` = zero ocorrências, logo não há ramo de transporte») é não-sequitur: o Eden **não implementa barramento nenhum além de um** — `USB_CMD = 0x80` (`:120`), `enum class UsbSubCommand` (`:165`), `PRE_HANDSHAKE = 0x91` (`:172`) e `INPUT_USB_RESPONSE = 0x81` (`:213`) estão declarados e nunca chamados em `.cpp` algum
| `movimento.acelerometro@sn30` / `radio_report_id` | «Duas implementações que nunca se leram descrevem o mesmo report id com o mesmo layout» | Também **NO-OP**: `docs/data/mapa-controles.csv:177` já traz `entrada 0x30`, em HEAD e HEAD~1. E o «byte a byte» é falso por soma: o Eden tem `motion_input` de 24 B + padding + `ring_input` = 41 B (`static_assert 0x29`); o driver tem `imu_raw_bytes[12*3]` = 49 B. O `ring_input` do Eden cai **dentro** da região que o driver lê como terceira amostra
| `plataforma.nfc@pro` / `radio_offset` | Offsets do pacote MCU/NFC lidos «numa implementação que de fato fala MCU» | Além da derivação: `0x170 = 368 B` é o tamanho do **buffer** passado a `SDL_hid_read_timeout`, não de report no fio; e o `crc` do `MCUCommandResponse` carrega a anotação do próprio autor `// This is never used` (`joycon_types.h:769`) — forma de struct, não protocolo

---

## B — Valor do CABO, ou de OUTRO controle, na coluna de rádio (4)

**Lição transferível:** *um número só entra numa célula de rádio se a fonte disser
«rádio», deste aparelho.* A ressalva no campo `raciocinio` não salva: **o `raciocinio` não
viaja com a célula** — quem abre o mapa lê só o `valor`.

- **`entrada.botoes@sn30` / `radio_offset`** — a tabela de bits do `button_status`
  (bytes 3-5) veio certa, mas serviu **quatro botões de outro aparelho**: `SR_R 0x10`,
  `SL_R 0x20`, `SR_L 0x10`, `SL_L 0x20` são os botões de TRILHO do Joy-Con, que o SN30 Pro
  não tem. O próprio driver prova: `procon_button_mappings`
  (`assets/dkms/hid-nintendo/hid-nintendo.c:495-511`) tem **14** entradas e nunca lê os
  bits 4, 5, 20 e 21; o `rotulo` da linha no CSV lista os mesmos 14.
  Defeitos somados: `hid_field_extract` está em **`:1942`**, não `:1943` (a função vai de
  1937 a 1946); e o `raciocinio` cita a célula `radio_evidencia` como apontando para
  `troubleshooting-8bitdo.md:240-266` quando ela diz `:31,204-222`.

- **`vibracao.haptics_vcm@dualsense` / `radio_offset`** — o bloco háptico TLV no 0x39
  (tag 0xD2 em `[10]`, dois quadros em `[12..139]`). Os catorze endereços do
  `awalol/DS5Dongle` conferem, um a um. Mas **`audio.cpp:349` diz, em chinês, que os
  3000 Hz são do DS5 «conectado por fio»** — e a célula os publicava como fato de rádio.
  E o achado já estava no mapa: a linha irmã `audio.alto_falante@dualsense/radio_offset`
  traz o mesmo arranjo com commit pinado, **e** a fonte que o contradiz
  (`TechAntohere/Senshi`, `DualSenseBtReportBuilder.kt:992-993`, que põe o mesmo bloco em
  `[413..542]` — 403 bytes de diferença no mesmo report). Dois arranjos incompatíveis não
  fazem um offset.

- **`movimento.giroscopio@sn30` / `radio_offset`** — o valor afirmava «o relatório 0x30 de
  **49 B**» e «cada uma das **3 amostras**». Os dois números são do **Pro genuíno**: os 49 B
  saem da seção intitulada «O Pro Controller genuíno»
  (`docs/protocol/externos-referencia-canonica.md:295-298`), e as 3 amostras dos 267,2 SYN/s
  que a canônica rotula «no genuíno pelo rádio» (`:894`). **Esta linha já foi rebaixada uma
  vez por exatamente isso** — a `nota` dela registra: «14/08/2026: LEI 2 —
  `radio_de_onde_sei` caiu de `medido` para `inferido-do-codigo`: a medição de taxa citada
  foi feita no Pro GENUÍNO, e não neste clone». E o driver não sustenta os números:
  `joycon_ctlr_read_handler` (`:2994-2999`) só guarda `if (size >= 12)` antes de parsear
  três amostras — nunca confere 49 bytes.

- **`luz.led_jogador@sn30` / `radio_evidencia`** — 90% da proposta era boa. Caiu por
  «a unidade desta casa é o SN30 Pro (2dc8:6001, 2018)»: pela tabela da própria casa
  (`docs/protocol/externos-firmware-e-modos.md:146-150`), **`2dc8:6001` é o modo D-input**,
  servido por `hid-generic`; o modo Switch é `057e:2009`, e a tabela do driver
  (`hid-nintendo.c:3249-3271`) só casa `USB_VENDOR_ID_NINTENDO`. Num aparelho `2dc8:6001` a
  cadeia inteira que a célula documenta **não roda**. Somado: `EXTERNAL_PLAYER_LED_ENABLED`
  está em `daemon/subsystems/external_identity.py:199`, não `:194` (endereço herdado errado
  do `cabo_evidencia` da mesma linha — **dívida a corrigir nos dois lados**).

---

## C — A citação diz o CONTRÁRIO do que a proposta afirma (3)

**Lição transferível:** *abra a linha citada e leia o cabeçalho da SEÇÃO em que ela está.*
Duas das três caíram porque a linha existe, o texto é literal, e o parágrafo em volta diz o
oposto.

- **`vibracao.haptics_vcm@dualsense` / `radio_codigo_ref`** — os três céticos acharam a
  mesma inversão. A proposta escreve «Portão que já nomeia esta dívida pelo nome:
  `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:71`». A linha 71 está **dentro da
  seção aberta em `:67`: "O QUE ESTE PORTÃO NÃO VIGIA, e por quê (decisões medidas, não
  descuido)"**, e o texto de `:69-75` **isenta** o `BLOCO_HAPTICS`: «vocabulário de
  protocolo… que não têm chamador POR DESENHO. Uma constante é um VALOR, não um
  comportamento», medido em 12/08/2026. A proposta transformou uma isenção escrita em
  endosso. Somados: «o ÚNICO montador TLV desta árvore» é falso
  (`scripts/ensaios/corpo_do_degrau.py:178-184` também monta); «os dois bits que o quadro
  DUPLO de háptico usa» não existe em código nenhum — o comentário do próprio módulo
  (`integrations/dualsense_bt_audio.py:226-227`) atribui o bit6 ao **alto-falante**.

- **`vibracao.rumble.passthrough@sn30` / `radio_report_id`** — «Nenhum report sai do Hefesto
  para este controle, em transporte nenhum», e **três palavras depois** a própria célula
  nomeia `enable_imu`, que escreve 12 bytes crus no hidraw
  (`core/external_leds.py:155-167` monta `0x01` + 8 B de rumble + subcmd `0x40`; `:170-193`
  faz o `os.write`; a docstring do módulo, `:21-27`, diz «é a ÚNICA exceção que sai do
  sysfs e escreve um output report CRU no hidraw»). A conclusão é certa pelo motivo errado:
  o SN30 não recebe aquele report porque o gatilho é `e_pro_genuino` (que exclui o 8BitDo
  por OUI) **mais** `bus != _IMU_ENABLE_ALLOWED_BUS` («FASE 1: BT bloqueado»),
  `daemon/subsystems/external_identity.py:923-932`.

- **`plataforma.handshake_usb@pro` / `radio_evidencia`** — a proposta cita
  `SDL_hidapi_switch.c:718` («The 8BitDo M30 and SF30 Pro don't respond to this command,
  but otherwise work correctly») para concluir que não responder ao handshake não é sinal de
  aparelho quebrado. **O comentário é do comando da linha ACIMA** — `HighSpeed` (0x03,
  `:123`), o equivalente do `JC_USB_CMD_BAUDRATE_3M`. O handshake é 0x02 (`:122`), e o SDL
  **não** o tolera: falha do primeiro `Handshake` (`:714`) aborta a abertura (`:1656`).
  Guardar essa frase negaria a premissa do patch `0003` desta árvore, que existe porque o
  clone `057e:2009` não responde ao handshake e o probe morre em `-ETIMEDOUT`.
  Segundo defeito, independente: «as cinco chamadas de `joycon_send_usb()` estão todas
  dentro dos `if (joycon_using_usb)` de `:2847` e `:2854`» — a de **`:1151` não está**: ela
  vive em `joycon_query_usb_conn_status()` (`:1137`), alcançada por `:2849` atrás de uma
  segunda tranca que a proposta omite, o `module_param usb_send_conn_status` (`:104-105`),
  `static bool` sem inicializador — **falso por omissão**.

---

## D — Ausência afirmada com confiança e desmentida no mesmo arquivo (4)

**Lição transferível, e é a mais barata de aplicar:** *"não há ramo de barramento no caminho
X" é a afirmação mais frágil desta rodada.* Quem a fizer tem de greppar **as duas formas** —
`joycon_using_usb` **e** `hdev->bus` cru — porque o helper (`hid-nintendo.c:862-864`) não
cobre os cinco testes diretos: **`:980`, `:2022`, `:2346`, `:2410`, `:2817`**. E o `:2022`
mora **dentro de `joycon_parse_report`**.

- **`vibracao.rumble.ff@sn30` / `radio_offset`** — «não há ramo de barramento em nenhum ponto
  do caminho de rumble» é falso: `joycon_send_rumble_data` chama `joycon_enforce_subcmd_rate`
  em `:2069`, e a condição do laço (`:1018`) avalia
  `JC_SUBCMD_RATE_LIMITER_MS(ctlr)` = `hdev->bus == BUS_USB ? 20 : 60` (`:980`). Neste fork
  ele pode até **descartar** o pacote (`:2070-2072`). A ressalva certa é «o barramento não
  desloca byte», não «não há ramo».
- **`plataforma.escrita_crua@sn30` / `radio_report_id`** — a mesma frase, o mesmo desmentido,
  e a proposta reescrevia com ~900 caracteres uma célula que **já dizia `saída 0x01`**
  (`docs/data/mapa-controles.csv:219`, `git status` limpo, valor atravessando `8de5ba3c`,
  `8fd32ba5` e além). A proposta citou `:867-880` (`__joycon_hid_send`, que de fato não lê
  `bus`) e generalizou de uma função para o caminho inteiro, sem procurar o degrau entre
  `joycon_hid_send_sync` (`:1051`, chama o limitador em `:1062`) e ela.
- **`plataforma.distinguir_clone@pro` / `radio_evidencia`** — «o grep devolve os TRÊS donos da
  regra por negativa e nada mais que DECIDA». São **quatro**: falta
  `scripts/bt_nosniff_now.sh:70` (`OUIS_CLONE=("e4:17:d8")`), que **decide** (`:122-124`
  recusa o no-sniff na faixa do clone) e que é exatamente «o helper» que o próprio
  `raciocinio` nomeia como decisor (`assets/82-nintendo-pro-nosniff.rules:96` o chama no
  `RUN+=`). Dos três listados, `doctor.sh:2975` só **relata**. E o método não conserta com
  uma linha a mais: **grep por literal é estruturalmente cego a quem IMPORTA a constante** —
  `app/actions/external_controllers.py:88` faz `_BRAND_BY_OUI = dict.fromkeys(OUIS_CLONE, …)`
  e decide marca por OUI sem copiar o literal. Uma célula que ensina «rode este grep e você
  tem os donos» ensina um censo que erra por construção, e erra para MENOS.
- **`plataforma.limitador_subcomando@pro` / `radio_report_id`** — o esqueleto conferiu inteiro
  (três ids de saída, `0x03`/`0x11` mortos, `0x80` só no cabo, tamanhos 10 B e 11 B+`data[]`).
  Caiu na frase de fecho: «um controle preso no relatório simples … **nunca libera subcomando
  algum, calado**». Falso num build padrão desta árvore: ao esgotar `max_attempts`,
  `:1022-1036` transmite assim mesmo (`skip_tx_on_rate_exceeded` é `static bool` sem
  inicializador, `:77-80`), e o limitador **nem roda durante o init**, fora do estado
  `JOYCON_CTLR_STATE_READ` (`:990-991`).

---

## E — Endereço `arquivo:linha` que não confere (3)

- **`movimento.imu.perda@pro` / `radio_offset`** — **os três céticos bateram no mesmo byte, e
  esta é a lição mais transferível da rodada.** O valor chamava o `u8 timer` do
  `joycon_input_report` de **`corpo[1]`**. Na notação desta casa ele é **`corpo[0]`**.
  A convenção está definida em `scripts/ensaios/imu_no_cabo.py:143-150` — «o `corpo` é onde
  começa o struct dentro do buffer lido do hidraw (que já vem com o byte do report id em
  `data[0]`)», com `{CABO: corpo 1, RADIO: corpo 2}` — e fixada por 21 ocorrências no CSV,
  todas do DualSense (`corpo[6]` = `seq_number`, `corpo[11..14]` = `reserved[4]`, etc.).
  **O `corpo` EXCLUI o report id.** E é aí que os dois drivers divergem:
  `hid-playstation.c:1581` casteia `&data[1]` (a struct do DualSense **não** tem campo `id`),
  enquanto `hid-nintendo.c:2998` casteia `data` **cru** (a struct do Pro **tem** `u8 id` em 0).
  -> *Todo índice de struct do `hid-nintendo` traduzido para a notação `corpo[N]` desta casa
  tem de perder 1.* Sem isso, `corpo[1]` do Pro é o `bat_con` — bateria — e quem seguir o
  ponteiro lê delta zero e conclui «o contador não anda».
  Defeito secundário, também de endereço: «o caminho de parse não tem ramo de `hdev->bus`» é
  literalmente falso (`:2022`); o suporte correto é o cast incondicional de `:2994-2998`.

- **`movimento.imu.ligar@sn30` / `radio_offset`** — as posições `[10]` e `[11]` estão certas;
  cai o conteúdo de `[2..9]`. A célula dizia «8 B de rumble (o driver copia a fila corrente;
  **neutro quando parada**)» e «bate byte a byte com o `cabo_comando` (`01 <pkt> <8B rumble
  neutro> 40 01`)». **Não bate, e nunca bateu:** o `ctlr` é `devm_kzalloc` (`:3070`);
  `joycon_init` (`:3122`) manda o 0x40 (`:2937`) **antes** de `joycon_input_create` (`:3164`)
  chegar a `joycon_config_rumble` (`:2328`), onde `rumble_data` é escrito pela primeira vez.
  Logo o `memcpy` de `:1199-1200` copia **oito zeros**.
  E o `SubCommandPacket` do Eden citado como corroboração está em `:545-551`, não
  `:733-750` — erro de ~190 linhas —, e ele **contradiz** o tamanho: `static_assert(… == 0x31)`
  = 49 B contra os 12 B do kernel. A regra da casa é «se duas fontes divergem, RELATE — não
  escolha»; a proposta escolheu e apresentou a divergente como concordante.

- **`plataforma.distinguir_clone@sn30` / `radio_report_id`** — a mecânica confere inteira
  (`0x01`+`subcmd 0x02` -> `0x21`; MAC em `data[4..9]`; `uniq = mac_addr_str` em `:2350`/`:2414`).
  Caem três coisas, e a primeira está **dentro do `valor`**: «o endereço do BlueZ em
  `scripts/bt_active_mode.sh:104-108`» — `:100-112` é `_adaptadores()`, que enumera os
  **adaptadores HCI locais** por `^hci[0-9]+$`; não há ali endereço de controle nenhum. As
  faixas que decidem clone × genuíno estão em `:178`, `:193`, `:205-206`.
  Segunda: o `so_a_bancada` afirma que «a regra 82 é escopada em `HID_UNIQ=="e0:f6:b5:*"`,
  logo não alcança o clone» — `assets/82-nintendo-pro-nosniff.rules:92-93` casa **qualquer**
  HID por Bluetooth com `HID_NAME` contendo "Pro Controller", **de propósito** (`:29-34`:
  «A regra casar o clone não é descuido»); quem barra é o helper, por negativa.
  Terceira: `LIC_PRO = 0x06` creditado a «o dossiê da linux-input» — `grep -rn "LIC_PRO"` na
  árvore devolve **zero**; a única fonte de `0x06` nesta casa é o SDL.
  E a «novidade que mais vale» está invertida: o `radio_evidencia` da própria linha
  (`docs/data/mapa-controles.csv:215`) já conclui «o byte de tipo **NÃO** separa este clone».

---

## F — Aritmética ou fórmula errada, com número plausível (2)

- **`vibracao.rumble.frequencia@sn30` / `radio_offset`** — a fórmula usa **Hz onde o driver
  usa CÓDIGO de tabela**. `joycon_encode_rumble` (`:2156-2159`) escreve
  `freq_data_high.high` e `freq_data_low.low`, campos de
  `struct joycon_rumble_freq_data { u16 high; u8 low; u16 freq; }` (`:264-268`), procurados
  em `joycon_rumble_frequencies` (`:281-337`). Conferido nos defaults que a própria célula
  nomeia: 320 Hz -> `{ 0x0001, 0x60, 320 }`, e o driver emite `data[0] = 0x00`; quem aplicar a
  fórmula ao pé da letra escreve `(320>>8)&0xFF = 0x01`. Com amplitude 0 o driver manda
  **`00 01 40 40`**; a célula faria alguém mandar **`01 40 40 40`** — bytes errados e
  plausíveis o bastante para passar.
  E «não há byte de frequência puro» é falso: `data[0] = (freq_data_high.high >> 8) & 0xFF`
  não tem parcela de amplitude — report[2] e report[6] **são** frequência pura.

- **`plataforma.taxa_relatorios@pro` / `radio_offset`** — o valor elevava o `u8 timer`
  (byte 1) a «o único jeito de separar relatório perdido de relatório atrasado». O autor do
  driver, com o Pro na bancada dele, **desqualifica esse uso por escrito**
  (`hid-nintendo.c:1636-1640`): «There's a quickly incrementing 8-bit counter per input
  report, but it is not very useful for this purpose (it is not entirely clear what rate it
  increments at…)». A proposta cita essa frase — no campo `so_a_bancada` — e preenche a
  célula como se a dúvida estivesse resolvida. A segunda fonte não ajuda: em eden/yuzu,
  `packet_id` aparece em **três headers e zero `.cpp`**. Nenhuma das duas fontes jamais leu
  esse byte. E a coluna, nesta chave, tem sentido fixado pela linha irmã
  `plataforma.taxa_relatorios@dualsense`: `*_offset` guarda a **constante que governa a taxa**
  (`MOTION_EMIT_MAX_HZ = 250.0`), não posição de byte.

> **Um erro de aritmética atravessou DUAS propostas e foi pego por três céticos** — vale
> como lição isolada: o **`≥64 ms`** por rádio está errado, o piso é **`≥60 ms`**. O carimbo
> `ctlr->last_subcmd_sent_msecs = current_ms` é gravado em `:1039`, **antes** do
> `msleep(JC_SUBCMD_TX_OFFSET_MS)` de `:1047`, e o teste de intervalo (`:1018`) compara
> contra esse mesmo carimbo pré-sleep. Os 4 ms são deslocamento de **fase**, constante, que
> se cancela na diferença entre dois envios: `(S(n+1)+4) − (S(n)+4) = S(n+1) − S(n) ≥ 60`.

---

## G — Coluna errada: o fato é bom, o lugar não (2)

- **`gatilho.leitura@dualsense` / `radio_codigo_ref`** — a proposta mais bem conferida da
  rodada (dois céticos disseram isso com todas as letras) caiu pelo destino. `radio_codigo_ref`
  está preenchida em **204 linhas** e **nenhuma** carrega referência externa — zero
  ocorrências de `http`, `github` ou `.cpp`; todas apontam para dentro desta árvore, e
  `gerar-mapa.py:716` rotula a célula «Referência no código». Existe coluna própria:
  **`fonte_externa`** (nº 44, 21 linhas), com precedente do MESMO repositório na linha vizinha
  `audio.alto_falante@dualsense` e **com SHA pinado**
  (`awalol/DS5Dongle@17385f8beeef17129f0b39d9e5fc2195ea89b322`). A proposta despejava três
  URLs sem SHA num campo que nunca teve uma.
  **Lição:** *referência externa vai em `fonte_externa`, com commit pinado; `*_codigo_ref` é
  endereço DESTA árvore.*

- **`plataforma.declarado_sem_resposta@dualsense` / `radio_offset`** — o conteúdo é pilha do
  **host** (`usbhid`, `hidraw`, `uhid`, `hidp`, BlueZ) e vale igual para os três aparelhos;
  nenhum byte fala do DualSense, numa coluna de endereço de byte cujo `cabo_offset` está
  vazio. Pior, o carimbo: `radio_de_onde_sei` desta linha é **`medido`** (censo 17/17 de
  15/08), e `check_paridade_transporte.py:179-186` cobra proveniência **por lado, não por
  célula** — escrever leitura de kernel ali faz `inferido-do-codigo` viajar sob selo de
  medição. Junto veio um endereço trocado: `drivers/hid/usbhid/hid-core.c:301`
  (`case -EPIPE: /* stall */`) está dentro de **`hid_irq_in()`** — o URB do endpoint de
  **interrupção**, que nem devolve errno ao espaço de usuário; o `-EPIPE` do caminho de
  **controle** é `:498`, dentro de `hid_ctrl()`, com outro comentário
  (`/* report not available */`).

---

## H — A lente do aparelho: esta árvore não faz isso (2)

**`plataforma.vpad@pro`, colunas `radio_offset` e `radio_evidencia`.** Os ~37 offsets do vpad
conferem byte a byte. As duas células caem pela mesma razão de fundo: **nesta árvore não
existe vpad para o Pro Controller.** A única fonte do conjunto `want` do `CoopManager.sync` é
`discover_dualsense_evdevs()` (`daemon/subsystems/coop.py:679-683`), que filtra
`gp.especie == ESPECIE_DUALSENSE` (`core/evdev_reader.py:395-399`); a própria árvore escreve
«8BitDo e Nintendo nunca chegam a `_players`» (`coop.py:1204-1207`). A sprint
`2026-08-06-LUGAR-A-MESA-01` mediu e escreveu a frase: **«O promotor aceita; o descobridor não
entrega nenhum.»** A adoção é a E3 daquela sprint, **aberta e esperando a palavra dela**.
E «nasce SEMPRE `BUS_USB`» é falso em quatro ramos: `virtual_pad.py:267-269` devolve
`None, None` para flavor ≠ `dualsense` («Xbox não é trabalho do uhid») e cai em
`UinputGamepad`, que é evdev puro — sem report HID, sem `UHID_CREATE2`, sem offset nenhum; e
o default é `DEFAULT_FLAVOR = "xbox"` (`integrations/uinput_gamepad.py:175`).

Somado, e vale por si: **«o código o rejeita como blueprint» é falso.**
`integrations/uhid_gamepad.py:679-683` é comentário, terminando em «Aqui só se registra o
fato, para quem estiver inspecionando»; `:684` é o `if b"\x85\x31" in descriptor:` e
`:685-686` é um `logger.info` — sem `return`, sem `raise`, sem desvio. A função **segue** e
devolve o descritor de rádio em `:712`. O que de fato mantém o descritor de rádio fora do
vpad é outra coisa, em outro arquivo: `_try_uhid` injeta sempre `canonical_blueprint()`
(`integrations/virtual_pad.py:282`), e `capture_dualsense_blueprint` está fora do caminho de
criação desde VPAD-03/BT-01 — a própria docstring diz isso em `:650-655`, e ela tem **zero
chamadores em `src/`**. *A proposta trocou uma decisão de arquitetura por um mecanismo de
código que não existe, e deu endereço preciso para ele.*

---

## I — Medição que a casa JÁ PAGOU, ou ineditismo falso (3)

**Lição transferível:** *antes de pedir bancada ou anunciar novidade, rode o grep na árvore
inteira e leia as colunas VIZINHAS da mesma linha.* As três caíram por não olhar ao lado.

- **`luz.led_jogador@dualsense` / `radio_evidencia`** — a proposta pedia o «ensaio afirmativo
  por rádio (padrão pedido, padrão visto, daemon parado)». **Ele já foi feito**, e está na
  coluna vizinha da MESMA linha: `radio_detalhe` (`docs/data/mapa-controles.csv:130`) diz
  «MEDIDO 11/08/2026 no aparelho dela, **com o daemon PARADO** … o byte 43 muda o aparelho na
  hora (pisca de 20 s que ela viu) … **Vale nos DOIS transportes: o cabo recebeu 0x02 de 64 B
  e o rádio 0x31 de 78 B com CRC**». Mais quatro registros em `docs/data/ensaios.csv` com
  `transporte: radio` e `observado_por: olho-dela`. Aceitar o texto **rebaixaria** o
  `radio_de_onde_sei` de `medido` para `afirmado-no-doc` — a própria proposta declarava isso.
  E a prova oferecida é da flag errada, no sentido contrário: o `0x08` é RELEASE_LEDS, e a
  docstring de `core/lightbar_reset.py:56-58` diz que esse report «não toca … player LEDs»;
  as lâmpadas apagam porque o host **desiste** do claim.
  **O achado real da proposta continua de pé e vira dívida:** `radio_evidencia[27]` é
  `cabo_evidencia[26]` **copiado byte a byte** mais uma frase (`.startswith()` = True).

- **`plataforma.distinguir_clone@pro` / `radio_offset`** — a metade «CORREÇÃO DE FATO» está
  certa e confirmada (o produto decide por **negativa** desde 22/08:
  `normalizar_oui(uniq) in OUIS_CLONE`, `core/linhagem_nintendo.py:70`; `NINTENDO_REAL_OUI` é
  só alias em `external_identity.py:213`). Cai o acréscimo: «o que o SN30 desta bancada
  devolve nesse byte NÃO FOI ACHADO em fonte nenhuma». **Foi** —
  `docs/protocol/externos-firmware-e-modos.md:104-122`, medido em 11/08/2026 no journal dela:
  o clone RESPONDEU ao `REQ_DEV_INFO`, a identidade **não** foi sintetizada (o MAC é
  `E4:17:D8:00:00:1A`, não o `02:` fabricado por `joycon_synthesize_info`), logo o `ctlr_type`
  daquele boot veio do byte 17 do firmware do clone. O `so_a_bancada` mandava repetir ensaio
  já respondido.

- **`plataforma.sniff@pro` / `radio_evidencia`** — os três céticos derrubaram pelo mesmo fato:
  «a sigla NÃO APARECE em lugar nenhum do repositório (grep vazio por 'SSR')» é falso.
  `docs/protocol/driver-hid-nintendo-por-dentro.md:456` já traz a sigla **e** o mecanismo
  desde 11/08/2026 (commit `3b4ea691`) — e esse arquivo é **uma das quatro referências de
  driver que o `CLAUDE.md` manda ler em terceiro lugar**. A cadeia «cadência -> -110» também
  já é da casa, com grau MAIOR: `externos-referencia-canonica.md:319-338`, GRAU ALTA.
  E há reinjeção de fato refutado: a proposta trazia o «every 8 ms (this is the wildcard)» do
  comentário do driver (`:1652`); a casa mediu **11,27 ms** por três rotas independentes e o
  §5.4 do mesmo documento diz «o 8 ms declarado é refutado». **Pôr o 8 ms numa célula deixa as
  duas versões vivas — o defeito que a regra "fato errado se SUBSTITUI" existe para matar.**
  (Está registrado como divergência nº 10 do relatório: «Já refutado — registrar para não
  voltar».)

---

## J — Convenção da casa inventada a partir da minoria (1)

**`movimento.giroscopio@dualsense` / `radio_report_id`.** A célula já contém `—` (U+2014) e
os dois céticos que a derrubaram **não** discutem o travessão: derrubam a **regra** com que a
proposta o justificou — «report id é endereço de canal `hidraw`/`uhid`; em canal `evdev` a
coluna não se aplica». O CSV faz o contrário: das **29 linhas com `radio_canal = evdev`,
13 têm a célula decidida, e dessas 10 trazem um report id contra 3 que trazem `—`**. Os
contraexemplos são vizinhos imediatos — `entrada.bruta@dualsense` (mesmo aparelho, `evdev`
nos dois lados, `0x01`/`0x31`, grau **`medido`**), `movimento.giroscopio@pro`,
`movimento.acelerometro@pro` e `@sn30`. As «três provas de coerência interna» da proposta só
olham para dentro da minoria de três linhas que ela quer defender.
Somados: a auditoria descrita («conferi os **8** commits que tocaram o arquivo») não é a
auditoria feita — são **34**; a conclusão sobrevive e sai reforçada, mas o número era
confiante e falso. E o grau proposto (`inferido-do-codigo`) **rebaixaria** uma linha que é
`medido` desde `caf2f12b`, com evidência de bancada de 15/08.

**Isto não é lacuna de medição — é incoerência de convenção, e a decisão é dela**, com o preço
de cada lado na mesa: manter `—` obriga a esvaziar 10 células hoje preenchidas; adotar o
portador obriga a preencher as três do DualSense.

---

## As duas que nem chegaram aos céticos

`audio.saida_dedicada@dualsense`, colunas `radio_report_id` e `radio_offset`. O propositor
declarou **`NÃO ACHEI`**, grau `incerto`, e escreveu que «a busca de 31/08/2026 fechou portas
em vez de abrir». Não foram julgadas; contam como lacuna que a rodada não fechou, não como
proposta refutada. **É a resposta honesta, e não deve ser reproposta sem fonte nova** — o
relatório da rodada nomeia o único caminho restante: varredura de `linux-input` /
`linux-bluetooth` de 2026 atrás de patch de áudio BT do DualSense em voo, e o ensaio E-1 da
bancada.

---

## Sobreviveram raspando — o que o cético que NÃO derrubou acrescentou

Sete células entraram no mapa com pelo menos um dos três céticos votando pela recusa, ou com
correção obrigatória de quem não derrubou. **Estas correções são parte da entrega, não
sugestão:**

| Célula | O reparo, e quem o achou
|---|---
| `movimento.giroscopio@sn30/radio_evidencia` | Os **49 B** e os **267 SYN/s** são do **Pro genuíno**, não do SN30 — rotular ou cortar (o mesmo defeito que derrubou o `radio_offset` da linha)
| `movimento.giroscopio@sn30/radio_report_id` · `movimento.imu.ligar@sn30/radio_report_id` | **NO-OP**: o valor já está na árvore e em `HEAD~1`. Entram sem mudar nada — o detector de lacunas leu célula preenchida como vazia
| `vibracao.rumble.ff@sn30/radio_evidencia` | Retirar a citação `"we're beholden to USB's polling rate"` atribuída ao patch da linux-input: é **comentário do driver** (`hid-nintendo.c:2018`). E o número medido (2,5-4 % de conformidade) é do **8BitDo Pro 2**, não do SN30 Pro
| `audio.alto_falante@dualsense/radio_evidencia` | É **ACRÉSCIMO, não substituição** — o parágrafo de 11/08/2026 tem de ser preservado byte a byte («Zero linhas de implementação», «escolhe-se o degrau pelo tamanho do payload», «(o fone dela)»). E o argumento do MTU do BlueZ **sai**: prova a direção errada (`imtu` × `omtu`), e a medição do `btmon` já sustentava sozinha
| `luz.led_home@pro/radio_offset` | O report tem 16 B, mas são **17 B no ar** — o HIDP prefixa o 0xA2. E a corroboração yuzu/Eden **não foi verificável** (repos 404/403/451): deixar como não conferida
| `movimento.imu.perda@pro/radio_evidencia` | Cortar «`avg = 15` (o ramo do cabo)» — **não existe ramo de cabo**; 15 é a semente inicial de qualquer link. E o `89,2 rel/s` está em `externos-referencia-canonica.md:377`, não `:379-380`
| `plataforma.handshake_usb@pro/radio_report_id` | `radio_report_id` é **coluna de travessão seco** nesta casa (mediana 12 caracteres); o parágrafo pertence a `radio_evidencia`
| `gatilho.leitura@dualsense/radio_offset` | Nenhum dos três derrubou, mas os três corrigiram procedência: **dois dos três endereços citados não são código** — o struct de `ds5dongle/utils.h` está inteiro dentro de `/* … */` (abre em `:152`, fecha em `:256`) e o `PS5Parser.h:130-131` está dentro de `#if 0`. Em compensação apareceu uma **quarta testemunha compilada** que a proposta não citava (DS4Windows, `ds4state_main.cs:351-352`/`:355`). E `SDL_hidapi_ps5.c:1634` é o ramo **alternativo**, não o de rádio

---

## O que fazer com isto na próxima rodada

Seis perguntas, na ordem em que teriam evitado as 28. Todas custam menos de um minuto:

1. **A célula já está preenchida?** `git show HEAD:docs/data/mapa-controles.csv` — 5 das 28
   eram NO-OP, e uma reescrevia 10 caracteres certos com 900.
2. **A fonte diz de quem copiou?** Leia as 10 primeiras linhas do arquivo antes de chamá-la
   de independente. Custou 4 células.
3. **O número é de rádio, deste aparelho?** Se a fonte diz «por fio», «Pro genuíno» ou
   «Pro 2», o número não entra numa célula de rádio do SN30. Custou 4.
4. **A linha citada está dentro de qual seção?** Duas propostas citaram texto literal cujo
   parágrafo dizia o oposto.
5. **O grep foi feito nas DUAS formas?** `joycon_using_usb` **e** `hdev->bus`;
   literal **e** `import`. Custou 4.
6. **Isto é a coluna certa, e o carimbo de grau da linha aguenta?** `*_codigo_ref` é interno,
   `fonte_externa` é externo com SHA, `*_report_id` é travessão seco. E escrever
   `inferido-do-codigo` sob um lado carimbado `medido` promove leitura a medição em silêncio.
