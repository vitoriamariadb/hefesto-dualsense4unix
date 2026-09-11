# ILUMINACAO-PALETA-01 — três tons saem da guia, e a casa hachurada vai junto

**Agente:** opus · **Data:** 11/09/2026 · **Branch:** `voo/ILUMINACAO-PALETA-01-opus`
· **Base:** `onda/0911` (`779c71f8`)

> *"temos que remover esse botão que o mouse tá (que abre outras cores.) remover
> um tom de azul. um tom de rosa e o tom de preto de todas as cores pros 4
> controles. isso deve dar um desafogo horizontal legal pra página."*

---

## O que mudou

**A fileira de tons tem ONZE casas, e a casa hachurada do fim não existe mais.**
Era catorze tons mais o campo de cor do sistema; são onze botões, em cada um dos
quatro lugares da grade. Publicado — `--publicar 04` — então a tela dela muda.

**QUAL AZUL E QUAL ROSA foi MEDIDO, não escolhido a gosto** (§3 da sprint). O
critério é a distância de matiz: sai o tom mais perto do vizinho que fica. Os
catorze fecham o círculo de 30 em 30 graus, então os vãos alternam 29,88° e
30,12°, e é isso que decide:

| candidato | matiz | vizinho mais perto | é automático? | |
| --- | ---: | ---: | --- | --- |
| `#0000FF` | 240,00° | 30,12° | sim, Player 1 | fica |
| `#0080FF` | 209,88° | **29,88°** | não | **SAI** |
| `#FF0080` | 329,88° | 29,88° | sim, Player 4 | fica |
| `#FF00FF` | 300,00° | 29,88° | não | **SAI** |
| `#000000` | — | — | não | **SAI** (é o único preto) |

O azul se decide sozinho pela medida. **O rosa EMPATA em 29,88°**, e o desempate
foi a §2 — *"o corte é na metade 2"* — com a razão de produto que ela mesma
escreve: tirar da metade automática tiraria da guia a cor de um jogador, e um
controle no número 4, na cor automática, deixaria de ter tom marcado na fileira.
O segundo número concorda: tirar o `#FF00FF` abre um vão de **59,76°** entre os
que ficam, e tirar o `#FF0080` abre **60,00°**.

**A poda é de TELA, não do daemon.** `core/led_control.player_slot_color`
continua devolvendo as oito cores automáticas e `monta.TOM_DA_CASA` continua
conhecendo os catorze — os dois estão em `nao_toca`, e não foram tocados. Quem
filtra é `a04_iluminacao.FORA_DA_GUIA`, e ele **recusa dizendo** duas coisas: um
hex que `TOM_DA_CASA` não conhece (não tiraria nada — linha morta parecendo
decisão) e um hex que é cor automática de jogador (`titulo_da_casa` numera as
oito primeiras casas pela POSIÇÃO; tirar uma da frente faria a nona dizer o nome
da oitava).

**O gesto da casa hachurada morreu inteiro**, que é o item 3 da §4: o widget, as
quatro regras de CSS, a entrada do mapa de cobertura do lugar sem dono, a régua
§4 que exigia o `value` preto, e **a segunda porta do gesto `cor`** — a queda
pelo `valor`. Deixar a queda seria *peça com chamador e sem tela*: um caminho
que nenhum elemento da página alcança, aceitando calado carga que ninguém
desenhou. Hoje `cor` sem `data-hex` **recusa dizendo**.

`_so_abriu_o_seletor` **fica**: o `brilho` e o `auto-cores` o chamam pelo mesmo
motivo com o tempo invertido. A medição de 02/09 que o justificava ficou
escrita, porque é a razão de ele existir.

**UM ACHADO QUE NÃO ESTAVA NA SPRINT, e ele seria uma regressão minha.**
`cor_escolhida` varria `tons_da_guia()` para inverter o brilho e descobrir qual
cor ela PEDIU. Com três tons fora da guia, um perfil dela já salvo no `#0080FF`
a 50% de brilho passaria a mostrar `#004080` na caixa `#RRGGBB` — uma cor que ela
nunca pediu, **por causa de uma poda de tela**. A varredura passou a ser
`monta.TOM_DA_CASA`, os catorze: o que essa função inverte é *o que o produto
pode ter ACESO*, não *o que a guia oferece hoje*. Poda de guia não reescreve o
passado do disco dela.

**Texto de tela:** a dica da célula `Cor` dizia *"os oito quadradinhos"* e *"o
nono é o livre"* — **as duas frases já estavam velhas** (a fileira tinha catorze
desde 09/09). Passou a dizer *"os oito primeiros"* (que é estrutura,
`player_slot_color(1..8)`) e *"os demais"*, que nunca mente. Nenhum número
digitado.

