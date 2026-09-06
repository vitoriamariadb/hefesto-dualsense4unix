# A-TELA-SAMBA-01 — a interface repinta, perde cliques e mata a dica

**06/09/2026 · agente P0 · árvore `hefesto-voo/A-TELA-SAMBA-01-P0`, branch
`voo/A-TELA-SAMBA-01-P0`, nascida de `f856cbd5`.**

Tudo abaixo foi medido com o daemon dela vivo (de 06/09 01:20:50), um DualSense
no cabo, e a janela SEMPRE `--oculta`. A bancada não foi tocada.

---

## O que se mediu

### O instrumento (Passo 1), e por que ele precisou existir

`--conta-mutacoes N` no piloto: um `MutationObserver` na raiz do documento
acumula, por endereço (`data-campo`/`data-papel`/`data-hef` mais próximo) e por
tipo, quantas mutações de DOM aconteceram em N tiques **com a mesa parada**. Ele
liga depois de 20 tiques de assentamento (`VOLTAS_ATE_ASSENTAR`), porque a
primeira pintura MUDA a tela de propósito.

**O fato que organiza o defeito inteiro:** *escrever o mesmo valor É uma mutação
de DOM*. A especificação manda enfileirar um `MutationRecord` em toda troca de
atributo, não só quando o valor difere. Por isso o contador de pinturas que o
piloto já tinha era cego: ele conta o que o piloto ACHA que escreveu.

**E a foto é ainda mais cega.** As duas fotos da prova de tela — aos 0 s e aos
5 s — saem **byte a byte idênticas** com a cura e **byte a byte idênticas** com
a cura arrancada, enquanto o DOM sofre 1.166 mutações no segundo caso. É a
razão de este defeito ter atravessado toda medição por foto desta casa.

### A tabela, ANTES e DEPOIS (mesa parada)

| aba | ANTES (100 tiques) | DEPOIS (100 tiques) |
| --- | --- | --- |
| `01-jogar` | **7.100** · 71,0 por tique | **0** |
| `03-gatilhos` | **6.400** · 64,0 por tique | **0** |

As dez abas, em 40 tiques cada, antes e depois das curas:

| aba | ANTES | DEPOIS | o que sobra, e de quem é |
| --- | --- | --- | --- |
| `01-jogar` | 2.840 | **0** | — |
| `02-controles` | 66 | 62 | **dado vivo**: giroscópio e acelerômetro do controle na mesa dela. Não é samba |
| `03-gatilhos` | 2.560 | **0** | — |
| `04-iluminacao` | 200 | **0** | — |
| `05-vibracao` | 0 | **0** | — |
| `06-navegacao` | 0 | **0** | — |
| `07-lancadores` | 1.160 | 120 | RELATO — o pacote publica um bloco no seletor `.fita` |
| `08-conexoes` | 40 | **0** | — |
| `09-sistema` | 4 | 4 | **dado vivo**: o registro do sistema cresce |
| `10-perfis` | **4.000** · 100,0 por tique | **0** | — |

O `2.840` da `01-jogar` e o `2.560` da `03-gatilhos` são a medição de 40 tiques
refeita com a cura arrancada (mordida 7, colada abaixo).

### O custo do tique (Passo 4)

| aba | mediana do tique | máximo | mediana do IPC | máximo do IPC |
| --- | --- | --- | --- | --- |
| `01-jogar` | 2,68 ms | 16,05 ms | 0,95 ms | 9,14 ms |
| `10-perfis` | 7,95 ms | 19,10 ms | 0,95 ms | 7,35 ms |
| **`09-sistema`** | 1,45 ms | **1.640 ms** | 1,01 ms | **1.639 ms** |

Na `09-sistema`, **7 tiques de 40 passaram do teto de 100 ms**, um deles em
1.394 ms. Os outros nove abas nunca passaram.

---

## O que mudou

Tudo em `interface/hefesto_vivo.py` e `scripts/abrir_interface.py` — a posse
declarada. `gui/ponte_da_tela.py` não precisou de uma linha.

1. **`--conta-mutacoes N`** (Passo 1): o observador, a tabela por endereço e
   tipo, e a leitura guardada em `Piloto.mutacoes` para quem mede de dentro.
   Ele acende o `--oculta` sozinho, como o `--prova-de-mockup`.
2. **O alvo `atributo` compara ANTES de escrever** (Passo 2). É a cura da dica.
   O ramo escrevia e depois relia, com a premissa de que *"um atributo aceita
   qualquer texto, então só a releitura diz se algo mudou"* — **a premissa é
   falsa para um atributo comum**: `setAttribute` não normaliza, e
   `getAttribute` devolve exatamente a string que entrou.
