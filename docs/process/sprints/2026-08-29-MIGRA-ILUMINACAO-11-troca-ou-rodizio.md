---
sprint: MIGRA-ILUMINACAO-11
onda: MIGRA-ILUMINACAO
posse:
  IL11:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md
    - layout/_ferramentas/aba04.py
    - scripts/telas/aba04.py   # o mesmo arquivo depois da MIGRA-CONTROLES-02
cria:
  - tests/unit/test_migra_iluminacao_11_troca_ou_rodizio.py
bancada: false
depois_de:
  - LEVA-DE-BACKGROUND-01
  - MIGRA-JOGAR-10
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-JOGAR-05
  - ONDA-LANCADORES-06
  - ONDA-PERFIS-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  - MIGRA-ILUMINACAO-01
  - MIGRA-ILUMINACAO-03
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
---

# MIGRA ILUMINAÇÃO · 11 — Troca ou rodízio: a tela promete uma e o daemon faz a outra

**Isto não está em nenhuma lista aberta desta casa, e foi achado pelo censo desta
onda.** É a única sprint da onda que **não** toca a tela.

## O defeito

### O produto faz RODÍZIO

`_set_number_locked`, em `src/hefesto_dualsense4unix/daemon/ipc_handlers.py:1812-1814`:

```python
movido = nova_ordem.pop(indice_atual)
nova_ordem.insert(numero - 1, movido)
```

Pop-and-insert **empurra todo mundo** entre a origem e o destino.

### A tela promete TROCA

Com todas as letras, em **dois lugares** do mockup aprovado:

- os **16 tooltips** de botão de número (`aba04.py:291-292`): *"Os dois trocam de
  lugar — ninguém repete número e ninguém fica sem."*
- a legenda (`aba04.py:445`): *"**Os dois trocam, os outros não se mexem.**"*

E o contrato ainda diz uma **terceira** coisa, que é o rodízio:
*"Os outros deslizam para abrir lugar"*
(`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:341`).

### Por que ninguém viu

**O exemplo desenhado no mockup é uma troca de VIZINHOS** (P2 → P1), e nela
rodízio e troca **dão o mesmo resultado**.

Com quatro na mesa, dar o **1** ao White:

| | P1 | P2 | P3 | P4 | quantos mudaram |
|---|---|---|---|---|---|
| antes | Cosmic | Blue | Purple | White | — |
| **rodízio** (hoje) | White | Cosmic | Blue | Purple | **três** |
| **troca** (a tela) | White | Blue | Purple | Cosmic | **um** |

**A palavra dela de 28/08 é "troca"** (`aba04.py:23-26`: *"Trocar é TROCA, não
fila: pôr o azul no 1 faz quem era 1 virar 2. Ninguém repete número, ninguém fica
sem."*).

**Se ela mantiver, a mudança é no DAEMON, não na tela.**

## O que entrega

1. **`_set_number_locked` faz a permutação de dois:** o alvo vai para `numero`, e
   quem tinha `numero` vai para onde o alvo estava. **O resto não se mexe.**
2. **O portão de mesa continua.** `numero > len(presentes)` →
   `_NumeroForaDaMesaError` (`ipc_handlers.py:1808`) fica: **troca só existe
   entre dois que existem.** Um número livre não tem com quem trocar, e dá-lo
   deixaria um controle sem número — que é o que ela proibiu.
3. **O contrato é corrigido.** `2026-08-26-O-REDESENHO-as-dez-abas.md:341` diz
   hoje o contrário do mockup. **Fato errado se substitui, e sai de TODOS os
   lugares onde aparece** — não só de onde foi notado.
4. **Um portão da promessa:** o que a tela diz e o que o daemon faz têm de casar.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_11_troca_ou_rodizio.py`:

- **o caso que SEPARA as duas.** Quatro controles; dar o 1 ao quarto. **Com a
  cura, exatamente dois controles mudam de número. Devolva o `pop` + `insert` e
  três mudam** — o teste reprova. Devolva a cura.
- **o caso que NÃO separa, e ele entra de propósito.** Vizinhos (P2 → P1): as
  duas implementações dão o mesmo resultado. **Uma régua que só medisse este
  caso ficaria verde com o defeito vivo — e é exatamente por isso que ninguém
  viu em três dias de mockup.** O teste declara isso no docstring.
- **ninguém repete e ninguém fica sem.** Cem trocas pseudoaleatórias numa mesa
  de cinco: o conjunto de números é sempre `{1,2,3,4,5}`, em toda iteração.
- **fora da mesa continua recusando.** Numa mesa de dois, pedir o 3 devolve
  `numero_fora_da_mesa`. Arranque o portão e veja passar.
- **o portão da promessa morde.** Ele compara o texto da tela (os tooltips e a
  legenda do gerador) com o comportamento do daemon. **Troque um dos dois e ele
  reprova.** Uma régua que só olhasse o daemon deixaria a tela mentir; uma que
  só olhasse a tela deixaria o daemon divergir.
- **a suíte não roda solta.** Esta sprint toca o daemon e o registro de
  identidade; a suíte roda **no fim, em oito lotes, com a máquina livre**, e é de
  quem coordena.

## O que é dela decidir, e trava a sprint inteira

**Troca ou rodízio?**

As duas são defensáveis. **O que não é defensável é a tela prometer uma e o
produto fazer a outra.**

- **Se ela escolher TROCA** (a palavra dela de 28/08): a mudança é no daemon, o
  mockup já está certo, e o contrato é que muda.
- **Se ela escolher RODÍZIO**: a mudança é nos **16 tooltips e na legenda**, o
  contrato já está certo, e o daemon não se toca.

**O caso concreto para ela decidir vendo, não lendo** (é como ela decide): na
mesa dela, dar o 1 ao último controle. Rodízio renumera todo mundo; troca mexe
em dois.

## O que esta sprint TRAVA

A `MIGRA-ILUMINACAO-07` liga o gesto de número ao `uniq` da coluna e **nada
mais** — ela não toca o daemon. **Enquanto esta sprint não fechar, a coluna
promete o que o produto não faz.**
