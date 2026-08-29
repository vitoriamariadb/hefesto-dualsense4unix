---
sprint: MIGRA-VIBRACAO-04
onda: MIGRA-VIBRACAO
posse:
  MV4:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/daemon/ipc_rumble_policy.py
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/daemon/subsystems/rumble.py
    - src/hefesto_dualsense4unix/daemon/protocols.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/app/telas/vibracao.py
cria:
  - tests/unit/test_migra_vibracao_04_a_forca_tem_endereco.py
bancada: true
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-VIBRACAO-01
  - MIGRA-VIBRACAO-03
  # A SPRINT QUE ESTA SUBSTITUI. O diagnóstico dela sobrevive inteiro; o que
  # muda é a tela — o endereço deixa de ser a fita e passa a ser a COLUNA.
  - ONDA-VIBRACAO-04
  # SÉRIE por R5 — os donos declarados dos mesmos arquivos, medido em 29/08
  - LEVA-1
  - LEVA-3
  - LEVA-DE-BACKGROUND-01
  - JOGADOR-3-FANTASMA-01
  - ONDA-CONEXOES-10
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-GATILHOS-04
  - ONDA-JOGAR-05
  - ONDA-LANCADORES-06
  - ONDA-NAVEGACAO-01
  - ONDA-PERFIS-03
  - ONDA-SISTEMA-07
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  # AS OUTRAS ONDAS DA MESMA LEVA que reivindicam os mesmos arquivos.
  # Lista de 29/08, e ela SE MOVE: as dez ondas estavam sendo escritas ao
  # mesmo tempo. Quem coordena reconfere com `check_colisao_de_sprints.py`
  # antes de despachar.
  - MIGRA-CONEXOES-06
  - MIGRA-CONTROLES-09
  - MIGRA-GATILHOS-09
  - MIGRA-ILUMINACAO-11
  - MIGRA-JOGAR-10
  - MIGRA-NAVEGACAO-07
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/core/rumble.py
  - novo-layout/
---

# MIGRA VIBRAÇÃO · 04 — a força ganha endereço, e o "Auto" sai da coluna

**O diagnóstico da `ONDA-VIBRACAO-04` (27/08) sobrevive inteiro e não se
reescreve aqui.** O que mudou é a **tela**: naquela sprint o endereço vinha da
fita do topo; nesta, a fita está **esmaecida por decisão dela** (28/08,
`aba05.py:373`, `fita_viva=False`) porque os quatro ficam lado a lado — e o
endereço passa a ser a **coluna**, pelo `data-uniq` da **02**.

**Leia `2026-08-27-ONDA-VIBRACAO-04-a-forca-ganha-endereco.md` antes desta.** A
varredura que ele traz — qual método é global e quais **não** são — poupa a
tarde de quem executar: `set_rumble_scales`, `set_led_scales` e
`force_rumble_stop` **não são o defeito**, e caçá-los custa horas.

## O defeito em uma frase

O mockup mostra **quatro forças na mesma tela**, uma por coluna; o produto tem
**uma**, num campo único da máquina.

Está escrito no próprio código, em `app/draft_config.py:1475`: *"não existe IPC
vivo por unidade"*. O multiplicador é lido de `daemon.config.rumble_policy` por
três rotas: `ipc_rumble_policy.apply_rumble_policy`,
`subsystems/rumble.reassert_rumble` e `subsystems/gamepad._game_rumble_mult:1119`.

## O que já existe, e é MAIS da metade do caminho (reconferido hoje)

- **A escala por peça já chega ao hardware.** `core/backend_pydualsense.py:3797`
  `_escalar_rumble(key, weak, strong)` é chamado por `set_rumble_for`
  (`:4768`) na linha `:4789`. Ele escala **por chave**, e ignora o alvo modal de
  propósito: quem endereça é o chamador.
- **O override já mora no perfil**: `ControllerRumbleOverride`
  (`profiles/schema.py:762`), escrito por `draft_config.py:1193`
  `with_controller_rumble` e lido por `:1173` `effective_rumble_for`.
- **A escala relativa já é calculada e aplicada**: `profiles/manager.py:1760`
  `_controllers_to_rumble_scales`, aplicada no "Aplicar" por
  `daemon/ipc_draft_applier.py:346`.
- **`apply_game_rumble` já recebe endereço** (`gamepad.py:1151`, `target_uniq`)
  e já obedece a `BROADCAST-PROIBIDO-01`: endereço que não casa é **descartado**,
  nunca vira broadcast (`:1216-1219`).

**O que falta é só a POLÍTICA.**

## O que entrega

1. **`daemon.config.rumble_policy_por_uniq: dict[str, tuple[str, float | None]]`**
   — ao lado do global, que continua sendo o padrão de quem não tem entrada.
2. **`rumble.policy_set` e `rumble.policy_custom` aceitam `uniq` opcional**
   (`ipc_handlers.py:4383` e `:4414` na árvore de hoje). Sem `uniq` = a mesa,
   exatamente como hoje: a CLI e o applier de perfil não mudam.
