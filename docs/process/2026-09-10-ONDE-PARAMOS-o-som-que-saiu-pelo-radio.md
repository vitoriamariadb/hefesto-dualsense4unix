# ONDE PARAMOS — 10/09/2026, madrugada: o som que SAIU pelo rádio

**O alto-falante do DualSense tocou sem fio.** Primeira vez nesta casa, com ela
na bancada, dois controles na mesa e a orelha dela como instrumento. Setenta
segundos sem um corte, alcance testado, e a mordida do CRC provando que o som
veio do nosso report.

Isso fecha o **ensaio 13** do
[índice do rádio](sprints/2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md),
aberto em 31/08 com a frase que agora caducou: *"ninguém desta casa mandou um
único byte de áudio por rádio"*.

## §0 — O estado em uma linha

`dev` · **nove medições novas no caderno** · o som por rádio PROVADO com a
orelha dela · a ponte ainda NÃO existe no produto · dois defeitos vivos achados
no caminho, os dois com log e prova.

## §1 — A cura, e ela é menor do que qualquer desenho que a casa tinha

```
report 0x35 · 334 B · UM quadro Opus · tag 0x13 · a cada 10,667 ms
write() no /dev/hidraw, com o daemon vivo e o hid-playstation ligado
sem primer · sem socket L2CAP · sem root · sem unbind
```

O corpo, byte a byte (layout do `HeadsetPlayMusic`, de `awalol/dualsense-bt-haptics`):

| onde | o quê |
| --- | --- |
| `[0]` | `0x35` |
| `[1]` | `seq << 4` |
| `[2]` | `0x11 \| 0x80` — tag AudioControl |
| `[3]` | `7` — comprimento do valor |
| `[4]` | `0xFE` — os sete enables. **O bit 0 é o microfone**; `0xFF` liga junto |
| `[5..9]` | `00 00 00 00 FF` — `audio_buffer_length` |
| `[10]` | contador de **QUADROS** de áudio, não de reports |
| `[11]` | `0x13 \| 0x80` alto-falante · `0x16 \| 0x80` fone |
| `[12]` | `200` |
| `[13..212]` | o quadro Opus — 48 kHz estéreo, 10 ms, **CBR 160 kbps** |
| `[330..333]` | CRC-32 LE, semente `0xA2` |

O instrumento é `scripts/ensaios/o_som_pelo_035.py`. O produto **já tinha** o
codificador certo (`alto_falante_bt.CodificadorOpus`, CBR 160 kbps) e o CRC.

## §2 — CINCO FATOS DESTA CASA CAÍRAM, e os cinco estavam escritos

| a casa dizia | a medição diz |
| --- | --- |
| *"o DS5Dongle é um dongle: prova report HID, não hidraw"* (ressalva (c) de `alto_falante_bt.py`) | **o hidraw basta.** `GeorgLegato/LinuxAudio4Dualsense5` é um sink PipeWire em C que abre `/dev/hidraw` e escreve com `write()`, no Linux, pelo BlueZ — e ela provou aqui |
| *"o MTU do BlueZ pode ser a parede"* | **672 é o que o dongle usa também.** O `setsockopt`/1024 medido às 00h55 foi trabalho pago por nada — e deu silêncio |
| *"a escada `0x32`-`0x39` já foi variada"* (`o_envelope_do_som_no_radio.py:7`) | **não foi.** Os três arranjos do produto são todos `degrau=0x39`. As nove passadas de áudio desta casa bateram no mesmo degrau |
| *"um report a cada 20 ms"* | **10,667 ms** (512/48000). Os 20 ms alimentam 100 quadros/s num aparelho que consome 93,75 — é a taxa de estouro que o `dualsense-neo` diagnosticou |
| *"faltava o primer `0x31` que ARMA a rota"* | **caiu na mordida honesta.** Toca desarmado. A tag `0x13` do bloco de áudio já endereça o alto-falante |

**OS CINCO ESTÃO CORRIGIDOS NOS ARQUIVOS ONDE MORAVAM** (10/09, à tarde), pela
lei do fato errado — substituídos, não duplicados:

| onde | o quê |
|---|---|
| `docs/protocol/dualsense-referencia-canonica.md` | a tabela do §3, a tabela da escada (o `0x35` marcado) e a seção nova *"O som que saiu pelo rádio"* com o layout byte a byte |
| `docs/data/mapa-controles.csv` | `audio.alto_falante@dualsense` — `radio_report_id`, `radio_de_onde_sei`, `radio_evidencia`, `radio_ressalva`, `radio_codigo_ref` |
| `install.sh` | o bloco `BT-MIC-01`: a `libopus` deixou de ser dependência só do microfone |
| a sprint `2026-08-29-O-ALTO-FALANTE-VIRTUAL-01` | *"o payload continua não identificado"* |

**E `radio_aciona` NÃO virou `sim`, de propósito.** A célula escreveu o próprio
contrato — som audível **mais** negativo de rota **mais** teste cego — e a
corrida cumpriu o primeiro. Promover por um terço da régua seria o defeito que
este mapa existe para impedir.

## §3 — A MORDIDA QUE ESTAVA FURADA, e a regra que ela deixa

A primeira mordida do primer **passou por engano**: ela tocou sem primer logo
depois de uma corrida COM primer, e ouviu. Conclusão fácil e errada: *"o primer
não faz falta"*.

**A rota PERSISTE no firmware entre corridas.** A mordida estava medindo a
memória do aparelho, não o primer. Refeita com `--desarmar` — um `0x31` pedindo rota=fone,
o padrão de fábrica — ela ouviu igual, e só então a hipótese caiu de verdade.

> **A regra:** mordida que não desfaz o estado da corrida anterior não mede o
> que promete. **O aparelho tem memória, e ela sobrevive ao processo que a
> escreveu.**

## §4 — DOIS DEFEITOS VIVOS, achados ao medir outra coisa

### 4.1 O daemon esquece a palavra dela em 35 ms

```
01:48:46  bt_mic_palavra_dela            ligado=True
01:48:46  bt_mic_pedido                  ligar=True  seq=4
01:48:46  bt_mic_palavra_dela_esquecida        ← 35 ms depois
01:48:46  bt_mic_pedido                  ligar=False seq=5
```

O canal do microfone do controle no rádio sobe e é derrubado pelo próprio
daemon, sozinho, no mesmo segundo. O ciclo se repete. É o que ela viu como
*"algo tava bugando"*: o nó `hefesto_mic_<hex6>` nasce, some e volta.

**Medido no nó, três gravações:** sem o nosso áudio o mic dá **zeros exatos**
(393.216 amostras, 0 não-zero); com o áudio e `enables=0xFF` dá 0,6% de
não-zero e o **mesmo** número de janelas com energia nas duas voltas — logo não
é voz, é resíduo. A régua de comparação é o mic do cabo em 15/08: **98,7%**.

Curar o `palavra_dela_esquecida` vem **antes** de qualquer conclusão sobre o
bit 0 dos enables.

### 4.2 A rajada gera ENTRADA FANTASMA

> *"na REAL O TECLADO FICA SE MEXENDO QUANDO VC DA O COMANDO E SE FECHA
> SOZINHO. AI DESLIGO O BT DO CONTROLE E VOLTA AO NORMAL."*
> <!-- noqa-acento: citação literal dela -->

Enquanto o `0x35` corre, o teclado na tela abre e fecha sozinho. **O log do
daemon não registra evento de teclado nenhum** — a entrada não nasce nele.

**A PRIMEIRA CAUSA QUE ESCREVI AQUI ESTAVA ERRADA, e a correção é dela.** Eu
atribuí a entrada fantasma à rajada de `0x35` — a disputa de contador entre o
`output_seq` do `hid-playstation` e o nosso. Meia hora depois, com **nenhum som
tocando desde as 02h00**, ela relatou de novo:

> *"DESLIGUEI ELE PQ O PROBLEMA DO TECLADO MALUCO E MOUSE MALUCO VOLTARAM."*
> <!-- noqa-acento: citação literal dela -->

**Sem rajada não há disputa de contador — logo não era isso.** O que rodou entre
os dois relatos foi o reinício do daemon, o pedido do canal do microfone (um
`0x32`) e um `parec`. A rajada de áudio, se agrava, não é a origem.

