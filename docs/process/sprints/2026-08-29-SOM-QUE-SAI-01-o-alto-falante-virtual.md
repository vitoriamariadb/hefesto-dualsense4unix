---
sprint: SOM-QUE-SAI-01
onda: CONTROLES
posse:
  SQS:
    - src/hefesto_dualsense4unix/integrations/alto_falante_bt.py
    - src/hefesto_dualsense4unix/daemon/subsystems/alto_falante.py
    - scripts/ensaios/o_som_que_sai.py
cria:
  - src/hefesto_dualsense4unix/integrations/alto_falante_bt.py
  - src/hefesto_dualsense4unix/daemon/subsystems/alto_falante.py
  - scripts/ensaios/o_som_que_sai.py
  - tests/unit/test_alto_falante_bt_escada_e_tabela.py
  - tests/unit/test_alto_falante_bt_a_saida_esconde_o_transporte.py
bancada: true
depois_de:
  # O nó com nome de gente, o texto da lista de saída e a decisão de um-nó-por-
  # controle são de lá. Esta sprint é o MOTOR por baixo daquele nó, não o nó.
  - O-ALTO-FALANTE-VIRTUAL-01
  # O P4 de lá é o portão duro do lado do rádio: a casa tem DUAS respostas
  # incompatíveis sobre por qual report o áudio sai, e nenhuma foi medida aqui.
  - CONTROLE-INTEIRO-NO-RADIO-01
nao_toca:
  - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
  - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
  - src/hefesto_dualsense4unix/app/audio_saida.py
  - src/hefesto_dualsense4unix/app/mic_monitor.py
  - src/hefesto_dualsense4unix/core/backend_pydualsense.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# SOM QUE SAI · 01 — o alto-falante virtual, do sink ao byte no fio

**Ideia do Fable, trazida por ela em 29/08/2026** e registrada em
`D-O-SOM-DO-CONTROLE-VIRA-DISPOSITIVO-VIRTUAL-DO-SISTEMA`
(`docs/data/decisoes-dela.csv:123`):

> *"independente da máscara, independente do modo de conexão, fazer o microfone
> sempre funcionar e a caixa de som sempre funcionar — criando uma caixa de som
> virtual (driver ao estilo dos controles) e o micro virtual ao estilo dos
> controles, e fazer o sistema operacional ler eles. Pq mesmo com o jogo estando
> no modo Xbox sem mic nativo, dessa forma usaríamos o controle, o mic do
> controle via bt, e ele funcionaria."*

**Esta sprint é o MOTOR, e só ele.** O nó com nome de gente, o texto que aparece
na lista de saída do sistema e a escolha entre um nó por controle ou um só são
da [O-ALTO-FALANTE-VIRTUAL-01](2026-08-29-O-ALTO-FALANTE-VIRTUAL-01-o-som-do-controle-ganha-o-que-o-gamepad-ja-tem.md).
Aqui responde-se o que aquela sprint deixou explicitamente para trás: **de onde
vem o PCM, por onde ele sai, e o que acontece quando a resposta é errada.**

**A regra desta casa que manda nesta sprint inteira**, e ela está escrita no mapa
(`docs/data/mapa-controles.csv`, linha `audio.saida_dedicada.payload_do_degrau`):

> *"NÃO ESCREVER, EM LUGAR NENHUM, que 'descobrimos o áudio por Bluetooth' ou
> que 'a ponte funciona'. Não funciona, e não há ponte: há um canal que
> responde. FALÁCIA DO CANAL QUE RESPONDE — concluir que, porque um canal
> responde, ele FAZ o que a gente esperava dele."*

---

## 1. O que muda do lado de quem joga

Hoje, "mandar som para o alto-falante do controle" é uma pergunta **diferente em
cada transporte**, e o jogo participa da diferença:

- **no cabo** existe placa ALSA de verdade, e o som sai — provado com a orelha
  dela em 15/08/2026, teste cego, com dose-resposta (ensaios `sfx-cabo-sem-posse`,
  `sfx-cabo-com-posse`, `sfx-cabo-volume-zero`, em `docs/data/ensaios.csv`);
