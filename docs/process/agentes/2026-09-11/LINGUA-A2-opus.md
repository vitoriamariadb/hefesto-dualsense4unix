# LINGUA-A2 — a língua da aba Lançadores

**11/09/2026.** Frente **A2** da onda **A — A LÍNGUA DA TELA**
(`docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`).

**ESTA ENTREGA É PROPOSTA, NÃO COMMIT DE TELA.** Nenhuma frase foi trocada no
gerador. Ordem dela: *"preciso que vc vá me mostrando a tela do antes e depois*  <!-- noqa-acento: citação literal dela -->
*dos agentes. Pra apresentarem as propostas tá bom?"*  <!-- noqa-acento: citação literal dela -->

---

## §0 — O ESTADO, EM UMA LINHA

**85 textos vistoriados · 34 propostos mudar · 51 mantidos · 6.450 → 4.225
caracteres (−34,5%).** Na página publicada, dentro da moldura da janela, a aba
cai de **3.354 para 2.354 caracteres (−29,8%)**.

**E O ACHADO QUE ORGANIZA TUDO NÃO ESTÁ NA FOTO.** Na máquina dela — os seis
lançadores achados — a aba mostra **seis linhas idênticas**, e **cinco dos seis
cartões têm o corpo VAZIO**. As três palavras que aparecem **seis vezes cada**
são `LOCALIZADO`, «Abrir o lançador» e «Localizar este Lançador» — e a segunda
**só funciona em um dos seis**. Ver §2.

---

## §1 — A FOTO DO ANTES

`docs/process/agentes/2026-09-11/LINGUA-A2-antes-07-lancadores.png` — vista dela
(1918x840), página publicada, Chrome sem janela na tela:

```
PYTHONPATH=$PWD/src .venv/bin/python \
  src/hefesto_dualsense4unix/interface/olhar.py 07-lancadores.html --publicado --vista dela
→ {"png": "/tmp/olhar-07-publicado.png", "caixa": "janela", "larg": 1600,
   "alt": 777, "vista": "1918x840", "passa_da_dobra": 0, "rolagem_lateral": false}
```

**O QUE A FOTO É, e ser honesto sobre isso muda a leitura dela:** a página
publicada nasce de `cartoes(None)` — o estado *"ainda não procurei"*, a primeira
meia volta. É por isso que os seis selos dizem `NÃO SEI` e cinco cartões
repetem a mesma frase. **Não é o que a mesa dela mostra depois do primeiro
tique**, e a §2 mede aquilo.

Duas mudanças de hoje já estão na foto e não se repropõem: a frase
«Achei este lançador aqui…» saiu dos cartões achados (`DIZ_ACHEI = ""`,
`desenho_dos_lancadores.py:899`) e o selo bom da Steam virou `LOCALIZADO`
(`desenho_dos_lancadores.py:1653`).

---

## §2 — A ABA NA MESA DELA, medida sem abrir janela nenhuma

`desenho_dos_lancadores.cartoes()` alimentado com uma `Leitura` de máquina em que
os seis foram achados e a biblioteca da Steam foi lida:

| selo | cartão | linha de cima | corpo | botões |
| --- | --- | --- | --- | --- |
| `LOCALIZADO` | Steam | 23 jogos instalados | Os controles chegam. O atalho de inicialização está no lugar em 63 jogos da sua biblioteca (instalados ou não). | Abrir o lançador · Criar perfil para um jogo · Localizar este Lançador |
| `LOCALIZADO` | Heroic (Epic · GOG) | 12 jogos na biblioteca · 3 instalados | **(vazio)** | Abrir o lançador · Localizar este Lançador |
| `LOCALIZADO` | Lutris | 8 jogos na biblioteca · 2 instalados | **(vazio)** | Abrir o lançador · Localizar este Lançador |
| `LOCALIZADO` | Flatpak | 5 caixas examinadas | **(vazio)** | Abrir o lançador · Localizar este Lançador |
| `LOCALIZADO` | RetroArch | 0 jogos na biblioteca | **(vazio)** | Abrir o lançador · Localizar este Lançador |
| `LOCALIZADO` | Dolphin · mGBA | 2 jogos na biblioteca | **(vazio)** | Abrir o lançador · Localizar este Lançador |

