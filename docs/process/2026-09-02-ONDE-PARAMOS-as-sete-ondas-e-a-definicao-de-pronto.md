# ONDE PARAMOS — as SETE ondas, materializadas para quem assumir

**Escrito na madrugada de 01→02/09/2026, a pedido dela**, com estas palavras:

> *"ao menos pode materializar e orientar um claude code orquestrador e po igual
> vc? pra caso a conversa caia?"*

**ESTE DOCUMENTO EXISTE POR UM DEFEITO DE PROCESSO, e ele é meu.** Durante o dia
inteiro o trabalho foi organizado em "blocos" — *bloco 2*, *bloco 3*, *bloco 4*,
*bloco 5* — e **essa numeração só existiu na conversa**. Quando ela perguntou
"e a onda 5?", eu não consegui recuperar o que era o bloco 5: o `rg` por
`BLOCO 5` em `docs/` devolve zero. Uma fila que mora só no contexto de um
assistente morre no primeiro `/clear`, e foi exatamente o que ela previu.

**A regra que isso deixa:** fila combinada com ela vira ARQUIVO no mesmo dia.
Não no fim da leva — no dia.

---

## 0. SE VOCÊ ESTÁ CHEGANDO AGORA: os cinco comandos

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
source .envrc-voo                          # PYTHONPATH desta árvore
git log --since=midnight --format='%h %s'  # o que a casa fechou hoje
git add -A && bash scripts/portoes.sh      # os 30, ~2 min
git worktree list                          # o que há em voo
bash scripts/hefesto-chave.sh estado       # o que está instalado na máquina dela
fazer_grafos                               # (re)constrói o índice de código, ~1 min
```

**EXISTE UM GRAFO DE CÓDIGO**, construído em 02/09/2026: `.code-review-graph/`,
com 1405 arquivos, 32.596 nós e 227.832 arestas. Ele responde "quem chama isto"
e "que teste cobre isto" em segundos, e o servidor MCP de consulta só sobe com
ele presente. É DERIVADO (`.gitignore:128`) — reconstrua com `fazer_grafos` em
vez de versionar. **Ele não substitui MEDIR**: diz quem chama quem, não se o
produto faz.

**A ÁRVORE MUDOU DE NOME EM 01/09.** Não existe mais `-dev`: esta pasta é o
produto. A antiga virou `…-estavel` e é onde o `.git` compartilhado mora — as
worktrees dos agentes nascem sob ela, e isso confunde todo agente novo. Ver §6.

---

## 1. O ESTADO, medido em 01/09/2026 às 23h

| o quê | estado |
|---|---|
| branch | `dev`, árvore limpa, 50 commits hoje |
| portões | **30 verdes** |
| instalação | `install.sh --yes` → **rc=0**, doctor sem falha, **zero aviso falso** |
| unit do daemon | `enabled active`, apontando para a venv desta árvore |
| atalho | `Exec=…/interface.sh` → a interface HTML |
| DKMS | `hid-nintendo`, `hid-playstation` e `rtw88-usb` **installed** no kernel em uso |
| BlueZ | 5.86 (o nosso backport), **zero crash em 14 dias de journal** |

### O que fechou hoje, e que muda o chão de quem chega

1. **O `-dev` saiu de tudo** — identidade, chave, instalador, lançador. O
   `interface.sh` dela estava **quebrado** (procurava o piloto numa pasta que
   não existe) e o `.venv/bin/activate` apontava para a pasta antiga.
2. **O `install.sh` abortava no passo 3g desde 31/08** (`rc=127`, um `#` colado
   num nome de função). Em dois dias, nenhuma execução completa passou dali —
   então tudo abaixo do 3g nunca tinha sido exercitado junto.
3. **Cinco mentiras do instalador**, curadas com régua. A mais cara: uma cadeia
   em que `hefesto-chave off` + `install.sh` **apagavam a unit do daemon dela**
   (o `cp -f` seguia a máscara do systemd para dentro do `/dev/null`, `rc=0`,
   calado).
4. **`| grep -q` sob `pipefail`** — devolve 141 quando ACHA. Segunda vez que
   esta casa paga por essa forma; agora tem régua que cresce sozinha.
5. **O `rtw88-usb` voltou a valer**, revalidado para o kernel em uso.
6. **O eleitor do microfone elegia o que a régua ao lado proibia** — quatro
   camadas, com o veredicto dependendo do relógio.
