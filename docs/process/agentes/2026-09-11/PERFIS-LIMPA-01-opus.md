# PERFIS-LIMPA-01 — a lupa, os dois ícones e a coluna que ela arrasta

**Árvore:** `hefesto-voo/PERFIS-LIMPA-01-opus` · branch `voo/PERFIS-LIMPA-01-opus`,
nascida de `onda/0911b` (`faa3ec2e`, conferido).
**Portões:** `bash scripts/portoes.sh` (a lista inteira, não o `--rapido`) —
**TODOS VERDES, 56 portões**, com `HEFESTO_SEM_CANARIO_FS=1` por ordem de quem
despachou (a GUI viva dela escreve em `~/.config` enquanto a medição corre, e o
canário lê isso como vermelho).
**Bancada:** LIVRE e **não reservada** — nenhum passo desta sprint parou o daemon,
escreveu no aparelho ou chamou `systemctl`. `bancada: false` no frontmatter, e foi
o caso.

## O que mudou

As cinco seções da sprint estão feitas, a aba está **publicada** (`--publicar 10`),
e a geometria da tabela saiu **idêntica** à de ontem — 255 · 86 · 403 na esquerda,
347 · 255 · 118 na direita, medidas nas duas páginas com o mesmo instrumento.

### §1 · A lupa, e ela procura o que ela disse

Um `<svg>` de lupa no rótulo `Perfis Salvos`. Clicar abre um campo de 150px na
mesma linha; digitar encurta a lista; fechar limpa o termo e devolve as linhas.

**O que casa:** as três células da linha (`Nome`, `Priorização`, `Quando usar`) e
o `title` da linha, que é a disputa. Sem acento e sem caixa — `acao` acha `Ação`,
`MORTAL` acha `Mortal Kombat`, `1245620` acha o perfil da Steam pelo appid.

**O normalizador é o desta casa e não um segundo:** `profiles.slug.slugify`, o
mesmo que decide o nome do `.json` de cada perfil dela. Ele levanta em vez de
devolver vazio (`slugify("—")` é `ValueError`), e a guarda está escrita: um termo
sem letra nenhuma não filtra nada.

**Nenhum `.json` é aberto por tecla.** O que a busca alcança é o que a linha
MOSTRA — e o que isso deixa de fora está na §8, para ela decidir.

### §2 · A ordenação por duplo clique

Duplo clique no `<th>` ordena por aquela coluna; o seguinte inverte; o terceiro
DESLIGA e devolve a ordem do produto (o perfil que está valendo em primeiro). O
terceiro estado não estava na sprint e é meu: sem ele, quem ordenou uma vez fica
ordenado para sempre — não há gesto que desfaça.

`Priorização` ordena como NÚMERO: `9` antes de `85` antes de `90`. Ordenar como
texto é o defeito clássico, e seria o primeiro que ela veria, porque é a coluna
com os números mais parecidos.

**A trava do duplo clique é uma linha de CSS, e ela é a §7.4 inteira:** a seta do
cabeçalho é quem carrega `data-hef-gesto="ordenar"`, e ela é
`pointer-events:none`. Mouse nenhum a alcança; quem a aciona é o roteiro, no
`dblclick`, por `.click()`. Sem essa linha o ouvinte do piloto despacharia no
PRIMEIRO clique — a um pixel da célula do nome, que é o gesto `selecionar` e troca
o perfil aberto no editor. **Medido com o clique simples no centro do `<th>`: zero
gestos `ordenar`.**

### §3 · Os dois botões viram ícone, cada um no seu canto

| o que era | virou | onde |
| --- | --- | --- |
| `Recarregar` | ⟳ clicável | rótulo `Perfis Salvos`, junto da lupa |
| `Voltar à de ontem` | ↺ clicável | rótulo `Definições` — o outro canto |
| `Duplicar` | continua botão | sozinho no rodapé da direita |

Os dois gestos mantêm o nome (`recarregar`, `voltar-a-de-ontem`) e a dica, palavra
por palavra. O desenho tem 11px (o mesmo do `CADEADO`, que era o único ícone desta
aba); o ALVO do clique tem **24×24**, com margem negativa vertical para caber na
linha de 15px do `.sec-rot` sem empurrar nada.

