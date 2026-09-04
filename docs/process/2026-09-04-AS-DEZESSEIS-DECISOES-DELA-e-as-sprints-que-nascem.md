# As dezesseis decisões dela, e as sprints que nascem delas

**04/09/2026, madrugada.** Ela pediu, com estas palavras:

> *"me manda as decisão eu decido. vc registra em sprints pro hands off pra
> termos na próxima leva o produto inteiro. que decisões minha são essas?"*

E ao fim: *"continua pra que possamos materializar e encerrar o pc."*

Este arquivo é o registro. **§1 são as decisões que ela tomou** — cada uma com o
que estava em jogo, a opção escolhida e o que ela fecha. **§2 é a fila de
sprints** que nasce delas. **§3 são as 54 decisões que a leva levantou e que
ela ainda não viu** — a fila da próxima conversa.

**A REGRA QUE ISTO CUMPRE** é dela, de 31/08: *"fila combinada com ela vira
arquivo no mesmo dia."* A fila do dia vivia só na conversa, e quando ela
perguntou *"e a onda 5?"* a numeração já tinha morrido.

---

## 1. AS DEZESSEIS DECISÕES

### D-01 · O recado de SUCESSO mora no próprio cartão

**Em jogo:** a interface nova só fala quando RECUSA. Um gesto que dá certo
imprime `[gesto] … → aplicado` no terminal, e ela não vê. Cinco linhas do CSV
paravam neste mesmo buraco (abas 02, 03, 05, 06 e 09).

**ELA ESCOLHEU:** *"No próprio cartão, como a recusa."*

A frase pousa onde ela clicou — na coluna do controle, no cartão do jogo. O
endereço já existe: `hefesto_vivo._recusou_dizendo` faz exatamente isso hoje
para o erro. **Fecha cinco linhas com uma peça.**

### D-02 · A ressalva é linha fixa, e só quando existe

**Em jogo:** as ressalvas que explicam um valor estranho — *"em Nativo o jogo é
dono do LED"*, *"a Steam segurou"*, *"barra apagada"* — vivem só no `title` de
hover. Medido: a cura de quatro das cinco conferências da aba 08 chega à tela
SÓ dentro de um tooltip.

**ELA ESCOLHEU:** *"Linha fixa só quando HÁ ressalva."*

No estado normal não ocupa nada. No estado estranho nasce uma linha curta ao
lado do valor. Respeita a regra dela de 30/08 (*"texto na interface é zero"*) e
cura o caso em que o silêncio engana.

### D-03 · O botão que vai recusar fica CINZA antes

**Em jogo:** mudo sem endereço, microfone no cabo, *"a luz não acende"* com o
controle no cabo. A janela antiga apaga o botão e diz por quê ANTES; a nova
deixa clicar e responde DEPOIS — e a tela em repouso não distingue o botão que
funciona do que vai recusar.

**ELA ESCOLHEU:** *"Cinza antes, com a razão na dica."*

**Custo declarado e aceito:** a folha desta interface não tem estado apagado
para `.btn` — é CSS novo, e mexe no que ela aprovou.

### D-04 · "Player N" FICA

**Em jogo:** o cartão escreve *Player 1*, e esse número é o slot da sessão, não
o jogador. A janela antiga separa os dois de propósito (`numero_do_controle`
responde "quem é este controle", `player` responde "está jogando agora").

**ELA ESCOLHEU:** *"Player N, como está hoje."*

**Esta é a decisão contra a minha recomendação, e ela vale.** Nenhuma sprint
nasce daqui; a linha do CSV passa a ser DELA, não dívida.

### D-05 · "cabo" e "rádio", pela função que já tem dono

**Em jogo:** o cartão escreve `USB`/`BT` com um `if` inline, e existe
`palavra_do_transporte` no produto dizendo `cabo`/`rádio` — duas traduções do
mesmo fato, que é a doença que esta casa persegue.

**ELA ESCOLHEU:** *"cabo / rádio, pela função que já existe."*

A função tem um terceiro estado honesto para o transporte desconhecido, que o
`if` não tem.

### D-06 · Casco na borda externa, barra de luz na borda interna

**Em jogo:** o cartão é tingido pela cor do CASCO. A janela antiga tinge pela
cor VIVA da barra — é o que faz reconhecer de relance qual cartão é qual na
mesa de quatro.

