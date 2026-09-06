---
sprint: MIGRA-JOGAR-01
estado: caducou
onda: MIGRA-JOGAR
posse:
  J1:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/home_actions.py
cria:
  - tests/unit/test_migra_jogar_01_a_pagina_no_lugar_da_home.py
bancada: false
depois_de:
  - COOP-NA-CONEXAO-NATIVA-01
  - EMULACAO-UM-DONO-SO-01
  - IDENTIDADE-01
  - ONDA-CONTROLES-02
  - ONDA-GATILHOS-02
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-JOGAR-01
  - ONDA-JOGAR-09
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-PERFIS-01
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-VIBRACAO-02
  - ONDA-VIBRACAO-06
  # O PILOTO, por DOIS motivos que apontam para a mesma sprint:
  # (1) ela cria o módulo `webview_de_aba`, que é o enxerto reusável — esta
  #     sprint NÃO o reescreve;
  # (2) a BANCADA do `gui/main.glade`, por R5: XML único, sem seções nomeadas,
  #     e as DEZ sprints de enxerto trocam páginas do MESMO `Gtk.Notebook`. Uma
  #     por vez, na ordem das dez ondas de `docs/process/SPRINT_ORDER.md` §1.2.
  - MIGRA-CONTROLES-01
  # As duas pontes (`run_javascript` e `register_script_message_handler`) nascem
  # aqui, e custam 31 linhas UMA VEZ. Nenhuma sprint desta onda as reescreve.
  - MIGRA-CONTROLES-03
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
---

> **ESTADO 06/09/2026: caducou.** O enxerto da página dentro da janela GTK morreu: o produto é a janela HTML (`interface/hefesto_vivo.py`), e a janela GTK sai nas 24 horas (D-19, liberada por ela em 06/09). Fica como registro do que se mediu.

# MIGRA JOGAR · 01 — a página entra no lugar da `tab_home_box`

**O defeito:** o enxerto que a casa provou em 29/08 foi **aditivo** — o
`WebView` entrou como **12ª página** do `Gtk.Notebook` (376 objetos em 56 ms).
**Ninguém mediu TROCAR uma página**, e é ao trocar que reaparecem as 60.862
linhas que hoje chegam aos widgets por `builder.get_object()`.
`docs/data/decisoes-dela.csv:119` diz isso com todas as letras: *"o que ainda
não foi medido, e vai primeiro: o enxerto SUBSTITUTIVO."*

**Esta aba é o pior caso da casa para descobrir isso**, e por três medições:

1. **O poller identifica a página pelo id do Glade, e ele some sem barulho.**
   `app/actions/home_actions.py:76` — `ABA_INICIO = "tab_home_box"`; `:2310` —
   `if notebook is not None and id_da_pagina_corrente(notebook) == ABA_INICIO`.
   É uma **comparação de string**, não um `get_object`: se o enxerto trocar o
   widget por outro com id diferente, a comparação simplesmente nunca casa. Sem
   exceção, sem log, sem traço. O tique de 2 s (`:64`, `HOME_POLL_INTERVAL_MS =
   2000`; agendado em `:2304`) continua rodando e **nunca mais pinta nada**. É a
   forma exata da armadilha desta casa: *o sintoma é a AUSÊNCIA de dado.*
2. **A fita passa a existir duas vezes.** O produto desenha a fita de alvo na
   `Gtk.HeaderBar` (`app/actions/status_actions.py:1702`, `header_bar.pack_end`),
   e a página desenha a dela dentro do HTML
   (`layout/01-jogar.html:566-585`). Com o enxerto as duas ficam na tela ao
   mesmo tempo. É o mesmo defeito que ela viu **em um segundo** quando a
   primeira versão do `src/hefesto_dualsense4unix/interface/ver.py` pôs um `Gtk.Notebook`  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
   por cima da tira do desenho — *"as abas apareciam duas vezes"*.
3. **A fita da Jogar está declarada como "ainda não ligada".**
   `app/app.py:1231` — `"tab_home_box": _MOTIVO_ALVO_AINDA_NAO_LIGADO`. O
   desenho aprovado a quer **viva** (`01-jogar.html:566`, e a legenda dela de
   28/08 diz por quê: com a máscara por controle a fita ganhou alvo de verdade).

Onde a página vive hoje no Glade: `gui/main.glade:234`
(`GtkScrolledWindow id="scroll_tab_home_box"`) e `:243`
(`GtkBox id="tab_home_box"`), e as 3.369 linhas de `home_actions.py` montam
widget lá dentro.

## O que entrega

1. **O enxerto NÃO troca o id — troca o conteúdo.** `scroll_tab_home_box` e
   `tab_home_box` **permanecem**, esvaziados, e o `WebView` entra dentro do
   `tab_home_box`. Essa é a cura mais barata do defeito 1: a régua de página do
   poller continua valendo sem uma linha de edição, e a mudança de motor deixa de
   ser capaz de calar o tique em silêncio.
2. **O `GtkScrolledWindow` para de rolar.** A página foi desenhada para
   1180×757 exatamente (`--alt-janela:757px`, `01-jogar.html:460`) e rola por
   conta própria quando precisa. Dois roladores encaixados dão a barra dupla que
   o `src/hefesto_dualsense4unix/interface/olhar.py` esconde por outro motivo. Política
   `NEVER` nos dois eixos, ou o `ScrolledWindow` sai e o `WebView` é filho
   direto — o que a medição do passo 5 disser.
