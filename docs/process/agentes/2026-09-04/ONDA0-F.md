# ONDA0-F · A FOLHA — o botão cinza e a linha que só nasce quando há o que dizer

**04/09/2026** · branch `voo/ONDA0-F-A-FOLHA-01-F` · árvore
`hefesto-voo/ONDA0-F-A-FOLHA-01-F` · bancada não usada (`bancada: false`).

Sprint:
`docs/process/sprints/2026-09-04-ONDA0-F-A-FOLHA-01-o-botao-cinza-e-a-linha-que-so-nasce-quando-ha-o-que-dizer.md`

---

## O que mudou

**Dois arquivos de posse, e só um deles precisou de linha:**
`src/hefesto_dualsense4unix/interface/monta.py` (+175 linhas, zero removida).
`interface/onde.py` **não mudou** — o desvio `HEFESTO_BANCADA` que ele já
publicava era exatamente o que as duas réguas precisavam para montar página de
prova sem tocar a bancada dela.

### A folha entra por `monta()`, e não por `css_extra`

As duas peças vivem em `monta.CSS_FOLHA` e são injetadas no `<style>` de **toda**
página, dentro de `monta()`. A escolha é a razão inteira da frente existir: uma
peça que cada aba precisa lembrar de pedir é uma peça que alguma aba esquece — e
o esquecimento não dá erro, dá silêncio.

A injeção passa pelo `troca()` (e não por `str.replace`): um `</style>` que suma
**PARA a geração** em vez de publicar dez páginas sem as peças. A ordem também é
escolha: **depois** do `topo.html` (para vencer `.btn.verde` e companhia por
ordem de fonte — a especificidade é igual) e **antes** do `css_extra` da aba
(folha é base, não lei).

### S-03 · o botão cinza, com a razão na dica (D-03)

```css
.btn.apagado,.seg button.apagado{
  border-color:var(--border-sutil);color:var(--texto-mudo);cursor:not-allowed}
.btn.apagado:hover,.seg button.apagado:hover{ …a mesma coisa… }
.btn:not(.apagado) + .ajuda.porque,
.seg button:not(.apagado) + .ajuda.porque{display:none}
.ajuda.porque:has(.dica:empty){display:none}
.ajuda.porque:has(.nada){display:none}
.ajuda.porque{align-self:center;margin-left:-4px}
```

* **A cara é a do `.seg button:disabled`, letra por letra** — a gramática que a
  página tem desde 31/08. Não inventei uma segunda.
* **O mecanismo é o oposto**: ali o botão está `disabled` de verdade; aqui a
  classe é só tinta. É a decisão do PO sobre a aba 09 — *"Apagado e ainda assim
  responde"* —, e `disabled` mataria o clique e o recado junto.
* **O `?` é o `.ajuda` que a página já tem**, com a classe `porque` dizendo que
  o texto dele vem do **produto**. Ele some de três jeitos, porque as abas
  emitem de três: colado a um botão que não está cinza; com a `.dica` vazia de
  nascença; com o marcador `.nada` que o pacote manda.

**O alvo, uma vez para as dez** — `monta.botao_cinza(rotulo, campo, tom, razao,
extra)`:

```html
<button class="btn apagado" data-campo="X"
        data-hef-alvo="classe" data-hef-classe="apagado">Rótulo</button>
<span class="ajuda porque">?<span class="dica" data-campo="X"
        data-hef-alvo="html">a razão</span></span>
```

**UM CAMPO SÓ ALIMENTA OS DOIS.** O botão e a dica levam o MESMO `data-campo`:
o botão pelo alvo `classe` (acende `apagado` quando o valor não é vazio nem
travessão) e a dica pelo alvo `html`. Com dois campos seria possível pintar um
botão cinza sem razão, ou razão sem cinza; com um, **não há caminho no código em
que isso aconteça**. O mesmo vale na página parada: quem decide o cinza é o
argumento `razao`, e não um `cinza=True` à parte.

**NÃO emite `aria-disabled`**, e a razão é medida: nenhum alvo do piloto escreve
atributo E classe no mesmo elemento, então o `aria-disabled` congelaria no valor
do desenho e passaria a mentir no primeiro tique. Atributo que a tela viva não
consegue manter verdadeiro é pior que a ausência dele. **Fica como dívida
declarada** (ver "o que sobrou").

