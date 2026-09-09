# VIBRA-MULT-01 · o botão que ela aperta era o único que não multiplicava

**Sprint:** `VIBRA-MULT-01` (lote `LOTE-0909`) · **agente:** opus · **árvore:**
`hefesto-voo/VIBRA-MULT-01-opus`, branch `voo/VIBRA-MULT-01-opus`, nascida de
`dev` em `e5f4b3da` (conferido: `git log -1 --format=%h`).

**A sprint chegou com dois terços fechados e o terço que sobrava marcado como
"da mão dela".** A `(b)` — a conta `degrau × barra` em `gamepad._mults_por_motor` —
passava, com 55 réguas. A `(c)` — a tela, que imprimia `mult 200%` sobre dois
motores parados — fechou em 09/09 de manhã. O que a sprint dizia faltar era a
`(a)`, a premissa física, que é de bancada.

**Mas havia um terceiro caminho que ninguém tinha medido, e é por ele que a mão
dela passa: o botão "Testar".** A queixa que abriu esta sprint é
*"na guia vibração os slicers não estão se multiplicando"* — e ela é literal.
Medido nesta árvore: com a barra do motor esquerdo em **ZERO**, o "Testar"
mandava `rumble.set(160, 220)`, o mesmo par de quando ela está em 100. O motor
que ela mandou calar tremia igual ao outro.

---

## O que mudou

### 1. `_par_das_barras` lia duas chaves que o daemon nunca publicou ali

`interface/pacotes/a05_vibracao._par_das_barras` fazia:

```python
v = _do_vpad(ctx.state.get("rumble_ff") or {}, ctx.por_uniq(uniq).get("player"))
strong = int(v.get("last_strong") or 0)
weak = int(v.get("last_weak") or 0)
if not weak and not strong:
    weak, strong = PAR_DE_TESTE
```

`v` é um bloco de `per_vpad`. **`last_weak` e `last_strong` não existem em
`per_vpad`** — elas moram no TOPO do `rumble_ff`
(`daemon/ipc_handlers.py:3529`; o bloco por vpad começa em `:3361` e o que ele
tem do assunto é `rumble_no_fisico`). As duas leituras davam `0` em toda
execução de produção, o `if` caía sempre no `PAR_DE_TESTE`, e o "Testar"
mandava `(160, 220)` **fizesse ela o que fizesse com as barras**.

O nome prometia as barras e o corpo devolvia uma constante. É a assinatura que
esta casa já nomeou: *o instrumento responde sobre outra coisa que não o
produto* — só que desta vez quem respondia sobre outra coisa era o produto.

**Medido, antes da cura** (sonda com a ponte dublê, o `state_full` montado com o
`rumble_ff` cheio como o daemon o publica):

```
barras 100/100                  -> rumble.set(160, 220)
barras   e=50 d=100             -> rumble.set(160, 220)
barras   e=0  d=100             -> rumble.set(160, 220)
```

**Depois:**

```
barras 100/100                  -> rumble.set(160, 220)   <- byte-idêntico
barras   e=50 d=100             -> rumble.set(160, 110)
barras   e=0  d=100             -> rumble.set(160,   0)
```

O `_do_vpad`, que existia só para essa leitura, saiu com ela — com a lápide no
lugar onde estava.

### 2. E a leitura curada sozinha não bastaria: o caminho do rumble FIXADO não aplica a barra

`gamepad._mults_por_motor` diz de si, em letras maiúsculas, *"É O ÚNICO LUGAR
ONDE A MULTIPLICAÇÃO ACONTECE"*. A frase é verdadeira e **o lugar é o caminho
do JOGO**: o único chamador é `gamepad.apply_game_rumble:1347`, o FF do vpad.

O par FIXADO — que é o que o "Testar" manda — vai por outros dois, e os dois
aplicam **um fator só, o degrau, igual nos dois motores**:

| porta | onde | o que aplica |
| --- | --- | --- |
| `rumble.set` | `daemon/ipc_handlers._handle_rumble_set:4959` | `apply_rumble_policy` → `_effective_mult` (um `mult`) |
| o reassert de 5 Hz | `daemon/subsystems/rumble.reassert_rumble:288-290` | `_effective_mult` (o mesmo `mult` nos dois) |

