---
sprint: A-FILA-QUE-A-ONDA-ABRIU-INDICE
estado: aberta
onda: A-FILA-DE-0911
posse:
  COORDENA:
    - docs/process/sprints/2026-09-11-A-FILA-QUE-A-ONDA-ABRIU-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
---

# A FILA QUE A ONDA ABRIU — o que as dez frentes acharam e não curaram

**11/09/2026, noite.** A onda da língua da tela fechou com 352 propostas
aprovadas por ela de uma vez — *"ok aprovadíssimo todas. Manda ver."* — e no
caminho **achou sete coisas que não cabiam nela**. Ela leu as sete e mandou
enfileirar:

> *"Então põe na lista"* · *"Ok isso tambem. mas precisa ta na linha"* ·  <!-- noqa-acento: citação literal dela -->
> *"ok"* · *"ok tambem."*  <!-- noqa-acento: citação literal dela -->

---

## §1 — A MAIOR, e ela mudou o que a casa achava que tinha

**OITO DAS DOZE PÁGINAS ESPECIAIS NÃO FAZEM NADA.** Medido pela
PAGINAS-ESPECIAIS-B1: doze endereços, **doze abrem**, **quatro funcionam**.
Remapeamento (22 campos), Point-and-click (7 campos) e a calibração somam **29
`<select>` com ZERO endereço de gesto**; os três gestos da Navegação estão em
`SEM_GESTO`.

**A REAÇÃO DELA É O DADO:** *"eu achei que elas funcionavam kkkkkkkkkkkk"*.  <!-- noqa-acento: citação literal dela -->

**E ISSO MUDA A LEITURA DE «não adicionar feature».** A ordem dela na onda da
língua era *"A ideia não é adicionar mais nada em termos de feature ou
interface, Mas é fazer o todo funcionar"*. Estas oito **já estão na
interface** — o que falta é o segundo pedaço da frase dela. Ligar o que já
está desenhado não é acrescentar; é terminar.

| frente | o quê | onde |
| --- | --- | --- |
| **F1-REMAPEAR** | os 22 campos do Remapeamento ganham gesto e gravam | `a06_navegacao.SEM_GESTO` · `aba06.py` |
| **F2-POINT-AND-CLICK** | os 7 campos do Point-and-click ganham gesto e gravam | idem |
| **F3-CALIBRAR** | a calibração mostra os controles DELA, não os do desenho | `app/widgets/calibrar_entradas.py` · `calibrar.REPOUSO` |

**A ORDEM É DE DESBLOQUEIO:** a F3 é a mais barata e a mais visível — hoje a
tela mostra `monta.MESA` (o desenho, sempre dois controles) com números de
`calibrar.REPOUSO`, e `calibrar.py:219` chega a escrever *"dos 1 controles"*.

## §2 — O MAPA DAS PORTAS, e o produto apaga o próprio aviso

| frente | o quê |
| --- | --- |
| **F4-MAPA-DAS-PORTAS** | o censo sai do JS cravado e ganha gerador; o aviso volta a aparecer |

`mapa-das-portas.html` diz *"o arranjo de agora"* sobre um censo de
**24/08/2026** cravado em JavaScript. A página TEM a linha
`<p class="nota">mockup · 24/08/2026</p>` — e a primeira regra de
`folha_da_casa.FOLHA_DA_CASA` é `.nota{display:none !important}`.

**No Chrome o aviso aparece. Na tela dela, não.** O produto remove a única
defesa que a página tinha contra ser lida como verdade de hoje. E ela não tem
gerador: já divergiu 39 linhas do mockup de origem.

Palavra dela: *"Ok isso tambem. mas precisa ta na linha"*.  <!-- noqa-acento: citação literal dela -->

## §3 — OS DOIS INSTRUMENTOS FALSOS

| frente | o quê |
| --- | --- |
| **F5-A-REGUA-LE-O-GESTO** | `check_a_tela_nao_confessa.py` passa a ler os `raise RuntimeError` dos pacotes |

**TRÊS AGENTES ACHARAM ISTO SOZINHOS**, cada um na sua aba, sem se falarem
(LINGUA-A2, A4, A5). O portão que garante a decisão dela de 07/09 — *a tela
nunca confessa dívida nossa* — lê as páginas HTML e os `Fala(texto=…)`. Mas o
recado que POUSA NO CARTÃO dela chega por `raise RuntimeError` dentro do
gesto: string montada em tempo de execução, que ele nunca lê.

