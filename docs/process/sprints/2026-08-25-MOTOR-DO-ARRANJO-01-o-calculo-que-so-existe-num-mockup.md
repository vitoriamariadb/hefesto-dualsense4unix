---
sprint: MOTOR-DO-ARRANJO-01
estado: aberta
posse:
  # O motor e o censo. Traduzido em 25/08/2026 do bloco em prosa da §9, que
  # `check_colisao_de_sprints.py` não conseguia ler — o formato dele é o
  # frontmatter, e sem isto `despachar-agente.sh` recusa criar a árvore.
  # SEPARADO em duas mãos em 25/08/2026: eram um bloco só, e dois agentes na
  # mesma posse se atropelam (R1). O motor e o censo não dividem um arquivo.
  G4:
    - src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py
    - tests/unit/test_arranjo_da_mesa_bate_com_o_mockup.py
    - tests/unit/test_arranjo_invariantes.py
  G7:
    - src/hefesto_dualsense4unix/integrations/censo_do_gabinete.py
    - tests/unit/test_censo_do_gabinete.py
    - install.sh
  # A MOTOR-5 é a ÚNICA parte desta sprint que abre `app/`, e só para
  # IMPORTAR. Os dois arquivos são de MAPA-C (Frente A) e da Frente C: a
  # colisão é REAL, está declarada, e o `depois_de` a serializa em vez de
  # proibi-la. Se a MOTOR-5 precisar de mais que o import, ela RELATA (R1).
  MOTOR-5:
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
cria:
  # MEDIDO em 25/08/2026: o motor e os dois testes dele JÁ NASCERAM (commit
  # da madrugada). O que continua sem existir no disco é o censo do gabinete
  # — a MOTOR-7, que é o pedido dela para o install e não virou código.
  - src/hefesto_dualsense4unix/integrations/censo_do_gabinete.py
  - tests/unit/test_censo_do_gabinete.py
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/core/
  - src/hefesto_dualsense4unix/gui/main.glade
  - docs/data/mapa-controles.csv
depois_de:
  # A faxina de 27/08 apagou daqui: CONEXOES-MAPA-2D-01. Para onde cada uma foi, veja 2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md.
  # 06/09/2026 — a GTK-3 mexe no `install.sh`, no `packaging/` e em
  # `app/app.py`/`app/main.py` ANTES desta. Serializado pelo orquestrador
  # das 24 horas; a janela sai primeiro, o id migra depois.
  - GTK-3
bancada: false
---

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.7 — espera a `D-QUAL-REGUA-MANDA-NO-ARRANJO`, que é dela.

# MOTOR DO ARRANJO-01 — o cálculo que só existe num mockup

**25/08/2026. GRAU: MEDIDO** onde a linha traz âncora; **DESENHO** onde diz.

**Índice:** [SPRINT_ORDER §0.13](../SPRINT_ORDER.md) — a aba Conexões.

**Por que ela nasce.** As quatro sprints da aba Conexões descrevem a **tela**.
Nenhuma descreve o **motor**: o cálculo que decide o arranjo, reconhece o que
mudou de lugar e distribui os controles entre os adaptadores. Ele existe, está
testado, e mora só em
[`2026-08-24-ABA-CONEXOES/mockup/mapa-das-portas.html`](2026-08-24-ABA-CONEXOES/mockup/mapa-das-portas.html)
— **1058 linhas de lógica**, mais que qualquer uma das quatro.

**O pedido dela, no último turno de 24/08:** *"se conseguirmos implementar essas
melhorias todas que fizemos aqui e adicionarmos na interface gui a mesma lógica,
será perfeito. Tipo com as sprints materializadas e tudo mais."* **Esta sprint é
a "mesma lógica".**

---

## 1. O defeito, em uma frase

**O produto sabe calcular o melhor arranjo da mesa, e esse conhecimento está em
JavaScript, dentro de um mockup — a GUI não tem uma linha dele.**

## 2. O que está medido

### 2.1 O motor existe e passa em 29 estados

