# PARIDADE-REMEDIR-02 — nove linhas voltaram ao CSV, e SEIS fecharam só na bancada

**06/09/2026 · agente `opus` · árvore
`hefesto-voo/hefesto-voo/PARIDADE-REMEDIR-02-opus` · branch
`voo/PARIDADE-REMEDIR-02-opus`, nascida de `onda/atual-0609` (`52b81893`,
conferido contra `git rev-parse --short onda/atual-0609` antes da primeira
linha).**

Posse tocada: as DUAS declaradas — `docs/data/paridade-gtk-html.csv` e a tabela
publicada em `docs/process/2026-09-03-O-TERCEIRO-NUMERO-…md` — mais o `estado:`
da própria sprint. **Zero linha de `src/`, `tests/`, `scripts/`, `mockup/` ou
`docs/data/mapa-controles.csv`**, e o `git diff --stat` prova: dois arquivos, 19
linhas.

Bancada: **não reservada, e não precisou** — nenhum caminho parou o daemon,
chamou `systemctl` ou escreveu no aparelho. Tela: **nenhuma janela aberta**, nem
oculta. Esta sprint lê fonte e escreve um CSV.

---

## O que mudou

**As 32 linhas `FALTA_NO_HTML` foram relidas contra o fonte de hoje: NOVE
mudaram de veredito com o endereço aberto no código, SEIS ficaram `FALTA` com a
segunda metade `||` datada dizendo o que fechou e o que falta, e o número foi de
`145 · 156 · 32 · 37 %` para `146 · 164 · 23 · 37 %`.** As nove foram MORDIDAS
duas vezes cada — pelo `sinal` e pela CURA NO CÓDIGO —, e as duas voltas
morderam 9/9.

```
ANTES   396 feats · 145 IGUAL · 156 DIFERENTE · 32 FALTA · 59 SO_HTML · 4 ? · 37%
DEPOIS  396 feats · 146 IGUAL · 164 DIFERENTE · 23 FALTA · 59 SO_HTML · 4 ? · 37%
```

| aba | FALTA antes | FALTA depois |
| --- | ---: | ---: |
| 01-jogar | 7 | **1** |
| 05-vibracao | 5 | **3** |
| 09-sistema | 3 | **2** |
| as outras sete | 17 | 17 |
| **TODAS** | **32** | **23** |

**A `01-jogar` foi de sete para UMA**, e a que sobra é a linha 9 (o custo da
máscara Xbox), que a `24 HORAS` deixa fora de propósito.

### As NOVE que mudaram, uma a uma, com o endereço lido nesta árvore

Ordem do CSV. Todo endereço abaixo foi **aberto e lido** aqui em 06/09/2026;
nenhum veio de laudo sem conferência — e três laudos foram CORRIGIDOS por essa
leitura (a §"o que caiu").

| linha | feature | veredito | o `sinal`, e onde ele está |
| --- | --- | --- | --- |
| **12** `[01]` | o "Controlar o PC" que não controla | `FALTA` → **`DIFERENTE`** | `painel.avisos_do_estado(ctx.state)` · `a01_jogar.py:875` |
| **17** `[01]` | o grab dobrado | `FALTA` → **`DIFERENTE`** | idem |
| **25** `[01]` | o recibo do "Reconectar" | `FALTA` → **`IGUAL`** | `recibo_do_reconectar` · `a01_jogar.py:2414` |
| **26** `[01]` | a dica do "Reconectar" com jogo aberto | `FALTA` → **`DIFERENTE`** | `painel.avisos_do_estado(ctx.state)` · `a01_jogar.py:875` |
| **28** `[01]` | a divergência de máscara | `FALTA` → **`DIFERENTE`** | `_aviso_da_divergencia_de_mascara(ctx.state)` · `a01_jogar.py:903` |
| **35** `[01]` | a linha de origem do modo | `FALTA` → **`DIFERENTE`** | `painel.avisos_do_estado(ctx.state)` · `a01_jogar.py:875` |
| **177** `[05]` | devolver a vibração ao jogo | `FALTA` → **`DIFERENTE`** | `rumble_passthrough` · `a05_vibracao.py:1826` (o `parar`) |
| **182** `[05]` | zerar weak/strong no rascunho | `FALTA` → **`DIFERENTE`** | `_draft_do_ativo` · `rodape.py:91` |
| **323** `[09]` | o recibo do gesto | `FALTA` → **`DIFERENTE`** | `classList.add('hef-deu-certo')` · `hefesto_vivo.py:1064` |