3. **O selo da visita escreve UMA vez.** `el.dataset.hefVisto = '1'` sobre um
   `'1'` é mutação; era **6.700 das 7.100** da `01-jogar`. O selo não perde
   nada: o rastro é o atributo ESTAR lá, não o ato de reescrevê-lo. O mesmo
   valeu para o laço que carimba os chips da fita.
4. **O alvo `html` lembra o que escreveu** (`el.__hefHtml`). O `innerHTML` de
   volta é a SERIALIZAÇÃO do navegador — a indentação some, as aspas mudam —, e
   onde houver uma dessas diferenças o miolo era recriado dez vezes por segundo.
5. **Os blocos lembram o que escreveram** (`alvo.__hefBloco`) — e é a cura que
   fechou cinco abas de uma vez. O ciclo se fechava DENTRO do mesmo tique: o
   bloco entra com os endereços do pacote, o laço de campos três passos abaixo
   carimba `data-hef-visto` neles, o `innerHTML` passa a trazer o selo, a
   igualdade nunca mais casa, e no tique seguinte o bloco volta inteiro. **A
   fita já tinha medido este mesmo defeito em 03/09 e curado só o lado dela.**
6. **O bloco nunca é trocado com um `hef-em-voo` dentro** (Passo 3), e o
   adiamento é contado na tabela. Assim que o voo pousa, o bloco entra.
6b. **A FITA GANHOU A MESMA GUARDA**, por achado da `ONDA4-S10-O-TRANSPORTE-01`
   que o coordenador me passou no meio do trabalho. Ela é o caso EXTREMO do
   Passo 3: não troca o miolo, troca o próprio nó (`f.outerHTML = desejado`),
   então tudo o que está dentro morre junto — e os chips da fita são clicáveis,
   são eles que escolhem em qual controle o gesto age.
7. **O `classList` dos lugares vazios e ocupados pergunta antes** — um
   `classList.remove` de uma classe ausente reserializa o atributo `class` do
   mesmo jeito.
8. **O tique não enfileira** (Passo 4): há uma pintura no ar por vez, o tique
   cronometra as duas viagens de IPC à parte, DIZ no `stderr` quando passa do
   teto de `TIQUE_MS` e pula o seguinte. Os dois contadores de tique pulado
   saem no relato.
9. **A janela dela deixa rastro** (Passo 5): sem terminal (o atalho da dock),
   `stdout` e `stderr` vão para
   `~/.local/state/hefesto-dualsense4unix/interface.log`, com uma volta de
   rotação em 1 MiB. Com terminal, nada muda — desviar ali esconderia a saída
   de quem está olhando para ela.

### UMA HIPÓTESE DA SPRINT CAIU, e o aparelho ganhou do enunciado

A §2 dizia que **três** alvos escreviam antes de comparar e que os três eram
culpados: `atributo`, `cor` e `plastico`. Os três escrevem antes de comparar —
mas só o primeiro MUTA. O CSSOM só reescreve o atributo `style` quando a
DECLARAÇÃO muda, e atribuir a mesma cor (ou remover uma propriedade que já não
está lá) não muda declaração nenhuma. Com o observador ligado por 100 tiques nas
dez abas, `cor` e `plastico` não produziram **uma** mutação.

A cura escrita para eles foi **arrancada e devolvida ao original**, e a razão
está no comentário dos dois ramos. O que revelou isso foi a mordida: as duas
réguas que eu tinha escrito para guardá-los **passaram com a cura arrancada** —
régua que não morde não mede nada, e neste caso ela estava medindo uma cura que
não curava.

---

## A mordida (saída colada)

Cada cura arrancada, uma por vez, com a régua rodada em seguida e a cura
devolvida no fim. As oito reprovam; devolvidas, `11 passed`.

