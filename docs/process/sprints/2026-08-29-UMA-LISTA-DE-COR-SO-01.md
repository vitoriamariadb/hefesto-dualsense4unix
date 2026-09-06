---
sprint: UMA-LISTA-DE-COR-SO-01
estado: absorvida
---

# UMA LISTA DE COR SÓ — as sete cores que o produto não sabe nomear

> **ESTADO 06/09/2026: absorvida** — a dona era a ONDA-CONEXOES-12; o que falta é linha do `docs/data/paridade-gtk-html.csv` (abas 04 e 08). Não se despacha pelo id.

**29/08/2026.** O desenho conhece **28** modelos de DualSense; o produto conhece
**21**. Quem comprou um HyperPop abre o app, lê **"Não sei"** sobre o próprio
controle — e o desenho, na mesma tela, já sabe pintá-lo.

A cura é a forma que ela já aprovou em 27/08, quando a cor saiu do CSS escrito à
mão e virou dado com dono, gerador e portão: **duas listas com dois donos viram
uma lista com um dono.**

> **DOIS DOCUMENTOS PARA O MESMO TRABALHO — lido em 29/08/2026, e quem despachar
> precisa resolver antes de executar.** A
> [ONDA-CONEXOES-12](2026-08-27-ONDA-CONEXOES-12-as-vinte-e-oito-cores-e-as-dez-zonas-chegam-ao-produto.md)
> já é a dona desta cura desde 27/08: ela nomeia as mesmas sete cores, já manda
> `NOMES_DE_FABRICA` e `TONS` saírem do CSV, já cria o teste que morde e já
> proíbe o executante de tocar no CSV. **As duas nasceram na mesma leva, sem se
> ver** — que é exatamente o defeito "duas listas, dois donos" uma camada acima,
> agora em sprints.
>
> O que ESTE documento acrescenta e a CONEXOES-12 não tinha: os três NOMES
> divergentes e o desenho do portão. O que a CONEXOES-12 tem e este não: as dez
> ZONAS, e os quatro buracos medidos em 29/08 (o CSV não viaja no wheel; a
> quarta cópia presa por `test_config_06`; o `TONS` conflitando com a medição
> DELA do `05` Starlight Blue). **Uma das duas tem de virar ponteiro para a
> outra antes de qualquer execução — não as executem em paralelo.**

**Esta sprint é de ESCRITA, não de execução.** A leva foi de leitura e medição:
não editei `cor_do_plastico.py` (há leva em voo nele), não rodei `install.sh`,
não escrevi perfil, não mandei byte a aparelho, não abri janela. Rodei um só
arquivo de teste (o do meu assunto) e dois protótipos de portão no scratchpad.

---

## 1. A conta, medida hoje

| | |
|---|---|
| Modelos no CSV (`docs/data/cores-do-dualsense.csv`) | **28** |
| Nomes no produto (`cor_do_plastico.py:96-118`, `NOMES_DE_FABRICA`) | **21** |
| Faltando no produto | **7** |
| **Nomes que DIVERGEM entre os dois** | **3** ← o enunciado não previa |
| Divergências totais que o portão proposto pega | **10** |

### 1.1 As sete que faltam

```
13  HyperPop Techno Red              ZC  Ghost of Yōtei Limited Edition
14  HyperPop Remix Green             ZD  Marathon Limited Edition
15  HyperPop Rhythm Blue             ZE  Genshin Impact Limited Edition
                                     ZF  007 First Light Limited Edition
```

### 1.2 As TRÊS que o enunciado não mencionou, e que mudam o que ela vê hoje

O enunciado desta sprint pedia "as sete cores". **São sete faltando e três
divergindo** — e as três já estão na tela hoje, com o nome errado:

