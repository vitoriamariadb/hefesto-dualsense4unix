# A lista dela — o mockup vai ser CONCLUÍDO antes de virar interface

**31/08/2026, 20h.** Palavra dela, e ela reorienta tudo:

> *"primeiro **nunca terminamos o mockup**, por isso não era pra ser feito no
> layout final. **Vamos concluir lá e depois seguimos pra interface.**"*
>
> *"não é pra vc fazer. faz uma to do list pro claude e pra ele ir fazendo ponto
> a ponto comigo. Eu ir dando o ok quando ele terminar nos mockups e ele ir me
> mostrando a to do list atualizada. (…) sem usar agentes e usando o navegador."*

## A LISTA FECHOU — 01/09/2026

**As dez abas e os três avulsos estão no produto.** `mockup/` e `layout/` batem
byte a byte, e o `check_o_desenho_aprovado.py` guarda isso a cada rodada: o
desenho aprovado virou a referência contra a qual a interface vai ser medida.

| | |
|---|---|
| abas fechadas com ela | **10 de 10** |
| páginas publicadas | **13** (as dez, os dois mapas e a calibração) |
| régua de alinhamento | **0 falhas nas dez** |
| rolagem | nenhuma aba rola, nem vertical nem lateral |
| portões | 23 verdes |

**O `Selecionar:` fechou o último ponto aberto** (o 8.1): a fita das dez deixou
de dizer *"Ajustes vão para:"*. O rótulo agora tem dono único — `monta.ROTULO_DA_FITA`.

**O que vem depois está em**
`docs/process/sprints/2026-08-31-A-INTERFACE-LIGADA-PLANO-DE-UMA-HORA.md`, e ela
decidiu em 01/09 que **não vai por agentes**: *"se vc achar melhor, ao invés de
agentes, você mesmo vai conectando tudo aba a aba."* A razão é medida — o plano
foi escrito ANTES da leva que mudou as dez abas, e os pilotos que os agentes
leriam apontam endereços que essa leva moveu.

---

## AS QUATRO REGRAS DELA

1. **UM ponto por vez.** Termine, mostre, **espere o OK dela**. Só então o próximo.
2. **SEM AGENTES.** Trabalho de quem conversa com ela. Despachar agente aqui é
   desobedecer uma ordem direta.
3. **COM O NAVEGADOR.** Abra, olhe, clique, meça. `cd layout/_ferramentas &&
   python3 olhar.py NN-*.html` fotografa em Chrome headless — **e a foto é para
   VOCÊ ler**, não só para gerar. **Nunca abra janela na frente dela: ela tem
   UMA tela.**
4. **A cada ponto entregue, mostre ESTA LISTA atualizada.** Marque `[x]` só
   depois do OK **dela**, nunca depois do seu próprio verde.

## COMO O TRABALHO FLUI — decidido por ela em 31/08

```
layout/_ferramentas/abaNN.py    ← VOCÊ EDITA AQUI (os geradores ficam onde estão)
          │
          ▼  python3 abaNN.py
mockup/NN-*.html                ← O DESENHO sendo concluído. É o que ela olha.
          │
          ▼  só quando ela aprovar
layout/NN-*.html                ← publicado. É o que o produto renderiza.
```

**A direção é mockup → produto, e não o contrário.** O
`scripts/check_o_desenho_aprovado.py --aprovar` que nasceu hoje faz o inverso
(copia `layout/` → `mockup/`) e **está errado para este fluxo**.

- [x] **0. Inverter o fluxo do portão.** **APROVADO POR ELA em 31/08.**
      O `--aprovar` virou `--publicar` (`mockup/` → `layout/`), o portão passa a
      reprovar quando o **produto está atrás do desenho**, e o gerador escreve na
      **bancada**. O caminho ganhou dono único: `layout/_ferramentas/onde.py`.

      **DECISÃO DELA, 31/08:** o produto recebe **a cada aba fechada** — quando
      todos os pontos daquela aba tiverem o OK dela. Nem a cada ponto, nem só no
      fim da lista. O comando é `--publicar NN`.

      **E ela limitou o escopo, com estas palavras:** *"é só pra mexer dentro
      dos arquivos da mockup. Nada fora disso. Depois copiamos e geramos pro
      layout e afins. agora não. Só terminamos o mockup."* Então ficou de fora,
      **de propósito e para depois**: os cinco pilotos GTK, os dois portões de
      conteúdo, os três testes que leem uma aba, o `mapa.py` e o `importar.py`.
      Eles continuam lendo `layout/`, que está **congelado** — logo dão verde
      honesto sobre o que ela aprovou. Quando a lista fechar, eles mudam junto.

      **O que ficou medido:**

      | | |
      |---|---|
      | a regeração das dez | reproduz **byte a byte** o desenho aprovado |
      | o produto, depois de regerar | **intocado** — zero arquivo tocado em `layout/` |
      | a mordida | **6 formas** de quebra, todas reprovadas (ver abaixo) |
      | os portões | 23 verdes |

      **As seis mordidas** — cada uma quebra a cura de propósito e a régua acusa:
      o produto atrás sem declaração · a declaração que cura · a declaração órfã ·
      a página nova sem publicar · a página do produto sem referência no desenho ·
      o `--publicar NN` com aba que não existe (**erro**, nunca zero calado) ·
      e o `--aprovar` antigo, que agora **recusa** em vez de inverter a direção.

      **Um defeito nasceu e a régua o pegou:** `aba02.py` escrevia por
      `parent.parent`, sem a palavra `layout` — o censo por texto não o achou. Quem
      achou foi a régua da fita, com `0 chips para 5 rádios`. *Régua que acha zero
      é erro, não silêncio.*