```bash
$ node docs/process/sprints/2026-08-24-ABA-CONEXOES/mockup/fumaca.js
29/29 estados pintaram  — nenhum erro de execução
```

Cobre os quatro modos, as quatro variantes, os cinco aparelhos na mão, os três
perfis, 1 a 4 controles, as duas leituras, a **mesa vazia** e o **mapa com
entrada inexistente**.

### 2.2 A GUI não tem nada disso

```bash
$ grep -rn "planejar\|melhor arranjo\|ordem de serviço" src/hefesto_dualsense4unix/ | wc -l
0
```

### 2.3 O que se perde sem esta sprint

O mockup estava em `novo-layout/`, que é `.gitignore:108`. Um `git clean -xdf`
apagava o motor inteiro. **Isso já foi consertado** — ele está versionado em
`2026-08-24-ABA-CONEXOES/mockup/` — mas HTML não é produto: enquanto não houver
módulo Python, a aba continua sem cálculo nenhum.

## 3. O modelo, e ele é a virada

**O mapa NÃO guarda "a entrada 9 tem um Bluetooth". Guarda "a entrada 9 **é** o
caminho `3-1.2`".**

```
MAPA     : entrada -> caminho de barramento   (declarado UMA vez)
LEITURA  : aparelho -> caminho                (medido AGORA, do sysfs)
alocação : entrada -> aparelho                (DERIVADO: junta os dois)
```

**Por que isto importa mais que parece.** Quando alguém troca um aparelho de
lugar, o **caminho** dele muda e o **serial** não. Com o modelo antigo o mapa
ficava mentindo; com este, o produto reconhece sozinho quem foi para onde, sem a
pessoa declarar nada de novo. É a diferença entre um mapa que envelhece e um que
se mantém.

**Medido em 24/08** — a mesma máquina, duas leituras com 1h50 de intervalo:

| aparelho | 21h | 22h50 | reconhecido? |
|---|---|---|---|
| Wi-Fi | `4-1.1.2` | `4-2` | entrada não declarada |
| teclado | `3-1.4` | `1-3` | **sim, entrada 1** |
| 3º Bluetooth | `3-3` | `3-1.1.1` | entrada não declarada |
| webcam | `3-4` | `1-4` | entrada não declarada |
| mouse | `1-3` | `1-6` | entrada não declarada |

**E o não-reconhecido também ensina:** ela declarou 8 das 16 entradas — só as
que tinham algo. Quem move para uma entrada nunca declarada some do mapa. É o
argumento medido para **declarar as entradas vazias também**, e vira a MOTOR-6.

## 4. As tarefas

### MOTOR-1 — o módulo puro nasce

`src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py` (novo). **Sem GTK, <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
sem IPC, sem `/dev`, sem `subprocess`.** Recebe dado, devolve dado:

```python
def alocacao(mapa: Mapa, leitura: Leitura) -> dict[str, str]
def regiao_do_caminho(caminho: str, caminho_do_hub: str | None) -> str | None
def planejar(mesa: Mesa, op: Opcoes) -> Plano
def receita(mesa: Mesa, op: Opcoes) -> list[Movimento]
def julgar(entrada: Entrada, na_mao: str, mesa: Mesa) -> Veredito | None
def reexame(antes: Leitura, agora: Leitura, mapa: Mapa) -> list[Mudanca]
def plano_dos_controles(controles, adaptadores) -> PlanoDosControles
```

**A mordida.**
`tests/unit/test_arranjo_da_mesa_bate_com_o_mockup.py::test_a_receita_e_a_mesma_do_javascript` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
<!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— roda o mockup em `node` sobre as fixtures de 24/08, roda o Python sobre as
MESMAS, e afirma que as duas receitas são idênticas, movimento a movimento.
Arrancada qualquer regra da tabela do §5, as duas divergem e o teste imprime as
duas listas lado a lado. **É o teste que torna "a mesma lógica" verificável em
vez de prometida.**

**Prova de tela:** cosmética pré-aprovada (é módulo, não tela).

### MOTOR-2 — as invariantes que já mordem no mockup

Quatro, e cada uma nasceu de um defeito real da noite de 24/08:

| invariante | o defeito que ela mata |
|---|---|
| **ponto fixo** — aplicar o plano e replanejar dá **zero** movimentos, nas quatro variantes | o plano que se contradiz a cada clique |
| **mapa = receita** — todo aparelho cuja entrada do plano difere da atual ESTÁ na receita | o mapa desenhava a mudança e a receita não a mandava |
| **só melhora vira movimento** — `ganho <= 0` não entra, salvo movimento forçado por terceiro | mandava mexer no cabo do hub e no mouse à toa |
| **intercambiável fica** — aparelhos de mesma classe E mesmo modelo não trocam entre si | mandava trocar dois UB500 idênticos entre a 9 e a 15a |

**A mordida.** Um teste por invariante, sobre a mesa dela e sobre a mesa vazia.
Arrancar o bônus de ficar parado faz a receita saltar de **5 para 7** movimentos
e o teste reprova nomeando os dois inúteis.

**Prova de tela:** cosmética pré-aprovada.

### MOTOR-3 — as quatro variantes, com o preço em palavra

`O melhor no papel` · `Mexendo o mínimo` · `Sem o extensor` · `Sem usar o hub`.
Cada uma devolve, junto do plano, **o que se perde** — em frase, nunca em
pontos. *"437 pontos pior"* não diz nada a ninguém; *"os dongles ficam na altura
da mesa, não no alto do rack"* diz.

**Por que quatro e não uma:** pedido dela, literal — *"imagina que alguma delas é
limitada por fio, ou coisas do gênero, eu gostaria de tentar outras"*. E o
`Sem usar o hub` é o caso do **notebook**, que é boa parte do público.

**A mordida.** `::test_a_variante_declara_o_que_perde` — para cada variante cujo
plano difere do melhor, a lista de consequências é NÃO VAZIA. Arrancada a cura,
a tela oferece quatro escolhas e não diz a diferença entre elas.

**Prova de tela:** precisa-do-olho-dela-antes (texto novo).

### MOTOR-4 — os controles, e o rebalanceio que quase nunca manda mexer

A conta é medida (`daemon/subsystems/bt_mic.py`, A/B de 25/07/2026): **1600**
vezes de falar por segundo por adaptador; **260,4** sem microfone, **276,7** com.
Gatilho, vibração, barra de luz, giroscópio e touchpad andam no **mesmo canal
HID** — não somam pacote.

O produto sabe onde cada controle está: o `HID_PHYS` do uevent do hidraw publica
o MAC do adaptador (`broker/hidraw_broker.py:281`), e abre como uid 1000, **sem
sudo**.

**A regra que salva o conselho:** parte-se de onde cada controle JÁ está, e só se
move alguém quando isso **baixa a carga do adaptador mais cheio**. Trocar custa
caro de verdade — desfazer o pareamento, apagar o cache SDP e parear de novo, com
o controle na mão. Sem esta regra o plano mandava trocar **três** controles entre
dongles idênticos, sem ganho; com ela, manda **um**.

**A mordida.** `::test_ninguem_troca_de_adaptador_sem_baixar_o_pico` — quatro
controles em dois adaptadores equilibrados: zero movimentos. Os quatro no mesmo
dongle: exatamente **dois**. Arrancada a cura, o primeiro caso passa a mandar
mover e o teste reprova imprimindo a carga antes e depois.

**Prova de tela:** cosmética pré-aprovada.

### MOTOR-5 — a aba consome, e não recalcula

`app/actions/config/secao_mesa.py` e `secao_orcamento.py` importam o módulo. **A
aba não pode ter uma segunda cópia da regra** — duas verdades sobre a mesma coisa
é o defeito que esta leva inteira existe para matar.

**A mordida.** Varredura AST: nenhum arquivo de `app/` define função que decida
arranjo, nota de entrada ou destino de controle. Arrancada a cura (recolocando a
conta na aba), o portão reprova nomeando arquivo e função.

**Prova de tela:** cosmética pré-aprovada.

### MOTOR-6 — declarar as entradas VAZIAS também