- **no rádio** não existe placa nenhuma, e não existe uma linha de código que
  mande áudio para o controle (`audio.alto_falante@dualsense`: `radio_aciona =
  não`, *"NÃO IMPLEMENTADO"*);
- **e a placa é do TRANSPORTE, não da unidade.** Medido por inversão em
  15/08/2026: os braços foram trocados, e a placa ALSA **seguiu o fio** — quem
  saiu do cabo deixou de expor placa nenhuma.

**A consequência para quem joga, e é ela que esta sprint existe para matar:**
quando ela tira o cabo no meio da partida, o dispositivo de saída que o jogo
escolheu **desaparece do sistema**. Não é o som que fica ruim — é a rota que
some debaixo do jogo.

Depois desta sprint, o jogo aponta para **um nó que não sai do lugar**. O cabo,
o rádio e o "não tem para onde ir" acontecem por baixo dele, e o jogo não fica
sabendo. É o mesmo contrato do gamepad virtual, que é o precedente que ela citou:
o jogo escolhe um dispositivo, não um transporte
(`src/hefesto_dualsense4unix/integrations/virtual_pad.py`).

---

## 2. As quatro perguntas caras, respondidas

### 2.1 De onde vem o PCM — o módulo e a taxa

**O nó**: um `module-null-sink` por controle, e o áudio é lido do **monitor**
dele.

**MEDIDO nesta máquina, 29/08/2026** (leitura de disco, nada carregado, nada
tocado): a camada de compatibilidade Pulse do PipeWire conhece os três nomes de
que esta sprint precisa —

```
$ strings /usr/lib/x86_64-linux-gnu/pipewire-0.3/libpipewire-module-protocol-pulse.so \
  | grep -E '^module-(pipe|null)-(sink|source)$' | sort -u
module-null-sink
module-pipe-sink
module-pipe-source
```

E o `.so` que os implementa declara os dois sentidos no mesmo lugar:
`libpipewire-module-pipe-tunnel.so` traz a linha de uso
`( tunnel.mode=capture|playback|sink|source )`. **O `module-pipe-source` desta
lista é o que a metade de ENTRADA já carrega em produção**
(`integrations/dualsense_bt_audio.py:555`), e ele publica uma source `RUNNING`
provada com o olho dela em 16/08 — logo o mecanismo não é aposta, é o mesmo que
já funciona, virado ao contrário.

**Por que `null-sink` e não `pipe-sink`, e o preço dos dois:**

| forma | o que ganha | o que custa |
|---|---|---|
| `module-pipe-sink` | um módulo, um fifo, espelho exato do que a entrada já faz | **o PCM passa por dentro do nosso processo SEMPRE**, inclusive no cabo, onde não precisava passar |
| `module-null-sink` + monitor | no cabo, o monitor é **ligado direto** ao sink USB do controle (`libpipewire-module-loopback.so`, presente nesta máquina) e **nenhum byte de áudio entra no Python** | um módulo a mais e um link a gerir |

**A recomendação é `null-sink`**, e a razão não é elegância: no cabo o caminho
nativo já é bom, e fazer o áudio dela dar uma volta pelo nosso processo para
voltar ao mesmo lugar é latência e risco de subcorrida comprados por nada.

**A taxa e o formato: 48 kHz, `s16le`, DOIS canais.**

- **48 kHz** porque é o que a metade de entrada já usa (`MIC_TAXA_HZ = 48000`,
  `integrations/dualsense_bt_audio.py:202`, quadro de 10 ms = 480 amostras em
  `:204`) e é o que a referência canônica descreve da porta dedicada do PS5
  (`docs/protocol/dualsense-referencia-canonica.md`, §3): mono, 48 kHz, paralela
  à saída principal;
- **`s16le`** porque é o formato que o `load-module` da entrada já declara e o
  PipeWire aceita sem conversão nossa;