---

# ABA POR ABA

## `01` JOGAR — **FEITA, espera o OK dela**

Ela aprovou o plano e mandou ajustar a aba, em 31/08/2026:
*"além disso aprovado o plano pode ajustar a aba jogar e me informa."*

Está tudo na **bancada** (`mockup/01-jogar.html`). O produto **não recebeu nada**
— publica com `--publicar 01` quando ela aprovar a aba inteira.

### [x] 1.1 — o Point And Click saiu da fileira

> *"nos mockups tira o point and click e deixa só o navegação."*

Cinco chips viraram **quatro**: `Sony DualSense · Xbox · Steam Input · Navegação`.
O perfil de fábrica e o `Estilo Point-and-click` da aba Navegação **continuam** —
saiu só o modo, como ela confirmou.

**A regra CSS `.degrau.sem-dono` fica de pé**, e com motivo escrito: ela é a
gramática desta casa para *"botão que aparece e diz que ainda não tem quem o
atenda"*. Apagá-la faria a próxima fileira que precisar dela reinventá-la.

### [x] 1.2 — os tooltips foram corrigidos e simplificados

> *"independente do modo, todas as features vão funcionar. Então o tooltip
> falando o contrário é sem nexo."* · *"todos os tooltips tem que ser corrigidos
> e simplificados."*

**Duas afirmações caíram**, e elas se sustentavam uma na outra:

| onde | o que dizia |
|---|---|
| chip **Xbox** | *"Não carrega nenhuma das dez linhas uhid — sem giroscópio e sem touchpad para o jogo."* |
| chip **DualSense** | *"Dez linhas do mapa-controles.csv só chegam ao jogo por aqui."* |
| dica do quadro | *"dez recursos … só chegam ao jogo pelo Sony DualSense. Errar ali custa os dez."* |

O que sobra em cada dica é o que de fato **muda** entre os modos: como o jogo
desenha os botões, e em que ordem o Hefesto tenta. Que luz, vibração, gatilho,
giroscópio e áudio valem em todos se diz **uma vez**, na dica do quadro.

**E encolheram:** as dicas dos modos somavam **1.147** caracteres e passaram a
somar **489**. As três dicas grandes da aba (Status, Modo, máscaras) caíram de
**2.847** para **1.192**.

### [x] 1.3 — os três rótulos que ela trocou

> *"Hefesto, troca essa palavra pra Status. Quando o jogo abrir, troca pra Modo.
> Aí remove a palavra Modo abaixo. Conectado agora vira O jogo vê cada controle
> como: e remove o O jogo vê cada controle como: abaixo."*

| antes | depois | e o de baixo |
|---|---|---|
| `Hefesto` | **`Status`** | — |
| `Quando o jogo abrir` | **`Modo`** | o rótulo `Modo` saiu (das **duas** posições do interruptor) |
| `Conectado agora` | **`O jogo vê cada controle como:`** | o rótulo interno saiu, e as **duas dicas viraram uma** |

Fundir as dicas segue o precedente da própria aba: quando o `?` dos modos subiu
para o quadro, em 31/08, foi pela mesma razão — *dois `?` a três linhas um do
outro dizem a mesma coisa duas vezes*.

### [x] 1.4 — a mesa tem DOIS conectados e DOIS lugares vazios

> *"Vamos deixar os outros dois controles desconectados, só colocamos algo como
> `-` nos campos que deveriam ter algo e escurecemos tudo."*

O campo `conectado` nasceu em `monta.MESA`, que é a fonte única. **O lugar
continua na tela**, apagado, com travessão nos campos — um controle que *some*
não ensina nada; um que fica apagado ensina que ali cabe um e que ele não está.

