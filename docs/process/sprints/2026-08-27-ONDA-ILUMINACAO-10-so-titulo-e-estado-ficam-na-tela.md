---
sprint: ONDA-ILUMINACAO-10
estado: absorvida
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM10:
    - src/hefesto_dualsense4unix/gui/main.glade
cria:
  - tests/unit/test_ilum_10_so_titulo_e_estado_na_tela.py
bancada: false
depois_de:
  - ONDA-ILUMINACAO-06
  - ONDA-ILUMINACAO-09
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
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 04). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA ILUMINAÇÃO · 10 — Só título e estado ficam na tela

**O defeito, em uma frase:** a explicação ocupa a tela em vez de esperar o
ponteiro — e a aba já é a mais enxuta da janela, o que a torna o lugar certo de
provar a regra.

## Onde está hoje, medido

A aba tem **13 textos fixos** (contrato, seção 4). Os que a regra manda recolher:

- `Escolha a cor da barra de LED do DualSense.` (`gui/main.glade:1186`) —
  título disfarçado de frase;
- `auto_player_colors_subtitle` (`:1214`) — o parágrafo que explica as cores
  automáticas, mais a ressalva do "Todos";
- os dois recados que hoje só existem no rodapé (toasts do D4 e do "Voltar ao
  automático") — o do D4 **não** vira dica, vira linha na seção (ILUM-06),
  porque é consequência de um clique dela;
- `player_leds_note` (`:1642`) e `player_leds_auto_note` (`:1662`) já saíram com
  o painel, na ILUM-04.

Ficam **visíveis**: os títulos das quatro seções, os rótulos dos botões, os três
valores (a cor, o número do brilho, o número do jogador), e o aviso do estado da
barra **quando há algo errado** — silêncio quando está tudo bem
(`lightbar_estado_no_controle`, com a regra de esconder em
`lightbar_actions.py:670-676`).

## O que entrega

1. **Um "?" por quadro**, com o conteúdo já escrito no mockup aprovado:
   - o do quadro Iluminação: `layout/04-iluminacao.html:500-507`;
   - o de "Selecione o player": `:706-714`.
   O padrão de widget já existe nesta casa — `Gtk.Label(label="?")` com dica,
   como em `app/actions/config/secao_mesa.py:692` e
   `app/widgets/external_card.py:714`. **Copia-se o que há; não se inventa um
   segundo jeito de fazer "?"**.
2. **Toda explicação recolhida** vira dica do "?" ou `tooltip-text` do próprio
   botão — os textos dos botões do mockup já estão escritos nos `title=`
   (`layout/04-iluminacao.html:699-700`).
3. **Nenhum texto se perde**: o que sai da tela entra na dica. É a diferença
   entre recolher e apagar.

## A mordida

`tests/unit/test_ilum_10_so_titulo_e_estado_na_tela.py`, lendo o `main.glade`
como XML:

- **teto de textos visíveis**: contar os `GtkLabel` sem dica da aba e exigir que
  sejam **só** os títulos de seção e os rótulos de valor, por lista nomeada.
  Um `GtkLabel` novo e solto reprova, e é para isso que a régua existe;
- **nada se perdeu**: cada frase recolhida aparece **em alguma** dica da aba. A
  régua compara os textos do arquivo de antes com os `tooltip-text` de depois —
  **é essa metade que separa recolher de apagar**;
- **o aviso de estado continua podendo calar**: `lightbar_estado_no_controle`
  segue sem texto fixo no glade (quem escreve é o código).

Arranque uma dica e o segundo caso reprova nomeando a frase que sumiu do
produto.

**Prova de tela obrigatória**: foto da aba com e sem o ponteiro sobre o "?"
(`docs/process/COMO-OLHAR-A-TELA.md`; `retratar_dialogos.py` para os estados).

## O que é dela decidir

**Todo texto novo é dela** — regra do protocolo (`COMO-EXECUTAR-UMA-SPRINT.md`,
§8: *"Não é sua nenhuma destas: texto novo de tela…"*). Aqui a sorte é que as
duas dicas grandes **já estão escritas no mockup que ela aprovou** — quem
executar copia de lá, palavra por palavra, e só marca como `PROVISÓRIO` o que
não estiver no mockup.

## Fontes

- decisão: **D-TUDO-QUE-EXPLICA-VIRA-DICA**;
- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4, "O que
  fica na tela e o que vira dica";
- mockup: `layout/04-iluminacao.html`.