**583 caracteres nos seis cartões**, e três frases ocupam 6/6 das linhas. Três
coisas saem daqui, e as três viram proposta:

1. **`LOCALIZADO` × 6 não separa nada.** Um selo que diz a mesma palavra em
   todos os cartões é uma coluna de ruído: quem lê a tela procura a diferença
   e ela não está ali — está na linha de cima, que é a única que muda. Nada a
   propor no selo bom (é a palavra dela, 09/09); o que muda é o que está
   **em volta** dele.
2. **«Abrir o lançador» × 6, e ele só abre UM.** Nos outros cinco o gesto
   recusa (`a07_lancadores.py:2080`), e a recusa é a confissão de dívida da §3,
   item **M9**. A existência do botão nos cinco é decisão dela de 02/09 e **não
   se repropõe aqui**; o que se repropõe é a frase.
3. **«Localizar este Lançador» num cartão que diz `LOCALIZADO`.** Selo e botão
   se contradizem, exatamente ao contrário do que o desenho de 08/09 buscava
   (*não localizado → localizar este lançador*, lido de cima para baixo como
   uma frase só). Proposta **B7b**.

---

## §3 — A TABELA

`desenho` = `src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py` ·
`a07` = `src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py` ·
`aba07` = `src/hefesto_dualsense4unix/interface/aba07.py`.

### 3.1 — O quadro e os três botões do topo

| onde | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `aba07:526` | De onde os seus jogos vêm | **mantido** | diz o que a aba é, em cinco palavras, e atravessa a tradução |
| `aba07:527-537` (o `?`) | *(4 parágrafos, 712 caracteres — ver 3.1.1)* | *(3 frases, 299 caracteres)* | não cabe numa respiração; **repete três coisas que já estão na tela**; e uma delas caducou em 10/09 |
| `aba07:544` | Detectar o jogo que está aberto | **Detectar o jogo aberto** | «que está» não acrescenta nada num botão; −9 caracteres no botão mais largo da aba |
| `aba07:545` | Procurar de novo | **mantido** | duas palavras, ato claro |
| `desenho:1023` | Adicionar novo **L**ançador | **Adicionar novo lançador** | maiúscula decorativa no meio da frase. **É a regra dela do item 4 da §2 do índice**: *"Esse tipo de coisa não pode se repetir na interface."* E a mesma aba já escreve «Localizar um lançador» em minúscula no título da tela de registro — duas grafias, uma palavra |

#### 3.1.1 — O `?` do quadro, palavra por palavra

**HOJE (712 caracteres):**

> O Hefesto não é só para a Steam. Ele casa o perfil pelo **nome do processo** e
> pela **janela** — o jogo pode vir de onde quiser.
>
> Esta aba procura os lançadores e emuladores instalados, diz **se os controles
> chegam lá**, o que impede quando não chegam, e conserta o que dá para
> consertar sozinho.
>
> O que impede é do **lançador**, nunca do controle — é a linha de
> inicialização, a exceção do Steam Input, a permissão de aparelho. Por isso a
> resposta vale igual para os **2** (1 no cabo, 1 no rádio), e por isso a fita
> lá em cima está esmaecida aqui: não há o que escolher por controle.
>
> **Detectar o jogo que está aberto** é o caminho curto: abra o jogo de onde
> for, volte aqui e clique — o perfil nasce com a regra certa, sem digitar nada.

**PROPOSTA (299 caracteres):**

> Esta aba procura os lançadores instalados nesta máquina. O perfil casa pelo
> **nome do processo** e pela **janela** — o jogo pode vir de qualquer um deles.
>
> O que impede um jogo de receber o controle é do **lançador**, nunca do
> controle.
>
> **Detectar o jogo aberto** é o caminho curto: abra o jogo, volte aqui e
> clique.

**O QUE SAI, e onde cada fato sobrevive:**

