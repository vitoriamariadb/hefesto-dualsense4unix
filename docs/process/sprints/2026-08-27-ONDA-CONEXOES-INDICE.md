---
sprint: ONDA-CONEXOES-INDICE
posse:
  COORDENA:
    - docs/process/sprints/2026-08-27-ONDA-CONEXOES-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# ONDA CONEXÕES — o índice

**A aba do ambiente**, do estado de hoje ao que o mockup mostra. **Treze
sprints** — as dez de 27/08 pela manhã, mais três que a medição da cor por rádio
daquela noite tornou necessárias (11, 12 e 13).

*Responde: "por que o controle no rádio engasga aqui, e o que eu faço para a
minha máquina ficar igual à dela?"*

**Contrato:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8
(linhas 597-688) — toda linha do "Nada se perdeu" é requisito.
**Especificação visual:** `novo-layout/08-conexoes.html` e o gerador
`novo-layout/_ferramentas/aba08.py`.
**Correção dela sobre esta aba:** *"mds conexões é muita coisa pra arrumar. Veja
o padrão de correção que to pedindo nos anteriores e dispara um especialista em
visualização opus pra corrigir e nos apresentar algo melhor."*
(`novo-layout/_ferramentas/CORRECOES-DELA.md`) — o mockup de 27/08 às 01h19 é a
resposta a esse pedido, e é o alvo.

## As treze

| # | sprint | camada | tamanho | trava |
|---|---|---|---|---|
| 01 | [a moldura que cabe na tela](2026-08-27-ONDA-CONEXOES-01-a-moldura-que-cabe-na-tela.md) | frontal | ~200 | — |
| 02 | [o inventário físico da mesa](2026-08-27-ONDA-CONEXOES-02-o-inventario-fisico-da-mesa.md) | frontal | ~500 | — |
| 03 | [o exame em três colunas](2026-08-27-ONDA-CONEXOES-03-o-exame-em-tres-colunas.md) | frontal | ~450 | — |
| 04 | [a ordem diz o que mover para onde](2026-08-27-ONDA-CONEXOES-04-a-ordem-diz-o-que-mover-para-onde.md) | ambas | ~350 | **palavra dela** |
| 05 | [o card vira tira](2026-08-27-ONDA-CONEXOES-05-o-card-vira-tira.md) | frontal | ~600 | — |
| 06 | [o microfone muda de aba](2026-08-27-ONDA-CONEXOES-06-o-microfone-muda-de-aba.md) | ambas | ~500 | — |
| 07 | [uma conta só para o rádio](2026-08-27-ONDA-CONEXOES-07-uma-conta-so-para-o-radio.md) | frontal | ~450 | — |
| 08 | [a borda é a identidade da peça](2026-08-27-ONDA-CONEXOES-08-a-borda-e-a-identidade-da-peca.md) | ambas | ~200 | — |
| 09 | [a declaração grava na hora](2026-08-27-ONDA-CONEXOES-09-a-declaracao-grava-na-hora.md) | ambas | ~400 | **palavra dela** |
| 10 | [o confirmar não vira pulo no jogo](2026-08-27-ONDA-CONEXOES-10-o-confirmar-nao-vira-pulo-no-jogo.md) | backend | ~350 | **bancada** |
| 11 | [a cor se lê no rádio, e a semente é `0x53`](2026-08-27-ONDA-CONEXOES-11-a-cor-se-le-no-radio-e-a-semente-e-0x53.md) | backend | ~400 | **bancada** |
| 12 | [as 28 cores e as 10 zonas chegam ao produto](2026-08-27-ONDA-CONEXOES-12-as-vinte-e-oito-cores-e-as-dez-zonas-chegam-ao-produto.md) | backend | ~350 | — |
| 13 | [quanto custa o microfone emulado](2026-08-27-ONDA-CONEXOES-13-quanto-custa-o-microfone-emulado.md) | ensaio | ~300 | **bancada** |

## A ordem, e por quê

```
01   (solta)
02 ──► 03 ──► 04 ──┐
        │          │
        └──► 07    ├──► 09 ──► 10
05 ──► 06 ─────────┘

08 ──► 11 ──► 12         (as três dividem cor_do_plastico.py)
05, 09 ──► 11
13   (solta — não depende de nada, e quanto antes correr, melhor)

de fora da onda:  ONDA-VIBRACAO-01 ──► 05
                  ONDA-SISTEMA-02  ──► 06
                  ONDA-VIBRACAO-04/05 ──► 10
```

