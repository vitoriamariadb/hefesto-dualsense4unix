# O PLANO PARA O OPUS — quatro lotes, uma mesa, e o produto inteiro

**06/09/2026, escrito pelo Fable depois de ler a casa inteira e arrumar a leva.**
Palavra dela: *"Lê tudo. Organiza tudo. corrige as rotas. Deixa o plano pronto e
fácil pro opus apenas seguir ele no ultra code o mais otimizado e correto
possível. a prova de erros."* <!-- noqa-acento: citação literal dela -->

**Este arquivo é a fila. Quem coordena lê a §2 e roda os comandos na ordem.**
Tudo o que precisa de leitura já foi lido: cada sprint aberta tem no topo uma
nota **ROTA CORRIGIDA — 06/09/2026** que vence o corpo dela; o mapa
(`docs/data/mapa-controles.csv`) vence a sprint em informação precisa; a
ordem de precedência está no preâmbulo que todo agente recebe.

---

## 0. O PRODUTO FINAL — a cena que fecha as 24 horas

A definição de pronto é dela, em uma frase: *"migrar tudo do gtk pro html,
adaptando o html pra funcionar pra 4 controles, cada perfil vivo, todas as
features funcionando pra cabo e radio, e cada aba se lembrando das configs de
cada controle dentro do perfil sem que eu precise aplicar ou salvar em cada aba
e por fim tudo funcionando (incluindo a aba de lançadores), de conexão e
afins."* <!-- noqa-acento: citação literal dela -->

Lida como PRODUTO, não como lista de sprints, ela é UMA cena — e a cena está
escrita, gesto a gesto, nas linhas 1-21 do roteiro da
[MESA-DE-QUATRO-01](sprints/2026-09-06-MESA-DE-QUATRO-01-quatro-dualsense-por-cabo-e-por-radio-com-ela.md):
quatro DualSense, dois no cabo e dois no rádio, um jogo aberto pela aba
Lançadores; cada aba mexe NUM controle e o outro não muda; fecha e reabre e nada
se perdeu; um cai e os outros seguem; volta ao mesmo assento; o som e o
microfone têm o nó DAQUELE controle; a luz e o gatilho obedecem no rádio.
**Cada sprint das ondas G-J é um gesto dessa cena.** Nenhuma delas é "feature
solta": a coluna da direita do roteiro diz qual sprint prova qual gesto.

Os seis pontos da frase dela, medidos em 06/09 (o que já existe e o que falta):

