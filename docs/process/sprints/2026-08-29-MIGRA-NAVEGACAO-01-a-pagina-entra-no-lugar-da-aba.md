---
sprint: MIGRA-NAVEGACAO-01
estado: caducou
onda: MIGRA-NAVEGACAO
posse:
  NAV6-PAGINA:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/footer_actions.py
    - scripts/gui-captura/retratar_abas.py
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/__init__.py
  - tests/unit/test_migra_navegacao_01_a_pagina_entra_no_lugar.py
bancada: true
depois_de:
  # A TRAVA DE PARTIDA, e ela não é desta onda: o enxerto SUBSTITUTIVO nunca foi
  # medido. O provado em 29/08 foi ADITIVO — o webview como 12ª página do
  # `Gtk.Notebook`, 376 objetos em 56 ms. Trocar uma página é outra coisa.
  - MIGRA-CONTROLES-01  # o PILOTO. Se a onda da aba Controles tiver batizado a
                        # sprint com outro número, quem coordena corrige a linha:
                        # a dependência é o enxerto substitutivo medido, não o nome.
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática. Vinte e uma sprints o abrem e correm
  # EM SÉRIE (SPRINT_ORDER.md §1.1, trava 2). As de baixo vêm antes desta.
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - IDENTIDADE-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  # AS OUTRAS NOVE ABAS TROCAM DE MOTOR NO MESMO XML. Cada onda tem a sua sprint
  # de enxerto, e as dez correm EM SÉRIE pelo mesmo motivo: o Glade é bancada.
  # A ordem entre as dez é da tira (SPRINT_ORDER.md §1.2), e esta é a SEXTA.
  - MIGRA-JOGAR-01
  - MIGRA-GATILHOS-03
  - MIGRA-ILUMINACAO-02
  # SÉRIE, por R5: esta sprint divide `app/app.py` e `app/actions/footer_actions.py`
  # com as de baixo.
  - ONDA-VIBRACAO-06
  - ONDA-NAVEGACAO-06  # a sprint que esta AQUI substitui — ver o índice
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - ONDA-CONTROLES-02
  - ONDA-GATILHOS-02
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - ONDA-PERFIS-01
  - ONDA-PERFIS-08
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - MIGRA-ILUMINACAO-07
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
  - src/hefesto_dualsense4unix/app/actions/input_actions.py
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

> **ESTADO 06/09/2026: caducou.** O enxerto da página dentro da janela GTK morreu: o produto é a janela HTML (`interface/hefesto_vivo.py`), e a janela GTK sai nas 24 horas (D-19, liberada por ela em 06/09). Fica como registro do que se mediu.

# MIGRA NAVEGAÇÃO · 01 — A página entra no lugar da aba, e as vinte e uma janelas do Glade se apagam

**A primeira desta onda, e a única que abre o `main.glade`.** Ela troca a página
`scroll_tab_navegacao_dsx` por um `WebKit2.WebView` que carrega
`06-navegacao.html` — e responde pelo que some junto.

## O defeito

Hoje a aba Navegação é **463 linhas de XML** (`gui/main.glade:3683-4145`) com
**59 objetos**, dos quais **21 têm id**. O motor novo não usa nenhum deles: a
página é HTML, o Python **pinta valores**, não constrói widget
(`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`).

**O problema não é apagar o XML — é que apagar não dá erro.**
`WidgetAccessMixin._get` (`app/actions/base.py:338`) é literalmente
`self.builder.get_object(widget_id)`, e **todo** chamador desta aba guarda com
`if widget is not None`. Arrancar os widgets não quebra nada: quinze caminhos
viram **no-op mudo**.

Os cinco donos, medidos hoje (`grep -rn '"<id>"' src --include='*.py'`):

| id do Glade | linha | quem o lê |
|---|---|---|
| `mouse_emulation_toggle` | `:3731` | `mouse_actions.py` **e** `footer_actions.py:127` |
| `mouse_speed_scale` | `:3788` | `mouse_actions.py` **e** `footer_actions.py:130` |
| `mouse_scroll_speed_scale` | `:3813` | `mouse_actions.py` **e** `footer_actions.py:131` |
| `mouse_mode_hint_label` | `:3751` | `mouse_actions.py:285` (o portão HARM-05) |
| `mouse_uinput_status_label` | `:3762` | `mouse_actions.py:579` |
| `keyboard_emulation_toggle` | `:4030` | `emulation_actions.py:1689`, `:1751` |
| `keyboard_emulation_hint_label` | `:4048` | `emulation_actions.py:1700` |
| `key_bindings_treeview` | `:4088` | `input_actions.py` |
| `key_bindings_legend` | `:4066` | `input_actions.py` |
| `tab_navegacao_dsx` | `:3692` | `app/app.py` — **quatro máquinas diferentes** |

