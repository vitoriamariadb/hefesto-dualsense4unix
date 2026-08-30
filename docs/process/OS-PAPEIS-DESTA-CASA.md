# Os papéis desta casa

**O índice que faltava.** Cada papel de agente — batedor, conferente, crítico,
advogado do diabo... — já existia, mas espalhado dentro de prompts de
workflows diferentes, nenhum nomeado num lugar só. Este documento nomeia,
resolve os apelidos divergentes e diz quando usar cada um.

Catalogado por medição direta dos journals de **23–24/08/2026**
(`subagents/workflows/wf_*/journal.jsonl` cruzados com os `agent-*.jsonl` de
cada workflow) mais os dois workflows salvos em `scripts/workflows/`. Onze
papéis nomeados, um achado que a lista original não previa.

Irmão de [COMO-REGER-AGENTES.md](COMO-REGER-AGENTES.md) (as quatro regras de
paralelismo) e de [COMO-EXECUTAR-UMA-SPRINT.md](COMO-EXECUTAR-UMA-SPRINT.md) (o
protocolo de quem executa). **Quem coordena** tem papel próprio, com detalhe em
[COMO-COORDENAR-UMA-LEVA.md](COMO-COORDENAR-UMA-LEVA.md) — este arquivo aqui é
o índice, aquele é o manual.

---

## Como ler esta tabela

Cada papel: **nome** · **pergunta que responde** · pode / não pode fazer ·
quando entra · exemplo real. Escaneie, não leia corrido.

---

## (a) Papéis de MEDIR

### Batedor

- **Pergunta:** o que está errado ou incompleto nesta fatia estreita (uma aba,
  uma frente)?
- **Pode:** ler código, montar GTK offscreen, `grep`, rodar teste do próprio
  escopo, medir na bancada se ela não estiver medindo.
- **Não pode:** editar `src/`, rodar a suíte inteira, tocar aba ou arquivo
  alheio, fotografar (`retratar_abas.py` é de quem coordena — R4 de
  [COMO-REGER-AGENTES.md](COMO-REGER-AGENTES.md)). Desde 24/08/2026 isso é
  portão, não combinado: o `pre-commit` recusa commit de `app/`, `gui/` ou
  `scripts/gui-captura` sem foto junto (`scripts/check_fotos_da_tela.py`).
- **Quando:** fase 1 de toda leva de medição, em paralelo, um por fatia.
- **Exemplo:** `wf_d6b6fa3f-38b`, label "batedor da aba Status"
  (`agent-a0cdb6641a79f7dad`): achou o rótulo de Hz do giroscópio nunca
  empacotado num container (`controller_card.py:2598-2606`).

**Variante — Provador** (mesmo papel, não é papel novo): responde "esta
AFIRMAÇÃO com ID se sustenta no aparelho real?" em vez de auditar livre. Usa
mutação temporária revertida, provada por `git status --porcelain`. Entra
quando já existe uma lista de hipóteses A1..A7 a confirmar/refutar na bancada
viva. Exemplo: `wf_cbfa4ade-6cb`, `agent-a07e7ef8b9b54383a`, id
`A1-refresh-sem-chamador`.

### Extrator (rastreabilidade)

- **Pergunta:** o que os agentes desta frente MEDIRAM, e chegou ou não ao
  repositório? Classifica em EM-DISCO / SÓ-EM-RELATÓRIO / JÁ-CONSERTADO.
- **Pode:** ler journals, classificar.
- **Não pode:** consertar código, inventar achado sem journal por trás.
- **Quando:** depois que os workflows de execução terminaram, um por frente.
- **Exemplo:** `wf_d6699b57-29e`, `agent-a73968c1f32bb9f86`, label
  `extrair:planejamento-das-abas`: "Adotei o censo do costurador
  (277/155/62)".

---

## (b) Papéis de SINTETIZAR

### Sintetizador

- **Pergunta:** de cima, com tudo que os batedores viram, qual é o plano de
  execução e em que ordem?
