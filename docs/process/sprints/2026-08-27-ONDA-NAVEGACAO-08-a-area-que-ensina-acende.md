---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-08
posse:
  NAV-H:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/gui/widgets/button_glyph.py
cria:
  - src/hefesto_dualsense4unix/app/widgets/area_que_ensina.py
  - tests/unit/test_nav_area_que_ensina_acende.py
bancada: true
depois_de:
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-GATILHOS-02
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/app/actions/
  - src/hefesto_dualsense4unix/app/app.py
---

# ONDA NAVEGAÇÃO · 08 — A área que ensina acende

## O defeito, em uma frase

A área que ensina os gestos é um **cartaz de rótulos numa aba que vai morrer**, e
o gesto mais útil dela — o PS + R3, que funciona desde 19/08 — nunca apareceu em
tela nenhuma: só um comentário de código o conhecia.

## O que está medido

- `gui/main.glade:3212` `emulation_combo_grid` — o quadro dos combos, na aba
  Emulação, que a D-A-EMULACAO-MORRE dissolve (`/tmp/coleta/decisoes.md:175`).
  Rótulos e nada mais; `:3298` "Buffer:", `:3311` "Passthrough em emulação".
- `integrations/hotkey_daemon.py:142` — o PS + R3, com o pedido dela de 19/08
  escrito no comentário e **nenhuma tela**.
- `daemon/subsystems/hotkey.py:38` `build_ps_solo_callback` + `hotkey_daemon.py:154`
  `ps_toque_curto_teto_ms` — o toque curto no PS abre e foca a Steam; segurar
  mais de 0,7 s é outro gesto. Nenhuma tela.
- **O que reusar, e ela pediu por escrito:** `gui/widgets/button_glyph.py` — os
  glifos SVG por botão, com variante acesa e tintura pela cor do lightbar
  (`set_pressed`, `set_accent`). A aba Controles já os acende ao vivo
  (`app/widgets/controller_card.py:5265` `_refresh_glyphs`, `:5290`
  `glyph.set_pressed`).

> "no navegação faltou usar os svgs que já usamos em status."
> — 27/08/2026, `/tmp/coleta/hoje.md:240`

> "Se for pros botões do dualsense acenderem igual temos hoje na aba status ok."
> — `novo-layout/_ferramentas/CORRECOES-DELA.md`

## O que entrega

O quadro "Os gestos do controle" do mockup (`novo-layout/06-navegacao.html`,
bloco `.gestos`), com as duas metades:

1. **À esquerda, o desenho do DualSense** com os botões do gesto marcados —
   `assets/control-svg/dualsense.svg` tem os ids nomeados e as cinco cores de
   plástico, está pronto desde 11/08 e **nenhum widget o carrega** (`grep -rn
   "control-svg" src/` devolve zero; só os scripts do mapa o usam,
   `scripts/gerar-mapa.py:91`). Embaixo dele, a legenda "P1 · Cosmic Red · USB".
2. **À direita, as cinco linhas de gesto**, cada uma com os glifos do combo
   (`button_glyph.py`, os mesmos da aba Controles) e o dropdown da ação
   (a tabela da ONDA-NAVEGACAO-07):
   PS + Options · PS + ↑ · PS + ↓ · PS + R3 · toque curto no PS.
3. **Os glifos acendem ao apertar de verdade** — o mesmo caminho de
   `_refresh_glyphs`, e a linha inteira muda de cor enquanto o combo está sendo
   feito (`.gesto.agora` no mockup).
4. **O buffer vira dica:** "apertar os dois em até 0,15 s conta como combo". O
   "Passthrough em emulação" sai (`main.glade:3311`).

## Como se prova (o teste que morde)

`tests/unit/test_nav_area_que_ensina_acende.py`, em `Gtk.OffscreenWindow`:

1. **Os cinco gestos estão na tela**, com o par de botões que o catálogo
   (ONDA-NAVEGACAO-03) declara — inclusive o PS + R3 e o toque curto no PS, que
   é o que fecha a dívida de "existe no código e nunca teve tela".
2. **Os glifos são os da aba Controles:** o widget instanciado é `ButtonGlyph`,
   lendo de `GLYPHS_DIR`. Um ícone desenhado à mão nesta aba reprova.
3. **Acender é acender:** injetar `buttons_pressed={"ps","r3"}` põe os dois
   glifos daquela linha em `pressed=True` e **nenhum** das outras linhas.
4. **A régua sabe recusar:** com o conjunto vazio, nenhum glifo fica aceso —
   uma régua que acende sempre não mede nada.
5. **O desenho do controle está carregado:** a área desenha o
   `assets/control-svg/dualsense.svg` (não um placeholder), e os botões do gesto
   aparecem marcados nele.
6. **O buffer não é número na tela:** "150" não aparece em rótulo visível; a
   frase de 0,15 s existe como dica.
7. **A mordida:** arrancar a propagação do `buttons_pressed` e ver 3 reprovar;
   trocar o `ButtonGlyph` por um `GtkLabel` e ver 2 reprovar. Colar as saídas.

## A prova de tela

`retratar_abas.py` antes e depois. E, porque o item 3 depende de aperto real, o
**teste de bancada** com o controle na mão dela: apertar PS + R3 e ver a linha
acender. `bancada: true` por causa disto — `scripts/bancada.sh exigir` antes.

## O que é dela decidir

1. **O desenho do controle mostra qual controle?** O mockup fixa "P1 · Cosmic Red
   · USB". A fita do topo está **apagada** nesta aba de propósito (o PC tem um
   cursor só, ONDA-NAVEGACAO-06), então o desenho tem de escolher sozinho: o
   controle que comanda o PC, ou o P1 sempre?
2. **O toque curto no PS ganha linha mesmo?** Ele não é combo — é um toque só, e
   segurar por mais de 0,7 s já é outro gesto (religar o controle). Pô-lo na
   mesma lista dos combos ensina os dois de uma vez; separá-lo evita a leitura de
   que "PS sozinho" é um combo com um botão.
</content>
