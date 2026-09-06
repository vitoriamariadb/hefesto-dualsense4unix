---
sprint: ONDA5-01-02
estado: feita
posse:
  01-Q1:
    - src/hefesto_dualsense4unix/app/actions/home_actions.py
    - src/hefesto_dualsense4unix/interface/frases_que_ela_baniu.py
    - tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py
    - tests/unit/test_a_frase_que_ela_baniu_nao_chega_a_tela.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/app/actions/jogar/painel.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - mockup/
depois_de: [MIGRA-JOGAR-01, MIGRA-JOGAR-11, ONDA-JOGAR-01, ONDA-SISTEMA-01, ONDA2-01-JOGAR-01]
---

# 01-Q1 · DEFEITO — a profecia que um teste prendeu na janela antiga

> **FEITA — 06/09/2026.** Os quatro passos fecharam. A frase saiu do
> `_MODE_DESCRIPTIONS["native"]` e as duas janelas passaram a dizer a mesma
> coisa (medido dirigindo o `_render_home`, não lendo a constante); a terceira
> guarda nasceu e lê o FONTE pelos dois canais — literais pelo `ast`,
> comentários pelo `tokenize` —, com as duas isenções declaradas e PROVADAS por
> mordida; a lápide foi relida com as três datas e a metade que guarda a coluna
> Atenção ficou intacta.
>
> **O PASSO 3 FOI CUMPRIDO COM OUTRO TRECHO, e a razão é medida.** A sprint
> propunha `"como no PS5"`; ele casa também com a `DICA_MIC_NO_RADIO` de
> `app/actions/config/secao_controles.py:463` — *"Traz o microfone deste
> controle pelo rádio, como no PS5"* —, que é frase medida e viva da D-12 dela.
> Com esse trecho, a guarda nova reprovaria um arquivo inocente e **o funil de
> execução recusaria a dica a caminho do WebView**: a régua contra o alarme sem
> medição viraria ela mesma um alarme sem medição. O trecho que entrou é
> `"gatilhos ficam duros"` — casa com as DUAS grafias que esta casa já teve, e
> `grep -rn` mede duas ocorrências, as duas a frase banida, contra as quatro de
> `"como no PS5"`, uma delas inocente.
>
> **E A MORDIDA DO §3 PASSO 3 SAIU MAIS FORTE DO QUE O ENUNCIADO.** Além de a
> lista velha ficar VERDE sobre a frase viva (`1 passed`, com a profecia no
> fonte), ficou medido que **o texto cru não a via**: a frase estava PARTIDA em
> duas linhas do fonte e `grep -c "duros de apertar, como no PS5"` devolve `0`
> sobre o arquivo que a contém. É por isso que a guarda lê pelo `ast`, e não
> por `grep`.
>
> A saída de cada reprovação está colada em
> `docs/process/agentes/2026-09-06/ONDA5-01-02.md`. Portões: 41 de 43 verdes —
> `referencias-docs` e `acentuacao` já vinham vermelhos da base
> (`onda/atual-0609`), medidos com `git stash` na mesma árvore, e nenhum dos
> dois toca arquivo desta posse.


> **A palavra dela, 05/09/2026:**
>
> *"Não me lembro disso acontecer. **E não deveria.** Mas caso ocorra na coluna
> atenção"*

Esta é a **terceira vez** que ela diz a mesma coisa sobre a mesma frase. A
primeira foi em 31/08/2026: *"qualquer coisa fora isso tá incorreta"*. A segunda
foi a leitura de PO de 04/09, registrada no módulo que a baniu. E a frase
continua viva — **presa no lugar por um teste desta casa**.

---

## 1. O QUE SE MEDIU — a frase mora em UM lugar, e uma régua a segura lá

```python
    "native": (
        "Só para jogos feitos para o PlayStation 5: os gatilhos ficam duros de "
        "apertar, como no PS5. Alguns jogos derrubam o controle no meio da "
        "partida neste modo — se acontecer, volte para \"Jogar pelo Hefesto\"."
    ),
```
— `src/hefesto_dualsense4unix/app/actions/home_actions.py:194-197`

