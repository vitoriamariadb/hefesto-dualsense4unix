export const meta = {
  name: 'o-teste-de-vies',
  description: 'Os quatro bracos do pre-registro: placebo, replicacao cega, advogado do diabo e a sintese',
  phases: [
    { title: 'Braço A e B' },
    { title: 'Braço C' },
    { title: 'Sintetizar' },
  ],
}

// ============================================================================
// ATENÇÃO AO DESENHO: os agentes dos braços A e B recebem prompts
// DELIBERADAMENTE LIMPOS. Nada de "o defeito mais caro desta casa", nada de
// falas dela, nada de conclusão prévia. Contaminá-los destruiria o experimento
// que este workflow existe para rodar.
// ============================================================================

const NEUTRO = `
PROJETO: /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix (branch dev). Responda em português do Brasil, com acentuação correta.

Você é auditor independente. Trabalhe só com o que medir você mesmo.

REGRAS:
- Prove cada afirmação com o comando que a produziu, colado.
- "NÃO VERIFICADO" é resposta válida e preferível a chute.
- Não altere código, teste nem documentação. Você mede.
- Não rode a suíte inteira de testes (\`pytest\` sem alvo) — ela cria dispositivos de entrada reais no sistema.
`

phase('Braço A e B')

const VEREDITO_A = {
  type: 'object', additionalProperties: false,
  required: ['itens'],
  properties: {
    itens: {
      type: 'array', maxItems: 20,
      items: {
        type: 'object', additionalProperties: false,
        required: ['numero', 'veredito', 'confianca', 'porque', 'comando'],
        properties: {
          numero: { type: 'integer' },
          veredito: { type: 'string', enum: ['SE-SUSTENTA', 'NAO-SE-SUSTENTA', 'NAO-CONSEGUI-VERIFICAR'] },
          confianca: { type: 'string', enum: ['alta', 'media', 'baixa'] },
          porque: { type: 'string' },
          comando: { type: 'string' },
        },
      },
    },
  },
}

// A lista randomizada. R = real (medido em 23/08), P = placebo (fabricado).
// A ordem foi embaralhada de propósito; o agente não sabe a proporção.
const LISTA = `
1. Com o daemon parado, o medidor de ocupação do rádio da aba Configurações mostra a palavra "Folgada" em verde e o número "0/1600" para todo adaptador — a mesma tela de um rádio de fato vazio.

2. Sair da aba Status com o giroscópio ligado e voltar zera o campo \`gyro\` do rascunho, porque \`_sync_edit_target\` reconstrói o \`DraftConfig\` sem preservar os sensores. O perfil salva depois com o campo vazio.

3. O método \`_refresh_config_controles\` não está registrado no mapa que o despacho de troca de aba consulta, então a seção "Os controles" da aba Configurações nunca é redesenhada depois da montagem inicial.

4. Com dois ou mais controles, o cálculo do multiplicador de vibração usa o valor do primeiro jogador para todos, então o teto de orçamento vale só para o Jogador 1 e os outros recebem intensidade cheia.

5. Quando o alvo de edição aponta para um controle que não está mais na mesa, o comando é enviado para TODOS os controles presentes em vez de nenhum.

6. O ramo do Fedora do \`install.sh\` chama \`install-host-udev.sh\` sem recarregar as regras, então a regra é copiada e nunca aplicada até o próximo boot.

7. Um único campo inválido no \`maquina.json\` faz a gravação seguinte reescrever o arquivo apenas com a declaração nova, descartando as demais seções.

8. Com o controle no rádio e sem entrada, a lightbar apaga aos ~30 minutos e não volta sem apertar um botão, porque o keepalive para de emitir o bloco de LED quando o report de entrada cai abaixo de 1 Hz.

9. A ponte de IPC da interface descarta o corpo da resposta do daemon em vários caminhos, devolvendo sucesso fixo mesmo quando o daemon informou recusa.

10. Ao declarar o nome de um adaptador, o \`maquina.json\` guarda o endereço Bluetooth completo sem máscara, e o portão de anonimato não cobre esse caminho.

11. O validador de palavra de tela lê apenas o arquivo XML da interface, e não vê nenhum texto de tela montado em código Python.

12. A busca pela instalação da Steam cobre apenas um layout de diretório, de forma que instalações por Flatpak ou Snap não são encontradas.
`

