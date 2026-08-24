# O processo aguenta um `/clear`?

**24/08/2026.** Três perguntas dela, respondidas com medição: *o nosso processo
funciona? como melhorar pensando no `/clear`? os agentes que gerariam as sprints
pós-auditoria funcionaram?*

Quatro lentes independentes mediram, cada uma sem ver a saída das outras: um
Claude recém-nascido percorrendo só os ponteiros do `CLAUDE.md`; um contador de
desperdício sobre os journals dos 19 workflows da sessão; um catálogo do que
quebrou na Onda 0; e um advogado do diabo contra as quatro premissas do desenho.
**Onde elas discordam, a discordância está escrita** — está no §5, e em nenhum
caso a versão mais bonita foi a escolhida.

Nenhuma lente rodou a suíte: havia outra leva escrevendo na mesma árvore.

---

## 1. O processo funciona?

**Funciona a parte que virou portão. A parte que ficou em prosa de checklist foi
furada nesta mesma leva — cinco vezes, por quem escreveu a prosa horas antes.**

### O que funcionou, com número

| o que | medida |
|---|---|
| a fila não perdeu sprint | **29 sprints** nasceram em 23-24/08, **29 rastreadas no git**, **29 citadas** no `SPRINT_ORDER.md` |
| a árvore por agente evitou atropelo | 9 branches, **188 arquivos distintos**, 10 tocados por duas — **5,3 % de sobreposição** |
| a previsão de conflito acertou | o conferente previu **5** conflitos; `git merge-tree --write-tree` nos 9 merges dá **4 merges, 5 arquivos**. 5/5, zero falso positivo, custo 141.018 tokens (2,9 % da leva) |
| a retentativa de travamento | `exec:Z0`, `Z6`, `Z7` travaram ~557 s, todos voltaram `done` — **3/3** |
| a ordem de merge | seguida à risca: 09:46 (`9b4e5a0` Z0) a 10:15 (`cf78346` CONFIG), **29 min de relógio** contra 169 min de execução |

```bash
nc=0; for f in docs/process/sprints/*.md; do
  d=$(git log --diff-filter=A --format=%ad --date=short -- "$f" | tail -1)
  case "$d" in 2026-08-23|2026-08-24)
    grep -qF "$(basename $f)" docs/process/SPRINT_ORDER.md && nc=$((nc+1));; esac
done; echo "citadas=$nc"      # citadas=29
```

### O que não funcionou, e é sempre a mesma forma

Cinco itens de checklist, todos escritos, todos furados **na leva que os
escreveu** — e os cinco são exatamente os cinco que não têm executável:

| regra escrita | o que foi medido hoje |
|---|---|
| *"o relatório de quatro cabeçalhos existe — sem ele, a entrega não teve mordida provada"* (item 1 de "confira, não confie") | **4 relatórios para 9 frentes.** Z1, Z3, Z4, Z7 e CONFIGURACOES-FECHA integraram sem: `ls docs/process/agentes/2026-08-24/` |
| *"`--listar` é a fonte de verdade, que o git mantém sozinho"* | as **9 branches** aparecem como EM VOO e as 9 têm `git rev-list --count dev..$b` = **0**. O registro é cego a merge |
| *"nada entra aqui sem passar pelo sanitizador"* (`docs/process/agentes/README.md`) | `sanitizar_saida_de_agente.py --check` **RECUSA** `BERCO-DE-TMP-01-EXEC.md`, já commitado, com o `$HOME` real em duas linhas |
| *"fato errado se SUBSTITUI, e sai de TODOS os lugares"* | o teste de viés derrubou por escrito *"Steam só em `~/.steam/steam`"* (`RESULTADO-DO-TESTE-DE-VIES-01.md:281`) e a linha continuava viva em `SPRINT_ORDER.md:161`, a porta da fila |
| item 6 do fim de leva: *"`decisoes-dela.csv` com toda decisão nova que ficou aberta"* | último toque em `0e12780`, **00:12** — antes dos nove merges. O conferente marcou "decisão dela" sobre o parágrafo do microfone e o integrador resolveu sozinho (`git diff cf78346^1 cf78346 -- README.md`) |

