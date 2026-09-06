# ONDA5-P-01 — o terceiro lugar do recado, a quarta porta, e o dono que era o modelo

**Agente F-ONDA5-P-01 · 06/09/2026 · branch `voo/ONDA5-P-01-F-ONDA5-P-01`**
Base conferida: `72690101` (`onda/atual-0609`), sem adiantar.

---

## 0. EM UMA LINHA

O piloto ganhou **a quarta porta de escuta** (`data-hef-vivo`, o gesto que lê a
cada tecla e não grava), **a recusa dos dois lugares** de recado que faltava ao
terceiro lugar, e **o dono do campo virou assento** — e essa terceira era um
defeito VIVO, não uma precaução: quatro campos da `05-vibracao` publicada
voltavam com o nome do plástico no lugar do jogador. Mais **a corrida do
desfecho** que a `ONDA5-01-03` relatou, curada e mordida (§1.4), e o julgamento
do segundo achado dela (§6b).

---

## 1. O QUE FECHOU

### 1.1 O terceiro lugar — a metade que faltava era a RECUSA

**Metade do Passo 1 já estava no disco quando cheguei.** A costura de 06/09
(`14e0771f`, *"o terceiro lugar do recado — a faixa que a página declara"*)
trouxe o `data-hef-recados` do relatório da `ONDA5-05-03`. O que ela **não**
trouxe é o resto da decisão da sprint: *"um lugar por página, e a régua recusa
dois"*.

O que entrou agora, em `pintar_recados` (`hefesto_vivo.py:847`):

| quantos containers declaram o tom | o que o piloto faz |
| --- | --- |
| zero | cartão, depois tarja — **byte a byte** o de ontem |
| um | o recado pousa nele, com as classes do `data-hef-recado-classe` |
| **dois ou mais** | **recusa os dois**, nomeia-os em `window.__hef.faixasDemais` e volta ao cartão |

**Por que recusar em vez de escolher o primeiro:** um `querySelector` desempata
por ordem do documento — a tela decidindo por ordem de marcação, que é o defeito
da lista plana (T-04). Escolher em silêncio deixaria a página errada funcionando
por acaso até o dia em que a ordem mudasse.

**A conta se refaz a cada chamada**, e não uma vez na instalação: quem declara o
container é um bloco de outra frente, e um bloco se troca inteiro no tique.

### 1.2 A quarta porta — `data-hef-vivo`

O ouvinte tinha três portas (`hefesto_vivo.py:1304`, `:1305`, `:1325`) e nas três
quem responde é o gesto de `data-hef-gesto` — que no campo do jogo da aba 10 é
`editor.jogo`, **e ele grava o perfil dela**. `input` é o único evento que um
campo de texto dispara a cada TECLA.

Nasceram, no JS (`:1331`, `:1389`, `:1405`) e no Python (`:2354`, `:2414`):

* `document.addEventListener('input', …)` → `manda_do_vivo`, que despacha o gesto
  de `data-hef-vivo` e **nunca** o de `data-hef-gesto`, ainda que o mesmo
  elemento traga os dois;
* `carga_do_alvo(alvo, ev, gesto, voo)` — a montagem da carga passou a ter **um
  dono só**. Ela morava dentro do ouvinte de clique, e a porta nova teria de
  repeti-la: a segunda cópia divergiria no primeiro campo novo;
* **sem `em_voo`** — o cursor `progress` a cada tecla seria a tela dizendo
  "trabalhando" sobre uma leitura de milissegundos;
* **a guarda de gravação**, e ela PERGUNTA AO DONO: `pacotes.GESTOS_QUE_MEXEM`, o
  mesmo registro de que `PERIGOSOS` é derivado. Um `data-hef-vivo` apontado para
  um gesto que declara `grava=` é recusado **antes de a função ser chamada**,
  nomeando o gesto e o que ele grava;
* **`CHAVES_QUE_O_VIVO_RECUSA`** (`:294`) — a resposta não pode trazer `blocos`
  nem `fita` (trocam HTML inteiro e arrancariam o campo debaixo do dedo dela) nem
  `recado`/`recados` (o canal de aviso tem prazo de 6 a 30 s; um aviso por tecla
  o encheria de frases que ela não pediu);
* **um vivo em voo por elemento** — cada disparo leva série e identidade, e o
  Python descarta a resposta que chegar fora de ordem.

