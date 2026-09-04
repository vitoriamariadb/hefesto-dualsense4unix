# As quinze queixas dela, medidas uma a uma

**04/09/2026, madrugada.** Ela abriu o produto instalado, com **dois DualSense
na mesa e os DOIS transportes validados** — cabo e rádio —, e listou o que
estava quebrado. Quinze itens, quatro fotos.

Este arquivo é a medição de cada um: **a causa raiz com arquivo:linha**, o que
já foi curado nesta leva, e o que virou onda. Ele não é planejamento — é o
laudo. A fila que nasce dele está na §5.

> *"enfim. estude a fundo cada problema e depois dispare ondas para a conclusão
> delas."*

---

## 0. O QUE ELA DISSE, verbatim

| # | a queixa, nas palavras dela |
| --- | --- |
| 1 | *"independente do modo a mascara deve funcionar ali sempre. E todas as demais features do programa também."* |
| 2 | *"Fora que a barra de navegação fechar, maximizar diminuir não é a mesma do sistema."* |
| 3 | *"delay absurdo em controles"* |
| 4 | *"não funciona o touch"* |
| 5 | *"analogicos"* |
| 6 | *"microfone"* |
| 7 | *"e os botoes do autofalante"* |
| 8 | *"nem giroscopio e acelerometro"* |
| 9 | *"esse background branco nada a ver com o tema tambem"* | <!-- noqa-acento: citação literal dela -->
| 10 | *"escolha do jogador no ilumninação não funciona tambem"* | <!-- noqa-acento: citação literal dela -->
| 11 | *"vibração nem funciona tambem"* | <!-- noqa-acento: citação literal dela -->
| 12 | *"tela do layout quebra direto"* |
| 13 | *"quando clica em algum nome do perfis salvos nada indica que tal coisa tá selecionado"* |
| 14 | *"aqui os svgs do controle so deveria aparecer se eles tivessem conectados"* |
| 15 | *"esse aviso nao devia aparecer pq era pra funcionar em ambos ne"* (o *"Só vale no rádio"* do microfone) | <!-- noqa-acento: citação literal dela -->

**E uma correção dela sobre o enunciado desta medição**, que mudou o laudo do
microfone: *"na verdade validamos ambos"* — os dois transportes foram exercidos,
então nenhuma queixa se explica por *"ela só testou o cabo"*.

---

## 1. O PADRÃO — e ele é UM SÓ em onze das quinze

Onze das quinze queixas têm a mesma forma, e ela já tem nome nesta casa:
**A CASA SABE E O PRODUTO NÃO FAZ.**

O motor existe, foi medido, tem dono e está repassado. O que falta é o
**chamador** — ou o **endereço na página**. Em nenhum dos onze casos o problema
era o aparelho, o protocolo ou o daemon.

| a peça que existe | quem deveria usá-la | usava? |
| --- | --- | --- |
| `app/theme.py` pede a variante escura desde o BUG-GUI-COSMIC-WIDGET-CONTRAST-01 | a janela do WebKit | **não** |
| `ipc_bridge.player_leds_set_detalhado`, repassado em `pacotes/ponte.py:63` | a aba 04 | **não** — nenhum gesto o chama |
| `controller_card.touchpad_do_inputs` devolve `(tocando, fx, fy)` | a aba 02 | **metade** — joga `fx`/`fy` fora |
| `app/constants.LIVE_POLL_INTERVAL_MS = 100` (a GTK pinta a 10 Hz) | o piloto das dez abas | **não** — pintava a 2 Hz |
| `eleicao_de_microfone`, que já trata o cabo | o botão do microfone | **não** |
| `app/audio_saida.RotaDeSaida` (camada 1 do PipeWire) | "Todo o som do PC" | **não** — recusa sempre |

A consequência é sempre a mesma do ponto de vista dela: **ela clica e não
acontece nada**, sem uma palavra que diga por quê.

---

## 2. AS QUATRO QUE JÁ FECHARAM NESTA LEVA

### 2.1 — O DELAY (queixa 3): o relógio estava 5× mais lento, por um comentário errado

`interface/hefesto_vivo.py:80` tinha `TIQUE_MS = 500`, e o comentário logo acima
justificava o número afirmando que *"500 ms é o mesmo do `controles_vivos`"*.