**Também acompanharam a mesa, e nenhum foi digitado:** o cabeçalho
(`2 controles: 1 USB · 1 BT`), a fita do topo (`Todos · P1 · P2`) e a frase das
máscaras da legenda.

**A cor levou duas voltas, e a foto foi quem julgou:**

| volta | o que fiz | o que a foto mostrou |
|---|---|---|
| 1ª | `--comment`, a cor da `.fita.inerte` | o lugar vazio saiu **mais aceso** que o controle na mesa |
| — | medi: **5,42:1** contra os **5,98:1** do conectado | 9% de diferença — olho nenhum lê isso como "apagado" |
| 2ª | `--linha` (**2,23:1**) | apagado de verdade, e correto: o que está escrito é um travessão |

**E o desenho não escureceu na primeira volta:** o P3 continuou **roxo** e o P4
**branco**. A cor do chassi mora em `path.corpo`, não em `.peca` — uma classe
que régua nenhuma desta aba nomeava. Quem achou foi a ampliação.

### [x] 1.5 — a frase de pendência contradizia a própria tela

> *"'Vai mudar para Modo Nativo quando você clicar em Aplicar' essa frase tá
> errada também. viu?"*

Estava. A tela desenha **Ligado + Sony DualSense**, e a faixa anunciava **Modo
Nativo**, que é a posição **Desligado** — os dois estados na mesma foto, um
contradizendo o outro.

**A cura não foi trocar o literal: foi deixar de ter um.** A frase passa a sair
de `MODO_ACESO`, o mesmo dado que acende o chip, e não tem mais como discordar
do que está desenhado.

### A MORDIDA — o gerador para se qualquer uma cair

`aba01.py::_conferir()` lê o **HTML que acabou de escrever** e reprova as seis.
Arranquei cada cura e vi reprovar:

| o que arranquei | o que a régua disse |
|---|---|
| devolvi o Point And Click | *o Point And Click voltou à fileira* |
| devolvi o `sem giroscópio` | *um tooltip voltou a negar feature* |
| voltei o rótulo `Hefesto` | *o rótulo novo sumiu · o rótulo antigo voltou* |
| voltei `Conectado agora` | *idem, mais o rótulo interno de volta* |
| voltei a mesa de quatro | *não são 2 controles conectados · não são 2 lugares vazios* |
| cravei a pendência | *a pendência voltou a ser Modo Nativo com o interruptor em Ligado* |

**E a régua nasceu errada duas vezes, pela mesma família de defeito** — a que o
`COMO-OLHAR-A-TELA.md` chama de *"régua que casa um token em qualquer lugar do
texto, em vez do campo que o significa"*:

1. leu a **página inteira** e reprovou três rótulos certos: `>Hefesto</span>`
   casava com o `<h1>` do cabeçalho (o nome do produto), e os outros dois
   casavam **oito vezes cada** dentro da legenda, que conta a história da
   mudança. *Citação não é rótulo.* Cura: ela mede só o miolo;
2. contou o **próprio comentário HTML** que explica a fusão das dicas, e
   reprovou o texto que ela mesma acabara de exigir. *Comentário não é tela.*

### O QUE EU VI E TRAGO PARA ELA DECIDIR

**Sobrou vão embaixo: 106px** entre o último quadro e o rodapé (eram ~60). É
consequência direta do que ela pediu — dois rótulos a menos e um chip a menos —,
e é da mesma família do ponto **6.2** (o vão da Conexões). Pode ser de propósito;
**pergunte antes de mexer.**

**O `Modo Nativo` ficou fora da regra dela.** *"Independente do modo, todas as
features vão funcionar"* vale para os quatro da fileira. O **Modo Nativo** é o
Hefesto **fora** do meio — por definição as features dele não valem lá, e a dica
do interruptor continua dizendo isso. **Se ela quis incluir o Nativo também, é
outra decisão** e o texto muda.

---

## `02` CONTROLES — **FEITA, espera o OK dela**

Ela mandou concluir a aba em 31/08: *"pode ir pra próxima página e concluir os
controles."* Tudo na bancada; o produto não recebeu nada.

### [x] 2.1 — `Conectados` virou `Dispositivos Conectados`

### [x] 2.2 — o `Desativado` do Microfone saiu

> *"na aba controle, remove o desligado (fica desligado com slicer no zero)."*

Restam **Virtual** e **Nativo**. Quem desliga é o slider em zero.

**Os dois botões do alto-falante JÁ estavam abaixo do slider** — a lista dizia
que estavam ao lado, e isso caducou antes desta leva. Nada a fazer.

### [x] 2.3 — o `100 % · Acordado` saiu do rótulo do alto-falante

### [x] 2.4 — os sensores viraram DUAS seções, e as unidades saíram

