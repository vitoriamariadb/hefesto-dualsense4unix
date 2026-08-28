---
sprint: ONDA-SISTEMA-07
# onda: SISTEMA
posse:
  S7:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
cria:
  - src/hefesto_dualsense4unix/app/actions/plugins_na_tela.py
  - tests/unit/test_onda_sistema_07_o_que_so_o_terminal_alcanca.py
bancada: false
depois_de:
  - ONDA-SISTEMA-06
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/ipc_bridge.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-3  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/cli/
  # O portão da dívida é de QUEM COORDENA, e não desta onda: cada sprint
  # entrega o MANIFESTO do que ligou, e quem coordena aplica todos num
  # commit só. Está decidido desde 25/08 em
  # 2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md
  # ("cinco frentes o tocariam; cada uma entrega um manifesto").
  - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
---

# ONDA SISTEMA · 07 — O que só o terminal alcança

**O defeito:** duas coisas que o Hefesto sabe sobre esta máquina só existem
para quem abre um terminal — a lista de plugins do daemon e o fato de o
detector de janela estar ou não enxergando alguma coisa agora.

## Peça 1 — Os plugins carregados

| | |
|---|---|
| Os métodos | `daemon/ipc_server.py:184-185` — `plugin.list` e `plugin.reload`, implementados em `daemon/ipc_handlers.py:5270` e `:5282` |
| Quem alcança | **só o CLI**: `cli/cmd_plugin.py:43` e `:77` |
| Quem alcança na tela | ninguém |

Contrato: tabela dos botões — *"Ver os plugins carregados / Recarregar …
existe no código e nunca teve tela — `daemon/ipc_server.py:184-185`"*.
Mockup: `novo-layout/09-sistema.html`, quadro **Avançado**, botão *"Ver os
plugins carregados"*, com a dica *"Lista os plugins do daemon e relê. Hoje só
o terminal alcança isso."*

**Entrega:** `app/actions/plugins_na_tela.py` (nasce) — funções **puras** que
recebem a resposta de `plugin.list` e devolvem o texto para o painel
"Detalhes técnicos": nome, perfis e estado de cada plugin, uma linha por
plugin; e uma frase honesta quando a lista vem vazia ou o daemon não responde
("o Hefesto pode estar desligado"), nunca um painel em branco.
O botão do quadro Avançado (que a ONDA-SISTEMA-05 deixou **inerte**, com a
dica dizendo por quê) fica sensível e despeja no painel de baixo, do mesmo
jeito que "Ver detalhes" (`daemon_actions.py:2360`). Um clique **relê**
(`plugin.reload` antes do `plugin.list`) — é o que o rótulo do redesenho
promete com o par "Ver / Recarregar".

**Pergunta 6 do "falta decidir"** (redesenho, linha 601): *"Plugins na tela:
sim ou não? … pode ficar dentro do painel Detalhes técnicos em vez de virar
quadro próprio."* O mockup aprovado responde: **botão no Avançado, saída no
painel** — sem quadro próprio. Siga o mockup.

## Peça 2 — Como o Hefesto enxerga a janela

| | |
|---|---|
| A função | `app/actions/ambiente_na_tela.py:76` — `descrever_display_grafico()`, escrita em 24/08, que lê `window_detect_backend` / `window_detect_seeing` / `window_detect_reason` |
| Chamadores | **zero** |
| O que já está na tela | `window_detect_diag_label` (`gui/main.glade:2883`), que mostra a outra metade: `descrever_deteccao_de_janela` (`daemon_actions.py:123`), a da **promessa** ("o perfil troca sozinho?") |

As duas não se repetem, e o módulo diz por quê
(`ambiente_na_tela.py:19-23`): *"aquela fala da PROMESSA … esta fala do
MECANISMO ('o Hefesto enxerga alguma janela, hoje?')"*. O portão desta casa
já nomeia quem fecha: `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`
— *"uma frase a mais ali pede um `GtkLabel` novo no Glade … O QUE FECHA: a
Onda 11 · Sistema"*.

Contrato: *"**Como o Hefesto enxerga a janela** (novo —
`app/actions/ambiente_na_tela.py:76`, lê as chaves certas do estado e só falta
o rótulo na tela)"* (redesenho, linha 533). Mockup: quadro **O Hefesto**,
linha `Como ele enxerga a janela` com valor curto (`Wayland · COSMIC`), selo
`INFO`, glifo `◆`.

**Entrega:** a linha no quadro "O Hefesto", pintada por
`descrever_display_grafico`. O mockup mostra o valor **curto** enquanto a
função devolve frase inteira — **encurte na tela e ponha a frase inteira na
dica**, que é a regra da aba (`D-TUDO-QUE-EXPLICA-VIRA-DICA`). O encurtamento
é do lado da tela; não mude a função, que outros já leem.

**Fica de fora, e é declarado:** `descrever_steam_encontrada()`
(`ambiente_na_tela.py:103`) lê `steam_layout_achado`, **chave que ninguém
publica** em `state_full`. O mockup não mostra linha de Steam no quadro "O
Hefesto" — então ela **não entra**, e publicar a chave não é desta sprint.
Escreva isso em *"o que sobrou para o próximo"*.

## Como se prova (a mordida)

`tests/unit/test_onda_sistema_07_o_que_so_o_terminal_alcanca.py`:

- **os plugins chegam ao painel**: dublê de IPC devolvendo dois plugins → o
  painel tem as duas linhas com nome e estado. Dublê que **levanta** → o
  painel diz que não conseguiu ler, e o botão volta a ficar clicável. As duas
  respostas, sempre;
- **o clique relê**: dublê contando chamadas → `plugin.reload` **antes** de
  `plugin.list`, uma vez cada. Arranque o `reload` e veja reprovar;
- **a linha da janela existe e é a do MECANISMO**: com
  `window_detect_backend="wayland"` e `window_detect_seeing=False`, a linha
  nova diz "sem ver nada agora" **e** o `window_detect_diag_label` continua
  dizendo a sua frase de promessa — as duas na tela, sem uma virar a outra;
- **a dica carrega o que a tela cortou**: o texto visível da linha é mais
  curto que a frase de `descrever_display_grafico`, e a dica **contém** a
  frase inteira. É a diferença entre encurtar e perder;
- **estado ausente não vira falso**: `state` sem a chave
  `window_detect_backend` → "não consegui ler", nunca "nenhum caminho
  disponível". A função já faz isso (`ambiente_na_tela.py:86`); o teste é para
  a **tela** não desfazer.

## O que é dela decidir

- **Se os plugins merecem tela.** O mockup aprovado diz que sim, no Avançado.
  Se ela mudar de ideia, o módulo novo é puro e a remoção é do botão.
- **O texto curto da linha da janela.** O mockup escreve `Wayland · COSMIC`;
  a função de hoje não devolve isso. Escreva o encurtamento e **marque
  `PROVISÓRIO — decisão dela`**.
