# ONDA2-04 · A ABA ILUMINAÇÃO — o interruptor de verdade, e a cor que se grava ao desligar

**04/09/2026.** Sprint
[`ONDA2-04-ILUMINACAO-01`](../../sprints/2026-09-04-ONDA2-04-ILUMINACAO-01-o-interruptor-de-verdade-e-a-cor-que-se-grava-ao-desligar.md).
Árvore `/mnt/Apate/Desenvolvimento/hefesto-voo/ONDA2-04-ILUMINACAO-A4`, branch
`voo/ONDA2-04-ILUMINACAO-A4`. **Bancada não foi usada** — nenhum caminho desta
frente para o daemon, o `hidraw` ou o `systemctl`.

Posse: `src/hefesto_dualsense4unix/interface/aba04.py` ·
`src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py` ·
`mockup/04-iluminacao.html` · (o publicado, `interface/paginas/04-iluminacao.html`,
**não foi tocado** — ver §4). Criado: `tests/unit/test_a_aba_04_iluminacao_fecha_as_linhas.py`.

**UM ARQUIVO FORA DOS QUATRO, e ele vai declarado:**
`tests/unit/test_a_04_o_trilho_de_brilho_grava.py` — **uma função**,
`test_sem_cor_conhecida_guarda_e_diz`, mais a linha 6 do cabeçalho dele. Ele é a
régua do gesto `brilho` DESTA aba e exigia a frase LONGA por `RuntimeError`; a
decisão [04] dela trocou as duas coisas, e um teste que afirma o comportamento
que ela substituiu não é decisão medida a preservar — é uma régua que passou a
medir o passado. Nenhuma outra frente desta leva tem reivindicação sobre ele.
**O que ele mede não mudou** (o disco recebeu, o aparelho não recebeu, a tela
diz); mudaram o canal e o tamanho da frase, e a docstring dele conta os dois.

As quatro decisões vêm de
[`O PO DECIDE AS 54`](../../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md),
§2, aba `04-iluminacao`.

**OS PORTÕES: 39 de 40 verdes.** O único vermelho é `paridade-gtk-html`, e ele é
**a régua acertando**: a linha 130 do CSV diz `FALTA_NO_HTML` para
`data-gesto="reenviar"`, e a decisão [03] fez esse endereço nascer. O próprio
portão chama isso de *"o caso BOM: alguém trabalhou e o dado ficou velho"*. O CSV
tem um dono só nesta leva (a ONDA1-X) e esta frente não o toca — a última seção
deste relatório lista as linhas para ela lançar.

---

## O que mudou

### 1. O interruptor do automático — D-13, e ela o escolheu contra a recomendação

A lista desta aba recomendava que o botão só **mostrasse** o estado, e que mudá-lo
continuasse na aba Perfis (conflito **C-4**). Ela escolheu o interruptor de
verdade — *"Um interruptor no topo da aba Iluminação"* — e aceitou por escrito a
consequência: *"ok aceito o caminho"*.

**Ele custou ZERO pixel, e os ~30 px que ela aceitou pagar ficaram no bolso.** A
faixa do título do quadro (`.quadro-topo`) é um flex de **17 px** de altura com
dois filhos que somam **87 px** numa linha de **1140** — mil pixels vazios à
direita. Um `margin-left:auto` põe o interruptor lá, e a faixa não cresce: medido
antes e depois, `.quadro-topo` continua com **28 px** (11 de padding + 17 do
`?`). Foi essa folga que deixou a linha de ressalva caber na mesma leva.

O `<input type="checkbox">` é invisível (0×0, `opacity:0`); quem pinta é o
`:checked` do CSS e quem escreve é o **alvo `marcado`** do piloto, o décimo, que
a ONDA0-P entregou. A dica abre **para a esquerda** (`right:22px`): a `.dica` tem
330 px e nasceria fora da janela de 1180 num `?` encostado na borda do quadro.

**E desligar GRAVA a cor de cada controle no ato**, que é a metade que a D-13
existe para ter. Para cada CONECTADO, com o automático **ainda valendo**, o gesto
lê a cor de agora e a escreve no override daquele MAC (`controllers[<uniq>].leds.lightbar`);
só então o `auto_player_colors` vai a `false`, no MESMO `save_profile`. A cor
lida é a **pedida** (`cor_escolhida`, pré-escala de brilho — D8), com queda para
`player_slot_color(numero)` nos estados em que o motor não afirma cor. Depois,
`perfil.gravar_e_reaplicar` — sem ela o campo só entraria em vigor na próxima
troca de perfil, e o interruptor seria o botão que aceita o toque e não age.

