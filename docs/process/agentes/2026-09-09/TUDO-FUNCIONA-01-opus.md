# TUDO-FUNCIONA-01 — a QUINTA pergunta: até onde a prova chegou

**A cobrança dela, 08/09/2026:** *"mas aí me quebra. pq o programa de dias a
fio é de brinquedo? uma prova de conceito? por favor. ele tem que funcionar em
tudo. tudo realmente. é essa a ideia."* <!-- noqa-acento: citação literal dela, palavra por palavra -->

A sprint pedia um PORTÃO, não uma resposta — *"uma resposta envelhece no dia
seguinte"*. Ele está de pé, e responde a cada corrida **o que esta casa promete
e ainda não faz**, com o CUSTO de cada falta e a SPRINT dona dela.

## O que mudou

**`scripts/check_ate_onde_a_prova_chegou.py`** — a régua nova, camada rápida
(76 ms). Ela faz a QUINTA pergunta, e a diferença para as quatro dela é o dia
inteiro:

| | pergunta | coluna do mapa | dono |
| --- | --- | --- | --- |
| as quatro dela | o Hefesto **MEXE** nisso? | `*_aciona` | `check_cabo_bt_perfil_controle.py` |
| **a quinta** | até onde a **PROVA** chegou? | `*_ate_onde_foi` | esta |

O preço de confundir as duas está escrito no critério do primeiro degrau, e não
é meu: *"MONTOU — o byte existe na memória do produto e a suíte o lê. Nada saiu
do processo. **Tratar MONTOU como «funciona» é a mentira mais cara desta
casa**"*.

**O NÚMERO, medido em 09/09/2026 e REMEDIDO no reparo da mesma noite:** das
**12 features de aparelho** que a tela oferece, **6 têm a prova no destino** e
**6 pararam antes** — e as seis estão declaradas com custo e dona. **Nenhuma
das 622 células do mapa chegou ao degrau do JOGO.**

O número da manhã era `4 · 8`, e quem o moveu foi ELA: *«Sobe com o meu olho»*
sobre `luz.led_jogador.escrita_hefesto@dualsense` fechou `player` e
`auto-cores` de uma vez, porque as duas paravam na mesma célula. A §Reparo
09/09, lá embaixo, traz a conta.

```
gesto        aba  | cabo         rádio        perfil          ctrl     | prova cabo          prova rádio         chegou custo
apagar       04   | com ressalva com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
auto-cores   04   | com ressalva com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
brilho       04   | com ressalva com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
cor          04   | com ressalva com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
mascara      01   | com ressalva com ressalva sim             global   | MONTOU              MONTOU              NÃO    grande
mic-modo     02   | com ressalva com ressalva sim             sim      | SAIU NO FIO         SAIU NO FIO         NÃO    médio
mudo         02   | com ressalva com ressalva sim             sim      | MONTOU              MONTOU              NÃO    horas
player       04   | sim          com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
reenviar     04   | com ressalva com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
rota         02   | com ressalva sim          sim             sim      | O APARELHO OBEDECEU MONTOU              NÃO    grande
sensor       02   | com ressalva com ressalva só por controle sim      | MONTOU              MONTOU              NÃO    grande
volume       02   | nao          nao          sim             sim      | —                   —                   NÃO    horas
```

As quatro primeiras colunas **não são redigitadas**: vêm de
`check_cabo_bt_perfil_controle.tabela()`, que é a dona delas. É o critério de
pronto dela de 08/09 — *a lista «o que NÃO funciona» passa a ter as quatro
colunas* — cumprido sem criar um segundo dono para a mesma pergunta.

**E A REGRA DA SPRINT VIROU RÉGUA:** *nunca some faltas de custos diferentes
numa frase só*. O vocabulário do custo é fechado (`horas` · `médio` · `grande`),
cada falta tem **um** custo, e o relatório sai **agrupado**, nunca somado:

```
horas  (o caminho existe e falta acionar ou registrar): 2  — mudo, volume
médio  (bancada com ela, ou um campo a criar):          1  — mic-modo
grande (bloqueio de transporte, ou degrau que ninguém sabe fechar): 3 — mascara, rota, sensor
```