| # | o ponto dela | medido | o que falta | sprint |
| --- | --- | --- | --- | --- |
| 1 | migrar tudo do GTK para o HTML | 396 linhas de paridade: 144 IGUAL · 151 DIFERENTE · 59 SÓ NO HTML · **38 FALTA**. A janela GTK saiu do disco (GTK-1/2/3). DIFERENTE conta como migrado (palavra dela, `D-0609-DIFERENTE-E-MIGRADO`) | das 38 FALTA, **22 ela decidiu fora** (§4) e **13 viram 8 sprintes de aba**; 3 são a MESA | JOGAR-OS-SEIS-AVISOS · CONTROLES-OS-TRES-SELOS · GATILHOS-EM-TODOS · ILUMINACAO-O-AVISO-DOS-N · VIBRACAO-O-QUE-SOBROU · CONEXOES-A-LUZ-QUE-NAO-ACENDE · SISTEMA-OS-QUATRO-QUE-FALTAM · PERFIS-O-PRECO-E-O-RADIO |
| 2 | funcionar para 4 controles | P1-P4 na fita, cor por controle, mic por controle, vibração por controle (ONDA F) | o que só quebra com quatro; o assento reservado; o co-op nativo; o controle sem MAC | QUATRO-NA-MESA · RESERVA-DO-POSTO · COOP-QUE-NAO-DESMONTA · COOP-NA-CONEXAO-NATIVA · BORDA-DE-QUEDA · O-CONTROLE-SEM-MAC · QUEM-E-QUEM-02/03/04 |
| 3 | cada perfil vivo | o perfil por controle grava no clique (ONDA 3, 05/09); a fita não mente | o "Todos" escreve a seção global e o 3º herda; a trava do LED; o motor do arranjo | GATILHOS-EM-TODOS · A-TRAVA-DO-LED-NAO-SOLTA · MOTOR-DO-ARRANJO |
| 4 | todas as features, cabo E rádio | o mapa: 265 células `aciona=não` eram "ninguém mediu", não "não funciona" — 156 `nada-a-acionar` · 109 `nao-medido` | o som pelo rádio (o mapa TEM o payload — `audio.alto_falante@dualsense.radio_offset`, duas fontes); o mudo no rádio; a luz no rádio (dela); a bateria parada | SOM-QUE-SAI · O-ALTO-FALANTE-VIRTUAL · MIC-BT-DONO · BATERIA-PARADA · LUZ-NO-RADIO (ela) · SPECS-A-PROCEDENCIA |
| 5 | cada aba lembra por controle, sem Salvar | a02/a03/a04/a05 escrevem por controle (medido: 15 · 1 · 0 · 7 escritas por controle; a04 e a05 escrevem pelo pacote do perfil) | provar na mesa (linha 13) — nenhuma sprint nova: o que falta é olho dela | MESA-DE-QUATRO-01 linha 13 |
| 6 | tudo funcionando, lançadores, conexão | a aba 07 tem 14 gestos e 12 gravam; a 08 tem 17 e 9 gravam | o teclado que sobrevive ao daemon e diz como sair; o daemon acordado; o engasgo Vulkan; os externos nos cards | O-TECLADO-QUE-SOBREVIVE-AO-DAEMON · O-TECLADO-QUE-NAO-DIZ-COMO-SAIR · DAEMON-ACORDADO · ENGASGO-VULKAN · EXTERNOS |

---

## 1. O QUE JÁ ESTÁ PRONTO PARA VOCÊ — e não precisa refazer

* **34 sprints abertas**, e só elas: `python3 scripts/check_colisao_de_sprints.py --abertas`.
  As outras 582 dizem `estado:` (feita · absorvida · caducou). Colisão de posse: **zero**.
* **Cada aberta tem a rota corrigida no topo** (nota `ROTA CORRIGIDA — 06/09/2026`),
  a `onda:` (G · H · I · J), a `posse:` por arquivo, e `depois_de:` só do que
  ainda está aberto.
* **O mapa não veta mais** (`D-0609-O-MAPA-INFORMA-NUNCA-VETA`): o preâmbulo do
  despachante traz a ordem aparelho > mapa > sprint > lembrança, e o agente que
  parar citando célula do mapa está errado por definição.
* **Onze decisões por delegação** já registradas em `docs/data/decisoes-dela.csv`
  (`D-0609-*`, `quem_decidiu=delegacao`). Não reabra; se uma sprint devolver
  `pergunta`, decida e registre no mesmo molde — ela delega (memória da casa),
  e a única exceção é validação de tela, que vai para a MESA.
* **Dois scripts novos fazem o trabalho repetitivo** e foram ensaiados:
  `scripts/despachar-onda.sh` (N worktrees + `args.json`) e
  `scripts/costurar-onda.sh` (cherry-pick, `estado: feita`, portões, commit).
* **45 portões verdes** em `onda/atual-0609` (a árvore de integração,
  `/mnt/Apate/Desenvolvimento/hefesto-voo/_integra-0609`).

---

## 2. OS QUATRO LOTES — os comandos, na ordem

**Abra a sessão DENTRO de `/mnt/Apate/Desenvolvimento/hefesto-voo/_integra-0609`.**
Os scripts acham a raiz por `git rev-parse --show-toplevel`; rodados na árvore
dela criam a base errada. Todo comando abaixo é daqui. Saída de comando vai
para arquivo, nunca crua no terminal dela.

