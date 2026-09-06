---
sprint: ONDA-SISTEMA-04
estado: absorvida
# onda: SISTEMA
posse:
  S4:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/gui/theme.css
cria:
  - tests/unit/test_onda_sistema_04_o_cartao_de_saude.py
bancada: false
depois_de:
  - ONDA-SISTEMA-03
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
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/integrations/storm_doctor.py
  - src/hefesto_dualsense4unix/cli/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 09). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA SISTEMA · 04 — O cartão de saúde vira linhas, e a explicação vira dica

**O defeito:** as seis a oito linhas do exame são **um único `GtkLabel` com
markup** — não há linha, não há selo, não há "?" e não há como pôr a
explicação numa dica; e a mais longa tem 311 caracteres na tela.

## O que existe hoje

- `gui/main.glade:2824` — `storm_card`, com **um** `storm_diag_label`
  (`:2836`) que recebe todas as linhas juntas, separadas por `\n`;
- `app/actions/daemon_actions.py:1095` — `_refresh_storm_diag`, que monta o
  markup e pinta o label em `_apply_storm_diag:1152`;
- as duas linhas extras que a GUI acrescenta ao exame:
  `medir_guarda_do_steam_input:735` (vigia do Steam Input morto) e
  `medir_prontuario_dos_jogos:807` (ponte divergente) — **ficam**, é requisito
  do "Nada se perdeu" (redesenho, linha 574).

Contrato: redesenho, linhas 524-525 ("O cartão encolhe na tela e cresce na
dica") e 546. Mockup: `layout/09-sistema.html`, quadro **Saúde do
sistema**; gerador em `src/hefesto_dualsense4unix/interface/aba09.py:56` (`saude()`) — a
forma é `[selo] veredito … [?]`, com a dica ancorada à direita.

## O que entrega

1. **Uma linha por achado**, construída em código (não no Glade — o número de
   linhas é 6 a 8 e varia): `GtkListBox` ou `GtkBox` vertical dentro do
   `storm_card`, cada linha com **selo** (`OK`/`WARN`/`INFO`, largura fixa,
   fundo colorido como no mockup), **veredito**, e um **"?"** cuja
   `tooltip-markup` traz *o que eu vi / por que importa / o que fazer*.
2. **A GUI passa a ler a forma detalhada**: `_refresh_storm_diag` troca
   `storm_report()` por `storm_report_detalhado()` (ONDA-SISTEMA-03), e
   `medir_guarda_do_steam_input` / `medir_prontuario_dos_jogos` passam a
   devolver `LinhaDeSaude` também — as oito linhas com a mesma forma.
3. **A conta no cabeçalho do quadro**: *"7 linhas · 1 com aviso"*, como no
   mockup. Ela é derivada da lista, nunca escrita à mão.
4. **A cor nunca sozinha**: o selo é texto (`OK`/`WARN`/`INFO`) **e** cor.
   Quem não distingue verde de laranja lê o selo — é a razão pela qual o
   mockup usa os dois (`aba09.py:17`).
5. **`theme.css`**: as três classes de selo, no molde das cores que a GUI já
   usa (`#50fa7b`, `#ffb86c`, `#8b8fa8` — `daemon_actions.py:1134`).

## Como se prova (a mordida)

`tests/unit/test_onda_sistema_04_o_cartao_de_saude.py`, com
`Gtk.OffscreenWindow` (sob Xvfb não há gerenciador de janelas, e uma
`Gtk.Window` fica 1x1 para sempre — `COMO-OLHAR-A-TELA.md`):

- **uma linha por achado**: um exame dublê de 7 `LinhaDeSaude` produz **7**
  linhas-filhas no cartão, na ordem. Devolva o label único e veja reprovar;
- **a explicação saiu da tela**: nenhum texto **visível** do cartão contém
  `o_que_vi`, `por_que_importa` ou `o_que_fazer`; e a `tooltip-markup` do "?"
  daquela linha contém os três. É o teste que distingue *mover* de *duplicar*;
- **o teto da tela**: nenhum texto visível do cartão passa de 80 caracteres —
  inclusive a linha de Steam Input com dois jogos citados (o caso de 311);
- **a conta bate**: 7 linhas com 1 `WARN` → o cabeçalho diz `7` e `1`. Troque
  o exame para 8/2 e a conta acompanha (conta escrita à mão passaria no
  primeiro caso e reprovaria neste — é para isso que o segundo caso existe);
- **o exame não some quando falha**: `storm_report_detalhado` levantando
  exceção deixa o cartão com uma linha honesta ("não consegui examinar"),
  nunca vazio. Hoje `_refresh_storm_diag:1119` só registra no log e **volta
  calado** — o cartão fica com o texto do bootstrap, que é uma foto velha
  passando por medição de agora.

## O que é dela decidir

- **Pergunta 2 do "falta decidir"** (redesenho, linha 594): *numa linha
  `[WARN]`, o conserto aparece na tela ou só no hover?* O mockup aprovado põe
  **só no hover**; siga o mockup e **marque `PROVISÓRIO — decisão dela`** na
  linha do código que escolhe. A regra desta casa (toda frase de diagnóstico
  diz o quê, por quê e o que fazer) continua satisfeita — o conserto existe,
  em `o_que_fazer`; o que está em jogo é onde ele aparece.
- **O texto da conta** ("7 linhas · 1 com aviso") vem do mockup.
