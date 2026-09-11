---
sprint: PERFIS-LIMPA-01
estado: feita
onda: A-LISTA-DE-0911B
posse:
  PERFIS-LIMPA-01:
    - src/hefesto_dualsense4unix/interface/aba10.py
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - src/hefesto_dualsense4unix/app/gui_prefs.py
    - mockup/10-perfis.html
    - src/hefesto_dualsense4unix/interface/paginas/10-perfis.html
cria: []
bancada: false
depois_de: []
nao_toca:
  # AS TRÊS SÃO DE OUTROS DONOS NESTA MESMA LEVA, e a colisão foi MEDIDA:
  #   monta.py        -> VAO-DO-ESQUELETO-01
  #   hefesto_vivo.py -> MIC-SEM-FONTE-01
  #   topo.html       -> VAO-DO-ESQUELETO-01
  # É isso que decide a §6: o roteiro vai no `miolo` que a própria aba 10 emite.
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/topo.html
  - src/hefesto_dualsense4unix/interface/aba04.py
  - docs/data/mapa-controles.csv
---

# PERFIS-LIMPA-01 — a lupa, os dois ícones e a coluna que ela arrasta

> **ESTADO 2026-09-11: feita** — as cinco seções entregues e a aba **publicada**
> (`--publicar 10`): a lupa procura nome, prioridade, jogo e disputa (sem acento,
> sem caixa, pelo normalizador desta casa), o duplo clique ordena as três colunas
> em ciclo de três estados, o ⟳ foi para `Perfis Salvos` e o ↺ para `Definições`
> com o gesto e a dica intactos, «Ajuste próprio» virou «Status» só no `<th>`, e
> as duas tabelas ganharam `<colgroup>` com largura arrastável lembrada em
> `gui_preferences.json`. **A §6 caiu pela metade, por medição:** o WebKit executa
> `<script>` de página (medido), mas *ordenar* não pode ser de DOM — o pintor
> distribui as três colunas pela ordem do DOCUMENTO, e reordenar as `<tr>` põe o
> nome de um perfil na linha de outro no tique seguinte. Filtrar e ordenar moram
> no pacote; só arrastar ficou no roteiro. A entrega está em
> `docs/process/agentes/2026-09-11/PERFIS-LIMPA-01-opus.md`.

> **ORDEM DELA, 11/09/2026:**
> *"Na tabela do perfil tem que terum svg dde lupa no titulo da tabela. Temos*  <!-- noqa-acento: citação literal dela -->
> *que remover esse botão voltar a de ontem ??? e o botão recarregar vira um*  <!-- noqa-acento: citação literal dela -->
> *svg clicável ao lado de Perfis Salvos que irá fazer essa função. Temos que*  <!-- noqa-acento: citação literal dela -->
> *deixar o layout mais limpo.. Aonde tá escrito Ajustes Próprios Vira Status e*  <!-- noqa-acento: citação literal dela -->
> *essa tabela abaixo dele tem a largura configurável pelo user (quando o*  <!-- noqa-acento: citação literal dela -->
> *cursor muda e permite alterar a largura da coluna) e isso passa a ser*  <!-- noqa-acento: citação literal dela -->
> *lembrado no futuro."*  <!-- noqa-acento: citação literal dela -->

**É UMA SPRINT SÓ PARA CINCO ITENS, e a razão é de posse, não de gosto:** os
cinco mexem no mesmo `interface/aba10.py`. Dois agentes no mesmo arquivo é
conflito garantido, e serializá-los em `depois_de` faria o segundo reler tudo o
que o primeiro acabou de aprender. **Um agente, cinco seções.**

**O QUE ELA RESPONDEU DEPOIS, e cada resposta fecha uma pergunta:**

| a pergunta | a resposta dela, verbatim |
| --- | --- |
| o `Voltar à de ontem` sai? | *"Se virar icone svg tem que arrumar outro canto pra deixar ele ao invés de botão como os demais."* <!-- noqa-acento: citação literal dela --> |
| a lupa procura o quê? | *"Procura nome de perfil, e demais configs dos perfis, a ideia é acharmos rápido o nome de um jogo e essa tabela precisa permitir que eu escolha a ordenação dando duplo clique no nome das colunas."* <!-- noqa-acento: citação literal dela --> |
| `Status` muda o que a coluna mostra? | **Só o nome muda.** |

