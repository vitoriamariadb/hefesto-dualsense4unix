# A legenda da aba 04 — o bilhete de projeto sai da tela

**08/09/2026.** Queixa dela, textual: *"ainda temos 3 cantos falando sobre o
automatico"*. <!-- noqa-acento: citação literal dela -->

Os botões "Automático" por coluna saíram da aba Iluminação no `2c228352` — o
gesto foi junto, e a página publicada só conhece `apagar`, `auto-cores`,
`brilho`, `cor`, `player` e `reenviar`. **A prosa ficou**, e em três lugares:

| onde | o que dizia | visível em |
| --- | --- | --- |
| a dica do interruptor (`aba04.py`) | *"O botão Automático de cada coluna é outra coisa: ele larga a barra daquele controle para o jogo escolher"* | **produto e bancada** |
| a legenda, 1º item | *"Saíram o botão de escopo global da faixa do título e o Automático de cada coluna, com os gestos deles no mesmo commit"* | bancada |
| a legenda, mesmo item | a citação dela — *"Deixa só lá o de cima mesmo o tongle"* | bancada |

**A SEGUNDA E A TERCEIRA ERAM PIORES QUE A PRIMEIRA:** a tela narrava o próprio
commit e citava a decisão dela de volta para ela. É o que a regra de 07/09
proíbe — *"O app tem que funcionar e não mostrar na tela que o app não presta.
(...) o layout não informa os nossos defeitos."*

## A armadilha da medição, e ela quase me pegou

O primeiro instrumento que escrevi contou o corpo visível descontando
comentário, `<style>` e `<script>` — e acusou as três. **Ele estava errado sobre
o produto**: a `.nota` é `display:none !important` na
`interface/folha_da_casa.py`, a folha que o piloto injeta por cima das dez
páginas. No PRODUTO só a primeira das três aparece.

Isso já tinha nome nesta casa. `frases_que_ela_baniu.texto_visivel_no_produto`
existe exatamente por isso, e a docstring dele guarda o número: `--palavra mesa
--publicado` acusava **34 ocorrências visíveis "em o produto"** e um Chrome com
a folha posta mostrava **ZERO**.

**Mas as três saíram assim mesmo, e a razão não é zelo:** `mockup/` é o que ela
abre no navegador, **sem folha de usuário nenhuma**. Ali a legenda é texto
visível de verdade, e a bancada é onde ela olhou.

*A régua que mede o produto não mede a bancada. Um bilhete escondido no produto
continua na cara de quem abre o mockup — que é ela.*

## O que estava escrito, e sai da página para cá

Preservado porque **não se apaga decisão medida** — e há medições aqui que
custaram a bancada (os `3,84 × 1,29 px` das lâmpadas, os `208 px` da coluna, os
`196 px` da forma longa do rótulo).

