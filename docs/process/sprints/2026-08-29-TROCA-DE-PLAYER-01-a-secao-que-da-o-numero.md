---
sprint: TROCA-DE-PLAYER-01
onda: MIGRA-ILUMINACAO
posse:
  TP01:
    - src/hefesto_dualsense4unix/daemon/subsystems/identity.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
cria:
  - tests/unit/test_troca_de_player_01_a_escolha_sobrepoe.py
bancada: false
depois_de:
  # SÉRIE por R5 — `daemon/ipc_handlers.py`, `identity.py` e `status_actions.py`
  # são bancada de uma sprint por vez, e é a forma que esta casa já usa (ver a
  # A-TRAVA-DO-LED-NAO-SOLTA-01).
  #
  # **LEIA A DIREÇÃO: esta sprint FECHOU PRIMEIRO, em 29/08/2026.** O campo
  # existe para serializar a bancada, não para dizer que ela espera as de
  # baixo — quem pegar qualquer uma delas parte do que já está no `dev`:
  # `_set_number_locked` faz TROCA (não `pop`+`insert`), e o registro tem
  # `alinhar_gravado_com_a_tela` e `escolha_da_mao`.
  - A-TRAVA-DO-LED-NAO-SOLTA-01
  - LEVA-4
  - LEVA-DE-BACKGROUND-01
  - MIGRA-CONTROLES-01
  - MIGRA-CONTROLES-06
  - MIGRA-CONTROLES-07
  - MIGRA-CONTROLES-09
  - MIGRA-ILUMINACAO-11
  - MIGRA-JOGAR-10
  - MIGRA-NAVEGACAO-07
  - MIGRA-SISTEMA-09
  - MIGRA-VIBRACAO-04
  - MIGRA-VIBRACAO-05
  - MIGRA-VIBRACAO-06
  - MIGRA-VIBRACAO-07
  - MIGRA-VIBRACAO-08
  - O-CONTROLE-SEM-MAC-01
  - ONDA-CONTROLES-02
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-ILUMINACAO-03
  - ONDA-JOGAR-05
  - ONDA-LANCADORES-06
  - ONDA-PERFIS-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  - QUATRO-NA-MESA-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/controles_vivos.py
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - src/hefesto_dualsense4unix/utils/maquina.py
  - src/hefesto_dualsense4unix/core/evdev_reader.py
  - src/hefesto_dualsense4unix/daemon/sensor_hub.py
  - src/hefesto_dualsense4unix/app/widgets/external_card.py
---

# TROCA DE PLAYER · 01 — a seção que dá o número, e por que ela não dava

**Palavra dela, 29/08/2026:**

> *"o nosso layout é pra permitir a TROCA DO PLAYER de cada controle. Medimos
> isso na época do lightbar e mapeamos isso. No novo layout temos uma seção pra
> isso e ELA TEM QUE FUNCIONAR."*

**Quem coordena tinha escrito o contrário** — que *"nenhuma sprint pode tocar na
numeração do jogador"* — e isso era generalização errada de outra coisa. As duas
regras convivem, e a distinção é o coração desta sprint:

| | quem decide | muda nesta sprint? |
|---|---|---|
| **a regra AUTOMÁTICA** — quem vira jogador 1 quando os controles chegam | a fila de chegada (D-30, `_ordem_do_momento_locked`) | **NÃO.** É decisão medida dela: com o número colado à identidade, o controle branco era sempre o player 3 mesmo SOZINHO na mesa |
| **a escolha À MÃO** | ela, clicando | **SIM — é o que passou a valer** |

A forma é a que ela já fixou para o microfone
(`D-O-MICROFONE-A-MAQUINA-DA-O-PADRAO-O-PERFIL-SOBREPOE`): **a máquina dá o
padrão, a escolha sobrepõe.**

---

## 1. O achado: o mecanismo existia, estava ligado, e não funcionava

Três defeitos, os três medidos em 29/08 com as classes reais e relógio
injetado. **Nenhum deles estava em lista nenhuma desta casa.**

### (a) A escolha não chegava à tela