| código | CSV (o dono) | produto (hoje na tela) |
|---|---|---|
| `Z1` | `God of War Ragnarök` | `God of War Ragnarok` — sem o trema |
| `Z2` | `Marvel's Spider-Man 2` | `Spider-Man 2` — sem o `Marvel's` |
| `ZB` | `Icon Blue Special Edition` | `Icon Blue Limited Edition` — **Special ≠ Limited** |

Isto importa por dois motivos. Primeiro, **derivar do CSV não é só ADICIONAR
sete: é TROCAR três nomes que já estão na tela** — e trocar texto de tela é
`PROVA-DE-TELA-01`, foto antes/depois e a palavra dela. Segundo, o `ZB` não é
divergência de acentuação: uma das duas fontes está **errada** sobre o nome do
produto da Sony, e a sprint tem de decidir qual antes de gravar a outra em pedra.

> **Entrega 0 (bloqueia a 1):** conferir `Z1`, `Z2` e `ZB` contra a fonte
> externa (`dualshock-tools`, `colorMap`) e substituir o errado nos dois lados.
> Regra desta casa: fato errado se SUBSTITUI, e sai de TODOS os lugares.

### 1.3 Nada sobra

Nenhum código do produto está ausente do CSV. O CSV é **superconjunto estrito**
do produto — o que torna a derivação viável sem perda de nome nenhum.

---

## 2. Pergunta 1 — deriva no import, ou gera arquivo?

**Resposta: GERA ARQUIVO.** E o motivo que decide não é o custo: é que a rota do
import **não funciona na máquina de ninguém que não seja ela**.

### 2.1 O custo, medido (e ele NÃO é o argumento)

O enunciado dizia "o CSV tem 303 linhas (28 modelos × 10 zonas)". **Os dois
números do parêntese estão errados**, e medi:

- 303 é o total do arquivo **com 69 linhas de comentário**; os dados são
  **233 linhas** + 1 cabeçalho;
- as zonas **não são 10 por modelo**: 19 modelos têm 9 zonas, 5 têm 10, e
  quatro têm 2, 3, 3 e 4. 28 × 10 = 280 ≠ 233.

Lendo e parseando o arquivo inteiro, 200 repetições:

```
rota A (ler CSV + parsear + dedup) : 0,394 ms por import
rota B (dict literal já compilado): 0,056 ms   →  razão 7x
```

**0,4 ms não é argumento para nada.** Quem escolher pelo relógio escolhe errado,
nos dois sentidos. O argumento é o de baixo.

### 2.2 O argumento que decide: o CSV NÃO VAI NO WHEEL

`pyproject.toml:83-91` empacota **só** `src/hefesto_dualsense4unix`, mais os
`.glade`, `.png` e `.mo` listados um a um. `docs/` não está lá, e não há
`MANIFEST.in`.

Medido, resolvendo o caminho nos dois layouts:

```
editable  -> …/hefesto-dualsense4unix/docs/data/cores-do-dualsense.csv   existe: True
wheel     -> …/.venv/lib/python3.13/docs/data/cores-do-dualsense.csv     existe: False
```

Esta bancada roda **editable** (`.venv/…/_editable_impl_hefesto_dualsense4unix.pth`),
e é por isso que a rota do import passaria em todo teste daqui e **quebraria na
primeira instalação de verdade** — `FileNotFoundError` no import de
`cor_do_plastico`, que derruba a aba Configurações inteira, não só a cor.

**É exatamente o defeito que `D-A-REGUA-E-QUALQUER-MESA-NAO-A-DELA` existe para
impedir**, e é a razão pela qual esta sprint existe: o app é GPL3, gratuito, e
pensado como acessibilidade. Uma cura que só funciona na mesa dela não é cura.

Trocar o empacotamento para levar o CSV é possível, mas é a rota pior: põe um
arquivo de `docs/` dentro do wheel, faz o produto depender de leitura de disco
para um dado que nunca muda em tempo de execução, e ainda paga o parse.

### 2.3 E esta casa já escolheu GERAR antes

