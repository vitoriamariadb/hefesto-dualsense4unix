---
sprint: A-BANCADA-QUE-O-RADIO-PEDE-INDICE
estado: aberta
onda: BANCADA-DO-RADIO
posse:
  COORDENA:
    - docs/process/sprints/2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md
cria: []
bancada: true
depois_de: [A-RECUSA-QUE-CITOU-O-MAPA-01]
nao_toca:
  - src/
  - tests/
  - layout/
  - novo-layout/
  - install.sh
---

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.1 e §2.4 — o ensaio 1 (som no rádio) entra no FECHO das 24 horas, com ela; o resto depois.

# A BANCADA QUE O RÁDIO PEDE — o índice

**Vinte e três ensaios com o aparelho na mesa.** É o que sobrou depois de três
rodadas de levantamento em fonte externa: o que a leitura de código **não pode**
responder, com o preço de cada resposta e a célula do mapa que ela move.

**Isto não é uma fila de execução — é um cardápio.** Nada aqui se roda sem a
palavra dela: todo ensaio pede o aparelho, e a maioria pede a orelha, o olho ou
a mão dela como instrumento. Quem escolher pela ordem da tabela do §0 está
escolhendo pelo mesmo critério que a montou: **custa pouco, decide muito.**

**De onde isto vem.** As três rodadas leram dezoito fontes externas e produziram
40 células no `docs/data/mapa-controles.csv`. Em nenhuma delas o grau subiu além
de `inferido-do-codigo` — por construção, e está escrito no
`docs/data/LEIA-PRIMEIRO.md`: leitura de fonte é `inferido-do-codigo`, e a
escada de `ate_onde_foi` só sobe do primeiro degrau **com hardware**. As 29
propostas de bancada que as rodadas deixaram estão consolidadas abaixo em 23
sessões (várias propostas apontavam para o mesmo ensaio).

---

## §0 — A ORDEM, e por que ela é esta

Ordenada por **custo crescente dentro de cada patamar de decisão**. As quatro
primeiras somam **29 minutos** e movem sete células.

| # | ensaio | aparelho | tempo | o que decide |
|---:|---|---|---:|---|
| **1** | **Som no rádio, com a orelha dela** | DualSense | **4 min** | fecha um `inconclusivo` aberto desde 16/08/2026 |
| **2** | Haptics E-A — qual enquadramento o firmware parseia | DualSense | 5 min | decide se o ensaio 3 (30 min) vale a pena |
| **3** | LED de jogador — o `[46]` por discriminação | DualSense | 10 min | 2 células: `inferido-do-codigo` → `medido`/`olho-dela` |
| **4** | Touchpad por rádio — o nó, a ACL e os três eventos | DualSense | 10 min | 1 célula → `medido`; e pode achar defeito com dono |
| 5 | O contador de fio (byte 1 do `0x30`) | Pro | 10 min | resolve uma dúvida que o próprio driver confessa |
| 6 | LED do Home no `btmon` | Pro | 10 min | 1 célula → `medido`; e o olho dela na lâmpada |
| 7 | Gatilho — os bytes 43/44 vivos | DualSense | 15 min | 2 células; e o `aciona = não` deixa de ser por ausência |
| 8 | IMU do Pro — a distribuição inteira dos deltas | Pro | 15 min | tira duas células do PISO; dá o número dos 95% |
| 9 | Os sete ids que só o cabo declara | DualSense | 15 min | 1 célula; e vale para `plataforma.escrita_crua@dualsense` |
| 10 | Qual tipo o SN30 declara (byte 17) | Pro + SN30 | 15 min | decide se a OUI continua sendo o único discriminador |
| 11 | Haptics E-B — o `0x12` faz alguma coisa | DualSense | 30 min | só se o 2 der verde; a mão dela é o instrumento |
| 12 | Sniff ou cadência | Pro + SN30 | 40 min | decide se o no-sniff do adaptador ainda se justifica |
| 13 | O degrau que fala — áudio por rádio de verdade | DualSense | 40 min | a outra metade do ensaio 1 |
| — | **↓ daqui para baixo tudo começa por um PAREAMENTO NOVO ↓** | | | |
| **14** | **Ensaio A — o pareamento, e as duas linhas que decidem** | SN30 | **20 min** | abre os nove seguintes; 2 células |
| 15 | A contradição do MAC por modo | SN30 | +5 min sobre o 14 | duas páginas da casa que não podem estar as duas certas |
| 16 | Ensaio C — o histograma de cadência | SN30 | 10 min | **o número que explica rumble, LED e IMU de uma vez** |
| 17 | A captura crua — byte 0 e os botões | SN30 | 15 min | 3 células; e derruba ou confirma o `parcial` da linha |
| 18 | Ensaio B — o enable-IMU e a cascata | SN30 | 20 min | decide o `radio_aciona` de toda a família de movimento |
| 19 | LED de jogador do SN30 — dose-resposta | SN30 | 15 min | 1 célula, com dose-resposta em vez de anedota |
| 20 | Rumble A/B com o `skip_tx_on_rate_exceeded` | SN30 | 20 min | decide se a cura do mainline entra no patch DKMS |
| 21 | Frequência do rumble — o espectro, **no cabo** | SN30 | 20 min | `afirmado-no-doc` → `medido`, na unidade DELA |
| 22 | A sonda de fabricante `01 66 AA 00 21 01` | SN30 | 15 min | separa «o firmware cala» de «o driver não deixa passar» |
| 23 | Bateria — três ensaios, o último com 2 h passivas | SN30 | 45 min + 2 h | 1 célula; e corrige uma ressalva possivelmente falsa |

---

## §1 — AS QUATRO REGRAS DESTA MESA

Cada uma nasceu de um estrago já pago. Elas valem em **todos** os 23 ensaios.

