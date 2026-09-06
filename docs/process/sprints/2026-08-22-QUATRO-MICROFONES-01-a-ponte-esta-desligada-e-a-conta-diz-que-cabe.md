---
sprint: QUATRO-MICROFONES-01
estado: feita
posse:
  E3:
    - src/hefesto_dualsense4unix/cli/cmd_mic.py
cria:
  - tests/unit/test_o_mic_bt_nao_sobe_em_cima_do_daemon.py
  - tests/unit/test_portao_a_ponte_do_mic_espera_a_arbitragem.py
bancada: true
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
  - src/hefesto_dualsense4unix/app/actions/config/
  - docs/data/mapa-controles.csv
  - docs/data/decisoes-dela.csv
---

> **ESTADO 06/09/2026: feita** — o cabeçalho ou os arquivos que ela cria dizem (conferido em 06/09).

# QUATRO-MICROFONES-01 — a ponte está desligada, e a conta diz que cabe

**22/08/2026.** A mesa dela tem três adaptadores desde esta semana, e foi
exatamente para isto que eles foram comprados. A ponte que usa essa folga
continua desligada, e **nenhuma superfície do produto a liga**.

**Estado:** **E1 e E2 ENTREGUES em 23/08/2026** (ver o fim do documento). **E3
ABERTA e DELA:** o ensaio com os quatro microfones ligados pede o daemon
reiniciado sobre a árvore fechada e ela na sala — ligar quatro microfones na
casa dela enquanto ela não está é o gesto que este módulo existe para recusar.

> ## O PREÇO QUE NÃO FOI POSTO NA MESA — nota datada de 23/08/2026
>
> **Esta entrega passou por cima de um pré-requisito que a própria casa tinha
> medido, e ela não foi informada.** Escrito aqui porque a decisão de passar por
> cima é dela, e ela não pôde tomá-la.
>
> O estudo de **16/08** (`docs/process/estudos/2026-08-16-O-PS-PRESO-*.md`)
> registra veredito **MEDIDO**, sobre a escolha dela de *"testar primeiro,
> decidir depois"*:
>
> > *"**Testado: a ponte NÃO é segura ainda.** Não sobe sozinha, e não entra no
> > caminho automático da interface, enquanto a sequência do `0x32` tiver dois
> > donos."*
>
> O item 1 do "o que fazer, em ordem" daquele estudo é **arbitrar o hidraw** — o
> broker recusando o segundo pedido, ou multiplexando. O item 4 é, textual: *"a
> ponte do mic não volta a subir sem o item 1"*. O
> `O-QUE-FICOU-ABERTO-01` tabela isso como portão **5.b**: *"`bt_mic_enabled`
> não ganha escritor antes de 5.a"*. Foi por esse veredito que o interruptor
> *"Pelo rádio"* **saiu** da janela em `1e96db5`.
>
> **MEDIDO em 23/08, na árvore de hoje:**
>
> | pergunta | resposta |
> |---|---|
> | existe arbitragem de hidraw em `src/`? | **não.** `grep -rni "arbitr" src/` só devolve a palavra *"arbitrário"* em cinco contextos sem relação |
> | o broker rastreia quem já abriu o nó? | **não.** `broker/hidraw_broker.py`, no `_cmd_open`: *"`open` **NÃO** altera lease/refcount — é ortogonal ao `hide`"* |
> | o interruptor voltou à janela? | **sim** — `app/actions/config/secao_controles.py:998`, `_BlocoDoMicrofone` |
> | existe portão 5.a/5.b? | **não.** Nenhum teste os nomeia |
>
> Ou seja: o **5.a não foi feito e o 5.b foi violado**. Ela pediu o interruptor
> em 22/08, seis dias depois do veredito — mas pedir uma coisa não é dispensar
> um pré-requisito que ninguém lhe mostrou. A docstring de
> `_ao_alternar_o_microfone` reconhece a lacuna e a resolve **só para o processo
> da janela**; o conflito de 16/08 era **dentro do daemon** (a ponte e o
> `motion_reader` no mesmo nó), e esse continua.
>
> **O que isto NÃO é:** não é pedido para desfazer a entrega. A E1/E2 estão
> corretas no que fazem, e desligar o interruptor de novo sem ela pedir seria o
> mesmo erro na direção oposta. É pedido para **pôr o preço na mesa** — que é
> como ela decide (*"ela quer o preço na mesa"*), e o que faltou.
>
> **Fica na fila** como item próprio: arbitrar o hidraw, ou ela decidir que
> aceita o risco sabendo qual é.
>
> **NOTA DATADA — 25/08/2026.** Esta nota deixou de ser só uma nota: o portão
> `tests/unit/test_portao_a_ponte_do_mic_espera_a_arbitragem.py` MEDE a
> arbitragem no comportamento do broker real e congela em duas as portas de
> produção que sobem a ponte. **O 5.a continua não existindo**, e a decisão de
> gastar bancada para destravá-lo continua sendo dela. Ver o fim deste
> documento.

