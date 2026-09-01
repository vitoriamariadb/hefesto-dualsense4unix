# ONDE PARAMOS — a cor virou dado, e três afirmações caíram

**27/08/2026, à noite.** A cor do plástico saiu de dentro do CSS escrito à mão e
virou **dado com dono, gerador e portão**. No caminho, três afirmações que esta
casa dava por certas foram derrubadas — e uma delas estava no enunciado do
trabalho.

---

## O que dá para ver agora, e é o que ela pediu para olhar

**Abra `layout/mapa-do-controle.html`.** No topo nasceu uma barra de provas
com três blocos:

| bloco | o que faz |
|---|---|
| **Cor do plástico** | dropdown com os **28 modelos** do `docs/data/cores-do-dualsense.csv`. O desenho repinta **zona por zona** — casca, painel, touch, botões, símbolos, d-pad, analógicos, gatilhos |
| **Jogador** | 1 a 4, e o padrão das cinco lâmpadas vem do **produto** (`core/led_control.py::player_led_pattern`), não de uma tabela copiada. A barra de luz acende junto, na cor do slot |
| **Barra de luz** | cor livre, e o "apagar" |

O que a lista de cores marca, e por quê: **11 dos 28 não pintam por hexadecimal**
— iridescente, camuflado, metálico e arte não cabem num `fill`, e quatro modelos
não têm amostragem. Eles saem **hachurados** ou no cinza de não-medida, com a
frase explicando ao lado. **Nada de hex inventado.**

Medido nesta navegação, página inteira, como quem usa: **28 peças acendem nos
dois sentidos**, **28 modelos pintam com contraste**, **zero rolagem**, **zero
erro de JavaScript**, e a linha "Corpo" voltou a caber na caixa.

---

## As três afirmações que caíram

### 1. "As cinco cores vivem no `<style>` do `dualsense.svg`"

**Não vivem, e nunca viveram.** O SVG é o desenho que ela fez no editor, e a
única cor que ele carregava era `fill="#3a3f4b"` como atributo. As cinco cores
estavam em `src/hefesto_dualsense4unix/interface/topo.html:295-326` e no `mapa.py`, com uma
quinta em `04-iluminacao.html`. Quem fosse consertar o hex procuraria no arquivo
errado. **Substituído** no cabeçalho de `docs/data/cores-do-dualsense.csv`.

### 2. "Os quatro DualSense responderam pelo rádio"

**Foram dois aparelhos, e só UM pelo rádio.** A canônica é explícita — *"as duas
medições desta bancada"* — e o cabeçalho do ensaio repete: `hidraw7` no **cabo**
(Starlight Blue `05`) e `hidraw8` no **rádio** (Cosmic Red `02`). Os quatro
códigos `00/02/04/05` são de **15/08** e vieram **pelo cabo**.

**Esta afirmação estava no enunciado do trabalho de hoje, e eu a propaguei para
três documentos antes de a conferência a derrubar.** Corrigida nos três, com a
nota do que dizia. **A consequência é de produto:** a prova de bancada da
`ONDA-CONEXOES-11` passou a exigir **mais de um controle no rádio** — uma amostra
de um não separa *"o comando funciona por rádio"* de *"aquele aparelho aceitou"*.

### 3. "Por rádio o firmware do controle RECUSA o `0x80` — é o aparelho"

**Era o nosso CRC**, e a canônica já tinha corrigido em 27/08. Mas a lápide
continuava viva no código, em `integrations/cor_do_plastico.py`, e é ela que
qualquer executante lê **antes** de qualquer sprint. **Substituída** — o filtro
continua no lugar (tirá-lo é a `ONDA-CONEXOES-11`), e o que o docstring diz agora
é: *"Não pare aqui achando que o aparelho recusa: ele não recusa."*

Este par de afirmações custou **quatro dias** a esta casa.

---

## O que nasceu

| arquivo | o que é |
|---|---|
| `scripts/gerar_cores_do_dualsense.py` | o gerador. Lê os dois CSV e escreve no SVG as zonas (`class="z-<zona>"`), a hachura do SEM-HEX, os gradientes de casca partida e a folha dos 28 modelos. **Não toca geometria** — nenhum `d`, nenhum `transform` |
| `scripts/check_cores_do_dualsense.py` | o portão, com **duas réguas independentes**: a leitura dos CSV e a **pintura medida no Chrome**. A segunda existe porque a primeira é cega para `style` inline, que vence folha |
| coluna `zona` em `pecas-do-dualsense.csv` | o cruzamento entre as peças e as cores. `luz` para lightbar e lâmpadas — luz não é plástico —, e `-` para os cinco marcadores |
| `ONDA-CONEXOES-11, 12, 13` | as três sprints que a medição tornou necessárias (ver `SPRINT_ORDER.md` §1.5) |

**A casca partida não parte o desenho.** Spider-Man 2 e God of War 20th têm
`casca_esq` e `casca_dir` **diferentes**, e a peça é uma só. O gerador emite um
gradiente de **corte duro** — dois `stop` no mesmo offset —, e não redesenha nada.