Logo, mesmo com a chave certa, arrastar a barra não mudaria uma vírgula do que
a mão dela sente.

**A cura desta sprint é a metade que cabe na posse dela:** a aba manda o par já
reduzido pela barra de cada motor, e o degrau continua sendo dos três andares
do daemon que já o aplicavam — a política global em `apply_rumble_policy`, a
escala por controle em `profiles/manager._controllers_to_rumble_scales`, o teto
do card do cabo no backend. O que a mão dela sente passa a ser
`base × barra × degrau`: **o mesmo produto que `_mults_por_motor` monta para o
jogo**, com cada metade aplicada por quem já a aplicava.

Está declarado como PROVISÓRIO no fonte, com a razão e o endereço da cura
definitiva. A outra metade está na §*O que sobrou*.

### 3. O "ao vivo" chegava um tique atrasado

O `ctx` de um gesto é o retrato ANTERIOR ao `rumble.motores.set` que acabou de
responder: `state.rumble_motores` ainda traz a barra velha. Reenviar lendo só o
`state` faria ela sentir o valor de **antes** do arraste — um "ao vivo"
atrasado em um tique, que é a forma mais convincente de um ajuste parecer que
não funciona. O gesto `motor` passa a dizer o que acabou de gravar
(`_refrescar_o_teste(..., acabou_de_gravar=(lado, pontos))`).

O gesto `forca` **não** leva o parâmetro, e a diferença é de andar: a barra é o
fator que a aba aplica; o degrau é aplicado pelo outro lado sobre o par que
chega. Reenviar o mesmo par já basta — quem o escala é o daemon, com o número
novo. Está escrito no lugar.

### 4. Um comentário que afirmava o contrário do que o produto fazia

Em `_aplicar_a_forca`: *"A força e a intensidade multiplicam as barras
(`efetivo = degrau x barra`), então mudá-las com o teste ligado tem de chegar à
mão dela"*. A casa acreditava que chegava. Não chegava — e o comentário é de
07/09.

**REESCRITO NO REPARO DE 09/09, e até lá esta afirmação era falsa** — as três
linhas originais continuavam no arquivo, com o texto novo ACRESCENTADO abaixo
delas; ver a §*Reparo 09/09*. O comentário de hoje nomeia os dois donos
(`base x barra x degrau`, a barra da aba e o degrau do daemon) e guarda, datada,
a frase que dizia o contrário.

---

## Qual mordida prova

Régua nova: `tests/unit/test_o_testar_leva_a_barra_de_cada_motor.py` — **12
casos**: os 9 da cura, mais os 3 da guarda que o reparo de 09/09 acrescentou
(§*Reparo 09/09* nº 4).
Ela dirige o **gesto de verdade** com a `PonteDeMentira` da régua irmã — o
dublê que sabe recusar —, e não a função interna: uma régua que chamasse
`_par_das_barras` direto ficaria verde no dia em que o `testar` deixasse de
chamá-la.

**Três mordidas, e as três reprovaram.**

**Mordida 1 — arrancar a redução** (`_par_das_barras` devolvendo
`PAR_DE_TESTE` seco):

```
FAILED test_a_barra_esquerda_pela_metade_corta_o_strong_pela_metade
FAILED test_o_motor_posto_em_zero_nao_treme
FAILED test_a_barra_direita_mexe_no_weak_e_nao_no_strong
FAILED test_o_par_do_teste_nao_vem_do_que_o_jogo_pediu
FAILED test_cada_coluna_leva_a_barra_da_peca_dela
FAILED test_o_arraste_reenvia_o_valor_que_acabou_de_gravar
6 failed, 3 passed
```

Os 3 que ficam verdes são exatamente os de *"o que NÃO muda"* — sem barra
escrita e com as duas em 100 o par tem de continuar `(160, 220)`. Uma régua que
ficasse toda vermelha ali estaria medindo a identidade errada.

**Mordida 2 — trocar os lados** (`barras["d"]` ↔ `barras["e"]`): as mesmas 6,
com `At index 0 diff: 40 != 160`. É a inversão `weak`/`strong`, que é a
armadilha deste assunto (`core/backend_pydualsense.py:3840`,
`setLeftMotor(eff_strong)`) — uma troca aqui reduziria o punho errado, e a mão
dela seria o único instrumento que veria.