| sai | por quê | onde o fato continua |
| --- | --- | --- |
| *"O Hefesto não é só para a Steam"* | define por negação, e a tela já mostra seis cartões, cinco dos quais não são a Steam | os seis cartões |
| *"e conserta o que dá para consertar sozinho"* | **CADUCOU EM 10/09/2026.** O «Consertar» dos outros cinco lançadores saiu por palavra dela (`LANCADOR-LOCALIZAR-01`). Sobrou só no cartão da Steam — a frase promete pelos seis | o botão «Consertar» do cartão da Steam |
| *"a linha de inicialização, a exceção do Steam Input, a permissão de aparelho"* | são exemplos, não o fato; e **«linha de inicialização» é a segunda palavra da aba para uma coisa só** — o corpo do cartão da Steam diz «atalho de inicialização», que é o termo do glossário | «atalho de inicialização» (`desenho:1632`) e o botão «Desligar o Steam Input» |
| *"vale igual para os 2 (1 no cabo, 1 no rádio)"* | **repete o cabeçalho a dois centímetros** (`2 controles: 1 USB · 1 BT`) | o cabeçalho, que é o dono do número |
| *"a fita lá em cima está esmaecida aqui"* | metáfora de posição, morre na tradução — e **a própria fita já diz isso na dica dela** | `title` da fita (`monta.py:906`) |
| *"sem digitar nada"* | o botão já é um clique | — |

**A CONSEQUÊNCIA DE CÓDIGO, e ela não é cosmética:** com esse trecho fora, o
endereço `lanc-quantos` (`desenho.QUANTOS`) e a função `quantos_html` perdem o
único consumidor. Quem executar tira os três juntos ou o piloto pinta num
endereço que não existe mais. Está na §7.

### 3.2 — Os selos

| onde | hoje | proposta | por quê |
| --- | --- | --- | --- |
| `desenho:102` | CHEGAM | **não proposto — ver §5** | **nenhum caminho do produto o produz desde hoje.** Não é texto que a pessoa lê |
| `desenho:103` | NÃO CHEGAM | **COM IMPEDIMENTO** | a contagem do topo já diz *"N com impedimentos"*; o cartão dizia outra palavra para o mesmo fato. É a mesma cura que em 09/09 trocou «encontrados» por «localizados» no topo. **E há um segundo motivo**: com o `CHEGAM` morto, «NÃO CHEGAM» virou um negativo sem positivo — ela não tem contra o que lê-lo |
| `desenho:104` | NÃO LOCALIZADO | **mantido** | palavra dela, 08/09 |
| `desenho:105` | NÃO SEI | **mantido** | *"não sei" é resposta; palpite não é* |
| `desenho:119` | LOCALIZADO | **mantido** | palavra dela, 09/09 |
| `desenho:666-668` | 0 localizados · 0 com impedimentos | **mantido** | curto, e é o dono da palavra que o selo passa a repetir |

### 3.3 — O corpo dos cartões

| onde | hoje | proposta | por quê |
| --- | --- | --- | --- |
| `desenho:877-880` | **O perfil casa pelo nome do processo e pela janela.** Um jogo aberto por aqui entra pelo mesmo caminho de qualquer outro. | **O perfil casa pelo nome do processo e pela janela.** | a segunda oração **é a primeira dita de novo**. E o custo é ×5: na foto, esta frase ocupa cinco cartões empilhados. 118 → 50 |
| `desenho:914-920` | **Não localizei este lançador nesta máquina.** Procurei o atalho `.desktop` nas pastas de aplicativos e o comando no `PATH`. Instalado de outro jeito (um AppImage solto, por exemplo) ele não aparece aqui — e o perfil continua casando pelo nome do processo e pela janela. | **Não localizei este lançador onde sei procurar.** Se ele está aqui, use «Localizar este lançador» e me mostre onde. | 262 caracteres que **explicam a mecânica em vez do efeito** (pergunta 1 da sprint). A primeira oração é o selo em prosa; as duas buscas estão ditas outras **duas** vezes na mesma aba (o `?` da tela de registro e a recusa de `a07:2771`); e o que falta à frase é justamente o que fazer — que agora ela diz. 262 → 112 |
| `desenho:1608-1609` | **Sem wrapper** — N jogos sem o atalho de inicialização do Hefesto na linha de comando. | **N jogos sem o atalho de inicialização do Hefesto.** | **duas palavras proibidas em texto de tela numa frase só.** O glossário (§3) lista `wrapper_used` e *"linha de comando"* entre as proibidas; e «wrapper» é inglês numa aba cujo termo é «atalho de inicialização» |
| `desenho:1632-1634` | Os controles chegam. O atalho de inicialização está no lugar em N jogos da sua biblioteca (instalados ou não). | **mantido** | o parêntese é decisão dela (PO 04/09, `07[04]` — *"O corpo nomeia o conjunto"*), e com o `CHEGAM` morto esta é a **única** frase da aba que dá o veredito bom |
| `desenho:1596-1597` | **Não consegui ler a biblioteca da Steam** — {erro}. Nada foi alterado. | **mantido** | diz o que houve e o que não mudou. É o molde |
| `desenho:1575` | Estou lendo a sua biblioteca da Steam… | **mantido** | — |
| `desenho:358-359` | Nenhum jogo com pendência, e nenhum que você tenha tirado ou dispensado. | **Nada pendente, e você não tirou nem dispensou nenhum jogo.** | as duas metades continuam (a lista tem quatro origens); o que sai é a sintaxe torcida de *"nenhum que você tenha"*, que é a construção que mais custa a um tradutor. 72 → 58 |
| `desenho:1743-1744` | N jogos já sabem por onde entrar | **mantido** | — |
| `desenho:1746-1747` | N jogos com a linha intocável — só reparo manual | **N jogos com a linha editada à mão** | «intocável» é a nossa decisão, não o fato; e **a própria aba já chama esse estado de «linha editada à mão»** (`a07:313`), na linha do jogo, dois centímetros abaixo. *"só reparo manual"* manda fazer algo sem dizer como — e o botão «Copiar a linha», que só nasce neste estado, é o como. 48 → 33 |

