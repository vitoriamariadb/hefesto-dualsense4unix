# GTK-1 — o inventário, e o portão que impede a janela de crescer

**06/09/2026 · árvore `hefesto-voo/GTK-1-BGTK1`, branch `voo/GTK-1-BGTK1`,
nascida de `onda/atual-0609` em `eb7b844c`.**

> **A decisão dela** (`D-0609-GTK-LEVA-INTEIRA`): *"a ideia sempre foi
> reaproveitar o que fiz no gtk e não apontar nada mais pra lá mas pro html. só
> que o claude opus fez o contrário e isso foi ficando aqui"*.

**ESTA SPRINT NÃO REMOVEU UMA LINHA.** Ela mediu e pôs um portão.

---

## O que mudou

**O NÚMERO É 255 pares (arquivo, alvo) · 522 citações.**

| veredito | pares | citações |
| --- | ---: | ---: |
| `MOTOR-MUDA-DE-CASA` | 186 | 391 |
| `SAI-COM-A-JANELA` | 57 | 108 |
| `NUNCA-DEVIA-CITAR` | 12 | 23 |

Quatro arquivos, e dois deles são a lista e o CI:

* **`docs/data/o-que-ainda-aponta-para-a-janela.csv`** — o inventário, uma
  linha por (arquivo, alvo), com `linhas`, `natureza`, `ocorrencias`,
  `pergunta_respondida`, `veredito` e `razao`. O cabeçalho carrega a regra de
  classificação e o que a varredura NÃO cobre, com o número.
* **`scripts/check_nada_aponta_para_a_janela.py`** — o portão, com `--censo`
  (a varredura crua) e `--podar` (que **só encolhe**).
* **`tests/unit/test_nada_novo_aponta_para_a_janela.py`** — 19 réguas, as duas
  metades mordidas.
* **`scripts/portoes.sh`** (camada `completo`) e **`.github/workflows/ci.yml`**
  — nos dois, porque `test_portao_a_lista_de_portoes_e_uma_so.py` compara os
  dois sentidos. Os portões passam de 43 para **44**.

### A RECOMENDAÇÃO — é o que decide o escopo da `GTK-3`

**`gui/aba_conexoes.py` e `gui/aba_sistema.py` FICAM, e MUDAM DE CASA.
Junto com eles, `gui/ponte_da_tela.py` e `gui/widgets/`.**

A razão é medida, não estilística: **nenhum dos quatro é a janela.**

| módulo | quem o consome hoje | citações |
| --- | --- | ---: |
| `gui/aba_conexoes.py` | `interface/pacotes/a08_conexoes.py` | **23** num arquivo só |
| `gui/aba_sistema.py` | `interface/pacotes/a09_sistema.py` (7), `sistema_viva.py` (3), `aba09.py` (3), `a01_jogar.py` | 16 no total |
| `gui/ponte_da_tela.py` | o piloto HTML — 10 arquivos de `interface/` e 2 ensaios | 21 |
| `gui/widgets/` | `app/widgets/controller_card.py` (motor GTK) e réguas | 16 |

Apagar `gui/aba_conexoes.py` e `gui/aba_sistema.py` **apaga as abas 08 e 09 da
interface NOVA**. Eles são donos de frase e de estado (`Vibracao`,
`RESPOSTAS_DO_VIZINHO`, `SELO_DO_ESTADO`, `DE_PE`, `GESTOS`) que a tela nova lê
a cada tique — exatamente o *"reaproveitar o que fiz no gtk"* da decisão dela.
O que está errado neles é **o endereço**: moram na casa da janela.

**Os alvos que MORREM são quatro, e só quatro:** `gui/main.glade`,
`app/app.py`, `app/main.py` — e nenhum outro.

### E `gui/theme.css` NÃO É ARTEFATO DA JANELA

O plano D-19 §Passo 5 o lista entre as remoções. **Medido, ele tem um segundo
dono, e o segundo é maior que o primeiro:**

* `tests/unit/test_paleta_unica.py:113,121` **deriva dele** a lista de cores
  aceitas em toda a casa (`test_a_paleta_do_teste_bate_com_os_tokens_do_css`);
* `scripts/paleta_da_casa.py:23` o nomeia como a fonte dos tokens que os quatro
  HTML de `html/` compartilham (`specs.html`, `painel.html`,
  `frases-de-tela.html`, `index.html`);
* 44 arquivos o citam, e a maioria é o motor dizendo de onde vem um hex.

**Removê-lo com a janela cega o portão da paleta.** Ele muda de casa.

### A CONTA ESCONDIDA DA `GTK-3` — 233 documentos

Ninguém tinha medido isto, e ele não aparece em nenhum arquivo da leva:

| citação, entre crases ou como alvo de link, em `docs/**/*.md` | documentos |
| --- | ---: |
| `main.glade` | **233** |
| `app/app.py` | 104 |
| `theme.css` | 36 |
| `app/main.py` | 16 |
| `gui/aba_conexoes.py`, `gui/aba_sistema.py`, `gui/ponte_da_tela.py`, `gui/widgets/` | 51 |

