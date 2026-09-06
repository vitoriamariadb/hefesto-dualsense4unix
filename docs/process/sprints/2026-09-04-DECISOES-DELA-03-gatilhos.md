# Decisões dela — aba `03-gatilhos`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**RESPONDIDAS — pelo PO em 04/09 ([O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md)) e por ela em 05/09 (a [ONDA CINCO](2026-09-05-ONDA-CINCO-INDICE.md)); este arquivo é o registro das opções.** Eram a fila da conversa seguinte, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**4 decisão(ões) · 2 de peso alto**

---

## [01] Depois de escolher o modo, a tela ainda diz o que ele faz?

**Peso:** média

Na janela antiga há uma frase em itálico embaixo da grade, reescrita a cada troca de modo (`triggers_actions.py:513`). Na tela nova a explicação só existe na dica de cada opção da lista: com a lista fechada, o campo mostra o rótulo e mais nada — a dica do próprio campo é fixa e igual nos oito, 'Gatilho esquerdo — os 19 modos, com a descrição de cada um' (`03-gatilhos.html:1285`, e mais três iguais). Medido hoje, e muda o preço da resposta: desde 03/09 o produto SABE escrever numa dica (`hefesto_vivo.py:181`), então a dica do campo pode passar a ser a do modo escolhido sem uma linha nova de tela. Sua resposta decide se a explicação volta a ficar à vista, volta só no hover, ou não volta — e, se voltar, qual das duas frases o produto usa: a desta tela (62 letras em média) ou a do motor (38).

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Dica do campo, com o texto desta tela** | A dica do campo deixa de ser fixa e passa a ser a explicação do modo escolhido, reescrita a cada tique. Parar o rato sobre o campo fechado com 'Rígido' escolhido mostra: 'Trava dura do começo ao fim do curso. Serve para freio de carro e para arma travada.' | Zero linha de tela, zero vão novo, nenhuma trilha da grade muda. Exige o rato parado cerca de um segundo. Pede uma marca a mais nos oito campos, então o mockup é republicado. |
| **Uma linha de descrição por lado** | Volta a frase em itálico da janela antiga, permanente, debaixo do campo Modo — uma por gatilho, sempre à vista, sem gesto nenhum. | Duas trilhas novas na grade; como as trilhas são compartilhadas pelas cinco colunas (`03-gatilhos.html:669`), são OITO frases na tela ao mesmo tempo. Numa coluna de ~220px o texto desta tela quebra em 3 a 4 linhas (84 letras no pior modo) e o do motor em 2. A aba fica mais alta e o mockup é republicado. |
| **Fica como está** | A explicação continua só na lista aberta, opção por opção, enquanto ela escolhe. | Zero. Depois de escolher, a coluna não diz mais o que aquele gatilho faz — que é a diferença medida contra a janela antiga. |

**Minha recomendação:** Dica do campo, com o texto desta tela — é a sua própria regra ('se for de média importância vira tooltip'), e entre as duas frases a desta tela é a concreta: fala de freio de carro e de espingarda, não de 'barreira rígida numa posição fixa'.

**Fecha as linhas:** *Descrição visível do modo ESCOLHIDO (sem passar o mouse)* · *Dica (tooltip) por modo, com a descrição do que ele faz*

---

## [02] Escolher uma curva pronta pode trocar o modo do gatilho sozinha?

**Peso:** alta

