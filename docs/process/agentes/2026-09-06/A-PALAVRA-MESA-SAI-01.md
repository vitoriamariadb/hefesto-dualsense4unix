# A-PALAVRA-MESA-SAI-01 — a tela fala de controles, não de "mesa"

**06/09/2026** · branch `voo/A-PALAVRA-MESA-SAI-01-E`, nascida de `onda/atual-0609`
· **44 portões verdes** · a última sprint de tela das 24 horas.

> Ela, 06/09/2026: *"Falei do termo mesa que é horrível. Mas os claudes
> anteriores entraram na pira de usar isso em tudo no layout. O termo sai e
> coloca-se termos simples pro user comum. feature fica."*

**Nada de feature saiu.** Nenhuma tabela, contagem, aviso ou botão mudou de
comportamento. Trocaram-se **52 frases**, em 56 lugares (uma delas mora em
cinco), e mais nada.

---

## 1. O NÚMERO, antes e depois

### 1.1 O que a pessoa LÊ nas dez páginas da bancada — o número que decide

```bash
source .envrc-voo
python src/hefesto_dualsense4unix/interface/olhar.py --palavra mesa
```

| | antes | depois |
| --- | ---: | ---: |
| **texto lido nas dez abas** | **34** | **0** |

A saída completa do "antes", com contexto e origem, está em
`docs/process/agentes/2026-09-06/A-PALAVRA-MESA-SAI-01-antes.txt` (o Passo 1 da
sprint). O "depois" é o mesmo comando, e ele imprime dez linhas de
`0 ocorrência(s)` e `rc=0`.

### 1.2 Por que 34 e não 194 — a contagem crua não é a tela

```bash
grep -oiE "\bmesa\b" mockup/??-*.html | wc -l   # 194 antes  ·  160 depois
```

As 194 do despacho classificadas uma a uma (`grep` não separa; o `ast`/parser
separa):

| onde | quantas | o que é | mudou? |
| --- | ---: | --- | --- |
| comentário de **CSS** | 121 | prosa da casa dentro de `<style>` | **não** |
| comentário de **HTML** | 14 | idem, dentro de `<!-- -->` | **não** |
| **nome** em tag | 16 | `mesa-notas`, `mesa-frase`, `radio-mesa`, `name="mesa"`, `nav-mesa`, `perfil-da-mesa` | **não** |
| dentro de `<code>` | 9 | `monta.MESA`, `MESA`, `mesa` (a chave do pacote) | **não** |
| **texto lido** | **34** | frases | **as 34** |

Os 34 saíram, e a queda de 194 → 160 é exatamente eles. **O glossário manda o nome interno
ficar** (`mesa_viva.py`, `app/mesa.py`, `monta.MESA`, `MESA_VAZIA`), e uma régua
que reprovasse as 194 mandaria a próxima pessoa renomear arquivo — que é
estrago, não cura. Foi o que a §1 da GTK-3 já cobrou desta casa.

### 1.3 O que o piloto ESCREVE por tique — e a página estática não mostra

Nenhuma das frases abaixo aparece no HTML: elas nascem em execução, no recado do
cartão. Medidas pelo `ast` sobre os literais dos dez pacotes:

| | antes | depois |
| --- | ---: | ---: |
| **literais de tela nos dez pacotes** | **23** | **0** |

(23 literais, 24 trocas: um deles — `a05_vibracao.py:914` — dizia a palavra
duas vezes na mesma frase.)

**Era aqui que morava a maior parte do trabalho de verdade.** *"este controle
saiu da mesa"* estava em **cinco** lugares de `a02_controles.py` com a régua da
página verde — porque um recado só existe quando o gesto falha.

---

## 2. A RÉGUA NOVA, e a MORDIDA

`tests/unit/test_a_palavra_mesa_nao_chega_a_tela.py` — cinco testes, duas
réguas com pontos cegos diferentes de propósito:

1. **as dez páginas da bancada**, pelo texto lido (`texto_visivel`);
2. **os dez pacotes**, pelos literais que não são docstring (`ast`);
3. o **contrato da borda de palavra** (o glossário em forma de teste: `mesa`
   sai, `mesa_viva.py` fica);
