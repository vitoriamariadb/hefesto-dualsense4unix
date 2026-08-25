# A escada de releases — cinco degraus até a 1.0

**24/08/2026.** Nasceu do pedido dela, literal:

> *"me ajuda a fazer a escadinha de releases pra mim .95 quando terminarmos a
> bancada do specs em bt, 96 terminarmos todas as sprints e tal...e depois?"*

O critério de 15/08 (decisão **V-A**, no [`CHANGELOG.md`](../../CHANGELOG.md))
põe tudo num degrau só: *mapa completo + todos os canais construídos + nenhuma
sprint aberta*. São três eixos independentes amarrados no mesmo nó — qualquer um
atrasa os outros dois, e nada sai enquanto isso. Ela mesma já desatou o nó ao
escrever ".95" e "96": separou **medir** de **construir**. Este documento leva a
separação até o fim.

**Ele não apaga o critério de 15/08.** Ele o substitui, com nota datada no
`CHANGELOG.md`, pelo motivo escrito na seção 3.

---

## 1. Onde estamos hoje — medido, não adjetivado

| o quê | número | como foi medido |
|---|---|---|
| versão | **0.9.4.5** | `pyproject.toml:7` |
| suíte | **12031** testes coletados em 9,0s | `pytest --collect-only -q` (o `CLAUDE.md` ainda declara 6645, de 01/08) |
| commits | **61** em 22/08 · **24** em 23/08 · **51** em 24/08 | `git log --format=%ad --date=short \| uniq -c` |
| sprints em disco | **287** `.md` — **24 nasceram hoje** | `find docs/process/sprints -name '*.md'` |
| sprints abertas curadas à mão | **140** (89 dela, 51 de agente) | `SPRINT_ORDER.md` §3, links contados contra o cabeçalho: bate |
| mapa de canais | **308** linhas; pendência **61** na união cabo/rádio (25 DualSense, 17 Pro, 19 8BitDo) | consulta ao `docs/data/mapa-controles.csv` pelo critério do §0.12 |
| caderno de bancada | **178** ensaios; **99** de rádio, **98** deles sem degrau registrado | `docs/data/ensaios.csv` |
| **último ensaio com o olho dela** | **16/08, 01h05 — oito dias atrás** | coluna `observado_por` do mesmo caderno |
| checklist de hardware | **0 de 31** caixas, arquivo intocado desde 25/07 | `grep -c '^\s*- \[[ x]\]'` |

**O que fechou em 23–24/08:** a Onda 0 inteira (Z0–Z7, nove merges entre 09h46 e
10h15 de 24/08), a Onda 1 · Configurações (`cf78346`), a frente 17 · Portão e
teste (3 sprints), e os dois perfis de fábrica que não abriam (`fabf1d4`).

**O que está em voo:** Ondas 2–11 (abas), frentes 12 a 16 e 18.

**O que está vermelho na árvore agora**, e não é meu:

- `validar-caducos.py --all` → `docs/protocol/paridade-bluetooth-versus-cabo.md:276`
  republica o literal caduco de fração de sinal do microfone. Roda no CI e **não
  está no bloco de fim de leva do `CLAUDE.md`** — foi assim que passou.
- `check_faixa_sintetica.py` → acha faixa de teste no `controllers.json` **vivo
  dela** e no backup. **Nenhum chamador**: nem CI, nem hook, nem checklist.

**O que está quebrado na máquina dela agora**, medido no journal e reproduzido na
árvore de hoje:

```
$ journalctl --user -u hefesto-dualsense4unix --since 2026-08-23 | grep -c x11_connect_failed
2830
$ journalctl --user -u hefesto-dualsense4unix --since 2026-08-24 | grep -c profile_autoswitch
0
$ .venv/bin/python -c "from hefesto_dualsense4unix.core.trigger_effects import build_from_name; build_from_name('Rigid', [])"
TypeError: rigid() missing 2 required positional arguments: 'position' and 'force'
```

