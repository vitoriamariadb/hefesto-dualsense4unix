---
sprint: INFRA-DE-EXECUCAO-01
posse:
  A1:
    - scripts/despachar-agente.sh
    - scripts/bancada.sh
    - scripts/portoes.sh
    - scripts/costurar.sh
    - scripts/check_colisao_de_sprints.py
    - docs/process/COMO-EXECUTAR-UMA-SPRINT.md
    - docs/process/COMO-REGER-AGENTES.md
    - docs/process/COMO-COORDENAR-UMA-LEVA.md
  # ACRESCENTADO em 25/08/2026: o berço que vaza é infra de execução, não
  # produto. Sem dono declarado, o despacho recusa a árvore.
  G8:
    - tests/conftest.py
    - scripts/check_faixa_sintetica.py
cria:
  - scripts/bancada.sh
  - scripts/portoes.sh
  - scripts/costurar.sh
  - scripts/check_colisao_de_sprints.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/
  - main.glade
  - .github/workflows/ci.yml
  - scripts/gerar-painel.py
  - scripts/hooks/pre-commit
  - .pre-commit-config.yaml
---

# INFRA DE EXECUÇÃO · 01 — o registro do que está em voo

**24/08/2026.** Não é sprint de produto: é a **infra que executa as outras
vinte e duas**. Nasce do pedido dela, textual:

> *"Quero que vc veja o todo. Procure cada falha e criemos em sprints e
> documentações a infra perfeita pra executarmos o nosso plano. **Eu e vc na
> medição e os agentes em background executando tudo.**"*

E do gesto que esta leva tem de tornar seguro:

> *"Se eu der um /clear e falar pro Claude: vamos fazer a medição do BT,
> enquanto isso manda agentes pra execução das demais sprints — tudo vai
> ocorrer conforme planejamos."*

| | |
|---|---|
| **Grau** | **MEDIDO** em todo o §2 — cada linha traz o comando que a produziu, rodado nesta árvore em 23/08 à noite e 24/08. As quatro medições que sustentam a peça-raiz (custo do worktree, isolamento de índice, armadilha do editable, `flock` sem órfão) foram **refeitas à mão por quem escreve**, não copiadas do briefing. **DESENHO** na coreografia, nas tarefas e no custo. **NÃO VERIFICADO** está declarado no §9, item a item. |
| **Fecha** | O `git add -A` de um agente deixa de poder tocar a árvore de outro; a medição de um agente deixa de ver a árvore em movimento do vizinho; a colisão de posse vira conflito de merge barulhento em vez de sobrescrita silenciosa; a **R2** morre e **17 dos 22 aceites** voltam a ser fecháveis pelo próprio agente; e o registro do que está em voo passa a ser mantido pelo **git** e pelo **kernel**, nunca por um agente que pode morrer. |
| **NÃO faz** | **Não muda uma linha da tela do produto.** Não toca `src/hefesto_dualsense4unix/` (exceção única: nenhuma). Não reescreve sprint de aba nenhuma. Não decide a duplicata PAREAMENTO×Z6 — só a mede e a leva para ela. Não roda a suíte inteira. |
| **Cura o defeito de forma** | **F1** (o `git add -A` que engole o vizinho), **F2** (a medição sobre árvore em movimento) e **F3** (as colisões de posse não declaradas) — as três falhas de processo medidas em 23/08, todas remendadas à mão por quem coordenava. |
| **Depende de** | **Nada de código.** Depende de **duas decisões dela**, ambas de minutos, no §8.0. |
| **Origem** | Medição própria de 23-24/08, nesta árvore, sem parar o daemon e sem escrever byte no aparelho. |

---

## 1. O defeito, em uma frase

**Não existe registro do que está em voo, e quem sabia era uma pessoa que não
sobrevive ao `/clear`** — mas a cura não é escrever esse registro: é **tornar a
disputa impossível**, isolando cada agente na própria árvore de git, e deixando
o registro cair de graça, mantido por quem já é obrigado a mantê-lo.

---

## 2. O que está medido

### 2.1 As três falhas de 23/08, com a evidência

**F1 — um `git add -A` engoliu o trabalho de outro agente.** Relato textual de
um executor: *"outro agente rodou `git add -A` e engoliu as minhas mudanças no
índice junto com as dele"*. Doze agentes mencionaram `git add -A`; três commits
saíram com 6, 16 e 14 arquivos fora do tema; e o `painel.html` entrou de carona
em 16 de 22 commits. **Ninguém perdeu trabalho por sorte, não por desenho** — e
a perda de `secao_exame.py` mostra que a sorte não se repetiu sempre: houve
snapshot e restauração por cima de escrita alheia.

**F2 — um agente mediu o estado TRANSITÓRIO de outro.** Ele reportou 13 testes
vermelhos que não eram dele; minutos depois estavam verdes. O relato registra:
*"outro agente está reescrevendo `app/actions/config/moldura.py` neste
momento"*. Treze relatos do mesmo dia descrevem estado transitório; doze deles
são árvore em movimento (o décimo terceiro é disputa de 16 núcleos, que é CPU).
**Medição sobre árvore em movimento não mede nada** — e isso já estava escrito
na **R2** do [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md), em prosa, sem
nenhuma máquina para cobrar.

**F3 — quatro colisões de posse, nenhuma declarada.** Só apareceram no
conferente, depois de tudo escrito: Z1 e Z2 reivindicam **os mesmos quatro
arquivos**. A frase *"arquivos disjuntos"* no `SPRINT_ORDER` era fato errado e
saiu.

**A raiz é uma só.** Nada em `docs/data/` fala de posse ou de execução. O que
segurava a leva era a cabeça de quem coordenava, e o `/clear` a apaga.

### 2.2 A peça-raiz, medida à mão nesta árvore (24/08)

**M1 — O worktree custa um quinto de segundo e 59 MB.**

```
$ /usr/bin/time -f "%e s" git worktree add --detach <destino> HEAD
TEMPO=0.18 s
$ du -sh <destino>          ->  59M
$ git ls-files | wc -l      ->  1911
$ du -sh .                  ->  19G
```

A árvore inteira tem **19 GB**; o worktree copia só os **1 911 arquivos
rastreados**. Os `packaging/` não viajam porque são untracked. **`cp -r` e
`rsync` estão fora por três ordens de grandeza**, não por gosto.

**M2 — O isolamento de índice é do git, e foi provado, não suposto.**

```
$ echo novo > $A/ARQUIVO_DUBLE.txt && git -C $A add -A
$ git -C $A  status --porcelain   ->  A  ARQUIVO_DUBLE.txt
$ git -C $B  status --porcelain   ->  (vazio)
$ git       status --porcelain   ->  (vazio)     # a árvore principal, a dela
```

**É a F1 morrendo por construção.** O `git add -A` do agente A não tem como
alcançar o índice de B nem o da árvore dela: são índices distintos por desenho
do git.

**M3 — A armadilha que a própria cura cria, e ela é a F2 ressuscitada.**

`.venv/lib/python3.12/site-packages/_editable_impl_hefesto_dualsense4unix.pth`
contém **um caminho absoluto**:

```
/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/src
```

Conferido dos dois lados, de dentro do worktree:

| como | `hefesto_dualsense4unix.__file__` |
|---|---|
| sem `PYTHONPATH` | `/mnt/Apate/.../src/...` — **a árvore principal, a do vizinho** |
| com `PYTHONPATH=<wt>/src` | `<wt>/src/...` — a própria |

Um agente que rode `.venv/bin/python` dentro do worktree e não saiba disso
**mede o código de outra pessoa e jura que mediu o seu**. É exatamente o padrão
*"o instrumento mente mais que o produto"*. Por isso o `PYTHONPATH` não pode
morar na cabeça de ninguém: nasce no despachante e tem portão próprio (I2).

**M4 — O `flock` não deixa órfão, e a primeira medição disto foi FALSA.**