**O padrão é o achado, não os cinco casos.** Toda regra desta casa que virou
portão foi cumprida nesta leva; toda regra que ficou em prosa foi furada. O
conserto genérico mais barato não é escrever mais checklist — é mover a linha
para onde já roda código.

### O outro lado da conta

Sobre **22.400.171 tokens** medidos na sessão (piso: ~50 execuções de agente
ficaram fora da contabilidade, sem `tokens` registrado):

- **3.202.491 tokens (14,3 %)** foram gastos em três workflows cuja única função
  era **ler journals e relatórios anteriores e pôr no disco o que já tinha sido
  escrito uma vez** (`materializar-a-onda-zero`, `materializar-o-que-os-agentes-descobriram`,
  `auditoria-de-rastreabilidade`).
- **2.032.793 tokens (9,1 %)** em segunda lente: 10 `refutar:*` devolveram
  **9 "NÃO REFUTADO" e 1 parcial**; 9 `advogado:*`, **1 mudou uma decisão** (o da
  Z3, que salvou uma sprint que o teste de viés mandava dissolver).
- **253.552 tokens (1,1 %)** em erro duro. `exec:Z1` morreu de erro de API em
  `attempt: 1` — o harness retenta travamento cinco vezes e **não retenta erro**.

**Estimativa honesta: entre 18 % e 28 % do esforço não virou nada durável, com
margem de ±10 pontos.** A margem é grande e o motivo está declarado: as
tentativas abortadas não são separáveis nestes arquivos, e "valor que passou pela
cabeça de quem coordena" é real — comprovado em 2 de 2 casos perseguidos — mas
não é auditável agente a agente.

---

## 2. Como melhorar pensando no `/clear`

O teste foi feito, não imaginado: um Claude recém-nascido percorreu **só** os
ponteiros do `CLAUDE.md`, 6 arquivos e 8 comandos em ~15 min. Nenhum ponteiro
quebrado. **O problema não é link morto, é fato velho.**

| pergunta dele | resultado |
|---|---|
| o que está em voo agora | achou o comando, e **o comando mente** |
| o que fechou hoje | **não existe em documento nenhum** — só por `git log` |
| a suíte está verde | painel diz 11.686 e **se declara velho**; nenhuma resposta de hoje |
| a próxima coisa a fazer | achou **por dedução própria**, cruzando §0.3 com `git log` |

E o que ele teria feito parando no fim do percurso oficial: **despachado a Onda 0
outra vez.** A §0.2 descrevia Z0-Z7 como "já em voo", o `--listar` confirmava
nove árvores em voo, e as nove tinham fechado havia menos de uma hora. O item do
checklist que existe para impedir "despachar duas vezes a mesma sprint" teria
**confirmado** o erro.

### O custo da porta de entrada, medido

```
CLAUDE.md 7,6k + SPRINT_ORDER 135k + COMO-OLHAR-A-TELA 29k + ONDE-PARAMOS 19k
+ COMO-EXECUTAR 10k + COMO-REGER 9,7k + COMO-COORDENAR 10k + OS-PAPEIS 10,6k
= 232 KB ~ 58 k tokens, antes de olhar uma linha de código
```

`SPRINT_ORDER.md` sozinho — **995 linhas, 135.499 bytes** — é 58 % dessa porta, e
é exatamente onde o fato derrubado sobreviveu ao teste que o derrubou. O
recém-nascido teve de fatiá-lo quatro vezes; uma fatia devolveu 33 KB de uma vez.

`docs/process` tem **444 arquivos `.md` e 9.308.054 bytes**. A lente do advogado
cruzou isso contra os caminhos abertos por 252 agentes em 23-24/08 e mediu **269
arquivos nunca abertos por nenhum deles — 5,3 MiB, ~1,39 milhão de tokens de
material morto**. *(Este cruzamento é da lente; não o refiz — grau: NÃO
VERIFICADO por mim. Os 444 arquivos e os 9,3 MB, sim.)*

