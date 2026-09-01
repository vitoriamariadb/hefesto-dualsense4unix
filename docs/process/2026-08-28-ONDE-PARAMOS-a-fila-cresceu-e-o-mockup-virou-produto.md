# ONDE PARAMOS — 28/08/2026: a fila cresceu, e o mockup começou a virar produto

**A porta de entrada de hoje.** Três coisas aconteceram, e a segunda contradiz o
que esta casa esperava:

1. **Dez decisões dela**, gravadas em `docs/data/decisoes-dela.csv:88-97`, mais
   uma decisão marcada como caduca e uma correção de fato de quem coordena.
2. **O balanço mediu que o redesenho NÃO encurta a fila** — ela cresceu 28%. O
   que ele encurta é outra coisa, e essa outra coisa é medível.
3. **Uma terceira rota de transplante nasceu e foi provada**: o gerador do
   mockup emitindo GTK, em vez de alguém reproduzir o desenho à mão.

---

## 1. O balanço que ela encomendou, e a resposta que ele deu

Palavra dela, ao pedir:

> *"ao final eu gostaria de um balanço real do antes do novo layout e após. pq
> tinha sprint que era pra ser executada pra desenvolver novas sprints pra
> corrigir os problemas da tela. e funcionamento. acredito real que isso vai
> encurtar por completo."*

Ela apontou um efeito que ninguém tinha medido: o **efeito cascata** — sprints
que existiam para *investigar* um problema de tela e *produzir* outras sprints.
Se o mockup aprovado já responde a pergunta, somem a sprint **e** as filhas.

**A conta, com as filhas contadas sprint por sprint:**

| | Sprints na fila | Filhas previstas | Trabalho total |
|---|---|---|---|
| **ANTES** (26/08) | 140 | 139 | **279** |
| **DEPOIS** (28/08) | 214 | 144 | **358** |
| | **+74** | +5 | **+79 (+28%)** |

**"Encurtar por completo" não se confirma.** O efeito cascata existe — ela
intuiu certo —, mas vale **6 unidades**: duas sprints inteiras
(`GATILHO-PALAVRA-01`, que era só a escolha das 19 palavras de gatilho, e
`JANELA-CORTADA-01`) mais quatro filhas que nunca vão nascer.

**O corte grande já tinha sido cobrado** pela faxina de 27/08: 17 linhas da fila
e 28 documentos do disco.

### Por que o desenho não alcança 60% da fila

| Faixa | Sprints | Filhas | O desenho toca? |
|---|---|---|---|
| **5 — o aparelho: luz, som, gatilho, rádio** | 34 | **97** | não: é firmware e rádio |
| 1 — o jogo com quatro controles | 40 | 10 | não: é daemon, co-op, vpad |
| 2 — a casa sabe e o produto não faz | 14 | 20 | 11 das 14 não tocam um pixel |
| 3 — install e pacote | 10 | 2 | **não existe aba de instalação** entre as dez |
| 4 — a janela mente, corta, ou não deixa ver | 13 | 10 | **sim — é a única faixa de tela** |
| 6 — documentação, portões, instrumento | 12 | 0 | não |

**A Faixa 5 sozinha carrega 97 das 139 filhas, e 27 das suas 34 estão marcadas
DELA.** É a bancada. O roteiro de 40 minutos da `PROVA-NO-PLASTICO-01` e o
ensaio de 4 minutos da `A-CADEIA-DE-BLOCOS-01` destrancam mais fila que qualquer
HTML — e é exatamente o que ela descreveu ao dizer *"eu e vc vamos pra linha de
produção da mesa specs"*. Ela acertou o caminho; o layout é que não é a régua.

### O que o redesenho encurtou de verdade

Não a contagem — **o caminho de cada linha**:

- **26 das 40** sprints da Faixa 1 perderam a entrega de **desenho**, a metade
  cara: foto antes, foto depois, e o olho dela pela `PROVA-DE-TELA-01`.