**ELE NÃO SAI — ela converteu a remoção em mudança de lugar.** O «???» da
ordem era dúvida, e a medição que a respondeu é esta: `a10_perfis.py:1854`,
`voltar_a_de_ontem` → `restaurar_do_historico`, **o único desfazer da aba** —
cada gravação já guarda a anterior, e nenhuma outra tela oferece isso
(`aba10.py:1579`). Tirá-lo custava um Salvar errado sem volta pela tela.

---

## §0 — O QUE A TELA É HOJE, medido

O bloco `Perfis` tem duas molduras lado a lado (`aba10.py:1310-1490`):

| | rótulo (`.sec-rot`) | a tabela | os botões do rodapé |
| --- | --- | --- | --- |
| **esquerda** | `Perfis Salvos` (`:1314`) | `.tab` — `Nome · Priorização · Quando usar`, `tbody[data-hef="perfis.lista"]` | `Ativar · Novo · Remover` (`:1327-1329`) |
| **direita** | `Definições` (`:1354`) | `.tab.miuda` dentro de `.guarda` — `Controle · Ajuste próprio · ID da peça` (`:1467-1469`) | `Duplicar · Voltar à de ontem · Recarregar` (`:1479-1481`) |

**E O QUE AS PÁGINAS DESTA CASA TÊM DE SCRIPT: ZERO.** Medido —
`grep -c "<script" interface/topo.html` devolve **0**, e nenhuma das dez abas
emite um. Todo comportamento de DOM vem do `BOOTSTRAP` do piloto
(`interface/hefesto_vivo.py:314`), instalado por `run_javascript` em cada
página (`:2961`). **As §2 e §5 dependem disso, e a decisão de ONDE pôr o
roteiro é a maior desta sprint — está na §6.**

## §1 — A LUPA, e ela procura o que ela disse

**Onde:** no rótulo da moldura da ESQUERDA, junto de `Perfis Salvos`
(`aba10.py:1314`), que é o título da tabela dos perfis.

**O que faz:** clicar abre um campo de texto na mesma linha; digitar esconde
da `tbody[data-hef="perfis.lista"]` toda linha que não casar. Esvaziar o campo
ou clicar a lupa de novo devolve as 27 linhas.

**O que casa, e é a frase dela — *"nome de perfil, e demais configs dos
perfis… achar rápido o nome de um jogo"*:**

1. **as três células da linha** — `Nome`, `Priorização`, `Quando usar`. O
   `Quando usar` é onde o nome do jogo mora, e é o alvo declarado dela;
2. **o `title` da linha**, quando houver (é a disputa — `linha_do_perfil`,
   `aba10.py:1229`);
3. **sem acento e sem caixa**: procurar `mortal` tem de achar `Mortal Kombat 1`,
   e procurar `acao` tem de achar `Ação`. A casa já tem normalizador — **ache-o
   antes de escrever outro**; um segundo normalizador é a segunda verdade que
   esta casa persegue.

**O QUE NÃO FAZER, e é onde «demais configs» vira armadilha:** não abra os JSON
dos perfis para procurar dentro deles a cada tecla. A lista da tela já carrega
o que a linha mostra; se a sua medição disser que casar só o visível deixa de
achar algo que ela procuraria (o `Estilo de Jogo`, por exemplo), **diga no
relatório com o exemplo** e deixe a decisão para ela. Uma busca que lê 27
arquivos por tecla é uma tela que trava.

**SEM CAMPO NA TELA ATÉ ELA CLICAR.** A lupa é um ícone; o campo nasce do
clique. É isso que cumpre o *"layout mais limpo"* — um campo de busca sempre
visível acrescenta uma linha ao bloco em vez de tirar.

## §2 — A ORDENAÇÃO POR DUPLO CLIQUE, e é ordem dela

> *"essa tabela precisa permitir que eu escolha a ordenação dando duplo clique*  <!-- noqa-acento: citação literal dela -->
> *no nome das colunas."*  <!-- noqa-acento: citação literal dela -->

**Duplo clique** — não clique simples — no `<th>` ordena a tabela por aquela
coluna; o duplo clique seguinte inverte. A coluna ordenada diz qual é e para
onde, sem texto novo: uma seta no `<th>`, do tamanho do ícone.

