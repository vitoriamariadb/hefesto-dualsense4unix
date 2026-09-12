---
sprint: MIC-NA-TELA-01
estado: feita
onda: MESA-COMPLETA
posse:
  ESCREVE:
    - src/hefesto_dualsense4unix/interface/aba02.py
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
cria: []
bancada: true
depois_de:
  # A mesma aba das outras duas — ver a nota na SOM-NA-TELA-01. Esta é a
  # ÚLTIMA da fila da `aba02.py`: ela precisa da bancada dela, e as outras não.
  - MIC-OS-QUATRO-01
  - MIC-SEM-FONTE-01
  - SOM-NA-TELA-01
  # SERIALIZADA PARA DEPOIS DA SEGUNDA LISTA DELA — 11/09/2026, e é o
  # mesmo precedente da lista anterior: a queixa VIVA vem primeiro. As
  # frentes abaixo reescrevem o TEXTO dos arquivos que esta sprint
  # também toca; medir ou desenhar sobre a prosa de ontem seria medir o
  # mundo de ontem — e a costura viraria «a última a gravar vence».
  - LINGUA-A3
nao_toca:
  - novo-layout/
---

# MIC-NA-TELA-01 — o botão aceso, e o piscando

> **ESTADO 2026-09-12: feita no CÓDIGO; o §4 continua sendo dela.** O 🎙 tem os
> três estados na tela publicada (`79bde59e`), e a inversão que ela pediu está
> de pé: apagado é mudo, `--green` firme é «no ar», `--green` pulsando é
> «captando». **Nada disso foi decidido do lado da tela** — o contrato de três
> estados já existia no byte que acende a luz do PLÁSTICO
> (`luz_do_mic.decidir`), o `state_full` passou a publicá-lo em
> `audio.luz_do_mic`, e `mesa_viva.estado_do_botao_do_mic` só TRADUZ o número
> na palavra do seletor. Foi assim que o `.mudo-i.on` de 06/09 pôde voltar sem
> repetir o que o derrubou: lá a classe vinha do gerador, aqui vem do aparelho.
>
> **O §3.4 (o limiar) foi respondido pelo dono que já existia**, e não chutado:
> quem decide «captando» é `integrations/nivel_do_microfone`, com HISTERESE —
> entra acima de `LIMIAR_ENTRA` (−24,0 dBFS) por 120 ms contínuos, e só apaga
> abaixo de `LIMIAR_SAI` (−30,0 dBFS) por `SEGURA_S` (0,6 s). Os 0,6 s são o
> que impede o botão de tremular entre duas sílabas.
>
> **O QUE CONTINUA SENDO DELA, e é metade da sprint (§4):** os apertos com o
> controle na mão para conferir o limiar na voz dela; o olho na piscada (ritmo
> de 1,2 s por ciclo — legível de longe, e não pode parecer defeito); e a
> palavra sobre a cor do aceso, hoje `--green` por eliminação, já que `--red`
> está proibido pela §1. Enquanto ela não olhar, a sprint está feita mas **não
> aprovada** — interface só fecha com o olho dela (PROVA-DE-TELA-01).

**Lote B, sprint 3.** E ela **nasceu de um pedido dela**, dito com todas as
letras em 10/09/2026 e interrompido pela bancada do teclado fantasma:

> *"vamos lá na interface invertemos o botão mic ele aceso (vai indicar que
> agora tá gravando audio, ele captando audio vai ficar no estado de piscando
> (guia visual pro leigo que pegar o controle de primeira)), eu posso apertar
> os botões de mic pra vc e vc registrar o que for necessário pode ser?"*
> <!-- noqa-acento: citação literal dela -->

## §0 — O CONTRATO QUE ELA DESENHOU, em três estados

| botão 🎙 | quer dizer | quem sabe |
| --- | --- | --- |
| **apagado** | mudo — não está gravando | `audio.mic_mudo`, LEITURA do byte do firmware |
| **aceso** | gravando — o canal deste controle está no ar | o canal publicado daquele `uniq` |
| **piscando** | captando — está chegando áudio AGORA | o nível vivo (`mic-onda-*` já existe) |

**A INVERSÃO É O PONTO, e é o que ela pediu:** hoje o botão fala a língua de
quem programa (*"calar"*, `mudo-i`) e ela quer a língua de quem pega o controle
pela primeira vez — *aceso = estou gravando*.

## §1 — O ESTADO MEDIDO, em 10/09/2026

