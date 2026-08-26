# LEVA-3-A — o jogo vivo é evidência: o daemon para de desistir no meio da partida

**26/08/2026.** Nasce da `2026-07-31-SINAL-DE-JOGO-01`, entrega **E4**. A **E5**
(`healthy` → `seeing`) fica de fora por decisão escrita da JANELA-CEGA-01 e da
PROVA-DE-TELA-01: ela muda a cor do controle dela e não entra sem o olho dela.

## O que mudou

**O defeito, e ele é de composição.** `classify` (`daemon/subsystems/game_signal.py`)
tinha três evidências de jogo, e as três dependem da mesma coisa:

| # | evidência | de que ela depende |
|---|---|---|
| 1 | `window_class_current` / idade do carimbo | o detector de janela enxergar |
| 2 | `profile_rule_match` | o detector de janela enxergar |
| 3 | `wrapper_game_running(marker...)` | o jogo ter passado pelo **wrapper** |

Das dez entradas que `_gather_game_signal_inputs` (`daemon/lifecycle.py`)
devolvia, cinco (`marker`, `marker_pid`, `marker_pid_alive`, `exit_marker`,
`exit_pid`) alimentavam a evidência nº 3. **O jogo dela não passa pelo wrapper**
— medido em 31/07 e escrito na sprint —, então sobrava uma perna: o detector
cegar no meio da partida derrubava a autoridade, o produto repintava a barra de
luz e devolvia o controle ao desktop sem nada ter acontecido no jogo.

E havia um segundo caminho para a mesma queda, este independente do detector:
`launch_env.wrapper_game_running` avalia `(moment - marker_epoch) > window_sec`
**antes** de olhar `pid_alive`. Passados os 900 s de `WRAPPER_MARKER_WINDOW_SEC`,
uma partida genuinamente viva deixava de ser evidência **com o pid de pé** — e
partida de 15 minutos é partida curta.

**A cura: a evidência E4 — o PROCESSO do jogo vivo.** Duas linhas de produto, e
nenhuma capacidade nova. É o padrão *"a casa sabe e o produto não faz"* no
estado mais puro que eu vi nesta árvore:

1. `daemon/lifecycle.py`, `_gather_game_signal_inputs`: mais uma entrada,
   `"appid_de_jogo_vivo": steam_game_running_appid()`.
2. `daemon/subsystems/game_signal.py`, `classify`: mais um parâmetro
   (`appid_de_jogo_vivo: int | None = None`, default que preserva todo chamador
   existente) e mais um termo no OR das evidências —
   `ev_processo = appid_de_jogo_vivo is not None and appid_de_jogo_vivo > 0`.

**Por que reusar `steam_game_running_appid` em vez de escrever uma varredura.**
Ela responde exatamente esta pergunta desde 08/08 (RELANCAR-AGORA-01), guarda a
DECISÃO destrutiva de fechar a Steam com jogo aberto (que mataria o jogo dela),
e — o dado que decidiu — **o próprio daemon já a chamava no MESMO tique lento**:
`_sondar_steam_jogo` (ABA-DO-JOGO-01, 10/08) a chama a cada 2 s para a aba da
janela saber se há jogo aberto. O sinal de jogo, rodando no mesmo tique, a
ignorava. Escrever uma segunda varredura teria criado o sexto predicado de "isto
é jogo da Steam" — a divergência que `profiles/steam_app.py` existe para fechar.

**Custo por tique: zero a mais.** A varredura tem memória de 5 s
(`VALIDADE_DA_VARREDURA_S`, BG-03) e as duas chamadas do mesmo tique caem na
mesma foto. A sprint listava "o custo de varrer `/proc`" como risco em aberto da
E4: ele já estava pago desde a PERF-PROC-SCAN-01.

**Por que isto resolve o teto de frescor sem tocar em `launch_env.py`** (que é
leitura-só na minha posse): a varredura **não tem teto**. Enquanto o processo do
jogo estiver vivo, ele é evidência, tenha o marker 20 minutos ou 6 horas. E o
que o teto de 900 s cobria era o **PID RECICLADO** — risco que a varredura não
corre, porque ela lê a cmdline do processo de AGORA em vez de acreditar num
número gravado em arquivo. É o mesmo raciocínio que `autoswitch.jogo_do_wrapper_vivo`
já tinha registrado por outra porta em 18/08, quando mediu um marker de 1.296 s
de idade com o jogo dela rodando.