**POR QUE O DUPLO CLIQUE IMPORTA AQUI, e não é preciosismo:** o `<th>` da
esquerda é `position:sticky` (`aba10.py:307`) e a célula do nome já é o
endereço de um gesto — o clique simples nesta aba **troca o perfil aberto no
editor** (`linha_do_perfil`, a razão está na docstring). Um ordenador por
clique simples no cabeçalho vive a um pixel de um gesto que muda o editor
dela. Ela pediu duplo clique; ela tem razão, e agora está escrito por quê.

**As três colunas ordenam:** `Nome` (alfabética, sem acento e sem caixa),
`Priorização` (numérica — é número, não texto: `90` vem depois de `9`, e
ordenar como texto é o defeito clássico) e `Quando usar` (alfabética).

## §3 — OS DOIS BOTÕES VIRAM ÍCONE, e cada um no seu canto

**A ordem dela tem duas metades, e a segunda é a que decide o desenho:** o
`Recarregar` vai *"ao lado de Perfis Salvos"*; o `Voltar à de ontem`, se virar
ícone, *"tem que arrumar outro canto… ao invés de botão como os demais"*.

| o que era | vira | onde |
| --- | --- | --- |
| `Recarregar` (`:1481`) | ⟳ clicável | no rótulo `Perfis Salvos`, **junto da lupa** — ele relê a LISTA, e a lista é a tabela da esquerda |
| `Voltar à de ontem` (`:1480`) | ↺ clicável | no rótulo `Definições` (`:1354`) — o outro canto. Ele desfaz o PERFIL ABERTO, e é esse o bloco que o mostra |
| `Duplicar` (`:1479`) | fica botão | sozinho no rodapé da direita |

**Isto é o que faz o layout ficar mais limpo, e o número é seu de medir:** a
fileira de três botões da direita vira um botão só, e dois ícones entram em
linhas que já existem, sem acrescentar altura nenhuma. **Meça a altura do
bloco antes e depois** — se ela não cair, diga; a ordem dela era de limpeza, e
limpeza que não se mede não aconteceu.

**O QUE NÃO PODE MUDAR, e há régua:**

- **o nome dos gestos.** `data-hef-gesto="recarregar"` e
  `data-hef-gesto="voltar-a-de-ontem"` continuam iguais, no elemento novo. O
  `a10_perfis.py:3424` lista os dez gestos da aba e há régua que os cobra;
  `recarregar` levou até 31/08 para ganhar dono (`:3312`) e não vai perdê-lo
  agora por troca de invólucro.
- **a dica.** Os dois `title` de hoje vão junto para o ícone, palavra por
  palavra. *"Relê a lista do disco. Não descarta o que está no editor ao
  lado."* e *"Desfaz um perfil salvo por engano: cada gravação já guarda a
  anterior."* — **um ícone sem dica é uma função que ninguém acha.** É o custo
  inteiro de trocar palavra por desenho, e ele se paga assim.
- **o alvo do clique tem tamanho.** Um `<svg>` de 11px é o desenho, não a área
  clicável. Dê ao ícone um alvo de ao menos 24×24 — ela clica isto com o mouse,
  e a aba já tem o `CADEADO` de 11px (`:900`) como referência de tamanho de
  DESENHO, não de alvo.

## §4 — «Ajuste próprio» vira «Status», e SÓ o nome muda

**Palavra dela: «Só o nome muda».** A coluna continua mostrando os mesmos
ícones do que cada controle tem de próprio neste perfil.

**Um lugar:** `aba10.py:1468`, o `<th class="gd-pecas">`. O `title` daquele
`<th>` **fica como está** — é ele que explica o que os ícones acesos querem
dizer, e encurtar o rótulo só funciona porque a explicação tem outro dono.

**E AQUI ESTÁ A ARMADILHA, que é de PROSA e esta casa já pagou:** a palavra
«ajuste próprio» aparece em mais nove lugares desta aba — o contador
(`:1294`, *"3 de 4 controles com ajuste próprio neste perfil"*), a legenda
(`:1525`, `:1552`, `:1576`, `:1591`) e duas réguas (`:1787`, `:1801`).
**Essas NÃO viram «Status»**, e a razão é que a frase morre: *"3 de 4
controles com status neste perfil"* não quer dizer nada. O rótulo da coluna é
o nome curto da coisa; a prosa continua nomeando a coisa.

