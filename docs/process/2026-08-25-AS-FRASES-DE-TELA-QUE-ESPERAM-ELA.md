# As frases de tela que esperam o olho dela — a leva de 25/08

**25/08/2026.** Primeira enumeração real das mudanças de texto de tela da
madrugada, aba por aba, com a frase que saiu e a que entrou.

## O número publicado era 43. São 60.

E a diferença não é erro de contagem de ninguém: **o 43 nunca foi
enumerado.** O número aparece em dois lugares — o `ONDE-PARAMOS` da leva e
o `SPRINT_ORDER` —, e os dois mandam buscar *"a lista completa, aba por aba"*
no **relatório do conferente da leva**.

**Esse relatório não existe.** Os 27 arquivos de
`docs/process/agentes/2026-08-25/` estão no disco, nenhum é do conferente, e
a string "quarenta e três" não aparece em nenhum deles. Não havia lista
contra a qual reconciliar — esta é a primeira.

As quatro causas da diferença, todas conferidas:

1. **Contamos coisas diferentes.** Aqui a unidade é a FRASE DE TELA; a
   contagem publicada parece contar ITEM DE RELATÓRIO. Vários itens carregam
   mais de uma frase — um deles são quatro frases de vibração em quatro
   lugares. Contando por item, os 60 caem para a casa dos 50; ainda não 43.
2. **Seis das 60 não são de aba nenhuma:** duas do rodapé (que ela vê em
   todas as abas) e quatro de SAÍDA DE TERMINAL do `doctor.sh`. Tirando-as,
   sobram 54.
3. **O documento diz "em dez das onze abas" e esta lista toca as ONZE** —
   logo a contagem publicada deixou pelo menos uma aba inteira de fora.
4. **60 já é agregação, não piso.** Cinco entradas são pacotes: as OITO
   frases do `./install.sh`, as 38 dicas dos 19 modos de gatilho, as quatro
   de política de vibração, os quatro estados da dica do microfone e os
   quatro botões da janela do mapa. **Frase por frase, passa de 100.**

> **Cuidado com uma coincidência:** 43 das 60 entradas não trazem o texto
> literal no relatório de origem e precisam de conferência no código. É o
> mesmo número da contagem publicada, **por acaso** — não são o mesmo
> conjunto, e não se tira conclusão disso.

---

## As oito que mais mudam o que ela vê

1. **Emulação — o microfone para de pintar "Ligado" em verde sobre alvo que a aba nunca olhou.** A conclusão saía de três arquivos do WirePlumber, sem jamais perguntar se existe microfone a ligar — e o caso comum disso é o controle no RÁDIO, onde não há placa ALSA nenhuma. Nasce um quarto estado, "sem alvo". (`emulation_actions.py:1169-1170`; texto novo não citado no relatório.)

2. **Gatilhos — "Rigid aplicado" com zero destino vira "nenhum controle recebeu — não há controle na mesa".** O daemon respondeu `aplicado_em: []`, `guardado_em: []`: nenhum byte no fio, e a barra dizia "aplicado". Com a mesa vazia ela leria a barra e concluiria que o gatilho está armado.

3. **Rodapé — "Perfil aplicado." sobre uma RECUSA do daemon.** A troca de máscara era recusada e o rodapé comemorava; a frase nova é a do desfecho da recusa, que contém "Ainda não". A mordida é literal e cruel: `assert 'Ainda não' in 'Perfil aplicado.'`. O rodapé aparece em todas as abas.

4. **Início — a pausa chega à primeira aba.** Com o daemon em pausa, a aba prometia luz e vibração que não saem. A frase da pausa entra NO LUGAR da promessa do modo, não ao lado dela — duas frases no mesmo instante fariam a aba dizer duas coisas.

5. **Início — "você escolheu" para de acusar sobre gesto que ela não deu, e vira "o perfil ativo pede".** A divergência de máscara era medida contra a máscara do PERFIL, que entra sozinho; só gesto dela mantém "você escolheu".

6. **Emulação — a aba para de prometer vibração que ninguém mediu.** Entra, nas frases do gamepad virtual: "A vibração ainda não foi conferida no aparelho — nem no cabo, nem no rádio: o caminho está montado, e se ela não vier não é erro seu." O mapa diz `de_onde_sei = inferido-do-codigo` nos DOIS transportes.

7. **Lightbar — "Aceso agora:" vira "Desenho que mandamos:".** "Aceso" é leitura de volta que o produto não tem e não pode ter: `luz.led_jogador.leitura@dualsense` é `cabo_aceita = não` e `radio_aceita = não`. O texto de espera acompanha: "Aceso agora: consultando…" → "Desenho que mandamos: lendo o perfil…".

8. **Perfis — remover diz quando o perfil é o que está valendo.** Três frases novas (o quê / por quê / o que fazer), ANTES da linha "permanente e não pode ser desfeita" — que é a que se aprende a pular. Apagar o perfil ativo era um clique sem uma palavra.

---

## Todas, por aba

A coluna **lit.** diz se a frase foi copiada literalmente do relatório
(`sim`) ou se o relatório só descreveu a mudança e o texto precisa ser
conferido no código (`CONFERIR`).

