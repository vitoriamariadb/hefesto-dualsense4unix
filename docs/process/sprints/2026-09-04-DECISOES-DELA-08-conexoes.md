---
sprint: DECISOES-DELA-08
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — índice ou folha de decisões, não é sprint
> executável; o que ela lista vive nas sprints filhas e no `SPRINT_ORDER.md`.

# Decisões dela — aba `08-conexoes`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**RESPONDIDAS — pelo PO em 04/09 ([O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md)) e por ela em 05/09 (a [ONDA CINCO](2026-09-05-ONDA-CINCO-INDICE.md)); este arquivo é o registro das opções.** Eram a fila da conversa seguinte, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**8 decisão(ões) · 6 de peso alto**

---

## [01] O Check-up responde em uma linha, ou você lê as cinco pílulas?

**Peso:** alta

Hoje o topo do Check-up só diz QUANDO foi examinado — "Examinado há 3 minutos". Para saber se está tudo certo, você tem de ler as cinco pílulas e achar a pior. A janela antiga responde em uma linha, com a cor do estado mais grave: "3 mudanças recomendadas", "Conferi 5 coisas; 1 não deu resposta", "Nada novo. 2 recomendações você dispensou" ou "Nada a mudar". O produto já conta as duas coisas de que essa frase precisa e as manda para a tela a cada tique (quantos achados e quantos graves, `a08_conexoes.py:2241-2242`); a tela não tem onde recebê-las.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **No cabeçalho, ao lado de "Examinado"** | A frase entra na mesma faixa do título da seção, à esquerda do carimbo de tempo, com a cor do pior estado. Você abre a aba e a primeira coisa que lê é a resposta. | Zero linha nova: a faixa do cabeçalho já existe e hoje só tem o título, o `?` e o carimbo colado na direita — o meio está vazio. Muda o texto do desenho e do gerador. Sem vão novo, sem hover. |
| **Uma sexta linha em cima das cinco** | Ganha selo próprio e a mesma gramática das outras cinco linhas do exame. | Uma linha a mais dentro da seção, SEMPRE — inclusive quando ela diz "Nada a mudar". A coluna do exame já divide altura com a ordem de serviço ao lado. |
| **Nada — as cinco pílulas bastam** | Fica como está. | Zero de tela. Continua sendo você quem procura a pior das cinco, toda vez que abre a aba. |

**Minha recomendação:** No cabeçalho, ao lado de "Examinado" — a faixa já está lá e não diz juízo nenhum; a resposta chega sem custar altura.

**Fecha as linhas:** *Selo/veredito GLOBAL do Check-up*

---

## [02] Publicar as seis curas que estão no desenho e não estão na sua tela?

**Peso:** alta

Medi hoje o desenho contra a página publicada. O `mockup/08-conexoes.html` tem 13 endereços que a página que você usa não tem, em seis campos: a trava do botão "A luz não acende", por onde o microfone chega, o "Ligado/Desligado" do microfone na linha fechada do acordeão, o "— O que é? —" dos rádios vizinhos, e as três da confissão do mapa. O produto já sabe escrever em todos os seis — o código está pronto e não tem onde pousar. Enquanto não publicar: a linha fechada continua dizendo "Microfone Ligado" sobre um controle cuja ponte o arquivo da máquina diz que está desligada (medido em 03/09), e a confissão do mapa continua dizendo "três coisas" quando a sua bancada tem uma lacuna só. CORREÇÃO DO QUE ESTAVA ESCRITO: a quarta cor do selo — o vermelho de "problema", que não pode parecer o laranja de "atenção" — JÁ FOI publicada. Contei hoje: a página tem os cinco endereços e a regra do vermelho. Aquela dívida fechou.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Publicar a aba inteira agora** | Os treze endereços passam a ser da sua máquina de uma vez, e as seis frases param de ser da bancada de exemplo. | Um comando. Seis mudanças aparecem juntas na sua tela, sem você ter olhado uma a uma antes. |
| **Publicar só as duas que corrigem mentira** | Vão o microfone e a trava da luz; ficam os vizinhos e a confissão do mapa para a próxima olhada. | Dois olhares em vez de um. Os outros quatro campos continuam mostrando a bancada de exemplo até a leva seguinte. |
| **Segurar tudo até você olhar o desenho** | Nada muda na sua tela até você fechar o mockup de ponta a ponta. | Zero de risco. E a tela continua afirmando "Ligado" sobre um microfone desligado por mais um dia. |

