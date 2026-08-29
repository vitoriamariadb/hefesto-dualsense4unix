---
sprint: MIGRA-CONTROLES-01
onda: MIGRA-CONTROLES
posse:
  MC1:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - src/hefesto_dualsense4unix/app/widgets/painel_no_jogo.py
cria:
  - src/hefesto_dualsense4unix/gui/webview_de_aba.py
  - tests/unit/test_migra_controles_01_o_enxerto_substitutivo.py
  - docs/process/medicoes/2026-08-29-o-enxerto-substitutivo-quanto-custa-trocar-uma-pagina.md
bancada: false
depois_de:
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 1).
  # Dezoito das 90 sprints de 27/08 declaram posse dele, e correm EM SÉRIE.
  # Estas três são as que abrem a MESMA faixa desta aba:
  - ONDA-CONTROLES-02   # a aba "No jogo" sai e o quadro "Estado" se dissolve
  - ONDA-CONTROLES-07   # os interruptores de sensor
  - ONDA-CONTROLES-08   # calibrar sensores
  # SÉRIE por R5: dividem `app/app.py` com esta.
  - ONDA-SISTEMA-01
  - ONDA-JOGAR-09
  # COLISÃO DE ARQUIVO DECLARADA, não juízo sobre quem vem primeiro. O
  # `check_colisao_de_sprints.py` só aceita duas respostas para duas sprints no
  # mesmo arquivo: `nao_toca` (mentira, eu toco) ou `depois_de` (serializa).
  # Quem decide a ORDEM entre ondas é quem coordena — a fila é a das dez ondas
  # de SPRINT_ORDER.md §1.2. Estas reivindicam `gui/main.glade`,
  # `app/app.py`, `status_actions.py` ou `painel_no_jogo.py`:
  - COOP-NA-CONEXAO-NATIVA-01
  - EMULACAO-UM-DONO-SO-01
  - IDENTIDADE-01
  - LEVA-4
  - MIGRA-ILUMINACAO-07
  - ONDA-CONTROLES-01
  - ONDA-GATILHOS-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-PERFIS-01
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-VIBRACAO-02
  - ONDA-VIBRACAO-06
  - ONDA-SISTEMA-02
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/profiles/
  - novo-layout/
---

# MIGRA CONTROLES · 01 — O enxerto substitutivo, e o id que não pode sumir

**Esta é a primeira sprint de todas as dez ondas, e é a única que ainda mede
alguma coisa.** O enxerto provado em 29/08 foi **ADITIVO** — o `WebView` como
**12ª página** do `Gtk.Notebook` real, 376 objetos em 56 ms, 62 → ~285 MiB PSS.
**Ninguém mediu TROCAR uma página**, e é ali que reaparecem as 60.862 linhas que
hoje chegam aos widgets por `builder.get_object()`.

## O defeito

A página desta aba é `tab_status_box` (`gui/main.glade:295`), dentro de
`scroll_tab_status_box` (`:286`). **Medido em 29/08 na árvore `dev`:** o bloco
inteiro, do `<child>` ao `</child>` do rótulo, vai de **286 a 705** — 420 linhas
— e carrega **18 ids**.

**FATO CORRIGIDO:** o censo desta aba escreveu *"286 à 720"*. A linha 720 já é o
comentário que apresenta a aba "No jogo"; o bloco fecha em **705**.

Dos 18 ids, **15 têm consumidor em `src/`**, e a divisão importa porque diz quem
quebra:

| quem chama | ids |
|---|---|
| `app/actions/status_actions.py` (14) | `tab_status_box`, `status_grid`, `status_daemon`, `status_connection`, `status_transport`, `status_active_profile`, `status_battery_bar`, `status_battery_pct`, `status_battery_caption`, `status_players_slot`, `status_vpad_banner`, `status_wrapper_banner`, `frame_status_estado`, `btn_som_no_controle` |
| `app/widgets/controller_card.py` | `status_players_scroll` |
| `app/app.py:1327` | `frame_status_estado` (o segundo chamador do mesmo id) |
| **ninguém** (3) | `scroll_tab_status_box`, `status_battery_row`, `status_estado_box` |

No dia em que a página virar `WebView`, `builder.get_object()` devolve `None`
para os quinze. **E o módulo é defensivo por toda parte** (`if x is not None`),
então o sintoma não é exceção: é a **AUSÊNCIA DE DADO** — a mesma armadilha
nomeada na memória desta casa para o daemon velho.

### O que quebra sem levantar uma linha de erro

`ABA_STATUS = "tab_status_box"` (`app/actions/status_actions.py:104`) **não é um
widget: é a IDENTIDADE da aba.** Ela é lida em seis lugares —
`status_actions.py:745`, `:2463`, `:3104`, `app/app.py:1076`, `:1226`, `:1584` —
sempre por `id_da_pagina` (`app/actions/home_actions.py:79`), que resolve o nome
com `Gtk.Buildable.get_name`. O docstring de `id_da_pagina_corrente`
(`home_actions.py:112-115`) diz por que a casa fez assim: *"identificar a aba
pelo ÍNDICE passa a apontar para a aba errada, em silêncio, no dia em que
alguém inserir, remover ou reordenar uma página"*.

**Um `WebView` inserido sem nome apaga essa identidade.** Consequências, todas
mudas: `_ALVO_POR_ABA[ABA_STATUS]` nunca casa com a página corrente, a fita
nunca acorda, e o poller que só roda com a aba à vista (`:2463`) para. É o
defeito idêntico ao que o censo da aba 01 achou no `tab_home_box`.

## O que entrega

