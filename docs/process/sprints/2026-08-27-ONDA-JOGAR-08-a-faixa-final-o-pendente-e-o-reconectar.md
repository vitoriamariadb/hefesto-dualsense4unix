---
sprint: ONDA-JOGAR-08
posse:
  J8:
    - src/hefesto_dualsense4unix/app/actions/jogar/faixa_final.py
cria:
  - tests/unit/test_jogar_a_faixa_final.py
bancada: false
depois_de:
  - ONDA-JOGAR-01
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/daemon/
---

# ONDA JOGAR · 08 — a faixa final: o pendente e o Reconectar

**Onda:** JOGAR (aba 1).

## O defeito, em uma frase

A prova de que o `Aplicar` ainda deve nasce lá em cima, no meio dos seletores,
e o botão que traz de volta quem caiu do co-op se chama por uma palavra de
quem programa — os dois pertencem à mesma faixa, no pé do quadro *Conectado
agora*.

## O que ela pediu, literal

> *"vai mudar para Conexão Nativa (Sony) quando você clicar em Aplicar **isso
> fica em baixo do do atenção**."*

> *"**jogga o reconectar controles pora ficar ao lado direito** vai mudar para
> Conexão Nativa (Sony) quando você clicar em Aplicar"*

E o nome, que responde a pergunta 4 do redesenho — *"'Reconciliar jogadores' é
palavra de quem programa. Qual é o nome dela?"*:

> mockup, aprovado: *"'Reconciliar jogadores' virou **'Reconectar Controles'**."*

## O que existe hoje

| Peça | Onde | O que muda |
|---|---|---|
| A linha do pendente | `home_actions.py:2143-2160` (`_home_pendente_label`), texto por `relancar.texto_do_pendente`, render por `render_pendente` (`:1718`) | **muda de lugar**; a função pura fica |
| O registro da escolha | `marcar_escolha` (`:1743`), `reconciliar_pendente` (`:1685`) | não muda |
| O botão | `home_actions.py:2246` + `RECONCILIAR_LABEL = "Reconciliar jogadores"` (`:671`) | **muda de nome e de lugar** |
| A ressalva com jogo aberto | `_reconciliar_gate_text` (`:707`), `RECONCILIAR_JOGO_ABERTO_TEXT` (`:684`) | **vira dica do `?`** do quadro |
| O toast do resultado | `reconciliar_toast` (`:821`) | não muda |

## O que esta sprint entrega

1. **A faixa final do quadro *Conectado agora***: pendente à esquerda, botão à
   direita, na mesma linha.
2. **`Reconectar Controles`** como o rótulo — em um lugar só. O nome antigo sai
   de `RECONCILIAR_LABEL` inteiro; deixar os dois vivos é como esta casa ganhou
   os pares.
3. **Espaço reservado para a linha do pendente** (P8): sem escolha pendente ela
   fica invisível e a altura da faixa **não muda**. Hoje ela usa
   `set_no_show_all` + `set_visible` — que esconde, e esconder empurra.
4. **A ressalva do jogo aberto vira dica**, e **o botão continua de pé**. A
   nota datada de `home_actions.py:673` é explícita: desabilitar esconderia o
   gesto exatamente quando ela mais precisa — o P2 cai DURANTE a partida.

## Como se prova — o teste que MORDE

`tests/unit/test_jogar_a_faixa_final.py`

1. **Marcar uma máscara faz a linha aparecer com o nome do destino**, e o texto
   é o de `relancar.texto_do_pendente(...)` chamado diretamente — não uma
   segunda redação.
2. **A altura da faixa é a MESMA com e sem pendente.** É a mordida do espaço
   reservado: troque por `set_visible(False)` puro e os dois números divergem.
3. **Escolher de volta o que já está valendo APAGA a pendência.** O
   `reconciliar_pendente` (`:1685`) já cancela escolha igual ao vigente; sem um
   caso aqui, ninguém exercita isso pela tela, e a linha ficaria mentindo que
   há algo a aplicar.
4. **O nome antigo não existe em lugar nenhum.** Um `grep` de
   `"Reconciliar jogadores"` sobre `src/` dentro do teste, exigindo zero.
   Reprova quem deixar os dois nomes vivos.
5. **Com jogo aberto: o botão continua sensível**, e a ressalva está no `?`.
   Desabilite o botão e reprova — é a trava da nota datada.

## O que é dela decidir

1. O selo `●` e a cor laranja tracejada da linha (legenda do mockup, dele para
   ela: *"A linha laranja tracejada é a prova de que o Aplicar ainda deve"*).
2. Se a faixa também mostra a **escolha de máscara recusada**
   (`_home_flavor_pedido`, `home_actions.py:2137`) — o redesenho diz que a
   recusa *"não some calada em 2 s"*, e esta faixa é onde ela caberia. Ou ela é
   um aviso da coluna Atenção (ONDA-JOGAR-06)? **Um lugar só.**

## Fontes

- `layout/01-jogar.html`, `.faixa-final`.
- `/tmp/coleta/hoje.md`, falas [31] e [33].
- `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 1 e padrão P8.
