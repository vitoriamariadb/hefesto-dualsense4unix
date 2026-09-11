---
sprint: A-SEGUNDA-LISTA-DELA-INDICE
estado: aberta
onda: A-LINGUA-DA-TELA
posse:
  COORDENA:
    - docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
---

# A SEGUNDA LISTA DELA — a língua da tela e a paridade

**11/09/2026, fim de tarde.** Ela abriu o produto instalado, com um DualSense
no cabo, e mandou **dez coisas em cinco fotos**. Este arquivo é a fila, e ele
existe porque ela pediu com todas as letras:

> *"Materializa o plano. Tudo em Dev."*  <!-- noqa-acento: citação literal dela -->

---

## §0 — A ORDEM QUE ATRAVESSA TUDO, e ela não é uma tarefa

> *"a ideia da interface como um todo é ter menos texto sempre e ser mais*  <!-- noqa-acento: citação literal dela -->
> *precisa e direta sempre. ao invés de confusa e esstranha como está hoje."*  <!-- noqa-acento: citação literal dela -->

> *"toda mensagem de tooltip ou que surgem após deixar o mouse em cima ela*  <!-- noqa-acento: citação literal dela -->
> *deveria ser reduzida e ficar intuitiva e direta ao ponto."*  <!-- noqa-acento: citação literal dela -->

E o PORQUÊ, que decide o critério de aceitação de toda frente desta onda:

> *"deixcar o programa naturalmente acessível, com textos simplificado pra que*  <!-- noqa-acento: citação literal dela -->
> *futuramente, (não agora obviamente, possamos traduzir a interface e*  <!-- noqa-acento: citação literal dela -->
> *documentação.)"*  <!-- noqa-acento: citação literal dela -->

**ISSO MUDA O QUE É "BOM TEXTO" NESTA CASA.** Até hoje a prosa da tela foi
escrita para explicar; a partir daqui ela é escrita para **traduzir**. Uma
frase que só funciona em português — trocadilho, ordem invertida, ironia,
metáfora de bancada — é dívida, ainda que esteja certa.

E o que NÃO é esta onda, palavra dela:

> *"A ideia não é adicionar mais nada em termos de feature ou interface, Mas é*  <!-- noqa-acento: citação literal dela -->
> *fazer o todo funcionar."*  <!-- noqa-acento: citação literal dela -->

**Nenhuma frente desta onda acrescenta feature.** Quem achar uma que falta
escreve no relatório e não executa.

---

## §1 — A PERGUNTA DELA QUE JÁ TEM RESPOSTA MEDIDA

> *"Tem diferença real entre todo o som do PC e Ouvir Juntos?"*  <!-- noqa-acento: citação literal dela -->

**Tem, e é real.** Medido em `interface/pacotes/a02_controles.py:1555-1570`,
que é o dono da fileira:

| botão | o que ele faz | camada |
| --- | --- | --- |
| **Sons do jogo** | só o que o jogo mandar para ESTE controle — o SFX que ela descreveu | firmware |
| **Ouvir junto** | o som do PC cai **também** no controle, **e continua saindo na TV** | sistema |
| **Todo o som do PC** | o som do PC sai **só** no controle — **a TV cala** | sistema + firmware |

**E A EXPECTATIVA DELA ESTÁ TROCADA EM RELAÇÃO AOS NOMES, o que é achado de
linguagem e não de código.** Ela descreveu o «Todo o som do PC» assim:

> *"Todo o som do pc era pra ser o sfx + todo o som que sai no outofalante do*  <!-- noqa-acento: citação literal dela -->
> *hmdmi"*  <!-- noqa-acento: citação literal dela -->

O que ela descreveu é o **«Ouvir junto»**. O «Todo o som do PC» faz o
contrário: leva o som para o controle e **tira da TV**. Os dois nomes dizem
"todo o som" e "junto" sem dizer **de onde o som SAI** — que é a única coisa
que os separa.