1. **O `WebView` carrega o nome da página.** `Gtk.Buildable.set_name(webview,
   ABA_STATUS)` — **uma linha**, e é ela que mantém as seis leituras vivas.
   E o `scroll_tab_status_box` **sai junto**: o WebKit rola por dentro, e um
   `GtkScrolledWindow` em volta de um `WebView` é rolagem dupla. Confira que
   `_wrap_notebook_pages_in_scroll` (em `app/app.py`) não o embrulhe de volta.

2. **Um módulo `gui/webview_de_aba.py`, dono único do enxerto nas dez abas**,
   com as três armadilhas medidas já dentro:
   - **os quatro pinos**, nesta ordem: `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
     `WebKit2 4.1`. Com o GTK4 instalado ao lado, um `Gdk` sem pino carrega o
     4.0 e mata o Gtk 3.0 — e só dispara se o `Gdk` vier **antes** do pino do
     `Gtk`;
   - **`load-failed` escutado ANTES de `FINISHED`**: o WebKit commita uma
     página de erro, e quem escuta só FINISHED **reporta sucesso sobre carga
     que falhou**;
   - **o título nunca se lê no handler de FINISHED** — ele chega depois. Nove
     de dez abas voltaram sem título para quem mediu assim.

3. **A aba "No jogo" sai no MESMO abrir do glade.** O bloco é
   `main.glade:724-754` (31 linhas, três ids: `scroll_tab_no_jogo_box`,
   `tab_no_jogo_box`, `tab_no_jogo_label`), com dez referências em
   `app/app.py` e `status_actions.py`, e o conteúdo montado em código por
   `install_no_jogo_tab`. **O diagnóstico não se repete aqui** — ele está
   inteiro na [ONDA-CONTROLES-02](2026-08-27-ONDA-CONTROLES-02-a-aba-que-sai-e-o-quadro-que-se-dissolve.md),
   que esta sprint absorve. O que muda é só a razão de estar junto: **o glade é
   recurso de bancada, e abri-lo duas vezes para a mesma aba paga o preço
   duas vezes.**

4. **A medição, e ela é o produto desta sprint.** Um ensaio que roda os dois
   enxertos **na mesma máquina, no mesmo minuto** — o aditivo (12ª página) e o
   substitutivo (a página trocada) — e grava PSS, tempo de construção do
   builder e contagem de objetos em
   `docs/process/medicoes/2026-08-29-o-enxerto-substitutivo-quanto-custa-trocar-uma-pagina.md`.
   **Um número só não é medição, é anedota.**

## Como se prova (a mordida)

`tests/unit/test_migra_controles_01_o_enxerto_substitutivo.py`:

- **o id sobrevive à troca**: montar o notebook com o `WebView` no lugar da
  página e afirmar `id_da_pagina_corrente(notebook) == ABA_STATUS`. **Arranque
  o `set_name` e veja reprovar** — e confira que reprova pela igualdade, não
  por exceção: um teste que passa a levantar `AttributeError` mudou de assunto;
- **os quinze órfãos são NOMEADOS, não descobertos no uso**: parse do
  `main.glade`, lista dos ids que sumiram, e um AST sobre
  `status_actions.py` + `controller_card.py` + `app.py` afirmando que **nenhum
  deles é mais pedido**. **Devolva um `self._get("status_battery_bar")` e veja
  reprovar.** Esta é a régua que impede o "sintoma é a ausência de dado";
- **carga que falha não é sucesso**: dublê que emite `load-failed` e **depois**
  `load-changed(FINISHED)` — o módulo tem de relatar FALHA. Arranque a escuta
  de `load-failed` e veja o teste dizer "carregou" sobre uma página de erro;
- **o título não se lê no FINISHED**: AST sobre `gui/webview_de_aba.py` —
  nenhuma chamada a `get_title()` dentro do corpo do handler de FINISHED;
- **os quatro pinos, na ordem**: AST — os quatro `require_version`, e o do
  `Gdk` **antes** de qualquer `from gi.repository import`. Arranque o do `Gdk`
  e veja reprovar;
- **a rolagem é uma só**: o pai direto do `WebView` no notebook não é
  `Gtk.ScrolledWindow`;
- **a aba "No jogo" não existe mais**: parse do glade — `tab_no_jogo_box`
  ausente — **e** `ABA_NO_JOGO` fora de `_ALVO_POR_ABA`. O portão da Z2-9
  reprova módulo de aba ausente do mapa; a régua desta sprint tem de reprovar
  também o inverso, o mapa com aba que não existe;
- **a medição é dupla ou não vale**: o documento de medição tem os dois números
  (aditivo e substitutivo) com a mesma marca de tempo. Apague um e o teste
  reprova.

## O que é dela decidir

- **Se o preço subir, o ok de 29/08 não cobre.** Ela aceitou **62 → ~285 MiB
  PSS (4,6×)** sobre o enxerto ADITIVO. Se trocar a página custar mais que
  isso, o número novo volta para ela antes de qualquer outra sprint desta leva
  correr. Se custar **menos**, também: é notícia boa e muda a conta das dez.
- **O que a aba diz com a mesa vazia.** Zero controles é estado legítimo, e o
  mockup não o desenha (pergunta 2 do índice da ONDA-CONTROLES). Sem card não
  há faixa, não há fita e não há acordeão. **Não invente a tela** — relate, e o
  desenho vem dela.

## Colisão declarada

`gui/main.glade` é declarado por **dezoito** das 90 sprints de 27/08
(`SPRINT_ORDER.md` §1.1) e, conferido em 29/08, por **três** `MIGRA-*` de outras
ondas: `MIGRA-SISTEMA-01`, `MIGRA-GATILHOS-03` e `MIGRA-PERFIS-01`. As de
Conexões e Lançadores o põem no `nao_toca`, de propósito. **Uma sprint por vez em
toda a casa.** Se outra onda estiver em voo, quem coordena serializa; não resolva
conflito de Glade sozinho.
