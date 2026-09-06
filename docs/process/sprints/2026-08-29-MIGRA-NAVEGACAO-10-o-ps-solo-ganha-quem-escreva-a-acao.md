---
sprint: MIGRA-NAVEGACAO-10
estado: absorvida
onda: MIGRA-NAVEGACAO
posse:
  NAV6-PS-SOLO:
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
cria:
  - tests/unit/test_migra_navegacao_10_o_ps_solo_tem_quem_escreva.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-07
  - MIGRA-NAVEGACAO-08  # a escrita dos gestos passa pelo mesmo funil
  - ONDA-NAVEGACAO-03
  - ONDA-JOGAR-03
  - ONDA-SISTEMA-01
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - BATERIA-PARADA-01
  - LEVA-1
  - LEVA-4
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA NAVEGAÇÃO · 10 — O PS solo ganha quem escreva a ação, e o "Escolher um programa…" deixa de ser desenho

## O defeito

**A casa sabe e o produto não faz, com meio caminho andado.** O que o toque
curto no PS faz é configurável **por dentro** e não tem escritor **nenhum**:

- `daemon/lifecycle.py:204` — `ps_button_action: Literal["steam", "none",
  "custom"] = "steam"`
- `daemon/lifecycle.py:205` — `ps_button_command: list[str]`

Os dois são **lidos** em `daemon/subsystems/hotkey.py:46`, `:66` e `:71`
(`build_ps_solo_callback` decide entre abrir a Steam, não fazer nada, ou rodar o
comando). E `grep -rn "ps_button_command" src/` devolve **duas** linhas: a
declaração e a leitura. **Ninguém escreve.**

O mockup já oferece a escrita: `ACOES_UNI` de `aba06.py:457` tem o grupo
*Executar Comando* com **"Escolher um programa…"**, e `ACOES_GESTO` tem *"Abre e
foca a Steam"*. A ação de abrir a Steam existe
(`integrations/steam_launcher.py`, `open_or_focus_steam`), mas **só como gesto
do PS** — nunca como valor de um botão qualquer.

## O que entrega

1. **Um caminho de escrita para os dois campos**, pelo mesmo funil dos outros
   ajustes desta aba: a escolha viaja por IPC, a resposta é lida, e as três
   saídas (sucesso, recusa com motivo, ninguém respondeu) são as de sempre.
2. **"Escolher um programa…" abre um seletor de arquivo e grava uma LISTA**,
   não uma string — `ps_button_command` é `list[str]`, e é assim que o
   `_sp.Popen` o consome (`hotkey.py:73`). Gravar `"steam -bigpicture"` como uma
   string só produziria um executável com espaço no nome e um erro que ninguém
   lê: o `Popen` está dentro de um `contextlib.suppress(Exception)`.
3. **A recusa quando não há comando tem tela.** Hoje escolher `custom` sem
   comando escreve `hotkey_ps_solo_custom_sem_comando` no journal e **não faz
   nada** (`hotkey.py:69`). Passa a ser impossível pela tela, ou visível quando
   vier de outra porta.
4. **O "não faz nada" é um valor legítimo e se chama assim.** `ps_button_action
   = "none"` já existe; na tela ele é o `— Nada —` que o mockup já desenha
   (`ACOES_GESTO`, o último grupo).
5. **O que o PS solo NÃO faz continua escrito.** Ele não dispara em Modo Nativo
   nem com a emulação suprimida (`hotkey.py:60-67`), e as duas são
   deliberadas: com o controle dedicado a um jogo, o PS já vai cru como
   `BTN_MODE` e disparar também a ação de sistema **roubaria o foco**. A tela
   diz isso onde ele estiver inerte.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_10_o_ps_solo_tem_quem_escreva.py`:

1. **O campo passa a ter escritor.** `grep -rn "ps_button_command" src/` devolve
   **três ou mais** linhas, e uma delas é uma atribuição. **Morde:** este é o
   teste que a lápide pedia — sem ele, tudo o mais passa com o campo continuando
   morto. É a mesma régua da sprint 05 sobre `resolver_teclado_emulado`.
2. **O comando é lista.** Escolher um programa com espaço no caminho grava
   `["/opt/meu programa/bin"]`, um elemento. **Morde:** grave a string e
   reprova. O erro real seria mudo: o `Popen` está sob `suppress`.
3. **`custom` sem comando é recusado com motivo.** **Morde:** aceite e reprova.
4. **Modo jogo e Modo Nativo continuam calando o PS solo.** Dois cenários, duas
   asserções de que o callback **não** abriu a Steam. **Morde:** tire uma das
   duas guardas e reprova. Sem elas, o PS dentro de um jogo rouba o foco — o
   defeito que a FEAT-PARITY-REVIEW-01/M5 fechou, e ele cobre também jogo
   não-Steam.
5. **Nenhum `pgrep` entra no caminho.** O callback roda **inline no poll loop**,
   e a nota de `hotkey.py:53` mede o preço: *"um pgrep bloqueava
   input/IPC/co-op por até 2s"* (REVIEW-M5-PGREP-BLOCK-01). **Morde:** cole um
   `subprocess.run(["pgrep"…])` e reprova.

## O que é dela decidir

- **Onde a escolha grava: no perfil ou na máquina?** `ps_button_action` mora
  hoje na config do **daemon**, ou seja, na máquina. O mockup a desenha dentro
  de uma aba que é toda de perfil. `PROVISÓRIO — decisão dela`: a proposta é
  **manter na máquina**, porque "o que o meu botão PS faz" é da pessoa e não do
  jogo — mas é a mesma pergunta da sprint 08, e as duas se decidem juntas.
- **"Abrir a Steam" pode ser valor de um BOTÃO qualquer, e não só do PS?** O
  mockup oferece isso nas 21 linhas da pop-up (`ACOES_UNI`, grupo *Executar
  Comando*). Hoje não há caminho: o `steam_launcher` é chamado de um lugar só. É
  trabalho da sprint 11, e depende desta resposta.
