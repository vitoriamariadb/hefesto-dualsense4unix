---
# onda: GATILHOS
sprint: ONDA-GATILHOS-06
posse:
  G6:
    - src/hefesto_dualsense4unix/app/actions/trigger_specs.py
    - tests/unit/test_gatilho_palavra_rotulos.py
cria: []
bancada: false
depois_de:
  - ONDA-GATILHOS-02
  - GATILHO-NAO-PERDIDO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/core/trigger_effects.py
  - src/hefesto_dualsense4unix/profiles/
---

# ONDA GATILHOS · 06 — os dois nomes em inglês

**O defeito em uma frase:** o mockup que ela aprovou escreve **"Arco de flecha"**
e **"Disparo"**, e o produto escreve **"Arco de flecha (Bow)"** e **"Disparo
(Weapon)"** — porque o termo em inglês é uma **decisão dela de 07/08**.

**Esta sprint não executa nada sem a palavra dela.** É uma pergunta com o preço
na mesa, escrita como sprint para que a resposta caia num lugar e não no
transcrito.

## Os dois lados, com a fonte

**O produto de hoje** — `app/actions/trigger_specs.py:135,200`:

```
"Bow",    "Arco de flecha (Bow)"
"Weapon", "Disparo (Weapon)"
```

E a razão, em `tests/unit/test_gatilho_palavra_rotulos.py:115-124`:

> *"NOTA DATADA — 07/08/2026: deixou de ser pendência e virou DECISÃO DELA
> (resposta 6 do painel): "Arco de flecha (Bow)" e "Disparo (Weapon)". O termo
> em inglês FICA nos dois, de propósito, **para ela reconhecer o modo num guia
> de jogo em inglês**."*

Antes disso era pendência de vocabulário: *"Arco"* é ambíguo em português (arco
de círculo, arco elétrico) e *"Arma"* não separava de *"Arma automática"* nem de
*"Arma semi-automática"* (`:117-119`).

**O mockup aprovado** — `src/hefesto_dualsense4unix/interface/aba03.py:47,60`, e o contrato
que copia a lista dos 19 (`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:264`)
— escreve os dois **sem** o termo em inglês. E a palavra dela sobre a aba:

> *"aba gatilhos perfeita. Parabéns."*
> — `src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md:27-28`

## Por que isto não se resolve sozinho

Regra desta casa: *"Não se apaga decisão medida"* — e a outra metade,
`o-projeto-e-vivo-precedente-nao-e-trava`: *"precedente é custo medido, não
veto"*. As duas juntas dizem exatamente o que fazer aqui: **não escolher em
silêncio**, pôr o preço na mesa e deixar a escolha com ela.

O preço, medido: o rótulo é só rótulo. O `name` (`"Bow"`, `"Weapon"`) é o que o
perfil grava, e `test_os_dezenove_names_sao_exatamente_os_de_hoje` já garante
que ele **não** muda — *"renomear um `name` faz o perfil dela parar de abrir"*.
Trocar o rótulo custa uma linha e **nenhum perfil**.

## O que entrega, SE ela disser que o mockup vence

- `trigger_specs.py:135,200` — os rótulos passam a "Arco de flecha" e "Disparo";
- `tests/unit/test_gatilho_palavra_rotulos.py` — `PENDENCIA_DE_PALAVRA` e
  `TERMOS_DO_DSX` deixam de conter "Bow" e "Weapon", e a nota datada de 07/08
  **fica**, com a nota nova por baixo dizendo o que a substituiu e quando. É
  decisão medida: leva data, não sai.

**SE ela disser que a decisão de 07/08 vale:** o mockup é que é corrigido — e aí
esta sprint não toca em `src/`, só registra a resposta e a onda fecha com os
dois nomes em inglês.

## Como se prova (o teste que morde)

O portão já existe e já morde — `tests/unit/test_gatilho_palavra_rotulos.py`
compara os 19 rótulos contra a lista contratada. Qualquer caminho que esta
sprint tome, ele reprova se a lista de rótulos e a lista do teste divergirem.

O que se acrescenta é uma asserção só: **os `name` dos 19 não mudam**, aconteça
o que acontecer com os rótulos. Arranque-a e renomeie um `name` — o perfil dela
para de abrir, que é o dano que ela cobre.

## O que é dela decidir

**Tudo.** A pergunta, em uma linha:

> *"Arco de flecha (Bow)" e "Disparo (Weapon)" — o mockup tirou o inglês. Em
> 07/08 você pediu para ficar, para reconhecer o modo num guia de jogo em
> inglês. Vale ainda?"*
