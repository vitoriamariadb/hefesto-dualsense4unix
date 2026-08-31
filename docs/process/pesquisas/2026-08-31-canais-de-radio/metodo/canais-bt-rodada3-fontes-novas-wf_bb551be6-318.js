export const meta = {
  name: 'canais-bt-rodada3-fontes-novas',
  description: 'Terceira varredura dos canais de radio: NOVE fontes ineditas (emuladores, OpenRGB, DS5Dongle, LKML, BlueZ) sobre as 30 lacunas que as fontes velhas nao responderam',
  phases: [
    { title: 'Fontes', detail: 'nove fontes que NUNCA foram lidas neste projeto' },
    { title: 'Propor', detail: 'uma proposta por grupo de lacunas' },
    { title: 'Refutar', detail: 'tres ceticos por proposta, cada um com uma lente' },
    { title: 'Sintese', detail: 'o que sobreviveu, e o que so a bancada resolve' },
  ],
}

const REGRAS = `
CONTEXTO (obrigatorio):
- Repositorio: /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev (arvore de DEV). Rode tudo daqui.
- Portugues do Brasil com acentuacao correta em TUDO que voce escrever.
- NUNCA rode install.sh nem install-dev.sh. NAO escreva em arquivo nenhum do repositorio:
  voce DEVOLVE dados; quem aplica e o orquestrador. Ha agentes editando a arvore agora.
- A REGUA DE CONFIANCA. O campo "de_onde_sei" so aceita:
    medido / olho-dela / descritor  -> exigem o aparelho na mesa. VOCE NAO PODE PRODUZIR.
    inferido-do-codigo              -> lido de codigo-fonte, COM arquivo:linha. VOCE PODE.
    afirmado-no-doc                 -> uma pagina afirma, sem codigo visto. Grau FRACO.
    incerto                         -> nao se sabe.
- REGRA MAIOR: e melhor devolver "nao achei" do que um numero plausivel. Esta casa ja pagou
  caro por afirmacao confiante e falsa. Se duas fontes divergem, RELATE — nao escolha.

ISTO E A TERCEIRA RODADA, e o que voce precisa saber para nao repetir trabalho:
Duas rodadas ja varreram NOVE fontes — kernel hid-playstation.c e hid-nintendo.c, SDL,
pydualsense, dualshock-tools, dualsense-ts, Senshi, DualSense-Windows, engenharia reversa do
Switch (dekuNukem), 8BitDo, steam-devices. Elas produziram 68 propostas das quais 44 FORAM
REFUTADAS por ceticos. As 30 lacunas abaixo sao o que ficou: as fontes velhas NAO as respondem,
ou responderam errado.

**NAO releia as nove fontes velhas.** A sua fonte e NOVA, e e por isso que voce existe. Se a sua
fonte so repetir o que o kernel ja dizia, isso tambem e informacao — diga que nao acrescenta.

ANCORAS QUE VALEM (medidas nas duas rodadas, use como piso):
- DualSense por radio: report de entrada 0x31 (78 B), saida 0x31 tambem, com byte de sequencia
  e CRC32 no fim; os campos do 'common' aparecem deslocados +1 em relacao ao cabo (0x02, 47 B).
  Ha uma ESCADA de OUTPUT por radio, de 0x32 (141 B) a 0x39 (547 B).
- Pro Controller: entrada 0x30 (completo) e 0x3F (simples); saida 0x01 com subcomando. O
  handshake USB (JC_USB_CMD_*) NAO EXISTE por radio — todo o ramo e guardado por
  joycon_using_usb().
- SN30 em modo Switch: fala o protocolo do Pro; medido que NAO desloca offsets por radio.
`