1. **Nunca mandar o subcomando `0x38` (SET_HOME_LIGHT) no clone 8BitDo.** O SDL
   registra que controles de terceiros *«will shut off if we try to set it»*, e é
   esse subcomando que devolve `-110` nos logs de clone desta casa. Nenhum ensaio
   do §4 o usa.
2. **Nunca escrever report cru no hidraw do SN30 POR RÁDIO** sem que o ensaio o
   peça explicitamente — o gesto já foi medido como letal para o enlace neste
   firmware. O ensaio 21 é no CABO por causa disto.
3. **`os.write()` num hidraw devolve sucesso quando o KERNEL aceita a entrega,
   nunca quando o firmware obedece.** O retorno da chamada não é a medição.
   Medido em 15/08/2026 e escrito na `radio_ressalva` de
   `plataforma.escrita_crua@dualsense`.
4. **Bombardeio de subcomando mata o 8BitDo por rádio** (06-07/08/2026).
   Escritas espaçadas à mão são seguras; laço automático não é.

E uma regra de instrumento, que vale para o §4 inteiro: **a cópia DKMS desta
árvore é `v7.0.11` + os quatro patches da casa** (`assets/dkms/hid-nintendo/patch/BASELINE`)
e **não** tem a cura do mainline de 03/08/2026 (`JC_SUBCMD_RATE_MAX_FAILURES`,
queda para o throttle legado de 25 ms). Toda medição por rádio tem de declarar
contra qual driver rodou.

---

## §2 — DUALSENSE

### 1. Som no rádio, com a orelha dela — **4 minutos, e é o mais barato da lista**

**O que ligar.** Um DualSense **só no rádio** (cabo desplugado). Daemon vivo,
volume do alto-falante interno no que o produto põe por padrão. Um jogo ou
qualquer fonte de som roteada para o controle, como em 16/08.

**O que olhar.** A orelha dela. Sai som pelo alto-falante do controle, ou não?

**O que a resposta decide.** O ensaio `som-no-radio-observado-nao-replicado`
está `inconclusivo` no `docs/data/ensaios.csv` desde 16/08/2026, depois de
**quatro** replicações negativas contra a lembrança dela — *«a minha certeza do
lance do som no bt do speaker do dualsense, tinha feito funcionar quando
testávamos no pragmata»*.

**Agora ele tem alvo, e é a novidade de 31/08/2026.** A rodada 3 achou a causa
das quatro negativas em código, e ela está escrita na `radio_evidencia` de
`audio.alto_falante@dualsense`: por rádio o kernel **nunca** escreve
`audio_control`, `speaker_volume` nem `audio_control2`, porque o bloco que os
escreve (`assets/dkms/hid-playstation/hid-playstation.c:1487-1526`) só é
alcançado quando `plugged_state` muda, e `plugged_state` só é escrito dentro do
`if (hdev->bus == BUS_USB)` de `:1647`. Do outro lado, o quirk de ALSA casa por
`USB_ID`: por rádio não existe `usb_mixer_interface`, logo não há placa, sink
nem stream a rotear.

Então **só há duas saídas**, e o ensaio as separa em quatro minutos:

- **sai som** → ela ouviu por um caminho que este mapa não conhece, e o achado é
  grande: existe rota de áudio por rádio fora do kernel;
- **não sai** → a lembrança caducou (ou era o Pragmata no cabo), e o ensaio
  fecha como `nao-e-a-causa` com mecanismo escrito, em vez de `inconclusivo`.

**O que ele NÃO decide, e precisa ficar dito:** o caminho do kernel estar fechado
**não** prova que o aparelho recuse áudio por rádio. O descritor declara a escada
`0x32`-`0x39`, a rodada 1 achou o formato do payload (Opus) em fonte externa, e
ninguém desta casa mandou um único byte de áudio por rádio. Isso é o ensaio 13.

---

### 2. Haptics E-A — qual enquadramento o firmware parseia — **5 min**

**O que ligar.** UM DualSense por rádio, pareado, daemon vivo, escrita pelo
broker, `--exigir-mac`. Instrumento: `scripts/ensaios/corpo_do_degrau.py`. Use o
**BRANCO `14:3a:9a:00:00:ab`** (hw `0x0711`, BDM-050) — é o mesmo aparelho da
medição de 15/08, e só assim os dois resultados são comparáveis.

**O que olhar.** Pelo report `0x32` de 142 B, o MESMO pedido de cor duas vezes,
apagando com `0x31` entre um e outro: **(a)** forma da casa (`[2]=0x10`, common
em `[3..49]`, `valid_flag1=0x04`, RGB=VERDE) — controle positivo, já acendeu em
15/08; **(b)** forma do DS5Dongle (`[2]=0x90`, `[3]=0x3f`, `SetStateData` em
`[4..66]`, RGB=AZUL em `[48..50]`).

**O que decide.** Acendeu AZUL na (b) → o firmware despacha pelo bit 7, os dois
enquadramentos valem, e os offsets 12/76 do `0x39` transferem como estão — e o
ensaio 11 vale a pena. Não acendeu → o enquadramento TLV do DS5Dongle não vale
neste aparelho e **todo** offset da célula `vibracao.haptics_vcm@dualsense /
radio_offset` tem de ser reconferido antes de virar código.

**A mordida.** Repetir a (b) com `--crc-errado`: não pode acender. E repetir os
dois no `d4:2f:4b:00:00:d8` (hw `0x1111`, BDM-060M) — esta casa já mediu que
coisa de firmware varia por série, e a obediência de 15/08 foi vista em **um**
aparelho só.

---

### 3. LED de jogador — o `[46]` por discriminação — **10 min**

**O que ligar.** Daemon PARADO (`systemctl --user stop`). **UM** DualSense só, no
rádio, nenhum no cabo — confirmar pelo nó: `ls -l /sys/class/hidraw/hidrawN/device`
tem de mostrar `0005:054C:0CE6` (bus `0005` = Bluetooth).

