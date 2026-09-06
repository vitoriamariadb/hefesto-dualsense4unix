---
sprint: LUZES-01
estado: feita
decisoes: [D-0609-PRIORIDADE-TODAS-AS-ABAS]
posse:
  04A:
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
    - src/hefesto_dualsense4unix/interface/aba04.py
    - mockup/04-iluminacao.html
    - tests/unit/test_a_aba_04_iluminacao_fecha_as_linhas.py
cria:
  - tests/unit/test_a_04_as_cinco_lampadas_sem_o_numero.py
depois_de: [ONDA5-07-02]
nao_toca:
  - src/hefesto_dualsense4unix/interface/paginas/04-iluminacao.html
  - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/daemon/
  - docs/data/paridade-gtk-html.csv
---

# LUZES-01 · PARIDADE — as cinco lâmpadas sem trocar o número, e o automático que o Salvar apaga

> **FEITA em 06/09/2026** — `voo/LUZES-01-BLUZ`, relatório em
> `docs/process/agentes/2026-09-06/LUZES-01.md`.
>
> **AS CINCO LINHAS QUE ERAM O TRABALHO FECHARAM** (`140`, `141`, `142`,
> `143`, `148`): as cinco luzes de jogador viraram botões, seis teclas de
> desenho nasceram (`P1`..`P4`, todas e nenhuma), o indicador virou o botão de
> reenvio e a faixa do título ganhou o "Todos no automático". `PISO_DA_ABA`
> foi de 7 para 11, e **as treze peças novas responderam ao clique no
> WebKitGTK**, com o dono resolvido em `p1` — não em `dualsense`.
>
> **A §4 ENCOLHEU: a `146` e a `151` também já estavam fechadas**, pelo
> interruptor da D-13 publicado em 04/09 (`paginas/04-iluminacao.html:2016`).
> O que sobrava da `151` era a mesma metade da `146`; o ramo D4 não tem
> premissa nesta aba, porque toda escrita de cor leva `uniq` e o override
> vence a camada automática no merge. **Os quatro vereditos estão no relatório,
> com o endereço lido, para a `PARIDADE-REMEDIR-01` aplicar.**
>
> **O PASSO 3 MUDOU DE FORMA depois de medir o motor:** gravar `[False] * 5`
> **prende** as lâmpadas apagadas (`manager._controllers_to_specs` lê
> `model_fields_set`). O caminho de volta é o campo SAIR do override mais o
> `profile.switch`, que é o único que solta a camada da usuária
> (`manager.py:425`).
>
> **E O PASSO 1 CUSTOU UMA FAIXA DA GRADE, que foi desfeita.** A conta de
> "38px de folga no `.miolo`" estava errada — os 38 são o RODAPÉ, e a aba
> passou a rolar por dentro. As doze teclas foram para dentro da `.aceso`, que
> tinha 152px vagos, e a coluna **não cresceu um pixel**.
>
> **O que NÃO nasceu:** a `158` continua condicional (pede um escopo "Todos"
> de DESENHO, e o `auto-todos` é de COR), e a "prévia honesta" continua fora
> por decisão de coordenação (§4).

> **A decisão dela, 06/09/2026** (`D-0609-PRIORIDADE-TODAS-AS-ABAS`): *"todas as
> abas, menos Lançadores"* — a 04 entra na leva das 24 horas.
>
> **E o foco que ela nomeou no mesmo dia:** *"fazer os 4 dualsense funcionar
> seja via bt ou cabo"*. As cinco lâmpadas de jogador são como quem joga sabe
> **quem é quem** numa mesa de quatro. Sem elas, quatro controles idênticos.

**Onze linhas da aba 04 estão `FALTA_NO_HTML` no CSV da paridade. Duas já não
são falta** (§1), **uma não entra** (§4), e **oito são o trabalho** (§3).

---

## 1. AS DUAS QUE JÁ FECHARAM — não construa, RELATE

