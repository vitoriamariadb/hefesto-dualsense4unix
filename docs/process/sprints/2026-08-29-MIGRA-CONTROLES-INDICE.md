---
sprint: MIGRA-CONTROLES-INDICE
onda: MIGRA-CONTROLES
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-CONTROLES-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - scripts/
  - novo-layout/
---

# MIGRA CONTROLES — o índice

**A aba 02 no motor novo.** Treze sprints que levam a aba **Controles** do
produto de hoje — 420 linhas de Glade e 5.783 de `controller_card.py` — até o
mockup que ela aprovou, rodando num `WebKit2.WebView` dentro da janela GTK 3.

**A decisão que manda em tudo:**
`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK` (29/08/2026,
`docs/data/decisoes-dela.csv`). Duas rotas foram provadas com a mesma régua, e o
que decidiu **não foi fidelidade** — foi **acompanhar a mudança**. Mudou-se uma
linha do mockup e a foto da rota que emitia GTK saiu **byte-idêntica**. Palavra
dela: *"sem impeditivo então. manda ve em tudo."*

- **Contrato da aba:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, §2
  (linhas 166-242) — toda linha do "Nada se perdeu" é requisito.
- **Especificação visual:** `novo-layout/02-controles.html`, gerado por
  `novo-layout/_ferramentas/aba02.py`.
- **Correções literais dela:** `novo-layout/_ferramentas/CORRECOES-DELA.md`.
- **O retrato do dia:**
  [ONDE PARAMOS 29/08](../2026-08-29-ONDE-PARAMOS-a-tecnologia-decidida-e-a-cura-que-a-tela-desfazia.md)
  e [O POSTO DE COMANDO](../2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md).
- **Protocolo de quem executa:** `docs/process/COMO-EXECUTAR-UMA-SPRINT.md`.

---

## ESTA ONDA É O PILOTO, E A EXECUÇÃO DAS OUTRAS NOVE ESPERA A PALAVRA DELA

Palavra dela, 29/08, literal:

> *"Preciso avaliar como ela se comporta. **Depois dou o ok** pra seguirmos
> materializando a ordem pra fazermos todas as abas funcionarem no novo motor."*

As sprints das outras nove abas **se escrevem agora**; nenhuma executa antes
desse ok. **E esta onda é o que ele avalia** — por isso ela vem primeiro, e por
isso a `MIGRA-CONTROLES-01` é a única sprint da leva inteira que ainda **mede**
em vez de entregar.

---

## As treze

| # | sprint | camada | tamanho | trava |
|---|---|---|---|---|
| 01 | [o enxerto substitutivo, e o id que não pode sumir](2026-08-29-MIGRA-CONTROLES-01-o-enxerto-substitutivo-e-o-id-que-nao-pode-sumir.md) | moldura · **Glade** | **não medido** — é ela que mede | **palavra dela**, se o preço subir |
| 02 | [a página muda de casa, e passa a viajar](2026-08-29-MIGRA-CONTROLES-02-a-pagina-muda-de-casa-e-passa-a-viajar.md) | empacotamento | ~200 | — |
| 03 | [as duas pontes nascem aqui](2026-08-29-MIGRA-CONTROLES-03-as-duas-pontes-nascem-aqui.md) | moldura | **31**, uma vez, para as dez | — |
| 04 | [cada valor da tela ganha endereço](2026-08-29-MIGRA-CONTROLES-04-cada-valor-da-tela-ganha-endereco.md) | gerador | ~250 | — |
| 05 | [a mesa é a dela, e zero é um estado](2026-08-29-MIGRA-CONTROLES-05-a-mesa-e-a-dela-e-zero-e-um-estado.md) | ambas | ~350 | **palavra dela** |
| 06 | [os dezoito que já chegam prontos](2026-08-29-MIGRA-CONTROLES-06-os-dezoito-que-ja-chegam-prontos.md) | ambas | ~400 (boa parte é **remoção**) | — |
| 07 | [o topo e o rodapé chegam em dobro](2026-08-29-MIGRA-CONTROLES-07-o-topo-e-o-rodape-chegam-em-dobro.md) | ambas | ~300 | **palavra dela** |
| 08 | [os gestos voltam, e a régua que clica](2026-08-29-MIGRA-CONTROLES-08-os-gestos-voltam-e-a-regua-que-clica.md) | ambas | ~450 | — |
| 09 | [a máscara por controle chega à tela](2026-08-29-MIGRA-CONTROLES-09-a-mascara-por-controle-chega-a-tela.md) | backend | ~120 | **palavra dela** (a terceira máscara) |
| 10 | [o volume do microfone volta da escrita cega](2026-08-29-MIGRA-CONTROLES-10-o-volume-do-microfone-volta-da-escrita-cega.md) | ambas | ~150 | — |
| 11 | [o alto-falante diz a rota, e o "Liberar" ganha pai](2026-08-29-MIGRA-CONTROLES-11-o-alto-falante-diz-a-rota-e-o-liberar-ganha-pai.md) | ambas | ~300 | **palavra dela** (os dois "Liberar") |
| 12 | [a borda é a peça, e metade da mesa dela é rádio](2026-08-29-MIGRA-CONTROLES-12-a-borda-e-a-peca-e-metade-da-mesa-e-radio.md) | ambas | ~250 | **palavra dela** |
| 13 | [o que o mapa desmente não se pinta como vivo](2026-08-29-MIGRA-CONTROLES-13-o-que-o-mapa-desmente-nao-se-pinta-como-vivo.md) | ambas · **portão novo** | ~300 | **palavra dela** — a decisão inteira |

