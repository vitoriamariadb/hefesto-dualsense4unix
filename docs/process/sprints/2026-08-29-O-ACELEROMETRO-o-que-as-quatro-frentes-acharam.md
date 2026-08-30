# O acelerômetro — o que as quatro frentes acharam, e o que eu medi hoje

**29/08/2026.** Quatro frentes trabalharam sem se ver: uma dentro de casa, uma
na Steam/SDL, uma na Sony/HID, uma no GitHub. Este documento cruza as quatro,
confere aqui o que dava para conferir, e propõe a célula do mapa.

**A leva foi de LEITURA.** Não escrevi no aparelho, não rodei `install.sh`, não
toquei perfil, não rodei a suíte, não abri janela. As duas medições novas
saíram de nós `evdev` abertos só para ler, e da porta do daemon
(`ipc_bridge.daemon_state_full()`).

---

## 1. A resposta curta

**As quatro frentes voltaram com a mesma coisa, por quatro caminhos
diferentes: o acelerômetro não é pergunta de protocolo. É pergunta sua.**

O aparelho entrega. O kernel decodifica. O dado chega ao nosso processo,
calibrado, pelo mesmo nó `evdev`, pelo mesmo laço e pela mesma thread que já
alimentam o giroscópio da tela. O que existe entre esse número e a sua tela são
**três linhas de código** — e uma decisão que o mapa registra, desde 15/08, com
o nome de `so-ela-decide`.

Das 308 linhas do mapa, **`movimento.acelerometro@dualsense` é a única em que
a única coisa entre a medição e o produto é a sua palavra.** Recontei: 50
linhas estão medidas nos dois transportes; 23 delas o produto não aciona; e
essa é a única com `so-ela-decide` nos dois lados. Todas as outras 22 dizem
`nada-a-acionar`, `decisao-tomada`, `divida`, ou não dizem nada.

---

## 2. O que muda o produto amanhã

### 2.1 Uma frase falsa está na tela de hoje, e ela pode ter decidido por você

Hoje o acelerômetro **saiu da leitura da tela**, por decisão sua, registrada em
`novo-layout/_ferramentas/aba02.py:6-40`
(`D-A-LEITURA-DO-ACELERÔMETRO-SAI-DA-TELA`), com a sua palavra:
*"o acelerômetro não funciona"*.

**Sobre o produto, você está certa.** Conferi ao vivo, hoje, na porta do daemon
da sua mesa: os dois controles publicam `inputs` = `buttons`, `gyro`, `l2_raw`,
`lx`, `ly`, `r2_raw`, `rx`, `ry`, `speaker`, `touchpad`. **Não há chave de
acelerômetro.** O produto não calcula esse número, nunca calculou, e a tela que
o desenhava mostrava traço.

**Mas o texto que entrou na tela no lugar diz outra coisa** —
`novo-layout/_ferramentas/aba02.py:821-823`, gerado **quatro vezes** em
`novo-layout/02-controles.html` (uma por cartão):

> *"O **acelerômetro** não é lido aqui, e não é esquecimento: o aparelho **não
> o entrega** — nem pelo cabo, nem pelo rádio."*

**Isso é falso.** Não é opinião: esta casa mediu o contrário nos dois
transportes, em quatro unidades, em 15/08, com régua absoluta — e eu remedi
hoje, num quinto caminho de código, e deu igual.

Repare que as três fontes que o próprio bloco de decisão cita
(`aba02.py:14-24`) dizem, todas, que **o PRODUTO não publica** — nenhuma diz
que o aparelho não entrega. A terceira, aliás, diz o oposto:
`2026-08-26-O-QUE-ELA-DESENHOU` — *"Só como bytes 21-26 do report físico"*.

**O que peço:** a frase precisa ser substituída antes de a decisão ser
confirmada. Trocar

> *"o aparelho não o entrega"*

por

> *"o Hefesto ainda não lê. O aparelho entrega — medido nos dois transportes —
> e ligar custa quatro degraus de uma sprint já escrita."*

A decisão continua sendo sua. Só a premissa muda. E é a memória desta casa se
repetindo: *"o enunciado também carrega fato errado"* (27/08).

**Custo: uma edição de texto.** É o item mais barato desta leva e o que mais
muda o que você decide.

### 2.2 Se a resposta for "pode aparecer", a ponte já está orçada e é curta

A sprint existe, escrita e nunca executada:
`docs/process/sprints/2026-08-27-ONDA-CONTROLES-04-o-acelerometro-esta-no-mesmo-node.md`.
Quatro degraus:

| degrau | arquivo | o que muda |
|---|---|---|
| 1 | `core/evdev_reader.py:2146` e `:2165` | acrescentar `ABS_X/Y/Z` ao laço que **já roda** no mesmo nó, com escala do `absinfo` |
| 2 | `daemon/sensor_hub.py:119` | `out["accel"]` ao lado do `out["gyro"]` |
| 3 | `app/widgets/sensor_widgets.py:331` | reaproveitar a `GyroBars` (o stub sem GTK já existe em `:655`) |
| 4 | `app/widgets/controller_card.py` | `accel_do_inputs`, com molde igual ao do giro |

Não abre nó novo, não abre `hidraw`, não passa pelo broker, não escreve no
aparelho, e **é idêntico no cabo e no rádio** — quem decodifica e calibra é o
kernel. Não há assimetria a declarar, ao contrário da cor do plástico.

O teste que a sprint pede — `tests/unit/test_controles_o_acelerometro_chega.py`  <!-- ref-externa: a AUSÊNCIA é o assunto da frase; o arquivo nasce com a ONDA-CONTROLES-04 -->
— **não existe no disco** (conferido). E o teste que hoje trava a ausência,
`tests/unit/test_sensores_status.py:99`
(`test_motion_reader_ignora_o_acelerometro_do_mesmo_node`), teria de ser
reescrito, não apagado: ele existe para impedir que ABS_X/Y/Z virem
*giroscópio*, e essa armadilha continua real (ver §7.3).

### 2.3 Um número que já está na sua tela hoje está errado por design, e ninguém contou isso a ninguém

Isto não estava no enunciado e apareceu na medição.

O giroscópio que a sua tela mostra **não marca zero com o controle parado na
mesa**. Medi hoje, 20 s por controle, duas vezes:

| aparelho | giro médio parado (°/s) | módulo | desvio |
|---|---|---|---|
| `44:46:48:00:00:03` | (+0,43 · +0,70 · −0,18) | **0,84 °/s** | ±0,12 · ±0,06 · ±0,08 |
| `d4:2f:4b:00:00:d8` | (+1,22 · +0,01 · −0,85) | **1,49 °/s** | ±0,07 · ±0,05 · ±0,07 |

