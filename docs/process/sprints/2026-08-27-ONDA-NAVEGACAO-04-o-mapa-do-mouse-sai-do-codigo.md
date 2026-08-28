---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-04
posse:
  NAV-D:
    - src/hefesto_dualsense4unix/integrations/uinput_mouse.py
    - src/hefesto_dualsense4unix/core/keyboard_mappings.py
    - src/hefesto_dualsense4unix/profiles/schema.py
cria:
  - src/hefesto_dualsense4unix/core/disputa_de_botao.py
  - tests/unit/test_nav_mapa_do_mouse_e_a_disputa.py
bancada: false
depois_de:
  - ONDA-NAVEGACAO-01
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/profiles/schema.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-05
  - ONDA-GATILHOS-04
  - EMULACAO-UM-DONO-SO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/integrations/hotkey_daemon.py
---

# ONDA NAVEGAÇÃO · 04 — O mapa do mouse sai do código, e a disputa deixa de ser muda

## O defeito, em uma frase

Os oito pares do **Mapeamento** são um dicionário cravado no código e um texto
fixo na tela; e dar uma tecla ao **○** faz o botão fazer **as duas coisas em
silêncio** — o mapa de mouse e a lista de atalhos não se conhecem.

## O que está medido

- `integrations/uinput_mouse.py:94` — `{"cross": "BTN_LEFT", "triangle":
  "BTN_RIGHT", "r3": "BTN_MIDDLE"}`, hardcoded; `:110` — `{"circle":
  "KEY_ENTER", "square": "KEY_ESC"}`, idem; `:306-320` — L2 injeta `cross`
  virtual, R2 injeta `triangle`, e o filtro só deixa passar `cross`/`triangle`/`r3`.
- `gui/main.glade:3861` (grid `mouse_mapping_grid`) — os oito pares são **rótulos
  fixos** em `GtkLabel`. Nada lê o mapa real; se o mapa mudar, a tela mente.
- `core/keyboard_mappings.py:41` `DEFAULT_BUTTON_BINDINGS` — a lista de atalhos,
  também hardcoded, e `profiles/schema.py:958` `key_bindings` já a grava por
  perfil. **O mouse tem `ProfileMouseConfig` sem mapa; o teclado tem mapa sem
  ativação.** As duas metades nunca se olharam.
- O ○ aparece nos dois: `uinput_mouse.py:110` dá `KEY_ENTER` a ele, e a lista de
  atalhos de fábrica também pode dar. O mockup pinta essa linha de **laranja**
  nas duas tabelas (`aba06.py`, `MAPA` e `ATALHOS`, terceiro campo `True`).

## O que entrega

1. O mapa de mouse deixa de ser constante: nasce do mesmo lugar que os atalhos —
   um mapa por perfil, com `DEFAULT_BUTTON_MAP` de fábrica preservado como
   default. Os oito pares do mockup são o conteúdo de fábrica.
2. As nove ações de mouse do mockup (`aba06.py`, `ACOES_MOUSE`) viram o
   vocabulário aceito: botão esquerdo · direito · do meio · movimento do cursor ·
   rolagem vertical e horizontal · setas do teclado · Enter · Esc · — nada —.
3. `core/disputa_de_botao.py` — a régua que responde *"este botão tem dono em
   mais de uma tabela?"*, recebendo o mapa de mouse e as `key_bindings` e
   devolvendo a lista de botões disputados com **qual** é o outro dono.
4. `L2 → cross` e `R2 → triangle` (`uinput_mouse.py:306`) continuam sendo o
   mesmo par na tela, como o mockup desenha (`gl("cross","l2")`) — não são duas
   linhas.

## Como se prova (o teste que morde)

`tests/unit/test_nav_mapa_do_mouse_e_a_disputa.py`:

1. **O de fábrica não mudou:** o mapa default resolve exatamente os oito pares de
   hoje, um a um. Um par trocado por descuido reprova.
2. **O mapa do perfil vence:** perfil que dá `— nada —` ao ○ faz o dispatch
   **não** emitir `KEY_ENTER`; perfil que dá "botão do meio" ao □ emite
   `BTN_MIDDLE`.
3. **A disputa é achada e nomeada:** ○ com `KEY_ENTER` no mapa de mouse **e**
   uma tecla em `key_bindings` devolve exatamente um botão disputado, com os
   dois donos na resposta.
4. **A régua sabe recusar:** ○ com dono em uma tabela só devolve **lista vazia** —
   uma régua que acusa disputa sempre é a régua falsa que esta casa já pegou três
   vezes num dia (memória: *o instrumento mente mais que o produto*).
5. **A mordida:** arrancar `disputa_de_botao` do caminho e ver 3 reprovar;
   trocar um par do default e ver 1 reprovar. Colar as duas saídas.

Portão que tem de continuar verde: `scripts/check_paridade_transporte.py` — o
mapa de canais (`docs/data/mapa-controles.csv`) responde por quais canais chegam
ao jogo em cada transporte, e nada aqui pode afirmar mais do que a linha dele.

## O que é dela decidir

1. **O mapa de mouse é por perfil ou da máquina?** Os atalhos de teclado já são
   por perfil (`schema.py:958`). Simetria diz "por perfil"; o argumento contrário
   é o mesmo do gesto: quem navega o desktop navega igual em todo jogo.
2. **O que a tela faz com a disputa?** O mockup só **avisa**, em laranja: *"o ○
   tem tecla na lista ao lado — hoje ele faz as duas coisas, em silêncio"*. As
   opções são avisar (o desenho), recusar a segunda atribuição, ou deixar
   escolher qual vence. Avisar é o que o mockup mostra e é o mínimo honesto.
3. **As três regiões do touchpad** (`keyboard_mappings.py:60-62`) ganham linha na
   tabela? Hoje o perfil as guarda e o daemon não as dispara — o touchpad voltou
   a ser o ponteiro do sistema (`daemon/subsystems/keyboard.py:393`
   `_combine_with_touchpad`), e a decisão de 09/08 foi não listar botão que não
   dispara. É a pergunta 1 do contrato da aba; o mockup as deixa **na dica**.
</content>