**Os tamanhos são estimativa, menos o da 03 (medido) e o da 01 (desconhecido, e
declarado como tal).** Não os trate como orçamento.

## A ordem, e por quê

```
01 ──► 03 ──┐
02 ──► 04 ──┴──► 05 ──► 06 ──┬──► 07 ──► 08 ──► 10 ──► 11 ──► 12 ──► 13
                             │
                             └──► 09   (solta a partir daqui: só ipc_handlers)

de fora da onda:  ONDA-CONEXOES-08/11/12 ──► 12
                  ONDA-CONTROLES-04       ──► 13
```

**Da 08 à 13 a fila é SERIAL, e não por gosto:** as cinco dividem o tradutor da
aba (que a 06 cria) e/ou `app/widgets/controller_card.py` (5.783 linhas, sem
seções nomeadas). Quem divide arquivo executa em série — R5.

* **02 pode correr do primeiro minuto.** Ela não toca `app/`, não abre o Glade
  e não escreve uma linha de ponte: é mudança de endereço e de embalagem, e
  **correr antes do ok dela não incomoda ninguém.** O `depois_de` dela é longo
  e **não é precedência** — é colisão de arquivo declarada (o `install.sh`, com
  seis sprints de outras ondas). O portão só aceita `nao_toca` ou `depois_de`
  para dois donos do mesmo arquivo, e a segunda é a resposta honesta.
* **01 antes de 03** — a ponte se acopla ao WebView, e é a 01 que o cria. Os
  dois módulos são separados de propósito: as nove ondas que só querem a ponte
  não passam a depender do enxerto.
* **02 antes de 04** — a 02 é quem move o gerador e a página para o lugar novo;
  a 04 escreve dentro deles.
* **05 depois de 03 e 04** — a mesa real precisa dos endereços (04) e de quem
  clona o molde (03).
* **06 antes de 07, 09, 10, 11 e 12** — as cinco leem o objeto do tique que a 06
  monta.
* **07 antes de 08** — o alvo tem de ter um dono antes de os gestos o moverem.
* **10 antes de 11, e 11 antes de 12** — as três dividem `controller_card.py`
  ou o tradutor da aba, e quem divide arquivo executa em série (R5).
* **13 por último** — ela mede a tela contra o mapa, e só faz sentido depois de
  a tela existir.

**Podem correr juntas desde o começo:** a **02** e a **01** (esta última só
depois de o turno do Glade estar livre).

**Conferido em 29/08:** `check_colisao_de_sprints.py` acusa **180** colisões na
pasta, e **nenhuma delas envolve esta onda** — o mesmo número que ele acusava
antes destes catorze arquivos existirem. Reconferir antes de despachar: sprint
nova de outra onda no mesmo arquivo reabre o par.

## O QUE A TROCA DE MOTOR FEZ COM AS NOVE SPRINTS DE 27/08

**Nenhuma delas se reescreve.** Cinco atravessam, e as que morrem são as que
entregavam widget GTK.

