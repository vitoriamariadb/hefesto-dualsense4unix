---
sprint: ONDA5-MIC-VIRTUAL-01
estado: aberta
posse:
  M:
    - src/hefesto_dualsense4unix/integrations/fontes_de_captura.py
    - src/hefesto_dualsense4unix/integrations/quem_ouve_o_microfone.py
cria:
  - src/hefesto_dualsense4unix/integrations/canal_do_microfone.py
  - tests/unit/test_o_canal_do_microfone_tem_nome_de_controle.py
  - tests/unit/test_a_mascara_nao_alcanca_o_microfone.py
bancada: false
depois_de: [ONDA1-D1-O-SOM-01, CANAL-POR-CONTROLE-01, MIC-DA-MESA-ELEICAO-01]
nao_toca:
  - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
  - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
  - src/hefesto_dualsense4unix/integrations/eleicao_de_microfone.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/daemon/subsystems/mic_da_mesa.py
  - src/hefesto_dualsense4unix/daemon/subsystems/luz_do_mic.py
  - src/hefesto_dualsense4unix/integrations/audio_control.py
---

# ONDA5-MIC-VIRTUAL-01 · DEFEITO — o microfone do DualSense sob a máscara Xbox

**Esta sprint é DEFEITO, não desenho.** Ela não redige uma frase melhor: ela
constrói o canal que ela nomeou. O princípio que a manda existir está em
[A MÁSCARA NÃO CUSTA FEATURE](../2026-09-05-A-MASCARA-NAO-CUSTA-FEATURE-o-principio-e-o-que-ele-cobra.md),
e a regra que ele deixa é uma linha: **o Hefesto não explica a própria falha —
ele a conserta.**

**Leia antes de tocar em código:** o cabeçalho de
`integrations/eleicao_de_microfone.py` (o que a eleição faz e o que ela recusa
fazer), o de `daemon/subsystems/bt_mic.py:8-62` (as duas travas e por que a
resposta foi automatizá-las, não removê-las) e o de
`integrations/quem_ouve_o_microfone.py:24-49` (as três armadilhas, e nenhuma
delas dá erro quando se cai nela).

---

## 1. A DECISÃO DELA, VERBATIM

> *"Pode medir, mas a ideia é que o de falhas e limitações. Criamos mecanismos <!-- noqa-acento: citação literal dela — a grafia não se corrige; o FATO sim -->
> pra usarmos todas as feature. Exemplo controle do Xbox não tem microfone mas <!-- noqa-acento: citação literal dela -->
> se o Mic do dualsense passa a ser lido a parte via Mic virtual. Usaríamos <!-- noqa-acento: citação literal dela -->
> essa feature do controle mesmo no Xbox. Mesmo problema BT. Hj já funciona <!-- noqa-acento: citação literal dela -->
> assim, sem a parte do Mic virtual."* <!-- noqa-acento: citação literal dela -->

**Duas metades, e as duas são engenharia.** *"Hj já funciona assim"* é uma
afirmação sobre o produto — foi medida e está confirmada (§2.1). *"sem a parte
do Mic virtual"* é o que falta, e é o trabalho desta sprint.

E ela já tinha dito a metade grande deste conceito em 04/09, no microfone:

> *"tá errado o conceito da coisa. o botão é pra ligar o microfone e ele ser <!-- noqa-acento: citação literal dela -->
> ouvido no canal específico dele."*

