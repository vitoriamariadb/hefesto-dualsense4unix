# ONDA1-X · OS FATOS — a prosa que envelheceu, e a retriagem das 54

**04/09/2026.** Sprint
[`ONDA1-X-OS-FATOS-01`](../../sprints/2026-09-04-ONDA1-X-OS-FATOS-01-a-prosa-que-envelheceu-e-a-retriagem-das-cinquenta-e-quatro.md).
Árvore `/mnt/Apate/Desenvolvimento/hefesto-voo/ONDA1-X-OS-FATOS-01-X`, branch
`voo/ONDA1-X-OS-FATOS-01-X`. **Sem bancada, sem tocar em código.**

Posse: `docs/data/paridade-gtk-html.csv` ·
`docs/process/2026-09-03-O-TERCEIRO-NUMERO-a-paridade-com-a-gtk.md` ·
`docs/process/2026-09-04-AS-232-LINHAS-ABERTAS-o-que-falta-de-verdade.md`.

---

## 1. O QUE MUDOU

### 1.1 — O CSV: 86 linhas, só a coluna `porque`

Nenhuma outra coluna foi tocada. `veredito`, `sinal`, `sinal_espera`,
`sinal_escopo`, `gtk_onde` e `html_onde` são afirmações sobre o CÓDIGO e têm
régua; a triagem mora no `porque`.

| o que entrou | linhas |
| --- | ---: |
| `DECIDIDO em 04/09/2026 — …` + onde está escrito (§2 do PO + a pergunta da lista da aba) | **68** |
| `FECHADA POR DECISÃO, não por dívida` — as duas perguntas que morreram (`01`[04] e `02`[01]) | **3** |
| marca de conflito `C-1`…`C-7`, com o que a lista da aba recomendava e a decisão dela que ganha | **11** |
| `SAI DO BALDE DESENHO, sem virar pergunta` — as nove que as listas descartaram, com a razão | **9** |
| `O BALDE PUBLICAR ESTÁ VAZIO` — com a saída do `check_o_desenho_aprovado.py` | **6** |
| **fato errado SUBSTITUÍDO** — sete medições que caíram | **7** |
| **total de linhas tocadas** | **86** |

Por aba: 01 · 7 | 02 · 20 | 03 · 7 | 04 · 10 | 05 · 9 | 06 · 6 | 07 · 2 |
08 · 13 | 09 · 2 | 10 · 10. (As sete categorias somam mais que 86 porque uma
linha pode levar mais de uma marca — a `05-vibracao` do deslizador leva três.)

**Dois números do enunciado da sprint estavam a menos, e os dois para baixo:**
os sete conflitos tocam **onze** linhas do CSV, não sete (uma pergunta fecha até
quatro linhas); e as duas perguntas que morreram são **três** linhas
(`02`[01] fecha duas).

### 1.2 — `2026-09-03-O-TERCEIRO-NUMERO-*.md`: a prosa parou de guardar cópia do número

O defeito não era medição, era **um número com dois donos e um dono só com
régua.** A cura é estrutural: a prosa deixou de repetir o número e passou a
citar a tabela da §2, que a regra `numero-publicado` confere contra o CSV.

| onde | dizia | virou |
| --- | --- | --- |
| `:15` | *"O número é **14%**"* | aponta para a linha `TODAS` da tabela; o 14% fica datado como o de 03/09 (`548c0fbc`) |
| `:78` | *"o `01-jogar` publicou 11% onde a divisão dá 12% (5 de 42)"* | a correção fica com a data; o valor vivo é o da tabela |
| `:127` | `### FALTA_NO_HTML — 176 features, 44% do total` · *"O maior bloco"* | título sem número; e **deixou de ser o maior bloco** — hoje é o `DIFERENTE` |
| `:155` | `### DIFERENTE — 103 features, 26%` | título sem número |
| `:180` | `### SO_NO_HTML — 59 features, 15%` | título sem número (o valor ainda calha de estar certo, e é por isso que sai) |
| `:224` | *"'14% de paridade' vira propaganda"* | *"a paridade publicada vira propaganda"*, mais o registro de que a régua funcionou: 14% → 27% sem ninguém "atualizar" à mão |
| `:286` | *"a `03-gatilhos` é a mais adiantada (32%) e a `02`, a `06` e a `09` as mais atrasadas (8%)"* | o ranking saiu (com a razão, em comentário); ficou o TIPO de atraso de cada aba, que não caduca |
| `:294` | *"quatro campos da 02 e o `data-campo=\"luz\"` da 04 esperam só o `--publicar`"* | **fato derrubado**, com os três comandos que o mediram |

