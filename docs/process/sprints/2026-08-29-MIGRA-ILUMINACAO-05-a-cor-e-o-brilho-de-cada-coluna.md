---
sprint: MIGRA-ILUMINACAO-05
estado: absorvida
onda: MIGRA-ILUMINACAO
posse:
  IL5:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_migra_iluminacao_05_a_cor_e_o_brilho_por_coluna.py
bancada: false
depois_de:
  - LEVA-1
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - ONDA-ILUMINACAO-07
  - ONDA-ILUMINACAO-08
  - ONDA-ILUMINACAO-09
  # A FILA INTEIRA que vem antes desta, e ela é longa de propósito: nove das doze
  # abrem `app/actions/lightbar_actions.py` e cinco abrem `src/hefesto_dualsense4unix/interface/aba04.py`.
  # Quem divide arquivo executa EM SÉRIE (R5), e o portão de colisão não faz fecho
  # transitivo — por isso a fila se escreve inteira, como na ONDA-SISTEMA-02.
  - MIGRA-ILUMINACAO-01
  - MIGRA-ILUMINACAO-03
  - MIGRA-ILUMINACAO-11
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-04
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 04). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA ILUMINAÇÃO · 05 — A cor e o brilho de cada coluna saem do rascunho

**Passar de uma coluna para N é um LAÇO, não um caminho novo.** A leitura por MAC
já existe inteira: `draft.effective_leds_for(uniq)` aceita qualquer `uniq`.

## O defeito

`_refresh_lightbar_from_draft` (`app/actions/lightbar_actions.py:561-640`) lê
**um alvo só** — `draft.effective_leds_for(self._edit_uniq().uniq)` (`:577`) — e
pinta widgets GTK que a `MIGRA-ILUMINACAO-02` apaga.

Na tela nova cada coluna tem dois valores contínuos, e cada um pinta **mais de
um lugar**:

| valor | quantos lugares | quais |
|---|---|---|
| a cor efetiva | **quatro** | o `--luz` do `<g id="{pref}-lightbar">` no SVG (`monta.py:483`), o `.hex`, qual dos oito `.tom` fica `on`, e as duas `.tira-luz` |
| o brilho | **três** | o número em %, a largura do `.cheio` (`aba04.py:320`), e a `opacity` das duas tiras (`aba04.py:327-329`) |

Pintar um e esquecer o outro deixa a tela com **duas verdades no mesmo quadro** —
e o desenho é o que ela olha.

## O que entrega

1. **`_refresh_lightbar_from_draft` vira um laço** sobre `_uniqs_conectados()`
   (`:378`). Cada volta lê `draft.effective_leds_for(uniq)` e pinta **uma
   coluna**, endereçada pelo `data-uniq` da `MIGRA-ILUMINACAO-03`.
2. **A leitura não se reescreve.** `effective_leds_for` já resolve o override
   por controle sobre a seção global; `_auto_preview_slot` (`:415`) já sabe
   quando a cor a mostrar é a AUTOMÁTICA do número. O que muda é o escopo.
3. **Os sete lugares mudam na MESMA chamada de `run_javascript`.** Uma coluna
   inteira por ida, nunca sete idas.
4. **A frase da tela continua "ENVIADA", nunca "aplicada".** Está escrito no
   próprio módulo, `:37-60`: por Bluetooth, depois que o daemon adota o controle,
   o firmware perde o claim e passa a **aceitar e ignorar** as escritas de cor —
   **330 mil escritas ignoradas com a barra apagada**, e ela passou dias
   acreditando que a cor tinha ido porque a janela dizia que sim
   (LIGHTBAR-BT-RESET-01). A única leitura de volta que existe
   (`multi_intensity`) é **o eco do nosso pedido, não a lâmpada**.

   **E aqui isso fica pior, não melhor:** numa grade de N desenhos pintados,
   **o desenho vira a afirmação**. Ninguém lê o rótulo quando a barra do
   controle está colorida na tela.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_05_a_cor_e_o_brilho_por_coluna.py`:

- **quatro rascunhos, quatro colunas.** Monte um draft com quatro
  `lightbar_rgb` distintos e quatro `lightbar_brightness` distintos. Rode o
  refresh e leia do DOM os quatro `data-campo="cor-hex"` e os quatro
  `brilho-num`. **Volte `self._edit_uniq()` no lugar do laço e as quatro ficam
  iguais** — o teste reprova. Devolva.
- **os quatro lugares da cor, um por um.** A mesma cor tem de aparecer no
  `--luz` do SVG, no `.hex`, no `.tom.on` e nas duas tiras. **Arranque UM dos
  quatro da cura e veja reprovar.** Se não reprovar, a régua mede um lugar só —
  e é exatamente esse o defeito da régua nº 3 das seis falsas de 29/08: o bug
  **não apaga a cor, muda de lugar**.
- **os três lugares do brilho.** Idem para o número, o `.cheio` e a `opacity`.
- **a régua LÊ, não digita.** Os hexas esperados saem do próprio draft
  (`effective_leds_for`), nunca escritos à mão no teste. Foi a forma das ONZE
  réguas que em 26/08 reprovaram a melhora em vez do defeito — todas *digitavam
  o que deviam LER*.
- **um instante não é comportamento.** Rode o refresh **duas vezes**, com o
  draft mudando entre as duas, e confira as duas. A lição das seis réguas falsas
  de 29/08: *uma régua que roda o tique UMA VEZ mede um instante* — foi assim
  que uma regressão de 181 segundos passou com 67 testes verdes.
- **nenhuma frase promete aplicação.** `grep` nas frases desta aba por
  "aplicada" / "aplicado" no controle → zero. Troque uma e veja reprovar.

## O que é dela decidir

**O rótulo "Brilho".** `docs/data/mapa-controles.csv`, linha
`luz.lightbar.brilho@dualsense`: **`cabo_aciona = não`, `radio_aciona = não`**.
A célula literal: *"O brilho que o produto oferece (`led.set {brightness}`) é
MULTIPLICAÇÃO de RGB em Python, outra grandeza. Nada no caminho toca
`common[42]`."*

E a ressalva do mapa é exatamente o defeito que esta tela pode criar: *"Quem lê a
doc e a tela pode concluir que são o mesmo controle. Não são."*

**N trilhos de brilho lado a lado, com número em %, é a superfície mais
convidativa que esta janela já teve para essa confusão.** A palavra dela decide
se o rótulo continua "Brilho", ou se vira o que a grandeza é.

`scripts/check_paridade_transporte.py` reprova afirmação forte sem teste que a
sustente — e é portão, não documentação.
