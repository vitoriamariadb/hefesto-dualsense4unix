# LEVA-4-E — o empacotamento, e as cinco réguas menores que não mediam o que prometiam

Árvore: `../hefesto-voo/LEVA-4-E`, branch `voo/LEVA-4-E`. Bancada: não tocada.
Cinco commits de cura + este.

## O que mudou

### 1. `dsx_recover.sh` saiu do `.deb` — `scripts/build_deb.sh`

Confirmado o diagnóstico da ordem, com o comando:

```
$ grep -rn dsx_recover src/
(vazio)
```

A única menção em `tests/` é `test_a_unit_dsx_recover_nao_existe_em_lugar_nenhum`,
que existe para impedir a UNIT de voltar — apagada em 31/07/2026. Ou seja: ele
viajava num formato só e não tinha consumidor em nenhum, e se alguém ligasse o
consumidor um dia ele funcionaria no `.deb` e falharia em silêncio nos outros
seis empacotamentos.

O laço de `build_deb.sh:234` leva **quatro** scripts agora. O arquivo continua
no repositório como instrumento de bancada, que é o que ele é: a seção
"irmão sem carona" do `check_packaging_parity.sh` diz com todas as letras que
script que só roda do checkout tem os irmãos ao lado por construção.

**`check_packaging_parity.sh` não o declarava como lacuna** — este é um ponto
onde a ordem estava enganada, e conferi antes de mexer. `_PRODSCRIPTS` (a lista
que o portão cobra em sete formatos) tem cinco nomes e `dsx_recover.sh` nunca
esteve lá; a única aparição dele no arquivo era o comentário histórico do
IRMAO-SEM-CARONA-01 (`:1367`), que enumerava os cinco scripts do laço de
12/08/2026. Corrigi esse comentário — cinco viraram quatro, com a data e o
motivo da retirada — porque um comentário que descreve o laço errado é
exatamente o fato errado que a casa manda substituir.

Medido depois: `bash scripts/check_packaging_parity.sh` → rc=0, 40 linhas `[ OK ]`.

### 2. `check_faixa_sintetica.py` — o varredor da árvore passou a ver o backup

O diagnóstico da ordem estava certo, e conferi linha a linha: `_vale_varrer`
(a cura de 25/08, `Path.suffixes` no lugar de `Path.suffix`) só é chamada por
`achados()`, o varredor `--casa`, que o cabeçalho do próprio arquivo declara
**não reprovar em lugar nenhum**. O varredor que o CI roda é
`achados_na_arvore()`, e ele iterava `NOMES_DE_TEMPO_DE_EXECUCAO` com
`rglob(nome)` — casamento exato — sem nunca chamar `_vale_varrer`.

A cura escrita e não ligada, dentro da própria régua.

Agora: `rglob(nome + "*")` + filtro `_vale_varrer`. `controllers.json.antes-de-X`
entra; `controllers.jsonl` (outro formato, `suffixes == ['.jsonl']`) fica de fora.

O modo `--arvore` ganhou `--raiz`, sem o qual a mordida teria de sujar o
repositório de verdade para medir.

### 3. `validar-caducos.py` — alcança a tela, e não se desarma mais sozinho

**Alcance.** `EXTENSOES` ganhou `.glade` e `.po`; `RAIZES_VIVAS` ganhou `po`.
A raiz teve de entrar junto, senão a extensão `.po` seria vacuidade pura:
nenhum `.po` mora sob `README.md`, `docs/usage`, `docs/protocol` ou `src`.
`.pot` ficou de fora de propósito — é gabarito gerado por `xgettext`, não uma
superfície que alguém escreve.

**Desarme.** `mv docs/data/caducos.csv /tmp/` fazia o portão imprimir `OK` e
sair `rc=0` (`:63`, o `return []` de `carrega_caducos`). Agora ledger ausente é
`rc=1` nomeando o arquivo. Ledger **presente e vazio** continua `rc=0` — a
distinção importa — mas dizendo `A RÉGUA NÃO MEDIU NADA` em vez de `OK`.

**Nenhuma dívida a declarar.** A ordem avisou que ampliar o alcance podia
deixar frases do `.glade` vermelhas. Medido: não deixou.

```
$ .venv/bin/python scripts/validar-caducos.py --all
OK: nenhum dos 1 fato(s) caduco(s) de docs/data/caducos.csv está publicado nas
superfícies vivas (README.md, docs/usage, docs/protocol, src, po).
rc=0
```

Confirmei também por busca direta que os três literais do ledger
(`55% e 75% de mudo`, `55% a 75% de mudo`, `40% do sinal`) não aparecem em
`main.glade` nem em nenhum `.po`/`.pot`. Não há perdão em bloco escrito em
lugar nenhum, porque não houve o que perdoar.

