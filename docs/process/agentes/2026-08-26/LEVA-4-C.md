# LEVA-4-C — As três réguas que guardam o endereço de rádio e o anonimato

Árvore `voo/LEVA-4-C`. Três consertos, três commits. Os três defeitos da ordem
**existiam**, e os três foram medidos antes da cura.

| commit | o quê |
|---|---|
| `eb621bf9` | `fix(endereço-de-rádio): a listagem enxerga arquivo novo, e o SVG deixa de ser esconderijo` |
| `c15a8e26` | `fix(anonimato): o -i volta ao ramo do git, e o ruído medido é isento por casamento` |
| `f655dbc7` | `fix(dados-de-teste): a allowlist filtra por casamento, e a varredura deixa de ser allowlist de duas extensões` |

---

## O que mudou

### 1. `scripts/check_endereco_de_radio.py` — dois pontos cegos, e a docstring mentia sobre um

A docstring afirmava, em prosa, que a cicatriz `ANONIMATO-CEGO-A-ARQUIVO-NOVO-01`
estava curada aqui — *"A LISTAGEM é `git ls-files` + leitura, NUNCA `git grep`"*.
A chamada real era `git ls-files -z` **pelado**, que enxerga só o ÍNDICE: a
mesma cegueira do `git grep` que o parágrafo dizia ter evitado. Trocar a BUSCA
pela LISTA não bastava; o que cura é a LISTA trazer o arquivo novo.

**Medido antes da cura, na própria árvore**, com um endereço de aparência real
num arquivo recém-escrito:

```
--- sem git add:
OK: nenhum endereço de rádio real em arquivo versionado.   rc=0
--- com git add:
FALHA: 1 endereço(s) de rádio REAL em arquivo versionado.
  docs/_medicao_l4c.md:1: MAC real    <o endereço>          rc=1
```

Cura copiada do irmão autoritativo `tests/unit/test_docs_mac_anonimato.py`
(função `_tracked_files`, cicatriz `ANONIMATO-CEGO-A-ARQUIVO-NOVO-02`, de
15/08): `--cached --others --exclude-standard`.

**E `.svg` saiu do `EXCLUIR_SUFIXO`.** Ele estava ao lado de `.png` e `.zip`,
mas SVG é XML de texto puro: são **49 arquivos versionados** nesta árvore, e
`file --mime-encoding` diz 46 utf-8 + 3 us-ascii, nenhum binário. Enquanto o
sufixo estava na lista, um endereço dentro de um SVG passava **mesmo já
commitado** — não era cegueira a arquivo novo, era buraco permanente. A
companhia do `.png` era analogia, não medição: em PNG doze hexadecimais são
bytes comprimidos casando por acaso; num SVG são caracteres que alguém digitou.

A docstring foi **substituída**, não anotada — era fato errado, não decisão
medida.

### 2. `scripts/check_anonymity.sh` — o `-i` de volta, e o ruído isento por CASAMENTO

O `grep` do ramo do **git** não levava `-i`, e a regex `FORBIDDEN` é toda
minúscula. Como ninguém escreve nome próprio em minúscula, maiúscula era
esconderijo. A suíte não via porque o teste que cobria o caso
(`test_ainda_pega_o_modelo_composto`) exercita o ramo de **fallback**, que
nunca perdeu o `-i`.

O `-i` voltou. Junto com ele, uma isenção do ruído medido — e a isenção é
**por casamento, nunca por linha**: um `grep -v` descartaria a linha inteira, e
uma violação de verdade sairia de carona com o ruído. O que a função
`_filtrar_ruido_medido` faz é apagar o TRECHO isento da linha e perguntar de
novo; se ainda casa, reprova.

**FATO ERRADO, SUBSTITUÍDO.** O comentário do script dizia *"25 reprovações em
7 arquivos, e TODAS são a mesma coisa"*. Remedido hoje, no `dev` **e** na
árvore da leva, com o mesmo comando que o script roda (`git ls-files --cached
--others --exclude-standard` + `grep -HnIiE`), os dois deram idêntico:

```
arquivos varridos: 1569
hits com -i:       59
arquivos distintos: 27
```

São **59 acusações em 27 arquivos**, e são **DUAS famílias**, não uma. Zero
violação real nas duas:

1. **o literal `CLAUDE.md`** — 56 acusações em 26 arquivos. É o NOME de um
   arquivo, citado por quem escreve sobre as regras da casa
   (`test_portoes_da_casa_estao_ligados_no_ci.py` sozinho responde por 21). O
   arquivo é proibido de ser versionado; o nome dele, não.
2. **`feito por ela`** — 3 acusações, todas em `docs/data/ensaios.csv`
   (linhas 176, 177 e 178), na MESMA frase de ensaio: *"O par foi feito POR
   ELA, fechando a Steam no meio"*. É atribuição a uma PESSOA — o oposto do que
   o portão caça. O `\bfeito por\b` do regex nasceu para pegar "feito por uma
   IA", e continua pegando (há teste).

### 3. `scripts/check_test_data.sh` — a allowlist decidia sobre a LINHA

`grep -vE "$ALLOWED_MAC"` descarta a **linha**, não o **casamento**. Um
endereço real ao lado de um permitido sumia junto com o vizinho — e a companhia
não é acidente: a convenção desta casa é escrever o mascarado e o "antes" na
mesma linha, para explicar a máscara. **Medido**, com uma linha só:

```
tests/t.py:  PERMITIDO = "aa:bb:cc:11:22:33"; REAL = "<endereço de aparência real>"
$ bash check_test_data.sh
OK: dados de teste neutros.     rc=0
```

Os **dois** `grep -v` do bloco de e-mail (`test@example.com` e `noreply@`)
tinham o mesmo desenho e o mesmo buraco; viraram um `ALLOWED_EMAIL` filtrado
por casamento. A varredura passou a `grep -rEonI`, que devolve um casamento por
linha de saída, e duas funções (`_filtrar_macs_permitidos`,
`_filtrar_emails_permitidos`) decidem sobre o ENDEREÇO em vez da companhia
dele.

**E a allowlist de duas extensões virou denylist.** Era
`--include="*.py" --include="*.json"`. Aqui a medição corrige a ordem: hoje
`git ls-files tests/` devolve **py, json, js e bin**, e os dois últimos moram em
`tests/fixtures/`, que já estava fora. Ou seja — **nenhum arquivo desta árvore
escapava hoje**. O buraco é **LATENTE, não vivo**, e é por isso que atravessou
um mês sem sintoma: ele nasce no dia em que um `.yaml`, `.csv`, `.txt` ou
`.conf` de teste entrar em `tests/`. Allowlist de extensão erra em silêncio a
cada arquivo novo; denylist erra do lado do alarme falso, que se vê.

Custo da ampliação, medido: a varredura passou de 2 extensões para a árvore
inteira de `tests/` — **474 casamentos de MAC**, todos de família sintética
permitida, **zero acusação nova**. O portão fecha em 47 ms.

---

## Qual mordida prova

Todas do mesmo formato: cura no lugar → verde; cura **arrancada** → vermelho;
cura devolvida → verde. As três saídas estão coladas.

### `tests/unit/test_portao_endereco_de_radio_ve_arquivo_novo.py` (novo, 3 testes)

Com a cura:

```
...                                                                      [100%]
3 passed in 0.29s
```

**Cura arrancada** (volta o `git ls-files -z` pelado E o `.svg` no
`EXCLUIR_SUFIXO`):

```
FAILED test_portao_endereco_de_radio_ve_arquivo_novo.py::test_arquivo_novo_sem_git_add_e_pego
FAILED test_portao_endereco_de_radio_ve_arquivo_novo.py::test_svg_e_varrido
2 failed, 1 passed in 0.31s
```

O terceiro teste (`test_arquivo_que_o_gitignore_manda_ignorar_nao_reprova`)
guarda a OUTRA metade da cura e por desenho não morde neste arranque. Ele tem
mordida própria — arrancando **só** o `--exclude-standard`:

```
FAILED test_portao_endereco_de_radio_ve_arquivo_novo.py::test_arquivo_que_o_gitignore_manda_ignorar_nao_reprova
1 failed, 2 passed in 0.30s
```

### `tests/unit/test_check_anonymity.py` (+6 testes)

Com a cura: `30 passed in 0.84s`.

**Cura arrancada** (o `-i` volta a sumir do `grep` do ramo do git):

```
FAILED tests/unit/test_check_anonymity.py::test_maiuscula_nao_e_esconderijo
FAILED tests/unit/test_check_anonymity.py::test_maiuscula_de_provedor_nao_e_esconderijo
FAILED tests/unit/test_check_anonymity.py::test_a_isencao_e_por_casamento_e_nao_por_linha
FAILED tests/unit/test_check_anonymity.py::test_atribuicao_a_uma_ia_continua_reprovando
4 failed, 26 passed in 0.93s
```

Os seis testes exercitam o ramo do **git** (todos fazem `git init` + `git add`),
que é onde o defeito morava — nunca o fallback, que é o que enganou a suíte
por três semanas. Dois deles são a resposta contrária, porque régua que só sabe
recusar também não é régua: `test_o_nome_do_arquivo_de_regras_nao_e_violacao` e
`test_atribuicao_a_uma_pessoa_nao_e_violacao`.

O mais importante é `test_a_isencao_e_por_casamento_e_nao_por_linha`: planta uma
violação de verdade **na mesma linha** de um trecho isento e exige rc=1. É ele
que separa esta cura da preguiçosa.

### `tests/unit/test_check_test_data_nao_cega_por_vizinho.py` (novo, 7 testes)

Com a cura: `7 passed in 0.24s`.

**Cura arrancada** (voltam os `grep -v` de linha e o `--include` de duas
extensões):

```
FAILED test_check_test_data_nao_cega_por_vizinho.py::test_mac_real_na_linha_de_um_permitido_e_pego
FAILED test_check_test_data_nao_cega_por_vizinho.py::test_email_real_na_linha_de_um_permitido_e_pego
FAILED test_check_test_data_nao_cega_por_vizinho.py::test_extensao_fora_da_allowlist_antiga_e_varrida
3 failed, 4 passed in 0.26s
```

Os quatro que ficam verdes são as respostas contrárias — o caso simples que não
podia se perder, as duas famílias sintéticas que **têm** de passar (senão este
portão volta a contradizer o de anonimato, que é o
`BUG-GATE-TEST-DATA-CONTRADIZ-O-GATE-DE-ANONIMATO-01`) e `tests/fixtures/`, que
não podia ser ligada de carona.

### Uma nota sobre os três arquivos de teste

**Nenhum deles contém um endereço de seis grupos ou um e-mail proibido
LITERAL**, e isso é de propósito: os portões sob teste varrem `tests/`, e um
literal ali se acusaria. Todos são montados em tempo de execução a partir de
pedaços. O endereço plantado usa primeiro octeto `06` — faixa **localmente
administrada**, que a IEEE nunca atribui a fabricante, logo não existe unidade
no mundo com ele — e fica fora de todas as isenções dos dois portões.

---

## O que NÃO verifiquei

- **A suíte inteira.** Regra da leva: ela é de quem coordena e roda no fim, em
  oito lotes. Rodei só os três arquivos do meu escopo, por caminho.
- **`tests/unit/test_docs_mac_anonimato.py`** — é `NÃO TOCA` da minha ordem, e
  não o rodei. Ele varre por OUI e tem um `_SKIP_SUFFIXES` próprio; **não sei**
  se a saída do `.svg` do meu portão tem efeito lá (não deveria: são listas
  independentes, em arquivos diferentes).
- **O CI.** Rodei os portões locais; não abri `.github/workflows/ci.yml` nem o
  `release.yml`, que também chamam os três scripts. Nenhum dos três mudou de
  nome, de caminho ou de código de saída, então a chamada continua válida — mas
  isso é raciocínio, não medição.