---

## O defeito, em uma linha

**Os três dongles compraram a folga de rádio que os quatro microfones exigem, e
a ponte que os usaria não tem interruptor em lugar nenhum.**

## O que foi MEDIDO

**O estado em 22/08, ANTES da entrega** (varredura sobre `src/`):

```
grep -rn "bt_mic_enabled" src/
  daemon/lifecycle.py:277        bt_mic_enabled: bool = False     <- declaração
  daemon/subsystems/bt_mic.py:79 getattr(config, "bt_mic_enabled", False)
  daemon/ipc_handlers.py:2938    "enabled": ...                    <- só relata

grep -rn "bt_mic_enabled\s*=" src/   → nada além da declaração
```

Ou seja: o campo existe, o daemon o lê, o IPC o publica — e **ninguém o
escreve**. A ponte só sobe por `HEFESTO_DUALSENSE4UNIX_BT_MIC=1`, à mão, no
ambiente do daemon.

**A conta do rádio**, do
[GUIA-RADIO-DA-SALA.md](../../../GUIA-RADIO-DA-SALA.md) §2, que por sua vez cita o
A/B de 25/07 feito no próprio projeto:

```
mic DESLIGADO : input 260.4 Hz   audio   0.0 Hz   total 260.4 Hz
mic LIGADO    : input 170.5 Hz   audio 106.2 Hz   total 276.7 Hz

5 controles × 277 pacotes/s   ≈  1.385 transações/s
Um adaptador Bluetooth Classic ≈  1.600 slots/s
TRÊS adaptadores               =  4.800 slots/s
```

O total de pacotes **não se move** quando o mic liga: o áudio não abre canal
novo, ele ocupa lugar na mesma fila. Por isso a divisão sugerida do guia é por
microfone — um par com mic consome ~554 transações/s de 1.600, cerca de um
terço de um adaptador.

**Com um adaptador a mesa cheia com microfone não cabe. Com três, cabe com
folga.** Ela já tem os três, e os controles já estão distribuídos 1/2/1.

## O que já está decidido, e não se reabre

O `bt_mic.py` carrega no cabeçalho as duas razões de nascer desligado, e as
duas continuam de pé:

1. **Privacidade.** *"Um microfone que liga sozinho quando o daemon sobe é
   inaceitável, por melhor que seja a intenção. A ponte é um gesto explícito."*
2. **Banda do rádio.** Com o mic ligado, os reports de input caem de ~260 para
   ~170 Hz, e o total de pacotes não muda — o áudio divide a fila. É a conta
   por adaptador, e é o que o orçamento da mesa mede.

   **NOTA DATADA — 22/08/2026.** Aqui estava escrito que *"quem usa mira por
   giroscópio perde resolução de integração — o espelho de motion mira
   250 Hz"*, e isso saiu. Ver `daemon/subsystems/bt_mic.py`: 250 Hz é a taxa
   nativa do CABO, e no rádio o físico entrega em rajada. A frase comparava
   réguas de transportes diferentes.

   **CORREÇÃO DATADA — 23/08/2026.** Esta mesma nota dizia *"entre ~55 e
   ~392 Hz com o mic DESLIGADO"*, e o ACHADO mais abaixo, na mesma condição,
   mede controles sozinhos no adaptador a **796,8 e 800,8 Hz sustentados**. Os
   dois não podiam estar certos, e o certo é o segundo: ~800/s é o orçamento do
   **ADAPTADOR**, repartido entre os controles que ele hospeda — 392 é a metade
   que a bancada de 11/08 leu num adaptador com dois. A reconciliação está na
   nota datada de
   [driver-hid-playstation.md](../../protocol/driver-hid-playstation.md),
   §"Rádio: variável, em rajadas", que é onde o número velho morava.

