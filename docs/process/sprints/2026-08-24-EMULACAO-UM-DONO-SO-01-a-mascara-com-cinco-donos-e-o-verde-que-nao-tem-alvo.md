---
sprint: EMULACAO-UM-DONO-SO-01
posse:
  E1:
    - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/profiles/schema.py
cria:
bancada: false
depois_de: [ONDA0-Z1, ONDA0-Z2, ONDA0-Z5, ONDA0-Z6, ONDA0-Z7, VPAD-SUSPENSO-MORTO-01]
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/config/
  - src/hefesto_dualsense4unix/app/app.py
  - docs/data/decisoes-dela.csv
---
# EMULAÇÃO — UM DONO SÓ-01 — a máscara com cinco donos, e o verde que não tem alvo

**24/08/2026.** **Onda 5 · Emulação** da leva das onze abas ([SPRINT_ORDER §0.3](../SPRINT_ORDER.md)).
Aba **Emulação** — a **9ª** da tira, não a 8ª: a ordem real do `main_notebook` é
Início, Status, No jogo, Gatilhos, Lightbar, Rumble, Perfis, Sistema,
**Emulação**, Navegação, Configurações.


> **Cabeçalho corrigido em 24/08/2026.** Ele dizia "Onda 6" — número da fila das 19h30 de 23/08, anterior à renumeração das 22h. A ordem viva é a da §0.2/§0.3 do [SPRINT_ORDER](../SPRINT_ORDER.md), e a regra de lá vale aqui: **o número vale pelo NOME DA ABA**.

| | |
|---|---|
| **Grau** | **MEDIDO** nos catorze achados do §2.2 — cada um com arquivo e linha conferidos contra o `HEAD` de 23/08. **DESENHO** na coreografia, no custo e nas frases propostas. |
| **Fecha** | O dono único da máscara; o alarme de divergência ganhando leitor; o aviso antes de derrubar o vpad com o jogo aberto; o microfone que não pinta verde sem alvo nem esconde o preço medido; o cartão que mede o backend errado; as quatro frases de vibração sem transporte; e as duas linhas que a foto desta aba ainda não alcança. |
| **NÃO faz** | Não mede rádio — é trilha dela com o assistente, na mesa do specs (§6). Não conserta a `VPAD-SUSPENSO-MORTO-01` (E15, Onda 12). Não cria o alvo por jogador (é a `MASCARA-POR-JOGADOR-01`; aqui só o consumo). Não toca em nenhuma outra aba — nem a Navegação nem a Sistema, embora dois handlers delas morem neste arquivo (§5). |
| **Depende de** | Onda 2 (Início) entregando o contrato de MARCAR; e as frentes Z1 (a ponte que sabe dizer não), Z2 (o alvo com dono próprio), Z5 (o dado que existe e não chega à tela), Z6 (o portão do specs que olha a TELA) e Z7 (o ambiente presumido). |

---

## 1. O defeito, em uma frase

**Esta é a aba que decide como o jogo enxerga o controle — e é a única do
produto que aplica de imediato o que as vizinhas só marcam, pinta verde num
microfone que ela não mediu, e destrói o controle no meio da partida sem
perguntar, enquanto dois botões da mesma aba, dois centímetros abaixo, recusam
com jogo aberto.**

---

## 2. O que está medido, e o que é hipótese

### 2.1 O que a medição de HOJE derrubou — leia antes de reabrir

Duas afirmações que circulavam sobre esta aba **caíram em 23/08**, e a regra da
casa manda substituir, não empilhar. Quem as reencontrar num relatório antigo
está lendo texto caduco:

| Afirmação caduca | O que mede hoje |
|---|---|
| *"A Steam desta aba enxerga um layout só."* | **Falso desde `f7b54e6`.** `_steam_input_is_on` (`emulation_actions.py:1534`) e `_steam_input_appids_ligados` (`:1567`) chamam `storm_doctor.find_localconfig_vdfs`, que cobre as quatro raízes de `steam_launch_options.RAIZES_STEAM_RELATIVAS:122-125`. Régua: `grep -n "glob(" src/hefesto_dualsense4unix/app/actions/emulation_actions.py` → **duas linhas, e nenhuma é da Steam** (um comentário e o `/dev/input/js*`). |
| *"O retratador nunca chama `install_emulation_tab`, e a foto é o XML cru."* | **Falso desde `3de95ff`.** `scripts/gui-captura/retratar_abas.py:1732` chama `host.install_emulation_tab()`. A foto de 18h15 de 23/08 prova: o cartão diz `054C:0DF2 (DualSense)` e `Sony Interactive Entertainment DualSense Edge Wireless Controller`, não as constantes de Xbox do glade, e o buffer sai `150 (padrão)`. **O que resta é menor e tem causa de desenho — é o E12.** |

O mesmo vale para a divergência de `XDG_CONFIG_HOME` na allowlist do Steam
Input: `storm_doctor._allowlist_path` (`integrations/storm_doctor.py:38`) hoje
delega para `steam_launch_options.steam_input_allowlist_path`, o mesmo do
escritor. **Sobrou a frase**, e é o E7.

### 2.2 Medido por leitura de código, com endereço

Régua declarada: `grep -n` e leitura direta do `HEAD` de 23/08 (`f50043a`), com
a árvore de trabalho limpa em `src/`. Nenhuma mutação, nenhum clique.

