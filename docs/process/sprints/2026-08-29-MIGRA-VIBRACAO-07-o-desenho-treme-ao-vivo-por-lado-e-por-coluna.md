---
sprint: MIGRA-VIBRACAO-07
estado: absorvida
onda: MIGRA-VIBRACAO
posse:
  MV7:
    - src/hefesto_dualsense4unix/app/telas/vibracao.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
cria:
  - tests/unit/test_migra_vibracao_07_o_desenho_acende_o_lado_certo.py
  - tests/unit/test_migra_vibracao_07_a_aba_nao_espera_a_troca_de_aba.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-VIBRACAO-01
  - MIGRA-VIBRACAO-04
  - MIGRA-VIBRACAO-05
  - MIGRA-VIBRACAO-03
  - MIGRA-VIBRACAO-06
  # SÉRIE por R5 — donos declarados de `status_actions.py`, medido em 29/08
  - LEVA-3
  - LEVA-4
  - ONDA-CONTROLES-02
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-ILUMINACAO-03
  - ONDA-VIBRACAO-06
  # AS OUTRAS ONDAS DA MESMA LEVA que reivindicam os mesmos arquivos.
  # Lista de 29/08, e ela SE MOVE: as dez ondas estavam sendo escritas ao
  # mesmo tempo. Quem coordena reconfere com `check_colisao_de_sprints.py`
  # antes de despachar.
  - MIGRA-CONTROLES-01
  - MIGRA-CONTROLES-06
  - MIGRA-CONTROLES-07
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/profiles/schema.py
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 05). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA VIBRAÇÃO · 07 — o desenho treme ao vivo, por lado e por coluna

**O defeito em uma frase:** o produto **já publica** qual punho está tremendo e
**já tem leitor público e testado** para isso — e a aba Vibração nunca o abriu.

Palavra dela (`D-O-SVG-VIBRA-POR-LADO`):

> *"Cor do plástico. divide o svgs do dualsense em dois lados esquerdo e
> direito. Parte esquerda vibra mostrando a cor do motor esquerdo."*

## O que já existe, e é a sprint quase inteira

| peça | onde |
|---|---|
| o par que foi **AOS MOTORES**, por vpad | `daemon/ipc_handlers.py:3063-3068` — `rumble_no_fisico` e `rumble_no_fisico_ha_s` no `per_vpad` |
| quem o escreve | `integrations/uhid_gamepad.py:1125` `registrar_rumble_no_fisico`, chamado de `daemon/subsystems/gamepad.py:1801` |
| **o leitor, público e testado** | `app/widgets/controller_card.py:1499` `motores_no_fisico` |
| os ids do desenho | `feat-rumble-esquerdo` / `feat-rumble-direito`, do `docs/data/pecas-do-dualsense.csv` (`aba05.py:33-50`) |
| o poller que já roda a 10 Hz | `app/actions/status_actions.py:486` `_tick_live_state`, com assinantes sem poller próprio |
| o gancho de visibilidade | `status_actions.py:868` `set_status_tab_visivel` |

**`rumble_no_fisico` é o par DEPOIS da política de intensidade** — o comentário
do `ipc_handlers.py:3059-3062` diz por que ele existe: *"todos os `ff_*` acima
são o que o JOGO PEDIU; entre um e outro há uma multiplicação que a tela não
via"*. É o número certo para esta aba: ela mostra o que chegou ao motor, não o
que o jogo pediu.

**E `motores_no_fisico` já responde a pergunta 1 da `ONDA-VIBRACAO-06`** — *"o
desenho apaga sozinho quando o jogo para?"*. Sim: ele devolve `None` quando a
idade passa de `ATIVIDADE_FRESCA_S = 3,0 s`
(`controller_card.py:1290`, `:1523`) e descarta o `(0, 0)` fresco, que é o jogo
mandando parar. **A resposta é o leitor que já existe; não se escreve outro.**

## O que entrega

1. **A aba assina o poller que já existe**, e **só quando visível** — o gancho
   `set_status_tab_visivel` é o precedente. **Não se cria um segundo poller**:
   seriam duas chamadas de IPC para a mesma verdade.