**É DECISÃO DELA, e está na §4.**

---

## §2 — OS DEFEITOS PONTUAIS, com endereço medido

Cada linha aqui é uma queixa dela com a fotografia junto. **Nenhuma é
proposta: são defeitos, e vão direto para a execução.**

| # | o que ela disse | onde mora |
| --- | --- | --- |
| 1 | *"em todos os tooltips somem os textos e eles não mostram ou mostram e saem direto. em todas as paginas isso ocorre."* | o `title` nativo dentro do `WebKit2.WebView` — a medir |
| 2 | *"no nome da janela não conseguimos deixar Hefesto - DualSense4Unix ao invés de só hefesto?"* | `interface/ver.py:158` — `barra.set_title("Hefesto")` |
| 3 | *"Não conseguimos centralizar a interfcace? tipo o bloco que contém todos os demais elementos"* | `interface/topo.html:119-123` (`body`) e `:186-191` (`.janela`) |
| 4 | *"Leia o cabo e acordado (ambos minusculo sem iniciar de forma capitular)"* | a fita do topo — o `CABO` sai maiúsculo no seletor de controle |
| 5 | *"o touchpad não reconhece os toques quando usamos dois ou mais dedos. Mas o produto já reconhece e funciona corretamente"* | aba Controles — o bloco `Touchpad` do cartão |
| 6 | *"aqui deveria aparecer o nome e o codigo não só o codigo e não deveria aparecer o nome do programa"* | o `datalist` do campo «Nome do Jogo» (`a10_perfis.py:1344-1353`) |
| 7 | *"seria legal nome do programa launcher aqui… remove jogo da steam, jogo, jogo pela janela, estilo de jogo, e colocariamos os launchers"* | o campo «Funciona em:» da aba Perfis |

**O item 1 é o mais grave e vem primeiro**: um tooltip que não abre apaga toda
a explicação da tela de uma vez — e é justamente onde a §0 manda cortar texto.
Cortar a prosa das dicas enquanto elas não aparecem seria melhorar o que
ninguém lê.

**O item 4 é uma REGRA, não um caso.** Palavra dela: *"Esse tipo de coisa não
pode se repetir na interface."* Quem fechar o item 4 entrega junto a régua que
varre as dez páginas atrás de maiúscula decorativa.

---

## §3 — AS FRENTES, e a posse é por ARQUIVO

Nenhuma frente divide arquivo com outra da mesma onda — é o que deixa elas
correrem juntas. O portão `colisao-de-sprints` confere.

### ONDA A — A LÍNGUA DA TELA · cinco agentes, e o número é dela

> *"Preciso que mande uns 5 agentes vistoriarem toda a interface, aba a aba*  <!-- noqa-acento: citação literal dela -->
> *procurando deixar o texto mais direto, menos confuso e numa linguagem*  <!-- noqa-acento: citação literal dela -->
> *universal e rápida pro user."*  <!-- noqa-acento: citação literal dela -->

| frente | abas | escreve em |
| --- | --- | --- |
| **A1** | Sistema (09) · Conexões (08) | `aba09.py` · `a09_sistema.py` · `aba08.py` · `a08_conexoes.py` · `mockup/08` · `mockup/09` |
| **A2** | Lançadores (07) | `aba07.py` · `a07_lancadores.py` · `desenho_dos_lancadores.py` · `mockup/07` |
| **A3** | Jogar (01) · Controles (02) | `aba01.py` · `a01_jogar.py` · `aba02.py` · `a02_controles.py` · `mockup/01` · `mockup/02` |
| **A4** | Gatilhos (03) · Iluminação (04) · Vibração (05) | `aba03.py` · `a03_gatilhos.py` · `aba04.py` · `a04_iluminacao.py` · `aba05.py` · `a05_vibracao.py` · os três mockups |
| **A5** | Navegação (06) · Perfis (10) | `aba06.py` · `a06_navegacao.py` · `aba10.py` · `a10_perfis.py` · `mockup/06` · `mockup/10` |

