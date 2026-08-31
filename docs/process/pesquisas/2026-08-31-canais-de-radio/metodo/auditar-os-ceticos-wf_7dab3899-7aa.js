export const meta = {
  name: 'auditar-os-ceticos',
  description: 'Audita o trabalho dos proprios ceticos: as 20 celulas que sobreviveram com um dissidente e as 19 refutacoes sem endereco conferivel',
  phases: [
    { title: 'Auditar', detail: 'um auditor independente por alvo, indo ao fonte' },
    { title: 'Veredito', detail: 'consolida e responde: da para confiar antes da bancada?' },
  ],
}

const RAIZ = '/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev'

const REGRAS = `
CONTEXTO OBRIGATORIO:
- Repositorio: ${RAIZ} (arvore de DEV). Rode tudo daqui.
- Portugues do Brasil com acentuacao correta em tudo.
- NUNCA rode install.sh nem install-dev.sh. NAO ESCREVA EM ARQUIVO NENHUM do
  repositorio — voce DEVOLVE um veredito; quem aplica e quem coordena. Ha
  agentes editando a arvore agora.
- Nada de MAC real no que voce escrever: mascara da casa zera os octetos 4 e 5.

QUEM VOCE E, E POR QUE EXISTE:
Hoje, 31/08/2026, tres workflows com 407 agentes leram 27 fontes externas atras
dos canais de RADIO (Bluetooth) que faltavam no docs/data/mapa-controles.csv.
Cada proposta passou por TRES ceticos independentes, e 72 das 112 cairam.

**Ninguem auditou os ceticos.** E a dona do projeto disse, com estas palavras:
*"eu tenho medo do trampo dos agentes estarem incorretos (...) me referia ao
trabalho dos ceticos em si."*

Ela tem razao, e ha um VIES QUE FOI CONSTRUIDO DE PROPOSITO: cada cetico foi
instruido com *"na duvida, refutada=true — esta casa prefere celula vazia a
celula errada"*. Isso protege o mapa de celula falsa, mas produz dois erros
possiveis, e os DOIS custam caro:

  FALSO NEGATIVO — o cetico refutou o que era VERDADE. Custo: o conhecimento
  some, a celula fica VAZIA, e vazio nao levanta suspeita de ninguem, porque
  parece "ninguem perguntou". E o erro mais caro dos dois, e o mais invisivel.

  FALSO POSITIVO — o cetico deixou passar o que era falso, e virou celula. O
  mapa passa a afirmar. O portao NAO pega: ja foi medido quatro vezes hoje que
  o check_paridade_transporte.py e cego ao conteudo de *_offset, *_report_id e
  *_evidencia.

A REGUA DE CONFIANCA da casa: "medido"/"olho-dela"/"descritor" exigem o aparelho
na mesa; "inferido-do-codigo" exige arquivo:linha; "afirmado-no-doc" e o grau
fraco. Leitura de fonte externa produz no MAXIMO "inferido-do-codigo".

ANCORAS MEDIDAS (use, mas confira):
- DualSense por radio: entrada e saida 0x31 (78 B), com byte de sequencia e
  CRC32 no fim; os campos do 'common' aparecem deslocados +1 em relacao ao cabo
  (0x02, 47 B). Ha uma escada de OUTPUT de 0x32 (141 B) a 0x39 (547 B).
- Pro Controller: entrada 0x30 (completo) e 0x3F (simples); saida 0x01 com
  subcomando. O handshake USB (JC_USB_CMD_*) NAO EXISTE por radio — todo o ramo
  e guardado por joycon_using_usb(), que e 'return hdev->bus == BUS_USB'.
- SN30 em modo Switch: fala o protocolo do Pro; medido que NAO desloca offsets
  por radio.
- O driver que este produto instala esta em assets/dkms/hid-playstation/ e
  assets/dkms/hid-nintendo/ — leia DESSA copia, e diga se ela diverge do
  upstream quando for o caso.
`

const ALVOS = args || []
const DISSIDENTES = ALVOS.filter(a => a.tipo === 'sobreviveu-com-dissidente')
const SEM_ENDERECO = ALVOS.filter(a => a.tipo === 'refutou-sem-endereco')

const VEREDITO = {
  type: 'object',
  required: ['alvo', 'veredito', 'porque', 'foi_ao_fonte'],
  properties: {
    alvo: { type: 'string' },
    veredito: {
      type: 'string',
      enum: [
        'CETICO_CERTO',            // a refutação/dissidência procede
        'CETICO_ERRADO',           // o cético errou — conhecimento verdadeiro foi apagado, ou falso passou
        'CETICO_INCONCLUSIVO',     // o argumento não prova nem desprova
        'SO_A_BANCADA_DECIDE',     // nenhuma leitura de código resolve
      ],
    },
    porque: { type: 'string', description: 'o raciocínio, com arquivo:linha que VOCÊ conferiu contando as linhas' },
    foi_ao_fonte: { type: 'boolean', description: 'true só se você ABRIU o arquivo citado e contou as linhas' },
    o_que_conferi: { type: 'string' },
    custo_se_o_cetico_errou: { type: 'string', description: 'o que se perde ou o que fica errado no mapa' },
    ensaio_que_resolve: { type: 'string', description: 'se só a bancada decide: o que ligar, o que olhar, quanto tempo' },
  },
}

