---
sprint: ILUMINACAO-GRADE-01
estado: aberta
onda: A-LISTA-DE-0911B
posse:
  ILUMINACAO-GRADE-01:
    - src/hefesto_dualsense4unix/interface/aba04.py
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
    - mockup/04-iluminacao.html
cria: []
bancada: false
depois_de:
  # A ILUMINACAO-PALETA-01 tirou os três tons e a casa hachurada; esta parte de
  # onde ela parou, e foi a MEDIÇÃO dela que provou que a poda não estreita.
  - ILUMINACAO-PALETA-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/topo.html
  - src/hefesto_dualsense4unix/core/led_control.py
  - docs/data/paridade-gtk-html.csv
  - src/hefesto_dualsense4unix/interface/paginas/04-iluminacao.html
---

# ILUMINACAO-GRADE-01 — a coluna estreita de verdade

**Decisão dela, 11/09/2026, com a medição na mão: «Estreitar a grade de
verdade».**

---

## §1 — POR QUE A PODA NÃO BASTOU, e o número é da leva de hoje

A `ILUMINACAO-PALETA-01` cumpriu a ordem dela — os três tons e a casa hachurada
saíram — e **mediu que o desafogo não veio**:

| o que | antes | depois |
| --- | --- | --- |
| min-content da fileira de tons | 130 px | **64 px** |
| min-content da coluna | 151 px | 129/134 px |
| largura renderizada de cada tom | 10,23 px | **15,77 px** (+54%) |
| **largura renderizada da coluna** | — | **não mudou** |

**A causa está em duas linhas**, e as duas são de desenho:

```
aba04.py:279   grid-template-columns: var(--larg-rot) repeat(4,1fr)
aba04.py:784   .guia .tom{flex:1; …}
```

Com `repeat(4,1fr)` numa janela de largura fixa, as quatro colunas valem um
quarto do que sobra, **independentemente do que tenha dentro**. Tirar casa da
fileira só engorda as que ficam. **A pressão caiu pela metade e a largura não
mudou um pixel** — é por isso que esta sprint existe.

## §2 — O QUE ESTREITAR SIGNIFICA, e a armadilha está aqui

**Não existe «estreitar a coluna» sem responder: para onde vai o espaço?** A
janela tem largura fixa; o que uma coluna devolve, outra coisa recebe. As três
saídas, e a escolha é sua com a medição na mão:

1. **as quatro colunas deixam de ser iguais** — cada uma cabe ao seu conteúdo
   (um lugar vazio pede muito menos que um controle conectado). O espaço que
   sobra vira respiro entre elas. **Custo:** com um controle na mesa, a coluna
   do P1 fica larga e as três vazias, estreitas — a simetria que o desenho tem
   hoje some, e ela vai VER isso;
2. **as quatro continuam iguais, mas menores**, e o que sobra vira margem do
   quadro ou respiro entre colunas. **Custo:** menor;
3. **a fileira de tons deixa de mandar na largura** — ela quebra em duas linhas
   quando não couber, e a coluna passa a ser medida pelo resto do conteúdo.
   **Custo:** a fileira ganha altura, e a altura desta aba já é apertada.

**MEÇA AS TRÊS ANTES DE ESCOLHER.** O número que decide é a largura renderizada
da coluna de um controle, com **um** e com **quatro** controles na mesa — porque
é com um que ela usa a máquina hoje, e com quatro que o produto tem de fechar.

## §3 — O QUE NÃO SE FAZ

**Não tire mais tons.** A poda já aconteceu e foi decidida por ela; onze é o
número. Se a sua medição disser que a largura só cai tirando mais cor, isso é um
ACHADO para o relatório, não uma licença.

**Não toque no `monta.py` nem no `topo.html`.** Eles são o esqueleto das dez
abas e têm dono nesta mesma leva (`VAO-DO-ESQUELETO-01`, que vem depois). Se a
sua medição apontar para lá, **relate e pare** — a cura do esqueleto é de outra
frente, de propósito.

**Não publique.** Esta sprint muda o DESENHO que ela aprovou, e a publicação é
ato dela. Gere `mockup/04-iluminacao.html`, fotografe com `--oculta`, entregue a
foto. `paginas/04-iluminacao.html` está em `nao_toca` por isso.

## §4 — O QUE ENTREGAR

1. **As três medições da §2**, em pixels, com um e com quatro controles.
2. **A escolha, com a razão medida** — e a foto de cada uma das três, para ela
   comparar. Uma tabela de números sem imagem não decide desenho.
3. O `mockup/04-iluminacao.html` gerado com a que você recomenda.
4. **A MORDIDA**: a régua que impede a grade de voltar a `repeat(4,1fr)` sem
   ninguém ver. Arranque, veja reprovar, devolva.
5. O que a mudança faz nas OUTRAS abas: se a regra de grade for copiada de
   alguma delas, diga quais e **não as mexa**.

## §5 — O QUE É DELA

**A escolha entre as três, e a publicação.** Ela pediu «desafogo horizontal
legal pra página»; o que isso quer dizer em pixels é o que a sua medição
propõe, mas qual dos três desenhos fica é o olho dela.
