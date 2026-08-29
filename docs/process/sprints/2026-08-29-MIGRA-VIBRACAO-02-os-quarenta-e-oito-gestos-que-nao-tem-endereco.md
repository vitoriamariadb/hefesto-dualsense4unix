---
sprint: MIGRA-VIBRACAO-02
onda: MIGRA-VIBRACAO
posse:
  MV2:
    - novo-layout/_ferramentas/aba05.py
cria:
  - tests/unit/test_migra_vibracao_02_a_pagina_tem_endereco.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  # O VOCABULÁRIO DOS ENDEREÇOS tem UM dono, e ele nasceu na onda Gatilhos
  # (`data-papel`, `data-lado`, `data-uniq`). Esta sprint HERDA aquele esquema
  # em vez de inventar um segundo — dois vocabulários viajando pela mesma ponte
  # é a segunda verdade que esta casa paga caro.
  - MIGRA-GATILHOS-02
nao_toca:
  - novo-layout/_ferramentas/monta.py
  - novo-layout/_ferramentas/topo.html
  - src/
  - install.sh
  - pyproject.toml
---

# MIGRA VIBRAÇÃO · 02 — os quarenta e oito gestos que não têm endereço

**O defeito em uma frase:** no motor novo o Python **não constrói widget — ele
pinta valores por `run_javascript`**, e para alcançar um valor ele precisa de um
endereço. A página aprovada tem **zero**.

## A medição, feita hoje sobre `novo-layout/05-vibracao.html`

```
id=          255   — e TODOS são do desenho: `vb-p1-*`…`vb-p4-*` (o SVG do
                     controle) mais os 3 gradientes da logo (flameIn, flameOut, ring)
data-*             — só os do desenho: data-entrada (76), data-feature (48),
                     data-colorway (40), data-clique (8), data-controle (4),
                     data-modelo (4), data-posicao (4)
```

**Nenhum elemento da ABA tem nome.** São **50 valores** na tela e **48 gestos**
(4 colunas × 12: quatro degraus de força, a barra de força, dois interruptores
de lado, duas barras de motor, Testar, Parar).

E o casamento de hoje é **posicional**. O adaptador que a prova de 29/08 rodou
— o `ponte_da_aba_rumble.py` do scratchpad <!-- ref-externa: instrumento não commitado --> — casa por classe e por índice:

```js
document.querySelectorAll('.seg').forEach(s =>
  s.querySelectorAll('button').forEach((b, j) => …POLITICAS[j]…));
document.querySelectorAll('.motor .cheio').forEach(c => c.style.width = …);
```

`POLITICAS = ("economia","balanceado","max","auto")` — **a ordem dos quatro
botões dentro de `.seg` é o contrato**. Trocar duas linhas no gerador faz a
pintura escrever no lugar errado, **em silêncio**, e portão nenhum de hoje
enxerga isso. É a mesma forma do defeito de `monta.py:522-527` medido em 28/08:
a troca da fita procurava um TEXTO, o texto mudou, e seis abas ficaram com o
destaque errado sem ninguém ver, com a régua verde.

## O que entrega

Endereço para tudo, escrito **no gerador** (`aba05.py`) e nunca à mão no HTML —
o HTML é saída, e editar saída é como as duas versões divergem.

O esquema, herdado do vocabulário da `MIGRA-GATILHOS-02`:

```
.ctrl[data-uniq]                                a coluna; `uniq` é o MAC (vazio na cena)
  .moldura[data-papel="desenho"]
    [id$="-feat-rumble-esquerdo"] / [-direito]  JÁ EXISTEM, e vêm do mapa
  .rot-ctrl[data-papel="identidade"]            P# • plástico • transporte
  .seg button[data-papel="forca"][data-forca="economia|balanceado|max|auto"]
  .motor[data-papel="forca"]      .cheio | .num
  .motor[data-papel="motor"][data-lado="e|d"]
      button.lado[data-papel="lado"]
      .cheio | .num
  button[data-papel="testar"]
  button[data-papel="parar"]
```

**Três regras, e cada uma nasceu de um defeito desta casa:**

1. **`data-forca` é o valor do esquema, não o rótulo.** "Máximo" é texto de
   tela; `max` é contrato — está no perfil no disco
   (`profiles/schema.py:336`), no IPC (`rumble.policy_set`) e no
   `RUMBLE_POLICY_MULT` (`daemon/subsystems/rumble.py:82`). Endereçar pelo
   rótulo faz a pintura quebrar no dia em que ela renomear um degrau.
2. **`data-lado` é `e`/`d`, e o tradutor tem UM dono, do lado do Python.** A
   página é o desenho dela e fala a língua dela; `weak`/`strong` é contrato de
   código. E o par é o **medido**: `e` → `strong` → `common[3]`; `d` → `weak` →
   `common[2]` (canônica `docs/protocol/dualsense-referencia-canonica.md:303-315`).
   **Escrever `weak`/`strong` no HTML seria a segunda verdade** — é a inversão
   que este assunto convida, e a régua que a impede mora na **06**.