O detector de janela está cego há mais de 24 horas, a troca automática de perfil
por jogo **não disparou uma vez hoje**, e o clique dela na aba Gatilhos estourou
cinco vezes na noite de 23/08. Nenhuma das 287 sprints escreve isso.

---

## 2. A escada

Cada degrau tem **um eixo só**. Um degrau que junta dois eixos é o nó de 15/08
outra vez.

Um degrau publica quando **o comando sai zero**. Onde o comando não existe, o
degrau nomeia o arquivo que precisa nascer — porque, nesta casa, **critério que
não é verificável por comando é promessa, não critério**, e ela já foi mordida
por isso.

---

### 0.9.5 — o rádio para de mentir

> **Para quem usa:** o que a tela promete sobre Bluetooth é verdade. Se uma
> feature não sai pelo rádio, o produto diz isso em vez de fingir que saiu.

É o degrau dela, na palavra dela: *"quando terminarmos a bancada do specs em bt"*.

**Critério verificável.** Arquivo a nascer:
`scripts/check_bancada_de_bt.py` <!-- ref-externa: não existe ainda; fazê-lo nascer é parte deste degrau -->.
Lê só `docs/data/mapa-controles.csv` e `docs/data/ensaios.csv` — nada de
hardware, para rodar no CI. Sai zero quando as quatro contagens abaixo zerarem,
**restritas a `controle == dualsense`** (o corte da decisão **D-J**; Pro e 8BitDo
entram por `--todos` quando ela decidir):

| régua | o que conta | hoje |
|---|---|---|
| **R1** | célula `radio_*` que admite não acionar e **não nomeia a culpa** (`radio_por_que_nao_aciona` vazio) | **22** |
| **R2** | célula `radio_*` com `radio_aciona = sim` e `radio_de_onde_sei ≠ medido` — **a casa afirma e não mediu** | **30** |
| **R3** | das sete perguntas de rádio dela (`SPRINT_ORDER.md` §0.7), quantas ainda não têm `medido` + degrau | **6 de 7** |
| **R4** | ensaio de rádio no caderno sem `degrau` preenchido | **98 de 99** |

E uma régua de bancada, **fora do CI**, porque a pergunta 2 dela não é de
arquivo:

**R5** — `ls /sys/class/bluetooth/` devolve **três** adaptadores, e existe ensaio
com **quatro DualSense simultâneos no rádio** observado por ela. Hoje: **dois
adaptadores** (`hci1`, `hci2`) e **zero** ensaios de quatro no rádio. O maior
ensaio já feito foi dois.

**Por que isto é finito, e o critério de 15/08 não era.** R1 e R2 fecham por
**honestidade**, não por construção. Preencher `radio_por_que_nao_aciona` com
`decisao-tomada` fecha a R1 e é verdade. Rebaixar um `sim` não medido para
`parcial` fecha a R2 e é verdade. **Este degrau não manda construir canal nenhum
— manda parar de afirmar o que não se mediu.** Construir é o degrau seguinte.

**O que falta hoje:** R1=22, R2=30, R3=6/7, R4=98, R5 com um adaptador a menos e
zero ensaios de quatro.

**Quem destrava: os dois.** A instrumentação (btmon, contagem de reports, FFT) um
agente monta. A **observação** é dela por decisão — é a trilha **D2** do §0.7:
som saindo, luz acesa, dedo no gatilho, mão no controle. Nenhuma das sete
perguntas fecha sem ela.

**Custo.** Uma única das dezesseis sprints da trilha põe preço na mesa:
`A-CADEIA-DE-BLOCOS-01` declara **8 minutos dela** (2 de mão, 6 de olho). As
outras quinze: **NÃO VERIFICADO** — `grep` por "minutos|horas" não devolve
estimativa em nenhuma. Não somo o que não foi medido. De agente: ordem de
**dias**, não horas, e a maior parte é preencher CSV depois que ela olhou.

