# CALIBRAR AS ENTRADAS-01 — a entrada vazia que só a mão dela ensina

**25/08/2026. GRAU: MEDIDO** onde a linha traz âncora ou comando; **DESENHO**
onde diz; **NÃO VERIFICADO** onde não houve medição.

**Nasce da ideia dela**, em 25/08 de madrugada, com quatro fotos numeradas do
gabinete:

> *"tive uma ideia foda pra resolver a questão do mapeamento das portas sem
> dispositivos conectados. Uma tela de calibração de portas usb (na aba
> configuração). Nela vai pedir pra vc usar o seu dualsense via usb. e isso vai
> servir pra desculpa de olharmos a saúde do seu computador. nele vamos pedir
> pro user validar as portas uma a uma e cada qual servirá pra numeração das
> portas, além disso vamos pedir pro user pra ele falar se esse jogo de porta é
> frontal ou traseiro... animação do martelo do Hefesto batendo e dando o sinal
> de ok. aí mapeia a parte da frente e de trás e se detectar ou não algum hub
> vamos lá porta a porta."*

E, no mesmo turno: *"vê a questão de acessibilidade e tudo mais."* A §6 é a
resposta, e ela é a maior seção deste documento de propósito.

> **APROVADA POR ELA em 25/08/2026, às ~03h55**, vendo o mockup da §11 —
> palavra dela: *"aprovado"*. O **desenho** está fechado: as duas fases, a
> pergunta única do hub, os dois relógios ditos na tela, o `[Não alcanço]`
> como saída de primeira classe, a marreta batendo uma vez em 0,82 s e as
> palavras das faces. **O que isso NÃO aprova:** as telas GTK reais, que
> pedem foto antes e depois quando existirem. Aprovar o desenho não é
> aprovar a tela.

**Decisão que a autoriza:** `D-CALIBRAR-AS-ENTRADAS` (`docs/data/decisoes-dela.csv`).
Ela **substitui a metade** *"recusou o assistente"* da `D-MAPA-2D-DAS-PORTAS` —
por decisão dela mesma, um dia depois. **A outra metade daquela decisão continua
valendo inteira:** a âncora é o caminho de barramento, e o extensor vira
porta-filha (`15` → `15a`).

---

## 1. O defeito, em uma frase

**Uma entrada USB vazia não tem aparelho, logo não tem nó de dispositivo — e o
produto não consegue saber que ela existe nem onde ela fica. O desenho à mão da
`MAPA-4` nunca alcança essas: não há o que arrastar. É exatamente o buraco que
ela abriu a conversa para tapar.**

## 2. O que está MEDIDO

Régua: `cat`/`readlink` em `/sys` e `.venv/bin/python` importando `src/` direto,
**uid 1000, sem root, sem sudo**, kernel `7.0.11-76070011-generic`, 25/08/2026
entre 02h20 e 03h20.

### 2.1 As duas entradas da frente do gabinete dela são INDISTINGUÍVEIS

```
usb1-port3   panel=right  horizontal_position=left  vertical_position=lower
usb1-port6   panel=right  horizontal_position=left  vertical_position=lower
```

Byte a byte iguais nos três campos que o kernel decodifica. E a tabela ACPI
desta placa **nunca diz `front` nem `back`** — só `left`/`right` —, e some
inteira na controladora `0000:0c:00.3` (**0 de 8** entradas respondem).

**É a prova de que o mapa tem de ser DECLARADO.** A `CONEXOES-MAPA-2D-01` §2 já
dizia isso por uma entrada; aqui está provado por duas que são iguais e por uma
controladora que não fala.

> Só o `location` cru difere (`0x80000107` × `0x80000102`) — é a posição de grupo
> do `_PLD`, e o kernel não a decodifica em campo nenhum. **NÃO VERIFICADO** que
> ela ordene as entradas no metal; não entra em código.

### 2.2 O nó da ENTRADA existe com a entrada vazia — é o que viabiliza tudo

`state` responde em **todos** os nós: `configured` quando há aparelho,
`not attached` quando não há. Contagem desta máquina: `usb1` 10 entradas,
`usb2` 4, `usb3` 4, `usb4` 4 — **22 nós de raiz**, mais 16 de hub quando o hub
está plugado. Ela conta **8 buracos no gabinete** (2 na frente, 6 na traseira).
**O resto é header interno não populado, e a calibração é o que os apaga.**

