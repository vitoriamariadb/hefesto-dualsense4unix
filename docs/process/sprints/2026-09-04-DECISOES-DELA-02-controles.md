---
sprint: DECISOES-DELA-02
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — índice ou folha de decisões, não é sprint
> executável; o que ela lista vive nas sprints filhas e no `SPRINT_ORDER.md`.

# Decisões dela — aba `02-controles`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**RESPONDIDAS — pelo PO em 04/09 ([O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md)) e por ela em 05/09 (a [ONDA CINCO](2026-09-05-ONDA-CINCO-INDICE.md)); este arquivo é o registro das opções.** Eram a fila da conversa seguinte, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**10 decisão(ões) · 5 de peso alto**

---

## [01] A cor viva do controle tem lugar no card, ou o plástico basta?

**Peso:** média

Hoje o card inteiro é pintado pela cor do PLÁSTICO: a borda, o círculo dos analógicos, os glifos e as barras dos gatilhos saem todos de `--plastico`, que a folha `plastico-css` reescreve a cada tique a partir do modelo declarado de cada controle. A cor VIVA da barra de luz aparece num lugar só — o retângulo dentro da moldura "Barra de luz" —, e esse retângulo mora no corpo do card, que fica recortado quando o card está fechado. Com dois controles do MESMO modelo e os cards fechados, não há nada na tela que os separe pela cor; a janela antiga separa, porque ela tinge o card inteiro com a cor da barra de luz. A pergunta é onde a cor viva aparece além do retângulo.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica como está** | A cor do plástico é a identidade do card, e a cor viva vive só no retângulo da barra de luz. | Zero. Duas peças do mesmo modelo ficam com cards de cor idêntica, e a cor viva some quando o card fecha. |
| **Um pingo vivo no cabeçalho** | Um ponto pequeno ao lado de "P1 • Cosmic Red • USB", pintado com a mesma resposta do motor que já decide o retângulo (alvo `cor`). | Uns 10px na linha que já existe, nenhuma linha nova. Um endereço novo no desenho e uma publicação do mockup. Fica visível com o card fechado. |
| **O card inteiro segue a barra de luz** | Como na janela antiga: sticks, glifos e barras dos gatilhos mudam de cor junto com o aparelho. | Nenhuma linha nova, mas o card muda de cor enquanto você joga, e volta a exigir a guarda de contraste que a GTK tem (`ensure_min_contrast`). Nos três ramos "não sei" não há cor e o card teria de voltar ao neutro. |

**Minha recomendação:** Um pingo vivo no cabeçalho — é o único que resolve o caso medido (dois controles iguais, cards fechados) sem tirar do plástico o papel de identidade que você decidiu em 03/09.

**Fecha as linhas:** *Quadradinho da cor VIVA ao lado do título (swatch)* · *Accent do card — a cor viva tinge analógicos, glifos e barras de gatilho*

---

## [02] A barra de luz mostra travessão em três situações. Onde entra o porquê?

**Peso:** alta

O motor responde CINCO situações e a tela mostra duas coisas: o código da cor quando ela é conhecida, `#000000` quando a barra está apagada, e travessão nas outras três — "Em Nativo o jogo é dono do LED", "A Steam tem este controle aberto" e "Lightbar: cor desconhecida". A frase que EXPLICA o travessão não tem endereço: a linha do rótulo tem "Barra de luz" à esquerda e o código encostado à direita (`.de-quem{margin-left:auto}`), e não sobra vão. A janela antiga mostra a cor E a ressalva ao lado; aqui, sem a ressalva, mostrar a cor seria afirmar o que ninguém mediu, e o travessão é o que sobrou de honesto. Uma coisa mudou desde que esta linha foi levantada: em 03/09 o piloto passou a escrever `title` vivo (`hefesto_vivo.py:181`), então o hover deixou de ser impossível.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica o travessão, calado** | A tela continua dizendo `—` e nunca diz por quê. | Zero. Quem olha nunca sabe se o Hefesto não leu ou se o jogo tomou o LED. |
| **Só no hover** | O travessão fica, e passar o rato sobre o bloco diz a frase inteira do motor. | Zero linha de tela, uma publicação. Exige o rato e some no toque. |
| **Palavra curta no lugar do travessão, frase inteira no hover** | No lugar do `—` entra uma palavra sua — algo como "Jogo", "Steam", "Não sei", "Apagada" — e o hover traz a frase longa que o motor devolve. | Zero linha nova: a palavra ocupa o mesmo vão do código. Uma publicação. As quatro palavras curtas são suas — as longas continuam sendo do motor, que é quem as escreve hoje. |

