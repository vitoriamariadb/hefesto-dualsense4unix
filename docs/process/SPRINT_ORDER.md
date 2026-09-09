# SPRINT_ORDER — o que está aberto e em que ordem

> **08/09/2026, à noite — ESTE ARQUIVO FOI REESCRITO, e a fila é UMA.** A fila
> anterior (as 24 horas de 06/09, o FECHO, o «depois das 24 horas») está no
> git: `git show b618a8aa:docs/process/SPRINT_ORDER.md`. As 24 horas fecharam em
> 07/09 (146 branches costuradas), o produto foi instalado em 08/09, e o que
> ela achou **com o produto instalado e os quatro DualSense na mesa** é a fila
> de agora. Pedido dela: *"organiza a Sprint order também"*.
>
> **O que a fila velha listava como «depois» FECHOU nas 24 horas** — as
> dezoito que a bancada remederia, os externos, o daemon, o teclado na tela, a
> identidade: todas `feita` ou `absorvida` em 08/09 (medido pelo `estado:` de
> cada arquivo). Não se repete aqui o que já tem lápide.

## 0. COMO SE LÊ UMA SPRINT AGORA — o campo `estado:`

Todo arquivo de sprint com frontmatter diz em que estado está, e a máquina lê:

| `estado:` | o que significa | quem muda |
| --- | --- | --- |
| **aberta** | vale, e pode ser despachada. É a **única** que o despachante aceita e a única que disputa posse no portão de colisão | quem a fecha |
| **feita** | entrou; a prova está na nota datada do topo do arquivo | quem fechou, no mesmo commit |
| **absorvida** | o que dela falta vive em outro lugar — uma linha do CSV da paridade, outra sprint — e a nota diz onde | quem coordena |
| **caducou** | a premissa morreu (a janela GTK, o enxerto, uma decisão dela) | quem coordena |

* **A lista viva:** `python3 scripts/check_colisao_de_sprints.py --abertas`
  — 18 em 08/09 às 23h30, de 637 com frontmatter.
* **Não há mais arquivo sem frontmatter:** os 637 dizem `estado:` desde as 24
  horas (medido em 08/09). O que é história está `feita`, `absorvida` ou
  `caducou`. Para executar um deles, troca-se para `estado: aberta` com a
  razão na nota do topo, o portão de colisão fica verde e ele entra na §1 —
  antes disso, ninguém o despacha.
* **Quem fecha uma sprint troca o `estado:` no mesmo commit** e escreve a
  prova na nota do topo. Este arquivo LISTA; ele não guarda estado.
* **A régua de pronto é uma, e é dela (08/09):** toda feature da tela responde
  **por cabo · por BT · no perfil · por controle** —
  [CABO-BT-PERFIL-CONTROLE-01](sprints/2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md). Toda sprint aberta carrega o bloco;
  sprint que fecha uma feature sem as quatro colunas não fecha.
* **A régua da paridade continua sendo o `docs/data/paridade-gtk-html.csv`**
  (396 feats · 144 IGUAL · 160 DIFERENTE · 29 FALTA · 59 só no HTML — 36 % em
  08/09). Sprint antiga não se despacha pelo id: se o que ela pedia ainda
  falta, é linha do CSV, e é por essa linha que nasce trabalho.
* **A língua é uma:**
  [A LÍNGUA DESTA CASA](../A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md).
  Texto de tela novo passa por ela antes de nascer.
* **Sem agentes nesta fila.** Ordem dela de 08/09: *"Não use agentes"*. É
  trabalho de quem conversa com ela, ponto a ponto, com o navegador.

---

## 1. AGORA — a fila de 08/09, à noite

O «por quê» de cada posição, com a medição que a sustenta, está no
[INDICE-0908-NOITE](sprints/2026-09-08-INDICE-as-quatro-que-ela-deixou-ao-desligar.md).
Aqui, a ordem e uma linha:

| # | sprint | o que fecha |
| --- | --- | --- |
| 0 | [CABO-BT-PERFIL-CONTROLE-01](sprints/2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md) | **a régua dela** vira portão: o portão que a sprint cria, com a tabela lida do mapa e do esquema, nunca digitada |
| 1 | [LANCADORES-ZERO-01](sprints/2026-09-08-LANCADORES-ZERO-01-a-aba-que-nao-identifica-nada-na-tela-dela.md) | o censo por lançador: o produto ACHA os seis e só lê a biblioteca da Steam; o Heroic tem 35 jogos da Epic — **a Epic fica dentro do Heroic**, decisão dela |
| 2 | [JOGAR-02](sprints/2026-09-08-JOGAR-02-o-reconectar-responde-sem-a-lingua-de-dentro.md) | a frase «Jogadores reconciliados…» sai; quando nada mudou, piscada e silêncio |
| 3 | [MIC-OS-QUATRO-01](sprints/2026-09-08-MIC-OS-QUATRO-01-os-quatro-microfones-funcionando.md) | **quatro microfones VIRTUAIS**, um por controle, cabo e BT — hoje: 2 fontes USB, 0 BT, 0 virtual |
| 4 | [SOM-POR-CONTROLE-01](sprints/2026-09-08-SOM-POR-CONTROLE-01-o-mix-completo-ou-o-canal-de-sfx-caindo-em-cada-controle.md) | o mix completo (HDMI) ou o canal de SFX, **caindo em cada controle**, cabo e BT; os nós de duas sprints `feita` não existem na mesa dela |
| 5 | [MASCARA-NO-PERFIL-01](sprints/2026-09-08-MASCARA-NO-PERFIL-01-a-mascara-por-controle-entra-no-perfil.md) | **decisão dela:** a máscara por controle entra no perfil (`ControllerOverrides`) |
| 6 | [VIBRA-MULT-01](sprints/2026-09-08-VIBRA-MULT-01-o-motor-multiplica-a-forca-por-controle.md) | degrau × barra por motor: a conta existe; a premissa física e o número da tela nunca foram medidos |
| 7 | [COR-TROCA-01](sprints/2026-09-08-COR-TROCA-01-a-cor-repetida-troca-de-lugar-em-vez-de-recusar.md) | a cor repetida troca de lugar, como o número do jogador — e escreve na camada em que a cor mora |
| 8 | [ROLAGEM-01](sprints/2026-09-08-ROLAGEM-01-a-barra-vertical-na-gatilhos-e-na-lancadores-e-os-blocos-que-dobram.md) | a barra vertical na 03 e na 07 (medir no WebKit), e os blocos L2/R2 que dobram |
| 9 | [SENSORES-NO-JOGO-01](sprints/2026-09-08-SENSORES-NO-JOGO-01-o-giroscopio-e-o-acelerometro-provados-ate-o-jogo.md) · bancada | giroscópio e acelerômetro até o JOGO — zero células «O JOGO RECEBEU» no mapa inteiro |
| 10 | [TELA-TRES-01](sprints/2026-09-08-TELA-TRES-01-a-altura-o-selo-e-a-caixa-alta.md) | a altura do «Detalhes técnicos»; `CABO`/`RÁDIO` em caixa alta |
| 11 | [LANCADOR-ACHADO-01](sprints/2026-09-08-LANCADOR-ACHADO-01-o-produto-so-acha-o-que-a-lista-adivinhou.md) | a busca por conteúdo (`Categories=Game`), depois do censo |
| 12 | [NADA-MOCKADO-01](sprints/2026-09-08-NADA-MOCKADO-01-a-varredura-do-que-e-de-verdade.md) | o portão «nada em sandbox ou mockado»; a tabela máscara × modo × transporte; o mapa **não é lido pelo produto** |
| 13 | [TUDO-FUNCIONA-01](sprints/2026-09-08-TUDO-FUNCIONA-01-o-que-falta-para-nada-ser-de-brinquedo.md) | o inventário honesto com o custo de cada falta; o destino de `pacotes/mapa.py` e `fatos_do_mapa.py` |