`scripts/validar-referencias-docs.py` varre **`docs/**/*.md` e só isso**
(`documentos_de`, `:821`, `pasta = raiz / "docs"`) e reprova caminho que não
existe, com leniência de sufixo — então `gui/main.glade` casa com o caminho
real. **Apagar o glade herda 233 documentos vermelhos no portão
`referencias-docs`**, que esta casa levou a zero em 31/08 e 01/09.

Não há atalho automático: ou os caminhos removidos são declarados como
históricos no portão (como já se fez com `EXTERNOS`), ou as 233 se reescrevem.
**Isto não é do escopo da GTK-1 e fica para a GTK-3** — está escrito no
cabeçalho do CSV para não se perder.

Por isso a varredura **não cobre `docs/`**: é prosa histórica datada, e esta
casa não apaga registro. O CSV cobre `src/ tests/ scripts/ packaging/ flatpak/`
e os arquivos soltos da raiz.

---

## Qual mordida prova

O portão tem duas metades, e as duas foram mordidas **na árvore de verdade**,
não num dublê.

### METADE 1 — import novo de `gui/` fora da lista reprova, nomeando arquivo e linha

```
$ cat > src/hefesto_dualsense4unix/interface/aba_de_mentira_da_mordida.py <<'EOF'
"""Arquivo de MORDIDA da GTK-1 — apagado logo abaixo."""

from hefesto_dualsense4unix.gui import app
EOF
$ python scripts/check_nada_aponta_para_a_janela.py
FALHA: 1 problema(s) — nada novo aponta para a janela.

  src/hefesto_dualsense4unix/interface/aba_de_mentira_da_mordida.py:3: CITAÇÃO NOVA
  para a janela (gui.app). A janela GTK está sendo aposentada
  (D-0609-GTK-LEVA-INTEIRA): o motor é que se reusa, não a janela. Se esta citação
  tem de existir, declare-a em docs/data/o-que-ainda-aponta-para-a-janela.csv com
  veredito e razão.
rc=1

$ rm src/hefesto_dualsense4unix/interface/aba_de_mentira_da_mordida.py
$ python scripts/check_nada_aponta_para_a_janela.py
OK: 255 pares (arquivo, alvo) · 522 citações à janela, todas declaradas com veredito.
rc=0
```

E a lista **só diminui**: uma ocorrência a MAIS num par já declarado também
reprova —
`a lista CRESCEU em gui/main.glade (1 declarada(s), 5 viva(s)). Esta lista só diminui.`

### METADE 2 — linha nova no CSV sem veredito reprova

```
$ echo 'scripts/instrumento_de_mentira.py,7,gui/main.glade,código,1,,,' >> \
    docs/data/o-que-ainda-aponta-para-a-janela.csv
$ python scripts/check_nada_aponta_para_a_janela.py
FALHA: 3 problema(s) — nada novo aponta para a janela.

  docs/data/o-que-ainda-aponta-para-a-janela.csv:257: veredito '(vazio)' não é um
  dos três (MOTOR-MUDA-DE-CASA, NUNCA-DEVIA-CITAR, SAI-COM-A-JANELA) —
  scripts/instrumento_de_mentira.py · gui/main.glade.
  docs/data/o-que-ainda-aponta-para-a-janela.csv:257: `pergunta_respondida` vazia — …
  docs/data/o-que-ainda-aponta-para-a-janela.csv:257: `razao` vazia — …
rc=1

# a MESMA linha, agora com veredito, pergunta e razão:
OK: 255 pares (arquivo, alvo) · 522 citações à janela, todas declaradas com veredito.
rc=0
```

`git status --short` depois das duas mordidas não trouxe uma linha a mais que as
quatro entregas: a árvore voltou ao que era.

### A régua também sabe recusar o `--podar`

`test_o_podar_so_encolhe` põe uma citação nova E apaga uma declarada, roda
`--podar` e exige que ele tenha apagado a morta **e NÃO acrescentado a nova** —
se acrescentasse, bastaria rodá-lo para lavar uma citação nova, e o portão
assinaria embaixo do que existe para barrar.

---

## Os dois instrumentos falsos que caíram no caminho — e os dois eram meus

**1. O `tokenize` chamava de PROSA a dependência mais dura da árvore.**
A primeira versão marcava todo token `STRING` como prosa. Com isso

```
MAIN_GLADE = GUI_DIR / "main.glade"     (app/constants.py:12)
_CSS_PATH  = GUI_DIR / "theme.css"      (app/theme.py:37)
```

saíam do inventário carimbados `prosa` — e a `GTK-3` leria *"é só um
comentário"* sobre o **caminho canônico do arquivo**. Prosa passou a ser
comentário e aspas TRIPLAS; um caminho entre aspas simples é código. O número
mudou junto: de 183 pares "prosa pura" para **111**, com 85 tocando o artefato
em código.