### 2.0 Antes do primeiro lote (5 min)

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/_integra-0609 && source .envrc-voo
mkdir -p ../_lotes                    # os lotes moram ao lado da árvore
git status --short | wc -l            # tem de ser 0
git log -1 --format='%h %s'           # a arrumação da leva, ou depois dela
python3 scripts/check_colisao_de_sprints.py --abertas | tail -1   # 34 abertas
```

### 2.1 A ordem dos lotes, e por quê

| lote | sprints | quantas | por que juntas |
| --- | --- | --- | --- |
| **LOTE-1** | BORDA-DE-QUEDA-01 · EXTERNOS-01 · A-TRAVA-DO-LED-NAO-SOLTA-01 · O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01 · BATERIA-PARADA-01 · O-ALTO-FALANTE-VIRTUAL-01 · GATILHOS-EM-TODOS-01 | 7 | são as de que a onda H e a I dependem (`depois_de`) |
| **LOTE-2** | COOP-QUE-NAO-DESMONTA-01 · DAEMON-ACORDADO-01 · ENGASGO-VULKAN-01 · QUEM-E-QUEM-02 · QUEM-E-QUEM-03 · VIBRACAO-O-QUE-SOBROU-01 · SISTEMA-OS-QUATRO-QUE-FALTAM-01 · PERFIS-O-PRECO-E-O-RADIO-01 · O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01 · QUATRO-NA-MESA-01 · COOP-NA-CONEXAO-NATIVA-01 · MOTOR-DO-ARRANJO-01 · RESERVA-DO-POSTO-01 · CONTROLES-OS-TRES-SELOS-01 · ILUMINACAO-O-AVISO-DOS-N-01 · PARIDADE-CRUZA-O-MAPA-01 | 16 | o resto da G (sem dependente) mais a H inteira, que só depende do LOTE-1; posse sem colisão entre as 16 |
| **LOTE-3** | O-CONTROLE-SEM-MAC-01 · SOM-QUE-SAI-01 · MIC-BT-DONO-01 · JOGAR-OS-SEIS-AVISOS-01 · CONEXOES-A-LUZ-QUE-NAO-ACENDE-01 | 5 | a onda I: dependem de H |
| **LOTE-4** | QUEM-E-QUEM-04 · PARIDADE-REMEDIR-02 · SPECS-A-PROCEDENCIA-01 | 3 | fecham os números: o CSV da paridade e o mapa recebem o que os lotes 1-3 mediram |

**O CHECKPOINT DO LIMITE SEMANAL, antes de cada lote:** ela lê o uso (`/usage`).
Acima de **70%**, não despache — vá para a §3 com o que está costurado.
Entre 55% e 70% antes do LOTE-2, divida-o em dois (os 8 da G primeiro, os 8 da
H depois, cada um com a sua costura). Cada agente custa; um lote de 16 é a
maior despesa do dia.

### 2.2 Um lote, do despacho à costura (repete quatro vezes)

```bash
# 1. despachar — cria as árvores de onda/atual-0609 e escreve os prompts
bash scripts/despachar-onda.sh LOTE-1 BORDA-DE-QUEDA-01 EXTERNOS-01 A-TRAVA-DO-LED-NAO-SOLTA-01 \
  O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01 BATERIA-PARADA-01 O-ALTO-FALANTE-VIRTUAL-01 GATILHOS-EM-TODOS-01 \
  > ../_lotes/LOTE-1.despacho.txt 2>&1; tail -3 ../_lotes/LOTE-1.despacho.txt