**Cobertura, dita com precisão:** o wrapper `hefesto-launch` mora nas
*LaunchOptions* da Steam (`WRAPPER_PREFIX`, `%command%`), então todo jogo que
tem marker é jogo lançado pela Steam, e todo jogo lançado pela Steam passa pelo
`reaper SteamLaunch AppId=<id>`. Por isso a E4 cobre **todos** os casos que a
evidência nº 3 cobria, mais os que ela nunca cobriu (o jogo dela, que não passa
pelo wrapper). O que fica de fora está em *"o que sobrou"*.

**O que NÃO conta como jogo, e é contrato, não detalhe:** `steam`,
`steamwebhelper` e `reaper` vivos são a ÁRVORE da Steam. A agulha exige
`SteamLaunch AppId=<dígitos>`, que só existe no launch de um jogo. Isto é o
incidente das 14:42 — o cliente Steam **sem jogo nenhum** escreveu
lightbar/player-LEDs e o daemon passou a defender a cor dele — que criou este
subsistema; uma varredura frouxa o ressuscitaria por dentro da própria cura.
Acrescentei também a recusa de `appid <= 0`: a agulha canônica é
`SteamLaunch AppId=\d`, que casa `AppId=0`, e appid zero não identifica jogo
nenhum.

**Por que não ler `store.steam_jogo_lido`**, que a sonda já publica e sairia de
graça: aquele campo **guarda a última resposta boa** quando a sonda falha. Uma
evidência que não decai prende a autoridade em `game` para sempre — é
literalmente o veto do `window_detect_last_class`, escrito no cabeçalho do
módulo. A varredura, ao contrário, reconfirma o pid a cada pergunta e nunca
devolve um positivo velho (BG-03). Registrei os dois motivos no código, nos dois
arquivos.

## Qual mordida prova

`tests/unit/test_game_signal_processo_vivo.py` — quatro testes, e são um par
espelhado mais dois contrapesos. Todos passam pelo `_gather_game_signal_inputs`
de verdade, com `/proc` sintético (a mesma costura de `test_steam_launch_scan.py`:
`_cmdline_of` + `os.listdir`) e `launch_env_dir` apontado para `tmp_path`.

**Estado 1 — a cura no lugar:**

```
$ python -m pytest tests/unit/test_game_signal_processo_vivo.py -q
....                                                                     [100%]
4 passed in 0.31s
```

**Estado 2 — cura ARRANCADA de `classify`** (`if ev_janela or ev_perfil or
ev_marker:`, sem `ev_processo`):

```
E  AssertionError: jogo vivo com marker vencido tem de continuar sendo evidência — appid_de_jogo_vivo=1599660
E  assert 'daemon' == 'game'
E    - game
E    + daemon
FAILED tests/unit/test_game_signal_processo_vivo.py::test_jogo_vivo_sem_wrapper_e_evidencia
FAILED tests/unit/test_game_signal_processo_vivo.py::test_jogo_vivo_sem_marker_nenhum_e_evidencia
FAILED tests/unit/test_game_signal_processo_vivo.py::test_appid_zero_nao_e_jogo
3 failed, 1 passed in 0.34s
```

**Estado 3 — a ESCRITA PREGUIÇOSA**, que é o outro jeito de errar: a evidência
passa a ser "qualquer processo da árvore da Steam conta" (varredura por
`"steam" in cmd or "reaper" in cmd`). O par espelhado morde do outro lado, e a
mensagem **nomeia os processos** que foram aceitos:

```
E  AssertionError: a árvore da Steam SEM jogo virou evidência de jogo
   (appid_de_jogo_vivo=1599660). A varredura canônica aceitou a cmdline None; o
   /proc deste teste só tinha estes processos, e nenhum deles é jogo:
   ['~/.steam/.../reaper', '~/.steam/.../steamwebhelper --type=utility', '/usr/bin/steam']
E  assert 1599660 is None
FAILED tests/unit/test_game_signal_processo_vivo.py::test_steam_viva_nao_e_jogo
1 failed, 3 passed in 0.33s
```

Os quatro casos:

1. `test_jogo_vivo_sem_wrapper_e_evidencia` — marker com 30 min de idade
   (`WRAPPER_MARKER_WINDOW_SEC + 900`), pid vivo, detector são olhando o
   navegador, nenhum perfil. **O teste prova que a evidência nº 3 está morta**
   antes de afirmar qualquer coisa: chama `wrapper_game_running` com as próprias
   entradas do gather e exige `False`. Sem isso ele estaria medindo outra coisa.
   Depois exige `classify(...) == "game"` **e** que `GameSignal.evaluate` não
   derrube a autoridade com a sessão aberta — o sinal, não só o veredito cru.
2. `test_steam_viva_nao_e_jogo` — vivos só `steam`, `steamwebhelper` e um
   `reaper` **sem** `SteamLaunch AppId=`; sem marker. Exige `daemon`.
3. `test_jogo_vivo_sem_marker_nenhum_e_evidencia` — o cenário dela: marker
   nenhum, jogo vivo num pid que não é o do processo do teste. Força o caminho
   da varredura COMPLETA (o caminho rápido pelo marker não existe aqui).
4. `test_appid_zero_nao_e_jogo` — `appid=0` não vira autoridade; é o contrapeso
   contra uma cura que aceitasse qualquer valor não-nulo.

**Vizinhança conferida** (o novo parâmetro é opcional, mas o gather passa a
devolver uma chave a mais para todo mundo que faz `classify(**inputs)`):

```
$ python -m pytest tests/unit/test_game_signal.py tests/unit/test_game_signal_wiring.py \
    tests/unit/test_sinal_de_jogo_perfil_por_titulo.py tests/unit/test_state_full_game_signal.py \
    tests/unit/test_steam_launch_scan.py tests/unit/test_aba_no_jogo_so_com_jogo_aberto.py \
    tests/unit/test_daemon_acordado_01_bg03_o_pgrep_que_a_janela_forka.py -q
100 passed in 1.59s

$ python -m pytest tests/unit/test_window_detect_diag.py tests/unit/test_doctor_display_authority.py \
    tests/unit/test_janela_cega_01_o_detector_que_adoece.py tests/unit/test_daemon_hang01_external_tick.py \
    tests/unit/test_gatilho_da_cor_no_daemon.py tests/unit/test_modo01_o_modo_jogo_liga_sozinho.py \
    tests/unit/test_verdade01_o_retorno_que_mentia.py tests/unit/test_corretora_final_cross_cutting_20260720.py -q
148 passed in 15.42s
```

## O que NÃO verifiquei

- **Não toquei a bancada, e não vi isto acontecer no aparelho.** A prova de que
  a autoridade para de cair no meio da partida é de teste hermético, com `/proc`
  sintético. O comportamento com o jogo dela aberto, medido no journal
  (`game_signal_transition`), **NÃO foi verificado** — e é o único jeito de
  fechar o aceite que a sprint escreveu.
- **Não medi o custo real por tique depois da mudança.** O argumento de "zero a
  mais" é a leitura do desenho (as duas chamadas do tique caem na mesma foto de
  5 s da BG-03), não um `strace -c` novo. Se a foto expirar entre a chamada da
  sonda e a do sinal, sai **uma** varredura completa a mais em algum tique —
  ~400 `openat`, 4,2 ms, pelo número que a PERF-PROC-SCAN-01 mediu.
- **Não verifiquei jogo lançado inteiramente fora da Steam** (Heroic/Lutris/GOG
  direto, sem atalho na Steam). Pela leitura do código, a E4 é cega para ele: a
  agulha é `SteamLaunch AppId=`. Quem cobre esse caso continua sendo a evidência
  nº 2 (perfil por título/processo), que a SINAL-DE-JOGO-01/E3 já consertou.
- **Não rodei a suíte inteira** (regra da casa; e não é minha). Rodei o meu
  escopo e as duas levas de vizinhança acima, por caminho.
- **Não conferi a interação com o cache entre ARQUIVOS de teste.** O meu arquivo
  tem `invalidar_varredura_de_proc()` autouse nas duas pontas, como manda o
  `test_steam_launch_scan.py`; se outro arquivo deixar foto suja, ela é sempre
  do lado seguro (um negativo velho, nunca um positivo).
- **Não medi o efeito da E4 na histerese de queda.** Quando o jogo fecha, a
  varredura passa a responder `None` em até 5 s (a validade da foto) e daí a
  queda segue a histerese de 30 s de sempre — somam-se, não se multiplicam, mas
  não cronometrei.

## O que sobrou para o próximo