**A ORDEM NÃO É ALFABÉTICA, e a razão é dela**: *"Melhorias nesse sentido são
bem vindas principalmente em abas como Sistema. Conexões. Lançadores."* — A1 e
A2 são as três que ela nomeou, e por isso são as duas primeiras.

### ONDA B — AS PÁGINAS ESPECIAIS

> *"temos as páginas especiais. Como calibração de sensores. mapa do controle.*  <!-- noqa-acento: citação literal dela -->
> *Definição de Controle e mouse, remapeamento, configurar point and click*  <!-- noqa-acento: citação literal dela -->
> *entre outras. Preciso que sejam analisada também."*  <!-- noqa-acento: citação literal dela -->

| frente | o quê |
| --- | --- |
| **B1** | o INVENTÁRIO primeiro: quantas são, onde moram, quais abrem hoje e quais não; depois a mesma vistoria de língua da onda A |

**B1 COMEÇA POR CONTAR**, e não por escrever: nenhum documento desta casa diz
quantas páginas especiais existem. Um agente que comece a reescrever texto sem
a lista reescreve as que achar e declara a aba inteira revista.

### ONDA C — OS DEFEITOS DA §2

| frente | itens |
| --- | --- |
| **C1** | o tooltip que não abre (item 1) — atravessa as dez abas, e por isso é frente própria |
| **C2** | o título da janela, a centralização e a maiúscula decorativa (itens 2, 3, 4) — os três moram no esqueleto |
| **C3** | o touchpad com dois ou mais dedos (item 5) |
| **C4** | o campo «Nome do Jogo» e o «Funciona em:» (itens 6, 7) — os dois na aba Perfis |

### ONDA D — A AUDITORIA QUE ELA ENCOMENDOU

> *"agora que finalmente deixamos o modo BT totalmente pareado com o modo cabo.*  <!-- noqa-acento: citação literal dela -->
> *Incluindo até os sons e mic (…) e se essas features vão funcionar nos jogos.*  <!-- noqa-acento: citação literal dela -->
> *Preciso de uma auditoria nesse sentido pra procurar por falhas de conexões e*  <!-- noqa-acento: citação literal dela -->
> *afins"*  <!-- noqa-acento: citação literal dela -->

| frente | o quê |
| --- | --- |
| **D1** | feature a feature, cabo × rádio, **e a terceira coluna que ninguém mediu: DENTRO DO JOGO**. Giroscópio, acelerômetro, microfone (virtual e nativo), alto-falante, gatilhos, vibração, luz, touchpad |

**A TERCEIRA COLUNA É O PONTO DA D1.** O mapa de canais (`docs/data/mapa-controles.csv`)
já responde cabo × rádio linha a linha. O que ele **não** responde é se a
feature sobrevive ao jogo — e é exatamente isso que ela perguntou. A D1 entrega
laudo, não código.

### ONDA E — OS PERFIS DOS OUTROS LANÇADORES

Pedido dela mais cedo hoje, e ele **está medido e parado numa decisão**:

> *"os demais jogos de outros lançadores deve aparecer um perfil*  <!-- noqa-acento: citação literal dela -->
> *automaticamente aqui na nossa guia de perfil. Pode fazer isso?"*  <!-- noqa-acento: citação literal dela -->

**Pode, e o caminho inteiro já existe.** Medido hoje:

* quem cria perfil sozinho é `profiles/loader.py:1298` (`semear_perfis_dos_jogos`),
  e ele lê **só** `jogos_da_biblioteca_steam` — não há equivalente para
  lançador nenhum;
* o censo dos outros já está pronto e vivo: `integrations/censo_dos_lancadores.py`
  lê Heroic, Lutris, RetroArch, Dolphin e mGBA, e `jogos_locais.py:498`
  (`jogos_dos_lancadores`) já os traduz para o mundo dos perfis;