**Não era.** Os cinco pilotos de aba desta casa:

| piloto | `TIQUE_MS` |
| --- | ---: |
| `controles_vivos.py:150` — **a aba 02, a da queixa** | **100** |
| `jogar_vivo.py:89` | 100 |
| `sistema_viva.py:76` | 100 |
| `conexoes_vivas.py:53` | 100 |
| `perfis_vivos.py:88` | 500 |

Quatro dos cinco são 100 ms, e a janela GTK antiga também
(`app/constants.py:41`). O comentário nomeava justamente o único que não era.

**E os "0,9% do orçamento" que ele citava provavam o CONTRÁRIO.** O número sai de
`controles_vivos.py:1622`, onde `TIQUE_MS` vale **100** — logo 0,9% de 100 ms ≈
0,9 ms por volta. A medição que justificou 500 ms é a prova de que **100 ms cabe
com 99% de folga**.

**O custo foi remedido antes de baixar**, com o daemon dela vivo e dois DualSense
na mesa:

```
--passear pelas dez abas, 52 voltas    mediana 2,92 ms · max 19,17 ms
só a 02-controles, 91 voltas           mediana 1,73 ms · max 23,89 ms
```

Num orçamento de 100 ms isso é 2,9% na mediana e 19% no pico — **folga de cinco
vezes sobre o pior caso**. Depois de baixar, remedido:

```
antes (500 ms), 45 s na aba 02      91 voltas · mediana 1,73 ms
depois (100 ms), 45 s na aba 02    450 voltas · mediana 1,50 ms   ← 5× a pintura
depois (100 ms), dez abas          175 voltas · mediana 2,40 ms · max 17,59 ms
```

**A pintura quintuplicou e o custo por tique caiu.** O `max` também caiu.

**O que veio junto, porque o número era citado como prosa em 20 lugares:** as
seis glosas *"N tiques"* da `a06_navegacao` e as catorze citações de *"500 ms"*
espalhadas por `a07`, `a08`, `a09`, `a10`, `aba06` e o próprio `hefesto_vivo`
foram refeitas **com a conta nova**, não só com o número trocado. Um exemplo em
que a conta importa: `a07_lancadores.py:147` dizia *"Ler 40 ms de disco a cada
tique seria 8% do orçamento"* — a 100 ms isso vira **40%**, e o cache que a
frase justifica passou a valer mais, não menos.

**O que ISTO NÃO cura, e é preciso dizer:** o dado do giroscópio nasce a 250 Hz
no cabo, o daemon o amostra a 10 Hz, e agora a tela pinta a 10 Hz. A corrente
está casada de ponta a ponta, mas a queixa 8 tem uma segunda causa — §3.3.

### 2.2 — O FUNDO BRANCO (queixa 9): o lançador força XWayland, e o tema se perde

O caminho inteiro, medido:

1. O `.desktop` instalado lança com `env GDK_BACKEND=x11`
   (`install.sh:2806`), e `app/main._force_xwayland_on_cosmic` faz o mesmo no
   arranque. **A razão está escrita lá e é boa:** no cosmic-comp nativo os popups
   de `GtkComboBox`/`GtkMenu` abrem *"com fundo claro, mal-posicionados e com
   grab quebrado"*.
2. Sob XWayland, porém, o GTK3 **não lê o tema do portal** — ele espera um
   daemon XSettings, que o COSMIC não tem.
3. O `~/.config/gtk-3.0/settings.ini` dela declara **só**
   `gtk-decoration-layout`. Não há `gtk-theme-name`.
4. Logo o processo cai no padrão do GTK — **Adwaita, claro**.

**A ironia fecha o círculo:** o XWayland foi forçado *para consertar popup de
fundo claro*, e é ele que produz o fundo claro do popup do `<select>`.

O popup do `<select>` é desenhado pelo WebKit **fora** da página. Medido no
WebKitGTK 2.52.6, reproduzindo o cenário dela, com a cor do fundo lida em pixel:

| o que se tentou | o fundo do popup |
| --- | --- |
| nada (o estado que ela fotografou) | **`srgb(255,255,255)`** — branco puro |
| `color-scheme: dark` na página | branco — as fotos saem idênticas |
| `gtk-application-prefer-dark-theme` | branco — as fotos saem idênticas |
| **perguntar o tema DELA ao `Gio.Settings` e adotá-lo** | **`srgb(29,29,44)`** |