### 2.3 A ponte aparelho → entrada já é atravessada pelo censo, e custa uma string

`<dispositivo>/port` é um symlink para o nó da entrada, e
`censo_do_barramento.py:447` **já o atravessa** para ler
`port/over_current_count`. O mesmo `_campo(no, atributo, ler)` alcança
`port/state`, `port/connect_type`, `port/physical_location/panel` e `port/peer`
**sem uma linha de I/O nova**.

```
1-3      -> usb1-port3    panel=right  connect_type=hotplug
1-4      -> usb1-port4    (o DualSense, por cabo, agora)
3-1.2    -> 3-1-port2     panel=       connect_type=unknown
```

**Consequência que decide a sprint inteira: entrada OCUPADA não precisa de
caminhada.** O aparelho que está nela já diz qual entrada é.

### 2.4 O custo de varrer é irrelevante

| o quê | custo | como |
|---|---|---|
| varrer as 38 entradas (connect_type + panel + state + peer + `device`) | **6,87 ms** | média medida, uid 1000 |
| `ler_o_barramento()` | **3,0 ms** | média de 20 |
| `ler_a_mesa()` | **1,14 ms** | idem |

Um tique de 2 Hz **dentro da janela de calibração** custa ~1,4% de um núcleo,
sem daemon, sem IPC e sem udev. A regra *"nunca em tique"* vale para a aba
montada, não para uma janela modal que a pessoa abriu de propósito.

### 2.5 DOIS RELÓGIOS, e eles são o furo que mais quebraria a tela

| o quê | quando aparece |
|---|---|
| o nó USB em `/sys` | **~3,4 s** (p50 3,396 s; máx 3,488 s; n=20) |
| o nó **HID** — sem ele não há vibração nem luz | **~10,3 s de mediana, 15,6 s no pior caso** |

A causa da segunda linha é do **próprio Hefesto**: o `usbcore.quirks=054c:0ce6:gn`
que o produto instala no `cmdline` insere atraso em cada mensagem de controle da
enumeração. **A tela tem de dizer isso e assumir a culpa** — e qualquer teto de
8 s declararia falha no caso MEDIANO.

### 2.6 A primitiva que grava sem daemon existe e tem ZERO chamadores

`gravar_rascunho_da_mesa` (`utils/maquina.py:363`) foi escrita em 24/08
exatamente para isto e **nunca foi ligada**. Hoje o único escritor de produção é
`ipc_handlers.py:5004`, atrás do IPC `machine.declare` — ou seja, **com o daemon
parado, nada do que ela declarar é gravado**, e o rodapé responde *"O Hefesto
está desligado — não gravei o que você declarou"*.

É a `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ` bem no meio do caminho desta tela.

### 2.7 A interface é GTK **3.24**, não GTK4

`main.glade:3` declara `gtk+ 3.24`; há 20 `gi.require_version("Gtk", "3.0")` em
`src/`; runtime medido: **Gtk 3.24.41**. O modelo de acessibilidade é **ATK /
AT-SPI**. Nada de `GtkAccessible`, `accessible-role` ou `announce()` do GTK4 vale
aqui — e qualquer requisito escrito para GTK4 produziria código que não existe.

---

## 3. Os CINCO furos fatais que a refutação achou, e o conserto de cada

Nenhum destes é opinião: os três refutadores foram instruídos a derrubar o
desenho, e derrubaram.

### F-1 — O veredito da entrada NÃO pode vir da mão

**O furo:** *"o controle vibrou, logo a entrada é boa"* é **falso sempre que o
mesmo controle também está pareado por Bluetooth** — que é o caso normal dela.
Com dois nós do mesmo `uniq`, o pulso e a luz saem pelo **rádio** e chegam à mão
mesmo que o cabo não tenha feito nada.

**O conserto:** o veredito sai do `sysfs`, nunca da mão. O pulso e a luz querem
dizer **"senti você"**, e jamais *"a entrada é boa"*. E antes de aceitar qualquer
confirmação, a tela confere que o nó novo apareceu.

### F-2 — A caminhada nunca visita buraco ocupado

**O furo:** mandar a pessoa ao fundo do gabinete para ensinar uma entrada que o
computador já sabe é caminhada por dado que a máquina tem.

