---
sprint: COR-X-01
estado: feita
posse:
  COR-X-01:
    - src/hefesto_dualsense4unix/interface/aba04.py
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
decisoes: [D-0909-A-COR-DE-OUTRO-CONTROLE-SE-RECUSA-COM-X]
bancada: false
---

# COR-X-01 — a cor do vizinho ganha um X, em vez de ser oferecida

**Decisão dela, 09/09/2026, na bancada com dois DualSense na mesa:**

> *"onde eu escolher uma cor, em volta dela fica a borda da cor do plastico do
> controle e um X na cor selecionada por mim de forma que me impeça de setar
> alguma cor de um coleguinha"* <!-- noqa-acento: citação literal dela -->

## §1 — O que já está feito

A **borda** entrou em 09/09 e está publicada: a `.guia` veste o
`data-campo="plastico"` e o `.tom.on` pede `currentColor`. Sem endereço novo —
o pintor já escrevia esse valor na moldura do desenho.

A folha de ensaios (`scripts/ensaios/a_folha_dos_ensaios.py`) tem os **dois**
comportamentos funcionando, e serve de especificação viva: a escolhida com a
borda do plástico, a tomada com o X na cor do plástico de quem a tem, e o
clique recusando com o nome do dono.

## §2 — FEITA em 09/09/2026 — e a razão técnica que a atrasava

**O alvo `classe` do pintor compara por IGUALDADE** (`hefesto_vivo.py`, ramo
`alvo === 'classe'`: `aceso = (t === quando)`). "Esta cor está na lista das que
os outros controles tomaram" não é uma igualdade, e não há como exprimi-la com
um `data-hef-quando`.

**A cura é a guia virar bloco**, emitido pelo pacote com as classes já
resolvidas — o mesmo desenho que `a04_iluminacao.fileira_de_players` já usa
para os números de jogador. O pacote conhece a mesa inteira; ele é quem sabe
quem tem qual cor.

## §3 — O que a régua tem de morder

1. dois controles com cores diferentes: nenhum X em nenhuma das duas colunas;
2. o P2 escolhe a cor do P1: o clique não muda a cor do P2, e a tela diz de
   quem é aquela cor;
3. o P1 troca de cor: o X sai da casa antiga e entra na nova, nas duas colunas;
4. um lugar sem controle não ganha X nenhum — não há dono a proteger.

## §4 — A que esta revoga

**COR-TROCA-01** desenhava o oposto: a cor repetida **trocava de lugar** entre
os dois controles, "como o número do jogador". As duas não coexistem — uma
troca e a outra impede. A decisão dela de 09/09 é a mais nova.


## §5 — Como fechou, 09/09/2026

**`fileira_de_tons`** no pacote, o mesmo "um dono, dois chamadores" da
`fileira_de_players`: o gerador desenha a bancada com ela, o pacote pinta o
produto a cada tique. A `.guia` ganhou dentro um `<span class="tons">` com
`data-hef-alvo="html"` — dois endereços em dois elementos, porque o pintor
aceita UM `data-campo` por elemento. O `display:contents` mantém os catorze
botões como itens do flex do avô.

**O gesto passou a RECUSAR.** `_sem_repetir_a_cor_do_vizinho` deslocava para o
primeiro tom livre — uma terceira coisa, nem a troca nem o bloqueio: ela
clicava num tom e o aparelho acendia OUTRO, escolhido pelo produto. Agora
levanta com o nome do dono e "Nada foi mudado".

**As duas metades leem a MESMA mesa** (`_a_cor_de_agora`, pré-brilho): a tela
não oferece o que o gesto recusa.

### Medido com os QUATRO na mesa (2 cabo · 2 rádio)

| coluna | anel | X |
| --- | --- | --- |
| P1 | `#0000FF` | `#FF0000` `#00FF00` `#FF0080` |
| P2 | `#FF0000` | `#0000FF` `#00FF00` `#FF0080` |
| P3 | `#00FF00` | `#0000FF` `#FF0000` `#FF0080` |
| P4 | `#FF0080` | `#0000FF` `#FF0000` `#00FF00` |

Nenhuma coluna tem X na própria cor — senão o `reenviar` ficaria bloqueado por
si mesmo.

### As mordidas

