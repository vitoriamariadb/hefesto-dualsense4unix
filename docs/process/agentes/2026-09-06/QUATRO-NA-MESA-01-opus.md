# QUATRO-NA-MESA-01 — os dois escritores de `_connected` e a numeração

- **Árvore:** `hefesto-voo/QUATRO-NA-MESA-01-opus`, branch `voo/QUATRO-NA-MESA-01-opus`, nascida de `onda/atual-0609` em `c15d2e3e`
- **Escopo:** os defeitos **1 e 2** da sprint, conforme a nota **ROTA CORRIGIDA** de 06/09. Os defeitos 3 e 4 são corridas e ficam com a MESA-DE-QUATRO-01
- **Bancada:** NÃO exigida (`bancada: false`) e NÃO usada. Nenhum caminho aqui para o daemon, escreve no aparelho ou chama `systemctl`. Tudo com dublê

---

## O que mudou

### O defeito 1 estava vivo, e a primeira medição o mostra em três linhas

`_connected` decide quem CONTA para a numeração 1..N (`_numeros_da_mesa_locked`),
e tinha **dois escritores em cadências diferentes**: o tique lento
(`sync_connected`, ~2,0 s pelo `lifecycle`) SUBSTITUI o conjunto, e a leitura de
cor (`make_auto_output_provider` → `numero_da_lampada` → `slot_for(assign=True)`)
ADICIONAVA — a 10 Hz, enquanto a aba Status está aberta.

Medido nesta árvore, com quatro endereços na mesa e o terceiro tirado pelo tique.
**Uma única leitura de cor do ausente:**

```
apos sync com 4:        {1º: 1, 2º: 2, 3º: 3, 4º: 4}
apos tique sem o 3o:    {1º: 1, 2º: 2,        4º: 3}
  _connected: [1º, 2º, 4º]
provider(ausente) -> _DesiredOutput(led=(0, 255, 0), player_leds=(True, False, True, False, True))
  _connected DEPOIS da leitura: [1º, 2º, 3º, 4º]
  numeros da mesa DEPOIS: {1º: 1, 2º: 2, 3º: 3, 4º: 4}
```

**O quarto foi de 3 para 4 e a lightbar dele de verde para rosa por causa de uma
consulta** — e o tique o traz de volta a 3 dois segundos depois, sem parar,
enquanto o controle bounça no rádio. É a frase que a sprint prevê:
*"quando um controle pisca, os outros trocam de cor e de número sozinhos, e voltam"*.

### A cura: `autoridade_de_presenca`

`slot_for` e `numero_da_lampada` ganharam um argumento só-por-nome
`autoridade_de_presenca: bool = True`, e o provider automático é o único
chamador que o desliga:

```python
slot = registry.numero_da_lampada(uniq, autoridade_de_presenca=False)
```

Com ele desligado, a leitura **continua** fazendo o que é identidade e **para**
de fazer o que é do tique:

| ato | com `autoridade_de_presenca=False` |
| --- | --- |
| ATRIBUIR lugar na fila (R-14 §1) | continua — sempre, é identidade |
| pôr na mesa um endereço que **ESTREIA** (D1) | continua — a cor nasce certa no tique do hotplug |
| **RESSUSCITAR** quem o tique declarou ausente | **para** — é só do tique |

A cura NÃO é chamar `mark_disconnected`: ele está sem chamador de produção **de
propósito** (R-15/D2 — o lugar na fila sobrevive ao disconnect), e a sprint
proíbe por escrito.

**A mesma medição, depois:** `provider(ausente) -> None` (sem opinião),
`_connected` intacto, `{1º: 1, 2º: 2, 4º: 3}` — estável.

**D1 conferido separado**, com um registro virgem e sem nenhum `sync_connected`:
as duas estreias saem azul/P1 e vermelho/P2 no mesmo tique. A responsividade do
hotplug não foi paga pela cura.

### O defeito 2 não reproduz nesta árvore — e digo por quê

A causa que a sprint aponta (`campos["player_leds"] = player_led_pattern(slot)`
com `slot` vindo direto de `_posicao_locked`, **sem desempate**) **não existe
mais**: em 27/08 o provider passou a ler `numero_da_lampada` →
`_numeros_da_mesa_locked`, cuja unicidade é **estrutural** (um `zip` entre a fila
do momento e os postos ordenados, com as duas parcelas estritamente crescentes —
não colide nem com o arquivo corrompido).

