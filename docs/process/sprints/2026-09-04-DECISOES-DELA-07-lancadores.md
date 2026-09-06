---
sprint: DECISOES-DELA-07
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — índice ou folha de decisões, não é sprint
> executável; o que ela lista vive nas sprints filhas e no `SPRINT_ORDER.md`.

# Decisões dela — aba `07-lancadores`

**04/09/2026.** Levantadas por um agente que leu as linhas abertas desta aba no
`docs/data/paridade-gtk-html.csv` e as transformou em escolhas.

**RESPONDIDAS — pelo PO em 04/09 ([O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md)) e por ela em 05/09 (a [ONDA CINCO](2026-09-05-ONDA-CINCO-INDICE.md)); este arquivo é o registro das opções.** Eram a fila da conversa seguinte, no formato que
ela pediu: *"um ponto por vez, o próximo depois do OK dela"*. As dezesseis que
ela JÁ respondeu estão em
[`2026-09-04-AS-DEZESSEIS-DECISOES-DELA`](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
— confira lá antes de perguntar de novo.

**4 decisão(ões) · 3 de peso alto**

---

## [01] Quando um jogo só dá para consertar à mão, o que a tela me oferece?

**Peso:** alta

O cartão da Steam já escreve, quando é o caso: «N jogos com a linha intocável — só reparo manual», e a frase do produto termina literalmente em «Reparo manual.» — mas não existe UM botão de copiar em toda a interface nova (procurei por área de transferência em `interface/` e não há uma linha). A tela promete um reparo manual e não oferece nenhum caminho para fazê-lo. A janela antiga dá DUAS saídas no mesmo aviso: o botão «Copiar opções» e a própria linha à mostra, selecionável, para quando a cópia falha calada. Correção ao CSV: ele diz que sem o copiar «não sobra caminho nenhum quando o Consertar recusa» — isso caiu pela metade em 03/09, porque a recusa agora arma a vigia da Steam, que repõe sozinha quando o jogo e a Steam fecham; o buraco que sobra é só o das linhas intocáveis, que o produto decidiu nunca tocar.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Botão «Copiar a linha»** | Um clique põe a linha inteira na área de transferência e a tarja diz o que o produto já diz hoje na janela antiga: «Copiado! Cole em: Steam → jogo → Propriedades → Opções de inicialização.» | Zero linha nova de tela: entra na fileira que já tem Consertar · Ver o que impede · Abrir o lançador, que passa a ter quatro botões. Republica o desenho. Se a cópia falhar (e ela falha em silêncio), não sobra nada na tela. |
| **A linha à mostra, selecionável** | O corpo do cartão passa a mostrar a linha inteira num bloco, para você selecionar e copiar com Ctrl+C — o mesmo que a janela antiga faz dentro do aviso dela. | A linha tem 143 caracteres: cerca de 3 linhas dentro do cartão, ou 1 linha com rolagem lateral. Nenhum código novo — o texto da página já é selecionável. Fica à vista sempre que houver jogo intocável. |
| **Os dois, só quando faz falta** | O botão E a linha aparecem juntos, como no aviso da janela antiga, mas só no estado em que o cartão já diz «linha intocável» ou logo depois de o Consertar recusar. No dia bom o cartão fica exatamente como está. | Nesse estado o cartão fica o mais cheio da aba: quatro botões e um bloco de até 3 linhas. Republica o desenho e exige um estado a mais no cartão. |
| **Atrás do «Ver o que impede»** | O botão já existe e já troca o corpo do cartão pela resposta do prontuário; a linha entraria dentro dessa resposta. | Zero botão novo e zero linha permanente — mas esse botão leva 13,5 segundos medidos (ele examina o executável de cada jogo instalado), e você esperaria isso para ver uma linha que é sempre a mesma. |

**Minha recomendação:** Os dois, só quando faz falta — é o que a janela antiga já faz, e a razão dela é boa: se a cópia falhar, a linha à mostra ainda salva; e no dia em que não há jogo intocável, nada disso ocupa a tela.

**Fecha as linhas:** *Copiar a linha do wrapper para a área de transferência*

---

## [02] A frase do aviso me manda a um botão que não existe

**Peso:** alta · **Depende de:** Decisão 1 — se o cartão ganhar o botão de copiar, é ele que a frase deixa de precisar nomear.

O aviso do jogo aberto sem o atalho usa a frase do produto, palavra por palavra: «O jogo está rodando sem o hefesto-launch — controles podem duplicar. Copie as opções na aba Sistema.» Medido hoje: a aba Sistema da interface nova existe, tem doze botões, e nenhum copia coisa alguma — a palavra «Copiar» não aparece uma vez na página. Na interface nova quem faz esse trabalho é o «Consertar», nesta mesma aba Lançadores. E a frase tem um dono só para as duas telas: mexer nela muda também o aviso da janela antiga, onde o «na aba Sistema» está certo.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **A frase para de nomear lugar** | Ela passa a dizer só o fato — «O jogo está rodando sem o hefesto-launch — controles podem duplicar.» — e quem diz o que fazer é o botão ao lado, em cada tela. | Uma frase mais curta nas duas telas (some uma oração) e um botão ao lado do aviso aqui. A janela antiga perde a instrução escrita, mas o botão dela continua onde sempre esteve. |
| **A frase aponta o Consertar** | Vira «…controles podem duplicar. Clique em Consertar, na aba Lançadores.» | Zero desenho novo. Mas a janela antiga passa a mandar você a uma aba que ela não tem — troca um endereço errado por outro endereço errado. |
| **Duas frases, uma por tela** | Cada interface escreve a sua: a antiga continua mandando à Sistema, a nova manda ao Consertar. | Zero desenho novo, e duas frases que envelhecem separadas — é exatamente o que a sua decisão «uma frase, um dono» existe para impedir. |

**Minha recomendação:** A frase para de nomear lugar — é a única que fica certa nas duas telas, e o lugar já está dito pelo botão que fica ao lado do aviso.

**Fecha as linhas:** *Aviso automático "o jogo aberto agora não passou pelo wrapper"*

---

## [03] Quando eu digo «não perguntar para este jogo», o aviso some de onde?

**Peso:** alta

Correção ao CSV, medida hoje: ele diz que o aviso só aparece no cartão da Steam desta aba e que levá-lo à Jogar é trabalho de outra frente — essa frente entregou. O aviso do jogo sem atalho é hoje uma das seis fontes da coluna Atenção da aba Jogar, com o selo JOGO, e a coluna tem cinco vagas ainda vazias. Ele aparece nas DUAS telas. O que não bate é o silêncio: o cartão daqui respeita a sua lista de «Não perguntar para este jogo», e a coluna Atenção não consulta lista nenhuma — e o «Tirar daqui», o jogo em que você decidiu não pôr o atalho, não cala o aviso em tela alguma: toda vez que você abrir esse jogo, as duas telas avisam do que você já decidiu.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **As duas recusas calam tudo** | «Não perguntar para este jogo» e «Tirar daqui» silenciam o aviso nas duas telas: some do cartão e some da coluna Atenção. | A coluna Atenção passa a depender de duas listas em disco; para não travar a janela, essa leitura tem de vir de uma vigia em segundo plano, como esta aba já faz. Um jogo silenciado por engano fica sem aviso — o desfazer é o «Voltar a perguntar» e o «Voltar a usar», que já existem na tela. |
| **Só o «Não perguntar» cala** | A dispensa vale nas duas telas; o «Tirar daqui» continua avisando toda vez que o jogo abre. | Uma lista a menos para ler. Mas o jogo que você tirou de propósito reclama para sempre, e o único jeito de calá-lo passa a ser dispensá-lo também — dois botões para um «eu sei». |
| **Fica como hoje** | A dispensa cala só o cartão desta aba; a coluna Atenção da Jogar continua avisando. | Zero trabalho. Você aperta «Não perguntar para este jogo», o aviso some de uma tela e continua na outra — que se lê como botão que não obedeceu. |

**Minha recomendação:** As duas recusas calam tudo — as duas são você dizendo «eu sei, deixa assim», e um aviso que sobrevive à sua resposta ensina que o botão não funciona.

**Fecha as linhas:** *Aviso automático "o jogo aberto agora não passou pelo wrapper"*

---

## [04] 63 jogos com o atalho e 22 instalados, na mesma tela

**Peso:** média

Esta não vem do CSV: está escrita no código como decisão sua, com data de 03/09, e você vê os dois números a uma linha de distância dentro do cartão da Steam. O canto diz «22 jogos instalados» e o corpo diz «…o atalho está no lugar em 63 jogos da sua biblioteca». As duas afirmações são verdadeiras — biblioteca inclui o que não está instalado, instalados não —, e a tela não dá como saber disso: quem lê vê 63 maior que 22 e conclui que um dos dois mente. Os números andam sozinhos: em 02/09 a mesma leitura deu 23 e 63, e horas depois 62.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **O corpo nomeia o conjunto** | Vira «…está no lugar em 63 jogos da sua biblioteca (instalados ou não)». | Três palavras, zero linha nova, nenhum botão. Republica o desenho. |
| **O corpo conta só instalados** | Os dois números passam a falar do mesmo conjunto e podem ser comparados direto. | O número cai para no máximo 22 e some a informação de que dezenas de jogos ainda não instalados já estão preparados — a leitura vira «perdi o atalho em 40 jogos». |
| **O canto mostra os dois** | O canto passa a dizer «22 instalados · 63 na biblioteca» e o corpo para de repetir o número. | O canto do cartão fica bem mais comprido e disputa a linha com o selo CHEGAM/NÃO CHEGAM em janela estreita. |

**Minha recomendação:** O corpo nomeia o conjunto — é a correção mais barata e resolve exatamente o que falta, que é dizer que os dois números contam coisas diferentes.

---

## Não são decisão dela

Linhas desta aba que o levantamento descartou, com a razão. Ficam registradas para ninguém as ressuscitar como pergunta.

- **Aviso automático "o jogo aberto agora não passou pelo wrapper" — a metade "em que abas ele aparece"** — FECHOU, e o CSV ainda não sabia. Ele diz que o aviso só existe no cartão da Steam da 07 e que levá-lo à Jogar é trabalho de outra frente; medi hoje: essa frente entregou — o aviso é uma das seis fontes da coluna Atenção da aba Jogar (selo JOGO), que aparece sem clique nenhum. Não sobra escolha de LUGAR; sobra a escolha de SILÊNCIO, que virou a decisão 3.
- **Copiar a linha do wrapper — a metade "quando o Consertar recusa porque a Steam está aberta"** — FATO DERRUBADO. O CSV diz que sem o copiar não sobra caminho nenhum quando o Consertar recusa; desde 03/09 a recusa arma uma vigia que repergunta sozinha e repõe o atalho assim que o jogo e a Steam fecham — inclusive quando a escrita falhou. A saída manual continua fazendo falta, mas só para as linhas intocáveis, e é assim que a decisão 1 está escrita.
- **Abrir os cinco lançadores que não são a Steam (Heroic, Lutris, RetroArch, emuladores, Flatpak)** — É MOTOR, não desenho. O botão já existe nos seis cartões e já recusa dizendo (decisão 17 sua, 03/09). O produto só sabe abrir a Steam; abrir os outros exige ler o atalho de cada um, que é capacidade nova. Não há escolha de tela a fazer enquanto isso não existir.