E o [ONDE PARAMOS de 16/08](../2026-08-16-ONDE-PARAMOS-a-sessao-de-vinte-horas.md)
§1.5 registrou o estado como **decisão medida**: ponte parada, risco por dia
zero, e ela subiu naquele dia porque um agente a subiu à mão, duas vezes.
**Nada disto é para desfazer.** O que esta sprint pede é o gesto explícito
existir dentro do produto, em vez de morar numa variável de ambiente.

## O que NÃO é

- **Não é ligar o mic por padrão.** Se a entrega saísse assim, ela estaria
  errada por construção.
- **Não é a MIC-BT-DONO-01**, que trata da posse do mudo e do ciclo de vida do
  botão. Nem a CONTROLE-INTEIRO-NO-RADIO-01, que é a metade de SAÍDA (o sink
  virtual, que não existe). Esta é só a ENTRADA, e só o interruptor.
- **Não é a cadeia do microfone da TRES-PORTOES-01**, que mede se o áudio chega.
  Aqui a pergunta é anterior: ninguém consegue ligar.

---

## Entregas

### E1 — o interruptor existe, e ele é um gesto explícito

Um escritor de `bt_mic_enabled` que a janela alcance. O lugar natural é a aba
**Configurações**, seção "Os controles" — que já tem um card por controle e já
mostra o que cada aparelho sabe fazer.

**Três regras que a entrega não pode quebrar:**

1. nasce desligado, sempre, em máquina nova;
2. o estado é **da mesa**, não do perfil — o `maquina.json` de `CONFIG-03` é
   onde isto mora, porque um microfone que liga ao trocar de jogo é a mesma
   surpresa que o cabeçalho do módulo recusa;
3. a tela diz **quanto do rádio** aquele microfone ocupa. É CAPACIDADE, não
   advertência — ver "O que ela DECIDIU" abaixo, que derrubou o aviso de preço
   contra o giroscópio no mesmo dia.

### E2 — o produto diz quanto cabe, com a mesa que ela tem

O medidor de rádio de `CONFIG-04` já mostra a ocupação por adaptador com as duas
fatias (entrada em roxo, áudio em ciano) e o selo `NNN/1600 · derivado da
especificação`. Falta ele responder a pergunta que ela vai fazer ao ver o
interruptor: **"liga em quantos?"**

O medidor já tem o dado. A entrega é a frase, e ela é derivada — nunca um número
digitado à mão.

### E3 — o ensaio dos quatro ao mesmo tempo

**DELA, por construção.** Quatro controles, três adaptadores na divisão 1/2/1,
os quatro microfones ligados, e um jogo de co-op aberto. O que se anota: se
alguém cai, se a mira por giroscópio piora de forma perceptível, e se o áudio
chega inteiro.

O que a bancada precisa ter antes: a E1 (senão não há como ligar), e o
`bt_active_mode.sh` desarmado do `head -1` (E2 da
[N-IGUAL-A-UM-01](2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md)),
senão a cura do Pro Controller está armada no adaptador errado durante o ensaio
e contamina o resultado.

---

## O que ela DECIDIU — 22/08/2026, e não se reabre

**1. O interruptor é POR CONTROLE.** Textual: *"por controle"*. Um por card, na
forma que a seção "Os controles" já tem. Não há chave de mesa inteira.

**2. O microfone não é trade-off contra o giroscópio.** Ela derrubou a pergunta
antes de respondê-la:

> *"tá desatualizado, já conseguimos provar via testes que dá pra usar o
> DualSense com todas as features ao mesmo tempo. Funciona assim no PlayStation.
> O que provamos também é que um adaptador só, BT, seria impossível fazer isso.
> Hoje temos 3. O alvo é usar 4 controles por BT. É viável e possível."*

A medição de 11/08 concorda: a premissa da frase de preço não existia (ver a
nota datada acima). **O alvo é o PS5**, e a régua do que cabe é a conta por
adaptador — não uma escolha entre features.