A prova serializada, três processos concorrentes num ciclo ler-modificar-gravar:

```
com    flock  ->  3 linhas de 3 sobreviveram
sem    flock  ->  1 linha  de 3 sobreviveu     (duas perdidas em silêncio)
```

E a prova de ausência de órfão:

```
detentor PID=1142206
fuser <lock>            ->  1142206
flock -n <lock>         ->  OCUPADO
kill -9 1142206
fuser <lock>            ->  (vazio)
flock -n <lock>         ->  LIVRE — o kernel soltou
```

> **A cicatriz desta medição, e ela é a lição da casa.** As **duas primeiras
> tentativas devolveram "AINDA OCUPADO"** — um falso negativo convincente, que
> teria matado a peça P3 no papel. A causa não era o `flock`: era o dublê. Na
> primeira, `flock arquivo -c cmd` **forqueia**, e matar o pai deixava o filho
> segurando o descritor; na segunda, meio segundo de espera não bastou. Só
> quando o dublê passou a **declarar o próprio PID** e a prova passou a
> conferir o detentor com `fuser` é que a medição virou verdade. **O dublê que
> só sabe falhar mente tanto quanto o que só sabe passar** (A2 ao contrário).

**M5 — `dev` não pode estar em check-out em duas árvores. O git recusa.**

```
$ git worktree add <destino> dev
fatal: 'dev' is already used by worktree at '/mnt/Apate/.../hefesto-dualsense4unix'
```

**É a garantia de que a árvore dela nunca é tocada por agente**, e é do git, não
da nossa disciplina. Por isso as branches de agente são `voo/*` e o alvo de
integração é `onda/atual` — nunca `dev`.

### 2.3 O que a árvore diz agora, e cada linha manda numa peça

**M6 — A pasta de entrega dos agentes morreu, e a data diz por quê.**

```
$ find docs/process/agentes -type f | wc -l                     ->  58
$ find docs/process/agentes -type f -newermt 2026-08-23 | wc -l ->   0
```

**Cinquenta e oito arquivos, todos sob `2026-08-06`. Zero de 23/08**, o dia de
189 agentes iniciados e 124 relatórios. E a causa está no protocolo, não no
desleixo: ele exigia `python3 scripts/sanitizar_saida_de_agente.py ORIGEM
DESTINO` — um comando manual, cuja ORIGEM **nem existia como arquivo** (o
relatório vive no transcrito). **Nasceu sem gatilho.** O sanitizador está no
disco desde 07/08, 17 KB, e nunca foi ligado — é *"a casa sabe e o produto não
faz"* aplicado à nossa própria infra.

**M7 — Três portões estão vermelhos no HEAD, e um deles é falso.**

Cronometrados por mim, nesta árvore, em `f143bb7`:

| portão | tempo | rc |
|---|---|---|
| `gerar-painel.py` | 0,08 s | 0 |
| `gerar-mapa.py --check` | 0,08 s | 0 |
| `gerar-contrato-ipc.py --check` | **0,06 s** | **1** |
| `validar-citacoes-de-linha.py --all` | **0,04 s** | **1** |
| `validar-acentuacao.py --all` | 37,03 s | **1** |
| `validar-glifos.py --all` | 1,39 s | 0 |
| `validar-referencias-docs.py --all` | 3,67 s | 0 |
| `ruff check src/ tests/` | 0,01 s | 0 |
| `check_anonymity.sh` | 2,98 s | 0 |

Os **dois primeiros vermelhos são reais e custam um décimo de segundo somados**:
`docs/protocol/ipc-unix-socket.md:87` aponta `ipc_handlers.py:4911` para
`_handle_plugin_list`, que está em **4931**. Vermelhos há vinte e um commits.
**Nenhum ser humano falhou aqui — eles simplesmente não rodavam localmente.**

O **terceiro é falso, e apareceu enquanto eu fazia estas medições**:

```
docs/process/PRE-REGISTRO-VIES-01-...:52: media -> sugestão média
```

A linha é *"o `mtime` que **media** a coisa errada"* <!-- noqa-acento --> — pretérito imperfeito de
*medir*, escrito certo. O validador não distingue o verbo do substantivo, e o
arquivo entrou no commit `f143bb7`, de **23/08 às 23:41 — enquanto eu trabalhava
nesta árvore**. Há escape por linha (`noqa-acento`), então o conserto é de uma
linha; mas a lição é maior: **se o gancho da camada 1 já existisse hoje, ele
teria barrado um commit correto.** Régua nova entra com a lista de falsos
positivos conhecidos, ou o primeiro reflexo de quem for barrado é `--no-verify`.

**M8 — O painel publica número que não tem árvore a que pertencer.**

`docs/data/painel-cache.json` tem três chaves: `medido_em`, `portoes`, `suite`.
`medido_em` é `1787534197.09` = **23/08 às 22:16:37**, no meio do voo. Ele
guarda `ruff: ok=false` com quatro erros. Conferido agora:

```
$ .venv/bin/ruff check src/ tests/   ->  All checks passed!   rc=0
```

**Um vermelho morto publicado como vivo.** E `roda_os_caros()`
(`scripts/gerar-painel.py:204-248`) grava só o `medido_em` — nem `head`, nem
quantos arquivos estavam sujos. Já `estado_do_git()` (`:183-199`) **sabe** o
`head` e o número de sujos, e os imprime no rodapé. **A informação existe; ela
só não acompanha o número caro.**

**M9 — Duas listas de portão para a mesma coisa, e uma delas não roda.**

```
$ grep -c "id:" .pre-commit-config.yaml   ->  10
$ which pre-commit                        ->  not found
```

`scripts/instalar-hooks.sh` só faz `ln -sf` de `scripts/hooks/*` para
`.git/hooks/`. **Os dez portões declarados no `.yaml` não rodam nesta máquina.**
Duas listas para a mesma coisa é o defeito que a regra do fato-errado existe
para matar.

**M10 — A posse tem dez rótulos e nenhuma máquina os lê.**

Nas vinte e três sprints de 24/08, o mesmo campo aparece como `POSSE DE ARQUIVO
(exclusiva)` (3×), `POSSE EXCLUSIVA`, `possui, e SÓ`, `Faixa / arquivo`,
`arquivos que ele toca`, `com quem colide`, `faixa`… **Uma única sprint declara
o que NÃO toca** — e é a metade que falta, porque é ela que separa "não citei"
de "declarei que não é meu".

**M11 — A duplicata PAREAMENTO×Z6 é real, e é o achado mais caro do lote.**

Os quatro módulos que as duas sprints mandam **criar**:

```
scripts/gerar-fatos-de-tela.py                     -> não existe
src/hefesto_dualsense4unix/app/fatos_do_mapa.py    -> não existe
src/hefesto_dualsense4unix/app/fala_do_mapa.py     -> não existe
scripts/validar-fala-de-tela.py                    -> não existe
```

Z6 cita PAREAMENTO 17 vezes; PAREAMENTO cita Z6 **zero**. E o `SPRINT_ORDER`
lista PAREAMENTO-01 em **dois lugares** (`:327` como item do balde, `:391` como
"frente Z6"). São **11 + 6 agentes** despachados para a mesma obra.
**Nenhum `grep` na árvore acha colisão em arquivo que ainda não existe** — só um
portão que leia o que as sprints prometem criar.

**M12 — Quinze das vinte e três sprints citam `main.glade`, e nenhuma declara
faixa de linha nele.** XML único, sem seções nomeadas. Dois agentes salvando o
Glade perdem trabalho **mesmo em worktrees separados**, porque conflito de merge
em XML gerado é irrecuperável na prática.

---

## 3. Por que isolamento, e não um registro

O briefing convidava a escrever *"um registro do que está em voo"*. **Recuso a
peça, e a razão é medida.** Um registro descreve a disputa; ele não a impede. E
cria a pergunta sem resposta boa: *quem apaga a linha quando o agente morre?* —
que é a mesma pergunta que matou `docs/process/agentes/` (M6).

