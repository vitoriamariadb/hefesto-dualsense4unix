---
sprint: ONDA-VIBRACAO-04
estado: absorvida
# onda: ABA-VIBRACAO
posse:
  V4:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/daemon/ipc_rumble_policy.py
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/daemon/subsystems/rumble.py
    - src/hefesto_dualsense4unix/daemon/protocols.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
cria:
  - tests/unit/test_a_forca_da_vibracao_tem_endereco.py
bancada: true
depois_de:
  - ONDA-VIBRACAO-03
  - JOGADOR-3-FANTASMA-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-3  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/schema.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 05). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA VIBRAÇÃO · 04 — a força ganha endereço

**O defeito em uma frase:** com um controle escolhido na fita, a aba **grava a
força na peça** e **manda o comando para a mesa inteira** — e a partir da
ONDA-VIBRACAO-02 ela não confessa mais isso, porque foi ela quem mandou tirar a
confissão.

## Por que isto virou obrigação

O produto confessava a divergência numa linha laranja
(`TEXTO_ONDE_GRAVA_E_ONDE_MANDA`, `rumble_actions.py:428-431`). Ela leu a linha
e mandou tirá-la duas vezes (`/tmp/coleta/hoje.md:204-208`):

> *"A Força da vibração vale para os dois controles — ela ainda não tem
> endereço. 1 aviso · ver todos — **remove**"*
>
> *"vale para a mesa inteira, **remove**, botão de ajustes faz isso."*

*"Botão de ajustes"* é a fita do topo — D-A-FITA-E-O-UNICO-ALVO, com a palavra
dela: *"a parte da seleção no canto superior que escolho se é em todos ou no
controle X. Não temos que duplicar isso em canto algum."*

**Tirar a confissão sem dar o endereço transforma um defeito confessado num
defeito escondido.** E o endereço já era pedido dela por outra porta —
D-O-CONTROLE-CARREGA-A-SUA-SETTING, na letra:

> *"hoje o override aceita leds, triggers, rumble e speaker. Para o contrato
> valer inteiro faltam mic, sensores e **a força da vibração**."*

## O que já existe, e é metade do caminho

- `ControllerRumbleOverride` já guarda `policy`/`custom_mult` **por peça**
  (`profiles/schema.py:800+`), e o `with_controller_rumble` já escreve nele
  (`draft_config.py:1193`).
- `apply_game_rumble` **já recebe endereço**: `target_uniq`
  (`daemon/subsystems/gamepad.py:1151-1219`), e já obedece a
  BROADCAST-PROIBIDO-01 — endereço pedido que não casa é **descartado**, nunca
  vira broadcast.
- `rumble.set` / `rumble.stop` **já têm dono congelado no gesto**:
  `uniq_do_alvo_de_output` (`daemon/ipc_rumble_policy.py:112`, MESA-CHEIA-05/E0).

**O que falta é só a POLÍTICA.** Está escrito no próprio código, em
`draft_config.py:1475`: *"não existe IPC vivo por unidade"*. O multiplicador é
lido de `daemon.config.rumble_policy`, um campo **único**, por três rotas:
`ipc_rumble_policy.apply_rumble_policy:56`, `subsystems/rumble.reassert_rumble`
e `subsystems/gamepad._game_rumble_mult:1119`.

## Varredura de 27/08 — qual método é global, e quais NÃO são

Medido varrendo os métodos de output de `core/backend_pydualsense.py` contra o
alvo modal (`_output_target_key`). Fica aqui porque **três dos candidatos
óbvios não são o defeito**, e caçá-los custa a tarde de quem executar:

| método | veredito |
|---|---|
| `set_rumble_scales` (`backend:3760-3782`) | **não é defeito.** Já é por peça: grava `_rumble_scale_by_uniq` (`:1411`), endereçado pelas CHAVES do mapa que o perfil entrega (`profiles/manager.py:452`, `daemon/ipc_draft_applier.py:346`). Ignora `_output_target_key` de propósito — quem endereça é o chamador. |
| `set_led_scales` (`backend:4627-4648`) | **não é defeito.** Mesmo desenho, em `_led_scale_by_uniq` (`:1401`). |
| `force_rumble_stop` (`backend:3784-3822`) | **global por desenho, e declarado** no próprio docstring (`:3800`: *"Broadcast deliberado (ignora o seletor de alvo): sair de modo para TODO mundo"*), com endereço opcional por parâmetro (`uniq`, BORDA-DE-QUEDA-01). Nada a mudar; nada a confessar na tela — sair de modo é da mesa. |
| `rumble.policy_set` / `rumble.policy_custom` (`ipc_handlers.py:4373` e `:4396`) | **É ESTE o RUM-1.** `daemon_cfg.rumble_policy = policy` (`:4392`) é um campo único da máquina, sem `uniq` em nenhum ponto do caminho. É o que esta sprint entrega. |

