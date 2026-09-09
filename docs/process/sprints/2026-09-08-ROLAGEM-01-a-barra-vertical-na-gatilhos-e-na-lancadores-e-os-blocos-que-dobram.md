---
sprint: ROLAGEM-01
estado: feita
posse:
  ROLAGEM-01:
    - src/hefesto_dualsense4unix/interface/aba03.py
    - src/hefesto_dualsense4unix/interface/aba07.py
    - src/hefesto_dualsense4unix/interface/aba09.py
    - src/hefesto_dualsense4unix/interface/topo.html
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
bancada: false
depois_de: [TELA-TRES-01, LANCADORES-ZERO-01]
---

> **ESTADO 2026-09-09: feita** — as três abas fecharam. A `03` pelo acordeão
> (`8404faf8`); a `09-sistema` porque a caixa «Detalhes técnicos» arrastava a
> fileira do grid (`.avancado` 438 onde a lista pede 136 — `position:absolute`
> devolve a fileira ao irmão, e o `.miolo` cai de 866 para 564, o par
> `ALTURA, MIOLO_H = 530, 564` que o arquivo já documentava); e a
> `07-lancadores` pela rede da `10-perfis` — a GRADE rola por dentro, não a
> página, porque o conteúdo **não tem teto** (medida crescendo de 493 a 534px
> sozinha numa sessão, quando o cartão da Steam ganhou um jogo pendente). No
> caminho caiu também a coluna da direita que saía pela borda, defeito ANTERIOR
> a esta sprint (`1fr` é `minmax(auto,1fr)`, e o caminho no `<code>` não tem
> onde quebrar). As dez abas passam no
> `scripts/ensaios/a_janela_cabe_no_que_ela_ve.py` com o dado vivo. Entrega em
> `docs/process/agentes/2026-09-09/ROLAGEM-01-opus.md`.
>
> **ESTADO 09/09/2026 (a primeira volta): a metade da Gatilhos ESTÁ FEITA** (`8404faf8`) — o
> acordeão dos ajustes, a opção (A) da §6, medido no WebKit vivo: `DIV.miolo
> 863>564` sumiu da 03. **Sobram DUAS**, e são a segunda volta desta sprint:
> `07-lancadores` (627>564) e `09-sistema` (866>564) — as duas com o `.miolo`
> estourando, as duas sem blocos L2/R2 a dobrar. A `aba09.py` entrou na posse
> por isso: o `.miolo` da 09 é dela, e de sprint aberta nenhuma. A régua ficou
> mais fina no mesmo commit — `auto`/`scroll` é BARRA e reprova, `hidden` é
> CORTE e só informa, e `POR_DESENHO` declara a lista da 10. Ver §7.

# ROLAGEM-01 — a barra vertical que nasceu na Gatilhos e na Lançadores, e os blocos que dobram

**Achado por ELA em 08/09/2026, com o produto instalado e maximizado.** Palavras
dela: *"outro bo desde que alteramos a altura e largura geral. duas paginas ficaram com barra de navegação vertical. tipo a gatilhos e lançadores. E tava pensando pra gatilhos talvez fosse interessante colocar a seção do r2 e l2 dentros de blocos de expansão igual fizemos na aba controles o que vc acha?"* <!-- noqa-acento: citação literal dela, palavra por palavra -->

São **duas coisas**: um defeito (a barra) e uma proposta de desenho (os blocos).
A proposta pode até curar o defeito — mas só depois de a causa estar medida,
senão dobra-se a aba e a barra continua lá.

## §1 — O que já está medido, e o que ISSO exclui

A mudança de 08/09 foi UMA linha (`topo.html:187`, commit `d63bbd73`):
`width:1180px` → `width:min(100%,1600px)`. **A altura não mudou**:
`--alt-janela:777px` (`topo.html:701`, *"a MESMA altura nas dez abas"*), e a
`.janela` é `overflow:hidden` — ela própria **não rola**.

Medido em 08/09 à noite, Chrome headless, as dez páginas PUBLICADAS
(`interface/paginas/`), em 1180, 1600 e 1900 de largura:

| o que | resultado |
| --- | --- |
| algum elemento dentro da `.janela` com `overflow:auto/scroll` e conteúdo maior que a caixa | **nenhum** na 03 nem na 07, nas três larguras. Só a 10 (`div.rolo`, 475/383 px), por desenho |
| conteúdo da `.janela` | 775 px nas dez |
| o que há ABAIXO da `.janela` no `body` | `div.nota` (a legenda) em todas: 1016 px na 03, 1007 na 07 — e 3093 na 02, 271 na 04 |

**O que isso exclui:** a causa não está no HTML publicado nem na largura. Se a
legenda fosse a causa, as dez rolariam — a 02 mais que todas — e ela viu duas.

**O que sobra, e é onde medir:** o que difere entre a minha medição e a tela
dela é **WebKit + dado vivo + a janela GTK**. Os candidatos, em ordem:

1. **a caixa que cresce com os quatro controles vivos.** A 03 desenha uma
   coluna por controle (`aba03.coluna`, `:883`), com o bloco do L2, o do R2 e
   a linha «Guardar / Todos» — com dado vivo cada coluna pode ficar mais alta
   que no publicado (o publicado tem as quatro colunas, mas com o desenho, não
   com os efeitos dela). A 07, com os seis cartões achados e o Steam com 63
   jogos, idem;
2. **a janela GTK** — `gui/ponte_da_tela.py:168-169` pede `1212 × (809 + 46)`
   (`set_size_request`, `:511`) e `set_default_size(TAMANHO_NA_TELA)` (`:493`).
   Maximizada, a `WebView` é maior que a `.janela`; NÃO maximizada, é a
   `.janela` que pode não caber;
3. **o `div.nota`** — só se o WebKit o mostrar e o Chrome não; improvável, pela
   conta das dez.

## §2 — A medição que decide, e ela roda NO WEBKIT

A sonda é a mesma que eu rodei no Chrome, mas dentro do piloto, com o daemon
dela e os quatro na mesa:

```js
(() => { const out=[]; for (const el of document.querySelectorAll('*')) {
  const cs = getComputedStyle(el);
  if ((cs.overflowY==='auto'||cs.overflowY==='scroll') && el.scrollHeight>el.clientHeight+1)
    out.push([el.tagName, el.id, el.className, el.scrollHeight, el.clientHeight]); }
  out.push(['DOC', document.documentElement.scrollHeight, document.documentElement.clientHeight]);
  return JSON.stringify(out); })()
```

Rode pela ponte JS do piloto (`hefesto_vivo.py --oculta --abre 03-gatilhos.html`
e o mesmo para a 07), **nas duas larguras**: a janela do `TAMANHO_NA_TELA`
(1212) e a maximizada (~1900). O que a lista devolver É a causa; escreva os
números aqui antes de mexer.

**Duas armadilhas já pagas:** o piloto dispara as migrações one-shot no
`~/.config` real de quem o roda — confira antes que elas já rodaram na máquina
dela (memória `rodar-o-piloto-migra-o-perfil-real-dela`); e `--oculta` sempre —
ela tem UMA tela.

## §3 — A proposta dela, e a minha opinião: SIM, com três condições

O modelo é o da aba Controles: a linha `.ctl` que se clica (`aba02.py:255-260`)
e o corpo fechado `.corpo-cx{height:0;overflow:hidden;visibility:hidden}`
(`:354`) — e a razão de ser `height:0` e não `display:none` está escrita ali:
a régua de alturas mede o corpo fechado por dentro, e `display:none` a cegaria.

**A mesma gramática serve para a Gatilhos**, com estas condições:

1. **A linha fechada DIZ o estado.** O que se dobra é o EDITOR (a lista de 19
   modos, as barras de posição e força); o que fica à vista, na linha, é
   *«L2 · Arma · 40 %»*. Regra dela de 07/09: *o que a pessoa precisa para
   executar não pode custar um clique* — e saber o que o gatilho está fazendo
   é executar.
2. **Dobra por LINHA, não por coluna.** As quatro colunas partilham a altura
   das linhas (`grid-template-rows`, `aba03.py:61`). Se o L2 do P1 abre e o do
   P2 fica fechado, as colunas desalinham e o R2 de cada uma cai numa altura
   diferente. O «L2» abre e fecha nas quatro colunas de uma vez, como o «Todos»
   da Controles rola as quatro de uma vez.