const FONTES = [
  { k: 'ds5dongle', p: `**awalol/DS5Dongle** — e a fonte que a rodada 1 descobriu por acidente e nunca foi lida a fundo. Leia src/audio.cpp, src/utils.h e o que houver de protocolo. Ela e um DONGLE que fala L2CAP direto com o DualSense: extraia TUDO sobre o report 0x31 e a escada 0x32-0x39, a cadeia TLV, o CRC32, e o formato do payload de audio. ATENCAO A UMA DIVERGENCIA JA MEDIDA: o DS5Dongle poe o bloco de audio em report[140..341] e o Senshi poe em report[13..412], espelhado — e o Senshi CITA o DS5Dongle, logo nao e testemunha independente. Ache uma terceira leitura que desempate, ou diga que nao ha.` },
  { k: 'emuladores-switch', p: `**Emuladores de Switch** — Ryujinx (Ryujinx/Ryujinx ou os forks vivos) e o que restar de yuzu/suyu. Eles PRECISAM suportar o Pro Controller a fundo, inclusive por Bluetooth, e por isso costumam ter o mapa de reports melhor documentado que o proprio driver do kernel. Extraia: layout do report 0x30 e do 0x3F, os subcomandos de saida, a IMU (offsets, escala, taxa), o rumble HD, os LEDs de jogador e o LED HOME, e o que muda entre cabo e radio. Cite arquivo:linha.` },
  { k: 'dolphin-e-cemu', p: `**Dolphin** (dolphin-emu/dolphin) e **Cemu** — o Dolphin tem uma das melhores implementacoes de HID de gamepad que existem em open source, com backend proprio para DualSense e para o Pro Controller, e ele lida com Bluetooth de verdade (o Wiimote). Leia Source/Core/InputCommon/ControllerInterface/ e o que houver de SDL/hidapi ali. Extraia offsets, report ids e diferencas cabo/radio para DualSense e Pro. Cite arquivo:linha.` },
  { k: 'rpcs3-e-ps3', p: `**RPCS3** (RPCS3/rpcs3) — o emulador de PS3 tem suporte NATIVO a DualSense (nao via SDL), em Input/ds5_pad_handler.cpp e cabecalhos vizinhos. Ele distingue cabo de Bluetooth explicitamente e monta os dois pacotes de saida a mao. Extraia: os dois report ids, os offsets de CADA campo (rumble, lightbar, LEDs de jogador, LED do microfone, gatilhos adaptativos, volume/audio), o CRC32 e o byte de sequencia. Esta e provavelmente a fonte mais rica desta rodada — seja exaustivo.` },
  { k: 'openrgb', p: `**OpenRGB** (CalcProgrammer1/OpenRGB) — esta maquina JA TEM a regra udev dele instalada (/etc/udev/rules.d/60-openrgb.rules). Ele controla a lightbar do DualSense e de outros gamepads. Leia Controllers/SonyGamepadController/ (ou o nome equivalente) e extraia como ele escreve cor por CABO e por BLUETOOTH — offsets, report id, tamanho do pacote, e se ele calcula CRC. Nossas lacunas de luz sao varias.` },
  { k: 'lkml-e-patches', p: `**Linux kernel mailing list e patches** — procure em lore.kernel.org/linux-input pelas series de patch do hid-playstation e do hid-nintendo, e pelas DISCUSSOES delas. A discussao de um patch costuma dizer o que o codigo final NAO diz: por que um offset e aquele, o que o firmware recusa, o que foi medido com sniffer. Procure especificamente por: audio do DualSense por BT, IMU do Pro por BT, o report 0x3F, rumble HD, e clones de terceiros. Cite a mensagem (autor, data, assunto) e o trecho.` },
  { k: 'bluez-e-sniffer', p: `**BlueZ e capturas de HID por Bluetooth** — a documentacao do BlueZ sobre HID over GATT e HIDP, o dissector de HID do Wireshark, e qualquer captura publica de btmon/hcidump com DualSense ou Pro Controller. Extraia o que se sabe sobre o ENVELOPE: como um report HID viaja num canal L2CAP de interrupcao, o que o host acrescenta, e por que os offsets deslocam entre cabo e radio. Isto explica a REGRA, e a regra vale para as linhas que ninguem mediu.` },
  { k: 'godot-e-libs', p: `**Godot Engine** (godotengine/godot, drivers/ e platform/linuxbsd de joypad) e bibliotecas de input: **libgamepad**, **inputs** (Python), **hid-tools** do kernel (bentiss/hid-tools), **game-devices-udev**. Extraia mapas de report e diferencas cabo/radio para DualSense, Pro Controller e controles 8BitDo. O hid-tools em especial tem descritores GRAVADOS de aparelhos reais — se houver um do Pro ou do 8BitDo, isso e ouro.` },
  { k: '8bitdo-fundo', p: `**8BitDo, a fundo** — as duas rodadas anteriores acharam pouco. Cave em: o firmware updater da 8BitDo e o que se sabe do formato dele, o projeto **fwupd** (plugin ebitdo), **TheJayMann/8bitdo-spec**, foruns e issues do Linux sobre o SN30 Pro, o **xpadneo** (atar-axis/xpadneo, que documenta protocolo de gamepad BT em profundidade), e relatos de engenharia reversa dos MODOS (X-input, D-input, Switch, macOS). Nossas 11 lacunas de sn30 sao a maior fatia desta rodada. A hipotese honesta a testar e que varias sejam "o aparelho NAO TEM", e nao "nao se sabe" — se for isso, diga com a evidencia.` },
]