4. `primeiro_trecho_banido` consultando as **duas** listas;
5. o **stripper**: a dica do `?` (`title=`) não escapa, e o tamanho da string
   não muda — senão a linha que a régua reporta é a linha de outro lugar.

O dono da lista ganhou `PALAVRAS_BANIDAS`, `palavra_banida_em`, `texto_visivel`
e `primeiro_trecho_banido` em
`src/hefesto_dualsense4unix/interface/frases_que_ela_baniu.py`.

### A MORDIDA — feita, não afirmada

**Mordida 1 — a palavra volta a uma frase de tela do gerador `aba05.py`:**

```
E   AssertionError: palavra banida LIDA na tela (mesa):
E       05-vibracao.html:3404: Os quatro controles da mesa, um por coluna,
E       sempre à vista — na mesma ordem da fita do topo, cada um com a sua cor
E       de plástico na borda do desenho.
```

**Mordida 2 — a palavra volta a um recado de tique do pacote `a02_controles.py`:**

```
E   AssertionError: palavra banida num literal de pacote — ela chega à tela
E   pelo tique:
E       a02_controles.py:2796: o daemon não confirmou o mudo do microfone — ou
E       o Hefesto está parado, ou este controle saiu da mesa, ou o Hefesto
E       instalado é mais velho que esta janela e ainda não sabe ligar o
E       microfone e o canal dele num ato só
```

As duas nomeiam **arquivo, linha e a frase inteira** — a entrega de uma régua é
o endereço do defeito, não o número dele. A cura foi devolvida e as duas voltam
a passar.

### A régua do stripper foi conferida contra o NAVEGADOR

Um stripper que ninguém confere é a armadilha do `COMO-OLHAR-A-TELA.md`. O
`texto_visivel` foi medido contra o `innerText` de um Chrome de verdade
(Playwright, `--headless`) nas quatro abas fotografadas: **13 · 6 · 6 · 3** nos
dois instrumentos, número por número.

---

## 3. A FOTO — antes e depois

**Chrome headless, sem janela na sessão viva.** A palavra **não aparecia dentro
da `.janela`**: as 34 estavam na **legenda do mockup** (`.nota`, que mora fora
da moldura e que o `olhar.py` esconde ao fotografar a janela). Por isso a foto
que prova é a da legenda, e não a da janela — fotografar a janela mostraria duas
imagens idênticas, que é foto que não prova nada.

| aba | antes | depois |
| --- | ---: | ---: |
| `02-controles` | 13 | **0** |
| `10-perfis` | 3 | **0** |

* `A-PALAVRA-MESA-SAI-01-antes-02-controles.png` / `-depois-02-controles.png`
* `A-PALAVRA-MESA-SAI-01-antes-10-perfis.png` / `-depois-10-perfis.png`

As dez janelas foram refotografadas depois (`olhar.py --todas`): as dez medem
`1180x777`, nenhuma passou da dobra e nenhuma ganhou rolagem lateral.

---

## 4. AS FRASES TROCADAS, uma a uma

### 4.1 A legenda dos dez mockups (os geradores `abaNN.py`)