- **44 das 90** sprints novas nascem com o texto de tela **já aprovado**: quem
  executa copia do mockup, palavra por palavra, em vez de esperar por ela.
- **23 das 72** perguntas abertas o mockup respondeu sem uma reunião.

É ganho de calendário, não de contagem. A diferença importa: a Faixa 5 continua
esperando a **mão** dela, não a aprovação.

### Três achados que ninguém tinha

1. **Cinco "economias" eram escrituração vencida** — trabalho já feito no disco
   que a fila nunca viu. A Faixa 3 é *10 no papel e 7 na árvore*. Reconferir a §4
   contra o disco é a régua que mais rende, e cinco das seis faixas nunca foram
   varridas.
2. **O applet, a bandeja e a janela compacta ficaram inteiros de fora** das dez
   abas. A `RADAR-01` sozinha prevê 7 filhas, e o applet é a superfície que ela
   usa todo dia.
3. **Quem coordena afirmou que a fila cairia de 123 para 114** com as nove
   sprints que ela fechou hoje. **Falso, e conferido no mesmo dia:** as nove não
   estavam na §4 (grep de cada nome devolve zero). Foram fechados nove
   *documentos*, não nove linhas de fila. A correção está no próprio
   `decisoes-dela.csv:88`.

---

## 2. As dez decisões dela

Gravadas em `docs/data/decisoes-dela.csv:88-97`. As quatro primeiras vieram de
uma rodada de perguntas em que o pedido dela colidia com uma decisão dela
anterior — e em três das quatro o preço da colisão só apareceu porque alguém
mediu antes de executar.

| Decisão | O que ela escolheu |
|---|---|
| `D-AS-NOVE-QUE-ESPERAVAM-A-PALAVRA-DELA` | **Aceito.** As nove que diziam "ENTREGUE — AGUARDANDO A PALAVRA DELA" fecham. A pergunta estava escrita desde 26/08 no CENSO e nunca tinha sido feita |
| `D-A-FATIA-DO-RADIO-VIRA-TURNO` | **Turnos.** Ela pediu "faixas"; vista a colisão com "faixa de 2,4 GHz" na mesma tela, validou: *"a ideia é mostrar algo tipo porções, divisões, turnos funciona também"* |
| `D-MAPEAR-ENTRADAS-E-NAO-PORTAS` | **Entradas.** Os nomes novos respeitam a `D-A-PALAVRA-ENTRADA` (24/08). Nenhum portão pegava a divergência |
| `D-O-GAMEPAD-VIRTUAL-SAI-DA-INTERFACE` | **Some.** *"o controle já tá certinho hoje. aquilo foi pra outro momento que não faz sentido na interface hoje"* |
| `D-CALIBRAR-SENSORES-CALIBRA-A-MESA-INTEIRA` | **Fica, e cresce.** Uma quarta saída que ela criou: os interruptores descem por controle, o Calibrar continua no cabeçalho e passa a calibrar os quatro numa passada |
| `D-O-GATILHOS-DE-QUATRO-COLUNAS-ESTA-APROVADO` | **O selo acompanha** o desenho de hoje. As sete sprints da onda se reescrevem contra o arquivo atual |
| `D-O-SEM-TETO-SAI-DOS-DOIS-LUGARES` | **Os dois.** Um deles ela nunca tinha visto — está em `y=834`, fora da dobra de um miolo que acaba em `y=713` |
| `D-O-RECIBO-DO-RODAPE-ENCURTA-NAO-SAI` | **Encurta**, no mockup e no produto. O pedido literal dizia remover; a intenção era o tamanho |
| `D-A-FITA-VIVE-ONDE-A-ABA-AJUSTA-POR-CONTROLE` | Uma regra que resolve **seis** contradições entre o mockup e as sprints |
| `D-O-DESEMPATE-DE-PERFIS-FICA-COMO-REDE` | *"4 fica caso algo erre."* A proibição de empate é a primeira linha; o desempate segura se ela falhar |