**A alavanca mais barata desta escada inteira:** 36 das 61 pendências do mapa são
Pro Controller e 8BitDo. A **D-J** já diz que cobertura de aparelho que ela não
tem na mesa é 1.0. Uma frase dela confirmando isso corta o 61 para **25** sem um
minuto de bancada.

---

### 0.9.6 — a fila acaba

> **Para quem usa:** nada que a casa sabe estar quebrado continua quebrado sem
> alguém tendo decidido que fica assim.

É o segundo degrau dela: *"96 terminarmos todas as sprints e tal"*.

**Critério verificável — e ele não existe hoje, por dois defeitos medidos.**

O único candidato é `censo_de_sprints()` (`scripts/gerar-painel.py:93`), e a
própria docstring dele **se desautoriza como portão**: *"a régua é declarada, e
ela é frouxa de propósito... o julgamento é do batedor de sprints, não daqui."*
Os dois defeitos:

1. **Cegueira de vocabulário.** Procura `ABERTA|CONCLUÍDA|FECHADA` nos primeiros
   2400 caracteres. **118 dos 287** arquivos não têm nenhuma das três aí — mas
   têm `PENDENTE` (67), `ENTREGUE` (31), `EM ABERTO` (26), `PARCIAL` (20). E 56
   deles dizem `ABERTA` **depois** do caractere 2400.
2. **Falso índice** — defeito novo, medido em 24/08. A linha 111 descarta como
   índice qualquer arquivo com `ÍNDICE` nos 200 primeiros caracteres, e sprints
   reais trazem `- **Índice:**` no cabeçalho. **10 sprints reais somem, e as 10
   estão abertas.**

**As três mudanças que fazem o degrau existir**, em ordem de custo:

1. apagar `or "ÍNDICE" in alto[:200]` da linha 111 — **uma linha**, recupera 10
   sprints abertas;
2. **ler a §3 do `SPRINT_ORDER.md` em vez de fazer regex em 264 arquivos.** A §3
   é curada à mão, tem 140 links distintos, e o cabeçalho declara 140: **é a
   única régua desta casa que fecha consigo mesma**;
3. três reprovações: caminho citado na §3 que não existe em disco; contagem do
   cabeçalho diferente dos links contados; e **sprint em disco que não aparece em
   lugar nenhum do `SPRINT_ORDER.md`** — hoje **32**.

**O que falta hoje.** 140 na §3, mais uma cauda estimada de **8 a 47** nas 64
sprints mudas (Wilson 95%, n=10 amostradas com semente declarada, centro 19–32),
menos 4 que já não deviam estar lá. **Entre ~145 e ~185 sprints abertas.** O
intervalo é largo por causa das mudas, não da §3.

**Quem destrava: os dois, com a repartição já medida.** 51 das 140 dependem só de
agente. As 89 dela **não são 89 decisões**: a §5 do `SPRINT_ORDER.md` extraiu 163
perguntas, derrubou 54 por já terem resposta datada, e **sobraram 6 decisões, de
29 a 39 minutos somados**.

> **CORRIGIDO em 25/08/2026: sobra UMA, não seis.** Ela respondeu cinco das seis
> no `DECISOES.md` em **22/08** (commit `4272438`), marcando as caixas e
> escrevendo à mão em duas. A resposta nunca foi colhida para o
> `decisoes-dela.csv`, e este parágrafo cobrava dela um trabalho já feito. As
> cinco estão no CSV desde 25/08; a que sobra é a pergunta 1, que é **olho na
> tela**, não decisão de mesa. Detalhe e as cinco pelo nome na
> [§5 do SPRINT_ORDER](SPRINT_ORDER.md).

O resto das 89 é controle na mão, olho na tela e
palavra de vocabulário.

**E o caminho crítico é menor que 51.** As frentes 13–16 e 18 somam **24 sprints
de agente**; os outros 27 estão dentro das Ondas 2–11, que já têm dono.

