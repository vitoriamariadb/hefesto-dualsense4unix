# PAGINAS-ESPECIAIS-B1 — as doze que existem, e a que diz «agora» sobre 24/08

**Sprint:** PAGINAS-ESPECIAIS-B1 · **árvore:** `hefesto-voo/PAGINAS-ESPECIAIS-B1-opus`
· **branch:** `voo/PAGINAS-ESPECIAIS-B1-opus` · **base:** `dev` em `b794eb1b`
(HEAD == `dev`, zero commits atrás)

> *"temos as páginas especiais. Como calibração de sensores. mapa do controle.*  <!-- noqa-acento: citação literal dela -->
> *Definição de Controle e mouse, remapeamento, configurar point and click*  <!-- noqa-acento: citação literal dela -->
> *entre outras. Preciso que sejam analisada também."*  <!-- noqa-acento: citação literal dela -->

---

## §0 — A RESPOSTA, em quatro linhas

| pergunta | resposta MEDIDA |
| --- | --- |
| quantas páginas especiais existem | **12 endereços · 10 telas distintas** (o assistente de Conexões tem três passos que são a mesma tela) |
| quantas abrem hoje | **12 de 12.** Nenhuma falha em abrir — medido no motor do produto (`WebKit2.WebView` + a folha da casa), clicando o botão que leva a cada uma |
| quantas ela NÃO tinha nomeado | **7 de 12** (ou 5 de 10, contando o assistente como uma) |
| quantas FAZEM alguma coisa | **4 de 12.** As outras oito abrem e são desenho: zero endereço de pintura, ou o gesto declarado sem rota |

**A frase que resume o dia: «abre» e «funciona» são duas perguntas, e esta
sprint mediu as duas porque só a primeira estava no enunciado.** Se o
inventário parasse em *"abre hoje?"*, ele publicaria **12 verdes** sobre uma
tela em que a pessoa escolhe 22 linhas de remapeamento e nada sai do lugar.

---

## §1 — O INVENTÁRIO

«Como se chega» é o caminho COMPLETO a partir da janela aberta. «Abre» é
medido, não lido. «Faz» é a contagem de `data-campo` (onde a tela recebe dado)
e `data-gesto` (o que o clique manda ao daemon), com a conferência de que cada
gesto tem dono registrado.

### As três que são arquivo próprio (`interface/paginas/*.html`)

| nome na tela | arquivo | como se chega | abre hoje? | faz? | quem a pinta |
| --- | --- | --- | --- | --- | --- |
| **Calibrar sensores de movimento** | `paginas/calibrar-sensores.html` | aba **Controles** → botão «Calibrar Sensores de Movimento» (canto superior direito do quadro) | **SIM** — piloto: `[navegou] Hefesto — calibrar sensores de movimento` | **NÃO** — 0 campos, 0 gestos | gerador `interface/calibrar.py` · **ninguém pinta em tempo de execução** |
| **O mapa do controle** | `paginas/mapa-do-controle.html` | aba **Controles** → botão «Mapa do Controle» · **e** aba **Navegação** → link «Banco de provas: o mapa do controle ↗» (linha do título do quadro) | **SIM** | **NÃO** — 0/0, e é por desenho: é banco de provas, lido do CSV na geração | gerador `interface/mapa.py`, de `docs/data/pecas-do-dualsense.csv` + `cores-do-dualsense.csv` |
| **Conexões — o mapa dos seus objetos** (janela: *«Onde eu ponho isto?»*) | `paginas/mapa-das-portas.html` | aba **Conexões** → link «Banco de provas: o mapa das portas ↗», **dentro do quadro «Rádio e Adaptadores», que nasce FECHADO** | **SIM** | **NÃO** — 0/0, e o conteúdo é uma leitura congelada de **24/08/2026** | **NINGUÉM. Não há gerador.** O HTML é a fonte, editado à mão |

### As nove pop-ups (`.tela-nova`, abrem por `:target` dentro da aba)

