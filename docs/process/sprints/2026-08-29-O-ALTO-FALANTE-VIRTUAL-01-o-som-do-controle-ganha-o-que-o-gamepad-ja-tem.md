---
sprint: O-ALTO-FALANTE-VIRTUAL-01
estado: aberta
onda: G
posse:
  SOM:
    - src/hefesto_dualsense4unix/app/audio_saida.py
cria:
  - tests/unit/test_o_alto_falante_virtual_esconde_o_transporte.py
bancada: true
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
---

> **ROTA CORRIGIDA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** **Vale inteira; o nó nasce nos DOIS transportes, e quem o alimenta no rádio é a SOM-QUE-SAI-01 (os arranjos do payload já estão no mapa, `audio.alto_falante@dualsense.radio_offset`).** As duas
decisões que a sprint deixa para ela foram tomadas por delegação (registro
`D-0609-UM-NO-DE-SOM-POR-CONTROLE`): **um nó por controle**, com o nome pelo assento —
`Alto-falante · P1` … `P4` (é a língua do glossário; "controle 1" não). O `GerenciadorMicBluetooth`
não se toca. Mordidas da própria sprint: o nó não pode depender do `flavor`; a régua não é a mesa
desta casa (MACs sintéticos). **O aceite pela orelha dela é o ensaio 1 da MESA-DE-QUATRO-01.**
`MIGRA-CONTROLES-11` está `absorvida` e `CONTROLE-INTEIRO-NO-RADIO-01` não tem arquivo — os dois
saíram do `depois_de`.

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.4 — áudio por rádio; o ensaio 1 da bancada vem antes (FECHO, com ela).

# O ALTO-FALANTE VIRTUAL · 01 — o som do controle ganha o que o gamepad já tem

**Ideia dela, 29/08/2026** (trazida do Fable): alto-falante e microfone
**virtuais**, no estilo do gamepad virtual, para o som do controle funcionar
**independente da máscara e do transporte**.

**Metade disto já é produto, e é a metade que costuma ser a difícil.**

## O que já existe — a entrada

`GerenciadorMicBluetooth` (`integrations/dualsense_bt_audio.py`, dirigido por
`daemon/subsystems/bt_mic.py:228`) sobe em produção e **publica uma fonte no
PipeWire**. O mapa registra a prova de 16/08 com o olho dela —
`bt_mic_source_publicada`, source `RUNNING` — **apesar de o DualSense não
anunciar perfil de áudio BT** (Class of Device `0x002508`, bit de áudio ausente).
Ou seja: a casa já provou que dá para publicar um nó de áudio que **esconde o
transporte** do resto do sistema. É esse mecanismo, invertido, que esta sprint
pede.

## O que falta — a saída

- **`audio.alto_falante@dualsense`** (`docs/data/mapa-controles.csv:2`):
  `cabo_aciona = parcial`, `radio_aciona = não`, e a célula do rádio diz **"NÃO
  IMPLEMENTADO"** com todas as letras.
- **No cabo o caminho existe e não é nosso:** o som sai pelos **canais 1-2** do
  sink `alsa_output.usb-…analog-surround-40` do próprio controle, e *"quem toca é
  o SISTEMA — o Hefesto só mexe nos registradores"*. Quem quiser mandar áudio ao
  controle precisa **saber o nome do sink daquele controle**, que muda com a
  máquina, com a porta e com quantos estão ligados.
- **No rádio não há para onde mandar:** a ponte host→controle é a **P5** da
  [CONTROLE-INTEIRO-NO-RADIO-01](2026-08-07-CONTROLE-INTEIRO-NO-RADIO-01-o-mic-e-o-fone-que-nao-atravessam.md),
  medida como *"não há uma linha em toda a árvore"*. O **canal** já foi medido —
  os OUTPUT por rádio formam uma escada de +64 B (`0x31` = 77 B até `0x39` =
  546 B) e o firmware **executa** os degraus (15/08, com o olho dela na
  lightbar) —, mas o **payload** continua não identificado.