3. **`data-uniq=""` na cena estática.** O mockup não tem MAC de verdade e **não
   pode ter**: `AA:BB:CC:DD:EE:FF` num arquivo versionado é o que os dois
   portões de anonimato existem para reprovar. Quem preenche é a **03**, com o
   `uniq` que o daemon publica.

**E os ids do desenho não se redigitam.** `feat-rumble-esquerdo` e
`feat-rumble-direito` já saem de `docs/data/pecas-do-dualsense.csv`
(`aba05.py:33-50`), com um `SystemExit` que reprova a geração se o mapa deixar
de ter exatamente duas peças de vibração. A **07** pinta por esses ids, não por
outros.

## Como se prova (a mordida)

`tests/unit/test_migra_vibracao_02_a_pagina_tem_endereco.py`

1. **A FOTO NÃO MUDA — esta é a mordida principal.** Gere `05-vibracao.html`
   antes e depois, fotografe as duas com `novo-layout/_ferramentas/olhar.py` e
   compare **pixel a pixel**. Atributo não pinta; se um pixel mudou, o gerador
   mudou mais do que devia — e esta aba está **FECHADA por elogio literal dela**
   (`CORRECOES-DELA.md:39`). *Arranque:* mude uma linha de CSS junto e veja a
   régua reprovar; sem esse arranque ela não está medindo nada.
   **A armadilha, medida em 27/08:** o `scrollIntoViewIfNeeded` do Playwright
   **rola antes de medir** e cega toda medição de layout feita depois. Esta
   régua fotografa a página inteira, sem hover e sem rolagem programática.
2. **Os 48 gestos têm endereço:** 16 `button[data-papel=forca]`, 8
   `button[data-papel=lado]`, 8 `.motor[data-papel=motor][data-lado]`, 4
   `.motor[data-papel=forca]`, 4 `button[data-papel=testar]`, 4
   `button[data-papel=parar]`, sobre 4 `.ctrl[data-uniq]`. *Arranque:* apague um
   `data-papel` do gerador e a régua reprova **nomeando qual**.
3. **`data-forca` casa com o produto:** o conjunto dos quatro é exatamente
   `set(RUMBLE_POLICY_MULT)` (`daemon/subsystems/rumble.py:82`). *Arranque:*
   troque `max` por `maximo` e veja reprovar. A régua **LÊ** o dicionário do
   produto; digitá-lo aqui seria a régua que confunde a PALAVRA com o ATO — a
   forma que reprovou onze réguas desta casa em 26/08.
4. **Zero MAC na página:** `scripts/check_endereco_de_radio.py` roda sobre o
   HTML gerado e não acha nada. *Arranque:* ponha um endereço de verdade num
   `data-uniq` e veja reprovar. (Ele pega por **FORMA**, sem consultar OUI — é
   por isso que alcança o que o portão por OUI não pode.)
5. **Os endereços são únicos:** `(data-uniq, data-papel, data-lado)` não repete.
   *Arranque:* duplique uma coluna no gerador e a régua reprova.
6. **Os 12 filtros mortos são CONTADOS, e a contagem fica escrita.** Medido:
   12 `filter: url(&quot;#outline-filter-N&quot;)` (três por controle) contra 12
   `<filter id="vb-pN-outline-filter-N">`. **Nenhum casa** — o `monta.py:439`
   prefixa os ids do SVG e não reescreve o `url()` porque o desenho usa aspas
   escapadas. O Chrome ignora e desenha; o **WebKit segue o SVG 1.1 e não
   desenha**, e o WebKit é o motor escolhido. Esta régua **declara o número**;
   ela só vira portão quando ela decidir a cura, porque a cura muda **1,09% do
   desenho que ela aprovou** (o contorno do touchpad) e isso é dela.

## O que é dela decidir

**Nada de tela — e a mordida 1 é a prova disso.**

## O buraco que esta sprint declara e não fecha

**`novo-layout/` é `.gitignore:108`** (`git check-ignore -v` reprova o gerador e
a página). Logo: não viajam em `git worktree add`, não entram no pacote
(`install.sh:3103` copia `assets/glyphs` e mais nada de desenho), e **duas levas
editando este arquivo em árvores diferentes divergem sem conflito de merge**,
porque o git não vê nenhuma das duas. Com o WebKit isso deixa de ser "um desenho
faltando" e passa a ser **a aba não existir**, sem um erro no log.

Onde o HTML passa a morar é do **`MIGRA-MOLDURA-01`**, e há **divergência viva
entre as ondas paralelas**: a `MIGRA-GATILHOS-02` escreve o gerador onde ele
está (`novo-layout/_ferramentas/`), e a `MIGRA-LANCADORES-01` já reivindica
`src/hefesto_dualsense4unix/gui/telas/07-lancadores.html` e um gerador em `scripts/telas/`. <!-- ref-externa: os dois são o que aquela sprint VAI criar; a ausência é o assunto. -->
**Esta sprint segue a primeira** — escreve no gerador
onde ele está hoje. A mudança de endereço do arquivo é um `git mv` de quem
coordena; escolher entre as duas é decisão da moldura, e está no índice.
