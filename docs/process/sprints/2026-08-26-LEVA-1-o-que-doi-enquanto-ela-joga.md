---
sprint: LEVA-1
posse:
  A:
    - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/core/backend_pydualsense.py
  B:
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
    - tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py
  C:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
    - tests/unit/test_aplicar_verdade_ponte_lightbar.py
  D:
    - scripts/doctor.sh
    - scripts/fix_wireplumber_default_source.sh
    - install.sh
    - uninstall.sh
    - tests/unit/test_esconde_so_o_hidraw_veredito_das_tres_superficies.py
  E:
    - src/hefesto_dualsense4unix/utils/repo_files.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
    - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
    - src/hefesto_dualsense4unix/cli/cmd_mic.py
    - src/hefesto_dualsense4unix/integrations/storm_doctor.py
  F:
    - src/hefesto_dualsense4unix/utils/maquina.py
  G:
    - scripts/check_colisao_de_sprints.py
cria:
  - tests/unit/test_borda_de_queda_01_o_rumble_na_borda.py
  - tests/unit/test_borda_de_queda_01_rehide_sem_p1.py
  - tests/unit/test_dropin_ambiguo_01_a_marca_do_gesto.py
  - tests/unit/test_bg05_a_lista_de_bases_e_uma_so.py
  - tests/unit/test_o_conselho_de_atualizar_serve_a_esta_instalacao.py
  - tests/unit/test_a_saude_do_sistema_diz_o_que_fazer.py
  - src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
  - tests/unit/test_a_calibracao_grava_com_o_daemon_morto.py
  - tests/unit/test_a_fase_sentada_resolve_o_hub.py
  - tests/unit/test_a_volta_so_visita_o_que_esta_vazio.py
  - tests/unit/test_o_botao_de_calibrar_nao_chega_no_jogo.py
  - tests/unit/test_a_marreta_respeita_o_silencio.py
  - tests/unit/test_o_laudo_confessa_o_que_nao_mede.py
  - tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py
  - docs/process/sprints/2026-08-26-LEVA-1-o-que-doi-enquanto-ela-joga.md
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/portoes.sh
  - .github/workflows/ci.yml
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - docs/usage/assets
---

# LEVA 1 — o que dói enquanto ela joga

**26/08/2026.** Registro de posse das sete frentes da primeira das quatro levas
que ela encomendou ao sair: *"estude todos os projetos ativos e toque via
agentes todas as sprints possíveis de serem tocadas sem a necessidade de um
humano."*

O desenho saiu de um censo de sete batedores, três lentes céticas e um
sintetizador dono único — 76 frentes brutas, 64 abertas, 40 tocáveis sem
humano, 26 escolhidas. O critério de corte foi um só: **precisa da PALAVRA, do
OLHO ou da MÃO dela? então não entra.**

## As sete frentes

| # | o defeito, do lado de quem usa |
|---|---|
| **A** | Um controle cai no rádio e o motor do dela **fica vibrando** até um teto de 3 s cortar — quatro vezes em 28 s. E se o vpad do Jogador 1 morrer, o jogo vê os controles 2, 3 e 4 **duplicados** |
| **B** | Ela desliga o Modo Nativo e a vibração **não volta** ao que o perfil manda: falta o sétimo applier na volta. Sobreviveu a duas levas por falta de dono, não de conserto |
| **C** | A aba Lightbar diz "Cor enviada" por **heurística da janela**, jogando fora o corpo do daemon que já traz o destino. Mesa vazia, zero destino, tela verde |
| **D** | O exame sai `[OK]` onde não mediu: a ausência do drop-in 51 tem duas origens e vira uma só, e o veredito do hide mede só o que o broker escondeu |
| **E** | Fora do checkout os botões não fazem nada — o script **está** na máquina e o produto olha na lista curta. E três frases mandam rodar `./install.sh`, que só existe para quem clonou |
| **F** | Entrada USB **vazia** não tem como ser ensinada: não há aparelho para arrastar, e metade do mapa dela fica sem número |
| **G** | Duas réguas respondem "qual controle move para qual adaptador" e ninguém as rodou lado a lado. E o `FALHA:` da colisão sai grudado no fim de um nome de arquivo, no meio de 276 linhas |

## O que esta leva NÃO cobre

`main.glade`, `secao_mesa.py`, `secao_exame.py` e `ipc_bridge.py` estão no
`nao_toca` porque têm dono nas levas 2 e 3. `scripts/portoes.sh` e o `ci.yml`
não recebem linha de agente nenhum: teste novo entra na suíte, e quem coordena
põe nos dois no mesmo commit se merecer a lista.

**Nenhuma frente roda `retratar_abas.py`** — são 16 PNGs versionados, e conflito
binário não tem merge de três vias. Quem coordena fotografa uma vez, no fim,
já em `onda/atual`.