### Início — 9

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| descrição do modo no `_render_home` — o terceiro estado, escrito pela função pura nova `texto_da_pausa` | (não citada no relatório) — a promessa do modo: a frase que descreve o modo e fala de luz e de vibração | (não citada no relatório) — a frase da pausa, que entra NO LUGAR da promessa do modo, não como banner ao lado dela | com o daemon em pausa a aba prometia luz e vibração que não saem; deixar as duas frases faria a aba dizer duas coisas no mesmo instante. | **CONFERIR** |
| frase da divergência de máscara — `_mascara_escolhida_com_fonte`, `FONTE_GESTO_DELA` / `FONTE_PERFIL`, e o leitor novo `mascara_divergente_do_daemon` | você escolheu | o perfil ativo pede | a frase acusava um gesto que ela não deu — a máscara vinha do perfil, que entra sozinho. Com o alarme do daemon populado, a frase passa a nomear o perfil do jogo em cena; só gesto dela mantém "você escolheu". | **CONFERIR** |
| linha "Ponte com o jogo:" — quarto veredito de `texto_da_ponte`, com a função pura `controles_na_mesa` | (não citada no relatório) — a linha da ponte acendendo mesmo com a mesa vazia | (não citada no relatório) — o quarto veredito: sobre mesa vazia a ponte NÃO acende | sem controle na mesa não há ponte a afirmar, e o payload medido de 23/08 produzia verde. Falso verde na primeira tela. | **CONFERIR** |
| linha do cadeado (autoswitch) — função NOVA `texto_do_cadeado_cego`, deliberadamente fora de `autoswitch_lock_text`, que também alimenta o toast do rodapé | (não citada no relatório) — a linha do cadeado com uma metade só | (não citada no relatório) — a segunda metade, que diz quando o mecanismo que o cadeado governa está cego | o cadeado afirmava governar um detector de janela que podia estar sem enxergar nada. Ausência da chave é "não sei", nunca "está cego". | **CONFERIR** |
| conta de jogadores e cards da fileira — `_format_players_hint(controllers, externos)`, `externos_na_mesa`, `_format_external_title` / `_format_external_subtitle` | (não citada no relatório) — a conta que, com dois DualSense e um externo na mesa, dizia "dois controles" | (não citada no relatório) — a conta que inclui o externo SEM prometer que ele é um jogador, mais um card de externo novo na fileira, na gramática do card de DualSense (não o `ExternalCard` da aba Configurações) | a aba contava só DualSense e escondia quem mais estava na mesa; e o mapa diz `plataforma.vpad@sn30 = existe: desconhecido`, então a frase não pode prometer jogador. | **CONFERIR** |
| card do controle, aviso quando `is_primary and gamepad_on and grab_state == "failed"` — condição movida para a função pura `aviso_de_grab` | Grab falhou — input pode dobrar no jogo | O jogo pode receber cada botão duas vezes | "grab" é o nome da peça do kernel que falhou, e o card é a primeira tela de quem quer jogar. A consequência agora está medida (ESCONDE-SÓ-O-HIDRAW-01). | sim |
| linha "Ponte com o jogo:", ramo da exceção de Steam Input — `home_actions.py:1112-1116`, ramo APAGADO (Saída A) | pelo Steam Input — neste jogo a Steam entrega os botões | pelo Hefesto | a frase é do mundo de 06/08, quando a exceção suspendia o vpad. Desde 09/08 (ESCONDER-EM-VEZ-DE-SAIR-01) a exceção esconde o físico e MANTÉM o vpad de pé — publicá-la seria pôr um fato derrubado na primeira tela. | sim |
| card do controle — `palavra_do_transporte`, o subtítulo que diz por onde o controle está ligado | ? | não sei por onde | o "?" não diz nada a quem lê. No mesmo gesto, `usb` passou a sair como "cabo" e `bt` como "rádio" (a língua do mapa), e valor desconhecido volta CRU, para aparecer em vez de sumir. | sim |
| hover (tooltip) do mesmo aviso de grab — `warn.set_tooltip_text(porque)`, no desenho da fita apagada do cabeçalho | (não existia) | Outro programa pegou este controle antes e não solta, ... | sem o hover a linha diz o que aconteceu e não diz o que fazer. A frase NÃO acusa a Steam, porque quem segura o dispositivo não está provado (GRAB-DOBRADO-01). O relatório trunca a citação com "..." na própria saída do pytest. | **CONFERIR** |

### Status — 2

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| barra da bateria do estado global — a decisão saiu do `_render_slow_state` e passou a morar na função pura `_bateria_da_mesa`, que olha o topo E a lista | 75 % | — % | a barra escrevia a bateria do topo do payload com ZERO controles na lista do daemon. Ausência de lista, porém, continua não sendo evidência de mesa vazia — nesse caso o número segue saindo. | **CONFERIR** |
| faixa da bateria do card único — o `_motion_label` (GYRO-03) passa a ser empacotado nos DOIS modos, ao lado da bateria | (não existia na tela) — o rótulo era alimentado a cada tique e nunca chegava à tela fora do card compacto, que produção nenhuma constrói desde a EMPILHA-02 | (não citada no relatório) — a linha do giroscópio com o hertz; o teste procura 'Hz' entre os textos visíveis | de 17/08 a 25/08 o hertz do giroscópio não apareceu em configuração nenhuma da janela: a SEM-BARRA-DA-VERDADE-01 desempacotou a linha da verdade, que era a única portadora do número. Marcado `PROVISÓRIO — decisão dela` no código: a escolha entre a saída (a) e a (b) é dela. | **CONFERIR** |

### No jogo — 1

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| a linha do TOPO da aba (o cabeçalho). Lê `mascara_divergente` do `state_full` — campo que existia desde 19/08 e que a GUI nunca leu | O jogo vê o controle como: DualSense | Jogar (gamepad virtual) · O jogo vê o controle como: DualSense (botões PlayStation) — o perfil deste jogo pedia Xbox 360 | a linha afirmava a máscara viva como se ninguém tivesse pedido outra: não era falsa, era a metade que engana. A LISTA `mascara_divergencias` (jogo fechado) ficou de fora de propósito. | sim |

