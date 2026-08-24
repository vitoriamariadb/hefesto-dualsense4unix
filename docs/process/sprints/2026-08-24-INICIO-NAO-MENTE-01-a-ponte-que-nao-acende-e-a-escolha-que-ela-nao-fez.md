# INÍCIO NÃO MENTE-01 — a ponte que não acende, e a escolha que ela não fez

**24/08/2026.** Onda 2 da leva das onze abas — a **primeira tela que a pessoa
vê**, e a dona declarada do MODO e da MÁSCARA.

- **Grau:** MEDIDO na bancada de 23/08 (daemon vivo, ZERO DualSense no sistema,
  comandos colados no §2), com duas leituras de código endereçadas.
- **O que esta sprint fecha:** a aba para de afirmar o que não sabe — a ponte,
  a máscara, a mesa e a pausa —, o rodapé para de jogar fora a recusa do daemon,
  e o "desligar de verdade" ganha a primeira mordida da vida dele.
- **O que ela NÃO faz:** não mede rádio (§6, trilha dela — D2); não constrói o
  alvo por jogador (é a `MASCARA-POR-JOGADOR-01`, outra leva); não mexe na aba
  Emulação nem na No jogo, que **importam o vocabulário daqui** e são ondas
  próprias; não escreve o `SPRINT_ORDER.md`, que tem dono.

**Posição na fila: 2.** Vem logo depois da Onda 0 porque o contrato que ela fixa
— **MARCAR e não aplicar** (D-B do
[SPRINT_ORDER](../SPRINT_ORDER.md), §0.9) — é o que a onda da Emulação vai
obedecer, e porque `_MODE_ITEMS`, `_FLAVOR_ITEMS` e `RECONCILIAR_LABEL` são
importados daqui pela aba No jogo (`app/widgets/painel_no_jogo.py:53-68`, que
documenta a travessia de fronteira como deliberada). Vir depois seria decidir o
contrato quando três abas já o copiaram.

---

## 1. O defeito, em uma frase

**Com nenhum controle na casa, a mesma tela diz, no mesmo instante, que há um
controle conectado com 75% de bateria, que não há controle nenhum, e que o jogo
está recebendo o controle pelo Hefesto** — e o aviso que a acusaria de errado é
sobre uma escolha que ela nunca fez.

---

## 2. O que está medido, e o que é hipótese

### 2.1 Medido na bancada, 23/08, daemon vivo e ZERO DualSense no sistema

Régua declarada: um socket cru contra
`/run/user/1000/hefesto-dualsense4unix/hefesto-dualsense4unix.sock`, chamando
`daemon.state_full` e `controller.list`, sem passar por nenhuma camada da GUI;
e em seguida as **funções puras da própria aba** alimentadas com esse payload.
Nenhum número abaixo vem de leitura de código.

```
daemon.state_full, topo   -> connected=True   transport='bt'  battery_pct=75
daemon.state_full, lista  -> 1 entrada: connected=False, transport=None,
                             player=None, battery_pct=None
controller.list           -> {"controllers":[{"connected":false,
                              "transport":null,"is_primary":false}]}
paused=False  native_mode=False
gamepad_emulation = {enabled:true, flavor:"dualsense", backend:"uhid",
                     mascara_divergente:null, mascara_divergencias:[]}
external=null   active_profile=None   primary_grab_state='pending'
window_detect_backend='xlib'  window_detect_seeing=False
window_detect_reason='sem_conexao_x'  window_detect_healthy=True
```

E o que a aba **renderiza** com esse payload, pelas funções dela:

```
frame Controles -> "Nenhum controle conectado."   (0 cards, filtro OK)
hint jogadores  -> ""                             (correto)
linha da Ponte  -> <span foreground="#50fa7b">pelo Hefesto</span> — o jogo
                   recebe o controle do gamepad do Hefesto, e o vê como
                   DualSense (botões PlayStation).
```

Três vereditos, um payload: o topo diz **conectado, 75%**; o frame diz
**nenhum**; a ponte diz **verde, o jogo está recebendo**. É a Z5 aterrissando
aqui, e é por isso que esta onda **não fecha** sem ela.

**Uma armadilha desarmada, e ela vale registro.** As mesmas funções puras
rodadas sobre a lista CRUA (sem o filtro) devolvem um card `Controle 1` com
subtítulo `?`. Isso **não** é o que a aba mostra: o filtro
`HARM-CARD-FANTASMA-01` (`app/actions/home_actions.py:2135-2144`) já mata a
entrada fantasma, e a cura tem nome e data. Quem medir por função pura sem
reproduzir o filtro produz um achado que não existe.

**O `window_detect` está cego AGORA e o produto se declara são** —
`seeing=False`, `reason='sem_conexao_x'`, `healthy=True`. A caixa desta aba
("Não trocar de perfil sozinho ao abrir um jogo") governa exatamente o
mecanismo que está cego, e não diz uma palavra.

### 2.2 Medido por leitura de código, com endereço

