---
sprint: MIGRA-GATILHOS-08
onda: MIGRA-GATILHOS
posse:
  M8:
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
cria:
  - tests/unit/test_migra_gatilhos_a_trava_manual_vezes_oito.py
bancada: false
depois_de:
  - MIGRA-GATILHOS-03
  - MIGRA-GATILHOS-04
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/app/actions/triggers_actions.py
  # com as de baixo.
  - MIGRA-GATILHOS-05
  # SUBSTITUÍDAS por esta onda (ver o índice, "As sete sprints ONDA-GATILHOS").
  # Ficam aqui porque enquanto elas estiverem no disco a posse é real, e
  # silêncio não é declaração.
  - ONDA-GATILHOS-01
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - novo-layout/
---

# MIGRA GATILHOS · 08 — a trava manual vezes oito

**O defeito em uma frase:** a trava manual **não tem lado e não tem controle** —
é uma categoria só para a mesa inteira —, e o debounce do toque ao vivo é
indexado **só pelo lado**. Com quatro colunas × dois lados são **oito** previews
concorrendo por dois relógios e uma trava. É a `MESA-CHEIA-08` multiplicada por
quatro, e a cura de hoje não a alcança.

## A medição

**A trava é uma só, e é da mesa.** `state_store.mark_manual_trigger_active("trigger")`
(`daemon/state_store.py:316-329`) arma **uma categoria** para tudo. `trigger.set`
a arma (`daemon/ipc_handlers.py:1240`) e `trigger.reset` a solta (`:1298`).
Enquanto ela estiver armada, o `AutoSwitcher` **não reaplica o perfil ativo** —
a troca automática fica pausada, e nada na tela diz isso. É a queixa histórica
*"a config que eu deixo não fica"*, que a R-19 curou uma vez.

**O relógio é indexado só pelo lado.** `self._trigger_live_preview_timer` é
`{"left": 0, "right": 0}` (`triggers_actions.py:106`, `:105`), e
`_schedule_live_preview(side)` grava em `timers[side]` (`:326-332`). Com quatro
colunas, **`timers["left"]` é UM relógio para os quatro L2 da tela**: mexer no
modo do L2 do P3 **cancela em silêncio** o preview pendente do L2 do P1 — o P1
nunca sente o efeito que ela acabou de escolher, e nada avisa.

**As duas curas existentes só conhecem "o outro lado do mesmo controle".**
`_cancelar_live_preview` (`:253-280`) mata o pendente do próprio lado;
`_adiantar_live_preview` (`:282-320`) faz o pendente do **outro lado** sair
ANTES do `reset`, e o docstring diz por quê, com a medição de 14/08 colada:

> *"a trava manual **não tem lado** — `mark_manual_trigger_active` recebe uma
> categoria só (`"trigger"`) para os dois gatilhos. (…) Medido nesta árvore:
> `disparados: 1 trigger.set: [('right', 'Rigid', [5, 200])]`"*

Com **oito** slots, o preview pendente de **qualquer um dos outros sete** pode
cair depois de um `reset` e **re-armar a trava que o gesto acabou de soltar**.
O código de hoje adianta **um**.

## O que entrega

1. **O relógio passa a ser por `(uniq, lado)`.** `_trigger_live_preview_timer`
   deixa de ser `{lado: handle}` e vira `{(uniq, lado): handle}`, criado e
   destruído com as colunas. Nenhuma coluna cancela o preview de outra.
2. **`_adiantar_live_preview` passa a adiantar OS OUTROS SETE**, e não um. A
   razão do docstring não muda — *adiantar, e não cancelar*, porque cancelar
   mataria um preview que ela pediu. O que muda é o alcance: a trava é da mesa,
   logo o que a re-arma é **qualquer** `trigger.set` pendente.