**ELA ESCOLHEU, e não era uma das três opções que ofereci:**
*"Casco borda externa lightbar borda interna."*

As duas cores, cada uma no seu anel. O desenho do controle guarda o plástico; o
anel interno segue a luz que o aparelho está mostrando agora.

### D-07 · A mesa vazia ganha uma frase

**Em jogo:** com zero controles a aba mostra quatro lugares apagados e nenhuma
palavra. O quinto controle some calado — `pintar` procura `[data-controle="p5"]`,
não acha, e segue sem contar pintura nem erro.

**ELA ESCOLHEU:** *"Uma frase por cima dos lugares apagados."*

A decisão dela de 31/08 (*"o lugar apagado ensina que ali cabe um"*) fica: os
lugares continuam. O que muda é que o estado vazio deixa de ser mudo. O `+N` do
quinto entra na mesma linha.

### D-08 · Deslizante de volume nos DOIS

**Em jogo:** não há como mudar o volume do microfone nem o do alto-falante pela
interface nova. Os dois números na tela são do mockup (80 e 100). O daemon
atende os dois pedidos (`mic.volume.set` e a rota do alto-falante).

**ELA ESCOLHEU:** *"Deslizante nos dois."*

Mesma peça da barra de vibração que ela já aprovou, e grava na hora.
**Custo declarado:** ~24 px por bloco no cartão, e o mockup da 02 a republicar.

### D-09 · A coluna Atenção cresce até três linhas

**Em jogo:** a página tem UM par selo/texto e a conta do produto diz *"3
avisos"* — dois achados não têm onde aparecer. E o único que aparece hoje é uma
BOA notícia (*"Economia de energia desligada"*) sob o cabeçalho laranja, porque
`_do_exame` monta `{"selo": …, **i}` e o `**i` sobrescreve.

**ELA ESCOLHEU:** *"Até três linhas, o mais grave em cima."*

Com `+N` se passar de três. Cresce quando a máquina está ruim, e não ocupa nada
quando está boa.

**A DÚVIDA QUE EU LEVANTEI AQUI MORREU COM UMA MEDIÇÃO.** Eu avisei que crescer
a coluna podia reabrir o vão de 38 px que ela reclamou em 31/08 — o gerador da
aba 01 tem portão de altura, e as colunas irmãs terminam no mesmo y. Ela
respondeu *"vc decide esse"*, e a medição decidiu por mim:

    grep -c 'data-campo="aviso-selo"' interface/paginas/01-jogar.html  →  4

**A página já tem QUATRO pares `aviso-selo`/`aviso-texto`.** Três nascem vazios,
e o defeito nunca foi falta de lugar — foi o piloto escrever só no primeiro
(`hefesto_vivo.py:407` distribui a lista por ordem e escreve `''` no que sobra).

Então: **zero pixel novo, zero risco de vão, e o mockup não é republicado.** Os
quatro lugares que já existem passam a ser usados, o mais grave em cima, e o
`+N` entra no quarto quando passar de quatro. A altura não muda porque a altura
já estava paga.

### D-10 · As três frases órfãs da aba Jogar entram na coluna Atenção

**Em jogo:** *"Ponte com o jogo: nenhuma"*, o cadeado *"não trocar de perfil
sozinho"* (pedido dela de 23/07, e QUENTE agora — o detector está cego nesta
máquina) e o aviso de PAUSA. Nenhuma tem lugar na aba nova.

**ELA ESCOLHEU:** *"Todas na coluna Atenção."*

Zero lugar novo: entram na coluna que a D-09 acabou de dimensionar.

### D-11 · O efeito pronto continua aplicando na hora e trocando o modo

**Em jogo:** a janela antiga PREENCHE os controles e deixa o modo onde está; a
nova aplica na hora e troca o modo por baixo — consequência da decisão dela de
01/09 (*"clicar já aplica"*).

**ELA ESCOLHEU:** *"Aplica na hora e troca o modo, como hoje."*

**Nenhuma sprint nasce daqui.** A linha do CSV passa a ser decisão dela.
**Custo declarado e aceito:** o `<select>` de modo muda sozinho depois de ela
mexer noutro campo.

### D-12 · O botão do microfone liga o microfone E o canal dele

**Em jogo:** eu levei isto como *"duas camadas se contradizem"* — o selo da
interface nova fala do firmware, o da janela antiga fala do PipeWire — e ofereci
três arranjos que GUARDAVAM a contradição. Ela recusou os três e escreveu
*"fazer eles se conversarem"*.

