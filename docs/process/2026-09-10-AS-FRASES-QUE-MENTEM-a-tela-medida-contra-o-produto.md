# AS FRASES QUE MENTEM — a tela medida contra o produto, 10/09/2026

> **Pedido dela, 10/09/2026:** *"executa agentes pra procurar por frases
> mentirosas da interface falando o que o app não faz. pra mapearmos e vermos
> se a frase é real ou tá desatualizada"*.
> <!-- noqa-acento: citação literal dela -->

**Este documento é o MAPA, não a cura.** Nenhuma frase foi reescrita por esta
varredura: cada linha diz onde ela aparece, o que o produto faz de verdade, e a
proposta — e a palavra final sobre texto de tela é dela.

## §0 — O número, e o adversário que o encolheu

| | |
| --- | --- |
| áreas varridas | **12** (as dez abas, a moldura e o motor de recados) |
| acusações levantadas | **148** |
| **de pé depois do adversário** | **102** |
| derrubadas | **46** — a frase estava certa, ou o estado em que ela aparece a torna certa |

**Cada acusação passou por DOIS agentes**: um varredor que a levantou e um
adversário instruído a derrubá-la, com a regra *"na dúvida, a acusação cai"*.
As 46 derrubadas são o que essa disciplina comprou — e a maioria delas
caiu pelo mesmo motivo: *a frase só aparece num estado em que ela É verdadeira*.

### Os quatro vereditos

| veredito | quantas | o que quer dizer |
| --- | --- | --- |
| **IMPRECISA** | 40 | verdadeira, e manda a pessoa fazer a coisa errada |
| **DESATUALIZADA** | 37 | era verdade e deixou de ser |
| **FORTE-DEMAIS** | 22 | afirma mais do que a medição sustenta |
| **CONTRADIZ-O-MAPA** | 3 | a célula do `mapa-controles.csv` diz outra coisa |

### E o custo, que é a ordem de trabalho

| custo | quantas |
| --- | --- |
| **alto** — a frase a faz desistir do que funciona, ou mandar fazer o que não resolve | **21** |
| médio | 42 |
| baixo | 39 |

## §1 — AS DE CUSTO ALTO, uma a uma

São as que custam trabalho dela. Cada uma traz a frase como está na tela, onde
ela aparece, o que foi medido e a proposta.

### 1. 03 Gatilhos — `a03_gatilhos.py:494` · **IMPRECISA**

> As dez posições em branco, para desenhar a curva do jeito que a sua mão pedir.

**Onde ela aparece:** Title do embrulho do <select> de Modo quando o gatilho está em «Montar do zero», e no title dessa opção nas quatro colunas

**O que foi medido:** A acusação se sustenta e a CASA já a escreveu antes: a docstring do gesto `ajuste` diz, com todas as letras, «'Montar do zero' (Custom), cujos oito padrões são ZERO, era um modo que não faz nada — um item de menu que responde 'aplicado' com o gatilho intacto», e conta os parâmetros de cada modo (Rigid 2, Machine 6, MultiPositionFeedback 10, MultiPositionVibration 11). Custom tem OITO ajustes — «Modo (byte cru)» 0..255 e Força 0 a 6 —, todos em zero; custom(0, (0,)*7) manda TriggerMode.OFF (0x00). Quem tem dez posições em branco é «Curva de força» (MultiPositionFeedback), e a linha 492 já promete exatamente isso. A frase manda a mão dela para o modo errado e o campo pisca verde por cima. Agravante que o acusador não nomeou: o texto do produto avisa «Avançado» e este não avisa.

**A prova:** app/actions/trigger_specs.py:247-267 (Custom: mode + force_0..force_6, todos default 0; description «Avançado: envia os valores crus… 1 modo e 7 forças») · core/trigger_effects.py:546-568 · trigger_effects.py:106 (OFF = 0x00) · a03_gatilhos.py:3013-3017 (a própria casa: «era um modo que não faz nada»)

**Proposta:** Avançado: sete forças e um número de modo, todos começando em zero. Escolher este modo sozinho não muda o gatilho — o efeito só nasce quando você mexe nas barras.

### 2. 05 Vibração — `aba05.py:1787` · **FORTE-DEMAIS**

> Desligue um lado e o jogo deixa de fazer aquele punho tremer — o outro continua. Serve para quem sente enjoo com o motor pesado, e para bancada.

**Onde ela aparece:** Dica do `?` do rótulo "Motor esquerdo", logo acima da frase dos 255. Ela ensina o gesto "desligar um lado", que na linha é o botão do glifo à esquerda da barra.

**O que foi medido:** Persegui o botão do interruptor até o fim. Ele sai com `data-hef="lado"` — e `_endereco_de_pintura` só emite `data-papel` para nomes de `PAPEIS_QUE_SAO_GESTO`, que são `("forca", "testar", "parar", "intensidade", "motor")`. `lado` não está lá, logo o ouvinte de clique do piloto não o acha: o clique é silêncio. E não é dívida só da aba — o produto não tem o campo: `pacote_da_coluna` não publica nada chamado `lado`, então a classe `on` nunca muda, e o dono escreve por extenso que não há campo em `schema.py`, nem método de IPC, nem chave no `state_full`. Confirmei no mapa de transporte: a única linha próxima é `vibracao.rumble.habilitar`, que é o bit de habilitar a vibração INTEIRA no firmware (common[0] 0x01/0x02, common[1] 0x40), não um punho. A frase manda ela usar um controle morto, e o remédio que existe (a barra em 0) está descrito na linha seguinte como se fosse coisa do Testar.

**A prova:** aba05.py:1620-1622 (`data-hef="lado"`); aba05.py:1024-1025 (`PAPEIS_QUE_SAO_GESTO`, sem `lado`); app/telas/vibracao.py:179-184 (`SEM_FONTE["lado:ligado"]`: "NÃO EXISTE EM LINHA NENHUMA … o produto liga e desliga a vibração INTEIRA de um controle, nunca um punho"); app/telas/vibracao.py:331-347 (o pacote da coluna não emite `lado`); docs/data/mapa-controles.csv:307 (`vibracao.rumble.habilitar`); daemon/subsystems/gamepad.py:1265-1286 (quem cala um punho de verdade é a barra).

**Proposta:** Para calar um punho, leve a barra dele a 0 — o outro continua tremendo, no jogo e no Testar. Serve para quem sente enjoo com o motor pesado, e para bancada.

### 3. 05 Vibração — `a05_vibracao.py:1926` · **FORTE-DEMAIS**

> o Hefesto não está rodando — ligue na aba Sistema

**Onde ela aparece:** Tarja de recusa no cartão, depois de ela ARRASTAR uma barra de motor e a gravação não voltar. É `RuntimeError` do gesto `motor`, que o piloto leva à tela.

**O que foi medido:** Refiz a cadeia. `rumble_motores_set` devolve `corpo is not None`, e o corpo vem de `_corpo_do_daemon` → `_safe_call`, que documenta devolver `(False, None)` para QUATRO fatos diferentes: daemon offline, socket ausente, timeout de conexão (250 ms) e erro JSON-RPC do servidor — este último é um Hefesto VIVO recusando, e um Hefesto mais velho que não conhece `rumble.motores.set` cai exatamente aqui. Mais: o estado em que ela consegue arrastar a barra é justamente aquele em que o daemon respondeu — num lugar sem controle o trilho é `display:none`. Ou seja, no instante do clique "o Hefesto não está rodando" é a MENOS provável das quatro. E a casa já sabe fazer certo: o `_mirar`, 700 linhas acima no mesmo arquivo, escreve "Veja se ele está rodando, na aba Sistema, e tente de novo", e o comentário do `parar` registra esta frase cravada como o defeito curado em 05/09. Ela manda ela ao Sistema ligar o que já está ligado.

**A prova:** app/ipc_bridge.py:750-751 (`return corpo is not None, corpo`); app/ipc_bridge.py:92-96 (`(False, None)` para daemon offline, socket ausente, timeout e erro JSON-RPC); a05_vibracao.py:1203 (`_uniq`) e aba05.py:1204-1208 (o trilho é `display:none` no lugar vazio); a05_vibracao.py:1268-1271 (o `_mirar`, com a frase honesta); a05_vibracao.py:2040-2049 (o comentário do Parar, que nomeia este defeito como já curado lá).

**Proposta:** não consegui gravar esta barra: o Hefesto não respondeu. Veja se ele está rodando, na aba Sistema, e tente de novo.

### 4. 06 Navegação — `aba06.py:1931` · **FORTE-DEMAIS**

> Com os 4 controles ligados, cada jogador anda no seu próprio card e o <b>X de cada um grava no controle dele</b> — sem disputar o card do vizinho.

**Onde ela aparece:** Dica `?` do campo "Navegação Interna", ao lado da lista de três opções.

**O que foi medido:** Procurei o dono por conta própria, em três lugares, antes de aceitar a acusação. (1) Na página publicada o campo sai como `<select data-gesto="navegacao-interna">`, e entre os doze `@gesto` registrados do pacote não há nenhum com esse nome — o piloto cai no ramo "sem dono", que só imprime no terminal e devolve o botão ao normal: para ela, clique morto. (2) `grep -rn disputa_de_botao src/` devolve UMA linha, a própria declaração de dívida. (3) Nenhuma leitura de d-pad ou botão no `hefesto_vivo.py` para andar por abas e listas. A frase acusada é a mais concreta das três do parágrafo: ela promete comportamento POR JOGADOR (cada um no seu card, o X gravando no controle dele), e não existe um único jogador com esse caminho. O número 4 repete o defeito da dica vizinha.

**A prova:** paginas/06-navegacao.html:3604 (`data-gesto="navegacao-interna"`) · `grep -n @gesto pacotes/a06_navegacao.py` → doze, nenhum `navegacao-interna` · interface/hefesto_vivo.py:2584-2589 (o ramo "sem dono": `print` e `_pousou`, nada na tela) · pacotes/a06_navegacao.py:3402-3405 · `grep -rn disputa_de_botao src/` → 1 linha

**Proposta:** Navegar <b>a janela do Hefesto</b> com o controle — abas, botões e listas. É outra coisa que o cursor do computador: esse é <b>um só</b>, e sai do controle que navega o PC.

### 5. 06 Navegação — `aba06.py:1941` · **FORTE-DEMAIS**

> O terceiro degrau grava a escolha para a <b>próxima vez</b> — a Steam abre direto em Modo Jogo, sem ninguém clicar. Esse degrau vale para a máquina, não só para este perfil.

**Onde ela aparece:** Dica `?` do campo "Modo Steam", ao lado da lista de três degraus.

