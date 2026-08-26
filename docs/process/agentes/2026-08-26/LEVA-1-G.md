# LEVA-1-G — as duas réguas do arranjo, medidas; e a colisão de posse ficou legível

**26/08/2026.** Árvore `../hefesto-voo/LEVA-1-G`, branch `voo/LEVA-1-G`.
Posse: `tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py` (novo) e
`scripts/check_colisao_de_sprints.py`. **Nenhum arquivo fora dela foi tocado.**

## O que mudou

### 1. A medição que ela mandou fazer — `test_as_duas_reguas_do_arranjo_divergem_onde.py`

`docs/data/decisoes-dela.csv`, `D-QUAL-REGUA-MANDA-NO-ARRANJO`: *"MEDIR AS DUAS
ANTES DE ESCOLHER. Um teste comparativo roda as duas sobre a mesma bancada e
mostra onde divergem; a escolha vem depois, com o caso na mão."*

O arquivo roda **as duas réguas sobre a MESMA bancada sintética**, em seis
mesas, e imprime a divergência caso a caso em português — origem, destino e a
razão de cada uma. A medição sai sem pytest:

```bash
.venv/bin/python tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py
```

As seis bancadas: **as quatro que a ordem pediu** (a mesa dela com os três
adaptadores no mesmo hub, uma mesa vazia, uma com buraco livre em outra
controladora, uma sem ordem possível) **mais duas**. As duas extras não são
enfeite: sem elas a `ordem_de_redistribuicao` **nunca é vista mandando mover**,
e um teste em que ela cala nas seis passaria com a régua arrancada — é a
armadilha "régua que não vê nada passa sempre".

O `/sys/class/hidraw` é de mentira (`_sysfs_de_mentira`) de propósito: sem isso o
teste mediria a bancada de quem o roda, que é a armadilha "medir contra a
biblioteca errada" entrando pela porta do sysfs. **Nenhum aparelho tocado,
nenhum daemon ouvido, bancada física não usada.**

**A ESCOLHA entre as duas réguas NÃO está no arquivo, e não é minha.** É palavra
dela, e os casos estão abaixo, na mão.

#### As quatro divergências medidas

| # | onde | o que acontece |
|---|---|---|
| 1 | bancada 1 — a mesa dela | **a régua da tela cala e o motor manda mover dois.** Co-op de quatro, microfone de pé em todos, no mesmo dongle: 1.106,8 de 1.600 fatias, fração **69,2%** — abaixo do corte de 85%. `ordem_de_redistribuicao` não diz nada; `plano_dos_controles` espalha os quatro pelos três dongles do hub dela e o pico cai para 553,4 |
| 2 | bancadas 4 e 6 | **a régua da tela não enxerga adaptador VAZIO, e a frase que ela publica nesse estado é FALSA.** `plano_por_adaptador` só produz plano para adaptador que TEM controle conectado: um dongle livre em outra controladora não existe para ela. Sem candidato, a seção Desempenho cai no `elif _algum_apertado(planos)` (`secao_orcamento.py:760`) e imprime *"Todos os controles estão no mesmo adaptador, e é o único que você tem"* — com um segundo adaptador vazio na mesa (bancada 4), e com DEZ controles divididos entre DOIS adaptadores (bancada 6), onde a frase é falsa nas duas metades. O motor enxerga o dongle vazio e move três |
| 3 | bancada 3 | **a ordem de serviço manda mover de "Adaptador sem nome" para "Adaptador sem nome".** Com dois dongles que ela ainda não apelidou, os dois caem no mesmo `ADAPTADOR_SEM_NOME`, e a frase de `ganho_esperado` nomeia origem e destino com a MESMA palavra: a tela manda mover um controle sem dizer para onde. E na mesma bancada as duas **divergem no tamanho** — a tela manda mover 1, o motor manda mover 2 |
| 4 | bancada 5 | **as duas discordam da PALAVRA, não só do movimento.** 1.562,4 de 1.600: a régua da tela chama de **"Cheia"** (corte 85%) e `PlanoDosControles.cabe` responde **`True`** (corte 100%). Duas respostas para "cabe?" na mesma mesa |

**Os achados 2 e 3 estão na tela dela HOJE** — a seção Desempenho os publica. O
conserto é em `plano_de_radio.py` e `secao_orcamento.py`, que **não são posse
desta frente**: estão RELATADOS, não curados. (Ver "o que sobrou".)

