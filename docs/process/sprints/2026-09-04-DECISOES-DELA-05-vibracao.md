# Decisões dela — aba `05-vibracao`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**RESPONDIDAS — pelo PO em 04/09 ([O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md)) e por ela em 05/09 (a [ONDA CINCO](2026-09-05-ONDA-CINCO-INDICE.md)); este arquivo é o registro das opções.** Eram a fila da conversa seguinte, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**6 decisão(ões) · 4 de peso alto**

---

## [01] Publico agora a barra de intensidade que arrasta?

**Peso:** alta

A barra "Personalizado" já foi redesenhada como barra que se arrasta, de 0 a 200%, e o desenho está pronto na bancada — publicar é ato seu. Na página que você usa hoje ela ainda é um bloco de leitura, o teto ainda diz 150% em três lugares e não há polegar para arrastar. Conferi no código de hoje: clicar nessa barra dispara o gesto do degrau sem degrau nenhum, e a tela responde no cartão daquele controle, em laranja, por 30 segundos — "este clique não disse qual degrau; tente de novo em cima de um dos quatro botões". Ou seja, a tela manda você clicar num botão quando o que você queria era arrastar.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Publicar a Vibração agora** | A barra passa a arrastar de 0 a 200%, o teto na tela vira 200% e o recado errado do clique morre. Nada mais muda de forma: nenhuma caixa nova, nenhum texto novo, nenhum botão novo. A outra metade do trabalho de 03/09 — os degraus gravando a força de cada controle — já está valendo sem publicação nenhuma. | Um comando seu. A aba sai da lista de bancada, e o primeiro desenho que sair das decisões abaixo a devolve para lá. |
| **Publicar tudo o que está na bancada** | As três abas em trabalho vão ao produto no mesmo ato: Iluminação, Vibração e Conexões. Na Iluminação o que espera é o trilho de brilho virar deslizador de verdade — a mesma decisão sua de 03/09, "grava na hora". | Você precisa olhar as outras duas antes de dizer sim: são três desenhos num OK só. |
| **Esperar as decisões desta lista** | Nada muda hoje. A publicação sai uma vez só, no fim, com tudo o que estas seis decisões produzirem. | Até lá a barra continua sem arrastar, o teto continua dizendo 150% e o clique nela continua respondendo a frase errada. |

**Minha recomendação:** Publicar a Vibração agora — é a única opção em que você para de receber, hoje, uma instrução que não serve para o que você clicou.

**Fecha as linhas:** *Deslizador de intensidade livre (política "custom", `rumble.policy_custom`)*

---

## [02] As duas explicações ficam escondidas atrás do "?", ou voltam para a tela?

**Peso:** média

São duas frases que já existem nas duas telas, lidas do mesmo arquivo da janela antiga — o conteúdo fechou, e o que está em jogo é o momento em que você as lê. Na janela antiga, "Espera 5 segundos antes de trocar de faixa, para não ficar oscilando" só aparece quando o Auto está escolhido, e "Os valores acima ainda passam pela intensidade escolhida ali em cima antes de chegar ao controle" é um rótulo em itálico, permanente, no rodapé do card de testar. Na aba nova as duas moram dentro do "?", e quem não passa o rato não é ensinado. A segunda é a única frase que liga os dois blocos desta aba: por que um Testar com 220 sai fraco quando o degrau está em Economia.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **As duas ficam no "?"** | A sua regra de 30/08 aplicada à letra — texto na interface é zero, e o que é de média importância vira dica de rato. | Zero linha de tela. Quem escolhe Auto vê um número mudar sozinho sem explicação, e quem testa em Economia não descobre por que saiu fraco. |
| **Só a nota do Testar sobe para a tela** | Uma linha em itálico, esmaecida, embaixo da fileira Testar/Parar, atravessando as cinco colunas. A dos 5 segundos do Auto continua no "?". | Uma linha permanente de 18 px, ~97 caracteres, sempre à vista. Exige publicar o mockup. |
| **A do Auto aparece só quando alguma coluna está em Auto** | A linha nasce e some sozinha, como a janela antiga faz: você escolhe Auto, a explicação aparece; sai do Auto, ela some. A nota do Testar continua no "?". | Zero no repouso, uma linha quando vale. Não falta motor — o degrau de cada coluna já é lido a cada tique. Exige publicar o mockup. |
| **As duas sobem** | As duas viram texto permanente, cada uma embaixo do bloco a que pertence. | Duas linhas permanentes, ~190 caracteres somados, sempre à vista. Exige publicar o mockup. |

