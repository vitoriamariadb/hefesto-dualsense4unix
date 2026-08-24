# ONDA 0 · Z6 — COMUNHÃO COM O SPECS-01: a medição chega à tela por alguém lembrar

**24/08/2026. Frente Z6 da Onda 0** ([SPRINT_ORDER](../SPRINT_ORDER.md), §0.2 —
a linha desta frente é o briefing desta página, e o aceite dela é o piso do §10).
**GRAU: MEDIDO** — cada número tem o comando ao lado. Onde não houve medição está
escrito **NÃO VERIFICADO**, e isso é informação, não lacuna.

**Começa no DIA 1, em paralelo com a Z0.** A trilha de Bluetooth dela (D2, §0.7
do SPRINT_ORDER) já está correndo: sem esta frente, cada medição dela vira faxina
manual em N arquivos. Em 23/08 foram **oito**.

**O que ela fecha.** A medição passa a ter um caminho até a tela que uma máquina
percorre: o CSV vira módulo Python que viaja no pacote, a tela declara de que
chave está falando, e um portão compara os dois **nos dois sentidos** — a tela
que afirma além do mapa e o mapa que mudou e deixou a tela para trás. Junto,
duas curas que são só da Onda 0: o **número medido** ganha um dono só
(`HZ_INPUT_SEM_MIC` ↔ `radio_ressalva`), e o **fato declarado caduco** deixa de
poder continuar publicado.

**O que ela NÃO faz.** Não mede Bluetooth (§8 — é a trilha dela). Não escreve
frase de rádio nova para chave sem medição. Não deriva a voz dela de célula de
planilha (a fronteira está na [PAREAMENTO-01](2026-08-24-PAREAMENTO-01-a-medicao-nova-tem-de-chegar-sozinha-na-tela.md),
seção "A FRONTEIRA QUE SALVA A PROPOSTA", e esta página não a reabre). Não
converte as onze abas: `Fala` é opt-in e no dia 1 o registro tem duas entradas.
Não redesenha tela nenhuma — reescreve **uma** frase, e essa é ESTRUTURAL.

**O defeito de forma que ela cura: F10** (§0.1 do SPRINT_ORDER) — *"o elo que
responde à pergunta central dela não existe"*. Encosta em **F9** (a régua mente
mais que o produto) nas tarefas Z6-08 e Z6-09.

**Ela não reescreve o contrato.** O contrato está desenhado na
[PAREAMENTO-01](2026-08-24-PAREAMENTO-01-a-medicao-nova-tem-de-chegar-sozinha-na-tela.md),
com as três peças, o placeholder e as onze tarefas P-01 a P-11. **Esta página é
a frente de Onda 0 que o executa**: aponta para lá, corrige o que a árvore
mudou debaixo dele em 24 horas, e acrescenta o que só a Onda 0 acrescenta. O
mapeamento tarefa a tarefa está no §7.

---

## 1. O defeito, em uma frase

Se decidirmos hoje que o caminho X faz a feature Y funcionar no rádio, isso
**não** chega à interface: chega se alguém lembrar de copiar à mão, em cada um
dos N arquivos onde o fato mora — e quando alguém esquece, nada acusa.

---

## 2. O que está MEDIDO

Régua: `dev @ c111d74`, **árvore de trabalho de 24/08** (há outros agentes
editando `src/` neste instante; onde isso importa, está dito). Cada linha traz o
comando.

### 2.1 O elo não existe — e o número está PIOR que o publicado

```bash
grep -rn "mapa-controles\|docs/data" src/ | wc -l          # -> 20
grep -rn "mapa-controles\|docs/data" src/ | grep -v '``' | grep -cv ':\s*#'   # -> 0
grep -rn "specs\.html" src/ | wc -l                        # -> 0
```

**Vinte ocorrências, ZERO em código.** As vinte são docstring ou comentário. O
caminho de hoje é `medição → CSV → specs.html → NADA → tela`.

> **Fato errado substituído.** A PAREAMENTO-01 publica **16** ocorrências,
> medidas em 23/08. Na árvore de 24/08 são **20** — todas ainda em prosa, o que
> não muda a conclusão, só o número. Quem abrir aquela página corrige a célula
> no mesmo commit (o precedente é o do §0 do SPRINT_ORDER, com as três sprints
> de número de onda errado).

### 2.2 O CSV não viaja no pacote

```bash
grep -n "packages" pyproject.toml            # :83  packages = ["src/hefesto_dualsense4unix"]
grep -rln "mapa-controles" packaging/ flatpak/ scripts/build_*.sh \
     scripts/check_packaging_parity.sh | wc -l          # -> 0
```

**Confirmado.** É a razão de o elo ser **gerado em build time**, e não lido em
runtime: uma GUI que lê `docs/data/` funciona na máquina dela e quebra na de
quem instalou.

### 2.3 O tamanho real do mapa, e as duas colunas sem leitor

```bash
python3 -c "import csv; r=list(csv.DictReader(open('docs/data/mapa-controles.csv',encoding='utf-8'))); print(len(r), len(r[0]), len({x['chave'] for x in r}))"
# -> 308 49 110
```

| Fato | Valor | Confere com a PAREAMENTO-01? |
|---|---|---|
| linhas / colunas / chaves distintas | **308 / 49 / 110** | sim |
| `id_v1` preenchido (endereço antigo guardado) | **136** de 308 | sim |
| linhas com afirmação forte (`aciona=sim` **e** `de_onde_sei=medido`, união dos dois lados) | **37** | sim |
| `radio_por_que_nao_aciona` preenchido | **21** | sim |
| `cabo_por_que_nao_aciona` preenchido | **20** | sim |

Os valores reais das duas colunas de causa, contados hoje:

```
cabo : nada-a-acionar 10, decisao-tomada 8, so-ela-decide 1, divida 1
radio: nada-a-acionar 10, decisao-tomada 7, divida 3,        so-ela-decide 1
```

**Nenhum dos quatro separa "o aparelho recusa" de "ninguém escreveu o código".**
É por isso que a Z6-05 acrescenta `o-aparelho-recusa` ao domínio: sem ele, o
portão licenciaria a tela a culpar o aparelho pelo que é nosso.