**O trabalho manual não é 126 arquivos, é 32.** Os outros 92 órfãos já têm
endereço no `SPRINT_ORDER.md` (absorvidas pelo §0.4, mortas pelo §0.6, na fila do
§1); o portão só precisa exigir que o endereço exista.

**Custo:** 51 sprints de agente — ordem de **dias-agente**, sem estimativa por
sprint: **NÃO VERIFICADO**. Dela: **1** decisão medida (as outras cinco já foram
respondidas em 22/08 — ver a nota acima) mais bancada e
olho, não estimados.

**O gesto mais barato que existe hoje mora aqui:** a frente 12 são **14 sprints
que só esperam ela olhar a foto**, com **zero código de agente**, e destravam 23
das 27 sprints marcadas DELA na faixa 4.

---

### 0.9.7 — ela joga a mesa cheia

> **Para quem usa:** o produto foi visto funcionando com quatro controles num
> jogo de verdade, por quem vai usá-lo — não deduzido de leitura de código.

**Este degrau não estava no pedido dela, e é o que falta.** O motivo é medido, e
é duro:

- **Nenhum dos quinze defeitos de forma veio dela usando o produto.** Todos
  vieram de agente lendo código ou journal. Os três que tocam a experiência dela
  (F4, F7, F12) foram **inferidos**, não observados.
- **Nenhuma das 287 sprints carrega o rótulo `VALIDADO POR ELA`.** Vinte e um
  arquivos carregam `AGUARDANDO A PALAVRA DELA` — em 10/08 eram 17. **A fila de
  espera pelo olho dela cresceu.**
- **Em 23–24/08 o repositório ganhou 2,05 linhas de documento por linha de
  `src/`** (`docs/` +25.740, `src/` +12.576).
- E o produto **quebrou calado** na máquina dela no mesmo intervalo, com
  `window_detect_healthy` continuando `true`.

Uma escada em que ninguém joga entrega um 1.0 num produto que não troca de perfil
quando ela abre o jogo e estoura quando ela clica em Gatilhos. **Os degraus 0.9.5
e 0.9.6 são medidos inteiramente por leitura de repositório. Este não é medido
por comando nenhum, e é de propósito.**

**Critério verificável — em três partes, duas por comando e uma pelo olho dela:**

1. **O produto está vivo quando ela liga.** Numa sessão de jogo dela:
   `journalctl --user -u hefesto-dualsense4unix | grep -c x11_connect_failed` = 0,
   **e** `profile_autoswitch` disparando. Hoje: 2830 e zero.
2. **O que ela clica aplica, ou diz por que não.** Na mesma sessão:
   `grep -c ipc_handler_error` = 0. Hoje: 5 desde 16/08, e o `TypeError`
   reproduz na árvore com um comando.
3. **As 31 caixas do checklist de hardware fechadas** — e sobretudo a última, que
   é o alvo dela escrito como teste, palavra por palavra:

   > *"Quatro controles em co-op, dois por cabo e dois por rádio, um DualSense,
   > um Nintendo Pro e um 8BitDo em modo DirectInput — cada um o seu jogador, do
   > primeiro quadro, sem abrir terminal."*

   Hoje: **0 de 31**, arquivo sem um único commit desde 25/07 — trinta dias.

E, junto: **as 21 sprints em `AGUARDANDO A PALAVRA DELA` saem desse estado** —
para aprovado ou reprovado, com data. Um rótulo que só cresce não é fila, é
depósito.

**Quem destrava: ela, e só ela.** Nenhum agente pode fechar este degrau, e é essa
a definição dele. O agente prepara a mesa (o terceiro adaptador, os quatro
controles carregados, o jogo aberto, o journal limpo) e sai da frente.

**Custo.** Dela: **NÃO VERIFICADO** — nenhuma das 31 caixas tem estimativa
escrita. A última caixa é uma sessão de jogo, ordem de **horas**. De agente:
preparar a mesa, ordem de horas; curar o que a sessão achar, desconhecido por
construção.