phase('Auditar')
log(`${DISSIDENTES.length} celulas que sobreviveram com dissidente + ${SEM_ENDERECO.length} refutacoes sem endereco`)

const auditados = await parallel([
  ...DISSIDENTES.map(a => () =>
    agent(REGRAS + `
---
## O SEU ALVO: uma celula que SOBREVIVEU, mas com ${a.refutas} de ${a.votos} ceticos refutando

Ela ESTA NO MAPA hoje. A regra do workflow era "sobrevive se menos de 2 refutarem"
— logo esta passou com um dissidente de pe. **Se o dissidente estava certo, ha uma
celula ERRADA no mapa agora, e o portao nao pega.**

CELULA: ${a.id} / coluna ${a.coluna}
VALOR GRAVADO: ${a.valor}
ENDERECO: ${a.endereco}

O QUE O(S) DISSIDENTE(S) DISSERAM:
${a.porques.join('\n\n--- outro cetico ---\n\n')}

**VA AO FONTE.** Abra os arquivos citados, CONTE as linhas, e decida quem tem
razao: a proposta que virou celula, ou o cetico que a refutou. Se citar repo
externo, va la (carregue WebFetch/WebSearch com ToolSearch).

Nao aceite nenhum dos dois de graca. O seu veredito e sobre o CETICO: ele estava
certo em refutar?`,
      { label: `dissidente:${a.id}:${a.coluna}`, phase: 'Auditar', schema: VEREDITO })
  ),
  ...SEM_ENDERECO.map(a => () =>
    agent(REGRAS + `
---
## O SEU ALVO: uma refutacao que derrubou uma proposta SEM citar arquivo:linha

Das 210 refutacoes de hoje, 191 citam endereco conferivel. **Esta e uma das 19
que nao citam** — e por isso e a mais fraca do lote. Ela apagou uma proposta, e
o resultado e uma celula VAZIA no mapa, que ninguem vai questionar.

O QUE O CETICO ESCREVEU:
${a.porque}

${a.correcao ? 'A CORRECAO QUE ELE PROPOS:\n' + a.correcao : ''}

**O SEU TRABALHO:** o argumento dele se sustenta? Um argumento pode estar certo
sem citar endereco — por exemplo, "o aparelho nao tem essa peca" ou "isso e valor
do cabo apresentado como radio" podem ser evidentes. **Mas voce tem de PROVAR
que se sustenta, indo ao fonte.**

Se ele nao se sustenta, diga **o que foi apagado** — a proposta que caiu — e o
que o mapa perdeu com isso.`,
      { label: `sem-endereco:${a.rodada}:${a.n}`, phase: 'Auditar', schema: VEREDITO })
  ),
]).then(r => r.filter(Boolean))

const cont = {}
for (const v of auditados) cont[v.veredito] = (cont[v.veredito] || 0) + 1
const errados = auditados.filter(v => v.veredito === 'CETICO_ERRADO')
const semFonte = auditados.filter(v => !v.foi_ao_fonte)
log(`auditados ${auditados.length}: ${JSON.stringify(cont)}`)
log(`${errados.length} ceticos ERRARAM · ${semFonte.length} auditores nao foram ao fonte`)

phase('Veredito')
const veredito = await agent(REGRAS + `
---
## O VEREDITO FINAL, e ele responde a uma pergunta dela

Voce recebeu ${auditados.length} auditorias independentes do trabalho dos ceticos.

OS VEREDITOS:
${JSON.stringify(auditados, null, 1).slice(0, 90000)}

Escreva, em portugues do Brasil, curto e factual:

1. **O PLACAR**: quantos ceticos estavam certos, quantos erraram, quantos foram
   inconclusivos, quantos so a bancada decide.
2. **CADA CETICO QUE ERROU, nomeado**: qual celula ou proposta, o que se perdeu
   ou o que ficou errado no mapa, e o conserto (gravar o que foi apagado, ou
   apagar o que passou). Esta e a secao que vira trabalho.
3. **OS AUDITORES QUE NAO FORAM AO FONTE** (\`foi_ao_fonte: false\`) — o veredito
   deles vale menos, e isso tem de estar escrito. Quantos, e em quais alvos.
4. **A RESPOSTA DIRETA A ELA**: *"da para confiar no trabalho dos ceticos antes
   da bancada, e em que grau?"* Responda com numero e com a ressalva honesta —
   uma auditoria de ${auditados.length} alvos nao certifica os outros ${210 - auditados.length} vereditos
   que nao foram olhados.
5. **O QUE SO A BANCADA DECIDE**, consolidado: os ensaios que sairam desta
   auditoria, cada um com o que ligar, o que olhar, quanto tempo, e qual celula
   ele move.
6. **O VIES, medido**: a instrucao "na duvida, refutada=true" produziu mais falso
   negativo do que deveria? Com os numeros que voce tem, da para dizer?

NAO escreva em arquivo nenhum. Devolva o texto.`,
  { label: 'veredito', phase: 'Veredito' })

return {
  auditados: auditados.length,
  placar: cont,
  ceticos_errados: errados,
  auditores_sem_fonte: semFonte.length,
  veredito,
}
