export const meta = {
  name: 'canais-bt-fontes-externas',
  description: 'Levanta em repos externos os canais de radio (Bluetooth) que faltam no mapa-controles.csv, e refuta cada proposta antes de aceitar',
  phases: [
    { title: 'Fontes', detail: 'um agente por repo/fonte externa, cada um por um angulo diferente' },
    { title: 'Propor', detail: 'uma proposta de preenchimento por grupo de lacunas' },
    { title: 'Refutar', detail: 'ceticos independentes tentam derrubar cada proposta' },
    { title: 'Sintese', detail: 'consolida o que sobreviveu, com grau de confianca' },
  ],
}

const REGRAS = `
CONTEXTO DA CASA (obrigatorio, e nao e formalidade):
- Repositorio: /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev (arvore de DEV). Rode tudo daqui.
- Idioma: portugues do Brasil com acentuacao correta em TUDO que voce escrever.
- NUNCA rode install.sh nem install-dev.sh. NAO escreva em docs/data/mapa-controles.csv
  nem em nenhum arquivo do repositorio: voce DEVOLVE dados, quem aplica e o orquestrador.
  Outros agentes estao editando a arvore agora.
- A REGUA DE CONFIANCA desta casa, e ela e dura. O campo "de_onde_sei" so aceita:
    medido              -> alguem pos o aparelho na mesa e mediu. Voce NAO pode produzir isto.
    olho-dela           -> a dona da bancada observou. Voce NAO pode produzir isto.
    descritor           -> lido do descritor HID do aparelho dela. Voce NAO pode produzir isto.
    inferido-do-codigo  -> lido do codigo-fonte de um driver/biblioteca. VOCE PODE produzir isto.
    afirmado-no-doc     -> uma pagina afirma, sem que se tenha visto o codigo. Grau FRACO.
    incerto             -> nao se sabe.
  Pesquisa em repo externo produz, no MAXIMO, "inferido-do-codigo" — e so quando voce
  cita arquivo:linha do repo. Sem arquivo:linha, o grau e "afirmado-no-doc".
- REGRA MAIOR: e melhor devolver "nao achei" do que devolver um numero plausivel.
  Esta casa ja pagou caro por afirmacao confiante e falsa; ha memoria escrita sobre isso.
  Se duas fontes divergem, RELATE A DIVERGENCIA — nao escolha uma.
- O que ja se sabe pelo CABO esta em cada lacuna (campos cabo_*). Use como ancora:
  no DualSense o report de saida por cabo e 0x02 (47 B) e por radio e 0x31 (78 B) com
  CRC32 no fim e os mesmos campos deslocados. Um offset de radio costuma ser
  offset_do_cabo + 1 (o byte de sequencia), mas CONFIRME no codigo, nao presuma.
`

