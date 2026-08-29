---
sprint: MIGRA-PERFIS-01
onda: PERFIS
posse:
  MP1:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - scripts/gui-captura/retratar_abas.py
cria:
  - src/hefesto_dualsense4unix/app/actions/perfis_web.py
  - tests/unit/test_migra_perfis_01_a_pagina_troca_de_motor.py
bancada: false
depois_de:
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática. Uma sprint por vez.
  #
  # DUAS DEPENDÊNCIAS DE FORA DESTA ONDA, e as duas são de quem coordena a leva,
  # não desta aba. Elas ficam AQUI EM PROSA e não na lista de ids abaixo: no dia
  # em que este arquivo foi escrito nenhuma das duas tinha id, e inventar um
  # criaria uma referência falsa — pior que uma dependência declarada por
  # extenso. São estas:
  #   1. O ENXERTO SUBSTITUTIVO medido. O provado em 29/08 foi ADITIVO (uma 12ª
  #      página do `Gtk.Notebook`, 376 objetos em 56 ms). Ninguém mediu TROCAR
  #      uma página. Esta sprint É uma troca; se a medição disser que trocar
  #      custa caro, esta sprint muda de tamanho ANTES de começar.
  #   2. ONDE O HTML PASSA A MORAR, e como ele entra no pacote. `novo-layout/`
  #      é `.gitignore:108` e o wheel inclui só `gui/*.glade` e
  #      `gui/assets/*.png` (`pyproject.toml:84-91`). Enquanto isso não fechar,
  #      esta aba roda no `ver.py` e em lugar nenhum.
  - ONDA-PERFIS-01   # o que esta sprint substitui: a casca reescrita em GTK
  # A FILA DA BANCADA — `gui/main.glade` e `app/app.py`, os dois recursos que a
  # leva inteira disputa. O XML é único e sem seções nomeadas: conflito de merge
  # nele é irrecuperável na prática. Por R5, quem divide arquivo corre EM SÉRIE.
  #
  # A lista abaixo é a SÉRIE, não a precedência de valor: ela declara "não
  # abrimos o arquivo ao mesmo tempo", e quem decide a ordem real é quem
  # coordena a leva (SPRINT_ORDER.md §1.2 põe Perfis em 8º de 10). Medida em
  # 29/08/2026 pelo `scripts/check_colisao_de_sprints.py`; se uma sprint irmã
  # for renomeada, esta declaração deixa de cobri-la e o portão volta a acusar.
  - COOP-NA-CONEXAO-NATIVA-01
  - EMULACAO-UM-DONO-SO-01
  - IDENTIDADE-01
  - MIGRA-CONTROLES-01
  - MIGRA-GATILHOS-03
  - MIGRA-GATILHOS-07
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-07
  - MIGRA-JOGAR-01
  - MIGRA-LANCADORES-01
  - MIGRA-LANCADORES-10
  - MIGRA-NAVEGACAO-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-10
  - MIGRA-VIBRACAO-01
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
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-VIBRACAO-02
  - ONDA-VIBRACAO-06
  # A ONDA PERFIS de 27/08 inteira: as nove foram escritas para o editor GTK que
  # esta sprint apaga, e oito delas reivindicam `profiles_actions.py`. O índice
  # desta onda diz, uma a uma, o que sobra de cada.
  - ONDA-PERFIS-02
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04
  - ONDA-PERFIS-05
  - ONDA-PERFIS-06
  - ONDA-PERFIS-08
  - ONDA-PERFIS-09
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/profiles/
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - novo-layout/
---

# MIGRA PERFIS · 01 — a página troca de motor

**O defeito:** a aba Perfis é hoje **576 linhas de XML** que descrevem widget
por widget uma tela que ela já reprovou, e **4.580 linhas de Python** que os
alcançam por nome. O desenho que ela aprovou está pronto, num arquivo, e o
produto não tem como mostrá-lo.

