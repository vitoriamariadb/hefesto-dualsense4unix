# OS-EXTERNOS-NO-MAPA-PRO — as 38 células mudas do Nintendo Pro, levantadas na fonte

- **Quando:** 06/09/2026
- **Árvore:** `hefesto-voo/OS-EXTERNOS-NO-MAPA-PRO-01-opus`, branch
  `voo/OS-EXTERNOS-NO-MAPA-PRO-01-opus`, nascida de `ae1c3d82`
- **Aparelho na mesa:** NENHUM. Todo veredito aqui é leitura de fonte, e o teto
  de prova respeitado é `inferido-do-codigo` com a escada VAZIA. Nenhuma célula
  subiu para `medido`, nenhum grau de aparelho foi inventado.

---

## O que mudou

**As 38 células `nao-medido` do Pro viraram 37 respostas e UM `nao-medido` que
fica** — em 22 linhas de `docs/data/mapa-controles.csv`, coluna
`cabo_por_que_nao_aciona` / `radio_por_que_nao_aciona`.

| resposta | células | o que ela diz |
| --- | ---: | --- |
| `nada-a-acionar` | 19 | o DRIVER já faz, ou não há verbo no canal, ou a linha é de medição |
| `decisao-tomada` | 12 | não acionar é a escolha, e ela está certa hoje |
| `so-ela-decide` | 4 | a pergunta existe, ninguém a respondeu, a resposta é dela |
| `divida` | 2 | falta fazer, e é a MESMA falta já confessada nas linhas filhas |
| `nao-medido` | 1 | fica, e por escolha — ver abaixo |

**A tabela, linha a linha:**

| linha (`@pro`) | cabo | rádio |
| --- | --- | --- |
| `energia.bateria.degraus` | *(já era `decisao-tomada`)* | `decisao-tomada` |
| `energia.bateria.leitura_hefesto` | `decisao-tomada` | `decisao-tomada` |
| `energia.desligar` | `so-ela-decide` | `so-ela-decide` |
| `entrada.stick.calibracao` | `nada-a-acionar` | `nada-a-acionar` |
| `identidade.firmware` | `decisao-tomada` | `decisao-tomada` |
| `identidade.pareamento` | `so-ela-decide` | `so-ela-decide` |
| `identidade.req_dev_info` | `nada-a-acionar` | `nada-a-acionar` |
| `luz.led_jogador.escrita_hefesto` | `decisao-tomada` | `decisao-tomada` |
| `luz.led_jogador.pisca` | `decisao-tomada` | `decisao-tomada` |
| `movimento.acelerometro` | `decisao-tomada` | `decisao-tomada` |
| `movimento.imu.calibracao` | `nada-a-acionar` | `nada-a-acionar` |
| `movimento.imu.ligar` | *(já era `parcial`, sem causa)* | `decisao-tomada` |
| `movimento.imu.perda` | **`nao-medido`, e FICA** | *(já era `divida`)* |
| `plataforma.handshake_usb` | `nada-a-acionar` | `nada-a-acionar` |
| `plataforma.limitador_subcomando` | `nada-a-acionar` | *(já era `nada-a-acionar`)* |
| `plataforma.modo_relatorio` | `nada-a-acionar` | `nada-a-acionar` |
| `plataforma.nfc` | `decisao-tomada` | `decisao-tomada` |
| `plataforma.sniff` | `nada-a-acionar` | *(já era `sim`)* |
| `plataforma.taxa_relatorios` | `nada-a-acionar` | *(já era `nada-a-acionar`)* |
| `vibracao.rumble.ff` | `divida` | `divida` |
| `vibracao.rumble.frequencia` | `nada-a-acionar` | `nada-a-acionar` |
| `vibracao.rumble.habilitar` | `nada-a-acionar` | `nada-a-acionar` |

Cada célula ganhou, na `*_ressalva` do próprio lado, um bloco datado que diz
**por que aquela palavra e não outra**, com `arquivo:linha` que abre. Cinco
linhas que estavam sem procedência de terceiro ganharam `fonte_externa`
apontando a cópia DKMS versionada do `hid-nintendo`.

### O achado que atravessa tudo: **quem já faz é o DRIVER, e ele não olha o barramento**

As 19 `nada-a-acionar` têm quase todas a mesma forma, e é a forma que faltava
estar escrita no mapa: `joycon_init` (`assets/dkms/hid-nintendo/hid-nintendo.c`)
manda `REQ_DEV_INFO`, calibração de stick, calibração de IMU, `ENABLE_IMU`,
`SET_REPORT_MODE` e `ENABLE_VIBRATION` **em todo barramento**, cada um sob
porteiro de **TIPO** (`joycon_has_imu()`, `joycon_has_joysticks()`,
`joycon_has_rumble()`) e **nunca** de `hdev->bus`:

```
:2897  joycon_read_info            REQ_DEV_INFO 0x02
:2915  joycon_request_calibration  SPI_FLASH_READ 0x10 (sticks)
:2927  joycon_request_imu_calibration  SPI_FLASH_READ 0x10 (IMU)
:2937  joycon_enable_imu           0x40
:2951  joycon_set_report_mode      0x03 → 0x30
:2972  joycon_enable_rumble        0x48
```

O único bloco que ramifica por barramento é o handshake USB (`:2849`-`:2875`,
sob `joycon_using_usb()`), e ele é por definição só do cabo. **Consequência para
o mapa: seis linhas do Pro em que o produto não aciona nada não são buraco —
são redundância evitada, e mandar o mesmo subcomando por `hidraw` seria disputar
o barramento com o driver vivo por um resultado já aplicado.**

### As quatro `so-ela-decide`, e por que não são dívida

`energia.desligar@pro` e `identidade.pareamento@pro`. Nos dois casos o mecanismo
está identificado com `arquivo:linha` (`0x06` em `:133`; `0x01`/`0x07`/`0x08` em
`:128`, `:134`, `:135`) e nenhum dos sete `subcmd_id = JC_SUBCMD` do driver os
usa — então **construir é possível e ninguém pediu**. E os dois atos são
destrutivos no aparelho dela: um apaga o controle na mão de quem joga; o outro
reescreve, no firmware, a informação de pareamento da próxima sessão — o Pro
pode passar a esquecer o Switch. Autorizar isso é decisão dela, não dívida
nossa. O `radio_detalhe` de `energia.desligar@pro` já dizia exatamente isso
(*"se ela algum dia pedir 'desligar o controle pelo aplicativo', é por aqui"*);
esta leva só pôs a palavra na coluna que o portão lê.

### As doze `decisao-tomada` estão todas ancoradas em decisão ESCRITA

Nenhuma foi inventada. As âncoras:

- `luz.led_jogador.escrita_hefesto` e `.pisca` — `EXTERNAL_PLAYER_LED_ENABLED =
  False`, `daemon/subsystems/external_identity.py:199`, atribuída a ela em
  07/08/2026 no bloco de `:161` (*"calar a luz até a entrega existir"*);
- `movimento.acelerometro` — a decisão da mantenedora de 19/07/2026, registrada
  em `docs/process/sprints/2026-08-15-ESPELHO-QUE-NAO-NASCEU-01-…md:183-190`:
  8BitDo e Nintendo passam direto ao jogo com o gyro NATIVO, sem espelho;
- `movimento.imu.ligar` (rádio) — a `assimetria_declarada` da própria linha
  (*"assimetria REAL e deliberada, do produto"*), com o porteiro nosso em
  `external_identity.py:247`;
- `energia.bateria.*` — `externos-referencia-canonica.md:1135`, *"é bom que não
  leia: leria AUSENTE no Pro e 100% mentiroso no 8BitDo"*;
- `plataforma.nfc` — a `cabo_ressalva` da própria linha, que já era a decisão
  escrita (*"registrado para ninguém 'descobrir' isso como oportunidade"*);
- `identidade.firmware` — o Hefesto não atualiza firmware de controle nenhum,
  nem do DualSense, e a versão que chega é jogada fora pelo driver (`:2714-2715`
  e `:2738` copiam endereço e tipo e nunca os offsets 0 e 1).

### O teto da dívida subiu de 23 para 25, e a confissão está escrita

`vibracao.rumble.ff@pro`, os dois lados. **Não é dívida nova.** As quatro
células de `vibracao.rumble.direito@pro` e `.esquerdo@pro` já diziam `divida`
desde 03/09 pela mesma razão — *"o Hefesto simplesmente não tem escritor de
force feedback para controle externo"* — e as duas filhas **declaram, no próprio
`detalhe`, que não repetem o levantamento e apontam para `vibracao.rumble.ff`**.
A linha DONA do levantamento é que estava muda. Ficar em `nao-medido` diria
*"ninguém olhou"*, e olharam.

O teto foi subido em `tests/unit/test_o_mapa_separa_divida_de_decisao.py` com o
bloco datado que o próprio arquivo exige, e **ele deixa a alavanca de descida
escrita**: um escritor de force feedback para externo fecha as SEIS células e
leva o teto a 19; colapsar as filhas na mãe leva a 21 sem uma linha de produto.

### A distinção que essa dívida obrigou a fazer, e ela é fina

