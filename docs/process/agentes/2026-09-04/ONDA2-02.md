# ONDA2-02 · A ABA CONTROLES — as dez decisões dela, e o microfone que virou um ato

**Sprint:** `docs/process/sprints/2026-09-04-ONDA2-02-CONTROLES-01-a-maior-de-desenho-e-o-microfone-que-ja-tem-motor.md`
**Árvore:** `hefesto-voo/ONDA2-02-CONTROLES-A2` · branch `voo/ONDA2-02-CONTROLES-A2`
**Bancada:** reservada e liberada uma vez, para o clique de verdade no 🎙 com o
DualSense dela no cabo. Nenhuma escrita ficou de pé: o `mic_mudo` do aparelho e
a fonte de captura padrão do sistema foram lidos antes e depois, e voltaram
IDÊNTICOS.
**Portões:** `TODOS VERDES — 40 portões`, com o cabeçalho conferido.
**Testes do escopo:** 416 + 12 + 14 + 254 = **696 verdes**, em quatro lotes.

---

## O que mudou

**As DEZ decisões da aba estão fechadas. Nove delas viraram código; a [01]
morreu por decisão (conflito C-1), e a [05] e a [10] já estavam feitas.**

### As que mexem no PRODUTO — valem sem publicar nada

| # | decisão | o que passou a acontecer |
| --- | --- | --- |
| **[03]** | o selo diz o estado COMPOSTO (C-2, pela D-12) | `selo_composto` lê as QUATRO faces. ATIVO só quando elas concordam |
| **[09]** | a rota lê as DUAS camadas | `aceso_da_rota` monta o `RotaDasDuasCamadas` da ONDA1-D1. O byte 3 sozinho **não acende mais** "Todo o som do PC" |
| **[08]** | o mudo que caiu no controle errado | o gesto `volume` lê o TERCEIRO estado (`por_uniq`) e confessa no cartão, com a frase do produto |
| **S-05** | o microfone é UM ATO | o 🎙 chama `mic.canal.set`, e a recusa diz **qual metade** faltou |
| **[07]** | a degradação do vpad | `pacotes.degradacao_de` ganhou o primeiro chamador em dez pacotes |

### As que são DESENHO — na bancada, e declaradas em `mockup/DIVERGENCIAS.md`

| # | decisão | o que a bancada passou a ter |
| --- | --- | --- |
| **D-06 / S-11** | *"casco borda externa lightbar borda interna"* | um anel de 1px dentro dos 2px do casco, com o MESMO `data-campo` do retângulo da Barra de luz |
| **[02]** | palavra curta no lugar do travessão | `Jogo` · `Steam` · `Não sei` · `Apagada`, e a frase inteira no `title` da linha |
| **[04]** | o botão avisa antes do clique (D-03) | o 🎙 e o [nota] apagam com a razão no `?`. **O `disabled` do [nota] saiu** |
| **[06]** | o "Devolver" do alto-falante | fica FORA, e o `title` do [nota] passou a dizer o preço |
| **T-07** | o décimo alvo | `data-hef-alvo="marcado"` no rádio do acordeão |

**Nada foi publicado.** A publicação é uma leva só, para o olho dela
(`PROVA-DE-TELA-01`), e o pacote pergunta à página PUBLICADA antes de emitir —
os endereços novos não viram órfãos no `casamento.medir(...)`.

### Os arquivos, e o que cada um ganhou

| arquivo | o quê |
| --- | --- |
| `interface/pacotes/a02_controles.py` | `selo_composto` + `_faces_do_microfone`; `luz_palavra`/`luz_porque` + a tabela das quatro palavras; `porques_do_som`; `aceso_da_rota`/`recado_da_rota` + o cache da camada 1 em thread; `_corpo`; os dois gestos |
| `interface/aba02.py` | o anel interno; o `title` pintado da Barra de luz; o `<sup class="degradou">`; `linha_de_volume` + `ponto_de_interrogacao`; o `marcado` no rádio; quatro regras de CSS |
| `mockup/02-controles.html` | regerada |
| `interface/paginas/02-controles.html` | **byte a byte igual ao HEAD** (conferido com `diff`) |

---

## Qual mordida prova