**Minha recomendação:** Só a nota do Testar sobe para a tela — ela é a única que explica um resultado que a própria tela produz, e por isso ela é alta, não média; as outras seguem a sua regra e ficam no "?".

**Fecha as linhas:** *A explicação do modo Auto (a escada da bateria e o intervalo de 5 s)* · *A nota 'os valores acima ainda passam pela intensidade escolhida ali em cima'*

---

## [03] A tela avisa quando a vibração está travada e o jogo está mudo?

**Peso:** alta

A janela antiga escreve uma linha em cor: verde para "o jogo controla a vibração", laranja para "travada em silêncio" ou "travada em fraca=160, forte=220". A aba nova não escreve nada — ela nunca olha as duas chaves de estado que o daemon publica —, e isso foi confirmado por execução: com a vibração travada e o jogo mudo, ela mostra apenas a linha de quantas vezes o jogo pediu vibração. É a queixa "testei os motores e o jogo não vibra mais", invisível nesta tela. Vale saber de onde o travamento vem: a aba nova NÃO trava (não tem Aplicar, e o Parar dela devolve ao jogo logo em seguida), então quem trava é a janela antiga — a que você usa hoje — ou a linha de comando.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Uma linha laranja, só quando estiver travada** | No dia comum, nada. Quando alguma coisa travou a vibração, a faixa que já existe embaixo da grade escreve o quê e com que números, e diz como soltar: "clique Parar em qualquer coluna". | Zero linha no repouso — a faixa some sozinha quando não tem o que dizer. Uma linha de 18 px quando vale. Exige reescrever o fim da frase: a da janela antiga manda clicar num botão que esta aba não tem. |
| **As duas cores, sempre** | Igual à janela antiga: verde dizendo que o jogo controla no caso normal, laranja quando travada. | Uma linha permanente, ocupada quase 100% do tempo só para dizer que está tudo bem. |
| **Sem linha — o Parar acende** | Quando a vibração está travada, o botão Parar de todas as colunas fica aceso; clicá-lo devolve ao jogo, que é o que ele já faz. | Zero linha de tela. Não diz os números (fraca=160, forte=220) e exige saber o que o aceso quer dizer. Exige publicar o mockup. |
| **Nada** | A aba nova não trava, e quem travou foi por outra tela — então esta não fala do assunto. | Zero tela. A queixa "o jogo não vibra mais" continua sem resposta aqui, e é a queixa que você já teve. |

**Minha recomendação:** Uma linha laranja, só quando estiver travada — custa zero no dia comum, e o lugar já existe com a regra de sumir quando não há o que dizer.

**Fecha as linhas:** *A linha 'Estado da vibração': o jogo controla / travada em silêncio / travada em fraca=X, forte=Y*

---

## [04] Depois do clique, a tela confirma alguma coisa?

**Peso:** alta · **Depende de:** Motor pequeno no piloto da janela: hoje ele só carrega ao cartão a frase de RECUSA. O depósito, a poda por tempo e a pintura já existem — falta o caminho do sucesso.

