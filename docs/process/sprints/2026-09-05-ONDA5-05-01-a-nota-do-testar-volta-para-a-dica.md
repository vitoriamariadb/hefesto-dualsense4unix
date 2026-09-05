---
sprint: ONDA5-05-01
decisoes: [05-Q1, 05-Q2, 05-Q5]
posse:
  A05D:
    - src/hefesto_dualsense4unix/interface/aba05.py
    - mockup/05-vibracao.html
    - tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py
depois_de:
  - ONDA2-05-VIBRACAO-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
  - src/hefesto_dualsense4unix/interface/paginas/05-vibracao.html
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/onde.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/telas/vibracao.py
  - docs/data/paridade-gtk-html.csv
depois_de: [MIGRA-VIBRACAO-03, MIGRA-VIBRACAO-08, ONDA2-05-VIBRACAO-01, ONDA5-05-03]
---

# ONDA5-05-01 · DESENHO — a nota do Testar volta para a dica

> **A palavra dela, 05/09/2026, na pergunta 05-Q2** (*"as duas frases que
> explicam a vibração continuam escondidas no `?`, ou sobem para a tela?"*):
>
> **"As duas na dica."**

Ela leu as quatro opções — as duas na dica, só a nota do Testar, a do Automático
quando valer, as duas na tela — e escolheu a **primeira**. Hoje o produto faz a
**segunda**.

**A segunda não era decisão dela.** Ela está escrita no código como *"decisão
[02] dela, 04/09/2026"* em quatro lugares (`aba05.py:928`, `:1728`, `:2045`, e a
régua em `tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py:543`), e a fonte
real é a
[ONDA2-05-VIBRACAO-01](2026-09-04-ONDA2-05-VIBRACAO-01-a-linha-de-estado-por-coluna-e-a-linha-de-mesa.md),
que decidiu no lugar dela a partir de
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md).
**Hoje ela respondeu a pergunta. A palavra dela vence a atribuição.**

O trabalho é de **um arquivo de desenho**, mais a régua que hoje tranca a versão
antiga.

---

## 0. AS OUTRAS DUAS DECISÕES DESTA SPRINT JÁ ESTÃO FEITAS

### 05-Q1 — *"As três abas de uma vez"* — **FEITO, e são as DEZ**

Ela mandou publicar. Medido nesta árvore em 05/09/2026, comparando byte a byte
`mockup/NN-*.html` com `src/hefesto_dualsense4unix/interface/paginas/NN-*.html`:
**as dez páginas são idênticas.** Não há aba atrás, não há as três esperando.

E o que a pergunta prometia está na página publicada:

| o que ela leu na opção | onde está, medido |
| --- | --- |
| a barra arrasta de 0 a 200% | `paginas/05-vibracao.html:2220` — `type="range" min="0" max="200" step="10" data-papel="intensidade"` |
| o teto deixa de dizer 150% | `aba05.py:220` — `TETO = round(RUMBLE_CUSTOM_MULT_MAX * 100)`, e o `150` digitado morreu com a nota de substituição em `:208-219` |
| o clique para de mandar clicar num botão | `a05_vibracao.py:1351-1396` — o gesto `intensidade` grava; o `ValueError` que não chegava à tela caiu em 03/09 (`:1354-1357`) |

**Nada a fazer.** O §1 desta sprint muda a bancada, então a publicação volta a
acontecer depois — e é **ato dela**, pelo `scripts/check_o_desenho_aprovado.py`
(`src/hefesto_dualsense4unix/interface/onde.py:13-15,28-29`).

### 05-Q5 — *"Fica como está"* — **FEITO, e ela já tinha decidido isso hoje**

Ela recusou a linha de mesa, o degrau vazado e o aviso de discordância. O
produto **já está** em "como está", e chegou lá pela palavra dela no mesmo dia:

> *"não é pra ter mesa em nada da interface (…) segue os três modos sempre.
> clicou em perfil de energia econômico na aba sistema todos vão pra vibração
> manual. o resto é desnecessário e só polui e deixa difícil entender"*
> <!-- noqa-acento: citação literal dela -->
> — registrada em `a05_vibracao.py:91-97`

O que isso deixou medido, e é o estado de agora:

* a linha de mesa saiu inteira — `a05_vibracao.py:768-773` (`"mesa": {}`) e
  `PISO_DA_ABA = 5` com a queda declarada em `:1593-1604`;
* os degraus são **três** — `aba05.FORCA` (`aba05.py:195-197`), e o `Auto` saiu
  da tela;
* a coluna herdada acende o degrau do global, e a razão está em
  `aba05.py:337-344`.

**E a segunda metade do que a opção previa já não é verdade.** A opção dizia
*"você continua sem descobrir por que uma escolha por controle não mudou nada"*.
Descobre, em dois tempos, desde 04/09: no clique (`FRASE_DA_MESA_EM_AUTO`,
`a05_vibracao.py:1023-1030`) e no tempo, enquanto a condição existir
(`_ressalva_da_mesa`, `a05_vibracao.py:250-307`).

**Nada a fazer.** Fica escrito para a próxima pessoa não reabrir.

---

## 1. O QUE SE MEDIU NA 05-Q2 — uma frase obedece, a outra não existe

São **duas** frases na pergunta, e elas estão em estados diferentes:

| a frase | onde está hoje | obedece "as duas na dica"? |
| --- | --- | --- |
| o teto do orçamento (`DICA_DO_TETO_DA_MESA`, `aba05.py:296`) | no `?` do rótulo "Força da vibração" — `aba05.py:1695` | **sim** |
| os valores que passam (`DICA_DOS_VALORES_QUE_PASSAM`, `aba05.py:305`) | linha permanente na tela — `<div class="vib-nota">`, `aba05.py:1731`, com CSS próprio em `:939-940` | **não** |

**E a explicação do Automático, que a opção dela cita, não tem mais objeto.** Os
5 segundos do `Auto` saíram desta aba em 05/09 junto com o botão que eles
explicavam, e há régua guardando o buraco:
`tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py:561-563` reprova se
`"Espera 5 segundos"` voltar ao desenho. Metade da pergunta dela já está
respondida pelo produto; a outra metade é esta sprint.

**O custo que a decisão dela aceita, e é o texto da opção:** quem testar em
Economia com as barras em 220 não descobre na tela por que o tremor saiu fraco —
descobre passando o mouse no `?`. Ela leu isso na opção e escolheu assim mesmo.

---

## 2. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — a frase volta para dentro do `?` do "Testar agora"

`aba05.py:1717-1725`. O `?` do rótulo "Testar agora" já tem as duas orações do
par (*"Testar faz aquele controle tremer meio segundo…"*), e no lugar do
comentário que hoje explica a saída dela entra a frase, lida do glade como
sempre — **`DICA_DOS_VALORES_QUE_PASSAM`, nunca redigitada** (`aba05.py:271-289`
diz por quê, e o `_do_glade` recusa quando a âncora some).

Some, no mesmo passo: o `<div class="vib-nota">` (`aba05.py:1731`) e o bloco de
CSS que só ele usa (`aba05.py:927-940` — o comentário e a regra).

**A MORDIDA:** deixe o `<div class="vib-nota">` de pé junto com a frase no `?` e
a segunda régua do Passo 2 reprova, dizendo que a frase aparece duas vezes na
mesma tela. Tire a frase do `?` e a régua 10 do gerador (`aba05.py:1916-1918`)
reprova: *"a dica perdeu a frase da janela estável"*.

### Passo 2 — a régua 16 do gerador inverte METADE de si mesma

`aba05.py:2045-2051`. São dois `exigir()`, e **um cai e o outro fica**:

* `f'class="vib-nota">{DICA_DOS_VALORES_QUE_PASSAM}' in corpo` (`:2047`) —
  **cai**, e no lugar entra o exigir que a frase está **dentro do `?` do
  "Testar agora"**;
* `corpo.count(DICA_DOS_VALORES_QUE_PASSAM) == 1` (`:2050`) — **fica exatamente
  como está.** Ele é a metade que não tem lado: proíbe a frase de existir em
  dois lugares, seja qual for o lugar escolhido. Era ele que impedia o `?` e a
  linha ao mesmo tempo em 04/09, e é ele que impede o inverso agora.

**A MORDIDA:** escreva a frase no `?` **e** deixe o `<div>`, e o `:2050` reprova
com a régua nova verde — que é a prova de que ele mede coisa diferente do outro.

