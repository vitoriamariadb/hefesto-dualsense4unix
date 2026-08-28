---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-07
posse:
  NAV-G:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/input_actions.py
cria:
  - src/hefesto_dualsense4unix/app/widgets/tabela_de_navegacao.py
  - tests/unit/test_nav_tres_tabelas_de_dropdown.py
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
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
  - src/hefesto_dualsense4unix/app/app.py
---

# ONDA NAVEGAÇÃO · 07 — As três tabelas viram dropdown

## O defeito, em uma frase

Nas três tabelas da aba, mudar um valor é **duplo clique numa célula que aceita
texto livre** ou não é mudar coisa nenhuma: o Mapeamento é rótulo fixo, e os
atalhos pedem que a pessoa digite `Alt + Tab` sem errar.

## A palavra dela, literal

> "quando eu falei de drop in eu tava falando de todos os campos (coluna da
> direita das três tabelas ali, pra cada valor de cada linha) e arrumar a largura
> e disposição dos elementos."
> — 27/08/2026, `novo-layout/_ferramentas/CORRECOES-DELA.md`, seção Navegação;
> literal em `/tmp/coleta/hoje.md:275`

## O que está medido

- `gui/main.glade:3861` — o `mouse_mapping_grid`: oito pares em `GtkLabel`,
  **texto fixo**. Não é editável nem lê o mapa real (ONDA-NAVEGACAO-04).
- `gui/main.glade:4088` `key_bindings_treeview` + `app/actions/input_actions.py:363`
  `_install_key_bindings_treeview` e `:527` `_on_key_binding_cell_edited` — edição
  por **duplo clique com texto livre**, passando por `dehumanize_binding`
  (`input_actions.py:200`) para adivinhar o que a pessoa digitou.
- O quadro dos gestos não tem tabela nenhuma: é o cartaz da aba Emulação
  (`main.glade:3212` `emulation_combo_grid`), só rótulo.

## O que entrega

1. `app/widgets/tabela_de_navegacao.py` — **um** widget de tabela para as três,
   porque as três têm a mesma forma: glifo do botão à esquerda, `GtkComboBoxText`
   à direita. Três instâncias, um código.
2. As três listas de valores são as do mockup (`novo-layout/_ferramentas/aba06.py`):
   - **gestos** → `ACOES_GESTO`, oito ações (ONDA-NAVEGACAO-03);
   - **mapeamento** → `ACOES_MOUSE`, nove ações (ONDA-NAVEGACAO-04);
   - **atalhos** → `TECLAS`, a lista de teclas com "— sem tecla —" no fim.
3. A treeview de atalhos e o grid de rótulos do Mapeamento **saem** do Glade.
4. **Largura e disposição**, que é a segunda metade do pedido dela: as três
   tabelas com a mesma largura de coluna do botão (o mockup fixa `td.b` em 158px)
   e a mesma altura de linha; as duas colunas da aba com a mesma altura, como ela
   exigiu nas outras abas ("Altura e largura dos blocos ... são iguais").
5. **Linha em disputa em laranja**, nas duas tabelas ao mesmo tempo, lendo
   `core/disputa_de_botao.py` (ONDA-NAVEGACAO-04) — nunca uma segunda régua.
6. **"Voltar ao padrão" pergunta antes.** Hoje apaga direto
   (`input_actions.py:518` `on_key_binding_restore_defaults`).

## Como se prova (o teste que morde)

`tests/unit/test_nav_tres_tabelas_de_dropdown.py`, em `Gtk.OffscreenWindow`:

1. **Nenhuma célula aceita texto livre:** a treeview sumiu do Glade, e todo widget
   da coluna da direita das três tabelas é um combo. Um `GtkEntry` sobrevivente
   reprova.
2. **As três listas batem com o mockup:** cada combo lista exatamente os itens de
   `ACOES_GESTO` / `ACOES_MOUSE` / `TECLAS`, na ordem. É a régua que impede a
   tela e o desenho de divergirem em silêncio.
3. **Escolher no combo chega ao rascunho:** trocar a tecla do L1 no combo grava
   em `draft.key_bindings["l1"]` — e **não** grava no perfil em disco
   (D-APLICAR-NAO-SALVA).
4. **A disputa acende nas duas:** dar `KEY_ENTER` ao ○ pinta a linha do ○ de
   laranja no Mapeamento **e** nos Atalhos. Tirar a tecla apaga as duas.
5. **O gesto travado é inclicável:** o combo do PS + R3 e o do PS + Options vêm
   `sensitive=False`, com a dica do porquê.
6. **"Voltar ao padrão" pergunta:** a ação sem confirmação **não** muda o
   rascunho; confirmada, devolve `DEFAULT_BUTTON_BINDINGS`.
7. **A mordida:** devolver a treeview ao Glade e ver 1 reprovar; tirar um item da
   lista de teclas e ver 2 reprovar. Colar as duas saídas.

## A prova de tela

Fotografar as três tabelas antes e depois (`retratar_abas.py`), e medir as
larguras — o pedido dela tem duas metades e a segunda é geometria, não função.

## O que é dela decidir

1. **A lista de teclas é fechada?** O mockup lista dez teclas + "— sem tecla —".
   Hoje `dehumanize_binding` aceita qualquer combinação que a pessoa escreva
   (`input_actions.py:200`). Fechar a lista mata o erro de digitação e mata
   também `Ctrl + Alt + F2`. A saída intermediária é um item "Outra tecla…" que
   abre o campo livre — mais um estado, mas nada se perde.
2. **"Adicionar" ainda faz sentido com combo?** Hoje ele cria linha para o próximo
   botão sem tecla começando em "Espaço" (`input_actions.py:482`). Com todos os
   botões já listados e "— sem tecla —" como valor, a lista pode nascer completa
   e os três botões (Adicionar/Remover/Voltar ao padrão) viram um só. O mockup
   mantém os três — confirmar se é para manter mesmo.
</content>
