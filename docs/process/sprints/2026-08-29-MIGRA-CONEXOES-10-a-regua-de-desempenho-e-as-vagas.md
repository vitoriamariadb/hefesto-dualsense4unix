---
sprint: MIGRA-CONEXOES-10
onda: MIGRA-CONEXOES
posse:
  M10:
    - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
cria:
  - tests/unit/test_migra_conexoes_a_regua_do_radio.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  - MIGRA-CONEXOES-01
  - MIGRA-CONEXOES-03
  - MIGRA-CONEXOES-04
  # SÉRIE por arquivo: a 09 possui `secao_mesa.py` e desenha o inventário; esta
  # sprint tira os medidores de lá e os põe na página.
  - MIGRA-CONEXOES-09
  # O TETO GLOBAL SÓ VIRA LEITURA DEPOIS DE MUDAR DE ABA: quem o leva para a
  # Sistema como "Perfil de Bateria" é a MIGRA-SISTEMA-08, e ela também possui
  # `secao_orcamento.py`.
  - MIGRA-SISTEMA-08
  # SÉRIE por arquivo (R5): também possuem `secao_orcamento.py`/`secao_mesa.py`.
  - ONDA-CONEXOES-02
  - ONDA-CONEXOES-07
  - ONDA-CONEXOES-09
  - MOTOR-DO-ARRANJO-01
  - LEVA-2
  - LEVA-4
nao_toca:
  - src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/plano_de_radio.py
  - src/hefesto_dualsense4unix/app/widgets/sensor_widgets.py
  - src/hefesto_dualsense4unix/core/rumble.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/telas/aba08.py
---

# MIGRA CONEXÕES · 10 — a régua de Desempenho, e as vagas que ninguém calcula

**O defeito: a régua muda de forma, e uma das formas novas é conta que não existe
em lugar nenhum do produto.**

Hoje são **duas fatias por adaptador** (entrada + áudio), desenhadas por
`app/actions/config/secao_mesa.py:1306` (`_desenhar_medidores`) e `:1341`
(`_fileira_do_medidor`), no widget `app/widgets/sensor_widgets.MedidorDeRadio`.

O mockup pede quatro coisas, e só as duas primeiras existem:

1. **um bloco por controle**, na cor do plástico dele — deriva do que já se lê;
2. **o bloco laranja do microfone** de cada um — `CUSTO_COM_MIC − CUSTO_SEM_MIC`;
3. **as vagas tracejadas** — *"e se os meus quatro viessem para o rádio"*;
4. **o eixo** (0 · 400 · 800 · 1.200 · 1.600) e a **legenda**.

**As vagas são aritmética nova.** Nenhuma função do produto responde "quantos dos
meus controles ainda cabem neste adaptador, com microfone". A pergunta que a
régua passou a fazer deixou de ser *quantos caberiam* e virou *e se os meus N
viessem para cá* — e isso é conta sobre `CUSTO_COM_MIC` e o teto, escrita hoje só
dentro do gerador do mockup.

## Os números têm dono, e ele não é esta tela

Todos vêm de `integrations/radio_da_mesa`: `SLOTS_POR_SEGUNDO` (1.600),
`SLOTS_POR_RELATORIO`, `HZ_INPUT_SEM_MIC`, `HZ_INPUT_COM_MIC`,
`HZ_AUDIO_COM_MIC`, os cortes `CORTE_FOLGADA`/`CORTE_APERTADA`, as três
`PALAVRA_*` e `ocupacao_por_adaptador`. O gerador do mockup **já os lê por AST**,
e a razão está escrita nele: sete literais estavam digitados na tela e **um
oitavo estava errado pelo dobro** — a dica dizia que "Bateria longa" corta a
força em 60% quando o produto corta em 30%, e nenhuma régua podia vê-lo. **A
página no produto lê pelo Python, e continua sem um único literal.**

**E o que a tela promete tem de continuar honesto.** A dica do mockup diz, e é
verdade: os 1.600 turnos são especificação do Bluetooth Classic (625 µs cada) e
**nunca foram medidos aqui**; os custos por controle são o A/B desta bancada de
25/07/2026 **com um** controle; a soma de quatro é **derivada**, e o maior ensaio
de rádio desta casa foi de **dois**. Apagar essa confissão é o defeito que o
`check_paridade_transporte.py` existe para reprovar.

