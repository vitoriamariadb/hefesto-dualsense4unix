# ONDE PARAMOS — a aba que nasceu, e as quatro réguas que mentiam

- **Escrito em:** 22/08/2026, no fim do dia, na branch `dev`.
- **O que esta página é:** a **porta de entrada**. Ela sucede o
  [2026-08-16-ONDE-PARAMOS](2026-08-16-ONDE-PARAMOS-a-sessao-de-vinte-horas.md),
  que continua valendo para o que mediu — o rádio meio mudo, o áudio e as
  cinco armadilhas daquele dia. Deixou só de ser o retrato de hoje.
- **O ponteiro do `CLAUDE.md` foi repontado para cá, e ele NÃO viaja.** Medido:
  `git check-ignore -v CLAUDE.md` → `.gitignore:90`. O arquivo é local por
  construção, então "repontar a linha do `CLAUDE.md`" é gesto **por máquina** e
  nenhum commit o resolve para os outros. É por isso que o de 16/08 pediu a
  ação de um minuto duas vezes e ela nunca "pegou": não havia como pegar.
- **O que ela pediu, textual:** *"manda agentes documentarem e corrigirem a
  documentação no final com as novas descobertas, e o que ficar por fazer
  documenta em novas sprints. Sempre pensando na próxima sessão sem contexto."*
- **O que este dia foi, medido:** **53 commits** entre 04h03 e 22h00,
  **199 arquivos**, +41.938 e −1.219 linhas. Vinte módulos novos em `src/`,
  dezenas de arquivos de teste novos, e treze sprints. Medido com
  `git log --oneline 985b41a..HEAD | wc -l` **contra o HEAD `4272438`** — a
  árvore ainda andava enquanto esta página era escrita, e o número sem a âncora
  seria falso amanhã.
- **Grau desta página:** compilação. **Nada aqui foi medido com o controle na
  mão.** As contagens de árvore (contadores, chamadores, colunas do mapa)
  foram rodadas por esta passagem e o comando está ao lado. Tudo que é bancada
  vem citado do commit ou da sprint que o mediu.

**Se você tem cinco minutos:** leia a §2 (as armadilhas — é a seção mais cara
do dia) e a §4 (o que está aberto). Se tem quinze, some a §3, que é a lista do
que **não** se deve refazer.

---

## 0. A MADRUGADA DE 23/08 — o que aconteceu DEPOIS desta página

> Escrito em 23/08/2026, por uma passagem de auditoria de perda, sobre o que
> ficou só na conversa e ia se perder na compactação. Nada foi commitado.

**Três sprints novas, e uma que fechou:**

| sprint | o que é | grau |
|---|---|---|
| [ENGASGO-VULKAN-01](sprints/2026-08-23-ENGASGO-VULKAN-01-sessenta-quadros-por-segundo-e-setenta-engasgos-por-minuto.md) | a queixa de meses do Sackboy: a FORMA do defeito medida e nove suspeitos eliminados. Suspeita: a camada Vulkan implícita do EOS. **O A/B foi lido em 23/08 e DERRUBA a hipótese** — sem a camada tudo piora, e as duas sessões rampam igual | **evidência CONTRÁRIA** |
| [ESCONDE-SÓ-O-HIDRAW-01](sprints/2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md) | a cura do Steam Input esconde o `hidraw` e deixa `evdev`/`joydev` do mesmo controle abertos. **16 nós de jogo para 4 controles, sem Steam aberta** | MEDIDO |
| [DAEMON-ACORDADO-01](sprints/2026-08-23-DAEMON-ACORDADO-01-quinze-por-cento-de-um-nucleo-sem-ninguem-jogando.md) | **15,2 % de um núcleo em repouso**, 6.393 `read()`/s. Ninguém conhecia o número | MEDIDO |
| MASCARA-QUE-GRUDA-01 | **FECHOU.** A E1 mandava remedir a H1 — que já fora remedida em 22/07, em três jogos nomeados | — |

**A armadilha da madrugada, e ela é a mais cara:** *uma hipótese bem escrita
sobrevive à medição que a derruba.* A investigação concluiu que os nós hidraw
por rádio ficam `0600` porque *"`uaccess` não concede em aparelho sem assento"*.
Quatro medições derrubaram isso — a etiqueta `uaccess` **está** lá, a regra da
casa **casa**, ela é três dias mais velha que os nós, e os vpads no **mesmo**
`/devices/virtual/misc/uhid/` recebem ACL. A causa era o próprio produto
(`hidraw_broker.hide()`), e descobrir isso trocou um falso problema de
permissão por um defeito real de produto. **Duas armadilhas novas de
instrumento** entraram no
[COMO-OLHAR-A-TELA](COMO-OLHAR-A-TELA.md): a metade GPU do MangoHud escrevendo
zero, e o endereço de rádio truncado fundindo dois adaptadores.

**Fatos errados substituídos nesta passagem** (a regra é sair de TODOS os
lugares):