O desvio é **vinte vezes menor que a média**: não é ruído, é um deslocamento
constante. E o `daemon.state_full` da sua mesa publica exatamente esse número —
li agora: `gyro = {x: 1.28, y: 0.0, z: -0.92}` no `d4:2f:4b`, batendo com a
minha leitura independente dentro de 0,06 °/s.

**A causa está no driver, é deliberada, e esta casa já a tinha medido**: o
`hid-playstation` **zera de propósito** o viés de fábrica do giroscópio
(`assets/dkms/hid-playstation/hid-playstation.c:1200`, `:1206`, `:1212` —
`bias = 0`) e só normaliza a escala. O mapa já registra isso em
`movimento.giroscopio@dualsense`, coluna `estado_hoje`: *"as quatro unidades
ficam entre 0,19 e 1,53 graus/s de bias de velocidade angular… um jogo que
integrar sem corrigir deriva de 0,2 a 1,5 grau por segundo"*.

**O que é novo hoje:** que esse número **chega à sua tela** e que ele reproduz
catorze dias depois. Para um produto de acessibilidade isso importa: um
controle parado, na mesa de quem não consegue segurá-lo firme, mostra
movimento. Se o acelerômetro entrar na tela ao lado do giro, o acelerômetro
mostrará ~1,00 g com o controle parado (que está certo, é a gravidade) e o giro
mostrará ~1 °/s (que está errado, é viés de fábrica) — e a tela não distingue
um do outro.

**Custo do conserto: o dado para corrigir já está no aparelho** e o produto já
sabe pedi-lo (o feature `0x05`, e o `giro_e_buraco.py` já o lê). É uma
subtração de três constantes por unidade. **Não proponho fazer agora** — é
linha nova no mapa, e é sua a decisão de abrir. Registro porque medi.

---

## 3. O que eu medi hoje, aqui, e por que vale mais que as quatro frentes juntas

### 3.1 A troca de braços que faltava ao acelerômetro — agora existe

A `radio_ressalva` da própria célula do acelerômetro declara, desde 15/08, o
limite de desenho do ensaio E-4:

> *"nenhum aparelho trocou de braço, então 'o rádio entrega isto' está
> confundido com 'estas duas unidades entregam isto'"*

**Hoje esse limite caiu, por acidente do estado da mesa.** O `44:46:48:00:00:03`,
que em 15/08 foi medido **no rádio**, está **no cabo** agora. Mesma unidade,
transporte diferente, catorze dias depois:

| aparelho | 15/08 (E-4) | 29/08 (hoje) | Δ |
|---|---|---|---|
| `44:46:48:00:00:03` | **rádio** — 0,9899 g ±0,0012 (7512 reports) | **cabo** — 0,9960 g ±0,0013 (5000 reports) | **0,006 g** |
| `d4:2f:4b:00:00:d8` | cabo — 1,0095 g ±0,0139 (5000 reports) | cabo — 0,9931 g ±0,0006 (5001 reports) | 0,016 g |

A dispersão **entre unidades** em 15/08 foi de 0,032 g (0,9777 a 1,0095). A
diferença **entre transportes** da mesma unidade é 0,006 g — **cinco vezes
menor**. É exatamente a forma de argumento que inocentou o transporte na linha
do giroscópio, e agora ela existe para o acelerômetro.

**Erro contra 1 g: 0,4% e 0,7%.** Melhor que o E-4, porque as duas medições de
hoje pegaram os controles realmente parados (a primeira passagem apanhou o
`44:46:48` em movimento, com desvio de ±0,079 g e ±12 °/s; repeti, e a segunda
saiu com ±0,0013 g — está nos dois blocos porque a diferença entre elas é a
prova de que a régua enxerga movimento).

### 3.2 Dois decodificadores independentes, o mesmo número

Isto é a parte que nenhuma frente podia entregar.

- Em **15/08**, o E-4 leu os bytes **crus do `hidraw`**, pela porta do broker,
  fatiando o report com os offsets do driver escritos à mão
  (`0x01`, corpo em `data[1]`, accel em 22..27 / `0x31`, corpo em `data[2]`,
  accel em 23..28).
- **Hoje**, eu li pelo **`evdev`**, isto é, deixei o **kernel** fatiar o report,
  aplicar a calibração de fábrica do feature `0x05` e publicar `ABS_X/Y/Z`.

**Duas fatias, dois códigos, duas datas, dois transportes — e o mesmo 1 g
dentro de 0,7%.** Se os offsets que esta casa escreveu estivessem errados, os
dois números não teriam como coincidir: um lixo somado em quadratura não dá o
módulo da gravidade.

### 3.3 A régua, conferida fora da conta, nos nós de hoje

`EVIOCGABS`, lido dos dois nós `Motion Sensors` vivos agora:

```
ABS_X / ABS_Y / ABS_Z     min=-32768   max=+32768    res=8192    ← acelerômetro
ABS_RX / ABS_RY / ABS_RZ  min=-2097152 max=+2097152  res=1024    ← giroscópio
INPUT_PROP_ACCELEROMETER  presente nos dois nós
```

`32768 / 8192 = ±4 g` de fundo de escala, e `res=8192` bate com
`DS_ACC_RES_PER_G` do driver (`hid-playstation.c:226`). A régua não é constante
nossa: sai do aparelho.

### 3.4 O que o daemon publica, agora, na sua mesa

```
controllers[*].inputs = buttons, gyro, l2_raw, lx, ly, r2_raw, rx, ry,
                        speaker, touchpad
```

Sem `accel`. Nos dois controles. `transport = usb` nos dois.

**Um achado de tabela:** o `vpad_backend` dos dois é `uinput` — a máscara
Xbox 360. A linha `movimento.acelerometro.jogo@dualsense` diz `aciona = sim`
nos dois lados, mas com `ponte_alcanca = gamepad/dualsense`. Ou seja: **hoje,
na sua mesa, o acelerômetro também não chega ao jogo** — não porque a linha
esteja errada, mas porque a máscara em uso não é a que a ponte exige. A linha
já declara essa condição; registro só para você não ler `aciona = sim` como
"está acontecendo agora".

---

## 4. A célula do mapa — proposta, campo a campo

**Chave:** `movimento.acelerometro@dualsense` (`docs/data/mapa-controles.csv`,
linha 175). **Não editei o CSV.**