**O CSV da paridade com a GTK**, linha `[04-iluminacao] Escolher uma cor livre
(paleta do sistema)`: era `IGUAL`, virou `FALTA_NO_HTML` — **e não é
regressão**, é a ordem dela. O `sinal` volta a ser o símbolo da GTK
(`_on_lightbar_cor_solta`) PORQUE a expectativa virou `AUSENTE`: com
`FALTA_NO_HTML` quem morde é a regra `divida-fechada`, e ela morde quando o lado
HTML PASSA a chamar a função da janela antiga — a forma legítima descrita na
regra 7 do próprio portão. A tabela publicada foi regerada junto
(04-iluminacao 29% → 26%; TODAS segue 36%).

### A MEDIÇÃO DO DESAFOGO — e ela derrubou a linha que a pediu

Ponte JS (WebKitGTK, `scripts/regua_de_tela.py`), janela oculta no Xvfb, página
**publicada**:

| | antes | depois |
| --- | ---: | ---: |
| **largura renderizada da coluna** | 236,50 px | **236,50 px — NÃO CAIU** |
| min-content da coluna (P1 / P2) | 151,00 / 151,00 px | 128,97 / 133,67 px |
| min-content da fileira de tons | 130,00 px | **64,00 px** |
| casas na fileira | 14 + 1 campo de cor | 11 |
| largura de cada tom | 10,23 px | **15,77 px** |

**A §4 item 1 dizia *"se a largura não cair, a entrega não cumpriu o pedido
dela"*, e a largura NÃO CAIU — mas a premissa da sprint é que caiu junto.** A
grade é `grid-template-columns: var(--larg-rot) repeat(4,1fr)` numa janela de
1180 px fixos: as quatro colunas dividem o que sobra, e o min-content de uma
coluna (151 px) já estava **muito abaixo** da fatia de 1fr (236,5 px). Nenhuma
poda de tons pode estreitar essa coluna; só uma janela mais estreita chegaria
ao piso.

**O que CAIU foi a pressão, e ela é o número que a §1 descreve.** A fileira de
tons é o que mais pede largura dentro da coluna: 130 dos 151 px de min-content
eram dela, e agora são 64 — **metade**. O piso da grade inteira caiu de 692 px
para 653 px. E o desafogo que o olho vê é o tom: de 10,23 px para 15,77 px,
**+54%** por casa, com a fileira deixando de ser quinze lasquinhas.

---

## Qual mordida prova

**1. Devolver um tom podado** (`FORA_DA_GUIA` sem o `#0080FF`) — o gerador
recusa e **não deixa estrago no disco**:

```
rc=1
a saída recusada ficou em 04-iluminacao.html.recusado; 04-iluminacao.html voltou ao desenho aprovado
ERRO em 04-iluminacao — decisão dela desfeita:
  - a poda da guia mudou sem esta régua saber: o pacote tira ('#FF00FF', '#000000')
    e a ordem dela de 11/09/2026 era ('#0080FF', '#FF00FF', '#000000') — um azul, um rosa e o preto
  - o tom #0080FF voltou à fileira — ela mandou os três saírem de todos os quatro controles em 11/09/2026
```

md5 do mockup antes da mordida: `a450aebe…` · depois da recusa: `a450aebe…`.

**A RÉGUA FOI ESCRITA ERRADA DA PRIMEIRA VEZ, e a mordida é que mostrou.** Ela
lia `FORA_DA_GUIA` para conferir `FORA_DA_GUIA` — *uma trava que se mede contra
a própria saída não trava nada*, o defeito de 08/09 em que o CSV perdia cinquenta
colunas com a régua verde. Os três hexes estão DIGITADOS na §15 de propósito, e
o cruzamento com o dono é a primeira asserção.

**2. Devolver a casa hachurada** (o campo de cor de volta no gerador):

```
rc=1
ERRO em 04-iluminacao — decisão dela desfeita:
  - a casa hachurada do fim da fileira voltou — e o gesto dela morreu junto
    em 11/09/2026, então ela seria um clique sem resposta
```

**3. Devolver a queda pelo `valor` ao gesto** e **arrancar a recusa da poda**
(`if False and automaticos_podados`):

```
FAILED tests/unit/test_a_iluminacao_diz_o_numero_certo.py::test_a_casa_hachurada_saiu_e_o_gesto_nao_aceita_cor_sem_tom
FAILED tests/unit/test_a_iluminacao_diz_o_numero_certo.py::test_a_poda_da_guia_recusa_dizendo_o_que_nao_pode_podar
E       Failed: DID NOT RAISE ValueError
2 failed, 39 deselected
```