### 1.3 — `2026-09-04-AS-232-LINHAS-ABERTAS-*.md`: 232 → 226, e o balde que morreu

O nome do arquivo fica (meia dúzia de documentos apontam para ele) com um aviso
no topo. Mudou:

* **§1** — a contagem, com o comando ao lado; o balde `PUBLICAR` a zero; o balde
  novo `REMEDIR`; e a frase que era o cerne do documento — *"74 das 180 esperam
  por ELA"* — substituída por **nenhuma das 171 espera por ela**.
* **§2** — tabela por aba remedida, com linha `TODAS` que fecha em 226.
* **§4** — `LIGAR` de 43 para 38, com as cinco que fecharam **riscadas, não
  apagadas** (as cinco são da 08-conexoes).
* **§5** — deixou de ser *"as seis que esperam uma palavra"*: é o laudo do balde
  que morreu, com para onde cada uma das seis foi.
* **§6** — `DESENHO` de 74 para 72, e **cada linha ganhou a decisão que a fecha**,
  com o endereço (`NN`[MM] do documento do PO). 64 têm decisão, 2 fecharam, 8 não
  eram desenho.
* **§7** — `MOTOR` de 57 para 58 (a linha que abriu).
* **§8** — 52 → 55 não-dívida.
* **§9** — virou quatro subseções: as sete que fecharam, o balde que morreu, **as
  quatro medições bancada×produto que caíram**, e o fato de manhã.
* **§10** — a resposta à pergunta dela, com a ordem sem degrau bloqueado.

---

## 2. COMO PROVEI — os comandos, e a saída

Todos rodados nesta árvore, com `source .envrc-voo` e o python da árvore
principal dela (ver §4.1: **o `portoes.sh` escolhe a venv errada numa árvore de
agente**).

### O número, antes e depois — não mudou, e tinha de não mudar

```
$ .venv/bin/python scripts/check_paridade_gtk_html.py
OK: 396 features conferidas contra o código — 107 IGUAL · 125 DIFERENTE ·
    101 FALTA_NO_HTML · 59 SO_NO_HTML · 4 NAO_DA_PARA_SABER (27% de paridade).
```

Idêntico antes e depois das 86 linhas: **eu mexi na triagem, não no veredito.**

### A tabela por aba

```
$ .venv/bin/python scripts/check_paridade_gtk_html.py --tabela
aba             feats  IGUAL  DIFER  FALTA  SO_HTML   ?  paridade
01-jogar           42      8     14     15        4   1       19%
02-controles       50     12     16     18        4   0       24%
03-gatilhos        31     15      8      2        5   1       48%
04-iluminacao      35      6      9     12        7   1       17%
05-vibracao        31     10     11      7        3   0       32%
06-navegacao       40     12     13      6        9   0       30%
07-lancadores      30      8      6      6        9   1       27%
08-conexoes        49     13     21     13        2   0       27%
09-sistema         38     10     11     10        7   0       26%
10-perfis          50     13     16     12        9   0       26%
TODAS             396    107    125    101       59   4       27%
```

### O balde `PUBLICAR`

