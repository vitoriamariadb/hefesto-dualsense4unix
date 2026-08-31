# As 30 que caíram na rodada 1 — o que não se deve propor de novo

**Rodada 1** (`journal-wf_82d96300-e59.jsonl`, resultado em `resultado-w6f1jxfra.json`):
43 propostas, **13 sobreviveram, 30 caíram**. Cada proposta passou por três céticos
independentes (lente do endereço, do transporte, do aparelho) — 128 refutações ao todo,
88 derrubando.

**Este documento é conhecimento NEGATIVO com prova.** Cada item diz o que foi proposto,
qual `arquivo:linha` o derrubou, e a lição que se transporta. Sem ele, a próxima pessoa
propõe as mesmas 30 coisas e paga os mesmos agentes para descobrir o mesmo.

**A regra que decidiu quase tudo:** *célula vazia é melhor que célula errada.* Em 24 dos
30 casos o NÚMERO estava certo — caiu a **frase ao lado dele**.

---

## Contagem por padrão de erro

| padrão | quantas | o que é |
| --- | ---: | --- |
| **1. Universal falso** | **8** | "o único ramo de bus", "todas as consultas", "nenhuma fonte diz", "driver nenhum reclama" — sempre havia mais um |
| **2. Endereço que não sustenta a frase** | **6** | o `arquivo:linha` existe, mas diz outra coisa, ou não cobre o que a frase afirma |
| **3. Valor do CABO (ou de outro MODO) na coluna do RÁDIO** | **4** | inclusive o caso invertido: argumentar indiferença ao transporte numa coluna que existe para guardar assimetria |
| **4. Divergência ABERTA convertida em fato** | **3** | duas fontes brigam, a proposta escolhe uma calada — ou "corrige" um `medido` com um `afirmado-no-doc` |
| **5. Grau inflado / célula que já tem grau maior** | **3** | rebaixar `medido` para `inferido-do-codigo`, ou publicar leitura de terceiro sob a etiqueta de bancada |
| **6. Número de outro aparelho / fonte trocada** | **2** | VID:PID do modo errado; repositório externo creditado por coisa que não faz |
| **7. Correção pela metade** | **2** | conserta uma célula e deixa vivas três outras que a mesma prova derruba |
| **8. Offset inventado (plausível, sem fonte)** | **1** | número que "casaria" numa faixa reservada, apresentado como localizado |
| **9. Coluna errada / assimetria falsa** | **1** | negação de existência numa coluna de offset, só de um lado |
| **TOTAL** | **30** | |

---

## 1 · Universal falso — 8 células

O padrão: a proposta declara **completude** ("os únicos", "todos", "nenhum") e a
enumeração não fecha. Em todos os oito a CONCLUSÃO sobreviveu; o que caiu foi a frase
que iria para o CSV.

**A lição transferível, e ela vale para toda a família `hid-nintendo`:**
um `grep` por `BUS_USB|BUS_BLUETOOTH|joycon_using_usb` **não pega `hdev->bus` cru**.
No `assets/dkms/hid-nintendo/hid-nintendo.c` desta árvore o grep honesto
(`hdev->bus|joycon_using_usb`) devolve **13 linhas**: `:862`, `:864`, `:980`, `:2022`,
`:2346`, `:2410`, `:2752`, `:2817`, `:2847`, `:2854`, `:2880`, `:3123`, `:3213`.
Prova negativa vale pela enumeração — se a enumeração está curta, a prova não existe.

### `entrada.stick@sn30` · `radio_evidencia`
- **Proposto:** "os únicos ramos de bus do arquivo são o limitador de subcomando, o handshake USB e os retries de probe — nenhum toca stick", com "nove pontos" de grep.
- **Caiu por:** `joycon_may_degrade` (`hid-nintendo.c:2745-2753`) é `usb_probe_degrade && joycon_using_usb(ctlr)` — **USB-only por decisão do fonte** — e é chamado em `:2899`, logo depois do `joycon_read_info()` que define `ctlr_type`, o único discriminador que leva a `joycon_report_left/right_stick` (`:1970`). Por cabo a falha cai em `joycon_synthesize_info` (`:2757-2790`) e o eixo nasce; **por rádio a probe morre e não há input device nenhum**.
- **Lição:** a assimetria de transporte deste clone não está no parse, está **acima** dele. "A instabilidade é do link, não do eixo" é mais forte do que o código sustenta.

### `energia.bateria.degraus@sn30` · `radio_evidencia`
- **Proposto:** "Todas as consultas a barramento do arquivo — `joycon_using_usb` (:862-864) e o rate-limiter (:980)".
- **Caiu por:** faltaram `:2022`, `:2346`, `:2410` e `:2817` (`mac_addr[5] = (u8)hdev->bus`). E "`joycon_power_supply_create` sem condição na probe (`:3158`)" esconde a condição que importa no rádio: o caminho passa por `joycon_init` (`:3122`) e `goto err_close` (`:3145-3148`) — init que falha significa **nó de sysfs que não nasce**, que é a morte medida do modo Switch por rádio (`docs/usage/troubleshooting-8bitdo.md:105`).
- **Lição:** há DUAS mortes medidas deste aparelho, em estágios diferentes — na probe (o nó não existe) e depois dela (o valor congela). Escolher uma é escolher entre duas medições da casa.

### `vibracao.rumble.ff@sn30` · `radio_offset` e · `radio_evidencia`
- **Proposto:** "O único ponto do caminho que consulta `hdev->bus` é o rate limiter"; e, na evidência, "driver nenhum do kernel reclama o `0x2dc8` (a única linha é um quirk USB do Pro 3)".
- **Caiu por:** (a) `hid-nintendo.c:2022` — `if (ctlr->hdev->bus == BUS_USB) ctlr->consecutive_valid_report_deltas = JC_SUBCMD_VALID_DELTA_REQ;`. Por cabo o portão nasce satisfeito; **por rádio cada pacote de rumble espera três relatórios com delta em 8–17 ms** (`:973-976`), e com `skip_tx_on_rate_exceeded=1` (ligado nesta casa em `assets/modprobe.d/hefesto-hid-nintendo.conf`) o pacote é **descartado** com `-EAGAIN` (`:1032`). É esse portão — não o 60 ms — que sustenta o `radio_aceita = parcial` da linha. (b) `drivers/input/joystick/xpad.c` tem NOVE linhas do vendor `0x2dc8`, e a `:379` nomeia este controle: `{ 0x2dc8, 0x6001, "8BitDo SN30 Pro", 0, XTYPE_XBOX360 }`.
- **Lição:** universal negativo sobre "o kernel inteiro" tirado de UM arquivo não vale. E o `msleep(JC_SUBCMD_TX_OFFSET_MS)` de 4 ms (`:1047`) é **incondicional** — não é custo de rádio.

