# AUDITORIA-DE-PERDA-01 — C2 — o portão dos portões morde, e mostra os dois

> **Este relatório foi escrito pela CONFERÊNCIA em 25/08/2026, não pelo
> executor.** A frente entregou 673 linhas em `dev` (`bfdb75d`, `74d44ac`,
> `bac5774`) e não deixou relatório. A fonte aqui é o **diff** e a **mordida
> refeita** — arrancar a cura, ver reprovar, devolver — não a memória de quem
> escreveu o código. Tudo que não consegui verificar está no terceiro
> cabeçalho, com o motivo.

**Árvore:** `hefesto-voo/conferencia-C2-portoes`, HEAD destacado em `1dbe2ca`
(o mesmo commit do `dev`). Árvore limpa antes e depois de tudo abaixo.

---

## O que mudou

Dois arquivos, nenhum de produto — a frente é inteira de instrumentação.

| arquivo | linhas | o que é |
|---|---|---|
| `tests/unit/test_portao_todo_portao_tem_chamador.py` | +397 (novo) | o portão dos portões: varre `scripts/` e reprova todo arquivo com FORMA de portão (`check_`, `validar-`, `portao_`) que nenhum runner chame |
| `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | +328/−52 | três réguas que varriam mais de um registro com `assert` DENTRO do laço passam a acumular e acusar uma vez só |

Comando: `git diff --stat ba83c32 0714ebf^2`.

### `74d44ac` — todo portão tem quem o rode

Quatro coisas contam como chamador, e a lista é fechada: a tabela de
`scripts/portoes.sh` (só as linhas `rapido|`/`completo|`/`suite|`), qualquer
`.github/workflows/*.yml`, o gancho `scripts/hooks/pre-commit`, e o
`.pre-commit-config.yaml`. **Não** contam: comentário, linha
`FORA-DO-LOCAL`/`FORA-DO-CI` (declara divergência entre listas, não execução) e
chamador só em `tests/`.

Uma dívida declarada, em `_SEM_CHAMADOR_HOJE`:
`scripts/check_broadcast_proibido.py`. **Conferi a declaração inteira e ela
está certa** — é o único órfão real da árvore:

```
$ for f in <os 18 portões do disco>; do
    grep -rl "$f" .github/workflows/ scripts/portoes.sh scripts/hooks/ .pre-commit-config.yaml
  done
check_broadcast_proibido.py -> (nada)
todos os outros 17 -> pelo menos um runner
$ .venv/bin/python scripts/check_broadcast_proibido.py
OK: nenhuma rota de saída com fan-out sem escopo em .../src.
exit=0
```

Verde por AUSÊNCIA, exatamente como descrito. Nascimento conferido:
`826ee18`, 24/08 05:10.

### `bfdb75d` — a régua que mostrava metade

`_confere_razoes` passa a receber `*registros` e acumular; `fantasmas` e
`curadas` viram comprehension sobre `_registros_de_promessa()`. A classe nova
`TestOPortaoNaoEscondeMetadeDoQueVe` é a mordida.

### `bac5774` — correção de fato

"As duas lápides conviveram MESES" → **horas**. **Refiz as cinco datas por
`git log` e as cinco batem:**

```
$ git log -1 --format='%ad %s' --date=format:'%d/%m %H:%M' <sha>
c4b80da  23/08 21:50   lápide de app/ipc_bridge.py::destinos_da_aplicacao
12af679  24/08 09:45   o chamador nasce  -> caduca a partir daqui
565a70d  24/08 03:27   o chamador de utils/maquina.py::gravar_maquina nasce
300656c  24/08 04:11   a lápide é escrita 44 min DEPOIS do chamador
ca481af  25/08 03:29   as duas saem
```

`12af679` 09:45 → `ca481af` 03:29 = **17h44**, o número escrito. Os 44 minutos
também fecham. A correção é correta e o raciocínio dela — "lápide escrita sobre
uma árvore que outra frente mudou na mesma madrugada" — é o diagnóstico certo.

---

## Qual mordida prova

Refiz as duas mordidas centrais **na árvore de verdade**, não em dublê. Em cada
uma: rodei verde, arranquei a cura, vi reprovar, devolvi, rodei verde de novo.
As quatro restaurações foram conferidas por `md5sum` contra a cópia original.

### Mordida 1 — `assert` de volta para dentro dos três laços

Arranquei as três curas de `bfdb75d` de uma vez (`_confere_razoes` volta a
levantar por registro; `fantasmas` e `curadas` voltam ao laço com `assert`
dentro):

```
$ .venv/bin/python -m pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py \
      -q -k "TestOPortaoNaoEscondeMetadeDoQueVe or TestOPortaoMorde"
FAILED ...::TestOPortaoNaoEscondeMetadeDoQueVe::test_a_lapide_curada_nomeia_os_dois_registros
FAILED ...::TestOPortaoNaoEscondeMetadeDoQueVe::test_o_simbolo_fantasma_nomeia_os_dois_registros
FAILED ...::TestOPortaoNaoEscondeMetadeDoQueVe::test_a_razao_mal_escrita_nomeia_os_dois_registros
3 failed, 18 passed, 14 deselected in 47.07s
```

**MORDE, e a mensagem é específica** — não é "assert False" genérico. Ela nomeia
o achado que ficou escondido e diz o que fazer:

```
E  AssertionError: a régua da razão mal escrita escondeu 1 de 2 achados:
E    ['fabricado/segundo.py::cura_beta_que_nunca_existiu']
E  O `assert` voltou para DENTRO do laço que varre os registros: a primeira
E  falha aborta o laço e o resto nunca é lido. ACUMULE e falhe uma vez só.
E  Mensagem que saiu: ... (2 em 1 registro(s)) ... _REGISTRO_FABRICADO_A ...
```

Repare no `(2 em 1 registro(s))`: com a cura arrancada, o portão **anuncia** que
viu um registro só. É a assinatura do defeito histórico impressa na falha.

Devolvida a cura: `4 passed` na classe, `35 passed in 51.07s` no arquivo inteiro.

### Mordida 2 — um portão órfão de verdade em `scripts/`

```
$ printf '# vigia fabricado\n' > scripts/check_conferencia_c2_fabricado.py
$ .venv/bin/python -m pytest tests/unit/test_portao_todo_portao_tem_chamador.py -q
E  AssertionError: 1 portão(ões) existe(m) em `scripts/` e NADA os roda:
E    - scripts/check_conferencia_c2_fabricado.py
E  FAÇA UMA DAS DUAS: 1. LIGUE ... 2. DECLARE em `_SEM_CHAMADOR_HOJE` ...
1 failed, 10 passed in 0.25s
$ rm scripts/check_conferencia_c2_fabricado.py   # -> 11 passed
```

### Mordida 3 — desligar um portão REAL das duas listas

A regressão que a frente existe para impedir, reproduzida: tirei a linha
`rapido|faixa-sintetica|...` da tabela e o passo `run: python3
scripts/check_faixa_sintetica.py` do `ci.yml`.

```
E  AssertionError: 1 portão(ões) existe(m) em `scripts/` e NADA os roda:
E    - scripts/check_faixa_sintetica.py
1 failed, 10 passed in 0.23s
```

**Esta mordida prova duas coisas de uma vez.** O `ci.yml` continuou com uma
menção ao script — o comentário `LUZ-CEGA-01/E8` da linha 53 — e o portão
reprovou assim mesmo. A regra "comentário não conta" está medida contra a
árvore de verdade, não só contra o dublê de `tmp_path`.

Restaurado por cópia; `md5sum` idêntico aos quatro originais; `git status`
vazio; `11 passed`.

### O que já vem mordendo de fábrica

`TestOPortaoMorde` (6 casos) e `TestOPortaoNaoEscondeMetadeDoQueVe` (4) não são
enfeite: incluem os dois dublês que **sabem recusar** —
`test_a_regua_sabe_recusar_uma_arvore_vazia` e
`test_a_regua_da_acusacao_dupla_sabe_recusar`, este último alimentando a régua
com a mensagem exata que o defeito produzia. Não achei tautologia do tipo
`ids.issubset(ids)` em nenhum dos dez.

**Verdes de hoje, nesta árvore:** `test_portao_todo_portao_tem_chamador.py` →
`11 passed in 0.22s`; `portao_a_casa_sabe_e_o_produto_nao_faz.py` →
`35 passed in 51.07s`.

---

## O que NÃO verifiquei

- **Não rodei a suíte inteira** nem `bash scripts/portoes.sh`. Regra da casa
  com nove árvores em voo; rodei só os dois arquivos da frente. Logo **não sei
  se estas mudanças quebram algum outro teste** — em particular não sei se
  algum outro arquivo importava `_confere_razoes` com a assinatura antiga
  (`registro, rotulo`), que a frente mudou para `*registros`. Conferi por
  `grep` que a única chamada fora do arquivo é nenhuma, mas `grep` não é a
  suíte.
- **Não verifiquei o CI de verdade.** Toda afirmação sobre o `ci.yml` aqui é
  leitura do YAML, não uma execução no GitHub. Se um job estiver desligado por
  `if:` ou por filtro de caminho, eu não veria — e o portão também não (ver
  achado 3).
- **Não medi o tempo do portão novo dentro do CI**, nem se ele muda o custo do
  job `lint-test`.
- **E1, E2, E3 e E4 da sprint dona não são desta frente.** Conferi que os
  quatro estão fechados, mas por outros commits: E1 e E2 em `300656c`
  (`git log -1 -- tests/unit/test_a_bancada_da_foto_exercita_os_dois_graus.py`),
  E4 em `c4b80da` (`git log -1 -S'apelido_do_dongle.py::costurar_a_mesa'`), e E3
  aparenta fechado por leitura de `scripts/validar-referencias-docs.py:591-630`
  (o caminho relativo é resolvido antes da leniência de sufixo) — **não rodei o
  portão de referências para confirmar**. A frente C2 entregou trabalho que a
  sprint de 23/08 **não numera**: ela generalizou a §1 daquele documento
  ("portão verde que não mede nada") para "portão que ninguém chama".
- **Não medi se o gancho `scripts/hooks/pre-commit` dispara numa árvore de
  worktree de agente.** Confirmei só que o symlink existe na árvore dela
  (`.git/hooks/pre-commit -> ../../scripts/hooks/pre-commit`). Isso importa
  porque `scripts/check_fotos_da_tela.py` tem o gancho como **único** chamador.

---

## O que sobrou para o próximo

Quatro achados meus, nenhum deles relatado pelo executor. Nenhum é falso verde
do que a frente promete medir — a régua morde. Os dois primeiros são buracos de
alcance; o terceiro é uma folga da régua; o quarto é fato errado.

### 1. O portão dos portões não olha para `tests/` — MEDIA

`portoes_no_disco()` varre **só `scripts/`**. Mas o portão que ficou VERMELHO no
`dev` por horas — o que esta mesma frente conserta no outro commit — mora em
`tests/unit/`, e **não se chama `test_*`, então o `pytest` não o coleta**. Ele
depende de uma linha explícita em `portoes.sh:66` e outra em `ci.yml:364`. Essa
classe inteira é invisível para a régua nova. Medido:

```
$ printf 'def test_sempre_reprova():\n    assert False, "eu deveria ter reprovado a leva"\n' \
      > tests/unit/portao_conferencia_c2_fabricado.py
$ .venv/bin/python -m pytest tests/unit --collect-only -q | grep -c portao_conferencia_c2_fabricado
0
$ .venv/bin/python -m pytest tests/unit/test_portao_todo_portao_tem_chamador.py -q
11 passed in 0.23s
```

Um arquivo que reprovaria a leva inteira, no disco, coletado por ninguém, e o
portão dos portões verde. **É o defeito do `check_faixa_sintetica.py`, na única
pasta que a régua se recusa a olhar.** Hoje há exatamente um arquivo dessa forma
e ele está ligado nos dois lugares — então não há instância viva, e por isso é
MEDIA e não ALTA. A cura é uma linha: varrer também
`tests/**/portao_*.py` e `tests/**/check_*.py`, com a mesma tabela de
chamadores.

### 2. O portão novo não roda no comando que a casa manda rodar — MEDIA

`bash scripts/portoes.sh` (sem argumento) roda `rapido` + `completo`. O portão
novo não está em nenhuma das duas camadas:

```
$ grep -rn "todo_portao_tem_chamador" scripts/ .github/ .pre-commit-config.yaml
(nada)
```

Ele só roda no `pytest -q` da camada `suite` — que a `CLAUDE.md` diz ser de quem
coordena e rodar no fim — e no `pytest tests/unit -v` do `ci.yml:585`. Ou seja:
**um agente que commitar um portão órfão e rodar o comando prescrito antes de
fechar a leva vê verde.** O achado aparece no vermelho do CI, que é
literalmente o sintoma que originou esta frente (`validar-caducos.py`).

O irmão `test_portao_a_lista_de_portoes_e_uma_so.py` está no mesmo estado, então
isto é padrão da casa e não descuido novo — mas o precedente do conserto também
existe, uma linha acima na mesma tabela:
`completo|casa-sabe|pytest|tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`.
Duas linhas fechariam (tabela + passo no `ci.yml`, as duas, senão o portão da
lista reprova).

### 3. "Chamador" é casado por substring, e quatro formas de mentir passam — MEDIA

`portoes_sem_chamador` faz `portao not in corpo and Path(portao).name not in
corpo`, onde `corpo` é toda linha não-comentário dos runners. O arquivo promete
que "menção em comentário" não engana — e só o comentário `#` é filtrado. Medi
quatro falsos negativos com a própria função, em árvore de mentira:

```
A) `- name: ainda falta ligar o scripts/check_inventado.py`  -> NÃO ACUSOU
B) job inteiro com `if: false` chamando o portão              -> NÃO ACUSOU
C) `run: echo 'o scripts/check_inventado.py ainda nao roda'`  -> NÃO ACUSOU
D) tabela chama `scripts/check_x.py.bak`; existe `check_x.py` -> NÃO ACUSOU
```

(A) é a mais provável: um rótulo de step é a forma natural de escrever o nome
sem rodá-lo, e é exatamente a "menção em prosa" que a régua diz recusar — só que
em YAML e sem `#`. Nenhum portão da árvore de hoje passa por causa de uma dessas
linhas (conferi os 18, um a um), então não há falso verde vivo. A cura barata é
casar só o que está depois de `run:`/dentro da coluna 4 da tabela, como o irmão
`test_portao_a_lista_de_portoes_e_uma_so.py:69` já faz com `fichas_do_ci`.

### 4. "Dois anos" é um número inventado, e está em DOIS lugares — MEDIA

`test_portao_todo_portao_tem_chamador.py:132` e `:338` afirmam que o
`check_faixa_sintetica.py` "esteve citado em prosa por **dois anos** sem nunca
rodar" / "é a forma exata que enganou por **dois anos**". Medido:

```
$ git log --diff-filter=A --format='%h %ad' --date=format:'%d/%m/%Y %H:%M' \
      -- scripts/check_faixa_sintetica.py
565a70d 24/08/2026 03:27
$ git log --format='%h %ad' --date=format:'%d/%m/%Y %H:%M' \
      -S'run: python3 scripts/check_faixa_sintetica.py' -- .github/workflows/ci.yml
cdd90f0 25/08/2026 03:20
$ git log --reverse --format='%ad' --date=format:'%d/%m/%Y' | head -1
20/04/2026        # o repositório inteiro tem quatro meses
```

**Vinte e três horas e cinquenta e três minutos**, não dois anos — e o projeto é
mais novo que a afirmação. A ironia importa: `bac5774`, o **terceiro commit
desta mesma frente**, existe para corrigir "meses" → "horas" numa duração não
medida, e a frente deixou duas durações não medidas no arquivo que criou. Pela
regra desta casa, fato errado se **substitui em todos os lugares onde aparece**:
as duas linhas trocam "dois anos" por "quase um dia (24/08 03:27 → 25/08 03:20)".

Não é defeito funcional — a régua continua mordendo. Mas é o número errado
dentro do instrumento que existe para policiar número errado, e a próxima pessoa
que ler `:338` vai repassar "dois anos" adiante.

### Nota menor, sem gravidade

`test_o_registro_e_a_varredura_nao_se_contradizem` (linha 386) assere
`declarados <= soltos or not declarados - soltos`. Os dois lados são a **mesma
condição** escrita de duas formas; e a condição já é a de
`test_nenhuma_divida_sobreviveu_a_propria_cura`. Não é falso verde (a asserção
existe e funciona), é redundância — mas num arquivo cujo assunto é régua que se
mede a si mesma, um `A or A` merece sumir.

### Uma coisa que a frente acertou e vale registrar

O argumento de não-redundância contra `test_portao_a_lista_de_portoes_e_uma_so.py`
está **certo e é estrutural**, não retórico: aquele portão compara as duas listas
entre si, e um portão ausente das DUAS não aparece em diferença nenhuma. Foi
essa lacuna que deixou o `check_faixa_sintetica.py` passar. Duas réguas
independentes é o que revela — é a regra desta casa, aplicada corretamente.
