---
sprint: CONTROLES-VERDADE-01
estado: feita
decisoes: [D-0609-PRIORIDADE-TODAS-AS-ABAS, 02-Q6]
posse:
  02C:
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
    - src/hefesto_dualsense4unix/interface/aba02.py
    - mockup/02-controles.html
    - tests/unit/test_a_aba_02_controles_fecha_as_linhas.py
depois_de: [ONDA5-02-01, ONDA5-02-02, ONDA4-S10-O-TRANSPORTE-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/paginas/02-controles.html
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - mockup/DIVERGENCIAS.md
  - docs/data/paridade-gtk-html.csv
---

> **FEITA — 06/09/2026, ONDA C (agente `C-CONTROLES-VERDADE-01`), e o enunciado
> estava errado — corrigi-lo foi a entrega.** A sprint pedia a "linha da
> verdade" no cartão; a medição mostrou que **ela saiu da tela por decisão dela
> em 17/08/2026**. O que faltava naquele mesmo lugar era a linha do
> **giroscópio**, que é a que a janela antiga mostrava — e o que a tela nova
> punha ali era um **número de catálogo**. Essa é a entrega, mais um defeito
> vivo que a costura da ONDA B tinha aberto calado. Relatório:
> `docs/process/agentes/2026-09-06/CONTROLES-VERDADE-01.md`.

# CONTROLES-VERDADE-01 · PARIDADE — o cartão diz o que chega ao jogo

> **A decisão dela, 06/09/2026**: todas as abas entram. E o foco: *"fazer os 4
> dualsense funcionar seja via bt ou cabo"*.
>
> **Numa mesa de quatro, o cartão é o único lugar onde se descobre por que um
> controle não está fazendo nada.** Hoje ele mostra que o controle existe. Esta
> sprint faz ele dizer **o que está chegando ao jogo**.

A aba 02 tem **18 linhas `FALTA_NO_HTML`**. **Cinco são suas** (§2); **treze não
são** (§3), e a razão de cada uma está escrita.

---

## 1. O QUE SE MEDIU — cinco linhas, cinco donos no motor

| linha do CSV | dono no motor | o que ele monta |
| --- | --- | --- |
| **Linha da verdade — "o que chega ao jogo"** | `app/widgets/controller_card.py:1729`, `:5017` | a frase **por recurso** (chegando / pararam / sem pedido ainda) e as **duas frases de exceção** — Modo Nativo e máscara Xbox |
| **Título do cartão — "Controle N — cabo · Jogador X"** | `controller_card.py:1049`, `:4883` | monta do `player_slot` de sessão, do transporte e do número de jogador, **com diff próprio** |
| **Badge de degradação do gamepad virtual** | `controller_card.py:1194`, `:4973` | acende *"Emulação degradada (uinput): «motivo em português»"* quando `vpad_backend == uinput` **E** há `vpad_motivo`; **some** nos outros casos |
| **Giroscópio espelhado — "fluindo para o jogo (~N Hz)"** | `controller_card.py:1212`, `:4984` | o hertz **medido** do `rumble_ff.per_vpad`, e as duas frases de exceção |
| **Barra de luz — o rótulo das quatro situações** | `controller_card.py:1145`, `:4939` | *"Em Nativo o jogo é dono do LED"* · *"A Steam tem este controle aberto"* · *"Lightbar: cor desconhecida"* · *"Lightbar: apagada"*; **sem rótulo, esconde** |

**As cinco têm a mesma forma, e é isso que faz esta sprint barata:** o motor
**já** monta a frase. O que falta é a tela **ler o dono** em vez de redigitar.

**A ARMADILHA, e ela já custou onze réguas nesta casa em 26/08:** *a régua
digitava o que devia LER*. Se o seu teste escrever a frase esperada à mão, ele
mede a sua digitação, não o produto. **Importe a constante do dono e compare
com ela.**

---

## 2. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — a linha da verdade

*"O que chega ao jogo"*, por recurso, lida de `controller_card.py:1729`.
**Inclusive as duas exceções** — em Modo Nativo e sob a máscara Xbox a frase é
outra, e omitir a exceção é dizer que nada chega quando muita coisa chega.

**A MORDIDA:** três dublês — um recurso chegando, um que parou, um sem pedido
ainda — e as três frases diferentes na tela. Arranque a exceção do Nativo e a
régua reprova.

### Passo 2 — o título com a palavra do transporte e o jogador

**A palavra vem da `ONDA4-S10-O-TRANSPORTE-01`**, que fecha antes de você:
`home_actions.palavra_do_transporte` é o dono. Na tela é **cabo** e **rádio** —
`usb`/`bt` é chave crua e não aparece. **A única exceção é a contagem do topo**
(`2 USB · 0 BT`), decidida por ela em 06/09, e ela **não é sua**.

**A MORDIDA:** troque o transporte no dublê e veja o título mudar de palavra;
prove que a string `bt` não aparece em lugar nenhum do cartão.

### Passo 3 — o badge de degradação, e o giroscópio com o hertz medido

**O badge tem duas condições, e as duas importam:** `vpad_backend == uinput`
**E** `vpad_motivo` presente. Só uma delas acende um alarme sobre nada — e
*alarme sem medição* é proibido em texto de tela (`frases_que_ela_baniu.py`).

**O hertz é MEDIDO**, do `rumble_ff.per_vpad`. **Não crave número.** Uma tela
que crava tempo ou frequência de máquina alheia é a espécie de afirmação que
esta casa derruba desde 28/08.

**A MORDIDA:** com `vpad_motivo` vazio o badge **some**. Com hertz zero, a
linha diz o que a exceção manda dizer — não "~0 Hz".

### Passo 4 — as quatro situações da barra de luz

As quatro frases são do motor. **"Sem rótulo, esconde"** é parte do contrato:
uma linha vazia no cartão é ruído, e o cartão de quatro controles não tem
espaço para ruído.

**A MORDIDA:** os quatro estados, quatro frases; o quinto estado (sem rótulo)
não deixa linha vazia.

---

## 3. O QUE ESTA SPRINT NÃO CONSTRÓI — e a razão de cada uma

**Por decisão dela (02-Q6): "Liberar" e "Devolver" ficam FORA.** As duas linhas
do CSV (*devolver a posse do mudo ao hid-playstation*; *soltar a posse do
volume*) não entram — **com aviso**: o que sobra é a tela **dizer** que a posse
está com o Hefesto, não escondê-la.

**O medidor de onda do microfone fica fora.** `controller_card.py:5082` o
alimenta do `MicMonitor` **da própria janela** — o microfone é o único sensor
que **não vem pelo IPC**. Reproduzi-lo na tela nova é construir um segundo
caminho de leitura de áudio para desenhar uma onda; **a feature que importa é o
mic ser ouvido no canal dele**, e ela é da `ONDA5-MIC-VIRTUAL-01` /
`MIC-VIRTUAL-02`.

**As dez linhas de áudio do cartão** (os dois deslizantes, o número e a barra
do alto-falante, o som de confirmação, o selo "Saída muda", "acordado /
dormindo", a guarda "sem endereço", a confissão *"o microfone em que mexi não é
o deste card"*, e o registro no rascunho do perfil) **são da `ONDA5-02-01` e da
`ONDA5-02-02`**, que fecham antes. **Confira o que elas entregaram e RELATE o
que sobrou** — não construa por cima.

**O CSV da paridade** é da `PARIDADE-REMEDIR-01`. Você RELATA.

## 4. NADA SE PERDEU

* **O que a `ONDA5-02-01` e a `ONDA5-02-02` entregaram** — a porta do microfone
  do vizinho, a borda do som em duas cores, e as duas dicas que mandavam para
  uma janela sem lançador.
* **`test_a_aba_controles_reusa_o_motor.py`** continua verde: esta sprint é a
  aplicação literal do que ele cobra.
* **A palavra da tela vem do glossário.** "controle", "P1…P4", "cabo",
  "rádio", "barra de luz", "giroscópio". **Proibidos:** `uniq`, `MAC`,
  `uinput`, `hidraw`, `vpad` cru — e **"mesa" não entra**.
* **Nenhum endereço na tela.** O `uniq` é o endereço do controle e **nunca**
  aparece; se um dublê seu carregar um MAC, ele é sintético ou mascarado
  (octetos 4 e 5 zerados).

## A PROVA DE TELA — obrigatória

1. **A FOTO** antes e depois, `--oculta`, **com dois controles** — é o mínimo
   para ver o cartão dizer coisas diferentes lado a lado.
2. **O CLIQUE**: nem tudo aqui é clicável; para o que não é, **mostre o campo
   mudando** quando o dublê muda.
3. **A MORDIDA** colada, uma por passo.
4. **NO TEMPO**: a régua de mutações da `A-TELA-SAMBA-01`. O cartão é o bloco
   que mais muda por tique (bateria, hertz, estado) — **prove que o que não
   mudou de valor não muta o DOM**, ou você devolve o samba à aba que mais o
   sente.
