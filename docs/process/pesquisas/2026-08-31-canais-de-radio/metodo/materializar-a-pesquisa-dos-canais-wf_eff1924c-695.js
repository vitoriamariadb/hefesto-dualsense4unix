export const meta = {
  name: 'materializar-a-pesquisa-dos-canais',
  description: 'Extrai dos journals dos tres workflows o que NAO virou celula — 72 refutacoes com prova, 27 dossies de fonte e 3 sinteses — e escreve documentos legiveis no repositorio',
  phases: [
    { title: 'Extrair', detail: 'um agente por rodada x tipo: refutacoes e dossies' },
    { title: 'Indice', detail: 'a porta de entrada, com o que cada documento responde' },
  ],
}

const RAIZ = '/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev'
const BRUTO = `${RAIZ}/docs/process/pesquisas/2026-08-31-canais-de-radio/bruto`
const DESTINO = `${RAIZ}/docs/process/pesquisas/2026-08-31-canais-de-radio`

const REGRAS = `
CONTEXTO:
- Repositorio: ${RAIZ} (arvore de DEV). Rode tudo daqui.
- Portugues do Brasil com ACENTUACAO CORRETA em tudo. Ha portao que reprova.
- NUNCA rode install.sh nem install-dev.sh.
- NAO toque em docs/data/mapa-controles.csv, em layout/, em src/ nem em tests/.
  Ha agentes neles agora. Voce SO escreve o arquivo que este prompt manda.
- Nada de MAC real em arquivo versionado: mascara da casa zera os octetos 4 e 5
  (AA:BB:CC:DD:EE:FF vira AA:BB:CC:00:00:FF). Se um transcrito trouxer um MAC
  inteiro, mascare antes de escrever. Ha DOIS portoes que reprovam.
- Verbosidade tem custo medido (regra dela, 21/08): "o dev nao morre no caminho e
  a IA nao chega a um milhao de tokens so de ler um documento". Escreva o que
  morde e corte o resto.

O QUE ACONTECEU HOJE, 31/08/2026, e por que estes documentos existem:
Tres workflows varreram fontes externas atras dos canais de RADIO (Bluetooth)
que faltam no docs/data/mapa-controles.csv. Foram 407 agentes, 27 fontes lidas,
112 propostas — e so 40 sobreviveram a tres ceticos independentes (lente do
endereco, lente do transporte, lente do aparelho). As 40 viraram celula.

**AS 72 REFUTADAS NAO VIRARAM NADA, e essa e a perda que este trabalho evita.**
Elas sao conhecimento NEGATIVO com prova: "tentamos este offset, esta errado, e
eis o arquivo:linha que derruba". Sem elas, a proxima pessoa propoe as mesmas 72
coisas e paga os mesmos 407 agentes para descobrir o mesmo.

COMO LER OS DADOS (leia com Python, nunca com Read — sao megabytes):
Os journals estao em ${BRUTO}/journal-wf_*.jsonl, um JSON por linha.
Cada linha tem {type, agentId, key, result}. Interessam as de type == "result".
O campo "result" e um dict, e a FORMA dele diz que agente era:
  - {fonte, alcancou, achados, divergencias}  -> um DOSSIE DE FONTE
  - {propostas: [...]}                        -> um propositor
  - {refutada, porque, correcao}              -> um CETICO
  - string                                    -> a sintese da rodada
Os resultados estruturados finais estao em ${BRUTO}/resultado-*.json, no campo
["result"], com fontes, total_propostas, sobreviveram, celulas e relatorio.

O casamento entre uma refutacao e a proposta que ela derruba nao esta explicito
no journal: use a ORDEM e o conteudo. Se nao conseguir casar com certeza, diga
isso no documento em vez de inventar o par — e uma refutacao sozinha ja vale,
porque o texto dela cita a proposta que ataca.
`

const RODADAS = [
  { k: 'r1', arq: 'journal-wf_82d96300-e59.jsonl', res: 'resultado-w6f1jxfra.json', nome: 'rodada 1',
    fontes: 'kernel hid-playstation.c, SDL, pydualsense, dualshock-tools, dualsense-ts + Senshi, DualSense-Windows, hid-nintendo + engenharia reversa do Switch, 8BitDo, steam-devices',
    saldo: '43 propostas, 13 sobreviveram, 30 refutadas' },
  { k: 'r2', arq: 'journal-wf_be4d2607-8ce.jsonl', res: 'resultado-wzuxu703q.json', nome: 'rodada 2',
    fontes: 'as MESMAS nove da rodada 1, sobre outras 20 lacunas',
    saldo: '25 propostas, 11 sobreviveram, 14 refutadas' },
  { k: 'r3', arq: 'journal-wf_bb551be6-318.jsonl', res: 'resultado-w67p1y0q2.json', nome: 'rodada 3',
    fontes: 'NOVE FONTES INEDITAS: DS5Dongle a fundo, yuzu/Eden, Dolphin, Cemu, RPCS3 (handler nativo de DualSense), OpenRGB, LKML por espelho, BlueZ/HIDP/L2CAP, 8BitDo por xpadneo/fwupd',
    saldo: '44 propostas, 16 sobreviveram, 28 refutadas' },
]

phase('Extrair')
log(`Extraindo de ${RODADAS.length} journals: as refutacoes e os dossies de fonte`)

