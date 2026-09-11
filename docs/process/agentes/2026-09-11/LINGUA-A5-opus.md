# LINGUA-A5 — a língua da Navegação e da Perfis

**11/09/2026.** Frente A5 da onda **A LÍNGUA DA TELA**
(`docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`),
sprint `docs/process/sprints/2026-09-11-LINGUA-A5-navegacao-e-perfis.md`.

**Isto é PROPOSTA. Nenhuma frase foi trocada no gerador.** Ordem dela:
*"Pra apresentarem as propostas tá bom?"* <!-- noqa-acento: citação literal dela -->

---

## §0 — O número, em uma linha

| | 06 Navegação | 10 Perfis | soma |
| --- | --- | --- | --- |
| textos vistoriados | **139** estáticos + **33** recados vivos | **79** estáticos | **251** |
| textos que proponho mudar | **32** | **18** | **50** |
| caracteres de tela hoje | 7.154 (+ 1.181 nos recados) | 3.088 | **11.423** |
| caracteres com a proposta inteira | 4.752 (+ 667 nos recados) | 2.702 | **8.121** |
| **o que sai** | **−2.916 (−35%)** | **−386 (−13%)** | **−3.302 (−29%)** |

A Navegação encolhe três vezes mais que a Perfis, e a razão está na §2: **na
Navegação quase todo rótulo é palavra dela e quase toda dica é nossa.** Onde a
prosa é nossa, há muito a cortar; onde é dela, não se mexe.

---

## §1 — A FOTO DO ANTES, na vista dela (1918x840)

```bash
# esta worktree não tem venv própria; o python é o da árvore principal
PY=/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
PYTHONPATH=$PWD/src $PY src/hefesto_dualsense4unix/interface/olhar.py \
  06-navegacao.html --publicado --vista dela
PYTHONPATH=$PWD/src $PY src/hefesto_dualsense4unix/interface/olhar.py \
  10-perfis.html --publicado --vista dela
```

As duas saíram `1600x777` dentro da vista de `1918x840`, sem rolagem lateral e
sem passar da dobra. Nenhuma janela nasceu na tela dela: o `olhar.py` fotografa
num Chrome sem tela.

| aba | arquivo |
| --- | --- |
| 06 Navegação | `docs/process/agentes/2026-09-11/ANTES-06-navegacao.png` |
| 10 Perfis | `docs/process/agentes/2026-09-11/ANTES-10-perfis.png` |

**E as quatro telas que só abrem por clique**, fotografadas pelo mesmo Chrome sem
tela, com o endereço da pop-up (`#definicoes-mouse`, `#remapeamento`,
`#point-and-click`, `#teclas-do-teclado`) — elas são metade do texto da
Navegação e não aparecem na foto da aba:

| tela | arquivo |
| --- | --- |
| Definições Controle e Mouse | `docs/process/agentes/2026-09-11/ANTES-06-definicoes.png` |
| Remapeamento dos botões | `docs/process/agentes/2026-09-11/ANTES-06-remapeamento.png` |
| Teclas do teclado | `docs/process/agentes/2026-09-11/ANTES-06-teclas.png` |
| Estilo Point-and-click | `docs/process/agentes/2026-09-11/ANTES-06-point-and-click.png` |

---

## §2 — O QUE EU NÃO PODIA INVENTAR: os rótulos desta aba são palavra DELA

Cheguei com uma lista de rótulos a renomear — «Status do Modo» é vago, «Função
do teclado» não diz o que faz, «As opções de ativação» é abstrato. **Fui
conferir a procedência de cada um antes de propor, e a lista caiu inteira.**

`src/hefesto_dualsense4unix/interface/aba06.py:1847` diz, com todas as letras:

> `# AS OPÇÕES DE ATIVAÇÃO — cada rótulo é a palavra dela na fala [11].`

E o `:1044`, sobre os grupos que aparecem dentro de cada lista:

> `# AS LISTAS DE VALOR. Os grupos são as palavras DELA na fala [11] — "no lado`
> `# direito teríamos Função do teclado, Executar Comando, Mouse"`

E o `:824`, sobre o primeiro campo da aba:

> `/* ---- O STATUS DO MODO (27/08, ela: "Status do Modo: ao clicar no botão`
> `        Ligado. Ao clicar nele de novo desligado.") ---- */`

E o `:2775`, sobre os dois botões que abrem as telas de botões:

> *"aba navegação no botão Definições e Remapeamento / Abrimos uma tela pra*
> *remapeamento e Definições Controle e Mouse, vamos dividir isso em dois*
> *botões no mesmo lugar"* <!-- noqa-acento: citação literal dela -->

**São dela, e ficam:** «As opções de ativação» · «Status do Modo» · «Função do
teclado» · «Navegação Interna» · «Velocidade de cursor» · «Velocidade da
rolagem» · «Modo Steam» · «Definições Controle e Mouse» · «Remapeamento» · e os
grupos «Mouse», «Função do teclado» e «Executar Comando» dentro das listas.

**A regra que isto deixa, e ela vale para as outras quatro frentes desta onda:**
*antes de propor um rótulo novo, procure a procedência dele no gerador.* Nesta
aba, doze dos rótulos que eu ia reescrever são a digitação dela — e reescrevê-los
seria a frente de língua desfazendo a decisão de tela, que é o único lugar onde a
palavra é dela sem discussão.

**O que sobra para mim é a prosa que a casa escreveu sobre os rótulos dela:** as
13 dicas, os 13 `title`, as frases de confirmação e os recados do canal. É lá que
estão os 35%.

---

## §3 — A TABELA — 06 Navegação

Endereço = o **gerador**, que é onde a troca se faz
(`src/hefesto_dualsense4unix/interface/aba06.py` e
`src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py`). O `/` dentro
de uma frase é uma quebra de parágrafo na tela.

Sete linhas partem de uma medição que já existe: o
`docs/process/2026-09-10-AS-FRASES-QUE-MENTEM-a-tela-medida-contra-o-produto.md`
mediu, ontem, 11 frases desta aba contra o que o produto faz. **Onde ele mediu,
eu parto da frase dele e corto por cima** — a verdade vem antes da língua, e
propor outra coisa sem remedir seria desfazer trabalho medido. As linhas assim
estão marcadas **[10/09]**.

### 3.1 — O que proponho mudar (32)