```
$ .venv/bin/python scripts/check_o_desenho_aprovado.py
desenho: 13 página(s) na bancada `mockup/`
  o produto já tem ..... 13
  o produto está atrás . 0  (0 em trabalho)
OK: o produto não está atrás do desenho dela sem dizer por quê.

$ for f in mockup/*.html; do cmp -s "$f" "src/.../interface/paginas/$(basename $f)" \
    || echo "DIFEREM: $f"; done
páginas comparadas: 13 · diferentes: 0

$ cat mockup/DIVERGENCIAS.md | tail -1
<!-- Nenhuma aba em trabalho: o produto está igual ao desenho dela. -->
```

### As 232 → 226, medidas contra o commit em que a triagem nasceu

```
$ git show f941a751:docs/data/paridade-gtk-html.csv | conta-vereditos
  396 {IGUAL 101, DIFERENTE 121, FALTA_NO_HTML 111, SO_NO_HTML 59, ? 4}
  → abertas 232 · fechadas 164
$ conta-vereditos docs/data/paridade-gtk-html.csv          # hoje
  396 {IGUAL 107, DIFERENTE 125, FALTA_NO_HTML 101, SO_NO_HTML 59, ? 4}
  → abertas 226 · fechadas 170
```

E a conta fecha exatamente: **232 − 7 que fecharam + 1 que abriu = 226.** As
doze mudanças de veredito estão nomeadas na §9.1 do documento das 232.

### As quatro medições bancada×produto que caíram

```
$ grep -c 'data-gesto="mascara"'      paginas/01-jogar.html      → 12   (mockup: 12)
$ grep -o '<input type="color"[^>]*'  paginas/04-iluminacao.html
    <input type="color" class="livre" value="#0000ff" data-gesto="cor"
    <input type="color" class="livre" value="#ff0000" data-gesto="cor"   (idem no mockup)
$ grep -c 'data-campo="hex"'          paginas/04-iluminacao.html → 18   (mockup: 18)
$ grep -c 'data-campo="selo-estado"'  paginas/08-conexoes.html   →  5   (mockup:  5)
$ grep -c 'data-hef-alvo="classe"'    paginas/08-conexoes.html   → 20   (mockup: 20)
$ grep -c 'data-campo="brilho-pct"'   paginas/04-iluminacao.html →  2
$ grep -c 'type="range"'              paginas/05-vibracao.html   →  2
```

As quatro linhas afirmavam **0**, **2**, **0/0** e *"na bancada os quatro
respondem"*. As quatro estavam certas antes das publicações; nenhuma está certa
hoje.

### O mapeamento das 54 → linhas do CSV, conferido nos dois sentidos

Extraído das dez listas `DECISOES-DELA-NN-*.md` pela linha
`**Fecha as linhas:** …` de cada pergunta, e casado contra o par
`(aba, feature)` do CSV:

```
perguntas: 54 · citações inválidas: 0
features distintas citadas pelas 54: 71
DESENHO listadas no doc das 232: 74
  · com decisão citada: 65   (64 abertas + 1 que fechou antes de a decisão rodar)
  · sem decisão:         9   — as nove estão na seção "Não são decisão dela" da
                              lista da respectiva aba, com a razão medida
citadas pelas 54 e FORA do balde DESENHO: 6 (baldes DELA, MELHOR, LIGAR,
                              PUBLICAR e MOTOR) — todas receberam a decisão também
```

### Os portões

`bash scripts/portoes.sh` — **36 verdes, rc=0**, antes e depois. Ver §4.1: com o
python que o script escolhe sozinho numa árvore de agente, 9 dos 36 reprovam por
ambiente.

---

## 3. O QUE MEDI E DERRUBOU UMA SUPOSIÇÃO

### 3.1 — A maior: **o portão da paridade é cego à forma como esta dívida fecha**

Quatro linhas afirmavam uma diferença entre `mockup/` e
`interface/paginas/` que **não existe mais** — os treze pares são byte-idênticos
desde a publicação da madrugada. O portão ficou **verde** sobre as quatro, e não
por descuido: é estrutural.

