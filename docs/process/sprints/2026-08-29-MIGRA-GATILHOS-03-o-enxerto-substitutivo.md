---
sprint: MIGRA-GATILHOS-03
estado: caducou
onda: MIGRA-GATILHOS
posse:
  M3:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
cria:
  - tests/unit/test_migra_gatilhos_o_enxerto_substitutivo.py
bancada: false
depois_de:
  - MIGRA-GATILHOS-01
  - MIGRA-GATILHOS-02
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática, e por R5 quem o abre corre EM SÉRIE
  # (SPRINT_ORDER.md §1.1, trava 2). Esta abre a faixa 767-1133; abaixo está a
  # fila inteira que reivindica o arquivo hoje, na ordem das dez ondas de
  # SPRINT_ORDER.md §1.2.
  - EMULACAO-UM-DONO-SO-01
  - ONDA-SISTEMA-02
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/app/app.py com as de baixo.
  - ONDA-VIBRACAO-06
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-CONTROLES-02
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-VIBRACAO-02
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-PERFIS-01
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/app/app.py com esta.
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  # SUBSTITUÍDAS por esta onda (ver o índice, "As sete sprints ONDA-GATILHOS").
  # Ficam aqui porque enquanto elas estiverem no disco a posse é real, e
  # silêncio não é declaração.
  - ONDA-GATILHOS-01
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
  # AS OUTRAS ONDAS MIGRA, escritas no MESMO DIA e ainda em voo. A lista foi
  # medida em 29/08 com `check_colisao_de_sprints.py`; ela é um retrato, não
  # um contrato — quem coordena reconfere no despacho, porque as irmãs ainda
  # estavam sendo escritas quando esta linha foi tirada.
  - MIGRA-CONTROLES-01
  - MIGRA-JOGAR-01
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-07
  - MIGRA-VIBRACAO-01
  - MIGRA-LANCADORES-10
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - src/hefesto_dualsense4unix/profiles/
  - novo-layout/
---

> **ESTADO 06/09/2026: caducou.** O enxerto da página dentro da janela GTK morreu: o produto é a janela HTML (`interface/hefesto_vivo.py`), e a janela GTK sai nas 24 horas (D-19, liberada por ela em 06/09). Fica como registro do que se mediu.

# MIGRA GATILHOS · 03 — o enxerto substitutivo

**O defeito em uma frase:** o que foi provado em 29/08 é o enxerto **ADITIVO** —
o `WebView` como **12ª página** do `Gtk.Notebook`, 376 objetos em 56 ms. Ninguém
mediu **TROCAR** uma página, e é onde as 60.862 linhas que hoje chegam aos
widgets por `builder.get_object()` reaparecem. A decisão dela diz isso com todas
as letras:

> *"O QUE AINDA NÃO FOI MEDIDO, e vai primeiro: o enxerto SUBSTITUTIVO. (…) é
> onde o custo da rota 3 pode voltar com outra roupa."*
> — `docs/data/decisoes-dela.csv:119`, `D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`

## Por que aqui, e não noutra aba

Porque **Gatilhos é a menor das onze em todos os eixos**, medido em 29/08 e
registrado em `docs/process/2026-08-29-ONDE-PARAMOS-a-tecnologia-decidida-e-a-cura-que-a-tela-desfazia.md:59-62`
— a mesma medição que corrigiu o *"Rumble é a menor, 6 de 6"* para *"Rumble é a
6ª de 11"*.

No `main.glade` isso se conta: a página vai de **767** (`scroll_tab_triggers_box`)
a **1133** (o rótulo da aba), **367 linhas**, e carrega **14 ids** de gatilho:

```
trigger_{left,right}_mode_slot      837 / 998
trigger_{left,right}_preset_row     848 / 1009
trigger_{left,right}_preset_slot    863 / 1023
trigger_{left,right}_desc           874 / 1034
trigger_{left,right}_params_box     907 / 1062
trigger_{left,right}_apply          936 / 1091
trigger_{left,right}_reset          950 / 1105
```

