# O redesenho da janela — as dez abas, aba por aba

**26/08/2026.** Documento único do desenho novo.

> *"quero entender o todo de cada ajuste que eu falei por cada aba e eu quero ver também quais botões terá... cada feature que temos na gui hoje pra que não percamos nada."*

Este documento é a janela inteira depois dos seus ajustes: dez abas, uma seção por aba, dizendo o que muda, quais botões ela terá, o que fica na tela e o que vira dica. Cada feature que existe hoje aparece nomeada no bloco **"Nada se perdeu"** da sua aba — se alguma não estiver lá, é erro meu, não decisão. O que ainda depende da sua palavra está separado no fim, e nada disso vira código antes de você ver o mockup.

**Como ler cada seção:** *o que muda* (o porquê, com a decisão que o sustenta) · *os botões e controles* (a tabela do que ela terá, e de onde cada um veio) · *o que fica na tela e o que vira dica* · *nada se perdeu* (uma linha por feature de hoje).

---

## A conta

| | Hoje | Depois | O que explica a diferença |
|---|---|---|---|
| **Abas** | 11 | **10** | a Emulação morre e a No jogo funde com a Status |
| **Widgets na tela** | 145 | **141 a 144** | 26 saem, 4 pares viram 4 botões, 29 nascem. A faixa é porque três decisões abertas duplicam ou não dois botões |
| **Textos fixos visíveis** | 372 | **cerca de 140** | o resto vira dica, num ícone "?" ao lado do título do quadro |

Dos **29 que nascem, 18 são features que o código já tem e a tela nunca mostrou** — a lista inteira está adiante. Só 11 são trabalho realmente novo.

**Texto, aba por aba** (a coluna da direita é o que sobra na tela):

| Aba | Textos fixos hoje | Ficam visíveis |
|---|---|---|
| Jogar | 32 | ~12 |
| Controles | 35 | ~15 |
| Gatilhos | 15 | 13 |
| Iluminação | 13 | ~9 |
| Vibração | 26 | ~10 |
| Navegação | 37 | ~12 |
| Sistema | 25 | ~8 |
| Conexões | **88** | ~30 |
| Perfis | 30 | ~14 |
| Lançadores | 33 | ~8 |
| **Soma das dez seções** | **334** | **~131** |

Os 38 que faltam para os 372 são a "No jogo" e a moldura da janela (cabeçalho e rodapé) — a diferença entre o total medido e a soma das dez seções. A Conexões sozinha carrega **um quarto de todo o texto do produto**, três vezes a média das outras.

### O que some

- **A aba Emulação**, como nome e como assunto. O conteúdo dela não se perde: se espalha por cinco donos (Jogar, Navegação, Sistema, Conexões, Controles), e o nome passa a ser da aba Lançadores, com sentido novo.
- **A aba No jogo.** Vira uma faixa dentro do card de cada controle, e deixa de depender de jogo da Steam aberto para existir.
- **26 widgets**, por redundância medida: 12 da Iluminação (o desenho das cinco luzes inteiro, com as cinco caixas ocultas), 8 da Emulação (os três botões de modo gêmeos, os dois de Steam Input, a máscara repetida, o Passthrough e o Buffer), 4 dos Perfis (o Modo avançado e os três campos crus), o crachá "Editando: Controle N" e o rótulo-espelho "Ligar junto com o computador" da Conexões.
- **4 pares viram 4 botões:** os dois "Aplicar" dos gatilhos, os dois "Voltar ao automático" da Iluminação, os dois "reexaminar" da Conexões, os dois "Atualizar" (Sistema e Emulação).

---

## A tira nova

| # | Aba | Como se chamava | O que mudou de dono |
|---|---|---|---|
| 1 | **JOGAR** | Início | ganha o Detectar o jogo; a faixa do player desce para a Iluminação. ~~o Automático da máscara~~ — **caducou em 29/08**, ver a linha abaixo |
| 2 | **CONTROLES** | Status + No jogo | as duas viram uma; o que o jogo recebe entra na faixa de cada card |
| 3 | **GATILHOS** | Gatilhos | ganha "Meus efeitos"; os dois "Aplicar" viram um |
| 4 | **ILUMINAÇÃO** | Lightbar | perde o desenho das cinco luzes; ganha a escolha do número do controle |
| 5 | **VIBRAÇÃO** | Rumble | ganha o desenho que treme por lado |
| 6 | **NAVEGAÇÃO** | Navegação | recebe a área que ensina os combos, com o PS+R3 |
| 7 | **SISTEMA** | Sistema | recebe o diagnóstico da Emulação e o Restaurar de fábrica |
| 8 | **CONEXÕES** | Configurações | vira a aba do ambiente; "A janela" sai |
| 9 | **PERFIS** | Perfis | ganha o aviso de quem nunca entra e o Estilo de Jogo |
| 10 | **LANÇADORES** | Emulação | de "emulação de gamepad" para "de onde vêm os seus jogos" |

A ordem de Perfis em nono lugar contraria o que você descobriu hoje — que o perfil é quem manda. Fica registrado como pergunta, e você decide vendo o mockup.

---

## Os padrões que valem para as dez

Consertar por padrão custa uma vez; consertar aba por aba custa dez.

**P1 · A fita é o único lugar que escolhe o alvo** (D-A-FITA-E-O-UNICO-ALVO)
Nenhuma aba ganha seletor de peça próprio. Onde a fita não se aplica, ela fica esmaecida **com o motivo certo** — "não se aplica", nunca "ainda não ligamos o leitor". Consequência obrigatória: o que a fita mira precisa ter onde ser gravado por controle. Hoje `ControllerOverrides` (`profiles/schema.py:900-904`) tem `leds`, `triggers`, `rumble` e `speaker` e **não tem `mic`**; e nenhum dos 29 perfis do disco tem a chave `controllers` — o override existe desde 10/08 e nunca foi escrito uma única vez.

**P2 · A borda tem a cor do plástico; o interior diz se está selecionado** (D-A-BORDA-E-A-IDENTIDADE-DA-PECA)
`tom_para_a_borda` já existe e só a Conexões chama. Passa a valer em todo lugar que mostra um controle. Trava medida: a cor só é perguntada **no cabo** e a resposta não vai para o disco (`app/actions/config/secao_controles.py:929`) — gravar o que o cabo leu conserta a borda das quatro abas de uma vez.

**P3 · Tudo que explica vira dica; o que diagnostica fica** (D-TUDO-QUE-EXPLICA-VIRA-DICA)
Duas travas medidas. No GTK3, **widget insensível não dispara tooltip** — a explicação de por que algo está cinza tem de morar num ícone "?" sensível ao lado do título do quadro, não no widget apagado. E nem todo texto longo é ajuda: o "Estado da vibração", a linha da ponte da Jogar e três parágrafos da Navegação são diagnóstico vivo, que muda sozinho. Diagnóstico não some sob o ponteiro.

**P4 · O desenho substitui a descrição** (D-O-SVG-VIBRA-POR-LADO)
`assets/control-svg/dualsense.svg` está pronto desde 11/08: 32 ids nomeados, cinco cores de plástico, e o mecanismo de acender. `grep -rn 'control-svg' src/` devolve **zero**. Trava de empacotamento: o `install.sh` copia só `assets/glyphs/*.svg` — pôr o desenho na tela sem mexer no install e no `scripts/check_packaging_parity.sh` produz um card vazio numa máquina instalada, sem um erro no log.

**P5 · As abas conversam; um fato tem um dono só** (D-AS-ABAS-CONVERSAM)
"Perfil ativo", "Hefesto: Ligado", o modo, a máscara e o estado da barra de luz apareciam em três lugares e podiam divergir. Passam a ter um escritor único **por construção**, não por disciplina de quem edita depois.

**P6 · Nada se decide em dois lugares**
Onde o mesmo gesto existia duas vezes, ou um sai, ou os dois passam a chamar o mesmo código: os três botões de modo (Início e Emulação), os dois "Atualizar", os dois "Voltar ao automático", os dois "Aplicar" dos gatilhos, os dois "reexaminar", o Ligar/Desligar da Jogar e da Sistema. Duplicar botão foi o defeito mais caro do desenho antigo — três das perguntas abertas do fim são exatamente isto.

**P7 · O rodapé tem dois tempos, e a tela diz qual falta** (D-APLICAR-NAO-SALVA)
[Aplicar] vale agora e não grava; [Salvar Perfil] aplica e grava. Todo botão de aba que se chamava "Aplicar" muda de nome — Reenviar ao controle, Travar nesta vibração, Mandar de novo —, porque hoje há **quatro "Aplicar" na mesma janela**. "Voltar ao padrão" sai do rodapé: restaurar de fábrica é gesto raro e mora na Sistema.

**P8 · A tela não pula, e a aba cabe na janela**
Widget que brota empurra a tira de abas para baixo; a solução é **espaço reservado**, não widget escondido. Duas dívidas de altura já medidas: a fileira "Avançado" da Sistema soma 1230 px numa janela que abre com 1180, e a Conexões mede 2465 px numa janela de 1080 — três features já foram cortadas por isso.

---

# As dez abas

### 1. Jogar

*A tela de abrir e olhar: "o que o meu controle é agora, quem está na mesa, e dá para jogar?"*

**O que muda**

- **É a primeira aba e chama-se Jogar** — "Início" saiu com as duas palavras em inglês da tira (D-AS-DEZ-ABAS-E-SEUS-NOMES).
> **A MÁSCARA NÃO GANHA O AUTOMÁTICO — decisão dela, 29/08/2026**
> (`D-A-MASCARA-GANHA-O-AUTOMATICO`, com lápide datada). A medição derrubou a
> promessa: a heurística prometida **erra em 13 dos 14 jogos dela**
> (`integrations/api_de_entrada.py:12-49`). Um "Automático" que erra quase
> sempre é pior que escolher à mão, porque **erra em silêncio**. A aba Jogar já
> registrava isso (`novo-layout/01-jogar.html:2311`); a Perfis ainda o anunciava
> como entrega, e a divergência entre os dois mockups aprovados foi o que
> levou a pergunta a ela.
>
> **Atenção ao homônimo:** o "Automático" do **Modo de conexão** na aba Jogar
> é outra coisa e **fica** — ele escolhe a ponte, não a máscara.
>
> O texto original, preservado: **A máscara ganha o Automático, e ele nasce ligado**: [Xbox 360] [DualSense] [Automático]. Hoje ela escolhe no escuro; o produto já sabe quais APIs de entrada estão dentro do executável do jogo e nunca contou isso a ninguém (D-A-MASCARA-GANHA-O-AUTOMATICO).
- **Nasce o "Detectar o jogo que está aberto"**: abre o jogo de onde for — Heroic, Lutris, emulador, Flathub —, volta e clica, e o perfil nasce. O motor já é universal (casa por `process_name` e `window_class`); só a tela dizia "Steam" 689 vezes (D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM).
- **Os três botões de modo passam a existir só aqui.** A Emulação tinha os gêmeos ("Desligado / DualSense (PS) / Xbox 360") chamando o mesmo `apply_mode`, com outro vocabulário — e a Emulação morreu (D-A-EMULACAO-MORRE).
- **A tela para de pular.** Oito widgets aparecem e somem sozinhos hoje, e o cabeçalho empilha até cinco faixas. A faixa do player e o crachá "Editando: Controle N" descem para a Iluminação, e o que resta reserva o próprio espaço (D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR).
- **Os avisos do topo passam a caber num lugar só, e a contar quantos são.** Hoje três banners disputam a mesma linha e o primeiro decide entre quatro frases em cascata: um rádio frágil esconde um vpad degradado sem dizer que escondeu.
- **A borda de cada card é a cor do plástico daquele controle**, em todos os cards da aba — a borda diz qual peça é, o interior diz se está escolhida (D-A-BORDA-E-A-IDENTIDADE-DA-PECA).
- **O texto encolhe muito**: 32 frases para 6 botões, cinco por botão. Sobram título, rótulo e estado (D-TUDO-QUE-EXPLICA-VIRA-DICA).
- **O rodapé passa a ter dois tempos claros**: Aplicar vale agora e não grava; Salvar Perfil aplica e grava. Importa para esta aba mais que para qualquer outra, porque os dois seletores daqui **não aplicam nada sozinhos** (D-APLICAR-NAO-SALVA).

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| **O que o controle faz agora:** [Controlar o PC] [Jogar pelo Hefesto] [Conexão Nativa (Sony)] | Escolhe o que o controle vai ser no próximo jogo: mouse/teclado do PC, gamepad do Hefesto, ou DualSense falando direto com o jogo | *existe hoje* — e absorve os três botões gêmeos da Emulação (D-A-EMULACAO-MORRE) |
| **O jogo vê o controle como:** [Xbox 360] [DualSense] [**Automático**] | Xbox para jogo que só entende XInput (e aí sem giro, sem acelerômetro, sem touchpad); DualSense para os prompts de PlayStation; Automático decide a cada jogo que abrir | *existe hoje* + **NOVO** no Automático (D-A-MASCARA-GANHA-O-AUTOMATICO); o motor é `integrations/api_de_entrada.py`, hoje com zero consumidores em `app/` |
| **Detectar o jogo que está aberto** | Olha a janela que está na frente e cria o perfil daquele jogo, venha ele de onde vier | **NOVO** (D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM) |
| **Não trocar de perfil sozinho ao abrir um jogo** | Congela a troca automática: o perfil que ela deixou ativo continua valendo | *existe hoje* |
| **Reconciliar jogadores** | Traz de volta quem caiu do co-op e arruma a numeração para 1..N | *existe hoje* |
| **Desligar Hefesto (voltar ao Linux puro)** ⇄ **Ligar o Hefesto** | Desliga o produto de verdade — o controle vira um controle comum do Linux — e não ressuscita ao reabrir a janela. Pergunta antes, dizendo o que se perde | *existe hoje* (o mesmo gesto também mora na Sistema) |
| **Continuar (sair da pausa)** | Despausa o Hefesto pelo clique | *existe no código e nunca teve tela* — `daemon/ipc_server.py:121` (`daemon.resume`), handler `daemon/ipc_handlers.py:2293`. Hoje a pausa **persiste em disco** e renasce pausada no boot, e o único jeito de sair é `hefesto-dualsense4unix daemon resume` no terminal |
| *(rodapé)* **Aplicar** | É ele que manda os dois seletores desta aba ao produto — clicar aqui só anota a escolha | *vem do rodapé* (D-APLICAR-NAO-SALVA) |

**O que fica na tela e o que vira dica**

Hoje: **32 textos fixos** para 6 widgets. Ficam visíveis: os dois títulos de seletor, os rótulos dos botões (~12 no total) e os **estados** — modo vigente, máscara vigente, a linha "● vai mudar para:" quando há escolha pendente (é a prova de que o Aplicar ainda deve), "2 controles = 2 jogadores", a linha **Ponte com o jogo** com o veredito colorido, e por card: número, jogador, transporte em português e bateria em %.

