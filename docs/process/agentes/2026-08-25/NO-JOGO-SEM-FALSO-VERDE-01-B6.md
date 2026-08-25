# NO-JOGO-SEM-FALSO-VERDE-01 · agente B6

Árvore `hefesto-voo/NO-JOGO-SEM-FALSO-VERDE-B6`, branch
`voo/NO-JOGO-SEM-FALSO-VERDE-B6`, base `cb7248f`. Madrugada e manhã de
25/08/2026 — **sessão retomada**: o primeiro B6 morreu no limite de sessão às
6h10 com T1 e T4 commitadas e a T7 na árvore, sem commit.

**Fechadas:** T1 e T4 (pelo B6 anterior, `323a7f1` e `32dc940`), T2, T3, T5, T7,
T8.
**Abertas com motivo medido:** T6 (contradiz uma decisão dela que está aberta),
T9 e T10 (fora da minha posse nesta leva).
**Aguardam o olho dela:** T3 (texto novo no topo da aba) e T5 (foto, no lote do
fim da onda).

---

## O que mudou

### T7 — a cor das seis linhas ganha a primeira asserção desta casa · `a8b479b`

O arquivo estava na árvore SEM COMMIT quando cheguei. Rodei: sete verdes.
Commitei antes de qualquer outra coisa, com uma correção de acentuação na
docstring (o portão de acentuação lê `media` como `média`; a frase foi
reescrita, que é mais barato que um `noqa`).

`COR_DA_SITUACAO` aparecia em `tests/` exatamente **duas vezes, as duas em
comentário**. O ramo que pinta só existe na classe REAL — o dublê sem GTK
guarda as `LinhaDoJogo` e não pinta nada —, e o único teste que instanciava o
painel com GTK de verdade olhava geometria.

`tests/unit/test_no_jogo_a_cor_que_ninguem_media.py`, `Gtk.OffscreenWindow`. As
sete: as duas que ganham cor, a contraprova de que as cores são diferentes, as
três apagadas, os **dois sentidos** do `dim-label` (o defeito que só aparece no
segundo tique, porque os rótulos são REUSADOS e a classe grudava por cima do
verde) e o parêntese dos motores sobrevivendo ao `escapar_markup`.

### T8 — o portão que prometia cobrir o painel e lia outros dois arquivos · `dc85c38`

A docstring de `PainelNoJogo` promete que o widget não acrescenta nenhum
`GLib.timeout_add` *"de propósito"* e nomeia quem o vigia: o gate de timers da
`status_actions`. Aquele gate lê `status_actions.py` e `controller_card.py`.
`painel_no_jogo.py` **não é nenhum dos dois**.

Régua nova em arquivo próprio (`test_no_jogo_sem_pulso_proprio.py`), exigindo
**zero** das três formas de agendar, mais uma contraprova de que ela lê o
arquivo certo.

**Por que arquivo novo e não uma linha no gate de lá:** não é o mesmo fato —
aquele trava um NÚMERO que se relê a cada vez que sobe; aqui zero é contrato de
desenho, porque o painel é montado POR CONTROLE e um periódico vira quatro
laços com a mesa cheia. E `test_status_cards.py` não é da minha posse nesta
leva.

Cobre também a **Mordida 3 da MESA-CHEIA-07 §3**, que a T5 herdava.

### T5 — os quatro painéis idênticos ganham a cor de cada controle · `5a77659`

O título de cada painel já era o MESMO do card; a cor ficou para trás, e com a
mesa cheia a aba desenhava quatro molduras lilás na frente de quatro barras
acesas em quatro cores.

**O reuso é de verdade, e essa é a metade que importa.** Nasceram duas funções
no `controller_card.py` — `cor_do_swatch` (a cor CRUA) e `desenhar_swatch` (o
desenho) — e o **CARD passou a chamá-las também**. Antes disto o card lia
`_rgb3(entry["lightbar_rgb"])` e desenhava inline; um segundo leitor no painel
divergiria no primeiro payload torto. Agora quem responde *"qual é a cor deste
controle"* é uma função só, para as duas abas. `LADO_DO_SWATCH` idem, pelo
mesmo motivo.

**A cor é a CRUA, não a ajustada — D8.** O quadradinho é a IDENTIDADE da cor;
um traço escuro sobre fundo escuro some e por isso o TRAÇO passa por
`ensure_min_contrast`, mas um quadrado preenchido com contorno neutro continua
visível em qualquer cor. Ajustá-lo mostraria uma cor que a barra não tem, e
diferente do quadradinho do card — que é o mesmo elemento.

**A mordida 2 da MESA-CHEIA-07 (o `strict=True`) já estava no lugar**: entrou
com a T4 da Onda 3 (A2), no `_sync_paineis_no_jogo`. Não refiz.

