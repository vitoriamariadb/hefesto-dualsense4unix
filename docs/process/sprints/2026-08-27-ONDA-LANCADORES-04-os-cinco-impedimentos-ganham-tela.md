---
sprint: ONDA-LANCADORES-04
onda: ABA-LANCADORES
posse:
  L4:
    - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-04-os-cinco-impedimentos-ganham-tela.md
  - tests/unit/test_lancadores_ver_o_que_impede.py
bancada: false
depois_de:
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-03   # divide o mesmo lancadores_actions.py
nao_toca:
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

# ONDA LANÇADORES · 04 — "Ver o que impede": os cinco estorvos ganham tela

**O defeito, em uma frase:** desde 16/08 o produto sabe nomear **cinco**
impedimentos, com a cura ao lado de cada um, e a pessoa nunca vê qual é o dela.

É *a-casa-sabe-e-o-produto-não-faz*, na forma mais barata de curar: o texto já
está escrito.

## Onde está hoje, medido

- Os cinco estorvos e as constantes:
  `integrations/prontuario_dos_jogos.py:139-143` — `SEM_WRAPPER`,
  `LINHA_INTOCAVEL`, `SEM_EXECUTAVEL`, `EXCECAO_INERTE`, `PONTE_DIVERGENTE`.
- O texto de cada um, já em português de produto — a tabela `_ESTORVOS`
  (`:146` em diante), com a tripla **(o que é, a cura, a cura é automática?)**.
- O único consumidor em `src/`: `app/actions/daemon_actions.py:807-822`
  (`medir_prontuario_dos_jogos`), que gasta o censo inteiro para produzir **uma**
  linha do cartão "Saúde do sistema" — e só a da ponte divergente
  (`:757` em diante).

## O que entrega

O botão **"Ver o que impede"**, por linha (`layout/07-lancadores.html:491-503`,
onde o cartão do Heroic mostra a frase do `sem_wrapper` em laranja). Ao clicar:
o nome do estorvo, o que é, a cura, e **se a cura é automática** — os três campos
vêm do `_ESTORVOS`, sem reescrita.

O agrupamento por lançador é a parte nova: hoje o censo enxerga a biblioteca da
Steam. **Lançador que o produto não sabe examinar diz "não sei ainda"**, nunca
"sem impedimento". A diferença é a alma do prontuário — `NAO_SEI` existe
justamente para não pintar de verde o que não foi lido
(`prontuario_dos_jogos.py:9-27`).

## A mordida

`tests/unit/test_lancadores_ver_o_que_impede.py`:

1. Censo dublado com `sem_wrapper` **e** `linha_intocavel` no mesmo jogo → a tela
   lista **os dois**, cada um com a sua cura, e marca qual é automática.
2. Censo `NAO_SEI` → a tela diz **"não sei"**. Arranque o ramo do `NAO_SEI`
   (deixe-o cair no "sem impedimento conhecido") → o teste reprova, porque a tela
   passa a afirmar ausência de estorvo sobre um jogo que ninguém leu.
3. Lançador sem examinador (RetroArch, hoje) → **nenhum selo de impedimento**, e
   o botão "Ver o que impede" não aparece: não há o que mostrar.

## O que é dela decidir

- **Onde mora a explicação.** D-TUDO-QUE-EXPLICA-VIRA-DICA manda tudo que explica
  para o `?`; o texto de um estorvo tem ~230 caracteres e são até cinco por
  jogo — cabe numa dica de hover, ou este é o caso de diálogo?