**Bancada — a hora dela, não de código:**

| sprint | o que espera |
| --- | --- |
| [MESA-DE-QUATRO-01](sprints/2026-09-06-MESA-DE-QUATRO-01-quatro-dualsense-por-cabo-e-por-radio-com-ela.md) | o roteiro das 21 linhas com os quatro na mão (`./validar.sh`); o §1 está pago |
| [LUZ-NO-RADIO-01](sprints/2026-09-01-LUZ-NO-RADIO-01-a-prova-que-falta-e-de-aparelho.md) | a linha 21 da mesa — há dois no rádio agora |
| [A-BANCADA-QUE-O-RADIO-PEDE-INDICE](sprints/2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md) | o ensaio 13 (o envelope do som por BT); as seis passadas de 08/09 ainda sem linha no caderno |

**Feitas em 08/09**, com a prova no topo: JANELA-01 · FITA-01 · JOGAR-01 ·
[LANCADORES-DELA-01](sprints/2026-09-08-LANCADORES-DELA-01-o-selo-o-botao-a-epic-e-o-que-o-hefesto-nao-conhece.md).

---

## 2. O QUE É DELA DECIDIR

**Decididas em 08/09** (verbatim no `docs/data/decisoes-dela.csv`, sete
linhas `D-0809-*`): a Epic fica **dentro do Heroic** (*"dentro heróic"*); <!-- noqa-acento: citação literal dela -->
a máscara por controle **entra no perfil** (*"pode entrar sim"*); e, com
*"concordo com as 5"*: **o modo é um para todos os controles**; **a navegação
é global no perfil**; **no cabo o som nasce em `sfx`**; **o nó de som por
controle vive sempre**; **o selo dos lançadores diz LOCALIZADO / NÃO
LOCALIZADO** — a palavra dela da manhã, não o ENCONTRADO que a lista da noite
ofereceu por engano.

**Sobram quatro, menores, com as opções escritas** — a recomendação é a (a):

| a pergunta | a) recomendada | b) | c) | onde está a medição |
| --- | --- | --- | --- | --- |
| **o fone (saída 2)** — hoje o byte do fone sai com o MESMO valor do alto-falante, e o kernel não define o bit que o autoriza; ninguém ouviu | um volume só; a **rota** diz para onde vai (0 estéreo→fone, 2 L→fone R→alto-falante); a tela deixa de oferecer volume do fone separado; uma linha da bancada: plugar e ouvir | campo próprio `fone` em `ControllerOverrides.speaker`, por controle, medido com o ouvido (sprint FONE-01) | sai da tela até ser ouvido | CABO-BT-PERFIL-CONTROLE-01 §1, linha do fone; mapa `audio.jack.volume` |
| **o brilho da barra** — o da tela é a cor escalada em Python; o de HARDWARE (`common[42]`, 3 níveis) nem o kernel escreve | fica a cor escalada, que é o que a tela oferece; o brilho de hardware sai da fila (o mapa já diz por quê) | medir o de hardware na bancada: escrever `common[42]` com o bit `flag2` e olhar (1 linha da mesa) | tirar o brilho da tela | mapa `luz.lightbar.brilho`; régua §1 linha 04 |
| **o volume do mic** — campo `ControllerMicOverride.volume` sem ato: o byte 6 nunca é escrito (`decisao-tomada`, 06/09) | o campo passa a agir no **nó virtual** daquele controle (volume da fonte no sistema), junto com a MIC-OS-QUATRO-01; o byte do aparelho continua quieto | o campo sai do perfil e da tela | ligar o byte 6 do aparelho (teto `0x40`; revoga a decisão de 06/09; bancada) | mapa `audio.microfone.volume`; MIC-OS-QUATRO-01 |
| **o nome dos nós na lista de som do sistema** | «Alto-falante do Controle 1» · «Microfone do Controle 1» | «Jogador 1 — alto-falante» · «Jogador 1 — microfone» | «DualSense 1 · som» · «DualSense 1 · mic» | SOM-POR-CONTROLE-01 §3; MIC-OS-QUATRO-01 |

