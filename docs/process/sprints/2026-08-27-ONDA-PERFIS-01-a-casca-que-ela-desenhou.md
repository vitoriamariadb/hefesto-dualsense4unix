---
sprint: ONDA-PERFIS-01
# onda: PERFIS  (campo `onda:` ainda não existe em check_colisao_de_sprints.py:83)
posse:
  P1:
    - src/hefesto_dualsense4unix/gui/main.glade   # SÓ a aba Perfis, linhas 2119-2695
    - src/hefesto_dualsense4unix/gui/theme.css
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-01-a-casca-que-ela-desenhou.md
  - tests/unit/test_perfis_a_casca_do_desenho.py
bancada: false
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
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
nao_toca:
  - src/hefesto_dualsense4unix/profiles/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - novo-layout/
---

# ONDA PERFIS · 01 — a casca que ela desenhou

**O defeito em uma frase:** a aba Perfis mostra hoje um editor de duas páginas
com três campos de regex crus, dois blocos de tamanhos diferentes e cinco
gestos que ela mandou tirar — e o desenho aprovado tem **dois blocos iguais,
cinco campos e três botões de cada lado**.

`main.glade:2119-2695` é a aba inteira. `novo-layout/10-perfis.html:527-627` é
o alvo.

## O que ela disse, literal

> *"tira ? ◆ 2 perfis nunca vão entrar — outro perfil os atropela sempre, por
> prioridade. veja quais e Salvar este Perfil. No bloco da Esquerda. Tem que
> aparecer a mesma tabela que temos lá, pode ser com o mesmo layout seu e coloca
> 3 botões abaixo e 3 abaixo. E equipara a altura e largura dos dois blocos.
> Esconder os controles físicos neste jogo Remove isso e isso aqui é tooltip: o
> maior vence a disputa"*
> — `novo-layout/_ferramentas/CORRECOES-DELA.md:62-68`

> *"◆ este jogo já sabe por onde entra — Isso sai. Isso tá na aba Jogar."*
> — idem, `:79`

## O que entrega

**SAI da aba** (cada item tem a linha de onde sai):

| O que sai | Onde está hoje | Por quê |
|---|---|---|
| Interruptor "Modo avançado" | `main.glade:2281` (`profile_advanced_switch`) | o seletor de ambiente cobre tudo o que ele servia (D-APLICA-A-VIRA-AMBIENTE) |
| `window_class:` · `title_regex:` · `process_name:` | `main.glade:2537-2600` (`profile_stack_avancado`) | continuam no motor; quem os preenche passa a ser o campo do jogo e o Detectar |
| `GtkStack` de duas páginas | `main.glade:2357` (`profile_editor_stack`) | com uma página só, a pilha não tem o que empilhar |
| "Salvar este perfil" | `main.glade:2675` (`profile_save_button`) | palavra dela; quem grava é o "Salvar Perfil" do rodapé (ONDA-PERFIS-08) |
| "Esconder os controles físicos neste jogo" + "Outros jogos marcados: N" | `main.glade:2468`, `:2501`; contagem em `profiles_actions.py:2368` | palavra dela |
| Carimbo "Este jogo já sabe por onde entra" | `main.glade:2427` (`profile_jogo_reconhecido`) | *"isso tá na aba Jogar"* |

**FICA e muda de forma:**

- **Um fundo só, dois blocos dentro**, mesma largura e mesma altura, divisória
  fina no meio — `novo-layout/_ferramentas/aba10.py:11-16`, com o pedido dela
  citado ali: *"deixa um só, pra causar a ilusão de um único bloco"*.
- **Lista com cara de tabela**: cabeçalho fixo, linhas zebradas, o ativo em
  verde com barra na primeira célula, e a contagem `N no disco · role para ver
  todos` no rótulo da seção (`10-perfis.html:519`).
- **Três botões e três botões, todos da mesma largura**:
  esquerda `Ativar · Novo · Remover`; direita `Duplicar · Voltar à de ontem ·
  Recarregar`. Hoje são cinco de um lado só (`main.glade:2185-2250`).
  O "Voltar à de ontem" nasce **desligado** aqui — quem o liga é a
  ONDA-PERFIS-05.
- **Cabeçalho do editor**: `<b>Editor do perfil</b>` vira `Editando: <nome>`
  (`main.glade:2267` → `10-perfis.html:567`).
- **Prioridade vira slicer com trilho e número à direita**, e a explicação vira
  tooltip: *"O maior vence a disputa quando dois perfis poderiam entrar."*
  (`10-perfis.html:576-580`). A `GtkScale` já existe (`main.glade:2330`); o que
  muda é a forma e o texto.
- **A dica do Recarregar deixa de mentir.** `main.glade:2242` promete *"Relê os
  perfis do disco e **descarta as alterações que você ainda não salvou**"* —
  e `on_profile_reload` (`profiles_actions.py:3317-3319`) chama
  `_reload_profiles_store()` e nada mais: o editor não é tocado. Texto novo:
  *"Relê a lista do disco. Não descarta o que está no editor ao lado."*

## Como se prova (o teste que morde)

`tests/unit/test_perfis_a_casca_do_desenho.py`, sem GTK vivo — lê o XML:

1. **Os ids que saíram não voltam.** Para cada um de `profile_advanced_switch`,
   `profile_stack_avancado`, `profile_window_class_entry`,
   `profile_title_regex_entry`, `profile_process_name_entry`,
   `profile_save_button`, `profile_steam_input_check`,
   `profile_steam_input_outros`, `profile_jogo_reconhecido`: **ausente do
   glade**. Mordida: devolva um deles ao XML e veja reprovar nomeando o id.
2. **Três e três.** Contar os `GtkButton` filhos diretos de cada caixa de
   botões: 3 de cada lado, e os rótulos na ordem do mockup. Mordida: acrescente
   um quarto botão e veja reprovar.
3. **A dica do Recarregar não diz "descarta".** Casar o `tooltip-text` do
   `profile_reload_button` contra a palavra `descarta`. Mordida: devolva o texto
   de `:2242` e veja reprovar.
4. **Nenhum handler órfão.** Importar `profiles_actions` e conferir que nenhum
   handler declarado em `_signal_handlers()` aponta para um id que saiu — é a
   falha que o `connect_signals` do GTK só denuncia com a janela aberta.

E a foto, que é a regra da casa: `scripts/gui-captura/retratar_abas.py` antes e
depois, e a palavra final é dela (PROVA-DE-TELA-01).

## O que é dela decidir

1. **"Modo que liga" e "O jogo vê o controle como" ficam na aba?** A legenda do
   mockup diz que sim — *"Modo que liga e O jogo vê como ficaram, como você
   disse"* (`10-perfis.html:660`) — mas **o mockup não os desenha**: os campos
   renderizados são cinco (`10-perfis.html:569-618`), e o quadro
   `profile_mode_frame` (`main.glade:2640`) não tem correspondente. Esta sprint
   **não mexe neles** até ela dizer. Ver ONDA-PERFIS-09.
2. **"Esconder os controles físicos" sai daqui — e o gesto some da janela?**
   O escritor (`integrations/steam_launch_options.py`) continua vivo, e os
   mockups da Sistema (`09-sistema.html:561`) e da Lançadores
   (`07-lancadores.html:510`) mostram o mesmo assunto. Enquanto essas duas abas
   não tiverem o gesto, tirá-lo daqui deixa a pessoa sem por onde marcar.