**E o `tab_navegacao_dsx` não é só o nome do container.** Ele participa de
quatro tabelas em `app/app.py`, e cada uma quebra de um jeito diferente:

1. `_REFRESH_POR_ABA` (`:1141`) — entrar na aba dispara
   `_refresh_mouse_tab`, `_refresh_key_bindings_from_draft` e
   `_refresh_keyboard_switch`. Os três repintam widgets que não existirão mais;
2. `_ALVO_POR_ABA` (`:1236`) — hoje `_MOTIVO_ALVO_AINDA_NAO_LIGADO`. O contrato
   manda trocar por **"não se aplica"** (`D-A-FITA-E-O-UNICO-ALVO`; redesenho,
   §6: *"o PC tem um cursor e um foco de teclado só"*);
3. `_PAGINAS_COM_TETO_ELASTICO` (`:1366`) — a página é embrulhada num teto
   elástico. Um `WebView` já tem rolagem própria: dois donos da altura;
4. `id_da_pagina` reconhece a aba pelo **nome de Buildable** do widget que o
   notebook devolve — e a nota de `_envolver_paginas_em_teto_elastico` (`:1375`)
   diz, medido: *"um `Gtk.Bin` nosso não tem nome de Buildable nenhum"*.
   Trocar o widget da página **sem manter o id** faz `id_da_pagina` devolver
   `None`, e as três tabelas acima param de achar a aba **em silêncio**.

**A terceira mordida está no rodapé.** `footer_actions._freeze_ui` (`:168`)
congela os widgets de `FROZEN_WIDGET_IDS` durante o Aplicar, e a docstring diz:
*"Widgets ausentes no builder são ignorados silenciosamente."* Três ids desta
aba estão nessa tupla. Sem eles, o congelamento **não cobre nada** e o Aplicar
volta a poder disparar `mouse.emulation.set` no meio da transação — que é
exatamente o defeito que a BUG-MOUSE-GUI-SYNC-01 fechou.

**E o instrumento fica cego.** `scripts/gui-captura/retratar_abas.py:1965`
(`_montar_aba_navegacao`) monta um host de `InputActionsMixin` e faz
`builder.get_object("tab_navegacao_dsx").show_all()` (`:2008`). Ele falha
**macio**: dois `except Exception` devolvem a string *"aba Navegação não
montada"* e a foto sai vazia. Quem olhar só o PNG lerá a migração como quebra.

## O que entrega

1. **A página troca de widget e MANTÉM o id.** `tab_navegacao_dsx` continua
   sendo o nome de Buildable da página do notebook — é ele que `id_da_pagina`
   lê. O conteúdo é um `WebKit2.WebView` carregando a página desta aba.
2. **`app/telas/navegacao/__init__.py`** — o dono único da aba no motor novo:
   ele monta o view, carrega o HTML, escuta `load-failed` **antes** de
   `load-changed`, e expõe dois métodos que as outras quinze sprints desta onda
   usam: `pinta(chave, valor)` e `ao_gesto(nome, funcao)`. As **duas pontes**
   (`run_javascript` e `register_script_message_handler`) são do piloto; esta
   sprint as **usa**, não as reescreve.
3. **As quatro tabelas de `app/app.py` acertam o contrato:**
   - `_REFRESH_POR_ABA["tab_navegacao_dsx"]` passa a chamar **um** método, o da
     tela nova. Os três antigos ficam vivos e sem chamador aqui — quem os
     apaga são as sprints 04, 05 e 11, cada uma com a sua prova;
   - `_ALVO_POR_ABA["tab_navegacao_dsx"]` vira `MOTIVO_ALVO_NAO_SE_APLICA`
     (`app/actions/config/mixin.py`);
   - `tab_navegacao_dsx` **sai** de `_PAGINAS_COM_TETO_ELASTICO`: a rolagem é do
     WebView, e dois donos da altura é o defeito P8 do redesenho.
4. **`FROZEN_WIDGET_IDS` deixa de mentir.** Os três ids desta aba saem da tupla
   e o congelamento do Aplicar passa a alcançar a tela nova pelo caminho dela
   (um `pinta("congelado", true)`), ou — se a decisão for não congelar — a
   ausência fica **escrita**, nunca herdada de um `if is not None`.
5. **O instrumento volta a enxergar.** `_montar_aba_navegacao` passa a
   fotografar o WebView. **Não sabemos se um `WebKit2.WebView` pinta dentro de
   um `Gtk.OffscreenWindow`** — ninguém mediu, e o `retratar_abas.py` é
   `OffscreenWindow` por construção (`:2428`, `:2481`, `:2568`). Esta sprint
   **mede** e escreve o resultado. Se não pintar, a saída é declarar a aba como
   fotografada por outro caminho e **nunca** deixar o `except` macio publicar
   um PNG vazio como se fosse a tela.
