---
sprint: MIC-OS-QUATRO-01
estado: aberta
posse:
  MIC-OS-QUATRO-01:
    - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
    - src/hefesto_dualsense4unix/daemon/subsystems/eleicao_de_microfone.py
    - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
bancada: false
depois_de: []
---

# Os quatro microfones funcionando

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
| **RÁDIO (P1, P3)** | não há fonte NENHUMA. O DualSense no rádio não publica áudio sem a `PonteMicBluetooth` de pé. É o trabalho grande |

## O que fazer, em ordem de custo

1. **O CABO PRIMEIRO** — dois controles, fonte existente, só falta o canal ser
   eleito por controle em vez de um só. Mede-se com `pactl` antes e depois, e a
   prova é a voz dela saindo no canal certo.
2. **O RÁDIO** depende da `PonteMicBluetooth` (`dualsense_bt_audio.py`), que já
   ganhou em 08/09 o `dizer_o_pedido_dela` — o ato dela liga o `0x32` sem
   esperar a source subir. **Isso foi provado por régua e NÃO no aparelho.**
   Ver a ressalva 2 do laudo daquela frente: *"a cura do item 1 não foi medida
   no aparelho"*.
3. **A ressalva que fica escrita:** o `canal_motivo` do daemon já diz a verdade
   — *"no rádio ele só aparece com a ponte de microfone de pé"*. A tela vai
   passar a mostrar essa frase com a cura do teto; ela é o mapa do que falta.

## O que MORDE

* os QUATRO com `canal_ativo=True` e quatro `canal_fonte` distintas;
* a voz dela sai no canal de CADA um, um de cada vez — e este teste é dela, com
  a orelha, como o do alto-falante;
* arrancar a eleição de um deles derruba a régua nomeando o controle.
