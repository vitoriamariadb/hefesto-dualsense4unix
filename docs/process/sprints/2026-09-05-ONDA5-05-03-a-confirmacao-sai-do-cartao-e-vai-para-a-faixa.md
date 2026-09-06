---
sprint: ONDA5-05-03
decisoes: [05-Q4]
posse:
  A05C:
    - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
    - src/hefesto_dualsense4unix/interface/aba05.py
    - mockup/05-vibracao.html
    - tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/paginas/05-vibracao.html
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/onde.py
  - src/hefesto_dualsense4unix/app/telas/vibracao.py
  - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
  - docs/data/paridade-gtk-html.csv
depois_de: [MIGRA-VIBRACAO-03, MIGRA-VIBRACAO-08, ONDA2-05-VIBRACAO-01, ONDA5-05-01, ONDA5-05-02, ONDA5-P-01]
---

# ONDA5-05-03 · DESENHO — a confirmação sai do cartão e vai para a faixa

> **A palavra dela, 05/09/2026, na pergunta 05-Q4** (*"depois de clicar num botão
> desta aba, a tela confirma que deu certo?"*):
>
> **"Linha embaixo da grade"** — *"a frase entra na faixa que já existe sob a
> grade, nomeando a coluna (`P2 · voltou ao ajuste geral`) e some logo depois;
> **nada se mexe dentro das colunas**."*

**ESTA SPRINT VEM DEPOIS DAS DUAS IRMÃS, e a razão é o arquivo.** Ela mexe em
`a05_vibracao.py` (dona da `ONDA5-05-02`) e em `aba05.py` (dona da
`ONDA5-05-01`). Duas frentes no mesmo arquivo é conflito garantido; a serialização
é de propósito.

---

## 1. É UMA REVERSÃO, E ELA ESTÁ ESCRITA NO CÓDIGO COMO PALAVRA DELA

`src/hefesto_dualsense4unix/interface/hefesto_vivo.py:2230-2233`, no docstring do
canal de sucesso:

> *"DUAS RECOMENDAÇÕES PROPUNHAM OUTRO CANAL e as duas foram recusadas por ela no
> mesmo dia (os conflitos C-3 e C-6): **o campo que pisca**, na aba 03, e **a
> faixa embaixo da grade**, na 05. **Não construa nenhum dos dois.**"*

**Hoje ela construiu os dois.** A decisão 03-Q4 é *o campo piscando em verde por
~1,5 s, sem palavra nova na tela*; a 05-Q4 é *a faixa embaixo da grade*. São
exatamente os dois que a linha acima manda não construir.

**A atribuição estava errada, não a medição.** Quem recusou os dois canais em
04/09 foi o PO, na
[ONDA2-05-VIBRACAO-01](2026-09-04-ONDA2-05-VIBRACAO-01-a-linha-de-estado-por-coluna-e-a-linha-de-mesa.md)
e em [O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md),
onde o C-6 é nominalmente esta aba. Ela não tinha lido a pergunta. Leu hoje.

**E as duas decisões de hoje se encaixam — não brigam.** Elas dividem o trabalho
em duas metades que a pergunta de 04/09 tratava como uma:

| o fato | a forma | a decisão |
| --- | --- | --- |
| **deu certo** — o clique fez o que prometeu | o campo pisca verde ~1,5 s, **sem palavra nova** | 03-Q4, e vale nas dez abas |
| **deu certo, e a tela vai mostrar outra coisa** | uma frase, na faixa sob a grade, nomeando a coluna | 05-Q4, e é desta aba |

A opção que ela marcou traz o exemplo `P2 · voltou ao ajuste geral`, que é
literalmente uma das três frases desta aba — e nenhuma das três é um *"deu
certo"* seco. **As três existem porque o resultado contradiz o botão.**

---

## 2. O QUE SE MEDIU

### 2.1 As três frases, e onde elas pousam hoje

`_aplicar_a_forca` (`a05_vibracao.py:1067`) devolve `{"recado": …}` em três
ramos:

| ramo | linha | o que a frase diz |
| --- | --- | --- |
| clicou `Auto` e a coluna volta à mesa | `a05_vibracao.py:1143-1146` | `TEXTO_A_PECA_VOLTOU_AO_AJUSTE_GERAL` mais o degrau que a coluna vai acender |
| a escolha não DIVERGE da mesa | `a05_vibracao.py:1147` | `FRASE_DO_QUE_A_COLUNA_MOSTRA` (`:1037-1043`) |
| a mesa em `Auto` engole o fator | `a05_vibracao.py:1149` | `FRASE_DA_MESA_EM_AUTO` (`:1023-1030`) |

O piloto as deposita **no cartão daquela coluna**, em verde, por 6 s —
`_deu_certo_dizendo` (`hefesto_vivo.py:2247-2255`) e
`SEGUNDOS_DO_RECADO_DE_SUCESSO = 6.0` (`hefesto_vivo.py:145`). Quando o gesto não
traz frase vale `FRASE_DE_SUCESSO = "Pronto."` (`hefesto_vivo.py:158`) — e é
**esse** o caso que a 03-Q4 troca pelo piscar.

### 2.2 O custo do cartão foi MEDIDO nesta aba, e a decisão dela o remove

`hefesto_vivo.py:721-733`, com a medição colada no próprio código:

> *"um recado inserido como primeiro filho de um `[data-controle]` de linhas
> fixas OCUPA UMA LINHA — o desenho do controle sumia, o nome caía na faixa da
> Força, e a coluna inteira descia uma casa. O aviso que veio explicar quebrava
> a tela que estava explicando."*
>
>     sem a cura   topo do desenho 389 -> 454   (65 px)
>     com a cura   topo do desenho 389 -> 389

A cura foi tirar o recado do fluxo (`ESTILO_NA_GRADE`, `hefesto_vivo.py:658-660`:
`position:absolute;top:4px;left:4px;right:4px`). **Ele parou de empurrar e passou
a COBRIR** — o topo do desenho do controle, por 6 s, a cada clique. A opção dela
diz *"nada se mexe dentro das colunas"*, e tirar a frase de dentro fecha as duas
metades: não empurra e não cobre.

### 2.3 A faixa já existe, e já sabe receber linha

`#vib-estado` (`aba05.py:1747`), depois da grade e dentro do `.quadro-corpo`. Ela
é escrita como **bloco inteiro** pelo pacote — `"blocos": {"#vib-estado": estado}`
(`a05_vibracao.py:774`) — porque o número de linhas muda com o estado.

* os tons são três, e têm dono: `DIZ`, `ALERTA` e `INFO` em
  `src/hefesto_dualsense4unix/app/telas/vibracao.py:353-355`, com o CSS em
  `aba05.py:908-918`;
* já há precedente de linha somada pelo pacote: a ressalva da mesa entra na
  mesma lista, como tupla `(tom, frase)` — `a05_vibracao.py:756-759`;
* o tamanho foi medido: a primeira versão da ressalva tinha 285 caracteres e a
  segunda linha saiu CORTADA na foto (`a05_vibracao.py:293-299`). **Frase longa
  nesta faixa não cabe** — e as três frases desta sprint são longas.

### 2.4 A régua que tranca isso hoje digita o que devia ler

`tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py:569-589`,
`test_o_aviso_do_que_a_coluna_mostra_e_sucesso_e_nao_recusa`:

```python
    fonte = inspect.getsource(a05._aplicar_a_forca)
    assert 'return {"recado":' in fonte
    assert "raise RuntimeError" not in fonte
```

Ela lê o **texto do código**, não o que o gesto devolve. É a forma de defeito que
esta casa pagou onze vezes em 26/08 — *a régua digita o que devia LER* — e ela
reprovaria qualquer mudança de forma, inclusive esta, sem que nada na tela
tivesse piorado.

---

## 3. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — a frase ganha o nome da coluna

`a05_vibracao.py:1067-1150`. Fora do cartão, a frase perde o endereço: quem lê
uma linha embaixo da grade não sabe de qual das quatro colunas ela fala. Ela passa
a abrir pelo rótulo que a coluna já mostra — `P{jogador}`, o mesmo de
`aba05.py:1622` —, com o separador que a opção dela escreve: `P2 · …`.

**O número não se digita:** ele sai de `ctx.mesa`, pelo `uniq` que o gesto já tem
(`Contexto`, `src/hefesto_dualsense4unix/interface/pacotes/__init__.py:71-100`).

**A MORDIDA:** tire o prefixo e `test_a_frase_da_faixa_nomeia_a_coluna` (§4)
reprova. Com dois controles na mesa, é a única asserção que distingue a frase do
P1 da do P2.

### Passo 2 — a frase encurta para caber numa linha

As três de hoje foram escritas para uma caixa que CRESCE (o cartão). A faixa
reserva **uma** linha, e o corte já foi fotografado uma vez
(`a05_vibracao.py:293-299`). Cada uma perde o mecanismo e mantém **o fato e o
conserto** — a mesma disciplina que a ressalva da mesa já segue:

* o fato: o que a coluna vai mostrar;
* o conserto: o que ela faz para mudar isso.

O porquê continua existindo onde há espaço para ele: no `?` do rótulo "Força da
vibração" (`aba05.py:1691-1697`).

**A MORDIDA:** `test_a_frase_da_faixa_cabe_numa_linha` (§4) com o teto de
caracteres medido — devolva `FRASE_DA_MESA_EM_AUTO` inteira e ela reprova.

### Passo 3 — a faixa ganha o quarto tom, e ele é o do recibo

`aba05.py:908-918`. Entra `.vib-estado .est.recibo{color:var(--green)}` e o par
do `.sinal`, ao lado dos três que já existem. **Verde é a cor que o produto já
usa para o que deu certo** — `COR_DO_SUCESSO` (`hefesto_vivo.py:647-648`) lê o
mesmo `--green` da paleta. Uma quinta cor para o mesmo fato seria a segunda
tradução da mesma coisa.

**A MORDIDA:** pinte a linha com o tom `ALERTA` e
`test_a_frase_da_faixa_e_recibo_e_nao_alerta` (§4) reprova: laranja sobre um
clique que gravou ensina que o botão falha, que é o defeito que a D-01 fechou em
04/09.

### Passo 4 — O RELÓGIO É DO PILOTO. RELATE, não escreva o segundo

A opção dela diz *"e some logo depois"*. **O depósito com prazo já existe e é um
só para as dez abas** — `Piloto._depositar` (`hefesto_vivo.py:2201-2216`), com a
poda no leitor (`_recados_para_a_tela`, `:2311-2318`), a tradução `uniq → pref` no
instante da pintura e a sobrevivência à repintura. Escrever um segundo relógio
dentro de `a05_vibracao.py` seria a segunda cópia dessa regra, e a segunda
diverge — é o argumento que fez o canal de recusa ser um só, e está no docstring
do `_depositar`.

O que falta ao piloto é **um terceiro lugar**: hoje `pintar_recados` conhece dois
— `cartao` e `tarja` (`hefesto_vivo.py:749`) — e precisa do endereço que a
página declara. É **uma** decisão de endereço, e ela é da mesma frente que a
03-Q4 vai tocar.

**`hefesto_vivo.py` NÃO É SEU.** A regra desta casa é explícita e está na
`ONDA2-05-VIBRACAO-01`: *"se a sua aba precisar de mudança neles, RELATE — a
edição some em silêncio no merge"*. Entregue os Passos 1 a 3 e **relate o
terceiro lugar com a forma exata**: o `#vib-estado` declara que recebe recados, e
`pintar_recados` põe o nó dentro dele em vez do cartão.

**A MORDIDA deste passo é de integração, não de unidade:** com o terceiro lugar
no ar, o recado nasce dentro do `#vib-estado`; sem ele, nasce no cartão e o topo
do desenho volta a ser coberto. As duas fotos são a prova.

---

## 4. AS RÉGUAS

**A que existe é REESCRITA, não apagada:**
`test_o_aviso_do_que_a_coluna_mostra_e_sucesso_e_nao_recusa`
(`tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py:569`). O que ela mede
continua valendo — *a gravação aconteceu, o canal é o de sucesso, não a recusa* —
e o **como** cai: em vez de `inspect.getsource`, ela **chama o gesto** com o
disco dublê e olha o que volta. A asserção `"raise RuntimeError" not in fonte`
vira `pytest.raises` que **não** dispara.

**As quatro novas:**

1. `test_a_frase_da_faixa_nomeia_a_coluna` — dois controles na mesa, clique no
   segundo, e o `P2` abre a frase;
2. `test_a_frase_da_faixa_cabe_numa_linha` — as três frases sob o teto medido;
3. `test_a_frase_da_faixa_e_recibo_e_nao_alerta` — o tom da tupla é o do recibo;
4. `test_o_deu_certo_seco_nao_vira_frase` — o clique que **não** contradiz o botão
   (`_aplicar_a_forca` devolvendo `None`, `a05_vibracao.py:1150`) continua sem
   frase nenhuma. **É esta que guarda a 03-Q4:** sem ela, alguém acrescenta um
   `"Pronto."` na faixa e a decisão *"sem palavra nova na tela"* morre calada.

---

## 5. O QUE ESTA DECISÃO **NÃO** DECIDE

1. **A frase de tela continua não sendo dela.** As três são minhas, com o
   mecanismo explicado em português — está declarado em `a05_vibracao.py:113-118`.
   Trocar por palavras dela é uma linha em cada constante.
2. **A ressalva da mesa continua na faixa, e não é isto.** `_ressalva_da_mesa`
   (`a05_vibracao.py:250-307`) vive **enquanto a condição existir**, inclusive
   para quem abre a aba amanhã sem ter clicado nada. As duas metades não se
   substituem, e a razão está escrita em `:253-258`. Depois desta sprint as duas
   moram na mesma faixa: uma some, a outra fica.
3. **As outras nove abas não mudam de canal.** A 05-Q4 é desta aba; o cartão
   continua sendo o lugar do recado nas outras, e a 03-Q4 é que decide a forma do
   *"deu certo"* nas dez.

---

## 6. NADA SE PERDEU

* **O canal de recado continua sendo UM** — mesmo depósito, mesma poda, mesma
  tradução de endereço (`hefesto_vivo.py:2201-2216`). O que muda é **onde o nó
  pousa nesta página**, não o mecanismo.
* **A recusa continua no cartão, em laranja, por 30 s** —
  `_recusou_dizendo` (`hefesto_vivo.py:2169-2198`) e `SEGUNDOS_DO_RECADO = 30.0`
  (`hefesto_vivo.py:132`). Esta sprint mexe no que deu CERTO; recusa é outro fato.
* **O gesto continua lendo o perfil DE VOLTA pela mesma função que pinta a
  coluna** — `_forca_da_coluna` dentro de `_aplicar_a_forca`
  (`a05_vibracao.py:1140-1141`). É a régua que mora dentro do gesto, e é o que
  faz a frase dizer o que a coluna vai mostrar de fato.
* **`TEXTO_A_PECA_VOLTOU_AO_AJUSTE_GERAL` continua vindo de
  `src/hefesto_dualsense4unix/app/actions/rumble_actions.py`**, e não redigitado
  aqui — a razão está em `a05_vibracao.py:1100-1107`: a janela estável diz a mesma
  oração no mesmo caso desde 25/08.
* **A faixa continua sumindo quando não há o que dizer** —
  `.vib-estado:empty{display:none}` (`aba05.py:878`). Uma faixa vazia com borda é
  a tela afirmando que existe aviso onde não existe.
* **A grade continua com sete faixas e o `#vib-estado` fora dela** — a razão está
  em `aba05.py:1734-1746`: uma linha a mais dentro da grade empurraria o "Testar"
  de todas as colunas para fora do y das divisórias, que é a régua dela desde
  30/08.
* **A publicação continua sendo ato dela** (`onde.py:13-15,28-29`). Esta sprint
  escreve na bancada.

---

## A PROVA DE TELA

`PROVA-DE-TELA-01`, e aqui ela é o coração da entrega:

1. **A FOTO** — o mesmo clique, antes e depois: a tarja verde cobrindo o topo do
   desenho, e a linha na faixa com a coluna nomeada;
2. **O CLIQUE** — os três ramos, um a um. O `Auto` que devolve a coluna à mesa, a
   escolha que não diverge, e a mesa em `Auto` engolindo o fator. **Ramo que você
   não clicou não está entregue**;
3. **A MORDIDA** — a do Passo 3 e a do Passo 4, coladas nos dois estados.

**A janela não nasce na tela dela.** `--oculta` sempre; ela tem UMA tela.