| fato que caiu | onde estava | o que é medido |
|---|---|---|
| *"a H1 nunca foi reconferida"* — **na tela dela** | `profiles_actions`, `uinput_gamepad`, `interface.md`, a sprint, **e um teste que a pinava** | remedida em **22/07** (HARMONIA-MASK-01), em Sackboy/Mad King/Pragmata |
| *"o daemon usa `xbox` numa instalação nova"* | `uinput_gamepad.py` | **`dualsense`** — medido num `XDG_CONFIG_HOME` vazio |
| *"máscara Xbox tira esses **dois**"* | `controller_card.py` | **três** — o acelerômetro cai junto. A outra frase já dizia três |
| *"~392 Hz é o sustentado máximo do rádio"* | `driver-hid-playstation.md` | ~800/s é orçamento do **ADAPTADOR**, repartido: 392 é metade, e o adaptador dela hospeda dois controles |
| *"`esportes` e `fps` já estão em dualsense"* | sprint + `SPRINT_ORDER` | só `esportes`; `fps.json` **não tem seção `mode`** |
| *"um dongle de teclado e um de caixa de som são o mesmo VID:PID"* | `CHANGELOG.md` | o kernel classifica pela **classe da interface** |
| *"`grep 'Disconnect(' src/`"* e *"`ler_a_mesa` tem zero chamadores"* | esta própria página | comandos/números que não se sustentam — corrigidos acima |

**Dois portões consertados.** O de anonimato ficou **vermelho** no instante em
que os `.csv.gz` de frametime entraram na árvore: acusou três MACs que **não
existem** — eram os três bytes do OUI casando por acaso no envelope comprimido.
Ao consertar apareceu o buraco de verdade, medido: **um MAC em ASCII dentro de
um `.gz` passava por TODOS os portões** (o de texto não descomprime; o de bytes
procura o OUI cru, não a forma escrita). Os dois agora varrem o **conteúdo**, e
as quatro mordidas (ASCII, big-endian, little-endian, e o mascarado que deve
passar) estão conferidas. A cura NÃO foi pôr `.gz` na lista de pulados — isso
cegaria o portão para o caso que ele existe para pegar.

**E uma regressão:** `test_faxina_de_testes.py` estava **vermelho na
árvore** desde 22/08 — apagaram `test_preset_flavor_migration.py` <!-- ref-externa: o arquivo foi APAGADO em 22/08 e a ausência dele é o assunto da frase --> sem repontar
quem o lia. Repontado, e a régua ganhou a forma de escrita nova que não
enxergava (senão ficaria verde por cegueira, que é pior).

**O censo de sprints órfãs é um NÃO-ACHADO — e custou TRÊS réguas erradas para
chegar nele.** O número final, medido: **246 sprints na raiz, 183 com marcador
de estado, 63 sem; das 63, 23 são índices/checklists (que corretamente não têm
estado), e das 40 restantes 36 já estão no `SPRINT_ORDER.md`. Sobram QUATRO** —
e as quatro são documento de retomada/organização, não sprint com entrega
pendente. **Não há backlog escondido nas órfãs.**

> As três réguas que erraram antes disso, todas da mesma família: (1) um apelido
> com prefixo de data opcional capturava `2026-08`, que casa com quase toda
> linha; (2) uma passagem afirmou que essa régua tinha sido consertada **sem
> nunca a ter rodado**, e dois subagentes trabalharam 20 min sobre a premissa
> inventada; (3) a régua "consertada" procurava `**Estado:**` e perdia
> `- **Status:**` — que é a forma MAIS COMUM da casa, com **90** ocorrências —
> e a de negrito aninhado (`- **Status:** **VALOR**`). Foi um subagente que
> derrubou a terceira, com a prova no próprio lote que ela lhe mandou.

---

## 1. O que MUDOU hoje, em cinco frentes

### 1.1 A aba Configurações nasceu inteira — a décima primeira

Nove sprints, de [CONFIG-01](sprints/2026-08-21-ABA-CONFIGURACOES/CONFIG-01-a-aba-existe-e-esta-vazia.md) a [CONFIG-09](sprints/2026-08-21-ABA-CONFIGURACOES/CONFIG-09-esta-tudo-certo.md), todas fechadas, com cinco seções vivas:
**"Está tudo certo?"**, **"Os controles"**, **"A mesa"**, **"Orçamento"** e
**"A janela"**. Nasceu junto a camada que faltava: `~/.config/hefesto-dualsense4unix/maquina.json`
(`utils/maquina.py`, handler `machine.declare`) — este projeto não tinha onde
guardar o que vale para a MESA e não para o jogo.

O que cada seção resolve, e por que não é enfeite:

| Seção | O que ela responde | De onde ela lê |
|---|---|---|
| Está tudo certo? | os cinco exames do `doctor.sh` em uma linha, para quem não abre terminal | `integrations/exame_da_mesa.py`, chamado também PELO doctor — terminal e aba não podem divergir |
| Os controles | um card por controle, com a borda na cor do plástico lida do aparelho | `integrations/cor_do_plastico.py::ler_pelo_cabo`, que saiu de `scripts/ensaios/` e entrou no produto |
| A mesa | onde cada adaptador está fisicamente, e quem mais disputa os 2,4 GHz | `/sys`, sem root, sem subprocesso, sem IPC |
| Orçamento | Economia/Balanceado/Máximo/Auto como **teto da mesa inteira** | `core/rumble._effective_mult` |
| A janela | tamanho do texto, ambiente, bandeja, ligar junto | XDG e as preferências da janela |

