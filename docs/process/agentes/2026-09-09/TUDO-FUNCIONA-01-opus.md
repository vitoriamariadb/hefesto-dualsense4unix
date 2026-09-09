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

**O NÚMERO, medido em 09/09/2026:** das **12 features de aparelho** que a tela
oferece, **4 têm a prova no destino** e **8 pararam antes** — e as oito estão
declaradas com custo e dona. **Nenhuma das 622 células do mapa chegou ao
degrau do JOGO.**

```
gesto        aba  | cabo         rádio        perfil          ctrl     | prova cabo          prova rádio         chegou custo
apagar       04   | com ressalva com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
auto-cores   04   | com ressalva com ressalva sim             sim      | —                   —                   NÃO    horas
brilho       04   | com ressalva com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
cor          04   | com ressalva com ressalva sim             sim      | O APARELHO OBEDECEU O APARELHO OBEDECEU sim    —
mascara      01   | com ressalva com ressalva sim             global   | MONTOU              MONTOU              NÃO    grande
mic-modo     02   | com ressalva com ressalva sim             sim      | SAIU NO FIO         SAIU NO FIO         NÃO    médio
mudo         02   | com ressalva com ressalva sim             sim      | MONTOU              MONTOU              NÃO    horas
player       04   | sim          com ressalva sim             sim      | —                   —                   NÃO    horas
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
horas  (o caminho existe e falta acionar ou registrar): 4  — auto-cores, mudo, player, volume
médio  (bancada com ela, ou um campo a criar):          1  — mic-modo
grande (bloqueio de transporte, ou degrau que ninguém sabe fechar): 3 — mascara, rota, sensor
```

**`scripts/portoes.sh` e `.github/workflows/ci.yml`** — duas linhas em cada
(`ate-onde-a-prova-chegou` e `ate-onde-a-prova-chegou-morde`), na camada
rápida. Nos dois lugares porque a lista tem um dono só e é conferida nos dois
sentidos.

**`tests/unit/test_portao_a_quinta_pergunta_morde.py`** — 10 testes, cinco
mordidas.

**E 19 ISENÇÕES DE ACENTUAÇÃO que faltavam na régua irmã** —
`scripts/check_cabo_bt_perfil_controle.py` (na minha `posse:`) e o teste que o
morde. O portão `acentuacao` (camada COMPLETA, fora do `--rapido`) reprovava os
dois com 19 violações, e **nenhuma era erro de português**: são a citação
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
  [02] sensor: cabo MONTOU · rádio MONTOU · o destino é O APARELHO OBEDECEU

A tela oferecer já é o selo forte — ela não confessa dívida nossa (ordem dela de
07/09). Então a falta mora aqui, com CUSTO e DONA, ou a prova sobe o degrau no mapa.
```

Devolvida: `VERDE: 12 feature(s) de aparelho na tela · 4 com a prova no destino
· 8 com a prova parada e declarada · 0 célula(s) do mapa no degrau do JOGO`.

**MORDIDA B — arranquei a própria comparação de degrau** (`chegou()` passou a
devolver `True` sempre), que é o jeito de a régua virar carimbo. O portão
denunciou as oito de uma vez…

```
VERMELHO: 8 falta(s) declarada(s) cuja prova já chegou ao destino — a declaração ficou velha:
  auto-cores: tire a linha de `A_PROVA_QUE_FALTA` e feche a 2026-09-01-LUZ-NO-RADIO-01-...
  mascara: ... mic-modo: ... mudo: ... player: ... rota: ... sensor: ... volume: ...
```

…e **o teste de mordida caiu junto**, que é o que prova que ele não sabe só
passar:

```
FAILED tests/unit/test_portao_a_quinta_pergunta_morde.py::test_o_inventario_de_hoje_passa
FAILED tests/unit/test_portao_a_quinta_pergunta_morde.py::test_morde_a_prova_que_parou_e_ninguem_declarou
FAILED tests/unit/test_portao_a_quinta_pergunta_morde.py::test_morde_a_celula_que_subiu_ao_jogo_sem_o_teto_descer
3 failed, 7 passed in 0.44s
```

Cura devolvida: `10 passed in 0.44s`.

**As cinco mordidas do teste**, cada uma um jeito real de o inventário
envelhecer:

| # | o que se arranca | o que a régua diz |
| --- | --- | --- |
| 1 | a declaração de uma falta viva | *a prova parou antes do destino, e ninguém declarou* |
| 2 | uma falta cuja prova já chegou | *a declaração ficou velha* — sem isto vira propaganda no dia seguinte à cura |
| 3 | declaração para gesto que a tela não oferece | *a tela já não oferece* |
| 4 | o custo (`"um pouco"`) ou a dona (sprint inexistente) | *fora do vocabulário* · *não está em docs/process/sprints* |
| 5 | uma célula que sobe ao degrau do JOGO | *o mapa tem 1 célula no degrau de entrada e esta régua guarda 0* |

E uma sexta que não é mordida e sim recusa a inventar domínio: um
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
| `luz.led_jogador.escrita_hefesto@dualsense` | cabo e rádio | `ate_onde_foi` **vazio**, `provado_por` vazio, `radio_aciona = parcial` | a própria TUDO-FUNCIONA-01 lista «LEDs de jogador… a tela pinta e o plástico acende» entre o que FUNCIONA |
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
conserto é o marcador com a razão na mesma linha, como nas 19 que eu marquei.
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
