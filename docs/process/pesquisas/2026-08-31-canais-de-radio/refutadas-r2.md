# Rodada 2 — as 14 propostas que caíram, e por quê

*31/08/2026 · fonte: `bruto/journal-wf_be4d2607-8ce.jsonl` (75 refutações, 42 com
`refutada == true`) e `bruto/resultado-wzuxu703q.json`.*

**Isto é uma lista do que NÃO se deve propor de novo.** Entraram 25 células, 11
sobreviveram, 14 caíram. As 14 não foram escritas em lugar nenhum — sem este
documento, a próxima leva propõe as mesmas 14 e paga os mesmos agentes para
descobrir o mesmo.

**Quase nenhuma caiu por o dado estar errado.** Em 12 das 14 o NÚMERO sobreviveu
inteiro: o que caiu foi uma frase colada ao lado dele — quase sempre um absoluto
que o próprio arquivo citado desmente.

## Como esta rodada decidiu (reconstruído do journal, não estava escrito)

Cada célula passou por **três lentes** (endereço, transporte, aparelho) — 25 × 3 =
75 refutações. O corte foi **2 de 3**: as 14 células que caíram levaram **duas ou
três** reprovações; as 11 que ficaram levaram **no máximo uma**. Vale para as 25
sem uma exceção, e é o que permite casar cada refutação com a proposta que ela
ataca. **Uma lente sozinha nunca derrubou nada** — cinco propostas foram
reprovadas por uma lente e aplicadas mesmo assim, com a correção dela dentro.

## Contagem por padrão

Uma refutação costuma invocar mais de um padrão; a coluna conta invocações entre
as 42 que derrubaram.

| # | Padrão de erro | Refutações | Células derrubadas |
|---|---|---:|---:|
| 1 | **Prova por ausência com censo furado** — "não há um único ramo de `hdev->bus` em X" | 15 | 7 |
| 2 | **`arquivo:linha` que não confere** — o endereço DENTRO do valor aponta a linha errada | 12 | 7 |
| 3 | **Fonte externa lida ao contrário**, ou divergência escondida/fabricada | 9 | 5 |
| 4 | **Ponteiro pendurado** — "ver `radio_evidencia`" de uma célula vazia | 7 | 4 |
| 5 | **Grau contaminado** — leitura de código entrando sob `radio_de_onde_sei = medido` | 8 | 4 |
| 6 | **Prosa longa em coluna de identificador/offset** | 7 | 4 |
| 7 | **Valor do CABO apresentado como de RÁDIO** | 6 | 2 |
| 8 | **O que o DRIVER lê ≠ o que o APARELHO manda** | 7 | 5 |
| 9 | **Contradição ABERTA da casa convertida em fato** | 3 | 1 |
| 10 | **Unidade trocada** — amostra lida como relatório | 1 | 1 |
| 11 | **Não sequitur sobre o produto** — explica o perigo e chama de causa | 2 | 1 |

## As 14 células, e o que as derrubou

| id / coluna | caiu por |
|---|---|
| `entrada.botoes@sn30` / `radio_offset` | 1, 2, 8 |
| `energia.bateria.percentual@dualsense` / `radio_evidencia` | 1 |
| `plataforma.limitador_subcomando@pro` / `radio_report_id` | 1, 2, 5, 6 |
| `plataforma.taxa_relatorios@pro` / `radio_offset` | 1, 2, 10 |
| `luz.lightbar.cor@dualsense` / `radio_report_id` | 6, 5 |
| `audio.jack.volume@dualsense` / `radio_evidencia` | 3, 2 |
| `audio.alto_falante.preamp@dualsense` / `radio_evidencia` | 3, 2 |
| `movimento.acelerometro@sn30` / `radio_offset` | 1, 3, 8 |
| `movimento.giroscopio@sn30` / `radio_offset` | 1, 6, 8 |
| `movimento.giroscopio@sn30` / `radio_evidencia` | 1, 4, 8 |
| `movimento.imu.ligar@sn30` / `radio_offset` | 4, 2 |
| `plataforma.escrita_crua@sn30` / `radio_evidencia` | 3, 7, 11 |
| `plataforma.distinguir_clone@sn30` / `radio_report_id` | 6, 5, 7, 9, 3, 4 |
| `plataforma.distinguir_clone@sn30` / `radio_offset` | 8, 4, 5, 2 |