```
### MORDIDA 1 · o alvo `atributo` volta a escrever antes de comparar
   E  AssertionError: reescrever o MESMO `title` mutou o DOM: a dica dela morre
      a cada tique — [2, 1, 1], detalhe ['attributes:data-hef-visto', 'att…
   E  assert [1, 1] == [0, 0]
   FAILED tests/unit/test_a_tela_nao_samba.py::test_atributo_igual_nao_muta
   1 failed, 1 passed, 9 deselected in 3.20s

### MORDIDA 2 · o selo volta a ser reescrito a cada visita
   E  AssertionError: o selo foi reescrito com o valor igual — [2, 1, 1, 1]
   E  assert [1, 1, 1] == [0, 0, 0]
   FAILED tests/unit/test_a_tela_nao_samba.py::test_o_selo_da_visita_escreve_uma_vez_so
   1 failed, 10 deselected in 1.98s

### MORDIDA 3 · a cor sai do CSSOM e vira `setAttribute` no `style`
   E  AssertionError: a cor ou o `--plastico` mexeram no DOM ao repetir —
      [4, 1, 1], detalhe ['attributes:data-hef-visto', 'attributes:style', …
   E  assert [1, 1] == [0, 0]
   FAILED tests/unit/test_a_tela_nao_samba.py::test_a_cor_e_o_plastico_repetidos_nao_mutam
   1 failed, 10 deselected in 2.03s

### MORDIDA 4 · o bloco perde a memória (o miolo reserializado)
   E  AssertionError: o bloco foi reescrito com o mesmo desenho — [1, 1, 1]
   E  assert [1, 1, 1] == [1, 0, 0]
   FAILED tests/unit/test_a_tela_nao_samba.py::test_o_bloco_reserializado_nao_e_reescrito
   1 failed, 10 deselected in 2.09s

### MORDIDA 5 · o alvo `html` perde a memória
   E  AssertionError: o miolo foi recriado com o mesmo desenho — [2, 1, 1]
   E  assert [1, 1] == [0, 0]
   FAILED tests/unit/test_a_tela_nao_samba.py::test_o_html_repetido_nao_muta_mesmo_reserializado
   1 failed, 10 deselected in 2.01s

### MORDIDA 6 · o bloco volta a atropelar o botão em voo
   E  AssertionError: o bloco engoliu o botão em voo — o clique dela morre no meio
   E  assert 'hef-em-voo' in '<div id="regua-bloco"><i>outro miolo</i></div>'
   FAILED tests/unit/test_a_tela_nao_samba.py::test_o_bloco_nao_destroi_um_botao_em_voo
   1 failed, 10 deselected in 2.04s

### MORDIDA 7 · a página inteira, com o selo reescrito a cada visita
   E  AssertionError: a tela mexeu 2520 vezes em 40 tiques com a mesa PARADA —
      mascara-cartao/attributes/data-hef-visto x480, aviso-selo/attributes/…
   E  assert 2520 == 0
   FAILED tests/unit/test_a_tela_nao_samba.py::test_a_pagina_parada_nao_muta_nada
   1 failed, 10 deselected in 8.85s

### MORDIDA 8 · o tique volta a enfileirar pintura
   E  AssertionError: o piloto mandou 30 pinturas em 3 s com a ponte a 300 ms —
      ele está enfileirando, e o WebKit as executa todas com dado velho
   E  assert 30 <= 15
   FAILED tests/unit/test_a_tela_nao_samba.py::test_o_tique_nao_enfileira_com_a_ponte_lenta
   1 failed, 10 deselected in 5.03s

=== cura devolvida ===
['11 passed in 22.45s']
```

A nona, acrescentada depois do recado do coordenador (a régua passou a 12):

```
### MORDIDA 9 · a fita volta a ser trocada com um chip em voo dentro
   E  AssertionError: a fita foi trocada com um chip em voo dentro — [1, 0, 0]
   E  assert [1, 0, 0] == [0, 0, 0]
   FAILED tests/unit/test_a_tela_nao_samba.py::test_a_fita_nao_e_trocada_com_um_chip_em_voo
   1 failed, 11 deselected in 2.27s
```

**As duas mordidas 3 e 4 nasceram de um fracasso e é ele que as torna úteis.**
Na primeira rodada as réguas do `cor`, do `plastico` e do bloco **passaram com a
cura arrancada** — três réguas que não mediam nada. As duas primeiras foram
refeitas contra o CONTRATO (troque o CSSOM por um `setAttribute` no `style` e
elas reprovam) e as curas correspondentes foram desfeitas; a terceira mudou de
alvo, porque a página que ela media (`01-jogar`) não tem bloco nenhum.

### A prova de tela, no TEMPO

```
### ABA 03 — a dica de modo, 5 s, mesa parada
   COM A CURA:      {'vivos': 8, 'de': 8, 'mutacoes': 0, 'titulos_iguais': True}
   CURA ARRANCADA:  {'vivos': 8, 'de': 8, 'mutacoes': 1166, 'titulos_iguais': True}

### ABA 10 — a linha da lista de perfis, 5 s, e o clique
   COM A CURA:      {'vivos': 33, 'de': 33, ...}
                    [gesto] 10-perfis.html · selecionar → aplicado
                    APLICADO: ['10-perfis.html:selecionar'] RECUSADO: []
   CURA ARRANCADA:  {'vivos': 0, 'de': 33, ...}

### AS FOTOS, aos 0 s e aos 5 s
   1ae3a7b3d5fe62ec4638267e527d20a3  samba-prova-03-t0.png
   1ae3a7b3d5fe62ec4638267e527d20a3  samba-prova-03-t5.png   ← idênticas COM a cura
   65890fb10329c7d576fb7bd6f92c2bab  samba-mordida-03-t0.png
   65890fb10329c7d576fb7bd6f92c2bab  samba-mordida-03-t5.png ← idênticas SEM a cura
```

