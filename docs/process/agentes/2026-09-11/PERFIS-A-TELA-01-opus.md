# PERFIS-A-TELA-01 — as linhas que quebram, e o Modo que não é daqui

**Árvore:** `hefesto-voo/PERFIS-A-TELA-01-opus`, branch `voo/PERFIS-A-TELA-01-opus`,
nascida de `onda/0911` (`779c71f8`).

**As duas queixas dela, 11/09/2026:**

> *"em perfis as linhas dos controles e ajustes proprios quebram."* <!-- noqa-acento: citação literal dela -->

> *"em perfis ainda aparece modo. Isso deve aparecer só na aba jogar."*

**AS DUAS ERAM UMA — e mais uma terceira que ninguém tinha visto.** A hipótese da
sprint estava certa e a medição a confirmou com número; o que ela não previa é
que a cura da primeira **agravava** a segunda, e que o instrumento com que eu ia
fotografar a tela mentia sobre o produto.

---

## O que mudou

### 1. A MEDIÇÃO, primeiro — e ela é o pedido 1 da §4 da sprint

No `WebKit2.WebView`, janela OCULTA (`Gtk.OffscreenWindow`), a 1212x809, com a
tabela pintada **como o produto a pinta** (os dois lugares sem controle com a
classe `fora` e o travessão no ID) e não como o desenho a congela:

| estado | o quadro tem | as 4 linhas pedem | sobra | rola | a última linha |
| --- | --- | --- | --- | --- | --- |
| **ANTES**, sem a tira | 115px | 107px | **+8** | 0 | inteira (21,25px) |
| **ANTES**, com a tira acesa | 78px | 107px | **−29** | **36px** | **−15px: FORA** |
| **DEPOIS**, sem a tira | 155px | 107px | +48 | 0 | inteira (31,25px) |
| **DEPOIS**, com a tira acesa | 118px | 107px | **+11** | 0 | inteira (22px) |

A fileira do Modo custava **36px**. A tira do desfecho (`.desfecho.on`) come
**37** quando acende — e ela acende **a cada gesto dela, por 30 segundos**. Era
nesses 30 segundos que a tabela rolava e o P4 saía do quadro. **As duas queixas
eram uma:** os 36px do Modo eram exatamente os 37 que a tira pede.

`height:100%` na tabela ESTICA as quatro linhas, então o `scrollHeight` dela
responde *"quanto receberam"*, não *"quanto pedem"*. Os 107px saem de tirar o
esticão, medir, e devolver — é a diferença entre medir o desenho e medir a
necessidade.

### 2. O QUADRO «MODO» SAIU do editor de Perfis

O que morreu junto, e por quê — um gesto que nenhum clique alcança é o *campo
morto com nome de promessa*:

| o que | onde |
| --- | --- |
| a fileira dos quatro botões e a regra de CSS dela | `interface/aba10.py` |
| `botoes_do_modo()`, `MODOS` e o leitor `_lista_de_pares` | `interface/aba10.py` |
| o gesto `editor_modo` | `pacotes/a10_perfis.py` |
| `PISO_DA_ABA` 14 → **13** (a única queda que esse número já teve) | `pacotes/a10_perfis.py` |
| `editor.modo` sai de `SEM_ECO` e entra em `SEM_ENDERECO`, com a razão | `pacotes/a10_perfis.py` |
| a legenda passa a dizer que ele saiu e para onde foi | `interface/aba10.py` |

**O QUE NÃO MORREU, e é o ponto:** `Profile.mode` continua no esquema, no disco
e no `ativar`. Um perfil que já diz «Jogar pelo Hefesto» continua dizendo. O
dono compartilhado da regra (`pacotes/perfil.secao_do_modo` e
`gravar_o_modo_no_ativo`) nunca foi da aba 10 e fica de pé — é por ele que a aba
Jogar escreve.

**A CHAVE CONTINUA SENDO EMITIDA pelo dono do dado.** `perfis_web.
_pacote_do_editor` publica `modo` porque o perfil continua guardando, e
`perfis_web` não é desta aba. Quem decide o que a tela mostra é a tela: a aba 10
DECLARA a chave em `SEM_ENDERECO`. Sem a declaração ela cairia no vazio calada,
que é o defeito que aquela lista existe para nomear.

### 3. A DECISÃO QUE A SAÍDA DO QUADRO OBRIGOU — §3 da sprint

