---
sprint: MIC-VIRTUAL-02
estado: aberta
decisoes: [D-0609-MIC-RADIO-ENTRA]
posse:
  MIC2:
    - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
    - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
    - src/hefesto_dualsense4unix/integrations/eleicao_de_microfone.py
    - src/hefesto_dualsense4unix/integrations/audio_control.py
    - tests/unit/test_o_microfone_pelo_radio_alimenta_o_no.py
depois_de: [ONDA5-MIC-VIRTUAL-01, ONDA5-02-01]
nao_toca:
  - src/hefesto_dualsense4unix/integrations/fontes_de_captura.py
  - src/hefesto_dualsense4unix/integrations/quem_ouve_o_microfone.py
  - src/hefesto_dualsense4unix/integrations/canal_do_microfone.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - install.sh
  - packaging/
---

# MIC-VIRTUAL-02 · O microfone pelo rádio, e a tela que conta quatro

> **A decisão dela, 06/09/2026** (`D-0609-MIC-RADIO-ENTRA`): **o microfone pelo
> rádio ENTRA nas 24 horas**, com **prova em dois controles antes de trocar os
> chamadores**.
>
> **E o ato é UM**, palavra dela de 04/09: *"o botão é pra ligar o microfone e
> ele ser ouvido no canal específico dele"* — ela recusou os três arranjos que
> guardavam a contradição entre as camadas. **Não são dois passos na tela.**

**O corte com a sprint anterior está escrito**: `ONDA5-MIC-VIRTUAL-01` §3, e o
contrato em `2026-09-03-CANAL-POR-CONTROLE-01`. Esta sprint é a metade do
**rádio**; a do **cabo** fecha antes, na onda A.

---

## 1. O QUE ESTA SPRINT FECHA — quatro peças

### 1.1 O rádio alimenta o nó `hefesto_mic_<hex6>`

O que a `ONDA5-MIC-VIRTUAL-01` fez pelo cabo, aqui pelo rádio.

**O `<hex6>` vem de endereço.** Nada de MAC real em arquivo versionado — nem em
teste, nem em relatório, nem em nome de fixture. Máscara da casa: **octetos 4 e
5 zerados**, ou endereço sintético. **Há DOIS portões e as réguas são
diferentes de propósito** (`test_docs_mac_anonimato.py` por OUI;
`check_endereco_de_radio.py` por FORMA) — o segundo pega o que o primeiro não
pode pegar. Rode os dois.

### 1.2 Os quatro chamadores de `escolher_fonte` passam pela regra 0

**Os QUATRO, e a razão é a regra que 05/09 deixou escrita:**

> *Quando a cura conhece a causa, ela cobre TODOS os chamadores.*

Cobrir um deixa a próxima pessoa remedindo o mesmo defeito — **e foi o que
aconteceu duas vezes num dia**: a espera pela página nasceu aplicada a UM dos
quatro chamadores do piloto, e a frente da aba 10 teve de escrever um driver
próprio por causa disso.

**A ORDEM É DELA E NÃO SE INVERTE: prova em DOIS controles ANTES de trocar os
chamadores.** Troque primeiro e você não terá como saber se o que quebrou foi o
rádio ou a troca.

### 1.3 As PEÇAS B e C da `CANAL-POR-CONTROLE-01`

* **A eleição só decide a fonte PADRÃO do sistema** — não decide quem é ouvido
  no canal de cada controle. São perguntas diferentes, e confundi-las é o
  defeito que a `CANAL-POR-CONTROLE-01` nomeou.
* **A tela conta QUATRO.** É o foco dela para as 24 horas: quatro DualSense,
  por cabo ou por rádio. Uma tela que conta um está descrevendo a bancada de
  ontem.

### 1.4 O `0x32` segue SUSPENDED/RUNNING da source

O byte segue o estado real da source, não um palpite. **Uma leitura que não
acompanha o estado é a espécie de instrumento que dá verde sobre nada** — e
esta casa achou seis deles em três dias.

---

## 2. AS MORDIDAS — uma por peça, e a do meio é a que decide

1. **O nó nasce pelo rádio**: com um controle no rádio, o nó existe e recebe
   áudio. Arranque a alimentação e a régua reprova.
2. **Os quatro chamadores**: um teste que **conte** os chamadores de
   `escolher_fonte` e exija que os quatro passem pela regra 0. Deixe um de fora
   e ele reprova **nomeando qual**. **Esta é a régua que impede o defeito de
   05/09 de acontecer pela terceira vez.**
3. **A eleição não decide o canal**: prove que trocar a fonte padrão do sistema
   **não** muda quem é ouvido no canal de um controle.
4. **O `0x32`**: dublê com a source SUSPENDED e outro com RUNNING — dois
   valores. Congele o byte e a régua reprova.

**E a prova de aparelho, que é dela:** dois controles no rádio, os dois com
microfone ouvido no canal de cada um. **Se o aparelho e o instrumento
discordarem, o aparelho ganha** — arranque a cura e olhe de novo.

---

## 3. O QUE NÃO ENTRA

* **O mudo do firmware (`common[9]`)**, **drop-in**, **WirePlumber**: fora, e o
  corte é da `ONDA5-MIC-VIRTUAL-01` §3.
* **Som pelo rádio** (o alto-falante): fora. O **ensaio 1** é no FECHO, com a
  orelha dela, dentro da `MESA-DE-QUATRO-01`; o
  `O-ALTO-FALANTE-VIRTUAL-01` e o `SOM-QUE-SAI-01` só **depois** de ele dar
  som. **Por cabo o som está inteiro.**
* **A tela do microfone** (`fontes_de_captura`, `quem_ouve_o_microfone`,
  `canal_do_microfone`): é da sprint do cabo, que fecha antes. Está no
  `nao_toca`.

## 4. NADA SE PERDEU

* **O microfone continua sendo UM ato** — ligar e ser ouvido no canal dele.
* **O que a `ONDA5-02-01` entregou** (a porta que ficou aberta para o microfone
  do vizinho) continua fechado.
* **`check_paridade_transporte.py`**: as células do microfone pelo rádio **saem
  do travessão**. Hoje são 47 mudas; **afirmação forte só com teste que a
  sustente** — é portão, não documentação.

## A PROVA

**Esta sprint mexe no aparelho.** Antes de todo caminho que pare o daemon ou
escreva no controle:

    bash scripts/bancada.sh exigir

**rc=1 significa ESPERAR e DIZER na entrega** — nunca contornar por outro
caminho, que é como se inventa medição falsa. **Não mexa no `default-source` do
sistema dela**: o áudio está em uso. E `install.sh` **nunca**.