### S-02 · a linha de ressalva condicional (D-02)

```css
.ressalva{font-size:11.5px;line-height:1.5;color:var(--texto-mudo);margin-top:5px}
.ressalva:empty{display:none}
.ressalva:has(.nada){display:none}
```

O `:empty{display:none}` da `05-vibracao` e da `06-navegacao` promovido a peça
das dez — **com o `:has(.nada)` junto, porque as duas metades são a mesma
peça**: `:empty` cobre a linha que nasce vazia e nunca é pintada; `.nada` cobre
a que o piloto pinta a cada tique com "não há o que dizer". Faltando uma das
duas, a linha volta a aparecer num dos dois caminhos, calada.

`monta.ressalva(campo, texto)` emite
`<div class="ressalva" data-campo="X" data-hef-alvo="html">`, e sem texto manda
`monta.NADA_A_DIZER` — nunca um travessão.

### O que mais mudou, e por quê

| arquivo | o quê |
| --- | --- |
| `mockup/*.html` (dez) | **regeradas**. O `<style>` do esqueleto é um só para as dez, então as 48 linhas de CSS entram nas dez. Diff **puramente aditivo**: `git diff --numstat` diz `50	0` em cada uma das dez — cinquenta linhas acrescentadas, ZERO removidas |
| `mockup/DIVERGENCIAS.md` | as dez declaradas em trabalho, com o que o produto faz enquanto espera |
| `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | a lápide de `monta.py::troca` **apagada** (a cura chegou: `monta()` agora o chama) e as duas funções novas classificadas em `_NAO_E_PROMESSA`, pela mesma razão medida de `monta.py::monta` |
| `tests/unit/test_o_botao_cinza_diz_a_razao.py` | novo, 9 casos |
| `tests/unit/test_a_linha_de_ressalva_so_nasce_quando_ha.py` | novo, 7 casos |

**Zero edição nos dez `abaNN.py` e nos dez `pacotes/aNN_*.py`.**

---

## Como provei (mordida colada)

As duas réguas **leem, não digitam**: nenhuma cor e nenhum pixel estão escritos
nelas. Elas montam uma página pelo `monta.monta()` — a mesma função que faz as
dez —, num diretório temporário pelo `HEFESTO_BANCADA`, abrem no Chrome do
sistema (headless, nenhuma janela na tela dela) e perguntam ao motor o que ele
**desenha**. As comparações que decidem são entre elementos da MESMA página.

### Verde com a cura

```
$ .venv/bin/python -m pytest tests/unit/test_o_botao_cinza_diz_a_razao.py \
      tests/unit/test_a_linha_de_ressalva_so_nasce_quando_ha.py -q
................                                                         [100%]
16 passed in 2.80s
```

### Mordida 1 — arrancada a regra `.btn.apagado{…}`

```
$ pytest tests/unit/test_o_botao_cinza_diz_a_razao.py -q
E  AssertionError: o botão apagado tem a MESMA cor de texto do clicável
   (rgb(200, 204, 218)) — a tela em repouso continua sem distinguir os dois,
   que é a queixa inteira da D-03.
E  assert 'rgb(200, 204, 218)' != 'rgb(200, 204, 218)'
E  AssertionError: o `.btn.apagado` pinta rgb(200, 204, 218) e o
   `.seg button:disabled` pinta rgb(154, 158, 184) — são duas caras de apagado
   na mesma janela, que é a doença que esta casa persegue.
E  AssertionError: o `.btn.vermelho.apagado` pinta rgb(255, 85, 85) e o apagado
   puro pinta rgb(200, 204, 218) — o tom venceu o cinza, e o botão travado
   grita a cor da ação que ele vai recusar.
FAILED …::test_o_cinza_difere_do_clicavel_na_tela
FAILED …::test_o_cinza_e_a_mesma_gramatica_do_seletor
FAILED …::test_o_tom_do_botao_nao_vence_o_cinza
3 failed, 6 passed in 1.46s
```

### Mordida 1b — arrancadas as três regras do `?`

```
E  AssertionError: o `?` apareceu ao lado de um botão que NÃO está cinza
   ({'cor': 'rgb(154, 158, 184)', 'borda': 'rgb(83, 87, 111)',
     'cursor': 'help', 'display': 'block', 'altura': 17})
   — um `?` sem nada a explicar é ruído com cara de dado.