`scripts/gerar_cores_do_dualsense.py` (27/08) já faz exatamente isto para o
desenho: lê os CSV e **escreve** o `<style>` dentro do SVG, com `--check`
(`:378`) para reprovar quando o disco diverge. A rota está provada, tem forma
conhecida e portão irmão. Repetir a forma é mais barato que inventar a segunda.

### 2.4 A forma da entrega

```
docs/data/cores-do-dualsense.csv          o DONO (não muda de papel)
        ↓  scripts/gerar_nomes_de_fabrica.py          (novo, ou seção do gerador que já existe)
src/hefesto_dualsense4unix/integrations/nomes_de_fabrica.py    GERADO, versionado, no wheel
        ↑  cor_do_plastico.py importa e reexporta NOMES_DE_FABRICA
```

O arquivo gerado é **versionado** (como o SVG gerado já é): quem faz `pip
install` do repositório recebe a lista pronta, sem rodar gerador nenhum. O
cabeçalho dele diz, na primeira linha, `GERADO POR … NÃO EDITE À MÃO`.

`cor_do_plastico.py` continua sendo a porta pública — `NOMES_DE_FABRICA`
importado de lá segue funcionando, e nenhum dos consumidores abaixo muda de
import.

---

## 3. Pergunta 2 — o código DESCONHECIDO

**Requisito, e ele é de MANUTENÇÃO, não de mudança:** um código que não está em
lista nenhuma continua respondendo **"Não sei"**. Está certo hoje e tem de
continuar certo depois.

O comportamento vive em `cor_do_plastico.py:204-215`:

```python
def cor_do_codigo(codigo: str) -> CorDoPlastico | None:
    """A cor de um código de dois caracteres, ou ``None`` para código estranho.

    ``None`` é resposta legítima e frequente: a tabela tem vinte e uma entradas e
    a Sony fabrica edições novas sem avisar ninguém. Inventar um nome aqui poria
    na tela uma cor que ninguém mediu.
    """
```

**Escrito aqui porque alguém vai querer "curar" isto.** A tentação é real e tem
forma previsível: alguém verá o `None` e proporá devolver `"DualSense
desconhecido (código 4F)"`, ou o nome da cor mais próxima por distância de hex,
ou "Branco" como padrão. **As três inventam** — põem na tela um nome que a Sony
não usa, sobre um aparelho que ninguém mediu.

> **Requisito R1.** Passar 28 a conhecer **não** reduz o alcance do "Não sei".
> `cor_do_codigo` devolve `None` para todo código fora do CSV, e a tela continua
> dizendo "Não sei". A lista cresce; a honestidade não encolhe.
>
> **Requisito R2.** O teste que prova R1 usa um código **sabidamente inexistente
> e estável** (`"4F"`), e ele fica no arquivo do portão, não solto.

Nota de redação: o docstring acima diz "vinte e uma entradas" — é um dos 18
lugares da seção 6 que a cura torna falsos.

---

## 4. Pergunta 3 — o portão: onde mora e como MORDE

### 4.1 Hoje não existe portão nenhum, e eu medi

Nenhum arquivo desta casa cruza o CSV com `NOMES_DE_FABRICA`:

```
scripts/check_cores_do_dualsense.py     menções a NOMES_DE_FABRICA/TONS : 0
scripts/gerar_cores_do_dualsense.py     menções a NOMES_DE_FABRICA      : 0
src/…/utils/maquina.py:535              1 — e é um COMENTÁRIO, não uma régua
```

E a prova de que ninguém pega: **`tests/unit/test_config_06_declaracao_nasce_em_nao_sei.py`
passa hoje, 31 testes verdes em 0,29 s**, com as 7 faltas e as 3 divergências
todas presentes na árvore. O buraco atravessou 27/08, 28/08 e 29/08 no verde.

### 4.2 Onde mora

**Dois lugares, e não é redundância** — é a regra desta casa, e ela nasceu do
portão que mediu o lugar errado e deu verde:

1. **`scripts/gerar_nomes_de_fabrica.py --check`**, na lista do
   `scripts/portoes.sh` (ao lado do `cores-do-dualsense` de `:84`) e no
   `.github/workflows/ci.yml` (ao lado do `:44`). Régua: **o disco bate com o
   que o CSV geraria agora?** Pega o gerador que não rodou.
2. **`tests/unit/test_uma_lista_de_cor_so.py`**, novo. Régua: **o dicionário <!-- ref-externa: arquivo que ESTA sprint propõe criar; a ausência é o assunto -->
   importado bate com o CSV, nos DOIS sentidos?** Pega o que a primeira não
   pode pegar — alguém editando o `.py` gerado à mão e rodando o gerador
   depois, ou um import que resolve para outro módulo.

A lista de portões tem UM dono, o `scripts/portoes.sh`; e
`tests/unit/test_portao_a_lista_de_portoes_e_uma_so.py` compara local com CI nos
dois sentidos, então **a entrada tem de nascer nos dois arquivos ou o portão do
portão reprova.**

### 4.3 Como MORDE — arranquei a cura e vi reprovar

Escrevi o portão proposto como protótipo e rodei **contra a árvore de hoje**.
Ele reprova, `rc=1`, com as dez divergências:

```
CSV=28  produto=21
  FALTA no produto : 13  HyperPop Techno Red
  FALTA no produto : 14  HyperPop Remix Green
  FALTA no produto : 15  HyperPop Rhythm Blue
  NOME DIVERGE    : Z1  CSV='God of War Ragnarök' produto='God of War Ragnarok'
  NOME DIVERGE    : Z2  CSV="Marvel's Spider-Man 2" produto='Spider-Man 2'
  NOME DIVERGE    : ZB  CSV='Icon Blue Special Edition' produto='Icon Blue Limited Edition'
  FALTA no produto : ZC  Ghost of Yōtei Limited Edition
  FALTA no produto : ZD  Marathon Limited Edition
  FALTA no produto : ZE  Genshin Impact Limited Edition
  FALTA no produto : ZF  007 First Light Limited Edition
REPROVA — rc=1
```

E o outro sentido, que é o que o enunciado pediu — **simulei o estado curado
(produto derivado do CSV) e arranquei a cor `02` do CSV**:

```
produto CURADO (gerado do CSV): 28 nomes

1. CSV intacto                   -> CSV=28   (sem divergência)   APROVA rc=0
2. CSV com a cor 02 ARRANCADA    -> CSV=27
     SOBRA no produto: 02 'Cosmic Red' — o CSV não conhece mais
                                                      REPROVA rc=1
```

**A régua morde nos dois sentidos**: falta no produto, e sobra no produto. Uma
régua que só olhasse `CSV ⊆ produto` deixaria passar a cor arrancada.

### 4.4 A armadilha que esta régua tem de evitar

O `NOMES_DE_FABRICA` é `dict[str, str]`, e o CSV tem **233 linhas para 28
modelos** — cada modelo aparece 9 ou 10 vezes, uma por zona. Uma régua ingênua
que fizesse `{linha['codigo_da_cor']: linha['nome']}` sobre o CSV inteiro
funciona **por acidente** (a última zona vence e o nome é igual em todas as
linhas do modelo). Se um dia uma linha de zona trouxer nome diferente, a régua
silencia e escolhe a última.

> **Requisito R3.** O leitor do CSV **agrupa e exige nome único por código**:
> se um código aparecer com dois nomes diferentes, o portão REPROVA dizendo os
> dois. (Rodei essa checagem hoje: nenhum código tem nome ambíguo. A régua é
> para que continue assim.)

### 4.5 O terceiro dono, que o enunciado não menciona

`scripts/ensaios/cor_do_plastico.py` guarda uma **cópia própria** da tabela,
para rodar num checkout sem o pacote instalado — e
`tests/unit/test_config_06_declaracao_nasce_em_nao_sei.py:232-249`
(`test_as_duas_copias_da_tabela_concordam`) já confronta as duas.

