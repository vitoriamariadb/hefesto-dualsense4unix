---
sprint: ONDA5-03-02
estado: aberta
decisoes: 03-Q1, 03-Q2, 03-Q3, 03-Q4 (a metade da ABA)
posse:
  Q1-Q4-aba03:
    - src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py
    - src/hefesto_dualsense4unix/interface/aba03.py
    - tests/unit/test_a_aba_03_gatilhos_fecha_as_linhas.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - docs/data/paridade-gtk-html.csv
depois_de: [MIGRA-GATILHOS-04, MIGRA-GATILHOS-05, MIGRA-GATILHOS-06, MIGRA-GATILHOS-09, MIGRA-GATILHOS-10, ONDA2-03-GATILHOS-01, ONDA4-S10-O-TRANSPORTE-01, ONDA5-03-01, AS-DUAS-ABAS-FALAM-01]
---

# ONDA5-03-02 · DESENHO — o recibo que repete o clique, e as três que já existem

**Ela respondeu QUATRO perguntas desta aba. Três não pedem uma linha de código
nova, e a sprint diz isso em vez de inventar trabalho.** O que sobra é uma
mudança só, e ela é consequência da `03-Q4`.

| pergunta | o que ela marcou | o que esta sprint faz |
| --- | --- | --- |
| `03-Q1` — a tela ainda explica o modo escolhido | *Aparece ao parar o mouse* | **já é assim.** Só a autoria muda de mão |
| `03-Q2` — curva pronta pode trocar o modo sozinha | *Aplica na hora, com aviso* | **já é assim.** Só a autoria muda de mão |
| `03-Q3` — botão para mandar o efeito de novo | *Nada novo* | **nada a construir** — e o botão que ela não pediu já está na tela desde 04/09. Ver §2 |
| `03-Q4` — a tela avisa quando deu certo | *O campo pisca em verde* | o recibo de sucesso puro sai do cartão. §3 |

Nenhuma das quatro traz `palavra_dela`: ela marcou a opção e não escreveu nada
ao lado. **Então a opção É a palavra**, e nenhuma delas diz *"parece um bug"* —
esta sprint é DESENHO inteira, e não conserta defeito nenhum.

---

## 1. AS DUAS QUE JÁ EXISTEM — medidas, com o endereço

### `03-Q1` — *"Aparece ao parar o mouse"*

**É o que o produto faz hoje.** A explicação do modo ESCOLHIDO mora no `title`
do embrulho do campo, e o produto a reescreve a cada tique:

```python
            col[f"{PREFIXO_DA_DICA_DO_MODO}{sig}"] = descricao_do_modo(
                str(d["modo-chave"]))
```
— `src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py:1947-1948`,
com as 19 frases em `:461-481` e a queda para a descrição do produto em `:509-514`.

O endereço é o embrulho, e não o `<select>` — o campo de escolha já gasta o seu
alvo com `valor`:

```html
          <div data-campo="dica-modo-{sigla}"
               data-hef-alvo="atributo" data-hef-atributo="title"
```
— `src/hefesto_dualsense4unix/interface/aba03.py:831-833`

E há régua que impede o `<select>` de ganhar um `title` próprio, porque ele
sombrearia a dica viva e congelaria a explicação na frase da CENA
(`aba03.py:1381-1384`). As duas medições que provam o comportamento já existem:
`test_a_dica_do_modo_e_a_do_modo_que_esta_escolhido`
(`tests/unit/test_a_aba_03_gatilhos_fecha_as_linhas.py:136`) e
`test_a_dica_do_modo_muda_quando_o_modo_muda` (`:167`), que mede pelo TIQUE e
não pela função pura.

**O QUE A RESPOSTA DELA FECHA, e é a metade que não era de código:** a linha 97
do `docs/data/paridade-gtk-html.csv` (*"Descrição visível do modo ESCOLHIDO (sem
passar o mouse)"*) estava aberta com esta frase escrita nela:

> *"O que falta para fechar é um lugar VISÍVEL na coluna para o texto do modo —
> e isso é pixel novo, logo é desenho, logo é o olho dela."*

**O olho dela falou: não há pixel novo.** A GTK mostra a frase sempre, a
interface nova mostra ao parar o mouse, e a diferença passa a ser divergência
DECIDIDA em vez de dívida. Ver a §6.

### `03-Q2` — *"Aplica na hora, com aviso"*

**É o que o produto faz hoje**, e o aviso já existe, escrito pela lista e não à
mão. `dica_do_pronto` (`a03_gatilhos.py:550`) pergunta ao campo o que ele
oferece naquele modo e resolve cada curva pela tabela em que ela mora
(`destinos_do_campo_de_pronto`, `:529`), e daí monta a frase:

> *"Este gatilho está em «Rígido». Escolher uma curva pronta TROCA o modo dele
> para «Curva de força» na hora — é um clique, e já vai ao controle."*

**A primeira versão dessa frase prometia demais e foi derrubada pela mordida**
(`:565-572`): ela anunciava dois destinos onde a lista só abre um. A régua que a
derrubou continua no lugar —
`test_a_dica_do_pronto_nomeia_exatamente_os_destinos_que_a_lista_abre` (`:236`),
com `test_onde_a_curva_nao_troca_o_modo_a_dica_nao_anuncia_troca` (`:292`) e
`test_a_dica_do_pronto_acompanha_o_modo_no_tique` (`:313`).

**Não reescreva a frase.** Ela é derivada, e uma frase digitada volta a mentir
no dia em que a tabela mudar.

### O único trabalho das duas: a autoria muda de mão

Quatro lugares atribuem estas duas decisões ao **PO**, e agora elas são dela:

| arquivo:linha | o que diz hoje |
| --- | --- |
| `a03_gatilhos.py:439` | *"A DESCRIÇÃO DO MODO — decisão [01] do PO, 04/09/2026"* |
| `a03_gatilhos.py:553` | *"DECISÃO [02] do PO, 04/09/2026"* |
| `aba03.py:47` | *"Com a decisão [01] do PO"* |
| `aba03.py:573` | *"quem a reescreve a cada tique é o PRODUTO (decisão [01] do PO)"* |

**Não apague a data de 04/09.** O PO decidiu, o trabalho foi feito, e ela
CONFIRMOU em 05/09 respondendo a mesma pergunta com a mesma escolha. As duas
linhas ficam, e a segunda é a que vale daqui em diante: *confirmada por ela em
05/09/2026, pergunta `03-Q1`* (e `03-Q2`). Uma decisão do PO que a dona
confirmou vale mais do que antes — apagar a primeira faria a próxima pessoa
achar que ninguém pensou nisso.

---

## 2. `03-Q3` — A PERGUNTA CHEGOU DEZENOVE HORAS DEPOIS DA ENTREGA

> **DECIDIDO POR ELA EM 06/09/2026: o `↻` SAI.** Perguntada com o botão na tela
> e a foto ao lado, escolheu *"sai"*. Esta sprint ganha um passo: o botão sai das
> quatro colunas (`aba03.py`), o gesto `reenviar` sai do pacote com as cinco
> réguas dele, `PISO_DA_ABA` volta a 4, e as linhas 106 e 108 do CSV fecham como
> *DIFERENTE, decidida por ela*. A pergunta de uma linha abaixo está respondida.

Ela leu: *"A coluna de cada controle **ganha** um botão para mandar o efeito de
novo?"* e marcou **"Nada novo"**, aceitando o custo escrito na opção — *"para
reenviar você troca de modo e volta ao que queria; entre os dois cliques o
controle sente um efeito errado na sua mão"*.

**O botão já estava na tela quando ela respondeu.** Medido pelo git, e as duas
datas são do mesmo dia:

| quando | o quê |
| --- | --- |
| 04/09, 01:24 | nasce a lista de perguntas — `docs/process/sprints/2026-09-04-DECISOES-DELA-03-gatilhos.md` |
| 04/09, 20:14 | nasce o botão — `feat(gatilhos): as quatro decisões da aba 03 — a dica que segue o modo e o reenvio que faltava` |

