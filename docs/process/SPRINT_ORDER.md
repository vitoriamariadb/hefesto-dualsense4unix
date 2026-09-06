# SPRINT_ORDER — o que está aberto e em que ordem

> **06/09/2026 — ESTE ARQUIVO FOI REESCRITO, e a fila é UMA.** O que estava
> aqui (as quatro filas de 04–05/09, as dez ondas de 27/08, as 120 antigas em
> seis faixas, os buracos de texto de 22/08) está no git:
> `git show f0e264e6:docs/process/SPRINT_ORDER.md`. Ela pediu com todas as
> letras: *"arrumar tudo em sprints, deixar só as que prestam agora e as
> depois, corrigir pra guiar o projeto sempre na direção correta"*. <!-- noqa-acento: citação literal dela -->
>
> **Fila combinada com ela vira arquivo no mesmo dia, e é uma.** Fila nova
> aposenta a anterior com data e ponteiro para o git — não empilha banner.

## 0. COMO SE LÊ UMA SPRINT AGORA — o campo `estado:`

Todo arquivo de sprint com frontmatter diz em que estado está, e a máquina lê:

| `estado:` | o que significa | quem muda |
| --- | --- | --- |
| **aberta** | vale, e pode ser despachada. É a **única** que o despachante aceita e a única que disputa posse no portão de colisão | quem a fecha |
| **feita** | entrou; a prova está na nota datada do topo do arquivo | quem fechou, no mesmo commit |
| **absorvida** | o que dela falta vive em outro lugar — uma linha do CSV da paridade, outra sprint — e a nota diz onde | quem coordena |
| **caducou** | a premissa morreu (a janela GTK, o enxerto, uma decisão dela) | quem coordena |

* **A lista viva:** `python3 scripts/check_colisao_de_sprints.py --abertas`
  — 59 em 06/09 às 04:30, 34 delas dentro das 24 horas.
* **Sem frontmatter é história.** São 253 arquivos, todos de antes de 27/08
  mais alguns documentos (índices, manifestos, as folhas de decisão). Para
  executar um deles, escreve-se o frontmatter com `estado: aberta`, o portão
  de colisão fica verde e ele entra na §2 — antes disso, ninguém o despacha.
* **Quem fecha uma sprint troca o `estado:` no mesmo commit** e escreve a
  prova na nota do topo. Este arquivo LISTA; ele não guarda estado.
* **A régua da fila de produto é o `docs/data/paridade-gtk-html.csv`**
  (396 feats · 119 IGUAL · 125 DIFERENTE · 89 FALTA · 30 % em 06/09). Sprint
  antiga não se despacha pelo id: se o que ela pedia ainda falta, é linha do
  CSV, e é por essa linha que nasce trabalho.
* **A língua é uma:**
  [A LÍNGUA DESTA CASA](../A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md).
  Texto de tela novo passa por ela antes de nascer.

---

## 1. AGORA — as vinte e quatro horas (06/09)

A fila executável é
**[AS VINTE E QUATRO HORAS](2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md)**,
e o Opus é o PO e orquestrador. Em uma tela:

| quando | o quê | agentes |
| --- | --- | --- |
| Passo 0 | o lançador em `dev`, a árvore de integração, a casa | coordenador |
| **Passo 1 · h0–h1,5** | **A-TELA-SAMBA-01**, sozinha — a interface repinta, perde cliques e mata a dica. É P0: um produto que perde cliques invalida toda prova de tela feita sobre ele | 1 |
| ONDA A · h1,5–h5,5 | S-10 · P-01 · 01-02 · 02-02 · 05-01 · 05-02 · 06-01 · 07-02 · 08-01 · 09-01 · 10-01 · MIC-VIRTUAL-01 (passos 2–4) · C1 (o registro) | 12 + coord. |
| ONDA B · h5,5–h10 | 01-01 · AS-DUAS-ABAS-FALAM-01 · 02-01 · 05-03 · 06-02 · 07-01 · 08-02 · 09-02 · LUZES-01 · **PERFIS-SAO-PERFIS-01** · **ONDA3-MOTOR-01** · **GTK-1** | 12 |
| ONDA C · h10–h15 | 03-02 · 07-03 · 10-02 · MIC-VIRTUAL-02 · T-10 (CONEXOES-LIGAR-TUDO-01) · STEAM-INPUT-01 · SISTEMA-STEAM-01 · CONTROLES-VERDADE-01 · NAVEGACAO-TECLAS-01 · **GTK-2** | 10 |
| ONDA D · h15–h19 | PERFIL-MODO-01 · PARIDADE-REMEDIR-01 · **ONDA3-GESTO-DECLARA-01** · **GTK-3** (começa) | 3 + coord. |
| ONDA E · h19–h21 | JOGAR-O-QUE-FALTA-01 (com a 01-03) · **A-PALAVRA-MESA-SAI-01** · GTK-3 (termina) · O-LOGO-NAS-DEZ-01 (o coordenador, na costura) | 3 |
| FECHO · h21–h24 | merge em `dev` · 43 portões · doze lotes · as dez fotos · **ela:** publicar numa volta só · `install.sh` pelo Opus com a palavra dela · **MESA-DE-QUATRO-01**, com o ensaio 1 do som por rádio · o handoff | coord. + ela |

