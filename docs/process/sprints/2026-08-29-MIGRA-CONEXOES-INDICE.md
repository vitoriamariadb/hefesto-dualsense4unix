---
sprint: MIGRA-CONEXOES-INDICE
onda: MIGRA-CONEXOES
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-CONEXOES-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - scripts/
---

# MIGRA CONEXÕES — o índice

**A aba 08 no motor novo.** Doze sprints para pôr o mockup aprovado a rodar num
`WebKit2.WebView` dentro da janela GTK3, sob a
`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`
(`docs/data/decisoes-dela.csv:119`, 29/08/2026).

**A EXECUÇÃO ESPERA O OK DELA SOBRE O PILOTO.** Palavra dela, 29/08: *"Preciso
avaliar como ela se comporta. Depois dou o ok pra seguirmos materializando a
ordem pra fazermos todas as abas funcionarem no novo motor."* A aba **Controles**
está sendo feita viva agora como piloto do enxerto. As doze desta onda **se
escrevem**; nenhuma corre antes desse ok. Escrever isto não é formalidade: é o
que impede um agente de começar a onda mais pesada do produto sobre um padrão de
ponte que ainda pode mudar.

**Contrato:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8 —
toda linha do "Nada se perdeu" é requisito.
**Especificação visual:** o mockup `08-conexoes.html` e o gerador `aba08.py`,
hoje em `novo-layout/` (que é `.gitignore:108`) e que a `MIGRA-CONEXOES-02` traz
para dentro do repositório.

## Por que DOZE, e não as onze do censo

O censo desta aba contou **onze**. Duas mudanças, e as duas se mediram enquanto
as sprints eram escritas:

* **+1 — a página viaja (a 02).** As nove ondas irmãs, escritas na mesma hora,
  adotaram a mesma forma: uma sprint só para tirar o HTML de `novo-layout/` e
  pô-lo em `src/`, atrás de uma `MIGRA-MOLDURA-01` comum. Separar aqui deixa quem
  coordena serializar **as dez viagens** como um bloco, em vez de dez sprints
  disputando `install.sh`.
* **−1 e +1 — o fato errado do mapa NÃO virou sprint.**
  `docs/data/mapa-controles.csv`, linha `identidade.cor_do_aparelho@dualsense`,
  diz `radio_aciona=não` e, desde 29/08/2026, com motivo `divida` — a célula foi
  corrigida; era `o-aparelho-recusa`. A medição de
  27/08 derrubou isso: quem recusava era a semente do **nosso** CRC (`0x53`, não
  `0xA3` — `docs/protocol/dualsense-referencia-canonica.md:1645-1659`). Medido em
  29/08: `grep -c '0x53' docs/data/mapa-controles.csv` devolve **0**. **Mas a
  substituição já tem dono**: a `ONDA-CONEXOES-11`, escrita em 27/08, que
  **ainda não correu**. Escrever uma décima segunda sprint para o mesmo conserto
  seria criar a segunda verdade que a regra existe para matar. O que entra no
  lugar é a `MIGRA-CONEXOES-12` (as duas janelas), que o censo tratava como uma
  pergunta e é trabalho de código nas duas respostas possíveis.

## As doze

| # | sprint | camada | trava |
|---|---|---|---|
| 01 | [o enxerto substitutivo toma a aba](2026-08-29-MIGRA-CONEXOES-01-o-enxerto-substitutivo-toma-a-aba.md) | motor | mede o que ninguém mediu |
| 02 | [a página viaja, e perde a segunda tira](2026-08-29-MIGRA-CONEXOES-02-a-pagina-viaja-e-perde-a-segunda-tira.md) | artefato | **moldura das dez** |
| 03 | [cada valor e cada gesto ganham endereço](2026-08-29-MIGRA-CONEXOES-03-cada-valor-e-cada-gesto-ganham-endereco.md) | desenho | — |
| 04 | [um `state_full` só, e um payload só](2026-08-29-MIGRA-CONEXOES-04-um-state-full-so-e-um-payload-so.md) | fiação | — |
| 05 | [a página nasce da mesa real](2026-08-29-MIGRA-CONEXOES-05-a-pagina-nasce-da-mesa-real.md) | frontal | **palavra dela** (o mic) |
| 06 | [o botão do microfone ganha superfície](2026-08-29-MIGRA-CONEXOES-06-o-botao-do-microfone-ganha-superficie.md) | ambas | **palavra dela** (o escopo) |
| 07 | [o exame volta a ser o que o produto confere](2026-08-29-MIGRA-CONEXOES-07-o-exame-volta-a-ser-o-que-o-produto-confere.md) | frontal | **palavra dela** (as três linhas) |
| 08 | [a ordem diz o que mover para onde](2026-08-29-MIGRA-CONEXOES-08-a-ordem-diz-o-que-mover-para-onde.md) | ambas | **palavra dela** (`D-QUAL-REGUA-MANDA-NO-ARRANJO`) |
| 09 | [a tabela, os vizinhos e os dezesseis `<select>`](2026-08-29-MIGRA-CONEXOES-09-a-tabela-os-vizinhos-e-os-dezesseis-selects.md) | frontal | **bancada** (o popup) |
| 10 | [a régua de Desempenho, e as vagas](2026-08-29-MIGRA-CONEXOES-10-a-regua-de-desempenho-e-as-vagas.md) | frontal | — |
| 11 | [o teto por controle vence, ou é `min`?](2026-08-29-MIGRA-CONEXOES-11-o-teto-da-vibracao-por-controle-vence-ou-e-min.md) | backend | **palavra dela** |
| 12 | [as duas janelas, e as perguntas que mudam de chave](2026-08-29-MIGRA-CONEXOES-12-as-duas-janelas-e-as-perguntas-que-mudam-de-chave.md) | ambas | **palavra dela** (HTML ou GTK) |

