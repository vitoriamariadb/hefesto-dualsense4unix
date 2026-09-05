# ONDA2-10 · A ABA PERFIS — o cadeado, o campo que se corrige, e a régua que faltava

**04/09/2026.** Sprint
[`2026-09-04-ONDA2-10-PERFIS-01`](../../sprints/2026-09-04-ONDA2-10-PERFIS-01-a-regra-que-a-tela-nao-sabe-mostrar-e-a-coluna-que-mente.md).
Árvore `hefesto-voo/ONDA2-10-PERFIS-A10`, branch `voo/ONDA2-10-PERFIS-A10`.

**O QUE ESTA FRENTE DERRUBOU, e é o achado do dia:** o defeito **T-04** — *a
coluna "Ajuste próprio" acende o que o disco não guarda* — **não é um
deslocamento**. A leitura de 04/09 que o nomeou é, célula por célula, o
`GUARDA` que o gerador crava no mockup: o que se mediu foi *a coluna não sendo
pintada*, e não *a coluna pintando errado*. Medido de novo hoje no DOM vivo,
com o daemon dela no ar: as vinte células saem com o selo de visita e o valor
certo. **O que faltava não era conserto — era régua**, e ela agora existe.

---

## O que mudou

### As cinco decisões do PO, fechadas

| # | decisão | onde | chega a ela |
| --- | --- | --- | --- |
| **[01]** | Cadeado no campo, frase no hover | `aba10.py` (desenho) + `a10_perfis.py` (dado) | **espera o `--publicar` dela** |
| **[02]** | A tela avisa e para por aí | `a10_perfis.py` | **hoje** — é pacote, não desenho |
| **[03]** | A frase da Prioridade, e vão as DUAS | `aba10.py` (desenho) | **espera o `--publicar` dela** |
| **[04]** | Só a tira, e o campo se corrige | `a10_perfis.py` | **hoje** |
| **[05]** | A tira ganha uma segunda linha | `aba10.py` (desenho) | **espera o `--publicar` dela** |
| **[06]** | Os dois avisos do quadro Modo | — | **NÃO COUBE.** Razão medida abaixo |

### [01] — o cadeado, o ponto, e a metade que ninguém tinha visto

O produto já montava a marca de travado e a frase que a explica
(`perfis_web._ambiente_do_perfil`) e as duas **caíam no vazio**: não havia
endereço para elas na página. O desenho ganhou duas marcas, pela mesma peça
(`aba10.marca_com_dica`): um **cadeado** SVG ao lado do "Funciona em" e um
**ponto laranja** ao lado do "Nome do Jogo". Os dois nascem escondidos e o
produto os acende pelo alvo `classe`; a frase vai no hover, pelo alvo `html`.

**E ELES REVELARAM A OUTRA METADE DO MESMO DEFEITO**, que a decisão não previa
porque ninguém tinha olhado o DOM com um perfil travado. Medido, com o cadeado
já aceso:

```
trava.acesa      true      ← "esta tela não sabe mostrar a regra"
editor.ambiente  "Jogo"    ← o DESENHO, afirmando uma regra que não é
```

`perfis_web` devolve `ambiente: None` para o perfil de regra fina; o
`escrever()` do piloto troca isso por `—`, e **um `<select>` só aceita o que ele
oferece** — nenhuma opção casava, a escrita devolvia 0, e o campo ficava com o
`"Jogo"` que o mockup cravou. As duas metades da mesma linha diziam coisas
diferentes. O "Funciona em" ganhou a opção `—`, **desabilitada** e com
`value="—"` (e não `value=""`: com o valor vazio a atribuição não casa nada, o
campo renderiza em branco e o contador de pinturas soma +1 por tique, para
sempre — é a medição que segura o `editor.estilo` em `NAO_PINTAVEIS`).

### [02] — a frase estava certa; ela estava na TELA errada

O enunciado acusava **duas** frases de mandarem a lugares que não existem aqui.
Medi as duas, e **só uma se sustenta**:

| frase | onde mora | veredito |
| --- | --- | --- |
| `AMBIENTE_QUE_A_TELA_NAO_MOSTRA` — *"use `hefesto-dualsense4unix profile` na linha de comando"* | `perfis_web.py` | **ESTÁ CERTA.** A opção que o PO escolheu diz, com estas palavras: *"não promete conserto. Quem quiser mudar mexe por fora, pela linha de comando."* A CLI existe e é citada em outra recusa desta mesma aba. |
| `exigencia_invisivel` — *"Ligue o Modo avançado para ver e mudar."* | `profiles/simple_match.py` | **ERRADA AQUI, CERTA LÁ.** O `main.glade:2275` tem o interruptor com esse nome e `profiles_actions._sincronizar_exigencia_invisivel` escreve a frase ao lado dele. Nesta interface: **zero ocorrências** nas dez páginas publicadas. |

**Por isso a substituição é no pacote desta aba, e não no matcher.** Corrigir
`simple_match.py` apagaria a metade que está CERTA na janela estável — o defeito
ao contrário. `a10_perfis._exigencia_para_esta_tela` troca o sufixo por um que
esta tela alcança, **e a troca é cobrada**: `test_a_remenda_do_fim_da_frase_nao_apodrece`
reprova no dia em que a frase do produto mudar, em vez de deixar a remenda
falhar em silêncio.

O fim novo é o **mesmo** da outra frase desta aba, de propósito: as duas contam
o mesmo estado — a tela mostra menos regra do que o disco guarda — e duas saídas
diferentes para o mesmo beco seriam duas verdades.

### [03] — as duas frases, a dela primeiro

O `title` do campo Prioridade passou a ser
`FRASE_DA_PRIORIDADE_DELA` + `FRASE_DO_UNIVERSAL`. O literal mora num lugar só,
no gerador, e `test_a_frase_da_prioridade_do_desenho_e_a_que_ela_aprovou`
o compara com o `prioridade_dica` que `perfis_web` devolve — **a régua LÊ os
dois lados**. `editor.prioridade.dica` continua em `NAO_PINTAVEIS`, e há régua
que reprova se sair: o `<span>` tem o trilho e o número dentro, e `textContent`
os apagaria.

### [04] — o endereço colado vira o número na frente dela

`editor_jogo` (e `detectar`, pelo mesmo motivo mais forte) passou a devolver
`editor.jogo` corrigido junto com o desfecho. O valor sai de
`simple_extra(prof.match)` — a MESMA função com que `perfis_web` enche o campo a
cada tique —, com `or texto` de piso para a correção nunca APAGAR o que ela
digitou.

**A correção só cabe no gesto**, e a razão é medida: `editor.jogo` está em
`CAMPOS_QUE_ELA_DIGITA`, logo o tique não o repinta enquanto ela está no mesmo
perfil (senão a pintura apagaria a segunda tecla que ela digita). O único
instante em que a tela pode devolver a forma canônica é a resposta do próprio
gesto — e ela é pintada na hora.

### [05] — a segunda linha, e ela sai da lista

`.desfecho` foi de `height:15px` + `nowrap` + `text-overflow` para `height:30px`
+ `-webkit-line-clamp:2`. `visibility` continua no lugar de `display` e a altura
continua **fixa**: a quarta opção (crescer só quando precisa) devolveria o pulo
de 15px que o espaço reservado curou. Medido no Chrome a 1920x1080: a janela
tem **777px antes e depois** — os 15px saíram da lista de perfis, ≈meia linha.

### T-04 — a régua que faltava, e o que a medição derrubou

Ver *"O que medi e derrubou uma suposição"*, abaixo. Nasceram quatro réguas que
refazem a **DISTRIBUIÇÃO** — o passo entre o que o pacote emite e o que a célula
mostra —, sobre o HTML de verdade e contra o disco.

---

## Como provei (a mordida colada)

**DEZ MORDIDAS, uma por cura.** Cada uma arranca a cura, roda a régua, e devolve.
A saída completa está em `<scratchpad>/a10/mordidas.txt`; o essencial:

```
MORDIDA: T-04 · a ordem do laço da distribuição
E   AssertionError: a coluna “Ajuste próprio” diz o que o disco não guarda:
E       p1/rumble: tela=apagada disco=guarda
E       p1/speaker: tela=acesa disco=não guarda
E       p1/mic: tela=acesa disco=não guarda
E       p2/triggers: tela=apagada disco=guarda
FAILED test_cada_celula_da_guarda_diz_o_que_o_disco_guarda[bancada]
FAILED test_cada_celula_da_guarda_diz_o_que_o_disco_guarda[publicada]

MORDIDA: T-04 · uma célula fora do <tbody>
E   AssertionError: 1 célula(s) de `guarda.secao` moram FORA do
E   `<tbody data-hef="guarda.linhas">` — a distribuição por ordem do documento
E   passa a casar cada linha com os valores da vizinha        · assert 20 == 21

MORDIDA: [01] · a marca some do desenho
ERRO em 10-perfis — decisão dela desfeita:
  - a marca `trava` sumiu do editor — o campo volta a ficar idêntico a um
    destravado e só reclama depois do clique
  - a dica de `trava` não é um `editor.ambiente.recado` VAZIO no desenho
E   AssertionError: a marca `trava` não está na bancada

MORDIDA: [01] · a marca acende sem frase
E   AssertionError: no perfil “por título” a marca `editor.jogo.exige` está
E   acesa e a frase `editor.jogo.exigencia` está vazia — uma marca sem
E   explicação, ou uma explicação que ninguém alcança

MORDIDA: [02] · a frase do Modo avançado volta inteira
E   AssertionError: a tela manda ela ligar um “Modo avançado” que esta interface
E   não tem: '… Ligue o Modo avançado para ver e mudar.'

MORDIDA: [02] · o sufixo do produto muda e a remenda não alcança
E   AssertionError: o fim da frase do produto mudou e a remenda desta aba não o
E   alcança mais

MORDIDA: [03] · a frase dela deixa de ser a do produto
E   - Quando dois perfis servem ao mesmo tempo, o de número maior entra.
E   + Quando dois perfis servem, o de número maior entra.

MORDIDA: [04] · o gesto para de corrigir o campo
E   KeyError: 'editor.jogo'

MORDIDA: [04] · a correção apaga o que ela digitou
E   AssertionError: a correção apagou o que ela digitou   ·  assert '' == 'Cyberpunk2077.exe'

MORDIDA: [05] · a tira volta a uma linha
ERRO em 10-perfis — decisão dela desfeita:
  - a tira do desfecho voltou a UMA linha — o fim da frase, que é a metade que
    avisa, some com reticências
  - a tira perdeu o `-webkit-line-clamp:2`
  - o `nowrap` voltou à tira
E   AssertionError: a tira voltou a uma linha
```

E a cura devolvida, com a árvore intacta:

```
=== a cura devolvida: a régua inteira ===
....................                                                     [100%]
20 passed in 0.59s
```

Hoje o arquivo tem **21 réguas** (a do travessão entrou depois das mordidas), e
a leva de vizinhos fecha junta:

```
$ pytest tests/unit/test_*a10* test_*perfi* test_*aba10* test_*ajuste_proprio* \
         test_*desenho* test_*mockup* -q
1324 passed, 6 xfailed in 48.00s
```

### A PROVA DE TELA — a foto, o clique e a resposta

**As quatro fotos viajam com este relatório.**

| foto | o que ela mostra |
| --- | --- |
| [`ONDA2-10-antes.png`](ONDA2-10-antes.png) | o desenho ANTES (a página publicada, Chrome, 1920x1080) |
| [`ONDA2-10-depois.png`](ONDA2-10-depois.png) | o desenho DEPOIS (a bancada) — mesma altura de janela, 777px |
| [`ONDA2-10-o-cadeado.png`](ONDA2-10-o-cadeado.png) | o PRODUTO vivo, perfil de regra fina: **cadeado aceso**, "Funciona em" em `—` |
| [`ONDA2-10-o-ponto-de-alerta.png`](ONDA2-10-o-ponto-de-alerta.png) | o PRODUTO vivo, Pragmata: **ponto laranja** ao lado de `3357650` |

