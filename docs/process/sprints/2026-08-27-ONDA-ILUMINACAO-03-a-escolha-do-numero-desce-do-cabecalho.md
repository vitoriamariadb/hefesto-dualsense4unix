---
sprint: ONDA-ILUMINACAO-03
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM03:
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - src/hefesto_dualsense4unix/app/actions/iluminacao_secao_do_player.py
  - tests/unit/test_ilum_03_a_secao_do_player.py
bancada: false
depois_de:
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/status_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-06
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
---

# ONDA ILUMINAÇÃO · 03 — A escolha do número desce do cabeçalho

**O defeito, em uma frase:** o lugar de trocar o número do controle é uma faixa
que **brota** no cabeçalho e empurra a tira de abas para baixo — palavra dela:
*"vamos evitar o problema do layout que fica super feio ao se deslocar pra
baixo"*.

## Onde está hoje, medido

- a faixa é criada em código, não no glade: `_montar_numero_selector`
  (`app/actions/status_actions.py:1902`), com `faixa.set_no_show_all(True)` e
  `faixa.hide()` (`:1935-1936`) e `header_bar.pack_end` (`:1937`);
- ela só aparece **com um controle escolhido E dois ou mais na mesa** —
  `_refresh_numero_selector` (`:1960`), `if not uniq or total < 2: … hide()`;
- os botões: `_rebuild_numero_buttons` (`:1940`), `Gtk.RadioButton` em modo
  segmentado — **botões, nunca dropdown**, porque o cosmic-comp fecha popup de
  combo em 40-95% dos cliques (o comentário do próprio arquivo, `:1904-1908`);
- **o backend já existe e já funciona**: `_on_numero_button_toggled` (`:2003`)
  chama `ipc_bridge.identity_number_set` (`app/ipc_bridge.py:712`), que fala com
  `identity.number.set` no daemon (`daemon/ipc_server.py:179`,
  `daemon/ipc_handlers.py:1590+`). **Nada de daemon precisa ser escrito.**
- a frase do desenho aceso, que passa a morar aqui: `texto_do_desenho_aceso`
  (`lightbar_actions.py:303`), hoje escrita no rótulo `player_leds_estado`.

## O que entrega

Um módulo novo, `app/actions/iluminacao_secao_do_player.py`, que monta a seção
**"Selecione o player"** da aba Iluminação:

1. **Os botões 1..N com espaço fixo**, sempre visíveis — nada some, nada brota.
   Com um controle só na mesa, o botão do 1 aparece marcado e desabilitado, em
   vez de a seção inteira desaparecer.
2. **A mesma ação de hoje**: `identity_number_set`, com os mesmos motivos de
   recusa já traduzidos em `ipc_bridge.py:694`, e a mesma disciplina de não
   pintar o número novo antes de o daemon confirmar (`status_actions.py:2016-2024`
   explica por quê: é como se cria a terceira verdade).
3. **A linha que conta o desfecho**, embaixo dos botões: *"as luzinhas mostram o
   número 1 — por sua escolha"* / *"pelo co-op"* / *"automático"*, vinda de
   `texto_do_desenho_aceso`. É a única linha que conta quando o co-op
   sobrescreveu.
4. **A faixa do cabeçalho sai**: `_montar_numero_selector` e
   `_refresh_numero_selector` deixam de pendurar coisa na `header_bar`. O que
   fica no topo é a fita e o crachá — **D-A-FITA-E-O-UNICO-ALVO**.

## A mordida

`tests/unit/test_ilum_03_a_secao_do_player.py`:

- **a régua do layout**: um dublê de `header_bar` que **registra o que recebe**;
  depois da montagem da janela, ele não recebeu nenhum widget de número. Arranque
  a cura e o dublê acusa o `pack_end` de volta;
- **espaço fixo**: com `total = 1` a seção continua existindo e o botão do 1 está
  presente (hoje a faixa some inteira); com `total = 4`, quatro botões;
- **a ação**: clicar no 3 chama `identity_number_set(uniq, 3)` **uma vez** — e o
  eco do tique de 2 Hz (marcação programática) **não** dispara nada; é o defeito
  que o `_numero_updating` já cura no cabeçalho e que a mudança de casa pode
  perder no caminho;
- **a recusa**: com alvo `desconhecido`, zero IPC e o texto de recusa na tela; o
  dublê do IPC sabe dizer não, e o teste exerce as duas respostas.

## O que é dela decidir

1. **Quantos números a seção mostra?** O cabeçalho hoje oferece 1..4, o card da
   aba Conexões oferece 1..5, o produto cobre 1..8
   (`core/led_control.py:122` e `:146`). O mockup desenha **quatro**
   (`layout/04-iluminacao.html:717-718`). *Escrever o provisório em 1..4,
   marcado como `PROVISÓRIO — decisão dela`.*
2. **O número continua também no card da aba Conexões?** As duas telas passam a
   mostrar o mesmo fato, e a regra dela é que fato repetido fica em sincronia
   (**D-AS-ABAS-CONVERSAM**). Fica nas duas, ou só aqui?

## Fontes

- decisão: **D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR** — a palavra dela está lá,
  inteira;
- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4;
- mockup: `layout/04-iluminacao.html:703-720`.