**E o produto NÃO degrada em silêncio aqui — ele morre alto, e isso é sorte.**
Conferido no fonte: `_rebuild_params` faz
`box = self._get(f"trigger_{side}_params_box")` e logo em seguida
`for child in box.get_children()` (`triggers_actions.py:508-513`), sem guarda de
`None`. `install_triggers_tab` o chama (`:162`) e é chamado sem `try` em
`app.py:1496`, **antes** do `window.show_all()`. Tirar a página do Glade sem
tirar a instalação junto **não abre a janela**:
`AttributeError: 'NoneType' object has no attribute 'get_children'`.

Os outros quatro `_get` desta aba (`mode_slot`, `preset_slot`, `preset_row`,
`desc`) **são** defensivos (`if slot is not None`, `:137`, `:147`, `:441`) — esses
sim ficariam mudos. É a armadilha nomeada na memória desta casa: *o sintoma é a
AUSÊNCIA de dado*.

## O que entrega

1. **A página `tab_triggers_box` sai do Glade e entra um `WebKit2.WebView`.**
   O `GtkScrolledWindow` de fora (`:767`) **sai junto**: a página rola por
   dentro (`.miolo{overflow-y:auto}`), e dois roladores em série é o defeito que
   a `JANELA-CORTADA-01` já pagou uma vez.
2. **Os quatro pinos de versão, na ordem** — `Gtk 3.0`, `Gdk 3.0`,
   `GdkPixbuf 2.0`, `WebKit2 4.1`. Medido em 29/08: com o GTK4 instalado ao
   lado, um `from gi.repository import Gdk` sem pino carrega o 4.0 e mata o
   Gtk 3.0 com `ImportError` (`ver.py:17-19`). O `Gdk` **depois** do `Gtk`.  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
3. **As duas pontes, e elas são 31 linhas UMA VEZ** (medido em 29/08):
   - **pintar** — `view.run_javascript(js)`, e o `js` escreve nos endereços que
     a **02** criou;
   - **ouvir** — `get_user_content_manager().register_script_message_handler()`
     + `connect("script-message-received::<nome>")`.
   **Se o piloto da aba Controles já as tiver entregue, esta sprint é o SEGUNDO
   consumidor e não as reescreve** — duas cópias da ponte é o defeito que a
   `D-AS-ABAS-CONVERSAM` existe para matar.
4. **A carga é verificada pelos DOIS sinais, e `FINISHED` sozinho não vale.**
   Medido em 29/08: **`FINISHED` dispara DEPOIS de `load-failed`** — o WebKit
   commita uma página de erro, e quem escuta só `FINISHED` **reporta sucesso
   sobre carga que falhou**. E `get_title()` no handler de `FINISHED` devolve
   **vazio**: o título chega depois. Quem quiser confirmar a página confirma por
   um valor do DOM, não pelo título.
5. **`select{appearance:none}`** na folha de usuário — são **16** nesta aba
   (117 nas dez). Sem isso os campos saem como caixa BRANCA com texto quase
   invisível: o WebKitGTK relata as cores do autor e desenha o tema do sistema
   (`ver.py:77-90`). **Se a 01 tiver reprovado o popup, esta linha vira a saída  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
   que ela escolheu.**
6. **`install_triggers_tab` sai do arranque** (`app.py:1496`) junto com a
   página, no **mesmo commit**. E o `_signal_handlers` (`app.py:361-364`) perde
   `on_trigger_left/right_apply` e `on_trigger_left/right_reset` — os quatro
   botões que o desenho já não tem.
7. **O mapa da aba continua completo.** `_REFRESH_POR_ABA["tab_triggers_box"]`
   (`app.py:1088`) e `_ALVO_POR_ABA["tab_triggers_box"]` (`app.py:1227`)
   **não somem**: o portão da Z2-9 reprova aba ausente do mapa, e
   `test_toda_pagina_do_notebook_esta_no_mapa_ou_isenta` cobra o outro lado. O
   id da página é o mesmo — quem muda é o widget dentro dele.