**Isso é boa notícia e é uma armadilha de sequência.** Boa notícia: o confronto
existe e vai reprovar sozinho se a sprint mexer só no produto. Armadilha: quem
gerar o `.py` e rodar os portões vai ver um teste vermelho que **não é o dele**,
e pode "consertar" afrouxando o confronto.

> **Requisito R4.** A cópia do ensaio entra na MESMA entrega, gerada pelo mesmo
> gerador. Duas listas viram uma; três listas não podem virar duas.

### 4.6 O QUARTO dono — e este quebra em silêncio

`external_controllers.py:489-491`:

```python
_CODIGOS_DE_CATALOGO = frozenset(
    {"00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"}
)
```

`dicas_da_busca()` (`:568-590`) usa esse conjunto para decidir a dica de cada
linha da busca: `"Cor de catálogo do DualSense."` ou `"Edição especial ou
coleção."` (`:497-498`).

**As três HyperPop são cor de catálogo, e os códigos delas são `13`, `14`,
`15`** — fora do conjunto. Se a sprint crescer a lista e não tocar aqui, as três
entram na busca dizendo **"Edição especial ou coleção"**, que é falso. E nada
reprova: o conjunto é literal, ninguém o cruza com nada, e a dica errada é
texto de tela que só o olho pega.

> **Requisito R5.** `_CODIGOS_DE_CATALOGO` sai do literal e passa a derivar do
> mesmo dado. O CSV não tem coluna `familia` hoje — **acrescentar uma é a
> entrega**, e ela é de uma linha por modelo. A alternativa (deduzir pela forma
> do código: `Z*` e `30` são especiais, o resto é catálogo) é regra implícita
> que a Sony pode quebrar sem avisar, e esta casa já pagou por regra implícita.

---

## 5. Pergunta 4 — os TONS. **Trabalho separado, e há dois bloqueios**

**Resposta: NÃO se unificam nesta sprint.** Recomendo sprint própria
(`UMA-LISTA-DE-COR-SO-02`), e não é preferência de escopo: medi os dois lados e
o `TONS` tem **dois bloqueios que a lista de nomes não tem**.

### 5.1 Bloqueio A — quatro cores PERDERIAM a borda

`TONS` (`cor_do_plastico.py:122-144`) tem 21 hexadecimais, um por código, e
pinta a borda do card em `secao_controles.py:954` e `:1586-1589`, via
`tom_para_a_borda`.

O CSV tem hex **por zona**, e para quatro modelos a zona `casca_esq` traz
`grau=SEM-HEX` com o campo `hex` **vazio** — porque o acabamento não cabe num
hexadecimal:

| código | produto hoje | CSV `casca_esq` | acabamento |
|---|---|---|---|
| `06` Grey Camouflage | `#7f8479` | *(vazio)* | camuflado |
| `10` Chroma Teal | `#1e8e82` | *(vazio)* | iridescente |
| `11` Chroma Indigo | `#3b3e8c` | *(vazio)* | iridescente |
| `12` Chroma Pearl | `#e9dedc` | *(vazio)* | iridescente |

O CSV tem **31 linhas SEM-HEX** no total. Derivar `TONS` do CSV sem resolver
isto entrega borda vazia para quatro cores — regressão visível. E o CSV manda,
com todas as letras: *"NÃO invente um fill"*.

### 5.2 Bloqueio B — apagaria a única medição DELA

`cor_do_plastico.py:40-43` e `docs/data/cores-do-plastico.md:39` dizem a mesma
coisa: das 21 linhas de `TONS`, **20 são aproximadas, e só a `05` foi MEDIDA —
por ela, no controle dela, em 21/08/2026**: `#B5CED4`.

O CSV, para `05 / casca_esq`, traz `#7EB8D4`, `grau=FOTO`,
`fonte=pesquisa-externa-27-08`. **Distância 55 no canal mais afastado.**

