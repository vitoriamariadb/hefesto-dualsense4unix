---
sprint: ONDA5-03-01
decisoes: 03-Q4 (a metade do PILOTO)
posse:
  Q4-piloto:
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
    - tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py
depois_de: [MIGRA-CONTROLES-03, ONDA0-P-O-PILOTO-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - mockup/
  - docs/data/paridade-gtk-html.csv
---

# ONDA5-03-01 · DESENHO — o campo que pisca, e o número do voo que já o endereça

> **A decisão dela, 05/09/2026, pergunta `03-Q4` — "A tela avisa quando deu certo"**
>
> Ela escolheu **"O campo pisca em verde"**, e o efeito que ela leu ao escolher
> está escrito na opção:
>
> > *"O campo que você acabou de mexer ganha uma borda verde por cerca de um
> > segundo e meio e volta ao normal sozinho; nada muda de lugar e **nenhuma
> > palavra nova entra na tela**."*
>
> **E ela recusou, na mesma pergunta, o que o produto faz HOJE.** A opção
> *"Tarja verde curta na coluna"* descrevia o canal vivo com a frase viva dele —
> *"a mesma caixa dos avisos de recusa, em verde, com a frase (`Gatilho esquerdo
> (L2): Metralhadora`)"*. Não é uma proposta que ela recusou: é o produto.

**O alcance passa desta aba.** O canal de "deu certo" é um só para as dez
(`hefesto_vivo._deu_certo_dizendo`, `:2218`), então esta sprint é a metade do
piloto e vale para todas. A metade da aba 03 é a `ONDA5-03-02`, e ela vem
depois desta.

---

## 1. O FATO ERRADO QUE ESTA SPRINT SUBSTITUI, e ele está escrito em dois lugares

O código afirma que **ELA** recusou o campo que pisca:

```
DUAS RECOMENDAÇÕES PROPUNHAM OUTRO CANAL e as duas foram recusadas por
ela no mesmo dia (os conflitos C-3 e C-6): *o campo que pisca*, na aba
03, e *a faixa embaixo da grade*, na 05. **Não construa nenhum dos dois.**
```
— `src/hefesto_dualsense4unix/interface/hefesto_vivo.py:2230-2232`

E a régua repete a afirmação no cabeçalho, com a mesma força:

```
DOIS SEGUNDOS CANAIS FORAM RECUSADOS POR ELA NO MESMO DIA, e esta régua existe
também para que ninguém os construa: *o campo que pisca* (aba 03, conflito C-3)
```
— `tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py:18-20`

**É falso, e a fonte diz quem decidiu.** O C-3 é do PO, não dela:

> *"estude o projeto sozinho. entenda tudo. Depois seja o po e orquestrador"* —
> e a regra que o PO seguiu: *"onde a recomendação escrita não contradiz nenhuma
> decisão dela, eu a adoto … Onde contradiz, **ela ganha**"*.
> — `docs/process/2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md`, §1

O C-3 não foi palavra dela sobre a piscada: foi o PO lendo a **D-01** (*"No
próprio cartão, como a recusa"*) como se ela fechasse a forma. Em 05/09 ela
respondeu a pergunta diretamente, vendo as quatro formas lado a lado, e escolheu
outra. **A palavra dela vence a leitura que o PO fez da palavra dela.**

Este parágrafo não se apaga: ele é decisão medida, e o que sobra dele continua
valendo — **um fato, um sinal**. O que caduca é a atribuição e a ordem *"não
construa"*. Deixe as duas metades separadas, com a data, como a `D-17` fez com o
docstring do silêncio.

---

## 2. O QUE JÁ EXISTE — e a peça que falta é menor do que parece

**O endereço do "campo que ela acabou de mexer" JÁ ESTÁ CARIMBADO.** O ouvinte
marca o elemento clicado antes de a mensagem sair para o Python:

```js
  function em_voo(el){
    const n = String(++window.__hef.voo);
    el.setAttribute('data-hef-voo', n);
    el.classList.add('hef-em-voo');
```
— `hefesto_vivo.py:801-804`, chamado em `:1054` (`const voo = em_voo(alvo);`)

E o mesmo número devolve o elemento no fim:

```js
    for(const el of document.querySelectorAll('[data-hef-voo="' + chave + '"]')){
      el.classList.remove('hef-em-voo');
```
— `hefesto_vivo.py:824-825`, disparado por `_pousou` (`:2129`), agendado em
`:2125` no `finally` dos três desfechos.

**Isto é a metade cara da sprint, e ela está paga.** Não há endereço novo a
inventar, não há `data-` novo no desenho das dez páginas, e a piscada pousa
exatamente onde ela clicou porque é o mesmo nó que o "em voo" já veste.

**A folha de estilo também já é do módulo**, e vale nas dez abas sem republicar
desenho nenhum:

```python
FOLHA_DA_CASA = (
    ".nota{display:none !important}"
    "select{appearance:none;-webkit-appearance:none}"
    ".hef-em-voo{opacity:.6 !important;cursor:progress !important}"
)
```
— `src/hefesto_dualsense4unix/gui/ponte_da_tela.py:148-152`

**O `!important` não é exagero, e o número é medido** (`ponte_da_tela.py:135-141`):
sem ele o `cursor` saiu `pointer` e não `progress`, porque folha de USUÁRIO perde
para o autor em declaração normal. As dez páginas declaram borda nos campos: a
borda verde da piscada **precisa do `!important` pela mesma razão**, e quem não o
puser vai ver a régua passar e o olho não ver nada.

E a cor tem dono: `--green:#50fa7b` (`src/hefesto_dualsense4unix/interface/topo.html:34`),
já usada com o mesmo fallback pelo canal de sucesso —
`'color:var(--green,#50fa7b);border-color:var(--green,#50fa7b);'`
(`hefesto_vivo.py:647-648`). **Não digite uma segunda verde.**

---

## 3. O TRABALHO, EM CINCO PASSOS

### Passo 1 — a classe da piscada nasce na folha do módulo

`ponte_da_tela.py:148-152`. Uma linha a mais no `FOLHA_DA_CASA`, com o
`!important` e a cor do dono:

```
.hef-deu-certo{border-color:var(--green,#50fa7b) !important;
               outline:1px solid var(--green,#50fa7b) !important}
```

O `outline` está aí porque **nada pode mudar de lugar** — é metade da decisão
dela (*"nada muda de lugar"*), e uma borda mais grossa empurraria o vizinho. Se
a medição mostrar que a `border-color` sozinha já se vê nos cinco tipos de campo
(`<select>`, `<input type="range">`, `<input type="text">`, `<button>` e o
embrulho), corte o `outline`: menos é melhor.

**A MORDIDA:** arranque o `!important` e a foto do Passo 5 mostra o campo sem
borda verde — é exatamente o defeito que o `cursor:pointer` já produziu em
04/09, um degrau antes.

### Passo 2 — o pouso sabe o desfecho

`hefesto_vivo.py:2125`, no `finally` do `_gesto`. Hoje o pouso é cego:
`GLib.idle_add(lambda v=voo: self._pousou(v))`. Ele passa a levar se o gesto
voltou sem levantar — o ramo `else` do mesmo `try` já anota `("aplicou", "")`
em `self.desfechos` (`:2111`), e é esse o fato.

`_pousou` (`:2129`) ganha o segundo parâmetro e o repassa ao JS:
`window.__hef.voltouDoVoo(n, certo)`.

**O `finally` continua sendo o dono do pouso**, e a razão escrita ali continua
valendo: um gesto que levante fora do contrato deixaria o botão "trabalhando"
para sempre. Não mova o pouso para o `else`.

**A MORDIDA:** devolva `_pousou(voo)` sem o desfecho e
`test_a_piscada_nao_acende_na_recusa` (§4) reprova — o campo pisca verde sobre
uma recusa laranja, que é a tela dizendo as duas coisas de uma vez.

### Passo 3 — `voltouDoVoo` acende o verde, e ele apaga sozinho

`hefesto_vivo.py:821-834`. O laço que hoje tira o `hef-em-voo` passa a, quando
`certo`, pôr `hef-deu-certo` e agendar a retirada em **1500 ms** — o número é
dela (*"cerca de um segundo e meio"*), e ele vira constante ao lado das outras
duas que já têm dono (`SEGUNDOS_DO_RECADO = 30.0` em `:132`,
`SEGUNDOS_DO_RECADO_DE_SUCESSO = 6.0` em `:145`). **Ele não é 6,0 s**: o recado
verde é frase a ler, a piscada é sinal a ver.

**O `querySelectorAll` e não uma referência guardada** — a razão está em
`:817-820` e continua valendo palavra por palavra: entre o clique e a volta a
pintura pode ter trocado o bloco inteiro.

**A MORDIDA:** não agende a retirada e `test_a_piscada_apaga_sozinha` (§4)
reprova. Um campo que fica verde para sempre afirma um clique de dez minutos
atrás — é a mesma doença do botão que fica em voo, que este arquivo já nomeia.

### Passo 4 — sem notícia não entra palavra na tela

`hefesto_vivo.py:2254`:

```python
        self._depositar(uniq, frase or FRASE_DE_SUCESSO, "sucesso")
```

Esta linha é o *"Pronto."* — a palavra nova que a decisão dela tira da tela. Ela
passa a depositar **só quando o gesto trouxe frase**:

* **gesto sem `recado`** → nada é depositado; a piscada é a resposta inteira.
* **gesto com `recado`** → o cartão verde, exatamente como hoje. É onde pousa a
  `D-12` (*"o microfone ligou, mas o canal dele está mudo no sistema"*) e onde
  pousa a decisão de hoje sobre as duas metades
  (`docs/process/sprints/2026-09-05-AS-DUAS-ABAS-FALAM-01-o-aparelho-recebeu-e-o-perfil-nao-guardou.md`).

**A REGRA QUE ISSO ESCREVE, e ela é a que a `ONDA5-03-02` vai obedecer:**
*quando o gesto só repete o que ela acabou de fazer, a tela pisca; quando ele
tem NOTÍCIA, a tela fala.* O canal continua sendo um só — o que muda é que ele
para de falar sobre o que não tem o que dizer.

`FRASE_DE_SUCESSO` (`:158`) fica **sem chamador de produto**. Medido: os dois
usos são esta linha e a régua (`test_o_recado_de_sucesso_pousa_no_cartao.py:218`).
Apague a constante junto, e note no commit que a palavra "deu certo" da janela
GTK tem outro dono e não é tocada (`app/actions/daemon_actions._SYSTEMCTL_OK_MSG`,
citado em `hefesto_vivo.py:150`).

**A MORDIDA:** deixe o `or FRASE_DE_SUCESSO` e `test_o_sucesso_calado_pisca_e_nao_fala`
(§4) reprova, lendo o `"Pronto."` no DOM.

### Passo 5 — a razão fica escrita onde a ordem contrária estava

`hefesto_vivo.py:2230-2232` e `test_o_recado_de_sucesso_pousa_no_cartao.py:18-20`.
Substitua a atribuição (§1) e separe o que caduca do que fica:

* **um fato, um sinal** — vale, e é a razão inteira de o canal do cartão não se
  duplicar;
* **"ela recusou o campo que pisca"** — a atribuição e a ordem — caducaram em 05/09/2026, pergunta `03-Q4`.
  Quem recusou foi o PO, lendo a D-01; ela decidiu o contrário vendo as quatro
  formas.
* **e a piscada não é um segundo canal para o mesmo fato** — é o mesmo fato num
  sinal mais barato: o cartão passa a dizer só o que tem notícia, e as duas
  peças deixam de disputar.

---

## 4. AS RÉGUAS — e o arquivo que já existe muda de pergunta

`tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py` abre um WebKit de
verdade com o piloto do produto, clica no botão da página publicada e lê o DOM
(`:22-28`). **É a bancada certa, e ela não é substituível por dublê** — a razão
está no próprio cabeçalho e é a lição de 02/09.

**Um teste dele reprova de propósito quando esta sprint entrar:**

```python
def test_a_frase_de_sucesso_chega_ao_dom(medido: dict) -> None:
```
— `:422-430`. Ele asserta que `"Pronto."` chega ao DOM depois de um clique que
deu certo **e não trouxe frase** — que é exatamente o caso que passa a piscar.
Não o apague: **inverta a pergunta e mantenha a medição**, porque o defeito de
origem (*o gesto deu certo e a tela ficou muda*) continua sendo o que ele guarda.
Ele vira `test_o_sucesso_calado_pisca_e_nao_fala`, com duas asserções: o DOM
sem frase nenhuma, e o campo com a classe.

**Não faça substituição em massa neste arquivo.** *"Substituição em massa sobre
uma régua é edição cega; cada uma tem de ser lida"* — a lição das dezoito
réguas de 05/09, e duas foram devolvidas por isso. Estes quatro continuam
valendo sem uma letra alterada, e são o "nada se perdeu" do canal:

| régua | linha | por que continua |
| --- | --- | --- |
| `test_a_frase_do_dono_vence` | `:485` | frase é notícia; notícia continua indo ao cartão |
| `test_o_recado_nao_vira_endereco_de_pagina` | `:493` | o `recado` continua saindo da carga antes da pintura |
| `test_o_sucesso_e_verde_e_a_recusa_e_laranja` | `:458` | os dois tons do cartão não mudam |
| `test_o_prazo_do_sucesso_e_menor_que_o_da_recusa` | `:517` | os 6 s e os 30 s continuam sendo dela |

**As quatro réguas novas, e as quatro mordem em lugares diferentes:**

1. **`test_o_sucesso_calado_pisca_e_nao_fala`** — clique que dá certo sem
   `recado`: o campo ganha `hef-deu-certo`, e `_frases(...) == []`. Sem a
   segunda metade, o Passo 4 poderia entrar com o `"Pronto."` ainda na tela.
2. **`test_a_piscada_apaga_sozinha`** — ~1,5 s depois, a classe saiu e o campo
   voltou ao que era. Meça também que o `data-hef-voo` não ficou para trás: um
   atributo órfão faria o pouso seguinte achar dois elementos.
3. **`test_a_piscada_nao_acende_na_recusa`** — com o dublê que faz o gesto
   levantar `RuntimeError`, o cartão fica laranja e o campo **não** tem a
   classe. É a que prova o Passo 2.
4. **`test_o_pisca_nao_move_a_tela`** — a geometria do campo antes e depois, na
   mesma unidade. É a metade da decisão dela que nenhuma das outras três mede
   (*"nada muda de lugar"*), e é o que separa o `outline` da borda grossa.

**E confira o dublê contra o real.** Três dos vermelhos de 05/09 eram dublê mais
frouxo que a função viva. O gesto de mentira desta régua devolve
`{"recado": …, "mesa": {...}}` no caso da frase do dono (`:288-289`) e **nada**
no caso calado — os dois caminhos existem no arquivo e são os dois que esta
sprint separa.

---

## 5. O QUE MEDIR ANTES DE FECHAR, e é o único ponto que pode derrubar o desenho

**Um dos cinco tipos de campo tem o elemento RECRIADO pela pintura**, e é o
`<input type="range">` do gesto `ajuste` da aba 03. A caixa de ajustes é um
BLOCO, e a pintura troca o miolo dela:

```js
    for(const [seletor, html] of Object.entries(p.blocos || {})){
      const alvo = document.querySelector(seletor);
      if(alvo && alvo.innerHTML !== html){ alvo.innerHTML = html; n += 1; }
    }
```
— `hefesto_vivo.py:898-900`, com o seletor emitido em
`src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py:2125`
(`[data-controle="…"] .ajustes.<sigla>`).

**A troca só acontece quando o HTML MUDA** — e ele muda exatamente no tique
seguinte a um `ajuste` que deu certo, porque o `value` da alavanca é atributo
(`a03_gatilhos.py:1176`). O pacote já escreveu por que a caixa não pisca
*durante* o arrasto (`a03_gatilhos.py:1163-1166`); o que ninguém mediu é o
instante DEPOIS.

**Meça, e só então escolha:** clique num ajuste, conte os tiques de 100 ms até a
caixa ser reescrita, e veja se a borda verde chega aos 1,5 s. Se não chegar, a
piscada daquele gesto pousa no **container do bloco** (`.ajustes.<sigla>`), que é o
alvo do seletor e não é recriado — o `innerHTML` troca o miolo, nunca o nó. Os
outros quatro alvos sobrevivem: `select.modo` e `select.pronto` **são** os
containers dos seus blocos, e os dois botões não são bloco de ninguém.

**Não resolva isto por dedução.** Quando o instrumento e o aparelho discordam, o
aparelho ganha — quatro vezes numa madrugada uma régua deu verde sobre defeito
vivo, e nas quatro quem revelou foi olhar.

### E UMA COORDENAÇÃO, que não é medição e não se resolve aqui

**A mesma linha que esta sprint corrige manda não construir DOIS canais, e ela
respondeu pelos dois no mesmo dia.** A `05-Q4` é *"linha embaixo da grade"* —
o outro dos dois que o C-6 recusou —, e a sprint que a executa é a
`ONDA5-05-03`, que declara `hefesto_vivo.py` em `nao_toca`.

**Então há uma pergunta de piloto que nenhuma das duas frentes pode responder
sozinha:** um gesto que tem NOTÍCIA na aba 05 quer a frase na faixa, não no
cartão — e o depósito de hoje só conhece um lugar (`_depositar`, `:2201`).
Esta sprint **não** abre um segundo destino: ela deixa o cartão como está e o
declara. Quem coordena decide se a faixa da 05 é peça da aba (dentro de
`a05_vibracao.py`, sem passar pelo piloto) ou um destino novo do depósito — e a
segunda hipótese muda ESTE arquivo, logo tem de esperar esta sprint fechar.

**Declarado, não esquecido.**

---

## 6. NADA SE PERDEU

* **O canal de recusa não muda em nada** — 30 s, laranja, no cartão
  (`_recusou_dizendo`, `:2169`). Esta sprint não toca o ramo do `RuntimeError`.
* **O estado "em voo" continua inteiro**, com a classe e com o rótulo publicado,
  e o botão continua voltando INTEIRO pelo `innerHTML` guardado (`:806-808`,
  `:826-828`). As três réguas de voo (`:534`, `:546`, `:557`) continuam verdes.
* **O pouso continua acontecendo nos TRÊS desfechos**, o "sem dono" incluído
  (`:2060`) — um botão que fica trabalhando porque o gesto não existia é a tela
  mentindo sobre trabalho que ninguém começou.
* **A frase do DONO DO ASSUNTO continua vencendo a do piloto.** É o contrato do
  `recado` (`:2247-2251`) e é o que faz a `D-12` e as duas metades da `D-17`
  chegarem à tela.
* **O recado continua sobrevivendo à repintura e à recarga da página**, porque o
  depósito é do PILOTO e não do documento (`:2271-2273`).
* **O recado continua saindo da carga antes da pintura** (`:2252-2253`), senão o
  `escrever()` procura um `data-campo="recado"` que não existe em página nenhuma.
* **A tarja de rodapé continua sendo o lugar de quem não tem cartão** — gesto de
  rodapé, aba sem coluna, controle que saiu da mesa (`:652-653`).

---

## A PROVA DE TELA

**A piscada é pixel, e pixel é o olho dela.** Vale a `PROVA-DE-TELA-01` inteira:

1. **A FOTO** — antes, durante o 1,5 s, e depois. As três, `--oculta`.
2. **O CLIQUE** — nos cinco tipos de campo, não em um: `<select>`,
   `<input type="range">`, `<input type="text">`, `<button>` e o embrulho. Um
   tipo que você não clicou não está entregue, e é onde o `!important` costuma
   faltar.
3. **A MORDIDA** — arranque o `!important` do Passo 1 e fotografe de novo: o
   campo sem verde, com a régua ainda passando, é a prova de que a régua lê a
   classe e não o pixel.

**A JANELA NÃO NASCE NA TELA DELA.** `--oculta` sempre — ela tem UMA tela.
