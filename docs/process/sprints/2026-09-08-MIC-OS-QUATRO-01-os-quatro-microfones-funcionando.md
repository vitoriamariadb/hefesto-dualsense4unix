---
sprint: MIC-OS-QUATRO-01
estado: feita
posse:
  MIC-OS-QUATRO-01:
    - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
    - src/hefesto_dualsense4unix/daemon/subsystems/mic_da_mesa.py
    - src/hefesto_dualsense4unix/integrations/eleicao_de_microfone.py
    - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
    # ALARGADA EM 09/09/2026, no reparo, e a razão vale a linha: o cabeçalho de
    # `canal_do_microfone.propriedades_do_canal` guardava um FATO ERRADO VIVO —
    # dizia que o «caso B» era defeito vivo de `dualsense_bt_audio`, curado
    # desde `d8901de0` (06/09, 07h11), duas horas depois de a frase ser
    # escrita. Eu o tinha RELATADO alegando posse; fato errado vivo é pior que
    # posse alargada, porque a próxima pessoa lê a mentira como verdade.
    - src/hefesto_dualsense4unix/integrations/canal_do_microfone.py
bancada: false
depois_de: []
---

# Os quatro microfones funcionando — um microfone VIRTUAL por controle, cabo e BT

> **ESTADO 2026-09-09: feita** — o nó do microfone passou a se chamar «Microfone
> do Controle N» (decisão dela, *"4a"*) e deixou de publicar o endereço dela na
> lista de áudio da máquina; o **CABO ganhou supervisor de canal** — até aqui
> `canal_do_microfone.abrir` tinha UM chamador em `src/` e era a ponte de rádio,
> então quatro nós era impossível por construção; e a palavra dela sobre o
> microfone de um controle NO FIO parou de evaporar (o supervisor lia só o
> rádio e apagava o pedido na varredura seguinte — medido). **Sem bancada:**
> tudo com dublê, e as quatro respostas de aparelho ficam para a
> MESA-DE-QUATRO-01. **Uma linha do enunciado CAIU:** *"os QUATRO com
> `canal_ativo=True`"* é impossível — `canal_ativo` é *"sou o padrão do
> sistema"*, e o padrão é UM; é a decisão dela da CANAL-POR-CONTROLE-01.
> Laudo: [`docs/process/agentes/2026-09-09/MIC-OS-QUATRO-01-opus.md`](../agentes/2026-09-09/MIC-OS-QUATRO-01-opus.md).

> **A palavra dela, 08/09 à noite:** *"o lance dos 4 mic virtuais via bt pra cada controle e cavbo"* <!-- noqa-acento: citação literal dela, palavra por palavra --> — e a metade do SOM é a [SOM-POR-CONTROLE-01](2026-09-08-SOM-POR-CONTROLE-01-o-mix-completo-ou-o-canal-de-sfx-caindo-em-cada-controle.md).
>
> **Medido na mesa dela às 23h (`pactl list short sources`):** DUAS fontes, as dos dois
> controles do cabo (`alsa_input.usb-…DualSense…-00` e `-00.2`), a primeira como
> entrada padrão; **zero** fonte para os dois do rádio (a ponte está desligada); e
> **zero** nó virtual com nome de controle. O que ela pede é o mesmo contrato do
> alto-falante: **«Microfone do Controle 1..4» na lista de entrada do sistema** (nome decidido por ela em 09/09, *"4a"*),
> um por controle, que não some quando o controle troca de cabo para rádio — por
> cima da fonte USB no cabo, por cima da ponte no BT.

## A palavra dela, e a resposta honesta

> *"sobre o microfone a ideia é termos os 4 funcionando. A cura que vc está
> trazendo faz isso?"*

**NÃO.** A cura de 08/09 (`_TETO_DO_ATO_DE_AUDIO`, no `ipc_bridge`) só faz a
tela **dizer a verdade**: o daemon leva 3.070 ms e a ponte esperava 250 ms, então
a razão real era descartada e a tela mostrava três causas erradas. Isso é
conserto de INSTRUMENTO. Os quatro microfones continuam sem funcionar.