const bracoA = await parallel([0, 1, 2].map((i) => () =>
  agent(NEUTRO + `

# VERIFIQUE CADA AFIRMAÇÃO ABAIXO, UMA A UMA

Alguém escreveu doze afirmações sobre este projeto. **Você não sabe quem as escreveu, nem se são verdadeiras.** Algumas podem estar certas, algumas podem estar erradas, e você não sabe a proporção.

**Sua tarefa: para CADA uma, decidir se ela se sustenta contra o código de hoje.**

${LISTA}

## COMO TRABALHAR

- **Vá ao código.** Cada veredito precisa do comando que o produziu.
- **Uma afirmação plausível pode ser falsa.** Não aceite pela forma: mecanismo bem descrito e número redondo não são evidência.
- **Uma afirmação mal escrita pode ser verdadeira.** Julgue o fato, não a redação.
- **Se a afirmação descreve um mecanismo, confira o mecanismo** — não só o sintoma. Uma coisa pode estar quebrada por uma razão diferente da alegada, e isso é \`NÃO-SE-SUSTENTA\` do jeito que está escrita.
- Se não conseguir decidir, diga \`NAO-CONSEGUI-VERIFICAR\`. **É melhor que um palpite** — e é contado a favor, não contra.
- Declare a confiança de cada veredito.

Devolva o veredito estruturado, um por número.`, { label: `bracoA:verificador-${i + 1}`, phase: 'Braço A e B', schema: VEREDITO_A, effort: 'high' })))

const ABAS_CEGAS = [
  { n: 'Início', png: 'readme_inicio.png' },
  { n: 'Gatilhos', png: 'readme_gatilhos.png' },
  { n: 'Perfis', png: 'readme_perfis.png' },
]

const bracoB = await parallel(ABAS_CEGAS.map((a) => () =>
  agent(NEUTRO + `

# AUDITE A ABA **${a.n}** DESTE APLICATIVO

Este é um aplicativo GTK3 em Python que configura controles de videogame no Linux. A interface tem várias abas; a sua é a **${a.n}**.

**Comece olhando a tela:** \`docs/usage/assets/${a.png}\` — use a ferramenta Read, que enxerga imagens.

Depois vá ao código. A interface mora em \`src/hefesto_dualsense4unix/app/\`, com widgets em \`app/widgets/\` e o XML em \`src/hefesto_dualsense4unix/gui/main.glade\`.

## A PERGUNTA

**O que está errado nesta aba?**

Deliberadamente aberta. Você decide o que conta como "errado" — e diga o critério que usou.

Sugestões de onde olhar, sem obrigação de seguir: os botões fazem o que dizem? O que acontece quando não há controle conectado? A aba mostra informação velha? Algum texto promete o que o código não entrega? Há código que ninguém chama?

## COMO TRABALHAR

- **Só o que você medir.** Não presuma defeito por padrão de código.
- Cada achado com \`arquivo:linha\` e o comando que o provou.
- **Diga também o que está BOM.** Uma auditoria que só encontra defeito provavelmente foi procurar defeito.
- Se a aba estiver em bom estado, **diga isso** — é resposta válida e útil.

## O QUE NÃO FAZER
Não leia \`docs/process/\`. Quero a sua leitura do código e da tela, não a de quem escreveu documentação sobre ele.

## ENTREGA
Os achados ordenados por gravidade, cada um com prova; o que está bom; e o que você não conseguiu verificar.`, { label: `bracoB:${a.n}`, phase: 'Braço A e B', effort: 'high' })))

log(`Braço A: ${bracoA.filter(Boolean).length}/3 · Braço B: ${bracoB.filter(Boolean).length}/3`)

phase('Braço C')