* **02 antes de 03** — as duas perguntas de rádio saem da seção da mesa e
  chegam à terceira coluna do exame. Entre uma e outra elas não estão em tela
  nenhuma: **buraco declarado**, não descuido.
* **03 antes de 04** — mesmo arquivo (`secao_exame.py`). A 03 dá a forma; a 04
  põe a receita dentro.
* **02 antes de 07** — a 02 tira as barras "Rádio em uso" e a 07 é o lugar
  único onde a conta passa a viver.
* **05 antes de 06** — mesmo arquivo (`secao_controles.py`).
* **09 por último entre as de tela** — ela toca as quatro seções, e só faz
  sentido depois de as quatro terem a forma final.
* **10 depois de 04 e 09** — as três compartilham o registro
  `portao_a_casa_sabe_e_o_produto_nao_faz.py`.
* **01 é solta** e pode correr do primeiro minuto: nenhuma outra sprint desta
  onda toca `secoes.py`/`mixin.py`/`moldura.py`.
* **08 ANTES DE 11, E 11 ANTES DE 12** — as três dividem `cor_do_plastico.py`, e
  quem divide arquivo executa em série (R5). A ordem é a do que cada uma muda: a
  08 dá o **contrato** da borda; a 11 muda **como** se lê (a semente `0x53`, e os
  três portões que hoje recusam o rádio); a 12 muda **o que** se sabe (28 modelos
  e 10 zonas, saindo do `docs/data/cores-do-dualsense.csv`).
* **11 depois de 05 e 09** — ela também toca `secao_controles.py`, e as duas o
  possuem antes dela.
* **13 é solta e não depende de nada** (`depois_de: []`). Ela mede o que a 06
  declarou como não medido; **enquanto não correr, o Automático do microfone é
  palpite**.

**Podem correr juntas desde o começo:** 01, 02, 05 (assim que a VIBRACAO-01
fechar), 08.

**Nenhuma sprint desta onda abre o `main.glade`.** O rótulo da aba muda em
código (a aba já é inteira montada em código), e o bloco do microfone na
Emulação é apagado por quem desmonta aquela aba. Foi escolha: o XML é recurso de
bancada disputado por toda a leva, e conflito de merge nele é irrecuperável na
prática.

## As travas — o que precisa dela antes de qualquer código

1. **Qual régua manda no arranjo** (`D-QUAL-REGUA-MANDA-NO-ARRANJO`) — trava a
   **04** inteira. A medição que ela pediu já existe:
   `tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py`.
2. **RESPONDIDA, e não trava mais.** *"As declarações desta aba gravam na hora,
   com recibo?"* está decidida desde 26/08 — `docs/data/decisoes-dela.csv:87`,
   `D-A-CONEXOES-GRAVA-NA-HORA-E-LEMBRA`, com a palavra dela: *"aplicar e salvar,
   além de gravar na hora e lembrar se não salvar."* O que sobra é a **redação do
   recibo**, e isso não trava a **09**: o mecanismo é o `RECIBO_GUARDADO` de
   `config/moldura.py`, e trocar o texto depois é uma constante.
3. **A bancada**, para a **10** — o controle na mão dela, com um jogo aberto
   atrás da janela de calibração.

## As quatro perguntas abertas que nenhuma sprint fecha sozinha

* **Dois controles do mesmo plástico ficam com a borda idêntica** — e agora
  também com o mesmo bloco na régua do rádio. Toca a 05, a 07 e a 08.
* **"A janela" vai mesmo para Sistema?** O mockup assumiu que sim (01).
* **O "corrigir" dos vizinhos volta como botão?** O mockup o eliminou e ela já
  foi avisada de que ele volta se ela quiser (02).
* **O carimbo de idade** — ela mandou tirar o carimbo na aba Perfis; aqui ele é
  do exame, e a distinção precisa da palavra dela (03).

## Coordenação com as outras ondas

| o que | quem entrega | quem recebe |
|---|---|---|
| "A janela" (tamanho do texto, ambiente do desktop) | CONEXÕES-01 | onda **Sistema** |
| o gesto do microfone e os widgets do Glade | **ONDA-SISTEMA-02** solta primeiro | CONEXÕES-06 pega depois |
| `desenho_do_controle.py` (o SVG na cor do plástico) | **ONDA-VIBRACAO-01** cria | CONEXÕES-05 é o segundo consumidor |
| a escolha do número de jogador | CONEXÕES-05 (vira leitura) | onda **Iluminação** |
| bateria, entradas ao vivo, glifos do card | CONEXÕES-05 (saem daqui) | onda **Controles** |
| a borda com o tom do plástico nas telas das outras abas | CONEXÕES-08 entrega o dono único e o portão | cada onda fecha a sua tela |