**Minha recomendação:** Palavra curta no lugar do travessão, frase inteira no hover — é a sua regra de 30/08 ao pé da letra: o de média importância vira tooltip, e o travessão passa a dizer alguma coisa sem virar texto de tela.

**Fecha as linhas:** *Barra de luz — o código hexadecimal da cor* · *Barra de luz — o rótulo das quatro situações*

---

## [03] O selo ATIVO/MUDO do microfone fala do controle ou do PC?

**Peso:** alta · **Depende de:** MOTOR — as opções "Dois selos" e "só quando concordam" exigem um leitor de PipeWire no piloto de produção; hoje o `MicMonitor` só vive na janela antiga (`app/mic_monitor.py`) e na bancada (`interface/controles_vivos.py`).

O selo lê o byte de mudo do FIRMWARE do controle — se a luz vermelha do plástico está acesa. A dica que está na tela hoje promete outra coisa: "Capturando: o som que entra por este controle chega ao PC" (linha 1542 da página publicada). Isso é afirmação sobre o PipeWire, e o piloto de produção não tem leitor de PipeWire: o `MicMonitor` só existe na janela antiga e na bancada. Com o microfone aberto no firmware e mudo no PipeWire, o selo diz ATIVO e nada chega ao PC — e nada na tela avisa.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Um selo só, e a dica passa a dizer a verdade** | O selo continua sendo o firmware, e a dica troca "chega ao PC" por algo como "aberto no controle — a luz vermelha do plástico está apagada". | Zero linha de tela, só a palavra na dica, e uma publicação. Continua sem avisar quando o PC é que está mudo. |
| **Dois selos: no controle e no PC** | Dois estados lado a lado no bloco Microfone, um para cada camada. | Uma linha por card e um motor novo — um leitor de PipeWire dentro do piloto de produção. |
| **Um selo só, que só diz ATIVO quando os dois concordam** | Uma terceira palavra aparece quando o firmware e o PC divergem. | Zero linha nova, o mesmo motor novo, e o selo passa a ter quatro estados como na janela antiga. |

**Minha recomendação:** Um selo só, e a dica passa a dizer a verdade — é grátis e tira da tela a única afirmação medida como falsa neste bloco; as outras duas esperam um motor que ainda não existe.

**Fecha as linhas:** *Selo do microfone (ATIVO/MUDO) — de que camada ele fala*

---

## [04] O botão avisa ANTES do clique, ou só depois?

**Peso:** alta

Na janela antiga o botão fica CINZA e a dica diz por quê, antes de você clicar. Aqui os botões 🎙 e ♪ nunca mudam: têm o mesmo desenho estando o gesto liberado ou proibido. A recusa existe e é boa — a regra é do mesmo dono do produto (`acao_mic` / `acao_speaker_mudo`) —, mas só chega DEPOIS do clique, como frase no cartão daquele controle, por 30 segundos. São três casos medidos em que o botão parece clicável e não é: sem a chave `audio` (o instante seguinte a um hotplug), sem volume conhecido do alto-falante, e sem endereço do aparelho — neste último a frase nem vai para o card, cai na tarja do rodapé, porque sem endereço não há cartão de quem dizer.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica como está: avisa depois** | O botão nunca muda; a frase de recusa aparece no cartão por 30 segundos quando você clica. | Zero. Quem olha a tela em repouso não tem como saber que um botão vai recusar. |
| **O botão apaga e a dica diz por quê** | O botão ganha endereço, fica esmaecido quando o gesto não vale, e a dica do hover traz a frase do produto. A frase no cartão continua existindo como segunda camada. | Zero linha de tela: uma regra de estilo e uma publicação. Não mexe no piloto — desde 03/09 ele já escreve `title` e atributos `aria-` vivos. |
| **O botão apaga E troca de palavra** | Como na janela antiga: "Silenciar", "Ativar", "sem dado". | Os botões hoje são ícones de um caractere; uma palavra pede uma linha por bloco, em quatro cards — ou a palavra fica só na dica, que é a opção anterior. |