**O que olhar.** Escrever direto no `/dev/hidrawN` os 78 bytes de
`build_bt_lightbar_report(None, padrao)` — `rgb=None` de propósito, para o bit da
lightbar ficar desligado e o **único** campo em movimento ser o número do
jogador. Ciclar P1 (`--x--`), P4 (`xx-xx`) e os cinco acesos, 3 s em cada. **Ela
diz em voz alta quais lâmpadas acendem.**

**O que decide.** Duas células de uma vez — `luz.led_jogador@dualsense /
radio_offset` e `/ radio_evidencia`. Se as três figuras baterem com a tabela do
driver, as duas sobem para `medido` / `olho-dela`.

**A mordida, e é ela que fecha a divergência com o OpenRGB:** remontar o MESMO
report no layout do OpenRGB (common em `[2]`, sem o tag `0x10`, CRC recalculado)
e mandar. Se as lâmpadas TAMBÉM mudarem, o firmware não está lendo em `[46]` e a
proposta cai inteira; se não mudar nada, o `[46]` fica provado **por
discriminação** e a leitura do OpenRGB sai do mapa.

**Duas armadilhas já pagas por esta casa.** (1) NUNCA mandar `flag1 0x08`
(RELEASE_LEDS) neste ensaio — ele apaga o número do jogador, 03/08 mediu isso.
(2) NÃO ler o resultado por `cat` no sysfs: o `_get_brightness` do driver devolve
variável em RAM do kernel, nunca o aparelho — é o que já fez o `doctor.sh`
mentir. **A leitura é o olho dela.**

---

### 4. Touchpad por rádio — o nó, a ACL e os três eventos — **10 min**

**O que ligar.** Controle SÓ no Bluetooth. Cabo desplugado — senão o kernel
enumera o caminho USB e o ensaio mede o transporte errado.

**O que olhar**, nesta ordem:

1. (1 min) **O nó existe.** Listar os `InputDevice` e achar um com nome terminado
   em `Touchpad` e `uniq` = o MAC real do controle (não `02:fe:*`, que é vpad).
2. (1 min) **A ACL chegou.** `getfacl /dev/input/eventN` → esperado
   `user:<ela>:rw-`, posto pela `assets/72-hefesto-touchpad-motion-uaccess.rules`.
   Se vier só `root:input`, a regra não casou por rádio e **o achado é maior que
   a célula**.
3. (3 min) **Os três eventos.** `evtest`, um dedo arrastando devagar: têm de sair
   `EV_KEY BTN_TOUCH 1`, `EV_ABS ABS_X`, `EV_ABS ABS_Y`.
4. (2 min) **O cursor.** Com o daemon vivo, arrastar e ver o cursor andar; anotar
   QUEM moveu (`udevadm info … | grep LIBINPUT_IGNORE_DEVICE`: ausente = libinput,
   que é o esperado hoje).

**O que decide.** `toque.touchpad.cursor@dualsense / radio_evidencia`:
`inferido-do-codigo` → `medido`.

**A mordida, que é o que faz o ensaio valer:** repetir o passo 3 com DOIS dedos —
apoiar A, apoiar B, levantar A sem levantar B. Se `BTN_TOUCH` NÃO cair e `ABS_X`
saltar para a posição de B, a leitura do `input-mt.c` está confirmada **e vira
defeito com dono**. Se `BTN_TOUCH` cair, a leitura está errada e é o que se quer
saber.

Nada aqui escreve no controle, e o `evtest` só LÊ.

---

### 7. Gatilho — os bytes 43/44 vivos — **15 min**

**O que ligar.** DualSense por rádio, já pareado, sem `sudo` (o hidraw já tem
`uaccess` pela regra da casa). Armar um efeito de gatilho **só no DIREITO**, com
ponto de resistência conhecido, pelo caminho que o produto já tem.

**O que olhar.** Ler o hidraw cru, filtrar os reports `0x31` de 78 bytes e
imprimir os bytes **43** e **44** em três momentos: repouso, meio curso, e
resistência vencida. Esperado: 43 se mexe e 44 fica parado; o nibble BAIXO de 43
mostra o ponto de parada (0..9) e o nibble ALTO vira de 0 para 1 ao vencer a
resistência.

**O que decide.** As duas células novas de 31/08 — `gatilho.leitura@dualsense /
radio_offset` e `/ radio_evidencia` — hoje `inferido-do-codigo` a partir de
código de terceiro. **E um terceiro resultado tem de ser aceito como resposta:**
os dois bytes ficarem em zero o tempo todo por rádio confirmaria
`radio_aciona = não` COM PROVA, em vez de por ausência de notícia — que é
exatamente o defeito de leitura que esta casa mais paga.

**Mordida 1:** passar o efeito para o gatilho ESQUERDO e ver a mudança migrar
para o 44. Se os dois se mexerem juntos, ou se o 44 responder ao efeito do
direito, o par está invertido e o valor sai do mapa.
**Mordida 2:** repetir no CABO lendo `report[42]`/`[43]`; se lá o dado aparecer
em `[43]`/`[44]`, a base 2 do rádio está errada e a conta inteira cai.

---

### 9. Os sete ids que só o cabo declara — **15 min**

**O que ligar.** Um DualSense no rádio (dois, se quiser a Lei 4 da mesa 2+2 — e
depois a TROCA DE BRAÇOS, o mesmo aparelho no cabo, para separar unidade de
transporte). Daemon RODANDO, entrada pelo broker. **Nenhum byte escrito** — nada
de SET_FEATURE, e em especial nada na família `0x80`, que tem trava própria.