O que isto muda nas entregas: a **E1 deixa de precisar de um aviso de preço** ao
lado do interruptor. O que a tela deve dizer é o que o orçamento da mesa já
sabe — quanto do rádio aquele microfone ocupa, e se ainda cabe. Informação de
capacidade, não advertência.

---

## Como morde

Arranque o escritor da E1 e o interruptor volta a não ter efeito nenhum — que
era o estado até 22/08, e é o que os testes reprovam. As mordidas exercidas
estão nos cabeçalhos dos três arquivos novos em `tests/unit/`:
`test_o_microfone_e_por_controle_e_alguem_escreve.py`,
`test_o_interruptor_do_microfone_na_aba_configuracoes.py` e
`test_a_barra_do_radio_sai_do_zero_quando_o_mic_liga.py`. O portão que impede o
campo de voltar a ficar órfão é o `portao_a_casa_sabe_e_o_produto_nao_faz.py`:
um gate sem escritor é a definição do que ele mede.

## O que este achado ensina

**Um campo lido por três lugares e escrito por nenhum é uma feature que só
existe para quem lê o código.** O hardware foi comprado, a conta foi feita, o
módulo está pronto desde julho — e a distância entre isso e o produto é um
interruptor.

---

## A linha de base, medida na bancada às 22h de 22/08/2026

Lida pela régua do PRODUTO — `daemon.state_full` mais
`integrations/radio_da_mesa.ocupacao_por_adaptador` — com os quatro DualSense
no rádio e **nenhuma ponte de microfone de pé**:

| Adaptador | Controles | Slots de entrada | Áudio | Do teto de 1600 |
|---|---|---|---|---|
| `d8:44:89…` (o 5.0) | 1 | 260,4 | 0 | 16% |
| `ac:a7:f1…` (5.4, o primeiro) | 2 | 520,8 | 0 | 33% |
| `ac:a7:f1…` (5.4, o segundo) | 1 | 260,4 | 0 | 16% |

**É o controle negativo da E1:** hoje o campo `bt_mic_enabled` não tem escritor,
e a coluna de áudio é zero nos três — não porque o rádio recusou, mas porque
ninguém pediu. Quando a E1 existir, esta mesma tabela é a régua: a coluna de
áudio tem de sair de zero, e o pior rádio tem de continuar abaixo do teto.

**E a bancada acabou de dar um aviso de produto:** os dois 5.4 têm o **mesmo
OUI** (`ac:a7:f1`). Qualquer leitura que trunque o endereço os funde num só —
foi o que aconteceu com o `grep` de `HID_PHYS` desta passagem, que contou
`3 / 1 / 0` onde o produto contava `1 / 2 / 1`. O produto acertou porque usa o
endereço inteiro; o instrumento improvisado errou. É a razão prática do nome por
adaptador que entrou hoje: com dois rádios da mesma safra, o endereço curto não
distingue e o rótulo do fabricante repete.

---

## O que foi ENTREGUE — 23/08/2026

**E1 e E2 fechadas. E3 medida em parte, e a parte medida derrubou um número.**

### E1 — o interruptor existe, e é por controle

O campo `DaemonConfig.bt_mic_enabled: bool` **saiu**. Um `bool` só sabe dizer
"todos" ou "nenhum", e a decisão dela é *"por controle"*. No lugar dele:

* `ControleDeclarado.microfone` no `maquina.json` — a escolha é **da mesa**, não
  do perfil, e **só `True` chega ao disco**: desligar grava `None`, porque
  "nunca pedi" e "não quero" deixam a ponte no chão do mesmo jeito e um `false`
  gravado seria um valor de catálogo para o silêncio;
* `DaemonConfig.bt_mic_uniqs` — uma **fonte chamável**, fiada por `Daemon.run()`
  com `uniqs_declarados(self._maquina)`. Chamável e não cópia pelo mesmo motivo
  do `orcamento_da_mesa`: o `machine.declare` rebinda `daemon._maquina` no
  "Aplicar", e uma cópia tirada no boot ficaria velha no instante exato em que
  ela acabou de escolher;
* `BtMicSubsystem.alvos()` — o filtro que faz o "por controle" acontecer: o laço
  entrega ao gerenciador **só os nós que ela ligou**, e tirar um da lista derruba
  a ponte dele deixando as outras de pé;
