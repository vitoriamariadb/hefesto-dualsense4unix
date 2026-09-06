---
sprint: A-RECUSA-QUE-CITOU-O-MAPA-01
estado: aberta
onda: F
decisoes: [D-0609-O-MAPA-INFORMA-NUNCA-VETA]
posse:
  VARREDURA:
    - docs/process/sprints/
    - docs/process/agentes/
cria:
  - docs/process/agentes/2026-09-06/A-RECUSA-QUE-CITOU-O-MAPA-01.md
bancada: false
depois_de: []
nao_toca:
  - docs/data/mapa-controles.csv
  - docs/data/paridade-gtk-html.csv
  - docs/data/decisoes-dela.csv
  - src/
  - tests/
  - scripts/
  - mockup/
  - html/
  # A posse desta sprint é um DIRETÓRIO inteiro, e por isso ela colide com toda
  # sprint que declara um arquivo dentro dele. As quatro abaixo são as que o
  # `check_colisao_de_sprints.py` acusava em 06/09/2026 — declaradas aqui
  # porque esta varredura de fato não as toca: nenhuma delas tem veto do mapa a
  # desfazer, e a última é de outro agente em voo nesta mesma leva.
  - docs/process/sprints/2026-08-26-BATERIA-PARADA-01-o-numero-que-nunca-muda.md
  - docs/process/sprints/2026-08-26-SPECS-A-PROCEDENCIA-DE-CADA-LINHA-01.md
  - docs/process/sprints/2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md
  - docs/process/agentes/2026-09-06/A-TELA-NOVA-ENTRA-NA-REGUA-DO-MAPA-01.md
---

# A-RECUSA-QUE-CITOU-O-MAPA-01 — varrer o passado, e desfazer os vetos

> **Ordem dela, 06/09/2026:** *"mandando agentes do passado que fizeram recusass
> parecidas corrigirem as sprints do passado. (caso tenham ocorrido)."*
> <!-- noqa-acento: citação literal dela -->

---

## 1. O QUE ACONTECEU HOJE, e é o molde do que se procura

O coordenador leu `radio_aciona = não` em `audio.alto_falante@dualsense` como
**"o aparelho não faz"** e mandou um agente **PARAR** um passo. A célula tinha
`radio_por_que_nao_aciona = divida` na coluna ao lado — causa **nossa**, não do
aparelho. **O mapa dizia a coisa certa e ele leu metade.**

A palavra dela, no mesmo dia, é o que decide:

> *"Esse mapa é funcional e real. tá desatualizado no sentido de não ter sido
> medido. foi e tudo funciona."*
> *"se ocorrer um conflito entre a sprint e o mapa dos controles ou o csv do
> specs, o csv do specs e o mapa vencem a sprint em termo de informações
> precisas. sempre."*

E a ordem de precedência que saiu disso já está no preâmbulo do despachante
(`scripts/despachar-agente.sh`), de onde todo agente novo a recebe:

    1. O APARELHO   2. O MAPA   3. A SPRINT   4. A lembrança de quem coordenou

**2 vence 3** em informação precisa. **1 vence 2**, e uma célula atrasada
**nunca veta trabalho**.

---

## 2. O QUE VOCÊ PROCURA — e a distinção é a sprint inteira

Varra `docs/process/sprints/` e `docs/process/agentes/` (a primeira sondagem deu
**88 ocorrências em 50 arquivos**, e a maioria NÃO vai ser recusa) atrás de
texto que use o mapa para **não fazer**:

* *"o mapa não sustenta"* · *"sem lastro no CSV"* · *"não aciona no rádio"* ·
  *"o mapa diz que não"* · `aciona = não` citado como razão · o grau da escada
  vazio citado como razão;
* passo **cortado**, escopo **encolhido**, feature **adiada** ou frase de tela
  **apagada** porque uma célula do mapa dizia `não` ou estava vazia.

### As três gavetas, e a do meio é a que importa

| gaveta | o que é | o que fazer |
| --- | --- | --- |
| **A — VETO** | o mapa foi usado para não construir, e a célula é `divida`, `nao-medido`, `so-ela-decide` ou está VAZIA | **corrigir o texto da sprint** e pôr a linha na fila |
| **B — LEGÍTIMO** | a célula é `nada-a-acionar` (a peça não existe no aparelho) ou `o-aparelho-recusa` | **nada a fazer** — e diga quantas, porque é o número que prova que a varredura discriminou |
| **C — NÃO É RECUSA** | o texto só CITA o mapa, descreve, ou proíbe a tela de AFIRMAR o que ninguém mediu | **nada a fazer**. *Não afirmar* não é *não construir* — a tela calar sobre o que não se mediu continua certo, e a maior parte das 88 vai cair aqui |

**A gaveta C é a que separa esta varredura de um estrago.** Uma frase de tela que
não promete o que ninguém mediu está **certa** e continua. O que se desfaz é o
veto ao TRABALHO, nunca a prudência da TELA.

---

## 3. O QUE VOCÊ FAZ COM CADA UMA DA GAVETA A

1. **Corrija o texto da sprint no lugar**, com nota datada. Fato errado se
   SUBSTITUI — e a substituição não é apagar: escreva o que a célula diz de
   verdade (`divida` · `nao-medido` · vazio), e que isso **não é o aparelho
   recusando**.
2. **Não mude o `estado:` de sprint nenhuma.** Se uma `caducou` por causa de um
   veto, ela **volta a valer** — diga isso no relatório e deixe a troca para o
   coordenador, que é quem responde pela fila.
3. **Não escreva código, não toque o mapa, não toque a paridade.** Esta sprint é
   de TEXTO.

---

## 4. A MORDIDA — e numa varredura ela é de amostra

Régua não há: o produto disto é prosa. Então prove que a triagem discrimina:

* pegue **três** da gaveta B e **três** da C e escreva, uma linha cada, **por
  que não são A**. Uma varredura que põe tudo na gaveta A não triou nada;
* e pegue **a mais antiga** da gaveta A e siga o efeito dela até hoje: o passo
  cortado foi feito depois por outra sprint, ou continua parado? **Um veto que
  nunca foi desfeito é a razão de esta sprint existir.**

---

## 5. NADA SE PERDEU

| o que continua valendo | por quê |
| --- | --- |
| `test_a_aba_emulacao_nao_promete_transporte_sem_lastro` | é gaveta C: ele proíbe **afirmar**, não construir |
| `scripts/validar-fala-de-tela.py` e a regra 16 do `check_paridade_transporte.py` | idem — cobram declaração, não vetam trabalho |
| toda decisão dela que tirou uma feature de cena | é decisão dela, não célula de CSV. **Não mexa** |