**O que olhar.** Os SETE ids que só o cabo declara (`0x0A` 27 B, `0x0C` 42 B,
`0x21` 5 B, `0x84` 64 B, `0x85` 3 B, `0xA0` 2 B, `0xE0` 64 B) respondem quando
pedidos por rádio? E, quando o rádio recusa, que `errno` e que **tempo**? A
separação pelo relógio é o coração do ensaio: 0,01-0,05 s = o firmware respondeu
na hora (recusa definitiva); ~3 s = estouro do `REPORT_REQ_TIMEOUT` do BlueZ (o
rádio se perdendo, e a única coisa que repetir cura); `ENODEV` = o controle
sumiu. Em paralelo, `btmon` filtrado no PSM de CONTROLE (`0x0011`) — é o único
lugar onde o código do HANDSHAKE aparece, porque BlueZ e uhid achatam todos em
`errno 5` antes do espaço de usuário.

**O que decide.** `plataforma.declarado_sem_resposta@dualsense / radio_offset`.
Se algum dos sete recusar, o `radio_report_id` da linha deixa de ser «NENHUM» e
ganha lista própria; se todos responderem, a linha ganha a afirmação forte que
hoje não tem — *«o rádio entrega até o que não declara»* — e ela vale para
`plataforma.escrita_crua@dualsense` também.

**A mordida:** pedir por rádio um id que NENHUM dos dois descritores declara (por
exemplo `0x7A`) e ver a régua acusar recusa. Se o instrumento devolver «ok» ou
ficar mudo, ele não sabe ver recusa por rádio e a corrida inteira é ruído.
**Controle positivo:** pedir `0x05` por rádio, que responde.

---

### 11. Haptics E-B — o `0x12` faz alguma coisa — **30 min, e só se o 2 der verde**

**O que ligar.** DualSense por rádio. Montar um `0x39` de 547 B exatamente como o
DS5Dongle, com uma senoide de fundo de escala em `int8` estéreo nos dois blocos
de 64 B, e enviar em laço a ~47 reports/s por 3 s.

**O que olhar**, nesta ordem: (1) **a MÃO dela nos punhos** — o VCM é sentido,
não visto, e nenhum instrumento substitui isso; (2) `btmon` confirmando
`ACL Data TX dlen 552` saindo; (3) o report de entrada `0x31` continuando a
chegar — se o enlace cair, o pacote foi recusado de um jeito que importa.

**Três controles que fazem o ensaio morder**, e sem eles ele não vale nada:
(i) o MESMO report com o CRC corrompido — não pode vibrar; (ii) o MESMO report
com a tag `[10]` trocada de `0xD2` para `0xD5` (tipo inexistente) — se ainda
vibrar, a tag não está sendo lida; (iii) o MESMO report com os 128 bytes de PCM
ZERADOS — não pode vibrar.

**Confundidor a eliminar antes de começar, e ele é do nosso lado:**
`UseRumbleNotHaptics` (flag0 bit 1) tira os VCM do modo PCM, e o rumble do
Hefesto o liga a cada vibração. O ensaio tem de rodar com o rumble calado e
**provar isso** — nenhum `0x31` com flag0 bit 1 na janela, conferido no `btmon`.

---

### 13. O degrau que fala — áudio por rádio de verdade — **40 min**

É a outra metade do ensaio 1, e o único caminho para
`audio.alto_falante@dualsense` sair de `inferido-do-codigo` pelo lado positivo.
Mandar áudio pela escada `0x32`-`0x39` e ver se sai som — com a orelha dela, e
com o `btmon` provando que o quadro saiu. **Enquanto ele não roda, o honesto é o
par que a célula já escreve:** o mapa não sabe, e a lembrança dela não foi
derrubada.

Duas coisas que a rodada 3 acrescentou e que mudam como se lê o resultado:
a escada é de **mão única** (de `0x32` a `0x39` só há Output — quem mandar áudio
**não terá recibo do aparelho**), e o `dlen 552` já está medido no `btmon` desde
15/08, então o canal não é a dúvida. A dúvida é o **conteúdo**.

---

## §3 — PRO CONTROLLER GENUÍNO

### 5. O contador de fio (byte 1 do `0x30`) — **10 min**

**O que ligar.** Só o Pro genuíno, conectado por rádio e ocioso. Descarregar o
`hid-nintendo` e ler 30 s de `/dev/hidraw` cru.

**O que olhar.** Para cada relatório `0x30`, o **byte 1** e o instante de
chegada. (1) O byte incrementa de 1 em 1, ou de 3 em 3 (um por amostra de IMU)?
O driver diz textualmente que *«it is not entirely clear what rate it increments
at»* — e essa dúvida é resolvível em dez minutos. (2) Há saltos no contador que
coincidam com deltas grandes?

**O que decide.** `plataforma.taxa_relatorios@pro / radio_offset`. E, se houver
saltos casados, os 1613 episódios de perda de IMU de 07/08 passam a ter
confirmação **de fio**, não só a estimativa por divisão que o driver faz. Repetir
30 s por cabo dá de quebra o `cabo_*` que esta linha nunca teve.

---

### 6. LED do Home no `btmon` — **10 min, 4 deles de captura**

**O que ligar.** Pro genuíno já pareado e **no rádio** (instância
`0005:057E:2009.*`), com o daemon do Hefesto **PARADO** — senão o
`write_player_number` escreve neste mesmo nó (defeito R-25,
`src/hefesto_dualsense4unix/core/external_leds.py:126-138`) e suja a captura.

**O que olhar.** Numa janela, `sudo btmon -w /tmp/home-led.btsnoop`. Noutra,
`echo 15` no nó `:blue:player-5`, esperar 2 s, `echo 0`. **Uma coisa só:** no
canal de INTERRUPÇÃO (PSM `0x0013`), o quadro de saída tem de ter **17 bytes** —
`A2 01 <n> <8 B de vibração> 38 01 F0 FF 11 11` para brilho 15.

**O que decide.** `luz.led_home@pro / radio_offset`, que em 31/08 ganhou os
offsets por leitura de fonte e diz com todas as letras que **não é medição**. Se
o quadro sair assim, sobe para `medido`.