## A ordem, e por quê

```
MIGRA-CONTROLES-02 ─┬─► 02 ──┐
(a moldura das dez) │        ├─► 01 ──► 04 ──┬─► 05 ──┬─► 06
MIGRA-CONTROLES-01 ─┴─► 03 ──┘               │        └─► 11
MIGRA-CONTROLES-03 (as pontes) ──────────────┤
MIGRA-GATILHOS-01  (bancada do <select>) ────┤
                                             ├─► 07 ──► 08
                                             └─► 09 ──► 10 ──► 12
```

**A reconciliação de ids:** as outras oito ondas escrevem `MIGRA-MOLDURA-01` no
`depois_de` quando querem dizer *"a moldura das dez"*. Ela **é** a
`MIGRA-CONTROLES-02` — a que declara posse de `gui/telas/` e de `scripts/telas/`
como pastas, mais o `install.sh` e o `pyproject.toml`. Esta onda usa o id real,
para o `check_colisao_de_sprints.py` enxergar a série.

* **02 e 03 antes de tudo o que é tela.** Sem a página no repositório e sem
  endereço em cada valor, o Python não tem o que carregar nem onde escrever.
* **01 antes de 04.** A 01 cria o `config/pagina.py`; a 04 o preenche.  <!-- ref-externa: o módulo nasce na MIGRA-CONEXOES-01; a ausência é o assunto -->
* **04 antes das quatro de seção.** Ela fixa o contrato
  `dados(host, estado) -> dict` — sem ele, cada seção volta a pedir o seu
  `daemon.state_full` e o defeito das três leituras renasce por descuido.
* **07 antes de 08** — mesmo arquivo (`secao_exame.py`): a 07 dá a forma do
  quadro, a 08 põe a receita dentro.
* **09 antes de 10 e de 12** — as três dividem `secao_mesa.py`, e quem divide
  arquivo executa **em série** (R5).
* **05 antes de 11** — a 11 é o que acontece por baixo do campo que a 05 desenha.
* **09 depois da `MIGRA-GATILHOS-01`**, que é bancada pura e responde por 117
  campos das dez abas de uma vez: se o popup do `<select>` não sobreviver ao
  cosmic-comp, a 09 muda de forma antes de começar.

**Podem correr juntas assim que a moldura e o piloto fecharem:** 02 e 03.

## §0 — o que precisa dela antes de qualquer código

1. **O OK SOBRE O PILOTO.** Vale para as doze.
2. **O microfone nasce ligado nos N controles?** (sprint 05) O mockup diz que
   sim; o produto faz o contrário **por escrito** — nasce desligado, por opt-in,
   por privacidade **e** por banda (`secao_controles.py:433-437`). E ligar por
   padrão acende o caminho que em 16/08 derrubou o controle inteiro depois de
   três minutos. Uma frase dela fecha.
3. **As três linhas do exame que o mockup trocou: voltam ou saem?** (sprint 07)
   O contrato diz *"cinco linhas — ficam"*; a tela aprovada mostra outras cinco.
   **É a única contradição desta onda entre dois documentos que ela aprovou.**
4. **Qual régua manda no arranjo** (`D-QUAL-REGUA-MANDA-NO-ARRANJO`) — trava a
   **08** inteira. A medição que ela pediu já existe:
   `tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py`.
5. **O teto por controle vence sempre, ou o produto aplica o `min`?**
   (sprint 11) A decisão dela de 28/08 aponta para "sobrepõe"; o produto escolheu
   o `min` **por escrito**, e o `min` é o que impede um "teto" de **aumentar** a
   força (`core/rumble.py:86-102`). **Muda o código do daemon, não a tela.**
6. **As duas pop-ups viram HTML, ou continuam janelas GTK?** (sprint 12) É a
   decisão que mais muda o tamanho desta onda: doze sprints, ou catorze.
7. **O escopo do botão do microfone** (sprint 06): a tela oferece a escolha
   **por controle** e o produto guarda **um por máquina**.
8. **A aba não cabe, e o número está medido:** 828 px de aba para 542 de miolo.
   O que teria de sair, com preço: Desempenho (145 px), a tabela dos adaptadores
   com os dois botões (130), ou o quadro "Está tudo certo?" (204). Na TV dela
   (1080) sobram 3 px; em qualquer janela menor, não.