3. **«Guardar / Todos» fica fora das dobras.** É a linha que age sobre o PAR
   L2+R2 da coluna; dentro de um dos dois blocos ela ficaria escondida metade
   do tempo.

**O que a dobra NÃO faz:** curar a barra se a causa da §1 for a janela (item 2)
ou outra caixa. Por isso ela é a §3 e não a §1 — e por isso a Lançadores está
nesta sprint pela BARRA e não pela dobra: lá não há L2/R2 a dobrar, e a cura é
o que a sonda disser.

**É decisão de tela.** O desenho vai para o `mockup/` primeiro
(`interface/aba03.py` → `mockup/03-gatilhos.html`, e
`scripts/check_o_desenho_aprovado.py --publicar 03` leva ao produto), e publica-se com
o OK dela — a direção é `mockup/` → produto, nunca o contrário.

## §4 — O que MORDE

* a sonda da §2, com os quatro na mesa, devolve **lista vazia** (nenhuma caixa
  rolando) na 03 e na 07, nas duas larguras — e continua vazia nas outras oito;
* forçar `--alt-janela:500px` e a sonda tem de acusar a caixa que passou a
  rolar, nomeando-a. Régua que passa com a janela encolhida não mede altura;
* com as dobras: fechar o L2 e a linha continua dizendo o modo e a força
  (ler o texto computado da linha, não o gerador); abrir o L2 do P1 abre o das
  quatro colunas — medir a altura da linha nas quatro, iguais.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo / BT | é tela: a sonda da §2 roda com os quatro na mesa, dois em cada transporte, e a barra não pode depender de qual está no rádio |
| no perfil | —; se os blocos dobrados guardarem estado (aberto/fechado), ele é da TELA, não do perfil |
| por controle | a dobra é por LINHA (as quatro colunas juntas), de propósito — §3 |

---

## §5 — A CAUSA ESTÁ MEDIDA — 09/09/2026, no WebKit vivo, com os QUATRO na mesa

**Não é a `.janela`. É o `.miolo` dentro dela.**

`scripts/ensaios/a_janela_cabe_no_que_ela_ve.py` abre o piloto oculto, visita
cada aba, **espera o tique pintar com o dado do daemon** e pergunta ao DOM:

| aba | `.janela` | documento | quem estourou |
| --- | --- | --- | --- |
| 01-jogar | 775/775 | 809/809 | — |
| 02-controles | 775/775 | 809/809 | `DIV.corpo-cx 267>0` |
| **03-gatilhos** | 775/775 | 809/809 | **`DIV.miolo 863>564`** |
| 04-iluminacao | 775/775 | 809/809 | `DIV.moldura 153>144` |
| 05-vibracao | 775/775 | 809/809 | — |
| 06-navegacao | 775/775 | 809/809 | — |
| **07-lancadores** | 775/775 | 809/809 | **`DIV.miolo 627>564`** |
| 08-conexoes | 775/775 | 809/809 | — |
| 09-sistema | 775/775 | 809/809 | `DIV.miolo 866>564` |
| 10-perfis | 775/775 | 809/809 | `DIV.desfecho 15>0` |

**As duas abas que ela nomeou são as duas com o maior estouro de `.miolo`** —
299px na Gatilhos e 63px na Lançadores. A `.janela` fecha em `775/775` nas dez,
que é exatamente por que a medição de 08/09 no Chrome não achou nada: ela olhava
o continente.

**A ARMADILHA QUE ISSO DEIXA, e ela pegou este instrumento na primeira volta:**
a primeira versão desta régua olhava só a `.janela` e o documento — os dois
fecham — e deu **PASSA** com a barra na tela dela. *Uma régua que mede o
continente dá verde sobre o conteúdo que transborda dentro dele.* A `.janela` é
`overflow:hidden` por desenho: ela NUNCA rola. Quem rola é o filho.