---

## As duas réguas que estavam cegas, e uma que nasceu falsa

1. **O portão das peças fazia a medição DEPOIS de rolar.** `pg.hover()` do Playwright chama
   `scrollIntoViewIfNeeded` antes de apontar, e a rolagem trazia a coluna
   transbordada para dentro da vista. Medido: a linha "Corpo" estava em x=1861
   numa caixa que termina em 1860, e o portão dava **verde**. Agora ele recarrega
   a página e mede **antes de qualquer hover** — e a mordida prova: com o defeito
   devolvido, ele reprova nomeando `item-corpo`.
2. **A régua do SEM-HEX nasceu falsa** e reprovou 17 linhas sãs: exigia a receita
   em **toda** linha `SEM-HEX`, e o CSV a escreve **uma vez por modelo**, como já
   faz com o `casca_dir` do White. A receita é do acabamento, não da zona.
   Corrigida antes de alguém acreditar nela.
3. **`so_a_letra` era código morto** no gerador do mapa — nunca chamada desde que
   `controle()` passou a usar o arquivo dela. Foi por isso que a primeira
   tentativa de subir as letras dos ombros **não mudou um pixel**. Cortada.

---

## O que ela apontou, e o que era

*"os glifos, borda do touchpad, caixa de som, botão de microfone, analógico (…)
botões de share e options, glifos dos botões da face. quebrou muita coisa."*

**Estava certo, e o dado também.** No Cosmic Red o painel, o touch, os
analógicos e os símbolos são `#1A1A1C` — **preto**. O que o dado não sabia é que
**este desenho é de linha sobre fundo escuro**: preto sobre `#282a36` dá razão de
contraste **1,22**, e a peça deixa de existir.

A cura é a conta que o produto **já tinha**: `tom_para_a_borda`, que resolve
exatamente isto para a borda do card — *"Midnight Black pintado cru não é uma
borda preta: é a AUSÊNCIA de borda"*. Importada, não reescrita. O dado cru não se
perde: fica em `--z-<zona>-crua`, ao lado da cor que se vê.

*"o l1 e o r1 precisam subir um pouco (as letras apenas)"* — a causa não era a
fonte. As quatro cápsulas dos ombros são **inclinadas** e a letra é horizontal:
no x onde ela mora, o miolo da cápsula já subiu, e o centro do *bounding box* cai
abaixo dele. **Path inclinado não se mede por caixa** — é a mesma lição que o
`medir_subpaths.py` desta casa já pagou.

---

## O que espera a palavra dela

1. **A escrita nos controles dela, por rádio** (`ONDA-CONEXOES-11`). A leitura da
   cor exige um `SET_FEATURE 0x80`, e o produto vai fazê-lo **sozinho**, uma vez
   por endereço e por sessão. O ensaio ela mandou rodar; este pergunta por conta
   própria — e é essa a diferença que precisa dela.
2. **O microfone é por máquina ou por perfil?** Entrou no `SPRINT_ORDER.md` §0.1.
   Um jogo em máscara Xbox quer o mic **Emulado**, o de fora quer **Nativo** — o
   que empurra para *por perfil*, e isso muda o dono do campo.
3. **Os 202 hex são de FOTO, nenhum é MEDIDO.** O próprio CSV diz que os quatro
   controles desta bancada podem virar `MEDIDO` com uma foto sob luz constante, e
   que *"é o primeiro trabalho a fazer"*. Isso é foto **da peça** e precisa da
   mesa dela.

---

## O que fica aberto, e não é dela

* **O mockup ainda diz o fato caduco** — `src/hefesto_dualsense4unix/interface/aba08.py` e o
  HTML que ele gera afirmam que *"pelo rádio o aparelho recusa a leitura"*, e o
  contrato repete em `2026-08-26-O-REDESENHO-as-dez-abas.md:330,623`. **Os dois
  estão em revisão com ela, e não se tocam sem a palavra dela.**
* **A frase da tela do produto** (`app/widgets/external_card.py`) também afirma
  que o controle recusa. Ela muda com a `ONDA-CONEXOES-11`: mudar o texto antes
  da cura seria trocar uma mentira por outra.
* **`docs/data/cores-do-plastico.md` continua vivo ao lado do CSV**, com um hex
  por modelo contra dez zonas. É a `ONDA-CONEXOES-12` que desempata.
* **Nenhum portão valida `arquivo:linha` em `docs/process/`** —
  `validar-citacoes-de-linha.py` cobre só `docs/protocol/`, e a razão está escrita
  no cabeçalho dele (sprint cita a árvore do dia em que foi escrita). Isso é uma
  decisão, não um esquecimento; mas significa que **as citações das sprints de
  hoje foram conferidas à mão**, e quatro estavam erradas — três porque a
  substituição da lápide moveu as linhas do próprio arquivo citado.

---

## A segunda metade da noite — as dez abas com quatro controles

Pedido dela, depois do primeiro fechamento: *"precisamos que cada aba dessa do
nosso mockup seja reescrita pra 4 controles conectados (…) considerando o nosso
mapa. e o sistema de fitas (…) e os geradores de svgs de cada página precisam
também considerar o nosso mapa do dualsense."*

