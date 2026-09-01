---
sprint: MIGRA-GATILHOS-04
onda: MIGRA-GATILHOS
posse:
  M4:
    - src/hefesto_dualsense4unix/interface/aba03.py
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
cria:
  - tests/unit/test_migra_gatilhos_a_mesa_real_desenha_as_colunas.py
bancada: false
depois_de:
  - MIGRA-GATILHOS-02
  - MIGRA-GATILHOS-03
  # SUBSTITUÍDAS por esta onda (ver o índice, "As sete sprints ONDA-GATILHOS").
  # Ficam aqui porque enquanto elas estiverem no disco a posse é real, e
  # silêncio não é declaração.
  - ONDA-GATILHOS-01
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - docs/data/cores-do-dualsense.csv
---

# MIGRA GATILHOS · 04 — a mesa real desenha as colunas

**O defeito em uma frase:** a página tem **quatro** colunas porque
`monta.MESA` tem quatro entradas digitadas (`monta.py:138-147`) — os quatro
controles **dela**, com os códigos que os aparelhos responderam. Na aba viva, o
número de colunas é o número de controles **presentes agora**, e **zero é estado
legítimo**.

O gerador já sabe disso e diz onde falha:

> *"Uma coluna = UM controle da `MESA`. **A aba não sabe contar até quatro.**"*
> — `aba03.py:262`

A frase é honesta sobre o laço e **calada sobre a largura**, que não é: a coluna
mede 220px de conteúdo, e o efeito pronto mais longo cabe por 2px
(`aba03.py:81-83`). Com um controle só, quatro quintos da tela ficam vazios; com
cinco, nada cabe.

## O que a coluna precisa saber, e de onde vem

