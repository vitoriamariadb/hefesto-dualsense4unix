# OS-EXTERNOS-NO-MAPA-SN30 — as 56 células mudas do 8BitDo, levantadas na fonte

**Data:** 06/09/2026 · **Branch:** `voo/OS-EXTERNOS-NO-MAPA-SN30-01-opus` ·
**Base:** `ae1c3d82`

**O teto desta tarefa está no enunciado dela, e eu o respeitei:** não há
aparelho. Nenhuma célula subiu para `medido`, nenhum grau de escada foi
escrito, e nenhuma linha nova entrou em `docs/data/ensaios.csv`. O que se
levantou foi a FONTE — o `hid-nintendo` que esta árvore versiona, o
`SDL_hidapi_switch.c` do libsdl-org baixado por commit pinado, o `usb_ids.h`
do mesmo repositório, e as quatro páginas de `docs/protocol/` que esta casa já
tinha pago.

## O que mudou

**As 56 células `nao-medido` do `sn30` viraram 49 respostas e 7 recusas.** A
coluna é o par `cabo_por_que_nao_aciona` / `radio_por_que_nao_aciona`, e o
retrato do controle passa a ser:

| valor | antes | agora |
| --- | ---: | ---: |
| `nada-a-acionar` | 83 | **105** |
| `so-ela-decide` | 0 | **17** |
| `decisao-tomada` | 7 | **17** |
| `divida` | 4 | 4 |
| `nao-medido` | **56** | **7** |

**A DÍVIDA DO MAPA NÃO SE MOVEU: 23, contra o teto de 23.** Nenhuma célula
nova diz `divida`, e isso não é sorte — é a segunda entrega desta tarefa, e
está na seção seguinte.

**As quatro classes, e a razão de cada uma:**

1. **`nada-a-acionar` (22 células novas) — quem faz é o DRIVER, sozinho, na
   conexão.** `joycon_init` chama `joycon_enable_imu` em
   `assets/dkms/hid-nintendo/hid-nintendo.c:2937`, `joycon_set_report_mode` em
   `:2949-2968` e `joycon_enable_rumble` em `:2972`, os três **sem porteiro de
   barramento** — o gate é `joycon_has_imu`/`joycon_has_rumble`, que perguntam
   pelo TIPO do controle. Não há o que o Hefesto acione: ele não é o driver
   deste aparelho. **A segunda implementação concorda**, e é o que faz esta
   leitura valer mais que um grep: no SDL o mesmo trabalho é do inicializador
   (`SetVibrationEnabled` em `SDL_hidapi_switch.c:1680`, `SetInputMode` em
   `:896`, `SetIMUEnabled` em `:1949`, `LoadStickCalibration` em `:1661`).
2. **`decisao-tomada` (10 células novas) — não acionar é a escolha, e ela está
   escrita.** A bateria de externo (`docs/protocol/externos-referencia-canonica.md`,
   seção 7.2 item 8: *"é bom que não leia"*), o firmware (o Hefesto não
   atualiza firmware de controle nenhum), o LED HOME (o portão fechado desde
   07/08) e a escrita crua (o escopo à OUI do Pro genuíno no cabo, o
   `_IMU_ENABLE_ALLOWED_BUS = "usb"` no rádio).