Medido no §3: com 8 de 16 entradas declaradas, **quatro dos cinco aparelhos que
ela moveu ficaram sem lugar no mapa**. Entrada vazia não tem caminho para gravar,
então declarar exige um gesto: *"plugue qualquer coisa nesta entrada e eu
aprendo"*.

**Isto é DESENHO, e ela recusou o assistente de plugar** (`D-GESTO-DO-MAPA`, que
escolheu clique-em-clique). **A pergunta vai para ela na §7**, não se resolve
aqui.

**Enquanto não houver decisão**, o produto faz o que já sabe fazer e é honesto: a
região é deduzida do barramento (quem pende do hub está no hub), o aparelho
aparece na faixa da face certa, e só as entradas daquela região acendem. De 16
candidatas para 7. **Isso é dedução, não chute**, e já vale sem decisão nenhuma.

## 5. A tabela de notas — a regra inteira, para não ter de ler o JavaScript

Cada entrada ganha uma nota por aparelho; ele vai para a de maior nota.
`+1` de bônus para a entrada em que ele já está — só desempata, nunca vence uma
escolha melhor.

| aparelho | condição | nota | selo | por quê |
|---|---|---|---|---|
| teclado | entrada direta do PC | **+100** | especificação | hub externo nem sempre é ligado pelo firmware, e sem teclado não se entra na BIOS |
| teclado | na face mais perto | +20 | derivado | — |
| teclado | vizinha é rádio | −30 | especificação | dois receptores de 2,4 GHz encostados se atrapalham |
| Wi-Fi | entrada direta do PC | **+100** | especificação | o tráfego dele em 5 Gbps é o que vira ruído para os dongles do mesmo hub |
| Wi-Fi | entrada azul | +40 | derivado | mantém a velocidade |
| Bluetooth | no hub | +60 | derivado | no alto do rack, antena acima da linha das cabeças |
| Bluetooth | na ponta do extensor | +25 | derivado | a antena mais longe das outras |
| Bluetooth | hub com Wi-Fi em SuperSpeed | **−120** | especificação | ruído de banda larga em cima de 2,4 GHz |
| Bluetooth | vizinha é rádio | −45 | especificação | — |
| Bluetooth | separação até o irmão mais próximo | +6 por posição, teto 6 | especificação | — |
| mouse | direta do PC / entrada preta | +40 / +10 | derivado | não usa a azul |
| mouse | vizinha é rádio | −40 | especificação | — |
| webcam | entrada preta | +12 | derivado | não usa a velocidade da azul, e a azul faz falta a quem usa |
| hub | direta do PC / azul | +40 / +20 | derivado | não pode pendurar em si mesmo |

**O selo não é enfeite:** ele é a coluna `de_onde_sei` do mapa de canais, na
tela. Cada ordem de serviço mostra os três graus — `medido aqui`, `derivado da
conta`, `especificação de terceiro` — e é o que impede raciocínio de se vestir
de medição. Decisão dela: `D-ORDEM-DE-SERVICO`.

## 6. O que esta sprint NÃO faz

- **Não desenha tela.** O mapa 2D é da `CONEXOES-MAPA-2D-01`, a ordem de serviço
  é da `ORDEM-DE-SERVICO-01`, o texto é da `CONFIGURACOES-O-LEXICO-01`.
- **Não mede bateria.** É a `O-PRECO-EM-BATERIA-01`.
- **Não decide o gesto** de declarar entrada vazia — §7.
- **Não lê o sysfs.** Quem lê é `integrations/mesa_de_radio.py`; este módulo
  recebe o que ela leu, e é isso que o torna testável sem hardware.

## 7. Como o produto aprende uma entrada VAZIA — RESOLVIDO, 25/08

A pergunta parecia precisar dela. Não precisava: **eram duas necessidades
diferentes, misturadas numa só.**

| para… | precisa de… |
|---|---|
| **desenhar** o mapa | só de **quantas entradas cada face tem**. Zero caminhos. |
| **reconhecer** um aparelho movido | do caminho — e **só das entradas que de fato recebem alguma coisa** |