### §4 · «Ajuste próprio» virou «Status», e SÓ o nome

Um lugar: o `<th class="gd-pecas">`. O `title` daquele `<th>` fica como está — é
ele que explica o que os ícones acesos querem dizer.

**A prosa NÃO foi junto**, e há régua cobrando: o contador do cabeçalho continua
dizendo *"3 de 4 controles com ajuste próprio neste perfil"*. A frase morre se ela
for: *"3 de 4 controles com status neste perfil"* não quer dizer nada.

**As dez ocorrências de «ajuste próprio» triadas uma a uma** (`grep -rn` em
`tests/` e `src/`): **UMA** era RÓTULO de coluna (`aba10.py:1468`, trocada); as
outras são PROSA (o contador, as quatro linhas da legenda, as docstrings) ou
RÉGUA que cita a coluna pelo nome conceitual em mensagem de erro. **Nenhuma régua
desta casa digitava o texto do `<th>` para compará-lo com a página** — conferido
com `grep` das quatro formas literais. A que quebrou foi outra, e está abaixo.

### §5 · A largura da coluna, arrastada e lembrada

`<colgroup>` nas DUAS tabelas, alça de 9px na divisa de cada `<th>` (menos a
última coluna, que não tem o que redistribuir), `cursor:col-resize`, piso de 48px
e teto de 900px.

**A armadilha do `table-layout` estava medida e é real:** com `auto`, `width` é
sugestão — o próprio arquivo registrava que `.tab .pri` dizia 46px e o Chrome
media 86. **A saída escolhida é `table-layout:fixed` mais `<colgroup>`**, e o
preço está declarado no CSS: o texto mais largo que a coluna não a estica mais, e
por isso as células ganharam reticência. **É isso que torna o arraste útil** — ela
alarga a coluna para ler o nome inteiro do jogo, em vez de a coluna decidir por
ela.

**O que a troca custou, e foi pago no mesmo dia:** com `fixed`, os `width` que
eram sugestão viraram ordem, e dois deles estavam ERRADOS. A coluna do `Status`
media 255px na tela e dizia `150px` no CSS — a fileira de glifos era **cortada**,
fotografada. O `ID da peça` media 118 e dizia 112 — o endereço de rádio saía com
reticências. Os dois números passaram a ser os medidos.

**Onde a lembrança mora:** `app/gui_prefs.py` →
`~/.config/hefesto-dualsense4unix/gui_preferences.json`, chave `tabelas` → tabela
→ `{larguras, ordem}`. **Uma chave, um dicionário**, como a §5 pede. Não é o
`maquina.json`, e a razão já estava escrita por quem separou os dois:
*"o arquivo da janela é da JANELA"* (`utils/maquina.py`, a nota de
`ordens_dispensadas`) — largura de coluna não afirma nada sobre a mesa, o rádio ou
o aparelho.

**A ordem viaja junto da largura**, com o preço declarado: ela pediu memória para
a largura, não para a ordem. É a mesma chave e o mesmo gesto, e uma tabela que
lembra a largura e esquece a ordem lembra pela metade. Se ela recusar, some a
chave `ordem` e nada mais.

### §6 · Onde o roteiro vive — e a linha da sprint que CAIU

**O WebKit executa `<script>` de página. Medido, não suposto**, e é a medição que
a §6 exigia antes de construir em cima: `WebKit2.WebView` montado como o piloto o
monta (`gui.ponte_da_tela.PonteDaTela`), página vinda de `file://`:

```
{"marca":"RODOU","quando":"loading","canal":true}
```

O `quando` importa: o roteiro corre com `readyState` em `loading`, ou seja **antes**
do `LoadEvent.FINISHED` em que o piloto instala o `BOOTSTRAP`. Por isso ele não
pode contar com o `window.__hef` — quando ele corre, o piloto ainda não chegou.

**A rota (c) da sprint é a que ficou**, e não tocou em arquivo de dono nenhum: o
`<script>` sai no `miolo` que a própria `aba10.py` emite, e `monta.py` o insere
verbatim.

#### A LINHA QUE CAIU, e ela é a §6 em uma frase

> *"As três coisas novas — filtrar, ordenar, arrastar — são comportamento de DOM"*