| onde | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `aba06.py:2657` · dica do quadro | Serve para navegar o computador sem largar o controle — e para os jogos que só entendem mouse e teclado. / Precisa de **uinput** e de uma regra **udev**; o instalador já deixa os dois prontos. Se a linha de estado abaixo estiver vermelha, é isso que falta. / **Combinações:** junte teclas com "+" (ex.: Alt + Tab). Nenhum atalho de fábrica digita letra — para escrever texto, abra o teclado na tela com o **L3**. | Usa o controle como mouse e teclado do computador — e nos jogos que só entendem mouse e teclado. / **Combinações:** junte teclas com "+" (ex.: Alt + Tab). Nenhum atalho digita letra: para escrever texto, abra o teclado na tela com o **L3**. | **`uinput` é palavra proibida em texto de tela** (`docs/A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md`, §3), e esta é a única prosa das dez abas que a lê — medido, §7.1. O parágrafo inteiro não é acionável: quando falta, quem diz o motivo é a linha de estado logo abaixo, que já o nomeia. **[10/09]** mediu a mesma frase como IMPRECISA e propôs mudar a segunda metade **mantendo a palavra**; esta proposta tira as duas. |
| `aba06.py:2664` · rótulo do link | Banco de provas: o mapa do controle ↗ | Mapa do controle ↗ | *"banco de provas"* é metáfora de bancada — o §0 da onda chama isso de dívida de tradução. O rótulo passa a ser o nome do destino. |
| `aba06.py:2664` · `title` do link | Abre o mapa do controle — as 28 peças do aparelho com nome, apelido e glifo, e as cores de fábrica para ver clicando. É de lá que saem as 22 linhas das duas telas de botões desta aba: o mesmo docs/data/pecas-do-dualsense.csv. | As 28 peças do controle, com nome e cor de fábrica, para ver clicando. | Um caminho de arquivo nosso dentro de uma dica. A procedência das 22 linhas é informação de quem desenvolve; quem usa quer saber o que a página tem. |
| `aba06.py:2629` · dica «Quem navega» | Os 4 controles ligados, cada um na cor do seu plástico, com as cinco lâmpadas no padrão do número dele e a barra de luz na cor automática daquele número. / **O cursor do PC é um só.** Mouse, teclado e os 5 gestos saem do controle do **Player 1** — é o controle que o Hefesto lê por inteiro; os outros chegam ao jogo pelo gamepad virtual e não mexem no cursor. / Quem escolhe o alvo de um ajuste é a **fita do topo**, e só ela — estes cartões são leitura. | Os controles ligados agora, cada um na cor do seu plástico. / **O cursor do PC é um só:** mouse, teclado e os 5 gestos saem do controle marcado «Navega o PC» aqui embaixo. Os outros chegam ao jogo e não mexem no cursor. / O alvo de um ajuste se escolhe na **fita do topo**; estes cartões são leitura. | **[10/09]** — duas correções medidas dentro desta dica (`:2629` DESATUALIZADA, `:2633` IMPRECISA: o *"4 controles"* e o *"Player 1"* cravados). Corto por cima: *"gamepad virtual"* é nome de peça nossa, e *"e só ela"* repete o que a frase já disse. |
| `aba06.py:2639` · dica «Os gestos» | São combinações que valem **sem largar o controle**, a qualquer momento, mesmo com o jogo aberto. / Apertar os dois botões em até **0,15 s** conta como combo — mais devagar, o Hefesto entende como dois toques separados. / O número de cada linha marca a peça no desenho do **Player 1**; passe o ponteiro por uma linha e ela acende. Acende só ali porque é só ali que o gesto existe. / **Ressalva:** o **PS + R3** e o **PS + Options** são as duas saídas de emergência quando o jogo não responde — trocar o que eles fazem tira essa saída. Os cinco degraus do **Modo de conexão** se escolhem na aba **Jogar**, e aqui não se repetem. | Combinações que valem **sem largar o controle**, a qualquer momento — mesmo com o jogo aberto. / Segure os dois **juntos** por **0,15 s**. Um toque rápido demais não vira combo: solta o PS sozinho, e o PS sozinho abre a Steam. / **Ressalva:** o **PS + R3** e o **PS + Options** são as duas saídas de emergência quando o jogo não responde. | **[10/09]** — o parágrafo dos 0,15 s estava **invertido** (é o tempo MÍNIMO com os dois apertados, não a janela máxima), medido na bancada com relógio injetado; adoto a frase dele. O último parágrafo nomeia *"Modo de conexão"*, que **não é o nome do campo** — a seção da aba Jogar se chama **Modo**, por palavra dela (§7.3) —, e *"degrau"* é a palavra da vibração no glossário. O terceiro parágrafo explica o hover, que o hover já mostra. |
| `aba06.py:2695` · cabeçalho da coluna | Combinação no controle | Combinação | O rótulo da seção logo acima já diz «Os gestos do controle»: *"no controle"* é a terceira vez que a mesma tela diz onde o botão fica. |
| `aba06.py:1077` · grupo da lista | Modo de conexão | Modo | §7.3: o campo da aba Jogar se chama **Modo** desde 31/08, por palavra dela. Esta aba ficou com o nome antigo em dois lugares. |
| `aba06.py:1077` e `:1326` · opção do gesto | Sobe um degrau no Modo de conexão | Próximo Modo | Fica no par de «Próximo perfil» / «Perfil anterior», logo acima na mesma lista. *"Degrau"* é da vibração (Economia · Balanceado · Máximo); aqui ela ganha um segundo dono. **As duas linhas têm de mudar juntas** — a `:1326` é a linha da tabela e a `:1077` é a lista. |
| `aba06.py:1078` e `:1327` · opção do gesto | Abre e foca a Steam | Abrir a Steam | A mesma ação já se chama «Abrir a Steam» na tela «Definições Controle e Mouse», a três cliques dali. Duas palavras para o mesmo ato na mesma aba. **Custo declarado:** perde-se o *"foca"* — que a Steam já aberta vem para a frente. Nenhuma outra frase diz isso hoje; se ela quiser guardar o fato, ele cabe na dica. |
| `aba06.py:1873` · dica «Status do Modo» | Vale para **este perfil**. Enquanto estiver em **Nunca**, o controle é só gamepad e nada desta aba chega ao PC. | Vale para **este perfil**. **Desligado**, o controle é só gamepad e nada desta aba chega ao PC. | **«Nunca» não existe em nenhuma das dez abas** — medido com `olhar.py --palavra Nunca`, §7.2. A dica manda procurar uma opção que não está lá, que é o que o glossário proíbe em letra. **[10/09]** propôs a mesma troca; aqui só encurto a conjunção. |
| `aba06.py:1877` · dica «Função do teclado» | Liga o que o controle **digita**: os atalhos da tabela à direita, o teclado na tela e as três regiões do touchpad. / Passou a viajar no **perfil**, como o mouse vizinho já viajava. | Liga o que o controle **digita**: os atalhos das telas de botões, o teclado na tela e as três regiões do touchpad. Vale para este perfil. | O segundo parágrafo é **registro de obra**: conta o que mudou na versão, não o que o campo faz. O fato dentro dele — a escolha viaja no perfil — cabe em quatro palavras. *"à direita"* é referência de layout: a tabela não está à direita desta tela, e a centralização que ela pediu (item 3 da lista) pode movê-la de qualquer jeito. **[10/09]** já propunha «das telas de botões». |
| `aba06.py:1929` · dica «Navegação Interna» | Navegar **a janela do Hefesto** com o controle — abas, botões e listas. / Com os 4 controles ligados, cada jogador anda no seu próprio card e o **X de cada um grava no controle dele** — sem disputar o card do vizinho. / É outra coisa que o cursor do PC: esse é **um só**, e sai do controle do Player 1. | Navegar o Hefesto com o controle — abas, botões e listas. / O cursor do PC é outra coisa: é **um só**, e sai do controle marcado «Navega o PC». | **[10/09]** mediu o parágrafo do meio como FORTE-DEMAIS: não há um jogador com esse caminho — o `data-gesto` do campo não tem dono no pacote. Corto também *"a janela do"*: o glossário proíbe *"janela do aplicativo"*, e a mesma frase funciona sem ela. |
| `aba06.py:1899` · dica «Velocidade de cursor» | Uma velocidade só, porque é um número só no Hefesto: o **analógico esquerdo** e o **touch** do touchpad andam pelo mesmo ajuste. / De 1 a 12. O padrão do Hefesto é 6. | Vale para o **analógico esquerdo** e para o **touchpad**. De 1 a 12; o padrão é 6. | *"porque é um número só no Hefesto"* explica a nossa implementação em vez do efeito — a pergunta 1 do critério. *"O padrão do Hefesto"*: aqui não há outro padrão de ninguém. |
| `aba06.py:1920` · dica «Velocidade da rolagem» | Rola com o **analógico direito**. / De 1 a 5. O padrão do Hefesto é 1. | Vale para o **analógico direito**. De 1 a 5; o padrão é 1. | Par com a de cima: duas dicas vizinhas com a mesma forma se leem de relance; com formas diferentes, leem-se duas vezes. |
| `aba06.py:2146` · `title` da barra | Arraste para escolher a velocidade do cursor — de 1 a 12. Vale na hora. | Vale na hora. | O rótulo à esquerda já diz qual velocidade é e o `?` ao lado já diz a faixa: o `title` repetia os dois. O que só ele diz é que a mudança vale sem passar pelo «Aplicar» — e isso fica. |
| `aba06.py:2151` · `title` da barra | Arraste para escolher a velocidade da rolagem — de 1 a 5. Vale na hora. | Vale na hora. | idem. |
| `aba06.py:1939` · dica «Modo Steam» | O controle passa a navegar a **Steam** do jeito que navega num Steam Deck: o Modo Jogo responde ao d-pad e aos botões, sem mouse. / O terceiro degrau grava a escolha para a **próxima vez** — a Steam abre direto em Modo Jogo, sem ninguém clicar. Esse degrau vale para a máquina, não só para este perfil. | Serve para navegar a **Steam** sem mouse, com o d-pad e os botões. | **[10/09]** mediu FORTE-DEMAIS: não há no produto caminho nenhum para o Modo Jogo (`grep` por `steam://`, `bigpicture`, `gamepadui` no repositório inteiro), e o campo não tem dono. Sobra o que o campo é. **Ver §8.2: a terceira opção da lista continua prometendo o que a dica deixa de prometer.** |
| `aba06.py:2267` · botão da fileira | Configurar o estilo Point-and-click | Estilo Point-and-click | Os outros dois botões da fileira nomeiam a tela que abrem; este descreve o ato. E o CSS desta mesma aba já registra o risco de estouro deste rótulo (`aba06.py:672`, *"261,8px"*): 35 caracteres viram 22, e o título da pop-up passa a ser o mesmo do botão. |
| `aba06.py:2275` · confirmação da aba | Devolver a aba **Navegação** inteira ao de fábrica — as opções de ativação, os 5 gestos e as 22 linhas das duas telas de botões? | Devolver ao de fábrica a velocidade do cursor e a da rolagem? As telas de botões e os gestos não são tocados. | **[10/09]**, custo alto: o «Confirmar» não tem dono no pacote — a pergunta promete apagar cinco coisas, a caixa fecha, e nada muda. A frase passa a dizer o que o botão faz de verdade. |
| `aba06.py:2045` · dica «Definições Controle e Mouse» | As 22 linhas de cada botão do controle: o que ele faz — mouse, tecla ou programa, tudo na mesma lista. / A lista de botões sai de docs/data/pecas-do-dualsense.csv, o mesmo mapa que nomeia as peças do desenho. / O botão PS faz as duas coisas. Ele continua sendo a saída de emergência — os 5 gestos desta aba saem dele, e segurá-lo alterna o modo jogo —, e a tecla que você escolher para ele acontece junto: no toque curto, sem combo e fora do jogo. Escolher **— Nada —** cala as duas. / As três regiões do touchpad estão marcadas. Enquanto o touchpad do controle for o mouse do computador, o Hefesto não transforma o clique dele em tecla — a escolha fica guardada no perfil e volta a valer no dia em que isso mudar. / Valem para o controle que navega o PC: o P1 Cosmic Red USB. | As 22 linhas de cada botão: o que ele faz — mouse, tecla ou programa, na mesma lista. / O **PS** faz duas coisas: continua sendo a saída de emergência — os 5 gestos desta aba saem dele — e a tecla que você escolher acontece junto, no toque curto e fora do jogo. Escolher **— Nada —** cala o toque no PS: ele deixa de digitar e deixa de abrir a Steam; os gestos continuam. / Enquanto o touchpad for o ponteiro do computador, o clique dele não vira tecla — as três regiões ficam marcadas e a escolha fica guardada. / Valem para o controle que navega o PC: o P1 Cosmic Red USB. | A maior dica da aba: 768 caracteres, cinco parágrafos. O parágrafo da procedência (o caminho do `.csv`) é endereço nosso. **[10/09]** mediu duas correções aqui (`:2051` DESATUALIZADA — *"segurá-lo alterna o modo jogo"* já não é verdade; `:2054` IMPRECISA — *"cala as duas"*), e as duas entram. E a frase do touchpad sai da primeira pessoa (*"o Hefesto não transforma"*), que é a forma que o portão da confissão persegue. |
| `aba06.py:2436` · confirmação «Definições» | Devolver ao de fábrica as 22 linhas de **o que cada botão faz**? Isto apaga também os **atalhos de teclado** que este perfil guarda — inclusive os que você escreveu na janela antiga e esta lista não sabe mostrar. Para voltar **uma linha só**, use o ↺ dela em **Teclas do teclado**. O **Remapeamento dos botões** não é tocado. | Devolver ao de fábrica as 22 linhas? Isto apaga também os **atalhos de teclado** deste perfil — inclusive os de antes, que esta lista não sabe mostrar. Para voltar **uma linha só**, use o ↺ dela em **Teclas do teclado**. O **Remapeamento dos botões** não é tocado. | **[10/09]** (`:2438`, DESATUALIZADA): *"a janela antiga"* saiu do disco em 06/09 — quem chegar hoje não sabe do que a frase fala. O resto fica inteiro: é uma pergunta antes de um ato destrutivo, e cada ressalva dela tem custo se cair. |
| `aba06.py:2500` · dica «Teclas do teclado» | Escreva a tecla que o botão deve digitar. Vale **qualquer combinação** — não só as da lista de **Definições Controle e Mouse**. / Exemplos: **Alt + Tab**, **Ctrl + Shift + F**, **Super (tecla Windows)**, **F5**. / Campo em branco quer dizer que o botão não digita nada. / Só estes 8 botões aparecem aqui porque são os únicos em que o Hefesto guarda uma tecla escrita; nos outros o que vale é o que a lista de **Definições Controle e Mouse** escolhe. / O ↺ devolve só aquela linha ao de fábrica. | Escreva a tecla que o botão deve digitar — vale **qualquer combinação**. / Exemplos: **Alt + Tab**, **Ctrl + Shift + F**, **F5**. Campo em branco: o botão não digita nada. / O ↺ devolve a linha ao de fábrica. | O quarto parágrafo explica a estrutura do perfil para justificar por que a tela tem oito linhas e não 22 — é resposta a uma pergunta que ninguém faz diante de uma tela de oito linhas. E a tela cita «Definições Controle e Mouse» duas vezes em cinco parágrafos: quem está aqui já veio de lá. |
| `aba06.py:2060` · dica «Remapeamento» | As mesmas **22 linhas**, na mesma ordem, dizendo outra coisa: **para qual outro botão** cada um passa a valer. / É troca de botão por botão, e ela vale antes de o jogo ver. O que cada botão **faz** se escolhe na tela **Definições Controle e Mouse**, ao lado. / Valem para o controle que navega o PC: o P1 Cosmic Red USB. | As mesmas **22 linhas**, na mesma ordem, dizendo outra coisa: **para qual outro botão** cada um passa a valer. O que cada botão **faz** se escolhe na tela **Definições Controle e Mouse**. / Valem para o controle que navega o PC: o P1 Cosmic Red USB. | **[10/09]**, custo alto: *"vale antes de o jogo ver"* afirma no presente uma troca que **nunca é lida, nunca é gravada e nunca é aplicada** — não há campo de perfil, nem IPC, nem tradução antes do gamepad virtual. *"ao lado"* é referência de layout dentro de uma pop-up que cobre a tela. |
| `aba06.py:2576` · dica «Estilo Point-and-click» | Um **Estilo de Jogo**, como o FPS e o Corrida. O perfil escolhe usá-lo; o que ele faz é escrito **aqui**. / Enquanto ele estiver valendo, estas linhas mandam — as da aba voltam quando o estilo sai. / Serve para jogo de **apontar e clicar**, que espera mouse e não entende controle: o touchpad vira o ponteiro, e o toque vira o clique. | Serve para jogo de **apontar e clicar**, que espera mouse e não entende controle: **o touchpad vira o ponteiro**, e o toque vira o clique. | **[10/09]** mediu os dois primeiros parágrafos como FORTE-DEMAIS: a receita de um Estilo de Jogo tem gatilho, vibração, brilho e família — **botão nenhum viaja nela**, e o «Guardar no estilo» não tem dono. Sobra o terceiro parágrafo, que é o único que descreve o que a tela é. |
| `aba06.py:1774` · marca do touchpad (`title`) | O touchpad do controle continua sendo o mouse do computador nesta máquina, e enquanto for assim o Hefesto não transforma o clique dele em tecla. A escolha fica guardada no perfil e volta a valer no dia em que o touchpad deixar de ser o ponteiro. | O touchpad é o ponteiro do computador nesta máquina; enquanto for assim, o clique dele não vira tecla. A escolha fica guardada. | O mesmo fato, com o sujeito no lugar certo: quem não transforma o clique não somos nós por escolha, é o touchpad que já tem outro dono. A frase se repete em três linhas da tabela — cortá-la pela metade corta 354 caracteres da tela, não 118. |
| `a06_navegacao.py:601` · recado | O mouse e o teclado só se ligam fora do jogo: jogando, o controle é do jogo, e ligar o mouse aqui derrubaria o controle virtual e os jogadores do co-op no meio da partida. O degrau se troca na aba Jogar. | O mouse e o teclado só se ligam fora do jogo — ligar agora derrubaria o controle no meio da partida. O **Modo** se troca na aba Jogar. | Recado de recusa: ela precisa saber o que fazer, não o mecanismo. *"controle virtual"* e *"jogadores do co-op"* explicam a nossa arquitetura no momento em que ela quer ligar um mouse. E *"o degrau"* volta a nomear o campo pelo nome que ela trocou (§7.3). |
| `a06_navegacao.py:2027` · recado | mudei agora, e não guardei para amanhã: não há perfil ativo. Escolha um na aba Perfis e o Hefesto passa a lembrar disto. | mudei agora, mas não guardei: não há perfil ativo. Escolha um na aba Perfis. | *"não guardei para amanhã"* é figura — o tradutor tem de saber que *amanhã* quer dizer *a próxima vez que o jogo abrir*. A segunda metade repete a primeira. |
| `a06_navegacao.py:2068` · recado | a barra não mandou número nenhum, e {campo} ficou como estava. Arraste o cursor dela em vez de clicar no rótulo ao lado. | {campo} ficou como estava. Arraste o cursor da barra em vez de clicar no rótulo ao lado. | *"a barra não mandou número nenhum"* é o que o código viu; o que ela precisa é a segunda metade, que já está escrita e já ensina o gesto. |
| `a06_navegacao.py:1531` · recado | **O PS ainda não faz "{rótulo}":** hoje ele só sabe digitar teclas e abrir o teclado na tela. A escolha fica guardada no perfil — é feature que falta, não erro seu. | O **PS** digita teclas e abre o teclado na tela. A escolha "{rótulo}" fica guardada no perfil. | **Confissão de dívida nossa na tela** (§7.4) — *"é feature que falta"* é exatamente o que a ordem dela de 07/09 proíbe. O fato que importa (a escolha não se perde) fica. |
| `a06_navegacao.py:1560` · recado | **Não acendem nada hoje:** {botões}. A escolha fica guardada no perfil — é feature que falta, não erro seu. | **Guardadas no perfil, e sem efeito hoje:** {botões}. | idem — a mesma confissão, no mesmo arquivo, cinco linhas adiante. |
| `a06_navegacao.py:1566` · recado | **"— Nada —" ainda não cala estes:** {botões}. Eles continuam digitando o de fábrica, porque o Hefesto ainda não sabe distinguir "este botão não é do mouse" de "este botão foi calado". | O **"— Nada —"** não cala estes: {botões}. Eles continuam digitando o de fábrica. | A oração do *"porque"* é a nossa limitação contada à pessoa que está tentando usar o produto. O que ela precisa saber é o estado: continuam digitando o de fábrica. |
| `a06_navegacao.py:3225` · recado | não guardei: {n} no de fábrica, e o perfil "{p}" guarda {m} escolha(s) sua(s). Gravar isto as apagaria. A tela leva meio segundo para mostrar o que o perfil guarda; se você clicou antes disso, o que estava na tela era o desenho, e não a sua escolha. Espere a tabela se preencher e tente de novo. | não guardei: a tela está no de fábrica e o perfil "{p}" guarda {m} escolha(s) sua(s) — gravar isto as apagaria. Espere a tabela se preencher e tente de novo. | *"A tela leva meio segundo"* conta o nosso tique para justificar a recusa. A instrução que resolve — esperar e clicar de novo — já está no fim, e é o que sobra. |