O worktree não proíbe a F1 e a F2: **torna as duas impossíveis** (M2). A F3
sobrevive, mas **degrada de sobrescrita silenciosa para conflito de merge
barulhento** — que é a diferença entre perder trabalho e ser avisado.

**O princípio que generaliza, e vale para as sete peças:**

> **Todo estado de "em voo" tem de ser mantido por quem já é obrigado a
> mantê-lo — o git (`worktree list`) ou o kernel (PID vivo, `flock`) — nunca por
> um agente que pode morrer no meio.**

Todo trinco que dependa de um `finally` do agente é a pasta de 06/08 de novo.

### O que o worktree NÃO cura, e por isso existem sete peças e não uma

A bancada é recurso físico único: **1 daemon, 1 broker de hidraw, 1 controle, 3
adaptadores**. Quinze das 22 sprints precisam do daemon vivo, 11 abrem hidraw,
5 mexem em `systemd`, e 2 usam `btmon`/`bluetoothctl`/`rfkill` — colisão frontal
com a medição de Bluetooth dela. **Isolar árvore não divide aparelho.** É
semáforo (I4), e o semáforo é honesto: quem precisa da bancada **espera**.

---

## 4. A coreografia dos agentes

**Oito agentes, quatro rodadas.** Teto de 15 respeitado com folga, e de
propósito: esta é a leva que **conserta a regência**, e reger doze agentes com a
regência quebrada seria provar o defeito em vez de curá-lo.

> **O paradoxo do arranque, dito com todas as letras.** Esta sprint constrói o
> isolamento por worktree, e por isso **os agentes dela não podem usá-lo** — ele
> ainda não existe. A **rodada 1 roda no modo velho**: posse de arquivo em
> prosa, no prompt, com a lista negativa explícita. É a última leva desta casa a
> ser regida assim. **A rodada 2 em diante já roda dentro dos worktrees que a
> rodada 1 entregou** — e isso é o primeiro teste real do produto desta sprint.

### Rodada 0 — quem coordena, sozinho, antes de tudo (30 min)

| tarefa | por quê |
|---|---|
| **I20** — os três vermelhos do HEAD | Se a camada 1 nascer com o HEAD vermelho, o primeiro reflexo de quem for barrado é desligá-la. |
| **As duas decisões dela** (§8.0) | A duplicata PAREAMENTO×Z6 vale **17 agentes**. Nenhum dos dois é despachado antes. |

### Rodada 1 — a peça-raiz, três em paralelo, posse em prosa

| agente | tarefas | POSSE (exclusiva) | NÃO toca |
|---|---|---|---|
| **B1 — o dono do despachante** | I1, I3 | `scripts/despachar-agente.sh` (novo) | tudo o mais |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| **B2 — o dono do semáforo** | I4, I6 | `scripts/bancada.sh` (novo); os pontos de chamada de I6 | `scripts/despachar-agente.sh`, `scripts/costurar.sh` |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| **B3 — o dono da prosa** | I19 | `docs/process/COMO-REGER-AGENTES.md` | todo `scripts/`, todo `src/` |

**B1 e B2 não se cruzam em arquivo nenhum**, e B3 só escreve prosa. As três
posses foram conferidas contra a lista negativa, que é o que a M10 diz que
quase ninguém faz.

### Rodada 2 — as réguas da peça-raiz, dois em paralelo, já em worktree

| agente | tarefas | POSSE (exclusiva) |
|---|---|---|
| **B4 — o dono das réguas do voo** | I2, I5 | `tests/unit/portao_o_agente_mede_a_propria_arvore.py`, `tests/unit/portao_a_bancada_nao_deixa_orfao.py` (ambos novos) |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| **B5 — o dono da costura** | I7, I8, I9, I10 | `scripts/costurar.sh` (novo); `docs/process/agentes/README.md`; `tests/unit/portao_a_costura_serializa.py` (novo) |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**B4 lê o que B1 e B2 escreveram e não os edita.** Se uma régua exigir mudança
no script, B4 **relata** — e a mudança volta para o dono. Nesta rodada isso
deixa de ser regra de prosa: o worktree de B4 fisicamente não é o de B1.

### Rodada 3 — o gancho e o portão de colisão, dois em paralelo

| agente | tarefas | POSSE (exclusiva) |
|---|---|---|
| **B6 — o dono do gancho** | I11, I12, I13, I14 | `scripts/hooks/pre-commit`; `scripts/portoes.sh` (novo); `.pre-commit-config.yaml`; `tests/unit/portao_o_gancho_cabe_no_teto.py` (novo) |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| **B7 — o dono da colisão** | I15, I16 | `scripts/check_colisao_de_sprints.py` (novo); `tests/unit/portao_a_colisao_de_sprints_morde.py` (novo); o **frontmatter** das sprints — uma por vez, no despacho |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**I16 toca `despachar-agente.sh`, que é de B1.** Por isso é rodada 3, com B1 já  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
fechado: a alteração é de **três linhas** e o dono do arquivo está declarado no
frontmatter dela. Se B1 ainda estiver aberto, B7 relata.

### Rodada 4 — o olho, sozinho

| agente | tarefas |
|---|---|
| **B8 — o dono do painel** | I17, I18 — `scripts/gerar-painel.py` e `docs/data/painel-cache.json` |

**Último de propósito:** a seção "em voo" só tem o que mostrar depois que I1, I4
e I7 estiverem produzindo estado. E é a peça que a próxima sessão abre primeiro.

### O que quebra se alguém mexer sozinho

| gancho | quem depende | o que acontece se ignorar |
|---|---|---|
| `despachar-agente.sh` escreve o `.envrc-voo` | **todo agente de toda onda** | sem o `PYTHONPATH`, o agente mede a árvore do vizinho e não sabe (M3) |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| `bancada.sh exigir` é chamado de dentro dos caminhos | as 15 sprints que precisam do daemon | um agente para o daemon debaixo da mão dela no meio da medição de rádio |
| `costurar.sh` é o único caminho para `onda/atual` | as 22 sprints | vinte branches órfãs — a leva de perfis de 05/08 multiplicada por vinte |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| o gancho da camada 1 roda em **todo** commit | toda a casa | teto estourado → alguém desliga → protege menos que nenhum |

---

## 5. As tarefas

**Vinte.** Nenhuma toca a tela do produto — ver o carimbo de cada uma.

---

### I20 — Os três vermelhos do HEAD saem primeiro *(rodada 0, quem coordena)*

**Arquivos:** `docs/protocol/ipc-unix-socket.md:87`;
`docs/process/PRE-REGISTRO-VIES-01-o-teste-contra-o-nosso-proprio-trabalho.md:52`.

**O conserto:** `4911` vira `4931` (M7). E a linha 52 ganha `noqa-acento` — o
verbo *medir* no imperfeito está certo, o validador é que não o conhece.

**Por que é a tarefa zero:** a camada 1 do gancho (I11) inclui os dois portões
de 0,06 s e 0,04 s. Nascer reprovando é nascer desligada.

**A mordida:** os dois portões saem de rc=1 para rc=0, e um teste do I12 os
inclui na lista da camada 1 — arranque a correção e o gancho barra o commit
seguinte nomeando o arquivo e a linha.

**Custo:** 10 min. **Carimbo:** documentação; **não toca a tela.**

---

### I1 — O despachante: uma árvore por agente, e o prompt nasce do disco *(B1)*

**Arquivo:** `scripts/despachar-agente.sh` (novo, ~120 linhas).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** `scripts/despachar-agente.sh <SPRINT> <AGENTE>` faz quatro
coisas e imprime uma quinta.

1. `git worktree add -b voo/<sprint>-<agente> ../hefesto-voo/<sprint>-<agente> dev`
   — **0,18 s e 59 MB, medido** (M1). Fora da árvore dela.