**Lacuna de régua, medida:** nenhum teste em `tests/` exercita
`set_rumble_scales` ou `set_led_scales` **junto com** `set_output_target` — os
vinte e poucos testes de alvo (`test_backend_output_target.py`,
`test_p4_alvo_ausente_nao_vira_broadcast.py`) cobrem só os seis que respeitam a
fita. Não é defeito, é ponto cego: nada impede alguém de fazê-los "respeitar o
alvo" e quebrar o endereçamento por chave sem um único vermelho.

## O que esta sprint entrega

1. **`daemon.config.rumble_policy_por_uniq: dict[str, tuple[str, float | None]]`**
   — o campo por peça, ao lado do global, que continua sendo o padrão de quem
   não tem entrada própria.
2. **`rumble.policy_set` e `rumble.policy_custom` aceitam `uniq` opcional**
   (`ipc_handlers.py:4372` e `:4396`). Sem `uniq` = a mesa, exatamente como hoje
   (retrocompatível: a CLI e o applier de perfil não mudam).
3. **Uma função só resolve a política de um endereço** —
   `politica_do_uniq(daemon, uniq)` em `ipc_rumble_policy.py`, e as **três**
   rotas passam a chamá-la. Duas cópias divergem na primeira mudança, e este
   módulo já pagou por isso uma vez (o docstring dele conta a história do
   `RumbleEngine` que nunca era instanciado).
4. **`_game_rumble_mult` passa a receber o `uniq`** que o `apply_game_rumble` já
   tem na mão. É a linha que faz a força ter endereço **no jogo**, que é onde ela
   importa.
5. **A GUI manda o endereço**: `_set_policy` e o soltar da barra passam o
   `alvo_de_edicao(self).uniq` para o `ipc_bridge`. `TEXTO_ONDE_GRAVA_E_ONDE_MANDA`
   e `texto_de_onde_grava_e_onde_manda` **saem** — com o endereço, não há
   divergência a confessar.
6. **`to_ipc_dict` emite a seção por unidade** — `draft_config.py:1475-1483` já
   monta o dicionário e o descarta; ele passa a viajar.

**A memória do debounce do `auto` continua sendo UMA** (`protocols.py:82-84`,
`_last_auto_mult` / `_last_auto_change_at`): o `auto` escala pela bateria do
controle **primário**, e por isso o esquema o recusa por unidade
(`schema.py:800-810`). Essa recusa **fica** — e a razão dela vira dica na aba,
em vez de um `ValidationError` que a usuária nunca lê.

## Como se prova (o teste que MORDE)

`tests/unit/test_a_forca_da_vibracao_tem_endereco.py`
- Dois controles na mesa (P1 e P2). `rumble.policy_set(policy="economia",
  uniq=P1)`. O jogo pede `weak=100, strong=100` para os dois.
  **P1 recebe (30, 30) e P2 recebe (100, 100).**
  **Arranque:** faça `politica_do_uniq` ignorar o `uniq` e veja os dois saírem
  (30, 30) — que é exatamente o defeito de hoje.
- `rumble.policy_set` **sem** `uniq` continua mudando os dois: a rota antiga não
  pode quebrar.
- `uniq` que não casa nenhum controle: a política é **descartada com log**, nunca
  vira global — o irmão da regra de `apply_game_rumble:1216-1219`.
- `rumble.policy_set(policy="auto", uniq=P1)` é **recusado com o motivo**, e o
  motivo é o texto do `schema.py:802-809`, não um literal novo.

Isto é **bancada**: precisa de dois controles na mesa dela para a prova valer no
produto, além do teste com dublê. `scripts/bancada.sh exigir` antes.

## O que é dela decidir

1. **Um perfil sem entrada para a peça herda a força global do perfil, ou o
   último valor que aquela peça recebeu?** A regra da casa hoje é herdar do
   global; a regra dela (*"o controle carrega a SUA setting"*) puxa para o outro
   lado.
2. **O `Auto` continua sendo só da mesa?** Fazê-lo por peça exige ler a bateria
   de **cada** controle — existe, e é trabalho de outra frente.