### 3.4 — Os botões dos cartões e as linhas de jogo

| onde | hoje | proposta | por quê |
| --- | --- | --- | --- |
| `desenho:1009` (cartão NÃO LOCALIZADO) | Localizar este **L**ançador | **Localizar este lançador** | a mesma maiúscula decorativa de `desenho:1023` |
| `desenho:1009` (cartão LOCALIZADO) | Localizar este Lançador | **Apontar outro caminho** | **o selo diz `LOCALIZADO` e o botão manda localizar.** Lidos de cima para baixo, os dois se contradizem — o oposto do que o desenho de 08/09 construiu. O ato é corretivo (*"o que ele achou não é o que eu quero"*), e o rótulo passa a dizê-lo. **Mesmo gesto, mesma gravação: só o rótulo segue o estado**, como já fazem «Não usar neste jogo» / «Voltar a usar» |
| `desenho:1559`, `:1806` | Abrir o lançador | **mantido** | é o ato certo; o problema está na recusa (M9), não no rótulo |
| `desenho:1560` | Criar perfil para um jogo | **mantido** | — |
| `desenho:1611`, `:1612`, `:962`, `:1084` | Consertar · Ver o que impede · Copiar a linha · Tirar daqui | **mantidos** | quatro verbos, quatro atos |
| `desenho:1146-1148` | Desligar o Steam Input · Este jogo não funciona · Deixar tudo pronto | **mantidos** | os três vêm do motor, e «Steam Input» está no glossário |
| `a07:909`, `:910` | Posso fechar a Steam por uns 20 segundos? · Fechar e continuar | **mantidos** | uma pergunta e a resposta. É o melhor par da aba |
| `desenho:1458`, `:1465`, `:1471`, `a07:899` | Não usar neste jogo · Voltar a usar · Voltar a perguntar · Não perguntar para este jogo | **mantidos** | pares que vão e voltam |
| `desenho:1464` | você tirou este jogo | **você tirou** | a linha já nomeia o jogo ao lado. 20 → 10 |
| `desenho:1470` | você mandou não perguntar mais por este jogo | **você mandou não perguntar mais** | idem. 44 → 30 |
| `a07:311-313` | tinha o atalho e perdeu · nunca recebeu o atalho · linha editada à mão — não vou tocar | **mantidos** | três estados em quatro palavras cada. São o padrão que o resto da aba deveria seguir |

### 3.5 — A tela de «Localizar um lançador»

