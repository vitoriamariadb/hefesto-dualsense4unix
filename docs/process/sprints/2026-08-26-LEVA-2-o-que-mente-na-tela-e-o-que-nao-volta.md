---
sprint: LEVA-2
posse:
  A:
    - src/hefesto_dualsense4unix/integrations/hotkey_daemon.py
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
    - tests/unit/test_hotkey_ps_solo_gate.py
  B:
    - src/hefesto_dualsense4unix/daemon/connection.py
    - src/hefesto_dualsense4unix/core/backend_pydualsense.py
    - tests/unit/test_borda_de_queda_01_audio_por_mac.py
    - tests/unit/test_reserva_do_posto_01_os_eventos_falam.py
  C:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
    - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
    - scripts/validar-palavra-de-tela.py
    - tests/unit/test_a_aba_emulacao_nao_promete_transporte_sem_lastro.py
  D:
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
    - tests/unit/test_a_dispensa_volta_quando_o_arranjo_muda.py
    - integrations/ordens_da_mesa.py
  E:
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
    - src/hefesto_dualsense4unix/integrations/censo_do_gabinete.py
    - tests/unit/test_censo_do_gabinete.py
    - integrations/portas_do_barramento.py
  F:
    - assets/profiles_default/bow.json
    - assets/profiles_default/coop_local.json
    - assets/profiles_default/sackboy_nativo.json
    - src/hefesto_dualsense4unix/profiles/loader.py
    - tests/unit/test_profiles_preset.py
    - tests/unit/test_a_fabrica_nao_casa_com_a_loja.py
    - tests/unit/test_profile_loader.py
    - tests/unit/test_r12_migra_coop_local_match.py
    - tests/unit/test_r12_editor_simples_jogo_steam.py
    - tests/unit/test_coop_default_on_migration.py
    - tests/unit/test_o_preset_nao_escolhe_a_mascara.py
    - tests/unit/test_modo01_o_modo_jogo_liga_sozinho.py
    - tests/unit/test_match_sem_caixa_e_sentinel_manual.py
    - docs/usage/creating-profiles.md
    - docs/usage/cosmic.md
    - docs/usage/troubleshooting.md
    - docs/usage/quickstart.md
    - docs/data/decisoes-dela.csv
  G:
    - src/hefesto_dualsense4unix/integrations/storm_doctor.py
    - scripts/doctor.sh
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - tests/unit/test_a_saude_do_sistema_diz_o_que_fazer.py
    - tests/unit/test_bg06_o_grau_e_o_conselho_que_serve_para_esta_instalacao.py
cria:
  - tests/unit/test_borda_de_queda_01_audio_por_mac.py
  - tests/unit/test_reserva_do_posto_01_os_eventos_falam.py
  - tests/unit/test_a_dispensa_volta_quando_o_arranjo_muda.py
  - tests/unit/test_a_saude_do_sistema_diz_o_que_fazer.py
  - docs/process/sprints/2026-08-26-LEVA-2-o-que-mente-na-tela-e-o-que-nao-volta.md
bancada: false
depois_de:
  # A faxina de 27/08 apagou daqui: CONEXOES-MAPA-2D-01, CONFIGURACOES-O-LEXICO-01, NAVEGACAO-UM-CONTROLE-SO-01. Para onde cada uma foi, veja 2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md.
  - LEVA-1  # leva desta mesma encomenda: correm em SÉRIE, nunca em paralelo
  - COOP-NA-CONEXAO-NATIVA-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - COOP-QUE-NAO-DESMONTA-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - EMULACAO-UM-DONO-SO-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - ESCONDE-SO-O-HIDRAW-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - IDENTIDADE-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - LEVA-4  # leva desta mesma encomenda: correm em SÉRIE, nunca em paralelo
  - LEVA-DE-BACKGROUND-01  # leva desta mesma encomenda: correm em SÉRIE, nunca em paralelo
  - MOTOR-DO-ARRANJO-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - ORDEM-DE-SERVICO-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - RESERVA-DO-POSTO-01  # já fechou: a posse chegou antes, e a serialização é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
  - assets/profiles_default/fallback.json
  - assets/profiles_default/meu_perfil.json
  - assets/profiles_default/navegacao.json
  - src/hefesto_dualsense4unix/daemon/lifecycle.py
  - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
  - src/hefesto_dualsense4unix/daemon/subsystems/game_signal.py
  - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
  - docs/usage/assets/
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/integrations/apelido_do_dongle.py
  - src/hefesto_dualsense4unix/integrations/desktop_notifications.py
  - packaging/debian/control
  - src/hefesto_dualsense4unix/profiles/sanidade.py
  - src/hefesto_dualsense4unix/utils/repo_files.py
---

# LEVA 2 — o que mente na tela, e o que não volta

**26/08/2026.** Registro de posse das 7 frentes da leva 2 de quatro,
encomendadas por ela ao sair: *"toque via agentes todas as sprints possíveis de
serem tocadas sem a necessidade de um humano"*.

O critério de corte foi um só: **precisa da PALAVRA, do OLHO ou da MÃO dela?
então não entra.** O desenho saiu de sete batedores, três lentes céticas e um
sintetizador dono único. A leva 2 corre depois da 1, e as 7 frentes dela
têm posse disjunta arquivo por arquivo — conferido por máquina, não citado de memória.

## As frentes

| # | o que entrega |
|---|---|
| **A** | O toque curto ganha teto: religar o controle para de abrir a Steam |
| **B** | A volta do controle secundário traz o áudio, e a queda fala no journal |
| **C** | A tela para de mentir no rótulo e no recibo, e de mandar para a aba errada |
| **D** | O card de ordem de serviço responde: "Já movi", "Ignorar" |
| **E** | A aba abre com o gabinete desenhado, diz do hub em comum, e abre a calibração |
| **F** | A fábrica encolhe para o que ela mantém ativo |
| **G** | O diagnóstico diz o que fazer, e nomeia o gesto de cada pacote |

## O que nenhuma frente desta leva faz

Rodar `scripts/gui-captura/retratar_abas.py` (16 PNGs versionados, e conflito
binário não tem merge de três vias — quem coordena fotografa uma vez, no fim),
acrescentar linha a `scripts/portoes.sh` ou ao `ci.yml`, tocar a bancada, ou
rodar a suíte inteira num processo só.
