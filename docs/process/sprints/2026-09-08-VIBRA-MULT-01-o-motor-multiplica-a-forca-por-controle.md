---
sprint: VIBRA-MULT-01
estado: aberta
posse:
  VIBRA-MULT-01:
    - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
    - src/hefesto_dualsense4unix/core/rumble.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/interface/aba05.py
bancada: false
depois_de: []
---

# O motor multiplica a força, por controle, e o jogo respeita

## A palavra dela

> *"na guia vibração os slicers não estão se multiplicando: motor esquerdo ×
> força de vibração (ou personalizado), motor direito × força de vibração ou
> personalizado, pra cada controle — e funcionar dentro do jogo respeitando
> isso."*

São **TRÊS exigências**, e cada uma se mede num lugar:

1. **A multiplicação existe** — `motor_e × forca` e `motor_d × forca`;
2. **É POR CONTROLE** — cada um com o seu par de motores e a sua força;
3. **CHEGA AO JOGO** — o que o jogo sente é o produto, não o motor cru.

## O que existe hoje, medido em 08/09 (à noite, lendo o dono de cada peça)

**A conta EXISTE, e é a que ela descreve** — decisão dela de 04/09
(`VIBRACAO-POR-MOTOR-01`): `efetivo(motor) = degrau(coluna) × barra(motor)`. Ela
mora em `daemon/subsystems/gamepad._mults_por_motor` e é aplicada em
`:1347`, no MESMO caminho por onde passa o rumble do JOGO — a docstring de
`:1321` diz com todas as letras: *"a política global de intensidade é aplicada
AQUI — o slider vale também para o rumble do jogo"*, e *"`weak` e `strong`
podem sair com fatores diferentes do MESMO controle: `degrau 150 · fraca 100 ·
forte 50 → 150 % e 75 %`"*. Há teste de unidade que prova a CONTA.

As peças, com dono:

| peça | dono | por controle? |
| --- | --- | --- |
| o degrau (Economia · Balanceado · Máximo · personalizado) | gestos `forca` e `intensidade` da 05 → `_aplicar_a_forca(uniq, degrau)` | sim — o gesto RECUSA sem `uniq` |
| a barra de cada motor | gesto `motor` → `rumble.motores.set` → `ControllerRumbleOverride` no **perfil**, por `uniq` (`ipc_handlers.py:5207`) | sim |
| o teto do orçamento | `core/rumble.forca_do_global` / `_sob_o_teto` — `min`, **nunca** produto | global |
| o que a tela mostra | `data-campo="mult"`, `mult-teto`, `motor-e-pedido`, `motor-d-pedido`, `barra-e/d-pct` | — |

**O que NUNCA foi medido, e é onde a queixa dela pode morar:**

1. **A premissa física.** `scripts/ensaios/o_multiplicador_chega_ao_motor.py`
   existe para isso — o par assimétrico sentido na MÃO dela, pelo `rumble.set`
   do daemon vivo — e **não tem uma linha no `docs/data/ensaios.csv`**. Se o
   firmware iguala os dois motores por baixo, a barra é um número bonito sobre
   um aparelho que não a cumpre, e nenhuma régua verde teria visto.
2. **O número da tela.** O `mult` que a página mostra é o degrau, o produto,
   ou o teto? *Quando um valor tem dono, a régua PERGUNTA ao dono* — o dono é
   `_mults_por_motor`, e a tela tem de mostrar o que ELE devolve.
3. **A barra do controle certo.** A barra grava no perfil por `uniq`. Se ela
   arrastou a barra da coluna do P2 e o teste (`testar`, que mira `_mirar`)
   tremeu o P1, a conta está certa e o alvo não.

## O que fazer

* **Meça antes de mudar, na ordem do custo:** (a) o ensaio da premissa
  física, com a mão dela — 5 passos, controle positivo e negativo, e a linha
  vai para o caderno; (b) ponha o motor esquerdo em 50 % e o degrau em 150 %
  e leia `_mults_por_motor` para aquele `uniq` — tem de dar 0,75; (c) leia o
  `mult` da página no mesmo tique.
* Se (a) falhar, a sprint muda de natureza: é decisão dela sobre uma barra que
  o aparelho não cumpre. Se (b) falhar, a conta não está ligada ao gesto. Se
  só (c) falhar, o defeito é de TELA.
* **A régua tem de medir o que o JOGO recebe**, não o que a tela escreve: o
  caminho é o FF do vpad → `rumble_sink` → `gamepad.py:1347`. Uma régua que lê
  a tela dá verde sobre isto.

## O que MORDE

* motor esquerdo 50% × força 150% → o vpad recebe 75%, e o direito continua no
  seu próprio produto;
* o P1 em 100% e o P2 em 50% ao mesmo tempo — cada um com o seu, e trocar um não
  mexe no outro;
* arrancar a multiplicação e a régua reprova nomeando o motor e o número.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo / BT | ✓ o rumble obedeceu nos dois em 15/08 (`vibracao.rumble.*@dualsense`); pronto = o PRODUTO degrau × barra medido nos dois transportes, e não só no cabo |
| no perfil | ✓ `rumble` (global) + `ControllerRumbleOverride` (`motor_forte_pct`, `motor_fraco_pct`, `policy`, `custom_mult`) |
| por controle | ✓ o gesto RECUSA sem `uniq`; pronto = P1 em 100 % e P2 em 50 % ao mesmo tempo, e trocar um não mexe no outro |
