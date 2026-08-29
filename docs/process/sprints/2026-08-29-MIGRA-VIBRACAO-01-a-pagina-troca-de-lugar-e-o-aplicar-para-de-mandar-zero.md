---
sprint: MIGRA-VIBRACAO-01
onda: MIGRA-VIBRACAO
posse:
  MV1:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/footer_actions.py
    - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
cria:
  - src/hefesto_dualsense4unix/app/telas/__init__.py
  - src/hefesto_dualsense4unix/app/telas/vibracao.py
  - tests/unit/test_migra_vibracao_01_a_pagina_e_o_webview.py
  - tests/unit/test_migra_vibracao_01_o_aplicar_nao_manda_zero.py
bancada: false
depois_de:
  # A EXECUÇÃO ESPERA A PALAVRA DELA sobre o piloto (a aba Controles, viva
  # agora). Palavra dela, 29/08: "Depois dou o ok pra seguirmos materializando
  # a ordem pra fazermos todas as abas funcionarem no novo motor."
  - MIGRA-CONTROLES-PILOTO
  # A MOLDURA: o transporte genérico das duas pontes (11 linhas, uma vez) e a
  # CASA do HTML dentro de `src/`. Não nascem aqui.
  - MIGRA-MOLDURA-01
  # BANCADA DO `main.glade` — XML único sem seções nomeadas: conflito de merge
  # nele é irrecuperável na prática. Estas o têm em POSSE (medido em 29/08) e
  # correm antes, na ordem das ondas de SPRINT_ORDER.md §1.2.
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - LEVA-2
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
  - ONDA-PERFIS-01
  - ONDA-CONTROLES-02
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - MIGRA-SISTEMA-01
  # SÉRIE por R5 — dividem `rumble_actions.py`, `app.py` ou `footer_actions.py`
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  - IDENTIDADE-01
  - ONDA-PERFIS-08
  # AS OUTRAS ONDAS DA MESMA LEVA que reivindicam os mesmos arquivos.
  # Lista de 29/08, e ela SE MOVE: as dez ondas estavam sendo escritas ao
  # mesmo tempo. Quem coordena reconfere com `check_colisao_de_sprints.py`
  # antes de despachar.
  - MIGRA-CONTROLES-01
  - MIGRA-GATILHOS-03
  - MIGRA-GATILHOS-07
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-07
  - MIGRA-JOGAR-01
  - MIGRA-LANCADORES-10
  - MIGRA-NAVEGACAO-01
  - MIGRA-PERFIS-01
  - MIGRA-SISTEMA-01
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/core/
  - src/hefesto_dualsense4unix/profiles/schema.py
  - novo-layout/
---

# MIGRA VIBRAÇÃO · 01 — a página troca de lugar, e o "Aplicar" para de mandar (0, 0)

**Esta sprint não mede o enxerto substitutivo. Ela materializa o que a medição
de 29/08 já achou — e uma das coisas que ela achou é um defeito que destrói o
gesto dela em silêncio.**

**CORREÇÃO DE FATO, 29/08/2026 às 17h38.** A decisão
`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK` diz *"o enxerto
substitutivo ainda não foi medido"*, e o
`2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md` repete. **Foi medido, e foi
medido NESTA aba** — a página `Rumble` foi a cobaia, em cinco modos, com dublê
de IPC e o `intacto` como base. A prova inteira está na pasta `o-que-resta/` do
scratchpad daquela sessão: `enxerto_substitutivo.py`, `r-*.json`, `prova_da_ponte.py`, `ponte.json`, `o_congelamento.py`, `o_peso.py`. <!-- ref-externa: nenhum destes existe na árvore — foram escritos para medir e não foram commitados; a ausência é o assunto. -->
Quem executar **confere os números antes de usá-los**: eles são de `dev` em
29/08, e esta aba tem sprints em voo.

## O defeito

A página 6 do `Gtk.Notebook` é `scroll_tab_rumble_box`
(`gui/main.glade:1704`), com `tab_rumble_box` dentro (`:1713`) — **17 ids**,
**9 `<signal>`**, e o bloco de widgets que vai de `:1752` a `:2085`. Nada disso
é a tela que ela aprovou (`novo-layout/05-vibracao.html`, elogio literal dela:
*"ok, foda. (…) Tá fechado essa."*).

Trocar essa página **não estoura nada**, e é essa a má notícia. Medido no modo
`real` (o XML da página apagado do Glade antes de construir):

| modo | páginas | ordem | pág. 6 | ids ausentes | órfãos | `None` nos gestos | estouros |
|---|---|---|---|---|---|---|---|
| `intacto` (base) | 11 | sim | ScrolledWindow | 0 | 0 | 0 | 0 |
| `orfao` (só `remove_page`) | 11 | sim | **WebView** | 0 | **15** | 0 | 0 |
| **`real`** (XML apagado) | **11** | sim | **WebView** | **15** | 0 | **64** | **0** |