### As três mudanças de maior retorno

1. **Todo retorno de agente nasce com destino em disco.** O prompt de qualquer
   agente que não seja escritor termina obrigado a dizer *"este achado vai para
   \<arquivo\>, nesta seção"*, e a fase de materialização roda **dentro** do
   workflow que produziu o achado, não numa leva seguinte. Justificativa: os
   14,3 % de recuperação são exatamente o gasto que essa regra elimina na origem.
   Hoje **33 de 175 retornos (19 %) devolveram um arquivo**.
2. **A segunda lente dispara por gatilho, não por ritual** — o achado sustenta
   mudança em `src/`, ou a primeira lente devolveu discordância. 9,1 % do gasto
   com concordância medida de 9/10.
3. **Commit por tarefa, não commit no fim.** A morte de `exec:Z1` custou 12 das
   13 tarefas e um resgate manual quatro horas depois; a regra da casa
   (*"os portões são cegos a arquivo novo: rode-os depois do `git add`"*) já
   empurra nessa direção e o script de despacho empurra na oposta.

### O remendo na tese

*"Achado em relatório é token queimado"* está quase certo, e não pelo motivo que
parece. O retorno de agente **não é lixo — é o canal de coordenação**: o script
injeta o resultado da Z2 no prompt da Z3 e da Z4, e quem coordena leu 142
retornos e agiu sobre eles. **O achado não morre por ser journal; morre quando o
contexto de quem o leu acaba.** É por isso que a casa gastou 14,3 % em resgate —
e é por isso que a resposta à pergunta do `/clear` é a mesma para as duas: o
destino em disco tem de nascer junto com o achado.

---

## 3. Os agentes que gerariam as sprints funcionaram?

**Funcionaram, e a medição do coordenador se confirma — inclusive por uma segunda
régua.**

```bash
# régua 1: primeira aparição de cada arquivo, incluindo merges -> 29
# régua 2: git log --diff-filter=A (ignora merge por padrão)   -> 24
```
As duas estão certas e medem coisas diferentes; **29** é o número de sprints
nascidas, **24** o de sprints que entraram por commit direto. Nenhuma sem rastro,
nenhuma fora do índice.

### O que isso NÃO prova

1. **Não prova que a sprint diz a verdade.** A `SPRINT_ORDER.md:161` (F8) foi
   citada, rastreada e navegável o dia inteiro publicando um fato que o teste de
   viés da própria casa derrubara por escrito. Citação não é verificação.
2. **Não prova que a execução ficou registrada.** Os **7 relatórios** de
   `docs/process/agentes/2026-08-24/` tinham **zero citações pelo nome do
   arquivo** (medido com `git grep -l -F` por basename); 3 estavam a um salto
   pelo diretório, citado em `SPRINT_ORDER.md:543`. E cinco das nove frentes da
   Onda 0 nunca produziram relatório nenhum.
3. **Não prova que o achado virou sprint.** Numa amostra estratificada de 12 dos
   175 retornos, **9 chegaram ao disco em alguma forma e 3 não** — e dos 9, só 4
   chegaram *como o achado*; os outros 5 foram traduzidos por um segundo agente
   ou pela mão de quem coordena. O padrão que a `O-QUE-FICOU-FORA-01` já escreveu
   se confirma: **quem mediu e executou, materializou; quem mediu e planejou,
   não.** O workflow inteiro dos céticos — 1.196.950 tokens, 28 retornos —
   produziu **zero arquivos novos**.