- **dois canais, e isto NÃO é detalhe:** a rota do firmware é **por canal**.
  `OUTPUT_PATH_SEL` (bits 4-5 de `common[7]`) tem o valor 2 = *"L → fone,
  R → alto-falante"* — o caso Zelda que ela descreveu, som do jogo no fone e o
  efeito no alto-falante. **Com um nó mono esse caso é inexprimível.** A rota 2
  foi exercida pela primeira vez em 15/08/2026 e obedeceu (ensaio
  `sfx-rota2-sem-fone`, com a orelha dela).

**Quem lê e empacota:** um módulo novo,
`integrations/alto_falante_bt.py`, espelho de `dualsense_bt_audio.py`, dirigido
por um subsistema novo, `daemon/subsystems/alto_falante.py`, espelho de
`daemon/subsystems/bt_mic.py`.

**O relógio é o PipeWire, nunca um `time.sleep`.** Na entrada, o rádio é o
relógio: a thread fica bloqueada num `select`+`read` do hidraw. Na saída, o
grafo do PipeWire é o relógio: a thread fica bloqueada lendo o monitor. **Um
temporizador nosso derivaria contra o grafo** e produziria estouro ou fome de
buffer em minutos — e é exatamente o erro que a régua de 181 segundos desta casa
pega e a de um tique não pega.

**NÃO MEDIDO, e é honesto dizer:** nenhum dos dois módulos foi carregado nesta
máquina por esta sprint. O que está medido é que **os nomes existem** e que **o
irmão deles funciona em produção**. O que falta é o `--dry-run` do D1 abaixo.

### 2.2 Qual degrau usar — a regra é uma TABELA, e nunca aritmética

A escada de OUTPUT por rádio, medida em 15/08/2026 no descritor dos aparelhos
dela, com o **orçamento de payload** calculado aqui (total − 3 de envelope − 47
do `common` − 4 de CRC):

| degrau | report inteiro | orçamento do payload | passo |
|---|---|---|---|
| `0x31` | 78 B | 24 B | — (é o do kernel) |
| `0x32` | 142 B | **88 B** | +64 |
| `0x33` | 206 B | 152 B | +64 |
| `0x34` | 270 B | 216 B | +64 |
| `0x35` | 334 B | 280 B | +64 |
| `0x36` | 398 B | 344 B | +64 |
| `0x37` | 462 B | 408 B | +64 |
| `0x38` | 526 B | 472 B | +64 |
| `0x39` | 547 B | **493 B** | **+21** |

**A REGRA:** o degrau é **o menor id cujo orçamento comporta o payload**, lido de
uma tabela literal. O `common` de 47 bytes ocupa `report[3..49]` em **todos** os
degraus, e o CRC-32 fica nos **quatro últimos** bytes do report, seja ele de 78
ou de 547 — então o payload mora entre `report[50]` e o CRC, e o tamanho total
tem de casar com o id.

**A ARMADILHA, e ela é aritmética:** a escada **não é uniforme**. São oito
passos de +64 e **um último de +21**. Quem escrever `tamanho = 78 + 64 * (id −
0x31)` — que é a fórmula que a palavra "escada" convida a escrever — obtém
**590 bytes para o `0x39`, contra os 547 declarados**: 43 bytes a mais.

**O que acontece se errar o degrau — e é a pior falha possível: SILÊNCIO.** Um
report com o tamanho errado põe o CRC-32 no lugar errado, e o firmware
**descarta calado** todo report BT com CRC errado. Não há erro, não há log, não
há retorno: *"não faz nada e não reclama"* é o sintoma mais caro de depurar
desta casa, e está escrito no próprio módulo do microfone
(`integrations/dualsense_bt_audio.py:245`, docstring de `montar_pedido_de_mic`).
**O sintoma de "errei o degrau" é indistinguível do sintoma de "o protocolo está
errado"** — e é a mesma família da armadilha do `wireplumber` parado, em que a
source sobe, aparece no `pactl` e nunca é ligada (`:547`).

