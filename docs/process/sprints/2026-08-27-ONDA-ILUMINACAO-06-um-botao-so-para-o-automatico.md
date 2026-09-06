---
sprint: ONDA-ILUMINACAO-06
estado: absorvida
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM06:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_ilum_06_um_botao_so_para_o_automatico.py
bancada: false
depois_de:
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 04). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA ILUMINAÇÃO · 06 — Um botão só para o automático, e os nomes que não competem

**O defeito, em uma frase:** são **dois** botões de "voltar ao automático", e o
segundo **ignora a fita calado** — ela escolhe um controle no topo e ele mexe na
mesa inteira.

## Onde está hoje, medido

- `on_lightbar_auto_reset_target` (`lightbar_actions.py:1141`) — limpa a cor do
  **alvo**; com a fita em "Todos" ele **recusa** e manda usar o outro botão;
- `on_lightbar_auto_reset_all` (`:1175`) — limpa **todos** os overrides e religa
  `auto_player_colors`, **sem olhar a fita uma única vez**;
- os dois no glade: `lightbar_auto_reset_target` (`:1341`) e
  `lightbar_auto_reset_all` (`:1353`);
- o "Aplicar no controle": `lightbar_apply` (`:1300`), `on_lightbar_apply`
  (`lightbar_actions.py:870`) — **um dos quatro "Aplicar" da janela**;
- o "Apagar": `lightbar_off` (`:1313`), `on_lightbar_off`
  (`lightbar_actions.py:1023`).

## O que entrega

1. **"Voltar ao automático" vira um botão só**, e **obedece a fita**
   (**D-A-FITA-E-O-UNICO-ALVO**): com um controle escolhido, volta aquele; com a
   fita em "Todos", volta a mesa inteira e religa as cores automáticas. O
   `on_lightbar_auto_reset_all` deixa de existir como botão e vira o ramo
   "Todos" do que sobrou. **Nada se perde** — o comportamento dos dois continua
   alcançável, agora pelo alvo.
2. **"Aplicar no controle" vira "Reenviar ao controle"** — manda de novo cor e
   brilho, para depois de reconectar. O nome existe para não competir com o
   `[Aplicar]` do rodapé. *Onde ele mora na tela é pergunta aberta da ILUM-04.*
3. **"Apagar" vira "Desligar"** (mockup: `layout/04-iluminacao.html:700`).
4. **O recado D4 vira linha na própria seção**, não toast que some: aplicar em
   "Todos" desligava as cores automáticas **em silêncio**
   (`_d4_disable_auto_for_single_color`, `lightbar_actions.py:1273`). É
   consequência de um clique dela, e o contrato manda mostrá-la ali.

## A mordida

`tests/unit/test_ilum_06_um_botao_so_para_o_automatico.py`:

- **a fita manda**: com alvo `uniq="AA:BB:CC:00:00:11"`, o clique limpa **só**
  aquele override e não toca no do vizinho; com a fita em "Todos", limpa os dois
  **e** religa `auto_player_colors`. Um teste por ramo, e o segundo é o que hoje
  não existe;
- **a recusa some**: o texto *"use o botão Voltar todos ao automático"*
  (`lightbar_actions.py:1155-1158`) não pode sobreviver em lugar nenhum — a régua
  procura a frase no `src/` inteiro. Botão que não existe não se cita;
- **a linha do D4**: com a fita em "Todos" e o automático ligado, aplicar uma cor
  única escreve a linha na seção; sem o D4 disparar, a linha fica **vazia** —
  aviso sem conteúdo é ruído;
- **o dublê recusa**: rascunho ausente (`draft is None`) não estoura e não grava.

Arranque o ramo "Todos" e o segundo caso reprova com o override do vizinho
intacto.

## O que é dela decidir

1. **O "Desligar" guarda a cor ou grava preto?** A dica de hoje promete *"a cor
   continua guardada"* e o código grava preto no perfil
   (`lightbar_actions.py:1023-1046`: `self._current_rgb = (0, 0, 0)` seguido de
   `_persist_leds_update({"lightbar_rgb": (0,0,0)})`). **São duas promessas
   vivas, e uma está errada** — mas qual é a certa é decisão de produto, não de
   código. Ela reaparece no mockup, na lista "Ainda aberto"
   (`layout/04-iluminacao.html:767`).
2. **A caixa "Cores automáticas por controle" fica na aba?** O contrato diz que
   fica (`auto_player_colors_check`, `gui/main.glade:1201`); o mockup aprovado
   não a desenha. Ver a pergunta 1 da ILUM-04 — é a mesma.

## Fontes

- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4, tabela
  de botões e "Nada se perdeu";
- decisão: **D-A-FITA-E-O-UNICO-ALVO**.