## O QUE FOI MEDIDO — 08/09/2026, 21h, com os quatro na mesa

```
P4 usb  canal_ativo=True   fonte=alsa_input...DualSense...iec958-stereo
P2 usb  canal_ativo=False  fonte=alsa_input...DualSense-00.2.iec958-stereo
P3 bt   canal_ativo=False  fonte=None
P1 bt   canal_ativo=False  fonte=None
```

E o `pactl list short sources` confirma: **existem DUAS fontes de captura**, uma
por controle de CABO. Nenhuma para os dois do rádio.

**São dois problemas diferentes, e confundi-los é o erro a evitar:**

| | o que falta |
| --- | --- |
| **CABO (P2, P4)** | a fonte EXISTE nos dois e só UM está eleito. É eleição, não hardware — o mais barato dos dois, e fecha metade do pedido dela |
| **RÁDIO (P1, P3)** | não há fonte NENHUMA **porque a ponte está DESLIGADA** — e é desligada por desenho: gesto explícito dela, por privacidade e banda do rádio (`bt_mic.py`, cabeçalho, as duas travas). **Com a ponte de pé o rádio ENTREGA VOZ, medido em 07/09** (`mic-radio-a-voz-sai-0907` no caderno: 1.133 quadros Opus em 10 s, −34,8 dBFS — mais alto que o cabo, −44 a −52). O trabalho grande não é construir a ponte: é ela subir para CADA controle do rádio pelo ato dela, e a eleição valer para quatro |

## O que fazer, em ordem de custo

1. **O CABO PRIMEIRO** — dois controles, fonte existente, só falta o canal ser
   eleito por controle em vez de um só. Mede-se com `pactl` antes e depois, e a
   prova é a voz dela saindo no canal certo.
2. **O RÁDIO** depende da `PonteMicBluetooth` (`dualsense_bt_audio.py`) estar
   de pé para AQUELE controle. A ponte entrega (07/09, um controle de cada vez,
   com o negativo do mudo no mesmo instrumento — `mic-radio-negativo-do-mudo-0907`);
   o que ganhou em 08/09 foi o `dizer_o_pedido_dela` (`:1132`) — o ato dela
   liga o `0x32` sem esperar a source subir — e **isso foi provado por régua e
   NÃO no aparelho** (ressalva 2 do laudo daquela frente). O que falta medir é
   **dois no rádio ao mesmo tempo**, que nunca foi feito.
   A eleição fala por `integrations/eleicao_de_microfone.py` —
   `pedir_canal(uniq)` e `melhor_fonte_elegivel()` — e é ela que hoje escolhe
   UM. `mic_da_mesa.py` é quem a chama.
3. **A ressalva que fica escrita:** o `canal_motivo` do daemon já diz a verdade
   — *"no rádio ele só aparece com a ponte de microfone de pé"*. A tela vai
   passar a mostrar essa frase com a cura do teto; ela é o mapa do que falta.

## PENDÊNCIA ABERTA — É DELA: o rótulo não se reescreve quando os assentos andam

**Não é dúvida de implementação, é escolha de produto, e por isso fica escrita
aqui em vez de decidida no código.** Estado em 09/09/2026, com a MIC-OS-QUATRO-01
feita.

**O que acontece.** O rótulo «Microfone do Controle N» é o
`device.description` do `load-module module-pipe-source`, gravado **no instante
em que o canal sobe**. O assento, não: ele é a posição do controle na lista de
CONECTADOS (`BtMicSubsystem.numero_do_assento`), e ela anda quando alguém tira
ou põe um controle. Tire o controle do assento 1 com os quatro na mesa e a tela
renumera os cards para 1, 2, 3 — os nós na lista de áudio continuam dizendo 2,
3 e 4 até o canal ser reerguido.

**E o reparo de 09/09 tornou isto MAIS visível, de propósito.** Antes, o assento
saía do `index` do handle, e um controle desligado segurava o número dos outros;
isso escondia o envelhecimento e, em troca, fazia o rótulo discordar do card. A
correção foi seguir a tela — que é a verdade que ela lê. O preço é este: o
assento agora se move sempre que alguém desconecta, e é exatamente aí que o
rótulo gravado envelhece.

