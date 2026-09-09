---
sprint: SOM-POR-CONTROLE-01
estado: aberta
posse:
  SOM-POR-CONTROLE-01:
    - src/hefesto_dualsense4unix/app/audio_saida.py
    - src/hefesto_dualsense4unix/integrations/alto_falante_bt.py
    - src/hefesto_dualsense4unix/daemon/subsystems/alto_falante.py
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
    - src/hefesto_dualsense4unix/profiles/schema.py
bancada: true
depois_de: []
nao_toca:
  - docs/data/ensaios.csv
  - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
---

# SOM-POR-CONTROLE-01 — o mix completo ou o canal de SFX, caindo em cada controle, por cabo e por BT

**A palavra dela, 08/09/2026, à noite:** *"o lance dos 4 mic virtuais via bt pra
cada controle e cavbo e os somns seja hdmi completo seja o canal do sfx caindo
pra cada controle. nao esquece disso."* <!-- noqa-acento: citação literal dela, palavra por palavra -->

São **duas metades**, e esta sprint é a do SOM. A dos microfones é a
[MIC-OS-QUATRO-01](2026-09-08-MIC-OS-QUATRO-01-os-quatro-microfones-funcionando.md),
que ganhou hoje a mesma forma: **um nó por controle, com nome estável, nos
dois transportes**.

## §1 — O que a máquina dela tem AGORA (lido em 08/09 às 23h, `pactl`)

| nó | o que é | estado |
| --- | --- | --- |
| `alsa_output.usb-…DualSense…-00.analog-surround-40` | a placa do DualSense no cabo (P2) — 4 canais | `IDLE` |
| `alsa_output.usb-…DualSense…-00.2.analog-surround-40` | a placa do outro DualSense no cabo (P3) | `IDLE` |
| `alsa_output.pci-…hdmi-stereo` | **a saída padrão** — é o «HDMI completo» dela | `SUSPENDED` |
| `alsa_input.usb-…DualSense…-00.iec958-stereo` (e `-00.2`) | os dois microfones do cabo | `SUSPENDED`; o `-00` é a **entrada padrão** |
| «Alto-falante do Controle N» | o nó por controle que a O-ALTO-FALANTE-VIRTUAL-01 (`feita`) descreve (`app/audio_saida.py:1660`, `module-null-sink` com `sink_name` estável) | **não existe na lista** |
| o sink do rádio (`alto_falante_bt.py`, SOM-QUE-SAI-01, `feita`) | o nó que recebe PCM e empacota o degrau `0x39` | **não existe na lista** |
| qualquer nó dos dois controles do RÁDIO (P1, P4) | — | **nenhum**: sem placa, sem ponte de pé |

**Duas sprints estão `feita` e os nós que elas descrevem não estão na mesa
dela.** Ou eles só nascem por gesto (e ninguém clicou), ou não nascem no
produto instalado. É a primeira coisa a medir, e a resposta muda a sprint
inteira: *régua verde sobre nó que não existe é a assinatura dos instrumentos
falsos desta casa*.

## §2 — As duas fontes que ela nomeou, e o que cada uma exige

| fonte | o que é | como chega ao controle |
| --- | --- | --- |
| **«HDMI completo»** — o mix inteiro | o que a saída padrão recebe, inteiro, também no controle | um *loopback* do monitor da saída padrão para o nó do controle; no plástico, rota **3** (*«Todo o som do PC»*, canal R → alto-falante) ou rota **0** (estéreo → fone) |
| **«o canal do SFX»** — só o som do controle | o que um jogo manda para o alto-falante do controle (o caso Zelda: L → fone, R → alto-falante) — e **de cada um**: o SFX do P1 no P1 | o jogo (ou o seletor por aplicativo do sistema) aponta a corrente de SFX para o nó DAQUELE controle; no plástico, rota **2** (*«Sons do jogo»*) |

As rotas já existem e já são por controle: `ProfileSpeakerConfig.rota` 0..3 é
o `OUTPUT_PATH_SEL` do `audio_control` (`profiles/schema.py:520-568`), e
`ControllerOverrides.speaker` (`:1308`) grava volume, mudo e rota **por
`uniq`**. O que **não existe** é a FONTE: nada diz se o nó daquele controle
recebe o mix ou o SFX — e, sem nó estável, não há para onde apontar.

**Por transporte:**

| | cabo | BT |
| --- | --- | --- |
| a placa | existe, uma por controle (medido: duas na mesa dela); **e ela é do fio** — sai do cabo, some a placa (15/08) | não existe |
| o caminho | o nó do controle → canais 1-2 do sink USB daquele controle, resolvido pela identidade (item 2 da O-ALTO-FALANTE-VIRTUAL-01) | o nó do controle → o sink de `alto_falante_bt.py` → escada `0x32`-`0x39`. **Seis passadas em 08/09, silêncio nas seis**; a hipótese que sobra é o ENVELOPE (HIDP/L2CAP) — ensaio 13 do [índice do rádio](2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md) |
| o som sai? | ✓ orelha dela, 15-16/08 (`sfx-cabo-*`, `sfx-canal*` no caderno) | ✗ até o ensaio 13 dar som |

