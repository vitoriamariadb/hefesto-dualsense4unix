---
sprint: GTK-3
estado: feita
decisoes: [D-0609-GTK-LEVA-INTEIRA]
posse:
  GTK3:
    - src/hefesto_dualsense4unix/gui/
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/main.py
    - src/hefesto_dualsense4unix/app/constants.py
    - scripts/gui-captura/retratar_abas.py
    - pyproject.toml
    - packaging/
    - install.sh
    - README.md
depois_de: [GTK-1, GTK-2]
nao_toca:
  - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
  - src/hefesto_dualsense4unix/app/actions/
  - src/hefesto_dualsense4unix/app/widgets/
  - src/hefesto_dualsense4unix/app/telas/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/interface/
---

# GTK-3 · A JANELA SAI (3 de 3) — os sessenta e dois testes, um a um, e a remoção

> **A decisão dela, 06/09/2026** (`D-0609-GTK-LEVA-INTEIRA`): a leva inteira
> nas 24 horas. **O motor fica** (`app/actions/`, `app/widgets/`,
> `app/telas/`, `daemon/`) — é o reuso que ela pediu. **A janela sai.**

**ESTA É A ÚLTIMA DAS TRÊS, e ela só abre com as duas anteriores fechadas.** A
`GTK-1` deixou o inventário com veredito por linha; a `GTK-2` desatou os
leitores do glade. Sem elas, apagar o `main.glade` quebra a aba Vibração da
interface **nova**, na importação.

---

## 1. A ADVERTÊNCIA QUE VALE MAIS QUE TODAS — não faça substituição em massa

**Esta casa pagou por isso em 05/09**: das dezoito réguas que casavam a tag do
chip, **duas foram devolvidas** — uma falava de um `<span>` que não era o da
fita, e a outra teria tido **a asserção INVERTIDA**.

> *Substituição em massa sobre uma régua é edição cega; cada uma tem de ser
> lida.*

**Os 62 arquivos de teste que citam o `main.glade` são lidos um a um**, e cada
um responde a **uma de três** perguntas (plano D-19, Passo 4):

| pergunta | destino |
| --- | --- |
| **(a)** mede a JANELA | sai com ela |
| **(b)** mede o MOTOR | fica, com o caminho trocado |
| **(c)** mede a INTERFACE NOVA e nunca devia ter citado o glade | corrige-se onde está |

**Escreva o veredito de cada um no relatório.** 62 linhas é o produto desta
sprint tanto quanto a remoção.

---

## 2. O QUE O INVENTÁRIO DA GTK-1 JÁ ACHOU, e muda o que se remove

**`gui/aba_conexoes.py` e `gui/aba_sistema.py` NÃO são a janela.** Medido em
06/09: `interface/pacotes/a08_conexoes.py` os importa em **cerca de vinte
pontos** (`Vibracao`, `RESPOSTAS_DO_VIZINHO`, `SELO_DO_ESTADO`, `TRACO`,
`Controle`, `_e`…) e `interface/pacotes/a09_sistema.py:63` faz
`from hefesto_dualsense4unix.gui import aba_sistema as _tela`.

**Removê-los apaga as abas 08 e 09 da interface nova.** Eles **ficam** — ou
mudam de casa para o motor, **com a recomendação da `GTK-1` na mão e o caminho
trocado em todos os chamadores no MESMO commit**.

**A regra que decide, e ela é dela:** *reaproveitar o que fiz no gtk e não
apontar nada mais pra lá*. O que a interface nova **consome** é reuso e fica; o
que **monta janela** sai.

---

## 3. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — os 62 testes, um a um (começa na ONDA D)

Ver a §1. **Este passo é longo de propósito e não se apressa.**

**A MORDIDA:** para cada teste que você reaponta, rode-o **antes e depois** e
cole as duas saídas. Um teste que passa nos dois casos sem medir nada é o que
esta sprint tem de evitar produzir.

### Passo 2 — a remoção (ONDA E)

`app/app.py`, `app/main.py`, `gui/main.glade`, `gui/theme.css`,
`scripts/gui-captura/retratar_abas.py`, e o que o inventário marcar
`SAI-COM-A-JANELA`.

**`gui/ponte_da_tela.py` NÃO SAI.** Está no `nao_toca`, e é o piloto HTML.

**Cuidado com o `retratar_abas.py`:** o `pre-commit` desta casa **bloqueia**
commit que mexe em `app/`, `gui/` ou `scripts/gui-captura` **sem levar foto
junto** (`scripts/check_fotos_da_tela.py`). Se o fotógrafo da janela antiga
sair, **quem fotografa as dez abas novas tem de estar de pé antes** — senão a
próxima pessoa fica com um gancho que cobra uma foto que nada mais tira.
**Meça isso e resolva; não deixe para o FECHO.**

### Passo 3 — `pyproject.toml`, `packaging/`, `install.sh`, README

`pyproject.toml:112` inclui `gui/*.glade` no wheel. O `packaging/` e o
`install.sh` falam da janela (`test_packaging_ativacao_deb.py:260`), e o
`install.sh` tem o `.desktop` e o entry point.

**O `.desktop` é o lançador DELA**, e ele aponta para a interface HTML desde
01/09 (decisão dela: *"Só a nova tá disponível e deve ser integrada"*). **Ele
tem de continuar abrindo as dez abas** — é a prova final.

### Passo 4 — a prova, e ela NÃO é sua

**Você NÃO roda o `install.sh`.** Nem `--yes`, nem dry-run. Ele reescreve
`~/.local/bin`, o `.desktop` e a unit systemd — **únicos por máquina** — e
reinicia o daemon **que ela está usando**.

**Quem o roda é o coordenador, no FECHO, na árvore dela.** O que você entrega é
a árvore em que ele vai rodar. Escreva no relatório **o que o coordenador deve
esperar**: `rc=0`, `doctor` sem FALHA, o `.desktop` abrindo as dez abas, **sem
`gui/`**.

---

## 4. NADA SE PERDEU

* **O motor inteiro**: `app/actions/` (24 arquivos), `app/widgets/` (nove,
  incluindo `controller_card.py` e `mapa_da_mesa.py`), `app/telas/`, `daemon/`.
  **É o que a interface nova chama a cada tique.** Apagar `app/` pelo nome
  derrubaria as dez abas — está escrito no plano D-19 desde 05/09.
* **`gui/ponte_da_tela.py`**, e agora também `gui/aba_conexoes.py` e
  `gui/aba_sistema.py` enquanto forem donos de frase da interface nova (§2).
* **O lançador dela** — `e0bb5b79` o devolveu em 06/09 e ele **não** volta a
  quebrar nesta sprint.
* **A régua da foto**: o `pre-commit` continua cobrando (Passo 2).

## A PROVA

1. **Os 62 vereditos**, no relatório.
2. **A suíte do escopo** verde depois da remoção — a completa é do coordenador,
   em doze lotes, no FECHO.
3. **As dez abas montando** sem `gui/` — `--oculta`, e a foto de cada uma.
4. **A mordida:** devolva um import de `gui/` removido e prove que o portão da
   `GTK-1` reprova.