Ao detalhar o trabalho eu ainda li isso errado, como *"o Hefesto força o
PipeWire a acompanhar o firmware"* — dois estados independentes, um mandando no
outro. **Ela corrigiu o CONCEITO:**

> *"tá errado o conceito da coisa. o botão é pra ligar o microfone e ele ser
> ouvido no canal específico dele."*

**NÃO SÃO DUAS CAMADAS COM DUAS VERDADES. É UM ATO SÓ.** O botão do microfone
tem um trabalho: **ligar o microfone do controle e fazer com que ele seja ouvido
no canal dele**. As duas pontas não são dois estados a conciliar — são as duas
metades do mesmo ato, e o ato só está feito quando as duas estão feitas.

O que isso muda no trabalho, e é bastante:

* **o gesto** deixa de ser "manda `mic.set` e pronto": ligar o microfone é
  não-mudo no firmware **e** o canal de captura daquele controle ativo e audível
  no PipeWire. Se a segunda metade não acontecer, o gesto **não** deu certo;
* **o selo** deixa de perguntar "de que camada eu falo". Ele diz se o microfone
  está ligado e sendo ouvido — que é a única coisa que ela quer saber;
* **o recado da D-01** ganha o caso em que a primeira metade vai e a segunda
  não: *"o microfone ligou, mas o canal dele está mudo no sistema"* — e aí sim é
  uma frase, porque há o que fazer.

**A LIÇÃO, e é a segunda do dia:** eu construí um problema de arquitetura
("conciliar duas camadas") em cima de um ato que o produto tem de fazer inteiro.
Quando ela recusa todas as opções que ofereço, a hipótese certa não é que falta
uma quarta opção — é que a pergunta está errada.

### D-13 · O "Cores automáticas" ganha interruptor no topo da Iluminação

**Em jogo:** o campo governa a paleta E a numeração automática (inclusive dos
externos) — na janela antiga é o martelo mais pesado da aba. Pelo HTML ela não
vê o estado nem pode mudá-lo, e o perfil dela está com ele LIGADO.

**ELA ESCOLHEU:** *"Um interruptor no topo da aba Iluminação."*

**Custo declarado:** ~30 px fixos, e o mockup da 04 a republicar.