### Gatilhos — 4

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| a barra/toast que responde ao "Aplicar" e a cada troca de modo — `_toast_trigger` em `app/actions/triggers_actions.py`, caso "mesa vazia" (o toast também dispara sozinho 300 ms depois de cada clique de modo, via `_schedule_live_preview` em `:322`) | Gatilho esquerdo (L2): Rigid aplicado | Gatilho esquerdo (L2): Rigid — nenhum controle recebeu — não há controle na mesa | a barra afirmava "aplicado" sem destino nenhum: o daemon respondeu `aplicado_em: []`, `guardado_em: []` — zero destino, nenhum byte no fio. | sim |
| a MESMA barra/toast, ramo do Modo Nativo ligado com controle NA mesa — `frase_do_desfecho` em `app/textos_de_aplicacao.py` | Gatilho esquerdo (L2): Rigid — guardado; em Modo Nativo quem manda no controle é o jogo. Vale quando o Modo Nativo sair. | (não transcrita no relatório; CONFERIDA POR MIM em `textos_de_aplicacao.py:295` + `:173`) "Gatilho esquerdo (L2): Rigid — nenhum controle recebeu — em Modo Nativo quem manda no controle é o jogo" | durante algumas horas do dia este ramo passou a dizer "não há controle na mesa" — FALSO, e num caso que o código acertava antes. Quem coordena consertou no mesmo dia: a frase de mesa vazia deixou de cobrir os cinco motivos de `([], [])`. A frase transitória nunca chegou a ela. | **CONFERIR** |
| a MESMA barra/toast, ramo dos três casos que a janela NÃO tem como enxergar — constante `NADA_ACONTECEU` (`textos_de_aplicacao.py:293`) | <assunto> — nenhum controle recebeu — não há controle na mesa | nenhum controle recebeu | uma frase só embutia a causa de cinco situações diferentes; virou três (a genérica, a de mesa vazia e a de Modo Nativo). Nos três caminhos que a janela não enxerga a frase agora CALA em vez de diagnosticar — "olhei e não sei por quê" é uma resposta. | sim |
| dica (tooltip) de cada botão de modo — `sel.set_tooltips({spec.name: spec.description for spec in PRESETS})` em `app/actions/triggers_actions.py`: 19 modos, 38 dicas na tela (os dois lados) | (não existia) | Barreira rígida numa posição fixa | as 19 descrições do `PRESETS` já estavam escritas e nenhuma chegava à tela; e o campo `TriggerParamSpec.help_text`, com 73 parâmetros, 73 vazios e zero leitores, saiu. ATENÇÃO: a frase citada é a ÚNICA das 19 transcrita no relatório (a do `Rigid`, num `grep`), e o agente avisa que NÃO fotografou a aba — "não vi as 38 dicas na tela". | **CONFERIR** |

### Lightbar — 4

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| rótulo `player_leds_estado` — `_PREFIXO_DESENHO`, usado nas quatro bifurcações de `texto_do_desenho_aceso` | Aceso agora: | Desenho que mandamos: | a função é pura do rascunho e nada nela consulta o aparelho — e o mapa mede que consultar é IMPOSSÍVEL: `luz.led_jogador.leitura@dualsense` tem `cabo_aceita = não` e `radio_aceita = não`. | sim |
| rótulo NOVO `lightbar_estado_no_controle` — nasce oculto e só aparece quando há aviso; a frase vem importada de `widgets/controller_card.rotulo_lightbar`, nunca recopiada | (não existia) | A Steam tem este controle aberto | só o card (Status, Início e "No jogo") lia `lightbar_source`. Quem estava na aba da COR era justamente quem não era avisado de que a Steam segura o hidraw deste controle. A frase citada é uma das quatro; a ordem de precedência é Modo Nativo → disputa → fonte desconhecida → apagada, e as outras três não estão citadas. | **CONFERIR** |
| toast do "Aplicar o desenho" — `_msg_do_desenho`, com `_AVISO_MESMO_DESENHO_NOS_QUATRO` e `_quantos_recebem_o_desenho` | Desenho das luzes atualizado — LEDs acesos: 2 e 4 | (não citada por inteiro no relatório) — o toast passa a contar em quantos controles o clique pegou, dizendo "os 2 controles da mesa" | nada avisava que um clique em "Desenho do P2" com o alvo em "Todos" ia para os quatro controles. | **CONFERIR** |
| `gui/main.glade` · `player_leds_estado`, o texto de espera do rótulo | Aceso agora: consultando… | Desenho que mandamos: lendo o perfil… | o "consultando…" prometia uma consulta ao aparelho que não existe. É a mesma correção do rótulo em código, no segundo lugar onde ela aparecia. | sim |

### Rumble — 5

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| `gui/main.glade`, NOS DOIS LUGARES: widgets `rumble_policy_auto` e `rumble_policy_auto_label` | conforme a bateria do controle | do controle principal — e a força escolhida vale para todos os controles da mesa | "a bateria do controle" não dizia de QUAL controle, e escondia que a força escolhida vale para a mesa toda. O relatório escreve a troca como fragmento→fragmento; a frase inteira de tela não aparece. | sim |
| rótulo novo nascido em CÓDIGO (`_pintar_a_linha_do_alcance_do_gesto`, chamado de `_apply_policy_to_widgets`), na cor `#8be9fd` (token de INFO). Aparece só com um controle escolhido; com "Todos", não aparece | (não existia) | (não citado no relatório) — a aba passa a dizer que o comando vivo vai para a mesa e que só o PERFIL fica da peça | a aba não dizia que o comando vivo vale para a mesa inteira e que só o perfil fica da peça escolhida. | **CONFERIR** |
| o toast de `_gravar_intensidade_no_rascunho` (que passou a devolver `bool`), ao escolher "Auto" com uma peça escolhida | Intensidade da vibração: Auto |  — e este controle voltou ao ajuste geral… | o "Auto" com peça escolhida apagava o override daquele controle em SILÊNCIO, sem nomear o apagamento. O relatório cita só o PEDAÇO que a mordida exige dentro da frase nova, com reticências. | **CONFERIR** |
| `texto_dos_pedidos_de_vibracao`, ramo `_pedidos_por_jogador` — vale só quando há 2+ vpads | o jogo falou de vibração 12x, mas pediu força zero em todas | Jogador 1: 12x, todas com força zero | com dois ou mais vpads o contador somava os pedidos de todos num número só, como se houvesse um jogador. Com um jogador só, o relatório afirma que a frase é BYTE-IDÊNTICA à antiga; o trecho citado é o que a mordida exige dentro da frase nova, não a frase inteira. | **CONFERIR** |
| as QUATRO dicas de política em `gui/main.glade` (a mordida nomeia dois dos botões: `rumble_policy_economia` e `rumble_policy_balanceado`) | (o relatório NÃO cita as dicas antigas) | (o relatório NÃO cita as dicas novas) — "nomeiam o TETO DE MESA, em oração derivada do léxico da Configurações" | as dicas de política não nomeavam o teto de mesa — a pessoa não tinha como saber que o limite é da mesa, não da peça. | **CONFERIR** |

