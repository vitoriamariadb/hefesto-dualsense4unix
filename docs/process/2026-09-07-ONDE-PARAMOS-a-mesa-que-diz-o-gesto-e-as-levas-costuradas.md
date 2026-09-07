# ONDE PARAMOS — a mesa que diz o gesto, e as levas todas costuradas

**07/09/2026, madrugada.** Escrito a pedido dela: *"só documenta onde estamos
agora e prepara o hands off das levas da 24h"*.

---

## 0. O ESTADO, EM UMA LINHA

As 146 branches das levas estão **todas dentro** de `onda/atual-0609`, o mapa
não tem mais **nenhuma célula sem procedência**, e a página da bancada passou a
dizer **o gesto exato de cada um dos 198 testes** — o que faltava para ela
poder validar os quatro DualSense sem perguntar nada a ninguém.

**45 portões verdes · árvore limpa em `d49f0e04` · 19 commits no dia.**

O que falta é o FECHO, e ele é dela: a bancada com os quatro na mão, o merge em
`dev`, e o `install.sh` com a palavra dela. Está na §5.

---

## 1. O DEFEITO QUE ORGANIZOU O DIA, e foi ela quem o achou

Ela abriu a página da bancada na linha 10 — *"Bateria: anota os quatro números
e volta neles aos 20 minutos"* — e escreveu:

> *"sinceramente não entendi o que diabos é pra fazer aqui."*

**Ela estava certa, e a causa era dupla.**

O COMO que ela tinha encomendado — *"escreva o gesto exato que foi aplicado. É
isto que se perdia quando a sessão morria"* — saía assim:

```
linha do roteiro: 10
passa quando: mudaram
```

Isso não é o gesto. É o roteiro repetido. **Um roteiro escrito em telegrama
serve a quem o escreveu e a mais ninguém.**

E a segunda metade é pior: **a resposta estava na tela, dobrada.** Dentro de um
`<details>` FECHADO, sob o rótulo *"a célula que isto fecha, e o COMO que o
arquivo já publica"* — nada ali dizia que o que fazer estava lá dentro.

**A REGRA QUE ISSO DEIXA:** *o que a pessoa precisa para executar não pode
custar um clique.* Uma gaveta é para o que se consulta quando se duvida, nunca
para o que se lê para agir.

E, na mesma tela, um segundo achado do mesmo tipo: o teste de vinte minutos
mostrava **19:55 correndo em 52 px** e, logo acima, a ordem *"tire os olhos da
tela e ponha nos controles"*. **A instrução contradizia o instrumento que a
dava.**

---

## 2. O QUE FECHOU HOJE

### 2.1 A página da bancada — o instrumento da hora dela

| o que | antes | agora |
| --- | --- | --- |
| o gesto de cada teste | a linha do roteiro repetida | **sete campos**, do arquivo dono |
| onde ele fica | dentro de um `details` fechado | **aberto, antes dos quatro desenhos** |
| o contorno do desenho | não pintado (traço de 0,68 px) | **cor do plástico, 1,6 px de tela** |
| a borda do cartão | 1 px, cinza | **4 px, na cor do modelo** |
| a espera de 20 min | cronômetro de 52 px | **"anote e volte"**, relógio de 18 px |
| as 21 no seletor | perdidas entre 17 seções | **um corte só**, e dois `optgroup` |
| a cor do plástico | *"a página não escreve"* | **lida do aparelho, sob o comando dela** |

**Os sete campos, e a ordem deles é a ordem de fazer:** o que isto prova · onde
olhar · os passos · como saber que passou · por controle · a espera · a
armadilha. A armadilha vem por último de propósito — lida antes, contamina a
leitura.

**Quem escreve o gesto são dois arquivos, e não um só**, porque os donos são
outros:

* `docs/process/sprints/2026-09-07-O-COMO-DAS-21-…md` (79 KB) — a aceitação que
  **ela** escreveu;
* `docs/process/sprints/2026-09-07-O-COMO-DO-MAPA-…md` (720 KB) — o acervo das
  178 células.

Fundi-los faria os dois mudarem juntos, e eles não mudam pelas mesmas razões.

### 2.2 O contorno, e a lição de medição

*"e cara o contorno não tá pintado"*, e depois: *"abra o playwright e mude o
tipo de controle no mapa dos controles e veja a diferença"*.

**Ela estava certa duas vezes.** O desenho é DE LINHA, e quem dá cor à linha é o
`stroke` — a folha dos 28 pinta as ZONAS, e o contorno vivia numa segunda folha
que só existia dentro do `mapa-do-controle.html`. A mesa emitia o mesmo SVG e
não pintava nada.