### 3.2 — O que fica como está (114 textos), e por quê

| família | textos | por que fica |
| --- | --- | --- |
| Os rótulos de campo e os títulos de quadro | «Navegação» · «As opções de ativação» · «Status do Modo» · «Função do teclado» · «Navegação Interna» · «Velocidade de cursor» · «Velocidade da rolagem» · «Modo Steam» | **§2: são a digitação dela.** A frente de língua não desfaz decisão de tela. |
| Os grupos dentro das listas | «Mouse» · «Função do teclado» · «Executar Comando» · «Navegação Interna» · «Modo Steam» | idem, fala [11]. Só o «Modo de conexão» muda, e por medição (§7.3). |
| Os títulos e botões das quatro telas | «Definições Controle e Mouse» · «Remapeamento dos botões» · «Teclas do teclado» · «Estilo Point-and-click» · «Voltar ao padrão» · «Confirmar» · «Cancelar» · «Guardar» · «Guardar no estilo» · «Fechar» | os dois primeiros são dela (§2); os outros são verbos de uma palavra, que é o piso. **Ressalva na §8.3: «Guardar» e «Salvar Perfil» são dois verbos para gravar no mesmo perfil.** |
| As 26 opções de «o que o botão faz» | «Botão esquerdo» … «Escolher um programa…» | saem de `core/acoes_de_botao.ACOES`, **do lado do produto** — a tela LÊ, não digita. Trocar o rótulo aqui é trocar no dono, que é de outra frente. |
| As 22 opções do remapeamento | «Triângulo» … «— Sem troca —» | saem de `docs/data/pecas-do-dualsense.csv`, pela coluna `regiao`. Mesmo motivo. |
| Os rótulos de linha das tabelas | «Clique» · «Direção» · «Cima» · «Baixo» · «Esquerda» · «Direita» · «Clique esquerdo» · «Clique direito» · «Clique central» · «Deslizar» | saem do mesmo CSV (`TOUCH_REGIOES` lê a `nota` do touchpad). **Ver §8.4: «Clique central» na linha × «Botão do meio» na opção.** |
| Os cabeçalhos de tabela | «O que faz» · «Botão do controle» · «O que ele faz» · «Tecla que ele digita» · «Passa a valer como» · «O que ele faz neste estilo» | quatro palavras cada, e cada um responde exatamente a pergunta da coluna. |
| As opções dos quatro campos | «Só dentro do jogo» · «Só fora do jogo» · «Desativado» · «Ligada — cada controle navega o Hefesto» · «Só o Player 1 navega» · «Desligada» · «Desligado» · «Ligado — …» | são a resposta ao rótulo dela, e a forma longa das duas últimas é o que as separa. |
| As opções dos gestos | «Suspender mouse e teclado» · «Próximo perfil» · «Perfil anterior» · «Sair do modo jogo» · «Religar o controle» · «— Nada —» | curtas e literais. |
| Os cartões e o lugar vazio | «P1» … «P4» · «Navega o PC» · «Só a janela» · «Desconectado» · «Nenhum controle neste lugar.» | **«Só a janela» tem proposta medida em [10/09]** (`a06_navegacao.py:1009` → «Só o jogo»), e ela é de verdade, não de língua: o controle que não navega o PC chega ao **jogo**, não à janela. Deixo com o dono daquela medição para não propor duas coisas sobre a mesma palavra. |
| O rodapé | «Aplicar» · «Salvar Perfil» · «Importar» · «Exportar» e os quatro `title` | **não é posse desta frente**: o rodapé é o esqueleto, e ele é o mesmo nas dez abas. |
| Os quatro `title` curtos | «Fecha sem mudar nada.» · «Escreva a tecla que este botão digita.» · «Voltar só esta linha ao de fábrica.» · o `placeholder` «não digita nada» | uma respiração cada, e nenhum repete o rótulo ao lado. |