E medi o CSV inteiro: os únicos graus presentes nas 233 linhas de dados são
`FOTO` e `SEM-HEX`. **Não há uma única linha `MEDIDO`** — o cabeçalho descreve
o grau `MEDIDO`, mas nenhum dado o usa.

Ou seja: **o CSV, hoje, é uma fonte de qualidade INFERIOR ao `TONS` para a única
linha que alguém realmente mediu.** Derivar `TONS` do CSV agora trocaria a
medição dela por uma amostragem de foto de estúdio — e "não se apaga decisão
medida" é regra desta casa.

### 5.3 E os 21 hexadecimais mudariam TODOS

Comparei os 21 códigos, produto contra `casca_esq` do CSV. **Nenhum é igual.**
Distâncias (canal de maior diferença):

```
menores:  09 →14   ZB →16   Z3 →18   07 →20   ZA →22   00 →24
maiores:  Z2 →142  Z6 →172  Z1 →173  Z4 →208
```

As quatro maiores têm explicação: são edições com `acabamento=arte`, em que o
CSV descreve a **casca** (preta, `#1A1A1C`, no Fortnite e no The Last of Us) e o
`TONS` descreve a **impressão** que dá identidade ao aparelho. Não é um estar
certo e o outro errado — **são duas perguntas diferentes**, e a sprint dos tons
tem de decidir qual delas a borda do card responde. Essa é a pergunta de
desenho, e é dela.

### 5.4 O que a sprint dos tons vai precisar

- **Decisão dela** sobre qual zona pinta a borda (`casca_esq`? uma zona
  `identidade` nova? a maior área?), com foto antes/depois — são **21 bordas
  mudando de cor** na aba Configurações, `PROVA-DE-TELA-01`.
- **Uma regra para o SEM-HEX** que não invente cor (a hachura que o desenho já
  usa não cabe numa borda de 2px de GTK).
- **Preservar o `05` medido**, com o grau vencendo a fonte: `MEDIDO` > `FOTO`.
- **As 7 cores novas não têm tom nenhum no produto hoje** — e não é urgente:
  `cor_do_codigo` já faz `TONS.get(chave, "")` (`:215`), e `tom_para_a_borda("")`
  devolve `""` (provado em `test_config_06…:328`). **Cor nova sem tom nasce com
  nome e sem borda, e não quebra.** É o que torna a separação das duas sprints
  segura.

> **Requisito R6.** Esta sprint mexe em `NOMES_DE_FABRICA` e **não encosta em
> `TONS`**. As 7 novas entram com nome, sem tom, borda vazia. Nenhum pixel das
> 21 bordas de hoje muda — logo esta sprint **não precisa de foto antes/depois
> de borda**, só do texto das três linhas da seção 1.2.

---

## 6. O que a cura torna FALSO, e sai junto

"Vinte e uma" está escrito em **18 linhas, em 8 arquivos**. A cura torna as 18
falsas, e a regra desta casa é que fato errado sai de **todos** os lugares —
uma correção pela metade deixa as duas versões vivas.

```
4  src/hefesto_dualsense4unix/app/actions/external_controllers.py   :448 :455 :516 :547
3  src/hefesto_dualsense4unix/integrations/cor_do_plastico.py       :41 :121 :207
3  src/hefesto_dualsense4unix/app/widgets/external_card.py          :150 :177 :451
3  src/hefesto_dualsense4unix/app/widgets/campo_de_busca.py         :4 :13 :116
2  tests/unit/test_a_cor_dela_vence_e_nao_vaza_para_o_vizinho.py    :13 :80
1  tests/unit/test_o_lexico_da_aba_configuracoes.py                 :534
1  tests/unit/test_config_06_declaracao_nasce_em_nao_sei.py         :309
1  scripts/gui-captura/retratar_abas.py                             :1349
```