| arquivo | dizia | passa a dizer |
| --- | --- | --- |
| `aba01.py` | Quatro controles **na mesa**, um cartão cada | Quatro controles **ligados**, um cartão cada |
| `aba01.py` | o que deixa **a mesa inteira** num relance | o que deixa **todos os controles** num relance |
| `aba01.py` | a escolha é por controle; **a sua mesa hoje é** DualSense nos quatro | a escolha é por controle; **os seus quatro hoje são** DualSense |
| `aba01.py` | a máscara viva é uma só para **a mesa toda** | a máscara viva é uma só para **todos os controles** |
| `aba02.py` | poses diferentes **na sua mesa** (25° de diferença) | poses diferentes (25° de diferença) |
| `aba02.py` | medido hoje **na sua mesa**, 148 × 203 | medido hoje **com os seus controles**, 148 × 203 |
| `aba02.py` | 148 × 83 **em qualquer mesa** | 148 × 83 **com quantos controles houver** |
| `aba02.py` | mudava de tamanho **com a mesa** (181 px com os seus dois controles…) | mudava de tamanho **com o número de controles** (181 px com os seus dois…) |
| `aba02.py` | valendo para **a mesa toda** — … com 4 controles **na mesa** mente sobre 3 | valendo para **todos** — … com 4 controles **ligados** mente sobre 3 |
| `aba02.py` | O Calibrar ficou onde estava, e **virou gesto de mesa** | O Calibrar ficou onde estava, e **passou a valer para todos os controles** |
| `aba02.py` | *(citação dela de 31/08 com a palavra)* | **desceu para comentário** — ver §4.3 |
| `aba02.py` | o nome mais longo **da mesa** | o nome mais longo **dos quatro** |
| `aba02.py` | Se um dia **a mesa crescer** a ponto de o card não caber | Se um dia **entrar mais controle** a ponto de o card não caber |
| `aba02.py` | Um laço só, sobre **a mesma mesa** | Um laço só, sobre **a mesma lista** |
| `aba02.py` | no dia em que **a mesa tiver** três ou cinco | no dia em que **forem** três ou cinco |
| `aba02.py` | Com 4 **na mesa** o P3 já aparece em 31% | Com 4 **ligados** o P3 já aparece em 31% |
| `aba03.py` | no dia em que **a mesa tiver** três ou cinco | no dia em que **forem** três ou cinco |
| `aba04.py` | Um número **fora da mesa** | Um número **que ninguém está usando** |
| `aba04.py` | pôr um DualSense no 5 com **a mesa em 4** | pôr um DualSense no 5 com **quatro ligados** |
| `aba05.py` | Os quatro controles **da mesa**, um por coluna | Os quatro controles, um por coluna |
| `aba05.py` | ela percorre **a mesa** | ela percorre **a lista** |
| `aba06.py` | A coluna do desenho **virou a mesa** | A coluna do desenho **passou a mostrar todos** |
| `aba06.py` | o aparelho é sempre o que está **na mesa** | o aparelho é sempre o que está **ligado** |
| `aba06.py` | O que **a mesa de quatro** revelou | O que **os quatro controles** revelaram |
| `aba06.py` | Com um controle **na mesa** ninguém podia ver isso | Com um controle **ligado** ninguém podia ver isso |
| `aba06.py` | Pus **a mesa** no lugar do desenho único | Pus **os quatro** no lugar do desenho único |
| `aba08.py` | As duas janelas **da mesa** entraram na tela | As duas janelas **do gabinete** entraram na tela |
| `aba08.py` | A cena é a **SUA mesa** | A cena é o **SEU gabinete** |
| `aba08.py` | O global é o **da mesa**, e ele MUDOU DE ABA | O global **vale para todos os controles**, e ele MUDOU DE ABA |
| `aba10.py` | O que mudou com quatro controles **na mesa** | O que mudou com quatro controles **ligados** |
| `aba10.py` | com o que leu **da mesa** | com o que leu **dos controles** |
| `aba10.py` | O cabeçalho conta **a mesa** | O cabeçalho conta **os controles** |

### 4.2 O que o piloto escreve por tique (os pacotes `aNN_*.py`)