**São DUAS.** Medido no piloto: o pacote emite a lista por **duas portas ao mesmo
tempo** — o `blocos` (o `<tbody>` pronto) e as três listas `perfis.linha.*`, que o
pintor distribui pelos elementos de mesmo endereço **na ordem do DOCUMENTO**
(`hefesto_vivo`, `alvos.forEach`). Reordenar as `<tr>` no DOM não move as listas:
no tique seguinte o nome do primeiro perfil é escrito na primeira linha da TELA,
que já é outra — **nomes de um perfil com o realce (`ativo`, `aria-selected`) de
outro**, em silêncio, 100 ms depois. É a mesma família da armadilha que a §6
descreve, e é pior: não deixa buraco, deixa mentira.

**Esconder, ao contrário, é seguro:** uma `<tr>` oculta não sai do lugar do
documento, e a distribuição por posição continua certa.

**Então filtrar e ordenar moram no PYTHON**, uma linha acima de onde a lista vira
tela (`lista = _ordenada(_filtrada(...))`). As duas portas saem da MESMA lista e
não podem discordar. **Arrastar continua sendo de DOM**, e é a única das três que
é: a largura vive no `<colgroup>`, que o `blocos` desta aba não toca.

**E é por isso que o roteiro não precisa de reaplicador.** A armadilha da §6 — *"o
BOOTSTRAP repinta a tbody"* — alcança duas das três, e as duas saíram do DOM. Foi
medida mesmo assim, no tempo, e está abaixo.

## Qual mordida prova

### As três que a §7.4 cobra, com a cura arrancada e a saída colada

**1 · A gravação da largura arrancada** (`save_gui_prefs` desligada em
`guardar_largura_de_coluna`):

```
tests/unit/test_a_aba10_a_lupa_a_ordem_e_a_largura.py:184: AssertionError
FAILED ...::test_a_largura_volta_depois_de_fechar_e_reabrir
1 failed, 14 passed
```

Quem reprovou foi a régua de VERDADE, não a mordida — o que é melhor: ela lê o
disco, e não uma memória de processo.

**2 · `Ajuste próprio` devolvido ao `<th>`:**

```
ERRO em 10-perfis — decisão dela desfeita:
  - o rótulo da coluna não é `Status`: 'Ajuste próprio'. Ela mandou trocar o
    nome em 11/09/2026, e SÓ o nome
```

**3 · O duplo clique virando clique simples** (`pointer-events:none` arrancado):

```
ERRO em 10-perfis — decisão dela desfeita:
  - a seta da ordem perdeu o `pointer-events:none` — ela carrega o gesto
    `ordenar`, e sem esta linha um clique SIMPLES no cabeçalho passa a ordenar.
    Ela pediu DUPLO clique, e a razão está na regra: o cabeçalho é `sticky` a um
    pixel da célula que troca o perfil aberto no editor
```

**Com as três curas devolvidas:**

```
10-perfis: OK, 35 divs · rótulo à esquerda com dois pontos, coluna de 86px…
15 passed
```

### A QUARTA, que a sprint não pediu e a medição exigiu

**As duas portas têm de dizer a mesma coisa.** Arrancada a linha
`lista = _ordenada(_filtrada(...))` — ou seja, com o filtro e a ordem aplicados
só a UMA das duas portas:

```
At index 0 diff: 'Zelda' != 'Ação'
FAILED ...::test_o_blocos_e_as_tres_listas_saem_da_mesma_lista
1 failed, 15 passed
```

É a régua que fecha a porta por onde a §6 voltaria: alguém filtrar ou ordenar
**depois** de as três listas serem montadas.

### O CLIQUE — os cinco, no WebKit da janela dela, com o BOOTSTRAP instalado

`Gtk.OffscreenWindow` num Xvfb próprio; **nenhuma janela na tela dela**.

| passo | o que a tela respondeu |
| --- | --- |
| de partida | `campo_aberto:false · largura_nome:255 · px_da_alça:"255"` |
| **a lupa** | `campo_aberto:true · largura_do_campo:150 · tem_foco:true` |
| digitar `mortal` | gesto `procurar` pela QUARTA porta, `valor:"mortal"`, `vivo:"1"` |
| **duplo clique nas três** | três gestos `ordenar`, com `coluna` = `nome` · `prioridade` · `quando` |
| **clique SIMPLES no cabeçalho** | **zero gestos** — a trava do `pointer-events:none` |
| **arrastar +60px** | `largura_nome:315 · col.style.width:"315px" · data-px:"315"`, e o gesto chegou com `tabela:"10-perfis.lista" coluna:"nome" px:"315"` |
| **o ⟳ e o ↺** | gestos `recarregar` e `voltar-a-de-ontem` — os nomes de quando eram botões |
| fechar a lupa | `termo:"" · campo_aberto:false`, e o gesto `procurar` com `valor:""` |

