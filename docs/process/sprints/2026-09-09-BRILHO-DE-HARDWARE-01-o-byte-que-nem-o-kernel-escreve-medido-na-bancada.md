---
sprint: BRILHO-DE-HARDWARE-01
estado: aberta
posse:
  BRILHO-DE-HARDWARE-01:
    - docs/process/sprints/2026-09-09-BRILHO-DE-HARDWARE-01-o-byte-que-nem-o-kernel-escreve-medido-na-bancada.md
cria:
  - scripts/ensaios/o_brilho_de_hardware_da_barra.py
bancada: true
depois_de: []
nao_toca:
  - docs/data/ensaios.csv
  - docs/data/mapa-controles.csv
  - src/
---

# BRILHO-DE-HARDWARE-01 — o byte que nem o kernel escreve, medido na bancada

**Decisão dela, 09/09/2026 de madrugada** (`D-0909-O-BRILHO-DE-HARDWARE-SE-MEDE`):
entre *ficar a cor escalada e riscar o brilho de hardware da fila* e *medir o de
hardware na bancada*, ela escolheu medir — *"2b"*.

## §1 — As duas grandezas, que a tela e o mapa confundiam

| | o que é | onde | estado |
| --- | --- | --- | --- |
| **o brilho da TELA** (`brilho`, `lightbar_brightness`) | a cor multiplicada em Python antes de sair — um vermelho a 30 % é um vermelho escuro | o mesmo caminho da cor (`luz.lightbar.cor`, ✓ 12/08 nos dois transportes) | funciona; o escuro em si ninguém olhou de propósito |
| **o brilho de HARDWARE** (`luz.lightbar.brilho@dualsense`) | `common[42]` (`led_brightness`, 3 níveis: 0 alto · 1 médio · 2 baixo), autorizado por `flag2` bit0 em `common[38]` | `backend_pydualsense.py:819` escreve o byte com o default `Brightness.high = 0` e **nada altera**; o kernel (`hid-playstation.c:218-219`, `:343`) **não define o bit** e não o escreve | `nao-medido` nos dois transportes; `provado_por = fonte-do-driver` (11/08) |

O mapa está certo e a régua cabo · BT · perfil · controle estava errada até
08/09: o `nao-medido` é o de hardware, e a tela nunca o ofereceu.

## §2 — A bancada (uma linha da mesa)

`scripts/ensaios/o_brilho_de_hardware_da_barra.py`, com o daemon dela de pé e
**só leitura de tudo o que não seja o report do ensaio**:

1. cor fixa (branco, 100 %) no P2 (cabo);
2. escrever `common[42] = 0`, `1`, `2` **com** `flag2` bit0 ligado, dez
   segundos cada, ela olhando a barra;
3. repetir **sem** o bit — é o que responde se o firmware exige a autorização
   que o kernel não tem;
4. o mesmo no P1 (rádio: `common[42] = report[45]`, `flag2` em `report[41]`),
   lembrando que o bloco cai sob `suppress_leds` — o ensaio o desliga só
   durante a passada;
5. a linha vai para o caderno (`nao_toca`: quem coordena escreve), e o mapa
   sai de `nao-medido` para `sim`/`não` **pela linha**, nunca à mão.

## §3 — O que acontece com o resultado

* **obedece:** nasce a decisão dela seguinte — a tela ganha os três níveis
  (campo novo no perfil, por controle) ou não ganha nada. Sem a medição a
  pergunta não tem preço; com ela, tem;
* **não obedece:** a linha do mapa fecha com `provado_por = aparelho` e a fila
  perde um item para sempre. É o resultado mais provável, e vale o mesmo.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| | |
| --- | --- |
| **cabo / BT** | a linha do caderno para cada transporte, com `observado_por = olho-dela` |
| **no perfil / por controle** | não se aplica até a medição dizer que há o que guardar |

## O que MORDE

* o ensaio com o bit apagado e o byte a `2` **não pode** dar o mesmo resultado
  visual do bit ligado sem a linha dizer isso — é a diferença que o kernel
  ausente torna interessante;
* `grep nao-medido` na linha `luz.lightbar.brilho@dualsense` do mapa devolve
  zero depois da linha do caderno.