**Uma decisão marcada como caduca:**
`D-AS-SPRINTS-VELHAS-SAO-DESATIVADAS-NAO-APAGADAS` continuava `decidida` com o
texto *"MARCAR COMO DESATIVADA, NUNCA APAGAR"* — um mês depois de ela ter
respondido **"Apagar"**. É o arquivo que um agente consulta **antes** de podar, e
ele mandava o contrário do que ela decidiu por último.

---

## 3. O falso alarme que ela derrubou

Quem coordena levou a ela uma "contradição": o desenho da aba Jogar oferece
PS+R3 como saída de emergência com o jogo aberto, e a `TRES-PORTOES-01` teria
medido que trocar de ponte destrói o vpad e invalida o handle do jogo.

Resposta dela, de uma linha: **"isso funciona hoje."**

Ela estava certa, e o código já dizia:

```python
# integrations/ponte_escada.py:405 — como_subir()
"""A regra que este módulo não abre mão: com o jogo vivo a resposta nunca é
SUBIR_AGORA. (...) O produto pode subir sozinho entre lançamentos;
com o jogo aberto, quem sobe é o GESTO DELA."""
```

O que a `TRES-PORTOES-01` mediu foi outra coisa: `vpad_recriacao_bloqueada_por_jogo
motivo=troca_de_mascara **origem=profile**` — troca automática **pelo perfil**,
que o produto bloqueia de propósito. O PS+R3 é o caso oposto: gesto dela,
autorizado por construção (`SUBIR_SO_COM_GESTO`).

**A medição não contradiz o desenho — ela o sustenta.** Vale a nota de sempre:
a observação dela sobre o aparelho é fonte primária.

---

## 4. Os ajustes do mockup, e os dois buracos que a conferência achou

Nove de treze provas passaram de primeira. As dez abas: `1180×757`,
`passa_da_dobra 0`, `rolagem_lateral false`, `regua.py` verde nas dez.

| Pedido | Prova |
|---|---|
| `fatias` → `turnos` | 0 no visível das dez; **"faixa de 2,4 GHz" preservado** |
| Mapear Entradas / Entrada a Entrada | nomes velhos = 0 em texto, notas e tooltips |
| "Sem teto" sai dos dois | sumiu da capa e das quatro linhas; sobrou o seletor |
| Perfil de Bateria na Sistema | **535,5 × 154 px**, igual ao bloco "O Hefesto", mesmo `y` |
| Rodapé encurtado | dez abas, byte a byte iguais |
| Giroscópio/Acelerômetro por controle | 8 interruptores, nos mesmos dois `x` nas quatro linhas |
| Ordem dos quatro botões | fileira única, e a altura **não cresceu** (204 px antes e depois) |
| Navegação: dois botões, duas pop-ups | 4 botões de 261 px sem texto cortado; pop-ups fechando em `y=707` de 757 |

**Os dois buracos, e por que os dois são a mesma falha:**

1. **64 tooltips em inglês continuavam na tela.** O `<title>` dentro do `<svg>`
   foi traduzido, mas sobrava um `title="cross"` no `<span>` de fora — e o span
   mede 42×46 contra 38×38 do svg, então num anel de 2 px o tooltip inglês era o
   que aparecia. Duas verdades no mesmo widget.
2. **Os títulos minúsculos do logotipo continuavam em nove abas e no produto.**
   A `01-jogar.html` foi corrigida, mas a fonte é o `topo.html` (que o montador
   injeta nas outras nove) e o `assets/hefesto-logo.svg` (o ícone de verdade).

**A falha comum: correção pela metade.** É o defeito que a regra de 11/08 existe
para matar — *"e sai de TODOS os lugares onde aparece, não só de onde foi
notado"*. Nos dois casos o agente **relatou** o que faltava; ninguém era dono da
linha, e ela ficou.