### 2. O achado da colisão ganhou linha própria — `scripts/check_colisao_de_sprints.py`

O defeito, medido na árvore de verdade antes de qualquer edição:

```
$ python scripts/check_colisao_de_sprints.py > saida.txt 2>&1 ; echo $?
1
$ grep -c '^FALHA' saida.txt
0
$ grep -n FALHA saida.txt
269:  docs/.../2026-08-24-ONDA0-Z5-...-conectado.mdFALHA: 16 colisão(ões) de posse não declarada(s):
```

**rc=1, e `grep '^FALHA'` devolve zero.** A causa: a lista de DÍVIDA ia para o
`stdout` e o bloco de falha para o `stderr`. Fundidos no mesmo destino (`> saída
2>&1`, que é o que o CI e o gancho fazem), o `stdout` ganha buffer de bloco e o
`stderr` não — o `FALHA:` era escrito **no meio de uma descarga parcial do
buffer** e saía colado no fim de um nome de arquivo, na linha 269, no meio de
276 linhas de dívida.

A cura tem três metades, e as três são necessárias:

1. **`sys.stdout.flush()` antes** de escrever no `stderr`, para que a ordem no
   arquivo fundido seja a ordem em que se mandou imprimir;
2. **um `\n` na frente do título**, que garante começo de linha mesmo se alguém
   escrever em `stdout` sem terminar a linha;
3. **a dívida impressa DEPOIS da falha, nunca em volta dela** — achado no fim de
   276 linhas de contexto é achado que ninguém lê.

Duas funções novas, `_imprime_falha` e `_imprime_divida`, e o `main()`
reorganizado em volta delas. **Nenhuma regra de decisão do portão mudou**: os
mesmos 16 pares são acusados, com os mesmos arquivos, e o rc continua 1
(conferido linha a linha abaixo).

Depois:

```
$ grep -c '^FALHA' saida.txt
1
$ head -3 saida.txt

FALHA: 16 colisão(ões) de posse não declarada(s):
  BORDA-DE-QUEDA-01 x LEVA-1: reivindicam os mesmos 1 arquivo(s) ...
```

## Qual mordida prova

### Mordida A — `test_o_achado_da_colisao_tem_linha_propria`

Planta duas sprints reivindicando o mesmo arquivo **mais 276 de dívida** (276 é
o número da árvore de verdade, e é ele que enche o buffer), roda o script em
subprocesso com `stdout` e `stderr` no MESMO arquivo, e cobra `^FALHA` ≥ 1 e a
falha ANTES da dívida.

**Cura arrancada** (`git stash push -- scripts/check_colisao_de_sprints.py`) —
e ela reproduz o defeito de campo byte a byte:

```
E   AssertionError: `grep -c '^FALHA'` devolveu ZERO numa saída que reprova com
E   rc=1 — o achado saiu colado no fim de outra linha, e quem lê a saída não o
E   encontra. As linhas que CONTÊM 'FALHA':
E     '  .colisao-de-mentira-72wq58nd/2026-08-26-DIVIDA-256-eeeeeeeeeeeeeeeeeeee
E      eeeeeeeeeeeeeeeeeeeeeeee.mdFALHA: 1 colisão(ões) de posse não declarada(s):'
E   assert 0 >= 1
1 failed in 0.31s
```

E, no mesmo estado, a segunda régua do mesmo teste:

```
E   AssertionError: a dívida foi impressa EM VOLTA da falha: o achado ficou no
E   fim de 300 linhas de contexto, que é o mesmo defeito por outro caminho
E   assert 24737 < 0
```

**Cura devolvida** (`git stash pop`):

```
.....                                                                    [100%]
5 passed in 0.32s
```

### Mordida B — `test_a_divergencia_esta_nomeada`

Ela cobra, por bancada: origem, destino e razão **das duas** réguas no relatório;
que nenhuma mande mover para o adaptador em que o controle já está; e a
**contagem de movimentos** de cada uma contra o que a bancada declara. E não tem
`except` em lugar nenhum — se uma régua levantar, o teste reprova.

**Régua da tela arrancada** (`ordem_de_redistribuicao` devolvendo `None` sempre):