---

## §4 — A TABELA — 10 Perfis

**Esta aba NÃO está na minha posse** — a C4 e a E1 estão reescrevendo campos
dela agora. A proposta abaixo foi feita **lendo a página publicada**
(`src/hefesto_dualsense4unix/interface/paginas/10-perfis.html`); o endereço do
gerador vai junto, medido por busca de texto, para quem aplicar.

| onde | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `10-perfis.html:1924` · rótulo do bloco | Perfis Salvos | Perfis salvos | **Maiúscula decorativa** — item 4 da lista dela, que ela transformou em regra: *"Esse tipo de coisa não pode se repetir na interface."* |
| `10-perfis.html:1931` · cabeçalho | Priorização | Prioridade | O campo do editor ao lado chama o mesmo número de **Prioridade**. Duas palavras, um dado, na mesma tela. |
| `10-perfis.html:1931` · cabeçalho | Quando usar | Funciona em | idem: o editor chama esta coluna de **Funciona em**. **Depende da C4**, que está mudando o que esse campo oferece. |
| `10-perfis.html:1931` · `title` | Duplo clique para ordenar por esta coluna; de novo, inverte. | Duplo clique ordena por esta coluna; de novo, inverte. | *"para ordenar"* descreve a intenção; *"ordena"* descreve o efeito. |
| `10-perfis.html:1924` · `title`/`aria` | Relê a lista do disco. Não descarta o que está no editor ao lado. | Relê a lista de perfis. Não mexe no editor ao lado. | *"do disco"* é onde **nós** guardamos. Para quem usa, o que se relê é a lista de perfis. |
| `10-perfis.html:1924` · `title` da busca | Procurar um perfil pelo nome, pela prioridade ou pelo jogo. | Procura pelo nome, pela prioridade ou pelo jogo. | o campo tem `placeholder` «procurar» ao lado: o `title` repetia a palavra. |
| `10-perfis.html:1953` · `title` do «Novo» | Perfil em branco, já com a regra do jogo aberto agora — venha ele de onde vier. | Perfil em branco. Com um jogo da Steam aberto, ele nasce valendo só para esse jogo; sem isso, vale para tudo. | **[10/09]**, custo alto: *"venha ele de onde vier"* é falso — com emulador, GOG ou atalho próprio o perfil nasce **catch-all com prioridade acima de todos os outros**. É a única linha desta aba em que a proposta **cresce**, e cresce porque a frase curta mentia. |
| `10-perfis.html:1954` · `title` do «Remover» | Apaga do disco. Pergunta antes. | Apaga o perfil. Pergunta antes. | idem *"disco"*. |
| `10-perfis.html:1980` · rótulo do bloco | Definições | Editar | «Definições» não diz o que a coluna é, e colide com a tela «Definições Controle e Mouse» da Navegação. A coluna é o editor do perfil selecionado. **Confirmar com a C4 antes de aplicar.** |
| `10-perfis.html:1980` · `title` do ↺ | Desfaz um perfil salvo por engano: cada gravação já guarda a anterior. | Volta o perfil à gravação anterior. | a segunda metade explica **como** guardamos a cópia; o botão precisa dizer o que acontece ao clicar. |
| `10-perfis.html:1990` · `title` da prioridade | Quando dois perfis servem ao mesmo tempo, o de número maior entra. O Universal fica em zero, para nunca atropelar ninguém e nunca deixar o controle sem nada. | Quando dois perfis servem ao mesmo tempo, entra o de número maior. O Universal fica em zero: ele só entra quando nenhum outro serve. | *"atropelar"* é figura, e a dupla negativa (*"nunca … e nunca …"*) obriga a ler duas vezes para chegar a uma regra simples. |
| `10-perfis.html:2085` · `title` do «Detectar» | Pega o jogo que está rodando atrás desta janela e monta a regra — funciona com jogo de qualquer lugar, não só da Steam. | Usa o jogo que está aberto agora e monta a regra — de qualquer lugar, não só da Steam. | *"atrás desta janela"* é metáfora espacial: a pessoa não sabe o que está atrás. A afirmação foi **conferida e mantida** pelo adversário de 10/09. |
| `10-perfis.html:2089` · `title` do «Estilo de Jogo» | Pré-aplica um perfil inteiro: escolhendo FPS, o gatilho, a luz, a vibração e a máscara já vêm resolvidos. Os catorze de fábrica não se editam; o Personalizado usa o que você ajustou nas abas. | Pré-aplica de uma vez o gatilho, a vibração e a cor da luz. Os catorze de fábrica não se editam; o Personalizado usa o que você ajustou nas abas. | **[10/09]** FORTE-DEMAIS: a receita de um Estilo tem gatilho, vibração e brilho — **a máscara não está lá**. *"um perfil inteiro"* também promete demais: um Estilo não é um perfil (glossário). |
| `10-perfis.html:2115` · `title` da coluna | Controle — o perfil não guarda uma configuração: guarda uma por controle. Esta tabela mostra, para cada controle, quais ajustes ele tem só para si e quais usa do perfil. | O perfil guarda um ajuste por controle. Aqui você vê quais são só deste controle e quais vêm do perfil. | começa repetindo o nome da coluna e diz a mesma coisa duas vezes — a negativa (*"não guarda uma"*) e a afirmativa logo depois. |
| `10-perfis.html:2116` · `title` da coluna | Aceso: este perfil guarda um ajuste só deste controle. Apagado: ele usa o do perfil, igual aos outros. São os sete ajustes que o perfil sabe guardar por controle — luz, gatilhos, vibração, alto-falante, microfone, sensores e máscara. | Aceso: este perfil guarda um ajuste só deste controle. Apagado: ele usa o do perfil. São sete: luz, gatilhos, vibração, alto-falante, microfone, sensores e máscara. | *"igual aos outros"* e *"que o perfil sabe guardar por controle"* repetem a primeira oração. **[10/09]** tem uma ressalva medida sobre a máscara (`aba10.py:1529`) que entra junto se ela aprovar aquela. |
| `10-perfis.html:2117` · `title` da coluna | O endereço de rádio do controle. É por ele que o perfil reconhece a peça — e ele não muda quando você troca o cabo pelo rádio, então o que você deixou hoje volta amanhã. | O endereço de rádio do controle: é por ele que o perfil o reconhece, no cabo e no rádio. | a segunda metade conta a consequência da primeira em dobro de palavras. **Ver §8.5: a coluna mostra o endereço, e o glossário diz que o endereço não vai à tela.** |
| `10-perfis.html:2267` e `:2341` · `title` do lugar vazio | Nenhum controle neste lugar. O perfil guarda o que está aqui pelo ID da peça: quando o P3 voltar, ele encontra o que você deixou. | Este lugar está vazio. O que você ajusta fica guardado com o **controle**: quando ele voltar, encontra o que você deixou. | **[10/09]** FORTE-DEMAIS: *"quando o P3 voltar"* promete pelo assento, e o que volta é o **controle** — o assento é o lugar, e quem guarda é a peça. Vale para as duas linhas (P3 e P4). |
| `10-perfis.html:1904` · fita da contagem | 3 de 4 controles com ajuste próprio neste perfil | 3 de 4 controles com ajuste próprio | *"neste perfil"* — a fita está dentro do quadro «Perfis», ao lado da contagem de perfis. |