**O conserto:** a volta lista **só** as entradas cujo `state` é `not attached`.
Na mesa dela isso derruba a caminhada de 15 para as vazias — e **zero** quando
tudo está ocupado.

### F-3 — Os botões do controle chegam ao JOGO

**O furo:** usar direcional e X para navegar a janela vaza para o jogo. O
despacho para o gamepad virtual é gateado **só** pelos 0,3 s de grace, e
sobrevive de propósito ao `daemon.pause` **e** ao modo jogo.

**O conserto:** enquanto a janela de calibração estiver em foco, ela **declara
posse** do vocabulário que usa, e o despacho respeita essa posse. Sem isso, o
gesto de calibrar dispara ação dentro do jogo aberto atrás da janela.

### F-4 — A HARM-16 vira no-op depois do primeiro pulso

**O furo, e é um defeito de produto, não da tela:** `zero_motors_on_mode_exit`
(`daemon/subsystems/rumble.py:307-336`) só age quando
`daemon.config.rumble_active is None` (guarda literal em `:321`). `rumble.set`
grava um par ali; `rumble.stop` grava `(0, 0)` — **que também não é `None`**.
Uma calibração que pulsar quinze vezes deixa o daemon com `rumble_active=(0,0)`
e **desarma a cura HARM-16 para o resto da sessão**.

**O conserto:** todo pulso desta tela termina em `rumble.stop` **e**
`rumble.passthrough(True)`; e a guarda do `:321` ganha teste próprio. **Esta
metade é da Onda 9 · Rumble, não desta sprint** — aqui fica declarada.

### F-5 — A chave de identidade colide duas entradas diferentes

**O furo:** ancorar em `pci-<controlador>-usb-0:<cadeia>` joga fora o `busnum`,
que é o dígito que separa o lado 2.0 do lado 3.0 do **mesmo** controlador — dois
nós fisicamente diferentes recebem a mesma string.

**O conserto:** a chave carrega a revisão do root hub, como o próprio udev faz em
`ID_PATH_WITH_USB_REVISION`. E a busca é pela **lista de nós** da entrada, não
pela chave: aparelho → `<dispositivo>/port` → a entrada cujo conjunto de nós
contém aquele.

> **Correção de fato, e ela estava no desenho dos três:** *"o `3` do `3-1.2` é o
> busnum e ele muda"* — **não muda.** Na mesa dela o que mudou foi o segundo
> dígito: ela moveu o **hub** de buraco. O `busnum` é o dígito **estável**.

### E um sexto, que não é fatal mas apaga a tela inteira se ficar

**"Só o seu DualSense separa as entradas que existem das que não existem"** é
falso: `state` é atributo do **nó da entrada**, e **qualquer coisa que enumere
ensina a entrada**. A frase certa é *"qualquer aparelho que o computador
reconheça serve — o seu DualSense é o melhor porque ele avisa na sua mão"*. Isso
abre a cerimônia para quem tem cabo curto, para quem não se ajoelha e para quem
só tem um buraco USB-C na frente.

---

## 4. O desenho — duas fases com preços muito diferentes

### 4.1 FASE SENTADA — paga primeiro, e ninguém levanta

Na linha de cada aparelho da lista de Conexões, onde hoje mora o caminho do
sistema, entra um botão pequeno: **`[Onde fica?]`**. Não há tela de
boas-vindas, não há começo obrigatório, não há ordem.

```
Onde fica esta entrada?                             1 de 4 · sem sair da cadeira

  O seu teclado está aqui.  (Receptor sem fio 2,4 GHz)

  [ Frente do gabinete ]   [ Atrás do gabinete ]   [ Num hub ou extensão ]
```

Um toque. **Grava na hora, direto no disco** — nada espera o "Aplicar" do
rodapé, porque uma cerimônia abandonável que perde trabalho ao ser abandonada
não é abandonável.

E a pergunta que mais paga:

```
Este hub tem 7 entradas e está plugado na sua máquina. Onde fica o hub?
```

**Um toque resolve o hub e tudo o que pende dele.** Na mesa dela, quatro toques
cobriam sete aparelhos.

O fim da fase sentada é um fim de verdade: *"Acabou a parte sem levantar.
Quatro respostas, sete aparelhos com lugar."* Sem aviso de incompletude, sem
selo de pendência, sem cartaz. **Cerimônia que cobra do usuário é cerimônia que
não se reabre.**