**`scripts/portoes.sh` e `.github/workflows/ci.yml`** — duas linhas em cada
(`ate-onde-a-prova-chegou` e `ate-onde-a-prova-chegou-morde`), na camada
rápida. Nos dois lugares porque a lista tem um dono só e é conferida nos dois
sentidos.

**`tests/unit/test_portao_a_quinta_pergunta_morde.py`** — 17 testes, sete
mordidas (eram 10 e cinco antes do reparo da mesma noite).

**E 17 ISENÇÕES DE ACENTUAÇÃO que faltavam na régua irmã** —
`scripts/check_cabo_bt_perfil_controle.py` (na minha `posse:`) e o teste que o
morde. **DEZESSETE marcadores, DEZENOVE violações, e os dois números são
verdadeiros de coisas diferentes** (medido em 09/09 devolvendo os dois arquivos
ao estado de `HEAD~1` e rodando a régua): o portão `acentuacao` (camada
COMPLETA, fora do `--rapido`) conta 19 ocorrências em **17 linhas** — as linhas
105 e 109 do teste carregam duas cada. Esta entrega dizia «19 isenções», e
isenção se conta por LINHA, que é onde o marcador vale. **Nenhuma das 19 era
erro de português**: são a citação
literal dela (*"sua revisao nos auxiliasse"*, que não se limpa) e o literal
`"nao"` — o **valor cru** que o mapa guarda e a régua compara. Trocar `nao` por
`não` ali quebraria a comparação com o CSV. Cada linha ganhou o marcador com a
razão escrita, que é o contrato da casa. A régua irmã continua verde
(`11 com as quatro respostas · 1 em dívida declarada`) e os 20 testes das duas
passam.

**Isto não estava no meu enunciado**, e eu o fiz por três razões medidas: o
arquivo está na minha `posse:` (`scripts`), a sprint dona está `feita`, e a
mudança é só comentário — zero byte de comportamento.

**E a isenção cobrou um segundo portão, que é a lição pequena do dia:** o
marcador com a razão escrita **estourou as 100 colunas do `ruff`** em quatro
linhas, e o `acentuacao` ficou verde enquanto o `ruff` ficava vermelho. *A razão
tem de caber na linha* — os quatro marcadores foram encurtados (`# noqa-acento:
valor cru do mapa`) sem perder o que explicam.

### As DUAS linhas do enunciado que a medição derrubou

**1. *"A coluna que falta no mapa é «chega ao JOGO»"* — a coluna NÃO falta.**
Ela existe desde 19/08/2026: são os degraus `O JOGO RECEBEU` e `O JOGO REAGIU`
da escada `*_ate_onde_foi`, com critério escrito, direção declarada e domínio
guardado por `check_paridade_transporte` (regras 13 e 14). O que falta é a
MEDIÇÃO — **zero de 622 células**, medido hoje. A metade certa do enunciado
sobrevive inteira, e agora tem teto: `CELULAS_QUE_CHEGARAM_AO_JOGO = 0`
reprova no dia em que a primeira subir sem alguém escrever o número novo.

**2. *"O portão desta sprint decide o destino dos dois [`mapa.py` e
`fatos_do_mapa.py`]: ou a tela pergunta ao mapa, ou os dois saem"* — os dois já
estão decididos, e um portão novo aqui seria o SEGUNDO dono da pergunta.**
Medido nesta árvore:

| | o que a medição diz |
| --- | --- |
| `interface/pacotes/mapa.py` | as três funções (`canal`, `confere`, `da_familia`) são **lápides declaradas** em `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1962-1985`, cada uma com a condição que a fecha: *"fecha quando a Vibração e os Gatilhos apagarem o que o transporte de agora não aciona"*. A `canal` VOLTOU para a lista em 07/09 — tinha saído por um **ponto cego da referência plana**, não por cura |
| `app/fatos_do_mapa.py` | **não é órfão**, e a produção não o importa **por decisão medida em 03/09**: há teste que reprova o import (`test_o_produto_nao_importa_o_dicionario_gerado_do_mapa`), porque as chaves do dicionário gerado põem `mapa.py::canal` ao alcance da régua PLANA do `casa-sabe` e a lápide passa a "ter caminho" sem ganhar um chamador |

Então *"os dois saem"* apagaria a única recusa a inventar valor de tela que
existe, e *"a tela pergunta ao mapa"* tem preço já pago e escrito. **A decisão
que registro: os dois FICAM, declarados onde já estão**, e quem os fecha é a
condição que a lápide nomeia — não esta sprint. Escrever aqui uma terceira
régua sobre a mesma pergunta é como dois donos se afastam.