### Perfis — 3

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| o diálogo de confirmar remoção (`confirm_delete_profile`, em `app/gui_dialogs.py`, via parâmetro novo `aviso: str \| None = None`). São TRÊS frases, na ordem o quê / por quê / o que fazer, e ANTES da linha "permanente e não pode ser desfeita" | (não existia — apagar o perfil que está valendo era um clique sem uma palavra) | (o relatório NÃO cita as três frases; cita só a linha VELHA que passou a vir depois delas: "permanente e não pode ser desfeita") | apagar o perfil ATIVO não avisava que era o ativo — e a linha que se aprende a pular estava na frente da que muda a decisão. Compara por slug; se o dono do §P1 responde `nao_sei`, o aviso cala. | **CONFERIR** |
| seção "Modo" do editor de perfil, montada em código (sem tocar o `main.glade`), ao escolher "Conexão Nativa (Sony)" | (não existia nesta aba — `native_bt_fragil` tinha leitor num arquivo só, `home_actions.py`) | (o relatório NÃO cita a frase; é a MESMA que a aba Início já mostra — "o que espera o olho dela é o lugar, não o texto") | esta aba oferece "Conexão Nativa (Sony)" — inclusive num perfil de co-op — sem dizer que o rádio está frágil, aviso que só existia na Início. `texto_do_radio_fragil` foi extraída de `vpad_degradation_text` e virou dona única; há teste exigindo IGUALDADE de string entre as duas abas. | **CONFERIR** |
| linha do carimbo de ponte confirmada, em ITÁLICO, abaixo do nome do jogo — entregue no rótulo que JÁ existe ao lado do campo do jogo, sem tocar o `main.glade` (`frase_da_ponte_confirmada`) | (não existia — a aba preservava o carimbo no Salvar e nunca o mostrou) | (o relatório NÃO cita a frase; só diz que ela fala o léxico da aba Início: `_MODE_KIND_ITEMS` / `_MODE_FLAVOR_ITEMS`) | o daemon publica `pontes_confirmadas` desde 19/08 com zero leitores — o comentário ao lado dizia "para a janela dizer 'este jogo já sabe por onde entra'", e a janela não dizia. Sem carimbo, a linha não diz nada: silêncio, nunca "ponte desconhecida". Nascer visível ou colapsada é decisão dela. | **CONFERIR** |

### Sistema — 6

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| `format_proton_lock_result` — o ramo de RECUSA, que não existia; a ponte `lock_proton_for_all_games` passou a repassar `status`/`reason` | (não existia — a recusa saía com a frase de SUCESSO) | (o relatório NÃO cita a frase nova; diz que o vocabulário é o que a aba já falava em `_frase_steam_input`: "havia um jogo aberto") | a ponte jogava `status`/`reason` fora e a recusa virava comemoração: a tela dizia que travou o Proton sem ter travado. | **CONFERIR** |
| OITO frases do módulo que mandavam rodar o instalador; todas passaram a chamar `como_atualizar_esta_instalacao()`. Uma delas é a de `format_steam_ready_result` (nomeada na mordida) | ./install.sh | (o relatório NÃO cita o texto novo — diz que o ramo de fora do checkout usa "o *mínimo aceitável* redigido na própria sprint") | as oito frases mandavam rodar `./install.sh` como única instrução, e ele só existe para quem clonou o repositório — quem instalou por Flatpak/AppImage não tem esse arquivo. O relatório marca esta como "PROVISÓRIO, aguarda o olho dela", e não lista as oito nem cita nenhuma inteira. | **CONFERIR** |
| a frase pintada em `src/hefesto_dualsense4unix/integrations/storm_doctor.py:261` — o último lugar de `src/` onde ela ainda ia para a tela (o docstring de `emulation_actions.py` que a repetia também saiu, mas docstring não é tela) | ex.: jogos cujo DualSense é entregue pela Steam) | (o relatório NÃO cita o texto novo — só diz: "A redação nova é a da caixinha de Perfis, palavra por palavra.") | a frase afirmava que a Steam entrega o DualSense ao jogo — afirmação que ela derrubou em 09/08 e que seguia sendo pintada na tela. | **CONFERIR** |
| cartão "Saúde do sistema" — uma linha nova, SÓ quando há divergência, no molde do `medir_guarda_do_steam_input` | (não existia — o cartão calava) | (o relatório NÃO cita o texto da linha nova) | o prontuário dos jogos já media a divergência e nada na tela dizia — a casa sabia e o produto não fazia. É o primeiro chamador de produção de `prontuario_dos_jogos.py` (1.037 linhas, zero chamadores até aqui). | **CONFERIR** |
| o painel de detalhe técnico (`_detalhe_tecnico()`): a saída crua entra como RODAPÉ do painel, antes do toast, e sobrevive ao `_refresh_daemon_view_async()` que vem logo depois | (não existia no painel — o motivo da falha só passava pelo toast, que some) | (o relatório NÃO cita o texto; é a saída crua do comando, mais uma frase de reserva não citada, provada por `test_falha_sem_saida_crua_ainda_diz_alguma_coisa`) | o motivo da falha só aparecia no toast e sumia — o painel não guardava o que tinha dado errado. | **CONFERIR** |
| o botão do daemon, em `_apply_daemon_view`: passa a nascer cinza quando não há trabalho a fazer, com tooltip dizendo por quê. São DOIS tooltips novos (a mordida cita "os quatro estados da matriz + os dois tooltips") | (não existia — o botão ficava clicável e mudo) | (o relatório NÃO cita o texto dos dois tooltips) | o botão continuava clicável sem trabalho a fazer, e nada na tela dizia por quê. | **CONFERIR** |