**Atenção:** o `btmon` **não** decodifica HID, então o `0xA1`/`0xA2` aparece no
hexdump — é ele que faz um dump de rádio parecer «deslocado +1» em relação ao
hidraw. Conte a partir do byte seguinte.

**De graça, no mesmo ensaio, e é outra coluna:** o olho dela no anel azul do
Home — acende no 15, apaga no 0. Isso promove `radio_aciona` e a existência da
LÂMPADA, que nenhuma leitura de fonte alcança.

**Se não sair quadro nenhum:** o subcomando não foi ao ar — olhe o `dmesg` por
`-110` e por `exceeded max attempts`, e então a resposta da célula deixa de ser
«onde» e passa a ser «não passa». Duas escritas atravessam folgadas o limitador
de 60 ms; isto não é bombardeio.

---

### 8. IMU do Pro — a distribuição inteira dos deltas — **15 min**

**O que ligar.** Pro genuíno **por rádio**, parado na mesa, daemon rodando — e o
par pelo cabo na mesma noite.

**O que olhar.** (1) Ligar a régua que já existe **de graça dentro do driver**:
`hid_dbg` de `joycon_parse_imu_report` por dynamic debug, e 60 s de
`journalctl -k -f`. A ~89 relatórios/s dá ~5.400 linhas
`ms= last_ms= delta= avg_delta=` — a distribuição INTEIRA, incluindo as perdas de
1 a 3 relatórios que nunca imprimem e as que o ratelimit come. (2) Na mesma
janela, ler o `/dev/hidraw` em leitura pura e gravar, por relatório `0x30`, o
relógio monotônico e o byte 1.

**O que decide.** Duas células: `movimento.imu.perda@pro / radio_offset` e
`/ radio_evidencia`. Hoje o `medido` dessa linha é um **PISO** com dois
mecanismos de subcontagem — as perdas de 1 a 3 nunca imprimem, e o
`hid_warn_ratelimited` corta acima de 10 linhas / 5 s (as duas causas estão
escritas na célula desde 31/08). O ensaio tira o piso e entrega três números que
a casa nunca teve: quantos deltas ≥ 60 ms houve de verdade contra quantas linhas
o journal imprimiu; o `avg_delta` real (que decide se o limiar é 60 ou 82 ms); e
**a fração de deltas dentro de 8-17 ms — que é exatamente a métrica dos 95%
publicada na linux-input, agora calculada sobre a unidade dela.**

**Controle negativo obrigatório:** registrar a maior parada do próprio laço de
leitura. Sem ele, um engasgo do host lê como perda do controle — e este mapa já
tem o precedente escrito (`plataforma.limitador_subcomando@pro`: *«o storm era de
CPU e de log, não de rádio»*).

**Variação que separa a sala do driver:** repetir uma vez com o link limpo e uma
vez com o forno/micro-ondas ligado.

---

### 10. Qual tipo o SN30 declara (byte 17) — **15 min**

**O que ligar.** Só o SN30 em modo Switch, pareado, e o adaptador BT. Depois o
Pro **genuíno** como controle da medição.

**O que olhar.** Com `hid-nintendo` carregado, ligar o dynamic debug do módulo e
procurar no `journalctl -k` a linha `controller type = 0x%02X` — ela é `hid_dbg`
e sai calada sem isso. Anotar o valor **por rádio**, desconectar, repetir **por
cabo**, e repetir com o Pro genuíno (esperado `0x03`).

**O que decide.** `plataforma.distinguir_clone@pro / radio_offset` e, por
tabela, a doutrina inteira do discriminador. Se o SN30 devolver `0x03`, o byte 17
NÃO serve e a negativa por OUI continua sendo a única resposta por rádio — que é
o que a `radio_evidencia` de `plataforma.distinguir_clone@sn30` já conclui. Se
devolver `0x06`, a casa ganha um discriminador que não depende de lista de OUI.

**A consequência que ninguém viu ainda, e é a razão de este ensaio valer 15 min:**
a cópia DKMS desta árvore só conhece `JOYCON_CTLR_TYPE_PRO = 0x03` e **não tem**
o `LIC_PRO = 0x06`. Se o SN30 devolver `0x06`, `joycon_type_is_procon()` dá falso
e ele perde IMU, LED e rumble nesta máquina, **em silêncio**.

---

### 12. Sniff ou cadência — **40 min**

**O que ligar.** Um controle por vez, watchdog do `bt_active_mode.sh` PARADO
(como no A/B de 23/07), `hid-nintendo` carregado.

**O que olhar.** Quatro passos de 10 min: (1) clone com sniff no default, 30 s de
hidraw cru com o módulo descarregado, histograma dos deltas — a pergunta é se o
SN30 entrega **em pares** (deltas de 0 ms), como o Pro 2 do patch; (2) o mesmo
com `hcitool lp <MAC> RSWITCH`; (3) os dois passos com o Pro genuíno; (4)
opcional, `btmon` durante o connect do clone para ver se o `LMP_sniff_req` é de
fato recusado.

**O que decide.** `plataforma.sniff@pro / radio_evidencia`. Se a fração dentro de
8-17 ms do clone for baixa **nos dois casos**, o `-110` é cadência e não sniff — e
a cura certa é a do mainline (throttle legado), não devolver o sniff ao adaptador
inteiro. **Custo de errar isto:** hoje o default do adaptador fica COM sniff por
causa do clone, e é o Pro genuíno que paga.

---

## §4 — SN30 PRO (o clone), e o pareamento que abre tudo

**Tudo neste bloco começa pelo mesmo item caro**, e ele está escrito na canônica
desde 07/08: `docs/protocol/externos-referencia-canonica.md:915-920` —
*«neste adaptador não há bond do 8BitDo em modo Switch … qualquer medição deste
modo pelo rádio começa por um pareamento novo, e continua sendo o item mais caro
desta página.»* O modo Switch é **Y+Start**.

