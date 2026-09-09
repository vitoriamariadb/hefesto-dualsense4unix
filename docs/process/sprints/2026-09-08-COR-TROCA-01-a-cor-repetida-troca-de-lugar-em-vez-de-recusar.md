---
sprint: COR-TROCA-01
estado: aberta
posse:
  COR-TROCA-01:
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
    - src/hefesto_dualsense4unix/interface/aba04.py
    - src/hefesto_dualsense4unix/core/led_control.py
bancada: false
depois_de: []
---

# A cor repetida troca de lugar, em vez de mostrar recado

## A palavra dela

> *"conforme escolhermos uma cor se a outra já tiver sido escolhida pelo player
> ao invés dessa mensagem, antes disso as demais cores disponíveis são alteradas
> para outra cor de outra faixa … e ao invés de mostrar mensagem se mesmo assim
> rolar do user clicar na mesma cor, ele apenas troca invertendo de cor com o
> controle que tiver com a outra cor marcada — tal como fazemos ao selecionar o
> jogador."*

São **DUAS metades**, e a segunda é a que ela nomeia como já existindo:

1. **ANTES do clique:** a faixa de cores de cada controle não oferece a cor que
   outro já tem. As cores restantes se deslocam para tons de outra faixa.
2. **NO clique, se ainda assim colidir:** os dois controles **trocam** as cores
   entre si — exatamente como a troca de número de jogador já faz hoje.

## O que existe hoje, medido

`a04_iluminacao._sem_repetir_a_cor_do_vizinho` DESLOCA a cor e **diz** o que fez,
com o nome do outro controle. A frente `FECHA-ILUMINACAO-01` de 08/09 escreveu
isso, e a decisão dela agora **revoga a metade do recado**: o produto passa a
trocar em silêncio, como a fita de jogador.

`core/led_control.cores_sem_colisao` resolve a mesa inteira na ordem do número —
é onde a metade 1 mora.

## O que fazer

* **A metade 1** é a faixa de cores por controle: ela é desenhada em
  `aba04.py`, e hoje as quatro faixas oferecem as MESMAS cores. Ela passa a
  perguntar quais estão tomadas e a oferecer outras.
* **A metade 2** é o gesto `cor`: a colisão deixa de recusar e passa a
  **permutar** — quem tinha a cor pedida recebe a cor de quem pediu.
* **A troca é ATÔMICA e vai aos DOIS aparelhos**, senão a mesa fica com duas
  iguais por um tique.
* O modelo é a troca de número de jogador, que já faz isso — leia
  `identity.py` e siga a mesma forma, não invente uma segunda.

## O que MORDE

* duas peças na mesa, a segunda pede a cor da primeira → as duas trocam, e
  **nenhum recado aparece**;
* a faixa do P2 não oferece a cor que o P1 tem;
* a mordida do broadcast continua valendo: `led.set` sem `uniq` pinta os quatro
  da mesma cor DE PROPÓSITO e a troca não pode desfazer isso —
  `BROADCAST-QUE-NAO-MENTE-01`.
