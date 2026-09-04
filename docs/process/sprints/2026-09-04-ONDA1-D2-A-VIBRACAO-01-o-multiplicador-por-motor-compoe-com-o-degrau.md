---
sprint: ONDA1-D2-A-VIBRACAO-01
posse:
  D2:
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/profiles/schema.py
cria:
  - tests/unit/test_cada_motor_tem_o_seu_multiplicador.py
  - scripts/ensaios/o_multiplicador_chega_ao_motor.py
bancada: true
depois_de: [EMULACAO-UM-DONO-SO-01, JOGADOR-3-FANTASMA-01, LEVA-1, MIGRA-GATILHOS-09, MIGRA-JOGAR-10, MIGRA-VIBRACAO-04, MIGRA-VIBRACAO-05, MIGRA-VIBRACAO-06, ONDA-CONEXOES-10, ONDA-CONTROLES-06, ONDA-CONTROLES-07, ONDA-GATILHOS-04, ONDA-NAVEGACAO-01, ONDA-NAVEGACAO-04, ONDA-NAVEGACAO-05, ONDA-PERFIS-09, ONDA-VIBRACAO-03, ONDA-VIBRACAO-04, ONDA-VIBRACAO-05, ONDA1-D1-O-SOM-01, QUEM-E-QUEM-01, QUEM-E-QUEM-04]
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
  - src/hefesto_dualsense4unix/interface/aba05.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
  - src/hefesto_dualsense4unix/daemon/sensor_hub.py
  - src/hefesto_dualsense4unix/app/audio_saida.py
  - docs/data/paridade-gtk-html.csv
---

# ONDA1-D2 · A VIBRAÇÃO — o multiplicador por motor compõe com o degrau

**Espera a `ONDA1-D1-O-SOM-01` fechar.** As duas escrevem no mesmo
`daemon/ipc_handlers.py` e no mesmo `app/ipc_bridge.py`; serializar é decisão,
não descuido. **Quando você começar, `ipc_handlers.py` e `ipc_bridge.py`
passam a ser seus** — quem despachou confirma isso no preâmbulo.

A sprint que esta materializa é
[VIBRACAO-POR-MOTOR-01](2026-09-04-VIBRACAO-POR-MOTOR-01-as-duas-barras-multiplicam-o-degrau.md).

---

## 1. O CONCEITO É DELA, E ELE VEIO FORA DAS MINHAS OPÇÕES

Eu perguntei se cada barra de motor deveria **mandar o par** `rumble.set`, ou
virar leitura. Ofereci três caminhos. Ela recusou os três e escreveu outra
coisa:

> *"os slcers do botão esquerdo e direito (forte e fraco) se multiplicam <!-- noqa-acento: citação literal dela -->
> (interagem com os botões economia, moderado, máximo, se eu tiver 150% do
> perfil de vibração e as duas linhas estiverem 100 entao a vibração dos 2 será <!-- noqa-acento: citação literal dela -->
> 150%, mas se so a do motor fraco tiver 100 e a outrqa 50% então será 150 em um <!-- noqa-acento: citação literal dela -->
> e 75% no outro entende?"*

**A barra não é um comando. É POLÍTICA.** Um multiplicador por motor que
**compõe** com o degrau, e a conta é a que ela escreveu:

```
efetivo(motor) = degrau × barra(motor)

degrau 150%, fraca 100%, forte 100%  ->  150% e 150%
degrau 150%, fraca 100%, forte  50%  ->  150% e  75%
```

**A pergunta estava errada, e é a terceira vez num dia.** Eu construí uma
escolha entre "manda agora" e "vira leitura" sobre uma peça que não é comando
nem leitura — é ajuste persistente. **A lição, e ela vale para o seu escopo:**
quando ela recusa todas as opções que você ofereceu, a hipótese certa não é que
falta uma quarta — é que a pergunta está errada.

## 2. O TRABALHO

* **`profiles/schema.py`:** o multiplicador por motor entra no perfil, por
  controle. Dois números, e eles têm dono e vida — não são estado de sessão.
* **`daemon/subsystems/gamepad.py`:** a conta acontece **onde o par já é
  montado**, no caminho que já aplica o degrau. Um lugar só; se a multiplicação
  aparecer em dois, um dos dois vai envelhecer sozinho.
* **`ipc_handlers.py` / `ipc_bridge.py`:** o método que grava, e o
  `state_full` publicando os dois números **de volta** — sem isso a tela desenha
  a barra onde ela estava, não onde ela está.

**O que NÃO muda:** `rumble.set {weak, strong}` continua sendo o comando de
tremer agora. A barra não o chama. São camadas diferentes, e somá-las faria a
interface prometer uma coisa e entregar outra — que é a mesma razão pela qual
`mic.set` e `mic.volume.set` são dois métodos.

## 3. O QUE VOCÊ **NÃO** FAZ

A metade de TELA é da aba 05 (`interface/pacotes/a05_vibracao.py`,
`interface/aba05.py`), e ela é de outra frente. **Relate o que a tela precisa
ler e escrever — não edite aqueles arquivos.**

Escreva no relatório, para a Onda 2 não redecidir: a aba 05 recebe também a
**linha de estado por coluna** (D-14, três estados) e o **recado de sucesso no
cartão** (D-01) — as duas já decididas, e nenhuma delas é sua.

---

## A MORDIDA

* **arranque a multiplicação** e veja a régua reprovar sobre o caso dela:
  `degrau 150 · fraca 100 · forte 50` tem de sair `150 e 75`, e sem a cura sai
  `150 e 150`;
* **arranque a publicação no `state_full`** e veja a barra voltar ao valor
  velho depois de um tique;
* **prove no aparelho** que o motor fraco e o forte tremem diferente com as
  barras diferentes — o número na tela não é prova, o plástico é.

**Quando o instrumento e o aparelho discordam, o aparelho ganha.** Em 04/09, na
Iluminação, o daemon respondia `aplicado_em` **com as lâmpadas paradas**: o
co-op ficava acima do override no merge. Uma cura óbvia pode não curar, e só o
aparelho diz.

## A BANCADA — e ela é dela

    bash scripts/bancada.sh exigir

`rc=1` significa **esperar e dizer na entrega que está esperando**. Se for
demorar, reserve com `--horas`.

**E cuidado com o teto da mesa:** existe um teto de vibração por controle
(`08-conexoes`), e ele é ganho da interface nova sobre a antiga. A sua conta
tem de compor com ele sem apagá-lo — meça os dois juntos antes de afirmar.
