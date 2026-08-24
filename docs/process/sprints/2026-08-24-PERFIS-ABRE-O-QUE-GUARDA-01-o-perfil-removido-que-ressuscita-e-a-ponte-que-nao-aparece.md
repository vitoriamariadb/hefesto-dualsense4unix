# PERFIS — ABRE O QUE GUARDA-01 — o perfil removido que ressuscita, e a ponte que não aparece

**24/08/2026.** **Onda 6 · Perfis** da fila do [SPRINT_ORDER](../SPRINT_ORDER.md)
(7ª contando a Onda 0). Aba **Perfis** — a **7ª** da tira, conferido na foto de
hoje: Início · Status · No jogo · Gatilhos · Lightbar · Rumble · **Perfis** ·
Sistema · Emulação · Navegação · Configurações.

> **Cabeçalho corrigido em 24/08/2026.** Ele dizia **"Onda de aba nº 5"** — número da fila das 19h30 de 23/08, anterior à renumeração das 22h. A ordem viva é a da §0.2/§0.3 do [SPRINT_ORDER](../SPRINT_ORDER.md), e a regra de lá vale aqui: **o número vale pelo NOME DA ABA**.

| | |
|---|---|
| **Grau** | **MEDIDO** em tudo que tem comando ao lado (§2.1 e §2.2): daemon vivo, os 34 perfis dela no disco, leitura de código com endereço e três cruzamentos com o [mapa de canais](../../data/mapa-controles.csv). **DESENHO** na coreografia, nas tarefas e no custo. |
| **Fecha** | Quatro superfícies da mesma janela dizendo coisas diferentes sobre qual perfil está valendo; o carimbo de ponte que dois perfis dela já têm e que a aba não mostra; o Salvar que segura a thread do GTK por mais de um segundo e diz "reaplicado no controle" sem prova, ao lado de um Ativar que já sabe dizer não; a aba ser cega ao alvo enquanto a fita do cabeçalho promete "Ajustes vão para: [1][2][3][4]"; os presets de programa que são os aplicativos desta bancada; 34 perfis numa lista de 320 px sem busca, com ~740 px mortos ao lado; Remover apagando o perfil ATIVO sem uma palavra e deixando `.lock` órfão; e quatro caminhos sem UMA mordida. |
| **NÃO faz** | Não mede rádio (§6 — a trilha é dela com o assistente, na mesa do specs). Não redesenha o editor. Não decide **o que** a pessoa pode editar por controle — esta onda faz o perfil **mostrar** o que já guarda; editar por controle é decisão dela (§9). Não toca nenhuma outra aba além dos quatro leitores do §P1. |
| **Depende de** | **Z4** (dura — é a frente que decide o que o perfil guarda), **Z7**, **Z5**, **Z1**, **Z2**. A redação da caixinha do Steam Input é a **D-D** do SPRINT_ORDER. **Z0 NÃO bloqueia esta aba** — ver a correção 1 abaixo. |

### Três correções ao briefing desta leva, e as três valem tempo de alguém

**1. A foto desta aba NÃO é o XML cru, e o editor NÃO está vazio.** O briefing
diz que "a metade principal desta tela nunca foi vista por ninguém". Ela foi:
`readme_perfis.png` de hoje (18h15) mostra o editor montado e populado — nome,
prioridade, os sete botões do "Aplica a:", o campo do jogo com `404040`, a
caixinha do Steam Input, a lista de "Outros jogos marcados: 3" com os três
botões "Tirar", e a seção "Modo" com os quatro modos. O host existe
(`scripts/gui-captura/retratar_abas.py`, `_montar_aba_perfis`) e é justamente
ele que a onda da Lightbar cita como molde. **Consequência para a execução: a
Z0 não precisa criar host para nós, e a foto desta aba é prova válida desde
já.** Fica UMA pergunta aberta na foto, e ela é para o batedor: a linha
"Pragmata" está selecionada e verde, e o campo **Nome: está vazio**. Ou o host
seleciona sem popular, ou a aba real abre assim. **NÃO VERIFICADO** — §2.3.

