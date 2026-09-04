# Decisões dela — aba `10-perfis`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**ELAS NÃO ESTÃO RESPONDIDAS.** São a fila da próxima conversa, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**6 decisão(ões) · 2 de peso alto**

---

## [01] Quando a regra do perfil é maior do que a tela mostra, onde fica o aviso?

**Peso:** alta

Sete dos nove perfis de fábrica casam por uma regra que o seletor "Funciona em" não sabe descrever — cinco por título de janela, dois por lista de classes de janela. Nesses, o produto já monta a marca de travado e a frase que explica, e as duas caem no vazio: não há endereço para elas na página, então o seletor fica idêntico a um destravado e só reclama depois que você clica. O caso irmão é o do Pragmata — o editor mostrava "Jogo da Steam · 3357650" e o arquivo exigia também "PRAGMATA.exe"; o perfil não entrava sozinho, medido seis vezes em dois minutos com você jogando. Nos dois casos a tela afirma uma regra que não é a regra, e é isso que muda conforme a sua resposta.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Uma linha de recado sob os campos** | Nasce uma linha só, embaixo dos campos do editor. Ela fica em branco quando não há nada a dizer e escreve a frase quando há. A mesma linha serve os dois avisos — o campo travado e a exigência escondida — e ainda o do "Estilo de Jogo", que está no mesmo buraco. | 15px permanentes no editor: o espaço tem de ficar reservado, senão a lista de perfis pula a cada troca. Lê-se sem rato, mas em sete de nove perfis a linha vai estar escrita. Muda o desenho, então espera o seu publicar. |
| **Cadeado no campo, frase no hover** | O campo travado ganha um cadeado e o campo do jogo ganha um ponto de alerta quando há exigência escondida. A frase inteira aparece ao parar o rato em cima. | Zero linhas de tela. Exige o rato — e exige que a marca seja visível o bastante para dar vontade de passar por cima. Não precisa de motor: o produto já escreve dica de hover nesta mesma página (os botões Salvar e Exportar do rodapé recebem a dica por esse caminho). Muda o desenho, então espera o seu publicar. |
| **Marca na lista da esquerda** | A coluna "Quando usar" ganha um sinal em cada perfil de regra fina, e o editor não muda em nada. | Zero linhas novas. O aviso fica longe do campo que ele explica: você vê na lista e esquece no editor, que é onde o clique recusado acontece. |

**Minha recomendação:** Cadeado no campo, frase no hover — é a sua regra ("se for de média importância vira tooltip"), e o canal de hover já existe nesta página, então custa desenho e não motor; o cadeado é o que impede o hover de ser um segredo.

**Fecha as linhas:** *O perfil cuja regra a tela não sabe mostrar (a válvula do R-12)* · *"Exigência invisível": o que o perfil exige e a página não mostra*

---

## [02] A tela diz que não sabe mostrar a regra. E manda você para onde?

**Peso:** alta

As duas frases prontas terminam mandando você para lugares diferentes, e um deles não existe aqui: a do campo travado diz "use hefesto-dualsense4unix profile na linha de comando", e a da exigência escondida diz "Ligue o Modo avançado para ver e mudar". Procurei na página inteira: não há Modo avançado nesta interface, nem uma ocorrência. Na janela antiga havia — os três campos crus (classe da janela, título da janela, nome do programa) apareciam preenchidos e você editava a regra de verdade; aqui a tela só bloqueia. Sua resposta decide se esta aba ganha uma saída ou só um aviso, e decide o fim das duas frases.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **O editor avançado volta, num vão** | Um "Mostrar a regra de verdade" abre, dentro do mesmo quadro, os três campos crus preenchidos, e você edita ali. O "Funciona em" deixa de ser um beco em sete dos nove perfis. | Fechado não ocupa nada; aberto, come a altura da tabela de baixo. É motor novo — três campos, três gestos e a guarda de não rebaixar a regra —, a maior das três. |
| **A tela avisa e para por aí** | A frase diz em uma linha o que a regra é ("casa por título de janela") e não promete conserto. Quem quiser mudar mexe por fora, pela linha de comando. | Zero de motor e zero de tela além do aviso da decisão anterior. Você fica sem caminho pela tela em sete dos nove perfis de fábrica. |
| **Um botão que só abre o arquivo** | A frase ganha um botão que abre o arquivo do perfil no editor de texto do sistema. | Motor pequeno, uma linha de tela. Entrega a regra crua por inteiro, sem guarda nenhuma: um arquivo malformado quebra o perfil calado. |

**Minha recomendação:** A tela avisa e para por aí — fecha hoje o buraco que existe (a tela afirmando uma regra que não é a regra) sem esperar motor, e a frase pode ganhar outro fim no dia em que o editor avançado existir.

**Fecha as linhas:** *O editor avançado: window_class · título da janela · nome do programa*