7. **O teto da vibração por controle** entrou pela onda de agentes.

---

## 1-bis. O QUE É "PRONTO" — a definição dela, e ela NÃO estava escrita

Perguntada em 02/09/2026, e a resposta é de três partes:

> *"a ideia é o que temos no gtk + os ajustes pra comportar a nova infra + as
> features não desenvolvidas"*

**ISTO NÃO ESTAVA EM LUGAR NENHUM ANTES DESTE PARÁGRAFO.** É o mesmo defeito dos
"blocos": a definição de pronto vivia na conversa. Aqui ficam as três partes,
com o INVENTÁRIO MEDIDO de cada uma — para que "quanto falta" deixe de ser
opinião.

### PARTE 1 — o que o GTK já tem

**MEDIDO em 01/09/2026, por handler de IPC do daemon** (a única régua justa: a
interface nova não chama `app/actions/`, ela fala IPC):

| | alcança | dos 39 handlers |
| --- | --- | --- |
| GUI GTK antiga | 30 | **77%** |
| interface nova | 30 | **77%** |

Empate no total, e os conjuntos DIFEREM em quatro para cada lado:

- **só o GTK alcança:** `gamepad_emulation_set`, `mouse_emulation_set`,
  `led_player_set`, `launch_env_refresh` — **é esta a lista do que falta portar**,
  e os dois primeiros são grandes (modo Xbox e emulação de mouse);
- **só a nova alcança:** `daemon_resume`, `lightbar_reset`, `plugin_list`,
  `plugin_reload`;
- **nenhum dos dois:** `controller_target_set`, `native_mode_set`,
  `keyboard_emulation_set`, `mouse_emulation_restore`, `debug_player_leds`.

**CUIDADO COM A CONTA ERRADA:** medir "quantas funções de `app/actions/` a
interface nova chama" dá **10%** e não significa nada — são 155 funções que eram
os handlers da JANELA GTK, não capacidades do produto. A interface nova tem os
handlers dela em `interface/pacotes/`. Foi a primeira conta que eu fiz, e estava
medindo a coisa errada.

### PARTE 2 — os ajustes para a nova infra

**A INTERFACE ESTÁ EM 36%, e não nos 77% que eu disse antes.** Ela viu e
cobrou, com as telas na mão:

> *"basicamente todas as telas são mockups e estão com informações incorretas ou
> desatualizadas ou não integradas de fato."*

**A MEDIÇÃO CERTA — 02/09/2026.** Dos 103 `data-campo` das dez abas, o pacote da
aba ESCREVE **37**. Os outros 66 mostram o valor cravado no HTML do mockup:

| aba | campos | o produto escreve | |
| --- | --- | --- | --- |
| `03-gatilhos` | 25 | **1** | **4%** |
| `09-sistema` | 10 | 2 | 20% |
| `05-vibracao` | 9 | 2 | 22% |
| `10-perfis` | 3 | 1 | 33% |
| `04-iluminacao` | 12 | 6 | 50% |
| `01-jogar` | 11 | 6 | 55% |
| `06-navegacao` | 7 | 4 | 57% |
| `02-controles` | 12 | 7 | 58% |
| `08-conexoes` | 11 | 8 | 73% |
| `07-lancadores` | 3 | **0** | **0%** |
| **TOTAL** | **103** | **37** | **36%** |

E **120 dos 183 campos do HTML nascem com valor cravado** — é o que aparece
quando o produto não escreve por cima.

**O QUE ISSO PRODUZ NA TELA DELA, fotografado em 02/09 com UM controle no cabo:**
a aba Gatilhos mostra `P2·Starlight Blue·BT` com *"Arma semi-automática"* e
*"Stop hard"*, enquanto o cabeçalho da MESMA tela diz `1 controle: 1 USB · 0 BT`.
A Iluminação mostra P2 com cor e brilho. **Uma tela que mostra o desenho como se
fosse o aparelho mente para quem está com o controle na mão** — e é pior que
tela vazia, porque não há como perceber.

**POR QUE O NÚMERO ANTERIOR ESTAVA ERRADO, e a lição vale para a próxima
medição:** o 77% contava handlers de IPC cujo NOME aparece no código da
interface. Presença de string não é funcionamento. O mesmo vale para os "44 de
62 gestos com dono": ter dono é ter função registrada, não é a função fazer o
que o botão promete.