8. **A fita fica INERTE nesta aba.** `_ALVO_POR_ABA["tab_triggers_box"]` é `None`
   hoje (fita VIVA); passa a `MOTIVO_ALVO_NAO_SE_APLICA`
   (`app/actions/config/mixin.py:33`), porque **cada coluna é o seu próprio
   alvo** — decisão de 28/08, escrita em `aba03.py:432` (`fita_viva=False`) e na
   dica da própria aba (`aba03.py:334-336`).
   **A ordem importa e é dura:** enquanto os gestos não tiverem o `uniq` da
   coluna (sprint **07**), esmaecer a fita deixa a aba **bonita e muda** —
   `alvo_de_edicao(self)` cai em `DESCONHECIDO` e todo gesto recusa com toast
   (Z2-1/Z2-2). Por isso o item 8 **viaja com a 07 ou não viaja**: esta sprint o
   escreve como comentário `# MIGRA-GATILHOS-07 acende` e deixa a linha como
   está.

## O que esta sprint MEDE, e é o motivo de ela existir

Três números que ninguém tem. Colar no corpo do commit:

| o quê | como | o aditivo (29/08) |
|---|---|---|
| objetos e tempo do `builder` | contar antes e depois | 376 objetos em 56 ms |
| memória | `smem`/PSS, com a janela aberta na aba | 62 → ~285 MiB |
| linhas removidas × nascidas | `git diff --stat` | 73-100 morrem, ~55 nascem, por aba |

**Se o número sair pior que o aditivo, a onda inteira muda de tamanho antes de
seguir** — e quem coordena precisa saber disso antes da 04, não depois da 10.

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_o_enxerto_substitutivo.py`:

1. **A página existe e é UMA** — parse do `main.glade`: `tab_triggers_box`
   continua no `Gtk.Notebook`, na mesma posição da tira, e **nenhum** dos 14
   ids `trigger_*` sobrevive. Devolva um id ao Glade e o teste reprova
   nomeando-o. **Esta é a mordida.**
2. **A janela abre** — instanciar o app sob `Gtk.OffscreenWindow` (sob Xvfb não
   há gerenciador de janelas e uma `Gtk.Window` fica 1x1 para sempre) e
   confirmar que nenhuma exceção sobe. Devolva a chamada de
   `install_triggers_tab` a `app.py:1496` e o teste reprova com o
   `AttributeError` medido acima — **é o controle negativo, e ele já existe**.
3. **Carga que falha é carga que falha** — dublê que emite `load-failed` e
   depois `FINISHED`. A ponte tem de relatar **erro**. Arranque o handler de
   `load-failed` e veja o teste reprovar com "sucesso" sobre uma página de
   erro.
4. **Os quatro pinos** — leitura do fonte: os quatro `gi.require_version` estão
   presentes, e o de `Gdk` vem **depois** do de `Gtk`. Tire o de `Gdk` e
   reprova.
5. **Um rolador só** — o Glade não tem `GtkScrolledWindow` em volta desta
   página.
6. **Os mapas continuam completos** — `tab_triggers_box` está em
   `_REFRESH_POR_ABA` e em `_ALVO_POR_ABA`. Tire de um e o portão da Z2-9
   reprova; é ele que já mede, e esta régua só garante que ninguém o desligue.

## O que é dela decidir

- **Onde o HTML mora no produto instalado.** `novo-layout/` é `.gitignore:108`:
  a página que este `WebView` carrega **não existe** numa árvore de agente nem no
  pacote. É decisão da leva (o piloto da Controles a responde primeiro), e sem
  ela esta sprint não tem o que carregar. Está no índice, não aqui.
- **A memória.** Ela já aceitou 62 → ~285 MiB no aditivo. Se o substitutivo
  medir pior, o número novo volta para a mesa dela — aceitar 4,6× não é aceitar
  o que vier.