**Doze mordidas, e as doze reprovam nomeando o defeito.** A saída inteira está
em `mordidas-saida.txt` no rascunho desta sessão; abaixo, o que cada uma disse.

| # | o que arranquei | quem reprovou |
| --- | --- | --- |
| 1 | o selo volta a ler só o bit do firmware | `test_o_selo_le_as_quatro_faces[canal_ativo=False]` |
| 2 | a palavra volta ao travessão | `test_a_palavra_curta_substitui_o_travessao` (os quatro) |
| 3 | a frase some do hover | `test_a_frase_inteira_vai_para_o_hover` |
| 4 | os dois botões param de avisar | `test_as_duas_razoes_chegam_ao_card` |
| 5 | a rota volta a acender pelo byte | `test_o_byte_do_pc_com_a_saida_em_outro_lugar_nao_acende_nada` |
| 6 | o 🎙 volta a `mic_set` | `test_o_gesto_chama_o_ato_e_nao_a_metade_do_firmware` |
| 7 | o volume volta ao `bool` | `test_o_volume_do_microfone_confessa_quando_cai_na_rota_global` |
| 8 | a degradação some do card | `test_o_motivo_da_degradacao_chega_ao_card` |
| 9 | o cinza sai da folha | `test_o_botao_de_som_apaga_e_ainda_assim_responde` |
| 10 | a marca passa a aparecer sempre | `test_a_marca_da_degradacao_so_aparece_com_motivo` |
| 11 | o anel interno sai do card | `test_o_casco_fica_fora_e_a_luz_viva_dentro` |
| 12 | o acordeão perde o décimo alvo | `test_o_acordeao_publica_o_decimo_alvo` |

```
##### MORDIDA 1 #####
E  AssertionError: o canal deste controle não é a fonte ativa — o som não
   chega ao PC
E  assert 'ATIVO' == 'MUDO'

##### MORDIDA 2 #####
E  AssertionError: assert '—' == 'Não sei'

##### MORDIDA 5 #####
E  assert 'pc' == ''
   (o byte 3 com a saída padrão na TV voltou a acender "Todo o som do PC")

##### MORDIDA 6 #####
E  At index 0 diff: ('mic_set', (False,), {…}) != ('mic_canal_set_detalhado',
   (True,), {…})

##### MORDIDA 7 #####
E  Failed: DID NOT RAISE RuntimeError

##### MORDIDA 9 #####
E  AssertionError: o botão com razão tem a MESMA borda do clicável
   (rgb(68, 71, 90)) — a tela em repouso não distingue os dois

##### MORDIDA 10 #####
E  AssertionError: assert 'inline' == 'none'

##### MORDIDA 11 #####
E  AssertionError: o anel interno não seguiu a cor de linha — ele deixou de ser
   a luz viva e virou desenho

##### MORDIDA 12 #####
E  AssertionError: assert None == 'marcado'

##### CURA DEVOLVIDA #####
50 passed in 1.64s
```

**A régua LÊ, não digita.** Nenhuma cor está escrita no arquivo de teste: ela
abre a página da BANCADA no Chrome do sistema (headless) e pergunta ao motor o
que ele DESENHA, comparando elementos da MESMA página. As quatro palavras da
Barra de luz saem de uma tabela cujas CHAVES são perguntadas a
`rotulo_lightbar` — `test_os_quatro_rotulos_sao_perguntados_ao_motor_e_diferentes`
reprova no dia em que o motor trocar uma frase.

### E o dublê daqui é ESTRITO — a cicatriz de 04/09, em forma de caso

`PonteEstrita` levanta `AttributeError` para todo nome que a ponte real não
expõe, e devolve `dict | None` onde a ponte devolve `dict | None`. Duas vezes
num dia um gesto passou verde sem gravar um byte porque o dublê era mais frouxo
que a ponte; `test_o_duble_estrito_recusa_um_nome_que_a_ponte_nao_tem` é o que
impede a terceira.

---

## A prova de tela

**Nenhuma janela nasceu na tela dela.** Tudo `--oculta`
(`Gtk.OffscreenWindow`) e o Chrome headless.