As sprints em negrito entraram na fila em 06/09; as que o plano marca como
*nova* (LUZES-01, STEAM-INPUT-01, SISTEMA-STEAM-01, CONTROLES-VERDADE-01,
NAVEGACAO-TECLAS-01, PERFIL-MODO-01, PARIDADE-REMEDIR-01, JOGAR-O-QUE-FALTA-01,
MIC-VIRTUAL-02, GTK-1/2/3) o Opus escreve no molde de 05/09 **antes** de
despachar, com frontmatter e `estado: aberta`, e roda o portão de colisão.

**O que estas 24 horas NÃO fazem, por decisão dela:** controles externos, o
editor avançado de regra, "Mapear Entrada a Entrada", o resto dos 89 FALTA
que não é de jogar, o som por rádio além do ensaio 1. Está tudo na §2.

---

## 2. DEPOIS DAS 24 HORAS — em ordem, e com a direção corrigida

Tudo o que vem depois **já tem sprint escrita com `estado: aberta` ou tem
linha no CSV**. A ordem é de valor para quem joga com quatro DualSense, que é
o foco que ela nomeou.

### 2.1 O que a bancada dos quatro remede (nasce no FECHO)

A [MESA-DE-QUATRO-01](sprints/2026-09-06-MESA-DE-QUATRO-01-quatro-dualsense-por-cabo-e-por-radio-com-ela.md)
tem doze linhas com PASSA/REPROVA; **cada REPROVA vira uma sprint nova com
posse**, e cada PASSA fecha a sprint antiga com a linha da bancada como prova.
As antigas que ela remede — todas *não remedidas desde 27/08*:

* com frontmatter, `aberta`: COOP-QUE-NAO-DESMONTA-01 · BORDA-DE-QUEDA-01 ·
  QUATRO-NA-MESA-01 · JOGADOR-3-FANTASMA-01 · RESERVA-DO-POSTO-01 ·
  COOP-NA-CONEXAO-NATIVA-01 · BATERIA-PARADA-01 · LUZ-NO-RADIO-01;
* sem frontmatter (história até a bancada dizer): DUAS-CONTABILIDADES-01,
  PARTIDA-PICOTADA-01, POSSE-POR-CONTROLE-01, LUGAR-A-MESA-01,
  ORDEM-DE-CHEGADA-01, QUATRO-NO-RADIO-01, DOIS-CAIRAM-DE-UMA-VEZ-01,
  AUTOMATISMO-MORTO-01, CONECTA-E-DESLIGA-01, JOGAVEL-EM-TODOS-01.

**Ninguém despacha uma destas pelo id antes da bancada.** Em 03/08 elas eram
propostas sobre um daemon que mudou vinte vezes; a bancada é mais barata que
reler as dezoito.

### 2.2 A janela GTK sai — e sai DENTRO das 24 horas

Decisão dela de 06/09 (`D-0609-GTK-LEVA-INTEIRA`): *"a ideia sempre foi
reaproveitar o que fiz no gtk e não apontar nada mais pra lá mas pro html."* <!-- noqa-acento: citação literal dela -->
O plano é a
[A-JANELA-GTK-SE-APOSENTA-DEPOIS-01](sprints/2026-09-05-A-JANELA-GTK-SE-APOSENTA-DEPOIS-01-o-plano-e-a-data-em-que-ele-parou.md),
liberada; as três sprints (GTK-1 inventário e portão *"nada aponta para a
janela"*; GTK-2 os leitores do `main.glade` ganham dono no motor; GTK-3 os 62
testes, a remoção, `pyproject`/`packaging`/`install.sh`) estão nas ondas B, C
e D–E. **O motor fica** (`app/actions/`, `app/widgets/`, `daemon/`): é reuso.
`gui/ponte_da_tela.py` é do piloto HTML e não sai.