| # | O fato | Onde |
|---|---|---|
| a | **O rodapé recebe a resposta do daemon e a descarta.** `_done(_resultado)` ignora o argumento porque `ao_aplicar` é um callback de ZERO argumentos nos dois chamadores | `app/actions/footer_actions.py:1484`; chamadores em `:403` (`_aplicar_escolha_pendente`) e `:1006` (`_aplicar_o_modo_que_foi_gravado`) |
| b | **`desfecho_da_troca` tem ZERO chamadores de produção.** `grep -rn "desfecho_da_troca" src/` devolve 3 linhas: a `def`, o `__all__` e um comentário. Os únicos consumidores são `tests/unit/test_home_ponte_e_divergencia.py` e o inventário `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | `desfecho_da_troca` em `app/actions/home_actions.py:986` |
| c | **`_home_flavor_pedido` nunca é escrito com valor no produto.** `grep -rn "_home_flavor_pedido *=" src/ tests/` → em `src/` só o nascimento em `:1651` e a limpeza em `:2257`; os únicos escritores com valor são quatro linhas de teste | `app/actions/home_actions.py:1651` e `:2257` |
| d | Consequência de (c): `_mascara_escolhida_por_ela` cai sempre na fonte 2 — `draft.source_mode.gamepad_flavor`, que é **a máscara do PERFIL**. E a frase diz "**você escolheu** X" | `app/actions/home_actions.py:2194` |
| e | **O daemon publica `mascara_divergente` e a janela não tem um leitor.** `grep -rn "mascara_divergente" src/` só acha o escritor | `daemon/ipc_handlers.py:2490` |
| f | **`paused` não existe nesta aba.** `grep -n "paused" app/actions/home_actions.py` → vazio. O daemon publica em dois lugares, e a Emulação já pinta "O Hefesto está em pausa" | `daemon/ipc_handlers.py:1907` e `:2230`; `app/actions/emulation_actions.py:1264` |
| g | **A Início não desenha um único controle externo.** `state["external"]` não é lido aqui; `app/widgets/external_card.py` só é importado por `app/actions/config/secao_controles.py:723`. A contagem "N controles = N jogadores" conta só DualSense adotados | `app/actions/home_actions.py:1068` (`_format_players_hint`) |
| h | **Quatro dialetos para o mesmo fato, na mesma janela.** O card daqui faz `str(transport or "?").upper()` → `USB` / `BT` / `?`; os externos dizem `cabo` / `BT`; a Configurações diz `Rádio em uso`; o mapa de canais diz `cabo` / `rádio` | `app/actions/home_actions.py:1050`; `app/actions/external_controllers.py:164`; `app/actions/config/secao_mesa.py:1514`; [mapa-controles.csv](../../data/mapa-controles.csv) |
| i | **O "desligar de verdade" nunca foi executado por teste nenhum.** `test_home_render_state.py:357` e `:369` **substituem** o método por um lambda; `test_gui_dialogs_theme.py` lê o **texto-fonte** dele com `inspect.getsource` procurando a classe de tema; `test_daemon_toasts_leigo.py` testa outra função, em outro caminho | `app/actions/home_actions.py:2501` |
| j | **A caixa do cadeado é muda quando destravada** — `autoswitch_lock_text` devolve `""` — que é o estado padrão, e é o estado de hoje | `app/actions/home_actions.py:220` |

### 2.3 O que o mapa de canais diz sobre as três promessas da frase do modo

A frase é *"o Hefesto acende as luzes, faz o controle vibrar e dá um jogador
para cada controle"*. Consultado o [mapa](../../data/mapa-controles.csv):

| A promessa | A linha | O que ela diz |
|---|---|---|
| "faz o controle vibrar" | `vibracao.rumble.passthrough@dualsense` | `transporte = só cabo`; rádio em `inferido-do-codigo`; `radio_ressalva`: *"Implementado sem gate, mas NÃO MEDIDO por Bluetooth"* |
| "dá um jogador para cada controle" | `plataforma.slot_jogador@dualsense` | cabo e rádio **os dois** em `inferido-do-codigo`, **sem `teste_que_morde` e sem `mordida`** |
| o mesmo, quando alguém entra ou sai | `combinacao.slot_jogador.estabilidade@dualsense` | `existe = desconhecido`; cabo `parcial` (medido); **rádio inteiramente vazio** |

Os controles dela vivem no rádio. A frase mais importante da aba está apoiada em
três células que ninguém mediu no transporte que ela usa.

### 2.4 A foto, e o que ela nunca mostrou

[readme_inicio.png](../../usage/assets/readme_inicio.png) é de hoje, mas os dois
controles nela são **dublê escrito à mão** dentro do
`scripts/gui-captura/retratar_abas.py` (`_montar_aba_inicio`) — não são a mesa.
Esse dublê não traz `paused`, nem `primary_grab_state`, nem `external`, nem
`steam_input`, nem `draft`. Consequência: **o aviso de grab, a pausa, o card de
externo, a exceção de Steam Input e o banner de divergência nunca foram
fotografados.** A aba tem uma foto do caminho feliz e mais nada.

E a única foto de quatro controles,
[mesa_cheia_inicio.png](../estudos/assets/mesa-cheia/mesa_cheia_inicio.png), é de
**14/08 06h25** (`stat -c '%y'`): dez abas, sem a Configurações e **sem a linha
da Ponte** — anterior à PONTE-NA-TELA-01. O layout de quatro cards da aba de
HOJE nunca foi visto.

### 2.5 O que é HIPÓTESE, e continua sendo

1. Que a fileira de quatro cards **incha** quando algo dá errado (o aviso de
   grab entra dentro do card). É plausível pelo código e **não foi fotografado**
   — é o que a I10 vai medir, não afirmar.
2. Que o `1484 px` de largura pedida com quatro cards, do reconhecimento desta
   onda, continua valendo depois da linha da Ponte e da Configurações. **NÃO
   VERIFICADO** nesta sprint.
3. Que o daemon publica `external` quando há um externo na mesa. Aqui ele veio
   `null` com a mesa vazia, o que não distingue "não há" de "não publica".
4. Que a frase do Modo Nativo ("alguns jogos derrubam o controle") vale por
   rádio. A base é leitura do fonte do SDL, não medição com jogo.

---

## 3. A coreografia dos agentes

**Nove agentes.** O que permite o paralelo é a **faixa do arquivo**: dez das
treze tarefas moram em `app/actions/home_actions.py` (2666 linhas), e um arquivo
com nove donos ao mesmo tempo é conflito garantido. A faixa é o contrato.

| Faixa | Linhas (hoje) | Dono |
|---|---|---|
| R-A | 153-300 — rótulos, `_MODE_ITEMS`, `_FLAVOR_ITEMS`, `autoswitch_lock_text` | A7 |
| R-B | 760-1050 — as funções puras da ponte e da divergência | A6 → A2, **em série** |
| R-C | 1050-1100 — subtítulo do card e contagem de jogadores | A4 |
| R-D | 1640-1800 — montagem dos frames Controles e Sessão | A4 |
| R-E | 1890-2192 — o corpo do `_render_home` | A3 |
| R-F | 2234-2340 — `_render_ponte_e_divergencia` e `_render_home_controllers` | A6 → A2, **em série** |
| R-G | 2420-2600 — handlers, Reconciliar, Sessão | A5 |
| — | `app/actions/footer_actions.py` | A1 |
| — | `scripts/gui-captura/retratar_abas.py` e `tests/fixtures/` | A8 |
| — | só `tests/` | A5, A9 |

### Rodada 0 — sozinho, e antes de todo mundo

| Agente | Faz | Devolve |
|---|---|---|
| **A8-foto** | I10. Vem primeiro porque é a **régua do aceite de todos os outros**: sem fixture que alcance os cinco estados nunca fotografados, a prova de tela desta onda é prova sobre o caminho feliz. | Os PNGs dos estados novos, o diff do fixture, e a lista do que cada estado passou a mostrar. |

### Rodada 1 — cinco agentes em paralelo, faixas e arquivos disjuntos

| Agente | Faixa | Faz | Devolve |
|---|---|---|---|
| **A1-rodapé** | `footer_actions.py` | I1 e I2. É a raiz: sem o desfecho do daemon chegando, I3 e I6 escrevem frase certa sobre fato não apurado. | Diff da assinatura de `ao_aplicar`, os dois chamadores repassando, e a mordida do §5 **executada e colada**. |
| **A3-pausa** | R-E | I4 e I11. As duas são o mesmo defeito de forma — o produto parado ou cego dizendo que está bem. | Diff + os dois testes + o payload vivo do §2.1 virado fixture. |
| **A4-mesa** | R-C, R-D | I5 e I9. | Diff + o teste da mesa mista (2 DualSense + 1 externo) + a tabela dos quatro dialetos com a coluna do mapa ao lado. |
| **A5-sessão** | R-G, `tests/` | I8. Só teste — não toca produto. | Os três testes com a mordida de cada um executada, e a resposta medida à D-F. |
| **A9-mordidas** | `tests/` + módulo novo | I7 e I12. | O teste de coerência das três réguas, o portão do contrato D-B, e o `grep` que prova que nenhuma outra superfície aplica máscara direto. |

### Rodada 1-bis — em paralelo, mas SEM commitar

| Agente | Faz | Devolve |
|---|---|---|
| **A7-léxico** | I13 e a metade de texto do I9. Texto novo na tela → carimbo **estrutural**. | Um bloco com as frases propostas lado a lado com as de hoje, **e a linha do mapa que sustenta cada uma**. Não abre o `gui/main.glade`. Aterrissa na Rodada 3. |

### Rodada 2 — dois agentes em SÉRIE, na faixa R-B/R-F

A ordem é obrigatória: os dois mexem em `_render_ponte_e_divergencia` e nas
funções puras que ele chama.

1. **A6-ponte** — I6. Primeiro, porque a ponte é o veredito mais forte da tela e
   a divergência se pendura nele. Devolve: diff, o teste com o payload de mesa
   vazia, e a **confirmação de que a `VPAD-SUSPENSO-MORTO-01` já fechou** — se
   não fechou, para no ramo 2 e avisa, em vez de escrever frase sobre um flag
   que só anda para `false`.
2. **A2-divergência** — I3. Depois, porque lê o mesmo `state` que o A6 deixou e
   a fonte 1 dele depende do I2 do A1. Devolve: diff, o teste com
   `mascara_divergente` populado, e a prova de que arrancar a leitura reprova.

### Rodada 3 — depois do olho dela

**A7-léxico** aterrissa as frases aprovadas; **A8-foto** roda a prova de tela em
lote da onda inteira.

**Regra que vale para os nove:** ninguém edita fora da sua faixa. Achou defeito
noutra faixa, escreve no relatório e **não conserta** — a árvore de trabalho é o
que roda, e esta sprint tem nove donos simultâneos.

---

## 4. As tarefas

Treze. Carimbo de tela em cada uma, conforme a D3.

### I1 — O rodapé para de jogar fora a recusa do daemon

**Onde:** `app/actions/footer_actions.py:1484` (`_done`), e os dois chamadores
em `:403` e `:1006`.
**O defeito:** `set_gamepad_emulation` devolve **True** para três desfechos
diferentes — apliquei / já estava / **recusei pelo gate R-04** — e o handler
traduz tudo em `status: "ok"`. A resposta chega ao `_done(_resultado)` e é
descartada, porque `ao_aplicar` não recebe argumento nenhum. Com o jogo aberto,
o daemon recusa a troca de máscara e o rodapé diz *"O jogo agora vê: Xbox 360"*.
**O conserto:** `ao_aplicar` passa a receber o resultado; os dois chamadores
repassam; `desfecho_da_troca` e `toast_da_troca_de_mascara` ganham o **primeiro
chamador de produção da vida deles**. As duas entram juntas ou nenhuma entra —
meia cura escreveria a frase certa sobre um desfecho que ninguém apurou. O
inventário `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` já descreve
exatamente esta cura, e diz por que não foi feita: *"muda a assinatura e o texto
que sai na tela dela"*. É esta sprint que traz o olho dela.
**A mordida:** teste com o payload `{"status":"ok","flavor":"dualsense"}` como
resposta a um pedido de `xbox`. O toast **não pode** conter "O jogo agora vê".
Arranque a chamada a `desfecho_da_troca` e o teste reprova.
**Custo:** ~25 linhas + 2 testes, 3 h.
**Tela:** **estrutural** — texto novo em três desfechos. Precisa do olho dela.

### I2 — A escolha dela sobrevive ao próximo tique

**Onde:** `app/actions/home_actions.py:1651` e `:2257`; escritor novo em
`footer_actions.py`.
**O defeito:** `_home_flavor_pedido` é a única memória de um pedido que o daemon
não atendeu — e **ninguém o escreve** (§2.2c). O `_render_home` reescreve o
seletor com o valor do daemon a cada 2 s, então a escolha recusada dela some da
tela em dois segundos, sem uma palavra.
**O conserto:** o "Aplicar" grava `_home_flavor_pedido` quando o desfecho do I1
for **bloqueado** ou **falhou**, e só então. Depende do I1: sem desfecho, não há
o que gravar.
**A mordida:** teste que aplica `xbox`, recebe recusa, roda dois tiques de
`_render_home` e exige o banner ainda de pé. Arranque a escrita e o banner some
no primeiro tique.
**Custo:** ~10 linhas + 1 teste, 1 h.
**Tela:** **estrutural** — muda o que se vê depois de um clique.

### I3 — "Você escolheu" para de acusar sobre gesto que ela não deu

**Onde:** `app/actions/home_actions.py:2194` (`_mascara_escolhida_por_ela`) e
`:840` (`texto_da_divergencia`).
**O defeito:** com a fonte 1 morta (I2), a divergência é medida sempre contra
`draft.source_mode.gamepad_flavor` — **a máscara do PERFIL**. O perfil entra
sozinho pelo autoswitch; a frase diz *"você escolheu Xbox 360"* sobre um valor
que ela nunca clicou. E o daemon já publica o alarme certo, com o nome do jogo
em cena (`daemon/ipc_handlers.py:2490`), **sem um leitor na janela**.
**O conserto:** duas vozes, porque são dois fatos. Gesto dela (fonte 1) mantém
"Você escolheu"; vindo do perfil, a frase nomeia o perfil. E
`gamepad_emulation.mascara_divergente` ganha leitor: quando o daemon aponta o
jogo em cena, a frase o nomeia em vez de falar em abstrato.
**A mordida:** teste com `mascara_divergente` populado — a frase tem de conter o
nome do jogo. Arranque a leitura e ela volta ao texto genérico. Segundo teste:
`draft` com `xbox` e sem gesto dela — a frase **não pode** conter "você
escolheu".
**Custo:** ~35 linhas + 2 testes, meio dia.
**Tela:** **estrutural** — duas frases novas. Precisa do olho dela.

### I4 — A pausa chega à primeira aba

**Onde:** `app/actions/home_actions.py`, faixa R-E (`_render_home`).
**O defeito:** o `_render_home` tem exatamente **dois** estados — daemon vivo e
daemon morto. Com o Hefesto **em pausa** (decisão tomada noutra aba, ou noutra
sessão), o payload continua `connected: true` e a aba pinta o caminho feliz
inteiro: *"o Hefesto acende as luzes, faz o controle vibrar e dá um jogador para
cada controle"*. A Emulação, com o MESMO campo, já escreve "O Hefesto está em
pausa" (`app/actions/emulation_actions.py:1264`).
**O conserto:** um terceiro estado. Regra da casa: sem daemon é "não sei"; em
pausa é "sei, e está parado" — nunca o verde.
**A mordida:** teste com `paused: true` — a descrição do modo não pode conter
"acende as luzes". Arranque a consulta a `paused` e reprova.
**Custo:** ~30 linhas + 1 teste, 3 h.
**Tela:** **estrutural** — estado novo. Precisa do olho dela.

### I5 — A conta da mesa conta quem está na mesa

**Onde:** `app/actions/home_actions.py:1068` (`_format_players_hint`) e a
montagem do frame Controles (faixa R-D).
**O defeito:** a Início não desenha um único controle externo e não lê
`state["external"]` (§2.2g). Com dois DualSense e um 8BitDo na mesa, esta aba
diz "2 controles = 2 jogadores" enquanto a Configurações mostra três cards. O
`ExternalCard` existe e tem um cliente só. É a pergunta dela — *"o produto
funciona com 4 controles ao mesmo tempo?"* — respondida com **não, a primeira
tela nem os enxerga**.
**O conserto:** o frame Controles lista os externos junto, reusando
`app/widgets/external_card.py`, e a contagem diz **quem** conta. A numeração já
é de espaço único entre DualSense, externos e co-op — o dado existe, falta a
tela.
**A mordida:** teste com 2 DualSense + 1 externo no payload. A frase não pode
dizer "2 controles"; o frame tem de ter 3 cards. Arranque a leitura de
`external` e reprova.
**Custo:** ~60 linhas + 2 testes, meio dia.
**Tela:** **estrutural** — cards novos, ordem do frame. Precisa do olho dela.

### I6 — A ponte não acende sobre mesa vazia

**Onde:** `app/actions/home_actions.py:891` (`texto_da_ponte`) e `:2234`.
**O defeito:** medido no §2.1 — com **zero** controle na casa, o frame diz
"Nenhum controle conectado." e a linha logo acima diz, em verde, *"pelo Hefesto
— o jogo recebe o controle do gamepad do Hefesto"*. A função responde sobre o
**vpad**, e a pessoa lê como resposta sobre o **jogo**. É a forma exata do F7
nesta aba: o estado vazio pintado com a cor do estado bom.
**O conserto:** um quarto veredito. O gamepad de pé sem ninguém na mesa não é
verde nem "nenhuma": é "a ponte existe e não tem quem a alimente", com a cor de
aviso. A ordem das cinco perguntas não muda.
**A mordida:** o payload do §2.1 virado fixture — a linha não pode sair
`#50fa7b`. Arranque o ramo da mesa vazia e reprova.
**Bloqueio conhecido:** o ramo 2 (`vpad_suspenso`) fica preso atrás da
[VPAD-SUSPENSO-MORTO-01](2026-08-22-VPAD-SUSPENSO-MORTO-01-metade-da-cura-esta-ligada.md)
— o flag só anda para `false`, então a frase do Steam Input é inalcançável hoje.
O A6 **não** reescreve esse ramo; registra e segue.
**Custo:** ~25 linhas + 2 testes, 3 h.
**Tela:** **estrutural** — veredito novo. Precisa do olho dela.