### 2.4 A régua de tela mudou debaixo do contrato — e isto é o achado do dia

A PAREAMENTO-01 afirma que `scripts/validar-palavra-de-tela.py` *"lê só o
`main.glade`"* e declara no docstring que rótulo montado em Python fica de fora
**de propósito**. **Isso é verdade em `HEAD` e é FALSO na árvore de trabalho:**

```bash
git show HEAD:scripts/validar-palavra-de-tela.py | grep -c "arquivos_de_python\|rglob"   # -> 0
git diff --stat scripts/validar-palavra-de-tela.py
# scripts/validar-palavra-de-tela.py | 473 ++++...  451 insertions(+), 22 deletions(-)
```

A versão da árvore varre `app/**.py` **por AST** e sabe o que é *escoadouro de
tela* (`set_label`, `set_tooltip_text`, `Gtk.Label(label=…)`, `moldura_de_secao`,
…). Medido com a própria máquina dela, importando o script como módulo:

```
arquivos de app/ : 52   | rótulos de tela em app/ : 293
rótulos no main.glade : 218
rótulos de app/ que citam transporte : 8
rótulos do main.glade que citam transporte : 0
```

**A régua independente que a PAREAMENTO-01 pediu ao agente 5 já existe, e o
número dela não é 31: é 8.** Não há contradição — são populações diferentes. As
31 são um **piso de `grep`** sobre linhas de `app/`+`gui/` fora de docstring; as
8 são strings **provadas** por fluxo chegando a um escoadouro de tela. A
população que o portão da Z6 tem de cobrir é a segunda.

**E é aqui que a medição vira decisão de desenho.** As 8 são:

| arquivo:linha | aba |
|---|---|
| `app/actions/config/secao_exame.py:70` | Configurações |
| `app/actions/config/secao_mesa.py:143`, `:228`, `:285`, `:822`, `:925` | Configurações |
| `app/actions/config/secao_orcamento.py:133` | Configurações |
| `app/widgets/controller_card.py:592` (`DICA_MIC_ESCALA`) | Status |

**Sete das oito moram na aba Configurações** — que é justamente a única das onze
que **não** declara Z6 entre as dependências (§0.3 do SPRINT_ORDER). Ver §9.

### 2.5 A cegueira que prova que declarar é obrigatório

Rodando a mesma régua contra os dois casos que o aceite desta frente nomeia:

```
"Lida do próprio controle, por cabo ou por rádio"   (external_card.py:86)  -> INVISÍVEL
"Sem placa de som do controle (…)"                  (audio_saida.py:1017)  -> INVISÍVEL
nomes de constante que atravessam módulo, hoje: 2  -> {'DICA', 'TITULO'}
```

O rastreador de constante que atravessa módulo conhece **dois nomes**, e os dois
vêm do contrato de uma aba só (`config/mixin.py:46`). `DICA_DA_COR_NO_RADIO` e
`TEXTO_SONO_SEM_PLACA` são constantes de módulo consumidas de fora e **nenhuma
régua automática as vê**.

**A conclusão, e ela não é opinião: descoberta por fluxo tem falso-negativo
justamente nos dois casos que já mentiram na tela.** O registro `Fala`, escrito à
mão, não é preguiça de desenho — é a única forma que alcança a população real.

### 2.6 As duas âncoras do aceite, conferidas contra a árvore de hoje

```bash
sed -n '86p'   src/hefesto_dualsense4unix/app/widgets/external_card.py
# DICA_DA_COR_NO_RADIO = "Lida do próprio controle, por cabo ou por rádio."
sed -n '1017p' src/hefesto_dualsense4unix/app/audio_saida.py
# TEXTO_SONO_SEM_PLACA: Final[str] = (
grep -n "identidade.cor_do_aparelho" docs/data/mapa-controles.csv    # -> 111
```

As duas batem. `app/audio_saida.py:1017` é a frase de 17/08 — a que já esteve
errada uma vez (dizia *"no rádio não existe alto-falante"*, e o mapa diz
`existe = tem`). **É o alvo da mordida principal desta frente.**

### 2.7 O número medido tem duas cópias e nenhum portão entre elas

```bash
sed -n '120p' src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
# HZ_INPUT_SEM_MIC = 260.4
sed -n '457p' src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
# f"Com o microfone ligado, um controle no rádio troca {_numero(HZ_INPUT_SEM_MIC)} "
```

E a mesma medição, em prosa, na célula `radio_ressalva` da linha 23 do CSV
(`audio.microfone@dualsense`): *"mic desligado 260,4 Hz de input; ligado 170,5 Hz
de input + 106,2 Hz de áudio"*. **Duas cópias do mesmo número medido, uma em
Python e uma em planilha, sem nada entre elas.** O §0.1 do SPRINT_ORDER (F9)
registra que trocar a constante passa em 36 testes.

### 2.8 O fato declarado caduco continua publicado — inclusive dentro do `src/`

O CSV **diz por escrito** que os números do microfone por rádio caducaram
(linha 23, `radio_ressalva`): *"os números publicados de `55-75% de mudo / ~40%
do sinal` estão CADUCOS (obtidos com um desmutador acidental no ar) — o README
ainda os publica"*.

```bash
grep -rln "55-75\|55 a 75\|40% do sinal" . --exclude-dir=.git | wc -l   # -> 23 arquivos
grep -n "55-75\|40% do sinal" README.md \
     src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