**O que foi medido:** Refiz a busca pelo caminho do Big Picture em vez de acreditar no laudo: `grep -rn 'steam://|-gamepadui|bigpicture' --include=*.py --include=*.sh` no repositório inteiro só encontra `rungameid` (lançar UM jogo) e `steam://open/main` (abrir o cliente); a única menção a Big Picture é um comentário sobre `wm_class` em `profiles/steam_app.py`. O que o produto sabe fazer é `open_or_focus_steam`, que roda o binário `steam` puro ou foca a janela. Não há escrita de preferência para a próxima abertura em lugar nenhum, e o `modo-steam` da tela está entre os `data-gesto` sem dono. Duas promessas caem na mesma frase: a persistência e o alcance de máquina. RESSALVA À PROPOSTA DO ACUSADOR: ela conserva o primeiro parágrafo ("o controle passa a navegar a Steam como num Steam Deck"), que também não tem dono — trocar uma promessa forte por outra não fecha a linha.

**A prova:** integrations/steam_launcher.py:125-146 (`_spawn_steam` roda `[STEAM_BINARY]` sem argumento) e :154+ (`open_or_focus_steam`) · `grep -rn 'steam://|bigpicture|gamepadui|tenfoot' --include=*.py --include=*.sh .` → nenhum caminho de Modo Jogo · paginas/06-navegacao.html:3609 (`data-gesto="modo-steam"`), sem `@gesto` correspondente · pacotes/a06_navegacao.py:3406

**Proposta:** Serve para navegar a <b>Steam</b> sem mouse. Enquanto este degrau não tiver dono no Hefesto, a frase não deve prometer que a Steam abre sozinha em Modo Jogo na próxima vez.

### 6. 06 Navegação — `aba06.py:2063` · **FORTE-DEMAIS**

> É troca de botão por botão, e ela vale antes de o jogo ver.

**Onde ela aparece:** Dica `?` do cabeçalho da tela "Remapeamento dos botões", acima das 22 linhas de listas.

**O que foi medido:** Procurei o remapeamento no PRODUTO, não na declaração de dívida: `grep -rn remap` em `profiles/`, `daemon/` e `core/` devolve dois falsos positivos (uma escala de alto-falante e o `input-remapper` do sistema, citado num comentário) e nenhum campo de perfil, nenhum handler de IPC, nenhuma tradução antes do vpad. Do lado da tela, as 22 listas da pop-up saem por `drop(REMAP, SEM_TROCA)` sem `gesto=` e sem `campo=` — na página publicada elas são `<select class="campo-linha">` puros, sem endereço — e o `Guardar` é `data-gesto="guardar-remapeamento"`, sem `@gesto`. A frase afirma no PRESENTE ("vale antes de o jogo ver") uma troca que nunca é lida, nunca é gravada e nunca é aplicada. É a tela onde ela mais perde trabalho por acreditar.

**A prova:** aba06.py:2448-2449 (`drop(REMAP, SEM_TROCA)`, sem gesto e sem campo) · paginas/06-navegacao.html:4133 (o `Guardar` com `data-hef-forma="remapeamento"` e `data-gesto="guardar-remapeamento"`) · `grep -rn remap --include=*.py src/…/profiles src/…/daemon src/…/core` → nenhum remapeamento de botão · pacotes/a06_navegacao.py:3458-3460

**Proposta:** As mesmas <b>22 linhas</b>, na mesma ordem, dizendo outra coisa: <b>para qual outro botão</b> cada um passa a valer. O que cada botão <b>faz</b> se escolhe na tela <b>Definições Controle e Mouse</b>, ao lado.

### 7. 06 Navegação — `aba06.py:2275` · **FORTE-DEMAIS**

> Devolver a aba <b>Navegação</b> inteira ao de fábrica — as opções de ativação, os 5 gestos e as 22 linhas das duas telas de botões?

**Onde ela aparece:** Frase de confirmação do "Voltar ao padrão" da fileira ao pé da aba, com o "Confirmar" vermelho logo abaixo.

**O que foi medido:** Este é o caso em que procurei com mais cuidado uma saída para a frase, porque uma confirmação que promete demais mas EXECUTA alguma coisa seria só imprecisa. Não executa nada: o `Confirmar` leva `data-gesto="padrao-da-aba"`, e esse nome não está entre os doze `@gesto` do pacote — o clique cai no ramo "sem dono" do piloto, que devolve o botão ao normal sem tocar em perfil, disco ou daemon. A pop-up fecha (é `<label for>` do mesmo checkbox), o que dá a ela a aparência exata de um ato concluído. Ela lê uma pergunta que promete apagar cinco coisas, responde Confirmar, vê a caixa fechar — e nada mudou em lugar nenhum.

**A prova:** aba06.py:2282 (`<label … data-gesto="padrao-da-aba">Confirmar</label>`) · paginas/06-navegacao.html:3671 · `grep -n @gesto pacotes/a06_navegacao.py` → nenhum `padrao-da-aba` · hefesto_vivo.py:2584-2589 · pacotes/a06_navegacao.py:3438-3444 (a razão declarada: só as duas velocidades têm rota)

**Proposta:** Devolver ao de fábrica a velocidade do cursor e a da rolagem? As telas de botões e os gestos não são tocados.

### 8. 06 Navegação — `aba06.py:2576` · **FORTE-DEMAIS**

> Um <b>Estilo de Jogo</b>, como o FPS e o Corrida. O perfil escolhe usá-lo; o que ele faz é escrito <b>aqui</b>. Enquanto ele estiver valendo, estas linhas mandam — as da aba voltam quando o estilo sai.

**Onde ela aparece:** Dica `?` do cabeçalho da pop-up "Estilo Point-and-click", acima da tabela de sete linhas.

**O que foi medido:** O motor de Estilo de Jogo EXISTE — `profiles/estilos_de_jogo.py` traz as quinze receitas e o `point_and_click` é uma delas (`Estilo("point_and_click", "Point-and-click", "Off", "economia", …)`) —, e por isso a primeira oração da frase é verdadeira. É o resto que cai, e cai por medição do formato da receita: `Estilo` tem `chave`, `rotulo`, `gatilho`, `vibracao`, `familia`, `brilho` e `porque`. Botão nenhum viaja nela; velocidade de cursor, nenhuma. Logo "o que ele faz é escrito aqui" é falso (as sete linhas e os dois números da pop-up não têm endereço — os dois `bignum` estão sem endereço por decisão declarada, e as sete listas saem sem `campo=`), e "estas linhas mandam" afirma uma precedência que não existe porque não há o que preceder. O `Guardar no estilo` fecha o caso: `data-gesto="guardar-ponto"`, sem `@gesto`.

**A prova:** profiles/estilos_de_jogo.py:77-95 (os campos de `Estilo`) e :113 (a receita do point_and_click) · aba06.py:2592-2608 (a tabela e os dois `bignum` sem endereço, com a razão escrita) · paginas/06-navegacao.html:4222 (`data-gesto="guardar-ponto"`), sem `@gesto` correspondente · pacotes/a06_navegacao.py:3461-3466

**Proposta:** Serve para jogo de <b>apontar e clicar</b>, que espera mouse e não entende controle: <b>o touchpad vira o ponteiro</b>, e o toque vira o clique.

### 9. 06 Navegação — `aba06.py:2642` · **IMPRECISA**

> Apertar os dois botões em até <b>0,15 s</b> conta como combo — mais devagar, o Hefesto entende como dois toques separados.

**Onde ela aparece:** Dica `?` de "Os gestos do controle", ao lado da tabela dos cinco combos.

**O que foi medido:** O acusador ABSOLVEU esta frase, e a absolvição é que não se sustenta. O número 150 está certo; o que ele faz está invertido. `observe()` registra o instante em que o combo INTEIRO aparece e só dispara quando `held_for >= buffer_ms`: 0,15 s é o tempo MÍNIMO com os dois botões apertados JUNTOS, não a janela máxima entre um e outro. Medi na bancada, em memória, com relógio injetado: (A) os dois apertados juntos e soltos em 100 ms — MAIS RÁPIDO que 0,15 s — não viram combo e disparam `ps_solo`, que ABRE A STEAM; (B) PS segurado 2 s e só então o Options — muito "mais devagar" — dispara `gamemode` normalmente; (C) os dois juntos por 0,3 s, dispara. As duas metades da frase estão erradas, e o mapa da casa já dizia: "dispara quando `frozenset({'ps','r3'})` é subconjunto dos botões segurados por MAIS que `buffer_ms` (150 ms)". Custo alto porque a frase manda ela ser rápida, e ser rápida é exatamente o que faz a Steam pular na frente do jogo.

**A prova:** integrations/hotkey_daemon.py:244-252 (`self._first_seen_at.setdefault(combo, t)` · `if held_for < self.config.buffer_ms: continue`) e :56 (`DEFAULT_BUFFER_MS = 150`) · docs/data/mapa-controles.csv:84, linha `entrada.combo.ponte`: "segurados por MAIS que `buffer_ms` (150 ms)" · medição própria com `HotkeyManager.observe(..., now=)`: A → ['ps_solo']; B → 'gamemode' aos 2,2 s; C → 'gamemode' aos 0,3 s

**Proposta:** Segure os dois <b>juntos</b> por um instante: o Hefesto conta o combo depois de <b>0,15 s</b> com os dois apertados. Um toque rápido demais não vira combo — solta o PS sozinho, e o PS sozinho abre a Steam.

### 10. 07 Lançadores — `aba07.py:493` · **FORTE-DEMAIS**

> <b>Detectar o jogo que está aberto</b> é o caminho curto: abra o jogo de onde for, volte aqui e clique — o perfil nasce com a regra certa, sem digitar nada.

**Onde ela aparece:** Dica do «?» no topo do quadro «De onde os seus jogos vêm». É texto de tela do produto (dentro da janela, não é .nota).

**O que foi medido:** Refiz o caminho do gesto sem ler o acusador. `detectar` sobe a escada de três evidências, resolve o appid e devolve UMA frase pelo `_com_outra_frase` — não há uma única escrita em disco no corpo inteiro. O botão «Criar perfil para um jogo» do mesmo cartão nasce `Acao("Criar perfil para um jogo", "", "", "")`: rótulo sem gesto e sem `v`, ou seja, o clique nem chega ao Python. E o produto declara isso em três lugares independentes: a docstring do gesto («O QUE ELE NÃO FAZ: criar o perfil»), o `SEM_DONO['criar-perfil']` e a própria legenda da página, que diz «criar o perfil continua sendo da aba Perfis». Não existe estado em que esta frase seja verdadeira — a promessa não tem código atrás em caminho nenhum. O custo é alto e é de perda silenciosa: ela clica, lê «X está aberto agora e abre pelo atalho do Hefesto», conclui que o perfil nasceu, e o jogo fica sem perfil sem nada acusar.

**A prova:** src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py:1933-1967 (o gesto inteiro, zero escrita) · :1947 · :192-195 (SEM_DONO) · src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py:1487 (`criar` com gesto e `v` vazios) · src/hefesto_dualsense4unix/interface/aba07.py:544

**Proposta:** <b>Detectar o jogo que está aberto</b> é o caminho curto: abra o jogo de onde for, volte aqui e clique — o Hefesto diz qual jogo é e se ele já entra pelo atalho de inicialização. Criar o perfil continua sendo na aba Perfis.