6. **O `mouse_mapping_grid` (`:3856`) sai do XML.** São 8 pares escritos à mão —
   a tabela que a sprint 11 passa a montar do dado. Sai aqui porque é XML;
   entra lá porque é dado.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_01_a_pagina_entra_no_lugar.py`:

1. **O id sobrevive à troca.** Monta o `main.glade`, pega a página do notebook
   pelo índice da Navegação e exige
   `Gtk.Buildable.get_name(pagina) == "tab_navegacao_dsx"`.
   **Morde:** troque o id por qualquer outro e o teste reprova — hoje ele
   passaria mesmo com `___object_142___`, que é o nome que o GtkBuilder inventa
   pela POSIÇÃO (medido em 21/08, e está escrito no comentário do
   `scroll_tab_config_box`, `main.glade:4157`).
2. **Nenhum id desta aba fica com leitor órfão.** Para cada um dos 21 ids do
   bloco: ou ele existe no Glade, ou **nenhum** `.py` de `src/` o cita.
   **Morde:** apague `mouse_emulation_toggle` do XML sem tirá-lo de
   `FROZEN_WIDGET_IDS` e o teste nomeia o arquivo e a linha. É a régua que o
   `_get` silencioso nunca teve.
3. **As três tabelas de `app.py` conhecem a aba.** `_REFRESH_POR_ABA`,
   `_ALVO_POR_ABA` e `_PAGINAS_COM_TETO_ELASTICO` são conferidas contra a lista
   de páginas do Glade: a Navegação está nas duas primeiras e **fora** da
   terceira. **Morde:** devolva-a ao teto elástico e reprova.
4. **A fita diz "não se aplica".**
   `_ALVO_POR_ABA["tab_navegacao_dsx"] is MOTIVO_ALVO_NAO_SE_APLICA`, e a fita
   nasce **inerte** — nunca sensível.
5. **O `load-failed` não vira sucesso.** Dublê de `WebView` que emite
   `load-failed` e **depois** `load-changed(FINISHED)`: o dono da tela tem de
   registrar falha. **Morde:** escute só `FINISHED` e o teste reprova — é a
   armadilha medida em 29/08, e o WebKit **commita uma página de erro**.
6. **Os quatro pinos.** O módulo declara `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`
   e `WebKit2 4.1`, e o `Gdk` vem **depois** do `Gtk`. **Morde:** tire o pino do
   `Gdk` e o teste reprova nomeando o pino — com o GTK4 ao lado, o import sem
   pino carrega o 4.0 e mata o Gtk 3.0.
7. **A foto.** `retratar_abas.py` sobre esta aba devolve uma frase que **não
   começa com "não montada"** e um PNG com mais de uma cor. **Morde:** a
   segunda metade é o ponto — um PNG de uma cor só é exatamente o que o
   `except` macio publica hoje.

## O que é dela decidir

- **O congelamento do Aplicar continua existindo nesta aba?** Hoje três
  widgets dela congelam durante a transação. Na tela nova isso é uma decisão,
  não uma herança. `PROVISÓRIO — decisão dela`: a proposta é **manter**, porque
  a razão medida (BUG-MOUSE-GUI-SYNC-01: os sliders disparam IPC) não mudou.
- **Onde o HTML passa a morar.** `novo-layout/` é `.gitignore:108` — não viaja
  em worktree nem no pacote, e o `install.sh` não o copia. **Esta sprint não
  decide**: é a moldura das dez, e a candidata levantada pelo censo da aba 04 é
  `src/hefesto_dualsense4unix/gui/telas/`. Enquanto não estiver decidido, a
  tela funciona na máquina dela e **não** numa instalação limpa — e isso tem de
  estar dito, não descoberto.
- **O nome da pasta do motor novo.** Esta onda usa
  `src/hefesto_dualsense4unix/app/telas/navegacao/`, um módulo por bloco da
  aba — o mesmo molde de `app/actions/config/secao_*.py`, que já existe e
  funciona. Se o piloto tiver nascido noutra pasta, é a dele que vale; quem
  coordena troca as linhas de posse desta onda.

## O que esta sprint NÃO faz

Não pinta um único valor. A página entra **vazia de dado** — os cartões com o
desenho, as barras nos números do mockup e os selects nos rótulos de fábrica.
Quem liga cada família são as sprints 03 a 16. Separar é de propósito: o
enxerto tem risco próprio (memória, foto, id da página) e não pode ser
diagnosticado junto com um erro de leitura de estado.