const FONTES = [
  { k: 'kernel-hid-playstation', p: `Leia o driver do kernel Linux "hid-playstation.c" (drivers/hid/hid-playstation.c no repo torvalds/linux, e tambem a copia patchada em assets/dkms/hid-playstation/ DESTE repositorio, que voce pode ler direto do disco). Extraia TUDO que ele sabe sobre o DualSense **por BLUETOOTH**, em contraste com o cabo: os report IDs de entrada e de saida, os offsets de cada campo dentro do report de radio, o CRC32 e como e calculado, o byte de sequencia, o handshake/enable que faz o controle sair do modo minimo, e o que o driver NAO implementa.` },
  { k: 'sdl-hidapi-ps5', p: `Leia "SDL_hidapi_ps5.c" do repositorio libsdl-org/SDL. Extraia o que o SDL faz **por Bluetooth** com o DualSense: report IDs, offsets, o pacote de saida completo, os flags de habilitacao (rumble, lightbar, trigger effects, sensores), e como o SDL distingue cabo de radio. Cite arquivo:linha.` },
  { k: 'pydualsense', p: `Leia o repositorio flok/pydualsense (Python). Extraia como ele monta o pacote de SAIDA por Bluetooth: report ID, tamanho, offsets de cada campo, CRC32, e as diferencas em relacao ao cabo. Esta fonte JA e citada em quatro linhas do nosso mapa com a ressalva "extraido da prosa — confira o endereco": entao o seu trabalho tem valor extra, que e dar o arquivo:linha que falta.` },
  { k: 'dualshock-tools', p: `Leia dualshock-tools.github.io (repo dualshock-tools/dualshock-tools.github.io), em especial js/controllers/ds5-controller.js. Ele ja e a fonte de uma linha nossa (a cor do plastico, com o mantenedor confirmando na issue #210). Extraia o que ele sabe sobre reports do DualSense por Bluetooth, feature reports, e calibracao. Cite arquivo:linha.` },
  { k: 'dualsense-ts-e-senshi', p: `Leia nsfm/dualsense-ts e TechAntohere/Senshi. As duas ja sao fontes de uma linha nossa. Extraia o que sabem sobre o layout dos reports do DualSense por Bluetooth — entrada e saida — com arquivo:linha.` },
  { k: 'dualsense-windows', p: `Leia Ohjurot/DualSense-Windows (C++) e, se existir, Paliverse/DualSenseX. Extraia o layout dos reports por Bluetooth: offsets de entrada (sticks, gatilhos, touchpad, IMU, bateria) e de saida (rumble, lightbar, LEDs de jogador, efeitos de gatilho). Cite arquivo:linha.` },
  { k: 'nintendo-pro', p: `O alvo aqui NAO e o DualSense: e o **Nintendo Switch Pro Controller**. Leia o driver "hid-nintendo.c" do kernel (e a copia em assets/dkms/hid-nintendo/ DESTE repositorio, que voce le do disco) mais dekuNukem/Nintendo_Switch_Reverse_Engineering. Extraia o que se sabe **por Bluetooth**: os report IDs (0x3F simples vs 0x30 completo), o handshake USB que NAO existe no radio, os subcomandos, o rumble HD, e os sensores. Nosso mapa tem lacunas em plataforma.handshake_usb@pro, plataforma.vpad@pro, plataforma.nfc@pro, plataforma.distinguir_clone@pro, movimento.imu.perda@pro, plataforma.sniff@pro.` },
  { k: '8bitdo-sn30', p: `O alvo aqui e o **8BitDo SN30 Pro** (e variantes). Procure em: repositorios de firmware e de engenharia reversa do 8BitDo, o driver hid-generic do Linux, relatos de protocolo dos modos (X-input, D-input, Switch, macOS), e o que a documentacao oficial do 8BitDo diz. Extraia o que se sabe sobre o comportamento **por Bluetooth**: report IDs por modo, se ha rumble e como, sticks e sua resolucao, IMU (existe? em que modo?), bateria em degraus, e como distinguir um clone. Nosso mapa tem DOZE lacunas no sn30 — e a hipotese honesta a testar e que varias delas sao "nao tem", nao "nao se sabe".` },
  { k: 'steam-input', p: `Leia ValveSoftware/steam-devices e o que for publico sobre o Steam Input com DualSense por Bluetooth. Extraia: como o Steam distingue os transportes, o que ele consegue fazer por radio e nao por cabo (ou o contrario), e as regras udev que ele instala. Isto importa porque o nosso produto convive com o Steam Input na mesma maquina.` },
]

const FONTE_SCHEMA = {
  type: 'object',
  required: ['fonte', 'alcancou', 'achados'],
  properties: {
    fonte: { type: 'string' },
    alcancou: { type: 'boolean', description: 'true se voce realmente leu a fonte; false se nao conseguiu acessa-la' },
    porque_nao: { type: 'string' },
    achados: {
      type: 'array',
      items: {
        type: 'object',
        required: ['assunto', 'o_que_diz', 'endereco', 'grau'],
        properties: {
          assunto: { type: 'string', description: 'ex.: "report de saida por BT", "offset do giroscopio", "CRC32"' },
          o_que_diz: { type: 'string' },
          endereco: { type: 'string', description: 'repo + arquivo:linha, ou URL exata. Vazio se nao houver.' },
          grau: { type: 'string', enum: ['inferido-do-codigo', 'afirmado-no-doc', 'incerto'] },
        },
      },
    },
    divergencias: { type: 'array', items: { type: 'string' } },
  },
}

