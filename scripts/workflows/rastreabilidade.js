export const meta = {
  name: 'auditoria-de-rastreabilidade',
  description: 'Cruza o que sessenta agentes mediram contra o que existe no repositorio, e nomeia o que morreu em relatorio',
  phases: [
    { title: 'Extrair' },
    { title: 'Cruzar' },
    { title: 'Fechar' },
  ],
}

// O DIRETÓRIO DOS JOURNALS é por MÁQUINA e por SESSÃO — nunca cravado no
// script. Passe-o via `args` na chamada do Workflow:
//   Workflow({ scriptPath: "scripts/workflows/rastreabilidade.js",
//              args: { jornaisDir: "<caminho até .../subagents/workflows>" } })
// Sem `args.jornaisDir`, o script recusa rodar — é preferível parar cedo a
// varrer um diretório vazio e reportar "nada achado" como se fosse conclusão.
if (!args || !args.jornaisDir) {
  throw new Error(
    "faltou args.jornaisDir — passe o caminho até .../subagents/workflows " +
    "desta sessão (ele muda por máquina e por sessão, por isso não é cravado " +
    "aqui). Ex.: Workflow({scriptPath, args: {jornaisDir: '/home/.../subagents/workflows'}})"
  )
}
const JORNAIS = args.jornaisDir

const CASA = `
PROJETO: /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix (branch dev). Responda SEMPRE em português do Brasil, com acentuação correta — há portão que reprova.

## POR QUE ESTA LEVA EXISTE — o pedido dela, textual

> *"Por isso eu queria agentes lendo o trabalho dos demais, pra ver se tudo foi materializado nas sprints e no sprint order e afins. Pra depois de tudo certo no repo, execução."*

E antes:
> *"Não podemos deixar o trabalho dos agentes morrer na pesquisa. Tudo tem que ter uso aqui dentro."*

**A pergunta desta auditoria é UMA:** o que sessenta agentes MEDIRAM hoje e **não** existe no repositório?

Achado que ficou em relatório é token queimado. Achado que virou sprint é trabalho pago. Sua tarefa é separar os dois, com prova.

## ONDE O MATERIAL ESTÁ, e como ler sem estourar
Os transcritos somam dezenas de MB — **NÃO os leia**. Os achados moram nos \`journal.jsonl\` de cada workflow, tipicamente de 16 KB a 800 KB cada:

    ${JORNAIS}/wf_*/journal.jsonl

Cada linha \`{"type":"result",...}\` traz o retorno de um agente. Use \`jq\` para extrair. **Comece medindo o tamanho antes de abrir**, e prefira \`jq -r 'select(.type=="result") | .result' | head -c N\` a despejar o arquivo.

## REGRAS
- **Você AUDITA. Não conserte código, não edite \`src/\`, não edite teste.** Pode haver outras frentes escrevendo ao mesmo tempo — confira \`scripts/despachar-agente.sh --listar\` antes de mexer em qualquer coisa fora de \`docs/\`.
- **Prove o que afirmar**, com o comando colado. "NÃO VERIFICADO" é MUITO preferível a chute.
- **Não invente achado.** Se um agente mediu algo e você não acha o registro, diga que não achou — pode ser que esteja lá com outro nome.
- **Menos verboso.** Escreva o que morde.
`

phase('Extrair')