2. Escreve `<wt>/.envrc-voo` com `PYTHONPATH=<wt>/src` e
   `PYTEST_ADDOPTS=-p no:cacheprovider` — **as duas armadilhas medidas**
   (M3, e a ausência de `cache_dir` em `pyproject.toml:136`), resolvidas antes
   de o agente nascer, nunca por ele lembrar.
3. Lê `scripts/bancada.sh status` (I4) e a posse declarada da sprint (I15).
4. Recusa sprint sem frontmatter (I16) e caminho inexistente (I3).
5. **Imprime o preâmbulo do prompt do agente:** o caminho da árvore dele, a
   linha exata de `PYTHONPATH`, o que ele possui, **o que ele não toca**, o
   estado da bancada, e o comando único de fechamento (`scripts/costurar.sh`).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**É aqui que o gesto dela funciona.** Depois do `/clear`, o Claude novo não
precisa saber nada: roda o despachante e cola o que ele imprime. O contexto do
agente passa a ser **gerado do disco**, não lembrado por uma pessoa — que é a
raiz das três falhas, dita ao contrário.

**A restrição que não é nossa, é do git** (M5): `dev` só existe em check-out
numa árvore, então a branch é sempre `voo/*` e o alvo é `onda/atual`.

**A mordida — o isolamento de índice:** dois worktrees dublês; `git add -A` no
A; `git status --porcelain` no B continua **vazio**, e o da árvore principal
também. Aponte os dois dublês para a mesma árvore e o teste reprova. *(Já
reproduzido em 24/08 — M2.)*

**Custo:** ~120 linhas, meio dia. Runtime **0,18 s e 59 MB por agente**: vinte
agentes são 3,6 s e 1,2 GB. **Carimbo:** **não toca a tela.**

---

### I2 — O portão da armadilha do editable *(B4)*

**Arquivo:** `tests/unit/portao_o_agente_mede_a_propria_arvore.py` (novo).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** o portão cria um worktree dublê, aplica o `.envrc-voo` que o
despachante escreveria, importa `hefesto_dualsense4unix` e exige que
`__file__` esteja **dentro** do worktree.

**Por que é portão e não nota no documento:** M3 mostra que sem `PYTHONPATH` o
import sai em `/mnt/Apate/.../src` — a árvore do vizinho. **É a F2
ressuscitada dentro da própria cura**, e uma nota em prosa não a pega.

**A mordida:** arranque a linha de `PYTHONPATH` do despachante. O teste reprova
**nomeando o caminho da árvore principal** — não "falhou", mas *"o agente
importou `/mnt/Apate/.../src`, que não é a árvore dele"*. Devolva.

**O dublê tem de saber recusar** (A2): exercite os dois lados, com e sem a
variável, como a M3 fez. Régua que só sabe passar não é régua.

**Custo:** ~60 linhas, 2 h. **Carimbo:** **não toca a tela.**

---

### I3 — O caminho morto sai rc=1 nomeando *(B1)*

**Arquivo:** `scripts/despachar-agente.sh`.  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** despachar sprint inexistente sai **rc=1 imprimindo o caminho
que procurou**. E `--limpar` roda `git worktree prune` e remove os worktrees
cuja branch já entrou em `onda/atual`.

**A cicatriz:** `validar-acentuacao.py --check-file` devolve **rc=0 em silêncio**
contra arquivo que não existe. Um despachante com o mesmo defeito criaria
worktree para uma sprint que ninguém escreveu, e o agente descobriria sozinho,
tarde.

**A mordida:** `despachar-agente.sh SPRINT-QUE-NAO-EXISTE A1` → rc=1 e o caminho
na saída; e **nenhum worktree criado** (`git worktree list` inalterado).
Arranque a checagem e o teste vê o worktree órfão aparecer.

**Custo:** ~25 linhas, 1 h. **Carimbo:** **não toca a tela.**

---

### I4 — O semáforo da bancada: PID vivo + teto de tempo *(B2)*

**Arquivo:** `scripts/bancada.sh` (novo, ~70 linhas).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** um JSON em `${XDG_RUNTIME_DIR}/hefesto-bancada.json` —
**não versionado**, porque estado transitório em git vira commit de carona, que
é a F1 pela porta dos fundos — com `{pid, quem, motivo, desde, expira_em}`.

- `reservar "medição de BT" [--horas 4]` — grava o PID do shell dela e um teto.
- `status` — uma linha. **Livre se o PID morreu OU se passou de `expira_em`.**
  Duas provas de vida independentes, nenhuma exigindo que alguém lembre de
  liberar.
- `exigir` — rc=1 com o motivo e a hora; é o que todo caminho que para o daemon,
  escreve no hidraw ou chama `systemctl` invoca primeiro (I6).
- `liberar`.

**O teto de tempo é a lição do `btmgmt` sem adaptador:** o que não volta sozinho
trava a casa para sempre. **Como o agente descobre sem perguntar a ninguém:** o
despachante já imprimiu o estado no preâmbulo dele, e `bancada.sh status`
responde de qualquer worktree, porque o script é versionado e viaja junto.

**A mordida — e ela é a prova de ausência de órfão:** reserve, mate o PID
detentor com `kill -9`, e `status` volta a dizer **livre** sem intervenção
nenhuma. Arranque a checagem de PID e o teste reprova: **a bancada fica travada
para sempre**, que é exatamente o trinco que o §3 manda não construir.

**Custo:** ~70 linhas, 2 h 30. Runtime desprezível. **Carimbo:** **não toca a
tela.** **Tem de existir antes do gesto dela** — é a peça que transforma *"vou
medir BT enquanto os agentes rodam"* de torcida em garantia.

---

### I5 — O portão do semáforo, com as duas provas de vida *(B4)*

**Arquivo:** `tests/unit/portao_a_bancada_nao_deixa_orfao.py` (novo).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** três casos, e os três com dublê que sabe recusar.

1. Bancada reservada → `exigir` sai **rc=1** com o motivo e a hora na saída.
2. `kill -9` no detentor → `status` diz **livre**. *(O molde é a M4: o dublê
   declara o próprio PID, e a prova confere com `fuser` antes e depois. As duas
   primeiras versões desta medição foram falsas — o teste tem de nascer com essa
   cicatriz escrita no cabeçalho, ou alguém a repete.)*
3. Relógio adiantado além de `expira_em`, PID **ainda vivo** → `status` diz
   livre.

**A mordida:** arranque a checagem de PID (caso 2) ou a de `expira_em` (caso 3),
uma de cada vez. Cada arranque tem de reprovar **um caso só** — se arrancar uma
reprovar as duas, as provas de vida não são independentes e a peça está errada.

**Custo:** ~80 linhas, 2 h 30. **Carimbo:** **não toca a tela.**

---

### I6 — O `exigir` entra nos caminhos, não fica no documento *(B2)*

**Arquivos:** os pontos de chamada que param o daemon, escrevem no hidraw ou
chamam `systemctl` — levantados pelo próprio B2 e **declarados no relatório
dele**, um por um.

**O conserto:** cada um desses caminhos chama `bancada.sh exigir` antes de agir,
e **desiste com motivo** se a bancada estiver reservada.

**Por que é tarefa separada de I4:** *"a casa sabe e o produto não faz"* é o
defeito mais caro daqui. Um `bancada.sh` perfeito que ninguém chama é a cura  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
escrita e nunca ligada, de novo — como o sanitizador de M6.

**A mordida:** com a bancada reservada, o caminho que para o daemon recusa
nomeando quem reservou e até quando. **Arranque a chamada de `exigir` de um
desses caminhos e o portão reprova nomeando a função** — não o arquivo: a
função, senão a régua passa a valer para o arquivo inteiro e ninguém sabe o que
ela cobre.

**Custo:** ~40 linhas + o levantamento, 3 h. **Carimbo:** **não toca a tela**;
o botão na aba Sistema é de outra onda (§9).

---

### I7 — A costura serializada: `flock` no merge *(B5)*