**Por que o registro e não a constante `PERIGOSOS`:** aquela é avaliada no import
do módulo, e um pacote importado depois — o caminho de toda régua que registra um
gesto à mão — não entraria nela.

**A armadilha que isso quase criou, e que virou guarda:** o ouvinte manda o
**dataset inteiro** ao Python. Sem a marca do vivo nascer vazia na lista
explícita (`vivo: '', vivoChave: ''`), uma página que um dia escrevesse
`data-vivo` num botão faria um CLIQUE cair no caminho do gesto vivo — sem voo,
sem recado, com a guarda de gravação por cima, e **calado**. Nenhuma das dez
páginas tem `data-vivo` hoje; a régua o injeta de propósito para exercitar a
guarda em todo disparo.

### 1.3 O dono do campo — e o defeito estava VIVO

A `ONDA5-05-02` relatou (§4.3) que `data-controle` tem dois significados:
assento (`p1`..`p4`) no piloto, **modelo** no desenho compartilhado
(`ds_limpo.svg:2`, `data-controle="dualsense"`). Medi antes de acreditar:

```
                        publicado            bancada
05-vibracao.html   treme-e, treme-d      treme-e, treme-d     ← DENTRO do <svg>
                   nas colunas p1 e p2
```

**São quatro campos por arquivo, com alvo `classe`, que o `LER_CAMPOS` devolvia
com dono `"dualsense"`** — e que a régua do mockup nunca casava com a coluna que
os pinta. A disciplina que segurava o resto está escrita em
`a04_iluminacao.banco_de_luzes` (*"nenhum `data-controle` nasce aqui"*), e
disciplina não é cura: ela cobra de toda frente futura o que uma linha resolve.

A cura é `SELETOR_DO_DONO` (`:276`), uma lista de PERMITIDOS derivada de
`pacotes.TODOS_OS_LUGARES`, aplicada nos **quatro** lugares que resolviam dono: o
ouvinte, o `@controle` do `data-hef-forma`, o `LER_CAMPOS` e o `CLIQUE_COM_ALVO`.

**O VAZIO ENTRA, e essa é a divergência que relato com a sprint** — ver §5.

### 1.4 O desfecho do pouso é o DESTA execução — achado da `ONDA5-01-03`

**Chegou pelo coordenador enquanto eu fechava, e caiu na minha posse.** A chave
de `self.desfechos` é `página:gesto`, e o MESMO gesto pode estar em voo duas
vezes — o `click` e o `change` de um `<select>`, ou dois cliques em colunas
diferentes. As duas threads escrevem na mesma chave, e o `finally` de cada uma
lia **dali** para decidir a cor do pouso: com uma recusando e a outra aplicando,
o botão de quem RECUSOU pisca verde.

**Não pus o voo na chave**, que era a sugestão. `desfechos` é o RELATO, e a chave
dele é lida por nome em toda régua desta casa e no `--prova-gesto`; um número de
voo ali trocaria um verde falso raro por um relato ilegível em todas. O que mudou
é que os dois ramos do `try` escrevem a MESMA tupla em dois lugares na mesma
linha — o dicionário (o relato) e `desta_vez` (o pouso). O dono continua sendo
um: quem mudar o desfecho muda o pouso junto, que era a razão de o `finally` ler
o dicionário.

---

## 2. AS MORDIDAS — seis, todas reprovando, todas devolvidas

A cura foi devolvida do backup e o `md5sum` confere (`953b6017…` antes e depois).

| # | o que foi arrancado | o que reprovou |
| --- | --- | --- |
| 1 | a recusa dos dois lugares (voltou ao `querySelector`) | `test_dois_lugares_iguais_a_pagina_perde_os_dois` — *"o recado tinha de voltar ao cartão, e pousou em `'faixa'` (pai `'regua-faixa-0'`) — a tela escolheu por ordem do documento"* |
| 2 | o `addEventListener('input', …)` inteiro | **6 reprovações** — a quarta porta, a pintura da leitura, o `em_voo`, a guarda de gravação, a do bloco e a da ordem |
| 3 | a guarda do `grava=` | *"o gesto vivo que DECLARA gravação foi chamado: `['vivo:GRAVOU']`"* |
| 4 | o descarte da resposta velha **e** a lista de chaves recusadas | *"a resposta velha pintou por cima da nova: `'o rótulo da tecla velha'`"* e *"a recusa do bloco não aparece"* |
| 5 | o seletor do dono (voltou ao genérico, nos quatro lugares) | *"o dono do campo continua sendo o MODELO: `{'dualsense': ['treme-e', 'treme-d', 'treme-e', 'treme-d']}`"* e a régua do dono único |