O que faltava era essa garantia ser **alcançável**: com a autoadmissão do defeito
1, a tabela mudava debaixo de quem já tinha lido. **Os dois defeitos eram um só
mecanismo**, e a sprint já dizia isso (*"é o defeito 1 alimentando este"*).

A régua nova tranca as duas metades juntas, e mede **o que o daemon AFIRMA** —
o `player_slot` do IPC (`_player_slot_for` → `slot_for(assign=False)`) e o
`player_leds` que a camada automática resolve — nunca o sysfs, pelas três razões
que a sprint lista (o sysfs mostra o número do KERNEL; o Pro acende TRÊS LEDs
para dizer "Jogador 3"; o DualSense usa o padrão PS5).

### Arquivos

| arquivo | o que |
| --- | --- |
| `src/hefesto_dualsense4unix/daemon/subsystems/identity.py` (**posse**) | o parâmetro, os dois callsites, o bloco *"Os dois escritores de `_connected`"* na docstring do módulo |
| `tests/unit/test_quatro_na_mesa_01_os_dois_escritores_e_a_numeracao.py` (**cria**) | a régua — 14 casos em 4 classes |
| `tests/unit/test_dois_controles_no_jogador_um.py` | **fora da posse, e digo o porquê abaixo** |
| `tests/unit/test_auto_player_colors.py` | idem |