### T3 — o cabeçalho passa a dizer a máscara que o perfil do jogo pedia · `283586e`

Medido em 23/08: `grep -rn "mascara_divergente" src/.../app/` devolvia **vazio**.
O campo existe no `state_full` desde a MASCARA-01 (19/08) e o comentário que o
publica diz *"e a GUI decide se mostra"*. A GUI não sabia que ele existia — a
casa sabe e o produto não faz.

A linha do topo escrevia "O jogo vê o controle como: DualSense" como se
ninguém tivesse pedido outra coisa. Não era falsa; era a metade que engana.

O texto proposto, sem uma palavra nova (o "perfil" já é o vocabulário do aviso
PERFIL-MUDO-01 desta mesma aba, e os rótulos de máscara vêm da aba Início):

```
Jogar (gamepad virtual) · O jogo vê o controle como: DualSense (botões
PlayStation) — o perfil deste jogo pedia Xbox 360
```

A LISTA (`mascara_divergencias`) fica de fora: divergência de jogo fechado é
antecipação, o daemon separa as duas chaves por isso, e alarme sempre aceso
ensina a não olhar.

### Correção de fato ao texto da sprint (T3)

A mordida de T3 propõe o payload `{"appid": 1234, "em_cena": true, "perfil":
"xbox", "viva": "dualsense"}`. **As chaves não são essas.** O dicionário que o
daemon publica é montado em `daemon/launch_env.py` e tem
`{appid, profile, mascara_perfil, mascara_viva, motivo, em_cena}`. Um teste
escrito contra os nomes da sprint passaria a medir uma ficção — é a família
"medir contra a régua errada". Há uma asserção que trava isso
(`test_a_funcao_le_a_chave_do_daemon_e_nao_outra`).

**Também está errada a linha `app/widgets/controller_card.py:2042` para o
`accent_do_card`** — a função existe, mas em `:2133`. Deriva de linha, não muda
o sentido; anotado porque a sprint cita linha em vários lugares.

---

## Qual mordida prova

Todas com `PYTEST_ADDOPTS=-p no:cacheprovider` **e** `__pycache__` apagado entre
arrancar e devolver.

### T7 · a cor

| arranquei | reprovou |
|---|---|
| `valor.set_markup(<span…>)` -> `valor.set_text(linha.texto)` | `4 failed, 3 passed` — chegando, parou, o acordar e os motores |
| o `contexto.remove_class("dim-label")` do ramo colorido | `1 failed, 6 passed` — só a do acordar. Cada mordida com a sua régua |

Devolvidas: `7 passed`.

### T8 · o pulso próprio

Plantei `GLib.timeout_add(500, lambda: True)` no `PainelNoJogo.__init__`:

```
--- O PORTAO ANTIGO (test_status_cards.py -k timers) ---
1 passed, 38 deselected          <- CEGO
--- A REGUA NOVA ---
{'GLib\\.timeout_add\\(': 1} != {'GLib\\.timeout_add\\(': 0}
1 failed, 1 passed
```

Devolvida: `2 passed`.

### T5 · a cor do painel

| arranquei | reprovou |
|---|---|
| `cor_do_swatch(entry)` -> `tuple(entry["lightbar_rgb"])` inline | `6 failed, 7 passed` — cinco deles nos payloads tortos (dois canais, quatro canais, canal em texto, dicionário, nome de cor), onde a cópia ingênua diverge do dono e num deles ESTOURA |
| a cor fora da tupla `assinatura` do diff | `1 failed, 12 passed` — o quadradinho congela na primeira pintura |
| `self._titulo_label.set_text(titulo)` -> `pass` | `1 failed, 12 passed` — o título órfão no cabeçalho novo |

Devolvidas: `13 passed`.

**A primeira mordida é a que ensina:** com o payload BEM FORMADO a cópia
ingênua passa na asserção de identidade. Só o caso de borda a derruba — que é
exatamente o que a MESA-CHEIA-07 escreveu e o que quase deixei passar.

### T3 · a máscara divergente

| arranquei | reprovou |
|---|---|
| o leitor inteiro do cabeçalho | `1 failed, 7 passed` — volta a imprimir só a viva, que é o estado de 23/08 |
| o gate `pedida != rotulo_da_mascara` | `1 failed, 7 passed` — as duas máscaras iguais viram um alarme que não é alarme |
| a tradução pelo `_FLAVOR_ITEMS` (aceitar o identificador cru) | `5 failed, 3 passed` — "o perfil deste jogo pedia ps4_v2" é palavra que nenhuma outra tela deste produto tem |

Devolvidas: `8 passed`.

### Os portões