# README.md:219: … sobrando por volta de 40% do sinal.
# integrations/dualsense_bt_audio.py:101: … entre 55% e 75% de MUDO, … entrega ~40% do sinal.
```

**O `README.md:219` é o que o aceite nomeia. O `dualsense_bt_audio.py:101` é o
nono lugar — dentro do `src/`, e não está em lista nenhuma.** Dos 23 arquivos, a
grande maioria é **narrativa histórica** (sprints e estudos), que pela regra da
casa fica: *não se apaga decisão medida*. O que não pode ficar é o número
publicado como **fato vigente** em superfície viva.

Censo de células que declaram caducidade no CSV, com a régua declarada:

```bash
# csv.DictReader + re.search(r'caduc', valor, re.I) sobre as 49 colunas
# -> 11 células, em 9 linhas
```

### 2.9 Os três portões de hoje passam verdes

```bash
python3 scripts/check_paridade_transporte.py   ; echo $?   # 0
python3 scripts/validar-palavra-de-tela.py --all; echo $?   # 0
python3 scripts/gerar-mapa.py --check          ; echo $?   # 0
```

E `scripts/check_paridade_transporte.py` continua abrindo **quatro** arquivos —
`docs/data/mapa-controles.csv` (`:310`), `docs/data/ensaios.csv` (`:311`),
`specs.html` (`:312`) e `integrations/ponte_escada.py` (`:321`) — **nenhum em
`app/` ou `gui/`**. O vocabulário que ele possui está onde a PAREAMENTO-01 disse:
`ESCADA` em `:422`, `DOMINIO_POR_SUFIXO` em `:558`, `DOMINIO_EXISTE` em `:570`.

### 2.10 O `HEAD~1` do CI, reconferido

```bash
grep -c "actions/checkout@v4" .github/workflows/ci.yml                       # -> 20
grep -A3 "actions/checkout@v4" .github/workflows/ci.yml | grep -c fetch-depth # -> 0
```

Checkout do job do mapa em `ci.yml:176`, portão em `:207`, `gerar-mapa --check`
em `:181`; checkout do job de lint e teste em `:338`. **Todas as âncoras da P-11
batem.** Sem `fetch-depth: 0`, os dois portões que comparam com o passado nascem
verdes sem medir nada.

### 2.11 Nada disto existe ainda

```bash
ls src/hefesto_dualsense4unix/app/fatos_do_mapa.py \
   src/hefesto_dualsense4unix/app/fala_do_mapa.py \
   scripts/gerar-fatos-de-tela.py scripts/validar-fala-de-tela.py