### 4.1 — O que fica na Perfis (61 textos)

| família | por que fica |
| --- | --- |
| «Perfis» · a dica do quadro · «Nome:» · «Prioridade:» · «Nome do Jogo:» · «Estilo de Jogo:» | rótulos de uma a três palavras, cada um dizendo o campo. **A dica do quadro tem correção medida em [10/09]** (`aba10.py:1326`: faltam microfone e o resto da lista) — de verdade, não de língua. |
| «Funciona em:» e as seis opções | **é a C4**, por ordem dela (item 7 da lista: tirar quatro opções e pôr os lançadores). Nem toco. |
| «Nome do Jogo:» e a lista que o preenche | **é a C4** (item 6: mostrar nome e código, e não o nome do programa). |
| Os 15 Estilos de Jogo | «FPS» … «Personalizado» — nomes de gênero, decididos por ela em 06/09. |
| «Duplicar» · «Ativar» · «Detectar» e os `title` de «Duplicar» e «Ativar» | verbo de uma palavra, e os dois `title` cabem numa respiração. |
| As linhas da lista (`Jogo · mk1.exe`, `Jogo da Steam · 1245620`, `Todos — 4 disputam`) | são **dado**, escrito pelo pacote a partir do perfil; não há texto a encurtar. |
| O rodapé e a moldura | não é posse desta frente. |