**As duas edições fora da posse são obrigatórias, não conveniência:** os dois
arquivos **codificavam a autoadmissão como contrato**, e um deles a descrevia em
prosa (*"O provider de identidade não é uma leitura pura: ele ADMITE na mesa o
controle que pergunta"*) — um fato que a cura tornou falso, e a regra da casa
manda substituir, não empilhar. Três testes ficariam vermelhos sem tocá-los.

O que mudou neles é **quem readmite**, nunca o que se promete: `test_replug_
mantem_a_cor_do_slot` continua exigindo que o replug do controle 1 volte AZUL —
só que pelo tique — e ganhou de brinde a asserção de que a leitura **não**
readmite. A classe `TestOLoteNaoNumeraComAMesaPelaMetade` continua exigindo que
nenhum número se repita; o que ela passou a aceitar é o buraco de ≤2 s
(quem voltou fica **sem opinião**, `None`) no lugar do pisca-pisca contínuo.

### As duas células do mapa que este trabalho exercita

Nenhuma medição de aparelho — os dois degraus abaixo são **MONTOU**, em dublê:

| `chave` | controle | o que vi |
| --- | --- | --- |
| `combinacao.slot_jogador.estabilidade` | dualsense | *"O número de jogador se mantém quando outro controle entra ou sai?"* — **agora sim, e antes não**: uma leitura de cor de um ausente mudava o número de um presente. A célula está `cabo_aciona=parcial`; o "parcial" tinha causa, e ela era esta |
| `plataforma.slot_jogador` | dualsense | o `player_slot` que o daemon publica é injetor com quatro entradas, sob tique de 2 s e leituras a 10 Hz concorrentes |

**Não toquei `docs/data/mapa-controles.csv` — e a primeira tentativa foi por
outro caminho, que vale escrever.** O portão `citacoes-de-linha` reprovou com 6
citações podres: quatro linhas do mapa apontam para `identity.py:668`
(`slot_for`), e o bloco de docstring que eu tinha posto no topo do módulo
empurrou a função para `:697`. Reapontar o CSV consertava o portão e **abria
outro**: `mapa-de-canais` exige que `html/specs.html` seja regerado a partir
dele, e isso reescreve 1,7 MB de artefato compartilhado — um conflito de merge
irrecuperável na prática, do mesmo feitio do `main.glade`, por causa de um
número de linha.

A saída certa era não mexer a linha: o bloco *"Os dois escritores de
`_connected`"* desceu para a docstring de `make_auto_output_provider`, que é
onde a cura mora e onde ninguém cita endereço. `def slot_for(` voltou a ser a
linha 668, o CSV está intocado e os dois portões estão verdes.

**A regra que isso deixa:** antes de reapontar uma citação de linha, pergunte
por que ela se mexeu. Se o que a empurrou foi prosa sua, mova a prosa — é mais
barato que mover o endereço, e não arrasta artefato gerado atrás.

---

## Qual mordida prova

### Mordida 1 — a cura arrancada, defeito 1

Cura arrancada trocando a linha do produto por `registry.numero_da_lampada(uniq)`
(o default, que readmite):

```
FAILED ...::TestOSegundoEscritorDeConnected::test_a_leitura_de_cor_nao_readmite_o_ausente
FAILED ...::TestOSegundoEscritorDeConnected::test_o_ausente_fica_sem_opiniao_em_vez_de_acender
FAILED ...::TestOSegundoEscritorDeConnected::test_a_leitura_nao_mexe_o_numero_dos_outros
FAILED ...::TestOSegundoEscritorDeConnected::test_a_aba_status_a_10_hz_nao_mexe_a_mesa
FAILED ...::TestOSegundoEscritorDeConnected::test_o_tique_continua_sendo_o_dono
FAILED ...::TestATempestadeDeStateFull::test_o_slot_de_cada_mac_vivo_e_estavel
6 failed, 7 passed
```

Cura devolvida: **14 passed**.

### Mordida 2 — a colisão de verdade, e ela precisou de DUAS coisas arrancadas

O primeiro corte não bastou, e isso é achado: com o provider voltando a `slot_for`
(o código pré-27/08 que a sprint nomeia como defeito 2), a régua **continuou
verde**. Duas razões, as duas medidas:

1. `_assentar_mesa_locked` (o backend, cura da MESA-NO-MEIO-DO-LOTE-01) ainda
   apresentava a mesa inteira antes do lote;
2. a **geometria** importa. Com o que pisca no MEIO da fila, readmiti-lo empurra
   só quem vem DEPOIS, e quem vem depois ainda não foi resolvido — não colide.

A colisão só nasce na geometria exata do journal dela: **quem piscou é o PRIMEIRO
da fila e resolve por ÚLTIMO no lote**. Com as duas coisas arrancadas:

```
AA:BB:CC:00:00:02  (F, F, T, F, F)   -> jogador 1
AA:BB:CC:00:00:03  (F, T, F, T, F)   -> jogador 2
AA:BB:CC:00:00:04  (T, F, T, F, T)   -> jogador 3
AA:BB:CC:00:00:01  (F, F, T, F, F)   -> jogador 1   <- COLISÃO
```

`FAILED ...::test_a_geometria_de_27_08_nao_colide_mais_por_construcao`

Com a cura de pé, essa geometria não colide **sem depender do assentamento**:
uma leitura não move a mesa, então os quatro do lote leem a mesma tabela por
construção. **As duas edições no backend foram desfeitas** — `git diff` não o
toca.

### O dublê sabe recusar, dentro do próprio arquivo

`TestAReguaSabeRecusar` exercita o caminho pré-cura sem comentar linha nenhuma do
produto: `autoridade_de_presenca=True` continua alcançável de propósito (é por
ele que o tique passa), e chamá-lo do lugar do provider reproduz o defeito 1
exatamente como ele estava — inclusive o degrau 3→4 do quarto controle. Régua que
só sabe passar não é régua.

### A tempestade do enunciado

`TestATempestadeDeStateFull` roda o tique (`sync_connected`) e a aba
(`provider` + `numero_da_lampada`) em **threads concorrentes**, com um controle
marcado ausente, e exige que o slot de cada MAC vivo seja **um único valor**
durante a corrida inteira: `{1º: {1}, 2º: {2}, 4º: {3}}`. É o aceite literal da
sprint.

### Vermelhos que já estavam lá

Três, e nenhum é meu — medidos com o meu trabalho fora da árvore:

- `test_player01_um_numero_de_jogador.py::test_preset_sem_destinatario_recusa…`
  e `::test_aplicar_sem_destinatario_tambem_recusa` — o texto do recado mudou de
  *"quais controles estão na mesa"* para *"quais controles estão ligados"* (a
  palavra "mesa" saindo da tela) e as duas réguas digitam o texto velho;
- `test_uma_faixa_nao_e_um_fabricante.py::test_o_retrato_deduz_a_raiz_do_proprio_arquivo`
  — `FileNotFoundError: scripts/gui-captura/retrato_offscreen.py`. A janela GTK
  saiu inteira nesta leva e essa régua ficou apontando para o disco de ontem.

Fora esses três: **1498 passed** nos 33 arquivos de teste que citam identidade.

---

## O que NÃO verifiquei

- **NADA no aparelho.** `bancada: false`, bancada não exigida, nenhum DualSense
  tocado. Todas as células abaixo foram exercitadas **em dublê**, e nenhuma delas
  passa do degrau MONTOU. A prova de aparelho é da MESA-DE-QUATRO-01;
- **se a lâmpada é REESCRITA quando o tique readmite.** A cura troca "número
  errado agora" por "sem opinião por ≤2 s", e *sem opinião* significa que o merge
  cai no default global. **Não medi se algo repinta o controle depois que o tique
  o readmite** — se nada repintar, ele pode ficar com o padrão global até o
  próximo reassert (≤30 s pelo `DEFEND_DISPLAY_MIN_INTERVAL_S`). É a linha mais
  importante desta seção, e ela é de aparelho;
- **o que ela VÊ.** A sprint diz que o aceite tem de bater com o que o daemon
  afirma *e* com o que ela vê. Medi o primeiro; o segundo é dela;
- **a mesa MISTA** (Pro Controller / 8BitDo pelo `external_identity`). Não toquei
  aquele registro e não exercitei o provider de presença dos externos além do
  invariante de contagem que já existia;
- **os defeitos 3 e 4.** Fora do escopo por decisão da ROTA CORRIGIDA. Não medi a
  predição falsificável do `lightbar_reassert_skip_cache`;
- **`git log`/foto de tela.** O trabalho não toca a interface — nenhum HTML,
  nenhum widget, nenhuma janela. Não abri navegador nem GTK.

---

## O que sobrou para o próximo

1. **`_assentar_mesa_locked` ficou sem efeito sobre presença, e a docstring dele
   agora está errada** — `core/backend_pydualsense.py:1960`. Ela diz *"o provider
   de identidade não é uma leitura pura: ele ADMITE na mesa o controle que
   pergunta"*, e hoje ele não admite mais (exceto estreante). **Não editei: o
   arquivo não está na minha `posse:`.** O que sobra dele é apresentar
   ESTREANTES; a corrida que ele curou morreu na origem. Quem for dono do backend
   decide entre podá-lo e reescrever a prosa. **A régua nova não depende dele** —
   é isso que a mordida 2 prova.

2. **O tique de 2 s é a nova latência visível de um replug**, e isso é decisão de
   produto, não de código: um controle que pisca no rádio agora renumera os
   outros (NUM-01: *"nunca existe um jogador 2 sem um jogador 1"*) e volta quando
   o link volta. Antes a leitura mascarava a saída dele e o efeito era um
   pisca-pisca; agora são duas transições limpas. **Se ela achar que um blip de
   rádio não devia renumerar ninguém**, a cura é uma carência no tique (um
   controle só sai da mesa depois de N batimentos ausente) — e isso é a
   MESA-DE-QUATRO-01 com ela na frente do aparelho, não uma sprint de código.

3. **Defeitos 3 e 4 seguem abertos**, como a ROTA CORRIGIDA determina: o relógio
   de defesa `_defend_last_at` é UM para os quatro (o teto de 30 s tem de virar
   por-controle sem virar "tirar o teto"), e o cache anti-guerra do `SysfsLedNode`
   morre a cada `discover()`. Os dois são `core/`, fora desta posse.

4. **ARMADILHA NOVA, e ela quase custou este trabalho: `git stash` é COMPARTILHADO
   entre todas as worktrees do mesmo `.git`.** Usei `git stash -u` para medir a
   linha de base, e o `git stash pop` seguinte devolveu **o trabalho de outro
   agente** (`rumble_actions.py`, `status_actions.py`,
   `test_politica_de_vibracao_o_alcance_na_tela.py`) — outra worktree empilhou
   entre o meu push e o meu pop. A minha entrega inteira estava em `stash@{1}`.
   Recuperada por ref explícita; o trabalho alheio foi devolvido à pilha com a
   mensagem `devolvido: pop cruzado de outra worktree (…)`. **O `git stash list`
   desta árvore já tinha QUATRO entradas "devolvido: pop cruzado" de levas
   anteriores** — ou seja, isto não é novo, só nunca foi escrito. **A regra que
   sobra: agente em worktree não usa `git stash`.** Para medir a linha de base,
   copie o arquivo (`cp`) e devolva com `cp`, que foi o que usei nas duas
   mordidas.
