# Como coordenar uma leva

**Você é quem coordena. Este arquivo é o seu papel, do começo ao fim.**

O irmão que faltava na trinca:
[COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md) ensina a medir a tela sem sofrer;
[COMO-REGER-AGENTES.md](COMO-REGER-AGENTES.md) dá as quatro regras que valem
para **todo** agente, você incluído; [COMO-EXECUTAR-UMA-SPRINT.md](COMO-EXECUTAR-UMA-SPRINT.md)
é o protocolo de quem executa. **Este não repete nenhum dos três** — nem a
medição, nem R1-R4, nem o passo a passo do executor. Ele diz o que só cabe a
quem vê mais de um agente, mais de um workflow ou mais de um dia ao mesmo
tempo, porque é isso — e só isso — que esta função faz que um executor não faz.

Medido contra 21 commits e um dia inteiro de trabalho (23-24/08/2026); a fonte
primária é [2026-08-23-ONDE-PARAMOS](2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md).

---

## O que é coordenar, em uma frase

**Coordenar é o trabalho que exige ter mais de uma fonte aberta ao mesmo
tempo** — dois workflows, dois documentos, dois dias — **e decidir algo que
nenhuma das fontes, sozinha, tinha como decidir.** Reconciliar duas taxonomias
de defeito que nenhum dos dois workflows que as produziu sabia que divergiam.
Achar a versão citada em oito documentos que não existe. Desconfiar de um
portão que sempre disse "verde" e medir com as próprias mãos se ele testa o
que promete. Perguntar se o enquadramento do próprio pedido está certo antes
de despachar alguém para executá-lo — que foi exatamente o que o teste de
viés mediu que o sistema, sozinho, não faz (§ "Quando rodar o teste de viés").
Um agente executor lê a própria sprint; quem coordena é a única posição que lê
todas ao mesmo tempo.

---

## O ciclo de uma leva

```
medir  →  desenhar/planejar  →  despachar  →  conferir  →  integrar
```

**Medir.** Fato que muda a ORDEM da fila ou a prioridade de uma decisão, você
mede com as próprias mãos e cola o comando — é o que sustenta uma decisão
dela, e decisão errada por medição de segunda mão já custou caro nesta casa.
Fato de escopo único (uma aba, um arquivo) é trabalho de batedor.

**Desenhar/planejar.** O plano tem **um dono só** — você. Dois sintetizadores
produzem dois planos que se contradizem, e a contradição só aparece na
execução, que é o preço mais caro de todos.

**Despachar.** `scripts/despachar-agente.sh <sprint> <agente>` gera a árvore,
o `PYTHONPATH`, lê a bancada e a posse declarada, e **imprime o preâmbulo
pronto** — cole-o no início do prompt do agente sem reescrever nada. Ver
§"Quando disparar workflow vs. agente único vs. fazer à mão" para escolher a
unidade certa antes de despachar.

**Conferir.** Não é ler o relatório do agente e acreditar — é **refazer a
mordida**: rodar o teste dele arrancando e devolvendo a cura, dentro do
worktree dele (`source .envrc-voo` primeiro). Foi a conferência, não o
executor, que achou A3 em 23/08 (COMO-REGER-AGENTES.md) — quem escreveu a
cura acredita nela.

**Integrar.** Ver a seção dedicada abaixo — hoje é passo manual, porque a
peça que o automatiza ainda não existe.

---

## Quando disparar um workflow vs. um agente único vs. fazer à mão

| se a pergunta... | use |
|---|---|
| cruza mais de uma fonte grande (várias sprints, vários dias de journal, código + documento) e tem fases naturais (coletar → sintetizar) | **workflow** — `scripts/workflows/*.js` são o molde: `rastreabilidade.js` (extrair → cruzar → fechar), `teste-de-vies.js` (braços em paralelo → síntese) |
| cabe num escopo de arquivo(s) só, com uma pergunta e uma resposta que cabe num relatório de quatro cabeçalhos | **agente único** via `despachar-agente.sh` — é o caso comum, a maioria das 22 sprints |
| é decisão de dono dela, reconciliação entre duas fontes que só você tem abertas ao mesmo tempo, ou muda a ORDEM da fila | **você, à mão** — nenhum agente tem a posição para decidir isso; despachar um agente para "decidir a ordem" só empurra a decisão para depois, com menos contexto |