**A cadência, e o que ela troca:** se o payload for Opus como na entrada
(71 B por quadro de 10 ms), o `0x32` carrega **um** quadro por escrita
(≈100 escritas/s) e o `0x39` carrega **seis** (≈15 escritas/s de 547 B). São
regimes muito diferentes no mesmo enlace L2CAP, e **a escolha inverte o
argumento de segurança da metade de entrada**: a ponte do microfone é segura
porque é PARCIMONIOSA — escreve `0x32` **só na borda** (ligar, desligar,
re-armar), *"nunca em regime"*. **A saída escreve em regime, por definição.**
Isso não é objeção; é a medição que o D5 tem de fazer antes de qualquer promessa.

**Conferência aritmética da leitura de fonte única, e é conferência, não
medição:** o `dualsense_bt_audio.py:226` registra, lido do firmware de
referência `DS5Dongle`, que o `0x39` manda **dois sub-blocos de 200 bytes** com
o bit `BLOCO_DUPLO` (`:229`). 400 bytes + cabeçalho **só cabem no `0x39`**
(493 B) — nenhum outro degrau comporta. É consistente, e a referência canônica
grava esse mesmo item com grau **BAIXA — lido do firmware `DS5Dongle`, não
medido** (`docs/protocol/dualsense-referencia-canonica.md`, a nota datada de
11/08). **Consistência aritmética não promove uma fonte única a fato.**

### 2.3 E no cabo? — os dois convivem sob o MESMO nó, e a medição obriga

**Esta era a pergunta que mais decidia o desenho, e ela já estava respondida no
mapa — só não estava escrita como decisão.**

**O virtual NÃO é só para o rádio.** Se fosse, o produto entregaria exatamente o
defeito que ela vive hoje: **a placa ALSA é do TRANSPORTE**, medido por inversão
em 15/08/2026 com os quatro aparelhos trocados de braço — quem foi para o fio
ganhou placa, quem foi para o ar perdeu. Um jogo apontado para o sink USB perde
o dispositivo quando ela tira o cabo. Um nó virtual que só existe no rádio
**troca o problema de lado** em vez de resolvê-lo.

Então: **um nó por controle, sempre presente, com duas rotas por baixo.**

| transporte | por onde o áudio sai | quanto PCM passa pelo nosso processo |
|---|---|---|
| **cabo** | o monitor do nó é ligado ao sink USB do controle | **zero** |
| **rádio** | a ponte lê o monitor, codifica e escreve na escada | tudo |
| **nenhum** | o nó **diz que não tem para onde ir** | — |

**E o mapa de canais do cabo NÃO é o óbvio.** Medido com a orelha dela, teste
cego, um canal por vez, com o nó mantido em `RUNNING` de propósito (15 e
16/08/2026): **dos quatro canais ALSA do sink `analog-surround-40`, só o canal 1
alcança o alto-falante interno.** Os ensaios `sfx-canal0-nao-alimenta`,
`sfx-canal2-nao-alimenta` e `sfx-canal3-nao-alimenta` registram as três
respostas dela: *"nope ainda"*, *"nada"*, *"nada"*. **Um link estéreo ingênuo
manda o L para o canal 0 — que é inaudível.** E os canais 3-4 são os motores
voice-coil: áudio de jogo mandado para lá vira **vibração**, não som.

**Três coisas do cabo que o nó virtual herda, e todas já têm dono nesta árvore:**

1. **A posse do volume.** Sem posse dos bytes `common[4..7]`, o daemon escreve
   **ZERO em todo report** e o alto-falante fica mudo — dose-resposta com a
   orelha dela em 15/08 23h05: sem volume, *"nenhum"*; com `speaker volume 85`,
   *"bep bep bep"*; com volume 0, *"mudo"*. **Um alto-falante virtual publicado e
   mudo é pior que nenhum.**
2. **O nó não pode dormir.** Medido (`sfx-no-suspenso-come-o-comeco`): com o nó
   ocioso, *"não saiu"*; com o nó já acordado, *"tuuuuuuuu"*. O PipeWire
   suspende nó ocioso e **o religar do hardware come o começo do som**. A cura já
   existe e é o drop-in 54 (`app/audio_saida.py:1028`,
   `caminho_regra_nunca_dorme`) — o nó virtual precisa da mesma regra, e a tela
   já tem a frase que denuncia a ausência dela.