| 6 | o pouso voltou a ler `self.desfechos` | *"o botão do p1 piscou VERDE depois de o produto ter RECUSADO: o pouso leu o desfecho que o vizinho escreveu na mesma chave"* |

**A mordida 5 é a prova de que o defeito era vivo**, e não uma precaução: com a
cura arrancada, os quatro campos da página PUBLICADA voltam dizendo `dualsense`.

**A MORDIDA 6 NÃO MORDEU NA PRIMEIRA VOLTA, e a lição é da forma do defeito.**
A primeira versão dela fazia um gesto DEMORAR — e passou verde com a cura
arrancada. Entre o `except` que escreve o desfecho e o `finally` que o lê não
passa tempo nenhum, nem uma linha: **nenhum atraso abre essa fresta**. A fresta
teve de ser aberta por dentro, no dicionário do produto — quando a thread que
recusou escreve, ele a segura e deixa a vizinha escrever `"aplicou"` na mesma
chave. É o entrelaçamento que o escalonador pode produzir sozinho e que ninguém
consegue agendar de fora. *Uma régua que espera a corrida acontecer não mede
corrida nenhuma.*

Régua nova: `tests/unit/test_o_piloto_tem_o_terceiro_lugar_e_a_quarta_porta.py`
— **14 testes**, WebKit de verdade, janela `--oculta`, página publicada, clique
no botão do produto e `Event('input')` no ouvinte do produto.

---

## 3. A PROVA DE TELA

Janela `--oculta`, com `HOME` e os quatro `XDG_*` desviados para um lar de
mentira — o piloto dispara migrações one-shot no `~/.config`, e a bancada é dela.

**As duas fotos estão nesta pasta:**
`ONDA5-P-01-antes-sem-faixa.png` · `ONDA5-P-01-depois-na-faixa.png`

| | lugar | pai | caixa do recado | desenho do controle |
| --- | --- | --- | --- | --- |
| **sem faixa** | `grade` | `div.ctrl` | x=209 **y=228** larg=222 alt=46 | x=241 **y=230** 162×112 |
| **com faixa** | `faixa` | `vib-estado` | x=54 **y=697** larg=1119 alt=16 | x=241 **y=230** 162×112 |

**O número que decide:** sem faixa o recado nasce em y=228 e tem 46 px de altura,
sobre um desenho que começa em y=230 — **ele cobre o controle**, e a foto mostra
isso. Com a faixa ele desce para a linha de estado no rodapé do bloco, com as
classes `hef-recado est recibo` que a página mandou, e **o desenho não se move um
pixel**.

**O dono, medido no mesmo instante e nos dois seletores lado a lado:**

```
treme-e@p1 → o seletor genérico responde "dualsense"
treme-d@p1 → o seletor genérico responde "dualsense"
treme-e@p2 → o seletor genérico responde "dualsense"
treme-d@p2 → o seletor genérico responde "dualsense"
```

A chave de cada linha (`treme-e@p1`) é o dono pelo seletor NOVO; o valor é o dono
pelo antigo. Quatro campos, quatro respostas trocadas.

**O clique** está na régua, não na foto: o roteiro clica no 🎙 do cartão do p1 na
`02-controles` (o botão do produto, com o `data-mudo` que a página publicada
traz) **três vezes** — sem faixa, com uma, com duas — e dispara `input` e
`change` de verdade no ouvinte, seis vezes, com os atributos ligados e
desligados.

**O DUBLÊ DESTA RÉGUA É MAIS POBRE QUE O DAEMON, e está declarado:** os dois
cartões das fotos dizem `P1`, porque o estado dublê não traz `player_slot` nem
`index` e `base.numero_do_controle` cai em `1`. **Não é defeito do produto** — o
`pref` das colunas está certo (`p1`, `p2`), que é o que estas medições usam.

---

## 4. OS PORTÕES

```
bash scripts/portoes.sh --rapido → TODOS VERDES — 28 portões
bash scripts/portoes.sh          → TODOS VERDES — 45 portões
```

E as **108 réguas vizinhas** que leem o bootstrap, o `LER_CAMPOS`, o
`CLIQUE_COM_ALVO` ou o piloto, rodadas em quatro lotes — **duas vezes**, antes e
depois da cura do desfecho (§1.4):