**Mordida 3 — tirar o `acabou_de_gravar`** do gesto `motor`:

```
E  AssertionError: o reenvio levou (160, 220); a barra que ela ACABOU de
   gravar é 25 %, e 220 x 25 % é 55 — o estado ainda diz 100
1 failed, 8 passed
```

**Cura devolvida:** `9 passed in 0.50s` — e `12 passed in 0.55s` depois da
guarda do reparo.

**Sem regressão nos vizinhos**, e o comando está aqui para a próxima pessoa
reproduzir sem adivinhar a lista:

```bash
source .envrc-voo && .venv/bin/python -m pytest -q \
  $(ls tests/unit | grep -E 'vibra|rumble|a05|aba_05|pacote|piloto|casa_sabe|interface' \
    | sed 's|^|tests/unit/|')
```

→ **50 arquivos, `722 passed, 7 skipped in 166.70s`** (medido no reparo de
09/09, e o número é o desta árvore).

**ESTA LINHA DIZIA `731 passed`, E NÃO REPRODUZIA.** O conferente rodou a mesma
lista e chegou a outro número; rodado de novo com o comando acima, saem 722. O
731 não tem procedência — não foi anotado com o comando ao lado e não sobrevive
a uma segunda corrida, então sai. **E os 722 não incluem a régua desta sprint:**
`test_o_testar_leva_a_barra_de_cada_motor.py` não casa nenhuma das oito palavras
do `grep`, nem o `test_cada_motor_tem_o_seu_multiplicador.py`. Os dois se medem
à parte, e é o «lote» da §*Reparo 09/09*.

---

## O que eu medi, com a chave do mapa ao lado

A medição é de **INTERFACE, com ponte dublê** — não houve aparelho. O degrau da
escada que ela alcança é **MONTOU**: o par sai da aba com a barra de cada motor
aplicada. Nada aqui diz que saiu no fio nem que o aparelho obedeceu.

| chave (`docs/data/mapa-controles.csv`) | transporte | até onde foi | o que vi |
| --- | --- | --- | --- |
| `vibracao.rumble.esquerdo@dualsense` | indistinto (a aba não vê transporte) | MONTOU | o `strong` do "Testar" passa a sair reduzido pela barra do punho esquerdo: `e=50 → 110`, `e=0 → 0`. Antes saía `220` nos três casos |
| `vibracao.rumble.direito@dualsense` | indistinto | MONTOU | o `weak` segue a barra do punho direito: `d=50 → 80`. A inversão `weak`=direita está provada pela mordida 2 |
| `vibracao.rumble.passthrough@dualsense` | — | não mexi | é o caminho do JOGO, e é o único que já aplicava `_mults_por_motor`. Continua como estava, byte a byte |

**Não editei `docs/data/mapa-controles.csv`** — ele é da posse da
`TUDO-FUNCIONA-01`. As três linhas acima são para quem escreve o mapa.

---

## Os portões: 52 de 54, e os dois vermelhos NÃO são meus

`git add -A && bash scripts/portoes.sh` → `REPROVOU: 2 vermelho(s) de 54`.
Saída inteira em `/tmp/portoes-VIBRA-MULT-01.txt`.

**A prova de que os dois vieram da base, e ela é de identidade de arquivo, não
de opinião:** `git diff e5f4b3da --stat` são **4 arquivos** — a entrega, a
sprint, `a05_vibracao.py` e a régua nova. `git diff e5f4b3da --name-only` para
os cinco arquivos que os dois portões acusam volta **vazio**: eles estão
byte-idênticos ao `dev` de onde esta árvore nasceu.

| portão | o que acusa | de quem é |
| --- | --- | --- |
| `acentuacao` | 20 violações em `scripts/check_cabo_bt_perfil_controle.py` (11), `tests/unit/test_portao_a_regua_das_quatro_respostas.py` (8) e `scripts/ensaios/a_janela_cabe_no_que_ela_ve.py` (1) | os dois primeiros nasceram hoje com a `CABO-BT-PERFIL-CONTROLE-01`; `scripts/` é posse da `TUDO-FUNCIONA-01`. Não toquei |
| `citacoes-no-codigo` | `interface/monta.py:291` cita `aba03.py:878`, **que está em branco** — âncora em linha vazia | `aba03.py` é posse da `ROLAGEM-01`, que está em voo neste mesmo lote e mexe justamente nessa aba. Corrigir o número aqui seria corrigir contra um arquivo que vai mudar |

