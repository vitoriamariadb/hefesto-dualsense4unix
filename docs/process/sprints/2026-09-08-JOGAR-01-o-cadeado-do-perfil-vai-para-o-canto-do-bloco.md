---
sprint: JOGAR-01
estado: aberta
posse:
  JOGAR-01:
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
bancada: false
depois_de: []
---

# JOGAR-01 — o "Não trocar de perfil sozinho" vai para o canto do bloco

**Pedido por ELA em 08/09/2026, olhando a aba Jogar.** Palavras dela: *"esse não
trocar de perfil. Pode colocar ele no canto superior direito do bloco tipo esse
banco de provas na guia navegação."*

## §1 — Onde está e para onde vai

HOJE: `a01_jogar.py:392`, `CADEADO_ROTULO = "Não trocar de perfil sozinho ao
abrir um jogo"` — uma caixa de marcar solta LOGO ABAIXO da fileira de modos
(Sony DualSense · Xbox · Steam Input · Navegação), dentro do bloco **Modo**.

O PROBLEMA que ela viu: ali a caixa parece um QUINTO modo. Ela está na coluna
dos modos, no fluxo de leitura dos modos, e não é modo nenhum — é uma trava
sobre o perfil.

O MODELO QUE ELA APONTOU está em `aba06.py:2664`, o *"Banco de provas: o mapa do
controle ↗"* no canto superior direito do bloco Navegação: **a coisa que
pertence ao bloco mas não é o miolo dele mora no canto, na linha do título.**

## §2 — O QUE ESTA SPRINT ENTREGA

1. O cadeado sai do fluxo e vai para o canto superior direito do bloco Modo, na
   linha do título, com a mesma gramática do link da Navegação.
2. **O GESTO NÃO MUDA.** É mudança de POSIÇÃO. O `data-gesto`, o que ele grava e
   a resposta continuam os mesmos — e a régua tem de provar isso, senão a
   mudança de lugar vira mudança de comportamento sem ninguém notar.
3. Uma caixa de marcar na linha do título é alinhamento vertical novo; confira
   na foto, com a fileira de modos em duas larguras de janela.

## §3 — O QUE NÃO SE PERDE, e há uma armadilha datada aqui

`interface/fim.html:65` e `aba01.py:1811` trazem, na legenda, a frase *"A caixa
'Não trocar de perfil sozinho' SAIU — o perfil ativo já diz isso."*

**Essa frase descreve uma remoção que foi DESFEITA** — a caixa está viva em
`a01_jogar.py:392` e ela acabou de fotografá-la. Ou a legenda está velha, ou a
caixa voltou sem a legenda ser corrigida. **Meça QUAL antes de mexer:** mover uma
caixa que um documento da casa diz não existir é como se recria um defeito já
pago.

## §4 — A MORDIDA

Mova o cadeado de volta para o fluxo e a régua de POSIÇÃO tem de REPROVAR,
medindo a geometria na página publicada — não a ordem no fonte do gerador.