**Um detalhe que muda o resultado:** o relato `DanielOgorchock/linux#10` diz que
o pareamento **antigo** é justamente o caso que falha, e que recém-pareado
responde. Então o controle deve ser **esquecido e pareado de novo** antes de
começar — e o pareamento tem de ser com o **sniff LIGADO**, porque a regra 82 é
escopada na OUI do Pro genuíno e não alcança o clone.

### 14. Ensaio A — o pareamento, e as duas linhas que decidem — **20 min**

**O que ligar.** SN30 em modo Switch (LED rotativo), esquecido e pareado de novo.
Antes do pareamento, ligar o dynamic debug do `hid_nintendo` e deixar `dmesg -w`
aberto.

**O que olhar.** **Duas linhas decidem:** `controller MAC = XX:XX:…` prova que a
identidade veio do `REQ_DEV_INFO`; `controller type = 0x..` é o **byte 17** do
report `0x21`. Depois, comparar a OUI nas **três estradas** e ver se concordam: a
do driver (`uniq` do evdev, isto é, o report `0x21`), a do enlace (`HID_UNIQ` no
udev) e a do BlueZ (`bluetoothctl devices`). **Se divergirem, é achado** — a
doutrina do «único discriminador» vale para as três hoje por suposição, não por
medição.

**A previsão falsificável, e é o que faz o ensaio valer:** por rádio
`joycon_may_degrade()` é FALSO, então um `REQ_DEV_INFO` que falhe **derruba a
probe** — sem evdev, sem `uniq`, sem OUI. Ou seja: se o controle APARECE por
rádio em modo Switch, ele necessariamente respondeu; se não aparece, a pergunta
fecha pelo lado negativo.

**O que decide.** `plataforma.distinguir_clone@sn30 / radio_report_id` e
`/ radio_offset` — as duas propostas que a quarta régua **recusou** em 31/08 por
falta de medição. Este ensaio é o que as torna gravaveis.

---

### 15. A contradição do MAC por modo — **+5 min sobre o ensaio 14**

**Duas páginas desta casa não podem estar as duas certas.**

| onde | o que diz |
|---|---|
| `docs/usage/troubleshooting-8bitdo.md:130-138` | *«O mesmo controle físico usa endereços Bluetooth diferentes em cada modo (**medido nesta bancada**: dois endereços que só diferem no fim, ambos com o OUI `E4:17:D8` — **um em Switch**, outro em PS4).»* |
| `docs/protocol/externos-referencia-canonica.md:915-920` | *«Neste adaptador **não há bond do 8BitDo em modo Switch**: eram quatro bonds em 07/08, e nenhum era ele.»* |

Se um endereço de modo Switch foi **medido nesta bancada**, houve bond em modo
Switch. Se nunca houve bond, o endereço de Switch não pode ter sido medido aqui.
E a `radio_ressalva` de `plataforma.distinguir_clone@sn30` acrescenta um terceiro
enunciado que não fecha com o primeiro: *«que este controle mantenha o MESMO
endereço ao trocar de modo NUNCA FOI MEDIDO»*.

**O ensaio.** Depois do pareamento do 14, anotar o endereço em modo Switch.
Trocar para modo PS4 (o controle reconecta noutro modo), parear e anotar o
segundo. Comparar.

**O que decide.** Qual das duas páginas leva a nota datada, e qual leva a
substituição. A regra da casa é explícita: *não se apaga decisão medida, mas fato
errado se SUBSTITUI* — e aqui uma das duas afirmações é fato errado, em dois
lugares, esperando alguém com o aparelho na mesa. **Nenhum agente resolve isto
lendo.**

**Cuidado:** trocar de modo **não** reaproveita o bond. São dois pareamentos
distintos, e o bond do outro modo continua no BlueZ.

---

### 16. Ensaio C — o histograma de cadência — **10 min, e é o que mais rende**

**O que ligar.** `hid_nintendo` desligado/blacklistado. Abrir o `/dev/hidrawN` do
`0005:057E:2009` por Bluetooth em modo Switch.

**O que olhar.** Carimbar a hora de cada relatório de entrada por 30 s. Sair com:
histograma dos deltas, **fração dentro da janela 8-17 ms**, e fração de deltas
**exatamente 0 ms** (relatórios aos pares). Anotar de passagem quantos bytes tem
cada relatório (esperado 49) e se são todos `0x30`.

**As réguas de comparação já existem, medidas por terceiro:** Pro genuíno 95%,
clone Datafrog 46-52%, 8BitDo Pro 2 entre 2,5% e 4%. **Onde o SN30 Pro cai é o
número que esta casa não tem.**

**O que decide, e é por isso que ele é o mais valioso do §4:** um número só
explica **de uma vez** o rumble fraco, o LED que falha e o enable-IMU que não
passa — porque os três atravessam o mesmo portão de cadência. Move
`movimento.giroscopio@sn30 / radio_evidencia` e `/ radio_offset` e
`movimento.acelerometro@sn30 / radio_report_id` para `medido` **no aparelho
certo**, que é a correção que a quarta régua teve de fazer em 31/08: os números
de taxa que a casa tem (89,2 relatórios/s, 267 SYN/s) são do Pro **genuíno**, e
foram emprestados para uma célula de SN30 numa das propostas.

---

### 17. A captura crua — byte 0 e os botões — **15 min**

**O que ligar.** SN30 em modo Switch por Bluetooth, com o pareamento novo do 14.
Confirmar a instância pelo `uevent` (OUI `E4:17:D8`, bus `0005`).

**O que olhar.** `sudo timeout 30 xxd -c 20 /dev/hidrawN`. Leitura **pura** — não
escreve nada e não disputa subcomando com o driver.

- **O byte 0 de cada linha** decide `entrada.stick@sn30 / radio_report_id`
  (escrito em 31/08 como `entrada 0x30`, por leitura de código): `30` fecha a
  célula como `medido`; `3f` significa que o aparelho ficou no modo simples e que
  por rádio **não há analógico chegando por este driver** — o que derrubaria o
  `parcial` da linha; nada saindo significa que o link morreu antes da captura.