```
468 passed · 438 passed · 357 passed · 321 passed
```

**O único vermelho, nas duas voltas, foi o `citacoes-de-linha`, e ele era meu**:
o piloto cresceu +163 linhas antes do `_fita` e +297 antes do
`_recusou_dizendo`, e **cinco** citações em prosa de código envelheceram junto.

* **quatro estão em `interface/pacotes/`, que a minha sprint declara em
  `nao_toca:`** → foram para `_CITACOES_PENDENTES` com o número certo já medido,
  no molde que a `ONDA5-06-01` e a `ONDA3-MOTOR-01` deixaram hoje. **Duas delas
  já estavam erradas antes desta leva** e só não reprovavam por não caírem em
  linha vazia — a do `a09_sistema.py` apontava para o docstring do `_dialogo`;
* **uma está em `interface/aba05.py`, que não é `nao_toca` de ninguém** → foi
  corrigida no lugar. E ao medi-la descobri que **as três citações daquele
  comentário já estavam erradas antes desta leva** (`:240` caiu numa linha em
  branco, `:286` apontava para um comentário e `:229` para um `.strip()`); as
  três foram remedidas.

---

## 5. A DIVERGÊNCIA COM A SPRINT — e ela é uma só

A sprint diz, no Passo 3: *"o piloto só aceita como dono um `data-controle` cujo
valor seja assento (`p1`..`p4`); **qualquer outro valor** é ignorado"*.

**Aplicar isso ao pé da letra ressuscitaria um defeito curado ontem.**
`data-controle=""` não é um valor de modelo: é o **ESCUDO** que
`monta._endereco_do_chip` põe nos chips da fita para dizer *"este clique não é de
controle nenhum"*, e o comentário dele traz a medição de 05/09/2026 — sem o
atributo vazio, o *"deu certo"* de trocar do P1 para o P2 pousava no cartão do
P1. Tirado do seletor, o `closest` deixaria de parar no chip, subiria sem achar
dono e o clique cairia no `alvoPadrao` — o mesmo defeito, por outro caminho.

Então o seletor aceita **o vazio e os quatro assentos**, e a régua cobra as duas
metades. A razão está escrita no `SELETOR_DO_DONO` e no teste.

---

## 6. O QUE NÃO FIZ, E POR QUÊ

1. **Não publiquei página nenhuma, e não escrevi um `data-hef-vivo` nem um
   `data-hef-recados` em desenho nenhum.** O que nasce aqui é CAPACIDADE do
   piloto; quem a usa é a 05-03 (já declarou o `#vib-estado` na bancada) e a
   10-02, cada uma na sua página — e publicar é ato dela.
2. **Não liguei o rótulo "ao vivo" da aba 10.** `a10_perfis.py` é `nao_toca` da
   minha sprint. A porta está de pé e o `_so_mudou` já barra `input` desde
   06/09; falta um `data-hef-vivo="<gesto de leitura>"` no campo do jogo e um
   gesto de leitura registrado — **é uma linha no gerador e uma função no
   pacote**, as duas da frente daquela aba.
3. **Não medi o `mtime` do perfil dela com o rótulo ao vivo ligado**, que é a
   segunda foto que a sprint pede. Não dá para medir o que não existe: sem o
   atributo publicado na aba 10, não há campo vivo naquela página. O que medi no
   lugar é a metade que responde pela mesma pergunta e é minha: **o gesto vivo
   que declara gravação é recusado antes de ser chamado**, com régua e mordida.
4. **Não renomeei o `data-controle` do SVG compartilhado.** A sprint o declara
   fora do escopo, e ele é `nao_toca`. Fica como dívida da frente do desenho
   compartilhado — e agora ela é dívida de LIMPEZA, não de defeito: o piloto já
   não confunde os dois.
5. **Não rodei a suíte inteira** — é de quem coordena, e roda no fim. Rodei o
   meu escopo e as 108 vizinhas.
6. **Não usei a bancada.** A sprint declara `bancada: false`, e nenhuma medição
   aqui pede aparelho: as duas mesas são dublês.

---

## 6b. O RECADO DE PÁGINA NO CARTÃO DE CONTROLE — o segundo achado, e o meu julgamento

