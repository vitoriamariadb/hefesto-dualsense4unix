---
sprint: TELA-TRES-01
estado: feita
posse:
  TELA-TRES-01:
    - src/hefesto_dualsense4unix/interface/aba09.py
    - src/hefesto_dualsense4unix/interface/topo.html
    - src/hefesto_dualsense4unix/interface/monta.py
bancada: false
depois_de: [LANCADORES-ZERO-01]
---

# Três de tela, e a segunda é uma contradição

> **ESTADO 08/09/2026, 22h:** as três dependências fecharam (FITA-01, JANELA-01 e
> LANCADORES-DELA-01 estão `feita`). A **§2 foi ABSORVIDA** pela
> [LANCADORES-ZERO-01](2026-09-08-LANCADORES-ZERO-01-a-aba-que-nao-identifica-nada-na-tela-dela.md)
> — ela reportou a mesma aba como vazia pela segunda vez no dia, e isso é defeito
> de resposta, não só de palavra. A §1 e a §3 seguem abertas, medidas: nenhuma
> `RÁDIO`/`CABO` em caixa alta em `monta.py` nem em `topo.html`, e a altura dos
> dois quadros da Sistema não foi medida ainda. O chip da fita da 07 é montado pelo
> `desenho_dos_lancadores.py`, que agora é posse da ZERO — daí o `depois_de`.

## 1. O «Detalhes técnicos» é mais baixo que o bloco da esquerda

> *"em sistema aumentar a altura do detalhes técnicos pra ficar igual ao bloco à
> esquerda"*

Na aba **Sistema**, o quadro «Avançado» (quatro botões) e o «Detalhes técnicos»
(a caixa com as identidades de fábrica) têm alturas diferentes, e a da direita é
menor — a lista de quatro controles fica com barra de rolagem enquanto sobra
espaço embaixo.

A altura passa a acompanhar a do irmão. **Meça no Chrome, não no CSS**: a régua
lê a geometria computada dos dois quadros na página publicada e cobra que eles
fechem na mesma linha de base.

## 2. O selo diz «NÃO SEI» e o corpo diz «Achei este lançador aqui»

> *"parece que não identificou."*

**ABSORVIDA em 08/09/2026 pela
[LANCADORES-ZERO-01](2026-09-08-LANCADORES-ZERO-01-a-aba-que-nao-identifica-nada-na-tela-dela.md)**,
que leva a medição (`cartao_sem_censo`, `desenho_dos_lancadores.py:1454-1509`:
um lançador ACHADO recebe o selo `nao_sei`) e a decisão da palavra — que é dela.

## 3. «cabo» e «rádio» em CAIXA ALTA na fita

> *"cabo e rádio coloca maiúsculo."*

Na fita do topo os chips dizem `P1 · Galactic Purple · rádio`. Ela quer
**`RÁDIO`** e **`CABO`**.

O dono da palavra é `home_actions.palavra_do_transporte` — foi ele que trocou
`USB`/`BT` por `cabo`/`rádio` em 06/09, com o glossário da casa. **A caixa alta
mora na TELA, não no dono**: mudar o dono levaria a palavra maiúscula para todo
lugar que a lê, inclusive frases no meio de parágrafo.

Onde aplicar: a montagem do chip, em `monta.py` / `desenho_dos_lancadores.py`.
E a régua que compara chips (`test_a_fita_inerte_nao_acende_ninguem`) não pode
quebrar — ela mede aparência, não texto.

## O que MORDE

* os dois quadros da Sistema com alturas diferentes → reprova com os dois
  números em pixel, medidos no navegador;
* o selo e o corpo dizendo coisas opostas → é a mordida da LANCADORES-ZERO-01,
  e não se repete aqui;
* um chip da fita com `cabo` minúsculo → reprova nomeando o chip.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo / BT | é tela; o chip diz CABO ou RÁDIO em caixa alta, e diz o certo para cada um dos quatro |
| no perfil | — |
| por controle | o chip é por controle, e é o único dado por controle aqui |


---

## FEITA em 09/09/2026 — as duas que restavam

### §1 — a altura, **medida no Chrome, não no CSS**

Na página publicada, antes da cura:

```
.avancado .lista   136px   base 700
.avancado .log     110px   base 674
```

Vinte e seis pixels. A causa era `height:110px` cravado em `aba09.py`,
calibrado num dia em que a lista tinha TRÊS botões — o quarto entrou em 06/09
e levou os 26px com ele.

Curado com `flex:1;min-height:110px`: o `.avancado` já é grid com
`align-items:stretch` e o `.col-log` já é coluna flex, então a altura do irmão
CHEGA sozinha. Um segundo `136px` digitado seria a segunda verdade sobre a
altura da lista, e envelheceria no dia do quinto botão.

**Depois:** `136px` e `136px`, mesma base — `700`.

### §3 — CABO e RÁDIO

A caixa é CSS, e a regra é do próprio `monta.rotulo`: *"quem escreve em
maiúscula no HTML tira da pessoa a chance de copiar o nome do plástico"*.

* `monta.rotulo_do_chip(c)` MARCA a via do que `rotulo(c, "curta")` devolveu,
  num `<span class="via">` — não remonta o rótulo (seria a sexta gramática do
  nome de um controle nesta janela);
* `topo.html`: `.fita .chip .via{text-transform:uppercase}` — só a via, para o
  nome do plástico não subir junto.

**O que apareceu no caminho:** a `MESA` do desenho ainda escreve `USB`/`BT`,
enquanto a mesa VIVA traz `cabo`/`rádio` — é a `A-PALAVRA-MESA-SAI-01`, e a
régua diz isso por escrito em vez de exigir minúscula nas duas.

### A régua

`tests/unit/test_tela_tres_a_altura_e_a_caixa_alta.py`, quatro testes, dois
deles lendo a **geometria computada** no Chrome. Mordidas provadas: devolver
`height:110px` reprova a §1 com os dois números; tirar a regra CSS da via
reprova a §3 com `['none','none']`.

### §2

Continua **absorvida** pela LANCADORES-ZERO-01 — a palavra é decisão dela.