### `toque.touchpad.cursor@dualsense` · `radio_evidencia`
- **Proposto:** "`:1579-1595` é o ÚNICO ramo de transporte de `dualsense_parse_report`; resolvido o `ds_report`, NÃO HÁ MAIS NENHUM TESTE de `hdev->bus`".
- **Caiu por:** `assets/dkms/hid-playstation/hid-playstation.c:1647` — `if (hdev->bus == BUS_USB)`, o bloco "Parse HP/MIC plugged state data for USB use case" (`:1643-1667`), que fica **entre** a resolução do `ds_report` (`:1596`) e a emissão dos pontos (`:1706-1722`).
- **Lição, e é a ironia:** `:1647` é a instância **mais forte** do próprio argumento da proposta — o mesmo autor gateia o áudio duas vezes na mesma função e nas duas deixa o touchpad de fora. A proposta negou a existência da sua melhor evidência.

### `movimento.imu.perda@pro` · `radio_offset`
- **Proposto:** o `u8 timer` (`hid-nintendo.c:605`) como "RÉGUA DE BYTE QUE EXISTE E NUNCA FOI USADA — o análogo, no Pro, do `corpo[11..14]` do DualSense", com "nenhuma fonte que li diz o que ele conta".
- **Caiu por:** `hid-nintendo.c:1636-1640`, **dentro da função que a proposta diz ter lido inteira**: *"There's a quickly incrementing 8-bit counter per input report, but it is not very useful for this purpose (it is not entirely clear what rate it increments at or if it varies based on packet push rate)"*. A fonte diz o que ele é; o que ela não sabe é a taxa — e já o **descartou por escrito**.
- **Lição:** a analogia inverte o registro. O `corpo[11..14]` do DualSense é régua porque foi MEDIDO andando de 1 em 1; este é candidato já avaliado e recusado pelo autor do driver, e cheira ao `seq_number` que é mudo por rádio.
- **Bônus de endereço:** `joycon_parse_imu_report` vai de `:1621` a **`:1816`**, não a `:1727`. Quem conferir pelo intervalo dado audita 55% da função.

### `vibracao.rumble.frequencia@sn30` · `radio_evidencia`
- **Proposto:** "em D-input por rádio (`2dc8:6101`) driver nenhum do kernel reclama o aparelho".
- **Caiu por:** `docs/protocol/externos-firmware-e-modos.md:146` e `:263` põem o D-input sob **`hid-generic`**, com carimbo `[MEDIDO 11/08]`. `hid-generic` é driver do kernel. A proposta achatou "nenhum módulo ESPECÍFICO reivindica" (verdadeiro) em "driver NENHUM reclama" (falso).

### `plataforma.vpad@pro` · `radio_evidencia`
- **Proposto:** "O jogo nunca vê Bluetooth, com o Pro no cabo ou no rádio".
- **Caiu por:** `src/hefesto_dualsense4unix/daemon/launch_env.py:129-136` recusa o `SDL_GAMECONTROLLER_IGNORE_DEVICES_EXCEPT` com esta razão literal: *"o Pro Controller e o 8BitDo são read-only por decisão de produto… então eles chegam ao jogo POR SI — e um `_EXCEPT` os apagaria"*. Com o Pro no rádio, o jogo enumera o **Pro físico**, que é `BUS_BLUETOOTH`. O `EVIOCGRAB` tira os eventos, não o nó.
- **Lição:** "o vpad nasce BUS_USB" está provado (`uhid_gamepad.py:94`, `:1510`; `uinput_gamepad.py:321`, `:470`). "O jogo nunca vê Bluetooth" é outra afirmação, e é falsa. Não confundir o barramento do **vpad** com o que o jogo **enumera**.

---

## 2 · Endereço que não sustenta a frase — 6 células

O `arquivo:linha` existe. Ele só não diz o que a proposta afirma. É o defeito mais caro,
porque a célula **parece conferida**.

### `plataforma.handshake_usb@pro` · `radio_evidencia`
- **Proposto:** "as quatro últimas [chamadas de `joycon_send_usb`] estão dentro do `if (joycon_using_usb(ctlr))` de `:2847`".
- **Caiu por:** o bloco de `:2847` **fecha em `:2851`** e contém UMA chamada (`:2850`). As outras três (`:2857`, `:2866`, `:2875`) estão num segundo `if`, o de **`:2854`** — `if (joycon_using_usb(ctlr) && !hs_ret)` — que a proposta não cita em lugar nenhum.
- **Lição:** a proposta declarava que o valor dela era reprovar sozinha "se alguém acrescentar uma chamada fora do ramo". Uma evidência que nomeia o ramo errado não faz isso.
- **Dois reparos que sobrevivem à queda, e valem para qualquer contagem por grep:** (a) `:1151` só é alcançada com o parâmetro de módulo `usb_send_conn_status` (`:104`, default false); (b) **o número SETE é do fork DKMS desta casa** — `patch/BASELINE` = vanilla v7.0.11 + 4 patches, e é o `0003` que cria `joycon_query_usb_conn_status` e parte em dois o `if` único do upstream. No `hid-nintendo` in-tree o mesmo grep devolve QUATRO. *Toda evidência por contagem tem de nomear contra qual árvore foi rodada.*

