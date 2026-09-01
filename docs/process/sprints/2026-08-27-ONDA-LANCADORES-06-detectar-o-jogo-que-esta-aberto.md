---
sprint: ONDA-LANCADORES-06
onda: ABA-LANCADORES
posse:
  L6:
    - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-06-detectar-o-jogo-que-esta-aberto.md
  - tests/unit/test_detectar_o_jogo_aberto.py
bancada: false
depois_de:
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-03
  - ONDA-LANCADORES-04
  - ONDA-LANCADORES-05
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  - ONDA-JOGAR-05
  - ONDA-PERFIS-03
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/integrations/window_detect.py
  - src/hefesto_dualsense4unix/integrations/window_backends/
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

# ONDA LANÇADORES · 06 — "Detectar o jogo que está aberto"

**O defeito, em uma frase:** o daemon já sabe a classe, o título **e o
executável** da janela ativa, e publica só a classe — então a janela não tem como
montar a regra do perfil sem ela digitar.

## Onde está hoje, medido

- O detector entrega os quatro campos: `WindowInfo(wm_class, pid, app_id, title,
  exe_basename)` — `integrations/window_backends/base.py:11-27`.
- O daemon guarda os três que importam:
  `store.window_detect_current_class`, `window_detect_current_name` e
  `window_detect_current_exe` — usados juntos em `daemon/ipc_handlers.py:3771-3786`.
- **O payload publica só a classe:** `_window_detect_payload`
  (`daemon/ipc_handlers.py:2264-2285`) traz `backend`, `healthy`, `last_class`,
  `current_class`, `useful_age_sec`, `seeing` e `reason`. **Nome e executável
  ficam do lado de dentro.**
- O motor de casamento é universal desde sempre (`process_name`, `window_class`),
  e é isso que D-A-INTERFACE-E-UNIVERSAL-NAO-SO-STEAM diz que a tela esconde:
  a interface diz "Steam" 689 vezes.

## O que entrega

**Backend:** `_window_detect_payload` passa a publicar
`window_detect_current_name` e `window_detect_current_exe`. Duas chaves, com o
mesmo `getattr` defensivo das outras (store dublado em teste não precisa
conhecê-las).

**Frontal:** o botão roxo do topo (`layout/07-lancadores.html:473`) lê o
trio e abre um perfil novo já preenchido — `process_name` do executável,
`window_class` da classe, e o título só quando os dois primeiros não bastam.

**E ele sabe recusar.** Quando o detector está cego, o botão não cria nada: diz
o motivo, que já existe pronto em `window_detect_reason` ao lado de
`window_detect_seeing` (o par que denuncia a cegueira — `ipc_handlers.py:2240-2256`
explica por que `healthy` e `last_class` **mentem** sozinhos: um é trinco de mão
única, o outro é *sticky*).

## A mordida

`tests/unit/test_detectar_o_jogo_aberto.py`:

1. State dublado com `window_detect_seeing=False` e um `reason` → o botão
   **recusa e nomeia o motivo**. Arranque a checagem → nasce um perfil com
   `window_class="unknown"`, que casaria com qualquer coisa: o teste reprova.
2. State com o trio preenchido → a regra sai com `process_name` **e**
   `window_class`, e sem `title_regex` quando eles bastam.
3. Régua do payload: `_window_detect_payload` com um store dublado devolve as
   duas chaves novas. Arranque uma delas → reprova.

## O que é dela decidir

- **Onde mora este botão.** Só aqui, só na aba Perfis (ao lado de *"Nome do
  jogo:"*), ou nos dois lugares? É o item 3 do "falta decidir" da aba, e o
  redesenho registra o preço: *duplicar botão foi o defeito mais caro do desenho
  antigo*.