### 4. `validar-citacoes-de-linha.py` — a canônica é varrida em profundidade

`documentos_de` virou `rglob`, e o filtro do modo por argumento virou
`is_relative_to` no lugar de `parent ==`.

**Este é endurecimento, não conserto de defeito vivo, e a medição é a entrega:**

```
antes: OK: 123 citação(ões) de linha conferida(s) em 13 documento(s); 163 de fora
depois: OK: 123 citação(ões) de linha conferida(s) em 13 documento(s); 163 de fora
```

Idêntico — `docs/protocol/` é plano hoje e nada estava sendo perdido. O que
fecha é a forma: portão que emudece quando o território cresce.

O modo por argumento era o pior dos dois: descartava um `.md` de subpasta **em
silêncio** e imprimia "Nenhum documento para varrer" com `rc=0`. Recusa
silenciosa é a forma mais barata de um portão mentir.

### 5. As duas réguas que saíam verdes por vacuidade

Medido antes:

```
$ .venv/bin/python scripts/validar-fala-de-tela.py --all
OK: 1 `Fala` declarada(s), todas de acordo com src/…/app/fatos_do_mapa.py
$ .venv/bin/python scripts/gerar-tabela-de-curvas.py --check
docs/protocol/curvas-proprias.md: atualizado (0 curva(s) no catálogo)
```

E o tamanho real dos conjuntos, medido pela função de dentro de cada script:
**1** `Fala` em todo o produto, **3** números de tela, **0** abas em
`ABAS_COM_FALA_DECLARADA`, contra **308** células de `fatos_do_mapa.py`; e um
catálogo de curvas que **não existe no disco**.

Depois:

```
A RÉGUA QUASE NÃO MEDIU: 1 `Fala` declarada(s), 3 número(s) de tela e 0 aba(s)
promovida(s), contra as 308 célula(s) de src/…/app/fatos_do_mapa.py. Um conjunto
deste tamanho não distingue uma tela em acordo com o mapa de uma tela que
simplesmente não declara nada — promova mais abas em `ABAS_COM_FALA_DECLARADA` e
o verde daqui passa a valer.

docs/protocol/curvas-proprias.md: A RÉGUA NÃO MEDIU NADA: docs/data/curvas-proprias.json
não existe no disco. O bloco publicado bate com a tabela VAZIA que um catálogo
ausente produz — isso não é a tabela conferida contra o dado, é a ausência
conferida contra si mesma.
```

**O `rc` continua 0 nas duas, e é decisão consciente**, dita no código: o
tamanho dos dois conjuntos é decisão de produto (quantas abas promover; quando
a CR-04 produz a primeira curva), e portão não reprova ninguém por uma fila que
ele mesmo não enche. O que muda é a palavra, para que o verde não seja contado
como medição.

`frase_do_tamanho` foi posta **depois** de `divergencias` de propósito: pôr a
função antes deslocava as linhas 52 e 83 de `gerar-tabela-de-curvas.py`, que
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` cita em duas lápides
(`:844` e `:1559`) — arquivo que não é da posse desta frente. Conferido depois:
`:52` continua sendo o `import` de `CatalogoCurvasProprias`/`gerar_tabela_markdown`
e `:83` continua sendo a chamada de `gerar_tabela_markdown(catalogo)`.

## Qual mordida prova

Cinco arquivos novos… não: **quatro**. Três eram a encomenda; o quarto está
declarado em "o que sobrou".

### `test_faixa_sintetica_ve_o_backup.py`

Cura arrancada (`rglob(nome + "*")` + `_vale_varrer` → `rglob(nome)`):

```
FAILED test_faixa_sintetica_ve_o_backup.py::test_controllers_json_com_sufixo_de_backup_e_pego
E  AssertionError: o varredor --arvore ficou VERDE sobre um backup do
   controllers.json com faixa sintética dentro:
E    OK: nenhum artefato de tempo de execução versionado em '/tmp/pytest-…'
E  assert 0 == 1
1 failed, 4 passed in 0.33s
```

Cura devolvida: `5 passed in 0.33s`.

Os outros quatro casos continuam passando com a cura arrancada de propósito —
eles guardam o que já funcionava (nome exato pego, `.jsonl` fora, árvore limpa
verde, `tests/` ignorada), e é isso que impede a ampliação de virar regressão.

### `test_caducos_alcanca_a_tela.py`

Curas arrancadas (as duas de uma vez — `.glade`/`.po`/`po` fora de
`EXTENSOES`/`RAIZES_VIVAS`, e `LedgerAusente` de volta a `return []`):

```
FAILED test_caducos_alcanca_a_tela.py::test_fato_caduco_no_glade_reprova
FAILED test_caducos_alcanca_a_tela.py::test_fato_caduco_na_traducao_reprova
FAILED test_caducos_alcanca_a_tela.py::test_ledger_ausente_nao_e_verde
FAILED test_caducos_alcanca_a_tela.py::test_o_arquivo_real_do_glade_esta_no_alcance
E  AssertionError: o main.glade não está entre os arquivos vivos que o portão varre
4 failed, 2 passed in 0.41s
```

Cura devolvida: `10 passed` (com o `test_validar_caducos_z6_09.py` de 24/08 junto,
que continua verde).

`test_o_arquivo_real_do_glade_esta_no_alcance` é deliberado: sem ele, os outros
provariam só que o mecanismo funciona numa árvore de mentira — e esta casa já
teve portão olhando para a árvore errada por uma leva inteira.

### `test_citacoes_de_linha_varre_subpasta.py`

Curas arrancadas (`rglob` → `glob`, `is_relative_to` → `parent ==`):

```
FAILED test_citacoes_de_linha_varre_subpasta.py::test_citacao_podre_em_subpasta_e_pega
FAILED test_citacoes_de_linha_varre_subpasta.py::test_citacao_boa_em_subpasta_continua_verde
FAILED test_citacoes_de_linha_varre_subpasta.py::test_arquivo_de_subpasta_passado_a_mao_nao_e_descartado
E  … stdout='Nenhum documento para varrer.\n', returncode=0
3 failed, 2 passed in 0.40s
```

Cura devolvida: `5 passed in 0.37s`.

### `test_as_duas_reguas_vazias_dizem_que_nao_mediram.py`

Curas arrancadas (as frases de sucesso de volta ao `OK:`/`atualizado`):

```
FAILED ::test_fala_de_tela_nao_diz_ok_com_uma_fala_so
FAILED ::test_fala_de_tela_diz_o_tamanho_do_conjunto_medido
FAILED ::test_curvas_nao_diz_atualizado_sobre_catalogo_inexistente
E  assert 'NÃO MEDIU NADA' in 'docs/protocol/curvas-proprias.md: atualizado (0 curva(s) no catálogo)\n'
3 failed, 2 passed in 0.97s
```

Cura devolvida: `5 passed in 0.93s`.

Os dois que continuam passando exercitam as respostas **cheias** de
`frase_do_tamanho` (7 curvas → `atualizado`, com a fonte nomeada): régua que só
sabe dizer "não medi" é tão inútil quanto régua que só sabe dizer `OK`.

### Os portões e os vizinhos

```
$ git add -A && bash scripts/portoes.sh --rapido
REPROVOU: 1 vermelho(s) de 19 -> ruff
```

**O vermelho do `ruff` é ALHEIO e já existia antes de mim**, medido com a minha
árvore inteira em `git stash`:

```
RUF012 Mutable default value for class attribute
   --> tests/unit/test_ambiente_presumido_01_o_que_a_maquina_nao_tem.py:166:20