| sprint de 27/08 | o que acontece com ela |
|---|---|
| [01 a faixa que a Steam guardava](2026-08-27-ONDA-CONTROLES-01-a-faixa-que-a-steam-guardava.md) | **substituída** — a faixa é HTML aprovado. O que sobrevive dela é a **pergunta 1** (as seis linhas do "No jogo"), que desce para o §dela deste índice |
| [02 a aba que sai e o quadro que se dissolve](2026-08-27-ONDA-CONTROLES-02-a-aba-que-sai-e-o-quadro-que-se-dissolve.md) | **absorvida pela MIGRA-01** — o Glade abre **uma vez só** para esta aba, e o diagnóstico dela continua sendo a fonte |
| [03 a borda é a peça, o interior é a escolha](2026-08-27-ONDA-CONTROLES-03-a-borda-e-a-peca-o-interior-e-a-escolha.md) | **substituída pela MIGRA-12** |
| [04 o acelerômetro está no mesmo node](2026-08-27-ONDA-CONTROLES-04-o-acelerometro-esta-no-mesmo-node.md) | **INTACTA** — nunca falou de widget. A MIGRA-13 depende dela |
| [05 o seletor que nunca soube a rota](2026-08-27-ONDA-CONTROLES-05-o-seletor-que-nunca-soube-a-rota.md) | **substituída pela MIGRA-11**; o diagnóstico dela continua inteiro e não se repete lá |
| [06 o microfone não tem endereço](2026-08-27-ONDA-CONTROLES-06-o-microfone-nao-tem-endereco.md) | **metade de trás INTACTA** (`ControllerOverrides.mic`); a metade de tela vai para a MIGRA-08 |
| [07 os dois sensores ganham interruptor](2026-08-27-ONDA-CONTROLES-07-os-dois-sensores-ganham-interruptor.md) | **INTACTA** |
| [08 calibrar sensores, e a Steam é a prova](2026-08-27-ONDA-CONTROLES-08-calibrar-sensores-a-steam-prova-que-da.md) | **INTACTA** — e continua sendo **bancada**, com o risco de escrita não-volátil |
| [09 trinta e cinco frases viram quinze](2026-08-27-ONDA-CONTROLES-09-trinta-e-cinco-frases-viram-quinze.md) | **substituída** — as frases são o HTML aprovado. A conta dos 15 textos, se ela a quiser como teto, vira régua na MIGRA-04 |

**Não apague as substituídas por conta própria.** A regra dela de 27/08 é que
sprint velha **se apaga — o git guarda**; mas isso é uma faxina, com manifesto,
e é de quem coordena (o precedente é
`2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md`).

## POR QUE TREZE, e o que mudou na composição

O censo desta aba disse **treze**, e treze ficaram — **mas não são as mesmas
treze.** Duas caíram e duas nasceram ao escrever:

**Saíram, porque já existem e reescrevê-las seria o defeito que o
`SPRINT_ORDER.md` §1.4 já nomeia** (*"duas sprints que são a mesma sprint"*):

- **a troca da tabela de cores** é a
  [ONDA-CONEXOES-12](2026-08-27-ONDA-CONEXOES-12-as-vinte-e-oito-cores-e-as-dez-zonas-chegam-ao-produto.md)
  — 21 códigos de uma zona contra 28 modelos e 10 zonas — e ela atravessa
  intacta. A MIGRA-12 ficou com a **metade que é desta aba**: a borda chegar ao
  HTML e a tela dizer a verdade onde a cor não chega;
- **o acelerômetro** é a `ONDA-CONTROLES-04`, intacta.

**Entraram, e as duas vêm de medição de 29/08:**

- **a casa do HTML e o empacotamento (02).** `novo-layout/` é `.gitignore:108`;
  o wheel leva `gui/*.glade` e `gui/assets/*.png` (`pyproject.toml:84-91`) e
  mais nada. **Sem esta sprint a aba não existe numa máquina instalada** — e com
  o WebKit isso deixa de ser um desenho faltando e passa a ser a página não
  carregar;
- **o topo e o rodapé em dobro (07).** Não é hipótese: *"a primeira versão punha
  um `Gtk.Notebook` por cima e **ela viu as abas duas vezes na hora**"*. A fita
  do produto mora no `header_bar` (`status_actions.py:1702`), fora da página; a
  do mockup mora dentro dela.

## NOTA DE COORDENAÇÃO — dois ids que as outras nove ondas já citam

As sprints `MIGRA-SISTEMA-01`, `MIGRA-CONEXOES-01`, `MIGRA-LANCADORES-01` e
`MIGRA-LANCADORES-02`, escritas hoje pelas outras levas, declaram:

```
depois_de:
  - MIGRA-MOLDURA-01        # a casa do HTML + as duas pontes
  - MIGRA-CONTROLES-PILOTO  # o ok dela sobre o piloto
```