Vão para o "?" ou para a dica do widget: a descrição de cada um dos três modos, o custo da máscara Xbox (perde giro/acelerômetro/touchpad), a ressalva do Reconciliar, a frase do cadeado, o aviso do "Controlar o PC" calado e a linha de divergência. Sobram cerca de doze frases visíveis das trinta e duas.

**Nada se perdeu**

- Seletor de modo (3 botões) — **fica**; e é o único lugar da janela onde esse gesto existe.
- Seletor de máscara (Xbox/DualSense) — **fica**, com o Automático como terceira opção e padrão.
- "Não trocar de perfil sozinho ao abrir um jogo" — **fica**.
- "Reconciliar jogadores" — **fica** (nome em aberto, abaixo).
- "Desligar Hefesto / Ligar o Hefesto" + diálogo de confirmação — **fica**, é o gesto do dia; o par ligar/desligar/reiniciar da Sistema continua lá como manutenção.
- Linha "Ponte com o jogo" (verde/laranja) — **fica**, e passa a poder nomear também o quinto degrau da roda, o Teclado+Mouse (D-O-QUINTO-DEGRAU-DA-RODA).
- "2 controles = 2 jogadores" (e a variante com controle externo) — **fica**.
- Cards de controle DualSense (título, jogador, transporte, bateria) — **fica o resumo**; o detalhe — entradas, sensores, áudio, "Perfil ativo / Hefesto: Ligado" — é da aba **Controles** (D-A-NO-JOGO-FUNDE-COM-A-STATUS).
- Cards de controle externo (8BitDo, Pro Controller) — **ficam** no mesmo resumo, com borda da cor do plástico.
- Transporte em português ("cabo", "rádio", "não sei por onde") — **fica**.
- Os três banners do topo — **ficam**, numa área única de espaço reservado, e a cascata de quatro frases passa a dizer quantos avisos existem em vez de esconder três.
- Frase do cadeado, custo da máscara Xbox, ressalva do Reconciliar, aviso do "Controlar o PC" calado — **viram dica** (D-TUDO-QUE-EXPLICA-VIRA-DICA).
- Linha "● vai mudar para:" e o toast "Anotado. Clique em Aplicar…" — **ficam**: são as provas de que a escolha está pendente.
- A escolha de máscara recusada (`_home_flavor_pedido`, gravada pelo rodapé desde 25/08) — **fica**: a recusa não some calada em 2 s.
- Fita "Ajustes vão para" — **continua esmaecida aqui**, porque nada nesta aba ajusta por controle; os cards são leitura. O motivo em `app/app.py:1231` permanece "não se aplica" (D-A-FITA-E-O-UNICO-ALVO).
- Texto da pausa (`home_actions.py:208`) — **sai como está e é reescrito**: as duas saídas que ele manda usar são falsas (PS + Options é *suppress*, não *resume*; e a aba Emulação deixou de existir). No lugar entra o botão **Continuar**.

**O que ainda falta decidir**

1. A Jogar mostra **card por controle** ou só a contagem e a linha da ponte, já que o card cheio agora é da aba Controles?
2. **Ligar/Desligar o Hefesto em dois lugares** (aqui e na Sistema): sai da Sistema, ou fica lá como manutenção?
3. Com o Automático ligado, a máscara continua sendo **da mesa inteira**, ou cada jogador pode ter a sua? O separador já existe (`daemon/subsystems/external_mask.py:642`), mas o laço do co-op ainda compara contra um `desired_flavor` global (`daemon/subsystems/coop.py:394`).
4. **"Reconciliar jogadores"** é palavra de quem programa. Qual é o nome dela?
5. O **"Detectar o jogo que está aberto"** nasce só aqui, ou também ao lado do campo "Nome do jogo:" na aba Perfis?
6. Entra também um botão de **pausar**, ou só o **Continuar**? (Hoje a pausa persiste em disco e ninguém na tela a liga nem a desliga.)

---

### 2. Controles

*A aba que responde "o que cada controle é agora, e o que ele está entregando ao jogo neste instante".*

**O que muda**

- **A "No jogo" some da tira e entra dentro do card de cada controle** — uma faixa acima da área do aparelho, com *Perfil ativo*, *Hefesto: Ligado* e o que está atravessando para o jogo. As duas abas eram metades da mesma pergunta (o que o aparelho **é** / o que o jogo **recebe**) e a de cima estava quase vazia (`D-A-NO-JOGO-FUNDE-COM-A-STATUS`, `D-AS-DEZ-ABAS-E-SEUS-NOMES`).
- **A faixa deixa de depender da Steam.** Hoje a aba "No jogo" só nasce com jogo da Steam aberto (`painel_no_jogo.py:402`, `jogo_steam_aberto`) e some inteira fora disso. Dentro do card ela vale para qualquer jogo, venha de onde vier (`D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM`).
- **O quadro "Estado" se dissolve.** Conexão, transporte, perfil ativo, Hefesto e bateria da mesa viravam um quadro que **sumia justamente com um controle só** — a tela mais comum. Cada card passa a dizer isso de si mesmo, e o que é da mesa fica no cabeçalho (`D-A-NO-JOGO-FUNDE-COM-A-STATUS`).
- **A borda do card ganha a cor do plástico; o interior lilás diz "selecionado".** Hoje as duas informações disputam o mesmo espaço. Borda = quem é; interior = está escolhido (`D-A-BORDA-E-A-IDENTIDADE-DA-PECA`, `D-CADA-JOGADOR-NAVEGA-COM-O-SEU`).
- **A faixa "Número deste controle: [1][2][3][4]" sai do cabeçalho** e vira seção fixa na aba Iluminação, junto do desenho das cinco luzes. O crachá "Editando: Controle N" sai também — eram as duas linhas que brotavam e empurravam a tira para baixo (`D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR`).
- **O card mostra estado e nunca escolhe alvo.** Quem escolhe é a fita, e só ela (`D-A-FITA-E-O-UNICO-ALVO`). Consequência obrigatória: **o microfone precisa de override por controle** — hoje `draft.with_mic` é sempre global (`draft_config.py:1823`) e a fita não tem onde gravar "Controle 2 mudo".
- **O mudo do microfone vira ícone na ponta do slicer**, e continua mandando na luz vermelha do plástico — que é firmware, e volume zero não apaga (`D-O-BOTAO-DO-MIC-MANDA-NA-LUZ`).
- **O volume do microfone que morava na Emulação chega aqui; o modo do microfone vai para Conexões** (`D-A-EMULACAO-MORRE`, `D-A-ABA-DO-AMBIENTE-CHAMA-SE-CONEXOES`).
- **Um dono só para "Perfil ativo" e "Hefesto".** O mesmo fato aparecia em três lugares e podia divergir; o escritor único que o card já tem (`status_actions.py:2960`) passa a ser o único caminho, por construção (`D-AS-ABAS-CONVERSAM`).
- **Três defeitos de tela fecham junto:** o "Liberar" do alto-falante que não tem pai, o "Ouvir no controle" invisível e o seletor de som que nunca mostra a rota em vigor (abaixo).
- **Toda explicação vira dica** (`D-TUDO-QUE-EXPLICA-VIRA-DICA`).

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| Fita "Ajustes vão para: [Todos] [Controle 1 · cabo] [Controle 2 · rádio]" | Escolhe qual controle recebe os ajustes de todas as abas. Único lugar onde se escolhe o alvo | existe hoje (montada por esta aba) |
| Chip de controle externo na fita ("8BitDo 3 · rádio") | Abre a ficha só de leitura do controle não-Sony | existe hoje |
| Slicer do microfone (0–100) | Volume de captura do microfone do controle | existe hoje — passa a gravar **por controle** |
| Ícone de mudo na ponta do slicer do microfone | Cala/reabre o microfone no firmware e apaga/acende a luz vermelha do plástico | NOVO (substitui o botão "Silenciar/Ativar", `D-O-BOTAO-DO-MIC-MANDA-NA-LUZ`) |
| "Liberar" (microfone) | Devolve ao botão físico do controle o comando do mudo | existe hoje |
| Slicer do alto-falante (0–100) | Volume do alto-falante e do fone do controle | existe hoje |
| Ícone de mudo na ponta do slicer do alto-falante | Manda zero sem perder o volume guardado | existe hoje (botão "Silenciar/Ativar", vira ícone pela mesma regra) |
| "Liberar" (alto-falante) | Devolve ao firmware a posse do volume | existe hoje, **mas hoje é inalcançável** com um controle só: criado em `controller_card.py:3577`, nunca empacotado (`:3775`) |
| [Sons do jogo \| Todo o som do PC] | Escolhe o que sai no alto-falante do controle | existe hoje **só no card de um controle** (`controller_card.py:3763`); passa a existir em todo card, e a **mostrar a rota em vigor** — hoje `_speaker_canal_pintando` (`:2388`) nunca vira `True` e o seletor nasce sem nada marcado |
| "Ouvir no controle" | Manda o som do PC para o alto-falante do controle, e desfaz | existe hoje, **invisível com exatamente 1 controle** (`status_actions.py:1415`); passa para dentro do card |
| "?" por bloco (Som, Microfone, Entradas, No jogo) | Guarda a explicação que hoje ocupa a tela | NOVO (`D-TUDO-QUE-EXPLICA-VIRA-DICA`) |

Leitura viva, sem botão: os 16 glifos acesos na cor do controle, os dois analógicos (X/Y), L2/R2 em 0–255, ponto e contagem de toques do touchpad, os três eixos do giroscópio, bateria em %, e as seis linhas do "No jogo" (giroscópio · vibração · gatilho · luz · clique do touchpad · som do controle) com *no jogo agora* / *parou* / *sem pedido ainda*.

**O que fica na tela e o que vira dica**

Hoje são **35 textos fixos**. Ficam visíveis: o título do card ("Controle 1 — cabo · Jogador 1"), a bateria, a faixa "Perfil ativo · Hefesto · o jogo vê o controle como X", o alarme de divergência ("o perfil deste jogo pedia DualSense"), o aviso amarelo do perfil que não entrou, as seis linhas do "No jogo" com a palavra do estado e o número entre parênteses (`~158 Hz`, `motores: 30/120`), os rótulos dos dois blocos de som e os números dos slicers.

Vai tudo para o "?" ou para a dica: por que o Modo Nativo não tem o que medir, por que este controle ainda não tem gamepad virtual, o que é tomar a posse do registrador de volume, a diferença entre mudo de firmware e volume zero, e o que cada recurso significa.

**Nada se perdeu**

- Fita "Ajustes vão para" — **fica** (é o único lugar que escolhe alvo).
- Chips de controle externo na fita — **ficam**.
- Faixa "Número deste controle: [1][2][3][4]" — **vai para Iluminação**, como seção fixa.
- Crachá "Editando: Controle N" — **sai**: a fita já diz, e era uma das duas linhas que faziam a tela pular.
- Quadro "Estado" (Conexão · Transporte · Perfil ativo · Hefesto) — **vira a faixa no topo de cada card**; deixa de sumir com um controle só.
- Bateria da mesa (barra + número) — **vira a bateria de cada card**, que já existe.
- Card por controle (título, subtítulo, transporte em português) — **fica**, com a borda na cor do plástico.
- Quadradinho de cor ao lado do título — **fica**, fundido na borda: era desenhado duas vezes (card e painel "No jogo").
- 16 glifos, analógicos, L2/R2, touchpad, giroscópio — **ficam**.
- Bloco Microfone (slicer + Silenciar/Ativar + Liberar) — **fica**; o botão de mudo vira ícone e o valor passa a gravar por controle.
- Bloco Alto-falante (slicer + Silenciar/Ativar + Liberar) — **fica**, e o "Liberar" ganha pai no card de um controle.
- Seletor "Sons do jogo / Todo o som do PC" — **fica em todos os cards** (hoje só existe com um controle) e passa a mostrar a rota viva.
- "Ouvir no controle" — **fica**, dentro do card.
- Linha de contexto da "No jogo" (modo + máscara + "o perfil deste jogo pedia X") — **fica**, na faixa do card.
- Aviso amarelo do perfil que não entrou — **fica**, na faixa. Não confundir com o aviso "2 perfis nunca vão entrar", que é da aba Perfis (`D-O-AVISO-DE-PORQUE-O-PERFIL-NAO-ENTRA`).
- Recados sem gamepad virtual (Conexão Nativa · Controlar o PC · "o jogo ainda não vê este controle") — **ficam**, os dois primeiros uma vez só para a mesa, o terceiro dentro do card de quem sofre.
- Atalho para "Reconciliar jogadores" no recado — **fica** como link para a aba Jogar, onde o botão mora.
- Regra "a aba só aparece com jogo da Steam aberto" — **sai**: com a fusão não há aba para entrar e sair, e o produto não é só Steam.
- Título repetido do painel "No jogo" (`titulo_do_painel`) — **sai**: é o mesmo card, um título só.
- Banners de vpad degradado e de "jogo sem wrapper" — **ficam**, com dono único da frase, dentro do card do controle afetado quando o fato é de uma peça.
- "Linha da verdade" (`controller_card.py:2825`, calculada 10x por segundo e nunca empacotada) — **sai**: é decisão dela de 17/08 e hoje é CPU sem tela.
- Ligar/Desligar o microfone no sistema (vinha da Emulação) — **vai para Conexões**; aqui fica só o volume e o mudo do aparelho.

**O que ainda falta decidir**

1. **A calibração de sensores mora aqui?** `D-CALIBRAR-SENSORES-NO-NATIVO` mandou fazer funcionar no Modo Nativo e escrever a spec, mas não disse em que aba fica o botão. O giroscópio e o acelerômetro são lidos nesta tela — pergunta: *o "Calibrar sensores" fica no card do controle, ou na aba Conexões junto do exame?*
2. **O botão de microfone do controle deve mudar o mudo do computador inteiro ou só o do controle?** O campo existe no perfil e o daemon já o aplica, sem nenhuma tela que o escreva (`profiles/schema.py:451`, `ProfileMicConfig.button_toggles_system`). Pergunta: *entra como caixa no bloco Microfone deste card, ou fica fora do produto?*
3. **O card troca os 16 quadradinhos pelo desenho do DualSense?** O SVG existe desde 11/08 com 32 ids nomeados e cinco cores de plástico, e nenhuma linha da janela o abre (`assets/control-svg/dualsense.svg`). `D-O-SVG-VIBRA-POR-LADO` já o adotou para a Vibração. Pergunta: *aqui também, ou os quadradinhos ficam porque cabem melhor com quatro controles na mesa?*
4. **Histórico de bateria.** O diário grava carga por controle desde sempre e ninguém lê na janela (`daemon/battery_journal.py:214`), e o aviso de bateria baixa está escrito e nunca é chamado (`integrations/desktop_notifications.py:272`). Pergunta: *o card ganha "ver o histórico" e o aviso antes de o controle morrer, ou isso fica fora desta leva?*

---

### 3. Gatilhos

*Quanta força o gatilho faz na mão — a resistência do L2 e do R2, que é o que faz o DualSense ser DualSense.*

**O que muda**