**Entrada que nunca recebe nada nunca precisa de caminho, e desenha bem.**

### 7.1 O que fica declarado: três números

*"A frente tem 2, a traseira tem 6, o hub tem 7."* Só isso. E talvez nem isso —
ver §7.4.

### 7.2 O resto se aprende no momento em que passa a ser necessário

Quando um aparelho aparece num caminho desconhecido, o produto já sabe muito.
**Medido na mesa dela em 24/08**, com 8 de 16 entradas declaradas:

```
Bluetooth  3-1.1.1  → região hub →  4 candidatas de 16   [10 12 14 15]
Wi-Fi      4-2      → região pc  →  4 candidatas de 16   [2 3 7 8]
Webcam     1-4      → região pc  →  4 candidatas de 16   [2 3 7 8]
Mouse      1-6      → região pc  →  4 candidatas de 16   [2 3 7 8]
```

**De 16 para 4 sem ela declarar nada** — a região sai do barramento (quem pende
do hub está no hub), e as entradas já ligadas se eliminam. Se sobrar UMA, o
produto liga sozinho e avisa; se sobrar mais, mostra só as candidatas.

### 7.3 E há um momento com ZERO pergunta: o "Já movi"

O produto acabou de mandar *"mova o Wi-Fi para a entrada 3"*. Ela move e aperta
o botão que **já existia na tela por outro motivo**. O produto vê o Wi-Fi num
caminho novo e pergunta uma coisa só:

```
Vi que o Wi-Fi mudou de lugar.
Você o pôs na entrada 3, como eu sugeri?     [ Sim ]  [ Não, na ___ ]
```

**A confirmação da ordem de serviço É o gesto de ensinar.** Um toque no caso
comum, e nenhuma tela nova.

**Por que perguntar em vez de presumir:** o produto não vê o soquete. Se ela
puser noutra entrada e ele presumir a que sugeriu, o mapa aprende uma mentira —
e mapa que mente é pior que mapa vazio.

### 7.4 A fonte que pode matar até os três números

**SMBIOS/DMI tipo 8** — *"Port Connector Information"* — é onde o fabricante
nomeia os conectores externos. **Medido em 25/08 nesta máquina: a tabela existe e
tem 18 entradas** (`ls /sys/firmware/dmi/entries/ | grep '^8-'`).

Ela dá o **inventário** ("esta placa tem N conectores USB, destes tipos"), **não**
a ligação com o caminho de barramento. Ou seja: mata a digitação da §7.1 e não
mata o aprendizado da §7.2 — que é exatamente a divisão certa.

**O acesso custa root uma vez:** `/sys/firmware/dmi/tables/DMI` é `400 root`. O
produto já instala helper privilegiado (`sudo` uma vez no install, botão sem
senha depois), então ler isso no install é de graça.

**NÃO MEDIDO:** o que a tabela 8 desta placa realmente traz nos campos
*External Reference Designator*. Um comando resolve, e é da bancada dela:
`sudo dmidecode -t 8 | grep -A2 'Port Connector'`.

### 7.5 A tarefa que isto vira

**MOTOR-6** (substitui a versão anterior): o mapa passa a ter **contagem por
face** separada da **ligação por caminho**. A contagem vem, em ordem de
preferência: do DMI tipo 8 se ele responder, senão dela em três números. A
ligação nasce vazia e se preenche sozinha, pela §7.2 e pela §7.3.