> *"Temos duas seções ali. Um com sensores e a seção de gatilhos. É pra ser 3:
> um Giroscópio, outra Acelerômetro e outra gatilhos."*

Três molduras: **Giroscópio · Acelerômetro · Gatilhos**, sem o `°/s` e sem o `g`.
Coube sem custo: a coluna continua nos mesmos 241px.

### [x] 2.5 — P3 e P4 viram lugar vazio, e não expandem

> *"tiramos o modo p3. p4 (seções expandidas não aparecem)"* ·
> *"Deixa os outros espaços dos 4 controles a mostra ainda mas cinza igual vc
> fez na aba jogar."*

**Eles não abrem por ESTRUTURA, não por regra:** o lugar vazio nasce sem
`<input type=radio>`, e sem rádio não há o que o CSS expanda. Uma regra que
proíbe, alguém desfaz sem perceber.

**E eles pagaram os botões novos:** um lugar vazio mede **24px** em vez de 34 —
não tem giroscópio para ligar nem bateria para medir. Sem isso, o quadro rolava.

### [x] 2.6 — os dois botões no fim

> *"Temos que ter dois botões no final. O calibrar sensores de movimento, ao
> invés de mesa. (…) E o botão Mapa do Controle."*

O **Calibrar** saiu do cabeçalho (onde lia como ajuda do título) e mudou de nome
por ordem dela: *"sensores da mesa"* dizia o ESCOPO; *"sensores de movimento"*
diz **o que se calibra**, que é o que quem clica precisa saber.

**Eles ficam FORA do corpo que rola**, e isso é estrutural: ação não rola junto
com a lista que ela governa.

### [x] 2.7 — a página nova de calibração

> *"Preciso que crie uma nova página que abre e mostra os svgs dos controles
> conectados e o procedimento igual o da steam pra calibrar os controles. São os
> 4 ao mesmo tempo."*

`mockup/calibrar-sensores.html`, gerada por `layout/_ferramentas/calibrar.py`.

**OS TRÊS ESTADOS SÃO CLICÁVEIS**, e isso foi decisão de instrumento: um mockup
desenha UM estado, e um procedimento tem três. Desenhar só um esconderia dois
terços do que ela precisa julgar. Rádio escondido + `:checked`, a mesma gramática
do interruptor da Jogar — **zero JavaScript**.

**Provado clicando**, os três: `Parado` → `Medindo…` → `Calibrado`, com o selo, o
botão e a barra respondendo, e o passo aceso batendo com o clicado nos três.

### [x] 2.8 — o Mapa do Controle perdeu a linha de instrução

> *"passe o mouse num glifo e a peça acende no desenho · passe na peça e o glifo
> acende só remove isso."*

**O comportamento fica**; o que sai é a legenda que o narrava.

**E o Voltar estava errado desde antes:** ele apontava fixo para a Navegação.
Medido: **duas** abas abrem este mapa (a Navegação e agora a Controles), e um
destino fixo está errado para metade de quem chega. Agora ele volta para de onde
veio, com a Controles como fallback de quem abre o arquivo com duplo clique.

### [x] 2.9 — a segunda volta dela, no mesmo turno

Ela olhou a aba e mandou mais quatro coisas:

| o que ela disse | o que mudou |
|---|---|
| *"Calibrar Sensores de Movimento (corrigir o texto)"* | o rótulo virou o que ela escreveu, com as maiúsculas |
| *"a posição deles volta pro canto superior direito"* | os dois voltaram ao cabeçalho — e lá custam **zero** do corpo |
| *"os botões Virtual e Nativo ficam na parte de baixo do slicer, igual o Sons do Jogo"* | mesma classe, mesma altura, mesmo gesto |
| *"remover o vê como"* + *"era o texto Vê como mas o nome da máscara fica"* | **sai o rótulo, fica o dado** |

**A primeira volta do `vê como` tirou o span inteiro e levou a máscara junto** —
era ler o pedido pela metade. Ela corrigiu em seguida, e a régua agora cobra as
duas metades: o texto fora **e** a máscara presente.

**Os modos do microfone custaram altura, e o preço está medido:** eles moravam na
linha do rótulo com custo ZERO (foi o argumento que os pôs lá em 30/08, quando
eram três). Descendo, a coluna do som foi de **236 para 269px** e o card de 308
para 341, contra os 328 que cabiam — **rolava**. As duas fileiras de escolha
passaram de 36 para **30px** e as contas fecharam. Elas continuam iguais entre
si, que é o que ela pediu.

### [x] 2.10 — a janela cresceu 20px, e a ideia foi dela

> *"talvez estender mais verticalmente o Dispositivos Conectados faça caber."*