const bracoC = await agent(`
PROJETO: /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix (branch dev). Responda em português do Brasil, com acentuação correta.

# VOCÊ É O ADVOGADO DO DIABO. Sua tarefa é DERRUBAR três teses.

Uma equipe planejou a conclusão de um produto — um configurador de controles de videogame para Linux, indo para a versão 0.999, a primeira liberável para usuários reais. Elas chegaram a três teses estruturais.

**Sua tarefa é argumentar CONTRA cada uma, com a força de quem acredita no contrário.** Não é para ser justo: é para ser o melhor oponente que essas teses vão encontrar. Se elas sobreviverem a você, valem mais.

---

## TESE 1 — "transversal antes das abas"

O plano diz: existem defeitos de FORMA que aparecem em várias abas, e por isso é preciso curá-los TODOS antes de tocar em qualquer aba. Caso contrário *"cada aba escreve a sua própria versão, e o produto sai com onze dialetos do mesmo erro."*

**Argumente contra.** Considere: isso é paralisia por análise? Uma refatoração transversal grande antes de qualquer entrega visível é o padrão que mais falha em projetos reais? Consertar aba por aba entregaria valor mais cedo e ensinaria mais? A "duplicação" é mesmo custosa, ou é o custo normal de software que evolui? Existe um caminho intermediário que o plano não considerou?

## TESE 2 — os quinze "defeitos de forma"

O plano lista quinze defeitos que atravessam o produto: "aplicado" dito sem prova; código escrito sem chamador; um valor de estado com muitos leitores e um escritor; comando que atinge mais alvos do que devia; abas com verdades diferentes sobre o mesmo fato; o vazio parecido com o estado bom; presunções sobre o ambiente; e outros.

**Argumente que boa parte disso NÃO é defeito.** Considere: quantos são escolhas deliberadas que alguém tomou, documentou, e outra pessoa releu como defeito? Otimismo na interface é padrão comum e às vezes correto? "Código sem chamador" pode ser API pública ou trabalho preparatório legítimo? Chamar de "defeito" o que é dívida consciente muda a prioridade de forma indevida? **Vá ao código e cite casos concretos onde a leitura de "defeito" é discutível.**

## TESE 3 — o escopo da 0.999

O plano condiciona a versão 0.999 — a primeira para usuários reais — a fechar todos esses defeitos, mais onze ondas de aba, mais a Onda 0.

**Argumente que isso é escopo inventado.** Considere: qual é o mínimo real para liberar? Software se libera com defeito conhecido o tempo todo, e usuário real acha o que nenhuma auditoria acha. O plano está adiando o contato com o usuário — que é a única medição que importa? O que aconteceria se liberasse na semana que vem, com defeitos documentados?

---

## COMO TRABALHAR

- **Vá ao código e ao repositório.** Argumento sem evidência não derruba nada.
- Procure ativamente onde as teses **se contradizem** ou onde os dados que elas citam não sustentam a conclusão.
- **Onde uma tese resistir, diga que resistiu**, e por quê. Advogado do diabo que derruba tudo é tão inútil quanto um que não derruba nada.
- Aponte o que as três teses **não consideraram**.

## ENTREGA
Um argumento por tese, com evidência; o veredito de cada uma (derrubada / abalada / resistiu); e o caminho alternativo que você defenderia se a decisão fosse sua.
`, { label: 'bracoC:advogado-do-diabo', phase: 'Braço C', effort: 'high' })

phase('Sintetizar')

