---
sprint: VIBRACAO-POR-MOTOR-01
estado: feita
---

# VIBRACAO-POR-MOTOR-01 — as duas barras multiplicam o degrau

> **ESTADO 06/09/2026: feita** — medida no fonte e no git em 06/09 (plano das 24 horas, §1).

> **Decisão dela, 04/09/2026, tarde — e ela recusou as três opções que eu
> ofereci:** *"os slcers do botão esquerdo e direito (forte e fraco) se multiplicam (interagem com os botões economia, moderado,máximo, se eu tiver 150% do perfil de vibração e as duas linhas estiverem 100 entao a vibração dos 2 será 150%, mas se so a do motor fraco tiver 100 e a outrqa 50% então será 150 em um e 75% no outro entende?"* <!-- noqa-acento: citação literal dela -->
>
> Eu perguntei *"a barra manda o par agora, ou vira leitura?"*. A pergunta
> estava errada: **a barra não manda nada agora — ela é POLÍTICA.** Cada motor
> tem um multiplicador próprio, e ele compõe com o degrau da coluna.

## 0. A CONTA, com os números dela

```
efetivo(motor) = degrau(coluna) × barra(motor)

degrau Máximo = 150%   barra forte = 100%   barra fraca = 100%  →  150% · 150%
degrau Máximo = 150%   barra forte =  50%   barra fraca = 100%  →   75% · 150%
```

O degrau já é por controle desde 03/09 (gesto `forca`,
`interface/pacotes/a05_vibracao.py:1142`; `FORCA` em `interface/aba05.py:130`:
Economia 30% · Balanceado 100% · Máximo 150% · Auto; `custom` até 200%,
`profiles/schema.py:76`). **As barras são o segundo fator, um por motor.**

## 1. O QUE EXISTE, medido

* O multiplicador é aplicado em **um lugar**: `_game_rumble_mult`
  (`daemon/subsystems/gamepad.py:1119`), e o comentário da `:1176` diz *"mesmo
  multiplicador"* — o mesmo número vai para os dois motores. É aqui que nasce
  o segundo fator.
* O desenho já sabe que os motores são dois: o comentário de
  `interface/aba05.py:113` descreve o mockup com *"esquerdo desligado em 0,
  direito ligado em 60"*. As barras existem e são leitura —
  `SEM_DONO["barra:motor"]` (`a05_vibracao.py:64`), com a razão *"o par viaja
  junto"*. A razão continua verdadeira para `rumble.set`; **é que a barra não
  chama `rumble.set`.**
* O perfil guarda por controle `leds · triggers · rumble · speaker · mic`; o
  `rumble` de cada controle tem o degrau. Ganha `motor_forte_pct` e
  `motor_fraco_pct` (0–100, padrão 100 — que é a conta de hoje, sem mudança
  para quem não arrastar).

## 2. O TRABALHO

* **daemon:** `rumble.motores.set {uniq, forte_pct, fraco_pct}` grava no perfil
  por controle; `_game_rumble_mult` vira **par** `(mult_forte, mult_fraco)` e
  o passthrough multiplica cada motor pelo seu. O `rumble_mult_applied` do
  `state_full` publica os dois. **Testar** usa a mesma conta — o botão tem de
  sacudir o que o jogo sacudiria.
* **a05:** as duas barras ganham gesto `barra-motor` que chama o método; a
  leitura de volta pinta do `state_full`. O `SEM_DONO["barra:motor"]` morre com
  a razão datada (é decisão medida, não fato errado).
* **GTK:** herda pelo daemon — o slider global continua valendo, multiplicado.

## 3. A MORDIDA

Teste com o par dela: degrau 150% e barras (50, 100) → o passthrough tem de
escrever `(75%, 150%)` no controle; arrancar o segundo fator e ver `(150, 150)`
reprovar. Bancada: um jogo (ou `rumble.set` cru pelo `Testar`) com a barra
forte em 50% — a mão sente metade num motor e o outro inteiro.

## 4. A TELA

Foto `--oculta`; arrastar as duas barras do card do cabo; o `--prova-clique`
cobre `barra-motor` e lê o `state_full` de volta.

## Posse, para o despacho

**Toca:** `src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py` · `src/hefesto_dualsense4unix/daemon/ipc_handlers.py` · `src/hefesto_dualsense4unix/profiles/schema.py` · `src/hefesto_dualsense4unix/app/ipc_bridge.py` · `src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py` · `src/hefesto_dualsense4unix/interface/aba05.py`.

**Cria:** `tests/unit/test_cada_motor_tem_o_seu_multiplicador.py`. <!-- ref-externa: a sprint CRIA este arquivo; ele ainda não existe -->

**Bancada:** sim.