* `Daemon.reconciliar_bt_mic()`, chamado pelo `machine.declare` — sobe o
  subsystem no primeiro microfone e o derruba no último, **sem reiniciar o
  Hefesto**;
* o interruptor no card (`secao_controles._BlocoDoMicrofone`): **sempre visível,
  só acionável no rádio**, diferido como o resto da aba.

A env `HEFESTO_DUALSENSE4UNIX_BT_MIC=1` continua valendo e continua significando
a mesa inteira — é o caminho à mão. No `portao_a_casa_sabe_e_o_produto_nao_faz`
ela saiu de `_SEM_MAO_HOJE` e entrou em `_MAO_FORA_DO_AMBIENTE`, com o
companheiro declarado: a FEATURE tem mão, a env é o atalho.

### E2 — a barra responde ao microfone

`daemon.state_full` ganhou a terceira chave do bloco `bt_mic`: **`uniqs`**, os
`uniq` cuja ponte SUBIU. As outras duas (`enabled`, `running`) são do PROCESSO —
com quatro controles e uma ponte elas diziam `running: true` e pintariam áudio
nos quatro. A seção "A mesa" já lia essa chave desde a `CONFIG-04`, com ausência
virando conjunto vazio; ligá-la foi uma linha no daemon e nenhuma na janela.

`uniqs` relata o que subiu, **nunca o que foi pedido**: uma ponte pedida que não
subiu (libopus ausente, hidraw recusado) não ocupa fatia de rádio nenhuma.

### E3 — o que foi medido, e o que NÃO foi

**Refeito o controle negativo às 00h07 de 23/08**, com a régua do produto e os
endereços INTEIROS. Bate com a linha de base das 22h, dígito a dígito:

| Adaptador | Controles | Entrada | Áudio | Do teto de 1600 |
|---|---|---|---|---|
| `d8:44:89:00:00:c4` (o 5.0) | 1 | 260,4 | 0 | 16% |
| `ac:a7:f1:00:00:41` (5.4) | 2 | 520,8 | 0 | 33% |
| `ac:a7:f1:00:00:ce` (5.4) | 1 | 260,4 | 0 | 16% |

**O ensaio com os quatro microfones LIGADOS não foi feito, e a ausência é o
resultado.** Duas razões, e cada uma sozinha bastaria:

1. **O daemon vivo é mais velho que o código.** Ele subiu às 22h16 de 22/08, e
   o `bt_mic` dele publica duas chaves, não três — a E1 não existe no processo
   que está rodando. Subir as pontes por fora seria medir um instrumento, não o
   produto, e reiniciar o daemon dela carregaria a árvore de trabalho INTEIRA,
   com o que quatro frentes deixaram no disco esta noite.
2. **Ligar quatro microfones na casa dela enquanto ela não está é o gesto que
   este módulo inteiro existe para recusar.** *"A ponte é um gesto explícito."*
   Ele é dela.

**O que a bancada precisa ter para o ensaio:** o daemon reiniciado sobre a
árvore fechada, e ela na sala.

---

## O ACHADO DE 23/08/2026 — o rádio entrega ~800 relatórios por segundo POR ADAPTADOR, e os controles DIVIDEM

**GRAU: MEDIDO.** É o achado mais caro desta passagem, e ele **não estava sendo
procurado** — apareceu ao conferir o controle negativo contra o físico.

### O instrumento, declarado

Leitura **só de leitura** dos quatro nós `hidraw` (nenhuma escrita, nenhum
`0x32`, nenhum microfone, nada em disco), **um nó por vez**, janelas de 10 s,
pelo mesmo `abrir` que o produto usa (o broker cede o fd; os nós estão
`hidden` por causa da emulação). Roteiro em `/tmp/medida_final2.py` da sessão;
a receita está reproduzida abaixo.

**Três réguas, e as três concordam:**

1. quantos `read()` voltaram;
2. quantos avanços do `seq_tag` do próprio report;
3. **o carimbo de tempo do sensor**, que o controle gera lá dentro — carimbos
   **únicos em 100% dos relatórios**, zero duplicatas, todos de 78 bytes.

A taxa do relógio do aparelho **não foi assumida**: saiu dos dados, tiques
andados dividido por segundos de parede, e deu **3,000 MHz** nos quatro
controles (2,999 a 3,000). É a régua que vale, porque o laço em Python perde
relatório e o relógio do controle não.