### 2. A linha de ressalva debaixo da tira — D-02, decisão [01]

A tira tracejada avisa que a luz não é nossa e **não diz qual das três causas**.
A frase saía do mesmo motor (`controller_card.rotulo_lightbar`) e viajava só no
`title`: some para quem não passa o rato. Agora ela tem linha, pela peça das dez
(`monta.ressalva`), no endereço `luz-ressalva`, emitida a cada tique — e com o
marcador `NADA_A_DIZER` quando não há o que dizer, que é o que a faz **sumir**.

**Ela não é uma oitava faixa da grade, e isso é medição.** Uma faixa a mais
cobra o `--r-passo` inteiro (10 px) em toda tela, inclusive nas que não têm nada
a ressalvar — o pixel que a régua da D-02 mede. Ela mora DENTRO da faixa dos
LEDs, numa `.cel-leds` que empilha a tira e a linha.

**O orçamento, fechado contra o teto medido:**

| | antes | depois |
| --- | ---: | ---: |
| `--r-player` (os botões medem 36 px) | 62 | **52** |
| `--r-leds` (tira 34 + ressalva 22) | 34 | **56** |
| a coluna inteira | 460 | **472** |
| o teto que a caixa do miolo oferece | 476 | 476 |

Doze pixels vieram da folga que a coluna tinha e dez do `--r-player`, que os
tinha sobrando. **A aba não passou a rolar por dentro** — medido, `scrollHeight
== clientHeight`.

### 3. A caixa do hexadecimal virou o botão — decisão [03]

`#0000FF` passa a reenviar aquela cor ao controle. **Nenhum elemento novo e
nenhuma linha** — era a razão da escolha dela, contra o terceiro botão em Opções
(*"a fileira aperta, e aperto é coisa de que você já reclamou noutras abas"*).

O valor vem do **`texto`** do clique, e não de um `data-hex`: aquele atributo é
escrito pelo gerador e ficaria congelado no que o mockup sabia — reenviar por ele
mandaria ao plástico dela a cor do DESENHO, que é o defeito exato que a prova
botão a botão pegou em 01/09. O `textContent` desta caixa é reescrito a cada
tique pelo `data-campo="hex"`.

O sinal de que se pode clicar é o cursor e a borda no rato; num lugar que
esvaziou a caixa mostra `—` e a folha lhe tira o clique (`pointer-events:none`),
com uma segunda trava dentro do gesto.

### 4. A frase do brilho guardado encolheu — e deixou de mentir sobre o desfecho

Decisão [04]: **uma frase curta**, contra a frase inteira e contra o silêncio.

```
antes:  "guardei o brilho em 60% no perfil deste controle. A barra não mudou
         agora porque não há cor a reacender: A Steam tem este controle aberto."
agora:  "Guardei 60%. A barra não mudou agora: A Steam tem este controle aberto."
```

**E o canal mudou, no mesmo dia e pela mesma razão.** A frase saía por
`RuntimeError`, que no piloto é o canal da RECUSA — cartão laranja, 30 s, a cara
de *"o produto não fez"*. E o produto FEZ: o brilho está no disco dela, que é a
promessa inteira do gesto. A docstring desta função pedia, por escrito, *"um
canal de AVISO (nem recusa nem silêncio)"*; a ONDA0-P o entregou com a D-01. O
gesto agora devolve `{"recado": …}` e o cartão sai verde, com 6 s. O pedido saiu
do relato porque foi atendido.

### O que NÃO foi publicado, e é decisão da sprint

`interface/paginas/04-iluminacao.html` **não foi tocado**. A regra 3 da sprint é
explícita — *"Não publica desenho novo (…) A publicação é uma leva só, para o
olho dela"* —, e a seção `## 04-iluminacao.html` de `mockup/DIVERGENCIAS.md` já
existia desde a folha das dez, então o portão `desenho-aprovado` continua verde
sem eu tocar naquele arquivo (que também não é meu).