**O perfil novo nasce SEM a seção `mode`** — «Não mexer no modo», o perfil sem
opinião. Registrada na docstring de `a10_perfis.novo` e amarrada por régua.

A razão: é o único valor que **preserva o comportamento de hoje**. Antes de
06/09 o campo não era alcançável por esta tela e todo perfil nascia assim; nos
cinco dias em que o quadro existiu, quem não o tocou continuou nascendo assim.
Qualquer outro padrão faria um perfil recém-criado passar a MEXER no modo da
máquina dela sem ninguém ter pedido — a cicatriz do `or "xbox"` do Salvar da
janela estável (ESCOLHA-DELA-VENCE-01/E1).

### 4. O DEFEITO QUE A SPRINT NÃO PREVIA, e ele é a SEGUNDA metade da queixa 1

`.gd-nome` era `display:flex;align-items:center;gap:8px`. **Um `<td>` com
`display:flex` deixa de ser célula de tabela** — e perde o
`vertical-align:middle` que as outras duas colunas têm de graça. O texto do nome
pousa no TOPO da linha enquanto o glifo e o ID se centram nela.

**E o flex não repartia nada.** Os filhos do `<td>` são dois: a barra da cor
(`.pl`, que é `position:absolute`, logo FORA do fluxo) e o `<span>` do nome.
Sobrava UM item de flex, e um `gap:8px` entre um item só e ninguém. O respiro à
esquerda sempre foi o `padding:1px 8px` do `<td>`.

O espalhamento vertical entre os centros de texto das três colunas da mesma
linha, medido no WebKit:

| | espalhamento |
| --- | --- |
| linhas apertadas (21,25px — com o quadro Modo ainda lá) | **3,13px** |
| linhas soltas (31,25px — com o Modo já fora) | **8,13px** |
| com `vertical-align:middle` | **1,50px** |

**A SEGUNDA LINHA É O ACHADO:** *tirar o Modo devolve altura às linhas, e a
altura ESCANCARA o desalinho.* Curar só a queixa que ela nomeou teria levado o
desalinho de 3,13 para 8,13px — a cura de uma queixa dela **agravando a outra,
na mesma tela**. As duas fecham juntas ou nenhuma fecha.

O 1,50px que sobra é o glifo, não o texto: o `.gls` é SVG com
`vertical-align:-3px` (o deslocamento ótico da coluna do meio). O nome fecha
EXATO com o ID da peça — 16,13 contra 16,13.

### 5. O INSTRUMENTO MENTIA — e ele é a bancada desta aba

**Achado ao tirar a foto do ANTES.** `interface/perfis_vivos.py --oculta --foto`
mostrava, nas quatro linhas da tabela, o texto literal:

```
P1 <span class="pt">•</span> Não sei <span class="pt">•</span> cabo
```

A causa: `mesa_de_agora` punha em `rotulo` a saída de `monta.rotulo(c, "curta")`,
que é **marcação** (o separador dele é `' <span class="pt">•</span> '`), e quem
pinta a tabela escreve `textContent` — de propósito, porque nome de controle é
dado que não atravessa a fronteira como HTML.

**E O PRODUTO NÃO FAZ ISSO.** Medido chamando `a10_perfis.pacote()` com perfis
de mentira num diretório temporário: ele emite `["P1 • Cosmic Red • USB",
"P2 • — • BT", "P3 • Desconectado", "P4 • Desconectado"]` — texto, pelo
`_mesa_com_rotulo` → `_rotulo_curto`. **A bancada era a única superfície com o
defeito**, e quem olhasse a foto concluiria que a tela dela está quebrada de um
jeito que ela não está. É a assinatura que esta casa já nomeou: *o instrumento
respondia sobre outra coisa que não o produto.*

Curado perguntando ao dono (`a10_perfis._rotulo_curto`), e não reescrevendo a
junção na bancada — uma terceira gramática do mesmo rótulo é o que esta casa
paga mais caro.

**FATO ERRADO, SUBSTITUÍDO:** a docstring de `a10_perfis._mesa_com_rotulo`
dizia *"QUEM JÁ FAZIA ISTO CERTO: `interface/perfis_vivos.mesa_de_agora`"*. Ele
fazia o CONTRÁRIO. A frase foi reescrita com a medição.