| foto | o que ela mostra |
| --- | --- |
| `01-antes.png` | a aba publicada de hoje — o 🎙 e o [nota] com um `?` que não existia |
| `02-depois.png` | a bancada publicada em cima, e **um defeito que só a foto pegou** (abaixo) |
| `03-depois-curado.png` | os dois `?` invisíveis, como têm de ser com os botões clicáveis |
| `04-vivo-antes-do-clique.png` | o card em repouso, com os dois anéis |
| `05-vivo-depois-do-clique.png` | **a recusa do ato no cartão**, em laranja |

### O CLIQUE, e ele foi no aparelho de verdade

`clique_vivo.py` abre a aba no `WebKit2.WebView` com o daemon vivo, clica
`b.click()` no `[data-mudo="microfone"]` do card — **nunca por coordenada**,
que é a armadilha que esta casa já pagou duas vezes —, lê o DOM, fotografa,
clica de novo para devolver, e confere o aparelho e o PipeWire nas duas pontas:

```
=== ANTES ===
  fonte padrão do sistema: alsa_input.usb-046d_HD_Pro_Webcam_C920-02.analog-stereo
  aparelho: {'mic_mudo': False, 'mic_mudo_desejado': None,
             'canal_ativo': None, 'canal_mudo': None}

[gesto falhou] 02-controles.html · mudo: o daemon não confirmou o mudo do
microfone — ou o Hefesto está parado, ou este controle saiu da mesa

  o que a TELA mostrou depois do clique:
    selo_do_mic     : "—"          (as chaves de canal não vieram)
    palavra_da_luz  : "#0000FF"    (cor conhecida → o código, como antes)
    hover_da_luz    : a frase de quem escolhe a cor, PINTADA
    anel_cor        : rgb(0, 0, 255)      ← a luz viva
    casco_cor       : rgb(68, 71, 90)     ← o casco, e são diferentes
    ressalva_da_rota: <i class="nada"></i>
    radio_alvo      : "marcado"
    recado no cartão: a recusa, em laranja

fonte padrão do sistema: INTACTA
aparelho no fim   : {'mic_mudo': False, …}
aparelho no começo: {'mic_mudo': False, …}
```

---

## O que medi e derrubou uma suposição

### 1. O DAEMON INSTALADO NÃO CONHECE `mic.canal.set` — e a frase de recusa não continha o caso que acontece

**É o achado do dia, e quem o revelou foi o clique, não a régua.** O 🎙 foi
clicado na tela viva e o ato foi RECUSADO — não porque o gesto esteja errado,
mas porque **o daemon que roda na máquina dela é o INSTALADO**, mais velho que
esta janela: `mic.canal.set` nasceu na ONDA1-D1 e o `install.sh` não rodou
desde então. A prova está no mesmo `state_full`: `canal_ativo` e `canal_mudo`
chegam **ausentes**, e são as chaves que aquela frente acrescentou.

**A frase que ela leu no cartão listava DUAS causas — e nenhuma era a
verdadeira** (*"ou o Hefesto está parado, ou este controle saiu da mesa"*).
Uma frase de recusa que não contém o caso que acontece manda a pessoa procurar
o defeito no lugar errado. A terceira causa entrou na frase, e ela é medida:
*"ou o Hefesto instalado é mais velho que esta janela e ainda não sabe ligar o
microfone e o canal dele num ato só"*.

**É a armadilha 2 do `CLAUDE.md` desta pasta, com outra cara:** *"o daemon vivo
é da árvore DELA — e o sintoma é a AUSÊNCIA de dado"*. Aqui não foi silêncio: o
canal da D-01 fez o produto DIZER, e é por isso que o defeito apareceu em vez
de virar uma tela que não muda.

### 2. O `?` APARECEU NA TELA COM UM `—` DENTRO — e só a FOTO pegou

A folha das dez esconde o `?` de três jeitos, e **nenhum alcançava o botão de
ícone**: o primeiro prende a `.btn`, e os outros dois olham o CONTEÚDO da dica
(`:has(.dica:empty)` e `:has(.nada)`).

O campo desta aba alimenta DUAS coisas — a dica e o atributo que apaga o botão
—, e as duas querem valores OPOSTOS para "não há o que dizer": o atributo quer
VAZIO (o piloto o remove) e a dica queria o marcador. Com o vazio,
`escrever()` troca vazio por travessão **para todos os alvos, o `html`
incluído** (`hefesto_vivo.py:245`), a dica deixa de ser `:empty`, e o `?`
nasceu ao lado dos DOIS botões que estavam clicáveis.

