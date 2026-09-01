---
sprint: MIGRA-ILUMINACAO-03
onda: MIGRA-ILUMINACAO
posse:
  IL3:
    - layout/_ferramentas/aba04.py
    - scripts/telas/aba04.py   # o mesmo arquivo depois da MIGRA-CONTROLES-02
cria:
  - tests/unit/test_migra_iluminacao_03_todo_valor_tem_endereco.py
bancada: false
depois_de:
  # A MIGRA-CONTROLES-02 muda a página e o gerador de casa:
  # `layout/_ferramentas/aba04.py` muda de casa (o novo caminho está na
  # posse acima, sem crase: ele ainda não existe nesta árvore), e
  # `layout/04-iluminacao.html` vira
  # `src/hefesto_dualsense4unix/gui/telas/04-iluminacao.html`. Dar endereço antes
  # da mudança de casa é dar endereço duas vezes.
  - MIGRA-CONTROLES-02
  - MIGRA-ILUMINACAO-01
nao_toca:
  - src/
  - src/hefesto_dualsense4unix/gui/main.glade
---

# MIGRA ILUMINAÇÃO · 03 — Cada valor ganha endereço

**Sem endereço, o Python não alcança valor nenhum.** Esta é a sprint mais barata
da onda e destrava cinco outras.

## O defeito

O mockup não tem **um único endereço nos valores**. Medido em
`layout/04-iluminacao.html`:

| atributo | quantos | de quem é |
|---|---|---|
| `data-colorway` | 40 | do desenho do controle |
| `data-entrada` | 76 | do desenho |
| `data-feature` | 52 | do desenho |
| `data-controle` / `data-modelo` | 4 + 4 | do desenho |
| `data-clique` | 8 | do desenho (L3/R3) |
| **de um valor da aba** | **0** | — |

O `.hex`, o `.trilho`, o `.num`, os oito `.tom`, o `<input type="color">`, os
botões de número, os dois botões de Opções, as duas `.tira-luz`, o `.ctrl-rot` e
a `.moldura` **não têm nome**. O Python só os alcançaria **por posição no DOM** —
e posição muda quando a mesa muda, que é exatamente o que a
`MIGRA-ILUMINACAO-04` vai fazer.

## O que entrega

Mudança no gerador da aba. **Nenhum pixel muda** — atributo não pinta. Mas é
mudança no desenho aprovado, e por isso está declarada.

**Atenção ao endereço:** hoje o gerador é `layout/_ferramentas/aba04.py` e a
página é `layout/04-iluminacao.html`. A `MIGRA-CONTROLES-02` os muda de casa
para `scripts/telas/aba04.py` e <!-- ref-externa: nasce com a MIGRA-CONTROLES-02 -->
`src/hefesto_dualsense4unix/gui/telas/04-iluminacao.html` — **e é ela que resolve
o buraco de `novo-layout/` ser `.gitignore:108`**. Esta sprint corre **depois** da
mudança, e por isso a posse declara os **dois** endereços. Os números de linha
citados abaixo são do arquivo de hoje: **reconfira-os no dia da execução.**

1. **Cada coluna se identifica:** `<div class="ctrl" data-uniq="…"
   data-pos="…">`. O `uniq` é o MAC do controle daquela coluna — é ele que a
   `MIGRA-ILUMINACAO-07` põe em cada gesto.
2. **Cada valor ganha `data-campo`.** São **oito por coluna** (o nono valor da
   coluna é a PRESENÇA dela, que não precisa de endereço próprio: ela é o
   `<div data-uniq>`):

   | `data-campo` | o que pinta | onde está hoje |
   |---|---|---|
   | `moldura` | a borda no plástico (`--plastico`) | `aba04.py:307` |
   | `desenho` | o SVG — a barra (`--luz`) e as cinco lâmpadas | `aba04.py:308` |
   | `rotulo` | `P{n} • {nome} • {via}` | `aba04.py:310` |
   | `cor-guia` | qual dos oito `.tom` fica `on` | `aba04.py:301-305` |
   | `cor-hex` | o código da cor | `aba04.py:317` |
   | `brilho-trilho` | a largura do `.cheio` | `aba04.py:320` |
   | `brilho-num` | o número em % | `aba04.py:321` |
   | `aceso` | as duas `.tira-luz` e as cinco luzinhas | `aba04.py:326-330` |

3. **Os dois valores globais** ganham endereço fora das colunas: os oito tons da
   guia (canônicos, de `core/led_control.py:158`) e a contagem da mesa que as
   três dicas citam.
4. **Cada gesto ganha `data-gesto` e o dado que ele carrega:**
   `tom` + `data-rgb`, `livre`, `brilho`, `numero` + `data-numero`,
   `automatico`, `desligar`. São os **seis tipos** que já têm handler vivo —
   nenhum é feature nova.
5. **O gerador RECUSA o desenho incompleto.** Um valor de coluna sem
   `data-campo`, ou um `data-uniq` repetido, **para a geração** com a mensagem
   dizendo qual. É a mesma disciplina que `monta.py` já aplica em `troca()`
   (`:485`) e em `nome_do_glifo()` (`:100`), e pela mesma razão: `str.replace`
   que não casa devolve o texto intacto **e não avisa**.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_03_todo_valor_tem_endereco.py`:

- **a foto não muda, e é a mordida principal.** Retrate a aba antes e depois,
  **no mesmo motor**, e compare pixel a pixel. Um pixel de diferença é defeito:
  atributo não pinta. E a régua **declara qual motor está usando** — WebKitGTK
  ou Chrome, nunca "o navegador". Medir contra a biblioteca errada produz alarme
  convincente e falso.
- **o endereço alcança.** No `WebView`, `document.querySelectorAll('[data-campo]')`
  devolve `8 × N + 2` com uma mesa de N. Os `data-uniq` são todos distintos.
  Arranque um `data-campo` do gerador e o teste reprova.
- **o gerador PARA quando falta endereço.** Apague um `data-campo` do molde e
  rode o gerador: ele tem de sair com `SystemExit` e o nome do campo. **Se ele
  gerar em silêncio, a régua não morde** — foi assim que `svg(jogador=N)` nunca
  acendeu uma lâmpada em aba nenhuma, em TODAS as abas, até 27/08.
- **os seis gestos estão todos endereçados.** `[data-gesto]` cobre os 64 gestos
  da mesa de quatro (32 tons + 4 livres + 4 trilhos + 16 números + 4 automáticos
  + 4 desligar). Some um `data-gesto` e o teste reprova.
- **nenhuma medição rola antes.** A comparação de layout **não** usa
  `scrollIntoViewIfNeeded` do Playwright: ele **rola antes de medir** e cega
  toda medição feita depois — foi assim que um portão deu verde sobre uma linha
  fora da caixa (27/08).

## O que é dela decidir

Nada — nenhum pixel muda. **Mas é mudança no arquivo que ela aprovou**, e o
mockup mora numa pasta que o git não vê (`novo-layout/` é `.gitignore:108`):
duas levas editando o mesmo arquivo em árvores diferentes **divergem sem
conflito de merge**, porque o git não vê nenhuma das duas. **O mockup é recurso
de bancada: uma sprint por vez**, serializada à mão por quem coordena.
