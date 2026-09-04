# MICROFONE-UM-ATO-01 — o botão físico e o da tela são o mesmo estado

> **Decisão dela, 04/09/2026, meio-dia:** *"o microfone (…) o botão fisico do <!-- noqa-acento: citação literal dela -->
> mic se ligado no microfone ele fica ligado tambem. indepente se nativo ou virtual."* <!-- noqa-acento: citação literal dela -->
>
> É a D-12 (*"o botão é pra ligar o microfone e ele ser ouvido no canal
> específico dele"*) com **duas regras a mais, ditas com todas as letras**:
> o botão do plástico e o da tela são UM estado; e nada disso olha o modo.

## 0. O QUE EXISTE HOJE, medido

| peça | onde | o que faz |
| --- | --- | --- |
| `mic.set` | `daemon/ipc_handlers.py:5186` | o mudo do FIRMWARE: bit `MIC_MUTE`, apaga a luz vermelha, e enquanto vigora o botão físico deixa de valer |
| `mic.volume.set` | `ipc_handlers.py:5319` | o ganho da FONTE no PipeWire — não toca o firmware |
| `mic_button_toggles_system` | `daemon/lifecycle.py:915` | sobe `start_mic_hotkey` (`subsystems/hotkey.py:850`): o botão do plástico alterna o mudo |
| `luz_do_mic` | `lifecycle.py:921` | a luz do botão diz QUEM TE ESCUTA (LUZ-DO-MIC-01) |
| gestos `mudo` e `mic-modo` | `interface/pacotes/a02_controles.py:1635`, `:2034` | o 🎙 da tela, pela `ponte` |

**O que falta, e o handoff da madrugada já dizia:** *"o 🎙 ainda é meio ato —
falta método IPC de eleição no `daemon/`"*. Não há método que faça a fonte de
captura DAQUELE controle ser a ouvida (default source + não-muda no PipeWire),
e o `state_full` não publica o volume nem o mudo de captura. Ligar o microfone
hoje é só a metade do firmware.

## 1. AS TRÊS REGRAS DELA, materializadas

1. **UM estado.** `ligado` é uma coisa só, com quatro faces: o botão da tela, o
   botão do plástico, a luz vermelha, e a fonte no PipeWire. Qualquer face que
   vira, as outras três viram no tique seguinte. **Não há "o firmware diz A e o
   PipeWire diz B".**
2. **Independente do modo.** O ato não consulta `native_mode` nem
   `gamepad_emulation_enabled`. Primeira medição da sprint: apertar o botão do
   plástico em NATIVO e ler `state_full` — se o `hotkey` não vê o botão nesse
   modo, é a primeira cura, antes de qualquer método novo.
3. **O selo diz o estado composto.** ATIVO só quando as quatro faces
   concordam; a discordância vira recado (S-01): *"o microfone ligou, mas o
   canal dele está mudo no sistema"*.

## 2. O TRABALHO

* **`daemon`:** um método `mic.canal.set {uniq, ligado}` — o ATO inteiro: mudo
  do firmware + fonte de captura do controle eleita e não-muda no PipeWire. O
  `hotkey.py` e o handler chamam **a mesma função** — uma função, dois
  chamadores. `state_full.audio.mic` ganha `canal_ativo`, `canal_mudo`,
  `volume_captura`.
* **`ipc_bridge`:** `mic_set_detalhado` passa a ser o ato; a frase de recusa
  diz qual das duas metades faltou.
* **`a02_controles`:** `mudo` e `mic-modo` chamam o ato; o selo pinta do estado
  composto. Vale no cabo e no rádio — o CSV diz cabo=sim, rádio=parcial, e a
  parcialidade é do canal BT (`bt_mic`), não da regra.

## 3. A MORDIDA

* Teste que **arranca** o chamador do `hotkey.py` e vê a régua reprovar: o
  botão físico e o handler têm de apontar para a mesma função por nome.
* Teste que injeta `native_mode=True` e prova que o ato não muda de caminho.
* Bancada: apertar o plástico → `state_full` + `pactl get-default-source` no
  mesmo segundo, nos dois modos e nos dois transportes.

## 4. A TELA

Foto `--oculta` antes e depois; clicar o 🎙 nos dois cards; apertar o plástico e
ver o selo virar sem clique. O `--prova-clique` ganha o botão do microfone
**com a leitura do PipeWire** — verde sobre botão que só mexe no firmware é o
verde falso de 29/08 de novo.

## Posse, para o despacho


**Toca:** `src/hefesto_dualsense4unix/daemon/ipc_handlers.py` · `src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py` · `src/hefesto_dualsense4unix/app/ipc_bridge.py` · `src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py` · `src/hefesto_dualsense4unix/interface/aba02.py` · `src/hefesto_dualsense4unix/interface/hefesto_vivo.py`.

**Cria:** `tests/unit/test_o_microfone_e_um_estado_so.py`. <!-- ref-externa: a sprint CRIA este arquivo; ele ainda não existe -->

**Bancada:** sim.
