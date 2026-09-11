# PRINTS-DAS-DEZ-01 — opus

**Árvore:** `/mnt/Apate/Desenvolvimento/hefesto-voo/PRINTS-DAS-DEZ-01-opus`,
branch `voo/PRINTS-DAS-DEZ-01-opus`, nascida de `onda/0911` (`750123ee`,
conferido contra `git rev-parse --short onda/0911`).

## O que mudou

**1. As dez fotos, na vista maximizada dela** — `docs/usage/assets/maximizada/`,
dez PNG de **1918 x 840** com recibo próprio (`PROVA-DA-FOTO.txt`, que agora
declara a `vista:`). Nenhuma janela na tela dela: Chrome headless, o retratista
de sempre.

**2. O laudo** —
`docs/process/2026-09-11-AS-DEZ-ABAS-MAXIMIZADAS-o-que-a-foto-acusa.md`: a vista
com a conta de onde sai cada parcela, um veredito por aba, sete problemas com
fonte, custo e dono, e o que a foto não prova.

**3. O retratista ganhou a vista** — `interface/olhar.py --vista LARGxALT`
(`dela` resolve para `VISTA_DELA = (1918, 840)`). **Tinha de ganhar:** o `--doc`
recortava na `.janela`, que é `min(100%,1600px)` por `777px` **fixo**, então o
recorte sai o mesmo pixel em toda vista acima de 1632x809 — *fotografar
maximizado não mudava a foto*. Com `--vista` a foto é a vista inteira, que é o
que carrega os vãos dos lados e a faixa morta embaixo.

Junto vieram três medidas que nenhuma régua desta casa tinha: `vista`,
`morto_abaixo` (o que sobra entre a `.janela` e a borda da tela — a cegueira que
a `ALTURA-DA-VISTA-01` §4.3 nomeia) e `vao_dos_lados`. E o `passa_da_dobra`
parou de comparar com um `1080` digitado.

**4. As dez fotos de documentação refeitas** — `docs/usage/assets/aba-*.png`,
que estavam de 08/09 e não mostravam as cinco abas da leva de ontem. Sete das
dez mudaram; 05, 06 e 08 saíram byte a byte idênticas. As duas famílias moram em
pastas separadas de propósito: o `CLAUDE.md` manda todo mundo rodar
`--todas --publicado --doc`, e com o mesmo nome a execução seguinte apagaria a
foto da vista calada.

### Os sete problemas, em uma linha cada

| # | aba | o que é | custo |
| --- | --- | --- | --- |
| 1 | 01, 02 | o lugar vazio não diz `PN • Desconectado` — a 01 não diz nem o número | **alto** |
| 2 | 01, 03, 08 | faixa vazia de 160 · 179 · 181 px (confirma a `VAO-DO-ESQUELETO-01`) | **alto** |
| 3 | as dez | 47 px mortos fora da `.janela` (confirma a `ALTURA-DA-VISTA-01`) | médio |
| 4 | 10 | «3 de 4 controles com ajuste próprio» com 2 na tela | médio |
| 5 | 09 | «Bluetooth: 1 adaptador, **1 controles** no rádio» | médio |
| 6 | 08 | o lugar vazio diz `Player 3` e as outras dizem `P3` | baixo |
| 7 | as dez | a página salta 2 px ao trocar de aba (`.fita.inerte`) | baixo |

**O achado 1 é o que importa, e é a metade que a leva de ontem não cobriu.** A
queixa 9 da lista dela — *"o P2 sai `—` em vez de `P2 • Desconectado`"* — foi  <!-- noqa-acento: citação literal dela -->
curada **na aba 03**. Medido nas dez, o lugar vazio fala quatro línguas:

```
01-jogar        — — —                    ← nem o número
02-controles    P3 • — • —
03,04,05,06,10  P3 • Desconectado        [OK]
08-conexões     Player 3 • Desconectado
```

E a regra está escrita na folha das dez, dentro das páginas: *"o rótulo*
*`P3 · Desconectado` … fica"*. A causa é a de sempre: a palavra está digitada em
dois lugares (`aba04.py:1180`, `aba08.py:2213`), cada aba que a escreveu criou a
sua própria régua (`aba04.py:1844`, `aba08.py:4109`), e as duas que não
escreveram não têm régua nenhuma — por isso atravessaram a cura de ontem em
verde.

## Qual mordida prova

**A do `passa_da_dobra`, e ela é a que o instrumento pedia.** Arrancada a cura
(o `window.innerHeight` trocado de volta pelo `1080` digitado), a mesma página na
mesma vista:

```
com a cura       "vista": "1918x500", "passa_da_dobra": 309
CURA ARRANCADA   "vista": "1918x500", "passa_da_dobra": 0      ← passa 309 e diz 0
cura devolvida   "vista": "1918x500", "passa_da_dobra": 309
```

