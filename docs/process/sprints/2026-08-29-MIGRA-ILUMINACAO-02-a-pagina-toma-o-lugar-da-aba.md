---
sprint: MIGRA-ILUMINACAO-02
onda: MIGRA-ILUMINACAO
posse:
  IL2:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_migra_iluminacao_02_o_enxerto_substitutivo.py
bancada: false
depois_de:
  - COOP-NA-CONEXAO-NATIVA-01
  - EMULACAO-UM-DONO-SO-01
  - IDENTIDADE-01
  - LEVA-1
  - MIGRA-JOGAR-01
  - ONDA-CONTROLES-02
  - ONDA-GATILHOS-02
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - ONDA-ILUMINACAO-07
  - ONDA-ILUMINACAO-08
  - ONDA-ILUMINACAO-09
  - ONDA-ILUMINACAO-10
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
  # A FILA INTEIRA que vem antes desta, e ela é longa de propósito: nove das doze
  # abrem `app/actions/lightbar_actions.py` e cinco abrem `_ferramentas/aba04.py`.
  # Quem divide arquivo executa EM SÉRIE (R5), e o portão de colisão não faz fecho
  # transitivo — por isso a fila se escreve inteira, como na ONDA-SISTEMA-02.
  # A MOLDURA É DA ONDA DO PILOTO, e tem nome: a CONTROLES-01 cria o
  # `gui/webview_de_aba.py` (o enxerto e o id que não some), a 02 muda a página <!-- ref-externa: nasce na onda do PILOTO (MIGRA-CONTROLES) -->
  # de casa (`gui/telas/`, `scripts/telas/`, `install.sh`, `pyproject.toml`) e a
  # 03 cria as duas pontes (`gui/ponte_da_tela.py`). <!-- ref-externa: nasce na onda do PILOTO (MIGRA-CONTROLES) -->
  - MIGRA-CONTROLES-01
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-03
  - MIGRA-ILUMINACAO-01
  - MIGRA-ILUMINACAO-03
  - MIGRA-ILUMINACAO-11
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA ILUMINAÇÃO · 02 — A página toma o lugar da aba

**O enxerto SUBSTITUTIVO, e ele nunca foi medido.** O que foi provado em
29/08 é o enxerto **aditivo** — o `WebKit2.WebView` como 12ª página do
`Gtk.Notebook` do produto, 376 objetos em 56 ms, 62 → 285 MiB PSS. **Ninguém
mediu TROCAR uma página**, e é aqui que reaparecem as 60.862 linhas que hoje
chegam aos widgets por `builder.get_object()`.

## O defeito

A aba de hoje são **538 linhas de XML** — `gui/main.glade:1146-1683` — com **27
ids**:

```
tab_lightbar_box · scroll_tab_lightbar_box · lightbar_color_button ·
lightbar_brightness_scale · lightbar_preview · lightbar_estado_no_controle ·
lightbar_apply · lightbar_off · lightbar_auto_reset_target ·
lightbar_auto_reset_all · auto_player_colors_check ·
auto_player_colors_subtitle · player_led_1..5 · player_leds_apply ·
player_leds_estado · player_leds_note · player_leds_auto_note ·
player_leds_preset_all · player_leds_preset_none · player_leds_preset_p1..p4
```

Oito deles `lightbar_actions.py` busca por `self._get(...)`:
`auto_player_colors_check`, `lightbar_auto_reset_all`,
`lightbar_auto_reset_target`, `lightbar_brightness_scale`,
`lightbar_color_button`, `lightbar_estado_no_controle`, `lightbar_preview`,
`player_leds_estado`. Mais os cinco `player_led_N` do laço (`:623`, `:1424`,
`:1469`), que a `MIGRA-ILUMINACAO-01` já tirou do caminho.

**Cada `_get` que devolver `None` degrada em silêncio.** O módulo é defensivo
por toda parte, então o sintoma da troca mal feita não é uma exceção — é a
AUSÊNCIA de dado, que ninguém vê.

## O que entrega

1. **A página troca de motor sem trocar de nome.** `scroll_tab_lightbar_box`
   deixa de embrulhar a caixa GTK e passa a levar o `WebView` com a página da
   Iluminação. **O id `tab_lightbar_box` NÃO muda.** Ele é a chave de
   `_ALVO_POR_ABA` (`app/app.py:1228`), de `_REFRESH_POR_ABA`, do portão da Z2-9
   e do `id_da_pagina(page)` que `_on_notebook_switch_page` (`app.py:1239-1253`)
   usa para saber em qual aba está. **Trocar o widget sem preservar o id para a
   fita e o refresh em silêncio** — é a mesma armadilha que a onda Jogar mediu
   no poller da Início.