Nenhuma régua tinha como acusar isso: as duas do produto passavam. Quem viu foi
o olho na foto — a mesma família do `?` solto que a ONDA0-F achou em 04/09. A
cura é uma linha (`.vol:not([data-porque]) .ajuda.porque{display:none}`), e ela
faz o `?` seguir o MESMO atributo do cinza: **um campo, um atributo, e não há
caminho em que o `?` apareça sem o botão estar apagado**.

### 3. A PRIMEIRA REDAÇÃO DA CAMADA 1 CHAMAVA `pactl` DENTRO DO TIQUE

`ler_as_duas_camadas` roda dois subprocessos por controle, e o pintor roda no
laço principal da GTK a 10 Hz — com quatro controles na mesa seriam **80
`pactl` por segundo** na máquina dela, e a janela travaria em cada leitura. A
ONDA1-D1 já tinha escrito que aquela função *"é bloqueante: quem chama é
`run_in_thread`"*, e eu a chamei síncrona mesmo assim na primeira leitura,
com o argumento de que "os primeiros tiques ficariam sem resposta".

O argumento estava errado nos dois lados: a resposta dos primeiros tiques é o
BYTE (que `aceso_da_rota` já devolve quando o cache está vazio), e uma leitura
síncrona faria toda régua que chama `pacote()` conversar com o PipeWire da
máquina dela. Há caso para isso —
`test_o_pintor_nao_conversa_com_o_pipewire_no_tique`.

### 4. O `luz_palavra` DECIDIA PELO `#`, E ISSO DEIXAVA A "APAGADA" SEM PALAVRA

A primeira redação perguntava *"o `luz_hex` devolveu um código de cor?"* e só
traduzia quando não. Mas a **apagada** é o único dos quatro estados em que o
`luz_hex` devolve um CÓDIGO (`#000000`, o preto que uma barra sem corrente
emite) — e ela é uma das quatro palavras que o PO nomeou. A ordem inverteu: a
tabela vem antes. O preto continua indo para o RETÂNGULO, que é onde ele quer
dizer alguma coisa.

### 5. O PORTÃO `casa-sabe` COBROU QUATRO LÁPIDES DE VOLTA AO PÓ — e é o desenho funcionando

`ler_as_duas_camadas`, `frase_do_ato_do_microfone`, `mic_canal_set` e
`degradacao_de` estavam declarados em `_SEM_CAMINHO_HOJE`, **cada um com o
endereço exato de onde o caminho se fecharia** — e o endereço era esta aba. As
quatro entradas foram apagadas, com a nota do porquê no lugar. Uma dívida que
se anuncia com endereço é uma dívida que alguém paga.

### 6. TRÊS RÉGUAS VIZINHAS PASSAVAM VERDES PELO CAMINHO ERRADO

`test_a_recusa_chega_ao_cartao` e `test_o_recado_de_sucesso_pousa_no_cartao`
(as duas da ONDA0-P) trocam `ponte.mic_set` por um dublê. Com o gesto chamando
o ato, o nome velho deixou de ser tocado — a chamada ia ao socket, não achava
daemon, e a recusa vinha do ramo *"o Hefesto está parado"*. A de RECUSA
continuava verde **pelo caminho errado**; a de SUCESSO reprovou (e foi assim
que eu vi). As duas passaram a dublar `mic_canal_set_detalhado`, com o CORPO
que a ponte real devolve, e a de recusa passou a cobrar a frase do DONO
atravessando até o DOM em vez de casar um pedaço de literal.

---

## O que NÃO verifiquei

* **O ato do microfone acontecendo de verdade.** O clique foi feito e a recusa
  é honesta, mas o daemon instalado não conhece o método (§1). Quem provou as
  duas metades no aparelho foi a ONDA1-D1, na bancada, e o laudo está no
  relatório dela. **O selo composto nunca viu as quatro faces preenchidas na
  máquina dela** — `canal_ativo` e `canal_mudo` chegam ausentes até o daemon
  novo ser instalado, e o selo diz `—`, que é o desfecho certo para "ainda não
  perguntamos".