**E ISSO EXPLICAVA A DIFERENÇA ENTRE O PRIMEIRO PAR DE FOTOS que NÃO era o meu
conserto** — no par refeito pelo reparo ela não aparece mais, porque o ANTES foi
fotografado com o instrumento já curado: na foto do ANTES original a coluna
«Perfis Salvos» aparecia estreita e a «Definições» larga.
Era o texto com marcação, que é longo e `nowrap`, esticando a coluna da direita.
Medido nas páginas estáticas, a grade `1fr 1fr` dá **562,5px / 562,5px** ANTES e
DEPOIS, e no publicado de ontem também. **Nenhuma proporção do desenho dela
mudou nesta leva.**

### 6. Publicado

`scripts/check_o_desenho_aprovado.py --publicar 10` → `mockup/10-perfis.html` e
`interface/paginas/10-perfis.html` byte-idênticos. **Sem isso a tela dela não
muda e a queixa volta.**

### 7. Os dois portões que a leva acendeu, e o que cada um cobrava

* **`nada-aponta-para-a-janela`** — o ensaio novo importa
  `gui.ponte_da_tela.JanelaDaAba`, e isso conta como citação NOVA para a janela
  GTK que está sendo aposentada (`D-0609-GTK-LEVA-INTEIRA`). O portão está
  certo: o que se reusa é o MOTOR, não a janela. Declarado em
  `docs/data/o-que-ainda-aponta-para-a-janela.csv` com o veredito
  `MOTOR-MUDA-DE-CASA`, que é o mesmo dos outros dois ensaios que já o importam.
* **`acentuacao`** — um identificador de JavaScript com o ordinal em português
  sem acento, dentro do roteiro. Renomeado para `quarta`, que além de passar é
  mais exato: o desenho tem QUATRO lugares, sempre. **E ele acendeu DUAS vezes:**
  o comentário que escrevi para explicar a renomeação CITAVA a palavra proibida,
  e virou a segunda ocorrência dela. É a armadilha de PROSA desta casa — *um
  aviso que descreve o padrão proibido vira a primeira ocorrência dele* —
  mordendo pela segunda vez na mesma leva, depois de eu já a ter evitado no
  comentário do CSS.

### 8. O ensaio de 06/09 que morreu com o assunto

`scripts/ensaios/o_quadro_do_modo_grava_pelo_webkit.py` clicava os quatro
botões do quadro no WebKit e lia o `.json` do outro lado. Sem o quadro ele só
sabe falhar. Saiu, e o ponteiro em `interface/jogar_vivo.py` que o citava foi
reapontado para o ensaio novo — que existe pela MESMA razão (a bancada à frente
do produto, medida no motor que ela usa).

---

## Qual mordida prova

### MORDIDA A — devolvi o quadro «Modo» e a tabela quebrou de novo

O `aba10.py` do `HEAD` regerado para uma bancada temporária (`HEFESTO_BANCADA`,
sem tocar a bancada dela), medido pelo ensaio novo:

```
REPROVA:
  - o quadro «Modo» voltou ao editor — ele saiu por ordem dela em 11/09/2026, e
    era a fileira dele (36px) que tirava a linha do P4 do quadro sempre que a
    tira acendia
  - sem a tira: as três colunas de uma linha desalinham 3.13px (o teto é 2.0)
  - com a tira acesa: o quadro tem 78px e as quatro linhas pedem 107px —
    faltam 29px
  - com a tira acesa: a tabela rola 36px dentro do quadro, e a última linha
    aparece -15px
bancada · sem a tira : quadro 115px · pedem 107px · sobra 8  · linha 21.25px · desalinho [2.13, 3.13, 3.13, 3.13]
bancada · com a tira : quadro  78px · pedem 107px · sobra -29 · linha 21px   · desalinho [2, 3, 3, 3]
```

Devolvida a cura:

```
bancada · sem a tira : quadro 155px · pedem 107px · sobra 48 · rola 0 · linha 31.25px · desalinho [1.5, 1.5, 1.5, 1.5]
bancada · com a tira : quadro 118px · pedem 107px · sobra 11 · rola 0 · linha 22px   · desalinho [1.5, 1.5, 1.5, 1.5]

OK: as quatro linhas cabem nos dois estados, e as três colunas alinham.
```

O mesmo na página **publicada**: `rc=0`, os mesmos números.

### MORDIDA B — arranquei SÓ a cura do alinhamento, com o Modo já fora

Ela existe para **separar as duas curas**: sem ela alguém poderia crer que tirar
o Modo bastava.

