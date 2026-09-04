# Decisões dela — aba `06-navegacao`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**ELAS NÃO ESTÃO RESPONDIDAS.** São a fila da próxima conversa, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**5 decisão(ões) · 2 de peso alto**

---

## [01] O interruptor do Modo apaga quando você está jogando, ou continua clicável e diz não depois?

**Peso:** média

Hoje o "Status do Modo" aceita o clique e recusa DEPOIS, por escrito, num recado que dura 30 segundos no cartão (`hefesto_vivo._recusou_dizendo`, `SEGUNDOS_DO_RECADO = 30.0`). A janela antiga faz o contrário: apaga o interruptor ANTES de qualquer clique (`mouse_actions.py:299`, `blocked = mode != MODE_DESKTOP`) e deixa a razão escrita ao lado o tempo todo. Confirmei que a tela nova não mente mais — o `<label>` perdeu o `<input type=checkbox>`, então o clique recusado não mexe em nada, e em 03/09, com o daemon em modo gamepad, os dois cliques recusaram e a tela ficou em "Desligado" do começo ao fim. O que continua diferente é só o MOMENTO: você gasta o clique para descobrir. A razão do portão é séria e está escrita no produto — ligar o mouse jogando derruba o controle virtual e os jogadores do co-op, em silêncio.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica como está** | O interruptor continua clicável em qualquer modo. Você clica, e a frase "o degrau se troca na aba Jogar" aparece no seu cartão por 30 segundos. | Zero linha de tela e nada a publicar. O preço é um clique gasto e meio segundo de espera cada vez que você tenta fora do modo "Controlar o PC". |
| **Apaga o interruptor e escreve ao lado** | Fora de "Controlar o PC" o interruptor fica apagado e sem resposta, e a razão aparece como frase permanente na tira de estados que já existe logo abaixo do quadro — a mesma tira onde já moram as três linhas do mouse e do teclado. | Uma linha na tira, e só enquanto o modo não for "Controlar o PC": a regra `.estado:empty{display:none}` some com ela sozinha. Sem hover. Exige publicar o desenho. |
| **Apaga o interruptor e a razão fica no ?** | O interruptor apaga do mesmo jeito, mas a explicação entra na dica `?` do "Status do Modo" — que hoje fala de outra coisa ("Vale para este perfil… enquanto estiver em Nunca") e não cita o portão. | Zero linha na tela. Em troca, exige o rato parado em cima do `?` para descobrir por que o interruptor está apagado — e um interruptor apagado sem razão visível é a pergunta que mais volta. |

**Minha recomendação:** Apaga o interruptor e escreve ao lado — a tira de estados já existe, já se esconde sozinha quando não há o que dizer, e é o único jeito de você saber antes de gastar o clique.

**Fecha as linhas:** *Portão de modo: impedir ligar o mouse fora de "Controlar o PC"*

---

## [02] As três linhas do touchpad ficam na tabela? Medi hoje: elas não disparam nada nesta máquina.

**Peso:** alta · **Depende de:** A marca VIVA (que acende e apaga conforme o touchpad) depende de o daemon passar a publicar o `ponteiro_do_sistema` do leitor no estado — hoje ele só existe dentro do daemon. Uma marca de frase fixa não depende de nada.

São duas decisões suas em conflito, com seis semanas entre elas: em 09/08 você tirou as regiões do touchpad da janela antiga ("o touchpad voltou a ser o mouse do computador"), e em 27/08 você pediu as três de volta na tela nova ("o touchpad tem o click pra esquerda, linha do clique direita linha do click centro"). A medição que faltava eu fiz agora, e ela decide o fato: a regra de udev instalada nesta máquina (`76-dualsense-touchpad-libinput-ignore.rules`) só esconde os touchpads VIRTUAIS do Hefesto — o touchpad físico do DualSense continua sendo o ponteiro do sistema. Com isso, `daemon/subsystems/keyboard._combine_with_touchpad:442` se cala e as três regiões nunca chegam ao teclado virtual. Ou seja: as três linhas da tabela aceitam a sua escolha, gravam no perfil, e o clique no touchpad não digita nada — e a tela não diz uma palavra sobre isso. É exatamente o que a janela antiga removeu para não fazer.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Ficam, com a marca de que não disparam** | As três linhas continuam editáveis, mas ganham uma marca ao lado do nome dizendo que esta versão não as dispara enquanto o touchpad for o mouse do computador. A sua decisão de 27/08 fica de pé e a tela para de prometer. | Nenhuma linha nova — a marca cabe na coluna do nome. Uma frase a mais no `?` da tela de botões. Exige publicar o desenho. Se você quiser a marca VIVA (acende só quando o touchpad é do sistema), o daemon precisa passar a publicar esse dado, que hoje ele não publica. |
| **Saem da tabela e viram uma frase** | As três linhas desaparecem da tabela e uma frase abaixo dela diz quais atalhos o perfil ainda guarda, por que não são oferecidos, e que nada nesta aba os apaga. É a resposta que a janela antiga já dá. | A tabela cai de 21 para 18 linhas — e as duas telas de botões deixam de ter o mesmo número, o que muda também o texto das duas confirmações. Uma a duas linhas ocupadas embaixo da tabela. Exige publicar o desenho e desfaz a sua decisão de 27/08. |
| **Ficam como estão** | Nada muda. As três linhas continuam oferecendo Backspace, Enter e Delete, e continuam sem acender nada nesta máquina. | Zero de tela e zero de trabalho. O preço é a tela oferecer três escolhas que não acontecem, sem aviso — e você descobrir clicando no touchpad. |