### 4.2 FASE EM PÉ — opcional, e só para as VAZIAS

Um convite embaixo, com peso menor que o `[Fechar]`:

> *"Falta o que está vazio, e essa parte eu não consigo adivinhar. O sistema me
> lista mais entradas do que existem no seu gabinete — as que sobram são
> conectores internos que ninguém alcança. Se você me mostrar quais existem de
> verdade, eu paro de contar as que não existem."*
>
> `[ Vou mostrar agora ]`   `[ Deixar para quando eu precisar ]`

Escolhendo o primeiro:

> *"Pegue o DualSense e o cabo e encaixe numa entrada vazia. Qualquer aparelho
> que o computador reconheça serve — o DualSense é o melhor porque ele avisa na
> sua mão. Eu aviso quando achar."*

**Os dois relógios, ditos na tela e sem eufemismo:** a entrada aparece em ~3,4 s;
o controle só consegue vibrar por volta de 10 a 15 s, **e a demora é uma correção
que o próprio Hefesto instala para ele não falhar**. A tela assume a culpa em vez
de deixar a pessoa achar que quebrou.

Na volta, sentada, o mesmo cartão do passo 2 — um toque por entrada aprendida.

### 4.3 O EXAME é a moldura, e foi a palavra dela

*"vai servir pra desculpa de olharmos a saúde do seu computador"*. O laudo
aparece **antes** de ela encaixar qualquer coisa e é o que faz a tela valer a
pena mesmo se ela fechar ali: quatro blocos, nesta ordem — **O que está bem** ·
**O que merece atenção** · **O que eu não consegui conferir** · **O que eu não
meço**. O quarto bloco é o que impede o exame de virar promessa.

### 4.4 `[Já chega por hoje]` em todos os passos, no mesmo lugar

Sem diálogo de confirmação, sem *"tem certeza?"*, sem resumo do que faltou.
`Esc` faz o mesmo. **Nenhuma saída perde trabalho, então não existe caminho em
que sair seja errado.**

---

## 5. O modelo de dados — e ele é o da MAPA-2D, ampliado em um campo

**Um esquema só, e o dono é a Frente A** (`CONEXOES-MAPA-2D-01` §3.2). A
calibração **não cria esquema novo**: preenche o que já está desenhado.

```
PortaDeclarada
  caminho:   str | None     # "3-1.2" — a âncora, decisão dela de 24/08
  filha_de:  str | None     # "15" — o extensor
  nos:       list[str]      # NOVO: os nós de entrada deste buraco
                            # ("usb1-port5" e "usb2-port1" são o MESMO furo)
```

O campo `nos` existe por causa do `peer`: um buraco 3.0 tem **dois** nós, e o
DualSense (que é 2.0) sempre enumera no lado 2.0. Sem a lista, o produto acha
que são dois buracos.

**O que NÃO se deriva:** "esta entrada é azul" **não** sai do `peer`. Há porta de
raiz SuperSpeed **sem** `peer` nesta máquina, e onde o `peer` existe em
quantidade ele é o pareamento **posicional padrão do kernel**, não um fato do
firmware. Um furo é rápido se **qualquer** um dos seus nós mora num root hub
SuperSpeed — e, na dúvida, o produto diz *"não sei"*.

---

## 6. ACESSIBILIDADE — 36 requisitos, e cada um com o teste que o morde

Ela pediu com estas palavras: *"vê a questão de acessibilidade e tudo mais."*
A dificuldade central desta tela é rara: **durante a fase em pé a pessoa está
atrás ou embaixo do computador, com um cabo na mão, sem ver a tela e sem alcançar
teclado ou mouse.**

### 6.1 A tela que se opera sem ver a tela (R1–R9)