**Mas a cor sozinha não bastou, e é aqui que a medição ensinou:** depois de
pintar, a foto saiu idêntica. O `stroke-width:.42` vem em unidades do `viewBox`
(116,68 de largura). O mapa desenha o SVG com 1160 px — o traço sai com 4,2 px
de tela. A mesa desenhava com 190: **0,68 px**. Abaixo de um pixel o navegador
não desenha uma linha, desenha um cinza fraco, e as linhas mais finas — a borda
de cima do touchpad — somem inteiras no antialiasing.

*A cor estava certa desde a primeira volta. O que faltava era espessura.*

**A cura não foi copiar a folha, foi LER**: `folha_do_desenho()` vai à página
que é dona das regras e reescreve só o endereço. Mordida: some com a folha lá e
a mesa reprova aqui.

### 2.3 As levas da 24h — todas costuradas

**A primeira medida estava errada, e vale guardar por quê.** `git rev-list`
dizia que 60 branches tinham commits faltando — e mentia: **cherry-pick cria
hash novo**, então toda branch já costurada continua parecendo pendente.

Por **equivalência de patch** (`git cherry`), o número real era outro:

```
139 de 146 costuradas · 7 com patch ausente
```

Das sete: uma já estava absorvida e superada (traz a mesa com 1265 linhas; a
árvore tem 2690); uma **regrediria a árvore** — um `wip(resgate)` que tira os
acentos do `.gitignore` e apaga 33 linhas dele, descartada com a razão escrita;
e **as cinco restantes entraram**.

Depois delas, o LOTE-4 inteiro (`QUEM-E-QUEM-04` · `PARIDADE-REMEDIR-02` ·
`SPECS-A-PROCEDENCIA-01`) e mais `A-LEITURA-DOS-QUATRO-01`, `MIC-BT-DONO-01`,
`O-CONTROLE-SEM-MAC-01`, `OS-EXTERNOS-NO-MAPA-PRO-01` e
`O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01`.

**Nos conflitos, nenhuma decisão minha entrou no dado:** o `mapa-controles.csv`
resolveu por TRÊS VIAS contra a base de cada commit (51 linhas do HEAD que a
branch não tocou, 11 dela), o `specs.html` e o `fatos_do_mapa.py` foram
REGENERADOS por serem derivados, e nos `.md` o HEAD ficou onde trazia medição
que o patch antigo ainda não tinha.

### 2.4 O mapa — nenhuma célula sem procedência

Ela perguntou: *"das ondas da 24h nada que os agentes possa ir avançando?"*. Não
havia sprint: das 617 com frontmatter, só 4 estavam abertas, e 3 são de bancada.
**O que sobrava era o mapa** — 53 células sem procedência firme, 26 do 8BitDo,
24 do Nintendo Pro, 3 do DualSense.

Elas não se fecham na bancada: fecham-se **lendo o driver**, que é o que ela
tinha pedido dias antes — *"manda os agentes pros csvs do 8bitdo e nintendo"*.

**Dezesseis agentes, oito escrevendo e oito verificando**, e a verificação era
adversarial de propósito: ir até o ponteiro que a resposta cita e derrubar o que
não se sustenta.

**Rebaixar era o resultado esperado, e foi o que mais aconteceu.** Seis desceram
para `incerto`, e a forma delas é sempre a mesma, escrita pela própria
verificadora: *o ponteiro existe e responde outra pergunta*. O caso exemplar é
`combinacao.adaptador_no_mesmo_controlador`: o fonte prova que o Pro no cabo é
aparelho USB, e a linha pergunta se o dongle e o cabo dividem o CONTROLADOR —
fato de host, sobre o qual o driver não diz uma palavra. E a casa já **mediu o
contrário** em 10/08: um controle no cabo matava a saída do controle no rádio.

**E uma verificadora achou um erro de fato numa evidência escrita horas antes:**
*"as CINCO regras de bancada (R1..R5)"* — são SEIS, e a sexta está uma linha
depois do intervalo citado. A conclusão não mudava; o número, sim.

---

## 3. AS ARMADILHAS DESTE DIA

**1. Uma trava que se mede contra a própria saída não trava nada.** Escrevi no
CSV, e uma régua conferia `list(novo[0].keys()) == campos` — só que `campos`
vinha do próprio arquivo novo. Ela passou enquanto o mapa perdia as 50 colunas.
A trava desta volta compara contra o **original**, lido antes de escrever.

**2. O comentário que descreve o defeito VIRA o defeito.** Terceira vez em três
dias. Hoje foram duas: uma régua que varria o fonte cru atrás de `0x80` reprovou
no comentário que avisa para não montar o pedido; e um comentário escrito para
explicar por que uma chave fica sem acento **citou a chave** e virou a violação.
A régua passou a ler o CÓDIGO, com `tokenize`, e não a prosa.