2. **As 538 linhas saem do Glade**, com os 27 ids.
3. **`install_lightbar_tab` (`:741`) muda de ofício:** deixa de fiar widget GTK
   (`connect("draw")`, `connect("toggled")`, `connect("clicked")`,
   `_fiar_aplicar_ao_soltar`) e passa a fiar **as duas pontes** —
   `run_javascript` para pintar e um `register_script_message_handler` para
   receber. As pontes são da moldura (`MIGRA-CONTROLES-01/02/03`) e custam 31 linhas,
   uma vez; esta sprint as CONSOME.
4. **O preço fica escrito.** PSS antes e depois do enxerto substitutivo, e o
   tempo do `load_uri` até o `FINISHED` **com a guarda de `load-failed`**.
   Ninguém sabe hoje se trocar sai mais barato ou mais caro que acrescentar.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_02_o_enxerto_substitutivo.py`:

- **o id sobrevive à troca.** Depois do enxerto, `id_da_pagina(page)` da página
  da Iluminação devolve `tab_lightbar_box`. Troque o id e o teste reprova — e o
  portão da Z2-9 reprova junto.
- **a fita continua no mapa.** `_ALVO_POR_ABA` tem a chave, e
  `_on_notebook_switch_page` continua chamando `set_alvo_inativo` com o motivo
  dela. (O VALOR do motivo é da `MIGRA-ILUMINACAO-07`; aqui só a chave.)
- **carga que falha é carga que falha, e esta é a mordida principal.** Aponte o
  WebView para um arquivo que não existe. **Com a guarda:** o produto diz que
  falhou, com o motivo do WebKit. **Arranque a guarda de `load-failed` e o teste
  passa** — porque `FINISHED` dispara sobre a página de erro que o WebKit
  commita, e quem escuta só `FINISHED` **reporta sucesso sobre carga que
  falhou**. Foi medido em 29/08 e custou tempo a alguém. Devolva a guarda.
- **o título não se lê no FINISHED.** Se a régua usar `get_title()` no handler
  de `FINISHED`, ela lê vazio — nove de dez abas voltaram sem título para quem
  mediu assim. A régua tem de esperar o `notify::title`.
- **nada mais lê os 27 ids.** `grep` em `src/` por cada um dos 27 → zero
  ocorrências. Deixe um `self._get("lightbar_preview")` para trás e o teste
  reprova.
- **o preço está no documento.** O teste NÃO reprova por número de MiB (medir
  memória em CI mente); ele exige que os dois números — antes e depois — estejam
  escritos no documento da sprint, com a máquina e a data. Apague o número e o
  teste reprova.

## O que é dela decidir

- **Onde o HTML passa a morar, e esta sprint NÃO decide.** `novo-layout/` é
  `.gitignore:108` (conferido: `git check-ignore -v` reprova
  `novo-layout/04-iluminacao.html`), logo **não viaja em `git worktree add`, não
  está no pacote, e `install.sh` não o copia** — ele copia `assets/glyphs`
  (`install.sh:3103`) e mais nada de desenho. **A rota WebKit inteira depende de
  um arquivo que o repositório não tem.** Isso é da moldura das dez ondas
  (`MIGRA-CONTROLES-01/02/03`), não desta aba, e sem ela **a aba nasce em branco na
  máquina instalada, sem um erro no log**.
- **Os quatro pinos de versão** (`Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
  `WebKit2 4.1`), o `select{appearance:none}` e os **36 filtros mortos desta
  página** (medidos: 12 `<filter>` com id prefixado, contra 36
  `filter: url(&quot;#outline-filter-N&quot;)` sem prefixo) também são da
  moldura. A cura dos filtros está pronta, muda 1,09% do desenho que ela
  aprovou, e **é dela**.

## Colisão declarada

`gui/main.glade` é **recurso de bancada — uma sprint por vez**
(`docs/process/COMO-EXECUTAR-UMA-SPRINT.md`). Nesta onda ele é aberto **uma vez
só**: aqui. Na onda antiga eram duas (a 04 e a 10, em série); no motor novo a 10
morre e sobra esta. Nenhuma outra sprint desta onda o salva, e a onda inteira
corre em série com as outras nove **quanto a este arquivo**.