---

## 1. Prova por ausência com censo furado (7 células)

**A lição, e ela é a mais transferível deste documento:** *toda célula de rádio
que se sustenta na frase "não há um único ramo de `hdev->bus` no caminho de X"
está errada nos dois drivers desta árvore, e o contra-exemplo está a uma chamada
de distância do endereço oferecido como prova.*

- **`hid-nintendo.c:2022`** — `if (ctlr->hdev->bus == BUS_USB) ctlr->consecutive_valid_report_deltas = JC_SUBCMD_VALID_DELTA_REQ;`
  está DENTRO de `joycon_parse_report` (`:1948-2042`), que é o que
  `joycon_ctlr_read_handler` (`:2997`) chama, dezoito linhas antes do despacho da
  IMU em `:2040`. **Sete propostas escreveram "não há" listando `:2022` no próprio
  censo.**
- **`hid-playstation.c:1647`** — `if (hdev->bus == BUS_USB)` está DENTRO de
  `dualsense_parse_report` (`:1562-1761`), **depois** da escolha da base (`:1592`)
  e **antes** do bloco de bateria (`:1724`). Prende a leitura de HP/MIC ao cabo.

Nenhum dos dois desloca byte, então as **conclusões de offset sobreviveram** — o
que não sobrevive é o absoluto escrito na célula, que é o que a próxima pessoa
lê e repassa.

**O caso que ninguém tinha visto, e é o mais caro:** o censo por `grep` pega o
token FOLHA e não vê o teste de barramento que chega pelo **invólucro**.
`joycon_may_degrade` é `usb_probe_degrade && joycon_using_usb(ctlr)`
(`hid-nintendo.c:2745-2752`) e é chamado em `:2899`, **`:2939`**, **`:2953`** e
`:2974` — quatro linhas que nenhum censo da leva listou. Duas delas estão dentro
do caminho do acelerômetro: se `joycon_enable_imu` falha (`:2937-2941`) ou se
`joycon_set_report_mode` falha (`:2951-2955` — o modo `0x30`, que é o relatório
em que o acelerômetro VIAJA), por rádio o ramo é o duro: `goto out_unlock`, a
probe morre. Pelo cabo o driver segue "continuing without motion". A prova por
ausência deu verde exatamente sobre a assimetria que a coluna existe para
registrar. *A régua mediu a PALAVRA (`joycon_using_usb`) e não o ATO.*

Células: `entrada.botoes@sn30`/`radio_offset` · `energia.bateria.percentual@dualsense`/`radio_evidencia` ·
`movimento.acelerometro@sn30`/`radio_offset` · `movimento.giroscopio@sn30`/`radio_offset` e `/radio_evidencia` ·
`plataforma.limitador_subcomando@pro` · `plataforma.taxa_relatorios@pro`.

**Variante da mesma família — negativa universal tirada de uma janela estreita.**
`plataforma.taxa_relatorios@pro`/`radio_offset` afirmou "o protocolo Switch não
carrega a taxa em byte nenhum" e o método confessou: *"varri os subcomandos
declarados no driver (linhas 126-150)"*. Varrer 25 linhas de `#define` não é
varrer o driver. O que ficou de fora é **exclusivo do rádio**:
`JC_INPUT_REPORT_MIN_DELTA 8` / `MAX_DELTA 17` (`:973-974`), usadas em
`:2009-2010`, sob o comentário do próprio kernel em `:2016-2022` — *"is only
relevant for bluetooth-connected controllers"*. E os 11,2 ms medidos nesta
bancada caem dentro dessa janela: era a corroboração entre a medição da casa e o
fonte, e ela pertencia àquela célula.