### As colisões que ficam, e quem as resolve

`check_colisao_de_sprints.py` acusa **45** colisões envolvendo esta onda, e
**nenhuma é interna** — as dez estão serializadas entre si. As que sobram são de
três famílias, e nenhuma se resolve dentro desta onda:

1. **Sprints de levas anteriores** (26): `CONFIGURACOES-O-LEXICO-01`,
   `ORDEM-DE-SERVICO-01`, `MOTOR-DO-ARRANJO-01`, `CONEXOES-MAPA-2D-01`,
   `CALIBRAR-AS-ENTRADAS-01`, `LIGAR-OS-MODULOS-A-TELA`, `LEVA-1`, `LEVA-4`,
   `JOGADOR-3-FANTASMA-01`, `VPAD-SUSPENSO-MORTO-01`,
   `NAVEGACAO-UM-CONTROLE-SO-01`. O desenho de 26/08 as substitui, e a
   decisão dela diz o que fazer. **FATO ERRADO, SUBSTITUÍDO (27/08/2026, à
   noite):** esta linha mandava *"marcar DESATIVADA, nunca apagar"*. Ela mudou:
   **sprint velha se APAGA — o git guarda.** Vinte e oito foram apagadas no mesmo
   dia, com o manifesto em `2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md`, que diz
   de cada uma qual sprint nova tomou o lugar. As que ainda reivindicam arquivos
   desta onda são as que a faxina reteve com a prova.
2. **`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`** (9): o registro é
   leva-wide — toda sprint que fecha uma lápide o edita. As entradas são
   independentes e os merges são locais à linha, mas o portão não sabe disso.
   Serializar as três desta onda (04, 09, 10) atrás de `ONDA-GATILHOS-05` e
   `ONDA-SISTEMA-06/07` é decisão de quem rege a leva, não desta onda.
3. **Posse de verdade em disputa** (4), e estas precisam de resposta:
   * `app/actions/config/secao_controles.py` — **ONDA-JOGAR-07** também o
     reivindica. É seção desta aba; quem coordena decide de quem é.
   * `daemon/subsystems/gamepad.py` — **ONDA-CONTROLES-07** também o
     reivindica (a CONEXÕES-10 já está serializada atrás da VIBRACAO-04/05).

## Nota de formato — para quem despachar

`scripts/check_colisao_de_sprints.py` **recusa** o campo `onda:` no frontmatter:
`_CAMPOS_CONHECIDOS` é `sprint, posse, bancada, cria, depois_de, nao_toca`, e
campo desconhecido é erro, não é ignorado (é a régua funcionando — campo com
erro de digitação que passa em silêncio vira posse não declarada). Por isso a
onda vive **no id da sprint** (`ONDA-CONEXOES-NN`) e não num campo próprio. Se a
casa quiser o campo, ele se acrescenta ao script — não a este arquivo.

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje, antes e depois
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh                # os 26 portões
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo
só, que morre no meio sem traceback.

**A palavra final é dela**, com a foto na mesa (`PROVA-DE-TELA-01`). Aprovar o
mockup não é aprovar a tela.

## O QUE ELA QUESTIONOU DEPOIS DE VER A ABA (27/08/2026, à noite)

Três marcações dela nesta aba, medidas antes de responder. Detalhe e prova em
`ONDA-CONEXOES-03`:

| o quê | o que a medição achou | quem decide |
|---|---|---|
| **As duas perguntas de rádio** | mudavam **uma frase de conselho**, não o veredito (`exame_da_mesa.py:519-540`) | **DECIDIDO: "PASSAM"** — entram no juízo do alcance |
| **Examinar de novo** | depende de o exame se refazer sozinho ou não — e isso ninguém decidiu | medir primeiro |
| **Ensinar as minhas entradas** | é o **passo 2** de "Desenhar a minha mesa", não um irmão dele | executor |

**A pergunta que não muda resposta é o padrão a caçar nesta aba.** Ela é a mais
verbosa do produto (88 textos fixos para 28 widgets), e parte desse peso é
exatamente isto: campo que pede informação e devolve o mesmo diagnóstico.