**Gestos que chegaram à ponte, e só eles:** 3× `ordenar`, 2× `procurar`,
1× `largura-da-coluna`, 1× `recarregar`, 1× `voltar-a-de-ontem`.

### A RÉGUA QUE VIVE NO TEMPO — a armadilha da §6, medida

Depois de **três** `window.__hef.pintar({blocos: …})` que reescreveram o `<tbody>`
inteiro (14 linhas viraram 1, nome trocado):

```
{"linhas_agora":1,"primeiro_nome":"Zelda",
 "largura_nome":315,"campo_aberto":true,"termo":"mortal"}
```

A lista foi repintada de verdade (`primeiro_nome` mudou), e a largura, o campo
aberto e o termo digitado **sobreviveram**. E a largura que volta do DISCO
(`data-larguras: "nome:180·prioridade:120"`, escrito pelo pintor no atributo)
chegou aos `<col>`: `largura_nome:180 · largura_pri:120`.

### A FOTO

`ANTES` (a página publicada de ontem) e `DEPOIS` (a bancada), as duas com
`olhar.py`, headless, **sem janela na tela dela**. As duas estão na saída desta
sessão; o que mudou é exatamente o que ela pediu, e nada mais: a lupa e o ⟳ ao
lado de `Perfis Salvos`, o ↺ ao lado de `Definições`, `Status` no cabeçalho, e a
fileira de três botões virando um.

### A ALTURA DO BLOCO — e ela NÃO caiu

A §3 mandou medir e mandou dizer se não caísse. **Não caiu:**

| | antes | depois |
| --- | --- | --- |
| `.quadro` | **530px** | **530px** |
| `.quadro-corpo` | 500px | 500px |
| a fileira de botões | 46px | 46px |
| o rótulo `.sec-rot` | 15px | 15px |
| a tabela `.guarda` | 156px | 156px |

**A razão é estrutural, e ela derruba a expectativa da §3:** o `.quadro` desta aba
é `estica` — ele preenche a página até o rodapé, e por isso nunca dependeu do
número de botões. Tirar dois botões de uma fileira de três não encolhe a fileira;
e a fileira continua lá, porque o `Duplicar` ficou.

**O que a ordem dela comprou foi o outro lado da mesma frase, e esse eu medi:** os
dois ícones entraram em linhas que **já existiam** sem acrescentar **um pixel** —
o `.sec-rot` mede 15px antes e depois. A limpeza é de densidade, não de altura.

## O que NÃO verifiquei

- **Nada foi medido no APARELHO.** Esta sprint é `bancada: false` e não toca
  transporte, report, canal nem célula do mapa. **Não exercitei uma linha sequer
  de `docs/data/mapa-controles.csv`** — não há `chave` a relatar, e inventar uma
  seria medição falsa;
- **o daemon nunca foi chamado.** Os gestos `recarregar` e `voltar-a-de-ontem`
  foram provados até a PONTE (o clique no invólucro novo chega com o nome certo);
  o que eles fazem do outro lado é o mesmo de antes e não foi reexercido. Os dois
  já têm régua própria (`test_o_recarregar_da_aba_perfis_tem_dono`,
  `test_aba10_os_cinco_gestos_calados_passaram_a_falar`);
- **a suíte inteira não rodou** — ela é de quem coordena, e roda no fim. Rodei os
  portões (o comando inteiro, sem `--rapido`) e o meu escopo;
- **o arraste com o MOUSE de verdade dela** não foi feito: o que dirigi foram
  `MouseEvent` sintéticos no WebKit. O que isso NÃO prova é a ergonomia — se a
  faixa de 9px é fácil de achar com a mão dela. É pergunta de olho, não de régua;