**A mordida.** `::test_entrada_vazia_desenha_sem_caminho` — face declarada com 6
entradas e nenhuma ligada: o mapa desenha as 6, e `candidatas("pc")` devolve as
6. Arrancada a cura, entrada sem caminho some do desenho e a pessoa vê um
gabinete com menos buracos do que ele tem. E
`::test_a_confirmacao_da_ordem_liga_a_entrada` — dada uma ordem "mova X para a
entrada N", um "Já movi" e uma leitura nova, o mapa passa a ter `N → caminho
novo` **só se a confirmação for positiva**; num "Não", ele pergunta e não grava.

### MOTOR-7 — o INSTALL faz o trabalho sujo, e a pessoa não digita nada

**Pedido dela, em 25/08:** *"manda isso tudo pro nosso install viu. não podemos
deixar isso passar. a ideia é que o install faça o trampo sujo todo pro user
sempre ter facilidade"*. É a regra desta casa já escrita —
[toda cura entra no install, sem flag](../../data/decisoes-dela.csv) — aplicada
ao censo do gabinete.

**O que só o install consegue, e por quê.** As duas fontes de firmware que
descrevem o gabinete são `400 root`:

```
/sys/firmware/dmi/tables/DMI        400 root   ← a tabela 8 mora aqui
/sys/firmware/dmi/entries/8-*/raw   400 root
```

Medido em 25/08 nesta máquina: **a tabela 8 existe e tem 18 entradas**
(`ls /sys/firmware/dmi/entries/ | grep -c '^8-'`), e o binário está presente
(`/usr/sbin/dmidecode`). O install roda como root **uma vez**; a GUI nunca
precisa de senha.

**A tarefa.** `install_censo_do_gabinete_host()` em `install.sh`, no molde de
`install_bt_ponte_privilegiada_host()` (`install.sh:1189`). Ela:

1. lê `dmidecode -t 8` e extrai, por conector: *tipo de porta*, *External
   Reference Designator* e *Internal Reference Designator*;
2. lê o que **não** precisa de root e o install já tem à mão de graça — o
   `physical_location` de cada entrada e o `connect_type` de cada soquete
   (medido: `hotplug` no barramento 1 e 2, `unknown` no 3 e 4 desta placa);
3. grava tudo em `~/.local/state/hefesto-dualsense4unix/gabinete.json`, que é a
   mesma pasta onde o install já escreve para o app (`install.sh:972`, `:2943`).

**A GUI então abre com o gabinete JÁ DESENHADO** — as faces e a contagem vêm
do firmware, e ela só confirma. Os três números da §7.1 deixam de ser digitados.

**O que a tarefa NÃO pode presumir**, e é metade dela: **muitas placas preenchem
a tabela 8 com lixo ou não a preenchem.** O censo tem de sair com grau em cada
campo — `lido do firmware` ou `não respondeu` — e a aba tem de funcionar
inteira com o censo vazio, caindo nos três números da §7.1. **Firmware é fonte,
nunca premissa.**

**A mordida.**
`tests/unit/test_censo_do_gabinete.py::test_placa_sem_tabela_8_nao_inventa_gabinete` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
<!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— com uma saída de `dmidecode` vazia, o censo grava `{"faces": [], "de_onde_sei":
"nao-respondeu"}` e **não** um gabinete de mentira; a aba abre pedindo os três
números. Arrancada a cura, o censo inventa uma traseira padrão e a pessoa vê um
gabinete que não é o dela — que é pior que nenhum, porque ela confia.
E `::test_o_que_o_firmware_disse_vem_com_selo` — todo campo do `gabinete.json`
carrega `de_onde_sei`, e nenhum sai sem.

**E o ciclo que prova**, como manda a casa: `uninstall` → `install --yes` num
`HOME` limpo termina com o `gabinete.json` no lugar e a aba abrindo com o
gabinete desenhado — ou, se o firmware calou, abrindo e dizendo que calou.

### MEDIDO em 25/08/2026 — a BIOS desta placa MENTE sobre o gabinete

Rodado com `pkexec dmidecode -t 8` na MeowSystem (Gigabyte B450M S2H). **A
tabela tem 18 entradas e cinco delas são USB**, com conteúdo de verdade — não
`Not Specified`:

```
J1500 -> USB 3.0      J1503 -> USB 3.0
J1501 -> USB 3.0      J1504 -> USB 3.1
J1502 -> USB-C
```

**E não descreve esta máquina.** Três contagens da mesma coisa, e as três
divergem:

| fonte | conta | root? |
|---|---|---|
| BIOS, DMI tipo 8 | **5** conectores USB | sim |
| ela, na foto numerada | **8** externos (2 frente + 6 traseira) | — |
| kernel, `maxchild` por barramento | **22** soquetes (`usb1`=10, `usb2`=4, `usb3`=4, `usb4`=4) | não |

Dois defeitos no dado do fabricante, medidos:

1. **Subconta**: declara 5 onde a placa entrega 8 externos.
2. **Declara um `USB-C`** que a traseira desta placa não tem — é o gabarito
   genérico do fabricante, copiado sem ajustar.

**A conclusão, e ela é o desenho:** o DMI **não substitui a declaração dela**.
E o `maxchild` também não — ele conta soquetes de barramento, incluindo cabeçote
interno e a duplicação 2.0/3.0 do mesmo conector físico.

**Nenhuma das três é autoritativa. As três são SUGESTÃO, e ela confirma.** É
exatamente para isso que a aba existe.

**O que MUDA na tarefa, e não é pouco:**

- o install **continua tentando** — o comando é um, roda como root que ele já
  tem, e há placas em que a tabela presta;
- mas o `gabinete.json` nasce com `de_onde_sei` **por campo**, e a aba **nunca**
  desenha um gabinete só com o que o firmware disse;
- quando as fontes **divergem** — e aqui divergiram — a aba mostra a divergência
  em vez de escolher uma: *"a BIOS diz 5 conectores USB, e eu vejo 8 soquetes
  externos. Quantos a sua traseira tem?"* **Divergência declarada é informação;
  divergência escondida é o F6 desta casa.**

**A mordida cresce.** Além de `::test_placa_sem_tabela_8_nao_inventa_gabinete`,
nasce `::test_tabela_8_que_contradiz_o_kernel_nao_vence_sozinha`
<!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— com a saída REAL desta placa (5 USB) e o `maxchild` real (22 soquetes), o
censo grava as duas contagens e marca `divergem: true`; a aba pergunta. Arrancada
a cura, o censo elege a BIOS e desenha **5 entradas** para quem tem 8 — e a
pessoa procura no gabinete três buracos que o mapa não mostra.

## 8. Qual pergunta de Bluetooth trava esta sprint

**Nenhuma.** O motor não toca o rádio: ele arruma entradas e reparte controles.
A conta de 1600 slots que ele usa **já está medida** desde 25/07.

## 9. Posse

```
posse:      src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py (novo) <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
            src/hefesto_dualsense4unix/integrations/censo_do_gabinete.py (novo)
            tests/unit/test_arranjo_da_mesa_bate_com_o_mockup.py (novo) <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
            tests/unit/test_arranjo_invariantes.py (novo)
            tests/unit/test_censo_do_gabinete.py (novo) <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
            install.sh — SÓ a função install_censo_do_gabinete_host() e a
                         chamada dela; posse de FUNÇÃO, não do arquivo