**Minha recomendação:** Publicar a aba inteira agora — cada um dos seis troca uma constante de bancada por um dado da sua máquina; segurá-los é segurar a correção, não a mudança.

**Fecha as linhas:** *Microfone — a trava no cabo e sem endereço* · *"A luz não acende" — a trava no cabo* · *Rádios vizinhos — gravar a resposta dela*

---

## [03] O "o que fazer" continua morando só no hover?

**Peso:** alta

Quatro das cinco conferências do Check-up escrevem uma cura — o que fazer para resolver. Aqui elas só existem dentro do `?` de cada linha: quem não passar o mouse não descobre. A janela antiga esteve exatamente nesse estado e saiu dele em 25/08, criando um cartão visível, e a nota do código diz por quê com todas as letras: "a cura de quatro das cinco conferências chegava à tela SÓ dentro de um tooltip" (`secao_exame.py:767`). A coluna da direita já existe e fica ociosa boa parte do tempo — quando não há ordem de serviço, ela escreve uma frase só: "Nenhuma mudança recomendada agora."

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Cartão de cura na coluna da direita** | Abaixo da ordem de serviço, um cartão por cura, sem selo — porque uma cura de conferência não tem medição por trás dela. | A coluna já está reservada e hoje escreve uma frase só. Cresce até quatro cartões quando há quatro curas; ao lado, a coluna do exame tem cinco linhas de altura. |
| **Segunda linha embaixo do achado** | Só nas linhas que não estão certas, a cura aparece como uma segunda linha em texto menor. | Até quatro linhas a mais na tira, e só quando há problema. A seção passa a mudar de altura conforme o exame do dia. |
| **Continua só no `?`** | Fica como está. | Zero de tela. E quem não passar o mouse não sabe o que fazer. |

**Minha recomendação:** Cartão de cura na coluna da direita — o lugar do "o que fazer" já é aquele, e está ocioso na maior parte do tempo.

**Fecha as linhas:** *O `?` de cada linha (por que importa + o que fazer)*

---

## [04] A tela diz de onde veio cada frase, ou isso fica só no código?

**Peso:** média

Toda frase de uma ordem de serviço carrega de onde ela veio: "medido aqui", "derivado da conta" ou "especificação de terceiro" — e a terceira exige nomear quem afirmou. Há portão que reprova frase sem essa marca. A janela antiga IMPRIME a marca, em cinza, no fim de cada uma das três linhas do cartão. Aqui ela ficou de fora do cartão E do `?`, e a razão está escrita no código: o balão do `?` tem 330 px de largura e já traz duas frases; um "[medido aqui]" no fim de cada uma competiria com o texto que você foi ler. O que está em jogo é a tela distinguir o que foi MEDIDO do que foi RACIOCINADO — que é o motivo de o selo existir.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Só nas frases que não foram medidas aqui** | "Medido aqui" fica implícito e não aparece; a marca só entra quando a frase é conta ou vem de terceiro. | Um par de palavras em cinza, e só nas frases fracas. O balão de 330 px aguenta uma marca curta. |
| **Nas três, como na janela antiga** | As três linhas do cartão ganham a marca, igual à janela que você já usa. | Três marcas em cinza dentro de um balão de 330 px — o dobro de cinza para ler, e a paridade com a janela antiga em troca. |
| **Em nenhuma; fica no código e no portão** | A procedência continua garantida por teste, e invisível na tela. | Zero de tela. E o cartão que manda mexer no gabinete não diz se o ganho foi medido ou calculado. |

**Minha recomendação:** Só nas frases que não foram medidas aqui — a marca aparece exatamente quando ela muda a sua decisão, e some quando não muda.

**Fecha as linhas:** *Card de ORDEM DE SERVIÇO (o imperativo e as três linhas com selo de procedência)*

---

## [05] A recomendação que você mandou calar — por onde ela volta?

**Peso:** alta