De passagem, `<title>Background</title>` virou `Fundo` — a única palavra em
inglês do logotipo. O `gerar_icones.sh --check` passa: `<title>` não move pixel.

**Portões:** 27 de 28 verdes. O vermelho é o `referencias-docs`, e ele é
**herdado**: 125 linhas mortas, das quais **121 (97%) são arquivos que a própria
sprint declara criar** no `cria:` do frontmatter. Nada do que esta leva tocou
aparece ali. A cura proposta — e não executada, porque mexer em régua é palavra
dela — é o portão passar a aceitar um token que esteja no `cria:` da mesma
sprint, o que mantém a mordida e zera o vermelho antes de a pasta `-dev` nascer.

---

## 5. A terceira rota: o mockup deixa de ser mockup

Ela escreveu: *"falta o mockup deixar de ser mockup e funcional também."*

Três rotas foram medidas. Ela descartou a primeira (*"o foda é abrir o chrome
pra reproduzir o site como app"* — receio que não se aplicava, porque WebKitGTK
é widget numa `Gtk.Window`, não um navegador, mas custa **122 MB** de
empacotamento e uma dependência nova).

| | 1 · WebKit embutido | 2 · GTK à mão | **3 · o gerador emite as duas saídas** |
|---|---|---|---|
| Empacotamento | +122 MB medidos | zero | **zero** |
| Dependência nova | `gir1.2-webkit2-4.1` | nenhuma | **nenhuma** |
| Fila | 90 → ~15 | 90 + ~40 | 90 → ~20 |
| Divergência desenho×produto | impossível | **permanente** | **impossível** |
| Tema COSMIC, acessibilidade | perde | mantém | **mantém** |

**O que tornou a rota 3 plausível foi uma medição:** os dez geradores mais o
`monta.py` somam **6.123 linhas**, e cada aba tem de 3 a 7 tabelas de dados no
topo contra 44 a 120 tags literais. O desenho **já está descrito como dados**.

**A divergência não é hipótese — ela aconteceu hoje.** O elogio dela à aba
Gatilhos é de 27/08 e valia para o desenho de duas colunas; em 28/08 às 13:28 o
gerador virou quatro colunas e o selo "FECHADA, não tocar" continuou colado.
Sete sprints ficaram escritas contra um desenho que não existe mais — a 02 cita
oito endereços no gerador e os oito andaram.

**A prova foi feita com a aba Vibração** (a menor, 370 linhas, e aprovada por
escrito por ela). O resultado está em
`scratchpad/prova-vibracao/LADO-A-LADO.png`: o GTK3 reproduziu as quatro
colunas, os quatro desenhos **com as quatro cores de plástico corretas**, o
laranja do lado que treme, os botões de força com o selecionado marcado, as
barras com valor e `/255`, os glifos dos motores, e a coluna de rótulos.

E de quebra a prova **achou e curou** o defeito que quem coordena tinha isolado
de manhã: rodando o `assets/control-svg/dualsense.svg` pelo caminho do produto
(GdkPixbuf → librsvg 2.58), os quatro plásticos renderizavam **358 cores
idênticas**, porque librsvg ignora `:is()` e `var()`. Sem essa cura, cinco
sprints de cinco ondas entregariam quatro cartões cinzas com a régua verde.

### O veredito: passou com ressalva, e a ressalva derruba a promessa

Quem coordena prometeu a ela: *"se a prova fechar, as outras nove seguem o
molde."* **Isso é falso hoje**, e quem provou foi o cético — com um experimento
que ninguém tinha feito.

**Ele mudou UMA linha do mockup** (`--r-motor: 36px → 56px`) e rodou os dois
emissores contra a cópia:

| | Acompanhou? | Prova |
|---|---|---|
| **A — descrição no meio** | **sim** | janela 757→792; as faixas moveram +40 px |
| **B — emissor direto** | **não** | PNG **byte-idêntico**, cego à mudança |