**Nenhum dos dois ids existe.** O que eles esperam nasce aqui:

| o id que elas citam | o que é, nesta onda |
|---|---|
| `MIGRA-MOLDURA-01` | **MIGRA-CONTROLES-02** (a casa do HTML e o pacote) **+ MIGRA-CONTROLES-03** (as duas pontes) |
| `MIGRA-CONTROLES-PILOTO` | **a onda inteira**, e o ok dela sobre o que ela vir rodando |

**Quem coordena escolhe uma das duas saídas, e não deixa as duas:** renomear
estas duas sprints para `MIGRA-MOLDURA-01/02`, ou corrigir o `depois_de` das
nove. Inventar um id no meio do caminho cria referência falsa, que é pior que
dependência declarada em prosa.

**E a convergência de caminhos já aconteceu:** a onda Lançadores escolheu
`src/hefesto_dualsense4unix/gui/telas/` para as páginas e `scripts/telas/` para
os geradores. A MIGRA-CONTROLES-02 **adota os dois** — não são invenção desta
onda, são o que outra já assumiu.

## AS TRAVAS — o que precisa dela antes de qualquer código

1. **O ok sobre o piloto.** Trava a execução das outras nove ondas inteiras.
2. **O preço do enxerto substitutivo.** Ela aceitou **62 → ~285 MiB PSS (4,6×)**
   sobre o enxerto **ADITIVO** (o WebView como 12ª página, 376 objetos em 56 ms).
   **Ninguém mediu trocar uma página**, e é ali que reaparecem as 60.862 linhas
   que chegam aos widgets por `builder.get_object()`. Se o número subir, o ok
   não cobre.
3. **Quem fica com a moldura: o GTK ou o HTML** (MIGRA-07). Custa as dez abas de
   uma vez e não se decide dentro de uma onda.
4. **O que a aba diz com a mesa vazia** (MIGRA-05). Zero controles é estado
   legítimo e o mockup não o desenha. **Não invente a tela.**

## O QUE É DELA DECIDIR — a lista inteira da onda

1. **As seis linhas do "No jogo" sumiram INTEIRAS do desenho, e o contrato as
   mantém.** O §2 do redesenho ("Nada se perdeu") diz que giroscópio · vibração ·
   gatilho · luz · clique do touchpad · som do controle ficam na faixa do
   cartão, com *no jogo agora* / *parou* / *sem pedido ainda*. O mockup não tem
   nenhuma — e em 28/08 saíram também as duas últimas leituras (`Hefesto on` e
   `Giroscópio NNN Hz`), por palavra sua: *"se der problema de espaço remover
   Giroscópio, Hefesto e vê como (na real remove eles)"*. **Resultado: a aba não
   diz mais NADA sobre o que atravessa para o jogo.** O dado existe e é rico
   (`daemon/ipc_handlers.py:3004-3040`: `motion_hz`, `motion_forwards`,
   `touchpad_clicks`, `ff_*`). Vão para o `?` da faixa, ou saem de vez?
2. **O bloco do som nos cartões de rádio** — esmaece com a frase, some, ou fica
   como está? *(13, e é a decisão inteira daquela sprint)*
3. **O hexadecimal ao lado da barra de luz: a cor de TABELA ou a cor VIVA?**
   *(06)*
4. **A cor do plástico: declarada por você, ou lida do aparelho — e as duas se
   misturam num campo só?** *(12)*
5. **"Nintendo Pro" está na tela e não existe no produto.** Nasce a máscara, ou
   a terceira opção sai do desenho até existir? *(09)*
6. **`button_toggles_system`** — o botão do microfone do controle muda o mudo do
   PC inteiro. O campo existe (`profiles/schema.py:451`), o daemon já o aplica
   (`daemon/ipc_draft_applier.py:565-592`) e **nenhuma superfície o escreve**
   (`app/draft_config.py:206` diz isso com todas as letras). Caixa no bloco
   Microfone desta aba, ou vai para a Conexões? *(08)*
7. **Os dois "Liberar"**, e um deles é inalcançável hoje no cartão de UM
   controle. *(11)*
8. **Histórico de bateria e o aviso antes de o controle morrer.** O
   `DiarioDaBateria` grava desde sempre (`daemon/battery_journal.py:214`) e
   ninguém lê; o `notify_battery_low` (`integrations/desktop_notifications.py:272`)
   só tem chamador em `tests/`. **O índice de 27/08 deixou isto fora até você
   dizer**, e o desenho de hoje já mostra o caso. *(06)*