| peça | está lá? |
| --- | --- |
| o botão `🎙` por controle, com `uniq` no clique | **sim** — e ele já confessa quando o daemon mexe em outro |
| o selo `MUDO`/`ATIVO`/`—` (três estados, um dono) | **sim** — `mesa_viva.selo_do_mic` |
| a barra de nível viva (`mic-onda-0..13`) | **sim**, no cartão |
| **o botão ACESO** | **não** — `.mudo-i.on` foi REMOVIDO em 06/09/2026 |
| **o botão PISCANDO** | **não existe em lugar nenhum** (zero `@keyframes`, zero `blink`) |

**O `.mudo-i.on` não caiu por descuido, e a razão precisa entrar nesta sprint.**
O gerador registra: ela pintava `--red` (a cor da FALHA nesta casa) num ♪ calado
por escolha dela, e no 🎙 do segundo cartão a classe vinha do GERADOR e não do
aparelho — *a cor congelada que a decisão 02-Q9 mandou tirar*. E o arquivo
fechou com a regra: *"CSS de elemento que ninguém mais escreve é promessa
esperando alguém tropeçar nela"*.

> **A LIÇÃO QUE SOBRA:** o aceso volta **só** com escritor vivo, lido do
> APARELHO, e **não** em `--red`. Se ele voltar como classe de gerador, cai de
> novo, e com razão.

## §2 — POR QUE ELA NÃO PODIA RODAR ANTES DE HOJE

O terceiro estado — **piscando** — só existe enquanto o microfone está no ar. E
até a manhã de 10/09 **o microfone caía em ~1,1 s**: o `hid-playstation` lia os
quadros de áudio como estado de gamepad e desligava o mic sozinho.

Com a raiz curada (`patch/0003`, 1231 transições do bit viraram **uma**), o
piscando passou a ser um estado que existe tempo bastante para alguém ver.

**É por isso que esta sprint vem DEPOIS da B1 (MIC-OS-QUATRO-01):** pintar
"captando" em quatro cartões só faz sentido depois de medir se os quatro
microfones sobem juntos.

## §3 — O QUE FAZER

1. **o campo do estado**, com UM dono: `mic-botao-estado` valendo
   `mudo`/`gravando`/`captando`. Um dono só, como o `selo_do_mic` já é — a
   auditoria de 02/09 achou o mesmo ternário escrito duas vezes, e curar um
   deixaria as duas versões vivas;
2. **o CSS** no `aba02.py`: `.mudo-i.gravando` (aceso) e `.mudo-i.captando`
   (`@keyframes`, ~1,2 s por ciclo). **Nunca `--red`** — ver a §1;
3. **o pintor** em `a02_controles.py`, lendo do APARELHO: o mudo do byte, o
   canal do daemon, e o nível vivo que a `mic-onda-*` já usa;
4. **o limiar do "captando"** precisa de número, e ele não pode ser chutado: a
   barra de nível já tem a leitura; o que falta é dizer a partir de quanto o
   botão pisca, e por quanto tempo ele continua piscando depois do silêncio
   (senão ele tremula a cada respiração);
5. **a régua que morde**: com o mic mudo o botão não acende; com o canal no ar
   e nível zero ele acende e **não** pisca; com nível acima do limiar ele
   pisca. Arrancar qualquer um dos três tem de reprovar.

## §4 — O QUE É DELA, E É METADE DA SPRINT

**Ela se ofereceu, e a oferta é o instrumento:** *"eu posso apertar os botões
de mic pra vc e vc registrar o que for necessário pode ser?"*
<!-- noqa-acento: citação literal dela -->

O que só ela pode dar:

1. **os apertos**, com o controle na mão, para medir o limiar do §3.4 —
   falando, calada, e com o mic mudo;
2. **o olho na tela**: a piscada tem de ser legível de longe e não pode parecer
   defeito. Ritmo é decisão dela;
3. **a palavra sobre a cor do aceso**, já que `--red` está proibido pela §1.

**Nada disso roda sem ela na frente da mesa** — e é por isso que esta sprint
tem `bancada: true`, ao contrário da A3.

## §5 — A ORDEM

A **B1 (MIC-OS-QUATRO-01)** primeiro: quatro microfones ao mesmo tempo, medidos
(é o **G4** de
[OS GESTOS QUE SÓ ELA PODE FAZER](2026-09-10-OS-GESTOS-QUE-SO-ELA-PODE-FAZER.md)).
Depois esta, com o controle na mão dela.