**O que sobra, e nenhum foi medido:** o controle do rádio em modo desktop com
mouse e teclado emulados (o perfil dela é o `Personalizado`, e
`keyboard_emulation` está `enabled/despachando`); um eixo em deriva ou um botão
preso alimentando o cursor; ou o `0x32` do microfone. **O defeito é do produto e
existe sem o trabalho de hoje** — a rajada só o tornou visível para mim.

**MEDIDO ÀS 02H36, E A HIPÓTESE DO VPAD CAIU.** Ela relatou o defeito outra vez
(*"deu o teclado maluco agora"*), e a medição rodou com os DOIS controles na <!-- (noqa-acento: citação literal dela) -->
mesa — o do rádio e o vpad `Hefesto P1`, que era exatamente a diferença de
estado suspeita. **120 s, zero no que mexe na tela:**

```
     0  Hefesto - Dualsense4Unix Virtual Keyboard   ← o teclado
     0  ...Touchpad (mouse2) ×2                     ← o mouse
     0  ...botões ×2                                ← os botões
531776  ...Motion Sensors ×2                        ← IMU a ~250 Hz, ruído esperado
```

**A entrada fantasma não nasce em nó de entrada.** O que sobra e não foi
medido: o compositor, o teclado na tela e o aplicativo em foco.

**RESSALVA HONESTA:** o defeito não estava acontecendo durante os 120 s — ela o
relatou 15 min antes e religou o controle no meio. Zero em repouso não derruba
um defeito intermitente; derruba a hipótese de que a origem seja emissão
contínua de um nó.

### 4.3 O INSTRUMENTO TINHA DOIS DEFEITOS, e os dois davam veredito falso

Achados na mesma corrida, com quinze minutos entre eles:

**(a) Ele mediu com o alvo FORA da mesa e chamou isso de resposta.** O retrato
de 02:19:58 listou oito nós; a corrida de 90 s abriu cinco. O controle do rádio
saiu no meio, porque **ela desligou o BT — que é o gesto com que ela CURA o
defeito**. O instrumento mediu 90 s do estado curado e imprimiu *"NINGUÉM
EMITIU NADA"*.

> **Zero com o alvo fora da mesa não é zero — é NADA.** Cura: ele relista os
> nós no fim e devolve `rc=2` com `MEDIÇÃO INVÁLIDA` se um alvo sumiu.

**(b) Ele chamou a IMU de candidata.** 21.884 eventos em 5 s com os controles
imóveis — os nós `Motion Sensors` publicam a ~250 Hz sem parar, e **não chegam
ao cursor**. O resumo dizia *"o nó que mais emitiu é o candidato"*, e o ruído de
fundo escondia o candidato de verdade (o teclado virtual, que deu ZERO). Cura:
o resumo separa IMU do que mexe na tela.

**A assinatura é a mesma das outras desta casa:** *o instrumento respondeu sobre
outra coisa que não o alvo*. E os dois só apareceram porque o veredito foi
conferido contra o retrato — não porque alguém desconfiou dele.

## §5 — O caminho até aqui, e as duas viradas foram dela

**1. *"esse teste não tá certo"*.** Ela recusou o instrumento e perguntou se não
era via emulação. A resposta honesta exigiu medir o que o controle anuncia por
rádio — e a medição estava certa, mas o alvo não.

**2. *"os agentes não trouxeram isso?"*. — A RESPOSTA É SIM, E ESTÁ MEDIDA.**

Ela perguntou, eu fui procurar, e o que achei é pior do que "estava em três
lugares". **A pesquisa dos agentes de 31/08 tinha o `0x35` com os números
exatos**, no achado `[8.19]` de
`docs/process/pesquisas/2026-08-31-canais-de-radio/fontes-r1.md`:

> *"**0x32** com 142 B (CRC em 138..141), **0x35** com 334 (CRC em 330..333),
> **0x36** com 398 (CRC em 394..397) e **0x39** com 547 (CRC em 543..546)"*

`0x35` · 334 B · CRC em 330..333. É byte a byte o que tocou dez dias depois.