- **um nome de jogo muito longo** não foi fotografado dentro da coluna estreita.
  Medi que a reticência existe no CSS e que a coluna não estica; **não vi** como a
  linha inteira fica com um nome de 80 caracteres;
- **o `--prova-de-mockup` e o `--prova-no-aparelho` não rodaram.** Os dois abrem
  as dez abas e falam com o daemon; nenhum é desta sprint;
- **a ordem e a largura numa SEGUNDA janela** (duas instâncias ao mesmo tempo) não
  foi medida. O `gui_preferences.json` é lido a cada chamada, mas a última
  gravação vence, e ninguém mede isso hoje.

## O que sobrou para o próximo

1. **A FOTO É DELA, e há duas coisas específicas** (a §8 da sprint):
   - **o canto do `Voltar à de ontem`.** Ela disse *"outro canto"* e eu escolhi o
     rótulo `Definições`. Está na foto;
   - **a busca casando só o que a linha MOSTRA.** A medição diz o que fica de
     fora, com exemplo: **o `Estilo de Jogo` não é procurável.** Um perfil cujo
     estilo é `Luta` não aparece ao digitar `luta`, a menos que a palavra esteja
     no nome ou no `Quando usar`. O mesmo vale para a máscara, a cor e o que mais
     o `.json` guarde. Alcançá-los custa abrir 33 arquivos por tecla — e a sprint
     já tinha medido esse preço. **Se ela quiser, o caminho barato existe e não é
     o da sprint:** o pacote já lê os 33 perfis a cada tique para montar a lista;
     dá para acrescentar um campo oculto de busca por linha **sem uma leitura a
     mais**. É decisão dela, não minha.
2. **A régua que quebrou, e ela é da família que esta casa nomeia.** O
   `_conferir` cobrava `class="pri">Priorização<` — a colagem do atributo com o
   texto. No dia em que o `<th>` ganhou `data-coluna` e `title`, ela passou a
   acusar abreviação sobre uma palavra que continuava inteira na tela. *A régua
   digitava o que devia LER.* Curada: ela lê o `<th>` da coluna e compara o texto.
   **Vale procurar as irmãs** — `grep -n 'class="[a-z-]*">[A-Z]' src/…/aba*.py` nas
   outras nove.
3. **`data-papel` é atributo de ENDEREÇO do piloto, e não de papel qualquer.** A
   primeira versão da lupa usava `data-papel="abrir-a-lupa"` para um botão que só
   faz `classList.toggle`. Medido com o `BOOTSTRAP` instalado: cada clique chegava
   ao Python como gesto sem dono e imprimia no stdout de quem lançou a janela — o
   mesmo defeito que o `recarregar` levou até 31/08 para perder. A cura é a classe
   `.lupa`. **A lição vale para toda aba:** `data-papel`, `data-gesto`, `data-v`,
   `data-modo`, `data-rota`, `data-mudo`, `data-player`, `data-forca`,
   `data-sensor` e `data-mic-modo` são a placa da porta do piloto — quem os usa
   para outra coisa manda um gesto que ninguém atende.
4. **O `<colgroup>` abriu uma porta que as outras nove abas podem usar.** A
   largura arrastável é genérica: `table[data-tabela]` + `<col data-coluna>` +
   `.puxador` + duas funções do roteiro. A aba 08 (adaptadores) e a 07
   (lançadores) têm tabelas com a mesma queixa em potencial. **O roteiro mora na
   `aba10.py` de propósito** (as outras duas casas eram de outros donos nesta
   leva); no dia em que duas abas quiserem, ele pede a casa (b) — um `js_extra` no
   `monta()`, simétrico ao `css_extra`.
5. **O `_PROCURA` é estado de MÓDULO, e o pacote é um só para a janela inteira.**
   Não vi problema hoje (uma janela por vez), mas é a mesma forma do `_ESCOLHIDO`,
   e quem abrir duas janelas verá as duas compartilharem o termo da busca.
6. **A ordem lembrada pode surpreender na primeira abertura depois desta leva.**
   Quem nunca deu duplo clique não vê diferença (a chave nasce vazia e a lista sai
   como o produto a monta), mas quem ordenar uma vez encontra a aba ordenada no
   dia seguinte. É o que a §5 pediu; está dito aqui porque é mudança de
   comportamento que nenhuma tela anuncia.