### 4.1 O que NÃO muda, e por quê

| campo | fica | motivo |
|---|---|---|
| `existe` | `tem` | quatro fontes, medido |
| `cabo_aceita` / `radio_aceita` | `sim` / `sim` | — |
| `cabo_aciona` / `radio_aciona` | `não` / `não` | **conferido hoje na porta do daemon**: não há chave `accel` |
| `cabo_por_que_nao_aciona` | `so-ela-decide` | continua sendo sua |
| `radio_por_que_nao_aciona` | `so-ela-decide` | idem |
| `cabo_de_onde_sei` / `radio_de_onde_sei` | `medido` / `medido` | **já eram**; nada aqui os promove — e nada precisa |
| `cabo_canal` / `radio_canal` | `evdev` / `evdev` | — |
| `teste_que_morde` | `test_sensores_status.py::test_motion_reader_ignora_o_acelerometro_do_mesmo_node` | continua mordendo a AUSÊNCIA, e é honesto que morda |

**Nenhuma coluna de proveniência sobe por causa desta leva.** Quatro sites
concordarem não vira `medido`; e o que era `medido` já era. O SDL, o driver e o
report descriptor entram como **confirmação**, nunca como base — é a regra da
cor do plástico.

### 4.2 O que muda

**`cabo_evidencia`** — acrescentar ao fim do texto existente:

> · **REPRODUZIDO 29/08/2026, por um SEGUNDO decodificador**: `d4:2f:4b:00:00:d8`
> deu **0,9931 g ±0,0006** em 5001 relatórios de 20,0 s, e `44:46:48:00:00:03`
> deu **0,9960 g ±0,0013** em 5000 relatórios. Desta vez o fatiamento do report
> **não foi nosso**: a leitura saiu do nó `evdev` "Motion Sensors"
> (`ABS_X/ABS_Y/ABS_Z`), isto é, do report já fatiado, calibrado e publicado
> pelo `hid_playstation`. O E-4 lera os bytes crus do `hidraw` com os offsets
> escritos à mão; os dois caminhos, independentes, dão o mesmo 1 g dentro de
> 0,7%. Régua conferida de novo fora da conta: `EVIOCGABS` publica
> `res=8192` e `min/max=∓32768` (±4 g) para `ABS_X` nos dois nós, e
> `INPUT_PROP_ACCELEROMETER` está presente. Leitura pura, sem escrita, sem
> parar o daemon.

**`radio_evidencia`** — acrescentar ao fim:

> · **A TROCA DE BRAÇOS QUE FALTAVA, 29/08/2026**: o `44:46:48:00:00:03`, medido
> **no rádio** em 15/08 (0,9899 g ±0,0012), foi medido **no cabo** hoje
> (0,9960 g ±0,0013). **Δ = 0,006 g entre transportes, contra 0,032 g de
> dispersão entre unidades no próprio E-4** — o transporte é cinco vezes menor
> que a diferença entre aparelhos, e fica INOCENTADO como causa da leitura do
> acelerômetro, pela mesma forma de argumento que já inocentara o giroscópio.
> Isto FECHA o limite de desenho declarado na `radio_ressalva`.

**`cabo_ressalva`** — substituir o trecho *"E o `medido` desta célula é sobre o
APARELHO… continua `inferido-do-codigo`, de `core/evdev_reader.py:1781-1783`"*
por:

> E o `medido` desta célula é sobre o APARELHO: que o Hefesto não leia
> `ABS_X/Y/Z` para a interface é `inferido-do-codigo`, de
> `core/evdev_reader.py:2146` e `:2165` (o laço filtra só `ABS_RX/RY/RZ`) e de
> `daemon/sensor_hub.py:119` (monta só a chave `gyro`) — e foi **CONFERIDO ao
> vivo em 29/08/2026** na porta do daemon: `inputs` traz `buttons, gyro,
> l2_raw, lx, ly, r2_raw, rx, ry, speaker, touchpad`, sem `accel`, nos dois
> controles.

**`radio_ressalva`** — substituir o trecho *"Limite de desenho do E-4: nenhum
aparelho trocou de braço…"* por:

> Limite de desenho do E-4 **FECHADO em 29/08/2026**: o `44:46:48:00:00:03`
> trocou de braço (rádio em 15/08, cabo em 29/08) e a diferença por transporte
> ficou em 0,006 g, contra 0,032 g entre unidades. A atribuição ao transporte
> deixa de estar confundida com a atribuição às unidades.

**`cabo_codigo_ref` e `radio_codigo_ref`** — **CORREÇÃO DE FATO.** Hoje as duas
dizem `core/evdev_reader.py:1781-1783`, e **nessa linha está a docstring de
`find_dualsense_touchpad_evdev`** — o arquivo andou e a referência não. Trocar
por:

```
core/evdev_reader.py:2146, :2165; daemon/sensor_hub.py:119
```

**`estado_hoje`** — hoje vazio. Propor:

> ABERTA, e o que a segura NÃO é conhecimento: é decisão dela. Medido nos dois
> transportes (E-4, 15/08) e reproduzido por um segundo decodificador em
> 29/08, com troca de braços fechando a atribuição ao transporte. O caminho até
> a tela custa quatro degraus no MESMO nó, MESMO laço e MESMA thread que já
> alimentam o giroscópio — sprint escrita em
> `docs/process/sprints/2026-08-27-ONDA-CONTROLES-04-o-acelerometro-esta-no-mesmo-node.md`.
> Em 29/08 a LEITURA saiu do desenho da aba 02
> (`novo-layout/_ferramentas/aba02.py:6-40`) com uma premissa FALSA no texto de
> tela — *"o aparelho não o entrega"* — que esta célula desmente; o
> INTERRUPTOR de acelerômetro (D9) não foi afetado e continua na linha do
> controle.

**`provado_em`** — `2026-08-15` → `2026-08-29`.
**`provado_por`** — `aparelho` → `aparelho` (sem mudança; quem observou foi
instrumento, não olho dela).

**`nota`** — acrescentar:

> 29/08/2026: cruzamento de quatro frentes independentes (esta casa, SDL/Steam,
> Sony/HID, GitHub). Nenhuma coluna de proveniência subiu — o que era `medido`
> já era, e concordância de fonte externa entra como CONFIRMAÇÃO, nunca como
> base. O que mudou: a troca de braços (fecha a ressalva do rádio), um segundo
> decodificador independente (evdev contra hidraw), e a correção da
> `codigo_ref`, que apontava para a docstring do touchpad.

