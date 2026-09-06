---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-03
estado: absorvida
posse:
  NAV-C:
    - src/hefesto_dualsense4unix/integrations/hotkey_daemon.py
    - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
cria:
  - src/hefesto_dualsense4unix/core/gestos_do_controle.py
  - tests/unit/test_nav_gestos_reconfiguraveis.py
bancada: false
depois_de:
  - ONDA-NAVEGACAO-02
  - LEVA-2  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/profiles/schema.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA NAVEGAÇÃO · 03 — Os gestos são reconfiguráveis

## O defeito, em uma frase

Os cinco gestos que valem **sem largar o controle** são constantes de módulo com
o par de botões cravado no código: nenhum deles pode ser trocado, e um deles
(PS + R3) nunca chegou à tela.

## O que está medido

`integrations/hotkey_daemon.py`:

| gesto | constante | linha |
|---|---|---|
| Suspender mouse e teclado | `DEFAULT_COMBO_GAMEMODE = ("ps", "options")` | `:121` |
| Próximo perfil | `DEFAULT_COMBO_NEXT` | (mesmo bloco) |
| Perfil anterior | `DEFAULT_COMBO_PREV` | (mesmo bloco) |
| Sobe um degrau na roda | `DEFAULT_COMBO_PONTE = ("ps", "r3")` | `:142` |
| Toque curto no PS → abre a Steam | `ps_toque_curto_teto_ms` / `build_ps_solo_callback` | `hotkey_daemon.py:154`, `daemon/subsystems/hotkey.py:38` |

`HotkeyConfig` (`hotkey_daemon.py:145`) já carrega os quatro combos como campos —
o que falta é **o par ser escolhido** e **a ação ser escolhida**, e é isso que a
tela do mockup pede (cada linha de gesto tem um dropdown de ação:
`src/hefesto_dualsense4unix/interface/aba06.py`, `ACOES_GESTO` e `GESTOS`).

Decisão dela: **D-A-AREA-QUE-ENSINA-VAI-PARA-A-NAVEGACAO**
(`/tmp/coleta/decisoes.md:192`) — *"talvez aquela seção que fica em emulação e
serve também pra ensinar o user fosse mais jogo trazermos ela pra cá e permitir
que o user escolha o que cada conjunto faz."*

## O que entrega

1. `core/gestos_do_controle.py` — o **catálogo**: os cinco gestos com id, o par
   de botões de fábrica, o rótulo em português, se é **travado**, e a lista curta
   de ações permitidas. As oito ações são as do mockup (`aba06.py`,
   `ACOES_GESTO`): suspender mouse e teclado · próximo perfil · perfil anterior ·
   sobe um degrau na roda de pontes · abre e foca a Steam · sair do modo jogo ·
   religar o controle · — nada —.
2. `HotkeyConfig` passa a ler o catálogo em vez das constantes soltas; as
   constantes viram o **default do catálogo**, num lugar só.
3. Dois gestos nascem **travados**, e o mockup já diz o porquê na dica: *"PS + R3
   e PS + Options são fixos de propósito: são as duas saídas de emergência quando
   o jogo não responde"* (`layout/06-navegacao.html`, dica do quadro
   "Os gestos do controle"). Travado = `disabled` na tela e recusa no daemon.
4. O **buffer de 0,15 s** deixa de ser um número na tela e vira dica; o
   `Passthrough em emulação` (`gui/main.glade:3311`) **sai** — é decisão travada
   de propósito, não ajuste (D-O-PS-R3-CHEGA-A-TELA,
   `/tmp/coleta/decisoes.md:150`).

## Como se prova (o teste que morde)

`tests/unit/test_nav_gestos_reconfiguraveis.py`:

1. **O catálogo cobre os cinco** e cada um casa com a constante de hoje — mudar
   `DEFAULT_COMBO_PONTE` sem mudar o catálogo reprova.
2. **Trocar a ação do PS + ↑ muda o que dispara:** `HotkeyManager` com o catálogo
   editado chama o callback novo, não o antigo.
3. **A régua sabe recusar:** trocar a ação de um gesto travado devolve recusa
   **com motivo**, e o manager continua disparando a ação original. Régua que só
   sabe passar não é régua.
4. **O latch continua:** o teste do vazamento de combo
   (FEAT-HOTKEY-COMBO-NO-LEAK-02, `hotkey_daemon.py:172`) continua verde com o
   par reconfigurado — soltar o PS antes do segundo botão não pode virar um tap.
5. **A mordida:** arrancar a leitura do catálogo em `HotkeyConfig` e ver 2 e 3
   reprovarem; colar as duas saídas.

## O que é dela decidir

1. **Quais combos ela pode reconfigurar, e para quais ações?** (pergunta 4 do
   contrato da aba, `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`). A
   proposta desta sprint é o que o mockup desenhou: PS + R3 e PS + Options
   travados, PS + ↑ / PS + ↓ e o toque curto no PS livres, com as oito ações da
   lista. Confirmar ou trocar.
2. **O par de botões também se troca, ou só a ação?** O mockup mostra o combo à
   esquerda como **desenho fixo** e o dropdown só na ação. Trocar o par é a
   feature maior e ninguém pediu; fica de fora até ela pedir.
3. **Onde a escolha grava:** no perfil (cada jogo com os seus gestos) ou na
   configuração da máquina (os gestos são da pessoa, não do jogo)? O gesto de
   trocar de perfil dentro de um perfil é um argumento forte para o segundo.
</content>
