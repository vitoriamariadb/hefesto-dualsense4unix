---
sprint: F7-O-NOME-ACESSIVEL
estado: feita
onda: A-FILA-QUE-A-ONDA-ABRIU
posse:
  F7-O-NOME-ACESSIVEL:
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - tests/unit/test_o_nome_acessivel_sobrevive_a_dica_da_casa.py
    # A LISTA DE PENDENTES DO PORTÃO DE CITAÇÕES, e só as quatro linhas novas:
    # o bloco do nome acessível desceu 200 linhas de `hefesto_vivo.py`, e as
    # quatro citações deslocadas moram em `interface/pacotes/`, que esta sprint
    # declara em `nao_toca:`. O número certo de cada uma está medido lá.
    - tests/unit/test_portao_o_par_com_metade_ligada.py
cria:
  - tests/unit/test_o_nome_acessivel_sobrevive_a_dica_da_casa.py
bancada: false
depois_de: [TOOLTIP-C1]
nao_toca:
  - install.sh
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/aba05.py
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba08.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/aba10.py
  - src/hefesto_dualsense4unix/interface/pacotes
---

# F7 — a dica que calou o nome

Enunciada na **§5** de
`docs/process/sprints/2026-09-11-A-FILA-QUE-A-ONDA-ABRIU-INDICE.md`, e
enfileirada com a palavra dela: *"ok tambem."* <!-- noqa-acento: citação literal dela -->

**Não é regressão de uma feature que ela usa hoje — é dívida que uma cura
criou, declarada no mesmo dia em que nasceu.** A `TOOLTIP-C1` tirou a dica do
popup do compositor colhendo todo `title` para `data-hef-dica` e **esvaziando o
`title` no DOM vivo**; sem ele o popup não tem de que nascer. Só que o `title`
era também o **nome acessível** do elemento, e a camada não escrevia nada no
lugar.

A ordem dela de hoje é exatamente sobre quem paga essa conta:

> *"a ideia é que todas as features mesmo do app funcionem nao so pra mim mas*  <!-- noqa-acento: citação literal dela -->
> *pra qualquer outro user"*  <!-- noqa-acento: citação literal dela -->

---

## §1 — A MEDIÇÃO, e ela teve de ser no DOM VIVO

**Nenhuma régua de fonte vê este defeito.** Nos treze arquivos publicados o
`title` está lá, inteiro — o nome só some **depois** que a camada roda. Então a
conta foi feita onde a pessoa a recebe: cada página carregada num
`WebKit2.WebView` (`Gtk.OffscreenWindow`, porque ela tem UMA tela), a
`DICA_DA_CASA` aplicada, e a conta do nome acessível do HTML-AAM sobre o que
sobrou.

### ANTES — 11/09/2026, treze páginas publicadas

| o que | quantos |
| --- | ---: |
| `title` colhidos com texto | **693** |
| … já tinham nome pelo próprio conteúdo (o botão que diz «Aplicar») | 357 |
| … já tinham `aria-label` escrito pela aba | 31 |
| … são casca sem papel — `span`, `div`, `label`, `b`, `tr` | 215 |
| … **ficavam MUDOS** | **90** |
| `<title>` de SVG esvaziados | **1.930** |
| … **ficavam MUDOS** | **1.930** |
| **TOTAL SEM NOME** | **2.020** |

Os 90 do HTML, por forma: **52 botões de ícone**, 14 deslizantes
(`input[type=range]`), 12 campos de digitar, 12 listas (`<select>`).

Os 1.930 do desenho, por dono: 1.344 `<g>`, 227 `<circle>`, **222 `<svg>`
raiz**, 122 `<path>`, 15 `<rect>`.

### DEPOIS

**ZERO.** Os 2.020 têm nome, ou estão fora da árvore de acessibilidade por
declaração — nunca por esquecimento.

---

## §2 — O QUE A CURA FAZ, e ela mora na CAMADA

Tudo em `interface/hefesto_vivo.py`, dentro da constante `DICA_DA_CASA`.
Nenhuma aba foi tocada: `ver.py` injeta a mesma camada por `UserScript`, e o
piloto a instala na ponte — as duas ganham de graça.