```
E   AssertionError: [3-vizinho-com-folga] a régua da tela mandou mover 0,
E   e a bancada esperava 1.
FAILED ...::test_a_divergencia_esta_nomeada
1 failed, 4 passed
```

**Motor do arranjo arrancado** (o laço de rebalanceio virando `range(0)`):

```
E   AssertionError: [1-a-mesa-dela] o motor do arranjo mandou mover 0,
E   e a bancada esperava 2.
FAILED ...::test_a_divergencia_esta_nomeada
FAILED ...::test_a_regua_da_tela_nao_enxerga_adaptador_vazio
FAILED ...::test_na_mesa_dela_a_tela_cala_e_o_motor_manda_mover
3 failed, 2 passed
```

**Motor levantando exceção em vez de calar** (o caso "sem adaptador nenhum"
virando `raise ValueError`) — o teste reprova em vez de engolir, que é
exatamente o que a ordem pedia:

```
E   ValueError: MOTOR QUEBRADO — a mordida
FAILED ...::test_a_divergencia_esta_nomeada
1 failed, 4 passed
```

**As três curas devolvidas** (`git status --porcelain` limpo fora da minha
posse), e:

```
.....                                                                    [100%]
5 passed in 0.32s
```

### Os portões

```
$ git add -A && bash scripts/portoes.sh --rapido
  ruff                   ok          11 ms
  ...
REPROVOU: 1 vermelho(s) de 19 -> colisao-de-sprints
```

**`colisao-de-sprints` JÁ ESTAVA VERMELHO antes de eu tocar em qualquer coisa**,
e continua vermelho pela mesma razão, com os mesmos pares:

| | antes (capturado no início da sessão) | depois |
|---|---|---|
| rc | 1 | 1 |
| `grep -c '^FALHA'` | **0** | **1** |
| pares acusados | 16 | 16 |
| os pares são os mesmos? | `diff` dos 16 nomes: **idênticos** | |

O vermelho é a sprint `LEVA-1` desta leva colidindo com 16 sprints antigas.
**Não é posse desta frente** — o conserto é no frontmatter da sprint da leva
(`depois_de:` ou `nao_toca:`), que é de quem coordena. A cura desta frente não o
apagou; **fez com que ele possa ser LIDO**, que é a diferença entre 0 e 1 na
linha do `grep`.

Pelo mesmo motivo, `tests/unit/test_portao_a_colisao_de_sprints_morde.py::
test_nasce_reprovando_zero_na_arvore_de_verdade` está vermelho — e **estava
antes**, conferido com a cura fora (`git stash`):

```
=== com o script COMO ESTAVA NO HEAD (minha cura fora) ===
FAILED ...::test_nasce_reprovando_zero_na_arvore_de_verdade
1 failed in 0.31s
```

Os outros 82 daquele arquivo passam, e passam nos dois estados.

O portão de lápides, rodado inteiro depois da minha mudança:

```
$ pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
35 passed in 54.30s
```

**Não editei uma linha dele**, e não precisei: `tests/` nunca conta como
chamador (linha 37 do cabeçalho dele), então o meu teste chamar
`plano_dos_controles` não desarma a lápide dela.

## O que NÃO verifiquei

- **A ESCOLHA entre as duas réguas.** É palavra dela, e a decisão dela diz
  "a escolha vem depois, com o caso na mão". Os casos estão acima. Não escolhi,
  não sugeri qual vence, e não fiei nenhuma das duas a tela nenhuma.
- **Os achados 2, 3 e 4 não foram consertados nem confirmados na tela viva.** Eu
  os medi nos módulos (`plano_de_radio` + a leitura de `secao_orcamento.py:760`),
  **não abri a GUI e não fotografei a aba Desempenho.** Que a frase falsa
  realmente apareça para ela depende de o estado do daemon chegar como a bancada
  sintética o desenha — plausível, medido nos módulos, **não visto na tela**.
- **A reprodução do "colado" depende do limite do buffer.** As 276 linhas de
  dívida do teste estão afinadas para o `stdout` descarregar no meio de uma
  linha nesta máquina, e o comprimento do caminho da raiz entra nessa conta.
  Numa árvore com caminho muito diferente, a metade `^FALHA` da mordida pode
  parar de reproduzir o defeito antigo. **As duas afirmações que o teste faz
  sobre o código CURADO não dependem disso** (o `\n` à frente garante o começo de
  linha, e a ordem falha-antes-de-dívida é incondicional); o que pode variar é o
  quanto ele morde a versão velha. Medido: dos 250 tamanhos de dívida entre 150 e
  399, seis não reproduzem — 276 está no meio de uma faixa boa de 250 a 298.
