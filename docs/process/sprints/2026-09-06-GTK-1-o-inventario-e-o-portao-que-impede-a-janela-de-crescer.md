---
sprint: GTK-1
estado: feita
decisoes: [D-0609-GTK-LEVA-INTEIRA]
posse:
  GTK1:
    - scripts/check_nada_aponta_para_a_janela.py
    - tests/unit/test_nada_novo_aponta_para_a_janela.py
    - docs/data/o-que-ainda-aponta-para-a-janela.csv
    - scripts/portoes.sh
    - .github/workflows/ci.yml
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/gui/
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/interface/
  - pyproject.toml
  - install.sh
  - packaging/
---

# GTK-1 · A JANELA SAI (1 de 3) — o inventário, e o portão que impede a janela de crescer

> ## FEITA — 06/09/2026. O número é **255 pares · 522 citações**.
>
> | veredito | pares | citações |
> | --- | ---: | ---: |
> | `MOTOR-MUDA-DE-CASA` | 186 | 391 |
> | `SAI-COM-A-JANELA` | 57 | 108 |
> | `NUNCA-DEVIA-CITAR` | 12 | 23 |
>
> **A RECOMENDAÇÃO QUE A `GTK-2`/`GTK-3` ESPERAM: `gui/aba_conexoes.py`,
> `gui/aba_sistema.py`, `gui/ponte_da_tela.py` e `gui/widgets/` FICAM — e MUDAM
> DE CASA.** Nenhum dos quatro é a janela; os quatro são motor com endereço
> errado. Medido: `gui/aba_conexoes` é importado por `a08_conexoes.py` em 23
> pontos e `gui/aba_sistema` por `a09_sistema.py` em 7 — apagá-los apaga as abas
> 08 e 09 da interface NOVA. `gui/main.glade`, `gui/theme.css`, `app/app.py` e
> `app/main.py` são os alvos que morrem.
>
> **E `gui/theme.css` NÃO É ARTEFATO DA JANELA**, ao contrário do que o plano
> D-19 §Passo 5 lista: ele é a PALETA CANÔNICA da casa. `test_paleta_unica.py`
> deriva dele a lista de cores aceitas e `scripts/paleta_da_casa.py` o nomeia
> como fonte dos quatro HTML de `html/`. Removê-lo com a janela cega o portão da
> paleta. Ele muda de casa; não sai.
>
> **A CONTA ESCONDIDA DA `GTK-3`, medida aqui e por ninguém antes: 233
> documentos de `docs/` citam `main.glade` entre crases** (mais 104 com
> `app/app.py`, 36 com `theme.css`, 16 com `app/main.py`). O
> `validar-referencias-docs.py` varre `docs/` inteiro e reprova caminho que não
> existe — então apagar o glade herda 233 documentos vermelhos no portão
> `referencias-docs`, que esta casa levou a zero em 31/08 e 01/09. Não há atalho
> automático.
>
> **A PROVA — as duas metades do portão, mordidas na árvore de verdade:**
>
> ```
> # 1. import novo de gui/ num arquivo de interface/
> src/hefesto_dualsense4unix/interface/aba_de_mentira_da_mordida.py:3: CITAÇÃO NOVA
>   para a janela (gui.app). …declare-a em docs/data/o-que-ainda-aponta-para-a-janela.csv
>   com veredito e razão.                                                    rc=1
>
> # 2. linha nova no CSV sem veredito
> docs/data/o-que-ainda-aponta-para-a-janela.csv:257: veredito '(vazio)' não é um dos
>   três (MOTOR-MUDA-DE-CASA, NUNCA-DEVIA-CITAR, SAI-COM-A-JANELA) —
>   scripts/instrumento_de_mentira.py · gui/main.glade.                      rc=1
>
> # desfeitas as duas
> OK: 255 pares (arquivo, alvo) · 522 citações à janela, todas declaradas.    rc=0
> #  os 44 portões: TODOS VERDES.
> ```
>
> **DOIS INSTRUMENTOS FALSOS CAÍRAM ESCREVENDO ISTO, e os dois são meus:**
> o `tokenize` marcava `MAIN_GLADE = GUI_DIR / "main.glade"` como **prosa** (todo
> token `STRING` contava como comentário) — a dependência mais dura da árvore
> saía carimbada de "é só um comentário"; e a primeira peneira de desempenho,
> escrita à mão, **perdia 20 pares e 35 citações** porque nenhuma das cadeias
> cobria `hefesto_dualsense4unix.app.app` na forma pontuada. A peneira passou a
> ser derivada das próprias agulhas, com régua provando a igualdade.
>
> **E O GRAFO NÃO SERVIU SOZINHO:** `code-review-graph query importers_of
> gui/aba_sistema.py` devolveu **2** importadores e não achou
> `a09_sistema.py:71` nem `sistema_viva.py:57` — os dois `from … import` de
> topo de módulo. O inventário é do `tokenize`; o grafo corroborou, não mediu.
> (Armadilha já escrita em `COMO-EXECUTAR-UMA-SPRINT.md` §9: *valide o
> instrumento contra respostas que você já conhece*.)
>
> Relatório: `docs/process/agentes/2026-09-06/GTK-1.md`.

