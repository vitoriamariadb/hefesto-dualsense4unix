# ROLAGEM-01 — a segunda volta: a Lançadores e a Sistema pararam de rolar

**Agente:** opus · **Data:** 09/09/2026 · **Branch:** `voo/ROLAGEM-01-opus` ·
**Base:** `e5f4b3da`

A primeira volta fechou a `03-gatilhos` com o acordeão dos ajustes (`8404faf8`).
Esta fecha as duas que sobravam — e as duas tiveram **causas diferentes**, que é
por que a proposta dela (os blocos que dobram) não servia para nenhuma das duas.

---

## O que mudou

### `09-sistema` — a caixa do registro mandava na fileira, e não devia

**A causa, medida no WebKit vivo com os quatro na mesa:** `DIV.miolo 866>564`.
Dentro, `.avancado` fechava em **438px** onde a lista dos quatro botões pede
**136** — os 302px que estouravam eram **a caixa «Detalhes técnicos» arrastando
a fileira do grid**, e não o contrário.

O comentário do próprio arquivo já prometia o desenho certo — *"`flex:1` E NÃO
UMA SEGUNDA ALTURA CRAVADA: (…) a altura do irmão CHEGA aqui sozinha"* — e a
promessa era verdadeira **no Chrome**, com as quatro linhas de registro do
desenho. Com o daemon vivo o registro tem dezenas de linhas e `white-space:pre`
não quebra nenhuma: a caixa passou a ser o irmão MAIS ALTO, e o grid obedeceu a
ela.

A cura são duas linhas em `interface/aba09.py`:

```css
.col-log{display:flex;flex-direction:column;min-height:0;position:relative}
.col-log > .log{position:absolute;top:0;right:0;bottom:0;left:0}
```

Um filho absoluto não conta para o tamanho do pai. A fileira volta a ser medida
pela `.lista` — o irmão —, e a caixa preenche o que sobrar. **Um
`max-height:136px` digitado seria a segunda verdade sobre a altura da lista**,
que é exatamente o que aquele comentário proíbe.

**Medido depois:** `.avancado` 438 → **136**, `.miolo` 866 → **564**. A página
fecha em **530 de conteúdo para 530 de espaço útil** — que é o par
`ALTURA, MIOLO_H = 530, 564` escrito no topo do arquivo desde 06/09. *O número
já estava certo; o que faltava era a caixa obedecer a ele.*

O registro passa a rolar por dentro, e é o desenho: o `data-hef-rolar="fim"` do
HTML já dizia isso desde que nasceu.

### `07-lancadores` — o conteúdo não tem teto, e nenhum arranjo fixo o segura

**A causa:** `DIV.miolo 668>564`. E o número mudou **durante a própria sessão**:
a grade de cartões foi de **493 a 534px sozinha**, em meia hora, porque o cartão
da Steam saiu de «CHEGAM» para «NÃO CHEGAM» com um jogo pendente — e a lista de
pendências (`.lanc-fora`) tem o tamanho que os jogos dela tiverem. Some-se
«Adicionar novo Lançador», que cria cartão.

*Quantos lançadores ela tem, e quantos jogos com pendência, é dela — e a caixa
não pode crescer com eles.* É a mesma frase que já declara o `DIV.rolo` da
`10-perfis`, e por isso a cura é a mesma: o `.quadro` vira `estica` e a **grade**
ganha a barra, não a página. O que fica pregado acima dela é o que ela precisa
ler sem rolar — o título, a conta («6 localizados · 1 com impedimento») e os três
botões. **Hoje o inverso acontecia: a página inteira rolava e a conta saía de
vista.**

**Nenhuma caixa dela andou.** A grade continua 2×3, os cartões continuam onde
ela os aprovou (*"lançadores perfeito parabéns"*), e os botões continuam na
mesma ordem.

### `07-lancadores` — e a coluna da direita, que saía pela borda

A foto do ANTES mostra o defeito, e ele **não é desta sprint**: o cartão da
direita ficava cortado ao meio, sem borda e com a prosa decepada.

`1fr` é `minmax(auto,1fr)`, e o mínimo `auto` de uma coluna de grade é o
**min-content** do que há dentro. Dentro há o caminho do lançador num `<code>`, e
caminho não tem espaço onde quebrar: `/home/…/net.lutris.Lutris.desktop` mede
~470px de min-content, a coluna se recusa a encolher, e as duas somam mais do
que a caixa.

```css
.lancadores{grid-template-columns:repeat(2,minmax(0,1fr))}
.lanc-diz code{overflow-wrap:anywhere}
```

As duas juntas: sem a segunda, o caminho vazaria do **cartão** em vez de vazar da
grade.

### DOIS VERMELHOS HERDADOS, que eu achei rodando os portões e curei