- **A aba não escolhe mais o controle, e nunca escolheu: quem escolhe é a fita do topo.** Hoje já é assim (todo gesto daqui lê o alvo da fita) e continua — nenhum seletor de peça nasce dentro da aba (D-A-FITA-E-O-UNICO-ALVO).
- **Os gatilhos podem chegar prontos, sem ninguém abrir esta aba.** Se o perfil ativo usa um Estilo de Jogo, o gatilho vem dele — FPS já nasce com metralhadora nos dois lados. A aba passa a dizer isso no topo (*"Estes gatilhos vêm do Estilo FPS"*) com um botão para sair do estilo e mexer à mão, porque estilo de fábrica não se edita (D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL, D-CATORZE-ESTILOS-DE-FABRICA).
- **A frase que explica o modo sai da tela e vira a dica de cada um dos 19 botões.** Ganha-se ler o que "Galope" faz **antes** de clicar — hoje a explicação só aparece depois do clique, e o clique já mexeu no aparelho (D-TUDO-QUE-EXPLICA-VIRA-DICA).
- **Os dois "Aplicar em L2/R2" viram um só, e ele muda de sentido.** Eles reenviam o que a prévia já mandou 300 ms antes; quem decide o que vale agora e o que fica gravado é o rodapé — Aplicar vale agora e não grava, Salvar Perfil grava (D-APLICAR-NAO-SALVA). O botão que sobra na aba serve para o caso real: reenviar depois de o controle reconectar, já que o gatilho não tem leitura de volta.
- **A tela para de pular.** A caixa de ajustes ganha altura fixa e a linha "Efeito pronto" ocupa o lugar dela sem brotar — hoje ela nasce escondida, aparece em 2 dos 19 modos, e nos modos "Desligado" e "Pulso" sobram ~110 px de nada.
- **O efeito passa a ter nome.** Quem montou uma curva boa guarda com nome e reusa; hoje o perfil grava só os dez números e a aba reabre em "Personalizar", sem dizer de onde vieram.
- **(sem palavra dela ainda)** Uma linha de aviso quando **outro programa** está mandando gatilho pela porta DSX — é a explicação que falta quando o gatilho muda sozinho. Pergunta no fim.

**Os botões e controles**

| Botão | O que faz | Vem de onde |
| --- | --- | --- |
| Fita "Ajustes vão para: Todos · Controle 1 · Controle 2" | Diz a qual controle o gatilho vai | existe hoje (cabeçalho, montada pela aba Controles) |
| Aviso "Estes gatilhos vêm do Estilo FPS" + **Personalizar** | Conta que o perfil ativo usa um estilo de fábrica, e solta para editar à mão | NOVO (D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL) |
| Grade de 19 modos — coluna L2 | Escolhe o tipo de resistência do gatilho esquerdo: Desligado, Rígido, Rígido simples, Pulso, Pulso (curva A), Pulso (curva B), Resistência, Arco de flecha, Galope, Arma semi-automática, Arma automática, Metralhadora, Ponto duro, Disparo, Vibração, Rampa de força, Curva de força, Vibração por posição, Montar do zero | existe hoje |
| Grade de 19 modos — coluna R2 | O mesmo, no gatilho direito | existe hoje |
| **Efeito pronto:** (lista, uma por coluna) | Preenche as dez posições de uma vez: Rampa crescente, Rampa decrescente, Plateau central, Stop hard, Stop macio… | existe hoje |
| **Meus efeitos** (na mesma lista, abaixo dos prontos) | Reusa uma curva que ela mesma montou e nomeou | existe no código e nunca teve tela (`profiles/curva_propria.py:259`, `CatalogoCurvasProprias`) |
| **Guardar este efeito com um nome** | Grava a curva que está na tela, com nome e a nota de quem sentiu no controle | existe no código e nunca teve tela (`profiles/curva_propria.py:97`) |
| Barras de ajuste do modo (73 ao todo, cada modo mostra as suas) | Força, frequência, posição de início e fim, intensidade — conforme o modo escolhido | existe hoje |
| **Desligar** (uma por coluna) | Tira a resistência daquele gatilho e solta a trava manual, devolvendo-o ao perfil | existe hoje |
| **Mandar de novo para o controle** | Reenvia os dois gatilhos como estão na tela — para depois de reconectar | NOVO, no lugar de "Aplicar em L2" + "Aplicar em R2" |
| **?** do quadro | Guarda a explicação do que é gatilho adaptativo e a ressalva de que o controle não responde de volta | NOVO |
| Rodapé: **Aplicar · Salvar Perfil · Importar · Exportar** | Aplicar vale agora e não grava; Salvar Perfil aplica e grava | vem do rodapé (D-APLICAR-NAO-SALVA) |

**O que fica na tela e o que vira dica**

A aba já é a mais enxuta da janela: **15 textos fixos** (a Conexões tem 88). Ficam visíveis os dois títulos de coluna ("Gatilho esquerdo (L2)" / "(R2)"), os rótulos "Modo:" e "Efeito pronto:", os 19 nomes de modo, os rótulos das barras com o número à direita, e o recibo no rodapé ("Gatilho esquerdo (L2): Metralhadora — aplicado" / o erro de parâmetro em português).

Vira dica: a frase em itálico que descreve o modo escolhido (passa a ser a dica de cada botão de modo, lida **antes** do clique) e a ressalva de que a tela diz "o Hefesto escreveu", nunca "o controle obedeceu" — não existe canal de leitura de gatilho no protocolo.

**Nada se perdeu**

- Grade de 19 modos no L2 — **fica**, igual.
- Grade de 19 modos no R2 — **fica**, igual.
- "Efeito pronto" no L2 e no R2 — **fica**, e passa a guardar o nome da curva escolhida.
- As 73 barras de ajuste dos 19 modos — **ficam** todas, com os mesmos limites.
- "Aplicar em L2" e "Aplicar em R2" — **viram um só** ("Mandar de novo"); o que valia como "agora vai" passa ao Aplicar do rodapé, e a aplicação ao vivo continua acontecendo como hoje.
- "Desligar" no L2 e no R2 — **ficam**, um por coluna (é o antídoto e o que solta a trava manual).
- Frase em itálico com a descrição do modo — **muda de lugar**: vira a dica dos 19 botões.
- Números e limites das barras (0–9, 0–8, 0–255) — **ficam**, vindos do perfil como hoje.
- Recibo do desfecho no rodapé, com o erro traduzido — **fica**.
- A aba não mostrar qual controle nem qual perfil está em jogo — **fica assim**: quem diz é a fita e o crachá do cabeçalho (D-A-FITA-E-O-UNICO-ALVO).
- O vazio de ~110 px nos modos sem barra — **sai**: altura fixa na caixa de ajustes.
- "Efeito pronto" nascendo sempre em "Personalizar" — **sai**: o nome passa a ser guardado.

**O que ainda falta decidir**

1. **Ler um modo custa aplicá-lo na sua mão.** Todo clique num dos 19 botões manda o efeito ao controle 300 ms depois — mover uma barra também, e escolher um efeito pronto também. Quer um jeito de **ver o que o modo faz sem que ele vá para o gatilho** (por exemplo, só a dica, e o envio só no "Mandar de novo")? Ou o toque ao vivo é justamente a graça, e fica como está?
2. **Copiar um lado no outro.** Hoje são 38 botões e nada liga o L2 ao R2 — quem quer os dois iguais configura duas vezes. Entra um "Usar o mesmo no outro gatilho"?
3. **A linha do "outro programa está mandando gatilho".** O daemon aceita comandos de gatilho e cor de qualquer programa local pela porta DSX (`daemon/udp_server.py:1`) e nenhuma tela conta isso. Vale mostrar aqui quem está falando?
4. **O desenho do DualSense nesta aba.** O SVG com os 32 pontos nomeados existe desde 11/08 e nenhuma tela o abre (`assets/control-svg/dualsense.svg`). Mostrar o controle com L2 e R2 acendendo enquanto ela puxa, com a borda na cor do plástico (D-A-BORDA-E-A-IDENTIDADE-DA-PECA), ou isso é da aba Controles e aqui ficaria repetido?

---

### 4. Iluminação

*Que cor é a minha, e qual número eu sou na mesa.*

**O que muda**

- **O painel do desenho das cinco luzinhas sai inteiro** — os quatro botões de jogador, o "Todas acesas/apagadas", o "Aplicar o desenho" e as cinco caixas ocultas por trás deles. Ela chamou a seção de "absolutamente inútil": o daemon já acende o desenho do número sozinho, e o co-op sobrescreve por cima. (D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR)
- **No lugar dele entra a escolha do número do controle**, que hoje é uma faixa que *brota* no cabeçalho e empurra a tira de abas para baixo. Aqui ela tem espaço fixo e nada pula. (D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR)
- **Dois DualSense nunca ficam com a mesma cor.** Se ela pintar o segundo igual ao primeiro, o produto desloca para o tom vizinho e **diz na tela o que fez** — não é um aviso que some no rodapé. (D-DUAS-PECAS-NUNCA-TEM-A-MESMA-COR, D-CADA-JOGADOR-NAVEGA-COM-O-SEU)
- **A prévia deixa de ser um retângulo e passa a ser o controle desenhado**, na cor do plástico daquela peça, com a barra de luz acesa na cor escolhida. O desenho está no repositório desde 11/08 e nenhuma linha da janela nunca o abriu. (D-A-BORDA-E-A-IDENTIDADE-DA-PECA)
- **A borda é a identidade, o interior é o estado**: a borda grossa tem sempre a cor do plástico; o preenchimento lilás só diz "esta é a peça selecionada agora". (D-A-BORDA-E-A-IDENTIDADE-DA-PECA)
- **"Voltar ao automático" vira um botão só**, que obedece a fita: com um controle escolhido volta aquele, com "Todos" volta a mesa. Hoje são dois botões e o segundo ignora a fita calado. (D-A-FITA-E-O-UNICO-ALVO)
- **Uma linha nova diz de onde veio a cor** quando ela não a escolheu à mão: "Esta cor veio do Estilo de Jogo *Terror*". (D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL, D-CATORZE-ESTILOS-DE-FABRICA)
- **O aviso do estado da barra passa a bater com as outras abas** — Modo Nativo, disputa com a Steam, barra apagada: o mesmo fato, a mesma frase, na Iluminação, em Controles e em Conexões. (D-AS-ABAS-CONVERSAM)
- **Quase todo texto vira dica.** (D-TUDO-QUE-EXPLICA-VIRA-DICA)

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| **Cor** (quadradinho que abre a paleta) | Escolhe a cor da barra de luz do controle da fita; ao confirmar, já acende. | existe hoje |
| **Luminosidade (%)** | Quanto a barra acende; vai ao controle ao soltar. | existe hoje |
| **Cores automáticas por controle** (caixa) | Cada controle ganha a cor do seu número, sem ela escolher nada. Vale para a mesa inteira, e a dica diz isso. | existe hoje |
| **Voltar ao automático** | Tira a cor escolhida à mão e devolve a automática — do controle da fita, ou de todos se a fita estiver em "Todos". | existe hoje (funde os dois botões de hoje) |
| **Apagar** | Apaga a barra de luz do controle escolhido. | existe hoje |
| **Reenviar ao controle** | Manda de novo cor e brilho — para depois de reconectar o controle. Não salva nada; quem grava é o "Salvar Perfil" do rodapé. | existe hoje (o "Aplicar no controle", com nome que não se confunde com o rodapé) |
| **Número deste controle: 1 2 3 4 …** | Faz do controle escolhido o jogador N — o do cabeçalho, o dos cards e o das cinco luzinhas do plástico. Os outros deslizam para abrir lugar. | vem do cabeçalho (a faixa que hoje brota e some) |
| **Ver a cor do plástico / Corrigir** | Diz de que cor é o plástico desta peça, quando o aparelho não respondeu (o rádio recusa a leitura). | vem da aba Conexões (hoje Configurações) — é o que alimenta a borda |
| **"?"** ao lado de cada quadro | Guarda a explicação que hoje ocupa a tela. | NOVO |
| **Desenho do P1 / P2 / P3 / P4 · Todas acesas · Todas apagadas · Aplicar o desenho** | — | **SAEM** |

**O que fica na tela e o que vira dica**

A aba tem **13 textos fixos** hoje — já é a mais enxuta da janela. Ficam visíveis: os títulos dos dois quadros, os rótulos dos botões e os três valores (a cor, o número do brilho, o número do jogador), mais o aviso do estado da barra **quando há algo errado** (silêncio quando está tudo bem). Vão para o "?" ou para a dica: o parágrafo que explica as cores automáticas, a ressalva do "Todos", e os dois recados que hoje só existem no rodapé — o aviso D4 (aplicar em "Todos" desligava as cores automáticas em silêncio) vira **linha na própria seção**, porque é consequência de um clique dela, não explicação.

**Nada se perdeu**

- **Cores automáticas por controle** — fica, igual, e a dica passa a dizer que vale para a mesa inteira.
- **Quadradinho de cor (paleta)** — fica.
- **Aplicar no controle** — fica, com o nome "Reenviar ao controle", para não competir com o [Aplicar] do rodapé (que é um dos quatro "Aplicar" da janela hoje).
- **Apagar** — fica.
- **Voltar ao automático** — fica, e **absorve** o "Voltar todos ao automático": um botão só, obedecendo a fita.
- **Voltar todos ao automático** — sai como botão separado, vira o comportamento do acima com a fita em "Todos".
- **Luminosidade (%)** — fica.
- **Prévia (retângulo colorido)** — fica, virando o **desenho do controle** na cor do plástico com a barra acesa (`assets/control-svg/dualsense.svg`, hoje com zero consumidores em `src/`).
- **Quadradinho do botão de paleta (cor sem brilho)** — fica.
- **Número ao lado da barra de brilho** — fica.
- **Frase "Desenho que mandamos: …"** — **vai para a nova seção do número**, virando "as luzinhas mostram o número N — por sua escolha / pelo co-op / automático". É a única linha que conta quando o co-op sobrescreveu.
- **Aviso do estado da barra** (Modo Nativo, disputa da Steam, fonte desconhecida, apagada) — fica, e passa a ser a mesma frase que Controles e Conexões mostram.
- **Desenho do P1 · P2 · P3 · P4** — **saem**: o daemon já acende o desenho do número sozinho e o co-op manda por cima; quem quer trocar o desenho troca o **número**, ali do lado. Sai junto o defeito L12 (clicar "Desenho do P2" com a fita em "Todos" mandava o mesmo desenho para os quatro controles).
- **Todas acesas / Todas apagadas** — **saem** pelo mesmo motivo; eram atalho de bancada, não desenho de jogador.
- **Aplicar o desenho** — **sai** com os botões que alimentava.
- **LED 1..5 (as cinco caixas ocultas)** — **saem**, mas só depois de o estado do desenho mudar de lugar: elas são hoje **o único armazenamento do desenho na GUI** (`gui/main.glade:1478-1482`, lido por `lightbar_actions.py:1466`). Apagar antes disso faz o produto gravar "tudo apagado" no perfil dela.
- **`on_player_led_toggled`** (handler registrado sem ninguém que o chame, `lightbar_actions.py:1383`) — **sai** junto, sem perda: já não roda desde 22/07.
- **Desenho para o 5º ao 8º controle** — não se perde e não precisa de botão: a tabela do produto já cobre 1..8 (`core/led_control.py:122`), e agora o caminho é escolher o número.