**A infraestrutura primeiro, porque as dez dependem dela:**

* **`monta.MESA`** — os quatro controles, e são os **dela**: Cosmic Red (USB),
  Starlight Blue (BT), Galactic Purple (BT), White (USB). Nenhum gerador escreve
  "quatro" num laço: eles percorrem a MESA, e o número do jogador é **campo**,
  não posição — decisão dela de 26/08 (*"o meu controle azul é o player 2"*).
* **`monta.fita()`** — os chips, um por controle, com a borda na cor do plástico
  lida do desenho. Eram **dois `<span>` fixos** no esqueleto, remendados por três
  `str.replace` encadeados — a forma pela qual a fita viva já morreu em silêncio.
* **`monta.cor_da_zona()`** — a cor de qualquer zona de qualquer modelo, lida do
  `<style>` gerado. É o que tirou o último hexadecimal digitado dos geradores.
* **A contagem do cabeçalho** (`4 controles: 2 USB · 2 BT`) sai da MESA.
* **O esqueleto perdeu a duplicata de cor**: 32 linhas de colorway escritas à mão
  saíram do `topo.html`, e as cinco variáveis de plástico passaram a ser
  **geradas** — a primeira delas, `--cosmic-red`, estava errada.

### O defeito de raiz, que cinco agentes acharam e nenhum pôde tocar

**`monta.svg(jogador=N)` nunca acendeu uma lâmpada, em aba nenhuma.** A troca
procurava `id="…" fill="#c9ced8"` **coladinhos**, e no desenho de hoje vêm seis
atributos entre os dois. `str.replace` que não casa devolve o texto intacto e não
avisa. Duas abas mostravam os cinco pontinhos apagados na tela.

**E a minha primeira cura trocou um defeito silencioso por outro:** ela
acrescentava um **segundo atributo `class`**, que o navegador ignora — `led-on`
no HTML e zero no `classList`. Só a medição pegou. Agora funde na classe
existente e **reprova** se a âncora sumir. Medido: as cinco abas com desenho
acendem 10 lâmpadas, que é `1+2+3+4`.

### A régua que faltava, e o que ela revelou

Nenhuma das dez olhava para **rolagem interna**: `passa_da_dobra` mede a
**janela**, e a janela tem 757px em todas as dez. Por baixo disso, a **Conexões
escondia dois quadros inteiros** — "Conexões" e "Desempenho", com **zero pixel à
mostra** —, a **Gatilhos** escondia o seu único botão, e a **Controles**, a aba
que É sobre os controles, mostrava **um e meio dos quatro**.

`regua.py` agora mede, e a regra é a da tela: quadro **inteiro** fora reprova;
**parcialmente** fora avisa. Curadas: 02, 03 e 07 fecharam com o miolo em 542/542.

### E o portão que não olhava para a `01-jogar.html`

A régua de hex digitado lia quatro arquivos e **nenhum deles era a 01-jogar** — o
único mockup mantido à mão, e onde havia **oito** hexadecimais de plástico.
Batiam hoje; é o mesmo caminho por onde o Cosmic Red virou `#b11f54` e ninguém
teve como ver. Régua nova, com mordida: todo `--plastico` da 01 tem de ser uma
cor da MESA.

### O que sobrou, e é dela

* **A Conexões não cabe na janela.** São **850px de quadro para 466 de
  orçamento**. O agente fundiu "Desempenho" dentro de "Conexões" e moveu
  "Microfone e botões", e ainda faltam **370px**. O que teria de sair está
  medido, item a item — e **cortar conteúdo é decisão dela**. O caminho barato
  medido: numa janela de 1.080px (a TV dela) faltariam **47px**, não 370.
* **O `#0000FF` cru na tela**: a Controles trocou por "do Player 1"; a Iluminação
  o manteve, como leitura do seletor de cor. **As duas abas discordam**, e isso
  não se decide por aba.
* **As lâmpadas do jogador são invisíveis nos desenhos pequenos** — 1,0 × 0,33px
  na Conexões. O padrão está certo e não se lê. A 01 e a 10 tiraram as suas; a
  04, a 05 e a 06 mantiveram. Também é uma decisão só.
* **A fita da Jogar contradiz a legenda da própria Jogar**: a fita está viva
  (*"o que você mudar nesta aba vai para o controle escolhido"*) e a legenda diz
  *"a fita fica esmaecida: nada aqui ajusta por controle"*. Os três seletores da
  aba são globais, o que dá razão à legenda.

## O estado dos portões

**21 rápidos verdes**, e nos completos só o `referencias-docs` — **125
referências mortas, exatamente as mesmas 125 de antes deste trabalho**, em 538
documentos em vez de 535. As três sprints novas entraram com a isenção
`<!-- ref-externa -->`, que é o que a casa usa para o arquivo que a sprint vai
criar.

**Nada foi commitado.** Continuam ~230 arquivos no índice, de um dia inteiro que
ela ainda não revisou.