---

## §5 — A CONTA

**Método:** texto visível extraído das páginas publicadas (`interface/paginas/`),
com `<script>`, `<style>` e comentário HTML fora, deduplicado por (tipo, texto);
as frases do canal de recado foram lidas por AST em
`pacotes/a06_navegacao.py`, sem importar módulo nenhum.

| | hoje | com a proposta | diferença |
| --- | --- | --- | --- |
| 06 Navegação — texto estático (139) | 7.154 | 4.752 | **−2.402 (−34%)** |
| 06 Navegação — recados vivos (7 dos 33) | 1.181 | 667 | **−514 (−44%)** |
| 10 Perfis — texto estático (79) | 3.088 | 2.702 | **−386 (−13%)** |
| **soma** | **11.423** | **8.121** | **−3.302 (−29%)** |

**Onde está o corte:** seis dicas concentram **1.216 dos 2.402 caracteres** que
saem da Navegação — a do quadro, a de «Quem navega», a dos gestos, a de «Modo
Steam», a de «Definições Controle e Mouse» e a de «Teclas do teclado». Nenhuma
delas perde fato: perdem a procedência do dado, o registro de obra e a
explicação da nossa implementação.

**E uma linha cresce**, de propósito: o `title` do «Novo» da Perfis, de 79 para
109 caracteres. A frase curta dizia *"venha ele de onde vier"* e era falsa; a
longa diz o que acontece nos dois casos. **Quando a frase curta mente, encurtar
não é a entrega.**