## Qual mordida prova

**MORDIDA A — arranquei a declaração do `sensor` do disco** (não do teste), e a
régua o nomeou:

```
VERMELHO: 1 feature(s) da tela cuja prova parou antes do destino, e nenhuma delas está declarada:
  [02] sensor: cabo MONTOU · rádio MONTOU · o destino é O JOGO REAGIU

A tela oferecer já é o selo forte — ela não confessa dívida nossa (ordem dela de
07/09). Então a falta mora aqui, com CUSTO e DONA, ou a prova sobe o degrau no mapa.
```

**ESTA SAÍDA FOI REESCRITA NO REPARO, e o motivo é o defeito que o reparo
curou.** Quando a mordida correu de manhã, a linha dizia *«o destino é O
APARELHO OBEDECEU»* — e dizia porque arrancar a declaração do `sensor`
arrancava JUNTO o destino dele, que morava na mesma tabela. A saída de cima é a
de agora, remedida: sem a declaração, o destino continua sendo o do mapa.
*Guardar a saída velha ao lado da nova deixaria as duas vivas, e a velha é a
impressão do defeito.*

Devolvida: `VERDE: 12 feature(s) de aparelho na tela · 6 com a prova no destino
· 6 com a prova parada e declarada · 0 célula(s) do mapa no degrau do JOGO`.

**MORDIDA B — arranquei a própria comparação de degrau** (`chegou()` passou a
devolver `True` sempre), que é o jeito de a régua virar carimbo. O portão
denunciou as oito de uma vez…

```
VERMELHO: 6 falta(s) declarada(s) cuja prova já chegou ao destino — a declaração ficou velha:
  mascara: ... mic-modo: ... mudo: ... rota: ... sensor: ... volume: ...
```

(eram OITO de manhã; `player` e `auto-cores` fecharam com a decisão dela — §Reparo)

…e **o teste de mordida caiu junto**, que é o que prova que ele não sabe só
passar:

```
FAILED tests/unit/test_portao_a_quinta_pergunta_morde.py::test_o_inventario_de_hoje_passa
FAILED tests/unit/test_portao_a_quinta_pergunta_morde.py::test_morde_a_prova_que_parou_e_ninguem_declarou
FAILED tests/unit/test_portao_a_quinta_pergunta_morde.py::test_morde_a_celula_que_subiu_ao_jogo_sem_o_teto_descer
3 failed, 7 passed in 0.44s
```

Cura devolvida: `10 passed in 0.44s`.

**As SETE mordidas do teste** (cinco de manhã, duas no reparo), cada uma um
jeito real de o inventário envelhecer:

| # | o que se arranca | o que a régua diz |
| --- | --- | --- |
| 1 | a declaração de uma falta viva | *a prova parou antes do destino, e ninguém declarou* |
| 2 | uma falta cuja prova já chegou | *a declaração ficou velha* — sem isto vira propaganda no dia seguinte à cura |
| 3 | declaração para gesto que a tela não oferece | *a tela já não oferece* |
| 4 | o custo (`"um pouco"`) ou a dona (sprint inexistente) | *fora do vocabulário* · *não está em docs/process/sprints* |
| 5 | uma célula que sobe ao degrau do JOGO | *o mapa tem 1 célula no degrau de entrada e esta régua guarda 0* |
| **6** | o degrau **no MAPA**, nos dois sentidos: a cor desce a `MONTOU` no cabo · a rota sobe a `O APARELHO OBEDECEU` no rádio | desce → *parou antes do destino* nos CINCO gestos que a cor governa; sobe → *já chegou ao destino* |
| **7** | **o destino, de dentro da régua** — a tabela da falta esvaziada inteira, o `canal` do mapa trocado, e um `canal` sem direção declarada | a régua não muda de opinião com a tabela · muda com o mapa · `SystemExit` no canal sem direção |

E uma oitava que não é mordida e sim recusa a inventar domínio: um
`ate_onde_foi` com tipografia própria (`montou` minúsculo) levanta `SystemExit`
em vez de virar "sem registro" — engolir aqui daria verde exatamente sobre o
que a régua irmã reprova.