3. **A rota e o volume continuam de quem já são.** O nó virtual é **a porta por
   onde o áudio entra**; `speaker.set` continua sendo o dono do que o firmware
   faz com ele depois.

### 2.4 O que já existe reutilizável — e é mais da metade do motor

| peça | onde | o que serve na saída |
|---|---|---|
| **Abrir o hidraw em RDWR pelo broker** | `integrations/dualsense_bt_audio.py:1078` (`abrir_hidraw_rw`) | **inteira.** Com a emulação ligada o nó físico está escondido (0600 root); sem o fd cedido por `SCM_RIGHTS` a saída só funcionaria com o Hefesto desligado |
| **CRC-32 de output, semente `0xA2`** | `core/ds_output_report.py:235` (`bt_crc32`), `:51` (`BT_CRC_SEED`) | **inteira**, sem reimplementar tabela |
| **Envelope e blocos TLV** | `dualsense_bt_audio.py:223` (`BLOCO_SPEAKER = 0x13`), `:228` (`BLOCO_PRESENTE`), `:229` (`BLOCO_DUPLO`) | as constantes já estão nomeadas — o `BLOCO_SPEAKER` está **declarado e sem um único caminho de escrita** desde 25/07 |
| **Disciplina do nibble de sequência** | `dualsense_bt_audio.py:245` | a mitigação é estrutural: o kernel é dono do `0x31`, nós usamos outro id. **Vale igual na saída — e ela escreve muito mais** |
| **Descoberta dos DualSense em BT** | `dualsense_bt_audio.py:361` (`nos_dualsense_bluetooth`) | **inteira**, com o filtro que exclui o nosso próprio vpad |
| **Publicar/derrubar nó no PipeWire por `pactl`** | `dualsense_bt_audio.py:570` (`SourceVirtualPipeWire`) | o **molde**: ciclo de vida, `load-module`/`unload-module`, `priority.session` baixa, a armadilha do `wireplumber` parado |
| **Escrita que nunca bloqueia** | `dualsense_bt_audio.py:669` (`escrever`) | invertida: na saída quem não pode bloquear é a **leitura** do monitor |
| **Reconciliação por controle** | `daemon/subsystems/bt_mic.py:228` | **inteira**. Tirar um controle da lista derruba a ponte dele e deixa as outras de pé |
| **`Diagnostico` com impedimentos em texto** | `dualsense_bt_audio.py:1219` | o molde do *"ausência é resposta"*: sem `pactl`, sem controle, sem módulo, nada sobe |
| **Opus, sem dependência nova** | `dualsense_bt_audio.py:413` (`DecodadorOpus`, ctypes sobre `libopus.so.0`) | **MEDIDO em 29/08/2026 nesta máquina:** a `libopus 1.4` instalada exporta `opus_encoder_create`, `opus_encode`, `opus_encoder_ctl` e `opus_encoder_destroy`. O codificador é o mesmo `.so`, o mesmo `ctypes`, **zero pacote novo** |
| **Rota, volume e pré-amp** | `core/backend_pydualsense.py:377` (`_byte_da_rota`) | já escritos; a saída **não os reescreve** |
| **Identidade do sink no cabo** | `app/mic_monitor.py:312` (`escolher_sink`) | resolve pelo dispositivo USB em que placa e HID penduram juntos, **nunca pelo nome** |
| **A regra do nó que não dorme** | `app/audio_saida.py:1028` | o drop-in 54, e a frase de tela que denuncia a ausência |

**O que NÃO existe, e é o que sobra para escrever:** o codificador Opus, o
empacotador da escada, o leitor do monitor, o link do cabo, e a máquina de
estados que troca de rota quando o transporte muda.

---

## 3. As entregas, em degraus — e a sprint PARA no meio de propósito