**A consequência para quem usa:** hoje "mandar som para o controle" é uma
pergunta diferente em cada transporte, e em nenhum dos dois há um nome estável
para escolher na lista de saída do sistema.

## O que entrega

1. **Um nó de saída por controle, com nome de gente.** *"Alto-falante do Controle
   1"* aparece na lista de saída do sistema como qualquer outro dispositivo, e o
   que houver por baixo é problema do produto, não de quem escolhe. É o mesmo
   contrato do vpad: o jogo escolhe um gamepad, não um transporte.
2. **O roteamento esconde o transporte.** No **cabo**, o nó entrega nos canais
   1-2 do sink USB daquele controle — resolvido pela identidade, nunca pelo nome
   do sink digitado. No **rádio**, ele entrega à ponte da P5 **quando ela
   existir**; até lá, o nó **diz que não tem para onde ir**, com a frase do
   quê/por quê/o que fazer. *"Não sei"* é resposta válida; sink que engole áudio
   em silêncio não é.
3. **A máscara não participa.** O nó existe com o controle em `dualsense`, em
   `xbox` ou em `nintendo` — som não é entrada, e a máscara é do gamepad. Isto é
   o pedido dela, literal, e é o que a régua cobra.

## Como se prova (a mordida)

`tests/unit/test_o_alto_falante_virtual_esconde_o_transporte.py`, com dublês de
PipeWire (nenhum áudio real na suíte):

- **o mesmo nó, os dois transportes.** O mesmo controle no cabo e no rádio
  aparece com o **mesmo nome** e o mesmo id. **A mordida:** derive o nome do
  transporte e veja reprovar — o nó mudar de nome ao trocar o cabo é o defeito
  que ele existe para não ter;
- **o sink é resolvido pela identidade, não pelo texto.** Dois controles na mesa,
  os dois com sink USB: cada nó entrega no sink **do seu**. **A mordida:** case
  por `alsa_output.usb-` e veja reprovar com dois controles — é o erro que a
  `audio_saida.py:552` já registra como *"os dois sinks de DualSense desta
  bancada"*;
- **sem rota, ele DIZ.** Controle no rádio, ponte da P5 ausente: o nó existe e
  reporta indisponível com a frase. **A mordida:** aceite o áudio e jogue fora, e
  veja reprovar — engolir calado é a queixa histórica dela (*"tínhamos algo para
  o cabo e na hora do vamos ver a versão de BT não funcionava"*);
- **a máscara não muda nada.** Os três valores de máscara, o mesmo nó. **A
  mordida:** faça o nó depender do `flavor` e veja reprovar;
- **a régua não é a mesa desta casa.** Dublês com MACs sintéticos e um controle
  que nunca se viu. Uma prova que só passa com os dois DualSense daqui mede a
  bancada, não a cura.

**O aceite é a orelha dela:** um som do sistema escolhido para o *"Alto-falante
do Controle 1"* e ouvido no controle, no cabo. O rádio entra quando a P5 entrar.

## Nada se perdeu

- o `GerenciadorMicBluetooth` **não é tocado**: a entrada já funciona e está
  provada com o olho dela em 16/08;
- o seletor de rota (`OUTPUT_PATH_SEL`) e o volume continuam sendo da
  MIGRA-CONTROLES-11 — este nó é **por onde o áudio entra**, não o que o
  firmware faz com ele depois;
- a P4 e a P5 da CONTROLE-INTEIRO-NO-RADIO-01 continuam sendo as donas do
  payload por rádio; esta sprint é a **superfície** que elas preenchem, e é
  escrita em separado justamente para que a superfície não nasça enterrada
  dentro de uma sprint de protocolo.

## O que é dela decidir

1. **O nome que aparece na lista de saída.** *"Alto-falante do Controle 1"* é
   proposta; texto de interface é palavra dela.
2. **Um nó por controle, ou um só que segue o jogador 1?** Quatro nós numa lista
   de saída é ruído para quem tem um controle; um nó só quebra a promessa de
   *"um jogador, um controle"*. O preço está nos dois lados, e a escolha é dela.