### I7 — A rede de mordida das três réguas

**Onde:** só `tests/`, mais o fixture do payload do §2.1.
**O defeito:** nenhum teste desta casa reprova quando o topo do `state_full`, a
lista de controles e o `controller.list` discordam — foi por isso que a
divergência sobreviveu até ser medida à mão. E nenhum portão pergunta *"existe
chamador de PRODUÇÃO?"*, que é a forma da mordida que faltou em I1, I2 e I3.
**O conserto:** dois testes. (a) coerência: dado um payload, as três réguas
concordam sobre quantos controles há; (b) chamador vivo: `desfecho_da_troca`,
`toast_da_troca_de_mascara` e a escrita de `_home_flavor_pedido` têm chamador
fora de `tests/`.
**A mordida:** o próprio (b) é a mordida — hoje ele **reprova**, e é isso que se
cola no relatório antes de I1 e I2 entrarem. Para (a): monte o payload vivo e
veja reprovar; depois da Z5, ele passa.
**Custo:** ~80 linhas de teste, 3 h.
**Tela:** **não toca a tela.**

### I8 — O "desligar de verdade" ganha a primeira mordida da vida dele

**Onde:** `app/actions/home_actions.py:2501` (`_on_home_shutdown_clicked`); a
entrega é só `tests/`.
**O defeito:** o botão que para o produto, arma `_user_stopped_daemon` (para a
GUI não o ressuscitar) e tem cura própria contra falso-OK — `rc != 0` desarma o
flag e troca o toast — **nunca foi executado por teste nenhum** (§2.2i). Os três
testes que o citam ou o substituem por lambda, ou leem o texto-fonte dele com
`inspect.getsource`, ou testam outra função. Uma cura de regressão sem mordida é
uma cura que volta.
**O conserto:** três testes — resposta NÃO não faz nada; `rc == 0` arma o flag e
diz "desligado"; `rc != 0` **desarma** o flag e não diz "desligado".
**A mordida:** arranque a linha `self._user_stopped_daemon = False` do ramo de
falha; o terceiro teste tem de reprovar.
**Custo:** ~90 linhas de teste, 3 h.
**Tela:** **não toca a tela.**
**Nota:** a segunda metade do toast de falha manda "tente pela aba Sistema" — o
forte mandando para o fraco, que usa o mesmo mecanismo. É a **D-F**, e é palavra
dela (§9).