```
REPROVA:
  - sem a tira: as três colunas de uma linha desalinham 8.13px (o teto é 2.0)
  - com a tira acesa: as três colunas desalinham 3.5px
bancada · sem a tira : quadro 155px · pedem 107px · sobra 48 · linha 31.25px · desalinho [7.13, 8.13, 8.13, 8.13]
```

**8,13px — o número que o §4 previa.** A cura da queixa dela sobre a altura
piorou a queixa dela sobre o alinhamento, exatamente como a medição disse.

### MORDIDA C — as réguas invertidas do `aba10._conferir`

A página de ontem (com o quadro) lida pelo `_conferir` de hoje. As sete
reprovam, uma por caminho de volta:

```
ERRO em 10-perfis — decisão dela desfeita:
  - o quadro Modo voltou ao editor de Perfis — ele sai por ordem dela de 11/09/2026…
  - um botão desta aba voltou a carregar `data-modo`…
  - o endereço `editor.modo` voltou à página…
  - a regra `.campo.modo` voltou ao CSS…
  - a legenda parou de dizer que o quadro Modo saiu e onde ele mora…
  - o `<td>` do nome voltou a `display:flex`…
  - o `<td>` do nome perdeu o `vertical-align:middle`…
```

A página de hoje: `PASSOU — a régua não mordeu` (`rc=0`).

### A ARMADILHA QUE ESTA LEVA QUASE REPETIU, e é de PROSA

O primeiro texto que escrevi para o comentário do CSS dizia *"saíram as três
regras `.campo.modo`"*. **Um comentário CSS viaja INTEIRO para dentro do HTML** —
o aviso teria virado a primeira ocorrência do padrão que a régua de baixo
proíbe, e a régua reprovaria a própria explicação. É a mesma armadilha que esta
casa pagou três vezes em três dias. O seletor não se escreve naquele comentário,
e a razão está escrita lá.

### As duas fotos, `--oculta` nas duas

**AS DUAS FORAM REFEITAS NO REPARO, e as primeiras não serviam** — elas
mostravam a tira do desfecho APAGADA, que é o estado em que a tabela já cabia.
O par que vale está descrito no achado 5 de `## O reparo de 11/09`.

Os PNG ficaram no scratchpad da sessão (`/tmp/claude-1000/…/scratchpad/w/`,
`ANTES-piloto.png` e `DEPOIS-piloto.png`) — **a palavra final é dela**, e esta
entrega não a substitui.

---

## O que NÃO verifiquei

* **A TELA DELA, com o produto instalado.** Tudo foi medido na árvore desta
  worktree, em `Gtk.OffscreenWindow`/Xvfb. O `install.sh` não foi rodado (e não
  podia ser: ela está usando a máquina).
* **A janela ARRASTADA.** A conta fecha a 1212x809, o tamanho do desenho. A
  altura da `.janela` é fixa (`--alt-janela:777px`), então encurtar a janela não
  muda o miolo; a LARGURA eu não remedi aqui — a sobra com a tira acesa é de
  **+11px**, e uma janela muito mais estreita não foi medida.
* **O `ativar` aplicando o `mode` no daemon.** Provei que o campo SOBREVIVE no
  disco aos gestos que ficaram, não que o daemon o executa. Isso é bancada, e a
  bancada não foi usada nesta sprint (`bancada: false`).
* **A aba Jogar.** Não é minha e não foi tocada. Que o modo *"apareça só na aba
  jogar"* depende de a Jogar já o oferecer — eu verifiquei que o DONO da regra
  (`pacotes/perfil.secao_do_modo`) está de pé, não que a Jogar tem os quatro
  botões desenhados.
* **A suíte inteira.** Rodei os arquivos do meu escopo, não os doze lotes.
* **Nenhuma célula de `docs/data/mapa-controles.csv` foi exercitada.** Esta
  sprint é de tela; não há canal, report id nem transporte a relatar.

---

## O que sobrou para o próximo

1. **`.perfis{grid-template-columns:1fr 1fr}` é `minmax(auto,1fr)`**, e a coluna
   cresce com o MIN-CONTENT do que está dentro. Hoje isso não morde no produto
   (medido: 562,5/562,5), mas **o nome de perfil é dado DELA e vive na coluna da
   esquerda**. É a mesma armadilha que o `.campo` já curou com `minmax(0,1fr)`
   em 06/09. Não toquei: mudar a grade do quadro é mexer no desenho dela sem
   sprint que responda por isso.