FAILED …::test_o_ponto_de_interrogacao_so_aparece_quando_ha_razao
1 failed, 8 passed in 1.34s
```

### Mordida 2 — arrancadas as duas metades da ressalva

```
E  AssertionError: a linha VAZIA de nascença cobra 11px na cena — o
   `:empty{display:none}` caiu, e toda aba que reservar a linha passa a pagar
   o vão da coluna sem ter o que dizer.
FAILED …::test_sem_ressalva_a_linha_nao_ocupa_nada
1 failed, 6 passed in 1.54s
```

### Mordida 2b — arrancada SÓ a metade do marcador

```
E  AssertionError: a linha com o marcador `.nada` cobra 11px na cena — o
   `:has(.nada){display:none}` caiu, e a linha que o piloto pinta a cada tique
   volta a ocupar espaço.
FAILED …::test_sem_ressalva_a_linha_nao_ocupa_nada
1 failed, 6 passed in 2.66s
```

### Cura devolvida

```
$ pytest tests/unit/test_os_dez_geradores_rodam.py \
      tests/unit/test_o_botao_cinza_diz_a_razao.py \
      tests/unit/test_a_linha_de_ressalva_so_nasce_quando_ha.py -q
38 passed in 9.37s
```

### A prova de tela

Fotografadas com `interface/olhar.py` (Playwright + o Chrome do sistema,
headless — **nenhuma janela nasceu na tela dela**), 1920x1080, página inteira.

| aba | antes | depois |
| --- | --- | --- |
| `06-navegacao` | `/tmp/f-fotos/antes-06-navegacao.png` | **IDÊNTICA byte a byte** |
| `09-sistema` | `/tmp/f-fotos/antes-09-sistema.png` | **IDÊNTICA byte a byte** |

**E é o resultado certo, não um não-achado:** nenhum elemento das dez abas usa
as peças hoje, então as regras novas não casam com nada. A folha entra sem mover
um pixel do que ela aprovou — que era a condição para uma frente de infra
atravessar antes das dez abas.

**O que a foto idêntica NÃO prova é que a peça funciona**, então há uma terceira
foto, e ela está VERSIONADA ao lado deste arquivo —
`ONDA0-F-a-folha-em-uso.png`, uma página montada pelo mesmo `monta()` que
**USA** as duas peças. Nela se vê, de cima para baixo:

* dois botões com trabalho a fazer — "Retomar" neutro e "Reiniciar o serviço"
  em vermelho, **sem `?`**;
* os mesmos dois **sem** trabalho a fazer — os dois cinza (o vermelho perdeu o
  tom), cada um com o seu `?` colado;
* "Barra de luz: apagada" **com** a ressalva embaixo, e a mesma linha **sem**
  ressalva — visivelmente mais curta, sem espaço reservado.

### O clique

O caso `test_apagado_e_ainda_assim_responde` dispara `HTMLElement.click()` no
botão cinza e conta o ouvinte. Num botão `disabled` esse método não dispara
ouvinte nenhum — o contador vindo em **1** é a prova de que o cinza é tinta, e
de que quem chega pelo controle ainda alcança a razão.

---

## O que medi e derrubou uma suposição

### 1. A régua da ressalva NASCEU FALSA, e a mordida foi quem contou

A primeira redação media a **altura da linha** dentro de um bloco comum. Com as
duas metades da cura arrancadas ela deu **`rc=0`, 7 casos verdes**. Medido no
Chrome, na mesma bancada:

```
a linha vazia mede ZERO de altura mesmo SEM `display:none`
  (um bloco vazio não gera caixa de linha, e o `margin-top` colapsa com o pai)

e mesmo assim ela CUSTA 11 px na cena:
  6 do `gap` da coluna + 5 do `margin-top`, que dentro de um flex não colapsa