Detalhes que a próxima pessoa precisa saber antes de mexer: a aba é **diferida**
(o gesto acumula no rascunho, quem grava é o **Aplicar** do rodapé), menos "A
janela", que grava na hora — e desde `0ef6300` **a tela diz qual das duas é**,
com portão por AST. Cada seção mora no próprio arquivo em
`app/actions/config/`, e a ORDEM das cinco mora só em `secoes.py`.

### 1.2 Cinco defeitos que a construção revelou, todos curados

Nenhum deles foi procurado: apareceram porque a aba obrigou a olhar.

1. **O carimbo de ponte evaporava a cada "Salvar Perfil"** (`d0e7a0e`).
   `Profile.ponte` é o que faz a escada de `integrations/ponte_escada.py` parar
   em vez de recomeçar do primeiro degrau — e recomeçar significa recriar o vpad
   com o jogo aberto. `to_profile` reconstruía o Profile do zero e o deixava de
   fora. Passthrough somente-leitura, mais um carimbo no rodapé para o caso de
   salvar por cima de OUTRO perfil, mais a regra de que quem estreia nasce sem
   carimbo (o "Duplicar" herdava, e o gesto seguinte é repontar a cópia).
2. **O gate do microfone era por SEÇÃO e devia ser por CAMPO** (`d0e7a0e`).
   Mexer no volume levava junto um flag de botão de mic que nenhuma superfície
   escreve — viajava o default de fábrica, e do outro lado ele derrubava calado
   um `False` do `DaemonConfig`.
3. **Duas telas desenhavam o arquivo de ontem** (`d15055f`): a caixinha do Steam
   Input (dois escritores fora da aba Perfis) e o interruptor do teclado (o
   gesto `PS + R3` virou um segundo escritor). Nos dois casos o clique seguinte
   valia a posição DESENHADA, não a do disco.
4. **As regras udev 82 e 83 eram enfeite em quem instala por pacote**
   (`ab49f25`, `e04f887`). A regra viajava nos cinco instaladores; o alvo do
   `RUN+=`, em nenhum. A 83 mandava iniciar uma unit inexistente a CADA conexão
   Bluetooth, e o salva-vidas de bonds nunca gravou uma linha para essas
   pessoas. Dívida medida em 07/08 e fechada hoje, com `TEST==` nas regras para
   ficarem inertes em vez de falharem.
5. **A seção "A mesa" não gravava nada** (`9b2389b`). O `TODO(CONFIG-03)`
   sobreviveu à camada que ele esperava — nascida no MESMO dia. Escolher
   "Acima" na altura da antena, fechar a janela e reabrir: a escolha não estava
   lá, e nada avisava.

### 1.3 O Sackboy, e o padrão que ele revelou — ELO-MUDO-01

A queixa dela: *"o perfil do sackboy não tá aplicando as features das abas que
eu seto e clico em salvar"*. **Nenhum elo estava quebrado.** O perfil grava
certo, o `match` casa, a ativação sabe aplicar tudo. Ninguém a chamava: o
lançamento aplicava **duas seções de oito** — a supressão e, fora da allowlist,
o `mode`. Gatilho, luz, vibração, som e microfone esperavam o autoswitch, que
espera a classe da janela, **que respondeu `unknown` por 21 minutos seguidos**
(`reason="sem_foco_x"`, `useful_age_sec=1276`) com o jogo aberto.

**O padrão, que vale mais que o conserto: o produto responde pelo TRANSPORTE e
nunca pelo EFEITO.** `apply_draft` devolvia `status: ok` com uma seção morta
dentro; `profile.switch` nomeava quatro seções e nunca citava gatilho e luz
quando davam certo. Ausência de notícia não distingue "aplicou" de "nem
tentei" — e quem lê conclui que não entrou, que é literalmente a queixa dela
sobre a aba Gatilhos.

Curado em `62d092a` (o lançamento ATIVA o perfil, com `origin="launch"` que não
fura o lock manual de 30 s nem grava `session.json`) e `b68223e` (o relatório
passa a nomear gatilho, luz e teclado, este com três estados distintos). Provado
ao vivo no daemon dela. **E na allowlist também**, porque é decisão registrada
dela: a allowlist do Steam Input **não** tira o Hefesto da frente — o que ela
pula é a DISPUTA PELO CONTROLE (`kind`), nunca o resto do perfil.

O diagnóstico inteiro, elo por elo, está em
[ELO-MUDO-01](sprints/2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md).

### 1.4 A máscara: o que o jogo ENXERGA, e ela persiste até ELA mudar

Duas curas irmãs, e as duas vieram de premissa minha derrubada por journal:

- **A allowlist não pode pular o `gamepad_flavor`** (`c9859ff`). O `mode` carrega
  DUAS coisas: o `kind` (a disputa pelo controle, que a allowlist existe para
  pular) e o `gamepad_flavor` (o que o jogo enxerga). Com o físico escondido, o
  vpad é tudo o que o jogo tem — e **um vpad Xbox não tem campo de touchpad,
  acelerômetro nem giroscópio no descritor HID**. A allowlist estava REMOVENDO
  features em vez de preservá-las.