### 11. 07 Lançadores — `desenho_dos_lancadores.py:1559` · **FORTE-DEMAIS**

> Os controles chegam. O atalho de inicialização está no lugar em {N} jogos da sua biblioteca (instalados ou não).

**Onde ela aparece:** Corpo do cartão da Steam no ramo de selo verde `ok`. Texto de tela do produto.

**O que foi medido:** Refiz a conta no fonte do censo, e o estado é alcançável. Em `sentinela_do_wrapper`, `reparaveis` é `[j for j in faltantes if j.motivo != MOTIVO_ESTENDIDO]` e `intocaveis` é o complemento. Logo uma biblioteca em que TODO jogo sem o atalho tem a linha estendida produz `reparaveis` vazio — e o cartão inteiro segue só `falta = len(lida.reparaveis)`. Resultado medido no código: selo `ok`, a frase «Os controles chegam.», o carimbo dizendo «N jogos com a linha intocável — só reparo manual» e o botão «Copiar a linha» nascendo ao lado, tudo no MESMO cartão. Nesses N jogos o atalho não está na linha (o ramo `has_extended_ignore` só é alcançado depois de o `WRAPPER_PREFIX in valor` ter falhado), então o controle não chega — e a primeira frase, que é a alta e a que ela lê primeiro, afirma o contrário do carimbo a dois centímetros. O custo é alto pela direção do erro: ela não deixa de fazer algo, ela para de procurar. A metade da acusação sobre o Steam Input é fraca e não sustenta nada sozinha; a dos intocáveis sustenta a acusação inteira.

**A prova:** src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py:212-225 (intocaveis × reparaveis) · :373-393 (o jogo com ignore estendido não entra em com_wrapper) · src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py:1529-1563 (o selo segue só reparaveis) · :1594-1596 · :1636-1638

**Proposta:** Abrir com «Os controles chegam.» só quando não houver intocável; havendo, abrir pelo fato e nomear o resto: «O atalho de inicialização está no lugar em {N} jogos da sua biblioteca (instalados ou não). Faltam {M} com a linha intocável — para esses a saída é o «Copiar a linha».»

### 12. 08 Conexões — `aba08.py:2042` · **IMPRECISA**

> Se o microfone deste controle existe. Desligado, nenhum programa o enxerga — nem o jogo, nem a chamada de voz.

**Onde ela aparece:** Aba Conexões → linha de controle ABERTA → bloco «Microfone e botões» → o «?» do bloco (MIC_LIGADO_DICA, usada em :2440), e a MESMA primeira frase digitada de novo como dica do <select> Ligado/Desligado em :2441. Sai para os quatro controles, no cabo e no rádio.

**O que foi medido:** A frase é verdadeira no rádio e FALSA no cabo, e sai nos dois — então não é «a resposta certa naquele estado». O seletor grava controles.<endereço>.microfone; quem consome esse valor é `bt_mic.alvos()`, que filtra nós já restritos a Bluetooth e devolve [] quando ninguém pediu. Pelo cabo o canal é a placa USB do próprio aparelho, que o PipeWire publica sozinho — o produto declara isso em dois lugares: `pode_ligar_o_mic` («NO CABO A DECLARAÇÃO NÃO ACENDE NADA … declarar pelo cabo é inerte HOJE») e DICA_MIC_NO_CABO («Pelo cabo o canal deste microfone já existe … A escolha fica gravada para quando este controle voltar ao rádio»). Com o controle no cabo, pôr «Desligado» não cala programa nenhum, e a tela promete o contrário. DERRUBO UMA METADE DA ACUSAÇÃO: não é verdade que «a GUI estável já apaga o interruptor no cabo» — a condição `not no_cabo` CAIU em 04/09 e lá o interruptor fica ACESO; o que a GUI estável faz é EXPLICAR, com a DICA_MIC_NO_CABO. A lacuna real é a frase desta tela, não o interruptor.

**A prova:** src/hefesto_dualsense4unix/interface/aba08.py:2041-2044 e :2440-2441 · src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py:456-469 · src/hefesto_dualsense4unix/app/actions/config/secao_controles.py:585-602 e :485-489

**Proposta:** Dar à dica o mesmo endereço vivo que o `mic-dica` ao lado já tem e dizer o que o produto faz: «Liga e desliga a ponte de microfone deste controle no rádio. Pelo cabo o microfone vem pela placa de som do próprio aparelho e continua no ar — a linha ao lado diz por onde ele chega hoje.» A frase do cabo já existe pronta e medida em secao_controles.DICA_MIC_NO_CABO; é ela que deve ser LIDA, não redigitada.

### 13. 08 Conexões — `aba08.py:3647` · **FORTE-DEMAIS**

> Enquanto isso corre, o que você aperta não vaza para o jogo aberto.

**Onde ela aparece:** Aba Conexões → «Rádio e Adaptadores» → o «?» do título, segundo parágrafo, sobre o botão «Mapear Entrada a Entrada». É lida ANTES de a pessoa aceitar pegar o controle e encostá-lo numa entrada — que é exatamente o gesto que a frase autoriza.

**O que foi medido:** Conferi a peneira eu mesmo, não pela citação. `botoes_para_o_jogo` existe em `calibrar_entradas.py:438` e o grep por ela em src/ devolve três ocorrências e nenhuma é chamada: a definição, o `__all__`:1188 e dois comentários do próprio `aba08.py`. A docstring da função declara a lacuna com todas as letras — «Quem chama isto em produção ainda não existe» — e a lápide viva do portão (`portao_a_casa_sabe_e_o_produto_nao_faz.py:2143`) diz o efeito: o despacho «manda os botões CRUS ao gamepad virtual gateado só pelos 0,3 s de grace», e «confirmar uma entrada com o cabo na mão dispara um pulo ou um tiro no jogo aberto atrás da janela». O agravante é interno ao arquivo: o MESMO `aba08.py` já tirou a MESMA promessa da tela de calibração em 29/08 (`PENEIRA = ""`, com «a peneira NÃO EXISTE hoje»), e a própria legenda desta página, em :3792, escreve «Hoje o produto não faz isso». A tela promete o que o arquivo que a escreve nega três blocos acima.

**A prova:** src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py:438-452 (docstring: «Quem chama isto em produção ainda não existe») · grep `botoes_para_o_jogo` em src/: só :438 e `__all__`:1188, mais dois comentários de aba08.py — zero chamadores · tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:2143-2157 (lápide viva, com o efeito no jogo escrito) · src/hefesto_dualsense4unix/interface/aba08.py:3255-3270 (`PENEIRA = ""`) e :3792

**Proposta:** Tirar a promessa e deixar o gesto: «Mapear Entrada a Entrada é um toque por aparelho: você pluga, ele aprende. Feche o jogo antes de começar.» A frase certa já está guardada em `PENEIRA_QUANDO_ELA_EXISTIR` e volta no dia em que o despacho subtrair o vocabulário — ela fala de janela NA FRENTE, não de janela aberta, e é essa a que volta.

### 14. 08 Conexões — `a08_conexoes.py:3918` · **IMPRECISA**

> Microfone Desligado, pelo cabo • Placa do controle

**Onde ela aparece:** Aba Conexões → «Gestão de Controles» → resumo da linha FECHADA, repintado a cada tique. É o que ela lê sem clicar em nada. A linha 3918 é a metade que decide a palavra (mic-existe); a outra metade é mic-caminho, na linha seguinte do mesmo dicionário — e as duas caem no MESMO <span> do desenho (aba08.py:2426).

**O que foi medido:** Conferi que as duas metades são pintadas sem condição e no mesmo <span>. A palavra vem de `_mic_declarado`, que só responde True quando controles.<hex>.microfone is True — isto é, quando a ponte de RÁDIO foi pedida. `caminho_do_microfone` responde pelo TRANSPORTE VIVO e, no cabo, devolve «pelo cabo • Placa do controle». Resultado: um controle no cabo sem ponte declarada lê «Microfone Desligado, pelo cabo • Placa do controle» — a primeira metade nega um microfone que a segunda metade diz estar no ar, e que está mesmo: pelo cabo o PipeWire publica a placa sozinho e o Hefesto não tem como calá-la (bt_mic.alvos() nem enxerga nó de USB). A direção do erro é a perigosa: a tela diz DESLIGADO sobre um microfone ligado. Não há atenuante de estado — não existe caminho em que o produto esconda o mic-existe no cabo.

**A prova:** src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:578-592 (`_mic_declarado`: «Só True conta»), :3918, :3928 e :2314-2330 (`caminho_do_microfone`) · src/hefesto_dualsense4unix/interface/aba08.py:2426 · src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py:456-469

**Proposta:** No cabo, a linha fechada diz o CAMINHO e não o estado de uma ponte que não existe ali: «Microfone pelo cabo • Placa do controle». O par Ligado/Desligado fica só onde ele manda de verdade — no controle que está no rádio —, e a decisão é a mesma que já tirou a chavinha «pelo cabo / pelo rádio» desta aba.

### 15. 09 Sistema — `aba09.py:1118` · **FORTE-DEMAIS**

> Os três botões à direita já rodaram sozinhos neste exame — é por isso que os achados falam no passado ("estava ligado em 2 jogos, desliguei").

**Onde ela aparece:** Aba Sistema, dica (?) ao lado do rótulo «O exame de hoje». É dica de DESENHO — nada a repinta —, logo está na tela em todo estado, inclusive com o serviço de pé. Publicada.

**O que foi medido:** Fui atrás do exame de verdade em vez de acreditar no rótulo. O que preenche a lista viva é `storm_doctor.storm_report`, que só EMPILHA checks (`check_snd_quirk`, `check_snd_audio_healthy`, `check_quirk`, `check_steam_input`, `check_wireplumber`, `check_authorized_rule`) e está declarado read-only na própria assinatura. Nenhum dos três consertos roda ali — e o texto do check prova o contrário da dica: quando acha Steam Input ligado ele MANDA clicar no botão. O passado dos achados é texto de bancada, e o gerador o declara com todas as letras logo acima da lista («Nenhum deles aconteceu na máquina dela; são texto de bancada»). O custo é alto porque a conclusão que a dica induz — «a máquina já foi mexida, não preciso clicar» — é exatamente a que deixa o Steam Input ligado nos jogos dela; e, do outro lado, ela lê que consertos rodaram sozinhos sem ela pedir.

**A prova:** /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/src/hefesto_dualsense4unix/integrations/storm_doctor.py:913 («Bloco de diagnóstico storm para o `doctor` (read-only)») e :926-935 (a lista de checks, sem um único ato); :570-575 e :587-592 (check_steam_input manda CLICAR o botão — logo o exame não o rodou); interface/aba09.py:1043-1052 (o gerador declara os oito achados como bancada).

**Proposta:** Este exame só olha — ele não muda nada na máquina. Os três botões à direita são os consertos, e cada um só age quando você clica: o primeiro clique mostra o que ele achou, o segundo faz.