| # | requisito | o teste que morde |
|---|---|---|
| **R1** | todo passo é confirmável e avançável **sem teclado, sem mouse e sem olhar** | alimentar `inputs["buttons"]` com o botão de confirmação e exigir avanço; arrancar o handler reprova |
| **R2** | o gesto usa botão que **não colide** com o vocabulário existente, e a janela **declara posse** dele enquanto tem foco (o F-3) | com um jogo simulado atrás, o botão de calibrar **não** chega ao gamepad virtual |
| **R3** | o DualSense **já é entrada** desta janela: `controller_card.py:4949` lê `inputs["buttons"]` do payload vivo, e o laço da GUI roda a 10 Hz | nenhum import novo; o teste alimenta o payload |
| **R4** | o pulso significa **"senti você"**, nunca *"a entrada é boa"* (o F-1) | com um segundo nó do mesmo `uniq` por rádio e o cabo inerte, a tela **não** confirma |
| **R5** | todo pulso termina em `rumble.stop` **e** `rumble.passthrough(True)` (o F-4) | após 15 pulsos, `rumble_active is None` |
| **R6** | a lightbar usa a cadência **que ela já escolheu**: 0,15 s aceso / 0,12 s apagado, três vezes — 0,81 s, **3,7 Hz** | constante única, lida de `backend_pydualsense.py:79-95` |
| **R7** | **nunca** o alto-falante do controle: não há leitura de volta do volume, nada restaura o valor anterior, e a calibração desconecta o controle a cada entrada | portão: a página não importa `cmd_speaker` nem `speaker_scale` |
| **R8** | quando a entrada não dá sinal, o controle **não enumerou** — logo a mão **não pode** ser avisada, e a tela diz isso em vez de prometer | a frase de falha não promete sinal háptico |
| **R9** | dois papéis, e nenhum exige o outro: **(a)** alguém pluga e a tela avança por detecção; **(b)** ela está sozinha e o gesto do controle avança | os dois caminhos têm teste próprio |

### 6.2 Leitor de tela — ATK, não GTK4 (R10–R15)

| # | requisito | o teste |
|---|---|---|
| **R10** | nada de GTK4 | portão de import |
| **R11** | toda dica entra por `set_tooltip_text`, que **medidamente** vira `accessible-description` no GTK 3.24.41 — e **nenhuma informação necessária para decidir mora só na dica** | para cada widget, `get_accessible().get_description()` não vazio |
| **R12** | `Gtk.Label` nasce `can_focus=False` (**medido**) — linha que precisa ser lida vira botão de estilo achatado, ou ganha nome acessível no contêiner | contar widgets focáveis por passo |
| **R13** | **não há live region alcançável pelo PyGObject** (`Atk.Object` não expõe `set_attribute` — medido). O anúncio de mudança de passo é **mover o foco** para o widget do passo novo | o foco muda a cada passo |
| **R14** | o nome acessível do cartão **é** a frase de confirmação — o martelo é enfeite e nunca o único portador da notícia | o nome acessível contém o número da entrada |
| **R15** | texto acessível novo **não** vai para o `.glade` enquanto o furo do §7.1 não fechar | portão de acentuação alcança o arquivo novo |

### 6.3 Visão, distância e cor (R16–R20)

Contraste medido agora com a régua da própria casa
(`utils/color_contrast.razao_contraste`) sobre os tokens de
`scripts/paleta_da_casa.py`:

```
                    #282a36  #21222c  #343746
ink       #f8f8f2    13,36    14,81    11,06   passa
ink_quiet #a8b0c8     6,58     7,30     5,45   passa
ok        #50fa7b    10,38    11,51     8,60   passa
nulo      #6272a4     3,21     3,56     2,66   REPROVA em todos
alerta    #ff5555     4,52     5,01     3,75   REPROVA sobre #343746
```

| # | requisito | o teste |
|---|---|---|
| **R16** | nenhum texto da calibração usa `#6272a4`; `#ff5555` não escreve texto normal sobre `#343746` | `tests/unit/test_contraste_css.py`, que já monta pares texto×fundo |
| **R17** | **cor nunca sozinha.** `ok` (`#50fa7b`) × `lacuna` (`#ffb86c`) = **1,24:1** — para deuteranopia e protanopia são a MESMA cor. Cada entrada mostra **glifo + palavra** além da cor | cada estado tem glifo e palavra distintos |
| **R18** | a escala de fonte da casa (`app/theme.py`, faixa 0–8) vale para esta janela — e só faz efeito ao reabrir, o que a tela diz | a janela respeita `gtk-font-name` |
| **R19** | alvo clicável de **30 px** de altura no mínimo | medido sob `Gtk.OffscreenWindow` |
| **R20** | a palavra é **"entrada"**, nunca "porta" (`D-A-PALAVRA-ENTRADA`) | asserção de texto de tela |

### 6.4 Motricidade, alvo e privacidade (R21–R24)