**Minha recomendação:** O botão apaga e a dica diz por quê — custa zero linha de tela, usa dois canais que já existem, e transforma a recusa de surpresa em aviso.

**Fecha as linhas:** *Guarda "sem endereço" — desligar o som do card quando não há MAC* · *Microfone — o botão diz o que o clique vai fazer* · *Alto-falante — o botão de mudo* · *A recusa chega a quem clicou*

---

## [05] Dá para mexer no volume por esta tela?

**Peso:** alta

Os dois deslizantes — o do microfone e o do alto-falante — são desenho, não peça: `type="range"` aparece ZERO vez nas dez páginas publicadas, e o que há é uma barra pintada. O daemon atende os dois (`mic.volume.set` e `speaker.set {volume}`) e a ponte já tem os dois métodos, então a falta é só do lado do desenho. E ela tem um efeito que não é de conforto: o DualSense não devolve o volume do alto-falante, o daemon só publica esse número depois de alguém ESCREVER um, e sem deslizante aqui ninguém escreve daqui — o ♪ recusa para sempre num controle cujo volume nunca foi ajustado por outro caminho. A própria frase do produto para esse caso teve de ser reescrita, porque a original mandava "use o controle deslizante primeiro" e o deslizante não está na tela.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Continua só leitura** | Os dois volumes se mostram e não se mexem; quem ajusta é a janela do aplicativo completo. | Zero. E o ♪ fica cinza para sempre no controle que nunca teve um volume escrito. |
| **A barra pintada vira clicável** | Clicar num ponto do trilho manda aquele volume. O desenho não muda um pixel — a barra continua exatamente como está. | Zero linha nova, uma publicação, e um gesto novo com repouso, para não mandar um pedido por pixel arrastado. |
| **Um deslizante de verdade, em linha própria** | Como na janela antiga: uma peça de 0 a 100 com repouso e guarda de arrasto. | Uma linha por bloco, dois blocos, quatro cards — e muda o desenho que você aprovou. |

**Minha recomendação:** A barra pintada vira clicável — não mexe no desenho aprovado e destrava o ♪, que hoje não tem como sair do cinza.

**Fecha as linhas:** *Microfone — o controle deslizante de volume (mic.volume.set)* · *Alto-falante — o controle deslizante de volume*

---

## [06] O alto-falante ganha um "Devolver", ou vale a mesma regra do microfone?

**Peso:** baixa

Quando o Hefesto escreve um volume, ele assume a posse dos bytes de volume do controle. O daemon aceita a devolução (`speaker.set {release: true}`) e a janela antiga tem o botão; aqui não existe botão nem gesto. Você já decidiu o caso gêmeo: em 31/08 mandou o "Liberar" do microfone ficar FORA desta tela, e manteve a decisão depois de eu medir que o produto tem o botão e o daemon aceita o comando — o preço foi escrito na dica do 🎙 (a volta é pela janela do aplicativo ou reiniciando o Hefesto). A diferença entre os dois é a gravidade: no microfone quem perde o comando é o botão físico do controle; aqui o firmware apenas fica com o último volume mandado.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A mesma regra: fica fora, e a dica do ♪ diz o preço** | Nada entra na tela; a dica do ♪ passa a dizer que a posse do volume não se devolve por aqui, como já faz a do 🎙. | Uma frase na dica do hover. Zero linha de tela. |
| **O ♪ ganha um irmão "Devolver"** | Segundo botão no bloco do alto-falante, sensível só quando há posse. | Um botão na linha que já existe — é o vão que o "Liberar" do microfone deixou —, uma publicação e um gesto novo. |