E a frase do Reconectar quando algo mudou (JOGAR-02): as palavras são dela,
quando a sprint chegar.

---

## 3. DEPOIS — o que resta depois da §1, e onde está escrito

### 3.1 O resto da paridade, por aba — o CSV é a fila

FALTA no HTML em 08/09, 29 linhas: `10-perfis` 7 · `02-controles` 6 ·
`04-iluminacao` 5 · `05-vibracao` 4 · `08-conexoes` 3 · `09-sistema` 2 ·
`01-jogar` 1 · `03-gatilhos` 1. As 160 DIFERENTE são a régua dizendo *o HTML
faz de outro jeito* — cada uma tem `porque`, e só vira trabalho a que ela
sentir. **Fora por decisão dela:** o editor avançado de regra (10-Q2), a
cerimônia «Mapear Entrada a Entrada» (08), o custo da máscara antes do clique
(10-Q6, *a máscara não custa feature*).

### 3.2 O que a bancada dos quatro REABRE

A MESA-DE-QUATRO-01 tem 21 linhas com PASSA/REPROVA. As dezoito sprints
antigas do co-op, da queda e do posto (COOP-QUE-NAO-DESMONTA-01,
BORDA-DE-QUEDA-01, QUATRO-NA-MESA-01, RESERVA-DO-POSTO-01,
DUAS-CONTABILIDADES-01, QUATRO-NO-RADIO-01…) estão **todas `feita` ou
`absorvida`** em 08/09 — a fila velha as listava como pendentes e não estavam.
**Cada REPROVA da bancada vira sprint NOVA com posse**, com a linha da bancada
como enunciado; ninguém reabre uma antiga pelo id.

### 3.3 A janela GTK — SAIU

Decisão dela de 06/09 (`D-0609-GTK-LEVA-INTEIRA`), executada nas 24 horas: o
`main.glade` não existe mais na árvore, e o `olhar.py` fotografa as dez abas
da interface nova. **O motor fica** (`app/actions/`, `app/widgets/`,
`daemon/`): é reuso. `gui/ponte_da_tela.py` é do piloto HTML e não sai. O que
ainda aponta para a janela está em
`docs/data/o-que-ainda-aponta-para-a-janela.csv`, e o portão
`nada-aponta-para-a-janela` é quem vigia.

### 3.4 Áudio pelo rádio

O som por BT é a metade que falta da SOM-POR-CONTROLE-01: **seis passadas em
08/09, silêncio nas seis**, e a hipótese que sobra é o ENVELOPE (HIDP/L2CAP) —
ensaio 13 do índice do rádio. Os outros 22 ensaios de
[A BANCADA QUE O RÁDIO PEDE](sprints/2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md)
são dela, na ordem daquele índice. O microfone pelo rádio **já entrega voz**
com a ponte de pé (07/09) — o que falta é a MIC-OS-QUATRO-01.

### 3.5 Fora do foco, por palavra dela

*"o foco do programa hoje é fazer os 4 dualsense funcionar"* (06/09): os
controles externos ([EXTERNOS-01](sprints/2026-09-06-EXTERNOS-01-o-nintendo-pro-e-o-8bitdo-na-mesa-e-nos-cards.md) `feita`; a família 8BitDo,
`absorvida`) só voltam quando ela chamar. A tradução: *"não são prioridades"*
(05/09).

---

## 4. O QUE CADUCOU OU FOI ABSORVIDO — por família, uma linha cada

A nota datada está no topo de cada arquivo; o `estado:` está no frontmatter.

