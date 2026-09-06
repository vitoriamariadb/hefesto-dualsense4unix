---
sprint: ONDA-JOGAR-10
estado: absorvida
posse:
  J10:
    - src/hefesto_dualsense4unix/app/actions/jogar/pausa.py
cria:
  - tests/unit/test_a_pausa_tem_saida_na_tela.py
bancada: true
depois_de:
  - ONDA-JOGAR-01
  - ONDA-JOGAR-06
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/jogar/atencao.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/utils/session.py
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 01). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA JOGAR · 10 — a pausa que só o terminal desfaz

**Onda:** JOGAR (aba 1). **Sprint de LIGAR.** `bancada: true` — provar a volta
exige daemon vivo.

## O defeito, em uma frase

O Hefesto pode ficar em pausa, a pausa **sobrevive ao boot**, e o único jeito
de sair dela é digitar um comando no terminal — porque a janela inteira não tem
um botão que chame `daemon.resume`.

## Medido, em quatro linhas

| Fato | Onde |
|---|---|
| A pausa grava um arquivo-flag no disco | `utils/session.py:164` (`save_paused_state`) |
| O daemon **nasce pausado** se o flag existe | `daemon/lifecycle.py:769-770` (`self._paused = load_paused_state()`) |
| O verbo de saída existe e está registrado | `daemon/ipc_server.py:121` (`"daemon.resume"`), handler em `daemon/ipc_handlers.py:2293` |
| Quem o chama na janela | **ninguém** — `grep 'daemon.resume' src/hefesto_dualsense4unix/app/` devolve dois comentários e zero chamadas |

O único caminho vivo é `hefesto-dualsense4unix daemon resume`
(`cli/app.py:419`). É o defeito mais caro desta casa: **a casa sabe e o produto
não faz.**

## E o texto que a tela mostra é FALSO

`home_actions.py:207`, `TEXTO_EM_PAUSA`, última frase:

> *"Para voltar, use o atalho do controle (PS + Options) ou a aba Emulação."*

**As duas saídas são falsas.** `PS + Options` é *suppress* — o modo jogo, que
não é `daemon.resume` (`emulation_actions.py:1633` diz isso em letra: *"PS +
Options) em vez de daemon.pause. daemon.pause persistia paused.flag"*). E a aba
Emulação **deixou de existir** (D-A-EMULACAO-MORRE).

Isto não é decisão medida a preservar — é uma afirmação que a medição derruba.
Sai, e sai de todos os lugares onde aparece.

## O que esta sprint entrega

1. **`pausa.py` — o aviso de pausa como item da coluna Atenção**, com **ação**.  <!-- ref-externa: nasce na ONDA-JOGAR-01, ainda não executada -->
   O texto novo diz o que está parado (nem luz, nem vibração, nem os ajustes
   dela) e oferece a saída: **Continuar**.
2. **O botão chama `daemon.resume`** — o verbo que já existe — e, no sucesso,
   a pausa **sai do disco**, para o próximo boot não renascer pausado.
3. **A frase falsa some.** `TEXTO_EM_PAUSA` perde as duas saídas que não
   funcionam. A frase nova é dela (PROVA-DE-TELA-01) — o campo já está marcado
   `PROVISÓRIO` no código.

## Como se prova — o teste que MORDE

`tests/unit/test_a_pausa_tem_saida_na_tela.py`

1. **Com `state["paused"] is True`, a aba mostra o item e o botão
   `Continuar`.** Sem pausa, nem item nem botão.
2. **Clicar chama `daemon.resume`** — com um dublê de IPC que registra o verbo.
   É a mordida contra a cura de mentira: um botão que só apaga o aviso na tela
   passa em qualquer teste visual e reprova neste.
3. **O flag do disco some depois do sucesso.** O teste escreve `paused.flag`,
   clica, e afirma que o arquivo **não existe mais**. Sem esta metade, o
   produto volta a nascer pausado no boot seguinte e o defeito continua — só
   que uma vez por dia em vez de sempre.
4. **A falha não apaga o aviso.** Com o IPC recusando, o item continua na tela
   e diz que não deu. Ausência de notícia lida como sucesso é o padrão que a
   queixa do Sackboy revelou.
5. **A frase falsa não existe.** Um `grep` de `"PS + Options"` e de
   `"aba Emulação"` dentro de `TEXTO_EM_PAUSA`, exigindo zero. Reprova quem
   consertar pela metade.
6. **Só `True` literal acende** — chave ausente ou de outro tipo não vira
   aviso, a disciplina que `texto_da_pausa` já tem (`home_actions.py:228`).

## O que é dela decidir

1. **Entra também um botão de PAUSAR?** Pergunta 6 do redesenho, e o mockup
   dela **não desenha nenhum dos dois**. A proposta é: **só o Continuar**, e
   ele aparece só quando há pausa a desfazer — quem nunca pausou nunca vê o
   botão. Pausar continua sendo gesto de terminal e de controle.
2. **A frase nova da pausa**, palavra por palavra.
3. Se o item de pausa **encabeça** a coluna Atenção sempre que existe. Com o
   produto parado, nenhum outro aviso importa mais que este.

## Fontes

- `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 1, linha do
  botão **Continuar** e a lápide do texto da pausa.
- `src/hefesto_dualsense4unix/daemon/ipc_server.py:121`,
  `daemon/ipc_handlers.py:2293`, `daemon/lifecycle.py:769`,
  `utils/session.py:164`.