`vibracao.rumble.frequencia@pro` **não** entrou como dívida, e a diferença é
real: o canal declarado da célula é `evdev`, e o `evdev` não tem verbo de
frequência — `input_ff_create_memless` expõe `FF_RUMBLE`, que carrega magnitude
e só. As frequências ficam presas nos defaults do driver (160/320 Hz) **para
todo mundo, inclusive para o jogo**. Na `ff` o caminho existe e o produto não o
usa (dívida); na `frequencia` não há caminho a usar por este canal
(`nada-a-acionar`).

---

## Qual mordida prova

Três curas arrancadas, uma a uma, cada uma com a régua reprovando **nomeando**:

**1. Regra 19 (`lado-sem-regua`) — apaguei o `radio_de_onde_sei` de uma linha em
que escrevi conteúdo (`plataforma.nfc@pro`):**

```
FALHA lado-sem-regua: linha 240 (plataforma.nfc@pro) [radio]: `radio_aciona = não`
e `radio_report_id`, `radio_comando`, `radio_evidencia`, `radio_detalhe`,
`radio_ressalva`, `radio_codigo_ref` escrito(s), mas `radio_de_onde_sei` está
vazia: a célula afirma sobre este transporte sem dizer de onde sabe.
```
`scripts/check_paridade_transporte.py` → `rc=1`.

**2. `citacoes-de-linha` — troquei `:2925-2927` por `:9925-9927` numa citação que
EU escrevi (`movimento.imu.calibracao@pro`, `cabo_ressalva`):**

```
docs/data/mapa-controles.csv:191 (movimento.imu.calibracao@pro · cabo_ressalva):
`assets/dkms/hid-nintendo/hid-nintendo.c:9925-9927` -- a linha não existe:
assets/dkms/hid-nintendo/hid-nintendo.c tem 3303 linha(s)
```
`scripts/validar-citacoes-de-linha.py --all` → `rc=1`. **Esta é a que importa:
ela prova que os `arquivo:linha` que escrevi ABREM.**

**3. O domínio e o teto — escrevi `dívida` acentuada numa célula e uma `divida`
a mais noutra:**

```
AssertionError: valor fora do domínio em plataforma.nfc@pro (cabo) = 'dívida'.
AssertionError: a dívida do mapa subiu para 26 células, e o teto … é 25 …
FALHA integridade: linha 240 (plataforma.nfc@pro) [cabo]:
      `cabo_por_que_nao_aciona` fora do domínio: 'dívida'
```

As três foram devolvidas e o CSV conferido byte a byte contra a cópia de antes
da mordida (`md5sum` igual).

**E os TRÊS derivados foram regerados**, porque mexer no CSV move três arquivos
que ninguém escreve à mão — e os três têm portão próprio, que reprovou antes de
eu os regerar:

| derivado | quem regera | portão |
| --- | --- | --- |
| `html/specs.html` | `scripts/gerar-mapa.py` | `mapa-de-canais` |
| `src/hefesto_dualsense4unix/app/fatos_do_mapa.py` | `scripts/gerar-fatos-de-tela.py` | `fatos-de-tela` |
| os números entre marcas de `docs/data/LEIA-PRIMEIRO.md` | `check_paridade_transporte.py --leia-primeiro --escrever` | `tests/unit/test_leia_primeiro_nao_digita_numero_a_mao.py` |

O `--escrever` do terceiro atualizou TRÊS números, e só dois são meus: os bytes
do mapa e do `specs.html`. **O terceiro —
`bytes:scripts/check_paridade_transporte.py`, 125.597 → 127.351 — já estava
podre em `ae1c3d82`**, de uma leva anterior que cresceu o portão sem regravar o
documento. Foi junto no mesmo gesto porque o gerador não sabe separar, e fica
declarado aqui para ninguém o ler como mudança minha.

**Uma armadilha de PROSA cobrada pelo `acentuacao`, e ela é fina:** escrevi *"a
`cabo_evidencia` desta linha já media por `grep`"* — `media`, de *medir*, está
certo em português e o `validar-acentuacao.py` o acusa mesmo assim, porque não
consegue separar o verbo de *média*. A régua está certa em não adivinhar; a
cura foi trocar o tempo verbal (`já mediu`), não afrouxar a régua.

---

## O que NÃO verifiquei

- **Nada com aparelho.** Não havia Pro nem 8BitDo na mesa, e nenhuma célula
  subiu para `de_onde_sei = medido` nem ganhou degrau de escada. Toda afirmação
  desta leva é `inferido-do-codigo`.
- **A `movimento.imu.perda@pro` [cabo] FICA `nao-medido`, e é a única.** Foi
  decisão, não esquecimento: o contador é o mesmo dos dois lados (não há ramo de
  bus, `:1718-1725`), mas o lado do rádio é `divida` porque **lá existe fenômeno
  medido a mostrar** — 1613 episódios num dia — e no cabo ninguém sabe se ele
  acontece; todas as contagens desta casa são de link Bluetooth. Declarar dívida
  ali seria dizer que a casa deve mostrar um número que ninguém viu.