O coordenador entregou o achado da `ONDA5-01-03` (relatório e foto em
`ae9a8f71`): *a recusa do cadeado — um gesto de PÁGINA — pousa no cartão do P1 e
cobre o nome dele*. Medi a causa antes de julgar, e ela **não** é o que o
comentário do piloto dizia.

**O fato errado, substituído no mesmo commit.** O `carga_do_alvo` trazia escrito
que o alvo padrão *"é da RÉGUA — no produto fica indefinido"*. **Não fica.** O
`_tique` escreve `carga["alvo"]` nas abas cuja fita ESCOLHE, e o `pintar` o
guarda em `window.__hef.alvoPadrao` — e o comentário do próprio `_tique` diz por
quê: *"A fita É a tela dizendo"*. No produto, um botão que não mora em coluna de
controle nenhuma chega ao Python com o controle que ela apontou na fita, **e isso
é desenho, não acidente**. A frase errada estava no piloto desde que a fita
aprendeu a escolher; agora está corrigida, com o custo medido escrito ao lado.

**O julgamento: NÃO é uma quarta peça — é esta sprint, e a saída já está de pé.**
O terceiro lugar entrega exatamente isto: a `01-jogar` declara `data-hef-recados`
num container de página e a recusa do cadeado para de pousar no cartão. Falta o
atributo no desenho (frente da aba 01) e a publicação (ato dela). **Nada mais é
preciso do piloto.**

**O que SOBRA e é de verdade uma quarta**, com o diff pronto e não aplicado: se a
página **não** declarar faixa, o recado de um gesto sem dono continua endereçado
ao controle da fita. A cura seria o JS dizer se o `closest` achou dono de
verdade, e o `_gesto` esvaziar o endereço do recado quando não achou:

```
carga_do_alvo:  semDono: dono ? '' : 'sim'
_gesto:         alvo = "" if o.get("semDono") else norm_mac(...)
```

**Não a apliquei, e a razão é uma só:** ela muda para onde a frase aparece em
TODO gesto sem dono das três abas que escolhem — não só no cadeado —, e o
relatório da `ONDA5-01-03` já nomeia o ponto como *"decisão de tela (dela)"*. O
alvo da fita é palavra dela (*"Esta aba passa a mirar o P2"*); decidir que o
recado deixa de segui-lo é decidir por ela, em silêncio, na tela. Fica escrito,
com a causa medida e o diff, para quem tiver a palavra.

---

## 7. O QUE ACHEI E NÃO ERA DA MINHA POSSE

1. **`a04_iluminacao.banco_de_luzes` pode perder a nota da disciplina.** O
   comentário *"NENHUM `data-controle` NASCE AQUI, e a omissão é medida"* existe
   porque o `closest` confundia modelo com assento. A restrição continua boa por
   outras razões (o bloco é de alvo `html`), mas o **motivo** que ele dá caducou:
   quem for dono daquele arquivo pode trocar a razão pela nova.
2. **`interface/aba01.py:909` e `interface/aba08.py:1740`** também descrevem o
   `closest` pelo seletor genérico, em prosa. Não reprovam nenhuma régua (não
   citam linha), mas descrevem um piloto que já não existe.
3. **A `05-vibracao.html` publicada não tem UM `data-gesto`.** Medi ao procurar
   um botão para clicar: zero. A bancada tem; o publicado, não — e publicar é
   ato dela. É por isso que a régua deste arquivo clica na `02-controles` e só
   navega para a `05` para ler o DOM.
4. **`base.numero_do_controle` cai em `1` quando o estado não traz `player_slot`
   nem `index`.** Não é defeito — é o contrato escrito na docstring —, mas todo
   dublê de mesa desta casa que esquecer os dois campos vai desenhar dois `P1`
   lado a lado e parecer defeito de tela. Vale uma linha no molde dos dublês.

---

## 8. O QUE SOBROU PARA O PRÓXIMO

* **ligar o rótulo do jogo à quarta porta** (aba 10) — o item 2 da §6;
* **declarar o `data-hef-recados` nas páginas que o querem**, e publicar — a
  `01-jogar` é a mais urgente das dez: é lá que a recusa do cadeado cobre o nome
  do controle (§6b);
* **a palavra dela sobre o endereço do recado sem dono** (§6b), com o diff
  pronto;
* **apagar as quatro linhas de `_CITACOES_PENDENTES`** quando quem for dono de
  `a03_gatilhos.py`, `a06_navegacao.py`, `a09_sistema.py` e `a10_perfis.py`
  trocar os números que já estão medidos ali.
