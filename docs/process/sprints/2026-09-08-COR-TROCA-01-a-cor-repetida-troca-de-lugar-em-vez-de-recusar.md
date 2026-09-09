---
sprint: COR-TROCA-01
estado: caducou
posse:
  COR-TROCA-01:
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
    - src/hefesto_dualsense4unix/interface/aba04.py
    - src/hefesto_dualsense4unix/core/led_control.py
bancada: false
depois_de: []
---
> **CADUCOU EM 09/09/2026 — a premissa foi revogada por ela.** Esta sprint
> desenhava a cor repetida TROCANDO de lugar entre os dois controles. Na
> bancada do mesmo dia ela decidiu o oposto: a cor do vizinho ganha um X e o
> clique é IMPEDIDO — *"de forma que me impeça de setar alguma cor de um
> coleguinha"*. As duas não coexistem.
>
> O que sobra vive em [COR-X-01](2026-09-09-COR-X-01-a-cor-do-vizinho-ganha-um-x-em-vez-de-ser-oferecida.md)
> e na decisão `D-0909-A-COR-DE-OUTRO-CONTROLE-SE-RECUSA-COM-X`.


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
* O modelo é o gesto `player` da aba 04 (`a04_iluminacao.py:3091`), que troca
  o número: `identity.number.set` → `led.player_set` por `uniq` → `coop.sync`.
  Os três passos foram medidos um a um (`:2877`): só com o terceiro as
  lâmpadas seguem o número. Siga essa forma, não invente uma segunda —
  e **não procure a troca em `identity.py`**: lá o que existe é `compact()`
  (`:1459`), que renumera, e é outra coisa.
* **Onde a cor MORA decide onde a troca escreve.** Medido em 08/09 na mesa dela
  (`docs/process/2026-09-08-ONDE-PARAMOS-a-coluna-da-direita-e-o-conferente-que-derrubou-a-cura.md` §2):
  a cor tem camadas — `default global < camada AUTOMÁTICA < override por-uniq <
  CO-OP < jogo` (`core/backend_pydualsense._merged_desired_for_key`) — e o
  override por MAC é CONGELADO enquanto o número do jogador é de SESSÃO. Foi
  assim que o P1 e o P2 dela colidiram em `#0000FF`: azul era a cor certa do
  controle no dia em que ele era o 1. Uma troca que escreve só na camada
  automática recolide na próxima conexão; a troca escreve na camada em que a
  cor daquele controle está.
* **Cabo e rádio são o mesmo gesto:** `luz.lightbar.cor@dualsense` está
  `medido`/`O APARELHO OBEDECEU` nos dois transportes desde 12/08. A única
  ressalva de rádio é `luz.lightbar.release_leds` (`parcial`, só rádio) — e ela
  não muda a troca, só o que o aparelho faz depois dela.

## O que MORDE

* duas peças na mesa, a segunda pede a cor da primeira → as duas trocam, e
  **nenhum recado aparece**;
* a faixa do P2 não oferece a cor que o P1 tem;
* a mordida do broadcast continua valendo: `led.set` sem `uniq` pinta os quatro
  da mesma cor DE PROPÓSITO e a troca não pode desfazer isso —
  `BROADCAST-QUE-NAO-MENTE-01`.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo / BT | ✓ a cor obedece nos dois desde 12/08; pronto = a troca provada com um controle em cada transporte (P2 no cabo troca com P4 no rádio) |
| no perfil | ✓ `leds` + `ControllerOverrides.leds` — e é AQUI que a troca escreve, na camada em que a cor daquele controle mora |
| por controle | ✓; a faixa de cores de cada um não oferece a cor que outro já tem |
