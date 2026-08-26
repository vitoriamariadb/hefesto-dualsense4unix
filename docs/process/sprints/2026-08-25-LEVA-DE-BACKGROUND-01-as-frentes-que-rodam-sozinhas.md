---
sprint: LEVA-DE-BACKGROUND-01
posse:
  # Frentes medidas em 25/08/2026 por um censo de quatro batedores sobre o
  # resto do projeto. Cada uma tem posse DISJUNTA das outras e das seis da
  # Onda 1 — conferido arquivo por arquivo contra o disco, não citado de
  # memória. Elas existem aqui porque não tinham sprint dona, e sem dono o
  # `despachar-agente.sh` recusa criar a árvore.
  BG-02:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
  BG-04:
    - flatpak/br.andrefarias.Hefesto.yml
    - packaging/arch/PKGBUILD
    - packaging/fedora/hefesto-dualsense4unix.spec
    - packaging/nix/package.nix
    - scripts/build_appimage.sh
    - scripts/build_appimage_gui.sh
    - scripts/check_packaging_parity.sh
  BG-05:
    # CORRIGIDO no despacho, 25/08: o censo apontou `utils/repo_files.py`, que
    # NÃO EXISTE. `_find_repo_file` mora em DOIS lugares — e são duas cópias,
    # que é o defeito de fundo desta frente.
    - src/hefesto_dualsense4unix/cli/cmd_doctor.py
  BG-06:
    - scripts/doctor.sh
  BG-07:
    - src/hefesto_dualsense4unix/profiles/manager.py
cria:
bancada: false
nao_toca:
  - install.sh
  - src/hefesto_dualsense4unix/gui/main.glade
  - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
  - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
  - src/hefesto_dualsense4unix/utils/maquina.py
  - src/hefesto_dualsense4unix/integrations/arranjo_da_mesa.py
  - tests/conftest.py
depois_de:
  - ESCONDE-SO-O-HIDRAW-01
  # A NAVEGACAO-UM-CONTROLE-SO-01 também reivindica
  # `mouse_actions.py` (a frente E2 dela, que JÁ FECHOU no merge da
  # madrugada). Serializar é honesto: ela chegou antes.
  - NAVEGACAO-UM-CONTROLE-SO-01
---

# LEVA DE BACKGROUND · 01 — as frentes que rodam sozinhas

**25/08/2026.** Não é sprint de produto: é o **registro de posse** das frentes
que um censo de quatro batedores mediu como independentes — das seis da Onda 1
e entre si.

**Por que ela existe.** Cada uma destas frentes tem defeito medido, cura
conhecida e nenhuma sprint dona. Sem `posse:` declarada o despacho recusa a
árvore, e a frente não sai do papel — foi o gargalo que o censo nomeou como
`BG-00`.

**O critério que entrou aqui:** não precisa da palavra dela, não precisa do
olho dela, não precisa de controle na mão. O que precisa de qualquer um dos
três está na seção "é dela" do censo e **não** nesta sprint.

## As frentes, e o que cada uma custa hoje

| # | o defeito, do lado de quem usa |
|---|---|
| **BG-02** | Ela liga o mouse pelo controle, o cursor não anda, e a aba **não diz por quê**. O produto conhece as três razões (o interruptor, a permissão de `uinput`, o modo jogo) e não conta nenhuma |
| **BG-04** | Quem instalou por Flatpak, AppImage, Arch, Fedora ou Nix aperta "Deixar tudo pronto" e recebe *"Script não encontrado"* — **só o `.deb` leva os scripts** |
| **BG-05** | `_find_repo_file` conhece três layouts e o Flatpak não é nenhum deles: o `doctor` não roda exame de verdade fora do checkout |
| **BG-06** | Com o agente de pareamento morto, o exame diz `[WARN]` — e **nenhum controle novo consegue parear**. Aviso no meio de centenas some |
| **BG-07** | Ela desliga o Modo Nativo e a vibração **não volta** ao que o perfil manda: falta o sétimo applier na volta |

## O que esta sprint NÃO cobre

A janela da calibração (`app/widgets/calibrar_entradas.py`) está **fora por
decisão dela** — é dela e de quem coordena, juntos, depois.

E `install.sh`, `main.glade`, `coop.py`, `conftest.py`, `maquina.py`,
`secao_exame.py`, `arranjo_da_mesa.py` e o portão da casa estão no `nao_toca`
porque **têm dono em outra árvore neste exato momento**. Quem precisar de um
deles relata em vez de editar (R1).
