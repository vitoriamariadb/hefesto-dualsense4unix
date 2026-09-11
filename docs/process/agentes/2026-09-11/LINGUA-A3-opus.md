# LINGUA-A3 — a língua da aba Jogar e da aba Controles

**11/09/2026.** Duas entregas de naturezas diferentes, e elas não se misturam:

| | o quê | estado |
| --- | --- | --- |
| **1** | **A troca dos nomes das três rotas do som** — decisão dela, já tomada | **EXECUTADA, publicada e fotografada** |
| **2** | **A proposta de texto** das abas 01-jogar e 02-controles | **PROPOSTA — nenhuma linha entrou no gerador** |

**A CONTA, em uma linha:** **214 textos** que a pessoa lê foram vistoriados nas
duas abas; **67 têm proposta**; a tela passaria de **14.400 para 9.941
caracteres — menos 31%**, sem perder um fato.

---

# PARTE 1 — A TROCA QUE EXECUTEI

## A decisão dela, e a pergunta que a abriu

> *"Tem diferença real entre todo o som do PC e Ouvir Juntos?"*  <!-- noqa-acento: citação literal dela -->

**Tem, e é uma só: a televisão.** Medido em `a02_controles.py:1555-1570`, que é
o dono da fileira:

| botão | o que ele faz | camada |
| --- | --- | --- |
| Sons do jogo | só o que o jogo mandar para ESTE controle | firmware |
| Ouvir junto | o som do PC cai **também** no controle, **e continua saindo na TV** | sistema |
| Todo o som do PC | o som do PC sai **só** no controle — **a TV cala** | sistema + firmware |

**E ela leu um pelo outro**, descrevendo o «Todo o som do PC» assim:

> *"Todo o som do pc era pra ser o sfx + todo o som que sai no outofalante do*  <!-- noqa-acento: citação literal dela -->
> *hmdmi"*  <!-- noqa-acento: citação literal dela -->

O que ela descreveu é o **«Ouvir junto»**. E isso não é descuido dela: **nenhum
dos dois nomes dizia DE ONDE O SOM SAI.** «Ouvir junto» e «Todo o som do PC»
falam de *quanto* som e de *com quem* — nunca do lugar, que é a única coisa que
os separa. A troca, palavra dela (*"aceito sugestão"*):  <!-- noqa-acento: citação literal dela -->

| hoje | passa a ser |
| --- | --- |
| Sons do jogo | **Sons do jogo** (fica — é a única que já dizia o que faz) |
| Ouvir junto | **No controle e na TV** |
| Todo o som do PC | **Só no controle** |

## Onde a troca pousou — os nove lugares

| arquivo:linha | o que era | o que é |
| --- | --- | --- |
| `interface/aba02.py:2470` | botão `data-rota="junto"` → `Ouvir junto` | `No controle e na TV` |
| `interface/aba02.py:2471` | botão `data-rota="pc"` → `Todo o som do PC` | `Só no controle` |
| `interface/aba02.py:2443-2445` | a dica `?` do Alto-falante, que nomeia as três | reescrita, **195 → 160** caracteres |
| `interface/aba02.py:1888` | `DICA_OUVIR_JUNTO`, o `title` do botão do meio | **219 → 135** caracteres (ver abaixo) |
| `interface/aba02.py:3236` | `TERMOS_DA_TELA`, a régua da legenda | os dois nomes novos entraram, o velho saiu |
| `interface/aba02.py:3112` | — | a legenda ganhou o `<li>` de 11/09 com a razão |
| `interface/pacotes/a02_controles.py` | 13 trechos de prosa que nomeavam os botões | os nomes novos |
| `app/audio_saida.py:1126` | **o recado de estado**: *"Clique em 'Todo o som do PC' para mandá-lo para cá."* | `'Só no controle'` |
| `interface/aba02.py:532 · 2074 · 2077 · 2475` | prosa de código que citava o rótulo | os nomes novos |

**O `MOTIVO_ROTA_SO_NO_BYTE` é o achado do caminho, e ele mora FORA da minha
posse.** É a frase que o cartão publica quando as duas camadas discordam — o
estado que ela viu em 03/09, botão aceso com o som na TV — e ela **manda clicar
num botão pelo nome**. Sem esta linha, a tela mandaria clicar num botão que a
tela não tem mais. É a única edição que fiz em `app/`, e ela é de UMA string.

**A dica do botão do meio encolheu porque o rótulo passou a fazer o trabalho
dela.** Ela existia para dizer *"a televisão continua tocando"*, que agora está
escrito no próprio botão; o que sobra é o que o rótulo não cabe — para que
serve:

> **hoje:** *"O som do computador passa a sair TAMBÉM no alto-falante deste
> controle, sem sair da televisão. É o que serve a quem joga acompanhado: cada
> controle ouve o jogo no próprio plástico, e a sala continua ouvindo o de
> sempre."* (219)
>
> **agora:** *"O som do PC sai no alto-falante deste controle e continua saindo
> na TV. Serve para jogar acompanhado: cada um ouve no próprio controle."* (135)

## A prova

**A FOTO, na vista dela (1918x840):**

| | |
| --- | --- |
| **antes** | `docs/usage/assets/maximizada/aba-02-controles.png` no commit `14d77911` |
| **depois** | `docs/usage/assets/maximizada/aba-02-controles.png` neste commit |