| onde | hoje | proposta | por quê |
| --- | --- | --- | --- |
| `desenho:1074` | Localizar um lançador | **mantido** | e é o argumento de que a maiúscula dos botões é decorativa: aqui a mesma palavra está em minúscula |
| `desenho:521-529` (o `?`) | *(3 parágrafos, 403 caracteres)* | **Diga o comando, o caminho do programa (é assim que entra um AppImage solto) ou o nome do atalho — os três exemplos estão no campo. Confiro no disco antes de guardar.** | o parágrafo 2 **é a dica do campo escrita em prosa**: o `placeholder` logo abaixo já mostra `ryujinx · /opt/Ryujinx/Ryujinx · org.ryujinx.Ryujinx`. O parágrafo 1 descreve como o produto procura, que é mecânica; o que sobra dele é dito pela recusa de `a07:2771`, que é quando importa. 403 → 165 |
| `desenho:450` | Um lançador ou emulador que você usa | **mantido** | — |
| `desenho:473` | {nome} — onde ele está nesta máquina | **mantido** | sem artigo de propósito, e a razão está no próprio arquivo |
| `desenho:536`, `:540` | Como ele se chama · Onde ele está | **mantidos** | dois rótulos de campo em quatro palavras. São o teto da aba |
| `desenho:1055` | Escolher o arquivo… | **mantido** | — |
| `desenho:531`, `:552`, `:554` | Fechar · Cancelar · Adicionar | **mantidos** | — |

### 3.6 — Os recados e as recusas

**As doze primeiras são as que mais custam**, e a razão é a mesma nas doze:
elas contam como o produto funciona por dentro, para quem só queria saber o que
fazer agora.

