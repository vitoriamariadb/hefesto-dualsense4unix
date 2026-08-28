---
sprint: ONDA-VIBRACAO-06
# onda: ABA-VIBRACAO
posse:
  V6:
    - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
cria:
  - tests/unit/test_o_desenho_da_vibracao_acende_o_lado_certo.py
  - tests/unit/test_a_aba_vibracao_nao_espera_a_troca_de_aba.py
bancada: false
depois_de:
  - ONDA-VIBRACAO-01
  - ONDA-VIBRACAO-05
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/rumble_actions.py
  # e src/hefesto_dualsense4unix/app/app.py
  # e src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-04
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/app/draft_config.py
---

# ONDA VIBRAÇÃO · 06 — o desenho treme ao vivo

**O defeito em uma frase:** a aba só se atualiza **quando alguém entra nela** —
quem fica parado olhando enquanto joga vê um retrato congelado — e o desenho que
ela pediu, com os dois lados acendendo, não existe em tela nenhuma.

Palavra dela (D-O-SVG-VIBRA-POR-LADO):

> *"Cor do plástico. divide o svgs do dualsense em dois lados esquerdo e
> direito. Parte esquerda vibra mostrando a cor do motor esquerdo."*

## O que está medido

- `app/app.py:1090` — `_REFRESH_POR_ABA["tab_rumble_box"] =
  ("_refresh_rumble_from_draft",)`. **É o único gatilho.** Fora a troca de aba,
  nada nesta aba se move.
- `status_actions.py:432-438` — o poller de `daemon.state_full` já existe, roda a
  10 Hz e **já tem assinantes sem poller próprio** (a Lightbar é um). É o molde,
  e é por isso que esta sprint **não cria um segundo poller**: seriam duas
  chamadas de IPC para a mesma verdade, que é o defeito que o
  `_update_rumble_state_label` já evitou uma vez.
- `daemon/ipc_handlers.py:3100-3101` — o `state_full` publica `last_weak` /
  `last_strong` **agregados** (o último par de qualquer vpad). O objeto do vpad
  **tem** `ff_last_sent` (`:2881`), e ele **não viaja no `per_vpad`**
  (`:2955-2975`). Com dois controles na mesa, o agregado acende o lado do
  jogador errado.

## O que esta sprint entrega

1. **`ff_last_sent` sobe no `per_vpad`** como `last_weak` / `last_strong`, ao
   lado dos contadores que já sobem. É uma linha de payload, e é o que faz a
   pergunta *"qual punho está tremendo AGORA, neste controle"* ter resposta.
2. **A aba assina o poller que já existe.** `_refresh_rumble_from_draft` continua
   na troca de aba; o desenho passa a ser pintado a cada tique do
   `_tick_live_state`, e **só quando a aba está visível** — o gancho
   `set_status_tab_visivel` é o precedente (`status_actions.py:442-446`).
3. **O desenho acende por lado**, com o widget da ONDA-VIBRACAO-01:
   - `strong > 0` (que é `common[3]`) → `feat-rumble-esquerdo` acesa;
   - `weak > 0` (que é `common[2]`) → `feat-rumble-direito` acesa.
   O par é o do **controle escolhido na fita** — `alvo_de_edicao(self).uniq`
   casando com o `per_vpad`. Alvo "Todos" ou desconhecido: o desenho mostra o
   **primário** e diz de quem é na legenda, nunca soma dois controles num
   desenho só.
4. **A borda do desenho tem a cor do plástico, sempre** —
   D-A-BORDA-E-A-IDENTIDADE-DA-PECA, com a palavra dela: *"a borda do controle
   sempre tem a cor do plástico"*. É como ela sabe de quem é a vibração que está
   vendo, com dois controles na mesa.
5. **"Testar por 500 ms" acende os dois lados** pelo mesmo caminho — o teste
   escreve o par, o daemon o publica, o desenho o pinta. **Sem atalho pela GUI:**
   um desenho que acende porque o botão foi clicado, e não porque o motor
   recebeu, é o instrumento mentindo (O-INSTRUMENTO-MENTE-MAIS-QUE-O-PRODUTO).
6. **O teste para de inventar número quando o lado está desligado.**
   `on_rumble_test_500ms` injeta `weak=160, strong=220` quando as duas barras
   estão em zero (`rumble_actions.py:1011-1014`). Com a ONDA-VIBRACAO-05 no ar,
   injetar num lado que ela desligou faria o desenho acender um punho que ela
   mandou calar. A injeção passa a respeitar os dois interruptores.

## Como se prova (os testes que MORDEM)

`tests/unit/test_o_desenho_da_vibracao_acende_o_lado_certo.py`
- `state_full` com `per_vpad` do P1 em `last_weak=0, last_strong=200`: o
  **esquerdo** acende e o **direito** não. **Arranque:** troque `weak` por
  `strong` na pintura e veja reprovar — é a inversão que este assunto convida, e
  a ONDA-VIBRACAO-05 já tem o portão irmão.
- Dois controles, P2 selecionado na fita, só o P1 vibrando: o desenho fica
  **apagado**. Arranque: leia o agregado `rumble_ff.last_weak` em vez do
  `per_vpad` e veja acender o punho do jogador errado — que é o produto de hoje.
- Midnight Black: a borda sai `tom_para_a_borda("#00040d")`, não `#00040d`.

`tests/unit/test_a_aba_vibracao_nao_espera_a_troca_de_aba.py`
- com a aba visível e **nenhuma** troca de aba, três tiques do poller repintam o
  desenho três vezes. **Arranque:** desligue a assinatura e veja o contador
  parar em zero.
- com a aba **escondida**, zero repinturas: a aba não paga IPC que ninguém vê.

## O que é dela decidir

1. **O desenho apaga sozinho quando o jogo para?** `ff_last_sent` guarda o
   **último** par enviado. O jogo manda um par zero ao parar (é o que faz o
   `ff_play_count` subir na parada), mas jogo que morre no meio não manda nada —
   e o punho ficaria aceso para sempre. Apagar por tempo (meio segundo sem par
   novo) é a saída óbvia; o preço é um piscar em vibração intermitente.
2. **Com a fita em "Todos", o desenho mostra quem?** Esta sprint propõe o
   primário, nomeado na legenda. A alternativa é um desenho por controle, e aí a
   aba passa a ter dois desenhos com dois na mesa.