**O CLIQUE, e ele é de verdade:** o piloto abriu a aba OCULTA
(`Gtk.OffscreenWindow`, nada na tela dela), com o daemon dela vivo, e um driver
clicou a célula do nome de cada perfil — o gesto `selecionar`. Os três estados,
lidos do DOM depois de cada clique:

```
abertura                       ambiente='—'             jogo='—'       trava=ACESA   exige=apagado  tira=30px/2
Por título — o cadeado         ambiente='—'             jogo='—'       trava=ACESA   exige=apagado  tira=30px/2
Pragmata — o ponto de alerta   ambiente='Jogo da Steam' jogo='3357650' trava=apagada exige=ACESO    tira=30px/2
Simples — nenhuma das duas     ambiente='Jogo da Steam' jogo='1245620' trava=apagada exige=apagado  tira=30px/2
```

E as frases que o hover mostra, lidas do DOM:

```
trava: "Este perfil casa por uma regra que esta tela não sabe mostrar — o
        seletor fica travado para que salvar não a rebaixe. Para editá-la, use
        `hefesto-dualsense4unix profile` na linha de comando.
        (casa por título de janela)"
exige: "Este perfil também exige nome do processo \"PRAGMATA.exe\", e só entra
        quando isso bater junto com o número do jogo. Esta tela não mostra esses
        campos; para vê-los e mudá-los, use `hefesto-dualsense4unix profile` na
        linha de comando."
```

**COMO A MEDIÇÃO FOI FEITA, e o que ela NÃO é:** a página publicada não mudou
(nada foi publicado). Para ver o desenho novo no motor de verdade, a bancada foi
copiada **para dentro da árvore desta frente**, medida, e **restaurada no mesmo
comando** — `diff` confirma a página publicada byte a byte igual à de antes, e o
`git status` da frente não a lista. O perfil da bancada foi um **lar de mentira**
(`XDG_CONFIG_HOME` num diretório temporário, três perfis sintéticos): a pasta de
perfis DELA não foi tocada.

**As duas fotos do produto têm a coluna "ID da peça" TAPADA** — ali aparece o
endereço de rádio real do controle da bancada, e nada de endereço real entra em
arquivo versionado.

---

## O que medi e derrubou uma suposição

### 1. T-04 não é um deslocamento — é uma coluna que não tinha sido pintada

A sprint
[`AJUSTE-PROPRIO-DESALINHADO-01`](../../sprints/2026-09-04-AJUSTE-PROPRIO-DESALINHADO-01-a-coluna-diz-o-que-o-disco-nao-guarda.md)
registra a medição e escreve, com todas as letras, que o diagnóstico não foi
feito: *"O padrão é de deslocamento, não de valor errado."* **Ele não é.**

A leitura do DOM daquele dia foi:

```
P1   ACESA  ACESA  ACESA  apagada  ACESA
P2   ACESA  apagada ACESA apagada  apagada
P3   ACESA  apagada apagada apagada apagada
P4   apagada apagada apagada apagada apagada
```

E o `GUARDA` que `aba10.py` crava no mockup é, na ordem
`leds·triggers·rumble·speaker·mic`:

```
p1 {"leds","triggers","rumble","mic"}  →  1 1 1 0 1
p2 {"leds","rumble"}                   →  1 0 1 0 0
p3 {"leds"}                            →  1 0 0 0 0
p4 set()                               →  0 0 0 0 0
```

**As duas matrizes são idênticas, célula por célula.** O que aquela medição
fotografou foi o DESENHO — a coluna sem uma única pintura, não uma pintura
deslocada. As três hipóteses que a sprint deixou em aberto morrem com números:

| hipótese | medida |
| --- | --- |
| *"`guarda` traz mais linhas do que a mesa"* | não: `_linhas_da_guarda` itera a MESA, e a lista sai com `len(mesa) × 5` valores — 10 para dois controles, 5 para um. Há régua. |
| *"a ordem do documento inclui células fora das quatro linhas"* | não: **20 células no documento, 20 dentro do `<tbody>`**, nas duas páginas. Há régua. |
| *"o `escrever()` com vazio não apaga a classe `on`"* | não: `ligado('—')` é falso e o `classList.toggle` remove. Medido no DOM vivo. |

