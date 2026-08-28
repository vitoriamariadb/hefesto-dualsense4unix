---
sprint: ONDA-ILUMINACAO-07
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM07:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - src/hefesto_dualsense4unix/core/cores_distintas.py
  - tests/unit/test_ilum_07_duas_pecas_nunca_tem_a_mesma_cor.py
bancada: false
depois_de:
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/core/led_control.py
---

# ONDA ILUMINAÇÃO · 07 — Duas peças nunca têm a mesma cor

**O defeito, em uma frase:** ela pode pintar os dois controles da mesma cor, e
aí **ninguém sabe de quem é qual** — que é exatamente o que a barra de luz
existe para responder.

## Onde está hoje, medido

- **não existe nada.** `grep -rn 'mesma cor'` em `src/` devolve só comentários
  sobre a paleta automática — nenhuma verificação de colisão em nenhum caminho
  de escrita de cor;
- a paleta canônica, que é a matéria-prima da cura: `_PLAYER_SLOT_COLORS`
  (`core/led_control.py:146-155`), oito cores, uma por número, escolhidas por
  **máxima distinguibilidade lado a lado** (o comentário em `:134-145` conta
  inclusive por que o rosa em vez do magenta);
- o motivo escrito, dela: *"as bordas de ambos os controles devem aparecer
  marcados na tela como se fossem personagem de jogo. to com o controle red e o
  irmão com o blue"* (**D-CADA-JOGADOR-NAVEGA-COM-O-SEU**).

## O que entrega

1. **Um módulo puro**, `core/cores_distintas.py`, sem GTK e sem IPC:
   `desloca_se_repetida(cor, ja_usadas) -> (cor_final, deslocou)`. Puro porque é
   régua de produto — vale em qualquer perfil, não só nos Estilos de Jogo
   (**D-DUAS-PECAS-NUNCA-TEM-A-MESMA-COR**).
2. **A aba consulta antes de mandar**: no caminho da cor (guia, livre e o
   "Reenviar"), o produto olha as cores em vigor nos **outros controles
   conectados** (`_uniqs_conectados`, `lightbar_actions.py:378`, e o
   `daemon.state_full` que a aba já lê em `:682-717`).
3. **A tela diz o que fez, e não no rodapé**: *"O Controle 2 já estava neste
   vermelho — pintei o vizinho dele"* fica **na seção**, visível, do jeito que o
   contrato exige (*"não é um aviso que some no rodapé"*).
4. **A borda do desenho acompanha na hora** — o widget da ILUM-02 repinta com a
   cor que de fato foi.

## A mordida

`tests/unit/test_ilum_07_duas_pecas_nunca_tem_a_mesma_cor.py` — a maior parte
sobre a função pura, que é onde a regra mora:

- **cor livre**: `(0,0,255)` com `ja_usadas=set()` devolve `(0,0,255), False`;
- **cor repetida**: `(0,0,255)` com o azul já em uso devolve **outra** cor e
  `True`;
- **cor repetida com a vizinha também ocupada**: pula para a seguinte — nunca
  devolve uma que já está em uso, e **termina** (com as oito ocupadas, devolve o
  quê? ver "o que é dela decidir");
- **igualdade não é por hexa exato**: `(0,0,255)` e `(0,0,250)` são a mesma cor
  aos olhos de qualquer pessoa a um metro da TV. A régua compara com uma
  tolerância declarada, e o teste fixa o número;
- **na aba**: com dois controles conectados e o segundo recebendo a cor do
  primeiro, o IPC sai com a cor **deslocada** e a linha da seção não fica vazia.

Arranque a consulta na aba e o último caso reprova com as duas cores iguais no
`led.set`.

## O que é dela decidir

1. **O que é "o tom vizinho"?** A decisão diz que *"o segundo desloca para o tom
   vizinho"* e não diz qual. A proposta desta sprint, marcada como
   `PROVISÓRIO — decisão dela`: **a próxima cor de `_PLAYER_SLOT_COLORS`**, na
   ordem da tabela, porque é a paleta que já foi escolhida por
   distinguibilidade e é a mesma que o "Voltar ao automático" devolve.
2. **Ela pode recusar o deslocamento e ficar com as duas iguais?** O contrato
   pergunta e não responde. Se sim, a linha da seção precisa de um "deixa
   igual"; se não, o produto decide sozinho e só avisa.
3. **Com as oito ocupadas** (mesa de oito controles), o que acontece?

## Fontes

- decisões: **D-DUAS-PECAS-NUNCA-TEM-A-MESMA-COR**, **D-CADA-JOGADOR-NAVEGA-COM-O-SEU**;
- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4, "O que
  muda" e "O que ainda falta decidir", item 4.
