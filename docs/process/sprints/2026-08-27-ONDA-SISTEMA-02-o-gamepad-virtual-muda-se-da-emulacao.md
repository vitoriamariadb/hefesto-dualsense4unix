---
sprint: ONDA-SISTEMA-02
estado: absorvida
# onda: SISTEMA
posse:
  S2:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
    - src/hefesto_dualsense4unix/app/app.py
cria:
  - tests/unit/test_onda_sistema_02_o_gamepad_virtual.py
bancada: false
depois_de:
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/app.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-06
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/storm_doctor.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 09). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA SISTEMA · 02 — O gamepad virtual muda-se da Emulação

**O defeito:** o diagnóstico da máquina — uinput, aparelho, código do
fabricante, controles detectados e o autoteste — mora numa aba que vai deixar
de existir, e há **dois** botões "Atualizar" relendo coisas que se sobrepõem.

## O que já existe, e o que só muda de endereço

| Peça | Onde hoje |
|---|---|
| `emulation_uinput_label` | `gui/main.glade:3158` ("UINPUT:") |
| `emulation_device_name_label` | `gui/main.glade:3172` ("Device:") |
| `emulation_vidpid_label` | `gui/main.glade:3185` ("Código do fabricante:") |
| `emulation_js_label` | `gui/main.glade:3198` ("Controles detectados:") |
| Quem pinta os quatro | `app/actions/emulation_actions.py:1066` (`_refresh_emulation_view`) |
| "Testar o controle virtual" | `gui/main.glade:3336` → `emulation_actions.py:1011` (`on_emulation_test_device`) — cria e destrói um vpad |
| "Atualizar" da Emulação | `gui/main.glade:3343` → `emulation_actions.py:928` |
| "Atualizar" da Sistema | `gui/main.glade:2790` → `daemon_actions.py:2240` (já relê o cartão de saúde, o detector de janela e a sensibilidade dos botões) |
| Fita da aba Sistema | `app/app.py:1234` — `daemon_box: _MOTIVO_ALVO_AINDA_NAO_LIGADO` |

Contrato: redesenho, linhas 508-517 e 578-580. Decisão:
`D-A-EMULACAO-MORRE` (`/tmp/coleta/decisoes.md:174`) — *"UINPUT/Device/VID:PID
/Gamepads são diagnóstico e vão para a Sistema; 'Testar o controle virtual'
CRIA E DESTRÓI um gamepad virtual só para ver se dá — é autoteste de
instalação, vai para a Sistema"*.
Mockup: `layout/09-sistema.html`, quadro **Gamepad virtual** (4 linhas de
estado + 1 botão), ao lado do quadro **O Hefesto**.

## O que entrega

1. **Quadro "Gamepad virtual"** no `daemon_box`, com as quatro linhas de
   estado no formato do mockup (rótulo à esquerda, valor à direita, glifo e
   cor mudando **juntos**) e o botão "Testar o controle virtual".
   Rótulos do mockup: *Gamepad virtual (uinput)* · *Aparelho* · *Código do
   fabricante* · *Controles detectados* — "UINPUT" e "Device" saem da tela.
2. **A pintura muda de dono**: `_refresh_emulation_view` deixa de ser a única
   escritora dessas quatro linhas. Extraia dela a parte que **calcula** (é
   pura: `classificar_joysticks:241`, `rotulo_gamepads:282`,
   `_atributos_do_joystick:261`) e chame do refresh da aba Sistema. Não
   duplique o cálculo — duplicar é o defeito que a `D-AS-ABAS-CONVERSAM`
   existe para matar.
3. **Um "Atualizar" só**: o da Sistema (`on_daemon_refresh`) passa a repintar
   a aba inteira, quadro do gamepad virtual incluído. O botão da Emulação sai
   do Glade junto com o resto do bloco de diagnóstico.
4. **A fita apaga com o motivo certo**: em `app/app.py:1234`, `daemon_box`
   troca `_MOTIVO_ALVO_AINDA_NAO_LIGADO` ("Esta aba não usa o controle
   escolhido aqui.") por `MOTIVO_ALVO_NAO_SE_APLICA`
   (`app/actions/config/mixin.py:33`) — nada nesta aba é por controle
   (`D-A-FITA-E-O-UNICO-ALVO`; redesenho, linha 526).

## Como se prova (a mordida)

`tests/unit/test_onda_sistema_02_o_gamepad_virtual.py`:

- **as quatro linhas existem na aba Sistema**: parse do `main.glade` — os
  quatro ids novos estão **dentro** de `daemon_box` e **não** dentro de
  `emulation_box`. Devolva os ids ao lugar antigo e o teste reprova;
- **um Atualizar só**: contar os `GtkButton` com rótulo `Atualizar` no Glade
  → exatamente 1;
- **o clique repinta o quadro novo**: dublê que conta chamadas —
  `on_daemon_refresh` tem de tocar as quatro linhas. Arranque a chamada nova
  de `on_daemon_refresh` e veja reprovar;
- **a fita**: `_ALVO_POR_ABA["daemon_box"] is MOTIVO_ALVO_NAO_SE_APLICA`, e a
  fita fica **inerte** (nunca sensível). O portão da Z2-9 já reprova módulo de
  aba ausente do mapa — não o quebre;
- **o dublê recusa**: sem `/dev/uinput`, a linha diz o que faltou, e o botão
  de autoteste diz "o sistema não deixou" com o motivo — nunca um verde mudo.

## O que é dela decidir

- **O que acontece com o `emulation_box` esvaziado.** Esta sprint **remove só
  o bloco de diagnóstico** (`emulation_diagnostico_row`, `emulation_info_grid`,
  `emulation_btns`). O resto da aba — máscara, modo jogo, Steam Input, mic,
  combos — tem destino nomeado no redesenho mas **dono em outras ondas**; e a
  aba renasce como **Lançadores**, placeholder
  (`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`). **Não apague a página**: relate.
- **Rótulos de tela.** "Aparelho" e "Gamepad virtual (uinput)" vêm do mockup
  aprovado; marque `PROVISÓRIO — decisão dela` se precisar variar.

## Colisão declarada

`emulation_actions.py` e `main.glade` são disputados pela onda **Lançadores**.
O Glade é recurso de bancada — **uma sprint por vez**
(`COMO-EXECUTAR-UMA-SPRINT.md` §2). Se a outra onda estiver em voo, quem
coordena serializa; não resolva conflito de Glade sozinho.

## O BOTÃO QUE ELA QUESTIONOU (27/08/2026, à noite)

*"Criar um gamepad de teste — acho suspeito manter."* Ela está certa, e a razão
está na própria tela: a linha logo acima diz **"Gamepad virtual (uinput):
disponível"**.

Se a linha já diz disponível, o teste confirma o quê? Ele cria e destrói um
gamepad para descobrir o que o estado ao lado dele acabou de afirmar.

**A cura não é apagar — é condicionar.** O botão só ganha razão de existir
quando a linha diz **indisponível**: aí ele deixa de ser "testar" e vira
**"me mostra o erro"** — roda a criação, falha, e põe na tela a mensagem do
sistema (permissão, módulo ausente, regra udev faltando), que é o que uma pessoa
precisa para consertar.

Logo:
- linha **disponível** → o botão não aparece. Não há o que testar.
- linha **indisponível** → o botão aparece com o rótulo do que ele faz de útil.

É o mesmo princípio do "Corrigir modo de execução", que esta aba já aplica: o
botão do conserto só nasce no estado que o conserto resolve.