**E hoje a coluna pinta.** Lido do DOM, com o daemon dela vivo, um controle na
mesa e o perfil `Navegação` ativo (que guarda ZERO ajustes por controle):

```
P1 • Starlight Blue • USB   leds:apagada/visto | triggers:apagada/visto |
                            rumble:apagada/visto | speaker:apagada/visto |
                            mic:apagada/visto
—                           (as três linhas restantes, todas apagadas, todas visto)
conta: "0 de 1 controle com ajuste próprio neste perfil"
```

As vinte células com o **selo de visita** — o piloto esteve em todas. A coluna
concorda com o disco.

**A CAUSA DAQUELE INSTANTE NÃO FOI ISOLADA, e é honesto dizer:** entre aquela
medição e esta, a ONDA 0 refez o piloto (o alvo `classe` passou a vestir o
`data-hef-atributo`) e o `normalizar` deixou de descartar lista vazia. Não
tenho como afirmar qual delas — ou se foi um tique perdido na abertura da
página. **O que sobra é a régua**, e ela é o que faltava: nenhuma das duas
existentes media a DISTRIBUIÇÃO, e o defeito, se voltar, mora ali.

### 2. Uma das duas frases acusadas pelo enunciado estava certa

Ver [02], acima. A frase da linha de comando **é** a decisão do PO escrita, e o
enunciado a listava como fato errado. A do "Modo avançado" está errada só nesta
tela.

### 3. O seletor travado mostrava o "Jogo" do mockup

Achado ao olhar o DOM com o cadeado já aceso — não estava em fila nenhuma. Ver
[01].

### 4. Um dublê meu sujou quatro réguas dos vizinhos

`_emitido` troca `loader.load_all_profiles` por **atribuição crua**, copiando a
forma da régua vizinha — e copiei só metade do arranjo. A atribuição crua não se
desfaz: rodando este arquivo junto com os outros, o dublê vazava e derrubava
**quatro testes de outras réguas**, entre eles
`test_as_tres_cargas_de_perfil_disparam_a_semeadura`, que só pergunta se a carga
dispara a semeadura e recebia a minha lambda. A cura é registrar o nome com
`monkeypatch` na fixture autouse, para o pytest guardar o valor original e
devolvê-lo no teardown. **Só apareceu porque rodei a leva de vizinhos**; o meu
arquivo sozinho ficava verde.

---

## O que NÃO verifiquei

1. **A causa do instante em que T-04 foi medido.** Sei que a coluna mostrava o
   MOCKUP e que hoje ela pinta; **não sei o que mudou entre as duas leituras.**
   Duas candidatas plausíveis (o alvo `classe` vestindo o `data-hef-atributo`,
   e o `normalizar` deixando de descartar lista vazia) e uma terceira que não
   dá para descartar (um tique perdido na abertura da página). Não reproduzi o
   defeito, então não posso dizer que ele foi CURADO — só que ele não está lá
   agora, e que a régua que faltava existe.
2. **A tira de duas linhas com uma frase longa DE VERDADE.** A régua confere o
   CSS (altura, `line-clamp`, ausência de `nowrap`) e o DOM confirma `30px/2`,
   mas eu não fiz a carona da Steam emitir os 218 caracteres para ver as duas
   linhas ocupadas na foto. A frase é construída inline em
   `carona_do_wrapper.py` (não é constante), e forçá-la exigiria a bancada e a
   Steam dela.
3. **O hover.** Nenhum instrumento desta casa dispara `:hover` no WebKitGTK. Eu
   provei que a `.dica` **existe, recebe a frase certa e está dentro de um
   elemento visível**, e que a regra `\.trava:hover .dica{display:block}` está
   no CSS — mas ninguém passou o rato por cima. Se a frase não aparecer, é aí.
