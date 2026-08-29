---
sprint: MIGRA-VIBRACAO-06
onda: MIGRA-VIBRACAO
posse:
  MV6:
    - src/hefesto_dualsense4unix/profiles/schema.py
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/daemon/subsystems/rumble.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - src/hefesto_dualsense4unix/app/telas/vibracao.py
cria:
  - tests/unit/test_migra_vibracao_06_o_lado_desligado_nao_treme.py
  - tests/unit/test_migra_vibracao_06_o_lado_do_motor_nao_se_inverte.py
bancada: true
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-VIBRACAO-01
  - MIGRA-VIBRACAO-03
  - MIGRA-VIBRACAO-04
  - MIGRA-VIBRACAO-05
  # A SPRINT QUE ESTA SUBSTITUI — o fato medido dela sobrevive inteiro
  - ONDA-VIBRACAO-05
  # SÉRIE por R5 — donos declarados dos mesmos arquivos, medido em 29/08
  - LEVA-1
  - LEVA-3
  - LEVA-DE-BACKGROUND-01
  - EMULACAO-UM-DONO-SO-01
  - JOGADOR-3-FANTASMA-01
  - ONDA-CONEXOES-10
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
  - ONDA-JOGAR-05
  - ONDA-LANCADORES-06
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  - ONDA-NAVEGACAO-05
  - ONDA-PERFIS-03
  - ONDA-PERFIS-09
  - ONDA-SISTEMA-07
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-04
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
  - src/hefesto_dualsense4unix/core/backend_pydualsense.py
  - src/hefesto_dualsense4unix/core/rumble.py
  - novo-layout/
---

# MIGRA VIBRAÇÃO · 06 — os oito interruptores de lado, que não existem em linha nenhuma

**O defeito em uma frase:** a página tem **oito** interruptores de motor e o
produto tem **zero** — nem campo, nem IPC, nem widget.

Medido agora: `grep -rn "lado_desligado\|motor_esquerdo\|motor_direito\|
side_enabled\|weak_enabled" src/` devolve **0**. `RumbleConfig`
(`profiles/schema.py:315`) tem `passthrough`, `policy` e `custom_mult`;
`ControllerRumbleOverride` (`:762`) tem `policy` e `custom_mult`, com
`extra="forbid"`.

Palavra dela (a pergunta que abriu o assunto):

> *"Motor Esquerdo e Direito **são área pra ativar na vibração durante o
> jogo**, só me confirma se forte é só pro esquerdo ou só pro direito pq acho
> que não é assim que funciona na real tem o leve e o forte pra ambos."*

E a legenda do mockup aprovado responde:

> *"Motor esquerdo e direito são o que **ATIVA** o lado durante o jogo — os dois
> pinos laranja, e o desenho mostra qual punho treme."*

## O fato que esta sprint não pode inverter

**Não existe "leve" e "forte" para cada motor.** Existem **dois motores**, um em
cada punho, e cada um recebe **um** valor de 0 a 255. Medido nesta casa
(`docs/protocol/dualsense-referencia-canonica.md:303-318`): com o daemon parado,
um `EV_FF` ligou o **esquerdo**; o report seguinte pediu `common[2] = 200`
(direito) e `common[3] = 0` (esquerdo), e **o tremor trocou de lado**. Palavra
dela na medição: *"esquerda e senti que foi pra direita e lá morreu"*.

| campo | `common[]` | punho | e no produto |
|---|---|---|---|
| `weak` | `common[2]` | **direito** | `handle.setRightMotor(eff_weak)` — `backend_pydualsense.py:4788` |
| `strong` | `common[3]` | **esquerdo** | `handle.setLeftMotor(eff_strong)` — `backend_pydualsense.py:4787` |

Os apelidos "leve" e "forte" descrevem o **som** (contrapeso maior à esquerda),
não uma intensidade escolhível — e é por isso que a página deixou de usá-los.

## O que entrega

1. **Dois campos, com o padrão LIGADO**, em `RumbleConfig`,
   `ControllerRumbleOverride` e `RumbleDraft` (`app/draft_config.py:105`):
   `motor_esquerdo: bool = True`, `motor_direito: bool = True`. Aditivos e
   retrocompatíveis — perfil antigo continua válido e nasce com os dois ligados.
   **Nascer ligado é regra dela** (`D-AUDIO-E-GIRO-NASCEM-LIGADOS`): nada que
   ela não desligou nasce desligado.
2. **A porteira mora onde o valor sai, e em UM lugar por rota:**
   * `apply_game_rumble` (`daemon/subsystems/gamepad.py:1151`), **depois** do
     multiplicador (`:1199`): lado desligado vira **0**, o outro segue;
   * `escrever_rumble_no_dono` (`daemon/subsystems/rumble.py:134`), para o par
     fixado pela GUI não escapar pela outra porta.
