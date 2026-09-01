---
sprint: MIGRA-SISTEMA-01
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M1:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
cria:
  - tests/unit/test_migra_sistema_01_a_pagina_e_um_webview.py
bancada: false
depois_de:
  # A EXECUÇÃO ESPERA A PALAVRA DELA sobre o piloto (a aba Controles, viva
  # agora). Palavra dela, 29/08: "Depois dou o ok pra seguirmos materializando
  # a ordem pra fazermos todas as abas funcionarem no novo motor."
  - MIGRA-CONTROLES-PILOTO
  # As duas pontes (31 linhas) e a CASA do HTML têm UM dono, e não é esta
  # sprint. Se a leva da moldura tiver outro nome no dia da execução, quem
  # coordena corrige esta linha — o que não muda é que elas não nascem aqui.
  - MIGRA-MOLDURA-01
  # BANCADA: `gui/main.glade` é XML único sem seções nomeadas — conflito de
  # merge nele é irrecuperável na prática. Estas correm antes, na ordem das
  # ondas (SPRINT_ORDER.md §1.2).
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  # A BANCADA DO `gui/main.glade` e do `app/app.py` — XML único sem seções
  # nomeadas: conflito de merge é irrecuperável na prática, e o protocolo o trata
  # como recurso de bancada, UMA SPRINT POR VEZ (`COMO-EXECUTAR-UMA-SPRINT.md`
  # §2). Abaixo, a fila que o `check_colisao_de_sprints.py` nomeia hoje. A ORDEM
  # real é a das dez ondas (`SPRINT_ORDER.md` §1.2) e quem coordena a arbitra —
  # declarar aqui não é prioridade, é dizer "não editamos juntos".
  - COOP-NA-CONEXAO-NATIVA-01
  - EMULACAO-UM-DONO-SO-01
  - IDENTIDADE-01
  - LEVA-1
  - MIGRA-CONTROLES-01
  - MIGRA-GATILHOS-03
  - MIGRA-GATILHOS-07
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-07
  - MIGRA-JOGAR-01
  - MIGRA-LANCADORES-01
  - MIGRA-LANCADORES-10
  - MIGRA-NAVEGACAO-01
  - ONDA-CONTROLES-02
  - ONDA-GATILHOS-02
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-JOGAR-09
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-PERFIS-01
  - ONDA-SISTEMA-06
  - ONDA-VIBRACAO-02
  - ONDA-VIBRACAO-06
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - novo-layout/
---

# MIGRA SISTEMA · 01 — O enxerto substitutivo, na página mais barata das dez

**Esta é a sprint que mede o que ninguém mediu.** O provado em 29/08 foi o
enxerto **ADITIVO** — o `WebView` como **12ª página** do `Gtk.Notebook` do
produto, 376 objetos em 56 ms
(`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`). **Trocar** uma
página é outra coisa, e é onde reaparecem as 60.862 linhas que hoje chegam aos
widgets por `builder.get_object()`.

**A aba Sistema é o lugar certo para medir isso**, e a razão é contagem, não
gosto: das dez, é a de menor superfície de Python por página.

## O defeito

A página `daemon_box` é **381 linhas de XML** e **26 ids** de Glade
(`gui/main.glade:2718` a `:3098`, dentro do `scroll_daemon_box` de `:2709`) — um
`GtkGrid`, três `GtkBox`, rótulos, e um `GtkScrolledWindow` com o texto do
`systemctl status` dentro. **Nada disso é a tela que ela aprovou**
(`layout/09-sistema.html`): um quadro só, quatro faixas rotuladas, o exame
em duas colunas, e o registro técnico ao lado do Avançado.

E o custo de trocar essa página é **pequeno e conhecido**, medido hoje:

| o que o Python alcança | quantos | onde |
|---|---|---|
| ids por `self._get(...)` | **9** | `daemon_actions.py:1167, 1201, 1917, 1957, 1963, 2002, 2011, 2196, 2713` |
| handlers `on_*` | **13** | `daemon_actions.py:1218, 1318, 1360, 1586, 1717, 1793, 2215, 2221, 2254, 2264, 2374, 2385, 2396` |
| **um 14º handler, e ele mora na aba que MORRE** | 1 | `btn_camadas_engasgo` (`main.glade:3044`) → `on_camadas_engasgo` em **`emulation_actions.py:2075`** |

Os outros **17 ids** do bloco existem só para o Glade (moldura, `packing`,
rótulo) ou chegam por `signal`. **Nenhum sobrevive ao enxerto** — e é isso que
esta sprint tem de provar que não quebra nada em silêncio.

### As três tabelas que indexam a página POR ID DE WIDGET

São elas que quebram calado se o id não sobreviver:

| tabela | linha | o que faz |
|---|---|---|
| `_REFRESH_POR_ABA` | `app/app.py:1114` — `"daemon_box": ("_refresh_daemon_tab_on_show",)` | relê a aba ao entrar nela |
| `_ALVO_POR_ABA` | `app/app.py:1234` — `"daemon_box": _MOTIVO_ALVO_AINDA_NAO_LIGADO` | a fita da moldura. **O portão da Z2-9 reprova módulo de aba ausente daqui** |
| `skip_pages` do `_wrap_notebook_pages_in_scroll` | `app/app.py:1466` | cinto de segurança: hoje não casa com nada porque a página do notebook já é o `scroll_daemon_box` |