**Consequência a saber:** enquanto ela não mandar publicar, o produto renderiza a
04 de ontem — sem o interruptor, sem a linha de ressalva e com o hexadecimal
inerte. Os endereços novos não acham onde pousar e o piloto não escreve nada;
calado e correto, que é o mesmo desenho do `CAMPO_DO_DESENHO` desta aba.

---

## Como provei (a mordida colada)

**Sete mordidas, todas feitas, todas com a cura devolvida.** Nenhuma régua deste
arquivo passou com o defeito no lugar.

### A · a gravação da cor ao desligar (a D-13 inteira)

Arranquei o laço `for c in ctx.conectados` do gesto:

```
FAILED  test_desligar_grava_a_cor_de_cada_controle
FAILED  test_a_cor_gravada_e_a_que_estava_acesa
FAILED  test_sem_cor_conhecida_grava_a_do_numero
        KeyError: 'controllers'
3 failed
```

O `auto_player_colors: false` continuava indo ao disco — o interruptor
"funcionava" e a regra dela caía calada. É exatamente o que a régua existe para
ver.

### B · o reenvio lendo o `data-hex` congelado

Troquei `o.get("texto")` por `o.get("hex") or o.get("texto")`:

```
FAILED  test_o_reenvio_ignora_o_data_hex
        AssertionError: o reenvio leu o `data-hex` congelado: ((255, 0, 0),)
        assert ((255, 0, 0),) == ((18, 171, 52),)
```

`test_o_reenvio_manda_a_cor_escrita_na_caixa` continuou VERDE com o defeito —
por isso são dois casos, e o segundo é o que mede.

### C · o orçamento de pixel (`--r-leds:80px`, sem tirar de ninguém)

```
FAILED  test_no_repouso_a_linha_nao_cobra_pixel_e_a_aba_nao_rola
FAILED  test_com_a_frase_a_linha_aparece_e_a_aba_continua_cabendo
        AssertionError: com a ressalva na tela a aba passou a rolar
```

### D · a frase do brilho voltando a ser recusa

Devolvi o `raise RuntimeError(...)` com a frase longa:

```
FAILED  test_o_brilho_guardado_diz_uma_frase_curta_e_nao_recusa
FAILED  test_a_frase_curta_carrega_a_causa_do_motor
        RuntimeError: guardei o brilho em 60% no perfil deste controle. …
```

### E · a ressalva vazia virando string vazia

```
FAILED  test_sem_ressalva_a_linha_recebe_o_marcador
        assert '' == '<i class="nada"></i>'
```

### F · o interruptor perdendo o alvo `marcado`

Aqui quem reprova é o **gerador**, antes de gravar a página:

```
ERRO em 04-iluminacao — decisão dela desfeita:
  - o interruptor perdeu 'data-hef-alvo="marcado"' — sem os três ele é uma
    chave que não lê o perfil nem o muda
```

### G · a folha das dez perdendo as duas metades do `.ressalva`

Comentei `.ressalva:empty` e `.ressalva:has(.nada)` em `monta.CSS_FOLHA`
(arquivo de outra posse — mordido e devolvido por `git checkout`):

```
FAILED  test_no_repouso_a_linha_nao_cobra_pixel_e_a_aba_nao_rola
        AssertionError: a tira ficou descentrada na faixa dos LEDs
        (8.5 acima, 13.5 abaixo) — a linha de ressalva vazia está no fluxo e
        cobra o `margin-top` dela em toda tela
```

**Esta mordida derrubou a primeira versão da régua — ver a §3.**

### A cura devolvida, e a suíte deste arquivo

```
25 passed in 2.71s
```

### A PROVA DE TELA — o clique real, pelo ouvinte real

O piloto (`hefesto_vivo.py`) só abre o **publicado**, e esta frente não publica.
Então o `BOOTSTRAP` — o mesmo JavaScript do piloto — foi avaliado DENTRO de um
Chrome headless sobre a página da bancada, com `window.webkit.messageHandlers`
dublado. É a técnica que a docstring do gesto `cor` documenta desde 02/09. Os
`XDG_*` foram desviados para um lar de mentira antes de importar o produto.