# 2. os argumentos do workflow — cole a saída como `args` (JSON de verdade, não string)
jq -c '[.[] | {sprint, prompt_arquivo}]' ../_lotes/LOTE-1/args.json
```

Depois, **o workflow** — o mesmo script para os quatro lotes, só `args` muda:

```js
export const meta = {
  name: 'lote-hefesto',
  description: 'Um lote de sprints do Hefesto: um agente por worktree, entrega em JSON',
  phases: [{ title: 'Executar' }],
}
const SAIDA = {
  type: 'object',
  properties: {
    sprint: { type: 'string' },
    commit: { type: 'string' },
    portoes: { type: 'string', enum: ['verde', 'vermelho', 'nao-rodei'] },
    entrega: { type: 'string' },
    mediu: { type: 'array', items: { type: 'object', properties: {
      chave: { type: 'string' }, transporte: { type: 'string' },
      ate_onde_foi: { type: 'string' }, viu: { type: 'string' } }, required: ['chave', 'viu'] } },
    caiu_da_sprint: { type: 'array', items: { type: 'string' } },
    esperou_bancada: { type: 'boolean' },
    pergunta: { type: 'string' },
  },
  required: ['sprint', 'commit', 'portoes', 'entrega', 'mediu', 'caiu_da_sprint', 'esperou_bancada', 'pergunta'],
}
phase('Executar')
const saidas = await parallel(args.map(a => () =>
  agent(`Você é o agente da sprint ${a.sprint} do Hefesto. Leia INTEIRO o arquivo ${a.prompt_arquivo} e siga os cinco passos dele, na ordem. A sua resposta final é SÓ o objeto JSON do esquema.`,
        { label: a.sprint, phase: 'Executar', effort: 'high', schema: SAIDA })))
return saidas.map((s, i) => s || { sprint: args[i].sprint, commit: '', portoes: 'nao-rodei', entrega: '',
  mediu: [], caiu_da_sprint: [], esperou_bancada: false, pergunta: 'o agente morreu ou foi pulado' })