| O que é hoje | Onde |
|---|---|
| a aba inteira em XML | `gui/main.glade:2119-2694` — 576 linhas, **54 objetos**, **38 ids** |
| quem alcança esses widgets | `app/actions/profiles_actions.py` — **74** `self._get()` sobre **19** ids distintos |
| quem monta a aba | `profiles_actions.py:1331` (`install_profiles_tab`) e `:1481` (`_install_mode_section`) |
| quem manda montar | `app/app.py:1499` e **`:1827`** (o caminho de quem sobe minimizado na bandeja — são **dois** chamadores, não um) |
| o que roda ao ENTRAR na aba | `app/app.py:1107` — `_sync_selection_with_active_profile` e `_sincronizar_caixa_do_steam_input` |
| a fita | `app/app.py:1233` — `profiles_paned: _MOTIVO_ALVO_AINDA_NAO_LIGADO` |
| o teto elástico | `app/app.py:1365` — `profiles_paned` em `_PAGINAS_COM_TETO_ELASTICO` |
| a foto da documentação | `scripts/gui-captura/retratar_abas.py:910` (`_montar_aba_perfis`) → `:1039` chama `host.install_profiles_tab()` |

**O alvo:** `novo-layout/10-perfis.html`, carregado num `WebKit2.WebView`
(`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`,
`docs/data/decisoes-dela.csv:119`).

## O que entrega

1. **Um módulo novo, `app/actions/perfis_web.py`**, com três coisas e nada
   mais: o `WebView` da aba, a **ponte que pinta** (`run_javascript`) e a
   **ponte que ouve** (`register_script_message_handler`, **um** argumento na
   série 4.1 — na 6.0 são dois). As duas pontes custam **31 linhas, uma vez**,
   e esta sprint é onde elas nascem para esta aba.
2. **`install_profiles_tab` muda de conteúdo, não de nome.** Ele passa a montar
   o `WebView` no lugar de ligar widgets. O nome fica porque tem **três**
   chamadores — `app.py:1499`, `app.py:1827` e `retratar_abas.py:1039` — e
   renomear é mexer nos três por nada.
3. **A faixa `main.glade:2119-2694` some**, e com ela os 38 ids. O que fica é
   um contêiner vazio com o id `profiles_paned` — **o id não muda**, porque
   quatro lugares de `app.py` o identificam por ele e são quatro lugares que
   têm de continuar funcionando: o que roda ao entrar (`:1107`), a fita
   (`:1233`), o teto elástico (`:1365`) e o mapa de abas.
4. **O teto elástico sai desta aba** (`app.py:1365`): ele existe para o card do
   GTK crescer sem cortar a janela, e o `WebView` rola por dentro. Deixá-lo é
   pôr dois donos na mesma altura.
5. **A página nasce VAZIA, com a razão escrita.** O mockup traz catorze perfis
   e quatro controles **de exemplo**; um produto que os mostre está mentindo na
   primeira tela. Esta sprint apaga os exemplos e põe no lugar a frase honesta
   de cada bloco (*"nenhum perfil ainda"* / *"nenhum controle na mesa"*) — que é
   o mesmo estado legítimo de zero controles que vale para toda aba que mostre
   controle. Quem enche os blocos é a **03**, a **04** e a **06**.
6. **O retrato continua saindo.** `retratar_abas.py:910` chama o método de
   PRODUÇÃO de propósito, e escreve por quê: *"uma cópia seria um segundo dono
   do desenho e a foto passaria a mentir no dia em que a `profiles_actions`
   mudasse"*. Isso não muda — muda o que o método monta. O que **tem** de mudar
   é o caminho de captura: `Gdk.Window` de `WebView` não sai por
   `Gtk.OffscreenWindow` do mesmo jeito que um `GtkGrid`. **Se a foto não sair,
   a sprint não fechou** — sem ela, o `README.md` e o `docs/usage/interface.md`
   perdem a imagem da aba.

## As armadilhas, que já custaram tempo a alguém