---

## §6 — O QUE NÃO PROPUS, e a razão de cada um

1. **Os doze rótulos da §2.** São a digitação dela. É o achado que mais mudou
   esta frente, e está escrito lá em cima porque vale para as outras quatro.

2. **As 48 opções que a tela LÊ do produto** — as 26 de «o que o botão faz»
   (`core/acoes_de_botao.ACOES`) e as 22 do remapeamento
   (`docs/data/pecas-do-dualsense.csv`). Elas já não são digitadas aqui: foram
   ligadas ao dono em 01/09 justamente porque divergiam. Reescrevê-las na tela
   recria a divergência que aquela leva fechou.

3. **Os recados de diagnóstico** — nove frases como *"linha-de-botao: o clique
   não disse qual botão (veio X). O `data-linha` de cada `<select>` é o id do
   botão, e ele vem do gerador"*. Elas mostram identificador de código e
   caminho de arquivo na tela, e pela régua da §0 seriam as piores da aba.
   **Não as proponho, e a razão é medida:** todas nascem de um `data-*` que
   sumiu do desenho — isto é, só aparecem quando a página está quebrada, e
   nunca quando o produto funciona. Cada uma nomeia o atributo que falta, que é
   o que conserta. Encurtá-las custa o diagnóstico e não devolve nada a quem
   usa. **Se ela quiser que a tela nunca mostre isso, o caminho é outro:** um
   recado curto para ela e o detalhe no `journal` — e isso é feature, que esta
   onda não faz.

4. **«Só a janela»** (`a06_navegacao.py:1009`). Parece o rótulo mais confuso da
   aba, e é — mas já tem proposta **medida** de 10/09 («Só o jogo»), e ela é de
   verdade, não de língua. Duas propostas sobre a mesma palavra fariam a
   integração escolher, que é o defeito que a posse por arquivo existe para
   evitar.

5. **«Aplicar» · «Salvar Perfil» · «Importar» · «Exportar»** e os quatro `title`
   do rodapé. Estão nas duas abas desta frente **e nas outras oito**: são o
   esqueleto, e mudá-los aqui é mudar em dez lugares pela mão de quem só olhou
   dois.

6. **A dica do quadro da Perfis** e a do «Detectar». As duas já foram medidas em
   10/09 e as duas são correções de FATO (faltam itens na lista; a regra que o
   botão monta). A língua delas está boa: uma respiração, sem figura.

7. **A frase *"Nenhum atalho de fábrica digita letra"*.** Ela parece ruído
   dentro da dica do quadro — e **não é**: o adversário de 10/09 a conferiu e a
   acusação caiu. Ela é a razão de existir o teclado na tela. Encurtei a forma
   (*"de fábrica"* sai) e guardei o fato.

8. **«Voltar ao padrão», «Confirmar», «Cancelar», «Guardar», «Fechar».** Verbo
   de uma palavra é o piso desta tela; abaixo disso só há ícone, e ícone sem
   palavra é outra discussão.

---

## §7 — OS QUATRO ACHADOS QUE NÃO SÃO PROPOSTA DE TEXTO

São fatos medidos. Vão aqui porque quem aplicar a §3 tem de saber deles.

### 7.1 — A tela lê uma palavra que o glossário proíbe, e nenhum portão vê

`docs/A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md`, §3:

> **Proibido em texto de tela:** `env`, `vdf`, **`uinput`**, `hidraw`, `MAC`,
> `uniq`, `wrapper_used`, `dedup`, "mesa", …

Medido com o instrumento da própria casa:

```
$ olhar.py --palavra uinput --publicado
06-navegacao.html — 1 ocorrência visível     vem de: aba06.py:2659
09-sistema.html   — 1 ocorrência visível     vem de: aba09.py:1307
```

A de 09 está **dentro de uma linha de log do serviço**, que é a saída do daemon
citada verbatim. A de 06 é **prosa nossa, na primeira dica da aba**.

**E o portão que deveria pegar não existe:**
`interface/frases_que_ela_baniu.PALAVRAS_BANIDAS` tem três palavras — `mesa`,
`reconciliad`, `compactada`. Das onze proibições do glossário, **só a «mesa»
tem régua**; os oito identificadores (`env`, `vdf`, `uinput`, `hidraw`, `MAC`,
`uniq`, `wrapper_used`, `dedup`) não têm nenhuma. Não a escrevi: é fora da posse desta
frente, e é frente própria (a mesma régua serve às dez abas).