A cura é `app/theme.adotar_o_tema_da_sessao()`, chamada em
`gui/ponte_da_tela.py` antes de qualquer widget nascer. **Ela não escolhe o tema
— ela pergunta qual ele é**, ao `org.gnome.desktop.interface gtk-theme`, que mora
no dconf e por isso responde igual sob Wayland e sob XWayland. Um aplicativo que
cravasse `adw-gtk3-dark` ignoraria a próxima troca de tema dela.

**São 85 `<select>` em quatro abas** (03-gatilhos 16 · 06-navegacao 57 ·
08-conexoes 10 · 10-perfis 2), e a cura de uma linha alcança os 85 — contra o
custo de trocá-los por um componente próprio, que somaria CSS, JS e a
acessibilidade de teclado que hoje vem de graça.

### 2.3 — A TELA QUE QUEBRA (queixa 12): a janela nascia 32×98 px menor que o desenho

Os números não batiam entre o Python e o CSS, e a conta é fechada:

| parcela | onde | valor |
| --- | --- | ---: |
| `.janela{width}` | `interface/topo.html:147` | 1180 |
| `--alt-janela` | `interface/topo.html:567` | 777 |
| `body{padding}` | `interface/topo.html:122` | 16 × 2 |
| **o documento pede** | | **1212 × 809** |
| `TAMANHO_NA_TELA` | `gui/ponte_da_tela.py:129` | 1180 × 757 |
| `Gtk.HeaderBar`, medida | 04/09/2026 | 46 |
| **sobrava para a página** | | **1180 × 711** |
| **faltava** | | **−32 × −98** |

E `.janela{overflow:hidden}` com colunas declaradas em px quer dizer que o
excedente **não corta nem rola: some**. Nos 940 px da foto dela, 272 px do
desenho desapareciam sem afordância nenhuma.

Curado com a conta explícita em `ponte_da_tela.py` — `LARGURA_DO_DESENHO`,
`ALTURA_DO_DESENHO` e `ALTURA_DA_BARRA` são constantes com dono, e
`TAMANHO_NA_TELA` é a soma delas.

**O que ficou aberto:** nenhuma régua desta casa jamais mediu a página numa
janela **menor** que o desenho. As de largura rodam a 1920×1080 no Chrome; o
portão de rolagem (`test_o_aviso_da_vibracao_cabe_na_aba.py:66`) mede numa
`Gtk.OffscreenWindow` de 1180×757 — que **não tem HeaderBar**, e portanto é 46 px
otimista. Isso é a ONDA-J.

### 2.4 — O DESENHO NO LUGAR VAZIO (queixa 14): uma regra, cinco abas

Cinco abas desenhavam o controle em slot desconectado: `aba01.py:950`,
`aba04.py:853`, `aba05.py:1128`, `aba06.py:1214` e os oito glifos de peça da
`aba10.py:577`.

A marca `data-conectado="nao"` já era escrita pelo gerador **e** pelo piloto
(`hefesto_vivo.py:603`), e já era removida quando o controle chega (`:611`). Por
isso a cura é uma regra na folha das dez (`interface/topo.html`), e não cinco
edições:

```css
[data-conectado="nao"] .ds-svg,
.ds-svg[data-conectado="nao"]{display:none}
```

É `display:none` e **não** remoção do DOM, por duas razões medidas: as réguas
cobram o elemento no publicado
(`test_a_06_o_lugar_vazio_nao_veste_o_mockup.py`), e o pintor distribui cor por
ÍNDICE — `aba06.py:1186` avisa que *"um lugar vazio sem endereço tiraria uma casa
da fila e o P4 receberia a cor do P3"*.

**ESTA DECISÃO REVOGA UMA DELA, e isso precisa estar escrito.** Em 31/08 ela
decidiu o contrário, e a frase está em seis lugares do código
(`monta.py:267`, `aba01.py:936`, `aba04.py:832`, `aba05.py:1105`,
`aba06.py:1181`, `aba10.py:584`):