**A RÉGUA QUE FALTA, e ela é a primeira coisa a construir:** um portão que, com
o daemon vivo e a mesa real, reprove quando um campo continua exibindo o valor
do mockup. Hoje nada acusa isso — foi ela quem viu.

### PARTE 3 — as features não desenvolvidas

1. **O microfone como eleição** — Onda 1, em voo.
2. **O perfil guardando tudo, por aba e por controle** — Onda 7, abaixo.
3. **Modo Xbox e emulação de mouse na tela nova** — os dois handlers que só o
   GTK alcança.
4. **`novo-hub`** — espera palavra dela.
5. **Os graus de evidência do `specs.html`** — Onda 3.

---

## ONDA 7 — O PERFIL GUARDA TUDO, POR ABA E POR CONTROLE · não despachada

Pedido dela, 02/09/2026:

> *"a ideia é cada perfil, salvar cada config de cada aba, e dentro de cada
> perfil, cada controle poder salvar as sua config específica e isso ser
> lembrado na próxima jogatina."*

**O DESENHO JÁ EXISTE E FUNCIONA PELA METADE.** O `Profile` tem
`controllers[uniq]`, e o teto da vibração que entrou hoje é exatamente esse
padrão: grava no override do controle, com o `uniq` NORMALIZADO como chave.

**MEDIDO no esquema, em 02/09/2026:**

| | campos |
| --- | --- |
| `Profile` (global) | 17 — `priority`, `triggers`, `leds`, `rumble`, `key_bindings`, `button_actions`, `mouse`, `teclado_emulado`, `mic`, `speaker`, `mode`, `suppress_desktop_emulation`, `ponte`, `controllers`, e os de identidade |
| `ControllerOverrides` (por controle) | **4** — `leds`, `triggers`, `rumble`, `speaker` |

**As NOVE seções que ainda são só globais:**

```
priority   key_bindings   button_actions   mouse   teclado_emulado
mic        mode           suppress_desktop_emulation              ponte
```

**O trabalho da onda, e ele NÃO é "criar nove campos":** para cada uma das nove,
decidir se ela FAZ SENTIDO por controle, e a resposta honesta vai ser "não" em
algumas. `mode` (Hefesto/Xbox/Steam Input) por controle provavelmente sim;
`priority` do perfil, não. Cada "não" tem de ficar escrito com a razão, ou a
próxima pessoa reabre.

**As três armadilhas desta onda, todas já pagas nesta casa:**

1. **A chave é o `uniq` NORMALIZADO.** `d4:2f:…` onde o disco guarda `d42f…`
   cria um segundo dono para o mesmo controle. Há régua (`test_o_gatilho_
   guardado_vai_para_o_controle.py`).
2. **Nada mudou, nada grava.** Um `profile.switch` no meio de uma partida não é
   de graça.
3. **Seção nova no `Profile` quebra os portões de perfil**, que exigem
   classificação: `SecaoDireta`, `ISENTOS` com razão, e
   `_SECOES_OPCIONAIS_OMITIDAS_QUANDO_NONE` para compatibilidade para a frente.
   Foi o que custou seis reprovações quando o `button_actions` nasceu.

**Como medir o progresso desta onda:** o número que importa é
`ControllerOverrides` saindo de 4 campos, e cada seção que NÃO for por controle
tendo a razão escrita.

---

## 2. AS DECISÕES DELA, verbatim — não reinterprete

> *"esse projeto já não é mais o -dev é o projeto em si. Não quero mais esse
> tipo de confusão."* · *"não quero traço dessa mudança."*

> *"tipo tudo tem que apontar pro nosso lancher html e tudo tem que apontar pros
> arquivos na nossa pasta"*

> *"qualquer problema legado precisa ser corrigido. Se não por voce bota um <!-- noqa-acento: citação literal dela — a grafia não se corrige; o FATO sim -->
> agente pra ir corrigindo."*

> *"isso é claramente um erro de idempotencia e planejamento. deixe o projeto
> mais inteligente."*

**A DECISÃO DO MICROFONE, e ela é a maior do dia:**

> *"Se eu apertar o botão fisico mic do controle e ele acender, significa que eu <!-- noqa-acento: citação literal dela — a grafia não se corrige; o FATO sim -->
> quero que o canal de audio do microfone seja o controle. O botão de silenciar
> é confuso e mexendo com ambos os canais de audio é péssimo."*