**A regra é NEGATIVA, e é o ponto inteiro:** veste `aria-label` **só em quem
ficaria sem nome**. Um `aria-label` por cima de um botão que já diz «Aplicar»
faz o leitor de tela ler duas vezes, e isso é pior do que não fazer nada — é
por isso que `tem_nome()` é tão detalhado quanto a conta do HTML-AAM:
`aria-labelledby` resolvido, `alt` de imagem, `value` de botão de formulário,
`<label for>` e `<label>` ancestral, `label=` de `<option>`, e nome-do-conteúdo
só para quem o papel permite.

**A PODA QUE DECIDE, e sem ela a cura teria nascido verde sobre 52 botões
mudos:** `texto_que_nomeia()` não é `textContent`. Um `<title>` de SVG está
DENTRO do elemento; contá-lo faria todo botão de ícone passar por botão com
rótulo — e é exatamente esse botão que perde o nome aqui. A ordem dos dois
laços do `colher()` obriga a poda: o laço do HTML roda **antes** do laço do
SVG, então na hora de decidir sobre o botão o `<title>` do desenho ainda tem
texto dentro.

**O `placeholder` conta como MUDO.** Ele vem *depois* do `title` na conta do
nome, e rotular campo por `placeholder` é falha conhecida — então os 12 campos
de digitar ganham `aria-label` mesmo tendo `placeholder`.

### No desenho, dois casos e uma medida que mudou a regra

* **o ícone** — 222 `<svg>` raiz. Ganha `aria-label`, e `role="img"` **só**
  quando tem um `<title>` e nada mais dentro (199 dos 222);
* **a zona** — 1.708 `<g>`/`<path>`/`<circle>`/`<rect>` que nomeiam cada
  pedaço do DualSense. Ganham `aria-label` e **o papel não se mexe**.

**A MEDIDA QUE DERRUBOU A PRIMEIRA FORMA:** `role="img"` torna a subárvore
apresentacional. Posto nos 23 `<svg>` que guardam zonas dentro, ele
**engoliria** os 1.708 nomes de dentro para pôr um só por fora — a cura
apagaria mais do que a doença. Por isso o papel entra pela assinatura do
ícone (`querySelectorAll('title').length <= 1`), e não pela tag.

### O ícone que repete o texto do lado SAI da árvore

**63 dos 222** `<svg>` de ícone têm o próprio nome escrito no texto do
elemento ao lado — `<svg><title>Cruz</title></svg>` junto da palavra «Cruz».
Esses recebem `aria-hidden="true"`: decorativo ao lado de quem já nomeia não
precisa de nome, precisa sair do caminho, senão a frase vem dobrada. **A conta
é do DOM, não de julgamento:** o nome aparece no texto do pai, medido com a
mesma poda.

### O nome que troca de texto

O alvo `atributo` do piloto escreve `title` em **66 endereços** das dez abas
(9 deles em `<button>`) — a carga da bateria, a taxa do giroscópio, o motivo de
uma recusa. A camada já desviava esse texto para `data-hef-dica`; agora o nome
vai junto, por `window.__hefDica.trocar()`. Sem isso quem usa leitor de tela
ficaria com a frase do instante em que a página carregou, que é o mesmo defeito
da dica congelada que a C1 curou do lado de quem vê.

**A POSSE É DECLARADA, e é um `WeakMap`, não um atributo novo.** `data-hef-*` é
território de endereço desta casa, e um marcador a mais ali seria mais uma
coisa para as réguas tropeçarem. O mapa guarda o valor que escrevemos: se a aba
escrever outro `aria-label` por cima, o nosso deixa de ser nosso e a camada não
o toca mais. **O `BOOTSTRAP` não recebeu uma linha** — a ponte inteira é o
`trocar()`, que já era chamado de lá.

---

## §3 — A RÉGUA, E A MORDIDA