**Medido pixel a pixel, decodificando os dois PNG:** mudaram **1.014 pixels
de 1.611.120**, todos dentro da caixa `x 1248..1472 · y 541..549` — que são,
exatamente, as duas palavras dos dois botões renomeados. A linha continua com
três botões da mesma largura, nada estourou a caixa e nada passou a rolar.
E a mesma medida vale para as outras nove abas:
`--todas --publicado --doc` e `--todas --publicado --doc --vista dela`
regravaram as **dez** abas e **só a 02 mudou de sha256** nas duas famílias
(`docs/usage/assets/PROVA-DA-FOTO.txt`). É a prova de que a troca não vazou
para aba nenhuma.

**A MORDIDA** — e ela é uma régua nova, no `_conferir` do gerador
(`aba02.py:2b'`), porque uma decisão de PALAVRA não tinha quem a segurasse:

```
$ sed -i 's|>Só no controle</button>|>Todo o som do PC</button>|' aba02.py
$ python src/hefesto_dualsense4unix/interface/aba02.py
ERRO em 02-controles — decisão dela desfeita:
  - o botão `pc` da rota do som diz ['Todo o som do PC'] e a palavra dela de
    11/09 é 'Só no controle' — os três nomes dizem DE ONDE O SOM SAI, que é o
    que os separa
rc=1
```

Devolvida a cura, `rc=0`. A régua lê a TELA (`data-rota="…">rótulo<`) e digita
só a decisão dela, que é a única metade que não se pode ler de lugar nenhum.

**A SUÍTE do som:** 162 testes verdes em 7 arquivos
(`test_a02_os_botoes_do_som_fazem_o_que_dizem`,
`test_a02_a_fonte_do_som_ganha_gesto`, `test_a_rota_do_som_le_as_duas_camadas`,
`test_aba02_os_acesos_sao_leitura_e_nao_desenho`,
`test_a02_som_e_sensor_falam_quando_recusam`,
`test_a_aba_02_controles_fecha_as_linhas`,
`test_a02_o_som_de_cada_controle_vai_para_o_perfil`). **Nenhuma régua desta casa
digitava o rótulo** — as catorze menções em `tests/` são prosa de docstring, e
as asserções comparam contra `MARCA_DO_JUNTO` (`data-hef-quando="junto"`),
`ROTA_OUVIR_JUNTO` (`"junto"`) e `MOTIVO_ROTA_SO_NO_BYTE`. Os nomes de dado não
mudaram, e por isso nenhum gesto, perfil ou byte mudou de valor.

## O que a troca NÃO mexeu, de propósito

* **`ROTA_OUVIR_JUNTO = "junto"`, `data-rota`, `data-hef-quando`** — são o
  ENDEREÇO, não o rótulo. Trocá-los quebraria perfil gravado por gesto nenhum.
* **`docs/data/paridade-gtk-html.csv:86` e `scripts/check_paridade_gtk_html.py:277`**
  — a linha se chama `Alto-falante — "Todo o som do PC"`. É o NOME de uma
  medição de 04/09, não texto de tela; e o par CSV↔portão é casado pela regra
  `ponte-morta`, que reprova se só um dos dois mudar. **Fica, e fica declarado
  aqui** — quem quiser renomear renomeia os dois na mesma linha.
