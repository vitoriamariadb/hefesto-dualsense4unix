---
sprint: ONDA3-MOTOR-01
estado: aberta
onda: 3
posse:
  MOTOR:
    - src/hefesto_dualsense4unix/integrations/uinput_mouse.py
    - src/hefesto_dualsense4unix/core/acoes_de_botao.py
    - src/hefesto_dualsense4unix/profiles/manager.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - docs/data/paridade-gtk-html.csv
depois_de: [ONDA5-06-01]
---

> **ROTA 06/09/2026:** `estado: aberta`, ONDA B do plano das 24 horas — é o MOTOR da aba 06 (o `— Nada —` que não cala seis linhas e o `resolver()` que não herda `key_bindings`); a NAVEGACAO-TECLAS-01 (ONDA C) é a tela e espera por esta. `depois_de` passou a ser só a ONDA5-06-01 (mesmos `core/acoes_de_botao.py` e `profiles/manager.py`); os quatro ids antigos estão fechados.

# O `— Nada —` que não cala seis linhas, e o atalho que não herda

**Os dois defeitos são de MOTOR, foram medidos pela frente da aba 06 em
04/09/2026, e nenhum deles é de tela.** A frente os relatou em vez de
consertá-los porque estes arquivos estavam no `nao_toca` dela — e fez certo.

A aba 06 **já diz a verdade sobre os dois**: a tira nomeia as seis linhas que o
`— Nada —` não cala, e a linha 213 do CSV de paridade registra que só a metade
DITA fechou. **A tela está honesta e o motor está errado** — é exatamente o
estado que esta casa não deixa envelhecer.

---

## 1. O `— Nada —` não cala seis das 21 linhas

**MEDIDO:** `integrations/uinput_mouse.set_button_actions:311-316`.

Os mapas `_mapa_dpad` e `_mapa_tap` são **reconstruídos do de fábrica menos
`do_mouse`**. Um botão calado nunca entra em `do_mouse` — logo a subtração não
o alcança, e ele volta ao valor de fábrica.

As seis que escapam: **as quatro direções do d-pad, o Círculo e o Quadrado.**

Ela escolhe `— Nada —`, a tela confirma, e o botão continua fazendo o que
fazia. É perda silenciosa de escolha dela, que é a família de defeito mais cara
deste projeto.

**A CURA tem de explicar o que já funcionava:** as outras quinze linhas calam
hoje, e a cura não pode quebrá-las. Comece medindo quais caminhos as quinze
usam.

**A MORDIDA:** com a cura arrancada, uma régua que ponha `— Nada —` nas seis e
leia o mapa efetivo tem de reprovar nomeando as seis. Uma régua que só leia a
tela dá verde — a tela já está certa.

---

## 2. `resolver()` não herda `profile.key_bindings`

**MEDIDO:** `core/acoes_de_botao.resolver()` + `profiles/manager.apply_button_actions`.

A convivência entre `key_bindings` e `button_actions` está registrada na linha
213 do CSV como `DIFERENTE`, e a frente da 06 escreveu a forma da cura no
relatório `docs/process/agentes/2026-09-04/ONDA2-06.md`: **`resolver()` tem de
herdar `profile.key_bindings`.**

A frente mediu também que **a régua nova da aba 06 continua verde depois da
cura** — ou seja, a cura não desfaz o que ela entregou.

---

## O QUE FECHA ESTA SPRINT

1. As seis linhas calam de verdade, com régua que lê o MAPA EFETIVO e não a
   tela.
2. `resolver()` herda `key_bindings`, e a régua da aba 06 continua verde.
3. A linha 213 do `docs/data/paridade-gtk-html.csv` é RELATADA como fechável
   (o CSV é de outra posse), com o endereço novo lido no código.
4. Mordida colada para cada uma das duas curas.

## O RELATÓRIO FINAL

`docs/process/agentes/2026-09-04/ONDA3-MOTOR-01.md` <!-- ref-externa: esta sprint CRIA o relatório; ele nasce no fim da frente -->,
com **o que mudou** · **como provei (a mordida colada)** · **o que medi e
derrubou uma suposição** · **o que sobrou para o próximo**.
