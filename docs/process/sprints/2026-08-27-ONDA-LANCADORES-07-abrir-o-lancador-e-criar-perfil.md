---
sprint: ONDA-LANCADORES-07
estado: absorvida
onda: ABA-LANCADORES
posse:
  L7:
    - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
    - src/hefesto_dualsense4unix/integrations/steam_launcher.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-07-abrir-o-lancador-e-criar-perfil.md
  - tests/unit/test_abrir_o_lancador.py
bancada: false
depois_de:
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-03
  - ONDA-LANCADORES-04
  - ONDA-LANCADORES-05
  - ONDA-LANCADORES-06
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/integrations/lancadores_instalados.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA LANÇADORES · 07 — "Abrir o lançador" e "Criar perfil para um jogo"

**O defeito, em uma frase:** o produto só sabe abrir a Steam.

**Medido:** `integrations/steam_launcher.py:154` — `open_or_focus_steam()`, com
`STEAM_BINARY`, `STEAM_WM_CLASS` e `pgrep -x steam` costurados no módulo
(`:31-34`). Os outros seis lançadores não têm porta nenhuma.

## O que entrega

**"Abrir o lançador"**, por linha (o botão aparece em cinco dos seis cartões do
mockup). Generaliza o que já está escrito, mantendo a disciplina do módulo, que é
boa e é o motivo de reaproveitá-lo em vez de escrever outro:

- idempotente e **nunca levanta** — loga e segue;
- se já está rodando, **foca** a janela; se não, abre desprendido do processo da
  janela (`start_new_session=True`);
- **nunca `shell=True`** (`steam_launcher.py:1-16`);
- o *como abrir* não é adivinhado aqui: vem do `como_abrir` que o detector da 02
  mediu, com a evidência ao lado.

**"Criar perfil para um jogo"**, na linha de quem tem catálogo. Abre a aba Perfis
com o jogo escolhido preenchido; o catálogo já existe
(`integrations/jogos_locais.py:320`, `catalogo_de_jogos`) e hoje só enxerga Steam.

## A mordida

`tests/unit/test_abrir_o_lancador.py`:

1. Lançador **ausente** → `abrir_lancador` **não executa nada**. O dublê de
   `Popen` registra que não foi chamado. Arranque a checagem → ele tenta abrir um
   binário que não existe, e o teste reprova.
2. Lançador **rodando** → foca, e **não** abre uma segunda instância.
3. Régua de forma: nenhuma chamada com `shell=True` no módulo — o teste lê os
   argumentos que o dublê recebeu.

## O que é dela decidir

- **"Criar perfil para um jogo" no cartão de quem não tem catálogo.** Na Steam
  ele abre o seletor de jogos que já existe. No Heroic, no Lutris e no RetroArch
  o produto não conhece a lista (é o item 1 do "falta decidir" da 03) — o botão
  some naquelas linhas, ou abre um perfil em branco com o lançador preenchido?