| # | requisito | o teste |
|---|---|---|
| **R21** | quem não pode se ajoelhar completa pela fase sentada; quem está sozinha completa sem ver a tela | os dois caminhos |
| **R22** | **`[Não alcanço]` é saída de primeira classe**, com o mesmo peso de confirmar, e **tira** a entrada da conta em vez de deixar dívida | a entrada some do total, não vira pendência |
| **R23** | o nó de bateria do DualSense é `/sys/class/power_supply/ps-controller-battery-<endereço>` — **o nome do arquivo é um endereço de rádio.** Nunca à tela, nunca ao `maquina.json`, nunca a um PNG | `check_endereco_de_radio.py` e o portão do anonimato |
| **R24** | o serial USB dos TP-Link **é** o endereço Bluetooth deles — mesma regra | idem |

### 6.5 TDAH — e o preço de quinze passos (R25–R31)

| # | requisito | o teste |
|---|---|---|
| **R25** | **um passo por vez.** Uma entrada na tela, nunca uma grade de 15 para preencher | mais de um campo editável por vez reprova |
| **R26** | progresso **contável**: "entrada 4 de 15", com barra. Nunca porcentagem sozinha | a frase contém os dois números |
| **R27** | começar é o passo mais difícil: **não existe tela de boas-vindas.** O primeiro toque já é trabalho útil | zero telas intermediárias antes do primeiro cartão |
| **R28** | grava a **cada** resposta, no disco, na hora | matar o processo no meio não perde nada |
| **R29** | reabrir cai na primeira entrada sem lugar, com o contador refeito pela leitura de **agora** | a mesa mudou entre as sessões e o contador acompanha |
| **R30** | sair não pede confirmação e não mostra o que faltou | nenhum diálogo no caminho de saída |
| **R31** | a fase sentada tem **fim próprio** — não é preâmbulo da fase em pé | fechar ali não deixa pendência |

### 6.6 Latência, som e animação (R32–R36)

| # | requisito | o teste |
|---|---|---|
| **R32** | enquanto não confirmou, tela **e** controle dizem "procurando" — silêncio é lido como falha | cronômetro injetável entre evento e primeiro sinal |
| **R33** | os dois relógios do §2.5 aparecem na tela com os números reais; **nada** de "uns quatro segundos" e **nenhum** teto de 8 s | asserção sobre o texto e sobre o teto |
| **R34** | o `toc` do sistema usa `app/audio_saida.py`, que **já existe** — mas ele toca **no sink do controle, nunca no padrão**, e o sink do controle **não existe** aos 3,4 s. Ou o módulo ganha um caminho para o sink padrão, ou o `toc` sai do desenho | o som toca com o controle ausente, ou não há som |
| **R35** | a marreta respeita `gtk-enable-animations` — o equivalente de `prefers-reduced-motion`, que **existe no GTK3 e o produto nunca leu** (`grep` = 0 em `src/`) | com a chave em `False`, zero quadros |
| **R36** | a marreta **não pisca acima de 3 Hz** e não é o único portador de notícia nenhuma | contagem de quadros e do nome acessível |

---

## 7. Três defeitos que esta investigação achou e que NÃO são desta sprint

Ficam declarados porque achado sem dono morre.

### 7.1 O portão do idioma não lê o `.glade` — e há texto sem acento em produção

`scripts/validar-acentuacao.py:445` tem `r".*\.glade$"` na whitelist. **O arquivo
com mais texto de tela do produto é o único que o portão do idioma não lê.**
Resultado hoje, em texto que só o leitor de tela pronuncia:

```
main.glade:944   "Envia configuracao do gatilho esquerdo ao controle selecionado"
main.glade:958   "Restaura L2 ao modo Off (sem resistencia)"
main.glade:1099  "Envia configuracao do gatilho direito ao controle selecionado"
main.glade:1113  (idem)
```

**Dono:** quem coordena, depois que a Onda 7 · Lightbar soltar o `main.glade`.

### 7.2 A HARM-16 está desarmada depois do primeiro `rumble.stop`

O F-4 acima. **Dono: Onda 9 · Rumble.**

### 7.3 `gravar_rascunho_da_mesa` tem zero chamadores

O §2.6. **Dono: esta sprint** (é a `CAL-2`), porque é ela quem precisa.

---

## 8. As tarefas

