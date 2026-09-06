# COOP-NA-CONEXAO-NATIVA-01 — o modo mais fiel deixou de dizer que ninguém é jogador

**06/09/2026 · branch `voo/COOP-NA-CONEXAO-NATIVA-01-opus` · nascida de
`onda/atual-0609` em `c15d2e3e`.**

Entregues os **Caminhos A e B** da sprint (NATIVA-1 e NATIVA-2). A NATIVA-3 é do
mapa, que não é meu; a NATIVA-4 depende da §5, que é dela. **`should_be_active`
NÃO foi aberto**, e a §7 abaixo diz por quê.

## O que mudou

### 1. O número do jogador existe sem vpad — Caminho B

`daemon/subsystems/coop.py` — nasceu `_numeros_sem_vpad`, e
`resolve_player_numbers` passou a chamá-la no lugar do `[None] * N`.

Sem gamepad virtual havia **dois** estados diferentes, e os dois devolviam
`None`:

| estado | antes | agora | por quê |
| --- | --- | --- | --- |
| **Controlar o PC** (desktop) | `None` | `None` | não há jogo do outro lado; a resposta certa não mudou |
| **Conexão Nativa (Sony)** | `None` | o número do `identity_registry` | o jogo abre o físico e fala direto com ele; há controle na mão de alguém |

**O dado já estava calculado, e é o ativo desta sprint.** O `identity_registry`
é chaveado pelo MAC e não consulta modo nenhum — o `_sync_identity_registry`
roda a cada 2 s antes do gate de conexão (`lifecycle.py:4506-4508`). O produto
sabia o número e não o publicava.

**A premissa que caiu estava ESCRITA**, e por isso a docstring mudou no mesmo
commit: *"sem gamepad virtual (modo desktop/nativo): não existe jogador"* era
decisão, não descuido. Deixar a frase velha ao lado do código novo é a correção
pela metade que esta casa proíbe.

**Três blindagens, e cada uma é uma cicatriz desta casa:**

* **`assign=False`** — perguntar o número não pode dar lugar na fila a ninguém.
  `resolve_player_numbers` roda no `state_full`, dez vezes por segundo; sem
  isso a ordem da fila passaria a depender de quem abriu a tela. É o mesmo
  contrato do `ipc_handlers._player_slot_for`, e é por ele que o `player` e o
  `player_slot` do payload passam a **concordar** neste modo;
* **`if ligado is not True`**, literal — com o daemon dublado por `MagicMock`,
  `is_native_mode()` devolve um mock **truthy**, e um `if` solto numeraria a
  mesa inteira num teste que nunca falou de modo nenhum. Mesma família do
  `isinstance(number, int)` que já estava ali;
* **daemon sem `is_native_mode`** (install editable com daemon mais velho que a
  janela) cai no ramo mudo, nunca numera por acidente.

**Um efeito de carona, e ele é o defeito que a ROTA CORRIGIDA nomeou:**
`a01_jogar._jogador_esperando` esmaecia o número enquanto `player is None` —
"o jogo ainda não recebeu este controle". Na Conexão Nativa isso valia para
**todos**, **para sempre**, prometendo uma promoção que nunca viria: ali não há
grab nem vpad a esperar. **Nada mudou naquela função** — ela já estava certa;
quem mentia era a fonte. Está escrito no docstring dela, para a próxima pessoa
não caçar o defeito no lugar errado.

### 2. A tela diz quantos jogadores existem no modo — Caminho A

**PROVISÓRIO — decisão dela** (`PROVA-DE-TELA-01`). É texto novo de tela; a
palavra final é dela, e está marcada como provisória nos três lugares do fonte.

**A frase cravada**, em `interface/aba01.py`, com dono único
(`NATIVO_E_OS_JOGADORES`) e **dois** consumidores na mesma linha Status:

> Modo Nativo: o Hefesto sai do meio e o jogo fala direto com o controle.
> **Aqui ele não cria um controle para cada pessoa — quem conta os jogadores é
> o jogo, pelos controles que ele enxerga.**

