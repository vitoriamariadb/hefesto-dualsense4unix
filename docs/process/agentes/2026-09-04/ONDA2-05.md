# ONDA2-05 · A ABA VIBRAÇÃO — a barra do motor virou ajuste, e o degrau ganhou dois donos

Agente **A5**, 04/09/2026. Árvore `hefesto-voo/ONDA2-05-VIBRACAO-A5`, branch
`voo/ONDA2-05-VIBRACAO-A5`, nascida de `dev` em `c386d077`.

Sprint:
[2026-09-04-ONDA2-05-VIBRACAO-01](../../sprints/2026-09-04-ONDA2-05-VIBRACAO-01-a-linha-de-estado-por-coluna-e-a-linha-de-mesa.md).

**Portões:** `TODOS VERDES — 41 portões` (`bash scripts/portoes.sh`, depois do
`git add -A`, com o cabeçalho conferido: `PYTHONPATH` nesta árvore).
**Bancada:** NÃO usada — nada nesta frente para o daemon, escreve no aparelho ou
chama `systemctl`. `scripts/bancada.sh` não precisou ser reservado.
**Tela dela:** nenhuma janela nasceu nela. Chrome headless (`interface/olhar.py`)
e `Gtk.OffscreenWindow` com a guarda `garantir_tela_de_mentira()`, que anunciou
`[tela] janela desviada para o Xvfb :80`.

---

## O que mudou

### 1. As duas barras de motor viraram AJUSTE — a metade que a ONDA1-D2 deixou

A decisão é dela, de 04/09, e veio **fora das três opções que eu ofereci** — eu
perguntei se a barra mandava o par `rumble.set` agora ou se virava leitura, e as
duas perguntas estavam erradas:

> *"os slcers do botão esquerdo e direito (forte e fraco) se multiplicam*  <!-- noqa-acento: citação literal dela -->
> *(interagem com os botões economia, moderado, máximo, se eu tiver 150% do*
> *perfil de vibração e as duas linhas estiverem 100 entao a vibração dos 2*
> *será 150%, mas se so a do motor fraco tiver 100 e a outrqa 50% então será*
> *150 em um e 75% no outro entende?"*

A ONDA1-D2 entregou o daemon, o esquema e a ponte; esta frente fiou a rota até a
tela. **`efetivo(motor) = degrau(coluna) x barra(motor)`, e a conta continua num
lugar só** (`gamepad._mults_por_motor`) — esta aba mostra os dois fatores lado a
lado e não refaz a multiplicação.

| peça | onde |
| --- | --- |
| o `<input type=range>` da linha de motor | `interface/aba05._barra_de_motor` (:1107), sobre o `_trilho` extraído (:986) |
| o gesto que grava | `interface/pacotes/a05_vibracao.motor` (:1416) |
| a leitura de volta | `a05_vibracao._barras_dos_motores` (:306), do `state_full.rumble_motores` |
| a travessia da ponte | `interface/pacotes/ponte.rumble_motores_set` (:84) |
| a tradução `lado → campo` | `app/telas/vibracao.MOTOR_PARA_BARRA` (:61), ao lado do `LADO_PARA_MOTOR` |

**UMA BARRA POR VEZ**, que é o contrato do método: campo omitido não mexe
naquela barra. É o caso dela por escrito — as duas são independentes —, e é o
que impede um arraste no punho esquerdo de reescrever o direito com o número que
a TELA mostrava, que pode estar um tique atrás.

**O `data-papel` VIVE NO `<input>`, nunca no `<div>` de fora** — a lição já paga
pela linha "Personalizado": o ouvinte manda `valor: alvo.value ?? ''`, e um
`<div>` não tem `value`. O `data-lado` viaja no MESMO elemento, porque é ele que
diz ao gesto qual das duas barras foi arrastada.

**O ENDEREÇO DE PINTURA É NOVO DE PROPÓSITO** (`barra-e`/`barra-d`), e o pacote
**continua emitindo os velhos** (`motor-e`, `motor-e-pct`). É a PONTE DE
PUBLICAÇÃO: a página que ela abre hoje ainda tem a linha como LEITURA, e reusar
o nome faria o produto escrever um multiplicador dentro de uma barra de 0 a 255.

**O QUE A LINHA DEIXOU DE MOSTRAR, e onde ele foi parar.** O par 0-255 que o
jogo pediu não cabe no mesmo pixel que o ajuste — duas escalas na mesma barra é
a contradição que esta aba mais persegue. Ele virou o `title` da linha, pintado
pelo alvo `atributo` (`motor-<lado>-pedido`), e quando não há o que dizer o
pintor **APAGA o atributo** em vez de escrever travessão.

### 2. A linha de estado POR COLUNA — D-14, os três estados que ela nomeou

`app/telas/vibracao.estado_da_trava` (:501) devolve `(tom, fato)` e
`html_da_trava` (:556) monta o HTML — **um emissor só para os dois lados**, como
o `html_do_estado` já era. O desenho usa a `monta.ressalva` da ONDA0-F (D-02), e
a linha é a oitava faixa da grade.

**O FATO É DO PRODUTO E A INSTRUÇÃO É DA TELA**, e a separação é o ponto: a
janela estável acaba a frase em *"clique 'Deixar o jogo controlar a vibração'"*,
um botão que a aba nova **não tem**. Quem manda clicar é quem sabe quais botões
desenhou (`SOLTAR_A_TRAVA`, :553) — é a decisão `07` [02] do PO no mesmo dia:
*a frase para de nomear lugar*.

**AS COLUNAS VIVAS DIZEM A MESMA COISA, e é honesto:** a trava é UMA para a mesa
(`SEM_FONTE["trava:por-controle"]`), e o `rumble_active_uniq` do daemon **não é
publicado** no `state_full` (relatado abaixo). Encolher a decisão dela para
economizar pixel não é escolha de quem executa.

### 3. A linha de MESA, e o "herdado" que ela torna legível — decisão [05]

`.vib-mesa`, fora da grade (`aba05.MIOLO`:1699), com os quatro degraus do ajuste
geral e o gesto `a05_vibracao.forca_da_mesa` (:1498), que vai pela porta GLOBAL
(`rumble_policy_set_checked`) **sem mirar antes** — `rumble.policy_set` não
aceita `uniq`, e uma mira ali seria a tela prometendo um endereço que o produto
não tem.

E a outra metade, que é a que faz a decisão valer: **a coluna sem ajuste próprio
deixou de acender degrau** (`a05_vibracao`:663, sobre `_forca_propria`:352). Até
hoje as duas coisas tinham a MESMA cara — um degrau que ela escolheu para aquele
controle e um degrau que o Hefesto está usando porque a mesa manda.

**E O `auto` MUDOU DE LUGAR NA CENA, por um fato do produto:** ele é o único
degrau que **não pode ser override de peça** (o esquema o recusa por unidade),
logo só existe na MESA. Até 04/09 uma coluna do mockup o desenhava como escolha
dela naquele controle — um estado que o produto não sabe guardar.

### 4. A nota do Testar subiu para a tela — decisão [02]

`.vib-nota` (:1718), com a frase LIDA do `gui/main.glade`
(`DICA_DOS_VALORES_QUE_PASSAM`), nunca redigitada. Ela **saiu do `?`** no mesmo
ato: a mesma frase duas vezes na mesma tela é a forma mais barata de as duas
divergirem. A dos 5 s do Auto fica no `?`, como ela decidiu.

### 5. O recado do clique virou SUCESSO, e não recusa — decisão [04] / D-01

`_aplicar_a_forca` devolve `{"recado": …}` nos três desfechos em que a gravação
ACONTECEU e a tela vai parecer dizer outra coisa. Até esta manhã eles subiam
como `RuntimeError`, com a nota escrita no próprio código de que *"o
`RuntimeError` não quer dizer 'recusei' — é o único canal que chega ao cartão
dela hoje"*. **A frase estava certa e caducou no mesmo dia:** a ONDA0-P
construiu o canal de sucesso, e agora a tarja nasce **verde e vive 6 s** em vez
de laranja por 30 — uma tarja de recusa sobre um clique que deu certo ensina que
o botão falha.

### 6. As duas dívidas declaradas da vibração MORRERAM

`SEM_DONO` desta aba tinha três e passou a ter **uma**:

* **`barra:motor`** esperava *a palavra dela* sobre o par `weak`/`strong`. Ela
  veio e desfez a premissa: a barra não manda o par;
* **`forca:auto-da-mesa`** dizia que o caminho para pôr a mesa em `Auto` sumira
  e que o desenho era decisão dela. Ela escolheu a linha de mesa.

Sobra `lado:ligado`, que continua sem UMA linha de fonte no produto inteiro.

**E as DUAS LÁPIDES que a ONDA1-D2 deixou nos portões saíram no mesmo dia em que
nasceram** — `test_ipc_bridge._SEM_TRAVESSIA_DECLARADA` e
`portao_a_casa_sabe_e_o_produto_nao_faz._SEM_CAMINHO_HOJE`. As duas diziam, com
o endereço exato, *"FECHA quando aquele gesto nascer e chamar
`p.rumble_motores_set(...)`"*. É o desenho funcionando: **uma dívida que se
anuncia com endereço é uma dívida que alguém paga.**

---

## Qual mordida prova

**Sete curas arrancadas, sete réguas vermelhas, e as saídas estão coladas.**

### As três do gesto do motor

```
=== MORDIDA 1: o lado do motor vira literal ===
E  AssertionError: o lado 'd' gravou {'forte_pct': 50, 'uniq': 'aa:bb:cc:00:00:01'},
   e ele é o campo 'fraco_pct'
1 failed, 21 passed

=== MORDIDA 2: o zero engolido (`if not pontos`) ===
E  RuntimeError: a barra não mandou número nenhum. Arraste o cursor dela em vez
   de clicar no rótulo ao lado.
1 failed, 21 passed

=== MORDIDA 3: a recusa do daemon ignorada ===
E  Failed: DID NOT RAISE RuntimeError
1 failed, 21 passed
```

A primeira é a mais importante das três: **`weak` é o motor da DIREITA**, e um
literal no lugar do `MOTOR_PARA_BARRA` faz o arraste do punho direito gravar a
barra do esquerdo — em silêncio, com a tela mostrando o número certo no lugar
errado.

### As duas do gerador, que PARAM a geração antes do teste

```
=== MORDIDA 4: as barras de motor voltam a ser LEITURA ===
ERRO em 05-vibracao — decisão dela desfeita:
  - as barras de motor arrastáveis não são 4 (achei 0) — cada coluna viva tem UMA
    por punho, e é o que fecha a `SEM_DONO['barra:motor']`
  - a barra do motor 'e' não tem `data-lado` em cada coluna viva — sem ele o gesto
    não sabe qual das duas foi arrastada
  - a barra do motor 'd' não tem `data-lado` em cada coluna viva — …

=== MORDIDA 7: a nota do Testar volta ao `?` ===
ERRO em 05-vibracao — decisão dela desfeita:
  - a dica perdeu a frase da janela estável: os valores que passam pela intensidade
  - a nota do Testar não é linha de tela — a decisão [02] dela é `só a nota do Testar sobe`
  - a nota do Testar aparece mais de uma vez na mesma tela
```

### A do "herdado" e a do par invertido

```
=== MORDIDA 5: a coluna volta a acender o degrau herdado ===
E  AssertionError: a coluna acendeu 'balanceado' sem ter ajuste próprio
E  assert 'balanceado' == ''

=== MORDIDA 6: o par fraca/forte invertido em `estado_da_trava` ===
E  AssertionError: a frase saiu 'travada em fraca=220, forte=160'
E  - travada em fraca=160, forte=220
E  + travada em fraca=220, forte=160
```

### Com as sete curas de volta

```
22 passed in 0.58s        (tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py)
```

E os vizinhos, que é onde uma mudança de endereço quebra sem avisar
(`test_a05_a_vibracao_aplica_e_fala`, `test_a_forca_da_vibracao_e_por_controle`,
`test_a_vibracao_diz_qual_degrau_esta_aceso`, `test_a_05_vibracao_sai_do_desenho`,
`test_a_vibracao_nao_escreve_no_botao`,
`test_a_vibracao_nao_tem_clique_que_nao_responde`, `test_os_botoes_tem_dono`,
`test_ipc_bridge`, `portao_a_casa_sabe_e_o_produto_nao_faz`):

```
1001 passed, 1 skipped (-k "vibra or a05 or aba05 or motor or rumble or …")
```

---

## A PROVA DE TELA

### A foto, antes e depois

| foto | o que ela mostra |
| --- | --- |
| `ONDA2-05-antes.png` | a aba PUBLICADA de hoje — as duas linhas de motor como leitura, sem estado, sem linha de mesa |
| `ONDA2-05-depois.png` | a BANCADA — as duas barras que arrastam, a faixa de estado, a linha de mesa e a nota |

`interface/olhar.py`, Chrome headless, 1920×1080. `janela 1180×777 ·
passa_da_dobra 0 · rolagem_lateral false` nas duas.

### O CLIQUE — no WebKit, e o daemon NÃO foi tocado

A barra foi **arrastada de verdade** (`barra.value='25'` + um `change` que
BORBULHA, nunca coordenada) num `WebKit2.WebView` offscreen com o BOOTSTRAP do
piloto injetado e o `window.webkit.messageHandlers` DUBLADO — o clique não sai
do navegador, então o perfil dela não foi tocado. A carga pintada é a que o
`a05_vibracao.pacote()` devolve para um estado com a vibração TRAVADA:

```
valores pintados neste tique: 16

=== O QUE A TELA MOSTRA DEPOIS DA PINTURA ===
  barra_e            '40'          <- do `state_full.rumble_motores`, não do mockup
  barra_e_max        '100'         <- o `MOTOR_PCT_MAX` do esquema
  barra_e_step       '1'
  num_e              '40'          <- o número e o cursor dizem a MESMA coisa
  trava              '▲travada em fraca=160, forte=220 — clique Parar nesta
                      coluna para devolver ao jogo.'
  trava_cor          'rgb(255, 184, 108)'   <- o `--orange`, o tom ALERTA da casa
  mesa_acesa         ['economia']  <- o degrau que o daemon está usando
  coluna_acesa       []            <- HERDADO: a coluna não acende nenhum
  nota               'Os valores acima ainda passam pela intensidade escolhida…'

=== O QUE O ARRASTE MANDOU AO PYTHON ===
  gesto  'motor'   lado  'e'   valor  '25'   controle  'p1'
  campo  'barra-e' tipo  'input' evento 'change'
```

**A MORDIDA DE TELA**, e ela é a que prova que o endereço faz alguma coisa:
arrancado o `data-hef-alvo="valor"` do trilho, a barra **fica onde o mockup a
cravou** enquanto o número ao lado obedece ao daemon —

```
sem a cura:   barra_e '50'   num_e '40'    <- a mesma linha dizendo duas coisas
com a cura:   barra_e '40'   num_e '40'
```

### O CUSTO EM PIXEL, medido — e é o que ela precisa ver antes de publicar

```
PUBLICADO (a que ela abre hoje)  miolo 564 visíveis · 564 de conteúdo · rola 0
BANCADA   (o desenho de hoje)    miolo 564 visíveis · 667 de conteúdo · rola 103
```

Peça por peça: **linha de mesa 53 px · faixa de estado 31 px · nota do Testar
21 px**. Na foto, o que fica abaixo da dobra é a linha de mesa.

**NÃO HÁ PIXEL A DEVOLVER DENTRO DO QUADRO**, e isso também foi medido: a única
faixa elástica é o desenho do controle (`--r-des`, 124 px), e pagar 103 ali o
deixaria com 21. O piso da faixa de estado já foi apertado ao mínimo de uma
sublinha (20 px) e as margens da mesa e da nota também — os 118 px da primeira
medição viraram 103. Está declarado em `mockup/DIVERGENCIAS.md`, com o
enunciado do que sobra para ela decidir.

---

## O que medi e derrubou uma suposição

**1. A régua de clique desta casa NÃO alcança o gesto novo, e o dublê dela é o
motivo.** Eu ia declarar o `motor` no `PROVAS` do pacote, como todo gesto novo
faz. Rodei, e a `PonteDeMentira` da régua geral estourou: ela responde `True` a
qualquer nome, e `rumble_motores_set` devolve `(ok, corpo)` — o gesto morre num
`TypeError: cannot unpack`. **A saída fácil seria afrouxar o gesto** (ler só o
`ok`, ignorar o corpo) para caber no dublê. É **exatamente** o defeito que esta
casa mediu duas vezes em 04/09: *"nos dois casos o dublê do teste era mais
frouxo que a ponte real"*, e nas duas o gesto passou verde sem gravar um byte.
Por isso o `motor` ficou FORA do `PROVAS`, com a razão escrita, e ganhou um
dublê fiel no teste desta frente.

**2. A minha própria régua acusou o inocente na primeira execução.** A régua 3
do `aba05._conferir` fatiava o corpo por `class="ctrl vazia"` e ia até a próxima
coluna; com a linha de mesa nascendo DEPOIS da grade, o pedaço da última coluna
vazia varria o resto do documento e engolia a linha nova. A saída foi
`um lugar vazio tem ajuste vivo: 'data-papel="forca-mesa"'` — sobre um ajuste
que está fora de coluna nenhuma. **Régua que lê o pedaço errado acusa o
inocente**, e a cura foi o segundo corte, não a exceção.

**3. Uma afirmação minha sobre a cena do mockup caiu no meio do trabalho.** Eu
escolhi o P3 para ser a coluna que HERDA a força da mesa — e o P3 é um dos dois
LUGARES VAZIOS desde 31/08, por ordem dela. A régua nova (*"nenhuma coluna viva
da cena HERDA a força da mesa"*) pegou; sem ela o desenho ensinaria a decisão
[05] numa coluna que não se desenha. **A cena que ensina tem de ensinar no que
está à vista.**

**4. E um fato do produto reorganizou a cena inteira: `auto` não pode ser
override de peça.** O esquema o recusa por unidade, com validador próprio. A
cena tinha uma coluna desenhando `auto` como escolha dela naquele controle —
um estado que o produto não sabe guardar. Ele mudou para a linha de mesa, que é
o único lugar onde cabe, e a cena ficou mais honesta do que era antes de eu
mexer nela.

---

## O que NÃO verifiquei

* **O APARELHO.** Nada desta frente tocou o daemon, o `hidraw` ou o controle. A
  conta `degrau x barra` chegando ao motor foi medida pela ONDA1-D2, na bancada,
  e o laudo está no relatório dela. **Esta frente prova que a barra da TELA
  chega ao método certo com o número certo — não que o plástico treme.**
* **O `rumble.motores.set` contra um daemon VIVO que o conheça.** O daemon
  instalado é o da árvore DELA e não tem o método (a D2 mediu isso: devolve
  `(False, None)`). O gesto foi provado com um dublê FIEL — que devolve
  `(ok, corpo)` com `status` —, e não com o daemon.
* **A LINHA DE MESA CLICADA AO VIVO.** `rumble.policy_set` muda o degrau de
  vibração de TODOS os controles dela, e o gesto **não está** em
  `hefesto_vivo.PERIGOSOS` (relatado abaixo). Não o cliquei contra o daemon
  dela; a prova é o dublê e a `PROVAS` do pacote.
* **A MESA CHEIA.** A cena tem dois controles e dois lugares vazios, como ela
  ordenou em 31/08. Quatro controles vivos ao mesmo tempo não foram medidos.
* **O `title` PINTADO COM VALOR.** O caminho foi exercido e o pintor APAGOU o
  atributo, que é o desfecho certo quando o jogo não pediu nada — mas eu não vi
  a frase *"O jogo pediu 160 de 255…"* na tela, porque isso exige um vpad com
  FF fresco.
* **A SUÍTE INTEIRA.** Rodei o meu escopo (1.001 casos). A suíte em oito lotes é
  de quem coordena.
* **O `:has()` no WebKitGTK dela.** As regras que eu escrevi usam só seletor de
  classe e descendência; o `:has()` está na FOLHA da ONDA0-F, que já declarou
  não tê-lo medido naquele motor. **Isso importa aqui**: é o
  `.ressalva:has(.nada){display:none}` que faz a faixa de estado SUMIR quando
  não há o que dizer. Se ele não valer no WebKit dela, a faixa fica ocupando
  20 px com um marcador invisível dentro.

---

## O que sobrou para o próximo

### 1. `hefesto_vivo.PERIGOSOS` precisa de DUAS linhas — e o arquivo é `nao_toca`

Os dois gestos novos escrevem, e a régua de clique roda com o daemon vivo:

```python
    # ONDA2-05 (04/09/2026) — OS DOIS GESTOS NOVOS DA VIBRAÇÃO ESCREVEM:
    #   05-vibracao·motor       `rumble.motores.set` grava a barra daquele motor
    #                           no PERFIL dela, e o handler reaplica na hora
    #   05-vibracao·forca-mesa  `rumble.policy_set` muda o degrau de vibração de
    #                           TODOS os controles dela, ao vivo
    ("05-vibracao.html", "motor"),
    ("05-vibracao.html", "forca-mesa"),
```

**E a lista da régua que os acusaria também está incompleta**, pela mesma forma
de defeito que o `autoswitch_lock_set` teve em 04/09: `tests/unit/
test_todo_gesto_que_grava_esta_protegido.py::ESCREVEM` não conhece
`rumble_motores_set` nem `rumble_policy_set_checked`, então ela **não acusa** os
dois — dei verde sem ela ter medido. As duas portas precisam entrar ali **no
mesmo commit** em que as duas linhas acima entrarem; acrescentá-las antes
deixaria o portão vermelho de propósito.

### 2. As linhas do CSV que fecharam — para a ONDA1-X lançar

**Não toquei `docs/data/paridade-gtk-html.csv`.** As linhas abaixo são as que o
meu trabalho fecha ou move, com o endereço NOVO lido no código de agora:

| # | feature | vira | endereço novo |
| ---: | --- | --- | --- |
| 170 | A linha 'Estado da vibração' (os três estados) | FALTA_NO_HTML → IGUAL | `app/telas/vibracao.py:501` (`estado_da_trava`) · `:556` (`html_da_trava`) · `interface/aba05.py:1584` · `interface/pacotes/a05_vibracao.py:720` |
| 171 | As duas barras de motor como AJUSTE | DIFERENTE → **muda de assunto** | `interface/aba05.py:1107` · `interface/pacotes/a05_vibracao.py:1416` · `:306` · `interface/pacotes/ponte.py:84`. **A célula `porque` precisa ser reescrita, não só o veredito**: ela diz *"na GTK são ENTRADA (ela escolhe a força do teste); no HTML são SAÍDA"*, e agora as duas são ENTRADA de coisas DIFERENTES — a GTK escolhe o par 0-255 do teste, o HTML escolhe a POLÍTICA por motor (0-100) que multiplica o degrau. É decisão dela de 04/09, não dívida |
| 179 | O endereço do gesto — quem treme quando ela clica | DIFERENTE → **a metade que faltava fechou** | o `porque` diz *"o que NÃO mudou é a força — clicar 'Economia' na coluna do P2 muda os quatro"*. Isso caiu em 03/09 (a força é por controle) e o resto caiu hoje: `interface/pacotes/a05_vibracao.py:1498` (`forca_da_mesa`) dá à MESA um endereço próprio |
| 181 | O ajuste por PEÇA e o aviso quando ele é apagado | DIFERENTE → IGUAL | a oração RUM-3 chega ao cartão pelo canal de SUCESSO: `a05_vibracao._aplicar_a_forca` devolve `{"recado": …}` com o `TEXTO_A_PECA_VOLTOU_AO_AJUSTE_GERAL` |
| 183 | Avisar que o perfil não tem opinião sobre a política | FALTA_NO_HTML → IGUAL | `interface/aba05.py:1699` (a linha de mesa) mais `a05_vibracao.py:663` — a coluna que herda não acende degrau, e o aceso é o da mesa |
| 184 | Recado de SUCESSO depois de cada gesto | FALTA_NO_HTML → IGUAL | a peça é da ONDA0-P (`hefesto_vivo._deu_certo_dizendo`); esta aba passou a usá-la em `a05_vibracao._aplicar_a_forca` |
| 186 | A nota 'os valores acima ainda passam pela intensidade' | DIFERENTE → IGUAL | `interface/aba05.py:1718` — ela virou rótulo permanente, como na GTK |
| 165 | A explicação do modo Auto (os 5 s) | continua DIFERENTE, **e agora por decisão** | a decisão [02] dela é *"a do Auto fica no `?`"*. A célula deve dizer isso em vez de "a forma continua diferente" |
| 161 | QUAL degrau está aceso | continua IGUAL, **mas o `porque` caducou** | ele diz *"a coluna do controle acende `balanceado`"*; hoje a coluna só acende o que é DELA, e o herdado acende na linha de mesa |

### 3. As linhas de MOTOR que NÃO couberam, com a razão

| linha | por que não fechou |
| --- | --- |
| **Aplicar (fixar a vibração) e "Deixar o jogo controlar" (176 e 177)** | A própria lista de decisões desta aba os DESCARTOU como pergunta: *"não há desenho a decidir enquanto não existirem os botões que produzem o estado… trazer o par de botões é motor, e muda o contrato desta aba"*. Trazê-los por conta própria seria decidir por ela o que ela mandou não decidir. **O único resto que os alcançava era o AVISO de que alguém travou por fora — e esse fechou** (a linha de estado, item 2 acima) |
| **Zerar weak/strong e o passthrough no rascunho (182)** | **Esta interface NÃO TEM RASCUNHO** — decisão dela de 01/09 (*"clicar na cor já deveria aplicar"*), medida também pela ONDA2-02. O caminho que o CSV nomeia é `interface/pacotes/rodape.py:45`, o "Salvar" do rodapé, que **não é desta posse**. O sintoma é real: um perfil com `rumble.weak/strong` não-zero faz o "Aplicar" do rodapé re-travar o que o "Parar" da coluna soltou. É frente própria, no `rodape.py` |
| **Mostrar o que CHEGOU aos motores (188)** | Continua sendo mostrado, e mudou de lugar: era o número da linha, virou o `title` pintado (`motor-<lado>-pedido`) mais o punho que acende no desenho. Quem quiser trazê-lo de volta para um pixel visível precisa de espaço, e o quadro já rola 103 px |

### 4. Arquivo alheio — EDITADO, e digo exatamente o quê

Nenhum deles está no `nao_toca:` da minha sprint, e nenhum está no `posse:` de
outra frente desta leva (conferido nos frontmatters).

| arquivo | o quê | por quê |
| --- | --- | --- |
| `app/telas/vibracao.py` | +3 peças: `MOTOR_PARA_BARRA`, `estado_da_trava`+`html_da_trava`+`SOLTAR_A_TRAVA` | é **a camada de produto DESTA aba** e de mais nenhuma — só `aba05.py` e `a05_vibracao.py` a importam (medido). Escrever a frase da trava do lado da interface seria a segunda cópia de um texto de tela, e o `SEM_FONTE["estado:da-vibracao"]` de lá já apontava este endereço |
| `interface/pacotes/ponte.py` | **uma linha** — `rumble_motores_set = _b.rumble_motores_set` | é a travessia que a ONDA1-D2 declarou nos dois portões com o meu endereço |
| `tests/unit/test_ipc_bridge.py` · `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | as duas lápides de `rumble_motores_set`, apagadas | as duas diziam *"QUANDO A ABA 05 FECHAR, ESTA LINHA SAI"* |
| `tests/unit/test_a05_a_vibracao_aplica_e_fala.py` · `test_a_forca_da_vibracao_e_por_controle.py` · `test_a_vibracao_diz_qual_degrau_esta_aceso.py` · `test_a_05_vibracao_sai_do_desenho.py` · `test_a_vibracao_nao_escreve_no_botao.py` · `test_a_vibracao_nao_tem_clique_que_nao_responde.py` | fatos que MUDARAM com as decisões dela | cada mudança leva a razão datada no próprio teste. Nenhuma régua foi afrouxada: a de `test_a_forca_da_vibracao...` passou a filtrar as barras por `data-papel`, porque o teto da barra de motor é 100 e o da Personalizado é 200 **de propósito** |
| `mockup/DIVERGENCIAS.md` | a seção da `05` | é o mecanismo declarado da sprint para desenho novo |

### 5. Três achados de outra posse, relatados e não consertados

1. **`rumble_active_uniq` não é publicado no `state_full`.** O daemon o guarda
   (`ipc_handlers.py:4762`), e sem ele a linha de estado por coluna não consegue
   dizer **de quem** é a trava — as colunas repetem o mesmo fato. Uma linha no
   `_state_full` e a aba 05 passa a nomear a coluna dona.
2. **A linha de estado da janela GTK continua com a sua própria cópia.**
   `rumble_actions._pintar_a_linha_do_teto` monta as três frases dentro de
   f-strings com markup Pango. Elas agora existem com dono em
   `app/telas/vibracao.estado_da_trava`, e fazer a GTK lê-las de lá é o que
   evita a divergência na primeira edição. Não editei: `rumble_actions.py` é um
   mixin GTK de outra camada.
3. **`app/ipc_bridge.rumble_stop()` não devolve o passthrough** — achado da
   ONDA1-D2, que continua aberto e que esta aba contorna chamando os dois passos
   no gesto `parar`. Repito aqui porque a assimetria é do produto.

### 6. O que sobra sem dono nesta aba

`SEM_DONO["lado:ligado"]` — os oito interruptores de punho continuam sendo
DESENHO. **E a decisão dela de hoje os aproximou de um dono**: com a barra do
motor em 0 aquele motor não treme naquele perfil, que é exatamente o que o
interruptor finge fazer. Fundir os dois (o interruptor virar o atalho para
`0`/`100` da barra) é desenho, e é dela.