### Emulação — 6

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| o cartão do microfone — o ramo do alvo em `app/actions/emulation_actions.py:1169-1170`; nasce um quarto estado, "sem alvo" | Ligado (escrito em verde `#50fa7b` mesmo sem placa de áudio do controle no sistema) | (NÃO ACHEI o texto novo literal — o relatório diz que "a frase da tela fala de «placa de áudio neste computador», nomeia o rádio como o caso normal", e que um caso do portão guarda a formulação, proibindo conclusões sobre o aparelho) | a aba concluía "Ligado" olhando só três arquivos do WirePlumber, sem nunca olhar se existe microfone a ligar — e o caso mais comum disso é o controle no rádio, onde não há placa ALSA nenhuma. | **CONFERIR** |
| moldura do gamepad virtual — o rótulo/botão `emulation_gamepad_xbox_button` (`gui/main.glade:3402`), a "frase do Xbox" | (NÃO ACHEI o texto literal — o relatório só a chama de "a frase do Xbox" e diz que a mordida a faz "voltar ao texto de 24/08", que afirmava a vibração sem ressalva) | A vibração ainda não foi conferida no aparelho — nem no cabo, nem no rádio: o caminho está montado, e se ela não vier não é erro seu. | a frase afirmava a vibração como coisa provada, e o mapa diz `de_onde_sei = inferido-do-codigo` nos DOIS transportes para `vibracao.rumble.passthrough@dualsense` — nem o cabo é medido. | **CONFERIR** |
| a dica da máscara — `emulation_gamepad_hint_label` (`gui/main.glade:3411`) | (NÃO ACHEI o texto literal — o relatório só diz que a mordida faz "a dica da máscara voltar ao texto de 24/08", que afirmava a vibração sem ressalva) | A vibração ainda não foi conferida no aparelho — nem no cabo, nem no rádio: o caminho está montado, e se ela não vier não é erro seu. | mesma afirmação sem lastro: a dica prometia vibração que o mapa não mede em nenhum dos dois transportes. É o segundo dos quatro lugares da E8, e recebe a MESMA frase do primeiro. | **CONFERIR** |
| a frase da exceção por jogo, dentro da mesma dica `emulation_gamepad_hint_label` (`gui/main.glade:3411`) — DUAS metades da mesma frase, que os leitores relataram em separado e eu fundi | o jogo precisa enxergar os controles físicos ... use a exceção por jogo em "Steam Input" na aba Emulação. | (NÃO ACHEI o texto novo literal — o relatório diz que "a frase nova nomeia o gesto e onde ele mora, e não afirma mecanismo": a caixinha fica na aba PERFIS e o rótulo de hoje é "Esconder os controles físicos neste jogo" (`gui/main.glade:2469`)) | mandava para um controle que não existe — nesta aba só há "Verificar" e "Desligar Steam Input", que LEEM a allowlist; quem escreve é a caixinha da aba Perfis. E a marca inverteu de lado em 09/08 (ESCONDER-EM-VEZ-DE-SAIR-01): hoje o gesto ESCONDE os controles físicos, e a metade antiga ensinava o contrário. | **CONFERIR** |
| a quarta frase de vibração — `emulation_hint` | e vibra | (removida — o relatório diz "saiu só o «e vibra»", sem citar a frase inteira antes ou depois) | era afirmação de vibração sem ressalva; tirado o trecho, a frase deixa de afirmar e não precisa carregar a ressalva — o parágrafo e o tooltip levam o detalhe. | **CONFERIR** |
| as dicas do microfone, nos QUATRO estados; o texto sai do Python, sem tocar o `main.glade` (o relatório cita literalmente só a do estado "ligado", pela mordida B em `emulation_actions.py:1279`) | O microfone do controle está livre e com prioridade acima do eco da saída. | Isto vale para o computador inteiro, não para este jogo: não entra no perfil e não mexe na ponte de microfone por Bluetooth (aba Configurações). | a dica não dizia de QUAL microfone se tratava — a pessoa podia ler o botão como se ele valesse para o jogo ou mexesse na ponte de microfone por Bluetooth. ATENÇÃO: o "entrou" é a frase ACRESCENTADA, não a frase final inteira; o relatório não mostra o texto combinado. | **CONFERIR** |