### I9 — O card fala a língua da casa

**Onde:** `app/actions/home_actions.py:1050` (`_format_controller_subtitle`) e
`:2322`.
**O defeito:** quatro dialetos para o mesmo fato na mesma janela (§2.2h) — a
Início diz `USB` e `BT`, os externos dizem `cabo` e `BT`, a Configurações diz
`Rádio em uso`, e o mapa de canais, que é o portão, diz `cabo` e `rádio`. Junto
vêm duas palavras que ninguém fora daqui entende: `primário` e *"Grab falhou —
input pode dobrar no jogo"* — jargão de kernel numa tela para quem quer jogar.
**O conserto:** um vocabulário só, o do mapa. E o aviso de grab passa a dizer o
que acontece com ela ("o jogo pode receber cada botão duas vezes"), não o nome
da chamada de sistema que falhou.
**A mordida:** teste que varre os rótulos de transporte das quatro superfícies e
exige o mesmo conjunto de palavras. Arranque a normalização numa delas e
reprova.
**Custo:** ~20 linhas + 1 teste, 2 h. O texto sai na Rodada 3.
**Tela:** **estrutural** — texto reescrito. Precisa do olho dela.

### I10 — A foto passa a alcançar os cinco estados que ninguém viu

**Onde:** `scripts/gui-captura/retratar_abas.py` (`_montar_aba_inicio`) e
`tests/fixtures/state_full_quatro_controles.json`.
**O defeito:** medido no §2.4 — o dublê da foto não tem `paused`, nem
`primary_grab_state`, nem `external`, nem `steam_input`, nem `draft`. Cinco
estados desta aba **nunca foram fotografados**, e quatro deles são justamente os
que I3, I4, I5, I6 e I9 mudam. E a única foto de quatro controles é de 14/08,
sem a linha da Ponte e sem a aba Configurações.
**O conserto:** o dublê passa a aceitar um conjunto de estados nomeados, e a
mesa cheia ganha o card de externo e o aviso de grab. Sai um PNG por estado, em
`docs/process/estudos/assets/`.
**A mordida:** teste que exige que cada estado nomeado produza um PNG
**diferente** do caminho feliz — byte a byte. É a mesma armadilha que a casa já
mediu: em 14/08, nove dos dez PNGs saíram idênticos com a mesa cheia, e o
instrumento era cego por construção.
**Custo:** ~70 linhas + 1 teste, meio dia.
**Tela:** **cosmética pré-aprovada** — foto depois, em lote. Não muda uma
palavra da interface.