**Por que aqui e não antes:** os dois defeitos vivos da parte 1 e 2 são de
Onda 12 (daemon), que na fila de hoje só destrava depois das Ondas 1–11 —
ou seja, depois da 0.9.6. **Mas se a 0.9.6 demorar mais de uma semana, este
degrau troca de lugar com ela**, porque oito dias sem o olho dela já é o número
de hoje e ele não pode dobrar.

---

### 0.9.8 — funciona para quem não é ela

> **Para quem usa:** instalar numa máquina que nunca viu este projeto entrega o
> mesmo produto que ela tem, e não uma versão capenga em silêncio.

**Motivo medido, e ele é uma contradição do próprio `SPRINT_ORDER.md`.** A linha
70 declara *"o alvo é a 0.9.5 liberável para usuários reais"*. Nada nos degraus
0.9.5 a 0.9.7 mede isso, e a medição de 24/08 mostra por quê:

- `scripts/check_packaging_parity.sh:882` **pula seis dos sete empacotadores em
  silêncio** por um `|| continue`, testa um e imprime `[ OK ]`. O `.deb` é o
  único que leva `doctor.sh` **e** `bluez_config.sh`; Fedora, Arch, Nix, Flatpak
  e os dois AppImage não levam nenhum dos dois.
- A Z7 mediu **cinco presunções de ambiente** que quebram o produto para quem não
  é ela — e uma delas está acontecendo na máquina dela agora.
- A frente 16 (instalação e empacotamento) tem 8 sprints, dono único, e o
  `SPRINT_ORDER.md` diz textualmente: *"nada disto aparece em aba nenhuma e sem
  isto não há 0.9.5"*.

**Critério verificável.** O portão que já existe, **com a mordida consertada**:
`bash scripts/check_packaging_parity.sh` sem o `|| continue` que engole seis dos
sete, mais um ciclo `uninstall` → `install --yes` num `HOME` limpo que termina com
o daemon vivo e a GUI abrindo. Regra da casa que já vale aqui: **toda cura entra
no install, sem flag.**

**O que falta hoje:** 8 sprints da frente 16, o `|| continue`, e as cinco
presunções da Z7 — das quais a Z7 já entregou a cura, sem a palavra dela.

**Quem destrava: agente**, com uma máquina ou um contêiner limpo. Ela não entra.

**Custo: NÃO VERIFICADO.** Não medi as 8 sprints da frente 16 uma a uma.

---

### 1.0.0 — duas semanas sem ela reclamar

> **Para quem usa:** o produto passou duas semanas sendo usado e não deu motivo
> para uma queixa nova.

É a régua dela de 15/08 — *"com duas semanas sem novas sprints teremos a versão
1.0"* — **com o contador trocado, e o motivo está na seção 3.**

**Critério verificável.** Arquivo a nascer:
`scripts/check_janela_de_observacao.py` <!-- ref-externa: não existe ainda; nasce junto com este degrau -->.
Conta, nos `docs/process/sprints/*.md` criados nos últimos 14 dias, quantos
nasceram **da voz dela** — o mesmo marcador que já existe no repositório e que
hoje casa em 51 arquivos (`queixa dela`, `relato dela`, `na voz dela`, `palavras
dela`, `ela relatou`). Sai zero quando a contagem for zero por catorze dias
corridos.

Sprint nascida de agente lendo código **não conta**, e a seção 3 explica por quê.

**O que falta hoje:** o maior intervalo já observado sem sprint nascida da voz
dela é de **quatro dias** (11/08 → 15/08). Catorze é ambicioso, mas é o tipo de
número que **cai quando o produto melhora** — que é o serviço que uma régua de
release presta.

**Quem destrava: ela, usando.** Custo de agente: **zero por construção** — se um
agente precisa trabalhar, a janela reiniciou.

**E depois da 1.0?** O clean-room (`CR-01` a `CR-06`, `CR-SEQUENCIA-01`,
`METODO-01`), que a **D-J** já pôs declaradamente fora da 0.9.5. Ele é 1.x, e não
entra nesta escada.