phase('Fontes')
log(`Varrendo ${FONTES.length} fontes externas, cada uma por um angulo diferente`)
const sweep = (await parallel(FONTES.map(f => () =>
  agent(REGRAS + '\n\nSUA FONTE:\n' + f.p +
    '\n\nUse WebFetch/WebSearch (carregue-os com ToolSearch) para ler o repositorio; leia tambem do disco o que existir em assets/dkms/ deste repositorio. Devolva SO o que voce de fato leu.',
    { label: `fonte:${f.k}`, phase: 'Fontes', schema: FONTE_SCHEMA })
))).filter(Boolean)

const alcancadas = sweep.filter(s => s.alcancou)
log(`${alcancadas.length}/${FONTES.length} fontes alcancadas; ${sweep.reduce((n, s) => n + (s.achados || []).length, 0)} achados brutos`)
for (const s of sweep.filter(s => !s.alcancou)) log(`NAO ALCANCADA: ${s.fonte} — ${s.porque_nao || 'sem motivo declarado'}`)

const DOSSIE = alcancadas.map(s =>
  `### ${s.fonte}\n` + (s.achados || []).map(a =>
    `- [${a.grau}] ${a.assunto}: ${a.o_que_diz}\n  endereco: ${a.endereco || '(SEM ENDERECO — grau cai para afirmado-no-doc)'}`
  ).join('\n') +
  ((s.divergencias || []).length ? `\n  DIVERGENCIAS: ${s.divergencias.join(' | ')}` : '')
).join('\n\n')

const LACUNAS = args || []
const grupos = {}
for (const l of LACUNAS) {
  const g = `${l.controle}/${l.familia}`
  ;(grupos[g] = grupos[g] || []).push(l)
}
const GRUPOS = Object.entries(grupos).map(([k, v]) => ({ k, itens: v }))
log(`${LACUNAS.length} lacunas em ${GRUPOS.length} grupos (controle/familia)`)

const PROPOSTA_SCHEMA = {
  type: 'object',
  required: ['propostas'],
  properties: {
    propostas: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'coluna', 'valor', 'grau', 'endereco', 'raciocinio'],
        properties: {
          id: { type: 'string', description: 'o id da lacuna, copiado literalmente' },
          coluna: { type: 'string', description: 'ex.: radio_offset, radio_report_id, radio_canal, radio_evidencia, radio_codigo_ref' },
          valor: { type: 'string', description: 'o texto exato a gravar na celula. Se a resposta honesta for que o aparelho NAO TEM, escreva isso.' },
          grau: { type: 'string', enum: ['inferido-do-codigo', 'afirmado-no-doc', 'incerto'] },
          endereco: { type: 'string', description: 'repo + arquivo:linha que sustenta o valor' },
          raciocinio: { type: 'string' },
          nao_achei: { type: 'boolean', description: 'true quando a resposta honesta e que a fonte externa nao responde esta celula' },
        },
      },
    },
  },
}

const VEREDITO_SCHEMA = {
  type: 'object',
  required: ['refutada', 'porque'],
  properties: {
    refutada: { type: 'boolean' },
    porque: { type: 'string' },
    correcao: { type: 'string', description: 'se a proposta esta quase certa, o valor que voce poria no lugar' },
  },
}

const LENTES = [
  { k: 'endereco', p: 'A LENTE DO ENDERECO: o arquivo:linha citado existe mesmo e diz mesmo o que a proposta afirma? Va conferir a fonte. Endereco que nao confere = proposta refutada.' },
  { k: 'transporte', p: 'A LENTE DO TRANSPORTE: a proposta esta falando do RADIO (Bluetooth) ou copiou um valor do CABO sem perceber? Esta e a confusao mais comum e mais cara nesta casa. Offset de radio que e igual ao do cabo sem justificativa = suspeito.' },
  { k: 'aparelho', p: 'A LENTE DO APARELHO: a proposta atribui ao controle certo? Um valor do DualSense colado numa linha do Pro Controller ou do 8BitDo e refutacao imediata. E o aparelho realmente TEM essa capacidade, ou a resposta honesta seria "nao tem"?' },
]