| # | O que | Endereço |
|---|---|---|
| 1 | A fita "Ajustes vão para" só é esmaecida na aba Configurações | `app/app.py:1134` — `inativar(nome == ABA_CONFIG)` |
| 2 | A Emulação **aplica** a máscara na hora e nunca toca `_escolha_pendente` | `emulation_actions.py:1304` (`_apply_mode`), `:1332`, `:1340`, `:1347` |
| 3 | O rodapé repõe a marca da Início e dá `return` **antes** do rascunho | `app/actions/footer_actions.py:266-270` |
| 4 | `mascara_divergente` **e** `mascara_divergencias` são publicados e ninguém em `app/` os lê | produtor: `daemon/ipc_handlers.py:2490` e `:2491`; `grep -rn "mascara_divergente" src/hefesto_dualsense4unix/app/ src/hefesto_dualsense4unix/gui/` → **vazio** |
| 5 | `_refresh_gamepad_and_gamemode` recebe o dicionário inteiro e lê só `enabled`/`flavor` | `emulation_actions.py:1220`, ramo em `:1237` |
| 6 | Os três handlers de máscara não consultam `steam_game_running()`; **dois botões da mesma aba consultam** | `:1332`, `:1340`, `:1347` contra `on_emulation_steam_input_disable:1657` (via `:1696`) e `_camadas_worker:1903` (via `:1924`) |
| 7 | O cartão decide o verde por `import uinput` + `os.access("/dev/uinput", W_OK)`; a produção cria por **uhid** | `emulation_actions.py:918-950` contra `integrations/virtual_pad.py:6-11` |
| 8 | `on_emulation_test_device` instancia `UinputGamepad()`, cujo default é `DEVICE_NAME = XBOX360_NAME` | `emulation_actions.py:863`; `integrations/uinput_gamepad.py:56,178,318` |
| 9 | `_VPAD_NAME_PREFIX` descreve um nome que o vpad não publica mais | `emulation_actions.py:98` diz `"Hefesto Virtual"`; `integrations/uhid_gamepad.py:1065` publica `f"DualSense Wireless Controller (Hefesto P{self.player})"` |
| 10 | O teste da contagem alimenta o dublê com o nome caduco | `tests/unit/test_contagem_emulacao_conta_aparelho.py:83,89,169` |
| 11 | `suspend_vpads_for_steam_input` está definida e **não tem um chamador de produção** | definida em `daemon/subsystems/gamepad.py:796`; as outras seis ocorrências em `src/` são comentário ou docstring |
| 12 | `set_mask`/`clear_mask` do registro por jogador: **zero chamadores de produção, 28 funções de teste verdes** | `daemon/subsystems/external_mask.py:320,366`; `grep -rn "\.set_mask(\|\.clear_mask(" src/` → **vazio**; `grep -rn "def test_" tests/unit/test_external_mask.py tests/unit/test_mascara_por_jogador_01.py \| wc -l` → **28**. Os LEITORES existem (`uhid_gamepad.py:1029`, `uinput_gamepad.py:419`) — o registro é lido e nunca escrito |
| 13 | Quatro caminhos desta aba sem **um** teste que os nomeie | `on_emulation_test_device`, `on_emulation_refresh`, `_sync_uinput_card`, `_sync_hotkey_card` → `grep -rl` em `tests/` devolve **0 arquivos** para cada |
| 14 | A dica manda procurar na aba errada | `gui/main.glade:3333` diz *"use a exceção por jogo em 'Steam Input' na aba Emulação"*; o controle é `profile_steam_input_check`, `gui/main.glade:2391`, rótulo **"Este jogo não funciona"**, aba **Perfis** |

E dois números de forma, medidos no mesmo glade:

- **A aba tem ZERO `GtkFrame`** (`sed -n '3006,3620p' … | grep -c GtkFrame` → 0)
  contra **10 no glade inteiro**, e apenas **2** dos 7 blocos de escolha têm
  moldura de qualquer tipo (a classe `hefesto-dualsense4unix-card`, nos dois
  cartões de diagnóstico). Os cinco de baixo são linhas soltas. É o que faz a
  foto ler como outro programa ao lado da Início.
- **O `docs/data/mapa-controles.csv` tem 49 colunas**, e o `LEIA-PRIMEIRO.md`
  diz 47. Não é desta aba, mas é a régua que o E8 usa: quem confiar na contagem
  errada procura a coluna que sustenta a frase no lugar errado.

### 2.3 Medido no mapa de canais — o lastro das frases de tela

Régua: `csv.DictReader` sobre [`docs/data/mapa-controles.csv`](../../data/mapa-controles.csv),
linhas do controle `dualsense`.

| Chave | cabo | rádio | de onde sei (rádio) | o que a célula diz |
|---|---|---|---|---|
| `vibracao.rumble.passthrough` | sim | sim | **`inferido-do-codigo`** | *"Implementado sem gate, mas **NÃO MEDIDO por Bluetooth**. […] o aparelho ainda não confirmou."* A coluna `mordida` admite: *"não desce até o envelope do físico, então nem o cabo nem o rádio são provados de ponta a ponta"* |
| `movimento.giroscopio.jogo` | sim | sim | `medido` | mas com **FURO ABERTO** (`BT-FURO-FINO-01`, defeito 1): `_struct_base` não testa o bit 1 de `report[1]` (`INPUT_FLAG_AUDIO = 0x02`); o pacote de áudio do mic tem o mesmo id `0x31`, o mesmo tamanho e CRC válido — bytes de Opus entrariam como giroscópio. *"Inerte só porque a ponte de mic nasce DESLIGADA."* |
| `audio.microfone` | sim | **`parcial`** | `medido` | preço **MEDIDO**: mic desligado **260,4 Hz** de input; ligado **170,5 Hz** de input **+ 106,2 Hz** de áudio — *"o áudio não abre canal novo, divide a fila"*. E: *"A PONTE NÃO É SEGURA"*, `BT-MIC-GATING-01` **ABERTO** |
| `luz.lightbar.cor` | sim | sim | `medido` | provado em 12/08 com o olho dela, validade 180 dias. **A única das quatro afirmações da dica que tem lastro nos dois transportes** |
| `plataforma.vpad` | sim (`MONTOU`) | sim (`MONTOU`) | — | *"Trocar a máscara é DESTRUIR e RECRIAR o vpad no slot ÚNICO […] R-04 (medido 23/07/2026): recriar com o jogo aberto invalida os handles que ele abriu, e a Steam não reabre o hidraw do vpad do P1"* |

**A dica `emulation_gamepad_hint_label` (`gui/main.glade:3333`) afirma que jogos
com suporte a DualSense "funcionam completos: vibração, giroscópio e lightbar",
sem uma palavra de transporte.** Das três, só a lightbar tem lastro medido nos
dois. É o E8.

### 2.4 O que é HIPÓTESE, e continua sendo

- **A sequência do E1 não foi reproduzida ao vivo.** "Início marca xbox →
  Emulação aplica dualsense → o rodapé repõe xbox e sai" está provada por
  leitura dos três endereços (`app.py`, `emulation_actions.py`,
  `footer_actions.py`), não por clique.
- **Ninguém viu a tela escrever "Ligado" em verde sem placa.** O ramo está lido
  (`_mic_state:1039` → `_MIC_ROTULOS[MIC_LIGADO]` → `#50fa7b`); a janela não foi
  aberta nesta leva.
- **NÃO VERIFICADO se o botão "Ligar" desta aba alcança a ponte de mic por
  Bluetooth.** Medido: ele roda `fix_wireplumber_default_source.sh --enable-mic`
  (`_run_mic:1122`), que escreve drop-ins do WirePlumber — caminho de **sessão
  de áudio**, não de HID. Quem arma o furo do giroscópio é o
  `GerenciadorMicBluetooth`, outro objeto. **Não afirme que este botão arma o
  furo antes de medir** — é a pergunta nº 5 do §6.
- **Não se sabe o que "Testar o controle virtual" faz com o daemon vivo e dois
  vpads de pé.** A suspeita de renumeração de jogador na Steam é hipótese e por
  isso **não** virou tarefa.
- **A bancada mudou debaixo dos batedores.** Às 18h15 de 23/08 havia dois
  DualSense no rádio; às 19h29 e às 20h45, zero. **Nenhum número desta leva
  sobre 2 ou 4 controles é medição viva.**
- **Nada foi mutado.** Os buracos do §2.2 item 13 são ausência de nome no
  `grep` — prova de que não há rede, **não** prova de que a mutação passaria.
  Quem executar E13 confirma isso primeiro, por arrancamento.

---

## 3. A coreografia dos agentes