### 4.3 A célula que eu NÃO proponho mudar, e é a tentação

`movimento.imu.calibracao@dualsense` está `inferido-do-codigo` nos dois lados.
As frentes 2 e 3 mostraram que **SDL e kernel decodificam o feature `0x05` com
os 17 campos em offsets idênticos**, e a frente 3 parseou o blob real
versionado em `captures/dualsense_usb_feature_0x05_calibracao.bin` obtendo três
`range_2g` a menos de 0,1% de `2 × 8192`.

Isso é forte. **E mesmo assim não é `medido` desta bancada, hoje**: o blob é de
25/07, de unidade não identificada, e eu **não li o `0x05` dos controles
vivos**.

**O motivo não é falta de permissão — é o produto funcionando.** `/dev/hidraw5`
e `/dev/hidraw6` estão `crw------- root root`, e é o
`hefesto-hidraw-broker` que os deixa assim **de propósito, para esconder o
aparelho do jogo** (`scripts/ensaios/README.md:244-252`). Um `open()` direto ali
mede `EACCES`, não o aparelho. O caminho legítimo existe e é o que o E-4 usou:
`comum.abrir_no_hidraw`, pela porta do broker (`imu_no_cabo.py:28-36`), ou
parar o daemon. **Não fiz nem um nem outro** — a porta do broker é escrita de
`SCM_RIGHTS` que eu não precisava abrir para o alvo desta leva, e parar o
daemon é mexer na sua mesa.

Fica `inferido-do-codigo`, com a concordância do SDL entrando como confirmação.

---

## 5. O resto do mapa que estas quatro frentes destravam

Ordenado pelo que fecha mais por menos trabalho. **Recontagem minha**: com o
critério *"os DOIS lados `medido`"*, o mapa tem **258 linhas abertas** de 308
(o enunciado diz 249; declaro o meu critério para não propagar número que não
medi). Por família: plataforma 69, luz 37, áudio 32, combinação 21, movimento
19, vibração 18, energia 15, entrada 13, gatilho 13, toque 11, identidade 10.

| # | linha | o que estas frentes entregam | fonte | tamanho |
|---|---|---|---|---|
| 1 | `movimento.acelerometro@dualsense` | troca de braços + segundo decodificador + `codigo_ref` errada | minha medição de hoje | **texto de célula, zero bancada** |
| 2 | `movimento.imu.ligar@dualsense` | duas colunas sobem de `inferido-do-codigo` a `medido` **sem medir nada de novo** | o caderno já tem os dois ensaios (§5.1) | **duas células, zero bancada** |
| 3 | `plataforma.modo_relatorio@dualsense` | a linha está **inteira em branco**; as frentes 2, 3 e 4 acharam a resposta | §5.2 | uma linha, texto |
| 4 | `taxa_de_entrada.py:10-11` | fato caduco dentro de um instrumento | §5.3 | duas linhas de comentário |
| 5 | `movimento.acelerometro.jogo@dualsense` | offsets confirmados por 3ª engenharia (SDL) | §7.1 | texto de `evidencia` |
| 6 | `identidade.leitura_de_feature@dualsense` | o SDL diz, no fonte, que **ler feature LIGA o report estendido no rádio** | §5.2 | texto de `evidencia` |
| 7 | `luz.lightbar.cor@dualsense` | um **segundo** mecanismo de atraso no rádio, nunca escrito aqui | §5.4 | texto de `ressalva`, e uma pergunta aberta |
| 8 | `gatilho.*` e `audio.*` | o SDL **não tem API** para nenhum dos dois; é byte cru | §5.5 | contexto, não fecha célula |

### 5.1 `movimento.imu.ligar@dualsense` — o mais barato do mapa inteiro

Confirmei: a linha 193 tem `cabo_de_onde_sei` e `radio_de_onde_sei` =
`inferido-do-codigo`, com **`cabo_evidencia` vazia, `radio_evidencia` vazia e
`teste_que_morde` vazio**.

E o caderno de bancada já tem **dois ensaios, um por transporte**, em
`docs/data/ensaios.csv:127-128`:

- `imu-ligar-sem-comando-cabo` (2026-08-15T22:23:01) — 15013 e 15008
  relatórios com IMU saindo sem nenhuma escrita;
- `imu-ligar-sem-comando-radio` (2026-08-15T22:19:38) — 1586 amostras, com o
  acelerômetro em 0,9923 g na mesma janela.

Ambos com `resultado = "a IMU sai mesmo assim"` e brutos versionados. E o
`estado_hoje` da própria linha já diz, com o método: *"PERGUNTA FECHADA POR
BUSCA, 15/08/2026: NÃO existe, nesta árvore, código que tente ligar a IMU do
DualSense"*.

**Ponte:** duas células de `inferido-do-codigo` → `medido`, mais o texto das
duas evidências, transcrito do caderno. É o precedente da *graça da Tabela de
Roseta*, já aplicado em 15/08 à `radio_de_onde_sei` do próprio acelerômetro.

**Nota de método, e ela vale para o mapa inteiro:** a frente 1 cruzou os 178
ensaios do caderno contra as 308 linhas do mapa e achou **só três pares** com
ensaio guardado e coluna abaixo de `medido`: os dois acima, e
`audio.alto_falante@dualsense`/rádio — este com `resultado = inconclusivo`, e
por isso **corretamente** não promovido. **O transporte caderno→mapa está, no
resto, feito.** Isso é resultado: não há uma jazida de promoções baratas
esperando.

### 5.2 `plataforma.modo_relatorio@dualsense` — a linha em branco que ganhou dono

Conferi: `existe = desconhecido`, e **todas** as colunas de resposta vazias.

As três frentes externas convergiram na mesma resposta, e ela importa
diretamente ao acelerômetro:

- **SDL, lido no fonte** (`SDL_hidapi_ps5.c:415-439`): por Bluetooth o
  DualSense nasce emitindo um `0x01` **curto de 10 bytes, sem sensor nenhum**
  (`PS5SimpleStatePacket_t`). O comentário do próprio SDL diz que ler um
  feature report *"will also enable enhanced reports over Bluetooth"*, e em
  `:831`: *"We can't even send an invalid effects packet, or it will put the
  controller in enhanced mode."*
- **Kernel, lido no fonte local**: `hid-playstation.c:1594` recusa `0x01` no
  barramento BT (`"Unhandled reportID"`), e a probe lê `0x05`, `0x09` e `0x20`
  (`:1904`, `:1929`) antes de `ps_sensors_create` (`:1943`), **independente de
  transporte**.