| valor | de onde | já lido hoje |
|---|---|---|
| `uniq` (o MAC — o endereço da coluna) | `daemon.state_full` → `controllers[]`, montado em `daemon/ipc_handlers.py:2489-2491`; vem de `core/backend_pydualsense.py:describe_controllers` | **sim** |
| `transport` (USB/BT) | idem | **sim** — `status_actions.py:1589` e `:2101` |
| `player` (o P#) | enxertado em `ipc_handlers.py:2495-2506` por `coop.resolve_player_numbers` | **sim** — `rumble_actions.py:159` |
| `index` | idem | **sim** |
| **nome do plástico** ("Cosmic Red") | **não existe em campo nenhum do payload** | **não** |
| **cor do plástico** (a borda do chip) | `docs/data/cores-do-dualsense.csv`, 28 modelos × 10 zonas | **não** |

**O número do jogador não é a ordem da lista** — decisão dela, 26/08:
*"o meu controle azul é o player 2"* (`D-O-NUMERO-DO-JOGADOR-SUBSTITUI-O-DESENHO-DAS-LUZES`).
O `player` vem do daemon justamente por isso, e `None` significa *não é jogador
agora*: a coluna **omite** o número em vez de inventar um.

## O que entrega

1. **O gerador deixa de assumir quatro.** `aba03.py` passa a emitir a coluna a
   partir de uma lista que pode ter 0, 1, 2, 3, 4 ou 5 entradas, e a grade
   (`grid-template-columns:128px repeat(4,1fr)`, `:58`) passa a contar a lista.
   O `TETO_DA_GRADE` de 454px (`:299-302`) continua sendo `SystemExit` — ele é o
   que impede o quadro de rolar por dentro.
2. **Zero controles é um estado desenhado.** Hoje ele não existe em lugar
   nenhum do mockup. A frase segue o vocabulário que a aba já usa para o vazio
   (*"Este modo não tem o que ajustar."*, `:245`) e diz **o quê, por quê e o que
   fazer** — é a regra desta casa para toda frase de diagnóstico. Marcado
   **PROVISÓRIO — decisão dela**.
3. **O Python monta as colunas do `state_full`**, uma por controle presente, e
   pinta o chip: `P{player} • {nome do plástico} • {USB|BT}`. A ordem dos chips
   é a mesma da fita — `monta.fita()` já a estabelece, e duas ordens diferentes
   para a mesma mesa é o defeito de cinco gramáticas que 28/08 mediu.
4. **O chip nasce CINZA quando o plástico não se sabe**, e o `title` diz por quê.
   Não é degradação silenciosa: é o estado honesto enquanto a ponte MAC→modelo
   não existir.
5. **A aba repinta no hotplug.** `_refresh_triggers_from_draft` é o refresher
   registrado (`app.py:1088`) e hoje só roda na troca de aba. Com uma coluna por
   controle, um controle que entra ou sai **muda o número de colunas** — a
   pintura tem de acontecer também quando o `state_full` mudar a lista.

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_a_mesa_real_desenha_as_colunas.py`, com o dublê
de IPC que `tests/unit/test_triggers_actions.py` já usa:

1. **N controles → N colunas.** Rodar com listas de 0, 1, 2, 4 e 5 e contar
   `.ctrl` no DOM depois da pintura. **A mordida:** devolva o `for c in MESA`
   com quatro fixos e veja reprovar em quatro dos cinco casos.
2. **Zero controles não é uma aba quebrada** — com a lista vazia, nenhuma
   coluna, a frase do vazio na tela, e **nenhuma exceção**. Este é o caso que
   régua nenhuma desta casa mede hoje.
3. **O `data-uniq` de cada coluna é o `uniq` daquele controle** — e não o
   índice, e não a posição. Troque a ordem da lista do dublê e as colunas
   trocam de lugar **com os MACs junto**.
4. **`player: None` omite o número** — o chip sai `Cosmic Red • USB`, sem `P`.
   Faça a cura inventar `idx+1` e o teste reprova. (É o defeito LEIGO-01b, já
   curado no daemon; a régua impede a GUI de recriá-lo.)
5. **Plástico desconhecido → chip cinza com motivo** — e não um chip com a cor
   de outro controle nem um `undefined` na tela.
6. **Hotplug repinta** — o dublê muda a lista entre duas leituras e o número de
   colunas acompanha, sem a aba ser trocada.

## O que é dela decidir

1. **A tela com 1, 2 ou 5 controles.** O desenho aprovado é o de quatro. Com um,
   sobram quatro quintos de tela vazia; com cinco, os 220px por coluna não
   existem mais. É desenho, e é dela: **as colunas esticam**, **ficam com a
   largura de quatro e sobra vazio**, ou **a área rola na horizontal**?
2. **A frase de zero controles.** Provisório escrito; a palavra é dela.
3. **A ordem das colunas.** Hoje é a da fita. Se ela quiser por número de
   jogador, o `player` já vem do daemon e a mudança é uma chave de ordenação.

## A dependência dura, e ela não é desta onda

**A cor e o nome do plástico não têm dono em `src/`.** Medido em 29/08:
`grep -rl cores-do-dualsense src/` devolve **vazio**; os únicos leitores são
`scripts/gerar_cores_do_dualsense.py` e `scripts/check_cores_do_dualsense.py`.
Nada casa um MAC vivo com um colorway.

E há **duas verdades vivas sobre a mesma coisa**, divergindo em sete:
`docs/data/cores-do-dualsense.csv` conhece **28** modelos;
`integrations/cor_do_plastico.NOMES_DE_FABRICA` conhece **21** (contado hoje).
Nenhuma régua compara as duas.

**Sem essa ponte, as quatro colunas nascem com chips cinzentos e
indistinguíveis** — e o chip é o que diz de quem é a coluna
(`D-A-BORDA-E-A-IDENTIDADE-DA-PECA`). Quem fecha isso é a onda **Conexões**
(a 08, a 11 e a 12); esta sprint declara a dependência, desenha o estado cinza
honesto, e **não** abre `cor_do_plastico.py` nem o CSV — os dois estão em
`nao_toca`.

**E há um agravante de transporte:** `identidade.cor_do_aparelho@dualsense` no
`docs/data/mapa-controles.csv` é `cabo_aciona=sim` / `radio_aciona=não`
(hoje `divida`; dizia `o-aparelho-recusa` até 29/08/2026). Metade da mesa dela
é rádio. A ONDA-CONEXÕES-11 já mediu
que a lápide *"é o aparelho que recusa"* era falsa — era o CRC desta casa,
semente `0x53` e não `0xA3` —, e essa cura é dela, não desta onda.