**Oito agentes.** O que permite o paralelo é a **região do arquivo**: quase tudo
mora em `app/actions/emulation_actions.py` (1945 linhas), e um arquivo com sete
donos ao mesmo tempo é conflito garantido. **Cada agente recebe uma faixa, e a
faixa é o contrato.**

| Faixa | Linhas (no `HEAD` de 23/08) | Dono |
|---|---|---|
| R-A | 90-235 — constantes e classificação do vpad | A7 |
| R-B | 424-486 — as frases do teclado emulado | *bloqueada* (E15) |
| R-C | 743-1000 — install, cartões, "Testar o controle virtual" | A7 |
| R-D | 1001-1175 — microfone | A2 |
| R-E | 1220-1350 — refresh do gamepad, `_apply_mode`, os três handlers | A1 → A4 → A3, **em série** |
| R-F | 1416-1520 — teclado emulado | *decisão dela* (E14) |
| R-G | 1523-1660 — Steam Input | A5 |

### Rodada 1 — quatro agentes em paralelo, faixas disjuntas

| Agente | Faixa / arquivo | Faz | Devolve |
|---|---|---|---|
| **A8-foto** | `scripts/gui-captura/retratar_abas.py`, `emulation_actions.py` R-E (só a extração), `tests/` | **E12 e E13. Vem primeiro** porque produz a régua do aceite dos outros: os dois pintores puros que o E5 vai testar e a foto vai desenhar. Entra na R-E **antes** da Rodada 2 e devolve a faixa. | Os dois pintores puros, o PNG novo, os quatro testes de rede — cada mordida **executada** e colada. |
| **A2-mic** | R-D | E3 e a metade de tela do E4. | Diff + os dois testes + a frase proposta para o estado "sem alvo medido" e para o preço do rádio. |
| **A5-steam** | R-G + `daemon/launch_env.py` | E7 e E9. | O `grep` que prova a cura viva, a mordida de arrancamento sobre `find_localconfig_vdfs`, a substituição das frases caducas, e a frase nova da dica. |
| **A7-uinput** | R-A e R-C | E10 e E11. | Diff + os testes; e o `grep` que prova que nenhum outro lugar do produto usa `_VPAD_NAME_PREFIX`. |

### Rodada 1-bis — em paralelo, mas SEM commitar

| Agente | Faz | Devolve |
|---|---|---|
| **A6-texto** | E8 e E16. Texto novo na tela e ordem de seções → carimbo **estrutural**, precisa do olho dela **antes**. | Um bloco com as frases propostas lado a lado com o texto de hoje, **a linha do mapa que sustenta cada uma**, e a proposta de molduras com a foto de referência da Início. **Não abre o `gui/main.glade`.** Aterrissa na Rodada 3. |

### Rodada 2 — três agentes em SÉRIE na faixa R-E

A ordem é obrigatória: os três mexem no mesmo `_apply_mode` e nos mesmos três
handlers.

1. **A1-dono** — E1 e E2. Unifica a máscara em MARCAR e requalifica a fita.
   Devolve: o diff, o teste da sequência dos três donos, e a **confirmação de
   que o contrato de MARCAR da Onda 2 já está no disco** — se não estiver,
   **para e avisa** em vez de inventar um segundo contrato.
2. **A4-relança** — E6. Só depois que `_apply_mode` tem a forma final.
   Devolve: o diff, o teste com `steam_game_running` dublado em `True`, e a
   pergunta de BT nº 4 do §6 registrada na tela como ressalva.
3. **A3-alarme** — E5. Por último, porque lê o mesmo `state` que os dois
   deixaram, **e porque só existe teste depois que o A8 extraiu o pintor puro**.
   Devolve: o diff, o teste com `state_full` trazendo divergência, e a prova de
   que arrancar o `if` reprova.

### Rodada 3 — depois do olho dela

**A6-texto** aterrissa as frases aprovadas no `gui/main.glade`; **A8-foto** roda
a prova de tela em lote da onda inteira.

**Regra que vale para os oito:** ninguém edita fora da sua faixa. Achou defeito
noutra faixa, **escreve no relatório e não conserta** — a árvore de trabalho é
o que roda, e esta sprint tem sete donos simultâneos.

---

## 4. As tarefas

Dezesseis. Carimbo de classe de tela em cada uma, conforme a D3.

### E1 — Um dono só para a máscara: a Emulação passa a MARCAR

**Onde:** `emulation_actions.py:1304` (`_apply_mode`) e os três handlers
(`:1332`, `:1340`, `:1347`).
**O defeito:** ela marca "Xbox 360" na Início (que só anota), vem aqui e clica
"DualSense (PS)" (que aplica na hora), depois aperta "Aplicar" no rodapé achando
que salva o resto — e o rodapé repõe o xbox e **sai antes** de aplicar o
rascunho das outras abas (`footer_actions.py:266-270`). O clique desta aba é
desfeito em silêncio, e o resto do rascunho não entra.
**O conserto:** a Emulação chama `marcar_escolha` (`home_actions.py:1271`), como
a Início faz em `:2359` e `:2388`, e quem aplica é o rodapé. Ganha-se de graça
o diálogo de relançamento que hoje esta aba pula. A opção barata — `_apply_mode`
limpar a chave de `_escolha_pendente` no `_on_ok` — **não** é a escolhida:
deixa dois modelos de interação vivos para o mesmo valor, que é o defeito que
esta sprint existe para matar.
**A mordida:** teste da sequência de três passos (Início marca `xbox` → Emulação
escolhe `dualsense` → rodapé aplica) exigindo `dualsense` **e** o rascunho das
outras abas aplicado. Arranque a chamada a `marcar_escolha` e o teste reprova
mostrando `xbox`. **Hoje ele reprova antes da cura — colar esse "antes" no
relatório é parte da tarefa.**
**Custo:** ~40 linhas + 2 testes, meio dia.
**Tela:** **estrutural** — muda o que acontece ao clicar. Precisa do olho dela.

### E2 — A fita do alvo para de mentir nesta aba

**Onde:** `app/app.py:1134`.
**O defeito:** com 4 controles ela clica no chip do Jogador 2 no topo, entra
aqui e muda máscara, modo jogo, Steam Input ou microfone. **Nada disso é do
Jogador 2** — tudo age na mesa inteira, e o cabeçalho continua prometendo alvo.
Já medido em [MESA-CHEIA-10](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md),
que nomeia a Emulação com **NÃO** na coluna de honra ao alvo.
**O conserto:** `set_alvo_inativo` passa a valer para a Emulação também, com o
motivo em texto ao lado. O alvo **por jogador** de verdade é a
[MASCARA-POR-JOGADOR-01](2026-08-15-MASCARA-POR-JOGADOR-01-a-decisao-de-14-08-esbarra-na-de-10-08.md)
e não entra nesta sprint — aqui a fita só para de prometer.
**A mordida:** teste que entra em `emulation_box` e exige a fita esmaecida.
Arrancar a Emulação da condição reprova.
**Custo:** ~10 linhas + 1 teste, 1h.
**Tela:** **estrutural** (texto novo). Precisa do olho dela.