### I11 — O cadeado diz quando o mecanismo que ele governa está cego

**Onde:** `app/actions/home_actions.py:220` (`autoswitch_lock_text`), faixa R-E.
**O defeito:** a caixa "Não trocar de perfil sozinho ao abrir um jogo" governa a
troca automática por janela. **Na máquina dela, agora**, essa troca está cega —
`window_detect_seeing=False`, `reason='sem_conexao_x'` — e o produto publica
`window_detect_healthy=True`. Com a caixa desmarcada, que é o padrão, a linha ao
lado é **vazia**: a aba não diz nem que o mecanismo existe, nem que ele parou.
**O conserto:** quando `window_detect_seeing` for falso, a linha fala — o que
não vai acontecer, e que não é escolha dela.
**A mordida:** teste com o payload do §2.1 — a linha tem de estar visível e não
vazia. Arranque a consulta a `window_detect_seeing` e reprova.
**Custo:** ~20 linhas + 1 teste, 2 h.
**Tela:** **estrutural** — texto novo. Precisa do olho dela.
**Nota:** o `healthy=True` mentindo é da **Z7**, não daqui. Esta tarefa faz a
aba parar de calar; não conserta o vigia.

### I12 — O contrato D-B ganha dono, e o portão que o segura

**Onde:** módulo novo em `app/actions/` (o executor escolhe o nome), mais
`tests/`.
**O defeito:** hoje a Início **marca** a máscara e o rodapé aplica; a Emulação
**aplica na hora**; o rodapé depois desfaz o clique da Emulação em silêncio. O
contrato existe na cabeça de quem escreveu e em nenhum lugar do disco — e três
abas o copiam por import de nome privado (`app/widgets/painel_no_jogo.py:53-68`).
**O conserto:** o contrato vira uma linha executável — quem MARCA, quem APLICA,
e o vocabulário (`_MODE_ITEMS`, `_FLAVOR_ITEMS`, `RECONCILIAR_LABEL`) com dono
declarado em vez de nome privado atravessando fronteira de módulo.
**A mordida:** um portão que reprova qualquer superfície da GUI que chame
`gamepad.emulation.set` fora do rodapé. Hoje ele reprova (a Emulação chama), e é
esse "antes" que se cola no relatório — a onda da Emulação o deixa verde.
**Custo:** ~50 linhas + 1 portão, meio dia.
**Tela:** **não toca a tela.**
**Depende de:** a palavra dela na **D-B**. Sem ela, o A9 escreve o portão e o
deixa `xfail` com o motivo — não escolhe por ela.