**E O QUE ISSO CONFIRMA:** a hipótese 1 da §1 (*"a caixa que cresce com os
quatro controles vivos"*) está certa, e as outras duas caem — o `div.nota` está
fora da `.janela` e o documento fecha em `809/809`.

### Uma nota honesta sobre a 09

A `09-sistema` passou de `866` para `882` na mesma sessão: a TELA-TRES-01 §1
esticou a caixa «Detalhes técnicos» de 110 para 136px, a pedido dela. **O
estouro dela já existia** (866 antes) e não é dessa cura — mas ela agora carrega
16px a mais, e isso fica escrito porque o próximo a medir vai ver o número
maior.

### O que a §2 (a proposta dela) tem de tirar

Na Gatilhos, **299px**. Dobrar o bloco do R2 num acordeão tira ~300 — o que
fecha exatamente. É o que a proposta dela previa, e agora tem número.

## §6 — Quanto a proposta dela tira, em pixel — medido no vivo

A coluna da Gatilhos, filho a filho, com os quatro controles na mesa:

```
cabeca:24  DIV:36  DIV:36  ajustes e:230  vao:1  DIV:36  DIV:36  ajustes d:230  guardar:34
```

**663px de coluna**, e o `.miolo` fecha em **863** contra uma caixa de **564**.

| arranjo | coluna | miolo | cabe? |
| --- | --- | --- | --- |
| hoje (os dois abertos) | 663 | 863 | **não** — 299 de sobra |
| um bloco dobrado | 433 | 633 | **não** — 69 de sobra |
| os dois dobrados | 203 | 403 | **sim** — 161 de folga |

**A proposta dela cura, e o número diz COMO:** com os dois blocos nascendo
fechados — como o acordeão da `02-controles`, em que *"a linha fechada mantém o
resumo de hoje"* — a aba cabe com folga. Com um aberto sobram **69px**, e é aí
que a decisão dela decide o desenho:

* **A)** os dois nascem fechados e **só um abre por vez**; ao abrir, 69px
  rolam — e nesse instante ela está mexendo naquele bloco;
* **B)** os dois nascem fechados e o bloco aberto encolhe 69px (o `ajustes`
  passa de 230 para ~161) — nada rola nunca, e o conteúdo aperta;
* **C)** os dois nascem fechados e o `Guardar / Em todos` (34px) vira rodapé
  único da grade em vez de uma linha por coluna — tira 34 dos 69, e sobram 35.