## 2. `arquivo:linha` que não confere (7 células)

Numa casa onde "sem `arquivo:linha` o grau cai para `afirmado-no-doc`", **um
endereço errado dentro da célula é pior que nenhum** — ele é lido como já
conferido.

| escrito | o que está lá de verdade |
|---|---|
| `hid-nintendo.c:2996` = o cast `(struct joycon_input_report *)data` | `:2996` é `if (size >= 12)`; o cast está em `:2998` |
| `:603-618` = o `struct joycon_input_report` | fecha em `:617`; `618` é linha em branco |
| `:120-122` = "os defines dos IDs de saída 0x01/0x10/0x80" | `JC_OUTPUT_USB_CMD 0x80` está em `:124`, fora da faixa |
| `:1651` = "pro controller (bluetooth): every 8 ms" | `:1651` é *(USB): every 15 ms*; o 8 ms está em `:1652` |
| `evdev_reader.py:2216`/`:2251` = "os laços, que só percorrem ABS_RX/RY/RZ" | `:2217` e `:2259` percorrem ABS_X/Y/Z — a classe lê os SEIS eixos desde a ONDA-CONTROLES-04 (29/08) |
| Senshi `DualSenseBtReportBuilder.kt:42` = "escreve no MESMO byte do pré-amp" | `:42` é `FEATURE_REDUCE_INDEX = PAYLOAD_OFFSET + 36` — o byte VIZINHO |
| "o único caso que toca o fone" (`test_paridade_transporte_audio.py:75-93`) | são DOIS: `:95-106` também prende `common[4]` |

**O pior deles, porque é herdado e ninguém o tinha visto:**
`scripts/bt_active_mode.sh:70-130`, citado como "a alavanca de link", **não contém
sniff nenhum** — ali moram o logger, a checagem de root e `_adaptadores()`. A
alavanca real (LINK POLICY sem SNIFF, `hciconfig <hci> lp rswitch,hold,sniff,park`)
está em ~404-440. O endereço foi copiado da **linha 255 do próprio CSV**
(`plataforma.sniff@pro`), que carrega o mesmo erro; e a linha 256 (`@sn30`) cita
`bt_active_mode.sh:75-134` para a mesma coisa. **Duas faixas divergentes no CSV, e
nenhuma acerta.** Isso é dívida do mapa, não da proposta — e vai reaparecer em
toda leva que copiar de linha vizinha.

Mesmo defeito, menor: `assets/82-nintendo-pro-nosniff.rules:1-24` é só o cabeçalho
em prosa; a regra está em `81-97`. E `ISOLAR-...:160` é a linha da BATERIA — a do
`:blue:player-5` é `:159`.

## 3. Fonte externa lida ao contrário, ou divergência escondida (5 células)

**A lição:** *quando duas fontes externas foram baixadas e lidas, a que CONFIRMA
e a que DIVERGE trocaram de lugar em três refutações independentes.* Antes de
escrever "todas as fontes concordam", conte quantas foram abertas no arquivo, não
no `const`.

- **O Senshi virou disputa e era a confirmação mais forte da leva.** Três
  propostas de áudio escreveram que `TechAntohere/Senshi` escreve o pré-amp em
  outro byte, apoiadas no `PAYLOAD_OFFSET = 2` (`:26`) e na `:42`. O builder de
  áudio do MESMO arquivo (`:623-651`, `:653-673`) faz
  `report[0]=0x31; report[1]=seq_tag; report[2]=0x10; val output = 3; report[output+37] = audioControl2`
  — **report[40], idêntico ao nosso**, com flag0 `0xA0` e flag1 `0x80`, os mesmos
  bits. O `PAYLOAD_OFFSET` serve a outra família de reports. *Ler um `const` não é
  ler a função.*