### Navegação — 4

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| a legenda da lista de atalhos (o bloco que começa por "<b>Como funciona…"), escrita pela função pura `frase_dos_atalhos_fora_da_lista` — `app/actions/input_actions.py:411` | (não existia) | Guardados, sem linha na lista: Touchpad — lado esquerdo, Touchpad — meio, Touchpad — lado direito. O touchpad voltou a ser o mouse do computador, então esta versão não dispara esses atalhos. O perfil continua guardando o que você escolheu — nada nesta aba os apaga. | o perfil guardava três atalhos de touchpad que a lista nunca mostrava, e a tela não dizia que eles existiam — a pessoa não tinha como saber que estavam lá nem por que não disparam. | sim |
| a palavra ao lado do interruptor do mouse, no caso "Hefesto sem resposta" — `app/actions/mouse_actions.py:200-205` (era `texto = MODE_GATE_HINT if blocked and mode is not None else ""`) | (não existia — o interruptor ficava APAGADO e sem nenhuma palavra ao lado; a mordida mostra `assert '' == ...`) | Não consegui falar com o Hefesto agora, então não sei se ligar o mouse derrubaria um jogo em andamento — por isso o interruptor está apagado. Veja como está o Hefesto na aba Sistema. | o interruptor aparecia apagado em silêncio, e a frase do modo jogo afirmaria que há jogo em andamento, que é justo o que ali não se sabe. | sim |
| a mensagem depois de clicar o interruptor do mouse — `_on_ok`/`_on_err` em `app/actions/mouse_actions.py:290`; passam a ser três saídas (ok, recusado, sem resposta), com `RECUSA_SEM_MOTIVO`, `SEM_RESPOSTA_DO_HEFESTO` e a tabela `BLOQUEIO_DO_MOUSE_EM_PORTUGUES` | Falha ao comunicar com o daemon | (o relatório cita as duas novas só TRUNCADAS, na mordida N6) "O Hefesto recusou: o modo jogo está suspendendo mouse e teclado…" e "Não obtive resposta do Hefesto…" | toda resposta `status != "ok"` caía no texto do timeout: a janela acusava um defeito de comunicação que não houve, quando o daemon apenas tinha recusado. | **CONFERIR** |
| a legenda do teclado na tela, repintada por `_anotar_teclado_na_tela` a partir de `keyboard_emulation.osk_disponivel` do `state_full` — `app/actions/mouse_actions.py:266`; são duas frases ("tem" e "não tem") | (NÃO ACHEI o texto literal — o relatório diz que "a legenda recitava `onboard` e `wvkbd-mobintl` como texto fixo sem nunca dizer se algum estava instalado") | (NÃO ACHEI o texto literal — a mordida N12 só mostra `assert 'Neste computador' in ''`; na frase de "não tem", `wvkbd-mobintl` vem ANTES de `onboard`, porque o onboard digita por XTEST e não alcança cliente Wayland nativo) | a legenda recomendava dois programas como texto fixo sem nunca dizer se algum deles existia na máquina — e, na ordem antiga, o primeiro recomendado abre o teclado e não digita. | **CONFERIR** |

### Configurações — 10

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| seção Orçamento (`secao_orcamento.py`), o `SegmentedSelector` de degraus — `TETO_POR_PERFIL` traduz perfil → chave e `PERFIL_POR_TETO` migra 1-para-1 o que já está gravado | (não citados no relatório) — os CINCO degraus de teto | Tudo ligado" / "Bateria longa" / "Eu escolho | D-PERFIL-DE-DESEMPENHO: os cinco degraus viraram três perfis. O esquema do disco não muda. | **CONFERIR** |
| seção "Conexões", coluna de onde está o aparelho — `secao_mesa._onde_esta_o_adaptador` e `_onde_esta_o_radio`, com parâmetro `mapa` opcional | Barramento 3, porta 1.2 · Direita | Entrada 9 | o caminho do kernel não é o número que ELA escreveu na mesa. Com mapa declarado, o número dela sobe para a coluna e o caminho do sistema desce para a dica; sem mapa, o texto de hoje sai sem uma vírgula de diferença. | sim |
| janela NOVA `JanelaDoMapaDaMesa` (`app/widgets/mapa_da_mesa.py`), aberta pelo botão da seção "Conexões" | (não existia) | Tirar daqui", "Tem uma extensão aqui", "Acrescentar entrada", "Acrescentar face | é a janela do desenho da mesa — gesto de dois tempos (clique no aparelho, clique na entrada); grava em `host._maquina_pendente` e nunca chama `machine.declare`. Os quatro botões estão citados literalmente; o resto dos rótulos da janela, não. | sim |
| seção "Conexões", `pack_start` logo abaixo da tabela de adaptadores — função de módulo `_linha_do_mapa(mapa, censo, ao_clicar)`; constantes novas `_ENTRADA_DELA`, `_PROCEDENCIA_DA_ENTRADA`, `_RESUMO_DO_MAPA`, `_SEM_MAPA`, `_BOTAO_DESENHAR` | (não existia) | (não citadas no relatório) — uma linha só, com o resumo do mapa (três números) e o botão de desenhar; custa 40 px de altura de seção contra o teto de 48 | a aba não tinha por onde mostrar nem abrir o desenho da mesa dela. | **CONFERIR** |
| seção Orçamento — a dica do botão "Auto" | (não citada por inteiro no relatório) — a dica que dizia que o teto "acompanha a bateria" | (removida) | era fato errado: descrevia a escada de `_effective_mult` no ramo da política da aba RUMBLE, que aquele clique nunca ligou. Saiu inteira, sem nota e sem data — regra do fato errado que se SUBSTITUI. | **CONFERIR** |
| seção Orçamento — bloco NOVO no fim da seção (`_ContaDeSlots`), alimentado por `integrations/plano_de_radio.py` | (não existia) | (não citado no relatório) — uma linha por adaptador com o nome DELA (nunca `hciN`), quem está nele por número de jogador, a conta, a palavra da ocupação, o "cabe mais um", a ordem de serviço quando há, o preço do microfone e o selo de três partes; com um adaptador só sai a `FRASE_DO_ADAPTADOR_UNICO`; sem apelido, "Adaptador sem nome"; o balde "Adaptador que não sei qual é" nunca é destino de ordem | a `Ocupacao` sozinha não respondia quem está em qual adaptador; e sem resposta do daemon a tela agora diz que NÃO SABE — "0/1600 · Folgada" e "Nenhum controle no rádio agora" nunca aparecem sobre um rádio que ninguém leu. | **CONFERIR** |
| seção 1 "Os controles" (`app/actions/config/secao_controles.py`, confirmado em `config/__init__.py:21`) — a linha da razão do veredito de nascimento, DEBAIXO do botão que ela explica, no `_BlocoDaLuz`; texto produzido por `frase_do_nascimento` (`:241`, chamada em `:1201`) | (não existia) | (o relatório não transcreve a frase) | o cartório do nascimento existia e carimbava desde 22/08, mas nada na tela dizia o veredito. A razão só aparece quando o veredito CONDENA — sem carimbo, `limpa` e `nao_sei` calam. A aba estava só inferida do caminho no relatório; conferi no código e é esta. | **CONFERIR** |
| seção Orçamento — a tabela de consequências: `LINHAS_DO_TETO` é dona única das cinco linhas, `COLUNAS` deriva dos perfis (uma coluna por opção oferecida), e `alcance_de_hoje()` deriva a frase de apoio | (não citada no relatório) — a frase de alcance escrita como literal (`ALCANCE_DE_HOJE`) | Ainda não tem por onde ser limitado | a frase parou de derivar da tabela e podia divergir dela. A célula que atravessa as três colunas de perfil substituiu a mesma frase repetida três vezes na linha (939 px de largura mínima → 356 px). | **CONFERIR** |
| seção Orçamento — a dica do perfil "Bateria longa", agora DERIVADA de `LINHAS_DO_TETO` | (não citada no relatório) | (não citada no relatório) — texto derivado da tabela, que não pode prometer mais do que ela mostra | a palavra dela na decisão dizia "vibração com teto de 30% e barra de luz apagada", e a barra de luz não tem ponto de aplicação nenhum — escrevê-la cometeria, no mesmo botão, o defeito que a sprint existe para curar. | **CONFERIR** |
| seção Orçamento — `frase_da_capacidade_do_mic` e o preço do microfone, agora na tela em TODOS os estados (ordem de quem coordena) | (não citada no relatório) — a frase anterior, que não dizia os 4 pontos | (não citada no relatório) — frase derivada do medidor: 1042 → 1107 e os 4 pontos; e 260,4 sem microfone, 276,7 com, das 1600 fatias | nenhum número é digitado — toda frase deriva das constantes do `radio_da_mesa`; os 4 pontos são o achado que muda a decisão e que a frase anterior não dizia. | **CONFERIR** |