3. **`rumble.lados` no IPC**, com `uniq` opcional — o mesmo contrato de endereço
   da **04** e da **05** —, e `rumble_lados()` no `ipc_bridge`.
4. **Os oito botões da página gravam no rascunho e mandam na hora** —
   `D-CLICAR-NO-MODO-JA-APLICA`, com a palavra dela: *"cliquei lá ou usei a
   fita de seleção do meu player, o negócio já aplica"*.
5. **A barra de cada lado continua sendo TESTE**, e a dica do mockup diz isso
   com todas as letras: *"A barra ao lado diz com que força esse motor entra no
   Testar por 500 ms, de 0 a 255."* **Desligar o lado não zera a barra** — são
   duas coisas na mesma linha, e o desenho já as separou (o interruptor à
   esquerda do trilho).

## O chão rachado que esta sprint declara e NÃO conserta

`docs/data/mapa-controles.csv`, `vibracao.rumble.habilitar@dualsense`:
`cabo_aciona = parcial`, `radio_aciona = parcial`, com a causa escrita —

> *"dos quatro bits, o produto só LIGA três. O `VALID_FLAG2_COMPATIBLE_VIBRATION2`
> (flag2 `0x04`) nunca sobe."*

Conferido hoje: `core/backend_pydualsense.py:1200` só sabe **desligar**
(`flag2 &= ~rep.VALID_FLAG2_COMPATIBLE_VIBRATION2`); o vpad **LÊ** o bit v2 do
jogo (`integrations/uhid_gamepad.py:775`, `:2137`) e **ninguém o LIGA** no report
que vai ao controle. É *a casa sabe e o produto não faz*, mora **fora** desta
aba, e é sprint de outra frente — mas é o chão em que os oito interruptores vão
pisar, e quem executar precisa saber que ele não está firme.

## Como se prova (a mordida)

`tests/unit/test_migra_vibracao_06_o_lado_desligado_nao_treme.py`

- **`motor_esquerdo=False`, o jogo pede `weak=40, strong=180`: o controle recebe
  (40, 0).** *Arranque:* tire a porteira do `apply_game_rumble` e veja chegar
  (40, 180).
- **Com os dois ligados, nada muda em valor nenhum** — a porteira é invisível
  quando não morde.
- **O par FIXADO pela GUI passa pela mesma porteira**: `rumble.set(40, 180)` com
  o esquerdo desligado escreve (40, 0). *Arranque na outra rota*, e veja
  reprovar **só ela**: **cada porteira precisa da sua régua**
  (`PORTOES-EM-SERIE-ENGANAM` — consertar uma deixa o sintoma idêntico).
- **Perfil v1 sem os campos carrega e sai com os dois `True`.**
- **Por peça:** P1 com o esquerdo desligado e P2 inteiro; o jogo pede os dois
  para os dois. P1 recebe (40, 0) e P2 recebe (40, 180). *Arranque:* aplique o
  campo global aos dois e veja reprovar.

`tests/unit/test_migra_vibracao_06_o_lado_do_motor_nao_se_inverte.py` — **o
portão contra a inversão, que é o erro que este assunto convida**

- desligar o **esquerdo** zera `strong` (`common[3]`), nunca `weak`;
- desligar o **direito** zera `weak` (`common[2]`), nunca `strong`;
- a régua **LÊ** o par no produto (`setLeftMotor(eff_strong)` /
  `setRightMotor(eff_weak)`, `backend_pydualsense.py:4787-4788`) e cita a
  canônica pela linha. *Arranque:* troque os dois e veja reprovar **nos dois
  sentidos**.

**Bancada:** a prova final é o punho dela. Um lado desligado, o jogo pedindo os
dois, e ela dizendo qual tremeu. `scripts/bancada.sh exigir` antes.

## O que é dela decidir

1. **O lado desligado vale por peça ou pela mesa?** Os campos nascem nos dois
   lugares; nesta aba quem endereça é a **coluna**. Confirma que é por peça,
   como a força passou a ser?
2. **Desligar um lado é vibração, ou é acessibilidade?** A dica da própria aba
   diz *"serve para quem sente enjoo com o motor pesado"*. Se for a segunda,
   **tem de valer para o jogo** (é o que esta sprint entrega) e ela vai querer o
   mesmo interruptor no Estilo de Jogo — e aí entra na tabela dos catorze
   (`D-CATORZE-ESTILOS-DE-FABRICA`), que é outra onda. Se for só bancada, é
   gesto de tela e custa um terço.
