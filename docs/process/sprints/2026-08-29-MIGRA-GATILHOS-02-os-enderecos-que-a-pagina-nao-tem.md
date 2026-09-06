---
sprint: MIGRA-GATILHOS-02
estado: absorvida
onda: MIGRA-GATILHOS
posse:
  M2:
    - src/hefesto_dualsense4unix/interface/aba03.py
cria:
  - tests/unit/test_migra_gatilhos_a_pagina_tem_endereco.py
bancada: false
depois_de:
  - MIGRA-GATILHOS-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/topo.html
  - src/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 03). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA GATILHOS · 02 — os endereços que a página não tem

**O defeito em uma frase:** no motor novo o Python **não constrói widget — ele
pinta valores por `run_javascript`**, e para alcançar um valor ele precisa de um
endereço. A página aprovada não tem **nenhum**.

## A medição

`layout/03-gatilhos.html`, contado em 29/08:

```
id=      3   — e os três são gradientes do SVG da logo (flameIn, flameOut, ring)
data-*   0
```

Nenhum elemento que a aba precisa alcançar tem nome. São **17 famílias de valor**
e **38 gestos** sem endereço:

| o que | quantos na cena | como se alcança hoje |
|---|---|---|
| `select.modo` | 8 (4 controles × 2 lados) | por posição no DOM |
| `select.pronto` | 8 | idem |
| `.barra` (rótulo + trilho + número) | 18 nesta cena, **até 22 por coluna** viva | idem |
| `button` "Guardar esse efeito" | 4 | idem |
| `.chip.plastico` (a identidade da coluna) | 4 | idem |
| `.ajustes-vazio` ("Este modo não tem o que ajustar.") | 1 | idem |

18 + 8 + 8 + 4 = **38 gestos**. "Por posição no DOM" é endereço até alguém trocar
a ordem de duas linhas do gerador — e aí a pintura escreve no controle errado,
**em silêncio**. É a mesma forma do defeito de `monta.py:522-527`, medido em
28/08: a troca da fita procurava um TEXTO, o texto mudou, e as seis abas ficaram
com o destaque errado sem ninguém ver, com a régua verde.

## O que entrega

Endereço para tudo, escrito **no gerador** (`aba03.py`) e nunca à mão no HTML —
o HTML é saída, e editar saída é como as duas versões divergem.

O esquema, e ele é uma escolha de contrato, não de estilo:

```
.ctrl[data-uniq]                         a coluna inteira; `uniq` é o MAC do controle
  .chip[data-papel="identidade"]         P#, nome do plástico, transporte
  select[data-papel="modo"][data-lado="e|d"]
  select[data-papel="pronto"][data-lado="e|d"]
  .ajustes[data-lado="e|d"]
    .barra[data-param="start|force|pos_3|…"]   o `name` do TriggerParamSpec
      .trilho .cheio                     a % derivada
      .num                               o valor
  button[data-papel="guardar"]
```

**Três regras que o esquema carrega, e cada uma nasceu de um defeito desta casa:**

1. **`data-param` é o `name` do `TriggerParamSpec`, não o rótulo.** O `name` é
   contrato — está no perfil no disco, no IPC e no DSX
   (`trigger_specs.py:82-88`); o `label` é texto de tela e já mudou por decisão
   dela em 07/08. Endereçar pelo rótulo faz a pintura quebrar quando ela renomear
   um campo.
2. **`data-lado` é `e`/`d` e o Python traduz para `left`/`right`.** A página é o
   desenho dela e fala a língua dela; o `side` do IPC é inglês e é contrato. O
   tradutor tem **um dono só**, do lado do Python, e não dois vocabulários
   viajando pela ponte.
3. **`data-uniq` vazio na cena estática.** O mockup não tem MAC de verdade — e
   **não pode ter**: `AA:BB:CC:DD:EE:FF` num arquivo é o que os dois portões de
   anonimato existem para reprovar. Na cena o atributo sai como
   `data-uniq=""`; quem o preenche é a **04**, com o `uniq` que o daemon
   publica.

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_a_pagina_tem_endereco.py`:

1. **A FOTO NÃO MUDA — esta é a mordida principal.** Gere `03-gatilhos.html`
   antes e depois, fotografe as duas com `src/hefesto_dualsense4unix/interface/olhar.py` e
   compare **pixel a pixel**. Atributo não pinta; se um pixel mudou, o gerador
   mudou mais do que devia. Arranque a cura invertendo uma linha de CSS junto e
   veja a régua reprovar — sem isso ela não está medindo nada.
   **A armadilha, medida em 27/08:** o `scrollIntoViewIfNeeded` do Playwright
   **rola antes de medir** e cega toda medição de layout feita depois. Esta
   régua fotografa a página inteira, sem hover e sem rolagem programática.
2. **Todo gesto tem endereço** — parse do HTML: 16 `select` com
   `data-papel` e `data-lado`, 4 `button[data-papel=guardar]`, 4
   `.ctrl[data-uniq]`, e **toda** `.barra` com `data-param`. Apague um
   `data-param` do gerador e o teste reprova nomeando qual.
3. **`data-param` casa com o produto** — para cada `.barra` da cena, o
   `data-param` está em `[p.name for p in get_spec(modo).params]`. É a mesma
   régua que `aba03.barras()` já aplica aos rótulos (`:202-206`), estendida ao
   endereço. Troque `pos_3` por `posicao_3` e ela reprova.
4. **Zero MAC na página** — `scripts/check_endereco_de_radio.py` roda sobre o
   HTML gerado e não acha nada. Ponha um endereço de verdade no
   `data-uniq` e veja reprovar. (O portão pega por FORMA, sem consultar OUI —
   é por isso que ele alcança o que o outro não pode.)
5. **Os endereços são únicos** — `(data-uniq, data-lado, data-papel)` não
   repete, e `(data-uniq, data-lado, data-param)` não repete. Duplique uma
   coluna no gerador e a régua reprova.

## O que é dela decidir

Nada de tela — **esta sprint não move um pixel, e a régua 1 é a prova disso.**

## O buraco que esta sprint declara e não fecha

**`novo-layout/` é `.gitignore:108`** (conferido:
`git check-ignore -v src/hefesto_dualsense4unix/interface/aba03.py` → reprova). Logo:

- o gerador e a página **não viajam** em `git worktree add`;
- **não entram no pacote**: o `install.sh` copia `assets/glyphs` (`:3103`) e
  mais nada de desenho;
- duas levas editando este arquivo em árvores diferentes **divergem sem
  conflito de merge**, porque o git não vê nenhuma das duas.

**Onde o HTML passa a morar quando ele vira produto é decisão da leva, não
desta onda** — o candidato nomeado é `src/hefesto_dualsense4unix/gui/telas/`, e
quem responde primeiro é o **piloto da aba Controles**, que precisa carregar um
arquivo antes desta onda existir. Esta sprint escreve no gerador **onde ele
está hoje**; a mudança de endereço do arquivo é um `git mv` de quem coordena, e
está no índice.