const resultados = await pipeline(
  GRUPOS,
  g => agent(REGRAS +
    '\n\nO DOSSIE DAS FONTES EXTERNAS (foi levantado agora, por nove agentes; e tudo que voce tem):\n' + DOSSIE +
    '\n\nAS LACUNAS DESTE GRUPO (' + g.k + '), do nosso docs/data/mapa-controles.csv:\n' +
    JSON.stringify(g.itens, null, 1) +
    '\n\nPara CADA lacuna e CADA coluna listada em "faltam", proponha o valor da celula — ou marque nao_achei=true. ' +
    'Voce pode e deve ler o codigo DESTE repositorio (src/, assets/dkms/) para cruzar. ' +
    'Prefira "nao achei" a um numero plausivel: um valor errado neste mapa vira afirmacao forte e o portao ' +
    'scripts/check_paridade_transporte.py a propaga. Quando a resposta honesta for que o aparelho NAO TEM a capacidade, diga isso.',
    { label: `propor:${g.k}`, phase: 'Propor', schema: PROPOSTA_SCHEMA }),
  (res, g) => {
    const props = ((res && res.propostas) || []).filter(p => !p.nao_achei)
    if (!props.length) return []
    return parallel(props.map(p => () =>
      parallel(LENTES.map(L => () =>
        agent(REGRAS + '\n\n' + L.p +
          '\n\nA PROPOSTA A REFUTAR:\n' + JSON.stringify(p, null, 1) +
          '\n\nTente DERRUBA-LA. Confira a fonte de verdade. Na duvida, refutada=true — ' +
          'esta casa prefere uma celula vazia a uma celula errada.',
          { label: `refutar:${L.k}:${p.id}:${p.coluna}`, phase: 'Refutar', schema: VEREDITO_SCHEMA })
      )).then(vs => {
        const bons = vs.filter(Boolean)
        const refutas = bons.filter(v => v.refutada).length
        return { ...p, sobreviveu: bons.length > 0 && refutas < 2, votos: bons.length, refutas, porques: bons.map(v => v.porque) }
      })
    ))
  }
)

const todas = resultados.filter(Boolean).flat().filter(Boolean)
const sobreviveram = todas.filter(p => p.sobreviveu)
log(`${todas.length} propostas verificadas; ${sobreviveram.length} sobreviveram a refutacao por 3 lentes`)

phase('Sintese')
const sintese = await agent(REGRAS +
  '\n\nAs propostas que SOBREVIVERAM a refutacao adversarial por tres lentes independentes:\n' +
  JSON.stringify(sobreviveram, null, 1) +
  '\n\nAs que CAIRAM (para voce saber o que NAO afirmar):\n' +
  JSON.stringify(todas.filter(p => !p.sobreviveu).map(p => ({ id: p.id, coluna: p.coluna, refutas: p.refutas, porques: p.porques })), null, 1) +
  '\n\nEscreva o relatorio final para a dona do projeto, em portugues do Brasil, curto e factual:\n' +
  '1. quantas celulas ganham valor, por controle;\n' +
  '2. a tabela id / coluna / valor / grau / endereco das que sobreviveram;\n' +
  '3. as lacunas que continuam VAZIAS e por que — separando "nenhuma fonte externa sabe" de "o aparelho nao tem";\n' +
  '4. as divergencias entre fontes que voce viu, sem escolher lado;\n' +
  '5. o que so uma medicao com o aparelho na mesa resolveria — porque isso vira ensaio para a bancada dela.\n' +
  'NAO escreva no CSV. Devolva o texto.',
  { label: 'sintese', phase: 'Sintese' })

return { fontes_alcancadas: alcancadas.map(s => s.fonte), nao_alcancadas: sweep.filter(s => !s.alcancou).map(s => s.fonte), total_propostas: todas.length, sobreviveram: sobreviveram.length, celulas: sobreviveram, relatorio: sintese }
