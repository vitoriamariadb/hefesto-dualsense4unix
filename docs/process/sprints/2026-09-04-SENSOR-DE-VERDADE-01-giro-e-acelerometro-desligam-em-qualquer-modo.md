# SENSOR-DE-VERDADE-01 — giroscópio e acelerômetro desligam de verdade, em qualquer modo

> **Decisão dela, 04/09/2026, tarde:** *"ele tem que funcionar de verdade.
> ambos independente do modo e da mascara."* <!-- noqa-acento: citação literal dela -->
>
> Eu recomendei virar leitura. **Ela quer o interruptor** — e os dois, cada um
> por si, valendo em Nativo e em Virtual, com ou sem máscara.

## 0. O QUE EXISTE, medido

* Não há método: `daemon.metodos()` não traz `sensor.*`; o `sensor_hub` só LÊ
  (gesto `sensor`, `interface/pacotes/a02_controles.py:1861`, recusa dizendo).
* **O hub não agarra o nó de propósito** (`daemon/sensor_hub.py:45`): um
  `EVIOCGRAB` no nó do CONTROLE mataria os botões para o jogo. Mas o
  `hid_playstation` publica o movimento num nó evdev **separado** ("Motion
  Sensors") — agarrar ESSE nó esconde o giro do jogo sem tocar um botão. A API
  de grab já existe no leitor (`core/evdev_reader.py:1320`).
* **Em Virtual o giro já passa pelo vpad — só do P1, e só no `uhid`.** É o
  GYRO-01: `start_motion_reader` (`daemon/subsystems/gamepad.py:1754`)
  espelha o movimento do físico primário no vpad; `stop_motion_reader`
  (`:1800`) o para. O caminho `uinput` não tem `forward_motion` (`:1757`).
  **O interruptor em Virtual já tem metade do motor: parar o espelho.** O
  que não tem é filtro por sensor, nem espelho para o não-primário — a
  mesma "metade da mesa" muda que a STATUS-04 curou nos sensores lidos.
* A máscara é `_handle_gamepad_mask_set` (`daemon/ipc_handlers.py:5545`) e
  decide a CARA do vpad. **Não pode entrar na conta do sensor.**

## 1. PRIMEIRO SE MEDE, depois se constrói

Antes de qualquer método, com os dois controles dela e um jogo de SDL
(`sdl2-jstest`/`evtest`), em cada modo e com a máscara ligada e desligada:

| caminho | Nativo | Virtual |
| --- | --- | --- |
| nó evdev "Motion Sensors" do físico | o jogo lê? | o jogo lê? |
| hidraw pelo `hidapi` do SDL | o SDL abre? | o SDL abre? |

A tabela decide o desenho. Sem ela, o interruptor pode "desligar" um caminho
que o jogo não usa — verde sobre nada, a doença desta casa.

## 2. O DESENHO PROVÁVEL

* **`sensor.set {uniq, giroscopio: bool, acelerometro: bool}`**, gravado no
  perfil por controle (`profiles/schema.py` diz hoje *"fora por ausência, não
  por decisão"* — vira decisão).
* **Nativo:** o jogo lê o nó evdev de movimento do kernel. Desligar = o hub
  agarra esse nó (os botões seguem intactos, é outro nó). Um sensor só: o nó
  carrega os dois, então agarrar E republicar um nó virtual de movimento com
  os eixos ligados — é o custo de *"ambos"*.
* **Virtual (`uhid`):** o jogo lê o espelho do vpad. Desligar = `forward_motion`
  zera os eixos daquele sensor (ou `stop_motion_reader` para os dois). E o
  espelho passa a existir para o não-primário, senão o interruptor do P2
  desliga um giro que o jogo nunca viu.
* **Virtual (`uinput`):** não há espelho; o jogo, se vê giro, vê pelo nó
  físico — e aí vale a regra do Nativo.
* Se a medição mostrar o SDL lendo pelo hidraw, o interruptor precisa também
  do byte de saída ou de segurar o hidraw — e aí é sprint nova, com o número.
* `state_full` publica `sensores.giroscopio_ligado` e `acelerometro_ligado`;
  o botão da aba 02 pinta daí, e o gesto `sensor` chama o método em vez de
  recusar.

## 3. A MORDIDA

Teste: `sensor.set giroscopio=False` → o leitor do nó de movimento tem de
estar `held`; arrancar o grab → reprova. Bancada: `evtest` no nó de movimento
enquanto o Hefesto desliga — o fluxo tem de PARAR na tela do `evtest`, nos dois
modos, com a máscara ligada.

## 4. A TELA

Foto `--oculta`; clicar os quatro botões; a moldura Giroscópio do card
continua mostrando o valor (o Hefesto ainda lê — quem deixa de ler é o jogo).

## Posse, para o despacho

**Toca:** `src/hefesto_dualsense4unix/daemon/sensor_hub.py` · `src/hefesto_dualsense4unix/daemon/ipc_handlers.py` · `src/hefesto_dualsense4unix/core/evdev_reader.py` · `src/hefesto_dualsense4unix/profiles/schema.py` · `src/hefesto_dualsense4unix/app/ipc_bridge.py` · `src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py`.

**Cria:** `src/hefesto_dualsense4unix/core/virtual_motion.py` · `tests/unit/test_o_sensor_desliga_de_verdade.py` · `scripts/ensaios/o_jogo_para_de_ver_o_giro.py`. <!-- ref-externa: a sprint CRIA estes arquivos; eles ainda não existem -->

**Bancada:** sim — e com jogo aberto.