- **Pode:** ler todos os batedores, decidir ondas e trade-offs, marcar frente
  que falhou.
- **Não pode:** editar código, decidir sozinho sem declarar o custo do outro
  lado.
- **Quando:** depois que TODOS os batedores voltaram, antes dos escritores.
  **Dono único** — dois sintetizadores produzem dois planos que se
  contradizem, e a contradição só aparece na execução.
- **Exemplo:** `wf_d6b6fa3f-38b`, `agent-a760512b4b6cfb808`: produziu
  `decisoes_dela` com recomendação + "custo do outro lado" por decisão, e
  marcou três frentes transversais como "esta frente falhou" em vez de
  inventar dado.
- **Mesmo papel, nome de workflow diferente:** o **cruzador** de
  rastreabilidade é este papel aplicado a auditoria — dono único que lê todos
  os extratores e produz a cobertura. Nome canônico fica **sintetizador**.

### Escritor de sprint

- **Pergunta:** como vira um arquivo de sprint executável esta fatia do plano?
- **Pode:** escrever só o arquivo próprio dele.
- **Não pode:** tocar `SPRINT_ORDER.md`, tocar sprint irmã, editar `src/`.
- **Quando:** depois do sintetizador, um por sprint, em paralelo.
- **Exemplo:** `wf_d6b6fa3f-38b`, `agent-a68c6ecdb56bc5259`: escreveu
  `docs/process/sprints/2026-08-24-CONFIGURACOES-FECHA-01-...md`, confirmado
  em disco e citado no `SPRINT_ORDER.md`.
- **Mesmo papel, nome de workflow diferente:** o **fechador** de
  rastreabilidade é este papel aplicado a auditoria. Nome canônico fica
  **escritor de sprint**.

### Costurador *(achado hoje, não estava na lista pedida)*

- **Pergunta:** como a fila nova entra no `SPRINT_ORDER.md` sem apagar o que já
  tinha?
- **Pode:** escrever SÓ o `SPRINT_ORDER.md`, acrescentar seção de topo,
  reconciliar linhas velhas.
- **Não pode:** reescrever o arquivo do zero, tocar sprint individual.
- **Quando:** depois do sintetizador e dos escritores, único dono do
  arquivo-índice. Distinto do escritor (dono de UMA sprint) e do sintetizador
  (decide o plano, não o escreve no índice).
- **Exemplo:** `wf_d6b6fa3f-38b`, `agent-a22bd518b69b279a0`: "VOCÊ É O ÚNICO
  ESCREVENDO NELE AGORA... você ACRESCENTA a fila nova e RECONCILIA a antiga".

---

## (c) Papéis de VERIFICAR

### Conferente

- **Pergunta:** o que os executores DISSERAM ter feito é o que o código de
  fato faz?
- **Pode:** ler o diff, REFAZER a mordida (arrancar a cura, ver reprovar,
  devolver), relatar defeito.
- **Não pode:** consertar o que achar errado — isso é sprint nova, com dono
  próprio.
- **Quando:** depois de N executores consertarem em paralelo, antes do
  crítico.
- **Exemplo:** `wf_7f85e556-6dc`, `agent-ac3a1a078ba273599`: achou que o gesto
  de fechamento ainda ignorava a declaração pendente mesmo depois do
  "conserto" (A3, citado em `COMO-REGER-AGENTES.md`).

### Crítico de completude

- **Pergunta:** o que o plano ou a leva deixou de fora?
- **Pode:** ler o plano inteiro e apontar buraco, sem medir de novo o que já
  foi medido.
- **Não pode:** medir do zero, consertar.
- **Quando:** depois do sintetizador (ou depois da leva de execução).
- **Exemplo:** `wf_d6b6fa3f-38b`, `agent-a61e51cdc735b2efe`: achou que a ordem
  da tira de abas do próprio briefing estava errada, contra o `main.glade` e a
  foto — três batedores independentes já tinham achado o mesmo.

### Cético