> **A decisão dela, 06/09/2026** (`D-0609-GTK-LEVA-INTEIRA`): *"a ideia sempre
> foi reaproveitar o que fiz no gtk e não apontar nada mais pra lá mas pro
> html. só que o claude opus fez o contrário e isso foi ficando aqui"*.
>
> **A leva inteira entra nas 24 horas. O motor fica: é reuso.**

**ESTA SPRINT NÃO REMOVE NADA.** Ela mede, e põe um portão. A remoção é a
`GTK-3`; desatar os leitores do glade é a `GTK-2`.

**A razão de a medição vir primeiro está escrita no plano D-19, e ela já
mordeu uma vez:** apagar o `main.glade` **quebra a aba Vibração da interface
NOVA na importação, com `SystemExit`** — porque `interface/aba05.py:273` lê três
textos de tela de lá, no corpo do módulo. É o oposto do esperado de uma remoção
de código morto.

---

## 1. O QUE JÁ ESTÁ MEDIDO — e o que o plano D-19 ainda não tinha medido

Do plano (`A-JANELA-GTK-SE-APOSENTA-DEPOIS-01` §2), já medido:

* **`main.glade`**: 4305 linhas, citado por **62 arquivos de `tests/`**; fora da
  janela, seis programas o abrem — e **dois deles não são da janela**
  (`integrations/storm_doctor.py:69` e `interface/aba05.py:273`).
* **`app.main`**: seis arquivos de teste, e **só UM** o importa.

**E o que o plano NÃO tinha medido, e este orquestrador mediu em 06/09** — é o
achado que mais muda o escopo da `GTK-3`:

```
imports de `hefesto_dualsense4unix.gui` fora de `gui/`, por alvo:
     14  gui.ponte_da_tela      (+2)   ← já se sabia que FICA: é o piloto HTML
     13  gui.aba_conexoes              ← a INTERFACE NOVA lê o dono aqui
     11  gui                           (importações do pacote)
      2  gui.aba_sistema        (+1)   ← idem
      1  gui.widgets
```

**`interface/pacotes/a08_conexoes.py` importa `gui/aba_conexoes` em cerca de
vinte pontos** (`Vibracao`, `RESPOSTAS_DO_VIZINHO`, `SELO_DO_ESTADO`, `TRACO`,
`Controle`, `_e`…), e **`interface/pacotes/a09_sistema.py:63`** faz
`from hefesto_dualsense4unix.gui import aba_sistema as _tela`.

**A consequência, e ela contradiz a leitura fácil de "remover `gui/` menos a
ponte":** `gui/aba_conexoes.py` e `gui/aba_sistema.py` **não são a janela** —
são **donos de frase e de estado que a interface nova consome**. Removê-los
apaga as abas 08 e 09. **Eles ficam, ou mudam de casa para o motor — e essa
decisão é do inventário desta sprint.**