**O `janela-nao-confessa` passou** (110 ms) — o vermelho do `reb/` avisado no
despacho não apareceu nesta árvore.

Os 52 restantes verdes, `ruff check src/ tests/` e `mypy` incluídos.

---

## O que NÃO verifiquei

* **NADA NO APARELHO.** A bancada estava LIVRE (`scripts/bancada.sh exigir`,
  rc=0), mas o que falta na `(a)` não é acesso ao hardware — é a **mão dela**:
  o veredito de qual motor treme mais é sentido, não medido. Não reservei a
  bancada, não escrevi um byte em controle nenhum, e não rodei o
  `o_multiplicador_chega_ao_motor.py`. A `(a)` continua exatamente onde a
  sprint a deixou.
* **A conta do daemon com o par novo.** Provei que a aba MANDA o par reduzido.
  Não provei, com daemon vivo, que `_handle_rumble_set` o recebe e escreve —
  isso é a `(a)` de novo, e é a mesma mão.
* **A saturação do par de teste em degrau alto.** `PAR_DE_TESTE` é `(160, 220)`
  e o daemon multiplica pelo degrau: com "Máximo" (1,5) o `strong` pede 330 e o
  `min(255, …)` corta. **Isto é anterior a esta cura e não foi introduzido por
  ela** — com as duas barras em 100 e degrau máximo, a razão 220/160 que ela
  sente vira 255/240. Não mexi no par de teste: mudar o que o "Testar" vale por
  padrão é decisão de produto sobre o que a mão dela sente, e está na §*O que
  sobrou*.
* **A janela GTK e o `hef test rumble`.** Os dois mandam `rumble.set` e
  continuam sem a barra. Não os toquei.
* **Não abri tela nenhuma.** A cura é de gesto e de par de bytes; o desenho da
  aba 05 não mudou uma linha, então não há foto de antes e depois a tirar. O
  `interface/aba05.py`, que é da posse, não foi editado.

---

## O que sobrou para o próximo

### 1. A CURA DEFINITIVA É DO DAEMON, e ela cobre os chamadores que sobraram

**O que fazer:** `_mults_por_motor` nas duas portas do rumble FIXADO, do jeito
que `apply_game_rumble` já faz — e a conta continua num lugar só.

| arquivo | linha | hoje | tem de ser |
| --- | --- | --- | --- |
| `daemon/ipc_handlers.py` | `:4959` | `apply_rumble_policy(self.daemon, weak, strong)` | os dois fatores de `gamepad._mults_por_motor(daemon, now, uniq_do_alvo_de_output(self.controller))` |
| `daemon/subsystems/rumble.py` | `:288-290` | `weak_raw * mult` / `strong_raw * mult` | os dois fatores, com `cfg.rumble_active_uniq` como alvo (o dono já está congelado ali) |

**Nenhum dos dois é da posse desta sprint**, e é por isso que estão aqui em vez
de no diff. Nenhuma sprint do `LOTE-0909` os declara — conferido nos cinco
frontmatters —, então quem os tomar não colide com ninguém.

**O que isso desbloqueia:** o `hef test rumble` e o "Testar" da janela GTK
passam a respeitar a barra, e a metade provisória da aba pode sair (a linha do
`_reduzido_pela_barra` some e o par volta a ser `PAR_DE_TESTE` seco).

**Byte-idêntico para quem não escreveu barra:** `_pcts_dos_motores` devolve
`(100, 100)` sem opinião, então nenhum perfil de hoje muda.

**A ARMADILHA, e ela é REAL — leia antes de fazer:**
`scripts/ensaios/o_multiplicador_chega_ao_motor.py` **pré-multiplica o par pela
barra** (`_par_da_conta`, que chama `_mults_por_motor` com um daemon sintético)
e manda o resultado pelo `rumble.set`. Com a cura acima o daemon multiplicaria
de novo, e a razão que a mão dela sentiria seria `barra²` — `0,25` onde o
cabeçalho do ensaio imprime `0,50`. **O ensaio tem de passar a mandar a base
CRUA e deixar o daemon fazer a conta** — o que, de quebra, o torna melhor: ele
passaria a medir o caminho do PRODUTO de ponta a ponta em vez de reproduzi-lo.
`scripts/` é posse da `TUDO-FUNCIONA-01`; as duas mudanças têm de andar juntas.