1. **`test_janela_com_titulo_de_outro_app_nao_vira_jogo`** (em
   `tests/unit/test_sinal_de_jogo_perfil_por_titulo.py`, **fora da minha
   posse**) afirma `classify(**inputs) == "daemon"` e agora depende do `/proc`
   REAL da máquina que roda a suíte: com um jogo da Steam aberto, o veredito
   passa a ser `game` — e estará **certo**, porque há jogo. O teste precisa da
   costura de `/proc` sintético que o meu arquivo usa. Verde no CI e verde aqui
   hoje (medido: `steam_game_running_appid()` → `None` nesta máquina agora);
   vermelho na máquina dela se ela rodar a suíte com jogo aberto. **Relato, não
   edito** (R-A).
2. **Fato errado num docstring alheio**, `integrations/steam_launch_options.py`:
   `steam_game_running_appid` e `VALIDADE_DA_VARREDURA_S` afirmam que quem as
   chama a cada 2 s é `lifecycle._sync_game_signal`. Era falso — quem chamava
   era `_sondar_steam_jogo` (ABA-DO-JOGO-01). Ironia útil: **depois desta
   entrega a frase virou verdade**, porque o `_gather_game_signal_inputs` roda
   dentro do `_sync_game_signal`. Fica o registro para quem for reescrever.
3. **`launch_env.wrapper_game_running` continua avaliando o teto antes do pid**
   (`launch_env.py:552-553`). Não mexi: `launch_env.py` é leitura-só na minha
   posse. A E4 tira dele o poder de matar um jogo vivo **lançado pela Steam**;
   um jogo lançado pelo wrapper fora da Steam (se algum dia existir esse
   caminho) continuaria caindo aos 900 s. A cura completa é a de
   `autoswitch.jogo_do_wrapper_vivo`: `window_sec=math.inf` mais corroboração
   por cmdline, que a casa já escreveu uma vez.
4. **A E5 (`healthy` → `seeing`) continua aberta**, e continua sendo dela: ela
   repinta a lightbar e a PROVA-DE-TELA-01 exige o olho dela. A sprint diz
   "E5 depois de E3 e E4" — **as duas já estão no ar agora**, então a
   pré-condição dela está satisfeita.
5. **A sprint `2026-07-31-SINAL-DE-JOGO-01` continua marcada `Status: ABERTA`**
   com a E4 na lista do que falta. Fora da minha posse declarada; quem integrar
   pode fechar o item.
6. **A telemetria da queda (E2 da mesma sprint) não entrou** e continua sendo o
   que separa "o jogo fechou" de "o detector cegou" no journal: as duas ainda
   produzem a mesma linha.

## Portões

**18 dos 19 verdes. O vermelho é ANTERIOR a mim e não é meu arquivo** — regra da
leva: relatar em vez de consertar arquivo alheio.

```
$ git add -A && bash scripts/portoes.sh --rapido
  contrato-ipc ok · citacoes-de-linha ok · mapa-de-canais ok · fatos-de-tela ok
  fala-de-tela ok · caducos ok · palavra-de-tela ok · version-consistency ok
  curvas ok · frases-de-tela ok · paridade-transporte ok · test-data ok
  endereco-de-radio ok · faixa-sintetica ok · colisao-de-sprints ok · icones ok
  packaging-parity ok · glifos ok
  ruff                   VERMELHO rc=1
REPROVOU: 1 vermelho(s) de 19 -> ruff
```

Os três erros do `ruff` são `E501` em **dois arquivos que não estão na minha
posse e que eu não toquei** (`git status` desta árvore lista só os meus três):

- `tests/unit/test_match_sem_caixa_e_sentinel_manual.py:275` (103 > 100)
- `tests/unit/test_o_preset_nao_escolhe_a_mascara.py:63` (135 > 100)
- `tests/unit/test_o_preset_nao_escolhe_a_mascara.py:85` (136 > 100)

Os três nasceram no HEAD da minha base, `c165485c fix(acentuação): as sete
isenções da poda da fábrica` — um `# noqa: acentuacao —` colado no fim de linhas
que já estavam no limite. **Quem for consertar:** o `ruff` também avisa que o
`# noqa: acentuacao` é diretiva inválida para ele (`expected a comma-separated
list of codes`), então quebrar a linha resolve os dois de uma vez.

E o portão de lápides, que a R-B manda rodar (não mexi em lápide nenhuma — não
apaguei símbolo, só acrescentei um parâmetro opcional):

```
$ python -m pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
35 passed in 55.65s
```