| nome na tela | arquivo | como se chega | abre hoje? | faz? | quem a pinta |
| --- | --- | --- | --- | --- | --- |
| **Definições Controle e Mouse** | `06-navegacao.html#definicoes-mouse` | aba **Navegação** → botão roxo (1º da fileira de quatro) | **SIM** — 660×657 | **SIM** — 24 campos · 4 gestos, todos com dono | gerador `interface/aba06.py` · pacote `pacotes/a06_navegacao.py` |
| **Teclas do teclado** | `06-navegacao.html#teclas-do-teclado` | **só de dentro da «Definições Controle e Mouse»** → botão «Teclas do teclado» no rodapé dela | **SIM** — 660×444 | **SIM** — 8 campos · 4 gestos | `aba06.py` · `a06_navegacao.py` |
| **Remapeamento dos botões** | `06-navegacao.html#remapeamento` | aba **Navegação** → botão roxo (2º) | **SIM** — 660×657 | **NÃO** — 22 `<select>` e **nenhum** com endereço; os 2 gestos estão em `a06_navegacao.SEM_GESTO` | `aba06.py` — e nada o pinta |
| **Estilo Point-and-click** | `06-navegacao.html#point-and-click` | aba **Navegação** → botão roxo (3º), rotulado «Configurar o estilo Point-and-click» | **SIM** — 660×394 | **NÃO** — 7 `<select>` sem endereço; `guardar-ponto` está em `SEM_GESTO` | `aba06.py` — e nada o pinta |
| **Localizar um lançador** | `07-lancadores.html#novo-lancador` | aba **Lançadores** → botão «Adicionar novo Lançador» | **SIM** — 660×275 | **SIM** — 1 campo · 2 gestos, ambos com dono (`a07_lancadores.py:2699,2933`) | `interface/desenho_dos_lancadores.py` · `a07_lancadores.py` |
| **Mapear Entradas** | `08-conexoes.html#mapear-entradas` | aba **Conexões** → **abrir o quadro «Rádio e Adaptadores»** → botão «Mapear Entradas» | **SIM** — 660×717 (quase a altura toda da janela) | **SIM** — 10 campos · 9 gestos, 8 com dono (`novo-hub` é recusa declarada) | `interface/aba08.py` · `a08_conexoes.py` · rótulos de `app/widgets/mapa_da_mesa.py` |
| **Mapear Entrada a Entrada** — passo 1 | `08-conexoes.html#mapear-entrada-a-entrada` | aba **Conexões** → abrir «Rádio e Adaptadores» → botão «Mapear Entrada a Entrada» | **SIM** — 660×303 | **NÃO** — 0/0 | `aba08.py`, com as frases de `app/widgets/calibrar_entradas.py` |
| **Mapear Entrada a Entrada** — passo 2 (fim da fase sentada) | `08-conexoes.html#mapear-entrada-a-entrada-fim` | **só de dentro do passo 1** → qualquer um dos quatro botões de lugar («Frente do gabinete», «Atrás do gabinete», «Num hub ou extensão», «Na escrivaninha») | **SIM** — 660×323 | **NÃO** — 0/0 | idem |
| **Mapear Entrada a Entrada** — passo 3 (fase em pé) | `08-conexoes.html#mapear-entrada-a-entrada-em-pe` | **só de dentro do passo 2** → botão «Vou mostrar agora» | **SIM** — 660×343 | **NÃO** — 0/0 | idem |

### Como cada linha de «abre hoje?» foi medida

Não foi lendo. Cada linha saiu de um dos três instrumentos, e os três rodaram
**ocultos**:

1. **O motor do produto.** Uma `Gtk.OffscreenWindow` com `WebKit2.WebView` e a
   `interface.folha_da_casa.FOLHA_DA_CASA` por cima — o mesmo par que o piloto
   usa. Ele **clica o botão** por `evaluate_javascript` e mede
   `.tela-nova:target` depois do clique. Os botões que nascem escondidos foram
   alcançados por **cadeia de cliques**, e a cadeia só clica o que tem
   `getClientRects().length > 0` — um botão invisível não conta como caminho.
2. **O piloto inteiro** (`hefesto_vivo.py --oculta --segundos 5/6 --abre …`),
   contra um `$HOME` e quatro `XDG_*` desviados para um lar de mentira, para
   nunca tocar o `~/.config` dela. Ele pousou nas três páginas avulsas e a
   janela sobreviveu às três.
3. **O retratista** (`interface/olhar.py --publicado --vista dela`), para as
   fotos das avulsas.

**A cadeia de cliques é o que revelou o achado de «como se chega»** — ver a §2.1.

### O que NÃO é página especial, e por que está escrito aqui

Para a próxima pessoa não recontar:

* **`html/index.html`, `html/specs.html`, `html/painel.html`,
  `html/frases-de-tela.html`** — são os **instrumentos** da casa, não têm link
  a partir de nenhuma das dez abas (`grep` de `href` nas dez: zero).
* **`paginas/Hefesto Logo.dc.html`, `Paleta Hefesto.dc.html`,
  `Telas Hefesto.dc.html`** — três artefatos de canvas versionados **dentro de
  `paginas/`**. `onde.paginas()` os exclui pelo sufixo `.dc.html`, então
  instrumento nenhum os enxerga — mas eles estão em `git ls-files` e seguem
  para dentro do pacote instalado. Ver a §4.
* **Os `FileChooserDialog` do GTK** — três («Importar» e «Exportar» do rodapé,
  «Escolher o arquivo…» do «Localizar um lançador»). São janelas do SISTEMA
  abertas por `hefesto_vivo._dialogo`, não páginas nossas.
* **`docs/process/sprints/2026-08-24-ABA-CONEXOES/mockup/mapa-das-portas.html`**
  — o mockup arquivado de que o `mapa-das-portas.html` publicado nasceu. Os
  dois **já divergiram em 39 linhas**.

---

## §2 — OS ACHADOS DE PRODUTO, com endereço

Nenhum deles é da minha posse. Ficam escritos, com a medição ao lado.

### 2.1 — «Onde eu ponho isto?» diz «o arranjo de agora» sobre 18 dias atrás — e o produto APAGA o aviso

**É o achado que eu levaria a ela primeiro.**