- **Pergunta:** este achado JÁ FORMULADO, com prova, se sustenta? (lente de
  CONFIRMAÇÃO — recebe o achado pronto)
- **Pode:** tentar ativamente refutar (procurar chamador que faltou, condição
  já tratada, instrumento errado). Duas lentes: código e uso real.
- **Não pode:** inventar achado novo, consertar.
- **Quando:** depois de um achado nascer (batedor/provador), dois céticos por
  achado.
- **Exemplo:** `wf_cbfa4ade-6cb`: lente código `agent-a52ea6d2032cd4982` e lente
  uso real `agent-a209c60740cdb2220`, mesmo achado (maquina.json apaga
  seções) — os dois confirmaram.
- **Cuidado documentado:** cético que não estreita nada provavelmente não leu
  (A4 de `COMO-REGER-AGENTES.md`); e o próprio
  [PRE-REGISTRO-VIES-01](PRE-REGISTRO-VIES-01-o-teste-contra-o-nosso-proprio-trabalho.md)
  aponta este enquadramento (achado pronto → "isto se sustenta?") como canal
  de contaminação — por isso existe o próximo papel.

### Verificador cego *(braço A do teste de viés)*

- **Pergunta:** esta afirmação se sustenta? — SEM saber se é real ou
  fabricada, nem a proporção de cada uma no lote.
- **Pode:** só verificar; devolver `NAO-CONSEGUI-VERIFICAR` quando não dá.
- **Não pode:** saber a origem ou o autor das afirmações.
- **Quando:** só no experimento de viés, depois que os agentes de campo
  voltaram. **Não é o mesmo papel que o cético** — o cético mede se o achado
  se sustenta; o verificador cego mede se o cético é confiável, corrigindo o
  viés de confirmação que o cético carrega por desenho.
- **Exemplo:** `scripts/workflows/teste-de-vies.js`, label
  `bracoA:verificador-{1,2,3}`: 0/9 falsos positivos, confirmando a régua da
  casa. Resultado consolidado em
  [2026-08-24-RESULTADO-DO-TESTE-DE-VIES-01.md](2026-08-24-RESULTADO-DO-TESTE-DE-VIES-01.md).

### Réplica cega *(braço B do teste de viés)*

- **Pergunta:** o que está errado nesta aba? — sem ler NENHUM documento do
  time, pergunta aberta.
- **Pode:** auditar do zero, com enquadramento próprio.
- **Não pode:** ler `docs/process/`, saber o enquadramento nosso.
- **Quando:** só no experimento de viés.
- **Exemplo:** `scripts/workflows/teste-de-vies.js`, label
  `bracoB:Início/Gatilhos/Perfis`: Jaccard 0,074–0,137 contra os batedores
  contaminados.

---

## (d) Papéis de QUESTIONAR O ENQUADRAMENTO

### Advogado do diabo *(braço C do teste de viés)*

- **Pergunta:** estas TESES estruturais (não fatos individuais) se sustentam?
- **Pode:** argumentar com força máxima contra a premissa, sem critério
  numérico.
- **Não pode:** medir achado isolado, propor conserto de código.
- **Quando:** só quando o plano já tem teses estruturais fixadas.
- **Exemplo:** `scripts/workflows/teste-de-vies.js`, label
  `bracoC:advogado-do-diabo`: achou que a "0.999" citada no plano não existe
  em `CHANGELOG.md`/`pyproject.toml` — duas teses derrubadas.
- **Nome resolvido:** "advogado da premissa" é o mesmo papel, apelido
  descritivo (ataca premissa, não fato) — não existe um segundo journal com
  esse rótulo fora deste próprio catálogo. **Fica um nome só: advogado do
  diabo.**

---

## Quem coordena

Não é um papel de agente — é quem despacha, monta o briefing, arbitra posse de
arquivo e fecha a leva com foto e portão. Um conferente de `wf_7f85e556-6dc`
chamou esse papel de **"o maestro"**; o nome de trabalho nesta casa é **quem
coordena**. Detalhe completo, com as cicatrizes que o definem, em
[COMO-COORDENAR-UMA-LEVA.md](COMO-COORDENAR-UMA-LEVA.md).

