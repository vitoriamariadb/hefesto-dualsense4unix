---
sprint: ONDA-CONEXOES-13
estado: absorvida
onda: CONEXOES
posse:
  A13:
    - scripts/ensaios/microfone_emulado.py
    - docs/data/ensaios.csv
cria:
  - scripts/ensaios/microfone_emulado.py
  - tests/unit/test_o_ensaio_do_microfone_emulado_discrimina.py
bancada: true
depois_de:
  # O `docs/data/ensaios.csv` é ACRESCENTADO por linha, nunca reescrito — três
  # sprints antigas também o reivindicam, e nenhuma disputa as mesmas linhas.
  # A série é nominal: ela existe para o portão saber que a colisão foi vista.
  - COOP-NA-CONEXAO-NATIVA-01
  - RESERVA-DO-POSTO-01
  - SPECS-A-PROCEDENCIA-01
nao_toca:
  - src/
  - novo-layout/
  - docs/process/sprints/2026-08-27-ONDA-CONEXOES-06-o-microfone-muda-de-aba.md
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONEXÕES · 13 — quanto custa o microfone emulado

**O defeito, numa frase:** a `ONDA-CONEXOES-06` propõe um estado **Automático**
que escolhe sozinho entre o microfone Nativo e o Emulado, e **as duas medições
que decidem se ele pode existir não foram feitas**.

Esta sprint não escreve produto. Ela **mede**, e a medição é o entregável.

## Por que ela existe antes da 06

A `ONDA-CONEXOES-06` já declara as duas ausências, e declarou certo — ausência
declarada é honesta. Mas um **padrão** não se escolhe sem número:

> *"**NÃO MEDIDO:** a latência do caminho emulado contra o nativo. Microfone de
> jogo com atraso é pior que microfone ausente, e isso precisa de número antes de
> virar o padrão do Automático."*
> *"**NÃO MEDIDO:** se o mic pelo rádio aguenta o caminho emulado. Ele já custa
> 16,3 fatias do orçamento; o emulado pode custar mais."*

**Sem esta sprint, o Automático nasce como palpite** — e palpite que vira padrão
é o que esta casa chama de afirmação forte sem teste que a sustente.

## O que se mede, e o que separa uma medição de uma impressão

### Medição 1 — a latência do emulado contra o nativo

**A conta que importa não é o número absoluto**, é a **diferença**: o caminho
nativo já tem uma latência, e o que decide o Automático é quanto o emulado
acrescenta a ela.

O caminho emulado provável é `module-null-sink` + loopback do PipeWire. O que se
mede: **boca a jogo**, com o mesmo controle, o mesmo quantum e o mesmo aparelho,
alternando só o caminho. Três séries por caminho, e a mediana, não a média — uma
série de latência tem cauda, e a média a esconde.

**O ensaio tem de DISCRIMINAR**, e é isso que o separa de uma impressão: se o
número do emulado for igual ao do nativo dentro do erro de medida, o instrumento
está medindo o nativo nos dois lados. **Régua que não sabe distinguir os dois
casos não mede nenhum** — a casa tem cinco instrumentos falsos catalogados, e
todos os cinco davam número.

### Medição 2 — o rádio aguenta?

O orçamento é de **1.600 fatias** por adaptador. Os números medidos e já usados
pela `ONDA-CONEXOES-07` (`:42,:52`): **260,4** sem microfone e **276,7** com — o
microfone custa **16,3**, que é 6% do consumo de um controle.

O que se mede: o mesmo par, com o mic **Emulado**, e a leitura do orçamento pela
mesma fonte que a aba lê. **Nunca digitado** — é a disciplina que a
`ONDA-CONEXOES-07:52-56` já fixa, e digitar "276,7" nessa tela é o `HARM-19` de
novo.

**A pergunta é binária e o resultado tem três respostas:** o emulado custa
*menos*, *o mesmo* ou *mais* que 16,3. Se custar mais, o Automático precisa saber
recusar o emulado quando o rádio está apertado, e isso é desenho de tela — de
outra sprint, com a medição na mão.