- **Não rodei a suíte inteira** (regra da casa: é de quem coordena, e ela cria
  nós uinput de verdade). Rodei, por caminho: o meu arquivo, os três que citam
  `check_colisao_de_sprints`, os dois que citam `plano_dos_controles`, o da conta
  de slots, e o portão de lápides inteiro.
- **Não toquei a bancada física**, não parei daemon, não escrevi em `hidraw`, não
  chamei `systemctl`. A frente é `bancada: false`.
- **Não rodei `retratar_abas.py`** nem acrescentei linha a `portoes.sh` ou ao
  `ci.yml` (R-C e R-D).
- **Não medi o custo do meu teste na suíte** além do próprio arquivo: 5 testes em
  0,32 s, e o mais caro é o subprocesso que planta 278 arquivos num diretório
  temporário dentro da raiz (apagado no `finally`).

## O que sobrou para o próximo

1. **A ESCOLHA da régua é dela, e a G5 continua travada até ela dizer.** A
   medição que a `D-QUAL-REGUA-MANDA-NO-ARRANJO` exigia está feita e roda com um
   comando. Os quatro casos estão na tabela acima. **Nada a repropor: a pergunta
   é qual vence, e a resposta é dela.**

2. **DEFEITO VIVO, na tela dela hoje — a frase do adaptador único é falsa em
   dois estados.** `plano_por_adaptador` não produz plano para adaptador sem
   controle, então `ordem_de_redistribuicao` nunca vê um dongle livre, e a seção
   Desempenho publica *"Todos os controles estão no mesmo adaptador, e é o único
   que você tem"* quando (a) há um segundo adaptador vazio na mesa, e (b) há dois
   adaptadores cheios com os controles divididos entre eles. **Arquivos:**
   `integrations/plano_de_radio.py` (`plano_por_adaptador` e
   `ordem_de_redistribuicao`) e `app/actions/config/secao_orcamento.py:760`
   (`_algum_apertado`). **Nenhum dos dois é posse desta frente.** As bancadas 4 e
   6 do meu teste já são o caso a reproduzir.

3. **DEFEITO VIVO — a ordem de serviço manda mover de "Adaptador sem nome" para
   "Adaptador sem nome".** Dois dongles sem apelido dela viram a mesma palavra na
   frase de `ganho_esperado`, e a tela manda mover sem dizer para onde. **Arquivo:**
   `integrations/plano_de_radio.py`, `ordem_de_redistribuicao` (a frase) e
   `PlanoDoAdaptador.nome_na_tela`. Bancada 3. Texto de tela é decisão dela
   (R-E): **relatado, não escrito.**

4. **CONTRADIÇÃO ABERTA — "cabe?" tem duas respostas.** `PlanoDosControles.cabe`
   usa o teto de 100% e a `palavra_da_ocupacao` usa o corte de 85%. Numa mesa de
   1.562,4 de 1.600 a tela diz "Cheia" e o motor diz `cabe=True`. Se a régua
   escolhida for o motor, este corte precisa de decisão antes de chegar à tela —
   senão a mesma seção vai carregar as duas palavras.

5. **O vermelho do `colisao-de-sprints` é de quem coordena.** A sprint `LEVA-1`
   reivindica 16 arquivos que 16 sprints antigas também reivindicam, sem
   `depois_de:` nem `nao_toca:`. O conserto é uma linha no frontmatter da sprint
   da leva. **Agora ele aparece no topo da saída, e `grep '^FALHA'` o acha** — o
   que antes não acontecia, e é como ele atravessou a leva sem ser visto.

6. **Se algum dia a frente que curar o achado 2 mexer no meu teste:** o
   `test_a_regua_da_tela_nao_enxerga_adaptador_vazio` foi escrito para reprovar
   se a régua da tela PASSAR a ver o dongle vazio, com a mensagem dizendo o que
   fazer: atualizar o achado 2 do cabeçalho, não apagar o teste. O achado é
   medição datada; a régua é que muda.