- **O `dualsense-ts` diverge e foi citado como unanimidade.** Ele monta o `0x31`
  com `btReport[1]=0x02`, **sem o tag `0x10`**, e copia com
  `for (i=3;i<48;i++) btReport[i+1]=usbReport[i]` (`dualsense_hid.ts:344-391`) —
  cada campo cai **um byte antes**: o volume do fone em `report[6]`, não em
  `report[7]`. E os índices dele são de REPORT, não de `common`: o
  `setSpeakerPreamp(index: 37)` cai em `common[36]`. A célula anunciou "o offset
  todas concordam" apoiada justamente na fonte que discorda.
- **A pydualsense 0.7.5 foi listada como "fonte que escreve o pré-amp".** Não
  escreve: `grep preamp|audio_control2` no `pydualsense.py` devolve zero. O `+1`
  dela existe (é o BTREPORT-02) e é outra coisa.
- **Divergência FABRICADA — 48 × 63 × 64 bytes.** Três refutações independentes
  desmontaram a mesma "dívida aberta": **48 B** é o corpo dos reports `0x01`/`0x10`
  no descritor de 170 B do **Pro genuíno** (`externos-referencia-canonica.md:284-296`,
  que remata "49 bytes no fio"); **63 B** é o Report Count do report **`0x80`** lido
  do **clone** por USB (`driver-hid-nintendo-por-dentro.md:556-565`); **64** é o
  endpoint / `JC_USB_CMD_REPORT_SIZE` (`hid-nintendo.c:183`). Não são
  comparáveis: aparelhos diferentes E reports diferentes. E a canônica já fecha:
  *"A única diferença de conteúdo entre os barramentos é o report `0x80`, que só
  existe no cabo"* (`:314-315`). **Plantar divergência onde há duas medições
  coerentes custa à próxima pessoa o tempo de investigá-la.**
- **O dekuNukem não é segunda régua.** Citado sem `arquivo:linha`, sem cópia local,
  e esta casa já o grada: `driver-hid-nintendo-por-dentro.md:26` o marca COMUNIDADE,
  *"já foi refutada nesta casa em pelo menos um número"*.

## 4. Ponteiro pendurado (4 células)

Quatro propostas fecharam com "ver `radio_evidencia`" — e a célula apontada está
**vazia no CSV de hoje**. Em duas delas a afirmação delegada era demonstrável e a
linha estava na mão: `JC_SUBCMD_RATE_LIMITER_USB_MS` 20 ms contra `_BT_MS` 60 ms,
`hid-nintendo.c:978-980`.

**Regra:** *não delegar para célula que outra proposta da mesma leva talvez
preencha. Isso é aposta, e a célula afirma como fato.*

Variante próxima, e ela caduca sozinha: metade do valor de
`movimento.imu.ligar@sn30`/`radio_offset` narrava **por que o `cabo_offset` está
vazio**. Pela própria evidência da proposta os mesmos bytes valem no cabo — logo,
no instante em que alguém preencher `cabo_offset`, a célula do rádio vira falsa.

## 5. Grau contaminado (4 células)

`radio_de_onde_sei` é **uma etiqueta por linha**, não por célula. Quatro propostas
emitiram `grau: inferido-do-codigo` e mandaram "não mexer" numa linha que diz
`medido` — resultado: leitura de fonte (e, em dois casos, *hearsay* sem
`arquivo:linha`) morando sob carimbo de bancada. **É o defeito D-14, de 15/08, que
já está gravado no próprio CSV**, na `cabo_ressalva` de
`plataforma.distinguir_clone@pro`: *"esta célula dizia `medido`… a evidência
descreve LEITURA DE FONTE (arquivo, linha, grep), não medição"*.

O inverso também apareceu: `luz.lightbar.cor@dualsense` tem `radio_de_onde_sei = medido`
(bancada dela, 12/08, *"todos tão magenta"*) — e a proposta emitia
`inferido-do-codigo` no campo estruturado, o que **rebaixaria uma medição dela**.

