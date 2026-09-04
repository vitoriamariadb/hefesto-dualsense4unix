---
sprint: ONDA1-D1-O-SOM-01
posse:
  D1:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - src/hefesto_dualsense4unix/app/audio_saida.py
cria:
  - tests/unit/test_o_microfone_e_um_estado_so.py
  - tests/unit/test_a_rota_do_som_le_as_duas_camadas.py
  - scripts/ensaios/a_rota_do_som_vai_e_volta.py
bancada: true
depois_de: [A-TRAVA-DO-LED-NAO-SOLTA-01, LEVA-3, LEVA-DE-BACKGROUND-01, MIGRA-CONTROLES-09, MIGRA-ILUMINACAO-11, MIGRA-JOGAR-10, MIGRA-NAVEGACAO-07, MIGRA-NAVEGACAO-09, MIGRA-SISTEMA-09, MIGRA-VIBRACAO-04, MIGRA-VIBRACAO-05, MIGRA-VIBRACAO-06, O-ALTO-FALANTE-VIRTUAL-01, ONDA-CONTROLES-07, ONDA-CONTROLES-08, ONDA-JOGAR-05, ONDA-LANCADORES-06, ONDA-NAVEGACAO-03, ONDA-PERFIS-03, ONDA-SISTEMA-07, ONDA-VIBRACAO-04, ONDA-VIBRACAO-05, ONDA-VIBRACAO-06, TROCA-DE-PLAYER-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
  - src/hefesto_dualsense4unix/daemon/sensor_hub.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - docs/data/paridade-gtk-html.csv
---

# ONDA1-D1 · O SOM — o microfone é um ato só, e o alto-falante tem dois canais

**Você é dono de `daemon/ipc_handlers.py` nesta onda.** Duas frentes de motor
esperam a sua para começar (a vibração e o sensor), porque as três escreveriam
no mesmo arquivo. Não estenda o escopo: **o que é seu é o SOM.**

**Leia antes de tocar em código:** as duas sprints que esta frente materializa —
[MICROFONE-UM-ATO-01](2026-09-04-MICROFONE-UM-ATO-01-o-botao-fisico-e-o-da-tela-sao-o-mesmo-estado.md)
e
[ALTO-FALANTE-DOIS-CANAIS-01](2026-09-04-ALTO-FALANTE-DOIS-CANAIS-01-sons-do-jogo-e-todo-o-som-do-pc-em-qualquer-modo.md)
— e a linha do seu canal em `docs/data/mapa-controles.csv`, **antes** de
afirmar que algo funciona num transporte. É portão, não documentação.

---

## 1. O CONCEITO DELA, e ele derrubou a minha pergunta

Eu levei o microfone a ela como *"duas camadas se contradizem"* e ofereci três
arranjos que **guardavam** a contradição. Ela recusou os três:

> *"tá errado o conceito da coisa. o botão é pra ligar o microfone e ele ser
> ouvido no canal específico dele."*

E ao meio-dia acrescentou duas regras, com todas as letras:

> *"o botão fisico do mic se ligado no microfone ele fica ligado tambem. <!-- noqa-acento: citação literal dela -->
> indepente se nativo ou virtual"* <!-- noqa-acento: citação literal dela -->

**NÃO SÃO DUAS CAMADAS COM DUAS VERDADES. É UM ATO SÓ**, e ele só está feito
quando as duas metades estão feitas.

**A LIÇÃO QUE ISSO DEIXA, e ela é a sua régua de escopo:** quando a opção
barata guarda a contradição, a opção barata está errada. Não a reintroduza.

## 2. O TRABALHO — o microfone

* **`ipc_handlers.py`:** um método `mic.canal.set {uniq, ligado}` que é o ATO
  inteiro — o mudo do firmware **e** a fonte de captura daquele controle eleita
  e não-muda no PipeWire. `state_full.audio.mic` ganha `canal_ativo`,
  `canal_mudo` e `volume_captura`.
* **`hotkey.py`:** o botão do plástico chama **a mesma função**, por nome. Uma
  função, dois chamadores — e a régua confere isso arrancando o chamador.
* **Independente do modo.** O ato não consulta `native_mode` nem
  `gamepad_emulation_enabled`. **A primeira medição da sprint é esta:** aperte
  o botão do plástico em NATIVO e leia o `state_full`. Se o `hotkey` não vê o
  botão nesse modo, essa é a primeira cura, antes de qualquer método novo.
* **`ipc_bridge.py`:** `mic_set_detalhado` passa a ser o ato, e a frase de
  recusa **diz qual das duas metades faltou** — é o caso que a S-01 do piloto
  vai carregar ao cartão.

**O que já está medido e não se remexe:** `mic.volume.set` mexe no ganho da
FONTE no PipeWire e **não** toca o firmware, não tira o botão físico e não
apaga luz nenhuma. A docstring diz por quê: *"somar os dois num método só faria
a interface prometer uma coisa e entregar outra."* Ele já está na camada certa.

## 3. O TRABALHO — o alto-falante

**Decisão dela, 04/09 ao meio-dia:** *"sons do pc e sons do jogo. veja como
fizemos no gtk."*

Os dois canais da janela antiga, **em qualquer modo**. O que a sprint pede:
a leitura das duas camadas (o que o PipeWire diz e o que o firmware diz) e o
ensaio `a_rota_do_som_vai_e_volta.py`, que **vai e volta** — escreve a rota,
lê de volta, e prova que a leitura acompanha a escrita.

**O selo "Saída muda" e o "acordado/dormindo" são LIGAR**, não motor: o dado
existe nos dois lados. Entregue a leitura; quem a põe na tela é a frente da
aba 02, na Onda 2.

## 4. O QUE VOCÊ **NÃO** FAZ

A metade de TELA das duas sprints é da aba 02 (`a02_controles.py`, `aba02.py`)
e do piloto (`hefesto_vivo.py`), e os dois são de outras frentes. **Relate o
que a tela precisa passar a ler — não edite aqueles arquivos.** É a R1 desta
casa, e ela nasceu de quatro colisões não declaradas num dia só.

Duas decisões do PO dependem do que você entregar, e vale escrevê-las na
entrega para a Onda 2 não redecidir:

* o selo do microfone passa a dizer o **estado composto** (conflito C-2): ATIVO
  só quando as quatro faces concordam — o botão da tela, o do plástico, a luz
  vermelha e a fonte no PipeWire;
* o botão do alto-falante **acende por leitura**, e o campo invisível
  `alto-estado` sai do desenho.

---

## A MORDIDA

* **arranque o chamador do `hotkey.py`** e veja a régua reprovar: o botão
  físico e o handler têm de apontar para a mesma função, por nome;
* **injete `native_mode=True`** e prove que o ato não muda de caminho;
* **arranque a leitura do PipeWire** e veja o selo composto virar verde falso —
  é o verde de 29/08 de novo, e é ele que a régua existe para pegar.

**O dublê tem de ser tão estrito quanto a ponte real.** Em 04/09 a máscara
**nunca gravou um byte** e a régua passou verde: o dicionário ia como `timeout`
posicional, e o dublê do teste era mais frouxo que a ponte. Confira a
ASSINATURA que você chama, não só o nome.

## A BANCADA — e ela é dela

`bancada: true`, e você é **quem escreve no aparelho** nesta leva. Antes de
qualquer caminho que pare o daemon, escreva no hidraw ou chame `systemctl`:

    bash scripts/bancada.sh exigir

`rc=1` significa **esperar e dizer na entrega que está esperando** — nunca
contornar por outro caminho, que é como se inventa medição falsa.

A prova pede **os dois transportes e os dois modos**: apertar o plástico →
`state_full` + `pactl get-default-source` no mesmo segundo.

**E uma armadilha de leitura, medida em 04/09:** os readers do `SensorHub`
nascem sob demanda e morrem 5 s depois do último pedido. Medir com UMA amostra
devolve ausência sempre. Deixe o tique correr ~1 s antes de perguntar — vale
para toda leitura sob demanda deste daemon, não só a do sensor.