## §3 — O que esta sprint entrega

1. **O nó por controle, VIVO na mesa dela**, nos dois transportes: quatro
   entradas na lista de saída do sistema — *«Alto-falante do Controle 1..4»*
   (nome é palavra dela) —, que não somem quando o controle troca de cabo para
   rádio. É o contrato da O-ALTO-FALANTE-VIRTUAL-01; o que muda é que ele passa
   a ser **medido na lista viva** (`pactl list short sinks`), não numa régua.
2. **A fonte, por controle, no perfil:** `ControllerOverrides.speaker` ganha
   `fonte: "mix" | "sfx"`. `mix` liga o loopback do monitor da saída padrão ao
   nó; `sfx` deixa o nó livre para a corrente do jogo. A rota do plástico segue
   a fonte (3 ou 0 para o mix; 2 para o SFX) — e continua sendo campo dela, não
   automático, porque o fone e o alto-falante são **as duas saídas** que ela
   nomeou.
3. **A tela da aba 02 diz as duas coisas por controle:** a fonte (mix/SFX) e a
   saída (alto-falante/fone), com o `?` explicando a rota — sem `hidraw`,
   `sink` nem `loopback` na tela.
4. **No BT, o nó diz que não tem para onde ir** enquanto o ensaio 13 não der
   som — a frase é a do quê/por quê/o que fazer da O-ALTO-FALANTE-VIRTUAL-01, e
   a tela **não confessa dívida** (decisão dela, 07/09). Quando o ensaio der
   som, a estrada do BT é ligada por baixo do mesmo nó, e o jogo não fica
   sabendo.
5. **O negativo do BT vai para o caderno.** As seis passadas de 08/09 não têm
   linha em `docs/data/ensaios.csv`; quem coordena a bancada escreve
   (`nao_toca` aqui), senão a próxima pessoa repete as seis.

## §4 — O que era dela decidir — decidido em 08/09 à noite (*"concordo com as 5"*)

1. **O nó vive SEMPRE** (`D-0809-O-NO-DE-SOM-POR-CONTROLE-VIVE-SEMPRE`): quatro
   nós fixos na lista; sem controle, o nó diz que não tem para onde ir — e a
   tela não confessa dívida (07/09). A pergunta da SOM-QUE-SAI-01 §6.1 fecha.
2. **No cabo, o padrão é `sfx`** (`D-0809-NO-CABO-O-PADRAO-DO-SOM-E-SFX`):
   `ControllerOverrides.speaker.fonte` nasce `sfx`; `mix` é escolha no perfil,
   por controle. A casa continua não fazendo do controle a saída padrão.
3. **O nome na lista** ainda é dela, com opções na §2 do SPRINT_ORDER —
   *«Alto-falante do Controle 1»* é a proposta.

## §5 — Critério de pronto — por cabo · por BT · no perfil · por controle

| | |
| --- | --- |
| **cabo** | ✓ o som sai (orelha dela, 15-16/08); pronto = o nó do P2 toca no P2 e o do P3 no P3, um de cada vez, com `mix` e com `sfx` |
| **BT** | ✗ hoje; pronto = o mesmo teste com P1 e P4 — depende do ensaio 13. Até lá o nó existe e diz que não tem para onde ir |
| **no perfil** | ✓ `speaker` (volume, mudo, rota) + o campo novo `fonte`; um perfil velho sem `fonte` carrega com `None` = não mexer |
| **por controle** | ✓ `ControllerOverrides.speaker` por `uniq`; pronto = P2 em `mix` e P3 em `sfx` ao mesmo tempo, e trocar um não mexe no outro |

## §6 — O que MORDE

* com dois controles no cabo, `pactl list short sinks` tem **dois** nós do
  Hefesto com nome estável; tirar o cabo de um e o nó dele **continua na
  lista** (e diz que não tem para onde ir); pôr de volta e o som volta — sem
  o jogo reescolher nada;
* `fonte=mix` no P2 → um tocador na saída padrão é ouvido no alto-falante do
  P2 e **não** no do P3; `fonte=sfx` → o mesmo tocador NÃO sai no P2;
* arrancar o loopback e a régua reprova nomeando o controle; a régua lê a
  lista viva de nós, nunca o próprio módulo que os cria (é a cicatriz de
  `paplay --device=nao_existe` que o `audio_saida.py` já registra: tocador
  aceita sink inexistente e toca no padrão — o que sairia pela TV dela).