## 6. Prosa longa em coluna de identificador/offset (4 células)

Medido no CSV, não estimado: em `radio_report_id`/`cabo_report_id` a **mediana é
12 caracteres**, 205 das 308 células estão vazias, e a maior que existe tem
**566** (`identidade.leitura_de_feature@dualsense`, e é uma ENUMERAÇÃO de ids, não
narrativa). Chegaram propostas de **810** e **939** caracteres — a segunda com ~90%
de prosa de ROTA, que é matéria de `radio_comando`, e que o `radio_comando` da
MESMA linha já dizia quase palavra por palavra.

A coluna é renderizada como `${campo('Report', ...)}` em `scripts/gerar-mapa.py:710`
e entra na busca de `bancada.py:252`. **Duas cópias da mesma frase na mesma linha
divergem na próxima correção** — é o defeito que "na dúvida entre repetir e
referenciar, referencie" existe para matar.

O caso mais irônico: a proposta invocou `luz.lightbar.aviso_de_modo@dualsense` e
`luz.lightbar.brilho@dualsense` como precedente — e essas duas trazem
`0x31 (avulso)` (13 caracteres) e `0x31` (4). *Citou o precedente e ignorou o que
ele faz.*

## 7. Valor do CABO apresentado como de RÁDIO (2 células, e 2 quase)

- **`plataforma.escrita_crua@sn30`/`radio_evidencia`** pôs os 63 B do report `0x80`
  — **família exclusiva do cabo** — dentro de uma célula de rádio, como divergência
  aberta.
- **`plataforma.distinguir_clone@sn30`/`radio_report_id`** escreveu na coluna de
  rádio um comando (`01 66 AA 00 21 01`, TheJayMann/8bitdo-spec) cuja fonte **não
  declara transporte** e cujo hardware é **outro** (SN30 Pro+ e Pro 2, não o SN30
  Pro liso). A proposta declarou as duas coisas e escreveu assim mesmo.
- **Quase caiu — `luz.led_home@pro`.** A proposta colou *"348 recusas e 83 falhas
  `-110` sobre 18 escritas — 19,3 recusas por escrita"* no link de rádio de 22h32m.
  A sprint desmente em quatro lugares: `:97` diz que a janela dos contadores é
  06/08 00h00 -> 07/08 15:27:48 (19h04m); `:711` diz que o link começa em 06/08
  22:21:11; `:281-287` lista as 18 escritas e **seis são anteriores ao link**, sob
  uma instância que o documento nunca nomeia; e `:100-101` já separa por dia. **O
  número está certo no documento de origem e vira falso ao mudar de coluna.**
  Sobreviveu com o texto corrigido: 202 recusas e 49 `-110` em 07/08, o único dia
  que cai inteiro dentro do link.
- **Quase caiu — `plataforma.distinguir_clone@sn30`/`radio_evidencia`.** Todo o
  negativo apresentado como contribuição (nós de IMU, `:blue:player-5`, identidade
  não sintetizada) vem da seção **"### 5.1 Pelo CABO"** da canônica (`:856-886`),
  cuja abertura fixa a regra: *"cada afirmação abaixo declara em que transporte foi
  feita, e nenhuma atravessa de um para o outro"* (`:855-857`).

## 8. O que o DRIVER lê ≠ o que o APARELHO manda (5 células)

**A lição:** *ler o layout no `hid-nintendo` prova o que o driver LÊ supondo um Pro
Controller. Não prova que o clone EMITA aquilo — e para o SN30 por rádio em modo
Switch a casa tem medição EM CONTRÁRIO.*

- O nó de IMU nasce sob `joycon_has_imu` (`:839-843`), que só pergunta
  `ctlr_type == PRO` — e o clone se declara PRO. `cabo_ressalva` da própria linha
  já diz: *"a existência do nó NÃO prova o sensor"*.