**Ela estava certa, e o número diz por quê.** O card aberto **estica** para
preencher o corpo, então a folga de verdade é *o que o corpo dá* menos *o que o
card pede no natural*:

| janela | o corpo dá | o card pede | folga |
|---|---|---|---|
| 757px (antes) | 461 | 327 | **+1px** |
| 777px (agora) | 481 | 327 | **+21px** |

**Um pixel não é folga: é sorte** — e ela já tinha visto a barra aparecer na tela
dela. A foto que ela mandou era de um estado intermediário (dá para ver: depois
de `Cosmic Red · USB ·` não havia máscara nenhuma), e naquele estado o card
pedia 341 contra 328. Rolava mesmo.

**O que os 20px custam, medido nas dez:** a Jogar vai de 89 para **109px** de vão
e a Conexões de 216 para **236** — as duas já eram as mais vazias, e o vão delas é
o ponto **6.2** da lista. Nenhuma outra aba passa a rolar.

**E isto reabre uma decisão dela de 27/08**, que fixou o 757 depois de recusar
1048: *"iluminação, jogar e outras abas tão muito ruins com esse super espaço
vazio na parte inferior"*. 777 não é 1048 — mas **a Jogar e a Conexões ficam mais
vazias, e é ela quem julga se aceita.**

### A MORDIDA — seis, e o gerador para em todas

`aba02.py::_conferir()` lê o HTML que acabou de escrever. Arranquei cada cura:

| o que arranquei | o que a régua disse |
|---|---|
| voltei `Conectados` | *o título novo sumiu · o título antigo voltou* |
| devolvi o `Desativado` | *o Desativado voltou · os modos não são 2 por controle* |
| voltei o `100% Acordado` | *o estado do alto-falante voltou ao rótulo* |
| juntei os sensores numa moldura | *a moldura única 'Sensores' voltou* |
| apaguei a página de calibração | *o botão aponta para calibrar-sensores.html, que NÃO existe* |
| (e o lugar vazio com rádio) | *um lugar vazio ganhou rádio — ele abriria* |
| voltei o rótulo minúsculo do Calibrar | *o rótulo do Calibrar não é o que ela escreveu* |
| tirei os modos do mic da fileira `.rota` | *os modos não estão na fileira `.rota` do som* |
| subi os modos para acima do slider | *os modos voltaram para ACIMA do slider* |
| levei a máscara junto com o texto | *a máscara sumiu com o texto — ela FICA, e é o dado* |
| devolvi o texto `vê como` | *o texto 'vê como' voltou* |

**E uma das réguas nasceu QUEBRANDO em vez de acusar.** Ela media a ordem dos
blocos com `index`, e quando a classe sumia estourava com `ValueError` — o
gerador morria e a mensagem que ele devia imprimir nunca saía. Na mordida isso é
**indistinguível de uma régua que não pegou nada**. Trocada por `find`.

### QUATRO DEFEITOS QUE A FOTO E A MEDIÇÃO ACHARAM

**1. `var()` indefinido não muda a cor — apaga a declaração inteira.** O lugar
vazio não tem `--plastico`, e `.ctl{border:2px solid var(--plastico)}` deixou de
existir: `border-width: 0px, border-style: none`, com o `border-color` que eu
tinha escrito ali intacto e **inútil**. A foto mostrou dois lugares sem caixa.
*Trocar só a cor de uma regra que usa `var()` indefinido não conserta nada.*

**2. O mesmo token não serve nas duas abas.** Copiei o `--border-sutil` do
cartão vazio da Jogar; lá ele fica sobre `--app-bg` e aparece, aqui sobre
`--panel` e some. *Copiar a gramática é copiar o CONTRASTE, não o token.*

**3. A conta de altura do gerador MENTIA.** Ele imprimia *"3 linhas de 34px, sem
rolar"* com o Chrome mostrando o quadro rolando e os botões cortados. Três coisas
tinham mudado debaixo dela: dois controles viraram lugar vazio (24, não 34),
nasceu o bloco de ações, e o padding de baixo saiu. Refeita, ela agora prevê
**313px** — exatamente o que o Chrome mede.

### O QUE FICOU DE FORA, E É O PRÓXIMO PONTO

**As outras oito abas receberam só o que vem da mesa** — o cabeçalho conta
`2 controles` e a fita mostra `Todos · P1 · P2`. O desenho dos quatro controles
**dentro** de cada uma ainda não ficou cinza. Cada aba os endereça de um jeito
(a Gatilhos por coluna, a Iluminação/Vibração/Navegação/Conexões por
`svg[data-controle]`, a Perfis por outra via), então é trabalho por aba.

---

## `03` GATILHOS — **FEITA, espera o OK dela**