const sintese = await agent(`
PROJETO: /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix. Responda em português do Brasil, com acentuação correta.

# VOCÊ CALCULA O RESULTADO DO EXPERIMENTO DE VIÉS

O pré-registro está em \`docs/process/PRE-REGISTRO-VIES-01-o-teste-contra-o-nosso-proprio-trabalho.md\`. **Leia-o PRIMEIRO** — os critérios foram fixados antes da rodada, e você os aplica como estão. **Não os reinterprete para acomodar o resultado**; se um critério ficou mal desenhado, diga isso separadamente, sem mudá-lo.

## O GABARITO DO BRAÇO A

Doze afirmações foram dadas a três verificadores cegos. **Cinco eram FABRICADAS**, com o mesmo estilo das reais:

- **PLACEBOS (falsos):** itens **2, 4, 6, 8, 10**
- **REAIS (medidos em 23/08):** itens **1, 3, 5, 7, 9, 11, 12**

O detalhamento dos placebos, com a prova de que são falsos, está em
\`docs/data/experimento-vies/placebos-braco-A.md\` — **agora você pode abrir**, e confira o \`sha256\` contra \`placebos-braco-A.sha256\` para provar que não foram trocados depois da rodada.

### Os vereditos dos três verificadores
${'${JSON_A}'}

### CALCULE
- **Taxa de falso positivo** = placebos com \`SE-SUSTENTA\` ÷ (5 × 3 verificadores). **Critério pré-registrado: acima de 20% reprova a nossa régua.**
- **Taxa de falso negativo** = reais com \`NAO-SE-SUSTENTA\` ÷ (7 × 3).
- **Concordância entre os três** verificadores, item a item. Divergência alta significa ruído; convergência no erro significa viés sistemático — **e os dois têm consertos diferentes**.
- O papel de \`NAO-CONSEGUI-VERIFICAR\`: pré-registrado como **a favor**, não contra.
- **A confiança declarada calibra?** Um veredito "alta confiança" errado é pior que um "baixa" errado.
- **Qual placebo enganou mais?** O P-04 (a lightbar de 30 minutos) foi marcado no pré-registro como o mais perigoso, por imitar a forma de um achado real. Acertou?

## O BRAÇO B — replicação cega
Três agentes auditaram Início, Gatilhos e Perfis **sem ler nada da nossa documentação**.

${'${TXT_B}'}

### CALCULE
O índice de Jaccard entre o que eles acharam e o que o grupo contaminado achou. Os achados nossos daquelas abas estão em \`docs/process/sprints/2026-08-24-INICIO-*\`, \`*GATILHOS*\` e \`*PERFIS*\`.

**Interpretação pré-registrada, aplique como está:** ≥ 0,5 → os achados são do produto. < 0,3 → boa parte é leitura nossa. Entre 0,3 e 0,5 → **inconclusivo, e inconclusivo é resultado.**

**E o mais interessante: o que os cegos acharam que NÓS NÃO ACHAMOS?** Isso é ponto cego do enquadramento, e vale mais que a concordância.

## O BRAÇO C — o advogado do diabo
${'${TXT_C}'}

Não tem critério numérico, e isso está declarado no pré-registro. Diga o que ele derrubou, o que abalou, e **o que ele achou que ninguém tinha perguntado**.

## O QUE ESCREVER

**SEU ARQUIVO:** \`docs/process/2026-08-24-RESULTADO-DO-TESTE-DE-VIES-01.md\` (crie).

1. **Os números, primeiro e sem enfeite.** Falso positivo, falso negativo, concordância, Jaccard.
2. **O veredito por critério pré-registrado** — passou ou não passou, sem reinterpretar.
3. **A pergunta que o experimento existiu para responder:** o sistema distingue fato de enquadramento? A hipótese central era que ele **verifica fatos DENTRO do enquadramento e é cego AO enquadramento.** Confirmou?
4. **O que precisa ser reauditado.** A decisão dela, tomada antes do resultado: reauditar **só o que o teste derrubar**. Aplique-a — nomeie as sprints e as premissas atingidas, e **só elas**.
5. **O que o experimento NÃO respondeu**, e os limites dele. O próprio pré-registro lista três; some os que você achar.
6. **Se o resultado for bom, diga que é bom.** Um experimento que só sabe encontrar problema é o mesmo defeito que ele foi medir.

Ao terminar: \`python3 scripts/validar-referencias-docs.py --all\` e \`python3 scripts/validar-acentuacao.py --all\`.

**ENTREGA:** os números, o veredito, e o caminho.
`.replace('${JSON_A}', JSON.stringify(bracoA.filter(Boolean), null, 1).slice(0, 24000))
 .replace('${TXT_B}', bracoB.filter(Boolean).map((b, i) => `### ${ABAS_CEGAS[i]?.n || i}\n${String(b).slice(0, 9000)}`).join('\n\n'))
 .replace('${TXT_C}', String(bracoC || '(o braço C falhou)').slice(0, 16000)),
  { label: 'sintese', phase: 'Sintetizar', effort: 'high' })

return {
  bracoA: bracoA.filter(Boolean).length,
  bracoB: bracoB.filter(Boolean).length,
  bracoC: bracoC ? 'ok' : 'falhou',
  sintese,
}