Os dois estavam no `dev` **antes desta sprint**, e os dois só aparecem no
`portoes.sh` COMPLETO — o `--rapido` não roda `acentuacao` nem
`citacoes-no-codigo`, que é como eles passaram.

1. **`citacoes-no-codigo`** — `interface/monta.py:291` citava `aba03.py:878`, e a
   878 ficou **em branco** quando a primeira volta desta sprint (`8404faf8`)
   mexeu na `aba03.py`. *Âncora em linha vazia não ancora nada.* Corrigido para
   `:960`, que é onde `c["via"]` é escrito hoje — e no mesmo comentário
   `aba06.py:1608` estava errado do mesmo jeito (a linha certa é `:1724`).
   É dívida da minha própria sprint, e por isso a curei.
2. **`acentuacao`, 21 violações** — 2 minhas (o verbo *"eu media"*, que o
   dicionário lê como o substantivo *"média"*; reescrito nos dois lugares) e
   **19 de `CABO-BT-PERFIL-CONTROLE-01`** (`7b16a76e`, de hoje):
   `scripts/check_cabo_bt_perfil_controle.py` e
   `tests/unit/test_portao_a_regua_das_quatro_respostas.py`.

   **Esses dois arquivos NÃO são da minha posse**, e o despacho mandava não os
   alterar *"sem razão medida"* — a saída vermelha do portão é a razão medida.
   O que fiz é anotação, **zero lógica**: `noqa-acento` na linha, com o motivo
   escrito. São dois motivos e os dois são falso positivo do dicionário:
   `"nao"` é **valor da coluna do `mapa-controles.csv`**, não prosa (`_ESCADA`
   compara com ele), e `revisao` está **dentro de citação literal dela**. Uma
   docstring precisou de rebra para o marcador caber em 100 colunas. Os três
   portões desses arquivos ficaram verdes depois (`quatro-respostas`,
   `quatro-respostas-morde`, `citacoes-no-codigo`).

### A régua ganhou as duas declarações

`POR_DESENHO`, em `scripts/ensaios/a_janela_cabe_no_que_ela_ve.py`, tinha uma
linha (`10-perfis → DIV.rolo`). Agora tem três, e as duas novas usam a mesma
frase: `07-lancadores → DIV.lancadores` e `09-sistema → DIV.log`.

---

## Qual mordida prova

**Três mordidas, e as três reprovaram.** Saídas em
`/tmp/claude-1000/.../scratchpad/mordida-{1,2,3}.txt`.

**1. A cura arrancada das duas** (o `estica` e o `overflow-y` fora da `07`; o
`position:absolute` fora da `09`), na página PUBLICADA, com o daemon vivo:

```
REPROVA: 2 aba(s) com barra de rolagem:
  07-lancadores.html: DIV.miolo 668>564 — a caixa não cabe no que ela vê…
  09-sistema.html: DIV.miolo 866>564 — a caixa não cabe no que ela vê…
```

`rc=1`. São exatamente os dois números que a §7 da sprint herdou.

**2. A DECLARAÇÃO arrancada**, com a cura no lugar — para provar que o verde vem
da declaração e não de cegueira nova:

```
REPROVA: 2 aba(s) com barra de rolagem:
  07-lancadores.html: DIV.lancadores 534>430
  09-sistema.html: DIV.log 436>134
```

`rc=1`. A régua VÊ as duas caixas; ela só não as chama de defeito porque estão
declaradas com a razão.