`identity.number.set` grava o **lugar na fila** (`rank`, via `compact`). Quem
decide o número exibido é `_ordem_do_momento_locked`
(`daemon/subsystems/identity.py:762`), cuja chave é **`(onda de chegada, rank)`**
— *"a fila do momento MANDA, o gravado DESEMPATA"* (D-30, decisão dela de
15/08). Com os controles chegando em **ondas diferentes** — que é ligar um por
um, o caso normal dela — o `rank` **nem é consultado**, e a escolha ficava
invisível.

A própria docstring do `compact` já dizia isso, e ninguém ligou os pontos:
*"a fila do momento NÃO é tocada aqui de propósito"*.

Medido, três DualSense ligados um a um, pedindo o 1 para o último:

```
ondas de chegada : {A: 1, B: 2, C: 3}
rank ANTES       : {A: 1, B: 2, C: 3}     NA TELA: {A: 1, B: 2, C: 3}
identity.number.set(C, 1) -> ok=True, changed={C:1, A:2, B:3}
rank DEPOIS      : {A: 2, B: 3, C: 1}     NA TELA: {A: 1, B: 2, C: 3}   <- não mexeu
```

### (b) E o congelamento a apagava, do disco inclusive

Continuando o mesmo cenário: a mesa fica `JANELA_MESA_ESTAVEL_SEC` = **4,0 s**
sem ninguém entrar nem sair, `_congelar_locked` (`identity.py:792`) reescreve os
`rank` **a partir das ondas**, e o `sync_connected` salva.

```
rank logo após o comando : {A: 2, B: 3, C: 1}
rank após o congelamento : {A: 1, B: 2, C: 3}   <- a escolha dela sumiu
```

**A escolha à mão não era só invisível: era apagada da memória e do arquivo em
~4 s.** O `_congelar_locked` não sabia que houvera escolha — não havia
sobreposição, havia a máquina reescrevendo por cima.

### (c) `ok:true` sobre coisa nenhuma

O plano lia `registry.snapshot()` **ordenado por `rank`**, que não é a ordem que
a tela mostra. Reboot com a fila gravada `Cosmic=1, Blue=2`, ela liga o **Blue**
primeiro (tela `Blue=1, Cosmic=2`), e pede o 1 para o Cosmic:

```
rank gravado: {Cosmic: 1, Blue: 2}   ondas: {Blue: 1, Cosmic: 2}
NA TELA     : {Blue: 1, Cosmic: 2}
set(Cosmic, 1) -> ok=True, changed={}
NA TELA     : {Blue: 1, Cosmic: 2}   <- nada
```

`changed == {}` faz o `if changed:` do handler pular o `reassert_resolved_outputs`:
nem repintura acontece. E a aba Status ainda diz *"Pronto — este controle agora é
o N."*

### Por que a suíte verde não via nada disso

`tests/unit/test_player01_um_numero_de_jogador.py` tem **36 testes, todos verdes**
antes desta cura, e **nenhum injeta relógio** — as 12 chamadas de `sync_connected`
montam a mesa numa olhada só, os três caem na **mesma onda**, e o `rank` volta a
ser o desempate. **A suíte provava o mecanismo exatamente no único caso em que
ele já funcionava.** A mesa dela — quatro DualSense no rádio, ligados um a um —
não é esse caso.

*(É a regra 2 desta casa: uma régua que roda o tique UMA VEZ mede um instante,
não um comportamento.)*

---

## 2. A DIVERGÊNCIA: a tela promete TROCA e o daemon fazia RODÍZIO

Isto é separado dos três acima, e vinha de um mês atrás.

`_set_number_locked` era `pop`+`insert` — **empurra todo mundo entre a origem e o
destino**. Quatro na mesa, dar o **1** ao último:

| | P1 | P2 | P3 | P4 | quantos mudaram |
|---|---|---|---|---|---|
| antes | Cosmic | Blue | Purple | White | — |
| **rodízio** (o daemon até hoje) | White | Cosmic | Blue | Purple | **três** |
| **troca** (a tela, e ela) | White | Blue | Purple | Cosmic | **um** |