- **Meia dúzia de apertos, +5 min**, fecham `entrada.botoes@sn30 / radio_offset`:
  A → byte 3 `0x08`; ZR → byte 3 `0x80`; − → byte 4 `0x01`; Home → byte 4 `0x10`;
  Captura → byte 4 `0x20`; D-pad Cima → byte 5 `0x02`; D-pad Esquerda → byte 5
  `0x08`; ZL → byte 5 `0x80`.

**A mordida:** mover SÓ o analógico esquerdo tem de mexer nos bytes 6-8 e deixar
3-5 e 9-11 parados. Se os bytes de botão mexerem junto, a planta está errada e a
célula cai inteira.

Em paralelo, `journalctl -b -k -f | grep -aE 'nintendo|joycon'`, para registrar
se a cascata de timeout aparece durante a janela. **Fechar o Steam não é
necessário** — a doc registra que a morte por rádio aconteceu sem Steam rodando.

**Atalho equivalente:** provar o GYRO por rádio fecha o `0x30` sozinho, porque o
parse de IMU só roda com `rep->id == JC_INPUT_IMU_DATA`. A prova de gyro que a
casa tem (11/08) foi feita **no cabo** e por isso não serve.

---

### 18. Ensaio B — o enable-IMU e a cascata — **20 min**

**O que ligar.** Pareamento novo em modo Switch, com o `hid_nintendo` **carregado**
e o dynamic debug do módulo ligado — é o que faz aparecer o `enabling IMU`.

**O que olhar.** `journalctl -kf` procurando a cascata (`timeout waiting for
input report` até `exceeded max attempts`); depois, se nasceu um nó evdev
terminado em `(IMU)`, rodar `evtest` nele girando o controle.

**O que decide.** `movimento.imu.ligar@sn30 / radio_offset`, e por tabela o
`radio_aciona` de toda a família de movimento deste controle.

**A armadilha que a própria linha já registra:** o nó é criado sob
`joycon_has_imu(tipo PRO)` **sem perguntar ao aparelho**. Nó presente com
`ABS_RX/RY/RZ` **parados** significa que o `0x40` não chegou, **não** que a IMU
não exista.

---

### 19. LED de jogador do SN30 — dose-resposta — **15 min**

**O que ligar.** SN30 no rádio, modo Switch, pareado, com o `hid-nintendo` desta
árvore carregado.

**O que olhar.** (1) 30 s — `ls /sys/class/leds/ | grep 'green:player'`. Se os
quatro nós NÃO existirem, a resposta já é o modo de falha do probe (confirmar com
`dmesg | grep -i 'Failed to set players LEDs'`), e a cura é
`register_leds_on_set_failure=1` — **o botão existe e nasce desligado**. (2) 5 min
— se existirem: `dmesg -w` num terminal e, no outro,
`time (echo 1 > …:green:player-1/brightness)` **com o olho dela na barra**.
Anotar três coisas: acendeu? saiu `timeout`/`exceeded max attempts`? quanto tempo
o `echo` bloqueou? **Repetir 10 vezes e contar quantas acenderam** — é a
dose-resposta que separa «falha ocasional» de «não funciona».

**A mordida:** repetir no CABO, 10 escritas. Se acender 10/10 no cabo e falhar no
rádio, a assimetria da linha sobe de leitura de código para **dose-resposta
medida**.

**Cuidado obrigatório:** cada escrita é UM subcomando, e foi bombardeio de
subcomando que matou o 8BitDo no rádio em 06-07/08. Dez escritas espaçadas à mão
é seguro; laço automático não é.

---

### 20. Rumble A/B com o `skip_tx_on_rate_exceeded` — **20 min**

**O que ligar.** SN30 pareado por rádio e nada mais em BT. Num terminal,
`sudo dmesg -w | grep -iE 'nintendo|exceeded max attempts'`.

**O que olhar.** (1) `fftest` no nó, segurando um efeito de rumble por 30 s: o
motor gira? quantas linhas `exceeded max attempts` saíram? (2) **O A/B ao vivo,
sem replug e sem reboot:** `echo 0 | sudo tee
/sys/module/hid_nintendo/parameters/skip_tx_on_rate_exceeded`, repetir, e voltar
para 1.

**O que decide.** `vibracao.rumble.ff@sn30 / radio_evidencia`, escrita em 31/08
com a hipótese e o mecanismo, e explicitamente **sem medição**. Se o rumble
aparece com 0 e some com 1, **o descarte É a causa** — e a decisão passa a ser
ligar ou não a cura do mainline no patch DKMS. (3) Medir a cadência com
`evemu-record` por 10 s fecha o número próprio do modelo dela.

**Repetir tudo no CABO:** por USB o portão é neutralizado por código, então o
cabo é o controle do experimento.

---

### 21. Frequência do rumble — o espectro, **no cabo** — **20 min**

**Tem de ser no CABO** — escrever `0x10` cru no hidraw por rádio é o gesto que
esta casa já mediu como letal para o link (§1, regra 2).

**O que ligar.** SN30 em modo Switch, plugado no USB, `hid_nintendo` carregado.

**O que olhar.** Escrever dois reports `0x10` crus com a MESMA amplitude e
frequências extremas — um com banda baixa em **41 Hz** e outro em **626 Hz**.
Amplitude no máximo em 50%. Segurar cada um por 5 s com o celular encostado no
punho, gravando com um app de espectro.

**O que decide.** `vibracao.rumble.frequencia@sn30 / radio_evidencia`, escrita em
31/08 como `afirmado-no-doc` a partir da página da fabricante (*«The SN30 Pro
features regular rumble vibration, not HD Rumble»*, *«eccentric shaft gear
motor»*). Se o pico do espectro **não** se mover entre 41 Hz e 626 Hz, o ERM está
confirmado e a célula sobe para `medido` — **com a vantagem de que a medição vale
para a unidade DELA, de 2018, que é justamente o que a página oficial não
cobre** (ela descreve a revisão atual, de sticks Hall Effect).