O campo 'Efeito pronto' aparece nos 19 modos — é o seu desenho. A janela antiga só o revela nos dois modos por posição, e lá escolher uma curva enche os dez controles deslizantes SEM mexer no modo; aqui, escolher 'Stop hard' com o gatilho em 'Metralhadora' troca o modo para 'Curva de força' e manda as dez intensidades na hora — e a tela nova não tem os dez deslizantes, então não há como carregar sem aplicar. Esconder a linha nos outros 17 é mais caro do que parece: as trilhas da grade são compartilhadas pelas cinco colunas (`grid-template-rows:subgrid`, `03-gatilhos.html:723`), então esconder no P1 e não no P2 desalinha as colunas, que é justamente o que o desenho existe para impedir. A mesma resposta vale para as cinco curvas de vibração, que se comportam igual.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica como está, e a dica avisa** | O campo continua nos 19 modos e escolher aplica na hora; a dica do campo passa a dizer, antes do clique, que escolher uma curva põe este gatilho em 'Curva de força'. | Zero linha. O campo Modo muda sozinho na frente dela — mas com aviso lido antes, e o atalho de pôr uma curva com um clique só continua de pé. |
| **Campo apagado fora dos dois modos de curva** | Nos outros 17 modos o campo fica desabilitado, mostrando um travessão; para usar uma curva ela escolhe primeiro 'Curva de força' no campo de cima e depois a curva. | Zero trilha nova — a linha continua ocupada, porque é compartilhada —, mas um campo morto em 17 dos 19 modos, oito na tela ao mesmo tempo. E dois cliques onde hoje há um. |
| **Escolher só carrega; um botão aplica** | A curva enche os ajustes na tela e o efeito só sai quando ela mandar, como na janela antiga. | Quebra o seu 'clicar já aplica' de 01/09 neste campo e só neste — dois campos vizinhos passariam a ter regras diferentes. E depende do botão da decisão seguinte existir. |

**Minha recomendação:** Fica como está, e a dica avisa — o desenho é seu, o atalho de um clique é real, e a única dívida que a medição achou é a tela não avisar que o modo vai mudar; isso cabe numa dica e não custa altura.

**Fecha as linhas:** *Quando o campo "Efeito pronto" aparece, e o que escolhê-lo faz* · *As curvas prontas de VIBRAÇÃO por posição*

---

## [03] A coluna do controle ganha um botão para mandar o efeito de novo?

**Peso:** média

O gatilho é comando de ida: o DualSense não devolve o modo em que está, então depois de tirar e pôr o cabo, ou de trocar de perfil, a tela pode continuar certa e o aparelho já ter voltado ao normal. Hoje não há como reenviar o que está na tela — o produto ouve só a MUDANÇA do campo (`hefesto_vivo.py:647`), e reescolher o modo que já está escolhido não muda nada; para reenviar ela precisa escolher outro modo e voltar, o que aplica um efeito errado no meio do caminho. O 'Aplicar' verde do rodapé não substitui: ele manda o que está gravado no disco, não o que ela acabou de escolher. A janela antiga tem 'Aplicar em L2', 'Aplicar em R2' e 'Desligar' por lado.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Nada novo** | Quem quiser reenviar troca de modo e volta ao que queria. | Zero tela. Um efeito errado no aparelho entre os dois cliques, e nenhum caminho óbvio no dia em que o gatilho 'esquecer' o que a tela mostra. |
| **Um botão na faixa que já existe** | 'Mandar de novo' ao lado de 'Guardar esse efeito', aplicando os DOIS gatilhos daquela coluna de uma vez. O 'Desligar' continua sendo o primeiro item do campo Modo, que é onde ele já faz a coisa certa. | Zero trilha nova — a faixa de 34px já está no desenho (`--r-acao`, `03-gatilhos.html:1030`). Um botão a mais por coluna, quatro na tela cheia. Mockup republicado. |
| **Dois botões por lado, como a janela antiga** | 'Aplicar em L2' e 'Aplicar em R2' separados, e um 'Desligar' explícito junto de cada um. | Duas trilhas novas, compartilhadas pelas cinco colunas: de 8 a 12 botões na tela ao mesmo tempo. A aba fica mais alta e o mockup é republicado. |
| **O 'Aplicar' do rodapé passa a ler a tela** | O botão verde que já está lá manda o que está na tela, em vez do que está no disco — e passa a cumprir o que a dica dele já promete. | Zero pixel novo e vale para as dez abas — mas muda o significado daquele botão em todas elas, e o rodapé é território de outra frente, então esta aba fica esperando. |

**Minha recomendação:** Um botão na faixa que já existe — a linha já está desenhada e aprovada, custa zero altura, e um clique cobre L2 e R2 do controle que ela está olhando.

**Fecha as linhas:** *Aplicar o efeito no aparelho* · *"Desligar" — soltar a trava manual sem re-armá-la (R-19)*

---

## [04] Quando o efeito chega ao controle, a tela avisa?