- **Não mexi em `existe`, `aceita`, `aciona`, `canal`, `report_id`, `offset`,
  `comando` nem na escada.** A leva mexeu na CAUSA e na prosa que a sustenta. Em
  particular, `luz.led_jogador.escrita_hefesto@pro` continua com `aceita` vazio:
  a `nota` da linha declara esse vazio como deliberado (*"é pergunta sobre o
  aparelho, e ninguém a fez para ESTE aspecto"*), e sobrescrever declaração
  deliberada por leitura de fonte não é troca justa.
- **Não conferi o `hid-nintendo` contra o mainline nem contra a linux-input de
  hoje.** A fonte é a cópia DKMS desta árvore, cujo `sha256` bate com o módulo
  instalado — e o driver muda com o kernel.
- **Fonte de terceiro além do kernel:** não abri SDL nem yuzu/Eden nesta leva.
  As citações a eles que já estavam em `plataforma.handshake_usb@pro` são de
  31/08 e ficaram como estavam; não as endossei nem as removi.

---

## O que sobrou para o próximo

1. **DOIS PORTÕES JÁ NASCERAM VERMELHOS NESTA ÁRVORE, e não são meus.** Medidos
   em `ae1c3d82`, ANTES de eu tocar num byte, e continuam idênticos depois:
   - `paridade-gtk-html` — `divida-fechada` em
     `paridade-gtk-html.csv:315` e `:343`: os sinais
     `on_daemon_migrate_to_systemd` e `_meu_perfil_asset` APARECERAM em
     `interface/pacotes/a09_sistema.py` e o CSV ainda diz `FALTA_NO_HTML`;
   - `donos-de-comportamento` — `donos-de-comportamento.csv:47`
     (`migrar_para_systemd`) marcado `SO-GTK` com a tela nova já chamando o
     sinal.

   **São a MESMA cura, e ela é da frente do `09-sistema`** — não da minha, e
   tocá-la daqui seria mexer no dado de outra leva.

2. **A suíte tem um vermelho herdado no mesmo arquivo que eu editei, e eu o
   deixei de propósito:** `test_a_populacao_nao_depende_da_coluna_que_ela_confere`
   afirma `len(populacao) == 41` e hoje são **43**. O próprio teste diz que isso
   *"não é reprovação de defeito: é aviso de que o retrato deste arquivo
   envelheceu"*. As duas células que cresceram a população são do **DualSense**,
   vindas da leva de 05-06/09 que mediu os quatro — recontá-las é de quem as
   escreveu. **Meu commit não moveu esse número** (as 38 células são todas
   `inferido-do-codigo`, e a população só conta `medido`).

3. **A alavanca de descida do teto da dívida está escrita e vale QUATRO
   células**, sem uma linha de produto: colapsar `vibracao.rumble.direito@pro` e
   `.esquerdo@pro` na mãe `vibracao.rumble.ff@pro`, que é a dona do levantamento
   e para quem elas já apontam. Leva o teto de 25 para 21. O mesmo vale no
   `sn30`.

4. **Duas perguntas entraram na fila DELA, e são novas:** `energia.desligar@pro`
   (desligar o Pro pelo aplicativo — a alavanca é única, é o subcomando `0x06`, e
   nem o kernel nem o Hefesto a usam) e `identidade.pareamento@pro` (reescrever
   ou apagar o pareamento — o Pro pode passar a esquecer o Switch). As duas
   estão em `so-ela-decide`, que é a fila de decisão, e as duas têm o mecanismo
   com `arquivo:linha` para quem for implementar depois da palavra dela.

5. **A medição que fecharia a última célula:** pôr o Pro **no cabo** e contar
   `compensating for N dropped IMU reports` no `journalctl -k`. Se o fenômeno
   aparecer, `movimento.imu.perda@pro` [cabo] vira `divida` como a irmã do
   rádio; se não aparecer, vira `nada-a-acionar`. É a única das 38 que precisa
   de aparelho.

6. **A irmã desta leva:** as células `nao-medido` do `sn30` são da
   `OS-EXTERNOS-NO-MAPA-SN30`. Vários vereditos daqui saíram por PRECEDENTE dela
   (`entrada.stick.calibracao@sn30` e `movimento.imu.calibracao@sn30` já diziam
   `nada-a-acionar` no cabo) — as duas levas se conferem uma à outra, e uma
   divergência entre `@pro` e `@sn30` na mesma chave é sinal, não estilo: o
   driver é o mesmo.
