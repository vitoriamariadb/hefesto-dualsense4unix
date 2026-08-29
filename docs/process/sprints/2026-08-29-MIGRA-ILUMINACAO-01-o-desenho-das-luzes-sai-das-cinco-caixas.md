---
sprint: MIGRA-ILUMINACAO-01
onda: MIGRA-ILUMINACAO
posse:
  IL1:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_migra_iluminacao_01_o_desenho_sai_das_caixas.py
bancada: false
depois_de: [LEVA-1, ONDA-ILUMINACAO-01, ONDA-ILUMINACAO-02, ONDA-ILUMINACAO-03, ONDA-ILUMINACAO-04, ONDA-ILUMINACAO-05, ONDA-ILUMINACAO-06, ONDA-ILUMINACAO-07, ONDA-ILUMINACAO-08, ONDA-ILUMINACAO-09]
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA ILUMINAÇÃO · 01 — O desenho das cinco luzes sai das cinco caixas

**Esta é a primeira sprint da onda, e a razão é segurança: sem ela, a
`MIGRA-ILUMINACAO-02` grava "tudo apagado" no perfil dela.**

## O defeito

Os cinco `GtkCheckButton` de `gui/main.glade:1478-1482` (`player_led_1` a
`player_led_5`) são hoje **o único armazenamento do desenho das luzes dentro da
GUI**. Três lugares os tocam:

| quem | onde | o que faz |
|---|---|---|
| `_refresh_lightbar_from_draft` | `app/actions/lightbar_actions.py:621-624` | escreve o rascunho nas caixas |
| `_set_player_leds` | `:1414-1465` | escreve um padrão nas caixas |
| `get_current_player_leds` | `:1466-1472` | **lê a tela** e devolve o desenho |

`on_player_leds_apply` (`:1349`) lê `get_current_player_leds`, ou seja, lê a
**tela**, não o rascunho.

Na rota antiga isso era um risco em fila — a antiga `ONDA-ILUMINACAO-01` tirava
o estado das caixas antes de a `ONDA-ILUMINACAO-04` as apagar. **Na rota WebKit
o risco muda de forma e piora: o enxerto substitutivo troca a PÁGINA INTEIRA de
uma vez.** Os cinco somem juntos, e `self._get("player_led_N")` passa a devolver
`None`.

E o módulo é defensivo em toda parte (`if checkbox is not None`, `:624`,
`:1425`, `:1470`), então nada levanta: `get_current_player_leds` devolve
`(False, False, False, False, False)` **em silêncio**, e o próximo "Aplicar o
desenho" ou "Salvar Perfil" grava tudo apagado no perfil dela.

É a armadilha que a memória desta casa já nomeia: *o sintoma é a AUSÊNCIA de
dado, nunca uma exceção*.

## O que entrega

1. **O desenho passa a morar num campo da instância** — `self._player_leds_desenho:
   tuple[bool, bool, bool, bool, bool]` —, semeado pelo rascunho
   (`draft.effective_leds_for(...).player_leds`) e nunca por widget.
2. **`get_current_player_leds` lê o campo.** Zero `self._get` nela.
3. **`_set_player_leds` escreve o campo** e, **enquanto os widgets existirem**,
   espelha neles. É o que faz esta sprint poder rodar ANTES da 02 sem mudar um
   pixel do produto de hoje.
4. **`on_player_led_toggled` (`:1383`) sai.** É handler registrado sem ninguém
   que o chame, morto desde 22/07 — já estava marcado para sair no contrato
   (`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:368`).
5. **Um portão de forma:** nenhuma leitura de `player_led_N` fora de
   `_set_player_leds`.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_01_o_desenho_sai_das_caixas.py`:

- **as caixas somem e o desenho sobrevive.** Dublê cujo `_get` devolve `None`
  para todo `player_led_*`. Semeie o rascunho com
  `(True, False, True, False, False)` e chame `get_current_player_leds`.
  **Com a cura:** devolve o padrão do rascunho. **Arranque a cura** (volte a
  leitura para o widget) **e o teste devolve `(False,)*5` e reprova.** Devolva.
- **o "Aplicar o desenho" com a página trocada.** Mesmo dublê, contando as
  chamadas de `player_leds_set_detalhado`. Os bits que saem são os do rascunho,
  não cinco falsos. Sem a cura, sai `[False]*5` — e é isso que chegaria ao
  perfil dela.
- **o espelho ainda funciona hoje.** Com os widgets presentes,
  `_set_player_leds` continua marcando as cinco caixas. Se esta metade quebrar,
  a sprint não pode rodar antes da 02.
- **o handler morto não volta:** `grep` por `on_player_led_toggled` em
  `src/` → zero.
- **a régua declara o que mede.** Ela mede o MÓDULO
  (`lightbar_actions.py`), não o Glade, e diz isso no docstring. Medir contra a
  coisa errada produz alarme convincente e falso — é a armadilha nº 1 desta
  casa.

## O que é dela decidir

Nada. É segurança pura: nenhum pixel muda, nenhum texto muda, nenhum
comportamento visível muda. **É a única sprint desta onda que pode rodar antes
do ok dela sobre o piloto**, porque protege o perfil dela de um estrago que a 02
causaria.