**3. `--alt-janela:500px`** (a mordida que a §4 pede — *"régua que passa com a
janela encolhida não mede altura"*):

```
07-lancadores.html    498/498    ok   DIV.lancadores 534>153
09-sistema.html       498/498    ok   DIV.miolo 564>287   ← REPROVA
```

E esta mordida **mede a diferença entre as duas curas**, que é honesto dizer: a
`07` tem rede — encolha a janela quanto quiser, a página não rola, só a grade. A
`09` **não tem**: ela fecha em 530/530 e é isso; a 500px o `.miolo` estoura de
novo. Zero folga é o desenho declarado do arquivo, não um descuido — mas quem
mexer na `09` tem 0px de crédito.

**4. A LARGURA MAXIMIZADA, que é como ela viu o defeito** — a §2 pedia as duas,
e a segunda faltava. Com a janela do piloto redimensionada para 1900 (a
`.janela` bate no teto de `min(100%,1600px)` e o `.miolo` fica com **1598**):

| | `.miolo` sem a cura | com a cura |
| --- | --- | --- |
| `07-lancadores` | **636 > 564** | 564/564 · `.lancadores` 502>430 |
| `09-sistema` | **866 > 564** | 564/564 · `.avancado` 136 |

**A barra existia maximizada também** — que é exatamente o que ela relatou. E a
largura maior só tira **32px** da `07` (668 → 636): a prosa quebra menos, mas
não o bastante. *A largura nunca foi a cura.*

**O estado final, as dez abas, no WebKit vivo com os quatro na mesa:**

```
PASSA: as 10 abas cabem na janela, com o dado vivo.
07-lancadores.html  775/775  809/809  ok  DIV.lancadores 590>430   (declarada)
09-sistema.html     775/775  809/809  ok  DIV.log 436>134          (declarada)
```

**A FOTO, antes e depois**, `--oculta` nas duas (a tela dela não recebeu nada):
a `07` antes rolava a página inteira e cortava o cartão da direita pela borda;
depois, as duas colunas fecham dentro da caixa, o cabeçalho e os três botões
ficam pregados, e o rodapé está no lugar. A `09` depois cabe inteira, com a
caixa «Detalhes técnicos» na mesma altura da lista de botões — que é o que ela
pediu em 08/09.

---

## O que NÃO verifiquei

* **A palavra dela.** Interface só fecha com o olho dela, e as duas mudanças são
  de tela. A `09` restaura o desenho que o arquivo já documentava; a `07`
  **muda um comportamento** — a grade passa a rolar por dentro, e com 6 cartões
  hoje isso significa que a terceira fileira só aparece rolando. Era isso ou a
  página inteira rolando, e é ela quem escolhe se prefere o outro arranjo (ver
  abaixo).
* **Larguras entre 1212 e 1900.** Só as duas pontas foram medidas, que são as
  duas que a §2 pede. Nada entre elas.
* **A bancada.** `scripts/bancada.sh status` disse LIVRE e eu **não reservei**:
  nada aqui para o daemon, escreve no aparelho ou chama `systemctl`. O daemon
  vivo foi só LIDO, pelo piloto oculto, com os quatro controles que já estavam
  na mesa (2 USB · 2 BT).
* **Nenhuma célula de `docs/data/mapa-controles.csv` foi exercitada.** Esta
  sprint é de layout HTML: não há canal, report id nem transporte no caminho. O
  dado do daemon entrou só como *conteúdo que faz a caixa crescer*.

---

## O que sobrou para o próximo

1. **A `07` cabe em 430px de grade e pede 590.** Se ela quiser as seis fileiras
   sem rolar, os arranjos estão MEDIDOS — e três hipóteses caíram na bancada,
   que é o que evita alguém repeti-las:
   | arranjo | `.miolo` | veredito |
   | --- | --- | --- |
   | hoje, sem rede | 668 | 104px acima |
   | **três colunas** | **669** | **pior** — a coluna estreita quebra a prosa em mais linhas do que a fileira que se poupa |
   | **caminho numa linha só** (`<code>` com reticências) | **668** | **pior** — `display:inline-block` joga o `<code>` para uma linha de caixa própria |
   | botões à direita da prosa | 638 | 74 acima |
   | + a fileira de botões subindo para o título | 592 | 28 acima — e sem teto, quebra de novo amanhã |
   | prosa cortada em 2 linhas | 566 | 2 acima, e **esconde** texto |

   Nenhum deles tem teto. Por isso a rede.
2. **A prosa do cartão é de outro dono.** *"Achei este lançador aqui
   (`/home/…/net.lutris.Lutris.desktop`)"* nasce em
   `interface/desenho_dos_lancadores.py:829`, que **não está na minha posse**
   (LANCADORES-ZERO-01). O caminho absoluto é o que faz o cartão passar de 2
   para 4 linhas. Se ele virasse dica (`title`) em vez de prosa, a grade cairia
   ~90px de uma vez. **Relato, não editei.**
3. **O `--alvo=<seletor>` do instrumento está MORTO.** A §7 da sprint (e o meu
   despacho) dizem que ele existe; `medir()` grava
   `window.__hef_alvo`, mas a JS de `LER` usa
   `j.querySelector('.ctrl') || j.querySelector('.miolo')` e **nunca lê a
   variável**. Não conserta-se aqui de propósito: `scripts/` é posse da
   TUDO-FUNCIONA-01 nesta leva, e eu só acrescentei as duas linhas de
   `POR_DESENHO`, que a sprint exige. **A §7 foi corrigida no arquivo da
   sprint** — fato errado se substitui.
   Para medir o miolo por dentro usei sonda de rascunho, fora do repositório.
4. **A `09` tem 0px de folga**, por desenho declarado (`ALTURA, MIOLO_H = 530,
   564`). Qualquer linha nova na aba estoura o miolo no mesmo dia. Se ela pedir
   mais uma coisa ali, a conta tem de sair de outro lugar da aba.
5. **A `04-iluminacao` continua com `DIV.moldura 153>144`** no relato de CORTE —
   9px de desenho do controle escondidos calados. Não é barra, não reprova, e
   não é desta sprint; fica aqui porque o número já está medido.