### Rodapé (fora de aba — ela vê em todas) — 2

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| `footer_actions._transicao_de_modo` → `desfecho_da_troca` / `toast_da_troca_de_mascara`, entrando pelo `_recado_da_maquina`, que precede o toast final do "Aplicar" | Perfil aplicado. | (não citada por inteiro no relatório) — a frase do desfecho da RECUSA, que contém "Ainda não" | o daemon recusava a troca de máscara e o rodapé dizia que tinha aplicado. As duas funções do desfecho ganharam o primeiro chamador de produção da vida delas. A mordida: `assert 'Ainda não' in 'Perfil aplicado.'`. | **CONFERIR** |
| `app/ipc_bridge.py` · `_CAMPOS_DA_MAQUINA`, o rótulo do campo `mapa` na lista do que se PERDE (portão `test_descartados_chegam_ao_rodape.py`) | (não existia) | O desenho da mesa | o campo `mapa` entrou no schema e o portão exige um rótulo de tela para cada campo de topo; é o único rótulo que não é `TITULO` de seção, porque o mapa não tem seção própria. | sim |

### Terminal — `scripts/doctor.sh` (não é janela) — 4

| onde | saiu | entrou | por quê | lit. |
|---|---|---|---|---|
| `scripts/doctor.sh:3078`, exame `check_bt_resilience` | [ OK ] modo ativo p/ Nintendo (nome 'Nintendo Mesa' + SNIFF no adaptador p/ o 8BitDo probar + no-sniff só no Pro genuíno — BT-SNIFF-PER-OUI-01) | [WARN] modo ativo p/ Nintendo: alias e SNIFF do adaptador OK, mas o Pro genuíno conectado está COM sniff (deveria ser sem). Reaplique: sudo … | o `grep` de UMA faixa não achava um Pro de outra safra, `_pro_lp` ficava "ausente" e o exame aprovava a cura sem ter olhado controle nenhum — falso verde, reproduzido antes de consertado. | sim |
| `scripts/doctor.sh:3777`, veredito do `check_hidraw_broker` | (o relatório não transcreve o texto antigo — diz só que o `pass` afirmava "o jogo só vê o vpad" olhando apenas o `hidden_count` do broker, sem a expressão "TRÊS superfícies") | broker escondendo ${hidden_count} nó(s) físico(s), e as TRÊS superfícies dos ${TRES_SUP_CONTROLES} controle(s) fechadas … — o jogo só vê o vpad | o `hide` age numa superfície (hidraw) e o mesmo controle mora em três; quem investigasse "por que o Steam mostra controle dobrado" começava lendo um `pass`. O próprio relatório acha que o número novo AINDA mente: `TRES_SUP_CONTROLES` conta também os nós sem mapa que ficaram fora do veredito (ACHADO 1, ALTA). | **CONFERIR** |
| `scripts/doctor.sh`, ressalva que acompanha o veredito do `check_hidraw_broker` | (não existia) | [INFO] as superfícies evdev/joydev desses nós não estão legíveis no sysfs agora — este check NÃO afirma que o jogo só vê o vpad | o exame passou a declarar o que NÃO mediu, em vez de afirmar em verde o que não tinha como saber. | sim |
| `scripts/doctor.sh`, linha que precede o veredito do `check_hidraw_broker` | (não existia) | [INFO] 2 nó(s) escondido(s) sem mapa no sysfs — ficaram fora do veredito abaixo | os nós que ninguém conseguiu mapear no sysfs passaram a ser nomeados e declarados fora da conta, em vez de virarem crédito silencioso. | sim |

---

## O que quem enumerou registrou como ressalva

- **O total que achei é 60, não 43 — e eu não forcei a conta.** Parti das 61 entradas que os quatro leitores trouxeram e fiz UMA fusão real (as duas metades da mesma frase da aba Emulação, E9). Os outros 17 de diferença têm quatro causas, todas conferidas abaixo.