## O que entrega

1. **`scripts/ensaios/microfone_emulado.py`**, no molde do  <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->
   `scripts/ensaios/cor_do_plastico.py`: travas no topo, o que ele toca declarado
   no cabeçalho, e **o alvo por argumento** — nunca por descoberta. Ele **não
   escreve no aparelho**; cria e destrói o caminho virtual do PipeWire, e devolve
   os números.
2. **As linhas no `docs/data/ensaios.csv`**, com `observado_por`, `fonte` e
   `nota` preenchidos — que é o formato desta casa desde 03/08 e é o que permite
   ao `specs.html` publicar a medição em vez de guardá-la num transcrito.
3. **O ensaio que DISCRIMINA, declarado como tal.** Cada medição vem com o seu
   **controle negativo**: a latência do emulado contra a do nativo no mesmo
   aparelho (e não contra um número de outro dia), e o orçamento com o mic
   emulado contra o mesmo par com o mic desligado. É a linha `lightbar-bt-neg` do
   CSV que dá o molde: *"o mesmo report fora da janela não trava; é a janela que
   discrimina"*.

## Como se prova — o teste que morde

`tests/unit/test_o_ensaio_do_microfone_emulado_discrimina.py`. **O teste mede o  <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->
instrumento, não o aparelho** — é o que permite rodá-lo sem bancada:

1. **Com uma série sintética de latência conhecida**, o ensaio devolve a mediana
   certa. Se ele devolver a média, reprova: a asserção usa uma série com cauda,
   em que média e mediana diferem.
2. **Com as duas séries IGUAIS**, o ensaio diz *"não discriminou"* e **não**
   publica um veredito. Instrumento que sempre dá resposta é instrumento que não
   mede — foi assim com os cinco falsos de 25/08.
3. **O orçamento é LIDO, nunca digitado.** Varredura por AST: o número `276,7`
   (e o `16,3`) não aparece como literal no ensaio. É a mesma régua da
   `ONDA-CONEXOES-07`.
4. **Sem PipeWire, o ensaio recusa com motivo visível** e `rc != 0` — nunca
   devolve zero fingindo medida. É a cicatriz do `validar-acentuacao.py
   --check-file`, que dava `rc=0` contra arquivo inexistente: **portão cego é pior
   que portão nenhum**.

**A mordida:** troque a mediana pela média e veja a 1 reprovar; faça o ensaio
publicar veredito com as duas séries iguais e veja a 2 reprovar; digite `276,7`
no lugar da leitura e veja a 3 reprovar. Cole as três saídas.

## O que é dela decidir

1. **A bancada.** Um DualSense no rádio e um jogo em máscara Xbox 360, com a
   mesa dela. `bancada: true` por isso, e o horário é dela.
2. **Se o Automático pode existir** — e essa resposta é o que a medição entrega,
   não o que ela precisa decidir agora. Se o emulado custar caro demais em
   latência ou em fatias, o Automático vira "Nativo, e Emulado quando o jogo não
   enxerga", que é uma regra e não uma escolha automática.
3. **Por máquina ou por perfil** (a quarta ausência da `ONDA-CONEXOES-06`): esta
   sprint **não responde**, e a pergunta está no `SPRINT_ORDER.md` §0. Um jogo em
   máscara Xbox quer Emulado e o de fora quer Nativo — o que empurra para *por
   perfil*, e isso muda o dono do campo.

## O que fica combinado com quem coordena

Esta sprint **não toca a ONDA-CONEXOES-06 nem `src/`**. Ela produz número. Quem
coordena leva o número à 06 e à decisão dela — e é aí que o Automático deixa de
ser proposta.

**E ela não depende de nada**: `depois_de: []`. Pode correr em paralelo com a
onda inteira, e quanto antes correr, menos chance de a 06 ser executada com um
padrão que ninguém mediu.