2. **O vocabulário do transporte discorda dentro da mesma tela.** Na foto, o
   chip do topo diz `P1 • Cosmic Red • USB` e a tabela de baixo diz
   `P1 • Não sei • cabo` — `monta.rotulo` usa a palavra do desenho e
   `_rotulo_curto` usa o `via` que `mesa_viva.mesa_do_estado` publica. É
   trabalho da `A-PALAVRA-MESA-SAI-01`, e o `monta.MESA` já declara isso.
3. **O ensaio novo não tem chamador automático.** `scripts/ensaios/
   a_tabela_do_perfil_cabe_com_a_tira.py` roda à mão. Pô-lo na lista de portões
   exige mexer em `scripts/portoes.sh` **e** no `ci.yml` (o portão do portão
   compara os dois), e isso é colisão garantida numa leva com seis frentes. Fica
   para quem costurar.
4. **FATO ERRADO, SUBSTITUÍDO — `perfis_web.MODO_DO_PERFIL` perdeu os DOIS.**
   Aqui estava escrito *"quem lê o dicionário é só o `_pacote_do_editor` e a
   aba Jogar"*. **Nenhum dos dois lia.** O `_pacote_do_editor` publica o `kind`
   cru, e a aba Jogar tem léxico próprio (`jogar/painel._ROTULO_DO_MODO`, que é
   `home_actions._MODE_ITEMS`). A cópia morreu no reparo, com a lápide — ver
   `## O reparo de 11/09`, achado 4.
5. **A foto é dela.** PROVA-DE-TELA-01: a palavra final é o olho dela sobre as
   duas fotos.

---

## O reparo de 11/09

A entrega voltou do conferente adversarial com **cinco achados**. Os cinco
fecharam, e a ordem dela — *"em perfis ainda aparece modo. Isso deve aparecer só
na aba jogar."* — não foi desfeita em nenhum deles: o quadro «Modo» continua
fora do editor de Perfis.

**O QUE ATRAVESSA TRÊS DOS CINCO, e é uma frase só:** *a retirada foi bem feita
e a PROSA em volta dela ficou descrevendo o mundo de ontem.* A legenda, a linha
384 do CSV da paridade e o comentário do `MODO_DO_PERFIL` — os três afirmavam um
mundo em que o quadro ainda existia ou em que outra tela o substituía. Nenhum
deles é código; todos os três passavam por portão verde.

### 1 · A LEGENDA MENTIA, e a régua nova exigia a mentira

**O que estava escrito** (`aba10.py:1570`, publicado em
`paginas/10-perfis.html:2353`):

> O que o perfil já guarda continua guardado: **quem o escolhe é a Jogar.**

**Medido, e é falso:** `pacotes/perfil.gravar_o_modo_no_ativo:453` resolve o
alvo por `nome_do_ativo(state)`, logo a aba Jogar escreve a seção `mode` **só do
perfil que está VALENDO**. Para um perfil que ela seleciona na lista e não
ativou, tela nenhuma escolhe modo. E os quatro gestos que alimentam aquele
escritor (`a01_jogar.py:2134`, `:2266`, `:2286`, `:2390`) passam
`gamepad`/`native`/`desktop` — **nunca `"none"`**.

**O que passou a estar escrito:**

> O que este perfil já guarda continua guardado — nenhum botão desta aba mexe
> nisso. **Quem escreve o modo é a Jogar, e ela escreve no perfil que está
> valendo.**

A frase diz o ALCANCE e para no fato. **O que ela NÃO diz é o que falta**, e
isso é decisão dela de 07/09: *"o layout não informa os nossos defeitos"*. A
falta está declarada no mapa da paridade e no código — não na tela.

**A régua virou junto** (`aba10._conferir`): a exigência que existia cobrava só
que a legenda nomeasse o quadro. Agora ela cobra o alcance escrito e **proíbe a
frase larga de voltar**.

**A MORDIDA:** devolvi a redação antiga e regerei numa bancada temporária
(`HEFESTO_BANCADA`, sem tocar a bancada dela):

