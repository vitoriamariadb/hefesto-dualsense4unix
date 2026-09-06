---
sprint: EXTERNOS-01
estado: aberta
posse:
  EX:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/interface/aba08.py
    - mockup/01-jogar.html
    - mockup/08-conexoes.html
depois_de: [ONDA5-01-01, ONDA5-01-03, ONDA5-07-03, ONDA5-08-01, ONDA5-08-02, MESA-DE-QUATRO-01, CONEXOES-LIGAR-TUDO-01, ONDA4-S10-O-TRANSPORTE-01, A-PALAVRA-MESA-SAI-01, JOGAR-O-QUE-FALTA-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/daemon/
---

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.5 — fora das 24 horas por decisão dela (06/09).

# EXTERNOS-01 · PARIDADE — o Nintendo Pro e o 8BitDo na mesa e nos cards

> **A palavra dela, 06/09/2026:** *"Materializa as sprints. mas o foco do
> programa hoje é fazer os 4 dualsense funcionar seja via bt ou cabo."*

**Esta sprint está MATERIALIZADA e NÃO entra nas 24 horas de 06/09.** Ela
espera a `MESA-DE-QUATRO-01` (a bancada dos quatro DualSense no FECHO) porque
é lá que se mede o que sobra de slot, luz e canal para um quinto controle que
não é Sony.

## O que fecha (linhas do `docs/data/paridade-gtk-html.csv`)

| aba | linha |
| --- | --- |
| 01-jogar | Cards dos controles EXTERNOS (Nintendo Pro, 8BitDo…) |
| 08-conexoes | Controles EXTERNOS (8BitDo, Pro Controller, Xbox) na lista da mesa |
| 08-conexoes | Aviso "controle ligado que o sistema não entregou ao Hefesto" |

## O que reusa

`app/actions/external_controllers.py` (o dono da lista e dos nomes) e as
linhas do `docs/data/mapa-controles.csv` das famílias `hid-nintendo` e 8BitDo —
**cada afirmação de transporte vem de lá**, nunca digitada.

## O que se mede antes de escrever

1. o que `state_full` publica hoje sobre um controle que não é DualSense
   (nome, transporte, slot) — `ONDA1-X-OS-FATOS-01` é a régua;
2. a palavra do transporte vem de `home_actions.palavra_do_transporte`
   (`ONDA4-S10`), inclusive para eles;
3. a cor do plástico: os 28 modelos da folha já incluem as famílias
   externas? (`scripts/check_a_cor_vem_do_aparelho.py`).

## Nada se perde

Os cards dos DualSense, a fita e a lista da mesa não mudam de forma; o
controle externo entra como mais uma linha e mais um card, com o que o mapa
sabe dele e um travessão no que não sabe.