| arquivo | dizia | passa a dizer |
| --- | --- | --- |
| `a01_jogar.py` | o exame **da mesa** não respondeu (…) | o exame **dos controles** não respondeu (…) |
| `a01_jogar.py` | Há N controles **na mesa** e esta tela mostra L | Há N controles **ligados** e esta tela mostra L |
| `a01_jogar.py` | `coop.sync` reconcilia **uma mesa** já reconciliada | `coop.sync` reconcilia **uma lista** já reconciliada |
| `a02_controles.py` **(×5)** | …ou este controle **saiu da mesa** | …ou este controle **se desligou** |
| `a04_iluminacao.py` | A troca acontece entre dois controles, e **a mesa tem** N agora | A troca acontece entre dois controles, e **há** N agora |
| `a04_iluminacao.py` | os números que existem **na mesa** | os números que existem **agora** |
| `a04_iluminacao.py` | este **lugar da mesa** está sem controle | este **lugar** está sem controle |
| `a04_iluminacao.py` | este controle não está **na mesa** agora | este controle não está **ligado** agora |
| `a04_iluminacao.py` | pedido de reconciliar **a mesa** | pedido de reconciliar **os controles** |
| `a05_vibracao.py` | este controle **saiu da mesa** entre o clique e agora | este controle **se desligou** entre o clique e agora |
| `a05_vibracao.py` | mandar assim faria **a mesa inteira tremer** | mandar assim faria **todos tremerem** |
| `a05_vibracao.py` | sem alvo **a mesa inteira tremeria** | sem alvo **todos tremeriam** |
| `a05_vibracao.py` | sem mira a vibração iria **para a mesa inteira** | sem mira a vibração iria **para todos** |
| `a05_vibracao.py` | a força … é do PERFIL — **não da mesa** | a força … é do PERFIL — **não de todos** |
| `a08_conexoes.py` | este adaptador não está mais **na mesa** | este adaptador não está mais **ligado** |
| `a08_conexoes.py` | a luz é de um aparelho, **não da mesa** | a luz é de um aparelho, **não de todos** |
| `a08_conexoes.py` | a tela tem o lugar e **a sua mesa tem** N item(ns) | a tela tem o lugar e **há** N item(ns) |
| `a09_sistema.py` | não consegui gravar **o perfil da mesa** | não consegui gravar **o Perfil de Bateria** |
| `a10_perfis.py` | dois controles estão no lugar P{n} **da mesa** | dois controles estão no lugar P{n} |
| `a10_perfis.py` | e nenhum controle **na mesa** para acender | e nenhum controle **ligado** para acender |

**De que dono veio a palavra nova.** Nenhuma foi inventada: *ligado* · *todos*
· *os controles* · *P1 e P2* estão na §1 do
[glossário](../../../A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md);
**Perfil de Bateria** foi lido do dono (`gui/aba_conexoes.CASA_DO_TETO_GLOBAL`),
que já é o nome que a aba 08 publica, e que é **palavra dela**, 28/08:
*"Teto da Vibração, que na verdade é Perfil de Bateria"*.

### 4.3 A citação dela — não se apagou, mudou de lugar

A legenda da aba Controles citava, **na tela**, a ordem com que ela renomeou o
botão em 31/08: *"o calibrar sensores de movimento, ao invés de mesa"*.

A citação é dela e não se apaga; mas é justamente a palavra que ela mandou tirar
da tela — e um mockup que devolve a palavra dela para ela mesma, citando-a,
ainda é a palavra na tela. Ela desceu para **comentário** em `aba02.py`, com a
data e a razão, que é onde esta casa guarda lápide: *comentário não chega a tela
nenhuma* — a mesma isenção que `aba01.py` já tem no
`test_a_frase_que_ela_baniu_nao_chega_a_tela.py`. Na tela ficou o que a ordem
PRODUZIU: o rótulo **Calibrar Sensores de Movimento**, que está lá.

**A régua não precisou de isenção nenhuma.** Zero exceções declaradas.

---

## 5. O QUE NÃO FOI CURADO, e é RELATO

### 5.1 DEZESSEIS frases de `app/` ainda dizem a palavra — e chegam à tela

`app/` está no `nao_toca` desta sprint. As duas que o despachante já varreu
(a frase da ponte vazia e a linha de origem) estão curadas; **estas dezesseis
não**, e o alcance de algumas passa da interface nova — a aba Perfis e a janela
GTK leem o mesmo motor.

| arquivo:linha | a frase |
| --- | --- |
| `app/actions/config/mixin.py:34` | Aqui os ajustes valem para **a mesa inteira** — não há controle a escolher. |
| `app/actions/config/secao_controles.py:126` | …não dá para saber quais controles estão **na mesa**. |
| `app/actions/config/secao_mesa.py:1779` | Foi você quem desenhou **esta mesa**: este aparelho está na entrada {n}. |
| `app/actions/config/secao_mesa.py:1788` | **Mesa**: {faces} faces, {entradas} entradas, {colocados} aparelhos colocados. |
| `app/actions/jogar/painel.py:377` | …não o religa sozinho nem com dois controles **na mesa**. |
| `app/actions/jogar/painel.py:384` | …quando vir dois controles **na mesa**. |
| `app/actions/lightbar_actions.py:103` | Ainda não sei quais controles estão **na mesa** — espere um instante… |
| `app/actions/lightbar_actions.py:128` | O mesmo desenho foi para os {n} controles **da mesa**. |
| `app/actions/perfis_web.py:329` | …esta tela não sabe quais controles estão **na mesa**… |
| `app/actions/rumble_actions.py:478` | …ele vale para **a mesa toda**, nunca para um só. |
| `app/alvo_de_edicao.py:86` | não há controle **na mesa** |
| `app/ipc_bridge.py:760` | Este controle não está **na mesa** agora — só quem está ligado tem número |
| `app/ipc_bridge.py:807` | O arquivo com o que você declarou sobre **a mesa** foi escrito por… |
| `app/ipc_bridge.py:847` | O desenho **da mesa** |
| `app/textos_de_aplicacao.py:251` | não está **na mesa** |
| `app/textos_de_aplicacao.py:294` | nenhum controle recebeu — não há controle **na mesa** |