### 2. O par de teste satura no degrau "Máximo" — e é decisão dela

`PAR_DE_TESTE = (160, 220)` × 1,5 corta o `strong` em 255. Com as duas barras
em 100 e a força no máximo, ela sente `255/240` onde o desenho promete
`220/160`. As saídas honestas são baixar o par de teste (para caber com folga
no degrau mais alto) ou dizer na tela que o máximo satura. **O que ela sente ao
clicar "Testar" é decisão dela**, e o `PAR_DE_TESTE` tem uma segunda cópia em
`app/actions/rumble_actions.py:1078` — as duas têm de andar juntas, e o próprio
fonte já declara que são duas.

### 3. A `(a)` continua aberta, e agora com uma pergunta a mais

A premissa física — *os dois motores obedecem a um par assimétrico, ou o
firmware os iguala por baixo?* — segue sem linha no `docs/data/ensaios.csv`.
Com esta cura há uma segunda pergunta para a mesma mão, e ela é mais barata:
**com o "Testar" ligado, arrastar a barra de um punho muda o que aquele punho
faz?** Isso ela responde sem instrumento nenhum, na aba, com o controle na mão
— e é a prova de que a queixa que abriu esta sprint fechou.

---

## Reparo 09/09

O conferente confirmou as três mordidas e o commit, e devolveu três achados. Os
três eram do mesmo tipo, e vale dizê-lo antes da lista: **nenhum era código
errado — os três eram a ENTREGA afirmando mais do que o diff sustentava.** Um
fato vivo em dado versionado, uma afirmação sem prova e um número que não
reproduzia.

### 1. O fato errado que sobreviveu em `docs/data/`, e portão nenhum o pega

O commit MATOU a leitura de `last_weak`/`last_strong` do `per_vpad` — e **duas
linhas de `docs/data/paridade-gtk-html.csv` continuavam descrevendo-a como o
comportamento do produto**, para quem lesse o dado em vez do fonte:

| linha | o que dizia | o que é verdade hoje |
| --- | --- | --- |
| `:172` `Testar (…)` | *"lê `last_strong`/`last_weak` do `per_vpad` daquele jogador, cai no par 160/220 se as duas forem zero (…) dorme 0,5 s (…) então `rumble_stop` + `rumble_passthrough(True)`"* | monta o par a partir de `PAR_DE_TESTE` **reduzido pela barra de cada motor**; não dorme e não para sozinho — o teste FICA ligado e o `parar` é que devolve a mão ao jogo |
| `:173` `O par padrão 160/220 (…)` | *"`PAR_DE_TESTE`, aplicado quando `last_weak` e `last_strong` são zero"* | o par é a BASE sempre, sem condição nenhuma, e a barra de cada motor o reduz |

Substituído nas duas, e não anotado ao lado. **A célula guarda o que era falso,
datado e nomeado como passado** — o teste da casa dá "decisão medida": quem não
souber que a leitura do `per_vpad` era morta a reintroduz.

**DUAS COISAS A MAIS CAÍRAM JUNTO, e nenhuma era minha:** o *"dorme 0,5 s"* de
`:172` estava velho desde **07/09**, quando o "Testar" virou estado a pedido
dela; e o `porque` de `:173` citava `a05_vibracao.py:240-244` para a declaração
do `PAR_DE_TESTE`, que hoje mora na linha 905. Estavam dentro das duas células
que eu tinha de reescrever — deixá-los seria guardar o errado ao lado do certo.

**O QUE EU NÃO MEXI, e a razão:** `veredito`, `sinal`, `feature` e os endereços
das duas linhas. Mudar um `veredito` move a contagem publicada do TERCEIRO
NÚMERO desta casa (regra 8 do portão, `numero-publicado`), e o `:173` é
defensável como `IGUAL` — os dois lados carregam o mesmo par padrão, e com as
duas barras em 100 o que sai no fio é byte-idêntico. **O que a nova célula diz
com todas as letras é que a CONDIÇÃO divergiu**, e a retriagem do veredito é de
quem tem a posse: `docs/data/paridade-gtk-html.csv` está declarado na
`MESA-DE-QUATRO-01`, que está **aberta**. As duas edições são de prosa, em
células que aquela sprint não tem razão de tocar.