const RECORTES = [
  {
    id: 'auditoria-e-consertos',
    wf: 'wf_cbfa4ade-6cb (prova na bancada), wf_7f85e556-6dc (consertos da aba), wf_42319d8c-2f6 (defeitos de forma P1/P3/P4)',
    foco: `Estes três workflows AUDITARAM e CONSERTARAM a aba Configurações e os defeitos de forma transversais.

**O que extrair:** cada achado medido, com o veredito (confirmado/refutado/parcial), o conserto proposto, e **se ele foi executado ou ficou declarado como continuação**. Os executores foram instruídos a NÃO invadir arquivo alheio e a declarar o que faltava — essas declarações são o material mais valioso do seu recorte.

**Preste atenção especial:** vários agentes disseram "não fiz X porque o arquivo é de outro". Cada um desses é um candidato a ponta solta. Liste TODOS.`,
  },
  {
    id: 'planejamento-das-abas',
    wf: 'wf_d6b6fa3f-38b (o planejador universal das onze abas — 784 KB de journal, o maior)',
    foco: `Este workflow teve treze batedores — um por aba mais três transversais — mais um sintetizador, onze escritores, um costurador e um crítico.

**O que extrair:** o que CADA batedor de aba mediu, e o que dele chegou à sprint daquela aba. Os batedores mediram muito mais do que cabe numa sprint; a pergunta é **o que ficou de fora e devia ter entrado**.

**Este journal é grande — 3919 resultados.** Filtre com cuidado: comece pelos agentes com label \`aba:*\` e \`transversal:*\`, e pelo \`sintetizador\`. Use \`jq\` com \`head -c\` para não estourar.

**Preste atenção especial:** os três batedores transversais (invariantes, sprints, specs) mediram coisas que NÃO pertencem a aba nenhuma. Onde elas foram parar?`,
  },
  {
    id: 'simplificacao-e-universalidade',
    wf: 'wf_cb770cf2-cd4 (dono único, tokens, automação — 290 resultados), wf_3655ac5d-274 (universalidade P7/P2/P10 + auditor)',
    foco: `Estes dois mediram o que atravessa o projeto: valores duplicados, peso de documentação, automação, e o que quebra na máquina de outra pessoa.

**O que extrair:** a tese da causa raiz ("a casa vigia o que FAZ e é cega ao que VALE"), as famílias de valor duplicado com contagem, o censo de peso, o inventário de automação, e o censo do \`state_full\` sem leitor.

**Preste atenção especial:** o workflow da simplificação propôs SPRINTS (S1, S2, ...). **Elas existem em disco?** \`ls docs/process/sprints/2026-08-24-*\` — e se não existem, essa é a maior lacuna que você vai achar. Um plano com sprints desenhadas e não escritas é planejamento que morreu em relatório.`,
  },
  {
    id: 'medicoes-de-bancada',
    wf: 'wf_91f8cf87-87e (portas USB e pareamento), wf_2525a79a-333 (correções do crítico), wf_b850e7c4-d76 (materialização)',
    foco: `Estes mediram na bancada VIVA e materializaram documentação.

**O que extrair:** toda MEDIÇÃO feita no aparelho ou no sistema — a cor por rádio com \`btmon\`, o \`physical_location\` das portas, o hub em comum dos três adaptadores, o \`hci1\` bloqueado, os erros de USB. Para cada uma: **ela está registrada num documento versionado, ou só no relatório?**

**A regra da casa que vale aqui:** medição que fica só em comentário de código é dívida; medição que fica só em relatório de agente **desaparece**. As specs são a memória externa dela.

**Preste atenção especial:** medição NEGATIVA também conta — "isto não funciona, e a causa é X" vale tanto quanto uma que funciona. A cor por rádio é o exemplo do dia.`,
  },
]

const EXTRACAO = {
  type: 'object', additionalProperties: false,
  required: ['recorte', 'achados', 'nao_verificado'],
  properties: {
    recorte: { type: 'string' },
    achados: {
      type: 'array', maxItems: 40,
      items: {
        type: 'object', additionalProperties: false,
        required: ['o_que', 'quem_mediu', 'materializado_em', 'estado'],
        properties: {
          o_que: { type: 'string', description: 'o achado, em uma frase densa' },
          quem_mediu: { type: 'string', description: 'o label do agente' },
          materializado_em: { type: 'string', description: 'arquivo do repositorio onde ele vive, ou VAZIO se nao achou' },
          estado: { type: 'string', enum: ['EM-DISCO', 'SO-EM-RELATORIO', 'JA-CONSERTADO', 'NAO-VERIFICADO'] },
        },
      },
    },
    nao_verificado: { type: 'string' },
  },
}

const extracoes = await parallel(RECORTES.map((r) => () =>
  agent(CASA + `

# VOCÊ EXTRAI E RASTREIA: **${r.id}**

**SEUS JOURNALS:** ${r.wf}

${r.foco}

## O MÉTODO
1. **Leia os journals do seu recorte** e extraia os achados. Um achado é uma afirmação medida sobre o produto — não uma opinião nem um resumo.
2. **Para CADA achado, procure onde ele vive no repositório.** Use \`grep -rn\` em \`docs/\`, \`src/\` e \`tests/\`. Uma sprint, um teste, um comentário datado, o CHANGELOG, o \`SPRINT_ORDER\` — qualquer um serve, desde que seja versionado.
3. **Classifique:** \`EM-DISCO\` (achou onde ele vive), \`SO-EM-RELATORIO\` (mediram e não registraram — **é o que esta auditoria existe para achar**), \`JA-CONSERTADO\` (virou código, com o commit), \`NAO-VERIFICADO\` (não conseguiu decidir).
4. **Não confie no nome.** Um achado pode estar registrado com outra palavra. Procure pelo FATO — o número medido, o nome do arquivo citado, a chave — antes de declarar que sumiu.

**Devolva estruturado.** Priorize os achados de maior valor: os que mudam o que o produto faz, os que contradizem algo escrito, e as medições de bancada. Não encha com trivialidade.`, { label: `extrair:${r.id}`, phase: 'Extrair', schema: EXTRACAO, effort: 'high' })))

log(`Extração: ${extracoes.filter(Boolean).length} de ${RECORTES.length} recortes`)

phase('Cruzar')

const soltos = extracoes.filter(Boolean).flatMap((e) =>
  (e.achados || []).filter((a) => a.estado === 'SO-EM-RELATORIO')
    .map((a) => `- [${e.recorte}] ${a.o_que}  (mediu: ${a.quem_mediu})`))