**A tela promete troca em dezessete lugares do mockup aprovado**: os 16 tooltips
de botão de número e a legenda *"Os dois trocam, os outros não se mexem"*
(`src/hefesto_dualsense4unix/interface/aba04.py`). **E a palavra dela de 28/08 é troca:**

> *"Trocar é TROCA, não fila: pôr o azul no 1 faz quem era 1 virar 2. Ninguém
> repete número, ninguém fica sem."*

**Por que atravessou um mês com a suíte verde:** rodízio e troca dão o **mesmo
resultado** quando o salto é de **um** número (vizinhos) — que é o único caso
desenhado no mockup e o único que a suíte de 25/07 media. Divergem de dois em <!-- noqa-acento: verbo medir, imperfeito -->
diante: medido em 55 casos (mesas de 1 a 5), coincidem em 35, divergem em 20, e
as 20 são todas de salto ≥ 2.

**Decidido pela troca**, e a razão é de hierarquia de fontes: a especificação
visual aprovada por ela e a palavra dela dizem troca; quem dizia rodízio era o
código e dois textos derivados dele. **Se ela vetar, o revert é uma linha** —
está marcada no código com este nome de sprint.

---

## 3. A cura, e por que ela é uma permutação

**Duas funções novas no registro de identidade**, mais o plano calculado sobre o
que ela vê.

### `alinhar_gravado_com_a_tela()` — `identity.py`

Adianta para o instante do clique o **mesmo** `_congelar_locked` que a mesa
estável dispara sozinha 4,0 s depois. Não é regra nova: é a regra automática
gravada mais cedo. Serve para uma coisa só — o clique dela é sobre **o que ela
está vendo**, então o plano tem de ser calculado sobre essa mesa. Cura o defeito
(c).

### `escolha_da_mao(ranks)` — `identity.py`

Aplica os lugares novos **e redistribui as ONDAS** dos presentes entre eles, na
ordem dos lugares novos — o que o `_congelar_locked` faz com os `postos`, no
sentido inverso. Cura (a) e (b).

**A prova é de ordenação, não de teste.** O chamador entrega `ranks`
estritamente crescentes na ordem desejada (ele redistribui os MESMOS lugares,
ordenados). Redistribuir as ondas **ordenadas** na mesma sequência deixa a onda
**não-decrescente** nessa ordem. Logo a chave `(onda, rank)` é **estritamente
crescente** na ordem desejada, e ordenar por ela devolve exatamente essa ordem.
O congelamento seguinte encontra `_ordem` já igual à fila do momento e **não
escreve nada**: a escolha sobrevive ao tempo.

E como o conjunto de ondas não muda, **nenhuma onda nova é inventada** — quem
conectar depois continua com a onda mais alta e cai no fim da fila. É isso que
mantém a regra automática intacta debaixo da escolha.

### `_set_number_locked` — `ipc_handlers.py`

`pop`+`insert` → **troca** das posições `indice_atual` e `numero - 1`. O conjunto
de lugares dos presentes continua o mesmo (só troca de dono), então **o ausente
segue intocado** — a promessa que separa este gesto do "Renumerar agora".

### As duas recusas vêm ANTES do alinhamento — e isso é a cura de um defeito que a própria cura criou

**Achado na conferência da cura, 29/08/2026.** O alinhamento entrou no handler
**antes** das duas recusas, e a docstring do `_set_number_locked` promete o
contrário, com todas as letras: *"Erros (todos ANTES de qualquer escrita)"*.
Com ele ali, um comando **recusado** gravava o `controllers.json` dela:

```
tela             : {Blue: 1, Cosmic: 2}      (gravado dizia Cosmic=1, Blue=2)
disco ANTES      : (arquivo NÃO existe)
comando          : {"uniq": Cosmic, "number": 9}
resposta         : {"ok": false, "reason": "numero_fora_da_mesa", "max": 2}
disco DEPOIS     : {Blue: 1, Cosmic: 2}      <- a recusa ESCREVEU
```

O dado gravado não era errado — é o que o congelamento escreveria 4,0 s depois
de qualquer jeito. **Errada era a promessa**, e ela é a que separa um comando
recusado de um aplicado: quem recusa não toca o arquivo dela.