9. **A legenda do mockup vai instalada?** (sprint 02) São **22.887 bytes em 91
   linhas** de caderno interno dentro de uma página de 346.595 — 6,6% do que o
   produto passaria a copiar para a máquina de quem instala.

## O que acontece com as treze `ONDA-CONEXOES` de 27/08

**Nenhuma se apaga aqui** — apagar sprint é decisão de quem coordena, com a
palavra dela, e o manifesto da faxina é o lugar disso
(`docs/process/sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md`). O que este índice
faz é dizer **o que sobra de cada uma** sob o motor novo:

| ONDA-CONEXOES | sob o WebKit |
|---|---|
| 01 a moldura que cabe na tela | **absorvida** pela `MIGRA-CONEXOES-01` — a moldura agora é HTML |
| 02 o inventário físico da mesa | **absorvida** pela 09; e o destino das duas perguntas mudou (28/08): elas vão para a janela, não para a terceira coluna do exame |
| 03 o exame em três colunas | **absorvida** pela 07 |
| 04 a ordem diz o que mover para onde | **absorvida** pela 08 (mesmo diagnóstico, mesma trava) |
| 05 o card vira tira | **absorvida** pela 05 |
| 06 o microfone muda de aba | **vive** — ela cria `integrations/microfone_do_dualsense.py`, que é backend |  <!-- ref-externa: o arquivo é o `cria:` da ONDA-CONEXOES-06 -->
| 07 uma conta só para o rádio | **absorvida** pela 04 e pela 10 |
| 08 a borda é a identidade da peça | **vive** — é contrato de `cor_do_plastico.py`, e vale para as dez abas |
| 09 a declaração grava na hora | **parcial**: o mecanismo é da 09; a redação do recibo continua dela |
| 10 o confirmar não vira pulo no jogo | **vive, e é urgente** — a peneira sem chamador é defeito do daemon, não da tela |
| 11 a cor se lê no rádio, semente `0x53` | **vive, e trava a 05** — enquanto não correr, o mapa de canais carrega o fato errado sobre esta aba |
| 12 as 28 cores e as 10 zonas | **vive** — backend |
| 13 quanto custa o microfone emulado | **vive** — ensaio, e solta |

**As citações de linha das treze envelheceram**; o diagnóstico delas, não.
Reaproveitar sem reconferir é propagar afirmação falsa.

## Coordenação com as outras ondas

| o que | quem entrega | quem recebe |
|---|---|---|
| as duas pontes do WebView (`gui/webview_de_aba.py`) | **MIGRA-CONTROLES-01** | todas as doze |  <!-- ref-externa: o módulo é o `cria:` da MIGRA-CONTROLES-01 -->
| onde as páginas moram, `install.sh`, `pyproject.toml` | **MIGRA-MOLDURA-01** | a 02 |
| o veredito do popup do `<select>` sob a COSMIC | **MIGRA-GATILHOS-01** (bancada) | a 09, e mais 98 campos das outras oito |
| "A janela" (tamanho do texto, ambiente) | esta onda a **remove** da lista (01) | onda **Sistema** |
| o teto global da vibração → "Perfil de Bateria" | esta onda vira **leitora** (10) | onda **Sistema** |
| a peneira do jogo aberto | **ONDA-CONEXOES-10** | a 12 depende dela para a frase da tela |
| a cor lida pelo rádio | **ONDA-CONEXOES-11** | a 05 pinta a borda com o que ela ligar |
| o contrato da borda com o tom do plástico | **MIGRA-CONTROLES-12** | a 05 e a 06, que abrem a mesma seção |

**Nenhuma das doze abre o `gui/main.glade`, e é preciso que continue assim.** A
aba já é inteira montada em código; o Glade só reserva `tab_config_box`. Até o
enxerto troca o **conteúdo** do container por código —
`tab_config_box.get_parent()` alcança o `ScrolledWindow` sem uma linha de XML.
Esta é a **única** das dez ondas em que isso é verdade: as nove irmãs declaram
posse do XML e correm em série atrás umas das outras. Uma sprint desta onda que
abra o Glade serializa a onda inteira atrás de vinte outras.

## As colisões, e por que a conta muda de hora em hora

`check_colisao_de_sprints.py` acusava **duas** colisões novas desta onda quinze
minutos depois de as doze estarem escritas — a `MIGRA-CONTROLES-12` nasceu nesse
intervalo e reivindicou `secao_controles.py`. **As nove ondas irmãs estão sendo
escritas na mesma hora**, e por isso a conta de colisões desta onda é verdadeira
no minuto em que se roda o portão, não no minuto em que se lê este índice.

**Quem despachar roda o portão de novo, e serializa o que ele acusar** — não
resolve conflito de posse sozinho. Estado no fechamento desta escrita: **zero**
colisões não declaradas envolvendo `MIGRA-CONEXOES`.

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje, antes e depois
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh                # os 26 portões
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo só,
que morre no meio sem traceback.

**A palavra final é dela, com a foto na mesa** (`PROVA-DE-TELA-01`). Aprovar o
mockup não é aprovar a tela — e menos ainda aprovar a tela **noutro motor**.