### 16. 09 Sistema — `aba09.py:1287` · **FORTE-DEMAIS**

> …e põe a linha de inicialização nos jogos instalados, com cópia de segurança.

**Onde ela aparece:** Aba Sistema, faixa «Preparar os jogos», `title` do botão «Refazer os consertos automáticos» — terceira promessa da mesma frase. Publicada.

**O que foi medido:** Li o gesto inteiro, não só a constante. `refazer_consertos` mede (clique 1) e depois roda EXATAMENTE o que está em CONSERTOS (clique 2): `disable_steam_input.sh --apply-quiet` e `fix_wireplumber_default_source.sh --install`. Nenhum dos dois toca em opção de inicialização — o primeiro só edita os `.vdf` do Steam Input (o cabeçalho do próprio script o declara, inclusive para o portão da porta), o segundo é drop-in de WirePlumber. Quem põe a linha é `aplicar-aos-jogos`, outro botão, outro motor (`steam_launch_options.apply_wrapper_to_all_games` dentro de `with_steam_closed`) — e ele FECHA a Steam por ~20 s, justo o que este promete não fazer. A metade «com cópia de segurança» é verdadeira, mas só para os `.vdf`. O custo é alto pelo caminho indireto: ela lê que a linha já foi posta, não clica no «Aplicar aos jogos da Steam», e os jogos ficam sem o wrapper.

**A prova:** /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py:2756-2760 (CONSERTOS, só os dois scripts) e :2840-2886 (o clique 2 itera CONSERTOS e nada mais); :2529-2572 (aplicar-aos-jogos → apply_wrapper_to_all_games em with_steam_closed); scripts/disable_steam_input.sh:1-30 («NÃO ABRE /dev/hidraw*, ele edita arquivos .vdf da Steam»).

**Proposta:** Sem senha e sem fechar nada: desliga o Steam Input nos jogos onde ele atrapalha, com cópia de cada arquivo. Para pôr a linha de inicialização nos jogos, é «Aplicar aos jogos da Steam», na faixa Avançado.

### 17. 09 Sistema — `aba09.py:1287` · **IMPRECISA**

> Sem senha e sem fechar nada: arruma o áudio dos 2 controles…

**Onde ela aparece:** Aba Sistema, faixa «Preparar os jogos», `title` do botão «Refazer os consertos automáticos» — primeira promessa da mesma frase. Publicada.

**O que foi medido:** A acusação se sustenta e o custo dela está SUBESTIMADO — foi o que achei lendo o script até o fim. `--install` não só instala o drop-in que REBAIXA o microfone do controle: ele APAGA A MARCA DO GESTO do mic (`_marca_do_gesto_apagar`, DROPIN-AMBIGUO-01), reelege a fonte padrão e reinicia o WirePlumber. O próprio script declara que `--install` é «o gesto CONTRÁRIO ao de ligar o mic». Desde 10/09 o microfone de cada controle funciona pelo rádio e o botão físico ELEGE a fonte daquele controle — então «arruma o áudio dos controles» convida exatamente ao clique que desfaz o arranjo dela, num botão que a mesma frase pinta como inofensivo («sem senha e sem fechar nada»). Isso é custo alto: a frase a manda fazer o que desfaz o que funciona.

**A prova:** /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/scripts/fix_wireplumber_default_source.sh:2-13 («impede o DualSense de virar o microfone padrão do sistema») e :1065-1080 (ramo `install`: comentário «é o gesto CONTRÁRIO ao de ligar o mic», `_marca_do_gesto_apagar` + `install_dropin` + `reset_default_source` + `restart_wireplumber`); chamado em a09_sistema.py:2758 (CONSERTOS) e executado em :2864-2873.

**Proposta:** tira o microfone do controle da escolha automática de entrada do sistema (e desfaz a escolha feita pelo botão do microfone, se houver)

### 18. 09 Sistema — `aba09.py:1302` · **DESATUALIZADA**

> Lista os plugins do daemon e relê. Hoje só o terminal alcança isso.

**Onde ela aparece:** Aba Sistema, faixa Avançado, `title` do botão «Ver os plugins carregados». Está na página PUBLICADA (09-sistema.html:1598), no mesmo `<button>` que carrega o `data-gesto="ver-plugins"`.

**O que foi medido:** Refiz a medição sem repetir o acusador e ela se sustenta inteira. O botão nasce de `item_cinza`, que emite `data-gesto`; o gesto existe, está registrado e faz as DUAS metades que a frase promete: `p.chamar("plugin.reload")` e depois `p.resultado("plugin.list")`, escrevendo a lista (nome · ligado/desligado · a que perfis casa) no painel «Detalhes técnicos». Não há leitura de «isso» que salve a frase — reler também sai do botão. O cinza dele não é desculpa: `BOTOES_CINZAS` só o apaga quando o serviço está desligado, e aí a razão pintada é outra («O serviço está desligado — não há o que perguntar a ele»). Com o serviço de pé — o estado normal dela — a frase manda ao terminal quem já está com o dedo em cima do botão que resolve.

**A prova:** /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py:2970-3014 (@gesto "ver-plugins": _trava → plugin.reload → plugin.list → _para_o_painel, com os dois casos de lista vazia separados); :1556 (BOTOES_CINZAS); interface/paginas/09-sistema.html:1598 (o botão publicado, com data-gesto e o title acusado); interface/aba09.py:912-925 (item_cinza emite data-gesto). O mesmo fato velho sobrevive fora da tela em a09_sistema.py:105-108 (SEM_DONO: «só a CLI o chama»), que é comentário — não é tela, mas cai junto.

**Proposta:** Relê os plugins e mostra a lista no painel ao lado: qual está ligado e a que perfis cada um se aplica.

### 19. 10 Perfis — `aba10.py:1363` · **FORTE-DEMAIS**

> Perfil em branco, já com a regra do jogo aberto agora — venha ele de onde vier.

**Onde ela aparece:** Aba Perfis · bloco Perfis Salvos. `title` do botão «Novo», antes do clique.

**O que foi medido:** Li o gesto inteiro e a acusação fica de pé — e o custo é maior do que ela descreveu. `novo` faz `appid = steam_appid_from_wm_class(classe)` e `regra = from_simple_choice("steam_game", …) if appid is not None else MatchAny()`; `steam_appid_from_wm_class` casa só `steam_app_<N>` e devolve `None` para todo o resto. Com um emulador, um jogo da GOG ou um atalho próprio em foco, «venha ele de onde vier» é falso. O agravante que ninguém escreveu: o mesmo gesto chama `_prioridade_acima_dos_catch_all`, então o perfil não nasce apenas sem regra — nasce CATCH-ALL com prioridade acima de todos os catch-all dela, isto é, valendo em tudo e vencendo os outros. A própria docstring do gesto já admite o limite («com jogo da Steam em foco nasce mirando aquele jogo, sem ele nasce catch-all»), e o botão vizinho «Detectar» ganhou a rota de fora da Steam em 06/09 enquanto este ficou para trás. Custo alto: ela clica acreditando que amarrou o perfil ao jogo aberto, ajusta tudo ali, e o que criou foi um perfil que vale sempre e atropela os outros.

**A prova:** a10_perfis.py:3005-3011 (`appid = steam_appid_from_wm_class(classe)`, `regra = … if appid is not None else MatchAny()`, e o `prioridade = ProfilesActionsMixin._prioridade_acima_dos_catch_all(...)` logo abaixo). profiles/steam_app.py:78-90 (`None` para toda classe fora de `steam_app_N`). A rota que o «Detectar» tem e este não: a10_perfis.py:2941-2950.

**Proposta:** Perfil em branco. Com um jogo da Steam aberto agora, ele já nasce valendo só para esse jogo; sem isso, nasce valendo para tudo — e o «Detectar» ao lado prende o perfil a um jogo de qualquer lugar.

### 20. a moldura — `topo.html:777` · **IMPRECISA**

> Esta aba não usa o controle escolhido aqui — os cards são leitura.

**Onde ela aparece:** `title` da fita esmaecida do `Selecionar:`, no cabeçalho. Conferido no disco: SEIS páginas publicadas a trazem — 03-gatilhos:1551, 04-iluminacao:1918, 05-vibracao:1916, 07-lancadores:1303, 09-sistema:1378, 10-perfis:1651 (a 06 troca pela dica própria de `monta.TITULOS_DA_FITA`). E ela é a MESMA na tela viva: `monta.fita()` a emite como padrão de toda fita inerte, e o piloto repinta a fita inteira a cada tique com essa saída crua.

**O que foi medido:** A acusação se sustenta e minha medição a AMPLIA: são três abas, não duas. Primeiro fixei o que «cards» quer dizer nesta casa, porque era a saída mais provável da frase — e ela não existe: no `paginas/02-controles.html` os `title` irmãos da mesma fita dizem «Abre os 4 cards de uma vez» e «Clique para abrir o card dele», ou seja, `card` = cartão de CONTROLE, sem ambiguidade. Depois contei sozinho, parseando o aninhamento do HTML publicado (gesto = `data-gesto`/`data-hef-gesto`/`data-papel`/`data-forca`/`data-modo`, que são os quatro vocabulários que `hefesto_vivo` despacha em :1382): gestos VIVOS dentro de um `div.ctrl[data-controle=pN]` — 03-gatilhos 24, 04-iluminacao 80, **05-vibracao 32**, contra 0 em 07, 09 e 10. O acusador não mediu a Vibração e por isso ficou aquém: os 32 da 05 são os degraus de força, a intensidade por controle e os dois motores, e o `title` de cada um diz, com todas as letras, «Grava na hora, no perfil ativo, só para este controle». Ou seja: em metade das abas onde esta dica aparece, o cartão é exatamente o lugar onde se ajusta cada controle, e a dica diz que ele é leitura. A primeira metade continua verdadeira (03, 04, 05, 07, 09 e 10 estão fora de `monta.ABAS_QUE_ESCOLHEM`, que só tem 01, 02 e 08). A origem do erro é de generalização: a frase nasceu em 26/08 descrevendo UMA aba («nada nesta aba ajusta por controle; os cards são leitura») e virou o padrão das sete inertes em `monta.fita()`.

**A prova:** src/hefesto_dualsense4unix/interface/monta.py:906 (o padrão da fita inerte) e :739 (`ABAS_QUE_ESCOLHEM = {01-jogar, 02-controles, 08-conexoes}`); medição própria de aninhamento sobre as páginas publicadas: 03=24, 04=80, 05=32 gestos dentro de `div.ctrl[data-controle]`, 07/09/10=0; src/hefesto_dualsense4unix/interface/paginas/05-vibracao.html:2077 (o cartão) com :2384-2399 (`data-forca`, `data-papel=intensidade`, `data-papel=motor`, title «Grava na hora, no perfil ativo, só para este controle»); paginas/03-gatilhos.html:1681 + :1687/:1714/:1821/:1823 (`modo`, `pronto`, `guardar`, `em-todos` dentro do cartão do P1); paginas/02-controles.html (title «Abre os 4 cards de uma vez» — o que «card» significa aqui); docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:164 (a frase de origem, escrita para UMA aba).