Custo em linhas é **DESENHO**. Toda tarefa declara a mordida e o que acontece ao
arrancar a cura.

### CAL-1 — o leitor de entradas, e ele é o dono único

**Arquivo:** `src/hefesto_dualsense4unix/integrations/entradas_do_gabinete.py` (novo)
**O que faz:** funções puras, sem GTK, sem IPC, sem `/dev`: `listar_entradas()`
(os nós de entrada com `state`, `connect_type`, `panel`, `peer`),
`entrada_de(caminho)` (o readlink do §2.3), `vazias()`, `furos()` (agrupa nós
pelo `peer`). Raiz de `/sys` **injetável** — o `CANARIO-FS-01` reprova constante
de módulo. ~150 linhas.

**A MORDIDA:** `tests/unit/test_entradas_do_gabinete.py`
::`test_o_par_2_0_e_3_0_e_um_furo_so` — sobre uma raiz de mentira com
`usb1-port5 peer-> usb2-port1`, afirma **um** furo com **dois** nós.
**Arrancada a cura** (ignorando `peer`): saem dois furos e o teste reprova
nomeando os dois nós que eram o mesmo buraco.
Segundo caso ::`test_entrada_vazia_aparece_com_state_not_attached` — a entrada
sem aparelho **existe** na lista. Arrancada (listando só quem tem `device`): a
lista encolhe e o teste reprova.

### CAL-2 — a gravação sem daemon ganha chamador

**Arquivo:** `src/hefesto_dualsense4unix/utils/maquina.py` (só o chamador) e a janela
**O que faz:** liga `gravar_rascunho_da_mesa` (§2.6). ~15 linhas.

**A MORDIDA:** `tests/unit/test_a_calibracao_grava_com_o_daemon_morto.py`
::`test_grava_sem_ipc` — com o IPC recusando tudo, responde uma entrada e afirma
que o `maquina.json` do `tmp_path` mudou.
**Arrancada a cura** (voltando a gravar por `machine.declare`): o arquivo não
muda e o teste reprova imprimindo a frase que a tela mostraria.

### CAL-3 — a fase sentada: `[Onde fica?]` em cada aparelho

**Arquivo:** `src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py` (novo)
**O que faz:** o cartão do §4.1, o caso do hub, a gravação imediata. ~260 linhas.
**Carimbo D3: precisa do olho dela ANTES de fechar.**

**A MORDIDA:** `tests/unit/test_a_fase_sentada_resolve_o_hub.py`
::`test_um_toque_no_hub_coloca_tudo_que_pende_dele` — mesa com hub e três
aparelhos; um toque em "Num hub" e afirma que os **quatro** ganharam lugar.
**Arrancada a cura** (colocando só o hub): três ficam sem lugar e o teste
reprova listando quais.

### CAL-4 — a fase em pé, e ela nunca visita buraco ocupado

**Arquivo:** o mesmo widget
**O que faz:** a volta do §4.2, com os dois relógios do §2.5 na tela. ~200 linhas.
**Carimbo D3: precisa do olho dela ANTES.**

**A MORDIDA:** `tests/unit/test_a_volta_so_visita_o_que_esta_vazio.py`
::`test_entrada_ocupada_nao_entra_na_caminhada` — mesa com 8 ocupadas e 7 vazias;
afirma que a lista da volta tem **7** e que nenhuma delas tem `device`.
**Arrancada a cura** (listando todas): a lista vai a 15 e o teste reprova
nomeando a primeira ocupada que ela seria mandada a visitar.
Segundo caso ::`test_o_veredito_vem_do_sysfs_e_nao_da_mao` — o F-1: com um
segundo nó do mesmo `uniq` por rádio e o cabo inerte, a tela **não** confirma.

### CAL-5 — a posse do vocabulário do controle

**Arquivo:** `src/hefesto_dualsense4unix/daemon/…` (o gate do despacho) + a janela
**O que faz:** o F-3 — enquanto a janela tem foco, os botões que ela usa não
chegam ao gamepad virtual. ~60 linhas.

**A MORDIDA:** `tests/unit/test_o_botao_de_calibrar_nao_chega_no_jogo.py`
::`test_com_a_janela_em_foco_o_despacho_para` — com jogo simulado, afirma zero
eventos no vpad. **Arrancada a cura:** o evento aparece no vpad e o teste reprova
dizendo qual botão vazou.