**A palavra dela cobre isto:** *reaproveitar o que fiz no gtk*. O que a
interface nova já reusa **é** o reuso que ela pediu; o que sai é a **janela**.

---

## 2. O TRABALHO, EM TRÊS PASSOS

### Passo 1 — o inventário, num CSV com dono

`docs/data/o-que-ainda-aponta-para-a-janela.csv`, uma linha por citação, com:
**arquivo · linha · o que cita · a pergunta respondida · o veredito**.

Os vereditos são **três**, e são os do plano D-19 §Passo 4:

| veredito | o que significa | destino |
| --- | --- | --- |
| `SAI-COM-A-JANELA` | mede ou monta a janela | some na `GTK-3` |
| `MOTOR-MUDA-DE-CASA` | mede o motor e o caminho é que está errado | a `GTK-2`/`GTK-3` reaponta |
| `NUNCA-DEVIA-CITAR` | é da interface nova e cita o glade por hábito | corrige-se onde está |

**O instrumento certo é o `fazer_grafos`** — ele responde *"quem chama isto"* em
segundos, e o plano D-19 o nomeia. **Use-o**; um `grep` sozinho confunde prosa
com chamada, e boa parte destas citações é comentário (a aba 06 cita
`main.glade:79` **em prosa**, como fonte da faixa numérica).

**O CSV é a lista, e a regra dela é uma só: ela só DIMINUI.** É o que faz o
portão do Passo 2 ter sentido.

### Passo 2 — o portão: *nada novo aponta para a janela*

`scripts/check_nada_aponta_para_a_janela.py` <!-- ref-externa: nasce NESTA sprint -->
reprova **import novo de `gui/`
fora da lista do CSV**, e reprova **linha nova no CSV** que não venha com o
veredito e a razão.

**Ele entra nos 43 portões** — e a lista tem UM dono, `scripts/portoes.sh`, com
um portão do portão (`test_portao_a_lista_de_portoes_e_uma_so.py`) que compara
com o `ci.yml` **nos dois sentidos**. **Acrescente nos dois**, ou a leva fecha
verde local e vermelha no CI, que já aconteceu duas vezes nesta casa.

**A MORDIDA — e ela tem duas metades, porque o portão tem duas:**
1. escreva num arquivo qualquer de `interface/` um `from hefesto_dualsense4unix.gui import app` novo → o portão reprova, nomeando arquivo e linha;
2. acrescente uma linha ao CSV sem veredito → o portão reprova.
Desfaça as duas e ele passa. **Portão que passa com a cura arrancada não mede
nada**, e esta casa achou seis instrumentos falsos em três dias.

### Passo 3 — o número, no relatório

O relatório fecha com **o número de hoje**: quantas citações, quantas de cada
veredito, e a lista dos arquivos com `SAI-COM-A-JANELA`. É esse número que a
`GTK-3` vai fazer chegar a zero, e é ele que entra no `ONDE-PARAMOS` do FECHO.

---

## 3. O QUE ESTA SPRINT NÃO FAZ

* **Não remove uma linha.** Nem de `gui/`, nem de `pyproject.toml`, nem de
  `install.sh`, nem dos 62 testes. Tudo isso está no `nao_toca`.
* **Não desata os leitores do glade.** É a `GTK-2`.
* **Não decide sozinha o destino de `gui/aba_conexoes.py` e `gui/aba_sistema.py`
  — ela MEDE e RECOMENDA.** Quem executa é a `GTK-2`/`GTK-3`, e o coordenador lê
  a recomendação antes de despachá-las.

## 4. NADA SE PERDEU

* **`gui/ponte_da_tela.py` não sai nunca**: é do piloto HTML, e está nomeada em
  todas as três sprints.
* **O motor fica inteiro** (`app/actions/`, `app/widgets/`, `app/telas/`,
  `daemon/`) — é o reuso que ela pediu com todas as letras.
* **A lista de portões continua com UM dono.**

## A PROVA

Esta sprint **não tem tela** — não invente foto. A prova é a **mordida do
portão** (as duas metades, saída colada) e o **CSV** com o número.
