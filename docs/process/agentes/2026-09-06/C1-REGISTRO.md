# C1 — o registro passa a dizer QUEM decidiu

**06/09/2026.** Árvore `hefesto-voo/C1-REGISTRO`, branch `voo/C1-REGISTRO`.
Posse: **`docs/data/decisoes-dela.csv`, e só ele** — mais a régua nova que o
vigia. Nenhuma outra linha do produto foi tocada.

O enunciado é o §2 item 2 e o §5 bloco "C1" de
[AS VINTE E QUATRO HORAS](../../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md),
e o conserto que ele manda executar está desenhado em
[POR QUE A FILA REPETE](../../2026-09-05-POR-QUE-A-FILA-REPETE-a-queixa-dela-medida.md),
§6 C1 e C2.

---

## O QUE SE MEDIU

**O arquivo, antes de eu tocar nele:** 199 linhas de dado, 16 colunas, todas as
linhas com 16 campos, fim de linha `\n`, sem CRLF, terminando em nova linha.

**O defeito, medido:** a coluna `escolha` guardava a autoria em prosa
(*"DECIDIDA POR DELEGAÇÃO"*), e 69 linhas a traziam. Nas outras 130 a autoria
era inferência de quem lesse. Nenhuma régua alcançava, e o §5 do laudo já tinha
nomeado o preço: *uma delegação de terça revoga uma palavra dela de segunda sem
que ninguém veja*, três vezes num dia.

**As 54 do lote de 04/09 estavam TODAS marcadas como delegação — e 49 não são.**
Medido contra
[AS QUARENTA E UMA DECISÕES DELA](../../2026-09-05-AS-QUARENTA-E-UMA-DECISOES-DELA.md)
e contra o cabeçalho das 24 sprints `ONDA5-*`:

| do lote de 04/09 | quantas | a prova |
| --- | ---: | --- |
| ela respondeu em **05/09**, com a pergunta na mão | **41** | o verbatim está no cabeçalho da sprint que a executa, seção *"A DECISÃO DELA, VERBATIM"* |
| o PO **acolheu** a palavra dela da madrugada de 04/09 (as dezesseis) | **8** | `O-PO-DECIDE` §1 e §2: cinco morreram nos conflitos C-1, C-2, C-4, C-5 e C-7, e três dizem *"É a D-NN"* |
| decisão do PO, sem palavra dela sobre a pergunta | **5** | `O-PO-DECIDE` §2, adotando a recomendação da lista da aba |

**Dois vermelhos que este arquivo já carregava, e nenhum é meu:**

1. **`acentuacao` reprovava a linha 200** (`D-0609-A-MAQUINA-E-DO-OPUS`, escrita
   hoje pelo coordenador): sete violações — `nao` ×4, `codigo` ×2, `permissao`.
   O portão varre `.csv` desde 11/08/2026. **Curado aqui**, e a citação literal
   dela dentro da linha já estava acentuada: o que faltava acento era a prosa de
   quem registrou.
2. **O painel publicado está velho.** `test_toda_decisao_do_csv_chega_a_pagina`
   reprova com `D-0609-REENVIO-SAI`, e reprova **sem a minha mudança** — as 21
   linhas `D-0609-*` de hoje nunca chegaram a `html/painel.html`. Não regenerei:
   o painel é artefato compartilhado e a regeneração arrastaria o censo da
   árvore inteira no meio de uma leva de doze agentes. **Um comando fecha, e ele
   é do fecho:** `python3 scripts/gerar-painel.py`.

---

## O QUE MUDOU

**Duas colunas novas, no fim, com a ordem das dezesseis existentes intacta:**

| coluna | o que diz |
| --- | --- |
| `quem_decidiu` | `ela` · `delegacao` · `indeterminado` |
| `revoga` | o `id` da decisão que esta linha derruba (`\|` separa, quando há duas) |

**O placar das 199:**

```
ela 172 · delegacao 20 · indeterminado 7
```