**Arquivo:** `scripts/costurar.sh` (novo, ~90 linhas).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** roda no worktree do agente e, **sob `flock` em
`.git/hefesto-costura.lock`**:

1. exige a entrega (I9) na árvore;
2. roda a camada de aceite (I13);
3. `git merge --no-ff voo/<...>` em `onda/atual`, numa worktree de integração
   dedicada;
4. **conflito NÃO é resolvido automaticamente** — nada de `-X ours`. Sai rc=1,
   nomeia os arquivos e escreve o conflito na entrega.

`dev` recebe `onda/atual` **por decisão dela ou da sessão de medição**, num
merge só, visível. **Agente nenhum toca a árvore dela** — e M5 garante isso pelo
git, não pela nossa palavra.

**A regra de commit, e ela fica curta porque I1 fez o trabalho:** o agente
commita à vontade dentro do **seu** worktree, `git add -A` incluído, e nunca
escreve em `dev`. O que era proibição que alguém tinha de lembrar virou
impossibilidade física.

**O preço das alternativas, para o registro.** *"Agente não commita"*: o
trabalho morre no `/clear` — já mordeu em 05/08, horas no índice sem commit.
*"Quem coordena commita"*: reintroduz exatamente a pessoa que o `/clear` mata,
que é a falha que estamos curando. **Descartadas pela restrição, não por
gosto.**

**A mordida:** dois processos dublês costurando ao mesmo tempo. **Sem** o
`flock`, um dos dois merges some — medido no molde da M4: 1 de 3 sobreviveu.
**Com** ele, o segundo espera e os dois commits aparecem em `onda/atual` — 3 de
3. **É a F1 renascida na integração, e é o mesmo experimento.**

**Custo:** ~90 linhas, meio dia. **Carimbo:** **não toca a tela.**

---

### I8 — O conflito é barulhento, e o portão cobra isso *(B5)*

**Arquivo:** `tests/unit/portao_a_costura_serializa.py` (novo).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** duas réguas.

1. A serialização do I7 (dois processos, os dois commits sobrevivem).
2. **O conflito add/add real:** dois worktrees criam
   `src/hefesto_dualsense4unix/app/fatos_do_mapa.py` com conteúdos diferentes —  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
   **o caso literal de PAREAMENTO×Z6** (M11). A segunda costura tem de sair
   **rc=1 nomeando o arquivo**.

**Se a costura "resolver sozinha", reprova.** Conflito barulhento é o produto
desejado: é a F3 deixando de ser silenciosa.

**A mordida:** ponha `-X ours` no `git merge` do I7. A régua tem de reprovar
dizendo que a costura escolheu um lado sem avisar. Devolva.

**Custo:** ~90 linhas, 3 h. **Carimbo:** **não toca a tela.**

---

### I9 — A entrega é condição da costura *(B5)*

**Arquivo:** `scripts/costurar.sh` (o bloco de entrega, ~40 linhas).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto, e é de posição, não de conteúdo:** `costurar.sh` recusa a branch  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
cujo worktree não tenha
`docs/process/agentes/<AAAA-MM-DD>/<sprint>-<agente>.md`, e **chama
`scripts/sanitizar_saida_de_agente.py` ele mesmo**. O agente nunca precisa saber
que o sanitizador existe.

**O princípio:** ponha o registro no único momento em que o agente quer alguma
coisa — que a obra dele entre. **Gatilho no desejo, não na disciplina.** É a
resposta direta à M6: a pasta não apodreceu por desleixo, nasceu sem gatilho.

**A mordida, e ela é de segurança:** plante `AC:A7:F1:23:45:67` numa entrega <!-- endereco-de-mentira: fixture da mordida de segurança; OUI de fabricante com sufixo inventado, não é aparelho de ninguém -->
dublê. A costura tem de **recusar** — não mascarar, **recusar**, como o
sanitizador já faz com segredo. Arranque a chamada do sanitizador e
`test_saida_de_agente_sanitizada.py` reprova.

**Isto não é zelo.** Foi por `docs/process/**` — isento do portão de anonimato —
que a senha sudo dela entrou no repositório em 26/06 e chegou a cinco commits
públicos.

**Custo:** ~40 linhas, 2 h. **Carimbo:** **não toca a tela.**

---

### I10 — O gabarito de quatro cabeçalhos *(B5)*

**Arquivo:** `docs/process/agentes/README.md`.

**O conserto:** o gabarito é curto de propósito, porque **o agente paga token
para lê-lo**:

- **o que mudou**
- **qual mordida prova**
- **o que NÃO verifiquei**
- **o que sobrou para o próximo**

Quatro cabeçalhos, obrigatórios por régua. Entrega sem um deles: **rc=1
nomeando o que falta.**

**Por que "o que NÃO verifiquei" é obrigatório e não opcional:** é a régua da
casa contra o agente que afirma com confiança o que não existe. `NÃO VERIFICADO`
é muito preferível a chute, e um cabeçalho vazio é uma pergunta feita.

**A mordida:** entrega dublê sem o terceiro cabeçalho → rc=1 nomeando-o.
Arranque a checagem e o dublê passa.

**Custo:** ~30 linhas de prosa + 20 de régua, 1 h 30. **Carimbo:**
documentação; **não toca a tela.**

---

### I11 — O gancho, camada 1, teto de 15 s *(B6)*

**Arquivo:** `scripts/hooks/pre-commit`.

**O conserto:** a camada 1 passa dos dois portões de hoje (0,164 s) para
**dezesseis**, com os incrementais no lugar dos `--all`:

painel · mapa · **contrato-IPC** · **citações-de-linha** · test_data ·
version-consistency · ícones · curvas · palavra-de-tela · paridade-de-transporte
· paridade-de-empacotamento · anonimato · `ruff` · `mypy` quente · **glifos
incremental** · **acentuação incremental**.

**Por que incremental muda tudo, medido por mim (M7):** `acentuação --all` custa
**37,03 s**; por `--check-file` custa fração disso. `referências-docs` fica
**fora** da camada 1 — 3,67 s e **não encolhe** com incremental.

**Dois fatos errados que saem junto.** A lista do `CLAUDE.md` mistura `python3`
pelado com `.venv/bin/python`: `gerar-tabela-de-curvas.py --check` quebra com
`ModuleNotFoundError: pydantic` no primeiro e passa no segundo. **Vermelho falso
de instrumento**, e a lista se corrige — não se anota ao lado.

**A cautela que a M7 obriga:** a acentuação incremental entra **com a lista de
falsos positivos conhecidos**, começando por *media* (verbo). <!-- noqa-acento --> Ela barrou um
commit correto hoje. Régua nova que barra trabalho certo é régua que alguém
desliga na segunda-feira.

**A mordida:** plante 3 erros de acentuação num arquivo staged. O gancho reprova
**nomeando as três linhas**, em menos de 10 s. E plante o *media* do `f143bb7`: <!-- noqa-acento -->
o gancho tem de **deixar passar**.

**Custo:** ~60 linhas, meio dia. Runtime: **+7 s por commit**. **Carimbo:**
**não toca a tela.**

---

### I12 — O teto é portão, não intenção *(B6)*

**Arquivo:** `tests/unit/portao_o_gancho_cabe_no_teto.py` (novo).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** um teste cronometra o gancho num repositório dublê e **reprova
acima de 15 s**. E confere que os dois portões do I20 estão na lista.

**Por que existe:** está escrito no cabeçalho do próprio gancho — *"gancho que
demora sete minutos é gancho que a pessoa desliga, e um gancho desligado protege
menos que nenhum"*. Hoje essa frase é comentário; vira régua.

**A mordida:** acrescente `validar-acentuacao.py --all` (37,03 s, medido) à
camada 1. O teste reprova nomeando o portão que estourou o teto. Devolva.

**Custo:** ~40 linhas, 1 h 30. **Carimbo:** **não toca a tela.**

---

### I13 — A camada 2, e a suíte devolvida ao agente *(B6)*