Found 1 error.
```

Esse arquivo é da **posse da LEVA-4-B** (frontmatter da sprint). Não toquei.
Os outros 18 rápidos: verdes.

Camada completa, rodada à mão nos portões que me alcançam:

```
shellcheck -S error …                                 rc=0
scripts/validar-acentuacao.py --all                   rc=0
scripts/validar-referencias-docs.py --all             rc=0 (457 documentos)
scripts/check_anonymity.sh                            rc=0
mypy src/hefesto_dualsense4unix                        Success: 225 arquivos
pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py   35 passed
pytest tests/unit/test_portao_todo_portao_tem_chamador.py     11 passed
```

E os **618 testes** de todo arquivo de `tests/unit/` que cita um dos sete
scripts que toquei (`build_deb`, `check_packaging_parity`, `check_faixa_sintetica`,
`validar-fala-de-tela`, `validar-citacoes-de-linha`, `validar-caducos`,
`gerar-tabela-de-curvas`, `dsx_recover`) rodaram juntos: `618 passed in 31.34s`.

## O que NÃO verifiquei

- **Não construí um `.deb` de verdade.** A retirada do `dsx_recover.sh` foi
  provada por leitura do laço e pelo `check_packaging_parity.sh` (rc=0, 40
  `[ OK ]`), não por `dpkg-deb` rodando. Se alguém quiser a prova de ponta a
  ponta, é `scripts/build_deb.sh` numa máquina com `dpkg-deb` — e eu não o
  rodei porque ele escreve fora da árvore.
- **Não conferi os outros seis empacotamentos** (Flatpak, dois AppImage, Arch,
  Fedora, Nix) atrás de `dsx_recover.sh`. O `grep` da árvore inteira só o achou
  no `build_deb.sh`, então acredito que não estava em nenhum outro — mas isso é
  inferência do `grep`, não leitura dos seis manifestos.
- **Não medi se `po/` em `RAIZES_VIVAS` tem custo de tempo relevante.** Os três
  `.po`/`.pot` desta árvore são pequenos e o portão fecha em 91 ms, mas não
  comparei com o tempo de antes.
- **Não sei se `.mo` compilado publica o literal caduco.** Ele é binário e ficou
  de fora por desenho (a lista de extensões é de texto). Um fato caduco que
  entre pelo `.po` será pego na fonte, o que basta na prática — mas um `.mo`
  divergente do `.po` dele passaria.
- **Não rodei a suíte inteira** (regra da casa: é de quem coordena, e no fim).
- **Não olhei a tela.** Nenhum arquivo desta frente é de interface, e o
  `retratar_abas.py` não foi rodado (R-C).
- **A afirmação de que o `main.glade` publica texto de tela** eu tomei do
  desenho do produto e do fato de a régua o alcançar agora; **não abri o Glade
  para conferir que os `<property name="label">` dele chegam à janela**. O teste
  prova o alcance da régua, não a rota do pixel.
- **Não tenho como afirmar que o vermelho do `ruff` continuará alheio no
  merge.** Ele é da LEVA-4-B; se ela o consertar, some.

## O que sobrou para o próximo

1. **Um arquivo alheio com fato errado, e eu não o escrevi (R-A).**
   `tests/unit/test_uninstall_simetrico_ao_install.py:347`, no docstring de
   `test_a_unit_dsx_recover_nao_existe_em_lugar_nenhum`, diz:

   > O `scripts/dsx_recover.sh` continua no repositório porque o `.deb` o
   > empacota — quem sai é a UNIT.

   A partir do commit 1 isso é **falso**: o `.deb` não o empacota mais. A frase
   certa é "continua no repositório como instrumento de bancada". O arquivo não
   está na posse de nenhuma das cinco frentes da LEVA-4 — quem integra troca a
   linha, ou despacha. O teste em si continua verde e continua correto: ele mede
   ortografia da UNIT, não o empacotamento.

2. **Um teste novo fora da lista declarada, e digo por quê.**
   `tests/unit/test_as_duas_reguas_vazias_dizem_que_nao_mediram.py` não estava
   entre os três nomes que a ordem declarou. Criei-o porque o item (5) é cura, e
   cura sem mordida não fecha nesta casa — e porque um arquivo novo de nome
   único não pode colidir com frente nenhuma. Se quem coordena preferir outro
   nome ou outro lar, é um `git mv`.

3. **`ABAS_COM_FALA_DECLARADA` está VAZIO.** Isto é o achado que a frase nova do
   `validar-fala-de-tela.py` põe na cara, e ele é maior que esta frente: com
   zero abas promovidas, `valida_abas_promovidas` não olha um único arquivo, e a
   trava que existe para impedir frase de transporte sem lastro **não está
   armada em aba nenhuma**. Promover a primeira aba é decisão de produto e de
   quem coordena, não minha.

4. **`docs/data/curvas-proprias.json` não existe**, e por isso o portão de curvas
   nunca mediu nada desde 12/08. Isso é conhecido e declarado no cabeçalho do
   próprio script ("o portão nasce antes do dado, e isso é o desenho") — a
   novidade é só que agora ele **diz** isso em voz alta. Quem fecha é a CR-04.

5. **`.mo` fora do alcance do `validar-caducos.py`.** Ver "o que não verifiquei".
   Se a casa decidir que um `.mo` divergente do `.po` é risco real, a cura é um
   portão que compare os dois, não estender a lista de extensões para binário.

6. **A ordem dizia que `check_packaging_parity.sh` declarava o `dsx_recover.sh`
   como lacuna, e ele não declarava.** Registro aqui para que a próxima pessoa
   não vá procurar a entrada em `_ARTEFATO_SEM_DONO_HOJE` ou
   `_PRODSCRIPT_LACUNAS_HOJE`: ela nunca existiu. O que havia era o comentário
   histórico, e ele está corrigido.

7. **Sobre a régua nova do `validar-caducos.py` e o `ruff`:** o `EXTENSOES` agora
   tem sete itens e o `RAIZES_VIVAS` cinco. Se alguma frente futura acrescentar
   uma raiz que contenha `.py` gerado (por exemplo um `build/`), a varredura vai
   abri-los — nenhuma existe hoje.