A ordem passou a ser: monta a mesa → **recusa** → alinha → **relê a mesa se
algo mudou de lugar** → troca. As duas recusas podem vir antes porque nenhuma
delas depende da ORDEM: *"o alvo está na mesa?"* é pertinência e *"o número
cabe?"* é contagem, e o alinhamento é uma permutação **entre os presentes** —
não muda nem o conjunto nem o tamanho. A releitura é obrigatória: sem ela o
plano sairia sobre a foto velha, que é o defeito que o alinhamento existe para
fechar.

### O tooltip da aba Status — `status_actions.py`

Dizia *"Os outros deslizam para abrir lugar"*, que descrevia o produto ao
contrário depois da troca. **Substituído** (regra desta casa: fato errado se
substitui, e em todos os lugares — os que faltam estão no §6).

---

## 4. A cor: o código JÁ distingue os dois casos, e isso foi medido

A cor **não é copiada em lugar nenhum**: ela é derivada do número por
`player_slot_color` (`core/led_control.py:158`) dentro do provider automático.
E a escolha à mão vence, pelo merge por campo de `_merged_desired_for_key`
(`core/backend_pydualsense.py`), cuja precedência é:

> GAME > CO-OP > **override por-uniq (perfil/usuária)** > **AUTOMÁTICA** > default

Medido no merge REAL do backend, sem aparelho:

```
SEM escolha à mão:   A: numero=1 led=(0,0,255)      B: numero=2 led=(255,0,0)
COM escolha à mão no A (roxo):
                     A: numero=1 led=(128,0,255)    B: numero=2 led=(255,0,0)
```