### I13 — A frase do modo qualifica o transporte *(bloqueada pelo §6)*

**Onde:** `app/actions/home_actions.py`, faixa R-A (`_MODE_DESCRIPTIONS`).
**O defeito:** as três promessas da frase mais importante da aba estão apoiadas
em três células que ninguém mediu no rádio (§2.3), e os controles dela vivem no
rádio.
**O conserto:** a frase qualifica o que não está medido, sem virar juridiquês.
**A mordida:** o portão do I12 estendido — ou a régua de tela da **Z6** — reprova
promessa de tela cujo par no mapa esteja em `inferido-do-codigo` sem `mordida`.
Arranque a linha do mapa e a régua tem de acusar.
**Custo:** ~10 linhas + 1 teste, 2 h.
**Tela:** **estrutural**, e **bloqueada**: o texto exato é palavra dela, e as
perguntas 1 e 2 do §6 têm de estar respondidas — ou a frase sai com ressalva
explícita, que também é decisão dela.

---

## 5. Os ganchos entre abas — o que quebra se alguém mexer sozinho

| O que muda aqui | Quem sente | Por quê |
|---|---|---|
| o contrato MARCAR/APLICAR (I12) | **Emulação** (Onda 9) | ela aplica na hora hoje; o rodapé desfaz em silêncio |
| `_MODE_ITEMS`, `_FLAVOR_ITEMS`, `RECONCILIAR_LABEL` (I9, I12) | **No jogo** | importa os três por nome privado |
| a assinatura de `ao_aplicar` (I1) | **Perfis** | o "Salvar Perfil" percorre o mesmo `_transicao_de_modo` |
| o vocabulário de transporte (I9) | **Configurações**, **Status** | as três dizem o mesmo fato com palavras diferentes |
| a leitura de `mascara_divergente` (I3) | **Emulação** | a onda dela tem tarefa gêmea sobre o mesmo campo — **combinem uma leitura só** |
| o card de externo na mesa (I5) | **Configurações** | o `ExternalCard` passa a ter dois clientes |

---

## 6. O que o Bluetooth bloqueia

A trilha de BT é dela com o assistente, na mesa do specs (D2). Esta sprint
**não** planeja medição de rádio. O que ela declara é: **enquanto a resposta não
existir, a tela não pode afirmar.**