E quem desembrulha o rolador para achar o id é `home_actions.id_da_pagina:79`,
com **oito outros chamadores**. **Não o mude.**

## O que entrega

1. **A página `daemon_box` deixa de ser widget e passa a ser um `WebView`**,
   carregando a página da aba 09. O `GtkBox` de `main.glade:2718` sai inteiro;
   **o `scroll_daemon_box` de `:2709` sai junto** — o WebView rola por dentro, e
   um `GtkScrolledWindow` em volta de um WebView é rolagem dupla.
2. **O ID SOBREVIVE.** O widget novo nasce com `id="daemon_box"` no Glade (ou é
   inserido em código com `set_name`/`Gtk.Buildable` que `id_da_pagina`
   reconheça). **As três tabelas de `app.py` não mudam de chave.** Se alguém
   quiser renomear, é outra sprint e ela renomeia nos três lugares de uma vez.
3. **Os 13 handlers continuam existindo, e continuam sendo os mesmos métodos.**
   Esta sprint **não** liga gesto nenhum (isso é a MIGRA-SISTEMA-04) e **não**
   apaga método nenhum. Ela só tira o Glade do caminho. Um handler que hoje é
   alcançado por `connect_signals` (`app.py:350`) e amanhã não for alcançado por
   nada tem de aparecer no relatório, não sumir.
4. **`_refresh_daemon_tab_on_show` (`daemon_actions.py:2244`) continua sendo
   chamado ao entrar na aba, e continua não estourando** — hoje ele chama três
   refreshers que pintam widgets que deixaram de existir. Nesta sprint eles
   ficam **inertes e declarados** (`_get` devolve `None` e o corpo já protege),
   não removidos: quem os liga à página nova é a MIGRA-SISTEMA-03.
5. **O NÚMERO.** A sprint entrega, escrito no corpo do teste e no relatório de
   fechamento:
   - **PSS antes e depois**, na mesma máquina, com a janela aberta na aba
     Sistema (o aditivo mediu 62 → ~285 MiB; **o substitutivo é o que ninguém
     mediu**, e pode ir para os dois lados);
   - **linhas de Python que morreram × nasceram** nesta aba;
   - **tempo até a página estar em tela** ao trocar para a aba.
   Se o número for pior que o aditivo, isso não reprova a sprint — **reprova o
   silêncio.** Escreva-o.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_01_a_pagina_e_um_webview.py`:

- **o id sobrevive, e as três tabelas o acham.** `id_da_pagina` sobre a página
  devolve `"daemon_box"`; `"daemon_box" in _REFRESH_POR_ABA` e
  `in _ALVO_POR_ABA`. **Troque o id para `daemon_web` e veja os três
  reprovarem** — sem isso, o refresh e a fita param em silêncio, que é
  exatamente o defeito que este teste existe para pegar;
- **nenhum dos 9 ids antigos ficou sendo pedido a esmo.** Para cada um,
  `self._get(id)` devolve `None` **e o método que o usa não levanta**. Devolva
  um `set_markup` desprotegido a `_apply_storm_diag` e veja reprovar;
- **a carga não mente.** O teste escuta `load-failed` **e** `load-changed`. Um
  `load_uri` para um caminho que não existe tem de reprovar. **Arranque o
  `load-failed` e veja o teste passar sobre uma página de erro** — é a armadilha
  medida em 29/08: `FINISHED` dispara **depois** de `load-failed`, porque o
  WebKit commita a página de erro;
- **os quatro pinos estão lá.** `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
  `WebKit2 4.1`, **e o `Gdk` depois do `Gtk`**. Tire o pino do `Gdk` e o import
  tem de reprovar numa máquina com GTK4 ao lado;
- **o título não é a régua.** Se o teste ler `get_title()` no handler de
  `FINISHED`, ele lê vazio. Quem provar carga por título está medindo o relógio,
  não a página.

E, porque é interface: **foto antes e depois**, por quem coordena, com
`scripts/gui-captura/retratar_abas.py` — **nunca dentro da árvore de um agente**
(`COMO-EXECUTAR-UMA-SPRINT.md` §5). A palavra final é dela (`PROVA-DE-TELA-01`).

## O que é dela decidir

- **Onde o HTML mora**, e isso é da moldura, não desta aba: `novo-layout/` é
  **`.gitignore:108`** — não viaja em `git worktree add`, não entra no pacote, e
  o `install.sh` não o copia. **Enquanto for assim, portão nenhum desta casa
  enxerga a especificação aprovada por ela.** Esta sprint **não** decide a casa
  nova; ela **para** se a moldura não tiver decidido.
- **O botão "Ligar o Hefesto" sumiu do desenho, e ninguém decidiu isso.** O
  produto tem `daemon_start_button` ("Ligar o Hefesto", handler
  `on_daemon_start:2215`, com sensibilidade própria em
  `_aplicar_sensibilidade_ligar_desligar:1984`). O mockup tem **Retomar ·
  Reiniciar · Atualizar · Desligar**. Com o Hefesto **desligado**, a tela nova
  não tem como ligá-lo — o único caminho vira "Reiniciar o Hefesto", cujo rótulo
  mente sobre o estado. As outras quatro subtrações desta aba têm decisão
  escrita; **esta não**, e o "Corrigir modo de execução"
  (`btn_migrate_to_systemd`, visível só em `online_avulso`) também não.
  **Esta sprint preserva os dois métodos** e relata; ligar ou apagar é dela.