### `movimento.imu.perda@pro` · `radio_evidencia`
- **Proposto:** "o comentário do próprio autor do driver atribui essa taxa ao SSR do Bluetooth (`:1650-1665`)".
- **Caiu por:** o comentário faz o **oposto**, dentro do intervalo citado. `:1654-1657` cita o SSR como coisa de **outras pilhas** (*"android's stack currently sets the SSR to 11ms"*), e `:1659-1662` recusa a atribuição: *"In my own testing… **It isn't 100% clear what determines this rate**"*.
- **Achado de fato que ninguém tinha escrito:** o limiar do aviso não é absoluto — `dropped_threshold = imu_avg_delta_ms * 3 / 2` (`:1714`), com a média reaprendida a cada 300 relatórios (`:225`, `:1692-1699`). E a conta é `dropped_pkts = (delta − min(delta, threshold)) / avg` (`:1715-1716`): um buraco de k relatórios imprime **k−1**. Com `avg=11` ou `avg=15`, **invisíveis são as perdas de 1 a 4**, não de 1 a 3 — e cada N impresso sai um relatório abaixo do que sumiu. Os 10285 de 07/08 são piso por DOIS motivos somados.

### `gatilho.leitura@dualsense` · `radio_canal` e · `radio_evidencia`
- **Proposto:** `iayusshh/RemotePlayChiaki DualSenseReports.swift:291` como fonte do byte de gatilho; e "a régua que amarra as quatro fontes à nossa contagem é o byte de bateria: **todas** o põem no payload 52".
- **Caiu por:** (a) `:291` é `commonOffset = 2` — a base do payload por Bluetooth, não o gatilho, que está em **`:328-329`** (`common[42]` esquerdo, `common[41]` direito). (b) A régua amarra TRÊS, não quatro: `felis/USB_Host_Shield_2.0 PS5Parser.h:132` é `uint8_t reserved4[10]; // 0x2B - 0x34`, que **engole o payload 52**; a `union PS5Status` (`:90-103`) não tem campo `battery`, e o `getBatteryLevel()` de `:266` lê campo inexistente sob um `#if 0` aberto em `:261`. Essa quarta fonte amarra pelo **jack** (payload 53), não pela bateria.
- **Terceira queda, na mesma família:** `radio_canal` foi proposto como `hidraw` porque "o kernel não nomeia nem publica estes bytes: eles caem em `reserved3[12]`". O estado do gatilho **não** mora ali: mora em `z` e `rz`, bytes 4 e 5, publicados por evdev — `hid-playstation.c:1602-1603` (`input_report_abs(ABS_Z / ABS_RZ)`), depois do ramo de transporte, e lidos nesta casa em `core/evdev_reader.py:1454-1455`.
- **Lição:** `reserved3[12]` prova que o kernel **ignora** 12 bytes. Isso serve ao argumento negativo ("não é evdev") e só a ele. Sem offset localizado, "não é evdev" não fecha em "é hidraw".

### `vibracao.haptics_vcm@dualsense` · `radio_offset`
- **Proposto:** "No `0x36` de 398 B: `[278]=0x92`, `[279]=0x40`, PCM em `[280..343]`", ancorado em `DualSenseBtReportBuilder.kt:903-956 (writeDirectAudioHapticsReport)`.
- **Caiu por:** essa função põe o bloco em **`[11]/[12]`, PCM em `[13..76]`** (`DIRECT_ONE_FRAME_HAPTICS_HEADER_OFFSET = 11`, `:59-60`, gravado em `:931-939`). O `[278]` é `COMBINED_ONE_FRAME_HAPTICS_TAIL_OFFSET` (`:55`) e pertence a **outra** função, `writeCombinedControllerHapticsReport` (`:799-883`), que também escreve `report[0] = 0x36` e também tem 398 B.
- **Lição transferível, e é a mais dura desta rodada:** **o mesmo report id, com o mesmo tamanho, carrega o bloco háptico em dois offsets diferentes**, escolhidos em tempo de execução (`DualSenseBtStreamFeedback.kt:2051-2070`). "O offset muda com o envelope" é fraco demais — nem o envelope o determina. Quem implementar a partir de um offset único acerta metade das vezes.

