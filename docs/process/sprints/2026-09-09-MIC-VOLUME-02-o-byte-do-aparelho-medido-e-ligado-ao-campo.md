---
sprint: MIC-VOLUME-02
estado: aberta
posse:
  MIC-VOLUME-02:
    - src/hefesto_dualsense4unix/core/backend_pydualsense.py
cria:
  - scripts/ensaios/o_byte_do_microfone_muda_a_captura.py
bancada: true
depois_de: [MIC-OS-QUATRO-01, FONE-01]
nao_toca:
  - docs/data/ensaios.csv
  - docs/data/mapa-controles.csv
  - src/hefesto_dualsense4unix/daemon/subsystems/mic_da_mesa.py
  - src/hefesto_dualsense4unix/profiles/schema.py
---

# MIC-VOLUME-02 — o byte do aparelho, medido e ligado ao campo

**Decisão dela, 09/09/2026 de madrugada** (`D-0909-O-VOLUME-DO-MIC-LIGA-O-BYTE-DO-APARELHO`):
*ligar o byte do aparelho; revoga a decisão de 06/09 e pede bancada* — *"3-c"*.

## §1 — O que existe, medido — e a premissa da pergunta estava pela metade

A lista da noite disse *«campo sem ato»*. **Errado pela metade:** o campo
`ControllerMicOverride.volume` TEM ato — `mic.volume.set`
(`ipc_handlers.py:6077`, MIC-VOLUME-01) mexe no **ganho da FONTE no PipeWire**,
por controle e nos dois transportes, e a docstring diz por quê: *«o DualSense
não expõe registrador de ganho de microfone em transporte nenhum»*. O que não
tem ato é o **byte do aparelho**:

| | onde | o que diz |
| --- | --- | --- |
| o byte | mapa, `audio.microfone.volume@dualsense` | `common[6]`, teto **real** `0x40`, flag0 `0x40`; **o kernel desta máquina NOMEIA o campo** (`mic_volume`, `0x0 - 0x40`) e define o bit 6 — ao contrário do fone |
| a porta | `backend_pydualsense.py:1165-1183`, `set_audio_volumes(microphone=…)` | existe e tem **zero chamadores** |
| a decisão de 06/09 | `backend_pydualsense.py:4646` (SOM-SEMPRE-01) e a `ressalva` da linha do mapa (SPECS-A-PROCEDENCIA-01) | *«o volume do MICROFONE (`common[6]`) continua FORA da chamada, e isso é decisão, não esquecimento — o dono do microfone no Linux é o kernel (AUDIO-OWNER-01)»* → `decisao-tomada` |

**Duas afirmações da casa se contradizem**, e é a bancada que decide: a
docstring do `mic.volume.set` diz que o registrador *não existe*; o mapa e o
kernel dizem que existe e tem nome. Ela decidiu ligar o byte — logo, medir.

## §2 — A bancada primeiro

`scripts/ensaios/o_byte_do_microfone_muda_a_captura.py` — **pronto em 09/09**
(`--listar` mostra a placa de cada controle; `--alvo <MAC>` grava os três
níveis; `--sem-bit` é o negativo; a razão 1,5 entre picos é a régua declarada,
e entre 1,2 e 1,5 ele diz «não sei»): com o P2 no cabo e a
fonte do controle a 100 % no sistema (para isolar o ganho do aparelho), gravar
três segundos de voz com `common[6]` em `0x00`, `0x20` e `0x40`, flag0 `0x40`
ligado, e comparar o **pico** das três capturas (`parecord` + o RMS). Depois o
mesmo no P1 (rádio: `common[6] = report[9]` no `0x31`).

| resultado | o que vira |
| --- | --- |
| o pico muda com o byte | o byte é ganho de HARDWARE, e o item 3 liga o campo a ele |
| o pico não muda | a docstring do `mic.volume.set` estava certa, o mapa passa a `nao-aciona`, a decisão de 06/09 **fica** — e a decisão dela de 09/09 volta a ela com o número |

## §3 — O ato, se o aparelho obedecer

1. `ControllerMicOverride.volume` passa a fazer **as duas coisas**: o ganho da
   fonte no sistema (como hoje) **e** `set_audio_volumes(microphone=v * 0x40 // 100)`
   no aparelho — um campo, dois degraus, para o número da tela ser o que a
   pessoa ouve do outro lado.
2. A nota datada em `backend_pydualsense.py:4646` e em `:4744` diz que
   **SOM-SEMPRE-01 foi revogada neste ponto em 09/09/2026 por decisão dela**,
   com a linha do caderno ao lado. A decisão de 06/09 não se apaga: ganha data.
3. O `mic_da_mesa.py` e o `schema.py` são posse de outras (`nao_toca`); o campo
   já existe, e o daemon já chama `mic.volume.set` — esta sprint só acrescenta
   o degrau do aparelho na mesma chamada.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| | |
| --- | --- |
| **cabo** | pronto = o pico da captura do P2 sobe com o byte, e a linha do caderno diz quanto |
| **BT** | o mesmo com o P1 pela ponte; se o rádio não obedecer, o campo age só na fonte no BT — e a tela não confessa dívida |
| **no perfil** | ✓ `mic.volume` já existe em `ControllerMicOverride`; nada nasce |
| **por controle** | ✓ já é por `uniq`; pronto = P2 a 0 e P3 a 100 ao mesmo tempo, dois picos diferentes |

## O que MORDE

* arrancar a chamada `microphone=` → o ensaio com `0x00` e `0x40` dá o mesmo
  pico, e a régua reprova nomeando o controle;
* `grep -n "microphone=" src/` devolve **um** chamador, e é o do campo;
* o mapa continua sem ser lido pelo produto: a régua lê o caderno.
