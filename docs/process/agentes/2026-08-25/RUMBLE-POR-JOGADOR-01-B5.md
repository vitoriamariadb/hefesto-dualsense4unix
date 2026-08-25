# RUMBLE — POR JOGADOR-01 · B5 · 25/08/2026

Árvore `hefesto-voo/RUMBLE-POR-JOGADOR-B5`, branch `voo/RUMBLE-POR-JOGADOR-B5`.
**Retomada:** o agente anterior morreu no limite de sessão às 6h10 com trabalho
sujo na árvore.

## O que resgatei

`app/actions/rumble_actions.py` estava modificado e **sem commit** — RUM-1, RUM-3
e RUM-9 inteiros, ~200 linhas, verdes contra a suíte existente, `ruff` e `mypy`.
Nada foi refeito e nada foi descartado. Primeira ação da sessão: rodar os testes
do que estava lá e **commitar** (`ab59fbe`), antes de escrever uma linha nova.

Já commitado pelo agente anterior e conferido: `deac5bc` (a HARM-16 que um clique
em "Parar" desarmava) e `2d62862` (RUM-10 — a escada de vibração no mapa, com
régua).

## O que fechou

| tarefa | o que mudou | arquivos |
|---|---|---|
| **RUM-1** | Com um controle escolhido, a aba passa a dizer que o comando vivo vai para a mesa e que só o PERFIL fica da peça. Rótulo nascido em código, em `#8be9fd` (token de INFO). Com "Todos", não aparece. | `app/actions/rumble_actions.py` |
| **RUM-3** | O "Auto" com peça escolhida para de apagar o override em silêncio: `_gravar_intensidade_no_rascunho` devolve `bool` e o toast nomeia o apagamento. | `app/actions/rumble_actions.py` |
| **RUM-9** | O contador de pedidos passa a ser POR JOGADOR quando há 2+ vpads. Com um jogador só, a frase é byte-idêntica. | `app/actions/rumble_actions.py` |
| **RUM-4** | *"conforme a bateria do controle"* → *"do controle principal — e a força escolhida vale para todos os controles da mesa"*, nos dois lugares. | `gui/main.glade` |
| **RUM-7** | As quatro dicas de política nomeiam o TETO DE MESA, em oração derivada do léxico da Configurações. | `gui/main.glade` |
| **RUM-11** | `tests/unit/test_rumble_por_jogador_01.py` — 21 provas, 6 mordidas. | arquivo novo |
| **RUM-10** | Já fechado pelo agente anterior (`2d62862`). | CSV + `bancada.py` |

**Aguardam o olho dela (D3, classe estrutural, um lote só):** RUM-1, RUM-3,
RUM-4, RUM-7, RUM-9. **Nenhum PNG foi commitado** e `retratar_abas.py` não rodou.

## As mordidas, com as duas saídas

Todas com `__pycache__` limpo entre arrancar e devolver — `PYTEST_ADDOPTS=-p
no:cacheprovider` desliga o cache do **pytest**, não o do **Python**.

| # | tarefa | cura arrancada | vermelho |
|---|---|---|---|
| 1 | RUM-1 | `_pintar_a_linha_do_alcance_do_gesto(self)` sai de `_apply_policy_to_widgets` | `AssertionError: a aba montou com uma peça escolhida e não criou a linha de alcance` / `assert None is not None` |
| 2 | RUM-2 | a consulta a `alvo_de_output_ausente` sai de `_handle_rumble_set` (linha 4000) | `assert 'ok' == 'recusado'` |
| 3 | RUM-3 | `return antes is not None and depois is None` → `return False` | `assert ' — e este controle voltou ao ajuste geral…' in 'Intensidade da vibração: Auto'` |
| 4 | RUM-9 | o ramo `_pedidos_por_jogador` sai de `texto_dos_pedidos_de_vibracao` | 3 vermelhos; o mais claro: `assert 'Jogador 1: 12x, todas com força zero' in 'o jogo falou de vibração 12x, mas pediu força zero em todas'` |
| 5 | RUM-4 | "controle principal" volta a "controle" nos dois textos | 2 vermelhos, um por widget: `rumble_policy_auto` e `rumble_policy_auto_label` |
| 6 | RUM-7 | a oração do teto sai de dois botões | 2 vermelhos: `rumble_policy_economia`, `rumble_policy_balanceado` |