**Arquivo:** `scripts/portoes.sh` (novo).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** `scripts/portoes.sh --aceite`, chamada por `costurar.sh` no  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
worktree do agente: soma `validar-referencias-docs.py` (**3,67 s**) e
`shellcheck` (arranque fixo) → ~15-21 s. **Mais a suíte, que volta a ser do
agente porque a árvore dele parou de se mexer.**

**A R2 morre aqui, e é o maior desbloqueio da leva:** hoje **17 dos 22 aceites**
não podem ser fechados por ninguém além de quem coordena. A justificativa do
uinput caducou em 20/08 (a cura está armada em `conftest.py:1881`); a
justificativa que restava era árvore em movimento, e I1 a mata.

**A suíte concorrente, com o que está medido:** `-p no:cacheprovider` já vem do
`.envrc-voo` — o `.pytest_cache` na raiz é a única colisão real, porque
`pyproject.toml:136` **não define `cache_dir`** (conferido). O berço de `/tmp` já
é por PID. Falta a CPU: um pool de **duas fichas** por `flock` em dois
arquivos-slot, porque 398 s já foi medido como **piso** com dois workflows
disputando 16 núcleos.

**A mordida:** três agentes pedem ficha ao mesmo tempo; o terceiro **espera** e
diz que está esperando. Arranque o pool e os três rodam juntos — a régua reprova
comparando o tempo do terceiro com o piso.

**Custo:** ~40 linhas + 25 do pool, 3 h. **Carimbo:** **não toca a tela.**

---

### I14 — Duas listas de portão viram uma *(B6)*

**Arquivos:** `.pre-commit-config.yaml`; `scripts/hooks/pre-commit`.

**O conserto, e a escolha é binária:** ou o framework `pre-commit` entra no
`install.sh` **sem flag** (toda cura entra no install, nada opt-in), ou os dez
portões do `.yaml` migram para `scripts/hooks/pre-commit` e **o `.yaml` some**.

**O fato que decide:** `which pre-commit` → **not found**, e `instalar-hooks.sh`
só faz `ln -sf` (M9). **Os dez não rodam.** Duas listas para a mesma coisa é o
defeito que a regra do fato-errado existe para matar.

**A mordida:** um teste exige que os dois conjuntos sejam **idênticos**, ou que
só um exista. Acrescente um `id:` ao `.yaml` sem pôr o portão no gancho: reprova
nomeando o que ficou de fora.

**Custo:** ~50 linhas, 2 h. **Carimbo:** **não toca a tela.**

---

### I15 — O frontmatter, e o portão de colisão *(B7)*

**Arquivos:** `scripts/check_colisao_de_sprints.py` (novo, ~150 linhas); o topo  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
de cada sprint.

**O conserto:** um bloco YAML no topo de cada sprint — **um formato, não dez**
(M10):

```yaml
posse:
  Z1-A: [src/hefesto_dualsense4unix/app/textos_de_aplicacao.py]
cria:    [scripts/gerar-fatos-de-tela.py]
bancada: false        # daemon vivo? hidraw? btmon?
depois_de: [ONDA0-Z2]
nao_toca: [src/hefesto_dualsense4unix/app/daemon_actions.py]
```

`check_colisao_de_sprints.py` cruza as sprints **que têm frontmatter**, duas a  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
duas, e reprova par com interseção sem `depois_de` nem `nao_toca` declarados.

**`cria:` é o campo caro, e é o único que pega a duplicata:** os quatro módulos
de PAREAMENTO×Z6 **não existem no disco** (M11), e nenhum `grep` acha colisão em
arquivo que ainda não existe.

**Ele nasce reprovando ZERO, e é de propósito.** Sprint sem frontmatter entra
numa **lista de dívida**, não numa reprovação. Um portão que reprova as 22 de
uma vez é um portão que alguém desliga na segunda-feira, e a primeira reação
seria `--no-verify`.

**O limite da régua, declarado:** frequência de citação **não é posse**. A Z7
cita `daemon_actions.py` numa coluna *"NÃO toca"*, e uma régua ingênua conta
isso como reivindicação.

**A mordida — e é a mais exigente da leva:** rodado contra as sprints já
anotadas, tem de acusar **exatamente** os pares que o conferente humano achou à
mão:

| par | arquivos |
|---|---|
| Z1×Z2 | `textos_de_aplicacao.py`, `lightbar_actions.py`, `triggers_actions.py`, `rumble_actions.py` |
| Z1×Z5 | `ipc_handlers.py` |
| Z5×Z7 | `state_store.py` |
| Z0×INÍCIO | `retratar_abas.py` |
| PAREAMENTO×Z6 | os quatro módulos que não existem |

**Se acusar menos que a mão, a régua não morde e não vale nada.** E arranque o
campo `cria:`: o par PAREAMENTO×Z6 **desaparece** — é a mordida que prova qual é
o campo caro.

**Custo:** o portão, ~150 linhas + teste, meio dia. O frontmatter, ~15 min por
sprint × 23 ≈ 5 h — **mas pagas uma a uma no despacho**, nunca de uma vez.
**Carimbo:** **não toca a tela.**

---

### I16 — A pressão fica no despacho, não na reprovação *(B7)*

**Arquivo:** `scripts/despachar-agente.sh` (três linhas; o dono é B1 — ver §4).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O conserto:** o despachante **recusa sprint sem frontmatter**, com a mensagem
que diz o que falta e onde. Um por vez, no momento em que alguém já ia ler
aquela sprint de qualquer jeito.

**A mordida:** despachar uma sprint sem frontmatter → rc=1 e **nenhum worktree
criado**. Arranque a checagem e o agente nasce sem saber o que possui — que é a
F3 de novo, agora com o desperdício de um worktree.

**Custo:** ~15 linhas, 45 min. **Carimbo:** **não toca a tela.**

---

### I17 — Todo número medido carrega a árvore em que foi medido *(B8)*

**Arquivo:** `scripts/gerar-painel.py:204-248` (`roda_os_caros`) e
`docs/data/painel-cache.json`.

**O conserto:** o cache ganha **`head`** e **`sujos`** ao lado de `medido_em`.
Se o `head` gravado ≠ HEAD atual, **ou** se `sujos > 0` na hora da medição, o
painel pinta o número como **VELHO** e não o publica como veredito.

**O dado já existe:** `estado_do_git()` (`:183-199`) devolve `head` e `sujos` e
os imprime no rodapé. **Ele só não acompanha o número caro** — e o comentário de
`:204` já registra o `passed: None` de medir árvore em movimento, ou seja, o
desenho já sabia.

**A mordida:** grave um número no cache, commite qualquer coisa (o HEAD muda),
regenere. O painel mostra o número **carimbado como velho**. Arranque o carimbo
e o teste reprova **reproduzindo o caso literal de 22:16** (M8): `ruff:
ok=false` publicado como vivo enquanto `ruff check src/ tests/` devolve `All
checks passed!`.

**Custo:** ~50 linhas, 2 h. **Carimbo:** o painel é ferramenta interna, **não é
a tela do produto**.

---

### I18 — A seção "em voo", inteiramente derivada *(B8)*

**Arquivo:** `scripts/gerar-painel.py`.

**O conserto:** uma seção nova, **sem um único campo de entrada**:

| coluna | de onde vem |
|---|---|
| quem existe | `git worktree list --porcelain` |
| que sprint | a branch `voo/*` de cada um |
| quanto mexeu | `git -C <wt> status --porcelain \| wc -l` |
| a bancada | `bancada.sh status` |
| a CPU | as fichas de suíte em uso |
| o que já entrou | `git log onda/atual` |

**É o que separa esta peça da pasta de 06/08.** Se um agente morrer, a linha
dele some no próximo `git worktree prune`, sem ninguém saber que ele existiu.