**2. O perfil removido NÃO ressuscita.** O nome deste arquivo carrega a
suspeita, e a medição a derruba: `.seeded_presets` e
`.perfis_de_jogo_semeados` existem no disco dela e **respeitam a deleção** por
contrato escrito (`profiles/loader.py:521`, `:803`: *"perfil que ela apagou de
propósito não ressuscita"*). Os dois perfis que ela apagou —
`meu_perfil.json` e `sackboy_nativo.json` — continuam listados na marca e não
voltaram. O que **sobra** de verdade é o resíduo: três `.json.lock` órfãos no
diretório dela, porque `delete_profile` apaga o `.json` e nunca o `.lock`
(§P7). Isso é um número errado do briefing, não decisão medida — e o título
deste arquivo é o único lugar onde ele sobrevive, de propósito, porque o
caminho já foi combinado com as sprints irmãs.

**3. O resolvedor da biblioteca Steam JÁ conhece as quatro raízes.** O briefing
manda auditar "Steam Flatpak". `jogos_locais.pastas_steamapps` importa de
`integrations/steam_launch_options.py:122-125`, que lista `.steam/steam`,
`.local/share/Steam`, `.var/app/com.valvesoftware.Steam/.steam/steam` e
`snap/steam/common/.steam/steam`. E as pastas de `.desktop` foram curadas em
**23/08** pela AMBIENTE-PRESUMIDO-01 (`jogos_locais.py:65-78`, `XDG_DATA_DIRS`
inteiro). **Não há tarefa aqui.** O vício de bancada desta aba é outro, e está
no §P5.

---

## 1. O defeito, em uma frase

**A aba que existe para guardar o que ela decidiu é a que menos mostra o que já
guardou** — o carimbo de ponte que dois perfis dela carregam, o ajuste por
controle que o esquema aceita, e até *qual perfil está valendo agora* ficam
invisíveis aqui enquanto três outras abas da mesma janela respondem "Nenhum".

---

## 2. O que está medido, e o que é hipótese

### 2.1 Medido na bancada, agora (23/08, ~22h; daemon vivo, nada parado, nada clicado)

**Régua declarada:** o `state_full` do daemon lido pela ponte da própria janela,
e os arquivos de `~/.config/hefesto-dualsense4unix/` lidos com `cat`/`ls`.
Nenhuma janela aberta, nenhum byte escrito.

**1. Quatro superfícies, duas respostas, sobre o mesmo fato.**

```
$ .venv/bin/python -c "from hefesto_dualsense4unix.app import ipc_bridge; \
    print(ipc_bridge.daemon_state_full().get('active_profile'))"
None
$ cat ~/.config/hefesto-dualsense4unix/active_profile.txt   # Sackboy
$ cat ~/.config/hefesto-dualsense4unix/session.json         # {"last_profile": "Sackboy"}
```

| superfície | o que ela lê | o que ela diz AGORA |
|---|---|---|
| aba **Perfis** | o DISCO (`perfil_que_ela_ativou` → `resolve_boot_profile`, `profiles_actions.py:466`) | **Sackboy**, em verde e no topo |
| aba **Status** | o daemon (`status_actions.py:2700`: `state.get("active_profile") or "Nenhum"`) | **Nenhum** |
| aba **Início** | o daemon (`home_actions.py:236`) | vazio |
| aba **No jogo** | o daemon (`painel_no_jogo.py:388`) | vazio |

A aba Perfis está **certa** e sozinha: a cura é da PERFIL-ATUAL-01 (10/08) e o
comentário dela já nomeia o caso —
*"não é o `active_profile` do daemon quando ele está vazio, que é o caso VIVO da
máquina dela"*. As outras três nunca receberam essa cura. É o F5 desta leva na
forma mais barata de reproduzir.

**2. O censo dos 34 perfis dela, chave a chave.**

```
$ cd ~/.config/hefesto-dualsense4unix/profiles && python3 -c "
import json,glob;c={}
for f in glob.glob('*.json'):
    for k in json.load(open(f)): c[k]=c.get(k,0)+1
print(sorted(c.items(), key=lambda x:-x[1]))"
```

| chave | perfis | o que isso diz |
|---|---|---|
| `name`,`version`,`match`,`priority`,`triggers`,`leds`,`rumble` | **34/34** | o núcleo viaja sempre |
| `suppress_desktop_emulation` | 31/34 | |
| `mode` | **12/34** | e o `sackboy.json` — o jogo de quatro pessoas desta casa — **não tem** |
| `speaker` | 9/34 | |
| `key_bindings` | 4/34 | |
| `mic` | 3/34 | |
| **`ponte`** | **2/34** | `big_walk.json` (19/08) e `duskfade.json` (22/08). **A aba não mostra nenhum dos dois** |
| `mouse` | 1/34 | |
| **`controllers`** | **0/34** | nenhum ajuste por controle existe em perfil nenhum dela |

**3. Três `.lock` órfãos**, de perfis que ela apagou:

```
$ cd ~/.config/hefesto-dualsense4unix/profiles
$ for f in *.json.lock; do [ -f "${f%.lock}" ] || echo "ORFAO: $f"; done
ORFAO: meu_perfil.json.lock
ORFAO: sackboy_nativo.json.lock
ORFAO: vitoria.json.lock
```

**4. O ambiente da F8 continua quebrado na máquina dela**, e é o que decide se o
perfil de jogo troca sozinho: `window_detect_seeing: false`,
`window_detect_reason: "sem_conexao_x"` — e `window_detect_healthy: true`.
Nada nesta onda cura isso (é a Z7), mas **nenhuma tarefa daqui pode afirmar que
a troca automática funciona** enquanto for assim.

### 2.2 Medido por leitura de código, com endereço

**1. O carimbo de ponte é publicado pelo daemon e não tem UM leitor na janela.**

`daemon/ipc_handlers.py:1895-1905` publica `pontes_confirmadas` na resposta do
`daemon.status`, com o comentário dizendo a intenção em letra:
*"para a janela dizer 'este jogo já sabe por onde entra'"*.

```
$ grep -rn "pontes_confirmadas" src/hefesto_dualsense4unix/app/
app/draft_config.py:445:    # `manager.pontes_confirmadas()` e a escada …   ← comentário
app/actions/profiles_actions.py:3771:  # carimbo viaja junto, `pontes_confirmadas()` …  ← comentário
```

**Dois hits, os dois em comentário. Zero leitores.** A aba PRESERVA o carimbo no
Salvar (`profiles_actions.py:3787`) e nunca o mostra. É a F2 na forma pura — a
cura escrita, o dado publicado, e a tela muda —, e é a decisão dela de 19/08
(*"o produto CONSTRÓI a ponte, não só preserva"*) parada na última perna.

**2. Dois botões da MESMA aba, o mesmo fato, dois vocabulários — e o honesto
está a 100 linhas do desonesto.**

| botão | o que chama | o que diz |
|---|---|---|
| **Ativar** (`:2621`) | `call_async("profile.switch")` → `mensagem_de_ativacao(name, result)` (`:609`) | lê o relatório `secoes` e diz **o que NÃO entrou** |
| **Salvar** (`:2737`) | `profile_switch(name)` (`ipc_bridge.py:271`), que devolve **só um booleano** | `"Perfil salvo e reaplicado no controle: {nome}"` — plano, sem prova |

`profile_switch` documenta na própria docstring que o `False` significa "o daemon
não confirmou" — nunca "as seções entraram". O Salvar trata o `True` como se
significasse a segunda coisa. Com o gate R-04 (jogo aberto) recusando seções, a
janela comemora. **A peça que resolve já existe:** `_corpo_do_daemon`
(`ipc_bridge.py:286`), da ELO-MUDO-01 de 23/08.

**3. E o Salvar segura a thread do GTK, com o número medido dentro do arquivo.**

`on_profile_save` faz, em sequência e **na thread do GTK**:
`active_profile_name()` (IPC), `save_profile()` (`:2886`, FileLock + escrita),
`delete_profile()` no rename, e `profile_switch()` (`:2937`) com
`PROFILE_SWITCH_TIMEOUT_S = 3.0` (`ipc_bridge.py:49`).

O tamanho do congelamento está escrito no comentário do botão vizinho, em
`:2626-2632`: *"o handler `profile.switch` levou ~1,2 s MEDIDOS no journal
dela"* — foi por isso que o **Ativar** virou `call_async`. O Salvar ficou.
A lista, essa, já é assíncrona desde a PERF-GUI-PROFILE-LOAD-NONBLOCKING-01
(`:3134`): o padrão certo está no mesmo arquivo, e só um botão não o segue.

> **Não confundir com o funil.** `profiles_actions.py` é **exceção DATADA e
> declarada** ao `ProfileWriterMixin`
> (`tests/unit/test_gravacao_de_perfil_passa_pelo_funil.py:479-545`, com teste
> travando que a lista só pode encolher). Isso é decisão medida — **não mexa**.
> O defeito é a thread, não o funil.

**4. A aba Perfis é cega ao alvo, e a fita do cabeçalho promete o contrário.**

```
$ grep -c "_edit_target_uniq\|_edit_uniq" \
    src/hefesto_dualsense4unix/app/actions/profiles_actions.py
0
```

Zero. `Profile.controllers` existe no esquema (`profiles/schema.py:992`, com
validador de MAC em `:1091-1130`), a aba **preserva** o campo (`:3743`, `:3758`)
e nunca o mostra nem o edita. Enquanto isso a fita `Ajustes vão para: [1][2][3][4]`
fica acesa no `header_bar` por cima desta aba também. Resultado: os 34 perfis
dela têm `controllers` ausente (§2.1/2), e **o último ajuste por controle de
qualquer aba não tem onde aparecer aqui**.

**5. Os presets de programa são os aplicativos desta bancada.**
`profiles/simple_match.py:49-55`, literal:

```python
"browser":  window_class=["firefox", "chromium", "brave", "google-chrome"]
"terminal": window_class=["gnome-terminal", "alacritty", "kitty", "konsole"]
"editor":   window_class=["code", "zed", "neovide"]
```

Três botões da tela ("Navegador", "Terminal", "Editor") com doze programas ao
todo. Sem Vivaldi, Zen, Falkon, Epiphany; sem `foot`, `wezterm`, `xterm` nem
**`ptyxis`** (o terminal padrão do COSMIC, que é o desktop desta máquina); sem
vim, emacs, gedit, kate, sublime ou qualquer JetBrains. Quem instalar, clicar
"Editor" e salvar ganha um perfil que **nunca casa** — e a tela não diz nada.
É a F8/Z7 dentro desta aba.

**6. 34 perfis numa faixa de 320 px, sem busca, com ~740 px mortos ao lado.**

`gui/main.glade:2089-2090`: `min-content-height=200`, `max-content-height=320`.
A ~28 px por linha, a lista mostra **~11 de 34** e rola. E:

```
$ grep -ci "SearchEntry\|set_search_column\|TreeModelFilter" \
    src/hefesto_dualsense4unix/app/actions/profiles_actions.py \
    src/hefesto_dualsense4unix/gui/main.glade
0   0
```

Nenhuma busca, em lugar nenhum. Na foto de hoje o conteúdo da coluna esquerda
termina em y≈335 (a fileira Novo/Duplicar/Remover/Ativar/Recarregar) e o painel
vai até y≈1080: **~740 px vazios**. E o comentário que fixou o teto
(`main.glade:2073`) diz *"A lista de perfis desta casa e curta"* — era verdade
quando foi escrito e hoje é **fato caduco**, com 34 arquivos no disco dela.

**7. Remover não sabe que está apagando o que está valendo, e deixa rastro.**

`on_profile_remove` (`:2588-2620`) confirma a remoção pelo nome e nunca pergunta
se aquele é o perfil ativo. Com `active_profile.txt` = `Sackboy`, apagar o
Sackboy é um clique: o daemon segue com as seções dele aplicadas no controle, o
marcador em disco continua apontando para um perfil que não existe mais, e nada
na tela diz isso. E `delete_profile` (`profiles/loader.py:1487`) trava
`_lock_path(candidate)`, apaga o `.json` e **nunca o `.lock`** — os três órfãos
do §2.1/3.

**8. O aviso de rádio frágil só existe na Início.**

```
$ grep -rln "native_bt_fragil" src/hefesto_dualsense4unix/app/
src/hefesto_dualsense4unix/app/actions/home_actions.py
```

Um arquivo só. E esta aba oferece **"Conexão Nativa (Sony)"** como um dos quatro
modos do perfil (`profiles_actions.py:145-153`, visível na foto), sem uma
palavra sobre fragilidade — inclusive num perfil de co-op, onde o Modo Nativo
com dois ou mais controles no rádio é **exatamente** a pergunta que ninguém
mediu (§6).

**9. Uma linha a menos num caminho, e um caminho a menos inteiro.**

Dos quatro sítios que sincronizam a caixinha do Steam Input, **três** sincronizam
também a lista dos outros marcados e **um não**:

```
$ grep -n "_sincronizar_caixa_do_steam_input()\|_sincronizar_outros_marcados()" \
    src/hefesto_dualsense4unix/app/actions/profiles_actions.py
1701: caixa   1702: outros     ← par
1962: caixa   1967: outros     ← par
2181: caixa                    ← SOZINHO
2235: caixa   2236: outros     ← par
```

`:2181` é o retorno cedo de `on_profile_steam_input_toggled` quando não há appid.
E o buraco maior é irmão: `_on_campo_do_jogo_mudou` (`:1955-1958`) sai **antes**
da lista quando o "Aplica a:" não é "Jogo da Steam" — trocar de "Jogo da Steam"
para "Steam" deixa a lista mostrando N−1 jogos quando deveria mostrar N, porque
o jogo do editor deixou de ser "o deste editor".

**10. Quatro caminhos desta aba não têm UMA mordida.**

```
$ for f in on_profile_remove on_profile_duplicate _ao_tirar_outro_marcado \
           _refazer_as_abas_apos_ativar on_profile_activate on_profile_save; do
    echo "$f -> $(grep -rl "$f" tests/ | wc -l)"; done
on_profile_remove           -> 0
on_profile_duplicate        -> 0
_ao_tirar_outro_marcado     -> 0
_refazer_as_abas_apos_ativar-> 0
on_profile_activate         -> 2
on_profile_save             -> 10
```

Remover (que apaga arquivo dela), Duplicar (que a MASCARA-QUE-GRUDA-01 já
quebrou uma vez), o "Tirar" da lista e o **refazer das seis abas** — nenhum tem
teste. O último é o mais caro: é o que reconstrói Lightbar, Gatilhos, Rumble,
Navegação, Início e Emulação a cada ativação (`footer_actions.py:1590-1629`), e
é o motivo de esta onda vir DEPOIS das quatro que decidem contrato.

**11. E há um portão desta casa que a suíte não coleta.**
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` — o portão que procura
cura escrita e nunca ligada, com 31 casos — **não começa por `test_`**, e o
`pyproject.toml` não sobrescreve `python_files`. Medido:

```
$ .venv/bin/python -m pytest tests/unit --collect-only -q | grep -c portao_a_casa
0
$ .venv/bin/python -m pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py \
      --collect-only -q | tail -1
31 tests collected
```

Ele passa quando chamado pelo nome e **nunca roda no `pytest -q` do aceite**.
Não é tarefa desta aba (é da Z6/auditoria), mas quem executar precisa saber: o
portão que teria pego o `pontes_confirmadas` sem leitor está desligado.

### 2.3 O que é HIPÓTESE, e continua sendo

- **NÃO VERIFICADO:** por que o campo "Nome:" está vazio na foto com "Pragmata"
  selecionado. Host que seleciona sem popular, ou a aba real abrindo assim.
  Rodada 0, e é a primeira pergunta.
- **NÃO VERIFICADO:** quanto tempo a janela fica de fato congelada no Salvar. O
  ~1,2 s é o do `profile.switch` medido no journal DELA em 05/08, citado no
  código; o total do handler (com `save_profile` + `active_profile_name`) nunca
  foi cronometrado.
- **NÃO VERIFICADO:** se ela já perdeu trabalho apagando o perfil ativo. O
  mecanismo está provado no código; a ocorrência, não. Nenhum log foi lido.
- **NÃO MEDIDO NESTA ONDA:** qualquer coisa com controle na mão. Às 22h de 23/08
  o daemon reportava `coop.mesa == []` e `controllers[0].connected == false`.
  **Nenhum número desta sprint sobre 2 ou 4 controles é medição viva.**

---

## 3. A coreografia dos agentes

**Dez agentes. Dois medem primeiro, e o desenho das dez tarefas seguintes só
fecha depois deles.** Esta aba MANDA em seis outras (`_refresh_all_tabs`), então
o portão de replanejamento aqui não é formalidade.

### Rodada 0 — dois batedores, em paralelo, NADA de código

| agente | faixa | devolve |
|---|---|---|
| **A1 — batedor do código** | `app/actions/profiles_actions.py` (as 4.400 linhas), `app/actions/profile_writer.py`, `profiles/loader.py`, `profiles/schema.py`, `profiles/simple_match.py`, `app/ipc_bridge.py:265-300`, e os 50 arquivos de teste com "perfil/profile" no nome | Achados com `arquivo:linha`; para cada um, se sobrevive à **Z2** e à **Z4** (várias tarefas daqui podem virar no-op); a cronometragem do §2.3/2 com `time.monotonic()` em volta de `on_profile_save`; e o resultado de arrancar a cura de cada teste que ele listar |
| **A2 — batedor da tela e dos perfis REAIS** | `readme_perfis.png`, os 34 JSON dela lidos **read-only**, `docs/usage/interface.md` na seção de Perfis, e as chaves do CSV que a aba promete | A resposta ao NÃO VERIFICADO nº 1 (rodando `retratar_abas.py /tmp/olhar` e lendo o `Gtk.Entry`, **nunca** sem argumento — as onze fotos têm dono na Z0); toda promessa de tela sem lastro no mapa; e o par campo-a-campo do aceite da Z4 (abrir → mexer → Salvar → fechar → reabrir) em **três** perfis dela: `sackboy.json` (sem `mode`), `big_walk.json` (com `ponte`) e `point_and_click.json` (o único com `mouse`) |

**Portão de replanejamento.** Quem orquestra relê P1..P10 à luz dos dois
relatórios **antes** da rodada 1. Tarefa derrubada sai com nota datada; achado
novo entra numerado.

### Rodada 1 — quatro agentes em paralelo, arquivos disjuntos

| agente | tarefa | arquivos |
|---|---|---|
| **A3** | **P1** — um dono só para "qual perfil está valendo" | `profiles_actions.py:460-480` (o dono sai daqui), `status_actions.py:2700`, `home_actions.py:236`, `widgets/painel_no_jogo.py:388` |
| **A7** | **P5** — os presets de programa deixam de ser esta bancada | `profiles/simple_match.py`, `tests/` |
| **A8** | **P6** — a lista cabe, e ganha busca | `gui/main.glade:2066-2100`, `profiles_actions.py:937-1010` |
| **A10** | **P10** — o arquivo de mordida (esqueleto vermelho) | `tests/unit/` (arquivo novo) |

### Rodada 2 — três agentes em SÉRIE na faixa `profiles_actions.py`

Série, não paralelo: os três mexem no mesmo arquivo de 4.400 linhas, e P2
depende do Salvar já assíncrono.

| agente | tarefa |
|---|---|
| **A5** | **P3** — o Salvar solta a thread e **depois** **P3b** — o toast do Salvar reusa `mensagem_de_ativacao` |
| **A4** | **P2** — o carimbo de ponte aparece nesta aba |
| **A9** | **P7** — Remover diz que é o ativo, e leva o `.lock` junto; e **P9** — a lista dos outros nos dois caminhos que a esquecem |

### Rodada 3 — dois agentes, série curta

| agente | tarefa |
|---|---|
| **A6** | **P4** — o perfil mostra o que guarda por controle *(consome a Z2; se a Z2 não fechou, esta tarefa PARA e diz que parou)* |
| **A7** | **P8** — o aviso de rádio frágil chega aqui, reusando a frase da Início |

### Rodada 4 — o fechamento

A2 refaz o par campo-a-campo da Z4 nos três perfis, A8 pede a foto no lote da
Z0 (nunca rodando `retratar_abas.py` sem argumento por conta própria), e A10
fecha as mordidas de P10 contra a árvore já curada.

---

## 4. As tarefas

**Treze.** Duas de auditoria, onze de execução.

---

### P0a — A auditoria de código *(A1)*

**Arquivos:** os do §3, rodada 0. **Nenhuma linha escrita em produto.**
**Mordida:** não se aplica — é medição. O que a substitui: **todo achado vem com
`arquivo:linha` e com o comando que o produziu**; achado sem endereço é
descartado na leitura.
**Custo:** ~3 h (o arquivo tem 4.400 linhas). **Carimbo:** não toca a tela.

---

### P0b — A auditoria de tela e dos perfis reais *(A2)*

**Arquivos:** os do §3, rodada 0. **Nenhuma linha escrita.** Os JSON dela são
lidos, **nunca** gravados; qualquer prova de ida-e-volta roda sobre cópia em
`/tmp`.
**Mordida:** não se aplica. O que a substitui: **toda divergência tela↔mapa vem
com a célula do CSV citada**, e o par campo-a-campo vem com o diff literal dos
três perfis antes e depois.
**Custo:** ~2 h 30. **Carimbo:** não toca a tela.

---

### P1 — Um dono só para "qual perfil está valendo" (Z5) *(A3)*

**Arquivos:** `profiles_actions.py:460-480` (o dono nasce aqui e é exportado),
`status_actions.py:2700`, `home_actions.py:236`,
`widgets/painel_no_jogo.py:388`.

**O conserto:** `perfil_que_ela_ativou()` já é o resolvedor certo — ele lê
`session.json` + `active_profile.txt` por `resolve_boot_profile()`, que é o
mesmo caminho que o daemon usa no boot. Ele sai da aba Perfis e vira o dono do
fato. As três leitoras passam a chamá-lo com o `active_profile` do daemon como
**primeira** fonte e o disco como fallback declarado — nunca `or "Nenhum"` sobre
um `null`, que é a tela confundindo "não sei" com "não há".

**A distinção que a tela precisa carregar, e que hoje não existe em lugar
nenhum:** *"nenhum perfil ativo"* e *"o daemon não sabe dizer"* são fatos
diferentes. É a mesma disciplina que `secao_controles.py` já aplica ("um 'não
sei' não pode virar aviso").

**A mordida:** host com `state_full` devolvendo `active_profile: None` e
`active_profile.txt` valendo `"Sackboy"` → as **quatro** superfícies dizem a
mesma coisa. Arranque o dono de uma delas e o teste reprova **nomeando qual
aba** divergiu — no molde do aceite da Z5.

**Custo:** ~50 linhas, 2 h 30.
**Carimbo:** **ESTRUTURAL — precisa do olho dela ANTES.** A Status hoje diz
"Nenhum" e passará a dizer outra coisa; a palavra é dela.

---

### P2 — O carimbo de ponte aparece nesta aba (F2 / decisão dela de 19/08) *(A4)*

**Arquivos:** `profiles_actions.py` (novo leitor, perto de `_atualizar_frase_do_jogo`),
`gui/main.glade` (um rótulo na coluna do editor, abaixo do campo do jogo).

**O conserto:** o `pontes_confirmadas` do `daemon.status`
(`daemon/ipc_handlers.py:1895-1905`) ganha leitor **aqui**, que é onde a pessoa
escolhe o jogo. Com carimbo, a linha diz por onde aquele jogo entrou e **quando**
(`confirmada_em`) e **como** (`confirmada_por`); sem carimbo, ela **não diz
nada** — silêncio, não "desconhecida", pela regra do §P1.

Dois perfis dela já têm o carimbo hoje (`big_walk.json`, `duskfade.json`,
§2.1/2): a tarefa nasce com dado real para provar contra, sem inventar fixture.

**A mordida:** `state` com `pontes_confirmadas: {"1599660": {...}}` e o editor
aberto naquele appid → a linha aparece com a data. Arranque o leitor: reprova
com a linha ausente. E um segundo caso: `pontes_confirmadas: {}` → **nenhum**
texto novo na tela (o silêncio é parte da cura, não ausência dela).

**Custo:** ~60 linhas, 2 h 30.
**Carimbo:** **ESTRUTURAL — precisa do olho dela ANTES** (texto novo; e nascer
visível ou colapsado é decisão dela).

---

### P3 — O Salvar solta a thread do GTK *(A5)*

**Arquivos:** `profiles_actions.py:2880-2960`.

**O conserto:** o I/O sai da thread do GTK pelo caminho que a própria aba já usa
— `run_in_thread` para `active_profile_name()` / `save_profile()` /
`delete_profile()`, e `call_async` para o `profile.switch`, exatamente como o
**Ativar** faz em `:2639-2644`. O toast e a repintura voltam por
`GLib.idle_add`, como em `_on_profile_switch_success`.

**O que NÃO muda, e é importante:** a exceção datada ao `ProfileWriterMixin`
(§2.2/3) fica. Esta tarefa move a chamada de thread, não de módulo.

**A mordida:** teste que planta um `profile.switch` dublê dormindo 1,2 s e mede
o tempo de retorno de `on_profile_save` na thread chamadora: tem de voltar em
menos de 100 ms. Arranque o `call_async` e veja reprovar com ~1,2 s — o número
que o comentário de `:2626-2632` já registra.

**Custo:** ~70 linhas, 3 h.
**Carimbo:** **não toca a tela.** Se o executor quiser somar indicador visual
durante a gravação, isso é **ESTRUTURAL** e vai separado, para o olho dela.

---

### P3b — O toast do Salvar para de prometer o que não sabe (Z1) *(A5)*

**Arquivo:** `profiles_actions.py:2937-2952`.

**O conserto:** `profile_switch()` devolve booleano de transporte e o toast o lê
como confirmação de aplicação (§2.2/2). Troca por `_corpo_do_daemon`
(`ipc_bridge.py:286`) + `mensagem_de_ativacao(name, result)` — que é a função
desta MESMA aba, já escrita, já testada, e que lê o relatório `secoes`.
**Reuso, nunca frase nova:** dois donos da mesma frase derivam, e esta casa tem
a regra escrita.

**Por que isto morde de verdade:** com o jogo aberto, o gate R-04 recusa seções.
Hoje o Salvar diz "reaplicado no controle" e a pessoa acredita.

**A mordida:** dublê que responde `{"secoes": {"failed": ["rumble"]}}` → o toast
do Salvar tem de nomear o que ficou de fora, com a MESMA frase do Ativar.
Arranque a troca: reprova com o texto plano de hoje.

**Custo:** ~15 linhas, 1 h.
**Carimbo:** **ESTRUTURAL — precisa do olho dela ANTES** (texto reescrito na
tela) — **salvo se** ele sair idêntico ao do Ativar, que ela já aprovou na
ATIVAR-NAO-MENTE-01. O executor declara qual dos dois casos ocorreu.

---

### P4 — O perfil mostra o que guarda por controle (Z2 + Z4) *(A6)*

**Arquivos:** `profiles_actions.py` (leitor novo), `gui/main.glade` (uma linha
no editor).

**O conserto, e o escopo é deliberadamente pequeno:** `Profile.controllers`
existe (`profiles/schema.py:992`) e a aba o preserva às cegas (`:3743`, `:3758`).
Esta tarefa faz a aba **dizer** que ele existe: quantos controles o perfil
aberto tem override para, e para quais — pelo apelido/jogador que a Z2 resolver,
**nunca pelo MAC cru na tela**. Editar por controle **não** entra nesta onda
(§9, é dela).

**A dependência é dura e a tarefa tem de honrá-la:** sem a Z2, esta aba não tem
como traduzir uniq em "Controle 2". Se a Z2 não tiver fechado, **A6 PARA e
declara que parou** — não improvisa um segundo tradutor, que é como esta casa
ganhou nove leitores por `getattr`.

**A mordida:** perfil de fixture com `controllers` de dois uniqs (mascarados,
octetos 4 e 5 zerados) → a aba mostra os dois **e** o Salvar os devolve ao disco
byte a byte. Arranque a preservação de `:3743`: reprova mostrando o campo perdido
— que é o cenário de perda silenciosa mais caro desta aba.

**Custo:** ~55 linhas, 2 h 30.
**Carimbo:** **ESTRUTURAL — precisa do olho dela ANTES** (elemento novo no
editor).

---

### P5 — Os presets de programa deixam de ser esta bancada (Z7) *(A7)*

**Arquivos:** `profiles/simple_match.py:45-56`, `tests/`.

**O conserto:** as três listas de doze programas (§2.2/5) ou crescem para
cobrir as famílias, ou a tela passa a dizer **quais** programas cada botão
cobre — e a segunda opção é a mais honesta, porque nenhuma lista fecha. As duas
juntas é o desenho preferível: lista maior **e** o tooltip nomeando o que entra.

**Nada de detecção mágica.** Adivinhar "isto é um editor" pelo nome do processo
é a classe de contorno que esta casa recusa. É lista declarada, com dono.

**A mordida:** teste que passa `ptyxis` (o terminal desta máquina), `vivaldi` e
`gedit` pelo `detect_simple_choice` e exige `terminal`/`browser`/`editor`. Os
três **reprovam hoje** — rode antes de mexer e cole a saída no commit. Arranque
as entradas novas e veja os três reprovarem de novo.

**Custo:** ~30 linhas de lista, ~40 de teste, 2 h.
**Carimbo:** a lista **não toca a tela**. Se o tooltip do seletor mudar de
texto, essa metade é **ESTRUTURAL** e espera.

---

### P6 — A lista cabe, e ganha busca *(A8)*

**Arquivos:** `gui/main.glade:2066-2100`, `profiles_actions.py:937-1010`.

**O conserto, em duas metades com carimbos diferentes:**

- **A altura.** `max-content-height=320` foi decidido quando "a lista de perfis
  desta casa e curta" era verdade. Hoje são 34 e há ~740 px mortos ao lado
  (§2.2/6). O teto sobe até onde a coluna já tem, sem `vexpand` — a razão de o
  `vexpand` ter saído (VAO-01/E1, no comentário do glade) continua válida e
  **não** deve ser desfeita.
- **A busca.** Um `Gtk.SearchEntry` sobre a lista, filtrando por nome. Trinta e
  quatro linhas roláveis sem filtro é a memória externa dela virando caça ao
  tesouro.

**A mordida:** teste de geometria sob Xvfb
(`xvfb-run -a --server-args="-screen 0 1920x1080x24"`), no molde do
`test_layout_orcamento_altura.py`, com fixture de 34 perfis: a lista tem de
alocar ≥ N linhas visíveis. Arranque o teto novo e veja reprovar com 320.
Segunda mordida: digitar "sack" deixa **uma** linha; arranque o filtro e veja 34.

**Custo:** ~45 linhas, 3 h (a maior parte é a régua sob Xvfb).
**Carimbo:** a altura é **COSMÉTICA — pré-aprovada pela D3**. A busca é
**ESTRUTURAL** (widget novo muda o que se vê ao abrir) e espera o olho dela.
As duas metades vão em commits separados por causa disso.

---

### P7 — Remover diz que é o ativo, e leva o `.lock` junto *(A9)*

**Arquivos:** `profiles_actions.py:2588-2620`, `app/gui_dialogs.py`
(`confirm_delete_profile`), `profiles/loader.py:1487-1500`.

**O conserto, em duas metades:**

- **A frase.** Quando o perfil a remover é o que está valendo (pelo dono do
  §P1), o diálogo diz isso **e** diz o que acontece: o daemon continua com as
  seções aplicadas até a próxima troca, e o marcador em disco fica apontando
  para um arquivo que não existe mais. Sem essa frase, a remoção parece
  inconsequente.
- **O rastro.** `delete_profile` apaga o `.json` e deixa o `.lock`. Três órfãos
  no disco dela (§2.1/3). O unlink do lock sai **depois** de liberar o
  `FileLock`, nunca dentro do bloco.

**O que NÃO se toca:** o comentário de `:2604-2612` explica por que
`_alvo_do_salvar` **não** é zerado aqui, com a medição por trás
(NUNCA-TROCA-O-ALVO-01). Decisão medida — fica.

**A mordida:** (a) remover o perfil ativo sem a frase → reprova; (b) diretório
de teste depois de um `delete_profile` não pode conter `<slug>.json.lock` →
reprova hoje, com os três nomes do §2.1/3 como caso de regressão.

**Custo:** ~35 linhas, 2 h.
**Carimbo:** **ESTRUTURAL — precisa do olho dela ANTES** (texto novo no
diálogo). O `.lock` **não toca a tela** e vai em commit separado.

---

### P8 — O aviso de rádio frágil chega aqui *(A7)*

**Arquivos:** `profiles_actions.py` (leitor novo perto de `_MODE_KIND_ITEMS`),
`gui/main.glade` (rótulo na seção "Modo").

**O conserto:** `native_bt_fragil` / `native_bt_fragil_controles` só têm leitor
na Início (§2.2/8). Esta aba **oferece o Modo Nativo** e não avisa. O leitor
novo **reusa `texto_native_bt_fragil`** (`home_actions.py:438`) — nunca uma
segunda frase para o mesmo fato, que é o padrão que gerou os oito pares da F5.

**A mordida:** `native_bt_fragil: True` no estado + o botão "Conexão Nativa
(Sony)" marcado → o aviso aparece com a MESMA string da Início. Arranque o
leitor: reprova. Segundo caso: se o texto divergir do da Início por um
caractere, reprova também — a asserção é de igualdade, não de conteúdo.

**Custo:** ~35 linhas, 1 h 30.
**Carimbo:** **ESTRUTURAL — precisa do olho dela ANTES** (a frase é nova nesta
aba, mesmo sendo velha na outra).

---

### P9 — A lista dos outros marcados nos dois caminhos que a esquecem, e a D-D *(A9)*

**Arquivos:** `profiles_actions.py:2181`, `:1955-1958`, e os três textos da
caixinha.

**O conserto, em duas metades:**

- **As duas chamadas que faltam.** Uma linha em `:2181` e uma no ramo não-Steam
  de `_on_campo_do_jogo_mudou` (§2.2/9). Baratíssimo, e é o resíduo exato da
  A-LISTA-QUE-FALTAVA-01 de 22/08.
- **A redação, que é a D-D.** O SPRINT_ORDER decidiu: reescrever **agora**, sem
  esperar a
  [ESCONDE-SO-O-HIDRAW-01](2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md)
  fechar. Os textos de hoje prometem que "o jogo passa a ver só o controle do
  Hefesto", e a medição de 23/08 diz que o jogo **continua vendo o físico pelo
  evdev**. Isso é fato errado: **substitui**, e sai de todos os lugares onde
  aparece — a caixinha, o tooltip do "Tirar", e o botão irmão da aba Sistema.

**A mordida:** (a) trocar o "Aplica a:" de "Jogo da Steam" para "Steam" com três
jogos marcados → a lista mostra **três**, não dois; arranque a linha e veja
reprovar com dois. (b) portão de léxico: nenhuma frase desta aba pode prometer
que o jogo deixa de ver o controle físico; arranque a regra e veja os três
textos de hoje reprovarem.

**Custo:** ~2 linhas de fiação, ~12 de texto, ~40 de teste, 2 h.
**Carimbo:** as duas linhas **não tocam a tela**. A redação é **ESTRUTURAL** e é
a **D-D** — decisão já tomada por ela, mas o texto final ainda passa pelo olho
dela.

---

### P10 — As mordidas que faltam *(A10)*

**Arquivo:** `tests/unit/` — arquivo novo.

**O conserto:** quatro caminhos desta aba têm zero teste (§2.2/10). O arquivo
novo cobre os quatro, e cada caso é um conserto desta onda ou um fato que ela já
depende:

1. **Remover** o perfil ativo → a frase aparece, e o `.lock` some (P7);
2. **Duplicar** → o perfil-fonte é copiado inteiro, `_alvo_do_salvar` vira
   `None`, e `_new_profile` vira `False` — as três invariantes que os comentários
   de `:2570-2586` declaram e que nada trava hoje;
3. **Tirar** um jogo da lista → passa por `_gravar_marca_do_steam_input` (o
   escritor único) e a lista relê;
4. **`_refazer_as_abas_apos_ativar`** com edição pendente → o **default do
   diálogo é MANTER** o que ela não salvou, e a recusa dela deixa as abas como
   estavam. É a regra escrita em `:2670-2690`, e é o caminho que reconstrói seis
   abas.

**A mordida:** cada um dos quatro reprova com a cura correspondente arrancada, e
a **saída literal do pytest vai no commit** — no molde do `mordida_provada_em`
do CSV, que é o padrão de prova mais alto deste repositório.

**Custo:** ~200 linhas, 3 h 30.
**Carimbo:** não toca a tela.

---

### 4.1 Os ganchos entre abas — o que quebra se alguém mexer sozinho

| gancho | quem depende | o que acontece se ignorar |
|---|---|---|
| `on_profile_activate` → `_refresh_all_tabs` (`footer_actions.py:1590-1629`) repinta **Lightbar, Gatilhos, Rumble, Navegação (teclado+mouse), Início e Emulação** | 6 abas | é **a razão de esta onda vir depois das quatro que decidem contrato**. Repintar aba que ainda vai mudar é retrabalho garantido |
| `_refresh_all_tabs` **não** repinta Status, Sistema, "No jogo" nem Configurações | 4 abas | ativar um perfil deixa quatro abas mostrando o mundo anterior. Isto é da **Z5**, não desta onda — mas nenhuma tarefa daqui pode afirmar o contrário |
| `perfil_que_ela_ativou` vira o dono do "perfil ativo" (P1) | Status, Início, No jogo | se as três copiarem a lógica em vez de chamar o dono, o produto ganha **quatro** respostas em vez de duas |
| `steam_input_apps.txt` tem **quatro** escritores (aba Perfis, aba Sistema, CLI, daemon) | Perfis↔Sistema↔CLI | é o par F5 nº 8 e a redação da D-D vale para os três. Curar só aqui deixa a frase antiga viva na Sistema |
| `Profile.controllers` (P4) | todas as abas com alvo | se esta aba inventar o próprio tradutor de uniq→jogador em vez de usar o da **Z2**, nasce o décimo leitor por `getattr` |
| `texto_native_bt_fragil` mora em `home_actions.py:438` | Início, Perfis | reescrever a frase aqui cria o nono par da F5 na mesma noite em que oito estão sendo curados |

---

## 5. O que o Bluetooth bloqueia

**Esta sprint não mede rádio.** Ela declara o que a aba **não pode afirmar na
tela** enquanto a medição não existir. Fonte de cada linha: o
[mapa de canais](../../data/mapa-controles.csv).

**As três perguntas de BT que bloqueiam esta aba:**

> **1.** Ativar um perfil **por rádio** aplica as MESMAS seções que no cabo?
> **2.** O **Modo Nativo** com dois ou mais controles no rádio funciona — e com
> quantos adaptadores?
> **3.** Um perfil que guarda **preset de gatilho** entrega os dezenove modos
> por rádio, ou só o que foi sentido?

| a aba **não pode** afirmar | por quê (célula do mapa) |
|---|---|
| que ativar/salvar **reaplicou no controle**, sem qualificar | `luz.led_jogador.escrita_hefesto@dualsense`: `radio_aciona = **parcial**`, `radio_de_onde_sei = inferido-do-codigo`. E a ressalva: *"Sem nó de sysfs gravável, o rádio fica SEM escrita de LED de jogador — e é aí que a supressão vira ausência de feature, não só de rota."* Na bancada dela a regra udev está aplicada: **é vício de bancada por definição** |
| que a **vibração do jogo** do perfil atravessa por rádio | `vibracao.rumble.passthrough@dualsense`: `radio_aciona = sim`, mas `radio_de_onde_sei = inferido-do-codigo` e a ressalva diz *"Implementado sem gate, mas **NÃO MEDIDO** por Bluetooth"* |
| que o **preset de gatilho** do perfil vale nos dezenove modos, por rádio | `gatilho.modos_firmware@dualsense`: `cabo_aciona = parcial`, `radio_aciona = parcial`. A ressalva registra **DIVERGÊNCIA VIVA** entre `weapon()` (PULSE_B `0x06`) e `vibration()` (PULSE_A `0x22`) e diz que esses dois *"ficaram fora do grupo dos SETE curados e do dos CINCO travados por sensação"* |
| que o **Modo Nativo** de um perfil de co-op funciona com a mesa cheia | não há linha do mapa que o sustente, e o botão é oferecido hoje **sem ressalva** num perfil que pode ser de quatro pessoas (§2.2/8). É a pergunta 2 acima |
| que a **troca automática por jogo** funciona | não é rádio, é a **Z7** — e está quebrado na máquina dela AGORA (§2.1/4). Nenhuma frase desta aba pode prometer troca automática antes da Z7 |

**Consequência direta e imediata para P3b e P8:** o toast do Salvar e o aviso do
Modo Nativo **descrevem**, nunca prometem. Enquanto as três perguntas não forem
medidas, "reaplicado no controle" só pode existir qualificado pelo relatório
`secoes` — que é exatamente o que P3b entrega.

---

## 6. As sprints absorvidas

| sprint | o que contribui | morre ao fim desta? |
|---|---|---|
| [PERFIL-SALVA-TUDO-01](2026-07-29-PERFIL-SALVA-TUDO-01-salvei-todas-as-abas-e-so-parte-ficou.md) | A queixa-mãe, e o censo por aba do que chega ao perfil | **NÃO.** O corpo dela é a **Z4**; aqui entram só P4 e o par campo-a-campo do P0b |
| [PERFIL-NASCE-CERTO-01](2026-07-26-PERFIL-NASCE-CERTO-01-o-perfil-do-jogo-que-nunca-vence.md) | A prioridade e o teto de 200 (dono em `schema.py`); a E3/E4 — *"o detector de sanidade existe e ninguém o dispara"*, que é a F2 desta aba | **PARCIAL.** O detector sem gatilho é F2 e continua aberto (§8) |
| [AUTOMATISMO-MORTO-01](2026-07-30-AUTOMATISMO-MORTO-01-o-perfil-do-jogo-nunca-entra.md) | A E0 — *"a janela dizer POR QUE o perfil não trocou"*. **Duas sprints escreveram a cura, nenhuma a ligou** | **NÃO.** A causa viva é a **Z7** (`sem_conexao_x`, §2.1/4), não esta aba |
| [ESCOLHA-DELA-VENCE-01](2026-08-01-ESCOLHA-DELA-VENCE-01-a-mascara-do-perfil-e-o-tooltip-do-xbox.md) | A E3: a recusa com jogo aberto deixa de reportar sucesso — que é **exatamente o P3b** | **PARCIAL.** A E3 morre com P3b; E2 e E5 são dela |
| [MASCARA-QUE-GRUDA-01](2026-08-22-MASCARA-QUE-GRUDA-01-quatro-perfis-dela-pedem-xbox-e-agora-isso-fica.md) | A etiqueta de preço da máscara, **FECHADA em 23/08**. Contribui a regra: reusar o texto, nunca reescrever | **SIM** como trabalho. Fica na fila só até ela ver |
| [FOCO-ERRANTE-01](2026-08-18-FOCO-ERRANTE-01-o-x-aponta-para-a-steam-e-leva-o-perfil-junto.md) | A janela da Steam roubando o foco e levando o perfil junto | **NÃO.** É **Z7** (detecção de janela), e o teste que a cobre já existe |
| [MODO-01](2026-07-25-MODO-01-o-modo-jogo-liga-sozinho.md) | A seção `mode` e o contrato do "Não mexer no modo" (`none` = perfil sem a seção) | **PARCIAL.** O que sobra é o `sackboy.json` sem `mode` — **Z4** |
| [PERFIL-ATUAL-01](2026-08-10-PERFIL-ATUAL-01-a-linha-dela-tem-cor-e-o-primeiro-lugar.md) | O verde e o topo, **já entregues**; e o resolvedor `perfil_que_ela_ativou` que o **P1** promove a dono | **SIM.** P1 é a última perna dela |
| [POR-UNIDADE-01](2026-08-10-POR-UNIDADE-01-o-override-por-peca-alcanca-mais-abas.md) | O `controllers` no esquema, com validador de MAC — escrito e sem UM uso em 34 perfis | **NÃO.** P4 o torna visível; **editar** por controle é dela (§8) |
| [JOGOS-QUE-ELA-TEM-01](2026-08-06-JOGOS-QUE-ELA-TEM-01-escolher-da-biblioteca-em-vez-de-adivinhar-o-numero.md) | O campo que entende nome, endereço e número — **entregue**. A E4 (perfil por jogo instalado) nasceu depois, em `loader._talvez_semear_jogos` | **SIM** como investigação. A correção 3 do cabeçalho fecha a parte do resolvedor |
| [AUDIO-QUE-TRANCA-01](2026-08-03-AUDIO-QUE-TRANCA-01-um-toque-no-volume-congela-a-troca-de-perfil.md) | *"a E1 é uma linha e é o que trava o produto hoje"* — a MESMA família do **P3**: I/O bloqueante na thread do GTK travando a troca de perfil | **PARCIAL.** P3 cura o Salvar; a E1 do áudio é da onda do som |
| [PERFIL-MUDO-01](2026-08-10-PERFIL-MUDO-01-o-perfil-do-jogo-que-nao-entrou.md) | O campo `perfil_do_jogo_que_nao_entrou`, publicado no `state_full` e lido **só** pela "No jogo" (`painel_no_jogo.py:378`) | **NÃO.** O leitor existe, na aba errada para esta onda — é **Z5** |
| [PERFIL-JOGO-01](2026-07-26-PERFIL-JOGO-01-as-configs-somem-ao-abrir-o-jogo.md) | A queixa original de 26/07: *"a config que eu deixo nunca é respeitada"* | **NÃO.** A E1 (rodar o experimento **com ela**) nunca rodou, e sem ela as 2 a 6 não se sustentam. É dela |

---

## 7. O aceite

Nada fecha sem os cinco blocos. **Rode `git add -A` antes: os portões são cegos
a arquivo novo.**

```bash
git add -A
.venv/bin/python -m pytest -q
.venv/bin/python -m pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
.venv/bin/python scripts/check_paridade_transporte.py
```

> A segunda linha está aí de propósito: o portão da cura-nunca-ligada **não é
> coletado** pelo `pytest -q` (§2.2/11). Chamá-lo pelo nome é contorno, e
> contorno é gambiarra — mas é o contorno **declarado** desta onda, e o conserto
> de verdade (renomear ou ajustar `python_files`) é da Z6.

**Bloco 1 — as mordidas.** As quatro de P10 reprovam com a cura arrancada, com a
saída literal do pytest no commit. P1 reprova nomeando a aba divergente. P3
reprova com ~1,2 s. P5 reprova com `ptyxis`/`vivaldi`/`gedit`. P6 reprova sob
Xvfb com 320. P7 reprova com o `.lock` órfão.

**Bloco 2 — os perfis REAIS dela.** O par campo-a-campo do P0b roda de novo, na
árvore curada, nos três perfis (`sackboy.json`, `big_walk.json`,
`point_and_click.json`): abrir → mexer em cada aba → Salvar → **fechar** →
reabrir → comparar campo a campo. **Sobre cópia em `/tmp`, nunca sobre os
arquivos dela.** É o aceite que a Z4 exige, e teste de função pura não o
substitui.

**Bloco 3 — a foto.** A foto desta aba entra no lote da Z0, **com o
`retratar_abas.py` rodado por quem tem a Z0**, não por esta onda. `readme_perfis.png`
tem de mostrar a lista maior, a busca, e o campo "Nome:" populado (ou a resposta
do NÃO VERIFICADO nº 1 escrita em §8).

**Bloco 4 — o olho dela.** P1, P2, P4, P7, P8, a busca do P6 e a redação do P9
são **estruturais** (D3): foto de antes e de depois no lote, e a palavra final é
dela ([PROVA-DE-TELA-01](2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md)).
A altura do P6 é cosmética pré-aprovada e vai no mesmo lote **sem** esperar.

**Bloco 5 — quatro controles.** A pergunta dela ("funciona com 4?") não fecha por
leitura. **Às 22h de 23/08 o daemon reportava `coop.mesa == []`** (§2.3). Então:
ou a mesa cheia acontece e sai `retratar_abas.py --mesa-cheia`, ou **este bloco
fica declarado ABERTO com o motivo** — nunca fechado por analogia.

---

## 8. O que fica aberto, e de quem é

**Dela:**

- **Editar por controle.** P4 faz o perfil **mostrar** o que guarda; permitir
  ajuste por controle **no editor de perfil** é decisão de produto, e ela já
  fixou que a vontade da GUI prevalece. Zero dos 34 perfis dela usam o campo
  hoje — o que também é dado: talvez a resposta seja "não precisa aqui".
- **A queixa de 26/07** (`PERFIL-JOGO-01`, E1): rodar o experimento com ela e
  **nomear o sintoma**. Nenhuma sprint pode responder isso sozinha.
- **A E2 e a E5 da ESCOLHA-DELA-VENCE-01.**
- **O texto final da D-D** (P9). A decisão de reescrever agora é dela e já está
  tomada; a redação passa pelo olho dela.

**Da trilha de Bluetooth (dela com o assistente, na mesa do specs):**

- As três perguntas do §5, e a 2 é a mais urgente para esta aba, porque o botão
  já está na tela: **Modo Nativo com dois ou mais no rádio, e com quantos
  adaptadores.**

**Das outras ondas:**

- **Z2** — sem ela, P4 para. Dito no §P4 e repetido aqui de propósito.
- **Z4** — o `sackboy.json` sem `mode`, sem `controllers` e sem `ponte` é o caso
  de prova mais forte que a Z4 tem, e ele mora nesta aba. Quem executar a Z4 leia
  o §2.1/2.
- **Z5** — as quatro abas que `_refresh_all_tabs` **não** repinta (§4.1).
- **Z6** — o portão da cura-nunca-ligada não é coletado (§2.2/11). Fosse, teria
  pego o `pontes_confirmadas` sem leitor sozinho.
- **Z7** — a troca automática por jogo está cega na máquina dela agora (§2.1/4).
  **Nenhuma tarefa desta onda pode fechar dizendo "a troca por jogo funciona".**

**Aberto e sem dono, declarado:** a resposta ao NÃO VERIFICADO nº 1 (o campo
"Nome:" vazio na foto com "Pragmata" selecionado). Se A2 não a produzir na
rodada 0, ela sobe para cá com o nome de quem ficou.
