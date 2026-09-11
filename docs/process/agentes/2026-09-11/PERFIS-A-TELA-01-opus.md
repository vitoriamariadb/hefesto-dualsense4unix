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

**E ISSO EXPLICA A DIFERENÇA ENTRE AS DUAS FOTOS que NÃO é o meu conserto:** na
foto do ANTES a coluna «Perfis Salvos» aparece estreita e a «Definições» larga.
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

* antes: `perfis_vivos.py --oculta --segundos 6 --foto` — com o quadro Modo, as
  linhas apertadas em 21px, e a marcação vazada da bancada;
* depois: as mesmas quatro linhas, sem o quadro, a 31,25px, alinhadas, e o
  rótulo em texto.

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
4. **`perfis_web.MODO_DO_PERFIL` perdeu um dos dois leitores.** Com o
   `editor_modo` fora, quem lê o dicionário é só o `_pacote_do_editor` e a aba
   Jogar. Se a Jogar não o usar, ele vira tabela sem leitor — não medi a Jogar.
5. **A foto é dela.** PROVA-DE-TELA-01: a palavra final é o olho dela sobre as
   duas fotos.