### 7.2 — A primeira dica da aba manda procurar uma opção que não existe

«Status do Modo» diz: *"Enquanto estiver em **Nunca**, o controle é só gamepad"*.

```
$ olhar.py --palavra Nunca --publicado
06-navegacao.html — 1 ocorrência: «Enquanto estiver em Nunca»   vem de: aba06.py:1874
```

As outras quatro ocorrências nas dez abas são a palavra no meio de uma frase
(*"nunca se repete"*), não um rótulo. **Não há opção «Nunca» em lugar nenhum do
produto** — o interruptor desta linha diz Ligado · Desligado · —. O glossário
proíbe em letra *"qualquer frase que mande a pessoa procurar um botão … que não
existe"*. `[10/09]` chegou ao mesmo lugar por outro caminho e propôs
«Desligado».

### 7.3 — Dois textos nomeiam um campo pelo nome que ela trocou

A opção do gesto e a dica dos gestos dizem **«Modo de conexão»**. A legenda da
aba Jogar, que é onde o campo mora, diz:

> **O nome da seção é "Modo", e não "Modo de conexão"** — é a sua palavra
> (*"Abre as seções de Modo"*).

(`src/hefesto_dualsense4unix/interface/paginas/01-jogar.html:3763`)

São dois lugares na Navegação: `aba06.py:1077` (o grupo da lista) e `aba06.py:1326`
(a linha da tabela) — e o `aba06.py:2648` na dica. **Os três têm de mudar
juntos**, ou a tela passa a ter dois nomes para um campo em vez de um errado.

### 7.4 — O portão da confissão não enxerga o canal de recado desta aba

`scripts/check_a_tela_nao_confessa.py` termina **verde**:

```
OK: a tela não confessa dívida nossa — 10 frase(s) legítima(s), 0 dívida(s) ainda na tela.
```

E estas três frases estão na tela, em `pacotes/a06_navegacao.py`:

| linha | a frase |
| --- | --- |
| `:1533` | …a escolha fica guardada no perfil — **é feature que falta, não erro seu**. |
| `:1562` | …a escolha fica guardada no perfil — **é feature que falta, não erro seu**. |
| `:1568` | …porque **o Hefesto ainda não sabe distinguir** "este botão não é do mouse" de "este botão foi calado". |

**A mordida**, chamando o casador do próprio portão com as três frases:

```
[]                                   <- "…é feature que falta, não erro seu."
['Eles continuam digitando o de…']   <- "…o Hefesto ainda não sabe distinguir…"
['O PS ainda não faz «…»: hoje…']    <- "O PS ainda não faz «…»"
```

**Duas das três têm exatamente a forma que o portão caça — e ele dá verde.** A
razão é estrutural e está no cabeçalho dele: ele lê (1) as **páginas**, e (2)
toda `Fala` declarada em `src/`, pelo campo `texto=`. Estas frases não são
`Fala` — são `str` montadas em tempo de execução e injetadas na página pelo
piloto —, logo não estão na página que ele lê nem na lista que ele varre. A
terceira, *"é feature que falta"*, **nem casa com a forma**: é uma confissão que
a régua não reconhece.

Isto **não é da minha posse curar** (o portão é de `scripts/`), e não o toquei.
O que a proposta da §3 faz é tirar as três frases da tela — o que fecha o caso
pelo lado certo, o do texto. **Mas o ponto cego continua**: a próxima frase de
recado que confessar dívida vai passar do mesmo jeito.

---

## §8 — O QUE É DELA DECIDIR

1. **«Abre e foca a Steam» → «Abrir a Steam».** A troca perde o fato de que uma
   Steam já aberta vem para a frente. Ele cabe na dica; hoje não está em lugar
   nenhum. Vale guardar?

2. **A terceira opção do «Modo Steam».** A dica deixa de prometer que a Steam
   abre em Modo Jogo na próxima vez (medido: não há caminho no produto), mas a
   **opção continua dizendo** *"Ligado, e a Steam abre em Modo Jogo na próxima
   vez"*. Tirar uma opção de uma lista é **feature**, e esta onda não faz
   feature — então ela fica, e a contradição fica com ela. É decisão dela: ou a
   opção sai, ou ela espera o dono que falta.

3. **«Guardar» × «Salvar Perfil».** As quatro telas da Navegação gravam com
   **Guardar**; o rodapé das dez abas grava com **Salvar Perfil**. Os dois
   escrevem no mesmo perfil. Uma palavra só é melhor — e a palavra que sobra
   muda dez páginas, não duas.

4. **«Clique central» × «Botão do meio».** A linha da tabela chama a região do
   touchpad de *Clique central*; a opção ao lado, na mesma linha, chama a mesma
   coisa de *Botão do meio*. As duas vêm do produto (a primeira da `nota` do
   touchpad em `docs/data/pecas-do-dualsense.csv`, a segunda de
   `core/acoes_de_botao`), e por isso não proponho: a cura é no dono, e são dois
   donos.

5. **A coluna «ID da peça» da Perfis mostra o endereço de rádio na tela.** O
   glossário diz, na linha do controle, *"`uniq` (o endereço, nunca na tela)"* —
   e a regra do rótulo dos nós de som, decidida por ela em 09/09, é
   *"**O endereço nunca entra no rótulo**"*. A coluna existe e é útil (é por ela
   que se distingue dois controles do mesmo modelo). **Tirar a coluna é
   feature**, então só aponto. Se a leitura do glossário for a estrita, esta é a
   única tela do produto que a contraria.

---

## §9 — Como conferir esta entrega

```bash
PY=/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python

# a foto do antes, na vista dela — as duas abas, sem janela na tela dela
PYTHONPATH=$PWD/src $PY src/hefesto_dualsense4unix/interface/olhar.py \
  06-navegacao.html --publicado --vista dela

# os dois achados medidos da §7.1 e §7.2
PYTHONPATH=$PWD/src $PY src/hefesto_dualsense4unix/interface/olhar.py --palavra uinput --publicado
PYTHONPATH=$PWD/src $PY src/hefesto_dualsense4unix/interface/olhar.py --palavra Nunca --publicado

# o portão da confissão, verde com três confissões na tela (§7.4)
PYTHONPATH=$PWD/src $PY scripts/check_a_tela_nao_confessa.py
grep -n 'feature que falta' src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
```

**Nenhum arquivo de `src/` foi tocado por esta frente.** O único arquivo novo é
este relatório e as seis fotos ao lado dele.