Ele está nas quatro colunas, com o glifo `↻`, ao lado do "Guardar esse efeito" —
`aba03.py:915-917` —, tem gesto próprio (`a03_gatilhos.py:2930`), tem cinco
réguas (`test_a_aba_03_gatilhos_fecha_as_linhas.py:328`, `:356`, `:379`, `:401`,
`:425`) e subiu o piso da aba de 4 para 5 gestos (`a03_gatilhos.py:3309-3312`).

**O QUE ESTA SPRINT FAZ: NADA NO CÓDIGO.** As duas regras desta casa apontam
para o mesmo lugar:

* *"A árvore de trabalho é o que roda. **Não entregue mudança que ela não
  pediu**"* — e ela não pediu para tirar um botão que não sabia existir. Ela
  recusou **ganhar** um.
* *"Quando ela recusa todas as opções que eu ofereço, a hipótese certa não é que
  falta uma quarta — é que a pergunta está errada."* Aqui a pergunta não está
  errada: **está vencida**. É a mesma forma, um degrau antes.

**O que sobra é uma pergunta de UMA LINHA, e ela é para ela**, com o botão na
tela e a foto ao lado: *"o `↻` de reenvio já está na coluna desde 04/09 à noite,
ao lado do Guardar; ele fica ou sai?"* Enquanto ela não responde, o botão fica —
tirar é destruir trabalho medido com base numa resposta sobre outro mundo.

**E o custo que ela aceitou não existe mais.** A opção dizia que sem botão o
controle sente um efeito errado entre dois cliques; com o `↻` na tela, esse
caminho não é o único. Dizer isso a ela é parte da pergunta.

---

## 3. `03-Q4` — O RECIBO QUE SÓ REPETE O CLIQUE VIRA A PISCADA

**A decisão dela, e ela recusou explicitamente o que a aba faz hoje.** A opção
*"Tarja verde curta na coluna"* descrevia o comportamento vivo com a frase viva
dele — *"a mesma caixa dos avisos de recusa, em verde, com a frase (`Gatilho
esquerdo (L2): Metralhadora`)"* — e ela escolheu **"O campo pisca em verde"**,
com *"nenhuma palavra nova entra na tela"*.

A `ONDA5-03-01` constrói a piscada no piloto e escreve a regra que esta sprint
obedece:

> **quando o gesto só repete o que ela acabou de fazer, a tela pisca; quando ele
> tem NOTÍCIA, a tela fala.**

Nesta aba, o "só repete" é o recibo de sucesso pleno. Ele nasce em `_aplicar`:

```python
    return ok, motivo, _recibo(lado, modo_, corpo, ctx, uniq)