- **A máscara persiste até ela mudar na interface** (`2b11172`), que é decisão
  dela de hoje. Eu tinha afirmado que a máscara voltava para `xbox` ao fechar a
  Steam; o journal mostra o contrário — ela ficou `dualsense` das 19:02 às
  19:41, com jogo abrindo e fechando. **Quem revertia era a borda de processo**,
  sempre na troca de pid, nunca dentro de um: o flag no disco estava `xbox`
  desde as 03:37 e o restore de boot relê o disco. Quem fosse atrás disso na
  saída do modo jogo não acharia nada.

O eixo foi partido em dois, e o preço está dito: **LIGA/DESLIGA continua 100%
R-07** (perfil não cria nem apaga o flag, o opt-out dela é permanente);
**MÁSCARA passa a ser o último gesto**, manual ou de perfil. Grava só o que o
vpad VESTIU de verdade — máscara adiada por jogo aberto não chega ao disco.

### 1.5 A luz: a lâmpada não se lê, o nascimento sim — BARRA-MUDA-01

A pergunta era achar um sinal honesto de *"a barra está acesa"*. **A resposta é
que ele não existe** — e existe outro, melhor: *"esta conexão nasceu
condenada?"*.

Medido com o olho dela como testemunha, **6 de 6**: quatro instâncias travadas e
duas sãs vivas ao mesmo tempo, e a única diferença entre elas está no journal —
`lightbar_escritor_cru_detectado` numa linha por conexão travada, e zero nas
sãs. O pid era o da Steam.

**O fato que muda o desenho do produto: matar o culpado NÃO cura.** As duas
sujas continuavam travadas com a Steam morta havia uma hora. O defeito é gravado
no nascimento e só sai na reconexão. **E isso explica o alerta dela de 12/08** —
*"reconectar cura é um falso positivo recorrente"*. Ela estava certa, e a
conclusão anterior não estava errada: estava **incompleta**. Reconectar só cura
se a mesa estiver limpa NA HORA.

Duas perguntas, duas funções, nunca a mesma: `ler_a_mesa()` é diagnóstico (esta
instância nasceu limpa?) e `limpo_para_conectar()` é prognóstico — e é ela que
guarda o botão. O módulo **nunca** diz "acesa" nem "apagada", e há teste que
reprova se passar a dizer.

Saiu junto o botão que a cura nunca teve (`8b167cc`): **"A luz não acende"**, um
por card, sempre visível e só acionável no rádio. O produto **não reconecta** —
ele derruba e espera o PS dela — e isso é entrega, não falta: `gesto_de_reconexao`
não tem função `reconectar` de propósito.

### 1.6 A auditoria de viés de bancada

Ela pediu assim: *"vai ficar pra sempre naquela de 'no meu pc funciona de boa'"*.
Quatro varreduras saíram atrás disso, e viraram quatro sprints
([LUZ-CEGA-01](sprints/2026-08-22-LUZ-CEGA-01-a-barra-apagada-e-o-exame-que-nao-olha-o-radio.md),
[N-IGUAL-A-UM-01](sprints/2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md),
[NO-MEU-FUNCIONA-01](sprints/2026-08-22-NO-MEU-FUNCIONA-01-o-ambiente-que-o-produto-presume-sem-medir.md)
e [UMA-FAIXA-NÃO-É-UM-FABRICANTE-01](sprints/2026-08-22-UMA-FAIXA-NAO-E-UM-FABRICANTE-01-o-pro-dela-virou-a-definicao-de-pro.md)).
Os achados já curados:

- **O exame da luz não enxergava CONTROLE NENHUM no rádio** (`29c8a19`). O
  `check_lightbar_*` filtrava o nosso vpad **pelo CAMINHO**
  (`*/devices/virtual/*`), e o BlueZ moderno entrega HID por **uhid**, que é
  `misc` virtual — então todo DualSense de rádio mora ali. Com quatro controles
  no rádio o doctor imprimia *"sem DualSense físico com nó de LED agora"*:
  **zero de quatro**. O filtro passou a ser por IDENTIDADE (`HID_PHYS`), e ficou
  quatro de quatro.
- **O `head -1` armava a cura no adaptador errado** (`e5376a0`). Com os três
  adaptadores dela, o `bt_active_mode.sh` prefixava `Nintendo` no que não
  hospeda Nintendo nenhum — e a vigia roda a cada 2 min reafirmando o alvo
  errado. Quem hospeda o quê sai do `HID_PHYS` do uevent, sem root.
- **O OUI do 8BitDo dela virou a definição de 8BitDo** (`e5376a0`). Faixas de
  OUI concretas usadas como identidade de MODELO; quem tiver outro lote recebe
  outro comportamento e nada avisa. Nasceu `core/linhagem_nintendo.py` para
  separar vocabulário de protocolo (`057e:2009` é o Pro) da bancada desta casa.
- **A tela acusava a Steam de escrever, e quem escreve somos nós — 426 a 1**
  (`993e89c`). Medido com `btmont`, 32 s cada: daemon parado = 1 escrita de cor;
  daemon rodando = 426 reports. O campo `disputada=True` está CERTO; errada era
  a FRASE derivada, que mandava procurar o problema na Steam.
- **Sete quadros de rádio onde bastava um** (`993e89c`). `set_rgb` escrevia dois
  e `set_players` cinco — sete reports idênticos por controle por reconciliação.
  Com quatro controles no rádio são 28 quadros onde bastam 4, e o `dmesg` dela
  já mostrava `input CRC's check failed`.