* **A MESA CHEIA.** Um controle só, no cabo. A confissão da decisão [08]
  (`por_uniq: False`) é o caso da mesa com DUAS placas de som, e ela está
  provada em régua, **não no aparelho**.
* **O RÁDIO.** Nada aqui foi medido por Bluetooth.
* **A publicação.** Publiquei a bancada em cima do produto por ~4 minutos, para
  fotografar e clicar, e **devolvi**: `diff` contra o `HEAD` diz IDÊNTICO.
  Quem vai ver o desenho novo é ela, na leva de publicação.
* **A suíte inteira.** Rodei o meu escopo em quatro lotes (696 casos). A suíte
  em oito lotes é de quem coordena.
* **O `:has()` no WebKitGTK dela.** As regras novas usam só seletor de
  atributo e descendência; nenhuma usa `:has()`. As da FOLHA usam, e a ONDA0-F
  já declarou que não as mediu naquele motor.

---

## O que sobrou para o próximo

### As linhas de MOTOR que NÃO couberam, com a razão

| linha | por que não fechou |
| --- | --- |
| **o medidor de onda do microfone ao vivo** | DOIS bloqueios, e nenhum é desta aba. (1) as 14 barras do `onda()` são ALTURA, e o piloto não tem alvo de altura — os dez são texto·largura·fundo·valor·html·classe·cor·plástico·atributo·marcado, e `interface/hefesto_vivo.py` **não é meu**. (2) o NÍVEL não existe no `state_full`: quem o lê é o `app/mic_monitor.py`, um monitor GTK. É frente própria, e ela precisa do piloto |
| **anotar no rascunho do perfil o que o gesto de som fez** | **esta interface NÃO TEM RASCUNHO** — decisão dela de 01/09 (*"clicar na cor já deveria aplicar"*), e é por isso que a aba 04 grava no PERFIL na hora. O equivalente aqui é gravar `mic`/`speaker` no perfil ativo a cada gesto, o que é uma decisão de produto (quando gravar, e em qual seção) mais um escritor novo. **Declarado como dívida, não esquecido** |
| **touchpad · analógicos · a posição** | **JÁ ESTAVAM FEITOS** pela leva de 03-04/09 (`touch-ponto`, `posicao-css`, `xy-l`/`xy-r`, `leitura_viva`) |

### Arquivo alheio — EDITADO, e digo exatamente o quê

Cinco arquivos, e cada um por uma razão que a própria casa manda:

| arquivo | o quê | por quê |
| --- | --- | --- |
| `interface/pacotes/ponte.py` | **+4 linhas de reexport** (`mic_canal_set`, `mic_canal_set_detalhado`, `mic_volume_set_detalhado`) | a sprint manda o gesto chamar `p.mic_canal_set(...)`, e um gesto só alcança o que este módulo expõe. Aditivo, sem dono nesta leva, conflito trivial |
| `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | **quatro lápides apagadas** | o próprio portão manda: *"APAGUE a entrada. A cura chegou e a lápide ficou"* |
| `tests/unit/test_a_recusa_chega_ao_cartao.py` | o dublê aponta para o ato; a asserção cobra a frase do DONO | passava verde pelo caminho errado (§6) |
| `tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py` | o dublê aponta para o ato | reprovava com a cura no lugar (§6) |
| `tests/unit/test_a_aba_controles_reusa_o_motor.py`, `…os_acesos…`, `…o_selo_do_mic…`, `…som_e_sensor…`, `…mic_da_mesa…` | **oito asserções** trocadas para o contrato que o PO decidiu | eram réguas cimentando o que a decisão substituiu — a família das onze de 26/08 |

**Nenhuma dessas edições muda comportamento de produto de outra frente.** As de
teste são asserção e docstring; a da ponte é reexport.

### Arquivo alheio — RELATADO, não editado

1. **`interface/regua_do_mockup.py` — o ramo do alvo `marcado`.** A ONDA0-P já
   pediu, e agora a aba 02 PUBLICA o endereço na bancada: `_campo` decide por
   `campo.alvo` e `marcado` cai no ramo de texto. No dia em que a aba for
   publicada, a régua passará a comparar `sim` com o texto do arquivo e
   acusará pintura certa. **O mesmo vale para o `data-hef-atributo` que o alvo
   `classe` veste** — ele é derivado, e não é um segundo campo.

2. **`interface/monta.py` — a folha do botão cinza não alcança botão de ÍCONE.**
   A peça casa `.btn` e `.seg button`; o 🎙/[nota] é `.mudo-i`, 22px quadrados, e
   virar `.btn` seria trocar o desenho que ela aprovou. Esta aba tem **três
   linhas de CSS** que copiam a cara da folha, declaradas como cópia. O dia em
   que `.mudo-i` entrar naquela lista, elas somem daqui. É a mesma dívida que a
   `05-vibracao` e a `06-navegacao` já têm com o `:empty`.
   **E há uma quarta linha que a folha não tem como dar**: o `?` do botão de
   ícone se esconde pelo ATRIBUTO da linha, não pelo conteúdo da dica — ver §2
   das medições. Se a peça comum aprender a esconder o `?` por um atributo do
   ancestral, esta aba fica com zero CSS próprio de botão cinza.

3. **`interface/hefesto_vivo.py` — falta um alvo de ALTURA.** Sem ele o
   medidor de onda do microfone (e qualquer barra vertical das dez abas)
   continua sendo desenho. É o bloqueio (1) da tabela acima.

4. **`interface/casamento.py` — o `FALSO` compartilhado.** A ONDA1-D1 já
   relatou que ele precisa crescer. Agora há um segundo motivo: com o selo
   composto, um controle de fixture que só tem `mic_mudo` diz `—`, e toda régua
   que quiser medir ATIVO precisa montar as quatro faces à mão (fiz isso em
   dois lugares). O crescimento certo é `{"canal_ativo": True, "canal_mudo":
   False}` ao lado do `mic_mudo`.

5. **`docs/data/paridade-gtk-html.csv` — NÃO TOQUEI**, e as linhas que esta
   frente fecha estão na seção abaixo.

6. **`mockup/DIVERGENCIAS.md`** — escrevi a seção da aba 02, como a sprint
   manda. A ONDA0-F previu a colisão com as outras nove frentes: é aditivo por
   aba, e quem costura mantém as duas razões na mesma seção.

### Para quem coordena

* **O `install.sh` precisa rodar antes de ela ver o microfone funcionar** (§1).
  Enquanto o daemon instalado for o de antes da ONDA1-D1, o 🎙 recusa dizendo —
  honestamente, e com a causa certa na frase desde esta leva.
* **A publicação desta aba muda pixel**, e é o único item que muda: o ANEL
  INTERNO (D-06). Os outros seis são invisíveis em repouso.

---

## As linhas do CSV que esta frente fecha

**Não editei `docs/data/paridade-gtk-html.csv`** — ele tem um dono nesta leva
(a ONDA1-X). Estas são as linhas para lançar:

| aba | linha | o que fechou |
| --- | --- | --- |
| `02-controles` | o selo ATIVO/MUDO fala do estado composto | decisão [03] · `selo_composto` |
| `02-controles` | o travessão da barra de luz vira palavra | decisão [02] · `luz_palavra` + `luz_porque` |
| `02-controles` | o botão de som avisa antes do clique | decisão [04] · `porques_do_som` + a peça da D-03 |
| `02-controles` | o "Devolver" do alto-falante | decisão [06] · fica fora, e a dica diz o preço |
| `02-controles` | a degradação do gamepad virtual chega à tela | decisão [07] · `degradacao_de` ganhou chamador |
| `02-controles` | o mudo que caiu no controle errado | decisão [08] · `alvo_honrado` no gesto `volume` |
| `02-controles` | onde a tela mostra o alto-falante mudo | decisão [09] · o [nota] acende, e o `alto-estado` saiu do desenho |
| `02-controles` | a cor viva no cartão | D-06 / S-11 · o anel interno |
| `02-controles` | o microfone é um ato só | S-05 · `mic.canal.set` + `frase_do_ato_do_microfone` |
| `02-controles` | o décimo alvo tem endereço | T-07 · `data-hef-alvo="marcado"` |
| `02-controles` | a rota do alto-falante lida nas duas camadas | ONDA1-D1 · `ler_as_duas_camadas` ganhou chamador |

**E as que NÃO fecham, para não serem lançadas por engano:** o medidor de onda
do microfone ao vivo e o registro no rascunho do perfil — as duas com a razão
na tabela acima.