### 2.3 O resto da paridade, por aba — o CSV é a fila

FALTA por aba em 06/09, antes das ondas: `02-controles` 18 · `01-jogar` 14 ·
`08-conexoes` 12 · `04-iluminacao` 11 · `10-perfis` 11 · `09-sistema` 9 ·
`05-vibracao` 6 · `07-lancadores` 5 · `06-navegacao` 2 · `03-gatilhos` 1. A
meta das 24 horas é FALTA ≤ 60; o que sobrar continua na régua, e a
PARIDADE-REMEDIR-01 é quem diz o número. **Fora por decisão dela:** o editor
avançado de regra (10-Q2), a cerimônia "Mapear Entrada a Entrada" (08), o
custo da máscara antes do clique (10-Q6, *a máscara não custa feature*).

As réguas do esquema do perfil por controle — QUEM-E-QUEM-02, 03 e 04 —
ficam aqui, `aberta`, não remedidas desde 29/08; a 02 espera a
PERFIS-SAO-PERFIS-01 (mesmo `loader.py`).

### 2.4 Áudio pelo rádio

O **ensaio 1** da bancada do rádio (som no rádio, 4 min, a orelha dela) é no
FECHO, dentro da MESA-DE-QUATRO-01. Depois dele, e só se ele der som:
[O-ALTO-FALANTE-VIRTUAL-01](sprints/2026-08-29-O-ALTO-FALANTE-VIRTUAL-01-o-som-do-controle-ganha-o-que-o-gamepad-ja-tem.md)
(o nó que o sistema vê) e
[SOM-QUE-SAI-01](sprints/2026-08-29-SOM-QUE-SAI-01-o-alto-falante-virtual.md)
(o motor, do sink ao byte). Os outros 22 ensaios da
[A BANCADA QUE O RÁDIO PEDE](sprints/2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md)
são dela, na ordem daquele índice. O microfone pelo rádio **não está aqui**:
é a MIC-VIRTUAL-02, nas 24 horas.

### 2.5 Controles externos

[EXTERNOS-01](sprints/2026-09-06-EXTERNOS-01-o-nintendo-pro-e-o-8bitdo-na-mesa-e-nos-cards.md)
(escrita em 06/09 por ordem dela, e fora das 24 horas por ordem dela),
[O-CONTROLE-SEM-MAC-01](sprints/2026-08-29-O-CONTROLE-SEM-MAC-01-o-usuario-que-a-mesa-desta-casa-nao-tem.md),
e a família 8BitDo sem frontmatter (IDENT-01, IDENTIDADE-DUPLA-01,
REGRA-NAO-REGISTRO-01, N-IGUAL-A-UM-01, UMA-FAIXA-NAO-E-UM-FABRICANTE-01) —
esta última destrava com dois minutos dela: ligar o 8BitDo em cada modo e
anotar o endereço.

### 2.6 Daemon, teclado na tela, empacotamento

* [DAEMON-ACORDADO-01](sprints/2026-08-23-DAEMON-ACORDADO-01-quinze-por-cento-de-um-nucleo-sem-ninguem-jogando.md)
  — o Passo 4 da A-TELA-SAMBA-01 mede o custo de `profile.list` (33 perfis com
  `FileLock` a cada ~3 s) e pode fechar parte disto;
* [ESCONDE-SO-O-HIDRAW-01](sprints/2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md);
* [O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01](sprints/2026-08-30-O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01-o-L3-abre-e-a-tela-cala.md)
  e [O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01](sprints/2026-08-30-O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01-quem-fecha-o-que-o-daemon-abriu.md)
  — o L3 que abre um teclado na tela dela; não remedidas desde 30/08;
* [A-TRAVA-DO-LED-NAO-SOLTA-01](sprints/2026-08-29-A-TRAVA-DO-LED-NAO-SOLTA-01-arma-em-dois-lugares-e-nao-solta-em-nenhum.md)
  — a linha 8 da bancada confirma ou fecha;
* [IDENTIDADE-01](sprints/2026-08-21-IDENTIDADE-01-o-projeto-ainda-se-chama-pelo-nome-dele.md)
  — o id do aplicativo e a migração, juntos;