**E um achado NEGATIVO, que vale tanto quanto:** o caminho da luz **não** tem a
doença do `hci0`. Endereçamento por MAC do começo ao fim, e o fio mostra os três
adaptadores escritos no mesmo milissegundo.

### 1.7 O mapa de canais ganhou a coluna que separa DÍVIDA de DECISÃO

O mapa é portão, e tinha um buraco que impedia o portão mais óbvio de existir:
não distinguia *"não faz ainda"* de *"decidiu não fazer"*. A contagem crua dizia
20 linhas medidas e não acionadas no cabo e 21 no rádio — mas
`identidade.revisao_de_placa` não é acionada porque o próprio mapa diz *"NÃO É A
COR"*: não ler é o certo.

Rodado por esta passagem sobre `docs/data/mapa-controles.csv`:

```
cabo  {'nada-a-acionar': 10, 'decisao-tomada': 8, 'so-ela-decide': 1, 'divida': 1}
radio {'nada-a-acionar': 10, 'decisao-tomada': 7, 'so-ela-decide': 1, 'divida': 3}
```

**A dívida real são quatro linhas, e cada uma tem nome:** `movimento.imu.perda`
no cabo (DualSense); e no rádio `audio.saida_dedicada@dualsense`,
`identidade.cor_do_aparelho@dualsense` e `movimento.imu.perda@pro`.

---

## 2. As armadilhas que este dia acrescentou

### 2.1 A família campeã — QUATRO réguas que conferiam a si mesmas, em um dia

Esta é a seção mais valiosa da página. Quatro instrumentos, no mesmo dia,
mediam a si próprios e davam verde:

| # | Onde | O que a régua fazia | Como foi pego |
|---|---|---|---|
| 1 | `_GerenteEspiao` (`c9859ff`) | anotava os kwargs da **construção** e nunca chamava o applier. Com `mode_applier=None` ele jurava "o modo está pulado" sem jamais ter perguntado | o dublê passou a CHAMAR o applier, como `ProfileManager.activate` chama |
| 2 | o teste da fábrica (`62d092a`) | **iterava `APPLIERS_DO_DAEMON` para conferir `APPLIERS_DO_DAEMON`** — passava com um par arrancado | a contagem independente passou a ser os campos `*_applier` do dataclass |
| 3 | o teste do vigia (`36ac2ca`) | comparava `cmd[3]` com `da.GUARDA_STEAM_INPUT_TIMER` — **a régua conferindo a constante sob teste**. Trocando a constante por `"unidade-que-nao-existe.timer"`, os 14 testes ficavam verdes | a régua passou a ser o ARQUIVO em `assets/` |
| 4 | `scripts/gui-captura/retratar_abas.py` (`2a614c3`) | montava os 19 modos À MÃO, com um `pack_start(sel, True, True, 0)` **que não existe no produto**. Medido: montagem à mão 1016px, método de produção 482px | portão novo `test_a_foto_monta_como_o_produto_monta.py`, que lê a árvore de sintaxe do retrato e confere a lista de mixins contra o PRODUTO |

**O quarto é o mais caro dos quatro, e a razão não é técnica: ELA DECIDIU A FILA
DE INTERFACE OLHANDO AQUELA FOTO.** O vazio da aba Gatilhos que motivou a
decisão era do INSTRUMENTO. A ironia estava escrita no próprio arquivo: o
docstring dizia, sobre os RÓTULOS, que *"uma lista copiada aqui viraria um
segundo dono, e a foto passaria a mentir"* — a regra estava certa e foi aplicada
só à metade. Os rótulos vinham da fonte única; o LAYOUT era cópia.

A distinção que separa este portão de um estorvo: **injetar DADO na bancada é o
trabalho do script e é o que protege a privacidade dela; injetar LAYOUT é o
defeito.**

### 2.2 Testar a cura e deixar o gatilho solto

`de55264`: arrancar as três chamadas de `_talvez_semear_jogos()` e pôr `pass`
deixava **2034 testes verdes** — os 31 da própria frente e toda a vizinhança de
perfis. Nenhum teste chamava as portas de carga; os nomes só apareciam em
docstring. A decisão dela inteira (*"é automático, não é botão"*) morava em três
linhas sem régua.

Irmão disso em `85540ed`: o teste da costura da aba montava a página pelo helper
comum, que **não injeta controle nenhum** — sem card não há espaçador, sem
espaçador não há `vexpand`, e o teste passava com a cura arrancada.

**A regra que sai daí:** teste que exercita a cura sem exercitar QUEM A CHAMA
não é mordida. E dublê que monta um cenário mais pobre que o real não mede o
defeito real.

### 2.3 O instrumento reprovava na máquina de quem trabalha, e passava no CI

`8f6c0e7`: nove testes de CLI reprovavam ou passavam **conforme o terminal**.
O `rich` decide colorir na CONSTRUÇÃO do `Console()`, que acontece no import de
cada `cli/cmd_*.py`, e `\x1b[36mControle` não contém `Controle 2 — BT`. O
gatilho foi o `FORCE_COLOR=3` que o terminal do agente exporta — e a precedência
do `rich` é `FORCE_COLOR` acima de `NO_COLOR`: desligar a cor pelo caminho normal
não basta, é preciso TIRAR a variável. A cura mora no topo do `conftest`, antes
de qualquer import do produto: uma fixture, mesmo `autouse` e de sessão, roda
DEPOIS da coleta, e a coleta já importou os `cmd_*.py`.