```
[1] CLIQUE NO INTERRUPTOR — o que o ouvinte do piloto mandou:
     {'gesto': 'auto-cores', 'campo': 'auto-cores', 'tipo': 'input',
      'evento': 'click',  'valor': 'on', 'controle': ''}
     {'gesto': 'auto-cores', 'campo': 'auto-cores', 'tipo': 'input',
      'evento': 'change', 'valor': 'on', 'controle': ''}

[2] OS MESMOS PAYLOADS NO GESTO REAL (perfil de mentira):
     evento=click  -> ponte=[]  recado=''
     evento=change -> ponte=['profile_switch', 'chamar']
                      recado='Cores automáticas desligadas. Guardei a cor de …'

     NO DISCO: auto_player_colors=False
       aabbcc000001: lightbar=[0, 0, 255]
       aabbcc000002: lightbar=[255, 0, 0]

[3] CLIQUE NA CAIXA DO HEXADECIMAL:
     {'gesto': 'reenviar', 'campo': 'hex', 'texto': '#0000FF', 'hex': '',
      'tipo': 'span', 'evento': 'click', 'controle': 'p1'}
     no gesto real -> [('led_set_detalhado', ((0, 0, 255),),
                        {'brightness': 1.0, 'uniq': 'aa:bb:cc:00:00:01'})]

[4] A PINTURA — o pacote vivo, pelo `pintar()` do piloto:
     17 valores escritos
     interruptor.checked = False   (o perfil está com o automático DESLIGADO)
     ressalva p1: 'A Steam tem este controle aberto'  altura=17px
     ressalva p2: ''                                  altura=0px
     caixas do hexadecimal: ['#0000FF', '#FF0000']
```

**As quatro coisas que isso prova, e nenhuma delas é dedução:** o ouvinte manda
DOIS eventos por um clique dela e só o `change` age; o desligamento gravou as
duas cores no disco e elas são DIFERENTES; a caixa do hexadecimal chega ao gesto
com `hex` VAZIO e o `texto` vivo; e a linha de ressalva nasce em quem tem o que
dizer e mede zero em quem não tem.

**Fotos** (a janela nunca nasceu na tela dela — Playwright `headless` do começo
ao fim, e nenhuma `Gtk.Window` foi aberta por esta frente):

| | |
| --- | --- |
| antes | `scratchpad/A4-antes.png` |
| depois (repouso) | `scratchpad/A4-depois.png` |
| depois, com o produto vivo pintando | `scratchpad/A4-pintada.png` |

---

## O que medi e derrubou uma suposição

### 1. Medir a ALTURA da linha de ressalva dá VERDE com a cura arrancada

A primeira redação da régua de tela media `.ressalva.getBoundingClientRect().height`
e exigia zero no repouso. Com as duas metades do `.ressalva` **arrancadas** de
`monta.CSS_FOLHA`, o Chrome devolveu:

```
alturas: [0, 0]      display: ["block", "block"]
html:    ['<i class="nada"></i>', '<i class="nada"></i>']
```

**Zero, sem o `display:none`.** Um bloco cujo único filho é um inline VAZIO não
gera caixa de linha. A régua deu verde sobre a cura fora — a família de defeito
que esta casa mais paga, e a mesma que o
`test_a_linha_de_ressalva_so_nasce_quando_ha` já documenta para a peça genérica:
*"quem paga o pixel é o PAI, e é lá que a régua tem de olhar"*.

**A cura mede o vão do pai.** Dentro de um flex o `margin-top:5px` da linha não
colapsa, então a linha escondida-mas-presente empurra a tira 2,5 px para cima:

```
com a peça:  11.0 acima / 11.0 abaixo
sem a peça:   8.5 acima / 13.5 abaixo   ← e agora a régua reprova
```

### 2. O interruptor não custou os ~30 px declarados — custou zero

O custo que ela aceitou era `~30 px fixos, e o mockup da 04 a republicar`.
Medido antes e depois no Chrome, `.quadro-topo` = **28 px** nas duas fotos:
a faixa do título tinha 1053 px vazios à direita. **A decisão fica de pé sem o
preço** — e foi essa folga que pagou a linha de ressalva da D-02.

### 3. O `--r-player` tinha 26 px de sobra, e ninguém sabia

Medido no DOM: a faixa dava **62 px** e o conteúdo (os botões de número, a
`--h-escolha` de 36 px) ia de y=13 a y=49. Ela foi para 52 sem nenhum botão
encolher.