```
— `a03_gatilhos.py:2446`

e sai por `{"recado": recibo}` em quatro gestos: `modo` (`:2759`), `pronto`
(`:2818` e `:2838`), `ajuste` (`:2919`) e `reenviar` (`:3019`).

**E ele é sempre sucesso PLENO**, porque tudo o que não é já levantou antes:
`_conferir_o_desfecho` (`:2655`) levanta quando o corpo traz `guardado_em` sem
`aplicado_em` ou um `motivo` com `status: ok`. O que chega ao `recado` é
*"Gatilho esquerdo (L2): Rígido aplicado"* — o nome do que ela acabou de
escolher, no cartão, ao lado do campo em que ela escolheu.

### Passo 1 — `_aplicar` devolve NOTÍCIA, e não recibo

`a03_gatilhos.py:2446`. A terceira casa da tupla deixa de ser *"o que aconteceu"*
e passa a ser *"o que ela precisa saber e não está vendo"*:

* aparelho recebeu **e** perfil guardou → `""`. A piscada é a resposta inteira.
* aparelho recebeu **e** o perfil não guardou → as duas metades, e elas continuam
  entrando pelo `_E_TAMBEM` (`:2926`), com o recibo na frente para a frase abrir
  pelo que ela fez. É a `AS-DUAS-ABAS-FALAM-01`, e esta sprint vem depois dela
  justamente para não desfazê-la.

**`_recibo` (`:2613`) NÃO se apaga.** Ele continua sendo o dono da frase — e as
duas armadilhas que ele já documenta continuam sendo dele: o corpo que não fala
de destino (`_fala_de_destino`, `:2504`) e o tradutor que não pode calar a frase
(`:2649-2652`). O que muda é QUANDO ele é chamado: só quando há uma segunda
metade para prefixar.

**A MORDIDA:** faça `_aplicar` devolver o recibo sempre e
`test_o_sucesso_pleno_nao_manda_recado` (§4) reprova nos quatro gestos de uma
vez. Se reprovar em um só, a cura entrou no gesto e não no `_aplicar` — que é o
defeito de forma que esta casa pagou duas vezes em 05/09.

### Passo 2 — os quatro gestos não mudam uma linha

`{"recado": recibo}` continua escrito nos quatro. Com o recibo vazio, o piloto
não deposita nada (`ONDA5-03-01`, Passo 4) e a piscada acende sozinha.

**Confira que é assim de verdade, e não por sorte:** `{"recado": ""}` tem de
cair no mesmo ramo de `{}` — `hefesto_vivo._deu_certo_dizendo` testa
`bruto.strip()` antes de aceitar a frase (`hefesto_vivo.py:2250`). Se o Passo 4
da `ONDA5-03-01` tiver escrito a guarda de outro jeito, é aqui que se descobre.

### Passo 3 — o `guardar` já está certo e não se toca

`guardar` (`:3023`) devolve `None` ou `{"blocos": …}` — nunca `recado`. Com a
`ONDA5-03-01`, ele passa a piscar em vez de dizer *"Pronto."*, que é exatamente
o que ela pediu, sem uma linha nova. **Não acrescente recibo a ele.**

### Passo 4 — a nota da página conta a versão velha

O último item da `LEGENDA` diz:

```html
    <li><b>Quando o efeito chega, a tela diz.</b> … A confirmação nasce no <b>próprio
        cartão</b>, como a recusa, e some sozinha em segundos.</li>