### 2.4 Três portões acusavam quem fazia a coisa certa

Em `2f9af26` e `9b2389b`: um congelava a lista de módulos traduzidos com `==`
onde a própria mensagem dizia *"ganhar módulo aqui é bom"*; outro dependia de um
defeito do gerador para ter objeto (o gerador foi curado e o teste perdeu o
alvo); o terceiro acusava *"tem"* ao lado de *"têm"*, que são palavras
diferentes — a isenção do validador de acentuação é por PAR, nunca por palavra.
E em `2a614c3`, o portão novo reprovou uma aba que estava certa na primeira
execução, porque a régua só olhava import direto.

**Portão que acusa quem fez a coisa certa ensina a desligá-lo.** É defeito de
portão, e tem de ser tratado com a mesma urgência que defeito de produto.

### 2.5 O backlog nasce defasado quando quem cura não fecha a linha

Lição registrada hoje no `SPRINT_ORDER.md`: o commit `c4471a1` curou o
`docs/data/LEIA-PRIMEIRO.md` e, no MESMO commit, escreveu os quatro buracos dele
como abertos. O agente seguinte gastou a sessão remedindo buraco já curado.

Isto se repetiu **dentro deste dia**, e por isso está aqui: a
[BARRA-MUDA-01](sprints/2026-08-22-BARRA-MUDA-01-a-lampada-nao-se-le-o-nascimento-sim.md)
registrou às 20h38 que *"`Disconnect` do BlueZ continua com zero chamadores em
`src/`"*. Às 21h19 o botão "A luz não acende" entrou e passou a chamá-lo.
Conferido em 23/08: `grep -rn 'Disconnect(' src/` **não devolve nada** — a
chamada é a string `"Disconnect"` dentro de um argv, e a régua certa é
`grep -rn '"Disconnect"' src/` → `integrations/gesto_de_reconexao.py:234`. O
fato está certo; o comando que esta página mandava rodar estava errado, e quem
o rodasse concluiria que o chamador sumiu. e `limpo_para_conectar` é chamada em
`app/actions/config/secao_controles.py:1110`. **Quem lê uma sprint de hoje tem
de conferir contra a árvore antes de agir sobre o que ela declara aberto.**

---

## 3. O que NÃO se deve refazer — cada um com a medição que fecha

| Não faça | Por quê, e onde está medido |
|---|---|
| **Atualizar o firmware dos três dongles** | Não muda nada: o limite é de especificação, não de firmware — BR/EDR divide o tempo em fatias de 625 µs desde o começo, o que dá 1.600 fatias/s por adaptador (`integrations/radio_da_mesa.py:83`). A conta da sala está em [GUIA-RADIO-DA-SALA.md](../../GUIA-RADIO-DA-SALA.md) §2: cinco controles pedem ~1.385 transações/s contra 1.600 de UM adaptador; três adaptadores dão 4.800. Quem quiser mais folga acrescenta adaptador, nunca firmware |
| **Reintroduzir o `0x08` (`RELEASE_LEDS`) como cura da lightbar** | Ele foi removido em 04/08 porque **CAUSAVA** o travamento: 7 eventos de correlação perfeita. Medido de novo hoje no fio: **0 de 776** reports carregaram `RELEASE_LEDS`. O texto que ainda o chamava de "A CURA" num arquivo e "o CULPADO" no outro foi substituído em `993e89c` |
| **Matar a Steam para curar a barra travada** | Não cura. As duas instâncias sujas continuaram travadas com a Steam morta havia uma hora. O defeito é gravado no nascimento e só sai na reconexão — e a reconexão só cura se a mesa estiver limpa NA HORA |
| **Usar o carimbo de tempo do sysfs como relógio de nascimento** | Derrubada por pouco, e quase virou alicerce: um `ls -la` batia com o kernel; sete minutos depois o `os.stat()` deu o MESMO instante nos quatro. É artefato do cache de inode do VFS |
| **Usar a bateria como sinal de que a barra acendeu** | Morta em definitivo: o `ps-controller-battery` registra `capacity present scope status` e nada mais. Não é ruído demais — o arquivo não existe |
| **Trocar a régua do portão A-CASA-SABE por "chamador fora do próprio arquivo"** | Já medido em 12/08: acusa 846 símbolos. A régua que ficou é alcance a partir dos pontos de entrada declarados, pelo grafo de import, com o nome resolvido ao módulo (`61ba2ab`) |
| **Contar `/dev/input/event*` para saber se a suíte sujou o kernel** | Cego por construção: o nó morre quando o descritor que o criou fecha, e isso é dentro do próprio teste. Há teste que prova a cegueira criando um nó de verdade. A régua que ficou é a PORTA (`uinput.Device`, `evdev.UInput`, o `os.open` de `/dev/uinput` e `/dev/uhid`) |
| **Procurar a reversão da máscara na saída do modo jogo** | Nem `reverter_modo_jogo_padrao` nem `_desfazer_modo_do_perfil` tocam em flavor. Quem revertia era a borda de processo |
| **Prometer no medidor de rádio que a mesa cheia estraga o controle** | Dois controles no mesmo adaptador já diferiram 381 contra 191 Hz **com a mesa folgada**, e o motivo continua aberto. `PALAVRAS_DE_CULPA` é portão |