O próprio CSV já diz que estas duas envelheceram, e diz onde:

| linha | o que o CSV registra hoje |
| --- | --- |
| *Escolher uma cor livre (paleta do sistema)* | *"FATO DERRUBADO em 04/09/2026: a linha do publicado é hoje `<input type="color" class="livre" value="#0000ff" data-gesto="cor"` — **igual à do mockup**"* |
| *Marca de qual cor está escolhida agora* | *"FATO DERRUBADO em 04/09/2026: `grep -c 'data-campo="hex"'` dá **18 nos DOIS**. **VEREDITO A RE[VER]**"* |

**Confira as duas com os próprios olhos** (`grep` nos dois arquivos, e o
`data-gesto="cor"` chegando ao `@gesto("04-iluminacao.html", "cor")` em
`a04_iluminacao.py:2031`) e **RELATE o veredito novo com o endereço lido**. O
CSV está no `nao_toca`: quem o edita é a `PARIDADE-REMEDIR-01`, na onda D, e
ela vai ler o seu relatório. **Nenhuma linha vira IGUAL sem endereço lido no
código** — é a regra dessa sprint, e ela vale para o que você relatar.

---

## 2. O QUE SE MEDIU — a escrita das cinco luzes EXISTE, e está presa ao número

Este é o achado que dá forma à sprint, e ele contraria a leitura fácil de que
"o HTML não escreve player-LED":

| peça | onde | o que faz hoje |
| --- | --- | --- |
| a porta da ponte | `interface/pacotes/ponte.py:63` | `player_leds_set_detalhado` reexportada, pronta |
| o único chamador | `interface/pacotes/a04_iluminacao.py:2786` | `p.player_leds_set_detalhado(bits, uniq=alvo)` — **dentro de `_acender_o_numero`** |
| quem chama `_acender_o_numero` | `a04_iluminacao.py:2880`, no fim do gesto `player` | depois de `identity_number_set(uniq, n)` |
| o dono no motor | `app/actions/lightbar_actions.py:1383`, `:1229`, `:1305`, `:1329`, `:1346`, `:1349` | os cinco checkboxes, os presets P1..P4, todas acesas/apagadas e o reenvio |

**A consequência, e é ela que se sente na mão:** dar a este controle o desenho
do P3 **mantendo o número dele** é impossível pelo HTML. Toda escrita de
lâmpada vem carona de uma renumeração. O CSV escreve isso na linha dos presets:
*"SEMPRE junto com a renumeração, nunca sozinhos"*.

**E o caminho de volta não existe.** Com o co-op fora, o gesto do jogador grava
um override por-`uniq` de `player_leds`, que fica **acima** da camada
automática no merge do backend. Sem um "todas apagadas", o HTML não tem como
devolver as luzes ao automático.

### O QUE PARECIA DEFEITO AQUI, E NÃO É — leia antes de caçar

`interface/pacotes/rodape.py:96` grava `auto_player_colors=False` fixo no
rascunho de cada controle conectado. **Isso NÃO perde configuração dela**, e o
coordenador escreveu o contrário aqui na primeira versão desta sprint, em
06/09, por ter lido **metade** da célula do CSV.

O que a célula diz depois do `||`, e foi remedido pela `ONDA5-07-02` na onda A:

> *"FATO DERRUBADO EM 04/09/2026, medindo o ATO em vez de ler a linha: o
> override por controle NÃO carrega `auto_player_colors`. A linha existe, e o
> valor dela é DESCARTADO duas vezes — `with_controller_leds` chama
> `_leds_draft_to_config` sem `include_auto`, e o filtro `only_fields` o derruba
> de novo. O toggle é do PERFIL, por decisão antiga e escrita nas duas pontas."*

O `leds.auto_player_colors = True` dela **sai intacto** do `to_profile`, e há
régua que tranca isso (`test_o_salvar_nao_congela_a_paleta_automatica.py`).

