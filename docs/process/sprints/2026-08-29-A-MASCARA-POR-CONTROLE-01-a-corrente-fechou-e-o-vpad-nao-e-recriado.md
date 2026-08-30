# A MÁSCARA POR CONTROLE — 01: a corrente fechou, e o vpad não é recriado

**29/08/2026.** Decisão dela: `D-A-MASCARA-POR-CONTROLE-VALE-NO-APLICAR` — *"a
máscara por controle vale ao clicar em Aplicar, mesmo com jogo aberto. Ela assume
o risco, e a tela avisa antes."*

O registro por aparelho existia desde 15/08 e os dois backends de vpad já sabiam
consultá-lo. Faltava **um parâmetro**. Ele entrou.

---

## O que estava partido, e onde

| elo | estado em 28/08 | estado agora |
|---|---|---|
| o registro por aparelho | pronto (`daemon/subsystems/external_mask.py`, arquivo próprio `controller_masks.json`) | intacto |
| o backend uinput | `for_flavor` já chamava `mascara_efetiva` (`integrations/uinput_gamepad.py:419`) | intacto |
| o backend uhid | `for_flavor` já consultava o registro (`integrations/uhid_gamepad.py:1030`) | intacto |
| **a factory** | **`make_virtual_pad` não tinha `identity`** | `integrations/virtual_pad.py:153` |
| **o P1** | `gamepad.py` chamava sem identidade | `daemon/subsystems/gamepad.py:2108` |
| **o secundário** | `coop.py` chamava sem identidade — com o MAC na linha de baixo | `daemon/subsystems/coop.py:971` |

## A corrente, elo por elo

- **`integrations/virtual_pad.py:153`** — `make_virtual_pad` ganhou
  `identity: str | None = None`.
- **`integrations/virtual_pad.py:213`** — `key = mascara_efetiva(identity, flavor)`
  no lugar do `normalize_flavor(flavor)`. **Antes de escolher o backend**, que é a
  armadilha que `external_mask.py:59-68` deixou escrita para quem escrevesse este
  degrau: o gate do `_try_uhid` decide pela máscara que RECEBE.
- **`daemon/subsystems/gamepad.py:1713`** — nasceu `primary_identity(daemon)`:
  lê `backend.primary_uniq`, e `None` continua sendo a resposta honesta *"não sei
  de quem é este vpad"*.
- **`daemon/subsystems/gamepad.py:2013-2014`** — **são DUAS máscaras**. `key` é a
  do JOGO (vai para `config.gamepad_flavor` e para o disco); `mascara_do_p1` é o
  que o vpad VESTE.
- **`daemon/subsystems/gamepad.py:2054`** — a idempotência do Aplicar compara
  contra `mascara_do_p1`, nunca contra `key`.
- **`daemon/subsystems/gamepad.py:2108`** — `identity=identity` na criação.
- **`daemon/subsystems/gamepad.py:1710`** — a promoção de backend deixou de cravar
  `flavor="dualsense"` (ver "o achado de borda" abaixo).
- **`daemon/subsystems/coop.py:971`** — `identity=player.identity`.
- **`daemon/subsystems/coop.py:714`** — o laço passou a chamar
  `vpad_ficou_para_tras`, que esperava chamador desde 15/08.

Duas lápides que outras pessoas escreveram foram **retiradas pelas próprias
instruções delas**, e as duas são medição independente de que a corrente fechou:

- `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` acusou
  `external_mask.py::vpad_ficou_para_tras` como "lápide que sobreviveu à própria
  cura" — a função ganhou chamador em produção;
- `tests/unit/test_mascara_por_jogador_01.py` tinha um `xfail(strict=True)` que
  **XPASSOU**, exatamente como o texto dele previa em 15/08.

## A MORDIDA, com os números

Régua nova: `tests/unit/test_mascara_por_controle_manda_no_vpad.py` (13 testes).
Cada cura foi **arrancada do produto** e o vermelho, medido.

| arrancada | o que voltou a ser | medido |
|---|---|---|
| **A** — `identity=` fora das duas chamadas | o código de 28/08 | **201 vpads em 200 tiques** do co-op (esperado: 2), todos `xbox`: a escolha do P2 sumiu. 6 testes vermelhos |
| **B** — `key = normalize_flavor(flavor)` | resolução DEPOIS do backend | o gate do uhid recebeu `['xbox']` em vez de `['dualsense']` — o jogador cai no par degradado (uinput + máscara DualSense = **rumble do jogo morto**). 5 vermelhos |
| **C** — `vpad_ficou_para_tras` → `!=` cru | a comparação contra um valor global | **201 vpads em 200 tiques**, todos com a máscara CERTA. É a arrancada traiçoeira: tudo parece certo e o vpad é destruído a cada ~2 s com o jogo aberto |
| **D** — idempotência contra `key` | a comparação contra a máscara do jogo | **50 applies idênticos → 50 `aplicado`** (esperado: 50 `ja_estava`); 50 vpads destruídos e recriados |
| **E** — promoção cravando `flavor="dualsense"` | o código de 28/08 | `config.gamepad_flavor` virou `dualsense` numa sessão `xbox` |