---

## [03] A frase da Prioridade que você aprovou não chega à tela. Qual fica?

**Peso:** média

Você aprovou em 02/09 a frase "Quando dois perfis servem ao mesmo tempo, o de número maior entra.", e ela nunca chegou à tela: o lugar onde ela escreveria é o mesmo pedaço que segura o trilho e o número, e escrever ali apagaria os dois. O que você lê hoje ao parar o rato é o texto que ficou no desenho: "Decide quem ganha quando dois perfis poderiam entrar: o maior vence. O Universal fica em zero, para nunca atropelar ninguém e nunca deixar o controle sem nada." A frase não muda de perfil para perfil — ela é constante, e está escrito no código que é de propósito. E o que impedia deixou de impedir: o canal para o produto escrever dica de hover nasceu em 03/09 e já está em uso nesta mesma página, nos botões Salvar e Exportar do rodapé — a medição que dizia "precisa de motor" envelheceu.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A sua frase entra no desenho** | O texto aprovado passa a ser o que o desenho carrega, e o produto para de tentar mandá-lo. O que você lê ao parar o rato passa a ser o que você escreveu. | Zero linhas, zero motor. Continua no hover. A frase fica congelada no desenho — e ela já é constante hoje. Muda o texto do desenho, então espera o seu publicar. |
| **O produto passa a escrever a dica** | O mesmo canal que já pinta as dicas do rodapé passa a escrever esta, e a frase deixa de morar no desenho. | Zero linhas de tela, um endereço a mais na página. Só se paga se a frase um dia tiver de mudar conforme o perfil — hoje ela não muda. |
| **A frase sai do hover e vira linha fixa** | O texto fica escrito embaixo do slider, sempre visível, sem precisar de rato. | 15px permanentes no editor para um texto que nunca muda. Muda o desenho, então espera o seu publicar. |

**Minha recomendação:** A sua frase entra no desenho — e vai junto uma pergunta: fica só a sua frase, ou a sua frase mais a explicação do Universal em zero, que o texto de hoje tem e o seu não? Eu proponho as duas, a sua primeiro.

**Fecha as linhas:** *Mostrar a prioridade (a barra e o número)*

---

## [04] Você digita o número do jogo. O que a tela responde, e onde?

**Peso:** média

Hoje você digita 1599660, sai do campo, e a tira de desfecho responde "«Perfil» agora vale em: Jogo da Steam · Sackboy: A Big Adventure" — medido na interface viva; enquanto você digita, a tela é muda. Colar o endereço da loja funciona, o número certo entra na regra, mas o campo continua mostrando o endereço colado até você trocar de perfil — a janela antiga trocava o endereço pelo número na sua frente. O carimbo de ponte (qual ponte já funcionou naquele jogo) não tem lugar nenhum nesta interface, nas vezes em que ele tem o que dizer. E uma correção da medição, que fecha uma pergunta antes de ela nascer: o campo não fica "sem efeito" quando o perfil está em Todos — digitar ali move o seletor junto e o perfil vira perfil de jogo, então esconder o campo, como faz a janela antiga, refaria o impasse que esta tela desfez.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Só a tira, e o campo se corrige** | Fica como está, mais uma correção: depois que você sai do campo, o endereço colado vira o número na sua frente. O carimbo de ponte entra na mesma tira, nas vezes em que ele fala. | Zero linhas novas e nenhuma mudança de desenho. A resposta só chega depois que você sai do campo. A tira é uma linha e corta o fim — ver a decisão da tira. |
| **Um rótulo ao lado do campo, respondendo enquanto você digita** | Como na janela antiga: à direita do campo, com as quatro respostas dela — o nome do jogo, "não está nesta máquina", "não reconheci este endereço", ou silêncio. | O campo perde largura para o rótulo, ou o editor ganha 15px. Precisa de motor: hoje o campo só fala quando você sai dele, não a cada tecla. Muda o desenho, então espera o seu publicar. |
| **Um rótulo fixo embaixo do campo, escrito quando você sai** | Meio-termo: a linha existe, não exige rato, e não precisa do motor de responder a cada tecla. | 15px permanentes no editor. A resposta continua chegando só no fim, como hoje. Muda o desenho, então espera o seu publicar. |

**Minha recomendação:** Só a tira, e o campo se corrige — a tira já diz o nome do jogo hoje, e o endereço parado num campo cuja regra já guarda outro número é a única mentira que sobra ali; o rótulo ao vivo pode vir depois sem desfazer nada.

**Fecha as linhas:** *O campo do jogo (o programa ou o número da Steam)* · *A frase "jogo reconhecido" e o carimbo de ponte ao lado do campo*

---

## [05] A tira que responde aos cliques corta o fim da frase. Uma linha ou duas?

**Peso:** média

