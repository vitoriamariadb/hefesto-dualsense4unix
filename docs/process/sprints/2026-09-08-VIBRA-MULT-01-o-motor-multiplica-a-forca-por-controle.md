---
sprint: VIBRA-MULT-01
estado: aberta
posse:
  VIBRA-MULT-01:
    - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
    - src/hefesto_dualsense4unix/core/rumble.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
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

## O que existe hoje, medido em 08/09

* a aba 05 tem os gestos `forca`, `intensidade`, `motor`, `testar`, `parar`;
* a página publicada tem `motor-e-pedido`, `motor-d-pedido` e `mult`;
* `core/rumble.py` TEM o multiplicador (*"aplica multiplicador sobre weak e
  strong antes de enviar ao hardware"*), com teto do orçamento da mesa.

**As peças existem. O que NÃO foi medido é se elas se encontram** — e é isso que
ela está reportando. A hipótese a testar primeiro: o `mult` da tela e o
multiplicador do `core/rumble` são o MESMO número, ou dois números com o mesmo
nome? *Quando um valor tem dono, a régua PERGUNTA ao dono.*

## O que fazer

* **Meça antes de mudar**: ponha o motor esquerdo em 50%, a força em 150%, e
  leia o que sai no `rumble.motores.set` e o que o vpad entrega. Se o produto já
  for 75%, a multiplicação existe e o defeito é de TELA (o número exibido).
* Se não for, ligue os dois donos — e o multiplicador continua morando em
  `core/rumble.py`, que é quem o jogo atravessa.
* **A régua tem de medir o que o JOGO recebe**, não o que a tela escreve: o
  caminho é `vpad` → `rumble_sink`. Uma régua que lê a tela dá verde sobre isto.

## O que MORDE

* motor esquerdo 50% × força 150% → o vpad recebe 75%, e o direito continua no
  seu próprio produto;
* o P1 em 100% e o P2 em 50% ao mesmo tempo — cada um com o seu, e trocar um não
  mexe no outro;
* arrancar a multiplicação e a régua reprova nomeando o motor e o número.