3. **Uma função só resolve a política de um endereço** —
   `politica_do_uniq(daemon, uniq)` em `ipc_rumble_policy.py`, e as **três**
   rotas passam a chamá-la. Duas cópias divergem na primeira mudança, e este
   módulo já pagou por isso uma vez.
4. **`_game_rumble_mult` recebe o `uniq`** que o `apply_game_rumble` já tem na
   mão (aplicado em `gamepad.py:1199`). É a linha que faz a força ter endereço
   **no jogo**, que é onde ela importa.
5. **A página manda o endereço da COLUNA.** O adaptador lê o `data-uniq` do
   `.ctrl` que recebeu o clique. **Não há fita a consultar nesta aba**, e é
   decisão dela: com os quatro à vista, a fita afirmaria na tela uma coisa que
   ela já não faz.
6. **`to_ipc_dict` emite a seção por unidade** — `draft_config.py:1475-1483` já
   monta o dicionário e o **descarta**; ele passa a viajar.

**A memória do debounce do `auto` continua sendo UMA** (`daemon/protocols.py`,
`_last_auto_mult` / `_last_auto_change_at`). Ver abaixo.

## O "Auto", que o mockup desenha e o esquema recusa

`ControllerRumbleOverride` (`profiles/schema.py:762`) lista
`Literal["economia","balanceado","max","custom"]` (`:795`) e tem um
**validador dedicado** (`:798-811`) que levanta com a mensagem explicando por
quê:

> *"'auto' não vale por unidade — ele escala pela BATERIA, e quem a lê é o
> controle PRIMÁRIO (`core.rumble._effective_mult`). Guardar 'auto' aqui faria
> as duas peças escalarem pela bateria da mesma."*

**O mockup desenha o P3 em "Auto", com 70%** (`aba05.py:79`). As três saídas
estão na seção "o que é dela decidir"; **nenhuma é do executor.**

## Como se prova (a mordida)

`tests/unit/test_migra_vibracao_04_a_forca_tem_endereco.py`

- **Dois controles na mesa.** `rumble.policy_set(policy="economia", uniq=P1)`.
  O jogo pede `weak=100, strong=100` para os dois. **P1 recebe (30, 30) e P2
  recebe (100, 100).** *Arranque:* faça `politica_do_uniq` ignorar o `uniq` e
  veja os dois saírem (30, 30) — que é exatamente o produto de hoje.
- **`rumble.policy_set` SEM `uniq` continua mudando os dois.** A rota antiga não
  pode quebrar: é por onde a CLI e o applier de perfil passam.
- **`uniq` que não casa nenhum controle: descartado com log, nunca global** — o
  irmão da regra de `gamepad.py:1216-1219`.
- **`policy="auto", uniq=P1` é recusado com o motivo**, e o motivo é o texto de
  `schema.py:802-810`, **lido**, nunca um literal novo digitado na régua.
- **DUAS COLUNAS, DUAS VERDADES, NA MESMA TELA:** a do P1 mostra "Economia,
  30%" e a do P2 "Balanceado, 100%". *Arranque:* pinte o valor global nas duas
  e veja reprovar — é o defeito que a tela nova torna visível pela primeira vez.
- **A régua roda o tique MAIS DE UMA VEZ.** Lição paga em 29/08: *uma régua que
  roda o tique uma vez mede um INSTANTE, não um comportamento* — foi assim que
  uma regressão que só aparecia **181 segundos depois** passou com 67 testes
  verdes. Três tiques de `reassert_rumble` com dois donos diferentes, e os dois
  continuam com a sua política.

**Bancada:** dois controles na mesa dela, um em "Economia" e o outro em
"Máximo", com um jogo pedindo vibração para os dois — e a palavra dela sobre
qual tremeu mais. `scripts/bancada.sh exigir` antes.

## O que é dela decidir

1. **O "Auto" fica na fileira das colunas?** As três saídas, com o preço de cada
   uma:
   * **(a)** o Auto **sai** das colunas e vira ajuste da mesa (uma caixa à
     parte, acima da grade). Barato, honesto, e muda o desenho que ela aprovou.
   * **(b)** a **bateria por `uniq`** chega ao ponto de escala
     (`core/rumble._effective_mult`). É a saída que muda o **produto**, e é
     outra frente — o dado existe (`battery_pct` em `describe_controllers`), o
     caminho é que não o carrega.
   * **(c)** o Auto por coluna é aceito e as quatro escalam pela bateria da
     **mesma** peça — que é a mentira que o validador existe para impedir.
2. **Um perfil sem entrada para a peça herda a força global do perfil, ou o
   último valor daquela peça?** A regra da casa hoje diz global; a regra dela
   (*"o controle carrega a SUA setting"*, `D-O-CONTROLE-CARREGA-A-SUA-SETTING`)
   puxa para o outro lado.

## O que esta sprint NÃO faz

Não mexe no `main.glade` (é a **01**), não mexe no esquema (o `custom_mult` e o
teto de 1,5 continuam sendo da `ONDA-VIBRACAO-03`), e **não põe na tela o aviso
do teto do orçamento** — a coluna vai poder mostrar "Máximo, 150%" enquanto o
motor recebe 30%, e o lugar dessa frase é a **08**.