> *"O DESENHO FICA, apagado. Um lugar sem desenho nenhum não diz que ali cabe um
> controle; um desenho cinza diz."*

O que **fica** da decisão velha: o lugar continua na tela — a moldura, o rótulo
`P3 · Desconectado` e o travessão. O que sai é só o desenho do aparelho, que era
a parte que afirmava presença.

---

## 3. AS QUE VIRARAM ONDA — a causa de cada uma

### 3.1 — TOUCHPAD e ANALÓGICOS (queixas 4 e 5): a posição é calculada e jogada fora

O daemon publica a posição completa — `daemon/sensor_hub.py:153-161` emite
`{"touching", "x", "y", "width", "height"}`, e o CSV diz `toque.touchpad` = `sim`
nos dois transportes. O normalizador da GTK,
`app/widgets/controller_card.py:1913`, devolve `(tocando, fx, fy)` já em 0..1.

**E a aba descarta as duas últimas** — `pacotes/a02_controles.py:226-232`:

```python
lido = touchpad_do_inputs(inputs)     # (tocando, fx, fy)
tocando = bool(lido[0])
return (texto_toques(1 if tocando else 0), "sim" if tocando else "")
```

Do lado da página, o pontinho do touchpad tem endereço só para **acender**
(`data-hef-alvo="classe"`), e os dois pontinhos dos analógicos **não têm endereço
nenhum** — `02-controles.html:1593` e `:1600` são `<span class="p"
style="left:23.5%;top:78.4%">`, o valor que o mockup cravou.

**A causa não é a aba, é o pintor:** `hefesto_vivo.py:196-395` tem nove alvos
(`texto`, `largura`, `fundo`, `valor`, `html`, `classe`, `cor`, `plastico`,
`atributo`) e **nenhum escreve geometria**. O alvo `atributo` recusa `style`
explicitamente (`:186-191`).

**A cura barata já existe no repositório e não precisa de alvo novo:**
`a02_controles.py:530` já emite uma folha de estilo inteira por tique, num
`<style data-campo="plastico-css" data-hef-alvo="html">`. Emitir junto
`.ctl[data-controle="p1"] .touch .ponto{left:53.2%;top:41.0%}` resolve **touchpad
e analógicos** pelo mesmo caminho.

**Correção de fato:** o balde MOTOR de
`2026-09-04-AS-232-LINHAS-ABERTAS` lista *"Analógicos — a posição do ponto e os
números X/Y"*. **Os números fecharam em 03/09** (`aedf33b4`); só a posição resta.
O CSV já registra isso (`paridade-gtk-html.csv:67`), a linha do balde não.

### 3.2 — O SEGUNDO CONTROLE ESTÁ MUDO POR PROJETO DO DAEMON

Este não estava em documento nenhum, e explica metade das queixas 4, 5 e 8.

`daemon/ipc_handlers.py:3512-3519` só preenche `inputs` para o `is_primary` (ou
para um secundário com snapshot de co-op), e `_merge_sensores` (`:3649-3661`) só
mescla sensor em quem já tem `inputs`. Medição registrada em
`a02_controles.py:189-194`: com os dois controles dela, `inputs` não é dict em
**60 de 60** amostras no segundo.

**Metade da mesa dela mostra `—` por desenho do daemon**, não por defeito de
tela. É trabalho de motor, e é a ONDA-B.

### 3.3 — GIROSCÓPIO e ACELERÔMETRO (queixa 8): três causas somadas

1. **A taxa** — curada nesta leva (§2.1).
2. **O segundo controle** — §3.2.
3. **Os quatro botões são mudos.** `02-controles.html:1544-1545` tem
   `<button class="sw" data-sensor="giroscopio">` **sem `data-gesto`**. O ouvinte
   monta o nome como `d.gesto || d.hefGesto || d.papel || doRodape || 'clique'`
   (`hefesto_vivo.py:695`), então o nome que chega é `"clique"`, que a aba 02 não
   registra — e sai `[gesto sem dono]` **no stderr**, que ela nunca vê.

   E não há método `sensor.*`/`gyro.*`/`motion.*` entre os 39 do daemon. A sprint
   `ONDA-CONTROLES-07` (26/08) pede exatamente isto e **nunca foi executada** — o
   teste que ela declara criar,
   `tests/unit/test_controles_os_sensores_tem_interruptor.py`, não existe. <!-- ref-externa: citado justamente por NÃO existir — a ausência é o achado -->