---

## 3. A confrontação: "duas semanas sem sprint nova" é inalcançável por construção

O critério de 15/08 conta **sprints novas**. Medi o que esse contador faz nesta
casa, com o prefixo de data do nome do arquivo:

```
$ ls docs/process/sprints/*.md | grep -oE '^2026-[0-9]{2}-[0-9]{2}' | sort -u | wc -l
30        # dias distintos com sprint nova, num projeto de 31 dias
```

**Em 31 dias de projeto, nasceu sprint em 30 deles.** O único dia sem foi
**20/08**. O maior intervalo já observado sem uma sprint nova é de **um dia**. A
média é de **9,3 sprints por dia**; a semana de pico teve **81**; e nos dois
últimos dias nasceram **29** — 5 em 23/08 e 24 em 24/08.

**Duas semanas sem sprint nova nunca chegou perto de acontecer, e o motivo não é
o produto estar ruim.** Nesta casa, uma sprint é como se registra um achado.
Enquanto houver agente lendo código, haverá sprint nova — o contador mede
**vazão de agente**, não **qualidade de produto**. Fechar a 0.9.6 não o zera: no
dia em que a fila acabar, o primeiro agente que abrir um arquivo escreve a
próxima.

Aplicado literalmente, esse critério tem duas saídas, e as duas são ruins: ou a
1.0 nunca sai, ou alguém para de registrar achado para o contador andar — que é
mentir para a régua.

**A correção é trocar o que se conta, não afrouxar o número.** O contador da
1.0.0 passa a ser *sprint nascida da voz dela*. Esse número:

- **existe e é medível hoje** — 51 arquivos, marcador já em uso;
- **cai quando o produto melhora**, que é o único comportamento útil numa régua
  de release;
- **tem histórico plausível** — o maior intervalo observado é de quatro dias,
  contra um dia do contador antigo. Catorze é meta, não fantasia.

**O critério de 15/08 não se apaga.** Ele ganha nota datada no `CHANGELOG.md`: o
número "duas semanas" é dela e continua valendo; o que muda é **o que se conta
dentro da janela**, e o motivo é este parágrafo.

---

## 4. A escada em cinco linhas

| versão | o que significa para quem usa | quem destrava | o que falta hoje |
|---|---|---|---|
| **0.9.5** | o rádio para de mentir: o que a tela promete no Bluetooth é verdade | **os dois** — instrumento de agente, olho dela | R1=22, R2=30, R3=6/7, R4=98; dois adaptadores dos três; zero ensaios de quatro no rádio |
| **0.9.6** | a fila acaba: nada quebrado fica fora da fila | **os dois** — 51 de agente, 6 decisões dela (~35 min) | ~145 a ~185 sprints abertas; a régua não existe (2 defeitos + 32 sprints sem endereço) |
| **0.9.7** | **ela joga a mesa cheia** e o produto aguenta | **só ela** | 0 de 31 caixas do checklist; 2830 falhas de janela; 5 estouros no clique dela; 21 sprints esperando a palavra dela |
| **0.9.8** | funciona para quem não é ela | **agente** | 8 sprints da frente 16; o portão de empacotamento testa 1 de 7 e passa verde |
| **1.0.0** | duas semanas de uso sem uma queixa nova dela | **ela, usando** | o contador; hoje o recorde é 4 dias |

---

## 5. O que fica para ela — três perguntas fechadas

**P1 — o número tem três casas ou quatro?**
Ela escreveu ".95" e "96". A versão viva é `0.9.4.5`, de **quatro** níveis, e o
`CHANGELOG.md` documenta a quarta casa e a tradução `0.9.4+2` para SemVer.
> *A escada anda na terceira casa (`0.9.5` → `0.9.6` → `0.9.7` → `0.9.8` → `1.0.0`),
> ou continua na quarta (`0.9.5.1`, `0.9.5.2`…)?*