```
ERRO em 10-perfis — decisão dela desfeita:
  - a legenda perdeu o ALCANCE do que a aba Jogar escreve — sem ele a frase
    promete que a Jogar escolhe o modo de QUALQUER perfil, e o escritor
    (`pacotes/perfil.gravar_o_modo_no_ativo`) só alcança o perfil ativo
  - a frase larga voltou à legenda — ela afirma que a Jogar escolhe o modo de
    qualquer perfil, e a Jogar grava só no que está valendo
```

Devolvida a redação certa: `rc=0`, e `--publicar 10` levou a frase à página.

### 2 · A PERDA DE CAPACIDADE, declarada nos três lugares onde se lê

Com o `editor_modo` fora e a janela GTK aposentada
(`D-0609-GTK-LEVA-INTEIRA`), **não sobrou nenhum caminho de interface que
escreva `Profile.mode` de um perfil que não está ativo** — e «Não mexer no modo»
ficou inalcançável para qualquer perfil que já tenha seção.

| a janela GTK fazia | quem faz hoje |
| --- | --- |
| escrever `mode` de qualquer perfil | **ninguém** — o escritor resolve por `nome_do_ativo(state)` |
| remover a seção («Não mexer no modo») | **ninguém** — nenhum chamador passa `"none"` a `secao_do_modo` |

**O CUSTO:** trocar o modo de um perfil exige **ativá-lo antes**; apagar a seção
não tem caminho de tela.

Declarado em três lugares, e cada um por um motivo:

* **`interface/pacotes/perfil.py`**, no docstring de `gravar_o_modo_no_ativo` —
  é onde a próxima pessoa que mexer no escritor lê;
* **a sprint**, §3.1 nova — ela dizia *"o que muda é quem EDITA"*, e isso estava
  certo pela metade;
* **`docs/data/paridade-gtk-html.csv:384`** — é o mapa, e é o lugar da dívida.

**O quadro NÃO foi reinventado em outro canto da aba.** A pergunta que sobra é
dela e está escrita em uma frase na §5 da sprint.

### 3 · O MAPA DESCREVIA O MUNDO DE ONTEM, e o portão estava cego por PROSA

A linha 384 dizia `veredito=DIFERENTE`, `sinal=editor_modo`,
`sinal_espera=PRESENTE`, e apontava `a10_perfis.py:2442` e `aba10.py:885` — os
dois endereços mortos desde o commit anterior. **`check_paridade_gtk_html.py`
dava `rc=0`** porque a regra `sinal-sumiu` usa `ocorre` (que conta PROSA de
propósito, por 82 linhas legítimas), e o único `editor_modo` que restava era a
**lápide em comentário** de `a10_perfis.py:2509`. É a armadilha
`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA` mordendo do lado de dentro da régua.

A linha foi remedida para o mundo de hoje:

| campo | era | é |
| --- | --- | --- |
| `veredito` | `DIFERENTE` | **`FALTA_NO_HTML`** |
| `sinal` | `editor_modo` (símbolo do lado HTML) | **`_mode_section_from_editor`** (símbolo da GTK) |
| `sinal_espera` | `PRESENTE` | **`AUSENTE`** |
| `sinal_escopo` | `a10_perfis.py` | **`LADO-HTML`** |
| `html_onde` | dois endereços mortos | `perfil.py:453` · `perfis_web.py:504` · `a10_perfis.py:565` |
| `html_faz` | *"Quadro Modo com as MESMAS quatro escolhas"* | o que sobrou, com os dois limites medidos |

**A troca do sinal não é cosmética, e é o que tira a cegueira:** com
`sinal_espera=AUSENTE` quem lê passa a ser a regra `divida-fechada`, que usa
`usa()` — e `usa()` **não conta comentário nem docstring**. O meu próprio
docstring novo em `perfil.py` cita `_mode_section_from_editor` e a régua o
ignora, como deve.

**A MORDIDA:** simulei a dívida fechando — uma linha de código real (não prosa)
no lado HTML referenciando o símbolo:

```
divida-fechada: paridade-gtk-html.csv:384  [10-perfis] A seção "Modo" do perfil…
    o sinal '_mode_section_from_editor' APARECEU em …/pacotes/a10_perfis.py.
    O CSV diz FALTA_NO_HTML e o lado HTML passou a ter o símbolo.
```

Arrancada a mordida, `rc=0`. **E o portão mordeu sozinho no caminho**: a regra
`numero-publicado` reprovou a tabela de `2026-09-03-O-TERCEIRO-NUMERO` no mesmo
instante em que o veredito mudou — `10-perfis` 20/7 → **19/8**, `TODAS` 160/29 →
**159/30**, com a paridade intacta em 28% e 36%. A tabela foi atualizada.