**Isto é desenho, e a §2 desta sprint é uma pergunta dela** (*"o que vc
acha?"*). A recomendação, com os números na mão, é a **(A)**: é a que não
aperta nada e a que copia o acordeão que ela já aprovou na `02-controles`; a
rolagem de 69px só existe enquanto um bloco está aberto, que é exatamente o
momento em que ela quer ver aquele bloco inteiro.

**A `07-lancadores` (63px) e a `09-sistema` (302px) não são desta proposta** —
elas não têm blocos L2/R2. Ficam para uma segunda volta, com a mesma régua.

**A régua:** `scripts/ensaios/a_janela_cabe_no_que_ela_ve.py`, no piloto oculto
com o dado vivo. `--dentro` lista os filhos da coluna com a altura de cada um.

## §7 — A metade FEITA, 09/09/2026, e o que a segunda volta herda

**A Gatilhos curou.** O acordeão dos ajustes é a opção (A) da §6 — os dois
blocos nascem fechados, só um abre por vez —, e as três condições da §3 caíram
de graça no desenho escolhido:

* *a linha fechada DIZ o estado*: **Modo** e **Efeito pronto** ficam à vista,
  vivos e editáveis. O que se dobra é o ajuste fino (posição, força), que é o
  que ninguém precisa ler para saber o que o gatilho está fazendo;
* *dobra por LINHA, não por coluna*: a trilha é da GRADE e as quatro colunas a
  partilham por `subgrid` — dobrar uma coluna só é **impossível por
  construção**, não por disciplina;
* *«Guardar / Em todos» fica fora*: é a trilha 9, e nenhuma das duas dobras a
  toca.

O gesto é **rádio** (`name="dobra"`, `#dobra-nenhum` marcado), a gramática da
`02-controles` que ela já aprovou. O que essa gramática não tem é o FECHAR: com
um `<label>` só, o único jeito de fechar um bloco é abrir o outro. A cura são
**dois labels sobrepostos** no glifo da seção — `abre` aponta para o rádio da
seção, `fecha` aponta para `#dobra-nenhum` — e o CSS troca qual dos dois é
visível. Medido no Chrome sobre o mockup: coluna 315 fechada, 407 com o L2
aberto, 361 com o R2, e abrir um FECHA o outro sozinho.

### A régua ficou mais fina, e ela estava reprovando o desenho aprovado

A primeira versão tratava `overflow:hidden` como `auto`. Resultado: **vermelho
em quatro abas por causa de caixa fechada DE PROPÓSITO** — o corpo do acordeão
da `02-controles` (`DIV.corpo-cx 267>0`), o que esta sprint acabou de criar na
`03` (`DIV.rot-l2-3 16>0`) e o `DIV.desfecho 15>0` da `10-perfis`.

*Régua que reprova sempre não ensina nada, e a que reprova o desenho aprovado
ensina errado.* A separação, agora:

| valor de `overflow-y` | o que é | o relato |
| --- | --- | --- |
| `auto` · `scroll` | **BARRA** — o navegador desenha | reprova |
| `hidden` | **CORTE** — esconde calado | informa, sem vermelho |
| declarado em `POR_DESENHO` | rola porque alguém quis | sai na tabela, fora do vermelho |

`POR_DESENHO` tem uma linha hoje: `10-perfis.html → DIV.rolo`, *"a lista de
perfis rola por desenho — quantos perfis ela tem é dela, e a caixa não pode
crescer com eles"*, que é o que a §1 já dizia em 08/09. Caixa nova que role sem
estar lá reprova.

### O estado da régua depois da cura, com os quatro na mesa

```
CORTE (não é barra, `overflow:hidden` esconde calado): 3
  02-controles.html: DIV.corpo-cx 267>0
  03-gatilhos.html: DIV.rot-l2-3 no-topo 16>0
  04-iluminacao.html: DIV.moldura 153>144
REPROVA: 2 aba(s) com barra de rolagem:
  07-lancadores.html: DIV.miolo 627>564
  09-sistema.html: DIV.miolo 866>564
```

**A `DIV.moldura 153>144` da `04` fica no relato de propósito**: ela esconde 9px
de desenho do controle, e isso pode ser dívida. Não é barra, então não reprova —
mas quem for medir a Iluminação encontra o número em vez de o descobrir de novo.

### O que a segunda volta herda

As duas que sobram **não têm blocos L2/R2 a dobrar**, então a proposta dela não
se aplica: a cura de cada uma sai da medição própria. O instrumento é o mesmo
(`scripts/ensaios/a_janela_cabe_no_que_ela_ve.py`, com `--dentro` para a lista
de filhos com altura), e o teto é o mesmo: **564 px de `.miolo`**.

**CORREÇÃO DE FATO, 09/09/2026:** esta linha dizia `--dentro --alvo=<seletor>`,
e **o `--alvo` não faz nada**. `medir()` grava `window.__hef_alvo`, mas a JS de
`LER` usa `j.querySelector('.ctrl') || j.querySelector('.miolo')` e nunca lê a
variável. `--dentro` sozinho funciona, e nas duas abas desta volta ele cai no
`.miolo` — que era o alvo desejado. Não foi consertado aqui porque `scripts/` é
posse da TUDO-FUNCIONA-01 nesta leva; para medir mais fundo usei sonda de
rascunho, fora do repositório.

| aba | sobra | onde olhar |
| --- | --- | --- |
| `07-lancadores` | 63px | `interface/aba07.py`; os cartões dos seis lançadores e o bloco `ajustes` |
| `09-sistema` | 302px | `interface/aba09.py`; era 866 e a TELA-TRES-01 acrescentou 16 (caixa «Detalhes técnicos», 110 → 136, a pedido dela) — o estouro já existia |

---

## §8 — A SEGUNDA VOLTA FECHOU — 09/09/2026, e as duas causas eram diferentes

A `63px` da tabela acima virou **104** durante a própria medição: a `07` cresceu sozinha
durante a sessão. É esse fato que decide as duas curas, e elas não são a mesma.

### `09-sistema` — a caixa mandava na fileira, e o número certo já estava escrito

`.avancado` fechava em **438px** onde a lista dos quatro botões pede **136**: os
302px que estouravam eram a caixa «Detalhes técnicos» **arrastando a fileira do
grid**. O comentário do arquivo já prometia o contrário — *"a altura do irmão
CHEGA aqui sozinha"* —, e a promessa valia no Chrome, com as quatro linhas de
registro do desenho. Com o daemon vivo o registro tem dezenas de linhas, e
`white-space:pre` não quebra nenhuma.

A cura são duas linhas em `interface/aba09.py`: `.col-log{position:relative}` e
`.col-log > .log{position:absolute;inset:0}`. **Um filho absoluto não conta para
o tamanho do pai**, então a fileira volta a ser medida pela `.lista`. Medido:
`.avancado` 438 → **136**, `.miolo` 866 → **564**. A página fecha em 530 de
conteúdo para 530 de espaço útil — o par `ALTURA, MIOLO_H` que o topo do arquivo
declara desde 06/09. *O número já estava certo; faltava a caixa obedecer a ele.*

`max-height:136px` seria a segunda verdade sobre a altura da lista, que é
exatamente o que aquele comentário proíbe.

### `07-lancadores` — o conteúdo não tem teto, e por isso ganhou rede

A grade foi de **493 a 534px sozinha**, em meia hora da mesma sessão, quando o
cartão da Steam saiu de «CHEGAM» para «NÃO CHEGAM» com um jogo pendente. A lista
de pendências tem o tamanho que os jogos dela tiverem, e «Adicionar novo
Lançador» cria cartão. *Quantos lançadores ela tem, e quantos jogos com
pendência, é dela — e a caixa não pode crescer com eles*: é a frase que já
declara o `DIV.rolo` da `10-perfis`, e a cura é a mesma. O `.quadro` vira
`estica`, a GRADE rola, e o que fica pregado é o que ela precisa ler sem rolar —
o título, a conta e os três botões. Hoje o inverso acontecia.

**TRÊS ARRANJOS MEDIDOS QUE NÃO SERVIRAM**, para ninguém os repetir:

| arranjo | `.miolo` | por quê |
| --- | --- | --- |
| **três colunas** | **669** (era 627) | a coluna estreita quebra a prosa em mais linhas do que a fileira que se poupa |
| **o caminho numa linha só** (`<code>` com reticências) | **668** | `display:inline-block` joga o `<code>` para uma linha de caixa própria |
| botões à direita da prosa **+** a fileira de botões subindo para o título | 592 | 28px acima — e sem teto, quebra de novo amanhã |

### A largura maximizada, que é como ela viu — e que nunca foi a cura

A §2 pedia as duas larguras. Com a janela do piloto em 1900 (a `.janela` bate no
teto de `min(100%,1600px)`, `.miolo` 1598), **sem** a cura: `07` fecha em
**636>564** e `09` em **866>564**. A barra estava lá maximizada também. E a
largura maior tira só **32px** da `07` (668 → 636): a prosa quebra menos, e não
o bastante. Com a cura, as duas em 564/564 nas duas pontas.

### E a coluna da direita saía pela borda — defeito ANTERIOR a esta sprint

A foto do ANTES mostra o cartão da direita cortado ao meio, sem borda. `1fr` é
`minmax(auto,1fr)`, e o mínimo `auto` de uma coluna de grade é o **min-content**
do que há dentro: o caminho do lançador num `<code>` não tem espaço onde quebrar
e mede ~470px. `repeat(2,minmax(0,1fr))` mais `overflow-wrap:anywhere` no
`<code>` — as duas juntas, porque sem a segunda o caminho vazaria do cartão em
vez de vazar da grade.

### O que a prosa do cartão ainda custa, e é de outro dono

*"Achei este lançador aqui (`/home/…/net.lutris.Lutris.desktop`)"* nasce em
`interface/desenho_dos_lancadores.py`, que não está na posse desta sprint. O
caminho absoluto é o que leva o cartão de 2 para 4 linhas; se ele virasse dica
(`title`) em vez de prosa, a grade cairia ~90px de uma vez. Relatado, não
editado.