* o `match` que serve **já é o mesmo**: `MatchCriteria(window_class=[…])`, a
  sexta forma `"janela"` de `profiles/simple_match.py:271`;
* a JOGOS-DOS-LANCADORES-01 (feita hoje) entregou a SUGESTÃO e o «Detectar»
  para esses jogos — só não entregou a semeadura, porque ela é decisão dela.

**O QUE FALTA É UMA PALAVRA DELA, e está na §4.** E uma dívida de código que a
E1 leva junto: `schema.py:1799` recusa perfil de jogo que não seja
`steam_app_<id>` na troca automática — sem isso, o perfil do Heroic nasce e não
entra quando ela abre o jogo.

---

## §4 — O QUE É DELA, e nenhuma frente começa sem

| # | a pergunta | por que é dela |
| --- | --- | --- |
| **1** | **Os nomes das três rotas do som.** «Ouvir junto» e «Todo o som do PC» não dizem de onde o som SAI, e foi isso que confundiu. Ex.: «No controle e na TV» · «Só no controle». | é a palavra da tela, e a §0 é sobre exatamente isso |
| **2** | **A semeadura dos outros lançadores**: (A) nasce perfil para todo jogo instalado do Heroic/Lutris assim que o produto o vê; (B) nasce quando ela abre o jogo pela primeira vez; (C) fica como está — só sugestão no campo. | hoje vale (C). (A) enche a lista dela de 27 para ~60 de uma vez |
| **3** | **O «Funciona em:»**: ela mandou tirar quatro opções e pôr os lançadores. Isso muda o que um perfil SABE casar — não é só rótulo. | muda comportamento, não texto |

**A 1 e a 2 travam a C1/A3 e a E1. A 3 trava a C4.** As outras frentes correm
sem elas.

---

## §5 — O PROCESSO, e ele é ordem dela

> *"preciso que vc vá me mostrando a tela do antes e depois dos agentes. Pra*  <!-- noqa-acento: citação literal dela -->
> *apresentarem as propostas tá bom? Tudo em dev. E vc vai arrumando as branchs*  <!-- noqa-acento: citação literal dela -->
> *e unificando tudo no final e arrumando o install."*  <!-- noqa-acento: citação literal dela -->

1. **AS ONDAS A e B ENTREGAM PROPOSTA, NÃO COMMIT DE TELA.** O agente mede,
   fotografa o ANTES, escreve a tabela `frase de hoje → frase proposta → por
   quê`, e para. Quem mostra a ela sou eu; quem aprova é ela; só então a frase
   entra no gerador.
2. **AS ONDAS C, D e E EXECUTAM** — a C são defeitos (não há o que propor), a D
   é laudo, a E espera a §4.2 e então executa.
3. **Uma branch por agente** (`voo/<FRENTE>-01-opus`), árvore própria. Ninguém
   toca em `dev`, ninguém faz merge. A integração é minha, em árvore própria.
4. **A tela dela é uma só.** `--oculta` em toda janela; o portão `a-tela-dela`
   reprova quem esquecer.
5. **Curar o mockup não cura o produto**: sem `--publicar NN` a tela dela não
   muda.
6. **A FOTO É ENTREGA**, antes e depois, na vista dela (1918x840). Uma proposta
   de texto sem a foto do antes não tem como ser julgada.
7. **O fecho é meu**: costura → `bash scripts/portoes.sh` todos verdes → a suíte
   por `scripts/rodar-a-suite.sh` → merge em `dev` → `install.sh` → push.

---

## §6 — O QUE ESTA ONDA NÃO FAZ

* **Não traduz nada.** A §0 diz *"não agora obviamente"*. O que se faz aqui é
  deixar o texto TRADUZÍVEL — curto, literal, sem figura de linguagem.
* **Não acrescenta feature**, nem tela, nem botão. Palavra dela.
* **Não mexe na janela GTK**, que saiu do disco em 06/09.
* **Não toca no `mockup/` sem publicar**, nem publica sem o olho dela.