**UMA SÓ FICOU `IGUAL`, e o critério é o da linha 338:** no recibo do
"Reconectar" os quatro desfechos nomeados da janela chegam à tela e **a
diferença é só o CANAL** (barra de estado lá, recado no cartão aqui). Nas outras
oito a resposta chega por outro lugar ou de outro tamanho, que é o que
`DIFERENTE` quer dizer.

### As SEIS que ficaram `FALTA` — e as seis têm a MESMA causa

**O mecanismo fechou; a OFERTA não chegou à tela publicada.** Medido arquivo a
arquivo nesta árvore, contando ocorrências:

| linha | o que já existe, e onde | bancada | publicado |
| --- | --- | ---: | ---: |
| **45** `[02]` | `card-vpad` ← `controller_card.dica_do_titulo` (`a02_controles.py:2676`) | 2 | **0** |
| **57** `[02]` | `som-sem-endereco`, a guarda visível (`a02_controles.py:2663`) | 4 | **0** |
| **89** `[02]` | `alto-selo` ← `saida_muda_do_entry` (`a02_controles.py:2680`) | 2 | **0** |
| **90** `[02]` | `alto-canal` ← `audio_saida.estado_do_canal` (`a02_controles.py:2682`) | 2 | **0** |
| **110** `[03]` | o gesto `em_todos`, completo (`a03_gatilhos.py:3232`) | 3 | **0** |
| **340** `[09]` | o gesto `aplicar-aos-jogos` (`a09_sistema.py:2533`) | 1 | **0** |

**A régua desta casa mede o que chega à TELA DELA, e `--publicar NN` é ato
dela.** É a regra que a `PARIDADE-REMEDIR-01` firmou —*"se a resposta não chega
à tela, é `FALTA`, mesmo quando a ausência é escolha dela"*
(`D-0609-ADIAMENTO-NAO-E-REMOCAO`)— e é o mesmo critério com que ela promoveu a
linha 82 citando `paginas/02-controles.html:2157`, o PUBLICADO. Promover as seis
pelo `mockup/` daria seis verdes sobre botão que ela não tem na mão. **As seis
são um `--publicar` de distância**, e o `porque` de cada uma diz qual.

---

## Qual mordida prova

### 1. O `sinal` arrancado — 9 de 9

Troquei o `sinal` de cada linha promovida por um que não existe em lugar nenhum
da árvore e rodei a régua:

```
    12  'painel.avisos_do_estado(ctx.state)'      arrancado -> rc=1  REPROVOU nomeando
    17  idem                                      arrancado -> rc=1  REPROVOU nomeando
    25  'recibo_do_reconectar'                    arrancado -> rc=1  REPROVOU nomeando
    26  idem 12                                   arrancado -> rc=1  REPROVOU nomeando
    28  '_aviso_da_divergencia_de_mascara(…)'     arrancado -> rc=1  REPROVOU nomeando
    35  idem 12                                   arrancado -> rc=1  REPROVOU nomeando
   177  'rumble_passthrough'                      arrancado -> rc=1  REPROVOU nomeando
   182  '_draft_do_ativo'                         arrancado -> rc=1  REPROVOU nomeando
   323  "classList.add('hef-deu-certo')"          arrancado -> rc=1  REPROVOU nomeando

devolvido -> rc=0 · mordidas que morderam: 9/9
```

### 2. A CURA NO CÓDIGO arrancada — 9 de 9, e é esta que vale

A primeira mordida só prova que a régua lê o CSV. **A segunda arranca a CURA** —
a linha do produto, não a régua — e vê o portão reprovar a linha certa:

```
  a porta da coluna Atenção (12·17·26·35)
     cura arrancada -> rc=1 · sinal-sumiu nomeou [12, 17, 26, 35]
  o recibo do «Reconectar» (25)          -> rc=1 · nomeou [25]
  a divergência de máscara (28)          -> rc=1 · nomeou [28]
  o passthrough do «Parar» (177)         -> rc=1 · nomeou [177]
  o draft que nasce do disco (182)       -> rc=1 · nomeou [182]
  a piscada verde do pouso (323)         -> rc=1 · nomeou [323]

com TUDO devolvido -> rc=0 · linhas que morderam: 9/9
```