**A mordida:** crie dois worktrees dublês, um com 3 arquivos sujos. A seção
lista os dois, com 3 e 0. Remova um e regenere: **some sozinho**. **Se algum
campo dessa seção precisar ser escrito à mão, a peça está errada** — e é a pasta
de 06/08 de novo.

**Custo:** ~50 linhas, 2 h. Runtime: +0,1 s no gancho (o painel já custa
**0,08 s**, medido). **Carimbo:** ferramenta interna; **não toca a tela.**

---

### I19 — O `COMO-REGER-AGENTES` encolhe *(B3)*

**Arquivo:** `docs/process/COMO-REGER-AGENTES.md`.

**O conserto, e ele é por remoção:**

| hoje | depois |
|---|---|
| **R1** — posse de arquivo, em prosa | `despachar-agente.sh` — a posse é a árvore |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| **R2** — a suíte é de quem coordena | **MORRE.** Ver abaixo. |
| **R3** — a bancada é dela | `bancada.sh` |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| **R4** — foto e portão no fim | `costurar.sh` (I9 + I13) |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**A R2 é fato errado e se SUBSTITUI, não se acumula.** Ela é justificada por
*"1.289 nós uinput num dia"* — e **isso caducou em 20/08**, com a cura em
`conftest.py:1881`. A justificativa que restava era árvore em movimento, e o I1
a mata. Manter a frase ao lado da cura obriga a próxima pessoa a escolher entre
duas afirmações, que é o defeito que a regra existe para matar. **Sai de todos
os lugares onde aparece**, não só de onde foi notada.

**O que NÃO sai:** as armadilhas **A1 a A6** são decisão medida — cada uma é um
defeito real com cicatriz. Ficam, e a **A2** ganha a cicatriz nova da M4: o
dublê que só sabe **falhar** mente tanto quanto o que só sabe passar.

**A mordida:** `grep -rn "1.289\|1289 nós uinput" docs/` tem de voltar **vazio**
fora das notas datadas. Se voltar com resultado, a substituição foi pela metade.
Mais `validar-referencias-docs.py --all` (3,67 s) e
`validar-acentuacao.py --all`.

**Custo:** ~60 linhas, a maioria **removida**. 2 h. **Carimbo:** documentação;
**não toca a tela.**

---

## 6. A bancada, e o que o Bluetooth bloqueia

**Esta sprint inteira é isenta de bancada.** Nenhuma das vinte tarefas para o
daemon, abre hidraw, chama `systemctl` ou toca `btmon`/`bluetoothctl`/`rfkill`.
Ela roda a plena velocidade enquanto ela mede rádio — e é a **única** leva de que
isso se pode dizer sem medir, porque nenhuma linha dela fala com aparelho.

**A contrapartida, que é o produto desta sprint:** hoje **15 das 22 sprints
precisam do daemon vivo, 11 abrem hidraw e 2 colidem de frente com a medição de
BT dela**, e nada as impede de agir no meio da medição. Depois do I4 + I6, o
caminho recusa com motivo e hora — e o agente **espera e diz que está
esperando**, em vez de improvisar outro caminho, que é como se inventa medição
falsa.

**Nenhuma tarefa desta leva pode ser usada para afirmar coisa alguma sobre
transporte.** Quem responde por cabo e rádio é o `mapa-controles.csv` e o portão
de paridade. Aqui não se mede aparelho.

---

## 7. A pergunta difícil: o agente que morre sem liberar a posse

**Ela tem resposta, e a resposta é que ninguém precisa liberar nada.** Foram dez
agentes mortos por Wi-Fi em 23/08 — este desenho tinha de sobreviver a isso ou
não valia ser escrito.

| o que ele segurava | quem solta | como |
|---|---|---|
| **a árvore** (`voo/<sprint>-<agente>`) | **o git** | o worktree fica lá, inerte. Ninguém mais o está escrevendo, então ele não atrapalha nada. `despachar-agente.sh --limpar` roda `git worktree prune` e remove os já costurados. **O trabalho commitado dentro dele sobrevive** — e é por isso que o agente commita (I7). |
| **a bancada** | **o kernel** | o PID morreu → `status` diz **livre** na próxima leitura. E se o processo virar zumbi, o `expira_em` responde por cima. **Duas provas de vida independentes** (I4/I5). |
| **o trinco da costura** | **o kernel** | `flock` é liberado quando o último descritor fecha, e o descritor fecha quando o processo morre. **Medido, com `kill -9`** (M4). |
| **a ficha de suíte** | **o kernel** | mesmo mecanismo (I13). |
| **a linha no painel** | **ninguém** | ela é derivada (I18). Some sozinha no próximo `prune`, sem que nada precise ser apagado. |

**A regra, e é a que separa este desenho de um lock file:**

> **Se a liberação depende de um `finally` do agente, o desenho está errado.**

**O que sobra, honestamente.** Um worktree órfão custa **59 MB** e um nome na
lista. Vinte órfãos custam 1,2 GB e um `--limpar`. **É o pior caso, e ele é
barato** — comparado com a alternativa medida, que é um registro à mão
desatualizado no terceiro despacho, dando confiança falsa (M6).

---

## 8. O aceite

### 8.0 As duas decisões dela, antes de qualquer despacho

1. **PAREAMENTO-01 e Z6 são uma sprint ou duas?** Os dois planos mandam criar os
   **mesmos quatro módulos**, que não existem (M11); Z6 cita PAREAMENTO 17
   vezes, PAREAMENTO cita Z6 zero; e o `SPRINT_ORDER` a lista em dois lugares
   (`:327` e `:391`). **Vale 17 agentes despachados na mesma obra.** Minutos de
   leitura.
2. **`main.glade` declara faixa de linha, ou vira recurso de bancada?** Quinze
   sprints o citam e nenhuma declara faixa (M12). Conflito de merge em XML
   gerado é irrecuperável na prática — o worktree **não salva este caso**. Ou o
   frontmatter declara faixa, ou uma sprint por vez o edita.

### 8.1 Os comandos

```sh
# 1. o passo zero: os vermelhos do HEAD (I20)
python3 scripts/gerar-contrato-ipc.py --check        # tem de virar rc=0
python3 scripts/validar-citacoes-de-linha.py --all   # tem de virar rc=0
python3 scripts/validar-acentuacao.py --all          # tem de virar rc=0

# 2. o despachante e o semáforo — o mínimo que faz o gesto dela funcionar
scripts/despachar-agente.sh ONDA0-Z0 A1              # imprime o preâmbulo
scripts/despachar-agente.sh SPRINT-INEXISTENTE A1    # rc=1, nomeia o caminho
scripts/bancada.sh reservar "medição de BT" --horas 4
scripts/bancada.sh status                            # uma linha
scripts/bancada.sh exigir                            # rc=1 com motivo e hora

# 3. as réguas mordem. SÓ o próprio escopo — a suíte inteira, nunca
PYTHONPATH=$PWD/src .venv/bin/python -m pytest -p no:cacheprovider -q \
  tests/unit/portao_o_agente_mede_a_propria_arvore.py \
  tests/unit/portao_a_bancada_nao_deixa_orfao.py \
  tests/unit/portao_a_costura_serializa.py \
  tests/unit/portao_o_gancho_cabe_no_teto.py \
  tests/unit/portao_a_colisao_de_sprints_morde.py

# 4. o portão de colisão acusa o que a mão achou
.venv/bin/python scripts/check_colisao_de_sprints.py

# 5. a substituição foi INTEIRA, não pela metade
grep -rn "1289 nós uinput\|1.289 nós uinput" docs/    # vazio fora de nota datada
python3 scripts/validar-referencias-docs.py --all

# 6. a árvore volta como estava
git worktree list          # só a principal, mais os voos abertos de propósito
```

### 8.2 As mordidas nomeadas, e nenhuma tarefa fecha sem a sua

1. **I1** — `git add -A` no worktree A; `git status` de B e da árvore principal
   continuam vazios. *(Já reproduzido — M2.)*