**3. Réguas que mediam o mundo de ontem — cinco, e todas reprovaram a CURA.**
A que cobrava três cores de realce (ela pediu o foco único do mapa); a que
cobrava um contador só no índice (agora a contagem é por seção); a que exigia
que o COMO repetisse o roteiro (que era o defeito); a que cravava `canal` e
`comando` no campo do gesto; e a que cravava 41 células num retrato que hoje
tem 43. **A assinatura é sempre a mesma: a régua digita o que devia ler.**

**4. O agente que se recusa a consertar está certo.** O da
`SPECS-A-PROCEDENCIA-01` viu o contador de 41 vermelho, declarou no relatório e
**não recontou**: *"recontar é reescrever a prosa do arquivo, e ela é de quem a
escreveu"*. Um número que se conserta sozinho para o teste passar é um número
que ninguém leu.

**5. O portão pega o que eu escrevo, e a cura é trocar, não isentar.** `opcao`
como nome de variável (renomeado), a estrela `U+2605` num rótulo (virou texto),
`Any` sem import numa régua (virou `object`). Isenção é para o que tem dono;
nome que eu escolhi eu troco.

**6. Os agentes escrevem em ASCII.** 419 palavras acentuadas — e **só nas
colunas de prosa**: `nada-a-acionar` e `nao-medido` são vocabulário fechado, e
acentuá-los quebraria o portão do mapa para curar o da acentuação.

---

## 4. OS NÚMEROS, MEDIDOS

| | |
| --- | --- |
| portões | **45 verdes** |
| commits no dia | 19 |
| branches das levas | **146, todas dentro** |
| testes na página da bancada | **198** (21 do roteiro + 177 do mapa) |
| com gesto escrito | **198 de 198** |
| com peça a acender | 119 (17 das 21) |
| já medidos, pré-marcados | 50 |
| células do mapa | **616** — 141 medidas · 440 inferidas do código · 27 do doc · **8 incertas** |
| células sem procedência | **zero** (eram 53 pela manhã) |
| arquivos de teste | 1206 |
| agentes despachados hoje | 58, em quatro workflows |

---

## 5. O QUE FALTA — e o que é dela

O plano é a §3 de
[O PLANO PARA O OPUS](2026-09-06-O-PLANO-PARA-O-OPUS-quatro-lotes-uma-mesa-e-o-produto-inteiro.md).
**A §5 daquele documento são os RISCOS, não uma etapa** — a pergunta já foi
feita e vale registrar a resposta.

1. **A SUÍTE, em doze lotes** — não rodou hoje, e por decisão: ela está com os
   quatro controles na mesa, e a suíte toca nós uinput de verdade (1289 num dia
   derrubaram a sessão gráfica dela). **Rode com a máquina livre.**
   ```bash
   ls tests/unit/test_*.py | sort > /tmp/todos.txt
   split -n l/12 -d /tmp/todos.txt /tmp/lote-
   for f in /tmp/lote-*; do .venv/bin/python -m pytest -q $(tr '\n' ' ' < "$f") \
     > /tmp/$(basename $f).txt 2>&1; tail -1 /tmp/$(basename $f).txt; done
   ```
2. **As dez fotos** — `src/hefesto_dualsense4unix/interface/olhar.py --todas
   --publicado --doc`.
3. **O merge em `dev`, de uma vez**, e os 45 portões lá.
4. **DELA:** a palavra para o `install.sh --yes`.
5. **DELA: A BANCADA.** As 21 linhas com os quatro na mão — é o que ela estava
   fazendo quando este documento foi escrito. `./validar.sh` na raiz.
6. **O handoff seguinte**, com o que a bancada mediu.

### O que a bancada precisa saber antes de começar

Três achados dos agentes que mudam como se lê um vermelho:

* **Linha 1** — se os chips da fita disserem `USB`/`BT` em vez de `cabo`/`rádio`,
  a tela está mostrando o **desenho**, não os controles dela. Não houve leitura,
  e não é reprova. (A conta do topo é o contrário: ali `USB` e `BT` estão certos,
  por decisão dela.)
* **Linha 10** — começar com os quatro **abaixo de 100%**. Controle cheio no cabo
  fica parado e isso não é o defeito.
* **Linha 20** — o texto do balão do botão de microfone descreve um caminho
  antigo: diz que a tela não devolve o mic, e hoje o botão alterna. Se o produto
  se comportar como o balão e não como os passos, é isso que se anota.

---

## 6. O PRÓXIMO COMANDO

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/_integra-0609
./validar.sh                      # a bancada dela, com os quatro na mesa
```

E, com a máquina livre, os doze lotes da §5.