> *"Conseguimos inverter isso e fazer minha ideia funcionar. As pessoas precisam
> ter um aviso visual que o mic tá funcionando. já fizemos isso antes. com 4
> pessoas com controle na mão localmente isso é necessário."*

> *"garantimos um mic virtual com um canal específico pra ele funcionar. é assim
> no dualsense no ps5 e o fable e eu testamos e isso é viável."*

<!-- noqa-acento: citações literais — a grafia não se corrige; o FATO sim — se caducar, apaga e substitui -->

**Sobre o microfone padrão, ela fechou assim:** *"na ausência de um é o outro"* —
com a webcam desconectada, o mic do controle ser o padrão do sistema **não é
defeito, é escassez**. Não "curar" isso.

---

## 3. AS SETE ONDAS

### ONDA 1 — O MIC VIRA ELEIÇÃO · **EM VOO**

`wf_01bb9c2c-3c4`. Cinco lentes de leitura → plano → execução em worktree → três
auditores adversários → corretivo → validador.

**O contrato:** o botão do mic deixa de ser "mudo" e passa a **eleger** o canal
daquele controle; o LED **inverte** e vira aviso de vida (aceso = este mic está
no ar); cada controle tem canal próprio, mesa de até quatro; vale nos dois
transportes e nos dois modos; a tela mostra quem está vivo.

**O que a torna construível, e foi medido hoje:**

- `mute_button_led` é campo **separado** do report de saída (offset 8/9/11),
  autorizado por `valid_flag1` bit 0. **Acender não muta.**
- Existe `DS_OUTPUT_VALID_FLAG1_RELEASE_LEDS` (0x08) — devolução de posse — que
  o driver define e **nunca usa**.
- O daemon **já publica** `audio.mic_mudo` por controle, de `status[1]` BIT(2),
  com a disciplina de CRC do jack.
- A ponte de BT já é por controle (`bt_mic.py`), com orçamento de banda medido.
- No cabo, cada DualSense publica placa ALSA própria.

**A proibição que não se reabre:** NÃO escrever o mudo do FIRMWARE. Recusado
três vezes com medição (BT-E-VPAD-01, MIC-BT-DONO-01, MIC-DOIS-DONOS-01), e a
recusa está em `docs/data/mapa-controles.csv`, campo `nota`: *"NÃO REPROPOR sem
derrubar as três"*. O LED é outra coisa e ESSE pode.

**Quando voltar:** leia o `validacao` do resultado — ele foi encarregado de
dizer, em lista curta, **o que ela vai VER de diferente ao apertar o botão**. Se
não conseguir dizer, a onda não entregou.

---

### ONDA 2 — OS QUATRO LEGADOS · 3 agentes cada, ainda não despachada

A forma pedida por ela: *"talvez 3 agentes por área legada problemática"* — uma
leva menor e mais precisa, não um fan-out grande.

| área | agente 1 | agente 2 | agente 3 |
|---|---|---|---|
| **install/uninstall** | mede a simetria completa: tudo que o install CRIA × tudo que o uninstall REMOVE, nos dois sentidos | caça `\|\| true` que engole falha com a linha seguinte declarando "feito" | escreve as réguas dos dois achados |
| **áudio/WirePlumber** | audita o resto do laço: `--disable-source`, `--reset-only`, `--nunca-dorme` | confere se o `doctor.sh` e o `fix_wireplumber…` concordam em TODO veredicto sobre o mesmo estado | as réguas |
| **DKMS/kernel** | aplica o ritual de rebase (§`patch/BASELINE`) ao `hid-nintendo` e ao `hid-playstation` — só o `rtw88` foi revalidado | confere os CRCs dos três contra o `Module.symvers` do kernel alvo | as réguas |
| **BT** | cura o watchdog que loga 720 linhas/dia sobre um dongle ausente | audita se as redes ainda fazem sentido no 5.86 (zero crash em 14 dias) — o que fica, o que vira cinto e suspensório | as réguas |

**Já achado e não curado (entra na área de BT):** o
`hefesto-bt-health-watchdog` roda a cada 2 min e imprime duas linhas sobre bonds
de um adaptador **que não está plugado**. O diagnóstico dele está CERTO
(conferi: 2 adaptadores vivos, 3 pastas de bond) — o defeito é ele repetir para
sempre em vez de dizer uma vez.

---

### ONDA 3 — O `specs.html` E OS GRAUS DE EVIDÊNCIA · não despachada