- `troubleshooting-8bitdo.md:232-262` registra **PROVADO em 16/07, por Bluetooth e
  em modo Switch**, que o input MORRE com o link de pé — e *"por cabo, no mesmo
  modo, não há um único timeout"* (`:248`).
- `externos-firmware-e-modos.md:553`: *"nada sobre IMU/giroscópio no SN30 Pro ou no
  Pro+"*.
- O discriminador proposto usa a rota que **este aparelho não completa**: sem
  resposta ao `REQ_DEV_INFO` não há reply `0x21` de onde ler os bytes 17 e 19-24, e
  o MAC que chega ao userspace passa a ser **sintetizado**
  (`joycon_synthesize_info`, `:2755-2837`; `02:<vid>:<pid>:<bus>` em `:2812-2817`),
  cuja OUI não é a `e4:17:d8`.
- E o byte de tipo **não é discriminador**: o próprio driver diz para que serve
  (desambiguar PID — o NSO Genesis que mente por Bluetooth, o charging grip),
  `:2729-2737` e `:2765-2773`. Um clone que se apresenta como Pro devolve
  `JOYCON_CTLR_TYPE_PRO` igual ao genuíno. **Pôr um NÃO-discriminador dentro da
  célula chamada `plataforma.distinguir_clone` é a forma exata de afirmação
  plausível e falsa que esta casa já pagou.**

**Sub-padrão que vale sozinho — fato de CONFIGURAÇÃO vendido como fato de
transporte.** `movimento.imu.ligar@sn30` escreveu que por rádio a falha do `0x40`
mata a probe *"em vez de degradar"*. `usb_probe_degrade` é `static bool` sem
inicializador (`hid-nintendo.c:109`) e a `MODULE_PARM_DESC` (`:111-112`) diz
*"default N = fail probe, same as before"*: **no módulo vanilla a probe morre nos
dois barramentos**. A assimetria existe porque **esta casa** liga o parâmetro em
`assets/modprobe.d/hefesto-hid-nintendo.conf:81` — e `usb_probe_degrade` /
`joycon_may_degrade` **não existem no `hid-nintendo` de fábrica**. Toda afirmação
de assimetria cabo/rádio nessas linhas depende de qual dos dois drivers se está
descrevendo.

## 9. Contradição ABERTA da casa convertida em fato (1 célula)

Três contradições vivas foram resolvidas em silêncio por propostas, em vez de
relatadas:

1. **O byte de tipo do `REQ_DEV_INFO`.** O SDL declara
   `k_eSwitchDeviceInfoControllerType_LicProController = 6` ao lado de
   `ProController = 3` (`SDL_hidapi_nintendo.h:31`) e recusa o LED HOME nesse tipo;
   o `hid-nintendo` **não conhece 0x06** — o enum salta de `0x03` para `0x09`
   (`:392-401`). As duas fontes divergem **exatamente sobre a pergunta da célula**.
2. **O grau da OUI.** A canônica escreve, na linha que É o assunto:
   *"o único discriminador é a OUI — `e0:f6:b5` genuíno, `e4:17:d8` clone | rádio |
   **ALTA** (três lugares independentes da árvore concordam)"* (`:939`) — e reserva
   a palavra MEDIDO para as duas linhas vizinhas (`:937`, `:938`). A proposta abriu
   com "A OUI: MEDIDO em 25/07". É promoção de grau sobre a fonte que ela aponta.
3. **O clone por rádio em modo Switch.** `troubleshooting-8bitdo.md:132-138` diz
   *"endereços Bluetooth diferentes em cada modo (medido nesta bancada)"*; a
   canônica (`:915-920`, `:968-971`, `:1228-1230`) diz que **não havia bond do
   8BitDo em modo Switch** e que ele nunca esteve na bancada por rádio nesse modo.
   As duas não podem ser verdadeiras juntas — e a proposta escolheu um lado.