**O critério, escrito para não ser reinventado:** `quem_decidiu` responde *quem
decidiu a posição que VALE HOJE* — é a pergunta que quem lê amanhã faz, e a que
o §5 do laudo diz que ninguém conseguia responder. Uma linha registrada pelo PO
cuja resposta é a palavra dela é `ela`, e a `escolha` carrega o carimbo
`QUEM DECIDIU: ELA` com a frase e o endereço.

**As 41 ganharam a `escolha` verbatim dela de 05/09**, copiada do cabeçalho da
sprint que a executa, nunca parafraseada, com o id da pergunta (`NN-QN`) e a
sprint ao lado. `decidida_em` foi de `2026-09-04` para `2026-09-05` em 40 delas
— a `D-03G-BOTAO-REENVIO` fica em `2026-09-06`, porque a palavra dela de hoje é
mais nova, e a de 05/09 entrou **antes** dela na mesma célula, em ordem
cronológica. `por_que_espera` deixou de dizer *"decidida por delegação"* nas 49.

**Três delas não trazem frase, e o registro diz isso em vez de inventar uma:**
02-Q7, 08-Q2 e 08-Q4 vieram por opção marcada, sem ela escrever ao lado. A
célula começa com `SEM VERBATIM —` e nomeia a opção.

**`revoga` — oito ponteiros, todos com a prova que nomeia o id:**

| revoga | o que caducou | por quê |
| --- | --- | --- |
| `D-0609-REENVIO-SAI` | `D-03G-BOTAO-REENVIO` | a palavra dela de 06/09 (*"sai"*) mata a decisão do PO de 04/09 |
| `D-01J-CADEADO-ONDE` | `D-O-CADEADO-DO-AUTOSWITCH-SAI` | **a lápide que faltava**: a delegação de 04/09 repôs a caixa que a palavra dela de 26/08 tinha tirado |
| `D-03G-BOTAO-REENVIO` | `D-O-GATILHOS-DE-QUATRO-COLUNAS-ESTA-APROVADO` | **a segunda lápide que faltava**: a delegação recriou um botão que a aba aprovada por ela em 28/08 não tinha |
| `D-GESTO-DO-MAPA` | `D-MAPA-2D-DAS-PORTAS` | a metade do arrastar |
| `D-CALIBRAR-AS-ENTRADAS` | `D-MAPA-2D-DAS-PORTAS` | a metade *"recusou o assistente"* |
| `D-O-GAMEPAD-VIRTUAL-SAI-DA-INTERFACE` | `D-A-EMULACAO-MORRE` | a parte que mandava o diagnóstico para a Sistema |
| `D-A-ORDEM-DA-TIRA-E-A-DO-MOCKUP` | `D-AS-DEZ-ABAS-E-SEUS-NOMES` · `D-A-TIRA-COMECA-EM-JOGAR-E-TERMINA-EM-PERFIS` | a ordem da tira |

As três primeiras são exatamente os casos que a §5 do laudo nomeia. As quatro
últimas já estavam na prosa e nenhuma coluna as alcançava.

**As sete `indeterminado`, e por que não chutei.** As sete fecharam **sem
palavra dela e sem citar mandato**, e quatro delas fecharam em 24/08 — um dia
ANTES do mandato de delegação mais antigo (25/08). Chamar isso de `delegacao`
seria inventar uma autorização que não existia; chamar de `ela` seria pior. A
razão de cada uma está na própria célula, datada, atrás do carimbo
`QUEM DECIDIU: INDETERMINADO (06/09/2026)`.

**A conferência de forma, antes e depois — colada:**