### CAL-6 — a marreta

**Arquivo:** o widget + `gui/theme.css`
**O que faz:** a animação que ela pediu, respeitando `gtk-enable-animations`
(R35), no máximo 3 Hz (R36), e **nunca** como único portador da notícia (R14).
Sequência de quadros por `GLib.timeout_add` — a casa já usa esse caminho e não
carrega dependência nova. ~70 linhas.
**Carimbo D3: precisa do olho dela ANTES.**

**A MORDIDA:** `tests/unit/test_a_marreta_respeita_o_silencio.py`
::`test_com_animacao_desligada_zero_quadros` — com `gtk-enable-animations=False`,
afirma zero quadros e o cartão **igualmente** legível.
**Arrancada a cura** (animando sempre): conta quadros > 0 e reprova.

> **A marreta seria a PRIMEIRA animação do produto** — `transition|animation|
> @keyframes` no `theme.css` dá **zero** hoje. Isso ameaça o portão de foto: em
> 14/08 uma transição do tema do sistema já fez o retrato sair errado. O retrato
> tem de capturar o estado **final**, e é a mordida acima que garante.

### CAL-7 — o laudo, e o quarto bloco

**Arquivo:** o widget
**O que faz:** os quatro blocos do §4.3, consumindo o que já existe
(`Energia.corrente_pedida_ma`, `hub_em_comum`, `cadeia_de_hubs` — os três nascidos
em 22/08 e **sem consumidor até hoje**). ~120 linhas.
**Carimbo D3: precisa do olho dela ANTES.**

**A MORDIDA:** `tests/unit/test_o_laudo_confessa_o_que_nao_mede.py`
::`test_o_quarto_bloco_nunca_some` — mesa perfeita, e afirma que "O que eu não
meço" **continua na tela**. **Arrancada a cura** (escondendo o bloco quando está
tudo bem): o bloco some e o teste reprova — porque é ele que impede o exame de
virar promessa.

---

## 9. O que esta sprint NÃO faz

- **Não cria esquema novo.** O dono é a `CONEXOES-MAPA-2D-01` (Frente A); aqui só
  se acrescenta `nos` à `PortaDeclarada`, e **em acordo com aquela frente**.
- **Não escreve a ordem de serviço** — é a `ORDEM-DE-SERVICO-01`.
- **Não toca `secao_exame.py`** — é da Frente B.
- **Não decide a redação final** de nenhuma frase de tela — a dona única do texto
  desta aba é a `CONFIGURACOES-O-LEXICO-01`, que entra por último.
- **Não conserta a HARM-16** (§7.2) nem o portão do idioma (§7.1).
- **Não mede nada com o aparelho na mão.** Os números do §2.5 vieram de leitura;
  a volta completa com quinze entradas é **bancada dela**.

## 10. Posse

```yaml
posse:
  CAL-A: [src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py]
  CAL-B: [src/hefesto_dualsense4unix/integrations/entradas_do_gabinete.py]
cria:
  - src/hefesto_dualsense4unix/integrations/entradas_do_gabinete.py
  - src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
  - tests/unit/test_entradas_do_gabinete.py
  - tests/unit/test_a_calibracao_grava_com_o_daemon_morto.py
  - tests/unit/test_a_fase_sentada_resolve_o_hub.py
  - tests/unit/test_a_volta_so_visita_o_que_esta_vazio.py
  - tests/unit/test_o_botao_de_calibrar_nao_chega_no_jogo.py
  - tests/unit/test_a_marreta_respeita_o_silencio.py
  - tests/unit/test_o_laudo_confessa_o_que_nao_mede.py
depois_de:
  - CONEXOES-MAPA-2D-01   # o esquema `mapa` e o campo `nos`
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - docs/data/decisoes-dela.csv
bancada: true    # só a volta completa; tudo o mais roda sem aparelho
```

## 11. O mockup

`docs/process/sprints/2026-08-25-CALIBRAR-AS-ENTRADAS/mockup/calibrar-entradas.html`
— HTML autocontido, paleta copiada byte a byte de `scripts/paleta_da_casa.py`,
sem fonte web, **com a leitura real da mesa dela**. Abre com duplo clique.

**Ela decide vendo, não lendo.** O mockup é a peça que pede o olho dela; este
documento é o que os agentes executam.
