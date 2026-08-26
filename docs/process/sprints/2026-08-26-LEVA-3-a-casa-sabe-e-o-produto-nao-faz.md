---
sprint: LEVA-3
posse:
  A:
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
    - src/hefesto_dualsense4unix/daemon/subsystems/game_signal.py
    - tests/unit/test_game_signal_processo_vivo.py
  B:
    - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
    - src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py
    - src/hefesto_dualsense4unix/integrations/mapa_das_portas.py
    - integrations/arranjo_da_mesa.py
    - integrations/mapa_das_portas.py
  C:
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - tests/unit/test_ipc_bridge.py
    - app/ipc_bridge.py
  D:
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
    - src/hefesto_dualsense4unix/app/actions/ambiente_na_tela.py
    - src/hefesto_dualsense4unix/app/actions/input_actions.py
    - app/actions/ambiente_na_tela.py
  E:
    - scripts/validar-palavra-de-tela.py
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/profiles/manager.py
    - tests/unit/test_a_regua_da_palavra_le_o_recibo.py
  F:
    - src/hefesto_dualsense4unix/daemon/ipc_rumble_policy.py
    - src/hefesto_dualsense4unix/core/rumble.py
    - tests/unit/test_rumble_mult_um_dono.py
    - src/hefesto_dualsense4unix/app/fala_do_mapa.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
    - src/hefesto_dualsense4unix/integrations/plano_de_radio.py
    - tests/unit/test_fala_do_mapa.py
    - core/rumble.py
    - app/fala_do_mapa.py
  G:
    - src/hefesto_dualsense4unix/utils/session.py
    - src/hefesto_dualsense4unix/profiles/sanidade.py
    - src/hefesto_dualsense4unix/integrations/kernel_cmdline.py
    - src/hefesto_dualsense4unix/tui/app.py
    - utils/session.py
    - profiles/sanidade.py
    - integrations/kernel_cmdline.py
    - tui/app.py
cria:
  - tests/unit/test_game_signal_processo_vivo.py
  - tests/unit/test_a_regua_da_palavra_le_o_recibo.py
  - docs/process/sprints/2026-08-26-LEVA-3-a-casa-sabe-e-o-produto-nao-faz.md
bancada: false
depois_de:
  - LEVA-2
nao_toca:
  - app/actions/
  - app/actions/config/*
  - app/actions/config/secao_mesa.py
  - app/actions/config/secao_orcamento.py
  - app/widgets/external_card.py
  - assets/profiles_default/
  - cli/cmd_doctor.py
  - daemon/ipc_handlers.py
  - daemon/launch_env.py
  - daemon/lifecycle.py
  - daemon/subsystems/rumble.py
  - gui/main.glade
  - integrations/hotkey_daemon.py
  - integrations/window_detect.py
  - packaging/cosmic-applet/
---

# LEVA 3 — a casa sabe, e o produto não faz

**26/08/2026.** Registro de posse das 7 frentes da leva 3 de quatro,
encomendadas por ela ao sair: *"toque via agentes todas as sprints possíveis de
serem tocadas sem a necessidade de um humano"*.

O critério de corte foi um só: **precisa da PALAVRA, do OLHO ou da MÃO dela?
então não entra.** O desenho saiu de sete batedores, três lentes céticas e um
sintetizador dono único. A leva 3 corre depois da 2, e as 7 frentes dela
têm posse disjunta arquivo por arquivo — conferido por máquina, não citado de memória.

## As frentes

| # | o que entrega |
|---|---|
| **A** | O jogo vivo é evidência: o daemon para de desistir no meio da partida |
| **B** | Cada quadrado da janela do mapa diz se o aparelho fica bem ali |
| **C** | Poda das cinco pontes mortas do `ipc_bridge` |
| **D** | A tela deixa de dizer "pronto" no que não sabe |
| **E** | O recibo do gesto ganha régua, e ganha português |
| **F** | O número medido tem um dono só |
| **G** | Poda das conveniências que duplicam um caminho vivo |

## O que nenhuma frente desta leva faz

Rodar `scripts/gui-captura/retratar_abas.py` (16 PNGs versionados, e conflito
binário não tem merge de três vias — quem coordena fotografa uma vez, no fim),
acrescentar linha a `scripts/portoes.sh` ou ao `ci.yml`, tocar a bancada, ou
rodar a suíte inteira num processo só.
