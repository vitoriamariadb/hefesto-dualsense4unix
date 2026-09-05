---
sprint: ONDA5-08-02
decisoes: [08-Q8]
posse:
  M08:
    - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
    - src/hefesto_dualsense4unix/interface/aba08.py
    - mockup/08-conexoes.html
    - src/hefesto_dualsense4unix/interface/paginas/08-conexoes.html
    - tests/unit/test_a_aba_08_conexoes_fecha_as_linhas.py
depois_de:
  - ONDA5-08-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/monta.py
depois_de: [LEVA-3, MIGRA-CONEXOES-12, ONDA2-08-CONEXOES-01]
---

# ONDA5-08-02 · DEFEITO — o rodapé do mapa tem dois donos, e um deles é a aba

> **08-Q8, ela marcou "Trocar pela verdade":**
> *"A mesma linha passa a dizer que cada mudança ali já foi gravada, e fica
> certa no minuto em que entra."*

**A DECISÃO DELA JÁ ESTÁ NA TELA.** Medido em 05/09: a frase nova está em
`aba08.py:1535` e nas duas cópias do HTML, e a antiga não aparece na página
publicada — `grep "Aplicar, na barra de baixo"` em
`src/hefesto_dualsense4unix/interface/paginas/08-conexoes.html` devolve **zero**.
Não há decisão a executar.

**O que esta sprint fecha é a dívida que a entrega declarou**, e está escrita no
próprio arquivo:

> *"O dono precisa de uma segunda frase, para quem grava no clique;
> `mapa_da_mesa.py` não é desta sprint, e o pedido está no relatório desta
> frente."*
> — `src/hefesto_dualsense4unix/interface/aba08.py:1532-1534`

---

## 1. O QUE SE MEDIU

### 1.1 Duas frases, dois donos, e só uma é lida do dono

| frase | onde mora | quem a mostra |
| --- | --- | --- |
| *"O desenho vale quando você clicar em Aplicar…"* | `app/widgets/mapa_da_mesa.py:135-136` (`ESPERA_O_APLICAR`) | o `Gtk.Label` de `mapa_da_mesa.py:566` |
| *"Cada mudança aqui já foi gravada, no clique."* | **`interface/aba08.py:1535`** (`MAPA_JA_GRAVOU`) | a janelinha do mapa da interface nova, `aba08.py:2837` |

**A segunda está do lado errado da fronteira**, e a linha vizinha à que a
imprime prova: em `aba08.py:2832-2835` os quatro rótulos daquela mesma
janelinha saem de `MAPA["ROTULO_TIRAR"]`, `MAPA["ROTULO_EXTENSAO"]`,
`MAPA["NOME_DA_FACE_EM_BRANCO"]` e `MAPA["ROTULO_NOVA_FACE"]` — todos lidos do
dono por AST (`aba08.py:2281-2286`). **Só o rodapé é digitado.**

### 1.2 A razão já está escrita neste arquivo, sobre este mesmo módulo

O bloco que carrega as constantes do mapa abre com ela:

> *"uma frase digitada aqui vira a segunda versão dela no dia em que o produto a
> corrigir, e régua nenhuma desta casa compara HTML com Python."*
> — `aba08.py:2275-2277`

E no mesmo bloco, sobre este mesmo módulo, a mesma lição — com data e com o
veredito:

> *"AS TRÊS GANHARAM NOME NO PRODUTO em 01/09/2026 e são LIDAS — eram uma
> terceira grafia … **Um portão que compara duas cópias é a confissão de que há
> duas.**"*
> — `aba08.py:2579-2582`

### 1.3 O ponteiro entre os dois arquivos já apodreceu — em um dia

`aba08.py:1530` diz que o `Gtk.Label` que exibe a frase antiga está em
`mapa_da_mesa.py:559`. **Hoje ele está em `:566`.** Sete linhas em um dia, e a
citação foi escrita em 04/09.

Isto não é preciosismo de endereço: é a medida do custo de manter em dois
arquivos uma coisa que é uma. O portão `citacoes-de-linha`
(`scripts/validar-citacoes-de-linha.py`) não alcança comentário de `.py`, então
ninguém foi avisado.

### 1.4 A constante do dono é carregada aqui e não chega mais à tela

`ESPERA_O_APLICAR` está na lista de `_constantes` (`aba08.py:2285`), que
**derruba a geração** quando um nome some do produto (`aba08.py:126-127`). Ela
continua sendo uma boa tripwire — mas hoje segura uma frase que esta tela não
imprime mais.

E há uma afirmação que caducou junto: o docstring de `aba08.py:2748-2751` diz
que a frase *"já está na tela, por extenso, três linhas abaixo
(`ESPERA_O_APLICAR`)"*. **O que está na tela três linhas abaixo é
`MAPA_JA_GRAVOU`** (`:2837`). Fato errado, e nesta casa fato errado se
substitui, não se comenta ao lado.