```

**Medir a altura do elemento responde "não ocupa" sobre uma linha que ocupa.**
Quem paga o pixel é o **pai**, e é lá que a régua passou a olhar — numa coluna
com vão, que é como as abas empilham de verdade (`.vib-estado` da `05` e
`.estados` da `06` são as duas precedentes vivas), contra uma cena de referência
medida na mesma página. Foi só depois disso que a mordida acusou os 11 px.

É a mesma família das onze de 26/08: *a régua media outra coisa que não o que
prometia*. O que a salvou foi arrancar a cura, e não escrevê-la melhor.

### 2. `.seg button:disabled` NÃO muda a cor do texto — muda a borda

Suposição minha, escrita numa asserção de sanidade: que o seletor livre e o
travado teriam cores diferentes. Medido: os dois pintam `rgb(154, 158, 184)`.
`.seg button` já **nasce** em `--texto-mudo`; quem diz "escolhido" ali é a
classe `.on`, e o que o `:disabled` de 31/08 mudou foi a **borda** e o cursor.
A asserção reprovava sobre a folha certa. Passou a comparar bordas.

(Para o `.btn` a história é outra e a peça funciona nos dois eixos: o `.btn`
nasce em `--texto-suave`, então o apagado muda **cor e borda**.)

### 3. `onde.paginas()` devolve TREZE, não dez

A bancada guarda três páginas avulsas — `mapa-do-controle.html`,
`mapa-das-portas.html`, `calibrar-sensores.html` — que abrem por fora da janela
e **não passam por `monta()`**. As duas réguas reprovaram sobre elas, com razão
do ponto de vista delas e sobre um alvo que não é o desta peça. Passaram a
filtrar por `[0-9][0-9]-*.html`, que é o mesmo filtro do
`test_os_dez_geradores_rodam` e do
`test_nenhuma_pagina_publicada_carrega_marcador_de_lint`.

### 4. O `?` nascia solto entre dois botões — e isso saiu da FOTO

Na primeira foto da página de prova o `?` ficava a 8 px dos **dois** vizinhos
(o vão do `.acoes`) e lia como se explicasse o botão seguinte; e, por ter 17 px
de altura fixa num flex que estica, subia acima do texto que explica. Duas
linhas curaram (`align-self:center;margin-left:-4px`), e nenhuma régua tinha
como acusar isso — quem viu foi o olho na foto.

### 5. A frente CUROU uma lápide sem querer, e o portão cobrou

`interface/monta.py::troca` estava declarado em `_NAO_E_PROMESSA` como
"chamado só pelos dez `abaNN.py`, que são bancada". Ao injetar a folha pelo
`troca()`, ele ganhou chamador estático num módulo alcançado, e o
`portao_a_casa_sabe_e_o_produto_nao_faz` reprovou pedindo a lápide de volta ao
pó. Apagada, com a nota do porquê no lugar dela.

---

## O que NÃO verifiquei

* **A tela viva.** Nada aqui passou pelo `WebKit2.WebView` com o daemon vivo —
  a sprint é `bancada: false` e as peças não têm, hoje, um único elemento que as
  use nas dez abas. O que está provado é o Chrome, que é o motor das réguas
  desta casa, e não é o mesmo motor do produto.
* **`:has()` no WebKitGTK dela.** Não é aposta nova (o esqueleto já usa
  `.quadro:has(> input.abre:not(:checked))` e a `06` apaga uma linha de estado
  por ele desde 03/09), mas **eu não o medi naquele motor** — medi no Chrome.
* **O alvo `classe` pintando `apagado` de verdade.** O contrato está no HTML
  emitido (`data-hef-alvo="classe"` + `data-hef-classe="apagado"`) e o ramo
  existe no piloto, mas nenhum pacote emite este campo ainda — logo o caminho
  daemon → pacote → tela não foi exercido de ponta a ponta.
* **A leitura de tela por leitor de tela.** O botão cinza não anuncia estado a
  quem usa leitor: ver a dívida do `aria-disabled` abaixo.
* **A suíte inteira.** Rodei o meu escopo e os portões; a suíte em oito lotes é
  de quem coordena, no fim.

---

## O que sobrou para o próximo

### Para as DEZ frentes da Onda 2 — como usar as peças

Nenhuma delas precisa escrever CSS. As duas peças já estão na folha de todas as
páginas; o que cada aba faz é **emitir a marcação e declarar o campo no
pacote**:

1. **Botão que vai recusar** — troque a emissão do `<button class="btn …">` por
   `monta.botao_cinza(rotulo, campo, tom=…, razao=…, extra=…)`. `extra` é onde
   vai o `data-gesto` do clique, que é da aba. **Um campo só**: o pacote emite a
   RAZÃO nesse `data-campo` (string vazia quando não há), e o cinza acende
   sozinho. Não emita `disabled`.
2. **Ressalva** — emita `monta.ressalva(campo, texto)` ao lado do valor. O
   pacote manda a frase, ou `monta.NADA_A_DIZER` quando não há o que dizer —
   **e manda a chave em TODO tique**: chave ausente deixa a frase velha na tela
   para sempre.
3. **A ressalva quer viver numa coluna com vão** (`display:flex;
   flex-direction:column;gap:…`), que é onde o `display:none` devolve o pixel.
   Fora de um flex a linha vazia já custava pouco — e é justamente por isso que
   uma régua que a medisse ali daria verde sobre defeito.

Quem chega nelas, por decisão: **02** (o botão do microfone e o do alto-falante,
e a confissão do mudo que caiu noutro controle), **04**
(a razão do tracejado), **05** (a linha de estado por coluna, D-14), **06** (o
portão de modo, o custo de desligar o teclado), **08** (o microfone e "a luz não
acende"; as quatro curas do Check-up) e **09** (Retomar, Reiniciar o serviço,
Ver os plugins carregados).

### Arquivo alheio — o que RELATO em vez de editar

| onde | o quê | de quem |
| --- | --- | --- |
| `interface/pacotes/a06_navegacao.py:359` | `NADA_A_DIZER` continua declarado lá. Agora há uma segunda cópia em `monta.py`, que é onde a folha que a LÊ mora. **Aponte a de lá para `monta.NADA_A_DIZER`** e apague o literal. Enquanto as duas existirem, `test_o_marcador_e_o_mesmo_das_duas_casas` impede que divirjam calado | frente da aba **06**, Onda 2 |
| `interface/aba06.py:609-611` e `interface/aba05.py:653` | `.estados:empty`, `.estado:empty`, `.estado:has(.nada)` e `.vib-estado:empty` continuam nas folhas locais das duas abas. **Não removi**: são arquivos das frentes da Onda 2, e as classes locais delas não são `.ressalva`. Quem migrar aquelas linhas para a peça comum fecha a duplicação | frentes **05** e **06** |
| `interface/hefesto_vivo.py` | **A dívida do `aria-disabled`.** Nenhum alvo do piloto escreve atributo E classe no mesmo elemento, então o botão cinza não consegue anunciar o estado a um leitor de tela sem congelar o atributo no desenho. Fecha com um alvo que escreva os dois, ou com `data-hef-alvo="classe"` aprendendo a espelhar um `aria-*` | frente **P** (Onda 0) ou Onda 3 |
| `mockup/DIVERGENCIAS.md` | as dez seções que escrevi vão **colidir** com as que as frentes da Onda 2 escreverem para as abas delas. É conflito de merge previsível e trivial (seções por aba, aditivas) — quem costurar resolve mantendo as duas razões na mesma seção | quem coordena |
| `mockup/*.html` (dez) | regeradas por mim com o CSS da folha. Quando cada frente da Onda 2 regerar a aba dela **a partir do `monta.py` já mergido**, o resultado converge; a partir do `monta.py` de antes, o CSS some da aba dela. **A ordem importa: a Onda 0 tem de estar em `onda/atual` antes de a Onda 2 regerar** | quem coordena |

### A publicação

As dez páginas estão **atrás no produto por decisão**, declaradas em
`mockup/DIVERGENCIAS.md`. Não publiquei — é a regra da §5 do
`2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md`, e as peças não movem um
pixel enquanto nenhuma aba as usar. Elas saem daquele arquivo **juntas, na leva
de publicação**, quando o desenho novo da Onda 2 for o que precisa do olho dela.

### O instrumento desta árvore

Esta worktree não tem `.venv/`, e o `_venv_bin` do `portoes.sh` resolve a árvore
principal como
`/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-estavel`, cuja `venv/` **não
tem `playwright`, `structlog` nem `ruff`** — quatro portões vermelhos por
instrumento, não por código. O contorno, e ele é do agente e não do produto:

```bash
export HEFESTO_PY=/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
export PATH=/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin:$PATH
```

Sem isso o cabeçalho do `portoes.sh` diz `python …-estavel/venv/bin/python` — e
esse é o sinal de que os vermelhos não são seus.