const FONTE_SCHEMA = {
  type: 'object',
  required: ['fonte', 'alcancou', 'acrescenta', 'achados'],
  properties: {
    fonte: { type: 'string' },
    alcancou: { type: 'boolean' },
    porque_nao: { type: 'string' },
    acrescenta: { type: 'boolean', description: 'false se a fonte so repete o que o kernel/SDL ja diziam' },
    achados: {
      type: 'array',
      items: {
        type: 'object',
        required: ['assunto', 'o_que_diz', 'endereco', 'grau'],
        properties: {
          assunto: { type: 'string' },
          o_que_diz: { type: 'string' },
          endereco: { type: 'string', description: 'repo + arquivo:linha, ou URL exata' },
          grau: { type: 'string', enum: ['inferido-do-codigo', 'afirmado-no-doc', 'incerto'] },
          controle: { type: 'string', description: 'dualsense | pro | sn30 | vários' },
        },
      },
    },
    divergencias: { type: 'array', items: { type: 'string' } },
  },
}

phase('Fontes')
log(`Rodada 3: ${FONTES.length} fontes INEDITAS sobre as 30 lacunas que as nove velhas nao responderam`)
const sweep = (await parallel(FONTES.map(f => () =>
  agent(REGRAS + '\n\nSUA FONTE (nenhuma rodada anterior a leu):\n' + f.p +
    '\n\nCarregue WebFetch/WebSearch com ToolSearch. Leia o codigo, nao a descricao do projeto. ' +
    'Devolva SO o que voce de fato leu, com arquivo:linha.',
    { label: `fonte:${f.k}`, phase: 'Fontes', schema: FONTE_SCHEMA })
))).filter(Boolean)

const uteis = sweep.filter(s => s.alcancou && s.acrescenta)
log(`${sweep.filter(s => s.alcancou).length}/${FONTES.length} alcancadas; ${uteis.length} acrescentam algo novo`)
for (const s of sweep.filter(s => !s.alcancou)) log(`NAO ALCANCADA: ${s.fonte} — ${s.porque_nao || 'sem motivo'}`)
for (const s of sweep.filter(s => s.alcancou && !s.acrescenta)) log(`NADA NOVO: ${s.fonte}`)

const DOSSIE = uteis.map(s =>
  `### ${s.fonte}\n` + (s.achados || []).map(a =>
    `- [${a.grau}] (${a.controle || '?'}) ${a.assunto}: ${a.o_que_diz}\n  endereco: ${a.endereco || '(SEM ENDERECO — cai para afirmado-no-doc)'}`
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
log(`${LACUNAS.length} lacunas em ${GRUPOS.length} grupos`)

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
          id: { type: 'string' },
          coluna: { type: 'string' },
          valor: { type: 'string' },
          grau: { type: 'string', enum: ['inferido-do-codigo', 'afirmado-no-doc', 'incerto'] },
          endereco: { type: 'string' },
          raciocinio: { type: 'string' },
          nao_achei: { type: 'boolean' },
          so_a_bancada: { type: 'string', description: 'se so uma medicao resolve, o ENSAIO que resolveria — o que ligar, o que olhar, quanto tempo' },
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
    correcao: { type: 'string' },
  },
}