---

## Ver também

- [COMO-REGER-AGENTES.md](COMO-REGER-AGENTES.md) — as quatro regras de
  paralelismo que valem para todo papel acima.
- [COMO-EXECUTAR-UMA-SPRINT.md](COMO-EXECUTAR-UMA-SPRINT.md) — o protocolo do
  executor, do começo ao fim.
- [COMO-COORDENAR-UMA-LEVA.md](COMO-COORDENAR-UMA-LEVA.md) — o manual de quem
  coordena.
- [PRE-REGISTRO-VIES-01](PRE-REGISTRO-VIES-01-o-teste-contra-o-nosso-proprio-trabalho.md)
  e
  [2026-08-24-RESULTADO-DO-TESTE-DE-VIES-01.md](2026-08-24-RESULTADO-DO-TESTE-DE-VIES-01.md)
  — o desenho e o resultado do experimento que originou o cético, o
  verificador cego, a réplica cega e o advogado do diabo.
- `scripts/workflows/teste-de-vies.js` e `rastreabilidade.js` — os prompts
  exatos de cada papel medido neste catálogo.

---

## O PAPEL QUE VALE PARA TODOS: quem mexe na tela, abre a tela

**Regra dela, 29/08/2026, e ela é sobre o AGENTE, não sobre a ferramenta:**

> *"o que eu quero é que **o Claude faça isso**"* — sobre dirigir a interface,
> clicar e validar se o problema foi resolvido ou se a mudança traz regressão.

**Este documento é versionado e viaja em worktree; o `CLAUDE.md` não** (é
`.gitignore`, e `git worktree add` não copia arquivo ignorado). Por isso a regra
mora aqui: é o único lugar onde o agente despachado vai encontrá-la.

A interface nova é o mockup HTML dentro de um `WebKit2.WebView`, e isso a torna
**dirigível por dentro** — `run_javascript` clica, lê o DOM, mede geometria e
espera o tempo passar, sem tocar no mouse dela.

**Se o seu trabalho toca a interface, o relatório sem estas três coisas está
incompleto:**

| | O que é | Por quê |
|---|---|---|
| **A foto** | antes e depois, sempre `--oculta` | ela tem UMA tela; janela na frente dela quebra o que ela está fazendo |
| **O clique** | você acionou o que mudou e mostrou a resposta | botão acrescentado e nunca clicado não está entregue |
| **A mordida** | você quebrou a própria cura e viu reprovar | régua que passa com a cura arrancada não mede nada |

```bash
novo-layout/_ferramentas/controles_vivos.py --oculta --segundos 3 --foto /tmp/x.png
novo-layout/_ferramentas/controles_vivos.py --oculta --segundos 5 --prova-gesto
novo-layout/_ferramentas/controles_vivos.py --oculta --sem-ponte          # a mordida
novo-layout/_ferramentas/controles_vivos.py --oculta --arranca-enderecos  # a outra
```

**O caso que prova a regra, e é de 29/08:** o `--prova-gesto` **nunca clicava** o
botão do microfone nem o do alto-falante. Dava **verde sobre dois botões mortos**,
e ninguém viu até alguém ampliar a régua de propósito. *Uma validação de interface
que não cobre o botão novo é uma validação que mente.*

**E a régua tem de viver no TEMPO.** Uma que roda o tique uma vez mede um
INSTANTE, não um comportamento: em 29/08 uma leva introduziu regressão visível só
aos **181 segundos**, com 67 testes verdes.

**O Playwright não substitui isto.** Ele dirige o mockup num Chrome headless
(`novo-layout/_ferramentas/olhar.py`) — serve para layout, `:hover` e fotografar o
DESENHO. Ele **não alcança o WebKitGTK**. A ponte JS testa o motor que ela vai
usar, com o daemon vivo.
