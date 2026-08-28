---
sprint: LEVA-4
posse:
  A:
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
    - tests/unit/test_o_lexico_da_aba_configuracoes.py
    - scripts/validar-palavra-de-tela.py
  B:
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - src/hefesto_dualsense4unix/app/actions/ambiente_na_tela.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - src/hefesto_dualsense4unix/app/textos_de_aplicacao.py
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
    - src/hefesto_dualsense4unix/utils/maquina.py
    - tests/unit/test_p2_o_carimbo_de_ponte_aparece_na_aba_perfis.py
    - tests/unit/test_ambiente_presumido_01_o_que_a_maquina_nao_tem.py
    - tests/unit/test_ambiente_presumido_01_o_portao_de_invariante.py
    - tests/unit/test_portao_o_par_com_metade_ligada.py
    - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
    - docs/process/2026-08-25-ONDE-PARAMOS-a-tarde-de-treze-frentes.md
  C:
    - scripts/check_endereco_de_radio.py
    - scripts/check_anonymity.sh
    - tests/unit/test_check_anonymity.py
    - scripts/check_test_data.sh
  D:
    - scripts/check_paridade_transporte.py
    - docs/data/LEIA-PRIMEIRO.md
    - tests/unit/test_paridade_a_mordida_tem_de_morder.py
    - tests/unit/test_leia_primeiro_nao_digita_numero_a_mao.py
  E:
    - scripts/build_deb.sh
    - scripts/check_packaging_parity.sh
    - scripts/check_faixa_sintetica.py
    - scripts/validar-caducos.py
    - scripts/validar-citacoes-de-linha.py
    - scripts/validar-fala-de-tela.py
    - scripts/gerar-tabela-de-curvas.py
cria:
  - tests/unit/test_paridade_a_mordida_tem_de_morder.py
  - tests/unit/test_leia_primeiro_nao_digita_numero_a_mao.py
  - docs/process/sprints/2026-08-26-LEVA-4-fechamento.md
bancada: false
depois_de:
  # A faxina de 27/08 apagou daqui: CONEXOES-MAPA-2D-01, CONFIGURACOES-O-LEXICO-01. Para onde cada uma foi, veja 2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md.
  - LEVA-3  # leva desta mesma encomenda: correm em SÉRIE, nunca em paralelo
  - INFRA-DE-EXECUCAO-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - LEVA-1  # leva desta mesma encomenda: correm em SÉRIE, nunca em paralelo
  - LEVA-2  # leva desta mesma encomenda: correm em SÉRIE, nunca em paralelo
  - LEVA-DE-BACKGROUND-01  # leva desta mesma encomenda: correm em SÉRIE, nunca em paralelo
  - LIGAR-OS-MODULOS-A-TELA  # já fechou: a posse chegou antes, e a serialização é nominal
  - MOTOR-DO-ARRANJO-01  # já fechou: a posse chegou antes, e a serialização é nominal
  - ORDEM-DE-SERVICO-01  # já fechou: a posse chegou antes, e a serialização é nominal
nao_toca:
  - .github/workflows/ci.yml
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
  - docs/data/caducos.csv
  - docs/data/mapa-controles.csv
  - src/hefesto_dualsense4unix/gui/main.glade
  - html/specs.html
  - scripts/portoes.sh
  - src/hefesto_dualsense4unix/gui/main.glade
  - tests/unit/test_docs_mac_anonimato.py
---

# LEVA 4 — fechamento — o léxico, os endereços e as réguas

**26/08/2026.** Registro de posse das 5 frentes da leva 4 de quatro,
encomendadas por ela ao sair: *"toque via agentes todas as sprints possíveis de
serem tocadas sem a necessidade de um humano"*.

O critério de corte foi um só: **precisa da PALAVRA, do OLHO ou da MÃO dela?
então não entra.** O desenho saiu de sete batedores, três lentes céticas e um
sintetizador dono único. A leva 4 corre depois da 3, e as 5 frentes dela
têm posse disjunta arquivo por arquivo — conferido por máquina, não citado de memória.

## As frentes

| # | o que entrega |
|---|---|
| **A** | O léxico nos quatro cedidos |
| **B** | Os endereços que a leva envelheceu, e os fatos que ela tornou falsos |
| **C** | As três réguas que guardam o endereço de rádio e o anonimato |
| **D** | A régua da paridade morde, e a porta de entrada das specs para de digitar número à mão |
| **E** | O empacotamento, e as cinco réguas menores que não mediam o que prometiam |

## O que nenhuma frente desta leva faz

Rodar `scripts/gui-captura/retratar_abas.py` (16 PNGs versionados, e conflito
binário não tem merge de três vias — quem coordena fotografa uma vez, no fim),
acrescentar linha a `scripts/portoes.sh` ou ao `ci.yml`, tocar a bancada, ou
rodar a suíte inteira num processo só.