const LENTES = [
  { k: 'endereco', p: 'A LENTE DO ENDERECO: o arquivo:linha citado existe e diz o que a proposta afirma? Va conferir. Endereco que nao confere = refutada.' },
  { k: 'transporte', p: 'A LENTE DO TRANSPORTE: isto e RADIO ou e valor do CABO copiado sem perceber? E a confusao mais cara desta casa. Offset de radio identico ao do cabo SEM justificativa escrita = suspeito.' },
  { k: 'aparelho', p: 'A LENTE DO APARELHO: o controle esta certo? Valor do DualSense numa linha do Pro ou do 8BitDo e refutacao imediata. E o aparelho TEM essa capacidade, ou a resposta honesta e "nao tem"?' },
]

const resultados = await pipeline(
  GRUPOS,
  g => agent(REGRAS +
    '\n\nO DOSSIE DAS FONTES NOVAS (levantado agora, por nove agentes, em fontes que este projeto nunca leu):\n' + DOSSIE +
    '\n\nAS LACUNAS DESTE GRUPO (' + g.k + '):\n' + JSON.stringify(g.itens, null, 1) +
    '\n\nPara CADA lacuna e CADA coluna em "faltam", proponha o valor — ou marque nao_achei=true. ' +
    'Voce pode ler o codigo DESTE repositorio (src/, assets/dkms/) para cruzar. ' +
    'ESTAS LACUNAS JA RESISTIRAM A DUAS RODADAS: se voce nao achar, o resultado esperado e "nao achei" ' +
    'com o campo `so_a_bancada` preenchido — descreva o ENSAIO que resolveria (o que ligar, o que olhar, ' +
    'quanto tempo), porque isso vira trabalho de bancada para a dona do projeto. ' +
    'Um valor plausivel e errado neste mapa custa mais que uma celula vazia.',
    { label: `propor:${g.k}`, phase: 'Propor', schema: PROPOSTA_SCHEMA }),
  (res, g) => {
    const props = ((res && res.propostas) || []).filter(p => !p.nao_achei)
    if (!props.length) return []
    return parallel(props.map(p => () =>
      parallel(LENTES.map(L => () =>
        agent(REGRAS + '\n\n' + L.p + '\n\nA PROPOSTA A REFUTAR:\n' + JSON.stringify(p, null, 1) +
          '\n\nTente DERRUBA-LA. Confira a fonte. Na duvida, refutada=true — esta casa prefere ' +
          'celula vazia a celula errada.',
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
const paraBancada = resultados.filter(Boolean).flat().filter(Boolean)
log(`${todas.length} propostas verificadas; ${sobreviveram.length} sobreviveram`)

phase('Sintese')
const sintese = await agent(REGRAS +
  '\n\nAS QUE SOBREVIVERAM a tres lentes independentes:\n' + JSON.stringify(sobreviveram, null, 1) +
  '\n\nAS QUE CAIRAM:\n' + JSON.stringify(todas.filter(p => !p.sobreviveu).map(p => ({ id: p.id, coluna: p.coluna, refutas: p.refutas, porques: p.porques })), null, 1) +
  '\n\nEscreva, em portugues do Brasil, curto e factual:\n' +
  '1. quantas celulas ganham valor, por controle;\n' +
  '2. a tabela id / coluna / valor / grau / endereco das sobreviventes;\n' +
  '3. QUAIS FONTES NOVAS VALERAM A PENA e quais nao acrescentaram nada — isto decide se ha uma rodada 4;\n' +
  '4. as divergencias entre fontes, sem escolher lado;\n' +
  '5. **A LISTA DE ENSAIOS PARA A BANCADA** — o que so a medicao resolve, cada um com: o que ligar, ' +
  'o que olhar, quanto tempo leva, e o que a resposta decide. Esta lista e a entrega mais valiosa se ' +
  'poucas celulas sobreviverem.\n' +
  'NAO escreva em arquivo nenhum.',
  { label: 'sintese', phase: 'Sintese' })

return {
  fontes_uteis: uteis.map(s => s.fonte),
  fontes_sem_novidade: sweep.filter(s => s.alcancou && !s.acrescenta).map(s => s.fonte),
  nao_alcancadas: sweep.filter(s => !s.alcancou).map(s => s.fonte),
  total_propostas: todas.length,
  sobreviveram: sobreviveram.length,
  celulas: sobreviveram,
  ensaios: paraBancada.filter(p => p.so_a_bancada).map(p => ({ id: p.id, coluna: p.coluna, ensaio: p.so_a_bancada })),
  relatorio: sintese,
}
