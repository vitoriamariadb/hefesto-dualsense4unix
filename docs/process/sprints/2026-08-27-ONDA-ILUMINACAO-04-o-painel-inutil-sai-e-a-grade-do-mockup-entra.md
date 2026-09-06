---
sprint: ONDA-ILUMINACAO-04
estado: absorvida
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM04:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_ilum_04_a_grade_da_aba_iluminacao.py
bancada: false
depois_de:
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
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
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 04). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA ILUMINAÇÃO · 04 — O painel inútil sai, e a grade do mockup entra

**O defeito, em uma frase:** a metade direita da aba é um painel que ela chamou
de **"absolutamente inútil"** — o daemon já acende o desenho do número sozinho e
o co-op manda por cima.

**Esta é a ÚNICA sprint da onda que salva o `main.glade`.** Regra da casa: XML
único, sem seções nomeadas, conflito de merge irrecuperável — uma sprint por vez.
A ILUM-09 volta ao arquivo depois, e só depois.

## Onde está hoje, medido

A aba inteira: `gui/main.glade:1146-1695`, duas molduras:

| moldura | linhas | destino |
|---|---|---|
| `Lightbar (barra de LED)` | 1175-~1405 | fica, redesenhada |
| `Desenho das 5 luzes` | 1408-~1685 | **sai inteira** (~278 linhas) |

O que sai com ela, nomeado: `player_leds_preset_p1..p4` (`:1518-1545`),
`player_leds_preset_all` (`:1554`), `player_leds_preset_none` (`:1562`),
`player_leds_apply` (`:1579`), os cinco `player_led_1..5` (`:1478-1482`), e os
rótulos `player_leds_note` (`:1642`) e `player_leds_auto_note` (`:1662`).

No código sai junto: `on_player_leds_preset_*`, `on_player_leds_apply`,
`aplicar_desenho_do_jogador` (`lightbar_actions.py:1305-1381`) e
**`on_player_led_toggled` (`:1383`) — handler registrado sem ninguém que o
chame, morto desde 22/07**.

Sai também o defeito **L12**: clicar "Desenho do P2" com a fita em "Todos"
mandava o mesmo desenho para os quatro controles.

## O que entrega

A grade de quatro seções do mockup aprovado
(`layout/04-iluminacao.html:509-733`, e o CSS em
`src/hefesto_dualsense4unix/interface/aba04.py:8-11`):

```
┌──────────────┬──────────────────────┬─────────────────┐
│              │  Cor e brilho        │  Opções         │
│  o DualSense ├──────────────────────┼─────────────────┤
│  desenhado   │  Selecione o player  │  Disposição     │
│  (2 linhas)  │                      │  de LEDs        │
└──────────────┴──────────────────────┴─────────────────┘
```

- o desenho ocupa as **duas** linhas à esquerda (`.desenho{grid-row:1 / span 2}`);
- **"Opções" fica à DIREITA de "Cor e brilho"**, e as outras duas embaixo — é a
  correção literal dela: *"Na real O Opções fica ao lado direito de Cor e brilho
  e abaixo fica os outros dois"*
  (`src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md`, Aba Iluminação);
- **os quatro títulos de seção têm o MESMO estilo** — `Cor e brilho · Opções ·
  Selecione o player · Disposição de LEDs`. Também é correção literal dela;
- **Cor e Brilho na mesma largura**: os dois são a mesma grade de duas colunas
  (`.campo{grid-template-columns:var(--rot) 1fr}`). Palavra dela: *"a Largura do
  Brilho deve ser igual a largura da Cor"*;
- **"as duas tiras acendem juntas, sempre da mesma cor" deixa de existir** como
  texto na tela (correção dela). O fato continua verdadeiro e continua escrito
  onde é do ofício: `assets/control-svg/dualsense.svg:161-164`;
- **Disposição de LEDs** vira o desenho do que acende (as duas tiras + as cinco
  luzinhas no padrão `1 | vão | 3 | vão | 1`), não uma lista de caixas;
- o rótulo `lightbar_estado_no_controle` (`:1274`) **fica** e continua calando
  quando não há nada errado (`lightbar_actions.py:643-681`).

## A mordida

`tests/unit/test_ilum_04_a_grade_da_aba_iluminacao.py`, lendo o `main.glade`
como XML (sem GTK vivo):

- **os que saíram não voltam**: nenhum id de `player_leds_preset_*`,
  `player_leds_apply` ou `player_led_1..5` existe no arquivo. É a régua que
  impede a ressurreição por copiar-e-colar;
- **os que ficam, ficam**: `lightbar_color_button`, `lightbar_brightness_scale`,
  `lightbar_estado_no_controle` e a prévia continuam lá;
- **nenhum handler órfão**: todo `handler=` da aba tem método com o mesmo nome em
  `lightbar_actions.py`, e todo `on_*` público do arquivo é citado no glade —
  **nos dois sentidos**. É essa metade que pega o `on_player_led_toggled`
  sobrevivendo à remoção do painel;
- **a ordem das seções**, medida pela ordem dos filhos na grade: Cor e brilho,
  Opções, Selecione o player, Disposição de LEDs.

Arranque a cura devolvendo um `player_leds_preset_p1` ao XML: o primeiro caso
reprova nomeando o id.

**Prova de tela obrigatória** (PROVA-DE-TELA-01): foto antes e depois. Quem
coordena roda `scripts/gui-captura/retratar_abas.py`; **o agente não roda**.

## O que é dela decidir

1. **Onde ficam os três controles que o contrato preserva e o mockup não
   desenha?** Medido: o mockup aprovado tem em "Opções" **dois** botões
   (`Voltar ao automático`, `Desligar`) e não mostra o **"Reenviar ao
   controle"**, nem a caixa **"Cores automáticas por controle"**, nem a linha de
   **de onde veio a cor**. Os três estão no "Nada se perdeu" do contrato. É a
   maior pergunta aberta desta onda, e é dela.
2. **A altura da caixa** com o painel fora: a aba fica com metade do conteúdo de
   hoje. A moldura acompanha, ou o desenho cresce?

## Fontes

- correções literais: `src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md`, Aba Iluminação
  — *"— FEITA"*;
- mockup: `layout/04-iluminacao.html`, gerador `src/hefesto_dualsense4unix/interface/aba04.py`;
- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4.
