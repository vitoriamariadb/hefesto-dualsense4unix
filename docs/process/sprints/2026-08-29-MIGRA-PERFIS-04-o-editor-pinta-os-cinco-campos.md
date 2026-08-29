---
sprint: MIGRA-PERFIS-04
onda: PERFIS
posse:
  MP4:
    - src/hefesto_dualsense4unix/app/actions/perfis_web.py
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
cria:
  - tests/unit/test_migra_perfis_04_o_editor_pinta_os_cinco_campos.py
bancada: false
depois_de:
  - MIGRA-PERFIS-01
  - MIGRA-PERFIS-02
  - MIGRA-PERFIS-03   # divide os dois arquivos da posse com esta
  # A ONDA PERFIS de 27/08: oito das nove reivindicam `profiles_actions.py`, e
  # quem divide arquivo corre EM SÉRIE (R5). O índice desta onda diz o que
  # sobra de cada uma depois da decisão do WebKit.
  - ONDA-PERFIS-01
  - ONDA-PERFIS-02
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04
  - ONDA-PERFIS-05
  - ONDA-PERFIS-06
  - ONDA-PERFIS-08
  - ONDA-PERFIS-09
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/profiles/schema.py
  - novo-layout/
---

# MIGRA PERFIS · 04 — o editor pinta os cinco campos

**O defeito:** o editor de hoje tem **duas páginas** — a simples, com o seletor
de ambiente, e a avançada, com `window_class`, `title_regex` e `process_name`
crus. O desenho tem **uma** página e **cinco** campos. A página avançada não é
enfeite: ela é a **válvula de segurança**, e está escrito no produto.

> *"Detecta automaticamente se o match bate com um preset simples: bate → modo
> simples (…); **não bate → força modo avançado para não perder informação**."*
> — `profiles_actions.py:3952`, docstring de `_populate_editor`

| O quê | Onde | Estado |
|---|---|---|
| encher o editor | `profiles_actions.py:3952` (`_populate_editor`) | **existe** |
| descobrir o ambiente pelo match | `profiles/simple_match.py:251` (`detect_simple_preset`) — **pura** | **existe** |
| o texto do "Nome do jogo" | `profiles/simple_match.py:305` (`simple_extra`) — **pura** | **existe** |
| os presets | `profiles/simple_match.py:157` (`SIMPLE_MATCH_PRESETS`) | **existe** |
| escolher no seletor | `profiles_actions.py:3749` (`_select_radio`) | **existe** |
| a lista de ambientes | `profiles_actions.py:130` (`_APLICA_A_ITEMS`) — **SETE** | **existe** |
| Estilo de Jogo | — | **NÃO EXISTE EM LUGAR NENHUM** |

## O QUE ESTA SPRINT PRECISA MEDIR ANTES DE ESCREVER UMA LINHA

**Encolher o seletor de sete para cinco rebaixa perfil em silêncio.**

`_select_radio` (`profiles_actions.py:3759`) cai para `"any"` quando o id não
está em `_RADIO_IDS` (`:82` — `any, steam, browser, terminal, editor, game,
steam_game`). Um perfil salvo com `browser`, `terminal` ou `editor` passa a
**abrir dizendo "Todos"**; se ela encostar no seletor, `_regra_tocada` arma, e o
Salvar seguinte grava `MatchAny()` **por cima da regra dela**. É o defeito R-12
de 23/07 pelo avesso, e o estrago que ele produz JÁ ACONTECEU nesta casa: os
perfis dela perderam o `match` (virou `{"type": "any"}`) e as prioridades
escalaram até 191 — a história está em `profiles/loader.py:1229-1237`.

**E não são só os três ambientes.** MEDIDO agora, nos nove perfis de fábrica:
**sete dos nove** casam por `window_title_regex` ou por lista de `window_class`
— `acao`, `aventura`, `corrida`, `esportes` e `fps` pelo título; `navegacao` e
`point_and_click` pela classe. Só `fallback` e `meu_perfil` são `any`. **Nenhum
dos sete cabe nos cinco campos do desenho.** Hoje eles abrem na página avançada;
sem ela, abrem numa tela que não os descreve.

**Logo esta sprint entrega uma MIGRAÇÃO, não uma tradução de widget.** Ou o
Estilo de Jogo absorve os sete **antes** de a página avançada morrer
(`ONDA-PERFIS-04`), ou o editor precisa de um estado honesto para
*"este perfil tem uma regra que esta tela não sabe mostrar — não mexa"* que
**impeça o Salvar de rebaixá-la**. As duas saídas são aceitáveis; sumir com a
página avançada sem nenhuma das duas não é.

