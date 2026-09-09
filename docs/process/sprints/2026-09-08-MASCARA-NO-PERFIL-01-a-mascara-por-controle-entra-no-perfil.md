---
sprint: MASCARA-NO-PERFIL-01
estado: aberta
posse:
  MASCARA-NO-PERFIL-01:
    - src/hefesto_dualsense4unix/daemon/subsystems/external_mask.py
    - src/hefesto_dualsense4unix/profiles/schema.py
bancada: false
depois_de: [SOM-POR-CONTROLE-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
  - src/hefesto_dualsense4unix/interface/aba01.py
---

# MASCARA-NO-PERFIL-01 — a máscara por controle entra no perfil

**Decisão dela, 08/09/2026, à noite.** A pergunta: *a máscara por controle deve
entrar no perfil, junto com luz, gatilho, vibração, som, mic e sensores — ou
fica da máquina?* A resposta: *"pode entrar sim"*.

## §1 — O que existe hoje, medido

| | onde | por controle? | no perfil? |
| --- | --- | --- | --- |
| a máscara na tela | aba Jogar, **um chip por cartão** (`data-gesto="mascara"`, doze chips: três por assento) | sim | — |
| o gesto | `a01_jogar.mascara` → `gamepad.mask.set`, que **recebe `uniq`** | sim | — |
| onde grava | `controller_masks.json` — arquivo próprio da SESSÃO (`external_mask.py:175`; `RegistroDeMascaras.set_mask` `:320`) | sim | **não** |
| a máscara do perfil | `Profile.mode.gamepad_flavor` — **uma** por perfil | não | sim |
| quem decide o vpad | `mascara_efetiva(identity, flavor_do_jogo)` (`:617`): a do registro vence; sem registro, a do perfil | — | — |

**A consequência que ela sentiu:** trocar de perfil troca o modo e **não troca
a máscara** de nenhum controle — a máscara de cada um é a da sessão, e
sobrevive ao perfil. Um perfil de jogo que precisa do P2 em Xbox não tem como
dizer isso.

## §2 — O que esta sprint entrega

1. **`ControllerOverrides.mascara: MascaraDeGamepad | None`** no esquema
   (`schema.py:1305-1310`), ao lado de `leds`, `triggers`, `rumble`, `speaker`,
   `mic`, `sensores`. `None` = *não mexer*: perfil antigo carrega igual.
2. **A ordem de decisão fica escrita e vira uma só:** `override por controle
   no perfil` > `mode.gamepad_flavor` do perfil > o padrão. O registro de
   sessão (`controller_masks.json`) **deixa de ser dono**: ou some, ou vira
   cache do que o perfil ativo diz — e a docstring de `external_mask.py`, que
   hoje diz *"É PRÓPRIO, E NÃO É UM BUMP DO controllers.json"*, ganha a nota
   datada com a decisão.
3. **O gesto da aba Jogar não muda de forma** (`nao_toca`): o chip continua
   chamando `gamepad.mask.set` com `uniq`; o daemon passa a gravar no perfil
   ativo, como o `rumble.motores.set` já faz (`ipc_handlers.py:5207`,
   `ControllerRumbleOverride`). É a mesma estrada de gravação — não nasce uma
   segunda.
4. **Trocar a máscara derruba e recria o vpad** (medido, `schema.py`) — e
   trocar de perfil passa a poder trocar QUATRO máscaras de uma vez. A troca
   tem de ser uma por controle, na ordem dos assentos, sem repintar quem não
   mudou (é a regra da NUMA-03: não mexer no controle em uso no meio da
   partida).

## Critério de pronto — por cabo · por BT · no perfil · por controle

| | |
| --- | --- |
| **cabo / BT** | a máscara é do vpad e vale igual nos dois; pronto = P2 no cabo em Xbox e P4 no rádio em DualSense, no mesmo perfil |
| **no perfil** | ✓ é a entrega: `controllers{uniq}.mascara` |
| **por controle** | ✓; pronto = ativar um perfil com máscaras diferentes por assento e os quatro vpads nascerem certos, e o chip de cada cartão dizer o que o perfil diz |

## O que MORDE

* gravar `mascara=xbox` no P2 do perfil, ativar → o vpad do P2 é `045e:028e` e
  o do P1 continua `054c:0df2`; trocar de perfil → os quatro seguem o perfil
  novo;
* arrancar o campo do esquema → a régua reprova nomeando o assento cuja
  máscara ficou da sessão;
* `controller_masks.json` não decide mais nada: apagá-lo não muda vpad nenhum.