**Treze gestos, zero exceções, e os treze pedem pelo menos um id que voltou
`None`.** A causa está escrita no próprio código: `rumble_actions.py:1185-1186`
— *"B1-rumble: None-guard — `_get` pode devolver None se o widget não existe no
builder"*. Todo acesso é guardado. Tirar a página **desliga em silêncio**.

**E um gesto não fica em silêncio — ele mente ao aparelho:**

```
_read_scales()  →  rumble_actions.py:1184-1191
    w = self._get("rumble_weak_scale")                    # None
    weak = int(w.get_value()) if w is not None else 0     # ← o fallback

base (glade intacto):  rumble.set[160, 220]
enxerto substitutivo:  rumble.set[  0,   0]
toast base : "Vibração travada (fraca=160, forte=220) …"
toast agora: "Vibração travada (fraca=0, forte=0) …"
```

O "Aplicar" manda **os motores calarem** e confirma na barra de estado. Nenhum
log, nenhum erro. É *a casa sabe e o produto não faz*, com a cura escrita no
lugar errado: o guarda existe para não estourar, e o que ele faz é **inventar
um zero que ela não escolheu**.

### Os outros três achados da mesma medição

1. **`Gtk.ScrolledWindow.add(webview)` não entrega o webview.** O `WebKit2 4.1`
   não implementa `Gtk.Scrollable`, então o GTK3 interpõe um `Gtk.Viewport`: a
   página passa a rolar **duas vezes** e com a altura natural em vez da visível.
   O webview tem de ser a página do notebook, **direto**.
2. **Quatro tabelas chaveadas pelo id do Glade, todas com pulo silencioso:**
   `footer_actions.FROZEN_WIDGET_IDS:112` (13 ids → **11 congelados**, perdendo
   `rumble_weak_scale` e `rumble_strong_scale`), `app.py:1090`
   (`_REFRESH_POR_ABA`), `app.py:1229` (`_ALVO_POR_ABA`) e `app.py:1362`
   (`_PAGINAS_COM_TETO_ELASTICO`) — as três últimas pela chave
   `"tab_rumble_box"`.
3. **Três réguas ficam cegas ao sumiço da página**, e uma delas é tautologia:
   `tests/unit/test_footer_actions.py:105` — `builder.get_object.return_value =
   widget_mock` devolve um mock para **todo** id, nunca `None`, e a asserção é
   `call_count == len(FROZEN_WIDGET_IDS)`, que é a lista comparada com ela
   mesma. Rodou: **3 passed** com o defeito ativo. As outras duas:
   `test_z2_fita_declara_quem_obedece.py` e `scripts/portao_alvo_tem_dono.py`,
   que imprime *"`_ALVO_POR_ABA` cobre as 4 leitoras e as 7 inertes"* **sem
   nunca abrir o Glade**. Este é o mesmo defeito que `footer_actions.py:122`
   registra como **já pago uma vez** (`BUG-FROZEN-WIDGET-IDS-01`), e o enxerto
   substitutivo o reintroduz **por construção, uma vez por aba migrada**.

## O que entrega

1. **A página 6 do `Gtk.Notebook` passa a ser o `WebKit2.WebView`, direto.**
   Nunca dentro de um `Gtk.ScrolledWindow`. Rótulo "Vibração", posição 6.
2. **O XML da página sai do `main.glade`** — `scroll_tab_rumble_box`,
   `tab_rumble_box` e os 15 ids de dentro, mais os **três `GtkAdjustment` de
   topo** (`rumble_policy_adj`, `rumble_weak_adj`, `rumble_strong_adj`). São 20
   ids no total, e o Glade cai de **376 para 343 objetos**.
3. **O mixin de pintura sai junto com o XML.** Medido por AST pelo
   `quanto_morre.py` daquele scratchpad <!-- ref-externa: instrumento não commitado -->, das linhas em função de `rumble_actions.py`, **morrem
   100** — as 4 funções que são só pintura (`_rotulo_do_teto`,
   `_pintar_a_linha_do_teto`, `_rotulo_do_alcance_do_gesto`,
   `_pintar_a_linha_do_alcance_do_gesto`, 64 linhas) e 36 linhas de widget
   dentro de 8 funções mistas. **Sobrevivem intactas ~400**: as funções puras
   que já viram texto (`texto_dos_pedidos_de_vibracao:186`,
   `texto_do_alcance_da_intensidade:291`, `texto_do_teto_do_orcamento:370`,
   `_pedidos_por_jogador:116`, `_sync_policy_from_state:640`). **A sprint LIGA
   o que sobrevive; não o reescreve.**