- **dsremap** (comunidade, `https://dsremap.readthedocs.io/en/latest/reverse.html`):
  *"after GET_REPORT 0x20 it becomes 0x31"* — **AFIRMADO EM DOC, não
  confirmado no fonte do kernel**, e registro assim.

**A consequência para nós é boa e cabe nas regras desta leva:** o que liga o
report completo no rádio é uma **LEITURA**, não uma escrita. E o
`hid_playstation` já paga esse pedágio sozinho na probe — é por isso que o nó
"Motion Sensors" existe nos dois transportes, e por isso a medição de rádio de
15/08 conseguiu ler.

**É o padrão da cor do plástico invertido, a nosso favor.** Na cor, o rádio
**recusa** (`SET_FEATURE 0x80` → `HANDSHAKE 0x04`) e a assimetria é real. No
acelerômetro **não há assimetria**: o kernel já pagou.

**Proposta:** `existe = tem`, `cabo_de_onde_sei` e `radio_de_onde_sei` =
`inferido-do-codigo` (é leitura de fonte, não medição), com os endereços acima.

### 5.3 O fato caduco dentro do `taxa_de_entrada.py`

`scripts/ensaios/taxa_de_entrada.py:10-11` afirma, no cabeçalho:

> *"O acelerômetro **não aparece em célula medida nenhuma do mapa de
> canais**."*

**Derrubado.** `movimento.acelerometro@dualsense` está `medido` nos dois lados
desde a graça de 15/08. Regra da casa: fato errado se substitui, em todos os
lugares onde aparece.

E há mais nesse instrumento, e é o caso da cor se repetindo: **ele já sabe
contar o acelerômetro e ninguém o colheu.** `:103` define
`EIXOS_DO_ACELEROMETRO = {ABS_X, ABS_Y, ABS_Z}`, `:184-185` incrementa a
contagem, `:272` e `:287` publicam a coluna. **Não há bruto versionado dele**
em `docs/data/ensaios-brutos/` — o `2026-08-15-E2-taxa-dos-oito-nos.txt:22`
identifica outro autor (`taxa_no_hidraw.py`).

**Caso irmão, menor:** `scripts/ensaios/giro_e_buraco.py:187` define
`ABS_ACEL = (0x00, 0x01, 0x02)` com o comentário certo em `:184-186`, e **a
constante nunca é usada** — o ensaio lê o acelerômetro pelo `hidraw` e o
caminho evdev ficou escrito e morto.

**Não executei o `taxa_de_entrada.py`.** O `scripts/ensaios/README.md:241-275`
avisa que **com o daemon rodando ele mede o vpad, não o físico**, e parar o
daemon é mexer na sua mesa.

### 5.4 Lightbar no rádio — um segundo mecanismo, e não é o que investigamos

A frente 2 leu no fonte do SDL (`SDL_hidapi_ps5.c:710-717` e `:784-812`) uma
trava que ninguém aqui tinha escrito: o SDL **engole em silêncio** (`return
true` — diz "deu certo") qualquer pedido de cor por Bluetooth até que o
**carimbo de tempo do sensor** passe de `10200000` unidades de 0,33 µs, ou seja
**≈ 3,4 segundos** desde a conexão.

Isto é **outro** mecanismo, no mesmo transporte, com o mesmo sintoma da
investigação de dezesseis dias que você fechou em 12/08 (aquela terminou com a
Steam escrevendo no `hidraw`, que é outro ator). **Não afirmo que sejam a mesma
causa** — não há medição nenhuma ligando as duas.

E repare no acoplamento, que é o achado de verdade: **o portão da luz no rádio
depende do carimbo do SENSOR.** Se o report estendido não estiver ligado, o SDL
cai no `else` de `:800-803` e assume que completou. **Luz e acelerômetro estão
amarrados no mesmo código.**

### 5.5 Gatilho e áudio no SDL — a ausência é o achado

A frente 2 fez a busca e ela deu zero, o que é resultado:

- **Gatilho adaptativo:** os 22 bytes de `rgucRightTriggerEffect` /
  `rgucLeftTriggerEffect` aparecem **só na declaração da struct**
  (`SDL_hidapi_ps5.c:176-177`). O SDL **nunca escreve neles**. O único caminho
  é o cru, `SDL_SendGamepadEffect`, com o jogo montando o `DS5EffectsState_t` à
  mão. **Gatilho pela pilha SDL não é feature negociada — é byte cru.**
- **Áudio:** `ucHeadphoneVolume`, `ucSpeakerVolume`, `ucMicrophoneVolume`,
  `ucAudioEnableBits`, `ucAudioMuteBits` — **zero escritas** no arquivo
  inteiro. A única coisa de áudio que o SDL toca é a **luz** do microfone
  (`ucMicLightMode`, `:775-779`). Alto-falante, microfone e volume de fone não
  têm API no SDL.

Isso não fecha célula nenhuma, mas muda o que se pode esperar: nenhuma dessas
famílias vai ser destravada "adotando o que o SDL faz", porque o SDL não faz.

---

## 6. O que ninguém achou — dito com endereço

1. **A Sony não documenta.** As quatro frentes procuraram; não há
   especificação pública, não há página de desenvolvedor com o layout dos
   reports, não há SDK de PC. O que existe é engenharia reversa da comunidade e
   o driver do kernel — que **tem cabeçalho `Copyright (c) 2020-2022 Sony
   Interactive Entertainment`, e mesmo assim NÃO é documentação**: é fonte
   primária de *comportamento*, não de *contrato*. Tratá-lo como contrato seria
   o erro que esta casa cobra em toda parte.
2. **Por que o kernel zera o viés do giroscópio: não achado.** Duas frentes
   procuraram no histórico de commits do `torvalds/linux` e nenhuma trouxe
   resultado utilizável. **A CONSEQUÊNCIA está medida** (§2.3); o motivo, não.
3. **Não li o feature `0x05` dos controles vivos**, e portanto não fechei o
   viés de fábrica **por unidade** nesta bancada. `/dev/hidraw5` e
   `/dev/hidraw6` estão `crw------- root root` porque o **broker os esconde do
   jogo de propósito** (`scripts/ensaios/README.md:244-252`) — não é falta de
   permissão, é o produto funcionando. O caminho legítimo existe
   (`comum.abrir_no_hidraw`, pela porta do broker, como o E-4 fez) e eu não o
   abri.
