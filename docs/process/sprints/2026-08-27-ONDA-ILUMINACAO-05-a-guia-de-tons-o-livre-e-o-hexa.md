---
sprint: ONDA-ILUMINACAO-05
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM05:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - src/hefesto_dualsense4unix/gui/widgets/guia_de_cores.py
  - tests/unit/test_ilum_05_a_guia_de_cores.py
bancada: false
depois_de:
  - ONDA-ILUMINACAO-04
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/core/led_control.py
---

# ONDA ILUMINAÇÃO · 05 — A guia de tons, o livre e o hexa

**O defeito, em uma frase:** escolher a cor da barra custa **abrir um diálogo**
— e o mockup aprovado põe as cores na mão, em fila, com o seletor livre só no
fim.

## Onde está hoje, medido

- um `GtkColorButton` só: `lightbar_color_button` (`gui/main.glade:1233`), com
  `on_lightbar_color_set` (`lightbar_actions.py:852`);
- o envio ao soltar já existe e é o precedente certo: `_fiar_aplicar_ao_soltar`
  (`:770`) e `_on_lightbar_cor_solta` (`:814`) — a fiação é **em código e não no
  glade**, de propósito (o comentário em `:797` diz por quê);
- não há guia de tons em lugar nenhum do produto.

## O que entrega

Um widget novo, `gui/widgets/guia_de_cores.py`, usado na seção "Cor e brilho":

1. **Oito quadradinhos em fila**, o escolhido com a borda grossa
   (`.guia .tom.on{border-color:var(--fg);border-width:2px}` no mockup).
2. **O nono é o livre** — abre o seletor de cor de sempre, para o tom que não
   está na guia. O mockup o desenha como quadrado hachurado
   (`novo-layout/_ferramentas/aba04.py`, `.guia .livre`), e a dica do quadro já
   explica: *"O último quadradinho da guia é o livre"*
   (`novo-layout/04-iluminacao.html:503`).
3. **O hexa à direita**, em fonte monoespaçada: `#FF2D6F`. É um dos três valores
   que o contrato manda ficar visíveis na tela.
4. **Clicar num tom envia ao controle**, pelo mesmo caminho do
   `_on_lightbar_cor_solta` de hoje — nada de rota nova.
5. **O brilho vira barra com número ao lado**, na mesma grade de duas colunas da
   Cor (a correção literal dela). O envio continua **ao soltar**
   (`on_lightbar_brightness_changed`, `:995`), nunca por pixel.

## A mordida

`tests/unit/test_ilum_05_a_guia_de_cores.py`:

- **um envio por clique**: clicar num tom chama o envio **uma** vez; clicar no
  mesmo tom de novo não reenvia (é o defeito irmão do "um comando por pixel" que
  a aba Vibração está pagando);
- **o hexa acompanha**: escolhido `#50FA7B`, o rótulo diz `#50FA7B` — em
  MAIÚSCULA e com a cerquilha, como o mockup;
- **o livre não é um tom**: escolher uma cor fora da guia deixa **nenhum**
  quadradinho marcado e o hexa com a cor nova;
- **o dublê sabe recusar**: com o daemon dizendo não, o toast é de falha e a
  marcação **não** muda — a tela não pode dizer que aplicou o que não aplicou
  (APLICAR-VERDADE-01).

Arranque o guarda do envio único e o primeiro caso reprova com duas chamadas.

## O que é dela decidir

**Quais são os oito tons da guia?** São duas listas vivas, e são diferentes:

- a do mockup, decorativa, herdada da paleta da janela:
  `#ff2d6f #55bdf8 #50fa7b #f1fa8c #bd93f9 #ffb86c #8be9fd #ff5555`
  (`novo-layout/_ferramentas/aba04.py`, `TONS`);
- a do produto, canônica, uma por número de jogador:
  `azul · vermelho · verde · rosa · amarelo · ciano · laranja · roxo`
  (`core/led_control.py:146-155`).

A segunda tem uma vantagem medida: ela é **a mesma paleta** que o "Voltar ao
automático" devolve e que a ILUM-07 usa para deslocar cor repetida — escolher da
guia e escolher o automático passariam a falar a mesma língua. A primeira é a
que ela viu e aprovou na tela. **É dela.**

## Fontes

- mockup: `novo-layout/04-iluminacao.html:667-693`;
- correção literal dela: *"a Largura do Brilho deve ser igual a largura da Cor"*
  (`novo-layout/_ferramentas/CORRECOES-DELA.md`).