**O QUE FALHOU NÃO FOI A PESQUISA — FOI O QUE A CASA FEZ COM ELA.** Medido no
git: o `mapa-controles.csv` de ontem menciona o `0x35` **três vezes, e as três
dentro da lista de degraus**, ao lado dos outros oito. Nunca como *o report de
áudio*. O que virou célula foi o arranjo do `0x39` — com as duas fontes externas
divergindo entre si sobre ele.

**E A CONFERÊNCIA EMPURROU O `0x35` PARA FORA, estando certa.** A auditoria de
31/08 (`refutadas-r1.md:242`) reprovou a proposta por calar sobre a divergência
do `0x39`, e escreveu: *"a proposta citou o `0x35` e o `0x36` como corroboração
e calou sobre o `0x39` dele, **que é a única célula em disputa**"*. A frase fez
o seu trabalho — e fixou a casa no `0x39` por nove passadas.

> **A REGRA QUE ISSO DEIXA:** *a conferência mede se a proposta é honesta sobre
> a disputa; ninguém estava encarregado de perguntar se o report em disputa era
> o certo.* Auditar a PROPOSTA e auditar a PERGUNTA são dois trabalhos, e a casa
> só fazia o primeiro.

**E a segunda metade da pergunta dela também era sim:** o que a casa já sabia
desde 25/07 estava em `dualsense_bt_audio.py`, na ressalva (c) de
`alto_falante_bt.py` e na §8 do `fontes-r3.md`. Eu tinha ido *remedir* isso.

> **A outra regra:** antes de medir o aparelho, medir o que a casa já escreveu.
> Uma medição que repete um fato registrado custa o dobro: o tempo de medir e o
> de descobrir que já se sabia.

**3. O cabo como positivo do formato** — ideia dela, desenho certo, execução
minha errada: **no cabo não existe report de áudio** (o som passa pela placa de
som USB). Mandar o `0x39` de 547 B pelo hidraw do cabo jogou bytes que o
firmware consumiu como ESTADO — barra e LEDs piscando. Ela interrompeu.

## §6 — O que fica

1. **A ponte no produto** — montar o `0x35` em `alto_falante_bt.py`, trocar
   20 ms por 10,667 ms. Sem ela, o som de hoje vive só no ensaio. **É o que
   sobra de maior**;
2. **O segundo defeito do microfone** — as duas curas da §4.1 estão feitas e
   com régua, e o perfil foi de 800 ms decrescente para **1,1 s de energia
   estável**. Ele ainda para depois disso, e o que o derruba não foi achado;
3. **A entrada fantasma** — não nasce em nó de entrada (§4.2). O que falta
   medir é o compositor e o aplicativo em foco;
4. **O negativo de rota e o teste cego do som** — é o que falta para
   `audio.alto_falante@dualsense` sair de `radio_aciona = não`. O contrato está
   escrito na própria célula, e a corrida de hoje cumpriu um terço dele.

## §7 — E as três folhas da bancada ficaram legíveis

Ela não conseguia ler os botões: *"fora que nao deu pra ler nada nos botoes"*. <!-- noqa-acento: citação literal dela --> As três folhas decidiam o tema por
`gtk-application-prefer-dark-theme`, que é **False** na máquina dela sob o tema
**`adw-gtk3-dark`** — escuro. Pintavam a janela de claro e o GTK seguia pintando
`button` e `entry` com letra branca.

O dono agora é `comum.pintar_fundo_solido`, que decide pela **cor que o tema
escreve** (mede a luminância da letra num `Gtk.OffscreenWindow`, sem abrir
janela na tela dela) e pinta `button`, `entry` e `combobox` explicitamente. A
régua é `tests/unit/test_a_folha_le_o_tema_que_o_sistema_pinta.py`, e ela morde
nas três curas.

**A régua nasceu frouxa e foi apertada na mordida:** `"button" in css` passava
com a cura arrancada, porque a palavra sobrevivia dentro de `combobox button`.
É a armadilha que esta casa já nomeia — *régua que casa um token em qualquer
lugar do texto* — e desta vez ela pegou a própria régua.

## §8 — O próximo comando

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
scripts/ensaios/o_som_pelo_035.py --listar     # os bytes, sem abrir porta
git log --since=midnight --format='%h %s'      # o que esta casa fechou hoje
```