O B tinha os números do mockup **digitados** (`R_DES, R_NOME, R_FORCA = 124, 17,
79…`, com o comentário *"do `--r-*` do aba05.py"* e sem ler nada). **O B é a
rota manual feita bem** — bonito, idêntico, e divergiria no dia seguinte. Era
exatamente o defeito que a rota 3 existe para matar, e só esse experimento o
revelou. Fidelidade não prova rota; **acompanhar a mudança prova**.

**Mas o A entrega o desenho quebrado:** d-pad deformado invadindo o touchpad,
ombros L1/L2 sumidos. Causa: **10 `transform-box:fill-box`** no SVG, que o
librsvg também ignora — um segundo defeito, além do `:is()`/`var()`. Só o B
curou.

| tinta perdida, por região | A | B |
|---|---|---|
| ombros L1/L2 | **30,4%** | 1,4% |
| touchpad | **19,3%** | 0,0% |

**E a régua do A passou verde sobre isso.** Ela só verificava *"há mais de 50 px
de plástico e de laranja"*, e o comentário dela admitia: *"Ela passaria se o
controle virasse um retângulo."* Passou. É a cicatriz nº 1 desta pasta
acontecendo de novo — e a única razão de ter sido pega é que o cético escreveu
cinco réguas próprias, leu **bitmap** em vez de `get_allocation()`, e mordeu
cada uma. A quinta delas **nasceu falsa** e ele a corrigiu antes de acreditar:
aceitava brilho 40–90 num fundo que é `(40,42,54)`, e respondeu *"452px, achei"*
para uma coluna que ele tinha acabado de apagar.

**O que a prova NÃO provou:** a `01-jogar.html` **não tem gerador** (é o
esqueleto, mantido à mão) — uma das dez está fora da rota por construção. E a
aba 05 é **377 de 6.338 linhas** (5,9%) dos geradores, com **zero** ocorrências
de `:has()` (20 nas abas 02/06/08), `<input>` (9 em cinco abas), tabela e
`<select>` (37 em cinco abas) e rolagem interna. Para esses construtos, a rota é
chute.

**A saída medida:** o mecanismo do A com a cura de SVG do B, mais uma tarde na
mesma aba 05. Custo marginal medido da próxima aba: **~183 linhas (A)** contra
**~174 (B)** — os dois convergem, e a diferença está em quem acompanha o mockup.

---

## 5.1 O achado acidental, e ele bloqueava a migração

Durante a prova, um agente rodou uma cópia do gerador noutro diretório e **o
`05-vibracao.html` dela foi reescrito** — ficou com `r-motor:56px`. Ele reparou e
provou o reparo com md5; o arquivo dela está íntegro.

**A causa: oito arquivos cravavam o caminho absoluto da árvore dela.**

```
layout/_ferramentas/{monta,exportar,aba08,aba09,importar,mapa,regua}.py
scripts/check_pecas_do_dualsense.py        ← este é VERSIONADO
```

O último é o mais grave: `scripts/` viaja para qualquer worktree ou clone, e um
portão que crava o caminho dela **mediria a árvore dela**, nunca a nova. Sem
isso curado, o primeiro agente a trabalhar na `hefesto-dualsense4unix-dev`
reescreveria o mockup que ela tem aberto. É o mesmo estrago de 25/08, quando o
mockup que ela ia abrir sumiu do disco na frente dela.

**Curado nos oito** — a raiz sai de `__file__`. E provado nas duas pontas:

1. **Nada mudou:** as dez abas regeradas dão `md5` idêntico ao de antes.
2. **A mordida:** copiada a árvore e estragado o gerador da cópia, ela escreveu
   `56px` **nela mesma**, e o mockup dela ficou em `36px`.

---

## 5.2 As duas pop-ups que só tinham botão — 29/08