### [x] 3.1 — o L2 e o R2 titulam a seção

> *"o L2 e o R2 deveriam controlar a seção e não ficar do lado esquerdo de
> gatilho esquerdo ou direito."*

Eles saíram de dentro do rótulo e ganharam **trilha própria**, atravessando as
três linhas de cada seção (`grid-row: span 3`). **"Gatilho esquerdo/direito"
saiu** — o glifo já diz qual gatilho é; a palavra repetia o desenho. O que sobra
em cada linha é o que ela nomeia: **Modo · Efeito pronto · Ajustes**.

**Custo de altura: zero.** A célula ocupa trilhas que já existiam.

### [x] 3.2 — o respiro, e a cura NÃO custou um pixel

> *"lá precisa de respiro em tudo (…) fora o respiro entre as linhas na questão
> do espaço vertical."*

**Medi antes de mexer, como a lista manda.** O respiro das células desta aba era
**`0px/0px`**, e a divisória ficava em `top:0` — encostada no conteúdo de cima,
com o vão **inteiro** embaixo. O olho lê isso como linha grudada e buraco.

**A hipótese da lista estava certa:** *"o problema não era só contraste — é
respiro"*. E a cura já existia: é a da **Vibração**, de 30/08. `--r-ar` vira o
dono e o passo é o **dobro** dele; a linha desce meio passo e cai no **meio** do
vão. Medido: a divisória sobe **7px** (era 0), e a tabela mede o mesmo pixel.

**E o passo entre linhas foi de 10 para 14** — 40% mais ar. Ele foi **pago**, não
raspado: os P3/P4 desligados devolveram 23px e a janela de 777 devolveu o resto.

### [x] 3.3 — o P3 e o P4 são lugar vazio

> *"os demais 3 e o 4 ficam lá com os espaços mas tudo com Desligado e Nenhum,
> fora a borda do P1 e P2."*

Tudo em **Desligado** e **— Nenhum —**, e a **borda de cor saiu**: num lugar
vazio não há de quem, e pintar a cor de um plástico que não está na mesa é dizer
que ele está.

### [x] 3.4 — o nome das colunas ficou centrado

> *"temos que centralizar o nome das colunas dos controles ou então colocarmos os
> SVG de cada controle ao lado direito do nome."*

**Escolhi centralizar, e o preço do outro está medido:** o chip mede 126px numa
coluna de 232, então centrá-lo custa **zero**. O SVG ao lado pediria altura que a
linha do nome não tem — ela é 24px, e um desenho de 24px é o mesmo caso das
lâmpadas do jogador que ela mandou sair dos desenhos pequenos. Para caber, a
linha iria a 40px e comeria **16 dos 24px de folga**. *Se ela quiser o SVG, o
preço é esse.*

**E a primeira volta usou o eixo errado** (`align-items` num grid mexe no
vertical): o chip continuou colado à esquerda e só a foto mostrou.

### A MORDIDA — sete, e o gerador para em todas

| o que arranquei | o que a régua disse |
|---|---|
| devolvi o glifo ao lado do rótulo | *o glifo L2 não titula a seção · o rótulo voltou* |
| devolvi o modo do P3 | *o P3 tem modo de gatilho e é lugar vazio* |
| pintei a borda de cor no vazio | *os chips sem cor não são 2 · a borda ficou em quem não está* |
| voltei a divisória para o topo | *vão todo de um lado só* |
| desfiz o passo derivado do ar | *R_PASSO e R_AR divergiram* |
| `--r-ar:10` (estoura o teto) | *a coluna pede 501px e a grade tem 477* |
| `--r-ar:8` (cabe, folga 8px) | *só 8px de folga — um pixel não é folga* |

### TRÊS RÉGUAS DESTA CASA ESTAVAM ERRADAS, e as três davam número

**1. O teto da grade era 454** — o número da janela de 757. Com os 777 ele
reprovaria um desenho que cabe. **E eu tentei derivá-lo da soma das partes antes
de medir: deu 528, 51px a mais do que a tela aguenta.** Uma conta de layout que
não passa pelo navegador erra por margens que ninguém lembra de somar, e um teto
folgado é pior que nenhum — ele deixa passar a aba que rola. **Medido: 477px**,
empurrando a coluna 2px por vez até o miolo rolar.

**2. A régua de alinhamento tratava `--publicado` como nome de arquivo.** Ela
estourava, e quem contasse a saída com `grep` lia um número que era do
**traceback**. Foi assim que ela "achou 3 desalinhamentos" numa aba que nunca
chegou a medir.