**O que TEM de andar junto:** toda régua que digita o texto do `<th>` para
compará-lo com a página. Levante-as (`grep -rn "Ajuste próprio" tests/ src/`)
e separe, uma a uma, **rótulo de coluna** de **prosa que explica** — é
exatamente a separação que a §3 da `O-RAIO-DA-RETIRADA-01` cobra: para cada
ocorrência, diga se é RÓTULO, se é PROSA ou se é RÉGUA.

## §5 — A LARGURA DA COLUNA, arrastada por ela e lembrada

> *"tem a largura configurável pelo user (quando o cursor muda e permite*  <!-- noqa-acento: citação literal dela -->
> *alterar a largura da coluna) e isso passa a ser lembrado no futuro"*  <!-- noqa-acento: citação literal dela -->

**AS DUAS TABELAS, e a decisão é minha com a razão escrita:** a frase dela
pende da tabela da direita (a do `Status`), mas o mecanismo é o mesmo código
para as duas, e é na tabela da ESQUERDA — 27 linhas, três colunas, `Quando
usar` cheio de nome de jogo — que arrastar tem valor real. **Dar a uma e não à
outra é a cura pela metade que esta casa nomeia:** ela vai arrastar a que
alcançar primeiro. Vale para as duas `table.tab` da aba 10.

**O gesto, como ela descreveu:** o cursor vira `col-resize` na divisa entre
dois `<th>`; arrastar muda a largura; soltar grava.

**A ARMADILHA MEDIDA, e ela já está escrita no arquivo:** `aba10.py:381`
registra que o `table-layout` desta tabela é **`auto`** — *"então `width` é
sugestão"*. Largura arrastada sobre `table-layout:auto` é largura que o
navegador reescreve sozinho no próximo repinte. **Meça antes de escolher a
saída**, e diga qual: `table-layout:fixed` com larguras explícitas, ou
`<colgroup>`. As duas mudam como a tabela se comporta quando o texto é maior
que a coluna — fotografe o antes e o depois com um nome de jogo longo dentro.

**E HÁ UM PISO.** Uma coluna arrastada a 3px some e não volta — ela não tem
onde pegar de novo. Piso por coluna, medido, e diga qual e por quê.

**ONDE A LEMBRANÇA MORA — e isto não é decisão dela, é infraestrutura que já
existe:** `app/gui_prefs.py` → `~/.config/hefesto-dualsense4unix/gui_preferences.json`.
É o mesmo arquivo do tamanho do texto (`app/theme.py:39`) e do
`ambiente_corrigido` (`app/ambiente.py:27`). **Uma chave, um dicionário** —
tabela → coluna → largura —, gravada pelo gesto no soltar e aplicada quando a
página pinta.

**Não invente um arquivo novo.** E `maquina.py:268` já explica quando algo
mora no `maquina.json` em vez daqui: leia antes, e se a sua medição disser que
o lugar é o outro, **diga por quê** em vez de trocar calado.

**E A ORDENAÇÃO DA §2 É LEMBRADA JUNTO — decisão minha, e digo o preço:** ela
pediu memória para a largura, não para a ordem. Mas é a mesma chave, a mesma
gravação e o mesmo gesto; e uma tabela que lembra a largura e esquece a ordem é
uma tabela que lembra pela metade, o que surpreende mais do que não lembrar
nada. **Se ela recusar, some uma linha do dicionário e nada mais.**

## §6 — ONDE O ROTEIRO VIVE, e a decisão já está tomada pela MEDIÇÃO

**As três coisas novas — filtrar, ordenar, arrastar — são comportamento de
DOM, e as páginas desta casa não têm `<script>` nenhum** (medido: `grep -c
"<script" interface/topo.html` → **0**). Eu considerei três casas e **duas
caíram na régua de colisão desta leva**, não no gosto:

| | onde | veredito |
| --- | --- | --- |
| (a) | dentro do `BOOTSTRAP` (`hefesto_vivo.py:314`) | **fechado** — `hefesto_vivo.py` é posse da `MIC-SEM-FONTE-01`, aberta nesta leva |
| (b) | um `js_extra` no `monta()` (`monta.py:1750`), simétrico ao `css_extra` | **fechado** — `monta.py` é posse da `VAO-DO-ESQUELETO-01`, aberta nesta leva |
| **(c)** | **um `<script>` no `miolo` que a própria `aba10.py` emite** | **é este** |