9. **Cinco controles não cabem.** Com a geometria aprovada, `437 − 43×(N−1) ≥
   301` dá **N ≤ 4**, e o gerador PARA no quinto. *(05)*
10. **As cinco que o índice de 27/08 já lhe deve**, e que a troca de motor não
    muda: o espelho de motion é do P1 (`daemon/subsystems/gamepad.py:1718`) —
    os interruptores aparecem nos cartões 2, 3 e 4?; desligar o sensor apaga a
    leitura do cartão também, ou só o que vai ao jogo?; a contradição
    `D-PERFIL-DE-DESEMPENHO` × `D-AUDIO-E-GIRO-NASCEM-LIGADOS`, aberta desde
    25/08; a calibração vive na peça ou no perfil?; e a conta de 15 textos
    visíveis é **teto** (vira portão) ou **meta**?

## OS RISCOS, e o que cada um já custou

1. **O Glade é XML único sem seções nomeadas** — conflito de merge nele é
   irrecuperável na prática. **Esta onda o abre UMA VEZ** (a 01), e a onda
   inteira corre em série com as outras nove quanto a esse arquivo. Dezoito das
   90 sprints de 27/08 o declaram, mais três `MIGRA-*` de outras ondas.
2. **Dois arquivos gigantes sem seções:** `app/widgets/controller_card.py`
   (5.783 linhas) e `app/actions/status_actions.py` (3.164). Cinco das treze
   tocam um dos dois. A serialização está declarada de propósito — *"paralelizar
   aqui compra conflito de merge, não velocidade"*.
3. **O daemon vivo é mais velho que o código.** Com install editable, campo novo
   no `state_full` (a máscara, o volume do microfone, a rota) só existe no
   próximo `start`, e **o sintoma é a AUSÊNCIA de dado**. Quem testar sem
   reiniciar vai ver a caixa vazia e concluir que a ponte do WebKit quebrou.
4. **O instrumento mente mais que o produto** — **seis réguas falsas em quinze
   horas**, em 29/08, e **cinco delas foram pegas por quem escreveu a própria
   régua, ao mordê-la**. Toda régua desta onda declara contra qual biblioteca
   mede, e nenhuma digita o que devia LER.
5. **A régua que roda o tique UMA VEZ mede um instante, não um comportamento.**
   Uma leva de 29/08 introduziu uma regressão que só aparecia **181 segundos
   depois**, com 67 testes verdes.
6. **O `scrollIntoViewIfNeeded` do Playwright ROLA antes de medir** e cega toda
   medição de layout feita depois. Foi assim que um portão desta casa deu verde
   sobre uma linha fora da caixa.
7. **A suíte cria nós uinput de verdade** — 1289 num dia derrubaram a sessão
   gráfica dela. Esta aba mexe com máscara e vpad, que é o caminho que os
   multiplica. **A suíte roda no FIM, em oito lotes, e é de quem coordena.**
8. **O botão "Calibrar sensores da mesa" pode escrever na memória não-volátil
   dos controles dela, sem desfazer.** Está escrito nesta casa
   (`integrations/cor_do_plastico.py:17-22`): o comando é a família
   `SET_FEATURE 0x80`, a mesma em que `[1, 1]` **reseta** o controle e
   `[12, 1, ...]` **grava calibração na memória não-volátil**. *"Não há
   desfazer, e ela tem quatro controles sem reposição."* A sprint da calibração
   é a `ONDA-CONTROLES-08`, e **ela tem de provar por onde NÃO passa**, com a
   mesma disciplina daquele módulo — função de payload sem parâmetro e
   conferidor byte a byte imediatamente antes do `ioctl`.
9. **`playwright` está fora do `pyproject.toml`** e é importado por dois
   portões. A régua que clica (MIGRA-08) o usa. Herdado, e não é desta onda —
   mas quem executar a 08 tropeça nele primeiro.
10. **Esta medição é de uma árvore que o piloto vai mudar.** Os números aqui —
    18 de 29 lidos, 15 ids com consumidor, 420 linhas de Glade — valem para
    `dev` em **29/08**. **Reconferir antes de despachar é mais barato que
    descobrir na costura.**

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje, antes e depois
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh                # a lista tem UM dono, e é este script
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo
só, que morre no meio sem traceback e sem sumário.

**A palavra final é dela, com a foto na mesa** (`PROVA-DE-TELA-01`). Aprovar o
mockup não é aprovar a tela.
