---
sprint: TELA-TRES-01
estado: aberta
posse:
  TELA-TRES-01:
    - src/hefesto_dualsense4unix/interface/aba09.py
    - src/hefesto_dualsense4unix/interface/topo.html
    - src/hefesto_dualsense4unix/interface/monta.py
    - src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py
bancada: false
depois_de: [FITA-01, JANELA-01, LANCADORES-DELA-01]
---

# Três de tela, e a segunda é uma contradição

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

E ela tem razão em duvidar, porque **a tela se contradiz**. No print de 08/09,
cinco cartões da aba Lançadores mostram ao mesmo tempo:

```
Heroic (Epic · GOG)   [NÃO SEI]
Achei este lançador aqui (/home/…/com.heroicgameslauncher.hgl.desktop).
```

O selo responde *"sei ler a biblioteca dele?"* e o corpo responde *"ele está
instalado aqui?"* — **duas perguntas diferentes com uma palavra só na tela**, que
é exatamente o defeito que `SemCenso` documenta ter nascido para curar
(*"os dois saberes são separados, e confundi-los foi o defeito que este arquivo
nasceu para curar"*).

O `NÃO SEI` está tecnicamente certo e **lê-se como falha**. O selo precisa de uma
palavra que diga a verdade dos dois saberes juntos — e essa palavra é decisão
dela, porque é texto de tela.

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
* um cartão com selo `NÃO SEI` e corpo `Achei este lançador aqui` → reprova,
  porque a tela está dizendo as duas coisas;
* um chip da fita com `cabo` minúsculo → reprova nomeando o chip.