---

## 4. O que está ABERTO, e de quem é

A fila com ordem e custo está no
[SPRINT_ORDER.md](SPRINT_ORDER.md). Aqui fica só o que a noite abriu e o que
mudou de dono.

### 4.1 Trabalho de código — ninguém precisa decidir nada

| O quê | Onde | Medido por esta passagem |
|---|---|---|
| **O sinal da barra só está ligado pela metade** | [SINAL-NO-NASCIMENTO-01](sprints/2026-08-22-SINAL-NO-NASCIMENTO-01-o-veredito-existe-e-o-hotplug-nao-pergunta.md) | o botão consulta `limpo_para_conectar`; o tique de hotplug não carimba nada, e `sinal_da_barra.ler_a_mesa` não é chamada nem pelo daemon nem pela janela (tinha um chamador: o `main()` da CLI do próprio módulo — dizer "zero chamadores" era endurecer o número). **Fechado em 22/08 à noite:** `daemon/connection.py:1031` passou a chamá-la |
| **A fábrica do `ProfileManager` tem UM cliente** | [A-FABRICA-COM-UM-CLIENTE-01](sprints/2026-08-22-A-FABRICA-COM-UM-CLIENTE-01-a-saida-do-modo-nativo-perde-um-applier.md) | `gerente_do_daemon` é chamada em 1 lugar; 12 construções diretas de `ProfileManager` seguem em `src/`, e **a saída do Modo Nativo passa 6 dos 7 appliers** |
| **Mover um controle de adaptador continua sendo terminal** | [CENTRAL-SEM-TELA-01](sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | as E1 e E3 fecharam às 21h48 (`49797f8`), 48 min depois de a sprint ser escrita; o helper privilegiado segue com 7 verbos e **nenhum chamador Python** |
| E3 a E7 da ELO-MUDO-01 | [ELO-MUDO-01](sprints/2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) | a tela do que está valendo, o appid do wrapper como fonte de match, o Proton por jogo, e o portão da família |
| E2 a E5 da N-IGUAL-A-UM-01, E1 a E7 da NO-MEU-FUNCIONA-01, E2 a E4 da UMA-FAIXA | as três sprints da auditoria | o `head -1` que sobrou, a Steam Flatpak, a bandeja fora do COSMIC, o XWayland |
| E3, E4, E6 e E8 da LUZ-CEGA-01 | [LUZ-CEGA-01](sprints/2026-08-22-LUZ-CEGA-01-a-barra-apagada-e-o-exame-que-nao-olha-o-radio.md) | inclui tirar quatro MACs de fixture do `controllers.json` vivo dela |
| E1 a E4 da VPAD-SUSPENSO-MORTO-01 | [VPAD-SUSPENSO-MORTO-01](sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | existe quem retoma e não existe quem suspende |

### 4.2 Decisão DELA — não decido por ela

1. **Os presets de gênero pedem `xbox`, e agora isso GRUDA.** São **sete** os
   que shipavam `xbox` (`acao`, `aventura`, `coop_local`, `corrida`, `esportes`,
   `fps`, `sackboy_nativo`); **quatro** estão assim no disco dela — `acao`,
   `aventura`, `coop_local` e `corrida`. (Este item dizia "os quatro presets",
   confundindo as duas contagens.) **Resolvido em 22/08:** os sete passaram a
   shipar `gamepad_flavor: null`; os perfis dela não foram tocados, de
   propósito. Com a máscara persistente, qualquer jogo que case num
   deles deixa `xbox` gravado — a mesma queixa dela por outra porta. Há portão
   exigindo o xbox (`SPRINT-GAME-RUMBLE-01`: *"a máscara DualSense faz o jogo
   ignorar o gamepad virtual"*), mas hoje os quatro vpads subiram em
   `dualsense/uhid` sem degradação. **A premissa daquele portão merece ser
   remedida**, e o desenho está em
   [MASCARA-QUE-GRUDA-01](sprints/2026-08-22-MASCARA-QUE-GRUDA-01-quatro-perfis-dela-pedem-xbox-e-agora-isso-fica.md).
2. **A ponte do microfone por Bluetooth continua desligada.** É o que falta para
   os quatro microfones ao mesmo tempo, e a conta da sala diz que cabe. O preço
   e o roteiro estão em
   [QUATRO-MICROFONES-01](sprints/2026-08-22-QUATRO-MICROFONES-01-a-ponte-esta-desligada-e-a-conta-diz-que-cabe.md).
3. **O alcance da central**: ela pediu *"todo o rádio, hub de energia, todos os
   usb, todos os dongles tipo do mouse e teclado, e até webcam ou microfones
   extras"*, e a leva de hoje entregou o rádio. O resto está na
   CENTRAL-SEM-TELA-01, seção "O alcance que ela pediu".
4. As três decisões da ELO-MUDO-01 (a allowlist, o Sackboy na allowlist, e a
   ordem das entregas), e as da BARRA-MUDA-01 §6 — o experimento que só o olho
   dela fecha.

### 4.3 Aberto sem dono — falta medir antes de decidir

- **O `Disconnect` derrubou DOIS controles, o segundo em OUTRO adaptador.** Nada
  do que foi medido explica. Registrado sem hipótese em
  [DOIS-CAIRAM-DE-UMA-VEZ-01](sprints/2026-08-22-DOIS-CAIRAM-DE-UMA-VEZ-01-o-disconnect-que-derrubou-o-controle-do-vizinho.md).
- **O engasgo do Sackboy não tem causa medida.** Caíram com régua: sniff e link
  policy, autosuspend, keepalive, storm `-71`, perfil de energia e ociosidade do
  COSMIC. O canal ficou em 250,0 Hz constantes por 60 s com o controle imóvel,
  o que mata a família "economia de energia" para o cabo. O que falta é
  frametime DENTRO do jogo, e isso precisa da tela dela (E6 da ELO-MUDO-01).
- **A semeadura entra por dentro do tique do autoswitch.** `select_for_window_ex`
  chama `load_all_profiles()`, e é ele o gatilho — a frente escreveu "processo
  separado, o daemon vê no próximo poll", e isso é falso. Não é defeito hoje (o
  piso de tempo e a assinatura seguram), mas quem for mexer precisa saber.
- **Dois módulos com nomes quase iguais e uma função homônima:**
  `integrations/mesa_de_radio.py` e `integrations/radio_da_mesa.py` coexistem, e
  `ler_a_mesa` existe nos dois `mesa_de_radio` e `sinal_da_barra`. É exatamente
  a colisão de nome que o portão A-CASA-SABE passou a pegar hoje — aqui ela está
  no produto, não no portão.

---

## 5. O que este dia DERRUBOU

Becos que ninguém precisa percorrer de novo:

1. *"o adaptador Bluetooth é o culpado do travamento da barra"* — o mesmo
   adaptador teve, na mesma hora, uma instância travada e uma sã;
2. *"nascer junto com outra conexão causa o travamento"* — correlação INVERSA:
   as travadas nasceram com 12 a 21 s de intervalo, as sãs com 2,7 s;
3. *"a causa é nova, já que o `0x08` saiu"* — não é nova: é a Steam, que a casa
   já conhecia por outro nome e com efeito MENOR do que o real. Aberta no
   nascimento, ela não disputa a barra: **condena**;
4. *"a máscara volta para `xbox` quando a Steam fecha"* — falso, e a §1.4 diz
   quem revertia;
5. *"a Steam repinta a barra em regime"* — falso: 1 escrita com o daemon parado
   contra 426 com ele rodando;
6. *"o `ExecStopPost` do bluetoothd não tem como gastar 42,8 s"* — tinha: o
   padrão do systemd é 90 s e vale para tudo o que roda na parada. Fechado com
   `flock -n` e `TimeoutStopSec=15s`, e os 15 s têm lastro (parada limpa medida
   em 29 ms, snapshot em 0,03 s);
7. *"a doutrina sudo-zero proíbe gesto privilegiado"* — ela derrubou: *"a ideia
   é que usemos o sudo só na hora do install e isso vai valer sempre no nosso
   app. Pode ser um botão."* O que caiu foi a minha conclusão, não a doutrina.

---

## 6. Onde está cada coisa

| Assunto | Documento |
|---|---|
| A fila, e o que espera a palavra dela | [SPRINT_ORDER.md](SPRINT_ORDER.md) |
| As decisões que esperam ela | [`DECISOES.md`](../../DECISOES.md), na raiz |
| Como fotografar e medir a tela sem sofrer | [COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md) |
| A aba Configurações, sprint por sprint | `sprints/2026-08-21-ABA-CONFIGURACOES/` |
| O rádio da sala, a conta de slots e a migração de controle | [GUIA-RADIO-DA-SALA.md](../../GUIA-RADIO-DA-SALA.md) |
| O mapa de canais e o que ele cobra | `docs/data/mapa-controles.csv` e o `specs.html` que ele gera |
| O dia anterior, e o que continua valendo dele | [2026-08-16-ONDE-PARAMOS](2026-08-16-ONDE-PARAMOS-a-sessao-de-vinte-horas.md) |

---

## 7. O que esta página RECUSA afirmar

- **Que o Sackboy está resolvido.** A causa do perfil que não aplicava está
  curada e provada ao vivo; o **engasgo** não tem causa medida, e o roteiro que
  o decide é da mão dela.
- **Que a barra está curada.** O sinal existe, o botão existe, e o carimbo no
  nascimento **não está ligado**. Enquanto não estiver, o produto continua sem
  saber que aquela conexão nasceu condenada.
- **Que a suíte inteira está verde nesta árvore.** O número que circula
  (10.937 testes, 14 reprovações, das quais nove eram do ambiente) foi medido em
  `2f9af26`; esta passagem não rodou a suíte completa.
- **Que o censo de sprints do `SPRINT_ORDER.md` continua exato.** Ele foi feito
  na manhã de 22/08, e o dia inteiro aconteceu depois dele.
- **Qualquer coisa sobre firmware de adaptador medida nesta máquina.** A conta
  que dispensa a atualização é de especificação e de aritmética de slots, não de
  bancada.