Regra prática: se a resposta certa depende de **ver duas coisas ao mesmo
tempo que hoje moram em lugares diferentes**, é sua ou é workflow. Se depende
de **ver uma coisa a fundo**, é agente único.

---

## A integração das árvores em voo

`scripts/despachar-agente.sh --listar` é a fonte de verdade — ele só lê
`git worktree list`, que o git mantém sozinho e nenhum agente pode esquecer de
atualizar:

```
$ scripts/despachar-agente.sh --listar
EM VOO — segundo o git, que é quem mantém este registro:
  refs/heads/voo/ONDA0-Z0-exec  ->  ../hefesto-voo/ONDA0-Z0-exec
  ...
```

**Antes de integrar qualquer branch `voo/*`, confira — não confie:**

1. o relatório de quatro cabeçalhos existe em `docs/process/agentes/` (§7 de
   COMO-EXECUTAR-UMA-SPRINT.md) — sem ele, a entrega não teve mordida provada;
2. dentro do worktree dele (`source .envrc-voo`), rode o teste do escopo dele
   e confira que a saída de reprovar→passar está colada na entrega, não só
   afirmada;
3. `git diff dev...voo/<branch> --stat` — o que ele tocou é só o que ele
   possuía?

**A ordem de merge.** Onde a sprint declara `depois_de`/`nao_toca` no
frontmatter (formato de `check_colisao_de_sprints.py` <!-- ref-externa: nasce em INFRA-DE-EXECUCAO-01, ainda não existe -->,
ainda chegando às
sprints de hoje — a maioria não tem), siga isso. Na ausência dele, decida pela
dependência escrita em "Depende de" no corpo da sprint e pela sobreposição de
arquivo: rode `git diff dev...voo/X --stat` de cada par candidato antes de
escolher a ordem, e quem toca um arquivo que outra branch **já integrada**
tocou, integra depois — nunca em paralelo com ela.

**Merge, e o que fazer com conflito:** `git merge --no-ff voo/<branch>`.
**Conflito não se resolve sozinho** — nada de `-X ours`: ele sai barulhento,
nomeando os arquivos, e é você quem decide o lado. Barulho é o produto
desejado (é a F3 de 23/08 deixando de ser silenciosa); sobrescrita silenciosa
era o defeito.

**O que falta, com nome.** `scripts/costurar.sh` <!-- ref-externa: nasce em INFRA-DE-EXECUCAO-01, ainda não existe --> —
o que automatiza os três
passos acima sob `flock`, e move o alvo de merge para `onda/atual` em vez de
`dev` direto — é tarefa **I7-I9 de
[INFRA-DE-EXECUCAO-01](sprints/2026-08-24-INFRA-DE-EXECUCAO-01-o-registro-do-que-esta-em-voo.md)**,
ainda **aberta**. `scripts/bancada.sh` <!-- ref-externa: nasce em INFRA-DE-EXECUCAO-01, ainda não existe -->
(I4/I5/I6, o semáforo com PID vivo e
teto de tempo) também não existe ainda — até lá, R2 e R3 de
COMO-REGER-AGENTES.md continuam valendo ao pé da letra: você roda a suíte
inteira uma vez, no fim, com a leva parada, e checa a bancada à mão antes de
qualquer agente tocar o daemon. Confira `scripts/despachar-agente.sh --help`
e `ls scripts/*.sh` antes de assumir que uma peça chegou — se o comando não
existir na árvore, ele ainda não foi costurado.

---

## Quando rodar o teste de viés de novo