**O que ainda falta decidir**

1. **Quantos números a seção mostra?** O cabeçalho hoje oferece 1 a 4, o card da aba Conexões oferece 1 a 5, e a tabela do produto cobre 1 a 8.
2. **O "Apagar" guarda a cor ou grava preto?** A dica promete "a cor continua guardada" e o código grava preto no perfil (`lightbar_actions.py:1023`). São duas promessas vivas; qual é a certa?
3. **O número do jogador continua também no card da aba Conexões?** As duas telas passam a mostrar o mesmo fato — e a regra dela é que informação repetida tem de estar em sincronia (D-AS-ABAS-CONVERSAM). Fica nas duas, sincronizado, ou só aqui?
4. **Na colisão de cor, quem desloca?** A decisão diz que "o segundo desloca para o tom vizinho" — falta dizer o que é o tom vizinho (a próxima cor da paleta de jogador?) e se ela pode recusar o deslocamento e ficar com as duas iguais mesmo assim.

---

### 5. Vibração

*Quanto o controle treme — e quem manda nisso agora: o jogo, um estilo de jogo, ou você.*

**O que muda**

- **A aba deixa de se chamar "Rumble".** Nome em português, como todas as outras (D-AS-DEZ-ABAS-E-SEUS-NOMES).
- **O desenho do DualSense entra no lugar dos números soltos, e ele treme de verdade:** metade esquerda acende quando o motor leve vibra, metade direita quando o pesado vibra, na cor do plástico daquele controle. As duas metades já existem no arquivo (`assets/control-svg/dualsense.svg:203` e `:208`) e nenhuma tela nunca as abriu (D-O-SVG-VIBRA-POR-LADO).
- **A borda do desenho tem a cor do plástico**, sempre — é como você sabe de quem é a vibração que está vendo, com dois controles na mesa (D-A-BORDA-E-A-IDENTIDADE-DA-PECA).
- **Quem escolhe o controle é a fita do topo, e só ela.** A aba não ganha nenhum seletor de alvo próprio (D-A-FITA-E-O-UNICO-ALVO). Isso obriga a resolver a divergência confessada de hoje (RUM-1): clicar num dos quatro presets grava no controle escolhido mas manda o comando para a máquina inteira. Ou a força passa a ter endereço, ou a tela diz com todas as letras que aquele ajuste é da mesa.
- **Os quatro botões viram uma escolha de verdade** — hoje são quatro interruptores independentes que ficam todos apagados quando você mexe na barra, e a palavra "personalizado" não existe em lugar nenhum da tela. Passa a haver cinco estados visíveis: Economia · Balanceado · Máximo · Auto · Personalizado.
- **A barra para de disparar um comando por pixel.** Hoje arrastar de 100 a 200 emite dezenas de chamadas bloqueantes e dezenas de avisos seguidos; passa a valer ao soltar, como já é a Luminosidade da Iluminação.
- **A linha "Estado da vibração" fica viva.** Hoje ela só se atualiza ao entrar na aba — quem fica parado olhando vê "o jogo ainda não pediu vibração nenhuma" congelado enquanto joga.
- **O Estilo de Jogo já chega com a vibração escolhida** (FPS com vibração no máximo, por exemplo). Quem usa um estilo não precisa passar por aqui (D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL, D-CATORZE-ESTILOS-DE-FABRICA).
- **Aplicar não salva.** O "Aplicar" da própria aba some: quem aplica agora é o [Aplicar] do rodapé, e quem grava é o [Salvar Perfil] (D-APLICAR-NAO-SALVA).
- **A aba diz quando a vibração está travada por outro motivo** — no Modo Nativo o daemon recusa e diz por quê, e o "Bateria longa" da aba Conexões põe teto na força (é a única linha daquela tabela com teto real, `secao_orcamento.py:208`).

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| Economia | Vibração a 30% do que o jogo pede | existe hoje |
| Balanceado | Vibração como o jogo pediu (100%) | existe hoje |
| Máximo | Vibração 50% mais forte (150%) | existe hoje |
| Auto | O Hefesto escolhe pela bateria (100/70/30%) e nunca amplifica | existe hoje |
| Personalizado | Mostra que a barra saiu dos quatro degraus — hoje esse estado existe e é invisível | NOVO (rótulo; o estado já existe) |
| Barra "Força da vibração" (0–200) | Multiplica o que o jogo pede; aplica ao SOLTAR | existe hoje (era "Intensidade global"; ganha o soltar-para-aplicar) |
| Barra "Motor leve" (0–255) | Força do tremor fino, para testar e travar | existe hoje |
| Barra "Motor forte" (0–255) | Força do tremor grosso, para testar e travar | existe hoje |
| Testar por 500 ms | Faz o controle escolhido tremer meio segundo; os dois lados do desenho acendem | existe hoje |
| Travar nesta vibração | Trava o controle nos dois valores acima; o jogo perde a mão (era "Aplicar") | existe hoje, renomeado |
| Deixar o jogo controlar | Devolve a vibração ao jogo — o antídoto do "Parar" | existe hoje |
| Parar | Parada de emergência: silêncio até você devolver ao jogo. Continua sendo o último da fileira | existe hoje |
| Desenho do controle com os dois lados acendendo | Mostra qual motor está vibrando, na cor do plástico | existe no código e nunca teve tela (`assets/control-svg/dualsense.svg:203` e `:208`; zero uso em `src/`) |
| [Aplicar] [Salvar Perfil] [Importar] [Exportar] | O rodapé, igual em todas as abas | vem do rodapé |

**O que fica na tela e o que vira dica**

Hoje a aba tem **26 textos fixos** para 11 controles. Ficam visíveis: o título de cada quadro, os cinco rótulos de política, os três rótulos de barra com o número ao lado, os quatro rótulos de botão, e as duas linhas de estado (o que está travado, e o que o jogo está pedindo agora). Todo o resto — o parágrafo que explica o Auto, o custo de bateria do Máximo, a diferença entre motor leve e forte, o aviso de que a força é da mesa e não da peça — vai para o "?" do quadro ou para a dica do próprio widget (D-TUDO-QUE-EXPLICA-VIRA-DICA). Sobram cerca de **10 textos** na tela.

**Nada se perdeu**

- Economia / Balanceado / Máximo / Auto — **ficam**, agora como escolha única com um quinto estado nomeado.
- Parágrafo explicativo do Auto (que hoje brota ao marcar) — **fica**, mas como dica: para de empurrar a tela para baixo.
- Intensidade global (0–200) — **fica** como "Força da vibração", aplicando ao soltar.
- Vibração leve / Vibração forte (0–255) — **ficam** como "Motor leve" / "Motor forte", e agora se veem no desenho.
- Testar por 500 ms — **fica**.
- Aplicar (trava os dois motores) — **fica**, renomeado "Travar nesta vibração", para não competir com o [Aplicar] do rodapé (que hoje são quatro "Aplicar" na mesma janela).
- Deixar o jogo controlar a vibração — **fica**.
- Parar — **fica**, e continua sendo o último da fileira, de propósito.
- Linha "Estado da vibração" (verde/laranja, com os números crus do daemon) — **fica**, e passa a se atualizar sozinha.
- Segunda metade da linha, os pedidos do jogo (as sete frases da "ordem da verdade", incluindo a recusa no Modo Nativo) — **fica**.
- Aviso ciana da divergência RUM-1 — **sai se o defeito for consertado**; enquanto não for, fica, porque é a única confissão de que o ajuste vai para a mesa inteira.
- Escopo misto (metade de cima por controle, metade de baixo global) — **não é feature, é defeito**: a tela passa a dizer, em cada quadro, se aquilo é do controle escolhido ou da mesa.

**O que ainda falta decidir**

1. **A força da vibração passa a ter endereço?** Hoje não existe comando de intensidade por controle — só da máquina inteira. Ou o daemon ganha esse comando, ou o quadro de política sai do alcance da fita e diz "vale para todos". Qual dos dois?
2. **Motor leve/forte continuam globais?** Eles nunca entram em ajuste por controle, por desenho. Com dois jogadores na mesa, isso é o que você quer, ou cada controle deve ter os seus?
3. **A vibração dos catorze Estilos de Jogo:** só a política (Economia/Balanceado/Máximo/Auto), ou também os dois motores travados? A proposta aprovada no chat fixa "rumble máximo" para FPS, mas não diz se trava motor.

---

### 6. Navegação

*Quando o controle não está jogando — ou quando o jogo só entende mouse e teclado —, o que cada botão faz no PC? E que gestos o controle tem para trocar de perfil, de modo e de ponte sem largar o controle?*

**O que muda**

- **A área que ensina os gestos vem da Emulação para cá — e aqui ela deixa de ser só cartaz.** Os quatro combos aparecem desenhados no SVG do DualSense, acendem quando você aperta de verdade, e você troca o que cada um faz na mesma tela (D-A-AREA-QUE-ENSINA-VAI-PARA-A-NAVEGACAO). Aprender e configurar deixam de ser duas telas.
- **O PS+R3 finalmente aparece.** Ele existe e funciona desde 19/08 e só um comentário de código o conhecia (D-O-PS-R3-CHEGA-A-TELA). É a roda que troca a ponte com o jogo no meio da partida, e ela ganha um quinto degrau: Teclado+Mouse, o último recurso quando nenhum modo de gamepad serviu (D-O-QUINTO-DEGRAU-DA-RODA).
- **O "Buffer: 150" vira dica** ("apertar os dois em até 0,15 s conta como combo") e **o "Passthrough em emulação" sai** — é decisão travada de propósito, não ajuste (D-O-PS-R3-CHEGA-A-TELA).
- **O estilo Point-and-click se define aqui.** O perfil escolhe usá-lo, o PS+R3 chega nele ao vivo, mas *o que ele faz* é escrito nesta aba (D-O-ESTILO-APONTA-PARA-O-MODO).
- **O ambiente "Navegador" sai do seletor de perfil por causa desta aba.** Quem quer o controle como mouse liga aqui, dentro do perfil ativo — não é um ambiente onde o perfil vale, é um ajuste do perfil (D-NAVEGADOR-SAI-DO-SELETOR).
- **"Emular teclado" passa a morar no perfil**, como o mouse vizinho já mora. Hoje dois interruptores lado a lado guardam em lugares opostos e nada na tela conta isso (D-AS-ABAS-CONVERSAM).
- **A fita do topo continua apagada aqui, mas com o motivo certo**: "não se aplica" (o PC tem um cursor e um foco de teclado só), não "ainda não ligamos o leitor" (D-A-FITA-E-O-UNICO-ALVO).
- **A metade vazia da aba acaba.** Hoje 35% a 45% da altura é branco; a área que ensina ocupa o vão.

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| **Emular mouse** (interruptor) | Liga o controle como mouse do PC — cursor, cliques e rolagem | existe hoje |
| **Velocidade do cursor** (barra) | Quão rápido o cursor anda no analógico esquerdo | existe hoje |
| **Velocidade da rolagem** (barra) | Quão rápido a página rola no analógico direito | existe hoje |
| **Emular teclado** (interruptor) | Liga o que o controle digita: atalhos, teclado na tela e as regiões do touchpad | existe hoje — passa a gravar no perfil (`profiles/schema.py:979` `teclado_emulado` + `:1300` `resolver_teclado_emulado`, escritos, testados e sem nenhum caminho de ativação) |
| **Lista de atalhos** (Botão do controle → Tecla) | Duplo clique na segunda coluna troca a tecla; aceita nome humano ("Alt + Tab") | existe hoje |
| **Adicionar** | Cria linha para o próximo botão sem tecla, começando em "Espaço" | existe hoje |
| **Remover** | Apaga a linha selecionada | existe hoje |
| **Voltar ao padrão** | Devolve todos os atalhos aos de fábrica — agora perguntando antes | existe hoje (hoje não pergunta) |
| **Mapeamento** (8 pares: X/L2 → botão esquerdo, △/R2 → direito, R3 → meio, ○ → Enter, □ → Esc, D-pad → setas, analógicos → cursor e rolagem) | Mostra o que o controle faz de mouse — e passa a avisar quando um atalho de teclado disputa o mesmo botão | existe hoje como texto fixo (`gui/main.glade:3861`), vira tabela viva |
| **PS + Options** — no SVG, acendendo | Suspende mouse e teclado enquanto ela joga; e você troca o que o combo faz | vem da aba Emulação (quadro dos combos) |
| **PS + ↑ / PS + ↓** — no SVG, acendendo | Próximo perfil / perfil anterior; reconfiguráveis | vem da aba Emulação |
| **PS + R3** — no SVG, acendendo | Sobe um degrau na roda de pontes: DualSense do Hefesto → Xbox 360 → Conexão Nativa (Sony) → DualSense + Steam Input → **Teclado+Mouse** | existe no código e nunca teve tela (`integrations/hotkey_daemon.py:142`; a escada em `integrations/ponte_escada.py:253`, o quinto degrau é o `KIND_DESKTOP` que ficou de fora) |
| **Toque curto no PS** — no SVG | Abre/foca a Steam; segurar mais de 0,7 s é outro gesto (religar o controle) | existe no código e nunca teve tela (`daemon/subsystems/hotkey.py:38`, teto em `hotkey_daemon.py:154`) |
| **Suspender mouse e teclado** | O mesmo que o PS + Options, pelo clique | vem da aba Emulação |
| **Sair do modo jogo** | Devolve mouse e teclado ao controle — a saída de emergência de quem caiu no modo jogo pelo combo | vem da aba Emulação |
| **Configurar o estilo Point-and-click** | Diz como esse estilo se comporta: o que cada botão faz quando ele está valendo | NOVO (D-O-ESTILO-APONTA-PARA-O-MODO) |
| Desenho do DualSense com os botões acendendo | O SVG com 32 ids nomeados e as cinco cores de plástico, pronto desde 11/08 e sem nenhum widget que o carregue | existe no código e nunca teve tela (`assets/control-svg/dualsense.svg`) |

**O que fica na tela e o que vira dica**

Hoje a aba tem **37 textos fixos para 8 widgets** — quase cinco frases por widget — e ainda herda o parágrafo de ajuda do quadro de combos da Emulação.

**Fica:** os dois títulos de coluna ("O controle como mouse", "O controle como teclado"), os rótulos dos quatro botões, o número de cada barra, a linha de estado do mouse virtual (verde/laranja/vermelho, que é estado e não explicação), a tabela de atalhos, os oito pares do Mapeamento, e os quatro combos desenhados com o nome do que cada um faz.

**Vira dica ("?" ou hover):** o parágrafo em itálico do uinput/udev; a frase "Sem tecla (não digitam nada) — 10 deles já são do mouse"; a instrução de instalar `wvkbd-mobintl`/`onboard` (o *estado* "não há teclado na tela" fica, a receita vira dica); o valor do buffer de 0,15 s; o porquê de cada degrau da roda de pontes; e as ~840 caracteres de ajuda que hoje dominam o meio da aba Emulação. Sobram cerca de doze textos visíveis (D-TUDO-QUE-EXPLICA-VIRA-DICA).