4. **A aba fotografada com DOIS controles na mesa.** A bancada tinha um só. As
   três linhas de lugar vazio nas fotos mostram `—` no lugar de
   `P3 • Desconectado`, que é a dívida do piloto declarada abaixo — e não uma
   regressão desta frente.
5. **A suíte inteira.** Rodei o meu escopo e a leva de vizinhos da aba (1324
   testes). A suíte em oito lotes é de quem coordena, e roda no fim.
6. **`install.sh`, o daemon e a bancada.** Nada aqui os toca. A bancada estava
   LIVRE e não foi reservada: esta frente não para o daemon, não escreve no
   aparelho e não chama `systemctl`. O daemon dela foi apenas LIDO
   (`state_full`), que é o que a pintura faz a cada tique.

---

## O que sobrou para o próximo

### [06] + o quadro Modo — NÃO COUBE, e a razão é de ESPAÇO, medida

A seção `mode` do perfil continua **inalcançável** pela interface:
`ProfileModeConfig`, `with_mode` e `mode_kind` dão **zero ocorrências** em
`src/hefesto_dualsense4unix/interface/`. As duas frases que a decisão [06] quer
colocar já existem prontas e puras no produto —
`profiles_actions.frase_do_radio_fragil_no_modo(kind, state)` e
`profiles_actions.texto_do_preco_da_mascara(flavor)` — e ninguém precisa
reescrevê-las.

**O que impede é a altura do editor, e ela está medida no Chrome, na bancada de
hoje:**

```
.campos           346px   (o bloco inteiro do editor)
usado             299px   (os cinco campos + a tabela por controle)
sobra              47px
um `.campo`        36px
.guarda           119px   (a tabela; o corpo dela mede 111px — quatro linhas
                           mais o cabeçalho, que é o piso)
```

Um quadro Modo pede, no mínimo, **dois `.campo` (72px)** — o `kind` e a máscara
— **mais a linha condicional do aviso do rádio (~15px)**: 87px contra 47px
livres. Os 40px que faltam sairiam da tabela por controle, **que já está no
piso**, e o CSS desta aba tem três comentários datados sobre o que acontece
quando ela cresce: a fileira `Duplicar · Voltar · Recarregar` sai pela borda do
quadro, que tem `overflow:hidden`, e **os três botões somem da tela**.

**Isso é escolha de desenho, e escolha de desenho com custo de pixel é dela.**
As saídas que eu vejo, para quem pegar:

1. o quadro Modo abre e fecha (`<input class="abre">`, a peça que a aba 08 já
   usa) — fechado não custa nada;
2. a tabela por controle vira uma seção que abre e fecha, liberando 119px;
3. o quadro Modo vira uma terceira coluna do `.perfis`, e aí o desenho inteiro
   muda de proporção.

**Nenhuma delas é minha para escolher**, e as três mudam o que ela vê.

### As outras linhas de MOTOR da sprint

* **Selecionar, ativar e salvar um perfil pela aba** — **JÁ ESTAVAM.**
  `selecionar` e `ativar` têm dono desde 01/09; os treze gestos desta aba estão
  ligados. O que NÃO existe é o "Salvar fundindo o rascunho": esta aba não tem
  Salvar próprio (o do rodapé grava o perfil ATIVO a partir do que está valendo
  no daemon, `rodape.py:114`, e nem olha para estes campos). Cada campo grava no
  ato, que é a decisão dela de 01/09 — *"clicar na cor já deveria aplicar a cor
  no controle"*. **A fusão do rascunho é sprint própria e mexe no rodapé, que
  não é desta posse.**
* **O campo Nome / renomear** — **JÁ ESTAVA**, desde 01/09 (`editor_nome`).
* **A lista suspensa com os jogos DESTA máquina** — **NÃO FEITA.** O produto já
  tem o catálogo (`integrations.jogos_locais.catalogo_de_jogos`, que o
  `_jogo_reconhecido` desta aba consome), então o motor existe. O que falta é
  desenho: trocar o `<input type=text>` por um `<input list=…>` com um
  `<datalist>` muda o que ela vê, e o desenho desta aba já foi ao limite hoje.

### O que pediu arquivo de outra posse — RELATE, não editei