```
bash scripts/portoes.sh   ->   TODOS VERDES — 23 portões
```

E o escopo desta aba, mais o `test_status_cards.py` (por causa das duas funções
novas no card): **228 passed**.

---

## O que NÃO verifiquei

1. **Nada disto foi visto na tela.** A prova de tela (D3) não fecha nesta
   madrugada por ordem de quem coordena, e não rodei o `retratar_abas.py` —
   ele reescreve as onze fotos de uma vez e há onda em paralelo.
2. **A cor é a que ela vê na barra?** Só a bancada dela responde, e nesta aba
   com o jogo aberto. Nenhum número desta entrega sobre 2 ou 4 controles é
   medição viva: a mesa estava vazia.
3. **O vermelho preexistente que encontrei e não é meu:**
   `tests/unit/test_lightbar_onda7_as_mordidas.py::test_gatilhos_sem_o_mixin_da_lightbar_recusam_em_vez_de_escrever_global`
   — `AttributeError: module 'triggers_actions' has no attribute
   'trigger_reset'`. **Confirmado preexistente** (reprova com a minha árvore
   guardada no `git stash`). `triggers_actions.py` é do C1.
4. **A `mascara_divergente` nunca foi vista viva.** O caminho que a produz é a
   materialização do `launch_env` com um jogo em cena; o payload de 23/08 tinha
   a chave em `None`. O que testei é a leitura, contra as chaves que o escritor
   escreve — não contra um payload capturado.

---

## O que sobrou para o próximo

### T6 — as duas linhas de bateria e jack · **RECUSEI EXECUTAR COMO ESCRITA**

A sprint a marca `[EST]` *"por dois motivos: são duas frases novas, e
`_NOME_NA_FRASE` é lista-dona das DUAS abas"*, e a **D-L** (§9) pergunta
justamente se as duas linhas entram também na frase do card da Status. **A
decisão é dela e está aberta.** Medi as duas saídas e as duas decidem a D-L por
omissão:

* **mexer em `_NOME_NA_FRASE`** muda a frase do card da aba Status **e** o
  `frase_mais_longa_do_que_chega_ao_jogo`, que é o que RESERVA a largura do
  card (`controller_card.py:1797-1810`). Isto é responder "sim" à D-L, e mexer
  na aba de outra frente na mesma leva;
* **dar ao painel uma lista própria de recursos** cria um SEGUNDO dono do
  vocabulário — o que o cabeçalho do módulo proíbe em letra grande.

**E há um terceiro fato que a sprint já viu e que muda o tamanho da tarefa:**
estas duas linhas **não têm recência**. `estado_do_recurso` responde por idade
de carimbo em `visto_ha_s`, e `bateria_no_jogo`/`jack` têm só um contador
cumulativo e um valor atual. Elas não são mais duas entradas na tabela: são uma
REGRA nova ao lado da existente. `[EST]` está certo, e a espera também.

**O que ela precisa decidir (D-L):** as duas linhas aparecem só na aba No jogo,
ou também na frase única do card da aba Status?

### T9 — a linha do gatilho no mapa · **fora da minha posse**

`docs/data/mapa-controles.csv` é do B5 nesta leva, e ninguém mais escreve nele.
O que ela precisa: uma chave nova `gatilho.replica_output_jogo` nas três
famílias, com `radio_aciona = sim` e
`radio_de_onde_sei = inferido-do-codigo` (**não** `medido` — ninguém sentiu o
L2 por rádio depois de uma réplica); e a linha `luz.replica_output_jogo` perde
a metade do gatilho do texto de `assimetria_declarada`, porque fato errado se
substitui.

### T10 — o dublê da foto · **fora da minha posse**

`scripts/gui-captura/retratar_abas.py` não está na minha lista. Com a T1 no
lugar, o Controle 2 do dublê (`visto_ha_s: {"rumble": 0.9}` sem pedido) já
desenha **"parou"** — o retrato honesto — assim que a foto for refeita. Se a
documentação quiser o caso bom, o dublê precisa ganhar o carimbo do pedido,
explícito. **A foto sai no lote do fim da onda, nunca com onda em paralelo.**

### O que fica DELA

* **T3** — o texto do cabeçalho, acima. Commitado na branch de voo e **não**
  em `dev`: trabalho não commitado morreu duas vezes esta noite, e a branch de
  voo é o lugar onde ele espera sem morrer.
* **T5** — a foto, no lote.
* **D-1** — a cor do painel é a VIVA da barra ou a da paleta COR-03? Continua
  aberta. O que mudou é que a resposta passa a valer para as duas abas de uma
  vez, porque quem decide é uma função só.
* **D-E** — o gate de existência com daemon velho: a aba não volta e a cura é o
  restart. Intocado.