O que **caducou** está dito na tabela acima: o primeiro item narra a saída de um
botão que já não existe, e o "Ainda aberto" tem uma linha (*"o `Desligar`
guarda a cor ou grava preto?"*) cuja pergunta já vive em
`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md` §374 e na sprint
`2026-08-27-ONDA-ILUMINACAO-06`.

---

## O que mudou hoje


- **Os três cantos que falavam de "automático" viraram um.** Ficou o **interruptor** do alto — pedido seu: *"Olha na real sai todos. Deixa só lá o de cima mesmo o tongle."* Saíram o botão de escopo global da faixa do título e o **Automático** de cada coluna, com os gestos deles no mesmo commit. O interruptor é do **perfil** e governa a paleta e a numeração automática; **desligar grava a cor de cada controle no ato**, para nenhuma se perder.
- **A célula Opções ficou com um botão.** `Desligar` fica porque faz outra coisa: ele apaga a barra, e o que saiu devolvia a barra ao jogo e pintava a cor do número por cima. Você não citou este, e apagar a barra é o único ato que só ele oferece nesta tela — **diga se ele também sai.**
- **A célula LEDs voltou a ser só o desenho.** Saíram as teclas `P1 P2 P3 P4` e os dois atalhos, o clique nas cinco lâmpadas e a linha de texto que dizia por que a barra apagou — pedido seu: *"só olhar a linha de cima da seleção de player e replicar o que tem lá."* Ficaram as duas tiras da barra de luz, que são o desenho original, e as cinco lâmpadas, que agora **espelham o número** escolhido na linha `Jogador` logo acima — sem escolha própria. A razão de uma barra tracejada continua a um rato de distância, na dica das tiras.
- **O hexadecimal virou botão.** Clicar em `#0000FF` manda aquela cor ao controle de novo. Antes, uma cor escolhida à mão era a única sem caminho de volta: os oito tons reenviam ao serem clicados, e o seletor livre só avisa quando o valor muda.
- **A fita está esmaecida, e a aba parou de ter um "escolhido".** Antes as seções de baixo ajustavam UM controle — o que a fita apontava, de borda roxa. Com a fita inerte e presa em `Todos`, esse destaque passaria a afirmar na tela uma coisa que a fita já não faz. Saiu o escolhido, não o ajuste: cada coluna se ajusta sozinha, e agora dá para mudar a cor dos quatro sem sair da tela.
- **"Selecione o player" deixou de perguntar o que já está respondido.** Com os 4 na tela, "qual estou vendo" não tem mais objeto. Ele agora **dá** o número — e dar um número ocupado é uma troca, não uma fila. O texto antigo dizia que o outro "desliza para abrir lugar", o que é um rodízio; a sua palavra de 28/08 é **troca**, e as duas dão resultados diferentes com três ou mais controles.
- **As lâmpadas do jogador ficam aqui — e agora se leem.** Medido no Chrome, no desenho de 224 px elas saíam com **3,84 × 1,29 px**: um traço, não cinco pontos. Agrandar o desenho não resolvia (ocupar a coluna inteira ganharia 0,1 px de altura), então quem cresceu foi a lâmpada, dentro do desenho, até ~4 × 4 px. Elas saem só dos desenhos pequenos das outras abas.
- **Saiu o "Sony" do rótulo**, que ainda estava aqui. Decisão sua de 27/08 — "tira o Sony das outras abas também", porque a marca se repetia em cada card sem separar um controle do outro. Agora ele lê `P1 • Modelo • USB`, que é exatamente o que os chips da fita dizem 100 px acima, na mesma tela. **Aviso:** Controles e Conexões ainda escrevem a forma longa (*Sony • Player 1 • Modelo • USB*), citando a sua ordem de 26/08 — a que você trocou no dia seguinte. Não é falta de espaço: medida aqui, a forma longa dá 196 px numa coluna de 208. É uma escolha, e ela precisa valer para as três.
- **O hexadecimal fica**, por decisão sua de 28/08 — e agora há um por controle, debaixo da guia da coluna dele.
- **O que NÃO coube, dito:** as cinco luzinhas em miniatura que ficavam dentro de cada botão de número. A coluna de um controle tem 208 px e os 4 botões ficam com 48 px cada; as luzinhas pedem 56 px só elas. O padrão de cada número não se perdeu — ele está nos 4 desenhos, lado a lado: o P1 acende uma, o P2 duas, o P3 três, o P4 quatro. A tela mostra os 4 padrões ao mesmo tempo, que é mais do que o botão mostrava.
- **E o arranjo que você pediu virou coluna, com um motivo:** "O Opções fica ao lado direito de Cor e brilho e abaixo fica os outros dois. *Isso por controle*" era para a aba que mostrava UM controle na largura inteira. Com 4 colunas de 208 px não cabem dois tópicos lado a lado — quem ficou lado a lado foram os controles. Os cinco tópicos empilham na coluna, e a FILEIRA é o que os alinha entre os 4.



## O que você pediu, e continua aqui


- **Cor e Brilho na mesma largura** — os dois são a coluna inteira do controle.
- **Os títulos têm todos o mesmo estilo**, e agora começam todos no mesmo x, porque moram na mesma coluna: `Controle · Cor · Brilho · Selecione o Jogador · LEDs · Opções`.
- **O botão de Opções** continua `vermelho`, como o **Parar** da Vibração. Eram dois até 07/09; o roxo saiu com a sua ordem.
- **As cinco colunas acabam no mesmo y** — as sete linhas são compartilhadas, e a cura do vão é na altura, nunca `space-between`.
- **Barra vertical entre blocos irmãos**, como na Vibração.



## Ainda aberto


- **Um número que ninguém está usando.** A fileira oferece os 4 números ocupados, porque troca só existe entre dois. O produto cobre 1 a 8 (`core/led_control.py`) — se um dia for preciso pôr um DualSense no 5 com quatro ligados, isso é *mover*, não trocar, e é outra decisão sua.
- **O "Desligar" guarda a cor ou grava preto?** A dica de hoje promete uma coisa e o código faz a outra (`lightbar_actions.py:1023`).
- **Ajustar os quatro de uma vez?** Não há mais alvo único nesta aba, então um "aplicar a todos" teria de ser um botão próprio — e ele não existe.
