---
sprint: ONDA-ILUMINACAO-02
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM02:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
    - install.sh
cria:
  - src/hefesto_dualsense4unix/gui/widgets/desenho_do_controle.py
  - tests/unit/test_ilum_02_o_controle_desenhado.py
bancada: false
depois_de:
  - ONDA-ILUMINACAO-01
  # SÉRIE, por R5: esta sprint divide install.sh
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-01
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - MOTOR-DO-ARRANJO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - assets/control-svg/dualsense.svg
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
---

# ONDA ILUMINAÇÃO · 02 — O controle desenhado no lugar do retângulo

**O defeito, em uma frase:** o desenho do DualSense com as 32 peças nomeadas
está no repositório desde 11/08 e **nenhuma linha da janela nunca o abriu** — a
prévia da cor continua sendo um retângulo pintado à mão.

É o defeito mais caro desta casa: **A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ**.

## Onde está hoje, medido

- o arquivo: `assets/control-svg/dualsense.svg`, com `data-colorway` para as
  cinco cores de fábrica (`:54-58`), o grupo `lightbar` com as duas tiras
  (`:165`) e as cinco lâmpadas `led-jogador-1..5` (`:194-198`);
- **consumidores em `src/`: zero.** `grep -rn 'control-svg' --include='*.py' src`
  não devolve nada; os únicos usos são `scripts/gerar-mapa.py:91` e
  `scripts/migrar-mapa-v2.py:90`, que geram o `specs.html`;
- a prévia de hoje: `GtkDrawingArea` `lightbar_preview` (`gui/main.glade:1247`),
  pintada por `_on_lightbar_preview_draw` (`lightbar_actions.py:1576`);
- **o SVG não é instalado.** `install.sh:3053-3054` copia `assets/glyphs` para
  `~/.local/share/hefesto-dualsense4unix/glyphs`; `assets/control-svg` **não
  aparece uma vez sequer** no `install.sh`. Um widget que leia só do repositório
  nasce em branco na máquina dela.

## O que entrega

Um widget novo, `gui/widgets/desenho_do_controle.py`, que a prévia usa:

1. **Renderiza o SVG** pela mesma técnica já provada em
   `gui/widgets/button_glyph.py:149-170`: substituição no TEXTO do SVG +
   `GdkPixbuf.PixbufLoader` com `set_size`, e **cache por
   `(colorway, cor_da_luz, numero, tamanho)`** — repintar não recarrega arquivo.
2. **A borda é a cor do plástico**: o `data-colorway` do `<svg>` sai da leitura
   de `integrations/cor_do_plastico`, passada por `tom_para_a_borda` (que já
   resolve o Midnight Black sumindo no fundo escuro). Sem leitura, o corpo fica
   no neutro de fábrica `#3a3f4b` — **"Não sei" não vira cor inventada**.
3. **A barra de luz acende na cor escolhida**: as duas `rect` do grupo
   `lightbar` recebem `fill` com o RGB atual da aba, escalado pelo brilho.
4. **As cinco luzinhas mostram o número**: `player_led_pattern(numero)`
   (`core/led_control.py:122`) acende `led-jogador-N`.
5. **A linha embaixo do desenho**, como no mockup: `Sony • Player 1 • Cosmic Red
   • USB` (`layout/04-iluminacao.html:663`).
6. **O caminho de instalação**: `install.sh` passa a copiar `assets/control-svg`
   para `~/.local/share/hefesto-dualsense4unix/control-svg`, e o widget resolve
   na mesma ordem de preferência do `button_glyph.py:9-14` (local do usuário →
   `sys.prefix` → `/usr/share` → árvore do repositório). **Sem flag, sem passo à
   mão** (regra da casa: toda cura entra no install).

## A mordida

`tests/unit/test_ilum_02_o_controle_desenhado.py` — sem GTK vivo, medindo o
**texto do SVG** que o widget produz (a função de composição é pura e separada
do widget de propósito, para poder ser medida):

- com colorway `cosmic-red`, o `<svg>` sai com `data-colorway="cosmic-red"`;
  **sem** leitura de cor, sai sem o atributo e com o corpo neutro;
- com a cor `(255, 45, 111)` e brilho 82%, as **duas** `rect` do grupo
  `lightbar` saem preenchidas com o mesmo hexa — nunca uma só;
- com o número 3, saem acesas exatamente `led-jogador-2,3,4`
  (`player_led_pattern(3)`), e nenhuma outra;
- **o caminho do arquivo**: com o diretório do usuário populado e o do
  repositório também, vence o do usuário; com nenhum dos dois, o widget devolve
  `None` e a aba não quebra (`DIAGNÓSTICO-NÃO-DERRUBA-A-ABA-01`).

Arranque a cura de cada item e veja reprovar. O do brilho é o que mais engana:
arrancado, o teste ainda passa se a régua só contar `fill=` — por isso ela
compara **o hexa**, não a presença do atributo.

Portão do install: um teste que lê `install.sh` e exige a cópia de
`assets/control-svg` — a mesma forma do que já cobre os glifos.

## O que é dela decidir

1. **O desenho vem junto ou separado da leitura do plástico?** Quando o rádio
   recusa a leitura (o caso comum no Bluetooth), o controle aparece neutro. Vale
   desenhar neutro, ou é melhor não desenhar nada até saber a cor?
2. **Tamanho**: o mockup dá `max-width: 212px`
   (`layout/_ferramentas/aba04.py`, `.previa .ds-svg`). Confirmar na tela.

## Fontes

- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4 — "A
  prévia deixa de ser um retângulo e passa a ser o controle desenhado";
- mockup: `layout/04-iluminacao.html:510-665`;
- decisões: **D-A-BORDA-E-A-IDENTIDADE-DA-PECA**, **D-CADA-JOGADOR-NAVEGA-COM-O-SEU**.