### 4. Um `<input type="checkbox">` não se clica por Playwright — e é certo assim

`page.click('input[data-gesto="auto-cores"]')` estourou em `element is not
visible`. O input é 0×0 de propósito. **Ela clica o RÓTULO**, e a ativação do
`<label>` faz o resto — foi assim que a prova rodou, e é o caminho de verdade.

### 5. O `valor` de um checkbox é sempre `"on"`

O ouvinte manda `el.value`, não `el.checked`. **Não há como ler do clique se ela
ligou ou desligou** — por isso o gesto pergunta ao DISCO e inverte o que está
lá. Uma leitura do payload responderia sempre a mesma coisa.

### 6. O portão da acentuação alcança NOME DE CLASSE CSS

A classe da caixa clicável nasceu `.hex.acao` e o `validar-acentuacao.py`
reprovou em três arquivos (`acao -> ação`). Ele varre o texto, e um identificador
CSS é texto como qualquer outro. **A cura foi renomear, não isentar**:
`.hex.reenvia` diz a mesma coisa, é palavra correta sem acento, e não gasta um
`noqa-acento` — que é o que se usa quando a palavra TEM de ficar (o `paginas` de
`onde.py`, por exemplo, que é nome de pasta).

---

## O que NÃO verifiquei

* **No APARELHO, nada.** A bancada não foi usada e nenhum DualSense recebeu
  byte desta frente. Tudo o que este relatório afirma sobre o daemon passa por
  um dublê da ponte. O que o `profile.switch` faz com a barra de luz quando o
  automático sai **não foi medido no plástico**.
* **No WebKitGTK, nada.** O piloto abre só o publicado, e esta frente não
  publica. A prova rodou num Chrome. As duas regras que dependem do motor —
  `:has()` no `.ressalva` (já em uso pela folha das dez) e o `input:checked +`
  do interruptor — **não foram vistas no WebKit dela**. O `input:checked +`
  é seletor de nível 3 e não é aposta; o `:has()` já era usado antes desta
  frente.
* **A prova botão a botão (`--prova-gesto`) NÃO foi rodada nesta aba**, e de
  propósito: o gesto `auto-cores` grava no perfil e ainda não está protegido —
  ver a primeira linha do que sobra.
* **A suíte inteira** não foi rodada: ela é de quem coordena, e roda no fim, em
  oito lotes. Rodei o meu escopo.

---

## O que sobrou para o próximo

### É de outra posse, e o primeiro é urgente

1. **`("04-iluminacao.html", "auto-cores")` tem de entrar em
   `hefesto_vivo.PERIGOSOS`** — `interface/hefesto_vivo.py` é da ONDA 0 e a
   sprint me proíbe de tocá-lo. O gesto chama `gravar_e_reaplicar`; sem a linha,
   a próxima `--prova-gesto`/`--prova-no-aparelho` **clica o interruptor e
   desliga o automático no perfil DELA** para provar que sabe clicar — gravando
   uma cor por controle no caminho. Quem já reprova por isso, nomeando o gesto,
   é `tests/unit/test_todo_gesto_que_grava_esta_protegido.py`. **A linha é uma
   só**, e o comentário daquela lista já pede que ela entre *"no mesmo commit
   que o ensinou a gravar"*.

2. **`docs/data/paridade-gtk-html.csv:130` fechou** — ver a lista abaixo. Ela é
   a causa do único portão vermelho desta entrega.

3. **`app/textos_de_aplicacao.frase_do_desfecho` devia devolver QUAL dos quatro
   destinos venceu**, e não só a frase. Sem isso, `_escrever_a_cor` não consegue
   separar *"guardado"* de *"recusado"* e continua mandando os dois pelo canal
   laranja de 30 s. Fecharia para as dez abas. (O RELATO antigo desta função —
   *"falta um canal de aviso no piloto"* — foi **substituído**: o canal existe
   desde a D-01, e o que falta agora é o dado.)

4. **`a06_navegacao.NADA_A_DIZER` continua sendo a terceira cópia do literal.**
   O comentário de `monta.py` diz que a frente da aba 06 na Onda 2 aponta a de
   lá para cá; esta aba nasceu com a quarta, e a régua nova as compara.