| # | A pergunta | O que a Início NÃO pode dizer até lá |
|---|---|---|
| 1 | A vibração do JOGO chega ao controle por rádio? (`vibracao.rumble.passthrough@dualsense`: `só cabo`, rádio `inferido-do-codigo`, `radio_ressalva` diz "NÃO MEDIDO por Bluetooth") | "faz o controle vibrar", sem ressalva — I13 |
| 2 | Quantos DualSense por rádio o produto sustenta, e com quantos adaptadores? (`plataforma.slot_jogador`: cabo e rádio em `inferido-do-codigo`, **sem mordida**; `combinacao.slot_jogador.estabilidade`: `existe = desconhecido`, rádio vazio) | "dá um jogador para cada controle" como promessa fechada — I13, e a contagem do I5 |
| 3 | O aviso do Modo Nativo é verdade por rádio? (a base é leitura do fonte do SDL, não medição com jogo) | "alguns jogos derrubam o controle" como fato medido; hoje ele acenderia para os dois controles dela |
| 4 | Um externo por rádio entra na conta de jogadores? (`plataforma.vpad@sn30` = `existe: desconhecido`) | somar o externo na frase "N controles = N jogadores" sem qualificar — I5 |
| 5 | A barra de luz obedece por rádio? (duas medições da casa se contradizem) | "o Hefesto acende as luzes" sem ressalva — I13 |

**Nota sobre o portão:** `scripts/check_paridade_transporte.py` cruza CSV ×
testes × `specs.html` e **não lê uma linha** de `gui/main.glade` nem de `app/`.
Todas as cinco passam por ele sorrindo. É a **Z6** que torna esta seção
executável; sem ela, esta tabela é conselho, não regra.

---

## 7. As sprints absorvidas

| Sprint | O que contribui | Morre aqui? |
|---|---|---|
| [APLICAR-VERDADE-01](2026-08-01-APLICAR-VERDADE-01-o-rodape-nao-mente-mais-a-ponte-ainda-mente.md) | O nome desta sprint vem dela: o rodapé parou de mentir, a ponte não. I1 é a metade que faltou | **Sim**, com I1 |
| [AGORA-E-DEPOIS-01](2026-08-08-AGORA-E-DEPOIS-01-o-plano-executavel-da-separacao-dos-dois-tempos.md) | A separação MARCAR × APLICAR, que é o contrato D-B do I12 | **Sim**, se a D-B for respondida |
| [A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01](2026-08-16-A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01-o-jogo-nao-enxerga-e-a-culpa-nao-e-da-pessoa.md) | Por que a máscara errada é indistinguível de defeito do jogo — a razão de I3 existir | **Sim**, com I2 e I3 |
| [MASCARA-QUE-GRUDA-01](2026-08-22-MASCARA-QUE-GRUDA-01-quatro-perfis-dela-pedem-xbox-e-agora-isso-fica.md) | Quatro perfis dela pedem `xbox`; é exatamente a fonte 2 que o I3 desambigua | **Sim**, com I3 |
| [LUGAR-A-MESA-01](2026-08-06-LUGAR-A-MESA-01-tres-controles-ligados-e-um-jogador-so.md) | Três controles ligados e um jogador só — a origem da contagem do I5 | **Não** — a metade de rádio espera a pergunta nº 2 do §6 |
| [MESA-CHEIA-10](2026-08-13-MESA-CHEIA-10-a-fita-que-nao-sabe-em-que-aba-esta.md) | A fita do alvo que não sabe em que aba está; nomeia a Início na tabela de honra ao alvo | **Não** — o alvo é a Z2; aqui morre só a leitura de mesa |
| [O-DESLIGADO-DE-ONTEM-01](2026-08-10-O-DESLIGADO-DE-ONTEM-01-o-produto-inerte-por-decisao-antiga.md) | O produto inerte por decisão de outra sessão — é o I4 e o I8 | **Sim**, se a D-F for respondida |
| [SINAL-DE-JOGO-01](2026-07-31-SINAL-DE-JOGO-01-o-daemon-desiste-do-jogo-antes-do-jogo-acabar.md) | O sinal de jogo aberto, que o `_ha_jogo_aberto_agora` do rodapé relê — premissa do I1 | **Não** — a raiz é do daemon, balde da Onda 12 |
| [NOME-HONESTO-01](2026-08-03-NOME-HONESTO-01-a-tela-chama-de-sony-o-que-o-kernel-ja-sabe-que-nao-e.md) | A tela chamando de uma coisa o que o kernel sabe ser outra — é a forma do I9 | **Sim**, com I9 |
| [MASCARA-POR-JOGADOR-01](2026-08-15-MASCARA-POR-JOGADOR-01-a-decisao-de-14-08-esbarra-na-de-10-08.md) | A máscara por jogador; explica por que o seletor daqui vale para a mesa inteira | **Não** — é leva própria, depois da 0.9.5 |

Relacionadas e **não** absorvidas, porque são de outra onda:
[VPAD-SUSPENSO-MORTO-01](2026-08-22-VPAD-SUSPENSO-MORTO-01-metade-da-cura-esta-ligada.md)
(trava o ramo 2 do I6),
[ESCONDE-SO-O-HIDRAW-01](2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md)
(trava o texto do grab, I9),
[ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) (é a Z1, de
que I1 é a instância desta aba),
[NO-MEU-FUNCIONA-01](2026-08-22-NO-MEU-FUNCIONA-01-o-ambiente-que-o-produto-presume-sem-medir.md)
(é a Z7, de que I11 é a instância desta aba),
[N-IGUAL-A-UM-01](2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md).

