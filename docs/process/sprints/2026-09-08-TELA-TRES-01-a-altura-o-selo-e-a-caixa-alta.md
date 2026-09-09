---
sprint: TELA-TRES-01
estado: aberta
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