**3. A legenda dizia *"2 no R2 (a Vibração do P3)"*** — o número certo e o dono
errado, porque o P3 virou lugar vazio. **Metade certa é o pior estado de uma
legenda: a metade certa a faz parecer conferida.** Agora as duas saem da cena.
De quebra, a primeira versão escreveu *"a Arco de flecha do P1"* — o artigo
obrigava a saber o gênero de 19 nomes de modo.

### O QUE SOBRA, E É PREEXISTENTE

A régua acusa **1 desalinhamento**, e ele existe idêntico no produto publicado
(`regua.py 03-gatilhos.html --publicado` prova): os rótulos alinhados à direita
**começam** em x diferentes, que é a consequência aritmética do que ela pediu em
30/08. O que tem de bater é onde eles **acabam**, e acabam. Declarado.

---

## `04` ILUMINAÇÃO · `05` VIBRAÇÃO

### [x] 3.5 — as bordas das outras duas

O censo de 31/08, com a Gatilhos já curada:

| aba | bordas visíveis | respiro das células |
|---|---|---|
| `03` Gatilhos | 112 | **curado** — a divisória sobe 7px |
| `04` Iluminação | **248** | ainda não medido por célula |
| `05` Vibração | 200 | já tinha `--r-ar:5px` desde 30/08 |

A Iluminação é a mais pesada das três, com **136 bordas de `--linha`** sozinhas.
**A cura da Gatilhos é a que serve**, e ela já provou custar zero de altura.

---

## `06` NAVEGAÇÃO

*Sem ponto dela nesta aba.* O `Estilo Point-and-click` **fica** (ver 1.1).

---

## `07` LANÇADORES

*Sem ponto dela nesta aba.* Palavra dela, registrada no rodapé da própria aba:
*"essa aba em si só vamos desenhar e deixar placeholder mesmo"*.

---

## `08` CONEXÕES

### [x] 6.1 — os campos que expandem não têm respiro

> *"o nome dos campos que expandem não tem respiro isso **todas as abas** que tem
> esses campos que expandem."*

**Ela mandou duas fotos desta aba**, uma com o Check-up aberto e outra com os
três fechados. O rótulo do acordeão está **colado na borda da faixa**.

**MEDIDO: só a Conexões tem acordeão de verdade.** Os três são
`▸ Check-up`, `▸ Gestão Controles`, `▸ Rádio e adaptadores`
(`input class="abre"` em `aba08.py:1891`, `:1980`, `:2016`).

**Mas ela disse "todas as abas que tem esses campos"** — então **faça o censo
das dez** antes de concluir que é só uma. Procure por qualquer coisa que abra e
feche: `input.abre`, `<details>`, `:has(> input.abre)`, e também o **cartão que
abre** da aba Controles (`.ctl.card`, quatro deles), que é campo que expande
mesmo sem ser acordeão.

**A cura tem de ser uma variável no `topo.html`**, não conserto por aba — senão
a próxima aba que ganhar acordeão nasce apertada. O precedente é o `--r-ar` da
Vibração, de hoje.

### [x] 6.2 — o vão embaixo, com as seções fechadas

**Isto não é pedido dela — é o que eu vi na foto e trago para ela decidir.**

Com os três acordeões fechados, sobram **~220px de vazio** entre a última faixa
e o rodapé. É a mesma família dos 58px que ela reclamou no Perfil de Bateria
hoje (*"tá destacando negativamente"*).

Pode ser de propósito — os acordeões abrem e preenchem. **Mostre a foto a ela e
pergunte**, antes de mexer.

---

## `09` SISTEMA

### [x] 7.1 — Perfil de Bateria vira três botões

> *"perfil da bateria transforma em três botões lado a lado com escolha única e
> tira o 'O perfil da mesa' pronto isso resolve."*

**Antes:**
```
Perfil de Bateria (?)
  O perfil da mesa    [ Tudo ligado                    ▾ ]
  ◆ O que ele impõe     Nada é limitado
  ◆ Vale para           Os 4 controles
  ◆ O teto alcança      Vibração
  ◆ Ainda sem teto      Gatilhos, barra de luz, microfone por rádio e giroscópio
```
**Depois:**
```
Perfil de Bateria (?)
  [ Tudo ligado ] [ ........ ] [ ........ ]     ← três botões, escolha única
  ◆ O que ele impõe     Nada é limitado
  ◆ Vale para           Os 4 controles
  ◆ O teto alcança      Vibração
  ◆ Ainda sem teto      Gatilhos, barra de luz, microfone por rádio e giroscópio
```

**Os três nomes NÃO SE INVENTAM.** Eles saem do produto —
`RUMBLE_POLICY_MULT` e `PERFIL_BATERIA_LONGA` em
`src/.../daemon/subsystems/rumble.py` e no `secao_orcamento.py`. Leia de lá e
use os nomes de verdade.