**A METADE QUE CONTINUA VALENDO, e é o seu Passo 4:** pelo HTML ela **não vê
esse estado nem pode mudá-lo**. É a linha `04[02]` do CSV, e é falta de tela,
não perda de dado. **Não vá caçar um `False` que ninguém grava.**

**E a lição de processo, que vale mais que a linha:** *a célula do CSV tem duas
metades separadas por `||`, e a segunda pode derrubar a primeira.* Leia a
célula inteira antes de escrever uma sprint sobre ela.

## 3. O TRABALHO, EM CINCO PASSOS

### Passo 1 — as cinco lâmpadas ganham gesto próprio

Um gesto `luzes` na aba 04 que escreve o bitmask **sem tocar no número**:
`p.player_leds_set_detalhado(bits, uniq=alvo)` e nada mais. Cinco alvos
clicáveis, um por lâmpada, com o estado vindo do dado vivo — não de memória do
gerador.

**O que o motor já resolveu e você reusa em vez de reescrever:**
`lightbar_actions.py:1383` tem a guarda contra os cinco IPCs redundantes de um
preset. **Leia-a antes de escrever a sua** — cinco cliques em rajada num
controle no rádio é exatamente o caso que ela fez o motor cobrir.

**A MORDIDA:** um teste que clique a lâmpada 3 e prove **duas** coisas: o
bitmask chegou à ponte, e `identity_number_set` **não** foi chamado. Arranque a
segunda asserção e o teste passa com o defeito de hoje — é ela que morde.

### Passo 2 — os quatro presets de DESENHO, e o nome que engana

`lightbar_actions.py:1305` aplica o padrão canônico por
`core/led_control.player_led_pattern`, cobrindo 1..8. **A tabela é do daemon** —
importe-a, não a redigite. Uma segunda cópia da tabela de padrões é a espécie
de segunda verdade que esta casa persegue desde 27/08.

**CUIDADO COM O NOME, e o CSV avisa de propósito:** os botões `1 2 3 4` que já
existem no HTML e os `Desenho do P1..P4` da janela antiga **parecem a mesma
coisa e são opostos**. A janela antiga diz no próprio `title`: *"Não muda o
número deste controle"*. Os quatro botões novos precisam dizer isso na dica, e
a palavra vem do glossário: **"controle"**, **"P1…P4"**. Não escreva "mesa".

**A MORDIDA:** clique `Desenho do P3` num controle que é o P1 e prove que o
número continua 1 e as lâmpadas mudaram.

### Passo 3 — "todas acesas" / "todas apagadas", e o caminho de volta

`lightbar_actions.py:1329` e `:1346`. **"Todas apagadas" tem significado no
motor:** desenho vazio quer dizer *"quem manda é o automático"* — é o único
caminho de volta, e é por isso que ele não é enfeite do par.

Junto: **"Aplicar o desenho"** (`lightbar_actions.py:1349`), que reenvia o
bitmask corrente. Serve depois de reconectar o controle ou trocar de perfil, e
é a resposta para *"acendeu errado e eu não quero mexer em nada"*.

**A MORDIDA:** apague todas, prove que o override saiu (não que ficou zerado —
**saiu**), e que a camada automática voltou a mandar.

### Passo 4 — o automático fica visível e editável, e a regra D4 avisa

O `auto_player_colors` ganha um controle na aba, lendo o estado real do perfil
ativo — nunca um padrão digitado. Com ele, entram os dois irmãos:

* **"Voltar todos ao automático"** (`lightbar_actions.py:1175`): limpa
  `lightbar`/`lightbar_brightness` de **todos** os overrides e religa o
  automático. É o único desfazer de uma vez que ela tem.
* **A regra D4** (`lightbar_actions.py:450`, `:1273`, `:106`): quando não se
  sabe quem está conectado, editar a cor de todos com o automático ligado
  **desliga o automático e AVISA** — senão a paleta vence no merge e a cor
  dela fica invisível. O aviso é `_AVISO_D4`, e ele é do motor: **leia a frase
  de lá**, não a redigite.