## O que NÃO verifiquei

* **Nenhum aparelho.** A sprint é `bancada: false` e eu não chamei
  `scripts/bancada.sh exigir`: **não medi um único byte no DualSense**. Tudo
  aqui é leitura do mapa, do `schema.py` e das dez páginas publicadas. Nenhum
  degrau novo foi escrito no mapa por mim — o CSV está na minha `posse:` e eu
  **não o toquei**, porque subir degrau sem ensaio no caderno é exatamente o
  que a regra 6 do `paridade-transporte` reprova.
* **Não abri a tela.** Nada de interface mudou; o portão só LÊ os `data-gesto`
  das páginas publicadas.
* **Não conferi o caderno de ensaios linha a linha.** Onde eu digo que um
  ensaio existe (`mic-radio-negativo-do-mudo-0907`, `mic-radio-a-voz-sai-0907`),
  a fonte é a prosa da MESA-DE-QUATRO-01 e da CABO-BT-PERFIL-CONTROLE-01, não
  uma leitura minha do `docs/data/ensaios.csv`.
* **Não medi se o `player` acende de fato.** Que ela VÊ as lâmpadas é o que a
  própria sprint afirma na tabela do que funciona; eu registro a discordância
  com o mapa, não a resolvo.
* **O custo de cada falta é julgamento meu**, calibrado pela tabela da sprint
  (mic no cabo = horas · mic no rádio = médio · [nota] pelo rádio = grande). Ele é
  declarado para poder ser corrigido, não medido.

## O que sobrou para o próximo

**1. CÉLULAS ATRASADAS, para a `SPECS-A-PROCEDENCIA-01` — pela chave, como a
casa pede.** Nenhuma delas veta trabalho; todas estão sem o degrau registrado:

| chave | transporte | o que o mapa diz | o que já existe fora dele |
| --- | --- | --- | --- |
| ~~`luz.led_jogador.escrita_hefesto@dualsense`~~ | — | **FECHADA em 09/09/2026 pela decisão dela** («Sobe com o meu olho»): `O APARELHO OBEDECEU` nos dois, `provado_por = olho-dela`. Ver §Reparo | — |
| `audio.microfone.mudo@dualsense` | rádio | `MONTOU`, `aciona = parcial` | o negativo do mudo por rádio, medido 07/09 (`mic-radio-negativo-do-mudo-0907`) |
| `audio.microfone@dualsense` | rádio | `SAIU NO FIO` | a voz SAI com a ponte de pé, medido 07/09 (`mic-radio-a-voz-sai-0907`), um controle de cada vez |
| `movimento.giroscopio@dualsense` | cabo e rádio | `MONTOU` com `provado_por = aparelho` | **o mapa discordando de si**: quem provou diz «aparelho», até onde foi diz «montou». É a irmã do achado da NADA-MOCKADO-01 (`de_onde_sei = medido` com `provado_por` vazio, 20 linhas) |

**2. O INSTRUMENTO DO `O JOGO RECEBEU` não existe**, e três faltas esperam por
ele (`mascara`, `sensor`, e o touchpad que nem gesto próprio tem). O critério
já está escrito na `ESCADA`: o INODE do nó do vpad aparecendo em `/proc/<pid>/fd`
de um processo da árvore do jogo — nunca por caminho, nunca por carimbo de
tempo. É o degrau 3 da `SENSORES-NO-JOGO-01`.

**3. A dívida do mapa consigo mesmo tem uma terceira forma**, além das duas que
a `NADA-MOCKADO-01` achou: **`provado_por = aparelho` com a escada em
`MONTOU`**. Quem quiser o teto, ele mora naturalmente no
`test_portao_nada_e_afirmado_sem_prova.py`, que já é o dono dessa família — eu
não o toquei para não virar o segundo dono.

**4. DOIS VERMELHOS HERDADOS, e nenhum é meu.** Os dois estão no `dev` de
agora (`e5f4b3da`), fora da camada `--rapido` — que é justamente onde eles se
escondem.

**4a. `acentuacao` — sobra UMA linha, e ela é de sprint EM VOO.**

```
scripts/ensaios/a_janela_cabe_no_que_ela_ve.py:83:media -> sugestão média
```