**Minha recomendação:** A mesma regra: fica fora, e a dica do ♪ diz o preço — é a sua própria decisão aplicada ao gêmeo, e aqui o preço é menor: o firmware guarda o último volume, não trava em nada.

**Fecha as linhas:** *Alto-falante — o botão "Devolver" (soltar a posse do volume)*

---

## [07] Quando a emulação cai para o modo pobre, a tela conta?

**Peso:** média

O card diz o que o jogo vê — "DualSense", "Xbox 360" — e não diz em que condição. Quando o gamepad virtual cai para o `uinput`, a janela antiga acende a tarja "Emulação degradada (uinput): <motivo>", com o motivo em português. Do lado novo o ajudante que monta esse motivo EXISTE (`pacotes/__init__.py:908`) e nenhum dos dez pacotes o chama — não porque falte código, mas porque não há onde pousar a frase.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Não conta** | A tela mostra "Xbox 360" com a mesma cara, degradado ou não. | Zero. E quando algo não funciona no jogo, a tela não ajuda a descobrir por quê. |
| **Uma marca na palavra e o motivo no hover** | A palavra do que o jogo vê ganha um sinal visível (cor ou um sinal ao lado) e a dica do hover traz o motivo inteiro. | Zero linha de tela e uma publicação. O sinal aparece sem hover; o texto só com o rato. |
| **Uma tarja no corpo do card, só quando degradado** | Como na janela antiga: a frase inteira dentro do card, e some quando volta ao normal. | Uma linha, e só nos cards degradados — nos outros o card não muda. |

**Minha recomendação:** Uma marca na palavra e o motivo no hover — quem só olha já vê que tem algo, e o texto fica guardado no hover, que é a sua regra para o de média importância.

**Fecha as linhas:** *Badge de degradação do gamepad virtual*

---

## [08] Quando o mudo cai no controle errado, a tela confessa?

**Peso:** média · **Depende de:** MOTOR pequeno — o gesto do 🎙 precisa ler `ipc_bridge.alvo_honrado` (já existe, `app/ipc_bridge.py:1041`) em vez de tratar a resposta do daemon como sim/não.

Na mesa cheia, o daemon pode atender um pedido de mudo pela rota global em vez do controle em que você clicou. Ele DIZ isso na resposta, e a janela antiga lê os três estados (`ipc_bridge.alvo_honrado`) e acende a tarja dentro do card. O gesto novo trata a resposta como sim/não: um mudo que caiu no controle de outra pessoa aparece aqui como sucesso — a tela pinta o selo do card certo e o microfone que calou foi outro. O canal para dizer isso já existe: é o mesmo depósito de frases por controle que hoje mostra as recusas no cartão, por 30 segundos.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Não confessa** | A tela continua mostrando sucesso. | Zero. O erro fica invisível exatamente na mesa em que ele acontece. |
| **Vira aviso no cartão, como as recusas** | A mesma frase de 30 segundos que você já aprovou para as recusas, dizendo que o Hefesto calou pela rota da mesa e não só este controle. | Zero linha de tela — reusa o canal que já existe. O gesto passa a ler o terceiro estado da resposta. |
| **Vira estado permanente no card** | Uma tarja que fica enquanto durar a situação, como na janela antiga. | Uma linha no card, e ela concorre com a frase de recusa pelo mesmo lugar. |

**Minha recomendação:** Vira aviso no cartão, como as recusas — é o mesmo canal com a regra que você já deu ("é aviso, não estado") e não custa nada em tela.

**Fecha as linhas:** *Confissão "o microfone em que mexi não é o deste card"*

---

## [09] Onde a tela mostra que o alto-falante está mudo?

**Peso:** alta

