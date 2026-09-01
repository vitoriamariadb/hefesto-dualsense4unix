---
# onda: GATILHOS  (o portão ainda não conhece o campo `onda:` — ver o índice)
sprint: ONDA-GATILHOS-01
posse:
  G1:
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
cria:
  - tests/unit/test_gatilhos_o_desligado_solta_a_trava.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/app/actions/trigger_specs.py
---

# ONDA GATILHOS · 01 — o "Desligado" que não desliga

**O defeito em uma frase:** o mockup tira os dois botões "Desligar", e hoje só
eles soltam a trava manual — escolher o modo **Desligado** na grade a **arma**.

Palavra dela sobre o mockup:

> *"aba gatilhos perfeita. Parabéns."*
> — `layout/_ferramentas/CORRECOES-DELA.md:27-28`

E o mockup diz o que sai:

> *"**Saiu o "Desligar" de cada coluna** — Desligado é o primeiro dos 19 modos,
> ali em cima."* — `layout/_ferramentas/aba03.py:145`

## A medição

São **dois caminhos diferentes** para a mesma palavra na tela:

| Gesto de hoje | RPC que sai | Trava manual |
|---|---|---|
| Botão **Desligar** (`trigger_<side>_reset`) | `trigger.reset` | **solta** (`ipc_handlers.py:1256-1279`) |
| Modo **Desligado** na grade | `trigger.set` mode=`Off` | **arma** (`ipc_handlers.py:1240`) |

`triggers_actions.py:653-687` (`_reset_trigger`) documenta a razão do primeiro
com todas as letras — é a cura R-19:

> *"Mandava `trigger.set` com modo "Off", e `trigger.set` ARMA
> `mark_manual_trigger_active`. Ou seja: o botão que a usuária usa para "voltar
> ao normal" era mais um jeito de PAUSAR a troca automática de perfil, sem nada
> na tela dizendo isso."*

Tirar o botão **sem mover essa semântica para o modo** ressuscita exatamente o
defeito que a R-19 curou: a troca automática de perfil fica pausada, calada, e
volta a queixa histórica *"a config que eu deixo não fica"*.

E não é só a trava. O botão faz **mais três coisas** que o modo não faz
(`triggers_actions.py:665-681`):

1. `_cancelar_live_preview(side)` — mata o preview de 300 ms que o próprio
   gesto agendou e que re-armaria a trava depois do `reset` (MESA-CHEIA-08);
2. `_adiantar_live_preview(outro lado)` — faz o preview pendente do **outro**
   gatilho sair ANTES do `reset`, porque a trava é uma só para os dois lados
   (14/08, medido: `disparados: 1 trigger.set: [('right', 'Rigid', [5, 200])]`);
3. recusa quando o alvo é desconhecido, em vez de zerar o gatilho dos quatro
   controles (Z2-1).

## O que entrega

Escolher **Desligado** na grade dos 19 modos passa a percorrer o caminho do
`_reset_trigger` — as quatro coisas acima —, e não o do `_apply_trigger`.

Concretamente, em `_on_mode_changed`: quando `preset_id == "Off"` e o gesto veio
da usuária (fora de `_triggers_guard_refresh`), o lado vai para `_reset_trigger`
em vez de `_schedule_live_preview`. O `_persist_params_to_draft` continua
gravando `mode="Off"` no rascunho — o perfil tem de guardar que ela desligou.

**O que NÃO muda:** o `trigger_<side>_reset` continua existindo neste sprint. Os
botões saem da tela na 02; aqui só o **comportamento** se move, para que a 02
possa tirá-los sem perder nada. É a ordem que evita a janela em que a trava
ficava armada sem ninguém para soltá-la.

## Os arquivos que toca

- `src/hefesto_dualsense4unix/app/actions/triggers_actions.py` — `_on_mode_changed`.

## Como se prova (o teste que morde)

`tests/unit/test_gatilhos_o_desligado_solta_a_trava.py`, com o dublê de IPC que
o `tests/unit/test_triggers_actions.py` já usa:

1. **escolher "Desligado" manda `trigger.reset`, não `trigger.set`** — a
   asserção lê o nome do RPC que saiu. Arranque a cura (devolva o
   `_schedule_live_preview`) e o teste reprova dizendo `trigger.set`;
2. **o preview pendente do próprio lado morre** — agende um modo, troque para
   "Desligado" dentro dos 300 ms, e nenhum `trigger.set` daquele lado sai
   DEPOIS do `reset`;
3. **o preview pendente do OUTRO lado sai ANTES** — a sequência medida em
   14/08, reproduzida: modo no direito, "Desligado" no esquerdo, e a ordem no
   fio é `set(right)` → `reset(left)`;
4. **alvo desconhecido RECUSA** — `alvo_de_edicao` em `DESCONHECIDO` não manda
   RPC nenhum e a barra recebe o motivo. É o dublê que sabe dizer não;
5. **o rascunho guarda `mode="Off"`** — desligar e salvar o perfil grava
   desligado, não o modo anterior.

Cole as duas saídas — a da cura arrancada e a da cura devolvida.

## O que é dela decidir

Nada. Isto é a preservação de uma cura dela (R-19) sob um desenho que ela
aprovou; não há escolha nova na mesa.