É **falso positivo**: ali `media` é o verbo *medir* no passado — *"a §1 da
ROLAGEM-01 já a **media** assim em 08/09"* —, não o substantivo *média*. O
conserto é o marcador com a razão na mesma linha, como nas 17 que eu marquei.
**Não fiz**: o arquivo é o instrumento da **ROLAGEM-01**, que está em voo neste
mesmo lote. Editar arquivo de agente vivo é o conflito que a §2 do
`COMO-EXECUTAR-UMA-SPRINT` manda evitar — *relate, não edite*.

**4b. `citacoes-no-codigo`.**

```
assert not {'interface/monta.py::aba03.py:878':
  'interface/monta.py:291 cita a linha 878, que está EM BRANCO —
   âncora em linha vazia não ancora nada'}
FAILED tests/unit/test_portao_o_par_com_metade_ligada.py::...::
       test_toda_citacao_de_linha_em_comentario_de_codigo_confere
```

A prova de que é herdado: eu não toquei em `src/` (o `git status` desta branch
tem quatro arquivos, nenhum sob `src/`), e quem mexeu na `aba03.py` por último
foi **`8404faf8`** — *"o acordeão dos ajustes"*, a metade da ROLAGEM-01 que já
estava na minha base (`e5f4b3da`). Ela empurrou as linhas e a `:878` ficou em
branco; a citação em `monta.py:291` não foi junto.

**O conserto tem endereço:** o que `monta.py:291` queria citar — o gerador que
escreve a `via` DIRETO na tela — está hoje em **`aba03.py:960`**
(`c["via"] if c.get("conectado", True) else ""`). É trocar `878` por `960` no
comentário. **Não fiz**: `src/` não está na minha `posse:`, e a árvore de quem
está com a `aba03.py` é a da ROLAGEM-01. *Relate, não edite* — §2 do
`COMO-EXECUTAR-UMA-SPRINT`.

**5. Nada em `src/`.** A minha `posse:` era o mapa e `scripts/`; a decisão sobre
`mapa.py` e `fatos_do_mapa.py` está registrada acima e **não pede edição de
código** — pede que a Vibração e os Gatilhos apaguem o que o transporte de
agora não aciona, que é a condição escrita na lápide.

---

## Reparo 09/09

O conferente confirmou as duas mordidas e as duas recusas de item, e devolveu
**um buraco**. Ele é da família que esta casa já nomeou em 07/09/2026 — *uma
trava medida contra a própria saída* —, e desta vez ela apareceu no lugar mais
caro possível: **na linha de chegada**.

### 1. O destino morava dentro da tabela que declara a falta

`A_PROVA_QUE_FALTA` guardava, por gesto, uma tupla de QUATRO campos — e o
primeiro era o `destino`, o degrau contra o qual a régua decide se aquela
feature *chegou*. Quem declarava a falta escolhia junto a linha de chegada
dela. A régua respondia *«até onde a prova chegou?»* comparando o mapa com uma
tabela que ela mesma carregava.

**A prova de que isso não era teórico está impressa nesta entrega, na §Qual
mordida prova.** Quando arranquei a declaração do `sensor`, de manhã, a saída
foi:

```
[02] sensor: cabo MONTOU · rádio MONTOU · o destino é O APARELHO OBEDECEU
```

O destino do `sensor` é o JOGO — está escrito na razão da própria linha que eu
tinha acabado de arrancar. **Arrancar a declaração arrancou o destino junto**, e
a régua respondeu com o degrau mais barato sobre a feature mais difícil da
tela. Foi a régua imprimindo o defeito e ninguém lendo.

**A cura é de endereço, não de texto.** O destino passou a vir do **mapa**:

| | de onde vem | dono |
| --- | --- | --- |
| até onde a prova FOI | `cabo_ate_onde_foi` · `radio_ate_onde_foi` | o mapa |
| **até onde ela TEM de ir** | `cabo_canal` · `radio_canal`, traduzido por `DIRECAO_POR_CANAL` | o mapa + `check_paridade_transporte` |

`DIRECAO_POR_CANAL` nasceu em `scripts/check_paridade_transporte.py`, ao lado do
domínio de `canal` e da `ESCADA` — **é o único arquivo desta casa que já era
dono das duas pontas**. Canal que anda para o aparelho (`hidraw`, `sysfs`,
`dbus`, `alsa-pipewire`) termina em `O APARELHO OBEDECEU`; canal que anda para o
jogo (`evdev`, `uhid`) termina em `O JOGO REAGIU`. E os dois destinos são
**derivados** da `ESCADA`, não digitados: `_FIM_DA_DIRECAO` é o último degrau de
cada direção, então uma escada com um sexto degrau move o destino sozinha.