**Nada se perdeu**

- Emular mouse (interruptor) — **fica**.
- Velocidade do cursor — **fica**.
- Velocidade da rolagem — **fica**.
- Emular teclado (interruptor) — **fica**, e passa a guardar no perfil, como o mouse.
- Lista de atalhos com edição por duplo clique — **fica**.
- Adicionar / Remover / Voltar ao padrão — **ficam**; o "Voltar ao padrão" ganha confirmação.
- Linha de estado do mouse virtual (verde/vermelho/laranja, com o defeito nomeado) — **fica**.
- Frase "Sem tecla (não digitam nada)" + contagem "10 deles já são do mouse" — **vira dica** do rodapé da tabela.
- Frase "Guardados, sem linha na lista" (as três regiões do touchpad) — **fica**, até a decisão abaixo; é o único aviso de que o perfil guarda algo que a tela não mostra.
- Frase "Neste computador: …" sobre o teclado na tela — **o estado fica, a receita de instalação vira dica**.
- Cartão "Mapeamento" (8 pares) — **fica**, e deixa de mentir: passa a saber da tabela de atalhos ao lado (hoje dar uma tecla ao X faz o botão fazer as duas coisas em silêncio).
- Itálico "Útil para navegar o desktop… requer uinput e udev" — **vira dica**.
- Fita "Ajustes vão para" esmaecida — **fica esmaecida**, com o motivo trocado para "não se aplica".
- As três ações do teclado só mexerem no rascunho, com toast no pretérito — **sai o mal-entendido**: [Aplicar] vale agora, [Salvar Perfil] grava (D-APLICAR-NAO-SALVA), e a tela diz qual dos dois falta.
- As duas barras mudarem de destino conforme o mouse esteja ligado ou desligado — **sai a ambiguidade**: mesmo gesto, mesma promessa, dita na tela.
- O vão de 35–45% embaixo — **sai**: é onde a área que ensina passa a morar.

**O que ainda falta decidir**

1. **As três regiões do touchpad ganham linha na tabela?** Hoje o perfil as guarda e o daemon não as dispara (`_combine_with_touchpad` se cala, porque o touchpad é ponteiro do sistema), e a decisão de 09/08 foi não listar botão que não dispara. A pergunta: o daemon passa a disparar e elas ganham linha, ou continuam só na frase?
2. **"Suspender mouse e teclado" e "Sair do modo jogo" vêm mesmo para a Navegação?** A D-A-EMULACAO-MORRE nomeia destino para todo o resto da aba e não nomeia estes dois; são gestos de mouse e teclado, então o lugar natural é aqui — confirmar.
3. **Onde fica o botão de despausar?** O `daemon.pause` persiste em disco e renasce pausado no boot, e nenhuma tela chama `daemon.resume` — o texto que a Jogar mostra manda usar "PS + Options ou a aba Emulação", e as duas saídas são falsas (a Emulação nem existe mais). O gesto de sair da pausa é desta aba, ou da Jogar?
4. **Quais combos ela pode reconfigurar, e para quais ações?** O PS+R3 é a roda e o PS+Options é o modo jogo — travar esses dois e liberar só o PS+↑/↓, ou abrir todos com uma lista curta de ações permitidas?
5. **Cada jogador navegar a interface do Hefesto com o próprio controle** (D-CADA-JOGADOR-NAVEGA-COM-O-SEU) nasce sempre ligado, ou é um interruptor desta aba?
6. **Que campos o estilo Point-and-click expõe** — só o mapa de botões e as duas velocidades, ou também gatilho, luz e vibração?

---

### 7. Sistema

*A aba do "o Hefesto está bem?" — é onde se liga, desliga, examina e conserta o Hefesto na sua máquina, e onde estão os gestos raros e perigosos.*

**O que muda**

- **Absorve o diagnóstico da Emulação** — UINPUT, Device, Código do fabricante e Controles detectados são estado da máquina, não ajuste de jogo; vêm inteiros para cá, junto com "Testar o controle virtual" (que cria e destrói um gamepad virtual só para ver se o sistema deixa — é autoteste de instalação) e com o "Atualizar" (D-A-EMULACAO-MORRE).
- **Um "Atualizar" só.** Hoje há um aqui e outro na Emulação relendo coisas que se sobrepõem. Fica um, que repinta a aba toda.
- **Ligar/Desligar passa a ter um dono só.** Hoje o botão da Início e os daqui fazem o mesmo por caminhos diferentes, e o da Início, quando falha, manda a pessoa "tentar pela aba Sistema". Passam a chamar o mesmo código e a mostrar o mesmo estado, por construção (D-AS-ABAS-CONVERSAM).
- **Nasce "Retomar" (sair da pausa).** Hoje o Hefesto pausa, a pausa fica gravada em disco, ele renasce pausado no boot — e a única forma de despausar é digitar um comando no terminal. Pior: a frase da Início ensina duas saídas que não existem. É o pior estado morto do produto.
- **"Restaurar de fábrica" muda-se para cá**, vindo do rodapé ("Voltar ao padrão"). Gesto raro e perigoso mora na Sistema (D-APLICAR-NAO-SALVA).
- **A fileira "Avançado" deixa de ser uma fileira.** Cinco botões lado a lado somavam 1230 px numa janela que abre com 1180 e sem barra de rolagem horizontal — dívida de layout medida em 26/08. Viram lista vertical com rótulo curto e explicação na dica (D-TUDO-QUE-EXPLICA-VIRA-DICA).
- **O cartão "Saúde do sistema" encolhe na tela e cresce na dica.** Cada linha fica com o selo ([OK]/[WARN]/[INFO]) e o veredito curto; o "o que eu vi / por que importa / o que fazer" vai para o "?" (D-TUDO-QUE-EXPLICA-VIRA-DICA).
- **A fita do topo continua apagada aqui, e o motivo continua sendo "não se aplica"** — nada nesta aba é por controle; todo gesto é da máquina ou de um jogo (D-A-FITA-E-O-UNICO-ALVO).

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| Ligar junto com o computador (interruptor) | O Hefesto sobe sozinho quando o PC liga | existe hoje |
| Ligar o Hefesto | Liga agora | existe hoje |
| Desligar o Hefesto | Desliga agora | existe hoje (funde com o botão da Jogar) |
| Reiniciar o Hefesto | Desliga e liga — resolve a maioria dos travamentos | existe hoje |
| Retomar (sair da pausa) | Tira o Hefesto da pausa; hoje só o terminal faz isso, e a pausa sobrevive ao boot | existe no código e nunca teve tela — `daemon/ipc_server.py:121`, `daemon/lifecycle.py:1011` |
| Corrigir modo de execução | O Hefesto está rodando improvisado: mata o avulso e sobe pelo caminho certo | existe hoje (só aparece nesse estado) |
| Atualizar | Relê tudo que a aba mostra, sem mexer em nada | existe hoje + **funde** com o "Atualizar" da Emulação |
| Testar o controle virtual | Cria um gamepad virtual por um instante e diz se o sistema deixou | vem da aba Emulação |
| Ver detalhes | Joga as últimas 80 linhas do registro técnico no painel de baixo | existe hoje |
| Deixar tudo pronto | Ajusta de uma vez o que costuma brigar com os controles; pede permissão antes de fechar a Steam | existe hoje |
| Consertar problemas conhecidos | Sem senha e sem fechar nada: arruma áudio do controle, Steam Input e o que mais for automático | existe hoje + ganha motor: `integrations/prontuario_dos_jogos.py:885` (`curar_o_que_e_automatico`, **sem nenhum chamador hoje**) |
| Este jogo não funciona | Marca o último jogo aberto para ele ver só os controles do Hefesto | existe hoje |
| Copiar opções para os jogos | Copia a linha de inicialização para colar em Propriedades | existe hoje |
| Aplicar aos jogos da Steam | Põe a linha em todos os jogos instalados, com cópia de segurança | existe hoje |
| Fixar a versão que funciona | Trava o Proton validado — e agora **diz o motivo em português** quando não dá | existe hoje + `integrations/proton_pin.py:184` (`steam_root_ou_recusa`, escrita e nunca chamada) |
| Tirar o que faz engasgar | Acha a sobreposição que picota o jogo, mostra e só então tira | existe hoje |
| Restaurar de fábrica | Devolve o perfil de fábrica, com confirmação | vem do rodapé ("Voltar ao padrão") |
| Ver os plugins carregados / Recarregar | Lista os plugins do daemon e relê | existe no código e nunca teve tela — `daemon/ipc_server.py:184-185` |
| Painel "Detalhes técnicos" | A saída crua, de onde ela copia para relatar um problema | existe hoje |

**Linhas de estado (só leitura):** O Hefesto está: … · Trocar de perfil ao abrir o jogo: … · Gamepad virtual (UINPUT) · Device · Código do fabricante (VID:PID) · Controles detectados · cartão Saúde do sistema (6 a 8 linhas) · **Como o Hefesto enxerga a janela** (novo — `app/actions/ambiente_na_tela.py:76`, lê as chaves certas do estado e só falta o rótulo na tela).

**O que fica na tela e o que vira dica**

Hoje a Sistema tem **25 textos fixos para 15 widgets**, e a Emulação traz mais um punhado junto com o quadro de diagnóstico. Fica visível: o **título de cada quadro** (O Hefesto · Saúde do sistema · Gamepad virtual · Preparar os jogos · Avançado · Detalhes técnicos), o **rótulo de cada botão**, e o **valor de cada linha de estado** (com a cor e o glifo, que mudam juntos para quem não distingue verde de laranja).

Vai para o "?" ou para a dica: o parágrafo de ajuda de cada botão, o "o que eu vi / por que importa / o que fazer" das linhas de saúde (a de Steam Input chega a 311 caracteres com dois jogos citados), os dez motivos traduzidos da linha "Trocar de perfil ao abrir o jogo", e a explicação do que é o modo improvisado.

**Atenção de quem for desenhar:** a foto `readme_sistema.png` **não mostra dado real** — as quatro linhas curtas de saúde e o log são inventados no script de captura, por privacidade (o painel já vazou um MAC uma vez). A tela real tem de seis a oito linhas, muito mais longas. Desenhar em cima da foto subdimensiona o cartão em mais do dobro.

**Nada se perdeu**

*Da aba Sistema (fica tudo):*
- Ligar junto com o computador — **fica**.
- Ligar / Desligar / Reiniciar o Hefesto — **ficam**, e passam a ser o dono único do gesto (a Jogar chama o mesmo código).
- Atualizar — **fica** (um só, fundido com o da Emulação).
- Ver detalhes — **fica**.
- Corrigir modo de execução — **fica**, ainda escondido até o estado acontecer.
- Deixar tudo pronto — **fica**.
- Este jogo não funciona — **fica** (a mesma marca continua aparecendo na aba Perfis; ver "falta decidir").
- Consertar problemas conhecidos — **fica**, e ganha o motor que já existia sem chamador.
- Copiar opções para os jogos / Aplicar aos jogos da Steam / Fixar a versão que funciona / Tirar o que faz engasgar — **ficam**, em lista vertical em vez de fileira que não cabe.
- Painel Detalhes técnicos — **fica**.
- Cartão Saúde do sistema, as duas linhas extras (vigia do Steam Input morto, ponte divergente), a linha "Trocar de perfil ao abrir o jogo", os recibos no rodapé — **ficam**.

*Da aba Emulação:*
- UINPUT / Device / Código do fabricante / Controles detectados — **vêm para cá**, no quadro "Gamepad virtual" (D-A-EMULACAO-MORRE).
- Testar o controle virtual — **vem para cá**.
- Atualizar — **vem para cá e funde** com o que já existia.
- Desligado / DualSense (PS) / Xbox 360 — **vão para a Jogar**: são os mesmos três botões de modo da Início, chamando o mesmo código, com vocabulário diferente. A escolha da máscara ganha ainda o **Automático** (D-A-MASCARA-GANHA-O-AUTOMATICO).
- Gamepad para os jogos — **vai para a Jogar e para os Perfis**: é a máscara, e já está lá.
- Suspender mouse e teclado / Sair do modo jogo — **vão para a Navegação**, junto do gesto que os liga (D-A-AREA-QUE-ENSINA-VAI-PARA-A-NAVEGACAO).
- Quadro dos combos (PS+Options, PS+↑, PS+↓) — **vai para a Navegação**, virando a área que ensina, com o SVG acendendo e o PS+R3 finalmente na tela (D-O-PS-R3-CHEGA-A-TELA).
- Buffer: 150 — **vira dica em português** na área que ensina, na Navegação ("apertar os dois em até 0,15 s conta como combo").
- Passthrough em emulação — **sai**: é decisão travada de propósito, não ajuste, e hoje é um número exibido que gesto nenhum edita (D-O-PS-R3-CHEGA-A-TELA).
- Verificar (Steam Input) — **sai como botão**: mede exatamente o que a linha de Steam Input do cartão de saúde daqui já mede, e essa nomeia os jogos.
- Desligar Steam Input — **sai como botão**: já é metade do que o "Consertar problemas conhecidos" faz aqui, e ela mandou o vigia do Steam Input sair da tela (D-A-EMULACAO-MORRE).
- Ligar / Desligar o Microfone do DualSense — **vão para a Conexões** (o modo do microfone, decisão dela: "Aqui poderia ir pra lá inclusive"); o volume e o mudo por controle ficam na Controles, e o mudo manda na luz vermelha do plástico (D-A-ABA-DO-AMBIENTE-CHAMA-SE-CONEXOES, D-O-BOTAO-DO-MIC-MANDA-NA-LUZ).
- Próximo / Anterior (texto dos combos) — **vão para a Navegação** junto com o quadro.
- O parágrafo de ajuda de ~840 caracteres que dominava o meio da aba — **sai da tela e vira dica** (D-TUDO-QUE-EXPLICA-VIRA-DICA).

**O que ainda falta decidir**

1. **Os cinco botões de Steam ficam na Sistema ou vão para a Lançadores?** "Deixar tudo pronto", "Copiar opções", "Aplicar aos jogos da Steam", "Fixar a versão que funciona" e "Este jogo não funciona" são todos sobre *de onde o jogo vem*, que é a definição da aba nova — e a interface já diz "Steam" 689 vezes para um produto que é universal (D-A-ABA-LANCADORES, D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM). Pergunta exata: **a Sistema é "a saúde do Hefesto" e a Lançadores é "a saúde dos jogos", ou a Sistema continua guardando as duas?**
2. **Nas linhas do cartão de saúde, o "o que fazer" fica na tela ou vira dica?** A regra nova manda toda explicação para o "?"; a regra desta casa diz que toda frase de diagnóstico tem de dizer o quê, por quê e o que fazer. Pergunta exata: **numa linha [WARN], o conserto aparece na tela ou só no hover?**
3. **"Este jogo não funciona" e a caixinha "Esconder os controles físicos" da aba Perfis marcam o mesmo arquivo.** Ficam os dois caminhos (um por jogo aberto, outro por perfil), ou um deles sai?
4. **O aviso de bateria fraca tem interruptor, e ele não tem tela.** As duas funções de notificação estão escritas e testadas e ninguém as chama (`integrations/desktop_notifications.py:272`). Pergunta exata: **o interruptor "avisar quando a bateria estiver acabando" mora aqui, na Sistema?**
5. **A porta DSX (127.0.0.1:6969) aceita gatilho e cor de qualquer programa local, e nenhuma tela conta isso** (`daemon/udp_server.py`). É a explicação que falta quando o gatilho muda sozinho. Pergunta exata: **entra uma linha "outro programa está mandando efeito pelo canal DSX" no diagnóstico, ou isso fica invisível?**
6. **Plugins na tela: sim ou não?** Hoje só o terminal alcança. É informação de bancada — pode ficar dentro do painel "Detalhes técnicos" em vez de virar quadro próprio.