O último item do pedido dela de 28/08: *"Concluir as páginas pop up."* As duas
telas não existiam — só os botões (`grep -c 'tn-cx' 08-conexoes.html` = 0). Foram
desenhadas a partir das janelas que **já rodam** no produto (`mapa_da_mesa.py`,
823 linhas, e `calibrar_entradas.py`) e do mockup de 24/08
(`layout/mapa-das-portas.html`), de onde **não** veio o bloco do rádio — a
aba Conexões já o absorveu.

**O cético reprovou a primeira entrega, e estava certo em quatro pontos.**

1. **Uma feature inventada, na linha mais lida de três telas:** *"o que você
   apertar no controle fica aqui — não chega ao jogo aberto atrás."* A peneira que
   faria isso (`calibrar_entradas.py:399`, `botoes_para_o_jogo`) está escrita e
   **sem chamador**, e a lápide desta casa diz o contrário com todas as letras
   (`portao_a_casa_sabe_e_o_produto_nao_faz.py:1162`): *"confirmar uma entrada com
   o cabo na mão dispara um pulo ou um tiro no jogo aberto"*.

   **A lição não é que o agente errou — ele DECLAROU a pendência, num comentário
   de dez linhas.** A lição é que ressalva em comentário não alcança quem lê a
   TELA. Regra que fica: *o mockup mostra o AGORA*. O texto ficou guardado numa
   constante (`PENEIRA_QUANDO_ELA_EXISTIR`) para quando a peneira ganhar chamador,
   e o requisito continua onde já estava — contrato do redesenho, linhas 667 e 861.

   **E a mesma promessa falsa estava no `title` do botão desde 27/08**, anterior a
   esta leva. Saiu junto.

2. **Uma terceira frase inventada** — `"Ainda sem lugar no desenho."` no chip do
   aparelho sem entrada. O produto não põe tooltip nenhum ali
   (`_desenhar_aparelhos` só chama `set_tooltip_text` sob `if onde:`). Removida.

3. **140px nascendo invisíveis**, a confissão inteira entre eles. Pergunta e
   resposta passaram para a mesma linha (−40px) e a barra ganhou espaço reservado.

4. **As duas perguntas da sala estavam em dois lugares que discordavam** — e essa
   era dela. Ver abaixo.

**O reconhecimento derrubou três afirmações do enunciado** que quem coordena tinha
repassado de um relatório anterior sem conferir: o nome da face **não** é editável
(é um `Gtk.Label`); o quadrado "Dentro da máquina" **não existe** (`ROTULO_EMBUTIDO`
é declarado e nunca usado); e as duas perguntas da sala **não** são `perto`/`alto`
— são `mesa.altura_da_antena` e `mesa.linha_de_visada`, que já existem na tela da
aba. De quebra: `Face.alto` é escrito e **nunca lido**.

### A decisão dela, e a sprint que ela corrigiu

As duas perguntas da sala — a altura do dongle e se há gente entre ele e o sofá —
estavam **na pop-up** pelo mockup e **na aba** pela `ONDA-CONEXOES-03`, que as
pedia como terceira coluna do quadro "Está tudo certo?". Não havia decisão dela: em
27/08 quem decidira fora um **comentário de gerador**, com razão de ALTURA (110px).
A divergência viveu dois dias entre a especificação aprovada e o trabalho
enfileirado, e só apareceu porque o cético mediu o mockup **contra a fila**.

Palavra dela, 29/08: **"Ficam na pop-up, e eu corrijo a sprint."**
(`D-AS-PERGUNTAS-DA-SALA-MORAM-NO-MAPEAR-ENTRADAS`.) A razão que sustenta é o
assunto, não o espaço: quem está dizendo onde cada aparelho mora é quem sabe se o
dongle fica acima da cabeça. **A `ONDA-CONEXOES-03` foi reescrita: o exame volta a
duas colunas.**

### O que fica medido, e é dela