**`outro` NÃO entra no mapeamento, de propósito**, e a ausência é a regra: um
canal que não diz por onde o dado anda não decide destino nenhum, e a régua
levanta `SystemExit` em vez de escolher o degrau mais barato. É a mesma recusa
do `SEM_REGISTRO`, que fica ABAIXO de `MONTOU` e nunca vira "montou".

**O QUE A CURA MOVEU, e é notícia:** `mascara` e `sensor` tinham `O JOGO
RECEBEU` digitado como destino. O fim da direção de entrada é `O JOGO REAGIU`, e
é ele que vale agora — porque *o jogo abriu o nó* não é *o jogo fez alguma coisa
com o que recebeu*, e parar ali é o erro do primeiro degrau um andar acima. O
touchpad é o precedente: repasse íntegro e jogo sem reagir, sem causa desde
16/08/2026. As duas já estavam paradas e declaradas, então **a conta de features
não mudou por causa disto** — mudou a linha de chegada, para mais longe.

### A MORDIDA, nas duas metades que o conferente pediu

**(a) mude o degrau no MAPA e a régua acusa** — `test_morde_o_degrau_que_desceu_no_mapa`
e `test_morde_o_degrau_que_subiu_no_mapa`. Nos dois sentidos, porque uma régua
que só acusa a descida dá verde para sempre depois da primeira cura:

| arrancada | o que reprova |
| --- | --- |
| `chegou()` cravado em `True` | `4 failed` — entre eles **a metade que DESCE**, e o inventário de hoje |
| `chegou()` cravado em `False` | `4 failed` — entre eles **a metade que SOBE**, e o inventário de hoje |

**(b) mude o destino na tabela e a régua NÃO muda de opinião** —
`test_a_tabela_da_falta_nao_sabe_escrever_um_destino` (não há QUARTO campo onde
escrevê-lo, e nenhum degrau da escada cabe nos três que restam),
`test_o_destino_nao_se_move_mexendo_na_regua` (a tabela esvaziada INTEIRA, e
nenhum dos 12 destinos se mexe) e `test_o_destino_se_move_mexendo_no_mapa` (o
`canal` da cor trocado para `uhid`, e o destino sobe ao jogo). As três juntas:
sem a terceira, a segunda passaria com um destino imóvel por ser morto.

Com o defeito ORIGINAL devolvido — o `destino` de volta como quarto campo do
`sensor` e o `inventario()` preferindo-o ao mapa —, **9 dos 17 testes reprovam**,
e `test_a_tabela_da_falta_nao_sabe_escrever_um_destino` está entre eles. Com a
régua parando de perguntar ao mapa (`destino_de` devolvendo o fim da saída
sempre), reprovam as **três** da letra (b). Curas devolvidas: `17 passed`.

### 2. A decisão dela: `luz.led_jogador.escrita_hefesto@dualsense`

A célula tinha a escada **VAZIA nos dois transportes** e `provado_por` em
branco, enquanto a sprint listava as lâmpadas entre o que FUNCIONA. A pergunta
era de procedência, não de comportamento. A resposta dela:

> **«Sobe com o meu olho»**

Ela pôs os quatro DualSense na mesa — **dois por cabo, dois por rádio** — e viu
as cinco lâmpadas acenderem a numeração nos quatro. O que subiu:

| coluna | valor |
| --- | --- |
| `cabo_ate_onde_foi` · `radio_ate_onde_foi` | `O APARELHO OBEDECEU` |
| `cabo_de_onde_sei` · `radio_de_onde_sei` | `medido` |
| `provado_em` | `2026-09-09` |
| `provado_por` | `olho-dela` |
| `cabo_evidencia` · `radio_evidencia` | a bancada dos quatro, e o que a medição NÃO é |

**`provado_por` é o token `olho-dela`**, que é o vocabulário fechado da coluna
(`aparelho` · `fonte-do-driver` · `olho-dela` · `descritor`); a procedência por
extenso — a bancada de 09/09, os quatro na mesa, dois cabo e dois rádio — mora
na `evidencia` dos dois lados e nos dois ensaios novos do caderno.