O `sinal` dessas linhas é um símbolo da GTK — `_on_lightbar_cor_solta`,
`_refresh_lightbar_from_draft`, `COR[ESTADO_ATENCAO]`. A regra 6
(`divida-fechada`) morde quando esse símbolo APARECE no lado HTML; a regra 7
(`sinal-morto`) morde quando o símbolo não existe em lugar nenhum. **Mas a
interface nova não fecha dívida chamando interno da janela antiga — ela fecha
ganhando o ENDEREÇO DE TELA** (`data-gesto="cor"`, `data-campo="hex"`,
`data-campo="selo-estado"`). Um símbolo que existe na GTK e nunca vai aparecer
no HTML **cai entre as duas regras**, e a linha fica verde para sempre sobre uma
dívida que já fechou.

É a assinatura de 03/09 outra vez: *o instrumento apontava para outra coisa*.

**Não virei o veredito das três.** Virar exige medir o ATO na tela viva, e isso
é da frente da aba na Onda 2 — marcar linha como fechada antes de a cura ser
medida é o instrumento falso que a própria sprint mandou não fabricar. Elas
foram para um balde novo, `REMEDIR`, com o comando ao lado.

### 3.2 — Três diagnósticos meus que a medição corrigiu

| eu supus | medi |
| --- | --- |
| que o `--publicar` explicasse a diferença do p3/p4 da 01-jogar | `data-gesto="mascara"` dá **12 nos dois arquivos**. O que separa p3/p4 é `data-conectado="nao"` — **estado**, não publicação. Publicar nunca teria curado, e o porquê continua sem medição |
| que o balde `PUBLICAR` morresse limpo, com as seis virando trabalho | três viraram **`DELA`** (a diferença que sobra é decisão dela) e três viraram **`REMEDIR`**. Nenhuma virou trabalho |
| que o `DESENHO` fosse 74 decididas | são **72** abertas — duas já tinham fechado — e **oito das 72 não são desenho**: as listas das abas as descartaram com a razão. A reclassificação delas é da segunda passagem |

### 3.3 — Dois números do meu enunciado, corrigidos para cima

Os sete conflitos tocam **11** linhas do CSV, e as duas perguntas mortas são
**3** linhas. Uma pergunta fecha entre uma e quatro linhas; contar perguntas e
dizer "linhas" subconta.

### 3.4 — O que **não** derrubei, e é o achado do outro lado

A prosa do terceiro número **não estava errada** — estava datada. Os quatro
números (14%, 176, 103, 8%) eram todos exatos em `548c0fbc`, o commit em que o
documento nasceu. Pelo teste da casa (*apagar isto faria alguém repetir um
trabalho?*) eles não guardam custo pago: saem, e o que fica são as duas
correções de fato de 03/09 — que **sim** guardam trabalho — e as datas.

---

## 4. O QUE SOBROU PARA O PRÓXIMO

### 4.1 — DEFEITO DE FERRAMENTA, e ele atinge TODA árvore de agente deste repo

`scripts/portoes.sh:203` escolhe a venv assim:

```sh
principal="$(git -C "$RAIZ" worktree list --porcelain | awk 'NR==1{print $2}')"
```

Isso devolve a **worktree principal do repositório**, que nesta máquina é
`/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-estavel` — e o `venv/` de lá
tem `pip` e `python`, **e mais nada**. A venv com o install editable é a da
árvore DELA, `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv`, que é
uma worktree **ligada**, não a principal.

Medido nesta árvore, sem contornar:

```
portões — python /mnt/.../hefesto-dualsense4unix-estavel/venv/bin/python
REPROVOU: 9 vermelho(s) de 36 -> curvas mac-por-oui mac-de-fixture casa-sabe
          portao-tem-chamador pecas-do-dualsense cores-do-dualsense ruff mypy
   (ModuleNotFoundError: pydantic · structlog · pytest · playwright;
    ruff e mypy: comando não encontrado)
```

**Nove vermelhos que não são defeito nenhum**, e o cabeçalho do script nomeia o
python — foi só lê-lo. O contorno que usei:

```bash
export HEFESTO_PY=/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
export PATH="/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin:$PATH"
bash scripts/portoes.sh     # 36 verdes, rc=0
```