**Proposta:** Cortar a segunda metade do padrão em `monta.fita()` — «Esta aba não usa o controle escolhido aqui.» — e declarar em `monta.TITULOS_DA_FITA`, como a 06 já faz, a dica de cada aba que TEM ajuste no cartão: «Esta aba não usa o controle escolhido aqui — o ajuste de cada um está no cartão dele.» para 03, 04 e 05. O dono da resposta é o mesmo que já responde `a_fita_escolhe`, então a régua pode ser: aba com gesto aninhado em cartão não pode cair no padrão de leitura.

### 21. o motor (app/) — `audio_saida.py:1000` · **DESATUALIZADA**

> este controle não publica placa de som para o sistema — pelo rádio o DualSense não expõe nenhuma, e é por isso que 'Todo o som do PC' não tem para onde mandar. Pelo cabo ele tem.

**Onde ela aparece:** TELA VIVA, confirmado: `mandar_o_som_do_pc` devolve `DesfechoDaRota(False, MOTIVO_ROTA_SEM_SINK)` (audio_saida.py:1071) e a02_controles.py:3637 faz `raise RuntimeError(desfecho.motivo)` no gesto «rota» — a frase vira a recusa do cartão do controle. É a frase que ela fotografou hoje, com o P1 no rádio tocando o som do PC.

**O que foi medido:** Refiz a cadeia por conta própria e a acusação se sustenta, mas por um caminho diferente do que o acusador descreve. A frase tem DUAS camadas e só a segunda caiu. A primeira («o DualSense não expõe placa própria por rádio») continua exata, e é a mesma precisão que salva a frase da linha 1364. O que caducou é a CONCLUSÃO: `sink_do_controle` passou a reconhecer `hefesto_som_<hex6>` como a saída daquele controle TAMBÉM no rádio (alto_falante_bt.py:2340 `_sink_proprio_vivo`, :2396, e o `return escolher_sink(...) or proprio` de :2415), e o teste `test_o_botao_todo_o_som_do_pc_deixa_de_recusar_no_radio` prova o clique inteiro — `set-default-sink` no nó, `desfecho.ok`. Logo «não tem para onde mandar» é falso e «Pelo cabo ele tem» é um remédio errado: hoje ele tem no rádio também. E o mapa não abriga a frase — o comentário acima dela invoca `audio.alto_falante@dualsense, radio_aciona=não`, mas a MESMA linha do mapa traz `radio_comando = IMPLEMENTADO E FIADO EM PRODUÇÃO — 10/09/2026`, `radio_ate_onde_foi = SAIU NO FIO` e a nota que diz com todas as letras que o `não` só continua `não` porque faltam o negativo de rota e o teste cego, que são DELA; a dívida «deixou de ser do PRODUTO». Custo alto porque é o único recado que ela vê nesse estado, e ele a manda desistir de uma coisa que funciona e ir buscar o cabo.

**A prova:** commit 315d912b (10/09/2026 20:26, em `dev`) curou a resolução do sink e `--stat` mostra que ele tocou alto_falante_bt.py, conexoes_vivas.py, controles_vivos.py, jogar_vivo.py e o teste novo — `app/audio_saida.py` NÃO está na lista, então a frase ficou para trás; tests/unit/test_o_no_do_radio_conta_como_placa.py:105-127; docs/data/mapa-controles.csv, audio.alto_falante@dualsense (`radio_comando`, `radio_ate_onde_foi`, `nota`)

**Proposta:** Não encontrei a saída de som deste controle agora. Se o Hefesto acabou de ligar, espere alguns segundos e clique de novo; se ele estiver parado, ligue-o na aba Sistema. (E o comentário `#:` acima da constante sai junto: ele declara esta como «a única frase de transporte que esta leva manteve», o que deixou de valer hoje.)

---

## §2 — O RESTO, por aba

As de custo médio e baixo, agrupadas. A coluna «o que é» é o veredito; a frase
está abreviada — o endereço abre no texto inteiro.