4. **Não prova que duas sprints não guardam o mesmo fato.** Em
   `radio_da_mesa.py` convivem duas soluções independentes para "o número medido
   está duplicado sem dono" (T5 e Z6-08), escritas por dois agentes que não se
   viram; a atribuição dupla nasceu no documento de coordenação
   (`SPRINT_ORDER.md:222`), e o portão que a pegaria,
   `scripts/check_colisao_de_sprints.py`, ainda não existe. <!-- ref-externa: nasce em INFRA-DE-EXECUCAO-01, ainda não existe -->

**Em uma frase:** a geração de sprints é a parte mais sadia deste processo. O
buraco é a ponta oposta — o que o agente **descobriu enquanto executava** e o
registro de que a entrega teve mordida.

---

## 4. O que foi curado agora, e o que ficou

Aplicado nesta auditoria (uma linha ou um parágrafo, em arquivos que já
existiam):

| arquivo | cura |
|---|---|
| `docs/process/agentes/README.md` | a leva de 24/08 entra na tabela "O que há aqui", com os sete relatórios nomeados — deixam de ser inalcançáveis por navegação |
| `docs/process/agentes/2026-08-24/BERCO-DE-TMP-01-EXEC.md` | o `$HOME` real mascarado em duas linhas; `--check` do sanitizador passa a aprovar a pasta inteira |
| `docs/process/SPRINT_ORDER.md` | F8 (`:161`) perde o fato derrubado e ganha o medido; §0.2 e §0.3 marcam a Onda 0 e a Onda 1 como fechadas, com os commits; o item 18 da fila (já fechado às 04:13) sai riscado |
| `docs/process/COMO-COORDENAR-UMA-LEVA.md` | o parágrafo do `--listar` deixa de chamá-lo de fonte de verdade sem ressalva e traz o comando que separa "em voo" de "já integrada"; o checklist ganha as duas linhas que faltavam |
| `CLAUDE.md` (não versionado) | `# 6645 verdes em 01/08` era fato errado na primeira página que todo Claude lê; e entra o `git log --since=midnight`, que responde "o que fechou hoje" e nunca envelhece |

**Ficou de fora por ser código, e é de quem coordena** (esta auditoria não edita
código):

- `scripts/despachar-agente.sh`, `_listar()`: imprimir
  `git rev-list --count dev..$b` ao lado do nome e rotular `ahead=0` como
  **INTEGRADA (worktree residual)**. É o conserto do defeito favorito desta casa
  — o instrumento que jura verde — dentro da própria infra de processo.
- o mesmo script, `_limpar()`: `git worktree prune` só remove diretório
  inexistente. Sem `git merge-base --is-ancestor` antes, as nove árvores
  integradas (791 MB) ficam para sempre.
- `despachar-agente.sh` copiar o `CLAUDE.md` para a worktree ao criá-la:
  `git check-ignore -v CLAUDE.md` dá `.gitignore:90` — **nenhuma worktree jamais
  o teve**, e toda tarefa que manda "acrescentar linha ao `CLAUDE.md`" pede o
  estruturalmente impossível.
- rodar `sanitizar_saida_de_agente.py --check docs/process/agentes/**` na lista
  de portões do `CLAUDE.md`: `check_anonymity.sh:56` exclui `docs/process/**` de
  propósito, e o sanitizador manual é o único guarda dessa pasta.

---

## 5. Onde as lentes discordaram

**a) A prova de tela de 24/08 existe ou não?** O advogado mediu *"nenhuma linha
em `CONFERIDO-EM.md` para 24/08, o dia de 49 commits"*. Medido de novo:
`git show HEAD:docs/usage/assets/CONFERIDO-EM.md | grep -c "24/08/2026"` dá **1**,
e essa única ocorrência é **dentro da linha de 23/08**, citando a data. O
advogado está certo sobre o que está commitado. A árvore de trabalho de agora,
da leva em voo, **já acrescenta 15 linhas** com o registro do dia. As duas
versões são verdadeiras em réguas diferentes — e a lição é a régua, não o
placar: medir processo contra `HEAD` num dia em que alguém escreve na árvore dá
uma foto que já está velha quando sai.