### O número

| Adaptador | Controle | Laço (Hz) | **Relógio do aparelho (Hz)** |
|---|---|---|---|
| `ac:a7:f1:00:00:41` | `…c3:11:f0` | 357,0 | **398,3** |
| `ac:a7:f1:00:00:41` | `…48:46:d8` | 353,9 | **400,2** |
| | **soma do adaptador** | 710,9 | **798,5** |
| `ac:a7:f1:00:00:ce` | `…13:eb:ab` | 743,2 | **796,8** |
| `d8:44:89:00:00:c4` | `…e6:42:03` | 753,1 | **800,8** |

**Três adaptadores, duas safras diferentes (um 5.0 e dois 5.4), todos dentro de
0,6% de 800 Hz.** O adaptador com DOIS controles entrega o mesmo total dos
outros dois, dividido quase ao meio.

O que explica o formato, e isto é **HIPÓTESE, não medição**: um report de 78 B
cabe num `3-DH1`, que ocupa **uma** fatia; com a fatia de volta do master, o
ciclo é de 1,25 ms — 800 Hz. Com dois controles, cada um pega um ciclo sim,
outro não: 400 Hz cada.

### O que isto derruba, e o que NÃO derruba

**Derruba os 260,4 Hz por controle como número desta bancada.** O medidor de
`CONFIG-04` modela a entrada como **aditiva por controle**
(`HZ_INPUT_SEM_MIC = 260,4`, do A/B de 25/07/2026 com UM controle). O físico
desta mesa diz outra coisa: o orçamento é **do adaptador** e os controles o
dividem. A barra diz `16%` para um link que está entregando ~800 relatórios por
segundo.

**NÃO derruba a conclusão de produto, e é importante dizer.** O que a E2 promete
é que o microfone **não abre canal novo** — ele divide a fila que já existe. O
formato medido hoje *reforça* isso: o link tem orçamento fixo, e o que muda é
como ele é repartido. O alvo dela — quatro controles com tudo ligado — continua
de pé pela mesma razão.

**NÃO mexi nas constantes.** Elas são decisão R1/R3 do PO, e o cabeçalho de
`radio_da_mesa.py` diz por que o medidor usa o nominal e nunca uma medição ao
vivo. Trocar 260,4 por 800/N é decisão de produto, e precisa do A/B refeito com
a régua nova — com o microfone ligado, que é o que ficou por fazer.

### E um candidato para a pergunta ABERTA do `radio_da_mesa.py`

O cabeçalho daquele módulo registra como **ABERTA** a desigualdade entre dois
DualSense do mesmo adaptador: *"381,54 e 191,40 Hz — quase o dobro um do outro,
com a mesa FOLGADA"*, e ela *"atravessou a troca de braços"*.

Hoje, no mesmo par de controles do mesmo adaptador:

* pela régua do **laço**: 282,1 e 348,5 numa passagem, 357,0 e 353,9 na
  seguinte — desigual, e desigual de um jeito diferente a cada vez;
* pela régua do **relógio do aparelho**: 398,3 e 400,2 — **iguais**, e iguais
  nas duas passagens.

E o mesmo nó, medido sozinho, deu 780 Hz onde a leitura em paralelo dos quatro
deu 638 Hz — o laço em Python é o gargalo, e ele reparte mal.

**A desigualdade está no LEITOR, não no rádio** é um candidato forte para
aquela pergunta. **Não a fecho:** não refiz o ensaio de 15/08 com a régua nova,
e o número de lá saiu de outro instrumento. Mas diz onde olhar, e diz que o
próximo ensaio de taxa tem de usar o carimbo do sensor.

### Como refazer

```bash
# uma janela de 10 s por controle, um de cada vez, SÓ LEITURA
#   régua 1: read() que voltaram
#   régua 2: avanços do seq_tag
#   régua 3: carimbo do sensor (offset 29, uint32 LE), com a taxa do relógio
#            DERIVADA dos próprios dados
```

O que **não** serve: ler os quatro nós em paralelo no mesmo processo Python (o
laço vira o gargalo e inventa desigualdade), e contar `read()` sem conferir se
os carimbos são únicos (um duplicador engana as duas primeiras réguas juntas).

---

## O que foi ENTREGUE — 25/08/2026 (E3, o que não precisa de bancada)