---

### 8. Conexões

*Responde: "por que o controle no rádio engasga aqui, e o que eu faço para a minha máquina ficar igual à dela?" — é a aba do ambiente: adaptadores, portas, vizinhança do rádio, exame e conserto.*

**O que muda**

- **A aba muda de nome e ganha um dono claro.** "Configurações" era um saco de coisas; agora é o ambiente — ensinar e garantir que a máquina de quem instalou funcione como a dela (`D-A-ABA-DO-AMBIENTE-CHAMA-SE-CONEXOES`).
- **O modo do microfone chega aqui**, vindo da Emulação: ligar/desligar o microfone do DualSense para o computador. O **volume e o mudo** ficam na aba Controles — aqui é *se o microfone existe para esta máquina*, lá é *quanto ele capta agora* (`D-A-EMULACAO-MORRE`, `D-A-ABA-DO-AMBIENTE-CHAMA-SE-CONEXOES`).
- **A seção "A janela" sai** (tamanho do texto, ambiente do desktop, e o espelho morto "Ligar junto com o computador"). Nada disso é ambiente de execução do controle; vai para Sistema, que é a aba da máquina (`D-AS-DEZ-ABAS-E-SEUS-NOMES`).
- **O card de controle encolhe para o que é declaração e rádio**: cor do plástico, microfone pelo rádio, derrubar do rádio, e os campos do controle externo. Bateria, entradas ao vivo e glifos ficam **só na aba Controles** — hoje o mesmo card existe em três abas (`D-AS-ABAS-CONVERSAM`).
- **A escolha do número de jogador sai daqui.** Vira leitura; quem escolhe é a Iluminação, que passa a ter a seção fixa dos jogadores (`D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR`, `D-A-FITA-E-O-UNICO-ALVO` — não se duplica escolha).
- **Dois botões de reexaminar viram um.** "Examinar de novo" e "Reexaminar a mesa" releem a mesma coisa (`D-TUDO-QUE-EXPLICA-VIRA-DICA`, menos verbosidade).
- **A borda com a cor do plástico deixa de ser exclusividade desta aba.** `tom_para_a_borda` já existe e só esta aba chama; vira regra de toda a interface — borda = qual peça é, interior = se está selecionada (`D-A-BORDA-E-A-IDENTIDADE-DA-PECA`).
- **As duas contas do rádio viram uma.** Hoje a barra "Rádio em uso" e o texto do Desempenho medem as mesmas 1.600 fatias por dois módulos diferentes, uma abaixo da outra (`D-AS-ABAS-CONVERSAM`).
- **O preço do microfone no rádio aparece na conta**: 276,7 fatias por controle com microfone contra 260,4 sem — quatro controles no rádio comem 1.107 das 1.600. É o que ela pediu ao decidir "ligado sempre, com a tela dizendo o preço" (decisão `D-O-MIC-LIGADO-VALE-NO-RADIO`, 25/08).
- **A aba passa a caber na tela.** Hoje mede 2.465 px numa janela que abre com 1.080 — tudo de "Conexões" para baixo nasce abaixo da dobra, e três features já foram cortadas por isso. Com "A janela" fora e o card reduzido, elas voltam.

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| Examinar de novo | Refaz o exame da mesa (portas, energia, rádio) e repinta o selo, as linhas e as ordens de serviço | existe hoje (absorve o "Reexaminar a mesa") |
| Ver | Mostra as ordens que ela mandou calar | existe hoje |
| Já movi — reexaminar | Ela diz que mexeu no cabo; o exame compara o antes e o depois | existe hoje |
| Ignorar | Cala aquele conselho naquele arranjo de cabos | existe hoje |
| Mover para a entrada N | A ordem de serviço diz **o que mover para onde** e o que se ganha, não só o juízo | existe no código e nunca teve tela — `integrations/arranjo_da_mesa.py:877` (`receita`), `:1063` (`consequencias`) |
| Cor: (busca das cores de fábrica) | Declara a cor do plástico. **NOTA DATADA 29/08/2026:** são 21 HOJE e o dado conhece 28 — o número não é requisito, e fechá-lo é a `ONDA-CONEXOES-12`. E o parêntese "(rádio)" caducou: medido em 29/08, o aparelho não responde por CABO nenhum tampouco, porque o produto não pergunta pela porta certa | existe hoje |
| Corrigir (na linha Cor) | Discorda da cor que o aparelho respondeu pelo cabo | existe hoje |
| Diga a cor (campo livre) | Escreve a cor com as palavras dela quando nada da lista serve | existe hoje |
| A luz não acende | Derruba o controle do rádio para ela apertar PS e a barra voltar a obedecer | existe hoje |
| Cancelar | Desiste de esperar o PS | existe hoje |
| Microfone (pelo rádio) | Traz o microfone daquele controle pelo Bluetooth, como no PS5 | existe hoje |
| Microfone do DualSense: Ligar / Desligar | Libera ou cala o microfone do controle para o computador inteiro | vem da aba Emulação |
| O que é o botão do mic muda: só o controle ou o PC inteiro | Decide se o botão físico muda o mudo do computador ou só o do controle | existe no código e nunca teve tela — `profiles/schema.py:451` (`button_toggles_system`), `app/draft_config.py:222` |
| Modo: (controle externo) | Mostra em que modo o 8BitDo/Pro foi ligado — só leitura, a troca é física | existe hoje |
| Botões: Xbox / Nintendo / Não sei | Qual desenho de botão a tela mostra para aquele controle | existe hoje |
| Nome (por adaptador) | Batiza o adaptador Bluetooth — "Sala", "Extra" | existe hoje |
| Desenhar a minha mesa | Desenha o gabinete e numera as entradas; "Onde está" passa a dizer "Entrada 9" | existe hoje |
| Ensinar as minhas entradas | Um toque por aparelho e o Hefesto aprende em que entrada cada um está | existe hoje |
| O dongle fica acima da cabeça? Sim / Não / Não sei | Ela responde o que nenhum sistema mede | existe hoje |
| Tem gente entre o dongle e o sofá? Sim / Não / Não sei | Idem, para a linha de visada | existe hoje |
| O que é: Wi-Fi / Teclado / Mouse / Webcam / Caixa de som / Outro / Não sei | Ela nomeia o rádio vizinho que o kernel não sabe nomear | existe hoje |
| Corrigir (coluna "O que é") | Reabre a pergunta numa linha já respondida | existe hoje |
| Tudo ligado / Bateria longa / Eu escolho | Perfil de desempenho da mesa: o que fica ligado e quanto do rádio isso ocupa | existe hoje |
| ? (um por título e por linha que explica) | Guarda a explicação inteira no hover | existe hoje, agora padronizado |

**O que fica na tela e o que vira dica**

Hoje são **88 textos fixos para 28 widgets** — a aba mais verbosa do produto, três vezes a média.

Fica visível: o **título das quatro seções** (Está tudo certo? · Os controles · Conexões · Desempenho), o **selo do exame** com glifo e cor, o **carimbo de idade** ("Há 3 minutos"), as **cinco linhas do exame** com o estado de cada uma, o **imperativo** de cada ordem de serviço e o **ganho esperado**, o **rótulo de cada botão**, e o **valor de cada célula** das duas tabelas.

Vai para o "?": as linhas "o que eu vi" e "por que importa" de cada ordem de serviço, o parágrafo de alcance do Desempenho, a explicação de cada pergunta de rádio, e o `QUANDO_VALE` — que hoje já vive só no hover e por isso ninguém sabe qual gesto grava quando (`D-TUDO-QUE-EXPLICA-VIRA-DICA`).

**Nada se perdeu**

- Examinar de novo — **fica**.
- Selo do exame, carimbo de idade, cinco linhas — **ficam**.
- Cards "O que fazer" (ordem de serviço) — **ficam**, e ganham a receita "mova daqui para ali".
- Ver / Já movi — reexaminar / Ignorar — **ficam**.
- Cor lida do aparelho + selo + borda com o tom do plástico — **fica**, e a regra da borda vale agora em toda a interface.
- Cor: busca das cores de fábrica · Corrigir · campo livre — **ficam**. (São 21
  hoje contra 28 no dado; ver a `ONDA-CONEXOES-12`. O número aqui descreve o
  hoje e **não é requisito de desenho**.)
- "A luz não acende" e "Cancelar" — **ficam**.
- Microfone pelo rádio (opt-in por controle) — **fica**.
- Jogador: 1 2 3 4 5 — **vai para a Iluminação**, que passa a ser o lugar único de escolher o jogador; aqui o número vira leitura.
- Modo: (externo, só leitura) — **fica**.
- Botões: Xbox / Nintendo / Não sei — **fica**.
- Anel roxo de "selecionado" vindo da fita — **fica**, e continua explícito: a fita não ajusta nada aqui, mas marca de quem é o card.
- Bateria, entradas ao vivo, glifos do card — **vão para a aba Controles** (o card daqui fica só com declaração e rádio).
- Tabela de adaptadores (Nome · Adaptador · Onde está) — **fica**.
- Desenhar a minha mesa / Ensinar as minhas entradas — **ficam**; a calibração ganha a peneira que impede o confirmar de virar pulo no jogo aberto (`app/widgets/calibrar_entradas.py:399`, `botoes_para_o_jogo`, hoje sem chamador).
- As duas perguntas de rádio (altura do dongle, gente no caminho) — **ficam**.
- Tabela dos rádios vizinhos + "O que é" + Corrigir — **ficam**; o "Outro" volta a abrir campo de texto, que foi cortado pela falta de altura.
- Barras "Rádio em uso" por adaptador — **ficam**, com **uma** conta só.
- Reexaminar a mesa — **funde** com "Examinar de novo".
- Desempenho (Tudo ligado / Bateria longa / Eu escolho) — **fica**, com o preço do microfone no rádio na conta.
- As quatro linhas "Ainda não tem por onde ser limitado" (Gatilhos, Barra de luz, Microfone por rádio, Giroscópio) — **saem da tabela**: quatro quintos de uma tabela dizendo que não fazem nada. Só Vibração tem teto real.
- Tamanho do texto — **vai para Sistema**, e leva junto o defeito de só valer na próxima abertura.
- Ambiente: COSMIC / GNOME / Outro — **vai para Sistema**.
- "Ligar junto com o computador" (rótulo espelho) — **sai**: é um estado onde nada pode agir, e o interruptor de verdade está na Sistema.
- Os "?" soltos ao lado de Cor: e de "Outros rádios" — **ficam**, e viram o padrão de toda explicação da aba.

**O que ainda falta decidir**

1. **Onde as declarações desta aba gravam, agora que "Aplicar" não salva nada?** Hoje cor, microfone, perguntas de rádio, tipo dos vizinhos e perfil de Desempenho só chegam ao disco pelo "Aplicar" do rodapé — e a `D-APLICAR-NAO-SALVA` diz que ele passa a aplicar sem gravar. Proposta: **gravam na hora, com recibo "Guardado."**, porque são fatos da sala e não ajuste de perfil — e aí o `integrations/lugar_declarado.py:95` (`declarar_a_mesa`) resolve de quebra o "O Hefesto está desligado, não gravei o que você declarou". Precisa da palavra dela.
2. **Dois controles do mesmo plástico ficam com a borda idêntica.** A regra "duas peças nunca com a mesma cor" é da lightbar; a cor do plástico é física e não pode deslocar. Como se distinguem dois Midnight Black na tela?
3. **"A janela" vai mesmo para Sistema?** Tamanho do texto e ambiente do desktop não são ambiente de execução do controle, mas também não são diagnóstico de máquina — é o único conteúdo desta aba sem dono óbvio no desenho novo.
4. **A receita do arranjo continua travada na `D-QUAL-REGUA-MANDA-NO-ARRANJO`**, que é palavra dela: qual régua manda quando o juízo por entrada e a receita discordam.

---

### 9. Perfis

*Onde ela responde "que ajustes valem em qual jogo, e por que este perfil entrou (ou não)".*

**O que muda**

