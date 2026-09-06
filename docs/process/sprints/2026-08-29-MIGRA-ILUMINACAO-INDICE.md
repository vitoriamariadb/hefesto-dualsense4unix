---
sprint: MIGRA-ILUMINACAO-INDICE
estado: absorvida
onda: MIGRA-ILUMINACAO
posse:
  QUEM-COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-ILUMINACAO-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

> **06/09/2026 — ESTA ONDA FOI ABSORVIDA.** As sprints deste índice estão `estado: absorvida` (as do enxerto na janela GTK, `caducou`): a tela é o HTML desde 02/09, a fila é o `docs/data/paridade-gtk-html.csv` (aba 04) e a ordem de agora é [AS VINTE E QUATRO HORAS](../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md). O que este índice mediu continua valendo como diagnóstico; nada aqui se despacha pelo id.

# MIGRA ILUMINAÇÃO — o índice

*Que cor é a minha, e qual número eu sou na mesa.*

**Doze sprints** levam a aba **Iluminação** do produto de hoje até o mockup
aprovado, **rodando no motor novo**: o HTML dentro de um `WebKit2.WebView` na
janela GTK3 (`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`, 29/08).

**A EXECUÇÃO ESPERA A PALAVRA DELA.** A aba **Controles** está sendo feita viva
agora, como **piloto** do motor novo. Palavra dela: *"Preciso avaliar como ela se
comporta. Depois dou o ok pra seguirmos materializando a ordem pra fazermos todas
as abas funcionarem no novo motor."* **As doze sprints são ESCRITAS; nenhuma
executa antes do ok dela sobre o piloto** — com uma exceção nomeada abaixo (a
01).

E `PROVA-DE-TELA-01` continua valendo: **interface só fecha com o olho dela**, com
a foto na mesa. Aprovar o mockup não é aprovar a tela.

## Por que doze, e não dez

O censo desta aba disse **dez**. Ao escrever, **duas coisas que o censo listou
como "o que é dela decidir" viraram trabalho com portão**, e trabalho com portão
é sprint:

- **a 11 (troca ou rodízio)** — o produto faz **rodízio**
  (`daemon/ipc_handlers.py:1812-1814`, `pop` + `insert`) e a tela promete
  **troca**, em 16 tooltips e na legenda. O próprio censo escreveu: *"é sprint
  própria com portão"*. Ela **não toca a tela**, e por isso não caberia dentro de
  nenhuma das dez;
- **a 12 (duas peças nunca têm a mesma cor)** — a regra existe, é do produto,
  **e não tem uma linha em `src/`**. Com uma coluna por controle, a colisão deixa
  de pedir duas visitas e passa a ser um clique.

Nenhuma das duas inchou a onda: as dez continuam sendo as dez, e estas duas são
trabalho que já existia sem dono.

## A arquitetura que as doze compartilham

Escrita **uma vez aqui**, para não se repetir doze vezes:

- **A aba é uma PÁGINA HTML** num `WebKit2.WebView`. **O Python não constrói
  widget**: ele **pinta valores** por `run_javascript` e **recebe gestos** por
  `register_script_message_handler`. As duas pontes custam **31 linhas, uma
  vez**, e **têm dono: a onda do PILOTO** — `MIGRA-CONTROLES-03`
  (`gui/ponte_da_tela.py`). Esta onda **consome**, não reescreve. <!-- ref-externa: nasce na onda do PILOTO (MIGRA-CONTROLES) -->
- **Cada valor precisa de ENDEREÇO** (um `id` ou um `data-`) para o Python o
  alcançar. Onde o mockup não tem, **dar endereço é parte da sprint** — é a
  `MIGRA-ILUMINACAO-03`. Atributo não pinta, mas é mudança no gerador e está
  declarada.
- **O que o produto já lê, lê.** A onda **liga**, não reescreve: dos **38**
  valores da tela, **14 já são lidos hoje**, e a leitura por MAC já existe
  inteira (`draft.effective_leds_for(uniq)`, `_persist_leds_update`,
  `led_set_detalhado(rgb, uniq=)`). Passar de 1 coluna para N é um **laço**, não
  um caminho novo. Dos **64 gestos**, os **seis tipos já têm handler vivo** —
  nenhum é feature nova.