## O que entrega

1. **Uma conta só para o rádio.** Hoje a ocupação dos 1.600 é medida por **dois
   caminhos**, um logo abaixo do outro (a barra "Rádio em uso" e o texto do
   Desempenho) — a `D-AS-ABAS-CONVERSAM` chamou isso de *"falha grotesca"*. A
   `MIGRA-CONEXOES-04` já pôs o payload num lugar só; esta sprint mata o segundo
   caminho.
2. **A pista por adaptador**, com um bloco por controle **presente naquele
   adaptador**, o bloco do microfone de quem o tem pelo rádio, e as vagas.
   Adaptador sem controle mostra o vazio, não some.
3. **As vagas ganham dono em `src/`.** A conta sai do gerador do mockup e vira
   função do produto, ao lado das outras de `radio_da_mesa` — o gerador passa a
   lê-la por AST como já lê as sete constantes. **Enquanto ela viver só no
   gerador, a tela do produto e a tela aprovada podem divergir sem que régua
   nenhuma veja.**
4. **O teto global some desta aba, e ela vira leitora.** O dropdown dos três
   perfis (`PERFIS`, `ROTULOS_DOS_PERFIS`, `TETO_POR_PERFIL`, `SEM_TETO` de
   `secao_orcamento.py`) muda-se para a aba **Sistema**, onde se chama **Perfil
   de Bateria** — decisão dela, 28/08. **O código já lhe dava razão antes do
   nome:** a chave interna é `PERFIL_BATERIA_LONGA`. Esta aba continua **lendo** o
   valor em vigor, porque o `?` do campo de cada controle precisa dizer qual dos
   dois tetos está valendo.
5. **A régua não some quando o daemon está parado.** Sem estado, ela mostra o
   teto e diz que não sabe a ocupação — nunca uma barra vazia que se lê como
   "rádio livre".

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_a_regua_do_radio.py`:

* **nenhum número digitado.** Varredura do módulo e do HTML gerado: nenhum
  `1600`, `1.600`, `260`, `276`, `1107` literal. **Mordida:** escreva `1.600` na
  página e o teste diz a linha. É o oitavo literal, e ele já esteve errado pelo
  dobro uma vez.
* **as constantes vêm do dono.** Renomeie `HZ_AUDIO_COM_MIC` num dublê de
  `radio_da_mesa` e a montagem tem de **parar em voz alta**. **Mordida:** troque
  o `raise` por um `default` e veja o número sumir da tela em silêncio.
* **uma conta só.** Contar quantas funções distintas produzem "turnos usados"
  nesta aba → **1**. **Mordida:** ligue de novo o segundo caminho e veja duas
  respostas para a mesma pergunta, uma abaixo da outra.
* **as vagas conferem com a soma.** Para uma mesa de N controles, `usado +
  vagas × CUSTO_COM_MIC ≤ TETO`, e a última vaga é a que não cabe. **Mordida:**
  troque `CUSTO_COM_MIC` por `CUSTO_SEM_MIC` na conta das vagas e o teste
  reprova — a vaga é para quem vem **com** microfone, porque o microfone segue o
  transporte.
* **a confissão continua na tela.** As três frases (o 1.600 é spec e não
  medição; o custo é de um controle; a soma é derivada) existem no HTML.
  **Mordida:** apague uma e veja reprovar.
* **daemon parado não vira rádio livre.** Sem estado, a barra não é pintada como
  zero. **Mordida:** pinte zero e o teste reprova.

## O que é dela decidir

* **Dois controles do mesmo plástico ficam com dois blocos idênticos** na régua —
  o número do jogador dentro do bloco atenua e não resolve. É a mesma pergunta da
  borda, e continua aberta desde 26/08.
* **A seção continua chamando-se "Desempenho"?** Ela perdeu o dropdown para a
  aba Sistema e sobrou só a régua. "Rádio em uso" foi proposto e cai numa
  repetição com o subtítulo, que é frase **dela**. Escolha registrada, e ela pode
  derrubá-la numa frase.
* **A régua mede o rádio de HOJE ou o rádio POSSÍVEL?** As vagas respondem a
  segunda pergunta dentro do mesmo desenho. Se a mistura confundir, elas viram
  um segundo estado da régua em vez de blocos no mesmo trilho — e isso é olho
  dela, não medição (`PROVA-DE-TELA-01`).