1. **`profiles/simple_match.exigencia_invisivel` nomeia uma peça de INTERFACE.**
   A frase factual (*"este perfil também exige X"*) é do matcher; o caminho
   (*"Ligue o Modo avançado"*) é de cada tela. Enquanto as duas moram juntas,
   toda tela nova precisa da remenda que esta frente escreveu. **O conserto é
   partir a função em duas**, e ele toca `profiles/simple_match.py` e
   `app/actions/profiles_actions.py`.
2. **`hefesto_vivo.py` — o `<tbody>` da lista de perfis é reescrito a cada
   tique.** Já estava relatado (`_html_da_lista`) e continua de pé: o
   `escrever()` carimba `data-hef-visto` em todo elemento que visita, a
   serialização do DOM passa a ter 99 selos que a string do produto não tem, e
   `alvo.innerHTML !== html` nunca mais bate. O custo é o `:hover` da linha sob o
   mouse dela apagado duas vezes por segundo. **A cura é no piloto** (um
   `WeakSet` em JS, ou comparar sem o selo).
3. **`hefesto_vivo.py --prova-de-mockup` não roda nesta árvore.** Ele morre na
   primeira página com `ERRO DE CARGA: carregou OUTRA página: título ''` e sai
   sem medir nada, rc=0. Não é da minha posse e não investiguei; **uma régua
   que sai rc=0 sem medir é a forma de instrumento falso que esta casa mais
   paga.** As medições deste relatório foram feitas por um driver próprio, com
   o `ponte.perguntar` do piloto.
4. **`hefesto_vivo.escrever()` não sabe NÃO escrever num endereço vazio.** É a
   dívida que `a10_perfis` já declarava para `guarda.nome`: as linhas de lugar
   vazio recebem `''`, o piloto troca por `—`, e o
   `P3 • Desconectado` que ela pediu em 31/08 é apagado pelo travessão. Nesta
   aba isso está VISÍVEL nas fotos do produto (três linhas com `—`). O conserto
   é escolha entre dois donos e nenhum é este arquivo — está no relatório da
   frente da consistência desde 03/09, e continua aberto.

### As linhas do CSV que esta frente fecha — para a ONDA1-X lançar

**Não toquei `docs/data/paridade-gtk-html.csv`, e o portão `paridade-gtk-html`
está VERMELHO por isso — o vermelho é o combinado.** Ele acusa exatamente uma
linha, a 383, e a acusação está certa:

```
divida-fechada: paridade-gtk-html.csv:383  [10-perfis] "Exigência invisível": …
  o sinal '_sincronizar_exigencia_invisivel' APARECEU em
  src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py.
  O CSV diz FALTA_NO_HTML e o lado HTML passou a ter o símbolo.
```

**Uma ressalva sobre COMO ele notou, e ela importa:** o símbolo que a régua
procura (`_sincronizar_exigencia_invisivel`) aparece no meu arquivo dentro de um
COMENTÁRIO — eu cito o handler da GTK para explicar por que a frase está certa
lá e errada aqui. A dívida fechou de verdade (a frase chega à tela, e há foto),
mas quem for lançar a linha deve **medir o que o pacote emite**, e não confiar
no símbolo: uma menção em comentário é um sinal fraco, e este é o caso em que
ela acertou por sorte.

Estas são as linhas que o trabalho de hoje fecha ou muda de estado, com o
endereço novo lido no código:

| CSV | linha (o que ela nomeia) | hoje | estado | endereço novo |
| ---: | --- | --- | --- | --- |
| **376** | O perfil cuja regra a tela não sabe mostrar (a válvula do R-12) | DIFERENTE | **FECHA** | `editor.ambiente.travado` + `editor.ambiente.recado` (`aba10.marca_com_dica`, classe `.trava`) — **na bancada; o produto recebe quando ela publicar** |
| **383** | "Exigência invisível": o que o perfil exige e a página não mostra | FALTA_NO_HTML | **FECHA** | `editor.jogo.exige` + `editor.jogo.exigencia` (classe `.exige`) — **na bancada**. O pacote já emite hoje |
| **374** | Mostrar a prioridade (a barra e o número) | DIFERENTE | **FECHA** | o `title` de `editor.prioridade.dica` no desenho (`aba10.DICA_DA_PRIORIDADE`) — **na bancada** |
| **377** | O campo do jogo (o programa ou o número da Steam) | DIFERENTE | **FECHA** | `a10_perfis.editor_jogo` devolve `editor.jogo` corrigido — **vale hoje** |
| **356** | Ativar o perfil escolhido | DIFERENTE | **FECHA PELA METADE** | o gesto já existia; o que faltava era a tira caber. `.desfecho` em duas linhas — **na bancada** |
| **379** | A frase "jogo reconhecido" e o carimbo de ponte ao lado do campo | FALTA_NO_HTML | **FECHA PELA METADE** | o NOME do jogo já chega pela tira (`_jogo_reconhecido`, no desfecho). O **carimbo de ponte** continua sem lugar nenhum nesta interface — não foi feito |
| **375** | "Aplica a" / "Funciona em": os presets oferecidos | DIFERENTE | **MUDA** | a opção `—` desabilitada entrou no `<select>` (bancada). O produto passa a ter onde pousar o "não sei mostrar" |
| **381** | O editor avançado: window_class · título · nome do programa | FALTA_NO_HTML | **NÃO FECHA — e é decisão** | o PO escolheu *"a tela avisa e para por aí"*. A frase agora avisa; o editor avançado volta como sprint quando houver razão medida |
| **384** | A seção "Modo" do perfil | FALTA_NO_HTML | **NÃO FECHA** | não coube — a razão de espaço está medida acima |
| **385** | O preço da máscara (o que o Xbox custa) | FALTA_NO_HTML | **NÃO FECHA** | espera a 384 |
| **386** | O aviso de rádio frágil no Modo Nativo | FALTA_NO_HTML | **NÃO FECHA** | espera a 384 |
| **378** | A lista suspensa com os jogos DESTA máquina | FALTA_NO_HTML | **NÃO FECHA** | o catálogo existe (`jogos_locais`); falta o `<datalist>`, que é desenho |
| **370** | O Salvar funde o que as outras abas editaram (o rascunho) | FALTA_NO_HTML | **NÃO FECHA** | mexe no rodapé, que não é desta posse |

---

## Os portões

```
bash scripts/portoes.sh
REPROVOU: 1 vermelho(s) de 41 -> paridade-gtk-html
```

**QUARENTA VERDES DE 41, e o único vermelho é o combinado.**

| vermelho | de quem é | o que fazer |
| --- | --- | --- |
| `paridade-gtk-html` | **meu trabalho aparecendo** | a linha 383 do CSV fechou. **O CSV é da ONDA1-X**, e a tabela acima traz o endereço novo lido no código. Deixar o vermelho é o combinado |

**A primeira passada trouxe outros dois, e os dois eram meus:**

| vermelho | o que era | curado |
| --- | --- | --- |
| `ruff` | 4 `RUF002` (o sinal `×` em docstring) e 1 `SIM300` (condição Yoda) | sim |
| `acentuacao` | *"media"* na abertura do arquivo de régua — é o **imperfeito de medir**, não o feminino de "médio". Marcado com `(noqa-acento: verbo medir, imperfeito)`, o mesmo marcador que esta casa já usa para este verbo em outros lugares | sim |

---

## O estado da árvore

```
gerador:  python3 src/hefesto_dualsense4unix/interface/aba10.py
          10-perfis: OK, 35 divs · rótulo à esquerda com dois pontos,
          coluna de 86px, zero divisórias no editor · Perfis Salvos e
          Definições · 2 lugar(es) Desconectado

réguas:   tests/unit/test_a_aba_10_perfis_fecha_as_linhas.py   21 passed
vizinhos: 1324 passed, 6 xfailed

publicado: src/hefesto_dualsense4unix/interface/paginas/10-perfis.html
           INTOCADO — o desenho novo espera o `--publicar` dela, e a
           divergência está declarada em `mockup/DIVERGENCIAS.md`.
```