## O que entrega

1. **Os cinco campos pintam do `Profile`**, pelas funções puras que já existem:
   `detect_simple_preset` diz qual ambiente, `simple_extra` diz o texto do
   jogo, e nome e prioridade saem do próprio objeto. **Nada disso se reescreve.**
2. **O `profile_editor_stack` e a página avançada morrem** — e com eles os
   `profile_window_class_entry`, `profile_title_regex_entry` e
   `profile_process_name_entry`. **Só depois** de a válvula acima estar de pé
   (ver a mordida).
3. **O terceiro estado do seletor.** Além dos cinco do desenho, o editor precisa
   saber dizer *"regra que esta tela não mostra"* sem inventar um sexto botão
   na cara dela: o valor entra como **estado**, não como opção — o seletor
   aparece desabilitado com a frase, e o Salvar preserva o `match` do disco.
4. **"Estilo de Jogo" nasce visivelmente DESLIGADO, com o motivo.** Não há campo
   no `Profile`, não há widget, não há preset — os seis de gênero em
   `assets/profiles_default/` são **perfis**, não estilos. Quem lhe dá motor é a
   `ONDA-PERFIS-04`. Um `<select>` que aceita escolha e não guarda nada é a
   pior das três saídas.

## Como se prova (a mordida)

`tests/unit/test_migra_perfis_04_o_editor_pinta_os_cinco_campos.py`:

- **A MORDIDA PRINCIPAL — o perfil que a tela não sabe mostrar não é rebaixado.**
  Carregue um `Profile` com `window_title_regex` (um dos cinco de fábrica serve;
  use uma cópia, não o arquivo dela). Pinte o editor, **toque no seletor**,
  clique em Salvar. O `match` gravado tem de ser **o mesmo do disco**. Arranque a
  válvula e o teste vê `{"type": "any"}` — que é exatamente o dano de 05/08 se
  repetindo, e é por isso que esta é a régua que fecha a sprint.
- **os cinco campos pintam**: um `Profile` com preset de `game` chega à página
  com ambiente `Jogo` e o texto do jogo no lugar. Arranque a chamada a
  `simple_extra` e o campo do jogo sai vazio.
- **os três ambientes que sumiram**: um perfil com `browser` **não** abre
  dizendo "Todos". Ou ele abre no estado honesto, ou o seletor tem seis. O que
  o teste recusa é a terceira possibilidade — abrir mentindo.
- **o Estilo de Jogo não engole escolha**: o `<select>` está desabilitado e a
  ponte **não** tem gesto registrado para ele. Ligue o gesto sem o campo no
  esquema e o teste reprova.
- **o texto vai como texto**: nome de jogo com `<` e com aspas chega literal à
  tela (a mesma régua da **03**, agora do lado do editor — o "Nome do jogo" pode
  vir do título de uma janela que ninguém desta casa controla).

## O que é dela decidir

1. **CINCO OU SEIS AMBIENTES — duas decisões dela, do MESMO dia, se
   contradizem.** `docs/data/decisoes-dela.csv:55`
   (`D-NAVEGADOR-SAI-DO-SELETOR`) fecha o seletor em **cinco**;
   `:84` (`D-PROGRAMAS-NO-LUGAR-DE-TERMINAL`) diz os mesmos cinco **mais
   Programas**, com a palavra dela: *"bota aí, sei lá, um Programas, algo assim,
   pra ser todo o resto"*. O mockup implementa **cinco** e **nenhuma lápide
   explica por que a de seis caducou**. Isto não é acabamento: cinco ou seis
   muda o que acontece com os perfis dela que hoje casam por
   `browser`/`terminal`/`editor`, e um "Programas" cobre justamente esses.
2. **"Modo que liga" e "O jogo vê o controle como" ficam nesta aba?** O contrato
   diz que **ficam** (`2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 9); o
   mockup **não os desenha**. No motor novo, o que o mockup não desenha o produto
   não tem — some com `profile_mode_frame` (`gui/main.glade:2640`), com
   `_install_mode_section` (`profiles_actions.py:1481`) e com os quatro rótulos
   de `_MODE_KIND_ITEMS` (`:147`). A mesma pergunta trava a **01**.
3. **O "Automático" da máscara já morreu, e a lápide está escrita** — decisão
   dela de 29/08, porque a heurística que o moveria erra em **13 dos 14** jogos
   do censo dela (`integrations/api_de_entrada.py:12-49`). O que morreu foi a
   quarta opção, **não a máscara**: ela continua com três (DualSense · Xbox 360 ·
   Nintendo Pro) e o perfil continua guardando-a. Não a ressuscite ao migrar.