### 4 · `MODO_DO_PERFIL` era peça sem chamador — saiu com a lápide

`perfis_web.MODO_DO_PERFIL` era `dict(profiles_actions._MODE_KIND_ITEMS)`: os
quatro rótulos servidos à página por `id → rótulo`. **Quem o consumia era o
quadro**, e o quadro saiu. Medido depois disso: `grep` em `src/` acha só a
definição; os únicos leitores eram **asserções de teste**.

**A afirmação que caiu é minha, do relatório anterior:** eu escrevi que a aba
Jogar seria a segunda leitora. Ela não é — a Jogar tem léxico próprio
(`jogar/painel._ROTULO_DO_MODO`, que é `home_actions._MODE_ITEMS`, a MESMA
frase-dona alcançada por outro caminho). **Nada se perdeu com a morte da cópia.**

O comentário de sete linhas acima dela também afirmava o consumidor apagado
(*"quem consome é a página, por `id → rótulo`"*). Os dois saíram juntos, e no
lugar ficou a lápide com a medição. O `import` de `_MODE_KIND_ITEMS` saiu com
eles.

**O QUE NÃO FIZ, e é a escolha que importa:** derivar `MODO_SEM_OPINIAO` de
`next(iter(...))` do dono daria um chamador ao dicionário e teria sido a cura
preguiçosa. Ela **desligaria a régua**: uma reordenação da lista do dono trocaria
em silêncio o id com que `secao_do_modo` REMOVE a seção, e o teste passaria a se
medir contra a própria saída. O literal fica, e a razão está escrita ao lado
dele.

A régua mudou de alvo em vez de morrer:
`test_os_quatro_rotulos_continuam_vindo_do_dono` virou
`test_o_perfil_sem_opiniao_e_o_primeiro_par_do_dono` e pergunta ao DONO.

**A MORDIDA:** movi `("none", "Não mexer no modo")` para o fim de
`_MODE_KIND_ITEMS` —

```
AssertionError: «Não mexer no modo» deixou de ser o primeiro par do dono …
assert 'desktop' == 'none'
```

— e devolvi. Os 11 testes do arquivo, verdes.

### 5 · AS FOTOS AGORA MOSTRAM O DEFEITO DELA

As duas primeiras não serviam: na `ANTES-piloto.png` a tira do desfecho estava
**apagada**, que é justamente o estado em que a tabela já cabia. A queixa dela é
o outro estado — o que dura **30 segundos a cada gesto**.

O par novo, no piloto, `--oculta` nas duas, com a tira **acesa** nas duas:

| | `ANTES-tira-acesa.png` | `DEPOIS-tira-acesa.png` |
| --- | --- | --- |
| a tira | acesa — *"Perfil salvo: Mortal Kombat"* | acesa, a mesma |
| o quadro «Modo» | presente, a fileira de quatro botões | fora |
| a tabela | **rola 36px**, P3 cortada ao meio, **P4 invisível** | as quatro linhas inteiras |
| o quadro tem / as linhas pedem | 78px / 107px — **faltam 29** | 118px / 107px — **sobram 11** |
| desalinho das três colunas | até 3,13px | 1,50px |

Os números saem do ensaio versionado, rodado nas duas páginas:

```
bancada  · com a tira : quadro  78px · pedem 107px · sobra -29 · rola 36 · linha 21px    ← ANTES
publicada· com a tira : quadro 118px · pedem 107px · sobra  11 · rola  0 · linha 22px    ← HOJE
```

Os PNG estão no scratchpad da sessão (`…/scratchpad/w/ANTES-tira-acesa.png` e
`DEPOIS-tira-acesa.png`). **A palavra final continua sendo dela**
(PROVA-DE-TELA-01).

### O que este reparo NÃO tocou

* **A aba Jogar.** Continua não sendo desta sprint. O que foi feito nela é
  **medir**, não mexer: os quatro gestos foram lidos para saber o alcance real
  do que a legenda promete.
* **O quadro, em qualquer outro canto.** A ordem dela é clara; a falta foi
  declarada, não remendada.
* **A tela dela, instalada.** Nada foi instalado e o daemon não foi reiniciado.
* **A suíte inteira.** Rodei os arquivos do escopo; os doze lotes são de quem
  costura.