- **Nasce um aviso no topo: "2 perfis nunca vão entrar — veja quais"**, que clica e mostra quem está atropelando quem. O detector já existe e nomeia catch-all vencendo perfil de jogo, prioridade fora da faixa e empates — só falava por terminal (D-O-AVISO-DE-PORQUE-O-PERFIL-NAO-ENTRA).
- **"Aplica a" vira "Funciona em qual ambiente?" com CINCO opções**: Todos · Steam · Estilo de Jogo · Jogo · Jogo da Steam. Saem Editor e Terminal, e sai Navegador — quem quer o controle como mouse liga isso na aba Navegação do perfil, que é ajuste do perfil e não ambiente onde ele vale (D-APLICA-A-VIRA-AMBIENTE, D-NAVEGADOR-SAI-DO-SELETOR).
- **O Modo avançado some da interface inteiro**, e com ele os três campos crus (`window_class`, `title_regex`, `process_name`). O motor continua usando-os por baixo — quem os preenche agora é o campo do jogo e o botão de detectar (D-APLICA-A-VIRA-AMBIENTE).
- **"Jogo" passa a ser o caminho principal e a Steam vira atalho**, com um botão novo: **Detectar o jogo que está aberto**. Abre o jogo de onde for — Heroic, Lutris, Flatpak, emulador —, volta e clica, e o perfil nasce pronto (D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM).
- **Estilo de Jogo entra como ambiente e como preset universal**: escolhe FPS e o perfil já vem com gatilho, luz, vibração, som, sensores e máscara resolvidos, em vez de configurar aba por aba. São catorze de fábrica mais o Personalizado, e os de fábrica não se editam. O campo de escolher o jogo aparece aqui também (D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL, D-CATORZE-ESTILOS-DE-FABRICA).
- **A máscara ganha "Automático", e é ela que fica ligada** — o produto decide Xbox ou DualSense por jogo, lendo o que o executável sabe ler, em vez de ela escolher no escuro (D-A-MASCARA-GANHA-O-AUTOMATICO).
- **Um perfil "Universal" toma o lugar de `fallback` e `meu_perfil`** na lista: dois nomes a menos, e o controle nunca fica sem nada quando nenhum perfil casa (D-O-PERFIL-UNIVERSAL).
- **Modo e máscara aparecem aqui e na Jogar, e passam a conversar** — mudou num, mudou no outro, sem duas verdades na mesma janela (D-AS-ABAS-CONVERSAM).
- **Point-and-click se escolhe aqui e se define na Navegação**: o perfil diz "use este estilo"; o que cada botão faz é ajustado lá (D-O-ESTILO-APONTA-PARA-O-MODO).

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| Aviso "N perfis nunca vão entrar — veja quais" | Mostra quem está atropelando quem, e por quê | existe no código e nunca teve tela (`profiles/sanidade.py:358`) |
| Lista "Perfis salvos" (Nome · Prioridade · Quando usar) | Clica e abre o perfil no editor; o ativo em verde e em primeiro | existe hoje |
| Novo | Perfil em branco — já com a regra do jogo aberto agora, seja ele da Steam ou não | existe hoje (só sabia da Steam) |
| Duplicar | Copia o perfil inteiro para o editor, com "(cópia)" no nome | existe hoje |
| Remover | Apaga do disco, perguntando antes | existe hoje |
| Ativar | Passa a usar aquele perfil agora, em todas as abas | existe hoje |
| Voltar à versão de ontem | Desfaz um perfil salvo por engano — cada gravação já guarda a anterior | existe no código e nunca teve tela (`profiles/loader.py:1224` e `:1464`) |
| Recarregar | Relê a lista do disco (e não descarta o que está no editor — a dica passa a dizer a verdade) | existe hoje, dica corrigida (`gui/main.glade:2143`) |
| Nome | O nome do perfil | existe hoje |
| Prioridade | Quem ganha quando dois perfis poderiam entrar | existe hoje |
| Funciona em qual ambiente? — Todos · Steam · Estilo de Jogo · Jogo · Jogo da Steam | Diz quando este perfil entra sozinho | vem do "Aplica a", com cinco opções |
| Nome do jogo | Aceita o nome (sugere os instalados), o endereço da loja ou o número | existe hoje — agora também no Estilo de Jogo |
| Detectar o jogo que está aberto | Pega o jogo que está rodando atrás da janela e monta a regra | NOVO |
| Estilo de Jogo (14 + Personalizado) | Pré-aplica um perfil inteiro; o Personalizado usa o que ela ajustou nas outras abas | NOVO — herda os seis perfis de gênero |
| Modo que este perfil liga | Não mexer · Controlar o PC · Jogar pelo Hefesto · Conexão Nativa (Sony) | existe hoje |
| O jogo vê o controle como: Automático · DualSense · Xbox 360 | Desenho dos botões e o que o jogo recebe de giro/touch; o Automático decide por jogo | existe hoje + Automático NOVO (`integrations/api_de_entrada.py`, hoje sem consumidor em `app/`) |
| Esconder os controles físicos neste jogo | Para jogo que enxerga controle dobrado | existe hoje |
| Tirar (por jogo, em "Outros jogos marcados") | Devolve aquele jogo ao normal | existe hoje |
| Salvar este perfil | Grava no disco o perfil aberto no editor | existe hoje |

**O que fica na tela e o que vira dica**

Hoje a aba tem **30 textos fixos**. Ficam visíveis: os títulos dos quadros, o rótulo de cada botão, e os valores — nome, prioridade, ambiente escolhido, jogo, a lista com a coluna "Quando usar", a linha verde do perfil ativo, o carimbo "Este jogo já sabe por onde entra" e a contagem "Outros jogos marcados: N". Vão para o "?" ou para a dica: a explicação de cada ambiente, a disputa inteira com a ordem do desempate (já é dica hoje), o texto em itálico do Steam Input, e a diferença entre gravar agora e gravar ao salvar (D-TUDO-QUE-EXPLICA-VIRA-DICA).

**Nada se perdeu**

- Lista de perfis salvos, com nome e prioridade — **fica**.
- Linha verde/negrito/primeiro lugar do perfil ativo — **fica**.
- Coluna "Quando usar" com a disputa ("Sempre — 4 disputam, vence Pragmata") — **fica**, e ganha o aviso do topo como irmão.
- Dica da linha com a disputa inteira — **fica**, como dica.
- Novo · Duplicar · Remover · Ativar — **ficam** (o Novo passa a servir a qualquer loja, não só à Steam).
- Recarregar — **fica**, com a dica corrigida: ele nunca descartou o que está no editor.
- Modo avançado (interruptor) — **sai**: o seletor de ambiente cobre tudo o que ele servia (D-APLICA-A-VIRA-AMBIENTE).
- `window_class:` / `title_regex:` / `process_name:` — **saem da tela**; continuam no motor, preenchidos pelo campo do jogo e pelo Detectar.
- Nome · Prioridade — **ficam**.
- "Aplica a: Qualquer" — **fica como "Todos"**.
- "Aplica a: Steam" — **fica**, agora como atalho de quem tem Steam.
- "Aplica a: Navegador" — **sai**: quem quer o controle como mouse liga na aba Navegação (D-NAVEGADOR-SAI-DO-SELETOR).
- "Aplica a: Editor" — **sai** (D-APLICA-A-VIRA-AMBIENTE).
- "Aplica a: Terminal" — **não está na lista nova**; ver "falta decidir".
- "Aplica a: Jogo" e "Jogo da Steam" — **ficam**, com o "Jogo" promovido a caminho principal.
- Campo "Nome do jogo" (nome, endereço colado, número, sugestão do catálogo `.acf`/`.desktop`) — **fica**, e aparece também no Estilo de Jogo.
- "Esconder os controles físicos neste jogo" + "Outros jogos marcados" + "Tirar" — **ficam**.
- Carimbo "Este jogo já sabe por onde entra" — **fica**.
- "Modo (o que este perfil liga ao ativar)" — **fica**, em sincronia com a aba Jogar.
- "O jogo vê o controle como" — **fica**, com Automático de fábrica.
- "Salvar este perfil" — **fica** (a convivência com o "Salvar Perfil" do rodapé está em aberto).
- Os seis perfis de gênero em disco (Ação, Aventura, Corrida, Esportes, FPS, point_and_click) — **mudam de lugar**: viram Estilo de Jogo e deixam de ser perfil próprio.
- `fallback.json` e `meu_perfil.json` — **viram o Universal**.
- `navegacao.json` — **fica** (manter e renomear, D-PERFIL-NAVEGACAO): sai o *ambiente* Navegador, não o perfil.
- "Voltar ao padrão" do rodapé, que restaurava o `meu_perfil` — **sai do rodapé** e vira **Exportar**; restaurar de fábrica muda para a aba Sistema (D-APLICAR-NAO-SALVA).
- "Por que este perfil não entrou agora" (`profiles/porque_nao_entrou.py`) — **continua onde está**: no painel da "No jogo", que funde com a aba Controles. É outra pergunta que a do topo daqui ("nunca vai entrar", estrutural).
- A fita esmaecida nesta aba — **fica esmaecida**: quem escolhe o alvo é a fita, e aqui não se escolhe alvo (D-A-FITA-E-O-UNICO-ALVO). Mas ver "falta decidir": o Salvar daqui grava ajuste por controle sem mostrar isso.

**O que ainda falta decidir**

1. **"Terminal" sai junto com "Editor"?** A lista nova não o traz, e a decisão escreveu o motivo só do Editor.
2. **Ficam dois "Salvar" na mesma janela** — o "Salvar este perfil" do editor e o "Salvar Perfil" do rodapé — ou o do editor sai? Eles já miraram arquivos diferentes no mesmo instante.
3. **O editor mostra quatro coisas e salva vinte** (cor, gatilhos, vibração, mouse, teclado, mic, giro e os ajustes por controle vindos das outras abas). Ele passa a mostrar um resumo do que está gravando?
4. **Os ajustes por controle que o perfil guarda** aparecem aqui como estado (quais controles têm ajuste próprio), ou continuam sendo gravados calados?
5. **Duplicar um Estilo de Jogo de fábrica** vira um Personalizado editável, ou os catorze são só escolha e ponto?
6. **"Esconder os controles físicos" grava na hora e todo o resto espera o Salvar.** Os dois tempos ficam, com aviso na tela, ou o gesto passa a esperar o Salvar como os outros?
7. **Perfis em nono lugar na tira** contraria o que ela descobriu hoje — que o perfil é quem manda. Ela decide vendo o mockup (ressalva registrada em D-AS-DEZ-ABAS-E-SEUS-NOMES).
8. **Máscara por jogador** (um em Xbox, outro em DualSense na mesma mesa): a função que separa isso existe (`daemon/subsystems/external_mask.py:642`) e o Automático decide para a mesa inteira. Fica assim?

---

### 10. Lançadores

*De onde os seus jogos vêm — Steam, Heroic, Lutris, Epic, GOG, Flatpak, RetroArch, Dolphin, mGBA — e se o controle chega lá.*

**O que muda**

- **A aba muda de assunto inteiro.** A antiga era "emulação de *gamepad*" (uinput): termo técnico que ninguém entende, e cujo conteúdo se espalhou para os donos certos. A nova é sobre emuladores de console e lançadores de jogo (D-A-EMULACAO-MORRE, D-A-ABA-LANCADORES).
- **Ela detecta, diz e conserta.** Para cada lançador instalado: o que é, se o controle chega lá, o que impede, e o botão que arruma o que dá para arrumar sozinho (D-A-ABA-LANCADORES).
- **O produto para de parecer "só Steam".** O motor já é universal (casa por `process_name` e `window_class`), mas a interface diz "Steam" 689 vezes. É aqui que o jogo de fora da Steam ganha porta de entrada, com o botão de detectar o jogo aberto (D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM).
- **Lacuna medida que a aba existe para fechar:** o produto tem **zero** menção a RetroArch, Dolphin ou mGBA no código, e o jogo Orpheus dela depende de um emulador nativo de GBC. Heroic e Lutris só aparecem em *comentário* de código (`daemon/subsystems/hotkey.py:56`, `daemon/lifecycle.py:2250`), nunca na tela.
- **Nenhum modo de controle se escolhe aqui.** Os três botões "Desligado / DualSense (PS) / Xbox 360" chamavam o mesmo `apply_mode` da Início — duplicação confessada no próprio código. Modo e máscara moram na Jogar e nos Perfis; a máscara ainda ganha o **Automático** (D-A-MASCARA-GANHA-O-AUTOMATICO).
- **O quadro dos combos sai daqui.** Vira a área que ensina, na Navegação, com os quatro atalhos em SVG acendendo de verdade — inclusive o PS+R3, que existe desde 19/08 e nunca chegou à tela (D-A-AREA-QUE-ENSINA-VAI-PARA-A-NAVEGACAO, D-O-PS-R3-CHEGA-A-TELA).
- **O vão some.** Hoje o terço direito e a metade de baixo da aba estão vazios, com um parágrafo de ~840 caracteres dominando o meio. A lista de lançadores ocupa a largura.

**Os botões e controles**

| Botão | O que faz | Vem de onde |
|---|---|---|
| Procurar de novo | Revarre a máquina atrás de lançadores e emuladores instalados e repinta a lista | NOVO (herda o gesto do "Atualizar" da Emulação) |
| Ver o que impede *(por linha)* | Mostra o impedimento com nome: sem wrapper, linha intocável, exceção inerte, ponte divergente, sem executável | existe no código e nunca teve tela — `integrations/prontuario_dos_jogos.py:733` e `:139-143` (hoje só alimenta UMA linha do cartão de saúde, `daemon_actions.py:818`) |
| Consertar *(por linha)* | Aplica a cura que o produto já sabe aplicar sozinho (repõe o `hefesto-launch`, grava a exceção do Steam Input) | existe no código e nunca teve tela — `integrations/prontuario_dos_jogos.py:885` (`curar_o_que_e_automatico`, **sem nenhum chamador em `src/`**) |
| Detectar o jogo que está aberto | Você abre o jogo de onde for, volta aqui e clica: o perfil nasce com a regra certa, sem digitar nada | NOVO (D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM) |
| Criar perfil para este jogo *(por linha)* | Abre a aba Perfis já com o jogo preenchido | NOVO |
| Aplicar o estilo Retrô/Emulador *(na linha de um emulador)* | Põe naquele jogo o estilo de fábrica pensado para emulador | NOVO (D-CATORZE-ESTILOS-DE-FABRICA) |
| Abrir o lançador *(por linha)* | Abre o programa escolhido | NOVO |
| ? *(por linha e por quadro)* | Guarda a explicação no hover | existe hoje (padrão da Conexões) |

**O que a tela mostra sem botão:** um cartão por lançador com o nome, o selo de estado (instalado · não achei · o controle não chega), quantos jogos ele traz, e — quando há — o carimbo "este jogo já sabe por onde entra".

**O que fica na tela e o que vira dica**

A aba de origem tem **33 textos fixos para 12 widgets** — quase três frases por widget, e o pior deles é um parágrafo de ajuda de ~840 caracteres no meio da tela.

Ficam visíveis: o título de cada quadro, o nome de cada lançador, o selo de estado, a contagem de jogos e o rótulo dos botões. Vai tudo para o "?" ou para a dica: o parágrafo de ajuda, a explicação de cada impedimento, o que a cura muda no disco, e o "Buffer: 150" (que vira a dica em português *"apertar os dois em até 0,15 s conta como combo"*, já na Navegação). D-TUDO-QUE-EXPLICA-VIRA-DICA.

**Nada se perdeu** *(uma linha por feature da aba Emulação de hoje)*

- **Testar o controle virtual** — vai para a **Sistema**: cria e destrói um gamepad virtual só para ver se dá, é autoteste de instalação (`emulation_actions.py:1011`).
- **Atualizar** — vai para a **Sistema** (relê estado do daemon); aqui nasce o "Procurar de novo", que é outra coisa: varre lançadores.
- **Desligado / DualSense (PS) / Xbox 360** — **saem**: chamavam o mesmo `apply_mode` da Início, com vocabulário diferente para o mesmo estado. Modo fica na **Jogar**; máscara na **Jogar** e nos **Perfis**, com o Automático novo.
- **Suspender mouse e teclado** — vai para a **Navegação**, na área que ensina, onde o gesto PS+Options passa a ser configurável.
- **Sair do modo jogo** — vai para a **Navegação**, junto com o gesto que leva a ele (é a saída de emergência de quem caiu pelo combo).
- **Verificar (Steam Input)** — **sai**: mede o mesmo que a linha de Steam Input do cartão "Saúde do sistema" da **Sistema**.
- **Desligar Steam Input** — **sai**: é metade do que "Consertar problemas conhecidos" já faz na **Sistema**.
- **Ligar / Desligar Microfone do DualSense** — o **modo** do microfone vai para a **Conexões** (é ambiente: trazer o mic pelo rádio como no PS5); o **volume** e o mudo ficam no card de cada controle, na **Controles**.
- **Controles detectados** *(texto copiável)* — vai para a **Sistema**, com UINPUT, Device e VID:PID: é diagnóstico da máquina.
- **UINPUT (bolinha) / Device / Código do fabricante** — vão para a **Sistema**, mesmo motivo.
- **Gamepad para os jogos** *(Ligado — DualSense / Xbox / Conexão Nativa)* — **sai daqui**: é a máscara, e ela já está na **Jogar** e nos **Perfis**.
- **Próximo / Anterior (PS+↑, PS+↓)** e o quadro "Modo jogo" que os ensina — vão para a **Navegação**, como área que ensina, com SVG acendendo no aperto e com o PS+R3 finalmente na tela.
- **Buffer: 150** — vira **dica em português** na Navegação; deixa de ser número exibido que gesto nenhum edita.
- **Passthrough em emulação** — **sai**: é decisão travada de propósito, não ajuste. Exibi-la ensinava que existe um controle que não existe.
- **Parágrafo de ajuda (~840 caracteres)** — vira **"?"**.
- **A lápide do "Ver daemon.toml"** *(botão já removido, `glade:3350-3378`)* — **sai** com o glade da aba antiga; não volta.