const cruzamento = await agent(CASA + `

# VOCÊ CRUZA A COBERTURA DO REPOSITÓRIO

Quatro auditores rastrearam os achados de sessenta agentes contra a árvore. Você responde a pergunta dela.

## O QUE ELES ACHARAM QUE FICOU SÓ EM RELATÓRIO (${soltos.length} itens)
${soltos.join('\n') || '(nenhum — confirme você mesmo, isso seria surpreendente)'}

## AS EXTRAÇÕES COMPLETAS
${extracoes.filter(Boolean).map((e) => `### ${e.recorte}\n` + (e.achados || []).map((a) => `[${a.estado}] ${a.o_que} → ${a.materializado_em || '(nada)'}`).join('\n') + `\nNÃO VERIFICADO: ${e.nao_verificado}`).join('\n\n')}

## AS QUATRO PERGUNTAS DE COBERTURA

**1. TODA SPRINT ESTÁ NA FILA?** \`ls docs/process/sprints/2026-08-24-*\` contra o que o \`SPRINT_ORDER.md\` cita. Sprint fora da fila é sprint que ninguém vai executar — e o próprio arquivo registra que **114 sprints já estão fora dele**.

**2. TODA DECISÃO DELA ESTÁ REGISTRADA?** Ela tomou decisões hoje: a ordem das ondas (transversal primeiro), o Bluetooth como trilha dela, a classe cosmética pré-aprovada, a frase do cabeçalho removida. Estão em \`docs/data/decisoes-dela.csv\` ou em documento versionado? **Decisão dela que só existe na conversa morre no \`/clear\`.**

**3. TODO DEFEITO DE FORMA TEM DONO?** O \`SPRINT_ORDER\` §0.1 lista os defeitos de forma. Para cada um: qual frente da Onda 0 ou qual sprint de aba o cura? **Defeito de forma sem dono é o que produz onze dialetos do mesmo erro** — é literalmente o motivo de a Onda 0 existir.

**4. O QUE MEDIMOS NA BANCADA E NÃO REGISTRAMOS?** As medições de hoje: a cor por rádio, o \`physical_location\` das portas, o hub em comum, o \`hci1\` bloqueado, os erros de USB, o \`x11_connect_failed\`. Cada uma num documento versionado? **As specs são a memória externa dela** — medição que some é medição que se repete.

## ENTREGA
1. **A lista do que ficou só em relatório**, ordenada pelo custo de perder. É o entregável principal.
2. As quatro respostas de cobertura, com a prova.
3. **O que você recomenda materializar antes de a execução começar** — e o que pode ficar para depois, com o motivo.
4. O que você não conseguiu auditar.`, { label: 'cruzador', phase: 'Cruzar', effort: 'high' })

phase('Fechar')

const fechamento = await agent(CASA + `

# VOCÊ MATERIALIZA O QUE FICOU DE FORA

O cruzamento apontou o que sessenta agentes mediram e não chegou ao repositório:

${cruzamento || '(o cruzamento falhou — leia os journals você mesmo e diga isso no relatório)'}

## O QUE FAZER

**SEU ARQUIVO PRINCIPAL:** \`docs/process/sprints/2026-08-24-O-QUE-FICOU-FORA-01-o-que-sessenta-agentes-mediram-e-o-repositorio-nao-guardou.md\` (crie).

Você PODE também:
- acrescentar linhas em \`docs/data/decisoes-dela.csv\` (decisão dela que não estava registrada);
- acrescentar ponteiros no \`docs/process/SPRINT_ORDER.md\` (sprint fora da fila).

**NÃO edite \`src/\`, nem teste, nem as sprints que outros agentes escreveram.**

## COMO ESCREVER A SPRINT
1. **Cabeçalho**: o que ela é, e a fala dela que a originou.
2. **A tabela do que ficou fora**: o achado, quem mediu, por que não chegou ao disco, e onde ele DEVERIA morar.
3. **Separe três coisas, e a separação é o valor do documento:**
   - o que é **medição** e precisa virar registro datado (as specs são a memória externa dela);
   - o que é **defeito** e precisa virar tarefa com mordida;
   - o que é **decisão dela** e precisa ir para o painel.
4. **O que NÃO vale materializar**, com o motivo. Nem todo achado merece registro — opinião de agente, resumo do que já está escrito, e coisa que outro documento já cobre não devem entrar. **Esta seção protege contra a verbosidade que ela pediu duas vezes para cortar.**
5. **O aceite**: como se sabe que esta sprint fechou.

## AO TERMINAR
\`\`\`
python3 scripts/validar-referencias-docs.py --all
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
\`\`\`
Conserte o que você quebrou. Cole a saída.

**ENTREGA:** o caminho, quantos itens materializou, quantos recusou e por quê.`, { label: 'fechador', phase: 'Fechar', effort: 'high' })

return { extraidos: extracoes.filter(Boolean).length, so_em_relatorio: soltos.length, cruzamento, fechamento }