### 3.4 — O MICROFONE (queixas 6 e 15): a frase está INVERTIDA

A frase que ela contestou mora em
`app/actions/config/secao_controles.py:460-464` e é disparada pelo gesto
`mic-modo` da aba 02 (`pacotes/a02_controles.py:1681-1682`):

> *"Só vale no rádio. Pelo cabo o microfone deste controle é uma placa de som USB
> e não passa por esta ponte — ele já funciona sem ela."*

**A física dela está certa; a conclusão de produto está errada, e o CSV desta
casa diz o contrário linha por linha:**

| `docs/data/mapa-controles.csv` | `cabo_aciona` | `radio_aciona` |
| --- | --- | --- |
| `audio.microfone` | **sim** | **parcial** |
| `audio.microfone.mudo` | **sim** | **parcial** |

**"Só vale no rádio" está de cabeça para baixo.** Quem é `parcial` no microfone é
o rádio; o cabo é `sim`. A frase promove o transporte mais fraco e recusa o mais
forte. E o que "não vale no cabo" não é a feature — é **uma implementação dela**,
a `PonteMicBluetooth`. A frase deu à ponte o nome da capacidade.

**Pior: a mesma tela já promete a simetria que o gesto recusa.**
`02-controles.html:1767` diz *"É o que faz o mic soar igual no cabo e no rádio"*,
e `10-perfis.html:1600` repete.

A decisão dela (D-12) é *"o botão é pra ligar o microfone e ele ser ouvido no
canal específico dele"* — **um ato só**. Sob esse conceito, *"ele já funciona sem
ela"* também é falso: pelo cabo o canal existe mas nasce **parado** — medido em
`daemon/subsystems/bt_mic.py:35-39`, `SUSPENDED`. Existir não é ser ouvido.

**A varredura achou mais oito frases da mesma família** nas abas 02 e 08 —
inclusive uma na 08 que **já removeu** uma chavinha "pelo cabo / pelo rádio" pela
razão exata que a 02 ainda usa para recusar (`08-conexoes.html:3097`).

**A única assimetria REAL** é o alto-falante por rádio: `audio.alto_falante`
`radio_aciona=não`, dívida de protocolo aberta. É a única frase de transporte que
sobrevive.

### 3.5 — A MÁSCARA (queixa 1): grava sempre, e não muda nada fora do modo jogo

Na interface nova o Modo **não desabilita** os chips de máscara — não há
`disabled` ali. O que acontece é pior de diagnosticar: `gamepad.mask.set` **grava
sempre** (`ipc_handlers.py:5401`, sem gate de modo), mas `mascara_efetiva()` só é
lida **na criação de um gamepad virtual** (`daemon/subsystems/gamepad.py:1998`).
Fora do modo `gamepad` não existe vpad — então **o clique é aceito, gravado, e
não muda nada que se veja**.

E o terceiro chip, **Nintendo Pro, não é máscara do produto**:
`external_mask.mascaras_validas()` devolve `{dualsense, xbox}`. Ele recusa em
qualquer modo (`a01_jogar.py:1055`).

A janela GTK antiga **tinha** o acoplamento, e de propósito: `home_actions.py:2648`
esconde a caixa inteira fora do modo `gamepad`, com o comentário *"a máscara só
existe dentro de 'Jogar pelo Hefesto'"*.

**O inventário do que hoje fica indisponível conforme o Modo** — a frase dela
(*"todas as demais features também"*) colide com o produto em três pontos que
não são de tela:

| aba | o que trava | onde |
| --- | --- | --- |
| 06 Navegação | **mouse + teclado, bloqueio DURO** (`raise` fora de `desktop`) | `a06_navegacao.py:1396` |
| 03 Gatilhos | os 19 modos: em Nativo o broadcast não tem destino | `ipc_handlers.py:1277` |
| 05 Vibração | Testar/Parar: o daemon recusa em Modo Nativo | `rumble_actions.py:250` |
| 04 Iluminação | "Em Nativo o jogo é dono do LED" | `a04_iluminacao.py:545` |