**E ELE CARREGA UMA CONTRADIÇÃO QUE ELA RESOLVEU NA HORA.** O interruptor abre o
caminho que a regra dela de 03/09 proíbe (*"nenhuma cor dos controles nunca pode
ser a mesma"*): com o automático desligado, o controle que chega depois não tem
cor própria e cai na cor GLOBAL do perfil — o seguinte também, e dois ficam
iguais. Hoje isso não acontece só porque não há como desligar o automático pela
interface nova; o interruptor tira essa proteção acidental.

Ofereci três saídas — avisar, recusar, ou gravar. **Ela escolheu a terceira:**

> *"ok aceito o caminho"*

**Desligar o automático GRAVA a cor de cada controle no ato.** O automático sai,
nenhuma cor se perde e nenhuma se repete. A regra dela fica cumprida sem o
produto nunca dizer não a ela.



### D-14 · Uma linha de estado da vibração por coluna

**Em jogo:** a vibração tem três estados e a aba mostra um. Com
`rumble_passthrough=False` e `rumble_active=[160,220]` a janela antiga grita
*"travada em fraca=160, forte=220"* e a nova fica muda — que é exatamente o
estado da queixa *"testei os motores e o jogo não vibra mais"*.

**ELA ESCOLHEU:** *"Uma linha de estado por coluna."*

*"O jogo controla"* / *"travada em silêncio"* / *"travada em fraca=X, forte=Y"*.

### D-15 · As três regiões do touchpad FICAM — e a premissa da pergunta caiu

**Em jogo:** eu levei a ela como um conflito entre duas decisões suas com seis
semanas de distância — a interface nova oferece as três regiões do touchpad na
tabela de atalhos, e a janela antiga as removeu.

**ELA CORRIGIU O ENUNCIADO:**
*"Pedi pra tirar o texto não o touch mostrando os toques."*

**Não havia conflito.** O que ela mandou remover em julho foi o TEXTO — não o
touchpad como entrada. As três regiões ficam na tabela, e a decisão antiga
nunca disse o contrário. A linha do CSV que chamava isso de *"duas decisões
dela em conflito"* está ERRADA e leva correção.

**A lição, e ela é de processo:** eu construí um conflito lendo duas decisões
suas por cima. Quando duas escolhas dela parecem se contradizer, a primeira
hipótese é que eu li uma delas errado.

### D-16 · O Check-up ganha uma linha de veredito

**Em jogo:** cinco pílulas e nenhum veredito — a janela antiga responde *"está
tudo certo?"* numa linha em cima. E um problema REAL e um *"podia estar
melhor"* caem hoje na mesma pílula laranja, porque a quarta cor está no mockup
e não na página publicada.

**ELA ESCOLHEU:** *"Uma linha de veredito no topo."*

Na cor do pior achado. A quarta cor entra junto — ela já está desenhada,
esperando o `--publicar` da 08.

---

## 2. A FILA DE SPRINTS QUE NASCE DAS DEZESSEIS

Catorze decisões geram trabalho (a D-04 e a D-11 confirmam o que já existe). A
ordem abaixo é por DESBLOQUEIO, não por peso: as três primeiras são peças que
as outras usam.

| # | sprint | fecha | de quem depende |
| --- | --- | --- | --- |
| **S-01** | O canal de recado no cartão (D-01) | 5 linhas do CSV, em 5 abas | — |
| **S-02** | A linha de ressalva condicional (D-02) | ~8 linhas, em 5 abas | — |
| **S-03** | O botão cinza com a razão na dica (D-03) | ~6 linhas, em 3 abas | CSS novo na folha |
| **S-04** | Usar os QUATRO lugares de aviso que a página já tem + as três frases órfãs (D-09, D-10) | 6 linhas da aba 01 | — |
| **S-05** | O botão do microfone liga o microfone E o canal dele (D-12) | 3 linhas, abas 02 e 08 | S-01 |
| **S-06** | Deslizante de volume no mic e no alto-falante (D-08) | 4 linhas da aba 02 | `--publicar` da 02 |
| **S-07** | O interruptor do automático, gravando a cor ao desligar (D-13) | 3 linhas da aba 04, e a regra da cor | `--publicar` da 04 |
| **S-08** | A linha de estado da vibração (D-14) | 2 linhas da aba 05 | S-02 |
| **S-09** | O veredito do Check-up + a quarta cor (D-16) | 3 linhas da aba 08 | `--publicar` da 08 |
| **S-10** | "cabo"/"rádio" pela função dona (D-05) | 1 linha, e mata uma cópia | — |
| **S-11** | Casco fora, luz viva dentro (D-06) | 2 linhas da aba 02 | — |
| **S-12** | A frase da mesa vazia e o `+N` do quinto (D-07) | 2 linhas da aba 01 | — |
| **S-13** | Corrigir o CSV: o touchpad nunca foi conflito (D-15) | 1 linha, e um fato errado | — |

**S-04 SUBIU** para logo depois das três peças de infraestrutura: a medição mostrou que ela não depende de nenhuma delas nem de publicar nada — os quatro lugares já estão na página, e é a aba que ela mais olha.

**S-01, S-02 e S-03 são as três peças de infraestrutura de tela desta leva.**
Fazê-las primeiro faz as dez seguintes custarem metade — é o mesmo padrão dos
QUINZE defeitos de forma de 23/08, em que consertar aba por aba pagaria quinze
vezes o mesmo preço.

---

## 3. AS 54 QUE ELA AINDA NÃO VIU

A leva de dez agentes (uma por aba) levantou **54 decisões** e as afiou até
onde o limite da sessão permitiu. As dezesseis acima saíram daí e de leitura
minha; **as 54 estão em `docs/process/sprints/2026-09-04-DECISOES-DELA-*.md`**,
uma por aba, cada uma com opções, custo em linhas de tela e minha recomendação.

Distribuição: 01-jogar 4 · 02-controles 10 · 03-gatilhos 4 · 04-iluminacao 4 ·
05-vibracao 6 · 06-navegacao 5 · 07-lancadores 4 · 08-conexoes 8 ·
09-sistema 3 · 10-perfis 6.

**Elas NÃO estão respondidas.** São a fila da próxima conversa, no formato que
ela pediu para o `TODO-DELA.md`: um ponto por vez, o próximo depois do OK dela.
