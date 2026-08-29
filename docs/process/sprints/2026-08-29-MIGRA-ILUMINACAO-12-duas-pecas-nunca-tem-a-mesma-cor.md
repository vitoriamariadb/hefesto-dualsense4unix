---
sprint: MIGRA-ILUMINACAO-12
onda: MIGRA-ILUMINACAO
posse:
  IL12:
    - src/hefesto_dualsense4unix/core/led_control.py
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_migra_iluminacao_12_duas_pecas_nunca_iguais.py
bancada: false
depois_de:
  - LEVA-1
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - ONDA-ILUMINACAO-07
  - ONDA-ILUMINACAO-08
  - ONDA-ILUMINACAO-09
  # A FILA INTEIRA que vem antes desta, e ela é longa de propósito: nove das doze
  # abrem `app/actions/lightbar_actions.py` e cinco abrem `_ferramentas/aba04.py`.
  # Quem divide arquivo executa EM SÉRIE (R5), e o portão de colisão não faz fecho
  # transitivo — por isso a fila se escreve inteira, como na ONDA-SISTEMA-02.
  - MIGRA-ILUMINACAO-01
  - MIGRA-ILUMINACAO-03
  - MIGRA-ILUMINACAO-11
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-04
  - MIGRA-ILUMINACAO-05
  - MIGRA-ILUMINACAO-06
  - MIGRA-ILUMINACAO-07
  - MIGRA-ILUMINACAO-08
  - MIGRA-ILUMINACAO-09
  - MIGRA-ILUMINACAO-10
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA ILUMINAÇÃO · 12 — Duas peças nunca têm a mesma cor

## O defeito

`D-DUAS-PECAS-NUNCA-TEM-A-MESMA-COR` é regra do produto, **sempre** — e **não
existe uma linha dela em `src/`**.

Na tela de hoje isso quase nunca aparece: a aba ajusta **um** controle por vez, e
provocar a colisão pede duas visitas e memória. **Na tela nova a guia tem oito
tons e as colunas estão lado a lado: dar a duas o mesmo tom é UM CLIQUE.**

E a colisão não é cosmética. A cor da barra é **como ela sabe de quem é o
controle** — o próprio mockup diz, na dica do quadro (`aba04.py:359-361`):

> *"O plástico é físico e pode se repetir; a **luz** é o que nunca se repete — é
> ela que separa dois controles do mesmo modelo."*

Na mesa dela isso é literal: **dois controles do mesmo modelo ficam com a mesma
borda**, e a barra é a única coisa que os separa.

O automático **nunca colide** — `player_slot_color` (`core/led_control.py:158`,
tabela em `:147-156`) dá um tom por número. **A colisão nasce só do manual**, que
é justamente o gesto que esta aba multiplica por N.

## O que entrega

1. **A regra ganha um dono único, com nome, em `src/`.** Uma função, um lugar.
   **Quem executar escolhe o lado** — o daemon (que já é o dono da mesa) ou a
   GUI (que é onde o gesto nasce) —, e a mordida é a mesma nos dois.
2. **Ao escolher um tom já usado por outra coluna, o produto desloca para o tom
   vizinho e DIZ que deslocou**, com o nome do controle que já tinha aquele tom.
3. **O aviso é frase de diagnóstico desta casa: o quê, por quê e o que fazer.**
   Não "cor ajustada"; *"o Starlight Blue já está nesse tom, então o Cosmic Red
   ficou com o vizinho — escolha o livre se quiser outro."*
4. **O automático não entra na conta.** Ele já não colide, e misturá-lo é onde a
   regra fica ambígua.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_12_duas_pecas_nunca_iguais.py`:

- **duas colunas, o mesmo tom.** Peça o tom do Player 1 na coluna B quando a
  coluna A já o tem. **Saem duas cores distintas, e a frase aparece com o nome do
  outro controle. Arranque a regra e as duas ficam iguais** — reprova. Devolva.
- **a régua conta CORES, não cliques.** Ela lê os N `data-campo="cor-hex"` do DOM
  e exige **N valores distintos**. Um censo que pergunte *"há duas cores na
  tela?"* diz **sim** com o defeito vivo — **o defeito não apaga cor, ele muda
  de lugar**. Foi a terceira das seis réguas falsas de 29/08, e ela passou pelo
  mesmo raciocínio.
- **o vizinho é determinista.** O mesmo estado dá sempre o mesmo deslocamento.
  Uma regra que dependa de ordem de iteração de `dict` ou de hora do relógio
  produz duas telas diferentes para a mesma mesa.
- **a mesa cheia recusa, e não gira para sempre.** Com 8 controles e os 8 tons
  ocupados, o nono pedido **recusa com motivo** em vez de entrar em laço. Uma
  cura que só procure "o próximo livre" trava aqui — e é o estado que o produto
  cobre (1..8, `core/led_control.py:105-114`).
- **o "livre" também colide.** O `<input type="color">` pode escolher exatamente
  o hexa que outra coluna tem. Se a régua só olhar os oito tons da guia, ela é
  cega ao caminho mais fácil de provocar o defeito.
- **a cor por controle sobrevive ao brilho.** Já houve um defeito medido nesta
  vizinhança: arrastar o brilho em "Todos" apagava o campo de cor de **todos** os
  ajustes por controle (`lightbar_actions.py:495-507`). O teste confere que
  deslocar um tom não derruba os outros.

## O que é dela decidir, e trava a sprint inteira

1. **O que é "o tom vizinho"?** O próximo de `_PLAYER_SLOT_COLORS`
   (`core/led_control.py:147-156`), que é a ordem que o automático usa — ou o
   próximo na guia, que é a ordem que ela vê?
2. **Ela pode forçar duas iguais?** A regra diz *"nunca"*. Se **nunca** for mesmo
   nunca, o produto **recusa** e ela não consegue. Se for *"avisa e obedece"*, ele
   **desloca** e ela pode desfazer. **São produtos diferentes**, e a diferença
   aparece no primeiro clique.
3. **A regra vale sobre a cor DECLARADA por ela, ou só sobre a escolhida agora?**
   Um perfil salvo com duas iguais tem de ser corrigido ao carregar, ou
   respeitado?