4. **`_read_scales` deixa de inventar zero.** No motor novo o par vem da
   página. Se a página não respondeu, o gesto **recusa com motivo** e **não
   emite IPC** — nunca manda (0, 0). Zero é um valor que ela pode ter
   escolhido; ausência de resposta não é zero, e confundir os dois é o defeito
   desta sprint.
5. **As quatro tabelas ganham a chave nova**, e as **três réguas cegas ganham
   olho** — a do `footer_actions` para de usar o molde do mock que nunca devolve
   `None`, e o `portao_alvo_tem_dono.py` passa a abrir o Glade.
6. **`app/telas/vibracao.py`** — o adaptador desta aba: o que ela manda para a
   tela, o que recebe de volta, e o casamento com o DOM. Medido: **~55 linhas**
   (30 de Python + 25 de JS). O transporte genérico (11 linhas, uma vez para as
   dez abas) é do `MIGRA-MOLDURA-01`.

**Saldo de linhas medido nesta aba:** −45 de Python (100 morrem, 55 nascem) e
**−415 linhas de XML** do `main.glade`, mais 21 dos adjustments.

## Como se prova (a mordida)

`tests/unit/test_migra_vibracao_01_a_pagina_e_o_webview.py`

- **o notebook tem 11 páginas, na ordem certa, "Vibração" na 6, e a página 6 é
  um `WebKit2.WebView`.** *Arranque 1:* remova a página e não ponha nada — a
  régua tem de acusar **três** coisas ("10 páginas, não 11", "os rótulos saíram
  fora de ordem", "a página 6 não é o webview"); foi exatamente isso que o modo
  `mordida-vazio` devolveu. *Arranque 2:* não enxerte nada e afirme que
  enxertou — a régua acusa "a página 6 não é o webview" (`mordida-cru`).
- **a página do notebook é o webview, e o pai dele é o `Gtk.Notebook`.**
  *Arranque:* ponha o webview dentro de um `Gtk.ScrolledWindow` e veja
  reprovar — o GTK3 interpõe um `Gtk.Viewport` e a página passa a rolar duas
  vezes.
- **as outras dez páginas continuam no builder e continuam respondendo**, e
  nenhuma delas perdeu um id.
- **`FINISHED` não é prova de carga.** A régua escuta `load-failed` **também**:
  o WebKit commita uma página de erro e dispara `FINISHED` depois dela. Uma
  régua que escuta só `FINISHED` reporta sucesso sobre carga que falhou. E o
  título **não** se lê no handler de `FINISHED` (chega vazio) — leia por
  `notify::title`.

`tests/unit/test_migra_vibracao_01_o_aplicar_nao_manda_zero.py` — **a mordida
que mais importa**

- com a página trocada e a tela pintada com (160, 220), o "Aplicar" emite
  `rumble.set(weak=160, strong=220)`. **Arranque: devolva o fallback `else 0` de
  `_read_scales:1189-1190` e veja o IPC sair `(0, 0)`** — que é o que a medição
  de 29/08 registrou, com o toast confirmando o silêncio.
- com a página **sem responder**, o gesto **não emite IPC nenhum** e diz o
  motivo. *Arranque:* faça a ausência valer zero e veja reprovar.
- **`FROZEN_WIDGET_IDS` congela 13 de 13 depois do enxerto.** *Arranque:* tire
  os dois ids da lista sem pôr os novos → 11, e a régua acusa **quais dois**.
- **a régua roda contra o `builder` REAL.** Não contra um mock cujo
  `get_object.return_value` devolve widget para todo id — esse molde é o que
  deixa `test_footer_actions.py:105` verde sobre o defeito, e repeti-lo aqui
  seria escrever a sexta régua falsa do dia.

## O que é dela decidir

Nada de desenho **nesta** sprint: o que muda é onde a tela mora.

**Mas esta sprint não vai sozinha à prova de tela dela.** Enquanto o desenho não
tiver a área de avisos (é a **08**), a aba **perde** a linha "Estado da
vibração", o aviso do teto do orçamento e o lugar do toast — três canais de
verdade que o produto de hoje tem. `PROVA-DE-TELA-01` vale: foto antes e
depois, e a **01 e a 08 vão juntas** à mesa dela.

## Colisão declarada

`gui/main.glade` é **recurso de bancada** — uma sprint por vez
(`COMO-EXECUTAR-UMA-SPRINT.md` §2). Vinte e uma sprints o têm em posse; a fila
está no `depois_de`. Se outra onda estiver em voo no XML, **quem coordena
serializa**; não resolva conflito de Glade sozinho.