*Uma página que transborda 309 px reportada como cabendo.* É a assinatura desta
casa — o instrumento respondendo sobre o viewport de ontem — e é exatamente o
que teria acontecido se o `--vista` tivesse nascido sem tocar nesta linha.

**A do enquadramento**, que é a razão de o argumento existir:

```
docs/usage/assets/aba-03-gatilhos.png              1600x777   ← o recorte, em QUALQUER vista
docs/usage/assets/maximizada/aba-03-gatilhos.png   1918x840   ← a vista
```

**A do parser, que sabe RECUSAR** — sem ela um `--vista 1918` aceito calado
viraria uma vista inventada:

```
$ olhar.py --todas --publicado --vista 1918
olhar.py: error: argument --vista: vista '1918' não tem a forma LARGURAxALTURA
                 (ex.: 1918x840), nem é a palavra 'dela'
$ olhar.py --todas --publicado --vista grande
olhar.py: error: argument --vista: vista 'grande' não tem a forma LARGURAxALTURA …
```

E os achados 4 e 5 não foram lidos da imagem — foram medidos no gerador, que é o
que os torna afirmação e não impressão:

```
aba10.COM_AJUSTE = 3
  Cosmic Red       conectado=True   guarda=True
  Starlight Blue   conectado=True   guarda=True
  Galactic Purple  conectado=False  guarda=True   ← conta, e a coluna não pinta
  White            conectado=False  guarda=False

aba09.py:1029  f"Bluetooth: 1 adaptador, {len(BT)} controles no rádio"
```

## O que NÃO verifiquei

- **A largura de 1918 é DERIVADA, não lida.** A altura de 840 é medida pixel a
  pixel na foto dela (`ALTURA-DA-VISTA-01` §1); a largura vem de subtrair a
  mesma borda de 1 px que aquela tabela mostra em cima e embaixo, porque o
  painel e a doca do COSMIC não têm zona exclusiva lateral. Não abri a janela
  dela para conferir — ela está usando a máquina.
- **Nada disto passou pelo `WebKit2.WebView`.** São as páginas de
  `interface/paginas/` num Chrome headless. O piloto não foi aberto, o daemon
  não foi consultado, nenhum aparelho foi tocado (`bancada: false`, e não pedi a
  bancada).
- **O achado 5 da aba 07** (o «Localizar este Lançador» ausente nos seis cartões
  no selo `NÃO SEI`) foi medido só na página publicada. **Não sei se o piloto o
  pinta ao rodar o censo** — e é por isso que ele está com custo baixo, e não com
  o custo que teria se eu tivesse afirmado que o botão não existe.
- **Não olhei o que abre por clique**: os acordeões fechados da 08, os cartões
  abertos da 02, as telas de `:target`. O achado 6 (`Player 3`) foi lido no DOM
  dentro de um acordeão fechado, e não está na imagem — está dito no laudo.
- **Não conferi se as sete mudanças de `aba-*.png` são de pixel ou de render.**
  O portão das fotos é de procedência, e o recibo carrega a data.

## O que sobrou para o próximo

1. **Uma sprint para o achado 1**, e ela não é de uma aba: a palavra
   «Desconectado» precisa de **um dono** (`monta.py`, como `SEM_NINGUEM_AQUI`
   hoje mora na `aba04`), e as quatro que a escrevem passam a lê-la. Curar só a
   01 repete o de ontem. `aba01.py` e `aba02.py` estão no meu `nao_toca`.
2. **Os achados 4 e 5** — `aba10.py:1276` (a conta soma lugar desconectado que a
   coluna não pinta: ou a conta desconta, ou a coluna diz) e `aba09.py:1029` (o
   `1 adaptador` digitado, e o plural sem singular). Nenhum dos dois está entre
   as 102 acusações de pé do `AS-FRASES-QUE-MENTEM`.
3. **O achado 7** cabe de graça na `VAO-DO-ESQUELETO-01`: é a mesma linha de
   `topo.html`, e a fita inerte pode ganhar borda transparente de 2 px em vez de
   1 px opaca.
4. **A `VAO-DO-ESQUELETO-01` pode citar esta medição**: as mesmas três páginas,
   na mesma ordem, medidas na vista real dela — e os 47 px de fora, que a §2
   daquela não contava.
5. **`docs/usage/assets/maximizada/` não tem quem a refaça sozinha.** Quem
   quiser a foto da vista atualizada roda
   `interface/olhar.py --todas --publicado --doc --vista dela`. Se essa foto
   virar rotina, ela merece entrar no `COMO-OLHAR-A-TELA.md` ao lado da regra em
   uma linha — deixei fora porque rotina é decisão de quem coordena.

---

## O reparo de 11/09

