---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-01
posse:
  NAV-A:
    - src/hefesto_dualsense4unix/profiles/schema.py
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/daemon/subsystems/mouse.py
    - src/hefesto_dualsense4unix/daemon/subsystems/keyboard.py
cria:
  - src/hefesto_dualsense4unix/core/navegacao_ativacao.py
  - tests/unit/test_nav_ativacao_mora_no_perfil.py
bancada: false
depois_de:
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/draft_config.py
  # e src/hefesto_dualsense4unix/profiles/schema.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-GATILHOS-04
  - EMULACAO-UM-DONO-SO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/
  - src/hefesto_dualsense4unix/integrations/uinput_mouse.py
  - src/hefesto_dualsense4unix/core/keyboard_mappings.py
---

# ONDA NAVEGAÇÃO · 01 — A ativação mora no perfil

## O defeito, em uma frase

O mouse e o teclado do controle são ligados por **dois interruptores globais
com gate de modo**, o perfil tem um campo para o teclado que **nenhum caminho de
produção executa**, e o mouse guarda no perfil por outra porta — três donos para
uma pergunta só.

## O que está medido

- `daemon/subsystems/mouse.py:35` e `:70` — o mouse liga por
  `config.mouse_emulation_enabled`, um booleano global do daemon, persistido em
  `utils/session.py::save_mouse_emulation`.
- `daemon/subsystems/keyboard.py:317` — o teclado liga por
  `config.keyboard_emulation_enabled`, outro booleano global.
- `profiles/schema.py:979` `teclado_emulado` + `:1300` `resolver_teclado_emulado`
  — escritos, testados, exportados no `__all__` (`:1345`) e **sem chamador**.
  A dívida está registrada com nome e data em
  `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1199`: *"nenhum caminho
  de produção a executa"*.
- `profiles/schema.py:361` `ProfileMouseConfig` — o mouse **já** grava no perfil
  (`enabled`/`speed`/`scroll_speed`), sozinho, sem o teclado ao lado.
- `app/actions/mouse_actions.py:285` `_sync_mouse_mode_gate` — HARM-05: o
  interruptor do mouse só é sensível dentro do modo `desktop`.

## O que entrega

Um campo só, com cinco estados, dono da pergunta *"quando este controle vira
mouse e teclado?"*, exatamente os cinco do mockup
(`novo-layout/06-navegacao.html`, bloco `.ativacao`):

| valor | o que significa |
|---|---|
| `nunca` | este controle é só gamepad |
| `sempre` | enquanto este perfil estiver ativo |
| `fora_do_jogo` | quando nenhum jogo está aberto |
| `pelo_estilo` | quando o Estilo Point-and-click estiver valendo |
| `pelo_gesto` | quando o PS + R3 chegar em Teclado + Mouse |

1. `core/navegacao_ativacao.py` — o vocabulário dos cinco estados e
   `resolver_ativacao(profile, jogo_aberto, estilo_ativo, degrau_da_ponte)`,
   devolvendo `(mouse: bool, teclado: bool)`.
2. `ProfileMouseConfig` ganha `ativacao` e passa a responder **também pelo
   teclado**; `teclado_emulado` (`schema.py:979`) ganha o caminho que lhe
   faltava — é `resolver_teclado_emulado` que a nova função chama, não uma
   segunda régua.
3. Os dois subsistemas passam a perguntar ao resolvedor em vez de ler o booleano
   global. O booleano global continua existindo como **estado corrente**, não
   como fonte da decisão.
4. `draft_config.py` carrega e devolve `ativacao` no rascunho, como já faz com
   `mouse` (`:574-588`) e `key_bindings` (`:631`).

## O que NÃO entra

O dropdown na tela — é a ONDA-NAVEGACAO-06. Esta sprint entrega o backend e a
régua; a tela chega depois e não reimplementa nada.

## Como se prova (o teste que morde)

`tests/unit/test_nav_ativacao_mora_no_perfil.py`:

1. **A dívida fecha:** um perfil com `ativacao="sempre"` e `teclado_emulado=False`
   resolve teclado desligado — e o teste falha se `resolver_teclado_emulado`
   deixar de ser chamada (dublê que conta chamadas).
2. **Os cinco estados:** cinco casos, cada um com o par `(mouse, teclado)` que
   deve sair, incluindo `pelo_gesto` **sem** o degrau desktop → `(False, False)`.
3. **A régua sabe recusar:** `ativacao` fora do vocabulário reprova na validação
   do Pydantic, com a linha do campo na mensagem.
4. **A mordida:** arrancar a chamada em `subsystems/mouse.py` faz o caso
   `nunca` ligar o mouse — copiar a saída da reprovação para a entrega.

Portão que já existe e tem de continuar verde:
`tests/unit/test_toda_secao_de_perfil_tem_quem_a_aplique.py:186` (hoje cita esta
mesma ausência) e `tests/unit/test_z4_perfil_sem_modo.py`.

## O que é dela decidir

1. **O gate HARM-05 morre?** Hoje o interruptor do mouse é bloqueado fora do modo
   `desktop` porque ligar o mouse durante "Jogar pelo Hefesto" derrubava o vpad e
   os jogadores do co-op **em silêncio** (`mouse_actions.py:285`). Com a ativação
   por perfil, `sempre` significa exatamente isso. Ou o resolvedor herda a
   exclusão (e `sempre` vira "sempre que não estiver jogando"), ou ela cai e o
   perfil manda mesmo.
2. **Perfil sem opinião:** perfil antigo, sem a seção, herda o booleano global de
   hoje (compatível) ou nasce em `nunca`? O contrato "None = sem opinião" foi
   derrubado por ela em 18/08 (memória: *o perfil tem de guardar tudo*) — a
   pergunta é se a migração escreve `sempre` para quem já tinha o mouse ligado.
