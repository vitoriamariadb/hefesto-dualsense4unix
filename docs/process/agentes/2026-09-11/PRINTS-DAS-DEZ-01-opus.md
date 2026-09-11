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
