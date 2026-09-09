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
07/09. Corrigido nomeando qual metade é de quem.

---

## Qual mordida prova

Régua nova: `tests/unit/test_o_testar_leva_a_barra_de_cada_motor.py` (9 casos).
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

**Cura devolvida:** `9 passed in 0.50s`.

**Sem regressão nos vizinhos:** os 50 arquivos de `tests/unit` que casam
`vibra|rumble|a05|aba_05|pacote|piloto|casa_sabe|interface` —
`731 passed, 7 skipped in 178s`.

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
