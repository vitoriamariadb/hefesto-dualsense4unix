---
sprint: ONDA-CONTROLES-01
estado: absorvida
# onda: CONTROLES — o campo `onda:` ainda NÃO existe em
# scripts/check_colisao_de_sprints.py:_CAMPOS_CONHECIDOS, e campo desconhecido
# é erro duro no analisador. Fica como comentário até alguém acrescentá-lo.
posse:
  CTRL01:
    - src/hefesto_dualsense4unix/app/widgets/painel_no_jogo.py
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
cria:
  - tests/unit/test_controles_a_faixa_do_card.py
bancada: false
depois_de:
  - COOP-NA-CONEXAO-NATIVA-01
  - LEVA-3
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/gui/theme.css
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 02). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONTROLES · 01 — a faixa que a Steam guardava

**O defeito, numa frase:** o que o jogo está recebendo de cada controle só
aparece quando há **jogo da Steam aberto**, e some inteiro fora disso — num
produto que ela decidiu que **não é só Steam**.

## O que está medido

- `painel_no_jogo.py:402`, `jogo_steam_aberto` — a porteira. Três respostas
  (`True` / `False` / `None`), e as duas últimas apagam a aba. O pedido que a
  criou é de 10/08 e era sobre a **aba**: *"essa aba no jogo só deveria aparecer
  quando efetivamente eu tivesse com um jogo steam aberto"*. Sem aba, a
  porteira perde o objeto.
- `painel_no_jogo.py:512`, `titulo_do_painel` — o título que repete o do card.
  Um card, um título.
- `controller_card.py:2825`, `_verdade_label` — a "linha da verdade", calculada
  10x por segundo e **nunca empacotada** desde 17/08. CPU sem tela.
- `controller_card.py:2774`, `_montar_estado_global` — o berço da faixa **já
  existe**: é onde "Perfil ativo" e "Hefesto" são escritos no card único.

## O que esta sprint entrega

A **faixa de estado rápido** no topo de cada card, exatamente como o mockup
aprovado a desenha (`src/hefesto_dualsense4unix/interface/aba02.py`, função `card`, bloco
`fx`), com seis itens numa linha só:

| item | de onde vem hoje |
|---|---|
| `Sony · Player 1 · Cosmic Red · USB` | `titulo_do_card` (`controller_card.py:1037`) — o nome desce para dentro da faixa, pedido dela em 27/08: *"o nome do controle Sony player 1... fica dentro do bloco de status rápido"* |
| perfil ativo (`Mortal Kombat`) | `_montar_estado_global` (`:2774`) |
| `Hefesto on` | idem |
| `vê como DualSense` + alarme laranja de divergência | `resumo_do_que_chega_ao_jogo` (`:1717`) e `mascara_pedida_pelo_jogo_em_cena` (`painel_no_jogo.py:486`) |
| `giro ~194 Hz` | `texto_motion` (`:1200`) |
| bateria, barra **esticada** até o fim da faixa + `%` | `_update_bateria` (`:4756`) — pedido dela em 27/08: *"estica a largura da bateria pra caber tudo ali"* |

E três coisas saem:

1. **A porteira da Steam**: `jogo_steam_aberto` deixa de decidir se a leitura
   existe. Ela continua no módulo como leitura (quem quiser saber, pergunta),
   mas nenhum caminho de montagem a consulta. `D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM`.
2. **O título repetido** (`titulo_do_painel`): um card, um título.
3. **A linha da verdade** (`:2825`): desempacotada em 17/08 a pedido dela,
   continua sendo calculada. Sai o cálculo junto.

**Sem alarme falso:** o item que não tem dado **não escreve palavra nenhuma** na
faixa. Um `vê como —` ou um `giro 0 Hz` afirmaria repouso onde a resposta certa
é *não sei* — o mesmo desenho que `gyro_do_inputs` (`:1850`) já usa.

## Como se prova (o teste que morde)

`tests/unit/test_controles_a_faixa_do_card.py`, três mordidas:

1. **A Steam não é mais porteira.** Monte o card com `state_global` sem `appid`
   e com `lido=False` (os dois casos em que `jogo_steam_aberto` devolve `None`)
   e exija que a faixa tenha os seis itens. *Arranque a cura* — devolva a
   consulta a `jogo_steam_aberto` no caminho de montagem — e veja a faixa
   nascer vazia.
2. **A divergência pinta.** Com o perfil pedindo `DualSense` e a máscara em
   `Xbox 360`, o item da máscara ganha a classe de alarme e a dica com a frase
   inteira; com as duas iguais, não ganha. Régua que só sabe passar não é régua:
   as **duas** respostas entram no teste.
3. **Sem dado, sem palavra.** Com `inputs` sem `gyro`, o item do hertz não
   existe na faixa — não existe escrito `0 Hz`.

Mais uma, barata e que pega regressão de CPU: **`_verdade_label` não é mais
construído** — asserção sobre a ausência do atributo, no molde do
`test_o_botao_da_rota_nao_migra_mais_para_o_card` que já existe.

## O que é dela decidir

1. **As outras cinco linhas do "No jogo".** O contrato do redesenho promete as
   seis (`giroscópio · vibração · gatilho · luz · clique do touchpad · som do
   controle`), com *no jogo agora* / *parou* / *sem pedido ainda*
   (`linhas_do_controle`, `painel_no_jogo.py:262`). O mockup que ela aprovou
   traz **uma** na faixa: o hertz do giroscópio. *As outras cinco vão para o "?"
   da faixa, ou saem do produto?*
   **PROVISÓRIO — decisão dela:** vão para o `"?"` da faixa, entregue na
   ONDA-CONTROLES-09. Nada é apagado antes da palavra dela.
2. **O aviso do perfil que não entrou** (`aviso_do_perfil`, `:364`) cabe na
   faixa ou vira uma segunda linha do card? A faixa do mockup tem 34px de altura
   e uma frase inteira não entra nela.