- **Causa 1 — o 43 nunca foi enumerado em lugar nenhum.** O número aparece só em `docs/process/2026-08-25-ONDE-PARAMOS-a-madrugada-de-vinte-e-duas-frentes.md`, linhas 49 e 142, e a linha 50 manda buscar "a lista completa, aba por aba" no "relatório do conferente da leva". **Esse relatório NÃO EXISTE**: os 27 arquivos de `docs/process/agentes/2026-08-25/` estão listados, nenhum é do conferente, e a string "quarenta e três" não aparece em nenhum deles. Não há lista contra a qual reconciliar item a item — esta aqui é a primeira enumeração.

- **Causa 2 — eu conto FRASE DE TELA; a contagem publicada parece contar ITEM DE RELATÓRIO.** Vários itens carregam mais de uma frase: I6 são duas (o quarto veredito e o ramo do Steam Input apagado), I9 são duas mais o hover, L5 são duas (o rótulo em código e o texto de espera do `main.glade`), E8 são quatro frases de vibração em quatro lugares, o toast dos Gatilhos virou três frases, e o `check_hidraw_broker` do `doctor.sh` são três linhas. Contando por item, os meus 60 caem para a casa dos 50 — ainda não 43.

- **Causa 3 — seis dos meus 60 não são de aba nenhuma.** Duas são do rodapé (que ela vê em todas as abas) e quatro são SAÍDA DE TERMINAL do `scripts/doctor.sh`, não janela. Tirando as seis, sobram 54.

- **Causa 4 — o documento diz "em dez das onze abas" e a minha lista toca as ONZE.** Logo a contagem publicada deixou pelo menos uma aba inteira de fora. Não tenho como saber qual, porque a lista dela não existe.

- **Cuidado com a direção do erro: 60 já é uma agregação, não o piso.** Cinco entradas são elas próprias pacotes de frases — as OITO frases do `./install.sh` (Sistema), as 38 dicas dos 19 modos (Gatilhos), as quatro dicas de política (Rumble), os quatro estados da dica do microfone (Emulação) e os quatro botões da janela do mapa (Configurações). Frase por frase, o número real passa de 100.

- **Conferi no código o que o leitor dos Gatilhos pediu que se conferisse.** A constante virou três, em `src/hefesto_dualsense4unix/app/textos_de_aplicacao.py:293-295`: `NADA_ACONTECEU = "nenhum controle recebeu"`, `NADA_ACONTECEU_MESA_VAZIA = "nenhum controle recebeu — não há controle na mesa"` e `NADA_ACONTECEU_NATIVO`, que monta `"nenhum controle recebeu — em Modo Nativo quem manda no controle é o jogo"` a partir de `_MOTIVO_NATIVO` (linha 173). A frase transitória do Modo Nativo, que o leitor relatou como "entrou", **nunca chegou a ela** — foi consertada no mesmo dia.

- **Conferi a aba que o leitor do SINAL-NO-NASCIMENTO-01-D1 marcou "CONFERIR no código": é Configurações.** `src/hefesto_dualsense4unix/app/actions/config/__init__.py:21` diz `secao_controles.py   seção 1 — "Os controles"`, e `frase_do_nascimento` mora em `secao_controles.py:241`, chamada em `:1201`.

- **Duas entradas da Emulação recebem o MESMO texto novo em widgets diferentes** — `emulation_gamepad_xbox_button` (`main.glade:3402`) e `emulation_gamepad_hint_label` (`main.glade:3411`). Não é duplicata de leitor: são dois lugares da tela, das quatro frases de vibração da E8. Mantive as duas; se ela quiser a ressalva uma vez só, a decisão é de desenho, não de texto.

- **As minhas oito divergem em dois lugares da lista publicada** (ONDE-PARAMOS, linhas 52-72). Seis coincidem. Saíram da minha lista: "Sistema — oito frases param de mandar rodar `./install.sh`" (nº 7 publicada) e "Configurações — 'Entrada 9' no lugar de 'Barramento 3, porta 1.2'" (nº 8 publicada). Motivo: o critério que me deram é *frase que a levaria a uma decisão errada, ou que afirmava sobre o aparelho dela algo que o produto não tinha como saber* — e nenhuma das duas afirma falso: o `./install.sh` existe na máquina DELA (ela clonou o repositório), e "Barramento 3, porta 1.2" era verdadeiro, só não era a língua dela. Entraram no lugar delas duas que afirmam falso: os Gatilhos dizendo "aplicado" com zero destino, e o rodapé dizendo "Perfil aplicado." sobre uma recusa. **As duas que saíram são a nona e a décima**, e continuam na lista por aba.

- **A varredura dos leitores cobriu 15 dos 27 relatórios; conferi os outros 12 e não encontrei texto de tela faltando.** `ORDEM-DE-SERVICO-B8` tem texto novo de tela (ORDEM-5 e a metade da ORDEM-6, cards e dois botões em `secao_exame.py`) mas está declarado como **tarefa ABERTA, não feita**. `INFRA-DE-EXECUCAO-A1` diz "nada aqui toca a tela do produto". `VPAD-SUSPENSO-MORTO-01-D2` diz que as duas frases do estado **já existem e já foram revisadas — só estão em tela inalcançável**, e fechar a E2 é decisão pendente. Os outros nove não discutem texto de tela.

- **Coincidência de número, e só isso: 43 das 60 não têm o texto literal no relatório.** É o mesmo 43 da contagem publicada, por acaso — não são o mesmo conjunto, e não tirei conclusão nenhuma disso. Registro para que ninguém tire.

- **Duas entradas trazem PROVISÓRIO escrito pelo próprio agente**, e a decisão é dela antes da foto: a linha do giroscópio no card de Status (marcada `PROVISÓRIO — decisão dela` no código, com escolha entre duas saídas) e as oito frases do `./install.sh` no Sistema ("PROVISÓRIO, aguarda o olho dela").