**Uma mordida saiu errada e foi refeita.** A primeira tentativa da nº 2 recortou
por âncora de texto e comeu o `def` inteiro — o vermelho foi
`AttributeError: IpcHandlersMixin has no attribute '_handle_rumble_set'`, que
não prova nada. Refeita por LINHA (a mesma âncora aparece três vezes no arquivo,
em handlers diferentes), o vermelho passou a ser `assert 'ok' == 'recusado'`, que
é exatamente a diferença que a tarefa persegue.

**Um falso verde encontrado e fechado dentro da própria bancada.** A mordida 5 lê
o `<object>` do widget no `main.glade`. A nota datada que EXPLICA a correção mora
entre o `id=` e o rótulo, e ela CITA a frase velha — plantar o singular de volta
continuaria verde pela nota que explica por que ele saiu. A régua passou a
retirar comentários de XML antes de medir.

## Portões

`bash scripts/portoes.sh` — **TODOS VERDES, 23 portões**, rodado depois do
`git add -A`. Além deles: `pytest -k "rumble or vibracao or politica or
por_unidade or alvo_ausente or notebook or palavra"` → 561 passed, 2 xfailed.

## O que NÃO fiz, e por quê

### RUM-2 — já estava fechado por outra frente

O censo do §2.2/2 da sprint dizia "zero chamadores de produção". **Hoje há dois**:
`daemon/ipc_handlers.py:1163` e `:4000`, entrados pela BROADCAST-PROIBIDO-01 /
Z3-5 em 24/08. Não refiz.

O que faltava, e é o que entreguei, é a metade que o `test_p4` não cobre: ele
prova que **ninguém recebe motor**, não que o handler **responde `recusado`**.
Separar *"não fez"* de *"fez e não contou"* é a tarefa inteira, e contar bytes
não separa os dois.

**Recusei a segunda metade da RUM-2 — `rumble.stop` também recusar — e a razão é
medida.** O "Parar" com alvo fora da mesa ainda faz trabalho real e necessário:
zera `daemon_cfg.rumble_active` e chama `silenciar_dono_abandonado` no dono
anterior, que **está** na mesa. Recusar em bloco deixaria um par armado apesar de
ela ter pedido silêncio — é o mesmo argumento que a própria docstring de
`_handle_rumble_stop` já usa para NÃO recusar dentro do Modo Nativo, e ele vale
igual aqui. Contar o fato ao usuário exigiria frase nova (D3), e vai no lote dela.

### RUM-5 — bloqueado por posse

`daemon/lifecycle.py:1196` continua com **6 de 7 appliers** (falta
`rumble_passthrough_applier`) — confirmado hoje na varredura. **`lifecycle.py` é
da frente C3 nesta leva e eu não o toquei.** O conserto é de dez linhas: trocar a
construção à mão por `gerente_do_daemon` (`profiles/manager.py:1719`), que já é
cliente de seis outras rotas e resolve `APPLIERS_DO_DAEMON`.

A mordida que a sprint pede (varredura por AST sobre `src/` exigindo os sete em
toda rota de daemon) **não** foi escrita: ela nasceria VERMELHA na árvore e
travaria a integração. Quem fizer o conserto escreve as duas coisas no mesmo
commit.

### RUM-6 — bloqueado por posse, e o desenho está pronto

`manual_override_categories` (`daemon/state_store.py:102`) é um `set[str]` sem
chave por MAC, e enquanto armado o autoswitch não reaplica perfil para **nenhum**
controle. É o Defeito 1 da POSSE-POR-CONTROLE-01, vivo.

**Dois dos cinco pontos de toque não são meus:**

* `profiles/autoswitch.py:907` (**B7**) e `daemon/subsystems/hotkey.py:648-668`
  (**C3**) chamam `clear_manual_trigger_active` / `mark_manual_trigger_active`;
