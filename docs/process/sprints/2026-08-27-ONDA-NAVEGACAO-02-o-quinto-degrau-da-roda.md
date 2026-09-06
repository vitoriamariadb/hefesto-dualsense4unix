---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-02
estado: absorvida
posse:
  NAV-B:
    - src/hefesto_dualsense4unix/integrations/ponte_escada.py
    - src/hefesto_dualsense4unix/daemon/launch_env.py
cria:
  - tests/unit/test_nav_quinto_degrau_teclado_e_mouse.py
bancada: false
depois_de:
  - ONDA-NAVEGACAO-01
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/integrations/ponte_escada.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-JOGAR-03
  - ENGASGO-VULKAN-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/integrations/hotkey_daemon.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA NAVEGAÇÃO · 02 — O quinto degrau da roda

## O defeito, em uma frase

A roda que o **PS + R3** gira tem quatro degraus e o quinto — Teclado + Mouse —
**existe no código e ficou de fora da escada**: quem esgotou os quatro modos de
gamepad não tem para onde subir.

## O que está medido

- `integrations/ponte_escada.py:253` — a tupla `ESCADA` tem exatamente quatro
  `Degrau`: DualSense do Hefesto, Xbox 360, Conexão Nativa (Sony), DualSense +
  Steam Input.
- `integrations/ponte_escada.py:169` — `KIND_DESKTOP = "desktop"` existe.
- `integrations/ponte_escada.py:334` e `:354` — as duas validações **já aceitam**
  `KIND_DESKTOP`; `daemon/launch_env.py:1271` já o trata em exceção. Ou seja: o
  tipo é de primeira classe em todo lugar **menos** na escada.
- `integrations/hotkey_daemon.py:142` `DEFAULT_COMBO_PONTE = ("ps", "r3")` — o
  gesto que gira a roda, default desde 19/08, por pedido dela.

Decisão dela: **D-O-QUINTO-DEGRAU-DA-RODA** (`/tmp/coleta/decisoes.md:210`) —
*"ENTRA O QUINTO, NO FIM: Teclado+Mouse (o `KIND_DESKTOP`, que já existe no
código e ficou de fora da escada). É o último recurso."*

## O que entrega

1. Um quinto `Degrau` no fim da `ESCADA`, com `Ponte(KIND_DESKTOP)`, o `porque`
   escrito ("se nenhum modo de gamepad serviu, o jogo provavelmente só aceita
   teclado e mouse") e os três preços declarados como os outros quatro:
   `recria_vpad`, `exige_reabrir_jogo`, `exige_fechar_steam`.
2. Chegar neste degrau **liga a emulação** pela porta da ONDA-NAVEGACAO-01: é o
   estado `pelo_gesto` do `resolver_ativacao`, não um segundo caminho.
3. Sair dele devolve o degrau anterior e desliga o que ligou.

**A ordem dos quatro primeiros não muda.** A justificativa de cada um está
escrita no `porque` deles e é medição, não gosto (`ponte_escada.py:253-300`).

## O que NÃO entra

A roda **não aparece nesta aba**. Ela pediu, em 27/08: *"aquela parte de roda dos
pontos some também. nesse espaço era pra termos as opções de ativação que
conversamos"* (`/tmp/coleta/hoje.md:262`). A escolha do modo de conexão fica na
aba **Jogar**; aqui só existe a **linha do gesto** PS + R3 dizendo o que ele faz
(ONDA-NAVEGACAO-08).

## Como se prova (o teste que morde)

`tests/unit/test_nav_quinto_degrau_teclado_e_mouse.py`:

1. **A escada tem cinco, e o quinto é o desktop:** `len(ESCADA) == 5` e
   `ESCADA[-1].ponte.kind == KIND_DESKTOP`.
2. **A ordem dos quatro anteriores é a de hoje** — compara a tupla dos quatro
   primeiros com a lista literal; um degrau reordenado reprova.
3. **A volta ao topo:** girar cinco vezes a partir do primeiro degrau devolve o
   primeiro degrau (a roda fecha, não trava no fim).
4. **A ativação é a da 01:** chegar no quinto degrau com o perfil em `pelo_gesto`
   liga mouse e teclado; com o perfil em `nunca`, **não liga** — é o perfil que
   manda, o gesto só informa o degrau.
5. **A mordida:** remover o quinto `Degrau` da tupla e ver 1, 3 e 4 reprovarem;
   colar as duas saídas na entrega.

## O que é dela decidir

1. **`recria_vpad` no quinto degrau:** subir para teclado+mouse destrói o gamepad
   virtual (deixa de haver controle para o jogo) ou o vpad fica de pé ao lado do
   mouse? O primeiro é mais honesto com o nome do degrau; o segundo não fecha a
   porta de volta se o jogo estava usando o vpad.
2. **A recusa no Modo Nativo:** o terceiro degrau exige reabrir o jogo
   (`exige_reabrir_jogo=True`). Girar do terceiro para o quarto e para o quinto
   com jogo aberto deve **recusar com motivo** (como o rumble faz no Modo
   Nativo — memória: *o rumble no Modo Nativo desarma a HARM-16*), ou pular o
   degrau que não alcança e avisar?
</content>