**Minha recomendação:** Ficam, com a marca de que não disparam — é a única opção que mantém o que você pediu em 27/08 e ao mesmo tempo impede a tela de prometer um clique que o produto não dispara.

**Fecha as linhas:** *As três regiões do touchpad na tabela*

---

## [03] O botão PS ganha uma linha na tabela de botões?

**Peso:** baixa

A janela antiga oferece o PS entre os botões a que se dá uma tecla; a tela nova não o tem — são 21 linhas, e `ps` não está entre elas. Medi o que aconteceria se entrasse: o PS já tem QUATRO donos hoje. Sozinho, ele abre e foca a Steam (e isso é ajustável: `steam`, `nenhum` ou um comando seu); segurado, ele alterna o modo jogo; e ele é a base dos quatro combos que a própria aba mostra — PS+Options suspende mouse e teclado, PS+cima e PS+baixo trocam de perfil, PS+analógico direito sobe o degrau de conexão. Como o botão do PS chega ao teclado virtual pelo mesmo caminho dos outros, dar uma tecla a ele na janela antiga faz o PS fazer as DUAS coisas ao mesmo tempo — abre a Steam e digita. Não há decisão escrita em lugar nenhum sobre isso; a tela nova simplesmente não o listou.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica fora, e a razão vira dica** | A tabela continua com 21 linhas. O `?` da tela de botões passa a dizer que o PS não entra porque ele é a saída de emergência — os quatro combos e o modo jogo — e que dar uma tecla a ele faria o botão fazer duas coisas. | Zero linha de tela: entra numa dica que já existe. As duas telas de botões continuam com o mesmo número de linhas, e as duas frases de confirmação continuam certas. Exige publicar o desenho. |
| **Entra como 22ª linha, só de leitura** | O PS aparece na tabela como as outras, mas sem lista para escolher: a segunda coluna mostra o que ele já faz (abrir a Steam, e os combos). A tabela para de parecer incompleta. | Uma linha a mais nas duas telas de botões, e as duas confirmações passam a dizer 22. Uma linha que não se pode mexer no meio de 21 que se pode. Exige publicar o desenho. |
| **Entra editável, como os outros** | O PS ganha a mesma lista das outras 21 linhas e você pode dar uma tecla a ele, como na janela antiga. | Uma linha a mais nas duas telas. O preço real não é de tela: escolher uma tecla ali faz o PS digitar SEM parar de abrir a Steam, e nenhum aviso da tabela cobre isso hoje. |

**Minha recomendação:** Fica fora, e a razão vira dica — o PS é o único botão que serve de saída de emergência, e a única opção que não arrisca isso é a que custa zero de tela.

**Fecha as linhas:** *O botão PS na tabela de atalhos*

---

## [04] A tabela de botões esconde três verdades. Onde elas aparecem?

**Peso:** alta