`scripts/check_paridade_gtk_html.py` → `rc=0`, e a contagem não se moveu:
`396 features · 144 IGUAL · 160 DIFERENTE · 29 FALTA_NO_HTML · 59 SO_NO_HTML ·
4 NAO_DA_PARA_SABER (36%)`.

**E ELE NÃO PEGARIA ISTO, que é o achado dentro do achado:** o portão confere
que o endereço abre e que o `sinal` está no escopo — **não que a prosa descreva
o produto**. As duas linhas estavam falsas e ele estava verde. Nenhum
instrumento desta casa lê prosa de CSV, e eu não escrevi um: uma régua que
tentasse seria a régua que compara o produto contra ele mesmo. Fica declarado —
é a mesma disciplina da §*O que NÃO verifiquei*.

### 2. A afirmação sem prova no diff — o comentário que eu disse ter reescrito

A §4 dizia que o comentário de 07/09 em `_aplicar_a_forca` foi *"corrigido
nomeando qual metade é de quem"*. **Ele não foi.** As três linhas originais —
*"A força e a intensidade multiplicam as barras (`efetivo = degrau x barra`)"* —
continuavam intactas; o que o commit fez foi ACRESCENTAR o bloco novo do
`acabou_de_gravar` **abaixo** delas. Lido de cima para baixo, o arquivo abria
com a frase falsa e explicava a certa oito linhas depois.

**Reescrito de verdade agora** (`interface/pacotes/a05_vibracao.py`, no corpo de
`_aplicar_a_forca`, logo depois do `_gravar_a_forca`). O texto de hoje nomeia os
dois donos — a BARRA é da aba (`_par_das_barras`), o DEGRAU é do daemon — e
guarda a frase de 07/09 datada, com a razão de ela ter sido falsa: o caminho do
rumble FIXADO aplicava só o degrau, e a barra não chegava ao motor em lugar
nenhum.

Escolhi reescrever em vez de corrigir a entrega porque a afirmação era a MELHOR
das duas: um comentário que diz o contrário do produto é a família de defeito
que esta casa persegue, e ele estava a oito linhas de um bloco que já explicava
a repartição certa.

### 3. O número que não reproduzia

`731 passed, 7 skipped` não sobrevive a uma segunda corrida. Rodado com o
comando escrito por extenso, na §*Qual mordida prova*, saem **`722 passed,
7 skipped in 166.70s`** nos mesmos 50 arquivos — e o comando ficou ao lado do
número, que é o que faltava. O 731 saiu do arquivo: número sem procedência não é
decisão medida, é afirmação que a medição derrubou.

**E o `grep` não alcança a régua desta sprint.** Nem
`test_o_testar_leva_a_barra_de_cada_motor.py` nem
`test_cada_motor_tem_o_seu_multiplicador.py` casam as oito palavras da lista —
os dois arquivos que mais importam para esta sprint estavam FORA do número que a
entrega publicava como "sem regressão nos vizinhos". Medidos à parte, nas duas
ordens (contra contaminação por ordem, que já custou a esta casa):

```
.venv/bin/python -m pytest -q tests/unit/test_o_testar_leva_a_barra_de_cada_motor.py \
                              tests/unit/test_cada_motor_tem_o_seu_multiplicador.py
→ 71 passed in 1.58s      (e 71 passed também na ordem inversa)
```

### 4. A GUARDA DO RISCO QUE EU DECLAREI — três réguas, e elas reprovam num dia marcado

**Isto não é cura: é o alarme da cura que ainda não veio.** A repartição desta
sprint é provisória por desenho — a aba pré-multiplica pela barra, o daemon
aplica só o degrau. No dia em que a cura definitiva chegar (as duas portas do
rumble FIXADO passando por `_mults_por_motor`, §*O que sobrou* nº 1), **a barra
é contada DUAS vezes** e o que a mão dela sente vira `base × barra² × degrau`:
com a barra em 50 %, o motor cai para 25 %.