**b) Quantas vezes o paralelismo acelera?** A lente do que quebrou conta a fase
de execução; o advogado conta a leva inteira: **5,3x na execução, 1,9x no
relógio** (320 min de agente em 169 min). Advogados e conferente são seriais por
construção e valem 109 dos 169 minutos. Quem prometer 9x erra por um fator de 5 —
e a promessa errada é o que faz alguém empilhar nove frentes numa leva que cabia
em cinco. **O paralelismo se justifica pela janela em que ela está fora, não pela
velocidade.**

**c) Qual é o tamanho do gasto?** 22,4 M (a sessão inteira, 19 workflows) e 4,9 M
(só a Onda 0) não se contradizem: são escopos diferentes. Registrado porque as
duas cifras vão aparecer em documentos desta casa e a próxima pessoa vai
tropeçar nelas.

**d) A suíte.** Nenhuma das quatro lentes rodou `pytest` — havia outra leva
escrevendo na árvore, e R2 diz que a suíte é de quem coordena. O número que
circula (**7 vermelhos / 12.097 verdes**) vem do script da leva em voo. **NÃO
VERIFICADO** por esta auditoria.

---

## 6. O que fica para ela

Três perguntas fechadas. Nenhuma é técnica — todas são de produto ou de gosto, e
nenhuma tem resposta certa que a medição já dê.

1. **A segunda lente de verificação (refutador e advogado) passa a rodar por
   gatilho, ou continua rodando sempre?** Medido: 9,1 % do gasto, concordância
   de 9/10, e o único que mordeu salvou uma sprint inteira.
   **(a)** por gatilho — só quando o achado sustenta mudança em `src/` ou a
   primeira lente discordou; **(b)** sempre, como hoje; **(c)** um por leva,
   apontado para o documento que ORDENA a fila, não para as sprints individuais.

2. **`SPRINT_ORDER.md` quebra em dois?** Hoje: 995 linhas, 135 KB, 58 % da porta
   de entrada, e o arquivo onde um fato derrubado sobreviveu.
   **(a)** quebra em "fila viva" (curta) e "histórico das frentes fechadas";
   **(b)** fica inteiro — um arquivo só é mais fácil de não perder.

3. **O que ninguém abre há 30 dias sai da árvore que quem chega varre?**
   ~1,39 milhão de tokens de `docs/process` não foram abertos por nenhum dos 252
   agentes de 23-24/08. **(a)** sim, vai para `docs/process/arquivo/`, medido por
   uso e não por idade; **(b)** não — decisão medida não se move de lugar, nem
   quando ninguém lê.

**E uma que não é pergunta, é aviso.** Em 23-24/08 o repositório ganhou
**10.458 linhas de `src/` e 23.396 de `docs/`** — 2,2 linhas de documento por
linha de produto. Os quinze defeitos de forma foram todos achados por agente
lendo código; **nenhum veio dela usando o produto.** Se a pergunta continua
sendo *"o jogo funciona no cabo e no rádio?"*, o processo de hoje está
respondendo bem uma pergunta vizinha: *"a leva rodou bem?"*.

---

## Ver também

- [COMO-COORDENAR-UMA-LEVA.md](COMO-COORDENAR-UMA-LEVA.md) — o papel de quem
  coordena, e o checklist que esta auditoria corrigiu em dois pontos.
- [2026-08-24-O-QUE-FICOU-FORA-01](sprints/2026-08-24-O-QUE-FICOU-FORA-01-o-que-sessenta-agentes-mediram-e-o-repositorio-nao-guardou.md)
  — a sprint que já mediu o mesmo buraco pelo lado do conteúdo.
- [2026-08-24-RESULTADO-DO-TESTE-DE-VIES-01.md](2026-08-24-RESULTADO-DO-TESTE-DE-VIES-01.md)
  — o experimento pré-registrado contra o próprio trabalho, e a origem do §1.
- [agentes/README.md](agentes/README.md) — a saída bruta de cada leva, e por que
  ela é versionada.