Ela perguntou: *"veja o arquivo specs tá bom?"*. Medido:

- 308 linhas, 50 colunas, **37 de áudio**. Regenera **byte a byte igual** a
  partir do `mapa-controles.csv` — o conteúdo está íntegro.
- **O cheiro está no carimbo:** o arquivo versionado foi gerado às 02:32 de uma
  árvore **suja** (`14 mudanças`) numa branch `dev-gtk` **que não existe mais**.
  Ela mandou NÃO regerar (*"então volta"*), e a razão é boa: 7 MB de pesquisa de
  agente moram em `docs/process/pesquisas/`, e ela não quer nada esbarrado ali.
  **Regerar não perde nada** — provei com o diff de 2 linhas —, mas a decisão é
  dela e está tomada.
- **O trabalho de verdade são os GRAUS.** As três linhas que a Onda 1 usa:

  | linha | cabo | rádio | grau |
  |---|---|---|---|
  | `audio.microfone` | aciona | parcial | rádio `medido`, cabo `inferido-do-codigo` |
  | `audio.microfone.mudo` | aciona | parcial | rádio `medido` |
  | `luz.led_microfone` | aciona | aciona | **os dois `inferido-do-codigo`** |

  Ninguém nunca **acendeu o LED e olhou**. Isso é medição de aparelho, com o
  controle na mão dela — e a Onda 1 vai precisar dela para fechar.

---

### ONDA 4 — OS BOTÕES SEM DONO · não despachada

Ela deixou dito: *"mandamos agentes depois que os daqui retornarem. aí
otimizamos a rota com base no retorno que tivermos."* Os que sobraram estavam em
**19** quando a contagem foi feita; refaça a contagem antes de despachar — a
onda do teto da vibração fechou alguns.

Como contar: os portões `casa-sabe` e `portao-tem-chamador` são os donos disso.

---

### ONDA 5 — A LUZ QUE NÃO ACENDE, no rádio · sprint já materializada

`docs/process/sprints/2026-09-01-LUZ-NO-RADIO-01-a-prova-que-falta-e-de-aparelho.md`

**Não há código a escrever.** O gesto está ligado, tem régua e as mordidas
reprovam. O que falta é apertar o botão com um controle **no rádio** e ver a
barra de luz voltar a obedecer depois do PS. Ela tinha UM controle, no cabo.

---

### ONDA 6 — A INTEGRAÇÃO FINAL · encomendada por ela, não despachada

As palavras dela:

> *"ao final de todas as 5 ondas, preciso que vc navegue e teste botão a botão.
> aba a aba. como usuario e vendo se os outputs via log funcionam como o <!-- noqa-acento: citação literal dela — a grafia não se corrige; o FATO sim -->
> esperado."*

**Isto NÃO é trabalho de agente em worktree.** É trabalho de quem conversa com
ela, na árvore dela, com o daemon vivo — porque o que se mede é o produto que
ela usa.

**Como se faz, e a ferramenta já existe:**

```bash
# a janela é dirigível por dentro; SEMPRE --oculta (ela tem UMA tela)
.venv/bin/python -u src/hefesto_dualsense4unix/interface/hefesto_vivo.py \
    --oculta --abre 08-conexoes.html --segundos 9 --prova-clique "<gesto>"
```

**O contrato da onda 6**, aba por aba, botão por botão:

1. **A FOTO** — antes e depois.
2. **O CLIQUE** — acionar o que mudou e mostrar a resposta. Botão acrescentado e
   nunca clicado não está entregue.
3. **O LOG** — a saída que ela pediu: o que o daemon respondeu, e se bate com o
   que a tela mostrou.
4. **A MORDIDA** — quebrar a cura de propósito e ver a régua reprovar.

**A armadilha que esta casa já pagou:** o `--prova-gesto` dava verde sobre dois
botões **mortos** (nunca clicava o do microfone nem o do alto-falante). Uma
validação de interface que não cobre o botão novo é uma validação que mente.

E ela tem de viver no TEMPO: uma régua que roda o tique uma vez mede um
INSTANTE. Em 29/08 uma leva introduziu regressão que só aparecia aos **181
segundos**, com 67 testes verdes.

---

## 4. O QUE ESPERA A PALAVRA DELA