3. **"Desligado" solta a trava — e a solta pelo caminho certo.** Este é o
   diagnóstico da `ONDA-GATILHOS-01` de 27/08, e ele **sobrevive inteiro à
   mudança de motor**: o desenho tira os dois botões "Desligar", e hoje **só
   eles** soltam a trava.

   | gesto | RPC | trava |
   |---|---|---|
   | botão **Desligar** (`trigger_<side>_reset`) | `trigger.reset` | **solta** (`ipc_handlers.py:1298`) |
   | modo **Desligado** na lista | `trigger.set` mode=`Off` | **arma** (`ipc_handlers.py:1240`) |

   Escolher *Desligado* passa a percorrer `_reset_trigger` — que faz mais três
   coisas que o modo não faz: cancela o preview do próprio slot, adianta os
   outros, e **recusa** quando o alvo é desconhecido em vez de zerar o gatilho
   de todo mundo (Z2-1). O `_persist_params_to_draft` continua gravando
   `mode="Off"` no rascunho: o perfil tem de guardar que ela desligou.

   **A citação da ONDA-GATILHOS-01 estava caduca e foi reconferida.** Aquela
   sprint cita `aba03.py:145` para a frase *"Saiu o 'Desligar' de cada coluna"*;
   a linha 145 de hoje é a descrição do modo *Resistência*, e a frase **não
   existe mais em lugar nenhum do gerador** — o gerador virou quatro colunas em
   28/08. O que sustenta a entrega agora é o próprio HTML: **zero `<button>` de
   desligar no miolo**, e os únicos quatro botões são *"Guardar esse efeito"*.

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_a_trava_manual_vezes_oito.py`, com o dublê de
IPC de `tests/unit/test_triggers_actions.py` e o relógio falso do GLib que a
`MESA-CHEIA-08` já usa:

1. **A cena de 14/08, agora com quatro colunas.** Mexer no modo do R2 do **P4**
   e, dentro dos 300 ms, escolher *Desligado* no L2 do **P1**: a ordem no fio é
   `set(P4,right)` → `reset(P1,left)`, e a trava fica **solta** no fim.
   **A mordida:** devolva o `_adiantar_live_preview` de um lado só e o teste
   reprova mostrando o `set` caindo **depois** do `reset`.
2. **Uma coluna não cancela a outra.** Agendar preview no L2 do P1, e 100 ms
   depois mexer no L2 do P3: **os dois** `trigger.set` saem, cada um com o seu
   `uniq`. Volte o dicionário para `{lado: handle}` e o teste reprova com um
   pedido só. **Este defeito existe hoje e nenhuma régua o vê.**
3. **"Desligado" manda `trigger.reset`, não `trigger.set`** — a asserção lê o
   nome do RPC. Arranque a cura (devolva o `_schedule_live_preview`) e o teste
   reprova dizendo `trigger.set`.
4. **Alvo desconhecido RECUSA** — sem coluna nenhuma na mesa, nenhum RPC sai e a
   barra recebe o motivo. O dublê tem de saber dizer não.
5. **O rascunho guarda `mode="Off"`** — desligar e salvar o perfil grava
   desligado, não o modo anterior.
6. **A trava fica solta no fim de TODA sequência que termina em "Desligado"** —
   varra as oito combinações de (coluna que mexe) × (coluna que desliga) e
   confirme. Esta é a régua que a `MESA-CHEIA-08` não tinha porque só havia dois
   slots.

Cole as duas saídas — a da cura arrancada e a da cura devolvida.

## O que é dela decidir

**O toque ao vivo de 300 ms fica?** É a pergunta 1 do contrato
(`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:299`) e ela mudou de tamanho
com o desenho novo:

- **hoje**: ler um modo custa **senti-lo na mão**, e a mão é a dela;
- **com quatro colunas**: são oito caixas escorregando ao mesmo tempo, e quem
  sente é **quem estiver com aquele controle** — não necessariamente ela. Numa
  mesa de quatro pessoas jogando, mexer na coluna do P3 é mexer na mão de outra
  pessoa.

As três saídas: **fica como está**; **some, e o efeito só sai no "Aplicar"**;
ou **vira um botão por coluna** (*"experimentar neste controle"*), que é o
único jeito de a intenção ficar explícita. Escrito como
**PROVISÓRIO — decisão dela**; a mecânica desta sprint funciona nas três.

## O que esta sprint NÃO conserta

**A trava continua sendo uma só para a mesa inteira.** Dar lado e controle a
`mark_manual_trigger_active` é mudança de **daemon** (`state_store.py` +
`ipc_handlers.py`), e este arquivo os declara em `nao_toca`. Enquanto ela for
uma só, um `trigger.set` em qualquer coluna pausa a troca automática de perfil
para **todos** — o que é o comportamento de hoje, e não uma regressão desta
onda. Fica declarado, não escondido.