Em 31/08 você tirou os quatro botões do Check-up, e o próprio desenho registrou o que ficou aberto: "sem aquele botão, não há hoje por onde reabrir uma ordem ignorada". O ⊘ de cada linha é porta sem volta — a recomendação só reaparece se você mexer nos cabos. O produto já sabe listar as caladas; só a janela antiga a chama. E há um detalhe medido hoje: o `?` da quinta linha ainda manda você procurar "Ver as ordens ignoradas", um botão que não existe mais. O produto reescreve esse texto a cada exame, mas quando o exame devolve menos de cinco achados, a frase do desenho fica na tela.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A linha fica na lista, apagada** | A recomendação ignorada continua no lugar dela, em cinza, e o mesmo ⊘ desfaz. | Zero lugar novo: a linha já ocupa a fatia dela. Em troca, uma linha calada segura uma das cinco fatias, e o achado seguinte não aparece. |
| **Um "Ver as ignoradas" no cabeçalho** | Aparece na faixa do título, só quando existe alguma calada, e revela as caladas ao clicar. | Duas ou três palavras na faixa do cabeçalho, e só quando há calada. Essa faixa é a mesma que o veredito da primeira decisão quer ocupar. |
| **Não volta — só mexendo nos cabos** | Fica como está. | Zero. E um ⊘ apertado por engano é definitivo até você mudar o gabinete de lugar. |

**Minha recomendação:** A linha fica na lista, apagada — você já sabe onde apertou, e o caminho de volta ser o mesmo botão não custa lugar nenhum na tela.

**Fecha as linhas:** *Reabrir uma ordem ignorada ("Ver as ordens ignoradas")*

---

## [06] Botão que não dá para usar agora: ele avisa antes, e o motivo vai onde?

**Peso:** alta · **Depende de:** A decisão de publicar, acima: a trava da luz só existe na sua tela depois dela.

Dois botões desta aba só valem em certas condições. O microfone tem QUATRO (controle adotado, no rádio, com identificador e com endereço), e o produto tem uma frase diferente para cada motivo: "pelo cabo o microfone já funciona sem esta ponte" é outra coisa de "sem endereço não há onde guardar a quem esta ponte pertence". O "A luz não acende" tem TRÊS. Na janela antiga o botão APAGA e o hover diz o motivo certo. Aqui o microfone fica sempre aceso e recusa depois do clique; a luz apaga (quando publicarmos), mas o hover dela é a frase congelada do desenho — se o controle sair do cabo, a cor muda e o texto continua dizendo "está no cabo". A trava é real e é do motor: cada elemento da tela tem UM endereço, então o mesmo seletor não pode receber o valor e o motivo.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Apaga, e o motivo vira um `?` ao lado** | O botão nasce apagado quando não dá, e um `?` ao lado traz a frase do produto — a certa para o motivo do momento. | Um glifo de 12 px por controle travado. Exige o rato para ler o motivo, e o texto passa a ser do produto, nunca do desenho. |
| **Apaga, e o motivo é uma linha curta embaixo** | O motivo aparece escrito, sem gesto nenhum, e some quando o botão volta a funcionar. | Uma linha por cartão travado, e só quando ele trava. É a única opção que se lê sem passar o mouse. |
| **Apaga, e o hover fica com o texto de hoje** | A cor conta a verdade e a frase do hover é a do desenho. | Zero. E o hover pode dizer o motivo errado — que é exatamente o que acontece com a luz. |
| **Continua aceso e recusa depois do clique** | Fica como o microfone está hoje. | Zero. Você só descobre que não dá tentando. |

**Minha recomendação:** Apaga, e o motivo vira um `?` ao lado — é a sua regra de 30/08 aplicada ("se for de média importância vira tooltip"), custa um glifo e não uma linha, e é a única opção barata em que o texto do hover é do produto.

**Fecha as linhas:** *Microfone — a trava no cabo e sem endereço* · *"A luz não acende" — a trava no cabo*

---

## [07] Quando não cabe na tela, a tela avisa ou cala?

**Peso:** média

Três listas desta aba têm teto cravado no desenho: CINCO linhas de exame, QUATRO rádios vizinhos e UM cartão de ordem de serviço. Na sua bancada há quatro rádios, e o exame de 03/09 devolveu DUAS ordens abertas — a segunda não aparece em lugar nenhum. Nada age sobre o alvo errado (o produto confere a faixa antes de gravar); o que acontece é a tela ESCONDER. A janela antiga desenha uma linha por rádio, sem teto, e tem uma conta pronta que diz quantos ficaram de fora, justamente porque calar seria ausência lida como sucesso.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Um "+N" no fim de cada lista** | Quando sobra, a lista ganha uma última linha dizendo quanto sobrou: "+1 recomendação não coube aqui". | Uma linha curta por lista, e só no dia em que sobra. Hoje ela apareceria uma vez só. |
| **A lista cresce com a máquina** | Sem teto: sete rádios espetados rendem sete blocos. | Nenhuma informação perdida, e a seção deixa de ter altura previsível — o que crescer empurra tudo abaixo dele. |
| **Continua calando** | Fica como está. | Zero. E a segunda recomendação de hoje não existe para quem só olha a tela. |