O clique pousa de primeira: **um** gesto mandado, **um** aplicado, **zero**
recusados. E com a cura arrancada os 33 nós que ela estava apontando saem do
documento em menos de 5 s — é o *"botões não funcionam"* dela, medido.

### O diário da janela (Passo 5)

```
===== a janela abriu em 2026-09-06T04:26:00 =====
  WM_CLASS = 'hefesto-dualsense4unix', 'Hefesto-Dualsense4Unix'
  ícone pelo tema (hefesto-dualsense4unix)
2026-09-06T04:26:01 [info] tema_da_sessao_adotado  tema=adw-gtk3-dark
…
voltas: 40 · abas visitadas: 1
```

---

## O que ficou para outra posse

### RELATO 1 — `interface/pacotes/a07_lancadores.py`: dois donos para a fita

`a07_lancadores.py:927` declara `SELETOR_DA_FITA = ".fita"` e publica um bloco
nesse seletor. **`.fita` é endereço do PILOTO** — quem a escreve é
`window.__hef.pintar`, do `carga["fita"]` que `_fita()` monta. Por tique
acontecem os dois: o piloto troca a fita pela dele (`f.outerHTML = desejado`) e
o bloco do pacote a troca de volta pela do mockup.

Consequências medidas na `07-lancadores`, mesa parada:

* **120 mutações em 40 tiques**, 3 por tique, e os 26 selos da página
  recarimbados a cada volta porque os nós são recriados;
* **a fita que ela vê é a do MOCKUP** — com um chip *"Todos"* que a fita viva
  desta aba não tem, e sem o `data-campo` que a torna clicável. O produto
  perde; o desenho congelado ganha.

A cura é do pacote: publicar o conteúdo por um `data-campo` próprio, ou deixar a
fita inteiramente com o piloto. **Não toquei** — `interface/pacotes/` é
`nao_toca` no frontmatter.

### RELATO 2 — `interface/pacotes/a03_gatilhos.py`: o chip do lugar vazio

O pacote publica um bloco no seletor
`[data-controle="p2"] [data-campo="chip-do-controle"]` com o chip *"P2 ·
Desconectado"*, e no MESMO tique `pacotes.apagar_os_lugares_sem_dono` escreve
`—` (o travessão) no mesmo endereço, pela coluna. **Dois donos, um endereço.**

Antes das curas isso batia 2 mutações por tique (o nó alternando entre os dois
textos, para sempre). Com a memória do bloco a alternância parou, mas o
**resultado visível continua errado**: a coluna do lugar vazio mostra um
travessão pelado onde as colunas P3 e P4 mostram *"P3 · Desconectado"*. Está na
foto `/tmp/samba-prova-03-t5.png`.

Quem decide é quem possui `interface/pacotes/` — ou o bloco sai, ou o lugar
vazio deixa de ser apagado pela coluna naquele endereço.

### RELATO 3 — o teto de 100 ms na `09-sistema` (Passo 4)

O teto foi passado **7 vezes em 40 tiques**, só nesta aba, com um pico de
**1.394 ms** (1.250 ms nas duas viagens de IPC). O piloto agora DIZ e pula, mas
a causa é do outro lado.

**A hipótese do enunciado NÃO se confirmou.** A sprint suspeitava de
`profile.list` abrindo os 33 perfis com `FileLock` a cada tique. Medido em laço
apertado, com os 33 perfis (e 34 `.lock`) no disco dela:

```
estado_do_daemon()          mediana 0,48 ms · max  0,69 ms
pacote 09-sistema.html      mediana 0,08 ms · max 19,04 ms
pacote 10-perfis.html       mediana 6,29 ms · max 19,46 ms
pacote 01-jogar.html        mediana 1,18 ms · max  5,19 ms
pacote 08-conexoes.html     mediana 3,55 ms · max 35,96 ms
```