A janela antiga tem duas frases fixas abaixo da lista que a tela nova não tem, e elas cobrem coisas que eu medi e continuam valendo. (1) UM BOTÃO PODE TER DOIS DONOS: de fábrica o R3 é "Botão do meio" para o mouse e "Fechar o teclado na tela" para o teclado, e ele faz os dois; a tabela mostra só o do mouse (`acoes_de_botao.padrao()` documenta a colisão em `:214-218`). (2) O PRIMEIRO "GUARDAR" APAGA O QUE VOCÊ ESCREVEU NA JANELA ANTIGA: quando o perfil ganha as escolhas desta tabela, o produto reescreve o conjunto INTEIRO de atalhos a partir do de fábrica e nunca consulta o que você digitou à mão — e no mesmo gesto o R3 para de fechar o teclado na tela. O arquivo continua mostrando os dois campos, como se os dois valessem. (3) A LISTA DA TELA É FECHADA: 26 opções, sendo doze teclas soltas e dois combos fixos (o CSV diz "quatorze teclas e dois combos"; são quatorze no total, contei). Qualquer letra, F5 ou Ctrl+W que você tenha escrito na janela antiga não tem como ser dito aqui. Em qualquer das opções abaixo, a frase de confirmação do "Voltar ao padrão" ganha a metade que falta: hoje ela diz "as 21 linhas de o que cada botão faz" e não usa a palavra atalhos, sendo que apaga os dois campos, direto no disco, sem desfazer.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Uma tira de aviso sob a tabela** | Abaixo da tabela nasce a mesma tira que a janela antiga tem: nomeia os botões que não digitam nada, avisa quais deles já são do mouse, e — quando o perfil guarda atalhos que esta lista não sabe dizer — nomeia esses atalhos e diz que guardar aqui vai substituí-los. | Uma a duas linhas ocupadas, e só quando há algo a dizer (a tira se esconde vazia, como a de estados já faz). Sem hover. Exige publicar o desenho. |
| **Tudo no ? do cabeçalho da tela** | As três verdades entram na dica `?` que já existe no topo da tela de botões, junto do texto que hoje explica de onde vem a lista. | Zero linha de tela — é a sua regra de 30/08 aplicada ao pé da letra. Em troca, exige o rato no `?`, fica longe da linha de que fala, e o aviso do que vai ser APAGADO só é lido por quem já foi procurar. |
| **Uma marca na própria linha** | A linha afetada ganha uma marca discreta que, no hover, diz o que aquele botão tem de particular — o R3 fazendo duas coisas, a linha cujo atalho seu vai ser substituído. | Zero linha nova: a marca cabe na coluna do nome. Aponta a linha exata. Mas exige hover, e não alcança o aviso que não é de nenhuma linha — o de que guardar aqui reescreve o conjunto inteiro. |

**Minha recomendação:** Uma tira de aviso sob a tabela — o que está prestes a ser apagado não pode morar num hover, porque ninguém passa o rato onde não sabe que há algo; e a tira só ocupa espaço nos perfis em que há mesmo algo a perder.

**Fecha as linhas:** *Nomear os botões que não digitam nada* · *Nomear os atalhos que o perfil guarda e a lista não mostra*

---

## [05] Desligar o teclado tira três coisas. Você quer saber antes, depois, ou enquanto durar?

**Peso:** média · **Depende de:** A opção do recado de 30 segundos depende de a tela ganhar canal de aviso de SUCESSO — hoje só a recusa (`RuntimeError`) chega ao seu cartão. As outras duas não dependem de nada.

CORREÇÃO DO QUE ESTAVA MEDIDO: o CSV diz que a tela nova não avisa NADA sobre o custo de desligar o teclado. Não é verdade hoje — a dica `?` da "Função do teclado" já diz, com estas palavras: "Liga o que o controle digita: os atalhos da tabela à direita, o teclado na tela e as três regiões do touchpad". É o mesmo conteúdo do aviso da janela antiga, movido para o hover e movido para ANTES do ato. O que não existe é o aviso DEPOIS: a tela sabe levar uma recusa até o seu cartão (por 30 segundos), mas não tem canal para um recado de sucesso — escolher "Desativado" tira três coisas e a única resposta da tela é a lista mudando de palavra. O que decide aqui é: dias depois, quando o L3 não abrir mais o teclado na tela, o que na tela responde por quê?

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A dica de antes basta** | Nada muda. O custo continua escrito no `?`, e quem quiser saber passa o rato antes de escolher. | Zero de tela e zero de trabalho. O preço é que o `?` só é lido no momento da escolha — a pergunta "por que o L3 parou de abrir o teclado?" chega dias depois, e a dica não está lá quando ela chega. |
| **Uma frase permanente enquanto estiver desativado** | Enquanto a "Função do teclado" estiver em "Desativado", a tira de estados que já existe abaixo do quadro passa a mostrar uma linha dizendo o que saiu junto: o teclado na tela do L3 e do R3, e as três regiões do touchpad. | Uma linha na tira, e só enquanto o teclado estiver desativado — a tira se esconde sozinha quando não há o que dizer, e ela já compartilha a linha com as outras frases de estado. Sem hover. Exige publicar o desenho. |
| **Um recado de 30 segundos depois do clique** | Ao escolher "Desativado", a mesma faixa que hoje só carrega recusas passa a carregar o aviso de sucesso, no seu cartão, por 30 segundos — como faz a janela antiga. | Zero linha permanente; o recado ocupa espaço só nos 30 segundos. Em troca, é o único aviso que some, e ele some antes de a pergunta aparecer. Exige que a tela ganhe um canal de aviso de sucesso, que hoje não existe. |

**Minha recomendação:** Uma frase permanente enquanto estiver desativado — é a única que ainda está na tela no dia em que você estranhar que o L3 não abre mais nada, e é a que não precisa de código novo.

**Fecha as linhas:** *Avisar o CUSTO de desligar o teclado emulado*

---