---

## 8. O aceite

**Portões da casa** — rodar **depois** do `git add -A`, porque eles são cegos a
arquivo novo:

```sh
git add -A
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
python3 scripts/validar-citacoes-de-linha.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
python3 scripts/check_paridade_transporte.py
```

**Específico desta onda** — cada linha verde, e cada mordida **executada e
colada** no relatório:

1. **A foto alcança os estados novos.** Os cinco estados do I10 produzem PNGs
   diferentes do caminho feliz, byte a byte. **É pré-requisito do aceite dos
   outros**: sem ele, a prova de tela desta onda é prova sobre ficção.
2. **A recusa chega à tela.** Com o gate R-04 recusando, o toast do rodapé não
   contém "O jogo agora vê". I1.
3. **A escolha recusada sobrevive.** Dois tiques de `_render_home` depois, o
   banner de divergência ainda está de pé. I2.
4. **Ninguém é acusado de gesto que não deu.** Com a máscara vinda do perfil, a
   frase não contém "você escolheu"; com `mascara_divergente` populado, ela
   nomeia o jogo. I3.
5. **O parado se declara parado.** `paused: true` → a descrição do modo não
   promete luz nem vibração. I4.
6. **A mesa mista aparece inteira.** 2 DualSense + 1 externo → 3 cards, e a
   frase não diz "2 controles". I5.
7. **A ponte não acende sozinha.** O payload do §2.1 não produz `#50fa7b`. I6.
8. **A rede de mordida existe e mordeu.** O teste de "chamador de produção"
   reprovou **antes** de I1 e I2, e passa depois. I7.
9. **O desligar tem mordida.** Os três testes no disco, e a mutação do
   `_user_stopped_daemon = False` reprovou de verdade. I8.
10. **Um vocabulário só.** As quatro superfícies dizem as mesmas palavras de
    transporte. I9.
11. **O cego se declara cego.** `window_detect_seeing=False` → a linha do
    cadeado fala. I11.
12. **O contrato está no disco.** O portão do I12 existe, e o seu "antes"
    (reprovando por causa da Emulação) está colado no relatório.

**Prova de tela, conforme a D3:** a única *cosmética pré-aprovada* é a **I10** —
fecha com foto **depois**, em lote. As *estruturais* — I1, I2, I3, I4, I5, I6,
I9, I11, I13 — **não fecham** sem o olho dela **antes**. As *não toca a tela* —
I7, I8, I12 — fecham só com os portões.

**Dependências que travam o fechamento:** Z0 (sem host de produção, cinco abas
publicam XML cru e a foto desta não é da tela), **Z5** (o §2.1 é literalmente a
Z5 aterrissando aqui — nenhum item de mesa fecha antes), Z1 (o I1 é a instância
desta aba), Z2 (a fita do alvo continua acesa sobre esta aba enquanto ela não
fechar), Z7 (o I11 aponta o sintoma, a Z7 conserta o vigia), e da Onda 12 a
`VPAD-SUSPENSO-MORTO-01` e a `ESCONDE-SO-O-HIDRAW-01`.

---

## 9. O que fica aberto, e de quem é

**Dela, e nada aqui anda sem a palavra:**

1. **D-B — a máscara: MARCAR ou APLICAR?** O I12 escreve o contrato; qual é o
   contrato é dela. A recomendação do `SPRINT_ORDER.md` é MARCAR em todo lugar.
2. **D-F — ligar e desligar o Hefesto: um dono ou dois?** Hoje o botão daqui,
   quando falha, manda "tente pela aba Sistema" — o forte mandando para o fraco,
   que usa o mesmo mecanismo e vai falhar igual. O I8 mede; quem decide é ela.
3. **As nove frases de tela** (I3, I4, I6, I9, I11, I13) — o texto exato.
4. **A medição de rádio.** As cinco perguntas do §6. Nenhuma tarefa desta sprint
   tenta respondê-las.

**De outra onda:**

5. **A `VPAD-SUSPENSO-MORTO-01`** — o ramo 2 do I6 é inalcançável até ela fechar.
6. **A `ESCONDE-SO-O-HIDRAW-01`** — o texto do aviso de grab (I9) depende do que
   ela concluir sobre o que o jogo continua vendo.
7. **A `MASCARA-POR-JOGADOR-01`** — o seletor de máscara desta aba vale para a
   mesa inteira, e vai continuar valendo depois desta sprint.
8. **O `healthy=True` mentindo** (I11) é da Z7.

**Não verificado, e continua não verificado:**

9. A largura pedida pela fileira de quatro cards **com a linha da Ponte de pé**.
   O número que circula é anterior a 19/08.
10. Se o daemon publica `external` com externo na mesa — aqui ele veio `null`
    com a mesa vazia, e isso não distingue as duas coisas.
11. Se o aviso do Modo Nativo ("alguns jogos derrubam o controle") vale por
    rádio. A base é fonte do SDL, não jogo.
12. Se algum ramo do `_on_home_shutdown_clicked` além dos três do I8 é
    alcançável — o método nunca foi executado, então ninguém sabe.

---

*A primeira tela do produto é a que a pessoa lê antes de saber qualquer outra
coisa. Hoje ela é a mais confiante e a menos apurada: afirma a mesa sem
consultá-la, promete a ponte sem olhar quem a atravessa, acusa uma escolha que
ninguém fez, e desliga o produto por um caminho que nenhum teste jamais
percorreu. Esta sprint não acrescenta uma função — tira as afirmações que não
têm lastro e devolve, no lugar de cada uma, o que o daemon já sabia e ninguém
tinha ido buscar.*