3. **A fita fica em UM lugar.** Esta sprint **declara a duplicação e não a
   resolve sozinha** (é decisão dela, abaixo). O passo executável é o
   reversível: enquanto a página da Jogar está em tela, a fita do
   `Gtk.HeaderBar` **se esconde**, e as duas leem do mesmo dono —
   `app/alvo_de_edicao.py`, que é dono único desde 23/08. **Duas fitas com dois
   estados é como esta casa ganhou os oito pares.**
4. **A fita continua declarada, e continua esmaecida.** `app/app.py:1231` fica
   com `_MOTIVO_ALVO_AINDA_NAO_LIGADO` **até a MIGRA-JOGAR-10** — enquanto a
   máscara viva for uma só para a mesa, a fita desta aba não tem alvo de verdade,
   e acendê-la agora seria prometer escolha por controle sobre um mecanismo que
   decide um só. Quem a acende é a 10. O portão da Z2-9 reprova aba ausente do
   mapa: **não a tire do mapa.**
5. **O número desta aba, que é o pior caso.** O piloto mede o custo do
   substitutivo em geral; esta sprint mede **o desta página** — PSS antes e
   depois com a Jogar em tela, tempo da primeira carga e das trocas de aba, e
   quantos objetos o Glade passa a construir a menos. O aditivo custou
   **62 → ~285 MiB PSS**; o substitutivo **remove** widgets e acrescenta um
   WebView, e **ninguém sabe para que lado o número vai**. Aqui saem 3.369 linhas
   de montagem de widget — mais do que em qualquer outra aba. Isto é medição, não
   teste: não reprova nada, e mentir aqui é o que faz a próxima aba nascer cara
   sem aviso.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_01_a_pagina_no_lugar_da_home.py`:

- **o id sobrevive ao enxerto.** Monta o notebook do `gui/main.glade` real, põe
  a página da Jogar em tela e exige
  `home_actions.id_da_pagina_corrente(notebook) == home_actions.ABA_INICIO`.
  **A mordida:** renomeie o `tab_home_box` do enxerto para qualquer outra coisa
  — o teste tem de ficar vermelho. Hoje, sem este teste, essa renomeação passa
  calada e o poller morre;
- **o poller morde mais de uma vez.** Dublê que conta tiques, com o relógio
  adiantado por **três** intervalos de `HOME_POLL_INTERVAL_MS`. Exija três
  pinturas. **A mordida:** arranque a chamada de pintura de dentro do tique — o
  teste reprova. *Uma régua que roda o tique UMA VEZ mede um instante, não um
  comportamento* — é a lição das seis réguas falsas de 29/08, e ela vale aqui
  mais do que em qualquer outro lugar desta onda;
- **`load-failed` não vira sucesso.** Carregue uma URI que não existe. O
  instrumento tem de reportar **falha**. **A mordida:** desligue o handler de
  `load-failed` e deixe só o `FINISHED` — o teste tem de passar a reportar
  sucesso, e é por isso que ele reprova. O WebKit **commita uma página de erro**,
  e o `FINISHED` dispara depois dela;
- **a fita aparece uma vez.** Com a Jogar em tela, conte os portadores do texto
  *"Ajustes vão para:"* — os do GTK (varrendo os filhos da `HeaderBar`) mais os
  do DOM (`document.querySelectorAll`). A soma tem de ser **1**. **A mordida:**
  devolva a fita do `HeaderBar` à visibilidade — o teste reprova com "2";
- **a fita continua no mapa e continua inerte.**
  `app.HefestoApp._ALVO_POR_ABA["tab_home_box"] is not None` e a fita nunca fica
  sensível nesta aba. **A mordida:** troque o motivo por `None` — o teste
  reprova, porque a escolha por controle ainda não existe (é a MIGRA-JOGAR-10).

**A régua LÊ, nunca DIGITA.** Em 26/08, **onze** réguas desta casa reprovaram a
melhora em vez do defeito, todas pela mesma forma: digitavam o que deviam ler.
Nenhum número desta sprint pode estar escrito no teste — o id vem de
`home_actions.ABA_INICIO`, o intervalo vem de `HOME_POLL_INTERVAL_MS`, o texto da
fita vem de onde o produto o escreve.

## O que é dela decidir

- **A fita fica em quantos lugares, e em qual.** O `Gtk.HeaderBar` a desenha
  desde sempre e é o que ela conhece; a página a desenha porque o mockup que ela
  aprovou a desenha. As duas na tela é defeito; qual das duas fica é escolha, e
  vale para as **dez** abas de uma vez — quem responder aqui responde a moldura
  inteira.
- **O mesmo vale para o perfil ativo** (`01-jogar.html:575-585`), que a página
  desenha ao lado da fita e o rodapé do produto já nomeia
  (`app/actions/footer_actions.py:884`).

## Colisão declarada

`gui/main.glade` é **recurso de bancada** — uma sprint por vez em toda a casa. As
dez ondas têm uma sprint de enxerto cada, e as dez trocam páginas do **mesmo**
`Gtk.Notebook`. Quem coordena serializa na ordem de `SPRINT_ORDER.md` §1.2; não
resolva conflito de Glade sozinho.