**O que ainda falta decidir**

1. **Os cinco botões de Steam da aba Sistema mudam para cá?** "Deixar tudo pronto", "Copiar opções para os jogos", "Aplicar aos jogos da Steam", "Fixar a versão que funciona" e "Tirar o que faz engasgar" são todos sobre *de onde o jogo vem* — que é a definição desta aba. Ficam na Sistema (que é máquina) ou vêm para a Lançadores (que é origem do jogo)? *Peso a favor de vir:* a fileira "Avançado" da Sistema já não cabe — 1230 px de mínimo numa janela de 1180 px.
2. **A aba lista LANÇADORES ou também os JOGOS de fora da Steam?** Medido: o catálogo de hoje só enxerga Steam — `jogos_locais.py:119` lê apenas `.desktop` com `steam://rungameid/`, e o prontuário lê só `appmanifest_*.acf` e `localconfig.vdf`. Listar jogo de Heroic, Lutris ou Flatpak é trabalho novo de varredura, não é ligar o que existe.
3. **Onde mora "Detectar o jogo que está aberto"** — só aqui, só na aba Perfis (ao lado de "Nome do jogo:"), ou nos dois lugares? Duplicar botão foi o defeito mais caro do desenho antigo.
4. **Qual é a lista da primeira versão, e o que fazer com quem não está instalado?** A decisão nomeia RetroArch, Dolphin, mGBA, Heroic, Lutris, Epic, GOG e Flatpak. Ela confirma essa lista e a ordem? E lançador ausente some da tela ou aparece apagado com um "não achei aqui"?
5. **"O controle chega lá?" — como o produto mede isso por lançador?** Nenhuma linha de código mede hoje. Precisa de spec antes de virar selo na tela, senão vira instrumento que mente — o defeito que esta casa mais paga.

---

## O que o produto já faz e a tela nunca mostrou

Dezoito dos botões novos não são trabalho novo: são features escritas, testadas e sem nenhum caminho de ativação. É a classe de defeito mais cara desta casa — *a casa sabe e o produto não faz*. Cada linha abaixo é uma delas, com o ganho em uma frase.

| O que já existe | Onde está | O ganho | Passa a aparecer em |
|---|---|---|---|
| Sair da pausa | `daemon/ipc_server.py:121`, `daemon/lifecycle.py:1011` | Hoje a pausa persiste em disco, renasce pausada no boot, e só o terminal a desfaz — com a tela ensinando duas saídas falsas | Sistema (Retomar) e/ou Jogar (Continuar) |
| A máscara Automática | `integrations/api_de_entrada.py` (zero consumidores em `app/`) | O produto já sabe quais APIs de entrada o executável do jogo tem, e pode escolher Xbox ou DualSense sem ela adivinhar | Jogar, Perfis |
| Curvas de gatilho com nome | `profiles/curva_propria.py:97` e `:259` | A curva boa que ela montou deixa de se perder num "Personalizar" sem procedência | Gatilhos |
| O desenho do DualSense | `assets/control-svg/dualsense.svg` — 32 ids, cinco cores de plástico, zero uso em `src/` | O desenho mostra num relance o que hoje precisa de parágrafo, checkbox ou quadradinho | Iluminação, Vibração, Navegação (e Controles, em aberto) |
| As duas metades da vibração | `dualsense.svg:203` e `:208` | Vê-se qual motor está tremendo, na cor daquele controle | Vibração |
| PS+R3, a roda de pontes | `integrations/hotkey_daemon.py:142`, `integrations/ponte_escada.py:253` | Troca a ponte com o jogo no meio da partida sem largar o controle — funciona desde 19/08 e só um comentário sabia | Navegação |
| O quinto degrau da roda | `KIND_DESKTOP`, fora da escada | Teclado+Mouse como último recurso quando nenhum modo de gamepad serviu | Navegação, e a linha da ponte na Jogar |
| Toque curto no PS | `daemon/subsystems/hotkey.py:38`, teto em `hotkey_daemon.py:154` | Abre a Steam; segurar 0,7 s é outro gesto — nada disso estava escrito em lugar nenhum | Navegação |
| Teclado emulado no perfil | `profiles/schema.py:979`, `:1300` | O teclado passa a viajar no perfil como o mouse vizinho já viaja | Navegação |
| O botão do mic mudando o PC | `profiles/schema.py:451`, `app/draft_config.py:222` | O daemon já aplica; falta só quem escreva a escolha | Conexões (ou Controles — em aberto) |
| Quem nunca vai entrar | `profiles/sanidade.py:358` | O perfil que nunca ganha a disputa passa a se explicar na tela em vez de no terminal | Perfis |
| A versão anterior de cada perfil | `profiles/loader.py:1224`, `:1464` | Desfaz um Salvar por engano — cada gravação já guarda a anterior | Perfis |
| Os cinco impedimentos com nome | `integrations/prontuario_dos_jogos.py:733`, `:139-143` | "O controle não chega" ganha causa: sem wrapper, linha intocável, exceção inerte, ponte divergente, sem executável | Lançadores |
| A cura automática | `integrations/prontuario_dos_jogos.py:885` — **sem nenhum chamador** | Repõe o `hefesto-launch` e grava a exceção do Steam Input sozinho, sem senha e sem fechar nada | Lançadores, Sistema |
| A receita do arranjo | `integrations/arranjo_da_mesa.py:877`, `:1063` | A ordem de serviço diz *o que mover para onde* e o que se ganha, em vez de só julgar | Conexões |
| Gravar a declaração com o daemon desligado | `integrations/lugar_declarado.py:95` | Acaba o "O Hefesto está desligado, não gravei o que você declarou" | Conexões |
| A peneira da calibração | `app/widgets/calibrar_entradas.py:399` | Confirmar a entrada deixa de virar um pulo dentro do jogo aberto | Conexões |
| O motivo do Proton em português | `integrations/proton_pin.py:184` | A recusa de fixar a versão deixa de ser muda | Sistema |
| Como o Hefesto enxerga a janela | `app/actions/ambiente_na_tela.py:76` | Lê as chaves certas do estado; falta só o rótulo na tela | Sistema |
| Plugins carregados / recarregar | `daemon/ipc_server.py:184-185` | Hoje só o terminal alcança | Sistema (em aberto: quadro próprio ou dentro de Detalhes técnicos) |
| O "Liberar" do alto-falante | `controller_card.py:3577`, nunca empacotado em `:3775` | Existe e é inalcançável justamente com um controle só — a tela mais comum | Controles |
| "Ouvir no controle" | `status_actions.py:1415` | Invisível com exatamente 1 controle, pelo mesmo motivo | Controles |
| A rota de som em vigor | `controller_card.py:3763`, `_speaker_canal_pintando` em `:2388` nunca vira `True` | O seletor nasce sem nada marcado: ninguém sabe por onde o som está saindo | Controles |
| O desenho de 1 a 8 jogadores | `core/led_control.py:122` | A escolha do número não precisa parar no 4 | Iluminação |

**Ainda sem lugar, porque dependem de uma decisão:** o histórico de bateria (`daemon/battery_journal.py:214`) e o aviso antes de o controle morrer (`integrations/desktop_notifications.py:272`); a máscara por jogador (`daemon/subsystems/external_mask.py:642`, contra o `desired_flavor` global de `daemon/subsystems/coop.py:394`); e a porta DSX, que aceita gatilho e cor de qualquer programa local sem nenhuma tela contar (`daemon/udp_server.py`).

---

## O que ainda falta decidir

São **43 perguntas**, e elas não têm o mesmo peso. As onze primeiras aparecem em mais de uma aba — decidir uma vez economiza o trabalho em duas ou três telas. As cinco seguintes fixam contrato que vale para a janela toda. As outras vinte e sete são locais, e cada uma cabe numa frase.

### Aparecem em mais de uma aba

1. **Onde mora "Detectar o jogo que está aberto"** — Jogar, Perfis e Lançadores nomeiam o mesmo botão. Duplicar botão foi o defeito mais caro do desenho antigo.
2. **Onde fica o despausar** — Jogar chama de "Continuar", Sistema de "Retomar", e a Navegação pergunta se o gesto é dela. Um lugar ou dois?
3. **A máscara é da mesa ou de cada jogador** — Jogar e Perfis. O separador existe; o laço do co-op ainda compara contra um valor global.
4. **Os cinco botões de Steam: Sistema ou Lançadores** — a Sistema é "a saúde do Hefesto" e a Lançadores é "a saúde dos jogos", ou a Sistema guarda as duas? Peso a favor de mudar: a fileira "Avançado" já não cabe na janela.
5. **O SVG substitui os 16 quadradinhos** — Controles e Gatilhos perguntam o mesmo. Com quatro controles na mesa, o quadradinho cabe melhor.
6. **O aviso e o histórico de bateria** — Controles quer o histórico no card, Sistema quer o interruptor do aviso. As duas funções estão escritas e nunca são chamadas.
7. **A linha do "outro programa está mandando efeito pelo canal DSX"** — Gatilhos (onde o sintoma aparece) ou Sistema (onde mora o diagnóstico)?
8. **Ligar/Desligar o Hefesto em dois lugares** — sai da Sistema, ou fica lá como manutenção enquanto a Jogar tem o gesto do dia?
9. **"Este jogo não funciona" e "Esconder os controles físicos" marcam o mesmo arquivo** — Sistema por jogo aberto, Perfis por perfil. Ficam os dois caminhos?
10. **O botão do mic mudando o mudo do PC inteiro** — a caixa fica no bloco Microfone da Controles, ou na Conexões junto do modo do microfone?
11. **O número do jogador aparece também no card da Conexões** — Iluminação passa a ser o lugar único de escolher; a Conexões mostra o mesmo número como leitura, ou nem isso?

### Fixam contrato para a janela inteira

12. **Onde as declarações da Conexões gravam, agora que Aplicar não salva** — proposta: gravam na hora, com recibo "Guardado.", porque são fatos da sala e não ajuste de perfil.
13. **Ficam dois "Salvar" na mesma janela** — o do editor de perfil e o do rodapé, que já miraram arquivos diferentes no mesmo instante.
14. **"Esconder os controles físicos" grava na hora e o resto espera o Salvar** — os dois tempos ficam, com aviso, ou o gesto passa a esperar como os outros?
15. **Numa linha [WARN] do cartão de saúde, o "o que fazer" fica na tela ou vira dica?** É o limite exato do padrão P3: a regra desta casa diz que toda frase de diagnóstico tem de dizer o quê, por quê e o que fazer.
16. **Cada jogador navegar a interface com o próprio controle nasce ligado, ou é interruptor?**

### Uma aba só

**Jogar** — 17. card por controle, ou só a contagem e a linha da ponte? · 18. qual é o nome de "Reconciliar jogadores"?
**Controles** — 19. o "Calibrar sensores" fica no card, ou na Conexões junto do exame?
**Gatilhos** — 20. ler um modo tem de custar aplicá-lo na mão dela? · 21. entra um "Usar o mesmo no outro gatilho"?
**Iluminação** — 22. quantos números a seção mostra (4, 5 ou 8)? · 23. o "Apagar" guarda a cor ou grava preto? (a dica e o código prometem coisas diferentes) · 24. na colisão de cor, o que é "o tom vizinho", e ela pode recusar o deslocamento?
**Vibração** — 25. a força passa a ter endereço, ou o quadro sai do alcance da fita? · 26. motor leve e forte continuam globais com dois jogadores na mesa? · 27. o Estilo de Jogo trava motor, ou só escolhe política?
**Navegação** — 28. as três regiões do touchpad ganham linha na tabela (e o daemon passa a disparar)? · 29. "Suspender mouse e teclado" e "Sair do modo jogo" vêm mesmo para cá? · 30. quais combos são reconfiguráveis, e para quais ações? · 31. que campos o estilo Point-and-click expõe?
**Sistema** — 32. plugins viram quadro próprio, ou entram no painel Detalhes técnicos?
**Conexões** — 33. como se distinguem dois controles do mesmo plástico, se a cor física não pode deslocar? · 34. "A janela" (tamanho do texto e ambiente do desktop) vai mesmo para Sistema? · 35. qual régua manda quando o juízo por entrada e a receita do arranjo discordam (D-QUAL-REGUA-MANDA-NO-ARRANJO)?
**Perfis** — 36. "Terminal" sai junto com "Editor"? · 37. o editor passa a mostrar um resumo do que grava (hoje mostra quatro coisas e salva vinte)? · 38. os ajustes por controle aparecem como estado, ou continuam gravados calados? · 39. duplicar um Estilo de fábrica vira um Personalizado editável? · 40. Perfis fica em nono lugar na tira?
**Lançadores** — 41. a aba lista lançadores, ou também os jogos de fora da Steam (que é varredura nova, não é ligar o que existe)? · 42. qual é a lista da primeira versão, e lançador ausente some ou aparece apagado? · 43. como o produto mede "o controle chega lá" por lançador — sem spec, isso vira instrumento que mente.

---

## O próximo passo

**O mockup, aba por aba, em `novo-layout/`.** HTML standalone, uma tela por aba, na paleta do produto, com **dado real seu dentro** — os seus controles, os seus perfis, as suas entradas — porque tela com dado inventado esconde justamente o que estoura o layout.

Como vai ser feito:

1. **Dez arquivos, um por aba**, na ordem da tira. Cada um abre sozinho no navegador, sem servidor e sem dependência.
2. **A tela mostra o AGORA**, não um estado ideal: o card do controle no rádio sem cor lida, o cartão de saúde com as seis a oito linhas longas de verdade (a foto `readme_sistema.png` tem dado falso por privacidade e subdimensiona o cartão em mais do dobro), a Conexões com a altura real que hoje não cabe.
3. **As 43 perguntas não travam o mockup.** Onde há decisão aberta, ele desenha a recomendação e marca o lugar com um traço, para você dizer sim ou não vendo — que é como você decide.
4. **A ordem:** primeiro as três que mais mudam de forma (Jogar, Controles, Lançadores), porque é nelas que o desenho pode estar errado; depois as sete restantes.
5. **A regra da casa continua valendo:** interface só fecha com o seu olho — foto antes e depois, e a palavra final é sua. Nada disso vira código antes disso.