`paginas/mapa-das-portas.html` é uma leitura da máquina dela **congelada em
24/08/2026, 22h50**, com o censo inteiro cravado em JavaScript
(`mockup/mapa-das-portas.html:335` *"O QUE O BARRAMENTO ENTREGOU — medido em
24/08/2026"*, `:384` `agora: { rotulo: "22h50 — depois dos seus movimentos" }`).
A tela diz, com estas palavras:

> **Este é o arranjo de agora — 22h50 — depois dos seus movimentos · você
> declarou 8 de 16 entradas. 4 aparelhos estão numa entrada que você não
> declarou.**

O arquivo TEM um aviso, na linha 284:

```html
<p class="nota">mockup · 24/08/2026 · medido na MeowSystem</p>
```

**E o produto o apaga.** A primeira regra da `folha_da_casa.FOLHA_DA_CASA` é
`.nota{display:none !important}`. Medido lado a lado, na mesma página:

| motor | o aviso «mockup · 24/08/2026» aparece? |
| --- | --- |
| Chrome cru (a bancada) | **SIM** — é a 3ª linha da página |
| `WebKit2.WebView` + a folha da casa (o produto) | **NÃO** — sumiu |

Sobra, sozinha, a palavra **«agora»** sobre a mesa de 24/08. É exatamente o
defeito que o `COMO-OLHAR-A-TELA.md` nomeia na regra 4 do mockup — *"Estado
velho como padrão é o F7 desta casa — a tela afirmando com confiança o que
deixou de ser verdade"* —, e aqui ele é pior do que o descrito: **a folha do
produto remove justamente a linha que impediria a leitura errada.**

`.nota` está certa em esconder bilhete de projeto nas dez abas. O que não está
certo é uma página avulsa **depender** de uma `.nota` para não mentir.

### 2.2 — «Mapear Entradas» e «Mapear Entrada a Entrada» são invisíveis com a janela aberta

Medido com a cadeia de cliques, que só clica o que tem caixa na tela:

```
a[href="#mapear-entradas"]           rects=0  escondido_por=['quadro-corpo']
a[href="#mapear-entrada-a-entrada"]  rects=0  escondido_por=['quadro-corpo']
```

Os dois moram no quadro **«Rádio e Adaptadores»** (`08-conexoes.html:4067`), e
o quadro é um acordeão de rádios (`input.abre`, `name="cx8-secao"`) cuja regra
é `.quadro:has(> input.abre:not(:checked)) > .quadro-corpo{display:none}`
(`:424`). **Nenhum deles nasce marcado**, então, com a aba Conexões recém-aberta,
os dois botões não existem na tela. Só depois de clicar no título
«Rádio e Adaptadores» eles aparecem — e aí a cadeia inteira funciona:

```
label[for="cx8-3"]                       -> 'Rádio e Adaptadores'
a[href="#mapear-entrada-a-entrada"]      -> popup mapear-entrada-a-entrada      660x303
a[href="#mapear-entrada-a-entrada-fim"]  -> popup mapear-entrada-a-entrada-fim  660x323
a[href="#mapear-entrada-a-entrada-em-pe"]-> popup mapear-entrada-a-entrada-em-pe 660x343
```

O mesmo vale, em grau menor, para **«Teclas do teclado»** (só de dentro da
«Definições Controle e Mouse») e para o **«Banco de provas: o mapa das portas»**
(também dentro do quadro fechado). **Quatro das doze páginas especiais não têm
um caminho visível a partir da aba aberta** — é literalmente a coluna que a
sprint disse ser a que mais falta.

### 2.3 — «Remapeamento dos botões» e «Estilo Point-and-click»: 29 campos sem endereço

| pop-up | `<select>` na tela | com `data-campo`/`data-gesto` | gestos do rodapé |
| --- | --- | --- | --- |
| `#definicoes-mouse` | 22 | **22** | `guardar-definicoes`, `padrao-definicoes`, `fechar-definicoes`, `linha-de-botao` — os quatro com dono |
| `#remapeamento` | 22 | **0** | `guardar-remapeamento`, `padrao-remapeamento` — os dois em `SEM_GESTO` |
| `#point-and-click` | 7 | **0** | `guardar-ponto` — em `SEM_GESTO` |

As duas telas que ela NOMEOU no pedido abrem, desenham a tabela inteira, deixam
escolher em 29 menus e **não têm onde guardar nem de onde ler**. A casa já sabe
disso e diz por quê, no `pacotes/a06_navegacao.py:3458-3465`:

```
"guardar-remapeamento": "o remapeamento botão-por-botão não tem sequer campo
                         no perfil, quanto mais método de IPC",
"padrao-remapeamento":  "idem, ao contrário",
"guardar-ponto":        "'Estilo de Jogo' não existe em campo, widget ou preset
                         nenhum do produto …",
```

**Isto não é achado novo — é achado que ninguém tinha contado junto.** O que
esta sprint acrescenta é o número na tela: 29 menus, e a foto (anexo
`produto-06-navegacao-mapeamento.png`) em que as 22 linhas dizem, todas,
«— Sem troca —».

*Consequência para a onda:* **propor texto novo para essas duas telas é pintar
o que não anda.** As propostas da §3 para elas ficam no mínimo — o que eu faria
antes é a decisão dela sobre o botão cinza (a gramática `.degrau.sem-dono` que
o `TODO-DELA.md` já guarda).

### 2.4 — A página de calibração mostra a bancada, não os controles dela

`calibrar-sensores.html` tem **0 `data-campo` e 0 `data-gesto`**, e o piloto
confirma: `página trocada no meio do tique: calibrar-sensores.html 1`, com
**zero pinturas**. O que a tela mostra é o que `calibrar.py` cravou na geração:

* os controles vêm de `monta.CONECTADOS` — a **MESA DE DESENHO**
  (`monta.py:294`), sempre «P1 Cosmic Red · USB» e «P2 Starlight Blue · BT»;
* os números do giroscópio e do acelerômetro vêm da constante
  `calibrar.REPOUSO` (`calibrar.py:46-51`) — seis exemplos por controle,
  fixos no arquivo.

Ou seja: **ela abre a calibração com quatro DualSense na mesa e vê dois**, com
leituras que não são as dela, e o botão «Começar» não tem gesto. A foto está no
anexo `piloto-calibrar.png`.

E há um defeito de plural junto, `calibrar.py:219`:

```python
plural = "dos dois" if n == 2 else f"dos {n}"
```

Com um controle só na mesa, a tela escreve *"O giroscópio e o acelerômetro
**dos 1** controles conectados"*.

### 2.5 — `olhar.py` não consegue fotografar `mapa-das-portas`, e confunde os dois mapas

Dois defeitos do retratista, achados ao tentar usá-lo:

```
$ interface/olhar.py mapa-das-portas.html --publicado --vista dela
ERRO ao medir mapa-das-portas.html: nem .janela nem .cx nesta página — não há o que medir
```

`mapa-das-portas.html` é a única página de `paginas/` que não usa nem a moldura
`.janela` das dez nem a `.cx` das avulsas: ela tem esqueleto próprio. **O
retratista da casa não alcança uma das treze páginas publicadas**, e o erro só
aparece quando alguém pede aquela página pelo nome.

O segundo é mais barato e mais silencioso — `olhar.py:366`:

```python
saida = pathlib.Path(f"/tmp/olhar-{arq[:2]}{'-publicado' if publicado else ''}.png")
```

O nome do PNG são os **dois primeiros caracteres** do arquivo. Isso basta para
`01`…`10`, e **funde `mapa-do-controle.html` com `mapa-das-portas.html`** no
mesmo `/tmp/olhar-ma-publicado.png`. Fotografar os dois em sequência entrega a
mesma imagem duas vezes, sem erro — foi o que aconteceu aqui na primeira volta.

### 2.6 — `mapa-das-portas.html` não tem gerador, e já divergiu

As outras doze páginas de `paginas/` saem de um gerador versionado. Esta não:
`grep` por `mapa-das-portas` em `src/`, `scripts/` e `tests/` devolve só
citações. O arquivo é uma cópia, editada à mão, de
`docs/process/sprints/2026-08-24-ABA-CONEXOES/mockup/mapa-das-portas.html` —
e os dois **já diferem em 39 linhas**.

É a forma exata do colapso que ela diagnosticou em 31/08 sobre o `novo-layout/`:
*"se alteramos no layout final a referência do mockup se perde"*.

### 2.7 — Um comentário que descreve uma cura que não está lá

`aba06.py:671-675` explica a largura da fileira de botões com:

> *"quatro botões na fileira de 1086px dão 261,8px cada. Coube — mas só depois
> de «Configurar o estilo Point-and-click» virar «Estilo Point-and-click»"*

**O gerador continua escrevendo o rótulo longo** (`aba06.py:2267`), e é ele que
está na tela. Medido no produto: o botão tem 257×34 px e `scrollWidth ==
clientWidth == 255` — **não quebra hoje**, então a cura não faz falta; o que
faz falta é o comentário parar de dizer que ela existe. É a mesma família do
defeito que a casa registrou em 04/09 (*"comentário que descreve código
inexistente é pior que comentário nenhum: ele faz a próxima pessoa parar de
procurar"*).

O efeito colateral é de língua, e está na §3: **o botão e o título da mesma
tela têm nomes diferentes** («Configurar o estilo Point-and-click» × «Estilo
Point-and-click»), e o mesmo acontece no Lançadores («Adicionar novo Lançador»
× «Localizar um lançador»).

---

## §3 — A VISTORIA DE LÍNGUA

O formato é o das cinco frentes da onda A. Cada linha responde às cinco
perguntas da sprint; a coluna «por quê» diz qual delas a frase de hoje reprova.

**Q1** diz o que acontece? · **Q2** cabe numa respiração? · **Q3** sobrevive à
tradução? · **Q4** repete o que a tela já diz? · **Q5** confessa dívida nossa?

### 3.1 — `mapa-das-portas.html` — a página sem gerador

O endereço é o HTML (bancada e publicado são **byte a byte idênticos**; é onde
a edição tem de acontecer, porque gerador não há).

| arquivo:linha | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `mockup/mapa-das-portas.html:6` | `Onde eu ponho isto?` (é o `<title>` — o piloto imprime `[navegou] Onde eu ponho isto?` e é o nome da janela) | `Hefesto — o mapa das entradas` | **Q3.** É a única das treze páginas cujo título não nomeia o produto, e um enigma não é nome. As outras doze seguem `Hefesto — …` |
| `:1349` | *"…O que eles mudam é a **bateria**, e o preço disso `não medido` nesta casa: nenhum dos 178 ensaios cronometrou consumo por feature."* | *"…O que eles gastam é bateria."* | **Q5.** Confessa dívida nossa, e nomeia os nossos ensaios. Decisão dela de 07/09. **−164 caracteres** |
| `:1390` | *"A conta vem de uma medição de um controle. Quatro no rádio ao mesmo tempo **nunca foi medido nesta casa** — o maior ensaio já feito foi de dois."* | *"A conta vale por controle. Com quatro no rádio, o número é estimado."* | **Q5.** O selo `DERIVADO` já diz que é derivado; a confissão é ruído. **−72** |
| `:1355` | *"…marcar algo que o produto esquece **é a definição do defeito que esta leva mata**. Fica fora do perfil de propósito…"* | *"Uma caixinha por controle ligado. O microfone é o único que capta a sala e o único que pesa no rádio — 276,7 envios por segundo em vez de 260,4. Nasce desligado; só você o liga."* | **Q5 + Q1.** «esta leva» é vocabulário de obra. **−201** |
| `:310` | `integrations/dualsense_bt_audio.py`, A/B de 25/07/2026 | *"medido aqui em 25/07/2026"* | **Q3.** Caminho de arquivo do repositório na tela. **−28** |
| `:303` | *"Bluetooth tem 1600 **vezes de falar** por segundo, por adaptador… Não falta banda: falta vez."* | *"Cada adaptador Bluetooth atende 1600 envios por segundo, divididos entre os controles ligados nele. É esta conta que decide se todos funcionam ao mesmo tempo."* | **Q3.** «vezes de falar» é metáfora da casa; nenhum tradutor a reconstrói. **−57** |
| `:1263` | *"Encontrei 4 coisas que vale mudar de lugar."* | *"4 coisas para mudar de lugar."* | **Q2 + Q3.** «que vale mudar» é concordância frouxa e voz em primeira pessoa. **−14** |
| `:1155-1158` | `Como está o meu arranjo` · `Me mostre os arranjos` · `Estou com algo na mão` · `Reexaminar o arranjo` | `Como está hoje` · `O que mudar` · `Tenho algo na mão` · `Examinar de novo` | **Q2 + Q3.** Quatro botões em três vozes diferentes (1ª pessoa do usuário, imperativo ao sistema, infinitivo). Fixar o infinitivo, que é o que as dez abas usam |
| `:284` | *"mockup · 24/08/2026 · medido na MeowSystem"* — **e o produto esconde esta linha** | **a data tem de sobreviver à folha da casa**: tirar da `.nota` e pôr no cabeçalho, como dado | **Q5 ao contrário.** Ver §2.1: é a única linha da página que impede a leitura errada, e é a única que o produto apaga |

### 3.2 — `mapa-do-controle.html` — gerador `interface/mapa.py`

| arquivo:linha | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `interface/mapa.py:936` | `O mapa do controle — a fonte da verdade das peças` | `O mapa do controle — o nome de cada peça` | **Q3.** «fonte da verdade» é *single source of truth* traduzido ao pé da letra; fora desta casa não quer dizer nada. **−9** |
| `interface/mapa.py:957` | `0 propostas, a conferir` | **sai da tela** | **Q5.** É o estado de revisão interna do CSV. Quando o número é zero, a linha informa zero |
| `interface/mapa.py:959` | `fontes: docs/data/pecas-do-dualsense.csv · docs/data/cores-do-dualsense.csv` | **sai da tela** | **Q5 + Q3.** Dois caminhos do repositório. **−75** |

**O que eu NÃO proponho nesta página:** a coluna de identificadores crus
(`triangle`, `dpad_up`, `stick_l`, `feat-giroscopio`, `led-jogador`). Parece
jargão, mas **é o assunto da página** — ela nasceu porque o SVG chamava de `l2`
e `r2` duas peças que são o Share e o Options, e o valor dela é justamente pôr
nome e lugar lado a lado. Tirar a coluna mataria a página.

### 3.3 — `calibrar-sensores.html` — gerador `interface/calibrar.py`

**É o melhor texto das doze**, e a maior parte dele eu deixo como está.

| arquivo:linha | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `interface/calibrar.py:238` (+ `:219`) | `O giroscópio e o acelerômetro dos dois controles conectados, numa passada só.` | `O giroscópio e o acelerômetro de todos os controles conectados, de uma vez.` | **Q3** («numa passada só» é idiomático) **e conserta o defeito de plural** da §2.4: com um controle a tela hoje diz *"dos 1 controles"*. **−2** |
| `interface/calibrar.py:236` | `title="Volta para a aba de onde você veio."` | `Volta para a aba anterior.` | **Q2.** O `onclick` faz `history.back()`; «de onde você veio» é a explicação do mecanismo. **−9** |

**NÃO proposto, e declarado:** os três passos («Deixe os controles parados» ·
«Não toque neles» · «Pronto») e o rodapé (*"A calibração não muda os seus
ajustes — ela só ensina ao controle qual é o zero dele. Se o cursor anda
sozinho com o controle parado, é isto que resolve."*). Os cinco passam nas
cinco perguntas: dizem o que acontece, cabem numa respiração, não têm metáfora
e o rodapé fecha com o SINTOMA que a pessoa tem — que é a melhor frase de
ajuda deste produto.

### 3.4 — As quatro pop-ups da Navegação — gerador `interface/aba06.py`

| arquivo:linha | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `aba06.py:1774-1779` (`MARCA_DO_TOUCHPAD`) **× 9 na tela** | *"O touchpad do controle continua sendo o mouse do computador nesta máquina, e enquanto for assim o Hefesto não transforma o clique dele em tecla. A escolha fica guardada no perfil e volta a valer no dia em que o touchpad deixar de ser o ponteiro."* | *"O touchpad é o mouse do computador nesta máquina. A escolha fica guardada e passa a valer quando isso mudar."* | **Q2 + Q4.** 245 caracteres numa dica, repetida **nove vezes** (3 linhas × 3 pop-ups). **−137 cada · −1233 na tela** |
| `aba06.py:2267` | `Configurar o estilo Point-and-click` (o botão) | `Estilo Point-and-click` (= o título da tela que ele abre, `aba06.py:2574`) | **Q4.** Botão e destino com nomes diferentes. O comentário do próprio arquivo (`:672`) já dá esta troca por feita — ver §2.7. **−13** |
| `aba06.py:2616` | `Guardar no estilo` | `Guardar` | **Q2 + Q4.** As outras três pop-ups dizem `Guardar`; só esta inventa um complemento. **−10** |
| `aba06.py:2602` | `Velocidade de cursor` | `Velocidade do cursor` | **Q3.** A linha de baixo já diz «Velocidade **da** rolagem». Regência inconsistente no mesmo bloco |
| `aba06.py:2266` e `:2353` | `Remapeamento dos botões` | `Trocar os botões` | **Q1 + Q3.** «Remapeamento» é substantivo de manual; o botão tem de dizer o ato. **−7** |
| `aba06.py:2447` | `Passa a valer como` (cabeçalho da 2ª coluna) | `Passa a ser` | **Q2.** **−7** |

**NÃO proposto:** `Teclas do teclado` (título e botão batem, e a frase é
literal), `Botão do controle` / `O que ele faz` / `Tecla que ele digita`
(cabeçalhos exatos), e as duas dicas de linha — *"Escreva a tecla que este
botão digita."* (`:2533`) e *"Voltar só esta linha ao de fábrica."* (`:2536`) —,
que são o molde do que a §0 pede.

### 3.5 — `#novo-lancador` — `interface/desenho_dos_lancadores.py`

| arquivo:linha | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `desenho_dos_lancadores.py:1023` (`ADICIONAR_NOVO_ROTULO`) **e** `:1074` (`TELA_DO_NOVO_TITULO`) | botão: `Adicionar novo Lançador` · título da tela que ele abre: `Localizar um lançador` | os dois: `Adicionar um lançador` | **Q4.** Dois nomes para a mesma tela, e ainda com maiúscula decorativa no botão — o caso 4 da §2 do índice, que ela transformou em regra. **−2** |

**NÃO proposto:** `Um lançador ou emulador que você usa`, `Como ele se chama`,
`Onde ele está`, `Escolher o arquivo…`. São quatro linhas curtas, literais e
traduzíveis — o melhor formulário do produto.

### 3.6 — `#mapear-entradas` — `interface/aba08.py` e `app/widgets/mapa_da_mesa.py`

| arquivo:linha | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `app/widgets/mapa_da_mesa.py:163` | *"Cada mudança aqui já foi gravada, no clique. Não há nada a aplicar depois."* | *"Tudo aqui é gravado no clique."* | **Q2.** A segunda oração é a primeira ao contrário. **−44** |
| `aba08.py:3154` (dica de «O que o Hefesto encontrou») | *"Tudo que o **censo do barramento** achou, menos os **hubs-raiz**. O hub de bancada FICA: o cabo dele ocupa uma entrada da traseira…"* | *"Tudo o que está ligado ao computador. O que já tem lugar continua na lista: clique nele para mudar de entrada."* | **Q1 + Q3.** «censo do barramento» e «hub-raiz» são nomes do nosso motor e do kernel. **−123** |
| `aba08.py:3178` (dica de «O que só você sabe») | *"**Estas duas mudaram-se da aba para cá em 28/08**, e aqui elas preenchem um vazio real: a janela do desenho não guardava um único fato que só você tem. Sem resposta não é o mesmo que «Não sei»…"* | *"Duas coisas que nenhuma leitura do sistema alcança. Não responder não é o mesmo que «Não sei»: «Não sei» é você dizendo que olhou."* | **Q5.** A primeira metade é o histórico do nosso redesenho — data de sprint na dica. **−169 (×2 na tela)** |
| `aba08.py:2766` | *"o kernel declinou de classificar (classe ff)"* | *"o sistema não diz o que é"* | **Q1 + Q3.** «classe ff» é o descritor USB. **−19** |
| `gui/aba_conexoes.py:1023` (`DICA_NOVO_HUB`, escrita por `aba08.py:3040`) | *"…Cabo passivo não tem **descritor USB**: nenhuma leitura do sistema o enxerga, e por isso quem o declara é você."* | *"Acrescenta um hub ou uma extensão. O sistema não os enxerga — quem diz onde estão é você."* | **Q1 + Q3.** **−103** |
| `gui/aba_conexoes.py:1015` (`DICA_NOVA_ENTRADA`, 2 ocorrências na tela) | *"Acrescenta a esta face o menor número que ainda não existe em face nenhuma — os números são do GABINETE, e dois buracos diferentes não podem levar o mesmo."* | *"Cria uma entrada nova nesta face, com o próximo número livre."* | **Q1 + Q2.** A regra de unicidade é do motor; quem clica não escolhe o número. **−94 (×2)** |

### 3.7 — Os três passos do «Mapear Entrada a Entrada» — `aba08.py`

| arquivo:linha | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `aba08.py:3313` **× 4 na tela** | *"Cria uma entrada numerada nova nesta face para este aparelho e para tudo que pende dele, e grava no disco na hora — **sem IPC**, funciona com o Hefesto desligado."* | *"Cria uma entrada nesta face para este aparelho e para o que estiver pendurado nele. Gravado na hora."* | **Q1 + Q3 + Q4.** «sem IPC» é o nome do nosso canal, e a mesma dica está nos quatro botões de lugar. **−58 cada · −232 na tela** |
| `app/widgets/calibrar_entradas.py` (dica do «Não sei onde fica») **× 3** | *"Avança um passo sem gravar e sem cobrar depois. **No fim e na fase em pé ele não tem efeito visível — e mesmo assim fica no mesmo lugar, em todos os passos.**"* | *"Pula esta entrada, sem gravar nada e sem perguntar de novo."* | **Q1 + Q5.** A segunda frase explica uma decisão de desenho NOSSA a quem só quer pular. **−95 (×3)** |

### 3.8 — As duas portas, nas abas que as hospedam

| arquivo:linha | o que a tela diz hoje | proposta | por quê |
| --- | --- | --- | --- |
| `aba06.py:2664` | `Banco de provas: o mapa do controle ↗` | `Ver o mapa do controle ↗` | **Q3.** «banco de provas» é jargão da casa. **−13** |
| `aba08.py:3651` | `Banco de provas: o mapa das portas ↗` | `Ver o mapa das entradas ↗` | **Q3 + Q1** — e ver a ressalva da §3.10: a palavra «portas» é dela. **−11** |
| `aba02.py:3083-3085` | `Calibrar Sensores de Movimento` · `Mapa do Controle` | `Calibrar sensores de movimento` · `Mapa do controle` | **A regra do item 4 da §2 do índice** (*"Esse tipo de coisa não pode se repetir na interface"*). Os dois títulos das telas que eles abrem já são minúsculos — a maiúscula está só no botão |

**A conta da maiúscula decorativa, nas doze:** cinco rótulos em *Title Case*
(`Calibrar Sensores de Movimento`, `Mapa do Controle`, `Mapear Entradas`,
`Mapear Entrada a Entrada`, `Adicionar novo Lançador`) contra cinco em frase
(`Remapeamento dos botões`, `Teclas do teclado`, `Estilo Point-and-click`,
`Localizar um lançador`, `Calibrar sensores de movimento` — o título da própria
página). **A mesma fileira de botões da Navegação tem as duas formas.** A
execução é da C2; a lista fica aqui.

### 3.9 — A conta

| | caracteres |
| --- | --- |
| as 29 frases propostas, como estão hoje | **3 127** |
| as mesmas, propostas | **1 578** |
| diferença | **−1 549 (50 % a menos)** |

E contando as **repetições na tela** (a dica do touchpad aparece 9 vezes, a do
«sem IPC» 4, a do «Não sei onde fica» 3, a do «O que só você sabe» 2):
**−3 003 caracteres de tela**, com 29 frases mexidas.

### 3.10 — O QUE EU DECIDI **NÃO** PROPOR

1. **As dez frases carimbadas por ela em `app/widgets/calibrar_entradas.py`.**
   O arquivo as marca, uma a uma, com `PROVISÓRIO — decisão dela` e
   `**Carimbado por ela**`: `Onde fica esta entrada?` (`:195`),
   `sem sair da cadeira` (`:197`), `Já chega por hoje` (`:200`),
   `Não sei onde fica` (`:201`), `Não alcanço` (`:205`),
   `Acabou a parte sem levantar.` (`:209`), o `CONVITE_EM_PE` (`:213`),
   `Vou mostrar agora` (`:219`), `Deixar para quando eu precisar` (`:220`),
   o `CONVITE_DO_ENCAIXE` (`:226`) e o `Procurando` (`:234`).
   **«sem sair da cadeira» e «fase em pé» reprovam a Q3** — são metáfora de
   bancada e não sobrevivem à tradução. Mas são palavra dela, de 28/08, e a
   §0 é de 11/09: **isso é uma pergunta para ela, não uma proposta minha.**
   Está na §5.
2. **Os dois relógios do assistente** (`aba08.py:2710`): *"A entrada aparece
   para mim em ~3,4 s. O controle só consegue vibrar por volta de 10,3 a
   15,6 s — e essa demora é uma correção que o próprio Hefesto instala para ele
   não falhar. Não é você, e não é o seu cabo."* — 205 caracteres repetidos nos
   três passos, e a segunda metade explica mecânica interna. **Mas o
   `calibrar_entradas.py:238` diz que «os dois números vão para a tela crus
   (R33)» por decisão dela.** Mesma §5.
3. **A palavra «portas»** em `mapa-das-portas.html`, no rótulo da porta e no
   nome do arquivo. Ela colide com a `D-A-PALAVRA-ENTRADA` (24/08) e com a
   `D-MAPEAR-ENTRADAS-E-NAO-PORTAS` (28/08), que o resto do produto já cumpre —
   e o `aba08.py:1758-1763` diz, com todas as letras, que **quem escolheu
   «porta» ali foi ela**, e que a colisão está *"ANOTADA e não resolvida"*.
   Minha proposta de §3.8 troca o RÓTULO; **o nome do arquivo e o
   `EXAMINAR_PORTAS` eu não toco.** §5.
4. **A coluna de identificadores do `mapa-do-controle`** — §3.2.
5. **A página de calibração inteira, menos duas linhas** — §3.3.
6. **Tudo dentro de `#remapeamento` e `#point-and-click` além do título e do
   rodapé.** Enquanto as 29 escolhas não tiverem onde pousar (§2.3), reescrever
   as 29 linhas da tabela é trabalho que se perde no dia em que a feature
   nascer e trocar a tabela inteira.

---

## §4 — TRÊS COISAS PEQUENAS, PARA NÃO SE PERDEREM

* **Os três `.dc.html` dentro de `paginas/`** (`Hefesto Logo`,
  `Paleta Hefesto`, `Telas Hefesto` — 75 KB) estão em `git ls-files` e viajam
  para dentro do pacote instalado. `onde.paginas()` os exclui pelo sufixo, de
  modo que **régua nenhuma desta casa os enxerga**. Ou são produto e têm de ter
  dono, ou são material de desenho e moram fora de `paginas/`.
* **`#novo-lancador` tem um botão que abre a si mesmo.** «Escolher o arquivo…»
  é `<a href="#novo-lancador">` (`07-lancadores.html:1569`) — o mesmo fragmento
  da tela em que ele está. O gesto por trás existe e tem dono
  (`a07_lancadores.py:2933`, `desenho.PROCURAR_O_ARQUIVO`), então o clique
  funciona; o `href` é que é um no-op que reabre a própria pop-up.
* **O `← Voltar` das três avulsas é `history.back()` com fallback fixo em
  `02-controles.html`.** Para o `mapa-do-controle`, que tem **duas** portas
  (Controles e Navegação), o fallback manda para a Controles mesmo quem veio da
  Navegação. Só morde se o histórico estiver vazio.

---

## §5 — O QUE É DELA

Três perguntas, e as três são sobre palavra que ela mesma carimbou. Nenhuma
frente desta onda deveria mexer nelas sem resposta.

1. **A metáfora da bancada no «Mapear Entrada a Entrada».** «sem sair da
   cadeira», «Acabou a parte sem levantar», «fase em pé», «Já chega por hoje»,
   «Deixar para quando eu precisar» são frases dela, e são as mais calorosas do
   produto. Também são as que menos sobrevivem à tradução. **A §0 de 11/09 é
   mais nova que elas. Ela quer que elas mudem?**
2. **Os dois relógios crus** (`~3,4 s` e `10,3 a 15,6 s`) com a explicação de
   por que o controle demora. Ela pediu os números crus (R33). **Fica a
   explicação junto, ou só os números?**
3. **«portas» × «entradas».** Ela escolheu «entrada» em 24/08 e «Examinar
   Portas» em 28/08, no mesmo turno. Hoje o arquivo se chama
   `mapa-das-portas.html`, o link diz «o mapa das portas», e **a página inteira
   fala de «entradas»** (o texto visível tem uma única ocorrência de «porta»).
   **Renomeia?**

E uma quarta, que é de produto e não de palavra: **o «Remapeamento dos botões»
e o «Estilo Point-and-click» abrem, deixam escolher em 29 menus e não guardam
nada.** Hoje eles parecem prontos. As duas saídas honestas são o botão cinza
com a razão (a gramática `.degrau.sem-dono` que a casa já tem) ou a feature.
**Qual?**

---

## §6 — O QUE ESTA SPRINT NÃO FEZ

* **Nenhuma linha de `src/`.** A posse é só este arquivo.
* **Nenhuma frase entrou em gerador nenhum.** A onda B entrega proposta; quem
  mostra a ela é quem coordena, e quem aprova é ela (§5.1 do índice).
* **Nenhuma janela na tela dela.** Os três instrumentos rodaram ocultos
  (`Gtk.OffscreenWindow`, Chrome headless, `--oculta`), e o piloto rodou contra
  um `$HOME` e quatro `XDG_*` desviados para um lar de mentira.
* **Nenhuma feature proposta.** As lacunas da §2 e da §5 estão escritas e não
  executadas, como a §0 do índice manda.

---

## §7 — AS FOTOS

No scratchpad desta sessão, `…/scratchpad/fotos/`:

| arquivo | o que é |
| --- | --- |
| `piloto-calibrar.png` | a calibração **no produto** (piloto oculto, daemon vivo) — os dois controles da bancada |
| `piloto-mapa-do-controle.png` · `piloto-mapa-das-portas.png` | as outras duas avulsas, no produto |
| `produto-06-navegacao-mapeamento.png` | o «Remapeamento dos botões» aberto: 22 linhas, todas «— Sem troca —» |
| `produto-cadeia-1..3-*.png` | os três passos do «Mapear Entrada a Entrada», alcançados por cadeia de cliques |
| `06-navegacao--*.png`, `07-lancadores--*.png`, `08-conexoes--*.png` | as nove pop-ups na vista dela (1918×840), Chrome |
| `mapa-das-portas.png` | a página que o `olhar.py` não consegue fotografar |

---

## §8 — OS PORTÕES

`git add -A` e `bash scripts/portoes.sh` nesta árvore, com o cabeçalho
conferido:

```
portões — árvore /mnt/Apate/Desenvolvimento/hefesto-voo/PAGINAS-ESPECIAIS-B1-opus
         PYTHONPATH /mnt/Apate/Desenvolvimento/hefesto-voo/PAGINAS-ESPECIAIS-B1-opus/src

REPROVOU: 1 vermelho(s) de 56 -> referencias-docs
```

**O vermelho é anterior a esta entrega, e nenhuma das cinco linhas é minha.**
São os relatórios das cinco frentes da onda A, que os agentes delas ainda não
escreveram:

```
docs/process/sprints/2026-09-11-LINGUA-A1-…:40  docs/process/agentes/2026-09-11/LINGUA-A1-opus.md
docs/process/sprints/2026-09-11-LINGUA-A2-…:38  …/LINGUA-A2-opus.md
docs/process/sprints/2026-09-11-LINGUA-A3-…:51  …/LINGUA-A3-opus.md
docs/process/sprints/2026-09-11-LINGUA-A4-…:44  …/LINGUA-A4-opus.md
docs/process/sprints/2026-09-11-LINGUA-A5-…:42  …/LINGUA-A5-opus.md
```

Medido pelos dois lados, com a régua do próprio portão
(`scripts/validar-referencias-docs.py --all`), e não por dedução:

| árvore | referências mortas |
| --- | --- |
| sem este relatório no disco | **6** — as cinco acima **mais** a desta sprint |
| com ele | **5** |

Esta entrega **fecha uma das seis**; as outras cinco fecham quando as frentes
A1…A5 entregarem os relatórios que os `posse:` delas declaram. Os outros
**55 portões estão verdes**.