Todos os nove botões desta aba respondem na mesma tira, embaixo do título: uma linha de 15px que não quebra e corta com reticências. A frase da carona da Steam tem 218 caracteres sozinha ("Reposta a Opção de Inicialização do Hefesto em N jogos da Steam… Sem ela, no Bluetooth o jogo tende a não enxergar controle nenhum…") e ela vem grudada na frase de ativação: juntas passam de 280. Numa linha de 1.180px a 11px cabem cerca de 200, pela conta da largura. O que some é o FIM — e o fim é sempre a parte que avisa: o que não entrou no perfil, e o que acontece se a Opção de Inicialização faltar.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A tira ganha uma segunda linha** | Duas linhas reservadas em vez de uma, e as frases longas cabem inteiras, sem gesto nenhum. | 15px a mais, permanentes, tirados da altura da lista de perfis — cerca de meia linha da tabela. Nada pula, porque o espaço da tira já é reservado hoje. Muda o desenho, então espera o seu publicar. |
| **Uma linha, e a frase inteira no hover** | A tira continua cortando, e parar o rato em cima mostra o texto completo. | Zero de tela, e o canal de hover já existe nesta página. Você precisa reparar nas reticências e ir com o rato — e a parte que avisa é justamente a que fica escondida. |
| **As frases longas encurtam na fonte** | A carona diz na tira só a metade curta ("Reposta a Opção de Inicialização em 3 jogos da Steam") e o resto sai do texto. | Zero de tela. Perde-se o motivo pelo qual a frase existe: o aviso de que, sem a Opção, o jogo tende a não enxergar controle nenhum no Bluetooth. |
| **A tira cresce só quando precisa** | Altura automática: uma linha no caso comum, duas quando a frase é longa. | A lista pula 15px a cada clique de frase longa — foi exatamente esse pulo que o espaço reservado curou. |

**Minha recomendação:** A tira ganha uma segunda linha — a metade que avisa está no fim da frase, e é a única opção em que ela chega a você sem gesto e sem a lista pular.

**Fecha as linhas:** *Ativar o perfil escolhido*

---

## [06] Quando o Modo do perfil nascer nesta aba, onde ficam os dois avisos?

**Peso:** baixa · **Depende de:** A seção Modo do perfil, que não existe nem na página nem no código desta interface — procurei ProfileModeConfig, with_mode e mode_kind na pasta da interface e não há nenhuma ocorrência. Sem o quadro Modo não há onde pôr as duas frases.

A janela antiga tem, dentro do quadro Modo, duas frases que esta interface não tem: o preço da máscara — o que o Xbox custa — e o aviso de rádio frágil, que só fala quando você escolhe a Conexão Nativa, o único modo que depende de o rádio aguentar. O preço você já pediu por escrito, com estas palavras: "ao deixar o mouse sobre a opção Xbox, ele falaria que o Xbox não tem tais features". As duas frases já existem prontas no produto e ninguém vai reescrevê-las. O que se decide aqui é só onde elas aparecem quando o quadro Modo nascer.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Como você pediu: preço no hover, aviso do rádio em linha** | O preço fica na dica de cada botão de máscara, e o aviso do rádio ocupa uma linha que só aparece quando a Conexão Nativa está escolhida. | Uma linha condicional dentro do quadro Modo, e nada nas outras escolhas. O preço exige o rato. Muda o desenho, então espera o seu publicar. |
| **As duas escritas, embaixo dos botões** | As duas ficam visíveis o tempo todo, como a janela antiga faz com o preço, sem depender de rato. | Duas linhas permanentes no quadro Modo. Há um teto medido de 64 caracteres por linha: sem ele, a frase comia 370px da coluna "Perfis salvos". Muda o desenho, então espera o seu publicar. |
| **As duas no hover** | Nenhuma ocupa linha; as duas aparecem ao parar o rato em cima da opção. | Zero de tela. O aviso do rádio — que é o que separa "você escolheu" de "você escolheu e vai dar errado neste aparelho" — passa a depender de você parar o rato em cima. |

**Minha recomendação:** Como você pediu: preço no hover, aviso do rádio em linha — o preço você já decidiu que é hover, e o aviso do rádio fala raro e custa caro nas vezes em que não é lido.

**Fecha as linhas:** *O preço da máscara (o que o Xbox custa)* · *O aviso de rádio frágil quando ela escolhe o Modo Nativo*

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **Mudar a prioridade do perfil** — Você já decidiu em 03/09 — "Slider, como você pediu" —, e o slider está desenhado e ligado. O que falta não é escolha, é o seu publicar: o desenho está na bancada e a página que o produto abre ainda mostra a barra de leitura (a divergência está declarada). A única diferença viva com a janela antiga é o passo do arrasto (5 lá, 1 aqui), e 1 é o certo: a prioridade é número inteiro, e o número aparece ao lado enquanto você arrasta.