**Não há defeito aqui** — é exatamente o que o caderno do mockup pede (*"sem
escolha à mão ela é a cor do número"*). O que faltava era o número mudar; agora
que muda, a barra segue sozinha. Provado nos dois testes de `TestACorSegueONumero`.

---

## 5. A MORDIDA — os números dos dois lados

Régua: `tests/unit/test_troca_de_player_01_a_escolha_sobrepoe.py`, **11 testes**,
todos com **relógio injetado** e a mesa montada **um controle por vez** (ondas
separadas). Caminho **público**: o mesmo `IpcServer._handle_identity_number_set`
que o botão da tela chama.

```
COM A CURA        11 passed in 0.49s   (arquivo novo)
                  36 passed in 0.47s   (test_player01_um_numero_de_jogador.py)
```

**Quatro** arrancadas independentes, cada uma reprovando o que promete. Os
números são do arquivo novo / do `player01`, medidos um por um:

| arrancada | arquivo novo | `player01` | o que apareceu |
|---|---|---|---|
| `escolha_da_mao` → volta a `compact` | **9 failed**, 2 passed | 36 passed | `NA TELA` fica `{Cosmic:1, Blue:2, Purple:3}` — a tela não se mexe, e o disco volta atrás |
| `alinhar_gravado_com_a_tela` → fora | **1 failed**, 10 passed | 36 passed | `assert set() == {Cosmic, Blue}` — o falso sucesso, exatamente ele |
| troca → volta o `pop`+`insert` | **8 failed**, 3 passed | **1 failed**, 35 passed | `{Cosmic:2, Blue:3, Purple:4}` em vez de `{Blue:2, Purple:3, Cosmic:4}` — três renumerados em vez de um |
| recusas → voltam para DEPOIS do alinhamento | **2 failed**, 9 passed | 36 passed | `assert not exists()` — o `controllers.json` nasce do nada num comando recusado |

Cada arrancada reprova **só** o que ela promete, e é isso que separa quatro
réguas de uma régua repetida quatro vezes: as duas recusas não caem quando a
troca é arrancada, e a troca não cai quando o alinhamento sai.

E a régua vive no TEMPO, que é o que faltava:

- `test_a_troca_sobrevive_ao_congelamento_da_ordem` — a mesa se mexe, assenta,
  o congelamento roda, e a escolha **fica**;
- `test_a_troca_chega_ao_disco_e_fica_la` — o `controllers.json` guarda
  `{Purple:1, Blue:2, Cosmic:3}` e continua com isso **depois** do congelamento;
- `test_a_escolha_sobrevive_ao_replug_do_controle_trocado` — o controle escolhido
  cai e volta com o número dela;
- `test_quem_chega_depois_da_escolha_vai_para_o_fim` — o quarto controle nasce
  jogador 4, e não no meio da mesa: **a escolha não sequestra a fila**.

MACs sintéticos, faixa `aa:bb:cc:*` com os **octetos 4 e 5 zerados** (máscara da
casa). Nenhum byte foi para aparelho; nenhum perfil dela foi escrito; a suíte
inteira não foi rodada.

### A régua velha ganhou nota datada, não sumiu

`test_empurrar_para_o_fim_desliza_os_do_meio` → `test_empurrar_para_o_fim_troca_com_quem_esta_la`.
A docstring diz o que ele exigia antes (`B=1, C=2, A=3`), por que aquilo não era
mentira (o rodízio de fato preservava 1..N e não rebaixava ausente — e continua
sendo o que o `identity.renumber` faz), e o que o derrubou.

---

## 6. Os degraus que NÃO foram aplicados, e por quê

**Nada aqui é opinião: cada um tem dono e razão de território.**

1. **`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:341`** — a tabela de
   botões diz *"Os outros deslizam para abrir lugar"*. É o **rodízio**, e agora
   está errado. Fora do território desta leva (`docs/` fora de
   `docs/process/sprints/`).
2. **`docs/usage/interface.md:1017`** — a mesma frase, mesmo motivo, mesmo
   território.
3. **`MIGRA-ILUMINACAO-11`** (`docs/process/sprints/2026-08-29-...-troca-ou-rodizio.md`)
   — esta sprint **executa** o que aquela levantou. Ela pode ser fechada com
   ponteiro para cá, ou reaberta se ela vetar a troca.
4. **`app/widgets/external_card.py`** — a linha *"Jogador:"* do rodapé de cada
   card oferece **1..5 fixo** (`JOGADORES = 5`), então com quatro na mesa o "5"
   volta `numero_fora_da_mesa` garantido; e a recusa é **muda**
   (`app/actions/config/secao_controles.py` só faz `logger.info`). O arquivo
   está **em voo por outra leva** (a cor pela porta do broker, 49 inserções
   staged), e o `JOGADORES = 5` é declarado como vindo do desenho aprovado —
   contestá-lo é decisão, não conserto. **Fica para quem tiver a posse.**
5. **A seção está na aba errada** em relação ao desenho novo: o mockup põe
   *"Selecione o player"* na **Iluminação** (`layout/04-iluminacao.html`), e
   os dois botões vivos hoje estão na **Status** e na **Controles**. A migração
   da tela é da onda `MIGRA-ILUMINACAO`; **o mecanismo por baixo dela já está de
   pé, e é isso que esta sprint entrega.**
6. **A linha do desfecho** (*"as luzinhas mostram o número N — por sua escolha /
   pelo co-op / automático"*, contrato `:352`) não existe no mockup — o fato só
   aparece dentro do "?". A função que produz a frase já existe
   (`app/actions/lightbar_actions.py:303`). É requisito em aberto da seção.

---

## 7. O que é dela decidir

1. **Troca ou rodízio.** Aplicada a **troca** (a palavra dela de 28/08 + o mockup
   aprovado em dezessete lugares). O caso para ela **ver**, na mesa dela: dar o
   **1** ao último controle — rodízio renumera três, troca mexe em dois. Veto =
   uma linha.
2. **O tooltip novo da aba Status** — *"Quem tem esse número hoje fica com o deste
   — os dois trocam, e mais ninguém se mexe."* É mudança de texto de tela e
   espera o olho dela (PROVA-DE-TELA-01).
3. **Quantos números a fileira oferece.** O desenho oferece os **ocupados** e o
   daemon recusa acima disso (`numero_fora_da_mesa`) — as duas já concordam. Pôr
   um controle no 5 com a mesa em 4 seria **mover**, não trocar, e é outra
   decisão.