Registrada como D-12 em
[AS DEZESSEIS DECISÕES](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
§1. **O motor dela está entregue** — ver §2.2. O que esta sprint acrescenta é o
CANAL de que aquele ato fala.

---

## 2. A MEDIÇÃO QUE SUSTENTA

Medido em 05/09/2026, lendo `src/hefesto_dualsense4unix/`.

### 2.1 Ela está certa: o microfone já é cego à máscara

`grep` por `native_mode`, `gamepad_emulation_enabled`, `flavor` e `mascara` nos
seis arquivos do caminho do microfone — `daemon/subsystems/mic_da_mesa.py`,
`daemon/subsystems/luz_do_mic.py`, `daemon/subsystems/bt_mic.py`,
`integrations/eleicao_de_microfone.py`, `integrations/dualsense_bt_audio.py` e
`integrations/fontes_de_captura.py` — devolve **uma** ocorrência, e ela é a
palavra "mascara" num comentário sobre bits
(`daemon/subsystems/luz_do_mic.py:137`).

O próprio produto já o afirma na tela, na frase de preço da máscara:
*"Vibração, microfone e alto-falante continuam funcionando"*
(`app/actions/home_actions.py:377-382`).

**Confirmado. Nada nesta sprint pode introduzir o primeiro gate.**

### 2.2 O ato do botão está entregue

`mic.canal.set` existe e é o ato inteiro: ligar o microfone daquele controle
**e** o canal dele (`daemon/ipc_handlers.py:5744-5800`). Ele separa
`canal_feito` de `firmware_pedido` e só responde `ok` quando as duas metades
aconteceram — a docstring diz por quê: *"responder 'ok' sobre meio ato é o
verde falso que esta casa passou 04/09 inteiro arrancando"*
(`daemon/ipc_handlers.py:5779-5785`).

E o canal sobe **sob pedido**: `pedir_canal`
(`integrations/eleicao_de_microfone.py:133-148`), com o atendente registrado
pelo subsystem do rádio (`daemon/subsystems/bt_mic.py:443`).

### 2.3 O rádio já é o precedente — o Hefesto CONSTRÓI canal desde 25/07

Por Bluetooth o DualSense **não publica fonte de áudio nenhuma**: ele não
implementa A2DP, HFP nem HSP, e o SDP dele só anuncia HID e PnP
(`integrations/dualsense_bt_audio.py:6-16`). O Hefesto não escreveu na tela que
o microfone se perde no rádio. Ele leu os quadros Opus tunelados dentro do HID
e publicou uma source de captura de verdade, um `module-pipe-source` alimentado
por fifo (`integrations/dualsense_bt_audio.py:542-558`).

**É literalmente o "Mic virtual" dela, feito para UM transporte.**

### 2.4 O QUE FALTA, medido: o nó tem o nome do TRANSPORTE, não o do CONTROLE

| transporte | como o microfone daquele controle se chama | prova |
| --- | --- | --- |
| rádio | `hefesto_dualsense_bt_<hex6>` — o sufixo são os três últimos octetos do MAC. **Tem identidade.** | `integrations/fontes_de_captura.py:48`; montado em `integrations/dualsense_bt_audio.py:888` |
| cabo | um nó ALSA cujo `-00`/`-00.2` é **desempate posicional do PipeWire**, e não número de série. **Não tem identidade nenhuma.** | `integrations/fontes_de_captura.py:68-74` e `:188-194` |

**Troque o transporte e o microfone daquele controle muda de nome.** Um app que
fixou o device perde o microfone; o nome que ele guardou deixou de existir.

**O custo disso já está pago, e dá para medi-lo.** Responder *"qual nó é o
microfone DESTE controle"* custa hoje uma função de quatro regras mais um censo
do dispositivo USB pai — `escolher_fonte`
(`integrations/fontes_de_captura.py:164-227`) — e ela tem **quatro chamadores
independentes**:

    integrations/eleicao_de_microfone.py:397     a eleição
    integrations/quem_ouve_o_microfone.py:480    quem está te escutando (a luz)
    integrations/audio_control.py:368            o áudio da janela
    integrations/fontes_de_captura.py:254        `escolher_sink`, que delega

A regra 4 ("um para um") só vale com **um** controle na mesa; a regra 3 (o
dispositivo USB pai) **não existe no rádio**, porque a placa de som segue o
transporte. **A resolução certa para o controle no rádio é `None`**, e a
docstring o diz com todas as letras (`:201-204`).

---

## 3. POR QUE ISTO É **DUAS** SPRINTS, e onde fica o corte

Medido o trabalho, ele não cabe numa. O corte não é por tamanho — é por
**reversibilidade**:

* **no CABO existe rede embaixo.** O nó ALSA continua publicado enquanto o nó
  novo sobe ao lado. Se o nó novo não servir, ninguém fica sem microfone;
* **no RÁDIO não existe.** O nome `hefesto_dualsense_bt_<hex6>` é o ÚNICO canal
  que o rádio tem hoje. Mexer nele antes de o nó novo estar provado tira dela o
  microfone por Bluetooth inteiro.

Então: **esta sprint constrói o nó com nome e o prova no cabo**, sem tocar num
byte da ponte de rádio (ela está no `nao_toca`). A sprint irmã
**ONDA5-MIC-VIRTUAL-02** faz o rádio alimentar o mesmo nó e converte os quatro
chamadores. Ela só começa com o nó desta de pé e medido com dois controles.

---

## 4. O TRABALHO, EM PASSOS

### Passo 1 — O nó nasce com o nome do CONTROLE

Um módulo novo, `integrations/canal_do_microfone.py`, dono único de:

* **o nome.** `hefesto_mic_<hex6>`, com o MESMO sufixo de identidade que a
  ponte de rádio já usa e que `sufixo_da_ponte_bt`
  (`integrations/fontes_de_captura.py:257-272`) já sabe ler. O sufixo é o que
  faz o nome sobreviver à troca de transporte;
* **o mecanismo.** `module-pipe-source`, pela razão já medida e escrita: um
  módulo, um fifo, zero processo intermediário, e sem o `.monitor` no meio que
  `fontes_dualsense` teve de aprender a descartar
  (`integrations/dualsense_bt_audio.py:542-548`);
* **a prioridade.** A faixa do cabo, não um literal novo. A medição de
  03/09 na máquina dela e a doutrina que ela materializa estão em
  `integrations/dualsense_bt_audio.py:560-595` — e o defeito que aquele
  comentário registra (um literal catorze dias atrás da doutrina) é
  exatamente o que um número inventado aqui repetiria;
* **o ciclo de vida.** Nasce sob `pedir_canal`, morre com o último pedido. O
  gesto que o pede já existe e já é dela: o botão do microfone, que desde
  01/09 quer dizer *"eu falo por este controle"*.

**A MORDIDA:** apague o sufixo do nome (deixe `hefesto_mic`) e ponha DOIS
controles na lista. A régua nova
(`test_o_canal_do_microfone_tem_nome_de_controle.py`) tem de reprovar porque
`escolher_fonte` devolve o nó do controle errado — que é pior que devolver
`None`, e é a regra que já está escrita em
`integrations/fontes_de_captura.py:201-204`.

### Passo 2 — O cabo entra no nó, e o Hefesto não conta como ouvinte

O nó com nome é alimentado a partir do nó ALSA do cabo. **A medição vem ANTES
do código, e ela decide o desenho:** meça se um link do grafo do PipeWire basta
ou se é preciso um leitor. Escreva o que mediu no cabeçalho do módulo.

**A armadilha, e ela já está nomeada na árvore:**
`quem_ouve_o_microfone.e_stream_do_hefesto` existe porque *"o medidor do
próprio Hefesto não pode contar como ouvinte. Se contar, a luz acende sozinha e
a peça inteira mente"* (`integrations/quem_ouve_o_microfone.py:39-41`). O que
alimenta o nó novo cai na **mesma** armadilha, e com o mesmo sintoma: a luz
vermelha do microfone dela acesa para sempre.

E o mesmo módulo já ensinou como NÃO combinar isso: *"a junta com a peça B não
é um nome combinado — é um espaço de nome"*
(`integrations/quem_ouve_o_microfone.py:43-57`). Duas strings literais
combinadas entre dois arquivos é como esta casa fabrica divergência silenciosa.

**A MORDIDA:** arranque a exclusão e ponha o nó de pé sem ninguém gravando. A
régua tem de reprovar com o Hefesto listado como ouvinte de si mesmo.

### Passo 3 — `escolher_fonte` ganha a regra 0, e as outras quatro FICAM

A regra 0 é *"o nó com identidade vence"*. As quatro regras atuais **não saem**,
e a razão é medida: o nó com nome só existe depois de alguém pedir o canal
(passo 1), e antes disso as quatro regras são o único caminho — inclusive o
único caminho da janela estável, que continua abrindo a mesma função.

**A MORDIDA:** arranque a regra 0 e rode a régua. Se ela continuar verde, as
quatro regras antigas estão respondendo e a regra 0 não morde — a sprint não
entregou nada. É o verde de 29/08 de novo.

### Passo 4 — O portão que o princípio ganha

`test_a_mascara_nao_alcanca_o_microfone.py`: o `grep` da §2.1, virado régua.
Ele lê os seis arquivos do caminho do microfone mais o módulo novo e reprova
qualquer menção nova a `native_mode`, `gamepad_emulation_enabled`, `flavor` ou
`mascara`. A ocorrência de hoje (`daemon/subsystems/luz_do_mic.py:137`, um
comentário sobre bits) entra como isenção **declarada com a razão**, no formato
que esta casa já usa.

**A MORDIDA:** escreva `if daemon.is_native_mode(): return` no topo do módulo
novo e veja o portão reprovar nomeando o arquivo e a linha. Portão que não
nomeia onde não serve para nada.

---

## 5. O QUE VOCÊ **NÃO** FAZ

* **Não toca na ponte de rádio nem no `bt_mic`.** É a ONDA5-MIC-VIRTUAL-02, e a
  §3 diz por quê.
* **Não escreve no `common[9]`.** O mudo do firmware continua sendo do
  `hid-playstation`, e as três recusas que protegem isso continuam inteiras
  (`integrations/eleicao_de_microfone.py:15-20`).
* **Não mexe em drop-in, não chama `doctor --fix-mic`, não reinicia o
  WirePlumber.** É gesto humano explícito, e muda a política da máquina inteira
  (`integrations/eleicao_de_microfone.py:21-24`).
* **Não inventa critério de "fonte que se sustenta".** Aquilo tem dono, e uma
  segunda régua sobre o mesmo estado é o defeito que esta casa já pagou duas
  vezes exatamente aqui (`integrations/eleicao_de_microfone.py:25-30`).
* **Não altera a tela.** Se o nó novo mudar o que uma aba deveria mostrar,
  RELATE — não edite. É a R1 desta casa.

---

## 6. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois:

* **O canal do cabo continua publicado e SUSPENDED**, sem capturar nada
  enquanto ninguém o abre. Ele não paga privacidade nem banda por existir, e
  essa medição é o que separa "ter canal" de "estar capturando"
  (`daemon/subsystems/bt_mic.py:31-40`).
* **O canal do rádio continua subindo só sob pedido.** A trava virou automática
  em 03/09; ela não pode virar "sempre ligado" por efeito colateral desta
  sprint (`daemon/subsystems/bt_mic.py:47-58`).
* **A eleição continua decidindo só o PADRÃO do sistema**, que é o único
  recurso genuinamente único — *"perder o padrão não é perder o canal"*. E
  continua empilhando o anterior, porque eleger persiste
  (`integrations/eleicao_de_microfone.py:48-54`).
* **A pós-condição continua sendo o ATIVO relido, nunca o `configured`.** O
  WirePlumber não honra nó eleito que não se sustenta, e declarar sucesso pela
  escrita faria o LED do controle mentir sobre o microfone dela
  (`integrations/eleicao_de_microfone.py:32-37`).
* **`mic.canal.set` continua sendo UM ato**, com `canal_feito` e
  `firmware_pedido` separados na resposta
  (`daemon/ipc_handlers.py:5779-5785`).
* **As quatro regras de `escolher_fonte` continuam vivas**, e `None` continua
  sendo a resposta certa para o controle que não dá para resolver
  (`integrations/fontes_de_captura.py:201-204`).
* **`escolher_fonte` continua com UM dono e quatro chamadores.** Se a regra 0
  nascer aplicada a um deles, a próxima pessoa remede o mesmo defeito — foi o
  que aconteceu duas vezes em 05/09, e a regra que sobrou é: **quando a cura
  conhece a causa, ela cobre TODOS os chamadores.**
* **O microfone continua cego à máscara.** É o portão do passo 4, e é o único
  item desta lista que ganhou régua própria.