Em lugar nenhum, hoje — e isto é achado de agora, não do levantamento. O produto CALCULA a palavra certa ("Mudo", ou a porcentagem pela curva medida no hardware — foi aqui que a auditoria matou o "102%") e a escreve num `<span class="mudo" data-campo="alto-estado" hidden>`; o piloto não mexe em `hidden` em nenhum dos seus alvos, então o valor cai num vão invisível a cada tique. O botão ♪ também não conta: o aceso dele é classe do desenho, não leitura — ele nunca acende. O microfone tem o selo ATIVO/MUDO vivo ao lado; o alto-falante não tem nada.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **O ♪ acende** | O botão que causa o estado é o que o mostra, com a mesma gramática dos quatro botões desta aba que já acendem por leitura desde 03/09. | Zero palavra na tela, uma publicação. O `alto-estado` invisível pode então sair do desenho. |
| **Um selo ao lado de "Alto-falante"** | Igual ao do microfone: a palavra "MUDO" quando está mudo, e nada quando não está. | Uma palavra na linha que já existe. Os dois blocos passam a ler igual, o que é bom para o olho. |
| **Os dois** | O botão acende e o selo aparece. | A palavra mais a publicação — dois sinais para o mesmo fato. |

**Minha recomendação:** O ♪ acende — é zero texto, que é a sua regra, e o campo invisível sai do desenho em vez de continuar guardando um valor que ninguém vê.

**Fecha as linhas:** *Alto-falante — o valor do volume em texto*

---

## [10] O clique do analógico: `[L3]` ou cor?

**Peso:** baixa

Quando você aperta o analógico, a tela nova troca o texto dentro do círculo: `L3` vira `[L3]`. A janela antiga não troca texto — ela pinta o título do analógico com a cor do controle enquanto está apertado. O caminho para a cor já está aberto (o alvo `cor` entrou no piloto em 02/09 e custa duas linhas), então o que falta é a sua palavra sobre o que a tela DIZ. O rótulo é JetBrains Mono 26px num círculo de 100px: cabem quatro caracteres, e `[L3]` são exatamente quatro.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Fica `[L3]`** | Os colchetes continuam sendo o sinal de apertado. | Zero. Lê-se sem cor nenhuma, e sobrevive a foto e a tela em preto e branco. |
| **Vira cor, e o texto não muda** | O `L3` muda de cor enquanto apertado, como na janela antiga. | Zero caractere, mas o rótulo já está sobre um círculo colorido pelo plástico — a cor nova tem de passar longe dessa para ser vista. |
| **Os dois: colchetes e cor** | Dois sinais para o mesmo fato. | Zero linha, uma publicação. Redundante de propósito. |

**Minha recomendação:** Fica `[L3]` — é o sinal que não depende de contraste nenhum, e o círculo já é colorido pelo plástico.

**Fecha as linhas:** *Clique dos analógicos (L3 / R3)*

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **Título do card — "Controle N — USB · Jogador X"** — FECHOU e o CSV está velho aqui. O produto escreve o nome da peça e o transporte (`pacotes/a02_controles.py:1221-1222`) e a página publicada tem os dois endereços (`data-campo="peca"` e `data-campo="via"`, linha 1524). A medição de 02/09 ("os dois cabeçalhos dizem o CONTRÁRIO") caiu com a decisão IDENTIDADE-VEM-DE-CIMA de 03/09, que partiu o `<span>`. O "P1" que sobra é a posição do card, e só aparece com o card fechado — não é dado a ler.
- **Perfil ativo e estado do Hefesto no topo do card** — As duas metades já têm casa. O perfil ativo está na barra da página (linha 1461 da página publicada, uma vez para as dez abas) e o estado do daemon está na aba Sistema (`hefesto-estado`). Repetir um fato global dentro de quatro cards é o contrário do que você pediu em 30/08 sobre texto na interface.
- **Barra de luz — o retângulo colorido** — O próprio CSV registra o fecho em 03/09: o campo e o retângulo saem da mesma resposta do motor, e na sua tela os dois dizem a mesma coisa. O que sobrou dessa linha é a ressalva sem endereço — virou a decisão "A barra de luz mostra travessão em três situações".
- **Alto-falante — o número e a barra do bloco** — FECHOU e o CSV está velho aqui. `alto-num` e `alto-barra` estão na página PUBLICADA (linhas 1782-1784) e o pacote os emite pela curva medida no hardware (`a02_controles.py:1168` e `:1180`), com zero na barra e travessão no número quando não se sabe. A afirmação de que eles existiam "só no mockup" não vale mais.