### 01 Jogar — 15 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `aba01.py:1524` | IMPRECISA | Vale <b>quando o jogo abrir</b>. O que muda entre os quatro é <b>como o jogo desenha os botões</b> — luz, vibração, gat… | Vale <b>a partir do clique</b>, e é também o que o Hefesto vai oferecer no próximo jogo. O que muda entre os quatro é <… |
| `aba01.py:1749` | DESATUALIZADA | Vai mudar para <b data-campo="pendente-alvo">Sony DualSense</b> quando você clicar em <b>Aplicar</b> | ● Vai mudar para <b data-campo="pendente-alvo">Sony DualSense</b> — o serviço ainda não alcançou (o texto vivo já é est… |
| `aba01.py:1960` | DESATUALIZADA | <b>Fixar um modo pela tela ainda não existe</b> … Clicar em <b>Sony DualSense</b>, <b>Xbox</b> ou <b>Steam Input</b> ho… | <b>Escolher o modo pela tela funciona</b> — Sony DualSense, Xbox e Navegação trocam na hora. O <b>Steam Input</b> é o ú… |
| `aba01.py:1966` | DESATUALIZADA | <b>A máscara Nintendo Pro não existe hoje</b>, e entra assim mesmo … O catálogo do produto (<code>integrations/uinput_g… | <b>As três máscaras existem</b> — DualSense, Xbox 360 e Nintendo Pro —, e qualquer uma vale em qualquer controle; o inv… |
| `aba01.py:1508` | IMPRECISA | Isto não encerra o serviço. Para isso, a aba <b>Sistema</b>. | Desligado não para o serviço — só tira o Hefesto do meio. Ligado religa o serviço, se ele estiver parado. Para parar, a… |
| `aba01.py:1525` | IMPRECISA | Ele <b>tenta na ordem em que estão aqui e para quando acerta</b>; depois não pergunta mais para aquele jogo. | Ele tenta os três primeiros <b>na ordem em que estão aqui</b> e para quando acerta; depois não pergunta mais para aquel… |
| `aba01.py:1866` | DESATUALIZADA | <b>Os DOIS que ainda não têm quem os atenda aparecem, e dizem isso</b> — é a sua ordem de 31/08 (manter <b>Point And Cl… | <b>Nenhum modo da fileira nasce marcado</b> — o <b>Point And Click</b> saiu dela em 31/08, por sua ordem, e os quatro q… |
| `aba01.py:1878` | IMPRECISA | <b>Quatro controles ligados, um cartão cada</b> — a lista é a <code>MESA</code> do <code>monta.py</code>: não há "quatr… | <b>Quatro lugares, um cartão cada</b> — o lugar sem controle fica apagado, e o número do jogador é campo, não a posição… |
| `aba01.py:1888` | DESATUALIZADA | <b>A área de avisos tem espaço reservado</b> e <b>conta quantos são</b>. Antes, três banners disputavam a linha … A bar… | (sai — a linha descreve uma seção que a aba não tem mais; entre os cartões e o botão ficou uma divisória só, a da `.fai… |
| `aba01.py:1905` | DESATUALIZADA | <b>As máscaras que aparecem escolhidas</b> — {frase_das_mascaras()}. É para você <b>ver</b> que a escolha é por control… | <b>As máscaras que aparecem escolhidas</b> — {frase_das_mascaras()}. É para você <b>ver</b> que a escolha é por control… |
| `aba01.py:1909` | DESATUALIZADA | <b>A ordem dos cinco modos não é a ordem em que você os listou</b>, e é a única coisa em que me afastei do seu texto. | <b>A ordem dos quatro modos não é a ordem em que você os listou</b>, e é a única coisa em que me afastei do seu texto. … |
| `aba01.py:1947` | DESATUALIZADA | <b>A linha laranja tracejada</b> é a prova de que o Aplicar ainda deve. Ela só aparece com escolha pendente — e o espaç… | <b>A linha laranja tracejada</b> é a prova de que o clique registrou e o serviço ainda não alcançou. Ela some sozinha q… |
| `aba01.py:1954` | DESATUALIZADA | <b>O interruptor tem de ler DOIS modos como "Ligado"</b> … Sem uma leitura derivada (<code>ligado = modo in {gamepad, d… | (sai — o interruptor já lê `gamepad` e `desktop` como Ligado, e continua aceso quando você escolhe a Navegação) |
| `aba01.py:1976` | DESATUALIZADA | O que falta é <b>passar a identidade</b> em três lugares: <code>virtual_pad.make_virtual_pad</code>, <code>coop.py</cod… | <b>Cada controle guarda a própria máscara</b> — o serviço já cria o controle virtual de cada aparelho com a escolha del… |
| `a01_jogar.py:2365` | IMPRECISA | “{rotulo}” está desenhado na tela e o Hefesto não sabe montar essa máscara. As que existem: {tem}. | “{rotulo}” não está disponível. As que estão: {tem}. |

### 02 Controles — 4 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `aba02.py:3069` | DESATUALIZADA | a volta só existe pela janela do aplicativo completo ou reiniciando o Hefesto | a volta não existe por esta tela — o botão do plástico volta a valer reiniciando o Hefesto |
| `aba02.py:3149` | DESATUALIZADA | O acelerômetro está desenhado e não é pintado ao vivo. Os três eixos em g aparecem no card, mas a ponte que dá vida a e… | <b>Fechou:</b> o acelerômetro é pintado ao vivo. Os três eixos em <b>g</b> saem do mesmo caminho do giroscópio, escrito… |
| `a02_controles.py:945` | IMPRECISA | Este é o código da cor do JOGADOR, não a do plástico — quem escolhe é o produto, pela mesma tabela que acende as cinco … | Este é o código da cor do JOGADOR, não a do plástico. Quem a escolhe é o Hefesto, pela mesma tabela que acende as cinco… |
| `a02_controles.py:3719` | IMPRECISA | o Hefesto ainda não disse se este sensor está ligado ou desligado, e alternar sem saber o estado atual seria chutar qua… | O Hefesto ainda não disse se este sensor está ligado ou desligado, e alternar sem saber o estado de agora seria chutar.… |

### 03 Gatilhos — 9 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `a03_gatilhos.py:477` | IMPRECISA | Trava dura do começo ao fim do curso. Serve para freio de carro e para arma travada. | Uma parede dura a partir do ponto do curso que você marcar. Serve para freio de carro e para arma travada. |
| `a03_gatilhos.py:482` | IMPRECISA | Peso constante do começo ao fim, sem trava — remada, alavanca, arco sendo puxado. | Peso constante do ponto que você marcar até o fim do curso, sem trava — remada, alavanca, arco sendo puxado. |
| `a03_gatilhos.py:487` | IMPRECISA | Batidas rápidas e fortes enquanto apertado. É o padrão do Estilo FPS. | Batidas rápidas e fortes enquanto o gatilho está apertado — a metralhadora no dedo. |
| `a03_gatilhos.py:478` | IMPRECISA | A mesma trava dura, com um só ponto de ajuste em vez de dez. | A mesma parede dura, porém do começo ao fim do curso e com uma barra só de firmeza. |
| `a03_gatilhos.py:1048` | IMPRECISA | Este modo não tem o que ajustar. | Trocar só no lugar VAZIO, no chamador: a caixa de Ajustes de uma coluna sem aparelho passa a dizer «Nenhum controle nes… |
| `aba03.py:1300` | FORTE-DEMAIS | O caminho de volta continua existindo pelo campo Modo, que reaplica a cada escolha. | O caminho de volta é arrastar qualquer barra de Ajustes, que reenvia o efeito inteiro como ele está na tela. Pelo campo… |
| `aba03.py:1353` | DESATUALIZADA | O que entrou em 06/09, e é a única coisa desta aba que espera a sua palavra | O que entrou em 06/09, e já está na sua tela desde 08/09 |
| `a03_gatilhos.py:2989` | DESATUALIZADA | Para guardar um efeito seu, dê um nome a ele e use 'Guardar esse efeito'. | Não há curva a aplicar: «— Nenhum —» é a ausência de escolha. Para guardar um efeito seu, escreva um nome no campo ao l… |
| `a03_gatilhos.py:3406` | IMPRECISA | o nome do efeito passou de 60 letras. O campo de escolha em que ele aparece tem 220px de coluna — um nome que não cabe … | O nome ficou grande demais. Use até 60 letras: o que passa disso aparece cortado na lista, e um efeito que você não con… |

### 04 Iluminação — 7 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `aba04.py:1557` | IMPRECISA | Ligado, cada controle acende a cor do número dele e recebe o número automaticamente — inclusive os controles de outras … | Ligado, cada controle sem cor própria acende a cor do número dele. O número em si chega sozinho de qualquer jeito — inc… |
| `aba04.py:1603` | DESATUALIZADA | Os oito quadradinhos são as oito cores do produto — uma por número de jogador (1 azul, 2 vermelho, 3 verde, 4 rosa, 5 a… | Os catorze quadradinhos são os tons que o produto oferece. Os oito primeiros são as cores de número de jogador (1 azul,… |
| `a04_iluminacao.py:2969` | FORTE-DEMAIS | Cores automáticas desligadas. Guardei a cor de cada controle no perfil, para nenhuma se perder e nenhuma se repetir. | Cores automáticas desligadas. Guardei a cor dos controles que estão ligados agora, para nenhuma se perder. Um controle … |
| `aba04.py:1299` | IMPRECISA | A borda é a cor do plástico deste controle, quando o produto a conhece. A barra acende a cor do número, e as cinco lâmp… | A borda é a cor do plástico deste controle, quando o produto a conhece. A barra acende o tom escolhido aqui; sem escolh… |
| `a04_iluminacao.py:1543` | IMPRECISA | Por isso a fileira oferece 1 · 2 · 3 · 4 — os números que existem agora. | Por isso a fileira só acende os números dos controles ligados agora. Um número livre não teria com quem trocar, e dá-lo… |
| `aba04.py:1580` | IMPRECISA | A barra acende na cor do número. A borda da moldura é a cor do plástico, e as cinco luzinhas acima do touchpad dizem o … | Sem escolha à mão, a barra acende na cor do número; com um tom escolhido, acende o que você escolheu. A borda da moldur… |
| `aba04.py:1602` | DESATUALIZADA | O último quadradinho é o livre, para uma cor fora das oito. | O último quadradinho é o livre, para um tom que não está na guia. |

### 05 Vibração — 8 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `a05_vibracao.py:323` | IMPRECISA | a força geral está em Auto, e por isso a força própria de {quantos} controle(s) fica guardada sem chegar ao motor. Tire… | a força que você escolheu ficou guardada, mas não chega ao motor: o ajuste geral deste perfil segue a bateria. Escolha … |
| `aba05.py:1790` | DESATUALIZADA | A barra ao lado diz com que força esse motor entra no <b>Testar</b>, de 0 a 255. | A barra ao lado vai de 0 a 100% e multiplica a força escolhida acima: em 100% este motor treme como o degrau pediu, em … |
| `aba05.py:1811` | DESATUALIZADA | <b>Testar</b> faz aquele controle tremer meio segundo com os valores das barras daquela coluna; <b>Parar</b> corta a vi… | <b>Testar</b> faz aquele controle tremer com os valores das barras daquela coluna, e ele continua tremendo enquanto voc… |
| `aba05.py:1899` | FORTE-DEMAIS | <b>Motor esquerdo e direito são o que ATIVA o lado durante o jogo</b> — o interruptor de cada lado, e o desenho mostra … | <b>Motor esquerdo e direito nomeiam os dois motores</b> — o desenho mostra qual punho está tremendo, e quem cala um pun… |
| `aba05.py:1920` | DESATUALIZADA | <b>O "Auto" mostra 70% no P3</b> porque a bateria dele está no meio. Esse número muda sozinho na tela enquanto joga, ou… | — |
| `aba05.py:1756` | IMPRECISA | O lado que treme acende em <b>laranja</b>; o contorno na cor do <b>plástico</b> diz de quem é o controle. Apagado é lad… | O punho que está tremendo agora acende em <b>laranja</b>; o contorno na cor do <b>plástico</b> diz de quem é o controle… |
| `aba05.py:1896` | DESATUALIZADA | <b>A força tem endereço, e o endereço é a coluna</b> — cada uma tem os seus quatro degraus e a sua barra. | <b>A força tem endereço, e o endereço é a coluna</b> — cada uma tem os seus três degraus e a sua barra. |
| `aba05.py:1900` | DESATUALIZADA | <b>A barra de Força para em {TETO}%</b>, que é o Máximo — não passa dele. | <b>A barra de Força vai até 200%</b> — bem acima do Máximo, que é 150%. |

### 06 Navegação — 11 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `a06_navegacao.py:1009` | FORTE-DEMAIS | Só a janela | Só o jogo |
| `a06_navegacao.py:1527` | DESATUALIZADA | <b>PS: duas coisas ao mesmo tempo.</b> Ele digita “…” <b>e</b> continua sendo a saída de emergência — os gestos desta a… | <b>PS: duas coisas ao mesmo tempo.</b> Ele digita “…” <b>e</b> continua sendo a saída de emergência — os gestos desta a… |
| `aba06.py:2051` | DESATUALIZADA | Ele continua sendo a saída de emergência — os 5 gestos desta aba saem dele, e segurá-lo alterna o modo jogo —, e a tecl… | Ele continua sendo a saída de emergência — os 5 gestos desta aba saem dele —, e a tecla que você escolher para ele acon… |
| `aba06.py:2054` | IMPRECISA | Escolher <b>— Nada —</b> cala as duas. | Escolher <b>— Nada —</b> cala o toque no PS: ele deixa de digitar e deixa de abrir a Steam. Os gestos com o PS continua… |
| `aba06.py:2629` | DESATUALIZADA | Os 4 controles ligados, cada um na cor do seu plástico, com as cinco lâmpadas no padrão do número dele e a barra de luz… | Os controles ligados agora, cada um na cor do seu plástico e com a barra de luz na cor automática do número dele. |
| `aba06.py:2648` | FORTE-DEMAIS | <b>Ressalva:</b> o <b>PS + R3</b> e o <b>PS + Options</b> são as duas saídas de emergência quando o jogo não responde —… | <b>Ressalva:</b> o <b>PS + R3</b> e o <b>PS + Options</b> são as duas saídas de emergência quando o jogo não responde. … |
| `aba06.py:2660` | IMPRECISA | Precisa de <b>uinput</b> e de uma regra <b>udev</b>; o instalador já deixa os dois prontos. Se a linha de estado abaixo… | Precisa de <b>uinput</b> e de uma regra <b>udev</b>; o instalador já deixa os dois prontos. Quando o cursor não andar, … |
| `aba06.py:1874` | DESATUALIZADA | Vale para <b>este perfil</b>. Enquanto estiver em <b>Nunca</b>, o controle é só gamepad e nada desta aba chega ao PC. | Vale para <b>este perfil</b>. Com ele <b>Desligado</b>, o controle é só gamepad e nada desta aba chega ao computador. |
| `aba06.py:1878` | IMPRECISA | Liga o que o controle <b>digita</b>: os atalhos da tabela à direita, o teclado na tela e as três regiões do touchpad. | Liga o que o controle <b>digita</b>: os atalhos das telas de botões, o teclado na tela e as três regiões do touchpad. |
| `aba06.py:2438` | DESATUALIZADA | Isto apaga também os <b>atalhos de teclado</b> que este perfil guarda — inclusive os que você escreveu na janela antiga… | Isto apaga também os <b>atalhos de teclado</b> que este perfil guarda — inclusive os de antes, que esta lista não sabe … |
| `aba06.py:2633` | IMPRECISA | Mouse, teclado e os 5 gestos saem do controle do <b>Player 1</b> — é o controle que o Hefesto lê por inteiro; os outros… | Mouse, teclado e os 5 gestos saem de <b>um controle só</b> — o que está marcado como “Navega o PC” aqui embaixo; os out… |

### 07 Lançadores — 5 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `aba07.py:517` | DESATUALIZADA | o produto tem <b>zero</b> menção a RetroArch, Dolphin ou mGBA no código, e o Orpheus depende de um emulador de GBC. Her… | <b>A nova é sobre de onde o jogo vem</b> — e existe para fechar uma lacuna que era medida: até 02/09/2026 o produto não… |
| `aba07.py:552` | DESATUALIZADA | <b>Quem mede Heroic, Lutris e os emuladores?</b> Ninguém, ainda. É varredura nova, não é ligar o que existe — e por iss… | <b>Quem mede Heroic, Lutris e os emuladores?</b> O censo dos lançadores, desde 09/09/2026: ele abre o catálogo dos cinc… |
| `a07_lancadores.py:1966` | IMPRECISA | <b>não abre pelo atalho do Hefesto</b> — clique em Consertar com o jogo e a Steam fechados. | Ramificar o segundo membro pelo estado que o produto já conhece: sem leitura ou com `erros`, «ainda não li a sua biblio… |
| `a07_lancadores.py:2193` | IMPRECISA | Ainda não sei abrir o {nome}. O Hefesto só sabe abrir a Steam por enquanto — abra este lançador como você já abre, que … | Ainda não sei abrir {nome do cartão, lido de `desenho.procurados(lida.declarados)`}. O Hefesto só sabe abrir a Steam po… |
| `a07_lancadores.py:2784` | IMPRECISA | Se o que ele achou não é o que você quer, me diga — hoje o cartão não tem por onde trocar. | {nome} já tem cartão nesta aba, e o Hefesto já o achou sozinho nesta máquina. Não há o que apontar: o que você digitar … |

### 08 Conexões — 4 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `aba08.py:2424` | DESATUALIZADA | A cor deste controle não foi lida — a borda fica neutra. | Quem decide é a LEITURA, não o transporte — e a dica precisa de endereço para deixar de ser da cena: dar `data-campo="b… |
| `aba08.py:3737` | DESATUALIZADA | O rádio Bluetooth de cada adaptador tem 1.600 turnos de tempo para dividir entre tudo que fala nele. Cada controle come… | Manter os números (continuam certos sobre o que mediram) e fechar a enumeração: «… Cada controle come 260,4 com o que e… |
| `aba08.py:3833` | CONTRADIZ-O-MAPA | Os {N} controles no rádio são os de borda neutra, porque o Hefesto ainda não pergunta a cor pelo rádio (ONDA-CONEXOES-1… | «O dropdown de cor saiu das linhas dos controles. Quem o produto lê aparece na borda; quem ele não lê fica com borda ne… |
| `aba08.py:3810` | DESATUALIZADA | E a lacuna mais visível — o mic — tem cura: o estado Emulado da ONDA-CONEXOES-06 entrega o áudio por um dispositivo que… | «E a lacuna mais visível — o mic — não é lacuna: pelo rádio o Hefesto já entrega o áudio por um dispositivo que qualque… |

### 09 Sistema — 6 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `a09_sistema.py:580` | CONTRADIZ-O-MAPA | o serial só é lido no cabo | o serviço ainda não trouxe o número deste controle |
| `aba09.py:1198` | IMPRECISA | A pausa fica gravada em disco e sobrevive a desligar o computador. O botão Retomar, ao lado, é a saída — até 27/08/2026… | A pausa fica gravada e sobrevive a desligar o computador. O botão Retomar, ao lado, é a saída. |
| `aba09.py:1210` | IMPRECISA | Pergunta antes, dizendo o que se perde. | Pergunta antes: o botão vira uma pergunta e só o segundo clique para o serviço. |
| `aba09.py:1236` | IMPRECISA | O que este perfil limita hoje, em todos os controles. O degrau vem de RUMBLE_POLICY_MULT, no daemon — nenhum número esc… | O que este perfil limita hoje, em todos os controles. — e trocar também o gêmeo em gui/aba_sistema.py:445-449, senão a … |
| `aba09.py:1238` | IMPRECISA | Onde o teto do perfil age de verdade hoje. Sai de LINHAS_DO_TETO, no produto — nenhum nome escrito nesta tela. | Onde o teto do perfil age de verdade hoje. |
| `aba09.py:1308` | CONTRADIZ-O-MAPA | cor de fábrica só no cabo (p1) | cor de fábrica lida nos 4 |

### 10 Perfis — 8 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `aba10.py:1047` | FORTE-DEMAIS | Estilo de Jogo | Tirar «Estilo de Jogo» da lista do «Funciona em» — o Estilo de Jogo já tem campo próprio logo abaixo, e ali ele funcion… |
| `aba10.py:1237` | FORTE-DEMAIS | Nenhum controle neste lugar. O perfil guarda o que está aqui pelo ID da peça: quando o P3 voltar, ele encontra o que vo… | Este lugar está vazio. O que você ajusta fica guardado com o CONTROLE, não com o lugar: quando aquele controle voltar, … |
| `aba10.py:1495` | FORTE-DEMAIS | Pré-aplica um perfil inteiro: escolhendo FPS, o gatilho, a luz, a vibração e a máscara já vêm resolvidos. Os catorze de… | Pré-aplica de uma vez o gatilho, a vibração e a cor da luz — uma cor diferente para cada controle. Os catorze de fábric… |
| `aba10.py:1529` | IMPRECISA | Aceso: este perfil guarda um ajuste só deste controle. Apagado: ele usa o do perfil, igual aos outros. São os sete ajus… | Aceso: este perfil guarda um ajuste só deste controle. Apagado: ele usa o do perfil — e, na máscara, apagado devolve o … |
| `aba10.py:1643` | DESATUALIZADA | "Modo que liga" e "O jogo vê o controle como" não estão desenhados aqui. A legenda anterior dizia que ficaram, e era fa… | "O jogo vê o controle como" não está desenhado aqui — ele mora na Jogar; se vier também para cá, é decisão sua. O "Modo… |
| `aba10.py:1647` | DESATUALIZADA | O conteúdo dos Estilos de Jogo continua em aberto: a lista está aqui, o que cada um liga não. | Cada Estilo de Jogo já liga uma receita: o modo do gatilho, o degrau da vibração e uma cor de luz diferente para cada c… |
| `aba10.py:1326` | IMPRECISA | Um perfil guarda tudo o que você ajustou nas outras abas — gatilho, luz, vibração, som, sensores e máscara — e o traz d… | Um perfil guarda tudo o que você ajustou nas outras abas — gatilho, luz, vibração, som, microfone, sensores, máscara, m… |
| `aba10.py:1638` | IMPRECISA | "Detectar" — abra o jogo de onde for, volte e clique; o perfil nasce com a regra certa. | "Detectar" — abra o jogo de onde for, volte e clique: o perfil que está aberto no editor passa a valer só para esse jog… |

### a moldura — 2 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `topo.html:790` | DESATUALIZADA | Tudo o que você mudar em qualquer aba cai <b>neste</b> perfil quando clicar em <b>Salvar Perfil</b>. | Tudo o que você mudar em qualquer aba já entra <b>neste</b> perfil na hora do clique. O <b>Salvar Perfil</b> é a rede: … |
| `hefesto_vivo.py:1674` | FORTE-DEMAIS | Esta aba passa a mirar os {N} controles. | Você tirou a escolha de um controle só. O que valer para um controle apenas vai pedir que você escolha antes de agir. |

### o motor (app/) — 2 linha(s)

| onde | o que é | a frase | a proposta |
| --- | --- | --- | --- |
| `emulation_actions.py:500` | IMPRECISA | Ligado, mas o teclado virtual não subiu. Abra a aba Sistema e clique em “Consertar problemas conhecidos”. | Pedir o rótulo ao dono em vez de digitá-lo — `rotulo_do_botao("btn_storm_fix_safe", "Refazer os consertos automáticos")… |
| `audio_saida.py:1000` | DESATUALIZADA | este controle não publica placa de som para o sistema — pelo rádio o DualSense não expõe nenhuma, e é por isso que 'Tod… | Não há saída de som atribuída a este controle agora, então o som do computador não tem para onde ir. Ela aparece sozinh… |


---

## §3 — AS 46 QUE CAÍRAM, e por que isso importa

O adversário derrubou 46 acusações. Elas ficam registradas porque **uma
frase absolvida não deve ser reacusada na próxima varredura** — e porque o
motivo da absolvição é, quase sempre, o mesmo: *a frase só aparece num estado em
que ela é verdadeira*.

| onde | a frase | por que a acusação caiu |
| --- | --- | --- |
| `aba01.py:308` | A Steam entrega a entrada, e os seus ajustes vencem os do jogo. Trocar para cá exige reabrir a Stea… | A ACUSAÇÃO CAI — testei cada oração contra o dono e as três passam. «A Steam entrega a entrada e os ajustes dela vencem o jogo» é a redação do próprio `ESCADA[… |
| `aba01.py:1589` | O Hefesto sai do meio e o jogo fala direto com o controle. Vale no próximo jogo que abrir. | A ACUSAÇÃO CAI, e o dono do fato a derruba. O degrau Nativo é o ÚNICO da escada com `exige_reabrir_jogo=True` — `ao_vivo` é False —, e o `porque` dele, escrito… |
| `aba01.py:1845` | O microfone segue o <b>transporte</b>, não a máscara. | A ACUSAÇÃO CAI, nas duas pernas. (1) O acusador lê o item «Ainda é sua a palavra» como se ele desmentisse esta frase — não desmente, CORROBORA: o que aquele it… |
| `aba01.py:1914` | a DualSense primeiro porque <b>dez</b> linhas do <code>mapa-controles.csv</code> só chegam ao jogo … | A ACUSAÇÃO CAI, e o erro dela é verificável em uma linha. O acusador diz que esta é «literalmente a redação que a régua BANE» — não é: a régua proíbe quatro ca… |
| `aba01.py:1663` | O controle na sua mão continua o mesmo: luz, gatilho, giroscópio e áudio seguem por conta do Hefest… | Refiz a checagem por conta própria, com o olho na leva de 10/09, e confirmo o VERDADEIRA do relator. A frase fala de MÁSCARA — a identidade do controle virtual… |
| `aba01.py:1981` | o Pro Controller <b>não tem</b> microfone, alto-falante, touchpad, lightbar RGB, gatilho adaptativo… | Confirmo o VERDADEIRA. Fui ao mapa e li as seis linhas do controle `pro` uma a uma — `audio.microfone`, `audio.alto_falante`, `toque.touchpad`, `luz.lightbar.c… |
| `aba02.py:2058` | Guarda que o microfone deste controle entra sozinho, sem o Hefesto no meio. Vale nos dois transport… | A acusação cai porque o fato em que ela se apoia não é o do produto de hoje. Ela afirma: «Escolher Nativo com o controle no rádio deixa o microfone sem por ond… |
| `aba02.py:2435` | <b>Sons do jogo</b> manda só o áudio do jogo ao alto-falante do controle; | A acusação mediu só metade do mecanismo. Ela diz que «Sons do jogo» é apenas o byte OUTPUT_PATH_SEL=2 e que «o firmware não sabe o que é áudio do jogo» — verda… |
| `aba02.py:1844` | Calar no firmware do controle — apaga a luz vermelha do plástico. A partir daqui quem manda no mudo… | O próprio acusador concede que «o comando existe e faz o que a frase diz» — a acusação não é de mentira, é de língua, e ela não se sustenta em duas frentes. Pr… |
| `aba02.py:1885` | Manda zero ao alto-falante do controle, sem perder o volume guardado. A partir da primeira escrita … | Cai pela mesma medição da irmã, e com um agravante próprio. O acusador concede que o comando existe e faz exatamente o que a frase diz (`speaker release` → `sp… |
| `aba02.py:2367` | A barra mostra o som <b>entrando agora</b>. O <b>🎙</b> cala no <b>firmware</b> e apaga a luz vermel… | A acusação cai, e a prova é a própria proposta dela: «O 🎙 põe o microfone deste controle no ar — ele destrava o microfone no próprio controle, APAGA A LUZ VERM… |
| `a02_controles.py:3684` | O sistema não publica um microfone para este controle: no rádio, é o canal do microfone que ainda n… | Confirmo a absolvição, e refiz a conta em vez de aceitá-la. A frase só sobe em `corpo.get("status") == "sem_fonte"` (a02_controles.py:3875-3876) — o serviço re… |
| `aba02.py:2054` | Guarda que o microfone deste controle passa pelo Hefesto. Pelo rádio é assim que ele ganha um canal… | Confirmo, e por caminho próprio. O gesto `mic-modo` faz UMA coisa — `machine_declare` com a chave `microfone` — e não escreve firmware nem elege canal (a02_con… |
| `a02_controles.py:1673` | Apagado porque o volume deste alto-falante ainda é desconhecido: o DualSense não o publica, e o dae… | Confirmo a absolvição, com a mesma suspeita e a mesma conclusão por medição própria. O som ter saído pelo rádio hoje mexeu na ESCRITA, não na leitura de volta:… |
| `a03_gatilhos.py:603` | Um efeito seu põe o modo com que ele foi guardado. | A ACUSAÇÃO CAI. Confirmei o fato de base — `_opcoes_do_pronto` só emite o separador «──── Meus efeitos ────» sob `if meus:` — mas isso não faz a frase mentir. … |
| `aba03.py:1247` | A descrição de cada modo está na lista — passe o mouse por ela antes de soltar o botão, porque solt… | A ACUSAÇÃO CAI, e o próprio acusador a derruba ao escrever «Ela é verdadeira e manda a pessoa pelo caminho pior». Conferi as duas metades: as dezenove <option>… |
| `a03_gatilhos.py:1699` | A cor do plástico deste controle ainda não foi lida. | Absolvição confirmada — por um caminho mais seguro que o do acusador. Ele defendeu a frase dizendo que a cor não chega pelo rádio; o mapa NÃO diz isso: `identi… |
| `aba03.py:1245` | não há o que escolher lá em cima, e é por isso que a fita está esmaecida | Absolvição confirmada, e conferi as DUAS metades, não só a primeira. A fita sai mesmo com class="fita inerte" na página publicada, e a classe tem efeito real —… |
| `aba03.py:1303` | A confirmação dura cerca de um segundo e meio, que foi o tempo que você pediu. | Absolvição confirmada e o número tem dono único: MS_DA_PISCADA = 1500 em hefesto_vivo.py:194, e o único lugar onde 1500 aparece cru no JS traz o comentário apo… |
| `a04_iluminacao.py:458` | Arraste para mudar o brilho da barra deste controle. Ao soltar, a barra acende no brilho novo e o v… | A acusação CAI, e confirmo por medição própria. Fui ao mapa, que é o dono de toda afirmação de transporte: `luz.lightbar.cor@dualsense` tem `cabo_aciona=sim`, … |
| `a04_iluminacao.py:1546` | As luzinhas seguem o número, no padrão do produto: 1 é a do meio, 2 são as duas de dentro, 3 são as… | A acusação CAI. Conferi lâmpada a lâmpada contra a tabela do motor, na ordem física esquerda→direita [L2, L1, centro, R1, R2]: 1=(F,F,T,F,F) é a do meio; 2=(F,… |
| `aba05.py:1257` | Arraste para escolher quanto da vibração que o jogo pede chega a {motor} — de 0 a 100%. Ela MULTIPL… | A acusação cai, e caiu também na minha medição independente. Cada oração tem dono: a faixa 0-100 é `TETO_DO_MOTOR = MOTOR_PCT_MAX = 100`, com `PASSO_DO_MOTOR =… |
| `aba05.py:1768` | <b>Economia</b> 30% · <b>Balanceado</b> 100%, como o jogo pediu · <b>Máximo</b> 150%, mais forte do… | A acusação cai. Fui à fonte do produto: `RUMBLE_POLICY_MULT = {"economia": 0.3, "balanceado": 1.0, "max": 1.5}` — três degraus, três números, e a dica os escre… |
| `aba06.py:2661` | Nenhum atalho de fábrica digita letra — para escrever texto, abra o teclado na tela com o <b>L3</b>. | A acusação cai, e conferi os dois lados por conta própria. Os nove vínculos de fábrica são Meta, PrintScreen, Alt+Shift+Tab, Alt+Tab, o alternador do teclado n… |
| `aba07.py:486` | Esta aba procura os lançadores e emuladores instalados, diz <b>se os controles chegam lá</b>, o que… | A ACUSAÇÃO CAI, e ela se contradiz com a acusação que o próprio acusador marcou VERDADEIRA duas linhas abaixo. Ele mede a frase contra o SELO, mas a frase não … |
| `desenho_dos_lancadores.py:882` | Instalado de outro jeito (um AppImage solto, por exemplo) ele não aparece aqui — e o perfil continu… | A ACUSAÇÃO CAI, e quem a derruba é o fonte da própria busca nova. A docstring de `jogos_locais.e_lancador_de_jogos` lista o que o degrau 2 alcança e termina: «… |
| `a07_lancadores.py:931` | Vou escrever na configuração de {nome} o que faz o jogo enxergar o controle pelo Hefesto. Clique de… | A ACUSAÇÃO CAI pelo critério do estado. No estado em que ela usa esta aba — Hefesto ligado, controle conectado — `ambiente_da_ponte` devolve o `default.env` e … |
| `aba07.py:526` | <b>Nasceu o selo <code>NÃO SEI</code>, e ele é a cura disso.</b> Heroic, Lutris, Flatpak, RetroArch… | A ACUSAÇÃO CAI, e a diferença com a irmã da linha 552 é o cabeçalho. Esta frase não mora numa lista viva: ela está dentro de um bloco cujo título é uma DATA, e… |
| `aba07.py:488` | O que impede é do <b>lançador</b>, nunca do controle — é a linha de inicialização, a exceção do Ste… | Não há acusação a sustentar — o próprio acusador a retirou depois de medir, e refiz a medição por conta própria: confirma. As três coisas nomeadas têm dono viv… |
| `a08_conexoes.py:2346` | O microfone deste controle chega pelo rádio: o DualSense não tem A2DP nem HFP, então o áudio vem em… | A ACUSAÇÃO CAI, e o próprio acusador já a tinha derrubado — confirmo por medição própria. O que a frase NEGA é o APARELHO anunciar perfil de áudio, e isso não … |
| `aba09.py:1009` | O que eu vi: o PipeWire está enxergando os 2 DualSense como saída e entrada. | DERRUBO ESTA. A acusação lê a frase como se ela creditasse o APARELHO, e ela não credita ninguém — ela diz o que o PipeWire ENXERGA. E o que o PipeWire enxerga… |
| `aba09.py:1206` | Tira o serviço da pausa agora. Só acende com a pausa ativa — e ela sobrevive a desligar o computado… | Conferi por conta própria e a frase cumpre as três metades. `travas()` prende "retomar" com a razão escrita sempre que `state["paused"]` é falso — e distingue … |
| `aba09.py:1128` | …precisa fechar a Steam por uns 20 segundos — e com um jogo aberto ele não mexe em nada. | A promessa absoluta é a parte suspeita e é justamente a que a medição salva. `with_steam_closed` chama `steam_game_running()` como PRIMEIRA coisa, antes de `st… |
| `aba10.py:1491` | Pega o jogo que está rodando atrás desta janela e monta a regra — funciona com jogo de qualquer lug… | Refiz a medição por conta própria e a frase fecha nos dois ramos. Com `steam_app_<N>` em foco, grava `steam_game` com o appid; fora da Steam — o caso que a fra… |
| `aba10.py:1530` | O endereço de rádio do controle. É por ele que o perfil reconhece a peça — e ele não muda quando vo… | A afirmação é de transporte, então fui ao dono. A linha `identidade.cracha_nos_dois_transportes` do dualsense traz `cabo_aceita/radio_aceita/cabo_aciona/radio_… |
| `a10_perfis.py:675` | Esta tela não mostra esses campos. | É o caso exato de frase que só aparece num estado em que ela É verdadeira, e o estado é estreito. `exigencia_invisivel` só devolve texto quando o `match` tem a… |
| `topo.html:792` | Cada controle guarda a <b>sua</b> configuração aqui dentro, pelo ID da peça — amanhã, em outra port… | A acusação CAI, e ela cai por três medições. (1) O que a frase AFIRMA é verdade inteira: o perfil guarda, sim, a configuração de cada controle indexada pelo en… |
| `hefesto_vivo.py:203` | A tela parou de responder e foi recarregada. | A acusação já cai por confissão do próprio acusador, que a mediu e escreveu «A frase está certa» — e a medição confere: o depósito do recado vem acompanhado de… |
| `mesa_viva.py:541` | ATIVO | A acusação cai por confissão do acusador e resiste também à novidade de 10/09, que era a única razão para desconfiar dela. O selo tem UM dono (`selo_do_mic`) e… |
| `emulation_actions.py:1338` | Os ajustes estão no lugar, mas o Hefesto não encontrou a placa de áudio de nenhum DualSense neste c… | A acusação cai por dois motivos independentes, e o segundo é o que importa. (1) A frase não alcança tela nenhuma — o próprio acusador diz isso e mesmo assim a … |
| `audio_saida.py:713` | Não há uma saída de áudio única para mandar o som. Pelo rádio o DualSense não publica placa de som … | A acusação cai, e o argumento que a derruba é o MESMO que o acusador usou para salvar a frase da linha 1364 — ele só não o aplicou aqui. O sujeito da oração é … |
| `emulation_actions.py:1360` | Isto vale para o computador inteiro, não para este jogo: não entra no perfil e não mexe na ponte de… | A acusação cai por falta de tela, e o mérito dela também é mais fraco do que parece. Esta frase foi escrita para a JANELA GTK, e dentro daquela janela «aba Con… |
| `secao_controles.py:462` | Traz o microfone deste controle pelo rádio, como no PS5. Ele nasce desligado por privacidade: a pon… | A acusação cai, e a premissa dela tem dois furos. PRIMEIRO: «como no PS5» não é afirmação de paridade de GRAU — é a rota. O PS5 leva o microfone deste mesmo ap… |
| `secao_controles.py:553` | Com o microfone ligado, um controle no rádio troca 260,4 relatórios de entrada por segundo por 170,… | O que o acusador mediu é REAL — `radio_da_mesa.ocupacao_por_adaptador` (:379-386) só soma entrada e áudio de microfone, e o alto-falante pelo 0x35 a 93,75 repo… |
| `audio_saida.py:1364` | Sem placa de som do controle (no rádio o DualSense não publica placa ALSA) | Concordo com o acusador, e a medição confirma: a frase diz «placa ALSA», não «saída de som», e essa palavra é o que a mantém verdadeira depois do 10/09 — o `he… |
| `audio_saida.py:231` | Sem confirmação: o sistema não publica saída de áudio deste controle | Concordo, e o contraste com a linha 1000 é o achado que vale guardar: esta frase diz só o FATO («o sistema não publica saída de áudio deste controle»), nunca a… |


---

## §4 — O QUE ESTA VARREDURA NÃO É

1. **Não é a cura.** Nenhuma frase foi reescrita. Texto de tela é decisão dela,
   e 102 reescritas de uma vez seriam 102 decisões tomadas por quem varreu.
2. **Não cobre o que não é tela.** Comentário, docstring, log e teste ficaram
   de fora por instrução — o alvo é o que a pessoa LÊ.
3. **Não mede o aparelho.** Toda medição desta varredura é de código lido. As
   afirmações sobre transporte foram conferidas contra o
   `docs/data/mapa-controles.csv`, que é o dono delas nesta casa.