## A prova de que o vpad NÃO é recriado fora do Aplicar

É o coração do risco: recriar o vpad invalida o handle do jogo aberto (medição de
20:15 de 2026-07-18 — a Steam nunca reabre o hidraw do vpad do P1). A decisão dela
aceita esse preço **no Aplicar**; em nenhum outro momento.

- **tique do co-op:** 200 voltas com o P2 marcado `dualsense` numa sessão `xbox`
  → **2 criações**, e nenhum `stop()`. Com a cura arrancada: **201**.
- **Aplicar do P1:** 50 applies idênticos com o P1 marcado `dualsense` numa
  sessão `xbox` → **1 criação**, 50 desfechos `ja_estava`, e o `id()` do objeto
  inalterado. Com a cura arrancada: **50 criações**.
- **e o Aplicar CONTINUA aplicando**: mudada a escolha dela, o Aplicar seguinte
  recria (`test_o_aplicar_recria_quando_a_escolha_dela_muda`). Idempotência não
  virou surdez.
- **e a cura da SPRINT-GAME-RUMBLE-01 sobrevive**: a máscara do JOGO mudando
  ainda derruba e recria os secundários — senão volta o *"P2+ presos no flavor
  antigo, rumble morto"*.

### Por que 200 voltas e não uma

Regra desta casa, aprendida hoje: *uma régua que roda o tique UMA VEZ mede um
instante, não um comportamento.* **Medido**: com a cura arrancada e `VOLTAS = 1`,
a asserção de contagem dá `2 == 2` e **passa** — o churn é invisível na primeira
volta, porque nela o vpad ainda está nascendo. A 200 voltas o número é 201.

## O achado de borda (não estava no enunciado)

`upgrade_primary_vpad_to_uhid` chamava `start_gamepad_emulation(flavor="dualsense")`
com um flavor CRAVADO, três linhas abaixo de um comentário que diz *"a preferência
não mudou, só o backend"*. Era inofensivo enquanto a máscara era única. Com a
máscara por aparelho, o P1 pode estar em `dualsense` por escolha DELE numa sessão
`xbox` — e a promoção de backend viraria a máscara da **sessão**, contaminando a
GUI, o disco e todo secundário que herda o valor global no `_flavor()` do co-op.
Curado passando `flavor=None` (`gamepad.py:1710`).

## O instrumento falso que escrevi, e como caiu

O primeiro teste do achado de borda usava a fixture `sem_efeitos`, que dubla o
`start_gamepad_emulation`. Um dublê nunca escreve em `config.gamepad_flavor` —
então a asserção passava **com a cura arrancada**. Medido, não suposto: devolvi o
`flavor="dualsense"` ao produto e o teste seguiu verde. Reescrito para usar o
`start` REAL, dublando só a criação do vpad. Agora morde.

É a sexta vez que esta casa registra o mesmo padrão. A forma dele aqui:
**o dublê engoliu justamente o efeito que o teste dizia medir.**

## O que esta leva NÃO entrega

**A metade da ESCRITA não existe.** Medido: `grep set_mask src/` não tem um único
chamador fora do próprio `external_mask.py`, e não há rota IPC nem widget de
máscara por controle (`ipc_handlers.py` só conhece a máscara da sessão;
`app/widgets/external_card.py` não tem nada de máscara).

Ou seja: **o produto agora OBEDECE a escolha por aparelho, mas ela ainda não tem
por onde fazê-la.** A corrente do lado da leitura está inteira e provada; o gesto
dela — a rota IPC que grava e o controle na tela — é a próxima sprint, e sem ela
o comportamento visível é idêntico ao de ontem (que é de propósito: sem entrada no
registro, `mascara_efetiva` devolve a máscara do jogo).

## O risco que continua NÃO medido

O do cabeçalho do `external_mask.py`, intacto e vale repetir: **ninguém mediu** se
um jogo aceita dois vpads com máscaras diferentes ao mesmo tempo. Steam Input, o
`gamecontrollerdb` da SDL ou um motor que escolhe UM esquema de prompts para a
partida podem trocar prompts, embaralhar a ordem ou ignorar quem destoa. O
caminho está ligado; **a promessa de que funciona no jogo não pode ser feita** até
a mesa cheia ser medida com o jogo aberto.