- **Quatro pinos, nesta ordem:** `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
  `WebKit2 4.1`. Com o GTK4 instalado ao lado, um `import Gdk` sem pino carrega
  o 4.0 e mata o Gtk 3.0 com `ImportError`.
- **`load-changed`/`FINISHED` dispara DEPOIS de `load-failed`** — o WebKit
  commita uma página de erro. Quem escutar só o FINISHED **reporta sucesso
  sobre carga que falhou**. Escute os dois.
- **`get_title()` no handler de FINISHED devolve vazio** — o título chega
  depois. Nove de dez abas voltaram sem título para quem mediu assim.
- **`select{appearance:none}`**: sem isto o WebKitGTK relata as cores do autor e
  desenha a caixa do **tema do sistema** — caixa branca com texto quase
  invisível. São **dois** `<select>` nesta página (`Funciona em` e
  `Estilo de Jogo`), 117 nas dez.
- **Os 84 filtros mortos do SVG NÃO alcançam esta aba** — medido: `10-perfis.html`
  tem 29 SVGs e **zero** `filter=` / `url(&quot;#...)`. Não perca tempo aqui.

## Como se prova (a mordida)

`tests/unit/test_migra_perfis_01_a_pagina_troca_de_motor.py`:

- **a faixa morreu**: parse do `main.glade` — nenhum dos 38 ids da faixa antiga
  existe no arquivo, e `profiles_paned` **existe**. Devolva um id qualquer da
  lista e o teste reprova.
- **os três chamadores continuam de pé**: `app.py:1499`, `app.py:1827` e
  `retratar_abas.py:1039` chamam `install_profiles_tab`, e a montagem devolve um
  `WebKit2.WebView` (dublê). Arranque a chamada de `:1827` e veja reprovar — é o
  caminho de quem sobe na bandeja, o que ninguém exercita à mão.
- **carga falha é carga falha**: dublê de `WebView` que emite `load-failed` e
  **depois** `FINISHED`. O módulo tem de reportar **falha**. Arranque o
  tratamento do `load-failed` e o teste passa a ver um verde mudo — é essa a
  mordida.
- **a fita fica inerte**: `_ALVO_POR_ABA["profiles_paned"]` continua existindo, e
  a fita nunca fica sensível nesta aba (aqui não se escolhe alvo,
  `D-A-FITA-E-O-UNICO-ALVO`). O portão `portao_alvo_tem_dono.py` já reprova
  módulo de aba ausente do mapa — não o quebre.
- **o teto elástico saiu**: `"profiles_paned" not in _PAGINAS_COM_TETO_ELASTICO`.
- **nasce vazia, não nasce mentindo**: o HTML servido à aba **não** contém
  nenhum dos catorze nomes de exemplo do mockup (`Mortal Kombat`, `Elden Ring`,
  …) nem nenhum dos quatro rótulos de controle de exemplo. Devolva o miolo do
  mockup e o teste reprova. Esta é a régua que impede o defeito mais fácil desta
  rota inteira: **a tela bonita com dado inventado**.
- **a foto sai**: `retratar_abas.py` produz o PNG da aba Perfis com largura e
  altura maiores que zero e diferente de 1x1 (sob Xvfb não há gerenciador de
  janelas — uma `Gtk.Window` fica 1x1 para sempre; use `Gtk.OffscreenWindow`).

## O que é dela decidir

- **A aba não vai para o `dev` sozinha.** Entre esta sprint e a **06** a aba
  existe mas não mostra nada. É buraco **declarado**, não descuido: as seis
  fecham juntas ou nenhuma fecha, e a integração corre em árvore própria
  (`git worktree`), nunca na dela — a árvore dela fica em `dev`, sempre.
- **`profile_mode_frame` (`main.glade:2640`) e os quatro rótulos de
  `_MODE_KIND_ITEMS` (`profiles_actions.py:147`) morrem com a faixa.** O
  contrato diz que *"Modo que liga"* e *"O jogo vê o controle como"* **ficam**
  (`2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 9, "Nada se perdeu"), e o
  mockup **não os desenha** — a legenda dele admite por escrito que a versão
  anterior afirmava o contrário e era falsa. **No motor novo isso deixa de ser
  acabamento: o que o mockup não desenha, o produto não tem.** Ou ela manda
  desenhá-los, ou eles saem da aba Perfis com data. Trava a **04** também.
- **O olho dela fecha esta sprint** (`PROVA-DE-TELA-01`): foto antes e depois,
  e a palavra final é dela. Aprovar o mockup não é aprovar a tela.