Os dois lugares são o `title` da posição **Desligado** e o `?` ao lado dela —
que **já repetiam palavra por palavra** a metade velha. Estender um só deixaria
o `?` explicando o modo e calando sobre o que mudou.

**A frase viva**, em `app/actions/jogar/painel.py`
(`FRASE_DO_MODO_NATIVO` + `aviso_do_modo_nativo`, selo **MODO**), na coluna
Atenção, **só com dois ou mais controles conectados**:

> Conexão Nativa com 2 controles ligados: neste modo o Hefesto não cria um
> controle para cada pessoa — quem conta os jogadores é o jogo, pelos controles
> que ele enxerga.

* **é a sétima fonte de `AVISOS_DA_TELA` e a única que não mora em
  `home_actions`** — a frase nasceu nesta leva e o dono é esta aba; pô-la lá
  criaria um segundo dono para um assunto que a janela GTK não tem mais (ela
  saiu inteira em 06/09, `D-0609-GTK-LEVA-INTEIRA`);
* **o teto de dois é o ponto:** com um controle não existe pergunta de co-op, e
  a coluna mostra três de cada vez — um aviso que fala sempre empurra para o
  `+N` os que falam quando dói;
* **o selo `MODO` entrou em `ORDEM_DA_GRAVIDADE`**, ao lado do `GAMEPAD`. Selo
  fora da escada vai para depois de tudo, e "depois de tudo" com a coluna cheia
  é *escondido atrás do `+N`*. Os dois respondem à mesma pergunta — «como o jogo
  vê os controles» — em modos que se excluem, então nunca disputam a linha.

**O que a redação NÃO diz, e é deliberado.** *"O jogo vê dois jogadores"* seria
afirmação forte sem régua: a §4.2 da sprint é **inferido do código** e nenhum
jogo foi aberto com dois controles na Conexão Nativa nesta casa. As duas frases
dizem de **quem é a conta**, nunca qual é o resultado dela. E nenhuma usa verbo
de afastamento com o Hefesto por sujeito — é a cicatriz do
`test_a_frase_refutada_da_allowlist`, que reprovou a primeira redação do
`TEXTO_NATIVO` por começar com *"O Hefesto saiu da frente"*.

### 3. O que ela vê hoje, e o que espera publicação

`mockup/01-jogar.html` regenerado (uma linha de `title` + uma do `?`), com a
divergência declarada em `mockup/DIVERGENCIAS.md` — **publicar é ato dela**.

**A metade que chega HOJE, sem publicar nada:** a linha da coluna Atenção usa os
endereços `aviso-selo`/`aviso-texto` que a página publicada já tem, e o número
do jogador vai para o cartão que já existe. Nada regride enquanto ela olha.

## Qual mordida prova

`tests/unit/test_o_coop_vive_na_conexao_nativa.py` — **16 testes, 0,84 s.**
`ControllerIdentityRegistry` entra **de verdade**, não como `SimpleNamespace`:
um dublê `lambda uniq: {...}[uniq]` não conhece o `assign=False` e daria verde
sobre uma leitura que atribui lugar na fila.

**NOVE MORDIDAS, arrancadas uma a uma, com a cura devolvida entre cada duas.
Nove reprovaram; nenhuma passou.**

| # | o que arranquei | quem reprovou |
| --- | --- | --- |
| 1 | `_numeros_sem_vpad` → `return [None] * len(controllers)` (o de ontem) | `test_o_numero_do_jogador_sobrevive_sem_vpad` |
| 2 | o `if ligado is not True` inteiro | `test_no_controlar_o_pc_ninguem_e_jogador` |
| 3 | `is not True` → `if not ligado` | `test_um_daemon_dublado_nao_numera_a_sala_inteira` |
| 4 | o `assign=False` da chamada de `slot_for` | `test_perguntar_o_numero_nao_da_lugar_na_fila` |
| 5 | o `Aviso(SELO_DO_MODO, …)` de `AVISOS_DA_TELA` | `test_o_texto_do_modo_nativo_fala_de_jogadores` |
| 6 | `if quantos < 2` → `< 1` | `test_com_um_controle_so_a_linha_do_modo_cala` |
| 7 | a dica de ontem de volta ao `INTERRUPTOR` | `test_a_dica_do_desligado_fala_de_jogadores` |
| 8 | `"MODO"` fora de `ORDEM_DA_GRAVIDADE` | `test_o_selo_do_modo_esta_na_escada_da_gravidade` |
| 9 | `{NATIVO_E_OS_JOGADORES}` fora do bloco `?` | `test_a_pagina_diz_isto_nos_dois_lugares_e_por_um_dono_so` |

