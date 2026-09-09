---
sprint: MIC-OS-QUATRO-01
estado: aberta
posse:
  MIC-OS-QUATRO-01:
    - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
    - src/hefesto_dualsense4unix/daemon/subsystems/mic_da_mesa.py
    - src/hefesto_dualsense4unix/integrations/eleicao_de_microfone.py
    - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
bancada: false
depois_de: []
---

# Os quatro microfones funcionando — um microfone VIRTUAL por controle, cabo e BT

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

## O que MORDE

* `pactl list short sources` tem **quatro** nós do Hefesto com nome de controle, com os quatro na mesa — dois no cabo, dois no rádio; tirar o cabo de um e o nó dele continua na lista;
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