**Peso:** alta

O canal de recado JÁ existe e é um só para as dez abas: quando o produto recusa, a frase pousa dentro da coluna daquele controle e some em 30 segundos — 'é aviso, não estado', palavra sua de 02/09 (`hefesto_vivo.py:98`). Três desfechos já falam: mesa vazia, 'guardado para depois', e a recusa escondida numa resposta de sucesso. O que continua calado é o SUCESSO — a regra escrita hoje no produto é 'cala quando o byte saiu, fala quando não saiu'. Correção de um fato: a medição anterior dizia que fechar isso era 'pôr texto novo na tela (barra de status ou aviso)' — a barra de status não existe nesta interface, e o aviso já existe; o que falta é a sua palavra sobre se o sucesso entra nele.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Continua calado** | A tela só fala quando não deu certo; quando dá certo, o gatilho simplesmente muda na mão dela. | Zero. Ela clica e não sabe se pegou — a queixa que abriu este assunto, e a que faz alguém clicar duas vezes. |
| **A mesma tarja, em verde e curta** | A mesma caixa da recusa, no mesmo lugar, com a frase da janela antiga ('Gatilho esquerdo (L2): Metralhadora'), viva ~4 segundos em vez de 30. | A caixa entra no topo da coluna e empurra a coluna inteira para baixo enquanto vive; com a mesa cheia, até quatro empurrões ao mesmo tempo. |
| **Sem palavra: o campo pisca** | O campo que ela acabou de mexer ganha uma borda verde por cerca de um segundo e meio, e volta ao normal sozinho. | Zero linha, nada muda de lugar, nenhuma palavra nova na tela. Não diz o QUE foi aplicado nem em quantos controles — nesta aba é sempre um, o da coluna em que ela clicou. |
| **Tarja no pé da janela** | Uma faixa fina no rodapé da janela, com a frase, usando o formato que o canal já tem para os gestos sem coluna. | Não empurra nada e não some ao rolar. Mas fica longe de onde ela clicou, e com dois controles na mesa só o texto diz de qual coluna é. |

**Minha recomendação:** Sem palavra: o campo pisca — é a única que responde 'meu clique pegou?' sem gastar linha nem mover a coluna, e casa com o seu 'texto na interface é zero'. Se você quiser a palavra escrita, a tarja verde curta é a segunda.

**Fecha as linhas:** *Dizer na tela o desfecho: aplicado × guardado para depois × nada aconteceu*

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **Editar em "Todos" — mexer no gatilho de toda a mesa de uma vez** — É motor, não desenho. A aba nunca escreve a seção global do perfil, e a coluna por controle já é decisão sua. Enquanto o motor não existir não há lugar de tela a escolher — e o preço que se paga hoje é no ARQUIVO do perfil (um ajuste por controle em vez de um para todos), não na tela.
- **A lista de 19 modos abre e se deixa escolher no compositor dela** — Não é escolha, é medição que falta. A janela antiga trocou a lista suspensa por botões porque o compositor fechava a lista no clique, e ninguém mediu se a lista da tela nova faz o mesmo na máquina dela. Isso se resolve clicando na tela viva, não perguntando a ela.
- **O rascunho acompanha a tela, para o "Salvar Perfil" do rodapé gravar o que ela vê** — Defeito do rodapé, sem alternativa de desenho: hoje o 'Salvar Perfil' grava o que já estava no disco e a escolha dela se perde calada. Não há duas opções a pesar — há uma cura a fazer, e ela é do rodapé, que atende as dez abas.
- **Gravar a configuração do gatilho no perfil, por controle** — Pura implementação, e é defeito de tempo: o 'Guardar esse efeito' lê a coluna, mas a coluna volta ao disco meio segundo depois do clique no modo, então às vezes ele grava o que já estava lá. Nenhuma palavra nem lugar de tela depende da resposta dela.
- **Reconhecer QUAL curva pronta está salva no perfil** — Já é ganho da tela nova sobre a antiga e não há alternativa a pesar: a janela antiga desiste e escreve 'Personalizar' sobre uma curva que ela saberia nomear. O CSV registra 'não remover' — não é pergunta.