A E3 continua **DELA**: sem adaptador Bluetooth na máquina — `/sys/class/bluetooth/`
vazio desde as 02h36 — o ensaio dos quatro microfones não é executável. O que
saiu hoje é o que estava embaixo dele.

### 1. O CENSO HONESTO — o `bt_mic_enabled` não tem mais três leitores, tem ZERO

**FATO SUBSTITUÍDO.** A frase *"`bt_mic_enabled` é lido por três lugares e
escrito por nenhum"* descreve **22/08**, e a entrega de 23/08 a derrubou: o
campo **não existe em `src/`**. Sobrou só em nota datada — o cabeçalho de
`daemon/subsystems/bt_mic.py:41` e o de
`app/actions/config/secao_controles.py:383`, que explicam por que o `bool` saiu.
Onde a frase ainda aparece no PRESENTE, ela está errada: `SPRINT_ORDER.md:760` e
`:970`.

O gate de hoje é outro, e tem escritor:

| papel | onde, com linha |
|---|---|
| **o valor** | `utils/maquina.py:462` — `ControleDeclarado.microfone: bool \| None` |
| **escritor 1/2** | `app/actions/config/secao_controles.py:1017` `_ao_alternar_o_microfone` → `_ao_declarar` (rascunho; quem grava é o "Aplicar") |
| **escritor 2/2** | `daemon/ipc_handlers.py:4941` `_handle_machine_declare` — grava o `maquina.json`, rebinda `daemon._maquina` e chama `reconciliar_bt_mic` (`:5034`) |
| leitor | `daemon/lifecycle.py:804` — fia `DaemonConfig.bt_mic_uniqs = lambda: uniqs_declarados(self._maquina)` |
| leitor | `daemon/subsystems/bt_mic.py:142` `uniqs_pedidos` · `:175` `alvos()` — o filtro que faz o "por controle" |
| leitor | `daemon/lifecycle.py:3658` `_start_bt_mic` (`is_enabled`) · `:3702` `reconciliar_bt_mic` |
| leitor | `daemon/ipc_handlers.py:3047` — publica `bt_mic.{enabled,running,uniqs}` |
| leitor | `app/actions/config/secao_mesa.py:825` e `secao_orcamento.py:660` — a barra do rádio |

### 2. A ARBITRAGEM QUE FALTAVA, na porta que dava para fechar

**O achado:** a ponte tem **duas portas de produção**, em **dois processos**, e
nenhuma sabia da outra — `cli/cmd_mic.py::_mic_bt` e
`daemon/subsystems/bt_mic.py::BtMicSubsystem`. Cada `PonteMicBluetooth` carrega o
próprio contador de sequência do `0x32`: as duas no mesmo controle reproduzem o
quadro do `O-PS-PRESO` **sem kernel nenhum no meio**.

`mic bt` passou a ler `daemon.state_full` → `bt_mic.uniqs` (a chave que a E2
publica desde 23/08) e **não sobe ponte em cima de quem já tem uma** — na
entrada e a cada volta do laço. Daemon que não diz de quem são as pontes vira
recusa, não silêncio.

**O limite, declarado:** fecha o sentido CLI → daemon. O daemon não sabe que o
CLI existe, então o outro sentido continua aberto — e ele é o **5.a**, a
arbitragem do nó no broker (`_cmd_open`: *"`open` NÃO altera lease/refcount"*).

### 3. O PORTÃO 5.b, que o `O-QUE-FICOU-ABERTO-01` tabelou e ninguém escreveu

`tests/unit/test_portao_a_ponte_do_mic_espera_a_arbitragem.py`. Ele **não**
reprova a entrega de 22/08 — mantê-la é decisão dela, e portão vermelho todo dia
é portão que alguém apaga. Ele **congela a dívida**: enquanto a arbitragem não
existir, as portas são exatamente as duas declaradas, a janela não pode importar
quem abre o hidraw, e o dia em que o 5.a chegar o portão reprova para o registro
sair de lá.

### O que continua ABERTO, e é dela

* **o 5.a** — arbitrar o nó no broker, ou ela decidir que aceita o risco;
* **o ensaio dos quatro microfones** — precisa dos adaptadores de volta, do
  daemon reiniciado sobre a árvore fechada, e dela na sala.
