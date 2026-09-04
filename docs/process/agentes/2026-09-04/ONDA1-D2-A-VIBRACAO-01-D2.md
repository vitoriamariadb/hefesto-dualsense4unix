# ONDA1-D2 · A VIBRAÇÃO — o multiplicador por motor compõe com o degrau

Agente **D2**, 04/09/2026. Árvore `hefesto-voo/ONDA1-D2-A-VIBRACAO-D2`, branch
`voo/ONDA1-D2-A-VIBRACAO-D2`, nascida de `dev` em `bf863a49`.

Sprint:
[2026-09-04-ONDA1-D2-A-VIBRACAO-01](../../sprints/2026-09-04-ONDA1-D2-A-VIBRACAO-01-o-multiplicador-por-motor-compoe-com-o-degrau.md).

## O que mudou

**A conta dela virou código, e ela vive em UM lugar.**

> *"os slcers do botão esquerdo e direito (forte e fraco) se multiplicam
> (interagem com os botões economia, moderado, máximo, se eu tiver 150% do
> perfil de vibração e as duas linhas estiverem 100 entao a vibração dos 2 será
> 150%, mas se so a do motor fraco tiver 100 e a outrqa 50% então será 150 em um
> e 75% no outro entende?"* <!-- noqa-acento: citação literal dela -->

```
efetivo(motor) = degrau(coluna) x barra(motor)
```

### `profiles/schema.py` — o número ganha dono e vida

`ControllerRumbleOverride` ganha **`motor_forte_pct`** e **`motor_fraco_pct`**
(0–100, `None` = sem opinião). Junto vieram:

| peça | o que é |
| --- | --- |
| `MOTOR_PCT_PADRAO = 100` | o valor de quem não arrastou nada — um dono só |
| `MOTOR_PCT_MAX = 100` | o teto, e **não** é o `RUMBLE_CUSTOM_MULT_MAX` |
| `pcts_dos_motores(rumble)` | o ÚNICO lugar que resolve "campo não escrito = sem opinião" |
| `motores_dos_controles(controllers)` | `{uniq: (forte, fraco)}` — espelho de `_controllers_to_rumble_scales` |
| `_validate_barras_de_motor` | a recusa na BORDA, com a razão na mensagem |

**Por que o teto da barra é 100 e não 200:** a barra é o SEGUNDO fator, e quem
amplifica é o degrau (`Máximo` = 150 %, `custom` até 200 %). Uma barra acima de
100 daria à mesma peça **duas portas para o mesmo estouro** — HARM-19 pela outra
porta, e a nota SATURA-01 diz o preço.

**O disco de quem não usa não muda.** `_payload_do_perfil` serializa as entradas
de `controllers` com `exclude_unset=True`, então um override que só tem `policy`
NÃO ganha `"motor_forte_pct": null` — que era o defeito medido em PERFIL-02 e em
SOM-02/E4 (um hefesto antigo com `extra="forbid"` rejeitaria o perfil inteiro num
downgrade). Há teste.

### `daemon/subsystems/gamepad.py` — a multiplicação, num lugar só

* `_chave_da_peca(uniq)` — o MAC normalizado como o perfil o chaveia (sem
  dois-pontos, minúsculo). Sem isso o endereço com `:` não casa chave nenhuma e o
  mapa fica **mudo em silêncio**.
* `_motores_do_perfil_ativo(daemon)` — o mapa do perfil ATIVO,
  **memoizado pelo nome do perfil** em `daemon._rumble_motores_pct`. O FF do jogo
  chega a centenas de Hz; ler o disco por report seria uma tempestade de syscalls
  no caminho mais quente do daemon. Perfil ilegível cai em mapa vazio e a
  vibração segue — derrubá-la por um JSON torto trocaria um ajuste perdido por
  uma partida muda.
* `_pcts_dos_motores(daemon, target_uniq)` — `(100, 100)` quando `target_uniq is
  None`: **sem endereço não há peça**, mesma disciplina do BROADCAST-PROIBIDO-01.
* `_mults_por_motor(daemon, now, target_uniq)` — **a conta, e é o único lugar
  onde a multiplicação acontece.**
* `apply_game_rumble` deixou de chamar `_game_rumble_mult` e passou a chamar
  `_mults_por_motor`; `weak` e `strong` agora podem sair com fatores diferentes
  do MESMO controle.

`_game_rumble_mult` **continua existindo e continua sendo o degrau** — três
docstrings do produto e dois testes o apontam como o espelho de
`reassert_rumble`. Mudar o tipo de retorno dele tornaria essas cinco referências
sutilmente falsas; a docstring dele agora diz, com todas as letras, que quem
escreve no motor não o chama.

### Como a conta compõe com o TETO por controle (`08-conexoes`), sem apagá-lo

Medido, e os dois juntos:

```
degrau (política global)  ->  apply_game_rumble
   x barra(motor)         ->  apply_game_rumble   <- o que esta sprint acrescenta
   x teto da peça         ->  backend._escalar_rumble (um andar ABAIXO)
```

São três fatores em andares diferentes; nenhum come o outro. O teste
`TestCompoeComOTeto` percorre os dois andares com o backend REAL
(`PyDualSenseController` com handles falsos) e o fator do produto
(`_controllers_to_rumble_scales`), nunca digitado.

### O que foi CRIADO

* `tests/unit/test_cada_motor_tem_o_seu_multiplicador.py` — **30 testes**;
* `scripts/ensaios/o_multiplicador_chega_ao_motor.py` — o ensaio de bancada.

### Dois arquivos que a MINHA edição obrigou a mexer, e não são de ninguém

`docs/data/mapa-controles.csv` e `html/specs.html`. Nenhum dos dois está no
`posse:` ou no `nao_toca:` de sprint alguma em voo (conferido no frontmatter de
`ONDA1-D1-O-SOM-01`, a única outra da onda). O portão `citacoes-de-linha`
reprovou porque minha inserção em `gamepad.py` **moveu as linhas** que 21
citações do mapa apontam — a afirmação continua verdadeira, o endereço é que
caducou, e o próprio portão manda reapontar em vez de apagar.

Reapontadas com um **mapa exato de linha velha → linha nova** (`difflib` sobre
`git show HEAD:` versus o disco), nunca somando um deslocamento à mão — o
deslocamento não é constante, porque também acrescentei linhas *dentro* de
`apply_game_rumble`. Uma citação NÃO foi tocada de propósito:
`gamepad.py:1527, :1542, :975-977`, que aparece numa nota histórica sob o
rótulo *"os velhos"* — ali o endereço caduco **é** o assunto.

`html/specs.html` é gerado do CSV (`scripts/gerar-mapa.py`, que o portão
`mapa-de-canais` nomeia). Regenerado: **3 linhas** de diferença, todas do JSON
embutido. Se outro agente também mexer no CSV, o conflito cai nessas linhas — que
é o barulho que se quer.

## Qual mordida prova

**Três curas arrancadas, três réguas vermelhas, e as saídas estão coladas.**

### Mordida 1 — a multiplicação por motor (a que a sprint pede)

`_mults_por_motor` devolvendo `(degrau, degrau)`:

```
E  AssertionError: o par efetivo saiu (150, 150), e a conta dela pede (150, 75):
   degrau 150% x barra fraca 100% no `weak`, e o MESMO degrau x barra forte 50%
   no `strong`. Se os dois vieram iguais, a barra não entrou na conta.
E  assert (150, 150) == (150, 75)
E    At index 1 diff: 150 != 75
...
8 failed, 22 passed in 0.97s
```

É exatamente o que a sprint manda ver: *"degrau 150 · fraca 100 · forte 50 tem
de sair 150 e 75, e sem a cura sai 150 e 150"*.

### Mordida 2 — o degrau escapando sozinho (o defeito que volta num merge)

`apply_game_rumble` voltando a chamar `_game_rumble_mult` direto — que é o
estado literal de antes desta sprint:

```
E  AssertionError: `apply_game_rumble` deixou de compor o par por motor
E  assert '_mults_por_motor' in {'_game_rumble_mult', 'callable', 'getattr',
                                 'max', 'min', 'round', ...}
1 failed
```

Esta é a régua que mais importa: com um perfil de suíte SEM barra escrita,
nenhum teste de valor fica vermelho quando o degrau volta a escapar. A leitura
por AST pega a chamada.

### Mordida 3 — a borda do esquema

`_validate_barras_de_motor` apagado:

```
E  Failed: DID NOT RAISE ValueError
...
6 failed, 5 passed in 0.44s
```

### Com as três curas de volta

```
30 passed, 1 warning in 0.91s
```

### Os portões

```
git add -A && bash scripts/portoes.sh
TODOS VERDES — 40 portões.
```

(Na primeira passada: `citacoes-de-linha` vermelho por 3 endereços que a minha
inserção moveu; depois `mapa-de-canais`, porque reapontar o CSV desatualiza a
página gerada. Os dois curados, e a razão está acima.)

E os vizinhos, que é onde uma mudança de esquema costuma quebrar sem avisar
(`test_vpad_ff_passthrough`, `test_por_unidade_01_todas_as_abas`,
`test_perfil_por_controle_o_campo_espera_o_caminho`,
`test_a_forca_da_vibracao_e_por_controle`, `test_o_teto_da_vibracao_e_por_controle`,
`test_rumble_mult_um_dono`, `test_orcamento_e_teto_nao_troca`,
`test_rumble_por_jogador_01`, `test_profile_rumble_policy`,
`test_p4_alvo_ausente_nao_vira_broadcast`):

```
213 passed, 1 warning in 10.55s
```

### A BANCADA — o que o aparelho respondeu

Bancada **LIVRE**; `scripts/bancada.sh exigir` deu rc=0; um DualSense na mesa
(USB) e o vpad do P1 vivo. Rodado
`scripts/ensaios/o_multiplicador_chega_ao_motor.py --segundos 0.8`:

```
A CONTA DO PRODUTO, com os números dela (degrau 'max', barra fraca 100%, barra forte 50%):
  mult do motor FRACO ... 1.5000
  mult do motor FORTE ... 0.7500
  razão forte/fraco ..... 0.5000   <- É ISTO que a mão tem de sentir
  par sobre a base 160 .. weak=240  strong=120

  daemon ...... vivo · degrau global 'balanceado' · perfil 'Navegação'

  PAR SIMÉTRICO  (controle POSITIVO): weak=160 strong=160 · o daemon guarda: [160, 160]
  O PAR DA CONTA:                     weak=240 strong=120 · o daemon guarda: [240, 120]
  SÓ O FRACO:                         weak=160 strong=0   · o daemon guarda: [160, 0]
  SÓ O FORTE:                         weak=0   strong=160 · o daemon guarda: [0, 160]
  SILÊNCIO       (controle NEGATIVO): weak=0   strong=0   · o daemon guarda: [0, 0]

  motores parados · rumble_active=None · passthrough=True
```

**O que isso prova:** o par ASSIMÉTRICO que a conta produz atravessa o daemon
**como par** — o produto não iguala os motores em lugar nenhum do caminho, que é
a premissa física de que a barra por motor depende.

**E ACHOU UM DEFEITO NO PRÓPRIO INSTRUMENTO, na primeira execução** — a
armadilha 3 do `CLAUDE.md` na forma mais cara. `rumble.stop` **não devolve o
passthrough**: ele deixa `rumble_active=(0,0)`, e com o rumble FIXADO o
`apply_game_rumble` descarta o FF do jogo na primeira linha. O ensaio saía
deixando a máquina dela **sem vibração em jogo nenhum, em silêncio**. Curado no
mesmo ato: o ensaio agora fotografa `rumble_active` antes, devolve o estado no
fim, e RECLAMA em `stderr` se a devolução não bater. O estado dela foi devolvido
à mão e conferido (`rumble_active=None · passthrough=True`).

## O que NÃO verifiquei

* **NÃO verifiquei o plástico.** O ensaio mede o que o DAEMON guarda; qual motor
  treme mais é o veredito da **mão dela**, e ela não estava com o controle na
  mão. O ensaio está escrito, rodado e pronto para ela repetir em segundos.
* **NÃO verifiquei o daemon INSTALADO fazendo a conta**, e não havia como: o
  daemon vivo é o da árvore DELA, sem este código. Provar isso exigiria
  `install.sh` ou reiniciar a unit systemd — as duas coisas que agente nenhum
  faz enquanto ela usa a máquina.
* **NÃO verifiquei a tela.** A metade de TELA da aba 05 é de outra frente
  (`interface/pacotes/a05_vibracao.py`, `interface/aba05.py`, no `nao_toca:`
  desta sprint). Nenhum pixel mudou aqui.
* **NÃO verifiquei o `state_full` publicando os dois números de volta**, nem o
  método `rumble.motores.set` — os dois moram em `daemon/ipc_handlers.py` e
  `app/ipc_bridge.py`. Ver a seção abaixo.
* **NÃO rodei a suíte inteira** (regra: é de quem coordena, e no fim). Rodei o
  meu escopo e os dez vizinhos de vibração/perfil.
* **NÃO verifiquei `auto` por bateria com a barra.** A barra não tem
  denominador — ela compõe, não normaliza —, então ela deve valer sob `auto`
  também, e é assim que `motores_dos_controles` está escrito. Não medi com a
  bateria variando de verdade.

## O que sobrou para o próximo

### 1. `ipc_handlers.py` e `ipc_bridge.py` NÃO foram tocados — e a razão

A sprint diz *"quando você começar, `ipc_handlers.py` e `ipc_bridge.py` passam a
ser seus — **quem despachou confirma isso no preâmbulo**"*. **O preâmbulo não
confirmou**, e o `posse:` do frontmatter lista dois arquivos só
(`daemon/subsystems/gamepad.py`, `profiles/schema.py`). Além disso a condição da
própria sprint — *"espera a `ONDA1-D1-O-SOM-01` fechar"* — **não estava
cumprida**: medido nesta árvore, `git log dev..voo/ONDA1-D1-O-SOM-01-D1` está
**vazio**. `COMO-EXECUTAR-UMA-SPRINT.md` §2 manda relatar em vez de editar, e é
o que está sendo feito.

**Falta, então, a metade de IPC — e ela é pequena e está especificada:**

* **`rumble.motores.set {uniq, forte_pct, fraco_pct}`** — grava
  `ControllerRumbleOverride.motor_forte_pct` / `motor_fraco_pct` no perfil, para
  aquele `uniq`. A borda já recusa fora de 0–100, com a razão escrita.
* **UMA LINHA a mais, e sem ela a barra nova só vale na próxima troca de
  perfil:**

  ```python
  daemon._rumble_motores_pct = None   # invalida o mapa memoizado
  ```

  O contrato dessa linha já está travado por teste, escrito de fora:
  `TestOCacheDoMapa::test_invalidar_o_cache_e_uma_linha`. Sem ela a tela diria
  "aplicado" sobre um motor que não mudou — que é a família de defeito que esta
  casa mais paga.
* **`state_full`** publicando os dois números de volta, por peça (ao lado de
  `rumble_policy` / `rumble_mult_applied`, em `ipc_handlers.py:3023`). Sem isso a
  tela desenha a barra onde ela estava, não onde ela está.
* **`profiles/manager.py`** (opcional, e é o caminho mais limpo a prazo): chamar
  `schema.motores_dos_controles(profile.controllers)` na ativação e publicar o
  mapa no daemon, no molde exato do `set_rumble_scales` logo acima
  (`manager.py:459`). Hoje o mapa é lido do disco pelo próprio `gamepad.py`, o
  que funciona e é memoizado — mas a simetria com o irmão vale a troca.

### 2. Para a frente da aba 05, sem redecidir nada

* `SEM_DONO["barra:motor"]` (`interface/pacotes/a05_vibracao.py:64`) **pode
  morrer, com a razão datada.** Ele dizia que faltavam duas metades e que a
  segunda era **a palavra dela** — *"uma barra por lado manda meio par, e é ela
  que decide se as duas viram um controle só"*. **Ela decidiu em 04/09/2026:** as
  duas barras NÃO mandam `rumble.set`; elas são política por motor. A metade (a)
  — o desenho, `aba05._coluna` chamando `_barra(..., arrasta=True,
  papel="motor")` — continua sendo a única que falta, e é dessa frente.
* A aba 05 **lê** os dois números do `state_full` (por peça) e **escreve** por
  `rumble.motores.set {uniq, forte_pct, fraco_pct}`.
* **A faixa da barra é 0–100, e o `0` é escolha válida** ("este motor não treme
  neste perfil"). O acima de 100 é recusado na borda, com a razão pronta para a
  tela reproduzir em vez de digitar.
* A aba 05 recebe também, e **nenhuma das duas é desta sprint**: a **linha de
  estado por coluna** (D-14, três estados) e o **recado de sucesso no cartão**
  (D-01). As duas já decididas.

### 3. Um achado de outra posse, relatado e não consertado

`app/ipc_bridge.rumble_stop()` **não devolve o passthrough** — deixa
`rumble_active=(0,0)`, e a partir daí `apply_game_rumble` descarta o FF de todo
jogo (primeira linha da função). Quem chamar `rumble_stop` achando que "parou de
mexer" deixa a máquina sem vibração em jogo, sem nenhum sinal. O meu instrumento
já se defende sozinho (fotografa e devolve), mas **a assimetria entre
`rumble_stop` e `rumble_passthrough` é do produto**, e vale uma frase na tela ou
um `rumble_stop(devolver_passthrough=True)`. Não editei: `ipc_bridge.py` não é
desta posse.
