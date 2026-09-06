---
sprint: ONDA-VIBRACAO-05
estado: absorvida
# onda: ABA-VIBRACAO
posse:
  V5:
    - src/hefesto_dualsense4unix/profiles/schema.py
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/daemon/subsystems/rumble.py
cria:
  - tests/unit/test_o_lado_desligado_nao_treme.py
  - tests/unit/test_o_lado_do_motor_nao_se_inverte.py
bancada: true
depois_de:
  - ONDA-VIBRACAO-04
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/rumble_actions.py
  # e src/hefesto_dualsense4unix/profiles/schema.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-03
  - EMULACAO-UM-DONO-SO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
  - JOGADOR-3-FANTASMA-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-3  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/core/rumble.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 05). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA VIBRAÇÃO · 05 — os dois motores ligam e desligam por lado

**O defeito em uma frase:** ela pediu dois interruptores que **ativam cada lado
durante o jogo**, e o produto não tem onde guardar essa escolha nem quem a
aplique — as duas barras de motor de hoje só servem para travar um valor fixo.

Palavra dela (`/tmp/coleta/hoje.md:273`):

> *"Motor Esquerdo e direito. Motor Esquerdo e Direito **são área pra ativar na
> vibração durante o jogo**, só me confirma se forte é só pro esquerdo ou só pro
> direito pq acho que não é assim que funciona na real tem o leve e o forte pra
> ambos."*

E a legenda do mockup aprovado responde a pergunta dela:

> *"Motor esquerdo e direito são o que **ATIVA** o lado durante o jogo — os dois
> pinos laranja, e o desenho mostra qual punho treme."*

## O fato que esta sprint não pode inverter

**Não existe "leve" e "forte" para cada motor.** Existem **dois motores**, um em
cada punho, e cada um recebe **um** valor de 0 a 255. Medido nesta casa e na
canônica (`docs/protocol/dualsense-referencia-canonica.md:303-315`): com o daemon
parado, um `EV_FF` ligou o **esquerdo**; o report seguinte pediu
`common[2] = 200` (direito) e `common[3] = 0` (esquerdo), e **o tremor trocou de
lado**. Palavra dela na medição: *"esquerda e senti que foi pra direita e lá
morreu"*.

No código do produto o par é `weak` / `strong`:

| campo | `common[]` | punho | apelido velho |
|---|---|---|---|
| `weak` | `common[2]` | **direito** | "vibração leve" |
| `strong` | `common[3]` | **esquerdo** | "vibração forte" |

Os apelidos "leve" e "forte" descrevem o **som** (contrapeso maior à esquerda),
não uma intensidade escolhível. É por isso que a aba deixa de usá-los
(ONDA-VIBRACAO-02).

## O que esta sprint entrega

1. **Dois campos novos, com o padrão LIGADO**, em `RumbleConfig`,
   `ControllerRumbleOverride` e `RumbleDraft`:
   `motor_esquerdo: bool = True` e `motor_direito: bool = True`.
   Aditivos e retrocompatíveis, como o `policy` foi
   (`FEAT-RUMBLE-POLICY-PROFILE-01`) — perfil antigo continua válido e nasce com
   os dois ligados. **Nascer ligado é regra dela**: nada que ela não desligou
   nasce desligado (D-AUDIO-E-GIRO-NASCEM-LIGADOS, pelo mesmo princípio).
2. **A porteira mora onde o valor sai**, e em **um** lugar por rota:
   - `apply_game_rumble` (`gamepad.py:1199-1201`), depois do multiplicador:
     lado desligado vira **0**, o outro segue;
   - `escrever_rumble_no_dono` (`subsystems/rumble.py:134`), para o par fixado
     pela GUI não escapar pela outra porta.
3. **`rumble.lados`** no IPC (`uniq` opcional, mesmo contrato de endereço da
   ONDA-VIBRACAO-04), e `rumble_lados()` no `ipc_bridge`.
4. **Os dois `GtkToggleButton` da aba** (criados inertes na ONDA-VIBRACAO-02)
   passam a gravar no rascunho e a mandar na hora — D-CLICAR-NO-MODO-JA-APLICA,
   com a palavra dela: *"cliquei lá ou usei a fita de seleção do meu player, o
   negócio já aplica"*.
5. **A barra de cada lado continua sendo TESTE**, e a dica do mockup diz isso com
   todas as letras: *"As barras abaixo testam cada motor: o valor vale enquanto
   você segura o Travar nesta vibração."* Desligar o lado **não** zera a barra:
   são duas coisas diferentes na mesma linha.

## Como se prova (os testes que MORDEM)

`tests/unit/test_o_lado_desligado_nao_treme.py`
- `motor_esquerdo=False`, o jogo pede `weak=40, strong=180`: o controle recebe
  **(40, 0)**. **Arranque:** tire a porteira do `apply_game_rumble` e veja
  chegar (40, 180).
- Com os dois ligados nada muda em nenhum valor — a porteira é invisível quando
  não morde.
- O par **fixado** pela GUI passa pela mesma porteira: `rumble.set(40, 180)` com
  o esquerdo desligado escreve (40, 0). Arranque na outra rota, e veja reprovar
  só ela: **cada porteira precisa da sua régua** (PORTOES-EM-SERIE-ENGANAM).
- Perfil v1 **sem** os campos carrega e sai com os dois `True`.

`tests/unit/test_o_lado_do_motor_nao_se_inverte.py` — o portão contra a
inversão, que é o erro que este assunto convida:
- desligar o **esquerdo** zera `strong` (`common[3]`), nunca `weak`;
- desligar o **direito** zera `weak` (`common[2]`), nunca `strong`;
- a régua cita a canônica pela linha, e reprova se alguém trocar o par.
  **Arranque:** troque os dois e veja reprovar nos dois sentidos.

**Bancada:** a prova final é o punho dela. Um lado desligado, o jogo pedindo os
dois, e ela dizendo qual tremeu. `scripts/bancada.sh exigir` antes.

## O que é dela decidir

1. **O lado desligado vale por peça ou pela mesa?** Os campos nascem nos dois
   lugares; quem manda é a fita. Confirma que é por peça, como a força passou a
   ser?
2. **Desligar um lado é vibração, ou é acessibilidade?** Se for a segunda, ela
   quer o mesmo interruptor também no Estilo de Jogo — e aí entra na tabela dos
   catorze (D-CATORZE-ESTILOS-DE-FABRICA), que é outra onda.