O conferente devolveu por CINCO coisas. As cinco fecharam; o que segue é achado
por achado, com o que foi medido.

### 1 · ALTA — o laudo afirmava o que a foto não mostra

**Ele estava certo, e eu medi de novo.** A §2 listava «o selo na 07» entre as
curas que «as fotos mostram». Na página publicada:

```
class="lanc-selo nao_sei"        6     os seis cartões
class="lanc-selo localizado"     1     e está DENTRO de um comentário CSS (07-lancadores.html:956)
.lanc-selo.ok,.lanc-selo.localizado{background:var(--green)}   presente, linha 969
```

E a foto, aberta e lida: seis pílulas cinza `NÃO SEI` e o cabeçalho «0
localizados · 0 com impedimentos».

**O diagnóstico é (a), e não (b): a cura CHEGA — o que não chega é o gatilho
dela.** A regra verde está na página; nenhum elemento da página carrega a
classe `localizado` que a dispara. Quem escreve a classe é o PILOTO, com o
daemon vivo — `desenho_dos_lancadores.valores_do_cartao` emite `{chave}-selo`
com `selo_html(lanc.selo)`, medido aqui:

```
selo_html('localizado') -> '<span class="lanc-selo localizado">LOCALIZADO</span>'
```

e os seis endereços da página são `data-campo="…-selo" data-hef-alvo="html"`,
isto é, pontos que o piloto sobrescreve. Não há achado de produto: há um limite
do instrumento. **A página publicada é o primeiro instante, antes de o censo
responder.**

**O que nasceu disso é a §2.1 do laudo**, que é a informação que faltava ao
documento inteiro:

> A foto estática prova FORMA e prova TEXTO DE PARTIDA. Ela não prova nada que
> o piloto escreva por tique.

E o ponto cego tem tamanho medido: **1.114 endereços `data-campo` nas dez
páginas publicadas** (513 só na 02-controles), todos valores de partida que o
produto vivo pode trocar. A cura do selo saiu da lista das que as fotos
mostram; as outras quatro (02, 03, 04, 10) são de forma e de texto de partida,
e sobrevivem. A §3.5 deixou de contradizer a §2: ela agora aponta para a §2.1.

### 2 · MÉDIA — a pasta nova abria buraco em dois portões que já existiam

Fechado nos dois, e a cura é a mesma: **cada família de foto responde por si.**

| | antes | agora |
| --- | --- | --- |
| `scripts/check_fotos_da_tela.py` | `any(_toca(c, (FOTOS,)))` — a foto da vista quitava a dívida das dez do README | `familias_sem_prova()`, e o bloqueio NOMEIA a pasta devedora |
| `test_as_fotos_acompanham_a_versao.py` | `git log -- docs/usage/assets` respondia com o commit da subpasta | `_pathspec()` com `:(exclude)`, `uma_familia_em_dia()` por pasta |

O alcance é das TRÊS perguntas, não só da primeira: a topologia, o perdão de
`fotos_sendo_refeitas_agora` (perdoar em bloco repetia o mesmo defeito) e a
mensagem, que agora traz **um comando por família** — sem isso quem apanhasse
pela vista rodaria o comando do README, veria nada mudar, e concluiria que o
portão quebrou.

**As duas mordidas, aplicadas:**

```
_pathspec -> [familia]                  test_a_foto_da_vista_nao_paga_a_divida_das_dez_do_readme
                                        FAILED: assert True is False
familias_sem_prova -> any(_toca(...))   test_a_foto_da_vista_nao_paga_...  (o gancho)
                                        FAILED: - bloqueado / + em-dia
```

E `test_as_duas_listas_de_codigo_de_tela_sao_a_mesma` passou a trancar também
`FAMILIAS_DE_FOTO`: uma terceira pasta criada num lado só recria o buraco um
nível acima.

### 3 · MÉDIA — nada do que nasceu tinha régua

`tests/unit/test_o_retratista_fotografa_a_vista_pedida.py`, **22 casos**, e as
mordidas saíram do texto da entrega para dentro dele. Cobre `--vista`,
`_vista_pedida`, `VISTA_DELA`, `SUBPASTA_DA_VISTA`, `destino_das_fotos`,
`morto_abaixo`, `vao_dos_lados`, `passa_da_dobra` e a linha `vista:` do recibo.

Duas coisas mudaram no `olhar.py` para que houvesse o que medir:

* o JavaScript da medida saiu de dentro do `_retratar` e virou
  `olhar.MEDIDA_NA_VISTA` — enquanto era literal enfiada numa função, a única
  porta era abrir o Chrome pelo `main`;
* a escolha da pasta virou `destino_das_fotos(para_a_doc, vista)`, e a
  desigualdade `destino_das_fotos(True, VISTA_DELA) != destino_das_fotos(True,
  None)` é o contrato das duas famílias em uma linha.