3. **`so-ela-decide` (17 células novas) — o produto PODE, e a escolha é dela.**
   É a família do veto de adoção, e ela tem UMA razão só: o Hefesto não adota o
   SN30, e a adoção é decisão **reaberta e pendente da palavra dela**, escrita
   em três lugares que não se contradizem — a seção «O VETO» da
   `LUGAR-A-MESA-01`, a `MASCARA-01` (*"a adoção continua atrás da palavra
   dela"*) e o docstring de `discover_gamepads` em
   `src/hefesto_dualsense4unix/core/evdev_reader.py` (*"o veto de 19/07 segue
   de pé; quem o derruba é a `E3`, e ela é dela"*). Mais a `P-1` dos parâmetros
   de link, que não espera código — espera ela autorizar o privilégio.
4. **`nao-medido` (7 que FICAM) — e isto é entrega.** Seção própria abaixo.

**UMA DIVERGÊNCIA COM A LINHA IRMÃ, DECLARADA EM VEZ DE ESCONDIDA.**
`plataforma.adocao@pro` diz `nada-a-acionar`; `plataforma.adocao@sn30` passa a
dizer `so-ela-decide`. Os dois plásticos rodam o MESMO driver, então a
divergência precisa de razão — e ela está na `nota` da célula: adotar um
externo não é *"não há o que fazer"*, é uma decisão que espera a palavra dela,
e `nada-a-acionar` diria ao próximo leitor que a fila está vazia quando não
está. Quem for dono da linha do `pro` reconcilia as duas. O que não se pode é
as duas ficarem caladas dizendo coisas diferentes.

**UM FATO ERRADO, SUBSTITUÍDO.** `luz.recursos_proprios@sn30` afirmava, nos
dois lados, que *"nenhum arquivo do repositório descreve o Turbo **nem a
semântica dos LEDs de modo**"*. A metade dos LEDs de modo é falsa desde que a
seção 2.3 de `docs/protocol/externos-firmware-e-modos.md` foi escrita: a
tabela do fabricante está lá, e o indicador é uma CONTAGEM de lâmpadas
piscando (1 = D-input, 2 = X-input, 3 = macOS, girando = Switch ou pareando,
fixa = conectado, vermelha piscando = bootloader). Substituído com data. O
Turbo continua sem uma linha em lugar nenhum, e é por isso que a célula fica
`nao-medido`.

**O ACHADO QUE MAIS PESA, e ele agrava um defeito que a casa já conhecia.** O
mapa já registrava, em `luz.led_home@sn30`, que o `write_player_number` escreve
`1` no nó `:blue:player-5` como bit "+5" da numeração, quando aquele nó é o LED
HOME de escala 0-15 — *"GRAU ALTA de que está errado; hoje calado pelo portão.
Não voltar sem corrigir"*. A conta do dano era *"1/15 de brilho no anel de
Home"*. **O SDL diz que pode ser pior que isso.** `HasHomeLED()`
(`libsdl-org/SDL@8d6c456`, `src/joystick/hidapi/SDL_hidapi_switch.c:1302-1329`)
devolve falso para `k_eSwitchDeviceInfoControllerType_Unknown` e para
`_LicProController`, com o comentário **«Third party controllers don't have a
home LED and will shut off if we try to set it»** — e o caminho de escrita tem
guarda própria em `:1921-1924`: **«Setting the home LED when it's not supported
can cause the controller to reset»**. Se o clone cair num desses dois tipos, o
que aquele portão fechado está segurando não é brilho errado: é risco de RESET
do aparelho.

## Qual mordida prova

**Não escrevi teste novo, e digo por quê antes de dizer o que arranquei:** esta
tarefa não acrescentou comportamento ao produto — ela responde 56 células de um
CSV que já tem portão próprio. A mordida certa aqui é arrancar a resposta e ver
os portões que JÁ existem reprovarem, e é o que fiz, uma a uma, com o `python`
que o `scripts/portoes.sh --interpretador` resolve.

| # | o que arranquei | quem reprovou, e com que palavra |
| --- | --- | --- |
| 1 | troquei UMA das 49 (`luz.led_home@sn30`, cabo) por `divida` | `test_a_divida_nao_cresce` — **«a dívida do mapa subiu para 24 células, e o teto de 22/08/2026 é 23»**. É a prova de que o teto ainda morde, e de que as 49 respostas foram escolhidas SOB ele |
| 2 | escrevi `nada-a-acionár` (com acento) numa das minhas, `movimento.imu.ligar@sn30` | `test_o_valor_cabe_no_dominio` reprova nomeando o valor e listando o domínio |
| 3 | **esvaziei uma das minhas** (`movimento.imu.ligar@sn30`, cabo) | **NINGUÉM reprovou** — e o achado está na seção seguinte |
| 4 | arranquei o `radio_de_onde_sei` da linha que ganhou `radio_ressalva` nova | `scripts/check_paridade_transporte.py` sai `rc=1`: *«FALHA lado-sem-regua: linha 195 (`movimento.imu.ligar@sn30`) [radio] (…) `radio_ressalva` escrito(s), mas `radio_de_onde_sei` está vazia»*. É a regra 19 mordendo a MINHA prosa, não a de outro |
| 5 | devolvi o `html/specs.html` de `ae1c3d82` | `scripts/gerar-mapa.py --check` sai `rc=1`: *«DESATUALIZADO — a página publicada não é a que estas fontes produzem»*, com o diff da linha |

**A MORDIDA 3 É O ACHADO DESTA LEVA SOBRE A PRÓPRIA RÉGUA, e ela é
desconfortável:** esvaziar uma das 49 células que escrevi **não reprova nada**.
A razão é estrutural e está no código do teste: `populacao()`
(`tests/unit/test_o_mapa_separa_divida_de_decisao.py`) recorta quem tem
`de_onde_sei = medido` **e** `aciona = não`, e a regra 1
(`test_toda_celula_medida_e_nao_acionada_diz_por_que`) só cobra o porquê dentro
desse recorte. As 49 células desta leva são todas `inferido-do-codigo`,
`afirmado-no-doc` ou `incerto` — **fora da população**. Elas ficam respondidas
porque alguém as respondeu, não porque um portão as segura.

Isso **não é defeito do teste**: o recorte é deliberado, e o cabeçalho dele
explica que cobrar a lacuna inteira reprovaria decisão junto com dívida. É
informação para quem vier depois, e é honesto dizê-la em vez de deixar a tabela
sugerir uma cobertura que não existe. As duas regras que alcançam estas células
são as que leem o arquivo INTEIRO: o domínio (mordida 2) e a contagem de dívida
(mordida 1) — e `conta_dividas` diz isso com todas as letras no próprio
docstring.

**UMA REPROVAÇÃO QUE NÃO É MINHA, e ela já estava aqui.**
`test_a_populacao_nao_depende_da_coluna_que_ela_confere` reprova em
`ae1c3d82`, antes de eu tocar em nada: ele afirma `len(antes) == 41` e a
população do mapa está em **43**. Medi os dois lados — o CSV de `HEAD` e o meu
— e a população é **43 nos dois**, com diferença de conjunto VAZIA: nenhuma
célula entrou nem saiu por minha causa. O próprio teste diz o que isso é:
*«Não é reprovação de defeito: é aviso de que o retrato deste arquivo
envelheceu e o texto precisa ser recontado»*. Não o recontei, porque recontar o
retrato é reescrever a prosa datada de um portão que não é território desta
tarefa — e trocar um número de portão de passagem é exatamente como um teto
vira folga.

## Os portões, e os vermelhos que já estavam aqui

`bash scripts/portoes.sh` fecha em **43 verdes de 45**. Os dois vermelhos são
`paridade-gtk-html` e `donos-de-comportamento`, e **os dois já reprovavam em
`ae1c3d82`, antes de eu tocar em qualquer arquivo** — medido, não suposto: tirei
as minhas cinco mudanças da árvore, rodei os dois scripts na base limpa, e eles
devolveram `rc=1` com os MESMOS três achados, todos em `[09-sistema]`:

- `paridade-gtk-html.csv:315` e `:343` — `divida-fechada`, o
  `on_daemon_migrate_to_systemd` e o `_meu_perfil_asset` apareceram em
  `src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py`;
- `donos-de-comportamento.csv:47` — `migrar_para_systemd` está marcado
  `SO-GTK` e a tela nova já chama o sinal.

Nenhum dos três lê o mapa de canais, e nenhum dos arquivos que eles leem está
no meu diff. **É dívida de quem fechou a aba 09, e o portão está pedindo a
reclassificação** — o veredito do CSV mudou porque o trabalho foi ENTREGUE.

**A suíte que toca o mapa também foi rodada, e o mesmo cuidado vale.** Os 73
arquivos de `tests/unit/` que leem `mapa-controles.csv`, `fatos_do_mapa` ou
`LEIA-PRIMEIRO.md` fecham em **1186 passados, 6 reprovados** — e os seis
reprovam IGUAL na base limpa, conferido com a árvore revertida. Os dois que
mais pareciam meus, porque são da minha própria coluna, acusam linhas
`@dualsense` que eu não toquei: `test_causa_nao_declarada_z6_05` cai em
`identidade.cor_do_aparelho@dualsense` e `test_as_celulas_respondidas_seguem_respondidas`
em `luz.recursos_proprios@dualsense`.

## O que NÃO verifiquei

- **NADA foi medido no aparelho.** Não há SN30 nesta mesa, e nenhuma célula
  mudou de `de_onde_sei`: as 49 continuam `inferido-do-codigo`, `afirmado-no-doc`
  ou `incerto`, exatamente como estavam. Nenhum grau de escada foi escrito,
  nenhuma linha entrou em `docs/data/ensaios.csv`, e a regra 6 do portão
  continua com zero órfãos.
- **Em qual `ESwitchDeviceInfoControllerType` o SN30 Pro cai.** É o que decide
  se a guarda do SDL o alcança, e se a escrita no `:blue:player-5` é brilho
  errado ou risco de reset. Fecha com o `REQ_DEV_INFO` (`0x02`) e o aparelho na
  mesa — o clone JÁ respondeu a esse subcomando pelo cabo em 11/08, então é
  medição barata quando ele voltar.
- **Se a lâmpada HOME existe no plástico do SN30 Pro.** Continua a `P-4` da
  canônica dos externos, e continua sendo cinco segundos de olho dela.
- **Nenhum dos modos que esta bancada nunca ligou.** As citações do `usb_ids.h`
  do SDL confirmam os PARES do modo D-input (`2dc8:6001` no cabo, `2dc8:6101`
  no rádio, com o combo «B + START» no próprio comentário do arquivo) — o que
  elas não dizem é o que o aparelho faz naquele modo, porque ninguém o ligou.
- **Nenhum portão segura as 49 respondidas.** Está medido na mordida 3: elas
  estão fora da população que a regra 1 cobra, porque nenhuma é `medido`. Quem
  as apagar amanhã não será reprovado por isso.
- **O `xpadneo` não entrou.** Fui procurá-lo pelo modo X-input e a própria casa
  já tinha medido que ele não serve aqui: quem pega o `045e:02e0` por rádio é o
  `hid-microsoft`, e o `xpad` é USB puro (`docs/protocol/externos-firmware-e-modos.md`,
  seção 2.5). Citar o `xpadneo` seria citar um driver que não toca este
  aparelho em modo nenhum.

## O que sobrou para o próximo

**AS SETE QUE FICAM `nao-medido`, uma a uma — e a honestidade da célula é o
produto aqui.**

| célula | por que fica |
| --- | --- |
| `movimento.imu.perda@sn30` (cabo **e** rádio) | **A resposta honesta é `divida`, e o TETO a barra.** As duas irmãs diretas já a dizem — `@dualsense` no cabo, `@pro` no rádio —, o mecanismo é o mesmo (quem conta a perda é o kernel; o produto não lê nem mostra o número para controle nenhum) e o `existe` desta linha já é `tem`. Escrevê-las levaria a dívida de 23 para 25, e o teto **só desce**. Quem pagar uma das 23 escreve estas duas no mesmo commit |
| `energia.desligar@sn30` (cabo e rádio) | O que falta não é fonte: é aparelho. **Duas** implementações independentes declaram o desligar e nenhuma o emite — `SET_HCI_STATE 0x06` é `#define` morto no `hid-nintendo` (`:133`) e `k_eSwitchSubcommandIDs_SetHCIState` é enum sem chamador no SDL (`:110`). Nenhuma delas diz o que o firmware do clone faz com ele, e ninguém mandou 0x06 a este SN30 |
| `luz.recursos_proprios@sn30` (cabo e rádio) | `de_onde_sei` é `incerto` nos dois lados, e a linha irmã do `pro` declara por escrito que o clone fica assim de propósito. Os LEDs de modo ganharam semântica nesta leva, mas semântica de INDICAÇÃO não é comando de host: nem o kernel nem o SDL têm subcomando de Turbo ou de LED de modo. Concluir `nada-a-acionar` do silêncio das fontes é o passo que esta casa já pagou caro |
| `plataforma.handshake_usb@sn30` (cabo) | O caso literal da palavra. A própria ressalva da célula já cobra o que falta: *"FALTA MEDIR o handshake com o clone na mesa"*. Leitura de fonte não substitui — as três fontes do protocolo concordam sobre o que o host EMITE, e nenhuma sobre o que este firmware RESPONDE |

**E as três frentes que esta leva abre:**

1. **Reconciliar `plataforma.adocao@pro` com `@sn30`.** A divergência está
   declarada na `nota` da célula do `sn30`; ela precisa de dono. É a mesma
   pergunta para as sete linhas da família do veto.
2. **Reabrir a bateria do externo com o número certo na mão.** O
   `decisao-tomada` que escrevi vale, mas a ressalva que pus junto dele diz o
   que o argumento da canônica não cobre: o `hid-nintendo` publica
   `CAPACITY_LEVEL` (`assets/dkms/hid-nintendo/hid-nintendo.c:2655-2658`), que
   é exatamente o nível em cinco degraus da linha, e o *"leria AUSENTE"* da
   seção 7.2 é sobre `capacity`, que ele não publica. Se alguém reabrir, é
   pergunta de DÍVIDA, não de nada-a-fazer.
3. **A medição que fecha o LED HOME é barata e vale por três células.** Ligar o
   clone pelo cabo em modo Switch, ler o tipo que o `REQ_DEV_INFO` devolve, e o
   `luz.led_home@sn30`, o `luz.led_jogador.pisca@sn30` e o defeito do
   `write_player_number` fecham juntos.