Cada arrancada foi desfeita **byte a byte, com md5 conferido no script** — `src/`
é `nao_toca:` e o commit sai com zero linha de lá.

**E ESTA MORDIDA DERRUBOU TRÊS SINAIS MEUS, na primeira volta.** Com os sinais
que os laudos propunham — `painel.avisos_do_estado`, `_aviso_da_divergencia_de_mascara`
e `hef-deu-certo`, os três SEM os argumentos — a cura arrancada deixou o portão
**VERDE**: o `ocorre` do lado `PRESENTE` aceita PROSA de propósito
(*"`PRESENTE` pergunta 'isto ainda está aqui?' e uma citação basta"*), e os três
símbolos aparecem em docstring no mesmo arquivo. **Três linhas que só saberiam
passar.** Trocados pela CHAMADA (`…(ctx.state)`, `classList.add(…)`), que existe
uma vez e é código — e aí morderam. *A régua que eu escolhi para a linha 12 não
media a linha 12; media o comentário sobre ela.*

### 3. As SEIS que ficaram `FALTA` continuam mordendo quando a dívida fechar

Escrevi o `sinal` de cada uma no lado HTML e a régua acusou:

```
  linha 340 · '_build_steam_apply_confirm_dialog' -> rc=1  REPROVOU por divida-fechada
  linha  45 · 'vpad_uniq'                         -> rc=1  REPROVOU por divida-fechada
  linha 110 · 'TriggerDraft'                      -> rc=1  REPROVOU por divida-fechada
```

### 4. A tabela publicada não pode voltar ao número de ontem

```
  numero-publicado: …-O-TERCEIRO-NUMERO-….md, linha 'TODAS':
    publicado: (396, 145, 156, 32, 59, 4, 37)
    no CSV:    (396, 146, 164, 23, 59, 4, 37)
```

O CSV e o documento voltaram byte a byte antes de seguir. Os scripts estão no
scratchpad (`10-remedir.py`, `50-mordida.txt`, `51-mordida-no-codigo.txt`,
`52-mordida-bc.txt`).

---

## O que NÃO verifiquei

* **A tela.** Nenhuma janela foi aberta, nem `--oculta`. O que afirmo sobre a
  página publicada foi medido **lendo o HTML no disco** (contagem de
  `data-campo`/`data-gesto` em `interface/paginas/*.html` contra `mockup/*.html`),
  não clicando. **A prova de tela das nove linhas é dos laudos que as fecharam**,
  não desta sprint.
* **Se as features FUNCIONAM.** É o que a régua declara não medir, e vale para
  as nove: um botão que existe nos dois lados e está quebrado nos dois passa
  aqui sorrindo. Quem morde isso é a ponte JS do piloto.
* **A suíte inteira.** É de quem coordena e roda no fim. Rodei os portões.
* **A bancada.** Não reservada e não precisou; nenhuma célula do mapa foi
  exercitada por esta sprint — ela não toca aparelho.
* **A linha 323 com o `atualizar` de 9,5 s na mão.** A piscada verde foi lida no
  código e medida no WebKit pela `SISTEMA-OS-QUATRO-QUE-FALTAM-01`; eu não a vi.

---

## O que sobrou para o próximo

### 1. A cura da régua, e ela é de UMA LINHA em `scripts/` — que é `nao_toca:` aqui

`check_paridade_gtk_html.SO_HTML` conta
`src/hefesto_dualsense4unix/app/actions/jogar/` como **lado GTK**, e é lá que
moram quatro das seis curas da `JOGAR-OS-SEIS-AVISOS-01`. Enquanto não incluir
aquela pasta, **a régua não enxerga uma dívida fechada por
`painel.AVISOS_DA_TELA`** — que é justamente o caminho que as sprints mandam
usar. O laudo da JOGAR nomeou isso e atribuiu a cura a esta sprint; **o
frontmatter daqui põe `scripts/` no `nao_toca:`, e frontmatter vence laudo
alheio**, então eu não a fiz.

**O que fiz no lugar, e o preço:** as quatro linhas apontam para a PORTA
(`painel.avisos_do_estado(ctx.state)`, a chamada única em
`interface/pacotes/a01_jogar.py:875`), não para o aviso de cada uma. **Quem
tirar UM aviso da tupla passa por esta régua** — está escrito no `porque` da
linha 17. É o mesmo desenho que a `PARIDADE-REMEDIR-01` já dera à linha 11, a
irmã destas quatro; a diferença é que agora o buraco está declarado na célula.