**AS QUATRO MORDIDAS, aplicadas uma a uma e todas reprovando:**

| o que se arranca | quem reprova |
| --- | --- |
| `window.innerHeight` → `1080` no `passa_da_dobra` | `test_a_dobra_pergunta_a_vista_em_que_esta` |
| o `Math.max(0, …)` do `morto_abaixo` | `test_nenhuma_medida_de_sobra_sai_negativa` |
| `destino_das_fotos` devolvendo sempre `DESTINO_DOC` | `test_a_foto_da_vista_nao_cai_por_cima_da_do_readme` |
| `_vista_pedida` aceitando `1918` | `test_o_parser_recusa_o_que_nao_e_vista[1918]` e `[1918x]` |

E a conta da vista ficou ESCRITA, em dois casos que se sustentam um ao outro:
`test_a_vista_dela_fecha_a_conta_das_parcelas` congela a aritmética, e
`test_as_dez_fotos_da_vista_nasceram_na_vista_dela` cobra que **o recibo de
`maximizada/` declare a mesma vista** — sem o segundo, trocar a constante e a
conta junto passaria, e as dez imagens ficariam no disco afirmando uma tela que
ninguém mais tira.

**E AQUI UM PORTÃO ME CORRIGIU, o que é o sistema funcionando.** A primeira
volta desta régua lia `ALTURA_DA_BARRA` do fonte de `gui/ponte_da_tela.py` por
`ast` — a parcela da barra tem dono vivo, e ler de lá seria não redigitar o
número. **`nada-aponta-para-a-janela` reprovou**, nomeando arquivo e linha:

```
tests/unit/test_o_retratista_fotografa_a_vista_pedida.py:19;148:
  CITAÇÃO NOVA para a janela (gui.ponte_da_tela)
```

Há precedente declarado no CSV (`test_o_aviso_da_vibracao_cabe_na_aba.py:82`,
`MOTOR-MUDA-DE-CASA`), e eu poderia ter declarado a minha. **Não declarei**: o
inventário daquela pasta **só diminui** por decisão dela
(`D-0609-GTK-LEVA-INTEIRA`, *"não apontar nada mais pra lá"*), e uma citação a
mais é mais uma coisa a reapontar quando o motor mudar de casa. Declarar para
calar um portão é o contrário do que ele existe para fazer. A régua perdeu essa
ponta e a declara no próprio docstring; quem a segura no lugar é o recibo das
dez.

### 4 · MÉDIA — o documento que ela lê não mostrava uma foto

As dez estão embutidas no laudo, **cada uma sob o veredito daquela aba**
(`![…](../usage/assets/maximizada/aba-NN-*.png)`, os dez caminhos conferidos).
A tabela de dez linhas saiu e no lugar dela ficou um placar de uma linha —
repetir o veredito ao lado da imagem seria escrever a mesma frase duas vezes.

### 5 · BAIXA — `morto_abaixo` sem piso

`Math.max(0, …)` nas duas medidas de sobra. O `vao_dos_lados` ganhou junto,
pela mesma razão e porque a cura conhece a causa: **um número negativo num
campo cujo nome promete sobra é afirmação falsa com cara de medida.** O que
falta já tem instrumento próprio — o `passa_da_dobra` na altura, o
`rolagem_lateral` na largura.

```
1918x500, medido:   ANTES  "morto_abaixo": -293   ->  "−293 px mortos embaixo"
                    AGORA  "morto_abaixo": 0      ->  a linha nem sai
```

### As vinte fotos, refeitas

O `olhar.py` é `CODIGO_DA_TELA`, e mexer nele torna as vinte suspeitas — pelo
portão que este mesmo reparo apertou. As duas famílias foram refeitas:

```
--todas --publicado --doc               10 abas  ->  docs/usage/assets/
--todas --publicado --doc --vista dela  10 abas  ->  docs/usage/assets/maximizada/
```

**As vinte saíram byte a byte idênticas** — só os dois recibos mudaram, com a
data de hoje. É a confirmação de que o piso do `morto_abaixo` não move pixel:
ele conserta o que o instrumento DIZ, não o que a página desenha.

### O que este reparo NÃO fez

- **Continua sem piloto vivo.** A §2.1 nomeia o que isso custa e mede o
  tamanho (as 1.114), mas quem responde pelas 1.114 é o `WebKit2.WebView` com o
  daemon, e esta sprint segue `bancada: false`.
- **A rotina da foto da vista continua não estando no `COMO-OLHAR-A-TELA.md`.**
  O que mudou é que o comando agora vive na mensagem dos dois portões, que é
  onde quem apanha o lê. Pôr a rotina no documento continua sendo decisão de
  quem coordena.