### E3 — O microfone não pinta verde sem alvo, e diz o preço que já foi medido

**Onde:** `emulation_actions.py:1039` (`_mic_state`), `:1113`
(`_refresh_mic_status`), `:1141` (`on_emulation_mic_on`).
**O defeito, em duas metades.** (1) `_mic_state` decide entre três estados
olhando **só** a presença de três arquivos em
`~/.config/wireplumber/wireplumber.conf.d/`. Sem nenhuma placa do controle no
sistema, o ramo `MIC_LIGADO` é o mesmo, e a tela escreve **Ligado** em `#50fa7b`
com a dica *"o microfone do controle está livre e com prioridade acima do eco da
saída"*. Verde sobre um alvo que a aba não olhou. (2) O botão "Ligar" avisa
sobre o quirk de USB (`:1141`) e **não diz uma palavra sobre o preço medido**:
`audio.microfone@dualsense`, `radio_ressalva` — *mic desligado 260,4 Hz de
input; ligado 170,5 Hz de input + 106,2 Hz de áudio*. Ligar o microfone custa
35% da taxa de entrada dela, está medido, e a tela cala.
**O conserto:** `_mic_state` ganha um quarto valor para *"não há alvo que este
botão alcance"* — sem verde, botões insensíveis, motivo ao lado; e a frase do
"Ligar" passa a dizer o preço com o número do mapa. A régua do alvo é do agente
A2, e ela **tem de ser declarada** no relatório: se for a presença de placa
ALSA, isso prova que a **rota ALSA** não existe, não que o aparelho não capte.
**A mordida:** teste com nenhuma rota e os drop-ins presentes — hoje devolve
`MIC_LIGADO`, depois tem de devolver o quarto estado. Arrancar a consulta de
alvo reprova. Segundo teste: a frase do "Ligar" contém o número do CSV; mudar o
número no CSV sem mudar a frase reprova (é a Z6 em ação).
**Custo:** ~60 linhas + 2 testes, meio dia.
**Tela:** **estrutural** (estado novo, texto novo). Precisa do olho dela.

### E4 — "Microfone" ganha sobrenome, e a tela diz o que é da MÁQUINA

**Onde:** `gui/main.glade:3492` (o bloco `emulation_mic_box`) e
`profiles/schema.py` (`ProfileMicConfig`).
**O defeito:** a palavra "microfone" nomeia três coisas em três abas e nenhuma
diz de qual **não** está falando. Aqui é **rota de áudio da máquina** (drop-ins
do WirePlumber, `_run_mic:1122`). Em Status/Perfis é `ProfileMicConfig` — volume
de captura, mudo de **firmware**, botão do controle. Em Configurações é o
interruptor da ponte por Bluetooth. Ela ajusta aqui, salva o perfil do jogo, e
na próxima sessão volta ao que estava.
**O conserto:** o rótulo diz de qual microfone se trata, e a linha ganha a frase
de escopo — *isto vale para o computador, não para este jogo*. A decisão sobre
**entrar no perfil** é dela (§9), e não se resolve escrevendo o campo por conta
própria.
**A mordida:** portão de redação que reprova a palavra "microfone" sem
qualificador nas quatro superfícies. Tirar o qualificador de uma reprova.
**Custo:** ~15 linhas + 1 portão, 2h.
**Tela:** **estrutural** (texto reescrito). Precisa do olho dela.

### E5 — O alarme de máscara divergente ganha leitor

**Onde:** `emulation_actions.py:1220` (`_refresh_gamepad_and_gamemode`);
produtor em `daemon/ipc_handlers.py:2490-2501`.
**O defeito:** o jogo está aberto vendo uma máscara diferente da que o perfil
promete. O produto **sabe** — mediu na madrugada de 18→19/08, publica
`mascara_divergente` e `mascara_divergencias` a cada leitura de estado, e o
próprio comentário do daemon diz *"a GUI decide se mostra"*. A GUI não mostra:
`grep -rn "mascara_divergente"` em `app/` e `gui/` devolve **vazio**. Ela fica
com o controle mudo no jogo sem uma linha que explique. É a forma canônica do
defeito mais caro desta casa — a cura escrita e nunca ligada (Z5).
**O conserto:** quando `mascara_divergente` não é `None`, a linha "Gamepad para
os jogos" ganha a frase em laranja nomeando o jogo e as duas máscaras. O
dicionário **já chega inteiro** na função (`:1220`); hoje ela lê `enabled` e
`flavor` e joga o resto fora. A frase mora no pintor puro que o E12 extrai —
não num segundo dono do desenho.
**A mordida:** teste do pintor com `state_full` trazendo divergência exige a
frase. Arranque o `if` e reprova.
**Custo:** ~35 linhas + 2 testes, 2h. **Depende do E12.**
**Tela:** **estrutural**. Precisa do olho dela.

### E6 — Trocar a máscara com o jogo aberto pergunta antes

**Onde:** `emulation_actions.py:1332`, `:1340`, `:1347`.
**O defeito:** ela está jogando, o jogo mostra botões errados, ela clica "Xbox
360" — e o vpad é **destruído e recriado** no slot único. O jogo perde o handle
e o controle morre no meio da partida, sem aviso e sem pergunta. O mapa sabe
(`plataforma.vpad@dualsense`, `cabo_detalhe`): *"Trocar a máscara é DESTRUIR e
RECRIAR o vpad no slot ÚNICO (`daemon/subsystems/gamepad.py:1867` para, `:1892`
cria) […] R-04 (medido 23/07/2026): recriar com o jogo aberto invalida os
handles que ele abriu, e a Steam não reabre o hidraw do vpad do P1"*. E **as
duas vizinhas de classe, na mesma aba, recusam**: `on_emulation_steam_input_disable`
(sonda em `:1696`) e `_camadas_worker` (sonda em `:1924`). O padrão já existe
dois centímetros abaixo, na mesma tela.
**O conserto:** sondar `slo.steam_game_running()` em worker — o padrão pronto de
`:1696` — e ou recusar com motivo, ou chamar `_perguntar_antes_de_relancar`
(`app/actions/base.py:101`), que é o diálogo que a Início já faz e esta aba
pula.
**A mordida:** teste com `steam_game_running` dublado em `True`: o handler não
pode chegar a `apply_mode` sem o diálogo. Arrancar a sonda reprova.
**Custo:** ~45 linhas + 2 testes, 3h.
**Tela:** **estrutural** (diálogo novo). Precisa do olho dela.

### E7 — A cura da Steam ganha a mordida que a segura, e as frases caducas saem