**Minha recomendação:** Um "+N" no fim de cada lista — é a diferença entre uma tela que não mostra e uma tela que esconde, e só custa linha no dia em que sobra.

**Fecha as linhas:** *Rádios vizinhos — gravar a resposta dela* · *Card de ORDEM DE SERVIÇO (o imperativo e as três linhas com selo de procedência)*

---

## [08] A frase do rodapé do Mapa contradiz o que o seu clique já fez

**Peso:** alta

Você decidiu em 01/09 que clicar já aplica, e o mapa do gabinete obedece: cada um dos seis gestos grava na hora. Mas o rodapé da janelinha continua dizendo "O desenho vale quando você clicar em Aplicar, na barra de baixo da janela." — e o "Aplicar" do rodapé faz outra coisa: a dica dele diz "Vale agora: envia a configuração aos controles na hora. NÃO grava". A frase manda você apertar um botão que não tem nada a ver com o desenho que você acabou de gravar. Ela está nos dois arquivos, o desenho e a página publicada.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Trocar pela verdade** | A linha passa a dizer que cada mudança ali já foi gravada. | A mesma linha, com outro texto. Verdadeira a partir do minuto em que entra, sem esperar nada. |
| **Tirar a linha** | A janelinha fica sem frase de rodapé. | Ganha uma linha de vão, e some a única confirmação de que o clique foi gravado. |
| **A linha vira o recado do que foi gravado** | Nomeia o que mudou ("Entrada 4 · Teclado — gravado") e fica calada quando não há o que dizer. | A mesma linha, e um motor novo: conferi, esta aba não tem canal de recado nenhum hoje. É a única opção que espera código. |

**Minha recomendação:** Trocar pela verdade — é a mesma linha, fica certa na hora e não fica esperando motor.

**Fecha as linhas:** *Mapa do gabinete — os seis gestos (escolher, colocar, tirar, nova entrada, nova extensão, nova face)* · *Onde a declaração da mesa é gravada — o "Aplicar" do rodapé*

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **A QUARTA cor do selo — `problema` não pode parecer `atencao`** — FECHOU, e a medição do CSV envelheceu. Ele diz que a página publicada tem ZERO endereços de estado do selo e que o mockup tem cinco. Contei hoje na página que você usa: cinco endereços, com o alvo de classe e a regra do vermelho escrita na folha de estilo. `problema` já não cai na mesma pílula laranja de `atencao`. Não há o que decidir — a cura está na sua tela.
- **Botão "Já movi — reexaminar" (comparar o arranjo de antes com o de agora)** — Você já decidiu, em 31/08: *"não faz sentido termos o examinar e o reexaminar"*. Os dois faziam a mesma coisa — refazer o exame —, e a comparação que o segundo prometia não estava desenhada em lugar nenhum. A régua o marca como falta porque só sabe comparar com a janela antiga; a decisão é sua e está tomada.
- **Bateria de cada controle na linha do acordeão** — A linha já lê a bateria do aparelho — medido: 85% na sua mesa, não os 100% e 64% que o desenho tinha cravado. O que falta é a BARRA, e o desenho já mandou a barra para a aba Controles: a dica da linha diz isso com todas as letras ("A bateria vem da aba Controles, que é quem a lê do aparelho"). Não sobra escolha aqui.
- **Transporte (cabo/rádio) de cada controle na linha do acordeão** — Já lê o daemon — medido no produto: "Sony • Player 1 • White • USB", o transporte vindo da mesa viva. O que resta é forma de tela, não escolha sua: a janela antiga junta todos num cabeçalho só e marca o primário em negrito PORQUE não tem acordeão; aqui cada controle tem a sua própria linha e diz o seu. É a mesma informação em duas arquiteturas.
- **Card de ORDEM DE SERVIÇO — a parte de "o card é do mockup"** — Essa metade FECHOU em 03/09 e conferi hoje: a coluna da direita tem endereço próprio e o produto a repinta com a ordem da sua máquina. O cartão que mandava "mover o adaptador Bluetooth da Entrada 3 para a Entrada 9" era do desenho e saiu. O que sobra dessa linha e ainda é decisão sua está na quarta decisão (o selo de procedência) e na sétima (o teto de um cartão só).