**A mordida 4 é a que valeu mais**, e ela mede o instrumento e não o produto: a
régua planta um MAC que o registro nunca viu, lê o número (esperando `None`) e
**depois pergunta ao registro se ele ganhou lugar**. Sem o `assign=False` o
desconhecido volta com `2` e a fila fica mexida por alguém que só olhou a tela.

**O caminho inteiro também está medido**, e não só as peças:
`test_a_linha_do_modo_chega_a_coluna_da_aba` monta o `Contexto`, chama
`a01_jogar.pacote` e cobra a frase no `aviso-texto` que o piloto pinta — com
`painel.avisos_do_estado` REAL, que é o que está sob medição.

**Vizinhos, verdes:** `test_subsystem_coop.py`,
`test_a01_a_coluna_atencao_acende_o_mais_grave.py`,
`test_a01_a_ponte_entra_na_coluna.py`,
`test_a_aba01_le_o_estado_em_vez_de_cravar.py`,
`test_a_aba_01_jogar_fecha_as_linhas.py` — **130 passed, 1 skipped**.

**Portões:** `bash scripts/portoes.sh` → **TODOS VERDES, 45 portões**
(`/tmp/portoes-COOP-NA-CONEXAO-NATIVA-01.txt`). A árvore já nascia nos 45
verdes; nenhum mudou de cor.

## O que NÃO verifiquei

**A §5 INTEIRA — a pergunta que decide o tamanho de tudo.** *Com dois DualSense
na Conexão Nativa, um jogo de co-op local vê dois jogadores?* **NÃO MEDIDO, e
não tem substituto:** quem conta gamepads é o jogo, não o Hefesto, e nenhuma
leitura de código responde. Ela é bancada **dela**, e a ROTA CORRIGIDA a
endereçou à **MESA-DE-QUATRO-01** — *"não é pré-requisito do código; é a prova
dele"*.

**A bancada estava LIVRE** (`scripts/bancada.sh status` → *LIVRE*) e **não a
reservei**: não havia o que medir nela. Na máquina havia **um** DualSense, e
virtual (`uhid`, `Hefesto P1`); a §5 pede **dois físicos, um jogo de co-op
local, no cabo e no rádio, com a contraprova no Modo Gamepad**. Reservar a
bancada para não usá-la travaria a casa. **Construí com dublê e deixo a linha de
prova para a MESA-DE-QUATRO-01** (`D-0609-A-BANCADA-PROVA-NAO-BLOQUEIA`).

**Consequência honesta, e ela é a razão de o Caminho A ser piso e não extra:**
se a §5 der **NÃO**, o número novo é uma afirmação sobre o jogo que ninguém
mediu. É por isso que a frase da tela **não** diz que o jogo vê dois — ela diz
de quem é a conta. Com A no lugar, B não pode virar mentira nova.

**Não olhei a tela com o navegador nem com o piloto.** Nenhum pixel se move: as
duas mudanças de desenho são texto dentro de `title`/`?`, e a linha viva usa
endereço que já existia. **A prova de tela desta sprint é o olho dela**, e é o
que a `PROVA-DE-TELA-01` pede para texto novo.

**Não medi o LED de jogador no aparelho** (Caminho C). Ele fura o
`_output_mute`, que é **regra dela** (`core/backend_pydualsense.py:3147-3152`) e
só ela abre.

## O que sobrou para o próximo