| onde | hoje | proposta | por quê |
| --- | --- | --- | --- |
| `a07:2080` | Ainda não sei abrir o {nome}. O Hefesto só sabe abrir a Steam por enquanto — abra este lançador como você já abre, que o perfil casa pelo nome do processo e pela janela do mesmo jeito. | **Abra o {nome} como você já abre — o perfil entra do mesmo jeito, pelo nome do processo e pela janela.** | **A TELA CONFESSA DÍVIDA NOSSA, DUAS VEZES NUMA FRASE** — *"Ainda não sei"* e *"só sabe … por enquanto"*. É a forma exata que ela proibiu em 07/09 (*"O app tem que funcionar e não mostrar na tela que o app não presta."*). O conselho já estava na frase; o que sai é a desculpa em volta. 197 → 114 |
| `a07:2086` | Não achei como abrir a Steam nesta máquina: nem o comando `steam` nem o `xdg-open` estão no PATH. Abra-a pelo seu menu — nada aqui foi alterado. | **Não achei como abrir a Steam nesta máquina. Abra-a pelo seu menu — nada foi alterado.** | `xdg-open` e `PATH` não dizem nada a quem lê, e o que fazer não muda com eles. 144 → 85 |
| `a07:1862` | tirar-daqui: o clique não disse qual jogo. Cada linha da lista manda `data-v` com o appid — se ele sumiu do desenho, o botão agiria sobre um jogo escolhido por acaso. | **O clique não disse de qual jogo se trata. Nada foi alterado.** | o nome do gesto, o `data-v` e o `appid` são a nossa marcação. **Esta frase chega a ELA** — medido e escrito em `hefesto_vivo.py:1504` (*"SEIS gestos recusavam dizendo … e recusavam para ELA também, não só para a régua"*). O diagnóstico deve ir para o log; ver §7. 166 → 60 |
| `a07:2074` | abrir-lancador: o clique não disse qual lançador. Cada botão manda `data-v` com a chave do cartão — sem ela o gesto abriria um lançador escolhido por acaso. | **O clique não disse de qual lançador se trata. Nada foi alterado.** | idem. 156 → 64 |
| `a07:2998` | esquecer-lancador: o clique não disse qual. Cada botão manda `data-v` com a chave do cartão — sem ela eu apagaria a declaração de um lançador escolhido por acaso. | **O clique não disse de qual lançador se trata. Nada foi tirado.** | idem. 162 → 62 |
| `a07:1919` | Não consegui tirar este jogo da lista de dispensados. O arquivo `launch_dialog_dismissed.json` não aceitou a escrita — o lembrete continua desligado para ele. | **Não consegui voltar a perguntar por este jogo — o lembrete continua desligado.** | o nome do arquivo no disco é nosso; o que ela precisa saber é o estado em que ficou. 158 → 78 |
| `a07:1956` | Não consegui guardar este jogo na lista de dispensados. O arquivo `launch_dialog_dismissed.json` não aceitou a escrita — o aviso vai voltar no próximo jogo aberto sem o atalho. | **Não consegui desligar o lembrete para este jogo — ele vai voltar no próximo jogo aberto sem o atalho.** | idem, e a consequência fica inteira. 176 → 101 |
| `a07:2742` | Diga onde ele está: o comando (`ryujinx`), o caminho do programa (`/opt/Ryujinx/Ryujinx`) ou o nome do atalho (`org.ryujinx.Ryujinx`). É o que eu preciso para achá-lo. Ou clique em «{Escolher o arquivo…}» e aponte o atalho com o mouse. | **Diga onde ele está — os exemplos estão no campo. Ou clique em «{Escolher o arquivo…}» e aponte com o mouse.** | **os três exemplos estão no `placeholder` do campo vazio que ela acabou de deixar em branco.** A recusa os repete pela terceira vez na mesma tela (com o `?`). 233 → 105 |
| `a07:2749` | São N caracteres, e o teto é M. O que eu preciso é do comando ou do nome do atalho, não da linha de inicialização inteira. | **São N caracteres, e o teto é M. Diga só o comando ou o nome do atalho.** | «linha de inicialização» de novo — a palavra que a aba usa para OUTRA coisa (o atalho do Hefesto). 126 → 74 |
| `a07:2807` | Diga como ele se chama. O nome é o que aparece no topo do cartão, e é dele que sai o endereço interno do cartão. | **Diga como ele se chama — é o nome que aparece no topo do cartão.** | *"o endereço interno do cartão"* é a nossa chave; ela não a escolhe nem a vê. 112 → 64 |
| `a07:2856` | O nome que você digitou, «{x}», não entrou: este cartão já se chama {nome}, e o que o botão dele acrescenta é **ONDE** procurar. | **O nome «{x}» não entrou: este cartão já se chama {nome}, e o botão dele só acrescenta onde procurar.** | caixa-alta para dar ênfase é a mesma maiúscula decorativa do item 4 da §2 do índice, num lugar onde ela grita. 129 → 105 |
| `a07:2911` | Este arquivo está fora das pastas em que eu procuro, e por isso eu nunca o reencontraria: {p}. Eu procuro atalhos `.desktop` em {pastas} — e programas pelo comando, no `PATH`. Nada foi guardado. | **Este arquivo está fora das pastas em que eu procuro, e eu não o reencontraria: {p}. Escolha um atalho de {pastas}. Nada foi guardado.** | a segunda frase descreve a busca; o que serve é o caminho a seguir, e ele já está na variável. 224 → 163 |
| `a07:2663` | {nome} já tem cartão nesta aba, e é por ele que se aponta onde este lançador está. Use o «{rótulo}» do cartão de {nome} — assim o que você me disser entra na busca daquele cartão, em vez de criar um segundo com o mesmo nome. | **{nome} já tem cartão nesta aba. Use o «{rótulo}» do cartão dele — assim o que você disser entra na busca daquele cartão, em vez de criar um segundo.** | o nome aparece três vezes em 245 caracteres. 245 → 166 |
| `a07:2670` | {nome} já tem cartão nesta aba, e ele já está apontado. Para apontar outro, use o «{tirar}» do cartão dele primeiro — o cartão volta a perguntar onde ele está, e a sua resposta entra ali. | **{nome} já tem cartão nesta aba, e ele já está apontado. Use o «{tirar}» do cartão dele primeiro — depois ele volta a perguntar onde está.** | 194 → 144 |
| `a07:2685` | {nome} já tem cartão nesta aba, e o que você digitar aqui criaria um segundo cartão com o mesmo nome. Quem responde por {nome} nesta máquina é o cartão dele, nesta mesma aba. | **{nome} já tem cartão nesta aba — o que você digitar aqui criaria um segundo com o mesmo nome.** | a segunda frase é a primeira ao contrário. 180 → 96 |
| `a07:2771` | Não achei {alvo} nesta máquina. Procurei o comando no `PATH` e o atalho `{x}.desktop` nas pastas de aplicativos. Confira o caminho e tente de novo — nada foi guardado. | **Não achei {alvo} nesta máquina. Procurei o comando no `PATH` e o atalho `{x}.desktop` nas pastas de aplicativos. Confira e tente de novo; nada foi guardado.** | **quase inteira mantida de propósito**: esta passa a ser o ÚNICO dono do fato *"onde eu procurei"*, que sai do `?` e do corpo do cartão. É o momento em que o fato serve. 172 → 161 |
| `a07:1842` | Não achei jogo nenhum aberto agora. Abra o jogo de onde for, volte aqui e clique de novo. | **Nenhum jogo aberto agora. Abra o jogo, volte aqui e clique de novo.** | *"de onde for"* é a mensagem da aba inteira, não desta recusa. 89 → 67 |
| `a07:1016` | Passaram-se mais de N segundos desde a pergunta — não fechei nada. Clique de novo para começar. | **Passou do tempo e não fechei nada. Clique de novo para começar.** | o número de segundos não muda o que ela faz. 96 → 63 |
| `a07:2237` | Não consegui pôr a linha na área de transferência. Ela está à mostra no cartão, logo acima deste botão: selecione e copie com Ctrl+C. Nada foi alterado. | **Não consegui copiar. A linha está logo acima deste botão: selecione e copie com Ctrl+C.** | «área de transferência» é o mecanismo; «copiar» é o ato. 152 → 87 |
| `a07:3004` | Não há nada a tirar deste cartão: ele é de fábrica e você não declarou nada sobre ele. | **Não há nada a tirar: este cartão é de fábrica e você não apontou nada nele.** | «declarou» é a palavra do `maquina.json`; «apontou» é a palavra dos botões desta aba. 86 → 75 |
| `a07:1673` | não consegui repor o atalho de inicialização | **mantido** | — |
| `a07:1847-1853` | {jogo} está aberto agora e **não abre pelo atalho do Hefesto** — clique em Consertar com o jogo e a Steam fechados. | **mantido** | nomeia o jogo, diz o estado e diz o gesto. É o molde da aba |
| `a07:2114` | Copiado! Cole em: Steam → jogo → Propriedades → Opções de inicialização. | **mantido** | palavra dela (`07[01]`) |
| `a07:2831`, `:2839`, `:3013`, `:2888` | Não consegui guardar isso agora. Nada foi alterado. · Guardei: {x} está em {y}. · Tirei {x} daqui. · Escolha o atalho do lançador (.desktop) | **mantidos** | recibos curtos |