Se o pico **se mover**, a fabricante está errada sobre esta revisão e a linha
inteira precisa ser reaberta.

---

### 22. A sonda de fabricante `01 66 AA 00 21 01` — **15 min**

**Só depois do ensaio 14**, e com a expectativa de perder o link.

**O que ligar.** `modprobe -r hid_nintendo` (o `8bitdo-spec` avisa que o módulo
pode impedir a criação do hidraw). Sem o driver o controle vira um nó cru, e
voltar exige recarregar o módulo e provavelmente reconectar.

**O que olhar.** Escrever os 6 bytes da sonda e ler 64. Esperado:
`81 66 A5 <PID em big-endian> 22 <4 B de firmware LE>`. O PID esperado é `0x6001`
(SN30 Pro) — e o autor do spec só testou `0x6002` e `0x6003`, então **um silêncio
no `0x6001` já é achado**.

**Por que este caminho e não outro:** ele **não** é o subcomando da Nintendo e
portanto **não** passa pelo `joycon_enforce_subcmd_rate` do driver. É o jeito de
separar *«o firmware está mudo por rádio»* de *«o portão do driver não deixa
passar»* — a pergunta que decide se a cura é nossa ou é do aparelho.

**O controle negativo é obrigatório, e esta casa já pagou por esquecê-lo:**
escrever um pacote de tamanho ERRADO (dois bytes `01 66`) e confirmar que o
`write` **sai com sucesso mesmo assim** (§1, regra 3). Sem o negativo, o relatório
afirma o degrau sem tê-lo medido.

**NÃO mandar `01 66 AA 00 51 01`:** esse é o comando de TROCAR DE MODO, e faz o
controle reconectar noutro modo.

**O que decide.** `plataforma.escrita_crua@sn30 / radio_report_id`. E os três
desfechos são todos resposta: sonda responde → o `radio_report_id` ganha o
segundo enquadramento e `plataforma.distinguir_clone@sn30` ganha um discriminador
que não depende da OUI; silêncio nas duas escritas → «o firmware não responde à
sonda por rádio», que fecha a dívida pelo lado negativo; queda do link →
**confirma** a medição de que o gesto é letal por rádio, e *isso* é o achado.

---

### 23. Bateria — três ensaios, o último com 2 h passivas — **45 min + 2 h**

**(A) 5 min, PELO CABO, sem parear nada.** Com o SN30 em modo Switch ligado por
cabo, ler `capacity_level`, `status`, `present` e `scope` do
`nintendo_switch_controller_battery_*`. Se o `status` disser `Charging` mas
**nunca** `Full` mesmo com `capacity_level=Full`, o bit 0 (`host_powered`) está
lendo zero neste modelo — que é o que o SDL afirma do Pro 2 — e a `cabo_ressalva`
desta linha precisa de correção. **Controle no mesmo minuto:** o Pro genuíno pelo
cabo, que a canônica registra lendo `capacity_level=Full`, `status=Charging`.

**(B) 10 min, PELO CABO, para ver o byte cru.** Ler o hidraw em paralelo e
confirmar que `buf[0]` é `0x30` (e não `0x3F`) e que, em `buf[2]`, os bits 5-7
mudam com a carga e o **bit 0 fica FIXO**. É o único ensaio que separa *«o clone
não fala `0x30`»* de *«o clone fala e o bit mente»*.

**(C) 30 min + 2 h passivas, PELO RÁDIO.** Exige o pareamento do ensaio 14. Assim
que conectar, a primeira pergunta é binária: o nó
`nintendo_switch_controller_battery_*` **existe**? Se não existe, a probe morreu
no init e a linha inteira do rádio vira «não chega», sem meio-termo. Se existe,
repetir (A) e (B) por rádio e comparar palavra por palavra com o cabo. E deixar
**2 h passivas** com o `capacity_level` amostrado a cada minuto: se ele nunca se
mexer, é o congelamento que a `radio_detalhe` desta linha prevê (controle zumbi,
link de pé e sem relatório) — e aí **o instrumento é a AUSÊNCIA de mudança, não o
valor**.

**Armadilha de instrumento:** um amostrador que leia `capacity` (percentual)
grava AUSENTE a noite inteira — o arquivo não existe neste driver. É
`capacity_level`.

---

## §5 — O QUE ESTA LISTA NÃO RESOLVE

**Duas células que a quarta régua recusou em 31/08 e que nenhum ensaio daqui
toca**, porque a pergunta é de decisão, não de aparelho:

- `luz.lightbar.cor@dualsense / radio_report_id` e `luz.led_jogador@dualsense /
  radio_offset` dizem hoje `—` com `de_onde_sei = medido`. Na primeira, o `—`
  contradiz o `radio_comando` da própria linha, que desde a ROTA-BT-EM-REGIME-01
  (12/08/2026) nomeia o `0x31` avulso escrito pelo `_pintar_por_hidraw_bt`. As
  duas células não foram sobrescritas de propósito: **não se sobrescreve célula
  `medido` sem a medição na mão**, e quem tem a medição de 12/08 é quem a fez. O
  ensaio 3 desta lista resolve a segunda por discriminação; a primeira é
  conserto de registro, não de bancada.

E uma **regra de leitura** para quem for executar qualquer ensaio daqui: o mapa
distingue *de onde veio a informação* (`de_onde_sei`) de *até onde a prova
chegou* (`ate_onde_foi`), e **uma não implica a outra**. Um ensaio que produza
`medido` sem registrar o degrau deixa a célula na mesma casa em que já estão 63
outras. O caminho está no `docs/data/LEIA-PRIMEIRO.md`, §3.