**Onde:** `emulation_actions.py:1534` e `:1567` (curados);
`daemon/launch_env.py:606`; `integrations/storm_doctor.py:38`.
**O que NÃO é mais defeito** (§2.1): os dois leitores desta aba usam
`find_localconfig_vdfs`, e `_allowlist_path` delega para o mesmo resolvedor do
escritor. **Quem reabrir isto está lendo texto de antes de 23/08.**
**O que sobrou, e é real:** (1) a docstring de `steam_input_appids`
(`launch_env.py:606`) ainda diz *"e não do `Path.home()` fixo do
`storm_doctor`"* — afirmação que a cura do mesmo dia derrubou, viva ao lado do
código certo, que é exatamente o defeito que a regra da casa sobre fato errado
existe para matar; (2) **não há prova de que a rede segure a cura para ESTA
aba** — `test_ambiente_presumido_01_a_steam_dos_quatro_layouts.py` existe, e
ninguém verificou se ele morde `_steam_input_is_on`/`_steam_input_appids_ligados`
ou só o `storm_doctor`.
**O conserto:** substituir a frase caduca; e, **se a mordida não morder**,
estender o teste para as duas funções desta aba.
**A mordida:** devolver **uma** das duas funções ao `glob` cravado em
`~/.steam/steam/...` tem de reprovar **nomeando a função**. Se a suíte ficar
verde, a rede tem buraco e fechá-lo é a tarefa.
**Custo:** ~5 linhas + a confirmação, 1h (mais ~25 linhas de teste se o buraco
existir).
**Tela:** não toca a tela.

### E8 — As quatro frases de vibração qualificam o transporte

**Onde:** `gui/main.glade:3318` (tooltip DualSense), `:3325` (tooltip Xbox),
`:3333` (`emulation_gamepad_hint_label`), `:3518` (`emulation_hint`).
**O defeito:** as quatro afirmam que a vibração funciona, sem uma palavra de
transporte, e a dica de `:3333` vai além: *"funcionam completos […] vibração,
giroscópio e lightbar"*. O mapa (§2.3) diz que **das três, só a lightbar tem
lastro medido nos dois transportes**: `vibracao.rumble.passthrough@dualsense`
tem o rádio em `inferido-do-codigo` e a própria célula admite *"NÃO MEDIDO por
Bluetooth […] o aparelho ainda não confirmou"*; o giroscópio tem `medido` com
**furo aberto** declarado. Ela lê na tela, joga no rádio e não vibra.
**O conserto:** as frases qualificam — *"a vibração está provada no cabo; no
rádio o caminho existe e ainda não foi medido"* — ou a medição acontece e o mapa
sobe o degrau, e essa medição é a trilha dela (§6). **As quatro mudam juntas:**
correção pela metade deixa duas versões vivas.
**A mordida:** o portão do specs que a Z6 entrega — o primeiro que lê
`gui/main.glade` — reprova afirmação forte de transporte sem lastro no CSV.
Devolver **uma** das quatro frases ao texto de hoje reprova. **Sem a Z6 esta
mordida não existe**, e a tarefa fica bloqueada: é a dependência mais dura desta
sprint depois da Onda 2.
**Custo:** ~15 linhas de texto, 1h + o olho dela. A medição de rádio é trilha
de BT e não entra no custo.
**Tela:** **estrutural**. Precisa do olho dela.

### E9 — A dica manda para a aba certa, com o nome real do controle

**Onde:** `gui/main.glade:3333`; o controle real é `profile_steam_input_check`,
`gui/main.glade:2391`.
**O defeito:** a dica diz *"use a exceção por jogo em 'Steam Input' na aba
Emulação"*. A linha "Steam Input" **desta** aba só tem "Verificar" e "Desligar
Steam Input" — ela **lê** a allowlist (`_steam_input_excecao_status:1598`) e não
tem como escrever nela. A exceção por jogo chama-se **"Este jogo não funciona"**
e mora na aba **Perfis**. É a instrução mandando para a porta errada, de dentro
da porta errada.
**A mordida:** teste de texto que casa o rótulo do glade do controle citado com
a frase que o cita. Renomear um dos dois sem o outro reprova.
**Custo:** 1 linha + 1 teste, 30min.
**Tela:** **estrutural** (texto reescrito). Precisa do olho dela.

### E10 — O cartão espelha o backend que roda, não o degradado

