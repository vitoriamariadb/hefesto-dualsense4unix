---
sprint: ONDA-SISTEMA-01
# onda: SISTEMA  (o campo `onda:` NÃO existe em check_colisao_de_sprints.py:81 —
#                 declarar como chave reprova com "campo desconhecido")
posse:
  S1:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/app/actions/home_actions.py
cria:
  - src/hefesto_dualsense4unix/app/actions/energia_do_hefesto.py
  - tests/unit/test_onda_sistema_01_o_retomar_e_o_dono_unico.py
bancada: false
depois_de:
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
---

# ONDA SISTEMA · 01 — O Retomar, e o Ligar/Desligar com um dono só

**O defeito:** o Hefesto pausa, a pausa fica gravada em disco e ele renasce
pausado no boot — e nenhuma tela chama `daemon.resume`; a aba Sistema nem
sabe que o estado "pausado" existe.

## O que já existe, e onde o caminho se perde

| Peça | Onde | Estado |
|---|---|---|
| `daemon.resume` | `daemon/ipc_server.py:121` → `daemon/ipc_handlers.py:2293` | vivo, sem chamador em `app/` |
| `paused` publicado | `daemon/ipc_handlers.py:2002` (`daemon.status`) e `:2415` (`state_full`) | publicado |
| Único despausador | `cli/app.py:419` (`daemon_resume`) | só o terminal |
| `_daemon_status` | `app/actions/daemon_actions.py:2461` | **quatro** estados (`online_systemd`, `online_avulso`, `iniciando`, `offline`) — nenhum é `pausado`. Com o daemon pausado a tela diz "ligado" |
| Frase mentirosa | `app/actions/home_actions.py:208` (`TEXTO_EM_PAUSA`) | manda usar *"PS + Options ou a aba Emulação"* — a Emulação morre (D-A-EMULACAO-MORRE) |
| Desligar da Jogar | `app/actions/home_actions.py:3253` | `systemctl --user stop` **inline**, e ao falhar manda *"tente pela aba Sistema"* (`:3243`) |
| Desligar da Sistema | `app/actions/daemon_actions.py:2207` → `_run_systemctl_async("stop")` | outro caminho para o mesmo gesto |

Contrato da aba: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, linhas
519-521 ("Ligar/Desligar passa a ter um dono só", "Nasce Retomar").
Mockup: `novo-layout/09-sistema.html`, quadro **O Hefesto** — a dica já diz
*"Retomar só aparece quando o Hefesto está pausado. A pausa fica gravada em
disco e sobrevive a desligar o computador"*.

## O que entrega

1. **`app/actions/energia_do_hefesto.py`** (nasce): as funções puras do gesto
   de energia — `ligar()`, `desligar()`, `reiniciar()`, `retomar()` — cada uma
   devolvendo um resultado com `ok`/`motivo`, sem GTK. É o **dono único**: as
   duas abas passam a chamar daqui.
2. **Quinto estado `pausado`** em `_daemon_status`, lido do `paused` de
   `daemon.status` — e ele **vence** `online_systemd` (há unidade ativa, mas o
   produto não está agindo). A linha "O Hefesto está:" passa a dizer
   *em pausa*, em laranja, com o glifo mudando junto com a cor (o mockup usa
   `.est.warn`, glifo `●`).
3. **Botão `btn_daemon_resume`** — "Retomar (sair da pausa)" — no `daemon_btns`
   do Glade (hoje em `gui/main.glade:2754-2815`), **`set_no_show_all(True)` +
   visível só no estado `pausado`**, no mesmo molde do
   `btn_migrate_to_systemd` (`daemon_actions.py:1949-1951`).
4. **A Jogar deixa de ter caminho próprio**: `_on_home_shutdown_clicked`
   (`home_actions.py:3190`) passa a chamar `energia_do_hefesto.desligar()`, e a
   frase de falha deixa de mandar para outra aba — diz o motivo que voltou.
5. **`TEXTO_EM_PAUSA` deixa de ensinar saída falsa**: a segunda saída passa a
   ser o botão "Retomar", nesta aba, pelo nome.

## Como se prova (a mordida)

`tests/unit/test_onda_sistema_01_o_retomar_e_o_dono_unico.py`:

- **o estado**: `_daemon_status` com `systemctl` ativo, PID vivo **e**
  `paused: True` → `"pausado"`. Arranque a leitura do `paused` e ele volta a
  `"online_systemd"` — é a reprovação que separa esta régua de uma que só sabe
  passar;
- **a visibilidade**: `_apply_daemon_view("pausado", …)` deixa
  `btn_daemon_resume` visível e, em qualquer um dos outros quatro estados,
  invisível (as cinco asserções, não só a que interessa);
- **o dono único**: um dublê de `energia_do_hefesto` que **recusa**
  (`ok=False, motivo="sem sessão systemd"`) tem de aparecer no toast das
  **duas** abas, com o motivo — e nenhuma delas pode dizer "tente pela outra
  aba". Régua que só exercita o caminho de sucesso não vale (§4 do
  `COMO-EXECUTAR-UMA-SPRINT.md`);
- **a frase**: `TEXTO_EM_PAUSA` não contém `"Emulação"`.

## O que é dela decidir

- **O texto do botão.** O contrato e o mockup escrevem "Retomar (sair da
  pausa)". Escreva assim e **marque `PROVISÓRIO — decisão dela`** no código,
  como já está o `TEXTO_EM_PAUSA` (`home_actions.py:206`).
- **Onde fica o gesto de despausar** — pergunta 3 do "falta decidir" da
  Navegação (linha 500 do redesenho) e pergunta aberta da Sistema. O mockup
  aprovado põe o botão **aqui**; esta sprint segue o mockup. Se ela mudar, o
  módulo novo já é o dono e a mudança é o local do botão, não do código.

## O que NÃO é seu

`daemon/` inteiro (o `resume` já funciona — nada a curar lá), `app/app.py` (a
fita é da 02) e `emulation_actions.py` (é da 02).