A leitura dos perfis custa **6,29 ms de mediana** e mora no PACOTE (Python
lendo o disco), não no socket — bem abaixo do teto, e a `10-perfis` não passou
dele uma vez. O que estoura é INTERMITENTE e está na `09-sistema`, cuja mediana
é 0,08 ms: é uma volta de recarga que vai ao disco/journal. Dono provável:
`interface/pacotes/a09_sistema.py` (e o que ele consulta). **Não toquei.**

### RELATO 4 — o foco dentro de um bloco que troca

O Passo 3 protege o `hef-em-voo`. **Não protege o foco**: um `<input>` ou um
`contenteditable` sendo digitado dentro de um bloco que troca perde o foco e o
texto na troca. Não é o que a sprint pediu e a guarda seria de uma linha
(`alvo.contains(document.activeElement)`), mas ela congelaria o bloco enquanto
o cursor estivesse lá — é decisão de produto, não de piloto. Fica escrito.

### RELATO 6 — a `.fita` e os dois donos MORTOS (`a06_navegacao`, `a09_sistema`)

Recado do coordenador, vindo da `ONDA4-S10-O-TRANSPORTE-01`. **Confirmado na
consequência, corrigido no mecanismo** — e a correção importa, porque é ela que
explica por que ninguém viu.

**O que ela reportou:** a `.fita` é trocada inteira antes de a pintura visitar
campo nenhum, e por isso `a09_sistema._html_da_fita` e
`a06_navegacao.chips_da_fita` estão mortos na tela.

**O que a minha régua diz sobre a troca:** ela **não** acontece a cada tique.
Com a mesa parada, `06-navegacao` muta **0** vezes em 40 tiques e `09-sistema`
muta 4 (e as 4 são o registro do sistema crescendo). A fita é trocada **uma
vez**, no primeiro tique, e depois casa com o que o piloto emite — a comparação
`agora !== desejado` faz o seu trabalho. Não há repintura de fita, nem churn.

**E os dois donos estão MORTOS assim mesmo** — medido no DOM vivo, com o daemon
dela no ar:

| aba | `[data-campo="fita-chips"]` no HTML publicado | no DOM VIVO | o pacote emite? |
| --- | --- | --- | --- |
| `06-navegacao` | 1 | **0** | sim, todo tique |
| `09-sistema` | 1 | **0** | sim, todo tique |

O endereço **deixa de existir no documento**. `hefesto_vivo.py:2913` faz
`carga["fita"] = _fita(ctx.mesa, self.pagina)` — sobrescrevendo, sem condição, o
que o pacote tenha posto — e o `monta.fita()` que entra no lugar carrega
`data-campo="fita-chip"` (singular, um por chip) e **não** `fita-chips`
(plural, o miolo inteiro). Os dois pacotes escrevem, todo tique, para um
endereço que não está mais lá.

**Por que ninguém viu, e é a lição:** *não há mutação, não há erro, não há
churn*. Uma régua que procurasse repintura acharia uma tela quieta; o contador
de pinturas do piloto conta 0 porque `achar()` devolve zero elementos, e zero é
indistinguível de "não havia o que pintar". O único sintoma é a AUSÊNCIA — que é
a forma de defeito mais cara desta casa.

**Não é minha posse curar.** `interface/pacotes/` é `nao_toca` no frontmatter, e
a decisão é de produto: ou a fita tem UM dono (o piloto, e os dois pacotes param
de emitir), ou o `monta.fita()` passa a publicar o `fita-chips` para os donos de
aba escreverem nele. A segunda mistura duas verdades no mesmo lugar; a primeira
é a forma que esta casa já escolheu para o resto. Quem decide é quem possui
`interface/monta.py` e os dois pacotes.

O que ESTA sprint pôde fazer, e fez: a fita passou a nunca ser trocada com um
`hef-em-voo` dentro, com régua e mordida (a nona, colada acima).

### RELATO 5 — o portão `referencias-docs` já estava VERMELHO na base

`f856cbd5`, árvore limpa, sem uma linha minha:

```
na ÁRVORE LIMPA rc=1
7 referência(s) morta(s) em 838 documento(s):
  docs/data/LEIA-PRIMEIRO.md:462: scripts/migrar-mapa-v2.py  [arquivo]
  docs/process/2026-08-15-A-QUEDA-…:292: scripts/migrar-mapa-v2.py  [arquivo]
  …
```

`scripts/migrar-mapa-v2.py` foi apagado em `4cb7e97d` (05/09) e sete linhas de
prosa continuam a citá-lo. Não toquei em `docs/` (0 arquivos no `git diff`), e o
conserto é de quem possui essa prosa. **O outro vermelho da primeira volta —
`anonimato`, por um `feito por` que eu mesmo escrevi num docstring — já está
curado.**
