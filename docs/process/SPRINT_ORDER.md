# SPRINT_ORDER — o que está aberto e em que ordem

Este é o arquivo único e de caminho fixo (`docs/process/SPRINT_ORDER.md`) que
diz o que está aberto, em que ordem, e o que espera a palavra dela. Ele existiu
até a faxina de 24/07 (`a639e0d`), foi apagado, e ela o pediu de volta em
21/08/2026.

**Censo de 22/08/2026, 228 sprints:** 74 concluídas, 40 abertas, 87 parciais,
27 índices, 0 indeterminadas. As 127 abertas e parciais estão na seção 3.

> **O censo é da MANHÃ de 22/08, e o dia inteiro aconteceu depois dele.** Medido
> no fim do dia: `find docs/process/sprints -maxdepth 1 -name '*.md' | wc -l` →
> **235**, mais 17 na subpasta da aba Configurações. As seis sprints que a noite
> abriu estão na fila da seção 1 e na seção 3; a contagem do cabeçalho **não**
> foi refeita, porque refazer o censo é trabalho de censo, não de aritmética.
>
> **RECONTADO em 23/08/2026, às 22h14** — 260 no primeiro nível, 17 na subpasta,
> **277 no total**; **155 alcançáveis por LINK** daqui, 215 citadas por link ou
> por nome, **62 fora das duas réguas**. Os números que este cabeçalho publicava
> antes ("114 fora dele", depois "111") vinham de uma régua que procurava o
> **nome de arquivo** como texto literal, enquanto a fila cita por NOME e com
> acento: eram fato errado e **saíram**. As réguas, os comandos e o que NÃO foi
> recontado estão na **§0.10**.
>
> O resultado que importa continua sendo um **NÃO-ACHADO**: das que declaram
> estado, **nenhuma órfã diz ABERTA**. Elas estão fora da fila porque a fila é
> *"do que falta, não registro do que se achou"*, e isso está certo — mas a
> triagem da noite de 23/08 mostrou que **20 delas são trabalho real** (§0.6,
> balde 0).
>
> **Três alarmes de órfã aberta foram conferidos um a um e os três eram da
> régua, não da árvore.** `CONTAGEM-01`, `UI-SELETOR-01`, `JOGO-COMPLETO-01`,
> `PEDIDOS-DELA-01`, `RECEITA-ERRADA-01` e `APPLET-MONOCROMATICO-01` têm
> cabeçalho de concluída **acima** de um `Status: ABERTA` preservado de
> propósito; `2026-07-30-INDICE` e `2026-07-31-INDICE` são índices de leva
> antiga, não sprints. E os dois casos inversos (*"a fila diz ABERTA e o
> arquivo diz FEITA"*) também caíram: a linha do `TRES-MODOS-DO-SOM-01` foi
> lida contra o arquivo do `SOM-01` por colisão de sufixo, e a
> `PROVA-NO-PLASTICO-01` foi dada como fechada porque a linha 37 dela diz
> *"exige a Steam FECHADA"*. **A anatomia das três réguas está em
> [COMO-OLHAR-A-TELA.md](COMO-OLHAR-A-TELA.md)**, §"Régua que casa um token em
> qualquer lugar do texto".
>
> **A PORTA DE ENTRADA DE HOJE é a seção 0** — a fila em ONDAS de 23/08, que
> organiza as onze abas sob as invariantes da Onda 0. A seção 1 continua sendo a
> fila por custo do silêncio, e cada linha dela que uma onda absorveu está
> marcada com `→ Onda N · Aba`. **O nome da aba faz parte da marca de
> propósito:** as ondas foram renumeradas às 22h de 23/08 e três sprints no
> disco ainda trazem o número velho no cabeçalho (§0).
>
> **O retrato do dia inteiro, para quem chega sem contexto:**
> [ONDE PARAMOS — a aba que nasceu, e as quatro réguas que mentiam](2026-08-22-ONDE-PARAMOS-a-aba-que-nasceu-e-as-quatro-reguas-que-mentiam.md).
>
> **E o índice de 21/08 continua valendo, apesar de este arquivo tê-lo
> substituído como porta de entrada:**
> [a casa mudou de endereço](sprints/2026-08-21-INDICE-a-casa-mudou-de-endereco-e-a-fila-mudou-de-ordem.md).
> Ele ficou **sem um único ponteiro na árvore** entre 22/08 e 23/08, e carrega
> uma linha que não está escrita em nenhum outro lugar: **o `pre-commit` global
> desta máquina barra segredo com 9 regras mais o cofre de literais em
> `~/.config/git/segredos-literais` — trocar a senha da máquina exige trocar lá
> também.**

---

## 0. A FILA EM ONDAS — 23/08/2026, a leva das onze abas

Pedido dela em 23/08: *"montar uma sprint pra cada aba... e depois pra execução
da auditoria, e trazendo um plano com sprints muito bem desenhadas e adicionadas
ao sprint order para que no final das contas todas as sprints de cada aba sejam
executadas em harmonia."* **O alvo é a 0.9.5 liberável para usuários reais.**

**A ordem é decisão dela (D1): transversal primeiro.** A **Onda 0** são as
invariantes que valem para as ONZE abas; as **Ondas 1 a 11** são as abas, já sob
essas regras; a **Onda 12** é o que não pertence a aba nenhuma. O motivo, e ele
manda no desenho: **as invariantes MUDAM o que cada aba tem de fazer** — arrumar
layout de aba antes de saber se a feature dela vale POR CONTROLE é retrabalho
garantido.

**A ordem da tira, medida por mim em 23/08 às 22h14** com
`awk '/<child type="tab">/{f=NR} f && /<property name="label"/{print NR": "$0; f=0}'`
sobre `src/hefesto_dualsense4unix/gui/main.glade` (linhas 271, 704, 752, 1132,
1635, 2028, 2616, 2992, 3542, 4021, 4067):

```
1 Início   2 Status   3 No jogo   4 Gatilhos   5 Lightbar   6 Rumble
7 Perfis   8 Sistema  9 Emulação  10 Navegação 11 Configurações
```

**"No jogo" é a 3ª, não a 10ª; "Navegação" é a 10ª, não a 9ª.** "No jogo" **não
tem arquivo próprio** — mora dentro de `status_actions.py:548-869` e importa o
widget da Status, o que torna dura a restrição de que ela e a Status nunca rodem
em paralelo. **O número da ONDA não é o número da aba**: a ordem das ondas é por
dependência, não por posição na tira.

> **AS ONDAS FORAM RENUMERADAS às 22h de 23/08.** A fila das 19h30 numerava `5 Perfis · 6 Emulação ·
> 7 Navegação · 8 Lightbar · 9 Gatilhos · 10 Rumble`; a ordem de dependência
> desta seção é `5 Emulação · 6 Perfis · 7 Lightbar · 8 Gatilhos · 9 Rumble ·
> 10 Navegação`.
>
> **As três sprints que carregavam o número antigo foram CORRIGIDAS em
> 24/08/2026**, cada uma com nota datada no próprio cabeçalho:
> PERFIS-ABRE-O-QUE-GUARDA-01 (dizia "nº 5", é **Onda 6 · Perfis**),
> EMULACAO-UM-DONO-SO-01 (dizia "Onda 6", é **Onda 5 · Emulação**) e
> RUMBLE-POR-JOGADOR-01 (dizia "Onda 10", é **Onda 9 · Rumble**). Duas
> referências internas vinham do mesmo desenho velho e saíram junto: a Emulação
> dizia vir "antes da Onda 7" (é a **Onda 10 · Navegação**) e a Rumble dizia
> "LED e gatilho são das ondas 8 e 9" (são as **Ondas 7 · Lightbar e
> 8 · Gatilhos**). As outras oito já estavam certas (a de Gatilhos não usa
> número: cita as ondas pelo NOME da aba, que é a forma robusta).
>
> **A regra que resolve, e vale para todo executor: o número vale pelo NOME DA
> ABA.** Toda referência a onda neste arquivo vem escrita `Onda N · Aba`. Quem
> abrir uma das três sprints acima corrige o cabeçalho dela no mesmo commit.

### 0.1 Por que não se conserta aba por aba

O produto não tem onze problemas de aba. Tem **quinze defeitos de FORMA que
aparecem onze vezes** — e três réguas que mentem sobre eles. Se as onze ondas
rodarem antes da Onda 0, cada uma escreve a sua própria versão dos quinze, e o
produto sai da 0.9.5 com onze dialetos do mesmo erro.

> **ESTA TABELA É A DONA ÚNICA DA LISTA E DA CONTAGEM — reconciliação de
> 24/08/2026.** Até hoje o repositório carregava **duas numerações para os
> mesmos defeitos**: esta dizia "dez" e listava **F1 a F11**; o
> [ONDE-PARAMOS de 23/08](2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md)
> dizia "DOZE" e listava **P1 a P12**. **As duas listas não eram uma subconjunto
> da outra** — cada uma tinha defeitos que a outra não tinha —, e a colisão já
> tinha custo medido: a sprint Z4 nasceu com `F5/P5` no cabeçalho, e **F5 e P5
> eram defeitos diferentes**.
>
> **O F sobreviveu** porque é o que a fila executável usa (§0.2 e §0.3) e o que
> as oito sprints da Onda 0 citam. O **P saiu de todos os lugares** — texto,
> seções do ONDE-PARAMOS e nome do arquivo dele. Nada foi apagado: os quatro
> defeitos que só o P tinha entraram aqui como **F12 a F15**.
>
> | era | virou | o defeito |
> |---|---|---|
> | P1 | **F1** | "aplicado" sem prova |
> | P2 | **F2** | a cura escrita e nunca ligada |
> | P3 | **F3** | o alvo sem dono |
> | P4 | **F4** | grava na peça, manda na mesa |
> | P5 | **F12** | o perfil não guarda tudo |
> | P6 | **F13** | só duas abas têm pulso |
> | P7 | **F8** | o ambiente presumido |
> | P8 | **F11** | o léxico |
> | P9 | **F9** + **F10** | o portão do specs cego, e o elo que não existe |
> | P10 | **F14** | a foto mente para a documentação |
> | P11 | **F15** | verde que não protege |
> | P12 | **F5** | os pares que disputam o mesmo estado |
> | — | F6, F7 | **só o F tinha**: as três réguas da mesa, e o estado vazio |

| | O defeito de forma | Onde aparece |
|---|---|---|
| **F1** | **"Aplicado" é palavra sem prova, e a verdade JÁ ESTÁ no daemon.** `_call_checked`/`_safe_call` terminam em `return True, None`. O caso que fecha o diagnóstico: `ipc_handlers.py:4533-4538` ESCREVE se o gesto acertou o microfone certo e `ipc_bridge.py:800-804` DESCARTA o campo — não é falta de informação, é uma ponte que joga a resposta fora | 7 abas |
| **F2** | **A cura escrita e nunca ligada, e são os TESTES VERDES que a mantêm viva.** `set_mask`/`clear_mask`: 0 chamadores de produto, **34 testes verdes**; `suspend_vpads_for_steam_input`: 0 chamadores e premissa de uma sprint inteira; `prontuario_dos_jogos.py`: 1037 linhas, 0 chamadores. Publicados no `state_full` e sem UM leitor: `mascara_divergente`, `bateria_no_jogo`, `jack`, `osk_instalado`, `controles_sem_driver` | daemon↔janela |
| **F3** | **CURADO na ONDA0-Z2 (24/08/2026).** O alvo tinha um escritor e **sete** leitores por `getattr(..., None)` — não nove; `grep -rn 'getattr(\(self\|host\|janela\|self\._host\), *"_edit_target_uniq"' src/` é a régua declarada, §2.2 da sprint. `_edit_target_uniq` nascia SÓ no tique de 2 Hz da Status, que sai cedo com qualquer popup aberto em QUALQUER aba; sem ele, Lightbar, Gatilhos, Rumble e Configurações caíam em edição GLOBAL **em silêncio**. Os sete leitores migraram para `app/alvo_de_edicao.py`, o dono único; o portão `scripts/portao_alvo_tem_dono.py` reprova a volta do campo em `src/` | 9 abas |
| **F4** | **Grava na peça, manda na mesa.** Rumble: o comando vivo vai para os quatro e só o PERFIL fica da peça. Lightbar com "Todos": o mesmo desenho de jogador nos quatro (com teste verde TRAVANDO isso). Alvo que sai da mesa vira broadcast (`backend_pydualsense.py:2639`) | Rumble, Gatilhos, Lightbar |
| **F5** | **OITO PARES de abas com duas verdades sobre o mesmo fato, na mesma janela** — é a resposta medida a *"tudo sincronizado entre as abas?"*, e ela é NÃO. A causa comum não é descuido: **nenhum fato do produto tem dono declarado**. Toda cura de par que não declarar o dono volta na próxima leva | 8 pares |
| **F6** | **A raiz de F5: três réguas do MESMO daemon discordam sobre quem está na mesa.** Com ZERO DualSense no sistema, às 20h45: `daemon.status` diz `connected:true, bt, 75%`, o topo do `state_full` idem, `controllers[0]` diz `connected:false` e `controller.list` concorda com o último. Duas fontes no MESMO payload (`ipc_handlers.py:1895` e `:2217`), ambas estagnadas no último estado bom | todas |
| **F7** | **O estado vazio é indistinguível do estado bom.** Gatilhos com a mesa vazia é IDÊNTICA à mesa cheia (38 botões clicáveis); Rumble diz em verde "o JOGO controla a vibração"; Emulação pinta "Microfone: Ligado" com zero placa de áudio; Início afirma "Nenhum controle conectado" com dois acesos na frente dela; **Uma instância CURADA em 23/08 (`0fd0a33`), e serve de molde:** a Configurações dizia "Folgada / 0 de 1600" em verde com o daemon fora do ar, e hoje diz "Não sei" em laranja — três estados (não perguntei · respondeu · não respondeu) em vez de colapsar ausência em zero | 6 abas, 1 curada |
| **F8** | **O ambiente presumido, e HOJE está falhando na máquina dela:** `window_detect_backend="xlib"`, `seeing=false`, `reason="sem_conexao_x"`, `x11_connect_failed` a cada 30 s há horas — e `window_detect_healthy=true`. **A troca de perfil por jogo está cega e o produto responde "estou bem".** Junto: `XDG_CONFIG_HOME` honrado de um lado e ignorado do outro, OSK só `onboard`/`wvkbd`, e o `maquina.json` que **nunca nasceu no disco dela**. **A Steam saiu desta linha em 24/08 — era fato errado**: `steam_root_ou_recusa` (`integrations/proton_pin.py:184`, Z7-C) já nomeia Flatpak e Snap, e `default_steam_root` os exclui **de propósito**, com a razão no docstring (o Proton que o Hefesto extrai no host é invisível dentro da sandbox — travar lá quebraria o launch). O que falta é a TELA dizer o motivo, e isso é da **Onda 5 · Emulação** | 5 abas |
| **F9** | **A régua mente mais que o produto: três portões verdes provados CEGOS por mordida.** Uma promessa de rádio plantada na tela que o CSV mede como `não` passou nos três e em 62 testes; trocar `HZ_INPUT_SEM_MIC` deixando a `radio_ressalva` para trás passou em 36. E o mapa **registra por escrito** que o `README.md` publica números que ele declara caducos, vivos há 7 dias | suíte e portões |
| **F10** | **O elo que responde à pergunta central dela não existe.** `grep` por leitura de CSV/`specs.html` em `src/` → **VAZIO**. medição → CSV → `specs.html` → **NADA** → tela. Hoje chega por alguém lembrar: um fato corrigido em 23/08 foi substituído à mão em OITO arquivos | do mapa à tela |
| F11 | **O léxico é um trabalho só, não onze.** "Microfone" nomeia três coisas em três abas; dois "Silenciar" idênticos a 60 px um do outro; "leve/forte" leem como escala e são dois MOTORES. **Herdado do desenho das 19h30 e NÃO remedido nesta síntese** — fica na lista para não se perder | todas |
| **F12** | **O perfil não guarda tudo, e cada aba tem seu buraco DIFERENTE.** A decisão dela de 18/08 não foi executada: faltam touch, giroscópio e acelerômetro (Status); o liga/desliga do teclado, que mora em flag global enquanto o mouse ao lado é por jogo (Navegação); microfone, Steam Input e teclado (Emulação); o preset de gatilho (Gatilhos); os sete gestos da Sistema. E o inverso: o campo `coop` do schema é aceito, logado e **ignorado**. **Era o P5** | 7 abas chegam, 4 não |
| **F13** | **Só duas abas têm pulso.** Início e Status se atualizam sozinhas; as outras nove dependem do gancho de entrada na aba, e vários faltam. A lista de perfis não relê o disco; o rótulo do mouse virtual nunca é relido. E o laço do switch-page chama `fn()` **sem `try`/`except`**: uma exceção deixa a aba desenhando o passado, calada. **É a metade gêmea do F6** — F6 é a tela que discorda de si mesma, F13 é a tela que mostra o passado —, e a Z5 cura os dois. **Era o P6** | 9 abas |
| **F14** | **A foto mente para a documentação, e o README publica.** Cinco abas fotografavam o XML cru. **Curado pela metade em 23/08:** os cinco hosts existem e RODARAM (`3de95ff` traz sete PNGs no mesmo commit — o "nunca rodaram" desta linha era fato errado e saiu). O que sobrou é o instrumento curado com a **régua que o vigia ainda cega**: `CODIGO_DA_TELA` não inclui `scripts/gui-captura/`. **Era o P10** | 5 abas + a documentação |
| **F15** | **Verde que não protege.** O padrão é sempre o mesmo: a função pura tem oito testes e o fio que a chama não tem nenhum. Sete arquivos medem um card que a aba não constrói desde 02/08. **Nenhum teste abre um perfil real pela porta da janela** — e é por isso que dois perfis dela não abrem há semanas com a suíte verde. **É o F9 virado para dentro**: F9 é o portão cego, F15 é a suíte cega. **Era o P11** | a suíte |

**A consequência de ordem, e é a razão da D1 dela:** F6 decide o que toda aba
pode afirmar sobre a mesa; F3 decide se a feature de cada aba vale POR CONTROLE;
F1 decide o que cada aba pode dizer depois de um clique; F10 decide se a medição
de BT dela chega à tela sozinha. **Quatro perguntas transversais que reescrevem a
tarefa de dez abas** — e a foto do layout, hoje, em cinco abas, fotografa o XML
cru.

**Duas correções de fato que valem para todo executor.** (1) A ordem da tira,
acima. (2) **A bancada mudou debaixo dos batedores:** às 18h15 havia dois
DualSense no rádio; às 19h29 e às 20h45, ZERO — três réguas independentes
confirmam, e o que sobrava em `/sys/class/hidraw` era o **nosso próprio vpad**.
**Nenhum número desta leva sobre 2 ou 4 controles é medição viva.**

### 0.2 Onda 0 — as invariantes (Z0 a Z7)

> **A ONDA 0 INTEIRA FECHOU EM 24/08, e esta seção vira histórico.** Nove merges
> entre 09:46 e 10:15 — `9b4e5a0` (Z0), `7bf4f25` (Z5), `2d83432` (Z2),
> `ed79255` (Z3), `4f7cece` (Z1), `15b5ff5` (Z7), `f9240b5` (Z4), `0c99242` (Z6)
> e `cf78346` (CONFIGURACOES-FECHA, que é a **Onda 1 · Configurações** e fechou
> junto). As nove branches `voo/*` estão com `git rev-list --count dev..$b` = 0.
> **Não redespache nada daqui** — a prosa abaixo descreve o plano, não o estado.
> Se `scripts/despachar-agente.sh --listar` ainda mostrar as nove como "EM VOO",
> é o instrumento que está velho, não a fila: ele lê `git worktree list`, que é
> honesto sobre worktree e cego a merge.

Nenhuma onda de aba fecha antes da frente de que depende. O aceite de cada frente
é uma **mordida**: arrancar a cura tem de fazer REPROVAR. **A tabela está na
ordem de EXECUÇÃO, não na ordem do rótulo** — **Z0, Z5, Z6, Z1 e Z7 começam no
dia 1**, em paralelo; Z2 espera Z5; Z3 espera Z2; Z4 espera Z2 e Z5.

> **Duas correções desta prosa, de 24/08/2026, ao conferir as oito sprints.**
>
> 1. **A Z5 estava fora do dia 1, e a Z2 depende dela.** A frase dizia "Z0 e Z6
>    começam no dia 1; Z1 e Z2 correm em paralelo" — mas a linha da Z2 nesta
>    mesma tabela declara dependência **dura** de Z5, e a sprint da Z5 mede que
>    ela **não depende de nenhuma outra frente**. Pôr Z2 no dia 1 mandaria um
>    agente construir o dono do alvo sobre três réguas que discordam sobre quem
>    está na mesa. A tabela sempre esteve certa (Z5 é a segunda linha); era a
>    prosa que omitia.
> 2. **"Arquivos disjuntos: ponte/rodapé × alvo" era fato errado, e saiu.**
>    Medido cruzando as tabelas de posse das duas sprints: **Z1 e Z2 declaram
>    posse exclusiva dos MESMOS quatro arquivos** — `app/textos_de_aplicacao.py`
>    (Z1-A × Z2-C), `app/actions/lightbar_actions.py`,
>    `app/actions/triggers_actions.py` e `app/actions/rumble_actions.py`
>    (Z1-B/C × Z2-B). Elas não são disjuntas; são **serializadas** pelo fato de
>    a Z2 esperar a Z5. Quem despachar as duas ao mesmo tempo colhe R1.
>
> **As quatro outras colisões de posse entre frentes que correm JUNTAS**, e
> nenhuma das sprints envolvidas as declara — quem reger resolve antes de
> despachar:
>
> | arquivo | quem reivindica | resolução sugerida |
> |---|---|---|
> | `src/hefesto_dualsense4unix/daemon/ipc_handlers.py` | **Z1-E** (o arquivo inteiro) × **Z5-A1** (posse de LINHA: só `:1876`, `:2166`, `:3709`) × Z7 (declara que **não toca**) | a Z5 já escreve posse de linha; a Z1-E adota a mesma forma, ou uma das duas espera |
> | `src/hefesto_dualsense4unix/daemon/state_store.py` | **Z5-A1** × **Z7-A** | dono único, ou posse de linha declarada dos dois lados |
> | `src/hefesto_dualsense4unix/integrations/proton_pin.py` | **Z1-E** (`:901`, o contrato do "travar") × **Z7-C** (`:153-167`, `default_steam_root`) | funções diferentes no mesmo arquivo; a Z7-C já diz que **usa o formato de recusa da Z1**, então Z1-E vem primeiro |
> | `src/hefesto_dualsense4unix/app/actions/emulation_actions.py` | **Z1-E** (o arquivo inteiro) × **Z7-B** (posse de LINHA declarada: só `:1003`) | a Z7-B já limita a uma linha e diz que **relata em vez de editar** se a Onda 5 estiver rodando; a Z1-E precisa da mesma cláusula |

| Frente | Por que vem ANTES | Agentes | O aceite que MORDE |
|---|---|---|---|
| **[Z0 — a régua e a foto](sprints/2026-08-24-ONDA0-Z0-A-REGUA-E-A-FOTO-01-cinco-abas-publicam-o-xml-cru.md)** | a regra da casa manda olhar a foto primeiro, e HOJE cinco abas publicam o XML cru: Lightbar (prévia sem cor, "Aceso agora: consultando…"), Emulação (VID:PID de Xbox contra a máscara viva), Navegação (lista vazia, interruptor LIGADO), Sistema (o produto aparece DESLIGADO) e o editor de Perfis (VAZIO — a metade principal da tela nunca foi vista). **Dos dez batedores desta noite, cinco leram uma tela que não existe** | 3 | arrancar o host de QUALQUER uma das cinco faz o portão REPROVAR **nomeando a aba**; a foto da Lightbar deixa de conter "consultando…" e a da Emulação deixa de conter "045E:028E (Xbox 360)" com máscara DualSense; portão novo reprova nome em `NOMES` sem mixin em `MIXINS_DE_ABA` (hoje 3 de 11) |
| **[Z5 — uma régua só para quem está na mesa](sprints/2026-08-24-ONDA0-Z5-UMA-REGUA-SO-PARA-A-MESA-01-tres-verdades-sobre-quem-esta-conectado.md)** | é a raiz de F5/F6 e a resposta a *"tudo sincronizado entre as abas?"*. Cabeçalho e Início dizem uma coisa; Status, Configurações, No jogo e o seletor de alvo dizem outra. **NENHUMA aba pode ser consertada antes disto, porque toda aba lê a mesa.** Junto vem a metade gêmea: o daemon publica e ninguém lê; a tela lê uma vez e nunca mais (só Início e Status têm pulso) | 4 | daemon com `controllers=[]` e `state` cacheado: os TRÊS lugares dizem desconectado, e arrancar a derivação reprova. Gravar `Sackboy` por uma rota e ler pelas outras duas: as três respondem igual. Tirar QUALQUER aba do mapa `_REFRESH_POR_ABA` reprova **nomeando a aba** (hoje não existe teste nenhum, provado por grep). Para cada chave órfã do `state_full`: ou teste que prova que uma tela a mostra, ou commit que a removeu com data |
| **[Z6 — comunhão com o specs, e o pareamento](sprints/2026-08-24-ONDA0-Z6-COMUNHAO-COM-O-SPECS-01-a-medicao-chega-a-tela-por-alguem-lembrar.md)** | é a pergunta dela em pessoa — *"se decidirmos hoje que X faz Y funcionar no BT, isso chega na interface?"* — e a resposta medida é **chega por alguém lembrar**. **Começa no DIA 1, em paralelo com a Z0**, porque a trilha de BT dela (D2) já está correndo: sem ela, cada medição dela vira faxina manual em N arquivos (em 23/08 foram OITO) | 6 | plantar na tela uma frase que promete no rádio o que o CSV mede como `não` faz o portão REPROVAR nomeando arquivo, linha e chave — **hoje passa verde, provado por mordida em `app/audio_saida.py:1017`**. Trocar `HZ_INPUT_SEM_MIC` sem atualizar a `radio_ressalva` reprova. Devolver o parágrafo caduco do `README.md:219` reprova citando `audio.microfone@dualsense`. A varredura de caducos roda DUAS vezes e não acha nada na segunda |
| **[Z1 — a ponte que sabe dizer não](sprints/2026-08-24-ONDA0-Z1-A-PONTE-QUE-SABE-DIZER-NAO-01-sete-abas-dizem-aplicado-sem-prova.md)** | sete abas dizem "aplicado" sem prova e **a verdade já está calculada no daemon**; sem esta frente, sete ondas escrevem sete versões do mesmo toast e as sete divergem | 5 | com a mesa VAZIA, "Aplicar em L2", "Testar por 500 ms", o "Aplicar" do rodapé e "Travar Proton validado" dizem que NÃO fizeram, **com motivo**; com o jogo aberto e o gate R-04 recusando, o rodapé diz recusado em vez de comemorar; arrancar a propagação do campo de recusa reprova em **seis** testes de aba distintos |
| **[Z2 — o alvo ganha dono próprio](sprints/2026-08-24-ONDA0-Z2-O-ALVO-GANHA-DONO-01-a-fita-acesa-sobre-seis-abas-que-a-ignoram.md)** | nove abas mudam por causa desta frente, e ela decide se a feature de cada aba vale POR CONTROLE. A fita "Ajustes vão para: [1][2][3][4]" fica ACESA sobre seis abas onde nada a obedece — na Início, duas ocorrências de `uniq`, **as duas em comentário**. Depende da Z5: sem régua da mesa, o alvo não tem domínio | 6 | montar o host SEM o mixin da Status faz as quatro abas leitoras REPROVAREM em vez de virarem globais em silêncio; portão que reprova `_edit_target_uniq` fora de `app/alvo_de_edicao.py` **nasce reprovando 9 arquivos**; um teste trava a ORDEM dos cards contra a ordem da fita; e um teste exige **chamador de PRODUÇÃO** para `set_mask`/`clear_mask` — **ele reprova HOJE**, e é o formato da mordida que falta em toda a família F2 |
| **[Z3 — broadcast proibido](sprints/2026-08-24-ONDA0-Z3-BROADCAST-PROIBIDO-01-o-pulso-do-jogador-2-na-mao-dos-outros.md)** | é a invariante dos 4 controles na forma mais cara: o Controle 2 sai da mesa no meio da partida e o pulso do jogador 2 vai para os outros três. É **REINTRODUZÍVEL por refactor** — foi o estrago que a entrega ABAS-06 curou em 25/07. Depende de Z2 | 3 | escolher o Controle 2, REMOVÊ-LO da mesa, disparar o gesto e exigir **ZERO** escritas — reprovando ao ver 4 quando a cura é arrancada; vale para rumble, gatilho e lightbar, um teste por família. E: o comando vivo e o que o perfil guarda têm o MESMO alcance, ou a tela diz que não têm |
| **[Z4 — o perfil guarda tudo](sprints/2026-08-24-ONDA0-Z4-O-PERFIL-GUARDA-TUDO-01-sete-abas-chegam-ao-perfil-e-quatro-nao.md)** | é a pergunta dela em pessoa, e a resposta medida é **NÃO, com um buraco DIFERENTE por aba**: sete abas chegam ao perfil e quatro não; o `sackboy.json` dela — o jogo de quatro pessoas desta casa — não tem `mode`, nem `controllers`, nem `ponte`; e o último ajuste por controle de QUALQUER aba não chega ao daemon, porque o applier pula `controllers: None`. Depende de Z2 e Z5 | 5 | abrir os perfis REAIS dela na janela (34 no disco), mexer em cada aba, Salvar, FECHAR o programa, reabrir e comparar campo a campo — **não teste de função pura**. `DraftConfig.from_profile` com os params aninhados de "Aventura" e "Corrida" **reprova hoje**. Widget de escolha novo sem campo de perfil nem depósito declarado faz a matriz REPROVAR nomeando aba e widget |
| **[Z7 — o ambiente que o produto presume](sprints/2026-08-24-ONDA0-Z7-O-AMBIENTE-PRESUMIDO-01-cinco-presuncoes-que-quebram-fora-desta-casa.md)** | 0.9.5 é liberação para usuários REAIS e cinco presunções quebram o produto para quem não é ela, em cinco abas ao mesmo tempo — e **está acontecendo na máquina dela agora** (F8). Corre em paralelo, mas **nenhuma onda de aba fecha com "funciona" antes dela**, porque o que ela mediria é a bancada dela | 4 | a suíte roda com `XDG_CONFIG_HOME` em outro lugar e uma Steam Flatpak falsa, e as três abas concordam sobre o MESMO arquivo; `DISPLAY` inválido faz `window_detect_healthy` virar `false`, e arrancar o gate devolve `true` e reprova; sem `DISPLAY`, `_force_xwayland_on_cosmic` não mexe em `GDK_BACKEND`; declarar a mesa e matar o processo sem "Aplicar" e o `maquina.json` existe; portão contra a faixa `aabbcc` em `config_dir()` de produção |

### 0.3 As onze ondas de aba

Cada uma tem sprint própria no disco, com o carimbo de tela da D3 em cada tarefa
e a declaração de qual pergunta de Bluetooth a bloqueia. **As onze existem e as
onze estão linkadas** (conferido com `ls` em 23/08 às 22h14; às 19h30 existiam
seis).

| # | Aba (posição na tira) | Sprint | Depende de | O que o Bluetooth trava nela |
|---|---|---|---|---|
| **1 · Configurações** — **FECHADA em 24/08 (`cf78346`)** | 11ª | [CONFIGURACOES-FECHA-01](sprints/2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md) | Z1, Z5, Z0. **NÃO depende de Z2** — esta aba se desqualifica do alvo de propósito (é a única que esmaece a fita), e por isso é o **molde a copiar** | o medidor de rádio não pode afirmar fonte de captura de microfone por BT (medido em 23/08: não existe sem a ponte); "A mesa" e "Orçamento" ficam sem lastro até a **D-M** decidir onde moram — hoje têm ZERO linhas no mapa |
| **2 · Início** | 1ª | [INICIO-NAO-MENTE-01](sprints/2026-08-24-INICIO-NAO-MENTE-01-a-ponte-que-nao-acende-e-a-escolha-que-ela-nao-fez.md) | Z1, Z2, Z5, Z7; e o balde do daemon da Onda 12 — **VPAD-SUSPENSO-MORTO-01 trava a linha da ponte** e **ESCONDE-SÓ-O-HIDRAW-01 trava o texto do grab** | a vibração do jogo chega por rádio? (a frase "faz o controle vibrar" não pode ser afirmada sem ressalva); quantos DualSense por rádio o produto sustenta? (`slot_jogador` é `inferido-do-codigo` e a aba promete "um jogador para cada controle"); o aviso de Modo Nativo por BT é verdade? (base é leitura do fonte do SDL, não medição com jogo); um externo por rádio entra na conta? (`plataforma.vpad@sn30` = `existe: desconhecido`) |
| **3 · Status** | 2ª | [STATUS-DIZ-O-QUE-VE-01](sprints/2026-08-24-STATUS-DIZ-O-QUE-VE-01-o-hertz-que-sumiu-e-os-cards-fora-de-ordem.md) | Z0, Z2, Z1, Z5, Z6, Z4. **Restrição dura: mesmo arquivo e mesmo widget da Onda 4 — mesmo agente-dono, sequencial** | o alto-falante emite por rádio? (`radio_aciona=não`, "zero linhas de implementação" — e o bloco INTEIRO fica ativo no rádio hoje); existe fonte de captura de mic por rádio? (medido: **NÃO**); a taxa real do mudo por rádio? (55-75% declarados CADUCOS no próprio CSV); a bateria por rádio bate com o aparelho? (grau REBAIXADO para inferência em 15/08 e a barra afirma número exato); o LED de jogador pega por rádio? (`parcial`, e o título do card afirma "· Jogador N") |
| **4 · No jogo** | **3ª, não a 10ª** | [NO-JOGO-SEM-FALSO-VERDE-01](sprints/2026-08-24-NO-JOGO-SEM-FALSO-VERDE-01-a-palavra-verde-que-nao-prova-que-chegou.md) | **Onda 3 · Status (mesmo arquivo, mesmo widget — restrição dura)**, Z1, Z5, Z6 | a vibração do jogo chega ao motor por rádio?; a cor pintada pelo jogo chega à barra com o jogo segurando o hidraw? (duas sprints se contradizem e uma está velha); o gatilho replicado por rádio **precisa de linha PRÓPRIA no CSV** antes de a aba afirmar qualquer coisa; o número em Hz é giroscópio mesmo, ou pode ser Opus? (FURO ABERTO: `_struct_base` não testa o bit de áudio); o alto-falante recebe áudio do jogo por rádio? (mapa: **não**) |
| **5 · Emulação** | 9ª | [EMULACAO-UM-DONO-SO-01](sprints/2026-08-24-EMULACAO-UM-DONO-SO-01-a-mascara-com-cinco-donos-e-o-verde-que-nao-tem-alvo.md) | **Onda 2 · Início** (o contrato de MARCAR), Z1, Z2, Z5, Z6, Z7; e VPAD-SUSPENSO-MORTO-01 (Onda 12) trava a frase do vpad recolhido | vibração e giroscópio no rádio — a dica de máscara afirma os dois "completos" sem qualificar transporte, e o mapa tem `inferido-do-codigo` num e FURO ABERTO no outro; fonte de captura de mic por rádio (medido: **não** — e a aba pinta "Ligado" em verde); o preço do mic ligado no rádio (260,4 Hz caem para 170,5 + 106,2, e o botão "Ligar" não avisa) |
| **6 · Perfis** | 7ª | [PERFIS-ABRE-O-QUE-GUARDA-01](sprints/2026-08-24-PERFIS-ABRE-O-QUE-GUARDA-01-o-perfil-removido-que-ressuscita-e-a-ponte-que-nao-aparece.md) | Z4 (dura), Z7, Z5, Z1, **Z0** — a foto oficial mostra o editor VAZIO, ninguém nunca viu a metade principal desta aba; e a redação da caixinha depende da **D-D** | ativar um perfil por rádio aplica as mesmas seções que no cabo? (LED de jogador `parcial`, passthrough `inferido-do-codigo`: o toast não pode dizer "reaplicado no controle" sem qualificar); Modo Nativo com dois ou mais no rádio funciona, e com quantos adaptadores? (hoje o botão é oferecido sem ressalva num perfil de co-op); gatilho por rádio foi sentido em UM modo só |
| **7 · Lightbar** | 5ª | [LIGHTBAR-COR-DE-CADA-UM-01](sprints/2026-08-24-LIGHTBAR-COR-DE-CADA-UM-01-a-aba-mais-vazia-e-o-aceso-agora-que-nao-volta.md) | Z2 (dura — o `_edit_uniq` sai daqui), Z3, Z5, **Z0** (a foto publicada desta aba é o XML cru), Z6 | a barra obedece por rádio DEPOIS da adoção, e sob qual regime? — **`LIGHTBAR-BT-NEVER-01` e `ROTA-BT-EM-REGIME-01` se contradizem e uma está velha**; o DESENHO das 5 luzes sai por rádio? (só sobra o sysfs, e a mordida existente prova a rota do REPORT); o detector de escritor estrangeiro funciona por rádio? (deu ZERO com a barra apagada); com quatro no rádio, quantas escritas de LED por gesto a fila aguenta? |
| **8 · Gatilhos** | 4ª | [GATILHOS-APLICADO-COM-PROVA-01](sprints/2026-08-24-GATILHOS-APLICADO-COM-PROVA-01-dois-perfis-dela-nao-abrem-e-a-tela-diz-aplicado.md) | Z1 (dura), Z2, Z3, Z4 (dura — o conversor), Z5, Z6; **Onda 7 · Lightbar** (a saída do `_edit_uniq`) e **Onda 6 · Perfis** (o rascunho) | dos dezenove modos, **só o `Rigid` foi sentido no plástico, com UM jogo de parâmetros**; `gatilho.modos_firmware` é `parcial` e dois bytes seguem sem medida em transporte nenhum (**D-H**); `gatilho.leitura` é `não/não` sem consumidor, então nada confirma no rádio que o efeito entrou — "aplicado" não pode virar "confirmado"; quatro no rádio nunca foi medido para gatilho |
| **9 · Rumble** | 6ª | [RUMBLE-POR-JOGADOR-01](sprints/2026-08-24-RUMBLE-POR-JOGADOR-01-grava-na-peca-e-manda-na-mesa.md) | **Onda 1 · Configurações** (o teto do orçamento — CONFIG-05 é dona desta onda), Z1, Z2, Z3 (dura), Z5, Z6 | **a vibração do JOGO chega ao motor por rádio?** — `radio_de_onde_sei=inferido-do-codigo`, ressalva literal "NÃO MEDIDO por Bluetooth", e é a frase central do card de cima; o rumble FIXADO pela aba chega ao motor por rádio? (a mordida do CSV prova o BYTE, não o motor); quatro no rádio vibrando ao mesmo tempo, com quantos adaptadores?; o keepalive de 2 Hz ainda cancela rumble de terceiro? (a dose-resposta de 11/08 é ANTERIOR à cura RUMBLE-SEM-DONO-01) |
| **10 · Navegação** | **10ª, não a 9ª** | [NAVEGACAO-UM-CONTROLE-SO-01](sprints/2026-08-24-NAVEGACAO-UM-CONTROLE-SO-01-o-teclado-que-jura-despachar-e-os-atalhos-que-somem.md) | **Onda 5 · Emulação** (dona de metade do código desta aba), **Onda 6 · Perfis**, Z2, Z4, Z5, Z6, Z7 | gatilhos e analógico movem e clicam o cursor por rádio? — **a observação DELA de 11/08 diz que NÃO, e que só o touchpad funciona no rádio**, e a tabela "Mapeamento" promete os três sem ressalva; no rádio, os dois nós evdev chegam os dois? (se sim, o conserto é de CÓDIGO); os atalhos de teclado chegam no rádio? (zero linhas no mapa); com quatro no rádio o PRIMÁRIO é estável, ou o cursor pula de mão sem aviso? |
| **11 · Sistema** | 8ª | [SISTEMA-O-VIGIA-VIVO-01](sprints/2026-08-24-SISTEMA-O-VIGIA-VIVO-01-a-rede-de-seguranca-parada-e-o-conserto-que-nao-conserta.md) | Z1, Z5, Z6, Z7, Z0; e o **balde de instalação da Onda 12** — o conserto do vigia é uma linha do `install.sh`, e a CURA-QUE-FERE-01 é o portão do padrão | o wrapper esconde o hidraw físico no rádio como esconde no cabo?; com quatro no rádio, "Este jogo não funciona" preserva os quatro jogadores? — **a inversão de 09/08 foi medida NO CABO, e o tooltip promete "os seus jogadores continuam valendo"**; `plataforma.mapeamento_posicao@dualsense` diz `nao-tem/não/não` contra `@sn30` `tem/sim/sim`; o quirk anti-storm e a contagem de placas ALSA são do áudio USB, irrelevantes para quem só joga no rádio |

### 0.4 O que cada onda ABSORVE

**Cada sprint abaixo está marcada na seção 3 (ou na 1) com `→ Onda N · Aba`**,
para que não flutue em dois lugares. As 105 resolvem para arquivo existente
(conferido em 23/08 às 22h14 por casamento de nome contra `find`).

- **Onda 1 · Configurações:** CONFIG-03, CONFIG-04, CONFIG-06, CONFIG-07, CONFIG-09, DECISOES-ABERTAS (da subpasta `2026-08-21-ABA-CONFIGURACOES/`), ELO-MUDO-01, CENTRAL-SEM-TELA-01, PORTAS-DA-CASA-01, CARD-OCUPA-01.
- **Onda 2 · Início:** MESA-CHEIA-10, LUGAR-À-MESA-01, A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01, MASCARA-QUE-GRUDA-01, AGORA-E-DEPOIS-01, MASCARA-POR-JOGADOR-01, SINAL-DE-JOGO-01, O-DESLIGADO-DE-ONTEM-01, APLICAR-VERDADE-01, NOME-HONESTO-01.
- **Onda 3 · Status:** PAINEL-DA-VERDADE-01, MESA-CHEIA-01, SOM-DE-CADA-JOGADOR-01, QUATRO-MICROFONES-01, TRES-MODOS-DO-SOM-01, ESTADO-QUE-MENTE-01, MESA-CHEIA-11, JANELA-CORTADA-01, STATUS-SIMETRIA-01, STATUS-SIMETRIA-02, ALINHA-DUAS-LINHAS-01, PLAYER-01, **SOM-02** (herdada do desenho das 19h30 e não reconferida pelo batedor de hoje — fica aqui para não flutuar).
- **Onda 4 · No jogo:** MESA-CHEIA-07, PARIDADE-SONY-01, ESTADO-DA-NOITE-01, SENSOR-VIVO-01, JOGO-COMPLETO-01, QUEM-É-QUEM-01.
- **Onda 5 · Emulação:** MASCARA-01, BT-E-VPAD-01, CONTAGEM-E-COOP-01, EMULACAO-NO-JOGO-01, MESA-CHEIA-06, NO-MEU-FUNCIONA-01, ENGASGO-VULKAN-01 (só o texto da aba — a dona é a Onda 12, §0.5), SEM-MICROFONE-NENHUM-01.
- **Onda 6 · Perfis:** PERFIL-SALVA-TUDO-01, PERFIL-JOGO-01, PERFIL-NASCE-CERTO-01, AUTOMATISMO-MORTO-01, ESCOLHA-DELA-VENCE-01, FOCO-ERRANTE-01, MODO-01, PERFIL-ATUAL-01, POR-UNIDADE-01, JOGOS-QUE-ELA-TEM-01, AUDIO-QUE-TRANCA-01, PERFIL-MUDO-01.
- **Onda 7 · Lightbar:** LIGHTBAR-JOGADOR-01, MESA-CHEIA-03, ONDE-A-COR-MORA-01, UNIDADE-COR-01, ESCRITOR-CRU-01, BARRA-MUDA-01, LED-SEM-DONO-01, PLAYER-LED-01, SEGUNDO-ESCRITOR-01, LUZ-CEGA-01, VAO-01.
- **Onda 8 · Gatilhos:** MESA-CHEIA-02, MESA-CHEIA-09, TRIGGER-CANON-01, GATILHO-PALAVRA-01, GATILHO-NÃO-PERDIDO-01, LARGURA-01, BOTAO-QUE-NAO-MENTE-01, MESA-CHEIA-08, LEGIBILIDADE-01.
- **Onda 9 · Rumble:** MESA-CHEIA-05, A-FÁBRICA-COM-UM-CLIENTE-01, POSSE-POR-CONTROLE-01, CONFIG-05, OITO-DEFEITOS-01, O-LACO-DE-ESCRITA-01, O-LACO-DE-ESCRITA-02, ABAS-01.
- **Onda 10 · Navegação:** NAVEGA-PELO-CONTROLE-01, NAVEGAR-ESTA-JANELA-01, JANELA-QUE-RESPIRA-01, PROVA-DE-TELA-01, PALAVRA-01, LINGUA-DO-PRODUTO-01.
- **Onda 11 · Sistema:** STEAM-INPUT-01, DUPLO-REGISTRO-01, STEAM-QUE-DECIDE-01, O-WRAPPER-QUE-SUMIU-01, SENTINELA-WRAPPER-01, WRAPPER-EM-TODOS-01, JANELA-CEGA-01, PS-TOQUE-CURTO-01, TRES-CONTROLES-01, ESCONDER-EM-VEZ-DE-SAIR-01.

**Os três índices de leva (`2026-08-01`, `2026-08-13`, `2026-08-14`) SAÍRAM da
Onda 4**, onde a fila das 19h30 os tinha posto: índice não é sprint, e a
reclassificação é do balde 0.

**As 35 absorvidas que NÃO TINHAM LINK neste arquivo.** Medido às 22h14 com o
caminho de cada arquivo procurado como texto dentro deste documento. Elas
existem no disco, uma onda é dona de cada uma, e até hoje eram inalcançáveis a
partir daqui — **é a medida do balde 0**: a fila não sabia chegar a um terço do
que agora tem dono.

| Onda | Sprint |
|---|---|
| 1 · Configurações | [CONFIG-03](sprints/2026-08-21-ABA-CONFIGURACOES/CONFIG-03-a-declaracao-persiste.md) · [CONFIG-04](sprints/2026-08-21-ABA-CONFIGURACOES/CONFIG-04-o-medidor-de-radio.md) · [CONFIG-06](sprints/2026-08-21-ABA-CONFIGURACOES/CONFIG-06-controles-que-nao-sao-dualsense.md) · [CONFIG-07](sprints/2026-08-21-ABA-CONFIGURACOES/CONFIG-07-a-janela.md) · [CONFIG-09](sprints/2026-08-21-ABA-CONFIGURACOES/CONFIG-09-esta-tudo-certo.md) · [PORTAS-DA-CASA-01](sprints/2026-08-24-PORTAS-DA-CASA-01-o-produto-sabe-onde-cada-radio-mora-e-nao-diz.md) |
| 2 · Início | [O-DESLIGADO-DE-ONTEM-01](sprints/2026-08-10-O-DESLIGADO-DE-ONTEM-01-o-produto-inerte-por-decisao-antiga.md) · [APLICAR-VERDADE-01](sprints/2026-08-01-APLICAR-VERDADE-01-o-rodape-nao-mente-mais-a-ponte-ainda-mente.md) |
| 3 · Status | [MESA-CHEIA-11](sprints/2026-08-13-MESA-CHEIA-11-a-janela-conta-um-quando-sao-quatro.md) · [STATUS-SIMETRIA-01](sprints/2026-07-26-STATUS-SIMETRIA-01-a-aba-que-era-pra-mexer.md) · [STATUS-SIMETRIA-02](sprints/2026-07-27-STATUS-SIMETRIA-02-distanciar-nao-e-organizar.md) · [ALINHA-DUAS-LINHAS-01](sprints/2026-08-01-ALINHA-DUAS-LINHAS-01-a-aba-status-que-ela-chamou-de-feia.md) · [PLAYER-01](sprints/2026-07-25-PLAYER-01-um-numero-de-jogador.md) · [SOM-02](sprints/2026-07-29-SOM-02-o-alto-falante-que-funciona.md) |
| 4 · No jogo | [ESTADO-DA-NOITE-01](sprints/2026-08-10-ESTADO-DA-NOITE-01-o-que-ela-achou-com-o-controle-na-mao.md) · [SENSOR-VIVO-01](sprints/2026-07-29-SENSOR-VIVO-01-touchpad-giroscopio-microfone-e-som-dentro-do-jogo.md) · [JOGO-COMPLETO-01](sprints/2026-08-01-JOGO-COMPLETO-01-os-nove-recursos-dentro-do-jogo.md) · [QUEM-É-QUEM-01](sprints/2026-08-15-QUEM-E-QUEM-01-o-estado-publicado-nao-diz-qual-vpad-e-de-qual-controle.md) |
| 6 · Perfis | [PERFIL-ATUAL-01](sprints/2026-08-10-PERFIL-ATUAL-01-a-linha-dela-tem-cor-e-o-primeiro-lugar.md) · [POR-UNIDADE-01](sprints/2026-08-10-POR-UNIDADE-01-o-override-por-peca-alcanca-mais-abas.md) · [PERFIL-MUDO-01](sprints/2026-08-10-PERFIL-MUDO-01-o-perfil-do-jogo-que-nao-entrou.md) |
| 7 · Lightbar | [ESCRITOR-CRU-01](sprints/2026-08-16-ESCRITOR-CRU-01-a-steam-apaga-a-barra-e-o-produto-nao-reagia.md) · [LED-SEM-DONO-01](sprints/2026-08-03-LED-SEM-DONO-01-o-common8-ganha-dono-e-os-textos-param-de-mentir.md) · [VAO-01](sprints/2026-07-27-VAO-01-a-tela-sobra-e-o-conteudo-aperta.md) |
| 8 · Gatilhos | [MESA-CHEIA-09](sprints/2026-08-13-MESA-CHEIA-09-aplicado-sem-byte-nenhum.md) · [GATILHO-NÃO-PERDIDO-01](sprints/2026-08-23-GATILHO-NAO-PERDIDO-01-a-regua-perguntou-pelo-campo-errado.md) · [MESA-CHEIA-08](sprints/2026-08-13-MESA-CHEIA-08-o-desligar-que-re-arma-a-trava.md) |
| 9 · Rumble | [CONFIG-05](sprints/2026-08-21-ABA-CONFIGURACOES/CONFIG-05-orcamento-como-teto.md) · [O-LACO-DE-ESCRITA-02](sprints/2026-08-15-O-LACO-DE-ESCRITA-02-os-dois-achados-viram-cura.md) · [ABAS-01](sprints/2026-07-25-ABAS-01-as-abas-brigam-pelo-mesmo-estado.md) |
| 10 · Navegação | [PALAVRA-01](sprints/2026-07-27-PALAVRA-01-a-janela-fala-a-lingua-de-quem-joga.md) · [LINGUA-DO-PRODUTO-01](sprints/2026-08-07-LINGUA-DO-PRODUTO-01-o-convite-a-traduzir-era-falso.md) |
| 11 · Sistema | [SENTINELA-WRAPPER-01](sprints/2026-08-16-SENTINELA-WRAPPER-01-a-steam-guarda-uma-linha-por-jogo-e-comeu-a-nossa.md) · [TRES-CONTROLES-01](sprints/2026-08-10-TRES-CONTROLES-01-o-espelho-do-espelho-no-pragmata.md) · [ESCONDER-EM-VEZ-DE-SAIR-01](sprints/2026-08-09-ESCONDER-EM-VEZ-DE-SAIR-01-o-duplicado-cura-pelo-outro-lado.md) |

**Absorvida não é fechada.** A onda entrega o que a sprint pedia *naquela aba*; o
que a sprint tem de bancada, de rádio ou de palavra dela continua dela, e
continua na faixa em que está.

### 0.5 As colisões, e quem ficou dona

Sprint que aparecia em dois lugares do plano. A regra, e ela é a mesma para
todas: **dona é quem MEXE NO CÓDIGO; a outra declara dependência.**

| Sprint | Aparecia em | **Dona** | Quem consome |
|---|---|---|---|
| VPAD-SUSPENSO-MORTO-01 | Onda 2 e balde do daemon | **Onda 12 · daemon** | Onda 2 · Início (a linha da ponte) e Onda 5 · Emulação (a frase do vpad recolhido) |
| ESCONDE-SÓ-O-HIDRAW-01 | Onda 2, Onda 11 e balde do daemon | **Onda 12 · daemon** | Onda 2 (o texto do grab), Onda 6 e Onda 11 (a caixinha do Steam Input, via **D-D**) |
| ENGASGO-VULKAN-01 | Onda 5 e balde do daemon | **Onda 12 · daemon** (o A/B é DELA) | Onda 5 · Emulação, só o texto das camadas Vulkan na aba |
| CURA-QUE-FERE-01 | Onda 11 e balde de instalação | **Onda 12 · instalação** | Onda 11 · Sistema (o vigia religar) |
| CONFIG-05 (orçamento como teto) | pasta da aba Configurações, defeito da Rumble | **Onda 9 · Rumble** | a Onda 1 não a reabre |
| ABAS-01 | Onda 6 (fila das 19h30) e Onda 9 | **Onda 9 · Rumble** | a disputa das abas pelo mesmo estado é o caso do rumble |
| PROVA-DE-TELA-01 | Onda 10 e a frente Z0 | **Onda 10 · Navegação** | a Z0 produz o instrumento que a folha usa |
| BT-E-VPAD-01 | Onda 5 e balde de BT | **Onda 5 · Emulação** | o balde de BT carrega a PERGUNTA (o furo 5, a taxa do Edge), não a sprint |
| SINAL-DE-JOGO-01 | Onda 2 e balde do daemon | **Onda 2 · Início** | o balde do daemon cita e não executa |
| O-LACO-DE-ESCRITA-01 | Onda 9 e balde do daemon | **Onda 9 · Rumble** | idem |
| MESA-CHEIA-06 | Onda 5 e balde de portão | **Onda 5 · Emulação** | o balde de portão fica com o MECANISMO, não com este caso |
| QUATRO-MICROFONES-01 | Onda 3 e balde de BT | **Onda 3 · Status** | o balde de BT fica com a pergunta "existe fonte de captura por rádio?" |
| LUZ-CEGA-01 | Onda 7 e a fila da seção 1 | **Onda 7 · Lightbar** | a **E8** (os MACs de fixture no `controllers.json` vivo dela) continua na fila da seção 1: é da casa dela, não da aba |
| CENTRAL-SEM-TELA-01 | Onda 1 e a fila da seção 1 | **Onda 1 · Configurações** | a E4 (o alcance total: webcam, microfones extras, todo o USB) é DELA e fica na fila |
| MASCARA-QUE-GRUDA-01 | Onda 2 e a fila da seção 1 | **Onda 2 · Início** | está FECHADA desde 23/08 e fica na fila só até ela ver |

### 0.6 Onda 12 — os nove baldes

O que não é de aba nenhuma, e sem o qual não há 0.9.5.

**Balde 0 — o censo: FEITO nesta leva, e o número que este arquivo publicava
estava ERRADO.** A régua da madrugada procurava o nome de arquivo como texto
literal, e a §0.4 cita **por nome, com acento** (`GATILHO-NÃO-PERDIDO-01`,
`LUGAR-À-MESA-01`) — nada disso casava. Os números novos estão na §0.10. **O
trabalho real do balde são 20 sprints**, não 111 nem 114:
[PAREAMENTO-01](sprints/2026-08-24-PAREAMENTO-01-a-medicao-nova-tem-de-chegar-sozinha-na-tela.md)
e `PORTAS-DA-CASA-01` (nasceram ontem e nenhuma lista sabia), `CONFIG-01`,
`CONFIG-02`, `CONFIG-08`, `STATUS-SIMETRIA-01`, `STATUS-SIMETRIA-02`,
`ALINHA-DUAS-LINHAS-01`, `PLAYER-01`, `UI-SELETOR-01`, `MIC-USB-01`,
`MIC-PRESENTE-01`, `MONITOR-QUE-VENCE-01`, `ESTADO-VISIVEL-01`,
`CODIGO-MORTO-01`, `PORTAO-VIVO-01`, `CADERNO-QUE-NAO-ESCREVE-01`,
`BT-SDP-VAZIO-01`; e `DOZE-LEVAS-01`, `PONTO-A-PONTO-01`,
`O-QUE-FICOU-ABERTO-01` e
[CONTINUACOES-01](sprints/2026-08-24-CONTINUACOES-01-o-que-cinco-agentes-deixaram-declarado.md)
**não são sprints — são índices e registro de leva, reclassificar**.

**SETE MORTAS, com a prova, e duas delas têm linha VIVA na fila mandando fazer.**
`BT-SNAPSHOT-SANDBOX-01` (o teste que ela pede existe:
`test_bt_sandbox_cobre_o_que_os_ganchos_escrevem.py`, entrou em 22/08);
`JOGO-01` (a §4.1 declara caducada e a Faixa 1 continua pedindo a E2;
`suspend_vpads_for_steam_input` não tem chamador); `PERFIL-SEM-RASTRO-01` (2/3
feita — sobra UMA linha no README); `CONFIG-01`, `CONFIG-02`, `CONFIG-08`,
`VAO-01`, `PORTAO-VIVO-01`. **Custo evitado: sete arquivos que um executor
abriria para "terminar" trabalho já feito.**

**O BLOCO MAIS BARATO DE TODO O INVENTÁRIO — 14 sprints paradas SÓ pelo olho
dela.** `ABAS-01`, `MIC-USB-01`, `PLAYER-01`, `UI-SELETOR-01`,
`STATUS-SIMETRIA-01`, `STATUS-SIMETRIA-02`, `SOM-01`, `SOM-02`, `VAO-01`,
`ALINHA-DUAS-LINHAS-01`, `APPLET-MONOCROMATICO-01`, `ESTADO-VISIVEL-01`,
`JANELA-QUE-RESPIRA-01`, `ESCRITOR-CRU-01` — todas declaram ENTREGUE EM CÓDIGO,
dez remarcadas em 09/08, paradas há **14 dias**, e **onze são órfãs**. Pela D3,
alinhamento, espaçamento e cor de estado já decidida é COSMÉTICA. **Uma execução
do `retratar_abas.py` (DEPOIS da Z0) mais uma passada de olho dela fecha a
maioria — é o maior retorno por minuto dela em toda a leva, e a recomendação é
que seja o PRIMEIRO gesto dela, antes até das decisões da §0.9.**

| Balde | O que carrega | Quando roda |
|---|---|---|
| **BT — a trilha DELA (D2)** | a maior fonte de bloqueio de TEXTO das onze ondas; a lista está na §0.7 | fora deste plano por decisão dela; a ordem de medir é dela, e a §0.7 traz a recomendação |
| **daemon e desempenho** | ESCONDE-SÓ-O-HIDRAW-01, VPAD-SUSPENSO-MORTO-01, DAEMON-ACORDADO-01, ENGASGO-VULKAN-01, ESPELHO-QUE-NÃO-NASCEU-01 | **três são pré-requisito de TEXTO** de Início, Emulação e Perfis: sem elas, três abas entregam frase provisória. O ENGASGO-VULKAN-01 segue na posição 1 da seção 1 e o A/B é DELA |
| **co-op e ciclo de vida do jogador (NOVO, 8 sprints, UM mecanismo)** | COOP-QUE-NAO-DESMONTA-01, PARTIDA-PICOTADA-01, JOGADOR-3-FANTASMA-01, BORDA-DE-QUEDA-01, DUAS-CONTABILIDADES-01, QUATRO-NA-MESA-01, LUGAR-À-MESA-01, MONITOR-QUE-VENCE-01 — todas sobre `daemon/subsystems/coop.py` e o ciclo do vpad | **dono único, sequencial: sem este balde, oito agentes de oito ondas tocam o mesmo arquivo.** Carrega dois registros medidos: o co-op **não existe no Modo Nativo** (`coop.py:307-313` exige `_gamepad_device`) — "co-op sempre ligado" é verdade no Modo Gamepad e falso na Conexão Nativa, e **nenhuma tela diz isso**; e a GUI escreve um teto de 4 jogadores (`status_actions.py:1289`) que o daemon não tem (com cinco na mesa, o quinto card não tem lugar — **NÃO VERIFICADO** com cinco) |
| **identidade de aparelho (NOVO, 4)** | IDENT-01, IDENTIDADE-DUPLA-01, UMA-FAIXA-NÃO-É-UM-FABRICANTE-01, N-IGUAL-A-UM-01 | um controle com dois MACs come slot de co-op e faz a numeração dançar. **Uma medição de 2 minutos dela (ligar o 8BitDo em cada modo e anotar o MAC) destrava as quatro** |
| **instalação e empacotamento (7+1, MESMO ARQUIVO — dono único)** | CURA-QUE-FERE-01 (é o portão do padrão e vem antes), BT-AGENT-TRAVA-O-RESTART-01, BONDS-QUE-SOBREVIVEM-01, DROPIN-AMBIGUO-01, RADIO-ABERTO-01, SIMETRIA-INSTALL-02, ARVORE-DIVERGENTE-01, IDENTIDADE-01 | **nada disto aparece em aba nenhuma e sem isto não há 0.9.5** — inclusive os dois scripts que o botão "Aplicar correções" executa. **MEDIDO em 24/08/2026, e a suspeita sobre o `.deb` caiu:** o `.deb` é o ÚNICO dos sete empacotadores que leva `doctor.sh` E `bluez_config.sh` (`scripts/build_deb.sh:234`); Fedora, Arch, Nix, Flatpak e os dois AppImage não levam nenhum dos dois — e **`check_packaging_parity.sh:882` pula os seis em silêncio** pelo `|| continue`, então testa 1 de 7 e passa `[ OK ]`. A prova está na O-QUE-FICOU-FORA-01, §3.2(d) |
| **portão e teste** | TESTE-HONESTO-01, AUDITORIA-DE-PERDA-01, PORTAO-VIVO-01, CADERNO-QUE-NAO-ESCREVE-01, SUITE-QUE-SUJA-O-JORNAL-01, BERCO-DE-TMP-01, GATE-EMOJI-01 | o MECANISMO vem para cá; as mordidas de cada aba ficam nas ondas. **Três buracos nomeados:** o portão de timers promete cobrir `painel_no_jogo.py` e lê outros dois arquivos (4 linhas, 15 min — e um laço posto ali nasce UMA VEZ POR CONTROLE); `validar-palavra-de-tela.py` é cego a aba montada em Python **e é onde vivem TODAS as promessas de transporte**; sete arquivos de teste da Status medem um card que a aba não constrói desde 02/08 |
| **documentação** | os fatos errados medidos: `LEIA-PRIMEIRO.md` diz 47 colunas (são **49**) e 696.546 bytes (são **701.611**); ~~`README.md:219` publica "~40% do sinal" que o próprio CSV declara caduco~~ (**fechado em 24/08** — Z6-09 tirou o número caduco e a CONFIGURAÇÕES-FECHA-01/T6 pôs as taxas medidas no lugar); `docs/usage/interface.md` descreve uma linha da aba Status que não existe desde 17/08 | **só DEPOIS da Z0 e das onze ondas** — antes disso documentaria o produto de ontem. O par que falta na conta das colunas é exatamente `cabo_por_que_nao_aciona`/`radio_por_que_nao_aciona`: 41 células da resposta mais cara de produzir, **sem um consumidor sequer** |
| **clean-room — FORA da 0.9.5** | CR-01 a CR-06, CR-SEQUENCIA-01, METODO-01 | pela **D-J** é 1.0. Ordem interna dura quando chegar: CR-03 → CR-04 → CR-06 |
| **decisão dela** | a §0.9 | nada dele é executável antes da resposta, e três ondas ficam com tarefa em suspenso enquanto isso |

### 0.7 A trilha do Bluetooth — DELA com o assistente (D2)

**Decisão dela: o mapeamento de Bluetooth não é planejado aqui.** É trilha dela
com o assistente, na mesa do specs. O que esta fila carrega é **qual pergunta
trava qual aba** — para o agente executor saber o que ele **não pode afirmar na
tela** até a medição existir.

| Pergunta que falta medir | Abas que ela destrava | Onde a pergunta mora |
|---|---|---|
| a vibração do jogo chega ao motor por rádio? (`passthrough`: rádio em `inferido-do-codigo`, sem degrau) | Rumble, No jogo, Emulação, Início | BT-FURO-FINO-01, O-LACO-DE-ESCRITA-01 |
| quantos DualSense por rádio o produto sustenta, e com quantos adaptadores? (`slot_jogador` é inferido do código, sem ensaio) | Início, Status, Emulação, Lightbar — é a promessa "um jogador para cada controle" | QUATRO-NO-RADIO-01, DOIS-CAIRAM-DE-UMA-VEZ-01 |
| o alto-falante emite por rádio? ("zero linhas de implementação") | Status, No jogo | O-ALTO-FALANTE-POR-RADIO-01, A-CADEIA-DE-BLOCOS-01 |
| a barra de luz obedece por rádio, e sob qual regime? (`LIGHTBAR-BT-NEVER-01` e `ROTA-BT-EM-REGIME-01` se contradizem) | Lightbar, Início | LIGHTBAR-BT-CLAIM-01, LIGHTBAR-BT-CULPADO-01, A-LUZ-QUE-CUROU-01, RADIO-BOMBARDEADO-01 |
| o gatilho adaptativo por rádio funciona fora do `Rigid`? (sentido em UM modo, com um jogo de parâmetros) | Gatilhos — trava dezoito dos dezenove botões | TRIGGER-CANON-01, BT-SURDO-01 |
| gatilho e analógico movem o cursor por rádio? (a observação DELA de 11/08 diz que não) | Navegação (a tabela de Mapeamento) | NAVEGA-PELO-CONTROLE-01 |
| existe fonte de captura do microfone por rádio? (medido em 23/08: **NÃO** — zero sources com dois controles no rádio) | Status, Emulação, Configurações | MIC-BT-01, QUATRO-MICROFONES-01 |

**E uma OITAVA, que entra DEPOIS das sete** — pedido dela em 24/08/2026:
*"mapeia isso pra quando terminarmos de medir tudo no bt"*.

| Pergunta que falta medir | O que ela destrava | Onde a pergunta mora |
|---|---|---|
| gatilho, vibração e barra de luz custam quanta BATERIA? (**zero** dos 178 ensaios cronometrou consumo por feature) | o interruptor de liga/desliga das três, em Gatilhos, Rumble e Lightbar — hoje ele existe por senso comum, não por medição | [O-PRECO-EM-BATERIA-01](sprints/2026-08-24-O-PRECO-EM-BATERIA-01-o-botao-que-ninguem-sabe-se-serve.md) |

Ela não trava aba nenhuma e não disputa o enlace — mede o controle, não o rádio.
Entra depois por decisão dela, para não disputar a bancada. **E o instrumento
óbvio não serve:** a carga tem onze degraus (~10 pontos cada), então medir carga
em tempo fixo sai cego; a sprint inverte para **tempo até cair três degraus**, o
que torna a medição passiva — o `battery_journal.py` já sonda a cada 30 s.

**A ordem recomendada de medir é a das ABAS, não a do protocolo** — é o que faz
cada medição destravar uma tela, e não só uma linha do mapa. A tabela acima está
nessa ordem: vibração primeiro (destrava quatro abas de uma vez), depois a conta
de controles por rádio, depois alto-falante, barra, gatilho e cursor.
**Pré-requisito da trilha inteira: `PAREAMENTO-01` de pé (frente Z6)** — senão
cada medição dela vira faxina manual em N arquivos; em 23/08 foram oito.

### 0.8 D3 — o carimbo de prova de tela

**Ela pré-aprovou a classe COSMÉTICA.** Toda tarefa de tela numa sprint desta
leva **tem** de vir carimbada com uma das duas classes:

| Classe | O que é | O olho dela |
|---|---|---|
| **COSMÉTICA** | alinhamento, espaçamento, altura/largura de botão, quebra de linha, tornar dica visível, cor de estado já decidida | **foto DEPOIS, em lote** |
| **ESTRUTURAL** | texto novo ou reescrito na tela, ordem das seções, o que nasce colapsado ou visível, qualquer coisa que mude o que se vê ao abrir | **ANTES**, sem exceção |

### 0.9 As decisões que esperam ela — a leva das onze abas

No molde do
[DECISOES-ABERTAS](sprints/2026-08-21-ABA-CONFIGURACOES/DECISOES-ABERTAS.md) da
aba Configurações: a pergunta, a recomendação com motivo, e **o custo de decidir
para o outro lado**. Nenhuma delas é trabalho — todas são palavra dela.

**D-J vem primeiro: sem ela o plano não sabe dizer não a nada.**

| # | A pergunta | Recomendação (e o motivo) | Custo de decidir para o outro lado |
|---|---|---|---|
| **D-J** | **O que é 0.9.5, em UMA frase** | entra o que produz **MENTIRA NA TELA** ou **PERDA DE CONFIGURAÇÃO**; fica para a 1.0 o que é conforto, granularidade e cobertura de aparelho que ela não tem na mesa (Pro Controller, 8BitDo). Por esse corte entram a Onda 0 inteira e os ~40 achados de grau alto das onze abas; SAEM vibração por peça, máscara por jogador na Emulação, alvo por jogador na Navegação, o carrossel de abas pelo controle e o clean-room | se entrar granularidade, a leva **dobra** e a 0.9.5 não sai neste ciclo |
| D-A | **O que o perfil guarda, exatamente?** | tudo que é do CONTROLE entra no perfil (touch, giroscópio e acelerômetro pela via da MÁSCARA, o liga/desliga do teclado emulado, o microfone, o preset de gatilho, o modo e o co-op); tudo que é da MÁQUINA (Proton travado, camadas Vulkan, autostart, marca de Steam Input, WirePlumber) vira uma **receita do jogo** separada, que viaja junto e não é o perfil. MEDIDO: o `sackboy.json` dela não tem a seção `mode`, logo ativá-lo não pede modo gamepad nem co-op; e `movimento.imu.ligar` e `toque.touchpad.escrita` são `não/não` no mapa | enfiar os sete gestos da aba Sistema no `Profile` faz o perfil deixar de ser portátil entre máquinas — que é justamente o que ela quer que ele seja |
| D-B | **A máscara: MARCAR ou APLICAR?** | MARCAR em todo lugar, com o verde do rodapé como único aplicador. MEDIDO: a Início marca (`home_actions.py:1233`), a Emulação aplica na hora (`emulation_actions.py:1291-1336`), e o rodapé dá prioridade à pendência da Início e retorna (`footer_actions.py:266-270`) — **o gesto MAIS NOVO perde para o mais velho, em silêncio** | quem usa a Emulação perde a resposta imediata; em troca, um gesto só no produto inteiro, e o diálogo de relançamento (que hoje só protege um dos caminhos) passa a valer nas duas portas |
| D-K | **A máscara por JOGADOR (decisão dela de 15/08): liga o escritor, ou ganha nota datada de caducidade?** | LIGAR o escritor na frente Z2, porque é ele que carrega touchpad, giroscópio e acelerômetro por jogador (`lifecycle.py:2755`) — sem ele a D-A não tem onde pousar. MEDIDO: `ExternalMaskRegistry` existe inteiro, tem DOIS leitores em produção, **34 testes verdes**, **ZERO chamadores de produto** para `set_mask`/`clear_mask`, e o `controller_masks.json` nunca nasceu no disco dela | se caducar, tem de ser **por escrito**, apagando as 34 provas de um mecanismo que não vai existir — senão o próximo agente "termina" o trabalho |
| D-C | **A linha "som do controle" da aba No jogo** | APAGAR até existir replicação de verdade: ela fica VERDE por uma escrita do KERNEL acordando o vpad, com a mesma palavra e a mesma cor da vibração, que chega mesmo — e o mapa diz `audio.alto_falante` rádio **não**, cabo parcial | manter o verde falso é pior que a ausência: ela conclui que o alto-falante funciona e vai caçar defeito no aparelho |
| D-D | **O texto da caixinha do Steam Input (três lugares: Perfis, Sistema, Emulação)** | reescrever AGORA, sem esperar a ESCONDE-SÓ-O-HIDRAW-01 fechar: os três prometem que "o jogo passa a ver só o controle do Hefesto" e a medição de 23/08 diz que o jogo continua vendo o físico pelo evdev. E no `storm_doctor.py:227` ainda está a frase que ela derrubou em 09/08 ("jogos cujo DualSense é entregue pela Steam"), que é o INVERSO do que o produto faz | cada dia com a frase antiga é mais uma pessoa concluindo que o produto quebrou quando foi o produto que prometeu demais |
| D-E | **A aba No jogo fora da Steam** | SIM, soltar o gate. Hoje ela só nasce para jogo da Steam (`painel_no_jogo.py:394`), e quem joga por Lutris, Heroic, GOG, emulador ou binário nativo não tem NENHUMA tela que responda "o giroscópio está atravessando para o meu jogo?" — porque a linha-resumo saiu do card da Status em 17/08 | ~10 linhas e um teste. **É a decisão de produto mais barata desta lista**, e sem ela é metade dos jogadores de Linux sem a tela central do produto |
| D-F | **Ligar e desligar o Hefesto: um dono ou dois?** | um dono só — a aba Início, com confirmação, checagem de retorno e a memória de que ela desligou de propósito — e a Sistema apontando para lá. MEDIDO: os dois botões têm o MESMO rótulo e contratos diferentes (`home_actions.py:2533` arma `_user_stopped_daemon`, `daemon_actions.py:1905` não) | hoje, quando o forte falha, ele manda "tente pela aba Sistema", que é o FRACO e usa o mesmo mecanismo: a pessoa fica sem saída. E o contrato do "desligar de verdade" não tem UM teste |
| D-G | **Vibração por peça: agora ou na 1.0?** | o rótulo honesto AGORA (20 min: a tela para de dizer que grava no Controle 2 quando manda na mesa inteira) e a granularidade DEPOIS da 0.9.5 (~11 h medidas). Mesmo raciocínio para o "Auto", que escala os QUATRO pela bateria de UM | fazer a granularidade agora custa ~15 h e adia o resto da leva. **A mentira é o que fere; a granularidade é conforto** |
| D-H | **Os dois botões de gatilho que mandam o byte de outro modo** | "Disparo (Weapon)" manda `0x06` e "Vibração" manda `0x22`, os dois fora do grupo medido, e o mapa declara a divergência VIVA. **1 h de bancada com o dedo dela antes de qualquer código** | é o mesmo mecanismo dos sete presets que não faziam nada até 01/08, e foi o tato dela que descobriu. Se sentir diferença, obedecer ao nome custa 4 linhas; se não sentir, os dois saem da grade até haver medição |
| D-I | **As duas curas mortas: o prontuário e o vpad fantasma** | (1) `prontuario_dos_jogos.py`: 1037 linhas, zero chamadores, e responde exatamente à pergunta que a aba Sistema cria a cada clique em "Este jogo não funciona" — **LIGAR** (~40 linhas + 3 testes). (2) O vpad nasce uhid JÁ NO BOOT com a mesa VAZIA (medido: `hidraw4 = DualSense Wireless Controller (Hefesto P1)` com zero controles físicos), e o Steam Input faz um espelho Xbox DELE — decidir se ele continua nascendo sem controle | se enxugar para a 0.9.5, sai **com nota datada**. O que NÃO pode, nos dois casos, é continuar no meio — é o defeito mais caro desta casa. E o preço de manter o vpad é um controle fantasma no jogo de quem instalou e ainda não ligou nada |
| D-M | **Onde moram orçamento, antena, visada e vizinhança da faixa** | um **SEGUNDO mapa declarado**, o da MESA (rádio, energia, topologia), com o mesmo portão — o `mapa-controles.csv` é do aparelho, e diluí-lo enfraquece a régua que já funciona. MEDIDO: as duas seções que a aba Configurações OFERECE E MEDE têm ZERO linhas no mapa (busca por `orcamento`, `antena`, `visada` e `wifi` nas 308 linhas: nenhuma), e a tela escreve uma afirmação de transporte fora do mapa que existe para guardá-las | **é a única decisão desta lista que espera a trilha de BT dela.** Junto: a D-A1 que ela já tomou (o "não sei" tem de ser alcançável) está contrariada em três campos da aba — 30-40 min |

### 0.10 O censo desta leva, e o que ele NÃO recontou

Medido por mim em **23/08/2026, 22h14**, na árvore de trabalho (inclui os
arquivos ainda não versionados). **Duas réguas independentes, as duas
declaradas:**

```
find docs/process/sprints -maxdepth 1 -name '*.md' | wc -l   -> 260
find docs/process/sprints -mindepth 2 -name '*.md' | wc -l   ->  17
# régua A: o CAMINHO do arquivo procurado como texto neste documento  -> 155 citadas
# régua B: o TOKEN da sprint (sem acento) procurado no texto sem acento -> 215
# união A ou B -> 215;  FORA das duas -> 62
```

**O número que este arquivo publicava estava errado e foi SUBSTITUÍDO.** "114
fora dele" (madrugada de 23/08) e "111 fora dele" (19h31) vinham de uma régua que
procurava o **nome de arquivo** como texto literal — e a §0.4 cita por NOME, com
acento. **O fato errado sai; a decisão que ele carrega fica:** três alarmes de
órfã aberta já foram conferidos um a um nesta casa e os três eram da régua, não
da árvore.

**Uma validação independente que fecha:** contando as linhas de sprint das seis
faixas da seção 3 uma a uma, dão **140** (41 + 15 + 10 + 27 + 35 + 12) — o mesmo
número que o título da §3 publica desde 22/08, medido por outra régua e por
outra pessoa.

**A régua B conta menção em prosa como citação.** `UI-SELETOR-01` aparece uma vez
neste arquivo — dentro do parágrafo do censo, como exemplo de alarme falso — e a
régua B a dá por citada, embora ela **não tenha linha na fila**. Por isso a régua
A (o link) é a única honesta para *alcançável*, e é a que produziu a tabela das
35 da §0.4.

**Não recontei estado (concluída / aberta / parcial) de sprint nenhuma.** O
cabeçalho deste arquivo segue valendo, e refazer o censo de estado é trabalho de
censo, não de aritmética. A triagem das órfãs (38 concluídas, 1 refutada, 2
índices, 20 de trabalho real) é da leva da noite de 23/08, sobre um recorte de
**61** órfãs às 20h35; o meu, às 22h14, deu **62** — a diferença são os seis
arquivos que a noite acrescentou, e as duas contagens não foram casadas uma
contra a outra. **Divergências que EU vi e não resolvi:** `CR-01`, `CR-02`,
`CR-05` e `CONTINUACOES-01` aparecem na minha lista de órfãs e não na triagem
das 61.

### 0.11 A conferência de cobertura — o que ficou fora da fila (24/08)

**As 22 sprints de aba e de onda de 24/08 estão TODAS citadas neste arquivo**,
conferidas uma a uma pelo nome de arquivo em 24/08. O que ficou fora não foi
sprint: foi o resto da leva. Os três ponteiros que faltavam:

| Entra na fila | O que é | Por que estava fora |
|---|---|---|
| [O-QUE-FICOU-FORA-01](sprints/2026-08-24-O-QUE-FICOU-FORA-01-o-que-sessenta-agentes-mediram-e-o-repositorio-nao-guardou.md) | a conferência de cobertura: o que sessenta agentes mediram em 23/08 e o disco não guardou, separado em medição, defeito e decisão dela — com o que **não** vale materializar, e por quê | nasce agora |
| [INFRA-DE-EXECUCAO-01](sprints/2026-08-24-INFRA-DE-EXECUCAO-01-o-registro-do-que-esta-em-voo.md) | a infra que executa as outras vinte e duas: isolamento por árvore de git, para o `git add -A` de um agente não engolir o vizinho | era a única sprint de 24/08 sem linha nesta fila |
| `docs/process/COMO-EXECUTAR-UMA-SPRINT.md` <!-- ref-externa: 240 linhas existem na árvore e NÃO estão no git; a ausência é o assunto desta linha --> | o protocolo do agente executor, 240 linhas, escrito a partir das três falhas de processo de 23/08 | **existe na árvore e não está no git** — os portões são cegos a arquivo novo, e ninguém rodou `git add`. **Pré-requisito da execução: sem ele os executores começam sem protocolo** |

Junto, **um documento órfão de ENTRADA**:
[onde-a-porta-usb-mora.md](../protocol/onde-a-porta-usb-mora.md) é rastreado,
traz a medição ACPI de 23/08 e tinha **zero** referências em toda a árvore — a
`PORTAS-DA-CASA-01` depende dele e não o apontava. `validar-referencias-docs.py`
reprova quem CITA arquivo inexistente e é estruturalmente cego ao inverso.

**E o defeito de forma sem dono:** cruzando F1..F15 contra as 23 sprints de
24/08, todo F aparece em pelo menos uma — **o F11 (o léxico) aparece em zero.**
Enquanto ele estiver só na §0.1 "para não se perder", as onze ondas escrevem
onze léxicos em paralelo, que é o motivo de a Onda 0 existir.

### 0.12 A ONDA 12 VIRA OITO — a linha do tempo até a 0.9.5, fundida (24/08)

Pedido dela: fundir a Onda 0 + as onze ondas de aba (§0.2-0.3, **já em voo**,
não mexidas aqui) com o resto do repositório (§0.6, antigo balde único) numa
**única sequência executável** onde fechar a última onda == critério de 0.9.5
cumprido. O que segue substitui o rótulo "Onda 12" por oito frentes numeradas,
ordenadas pela mesma régua que já rege a Onda 0: **posse de arquivo**, medida
por censo de dois agentes independentes (não confiar no rótulo dos arquivos —
vários mentem sobre si mesmos, achado central do censo de hoje).

**A descoberta que decidia a ordem geral estava errada, e a correção muda o
caminho crítico — medido em 24/08 pelo crítico da própria leva.** A alegação
original citava uma tabela "Cruzamentos com a leva de 24/08" do censo como
fonte de oito colisões de arquivo; **essa tabela não existe em lugar nenhum
do repositório** — é referência a um artefato que não sobreviveu à sessão que
o produziu. E três dos sete arquivos que ela citava como colisão tinham
alegação falsa: `install.sh`, `scripts/doctor.sh` e `scripts/build_deb.sh`
**não são reescritos em "~19 pontos"** por `SISTEMA-O-VIGIA-VIVO-01` — esse número não existe em lugar
nenhum da sprint. O que a sprint diz, em texto próprio (linha 20): *"não mexe
no `install.sh` além da linha 3504, nem em `build_deb.sh` além do bloco dos
scripts. O resto do instalador é a Onda 12"* — a colisão está **declarada**, e
a fronteira já cede o resto do arquivo para a frente 16. `doctor.sh` não é
tocado por ela; quem o edita é `CURA-QUE-FERE-01`, primeiro item da própria
frente 16.

Continuam de pé, confirmadas só por grep — não medidas linha a linha como a
alegação acima foi, e por isso não tomadas como garantidas com o mesmo peso:
`daemon/lifecycle.py` (Z1/Z2/Z4/Z5), `daemon/subsystems/gamepad.py` (Z3/Onda
5), `daemon/launch_env.py` (Onda 5/11) e `core/led_control.py`
(`LUGAR-À-MESA-01`, frente 14).

**Regra revista:** a frente 16 (Instalação) pode rodar **em paralelo com a
Onda 11**, respeitando só a linha 3504 de `install.sh` — o mesmo padrão de
posse de linha que a Onda 0 já usa; ela segue presa à Onda 14 (co-op),
motivo à parte, não derrubado. A frente 13 (Daemon) continua atrás da Onda 0
+ onze ondas de aba, pelas colisões de `lifecycle.py`/`gamepad.py`/
`launch_env.py` acima — não tocadas por esta correção. A frente 15
(Identidade) espera a frente 14 fechar, por outro motivo (`identity.py`,
já correto na tabela abaixo), não pela leva de 24/08. A frente 17 (portão
e teste) nunca precisou esperar — não toca arquivo de produto, e a sua
própria linha na tabela abaixo já dizia isso. A frente 12 ("o olho dela")
também nunca teve essa trava, por não tocar código de produto.

| # | Frente | Conteúdo (sprints reais, censo 24/08) | Depende de | Paralelizável com | Tamanho |
|---|---|---|---|---|---|
| **12** | **O olho dela** (baixíssimo custo — recomendação: primeiro gesto dela) | As **14** "só falta o olho": `ABAS-01`, `MIC-USB-01`, `PLAYER-01`, `UI-SELETOR-01`, `STATUS-SIMETRIA-01`, `STATUS-SIMETRIA-02`, `SOM-01`, `SOM-02`, `VAO-01`, `ALINHA-DUAS-LINHAS-01`, `APPLET-MONOCROMATICO-01`, `ESTADO-VISIVEL-01`, `JANELA-QUE-RESPIRA-01`, `ESCRITOR-CRU-01` (§0.6). Junto, sem custo de agente: fechar por escrito as **sete/oito sprints MORTAS** nomeadas no §0.6 (a própria contagem do balde diverge — 7 no texto, 8 nomeadas; `VAO-01` está nas duas listas, morta E nesta onda — ela decide olhando a foto, não precisa resolver a duplicata antes) | roda **`retratar_abas.py`** depois da Z0 (precisa da foto de hoje) | tudo — Z0..Z7, as onze ondas de aba, e todas as frentes 13-19 abaixo | 14 decisões + 7-8 fechamentos, zero código de agente |
| **13** | **Daemon e desempenho** | `ESCONDE-SÓ-O-HIDRAW-01` (parcial — E2 é dela), `VPAD-SUSPENSO-MORTO-01`, `DAEMON-ACORDADO-01` (E1 livre, 10 s de `strace`), `ENGASGO-VULKAN-01` (parcial — A/B de 10 min é dela), `SINAL-NO-NASCIMENTO-01` (E2/E4, sem onda própria até hoje — entra aqui por afinidade, §censo). **Gap a materializar, não sprint nova:** "arbitrar o hidraw" (item 7 da fila §1) não tem sprint — aceitar o risco antes é dela | **Onda 0 + Ondas 1-11 fechadas** (colisão não declarada com Z1/Z2/Z4/Z5 em `lifecycle.py`, Z3/Onda 5 em `gamepad.py`, Onda 5/11 em `launch_env.py`) | Onda 17 (portão e teste) | 5 sprints, ~1 agente |
| **14** | **Co-op e ciclo de vida do jogador** (dono único `coop.py`) | Ordem interna fixa (censo 24/08, ordem por reuso de bancada): `COOP-QUE-NÃO-DESMONTA-01` → `BORDA-DE-QUEDA-01` → `QUATRO-NA-MESA-01` → `DUAS-CONTABILIDADES-01` (resíduo — o achado central já foi curado por `cb46bd8`/`eef9853` fora do ciclo de sprint; só registra o que sobra, sem sprint dona) → `PARTIDA-PICOTADA-01` (**já entregue**, confere e risca) → `JOGADOR-3-FANTASMA-01` → `LUGAR-À-MESA-01` (trava em `MASCARA-01`, Onda 5, por decisão dela — se Onda 5 já fechou, destravada). `MONITOR-QUE-VENCE-01` **fora**: concluída, não toca `coop.py` | Onda 13 (gamepad/vpad estáveis antes do ciclo de vida do jogador pousar em cima) — **NÃO VERIFICADO por colisão de arquivo, é dependência lógica** | nenhuma das frentes 15-18 declara tocar `coop.py`, exceto `ÁRVORE-DIVERGENTE-01` (frente 16) | 7 sprints abertas, dono único, 1 agente sequencial |
| **15** | **Identidade de aparelho** | `IDENT-01`, `IDENTIDADE-DUPLA-01` (E1 é dela — 2 min, MAC do 8BitDo por modo), `UMA-FAIXA-NÃO-É-UM-FABRICANTE-01`, `N-IGUAL-A-UM-01` (E1 já entrou; resto é dela) | **Onda 14 fechada** — `QUATRO-NA-MESA-01` (frente 14) já reivindica `daemon/subsystems/identity.py`, mesmo arquivo desta frente | Onda 16 e 17 | 4 sprints |
| **16** | **Instalação e empacotamento** (dono único, mesmo grupo de arquivo) | Ordem interna fixa (censo 24/08): `CURA-QUE-FERE-01` (portão do padrão) → `BT-AGENT-TRAVA-O-RESTART-01` → `RADIO-ABERTO-01` → `BONDS-QUE-SOBREVIVEM-01` (ressalva: reconferir os 4 defeitos contra o código de hoje — commits de 15/08 e 22/08 não citados na sprint) → `DROPIN-AMBIGUO-01` → `SIMETRIA-INSTALL-02` → `IDENTIDADE-01` → `ÁRVORE-DIVERGENTE-01` (**ressalva forte**: cita por nome `STATUS-SIMETRIA-01`/`MIC-USB-01` como abertas quando a §0.6 já as classifica "entregue, só falta o olho dela" — **re-medir a lista inteira antes de sequenciar**; é a única sprint do balde que toca `coop.py` diretamente) | **Onda 14 fechada** (`led_control.py` reivindicado por `LUGAR-À-MESA-01`, e `ÁRVORE-DIVERGENTE-01` toca `coop.py` direto — colisão só confirmada por grep, não linha a linha). **Não depende mais de fechar a Onda 11** (24/08: a alegação que a prendia lá era falsa, ver nota acima) — respeita só `install.sh:3504` | Onda 11, Onda 15 e 17 | 8 sprints, dono único, 1 agente sequencial |
| **17** | **Portão e teste** — **FECHADA em 24/08** (as três sprints, relatórios em `docs/process/agentes/2026-08-24/`) | `TESTE-HONESTO-01` (E2 + seis coletas de teste salvas), `AUDITORIA-DE-PERDA-01` (E1-E4, os três portões que não mediam), `BERCO-DE-TMP-01` (a cauda do `$HOME` vazando, fechada) | nenhuma (toca `scripts/check_*.py` e fixtures de teste — **NÃO VERIFICADO** colisão fina com `check_packaging_parity.sh` da frente 16, mas os arquivos-alvo declarados são outros) | tudo, inclusive Z0..Z7 e as ondas de aba — pode começar no dia 1 | 3 sprints |
| **18** | **Documentação** (sem sprint própria — três fatos soltos) | `LEIA-PRIMEIRO.md` (47→49 colunas, 696.546→701.611 bytes), ~~`README.md:219`~~ (**fechado em 24/08**, ver §0.12 acima), `docs/usage/interface.md` (linha morta da aba Status desde 17/08) | **Onda 0 + Ondas 1-11 fechadas** — regra do próprio balde (§0.6): documentar antes é documentar o produto de ontem | pode rodar depois de fechar, em paralelo com 13-17 se elas ainda estiverem de pé, mas nunca antes da leva de aba | 3 fatos, ~1 h |
| — | **Clean-room** — **DECLARADAMENTE FORA da 0.9.5** (decisão D-J, §0.9) | `CR-03` → `CR-04` → `CR-06` → `CR-SEQUENCIA-01` (ordem já fixada no §0.6). `CR-01`, `CR-02`, `CR-05`, `METODO-01` já entregues — fecham sem executar | é 1.0, não sequenciar aqui | — | não entra na conta da 0.9.5 |

**O que a integração da frente 17 achou, fora do escopo das três sprints —
suíte completa rodada em 24/08 depois do merge, 5 vermelhos, todos
consertados.** Toolchain do Rust sem default; fotos da aba Configurações
atrasadas do commit `0e12780`; um bug real em `_handle_machine_declare` que
reusava a variável `resultado` e derrubava o "Aplicar" do microfone; e os
dois de `tests/unit/test_migracao_bluez_depreciados.py::TestLinkPolicyDoModoAtivoNintendo`
— `_bt_adaptadores()` (`scripts/doctor.sh`) lia `/sys/class/bluetooth/hci*`
sem override, então numa bancada com Bluetooth físico de verdade conectado
(como esta, hoje) o sandbox de PATH do teste (`sandbox_sem_velhas`) não tinha
efeito nenhum — a função enxergava os adaptadores REAIS, não os fakes.
Curado com `HEFESTO_BT_SYSFS_ROOT` (env var, não parâmetro posicional: quem
chama `_bt_adaptadores()` em produção não tem root nenhum para repassar) e
um `_sysfs_bt_hci0()` novo no teste. Não era dívida desta leva — mais velha,
só ficou invisível em máquina sem BT físico plugado.

**Os dois baldes que a tabela acima não nomeia, por já tecidos noutro
lugar — registrados aqui para a seção valer sozinha, sem depender do §0.6/§0.9
para fechar o quadro:**

- **BT, trilha DELA (§0.7, decisão D2):** fica fora das ondas de agente,
  sempre — não é frente, não tem agente, não entra na tabela. Aparece embutido
  no critério #2 abaixo ("depende das sete perguntas de Bluetooth dela").
- **Decisão dela (§0.9, D-A a D-M):** não é um balde à parte — está tecida
  dentro das frentes 13 a 16, em cada `E` marcada "é dela" nas ordens internas
  acima. A única exceção com linha própria é D-J (clean-room, linha "—" da
  tabela).

**O buraco sem sprint, registrado e não materializado (achado 4 do censo):**
"co-op não existe no Modo Nativo" (`coop.py:307-313` exige `_gamepad_device`) —
nenhuma das sete sprints da frente 14 toca isso. Não proponho sprint nova; fica
nomeado aqui para a frente 14 não fechar sem alguém decidir se materializa.

> **24/08/2026 — este critério virou uma escada de cinco degraus.**
> [A ESCADA DE RELEASES](2026-08-24-A-ESCADA-DE-RELEASES.md) parte o critério
> abaixo em degraus de **um eixo cada**, porque juntar mapa, canais e sprints faz
> qualquer um atrasar os outros dois. Os três itens numerados a seguir continuam
> valendo — eles são o critério do degrau **0.9.5** (rádio) e do **0.9.6**
> (sprints), agora separados e com portão nomeado para cada um. Leia a escada
> antes de usar a lista abaixo como régua de release.

**O critério de 0.9.5, verificável por comando — hoje não existe portão que o
meça (achado do censo, §c).** Composição de duas réguas já existentes mais uma
a escrever:

1. `python3 scripts/gerar-painel.py` → `censo_de_sprints()`: `diz_aberta` menos
   as exceções nomeadas (as 6 de cabeçalho preservado + as 3 da régua velha,
   §0.10) deve ser **0** — hoje **102** brutas. **Ressalva medida em 24/08:**
   a régua só enxerga um arquivo se ele tiver `ABERTA`, `CONCLUÍDA` ou
   `FECHADA` nos primeiros 2400 caracteres — **119 dos 287** arquivos de
   sprint não têm nenhuma das três aí (`PARCIAL`, `PENDENTE`, `EM ANDAMENTO`,
   ou preâmbulo mais comprido que 2400 caracteres ficam invisíveis a ela).
   Este critério pode chegar a **0** com um terço do inventário em estado
   desconhecido para a régua — **não é prova de pronto sozinho**; antes de
   declarar 0.9.5, alguém confere os 119 à mão, ou a régua aprende as outras
   palavras de estado primeiro.
2. A contagem de pendência do mapa de canais por inferência (`aceita∈{sim,
   parcial}` E `aciona≠sim` E motivo fora de `{nada-a-acionar, decisao-tomada,
   so-ela-decide}`) deve ser **0** na união cabo/rádio — hoje **61**, e
   depende das sete perguntas de Bluetooth dela (§0.7) estarem respondidas E
   os canais construídos.
3. Onda 0 + Ondas 1-11 + frentes 12 a 18 fechadas nesta tabela.
4. Local sugerido, fora do escopo desta sprint (só mede): novo
   `scripts/check_prontidao_0_9_5.py` <!-- ref-externa: não existe ainda; a ausência é o assunto do parágrafo -->,
   chamado no bloco "Antes de fechar qualquer leva" do `CLAUDE.md`, verde só
   quando (1) e (2) zerarem.

---

### 0.13 A ABA CONEXÕES — quatro sprints novas, 25/08/2026

A **Onda 1 · Configurações** fechou em 24/08 (`cf78346`) e **reabriu na mesma
noite**, maior. O motivo não é retrabalho: é que ela olhou a aba ao vivo, pela
primeira vez com o ambiente no estado definitivo de uso diário, e o veredito foi
*"da forma como a aba está hoje, não entrega nada disso e tá poluída e pouco
elegante"*.

O que ela pediu, na palavra dela, é que a aba deixe de ser painel e vire
**checkpoint**: *"tudo estando mapeado e ok aqui, irá servir pro user chegar nas
mesmas configs que queremos pra que ele possa usar o controle no ultra mesmo que
4 controles ao mesmo tempo"*.

| # | Sprint | O que fecha | Depende de |
|---|---|---|---|
| A | [CONEXOES-MAPA-2D-01](sprints/2026-08-24-CONEXOES-MAPA-2D-01-o-gabinete-que-o-produto-nao-enxerga.md) | o mapa 2D das entradas do gabinete, declarado uma vez | nada |
| B | [ORDEM-DE-SERVICO-01](sprints/2026-08-24-ORDEM-DE-SERVICO-01-o-exame-que-viu-e-nao-mandou.md) | o exame que MANDA, com selo de procedência em cada linha | **A** (precisa do número da entrada) |
| C | [DESEMPENHO-A-CONTA-DE-SLOTS-01](sprints/2026-08-24-DESEMPENHO-A-CONTA-DE-SLOTS-01-o-numero-que-o-specs-mediu-e-a-tela-nao-gasta.md) | a conta de 1600 vezes de falar, por adaptador | nada (menos a DESEMP-6, que espera B) |
| D | [CONFIGURACOES-O-LEXICO-01](sprints/2026-08-24-CONFIGURACOES-O-LEXICO-01-a-aba-que-fala-barramento-com-quem-ve-gabinete.md) | o léxico, as dicas e o enxugamento | **A, B, C e E** |

**A ordem, resolvida pelo cético da leva:** `A` e `C` em paralelo → `B` e `E` →
`C·DESEMP-6` → `D` por último. **`D` é a dona final de TODO texto de tela da
aba**, inclusive dentro dos arquivos de A, B e C — inclusive a varredura
`porta → entrada` da `D-A-PALAVRA-ENTRADA`, que **não deve ser feita nas outras
três**, ou duas frentes editam a mesma frase.

**As colisões que nenhuma delas declarava**, e que quem reger resolve ANTES:

| arquivo | quem reivindica | resolução |
|---|---|---|
| `app/actions/config/secao_mesa.py` | A (dona) × D (LEX-6, LEX-7, LEX-11) | colisão de FUNÇÃO, não de arquivo: D entra por último e é dona do texto |
| `app/ipc_bridge.py:799-803` (`_CAMPOS_DA_MAQUINA`) | D × C × **A sem saber** | o campo `mapa` da A nasce DENTRO de `MesaDeclarada`, não no topo de `MaquinaConfig` — no topo ele reprova `test_descartados_chegam_ao_rodape.py:373-378` |
| `app/actions/config/secao_orcamento.py` | C (calcula) × D (texto) | C é dona do que CALCULA, D do que se LÊ |
| `utils/maquina.py` | A × B (`ordens_dispensadas`) × PORTAS-DA-CASA-01 | A escreve os dois campos, como as duas já combinaram |
| `integrations/mesa_de_radio.py::vizinhancas_apertadas` | A (MAPA-6) × PORTAS-DA-CASA-01 (PORTA-03) | complementares: PORTA-03 filtra quem entra no par, MAPA-6 filtra qual par conta. A absorve |
| `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | **NINGUÉM declarava, e as quatro o alimentam** | território de **quem coordena**; cada frente devolve a lista de símbolos no relatório |

**`PORTAS-DA-CASA-01` é absorvida quase inteira:** PORTA-01 → B (mesmo conserto),
PORTA-03 → A (MAPA-6), PORTA-04/05/06 → B, PORTA-07/09 → A. A **PORTA-08 morreu
pela medição**: ela mandava *"ler `physical_location` primeiro"*, e medido em
24/08 esse campo responde em **1 das 11 entradas** desta máquina. Sobrevive só a
PORTA-02.

**E uma quinta, que não é da aba e espera a trilha de BT:**
[O-PRECO-EM-BATERIA-01](sprints/2026-08-24-O-PRECO-EM-BATERIA-01-o-botao-que-ninguem-sabe-se-serve.md)
— o custo em bateria de gatilho, vibração e barra de luz, que **zero dos 178
ensaios** mediu. É a oitava pergunta da §0.7.

| **E** | [MOTOR-DO-ARRANJO-01](sprints/2026-08-25-MOTOR-DO-ARRANJO-01-o-calculo-que-so-existe-num-mockup.md) | **o motor**: o planejador, os quatro arranjos, o reconhecimento por serial, e a conta dos controles por adaptador | **A** (o campo `mapa`) |

**O motor era o maior buraco da leva, e fechou em 25/08.** O cálculo existia só
em JavaScript, dentro de um mockup em `novo-layout/`, que o git ignora
(`.gitignore:108`): um `git clean -xdf` apagava a peça que ela pediu para levar
à GUI. Duas coisas o resgataram:

1. **o mockup foi VERSIONADO** em
   [`2026-08-24-ABA-CONEXOES/mockup/`](sprints/2026-08-24-ABA-CONEXOES/mockup/LEIA.md),
   com a fumaça que o exercita em 29 estados — o precedente é da própria casa
   (`2026-08-21-ABA-CONFIGURACOES/mockup/`);
2. **a MOTOR-DO-ARRANJO-01 o descreve** como módulo Python puro, e a mordida
   dela é **paridade**: o Python e o JavaScript têm de produzir a MESMA receita
   sobre as mesmas fixtures. É o que torna *"a mesma lógica na GUI"* verificável
   em vez de prometida.

---

## 1. A FILA DE AGORA — 23/08/2026, madrugada

> **A madrugada de 23/08 acrescentou três sprints e fechou uma.** A
> ENGASGO-VULKAN-01 nasceu da queixa do Sackboy; a ESCONDE-SÓ-O-HIDRAW-01 e a
> DAEMON-ACORDADO-01 nasceram de medições laterais da mesma investigação. A
> MASCARA-QUE-GRUDA-01 **fechou** — a E1 dela mandava pagar um custo já pago.
> Entram nas posições 1, 2 e 13 da fila abaixo.

**O dia inteiro:** 53 commits entre 04h03 e 22h00, medidos por
`git log --oneline 985b41a..HEAD | wc -l` contra o HEAD `4272438`. O que fechou está resumido depois da
fila; o detalhe de cada um está no commit e no `CHANGELOG.md`, e não se repete
aqui — esta seção é fila do que falta, não registro do que se achou.

### Duas linhas curtas que não são de sprint nenhuma — 25/08

**1. Tirar `"steam"` e `"Steam"` do `navegacao.json` dela.** Decidida por ela em
**22/08** (`D-STEAM-SAI-DA-NAVEGACAO`), **não executada** três dias depois. É uma
linha, sem código. O daemon reclama a cada sessão:

```
perfil_casa_com_a_loja  arquivo=navegacao.json  classes=['steam','Steam']
efeito='a janela invisível do steamwebhelper ativa este perfil no meio da partida'
```

Adiada de propósito na noite de 24/08 para não mexer na configuração viva durante
a medição de BT dela. **"Depois da bancada" só existe se estiver escrito** — está
aqui. Faz junto o renome do perfil, se a `D-PERFIL-NAVEGACAO` fechar antes.

**2. A aba "No jogo" existe no código e NÃO aparece na janela dela.** Medido em
24/08: o `main.glade` define **onze** abas pelos `<child type="tab">` e a janela
viva mostra **dez** — falta a "No jogo", que é a 3ª. `grep` por `tab_no_jogo` em
`app/` devolve só a constante `ABA_NO_JOGO` de `status_actions.py:112`; **nada no
código a esconde**, e nenhum `remove_page` a alcança.

Isto importa mais do que parece: **a §0.2 e a §0.3 deste arquivo, e seis sprints
da leva das onze abas, apontam para uma aba que a pessoa não vê.** Antes de
executar a Onda 4, alguém confere se é a janela dela que está velha, se é defeito
de montagem, ou se o glade e o produto divergiram. Vai para a
[NO-JOGO-SEM-FALSO-VERDE-01](sprints/2026-08-24-NO-JOGO-SEM-FALSO-VERDE-01-a-palavra-verde-que-nao-prova-que-chegou.md),
que já era a sprint sem âncoras.

### O que a próxima sessão pega primeiro

Ordem por custo do silêncio, e a régua é o alvo dela: *cada jogo local jogável
no cabo E no rádio, com as features todas nos quatro controles ao mesmo tempo.*

| # | O quê | Por que primeiro | DELA |
|---|---|---|---|
| 1 | [ENGASGO-VULKAN-01](sprints/2026-08-23-ENGASGO-VULKAN-01-sessenta-quadros-por-segundo-e-setenta-engasgos-por-minuto.md) | **→ Onda 12 · daemon.** a queixa dela tem MESES, e a madrugada mediu a FORMA do defeito e eliminou nove suspeitos. **Mas o A/B, lido em 23/08 contra os 267.465 quadros crus, aponta para o lado CONTRÁRIO:** sem a camada Vulkan a rampa do p99 é quase o dobro mais íngreme (+4,19 contra +2,28 ms/min) e há quatro vezes mais picos. **As duas sessões rampam** — logo a rampa não é da camada, e há uma segunda causa que ninguém explicou. Falta o A/B de verdade: a MESMA fase do jogo, duas vezes | o A/B é **DELA** (dez minutos de jogo) |
| 2 | [ESCONDE-SÓ-O-HIDRAW-01](sprints/2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md) | **→ Onda 12 · daemon.** a cura do Steam Input esconde o `hidraw` e deixa `evdev` e `joydev` do MESMO controle abertos — 16 nós de jogo para 4 controles, sem Steam aberta. E o `doctor.sh:3715` afirma **em verde** que "o jogo só vê o vpad". É o terceiro controle dela, com o mecanismo enfim medido | E2 é **DELA** |
| 3 | [MASCARA-QUE-GRUDA-01](sprints/2026-08-22-MASCARA-QUE-GRUDA-01-quatro-perfis-dela-pedem-xbox-e-agora-isso-fica.md) — **FECHADA em 23/08**, fica na fila só até ela ver | **→ Onda 2 · Início.** os presets perderam a opinião de máscara e a tela passou a dizer o preço dos dois lados. A E1 ("remedir a H1") foi **CANCELADA**: a H1 já fora remedida em 22/07, em três jogos nomeados, e a tela chegou a afirmar o contrário para ela. **A redação nova da frase pede o olho dela** | **DELA**, só a palavra final |
| 4 | [LUZ-CEGA-01](sprints/2026-08-22-LUZ-CEGA-01-a-barra-apagada-e-o-exame-que-nao-olha-o-radio.md) **E8** | **→ Onda 7 · Lightbar; a E8 fica aqui, é da casa dela.** quatro MACs de FIXTURE moram no `controllers.json` VIVO dela e empurram os DualSense reais para os postos 6, 7 e 8. Pior que o efeito: alguma coisa da suíte fala com o daemon vivo dela, e ninguém sabe o quê | limpar o arquivo é DELA; achar quem escreveu, não |
| 5 | [SINAL-NO-NASCIMENTO-01](sprints/2026-08-22-SINAL-NO-NASCIMENTO-01-o-veredito-existe-e-o-hotplug-nao-pergunta.md) | o produto SABE dizer se a conexão nasceu condenada e não pergunta na hora em que ela nasce. A luz apagada dela é isto. O botão já consulta o sinal; falta o tique de hotplug carimbar | |
| 6 | [A-FABRICA-COM-UM-CLIENTE-01](sprints/2026-08-22-A-FABRICA-COM-UM-CLIENTE-01-a-saida-do-modo-nativo-perde-um-applier.md) | **→ Onda 9 · Rumble.** sair do Modo Nativo monta o `ProfileManager` com **6 dos 7 appliers**, e applier ausente é seção ignorada em silêncio: `rumble.passthrough` do perfil não é aplicado. É a rota que a `PERFIL-REESCRITO-NA-PARTIDA-01` já tinha corrigido uma vez | |
| 7 | **Arbitrar o hidraw — o 5.a de 16/08, que o 22/08 pulou** ([QUATRO-MICROFONES-01](sprints/2026-08-22-QUATRO-MICROFONES-01-a-ponte-esta-desligada-e-a-conta-diz-que-cabe.md), nota de 23/08) | **→ Onda 3 · Status** (o microfone na aba Status); **a arbitragem do `hidraw` em si é da Onda 12 · daemon.** o estudo de 16/08 mediu que *"a ponte NÃO é segura ainda"* e que ela *"não entra no caminho automático da interface"* enquanto o `0x32` tiver dois donos; o item 4 dizia *"a ponte do mic não volta a subir sem o item 1"*. Em 22/08 o interruptor voltou à janela. **MEDIDO em 23/08: não existe arbitragem em `src/`, o broker não rastreia quem abriu o nó, e não há portão 5.a/5.b.** Ela pediu o interruptor sem que o preço estivesse na mesa | a decisão de aceitar o risco é **DELA** |
| 8 | **PEDIDOS-DELA-01 — três dos SEIS pedidos dela continuam sem entrega** ([sprint](sprints/2026-08-03-PEDIDOS-DELA-01-o-roteiro-dos-seis-pedidos-da-interface.md), fora da fila desde 03/08) | **#5 a máscara do controle externo:** `daemon/subsystems/external_mask.py:320` `set_mask` tem **zero chamadores em `src/`** — a `TODO-INTEGRACAO` registra isso desde 15/08. **#6.2 o `doctor` manda ela para o modo que MATA:** `scripts/doctor.sh:2753` diz *"troque o modo (Switch) ou use no cabo"* sem separar transporte, contra o `troubleshooting-8bitdo.md`, que mediu Switch por rádio como **PROVADO instável** — e `tests/unit/test_plataforma_wiring.py:209` **trava a string em verde**, que é portão pinando fato errado. **#3a e #3c:** não achados | **DELA** |
| 9 | [QUATRO-MICROFONES-01](sprints/2026-08-22-QUATRO-MICROFONES-01-a-ponte-esta-desligada-e-a-conta-diz-que-cabe.md) | **→ Onda 3 · Status.** é o que falta para o alvo dela inteiro, e a conta do guia diz que cabe (3 × 1.600 contra ~1.385). `bt_mic_enabled` é lido por três lugares e escrito por nenhum | **DELA** |
| 10 | ELO-MUDO-01, **E3 a E7** | sem a tela do que está VALENDO agora, nem ela nem um agente separam "o produto mexeu" de "o jogo é assim" — foi isso que fez o engasgo do Sackboy custar uma madrugada | parte **DELA** |
| 11 | [CENTRAL-SEM-TELA-01](sprints/2026-08-22-CENTRAL-SEM-TELA-01-o-censo-e-o-apelido-nasceram-sem-porta.md) **E2 e E4** | **→ Onda 1 · Configurações; a E4 fica aqui, é DELA.** E1 e E3 fecharam em `49797f8`. Falta **mover um controle de adaptador** (o helper tem os 7 verbos e nenhum chamador Python) e o alcance total que ela pediu: webcam, microfones extras, todo o USB | E4 é **DELA** |
| 12 | [VPAD-SUSPENSO-MORTO-01](sprints/2026-08-22-VPAD-SUSPENSO-MORTO-01-metade-da-cura-esta-ligada.md) | **→ Onda 12 · daemon.** existe quem retoma e não existe quem suspende: o par de estados mente sempre para o mesmo lado. **A E4 está desbloqueada** — a seção "Está tudo certo?" existe desde 22/08 | |
| 13 | [DOIS-CAIRAM-DE-UMA-VEZ-01](sprints/2026-08-22-DOIS-CAIRAM-DE-UMA-VEZ-01-o-disconnect-que-derrubou-o-controle-do-vizinho.md) | **→ Onda 12 · BT, trilha DELA.** um `Disconnect` derrubou DOIS controles, o segundo em outro adaptador. Sem explicação — e o botão que entrou hoje usa esse mesmo `Disconnect` | |
| 14 | O resto da auditoria de viés: [N-IGUAL-A-UM-01](sprints/2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md) E2/E4/E5, [NO-MEU-FUNCIONA-01](sprints/2026-08-22-NO-MEU-FUNCIONA-01-o-ambiente-que-o-produto-presume-sem-medir.md) E1 a E7, [UMA-FAIXA-NÃO-É-UM-FABRICANTE-01](sprints/2026-08-22-UMA-FAIXA-NAO-E-UM-FABRICANTE-01-o-pro-dela-virou-a-definicao-de-pro.md) E2 a E4, LUZ-CEGA-01 E3/E4/E6 | **→ Onda 5 · Emulação só a NO-MEU-FUNCIONA-01;** as outras três desta linha continuam sem onda — são candidatas do balde 0 da Onda 12. cada um sozinho é pequeno; a família inteira é a preocupação que ela nomeou: *"vai ficar pra sempre naquela de no meu pc funciona de boa"* | algumas **DELA** |
| 15 | [DAEMON-ACORDADO-01](sprints/2026-08-23-DAEMON-ACORDADO-01-quinze-por-cento-de-um-nucleo-sem-ninguem-jogando.md) | **→ Onda 12 · daemon.** **15,2 % de um núcleo em repouso** — sem jogo, sem janela, quatro controles parados; 6.393 `read()`/s para 2.400 relatórios/s. Ninguém conhecia o número. A E1 são dez segundos de `strace` e não precisa dela | |
| 16 | **PAINEL-DA-VERDADE-01/E2 — a linha da verdade existe e NÃO vai para a tela** ([sprint](sprints/2026-08-01-PAINEL-DA-VERDADE-01-a-aba-status-diz-o-que-chega-ao-jogo.md)) | **→ Onda 3 · Status.** `app/widgets/controller_card.py:2598-2606` constrói o `_verdade_label` e o alimenta a cada tique (`_update_verdade`), e **nenhum `pack_start`/`add` o coloca na janela** — conferido em 23/08. Foi despacotado em 17/08 a pedido dela (SEM-BARRA-DA-VERDADE-01) e ninguém voltou para riscar a E2. **Custo do silêncio:** no card COMPACTO (2+ controles, que é o alvo da casa) a única frase que sobra sobre giroscópio é `"Giroscópio: fluindo para o jogo"` (`:1240`), decidida só por `motion_streaming` (`:1236`) — que prova que NÓS EMITIMOS, nunca que o jogo recebe. É a frase que a JOGO-COMPLETO-01/E3 já classificou como mentira | |
| 17 | **TRIGGER-CANON-01/E5 — sete presets de gatilho sem como validar** ([sprint](sprints/2026-08-01-TRIGGER-CANON-01-os-modos-de-gatilho-contra-a-enum-da-sony.md)) | **→ Onda 8 · Gatilhos.** a leitura do nibble de status do gatilho (sem carga, carga aplicada, arma pronta, disparando, disparada, vibrando) **não existe em `src/`**; `gatilho.leitura` no `docs/data/mapa-controles.csv` está `não/não`, sem teste que morda. **Custo do silêncio:** os sete presets que a E2 curou eram sete presets que não faziam absolutamente nada, e ela conviveu com isso sem saber — sem a leitura, só a mão dela no controle valida | **DELA** |
| ~~18~~ | ~~[AUDITORIA-DE-PERDA-01](sprints/2026-08-23-AUDITORIA-DE-PERDA-01-tres-portoes-verdes-que-nao-medem-nada.md)~~ — **FECHADA em 24/08 (`8dbd16b`), ver §0.12 frente 17** | **→ Onda 12 · portão.** **três portões passam com a cura arrancada** — o da foto da aba não olha a foto, o da coluna "O que é" é tautologia (`ids.issubset(ids)`), e o de referências casa por sufixo de caminho. Nenhum estava escrito. A E4 tira do vermelho o `A-CASA-SABE`, que três frentes já disseram, com razão, não ser delas | |

**Ainda aberta, com o hardware na mesa:** a bancada de rádio, pelo
[GUIA-RADIO-DA-SALA.md](../../GUIA-RADIO-DA-SALA.md). **DELA**: exige controle na
mão e medição na sala.

### O que FECHOU em 22/08

- **As nove `CONFIG-*`** — a aba Configurações nasceu inteira, com cinco seções,
  entrou na documentação (`6d0cdb5`) e nas capturas.
- **Os oito buracos de CÓDIGO** que esta seção listava: `ab49f25` e `e04f887`
  (as regras udev 82 e 83 ganharam alvo, e ele passou a viajar nos pacotes),
  `d15055f` (as duas telas que desenhavam o arquivo de ontem), `d0e7a0e` (o
  carimbo de ponte e o gate do mic por campo), `61ba2ab` (o portão A-CASA-SABE
  passou a medir alcance por GRAFO de import — 33 acusados viraram 60, e os 27
  novos entraram nos registros de lacuna com razão datada) e o critério da dica
  virou portão junto com a leva da aba.
- **A tarde e a noite:** `9b2389b` (a seção "A mesa" grava), `0ef6300` (as três
  semânticas de salvar, com portão por AST), `62d092a` e `b68223e` (a E1 e metade
  da E2 da ELO-MUDO-01), `6b579b2` (a allowlist do Steam Input vira lista no
  editor), `c9859ff` (a máscara atravessa a allowlist — 4 vpads em `uhid`, 8
  divergências para 0), `2b11172` (a máscara persiste; é a E2 da
  `ESCOLHA-DELA-VENCE-01`, aberta havia 21 dias), `29c8a19`, `b77ed62` e
  `0181968` (o doctor enxerga o controle do rádio e confere os TRÊS
  adaptadores — a E1 e a E3 da `N-IGUAL-A-UM-01`), `993e89c` (a tela para de
  acusar a Steam, e sete quadros de rádio viram um), `e5376a0` (o prefixo vai no
  adaptador que hospeda Nintendo, e a linhagem deixa de ser uma faixa de OUI),
  `36ac2ca` (o vigia do Steam Input nascia morto), `de55264` (um perfil por jogo
  nasce sozinho, sem clique), `8b167cc` (o botão "A luz não acende"), `67b07ed`
  (o helper privilegiado), `9bf54b7` e `49797f8` (o censo do barramento e o
  apelido dos dongles, e a tela dos dois), `86f7fd7` (`TimeoutStopSec` e o
  sandbox do gancho de parada), `295c1e6` (o que a unit chama, o pacote leva),
  `2a7d986` (o portão contra a suíte sujar o kernel), `8f6c0e7` (a suíte para de
  depender do terminal de quem a roda), `2a614c3` (a VAO-01, e a foto que
  mentia) e `d545eda` (a coluna que separa dívida de decisão no mapa de canais).

---

## 2. Como ler a seção 3

As sete faixas abaixo são **ordenação de custo do silêncio, não medição** — o
censo mediu o estado de cada sprint, não a prioridade entre elas. A faixa 1 é a
régua do alvo dela (cada jogo local jogável no cabo e no rádio); a última é a
que só custa tempo da próxima pessoa.

`DELA` = a sprint não fecha sem a mão, o olho ou a palavra dela.

---

## 3. O QUE ESTÁ ABERTO — 140 sprints

### Faixa 1 — o jogo não anda, ou anda e derruba jogador (41)

| Sprint | O que falta | DELA |
|---|---|---|
| [COOP-QUE-NAO-DESMONTA-01](sprints/2026-08-03-COOP-QUE-NAO-DESMONTA-01-o-jogador-2-que-dura-dois-segundos.md) | ABERTA. E1 a E4: a troca de primário destrói o jogador existente. Causa-raiz provada em três elos, com journal | |
| [PARTIDA-PICOTADA-01](sprints/2026-08-08-PARTIDA-PICOTADA-01-a-caixinha-que-tirava-o-jogador-2-a-cada-piscada.md) | Itens 2, 4, 5 e 6. O portão anti-recriação cobre a camada errada, e a suspensão passa por baixo via `stop_gamepad_emulation` | DELA |
| [JOGADOR-3-FANTASMA-01](sprints/2026-08-08-JOGADOR-3-FANTASMA-01-a-cura-certa-no-momento-errado.md) | Os três primeiros itens da seção 7. O `xfail` é a marca honesta de que o ciclo de vida da dispensa não tem código | DELA |
| [BORDA-DE-QUEDA-01](sprints/2026-08-03-BORDA-DE-QUEDA-01-o-que-fica-para-tras-quando-um-controle-cai.md) | ABERTA. E1 a E5. Sintoma reproduzido pela fala dela: quatro travamentos em 28 segundos | |
| [QUATRO-NA-MESA-01](sprints/2026-08-03-QUATRO-NA-MESA-01-o-que-so-quebra-quando-sao-quatro.md) | ABERTA. Os quatro defeitos. O aceite não pode ser escrito contra o sysfs (nota de 04/08) | DELA |
| [QUATRO-NO-RADIO-01](sprints/2026-08-03-QUATRO-NO-RADIO-01-o-checklist-dos-quatro-controles-por-bluetooth.md) | **→ Onda 12 · BT, trilha DELA.** ABERTA. O aceite inteiro, com jogo aberto. Depende de B1, B2 e B4 caírem antes | DELA |
| [JOGAVEL-EM-TODOS-01](sprints/2026-08-16-JOGAVEL-EM-TODOS-01-o-alvo-dela-e-cada-jogo-nos-dois-transportes.md) | ABERTA. Os quatro ensaios da seção 2, o chamador da allowlist, e o `hidden_count` que conta em vez de nomear | DELA |
| [TRES-PORTOES-01](sprints/2026-08-19-TRES-PORTOES-01-nao-anda-nem-o-microfone.md) | Seção 6 inteira: o `origem=`, a recriação do vpad em slot único, os 26 bytes que o vpad nunca escreve, a cadeia do microfone | DELA |
| [DUAS-CONTABILIDADES-01](sprints/2026-08-07-DUAS-CONTABILIDADES-01-a-lampada-conta-a-mesa-inteira-e-o-coop-so-metade.md) | ABERTA. O protocolo do cabo no meio da partida, e o cruzamento no jogador 1 — que é pior que colisão | DELA |
| [CONTAGEM-E-COOP-01](sprints/2026-07-31-CONTAGEM-E-COOP-01-o-aviso-antes-de-derrubar-tres-jogadores.md) | **→ Onda 5 · Emulação.** Duas peças do aceite da E3: a frase do Modo jogo durante a exceção, e o preço do gesto manual no toast | DELA |
| [POSSE-POR-CONTROLE-01](sprints/2026-08-03-POSSE-POR-CONTROLE-01-a-trava-de-um-controle-congela-os-quatro.md) | **→ Onda 9 · Rumble.** E1 inteira (trava indexada por MAC), o fallback broadcast do rumble em E3, e as quatro bancadas de E4 | DELA |
| [A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01](sprints/2026-08-16-A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01-o-jogo-nao-enxerga-e-a-culpa-nao-e-da-pessoa.md) | **→ Onda 2 · Início.** Os dois ensaios que a seção 8 exige antes de qualquer linha não têm bruto | DELA |
| [MASCARA-01](sprints/2026-07-25-MASCARA-01-como-este-controle-aparece-nos-jogos.md) | **→ Onda 5 · Emulação.** E2, E4 e metade da E3. Pré-requisito da E3/E4 da LUGAR-À-MESA-01, por decisão dela de 07/08 | |
| [MASCARA-POR-JOGADOR-01](sprints/2026-08-15-MASCARA-POR-JOGADOR-01-a-decisao-de-14-08-esbarra-na-de-10-08.md) | **→ Onda 2 · Início.** O último degrau da 7.2: `make_virtual_pad` resolver a máscara ANTES de escolher o backend, e o lado da escrita no IPC | |
| [LUGAR-A-MESA-01](sprints/2026-08-06-LUGAR-A-MESA-01-tres-controles-ligados-e-um-jogador-so.md) | **→ Onda 2 · Início.** E3 e E4, presas atrás da MASCARA-01. O grab mais FF em aparelho não-Sony continua sem prova | DELA |
| [JOGO-01](sprints/2026-07-25-JOGO-01-o-jogo-enxerga-quatro-controles.md) | A E2: a frase que distingue os dois estados do opt-in na aba Emulação | |
| [O-WRAPPER-QUE-SUMIU-01](sprints/2026-08-16-O-WRAPPER-QUE-SUMIU-01-uma-variavel-nova-apaga-a-ponte-em-silencio.md) | **→ Onda 11 · Sistema.** E2 (o guard de `LaunchOptions` por merge, no instalador e simétrico no uninstall) e E3 (a fração na aba Sistema) | |
| [WRAPPER-EM-TODOS-01](sprints/2026-08-03-WRAPPER-EM-TODOS-01-a-invariante-duplicado-melhor-que-zero-com-quatro.md) | **→ Onda 11 · Sistema.** E3 e o aceite de campo: a invariante só se prova com quatro controles numa partida de verdade | DELA |
| [STEAM-INPUT-01](sprints/2026-07-26-STEAM-INPUT-01-ela-nunca-mais-precisa-decidir.md) | **→ Onda 11 · Sistema.** E2 e E4 a E8, entre elas a lista por nome de jogo em vez de contagem | DELA |
| [DUPLO-REGISTRO-01](sprints/2026-07-26-DUPLO-REGISTRO-01-o-steam-input-tem-dois-cadastros.md) | **→ Onda 11 · Sistema.** ABERTA. A reconciliação dos dois registros, o grab pendente deixar de ser silencioso, e a leitura do `localconfig.vdf` em runtime | |
| [STEAM-QUE-DECIDE-01](sprints/2026-08-05-STEAM-QUE-DECIDE-01-ela-nao-tem-como-saber-quando-ligar.md) | **→ Onda 11 · Sistema.** E1 (o experimento M-04), E5, a metade honesta da E3, e o M-05 | DELA |
| [JOGOS-QUE-ELA-TEM-01](sprints/2026-08-06-JOGOS-QUE-ELA-TEM-01-escolher-da-biblioteca-em-vez-de-adivinhar-o-numero.md) | **→ Onda 6 · Perfis.** A E4 — perfil por jogo instalado. Nenhum símbolo em `src/` o faz nascer | DELA |
| [CONTROLE-SONY-MEDIDO-01](sprints/2026-08-06-CONTROLE-SONY-MEDIDO-01-o-experimento-que-decide-metade-da-doutrina.md) | A versão do cliente Steam não foi anotada — e é a variável que invalidou o resultado antigo | DELA |
| [AUDIO-QUE-TRANCA-01](sprints/2026-08-03-AUDIO-QUE-TRANCA-01-um-toque-no-volume-congela-a-troca-de-perfil.md) | **→ Onda 6 · Perfis.** ABERTA. As cinco entregas. A E1 é uma linha e é o que trava o produto hoje | DELA |
| [PERFIL-JOGO-01](sprints/2026-07-26-PERFIL-JOGO-01-as-configs-somem-ao-abrir-o-jogo.md) | **→ Onda 6 · Perfis.** A entrega 1 (rodar o experimento com ela e nomear o sintoma) nunca rodou, e sem ela as 2 a 6 não se sustentam | DELA |
| [PERFIL-NASCE-CERTO-01](sprints/2026-07-26-PERFIL-NASCE-CERTO-01-o-perfil-do-jogo-que-nunca-vence.md) | **→ Onda 6 · Perfis.** E3 e o resto da E4: o detector de sanidade existe e ninguém o dispara | |
| [AUTO-01](sprints/2026-07-25-AUTO-01-um-clique-em-vez-de-dez.md) | Dois catch-all semeados ainda em `match: any`, o `--no-dkms` único, e o critério de aceite nunca medido | DELA |
| [CONECTA-E-DESLIGA-01](sprints/2026-08-07-CONECTA-E-DESLIGA-01-a-regressao-que-ela-relatou-e-a-suspeita-que-recai-sobre-nos.md) | ABERTA. A cura, que ela mandou esperar. E a pergunta do item 2 vem antes dela | DELA |
| [OITO-DEFEITOS-01](sprints/2026-08-08-OITO-DEFEITOS-01-a-fila-que-a-verificacao-adversarial-derrubou-inteira.md) | **→ Onda 9 · Rumble.** 2.5 (o rumble) sem causa provada; 2.3, 2.6 e 2.8 não reconferidos e sem marca na árvore | DELA |
| [ORDEM-DE-CHEGADA-01](sprints/2026-08-15-ORDEM-DE-CHEGADA-01-a-fila-que-ela-pediu-nao-e-a-fila-que-o-produto-guarda.md) | E3 (o gesto `identity.renumber` alcançável de onde ela está), e o item C da frase dela segue não medido | |
| [ESCOLHA-DELA-VENCE-01](sprints/2026-08-01-ESCOLHA-DELA-VENCE-01-a-mascara-do-perfil-e-o-tooltip-do-xbox.md) | **→ Onda 6 · Perfis.** E2 (a máscara sobrevive ao reboot), E3 (a recusa com jogo aberto deixa de reportar sucesso), E5 | DELA |
| [EMULACAO-NO-JOGO-01](sprints/2026-07-29-EMULACAO-NO-JOGO-01-o-r1-troca-de-app-em-vez-de-jogar.md) | **→ Onda 5 · Emulação.** E5, duas peças do aceite da E3 não conferidas, e o cabeçalho desatualizado | DELA |
| [PS-TOQUE-CURTO-01](sprints/2026-08-03-PS-TOQUE-CURTO-01-o-gesto-de-religar-o-controle-abre-a-steam.md) | **→ Onda 11 · Sistema.** ABERTA. E1 a E4, incluindo declarar o `wmctrl` no install ou a dependência morre | |
| [IDENT-01](sprints/2026-07-25-IDENT-01-um-controle-duas-identidades.md) | ABERTA. As quatro entregas. O documento recusa o palpite automático de propósito | DELA |
| [IDENTIDADE-DUPLA-01](sprints/2026-08-04-IDENTIDADE-DUPLA-01-o-8bitdo-ocupa-dois-lugares-na-fila.md) | ABERTA. E1 é o MAC de cada modo, 2 minutos da mão dela. Sem ele, E2 a E4 seriam adivinhação por OUI | DELA |
| [REGRA-NAO-REGISTRO-01](sprints/2026-08-06-REGRA-NAO-REGISTRO-01-o-8bitdo-e-um-so-e-o-defeito-e-de-todo-mundo.md) | ABERTA. Fundir os dois rostos do 8BitDo. Ler antes a nota de `0df6825`: quatro pontos declarados errados, um deles destrutivo | |
| [NOME-HONESTO-01](sprints/2026-08-03-NOME-HONESTO-01-a-tela-chama-de-sony-o-que-o-kernel-ja-sabe-que-nao-e.md) | **→ Onda 2 · Início.** ABERTA. E1 a E5. Nenhuma linha entregue | DELA |
| [CHECKLIST de validação em hardware](sprints/2026-07-25-CHECKLIST-validacao-em-hardware.md) | ABERTA. As 31 caixas. Por construção, só ela pode fechá-las | DELA |
| [MASCARA-QUE-GRUDA-01](sprints/2026-08-22-MASCARA-QUE-GRUDA-01-quatro-perfis-dela-pedem-xbox-e-agora-isso-fica.md) | **→ Onda 2 · Início.** NOVA em 22/08. E1 a E3: remedir a H1 do portão que exige `xbox` com o desenho de hoje (vpad em `uhid`), e decidir o que os presets shipam | DELA |
| [ELO-MUDO-01](sprints/2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) | **→ Onda 1 · Configurações.** E1 feita (`62d092a`) e E2 pela metade (`b68223e`). Faltam E3 a E7: a tela do que está VALENDO, o appid do wrapper como fonte de match, o Proton por jogo, o roteiro do engasgo e o portão da família | DELA |
| [VPAD-SUSPENSO-MORTO-01](sprints/2026-08-22-VPAD-SUSPENSO-MORTO-01-metade-da-cura-esta-ligada.md) | **→ Onda 12 · daemon.** E1 a E4. Existe quem retoma e não existe quem suspende; a E4 está desbloqueada desde que a seção "Está tudo certo?" nasceu | |

### Faixa 2 — a casa sabe e o produto não faz (15)

| Sprint | O que falta | DELA |
|---|---|---|
| [AUTOMATISMO-MORTO-01](sprints/2026-07-30-AUTOMATISMO-MORTO-01-o-perfil-do-jogo-nunca-entra.md) | **→ Onda 6 · Perfis.** ABERTA. Tudo, a começar pela E0 (a janela dizer POR QUE o perfil não trocou). Duas sprints escreveram a cura, nenhuma a ligou | |
| [JANELA-CEGA-01](sprints/2026-07-28-JANELA-CEGA-01-o-detector-que-nunca-adoece.md) | **→ Onda 11 · Sistema.** A fiação do motivo do autoswitch até o IPC — escrita em duas sprints, ausente do daemon | |
| [SINAL-DE-JOGO-01](sprints/2026-07-31-SINAL-DE-JOGO-01-o-daemon-desiste-do-jogo-antes-do-jogo-acabar.md) | **→ Onda 2 · Início.** E1 (o experimento com o jogo vivo, sem bloco de journal no documento) e E2. E4 e E5 não reconferidas | DELA |
| [MODO-01](sprints/2026-07-25-MODO-01-o-modo-jogo-liga-sozinho.md) | **→ Onda 6 · Perfis.** O B4: o gate de foco cega a detecção. A AUTOMATISMO-MORTO-01 mediu 135 episódios DEPOIS desta sprint | DELA |
| [ENTREGA-QUE-NAO-LIGOU-01](sprints/2026-08-03-ENTREGA-QUE-NAO-LIGOU-01-o-codigo-que-existe-e-ninguem-chama.md) | E3, E4 e E5. Sem prova de nenhuma das três; o defeito 3 não foi conferido | |
| [A-NOITE-DOS-QUATRO-INVENTARIOS-01](sprints/2026-08-09-A-NOITE-DOS-QUATRO-INVENTARIOS-01-o-que-a-casa-sabe-e-o-que-o-produto-faz.md) | F-6(a) confirmado aberto pelo próprio código; F-2 e F-11 abertos e sem marca. F-3, F-7, F-9 e F-10 não reconferidos | DELA |
| [AGORA-E-DEPOIS-01](sprints/2026-08-08-AGORA-E-DEPOIS-01-o-plano-executavel-da-separacao-dos-dois-tempos.md) | **→ Onda 2 · Início.** O passo 6. As três ausências da seção 10 reproduzidas. Cuidado com o falso positivo `MascaraAdiada`, que mora em memória e morre no restart | DELA |
| [BONDS-QUE-SOBREVIVEM-01](sprints/2026-08-04-BONDS-QUE-SOBREVIVEM-01-o-salva-vidas-que-ninguem-aciona.md) | E5 inteira, E3.1, e o cabeçalho — que diz aberta sobre uma sprint de coração de pé desde 15/08 | DELA |
| [MESA-CHEIA-05](sprints/2026-08-13-MESA-CHEIA-05-o-rumble-por-mac-a-rota-que-ninguem-ligou.md) | **→ Onda 9 · Rumble.** A E1: `rumble_active` virar mapa por uniq, `rumble.set` aceitar endereço, e o `state_full` expor os quatro estados | |
| [SOM-DE-CADA-JOGADOR-01](sprints/2026-08-15-SOM-DE-CADA-JOGADOR-01-o-botao-que-nunca-funcionou-com-a-mesa-cheia.md) | **→ Onda 3 · Status.** E2 — a peça existe desde 20/08 e nunca foi ligada no botão. E3 e as mordidas 1 a 4. O ensaio às cegas do canal 3 não tem bruto | DELA |
| [MIC-BT-DONO-01](sprints/2026-08-03-MIC-BT-DONO-01-a-posse-do-mudo-ganha-dono-e-ciclo-de-vida.md) | ABERTA. Dar ao mudo do mic o tratamento que o LED recebeu. O alvo honesto é 55-75% de mudo, não 0% | |
| [ESTADO-QUE-MENTE-01](sprints/2026-08-03-ESTADO-QUE-MENTE-01-o-daemon-afirma-controle-conectado-com-a-mesa-vazia.md) | **→ Onda 3 · Status.** ABERTA. Derivar o topo do `state_full` da lista de controles. O painel da verdade mostra bateria de controle que não existe | |
| [PERFIL-SEM-RASTRO-01](sprints/2026-08-05-PERFIL-SEM-RASTRO-01-o-perfil-mudava-e-nada-registrava-quem-mudou.md) | A dívida de descoberta (três parágrafos na doc da CLI e uma linha no README), e o `_reject_traversal` nos caminhos de escrita | |
| [PROMESSA-NAO-CUMPRIDA-01](sprints/2026-07-26-PROMESSA-NAO-CUMPRIDA-01-o-que-o-projeto-anuncia-e-nao-entrega.md) | C3 continua verdadeiro e o código o confessa. A2, A3, C2, D, E e F não conferidos item a item | |
| [A-FÁBRICA-COM-UM-CLIENTE-01](sprints/2026-08-22-A-FABRICA-COM-UM-CLIENTE-01-a-saida-do-modo-nativo-perde-um-applier.md) | **→ Onda 9 · Rumble.** NOVA em 22/08. E1 a E3: a saída do Modo Nativo passa 6 dos 7 appliers, e a fábrica `gerente_do_daemon` tem um cliente só | |

### Faixa 3 — o install e o pacote entregam cura morta (10)

| Sprint | O que falta | DELA |
|---|---|---|
| [INSTALL-QUE-NAO-CARREGA-01](sprints/2026-08-07-INSTALL-QUE-NAO-CARREGA-01-as-descobertas-que-nunca-viraram-codigo.md) | L3 aberta e medida hoje: cinco arquivos de `assets/` citam documentos que não existem, e o portão de referências só varre `docs/`. L5 sem resposta | DELA |
| [SIMETRIA-INSTALL-02](sprints/2026-07-31-SIMETRIA-INSTALL-02-o-que-o-install-deixa-para-tras.md) | E3, E4, E6 (decisão dela) e E7. Não reconferido se a E2 fechou ou só foi anotada | DELA |
| [CURA-QUE-FERE-01](sprints/2026-08-04-CURA-QUE-FERE-01-toda-cura-de-systemd-tem-de-provar-o-ciclo-inteiro.md) | **→ Onda 12 · instalação.** E1 a E4: teste de ciclo por unit instalada, o portão da tabela de combinações, unit em failed virar FALHA no doctor, e a tela com o agente morto | |
| [BT-AGENT-TRAVA-O-RESTART-01](sprints/2026-08-04-BT-AGENT-TRAVA-O-RESTART-01-noventa-segundos-de-bluetooth-fora-do-ar.md) | E4 (`flock -n` no `ExecStopPost`) e E5 (`TimeoutStopSec` explícito). E7 é da CURA-QUE-FERE-01 e também segue aberta | |
| [BT-SNAPSHOT-SANDBOX-01](sprints/2026-08-04-BT-SNAPSHOT-SANDBOX-01-o-salva-vidas-que-falhava-so-no-naufragio.md) | O teste que a sprint pediu por escrito (o `ReadWritePaths` cobrir tudo que os `ExecStopPost` escrevem) e a varredura irmã | |
| [DROPIN-AMBIGUO-01](sprints/2026-08-04-DROPIN-AMBIGUO-01-a-ausencia-do-drop-in-e-indistinguivel-de-escolha.md) | ABERTA. E1 a E5. A E4 é decisão a declarar em voz alta | |
| [RADIO-ABERTO-01](sprints/2026-08-04-RADIO-ABERTO-01-o-que-instalamos-por-padrao-anula-a-autenticacao.md) | E2 (agente próprio, que é o que fecha o cenário) e E3. E4 a E6 seguem N/A | |
| [PUBLICACAO-FIEL-01](sprints/2026-07-31-PUBLICACAO-FIEL-01-o-que-a-release-conta-de-errado.md) | E2 (decisão dela) e E3, que não consegui localizar para reconferir. O cabeçalho precisa deixar de dizer que não houve código | DELA |
| [IDENTIDADE-01](sprints/2026-08-21-IDENTIDADE-01-o-projeto-ainda-se-chama-pelo-nome-dele.md) | **→ Onda 12 · instalação.** Fase 2 (renomear o id, os 15 testes, o CI) e Fase 3 (a migração). As duas na mesma leva: id novo sem migração deixa quem já usava sem os perfis | |
| [ARVORE-DIVERGENTE-01](sprints/2026-07-30-ARVORE-DIVERGENTE-01-o-que-esta-na-main-e-nao-roda.md) | Portar E1, E4 (com o co-op desligado, todo controle conectado ainda vira jogador 1) e E5. A tag citada resolve para outro commit | DELA |

### Faixa 4 — a janela mente, corta, ou não deixa ela ver (27)

| Sprint | O que falta | DELA |
|---|---|---|
| [LIGHTBAR-JOGADOR-01](sprints/2026-07-27-LIGHTBAR-JOGADOR-01-a-cor-e-consequencia-do-jogador.md) | **→ Onda 7 · Lightbar.** ABERTA. E0 a E4. Queixa direta dela olhando a tela, prioridade ALTA, 25 dias sem uma linha | DELA |
| [MESA-CHEIA-01](sprints/2026-08-13-MESA-CHEIA-01-a-fita-do-alvo-ganha-a-cor-de-cada-um.md) | **→ Onda 3 · Status.** ABERTA. A entrega inteira: a linguagem de cor do card da Status nos chips da fita, nas ONZE abas | DELA |
| [MESA-CHEIA-02](sprints/2026-08-13-MESA-CHEIA-02-a-marca-de-quem-escolheu-na-aba-gatilhos.md) | **→ Onda 8 · Gatilhos.** ABERTA. A entrega inteira. É ela que dá o formato da marca de que a 04 e a 06 dependem | DELA |
| [MESA-CHEIA-03](sprints/2026-08-13-MESA-CHEIA-03-a-mesma-marca-na-aba-lightbar.md) | **→ Onda 7 · Lightbar.** ABERTA. Quatro prévias numeradas, a marca nos seis presets, e a tela saber dizer o terceiro estado | DELA |
| [MESA-CHEIA-04](sprints/2026-08-13-MESA-CHEIA-04-a-marca-vira-gesto.md) | ABERTA. A entrega inteira. Depende da 02 | DELA |
| [MESA-CHEIA-06](sprints/2026-08-13-MESA-CHEIA-06-o-portao-contra-a-marca-que-mente.md) | **→ Onda 5 · Emulação.** ABERTA. O portão inteiro. Depende da 02, que daria o primeiro caso real | |
| [MESA-CHEIA-07](sprints/2026-08-13-MESA-CHEIA-07-a-decima-aba-que-ninguem-mediu.md) | **→ Onda 4 · No jogo.** A E2 — o painel da aba No jogo não tem uma única linha de cor | DELA |
| [MESA-CHEIA-10](sprints/2026-08-13-MESA-CHEIA-10-a-fita-que-nao-sabe-em-que-aba-esta.md) | **→ Onda 2 · Início.** ABERTA. A fita se requalificar nas seis abas em que o alvo não é honrado | DELA |
| [ONDE-A-COR-MORA-01](sprints/2026-08-15-ONDE-A-COR-MORA-01-a-borda-diz-quem-e-e-o-anel-diz-o-que-esta-escolhido.md) | **→ Onda 7 · Lightbar.** ABERTA. As três perguntas da seção 7 são dela; depois, ~190 linhas e as quatro mordidas, incluindo o guarda do alto contraste | DELA |
| [NAVEGA-PELO-CONTROLE-01](sprints/2026-08-15-NAVEGA-PELO-CONTROLE-01-quem-tem-o-foco-decide-o-que-o-R1-faz.md) | **→ Onda 10 · Navegação.** ABERTA. Seções 4 a 8 inteiras, a pergunta única da seção 9, e a prova de tela | DELA |
| [NAVEGAR-ESTA-JANELA-01](sprints/2026-08-15-NAVEGAR-ESTA-JANELA-01-a-decisao-ja-esta-tomada-e-o-dado-ja-esta-no-fio.md) | **→ Onda 10 · Navegação.** ABERTA. A entrega inteira, as duas perguntas da seção 8, e a prova de tela | DELA |
| [FIACAO-QUE-FALTA-01](sprints/2026-08-05-FIACAO-QUE-FALTA-01-o-verificador-que-ela-nao-tem-como-ver.md) | E1 (o verificador na janela), E4.1, E4.3, E5, E6 (texto de interface, palavra dela) e E3b | DELA |
| [JANELA-FIEL-01](sprints/2026-07-31-JANELA-FIEL-01-a-janela-que-para-de-reconciliar-e-o-botao-morto-no-pacote.md) | E5 (TUI) e E6 (bandeja), mais o aceite dela: a janela não trocar sozinha o que está na tela, e o Restaurar Padrão achar o arquivo | DELA |
| [JANELA-CORTADA-01](sprints/2026-08-17-JANELA-CORTADA-01-o-rodape-que-o-gtk-diz-que-cabe.md) | **→ Onda 3 · Status.** O item 2 — o selo Saída muda dentro do bloco, com bancada fiel à largura real do card | DELA |
| [JANELA-QUE-RESPIRA-01](sprints/2026-08-01-JANELA-QUE-RESPIRA-01-os-consertos-de-largura-que-a-casa-ja-tinha-decidido.md) | **→ Onda 10 · Navegação.** O aceite dela na janela real. Não há foto de aceite nem palavra registrada | DELA |
| [LARGURA-01](sprints/2026-07-29-LARGURA-01-a-mesma-largura-em-todas-as-abas.md) | **→ Onda 8 · Gatilhos.** E5 a E8. Só a E8 está provada aberta por símbolo. O `_WRAP_COLUNAS` fixo tranca a GATILHO-PALAVRA-01 | DELA |
| [LEGIBILIDADE-01](sprints/2026-07-25-LEGIBILIDADE-01-texto-legivel-alvo-clicavel.md) | **→ Onda 8 · Gatilhos.** O lugar dos analógicos e a largura a 1180x830, mais a decisão sobre as 11 classes órfãs do CSS | DELA |
| [CARD-OCUPA-01](sprints/2026-07-31-CARD-OCUPA-01-o-desenho-ocupa-o-vao-que-o-teto-devolveu.md) | **→ Onda 1 · Configurações.** E4: a aba Estado maximizada, e ela dizer se os quatro elementos ocuparam os vãos laterais | DELA |
| [RADAR-01](sprints/2026-07-31-RADAR-01-as-tres-superficies-que-ninguem-nunca-olhou.md) | E1, E2, E3 e o D1. O applet que ela usa TODO DIA continua sem o olho dela por cima | DELA |
| [BOTAO-QUE-NAO-MENTE-01](sprints/2026-07-26-BOTAO-QUE-NAO-MENTE-01-clico-e-nao-acontece-nada.md) | **→ Onda 8 · Gatilhos.** E5 (a regra de informar quantos controles cada sprint de interface adiciona ou remove) e E6. E1 e E3 não reconferidas | DELA |
| [PERFIL-SALVA-TUDO-01](sprints/2026-07-29-PERFIL-SALVA-TUDO-01-salvei-todas-as-abas-e-so-parte-ficou.md) | **→ Onda 6 · Perfis.** E5 e E6, nenhuma provável na árvore. E o cabeçalho, que ainda diz que E1 e E2 estão abertas — as duas estão em código com teste que morde | DELA |
| [PLAYER-LED-01](sprints/2026-07-25-PLAYER-LED-01-o-numero-do-jogo-chega-ao-controle.md) | **→ Onda 7 · Lightbar.** A entrega 5 — o diagnóstico honesto por controle. A entrega 4 tem sucessora própria, sinal de que o buraco não fechou aqui | |
| [FOCO-ERRANTE-01](sprints/2026-08-18-FOCO-ERRANTE-01-o-x-aponta-para-a-steam-e-leva-o-perfil-junto.md) | **→ Onda 6 · Perfis.** Passos 1, 2, 7, 8 e a cura de zero linhas (decisão dela). A ONDA 2 (backend COSMIC) intocada | DELA |
| [PROVA-DE-TELA-01](sprints/2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md) | **→ Onda 10 · Navegação.** A folha respondida dentro do documento — o passo 4 do próprio procedimento. Hoje as fotos entram e a folha não | DELA |
| [GATILHO-PALAVRA-01](sprints/2026-07-29-GATILHO-PALAVRA-01-os-dezenove-modos-em-portugues.md) | **→ Onda 8 · Gatilhos.** A escolha das dezenove palavras, que é dela por construção. Amarrada à decisão irmã da CR-SEQUENCIA-01/E5 | DELA |
| [CENTRAL-SEM-TELA-01](sprints/2026-08-22-CENTRAL-SEM-TELA-01-o-censo-e-o-apelido-nasceram-sem-porta.md) | **→ Onda 1 · Configurações.** NOVA em 22/08. E1 e E3 fecharam (`49797f8`); faltam a E2 (mover um controle de adaptador — o helper tem 7 verbos e nenhum chamador Python) e a E4, o alcance total que ela pediu | E4 DELA |
| [NO-MEU-FUNCIONA-01](sprints/2026-08-22-NO-MEU-FUNCIONA-01-o-ambiente-que-o-produto-presume-sem-medir.md) | **→ Onda 5 · Emulação.** NOVA em 22/08. E1 a E7: a Steam Flatpak, a bandeja fora do COSMIC, a janela que não abre sem XWayland, o backend escolhido pela presença de `DISPLAY` | parte DELA |

### Faixa 5 — o aparelho: luz, som, gatilho, rádio (35)

A maioria destas destranca com a bancada de 22/08 e o controle na mão dela.

| Sprint | O que falta | DELA |
|---|---|---|
| [PROVA-NO-PLASTICO-01](sprints/2026-08-19-PROVA-NO-PLASTICO-01-o-roteiro-de-quarenta-minutos-com-o-controle-na-mao.md) | ABERTA. Bloco A, B2 a B6, e o bloco C inteiro: 20 células que só o olho dela preenche | DELA |
| [O QUE PRECISA DE VOCÊ (19/08)](sprints/2026-08-19-O-QUE-PRECISA-DE-VOCE.md) | O roteiro de 40 min sem o bloco B1, abrir o Grim Fandango uma vez, olhar as cinco cores, e o chamador automático da allowlist | DELA |
| [A-PONTE-UNIVERSAL-01](sprints/2026-08-15-A-PONTE-UNIVERSAL-01-o-cabo-como-pedra-de-roseta.md) | P-1 (o oráculo de transporte pelo `HID_ID`), P-3, E-2, e a Onda 4 inteira | DELA |
| [ESCADA-QUE-RESPONDE-01](sprints/2026-08-15-ESCADA-QUE-RESPONDE-01-do-degrau-que-obedece-ao-conteudo-do-payload.md) | E-2 a E-6: todos escrevem no aparelho e dependem da D-31 e da D-32. E as linhas no caderno com a coluna do degrau preenchida | DELA |
| [A-CADEIA-DE-BLOCOS-01](sprints/2026-08-16-A-CADEIA-DE-BLOCOS-01-o-ensaio-de-quatro-minutos-que-decide-o-som-por-radio.md) | **→ Onda 12 · BT, trilha DELA.** ABERTA. O acréscimo no instrumento, os 6 minutos de olho dela no E-7, e as quatro perguntas da seção 10 | DELA |
| [O-ALTO-FALANTE-POR-RADIO-01](sprints/2026-08-15-O-ALTO-FALANTE-POR-RADIO-01-a-casa-ja-tinha-o-mapa.md) | **→ Onda 12 · BT, trilha DELA.** ABERTA. E1 (montar o `0x39` com o bloco duplo), E2 (o ensaio com a orelha dela) e E3 | DELA |
| [TRES-MODOS-DO-SOM-01](sprints/2026-08-16-TRES-MODOS-DO-SOM-01-o-que-sai-onde-e-quem-escolhe.md) | **→ Onda 3 · Status.** ABERTA. As cinco decisões P-1 a P-5 e as cinco ondas. Não conferido se a ONDA 1.2 caducou por outra via | DELA |
| [E5 — O TERRENO](sprints/2026-08-16-E5-O-TERRENO-o-que-o-E1-mudou-no-caminho-do-som.md) | Duas linhas no caderno de ensaios e o bruto da corrida. As três perguntas da seção 10 são dela | DELA |
| [SOM-ROTA-01](sprints/2026-08-01-SOM-ROTA-01-a-rota-o-preamp-e-o-canal-do-controle.md) | E2, metade da E3, E4 e E5 — dependem do hardware e da mão dela | DELA |
| [PARIDADE-SONY-01](sprints/2026-08-01-PARIDADE-SONY-01-o-que-o-jogo-manda-ao-alto-falante.md) | **→ Onda 4 · No jogo.** A E2 em diante só destranca com medição de jogo real mostrando valores diferentes dos que o sistema escreve | DELA |
| [CONTROLE-INTEIRO-NO-RADIO-01](sprints/2026-08-07-CONTROLE-INTEIRO-NO-RADIO-01-o-mic-e-o-fone-que-nao-atravessam.md) | A metade da SAÍDA (P5 e P6): não há sink virtual nenhum. E o documento precisa de nota datada dizendo que P0 a P3 caíram | |
| [SEM-MICROFONE-NENHUM-01](sprints/2026-08-06-SEM-MICROFONE-NENHUM-01-o-alto-falante-vira-a-entrada-padrao.md) | **→ Onda 5 · Emulação.** ABERTA. A política, e a medição que ela exige: o que o WirePlumber faz sem nenhuma fonte com porta usável. É privacidade | |
| [MIC-BT-01](sprints/2026-07-25-MIC-BT-01-o-medidor-do-microfone-por-bluetooth.md) | **→ Onda 12 · BT, trilha DELA.** Caixa 2 (só reabre com a posse do `/dev/hidraw` arbitrada), e as caixas 3 e 4 não encontradas na árvore | |
| [UNIDADE-COR-01](sprints/2026-08-15-UNIDADE-COR-01-o-controle-sabe-de-que-cor-ele-e.md) | **→ Onda 7 · Lightbar.** A cor do plástico chegar ao produto. E a metade por rádio da D-15 continua sem caminho | DELA |
| [LIGHTBAR-BT-CULPADO-01](sprints/2026-08-03-LIGHTBAR-BT-CULPADO-01-o-report-que-curava-e-o-que-trava.md) | **→ Onda 12 · BT, trilha DELA.** A E3 e o aceite dela. É a regressão que ela descreve como sempre arrumamos mas sempre volta | DELA |
| [SEGUNDO-ESCRITOR-01](sprints/2026-08-08-SEGUNDO-ESCRITOR-01-o-driver-do-kernel-tambem-escreve-a-barra.md) | **→ Onda 7 · Lightbar.** ABERTA. A medição de contraste dela. Nada virou código, e nada aponta para ela | DELA |
| [A-LUZ-QUE-CUROU-01](sprints/2026-08-07-A-LUZ-QUE-CUROU-01-calar-parou-o-bombardeio-e-voltar-tem-preco.md) | **→ Onda 12 · BT, trilha DELA.** O protocolo da seção 6 nunca rodou, e a pergunta da seção 7 não aparece respondida no painel de decisões dela | DELA |
| [CANETA-NA-MAO-01](sprints/2026-08-12-CANETA-NA-MAO-01-o-suspeito-que-ninguem-olhou-em-dezesseis-dias.md) | Seção 7, itens 1 a 5 e 7: a volta do ensaio da lightbar, o bit de autorização do gatilho, sete dos oito modos, e a PODA | DELA |
| [O-LACO-DE-ESCRITA-01](sprints/2026-08-15-O-LACO-DE-ESCRITA-01-o-suspeito-que-sobrou.md) | **→ Onda 9 · Rumble.** A D-38 (autorização dela) e o E-9. O negativo aposentaria uma justificativa que hoje cobra até 32 ms de latência | DELA |
| [BT-SURDO-01](sprints/2026-08-03-BT-SURDO-01-o-controle-parado-no-radio-nao-recebe-ordem.md) | **→ Onda 12 · BT, trilha DELA.** E2 (o `init()` que deixa thread fantasma), E3 (o ioctl de 5 s segurando o lock central) e E4 | |
| [BT-FURO-FINO-01](sprints/2026-08-03-BT-FURO-FINO-01-os-sete-caminhos-que-so-degradam-no-radio.md) | **→ Onda 12 · BT, trilha DELA.** Os defeitos 2 a 7, sem prova de cura e sem prova de que sigam abertos. O 2 é o outro marcado ALTA | |
| [BT-E-VPAD-01](sprints/2026-08-01-BT-E-VPAD-01-o-que-so-existe-no-cabo-e-os-seis-furos.md) | **→ Onda 5 · Emulação.** Furo 5 (a taxa declarada do Edge), não medido e sem nada na árvore que o meça. O furo 4 tem decisão registrada de não fazer | |
| [RADIO-BOMBARDEADO-01](sprints/2026-08-04-RADIO-BOMBARDEADO-01-quarenta-mil-frames-corrompidos-em-meia-hora.md) | **→ Onda 12 · BT, trilha DELA.** ABERTA. O bloco F inteiro e o A/B de dez minutos. ATENÇÃO: a fixture de 20/08 cortou o amplificador citado, e isso muda a linha de base | |
| [BUSCA-QUE-ESTOURA-01](sprints/2026-08-07-BUSCA-QUE-ESTOURA-01-o-sdp-que-nao-responde-a-tempo.md) | ABERTA. A escolha entre os cinco desenhos é dela. Houve movimento lateral em `7c2fb92`, que não é nenhum dos cinco | DELA |
| [CR-03](sprints/2026-07-25-CR-03-bancada-de-medicao.md) | ABERTA. A sprint inteira. Bloqueia a CR-04, que bloqueia a CR-06 | |
| [CR-04](sprints/2026-07-25-CR-04-os-efeitos-da-casa.md) | ABERTA. Todos os efeitos medidos na bancada. Não começa antes da CR-03 | |
| [CR-06](sprints/2026-07-25-CR-06-devolver-ao-ecossistema.md) | ABERTA. A publicação inteira. Não começa antes de CR-03 e CR-04 | |
| [CR-SEQUENCIA-01](sprints/2026-07-31-CR-SEQUENCIA-01-o-que-avanca-sem-a-mao-dela-e-o-que-nao.md) | E3 (a bancada, com posse explícita do hidraw), E4 (a parte dela), E6 e a decisão E5. O cabeçalho ABERTA é enganoso: metade do trilho já fechou | DELA |
| [BARRA-MUDA-01](sprints/2026-08-22-BARRA-MUDA-01-a-lampada-nao-se-le-o-nascimento-sim.md) | **→ Onda 7 · Lightbar.** ENTREGUE, menos o experimento da §6 — o único que fecha a célula do mapa, e só o olho dela o faz | DELA |
| [SINAL-NO-NASCIMENTO-01](sprints/2026-08-22-SINAL-NO-NASCIMENTO-01-o-veredito-existe-e-o-hotplug-nao-pergunta.md) | NOVA em 22/08. E1 a E4: o tique de hotplug carimbar o veredito, a razão aparecer no card, o portão, e a colisão de nome entre `mesa_de_radio` e `sinal_da_barra` | |
| [LUZ-CEGA-01](sprints/2026-08-22-LUZ-CEGA-01-a-barra-apagada-e-o-exame-que-nao-olha-o-radio.md) | **→ Onda 7 · Lightbar.** E1, E2, E7 e metade da E5 fecharam. Faltam E3, E4, E6 e a **E8** — quatro MACs de fixture no `controllers.json` vivo dela | E8 parte DELA |
| [QUATRO-MICROFONES-01](sprints/2026-08-22-QUATRO-MICROFONES-01-a-ponte-esta-desligada-e-a-conta-diz-que-cabe.md) | **→ Onda 3 · Status.** NOVA em 22/08. E1 a E3: o interruptor que `bt_mic_enabled` nunca teve, a frase do medidor, e o ensaio dos quatro ao mesmo tempo | DELA |
| [DOIS-CAIRAM-DE-UMA-VEZ-01](sprints/2026-08-22-DOIS-CAIRAM-DE-UMA-VEZ-01-o-disconnect-que-derrubou-o-controle-do-vizinho.md) | **→ Onda 12 · BT, trilha DELA.** NOVA em 22/08. E1 a E3: reproduzir (ou não), separar as três famílias, e decidir o que o botão faz enquanto não se sabe | |
| [N-IGUAL-A-UM-01](sprints/2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md) | E1 e E3 fecharam (`29c8a19`, `b77ed62`). Faltam E2 (o alias em TODO adaptador que hospeda Nintendo), E4 (o portão da classe) e E5 | parte DELA |
| [UMA-FAIXA-NÃO-É-UM-FABRICANTE-01](sprints/2026-08-22-UMA-FAIXA-NAO-E-UM-FABRICANTE-01-o-pro-dela-virou-a-definicao-de-pro.md) | E1 saiu em `e5376a0` (nasceu `core/linhagem_nintendo.py`). Faltam E2 (a regra 84 aprender a dizer "não sei"), E3 e E4 | DELA |

### Faixa 6 — documentação, portões e instrumento (12)

| Sprint | O que falta | DELA |
|---|---|---|
| [MAPA-QUE-VIRA-PORTAO-02](sprints/2026-08-11-MAPA-QUE-VIRA-PORTAO-02-o-que-entrou-e-o-que-continua-sendo-dela.md) | Itens 2 a 5. O 4 caducou pela metade: as três colunas cobrem menos de um quinto das linhas. O item 3 não reconferido | DELA |
| [DOC-QUE-NAO-MENTE-03](sprints/2026-08-03-DOC-QUE-NAO-MENTE-03-a-foto-vazia-a-env-negada-e-a-tag-velha.md) | E2 a E6. A doc de métricas ainda afirma zero ocorrências onde há 4, e os IDs órfãos seguem sem documento nem lápide | |
| [DOC-QUE-NAO-MENTE-04](sprints/2026-08-03-DOC-QUE-NAO-MENTE-04-os-nove-mecanismos-e-os-seis-portoes.md) | Os portões A, C, D e E. Sem eles, as duas mentiras da sprint seguem sem quem as pegue | |
| [DOC-VERDADE-02](sprints/2026-07-31-DOC-VERDADE-02-a-recontagem-e-as-quatro-mentiras-novas.md) | E7 é a única provada aberta por texto vivo. E1 a E4 e E6 não reconferidas | |
| [DOC-VERDADE-01](sprints/2026-07-26-DOC-VERDADE-01-a-documentacao-descreve-outro-programa.md) | e1 (a varredura nos quatro documentos de protocolo e em seis ADRs) e e6 (a colisão de nomes com os modos HID) | |
| [ROTULOS-DE-SPRINT-01](sprints/2026-08-09-ROTULOS-DE-SPRINT-01-entregue-no-codigo-nao-e-validado-por-ela.md) | A regra 4 do portão continua PROPOSTA. O portão de referências tem só as regras 1, 2 e 3 | DELA |
| [A-LINHA-QUE-DISPENSA-01](sprints/2026-08-15-A-LINHA-QUE-DISPENSA-01-o-defeito-mora-onde-a-autora-escreveu-que-nao-precisava-olhar.md) | E1, E2 e E3 — a E3 é a que teria pego quatro das seis. Cinquenta minutos ao todo | DELA |
| [TRES-REFUTADAS-01](sprints/2026-08-15-TRES-REFUTADAS-01-o-que-a-terceira-rodada-de-ceticismo-deixou-de-pe.md) | 1.5 (E1 e E3), 1.4 (E1 a E4) e o teste permanente das quatro conjunções nuas de 1.11 | DELA |
| [TESTE-HONESTO-01](sprints/2026-07-31-TESTE-HONESTO-01-os-297-verdes-que-nao-medem-interface.md) | **→ Onda 12 · portão.** E2 (a fixture de captura de Bluetooth) e os 68 `importorskip` restantes | |
| [SUITE-QUE-SUJA-O-JORNAL-01](sprints/2026-08-04-SUITE-QUE-SUJA-O-JORNAL-01-os-testes-escrevem-no-journal-do-sistema.md) | E4 (o portão) — exatamente o que a sprint previu. E o cabeçalho, que diz aberta sobre uma sprint majoritariamente paga | |
| [BERCO-DE-TMP-01](sprints/2026-08-07-BERCO-DE-TMP-01-a-suite-nao-suja-a-config-dela-suja-o-tmp.md) | Quatro dos sete declarados. Rodar a faxina no `/tmp` dela é palavra dela | DELA |
| [GATE-EMOJI-01](sprints/2026-07-27-GATE-EMOJI-01-o-higienizador-apaga-o-que-o-adr-protege.md) | E1: colar um emoji, salvar pelo editor dela, e ver se os 238 glifos do ADR-011 sobrevivem. Só a máquina dela responde | DELA |

---

## 4. BURACOS DE TEXTO — atacados em 22/08, e o que ficou

Os oito buracos de código desta lista foram para a fila da seção 1. Ficam aqui os
oito de texto: **todos foram atacados na leva de 22/08 e nenhum fechou por
completo**. Um cético mediu o que sobrou de cada um, e é só isso que vale ler —
a correção original saiu, porque já foi feita.

| Onde | O que foi atacado em 22/08 | O que FALTA |
|---|---|---|
| `docs/data/LEIA-PRIMEIRO.md` | Os quatro buracos da porta de entrada das specs (o mapa 302x45, as tabelas de 616 e 604, as quatro colunas do eixo de ponte, o parágrafo do `mapa-resumo.csv`). O arquivo de hoje tem 99 linhas e os números novos | A frase da "cura de raiz", no fim da seção 1, diz que o `Resumo do censo` do `scripts/check_paridade_transporte.py` "já imprime quase todos os contadores das seções 1 a 3". MEDIDO em 22/08, rodando o portão: o resumo imprime 18 números, e **11** deles aparecem nessas seções (308, 616, 124, 64, 14, 36, 177, 16, 4 e dois zeros). Continuam digitados à mão os bytes dos 10 arquivos, as 47 colunas, os 13 pares, o `existe`, as duas réguas por valor e as 20 casas do cruzamento. Trocar "quase todos" pelo que é: os do censo do mapa, e só |
| `docs/usage/metrics.md` | A negativa caduca na doc de uso e no `README.md`; o `docs/adr/016-prometheus-metrics.md` ganhou nota datada | O valor antigo sobreviveu no lugar de onde a próxima pessoa copia o fato como medido: `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`, linhas 360 e 458, ainda afirmam que "a única ocorrência fora de src/" é o changelog do pacote Fedora. Trocar pelo par medido usado em `metrics.md`, e o ponteiro `spec:420` (morto) por `spec:459`. Modelo pronto na entrada irmã da linha 446, que já usa a redação escopada |
| `docs/usage/cli.md` | O bloco do aviso de falha conhecida (defeito corrigido em 25/07) saiu, e o corpo ganhou os comandos e ações que faltavam | (1) A frase nova de 353-355 diz "outras marcas", e `discover_external_gamepads` exclui por VID/PID de DualSense e Edge — um DualShock 4 cai como externo; e os externos ENTRAM em "controles na mesa". (2) A linha 335 e a nota de 06/08 ensinam a saída `jogadores ativos: 1`, que a CLI não produz mais — a nota fica, com uma linha dizendo o que mudou. (3) O `help=` e o docstring de `.../cli/cmd_test.py` contradizem a seção nova: é produto, e o `--help` é a primeira boca. (4) `docs/protocol/trigger-modes.md`, linhas 111 e 118, ainda mandam a linha que a DOC-QUE-NAO-MENTE-04 classificou como mentira em 03/08. (5) Menor: `cli/app.py` na linha 126 faz o comando de produto `led` chamar `cmd_test.cmd_led` |
| `docs/usage/hotkeys.md` | A linha do gesto na tabela, o parágrafo do R3 e a ressalva de prova de plástico | "e o jogo passou a andar" não tem prova: o journal sustenta a troca de máscara e o vpad Xbox subindo com o jogo aberto, e a escada encerrou por `jogo_fechou` sem carimbo. A condição "só com jogo na mão" vale para o aviso de RISCO, não para a sequência de FALHA. O parágrafo da escada precisa da ressalva: sem carimbo, o degrau só vence o ciclo quando o próximo é alcançável ao vivo. Ainda contradizem a página: `docs/process/METODO-DE-ISOLAMENTO.md` (973-976) e `sprints/2026-08-19-O-QUE-PRECISA-DE-VOCE.md` (29). E a bancada de 19→20/08 não está em `docs/data/ensaios.csv` — sem ela, a linha do verde entre as cinco cores fica travada. Nit herdado: `#ffb86c` é "laranja" aqui e "âmbar" em dois documentos |
| `docs/usage/jogos-e-mascaras.md` | O caminho real para desfazer a exceção do Steam Input, mais os dois comandos de CLI, com teste novo que reprova a volta da mentira | A página promete um diálogo que o código não faz nascer: `.../app/actions/profiles_actions.py`, por volta de 1918, não relê o sinal ao vivo antes de perguntar. Ou chamar `_ha_jogo_aberto_agora()` ali (uma linha, com teste que MORDA), ou qualificar a frase. Dentro da mesma função, a docstring de 1877-1880 ainda abre com "Sem diálogo", refutada pelo bloco abaixo dela. Fora dela: `.../integrations/steam_launch_options.py` (1256-1258) repete a frase que a página marca como REFUTADA e que o `gui/main.glade` já corrigiu; `2026-08-07-PAINEL-as-nove-decisoes-que-esperam-ela.md` (25) caducou em 07/08; e `docs/usage/interface.md` (447) precisa espelhar |
| `docs/usage/creating-profiles.md` | A seção `ponte` entrou na doc de perfis, e o gesto na doc de gestos | O gesto está invertido: ele diz "esta ponte NÃO serve" e move a escada; quem carimba é o SILÊNCIO, uma vez só, pelo tique de 1 Hz em `.../daemon/launch_env.py`. Hoje o único caso aparece como secundário. `confirmada_por` promete `gesto` e `escolha_dela`, e nenhum dos dois tem escritor em `src/` — o único chamador grava `silencio`. O mesmo fato errado está no comentário de `.../daemon/ipc_handlers.py` (1897-1901), que é provavelmente a fonte: a varredura do valor antigo não pode parar em `docs/`. E o `volume` do mic não entra em TODA ativação: a trava manual de áudio vence o perfil (`profiles/manager.py`, 822-827) |
| `.../integrations/prontuario_dos_jogos.py` | As três frases falsas (o doctor e a GUI que não consomem, e o "não escreve em lugar nenhum" que caducou em 19/08) | O `COMO-EXECUTAR.md` da sprint da aba Configurações cita a docstring apagada palavra por palavra, nas linhas 2000 e 3090, e manda "copiar a forma" de um padrão que declara existir TRÊS vezes. MEDIDO: são DUAS (`scripts/doctor.sh` nas linhas 1613 e 3235); o prontuário não é consumido por ninguém, e é justamente o terceiro exemplo. Corrigir a citação, o número e o ponteiro `:505`, que hoje é `:519` |
| `.../core/rumble.py` | O número do dono declarado: Máximo vale 1,5, e nunca valeu 2.0 | BLOQUEANTE: `tests/unit/test_politica_de_vibracao_a_escada_que_amplifica.py` diz "200%" na linha 236 e "1,5" na linha 8 — o arquivo se contradiz consigo mesmo. Mesma regra, mesmo tratamento: número errado sai, sem nota nem data. Menor, herdado: o empate do degrau 1.0 do automático com o Balanceado veio de o BALANCEADO subir de 0,7 para 1,0 em `496ba05`, não de o Máximo subir. Menor: a linha 89 continua importando a tabela de `daemon/lifecycle.py` (re-export), não do dono declarado `daemon/subsystems/rumble.py` |

**A lição que custou uma sessão inteira, 22/08/2026:** o commit `c4471a1` curou o
`docs/data/LEIA-PRIMEIRO.md` e, no MESMO commit, escreveu os quatro buracos dele
aqui como abertos. O backlog nasceu defasado, e o agente seguinte gastou a sessão
remedindo buraco já curado. Quem ataca um buraco fecha a linha dele na mesma
leva — esta seção não é registro do que se achou, é fila do que falta.

---

## 4.1. AS 28 PARCIAIS TRIADAS — e por que NENHUMA é barata

Das 87 parciais, 28 não dependem dela. Quatro agentes mediram o custo real de
fechar cada uma, e um cético conferiu as seis que pareciam baratas.

| Classe | Quantas |
|---|---|
| `CONSTRUIR` — falta código de verdade | **12** |
| `SO_TESTE` — a cura existe, falta teste que morda | 5 |
| `NAO_FECHA_SEM_HARDWARE` — o censo não viu que precisa da bancada | 4 |
| `SO_LIGAR` — código pronto, falta chamador | 4 |
| `JA_FECHADA` — o censo teria errado | 2 |
| `SO_DOC` | 1 |

**O cético derrubou as SEIS.** As duas `JA_FECHADA` continuam abertas e as
quatro `SO_LIGAR` não são "só ligar":

| Sprint | Era | É | Por quê |
|---|---|---|---|
| PROMESSA-NAO-CUMPRIDA-01 | `SO_LIGAR` | faxina cara | O item que a sustentava (C1, métricas sem chave) está **fechado desde 01/08**, com código, teste, doc e nota de ADR. A página acusa nove coisas já feitas |
| JOGO-01 | `SO_LIGAR` | **caducada** | `vpad_suspenso` **nunca fica `True`** num daemon de hoje. O dado que se mandaria "ligar" está morto, e o vocabulário foi invertido por decisão dela depois da sprint |
| PERFIL-NASCE-CERTO-01 | `SO_LIGAR` | aberta e cara | O botão existe desde 06/08, mas o **gesto que ele dispara ficou inerte** quando a E2 entrou — e a própria E2 escreveu isso |
| MASCARA-POR-JOGADOR-01 | `SO_LIGAR` | **escolha** | As peças existem; o que falta é decidir, não ligar |
| DOC-VERDADE-01 | `JA_FECHADA` | aberta | A régua da classificação estava errada: grepou nome velho e achou zero |
| ORDEM-DE-CHEGADA-01 | `JA_FECHADA` | aberta | Existe **decisão datada de NÃO ligar**, dentro da própria lápide usada como prova a favor |

**A conclusão prática:** não há fruta baixa nas parciais. O que parecia "uma
hora" é faxina documental, feature caducada ou decisão dela. A contagem do
cabeçalho (74/87/40) **não muda** — as duas `JA_FECHADA` foram derrubadas.

**O achado virou sprint:**
[VPAD-SUSPENSO-MORTO-01](sprints/2026-08-22-VPAD-SUSPENSO-MORTO-01-metade-da-cura-esta-ligada.md).
Confirmado com o mecanismo exato: `suspend_vpads_for_steam_input()` (que põe
`True`) **não tem nenhuma chamada em `src/`** — só em quatro arquivos de teste —,
enquanto a irmã `resume_vpads_after_steam_input()` é chamada em
`gamepad.py:526`. Existe quem retoma e não existe quem suspende, então a flag só
anda para `False`, e as três leituras de produção relatam sempre o mesmo estado.
A suíte verde é o que esconde: a função é testada, ninguém pergunta quem a
invoca fora dali.

---

## 5. O QUE PRECISA DELA — eram seis, e **ela já respondeu cinco**

> **CORREÇÃO DE 25/08/2026, e ela custou três dias.** Esta seção dizia *"são
> SEIS"* e a [escada de releases](2026-08-24-A-ESCADA-DE-RELEASES.md) somava
> *"6 decisões, de 29 a 39 minutos"* como custo dela para a 0.9.6. **Cinco das
> seis já estavam respondidas** — ela marcou as caixas no `DECISOES.md` no
> commit `4272438`, de **22/08**, e em duas delas escreveu à mão. A resposta
> nunca foi colhida para o `decisoes-dela.csv`, e por isso a casa continuou
> cobrando dela um trabalho já feito.
>
> **Colhidas em 25/08** (`docs/data/decisoes-dela.csv`): `D-LARGURA-APROVADA`,
> `D-E9-LACO-DE-ESCRITA`, `D-VIGIA-DO-STEAM-INPUT`, `D-STEAM-SAI-DA-NAVEGACAO`,
> `D-SEMEAR-SO-OS-QUE-FALTAM`. **Sobra UMA:** a pergunta 1 — *"a janela depois
> dos sete consertos de largura está boa?"*, que é olho na tela e não decisão
> de mesa.
>
> **E a nota manuscrita dela na pergunta 5 abriu uma decisão NOVA**, que estava
> pendurada sem resposta desde 22/08: `D-PERFIL-NAVEGACAO`. Medido em 24/08 —
> o `navegacao.json` não tem seção `mouse` nem `key_bindings`; ele não navega
> nada. É homônimo da aba, não redundante com ela. E a intuição dela achou um
> buraco real: **não existe perfil que transforme o controle em mouse/teclado
> ao sair do jogo**, embora o esquema permita.
>
> **A lição, e ela vale mais que a correção:** o `DECISOES.md` é onde ela
> responde, e o `decisoes-dela.csv` é onde a casa lê. **Sem alguém carregando de
> um para o outro, a resposta dela não existe.** Colher o `DECISOES.md` é passo
> obrigatório de quem coordena, e agora está escrito.

**O documento é [`DECISOES.md`](../../DECISOES.md), na raiz.** Ele tem o print, as
opções e o custo de cada uma. Esta seção não repete o conteúdo dele.

O censo marcou 84 sprints como dependentes dela. Seis agentes leram uma a uma e
extraíram **163 perguntas**; um cético independente conferiu cada uma, com uma
instrução acima das outras: *antes de aceitar, procure se já foi decidida.*

```
163  perguntas extraídas
 23  descartadas: não eram decisão dela, eram trabalho
 54  DERRUBADAS — já tinham resposta, com data e lugar
  6  sobreviveram        (29 a 39 minutos, no total)
```

O projeto carregava um peso falso. As 54 já respondidas estão no fim do
`DECISOES.md`, em tabela, para ninguém reabri-las — e em quatro delas a coluna
de data ficou com travessão, porque a pergunta estava **mal feita**, não
respondida.

Os quatro gestos abaixo continuam descrevendo o TIPO de trabalho que sobra nas
sprints marcadas `DELA` na seção 3 — a maior parte é bancada e olho na tela, que
não são decisão e por isso não entram no `DECISOES.md`:

| Gesto | O que destranca |
|---|---|
| **Controle na mão, com a bancada** | a faixa 5 quase inteira, a CHECKLIST de hardware, a PROVA-NO-PLASTICO-01 e o roteiro de 40 min de 19/08 |
| **Olho na tela, foto antes e depois** | a faixa 4 inteira — por PROVA-DE-TELA-01, interface não fecha sem a palavra dela |
| **Palavra de vocabulário e de texto de interface** | GATILHO-PALAVRA-01 (as dezenove palavras), ONDE-A-COR-MORA-01 (as três perguntas), TRES-MODOS-DO-SOM-01 (P-1 a P-5), a frase do travessão da FIACAO-QUE-FALTA-01 |
| **Decisão de projeto, com o preço na mesa** | BUSCA-QUE-ESTOURA-01 (os cinco desenhos), DROPIN-AMBIGUO-01 (a migração), RADIO-ABERTO-01 e CONECTA-E-DESLIGA-01 (o preço que ninguém perguntou se ela aceitava), IDENTIDADE-DUPLA-01 (o MAC de cada modo, 2 minutos) |

As perguntas já escritas e ainda sem resposta estão em
[AS DECISÕES QUE ESPERAM VOCÊ](2026-08-15-AS-DECISOES-QUE-ESPERAM-VOCE.md) e em
[O QUE PRECISA DE VOCÊ (19/08)](sprints/2026-08-19-O-QUE-PRECISA-DE-VOCE.md).

---

## 6. A regra deste arquivo

Quem fecha uma sprint atualiza aqui, no mesmo commit — tira a linha da seção 3
e corrige a contagem do cabeçalho. Quem abre uma sprint nova põe a linha na
faixa a que ela pertence. Este arquivo não tem portão: ele vale exatamente o
que a última pessoa que o tocou escreveu.

**Três regras a mais, nascidas da leva das onze abas (23/08):**

1. **Uma sprint tem UMA onda.** Se ela aparecer em duas, a dona é quem mexe no
   código; a outra declara dependência — e a troca fica registrada na §0.5.
2. **A onda se cita pelo NOME DA ABA, não só pelo número** — sempre
   `Onda N · Aba`. As ondas foram renumeradas às 22h de 23/08 e três sprints no
   disco carregam o número velho (§0); quem abrir uma delas corrige o cabeçalho
   dela no mesmo commit. As onze sprints de aba já existem e já estão linkadas
   na §0.3: link para arquivo que não existe é referência morta, e há portão.
3. **Quem fecha uma onda risca a marca `→ Onda N · Aba` das sprints que ela
   absorveu**, ou diz na linha o que ficou de fora. Absorvida não é fechada.
4. **Sprint absorvida sem linha na fila mora na tabela das 35 da §0.4** — é o
   único lugar em que ela é alcançável. Quem lhe der linha na seção 3 tira-a de
   lá no mesmo commit.