**Duas delas têm régua que as digita**, e quem as curar tem de curar a régua no
mesmo commit: `tests/unit/test_a_ponte_privilegiada_recusa_entrada_suja.py:403`
e `tests/unit/test_lightbar_todos_o_desenho_de_cada_um.py:207` e `:227`.

**TRÊS GRUPOS FICAM DE FORA DA CONTA, e a razão de cada um:**
`app/widgets/mapa_da_mesa.py:637` (*"o rascunho do mapa ainda não monta a
mesa"*) é da janela GTK, que **sai** por decisão dela de 06/09;
`app/telas/vibracao.py:185`, `:190` e `:215` são o **livro-razão da paridade**
(*"Fecha: MIGRA-VIBRACAO-04"*), prosa da casa, não tela; e
`app/actions/jogar/painel.py:264` (`ESCRITOR_DOS_MODOS`) é documentação-como-
dado, cheia de crase e de nome de IPC — **mas eu não segui o consumidor dela até
o fim**, e se ela alimentar uma dica é a décima sétima. Confira antes de
declarar fechado.

### 5.2 O funil de execução NÃO adotou a palavra — e a razão é medida

A sprint pedia que a função de consulta passasse a olhar as duas listas.
`primeiro_trecho_banido` faz isso e está pronta. **`hefesto_vivo._json` continua
chamando só `frase_banida_em`**, e isso foi decidido depois de medir, não por
esquecimento:

* o `_json` **levanta** `ValueError`, e é o funil por onde TODO valor passa a
  caminho do WebView;
* **sete pacotes emitem a chave `"mesa"` a cada tique** (`{"mesa": {campo:
  valor}}`) — essa a régua já isenta, pelo formato de chave JSON;
* mas as **dezesseis frases de `app/`** acima passariam por ali. Um funil que
  levanta sobre frase que ninguém desta posse pode curar troca uma palavra feia
  por uma **janela morta**.

**O que fecha:** curar as dezesseis no dono e trocar, no `_json`, `frase_banida_em`
por `primeiro_trecho_banido` — uma linha. Está declarado em
`_SEM_CAMINHO_HOJE` do portão `casa-sabe`, com o endereço de cada uma.

### 5.3 `interface/paginas/` — o que o produto renderiza — ainda tem a palavra

**Por desenho.** `--publicar` é ato dela, e a leva publica de uma vez no fecho.
Medido agora, com o mesmo instrumento apontado para o outro lado:

```
olhar.py --palavra mesa               → 0  ocorrência(s)  (bancada)
olhar.py --palavra mesa --publicado   → 34 ocorrência(s)  (o produto)
```

**A régua mede a bancada de propósito** — apontá-la para o publicado a deixaria
vermelha até a publicação, que é o inverso do que uma régua serve. Depois do
`--publicar`, o segundo comando vai a zero sozinho: são os mesmos dez arquivos.

**As frases de tique (§4.2) NÃO esperam publicação**: são Python, e já valem.

---

## 6. OS PORTÕES E A SUÍTE

```
git add -A && bash scripts/portoes.sh
→ TODOS VERDES — 44 portões.
```

E a suíte, nos **doze lotes**:

```
ls tests/unit/test_*.py | sort > /tmp/todos.txt && split -n l/12 -d …
→ 18.371 testes · 2 vermelhos, e os DOIS são da base (abaixo)
```

Dois portões ficaram vermelhos na primeira volta, e os dois eram meus:

1. **`casa-sabe`** — `texto_visivel` e `primeiro_trecho_banido` nasceram
   públicas sem chamador em produção. Declaradas, com evidência, nas duas listas
   certas: a primeira em `_NAO_E_PROMESSA` (é a LEITURA de uma régua, e o produto
   nunca lê a própria página — ele a escreve), a segunda em `_SEM_CAMINHO_HOJE`
   (§5.2).
2. **`ruff`** — `SIM102` no teste novo. Corrigido.

### OS DOIS vermelhos da suíte que NÃO são meus

Os dois estão na base — a costura `68a8a7e` — e os dois ficaram fora dos 44
portões, que é por si só o achado: **portão verde e suíte vermelha ao mesmo
tempo, no mesmo commit.**

#### 1. As sete citações `arquivo:linha` que envelheceram

`test_portao_o_par_com_metade_ligada.py::TestTodaCitacaoDeLinhaConfere` acusa
**7 endereços de linha** em `src/` apontando para outro lugar — `a06_navegacao`,
`a09_sistema` e `a10_perfis` citando `hefesto_vivo.py:2618` e `:3721` (o arquivo
tem 3665 linhas), e três âncoras internas fora de lugar.

**A PROVA DE QUE NÃO SÃO MEUS, e ela é aritmética, não opinião:** citação de
linha só quebra quando alguém MOVE linha. Medido arquivo por arquivo contra o
`HEAD`:

| arquivo | linhas em `HEAD` | linhas agora | o que mudei |
| --- | ---: | ---: | --- |
| `pacotes/a06_navegacao.py` | 3597 | 3597 | **nada** |
| `pacotes/a09_sistema.py` | 2902 | 2902 | 1 palavra, na mesma linha |
| `pacotes/a10_perfis.py` | 3299 | 3299 | 2 palavras, nas mesmas linhas |
| `interface/hefesto_vivo.py` | 3665 | 3665 | **nada** (é `nao_toca`) |

E a âncora que o teste nomeia, `_recusou_dizendo`, está na **linha 2288 nos
dois** — `HEAD` e agora. **Nenhuma linha se moveu**, logo as sete já apontavam
para o lugar errado antes de eu chegar. Os três arquivos meus que MUDARAM de
tamanho — `aba02.py` (+13, a lápide), `frases_que_ela_baniu.py` (+170) e
`olhar.py` (+85) — não são citados por linha em `src/` por ninguém: conferido
com `grep -rnE "(frases_que_ela_baniu|olhar|aba02)\.py:[0-9]+" src/`, e as seis
citações a `aba02.py` que existem são todas **acima** da linha 2525, onde a
lápide entrou.

#### 2. As fotos do README atrás do código da tela

`test_as_fotos_acompanham_a_versao.py::test_as_fotos_nao_ficam_atras_do_codigo_da_tela`
reprova, e ele **já reprovava antes de eu tocar em nada**: a própria mensagem
nomeia o commit `68a8a7e` — a costura de hoje, que é a BASE desta branch — e as
fotos de `docs/usage/assets` de `7e823e3`, que veio antes. As ondas de hoje
mexeram na interface depois da última refotografia.

**Não o fechei de propósito**, e a razão é ordem de operações: quem tira essas
fotos é `interface/olhar.py --todas --publicado --doc`, que fotografa
`interface/paginas/` — o **publicado**. Refotografar agora publicaria imagens
que ficariam velhas no minuto seguinte, quando a leva publicar. **É um passo do
fecho, depois do `--publicar`, e são dez segundos.** Ele não está entre os 44
portões.

### As TRÊS réguas ajustadas, e é consequência direta da cura

Três réguas DIGITAVAM a frase antiga e caíram junto com ela. Nas três, a
asserção passou a cobrar a frase nova, e o FATO medido é o mesmo:

| régua | cobrava | cobra |
| --- | --- | --- |
| `test_a_04_o_trilho_de_brilho_grava.py:496` | `match="não está na mesa"` | `match="não está ligado agora"` |
| `test_a05_a_vibracao_aplica_e_fala.py` (4 asserções, 7 casos) | `"saiu da mesa"` | `"se desligou"` |
| `test_aba10_o_slider_e_o_estilo_gravam.py:437` | `"nenhum controle na mesa"` | `"nenhum controle ligado"` |

**Os NOMES dos testes ficam** (`test_controle_fora_da_mesa_recusa_dizendo`,
`test_o_controle_que_saiu_da_mesa_fala_sem_dizer_o_endereco`,
`test_mesa_vazia_ainda_ajusta_gatilho_e_vibracao`): `mesa` é a palavra da casa,
e nome de teste não é tela. Trocá-los seria o `sed` em massa que a §1 da GTK-3
proíbe.

**Nenhuma das três está entre os 44 portões.** A primeira eu achei procurando
no fonte quem digitava a frase; **as outras duas quem achou foi a SUÍTE**, no
primeiro e no segundo lote — com os portões todos verdes. É o argumento de
sempre para os doze lotes, e vale repetir porque o custo dele é uma hora.

---

## 7. O QUE EU NÃO VERIFIQUEI

* **A tela dela, com o daemon vivo.** As frases de tique (§4.2) são recados de
  falha: só aparecem quando o gesto é recusado. Não montei bancada para
  provocar as vinte e quatro recusas uma a uma — provei que a frase mudou no
  fonte e que a régua morde, não que cada recado apareceu na tela dela.
* **`interface/paginas/`** — não publiquei (§5.3), e não olhei o produto
  renderizado depois da mudança.
* **A janela GTK.** Não a abri: ela sai por decisão dela de 06/09, e o `app/`
  não é desta posse.
* **A mensagem de console dos geradores** (`OK, 51 divs · mesa de 2
  conectado(s)…`) continua dizendo a palavra. Não é tela: é saída de terminal
  para quem regenera, e o glossário deixa a casa falar assim. Fica dito porque
  quem rodar os geradores vai ler a palavra ali.
* **Os nomes de classe CSS e de campo** (`mesa-notas`, `mesa-frase`,
  `radio-mesa`, `nav-mesa`, `perfil-da-mesa`, `name="mesa"`) não mudaram, por
  ordem da sprint (§3, *"os nomes internos ficam"*). Renomear identificador é
  outra sprint, e não foi pedida.
* **A suíte inteira** foi rodada em doze lotes ao fim, mas quem decide a
  integração são os portões — e a suíte é de quem coordena.

---

## 8. RECADOS PARA QUEM COSTURA

1. **Publique as dez.** A bancada está a zero e o produto não. `--publicar` é
   ato dela; a divergência das dez páginas em `mockup/DIVERGENCIAS.md` é do
   coordenador (decisão 3 do plano), e `DIVERGENCIAS.md` está no meu `nao_toca`.
2. **As dezesseis de `app/` (§5.1) são a próxima sprint**, e ela é barata: as
   frases estão com endereço, o vocabulário está no glossário e as duas réguas
   que as digitam estão nomeadas. Fechá-las libera a linha do `_json` (§5.2) —
   e aí o funil de execução passa a recusar a palavra em tempo real, que é a
   guarda que falta.
3. **A régua nova é a terceira do módulo**, não substitui nenhuma: as duas de
   frase (estática e de execução) continuam de pé, intactas. `frase_banida_em`
   não mudou uma vírgula de contrato — de propósito.
4. **Se alguém adicionar uma segunda palavra banida**, o caminho é uma linha em
   `PALAVRAS_BANIDAS` e mais nada: a borda de palavra, a isenção do nome
   interno, o stripper e as duas réguas já são genéricos.
5. **Dois vermelhos da suíte esperam a costura, e nenhum é de código novo**
   (§6): as **sete citações `arquivo:linha`** que envelheceram na base, e as
   **fotos do README** atrás do código da tela. O segundo fecha com
   `interface/olhar.py --todas --publicado --doc` DEPOIS do `--publicar`. Os
   dois já estavam vermelhos no `68a8a7e` **com os 44 portões verdes** — e essa
   é a pergunta que sobra para quem coordena: se dois portões da suíte medem
   coisa que a lista de portões não roda, o piso de 44 tem furo por onde eles
   passam.