- **O ganho real do `.svg`.** Nenhum dos 49 SVGs versionados contém endereço
  hoje (o portão fica verde com eles dentro). O que curei foi a **porta**, não
  um vazamento vivo.
- **`.btsnoop` e `.gz` dentro de `tests/`.** Pus os dois na denylist de extensão
  do `check_test_data.sh` por analogia com o portão de anonimato; não existe
  arquivo desses em `tests/` hoje, então a linha não foi exercitada.
- **Desempenho do filtro em bash** com uma árvore de `tests/` muito maior. Com a
  de hoje (474 casamentos), o portão fecha em 47 ms.

---

## O que sobrou para o próximo

**1. `ruff` já estava VERMELHO antes de mim, e continua — e o arquivo é
alheio.** Medido nos dois estados, com o comando exato do portão
(`ruff check src/ tests/`):

```
RUF012 Mutable default value for class attribute
   --> tests/unit/test_ambiente_presumido_01_o_que_a_maquina_nao_tem.py:166:20
Found 1 error.
```

Idêntico antes e depois dos meus três commits. Os meus quatro arquivos passam
(`All checks passed!`). **Não consertei**, porque o arquivo não é da minha
posse.

Rodei os **26** portões, não só o `--rapido`: `REPROVOU: 1 vermelho(s) de 26
-> ruff`. Os outros 25 estão verdes, incluindo os quatro que interessam a esta
frente — `anonimato` (4,0 s), `test-data` (52 ms), `endereco-de-radio` (2,0 s)
e `shellcheck` (11,9 s), este último porque dois dos três consertos são bash
novo.

**2. `.svg` ainda é esconderijo no `check_anonymity.sh` — a mesma família, o
outro arquivo.** A ordem me mandou tirar o `.svg` do
`check_endereco_de_radio.py`, e tirei. Mas o `check_anonymity.sh` tem `.svg`
em **DUAS** listas `PULA` — a da varredura binária de OUI e a da varredura de
serial de fábrica — pelo mesmo motivo errado ("três bytes casam por acaso em
dado comprimido"). SVG **não é comprimido**. Um serial de fábrica de 17
caracteres dentro de um `<text>` de SVG passa verde hoje. O arquivo é da minha
posse, mas o conserto não estava na ordem e mexe na varredura de serial, que
tem espelho declarado em `tests/unit/test_docs_mac_anonimato.py` (o `NÃO
TOCA`) — então **relato em vez de escrever**. É conserto de duas linhas, e
precisa da mordida correspondente no portão autoritativo.

**3. A "decisão dela" da `ANONIMATO-MAIUSCULA-01` foi TOMADA por mim, e ela
precisa saber.** O comentário registrava três caminhos possíveis e dizia que a
escolha era dela. A ordem da leva mandou devolver o `-i` e isentar o ruído, o
que equivale a escolher o primeiro caminho — *"o NOME dele vira exceção
explícita do regex"*. É o de menor dano (não pede que ninguém reescreva 26
arquivos para caber num portão) e está escrito no `RUIDO_MEDIDO`, com a
contagem. Se ela preferir outro, o ponto de mudança é uma linha só.

**4. Os números do ruído mudam quando a árvore muda.** As 59/27 valem para o
`dev` e para a `voo/LEVA-4-C` de hoje, e vão mudar a cada arquivo que cite o
nome do arquivo de regras. O que **não** muda é o resultado depois da isenção:
zero. O comentário do script guarda a data e o comando, para que a próxima
pessoa remeça em vez de acreditar.

**5. O `ISENCAO` do `check_endereco_de_radio.py` só entende comentário de HTML**
(`<!-- endereco-de-mentira: … -->`). Agora que o `.svg` entrou na varredura,
isso funciona (SVG é XML) — mas num `.py` ou num `.sh` a isenção de linha não
tem forma escrevível. Não foi problema para esta leva, porque montei os
endereços em pedaços; vira problema para quem precisar de uma fixture
deliberada em código.