5. **O instrumento que dirige a BANCADA pelo ouvinte real merece morar em
   `scripts/`.** Ele foi escrito nesta frente e vive no rascunho: carrega o
   `hefesto_vivo.BOOTSTRAP` num Chrome headless com
   `window.webkit.messageHandlers` dublado, clica de verdade e devolve o payload
   que o piloto mandaria. **É o único jeito de provar um clique numa aba que
   ainda não foi publicada** — e nesta leva são dez. `scripts/` não é posse
   desta frente; a saída dele está colada acima.

### É desta aba, e não coube

As quatro linhas de `MOTOR` do enunciado **não foram feitas**, e a razão é uma
só e é medida: **as quatro pedem elemento novo na tela, e a coluna terminou a 4
px do teto.**

| linha | por que não coube |
| --- | --- |
| Marcar/desmarcar cada uma das 5 luzes de jogador | pede cinco alvos clicáveis dentro do `.aceso`, que tem 34 px de altura e é o desenho da tira, não um controle |
| Presets 'Desenho do P1'…'P4' e 'Todas acesas'/'Todas apagadas' | seis botões por coluna; a célula Opções já tem dois e ela reclamou de aperto |
| Botão 'Aplicar o desenho' (reenvio das 5 luzes) | depende da linha acima existir |
| 'Voltar todos ao automático' | é um botão de MESA, e esta aba não tem faixa de mesa |

**As quatro são desenho novo, e desenho novo é decisão dela** — a `PROVA-DE-TELA-01`.
O motor delas já existe (`player_leds_set_detalhado`, `player_led_pattern`,
`lightbar.reset`); o que falta é o lugar na tela e o olho dela sobre ele.

---

## AS LINHAS DO CSV QUE ESTA FRENTE FECHOU

Para a ONDA1-X lançar — **eu não toquei em `docs/data/paridade-gtk-html.csv`**,
por ordem da sprint.

| linha | feature | veredito hoje | o que mudou |
| ---: | --- | --- | --- |
| **130** | Botão de reenvio explícito da cor ('Aplicar no controle') | `FALTA_NO_HTML` | **FECHOU.** O sinal `data-gesto="reenviar"` existe em `interface/aba04.py` e em `mockup/04-iluminacao.html`. É o único que o portão acusa hoje. |
| **146** | Checkbox 'Cores automáticas por controle' (`auto_player_colors`) | `FALTA_NO_HTML` | **FECHOU** pelo interruptor da D-13 — ler e ESCREVER. O portão não acusa porque o `sinal` é `on_auto_player_colors_toggled`, uma função da GTK que o lado HTML nunca vai chamar: a dívida fechou por outro caminho, e o veredito precisa ser remedido no ATO, não no símbolo. |
| **138** | Ressalva do estado da barra (Nativo / Steam / fonte desconhecida / apagada) | `DIFERENTE` | A ressalva saiu do `title` e ganhou LINHA (`data-campo="luz-ressalva"`). O `porque` desta linha diz que ela *"viaja só no `title`"* — deixou de valer. |
| **150** | Prévia honesta quando o automático está ligado | `FALTA_NO_HTML` | **FECHOU pela decisão [02]**: a lista da aba já a tinha fundido na pergunta do automático, e o que sobrava era "de onde veio a cor de agora" — agora a tela mostra o estado do automático. |
| **151** | Regra D4 — cor única em 'Todos' desliga o automático e AVISA | `FALTA_NO_HTML` | **NÃO É DÍVIDA** — o fato que a sustentava caiu em 04/09 e não existe escopo 'Todos' nesta aba. A lista da aba já a descartou; fica registrado para ninguém a ressuscitar. |

**O portão `paridade-gtk-html` está VERMELHO por causa da linha 130**, e é o
portão fazendo o que ele existe para fazer — o próprio arquivo o chama de *"o
caso BOM: alguém trabalhou e o dado ficou velho"*. Corrigi-lo exige mexer no CSV
**e** regerar a tabela publicada em
`docs/process/2026-09-03-O-TERCEIRO-NUMERO-a-paridade-com-a-gtk.md` (a regra
`numero-publicado` compara as contagens por aba **e** a linha `TODAS`) — e a
linha `TODAS` é a que TODAS as frentes desta leva tocariam. É por isso que o CSV
tem um dono só nesta leva, e por isso eu parei aqui.