**E a (c) é melhor do que as duas que a colisão fechou, o que raramente
acontece:** `monta.py:1857` insere o `miolo` verbatim dentro de
`<div class="miolo">`, então a aba já pode emitir o que quiser ali sem tocar em
arquivo de ninguém. O comportamento da aba 10 fica COM a aba 10, e o piloto
continua genérico — que é o que ele é por desenho.

**CONFIRME ANTES DE CONSTRUIR EM CIMA, e é uma medição de dois minutos:** que o
`WebKit2.WebView`, como o piloto o configura hoje, **executa** um `<script>`
vindo da página. Duas réguas desta casa já tiram `<script>` do texto antes de
medir (`check_a_tela_nao_confessa.py:228`, `check_a_conferencia_dela.py:54`),
o que diz que a forma é tolerada — mas tolerada não é executada. **Meça, e se
não executar, PARE e relate**: as três candidatas se esgotaram, e a quarta é
decisão de arquitetura que não se toma dentro de uma sprint de tela.

### A ARMADILHA QUE MATA AS TRÊS FUNÇÕES DE UMA VEZ, e ela é do piloto

**O `BOOTSTRAP` REPINTA a `tbody[data-hef="perfis.lista"]`.** Ele é a função de
pintura genérica das dez (`hefesto_vivo.py:303`) e reescreve o corpo da lista
sempre que o dado muda — a cada `recarregar`, a cada troca de perfil, a cada
tique. **Filtro aplicado ao DOM, ordem aplicada ao DOM e largura aplicada ao
DOM morrem no primeiro repinte**, em silêncio, com a régua verde: o teste que
filtra e mede na mesma volta passa, e a tela dela volta sozinha ao estado
anterior três segundos depois.

**É a mesma família do defeito de 29/08 que esta casa já pagou** — a regressão
que só aparecia aos 181 segundos, com 67 testes verdes. **Então a régua desta
sprint tem de viver no TEMPO:** filtre, force um repinte do piloto, e meça
DEPOIS. Se o filtro não sobreviver, o roteiro tem de se reaplicar — e o
`el.dataset.hefVisto` do `BOOTSTRAP` (`hefesto_vivo.py:1914`) é por onde se
descobre quando ele acabou de pintar.

## §7 — O QUE ENTREGAR

1. **As cinco seções feitas**, com `mockup/10-perfis.html` gerado e
   **PUBLICADO** (`--publicar 10`) — ela descreveu cada mudança com as próprias
   palavras, e a página publicada é o que a tela dela mostra.
2. **A FOTO**, antes e depois, `--oculta` sempre. Ela tem UMA tela.
3. **O CLIQUE**, e são cinco: a lupa filtrando, o duplo clique ordenando nas
   três colunas, o ⟳ recarregando, o ↺ desfazendo, e a coluna arrastada —
   **fechada e reaberta a página, para provar que a largura voltou**. Um ícone
   que você acrescentou e nunca clicou não está entregue.
4. **A MORDIDA**, e são três: arranque a gravação da largura e veja a régua
   reprovar; devolva `Ajuste próprio` no `<th>` e veja reprovar; troque o duplo
   clique por clique simples e veja reprovar.
5. **A ALTURA DO BLOCO**, em pixels, antes e depois. A ordem era de limpeza.
6. **O que você NÃO mediu**, dito na cara.

## §8 — O QUE É DELA

**A foto.** Cinco mudanças de desenho num bloco só; o que elas fazem juntas
não se lê numa tabela de pixels. E duas coisas específicas voltam para ela:

1. **o canto do `Voltar à de ontem`** — ela disse *"outro canto"* e eu escolhi
   o rótulo `Definições`. Mostre-o na foto;
2. **a busca casando só o que a linha mostra** (§1), se a sua medição disser
   que isso deixa algo de fora.

**E o que NÃO volta para ela:** onde a lembrança mora (§5) e onde o roteiro
vive (§6). São infraestrutura, e decisão de infraestrutura que sobe para ela é
tempo dela gasto com o que é nosso.