Também aqui: `movimento.giroscopio@dualsense`/`radio_report_id` alegou que `—` é a
**convenção assentada** da coluna para linhas `evdev`. Não é: a MESMA feature em
outros dois controles (`@pro` e `@sn30`, também `radio_canal = evdev`) traz
`radio_report_id = "entrada 0x30"`. A coluna está dividida — 3 com `—`, essas duas
com o id.

## 10. Unidade trocada — amostra ≠ relatório (1 célula)

`plataforma.taxa_relatorios@pro` escreveu "300 amostras". São **300 RELATÓRIOS**:
`imu_delta_samples_count` sobe uma vez por relatório de IMU
(`hid-nintendo.c:1692-1693`) e **cada relatório carrega TRÊS amostras** (`:1646`
*"Each imu input report contains 3 IMU samples"*, `:1729-1730`). O erro é de 3× no
tempo em que o default de 15 ms reina (~3,3 s num link de 11 ms, não ~1,1 s).

**E esta casa já pagou por este erro exato**: a `radio_ressalva` da própria linha o
corrige em letra de forma (os "~268 pacotes por segundo" eram 89,2 × 3), e a irmã
`plataforma.taxa_relatorios@sn30` o repete em maiúsculas — *"AMOSTRA NÃO É
RELATÓRIO, e confundir os dois já produziu número errado nesta casa"*. O
`raciocinio` da proposta escrevia certo; **a célula, que é o que fica, escrevia
errado.**

## 11. Não sequitur sobre o produto (1 célula)

`plataforma.escrita_crua@sn30` afirmou: *"É POR ISSO que `radio_aciona = não`
continua honesto — um `write()` cru não passa por `joycon_enforce_subcmd_rate`"*.
Isso explica por que **seria perigoso** acionar, não por que o produto **não**
aciona. Duas provas contra: na linha real (`mapa-controles.csv:219`)
`cabo_aciona = não` E `radio_aciona = não` são **idênticos** — se a causa fosse do
rádio, o cabo leria `sim`. E a razão real é in-tree e citável: o único caminho de
escrita crua em hidraw que o produto tem é o `enable_imu`
(`core/external_leds.py:170`, pacote em `:155`), e o chamador o tranca **duas
vezes** — `e_pro_genuino(...)` exclui o clone pela OUI
(`daemon/subsystems/external_identity.py:923`) e
`bus != _IMU_ENABLE_ALLOWED_BUS` bloqueia o BT (`:931`, com
`_IMU_ENABLE_ALLOWED_BUS = "usb"` em `:218`). **Não é o rádio que não deixa: é o
produto que não vai, por porteiro explícito.**

---

## As que sobreviveram raspando — uma lente reprovou e a célula entrou

Cinco células levaram uma reprovação e foram aplicadas com a correção dentro.
Vale ler o que a lente achou, porque o achado ficou fora do relatório.

| célula | o que a lente pegou |
|---|---|
| `toque.touchpad.clique@dualsense` | O **par de endereços do `dualsense-ts` estava invertido**: `hid_provider.ts:315-372` é o BT (byte 11) e `:378-439` é o USB (byte 10) — a proposta escreveu o contrário. O número (`report[11] & 0x02`) resistiu a três fontes. |
| `luz.led_home@pro` | Os 348/83 eram da janela inteira, não do link de rádio (padrão 7). Sobreviveu com 202/49, o dia que cai dentro do link. |
| `movimento.acelerometro@sn30`/`radio_evidencia` | O censo bate exato, mas "fora do caminho da IMU" é meia verdade: o limitador (`:980`) governa o subcomando que **LIGA** a IMU — é a mesma maquinaria cujo colapso (`joycon_enforce_subcmd_rate: exceeded max attempts`) esta bancada mediu neste clone. |
| `movimento.imu.ligar@sn30`/`radio_evidencia` | `usb_probe_degrade` nasce N — a assimetria é do DKMS desta casa, não do driver (ver padrão 8). Caiu de "três diferenças" para duas. |
| `plataforma.distinguir_clone@sn30`/`radio_evidencia` | Ver padrão 7 e 9. |