2. **Cada coluna acende o SEU par**, pelo `data-uniq` casando com o `per_vpad`.
   Com quatro colunas à vista não existe a pergunta *"e se o alvo for Todos"* —
   cada coluna é o seu controle, e a fita está esmaecida por decisão dela.
3. **O lado certo:** `strong > 0` (que é `common[3]`) →
   `[id$="-feat-rumble-esquerdo"]` acesa; `weak > 0` (`common[2]`) → `-direito`.
   A inversão é o erro que este assunto convida, e ela tem régua irmã na **06**.
4. **"Testar por 500 ms" acende pelo mesmo caminho** — o teste escreve, o daemon
   publica, a página pinta. **Sem atalho pela página:** um desenho que acende
   porque o botão foi clicado, e não porque o motor recebeu, é o instrumento
   mentindo (`O-INSTRUMENTO-MENTE-MAIS-QUE-O-PRODUTO`).
5. **A injeção do teste respeita os lados.** `on_rumble_test_500ms` injeta
   `weak=160, strong=220` quando as duas barras estão em zero
   (`rumble_actions.py:1008-1014`). Com a **06** no ar, injetar num lado que ela
   desligou acenderia um punho que ela mandou calar.

## Como se prova (a mordida)

`tests/unit/test_migra_vibracao_07_o_desenho_acende_o_lado_certo.py`

- **`per_vpad` do P1 com `rumble_no_fisico=[0, 200]` fresco:** na coluna do P1 o
  **esquerdo** acende e o direito não; a coluna do P2 fica **apagada**.
  *Arranque:* troque `weak` por `strong` na pintura e veja reprovar.
- **Idade acima de `ATIVIDADE_FRESCA_S` → apagado.** *Arranque:* leia o par sem
  olhar a idade e veja o punho ficar aceso para sempre — que é o jogo que morreu
  no meio.
- **`(0, 0)` fresco → apagado**, e não "acendeu com zero". O leitor já sabe;
  a régua garante que a aba não o contorna.
- **O agregado NÃO é lido.** *Arranque:* leia `rumble_ff.last_weak` (o par de
  qualquer vpad) em vez do `per_vpad` e veja acender o punho do jogador errado.
- **Os ids existem no desenho.** Se o grupo `-feat-rumble-esquerdo` sumir do
  SVG, a régua reprova **nomeando o id**. Ela é irmã do `_tira_grupo()` do
  gerador, que já reprova a geração quando uma âncora some.

`tests/unit/test_migra_vibracao_07_a_aba_nao_espera_a_troca_de_aba.py`

- **com a aba visível e NENHUMA troca de aba, três tiques repintam três vezes.**
  *Arranque:* desligue a assinatura e veja o contador parar em zero.
- **com a aba escondida, zero repinturas** — a aba não paga IPC que ninguém vê.
- **A régua roda o tique MAIS DE UMA VEZ, e isto não é detalhe.** Lição paga em
  29/08: *uma régua que roda o tique uma vez mede um INSTANTE, não um
  comportamento* — foi assim que uma leva desta casa introduziu uma regressão
  que só aparecia **181 segundos depois**, com 67 testes verdes.

## O que esta sprint NÃO prova, e diz

**Por rádio, o passthrough do rumble nunca foi medido no aparelho.**
`docs/data/mapa-controles.csv`, `vibracao.rumble.passthrough@dualsense`:
`radio_de_onde_sei = inferido-do-codigo`, e a ressalva diz com todas as letras
*"Implementado sem gate, mas NÃO MEDIDO por Bluetooth"*. Duas das quatro colunas
do mockup são BT.

Esta sprint pinta **o que o daemon publicou**, que é verdade sobre o **nosso**
lado do caminho. Dizer na tela que o motor tremeu é afirmação forte sobre o
transporte, e o lugar dela é a **08** — com `scripts/check_paridade_transporte.py`
reprovando quem afirmar sem teste que sustente.

## O que é dela decidir

**Com dois controles do mesmo plástico na mesa, os dois desenhos ficam
idênticos** — a borda, a moldura e as dez zonas saem da mesma cor. Quem diz de
quem é a coluna é o rótulo escrito embaixo (`P1 • Cosmic Red • USB`), que se
lê. É suficiente, ou a coluna precisa de mais um sinal? A pergunta é a mesma da
Conexões (05, 07 e 08) e a resposta vale para as duas.