# os quatro: Arquivo ou diretório inexistente
```

---

## 3. O que é HIPÓTESE, e o que é NÃO VERIFICADO

- **HIPÓTESE:** que a varredura de `app/**.py` por AST de `validar-palavra-de-tela.py`
  vá para o `HEAD` desta leva. Hoje ela está **staged e não commitada**, escrita
  por outro agente. Se ela não entrar, a Z6-10 muda de forma (está dito lá).
- **HIPÓTESE:** que a população de frases de transporte da tela seja ~8 e não
  ~31. As 8 são o que uma régua de fluxo alcança; o §2.5 prova que essa régua
  tem falso-negativo. **O teto continua NÃO VERIFICADO.**
- **NÃO VERIFICADO:** se `docs/usage/assets/*.png` já reflete os cinco hosts que
  a Z0 acrescentou. O que está medido é só o carimbo de tempo — `ls` diz
  **23/08 21:12**, depois das 20h57 em que o script mudou. O
  [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md) (A1) publica *"as de
  `docs/usage/assets/` são das 18h15"*, e isso **não bate com a árvore de hoje**.
  Não é achado desta frente: é da Z0, e quem for dono confere pelo conteúdo da
  foto, não pelo `mtime`.
- **NÃO VERIFICADO, e de propósito:** a direção *"o mapa sabe e a tela não
  oferece"*. A PAREAMENTO-01 declarou o fracasso da régua tentada em 23/08 e
  esta página não a ressuscita.
- **NÃO MEDIDO por esta frente:** qualquer coisa sobre rádio. Ver §8.

---

## 4. Por que esta frente vem ANTES das abas

O SPRINT_ORDER (§0.3) declara Z6 como dependência de **oito das onze abas**:
Status, No jogo, Emulação, Lightbar, Gatilhos, Rumble, Navegação e Sistema. O
que muda em cada uma:

| Aba | O que a Z6 muda na tarefa dela |
|---|---|
| **3 · Status** | quatro perguntas de rádio da aba (alto-falante, mic, taxa do mudo, bateria) viram `Fala` com `Pendencia` em vez de frase escrita no escuro; o card do jogador para de poder afirmar `parcial` como se fosse `sim` |
| **4 · No jogo** | a palavra verde deixa de ser prosa e passa a ter chave; e o gatilho replicado por rádio, que **precisa de linha própria no CSV**, ganha o lugar onde a ausência é declarada em vez de suposta |
| **5 · Emulação** | a dica de máscara que afirma vibração e giroscópio "completos" sem qualificar transporte passa a exigir chave e lado |
| **7 · Lightbar** | as duas sprints que se contradizem sobre a barra por rádio param de poder ser copiadas para a tela; a frase espera `de_onde_sei = medido` |
| **8 · Gatilhos** | dezoito dos dezenove modos ficam sob `AFIRMA_NADA` + `porque=` até haver medição, em vez de herdarem a confiança do `Rigid` |
| **9 · Rumble** | a frase central do card de cima (`radio_de_onde_sei = inferido-do-codigo`) deixa de poder ser afirmada, e a ressalva literal do CSV chega à tela por portão |
| **10 · Navegação** | a tabela "Mapeamento" promete três caminhos por rádio e a observação dela de 11/08 diz que só um funciona: sem Z6, essa correção é manual e volta na próxima leva |
| **11 · Sistema** | o texto do wrapper e o tooltip dos quatro jogadores passam a citar chave, e o que foi medido **no cabo** para de poder ser publicado como valendo no rádio |

**E a razão de ordem, que é o motivo de a Onda 0 existir:** sem Z6, essas oito
ondas escrevem **oito versões** da mesma frase de ressalva de rádio, e as oito
divergem no dia em que a bancada dela mudar um valor. Com Z6, uma célula do CSV
muda e o portão entrega os endereços.

**E é por isto que ela começa no dia 1, e não depois.** A trilha D2 dela está
correndo agora. Toda medição que ela fechar antes de a Z6 existir vira faxina
manual em N arquivos — e a conta de 23/08 foi de oito, com o nono passando
despercebido.

---

## 5. O que esta página acrescenta ao contrato da PAREAMENTO-01

A [PAREAMENTO-01](2026-08-24-PAREAMENTO-01-a-medicao-nova-tem-de-chegar-sozinha-na-tela.md)
desenhou as três peças (gerador, registro, portão), o placeholder com `Pendencia`
e a fronteira do que **não** deriva. **Nada disso se reabre.** A Onda 0
acrescenta quatro coisas, e são as quatro que o aceite da §0.2 nomeia:

1. **O número medido ganha dono** (Z6-08). O contrato original amarra *palavra*
   à *célula*. Falta amarrar **número**: `HZ_INPUT_SEM_MIC` e a `radio_ressalva`
   são a mesma medição em dois arquivos.
2. **O fato caduco deixa de poder ficar publicado** (Z6-09). O CSV já **declara**
   caducidade em 11 células e ninguém lê essa declaração. É a família *"a casa
   sabe e o produto não faz"* aplicada ao próprio mapa.
3. **A régua da população é a de hoje, não a de ontem** (Z6-10) — §2.4 e §2.5.
4. **A correção da premissa** de que `validar-palavra-de-tela.py` só lê XML
   (§2.4), que muda quem faz o trabalho do antigo agente 5.

---

## 6. A coreografia dos agentes

**Seis agentes** — o número da linha desta frente na §0.2, respeitado. A
PAREAMENTO-01 desenhou onze; a redução tem motivo escrito: o agente 5 (censo)
está **feito** (§2.4), e os papéis 1+2, 7+8 e 10+11 colidem em arquivo, o que a
R1 do [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md) proíbe manter separado.

| # | Agente | Papel | Posse EXCLUSIVA de arquivo | Devolve |
|---|---|---|---|---|
| **A1** | **Gerador** | Z6-01, Z6-02 — importa o vocabulário do portão que já é dono dele; o CSV vira Python que viaja no pacote | `scripts/gerar-fatos-de-tela.py`, `src/hefesto_dualsense4unix/app/fatos_do_mapa.py` | o módulo gerado + a saída do `--check` **antes e depois** de editar uma célula | <!-- ref-externa: arquivo A CRIAR nesta leva; a ausência é o assunto -->
| **A2** | **Tipos** | Z6-03 — `Fala`, `Pendencia`, `NAO_MEDIDO`, os seis `AFIRMA_*`, e a recusa de zero/booleano no `__post_init__` | `src/hefesto_dualsense4unix/app/fala_do_mapa.py` e o teste dele | o módulo + o teste da recusa, arrancado e devolvido | <!-- ref-externa: arquivo A CRIAR nesta leva; a ausência é o assunto -->
| **A3** | **Portão da fala** | Z6-04, Z6-11 — o validador por AST, três modos, e a fila publicada | `scripts/validar-fala-de-tela.py` e o teste dele; `scripts/gerar-painel.py` **só** no bloco da fila | as **seis mordidas**, cada uma arrancada, vista reprovar e devolvida, com a saída colada | <!-- ref-externa: arquivo A CRIAR nesta leva; a ausência é o assunto -->
| **A4** | **O mapa** | Z6-05, Z6-07 — `o-aparelho-recusa`, a medição de 23/08 na linha da cor, e o `id` que não pode sumir | `docs/data/mapa-controles.csv`, `docs/data/ensaios.csv`, `scripts/check_paridade_transporte.py` | os diffs + o portão **reprovando antes** da correção |
| **A5** | **Números e caducos** | Z6-08, Z6-09 — as duas curas próprias da Onda 0 | `docs/data/caducos.csv`, `scripts/validar-caducos.py`, `README.md`, `src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py`, `src/hefesto_dualsense4unix/integrations/radio_da_mesa.py` | as duas varreduras, a **segunda passada limpa**, e as mordidas | <!-- ref-externa: arquivo A CRIAR nesta leva; a ausência é o assunto -->
| **A6** | **Tela e costura** | Z6-06, Z6-10, Z6-12 — a frase que mente, o censo com a régua de hoje, o CI, a bateria e o commit | `src/hefesto_dualsense4unix/app/widgets/external_card.py`, `.github/workflows/ci.yml`, as fotos, o commit | as fotos antes/depois, a saída dos onze comandos do [CLAUDE.md](../../../CLAUDE.md), o commit |

**Ordem: quatro em paralelo, dois em série.**

```
dia 1, paralelo:   A1  A2  A4  A5
                    \   /
dia 1 (fim) → 2:      A3          (precisa de FATOS e dos tipos)
                       \
dia 2:                  A6        (Z6-10 pode começar no dia 1; Z6-06 e Z6-12 esperam A3)
```

**As três regras de posse que já custaram caro nesta casa:**

- **`scripts/validar-palavra-de-tela.py` não é de ninguém desta frente.** Está
  sendo reescrito agora por outro agente (§2.4). Quem precisar dele **relata em
  vez de editar** (R1). A Z6-10 diz o que fazer nos dois cenários.
- **O `.github/workflows/ci.yml` é compartilhado por Z6-02, Z6-04 e Z6-07.**
  **A6 aplica as três edições de uma vez**, e a de Z6-07 (`fetch-depth`) é a
  **primeira** — sem ela, o portão do `id` entra no CI já cego.
- **Ninguém roda `pytest` sem alvo, e ninguém fotografa** (R2 e R4). A suíte
  inteira e o `retratar_abas.py` são de quem coordena, com a leva parada.
- **A bancada é dela durante a medição** (R3). Nenhuma tarefa desta frente
  precisa de controle na mesa — se precisar, é sinal de que saiu do escopo.

---

## 7. As tarefas

Doze. O mapeamento com a PAREAMENTO-01 está na coluna: onde diz *executa P-nn*,
**o desenho está lá e não se repete aqui**.

### Z6-01 — o vocabulário tem um dono só  *(executa P-01 · A1)*

**Onde.** `scripts/check_paridade_transporte.py:422` (`ESCADA`), `:558`
(`DOMINIO_POR_SUFIXO`), `:570` (`DOMINIO_EXISTE`).
**O conserto.** Torná-los importáveis sem efeito colateral, e proibir que
qualquer consumidor novo redigite valor — a regra que `scripts/gerar-mapa.py` já
escreveu no próprio bloco de import.
**A mordida.** Acrescentar um degrau à `ESCADA` e ver o gerador da Z6-02 emitir o
degrau novo **sem edição própria**; tirar o import e ver o teste reprovar.
**Custo.** 1 a 2 arquivos, ~30 linhas, ~1 h.
**Classe de tela:** não toca a tela.

### Z6-02 — o CSV vira Python que viaja no pacote  *(executa P-02 · A1)*

**Onde.** `scripts/gerar-fatos-de-tela.py` e `src/hefesto_dualsense4unix/app/fatos_do_mapa.py` <!-- ref-externa: arquivo A CRIAR nesta leva; a ausência é o assunto -->
(os dois **a criar**, §2.11), no molde de `scripts/gerar-mapa.py` — mesmo
`--check`, comparação **por conteúdo, nunca por `mtime`**.
**A mordida.** (1) Editar uma célula do CSV sem regerar → `--check` reprova com
diff. (2) Pôr coluna de texto livre na *allowlist* → o teste da fronteira
reprova.
**Custo.** 2 arquivos novos (~200 escritas + ~350 geradas), 2 linhas de CI ao
lado de `ci.yml:181`, ~4 h.
**Classe de tela:** não toca a tela.

### Z6-03 — os tipos, e a recusa que mora no tipo  *(executa a Peça 2 · A2)*

**Onde.** `src/hefesto_dualsense4unix/app/fala_do_mapa.py` (a criar), ~60 linhas. <!-- ref-externa: arquivo A CRIAR nesta leva; a ausência é o assunto -->
**O conserto.** `Fala`, `Pendencia`, `NAO_MEDIDO` e os seis `AFIRMA_*`. A regra
*"ausência de medição se declara, nunca se preenche com zero, porque zero pinta
verde"* fica no **`__post_init__`**, não num documento.
**A mordida.** Construir uma `Pendencia` com valor numérico ou booleano → tem de
levantar; trocar a recusa por `pass` → o teste reprova.
**Custo.** 2 arquivos (~60 + ~90), ~2 h.
**Classe de tela:** não toca a tela.

### Z6-04 — o portão, nos dois sentidos  *(executa P-03 · A3)*

**Onde.** `scripts/validar-fala-de-tela.py` (a criar), três modos: `--all`, <!-- ref-externa: arquivo A CRIAR nesta leva; a ausência é o assunto -->
`--fila`, `--exigir-prazo`. **Lê por AST, nunca importando o pacote** — a razão
está escrita em `scripts/gerar-contrato-ipc.py`: `ImportError` num runner sem
dependências vira "zero métodos", que é o jeito silencioso de um portão se
desligar.
**As seis mordidas.** As da P-03, e a **primeira é o aceite desta frente**:

1. Plantar `AFIRMA_NAO_EXISTE` na frase de `src/hefesto_dualsense4unix/app/audio_saida.py:1017`
   → reprova **nomeando arquivo, linha e chave**, e citando `existe=tem` do
   mapa. **É o defeito de 17/08 reproduzido como teste**, e hoje passa verde nos
   três portões (§2.9).
2. Editar o CSV sem regerar → `--check` reprova.
3. Num CSV de mentira, virar `radio_de_onde_sei` para `medido` numa chave com
   placeholder aberto → reprova dizendo *"a medição chegou"*.
4. `prazo_dias=1` com `aberta_em` de ontem → `--exigir-prazo` reprova, `--all`
   só avisa.
5. Coluna de texto livre na *allowlist* → o teste da fronteira reprova.
6. A população de `Fala` vem do AST, e o teto de abas promovidas é um
   `frozenset` **do próprio arquivo de teste**, nunca lido da árvore — a lição
   de `tests/unit/test_o_mapa_separa_divida_de_decisao.py`.

**Custo.** 1 script (~250) + 1 teste (~200), 2 linhas de CI, ~6 h.
**Classe de tela:** não toca a tela.
**Depende de** Z6-01, Z6-02, Z6-03 e Z6-05 (é a célula de causa que licencia o
`AFIRMA_NAO_ACIONA`).

### Z6-05 — as colunas órfãs ganham leitor, e a causa ganha nome  *(executa P-05 e P-07 · A4)*

**Onde.** `docs/data/mapa-controles.csv:111` (`identidade.cor_do_aparelho@dualsense`),
`docs/data/ensaios.csv`, e o domínio em `scripts/check_paridade_transporte.py:558`.
**O conserto.** (1) `radio_evidencia` passa a citar o `HANDSHAKE 0x04` capturado
com `btmon` em 23/08; `radio_ate_onde_foi` sai de `MONTOU` para o degrau que
descreve *saiu no fio e foi recusado*; `radio_por_que_nao_aciona` sai de `divida`
para **`o-aparelho-recusa`**. **Não é `decisao-tomada`** — quem recusou foi o
firmware, e `decisao-tomada` diria que a escolha foi nossa. (2) O domínio ganha
`o-aparelho-recusa`, e `CAUSA_DE_FORA = {"nada-a-acionar", "o-aparelho-recusa"}`
passa a ser a condição para `AFIRMA_NAO_ACIONA`.
**As três mordidas.** (1) Esvaziar uma célula `*_por_que_nao_aciona` numa linha
com `aciona=não` e `de_onde_sei=medido` → reprova. (2) `AFIRMA_NAO_ACIONA` numa
chave com `por_que_nao_aciona = divida` → **reprova dizendo que a causa é
nossa**, e a saída oferece `AFIRMA_NADA` + `porque=`. (3) Trocar
`o-aparelho-recusa` por `decisao-tomada` na linha da cor → a mesma reprovação.
**Custo.** 4 arquivos, ~55 linhas, ~3 h.
**Classe de tela:** não toca a tela — **mas sozinha ela vira o portão da Z6-06
vermelho, e é exatamente isso que se quer.**

### Z6-06 — a dica da cor para de mentir  *(executa P-04 · A6)*

**Onde.** `src/hefesto_dualsense4unix/app/widgets/external_card.py:86`
(`DICA_DA_COR_NO_RADIO = "Lida do próprio controle, por cabo ou por rádio."`,
escrita em 22/08, **um dia antes** da medição que a derruba).
**O conserto.** Frase reescrita e declarada como `Fala` com `AFIRMA_NAO_ACIONA`
apontando para `identidade.cor_do_aparelho@dualsense[radio]`.
**A mordida.** Devolver o texto antigo → o portão reprova com endereço e com as
células do mapa na mensagem.
**Custo.** 2 arquivos, ~15 linhas, ~1 h + o tempo dela.
**Classe de tela: ESTRUTURAL — precisa do olho dela.** Texto reescrito, e muda o
que se lê ao abrir. Foto antes e depois; a palavra final é dela.
**Restrição de aba, medida:** `external_card.py` é consumido **só** por
`app/actions/config/secao_controles.py` — logo esta frase mora na aba
**Configurações**, que é a **Onda 1**. Ver §9.

### Z6-07 — o `id` para de sumir em silêncio, e o CI passa a ter passado  *(executa P-06 e P-11 · A4 + A6)*

**Onde.** `scripts/check_paridade_transporte.py` (regra nova) e
`.github/workflows/ci.yml` (checkout `:176` do job do mapa, `:338` do job de
lint e teste).
**O conserto.** (1) `id` que desaparece entre duas referências sem aparecer em
`id_v1` de outra linha **reprova**, com nota datada como única saída — a `id_v1`
já existe em **136 de 308** linhas (§2.3). (2) `fetch-depth: 0` nos dois jobs, e
a referência de comparação vem do **evento**, via `--contra <ref>`, como o portão
de anonimato já faz em `.github/workflows/anonymity-check.yml:36-53`. (3)
Referência que não resolve **reprova alto**, nunca sai 0.
**A mordida.** Renomear um `id` e ver reprovar; acrescentar a nota e ver passar.
E: `git clone --depth 1` da própria árvore, rodar o portão → tem de **reprovar
pedindo histórico**, não sair 0.
**Custo.** 2 arquivos, ~75 linhas, ~3 h.
**Classe de tela:** não toca a tela.

### Z6-08 — o número medido tem um dono só  *(NOVO da Onda 0 · A5)*

**O defeito.** `HZ_INPUT_SEM_MIC = 260.4`
(`src/hefesto_dualsense4unix/integrations/radio_da_mesa.py:120`) e a célula
`radio_ressalva` da linha 23 do CSV são **a mesma medição escrita duas vezes**, e
a segunda alimenta a frase de tela de
`app/actions/config/secao_controles.py:457`. Trocar a constante hoje passa em 36
testes (F9).
**O conserto.** Uma declaração `Numero` no registro da Z6-03, amarrando a
constante Python a `(id, coluna)` do mapa. O portão da Z6-04 lê o valor da
constante **por AST** e exige que a célula o contenha na forma pt-BR (`260,4`).
Vale para as três: `HZ_INPUT_SEM_MIC`, `HZ_INPUT_COM_MIC` (170,5), `HZ_AUDIO_COM_MIC`
(106,2).
**A mordida — e é o segundo item do aceite desta frente.** Trocar
`HZ_INPUT_SEM_MIC` para outro valor **sem** atualizar a `radio_ressalva` →
reprova nomeando a constante, o arquivo, a linha do CSV e os dois valores.
Arrancar a comparação → o teste que a prova reprova.
**Custo.** 3 arquivos, ~50 linhas, ~2 h.
**Classe de tela:** não toca a tela.
**O que ela NÃO faz:** não muda número nenhum. Os três são medição de 25/07 e
ficam onde estão.

### Z6-09 — o fato caduco não pode continuar publicado  *(NOVO da Onda 0 · A5)*

**O defeito.** O CSV **declara** que os números do mic por rádio caducaram, e o
`README.md:219` e `src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py:101`
continuam publicando-os (§2.8). Nenhuma régua lê essa declaração.
**O conserto.** Um livro-caixa declarado, `docs/data/caducos.csv`, com
`id, o_que_caducou, caducou_em, substituto, onde_pode_ficar` — **e não uma
coluna nova no mapa**, pelo motivo que a PAREAMENTO-01 já escreveu ("A decisão
que reconcilia as duas frentes"): coluna nova é uma segunda cópia do mesmo
vínculo, mantida à mão. Mais `scripts/validar-caducos.py`, que varre as <!-- ref-externa: arquivo A CRIAR nesta leva; a ausência é o assunto -->
superfícies **vivas** — `README.md`, `docs/usage/**`, `docs/protocol/**`,
`src/**` — e reprova ao achar o literal caduco fora do `onde_pode_ficar`.
**A narrativa histórica fica**, e a coluna `onde_pode_ficar` é onde isso é dito:
`docs/process/**` e o `docs/data/mapa-controles-v1.csv` são o passado, e o
passado não se apaga.
**O que entra na tela e no `README.md` no lugar do número:** a **ausência
declarada**, não um número novo. Ver §8.
**As duas mordidas — e são o terceiro e o quarto itens do aceite.** (1) Devolver
o parágrafo de `README.md:219` → reprova **citando `audio.microfone@dualsense`**
e a data em que o fato caducou. (2) **A varredura roda duas vezes e a segunda
não acha nada** — é a prova de que a leva não deixou nenhum dos 23 arquivos para
trás na parte que lhe cabe, e o teste que a trava compara as duas saídas.
**Custo.** 4 arquivos, ~120 linhas, ~4 h.
**Classe de tela:** não toca a tela — o `README.md` não é tela. **Se a Onda 3 ou
a Onda 1 quiser publicar a ausência num rótulo, aquela tarefa é ESTRUTURAL e é
delas.**

### Z6-10 — a régua da população é a de hoje  *(NOVO da Onda 0 · A6)*

**O achado.** §2.4 e §2.5: a varredura de `app/**.py` por AST **já existe** na
árvore, vê 293 rótulos e 8 frases de transporte, e é **cega** para os dois casos
que esta frente nomeia, porque só conhece dois nomes de constante que atravessam
módulo.
**O conserto, e ele tem dois cenários declarados.**
*(a)* Se a varredura de `validar-palavra-de-tela.py` entrar no `HEAD` desta leva:
esta tarefa **não a edita** (R1 — ela é de outro dono). Ela publica o número, a
lista das 8 com `arquivo:linha`, e a prova da cegueira como **teste próprio** no
portão da Z6-04: *"a descoberta por escoadouro não alcança constante de módulo,
logo `Fala` é declarada e não inferida"*.
*(b)* Se não entrar: a mesma medição é refeita por régua própria dentro da
Z6-04, e o número publicado passa a ser dela.
**A mordida.** Fazer o portão da Z6-04 tentar descobrir a população por fluxo
em vez de por declaração → tem de deixar `external_card.py:86` passar, e o teste
que trava isso reprova.
**Custo.** 1 a 2 arquivos, ~60 linhas, ~2 h.
**Classe de tela:** não toca a tela.

### Z6-11 — a fila da bancada sai pela interface  *(executa P-08 · A3)*

**O conserto.** `--fila` publicado: os placeholders abertos entram no
`specs.html` (ao lado do `teste_que_morde`) e no `painel.html`, com a lista
invertida `id` → onde aparece na tela. **É a lista de trabalho da trilha D2
dela, gerada pela própria interface** — a tela passa a *pedir* a medição de que
precisa, em vez de esperar que alguém lembre.
**A mordida.** Abrir um placeholder novo e ver a linha aparecer nos dois HTML
**sem edição manual**; fechar e ver sumir.
**Custo.** 2 scripts editados, ~50 linhas, ~2 h.
**Classe de tela:** não toca a tela. (A frase única de `NAO_MEDIDO` é
ESTRUTURAL, **uma vez** — e ela nasce na Z6-03 junto com o tipo, não aqui.)

### Z6-12 — a costura  *(A6)*

**O conserto.** As três edições do `ci.yml` aplicadas de uma vez, na ordem
`fetch-depth` → `gerar-fatos --check` → `validar-fala --all`. A bateria completa
do [CLAUDE.md](../../../CLAUDE.md), com `git add -A` **antes** (os portões são
cegos a arquivo novo). `scripts/gui-captura/retratar_abas.py` rodado com a leva
parada, e as onze fotos no mesmo commit que tocar `app/` ou `gui/`.
**A mordida.** Não tem cura própria — a prova é a saída dos onze comandos e a
confirmação de que **só a aba tocada mudou** entre as fotos.
**Custo.** ~2 h.
**Classe de tela:** carrega a foto da Z6-06.

---

## 8. O que o Bluetooth bloqueia

**A trilha de rádio é dela (D2, §0.7 do SPRINT_ORDER), e esta frente não mede
Bluetooth.** O que a Z6 **não pode afirmar na tela** enquanto a medição dela não
existir:

| O que fica proibido | Por quê |
|---|---|
| escrever frase de rádio nova para qualquer chave cujo `radio_de_onde_sei` **não** seja `medido` | é `inferido-do-codigo`, e a tela não pode promover inferência a fato. O lugar dessas é `AFIRMA_NADA` + `porque=`, ou `Pendencia` |
| publicar número novo do microfone por rádio no lugar do caduco da Z6-09 | o `radio_aciona` da linha 23 é `parcial`, a ponte é **opt-in e declarada insegura** no próprio CSV, e ninguém remediu o ciclo de mudo. **O `README.md` fica com a ausência declarada, não com um número** |
| usar `AFIRMA_ACIONA` para alto-falante, gatilho, barra de luz ou vibração por rádio | são exatamente as perguntas abertas da §0.7. A Z6 dá o mecanismo; o veredito é da bancada |
| desligar comportamento por `aciona` | a fronteira da PAREAMENTO-01: `aciona` é afirmação sobre **o nosso produto na bancada dela**, e desligar por ele é a mesa dela virando teto do mundo. Só `existe == "nao-tem"` pode esconder |

**O que a Z6 PODE afirmar, porque já está medido:** a cor do plástico por rádio
(`HANDSHAKE 0x04`, `btmon`, 23/08 — é a Z6-05/Z6-06), a **ausência** da placa
ALSA por rádio (medida em 15/08 pela troca de braços, com bruto no caderno de
ensaios), e as três taxas de 25/07 (Z6-08).

**E o laço que esta frente devolve para a trilha dela:** cada `Pendencia` aberta
aparece no `--fila` e no `painel.html` com prazo, quem fecha e o que falta
(Z6-11). **A tela passa a produzir a lista de compras da bancada.** É a resposta
mecânica à pergunta que abre esta página.

---

## 9. As dependências

**Do que a Z6 depende, dentro da Onda 0:** de **nada**. Ela e a Z0 começam no dia
1 (§0.2). As três peças criam arquivos que hoje não existem (§2.11) e não colidem
com Z1, Z2, Z3, Z4, Z5 nem Z7.

**Uma ressalva de foto, não de código:** a Z6-06 é ESTRUTURAL e precisa do olho
dela sobre uma foto **verdadeira**. A frase mora na aba Configurações, que **não**
está entre as cinco abas cegas da Z0 — logo a foto de hoje serve. Se a Z0 mudar
o host de Configurações, a foto da Z6-06 é refeita depois dela.

**Quem depende da Z6:** oito das onze abas — Status (3), No jogo (4), Emulação
(5), Lightbar (7), Gatilhos (8), Rumble (9), Navegação (10) e Sistema (11), como
declarado na §0.3 do SPRINT_ORDER. O que muda em cada uma está no §4.

**As três que NÃO a declaram, e a correção medida.** Configurações (1), Início
(2) e Perfis (6) não citam Z6 na §0.3. **Para a aba Configurações isso está
errado**, e a medição é a do §2.4: **sete das oito frases de transporte da tela
moram em `app/actions/config/`**, e a frase que a Z6-06 reescreve é consumida só
por `app/actions/config/secao_controles.py`. Consequências, e as duas são de
coordenação:

- **A Onda 1 · Configurações passa a depender da Z6** — quem for dono daquela
  onda acrescenta a dependência na sua linha da §0.3 no mesmo commit, com o
  motivo em uma linha. A
  [CONFIGURACOES-FECHA-01](2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md)
  já carrega a varredura dos caducos (`grep -rn "55-75\|40% do sinal"`) como
  tarefa própria: **é a mesma varredura da Z6-09, e ela tem de ter um dono só.**
  A recomendação desta página: o mecanismo é da Z6-09; a limpeza da aba é da
  Onda 1, de carona.
- **A Z6-06 toca arquivo da aba Configurações.** A6 é o dono do
  `external_card.py` **nesta leva**; se a Onda 1 estiver correndo em paralelo,
  as duas não podem tocar o arquivo ao mesmo tempo (R1). Ou a Z6-06 espera, ou a
  Onda 1 a absorve.

**Início (2) e Perfis (6):** nenhuma das 8 frases medidas mora nelas, e a régua
tem falso-negativo conhecido (§2.5). **NÃO VERIFICADO** se estão de fato livres —
quem fechar cada uma confere pelo registro `Fala`, não por `grep`.

---

## 10. O aceite

**O da §0.2 é o piso, e são os quatro primeiros.** Cada um com o comando.

1. **Plantar na tela uma frase que promete no rádio o que o CSV mede como `não`
   faz o portão REPROVAR nomeando arquivo, linha e chave.** A mordida é em
   `src/hefesto_dualsense4unix/app/audio_saida.py:1017` — arrancada, vista
   reprovar, devolvida, **com a saída colada no commit**. Hoje passa verde:
   `check_paridade_transporte.py`, `validar-palavra-de-tela.py --all` e
   `gerar-mapa.py --check` saem 0 com a frase plantada (§2.9).
2. **Trocar `HZ_INPUT_SEM_MIC` sem atualizar a `radio_ressalva` reprova**, e a
   mensagem traz os dois valores e os dois endereços
   (`integrations/radio_da_mesa.py:120` e `docs/data/mapa-controles.csv:111`
   → a linha do mic é a **23**).
3. **Devolver o parágrafo caduco de `README.md:219` reprova citando
   `audio.microfone@dualsense`** e a data da caducidade.
4. **A varredura de caducos roda DUAS vezes e não acha nada na segunda:**
   ```bash
   python3 scripts/validar-caducos.py --all && python3 scripts/validar-caducos.py --all
   grep -rn "55-75\|55 a 75\|40% do sinal" README.md docs/usage/ src/   # -> vazio
   ```
5. `python3 scripts/gerar-fatos-de-tela.py --check` sai 0 na árvore limpa e
   **reprova com diff** depois de uma célula editada.
6. `python3 scripts/validar-fala-de-tela.py --all` sai 0, e **cada uma das seis
   mordidas da Z6-04** foi arrancada, vista reprovar e devolvida.
7. `python3 scripts/validar-fala-de-tela.py --fila` lista os placeholders com
   `arquivo:linha`, e o número **bate com `grep -c "pendente="` contado à mão**.
8. **`AFIRMA_NAO_ACIONA` numa chave com `por_que_nao_aciona = divida` reprova**,
   e a mensagem oferece `AFIRMA_NADA` + `porque=`. Sem isto o portão licencia
   frase que culpa o aparelho pelo que é nosso.
9. Renomear um `id` reprova; **e `git clone --depth 1` da árvore faz os dois
   portões que comparam com o passado reprovarem pedindo histórico**, em vez de
   sair 0. Os dois jobs do `ci.yml` que os rodam têm `fetch-depth: 0`.
10. A dica da cor no rádio **não promete mais o que o firmware recusou**, e a
    foto antes/depois foi vista **por ela**.
11. `Pendencia` com valor numérico ou booleano **não constrói** — e arrancar a
    recusa do `__post_init__` faz o teste reprovar.
12. A bateria completa do [CLAUDE.md](../../../CLAUDE.md) verde, com `git add -A`
    antes, `scripts/gui-captura/retratar_abas.py` rodado com a leva parada, e as
    onze fotos no mesmo commit que tocar `app/` ou `gui/`.

---

## 11. O que fica aberto, e de quem é

- **A dependência da Onda 1 · Configurações, e a colisão da varredura de
  caducos** (§9). É de coordenação, não de código. **Uma linha na §0.3 do
  SPRINT_ORDER** resolve, e quem for dono da Onda 1 a escreve.
- **A frase que substitui o número caduco do microfone no `README.md`.** A Z6-09
  apaga; **quem escreve o substituto é ela** — é a regra de 15/08, quando um
  texto medido foi enfraquecido para caber na tela e ela derrubou. Enquanto não
  houver frase, vale a ausência declarada.
- **A premissa errada da PAREAMENTO-01 sobre `validar-palavra-de-tela.py`**
  (§2.4). Fato errado se substitui; a página é de outro dono, e quem a abrir
  corrige no mesmo commit.
- **O carimbo de tempo das fotos contra o que o COMO-REGER-AGENTES publica**
  (§3). Não é achado desta frente — é da Z0, e a conferência é pelo **conteúdo**
  da foto.
- **P-09 (o portão cresce de "avisa" para "reprova", uma aba por vez) não entra
  nesta leva.** Ele depende de as abas terem `Fala` declarada, e no dia 1 o
  registro tem duas entradas. `ABAS_COM_FALA_DECLARADA` nasce **vazio**, e cada
  onda de aba promove a sua — 1 linha, na leva que fecha a aba.
- **P-10, o sinônimo** (`app/widgets/controller_card.py:592`, `DICA_MIC_ESCALA`:
  a tela fala do volume do PipeWire, o mapa fala do byte 6 do firmware). É
  **decisão de modelagem, dela ou de quem for dono do mapa**: linha nova
  (`audio.microfone.volume_do_sistema@dualsense`) ou `AFIRMA_NADA` + `porque=`.
  A recomendação da PAREAMENTO-01 é a linha nova, e esta página concorda.
- **O teto real da população de frases de transporte continua NÃO VERIFICADO**
  (§3). 8 é o que uma régua de fluxo alcança; a cegueira dela está medida.
- **As oito colunas alcançadas só por sufixo** (`*_offset`, `*_de_onde_sei`,
  `*_evidencia`, `*_detalhe`) continuam sem nome próprio — renomear qualquer uma
  quebra em silêncio. Mesma família da Z6-07, fora do escopo desta leva.

---

**Nada disto foi executado.** Esta página planeja, e a execução é de outra leva.
O contrato está na
[PAREAMENTO-01](2026-08-24-PAREAMENTO-01-a-medicao-nova-tem-de-chegar-sozinha-na-tela.md);
a regência, em [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md); o diagnóstico que
gerou a Onda 0, em
[2026-08-23-ONDE-PARAMOS](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md).