* **As cinco citações literais dela** no `mockup/02-controles.html`
  (*"os botões Virtual e Nativo ficam na parte de baixo do slider, igual o Sons
  do Jogo e Todo o som do PC"*) — a digitação dela não se limpa.  <!-- noqa-acento: citação literal dela -->

## O PREÇO ESCONDIDO DA TROCA: duas âncoras de linha caíram

Trocar duas palavras num gerador de 4.100 linhas **empurra o arquivo**, e dois
portões desta casa medem endereço de linha. Os dois reprovaram, e nenhum dos
dois tinha nada a ver com som:

| portão | o que caiu | como ficou |
| --- | --- | --- |
| `citacoes-no-codigo` | `a02_controles.py:48` citava `aba02.py:1939`, que virou **linha em branco** | o endereço perdeu o número: agora aponta para o **símbolo** (`o parâmetro `estado_alto` na assinatura de `aba02.bloco``) |
| `citacoes-de-linha` | `docs/data/mapa-controles.csv:23` citava `a02_controles.py:4061` para `mic_modo`, que andou 6 linhas | reapontado por símbolo (`grep -n "def mic_modo"` → 4067) |

**A lição, e ela não é nova nesta casa:** *reapontar citação é a última coisa, e
se faz por símbolo, nunca por aritmética.* A primeira delas **já estava podre
antes de eu chegar** — apontava para dentro de um docstring desde alguma edição
anterior — e só apareceu porque a minha empurrou o número para uma linha VAZIA,
que é a única forma que aquela régua tem de ver. **Uma âncora de linha num
arquivo que cresce é uma dívida com data marcada**; a que eu deixei não tem
número, e por isso não volta.

---

# PARTE 2 — A PROPOSTA DE TEXTO

## Como foi medido

Não li o gerador procurando frase: **abri as duas páginas publicadas num Chrome
headless com a folha do produto posta por cima** (a mesma que esconde a `.nota`)
e recolhi, por elemento, **todo texto que a pessoa lê** — rótulo, botão, selo,
número, `title`, `aria-label`, `placeholder` — mais as frases VIVAS que os dois
pacotes escrevem e que a foto não alcança (estado, recusa, ressalva). O
instrumento está em `/tmp/.../inv3.py`; o critério de "lê" é
`frases_que_ela_baniu.texto_visivel_no_produto` + `checkVisibility()`.

**Os glifos deste documento estão sanitizados**, como manda o
`test_saida_de_agente_sanitizada`: onde se lê `[mic]` e `[nota]`, a tela mostra
o microfone e a nota musical de verdade, e onde se lê *"os quatro glifos do
PlayStation"* a tela mostra os quatro símbolos. O texto proposto entra no
gerador com os glifos, não com as etiquetas.

**O que ficou de fora, e por quê:** a `.nota` — a legenda do mockup. São
**14.930 caracteres na 01 e 20.974 na 02**, e o produto não renderiza um deles
(`folha_da_casa` a esconde). Contá-los faria a proposta parecer três vezes
maior do que é.

## A FOTO DO ANTES, na vista dela (1918x840)

| aba | foto |
| --- | --- |
| 01 Jogar | `docs/usage/assets/maximizada/aba-01-jogar.png` |
| 02 Controles | `docs/usage/assets/maximizada/aba-02-controles.png` (commit `14d77911`, antes da Parte 1) |

## A CONTA

| | textos lidos | com proposta | hoje | com a proposta |
| --- | ---: | ---: | ---: | ---: |
| **01 Jogar** | 82 | 25 | 4.777 | **3.669** (−1.108, −23%) |
| **02 Controles** | 132 | 42 | 9.623 | **6.272** (−3.351, −35%) |
| **AS DUAS** | **214** | **67** | **14.400** | **9.941 (−4.459, −31%)** |

O "hoje" da 02 já é **depois** da Parte 1 (a troca das rotas sozinha tirou 148
caracteres da página). E o corte não é parelho: **as dez maiores propostas
somam 2.744 dos 4.459 caracteres** — a aba Controles carrega parágrafos de
laudo dentro de `title`.

---

## AS TRÊS MAIS IMPORTANTES

### 1. Um laudo de bancada dentro de um tooltip — `aba02.py:1419`

O `title` do interruptor do Giroscópio **muda com o transporte**, e as duas
redações somam 430 caracteres de medição:

> **cabo:** *"Ligado: o jogo recebe o giro deste controle. No cabo são 250,0 Hz
> exatos, e três fontes independentes concordam: o relógio do host, o relógio do
> controle e o descritor USB (bInterval = 6)."*
>
> **rádio:** *"Ligado: o jogo recebe o giro deste controle. No rádio não há taxa
> típica. Medido em cinco janelas de 8 a 10 s no mesmo controle: a média foi de
> 38 a 392 Hz entre janelas consecutivas, sem que nada mudasse. Os 1000 Hz que o
> SDL declara para Bluetooth não aparecem em janela nenhuma."*

**Proposta, nas duas: *"Ligado: o jogo recebe o giro deste controle."*** — 430 →
88 caracteres.

**Por quê:** nenhuma das cinco perguntas passa. Não diz o que acontece ao
clicar (diz o que MEDIMOS); não cabe numa respiração; `bInterval`, `descritor
USB` e `SDL` não sobrevivem a tradutor nenhum; e a segunda metade **confessa
dívida nossa** — *"não há taxa típica"*, *"os 1000 Hz não aparecem"* — que é
exatamente o que a decisão dela de 07/09 tirou da tela. **A medição não se
perde: ela é do `docs/data/mapa-controles.csv`, que é o dono dela.**

### 2. Um caminho de arquivo do nosso código, na tela — `a02_controles.py:945`

O `title` da linha «Barra de luz» diz, hoje, para ela:

> *"Este é o código da cor do JOGADOR, não a do plástico — quem escolhe é o
> produto, pela mesma tabela que acende as cinco lâmpadas
> (**core/led_control.py::player_slot_color**). Ele não é digitado aqui: sai da
> tabela, e muda no dia em que ela mudar."*

**Proposta: *"Este é o código da cor do jogador, não a cor do controle. Quem a
escolhe é o Hefesto, pela mesma tabela que acende as cinco lâmpadas."*** — 238 →
131.

**Por quê:** é o nome de um símbolo Python no ponteiro do mouse dela. A frase
foi escrita para um desenvolvedor e ficou na tela do produto. Some com ela o
*"plástico"* — **a metáfora de bancada desta casa**, que aparece em sete
`title` das duas abas e é a maior dívida de tradução que encontrei: *"a cor do
plástico"*, *"a luz vermelha do plástico"*, *"o mudo do plástico"*. Em toda
proposta ela vira **controle**.

### 3. A dica que explica o nosso layout, não o produto — `aba02.py:3063`

O `?` de «Dispositivos Conectados» tem **717 caracteres** e o último terço fala
de decisões de desenho:

> *"(…) A borda tem a cor do plástico, aberto ou fechado — é como você sabe qual
> é qual com vários ligados; o fundo lilás diz qual está escolhido. O giroscópio
> e o acelerômetro são de cada controle, **e por isso o interruptor de cada um
> está na linha dele**. O botão acima é o único que vale para todos de uma vez:
> ele calibra os 4 numa passada."*

**Proposta: *"Os controles conectados agora. Clique num deles para abri-lo — os
outros fecham; escolhê-lo na fita lá em cima faz o mesmo. A borda tem a cor do
controle, e o fundo lilás diz qual está escolhido. Todos abre os quatro de uma
vez."*** — 717 → 226.

**Por quê:** *"e por isso o interruptor de cada um está na linha dele"* é a
justificativa de quem desenhou, não informação de quem usa. E o resto repete o
que a tela já mostra: que o cartão aberto tem leitura viva, ela vê; que os
fechados são uma linha, ela vê.

---

## A TABELA — aba 01 JOGAR

`title` = dica do ponteiro do mouse · `?` = a bolinha de ajuda · **estado** =
frase que o produto escreve ao vivo.

| onde | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `aba01.py:1655` rótulo | O **C**ontrole é visto como: | O **c**ontrole é visto como: | maiúscula decorativa no meio da frase — a regra dela de 11/09 (*"ambos minusculo sem iniciar de forma capitular"*), que ela mandou não repetir <!-- noqa-acento: citação literal dela --> |
| `aba01.py:1751` botão | Reconectar **C**ontroles | Reconectar **c**ontroles | idem |
| `aba01.py:1505-1508` `?` | Ligado — o Hefesto fica no meio: luz, vibração, gatilho e o número do jogador são por conta dele. Desligado — o Hefesto sai do meio e o jogo fala direto com o controle. Aqui ele não cria um controle para cada pessoa — quem conta os jogadores é o jogo, pelos controles que ele enxerga. Isto não encerra o serviço. Para isso, a aba Sistema. | Ligado — o Hefesto cuida da luz, da vibração, do gatilho e do número do jogador. Desligado — o jogo fala direto com o controle, e quem conta os jogadores passa a ser o jogo. Isto não para o serviço: para isso, a aba Sistema. | repete palavra por palavra os dois `title` do próprio interruptor (`:175` e `:208`) — a pessoa lê a mesma frase duas vezes a dois centímetros de distância |
| `aba01.py:1524-1526` `?` | Vale quando o jogo abrir. O que muda **entre os quatro** é como o jogo desenha os botões — luz, vibração, gatilho, giroscópio e áudio são por conta do Hefesto em todos. Ele tenta na ordem em que estão aqui e para quando acerta; depois não pergunta mais para aquele jogo. Segurando PS + R3 você pula para o próximo sem largar o controle. | Vale no próximo jogo que abrir. O que muda é como o jogo desenha os botões — luz, vibração, gatilho, giroscópio e som são do Hefesto em todos. O Hefesto tenta na ordem desta lista e para no primeiro que der certo. PS + R3 pula para o próximo. | *"entre os quatro"* é uma contagem cravada que envelhece sozinha no dia em que a fileira mudar; *"depois não pergunta mais para aquele jogo"* é mecânica interna |
| `aba01.py:1660-1664` `?` | A máscara é por controle: cada um pode aparecer de um jeito para o jogo, e o que muda é o desenho dos botões na tela. DualSense — os quatro glifos do PlayStation. Xbox 360 — Y B A X. Nintendo Pro — X A B Y, com ZL/ZR e − +. O controle na sua mão continua o mesmo: luz, gatilho, giroscópio e áudio seguem por conta do Hefesto em qualquer máscara. Clicar num cartão leva a fita de cima para ele. O detalhe de cada um está na aba Controles. | A máscara é por controle e muda só o desenho dos botões no jogo. DualSense — os quatro glifos do PlayStation. Xbox 360 — Y B A X. Nintendo Pro — X A B Y, com ZL/ZR e − +. O controle na sua mão continua o mesmo. Clicar num cartão escolhe esse controle lá em cima. | a lista *"luz, gatilho, giroscópio e áudio seguem por conta do Hefesto"* é a TERCEIRA vez que a mesma frase aparece nesta aba |
| `aba01.py:175` title | O Hefesto fica no meio: ele acende as luzes, faz o controle vibrar, dá um jogador para cada controle e escolhe como o jogo vê o aparelho. | O Hefesto acende a luz, faz o controle vibrar, numera os jogadores e escolhe como o jogo vê o controle. | *"fica no meio"* é metáfora nossa; *"aparelho"* e *"controle"* na mesma frase para a mesma coisa |
| `aba01.py:208` title | Modo Nativo: o Hefesto sai do meio e o jogo fala direto com o controle. Aqui ele não cria um controle para cada pessoa — quem conta os jogadores é o jogo, pelos controles que ele enxerga. | Modo Nativo: o jogo fala direto com o controle, e quem conta os jogadores passa a ser o jogo. | **a segunda metade é `NATIVO_E_OS_JOGADORES`, que tem IRMÃ VIVA** em `app/actions/jogar/painel.FRASE_DO_MODO_NATIVO`, trancadas por `test_o_coop_vive_na_conexao_nativa.py` — quem mudar uma muda a outra |
| `aba01.py:300` title | O jogo desenha os botões do PlayStation. **É o primeiro que o Hefesto tenta.** | O jogo desenha os botões do PlayStation. | a ordem já está no `?` do quadro (*"tenta na ordem desta lista"*) e na posição do botão — dizê-la em cada um dos três é o mesmo fato em quatro lugares |
| `aba01.py:304` title | O jogo desenha os botões do Xbox — o formato que todo jogo entende. **É o segundo que o Hefesto tenta.** | O jogo desenha os botões do Xbox — o formato que todo jogo entende. | idem |
| `aba01.py:308` title | A Steam entrega a entrada, e **os seus** ajustes vencem os do jogo. Trocar para cá exige reabrir a Steam e o jogo — por isso é o último que o Hefesto tenta. | A Steam entrega a entrada, e os ajustes que você fez nela vencem os do jogo. Mudar para cá exige reabrir a Steam e o jogo. | *"os seus ajustes"* é ambíguo em português e intraduzível sem escolher: os dela ou os da Steam? |
| `aba01.py:313` title | O controle vira teclado e mouse do computador. **O PS+R3 ainda não para aqui.** | O controle vira teclado e mouse do computador. | **a tela confessa dívida nossa** — decisão dela de 07/09, com portão (`check_a_tela_nao_confessa.py`); o *"ainda não"* pertence ao mapa |
| `aba01.py:1589` title | O Hefesto sai do meio e o jogo fala direto com o controle. Vale no próximo jogo que abrir. | O jogo fala direto com o controle. Vale no próximo jogo que abrir. | *"sai do meio"* de novo; o resto da frase já diz |
| `aba01.py:1589` texto | Modo Nativo · **o DualSense da forma como veio ao mundo** | Modo Nativo · o controle sem o Hefesto no meio | **é redação DELA** (*"Modo Nativo (Dualsense da Forma como veio ao Mundo)"*, 31/08) — e é a frase mais bonita das duas abas e a mais intraduzível delas. **Só muda com a palavra dela** <!-- noqa-acento: citação literal dela --> |
| `a01_jogar.py:407` title | **Congela a troca automática:** o perfil que você deixou ativo continua valendo mesmo ao abrir qualquer jogo. Desmarque para o Hefesto voltar a escolher o perfil por você. | O perfil ativo continua valendo mesmo quando você abre outro jogo. Desmarque para o Hefesto voltar a escolher sozinho. | o rótulo ao lado já diz «Trava o perfil ativo» — *"congela a troca automática"* é a terceira palavra para a mesma coisa na mesma linha |
| `aba01.py:1578` title | Esta seção só aparece com o Hefesto LIGADO. | *(sai)* | ela só é lida quando a seção ESTÁ aparecendo — o `title` afirma o que a pessoa acabou de ver acontecer |
| `aba01.py:1586` title | Esta seção só aparece com o Hefesto DESLIGADO. | *(sai)* | idem |
| `a01_jogar.py:325` **estado** | Nenhum controle ligado agora. Conecte um pelo cabo ou pelo rádio — ele aparece sozinho, **sem recarregar esta tela**. | Nenhum controle ligado. Conecte um pelo cabo ou pelo rádio: ele aparece aqui sozinho. | *"sem recarregar esta tela"* é promessa de implementação — ela não tem botão de recarregar |
| `a01_jogar.py:357` **estado** | Guardada por controle: o Hefesto não está entregando o controle ao jogo agora, e a escolha vale assim que ele voltar a entregar. | Guardada neste controle. Ela passa a valer quando o Hefesto voltar a entregá-lo ao jogo. | *"entregando o controle ao jogo"* repetido duas vezes na mesma frase |
| `a01_jogar.py:388` title | O lugar está reservado e o jogo ainda não recebeu este controle. O número fica forte quando ele entrar na partida. | O jogo ainda não recebeu este controle. O número acende quando ele entrar na partida. | *"fica forte"* descreve o CSS; *"acende"* descreve o que ela vê |
| `a01_jogar.py:478` title | É este controle que o Hefesto ouve para navegar o computador, e é dele que ele lê os botões. **Quem é o primário quem decide é o serviço.** | É por este controle que o Hefesto navega o computador. Quem o escolhe é o serviço. | a última oração tem a ordem invertida (*"quem é X quem decide é Y"*) — é fala, não escrita, e não sobrevive a tradutor; *"primário"* é jargão |
| `a01_jogar.py:294` **estado** | Esta tela parou de ler o serviço: o modo, os controles e a carga **não estão sendo afirmados**. Ela volta sozinha quando o serviço responder. | Esta tela parou de ler o serviço. Ela volta sozinha quando ele responder. | *"não estão sendo afirmados"* é vocabulário desta casa, não do produto |
| `a01_jogar.py:427` **estado** | O Hefesto está desligado — **o cadeado** não foi aplicado. | O Hefesto está desligado: **a trava** não foi aplicada. | **a tela chama a mesma caixa de dois nomes**: o rótulo diz «Trava o perfil ativo» e o recado diz «cadeado» |
| `a01_jogar.py:2333` **estado** | A máscara vale agora, mas não ficou guardada: escolha um perfil na aba Perfis e ela passa a ser lembrada nele. | A máscara vale agora, mas não ficou guardada. Escolha um perfil na aba Perfis para ela ser lembrada. | duas orações com dois pontos no meio; a segunda vira ordem direta |
| `a01_jogar.py:2337` **estado** | A máscara vale agora, mas o perfil recusou guardá-la só para este controle: **ele não se identifica de um jeito que o perfil saiba mirar.** | A máscara vale agora, mas o perfil não consegue guardá-la só para este controle. | a explicação é do nosso mecanismo de casamento e não muda nada que ela possa fazer |
| `a01_jogar.py:2409` **estado** | Não há controle no lugar N. **A máscara é de um aparelho:** ligue um controle aqui e ele recebe a escolha. | Não há controle no lugar N. Ligue um controle aqui para ele receber a máscara. | idem — a razão antes da ação |

## A TABELA — aba 02 CONTROLES

**É a aba com mais palavras por pixel do produto**, e a medição confirma: 132
textos legíveis contra 82 da Jogar, em metade da altura.

| onde | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `aba02.py:3061` rótulo | Dispositivos **C**onectados | Dispositivos **c**onectados | maiúscula decorativa — a regra dela de 11/09. **Tem portão** (`_conferir`, `aba02.py:3739`): muda nos dois na mesma linha |
| `aba02.py:3085` botão | Calibrar **S**ensores de **M**ovimento | Calibrar **s**ensores de **m**ovimento | idem (portão em `aba02.py:4009`) |
| `aba02.py:3087` botão | Mapa do **C**ontrole | Mapa do **c**ontrole | idem (portão em `aba02.py:4004`) |
| `aba02.py:3063` `?` | *(717 caracteres — ver «as três mais importantes», item 3)* | Os controles conectados agora. Clique num deles para abri-lo — os outros fecham; escolhê-lo na fita lá em cima faz o mesmo. A borda tem a cor do controle, e o fundo lilás diz qual está escolhido. Todos abre os quatro de uma vez. | explica o nosso layout, não o produto; e o *"4"* cravado três vezes mente com dois controles na mesa |
| `aba02.py:2507` `?` | Leitura viva do aparelho, dez vezes por segundo. Nada aqui se clica. O giroscópio mede o quanto o controle gira, em graus por segundo. O acelerômetro mede a inclinação e o chacoalhar, em g — **parado numa superfície plana a soma dos três eixos dá 1 g, que é a gravidade, e é por isso que um deles fica perto de 1 e os outros perto de 0.** Um traço no lugar do número quer dizer que a leitura ainda não chegou. | Leitura viva do controle. O giroscópio mede o quanto ele gira, em graus por segundo; o acelerômetro mede a inclinação, em g. Um traço no lugar do número quer dizer que a leitura ainda não chegou. | a aula de física é verdadeira e não muda nada que ela faça; *"dez vezes por segundo"* é a nossa taxa de tique |
| `aba02.py:2376` `?` | A barra mostra o som entrando agora. O [mic] cala **no firmware** e apaga a luz vermelha **do plástico**. O modo, logo abaixo, diz por onde o som do microfone chega ao PC. | A barra mostra o som entrando agora. O [mic] cala o microfone e apaga a luz vermelha do controle. Os dois botões abaixo dizem por onde esse som chega ao PC. | *"firmware"* e *"plástico"*; e *"o modo"* não é o nome de nada na tela — o que está lá são dois botões |
| `aba02.py:1419` title (cabo) | Ligado: o jogo recebe o giro deste controle. No cabo são 250,0 Hz exatos, e três fontes independentes concordam: o relógio do host, o relógio do controle e o descritor USB (bInterval = 6). | Ligado: o jogo recebe o giro deste controle. | **ver «as três mais importantes», item 1** |
| `aba02.py:1419` title (rádio) | Ligado: o jogo recebe o giro deste controle. No rádio não há taxa típica. Medido em cinco janelas de 8 a 10 s no mesmo controle: a média foi de 38 a 392 Hz entre janelas consecutivas, sem que nada mudasse. Os 1000 Hz que o SDL declara para Bluetooth não aparecem em janela nenhuma. | Ligado: o jogo recebe o giro deste controle. | **idem — e esta confessa dívida** |
| `a02_controles.py:945` title | *(238 caracteres, com um caminho de arquivo — ver item 2)* | Este é o código da cor do jogador, não a cor do controle. Quem a escolhe é o Hefesto, pela mesma tabela que acende as cinco lâmpadas. | **`core/led_control.py::player_slot_color` no ponteiro do mouse dela** |
| `aba02.py:1342` title | As cinco lâmpadas do controle, no padrão do jogador (1 no meio para o P1, as das pontas para o P2, e assim por diante). **É DERIVADO do número do jogador, não lido do aparelho — o daemon publica o número, não o que está aceso.** | As cinco lâmpadas do controle, no padrão do jogador: 1 no meio para o P1, as das pontas para o P2, e assim por diante. | a segunda metade explica a nossa arquitetura e beira a confissão de dívida |
| `aba02.py:1309` title | O ponto marca onde o dedo está. Sem toque não há ponto — **o DualSense só publica posição enquanto alguém encosta na superfície.** | O ponto marca onde o dedo está. Sem toque, não há ponto. | a segunda metade é a razão técnica da primeira, e a primeira já basta |
| `aba02.py:1357` title | O que o jogo vê deste controle. A escolha é por controle e mora na aba Jogar — DualSense, Xbox 360 ou Nintendo Pro. **Aqui é leitura.** | O que o jogo vê deste controle. Para trocar, vá à aba Jogar. | a lista das três já está na aba Jogar; *"aqui é leitura"* é vocabulário nosso |
| `aba02.py:1361` title | Clique para abrir o **card** deste controle — os outros fecham. É o mesmo gesto de escolhê-lo na fita lá em cima. | Clique para abrir este controle — os outros fecham. | **«card» é inglês na tela**; e a segunda oração já está no `?` do quadro |
| `aba02.py:3381` title | Clique para abrir o **card** dele — a borda é a cor do **plástico**. | Clique para abrir este controle. A borda tem a cor dele. | idem, com a metáfora de bancada |
| `aba02.py:3384` title | Abre os 4 **cards** de uma vez — **e aí a caixa rola**. | Abre os quatro de uma vez. | idem; *"a caixa rola"* descreve a nossa barra de rolagem |
| `aba02.py:3085` title | Calibra o giroscópio e o acelerômetro dos N controles conectados **numa passada só**, com todos parados numa superfície plana. | Calibra o giroscópio e o acelerômetro dos N controles de uma vez. Deixe todos parados numa superfície plana. | *"numa passada só"* é oficina; a condição vira instrução, que é o que ela precisa fazer |
| `aba02.py:3087` title | Abre o mapa do controle: cada peça do DualSense com o nome, **o glifo** e o que o Hefesto lê dela. | Abre o mapa do controle: cada peça, com o nome e o que o Hefesto lê dela. | *"glifo"* é tipografia |
| `aba02.py:1852` title | Calar **no firmware** do controle — apaga a luz vermelha **do plástico**. A partir daqui quem manda no mudo é o Hefesto, e o botão do controle para de valer. Esta tela não devolve o comando: **quem devolve é `hefesto-dualsense4unix mic release`**, ou reiniciar o Hefesto. | Cala o microfone e apaga a luz vermelha do controle. A partir daqui quem manda no mudo é o Hefesto, e o botão do controle para de valer. Para devolvê-lo ao controle, reinicie o Hefesto. | **um comando de terminal na tela** — e o fato não se perde: a saída que ela pode executar (reiniciar) fica |
| `aba02.py:1894` title | Manda zero ao alto-falante do controle, sem perder o volume guardado. A partir da primeira escrita quem guarda o volume deste alto-falante é o Hefesto — o controle não o devolve. **Quem larga é `hefesto-dualsense4unix speaker release`: ele devolve o controle, não o valor** — o alto-falante fica com o último volume que o Hefesto mandou. | Cala o alto-falante do controle, sem perder o volume guardado. A partir daqui quem guarda esse volume é o Hefesto. | **idem**, e são 325 caracteres para um botão de um caractere ([nota]) |
| `aba02.py:2032` title | Arraste para escolher o volume do alto-falante deste controle. **O DualSense não devolve este número — o primeiro arrasto é o que faz o Hefesto passar a saber qual ele é**, e é ele que destrava o [nota]. | Arraste para escolher o volume do alto-falante deste controle. O primeiro arrasto é o que destrava o [nota]. | a causa é do aparelho e não muda o gesto; o efeito (destrava o [nota]) fica |
| `aba02.py:2027` title | Arraste para escolher quanto do microfone deste controle chega ao PC — de 0 a 100. **É o ganho da FONTE no sistema**, e não o mudo do plástico: não apaga a luz vermelha e não tira o botão do controle. Grava na hora. | Arraste para escolher quanto do microfone deste controle chega ao PC. Não é o mudo: a luz vermelha fica acesa e o botão do controle continua valendo. Grava na hora. | *"o ganho da FONTE no sistema"* é PipeWire falando; *"de 0 a 100"* está escrito ao lado do deslizante |
| `aba02.py:2063` title | **Guarda que** o microfone deste controle passa pelo Hefesto. Pelo rádio é assim que ele ganha um canal só dele; pelo cabo a escolha fica guardada e vale quando ele voltar para o rádio. Quem põe o microfone no ar é o [mic] logo acima. | O microfone deste controle passa pelo Hefesto: pelo rádio, é assim que ele ganha um canal só dele. Quem o põe no ar é o [mic] acima. | *"guarda que"* descreve o arquivo em que gravamos, não o efeito |
| `aba02.py:2067` title | **Guarda que** o microfone deste controle entra sozinho, sem o Hefesto no meio. Vale **nos dois transportes**, e é o que o sistema já faz quando ninguém escolhe nada. | O microfone deste controle entra sozinho, sem o Hefesto no meio. É o que vale quando ninguém escolhe nada. | *"transportes"* é palavra desta casa — a tela dela diz «cabo» e «rádio» |
| `aba02.py:1619` title | Calado **no firmware** do controle — a luz vermelha **do plástico** está apagada. | Microfone calado: a luz vermelha do controle está apagada. | idem |
| `aba02.py:2582` title | Giroscópio: fluindo para o jogo (~250 Hz) | *(sai o `title`, fica o texto)* | **o `title` é uma cópia exata do texto que está ao lado dele** — passar o mouse mostra o que ela acabou de ler |
| `a02_controles.py:1709` **estado** | Apagado porque o volume deste alto-falante ainda é desconhecido: **o DualSense não o publica, e o daemon recusa calar sem ele.** Arraste o volume ao lado uma vez e ele destrava. | O [nota] só funciona depois de o volume ser ajustado uma vez. Arraste o volume ao lado. | a razão é nossa e a ação é dela — a ação vem primeiro |
| `a02_controles.py:3072` **estado** | o ajuste chegou ao controle agora, mas o perfil recusou guardá-lo só para esta **peça**: … | o ajuste chegou ao controle, mas o perfil não consegue guardá-lo só para este controle: … | *"peça"* é a terceira palavra desta casa para controle (com «plástico» e «aparelho») |
| `a02_controles.py:3077` **estado** | a rota deste alto-falante foi escrita no controle, mas o perfil ainda não sabe o volume dele — e o Hefesto não guarda alto-falante sem volume, **porque uma seção sem número manda ZERO ao firmware e tranca o alto-falante.** Arraste o volume deste alto-falante uma vez e a rota passa a ser lembrada junto. | A escolha chegou ao controle, mas o perfil só a lembra junto com o volume. Arraste o volume deste alto-falante uma vez. | 296 caracteres num recado; a metade explica o nosso formato de perfil |
| `a02_controles.py:3772` **estado** | O sistema não publica um microfone para este controle: **no rádio, é o canal do microfone que ainda não está de pé; no cabo, é a placa de som que não apareceu.** Nada foi mudado. | O sistema não vê um microfone neste controle. Nada foi mudado. | o diagnóstico por transporte é nosso e ela não pode agir sobre ele |
| `a02_controles.py:3807` **estado** | o Hefesto ainda não disse se este sensor está ligado ou desligado, e alternar sem saber o estado atual seria chutar qual é o oposto. **O interruptor lê `sensores.giroscopio_ligado` do daemon, publicado ao lado do bloco de entradas deste controle** — sem ele, ou o Hefesto está parado, ou este controle ainda não tem leitor de entradas. | o Hefesto ainda não disse se este sensor está ligado, e o interruptor não sabe para que lado ir. | **o nome de uma chave de IPC na tela** — 330 → 97 |
| `a02_controles.py` ×7 **estado** | **o daemon** não confirmou … — ou o Hefesto está parado, ou este controle se desligou[, ou o Hefesto instalado é mais velho que esta janela e ainda não conhece `sensor.set`] | **o Hefesto** não confirmou …: ou ele parou, ou este controle se desligou | **«daemon» é o nome interno do «Hefesto»** e as duas palavras aparecem na MESMA frase, como se fossem duas coisas. E a terceira alternativa (*"mais velho que esta janela"*) confessa dívida nossa e nomeia um método de IPC |

## O QUE EU NÃO PROPUS, E POR QUÊ

**1. «Status», «Modo» e «O Controle é visto como:» — os três rótulos que ela
trocou em 31/08.** «Status» parece pobre ao lado de «Hefesto», que era o nome
antigo, e é justamente por isso que fica: é palavra dela, tem portão
(`aba01.py:2215`), e o que eu proponho é só a maiúscula do terceiro.

**2. «Trava o perfil ativo».** É palavra dela de 11/09, de hoje. O rótulo está
certo; o que está errado é a dica ao lado, e é essa que proponho.

**3. `NADA_A_DIZER` e os travessões (`—`) dos lugares vazios.** Parecem
descuido — uma tela cheia de traços — e são o contrário: cada travessão é o
produto dizendo *"não tenho este dado"* em vez de inventar um. Trocá-los por
«—» textual ou por «sem dado» faria a tela AFIRMAR mais do que sabe.

**4. Os selos `ATIVO` / `MUDO` em caixa alta.** A regra dela é sobre maiúscula
**capitular no meio de frase** (*"Leia o cabo e acordado"*). Um selo de duas
palavras não é frase: é etiqueta, e em etiqueta a caixa alta é a forma que a
distingue do texto ao redor em todas as dez abas.

**5. «Sons do jogo».** Ela mandou ficar, e está certa: é o único dos três que já
dizia o que faz.

**6. O rodapé — «Aplicar», «Salvar Perfil», «Importar», «Exportar» e as quatro
dicas.** Eles moram em `interface/fim.html`, **o esqueleto**, e valem nas DEZ
abas. Não são minha posse, e propor por uma aba faria a A1, a A2, a A4 e a A5
proporem a mesma coisa quatro vezes. **Fica registrado para quem coordenar: o
«Salvar Perfil» tem a mesma maiúscula decorativa do «Reconectar Controles», e a
dica do «Aplicar» tem 128 caracteres.**

**7. A fita do topo — «Selecionar:», «Todos», «2 controles: 1 USB · 1 BT».**
Mesma razão: `interface/monta.py`, esqueleto, as dez abas. E o «Selecionar:» é
decisão dela, de 31/08, com a razão escrita.

**8. «Modo Nativo · o DualSense da forma como veio ao mundo» — propus, mas com
ressalva.** É a frase dela, palavra por palavra, e é a única da tela que tem
graça. Só sai se ela quiser: **a proposta está na tabela para ela derrubar, não
para eu executar.**

**9. A `.nota` das duas abas — 35.904 caracteres.** É a legenda do mockup, e o
produto não renderiza um caractere dela. Encurtá-la seria trabalho grande com
zero efeito na tela dela.

## O QUE ACHEI E NÃO É DESTA FRENTE

* **`aba02.py:3236`** — `TERMOS_DA_TELA` lista `"Calibrar sensores de
  movimento"` em minúsculas e a tela escreve `Calibrar Sensores de Movimento`.
  A régua não morde hoje (ela só casa termo citado na legenda), mas **as duas
  grafias divergem desde que a segunda nasceu**. Se a proposta da maiúscula for
  aceita, as duas passam a concordar sozinhas.
* **`docs/data/paridade-gtk-html.csv:86`** — a linha `Alto-falante — "Todo o som
  do PC"` passou a nomear um botão que não existe. É nome de medição, não de
  tela; fica declarado aqui para quem for mexer no par CSV↔portão.
* **O `title` nativo do WebKit não abre** (item 1 da §2 do índice, frente C1).
  **Isto pesa sobre esta entrega inteira:** dos 214 textos que medi, **50 são
  `title` (5.723 caracteres) e 6 são a dica do `?` (2.278)** — **8.001 dos
  14.400, ou 56% da língua destas duas abas, vive no ponteiro do mouse**, que é
  o lugar que ela diz não abrir. Cortar a prosa das dicas antes de elas
  abrirem é melhorar o que ninguém vê; **a C1 vem primeiro, e o índice já diz
  isso.**

---

## OS DOIS VERMELHOS QUE ESTA ÁRVORE HERDOU — não são meus, e digo o que são

`bash scripts/portoes.sh` fecha **54 de 56**. Os dois que sobram vieram nos
commits `388ab28d` e `f04f4a0b`, que são a própria onda, e **nenhum dos dois
toca um arquivo desta posse**:

| portão | o que é | de quem é |
| --- | --- | --- |
| `referencias-docs` | 4 referências mortas: as sprints A1, A2, A4 e A5 citam `docs/process/agentes/2026-09-11/LINGUA-A<N>-opus.md`, que são as entregas das outras quatro frentes | **fecha sozinho** quando as quatro pousarem. A minha linha, a da A3, já resolve |
| `acentuacao` | 3 violações no `…-INDICE.md` (linhas 89 e 94): `paginas` e `codigo` **dentro de citação literal dela** | do INDICE, que é posse `COORDENA`. A cura é uma: o marcador `noqa-acento` com a razão, como a casa já faz — **a digitação dela não se limpa** |

Não toquei em nenhum dos dois: os dois moram fora da minha posse, e a A1, a A2,
a A4 e a A5 vão bater no mesmo `acentuacao`. Se as cinco o consertarem, são
cinco conflitos no mesmo arquivo na hora da costura.

## A PROVA DE QUE NÃO VAZOU

```
git status --short  →  só os arquivos desta frente
olhar.py --todas --publicado --doc            →  10 abas, 1 sha256 mudou (a 02)
olhar.py --todas --publicado --doc --vista dela →  10 abas, 1 sha256 mudou (a 02)
pytest (7 arquivos do som)                    →  162 passed
pytest -k "aba02 or a02 or controles or tela" →  1322 passed
_conferir com a cura arrancada                →  rc=1, nomeando o botão
portoes.sh                                    →  54 de 56 (os 2 da seção acima)
```