### 2. As SEIS que esperam o `--publicar`, e é palavra dela

`--publicar 02` (linhas 45, 57, 89, 90) · `--publicar 03` (110) ·
`--publicar 09` (340). Quem publicar volta a estas seis linhas: o `sinal` de
cada uma passa a ser o endereço de tela que a bancada já tem, e o veredito muda
no mesmo commit. **Não são dívida de código; são dívida de OK.**

### 3. Três laudos entregaram texto que a régua desta casa recusa

Nomeados aqui para não voltarem em outra sprint:

| laudo | o que propôs | por que caiu |
| --- | --- | --- |
| `GATILHOS-EM-TODOS-01` | veredito **`TEM_NO_HTML`** para a 110 | não existe no domínio — os cinco são `IGUAL`, `DIFERENTE`, `SO_NO_HTML`, `NAO_DA_PARA_SABER`, `FALTA_NO_HTML` |
| `VIBRACAO-O-QUE-SOBROU-01` | veredito **`IGUAL_POR_OUTRO_CAMINHO`** para a 182 | idem; virou `DIFERENTE` |
| `VIBRACAO-O-QUE-SOBROU-01` | `sinal` **`COMO_DEVOLVER_AO_JOGO`** (177) | mora em `app/actions/rumble_actions.py`, que é lado GTK — daria `sinal-sumiu` |
| `VIBRACAO-O-QUE-SOBROU-01` | `sinal` `test_o_aplicar_do_rodape_…` (182) | é um TESTE, e `tests/` não é o lado HTML para esta régua — a mesma recusa que a linha 56 recebeu |
| `VIBRACAO-O-QUE-SOBROU-01` | `html_onde` com `app/actions/rumble_actions.py:136` (177) | endereço do lado GTK na coluna do HTML: `lado-trocado` |
| `SISTEMA-OS-QUATRO-QUE-FALTAM-01` | 340 → `IGUAL` | o gesto existe; **o botão não está publicado** |
| `CONTROLES-OS-TRES-SELOS-01` | 45, 89, 90 → `IGUAL`; 57 → `DIFERENTE` | idem, nas quatro: os endereços estão só no `mockup/` |
| `JOGAR-OS-SEIS-AVISOS-01` | as seis → `IGUAL` | cinco viraram `DIFERENTE` pelo precedente da linha 11 (mesmo fato, LUGARES diferentes); só a 25 é `IGUAL` |

### 4. O `gtk_onde` de seis linhas estava MORTO por deslizamento, e a régua não vê

As linhas 12, 17, 25, 26, 28 e 35 citavam endereços de `home_actions.py` que
**abrem** e apontam para código de outro assunto (`:1381` é
`DESFECHO_BLOQUEADO`; `:821` é linha em branco). O `endereco-morto` só confere
que o arquivo existe e que a linha cabe nele. Foram medidos de novo e
substituídos — e a `PARIDADE-REMEDIR-01` já tinha nomeado esta família na linha
30. **É a terceira aparição em dois dias; a única defesa é reler.**

### 5. A linha 35 não tem dono do lado GTK, e isso mudou de natureza

Não há função a reusar: a regra vive solta dentro de
`HomeActionsMixin._render_home` (`home_actions.py:2884-2892`). Foi por isso que
`painel.aviso_da_origem_do_modo` teve de NASCER. O `gtk_onde` dela agora diz
isso, para o próximo não procurar o que não existe.

### 6. As 23 que sobram, e onde está cada uma

`01`: 1 (a 9, fora das 24 h por decisão) · `02`: 6 (quatro esperam o
`--publicar`; a 56 é decisão dela de 17/08 e a 73 precisa de um leitor de áudio
no piloto) · `03`: 1 (a 110, espera o `--publicar`) · `05`: 3 (165 e 170 são
decisão dela; a 176 é dívida de verdade) · `08`: 3 · `09`: 2 (a 330 é dívida
decidida por `D-0609-MESA-E-PALAVRA-NAO-FEATURE`; a 340 espera o `--publicar`) ·
`10`: 7. **Doze das 23 não são código a escrever** — são um OK dela ou uma
decisão já registrada.