**D1 a D3 não escrevem um único byte novo de protocolo.** Elas entregam o
alto-falante virtual **funcionando no cabo**, que é o transporte onde o som já
está provado. **D4 a D6 dependem de uma medição que ainda não foi feita.**

### D1 — o nó nasce, e ele não sabe o que é transporte

Um `module-null-sink` por controle, 48 kHz, `s16le`, 2 canais, com
`priority.session` baixa (o controle **não** vira a saída padrão sozinho — é o
mesmo princípio do drop-in 51 da entrada, e *"o controle fica mexendo no
microfone"* foi sintoma real). Ciclo de vida idêntico ao da
`SourceVirtualPipeWire`, e `diagnosticar()` diz **por que** não subiu quando não
sobe.

**A MORDIDA:** derive o nome ou o id do nó do transporte e veja reprovar. O
mesmo controle, no cabo e no rádio, tem de dar o **mesmo nó** — mudar de nome ao
tirar o cabo é o defeito inteiro que esta sprint existe para não ter.
**A segunda mordida:** arranque a `priority.session` baixa e veja reprovar — sem
ela o nó pode virar a saída padrão do sistema sozinho, e o som da máquina dela
some para dentro de um controle.

### D2 — no cabo, o monitor é ligado ao sink do controle, no canal certo

Link do monitor do nó para o sink USB **daquele** controle, resolvido pela
identidade (`escolher_sink`), com o mapa de canais **medido**: o que tem de
soar no alto-falante interno vai para o **canal 1**.

**A MORDIDA:** ligue o L no canal 0 — que é o que um link estéreo ingênuo faz — e
veja reprovar contra os três ensaios de canal mudo (`sfx-canal0-nao-alimenta`,
`sfx-canal2-nao-alimenta`, `sfx-canal3-nao-alimenta`). **A segunda:** ligue no
canal 3 e veja reprovar por outra razão — ali estão os motores voice-coil, e o
efeito sonoro vira vibração.
**A terceira, e é a que pega a bancada:** ponha dois controles no cabo e veja o
nó de cada um entregar no sink **do seu**. Casar por prefixo
`alsa_output.usb-` reprova com dois — o `-00` é desempate posicional do
PipeWire, não identidade.

### D3 — o nó não dorme, e ele não publica mudo

A regra do drop-in 54 vale para o nó virtual. E antes de publicar, o produto
**garante a posse do volume**: publicar um alto-falante que o firmware mantém em
zero é o pior resultado possível, porque **não há sintoma** — só silêncio.

**A MORDIDA:** arranque a garantia de posse e veja reprovar contra a
dose-resposta de 15/08 (`sfx-cabo-sem-posse` / `sfx-cabo-com-posse` /
`sfx-cabo-volume-zero`). **A segunda:** deixe o nó suspender e veja reprovar
contra `sfx-no-suspenso-come-o-comeco` — o primeiro som depois do silêncio tem
de sair.

**Até aqui, o aceite é a orelha dela, no cabo, e nada mais.**

### D4 — o PORTÃO: o excedente do degrau tem forma? (não é código, é ensaio)

**Esta entrega não escreve produto.** Ela roda o `scripts/ensaios/corpo_do_degrau.py`,
que **já existe** e foi escrito exatamente para isto: manda o **mesmo** `common`
pedindo cor, no **mesmo** report, variando **só** o recheio depois dele
(zeros / `0xFF` / ruído / TLV plausível / TLV com `len` incoerente), e usa a
lightbar como sensor — observável pelo olho dela, sem instrumento que possa
mentir sobre si mesmo.

- **se os cinco passos acendem** → o excedente é **ignorado** naquela posição, e
  a hipótese do áudio na escada **cai**. D5 e D6 não se escrevem;
- **se algum quebra** → há **forma**, e ela mora no que aquele passo mudou.

**A própria docstring do ensaio já diz por que ele vem antes:** *"escrever um
codificador para um formato que ninguém confirmou existir naquela posição é o
erro que a sprint nomeia"*.

**A MORDIDA do ensaio já está escrita nele, e é a razão de ele valer:** um
controle **positivo** (o passo 1 é a linha de base já medida — se ele não
acender, o instrumento quebrou e o ensaio para sozinho) e um **negativo**
(`--crc-errado`, que **não pode** acender — se acender, o firmware não está
consumindo o nosso pacote e a escada inteira significa outra coisa).

### D5 — o empacotador da escada, e a medição de banda que não existe

Só depois do D4. Codificador Opus (mesma `libopus`, mesmo `ctypes`),
empacotamento no degrau escolhido **pela tabela**, e a medição que falta:
**quanto custa escrever em regime** no mesmo enlace que carrega a entrada.

O preço da ENTRADA está medido (mic desligado: 260,4 Hz de input; ligado:
170,5 Hz de input + 106,2 Hz de áudio — o áudio não abre canal novo, divide a
fila). **O preço da SAÍDA é NÃO MEDIDO**, e é maior por construção: são 15 a 100
escritas por segundo de até 547 bytes, contra as poucas escritas por sessão da
entrada.

**A MORDIDA, e ela tem duração mínima escrita de propósito:** a régua roda
**três minutos por patamar**, não um tique. Uma medição de um instante daria
verde e esconderia justamente o que se quer ver — a fila do rádio enchendo, o
gyro perdendo janela, o `hid-playstation` disputando o enlace. Patamares: sem
saída / saída em `0x32` a 100 Hz / saída em `0x39` a 15 Hz, com a taxa de input
e a de motion medidas nos três, e a volta ao patamar zero para provar que o
efeito é de **banda** e não estado preso no firmware.
**A segunda mordida:** peça um payload de 89 bytes e veja o empacotador escolher
`0x33` — se ele escolher `0x32` (88 B de orçamento), o CRC cai fora do lugar e o
firmware descarta calado. **A terceira:** troque a tabela por
`78 + 64 * (id − 0x31)` e veja reprovar no `0x39` — 590 contra 547.

### D6 — a troca de rota ao vivo, sem o jogo saber

A máquina de estados: cabo → rádio → sem controle → cabo, com o nó **de pé** o
tempo todo e o jogo tocando sem interrupção.

**A MORDIDA:** derrube a rota do rádio (ponte ausente) e veja o nó **dizer** que
não tem para onde ir, com a frase do quê/por quê/o que fazer. **Aceitar o áudio
e jogá-lo fora tem de reprovar** — engolir calado é a queixa histórica dela:
*"tínhamos algo para o cabo e na hora do vamos ver a versão de BT não
funcionava"*.

---

## 4. O que NÃO foi medido — a lista, e o que faltaria

Nenhuma linha abaixo pode ser escrita como fato em lugar nenhum desta árvore.

| afirmação | estado | o que a mediria |
|---|---|---|
| o excedente dos degraus tem **forma** | **NÃO MEDIDO** — hipótese forte, e hipótese | `scripts/ensaios/corpo_do_degrau.py`, cinco passos, com a lightbar e o olho dela |
| o áudio de saída é **Opus** | **NÃO MEDIDO** — leitura de fonte única (`DS5Dongle`), grau **BAIXA** na canônica | o D4 primeiro; depois, variar o codec no mesmo degrau e ouvir |
| o report do áudio é `0x39` (e não `0x32`) | **EM DISPUTA** — duas fontes da casa discordam, nenhuma medida aqui (é o P4 da CONTROLE-INTEIRO-NO-RÁDIO-01) | o D4 resolve por eliminação; o degrau que responder ao recheio é o que carrega |
| `module-null-sink` e `module-pipe-sink` **carregam** nesta máquina | **NÃO MEDIDO** — medido só que os **nomes existem** no `.so` e que o irmão `module-pipe-source` funciona em produção | um `load-module` no D1, com `unload` no mesmo gesto |
| o **custo de banda** de escrever em regime por rádio | **NÃO MEDIDO** | o D5, três minutos por patamar |
| o alto-falante **soou** por rádio | **NÃO MEDIDO, e há discordância registrada.** Ela lembra de ter funcionado no Pragmata; quatro tentativas de replicar deram negativo (ensaio `som-no-radio-observado-nao-replicado`, 16/08, `inconclusivo`) | repetir o ensaio no rádio com a orelha dela — item 3 da PONTO-A-PONTO-01. **Não se conclui que ela ouviu errado; conclui-se que não sabemos** |
| a curva do volume **com** pré-amp | **NÃO MEDIDO** — a curva de 01/08 ("mudo até 38, satura em 102") mediu um caminho de código que não existe mais | refazer a curva pelo caminho de hoje |

---

## 5. Nada se perdeu

- **A metade de ENTRADA não é tocada.** `dualsense_bt_audio.py` e
  `daemon/subsystems/bt_mic.py` estão em `nao_toca`: o microfone por rádio já
  funciona e está provado com o olho dela em 16/08 (`bt_mic_source_publicada`,
  source `RUNNING`), **apesar de o DualSense não anunciar perfil de áudio BT**
  (Class of Device `0x002508`, bit de áudio ausente). Esta sprint **importa**
  daquele módulo; não o edita.
- **O nó com nome de gente continua sendo da
  [O-ALTO-FALANTE-VIRTUAL-01](2026-08-29-O-ALTO-FALANTE-VIRTUAL-01-o-som-do-controle-ganha-o-que-o-gamepad-ja-tem.md).**
  Ela é a superfície (o nome na lista de saída, a máscara que não participa, um
  nó ou vários); esta é o motor (o PCM, o degrau, as duas rotas). **São duas
  sprints e não uma** porque a superfície pode fechar no cabo enquanto o motor
  do rádio espera o D4 — juntá-las enterraria a entrega pronta atrás da medição
  que falta.
- **O P4, o P5 e o P6 da
  [CONTROLE-INTEIRO-NO-RADIO-01](2026-08-07-CONTROLE-INTEIRO-NO-RADIO-01-o-mic-e-o-fone-que-nao-atravessam.md)
  continuam sendo os donos do protocolo.** O D4 desta sprint **é** o P4 sendo
  executado, não uma segunda versão dele; o D5 é o P5; e o P6 (a rota) já está
  escrito no produto desde 11/08 — o parágrafo que dizia *"este projeto escreve
  só o volume"* caducou, e não se reabre aqui.
- **`speaker.set`, o volume, o mudo e o `Devolver` continuam da
  MIGRA-CONTROLES-11 e do `app/audio_saida.py`.** O nó virtual é **por onde o
  áudio entra**; o que o firmware faz com ele depois tem dono, e não é este.
- **A frase que o mapa proíbe continua proibida.** Enquanto o D4 não rodar, o
  honesto é: *o canal existe, o firmware responde, e o conteúdo do payload
  ainda não foi identificado.*
- **A régua não é a mesa desta casa.** Nenhuma prova pode depender de quatro
  controles, de dois DualSense ou dos MACs desta bancada — o requisito dela de
  29/08 vale aqui inteiro: *"que funcione como acessibilidade pra qualquer
  usuário simples"*. Dublês com MACs sintéticos e uma mesa de um controle.

---

## 6. O que é dela decidir

1. **O nó vive sempre, ou só quando há controle?** Um nó permanente é o que
   impede o jogo de perder a saída na troca de transporte — e é ruído na lista
   de som quando não há controle nenhum na mesa. O preço está nos dois lados.
2. **No cabo, o padrão é ligar ou não ligar?** Publicar o nó é uma coisa;
   **mandar o som para ele** é outra. A casa já tem a regra de que o controle não
   vira saída padrão sozinho — esta sprint a mantém, e a decisão de mudá-la é
   dela.
3. **Latência contra fôlego, no rádio.** O `0x32` a 100 Hz dá ~10 ms de atraso e
   muita escrita; o `0x39` a 15 Hz dá ~60 ms e pouca. Para efeito sonoro de jogo
   os 60 ms são audíveis como atraso. **A escolha só se faz depois do D5**, e
   com o número na mesa.
4. **O que a tela diz quando não há rota.** A frase do quê/por quê/o que fazer é
   palavra dela.