- **A página nasce da MESA REAL:** uma coluna por controle presente. **Zero
  controles é estado legítimo.**

### As armadilhas do motor, medidas em 29/08 e válidas para as doze

1. **Quatro pinos obrigatórios:** `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
   `WebKit2 4.1`. Com o GTK4 ao lado, um `import Gdk` sem pino carrega o 4.0 e
   **mata o Gtk 3.0**.
2. **`FINISHED` dispara depois de `load-failed`** — o WebKit commita uma página
   de erro. Quem escuta só `FINISHED` **reporta sucesso sobre carga que falhou**.
3. **`get_title()` no handler de `FINISHED` devolve vazio** — o título chega
   depois.
4. **Os `<select>` saem como caixa BRANCA:** o WebKitGTK relata as cores do autor
   e desenha o tema do sistema. Cura: `select{appearance:none}`. São **117** nas
   dez abas — e **zero nesta**, conferido. **Mas o `<input type=range>` tem o
   mesmo problema**, e é o que a `MIGRA-ILUMINACAO-08` põe na mesa dela.
5. **Filtros mortos.** São 84 nas dez abas; **36 nesta**, medidos: 12 `<filter>`
   com id prefixado (`il-p1-outline-filter-0..2` e irmãos) contra 36
   `filter: url(&quot;#outline-filter-N&quot;)` **sem** prefixo. `monta.py:438-439`
   prefixa os ids e **não** reescreve o `url()`, porque o desenho usa aspas
   escapadas. O Chrome ignora e desenha; **o WebKit segue o SVG 1.1 e não
   desenha**. O contorno do touchpad **nunca apareceu, em motor nenhum**. A cura
   está pronta, muda 1,09% do desenho que ela aprovou, **e é dela**.

## As doze

| # | sprint | camada | tamanho | trava |
|---|---|---|---|---|
| 01 | [o desenho das luzes sai das cinco caixas](2026-08-29-MIGRA-ILUMINACAO-01-o-desenho-das-luzes-sai-das-cinco-caixas.md) | backend da GUI | ~120 | — |
| 02 | [a página toma o lugar da aba](2026-08-29-MIGRA-ILUMINACAO-02-a-pagina-toma-o-lugar-da-aba.md) | glade + app | **não medido** | **CONTROLES-01/02/03** |
| 03 | [cada valor ganha endereço](2026-08-29-MIGRA-ILUMINACAO-03-cada-valor-ganha-endereco.md) | gerador | ~150 | — |
| 04 | [a página nasce da mesa real](2026-08-29-MIGRA-ILUMINACAO-04-a-pagina-nasce-da-mesa-real.md) | gerador + GUI | ~300 | **palavra dela** |
| 05 | [a cor e o brilho de cada coluna](2026-08-29-MIGRA-ILUMINACAO-05-a-cor-e-o-brilho-de-cada-coluna.md) | GUI (pintura) | ~250 | **palavra dela** |
| 06 | [as luzinhas, o número e o anelzinho](2026-08-29-MIGRA-ILUMINACAO-06-as-luzinhas-o-numero-e-o-anelzinho.md) | GUI (pintura) | ~250 | **palavra dela** |
| 07 | [os gestos ganham o `uniq` da coluna](2026-08-29-MIGRA-ILUMINACAO-07-os-gestos-ganham-o-uniq-da-coluna.md) | GUI (gestos) + app | ~400 | **11** |
| 08 | [o trilho de brilho vira controle](2026-08-29-MIGRA-ILUMINACAO-08-o-trilho-de-brilho-vira-controle.md) | gerador + GUI | ~250 | **palavra dela** |
| 09 | [os quatro que o contrato preserva](2026-08-29-MIGRA-ILUMINACAO-09-os-quatro-que-o-contrato-preserva.md) | gerador + GUI | ~250 | **palavra dela** |
| 10 | [a cor do plástico nas colunas](2026-08-29-MIGRA-ILUMINACAO-10-a-cor-do-plastico-nas-colunas.md) | GUI + daemon | ~300 | **CONEXÕES-11** |
| 11 | [troca ou rodízio](2026-08-29-MIGRA-ILUMINACAO-11-troca-ou-rodizio.md) | daemon | ~200 | **palavra dela** |
| 12 | [duas peças nunca têm a mesma cor](2026-08-29-MIGRA-ILUMINACAO-12-duas-pecas-nunca-tem-a-mesma-cor.md) | core + GUI | ~260 | **palavra dela** |

**O tamanho da 02 não se estima, e dizer que se estima seria mentira.** O provado
em 29/08 foi o enxerto **ADITIVO** (uma 12ª página do `Gtk.Notebook`, 376 objetos
em 56 ms, 62 → 285 MiB PSS). **Ninguém mediu TROCAR uma página.** Os outros
números da tabela são ordem de grandeza, não promessa.

## A ordem, e por que ela é essa

**A fila é quase uma linha reta, e é medido: nove das doze abrem
`lightbar_actions.py` e cinco abrem `aba04.py`.** Quem divide arquivo executa em
série (R5), então a "ordem" desta onda é a fila de execução:

```
01 ─► 03 ─► 11 ─► 02 ─► 04 ─► 05 ─► 06 ─► 07 ─► 08 ─► 09 ─► 10 ─► 12
 │      │     │     │                        │                 │
 │      │     │     │                        └─ 11 é o que      └─ CONEXÕES-11
 │      │     │     │                           destrava o          e CONEXÕES-12
 │      │     │     │                           gesto de número     (a semente 0x53)
 │      │     │     └─ MIGRA-CONTROLES-01/02/03 (o enxerto, a casa, as pontes)
 │      │     └─ daemon; abre o aba04.py só se ela escolher rodízio
 │      └─ não muda um pixel, e destrava cinco (espera a CONTROLES-02:
 │         o gerador muda de casa antes de ganhar endereço)
 └─ segurança; a única que pode correr antes do ok dela
```

**O `depois_de` de cada sprint traz a fila INTEIRA que vem antes dela**, e não só
o vizinho: o portão de colisão **não faz fecho transitivo** — é o mesmo desenho
que a `ONDA-SISTEMA-02` usa.

* **A 01 vem antes de tudo, e é segurança.** Os cinco `GtkCheckButton` de
  `gui/main.glade:1478-1482` são hoje **o único armazenamento do desenho das
  luzes na GUI**, lidos por `get_current_player_leds`
  (`app/actions/lightbar_actions.py:1466`). **A rota WebKit troca a PÁGINA
  INTEIRA — os cinco somem de uma vez, não um a um.** Sem mover o estado antes, o
  produto grava `[False]*5` no perfil dela.
  **É a única sprint desta onda que pode rodar antes do ok dela sobre o piloto**,
  porque não muda um pixel e protege o perfil dela de um estrago que a 02
  causaria.
* **A 03 é barata e destrava cinco.** Sem endereço, o Python não alcança valor
  nenhum. Ela não muda um pixel — e a mordida dela é exatamente essa.
* **A 04 antes da 05 e da 06** — pintar uma coluna exige que a coluna exista, e
  que ela seja a coluna de um controle real.
* **A 07 carrega DUAS metades que não se separam.** `app/app.py:1228` diz
  `"tab_lightbar_box": None`, e `None` naquele mapa quer dizer **a fita fica
  viva**. O mockup a quer inerte (`fita_viva=False`, `aba04.py:535`). Mas
  `_edit_uniq()` (`lightbar_actions.py:402`) é a fonte do alvo nos **seis**
  gestos, e `estado_alvo.desconhecido` faz cada um **recusar com toast** (Z2-1 /
  Z2-2). **Esmaecer a fita antes de os gestos ganharem o `uniq` da coluna deixa a
  aba bonita e MUDA.**
* **A 11 corre solta e não depende de tela nenhuma**, mas **trava o gesto de
  número da 07**: enquanto ela não fechar, a coluna promete **troca** e o daemon
  faz **rodízio**.
* **A 10 depende de duas sprints de outra onda.** Enquanto a `ONDA-CONEXOES-11`
  (a semente `0x53`) não fechar, **uma coluna no rádio não tem plástico** — e
  duas das quatro colunas desenhadas são BT.

**Podem correr juntas desde o começo:** nenhuma, e é honesto dizer isso. A
**01** e a **03** não compartilham arquivo (uma é `lightbar_actions.py`, a outra
é o gerador) e **poderiam** correr em paralelo — mas a 01 é a única que roda
antes do ok dela, e a 03 espera esse ok como todas as outras. A **11** vem logo
atrás da 03: a metade dela que muda o daemon não depende de ninguém, mas a outra
metade abre o `aba04.py` **se** ela escolher rodízio, e o mockup é recurso de
bancada.

### Esta onda corre quase toda EM SÉRIE, e é medido

**Oito das doze abrem `app/actions/lightbar_actions.py`** (01, 02, 05, 06, 07,
08, 09, 10, 12 — nove, contando a 12). Quem divide arquivo executa em série
(R5). **Paralelizar aqui compra conflito de merge, não velocidade** — é a mesma
conclusão que a onda **Controles** já registrou sobre os dois arquivos gigantes
dela.

**Cinco abrem `src/hefesto_dualsense4unix/interface/aba04.py`** (03, 04, 08, 09, 10), e aqui
o risco é pior que conflito: **`novo-layout/` é `.gitignore:108`** — conferido
com `git check-ignore -v`, que reprova `04-iluminacao.html` e `aba04.py`. Duas
levas editando o mesmo mockup em árvores diferentes **divergem SEM conflito de
merge, porque o git não vê nenhuma das duas**. É a mesma forma do defeito de
25/08 (oito agentes mandados ler um `CLAUDE.md` que não estava na árvore deles),
com o agravante de que **aqui o arquivo é a ESPECIFICAÇÃO aprovada por ela**.
**O mockup é recurso de bancada: uma sprint por vez, serializada à mão.**

**Duas abrem `app/app.py`** (02 e 07). **Uma abre `gui/main.glade`** (a 02, e só
ela): XML único, sem seções nomeadas, conflito de merge irrecuperável na
prática. Na onda antiga o Glade era aberto **duas** vezes (a 04 e a 10); **no
motor novo a 10 morre e sobra uma**. Quanto a esse arquivo, esta onda corre em
série com as outras nove.

## O que é dela, e ninguém decide por ela

Sete perguntas, na ordem em que doem:

1. **TROCA OU RODÍZIO?** (`11`) O produto faz rodízio
   (`daemon/ipc_handlers.py:1812-1814`); a tela promete troca, em 16 tooltips e
   na legenda; e o contrato ainda diz uma terceira coisa
   (`2026-08-26-O-REDESENHO-as-dez-abas.md:341`, *"os outros deslizam para abrir
   lugar"*). O exemplo do mockup **esconde** a divergência porque é uma troca de
   vizinhos, onde as duas dão o mesmo resultado. Na mesa de quatro, dar o 1 ao
   White: **rodízio muda três controles de número; troca muda um.**
2. **OS QUATRO QUE O CONTRATO PRESERVA E O MOCKUP NÃO DESENHA** (`09`).
   "Reenviar ao controle" (`main.glade:1300`), "Cores automáticas por controle"
   (`main.glade:1201`), o aviso do estado da barra (`main.glade:1274`, pronto
   desde 25/08) e a linha "de onde veio esta cor". O mockup tem, em Opções,
   **dois botões e mais nada**. **O mais caro é o terceiro:** é a única linha da
   janela que avisa que a Steam segura o hidraw ou que por rádio a barra aceita e
   ignora.
3. **O "DESLIGAR" GUARDA A COR OU GRAVA PRETO?** **Medido: grava preto.**
   `on_lightbar_off` (`lightbar_actions.py:1023-1046`) faz
   `_persist_leds_update({"lightbar_rgb": (0,0,0)})` — a cor anterior morre no
   rascunho e no perfil. **O tooltip do Glade promete o contrário, palavra por
   palavra** (`main.glade:1314`): *"A cor continua guardada: Aplicar no controle
   acende de novo."* O tooltip do mockup (*"Apaga a barra de luz do {nome}"*) é
   honesto mas não decide. **Duas promessas vivas; a resposta muda o código, não
   o texto.**
4. **O QUE É "O TOM VIZINHO", E ELA PODE RECUSAR?** (`12`)
   `D-DUAS-PECAS-NUNCA-TEM-A-MESMA-COR` é regra do produto e **não tem uma linha
   em `src/`**. Com N colunas lado a lado, a colisão deixa de ser hipótese.
5. **QUANTOS NÚMEROS A FILEIRA OFERECE?** (`04`) O mockup oferece os
   **ocupados**, e isso bate **exatamente** com o portão do daemon
   (`numero > len(presentes)` → `numero_fora_da_mesa`,
   `daemon/ipc_handlers.py:1808`). O cabeçalho de hoje oferece 1..4, o card de
   Conexões 1..5, e o produto cobre 1..8 (`core/led_control.py:105-114`). Pôr um
   DualSense no 5 com a mesa em 4 é **mover**, não trocar, e o daemon recusa
   hoje.
6. **O QUE A COLUNA DE UM CONTROLE NO RÁDIO MOSTRA** enquanto a cor do plástico
   não chega por lá (`10`). Três saídas, todas dela: (a) o campo em que ela
   **declara** vira o caminho principal; (b) a coluna nasce cinza até o controle
   passar pelo cabo uma vez; (c) **a onda espera a `ONDA-CONEXOES-11`**.
7. **O RÓTULO "BRILHO"** (`05`) e **o trilho como `<input type=range>`** (`08`) —
   os dois mudam o que ela aprovou.

## As três afirmações que o mockup de 28/08 já respondeu, e ninguém fechou no papel

O índice antigo (`2026-08-27-ONDA-ILUMINACAO-INDICE.md`) as listava como abertas.
**Estão respondidas, e a resposta é o mockup:**

* **os oito tons da guia SÃO os canônicos.** `TONS = [luz(n) for n in range(1,9)]`
  (`aba04.py:65`) deriva de `player_slot_color`, e os quatro hexas na tela
  (`#0000FF #FF0000 #00FF00 #FF0080`) batem com `_PLAYER_SLOT_COLORS`
  (`core/led_control.py:147-156`). **Nenhum hexa é digitado no desenho.**
* **o padrão das cinco luzinhas deriva de `player_led_pattern`** — `PADRAO_JOGADOR`
  em `monta.py:64-67`.
* **a fileira oferece só os números OCUPADOS**, que é exatamente o portão do
  daemon.

## Os riscos que a onda inteira carrega

1. **O HTML que o WebView renderiza NÃO EXISTE fora da máquina dela.**
   `novo-layout/` é `.gitignore:108`: não viaja em worktree, não está no pacote,
   e `install.sh` não o copia (ele copia `assets/glyphs` em `:3103` e mais nada
   de desenho). **A rota WebKit inteira depende de um arquivo que o repositório
   não tem.** Isto **não é risco só desta aba — é da moldura das dez**, e ele
   **tem dono**: a `MIGRA-CONTROLES-02`, que muda a página para
   `src/hefesto_dualsense4unix/gui/telas/` e o gerador para `scripts/telas/`.
   **Consequência para esta onda:** o endereço do gerador muda no meio do
   caminho — as seis sprints que o abrem declaram os **dois** endereços na posse,
   de propósito, e **todo número de linha citado nelas é do arquivo de hoje.
   Reconfira no dia da execução.**
2. **A cor do plástico não chega pelo rádio, e metade da mesa desenhada é
   rádio.** `docs/data/mapa-controles.csv`, `identidade.cor_do_aparelho`:
   `cabo_aciona=sim`, `radio_aciona=não`, com `divida` no rádio (29/08/2026; dizia
   `o-aparelho-recusa`). **A lápide era
   falsa** — não era o aparelho, era o nosso CRC (semente `0x53`, não `0xA3`) —,
   **mas o conserto é sprint fora desta onda**, e a 10 depende dele.

   > **NOTA DE 06/09/2026 (A-RECUSA-QUE-CITOU-O-MAPA-01) — o conserto SAIU, e
   > o `não` do rádio caiu.** A `ONDA-CONEXOES-11` correu em 02/09/2026 (commit
   > `2e772412`): `identidade.cor_do_aparelho@dualsense`
   > (`docs/data/mapa-controles.csv:111`) hoje é **`radio_aciona = sim`**,
   > `radio_de_onde_sei = medido`, `radio_ate_onde_foi = SAIU NO FIO` — o
   > produto leu a cor pelo rádio no controle dela (`hidraw5`, código `04` =
   > Galactic Purple, 13,6 ms). A cor **chega** pelo rádio; o que sobra é
   > ressalva de **AMOSTRA** (duas unidades provadas, não as quatro).
3. **O brilho da tela não é o brilho do aparelho.** `luz.lightbar.brilho`:
   `cabo_aciona=não`, `radio_aciona=não`. Célula literal: *"O brilho que o
   produto oferece (`led.set {brightness}`) é MULTIPLICAÇÃO de RGB em Python,
   outra grandeza. Nada no caminho toca `common[42]`."* E a ressalva do mapa é o
   defeito que a aba pode criar: *"Quem lê a doc e a tela pode concluir que são o
   mesmo controle. Não são."* **N trilhos em % lado a lado é a superfície mais
   convidativa que esta janela já teve para isso.**
4. **As cinco luzinhas são INTENÇÃO, nunca estado.** `luz.led_jogador.leitura` é
   `parcial` nos dois transportes: *"a leitura NÃO ENXERGA LÂMPADA NENHUMA — uma
   escrita que falhou com -110 continua sendo lida como acesa"*. E
   `luz.led_jogador.escrita_hefesto` é `radio_aciona=parcial`.
5. **Por Bluetooth a barra ACEITA E IGNORA** (LIGHTBAR-BT-RESET-01, escrito no
   próprio módulo, `lightbar_actions.py:39-52`): **330 mil escritas ignoradas com
   a barra apagada**, e ela passou dias acreditando que a cor tinha ido porque a
   janela dizia que sim. Foi por isso que a frase virou *"Cor ENVIADA ao
   controle"*. **Numa grade de N desenhos pintados, o DESENHO vira a
   afirmação** — e não há leitura de volta que a sustente (`multi_intensity` é o
   eco do nosso pedido, não a lâmpada).
6. **O enxerto substitutivo não foi medido**, e esta aba é um caso ruim para
   descobrir: a 02 remove **538 linhas** de Glade (`main.glade:1146-1683`) e com
   elas **27 ids**, oito dos quais `lightbar_actions.py` busca por `self._get`.
   **Cada `_get` que devolver `None` degrada em silêncio** — o módulo é defensivo
   por toda parte, e o sintoma será **a ausência de dado, não uma exceção**.
7. **`scripts/check_paridade_transporte.py` reprova afirmação forte sem teste que
   a sustente**, e é portão, não documentação.
8. **Toda régua desta onda mede o WebKit, e tem de declarar contra qual
   biblioteca mede.** Seis instrumentos falsos em quinze horas em 29/08, cinco
   pegos por quem escreveu a própria régua. E a lição que os une: *uma régua que
   roda o tique UMA VEZ mede um INSTANTE, não um comportamento* — foi assim que
   uma regressão de 181 segundos passou com 67 testes verdes.
9. **O `scrollIntoViewIfNeeded` do Playwright ROLA antes de medir** e cega toda
   medição de layout feita depois — foi assim que um portão deu verde sobre uma
   linha fora da caixa. **A grade desta aba é medida por altura somada**
   (146+16+44+26+62+34+72 = 400, +6×8 = 448, miolo 452 — `aba04.py:88-99`),
   exatamente o tipo de medida que aquele defeito falsifica.
10. **A suíte cria nós uinput de verdade** — 1289 num dia derrubaram a sessão
    gráfica dela. Ela roda **no fim, em oito lotes, com a máquina livre**, e é de
    quem coordena.

## Coordenação com as outras ondas

| o que | quem entrega | quem recebe |
|---|---|---|
| o enxerto substitutivo e o id que não some (`gui/webview_de_aba.py`) | **MIGRA-CONTROLES-01** | a **02** | <!-- ref-externa: nasce na onda do PILOTO (MIGRA-CONTROLES) -->
| **onde o HTML mora** — `gui/telas/`, `scripts/telas/`, `install.sh`, `pyproject.toml` | **MIGRA-CONTROLES-02** | a **03** e todas as que abrem o gerador |
| as duas pontes (`gui/ponte_da_tela.py`) | **MIGRA-CONTROLES-03** | a **02** e a **07** | <!-- ref-externa: nasce na onda do PILOTO (MIGRA-CONTROLES) -->
| a semente `0x53` e o filtro de barramento | **ONDA-CONEXOES-11** | a **10** |
| as 28 cores e as 10 zonas chegando ao produto | **ONDA-CONEXOES-12** | a **10** |
| a escolha do número de jogador como leitura | **ONDA-CONEXOES-05** | a **06** |
| o número trocado no daemon | a **11** desta onda | onda **Controles** (o card) e onda **Jogar** |
| o `rotulo_lightbar` como dono único da frase do estado | já pronto (L6, 25/08) | a **09** consome, **não reescreve** |

**O que esta onda NÃO possui, e não deve tentar possuir:** `cor_do_plastico.py`,
`secao_controles.py`, `controller_card.py` e `main.glade` além da 02. Estão nos
`nao_toca` das sprints, um por um.

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje, antes e depois
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh                # os 28 portões
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo só,
que morre no meio sem traceback e devolve um `rc=1` que **não é teste
reprovando**.

## Fontes desta onda

- **contrato:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4
  (linhas 303-368) — toda linha do *"Nada se perdeu"* é requisito;
- **especificação visual:** `layout/04-iluminacao.html`, gerador
  `src/hefesto_dualsense4unix/interface/aba04.py`, esqueleto `src/hefesto_dualsense4unix/interface/monta.py`;
- **correção literal dela:** `src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md`, aba
  Iluminação — **"— FEITA"**;
- **o motor:** `src/hefesto_dualsense4unix/interface/ver.py` (a janela que ela já abriu e  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
  olhou) e `docs/process/2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md`;
- **o mapa de canais:** `docs/data/mapa-controles.csv` — as cinco linhas que
  mordem esta aba são `luz.lightbar.cor`, `luz.lightbar.brilho`,
  `identidade.cor_do_aparelho`, `luz.led_jogador.escrita_hefesto` e
  `luz.led_jogador.leitura`;
- **decisões:** `D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`,
  `D-A-FITA-VIVE-ONDE-A-ABA-AJUSTA-POR-CONTROLE`, `D-A-FITA-E-O-UNICO-ALVO`,
  `D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR`, `D-A-BORDA-E-A-IDENTIDADE-DA-PECA`,
  `D-DUAS-PECAS-NUNCA-TEM-A-MESMA-COR`, `D-AS-ABAS-CONVERSAM`,
  `D-TUDO-QUE-EXPLICA-VIRA-DICA` (`docs/data/decisoes-dela.csv`);
- **o índice anterior**, para o que ele mediu e continua valendo:
  `2026-08-27-ONDA-ILUMINACAO-INDICE.md`. **As dez sprints de 27/08 morrem com
  esta onda** — o diagnóstico delas sobrevive nestas doze; as citações de linha,
  não. Reaproveitar sem reconferir é propagar afirmação falsa.