* os oito de instalação sem frontmatter (CURA-QUE-FERE-01 primeiro, é o portão
  do padrão), quando a GTK-3 tiver mexido no `install.sh`.

### 2.7 O que só ela decide, e nenhuma sprint fecha

| a pergunta | trava |
| --- | --- |
| `D-QUAL-REGUA-MANDA-NO-ARRANJO` — o juízo por entrada ou a receita | [MOTOR-DO-ARRANJO-01](sprints/2026-08-25-MOTOR-DO-ARRANJO-01-o-calculo-que-so-existe-num-mockup.md) |
| o A/B do Vulkan | [ENGASGO-VULKAN-01](sprints/2026-08-23-ENGASGO-VULKAN-01-sessenta-quadros-por-segundo-e-setenta-engasgos-por-minuto.md) |
| quando abrir a [SPECS-A-PROCEDENCIA-01](sprints/2026-08-26-SPECS-A-PROCEDENCIA-01-de-onde-se-sabe-cada-linha.md) — a condição é dela: *"a interface ficou igual nos mockups e tudo tá funcionando"* | a sprint inteira |
| as 20 caixas do `DECISOES.md` (22/08) — a maioria caducou com o HTML; dois minutos com ela fecham o arquivo | nada de código |
| a tradução — *"não são prioridades"* (05/09) | nada |

---

## 3. O QUE CADUCOU OU FOI ABSORVIDO — por família, uma linha cada

A nota datada está no topo de cada arquivo; o `estado:` está no frontmatter.

| família | quantas | estado | onde vive o que sobrou |
| --- | ---: | --- | --- |
| 27/08 · **ONDA-\*** — o redesenho das dez abas na janela GTK | 90 + 10 índices | `absorvida` (a CONEXOES-11, `feita`) | o CSV, por aba |
| 29/08 · **MIGRA-\*** — a migração aba a aba | 109 + 10 índices + a ordem | `absorvida`; os onze *enxerto na janela GTK* e a CONEXOES-12, `caducou` | o CSV, por aba; a ROTA DO HTML |
| 29/08 · avulsas | 17 | 6 `feita` · 1 `absorvida` · 8 `aberta` (§2) · 2 documentos | — |
| 25/08 · LIGAR OS MÓDULOS À TELA | 1 índice | `absorvida` | — |
| 24/08 · EMULACAO-UM-DONO-SO-01 | 1 | `caducou` | A-MASCARA-POR-CONTROLE-01 (`feita`) |
| 31/08 · o plano de uma hora | 1 | `absorvida` | a ROTA DO HTML |
| 02/09 · **ROTA-\*** | 12 | `feita` (a G, `absorvida`) | ONDA5-10-\*, PERFIL-MODO-01 |
| 03/09 | 2 | IDENTIDADE-VEM-DE-CIMA-01 `feita` · CANAL-POR-CONTROLE-01 `absorvida` | MIC-VIRTUAL-02 |
| 04/09 · T-01…T-09 · ONDA0–ONDA2 · as folhas DECISOES-DELA | 9 + 16 + 11 | `feita` · respondidas | a ONDA CINCO |
| 05/09 · ONDA QUATRO | 13 | 12 `feita` · S-10 `aberta` (ONDA A) | — |
| antes de 27/08 · as 120 do antigo §4 e tudo sem frontmatter | 253 arquivos | história — não remedidas desde 27/08 | a §2.1 nomeia as que a bancada remede; o resto, se ainda faltar, é linha do CSV |

A fila em ondas de 23/08 e a FAXINA de 27/08 já eram lápide; continuam no git.

---

## 4. A REGRA DESTE ARQUIVO

1. **Quem fecha uma sprint muda o `estado:` no frontmatter dela**, com a prova
   na nota do topo, no mesmo commit — e não toca este arquivo para isso.
2. **Fila combinada com ela vira arquivo no mesmo dia, e é uma.** Fila nova
   aposenta a anterior com data e ponteiro para o git; não empilha banner.
3. **Sprint se cita pelo id do frontmatter** (`ONDA5-03-02`), nunca por número
   de onda solto: a fila já foi renumerada três vezes.
4. **Sprint nova nasce com frontmatter completo, `estado: aberta` e o portão
   de colisão verde.** O despachante recusa o resto — inclusive a que está
   `feita`.
5. **Decisão dela vira linha no `docs/data/decisoes-dela.csv` no mesmo dia**,
   com a palavra dela verbatim. Sem isso a próxima leitura repete a pergunta.
