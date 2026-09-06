---
sprint: ONDA5-05-02
estado: aberta
decisoes: [05-Q6]
posse:
  A05P:
    - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
    - tests/unit/test_a05_a_vibracao_aplica_e_fala.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba05.py
  - mockup/05-vibracao.html
  - src/hefesto_dualsense4unix/interface/paginas/05-vibracao.html
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/mesa_viva.py
  - src/hefesto_dualsense4unix/interface/pacotes/__init__.py
  - src/hefesto_dualsense4unix/interface/ds_limpo.svg
  - src/hefesto_dualsense4unix/app/mesa.py
  - docs/data/paridade-gtk-html.csv
depois_de: [ONDA2-05-VIBRACAO-01]
---

# ONDA5-05-02 · DEFEITO — o clique que a interface não entendia

> **A palavra dela, 05/09/2026, na pergunta 05-Q6** (*"quando você clica em
> Testar num controle que acabou de cair da mesa, a tela responde alguma
> coisa?"*):
>
> **"Parece erro. Não deveria ocorrer ajuste de gambiarra sobre falha de produto
> nosso"**

**Ela recusou as três opções, e as três eram a mesma coisa:** as frases prontas
no cartão, uma frase só que ela escreveria, ou o silêncio. Três maneiras de
decorar uma falha. **A pergunta estava errada** — não era *que frase*, era *por
que a interface não entende um clique que ela própria produziu*.

**A regra que ela deixa, e vale para as dez abas: o Hefesto não explica a
própria falha — ele a conserta.**

O trabalho é de **um arquivo de produto**, mais a régua que hoje dá verde sobre
um caminho que ninguém percorre.

---

## 1. O QUE SE MEDIU — o defeito é de ENDEREÇO, e a frase acusa o clique dela

### 1.1 O caminho inteiro, medido, e ele tem quatro degraus

1. O ouvinte do piloto manda `controle` = o **assento** (`p1`..`p4`), lido do
   `dataset.controle` da coluna — `hefesto_vivo.py:1078`;
2. o despachante traduz assento em `uniq` contra `self._mesa_de_agora` —
   `hefesto_vivo.py:2068-2071`;
3. `self._mesa_de_agora` **é** `ctx.mesa` (`hefesto_vivo.py:2468`), e `ctx.mesa`
   sai de `mesa_viva.mesa_do_estado`, que é montada **só com quem está
   conectado**: `mesa_viva.py:313` chama `controles_conectados`, e
   `src/hefesto_dualsense4unix/app/mesa.py:40` filtra `c.get("connected")`;
4. logo, para um controle que caiu, **a tradução não acha nada e o gesto chega
   sem `uniq`**.

Aí `_uniq` devolve `""` (`a05_vibracao.py:886-894`) e `_mirar` recusa com esta
frase (`a05_vibracao.py:991-995`):

```
o clique não disse em qual controle — e sem alvo a mesa inteira tremeria.
Clique o botão dentro da coluna do controle que você quer sentir.
```

**O clique DISSE.** Ele veio com `controle="p2"`, e a coluna existe na tela. O
que aconteceu foi outra coisa, e a tela culpa quem clicou. É isso que ela leu
como *"parece erro"*.

### 1.2 A frase certa existe — e não pode chegar

`_indice` tem a frase que descreve o fato (`a05_vibracao.py:931-934`):

```
este controle saiu da mesa entre o clique e agora. Sem o lugar dele na lista do
Hefesto não há como mirar só nele — e mandar assim faria a mesa inteira tremer.
Espere ele voltar e clique de novo.
```

Ela foi escrita em 04/09 **para este caso exato** e promovida de `ValueError`
para `RuntimeError` no mesmo dia para chegar ao cartão dela — o docstring diz
com todas as letras que este é *"o caminho do 'Testar' e do 'Parar' clicados
numa coluna cujo controle acabou de cair"* (`a05_vibracao.py:911-919`).

**Ela é inalcançável pelo piloto, e a prova é de duas linhas.** `_indice` só roda
depois de `uniq` não ser vazio (`a05_vibracao.py:990-995`); um `uniq` não vazio
veio de `ctx.mesa`; e `ctx.mesa` está **contida** em `ctx.conectados`
(`hefesto_vivo.py:2412-2413` filtra `connected` com padrão `True`,
`app/mesa.py:40` filtra `connected` sem padrão). Então
`Contexto.por_uniq` (`src/hefesto_dualsense4unix/interface/pacotes/__init__.py:89-100`)
**sempre acha**, e o `raise` de `_indice` nunca dispara pelo caminho dela.

**A cura de 04/09 foi entregue no ramo errado.**

### 1.3 A régua que garante isso dá verde sobre um recado que o piloto não faz

`tests/unit/test_a05_a_vibracao_aplica_e_fala.py:218`,
`test_o_controle_que_saiu_da_mesa_fala_sem_dizer_o_endereco`. Ela monta o clique
assim (`:233`):

```python
    fora = {"uniq": "aa:bb:cc:00:00:09", "controle": "p9"}
```

**O piloto nunca manda essa carga.** Ele manda `controle` e resolve `uniq`; um
`uniq` de controle ausente é exatamente o que a resolução do `:2068-2071` não
produz. A régua injeta o estado que ela quer medir e por isso mede o ramo morto
— **o dublê é mais frouxo que o piloto**, a mesma assinatura dos três dublês que
caíram em 05/09
(`docs/process/2026-09-05-ONDE-PARAMOS-a-onda-tres-e-as-reguas-que-mediam-o-mundo-de-ontem.md`).

### 1.4 O que JÁ foi consertado, e é por isso que a janela é estreita

**O botão que mentia já não está lá.** Em 05/09 a coluna que perde o dono some
com os próprios controles: `aba05.py:500-506` esconde os filhos de `.seg`,
`.motor` e `.acoes-col` quando o piloto marca `data-conectado="nao"`
(`hefesto_vivo.py:917-926`), e o `::after` põe travessão no lugar. Um elemento
em `display:none` não recebe clique.

**Sobra a corrida, e ela é real:** os `TIQUE_MS = 100` (`hefesto_vivo.py:114`)
entre o controle cair e a tela saber, mais o gesto que já está em voo na thread
(`hefesto_vivo.py:2080-2087`). Essa janela não se projeta para fora — **o que se
conserta é a tela parar de acusar o clique dela dentro dela.**

### 1.5 E há uma frase que manda ela clicar num botão que não existe

`a05_vibracao.py:1338-1340`, na recusa do gesto `forca`:

```
este clique não disse qual degrau — tente de novo em cima de um dos quatro
botões (Economia, Balanceado, Máximo ou Auto).
```

São **três** botões desde 05/09 — `aba05.FORCA` (`aba05.py:195-197`), com o
`Auto` fora da tela pela palavra dela. A frase mede o mundo de ontem, e é a
mesma família de defeito: a tela mandando ela procurar o que não está lá.

---

## 2. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — `_uniq` passa a saber a diferença, e a cura cobre os QUATRO sítios

`a05_vibracao.py:886-894`. Hoje `_uniq` devolve `""` para dois fatos diferentes,
e quem chama escreve a frase de um só. Ele passa a distinguir, pelo dado que já
chega no clique: `o.get("controle")`.

* **`controle` vazio** — clique solto, sem coluna. A frase de hoje continua
  valendo palavra por palavra: foi ela que ensinou que sem alvo a mesa inteira
  tremeria.
* **`controle` nomeia um assento e `uniq` não resolveu** — o controle daquele
  assento saiu entre o clique e agora. A frase é a de `_indice:931-934`, que já
  existe, já foi pensada e **não cita endereço de rádio** — o que os dois
  portões de anonimato desta casa existem para impedir.

**São QUATRO os chamadores, e é o ponto do passo:** `_mirar` (`:990`, que serve
`testar` e `parar`), `forca` (`:1341`), `intensidade` (`:1379`) e `motor`
(`:1441`). Uma cura escrita dentro de um gesto deixa a próxima pessoa remedindo
o mesmo defeito nos outros três — foi o que esta casa pagou duas vezes em 05/09.

**A MORDIDA:** escreva a cura dentro de `_mirar` só, e
`test_os_cinco_gestos_dizem_a_causa_certa` (§3) reprova em **três** dos cinco
casos — `forca`, `intensidade` e `motor`. Se reprovar em um só, a cura foi para
o gesto e não para a função que os quatro compartilham.

### Passo 2 — o `raise` de `_indice` fica, e o docstring dele para de mentir

Não apague o `raise` de `a05_vibracao.py:931-934`: ele é a guarda contra o
broadcast para **qualquer** chamador que não seja o piloto, e mirar um lugar
vazio deixaria o alvo anterior de pé. **Fato errado se substitui:** o parágrafo
de `:911-919` afirma que este é o caminho do "Testar" clicado numa coluna que
esvaziou, e a §1.2 mediu o contrário. Reescreva as duas metades, com a data:

* **`RuntimeError` e não `ValueError`** — vale, e a razão é a de 04/09;
* **"é o caminho do clique dela"** — caduca em 05/09/2026, medido: o `uniq` que
  chega aqui sempre está na mesa, porque a mesa é subconjunto dos conectados.

**A MORDIDA:** troque o `raise` por `return 0` e
`test_mirar_lugar_vazio_nunca_vira_broadcast` (§3) reprova — a prova de que a
guarda não é enfeite mesmo sendo inalcançável pelo piloto.

### Passo 3 — `parar` para de trocar o motivo do daemon por um palpite

`a05_vibracao.py:1563-1565`:

```python
    ok, motivo = _resposta(p.rumble_stop_checked())
    if not ok:
        raise RuntimeError("o Hefesto não está rodando — ligue na aba Sistema")
```

O `motivo` é a recusa do daemon **já traduzida em frase de tela** — é para isso
que a função `_checked` existe (`_resposta`, `a05_vibracao.py:937-952`). Aqui ele
é lido e jogado fora, e a tela afirma uma causa que ninguém mediu. A função irmã,
41 linhas acima, faz o certo (`a05_vibracao.py:1522`):

```python
        raise RuntimeError(motivo or "o Hefesto não está rodando — ligue na aba Sistema")
```

**Uma linha, e é o mesmo `or`.** É o caso de `parar` dentro do Modo Nativo, que o
próprio docstring de `parar` nomeia (`a05_vibracao.py:1550-1555`).

**A MORDIDA:** devolva o palpite e
`test_o_parar_diz_o_motivo_do_daemon_e_nao_um_palpite` (§3) reprova, com o dublê
recusando por um motivo que a frase engole.

### Passo 4 — a recusa do `forca` conta os degraus que existem

`a05_vibracao.py:1338-1340`. Os quatro viram três, e **não se digitam**: os
rótulos têm dono em `aba05.FORCA` (`aba05.py:195-197`) e em
`app/actions/rumble_actions.ROTULOS_DO_ORCAMENTO`, que `_nome_do_degrau` já usa
(`a05_vibracao.py:1153-1160`). Uma quarta lista escrita à mão volta a envelhecer
no dia seguinte.

**A MORDIDA:** deixe o `Auto` na frase e
`test_a_recusa_do_degrau_nao_oferece_botao_que_nao_existe` (§3) reprova.

---

## 3. AS RÉGUAS, e a que já existe é RELIDA

**A que existe:** `test_o_controle_que_saiu_da_mesa_fala_sem_dizer_o_endereco`
(`tests/unit/test_a05_a_vibracao_aplica_e_fala.py:218-240`). Ela **fica**, e o que
muda é a carga: em vez de injetar um `uniq` que o piloto não produz (`:233`),
ela monta o clique **como o piloto monta** — `{"controle": "p2"}`, sem `uniq`,
que é o que sai de `hefesto_vivo.py:1078` quando a tradução de `:2068-2071` não
acha. As duas asserções de hoje continuam valendo palavra por palavra: a frase
diz *"saiu da mesa"* e não publica endereço de rádio.

**As quatro novas, e cada uma morde em lugar diferente:**

1. `test_os_cinco_gestos_dizem_a_causa_certa` — parametrizado em `testar`,
   `parar`, `forca`, `intensidade` e `motor`, com `{"controle": "p2"}` e sem
   `uniq`: os cinco recusam dizendo *"saiu da mesa"*, e **nenhum** diz *"o
   clique não disse"*. É esta que prova o Passo 1;
2. `test_o_clique_sem_coluna_continua_dizendo_que_nao_tem_alvo` — o par da
   anterior, com `{}`: a frase antiga continua inteira. Sem ela, o Passo 1 pode
   apagar o caso que a frase de `:991-995` nasceu para cobrir;
3. `test_o_parar_diz_o_motivo_do_daemon_e_nao_um_palpite` — dublê que devolve
   `(False, "…")` no `rumble_stop_checked`; a frase que sobe é a do daemon;
4. `test_a_recusa_do_degrau_nao_oferece_botao_que_nao_existe` — a frase do
   `forca` sem degrau não cita `Auto`, e os nomes que ela cita são os de
   `aba05.FORCA`.

**E cuidado com o dublê.** A `PonteDeMentira` deste arquivo responde a qualquer
nome; `rumble_stop_checked` devolve **par** e `rumble_motores_set` devolve
`(ok, corpo)` — a razão está escrita em `a05_vibracao.py:1614-1622`, e foi ela
que tirou `motor` das `PROVAS`. Um dublê que responda `True` seco faz a régua 3
medir o normalizador em vez da frase.

---

## 4. O QUE ESTA SPRINT **NÃO** FAZ

1. **Não muda uma letra da tela.** Nenhuma frase nova, nenhum endereço novo,
   nenhum desenho. O que muda é **qual** das frases já escritas aparece.
2. **Não mexe no piloto nem na mesa.** `hefesto_vivo.py`, `mesa_viva.py` e
   `pacotes/__init__.py` são de outras frentes, e edição neles some em silêncio
   no merge.
3. **RELATE, não conserte: o `data-controle` tem dois significados.** O desenho
   compartilhado carrega `data-controle="dualsense"` — o **modelo** —
   (`src/hefesto_dualsense4unix/interface/ds_limpo.svg:2`), e o piloto usa
   `data-controle` para o **assento**. Medido nas páginas publicadas: quatro
   ocorrências em `04-iluminacao.html`, `05-vibracao.html` e `06-navegacao.html`,
   duas em `08-conexoes.html`. Hoje não chega a virar clique nesta aba — nenhum
   gesto mora dentro do desenho —, mas `LER_CAMPOS` resolve o dono por
   `el.closest('[data-controle],[data-uniq]')` (`hefesto_vivo.py:1466-1469`), e
   todo campo de dentro do `<svg>` volta com dono `"dualsense"` em vez de
   `p1`..`p4`. **É o instrumento apontando para outra coisa, e o arquivo é de
   quatro abas.** Fica escrito; a cura é de quem for dono do desenho compartilhado.

---

## 5. NADA SE PERDEU

* **O broadcast continua impossível.** `_mirar` recusa quando não há alvo
  (`a05_vibracao.py:991-995`) e quando a mira não vai
  (`a05_vibracao.py:996-1000`), e `rumble.set` sem alvo é broadcast — a razão
  medida está em `a05_vibracao.py:889-891`, e o estrago que ela evita está em
  `a05_vibracao.py:972-979`. Nenhum passo pode mandar o par sem mira.
* **A frase nunca publica endereço de rádio.** É contrato dos dois portões de
  anonimato desta casa, e a asserção que o guarda já está na régua
  (`tests/unit/test_a05_a_vibracao_aplica_e_fala.py:239-241`).
* **`RuntimeError` continua sendo o canal, e `ValueError` continua fora dele.**
  O contrato é do piloto (`hefesto_vivo._recusou_dizendo`, `:2169-2198`): o
  primeiro chega ao cartão dela, o segundo fica no `stderr` de quem lançou a
  janela.
* **A vez continua sendo tomada antes da mira** — `_minha_vez()` e depois
  `_mirar()`, em `testar` (`:1513-1514`) e em `parar` (`:1561-1562`). Quem toma
  a vez e não consegue mirar não deixa estado morto, porque não chegou a pedir
  vibração nenhuma.
* **`parar` continua devolvendo a mão ao jogo** — `rumble_passthrough(True)` em
  `a05_vibracao.py:1566`, antes do `raise` do motivo. Nada fica num estado morto.
* **O piso da aba continua em CINCO gestos** — `PISO_DA_ABA` com a queda
  declarada em `a05_vibracao.py:1593-1604`. Esta sprint não tira gesto nenhum.

---

## A PROVA DE TELA

Isto é frase que ela lê, e **nenhuma das duas foi vista por ela no caso certo**.
`PROVA-DE-TELA-01`: foto antes e depois, o clique que produz a frase — com o
dublê tirando o controle da mesa entre o tique e o clique —, e a mordida colada.

**A janela não nasce na tela dela.** `--oculta` sempre.