`tests/unit/test_o_nome_acessivel_sobrevive_a_dica_da_casa.py` — 13 testes,
~20 s. Mede no DOM vivo das treze páginas, mais quatro casos numa página de
ensaio (o botão de ícone, o botão com texto, o `<svg>` de ícone, e o
`aria-label` que a aba escreveu).

**A MORDIDA, conferida em duas formas:**

1. **de dentro da régua** — o teste neutraliza as duas funções da cura na
   própria constante e mede a `04-iluminacao`: 348 elementos mudos;
2. **arrancando do fonte** — com `vestir_nome`, `vestir_nome_do_desenho` e
   `trocar_nome` devolvendo na primeira linha, **7 dos 13 testes reprovam**,
   acusando exatamente `90 elementos` e `1930 donos de <title>`. Devolvida a
   cura, os 13 fecham.

---

## §4 — O QUE FICOU FORA, e os números estão medidos

* **A DESCRIÇÃO — 570 elementos.** Nos elementos que já têm nome, o `title`
  era a *descrição*, e ela não volta aqui. A dica da casa continua mostrando a
  frase a quem vê; devolvê-la a quem não vê pede `aria-description`, que é
  outro suporte de motor e outra sprint.
* **As 215 cascas sem papel** (`span`, `div`, `label`, `b`, `tr`). O ARIA
  proíbe nomear papel genérico: um `aria-label` ali não é melhoria, é ruído que
  as ferramentas de auditoria reprovam.
* **Os 50 nomes que são só símbolo** — `⊘`, `♪`, `🎙`, `×`, `—`. O elemento
  tem nome, e o nome é um caractere. **Isto já era assim antes da C1** (o
  conteúdo sempre venceu o `title` na conta do nome), então não é dívida desta
  cura; é linha de paridade, e cabe a quem decidir o texto da tela.
* **`aria-hidden` por julgamento.** Só sai da árvore o ícone cujo nome o texto
  vizinho já diz — regra medida. Nenhum ícone foi escondido por eu achar que
  era decorativo.

---

## §5 — A ARMADILHA DESTE DIA

**Uma régua que soma o `textContent` cru dá verde sobre botão mudo.** A
primeira forma do censo contava 152 `<option>` como mudos (falso: `option` tira
o nome do conteúdo) e **deixava passar os 52 botões de ícone** — porque o
`<title>` do SVG dentro deles ainda tinha texto e entrava no `textContent`.
Os dois erros vêm da mesma origem: *o instrumento respondia sobre o texto do
DOM, e a pergunta era sobre o nome que o motor calcula*.

O número real só apareceu quando a conta passou a ser a do HTML-AAM, com a poda
do `<title>` de desenho escrita e testada. É a mesma família de defeito que
esta casa nomeou em 04/09/2026: **o instrumento apontava para outra coisa.**

---

## §6 — O ACHADO DE PASSAGEM: uma citação errada que o acaso sustentava

O bloco novo desceu **200 linhas** de `hefesto_vivo.py`, e o portão
`citacoes-no-codigo` acusou quatro endereços deslocados. Três eram deslocamento
puro — `_fita`, `_recusou_dizendo` e `_deu_certo` continuam lá, 200 linhas
abaixo. **A quarta já estava errada antes desta leva:**
`interface/pacotes/ponte.py:277` promete os dois pontos de extensão que o
piloto substitui (`ponte.escolher_arquivo` e `ponte.salvar_arquivo`) e cita
`hefesto_vivo.py:2652`; na base `bbd61c35` eles moravam em `:2788-2789` — a
citação apontava para um `#:` de outro bloco, **136 linhas acima**.

A régua não a pegava porque a linha citada não estava em branco. O
deslocamento de hoje a fez cair numa que está, e só então ela apareceu. *Uma
citação errada atravessa a régua enquanto o acaso a mantiver sobre texto.*

As quatro estão declaradas em `_CITACOES_PENDENTES` com o número certo medido
**por símbolo**, porque `interface/pacotes/` está com seis frentes dentro agora
— e `test_a_lista_de_pendentes_nao_vira_paisagem` cobra a limpeza de quem for
dono do arquivo.