Com as curas devolvidas: `132 passed`, e os **709 testes** de todo arquivo que
toca a aba 04 passam (`709 passed, 1 skipped, 4 xfailed`).

**O CLIQUE, na página PUBLICADA, com o BOOTSTRAP real do piloto dentro da
ponte** — porque um botão que eu tirei do lado de outro tem de continuar sendo
ouvido:

```
casas da fileira  : 44          (era 56)
campos de cor     : 0           (era 4)
último item       : button .tom #FFFFFF      (era: input .livre, sem data-hex)
clique i=0 → {"gesto":"cor","hex":"#0000FF", …}
clique i=4 → {"gesto":"cor","hex":"#FFFF00", …}
```

**O INSTRUMENTO MENTIU PRIMEIRO, e o controle é que mostrou.** `regua_de_tela`
sozinha dá `TelaMuda: 0 recado(s)` no clique — **e dá igual na página de ANTES
da minha mudança**, que é o controle. O BOOTSTRAP que ouve gesto é injetado pelo
PILOTO em tempo de execução, não nasce na página; sem ele, a régua acusaria
botão morto sobre uma fileira viva. Está posto aqui porque a próxima pessoa vai
tropeçar nele.

**A FOTO** (antes/depois, janela oculta, `Gtk.OffscreenWindow` no Xvfb — a tela
dela não recebeu nada): a fileira sai de quinze lasquinhas com o losango
tracejado no fim para onze tons largos. Os PNGs ficaram fora da árvore, no
berço da sessão.

---

## O que NÃO verifiquei

- **O aparelho.** Esta sprint é `bancada: false` e não mexe em nenhum byte que
  vá ao DualSense: nem o report, nem o payload, nem o caminho do daemon. Não
  reservei a bancada e não medi nenhuma célula do mapa. As células de
  `luz.lightbar@dualsense` e `luz.lightbar.brilho@dualsense` continuam onde
  estavam — **eu não as exercitei, e não afirmo nada sobre elas**.
- **O olho dela.** §5 da sprint: a escolha do par é dela. Se ela olhar a foto e
  disser que o azul errado saiu, a troca é de um hex em `FORA_DA_GUIA` mais a
  mesma linha na §15 — as duas de propósito, para a mudança custar a palavra
  dela e não passar calada.
- **A janela estreita.** Medi o min-content, que é o piso; **não** medi a página
  num tamanho em que esse piso valha. A janela tem `set_size_request` de 1212 px
  e nunca chega lá hoje.
- **A suíte inteira.** Rodei o meu escopo (os 34 arquivos de teste que tocam a
  aba 04). A suíte é de quem coordena, e roda no fim.
- **As outras nove abas.** Não as gerei nem as publiquei.

---

## O que sobrou para o próximo

1. **A largura da coluna só cai se a GRADE mudar, e isso é decisão de tela —
   dela.** Enquanto for `repeat(4,1fr)` numa janela fixa, a coluna vale 236,5 px
   com catorze tons ou com um. Se o que ela quer é a coluna mais estreita (e não
   a fileira mais folgada), o caminho é a grade passar a ser dirigida pelo
   conteúdo — e aí o número que manda é o min-content, que esta leva derrubou de
   151 para 129/134 px. **Não fiz, e não é minha:** muda a proporção da aba
   inteira.
2. **A cor podada que um perfil antigo guarda não tem mais casa na fileira.** Um
   controle salvo no `#0080FF`, `#FF00FF` ou `#000000` acende certo, a caixa
   `#RRGGBB` diz o hexa certo (foi o que a cura de `cor_escolhida` garantiu), e o
   reenvio pela caixa funciona — mas **nenhum tom fica marcado com o `.on`**,
   porque a cor não está mais na guia. É o mesmo estado que uma cor global de
   perfil sempre teve. Se ela quiser que a fileira diga *"a cor deste controle
   não está aqui"*, é tela nova e é dela.
3. **A régua `paridade-gtk-html` linha 125 vai encolher de novo** quando a GTK
   sair do disco: `lightbar_actions.py` ainda existe e é o que segura o `sinal`
   desta linha. No dia em que ele for, a linha precisa de outra forma — e as
   outras 29 `FALTA_NO_HTML` que apontam para a janela antiga também.
4. **As seis células que o portão AVISA** (`luz.lightbar.brilho@dualsense`, cabo
   e rádio, `causa=nao-medido`) continuam na fila da bancada. A tela AFIRMA
   paridade e ninguém remediu — é trabalho da `MESA-DE-QUATRO-01` com o aparelho
   na mesa, e o mapa INFORMA, nunca VETA.