**A gramática dos botões já existe:** é o `.seg` que a aba Vibração usa em
`Economia · Balanceado · Máximo · Auto`. Copie, não invente.

**CUIDADO COM A ALTURA — este bloco tem portão próprio.** O gerador `aba09.py`
ganhou hoje uma régua que **reprova quando o bloco `Perfil de Bateria` e o bloco
`O serviço` deixam de acabar no mesmo y**. Ela nasceu porque havia 58px de vão
ali, que ela viu e reclamou. Rode `python3 aba09.py` e obedeça ao que ele
imprimir.

---

## `10` PERFIS

*Sem ponto dela nesta aba.* A lista `Estilo de Jogo` continua com
`Point-and-click` (ver 1.1).

---

# TODAS AS DEZ ABAS

### [x] 8.1 — "Ajustes vão para:" vira **"Selecionar:"**, e só acende com controle

> **31/08/2026, o texto exato dela:** *"Ajustes vão para: aqui pode alterar pra
> colocar o **Selecionar:** em todas as abas."*
>
> **E ela mandou deixar na lista, não fazer agora:** *"OK, só deixa em to do list
> o selecionar."* — o mesmo que ela já tinha decidido ao congelar o `topo.html`:
> este ponto muda as dez abas de uma vez e é para ser feito **por um só**.

**A palavra mudou de "Selecione" para "Selecionar:", com os dois-pontos.** O
resto do ponto continua valendo, e está abaixo.

> *"Ajustes vão para: aqui vamos mudar para **Selecione**. E ele só fica ativo se
> surgir Controle naquela área. **Enquanto não surgir controle ele fica desligado
> sem texto e sem identificado.** Aí conectou ele reconhece."*

**Onde:** a fita do topo, em **todas as dez** — `layout/_ferramentas/topo.html`.
Mexer aqui muda as dez de uma vez, então **regere as dez** (`python3 regerar.py`)
e **olhe as dez** antes de mostrar a ela.

**Antes:**
```
Ajustes vão para:  [Todos] [P1·Cosmic Red·USB] [P2·Starlight Blue·BT] …
```
**Depois, COM controle:**
```
Selecione:  [Todos] [P1·Cosmic Red·USB] [P2·Starlight Blue·BT] …
```
**Depois, SEM controle:**
```
Selecione:  (a fita nasce desligada — sem texto, sem identificação)
```

**A parte difícil, e é o que precisa da conversa com ela:** o mockup é estático.
Ele desenha **um** estado. Como mostrar os dois? É a mesma pergunta do **2.3** —
resolva junto.

**Cuidado com um portão:** `layout/_ferramentas/regua.py` mede o alinhamento dos
títulos, e a fita é a régua de x das dez abas. Rode `python3 regua.py NN-*.html`
depois de mexer.

---

# O QUE JÁ ESTÁ FECHADO — não se reabre sem ela

Veio do olho dela **em 31/08** e está no mockup:

| | |
|---|---|
| Jogar | o `Automático` fora da escada · os algarismos fora dos modos · o interruptor **fora** de "Quando o jogo abrir" |
| Controles | `Os controles da mesa` → **Conectados** · o botão **Liberar** do microfone fora |
| Gatilhos | os glifos **L2** e **R2** de volta |
| Sistema | a aba diz **serviço**, e o verbo é **Parar** |

# DEPOIS QUE ESTA LISTA FECHAR

O desenho concluído vira interface **usável** pelo plano de uma hora:
`docs/process/sprints/2026-08-31-A-INTERFACE-LIGADA-PLANO-DE-UMA-HORA.md`

Ele **não roda antes** desta lista fechar — ligar um desenho que ainda vai mudar
é pagar duas vezes. E a notícia boa está medida lá: o buraco é **muito menor**
que as 120 sprints `MIGRA-*`. O `controles_vivos.py` já é o piloto genérico —
ele cria a janela, sobrevive à troca de aba e instala o interruptor em *"QUALQUER
página que tenha `[data-modo]`"*. Os outros cinco pilotos são **conhecimento**,
não infraestrutura. O trabalho é **um piloto, dez abas**, e a metade difícil já
está pronta.

# ONDE OLHAR ANTES DE COMEÇAR

| | |
|---|---|
| o contrato da casa | `CLAUDE.md` |
| fotografar sem atrapalhar ela | `docs/process/COMO-OLHAR-A-TELA.md` |
| o que aconteceu em 31/08 | `docs/process/2026-08-31-O-HANDOFF-*.md` |
| as duas pastas | `mockup/LEIA-PRIMEIRO.md` |
| a gramática do desenho | `layout/_ferramentas/LEIA-ME.md` e `CORRECOES-DELA.md` |