**E três correções de vizinhança que as lentes acharam sem que ninguém pedisse —
elas valem mais que qualquer célula nova, porque são fato errado VIVO no CSV:**

1. `luz.led_microfone@dualsense`/`cabo_evidencia` **diz o oposto do código de
   hoje**: *"flag1 nasce com 0x01 ligado e NÃO é limpo em ramo nenhum; `common[8]`
   é escrito SEM `if`"* — hoje `backend_pydualsense.py:1193-1194` limpa e
   `:1227-1228` tem o `if`. O AUDIO-OWNER-01 (12/08) inverteu os dois. E a
   `cabo_ressalva` da mesma linha diz "LED-SEM-DONO-01 ABERTA" com a sprint
   marcada CONCLUIDA desde 21/08.
2. `movimento.giroscopio.jogo@dualsense`/`radio_ressalva` diz *"FURO ABERTO:
   `_struct_base` NÃO testa o bit1 de `report[1]`"* — hoje testa
   (`core/physical_report_reader.py:401`).
3. `movimento.acelerometro@pro`/`cabo_codigo_ref` aponta `:2380-2392`, que é o
   bloco do **giroscópio**; o do acelerômetro é `:2362-2373`.

## Duas armadilhas de instrumento, para quem repetir a leva

- **Um `arquivo:linha` de fonte externa só vale com a TAG colada nele.** Uma lente
  quase refutou uma célula porque havia **duas cópias do `SDL_hidapi_switch.c`** no
  scratchpad: no `main` o `HasHomeLED` está em `:1319`; na tag `release-3.4.14`,
  em `:1277`. A proposta declarava a tag, e por isso o endereço estava certo.
  **Quem gravar não pode largar a tag do texto.**
- **A IDENT-01 renumera o último octeto ao anonimizar** (imprime 01/02/03/04/05,
  um por linha), enquanto o resto da árvore usa a máscara da casa. O endereço que
  ela imprime para o modo Switch **não bate literalmente** com o da canônica
  (`:872`) — é a mesma medição sob máscaras diferentes, não duas medições. Sem esse
  aviso, quem seguir os dois ponteiros conclui divergência onde não há.

## O que sobrou como pergunta de bancada

Das 14, **só 3 caíram por o aparelho/protocolo não ter o campo** — vazio é a
resposta certa e não há ensaio a pedir:

- `plataforma.taxa_relatorios@pro`/`radio_offset` — o protocolo Switch não pede
  taxa em byte nenhum; o `0x03` escolhe MODO (`0x30`, `:1543-1554`) e a taxa é
  **aprendida** (`imu_avg_delta_ms`, `:1678-1700`).
- `plataforma.limitador_subcomando@pro`/`radio_report_id` — limitador não é report.
  A linha irmã `@dualsense` deixa as duas colunas em branco de propósito.
- `plataforma.distinguir_clone@sn30`/`radio_report_id` e `/radio_offset` — não há
  report por rádio; o discriminador é a OUI por `sysfs`, e a forma certa
  (`key[:6] == "e417d8"`) já está na linha irmã `@pro` com a OUI do outro lado.

**Uma caiu porque nem a fonte externa fecha**, e é a mais cara:
`plataforma.escrita_crua@sn30`/`radio_evidencia` — o ponteiro da medição "letal"
não existe, a **EXT-04 não sobreviveu como documento**, e a casa já a gradou como
"relato com mecanismo" (`A-LUZ-QUE-CUROU-01:883`). Sem repetir o gesto com o link
vigiado, a célula fica vazia para sempre.

**As outras dez caíram com a fonte sabendo a resposta.** Elas voltam à mesa assim
que o texto for reescrito sem o absoluto — o dado está nas `correcao` de cada
refutação, no journal.