**A mordida já foi dada:** chamando o casador do portão com as frases dos
gestos, elas CASAM com o padrão que ele caça. Ele não falha em reconhecer —
ele nunca as lê.

O mesmo vale para `PALAVRAS_BANIDAS`: três palavras, e das **onze** proibições
do glossário só a «mesa» tem portão. Foi por isso que `uinput` sobreviveu na
dica da Navegação.

**POR QUE NÃO ENTROU NA ONDA DA LÍNGUA:** curar o portão antes de aplicar as
352 acenderia vermelho em cima de frases que estavam saindo no mesmo gesto.

## §4 — A GRAFIA, e ela trava uma cura já medida

| frente | o quê |
| --- | --- |
| **F6-O-NOME-TEM-UM-DONO** | `Dualsense4Unix` → `DualSense4Unix` nos 306 lugares |

Medido pela ESQUELETO-C2: `utils/identidade.py:96` grafa `Dualsense4Unix` com
**s minúsculo**, e a grafia se repete em **306 ocorrências de 110 arquivos**.

**É POR ISSO QUE O NOME DA JANELA FOI DIGITADO E NÃO LIDO DO DONO.** As duas
linhas que a onda de hoje curou (`ponte_da_tela.py:422` e `ver.py`) trazem o
nome cravado, com a dívida escrita ao lado: ler do dono hoje poria a grafia
errada na barra. Fechada a F6, as duas passam a ler.

## §5 — A ACESSIBILIDADE QUE A CURA DA DICA CUSTOU

| frente | o quê |
| --- | --- |
| **F7-O-NOME-ACESSIVEL** | o `aria-label` ocupa o lugar que o `title` deixou |

A TOOLTIP-C1 curou a dica que não abria colhendo todo `title` para
`data-hef-dica` e **esvaziando o `title` no DOM vivo** — sem ele, o popup do
compositor não tem de que nascer. A própria C1 declarou o preço: **o `title`
era também o nome acessível do elemento**, e a camada não escreve `aria-label`
no lugar.

**Não é regressão de uma feature que ela usa hoje** — é dívida que a cura
criou, declarada no mesmo dia em que nasceu.

## §6 — O QUE É DELA, E ELA JÁ DISSE QUANDO

**As quatro falhas de paridade e as 33 células «dentro do jogo»** não são
frente de agente: são bancada.

> *"Mais ainda? Ao final de todas eu faço com vc"* — ela, 11/09/2026.  <!-- noqa-acento: citação literal dela -->

O roteiro está pronto e medido: **cinco gestos, 65 minutos**, em
`docs/process/agentes/2026-09-11/PARIDADE-NO-JOGO-D1-opus.md`, no molde do
O-COMO-DO-MAPA. Ele **não repete** os sete gestos de 10/09 nem os sete da
AUDITORIA-SOM-GIRO-01.

**E ELE RODA DEPOIS DO INSTALL DESTA ONDA, não antes** — três dos cinco gestos
mandam LER a tela, e a tela muda hoje com as 352. Medir agora seria medir o
mundo de ontem, que é a armadilha que esta casa mais paga.

As quatro falhas, para não se perderem:

| # | o quê |
| --- | --- |
| F-a | o microfone por rádio come **34% dos reports de entrada**, e com eles a janela de movimento que vai ao jogo — a casa registra como taxa, ninguém escreveu como perda de feature |
| F-b | barra de luz e LED de jogador saem por **rotas diferentes** por transporte |
| F-c | som e microfone são **mecanismos diferentes**, não o mesmo degradado |
| F-d | o touchpad **não reage no jogo pelo rádio** (olho dela, 16/08) — e o lado do CABO nunca foi medido, então nem se sabe se é assimetria |

## §7 — A ORDEM

1. **F3-CALIBRAR** — a mais barata das oito, e a que mostra dado errado hoje.
2. **F5-A-REGUA-LE-O-GESTO** — instrumento falso primeiro: sem ele, toda frente
   de língua daqui em diante repete o mesmo ponto cego.
3. **F1 · F2** — remapeamento e point-and-click, que é o grosso do *"eu achei
   que elas funcionavam"*.
4. **F4-MAPA-DAS-PORTAS**.
5. **F6 · F7** — a grafia e o nome acessível, que são limpeza com dono.
6. **A bancada dela**, quando ela chamar.
