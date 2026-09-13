---
sprint: OS-QUATRO-NO-AR-01
estado: feita
onda: A-FILA-DE-1309
posse:
  OS-QUATRO-NO-AR-01:
    - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
    - src/hefesto_dualsense4unix/integrations/eleicao_de_microfone.py
    - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
    - src/hefesto_dualsense4unix/daemon/subsystems/luz_do_mic.py
    - src/hefesto_dualsense4unix/daemon/subsystems/mic_da_mesa.py
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
cria:
  - tests/unit/test_os_quatro_microfones_ficam_no_ar.py
  - tests/unit/test_os_quatro_alto_falantes_tocam_juntos.py
bancada: true
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/integrations/alto_falante_bt.py
  - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
  - src/hefesto_dualsense4unix/integrations/audio_control.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
---

# OS-QUATRO-NO-AR-01 — os quatro microfones e os quatro alto-falantes ao mesmo tempo

> **ESTADO 2026-09-13: feita** — perder o padrão deixou de tirar alguém do ar: os quatro microfones ficam no ar juntos, o padrão do sistema é o último ligado que continua no ar, desligar quem não é o padrão tira só ele, e quem sai do ar de fato (duas leituras seguidas sem canal) perde a luz e a palavra sem tocar os outros. O selo da aba Controles passou a dizer ATIVO para cada um no ar. O §2 fechou sem código: nenhuma regra de um-por-vez no som, e a régua com quatro controles fica como prova. Sem aparelho: a prova com dois controles no rádio fica para a MESA-DE-QUATRO-01. A entrega está em `docs/process/agentes/2026-09-13/OS-QUATRO-NO-AR-01-opus.md`.

**13/09/2026, madrugada.** A pergunta de quem coordena: «com dois controles
ligados, quer os dois microfones funcionando ao mesmo tempo, cada um no seu
canal? Hoje é um de cada vez: ligar o segundo desliga o primeiro.» A resposta
dela:

> *"sim prosv 4 mesma coisa com o autofalante"* <!-- noqa-acento: citação literal dela -->

Sim, para os quatro controles — e o mesmo com o alto-falante.

**Não é decisão nova.** A CANAL-POR-CONTROLE-01 (03/09, citada no topo de
`eleicao_de_microfone.py`) já separou *ter canal*, que não é escasso, de *ser
o padrão do sistema*, que é único. O que ainda desfaz o primeiro é o código.

## §0 — O que foi medido

* **10/09/2026, dois DualSense no rádio:** pedir o microfone do segundo
  controle desfaz o primeiro — `bt_mic_palavra_dela_esquecida`, depois
  `bt_mic_pedido ligar=False` no hidraw dele. Cada um entrega ~100 quadros por
  segundo quando é o pedido; nunca os dois juntos.
* **A porta, lida no fonte:** `hotkey._apagar_a_luz_de_quem_perdeu_o_canal`.
  Quando outro controle vira o PADRÃO do sistema, ela apaga a luz do ex-dono e
  chama `esquecer_a_palavra` — e desde 08/09 *o microfone sai do ar com a luz*.
* **Alto-falante, lido no fonte e não medido:** cada controle tem o próprio nó
  (`hefesto_som_<hex6>`) e a própria `PonteDeSomPorRadio`; o botão único da
  janela (`audio_saida.DICA_ROTA_SEM_SINK`) é só a saída padrão do sistema.
  **Nenhuma regra de um-por-vez foi achada no som, e ninguém mediu com dois
  controles.**

## §1 — O desenho (decidido por quem coordena, por delegação dela; reversível)

| | por controle, os quatro juntos | um só |
| --- | --- | --- |
| microfone no ar | sim | — |
| luz do microfone | sim — *aceso = este mic está no ar* (contrato dela de 01/09) | — |
| fonte padrão do sistema | — | sim: o último que ela ligou |
| alto-falante tocando | sim | — |
| saída padrão do sistema | — | sim, e continua fora do botão do controle |

Os gestos:

1. **Apertar o mic de um controle APAGADO** → ele entra no ar, a luz acende e
   ele vira a fonte padrão. Os outros que estavam no ar **continuam no ar, de
   luz acesa**.
2. **Apertar o mic de um controle ACESO** → ele sai do ar e a luz apaga. Se era
   o padrão, o padrão passa ao último ligado que continua no ar; sem nenhum,
   volta o anterior guardado (o microfone real da máquina), como hoje.
3. **Perder o padrão não é sair do ar.** `_apagar_a_luz_de_quem_perdeu_o_canal`
   só apaga a luz e esquece a palavra quando o canal DAQUELE controle saiu do
   ar de fato (o controle caiu, a ponte caiu) — nunca porque outro virou padrão.
4. **A tela da aba Controles** mostra cada microfone no ar. Meça com dois no ar
   (dublê) o que ela mostra hoje, antes de mexer.

## §2 — O alto-falante: medir antes, curar só se houver regra

Com quatro controles de dublê (dois no cabo, dois no rádio): quatro nós
`hefesto_som_` publicados, quatro pontes de rádio de pé ao mesmo tempo, cada
monitor lido pela ponte do próprio controle — e o microfone do mesmo controle
continuando no ar com a ponte de som de pé (o bit 0 dos enables do `0x35` é o
mic; confira que aquela cura vale com quatro).

* **Se tudo coexiste:** a régua nova fica como prova e o §2 fecha sem código.
* **Se aparecer regra de um-por-vez no som:** ela mora em `alto_falante_bt.py`,
  que está com a SOM-RECUO-01 em voo. Pare, escreva a regra com o endereço e a
  cura na entrega (`## O que sobrou para o próximo`), sem tocar o arquivo.

## §3 — O que morde

* Liga A, liga B → A e B no ar, as duas luzes acesas, padrão = B. **Mordida:**
  devolver o `esquecer_a_palavra` na perda do padrão → reprova.
* Liga A, B e C; desliga C (o padrão) → padrão = B; A e B no ar.
* Desliga todos → o padrão volta ao anterior guardado.
* A ponte de A cai → a luz de A apaga e B não é tocado.
* Quatro alto-falantes de dublê de pé juntos (§2).
* **Aparelho:** com `bash scripts/bancada.sh exigir` rc=0, dois controles no
  rádio com quadros de áudio chegando dos dois ao mesmo tempo. Sem bancada,
  fica para a MESA-DE-QUATRO-01.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| pergunta | resposta |
| --- | --- |
| **por cabo** | o canal do cabo já nasce por controle (MIC-OS-QUATRO-01); os gestos do §1 valem igual |
| **por BT** | quatro pontes de microfone e quatro de som de pé juntas; prova de aparelho na bancada |
| **no perfil** | nada novo vai ao disco; o anterior guardado continua sendo o da eleição |
| **por controle** | é o ponto inteiro: no ar é por controle; só o padrão do sistema é único |