```

`effort: 'high'` e nenhum agente de verificação: a verificação desta casa são
os 45 portões e a mordida, e o custo de três refutadores por sprint foi o que
estourou o limite semanal no meio de 06/09. Sem `isolation: 'worktree'` — a
árvore já é uma por sprint, feita pelo despachante.

```bash
# 3. guardar a saída do workflow — é o que a SPECS-A-PROCEDENCIA-01 (LOTE-4) lê
cat > ../_lotes/LOTE-1/saida.json <<'JSON'
<cole aqui o retorno do workflow>
JSON
# 4. costurar — cherry-pick de cada branch, estado: feita, 45 portões, commit
bash scripts/costurar-onda.sh LOTE-1 > ../_lotes/LOTE-1/costura.txt 2>&1; echo rc=$?; tail -5 ../_lotes/LOTE-1/costura.txt
```

**Se a costura parar:**

* `CONFLITO em <sprint>` — os arquivos estão nomeados. Resolva pela `posse:` da
  sprint (quem possui o arquivo está certo), `git add` e
  `git cherry-pick --continue`, e rode o costurador de novo: ele pula o que já
  entrou. **Nunca `git apply` cego, nunca `git reset --hard` na árvore de
  integração.**
* `PORTÕES VERMELHOS` — a costura fica no índice. A cauda diz o portão; cure,
  `git add -A && bash scripts/portoes.sh > ../_lotes/LOTE-N/portoes-2.txt`, e
  commite à mão `costura(LOTE-N): …`.
* `sem commit: <sprint>` — o agente não entregou. Leia o JSON dele (`pergunta`,
  `esperou_bancada`); se foi a bancada, a sprint fica aberta com a linha na
  MESA; se foi erro, redespache SÓ ela no próximo lote
  (`despachar-onda.sh LOTE-N-b <sprint>`).

```bash
# 5. a mordida do lote — UMA sprint, escolhida ao acaso: a régua dela tem de reprovar sem a cura
SHA=$(git log --format=%h -1 --grep='<uma frase do commit da sprint>')
ARQ=$(git show --stat --format= $SHA | awk '/src\//{print $1; exit}')
git checkout $SHA~1 -- "$ARQ" && python -m pytest -q $(grep -o 'tests/unit/test_[a-z0-9_]*\.py' docs/process/sprints/*<SPRINT>*.md | head -1) > ../_lotes/LOTE-1/mordida.txt 2>&1; echo "tem de ser rc≠0: rc=$?"
git checkout HEAD -- "$ARQ"
```

```bash
# 6. as perguntas do lote — decida por delegação e registre; conte a ela em UMA linha por lote
jq -r '.[] | select(.pergunta != "") | "\(.sprint): \(.pergunta)"' ../_lotes/LOTE-1/saida.json
jq -r '.[] | select((.caiu_da_sprint|length) > 0) | "\(.sprint): \(.caiu_da_sprint|join(" · "))"' ../_lotes/LOTE-1/saida.json
```

Uma decisão nova vai para `docs/data/decisoes-dela.csv` no molde das
`D-0609-*` (`quem_decidiu=delegacao`, `escolha` começa com *DECIDIDA POR
DELEGAÇÃO … REVERSÍVEL NUMA FRASE*). Ela decide de verdade só o que é olho na
tela, e isso vai para a MESA.

### 2.3 Os lotes 2, 3 e 4 — só o que muda

```bash
bash scripts/despachar-onda.sh LOTE-2 COOP-QUE-NAO-DESMONTA-01 DAEMON-ACORDADO-01 ENGASGO-VULKAN-01 QUEM-E-QUEM-02 \
  QUEM-E-QUEM-03 VIBRACAO-O-QUE-SOBROU-01 SISTEMA-OS-QUATRO-QUE-FALTAM-01 PERFIS-O-PRECO-E-O-RADIO-01 \
  O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01 QUATRO-NA-MESA-01 COOP-NA-CONEXAO-NATIVA-01 MOTOR-DO-ARRANJO-01 \
  RESERVA-DO-POSTO-01 CONTROLES-OS-TRES-SELOS-01 ILUMINACAO-O-AVISO-DOS-N-01 PARIDADE-CRUZA-O-MAPA-01
bash scripts/despachar-onda.sh LOTE-3 O-CONTROLE-SEM-MAC-01 SOM-QUE-SAI-01 MIC-BT-DONO-01 JOGAR-OS-SEIS-AVISOS-01 CONEXOES-A-LUZ-QUE-NAO-ACENDE-01
bash scripts/despachar-onda.sh LOTE-4 QUEM-E-QUEM-04 PARIDADE-REMEDIR-02 SPECS-A-PROCEDENCIA-01
```

O despacho de um lote só acontece **depois da costura do anterior** — as
árvores nascem de `onda/atual-0609` e precisam do que o lote anterior
entregou. O LOTE-2 tem 16 agentes e a máquina roda 14 por vez; dois esperam na
fila, e é normal.

**Tempo, se nada travar:** um lote leva 40-70 min de agentes e 15-25 min de
costura. Os quatro somam **5-7 horas**. O que trava é conflito de costura e
portão vermelho, e os dois vêm nomeados.

---

## 3. O FECHO — o que é seu e o que é dela

Depois do LOTE-4 costurado (ou do checkpoint que mandou parar):

1. **Os doze lotes da suíte**, na árvore de integração, com a máquina livre
   (`ls tests/unit/test_*.py | sort > /tmp/todos.txt && split -n l/12 -d /tmp/todos.txt /tmp/lote-`;
   `for f in /tmp/lote-*; do python -m pytest -q $(tr '\n' ' ' < "$f") > /tmp/$(basename $f).txt 2>&1; tail -1 /tmp/$(basename $f).txt; done`).
   Vermelho intermitente: três voltas do lote isolado antes de chamar de defeito.
2. **As dez fotos `--oculta`** (`src/hefesto_dualsense4unix/interface/olhar.py --todas --publicado --doc`);
   o `test_as_fotos_acompanham_a_versao` cobra.
3. **O merge em `dev`, de uma vez** — `git -C /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix merge --no-ff onda/atual-0609`,
   e os 45 portões lá. Depois, na árvore dela: `rm -rf scripts/gui-captura`
   (só `__pycache__` órfão; o portão `paridade-gtk-html` acusa
   `aposentado-vivo`) e a troca no `CLAUDE.md` dela (`.gitignore:90`, não
   viaja): `scripts/gui-captura/retratar_abas.py` →
   `src/hefesto_dualsense4unix/interface/olhar.py --todas --publicado --doc`.
4. **ELA:** publica numa volta só (`--publicar NN`, ato dela); **dá a palavra
   para o `install.sh`** — `./install.sh --yes` na árvore dela, por você, só
   com essa palavra (`D-0609-INSTALL-PELO-OPUS`); o `doctor` sem FALHA.
5. **A MESA-DE-QUATRO-01**, 60 min, com ela na tela dela: as 21 linhas, o
   ensaio 1 do som por rádio na linha 11 (a orelha dela escolhe o arranjo do
   `0x39`), a passagem do `nao-medido` pela `chave`. O que sai está na §3 dela.
6. **O handoff:** `docs/process/2026-09-07-ONDE-PARAMOS-…md` no molde dos
   anteriores, com os números (§5 do ONDE-PARAMOS de 06/09 como base) e o
   ponteiro no topo do `CLAUDE.md`.

---

## 4. FORA DO ESCOPO DAS 24 HORAS — e por decisão, não por esquecimento

* **22 linhas FALTA da paridade que ELA decidiu fora** (04/09 e 06/09):
  controles externos na lista de rádio além dos cards (A-BANCADA-QUE-O-RADIO-PEDE),
  o editor avançado de regra, "Mapear Entrada a Entrada", "Já movi — reexaminar",
  a ambiguidade fina das ordens, o medidor de onda do microfone, a linha da
  verdade do cartão, o aviso de grab dobrado, o recibo/dica do Reconectar, a
  divergência de máscara, a linha de origem, a caixinha do Steam Input. Estão
  no CSV com `porque` apontando a decisão; a PARIDADE-REMEDIR-02 não as toca.
* **As dívidas do mapa sem tela** (`por_que_nao_aciona=divida` sem linha na
  paridade): `gatilho.leitura`, `vibracao.haptics_vcm`, `identidade.pareamento`
  no cabo, `audio.saida_dedicada`. Ficam no mapa, com causa — o mapa informa.
* **Os ensaios 2-6 da bancada do rádio** (A-BANCADA-QUE-O-RADIO-PEDE-INDICE) e
  a **LUZ-NO-RADIO-01**: são dela, com aparelho, depois.
* **O Nintendo Pro e o 8BitDo na mesa**: a EXTERNOS-01 os põe nos cards com
  dublê; a mesa das 24 horas é de quatro DualSense (regra da MESA §4).

---

## 5. OS CINCO RISCOS, e o que fazer em cada um

1. **O limite semanal** — o checkpoint da §2.1 antes de cada lote. Parar com
   três lotes costurados é produto; parar no meio de um lote é 16 árvores
   pela metade.
2. **Agente que roda `git reset --hard` fora da árvore dele** — já aconteceu
   (03/09). A árvore de integração está sempre commitada antes de um despacho
   (o costurador exige); a dela está em `dev` e ninguém a toca até o merge.
3. **Agente que para citando o mapa** — o preâmbulo proíbe, e a nota ROTA
   CORRIGIDA de cada sprint diz o que o mapa já tem. Se ainda assim parar,
   `caiu_da_sprint` do JSON diz onde; redespache só ela com a célula citada
   no prompt.
4. **A bancada** — nenhum agente toca o aparelho sem `bancada.sh exigir`
   rc=0, e ela está usando a máquina: espere `esperou_bancada=true` em
   BATERIA-PARADA, O-ALTO-FALANTE-VIRTUAL, SOM-QUE-SAI, RESERVA-DO-POSTO,
   COOP-NA-CONEXAO-NATIVA. Não é falha: a prova deles é a linha da MESA.
5. **A costura de 16** — conflito só acontece se dois agentes tocaram o mesmo
   arquivo fora da posse. O portão de colisão diz que não deviam; se
   acontecer, o JSON de cada um diz o commit, e a posse decide.