**A saída barata não existe — medido nesta máquina em 09/09/2026.** O `pactl`
daqui é o **16.1** (pipewire-pulse), e a lista de verbos dele não tem
`update-source-proplist` nem nada que reescreva a proplist de uma source já
carregada: `load-module`, `unload-module`, `set-source-mute`, `set-source-volume`
— e nenhum verbo de renomear. Pela porta que este código usa, trocar a
descrição é **derrubar e subir o nó**. Não há terceira opção sem trocar de
porta (`pw-cli`/`pw-metadata`), que é trabalho de outra sprint.

**AS DUAS SAÍDAS, com o custo de cada uma:**

| | o que se faz | o que custa |
| --- | --- | --- |
| **(a) reerguer o nó quando o assento muda** | `unload-module` + `load-module` com a descrição nova, e o `parec` do alimentador junto. Só quando a source **não** está `RUNNING` — o `_talvez_seguir_a_source` já sabe distinguir `RUNNING` de `IDLE`. | **O nó some da lista por um instante.** E o custo já está medido nesta casa, escrito no `canal_do_microfone.fechar`: *"um controle que pisca no cabo (o caso do hub sobrecarregado, medido nesta casa) derrubaria e subiria o nó a cada piscada, e todo app que estivesse gravando perderia a fonte no meio da frase"*. A guarda do `RUNNING` cobre quem está gravando NAQUELE canal; não cobre quem tem o canal **escolhido e ocioso** num seletor — esse cai no padrão do sistema sem aviso. |
| **(b) aceitar que o número envelhece, e dizê-lo** | O rótulo fica como nasceu até o canal cair (ela solta o botão do microfone, o controle sai da mesa, ou o daemon reinicia). | **O rótulo mente enquanto durar.** «Microfone do Controle 3» no controle cujo card diz 1 — e o número é justamente o que ela pediu para poder distinguir um do outro. Zero risco para quem está gravando. |

**A pergunta, em uma linha:** *quando o assento anda e o nó não está sendo
gravado, o Hefesto reergue o nó (o canal pisca) ou deixa o número envelhecer (o
rótulo mente)?*

**Não decidi por ela** — as duas saídas trocam um defeito visível por outro, e
a troca é do tipo que ela vem decidindo pessoalmente (o par «Alto-falante /
Microfone do Controle N» de 09/09 é o exemplo do dia). Quando a resposta vier,
o lugar de escrevê-la é `BtMicSubsystem` (quem sabe o assento) e
`canal_do_microfone.abrir` (quem grava o rótulo).

## O que MORDE

* `scripts/ensaios/os_nos_de_som_por_controle.py` (09/09) conta um «Microfone do Controle N» por controle físico e nomeia a falta; `pactl list short sources` tem **quatro** nós do Hefesto com nome de controle, com os quatro na mesa — dois no cabo, dois no rádio; tirar o cabo de um e o nó dele continua na lista;
* os QUATRO com `canal_ativo=True` e quatro `canal_fonte` distintas;
* a voz dela sai no canal de CADA um, um de cada vez — e este teste é dela, com
  a orelha, como o do alto-falante;
* arrancar a eleição de um deles derruba a régua nomeando o controle.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo | ✓ um eleito (medido 08/09); pronto = os DOIS do cabo com `canal_ativo=True` e fontes distintas |
| BT | ✓ com a ponte de pé, um de cada vez (07/09); pronto = os dois do rádio ao mesmo tempo, cada um no seu canal |
| no perfil | ✓ `mic` (global) + `ControllerMicOverride` (`schema.py:1056-1077`): mudo e volume por controle — e o `volume` é campo SEM ato (`audio.microfone.volume` = `decisao-tomada`): decidir se sai |
| por controle | ✓ o campo existe; ✗ o ato — hoje a eleição escolhe UM. Pronto = quatro `canal_fonte` distintas e o mudo de cada um sobrevivendo à reconexão |