| família | quantas | estado | onde vive o que sobrou |
| --- | ---: | --- | --- |
| 27/08 · **ONDA-\*** — o redesenho das dez abas na janela GTK | 90 + 10 índices | `absorvida` (a CONEXOES-11, `feita`) | o CSV, por aba |
| 29/08 · **MIGRA-\*** — a migração aba a aba | 109 + 10 índices + a ordem | `absorvida`; os onze *enxerto na janela GTK* e a CONEXOES-12, `caducou` | o CSV, por aba; a ROTA DO HTML |
| 29/08 · avulsas | 17 | 13 `feita` · 3 `absorvida` · 1 `caducou` | — |
| 25/08 · LIGAR OS MÓDULOS À TELA | 1 índice | `absorvida` | — |
| 24/08 · EMULACAO-UM-DONO-SO-01 | 1 | `caducou` | A-MASCARA-POR-CONTROLE-01 (`feita`) — e a MASCARA-NO-PERFIL-01 é a continuação |
| 31/08 · o plano de uma hora | 1 | `absorvida` | a ROTA DO HTML |
| 02/09 · **ROTA-\*** | 12 | `feita` (a G, `absorvida`) | ONDA5-10-\*, PERFIL-MODO-01 |
| 03/09 | 2 | IDENTIDADE-VEM-DE-CIMA-01 `feita` · CANAL-POR-CONTROLE-01 `absorvida` | MIC-VIRTUAL-02 (`feita`) → MIC-OS-QUATRO-01 |
| 04/09 · T-01…T-09 · ONDA0–ONDA2 · as folhas DECISOES-DELA | 9 + 16 + 11 | `feita` · respondidas | a ONDA CINCO |
| 05/09 · ONDA QUATRO | 13 | nenhuma `aberta` | — |
| 06–07/09 · as 24 horas: os quatro lotes, 146 branches | 34 | `feita`, costuradas em 07/09 | O PLANO PARA O OPUS, §3 |
| o «depois» da fila de 06/09: a bancada dos quatro, externos, daemon, teclado na tela, identidade, os oito de instalação | 30 | `feita` · `absorvida` · 1 `caducou` | `git show b618a8aa:docs/process/SPRINT_ORDER.md`, §2 |
| antes de 27/08 · as 120 do antigo §4 e o resto da história | ~250 | com frontmatter desde 06/09: `feita` · `absorvida` · `caducou` — nenhuma `aberta` | se ainda faltar, é linha do CSV |

A fila em ondas de 23/08, a FAXINA de 27/08 e as 24 horas de 06/09 continuam
no git.

---

## 5. A REGRA DESTE ARQUIVO

1. **Quem fecha uma sprint muda o `estado:` no frontmatter dela**, com a prova
   na nota do topo, no mesmo commit — e não toca este arquivo para isso.
2. **Fila combinada com ela vira arquivo no mesmo dia, e é uma.** Fila nova
   aposenta a anterior com data e ponteiro para o git; não empilha banner.
3. **Sprint se cita pelo id do frontmatter** (`SOM-POR-CONTROLE-01`), nunca por
   número de onda solto: a fila já foi renumerada quatro vezes.
4. **Sprint nova nasce com frontmatter completo, `estado: aberta`, o bloco
   «Critério de pronto — por cabo · por BT · no perfil · por controle» e o
   portão de colisão verde.** O despachante recusa o resto — inclusive a que
   está `feita`.
5. **Decisão dela vira linha no `docs/data/decisoes-dela.csv` no mesmo dia**,
   com a palavra dela verbatim. Sem isso a próxima leitura repete a pergunta.
6. **Este arquivo se mede antes de se escrever.** A fila de 06/09 listou como
   «depois» trinta sprints que já estavam fechadas: quem reescreve lê o
   `estado:` de cada id que cita (`grep -m1 '^estado:'`), nunca a memória.
7. **Sem agentes nesta fila** — ordem dela de 08/09. Quem executa é quem
   conversa com ela, com o navegador, `--oculta`, e mostra a lista atualizada a
   cada ponto.