Esta aba tem canal de RECUSA e não tem canal de SUCESSO: a recusa vira uma tarja laranja dentro do cartão daquele controle, por 30 segundos, e o sucesso sai como uma linha no terminal de quem lançou a janela — que você não lê. E os quatro gestos desta aba não deixam eco no estado do daemon (testar e parar porque o tremor é físico; força e intensidade porque o estado não publica ajuste por controle), então a prova de que funcionou é o plástico tremer na sua mão; se não tremer — Modo Nativo, controle que caiu —, a tela fica muda. O caso mais duro é o Auto: clicar Auto numa coluna LIMPA o ajuste daquela peça e a devolve ao ajuste geral, então você clica em Auto e vê "Balanceado" acender, sem uma palavra. A janela antiga dizia, nessa hora: "— e este controle voltou ao ajuste geral".

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A mesma tarja, em verde, no cartão** | A frase de sucesso pousa dentro da coluna daquele controle, como a recusa já faz, em verde, e some sozinha depois de alguns segundos. | Nenhuma linha permanente. Mas a tarja nasce no topo do cartão e empurra o desenho do controle para baixo por alguns segundos, a cada clique — movimento dentro da coluna. |
| **Uma linha na faixa de avisos, embaixo** | A frase entra na faixa que já existe sob a grade, nomeando a coluna — "P2 · voltou ao ajuste geral" — e some no tique seguinte. | Zero no repouso; uma linha de 18 px enquanto dura. Nada se mexe dentro das colunas. A faixa cresce e encolhe enquanto você clica. |
| **Só o caso que surpreende** | Silêncio no sucesso comum. Frase só quando o resultado contradiz o botão: o Auto que devolve ao ajuste geral, e o degrau que você clicou e já era o que valia (nesse caso o produto não grava nada, e hoje também não diz nada). | O menor ruído de todos. Um Testar num controle que não tremeu continua sem resposta. |
| **Nada — o degrau aceso é a confirmação** | A tela só muda o que mudou de verdade, e é isso que confirma. | Zero tela. O Auto continua acendendo outro degrau sem explicar, e o Testar que não tremeu continua mudo. |

**Minha recomendação:** Uma linha na faixa de avisos, embaixo — é o único lugar onde a confirmação não faz nada se mexer dentro da coluna, e a faixa já nasceu para aparecer e sumir.

**Fecha as linhas:** *O ajuste de vibração por PEÇA (override do controle) e o aviso quando ele é apagado* · *Recado de SUCESSO depois de cada gesto*

---

## [05] A força agora tem dois donos — a mesa e cada controle. A tela mostra os dois?

**Peso:** alta · **Depende de:** O motor existe dos dois lados: o degrau da mesa tem chamada própria no daemon, e a conta que pula a peça quando o geral está em Auto já é do produto. O que falta é o lugar na tela e a frase.

Em 03/09 você decidiu construir a força por controle, e o clique do degrau deixou de mexer nos vizinhos: ele grava o ajuste daquela peça no perfil ativo. Isso derrubou o que o levantamento ainda diz nesta linha — que "clicar Economia na coluna do P2 muda os quatro"; conferi no código de hoje, e não muda mais. Mas custou duas coisas: sumiu o caminho, nesta aba, para pôr a MESA inteira em Auto (o esquema recusa Auto por peça, então esse botão hoje só LIMPA o ajuste da coluna), e enquanto a mesa está em Auto o que você escolher por controle não chega ao motor — fica guardado e só volta a valer quando ela sair do Auto. E há um terceiro fio no mesmo nó: a coluna que não tem ajuste próprio acende o degrau que o Hefesto está usando agora, com exatamente a mesma cara de um degrau que você escolheu.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Uma linha de MESA embaixo da grade** | Os quatro degraus do ajuste geral ganham uma faixa própria sob as colunas, fora delas. A coluna sem ajuste próprio deixa de acender degrau e passa a apontar para essa linha — "herdado" fica óbvio sem uma palavra a mais. E volta a existir o caminho para pôr a mesa em Auto. | Uma linha permanente com quatro botões, embaixo da grade. A grade não muda: as cinco colunas ficam do mesmo tamanho. Exige publicar o mockup. |
| **Só um sinal na coluna** | O ajuste geral continua fora desta aba (só na Perfis). A coluna sem ajuste próprio acende o degrau vazado, em vez de preenchido, para dizer que aquilo é herdado. | Zero linha de tela. Exige aprender a diferença entre cheio e vazado, e continua sem caminho para pôr a mesa em Auto. Exige publicar o mockup. |
| **Uma linha de aviso, só quando os dois discordam** | Nada muda no repouso. A faixa de avisos escreve as duas frases que faltam: quais controles seguem o ajuste geral, e o aviso de que o geral em Auto está segurando as escolhas por controle até ele sair de lá. | Zero no repouso; até duas linhas de 18 px quando valem. Não devolve o caminho para o Auto da mesa. As duas frases são suas — precisam ser escritas. |
| **Fica como está** | O degrau aceso continua podendo ser seu ou do Hefesto, com a mesma cara, e a mesa só muda pela aba Perfis. | Zero tela. Você continua sem descobrir por que uma escolha por controle não mudou nada quando o geral está em Auto. |