---

## §4 — A CONTA

**CONTA A — o inventário**, cada frase contada uma vez (é a conta que um
tradutor paga):

| | |
| --- | --- |
| textos vistoriados | **85** |
| propostos mudar | **34** |
| mantidos | **51** |
| caracteres hoje | **6.450** |
| caracteres com a proposta inteira | **4.225** |
| diferença | **−2.225 (−34,5%)** |

**CONTA B — o que a página publicada RENDERIZA** dentro da moldura `.janela`
(texto visível + `title` + `placeholder`, marcação fora, a legenda do mockup
fora porque o produto a esconde):

| | |
| --- | --- |
| hoje | **3.354** |
| com a proposta | **2.354** |
| diferença | **−1.000 (−29,8%)** |

**Os dois maiores cortes são os dois `?`**: 712 → 299 no do quadro e 403 → 165
no da tela de registro. Juntos, **651 caracteres — 29% de tudo o que sai**. E é
o corte que mais importa para a §0 da onda, porque é exatamente o texto que ela
nomeou: *"toda mensagem de tooltip (…) deveria ser reduzida e ficar intuitiva e*  <!-- noqa-acento: citação literal dela -->
*direta ao ponto."*  <!-- noqa-acento: citação literal dela -->

---

## §5 — O QUE NÃO PROPUS, E POR QUÊ

**1. O selo `CHEGAM` (`desenho:102`) — porque ele não é texto de tela.**
Nenhum caminho do produto o produz. Medido: os únicos `selo=` emitidos são
`nao_sei`, `off`, `localizado` e a variável de `desenho:1712`, que é `warn` ou
`localizado`. **A entrada morreu hoje**, quando o bom estado da Steam virou
`localizado` por ordem dela. É dívida de código, não de língua — e está na §7.