**NENHUM report id, offset ou rota foi inventado.** O que ela viu é o EFEITO — a
numeração aparecendo na lâmpada —, e é isso que a linha diz. Os endereços que a
célula já declarava continuam com a procedência de leitura de fonte que sempre
tiveram.

**Dois ensaios entraram em `docs/data/ensaios.csv`** —
`led-jogador-escrita-hefesto-obedece-cabo-0909` e `-radio-0909` —, com
`degrau = O APARELHO OBEDECEU`, `resultado = obedece`,
`resultado_da_feature = obedece` e `observado_por = olho-dela`. **Sem eles a
régua irmã reprovaria por `grau-sem-ensaio` (regra 6, FALHA)**: subir o degrau
sem caderno é exatamente o buraco de 12/08/2026.

**E UM FATO CADUCOU NA BANCADA, substituído onde estava escrito.** O
`assimetria_declarada` desta linha sustentava o `radio_aciona = parcial` assim:
*«ninguém pôs o aparelho na mesa para o LED de jogador por rádio»*. Foi posto. A
frase saiu e no lugar dela ficou a razão que **sobrevive**, já escrita no
`radio_ressalva` da mesma linha: por rádio as três re-afirmações do número
passam só pelo sysfs, e o sysfs perde para quem tiver o `hidraw` aberto — e o
ensaio de 09/09 não exercitou essa disputa. O `parcial` FICA, por outra razão.
O mesmo corte na `nota` (*«ninguém mediu ESTE aspecto»*).

**E A RÉGUA COBROU A CONTA SOZINHA**, que é a mordida 2 fazendo o trabalho dela:

```
VERMELHO: 2 falta(s) declarada(s) cuja prova já chegou ao destino — a declaração ficou velha:
  auto-cores: tire a linha de `A_PROVA_QUE_FALTA` e feche a 2026-09-01-LUZ-NO-RADIO-01-...
  player: tire a linha de `A_PROVA_QUE_FALTA` e feche a 2026-09-01-LUZ-NO-RADIO-01-...
```

As duas paravam na MESMA célula — `auto-cores` responde pela pior de
`luz.lightbar.cor` e `luz.led_jogador.escrita_hefesto` —, então uma decisão
fechou duas. **O inventário foi de `4 · 8` para `6 · 6`**, e as linhas saíram da
`A_PROVA_QUE_FALTA` com o comentário datado no lugar delas.

`mordida_provada_em` da linha ganhou o registro TRANSCRITO do bloco `MORDIDA
PROVADA` de `tests/unit/test_paridade_transporte_player_led.py:12-17` (11/08/2026),
com a ressalva de que **não** foi rerrodado hoje — sem ele a régua irmã abria um
`AVISO mordida-nao-provada` novo, que eu teria criado e deixado para o próximo.

### 3. A minúcia: 19 → 17

A entrega dizia *«19 isenções de acentuação»*. **Medido** devolvendo os dois
arquivos ao estado de `HEAD~1` e rodando `scripts/validar-acentuacao.py
--check-file`: são **19 violações em 17 linhas** — as linhas 105 e 109 de
`tests/unit/test_portao_a_regua_das_quatro_respostas.py` carregam duas cada.
Isenção se conta por LINHA, que é onde o marcador vale: **17**. Corrigido nos
dois lugares em que o número aparecia no corpo da entrega.

**A mensagem do commit `8c44b6f1` carrega o número velho** e não foi reescrita:
o conferente já leu aquele hash, e reescrever a mensagem apagaria a trilha em
vez de corrigi-la. O número certo é este, aqui.

### O que eu NÃO fiz, e por quê

* **Não fechei a `2026-09-01-LUZ-NO-RADIO-01`**, embora a régua peça. A sprint
  não é minha e o estado dela é decisão de quem coordena — eu registro que as
  duas faltas que ela carregava fecharam.
* **Não medi um único byte.** A procedência dos dois ensaios novos é o OLHO
  DELA, e está escrita como tal. Eu não estive na bancada.