**Vale** quando uma decisão de enquadramento vai reordenar trabalho grande —
não "este achado está certo?" (isso é o cético/advogado do diabo, dentro do
fluxo normal de conferência), mas "o **critério** que gerou o plano inteiro
está certo?". `D-ORDEM-DAS-ONDAS` é o tipo de decisão que justificaria pedir
essa pergunta de novo: ela reformatou a fila de 22 sprints.

**Não vale** como ritual de fim de leva, nem para revalidar um achado
específico. O pré-registro já fixa o critério de parada: **"reauditar só o
que o teste derrubar"**, decisão dela tomada **antes** de qualquer resultado
existir ([PRE-REGISTRO-VIES-01](PRE-REGISTRO-VIES-01-o-teste-contra-o-nosso-proprio-trabalho.md)
§5). Se for rodar de novo, **fixe de novo o que você fará com cada resultado
possível antes de rodar** — decidir depois de ver é como uma medição vira
racionalização, e é a mesma armadilha que o experimento existiu para medir.

---

## Checklist de início de leva

Nesta ordem, parando quando já souber o bastante:

1. **o `ONDE-PARAMOS` mais recente** em `docs/process/` — o que já foi
   medido, para não remedir;
2. **`SPRINT_ORDER.md` §0** — a fila em ondas, as dependências, as decisões
   dela sobre a própria ordem;
3. **`docs/data/decisoes-dela.csv`** — o que já foi decidido não se
   repropõe; o que está `aberta` é o que espera a palavra dela;
4. **`scripts/despachar-agente.sh --listar`** — o que já está em voo, para
   não despachar duas vezes a mesma sprint;
5. **COMO-REGER-AGENTES.md** e **COMO-EXECUTAR-UMA-SPRINT.md**, se ainda não
   internalizados nesta sessão;
6. **COMO-OLHAR-A-TELA.md**, só se o trabalho toca a tela.

---

## Checklist de fim de leva

1. `git add -A` — os portões são cegos a arquivo novo;
2. a suíte inteira (`pytest -q`) e os portões da lista do `CLAUDE.md`, com a
   leva **parada** (R2/R4 de COMO-REGER-AGENTES.md — nenhum agente rodando);
3. `scripts/gui-captura/retratar_abas.py`, se alguma mudança tocou a tela;
4. `scripts/gerar-painel.py --completo` — o estado do projeto, medido agora,
   não herdado de um cache velho;
5. commit;
6. **o que fica registrado para a próxima sessão**, porque um `/clear` apaga
   o que só está na sua cabeça: `SPRINT_ORDER.md` com o que fechou marcado,
   `decisoes-dela.csv` com toda decisão nova que ficou aberta, e um
   `ONDE-PARAMOS` novo se o dia mudou o suficiente para merecer um.

---

## Ver também

- [COMO-REGER-AGENTES.md](COMO-REGER-AGENTES.md) — as quatro regras e as seis
  armadilhas que valem para todo agente.
- [COMO-EXECUTAR-UMA-SPRINT.md](COMO-EXECUTAR-UMA-SPRINT.md) — o protocolo de
  quem executa, do lado de dentro do worktree.
- [COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md) — a foto, os instrumentos, e
  as armadilhas de medição já pagas.
- [INFRA-DE-EXECUCAO-01](sprints/2026-08-24-INFRA-DE-EXECUCAO-01-o-registro-do-que-esta-em-voo.md)
  — a peça que falta (`bancada.sh`, `costurar.sh` <!-- ref-externa: ainda não existem --> ) e o que cada uma resolve.
- [PRE-REGISTRO-VIES-01](PRE-REGISTRO-VIES-01-o-teste-contra-o-nosso-proprio-trabalho.md)
  e o [RESULTADO](2026-08-24-RESULTADO-DO-TESTE-DE-VIES-01.md) — o molde de
  como pré-registrar um experimento sobre o próprio processo.