**Quem lê:** só a janela GTK, em dois pontos — `home_actions.py:2616` (a
descrição do modo, quando não há pausa) e `:3029`. Nenhum caminho da interface
nova a alcança.

**Quem a SEGURA lá:**

```python
    nativo = home_actions._MODE_DESCRIPTIONS["native"]
    assert "derrubam o controle" in nativo, (
        "a frase do Modo Nativo sumiu da janela antiga — esta lápide ficou sem "
        "objeto e a decisão [01] precisa ser relida com ela")
```
— `tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py:443-446`

A régua se chama `test_o_aviso_do_nativo_continua_fora_por_decisao_dela`
(`:411`), e o docstring dela já previu este dia: *"se a frase sumir de lá, esta
lápide perde o objeto e tem de ser relida"* (`:442-443`).

**A palavra dela de hoje É essa releitura.** *"E não deveria"* — a frase sai.

---

## 2. O SEGUNDO ACHADO — a lista de banidas tem um buraco, e a frase presa passa por ele

A proibição vive num lugar só, e a comparação é por **substring literal, sem
normalizar** (`src/hefesto_dualsense4unix/interface/frases_que_ela_baniu.py:34-41`):

```python
FRASES_BANIDAS: tuple[str, ...] = (
    "derrubam o controle",
    "resultado é ZERO",
    "duros como no PS5",
)
```

**A terceira não pega a variante que está no produto.** A janela antiga escreve
*"os gatilhos ficam duros **de apertar,** como no PS5"* (`home_actions.py:195`) —
e `"duros como no PS5" in "duros de apertar, como no PS5"` é `False`.

A régua que a leva foi escrita contra o texto que o gerador tinha, não contra o
que o produto tem. **Metade da proibição é decorativa desde que nasceu.**

As duas guardas que existem hoje, e as duas apontam para a interface nova:

| guarda | onde | o que ela lê |
| --- | --- | --- |
| estática | `interface/aba01.py:1782-1783`, dentro de `_conferir` (`:1640`) | o HTML gerado da aba 01 |
| de execução | `interface/hefesto_vivo.py:3185-3193`, dentro de `_json` (`:3163`) | todo valor a caminho do WebView |

**Nenhuma das duas lê o fonte de onde a frase vem.** É a mesma forma do oitavo
conflito que o próprio módulo conta (`frases_que_ela_baniu.py:12-22`): *a régua
olhava o lugar errado*.

---

## 3. O TRABALHO

### Passo 1 — a frase sai do último lugar em que vive

Reescreva `_MODE_DESCRIPTIONS["native"]` (`home_actions.py:194-197`) **sem as
duas metades sem medição**: sai *"Alguns jogos derrubam o controle no meio da
partida neste modo"* e sai *"os gatilhos ficam duros de apertar, como no PS5"*.

O que fica é a regra que ela fixou em 31/08 e que a interface nova já escreve,
palavra por palavra: *"Modo Nativo: o Hefesto sai do meio e o jogo fala direto
com o controle."* (`interface/aba01.py:157-158`).

**Não se inventa texto novo aqui**: as duas janelas passam a dizer a mesma coisa,
que é o oposto do que existe hoje.

- **A MORDIDA:** devolva qualquer uma das duas metades.
  `test_a_frase_que_ela_baniu_nao_chega_a_tela::test_nenhuma_banida_vive_no_fonte`
  (passo 2) reprova, nomeando o arquivo e a linha.

### Passo 2 — a terceira guarda: a que lê o FONTE

As duas guardas de hoje param a frase **na saída**. Falta a que a impede de
existir: uma régua que varre `src/hefesto_dualsense4unix/app/actions/` e
`src/hefesto_dualsense4unix/interface/` procurando cada trecho de
`FRASES_BANIDAS` em literal de código.

**Ela precisa de duas isenções declaradas, e as duas com razão escrita:**

1. o próprio `frases_que_ela_baniu.py`, que é o dono da lista;
2. `interface/aba01.py:147-156`, onde as frases aparecem **dentro de um
   comentário que conta por que saíram** — a lápide que esta casa não apaga.