* **O aviso "o mesmo desenho foi para os N controles"**
  (`lightbar_actions.py:1550`): o CSV registra que a condição que ele previa
  **aconteceu** em 04/09. Ele nasce agora, com a conta vinda do dado vivo.

**Onde a frase vive:** o recado do cartão, laranja 30 s para recusa e verde 6 s
para sucesso com notícia, é o contrato do glossário §3. **Não invente uma
terceira cor nem uma linha nova de tela.**

**A MORDIDA:** ligue o automático, edite a cor em escopo global e prove que o
toggle caiu **e** que o aviso apareceu. Arranque o aviso e veja a régua
reprovar.

### Passo 5 — a bancada, e a publicação que é ATO DELA

`python3 src/hefesto_dualsense4unix/interface/aba04.py` escreve **`mockup/`**,
nunca a página publicada — ela está no `nao_toca`. Quem a move é
`scripts/check_o_desenho_aprovado.py --publicar 04`, **depois do olho dela**, e
nesta leva isso acontece **uma vez só, no FECHO** (decisão dela, 06/09).

Enquanto não publicar, a bancada e o publicado divergem. **Declare a
divergência em `mockup/DIVERGENCIAS.md`** com a razão, ou
`scripts/check_o_desenho_aprovado.py` reprova a leva inteira.

**A MORDIDA:** rode o gerador e o portão sem declarar — ele reprova apontando a
linha. Declare, e ele passa.

---

## 4. O QUE ESTA SPRINT NÃO CONSTRÓI

**A "prévia honesta" como texto na tela.** Decisão de coordenação de 06/09,
pela regra dela sobre a máscara (10-Q6): *o Hefesto constrói o mecanismo, não
descreve a limitação*. O HTML já pinta o `hex` a partir do `lightbar_rgb` vivo
do daemon — que **é** a cor resolvida —, então a classe de defeito que a janela
antiga curou aqui não pode acontecer do mesmo jeito. Se depois da mesa dos
quatro ela pedir a frase, é sprint nova.

**O CSV da paridade.** É da `PARIDADE-REMEDIR-01`. Você RELATA.

**`rodape.py`.** É da `ONDA5-07-02`. Você RELATA (§2).

---

## 5. NADA SE PERDEU

* **Os seis gestos que a aba já tem** — `cor`, `brilho`, `player`, `auto`,
  `auto-cores`, `apagar`, `reenviar` — continuam inteiros. Em especial o
  `player`: ele **continua** acendendo o número junto com a renumeração
  (`_acender_o_numero`); o que nasce é o caminho **sem** o número, não uma
  troca.
* **A porta da cor é a `_detalhado`** desde 03/09, e `led_set` não volta: o
  `bool` dela não carrega `aplicado_em`/`guardado_em`.
* **O `!important` do `--luz`** e a razão escrita em `a04_iluminacao.py:1205`.
* **A tira do "não sei" tracejada**, o anel do dono e o brilho que viaja com a
  cor — os testes `test_a_04_*` que já existem ficam verdes.
* **A palavra da tela vem do glossário.** "controle", "P1…P4", "barra de luz",
  "luzes de jogador". **"mesa" não entra.**

## A PROVA DE TELA — obrigatória, e é no TEMPO

1. **A FOTO**, antes e depois, `--oculta`. Ela tem UMA tela.
2. **O CLIQUE**: acione cada peça nova e mostre a resposta — a lâmpada isolada,
   um preset de desenho com o número intacto, o "todas apagadas" devolvendo ao
   automático, e o aviso da D4.
3. **A MORDIDA**: arrancada e colada, para cada passo.
4. **NO TEMPO**: a régua de mutações da `A-TELA-SAMBA-01` faz parte desta prova
   (regra do dia). Com a mesa parada, o que você acrescentar não pode mutar o
   DOM tique a tique.

**A JANELA NÃO NASCE NA TELA DELA.** `--oculta` sempre.