| assunto | a pergunta |
|---|---|
| `novo-hub` | a onda de agentes devolveu `viavel: false` — *"a razão não é técnica"*. É decisão dela |
| aba 08 na bancada | pintar campo novo exige `data-campo`/`data-hef-alvo` no gerador; publicar é **ato dela** |
| empacotamento | o `.desktop` tem `X-HefestoNaoEmpacotado=true` enquanto o `Exec=` for caminho de árvore. Entrar em `.deb`/flatpak exige trocar para o console script — decisão dela |
| `rtw88` e o kernel | a cura está ativa; o próximo kernel exige o ritual de sete passos do `patch/BASELINE` |

---

## 5. AS ARMADILHAS DESTE DIA, para você não repetir

1. **Nunca `git checkout --` para desfazer uma mordida.** Já custou trabalho
   três vezes. Guarde cópia no scratchpad e restaure por `cp`.
2. **`git rm --cached -r .`** esvazia o índice inteiro. Eu digitei isso por
   engano hoje; `git reset` salvou. Leia o comando antes do Enter.
3. **Os portões são cegos a arquivo novo.** `git add -A` ANTES.
4. **A janela nasce VISÍVEL por padrão.** Um `run.sh --gui` sem `--oculta` abriu
   janela na tela dela hoje. Sempre `--oculta`.
5. **O `install.sh` reinicia o daemon dela.** Confira se há agente lendo estado
   vivo antes de rodar.
6. **Regenerar arquivo versionado sem ela pedir.** Rodei `gerar-mapa.py` para
   conferir o `specs.html` e ela mandou voltar. Conferir ≠ regravar: use
   `--dry-run` ou gere para o scratchpad.

---

## 6. A ARMADILHA DAS WORKTREES, e ela pega todo agente novo

O `.git` compartilhado mora em `…/hefesto-dualsense4unix-estavel/`, então as
worktrees dos agentes nascem em
`…-estavel/.claude/worktrees/wf_<id>-<n>` — **um caminho que contém `-estavel`
mas não é a árvore estável**.

Pior: **a worktree pode nascer de um commit velho.** Na onda de hoje, uma nasceu
semeada de 21/08, **596 commits atrás de `dev`**, sem `src/…/interface/` e sem
`mockup/` — isto é, sem nada do que o plano descrevia. O agente percebeu e fez
`git reset --hard dev` antes de começar.

**Ponha isto no prompt de todo executor:**

> ANTES DE QUALQUER COISA, confira `git log --oneline -1` e
> `git log --oneline -1 dev`. Se você não estiver na ponta de `dev`, faça
> `git reset --hard dev` na sua branch e DIGA isso no relatório.

E: um agente isolado numa worktree **não consegue** commitar noutra. Se o
enunciado mandar corrigir a worktree X e a sessão estiver na Y, ele tem de criar
a branch a partir da ponta de X e **dizer qual branch se integra**. Aconteceu
hoje: a branch a integrar era `correcao-do-teto-da-vibracao`, não a `-16`.

---

## 7. COMO DESPACHAR UMA ONDA

O molde que funcionou hoje está em
`~/.claude/projects/…/workflows/scripts/o-mic-vira-eleicao-wf_01bb9c2c-3c4.js`:

```
Ler (N lentes em paralelo) → Planejar (1, com schema) → Executar (worktree)
  → Auditar (3 adversários) → Corrigir (só o que provar) → Validar (30 portões)
```

**O que fez a diferença, medido nas duas ondas de hoje:**

- **Dar ao planejador o direito de dizer NÃO.** Duas das três features da onda
  anterior voltaram `viavel: false` — e estavam certas. Um planejador obrigado a
  entregar plano entrega plano ruim.
- **Exigir prova de cada acusação do auditor.** Sem isso o conferente inventa
  achado para parecer útil. E dizer, no prompt, que **aprovar é resposta
  legítima**.
- **Mandar o corretivo PROVAR a acusação antes de corrigir.** Conferente também
  erra, e corrigir defeito que não existe é como se introduz um de verdade.
- **O validador escolhe as PRÓPRIAS mordidas**, não as do executor.
- **Colar a saída LITERAL dos portões.** "Rodei e passou" não é evidência.

---

## 8. A REGRA QUE ESTE DOCUMENTO DEIXA

**Fila combinada com ela vira arquivo no mesmo dia.** A numeração "bloco 2, 3,
4, 5" organizou um dia inteiro de trabalho e não sobreviveu a uma pergunta. O
custo não foi o trabalho perdido — foi ela ter de perguntar "e a onda 5?" para
alguém que não sabia mais responder.