Sem guarda, **o instrumento que veria isso primeiro seria a mão dela** — e a
descoberta chegaria como queixa, que é exatamente o ciclo que abriu esta sprint.

A §3 nova de `tests/unit/test_o_testar_leva_a_barra_de_cada_motor.py`:

| régua | o que fixa | o que ela diz quando reprova |
| --- | --- | --- |
| `test_o_rumble_fixado_aplica_um_fator_so_nos_dois_motores` | `apply_rumble_policy` com barra assimétrica no perfil devolve os DOIS motores com o mesmo fator | *"a conta DOBROU (…) a cura é tirar o `_reduzido_pela_barra` da aba NO MESMO COMMIT"* |
| `test_o_reassert_de_5hz_aplica_um_fator_so_nos_dois_motores` | o laço de 200 ms escreve `(150, 150)` no dono, e não `(150, 75)` | *"o motor que ela pôs em 50 % está em 25 %"* |
| `test_a_conta_inteira_da_barra_vale_uma_vez_so` | a conta de ponta a ponta: o gesto dela → a aba → o daemon → **165** | `165` é `base × barra × degrau`; `82` é `barra²` |

**Elas não impedem a cura definitiva** — exigem que as duas metades andem
juntas. Quem curar o daemon vê o vermelho, lê o endereço do que tirar da aba, e
fecha as duas no mesmo commit.

**AS DUAS MORDIDAS, feitas e vistas** — e cada uma é a cura definitiva escrita
de propósito, não um estrago sintético:

```
mordida A — `apply_rumble_policy` multiplicando também pela barra:
  FAILED test_o_rumble_fixado_aplica_um_fator_so_nos_dois_motores
         AssertionError: `apply_rumble_policy` devolveu (150, 75) …
  FAILED test_a_conta_inteira_da_barra_vale_uma_vez_so
         AssertionError: o par que chega ao motor é (240, 82) …
  2 failed, 10 passed

mordida B — `reassert_rumble` multiplicando também pela barra:
  FAILED test_o_reassert_de_5hz_aplica_um_fator_so_nos_dois_motores
         AssertionError: o reassert escreveu [('aabbcc000001', 150, 75)] …
  1 failed, 11 passed
```

Nos dois casos os arquivos do daemon voltaram byte-idênticos
(`git diff --stat` vazio nos dois).

**E A MORDIDA CORRIGIU UM NÚMERO MEU:** eu tinha escrito `83` na mensagem da
terceira régua, derivando `220 × 50 % × 1,5 × 50 %` de cabeça. A mordida imprimiu
**82** — `round(82.5)` em Python arredonda para o PAR. Uma mensagem de falha que
nomeia um número que o leitor não vai ver é uma mentira pequena, e ela custa
exatamente no minuto em que alguém está tentando entender por que a régua ficou
vermelha. Corrigido nos dois lugares, com a razão escrita ao lado.

**O harness veio dos vizinhos, e não é preguiça:** `_daemon`, `_grava`,
`_Backend`, `_degrau` e a fixture `perfis` são importados de
`test_cada_motor_tem_o_seu_multiplicador.py`. Uma segunda cópia do daemon de
mentira divergiria do real no primeiro dia em que `_effective_mult` mudasse de
forma — e a peça é a MESMA dos dois lados (`CHAVE_P1 == BRANCO ==
`aabbcc000001``, com um `assert` que reprova se um dia deixarem de ser), senão a
régua estaria compondo a barra de um controle com o degrau de outro.

### O que este reparo NÃO fez

* **Não adiantei a árvore.** Ela nasceu de `e5f4b3da` e o `dev` está em
  `bb87d7df`. Os vermelhos `acentuacao` e `citacoes-no-codigo` da §*Os portões*
  **já foram curados lá** (é o próprio `bb87d7df`), e por isso ainda aparecem
  aqui: é atraso de base, não dívida desta sprint. Não fiz merge — não é o
  contrato deste reparo.
* **Não toquei o daemon.** As duas portas da cura definitiva continuam onde
  estavam; o que mudou é que agora há alarme sobre elas.
* **Não mexi em veredito nenhum do CSV**, pelo que está na §1 acima.
* **Nada no aparelho, e nenhuma tela aberta.** A §*O que NÃO verifiquei* segue
  valendo inteira: a `(a)` continua sendo a mão dela.