```
bytes        ANTES=211797   DEPOIS=226049
termina_nl   ANTES=True     DEPOIS=True
crlf         ANTES=False    DEPOIS=False
nl           ANTES=200      DEPOIS=200
registros    ANTES=200      DEPOIS=200      (199 de dado + cabeçalho)
colunas      ANTES=16       DEPOIS=18
largura      ANTES={16:200} DEPOIS={18:200} (nenhuma linha desalinhada)

ids iguais e na MESMA ORDEM: True | quantos: 199 199
colunas alteradas: escolha 58 · por_que_espera 50 · decidida_em 41 ·
                   titulo/a_pergunta/caminhos/recomendacao/preco_do_outro_lado/
                   custo/nasceu_de 1 cada (só a linha 200, os acentos)
colunas intocadas: id · onde_mora · foto_antes · foto_depois · aberta_em · estado
```

Escrito com o módulo `csv` do Python (`DictWriter`, `lineterminator="\n"`),
nunca com `sed`: o escape de aspas e a citação mínima saem do próprio módulo, e
é por isso que os `""` internos continuam byte a byte no formato de antes.

---

## A MORDIDA

A régua é `tests/unit/test_o_registro_diz_quem_decidiu.py`, sete asserções.
Sete formas de arrancar a cura, sete reprovações nomeando a linha:

```
--- A CURA NO LUGAR: rc=0
    7 passed in 0.23s
--- MORDIDA 1 - uma linha sem quem_decidiu: rc=1
    E  AssertionError: estas decisões não dizem quem as decidiu — quem ler
       amanhã não sabe o que pode reabrir: ['D-05V-CLIQUE-SEM-ALVO']
    FAILED ...::test_toda_linha_diz_quem_decidiu
--- MORDIDA 2 - valor fora dos tres: rc=1
    E  AssertionError: `quem_decidiu` só aceita ['delegacao', 'ela',
       'indeterminado'], e estas linhas dizem outra coisa:
       [('D-05V-CLIQUE-SEM-ALVO', 'talvez')]
--- MORDIDA 3 - indeterminado sem a razao: rc=1
    E  AssertionError: estas linhas dizem `indeterminado` sem o carimbo
       `QUEM DECIDIU: INDETERMINADO` e a razão datada na `escolha`:
       ['D-HCI1-BLOQUEADO']
--- MORDIDA 4 - revoga aponta id inexistente: rc=1
    E  AssertionError: a coluna `revoga` aponta para o vazio:
       [('D-0609-REENVIO-SAI', 'D-NAO-EXISTE-ESTA', 'id não existe')]
--- MORDIDA 5 - lote de 04/09 vira `ela` sem a prova: rc=1
    E  AssertionError: estas linhas do lote de 04/09 dizem `ela` sem o carimbo
       `QUEM DECIDIU: ELA` com a palavra dela na `escolha`:
       ['D-02C-VOLUME-CLICAVEL']
--- MORDIDA 6 - revogacao calada na prosa: rc=1
    E  AssertionError: estas linhas revogam outra decisão e não a nomeiam na
       `escolha` — a revogação fica calada para quem lê:
       [('D-01J-CADEADO-ONDE', 'D-O-CADEADO-DO-AUTOSWITCH-SAI')]
--- MORDIDA 7 - delegacao sem citar o mandato: rc=1
    E  AssertionError: estas linhas dizem `delegacao` e não citam o mandato que
       a autorizou: ['D-TROCA-DE-PERFIL-CEGA']
--- A CURA DEVOLVIDA: rc=0
    7 passed in 0.25s
```

O arquivo foi restaurado byte a byte depois das sete (md5 conferido contra a
cópia curada: `bdb814f35488caecd4ea92bf9562cdc5` nos dois lados).

**UMA EXIGÊNCIA DO §6 DO LAUDO NÃO ENTROU, e a razão é medida.** O C1 propunha
que `quem_decidiu = ela` exigisse um trecho **entre aspas** na `escolha`.
Medido nesta árvore: **37 linhas de autoria dela não têm verbatim** — inclusive
as 21 de 06/09, em que ela respondeu marcando escolha e não escrevendo frase.
Exigir aspas empurraria autoria PROVADA para `indeterminado`, que é piorar o
registro para satisfazer a régua. A exigência de prova ficou onde o trabalho de
hoje aconteceu, e é a MORDIDA 5: **no lote de 04/09, `ela` só passa com o
carimbo e a palavra dela.** A razão está escrita no cabeçalho da régua.