4. **Não medi o rádio hoje.** Os dois controles estavam no cabo. O lado do
   rádio se apoia no E-4 de 15/08 e na troca de braços do `44:46:48`.
5. **Se o espelho `28de:11ff` da Steam esconde o giroscópio: não medido
   aqui.** Há duas issues do SDL **abertas** dizendo que sim —
   [#6068](https://github.com/libsdl-org/SDL/issues/6068) (*"actually hides a
   lot about the device, specifically the gyro data"*) e
   [#12997](https://github.com/libsdl-org/SDL/issues/12997) — e a régua desta
   casa diz que issue não é fato. **O ensaio que fecha é barato e de leitura:**
   com o Steam Input ligado, contar se o espelho tem nó com
   `INPUT_PROP_ACCELEROMETER` e `ABS_X/Y/Z`, como o `Motion Sensors` tem.
6. **Se o nosso vpad repassa os 22 bytes de gatilho adaptativo: não
   confirmado.** Ninguém abriu esse caminho.
7. **O que é o byte 31 do corpo do report: não sabemos.** O kernel chama de
   `reserved2` (`hid-playstation.c:308`), o SDL chama de `ucSensorTemp`
   (comentário `// 31`), e **nenhum dos dois o lê**. Uma fonte contra uma, sem
   desempate. Ele já viaja dentro da janela que o
   `core/physical_report_reader.py` copia — é um byte de graça, se um dia
   interessar. **O ensaio que decidiria:** registrar esse byte por 10 min
   enquanto o controle esquenta carregando; se subir monotonicamente com o
   calor, é temperatura. Leitura pura.
8. **Três fontes externas não abriram:** `controllers.fandom.com` devolveu
   HTTP 402 (paywall) para duas frentes, `patches.linaro.org` recusou conexão,
   e `Ryochan7/DS4Windows` — o repositório que o enunciado mandava abrir —
   **é 404** (`gh api repos/Ryochan7/DS4Windows`). Nenhuma afirmação deste
   documento se apoia nelas.
9. **Alvo secundário mal atendido, e assumo.** As frentes gastaram a leva no
   alvo principal porque ele **mudou de natureza no meio do caminho**:
   descobrir que a resposta já estava medida em casa e travada numa decisão sua
   vale mais que uma varredura rasa de oito famílias. As famílias
   `plataforma` (69 abertas), `luz` (37) e `audio` (32) continuam sem
   levantamento próprio. **A frente 1 mediu por que:** em
   `plataforma@dualsense`, as 23 linhas abertas são quase todas
   `inferido-do-codigo` sobre coisas do **nosso** lado (`plataforma.vpad`,
   `.adocao`, `.probe`, `.slot_jogador`, `.udev_autosuspend`, `.vigia_zumbi`,
   `.inventario`, `.mapeamento_posicao`). Fechá-las é **escrever teste que
   morde para código nosso**, não medir aparelho — trabalho grande, muitas
   sprints, e sem ensaio guardado esperando transporte.

---

## 7. O protocolo — as tabelas, com quantas fontes dizem cada número

Deixei por último de propósito: nada aqui muda o produto amanhã. Serve para
quem for executar.

### 7.1 Onde está o acelerômetro no report

Offsets **absolutos**, contados do byte 0 do buffer que o `hidraw` devolve (o
byte 0 é o report id):

| | report id | tamanho | corpo começa em | **giroscópio** | **acelerômetro** | carimbo |
|---|---|---|---|---|---|---|
| **CABO** | `0x01` | **64 B** | `data[1]` | 16..21 | **22..27** | 28..31 |
| **RÁDIO** | `0x31` | **78 B** | `data[2]` | 17..22 | **23..28** | 29..32 |

**A assimetria entre os transportes é de UM BYTE, e nada mais muda.**

Quantas fontes independentes dizem cada número:

| afirmação | fontes | quais |
|---|---|---|
| accel em `corpo[21..26]`, gyro em `corpo[15..20]` | **3 diretas + 1 indireta** | kernel local (`hid-playstation.c:295-316`) · SDL (`SDL_hidapi_ps5.c:84-102`, comentários de offset literais, lido por **três** frentes em separado) · medição E-4 desta casa (bruto versionado) · **indireta:** a gravidade fecha em 1 g pelos dois decodificadores (§3.2) |
| corpo em `data[1]` (cabo) / `data[2]` (rádio) | **3** | kernel (`:1579-1592`) · SDL (`:1625` e `:1636`) · E-4 |
| tamanhos 64 B e 78 B | **4** | kernel (`:140-147`) · SDL · report descriptor transcrito (`nondebug/dualsense`, `0x95, 0x4D` = 77+1) · E-4 |
| eixo é `Sint16` little-endian | **2** | kernel · SDL (`LOAD16`) |
| CRC-32 só no rádio, semente `0xA1` na entrada | **3** | kernel (`:136`) · SDL (`:1555-1580`: `0x01` entra sem conferência, `0x31` só com CRC) · nosso `core/physical_report_reader.py` |

**Nada a corrigir no mapa.** Os números que esta casa já tinha escritos batem,
byte a byte, com uma terceira engenharia independente.

### 7.2 As unidades, e a armadilha que esta casa já pagou

| | resolução | faixa | fontes |
|---|---|---|---|
| acelerômetro | **8192 LSB/g** | **±4 g** | kernel `DS_ACC_RES_PER_G`/`DS_ACC_RANGE` (`:226-227`) · SDL `ACCEL_RES_PER_G 8192.0f` (`:43`) · `EVIOCGABS` desta máquina (4 nós em 15/08, 2 hoje) |
| giroscópio (saída) | **1024 LSB/(°/s)** | ±2048 °/s | kernel (`:228-229`) · SDL `GYRO_RES_PER_DEGREE 1024.0f` (`:42`) · `EVIOCGABS` |

**CORREÇÃO DE FATO no enunciado desta leva** (a frente 2 pegou, confirmo):
a faixa do acelerômetro do DualSense é **±4 g**, não ±8 g. Os ±8 g são do
**Pro Controller** (`JC_IMU_ACCEL_RES_PER_G = 4096`), e estão corretamente na
linha 176 do CSV. **Não migrar para a linha do DualSense.** A própria linha do
Pro já traz o aviso: *"quem comparar eixos sem converter erra por 2× no
acelerômetro e ~14× no giroscópio"*.

**A armadilha do giroscópio, já achada e já curada aqui, para não ser
reproposta como descoberta:** `1024` é a resolução **DE SAÍDA**, depois da
calibração — **no fio o giro vale ~16,4 LSB por °/s**. Dividir o cru por 1024
encolhe a leitura em 62,5× e produz um "parado" falso. A cura está em
`scripts/ensaios/giro_e_buraco.py:38-52` e na nota datada de
`scripts/ensaios/imu_no_cabo.py:118-141`. **Resíduo conhecido:** o CSV bruto de
15/08 ainda traz o cabeçalho antigo `giro_x_dps` com valores pela régua velha;
o acelerômetro daquele bruto **não é afetado**, porque a régua dele é a mesma
antes e depois da calibração.

### 7.3 A armadilha de eixo, para quem executar a ONDA-CONTROLES-04

`ABS_RX/RY/RZ` significa **duas coisas diferentes em dois nós do mesmo
controle**:

- nó **gamepad** (`hid-playstation.c:823-827`): `ABS_RX`/`ABS_RY` = analógico
  direito, `ABS_RZ` = R2;
- nó **Motion Sensors** (`:1059-1064`): `ABS_RX/RY/RZ` = **giroscópio**, e
  `ABS_X/Y/Z` = **acelerômetro** (`:1051-1056`).

Nosso código já vive dos dois: `core/evdev_reader.py:1445` mapeia `ABS_RX→rx`
(nó gamepad) e `:2165` mapeia `ABS_RX→giro x` (nó motion). **Quem
implementar num laço genérico troca acelerômetro por analógico, e o teste
ingênuo não pega.**

### 7.4 A calibração — feature `0x05`, 41 bytes

Offsets no buffer, `int16` little-endian com sinal. **Kernel
(`hid-playstation.c:1176-1192`) e SDL (`SDL_hidapi_ps5.c:623-641`) são
idênticos nos 17 campos** — duas engenharias que não se copiaram:

| offset | campo |
|---|---|
| 1 / 3 / 5 | gyro pitch / yaw / roll **bias** |
| 7 / 9 · 11 / 13 · 15 / 17 | gyro pitch ± · yaw ± · roll ± |
| 19 / 21 | gyro **speed** + / − |
| 23 / 25 · 27 / 29 · 31 / 33 | acc X ± · Y ± · Z ± |

A frente 3 parseou os **bytes reais** de
`captures/dualsense_usb_feature_0x05_calibracao.bin` com esses offsets e obteve
`range_2g` = 16395 / 16379 / 16393 — **os três a menos de 0,1% de
`2 × 8192`**. Um layout errado não produz isso.

**A conta do acelerômetro é literalmente a mesma nos dois:**
`range_2g = plus − minus`; `bias = plus − range_2g/2`;
`sensibilidade = 2×8192 / range_2g`.

**Onde eles divergem, e é uma só coisa:** o **viés do giroscópio**. O SDL
subtrai o viés de fábrica (`:645-653`, aplicado em `:689`); o kernel **zera**
(`:1199-1213`, `bias = 0`) e joga o viés só no denominador. **Isto não é
divergência aberta nesta casa** — ver §2.3: o efeito está medido, registrado no
`estado_hoje` de `movimento.giroscopio@dualsense` desde 15/08, e reproduzido
hoje. **Três das quatro frentes trouxeram essa divergência como "NÃO
CONFIRMADO".** Ela estava fechada aqui há catorze dias, numa célula que
nenhuma delas abriu. É o padrão de sempre: *a casa sabe, e quem chega não
procura na célula certa.*

**Grade de sanidade do SDL, de graça como âncora** (`:667-680`): ele rejeita a
calibração se `|bias| > 1024` ou se a sensibilidade desviar mais de 50% do
esperado. Com os números desta bancada (`speed_2x = 1080`,
`sens_denom ≈ 17700`) a sensibilidade dá `≈ 62,5` contra `64,0` esperado —
**desvio de 2,3%. Os quatro controles desta casa passam com folga.**

**Divergência de robustez, registrada:** o SDL **não confere o CRC do feature
`0x05` no rádio** (`:597-604`, só valida tamanho ≥ 35). O kernel confere
(`:1169`, semente `PS_FEATURE_CRC32_SEED 0xA3` em `:137`) e **este produto
também** (`tests/unit/test_read_calibration.py::TestReadCalibration::test_bt_com_crc_corrompido_vira_none`).
**O SDL é a fonte mais frouxa das três.**

### 7.5 O Steam Input ceifa a faixa pela metade

[Documentação da Valve](https://partner.steamgames.com/doc/api/isteaminput),
`InputMotionData_t`, literal:

> *"Positional acceleration is reported as an interpolated value between
> INT16_MIN and INT16_MAX where the extents are **clamped to ±2G**"*

O DualSense entrega **±4 g**. Um jogo que leia movimento pela API da Steam
**não distingue 2 g de 4 g** — gesto amplo satura. Pelo SDL/HIDAPI ou pelo
evdev do kernel, a faixa inteira chega.

**Para um produto de acessibilidade isso é material:** o gesto amplo, que é
justamente o que alguém com controle motor reduzido pode precisar amplificar,
é o que satura primeiro. **UMA fonte só** (a doc da Valve) — não há medição
desta casa, e a linha do mapa que registrar isso tem de dizê-lo.

A mesma doc avisa de outra pegadinha: a Steam entrega o dado **na orientação do
hardware**, não na de quem segura. O `SDL_sensor.h:87-126` resolve declarando
os eixos *"com o controle à sua frente"*: acelerômetro em **m/s² incluindo a
gravidade**, giroscópio em **rad/s**.

### 7.6 Não usar o `pydualsense` para acelerômetro — duas frentes, o mesmo diagnóstico

`.venv/lib/python3.12/site-packages/pydualsense/pydualsense.py`, versão 0.7.5,
lida em separado pelas frentes 3 e 4, com a mesma conclusão:

- **Defeito 1 — accel e gyro trocados de nome**, nos dois transportes:
  `:350-359` lê `inReport[16..21]` como `accelerometer` (é o **giroscópio**) e
  `:361-369` lê `inReport[22..27]` como `gyro` (é o **acelerômetro**).
- **Defeito 2 — no Bluetooth, tudo desloca um byte**: `:287` cria
  `states = list(inReport)[1:]` para BT, mas as linhas 336-370 indexam
  `inReport` **cru**. Botões saem certos (usam `states`); accel, gyro e
  touchpad saem um byte adiantados — **vira lixo, não fica só trocado**.

Corroborado por [flok/pydualsense#43](https://github.com/flok/pydualsense/issues/43),
**aberta**, com o mesmo diagnóstico vindo de um usuário
(**AFIRMADO EM ISSUE**, não verificado no fonte por ninguém aqui).

**Consequência:** `core/backend_pydualsense.py` não ter **uma única** menção a
`accel` (conferi: `grep -c -i accel` = 0) **não é lacuna a preencher copiando a
biblioteca** — copiar importaria os dois defeitos. Foi, por acidente, a decisão
certa. E o caminho de motion do Hefesto **não passa por lá** de qualquer forma:
passa pelo `core/physical_report_reader.py` (que acerta o `base` por
transporte) e pelo `evdev`.

**Risco registrado, não medido:**
[flok/pydualsense#66](https://github.com/flok/pydualsense/issues/66),
**aberta**, relata em Linux que um script mínimo `init()`/`sleep(60)`/`close()`
basta para o controle parar de responder por Bluetooth. É o tipo de disputa de
`hidraw` que esta casa já conhece.

---

## 8. Correções de fato que esta leva produziu

Escritas juntas porque a regra é substituir em todos os lugares, não só onde
foi notado.

| # | onde | dizia | é |
|---|---|---|---|
| 1 | `novo-layout/_ferramentas/aba02.py:820-823` (+ 4 no HTML gerado) | *"o aparelho não o entrega — nem pelo cabo, nem pelo rádio"* | o aparelho entrega, medido nos dois; **o produto** é que não lê |
| 2 | `scripts/ensaios/taxa_de_entrada.py:10-11` | *"o acelerômetro não aparece em célula medida nenhuma do mapa"* | está `medido` nos dois lados desde 15/08 |
| 3 | `mapa-controles.csv:175`, `cabo_codigo_ref` e `radio_codigo_ref` | `core/evdev_reader.py:1781-1783` | ali está a docstring de `find_dualsense_touchpad_evdev`; o certo é `:2146`, `:2165` e `sensor_hub.py:119` |
| 4 | enunciado desta leva | acelerômetro do DualSense com ±8 g | **±4 g**; os ±8 g são do Pro (linha 176) |
| 5 | enunciado desta leva | `core/backend_pydualsense.py` | o caminho é `src/hefesto_dualsense4unix/core/backend_pydualsense.py` (a afirmação estava certa: zero menções a `accel`) |
| 6 | enunciado desta leva | *"o driver menciona accel 73 vezes"* | **74 linhas, 77 ocorrências** (`grep -c` conta linhas) |
| 7 | enunciado desta leva | *"249 das 308 não estão fechadas"* | pelo critério *"os dois lados `medido`"* dá **258**; declaro o meu para não propagar número que não medi |
| 8 | frentes 2, 3 e 4 | o viés do giroscópio kernel×SDL é divergência em aberto | fechado nesta casa em 15/08 (`movimento.giroscopio@dualsense`, `estado_hoje`), com o efeito medido em 0,19–1,53 °/s por unidade, e reproduzido hoje |

---

## 9. A ordem que eu recomendo

1. **Trocar a frase falsa da aba 02** e levar a decisão de volta a você com a
   premissa certa. *Uma edição de texto.* Destrava a única linha `so-ela-decide`
   do mapa inteiro.
2. **`movimento.imu.ligar@dualsense` → `medido`/`medido`**, transcrevendo o
   caderno. *Duas células, zero bancada.*
3. **Atualizar a célula do acelerômetro** conforme §4.2 — com a troca de
   braços, o segundo decodificador e a `codigo_ref` corrigida. *Texto de
   célula.*
4. **Se você disser "pode aparecer": executar a ONDA-CONTROLES-04.** Quatro
   degraus, sprint escrita, `GyroBars` e stub prontos.
5. **Colher o `taxa_de_entrada.py`** com o daemon parado, gerando bruto
   versionado. Fecha a taxa do acelerômetro nos dois transportes. *Precisa de
   janela na sua mesa.*
6. **Abrir a linha do viés do giroscópio** (§2.3) — só se você quiser. O dado
   para corrigir está no aparelho e o produto já sabe pedi-lo.

---

## 10. Anexo — como reproduzir as medições de hoje

Leitura pura, sem escrita, sem parar o daemon, sem `sudo`.

**Os nós:** `/dev/input/event30` (`44:46:48:00:00:03`) e `/dev/input/event258`
(`d4:2f:4b:00:00:d8`), ambos `… DualSense Wireless Controller Motion Sensors`,
`bustype = 0x03` (USB), `INPUT_PROP_ACCELEROMETER` presente.

**A conta:** somar os eventos `EV_ABS` de `ABS_X/Y/Z` até cada `SYN_REPORT`,
dividir cada eixo por `absinfo(ABS_X).resolution` (o nó publica 8192), e tirar
o módulo. Média e desvio sobre a janela inteira. Para o giroscópio, o mesmo com
`ABS_RX/RY/RZ` e `resolution = 1024`.

**A régua é absoluta:** com o controle parado, o módulo do vetor **tem** de dar
1 g, seja qual for a pose. As duas passagens de hoje pegaram poses diferentes
do mesmo aparelho (deitado e de lado) e deram o mesmo módulo — que é
exatamente o que faz da gravidade uma régua e não uma coincidência.

**A porta, declarada — e por que ela não é a do E-4.** O `imu_no_cabo.py` diz,
no cabeçalho (`:28-36`), *"não é evdev de propósito: o co-op faz `EVIOCGRAB`
nos evdev físicos, que é exclusivo"*. Eu usei evdev mesmo assim, e a leitura
**não está comprometida** — a prova está no próprio número: **5000 e 5001
relatórios em 20,0 s = 250,0 Hz**, que é exatamente a taxa do cabo. Um nó sob
grab devolveria **zero** eventos, não 250 Hz. O `EVIOCGRAB` do co-op cai no nó
de **gamepad**, não no de **Motion Sensors** — e tinha de ser assim, porque o
próprio `MotionSensorReader` do daemon lê esse nó ao mesmo tempo que eu li.
Portanto: as duas portas são legítimas e medem coisas diferentes. O E-4 mediu
**os bytes que o aparelho põe no fio**; eu medi **o número que o kernel entrega
a quem consumir** — que é justamente o caminho que a ONDA-CONTROLES-04 usaria.

**A porta do daemon:**
`from hefesto_dualsense4unix.app import ipc_bridge; ipc_bridge.daemon_state_full()`
— as chaves de sensor vivem em `controllers[*].inputs`.

**Endereços com máscara da casa** (octetos 4 e 5 zerados), como manda o
`CLAUDE.md`.