1. **A REDAÇÃO É DELA.** Três frases nascem `PROVISÓRIO`: a de `aba01.
   NATIVO_E_OS_JOGADORES` (que serve o `title` e o `?`) e a
   `painel.FRASE_DO_MODO_NATIVO`. As duas dizem a mesma oração de quem conta, e
   **a divergência entre elas morre pela régua** — mesma escolha do
   `MARCA_DO_PRIMARIO` e do `SERVICO_DESLIGADO`.
2. **A §5, na MESA-DE-QUATRO-01**, com o roteiro já escrito na sprint: os quatro
   passos, a **contraprova obrigatória no Modo Gamepad** (sem ela, um jogo que
   simplesmente não tem co-op local passaria por prova contra a Conexão Nativa)
   e **quantos adaptadores de rádio** estavam em uso — esse número fecha metade
   de uma pergunta aberta na `PERFIS-ABRE-O-QUE-GUARDA-01` de graça.
3. **NATIVA-3 — o mapa, e ele não é meu** (`nao_toca`). A célula
   `plataforma.slot_jogador@dualsense` tem `cabo_ate_onde_foi` e
   `radio_ate_onde_foi` **vazios**; o que medi está na seção `mediu` do meu
   JSON, com o degrau **MONTOU** e o transporte `dublê`. Quem escreve o mapa é a
   `SPECS-A-PROCEDENCIA-01`, a partir deste relatório.
4. **NATIVA-4 (Caminho D) continua sem desenho**, por decisão da própria sprint:
   ele só existe se a §5 der NÃO, e a frase do que se perde é olho dela. **A
   troca de modo nunca é automática.**
5. **`test_subsystem_coop.py:838-840` ficou com meia verdade no docstring** —
   `test_sem_gamepad_virtual_ninguem_e_jogador` diz *"Modo desktop/nativo"* e
   hoje só o **desktop** é verdade (o `_make_daemon` daquele arquivo não tem
   `is_native_mode`, então o teste segue verde e segue medindo o ramo certo).
   **Não editei: o arquivo não é meu** (R1). Uma palavra a menos fecha.
6. **A `SPRINT_ORDER.md:613-616` continua dizendo "não proponho sprint nova"** —
   a sprint já registrava que isso caducou, e o arquivo continua não sendo meu.
7. **O caminho do Steam Input não foi examinado**, e ele muda a conta de
   gamepads do jogo: na Conexão Nativa os físicos estão visíveis para ela. Se a
   §5 der um resultado estranho — três ou quatro jogadores com dois controles —,
   a causa provável é essa, e é sprint própria.

## Duas armadilhas medidas nesta leva

**1. O MAPA CONGELA O TOPO DO `coop.py`, e ninguém tinha escrito isso.**
`docs/data/mapa-controles.csv` cita `coop.py:792-802`, `:804` e `:819` **por
faixa**, em quatro células. Escrevi um parágrafo de docstring no
`should_be_active` (linha ~320) e o portão `citacoes-de-linha` ficou vermelho
com **seis citações podres** — nenhuma delas sobre o que eu mudei: só sobre o
DESLOCAMENTO. E o mapa é `nao_toca` desta sprint (é da
`SPECS-A-PROCEDENCIA-01`), então não há como reapontá-las daqui.

**Consequência para quem vier:** *acrescentar uma linha antes da 792 do
`coop.py` reprova um portão que você não pode consertar.* A cura foi mover o
parágrafo para dentro de `_numeros_sem_vpad`, que é abaixo — e o próprio
docstring diz por que ele mora ali. **O conserto de verdade é o mapa citar
símbolo em vez de faixa**, e isso é da SPECS.

**2. `/tmp` é compartilhado com os outros agentes da leva.** O script das
mordidas ficou em `/tmp/mordidas.py` e, na segunda execução, rodou as **doze
mordidas de outra frente** (a do som no cartão) — mesmo nome de arquivo, outra
sprint. Nenhum dano: o script restaura o que arranca. Mas uma saída lida sem
olhar teria virado "as minhas nove mordidas passaram", que é medição falsa com
a cara certa. **Arquivo de trabalho vai para o scratchpad da sessão, nunca para
`/tmp` com nome genérico.**