* **Não toquei** `scripts/check_cabo_bt_perfil_controle.py` nem
  `tests/unit/test_portao_a_regua_das_quatro_respostas.py` — os dois têm dono e
  já estão verdes. (Eles foram devolvidos a `HEAD~1` por segundos para a
  medição das 19 × 17, e restaurados byte a byte: `git diff HEAD` dos dois é
  vazio.)
* **Não mexi em `radio_aciona`.** Ela ver as lâmpadas acenderem por rádio
  autoriza o DEGRAU, não a promoção do `parcial` a `sim` — a ressalva do sysfs
  perdendo o `hidraw` continua de pé e não foi exercitada.
* **O vermelho `janela-nao-confessa`** (por `reb/`, cópia fora do git na máquina
  dela) não é meu.

### O que a decisão dela arrastou, e não estava no pedido

Subir um degrau no mapa move mais coisa do que a régua que pediu o degrau. Três
portões cobraram no mesmo instante, e os três estavam certos:

| portão | o que cobrou | o que fiz |
| --- | --- | --- |
| `paridade-transporte` (regra 6, FALHA) | `O APARELHO OBEDECEU` sem UM ensaio naquele transporte | os dois ensaios do caderno |
| `fatos-de-tela` | `src/.../app/fatos_do_mapa.py` gerado a partir do mapa velho | `scripts/gerar-fatos-de-tela.py` |
| `mapa-de-canais` | `html/specs.html` publicado a partir do mapa velho | `scripts/gerar-mapa.py` |
| `nada-mockado` | **os dois tetos desceram** — 104 → 103 e 36 → 35 | baixados no mesmo commit, com a razão |

O `nada-mockado` é o que mais ensina: uma linha que ganha `provado_por` sai das
DUAS contas de uma vez, e a régua reprova pedindo que a constante desça junto —
*régua com folga acumulada dá verde sobre o defeito seguinte*. **De quebra, um
número caiu na medição**: o cabeçalho daquele teste dizia `afirmações fortes
(aciona = sim) 208`, e são **169** — a conta não fechava com as próprias linhas
de baixo (169 = 66 com prova + 103 sem). Substituído.

E o `paridade-transporte` ia abrir um `AVISO mordida-nao-provada` novo na linha,
porque ela passou a ter grau forte. Fechado com o registro TRANSCRITO da mordida
de 11/08/2026, com a ressalva de que não foi rerrodada hoje.

### Os portões e o lote, medidos

```
bash scripts/portoes.sh (COMPLETO, 56 portões) -> 54 verdes · 2 vermelhos
    citacoes-no-codigo   herdado — interface/monta.py:291 cita aba03.py:878 (§4b)
    acentuacao           herdado — 1 violação, scripts/ensaios/a_janela_cabe_no_que_ela_ve.py:83 (§4a)
```

**Os dois vermelhos JÁ ESTÃO CURADOS NO `dev`**, em `bb87d7df` — *"as 20
violações de acentuação que o --rapido não vê, e as citações do acordeão"*.
Medido: `git merge-base --is-ancestor bb87d7df HEAD` diz que **não tenho o
commit**; esta árvore está **3 commits atrás do `dev`**. Não os curei de novo,
que seria fabricar um conflito com uma cura que já existe.

**O lote:** os **96 arquivos de teste que leem o mapa, o caderno,
`fatos_do_mapa` ou o `check_paridade_transporte`**, de uma vez:

```
1441 passed, 9 failed, 1 skipped, 1 xfailed em 100 s
```

**As NOVE são herdadas, e isso foi MEDIDO, não suposto:** devolvi a árvore
inteira ao `HEAD` (`git checkout HEAD --` nos nove arquivos que toquei), rodei
os mesmos nove arquivos de teste e as **mesmas nove reprovaram**, com as mesmas
mensagens. Depois restaurei o trabalho byte a byte. Nenhuma cita o mapa, o
caderno ou a régua que eu toquei:

```
test_as_fotos_acompanham_a_versao · test_bancada_nomeia_coluna_que_o_csv_nao_tem
test_causa_nao_declarada_z6_05 · test_leia_primeiro_nao_digita_numero_a_mao
test_mic_da_mesa_o_endereco_do_common8_no_mapa
test_o_caminho_do_radio_da_luz_no_mapa (2) · test_o_mapa_separa_divida_de_decisao
test_sn30_plataforma_e_identidade_transporte
```

`ruff check src/ tests/` (o comando exato do CI): **All checks passed**.