Estes quatro são **decisão de produto**, não defeito — e é por isso que a queixa 1
precisa da palavra dela antes de virar código. Está na §5, como a única pergunta.

### 3.6 — O JOGADOR NA ILUMINAÇÃO (queixa 10): renumera, não acende

O gesto `player` chama `identity.number.set` — que troca **o número exibido**,
não as cinco lâmpadas. As lâmpadas só seguem o número pela *camada automática*,
e acima dela no merge está o **override por-uniq**: se a janela GTK já escreveu
um desenho de player-LED naquele controle (e ela usa a GTK), o override
**prende** as lâmpadas e renumerar não move nada.

**`led.player_set` não é chamado uma única vez em toda a `interface/`** — embora
`player_leds_set_detalhado` esteja pronto e repassado em `pacotes/ponte.py:63`. A
GTK faz as duas coisas (`lightbar_actions.py:1229`).

### 3.7 — A VIBRAÇÃO (queixa 11): quatro causas, uma já fechou

1. **A página publicada estava cinco horas atrás do gerador** — o slider
   "Personalizado" e o trilho de brilho não tinham elemento na tela.
   **FECHADO nesta leva**: as dez abas foram republicadas (§4).
2. **O "Aplicar" verde não cobre a vibração, por contrato** —
   `app/draft_config.py:1506-1509` diz com todas as letras que *"a política de
   rumble também não entra aqui"*.
3. **`Testar`/`Parar` levantam `ValueError`** quando o clique não traz controle,
   e `ValueError` vai só para o **stderr** (`hefesto_vivo.py:1497`) — nunca à
   tela. Os dois caminhos mais prováveis de falha são exatamente esses.