- **A MORDIDA:** tire a isenção do `frases_que_ela_baniu.py` e a régua reprova o
  próprio dono da lista — que é o sinal de que ela está lendo mesmo.

### Passo 3 — a variante fechada

Corrija o terceiro trecho da lista para a forma que casa com as duas escritas.
`"como no PS5"` alcança tanto *"duros como no PS5"* quanto *"duros de apertar,
como no PS5"*.

**Um trecho mais curto é mais forte, e o módulo já diz por quê**: *"são trechos
literais que já estiveram no produto, e uma reescrita que os evite por acaso já
não é a frase banida"* (`frases_que_ela_baniu.py:34-36`).

- **A MORDIDA:** volte o trecho para `"duros como no PS5"` e ponha a variante da
  janela antiga num texto de teste. A régua do passo 2 fica **verde sobre a frase
  viva** — que é exatamente o buraco que este passo fecha, e o teste tem de
  provar isso, não afirmá-lo.

### Passo 4 — a lápide relida, não apagada

`test_o_aviso_do_nativo_continua_fora_por_decisao_dela`
(`test_a_aba_01_jogar_fecha_as_linhas.py:411`) tem **duas metades**, e só uma
caduca:

- **`:443-446`** — *a frase existe na janela antiga*. **Esta cai**, e a palavra
  dela de 05/09 é a razão datada: *"E não deveria"*.
- **`:449-459`** — *a frase não entra na coluna Atenção por caminho nenhum*.
  **Esta fica, e fica mais forte**: agora o que a coluna diz sobre o mesmo
  assunto é a linha medida da ONDA5-01-01, e a profecia continua de fora.

Reescreva o docstring com as três datas — 31/08, a leitura de PO de 04/09 e a
palavra dela de 05/09 — porque **decisão medida não se apaga, ganha nota
datada**.

- **A MORDIDA:** faça a segunda metade dizer só `assert True`. Ponha *"derrubam o
  controle"* num aviso de mentira e ela tem de reprovar. Se passar, a lápide
  virou comentário.

---

## 4. O QUE ESTA SPRINT NÃO FAZ

**Não aposenta a janela GTK.** A D-19
(`docs/process/sprints/2026-09-05-A-JANELA-GTK-SE-APOSENTA-DEPOIS-01-o-plano-e-a-data-em-que-ele-parou.md`)
está **parada por decisão dela**, e continua parada. Aqui se corrige uma frase,
não se apaga uma janela — e é por isso que `app/actions/` pode ser tocado: ele é
o motor que a interface nova chama, e este passo não mexe em nenhum handler.

**Não escreve na coluna Atenção.** A metade *"mas caso ocorra"* é a ONDA5-01-01, e
este arquivo declara `a01_jogar.py` no `nao_toca` por isso.

---

## 5. NADA SE PERDEU

1. **A regra, escrita no dono:** *NENHUM ALARME SEM MEDIÇÃO*
   (`frases_que_ela_baniu.py:5-6`). As três frases continuam banidas; o que muda é
   a lista alcançar a variante e a guarda alcançar o fonte.
2. **As duas guardas de saída**, intactas — a estática (`aba01.py:1782-1783`) e a
   de execução (`hefesto_vivo.py:3185-3193`). A terceira entra ao lado, não no
   lugar delas. **Três réguas independentes é o desenho desta casa**, o mesmo dos
   dois portões de endereço de rádio.
3. **A lápide, com objeto novo.** Ela deixa de guardar a frase na janela antiga e
   passa a guardar a coluna Atenção, que é onde a decisão dela vive agora.
4. **A descrição do Modo Nativo continua existindo na janela antiga** — encolhida,
   e igual à da interface nova. Apagar a chave `"native"` faria
   `_MODE_DESCRIPTIONS.get(modo_exibido, "")` (`home_actions.py:2616`) escrever
   string vazia na tela, trocando uma frase errada por nenhuma.
5. **O comentário de `aba01.py:147-156`**, que conta por que as duas metades
   caíram em 31/08. Ele é a lápide da lápide, e é isento por escrito na régua nova.