`HEFESTO_PY` sozinho **não basta**: ele resolve só o `PY`, e o `_bin()` continua
procurando `ruff`/`mypy` na venv errada antes do `PATH`.

**OS DOIS RESULTADOS, lado a lado, na MESMA árvore e no MESMO estado:**

| interpretador | resultado |
| --- | --- |
| o que o `portoes.sh` escolhe sozinho (`…-estavel/venv`) | **REPROVOU: 9 de 36** — todos por módulo/binário ausente |
| `hefesto-dualsense4unix/.venv` (o do install editable) | **TODOS VERDES — 36 portões**, `rc=0` |

**Nenhum número desta entrega foi medido com o interpretador errado.** Os dois
scripts que a sprint manda rodar são chamados com o caminho explícito em toda a
§2, e o `PYTHONPATH` do `.envrc-voo` resolve o pacote para ESTA árvore —
conferido:

```
$ .venv-dela/bin/python -c "import hefesto_dualsense4unix as h; print(h.__file__)"
/mnt/Apate/Desenvolvimento/hefesto-voo/ONDA1-X-OS-FATOS-01-X/src/hefesto_dualsense4unix/__init__.py
```

O cabeçalho da corrida final confirma as duas linhas:

```
portões — árvore /mnt/Apate/Desenvolvimento/hefesto-voo/ONDA1-X-OS-FATOS-01-X
         python  /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
         PYTHONPATH /mnt/Apate/Desenvolvimento/hefesto-voo/ONDA1-X-OS-FATOS-01-X/src
```

**Achado em paralelo, e isso vale como confirmação:** quem coordena mediu o
mesmo defeito numa árvore vizinha e o anunciou à leva enquanto esta frente
corria. **Duas medições independentes, o mesmo `awk 'NR==1'`.** O conserto é de
quem coordena.

**A cura é de código e eu não a fiz** (esta frente não toca em código): fazer o
`_venv_bin` percorrer TODAS as worktrees, não só a primeira, e exigir que a venv
escolhida importe o pacote — uma venv sem `pytest` não serve para rodar portão.
Enquanto isso não existir, **toda árvore de agente nova repete os nove
vermelhos**, e quem os ler como defeito vai caçar fantasma.

### 4.2 — Uma cópia velha do número sobrevive, e ela é código

`scripts/check_paridade_gtk_html.py:44`, na docstring:

> `Sem isso o "14% de paridade" vira propaganda no dia seguinte à primeira cura.`

É a última cópia do 14% na árvore, e ela está exatamente no arquivo que existe
para impedir que o número envelheça. Não a toquei — **é código, e código não é
desta frente**. A substituição é de uma linha, e o texto que a fecha é o mesmo
que usei no documento:

> `Sem isso a paridade publicada vira propaganda no dia seguinte à primeira cura.`

### 4.3 — A segunda passagem do CSV

Continua sendo minha e continua **não antecipada**. Quando a Onda 2 fechar, as
dez frentes relatam as linhas que fecharam e eu lanço. Fica também para ela:

* **as 3 do balde `REMEDIR`** — medir o ATO na tela viva da 04 e da 08 e virar
  (ou não) o veredito;
* **as 8 do `DESENHO` que não são desenho** — reclassificar para `DELA`, `MOTOR`
  ou `REMEDIR`, com a razão de cada uma já escrita na §6;
* **o p3/p4 da 01-jogar** — por que o gesto de máscara não responde no cartão
  desconectado, agora que se sabe que não é publicação.

### 4.4 — A régua que a sprint T-06 pedia, e por que não a escrevi

A sprint sugeria *"uma régua que compare o número do `:15` com o `TODAS` da
tabela"*. **A prosa deixou de ter o número**, então não há mais duas cópias a
comparar — o defeito foi curado na estrutura, não vigiado. Se alguém quiser a
régua mesmo assim, ela é barata: reprovar qualquer `NN%` fora do bloco
`<!-- TABELA-DA-PARIDADE -->` que não esteja acompanhado de uma data.