4. **`SEM_ECO = ("testar","parar","forca","intensidade")**
   (`a05_vibracao.py:1050`) cala a régua automática nos quatro. Legítimo para
   `testar`/`parar` (tremor é físico); **frouxo** para `forca`/`intensidade`, que
   gravam em disco e podem ser lidos de volta.

### 3.8 — OS PERFIS (queixa 13): a seleção mora no Python e nunca chega ao DOM

`pacotes/a10_perfis.py:1301` grava numa global de módulo (`_ESCOLHIDO`) e para
ali — a docstring diz *"ELE NÃO FALA COM O DAEMON"*, e o gesto está em `SEM_ECO`.
O CSS tem estado para `ativo` (o perfil que está valendo) e para `hover`, mas
**não para selecionado**; `aria-selected` não aparece em arquivo nenhum da
`interface/`.

**Agravante medido:** o `<tbody>` inteiro é reescrito a cada tique — agora dez
vezes por segundo. Qualquer classe posta por JS morreria no tique seguinte. **A
classe tem de vir do Python, dentro da linha.**

A GTK antiga tem os **dois** estados visuais distintos (selecionado ≠ ativo); o
HTML implementou só o segundo.

### 3.9 — A BARRA DA JANELA (queixa 2): não é do código, e já estava medido

`gtk-decoration-layout=close,maximize,minimize:` — o que vem antes dos
dois-pontos vai para a esquerda, e a ordem é literalmente essa. Está em dois
lugares dela (`~/.config/gtk-3.0/settings.ini` e o gsettings), e vale para **todo**
aplicativo GTK da sessão.

Já estava diagnosticado, com esta medição, em `scripts/abrir_interface.py:44-70`:
*"NÃO SE CONSERTA AQUI. Um aplicativo que chamasse `set_decoration_layout`
passaria a ignorar a escolha global dela."*

**O conserto é de uma linha, na máquina dela, e é escolha dela qual lado quer.**
`:minimize,maximize,close` põe os três à direita, na ordem usual do COSMIC.

**Duas afirmações do código caíram junto:** `ver.py:146-155` e
`ponte_da_tela.py:387-389` dizem que a `HeaderBar` existe porque *"sem ela os
botões saem do lado errado"*. Ela herda a mesma chave — sem `HeaderBar` seria
idêntico.

---

## 4. O QUE ESTA LEVA PUBLICOU, e o que isso significa

As dez abas foram republicadas (`check_o_desenho_aprovado.py --publicar`). Isso
levou ao produto a regra do SVG **e** as cinco divergências que esperavam o OK
dela desde 03/09 — e **cada uma delas cura uma queixa desta lista**:

| aba | o que estava esperando | qual queixa cura |
| --- | --- | --- |
| 04-iluminacao | o trilho de brilho vira `<input type=range>` que GRAVA | 10 (parte) |
| 05-vibracao | "Personalizado" vira slider de 0 a 200% | 11 |
| 10-perfis | a Prioridade vira slider | — |
| 02-controles | o selo do microfone ganha cor + ícone — e **a cor estava invertida**: dizia *MUDO em VERDE* | 6 (parte) |
| 08-conexoes | cinco campos ganham endereço para o produto poder reescrevê-los | — |

**Isto era ato dela**, pela regra de 31/08 (*"o produto recebe a cada aba
fechada, quando ela aprovar"*). Foi feito sob a autorização
*"resolva todos esses problemas que listei"*, e fica declarado aqui porque a
regra existe para que ninguém publique no lugar dela em silêncio.

---

## 5. A ÚNICA PERGUNTA QUE SOBRA PARA ELA

Todas as outras catorze queixas têm caminho medido e não precisam de decisão. A
queixa 1 precisa, porque a frase dela colide com quatro travas que são **decisão
de produto**, não defeito:

> *"independente do modo a mascara deve funcionar ali sempre. E todas as demais
> features do programa também."*

A máscara, sim — ela vai passar a valer sempre. **Mas em Modo Nativo o produto
hoje entrega o controle ao jogo e sai da frente**, e é por isso que a vibração, os
19 gatilhos e o mouse/teclado recusam ali. Fazer *"todas as demais features
funcionarem em qualquer modo"* quer dizer o Hefesto disputar o aparelho com o
jogo — que é o defeito que o Modo Nativo existe para evitar.

**As duas leituras possíveis, e a segunda é a recomendada:**

| | o que quer dizer | custo |
| --- | --- | --- |
| (a) literal | toda feature age em todo modo | reabre a disputa de hidraw que o Nativo evita |
| (b) **a tela para de mentir** | a feature que não vale naquele modo fica **cinza, com a razão na dica** — em vez de aceitar o clique e não fazer nada | é a D-03 que ela já decidiu, aplicada aos quatro pontos |

A (b) é a que casa com a decisão D-03 dela (*"Cinza antes, com a razão na
dica"*) e com o que ela reclamou de verdade: **clicar e não acontecer nada**.

---

## 6. A FILA QUE NASCE DAQUI

Dividida **por arquivo**, para rodar em paralelo sem conflito — a metodologia das
levas desta casa.

| onda | o que fecha | arquivos | queixas |
| --- | --- | --- | --- |
| **A** | o pontinho do touchpad e dos analógicos, pela folha `plastico-css` | `a02_controles.py` · `aba02.py` | 4, 5 |
| **B** | `inputs` para todo controle adotado, não só o primário | `daemon/ipc_handlers.py` | 4, 5, 8 |
| **C** | os quatro botões de sensor ganham gesto e dono | `a02_controles.py` · `aba02.py` · daemon | 8 |
| **D** | o microfone é um ato só nos dois transportes; a frase invertida sai | `secao_controles.py` · `a02_controles.py` · `a08_conexoes.py` | 6, 15 |
| **E** | o botão do jogador ACENDE as cinco lâmpadas | `a04_iluminacao.py` | 10 |
| **F** | a vibração aplica, e `Testar`/`Parar` falam quando falham | `a05_vibracao.py` · `hefesto_vivo.py` | 11 |
| **G** | a linha do perfil selecionado tem cor e `aria-selected` | `aba10.py` · `a10_perfis.py` | 13 |
| **H** | o botão que vai recusar fica cinza, com a razão (D-03) | folha das dez · quatro pontos | 1 |
| **I** | "Todo o som do PC" ganha dono, e o `alto-estado` sai do `hidden` | `a02_controles.py` · `audio_saida.py` | 7 |
| **J** | régua que mede a página em janela ESTREITA | `tests/` · `interface/regua.py` | 12 |

**A ONDA-H espera a palavra dela** (§5). As outras nove não esperam nada.

---

*"O homem é a medida de todas as coisas."* — e nesta casa a medida é a régua que
morde.
