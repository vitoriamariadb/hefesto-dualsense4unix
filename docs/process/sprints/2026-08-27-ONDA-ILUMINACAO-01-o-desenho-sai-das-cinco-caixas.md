---
sprint: ONDA-ILUMINACAO-01
estado: absorvida
# onda: ILUMINACAO — o campo `onda:` ainda NÃO existe em
# scripts/check_colisao_de_sprints.py:_CAMPOS_CONHECIDOS, e campo desconhecido
# é erro duro no analisador. Fica como comentário até alguém acrescentá-lo.
posse:
  ILUM01:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_ilum_01_o_desenho_nao_mora_em_caixa.py
bancada: false
depois_de:
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 04). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA ILUMINAÇÃO · 01 — O desenho sai das cinco caixas

**O defeito, em uma frase:** o desenho das cinco luzinhas só existe como estado
de cinco `GtkCheckButton` escondidos, e enquanto for assim **apagar o painel
grava "tudo apagado" no perfil dela**.

## Onde está hoje, medido

- os cinco checkboxes: `src/hefesto_dualsense4unix/gui/main.glade:1478-1482`;
- o único leitor: `get_current_player_leds` —
  `app/actions/lightbar_actions.py:1466` — que faz `self._get(f"player_led_{i}")`
  e devolve a tupla de cinco;
- quem grava no perfil a partir dela: `on_player_leds_apply`
  (`lightbar_actions.py:1349`) e `_set_player_leds` (`:1414`), pelo
  `_persist_leds_update({"player_leds": bits})`;
- o desenho canônico do número já existe fora da GUI:
  `core/led_control.player_led_pattern` (`core/led_control.py:122`), que cobre
  **1..8** mais o padrão de estouro.

O contrato da aba diz com todas as letras: as caixas *"saem, mas só depois de o
estado do desenho mudar de lugar"*
(`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4).

## O que entrega

1. O desenho passa a morar num atributo próprio da aba (`_player_leds_atual`),
   alimentado pelo perfil/rascunho na entrada e por `player_led_pattern(numero)`
   quando não há escolha explícita — **nunca mais pela leitura de widget**.
2. `get_current_player_leds` lê desse atributo. Os cinco checkboxes continuam no
   glade nesta sprint, mas viram **espelho de leitura**: quem manda é o estado.
3. `_set_player_leds` continua atualizando os checkboxes enquanto eles existirem
   (o `_player_leds_batch_guard` fica como está), e passa a escrever primeiro no
   estado.

Nada de tela muda nesta sprint. Ela existe para que a ILUM-04 possa apagar 278
linhas de glade sem apagar o perfil dela junto.

## A mordida

`tests/unit/test_ilum_01_o_desenho_nao_mora_em_caixa.py`, com um builder dublê
que **não tem** os widgets `player_led_1..5` (`_get` devolve `None`):

- com o rascunho trazendo o desenho do número 3, `get_current_player_leds()`
  devolve `player_led_pattern(3)` — e **não** `(False,)*5`;
- `on_player_leds_apply` nesse estado manda ao daemon o padrão do 3, e o
  `_persist_leds_update` recebe o padrão do 3;
- o dublê **sabe recusar**: com o daemon dizendo não, o teste exige o toast de
  falha e nenhuma gravação.

Arranque a cura (devolva a leitura por widget) e o primeiro caso reprova com
`(False, False, False, False, False)` — que é exatamente o perfil dela zerado.

## O que é dela decidir

Nada. Esta sprint não muda uma linha de tela nem um texto.

## Fontes

- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4,
  "Nada se perdeu", linha dos LED 1..5;
- decisão: **D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR** (`/tmp/coleta/decisoes.md`).