**Atenção às duas de `test_a_cor_dela…`**: elas falam de "vinte são aproximadas"
e do `05` como "a única das vinte e uma" — isso é sobre `TONS`, que esta sprint
**não** toca. Essas duas continuam verdadeiras e **não devem** ser mexidas aqui.
São 16 linhas a corrigir, não 18.

> **Requisito R7.** Nenhuma das 16 vira "vinte e oito" escrito à mão. O número
> que a prosa cita passa a ser "as cores de fábrica que o CSV conhece", ou o
> `len()` calculado — senão a sprint das próximas cores reabre este mesmo item.

---

## 7. A mudança visível, e o que ela precisa aprovar

O campo de busca de cor (`campo_de_busca.py`) lista `cores_para_busca()`
(`external_controllers.py:512`), que é `NOMES_DE_FABRICA` + "Outra" + "Não sei".

```
hoje:    21 + 2 = 23 linhas
depois:  28 + 2 = 30 linhas
```

A busca é por digitação, sem popup ao focar (`campo_de_busca.py:116`), então o
card **não cresce** — a altura não depende do tamanho da lista. Foi exatamente
para isso que a busca substituiu a grade de seis botões.

**O que precisa do olho dela:**

1. os **três nomes trocados** da seção 1.2 (texto de tela, `PROVA-DE-TELA-01`);
2. a **dica** das três HyperPop (requisito R5) — "Cor de catálogo do DualSense.";
3. se `Limited Edition` / `Special Edition` entra por extenso na linha da busca,
   ou se o nome curto basta. Quatro dos sete novos têm o sufixo, e três dos
   nomes atuais não têm — a lista fica **inconsistente** se ninguém decidir.

**O que NÃO precisa:** as bordas dos cards. Requisito R6 garante que nenhuma
muda.

---

## 8. A ordem de execução

| # | entrega | bloqueia |
|---|---|---|
| 0 | Decidir `Z1`/`Z2`/`ZB` contra a fonte externa; corrigir o lado errado | 1 |
| 1 | `scripts/gerar_nomes_de_fabrica.py` + `--check`; gera `integrations/nomes_de_fabrica.py` e a cópia do ensaio (R3, R4) | 2, 3 | <!-- ref-externa: arquivo que ESTA sprint propõe criar; a ausência é o assunto -->
| 2 | `cor_do_plastico.py` importa e reexporta; `TONS` intocado (R6) | 3 |
| 3 | Coluna `familia` no CSV; `_CODIGOS_DE_CATALOGO` deriva (R5) | 4 |
| 4 | `tests/unit/test_uma_lista_de_cor_so.py` (R1, R2, R3) + entrada no `portoes.sh` **e** no `ci.yml` | 5 | <!-- ref-externa: arquivo que ESTA sprint propõe criar; a ausência é o assunto -->
| 5 | As 16 linhas da seção 6 (R7) | — |
| 6 | Foto antes/depois da busca; a palavra dela nos três itens da seção 7 | — |

**A entrega 2 encosta em `cor_do_plastico.py`, onde há leva em voo.** Ela só
começa depois que aquela leva fechar — e como a entrega 1 não toca o arquivo, a
sprint pode começar sem esperar.

---

## 9. O que eu NÃO medi

- **Não conferi os nomes das 7 novas contra a Sony.** Eles saem do CSV, e o CSV
  os traz com `fonte=pesquisa-externa-27-08`. Se o CSV estiver errado sobre um
  deles, esta sprint propaga o erro **com portão**, que é pior que sem: o
  portão passa a defender o nome errado. A entrega 0 cobre `Z1`/`Z2`/`ZB`
  porque **ali há duas fontes discordando**, que é sinal; nas sete não há
  segunda fonte para discordar, e isso não é o mesmo que estarem certas.
- **Não medi o tempo de import real do módulo**, só do parse do CSV isolado.
- **Não abri a aba Configurações.** As 23→30 linhas da seção 7 saem da leitura
  do código, não de foto.