**2. O corpo do cartão bom da Steam** (*"Os controles chegam. O atalho de
inicialização está no lugar em N jogos da sua biblioteca (instalados ou não)."*).
Parece o candidato óbvio — 110 caracteres, o mais longo que sobra. **Não é**:
o parêntese é decisão dela (PO 04/09, `07[04]`), e nasceu de dois números que se
contradiziam a uma linha de distância. E com o `CHEGAM` morto, esta é a única
frase da aba que dá a boa notícia.

**3. `DIZ_ACHEI` (`desenho:899`) — já está vazia**, por ordem dela de hoje.
Nada a propor, e nada a devolver.

**4. A existência do «Abrir o lançador» nos cinco cartões que ele não abre.**
É botão, e a sprint proíbe mexer em botão; e mais: **já é decisão dela**, de
02/09, registrada em `cartao_sem_censo`. Proponho só a frase da recusa (M9). Se
o botão deve sumir, é dela — §6.

**5. O `title` da fita: *"Esta aba não usa o controle escolhido aqui — os cards
são leitura."*** — **«cards» é inglês na tela**, e a aba tem seis. Mas o dono é
`monta.py:906`, **fora da minha posse**, e a frase sai igual nas dez páginas.
Vai para quem coordena: é uma linha só, e cura dez abas.

**6. A linha de baixo dos cinco cartões** (*"12 jogos na biblioteca · 3
instalados"*, *"5 caixas examinadas"*). O dono é
`integrations/censo_dos_lancadores.py` e `integrations/sandbox_dos_lancadores.py`,
**fora da posse**. Registro o achado: *"5 caixas examinadas"* responde uma
pergunta que a tela não fez — nenhuma outra palavra da aba fala em «caixa».

**7. A legenda do mockup (`aba07:557-602`, 5.737 caracteres renderizados).** Ela mora fora da
moldura `.janela` e o produto a esconde (`folha_da_casa`). **Não é texto que a
pessoa lê** — é o registro do que a aba custou, e a casa não apaga registro.

**8. As três frases do Steam Input, os quatro verbos dos botões e os três
motivos de `_porque`.** São o que o resto da aba deveria parecer: um verbo, um
ato, quatro palavras.

---

## §6 — O QUE É DELA, e nenhuma destas linhas é minha

1. **«Abrir o lançador» nos cinco cartões que o produto não abre.** Hoje ele
   existe nos seis e recusa em cinco. A decisão de 02/09 foi manter; a tela
   mudou desde então (o selo, a frase, o «Localizar»). **A pergunta volta
   inteira**: o botão fica, ou some onde não abre?
2. **«Apontar outro caminho»** (B7b) — é palavra nova de tela, e texto de tela
   é dela. A alternativa é manter «Localizar este lançador» nos dois estados e
   aceitar que o selo e o botão se contradigam.
3. **«COM IMPEDIMENTO»** no lugar de «NÃO CHEGAM» — idem.

---

## §7 — PARA QUEM EXECUTAR, depois do olho dela

Quatro consequências que não são texto e vão junto:

1. **`quantos_html` e `QUANTOS` perdem o consumidor** com o corte do `?` do
   quadro. Saem os três juntos — a constante, a função e o `data-campo` — ou o
   piloto pinta num endereço que a página não tem.
2. **`SELOS["ok"]` está morto.** Sai com a mesma leva, junto com a linha
   correspondente de `MOLDURA`. `selo_html` já levanta em selo desconhecido,
   então nada fica sem rede.
3. **Uma régua DIGITA os dois rótulos:**
   `tests/unit/test_a_aba_lancadores_diz_a_verdade.py:845-850` compara contra as
   strings literais *"Localizar este Lançador"* e *"Adicionar novo Lançador"*.
   **Ela tem de passar a LER** `desenho.ADICIONAR_ROTULO` e
   `desenho.ADICIONAR_NOVO_ROTULO` antes da troca — senão a régua reprova a
   melhora, que é a forma de defeito que esta casa nomeou onze vezes em 26/08.
   As recusas de `a07` já interpolam as constantes e acompanham sozinhas.
4. **O diagnóstico das três recusas de `data-v` ausente não pode sumir** — ele
   deve ir para o log no mesmo commit em que sai da tela. O que a pessoa lê e o
   que quem conserta lê são dois textos, e hoje são um só.

E a régua que não viu nada disto, para quem quiser fechá-la: o
`scripts/check_a_tela_nao_confessa.py` dá **verde com a M9 viva**, porque ele lê
as páginas de `interface/paginas/` e os `Fala(texto=…)` de `src/` — e **não lê
um `raise RuntimeError(...)` de gesto**, que é por onde a maior parte do texto
desta aba chega ao cartão dela. É um instrumento medindo outra coisa; está fora
da minha posse e fica relatado.
