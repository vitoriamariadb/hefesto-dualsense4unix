---
sprint: ONDA5-06-02
estado: aberta
posse:
  A06:
    - src/hefesto_dualsense4unix/interface/aba06.py
    - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
    - src/hefesto_dualsense4unix/interface/paginas/06-navegacao.html
    - tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py
cria:
  - tests/unit/test_a_06_o_interruptor_apagado_diz_o_lado.py
bancada: true
depois_de: [MIGRA-NAVEGACAO-06, ONDA2-06-NAVEGACAO-01, ONDA5-06-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/onde.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/core/acoes_de_botao.py
  - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
  - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
  - docs/data/paridade-gtk-html.csv
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/aba05.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba08.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/aba10.py
---

# ONDA5-06-02 · DESENHO — o interruptor apagado diz o lado, e o PS ganha a 22ª linha

**Você é dono de três arquivos da aba e da régua dela, e de mais nada.** Duas
decisões dela desta rodada caem aqui porque tocam os mesmos três arquivos —
separá-las em duas frentes seria conflito por linha, não paralelismo.

**As outras três decisões da aba já estão fechadas.** A §5 diz onde, com o
endereço. **Não as refaça.**

---

## 1. AS DUAS DECISÕES, VERBATIM

### [06-Q1] o interruptor do mouse fora do modo "Controlar o PC"

Ela marcou **"Apagado, razão ao lado"** e escreveu ao lado:

> **"Sem clicar mas ativo"**

E o esclarecimento de hoje, que **manda**:

> *"o switch fica apagado (não clicável) MAS mostra o estado real: pode ficar
> apagado no estado off, e pode ficar apagado no estado on"*

**São duas frases e uma regra só:** *apagado* diz **não dá para mexer**; nunca
diz **está desligado**. O que fala do LADO — a palavra, o pino, o fundo — não é
do portão e o portão não encosta nele.

**ISTO CORRIGE A ESCOLHA DE 04/09 EM DOIS PONTOS.** O PO decidira *"o
interruptor fica apagado e sem resposta"* e a construção ficou no meio: o
interruptor **continua respondendo ao clique**, por escrito
(`interface/aba06.py:706` — *"nada aqui é `disabled` nem
`pointer-events:none`"*), e a regra que o apaga **também apaga o pino**, que é
a peça cujo único trabalho é dizer o lado.

### [06-Q3] o botão PS na tabela de atalhos

> **Aparece e você escolhe** — *"O PS ganha a mesma lista das outras 21 linhas;
> se você der uma tecla a ele, ele passa a digitar SEM parar de abrir a Steam,
> e a tabela não avisa isso."*

**O motor é da ONDA5-06-01 e vem antes** — sem ele o `<select>` do PS recusa o
próprio clique (`interface/pacotes/a06_navegacao.py:2284`) e o gerador estoura
em `interface/aba06.py:1449`. Aqui é a TELA: a linha, o `?` que dizia o
contrário, e a tira que faz a última oração da frase dela deixar de ser
verdade.

---

## 2. A MEDIÇÃO DO INTERRUPTOR — o que existe, letra por letra

O interruptor é o rótulo de `interface/aba06.py:1583`, sem `<input>`: a palavra
é nó de texto no `.txt` e o aceso é a classe `ligado`, pintada pelo alvo
`classe`. Quem escreve a palavra é `interface/pacotes/a06_navegacao.py:1420`,
e só quando o daemon respondeu.

**O que já está certo, e é a metade boa da decisão dela:** a tela mostra o
estado real em qualquer modo. `_rato` lê `mouse_emulation` do último tique
(`interface/pacotes/a06_navegacao.py:1543`) — o portão impede MUDAR, não muda o
valor. A régua `tests/unit/test_a_06_o_status_do_modo_nao_mente.py:120` já é
parametrizada nos dois lados.

**O que apaga o interruptor** são três regras, e todas leem a linha do portão
por `:has()` — um endereço só, sem segundo campo a divergir:

| linha | o que a regra faz |
| --- | --- |
| `interface/aba06.py:716` | borda sutil, texto mudo, `cursor:not-allowed` |
| `interface/aba06.py:718` | mata o `:hover` |
| `interface/aba06.py:720` | **pinta o `.pino` de `--border-sutil`** |

### 2.1 O defeito, medido nas duas regras

A terceira é a que contraria o esclarecimento dela. Comparando com o que diz o
lado (`interface/aba06.py:674` e `:677`):

* `.tog.ligado .pino{background:var(--green);box-shadow:0 0 7px var(--green)}`
  vale (0,3,0);
* a regra do portão vale (0,6,0) — `.quadro-corpo` + o `:has()`, que conta pelo
  argumento mais específico (`.estado.portao .laranja`), + `.tog` +
  `[data-gesto]`.

**A do portão vence, e o pino fica cinza com o mouse LIGADO.** O que sobra
dizendo o lado é a palavra e o fundo esverdeado de `interface/aba06.py:675` —
que sobrevive por acidente, porque a regra do portão não declara `background`.
**Um lado inteiro do interruptor está sendo dito por uma declaração que ninguém
escreveu de propósito.**

### 2.2 A armadilha do "não clicável", e ela é de CSS

`pointer-events:none` no rótulo tira o clique **e tira junto o
`cursor:not-allowed`** de `:717`: um elemento que não é alvo de ponteiro não
decide o cursor — quem decide passa a ser o pai. Aplicar só a primeira metade
troca um defeito por outro: o interruptor recusa em silêncio e ainda parece
clicável.

**A cura tem de mover a mão para o pai**, na mesma regra `:has()`: a linha
`.at-linha` que contém o interruptor mostra o `not-allowed`, e o rótulo deixa
de ser alvo. É a mesma disciplina do resto do bloco — a razão e a tinta saem da
mesma linha da tira, e continuam saindo.

---

## 3. A MEDIÇÃO DO PS — o que a tela precisa acrescentar

Depois da ONDA5-06-01, `core/acoes_de_botao.BOTOES` tem vinte e dois nomes e o
PS tem valor de fábrica. O que falta é tela:

* **a linha.** `interface/aba06.py:1469` monta a primeira coluna das DUAS telas
  de botões a partir da mesma lista. Uma entrada `(gl("ps"), "ps")` entre
  `create` e as três regiões do touchpad basta; a peça existe no mapa
  (`docs/data/pecas-do-dualsense.csv:63`) e o nome que ela lê já existe no
  produto (`app/actions/input_actions.py:146` → **"Botão PS"**);
* **os números.** As duas dicas (`interface/aba06.py:1640` e `:1654`), as duas
  confirmações de "Voltar ao padrão" (`:1987` e `:1999`) e a autoconferência do
  gerador (`:2554`) já dizem `len(BOTOES)`. **Elas acompanham sozinhas** — é
  por isso que ninguém digita o número aqui, e é o que se confere em vez de
  editar;
* **o `?` que diz o contrário.** `interface/aba06.py:1640` tem hoje um
  parágrafo inteiro explicando que *"o botão PS não entra"*. Ele sai, e o que
  entra no lugar é o que a decisão dela exige que ela saiba: **o PS faz as duas
  coisas.**

### 3.1 O terceiro dono, e é ele que a tira não sabe dizer

A tira sob a tabela (`interface/pacotes/a06_navegacao.py:1199`) já nomeia
"dois donos" — mas `_dois_donos` (`:1062`) deriva de `DEFAULT_BUTTON_BINDINGS`,
o mapa do teclado virtual, e **o PS não está lá**. O segundo dono do PS é o
`ps_solo` do subsistema de hotkey, que é uma terceira fonte.

**Sem uma linha nova, a tira fica calada exatamente sobre o botão em que a
própria opção dela avisava que a tabela cala.** É esta linha que faz *"e a
tabela não avisa isso"* deixar de ser verdade — e ela é da tira, não do `?`,
pela regra que a decisão [06-Q4] já fixou: *o que se perde ocupa linha; o que
se explica mora no `?`.*

---

## 4. OS PASSOS, E A MORDIDA DE CADA UM

### P1 · O portão apaga o CONTROLE e não encosta no LADO

`interface/aba06.py:720-721` sai. A regra do portão passa a declarar só o que é
do controle: borda, texto e hover. O pino, a palavra e o fundo continuam saindo
de `:674`, `:675` e `:677`, e passam a valer também sob o portão.

**A MORDIDA:** devolva a regra do pino e rode a régua nova com o daemon dizendo
`mouse_emulation.enabled = true` e o modo fora de "Controlar o PC". Ela tem de
reprovar dizendo que o interruptor apagado e ligado ficou igual ao apagado e
desligado — que é a leitura do esclarecimento dela, palavra por palavra.

**E a régua tem de LER, não digitar.** Ela compara as duas cenas (portão + on,
portão + off) na folha gerada; uma régua que procure a string `--green` no CSS
daria verde com a regra do portão vencendo por especificidade, que é o defeito
que esta sprint existe para matar.

### P2 · O clique para de chegar ao gesto, e o cursor continua recusando

O rótulo do portão deixa de ser alvo de ponteiro; o `cursor:not-allowed` muda
para o `.at-linha` que o contém, na mesma regra `:has()`.

**O gesto `modo` NÃO PERDE A RECUSA.** `interface/pacotes/a06_navegacao.py:1993`
continua levantando `RAZAO_DO_PORTAO`, e é de propósito: a folha protege o
ponteiro, e a página pode estar pintada com o modo de um tique atrás. Tirar a
recusa deixaria o único caminho aberto sem guarda.

**A MORDIDA:** arranque o `pointer-events` e clique no interruptor com o modo
em "Jogar pelo Hefesto". A régua tem de ver o gesto ser CHAMADO — hoje ele é, e
depois desta sprint não pode mais ser. E arranque também o `not-allowed` do
pai: a régua tem de acusar o interruptor apagado com cara de clicável.

### P3 · A 22ª linha nasce nas duas telas

`interface/aba06.py:1469` ganha a entrada do PS. As duas tabelas passam a ter
22 linhas, os cinco números da tela acompanham por `len(BOTOES)`, e a
autoconferência de `:2554` passa a exigir 22 `data-gesto` de linha.

**O REMAPEAMENTO GANHA A LINHA JUNTO, e isso é consequência e não decisão:** a
segunda tabela nasce da mesma lista, e a lista de DESTINOS já oferecia "PS"
desde sempre. O que muda é que agora o PS também é ORIGEM.

**A MORDIDA:** tire a entrada e rode a autoconferência do gerador
(`interface/aba06.py:2554`). Ela reprova nomeando quantas linhas achou contra
quantas o produto declara — e é a régua que já existe, não uma nova.

### P4 · O `?` para de explicar o que deixou de ser verdade

O parágrafo do PS em `interface/aba06.py:1640` sai. Entra, no lugar, o que ela
precisa saber para usar a linha: **o PS continua sendo a saída de emergência**
— os cinco gestos de `interface/aba06.py:1043` saem dele e segurá-lo alterna o
modo jogo — **e a tecla que ela escolher acontece junto**, no toque curto, sem
combo e fora do jogo.

**A MORDIDA, e ela é a régua velha:**
`tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py:221` afirma
`"ps" not in acoes.BOTOES`. **Ele fica vermelho na hora em que a ONDA5-06-01
pousa, e está certo — é uma régua que mede o mundo de ontem.** Reescreva-o para
medir o mundo de hoje: o PS ESTÁ na lista do produto, e a dica diz o que ele
faz em vez de por que ele falta. **Não o apague** — um caso que some leva junto
a prova de que a decisão mudou.

### P5 · A tira nomeia o segundo dono do PS

`interface/pacotes/a06_navegacao.py:1199` ganha a frase do PS, e ela nasce
**só quando há o que dizer** — como as quatro que já estão lá. O fato: *o PS faz
o que você escolheu **e** continua abrindo a Steam; e num jogo ele não faz
nenhum dos dois.*

**O FATO É LIDO, NUNCA DIGITADO.** O que a linha diz sai do produto — o rótulo
do token por `acoes.rotulo`, o nome do botão por `_nome_do_botao`
(`interface/pacotes/a06_navegacao.py:600`). Uma frase escrita aqui envelheceria
no dia em que a ONDA5-06-01 mudar a precedência, e a tela contaria a versão de
ontem com o motor fazendo outra coisa.

**A MORDIDA:** ponha o PS em `— Nada —` e a linha tem de sumir (não há duas
coisas acontecendo). Ponha uma tecla e ela tem de nascer nomeando as duas. E
arranque a leitura do produto, cravando o texto: a régua tem de reprovar quando
o rótulo do token mudar do outro lado e a tira continuar dizendo o velho.

---

## 5. AS TRÊS QUE JÁ ESTÃO FECHADAS — não refaça nenhuma

**Medido nesta árvore antes de escrever uma linha desta sprint.** A escolha dela
de hoje coincide com o que já está no produto nas três:

| decisão | o que ela escolheu | onde já está |
| --- | --- | --- |
| **06-Q2** as três regiões do touchpad | *Aviso fixo ao lado* | `interface/aba06.py:1462` (a marca), `:1500`, `:1501`, `:1502` (as três linhas), `:746` (a folha) e `:1640` (o `?` que a explica). Na página publicada são **seis** ocorrências, porque a primeira coluna é a mesma nas duas telas |
| **06-Q4** as verdades que a tabela esconde | *Tira de aviso sob a tabela* | `interface/aba06.py:1967` (o lugar) e `interface/pacotes/a06_navegacao.py:1199` (as quatro frases). A confirmação do "Voltar ao padrão" **já usa a palavra atalhos** — `interface/aba06.py:1987` |
| **06-Q5** o custo de desligar o teclado | *Enquanto estiver desligado* | `interface/pacotes/a06_navegacao.py:478` (a lista, lida da GTK) e `:482` (a linha tri-estado), com lugar em `interface/aba06.py:1809` |

**O que a marca do touchpad ainda NÃO é:** ela nasce **fixa**. A marca viva —
que acende só quando o touchpad é mesmo o ponteiro do sistema — espera o daemon
publicar esse dado, e continua sendo sprint própria. A escolha dela desta
rodada não a pede: *"Aviso que acende sozinho"* era a segunda opção e ela não a
marcou.

---

## 6. NADA SE PERDEU

Toda linha aqui é requisito:

* **um endereço só continua alimentando as duas metades do portão.** A razão e
  a tinta saem de `modo-portao` (`interface/aba06.py:1806`); não nasce segundo
  campo, porque com dois seria possível pintar um interruptor apagado sem razão
  ou uma razão sem interruptor apagado;
* **o interruptor continua nascendo em `—`.** Antes do primeiro tique ninguém
  perguntou ao Hefesto, e "Desligado" seria uma afirmação
  (`interface/aba06.py:1583`);
* **a palavra continua vindo do daemon e só dele**
  (`interface/pacotes/a06_navegacao.py:1420`), com a régua parametrizada nos
  dois lados em `tests/unit/test_a_06_o_status_do_modo_nao_mente.py:120`;
* **o gesto `modo` continua fazendo as duas chamadas na ordem** — mouse antes,
  teclado depois — e continua gravando os dois lados no perfil junto
  (`interface/pacotes/a06_navegacao.py:1940`);
* **a memória do clique não é tocada.** `_reservar`/`_largar_a_reserva`
  continuam desfazendo o pedido que o Hefesto recusou;
* **a marca das três regiões do touchpad não muda**, e não encosta na linha
  nova do PS. A régua que garante isso é
  `tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py:194`, e ela conta as
  ocorrências: uma linha a mais na tabela não pode fazê-la contar errado;
* **as quatro frases da tira continuam nascendo só quando há o fato delas.** A
  do PS é a quinta e obedece à mesma regra — tira que fala sempre é tira que
  ninguém lê;
* **a ordem das 21 linhas de hoje não muda.** O PS entra numa posição, não
  reorganiza nada.

---

## 7. A PROVA DE TELA — e ela é obrigatória

**Foto antes e depois, `--oculta` sempre.** Ela tem UMA tela e está trabalhando
agora; janela que nasce na frente dela quebra o que ela está fazendo.

Quatro cenas, e as quatro são o que esta sprint mudou:

1. **o interruptor apagado com o mouse LIGADO** — o pino verde, a palavra
   "Ligado", a borda apagada. É a cena que hoje não existe e que o
   esclarecimento dela descreve;
2. **o interruptor apagado com o mouse DESLIGADO** — a mesma borda, o pino
   apagado. **As duas fotos lado a lado são a prova**; uma só não prova nada,
   porque o defeito é justamente elas serem iguais;
3. **o clique recusado pelo ponteiro** — o cursor de recusa sobre a linha, e o
   gesto não sendo chamado;
4. **a tela "Definições Controle e Mouse" com a linha do PS**, o `<select>`
   aberto, e a tira embaixo nomeando as duas coisas que o PS faz.

**E o CLIQUE.** Escolha uma tecla para o PS, clique "Guardar", e mostre a
resposta. **Botão que você acrescentou e nunca clicou não está entregue** — foi
assim que o `--prova-gesto` deu verde sobre dois botões mortos em 29/08.

---

## 8. O QUE VOCÊ RELATA EM VEZ DE EDITAR

* **o "deu certo" desta aba, e é o ponto mais delicado da leva.** A decisão de
  hoje (03-Q4) diz que o sucesso é **o campo piscando em verde por ~1,5 s, sem
  palavra nova na tela**. O piloto diz o contrário, por escrito:
  `interface/hefesto_vivo.py:2230-2233` registra que *o campo que pisca* foi
  RECUSADO por ela em 04/09 (conflitos C-3 e C-6) e manda **"Não construa
  nenhum dos dois"**. **A palavra dela de hoje vence o comentário de ontem**, e
  o comentário é de arquivo da ONDA 0. O "Guardar" desta aba deposita recado por
  aquele caminho — **não o mude aqui**. Relate, com estas duas citações lado a
  lado: é uma régua de prosa medindo o mundo de ontem, e a terceira desta
  rodada;
* `docs/data/paridade-gtk-html.csv:195` (o portão de modo) e `:207` (a tabela,
  que diz *"21 linhas"*). O CSV tem UM dono por leva — **liste as duas linhas
  que você fechou**, não as edite;
* `app/actions/mouse_actions.py:299` é a janela GTK, e ela apaga o switch desde
  sempre. Ela não é desta posse e não muda: a frase dela manda para a aba
  "Início", que não existe no desenho das dez;
* `interface/pacotes/a06_navegacao.py:11` — o cabeçalho diz que *"método de IPC
  nenhum escreve"* o `ps_button_action`, e a nota que o corrige aponta para
  `ipc_handlers.py:4556`/`:4567`, que hoje são outro código. **Este arquivo É
  seu**: corrija a prosa com os números que a ONDA5-06-01 mediu — `:5450` e
  `:5462-5463` — em vez de relatar.

É a R1 da casa: quando o conserto pede arquivo alheio, relate em vez de editar.

---

## 9. O DESENHO NÃO SE PUBLICA SOZINHO

A linha do PS muda a altura das duas telas de botões, e altura é desenho. O que
precisar de endereço novo vai para `mockup/06-navegacao.html` com a seção
declarada em `mockup/DIVERGENCIAS.md`, e **para ali**. A publicação é uma leva
só, para o olho dela — é a `PROVA-DE-TELA-01`, e é a regra mais velha desta
casa.