**Registro de honestidade:** a linha `D-ESCADA-DE-RELEASES` em
`docs/data/decisoes-dela.csv` afirma que *"ela confirmou 0.9.5 quando
perguntada"*. **Não consegui verificar essa confirmação** — não há transcrito
dela na minha entrada. Num arquivo cuja função é guardar a palavra dela, isso é
afirmação sem fonte, e fica marcado como tal até ela dizer.

**P2 — o Pro Controller e o 8BitDo entram na 0.9.5, ou ficam para a 1.0?**
A **D-J** já diz que cobertura de aparelho que ela não tem na mesa é 1.0. Se ela
confirmar, a pendência do mapa cai de **61 para 25** sem um minuto de bancada — é
a alavanca mais barata desta escada.
> *Confirma que a 0.9.5 mede o DualSense e mais nada?*
>
> **Contradição a resolver junto:** a §0.9/D-J diz que ela **não tem** o 8BitDo na
> mesa; a §0.6 pede *"uma medição de 2 minutos dela (ligar o 8BitDo em cada modo
> e anotar o MAC)"*. As duas não podem estar certas.

**P3 — a 1.0.0 conta sprint nova, ou sprint nascida da voz dela?**
A seção 3 mede que o primeiro contador nunca passou de um dia em 31, e que ele
mede vazão de agente, não qualidade de produto.
> *Troca o contador da janela de duas semanas para "sprint nascida de queixa
> minha", mantendo as duas semanas?*

---

## 6. O que ficou NÃO VERIFICADO

- **Custo de mão dela em quinze das dezesseis sprints da trilha de BT.** Só
  `A-CADEIA-DE-BLOCOS-01` declara preço (8 minutos). Não somei o que ninguém
  mediu. Uma passada de ~30 minutos carimbando custo-de-mão nas 16 resolve, e é
  barata porque as sprints já existem.
- **Custo em dias-agente das 51 sprints da 0.9.6 e das 8 da 0.9.8.** Nenhuma tem
  estimativa por sprint.
- **Custo das 31 caixas do checklist de hardware.** Nenhuma tem estimativa.
- **Quantas das 64 sprints mudas estão realmente abertas.** Amostra de 10 com
  semente declarada dá 8 a 47 (IC 95%). Estreitar exige triar as 64 à mão
  (~2 h), ou só as 32 sem endereço.
- **Se o restart do daemon cura a cegueira de janela.** O daemon vivo é de 23/08
  18h33; a cura da Z7 entrou em 24/08 03h27 — **o daemon vivo é mais velho que a
  cura**. Não reiniciei: é serviço dela, em uso.
- **Se a GUI exibiu "aplicado" nos cinco estouros de `trigger.set`.** Inferido do
  F1, **não observado na tela**.
- **Se algum dos degraus 0.9.5 a 0.9.8 aproxima o alvo dela** — *cada jogo local
  jogável no cabo E no rádio* — para além do que o mapa registra. Não há
  instrumento que meça "jogável no rádio" por jogo. O prontuário dos jogos não
  tem eixo de transporte, e continua com **zero importadores em `src/`**.

---

## 7. Ponteiros

- Critério canônico anterior e a nota que o substitui: [`CHANGELOG.md`](../../CHANGELOG.md), seção *Versionamento*
- A linha do tempo até a 0.9.5, as ondas e as frentes: [`SPRINT_ORDER.md`](SPRINT_ORDER.md) §0.12
- As sete perguntas de rádio dela e a trilha D2: [`SPRINT_ORDER.md`](SPRINT_ORDER.md) §0.7
- O que está aberto, curado à mão: [`SPRINT_ORDER.md`](SPRINT_ORDER.md) §3
- Os quinze defeitos de forma e as quatro regras de regência: [2026-08-23-ONDE-PARAMOS](2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md)
- O checklist de hardware, 0 de 31: [CHECKLIST-validacao-em-hardware](sprints/2026-07-25-CHECKLIST-validacao-em-hardware.md)
- A regra do olho dela: [PROVA-DE-TELA-01](sprints/2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md)
