---
sprint: ONDA-LANCADORES-01
estado: absorvida
onda: ABA-LANCADORES
posse:
  L1:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-01-a-casca-da-aba-nasce-escondida.md
  - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
  - src/hefesto_dualsense4unix/app/widgets/cartao_do_lancador.py
  - tests/unit/test_lancadores_a_casca.py
bancada: false
depois_de:
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-GATILHOS-02
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-PERFIS-01
  - ONDA-CONTROLES-02
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/app.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-06
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
  - novo-layout/
  - docs/data/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA LANÇADORES · 01 — a casca nasce, e nasce escondida

**O defeito, em uma frase:** a aba que ela aprovou não existe no produto — o que
está no lugar dela é a "Emulação" de *gamepad* (uinput), termo técnico que
ninguém entende.

## O que entrega

Uma página nova no `GtkNotebook`, **entre Conexões e Perfis** (a tira do mockup:
`layout/07-lancadores.html:437-449`), com id `tab_lancadores`, e **nascendo
`visible=False`**. A visibilidade é a última sprint desta onda (a 10), e o motivo
é decisão dela:

> *"essa aba em si só vamos desenhar e deixar placeholder mesmo. E ela só passa a
> existir quando tiver todas as features no projeto integrando e funcionando."*
> — D-A-ABA-LANCADORES-NASCE-PLACEHOLDER

Dentro da página, o que o mockup mostra:

- o quadro **"De onde os seus jogos vêm"** com o `?` — o texto exato está em
  `layout/07-lancadores.html:461-467`; copie de lá, não reescreva;
- a **conta** do topo à direita (`:468`) — nesta sprint ainda `0 encontrados`;
- os dois botões do topo: **Detectar o jogo que está aberto** (roxo) e
  **Procurar de novo** (`:472-475`), ambos ligados só na 03 e na 06;
- a **fita esmaecida**, com o `title` literal do mockup (`:422`): nada nesta aba
  ajusta por controle;
- `CartaoDoLancador`, widget montado **em Python, não no Glade** — a lista é
  dinâmica, um cartão por lançador achado. Estados e cores em
  `src/hefesto_dualsense4unix/interface/aba07.py:5-28`: `chega` (borda verde), `impede`
  (borda laranja), `ausente` (opacidade .5); selos `CHEGA` / `NÃO CHEGA` /
  `NÃO ACHEI`; a contagem à direita; a frase; o carimbo; a fileira de botões.

**O estado vazio é honesto.** Sem o detector (sprint 02), a lista vem vazia e a
tela diz que ainda não procurou. Cartão nenhum é inventado para encher a tela.

## Onde está hoje

Nada. A página nova não existe; a antiga ocupa `gui/main.glade:3106-3654`. Esta
sprint **não toca** na antiga — quem a retira é a 10, e só depois que cada linha
do "Nada se perdeu" tiver dono vivo.

## A mordida

`tests/unit/test_lancadores_a_casca.py`, duas réguas puras (sem Gtk vivo):

1. `rotulo_do_selo("bananas")` **levanta** em vez de devolver `CHEGA`. Arranque a
   cura (faça o desconhecido cair no `ok`) → o teste reprova dizendo que a tela
   pintaria verde por ignorância. Devolva → verde.
2. `montar_cartoes([])` devolve o estado vazio e **zero** cartões.

Mais uma régua de arquivo: o glade declara `tab_lancadores` com
`visible` **False**. Trocar para `True` reprova aqui e na 10.

## O que é dela decidir

- A aba nasce escondida até a 10, cumprindo a decisão do placeholder. Se ela
  quiser ver a casca antes (é ela quem fecha interface, PROVA-DE-TELA-01), quem
  coordena mostra a foto — a visibilidade continua em `False`.