**Os portões, depois de `git add -A`:** `bash scripts/portoes.sh` →
**42 verdes de 43**. O único vermelho é `referencias-docs`, com **7 referências
mortas, todas a `scripts/migrar-mapa-v2.py`**, em sete documentos que eu não
toquei. **Provado herdado:** com a minha mudança guardada em `git stash`, o
mesmo portão devolve as mesmas 7 e `rc=1`. O arquivo citado foi apagado no
commit `4cb7e97d` e não existe no `HEAD`.

---

## O QUE FICOU PARA OUTRA POSSE

1. **`html/painel.html` precisa de uma regeneração, e ela é do FECHO.**
   `python3 scripts/gerar-painel.py`, depois que todo mundo que escreve no CSV
   tiver aterrissado — regenerar agora deixaria o painel velho de novo em uma
   hora, e arrastaria o censo da árvore inteira para dentro do meu commit.
2. **As 7 referências mortas de `scripts/migrar-mapa-v2.py`**, em
   `docs/data/LEIA-PRIMEIRO.md:462`,
   `docs/process/2026-08-15-A-QUEDA-*.md:292` e `:388`,
   `docs/process/2026-08-26-O-QUE-ELA-DESENHOU-*.md:74`,
   `docs/process/sprints/2026-08-11-MAPA-QUE-VIRA-PORTAO-02-*.md:27`,
   `docs/process/sprints/2026-08-27-ONDA-CONEXOES-05-*.md:140` e
   `docs/process/sprints/2026-08-27-ONDA-ILUMINACAO-02-*.md:45`. Seis arquivos,
   um dono só, e nenhum é meu.
3. **O buraco que a §4.3 do laudo mede continua aberto**, e este trabalho não o
   fecha: as decisões que ela tomou na conversa de **30/08, 31/08 e 01/09**
   seguem sem linha no registro. O `DECISOES-DELA-O-REGISTRO.md` as tem em
   tabela; o CSV, não. Enquanto elas não virarem linha, a pergunta volta à mesa
   dela — foi assim com o aviso do Modo Nativo, duas vezes.
4. **O C3 e o C4 do §6 do laudo não foram feitos** — os dez
   `DECISOES-DELA-*.md` continuam sem citar um `id` do registro, e ainda dizem
   *"ELAS NÃO ESTÃO RESPONDIDAS"* sobre 41 perguntas respondidas. É outra
   posse: são dez arquivos de sprint.
5. **A régua nova não está no `portoes.sh`, de propósito.** Ela é
   `tests/unit/test_*.py` e roda na camada `suite`, que é de quem coordena.
   Pô-la na lista dos 43 exigiria mexer no `portoes.sh` **e** no `ci.yml` — dois
   arquivos que não são meus e que o `test_portao_a_lista_de_portoes_e_uma_so`
   compara nos dois sentidos. Se o coordenador quiser a camada rápida, é uma
   linha em cada.

**Achado de segurança, conferido porque o enunciado mandou:** procurei a senha
`sudo` dela em toda a árvore versionada (`git grep` por `senha|password|passwd`
com valor à direita, e por `\bsenhas?\b` em `docs/` e `mockup/`). **Nenhum valor
de senha aparece na árvore de hoje.** A linha `D-0609-A-MAQUINA-E-DO-OPUS` diz
que ela entregou a senha no chat e que a senha não entra em arquivo — o texto
está certo, e não traz a senha. O vazamento histórico (cinco commits em
`origin/main`) já está documentado em
`docs/process/2026-09-01-ONDE-PARAMOS-a-migra-definitiva.md:158-185`; não
copiei nada, e a política de lá continua valendo.