---

## 2. O TRABALHO, EM TRÊS PASSOS

### Passo 1 — o dono ganha a frase irmã

`app/widgets/mapa_da_mesa.py`, ao lado de `ESPERA_O_APLICAR` (`:135`), nasce a
constante da tela que grava no clique, com o texto que já está na tela dela e o
comentário que separa as duas: **quem espera o Aplicar** e **quem grava no
clique**. A decisão de 01/09 (*"clicar já aplica"*) é a que reparte as duas, e o
`_declarar` da interface nova a executa (`a08_conexoes.py:3352-3370`).

**`ESPERA_O_APLICAR` não sai, e não ganha nota de caducidade.** Ela continua
VERDADEIRA para o `Gtk.Label` de `:566`: aquela janela é uma janela que espera
o Aplicar, e o widget continua importável — a D-19 tirou o lançador, não o
módulo.

**A MORDIDA:** apague a constante nova e o gerador `aba08.py` **para com
`SystemExit`**, pela régua que já existe (`_constantes`, `aba08.py:102`, com o `SystemExit` em `:126-127`).
Nenhuma linha de teste é necessária para este passo: a mordida é a geração.

### Passo 2 — a aba lê, em vez de digitar

`aba08.py`:

* o nome novo entra no conjunto de `MAPA` (`:2283-2286`), ao lado dos outros
  treze;
* `MAPA_JA_GRAVOU` (`:1517-1536`) **deixa de ser uma constante e vira o
  comentário que explica a repartição** — a razão de haver duas frases é decisão
  medida e fica, com a data; o texto sai;
* `:2837` passa a escrever `{MAPA["<o nome novo>"]}`, como as quatro linhas
  acima dele.

**A MORDIDA:** troque a frase no dono e regere sem tocar em mais nada. O HTML
gerado tem de mudar. Se não mudar, a aba continua digitando —
`test_o_rodape_do_mapa_vem_do_dono` (novo) reprova lendo a página publicada
contra o valor lido de `mapa_da_mesa.py`.

### Passo 3 — a afirmação que caducou sai

`aba08.py:2748-2751` para de nomear `ESPERA_O_APLICAR` como o que está na tela.
E `:1530` para de citar `mapa_da_mesa.py:559`, que já não é o endereço do
`Gtk.Label`.

**A MORDIDA:** esta é de leitura, e a régua é o olho — não invente teste que
compare comentário. O que a segura é o Passo 2: com a frase vindo do dono, não
há mais o que apontar de um arquivo para o outro.

---

## 3. NADA SE PERDEU

* **As duas frases continuam existindo, e diferentes.** Não é substituição: são
  duas telas com dois comportamentos, e a decisão de 01/09 é o que as reparte.
  Unificá-las poria a mentira numa das duas — é o que a entrega de 04/09 recusou
  fazer, com razão (`aba08.py:1528-1531`).
* **A frase que ela vê não muda um caractere.** `test_o_rodape_do_mapa_diz_que_o_clique_ja_gravou`
  (`tests/unit/test_a_aba_08_conexoes_fecha_as_linhas.py:242`) e
  `test_o_rodape_do_mapa_nao_manda_apertar_o_aplicar` (`:225`) continuam verdes
  sem uma linha alterada. **Se um deles precisar mudar, você mudou o texto — e
  não era para mudar texto nenhum.**
* **A tripwire do `_constantes` continua** (`aba08.py:102-128`, e a lista do mapa em `:2281-2286`): renomear no
  produto continua derrubando a geração da tela em vez de sumir dela em
  silêncio.
* **Os quatro rótulos da janelinha continuam vindo do dono** —
  `aba08.py:2832-2835`.
* **A janela GTK continua importável.** A D-19
  (`docs/process/sprints/2026-09-05-A-JANELA-GTK-SE-APOSENTA-DEPOIS-01-o-plano-e-a-data-em-que-ele-parou.md`)
  é explícita: o lançador saiu, o motor fica. Nada aqui apaga widget.

---

## 4. POR QUE ESTA SPRINT VEM **DEPOIS** DA ONDA5-08-01

As duas reescrevem `aba08.py` e, com ele, as duas cópias de
`08-conexoes.html` — 346.900 bytes gerados por uma execução. Regiões diferentes
do `.py` fundem; o HTML gerado, não. **Uma de cada vez, nesta ordem**, porque a
01 é a que tem defeito vivo na mesa dela e esta é dívida de forma.

## A PROVA DE TELA

**O pixel não muda, e é isso que se prova.** Foto antes e depois com o mesmo
retrato do mapa aberto, e a diferença tem de ser zero. Uma sprint de dono que
mexe no que ela vê errou de passo.

`--oculta` sempre — ela tem UMA tela.