A `#mapear-entradas` tem **618px de conteúdo em 478 visíveis — 140px continuam
abaixo**, e o primeiro deles é a confissão. As outras seis pop-ups estão sãs (305 a
660px contra o teto de 717).

Há rolagem e o espaço da barra está reservado (medido: 9px). **Mas não há prova de
que a barra apareça:** três tentativas, e o Chrome headless não a pinta na foto,
nem com `--disable-features=OverlayScrollbar`. No produto quem desenha é o GTK,
cuja barra é sólida — mas isso é dedução, e está escrito como dedução no
`monta.py`, não como promessa.

### Duas réguas de quem coordena nasceram falsas no mesmo dia

- A **régua de pop-up** acusou "PASSA DA JANELA" em quatro telas sãs: comparava
  o rodapé com a viewport de 1080 do navegador, quando a `.tela-nova` é
  `position:fixed` e no produto vive dentro dos 757. O que vale é a altura da caixa
  contra o teto de 717.
- O **`csv.writer` do Python** escreve `\r\n` por padrão, e converteu **as 98
  linhas** do `decisoes-dela.csv` para CRLF — o diff inteiro do arquivo apareceria
  modificado. Pego pelo aviso do `git add` e corrigido.

Nenhuma das duas foi acreditada antes de ser mordida. É a terceira vez no mesmo
par de dias que um instrumento desta casa mente antes do produto.

---

## 6. O que fica aberto

**Dela, e barato:**

- As **22 minúsculas nas pop-ups** da Navegação (`L3 direção`, `D-pad cima`).
  Não é o padrão que ela apontou — são complementos dentro da expressão, e em
  português o complemento é minúsculo. O número está na mesa.
- **O portão `referencias-docs`:** aceitar o `cria:` do frontmatter, ou marcar
  as 125 linhas à mão.
- **Dois mockups aprovados discordam do mesmo campo:** `01-jogar.html:2311` tira
  o "Automático" da máscara; `10-perfis.html:1079` ainda o anuncia como entrega.

**Trabalho, com material pronto:**

- **As duas pop-ups "Mapear Entradas" e "Mapear Entrada a Entrada" não existem**
  no mockup — só os botões. Mas há mockup de 24/08 em
  `layout/mapa-das-portas.html` (1.412 linhas) que já desenha as faces com
  entradas numeradas, a entrada por extensão (`15a`), os aparelhos sem lugar e o
  painel do que está plugado. O bloco de rádio dele **não vai junto** — a aba
  Conexões já o absorveu.
- **As sete sprints de Gatilhos** se reescrevem contra o gerador de hoje.
- **A pasta `hefesto-dualsense4unix-dev`** existe e está vazia. `git worktree add
  ../hefesto-dualsense4unix-dev dev` **falha** — `dev` está preso à árvore dela —,
  então tem de ser branch própria. E **nunca rodar o `install.sh` lá**: ele
  reescreve caminhos únicos por máquina (`~/.local/bin`, o `.desktop`, a unit
  systemd) e faz `systemctl --user restart` na linha 3337 — trocaria o código do
  produto que ela usa, na hora.

---

## Nota de método

Quatro workflows correram hoje, com **51 agentes** e cerca de **8,8 milhões de
tokens**. Três achados vieram de agentes discordando entre si, e dois relatórios
de agente foram corrigidos contra o disco antes de virarem fato:

- um agente afirmou que **duas** abas estão fechadas por elogio dela; são
  **três** (`CORRECOES-DELA.md:28`, `:39`, `:60`);
- os dez agentes do delta usaram **dez réguas diferentes** e os números não eram
  comparáveis entre si — foi preciso recontar com uma régua só;
- os lotes da cascata somaram **15** de economia; conferido arquivo por arquivo,
  são **6**.

É o padrão que esta casa já registrou: *o instrumento mente mais que o produto*.
Duas réguas independentes continua sendo o que revela.