**2. A peneira de desempenho media menos do que o filtro.**
Para o portão caber no `portoes.sh`, uma peneira barata pula o `tokenize` de
quem não tem agulha nenhuma. Escrita à mão (`"main.glade"`, `"theme.css"`,
`"app/app.py"`, `".gui"`, …), **ela perdeu 20 pares e 35 citações de uma vez**:
nenhuma cadeia cobria `hefesto_dualsense4unix.app.app` na forma pontuada. O
portão dizia `235 pares · 487 citações` e passava verde.

A peneira passou a ser **derivada por união das próprias expressões do filtro**
— não pode divergir por construção — e `test_a_peneira_nao_muda_a_conta`
exercita as nove formas.

## O que NÃO verifiquei

* **Não abri a tela, e não havia o que abrir.** Esta sprint não toca interface;
  não há foto e não inventei uma.
* **Não rodei a suíte inteira** (regra da casa: é de quem coordena, e roda no
  fim). Rodei o meu escopo e o portão do portão.
* **Não li as 186 linhas `MOTOR-MUDA-DE-CASA` uma a uma.** As 57
  `SAI-COM-A-JANELA` e as 12 `NUNCA-DEVIA-CITAR` foram classificadas lendo a
  docstring de cada arquivo citador; as `MOTOR-MUDA-DE-CASA` são o **resto**, e
  o resto é o veredito conservador — quem fica, fica. **O plano D-19 §Passo 4
  manda ler cada uma antes de apagar, e continua valendo:** *"substituição em
  massa sobre uma régua é edição cega"*.
* **Não medi `app/actions/` módulo a módulo.** O plano D-19 §2 diz que quatro
  dos 24 não têm chamador na interface nova (`carona_do_wrapper`,
  `contrato_da_mascara`, `footer_actions`, `launch_wrapper_dialog`) e que isso
  **não** os torna da janela. Continua não medido, e continua sendo a resposta
  honesta.
* **O `code-review-graph` foi construído nesta árvore** (1.694 arquivos, 38.727
  nós, 276.329 arestas, no commit `eb7b844c`) e **corroborou, não mediu** — a
  razão está abaixo.

## O que sobrou para o próximo

1. **`GTK-2`** — os dois leitores de glade: `interface/aba05.py:273` (os três
   textos de tela; o dono natural é `app/telas/vibracao.py`) e
   `integrations/storm_doctor.py:69` (o rótulo do botão). Estão no CSV como
   `NUNCA-DEVIA-CITAR` e `MOTOR-MUDA-DE-CASA`, com as linhas.
2. **`GTK-2`/`GTK-3`** — a mudança de casa de `gui/aba_conexoes.py`,
   `gui/aba_sistema.py`, `gui/ponte_da_tela.py`, `gui/widgets/` e
   `gui/theme.css`, com as 391 citações reapontadas. Rodar `--podar` depois:
   ele só encolhe.
3. **`GTK-3`** — **os 233 documentos de `docs/`**. É a maior conta da leva e ela
   não estava em nenhum plano.
4. **`GTK-3`** — as 57 linhas `SAI-COM-A-JANELA` em 47 arquivos. Atenção aos
   MISTOS: `test_carona_do_wrapper_01` e `test_largura_a_mesma_em_todas_as_abas`
   cobrem **também** o motor; apagar o arquivo inteiro perde cobertura viva. O
   veredito é sobre a CITAÇÃO, não sobre o arquivo — está no cabeçalho do CSV.
5. **`test_ambiente_presumido_01`** continua sendo a única régua do display
   inalcançável, e ela importa `app.main` (`:25`). Está no CSV como
   `MOTOR-MUDA-DE-CASA`: o `_x11_alcancavel` muda de casa junto, como o plano
   D-19 §Passo 3 já mandava.

## O que o `fazer_grafos` respondeu — e o que ele não respondeu

O índice foi construído nesta árvore e **validado contra respostas que eu já
conhecia**, como manda `COMO-EXECUTAR-UMA-SPRINT.md` §9. Ele acertou
`gui/aba_conexoes.py` (achou `a08_conexoes.py:42` e quatro réguas) e
`gui/ponte_da_tela.py` (11 importadores).

**E errou o terceiro:** `query importers_of gui/aba_sistema.py` devolveu **2**
importadores — e não achou `interface/pacotes/a09_sistema.py:71` nem
`interface/sistema_viva.py:57`, que são `from … import` de **topo de módulo**,
não import dentro de função. São exatamente as duas dependências que a §1 da
sprint nomeia como o achado que muda o escopo da `GTK-3`.

**Por isso o inventário é do `tokenize`, e o grafo entrou como segunda opinião.**
Um instrumento de terceiro que erra a resposta conhecida não pode ser a fonte da
resposta desconhecida.

## Comandos, para refazer

```bash
source .envrc-voo
python scripts/check_nada_aponta_para_a_janela.py           # o portão
python scripts/check_nada_aponta_para_a_janela.py --censo    # a varredura crua
python -m pytest tests/unit/test_nada_novo_aponta_para_a_janela.py -q
```