* `daemon/ipc_draft_applier.py:79` não tem dono declarado nesta leva.

Meus são `state_store.py`, `ipc_handlers.py` e o leitor em `manager.py:534`. Uma
cura só nos meus três deixaria as outras três portas armando a trava velha, e o
sintoma continuaria idêntico — que é a armadilha do "portões em série" de 19/08.

**O desenho, para quem costurar:** a chave vira `(categoria, uniq)` com
`uniq=None` significando "a mesa toda" (o que o gesto "Todos" quer dizer). Quem
arma passa o dono congelado no gesto — `uniq_do_alvo_de_output`
(`daemon/ipc_rumble_policy.py:75`), que já existe e já é usado pelo rumble por
dono. `manual_override_categories` continua devolvendo `frozenset[str]` para os
leitores antigos; a consulta por peça é um método novo ao lado.

### RUM-8 — depende de uma frente que não entregou o que ele precisa

A **Z5** entregou `_REFRESH_POR_ABA` (`app/app.py:1082`), que é refresh **na
troca de aba**, não um relógio periódico. A aba Rumble já está lá
(`"tab_rumble_box": ("_refresh_rumble_from_draft",)`). O que RUM-8 pede é PULSO:
aberta e deixada aberta, a aba nunca mais se atualiza.

O único pulso disponível hoje é o **emprestado da Status** — o molde da aba
"No jogo", que é chamada de dentro dos tiques de `app/actions/status_actions.py`.
**Esse arquivo é da frente B6**, e a sprint proíbe timer próprio em voz alta
("o produto ganharia onze relógios — **não faça**").

Escrevi zero linha: um método de tique sem chamador seria exatamente o defeito
`A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ`. **O que falta é uma linha em B6** — chamar
`_sync_pulso_da_rumble` de dentro do tique de 500 ms, no mesmo lugar de
`_sync_paineis_no_jogo` (`status_actions.py:548-551`).

### O "Aviso ao executor" da RUM-7 — a tarefa como escrita caiu na medição

Ela manda corrigir no `TOOLTIPS.md` e no mockup da Configurações a dica do
Máximo que ainda diz *"e o giroscópio na taxa mais alta"*. **Medido hoje:** o
bloco inteiro (`TOOLTIPS.md:107-111`, `mockup/aba-configuracoes.html:419-420`)
descreve **quatro botões de orçamento** — Economia/Balanceado/Máximo/Auto — e o
produto vivo tem **três perfis** (`app/actions/config/secao_orcamento.py::DICAS`:
"Tudo ligado", "Bateria longa", "Eu escolho").

Corrigir só a oração do giroscópio seria corrigir uma linha de um bloco que
caducou inteiro, e deixaria a metade pior viva — o oposto do que a regra de
"correção pela metade" existe para evitar. **É desenho da Configurações, não
desta aba**, e vai para quem for reger aquela.

## Nada de bancada foi executado

O hub USB dela saiu do barramento às 02h36 e levou os três adaptadores;
`/sys/class/bluetooth/` está vazio. Nenhuma medição de rádio desta sprint (§6:
as quatro perguntas de BT) é executável — **por ausência de aparelho, não por
decisão**. Nenhuma frase nova desta leva afirma comportamento por transporte, e
há mordida vigiando isso (`test_a_frase_nomeia_as_duas_metades_do_gesto` e
`test_a_promessa_de_bateria_nao_afirma_transporte`).

Não parei o daemon, não rodei `systemctl`, não escrevi no aparelho.

## O que sobrou para o próximo

1. **RUM-5** — dez linhas em `lifecycle.py:1196` + a varredura por AST. C3.
2. **RUM-6** — a chave por MAC, com o desenho acima. Precisa de B7 e C3.
3. **RUM-8** — uma linha em `status_actions.py` (B6) + o método de tique.
4. **O bloco caduco do orçamento** em `TOOLTIPS.md` e no mockup da Configurações.
5. **D3** — as cinco frases novas, num lote, para o olho dela.
6. **A bancada dela:** que o Controle 1 fica quieto enquanto o 2 vibra, e a
   metade que vale tanto quanto a ida — **que o motor PARA**.
