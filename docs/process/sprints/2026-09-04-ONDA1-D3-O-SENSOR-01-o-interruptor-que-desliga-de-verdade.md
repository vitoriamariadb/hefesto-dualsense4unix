---
sprint: ONDA1-D3-O-SENSOR-01
estado: feita
posse:
  D3:
    - src/hefesto_dualsense4unix/daemon/sensor_hub.py
    - src/hefesto_dualsense4unix/core/evdev_reader.py
cria:
  - src/hefesto_dualsense4unix/core/virtual_motion.py
  - tests/unit/test_o_sensor_desliga_de_verdade.py
  - scripts/ensaios/o_jogo_para_de_ver_o_giro.py
bancada: true
depois_de: [COOP-QUE-NAO-DESMONTA-01, ONDA-CONTROLES-04, ONDA1-D1-O-SOM-01, ONDA1-D2-A-VIBRACAO-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
  - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
  - src/hefesto_dualsense4unix/app/audio_saida.py
  - docs/data/paridade-gtk-html.csv
---

> **ESTADO 06/09/2026: feita** — T-09 fechada (plano das 24 horas, §1).

# ONDA1-D3 · O SENSOR — o interruptor que desliga de verdade

**Espera a D1 e a D2 fecharem.** As três escrevem no mesmo
`daemon/ipc_handlers.py`, no mesmo `app/ipc_bridge.py` e — com a D2 — no mesmo
`profiles/schema.py`. **Quando você começar, esses três passam a ser seus.**

A sprint que esta materializa é
[SENSOR-DE-VERDADE-01](2026-09-04-SENSOR-DE-VERDADE-01-giro-e-acelerometro-desligam-em-qualquer-modo.md).

---

## 1. ELA RECUSOU AS DUAS OPÇÕES BARATAS

Os botões Giroscópio e Acelerômetro de cada cartão são interruptores **de uma
coisa sem interruptor**: `daemon.metodos()` não traz `sensor.*`, o `sensor_hub`
só LÊ, e o `profiles/schema.py` diz que os dois estão *"fora por ausência, não
por decisão"*.

Eu ofereci três saídas e recomendei a barata — virar leitura, um selo "no ar /
parado", zero linha nova. **Ela recusou, e a resposta foi mais do que as três:**

> *"ele tem que funcionar de verdade. ambos independente do modo e da mascara."* <!-- noqa-acento: citação literal dela -->

**Interruptor de verdade. Cada sensor por si. Em Nativo e em Virtual. Com ou
sem máscara.**

## 2. A PRIMEIRA COISA É UMA MEDIÇÃO, NÃO CÓDIGO

**Não escreva uma linha antes de medir POR ONDE O JOGO LÊ O GIRO em cada
modo.** O caminho não é o mesmo, e a sprint existe porque ninguém o mediu:

| modo | por onde o jogo recebe o movimento | medido? |
| --- | --- | --- |
| Nativo | o `hid_playstation` publica os nós de movimento direto | **meça** |
| Virtual / máscara | o vpad é quem publica — e é ele que precisa parar | **meça** |

Sem esse mapa, "desligar" vira desligar o reader de leitura da interface e
deixar o jogo recebendo movimento do mesmo jeito. **Seria o verde falso de
04/09 outra vez: um interruptor que responde `aplicado` sobre um dado que
continua fluindo.**

## 3. UMA ARMADILHA QUE JÁ ENGANOU ESTA CASA, e ela é sua

Os readers do `SensorHub` **nascem sob demanda e morrem 5 s depois do último
pedido**. Medir com UMA amostra devolve `sensores = []` **sempre** — foi assim
que uma medição de 04/09 concluiu que gyro e accel não existiam para controle
nenhum, e eles estavam lá.

**Deixe o tique correr ~1 s antes de perguntar.** Uma medição pode estar FRIA
em vez de errada, e a diferença não aparece no resultado.

## 4. O TRABALHO

* **`ipc_handlers.py`:** `sensor.set {uniq, giroscopio, acelerometro}` — dois
  interruptores independentes, como ela pediu (*"ambos"*, cada um por si).
* **`profiles/schema.py`:** um flag por sensor, por controle, no perfil. O que
  ela desliga continua desligado depois de reconectar.
* **`sensor_hub.py`:** obedece — com o sensor desligado, o reader daquele
  controle não nasce.
* **`core/virtual_motion.py`** (novo) e **`core/evdev_reader.py`:** o vpad
  deixa de publicar o nó de movimento daquele controle. **É esta metade que faz
  o jogo parar de ver**, e é a que a medição da §2 tem de localizar primeiro.
* **`ipc_bridge.py`:** o método, e a recusa dizendo qual metade falhou.

## 5. O QUE VOCÊ **NÃO** FAZ

A metade de TELA é da aba 02 (`a02_controles.py`, `aba02.py`) e do piloto. Os
botões já **recusam dizendo** desde a madrugada de 04/09 — quem os liga ao
método novo é a frente da aba 02, na Onda 2. **Relate; não edite.**

---

## A MORDIDA — e ela tem de ser feita COM UM JOGO ABERTO

* `scripts/ensaios/o_jogo_para_de_ver_o_giro.py`: com o jogo aberto, desligue o
  giroscópio e prove que o **jogo** parou de receber movimento — não que a
  interface parou de mostrar. São coisas diferentes, e confundi-las é
  exatamente o defeito que esta sprint existe para não cometer;
* **arranque a metade do vpad** e veja a régua reprovar: sem ela, o interruptor
  responde `aplicado` e o giro continua chegando ao jogo;
* prove nos **dois modos** e **com e sem máscara** — foi o que ela pediu com
  todas as letras, e é onde a recomendação barata quebrava.

## A BANCADA — e ela é dela, e desta vez com jogo aberto

    bash scripts/bancada.sh exigir

`rc=1` significa **esperar e dizer na entrega que está esperando**. Reserve com
`--horas`: esta é a mais longa das três frentes de motor, e a única que precisa
de um jogo rodando.

**Não abra janela na tela dela.** Ela tem UMA tela; se o ensaio precisar de um
jogo com janela, **pare e relate** — quem decide isso é quem coordena, não você.