### `vibracao.haptics_vcm@dualsense` · `radio_codigo_ref`
- **Proposto:** "grep por `BLOCO_HAPTICS` na árvore inteira devolve DUAS ocorrências: a declaração e o `__all__` em `:1260`".
- **Caiu por:** as três partes são falsas. No arquivo o grep devolve **UMA** (`dualsense_bt_audio.py:222`); na árvore inteira devolve **CINCO**; e `:1260` é `"BLOCO_DUPLO",` — `BLOCO_HAPTICS` **não está no `__all__`**. E dentro do próprio valor: "`BLOCO_PRESENTE` / `BLOCO_DUPLO` nunca usadas" é falso — `BLOCO_PRESENTE` é usada em `:256` (`pkt[2] = BLOCO_AUDIO_CONTROL | BLOCO_PRESENTE`).
- **A ocorrência que a proposta perdeu é a que importa:** `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:69-75` **isenta `BLOCO_HAPTICS` por nome**, como "vocabulário de protocolo sem chamador por desenho" (decisão de 12/08). Portão nenhum acusa a ausência — e é de propósito.
- **Segunda queda, de coluna:** nas 204 células preenchidas de `radio_codigo_ref`, **zero** citam repo externo; todas são caminho desta árvore. A coluna para isso é `fonte_externa` (#44), e é onde a casa já põe o próprio Senshi em `identidade.cor_do_aparelho@dualsense`. Um `.kt` em `radio_codigo_ref` é endereço que o portão `referencias-docs` nunca resolve.

---

## 3 · Valor do CABO (ou de outro MODO) apresentado como de RÁDIO — 4 células

### `plataforma.handshake_usb@pro` · `radio_report_id`
- **Proposto:** "o equivalente de identidade no rádio é o subcomando `REQ_DEV_INFO 0x02`, na saída `0x01`, com resposta na entrada `0x21`".
- **Caiu por:** `hid-nintendo.c:2897` (`ret = joycon_read_info(ctlr);`) fica **depois** do fecho da cadeia if/else-if, em `:2894` — é **incondicional**. O cabo chama a mesmíssima linha, logo depois do handshake dele. Não é o equivalente de rádio: é o passo **comum aos dois barramentos**.
- **Lição:** o handshake não tem equivalente por rádio, ponto. E o dado já mora nas linhas certas: `identidade.req_dev_info@pro` e `identidade.firmware@pro`, as duas com `cabo_report_id` idêntico ao do rádio — o que confirma o argumento.

### `vibracao.rumble.passthrough@sn30` · `radio_report_id`
- **Proposto:** "quem monta o report é o `hid-nintendo`, sozinho… report `0x10`", com um "por rádio ou por cabo" que apaga a diferença.
- **Caiu por:** o `hid-nintendo` só governa este aparelho no **modo Switch**, e é o modo medido **no cabo** (`docs/usage/troubleshooting-8bitdo.md:36`). Por rádio o modo recomendado e medido da casa é **DirectInput/PS4**, `054c:05c4`, driver `hid-playstation` (`:35`, `:68`) — e ali o report id nem é `0x10`: `hid-playstation.c:391-394` dá `DS4_OUTPUT_REPORT_USB 0x05` / `DS4_OUTPUT_REPORT_BT 0x11`, escolhidos por `hdev->bus` em `:2475-2490`. Switch **por rádio** existe, e é "PROVADO instável — mortes medidas em 16/07" (`:37`).
- **Lição, que o próprio troubleshooting abre avisando (`:24-27`):** *"PROVADO sem escopo não vale. Este controle tem cinco modos e dois transportes."* E a casa já escreveu o oposto da proposta em `entrada.botoes@sn30`: "por rádio… **ele nem chega perto do `hid-nintendo`**".

### `vibracao.rumble.frequencia@sn30` · `radio_offset`
- **Proposto:** a decomposição byte a byte do `joycon_encode_rumble` como o offset de rádio do SN30, com "por rádio o custo é SÓ o rate limiter de 60 ms".
- **Caiu por:** (a) a palavra "só" apaga a morte medida — `troubleshooting-8bitdo.md:232-263`, 16/07: em modo Switch por Bluetooth o input morre com o link de pé, e a assinatura culmina em `joycon_enforce_subcmd_rate: exceeded max attempts`; "por CABO, no mesmo modo, não há um único timeout" (`:248`). (b) A célula **não escreve "modo Switch" em lugar nenhum**. (c) O limitador é do DRIVER e o canal desta linha é `hidraw`: escrita crua **contorna** o limitador — ele não é o custo do gesto, é a proteção que o gesto dispensa.
- **E o erro técnico que produz exatamente o lixo que a célula dizia evitar:** ela usa a mesma expressão — "byte alto da amplitude" — para `+1` e `+2`, e são campos diferentes de `struct joycon_rumble_amp_data { u8 high; u16 low; u16 amp; }` (`:270-274`). Em `+1` é `amp_data.high` (u8 inteiro, `:2157`, sem `>>8` nenhum); em `+2` é `(amp_data.low >> 8) & 0xFF` (`:2158`). Para amp=10 a tabela dá `{ 0x02, 0x8040, 10 }`: `+1` soma `0x02` e `+2` soma `0x80`. **E nenhum dos bytes é Hz ou amplitude crus — são códigos de tabela de busca** (`joycon_find_rumble_freq`/`_amp`, `:2114-2144`).

### `plataforma.distinguir_clone@pro` · `radio_offset`
- **Proposto:** `e_pro_genuino()` (`core/linhagem_nintendo.py:159-174`) como o discriminador de rádio.
- **Caiu por:** o único consumidor dele em `src/` é `ExternalImuEnabler.tick` (`daemon/subsystems/external_identity.py:923`), e oito linhas abaixo vem `if bus != _IMU_ENABLE_ALLOWED_BUS: continue`, com `_IMU_ENABLE_ALLOWED_BUS = "usb"` (`:218`, FASE 1 do GYRO-02, BT bloqueado de propósito). **Por rádio essa função nunca age.**
- **Lição:** quem age por rádio nesta linha é o no-sniff em bash/udev, e ele **não** é "espelho em Python" — ver o padrão 7 abaixo.

---

## 4 · Divergência ABERTA convertida em fato — 3 células

### `gatilho.leitura@dualsense` · `radio_offset` — o nibble
- **Proposto:** "em cada um o **nibble ALTO** é o estado e o nibble baixo o ponto de parada", como fato, dentro da célula.
- **Caiu por:** a disputa é viva e a fonte que a contradiz é a **mesma** de onde a proposta tirou a base do rádio. `DualSenseReports.swift:44-46`: *"Community captures identify the **low** nibble as the feedback state. `rawValue` remains authoritative because **Linux leaves this byte opaque**"*, com `state = rawValue & 0x0f` e `hasActiveForce = rawValue & 0x10`. Do outro lado, `awalol/DS5Dongle src/utils.h:225-228` diz nibble ALTO — mas o struct inteiro está dentro de um comentário de 105 linhas (`/*` abre em `:152`, fecha em `};*/` na `:256`): **zero código vivo**. E `felis/USB_Host_Shield_2.0 PS5Parser.h:130-131` está sob `#if 0` (`:127`), cujo comentário diz *"The status byte depends on if it's sent via USB or Bluetooth, so is not parsed for now"*.
- **Lição:** para o OFFSET há três implementações vivas concordando (payload 41 = direito, 42 = esquerdo -> `report[43]`/`report[44]` no rádio). Para o NIBBLE há **um código vivo do lado baixo e zero do lado alto** — enquanto a canônica desta casa diz ALTO, com grau `afirmado-no-doc`. Ninguém mediu. O offset é `inferido-do-codigo`; o nibble não passa de `afirmado-no-doc`.
- **Medição de proveniência que ninguém tinha feito:** `iayusshh/RemotePlayChiaki` foi criado em **2026-08-30**, tem 0 estrelas, 0 forks, todos os commits do mesmo dia; nem `Ryochan7/DS4Windows` nem `schmaldeo/DS4Windows` têm a string `TriggerFeedback` em `DS4State.cs`. "Quatro implementações independentes" são quatro cópias da mesma folha comunitária.

### `plataforma.nfc@pro` · `radio_offset` — os 361 bytes
- **Proposto:** "dados de MCU a partir do byte 49 do 0x31, até 313 B (**report de 362 B**)" + a "consequência (a)": corrigir o `361` de `cabo_comando`/`radio_comando` para 362, porque "361 é o ÍNDICE DO ÚLTIMO BYTE".
- **Caiu por:** o `361` **não veio do dekuNukem**. Ele está em `docs/protocol/externos-referencia-canonica.md:283-292`, numa tabela carimbada *"MEDIDO AQUI (parser próprio sobre `/sys/class/hidraw/hidraw7/device/report_descriptor`, tamanho real por `wc -c`)"*, e a coluna se chama **corpo** — a prosa duas linhas abaixo fixa a convenção: *"todos de 49 bytes no fio (1 de ID + 48 de corpo)"*. As duas fontes **concordam**: 361 de corpo, 362 no fio.
- **Lição, e é a que mais custa:** a proposta fabricou uma contradição e depois "consertou" o lado certo — trocaria um `medido` de bancada por aritmética de documento de terceira mão (o próprio campo `endereco` dizia *"via dossiê — não abri o doc"*). **Inversão da régua de confiança.** Antes de "corrigir" um número do mapa, achar de onde ele veio.
- **Ironia registrada:** o `361` mora em `cabo_comando`, mas a medição que o sustenta foi feita **no rádio** (hidraw7, OUI `e0:f6:b5`). Não há descritor USB do Pro medido nesta casa — a linha já tem os transportes trocados.

### `plataforma.sniff@pro` · `radio_evidencia` — o SSR
- **Proposto:** acrescentar à evidência medida que "o próprio `hid-nintendo` nomeia o mecanismo — SSR — e é o elo escrito entre a link policy do rádio e a cadência de IMU".
- **Caiu por seis frentes:** (1) `grep -oiw "sniff"` no arquivo devolve **ZERO**; `SSR` aparece 2 vezes, as duas dentro do comentário de **timestamp de IMU**. A ponte SSR = sniff subrating é do proponente, não do fonte. (2) O número do comentário é **do Android**, e esta bancada roda BlueZ. (3) A frase *"sending subcommands and/or rumble data at too high a rate can cause bluetooth controller disconnections"* está em `:970-972`, não em `:976-980`, e o sujeito dela é a taxa que o **driver emite** — não a link policy do host. (4) O material já está escrito em `docs/protocol/driver-hid-nintendo-por-dentro.md:456-457` e na linha CERTA do CSV, `plataforma.taxa_relatorios@pro` — cadência não é política de enlace. (5) **A medição da casa contradiz o elo:** esta casa tira o Pro do sniff (`hcitool lp <MAC> RSWITCH`) e ainda assim mediu **11 ms**, que é o ramo que o comentário atribui a um stack fixando SSR. Se o elo fosse real, o Pro sem sniff estaria em 15 ms. (6) A proposta chegou **sem acentos** (`1a` por `1ª`, `so` por `só`, `NAO e` por `NÃO é`) dizendo reproduzir a célula "byte a byte" — aplicada como veio, corromperia uma célula `medido` e derrubaria o portão de acentuação.
- **Lição:** o comentário do SSR descreve uma complicação que o driver **acomoda** (aprende o `avg_delta`), não uma causa de queda. O desfecho medido na linha do sniff é probe morrendo em `-110` e queda sob carga. **Modos de falha diferentes.**

---

## 5 · Grau inflado / célula que já tem grau maior — 3 células

As três são `audio.saida_dedicada@dualsense` (`radio_canal`, `radio_report_id`,
`radio_offset`), e caem juntas pela mesma razão.

- **Proposto:** `hidraw` no canal, a escada `0x32`–`0x39` no report id, e o layout TLV do `0x39` no offset.
- **Caiu por:**
  1. **Não é lacuna.** `radio_canal` já é `outro` com `radio_de_onde_sei = medido` — medido por duas coisas reais (registro do BlueZ em 07/08; os degraus com o olho dela em 15/08). A proposta **rebaixaria** um `medido` para `inferido-do-codigo`.
  2. **A saída de emergência que a proposta inventa não existe no esquema.** Ela escreve "o valor entra no grau da coluna, não no da linha". O CSV tem 50 colunas e **dois** campos de grau — `cabo_de_onde_sei` (24) e `radio_de_onde_sei` (25), um por transporte por **linha**. Não há grau por célula.
  3. **A própria linha nomeia a falácia.** `radio_ressalva`, 15/08: *"FALÁCIA DO CANAL QUE RESPONDE — concluir que, porque um canal responde, ele FAZ o que a gente esperava dele."* O argumento "o canal responde por hidraw, logo o áudio é hidraw" é essa falácia na forma pura.
  4. **A separação foi feita de propósito e a proposta a desfaz.** A `nota` de 15/08: *"o que é hipótese saiu desta linha e ganhou a sua, `audio.saida_dedicada.payload_do_degrau@dualsense`, marcada como `incerto` — porque as duas coisas não cabiam numa célula só sem uma virar a outra."* Essa linha-filha **já tem** `radio_canal = hidraw`.
  5. **Erro de categoria no report id.** A linha é do **dispositivo** (placa USB Audio), com as quatro células de endereço HID em `—` em bloco: `—` ali é "não se aplica", e a linha vizinha prova que a casa distingue (`audio.alto_falante@dualsense` tem `cabo_report_id = —` e `radio_report_id` carregando a escada).
- **Lição transferível:** `outro` **não é placeholder** — é valor do domínio (`check_paridade_transporte.py:640-642`), usado em 49 linhas de rádio, e em duas irmãs sobreviveu a medição. E `hid-playstation.c:1956-1962` (*"Bluetooth audio is currently not supported"*, jack só sob `BUS_USB`) **elimina** `alsa-pipewire`; eliminar um valor não identifica outro. Esse uso do negativo como positivo é a gêmea da FALÁCIA DO PERFIL AUSENTE.
- **Erro de leitura de C que atravessou três propostas:** `update_mic_status` em `awalol/DS5Dongle src/audio.cpp:85-94` declara `uint8_t pkt[142]{}` — é a **dimensão do buffer**, não um índice; a função só escreve até `pkt[4]`. O `pkt+142` real está em `audio_bt_task`, no buffer de 547 B do `0x39`. A "segunda contagem independente" não existia.

---

## 6 · Número de outro aparelho / fonte trocada — 2 células

### `entrada.stick@sn30` · `radio_report_id`
- **Proposto:** `entrada 0x30 (modo Switch)`, justificado com "no modo DirectInput/PS4 — que a `assimetria_declarada` recomenda por rádio — o aparelho enumera como `2dc8:6101`… lá quem descreve o stick é o driver 8BitDo do SDL".
- **Caiu por:** correção **datada de 11/08/2026, grau ALTA**, em `docs/protocol/externos-firmware-e-modos.md:146-176`: *"O que este repositório chama, em toda parte, de 'modo DirectInput/PS4' é `Start + A` e produz `054c:05c4`. Na nomenclatura da 8BitDo isso é o modo macOS, e o 'D-input' de verdade é outro combo — `B + Start`."* O `2dc8:6101` é o D-input verdadeiro, sob `hid-generic`, e `:177-179` diz que **esta bancada nunca ligou esse modo**.
- **Lição:** a proposta caiu na armadilha que aquela correção existe para matar — leu o nome velho no CSV e colou nele o VID:PID do modo errado. No modo que a casa recomenda quem descreve o stick é o `hid-playstation`, não o SDL. **O número que vale é `entrada 0x30`, seco**, na forma das três irmãs do mesmo aparelho; nada de `(modo Switch)` na célula, nada da história do `2dc8:6101` em `radio_ressalva`.

### `vibracao.haptics_vcm@dualsense` · `radio_canal`
- **Proposto:** `hidraw`, com "a fonte externa que monta háptico por rádio (**Senshi**)" e o endereço `dualsense_bt_audio.py:1017`.
- **Caiu por:** (a) `:1017` é `os.write(fd, montar_pedido_de_mic(...))` — o `0x32` de AudioControl, tag `0x11`, **MICROFONE**, entrada. Nesta árvore a fonte de háptico por BT é **`egormanga/SAxense`** (`canônica:1799`, `dualsense_bt_audio.py:24`); `TechAntohere/Senshi` aparece só na **cor do plástico** (`cor_do_plastico.py:37`, `canônica:1617`). (b) O grau `inferido-do-codigo` é inalcançável: a própria linha diz `radio_comando = "NÃO LOCALIZADO em código"` e `radio_evidencia = "Zero implementação nas duas rotas"`. (c) A canônica tem nota datada de 11/08 (`:745-750`) que proíbe o passo: *"**O `0x32` que esta casa mediu não decide a questão** (…) Ninguém aqui escreveu um byte de áudio de saída por rádio."*
- **Lição:** as três saídas de PCM por rádio (alto-falante, saída dedicada, VCM) são o mesmo envelope na mesma escada, e as outras duas dizem `outro` — uma delas com `medido`. Escrever `hidraw` só aqui deixa **dois nomes para um mecanismo**. E `hidraw` × `uhid` sequer foi disputado: o vocabulário desta coluna já usa `uhid` para saída háptica em `vibracao.rumble.ff` e `passthrough`.

---

## 7 · Correção pela metade — 2 células

### `plataforma.distinguir_clone@pro` · `radio_evidencia`
- **Proposto:** "os três lugares que decidem hoje… **os três por NEGATIVA sobre `e417d8`, nenhum por igualdade com `e0f6b5`**".
- **Caiu por:** é falso em **dois dos três**, e o código diz o contrário nas linhas que a própria proposta cita. Só o Python é puro por negativa (`linhagem_nintendo.py:174`, `return not e_clone_conhecido(uniq)`). Os dois em bash têm três degraus, e **o do meio é igualdade de prefixo**: `bt_active_mode.sh:265-267` (`[[ "${mac}" == "${marca}"* ]] && return 0`, com `OUIS_NINTENDO_VISTAS=("e0:f6:b5")` em `:206`) e `bt_nosniff_now.sh:128-131`, cujo `_conhecida=0` **pula o teste de nome inteiro** (`:133`). E é deliberado: `bt_nosniff_now.sh:96-99` documenta o degrau — *"está numa faixa que esta casa JÁ VIU num aparelho? -> aplica, **sem consultar nome nenhum**… nada que já funcionava passa a depender de um dado novo"*.
- **Consequência medível, não estética:** um aparelho em `e0:f6:b5` que **não** se anuncia como "Pro Controller" é genuíno nos dois bash e **não é** em Python (`parece_pro` reprova antes, `:156`, `:170`). O portão que existe (`test_o_no_sniff_alcanca_todo_pro.py`) vigia as LISTAS, não o formato da decisão.
- **E o censo está incompleto: são QUATRO lugares.** `app/actions/external_controllers.py:88` monta `_BRAND_BY_OUI = dict.fromkeys(OUIS_CLONE, "8BitDo")`, e `friendly_type` (`:119-121`) / `brand_of` (`:139-141`) decidem por **igualdade positiva com `e417d8`** — o inverso da negativa. É o lugar que **ela vê** (o rótulo da tela), e é rádio por construção: `uniq` vem vazio pelo cabo (`:100-101`). Numa coluna chamada `radio_evidencia`, deixar de fora o único discriminador que só existe por rádio é a omissão que mais custa.

### `luz.led_jogador@dualsense` · `radio_offset`
- **Proposto:** `common[43] = report[46]` — **com a frase** "em produção por rádio esta rota sai SUPRIMIDA; o byte é o que a mordida exercita com a supressão desligada".
- **Caiu por:** o número está certo e foi confirmado por três réguas independentes (ver §"sobreviveu raspando"). A frase é falsa, e o código diz o contrário em quatro lugares: `backend_pydualsense.py:3598-3612` (`_pintar_por_hidraw_bt`, "A SEGUNDA rota da lightbar por rádio, **EM REGIME**", ROTA-BT-EM-REGIME-01, 12/08), `:3665` -> `build_bt_lightbar_report(rgb, players)`, `lightbar_gatilho.py:153-156` (escreve `common[COMMON_PLAYER_LEDS]` e liga o flag1 `0x10`), e `:3704-3707`: *"por rádio, cor e número saem TAMBÉM pelo report 0x31 avulso — é este o caminho do PERFIL e do HOTPLUG"*. O `_suppress_leds` governa o **FLUXO** do `report_thread`, nunca a escrita **avulsa**; o único portão sobre o byte é `_pode_escrever_player_leds()` (`:3083-3085`), False só com o instrumento de eliminação ligado.
- **A causa raiz, e é a lição:** a proposta se apoiou no `radio_comando` desta linha ("ÚNICA rota: sysfs… suprimida incondicionalmente por BT"), que é **texto de 11/08 que ninguém atualizou** depois da rota de 12/08. A linha irmã `luz.lightbar.cor@dualsense` já foi corrigida em 16/08 e traz o aviso literal: *"SUBSTITUIU… 'ÚNICA rota: sysfs' — fato de 11/08 que a rota de 12/08 derrubou"*. **A proposta usou uma célula caduca como prova.**
- **Consequência prática:** gravada assim, a célula ensina que o byte 46 é teatro de teste. Ele é o byte que decide quem é o Controle 1 na mesa dela quando outro processo tem o nó sysfs aberto.
- **Endereço errado de quebra:** `hid-playstation.c:213` é `DS_OUTPUT_VALID_FLAG1_POWER_SAVE_CONTROL_ENABLE BIT(1)` = `0x02`. O define certo é **`:216`** (`PLAYER_INDICATOR_CONTROL_ENABLE BIT(4)`); a `:203` é o `DS_OUTPUT_TAG 0x10`, provável origem da confusão.

---

## 8 · Offset inventado — 1 célula

### `gatilho.leitura@dualsense` · `radio_codigo_ref`
- **Proposto:** a ausência de consumidor (verdadeira) **mais** o par de offsets "41/42", e a instrução "falta só somar 41 e 42 à lista de offsets que ele extrai".
- **Caiu por:** nenhuma fonte citada põe o status do gatilho em 41/42. A própria linha declara: `cabo_offset` = *"não localizado no código (nenhum consumidor)"*, `radio_offset` = *"não localizado"*, `cabo_ressalva` = *"O offset exato do byte de status não está registrado no código deste projeto"*. O kernel só nomeia `reserved3[12]` — payload 40..51: **qualquer número dessa faixa "casaria"**, o que é tautologia, não prova.
- **E o par já tem dono nesta árvore, no report de SAÍDA:** `backend_pydualsense.py:1253-1254` (`common[41]` = `pulseOptions`, `common[42]` = `brightness`), `dualsense-referencia-canonica.md:243-244` (`[41] lightbar_setup`, `[42] led_brightness`), `ds_output_report.py:26`, `uhid_gamepad.py:127`. A instrução acionável mandaria a próxima pessoa ler bytes que pertencem à lightbar.
- **A afirmação de grep também era falsa:** "as únicas ocorrências de 41/42 em `core/` e `integrations/` são `_CALIBRATION_FEATURE_SIZE = 41`" — há ainda `physical_report_reader.py:482-483` (`report[16:41]` e `report[17:42]`, a janela de motion).
- **Lição de quadro de referência, e ela vale para toda coluna `radio_*`:** no mesmo arquivo convivem dois quadros — o de **payload** (52, 53, base resolvida) e o de **report cru** (`report[17:42]` no BT). "41/42" pelado dá errado nas duas leituras: no cru a frase "nunca toca 41/42" é falsa; no de payload o offset cru de rádio seria 43/44. **É o `+2` que esta casa já pagou.**

---

## 9 · Coluna errada / assimetria falsa — 1 célula

### `plataforma.vpad@pro` · `radio_offset`
- **Proposto:** "— (não há offset de rádio: o vpad nunca emite `0x31`. O descriptor capturado por Bluetooth, que declara o item `85 31`, **é recusado** como blueprint)".
- **Caiu por:** **não há recusa nenhuma.** `capture_dualsense_blueprint` (`uhid_gamepad.py:647`) tem **zero chamadores** — o grep em `src/`, `tests/` e `scripts/` devolve só a definição, o `__all__`, comentários e `tests/unit/test_virtual_pad_factory.py:278`, que afirma o oposto de "recusar": `assert "capture_dualsense_blueprint" not in fonte`. O `if b"\x85\x31" in descriptor` de `:684` é um `logger.info` dentro de uma função que ninguém chama, e a função **devolve** o descriptor (`:712`).
- **Segunda queda, de aparelho:** essa função é fechada por `_is_dualsense(node)` (`:664-666`). Para o **Pro** não existe descriptor a capturar — é mecanismo do DualSense colado numa linha `@pro`.
- **Terceira, de forma:** das 308 linhas, 223 têm `radio_offset` vazio, e as preenchidas carregam offset de byte. Nenhuma carrega a negação da existência de um report. E `cabo_offset` está vazio: encher só o rádio **publica uma assimetria que não existe** — o vpad é `BUS_USB` com o Pro no cabo E no rádio.
- **A verdade é mais simples e mais forte:** o caminho de captura **nunca é percorrido** — a factory embute `canonical_blueprint()` (`virtual_pad.py:282`), e `CANONICAL_DESCRIPTOR_USB` (`uhid_blueprint.py:82-84`) tem 289 B **sem** o item `85 31`.

---

## Sobreviveu raspando — 8 propostas com 1 refuta de 3

Passaram, mas o cético anotou reparo que quem aplicar precisa ver.

| célula | o reparo obrigatório |
| --- | --- |
| `plataforma.handshake_usb@pro` · `radio_offset` | `JC_USB_CMD_EN_TIMEOUT` aparece **uma vez no arquivo inteiro** (o `#define`, `:172`) — não é enviada por barramento nenhum. Saem **QUATRO** comandos, com HANDSHAKE duas vezes. O erro nasceu no `cabo_offset` da mesma linha, e tem de ser corrigido lá, não espelhado aqui. |
| `plataforma.sniff@pro` · `radio_offset` | A citação literal `ENV{HID_NAME}=="*Pro Controller*"` é falsa: o arquivo diz `ENV{HID_NAME}!="*[Pp]ro [Cc]ontroller*", GOTO=...` — **negativa, com classes de caixa**. Um Pro que se anuncie em minúsculas casa na regra real e não casaria no texto proposto. E aplicar só esta célula deixa `radio_ressalva`, `radio_comando`, `radio_codigo_ref` (aponta `:1-24`, hoje só comentário) e `assimetria_declarada` contradizendo a linha. |
| `audio.alto_falante@dualsense` · `radio_offset` | Tirar **ESTÉREO**: a casa mediu em 16/08 que o alto-falante interno é MONO (`2026-08-16-E5-O-TERRENO…:245`, "REFUTADO na prática"). O estéreo do DS5Dongle serve à rota de FONE (`0x16`). E declarar a divergência: o Senshi monta um `0x39` **também de 547 B, também com CRC em `[543]`**, com o Opus **espelhado** em `[13..412]` e o háptico no fim (`DualSenseBtReportBuilder.kt:63-70`, `:959-1014`) — a proposta citou o `0x35` e o `0x36` do Senshi como corroboração e calou sobre o `0x39` dele, que é a única célula em disputa. |
| `audio.alto_falante@dualsense` · `radio_canal` | A separação de 15/08 continua valendo: a hipótese mora em `audio.saida_dedicada.payload_do_degrau@dualsense`, e `radio_offset` desta linha ainda diz "não localizado". |
| `entrada.stick@sn30` · `radio_offset` | Os bytes 6-8 / 9-11 só existem no report **0x30**, e `radio_report_id` desta linha está **vazio** — offset sem o id que o ancora é o erro do `data[1]` × `data[2]`. E por rádio o `SET_REPORT_MODE` é justamente onde o firmware clone falha (`:1543`, `:2951`), com `joycon_may_degrade` USB-only. |
| `energia.bateria.degraus@sn30` · `radio_offset` | Tirar a cláusula "sem byte de sequência **nem CRC**": um CRC de cauda é **invisível** a um driver que ignora tudo além da struct — o silêncio não é prova de ausência, e a cláusula é decorativa (nenhum CRC de cauda deslocaria o byte 2). E "`joycon_parse_report` também não consulta `hdev->bus`" é falso: `:2022`. |
| `vibracao.rumble.passthrough@sn30` · `radio_evidencia` | **Tirar o `enable_imu` da frase.** Ele é barrado duas vezes para este aparelho: `e_pro_genuino` recusa pela OUI `e417d8` (`linhagem_nintendo.py:70`) e o chamador exige `bus == "usb"` (`external_identity.py:218`, `:931`). É valor do Pro colado na linha do SN30 — e num campo de rumble, onde o pacote do `enable_imu` carrega 8 bytes de rumble neutro. |
| `plataforma.vpad@pro` · `radio_report_id` | O "sempre BUS_USB" vale **no canal uhid**: com máscara xbox o vpad cai em `uinput` e não tem report id nenhum. E `cabo_report_id` está vazio, então "os MESMOS do cabo" aponta para o nada. |

---

## As três réguas que os céticos usaram e valem copiar

O que separou uma conferência boa de uma leitura crédula, nesta rodada:

1. **Compilar em vez de contar de olho.** Dois céticos recompilaram as structs do driver e imprimiram `offsetof` — foi assim que `left_stick` nos bytes 6-8 e `player_leds` no `report[46]` ficaram **provados mecanicamente**, e não lidos. Um terceiro rodou o próprio builder da casa (`build_bt_report` com `common[43]=0xAB` -> índice 46) e cruzou com as quatro linhas irmãs. Três réguas independentes para um número.
2. **Baixar a fonte externa no commit fixado, e conferir o hash.** Vários baixaram do `raw.githubusercontent` em vez de acreditar na cópia do scratchpad, e compararam md5/sha256. Um extraiu as 256 entradas da tabela CRC do Senshi e rodou `compute()` contra `zlib.crc32(b'\xa2' + dado)` em 200 buffers aleatórios — igual em todos. Outro mediu a **proveniência** (data de criação, estrelas, se a leitura existe a montante), que foi o que derrubou "quatro fontes independentes".
3. **Ler o CSV do disco, nas duas árvores, e no `git show HEAD:`.** Foi assim que se descobriu que **o enunciado da tarefa estava errado em duas células** (`toque.touchpad.cursor@dualsense / radio_offset` e `plataforma.handshake_usb@pro / radio_canal` já estavam preenchidas), e que `luz.led_jogador@dualsense / radio_evidencia` não está vazia: é o `cabo_evidencia` **palavra por palavra** mais 160 caracteres de 09/08 (`radio_evidencia.startswith(cabo_evidencia)` -> True). Um usou `git blame` para provar a data de uma cura (`e1908308`, 25/08) e mostrar que a célula do CSV é anterior a ela.

---

## Ressalva de método deste documento

O journal **não** liga explicitamente cada refutação à proposta que ela ataca. O casamento
aqui foi feito por sobreposição de endereços (`arquivo:linha`, literais hexadecimais e
nomes de arquivo) entre o texto da refutação e o `endereco`/`valor`/`raciocinio` da
proposta, e conferido contra os campos `votos`/`refutas` das 13 células sobreviventes em
`resultado-w6f1jxfra.json` — que bateram. Três grupos ficaram com contagem de céticos
diferente de 3 (uma refutação atribuída ao vizinho mais próximo); nenhum deles muda a
lista de 30 nem o conteúdo de nenhum item, porque **o texto de cada refutação nomeia a
proposta que ataca**. Onde a atribuição era duvidosa, o item foi escrito a partir da
refutação sozinha.