**Minha recomendação:** Uma linha de MESA embaixo da grade — é a única que devolve o caminho perdido em 03/09 e, no mesmo gesto, faz "herdado" ficar óbvio sem texto novo.

**Fecha as linhas:** *O endereço do gesto — quem treme quando ela clica* · *Avisar que o perfil não tem opinião sobre a política de vibração*

---

## [06] O clique que a interface não entende responde alguma coisa?

**Peso:** média · **Depende de:** Decisão 1. O levantamento diz que a barra "Personalizado" também cai neste buraco e fica muda; conferi hoje e não cai mais — desde 03/09 as recusas dos gestos de força e de intensidade chegam ao cartão. Publicar a aba mata o resto desse caminho, e o que sobra é o par Testar/Parar.

A recusa do PRODUTO chega igual nas duas telas: mesma frase, mesmo dono. O que muda é o clique que a INTERFACE não entende — na janela antiga ele não existe, porque os botões só existem onde valem. Na aba nova sobram dois caminhos mudos, os dois no par Testar/Parar: "o controle X não está na mesa agora" e "o clique não disse em qual controle — e sem alvo a mesa inteira treme". Eles vão só para o terminal de quem lançou a janela, e o primeiro acontece sozinho: você clica em Testar no instante em que o controle cai, e o botão não responde nada.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **As duas frases que já existem sobem para o cartão** | Passam a pousar no cartão daquele controle, do mesmo jeito que a recusa do produto já faz. As duas já estão escritas, e as duas falam com quem está com o controle na mão — nenhuma cita arquivo nem código. | Zero desenho, zero linha permanente. Uma tarja laranja de poucos segundos quando acontece. |
| **Uma frase só, escrita por você** | Todo clique que a interface não entende responde a mesma coisa, curta, e o detalhe fica no terminal. | Você escreve uma frase. Perde-se a diferença entre "esse controle caiu" e "esse clique não tinha coluna" — que são dois consertos diferentes. |
| **Continua mudo** | O clique inválido segue sem resposta na tela, como hoje. | Zero tela. Um Testar clicado no instante em que o controle cai não responde nada, e o segundo clique parece o primeiro. |

**Minha recomendação:** As duas frases que já existem sobem para o cartão — foram escritas para quem está com o controle na mão, e o caso que importa ("o controle caiu") só tem resposta se a frase aparecer.

**Fecha as linhas:** *Recado de RECUSA quando o Hefesto não aceita*

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **Gravar a força escolhida no rascunho do perfil (o 'Salvar Perfil' persistir o que a aba mostra)** — É motor, não desenho — e a metade que a atingia CAIU em 03/09. Desde que o degrau e a barra gravam direto no perfil ativo, o "Salvar" do rodapé lê do disco exatamente o que ela acabou de escolher. O que continua sem caminho nesta aba é a política GLOBAL, e isso é a decisão 5, não um defeito de gravação.
- **Aplicar (fixar a vibração naqueles valores, até ela mudar)** — Não há desenho a decidir enquanto não existirem os botões que produzem o estado: a aba nova não tem "Aplicar" nem "Deixar o jogo controlar", e o "Parar" dela devolve ao jogo logo em seguida. O único resto que a alcança é o AVISO de que alguém travou por fora, e ele é a decisão 3. Trazer o par de botões é motor, e muda o contrato desta aba.
- **A dica dos degraus avisar que a MESA pode ter um teto (aba Configurações)** — IGUAL nas duas telas: a mesma frase, lida do mesmo arquivo da janela antiga (o tooltip do degrau Economia). Não há escolha — só uma frase que já está nos dois lugares.