```
— `aba03.py:1166-1168`

Ele descreve a forma que ela trocou. Reescreva-o para a piscada, rode o gerador,
e **pare aí**: `interface/monta.py` escreve em `mockup/` e nunca no publicado
(`src/hefesto_dualsense4unix/interface/onde.py:9-15`), e quem leva ao produto é
`scripts/check_o_desenho_aprovado.py --publicar 03`, que é **ato dela**.

A `LEGENDA` é um `.nota`, escondida no produto pela folha do módulo
(`gui/ponte_da_tela.py:149`), então este passo não muda um pixel do que ela usa —
muda o que a próxima pessoa lê ao abrir a bancada.

### Passo 5 — a razão do C-3 fica escrita onde ela estava

`a03_gatilhos.py:2622-2624` diz *"a lista desta aba propunha o campo que pisca;
**ela escolheu o cartão**"*. A atribuição está errada e a escolha caducou: quem
escolheu o cartão foi o PO, lendo a `D-01`; ela escolheu a piscada em 05/09,
pergunta `03-Q4`. Corrija as duas metades, com a data — a `ONDA5-03-01` faz o
mesmo no piloto e na régua da bancada, e as três frases têm de contar a mesma
história ou a próxima pessoa acredita na que ler primeiro.

---

## 4. AS RÉGUAS — três mudam de pergunta, e nenhuma se apaga

**Leia uma a uma.** *"Substituição em massa sobre uma régua é edição cega"* — a
lição das dezoito de 05/09, com duas devolvidas por isso.

| régua | linha | o que fazer |
| --- | --- | --- |
| `test_o_gesto_devolve_o_recado_que_o_piloto_leva_ao_cartao` | `:492` | **inverte.** Ela cobra a chave `recado` nos três gestos; passa a cobrar que o sucesso pleno NÃO a traga. O defeito que ela guarda (*o gesto dá certo e a tela não diz*) continua guardado — pela piscada, medida na `ONDA5-03-01` |
| `test_o_recibo_nao_afirma_o_que_o_daemon_nao_disse` | `:538` | **repontar.** Ela lê `fora["recado"]` num clique de sucesso pleno, que passa a ser vazio. A armadilha que ela mede é do `_recibo`, e é ao `_recibo` que ela passa a perguntar |
| `test_o_recibo_conta_quando_o_daemon_diz_dois_destinos` | `:571` | **repontar**, pela mesma razão. O *"aplicado em 2 controles"* continua sendo do dono do assunto |

**As réguas novas, e as três mordem em lugares diferentes:**

1. **`test_o_sucesso_pleno_nao_manda_recado`** — parametrizado em `modo`,
   `pronto`, `ajuste` e `reenviar`, com a ponte que aceita: os quatro devolvem
   sem `recado` (ou com ele vazio). É a que prova o Passo 1: uma cura escrita
   dentro de um gesto passa em um quarto dela.
2. **`test_a_falha_de_disco_continua_falando`** — com o dublê que faz o perfil
   não abrir, o `recado` volta a existir e traz as duas metades. Sem ela, o
   Passo 1 poderia calar a `AS-DUAS-ABAS-FALAM-01` inteira e ninguém veria — a
   régua dela mede o gesto, não o `_aplicar`.
3. **`test_o_recibo_ainda_nomeia_o_gatilho_quando_prefixa_a_noticia`** — quando
   há segunda metade, a frase abre por *"Gatilho esquerdo (L2)"*. É o que
   `test_o_gesto_devolve_o_recado_que_o_piloto_leva_ao_cartao` cobrava e que não
   pode se perder com a inversão.

**E cuidado com o dublê.** O `_Ponte` deste arquivo devolve corpo `{}` por
padrão, e nesse corpo `_fala_de_destino` responde `False` e o recibo sai na forma
curta (`a03_gatilhos.py:2641-2642`). Conte com a forma curta nas asserções, ou a
régua passa a medir o tradutor em vez da frase. Três dos vermelhos de 05/09
eram dublê mais frouxo que o real.

---

## 5. NADA SE PERDEU

* **A dica do modo e a do "Efeito pronto" continuam reescritas a cada tique**,
  uma por LADO (`a03_gatilhos.py:1947-1950`), e o lugar vazio continua sem
  explicar modo nenhum (`:1986-1993`, régua `:186`).
* **O `<select>` continua sem `title` próprio** (`aba03.py:1381-1384`) — com ele,
  a explicação congela na frase da cena.
* **Escolher uma curva pronta continua aplicando na hora e trocando o modo**, e a
  dica continua avisando ANTES, nomeando só os destinos que a lista abre.
* **O `↻` continua nas quatro colunas**, com o gesto, o `data-hef-forma` e as
  cinco réguas. O piso da aba continua em 5 (`a03_gatilhos.py:3312`).
* **`reenviar` continua não gravando nada no disco** — o contrato está no
  docstring dele e `test_reenviar_nao_grava`
  (`tests/unit/test_o_gatilho_aplicado_vai_para_o_perfil.py:271`) o guarda.
* **A recusa continua levantando `RuntimeError` com a frase do dono do assunto**,
  e continua indo ao cartão em laranja por 30 s. Esta sprint não toca o ramo do
  erro.
* **`_recibo` continua honesto sobre o corpo que não fala de destino** — a guarda
  `_fala_de_destino` é a quinta vez que esta casa evitou um verde sobre defeito
  vivo, e ela vale mesmo com o recibo saindo menos vezes.
* **O rascunho e a gravação no perfil por clique continuam onde estão**
  (`_aplicar`, `:2440-2445`). Esta sprint mexe na terceira casa da tupla e em
  nada mais.
* **"Desligado" continua sendo `trigger.reset` e não `trigger.set` com `Off`** —
  é a R-19, e mandar `Off` pela outra porta arma a trava que pausa a troca
  automática de perfil.

---

## 6. AS LINHAS DE `docs/data/paridade-gtk-html.csv` QUE ESTA SPRINT FECHA

**Não edite o arquivo.** Ele tem um dono por leva, e dez frentes editando linhas
do mesmo CSV é conflito por linha. Entregue esta lista:

| linha | feature | o que passa a valer |
| --- | --- | --- |
| 96 | Dica (tooltip) por modo | **DIFERENTE, decidida por ELA** em 05/09, `03-Q1`. O texto desta tela, no `title`, com o mouse parado. Confirma o que o PO decidiu em 04/09 |
| 97 | Descrição visível do modo ESCOLHIDO (sem passar o mouse) | **DIFERENTE, decidida por ELA** em 05/09, `03-Q1`. **A frase *"o que falta é um lugar VISÍVEL … é o olho dela"* cai:** o olho dela falou, e não há pixel novo. A GTK mostra sempre, a interface nova mostra ao parar o mouse |
| 102 | Quando o campo "Efeito pronto" aparece, e o que escolhê-lo faz | **DIFERENTE, decidida por ELA** em 05/09, `03-Q2`. Aplica na hora, troca o modo, e a dica avisa antes |
| 106 | Aplicar o efeito no aparelho | o `↻` existe desde 04/09 e ela respondeu *"Nada novo"* sobre um mundo sem ele. **Fica ABERTA na pergunta de uma linha da §2** — não a feche num sentido nem no outro |
| 108 | "Desligar" — soltar a trava sem re-armá-la (R-19) | idem 106, e pela mesma pergunta |
| 113 | Dizer na tela o desfecho | **DIFERENTE, decidida por ELA** em 05/09, `03-Q4`. **A nota que diz *"No cartão, pela peça da D-01 — C-3. Sem pisca"* cai inteira:** a piscada é a forma, e o cartão fica para quem tem notícia |

---

## A PROVA DE TELA

O que muda na tela dela é uma frase que **deixa de aparecer**, e isso é mais
difícil de fotografar do que uma que aparece. Então a prova é dupla:

1. **A FOTO** — clique no `<select>` de modo e fotografe o instante do sucesso:
   a coluna sem a caixa verde, e o campo com a borda verde da `ONDA5-03-01`.
   `--oculta` sempre.
2. **O CLIQUE** — nos quatro gestos que mudaram (`modo`, `pronto`, `ajuste`,
   `reenviar`) e no que não mudou (`guardar`). Cinco cliques, cinco fotos.
3. **A MORDIDA** — devolva o recibo em `_aplicar` e fotografe de novo: a caixa
   verde volta ao cartão, por cima de onde a piscada estava. É a prova de que a
   frase saiu do caminho do produto, e não só da régua.

**MEÇA ONDE A CAIXA VERDE POUSAVA, e o resultado é para o relatório.** A opção
que ela recusou dizia *"empurra a coluna para baixo enquanto está lá"*. Nesta
aba ela **não empurra**: o `.ctrl` é `display:grid` com `grid-template-rows:
subgrid` (`aba03.py:203`), e ele é filho DIRETO da grade — quem prova é a regra
`.duas-colunas > div > .vao-l2-r2` (`aba03.py:199`), cujo alvo mora dentro do
`.ctrl` (`aba03.py:912`). Então o recado entra pelo `ESTILO_NA_GRADE`
(`hefesto_vivo.py:658-659`) — absoluto, `top:4px`, sobre a primeira trilha da
coluna, que é onde mora o chip que nomeia o controle. **O custo real é diferente
do escrito na opção, e é pior: em vez de empurrar, cobre o nome.** A decisão dela
não muda por isso; o registro sim.

**A JANELA NÃO NASCE NA TELA DELA.** `--oculta` sempre — ela tem UMA tela.