const TRABALHOS = []
for (const r of RODADAS) {
  TRABALHOS.push({
    id: `refutacoes:${r.k}`,
    saida: `${DESTINO}/refutadas-${r.k}.md`,
    p: `Escreva **${DESTINO}/refutadas-${r.k}.md** — as refutacoes da ${r.nome} (${r.saldo}).

Leia ${BRUTO}/${r.arq} com Python. Pegue TODA linha type=="result" cujo result tenha o campo "refutada".

O DOCUMENTO E UMA LISTA DO QUE NAO SE DEVE PROPOR DE NOVO. Para cada refutacao que
derrubou uma proposta (refutada == true), escreva:
  - **o que foi proposto** (a refutacao cita; extraia dali)
  - **por que caiu**, com o arquivo:linha que o cetico conferiu — este e o valor
  - **a licao transferivel**, quando houver: "todo offset de radio do Pro que vier
    do X esta errado porque Y" vale mais que o caso individual

AGRUPE POR PADRAO DE ERRO, nao por ordem de chegada. Os padroes que eu ja vi nos
dados: valor do CABO apresentado como de RADIO; numero de um controle colado na
linha de outro; fonte citada que o grep na arvore nao acha; conversao de uma
contradicao ABERTA da casa em fato; endereco arquivo:linha que nao confere.
Se voce achar outros padroes, eles mandam.

**Uma refutacao que NAO derrubou (refutada == false) tambem interessa** quando o
texto dela acrescenta conferencia — cite-a na secao de quem sobreviveu raspando.

Comece com uma tabela de contagem por padrao, para quem tem dois minutos.`,
  })
  TRABALHOS.push({
    id: `dossies:${r.k}`,
    saida: `${DESTINO}/fontes-${r.k}.md`,
    p: `Escreva **${DESTINO}/fontes-${r.k}.md** — os dossies das fontes da ${r.nome}.

Fontes desta rodada: ${r.fontes}

Leia ${BRUTO}/${r.arq} com Python. Pegue TODA linha type=="result" cujo result
tenha os campos {fonte, alcancou, achados}.

**O VALOR ESTA NO QUE SOBROU.** Cada agente leu uma fonte INTEIRA e devolveu tudo
que viu; so o que casava com as 30 lacunas pedidas virou proposta. O resto — que
pode ser a metade — nunca foi lido por ninguem. Este documento e onde ele passa a
existir.

Para cada fonte: o que ela e, o que foi lido (arquivo e commit, quando houver), e
os achados COM endereco, agrupados por assunto (reports de entrada, reports de
saida, CRC e envelope, audio, IMU, LEDs, rumble, identidade...).

**MARQUE o que ja virou celula no mapa e o que NAO virou** — o segundo grupo e a
lista de trabalho de quem vier. Para saber o que virou, leia
${BRUTO}/${r.res}, campo ["result"]["celulas"].

**As divergencias entre fontes ficam em secao propria, sem escolher lado.** Ja
sei de uma: DS5Dongle e Senshi discordam sobre o arranjo do MESMO report 0x39, e
o Senshi CITA o DS5Dongle — nao e testemunha independente. Se houver outras,
elas sao achado.`,
  })
}

const resultados = await parallel(TRABALHOS.map(t => () =>
  agent(REGRAS + '\n\n---\n\n' + t.p +
    '\n\nEscreva o arquivo com a ferramenta Write. NAO escreva mais nenhum outro arquivo. ' +
    'Ao terminar, devolva em UMA linha: o caminho, o numero de itens que o documento cobre, ' +
    'e a coisa mais valiosa que voce achou e que ninguem tinha lido ainda.',
    { label: t.id, phase: 'Extrair' })
)).then(rs => rs.filter(Boolean))

log(`${resultados.length}/${TRABALHOS.length} documentos escritos`)

phase('Indice')
const indice = await agent(REGRAS +
  `\n\n---\n\nEscreva **${DESTINO}/LEIA-PRIMEIRO.md** — a porta de entrada desta pasta.

Os seis documentos irmaos acabaram de ser escritos por outros agentes; eis o que
cada um relatou:

${resultados.map((r, i) => `${i + 1}. ${TRABALHOS[i].id} -> ${String(r).slice(0, 400)}`).join('\n')}

O QUE O INDICE PRECISA TER:
1. **O que esta pasta e, em tres linhas** — a pesquisa de 31/08/2026 sobre os
   canais de radio, 407 agentes, 27 fontes, 112 propostas, 40 celulas.
2. **Uma tabela: pergunta -> onde esta a resposta.** Quem chega quer saber "ja
   tentaram X?" e "o que a fonte Y sabe?". A tabela responde as duas.
3. **O CUSTO DE NAO LER ISTO**, com numero: 407 agentes e 148 MB de transcrito
   para produzir 40 celulas. Propor de novo o que ja foi refutado paga esse preco
   duas vezes.
4. **O que continua sem resposta**, com ponteiro para
   docs/process/sprints/2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md — os 23
   ensaios de bancada, que e o que so a medicao com o aparelho na mesa resolve.
5. **Onde mora o bruto e o que ele custa em tokens**, para a proxima IA nao abrir
   um journal de 1,4 MB por engano. Diga o comando de Python que filtra.

Leia os seis arquivos que os outros escreveram antes de escrever este — o indice
tem de bater com o conteudo deles, e conferir isso e trabalho seu.

Devolva em UMA linha o caminho e quantos documentos o indice cobre.`,
  { label: 'indice', phase: 'Indice' })

return { documentos: TRABALHOS.map(t => t.saida), relatos: resultados, indice }
