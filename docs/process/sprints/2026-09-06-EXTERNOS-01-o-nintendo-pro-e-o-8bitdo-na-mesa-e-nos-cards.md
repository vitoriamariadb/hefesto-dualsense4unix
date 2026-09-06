---
sprint: EXTERNOS-01
estado: aberta
onda: G
posse:
  EXT:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/interface/aba08.py
    - src/hefesto_dualsense4unix/interface/pacotes/__init__.py
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - mockup/01-jogar.html
    - mockup/08-conexoes.html
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/paginas/
  - docs/data/paridade-gtk-html.csv
---

> **ROTA CORRIGIDA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** **Vale inteira; a bancada com o Pro e o 8BitDo é da MESA-DE-QUATRO-01, não pré-requisito.**
Remedido em 06/09: as linhas 16 (01-jogar) e 305 (08-conexoes) da paridade seguem `FALTA`. O
caminho: ler `controller.list {external:true}` no piloto — hoje `hefesto_vivo.py:2894-2910` monta
o `Contexto` só de `controllers` — e levar a lista num campo PRÓPRIO de `pacotes.Contexto`
(`pacotes/__init__.py:86`), **nunca dentro de `controllers`** (misturaria os assentos). Por isso
`hefesto_vivo.py` e `pacotes/__init__.py` entraram na posse. Régua com dublê do `controller.list`;
o desenho dos cards externos é o do `app/widgets/external_card.py` (leia, não copie). A ONDA5-P-01
mexeu no `hefesto_vivo.py` hoje: **leia o arquivo de hoje antes de acreditar num endereço.**

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