### Passo 3 — a régua da suíte é RELIDA, não substituída em massa

`tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py:542-564`,
`test_a_nota_do_testar_e_linha_de_tela`. Ela tem três asserções e **duas
sobrevivem**:

| asserção | linha | depois da 05-Q2 |
| --- | --- | --- |
| `f'class="vib-nota">…' in bancada` | `:554` | **cai** — vira "está no `?` do Testar agora" |
| `bancada.count(…) == 1` | `:556` | **continua**, sem uma letra mudada |
| `"Espera 5 segundos" not in bancada` | `:561` | **continua** — é o `Auto` que saiu em 05/09, outro assunto |

O nome do teste e o docstring mudam junto: hoje os dois argumentam pela linha de
tela. **Não faça substituição em massa neste arquivo** — a lição das dezoito
réguas de 05/09 é que cada uma tem de ser lida, e duas foram devolvidas por
edição cega (`docs/process/2026-09-05-ONDE-PARAMOS-a-onda-tres-e-as-reguas-que-mediam-o-mundo-de-ontem.md`).

**A MORDIDA:** com o Passo 1 desfeito (a linha de volta na tela), o teste
reescrito reprova; com o Passo 1 feito, passa. Cole os dois estados.

### Passo 4 — a razão de 04/09 fica, com a data e as duas metades

Não apague o parágrafo de `aba05.py:927-938` nem o de `:1728-1730`: **decisão
medida não se apaga, ganha nota datada.** Mas ele guarda duas afirmações, e só
uma caducou:

* **"a frase é lida do glade e nunca redigitada"** — vale, e vale para sempre.
  Foi ela que evitou a segunda cópia do texto (`aba05.py:271-282`, com o caso do
  botão "Devolver ao jogo" que não existia);
* **"ela sobe para a tela"** — caducou em 05/09/2026, decisão dela em 05-Q2, e a
  atribuição a ela em 04/09 era do PO, não dela.

---

## 3. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois:

* **As duas frases continuam LIDAS do `src/hefesto_dualsense4unix/gui/main.glade`**
  — `DICA_DO_TETO_DA_MESA` (`aba05.py:296-299`) e `DICA_DOS_VALORES_QUE_PASSAM`
  (`aba05.py:305-308`), pelo `_do_glade` que recusa quando a âncora some
  (`aba05.py:276-289`). A régua 10 do gerador (`aba05.py:1916-1918`) exige as
  duas no corpo, e ela **não muda**: o `?` também é corpo.
* **O `?` do "Força da vibração" fica intacto** (`aba05.py:1691-1697`), com os
  três degraus e o teto da mesa.
* **A faixa `#vib-estado` fica intacta** (`aba05.py:1747`), com as regras de
  tom em `:908-918` e o exigir que a defende em `:1891`. Ela é outra coisa: o
  que a MESA está fazendo, não o que um campo explica.
* **A grade continua com sete faixas** — `test_a_grade_da_vibracao_tem_sete_faixas`
  (`tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py:383`) e o exigir de
  `aba05.py:1902-1905`. Tirar a `.vib-nota` mexe **fora** da `.vib`, e nenhuma
  altura de linha muda.
* **A publicação continua sendo ato dela.** O gerador escreve na BANCADA
  (`onde.py:66,96,99-109`); `mockup/05-vibracao.html` é o que ela olha, e
  `src/hefesto_dualsense4unix/interface/paginas/05-vibracao.html` só recebe pelo
  `--aprovar` de `scripts/check_o_desenho_aprovado.py`. **Esta sprint não
  publica.**

---

## A PROVA DE TELA

`PROVA-DE-TELA-01`, e ela é obrigatória aqui porque isto é texto que ela lê:

1. **A FOTO** — antes e depois do quadro inteiro, com a linha cinza embaixo da
   grade e sem ela;
2. **O CLIQUE** — o `?` do "Testar agora" aberto, com a frase dentro. Uma dica
   que você acrescentou e nunca abriu não está entregue;
3. **A MORDIDA** — a do Passo 2, colada nos dois estados.

**A janela não nasce na tela dela.** `--oculta` sempre; ela tem UMA tela. O
caminho inteiro está em [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md).
