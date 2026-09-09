---
sprint: COR-X-01
estado: aberta
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

## §2 — O que falta, e a razão técnica de não ter saído junto

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
