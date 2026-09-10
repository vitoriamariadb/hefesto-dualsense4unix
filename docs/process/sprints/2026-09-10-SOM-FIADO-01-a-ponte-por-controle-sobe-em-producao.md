---
sprint: SOM-FIADO-01
estado: feita
onda: MESA-COMPLETA
posse:
  ESCREVE:
    - src/hefesto_dualsense4unix/daemon/subsystems/alto_falante.py
    - src/hefesto_dualsense4unix/daemon/subsystems/__init__.py
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
    - src/hefesto_dualsense4unix/daemon/connection.py
    - src/hefesto_dualsense4unix/integrations/alto_falante_bt.py
cria:
  - tests/unit/test_a_ponte_do_som_sobe_em_producao.py
  - tests/unit/test_a_mesa_de_quatro_sobe_no_daemon.py
bancada: false
depois_de: []
nao_toca:
  - novo-layout/
---

# SOM-FIADO-01 — a ponte de som por rádio sobe EM PRODUÇÃO

**Lote A, sprint 1 do índice
[A MESA DE QUATRO, COMPLETA](2026-09-10-A-MESA-DE-QUATRO-COMPLETA-INDICE.md).**

## §0 — O defeito, e ele tem data de nascimento e data de morte

Em 10/09/2026, pela manhã, o som saiu do plástico pelo rádio pela primeira vez
nesta casa: report `0x35`, 334 B, um quadro Opus de 10 ms, 70 segundos com a
orelha dela. `PonteDeSomPorRadio` nasceu no mesmo dia, com teste de ciclo de
vida e com o arranjo provado byte a byte.

**E nenhuma linha de produção a construía.** O único lugar do repositório onde
o nome aparecia fora do módulo que a define era a assinatura de um construtor —
`GerenciadorDeNosDeSom(ponte_do_radio_por_controle=…)` — que ninguém chamava
com nada. O portão `casa-sabe` acusava exatamente isto:

```
'integrations/alto_falante_bt.py::PonteDeSomPorRadio'   ← sem chamador
```

A escada desta casa é `MONTOU → SAIU NO FIO → O APARELHO OBEDECEU → O JOGO
RECEBEU → O JOGO REAGIU`, e a linha do alto-falante passou meses em `MONTOU`
sendo lida como pronta. Esta sprint é o degrau seguinte.

## §1 — O que foi fiado, e são CINCO elos

| # | elo | onde |
| --- | --- | --- |
| 1 | a fábrica de pontes, **uma por controle no rádio** | `AltoFalanteSubsystem._casar_as_pontes` |
| 2 | o callable que a rota consulta, **por `uniq`** | `AltoFalanteSubsystem._ponte_do_radio_de` |
| 3 | o hidraw **pelo broker**, nunca por `os.open` cru | `AltoFalanteSubsystem._abrir_hidraw` |
| 4 | o PCM do **monitor do nó daquele controle** | `alto_falante_bt.fonte_do_monitor_do_no` |
| 5 | o subsystem no daemon, **nas três pontas** | registry · `_start_alto_falante` · `_stop_alto_falante` |

**A ordem importa e é medida:** a ponte sobe ANTES do nó. `rota_do_no` pergunta
à ponte no instante em que o nó nasce; fiar na ordem inversa publicaria a rota
do rádio como recusada e só a corrigiria na varredura seguinte — 2 segundos em
que o jogo que abrisse o nó pegaria a rota errada.

## §2 — A guarda que veio junto: **sem rota, sem nó**

Registrar o subsystem era o que faltava, e era também o que a casa recusava —
com razão escrita em `daemon/subsystems/__init__.py`: ligá-lo publicava um
`module-null-sink` por controle e **nenhum** `module-loopback`, isto é, um sink
mudo por DualSense na lista de som dela. É a invariante 4 de
`app/audio_saida.py`: *"um `module-null-sink` sozinho seria exatamente o sink
que aceita o áudio e o joga fora"*.

Os dois buracos de rota fecharam (cabo em 09/09, rádio em 10/09), e o que
sobrava era estrutural: `GerenciadorDeNosDeSom.reconciliar` agora **não publica
quem não tem rota**. Numa máquina sem `pw-record`, os do rádio simplesmente não
viram nó — e o do cabo continua ganhando o dele, porque a rota dele não depende
de ponte nenhuma.

## §3 — Duas curas que a fiação obrigou, e as duas são de instrumento

**1. A suíte estava falando com o DualSense DELA.** Na primeira corrida com o
subsystem registrado, `test_o_no_de_som_nao_nasce_sumidouro` imprimiu
`som_radio_ponte_de_pe uniq=<o controle dela>`: `controles_na_lista()` varre
`/sys/class/hidraw` de verdade, e agora havia linha de produção chamando isso
dentro de todo teste que sobe um `Daemon`. A cura é a fixture
`_nenhum_hidraw_vivo_na_varredura_de_som` (`tests/conftest.py`), irmã da
`_nenhum_sysfs_vivo_na_varredura_de_vpad` e pela mesma razão.

**2. Um default de função média o mundo do import.**
`nos_dualsense_bluetooth(raiz: str = _SYSFS_HIDRAW)` congelava a raiz no
momento do import, então apontar `_SYSFS_HIDRAW` para outro lugar não alcançava
essa função. Passou a resolver na chamada.

## §4 — As réguas, e as três mordidas que furaram

| régua | o que trava |
| --- | --- |
| `test_a_ponte_do_som_sobe_em_producao.py` (7) | a fábrica: uma ponte por controle no rádio, nenhuma no cabo, cada uma com o seu hidraw e o seu monitor, a ordem ponte→nó, o `descer()` de quem sai, e o `start()` injetando o callable |
| `test_a_mesa_de_quatro_sobe_no_daemon.py` (5) | **a cena dela num `Daemon` de verdade**: 3 no rádio + 1 no cabo, quatro nós de nome próprio, três pontes distintas, nenhum sink sem rota, e o shutdown levando nó e ponte |

As mordidas, todas conferidas:

* tirar `self._casar_as_pontes(alvos)` → 5 de 7 e 4 de 5 reprovam;
* tirar `ponte_do_radio_por_controle=` do `start()` → 1 reprova;
* tirar `await self._safe_start("alto_falante", …)` → 4 de 5 reprovam;
* trocar a guarda «sem rota, sem nó» por `if False:` → 1 reprova.

## §5 — O que esta sprint NÃO fecha

**`audio.alto_falante@dualsense` continua com `radio_aciona: não`**, e é de
propósito. O contrato daquela célula exige três coisas e a corrida cumpriu uma:
o som audível (FEITO, 70 s), o **negativo de rota** e o **teste cego**. As duas
que faltam são dela — nenhuma régua substitui a orelha.

O que mudou é o DONO da dívida: ela deixou de ser do produto.

## §6 — O próximo

**A2 (SFX-POR-CONTROLE-01)** — o efeito sonoro chega ao controle certo nos dois
transportes. A fiação que esta sprint deixou é a base: cada nó já tem nome
próprio e rota própria; falta provar que o tiro do P2 não sai no plástico do P1.