cria:       nada em docs/
nao_toca:   app/**, daemon/**, core/**, o mapa de canais, main.glade
            (a MOTOR-5 é a ÚNICA que abre app/, e só para IMPORTAR)
depois_de:  CONEXOES-MAPA-2D-01 (o campo `mapa` do maquina.json é dela)
bancada:    nenhuma — o módulo é puro e os testes não abrem janela nem hidraw
```

**Colisão declarada:** a MOTOR-5 toca `app/actions/config/secao_mesa.py` e
`secao_orcamento.py`, que são de A e de C. **Ela roda por último**, depois das
duas, e só acrescenta o `import` — se achar que precisa mexer em mais que isso,
**relata em vez de editar** (R1).

## 10. O que sobrou para o próximo

- **O motor não conhece rádio vizinho que não está na mesa** — roteador, TV,
  micro-ondas. O maior emissor de 2,4 GHz do cômodo costuma ser o roteador, e
  nenhum rearranjo de entrada USB o resolve. Enquanto isso não existir, a aba
  pode mandar mover dongle para sempre sem tocar na causa.
- **Quatro controles no rádio ao mesmo tempo nunca foi medido nesta casa** — o
  maior ensaio foi de dois. A conta de slots é derivada de uma medição de UM
  controle, e a barra tem de dizer isso.