| arrancar | reprova |
| --- | --- |
| `tomadas` ignorado em `fileira_de_tons` | `test_a_guia_desenha_o_x_exatamente_no_que_o_gesto_recusa` |
| o `if ligado` da conta do `on` | `test_um_lugar_sem_controle_nao_ganha_anel_nem_x` |
| a recusa devolvendo `(rgb, None)` | `test_escolher_o_tom_do_vizinho_recusa_e_diz_de_quem_e` |

## §6 — DUAS CORREÇÕES DELA, 09/09/2026 à tarde, com os QUATRO na mesa

Ela abriu o produto instalado e viu as duas de uma vez. Nenhuma é defeito de
execução: a §3 desta sprint especificava a primeira, e a segunda foi escolha
dela mesma. Palavra dela: *"o seu trabalho ficou certo, só surgiu um imprevisto
que eu não notei e foi escolha errada minha. não sua."* <!-- noqa-acento: citação literal dela -->

### 1. O X FICA, O AVISO SAI — *"no caso o X fica o aviso saí"*

O botão com X guardava o `data-gesto="cor"` do lado. Ela clicava, o
`_sem_repetir_a_cor_do_vizinho` levantava, e **três linhas de recusa cobriam o
desenho do controle por 30 s** — a foto dela mostra a frase por cima do P1.

A §3.2 pedia isso ("*o clique não muda a cor do P2, e a tela diz de quem é*"), e
a §3.2 estava errada: a decisão de origem dela diz **impeça**, não **avise**.
Prevenir e recusar não são duas camadas que se somam — quando a prevenção
funciona, a recusa nunca deveria ser alcançada pelo dedo dela.

**A cura:** a casa tomada perde `data-gesto` e `data-hex`, e ganha
`aria-disabled="true"`. O `BOOTSTRAP` casa por `[data-gesto]`, então o clique
morre no botão. O `title` continua nomeando o dono, e a explicação passa a
custar ZERO clique — que é a regra dela de 07/09.

**O `RuntimeError` do pacote FICA.** Ele é a rede, não a porta: o gesto `cor`
chega por outros caminhos (a prova botão a botão, um tique entre a leitura e o
clique), e duas peças da mesma cor não podem passar por nenhum deles.

### 2. O X É PRETO COM BORDA BRANCA — e a razão é o controle BRANCO dela

> *"deixa o nosso x preto com borda branca pra destacar. Falo isso pois ficou
> perfeito o nosso x, o complicado é que são tons pasteis e o controle branco
> por exemplo não ajuda nisso o x dele fica invisível."* <!-- noqa-acento: citação literal dela -->

O X saía em `var(--dono)` — a cor do PLÁSTICO de quem tem o tom —, pela mesma
regra que pinta a borda da coluna (`D-A-BORDA-E-A-IDENTIDADE-DA-PECA`): o
desenho diria de quem é a cor sem palavra nenhuma.

**A bancada derrubou a ideia com um caso só:** branco sobre um tom pastel não
tem contraste, e o X do controle branco dela fica invisível — exatamente na
casa em que ela precisa ver que não pode clicar. *Um X que aparece em três dos
quatro controles é pior do que um X neutro que aparece nos quatro.*

O contorno é `filter:drop-shadow` em quatro direções, e não um segundo X por
baixo: o `drop-shadow` segue a forma alfa do gradiente, então ele contorna as
duas hastes de verdade — e custa zero nó a mais (um `::before` custaria 56, com
quatro colunas de 14 tons).

### O que a tela mede hoje, com os quatro dela

Sonda no WebKit vivo, `.tom` por coluna:

| coluna | tons | clicáveis | com X | de quem |
| --- | --- | --- | --- | --- |
| P1 | 14 | 11 | 3 | P2 · P3 · P4 |
| P2 | 14 | 11 | 3 | P1 · P3 · P4 |
| P3 | 14 | 11 | 3 | P1 · P2 · P4 |
| P4 | 14 | 11 | 3 | P1 · P2 · P3 |

`data-gesto` e `data-hex` são `null` nas doze casas com X; `aria-disabled` é
`"true"`; o `::after` computa `rgb(0,0,0)` com `drop-shadow(rgb(255,255,255)
1px …)` — inclusive na coluna do White.

### As duas mordidas, provadas arrancando

* devolver `data-gesto` à casa tomada → `test_a_guia_desenha_o_x_exatamente_no_que_o_gesto_recusa` cai nomeando o endereço que voltou;
* devolver `var(--dono)` ao `background` do `::after` → `test_o_x_e_preto_com_borda_branca_e_nao_a_cor_do_dono` cai dizendo que o X do controle branco some sobre o pastel.