**Onde:** `emulation_actions.py:918` (`_refresh_emulation_view`) e `:863`
(`on_emulation_test_device`).
**O defeito, em duas metades.** (1) O cartão decide o verde "Gamepad virtual
pronto" com `import uinput` + `os.access("/dev/uinput", W_OK)`. A produção cria
por **uhid** (`integrations/virtual_pad.py:6-11`: *"uinput é o fallback […] o
SDL usa o driver PS5, procura o hidraw, não acha"*). O cartão pode ficar verde
com o jogo sem controle. (2) "Testar o controle virtual" instancia
`UinputGamepad()`, cujo default é `XBOX360_NAME` — cria um nó de máscara **Xbox**
qualquer que seja a máscara viva, **e sem guard de jogo aberto**, ao lado de
dois botões que recusam. E o daemon publica `backend`, `degraded` e
`degraded_motivo`, lidos pela **Início** e pela **Sistema** — nunca pela aba que
existe para falar do gamepad virtual. Quem vier direto para cá vê verde onde a
Início mostraria alarme.
**O conserto:** o cartão espelha `backend`/`degraded_motivo` do `state_full`
(que `_refresh_gamepad_and_gamemode` já recebe e joga fora), e o botão testa o
backend que o daemon vai usar, com a máscara viva e com o guard do E6.
**A mordida:** `state_full` com `backend="uinput"` e `degraded=True` — o cartão
não pode dizer "pronto". Arrancar a leitura do `backend` reprova.
**Custo:** ~40 linhas + 2 testes, 3h.
**Tela:** **estrutural**. Precisa do olho dela.

### E11 — `_VPAD_NAME_PREFIX` vira o nome de hoje, e o teste passa a morder

**Onde:** `emulation_actions.py:98` e `:141`;
`tests/unit/test_contagem_emulacao_conta_aparelho.py:83,89,169`.
**O defeito:** a segunda das duas regras que separam "nosso controle" de
"controle de outro programa" está morta. A constante diz `"Hefesto Virtual"`; o
vpad publica `DualSense Wireless Controller (Hefesto P{n})`
(`uhid_gamepad.py:1065`). O nome mudou pela
[BT-E-VPAD-01](2026-08-01-BT-E-VPAD-01-o-que-so-existe-no-cabo-e-os-seis-furos.md)
(furo 1) e a constante ficou com o antigo — com a docstring afirmando que é *"o
nome que o vpad uhid publica no evdev"*. **Ninguém soube porque o teste alimenta
o dublê com o nome antigo.** Hoje a contagem só acerta pela regra do `uniq`; se
um dia o `uniq` faltar, a contagem acusa o vpad do próprio produto de ser da
Steam **e a suíte continua verde**.
**O conserto:** fato errado se substitui — o prefixo vira o nome de hoje (ou
sai, se o `uniq` basta, e então a docstring passa a dizer isso), e o teste passa
a usar o nome que o produto publica.
**A mordida:** arranque a regra do `uniq` e o teste tem de reprovar **pelo
nome**. Hoje não reprova — colar esse "antes" é parte da tarefa.
**Custo:** ~10 linhas + o teste, 1h.
**Tela:** não toca a tela.

### E12 — Os dois rótulos que a foto não alcança ganham pintor puro

**Onde:** `emulation_actions.py:1222-1272` (o `_on_state` interno);
`scripts/gui-captura/retratar_abas.py:1676-1683` (a docstring que declara o
limite).
**O defeito:** a foto desta aba **já é de produção** (§2.1), mas dois rótulos
saem no `—` do glade: *"Gamepad para os jogos:"* e *"Modo jogo:"*. A causa está
escrita pelo próprio script: *"o markup deles nasce dentro do `_on_state` e
copiá-lo aqui criaria um segundo dono do desenho"*. **Não é preguiça do
retratador — é desenho de código.** A linha do Steam Input, ao lado, fotografa
perfeitamente, e a razão é que ela tem `markup_status_steam_input` (`:323`), um
pintor **puro**, de módulo. Consequência medida: quem lê o PNG de 18h15 vê a
tira "DualSense (PS)" realçada com o status ao lado escrito `—`, e pode
reportar uma contradição que não existe.
**O conserto:** extrair `markup_do_gamepad(state)` e `markup_do_modo_jogo(state)`
como funções de módulo, no molde exato do `markup_status_steam_input`. O
`_on_state` passa a chamá-las; o retratador também. **Dividendo:** é o que dá ao
E5 um pintor testável sem GTK, e é por isso que o A8 corre antes da Rodada 2.
**A mordida:** teste que exige que o PNG desta aba **não** contenha os dois
rótulos em `—`; e teste do pintor com estado de bancada. Arrancar a extração
devolve o `—` e reprova.
**Custo:** ~55 linhas + 2 testes, 3h.
**Tela:** **cosmética pré-aprovada** — o texto exibido é o que já existe; muda
só o que a foto alcança. Foto depois, em lote.

### E13 — Os buracos de rede desta aba

**Onde:** `emulation_actions.py:812` (`_sync_hotkey_card`), `:842`
(`_sync_uinput_card`), `:863` (`on_emulation_test_device`), `:780`
(`on_emulation_refresh`); e a chave `emulation_box` no mapa
`app/app.py:_REFRESH_POR_ABA:1012`.
**O defeito:** os dois defeitos com nome próprio que esta aba já pagou podem
voltar sem uma linha vermelha. `grep -rl` em `tests/` devolve **zero arquivos**
para os quatro nomes acima — logo `BUG-EMULATION-HOTKEY-CARD-FIXO-01` e
`BUG-EMULATION-UINPUT-CARD-STALE-01/02` estão sem rede. E `emulation_box` no
mapa de refresh: apagar a chave ressuscita o
`BUG-EMULATION-TAB-NO-REFRESH-01`.
**O conserto:** quatro testes. (1) `_sync_hotkey_card(None)` escreve
`"150 (padrão)"` e `"Não (padrão)"`; com bloco `hotkey` escreve o valor
efetivo. (2) `_sync_uinput_card("dualsense")` escreve `054C:0DF2`;
`_sync_uinput_card(None)` não pode deixar VID de Xbox na tela. (3) entrar em
`emulation_box` chama o refresher da aba. (4) `on_emulation_test_device` sem
`uinput` importável avisa e **não** cria nó.
**A mordida:** tirar o ramo do `"(padrão)"` reprova; apagar a chave do mapa
reprova; devolver a constante de Xbox ao `install_emulation_tab` reprova.
**As três mutações têm de ser EXECUTADAS antes de dar a tarefa por feita** — o
`grep` vazio prova ausência de rede, não que a mutação passaria.
**Custo:** ~70 linhas de teste, 3h.
**Tela:** não toca a tela.

### E14 — O teclado emulado: de quem é a persistência? *(decisão dela)*

**Onde:** `emulation_actions.py:1416` (`_refresh_keyboard_switch`), cuja
docstring é explícita: *"o teclado não tem seção no perfil e quem persiste a
escolha dela é o daemon"*.
**O defeito:** a decisão dela de 18/08 — *"o perfil tem de guardar tudo"* — não
foi executada aqui. Máscara e modo jogo entram no rascunho
(`registrar_modo_no_rascunho`, `registrar_modo_jogo_no_rascunho:576`).
Microfone, Steam Input e teclado emulado **não**. E o teclado tem um gêmeo que
**é** por jogo: o mouse, na aba Navegação. Dois interruptores lado a lado, dois
contratos de persistência, e nada na tela dizendo qual é qual.
**Por que fica bloqueada:** o interruptor **desenha** na aba Navegação
(`keyboard_emulation_toggle`) e **mora** aqui, com um segundo escritor já
registrado (`SEGUNDO-ESCRITOR-01`, `app._REFRESH_POR_ABA`). Mexer num lado sem o
outro cria o terceiro escritor. **É por isso que esta onda vem antes da
Navegação.**
**A mordida (quando destravar):** ida e volta pelo esquema — ajustar o teclado,
salvar, fechar, reabrir, o valor volta. Arrancar o campo do `to_profile`
reprova.
**Custo:** decisão dela primeiro. Seção de teclado no perfil: ~90 linhas + 3
testes, 1 dia.
**Tela:** **estrutural**. Precisa do olho dela.

### E15 — A frase que descreve um estado que o produto nunca alcança *(bloqueada)*

**Onde:** `emulation_actions.py:424` (`descrever_teclado_emulado`), a entrada
`vpad_suspenso_pelo_steam_input`; a função em `daemon/subsystems/gamepad.py:796`.
**O defeito:** a frase *"neste jogo quem entrega o controle é a Steam, e o
controle virtual foi recolhido"* nunca vai aparecer.
`suspend_vpads_for_steam_input` está definida em `:796` e **não tem um chamador
de produção** — as seis outras ocorrências em `src/` são comentário ou
docstring. Quem põe o valor de volta em `False` é chamado normalmente, então o
par de estados mente sempre para o mesmo lado: o produto acha que o vpad nunca
está suspenso.
**O conserto:** não se conserta daqui. Ou nasce o chamador, ou a frase sai da
tela com nota datada. **Não deixar as duas metades vivas.** É a
[VPAD-SUSPENSO-MORTO-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md),
ABERTA, dona declarada = **Onda 12, balde do daemon**.
**Custo:** depende da sprint. Só o lado da tela: ~6 linhas, 30min.
**Tela:** **estrutural**. Precisa do olho dela.

### E16 — Os cinco blocos soltos ganham a moldura da casa

**Onde:** `gui/main.glade:3219-3520` — `emulation_btns`, `emulation_gamepad_box`,
`emulation_gamemode_box`, `emulation_steam_input_box`, `emulation_mic_box`.
**O defeito:** a aba tem **zero `GtkFrame`** contra 10 no glade, e só 2 dos 7
blocos têm moldura de qualquer tipo (os dois cartões de diagnóstico, pela classe
`hefesto-dualsense4unix-card`). Os cinco de baixo são linhas soltas empilhadas,
com quatro assuntos diferentes — máscara, modo jogo, Steam Input, microfone — e
nenhuma separação visual. É o mesmo achado que a aba nova de 22/08 pagou: sem
moldura, a tela **lê como quebrada** ao lado das vizinhas.
**O conserto:** cada bloco de escolha ganha a moldura da casa, com o título do
assunto. **A ordem das seções e o que nasce visível são decisão dela** — o
agente A6 chega com proposta e a foto da Início ao lado, não com o glade
editado.
**A mordida:** teste de estrutura que exige uma moldura por bloco de escolha
nesta página, no mesmo molde do teste que hoje conta as larguras
(`test_contagem_emulacao_largura_do_rotulo.py`). Tirar uma reprova. **E a
mordida da largura vale junto:** o comentário do glade em `:3015-3026` registra
que foi espremer estes blocos que forçou rolagem em TODAS as páginas do
notebook — o teste tem de reprovar se a largura mínima da aba subir.
**Custo:** ~60 linhas de glade + 1 teste, 3h + o olho dela.
**Tela:** **estrutural** (ordem das seções, o que se vê ao abrir). Precisa do
olho dela.

---

## 5. Os ganchos entre abas — o que quebra se alguém mexer sozinho

- **MÁSCARA, cinco donos.** Emulação (**aplica**, `:1304`), Início (**marca**,
  `home_actions.py:2388`), rodapé (aplica a marca e dá `return`,
  `footer_actions.py:266-270`), No jogo (**só ecoa**,
  `app/widgets/painel_no_jogo.py:453-458`) e o registro por jogador
  (`external_mask.py`, **lido e nunca escrito**). O segundo e o primeiro se
  desfazem mutuamente, e o mais velho vence calado. **E1.**
- **INTERRUPTOR DO TECLADO.** Desenha na Navegação, mora aqui (`:1416`).
  **E14 — e é o motivo desta onda vir antes da Onda 10 · Navegação.**
- **"TIRAR O QUE FAZ ENGASGAR".** `on_camadas_engasgo` mora aqui (`:1823`) e o
  botão desenha na aba **Sistema**. Não é defeito, é armadilha — e é por isso
  que a Onda 11 **não roda em paralelo com esta**.
- **MODO JOGO.** O botão daqui suspende mouse **e** teclado, gêmeo dos dois
  interruptores da Navegação. **NÃO VERIFICADO** se a linha do mouse tem o par
  da frase *"em pausa pelo modo jogo"* (`descrever_teclado_emulado:424`).
- **PERFIL.** As duas portas de escrita no rascunho são funções de **módulo**
  porque a Início usa as mesmas. Quem mexer no rascunho mexe nas duas abas.

---

## 6. O que o Bluetooth bloqueia

A trilha de BT é dela com o assistente, na mesa do specs (D2). Esta sprint
**não** planeja medição de rádio. O que ela declara é: **enquanto cada resposta
não existir, a tela não pode afirmar.**

| # | A pergunta | O que a tela NÃO pode dizer até lá |
|---|---|---|
| 1 | O rumble do JOGO chega ao controle físico por Bluetooth? (`vibracao.rumble.passthrough@dualsense`: rádio `inferido-do-codigo`, célula diz *"NÃO MEDIDO por Bluetooth"*) | "a vibração funciona", nos **quatro** lugares do E8 |
| 2 | O microfone tem alguma rota que o botão "Ligar" desta aba alcance? (`audio.microfone@dualsense`: rádio **`parcial`**, `BT-MIC-GATING-01` ABERTO, *"A PONTE NÃO É SEGURA"*) | "Ligado" em verde sem ter olhado o alvo — **E3** |
| 3 | O vpad alimentado por um físico no rádio sobe além de `MONTOU`? (`plataforma.vpad@dualsense` para em `MONTOU` nos dois transportes) | "Gamepad virtual pronto" como afirmação sobre o **jogo** — E10 |
| 4 | Com 4 controles e 3 adaptadores, trocar a máscara derruba quantos vpads? (o R-04 é medição de **slot único**) | aplicar sem dizer quantos jogadores caem junto — E6 |
| 5 | O botão "Ligar" desta aba alcança a ponte de mic por HID? Se alcançar, ele **arma** o furo do giroscópio (`movimento.giroscopio.jogo@dualsense`, `BT-FURO-FINO-01` defeito 1: `_struct_base` não testa `INPUT_FLAG_AUDIO`, e bytes de Opus entrariam como giroscópio) | **nada, até medir** — e é a pergunta que a §2.4 marca como NÃO VERIFICADA. Medido só que o botão escreve drop-ins do WirePlumber |
| 6 | O `keepalive` — medido matando rumble de terceiros por dose-resposta (0,5 s → pulso; 8,0 s → 8 segundos) — interfere no rumble do vpad por rádio? | qualquer promessa de vibração por BT nasce com premissa falsa |
| 7 | O "Modo jogo" e o teclado emulado mudam de comportamento por transporte? (`entrada.emulacao_mouse.gatilhos` e `.analogico`: colunas de cabo e rádio **vazias**) | nada — não há sequer o que divergir. É buraco de **censo**, não divergência |

**Nota sobre o portão, e ela decide o tamanho da frente Z6:**
`scripts/check_paridade_transporte.py` cruza CSV × testes × `specs.html` e **não
lê uma linha de `gui/main.glade` nem de `app/`** (conferido: `grep -n "glade"`
no script → nenhuma ocorrência). Todas as divergências desta tabela passam por
ele sorrindo. **Sem a Z6, esta seção é conselho, não regra — e o E8 não tem
mordida.**

---

## 7. As sprints absorvidas

| Sprint | O que contribui | Morre aqui? |
|---|---|---|
| [MASCARA-01](2026-07-25-MASCARA-01-como-este-controle-aparece-nos-jogos.md) | O vocabulário de máscara e a razão de haver três botões | **Sim**, se E1 e E6 entrarem |
| [BT-E-VPAD-01](2026-08-01-BT-E-VPAD-01-o-que-so-existe-no-cabo-e-os-seis-furos.md) | O furo 1 (o nome do vpad) é a origem do E11 | **Não** — os furos de rádio (o 5, a taxa do Edge) ficam na trilha dela |
| [CONTAGEM-E-COOP-01](2026-07-31-CONTAGEM-E-COOP-01-o-aviso-antes-de-derrubar-tres-jogadores.md) | O aviso antes de derrubar jogadores — é a forma do E6 com a mesa cheia | **Não** — a metade de 4 controles espera a pergunta de BT nº 4 |
| [EMULACAO-NO-JOGO-01](2026-07-29-EMULACAO-NO-JOGO-01-o-r1-troca-de-app-em-vez-de-jogar.md) | O modo jogo e a suspensão de mouse/teclado; alimenta E14 | **Não** — fecha com a Onda 7 (Navegação) |
| [MESA-CHEIA-06](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | O portão contra a marca que mente — precedente direto do E5 e do E8 | **Sim**, se a Z6 entregar o portão que olha a tela |
| [NO-MEU-FUNCIONA-01](2026-08-22-NO-MEU-FUNCIONA-01-o-ambiente-que-o-produto-presume-sem-medir.md) | A forma do vício de bancada; o E7 é a instância desta aba, e ela já foi **em parte curada** em 23/08 | **Não** — cobre cinco abas; aqui morre só a parte da Steam |

**Duas que o briefing desta sprint listava e que o
[SPRINT_ORDER](../SPRINT_ORDER.md) põe noutro lugar** — vale o SPRINT_ORDER, e
esta sprint só toma a fatia de GUI:

- [ENGASGO-VULKAN-01](2026-08-23-ENGASGO-VULKAN-01-sessenta-quadros-por-segundo-e-setenta-engasgos-por-minuto.md)
  → **Onda 12, balde do daemon.** Daqui sai só o reconhecimento de que
  `on_camadas_engasgo` (`:1823`) mora neste arquivo e desenha na Sistema (§5). O
  A/B é **dela**.
- [SEM-MICROFONE-NENHUM-01](2026-08-06-SEM-MICROFONE-NENHUM-01-o-alto-falante-vira-a-entrada-padrao.md)
  → continua **ABERTA na fila**. O E3 e o E4 tocam a mesma superfície, mas a
  política de privacidade que ela pede não se decide numa sprint de aba.

Relacionadas e **não** absorvidas:
[VPAD-SUSPENSO-MORTO-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) (E15),
[MASCARA-POR-JOGADOR-01](2026-08-15-MASCARA-POR-JOGADOR-01-a-decisao-de-14-08-esbarra-na-de-10-08.md),
[MESA-CHEIA-10](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) (E2),
[A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01](2026-08-16-A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01-o-jogo-nao-enxerga-e-a-culpa-nao-e-da-pessoa.md),
[MASCARA-QUE-GRUDA-01](2026-08-22-MASCARA-QUE-GRUDA-01-quatro-perfis-dela-pedem-xbox-e-agora-isso-fica.md),
[STEAM-INPUT-01](2026-07-26-STEAM-INPUT-01-ela-nunca-mais-precisa-decidir.md),
[QUATRO-MICROFONES-01](2026-08-22-QUATRO-MICROFONES-01-a-ponte-esta-desligada-e-a-conta-diz-que-cabe.md),
[ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) (é a Z1),
[ESCONDE-SO-O-HIDRAW-01](2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md).

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
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
python3 scripts/check_paridade_transporte.py
```

**Específico desta onda** — cada linha verde, e cada mordida **executada e
colada** no relatório:

1. **A foto alcança a aba inteira.** `docs/usage/assets/readme_emulacao.png` não
   mostra mais "Gamepad para os jogos: —" nem "Modo jogo: —". Régua: comparar
   com a foto de 23/08 18h15. **É o E12, e ele é pré-requisito do E5.**
2. **A sequência dos três donos.** Início marca `xbox` → Emulação escolhe
   `dualsense` → rodapé aplica → o resultado é `dualsense` **e** o rascunho das
   outras abas entrou. E1.
3. **Nenhum verde sem alvo, e o preço na tela.** A linha do microfone não é
   `#50fa7b` sem alvo medido, e o "Ligar" diz o custo com o número do CSV. E3.
4. **O alarme chega.** `state_full` com `mascara_divergente` produz a frase
   laranja nomeando o jogo e as duas máscaras. E5.
5. **Nada cai no meio da partida sem aviso.** Com `steam_game_running` em `True`,
   os três handlers não chegam a `apply_mode` sem o diálogo. E6.
6. **A cura da Steam tem rede.** Devolver um `glob` cravado a
   `_steam_input_is_on` reprova nomeando a função. E7.
7. **A rede de mordida existe.** Os quatro testes do E13 no disco, e as **três
   mutações executadas** (tirar o ramo do "(padrão)"; apagar a chave do mapa de
   refresh; devolver a constante de Xbox ao install) reprovaram de verdade.
8. **A largura da aba não subiu.** O E16 não pode reintroduzir a rolagem que o
   comentário do glade em `:3015-3026` registra ter custado a todas as onze
   páginas.
9. **As frases passaram pelo olho dela** antes de aterrissar (E3, E4, E8, E9,
   E16), e as **dezesseis** tarefas estão carimbadas.

**Prova de tela, conforme a D3:** *cosmética pré-aprovada* — **E12** — fecha com
foto **depois**, em lote. *Estrutural* — **E1, E2, E3, E4, E5, E6, E8, E9, E10,
E14, E15, E16** — **não fecha** sem o olho dela **antes**. *Não toca a tela* —
**E7, E11, E13** — fecha só com os portões.

---

## 9. O que fica aberto, e de quem é

**Dela, e nada aqui anda sem a palavra:**

1. **O modelo de interação da máscara.** O E1 propõe *"a Emulação também MARCA,
   e o rodapé aplica"*. A alternativa barata (limpar a chave pendente) deixa
   dois modelos vivos. **Escolha dela.**
2. **O que é do PERFIL e o que é da MÁQUINA**, item a item: microfone-de-rota,
   Steam Input global, teclado emulado. E4 e E14 **propõem** que os dois
   primeiros sejam da máquina e o teclado do perfil — proposta, não decisão.
3. **As frases e a ordem das seções** (E3, E4, E8, E9, E16) — o texto exato e o
   que nasce visível.
4. **A medição de rádio.** As sete perguntas do §6 são a trilha dela com o
   assistente. Nenhuma tarefa desta sprint tenta respondê-las.

**De outra onda:**

5. **A `VPAD-SUSPENSO-MORTO-01`** (E15) — Onda 12, balde do daemon. Bloqueia o
   texto desta aba.
6. **A `MASCARA-POR-JOGADOR-01`** — o alvo por jogador de verdade, e o
   **escritor** que falta ao `external_mask` (§2.2 item 12). O E2 só esmaece a
   fita; não a faz obedecer. **Enquanto não houver escritor de produção, os 28
   testes verdes desse registro são a forma exata do F2 desta casa.**
7. **A frente Z6** — sem ela o E8 não tem mordida, e o §6 inteiro é conselho.

**Não verificado, e continua não verificado:**

8. O que "Testar o controle virtual" faz com o daemon vivo e dois vpads de pé.
9. Se o botão "Ligar" desta aba alcança a ponte de mic por HID — e portanto se
   ele arma o furo do giroscópio (§6, pergunta 5).
10. Se a linha do mouse na Navegação tem o par da frase *"em pausa pelo modo
    jogo"* que o teclado tem.
11. Se há sprint desta aba entre as que estão fora do `SPRINT_ORDER.md` com nome
    que não bate nos filtros usados na varredura (nome de arquivo,
    `grep -rl emulation_actions`, e o próprio SPRINT_ORDER). O censo com duas
    réguas é o balde 0 da Onda 12.

---

*A aba promete escolher **como o jogo enxerga o controle**. Hoje ela é a única
que aplica o que as vizinhas marcam, a única que fala do gamepad virtual sem
olhar o gamepad virtual que roda, e a única que derruba quatro jogadores sem
perguntar — dois centímetros acima de dois botões que sabem recusar. Um dono só,
e o verde só quando há alvo.*