2. **I2** — arranque o `PYTHONPATH` do despachante: o teste reprova **nomeando
   `/mnt/Apate/.../src`**, a árvore do vizinho. *(Já reproduzido — M3.)*
3. **I5** — `kill -9` no detentor da bancada: `status` volta a dizer **livre**.
   Arranque a checagem de PID e a bancada trava para sempre. *(Já reproduzido —
   M4.)*
4. **I7/I8** — dois processos costurando: **sem** `flock`, 1 de 3 sobrevive;
   **com**, 3 de 3. E conflito add/add em `fatos_do_mapa.py` → rc=1 nomeando o  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
   arquivo. *(A serialização já foi reproduzida — M4.)*
5. **I9** — `AC:A7:F1:23:45:67` numa entrega dublê faz a costura **recusar**. <!-- endereco-de-mentira: fixture da mordida de segurança; OUI de fabricante com sufixo inventado, não é aparelho de ninguém -->
6. **I12** — ponha `validar-acentuacao.py --all` (37,03 s) na camada 1: o teste
   reprova nomeando o portão que estourou o teto de 15 s.
7. **I15** — arranque o campo `cria:`: o par PAREAMENTO×Z6 **desaparece**.
8. **I17** — arranque o carimbo de HEAD: o painel volta a publicar o `ruff:
   ok=false` de 22:16 como veredito vivo.

### 8.3 O aceite de olho, que é o único que ela dá

**Duas telas, e as duas são de texto.** A saída de
`scripts/despachar-agente.sh` — *"este preâmbulo é suficiente para um Claude que  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
acabou de dar `/clear` despachar um agente sem saber de mais nada?"* — e a seção
**"em voo"** do painel, com a pergunta: *"isto responde quem está tocando o quê
agora?"*, que hoje é impossível responder por qualquer meio.

### 8.4 A regra de corte

**I1 + I4 é o mínimo que faz o gesto dela funcionar.** Se o dia acabar depois do
segundo, a leva já valeu: as duas falhas que custaram rodada em 23/08 (F1 e F2)
estão mortas, e ela pode medir Bluetooth com agentes rodando.

**A ordem:** I20 e as decisões do §8.0 (30 min) → I1 (meio dia) → I4 (2 h 30) →
I7+I9+I10 (meio dia) → I11+I13 (meio dia) → I15+I16 (meio dia) → I17+I18 (4 h).

O I15 é **deliberadamente quinto, contra a intuição**: depois do I1, colisão já
é conflito barulhento, não perda silenciosa. Ele deixou de ser urgente e virou
economia. **A decisão da duplicata, essa sobe para o passo zero** — é dela, custa
minutos, e vale 17 agentes.

---

## 9. O que fica aberto, e de quem é

### O que eu NÃO verifiquei, declarado

a. **Não rodei a suíte inteira** — é de quem coordena, hoje ainda. Um portão
   rodado num worktree dublê deu **1 falha em 31**, e eu **não sei** se ela
   existe também na árvore principal ou se é do HEAD daquele worktree. **Confira
   antes de culpar o worktree.**

b. **Não medi dois `pytest` concorrentes de verdade.** O pool de duas fichas do
   I13 é **desenho, não medição** — o número que o sustenta (398 s como piso com
   dois workflows) é de 23/08 e foi medido de outro jeito.

c. **Não medi `costurar.sh` sob contenção real.** O `flock` está medido (M4); o  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
   tempo do merge não. Os números de custo do I7 são estimativa.

d. **Não medi o gancho da camada 1 montado.** Os dezesseis portões estão
   cronometrados **um a um** por mim (M7); a soma tem arranque de processo que
   não medi junto. O teto de 15 s do I12 existe justamente para que essa
   diferença apareça na primeira vez em vez da décima.

e. **A árvore andou debaixo de mim enquanto eu media.** Comecei em `f0632cf` e <!-- noqa-acento: verbo medir, imperfeito -->
   terminei em `f143bb7` — três commits de outra sessão entraram no meio, e um
   deles é o que deixou a acentuação vermelha (M7). **Esta sprint foi escrita
   sob a falha que ela cura**, e isso vale como a última prova de que ela é
   necessária.

### O que fica para outra sessão

1. **O botão da bancada na aba Sistema.** `bancada.sh reservar` é linha de
   comando; ela decide vendo, não lendo. **Dono: a onda da aba Sistema**, depois
   do I4. Não é desta leva porque tocaria a tela do produto.
2. **A duplicata PAREAMENTO×Z6 é dela** (§8.0/1). Esta sprint mede e apresenta;
   não decide.
3. **`main.glade`** (§8.0/2) — é o único caso medido em que o worktree **não
   resolve**, e a decisão é de produto.
4. **`.pre-commit-config.yaml`: entra no `install.sh` ou some?** (I14). O
   princípio da casa — *toda cura entra no install, sem flag* — aponta para
   entrar; o custo de uma dependência nova aponta para sumir. **Não decidi, e
   registro que não decidi.**
5. **O falso positivo do validador de acentuação** (M7): *media*, verbo, barra <!-- noqa-acento -->
   texto correto. Consertado por linha com `noqa-acento` no I20; **a régua em si
   continua sem conhecer o verbo**, e a próxima pessoa vai tropeçar nele.
   **Dono: quem for mexer no validador.**
6. **Quantos worktrees a máquina aguenta.** 59 MB e 0,18 s por agente foram
   medidos com **um**; vinte simultâneos não. O número é linear no papel.

---

## Ver também

- [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md) — as quatro regras que esta sprint transforma em quatro comandos, e as armadilhas A1 a A6, que ficam.
- [SPRINT_ORDER §0](../SPRINT_ORDER.md) — a fila em ondas que esta infra existe para executar.
- [COMO-EXECUTAR da aba Configurações](2026-08-21-ABA-CONFIGURACOES/COMO-EXECUTAR.md) — o molde de receita desta casa.
- [ONDA0-Z0](2026-08-24-ONDA0-Z0-A-REGUA-E-A-FOTO-01-cinco-abas-publicam-o-xml-cru.md) — a única frente que já roda enquanto ela mede rádio; depois desta sprint, deixa de ser a única.
- [agentes/README.md](../agentes/README.md) — onde a entrega mora, e o que a impede de vazar.

---

## CONFERÊNCIA INDEPENDENTE — 24/08/2026, por quem coordena

As três medições que sustentam esta sprint foram refeitas por uma segunda mão,
com os comandos abaixo. **A casa exige régua validada contra contagem
independente antes de acreditar nela**, e uma proposta de infra que se apoia em
número errado custa mais que a doença que cura.

| o que o desenho afirma | o que a segunda medição deu | veredito |
|---|---|---|
| `git worktree add` custa 0,222 s | **186 ms** | confere (mesma ordem; a diferença é carga de máquina) |
| o worktree ocupa 59 MB | **59 MB** exatos | confere |
| o `.pth` do editable aponta para a árvore principal | **confere** — `/mnt/Apate/.../src`, caminho absoluto | confere |

**A armadilha do editable foi reproduzida de ponta**, e é ela que decide se a
cura funciona:

```
$ cd <worktree> && .venv/bin/python -c "import hefesto_dualsense4unix as m; print(m.__file__)"
  /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/src/...    ← a árvore do VIZINHO

$ cd <worktree> && PYTHONPATH=<worktree>/src .venv/bin/python -c "..."
  <worktree>/src/hefesto_dualsense4unix/__init__.py             ← a própria
```

**Sem `PYTHONPATH`, o agente na sua própria árvore isolada testa o código do
vizinho achando que testa o seu.** É a Falha 2 escondida dentro do conserto da
Falha 2 — e é por isso que a variável nasce no despachante, com portão próprio,
e nunca na cabeça de quem escreve o prompt.

**O que esta conferência NÃO mediu:** o custo com N worktrees simultâneos (só um
foi criado), o comportamento do `git worktree prune` depois de um agente morto
de verdade, e o tempo do despachante inteiro — que ainda não existe.
