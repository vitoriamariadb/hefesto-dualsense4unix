---
sprint: GTK-1
estado: aberta
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
