---
sprint: STATUS-DIZ-O-QUE-VE-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# STATUS-DIZ-O-QUE-VÊ-01 — o hertz que sumiu e os cards fora de ordem

**24/08/2026. Onda 3 da fila em ondas** ([SPRINT_ORDER](../SPRINT_ORDER.md),
seção 0). **GRAU: MEDIDO** — cada número desta página tem o comando ao lado.
Onde não foi medido, está escrito **NÃO VERIFICADO**, e isso é informação.

**O que esta sprint fecha:** a aba Status passa a dizer só o que ela vê, e a
dizer tudo o que já sabe. O hertz do giroscópio volta à tela (ou some
declaradamente), a ordem dos cards passa a ser a ordem da fita, o bloco de som
para de aceitar gesto que o mapa mede como sem canal, e a resposta que o daemon
já escreve sobre o microfone chega a quem clicou.

**O que ela NÃO faz:** não mapeia Bluetooth (trilha dela, D2 — ver §6), não
mexe na aba **No jogo** além de não quebrá-la (Onda 4, mesmo arquivo, mesmo
agente-dono, **sequencial**), não toca no daemon salvo para propagar campo que
ele já calcula, e não redesenha bloco nenhum: as caixas ficam onde estão.

**Restrição dura, e ela é de arquivo:** a aba **No jogo** não tem arquivo
próprio — mora em `app/actions/status_actions.py:569-891` e importa o widget
desta aba. **Nenhum agente desta onda roda em paralelo com a Onda 4.**

---

## 1. O defeito, em uma frase

A aba que existe para dizer a verdade sobre o controle mostra um vão vazio de
910 px onde deveria estar o hertz do giroscópio, numera os cards numa ordem e a
fita de alvo em outra, e oferece quatro gestos de som por rádio onde o mapa da
casa registra que não há canal.

---

## 2. O que está MEDIDO

Bancada: 23/08/2026, 21h51–21h55. **ZERO DualSense físicos** —
`/sys/class/hidraw/hidraw4` é o **nosso próprio vpad** (`HID_NAME=DualSense
Wireless Controller (Hefesto P1)`). Nenhum número desta seção sobre 2 ou 4
controles vem de aparelho na mesa; os de quatro vêm da fixture versionada, e
está dito onde.

### 2.1 O hertz não existe em configuração nenhuma da janela

Três leituras independentes do mesmo arquivo, `app/widgets/controller_card.py`:

| o quê | linha | estado |
|---|---|---|
| `_verdade_label` (a linha "No jogo agora: giroscópio (~194 Hz)…") | criado em `:2598`, atribuído em `:2606` | **nunca empacotado** — `grep -n "pack_start(verdade"` → vazio |
| `_motion_label` (a linha discreta GYRO-03) | criado em `:2465`, empacotado em `:2471` | empacotado **só** sob `if self._compact:` |
| `slot_motion` (a caixa que reserva o lugar dele) | `:2497`, `:2498`, `:2516` | **as três únicas ocorrências** — a caixa nasce vazia e nada entra nela |

E o `compact` nunca é verdadeiro em produção:

```
$ grep -n "compact=True" src/            # 1 achado, e é DOCSTRING
src/.../controller_card.py:2094:  card = ControllerCard(compact=True)   # compact = 2+ cards
$ sed -n '1320,1322p' src/.../actions/status_actions.py
            card = ControllerCard(
                compact=False, mostrar_estado_global=not compact
            )
```

`compact = len(keys) >= 2` é calculado em `status_actions.py:1298` e usado só
para `mostrar_estado_global` e para o frame "Estado". **Desde a EMPILHA-02
(02/08/2026) a aba não constrói card compacto nenhum.**

Consequência encadeada, e é o título desta sprint: `_update_motion`
(`:4557-4563`) sai cedo porque `get_parent() is None`; `_update_verdade`
(`:4565-4579`) chama `show()` num widget sem pai, que é no-op. **Nenhuma das
duas linhas alcança a tela, e o hertz do giroscópio não aparece em
configuração nenhuma da janela.** O pedido dela de 01/08 — *"a bateria fica ao
lado do hertz do giroscópio até o final"* — foi cumprido por 16 dias e desfeito
pela SEM-BARRA-DA-VERDADE-01 em 17/08, que desempacotou a linha da verdade sem
que ninguém notasse que ela era a única portadora do número.

**A caixa vazia, medida na foto de hoje** (régua: `GdkPixbuf` sobre
`docs/usage/assets/readme_status.png`, 1920x1080, foto de 23/08 18h15):

```
conteúdo do corpo do card começa em  x = 289
"Bateria:" começa em                 x = 1211
=> slot_motion vazio ≈ 1211 - 12 (spacing) - 289 = 910 px
```

São 910 px de nada empurrando a bateria para a borda direita do card, e a
`faixa` os entrega de propósito (`faixa.pack_start(slot_motion, True, True,
0)`) a um widget que não tem filho.

**Na mesma foto:** o card termina em `y = 522`; a janela tem 1080. **555 px de
aba vazia** abaixo do card com um controle. (Com quatro, a aba pede 2055 px —
`mesa_cheia_status_inteira.png`, ver [COMO-OLHAR-A-TELA](../COMO-OLHAR-A-TELA.md).)

### 2.2 Os cards estão numa ordem e a fita em outra

Duas funções, dois critérios, mesma mesa:

* **cards** — `status_actions.py:1211` monta a partir de
  `_connected_controllers(state)`, que é a **ordem de enumeração do daemon**;
* **fita/seletor** — `status_actions.py:1501` ordena com
  `_por_numero_de_identidade`, que é a **ordem do `player_slot`**.

Medido contra `tests/fixtures/state_full_quatro_controles.json` — o arquivo
versionado que o `--mesa-cheia` usa para fotografar:

```
índice 0 -> player_slot 4, player 1, usb
índice 1 -> player_slot 1, player 2, usb
índice 2 -> player_slot 3, player 3, bt
índice 3 -> player_slot 2, player 4, bt
```

Com `titulo_do_card` (`controller_card.py:1018-1037`, "Controle
{player_slot} — {TRANSPORTE} · Jogador {player}"), a tela lê, de cima para
baixo:

```
Controle 4 — USB · Jogador 1
Controle 1 — USB · Jogador 2
Controle 3 — BT  · Jogador 3
Controle 2 — BT  · Jogador 4
```

e a fita, da esquerda para a direita: `Sony 1 · USB | Sony 2 · BT | Sony 3 · BT
| Sony 4 · USB`. **O segundo chip da fita é o quarto card da tela.** Quem
aponta para "Sony 2" e olha o segundo card está olhando outro controle.

### 2.3 Perfil ativo: dois vereditos sobre o mesmo fato, agora

```
$ cat ~/.config/hefesto-dualsense4unix/active_profile.txt
Sackboy                                    (escrito em 22/08 20:27)
$ ... call("daemon.state_full")["result"]["active_profile"]
None
```

`status_actions.py:2700` faz `state.get("active_profile") or "Nenhum"`. A aba
Status escreve **"Perfil ativo: Nenhum"** (é o que a foto de hoje mostra) com o
marcador manual dela dizendo `Sackboy` no disco. `utils/session.py:114-135`
declara por escrito que, quando os dois divergem, **é o marcador que carrega a
intenção manual** — e a Status não o consulta.

### 2.4 A mesa que o daemon publica não é a mesa que o daemon publica

Mesma conexão, mesmo payload, 21h53, com zero DualSense no sistema:

```
daemon.status                       -> connected: true, transport: bt, battery_pct: 75
daemon.state_full (topo)            -> connected: true, transport: bt, battery_pct: 75
daemon.state_full ["controllers"][0]-> connected: false, transport: null, player: null
controller.list                     -> connected: false, transport: null
```

É a F6 do diagnóstico, e é a razão de esta onda depender da Z5. Enquanto o topo
e a lista discordarem, a barra de bateria desta aba afirma **75 %** de um
controle que não existe.

### 2.5 O som: quatro gestos por rádio, e a única guarda é o endereço

`_update_guarda_de_audio` (`controller_card.py:4851-4891`) tem **um** portão:
`if self._uniq is None`. **Não há portão de transporte.** Com um DualSense por
rádio, `uniq` existe, e o bloco inteiro fica sensível:

| gesto | o que o mapa mede para o DualSense |
|---|---|
| controle deslizante do alto-falante | `audio.alto_falante` — `cabo_aciona=parcial`, **`radio_aciona=não`** |
| "Sons do jogo" / "Todo o som do PC" | `audio.alto_falante.rota` — cabo `sim`, **rádio `não`** |
| "Silenciar" do alto-falante | idem acima |
| botão da rota do sistema (`btn_som_no_controle`) | idem acima — **e ele nem está na tela com um controle na mesa** (§2.10) |
| controle deslizante do microfone | **não tem linha no mapa** (ver §2.6) |
| "Silenciar" do microfone | `audio.microfone.mudo` — cabo `sim`, rádio **`parcial`** |

Régua: `docs/data/mapa-controles.csv`, 308 linhas, **49 colunas**, filtrado por
`chave` e `controle=dualsense`. E o estado do daemon agora:
`bt_mic = {"enabled": false, "running": false, "uniqs": []}` — a ponte de
microfone por rádio está desligada.

### 2.6 Uma coluna do mapa e um controle da tela têm o mesmo nome e não são a mesma coisa

`audio.microfone.volume` está `não` no cabo **e** no rádio. O controle
deslizante do microfone no card **não** é essa linha: ele chama
`ipc_bridge.mic_volume_set` (`controller_card.py:3684`), que é o **ganho da
fonte de captura no PipeWire** (camada 1), enquanto a linha do mapa é o campo
`mic_volume` do report de saída do firmware (camada 3) — a distinção está
escrita em `ipc_bridge.py:1036-1042`. **O mapa não tem linha para a camada que
a tela oferece.** Isto não é contradição; é um buraco de vocabulário que faz
qualquer auditoria futura ler a tela como mentirosa.

### 2.7 A cura de ontem não tem chamador

A [ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) criou em
23/08 as três portas que devolvem o CORPO da resposta do daemon:

```
$ grep -rn "mic_set_detalhado\|mic_volume_set_detalhado\|speaker_set_detalhado" src/ | grep -v ipc_bridge.py
(vazio)
```

**Zero chamadores de produção.** O card continua em `mic_set` / `mic_volume_set`
/ `speaker_set` (`controller_card.py:3186`, `:3684`, `:3792`, `:3874`,
`:4059`, `:4083`), que devolvem `bool`. E o daemon, do outro lado, **já
calcula** o que a tela não recebe: `daemon/ipc_handlers.py:4533-4538` devolve
`por_uniq` com o comentário *"a tela precisa saber SE o alvo foi honrado […] é
justamente a diferença entre mexer no microfone dela e no de outra pessoa"*.

### 2.8 A privacidade prometida por escrito não é a que o código faz

`set_status_tab_visivel` (`status_actions.py:891-916`) promete na docstring:
*"Sair da aba MATA o `parec` de cada controle: manter um processo capturando o
microfone da usuária com a janela em outra aba — ou minimizada — seria custo e
intromissão"*. E `docs/usage/interface.md` repete: *"as threads morrem quando
você sai dela"*.

Os chamadores são dois: `app.py:1124` (`switch-page`) e `app.py:487`
(`delete-event`, janela indo para a bandeja).

```
$ grep -rn "window-state-event\|iconified" src/hefesto_dualsense4unix/app/
(nada)
```

**Minimizar a janela não dispara nenhum dos dois.** Com a aba Status à vista e
a janela minimizada, o `parec` de cada controle continua capturando. A palavra
"minimizada" na docstring é fato errado, e sai — de lá e de `interface.md`.

### 2.9 Documentação que descreve uma linha inexistente

`docs/usage/interface.md:100` descreve a linha **"No jogo agora: …"** como
estando na aba Status. Ela não está na tela desde 17/08/2026 (§2.1). E o
comentário de `controller_card.py:4553` afirma que *"no card único o
giroscópio é dito pela linha da verdade"* — a mesma afirmação, dentro do
código, na linha que decide não pintar.

### 2.10 "Ouvir no controle" não está na tela com um controle na mesa

O segundo pedido dela de 01/08 — *"aquele botão de voltar ao anterior sai de lá
de cima e fica no espaço onde tem 'não ajustado' no alto-falante"* — tem a
máquina inteira construída (`status_actions.py:1341-1428`) e **um destino que
nunca existe**:

```
$ grep -n "_speaker_rota_slot" src/
.../actions/status_actions.py:1387:  destino = getattr(primeiro, "_speaker_rota_slot", None)
.../widgets/controller_card.py:3554:  self._speaker_rota_slot = None
```

**Uma atribuição no arquivo inteiro, e ela é `None`.** A SOM-CANAL-01/E4 tirou
o "Soltar" da fileira do alto-falante e deixou o slot como `None` sem que o
outro lado soubesse. Logo `destino` é sempre `None`, o `_alojar_botao_da_rota`
sempre cai em `_devolver_botao_da_rota_ao_berco`, e o botão fica sempre no
`status_grid` — que mora dentro do `frame_status_estado`
(`gui/main.glade`, nesta ordem: frame → grid → botão, rótulo "Ouvir no
controle").

E o frame só aparece quando `compact or not keys`
(`status_actions.py:1338`). Com **exatamente um** controle — o caso dela, e o
da foto — `compact` é `False` e `keys` não é vazio: **o frame está escondido e
o botão não está na tela.** Confira a foto: o bloco Alto-falante mostra "Sons
do jogo", "Todo o som do PC" e "Silenciar", e nada mais.

Com 0 e com 2+ controles o botão aparece. É a forma exata do defeito mais caro
desta casa — a cura escrita e nunca ligada —, e o `_alojar_botao_da_rota`
continua com docstring afirmando que entrega a SOM-ROTA-NO-CARD-01.

### 2.11 Dezessete atributos escritos e nunca lidos

Varredura de `self._x = …` contra o resto do arquivo em `controller_card.py`:
`_battery_row`, `_coluna_audio`, `_coluna_sensores`, `_faixa_gyro_bateria`,
`_faixa_sticks`, `_glyph_grid`, `_glyph_size`, `_grupo_largura_mic`,
`_gyro_slot`, `_linha_inferior`, `_metade_esquerda`, `_mic_volume_enviado`,
`_miolo_inferior`, `_speaker_canal`, `_speaker_rota_slot`, `_speaker_titulo`,
`_linha_estado_global`. **Um deles é contrato vivo com outro arquivo** —
`_speaker_rota_slot`, lido por `status_actions.py:1387`, e é justamente o de
§2.10, que a varredura marca como mudo porque só recebe `None`. **A varredura
sozinha não distingue peso morto de contrato quebrado**, e é essa a lição da
tarefa T15.

---

## 3. O que é HIPÓTESE (e continua sendo até alguém medir)

* **NÃO VERIFICADO:** que a divergência de ordem de §2.2 apareça na tela. A
  medição é sobre a fixture e sobre o código, não sobre pixel — não há quatro
  controles nesta bancada e a foto de mesa cheia mais recente é de 14/08.
* **NÃO VERIFICADO:** que o `parec` de §2.8 realmente sobreviva à minimização
  na sessão COSMIC dela. O que está medido é a **ausência de gancho**; o
  processo vivo não foi observado.
* **NÃO VERIFICADO:** o efeito de qualquer gesto de som por rádio no aparelho.
  O mapa registra `radio_aciona=não` para o alto-falante com a nota "zero
  linhas de implementação" — isso é medição do **nosso código**, não do
  aparelho obedecendo ou recusando.
* **HIPÓTESE:** que os quinze atributos de §2.11 sejam removíveis. Quinze
  `getattr` mudos e uma suíte que constrói o widget não provam ausência de
  leitor; o portão de §5/T15 é que decide.

---

## 4. A COREOGRAFIA DOS AGENTES — dez, e a ordem importa

**A-1 é o agente-dono do arquivo, e é o MESMO que executa a Onda 4.** Ele roda
sozinho na janela desta onda; ninguém mais escreve em `status_actions.py` nem
em `controller_card.py` sem passar por ele. Os demais entregam **diff proposto
+ mordida**, e A-1 aplica.

| # | agente | roda | entrega |
|---|---|---|---|
| **A-1** | **dono do arquivo** — `status_actions.py` (2976 linhas) e `controller_card.py` (5476). Aplica todo diff dos outros, e é o único a tocar `install_no_jogo_tab` | **série, primeiro e último** | a árvore consistente; o veredito de conflito entre dois diffs |
| A-2 | dono do card: o hertz, os dois rótulos órfãos, a caixa vazia de 910 px | paralelo | T1, T2, T3 |
| A-3 | dono da ordem: cards × fita, `player_slot` × `player` × posição | paralelo | T4 |
| A-4 | dono do bloco de som: a guarda de transporte que não existe | paralelo | T6 |
| A-5 | dono da resposta do daemon: `por_uniq` e as três portas `_detalhado` sem chamador | paralelo | T7 |
| A-6 | dono do botão "Ouvir no controle": o slot que só recebe `None`, e a trava da ROTA-ÓRFÃ-01 | paralelo | T9 |
| A-7 | dono da privacidade: o `parec`, a docstring e a linha do `interface.md` | paralelo | T8, T11 |
| A-8 | dono do léxico do card: dois "Silenciar", `#ff79c6`, "acordado", "Controle 4 · Jogador 1" | paralelo | T10, T12, T13 |
| A-9 | dono dos sete arquivos de teste que medem o card compacto | paralelo | T5 |
| A-10 | dono das mordidas: o portão "existe chamador de PRODUÇÃO?" e o aceite | **série, por último** | T14, T15 e a §8 verde |

**Ordem:** A-1 abre (baseline dos portões, §8) → A-2..A-9 em paralelo, cada um
devolvendo diff + mordida → A-1 aplica na ordem T1→T13 → A-10 fecha.
**A-8 e A-3 devolvem proposta de TEXTO e param:** o que muda palavra na tela
precisa do olho dela antes (D3).

---

## 5. AS TAREFAS

Carimbo de tela, sempre: **[COSMÉTICA]** pré-aprovada por ela (foto depois, em
lote) · **[ESTRUTURAL]** precisa do olho dela ANTES · **[SEM TELA]**.

---

### T1 — a caixa vazia de 910 px morre · A-2 · **[COSMÉTICA]**

`controller_card.py:2497-2516`. O `slot_motion` nasce vazio e recebe
`expand=True, fill=True`. Enquanto não houver decisão sobre o hertz (T2), ele
sai: a `faixa` passa a ter só `linha_bateria`, com `pack_end` e `halign=END`, e
a bateria fica onde já está sem 910 px de vão pagos por um widget sem filho.

**A mordida:** `test_status_faixa_gyro_bateria` mede a alocação do primeiro
filho da `faixa` num `Gtk.OffscreenWindow` e exige `<= 4 px` OU nenhum filho
além da bateria. Arranque o `pack_end` e devolva o `slot_motion` vazio: o teste
tem de reprovar com o número (≈910), não com "falhou".
**Armadilha:** widget sem alocação mede 1x1 — drene o laço **duas** vezes antes
de medir ([COMO-OLHAR-A-TELA](../COMO-OLHAR-A-TELA.md), §armadilhas de GTK).

**Custo:** ~15 linhas de produção, ~40 de teste. 1 h.

---

### T2 — o hertz volta, ou some declaradamente · A-2 · **[ESTRUTURAL]**

`controller_card.py:2465-2520`, `:4545-4579`. Há duas saídas e **a escolha é
dela**:

* **(a) devolver a linha** — `faixa.pack_start(self._motion_label, …)` no lugar
  do `slot_motion`, e a bateria volta a ficar *ao lado do hertz*, que é o
  pedido literal de 01/08. Uma linha de código; o rótulo já é alimentado a
  cada tique.
* **(b) pôr o hertz no título do bloco** — `"Giroscópio (graus/s) · ~194 Hz"`,
  no rótulo da moldura que já existe (`_montar_gyro`, `:2833`). Nada de linha
  nova; o número entra onde os graus já estão.

A-2 **não escolhe**: entrega as duas com foto offscreen de cada uma e para. É
texto novo na tela — D3 manda pedir o olho dela antes.

**A mordida:** `test_o_hertz_chega_a_tela` monta o card **como a aba o monta**
(`ControllerCard(compact=False, mostrar_estado_global=True)`), alimenta
`motion_hz=194.0` e varre a árvore de widgets atrás de `"Hz"` em `get_text()`.
Com a árvore de hoje o teste **reprova**, e é essa reprovação que prova a
mordida. Arrancar o `pack` da cura o faz reprovar de novo.

**Custo:** 1 a 6 linhas de produção, ~60 de teste. 2 h + a decisão dela.

---

### T3 — o comentário que a leva seguinte tornou falso · A-2 · **[SEM TELA]**

Dois lugares afirmam que o card único diz o giroscópio pela linha da verdade, e
os dois estão errados desde 17/08:

* `controller_card.py:4553` — *"no card único o giroscópio é dito pela linha da
  verdade, que o contém e amplia"*;
* `controller_card.py:2510` — *"**O rótulo continua existindo e continua sendo
  alimentado.** Só não é EMPACOTADO"*, que descreve a linha da verdade sem
  dizer que ela era a única portadora do hertz.

Regra da casa: **fato errado se SUBSTITUI**, e sai de todos os lugares. Nota
datada no lugar do primeiro, com a data em que deixou de ser verdade.

**A mordida:** nenhuma automática — é texto. O portão é a revisão de A-1, que
confere que nenhuma outra ocorrência de "linha da verdade" no `app/` promete
tela.

**Custo:** ~12 linhas. 20 min.

---

### T4 — a ordem dos cards passa a ser a ordem da fita · A-3 · **[ESTRUTURAL]**

`status_actions.py:1211`. `_sync_status_cards` passa a montar sobre
`_por_numero_de_identidade(self._connected_controllers(state))` — a **mesma**
lista ordenada que a fita já usa (`:1501`). O índice de enumeração que cada
card carrega **não muda**: é ele que o `controller.target.set` espera, e
reordená-lo seria o defeito pior que a própria `_por_numero_de_identidade`
documenta em `:1465-1470`.

Estrutural porque muda o que se vê ao abrir com 2+ controles.

**A mordida:** `test_a_ordem_dos_cards_e_a_ordem_da_fita` carrega
`tests/fixtures/state_full_quatro_controles.json`, monta a aba e exige que a
sequência de `player_slot` dos cards seja **idêntica** à das linhas de
`_controller_target_rows` sem a linha "Todos". Com o código de hoje o teste
reprova mostrando `[4,1,3,2]` contra `[1,2,3,4]`. Arranque a ordenação: volta a
reprovar com os mesmos dois vetores.

**Custo:** ~4 linhas de produção, ~50 de teste. 1,5 h.

---

### T5 — os sete arquivos que medem um card que a aba não constrói · A-9 · **[SEM TELA]**

Sete arquivos passam `compact=True`, e produção nunca o passa (§2.1):

```
tests/unit/test_card_unico_01.py                    tests/unit/test_status_faixa_blocos.py
tests/unit/test_layout_orcamento_altura.py          tests/unit/test_status_som_02_controle_de_volume.py
tests/unit/test_quem_e_quem_01_na_tela.py           tests/unit/test_status_som_e_janela.py
tests/unit/test_status_cards_sensores.py
```

Duas saídas, e A-9 tem de escolher **por arquivo**, com o motivo escrito: ou o
teste vira `compact=False` (mede o que a aba monta), ou fica e ganha um
comentário datado dizendo que trava um modo que **nada em produção constrói** —
guardando o caminho de volta, como o `_verdade_label` fez e ninguém leu.
Junto: a docstring de `controller_card.py:2094` (`ControllerCard(compact=True)
# compact = 2+ cards`) é fato errado desde 02/08 e **sai**.

**A mordida:** `test_o_modo_compacto_tem_dono` faz `grep` por `compact=True` em
`src/` e exige **zero** fora de docstring, OU um chamador de produção. Ligue
`compact=True` num lugar qualquer de `src/`: reprova nomeando arquivo e linha.

**Custo:** ~80 linhas entre os sete + 30 de portão. 3 h.

---

### T6 — o bloco de som ganha guarda de transporte · A-4 · **[ESTRUTURAL]**

`controller_card.py:4851-4891`. `_update_guarda_de_audio` passa a ter **duas**
perguntas: endereço (já tem) e **transporte**. Por rádio, as peças que o mapa
mede como `radio_aciona=não` nascem insensíveis com dica única e honesta — a
frase vem do CSV, não da cabeça de quem escreve (é o elo da Z6/PAREAMENTO-01).

O que **não** muda: o mudo do microfone (`radio_aciona=parcial`) fica sensível;
"parcial" não é "não", e apagar o que funciona pela metade é pior que a doença.

Estrutural: muda o que se vê ao abrir com um controle por rádio.

**A mordida:** `test_o_som_por_radio_nao_promete` alimenta o card com
`transport="bt"` e exige `get_sensitive() is False` nas quatro peças de
alto-falante e `True` no "Silenciar" do microfone. Arranque a guarda: as quatro
voltam a `True` e o teste reprova nomeando cada uma. **Segunda régua,
obrigatória:** o mesmo teste lê a linha do CSV em vez de repetir o valor — se
alguém mudar `radio_aciona` para `sim`, o teste muda de expectativa sozinho, e
é isso que faz a medição dela chegar à tela sem faxina manual.

**Custo:** ~45 linhas de produção, ~80 de teste. 3 h.

---

### T7 — a resposta que o daemon já escreve chega a quem clicou · A-5 · **[ESTRUTURAL]**

`controller_card.py:3186`, `:3684`, `:3792`, `:3874`, `:4059`, `:4083` trocam
`mic_set` / `mic_volume_set` / `speaker_set` pelas três `_detalhado` que
existem e não têm chamador (`ipc_bridge.py:1010`, `:1074`, `:1158`), e o
`por_uniq` de `daemon/ipc_handlers.py:4533-4538` vira a diferença entre "mudei
o teu microfone" e "mudei o microfone da mesa".

Estrutural porque nasce texto novo na tela quando o alvo **não** é honrado. A-5
entrega a frase; o olho dela decide.

**A mordida:** `test_o_gesto_de_som_diz_em_quem_pegou` mina o `_corpo_do_daemon`
para devolver `por_uniq` de OUTRO controle e exige que o card não diga a
palavra de sucesso. Arranque a leitura do campo: o card volta a comemorar e o
teste reprova. **É a forma da mordida da F1, e vale para as sete abas.**

**Custo:** ~60 linhas de produção, ~90 de teste. 4 h.

---

### T8 — o `parec` morre quando a janela some · A-7 · **[SEM TELA]**

`app/app.py`. Ligar `window-state-event` na janela e chamar
`set_status_tab_visivel(False)` quando `GDK_WINDOW_STATE_ICONIFIED` entra —
simétrico ao `delete-event` de `:487`, com o mesmo `getattr` defensivo. E a
docstring de `status_actions.py:891` para de prometer o que não fazia:
**a palavra "minimizada" só volta ao texto depois que o gancho existir.**

**A mordida:** `test_minimizar_mata_a_captura` monta o app com o monitor
dublado, emite o evento de estado com o bit de iconificação e exige
`set_ativo(False)`. Arranque o handler: o dublê nunca recebe `False` e o teste
reprova.

**Custo:** ~25 linhas de produção, ~50 de teste. 1,5 h.

---

### T9 — "Ouvir no controle" volta à tela · A-6 · **[ESTRUTURAL]**

§2.10. O botão não está na tela com um controle na mesa — que é o caso dela.
`controller_card.py:3554` dá `None` ao slot, e `status_actions.py:1387` obedece.

Duas metades, e a ordem importa:

1. **o slot ganha corpo.** `_montar_speaker` cria uma `Gtk.Box` de verdade no
   lugar onde o "Soltar" saiu, e a atribui a `self._speaker_rota_slot`. O
   `_alojar_botao_da_rota` passa a ter destino e a reparentar, como a docstring
   dele já promete desde 01/08. Nada muda com 0 e com 2+ controles: lá o berço
   continua sendo o `frame_status_estado`, pela razão que a EMPILHA-02 mediu (a
   saída padrão do sistema é fato do SISTEMA, e dois cards teriam dois botões
   para um interruptor só).
2. **a trava, que é o motivo de A-6 existir.** A ROTA-ÓRFÃ-01 já foi paga uma
   vez em 01/08 — plugar um segundo controle destruía o card e deixava o botão
   sem pai, e ela perdia o desfazer da rota **exatamente no co-op**.

Estrutural: um botão volta a aparecer numa tela onde não estava.

**A mordida, e são duas:**
`test_o_botao_da_rota_esta_na_tela_com_um_controle` monta a aba com 1 controle
e exige que o botão tenha pai **e** que a cadeia de pais até a raiz esteja toda
visível. Devolva `self._speaker_rota_slot = None`: reprova dizendo que o botão
está dentro de um frame escondido — **e com o código de hoje ela já reprova**,
que é a prova de que morde.
`test_o_botao_da_rota_nunca_fica_sem_pai` percorre 1 → 2 → 0 → 1 controle e
exige `get_parent() is not None` nos quatro estados. Renomeie o atributo no
card: reprova. Junto, a asserção de contrato entre arquivos — o nome lido em
`status_actions.py:1387` tem de existir em `ControllerCard`, que é o portão
que teria pego este defeito no dia em que ele nasceu.

**Custo:** ~20 linhas de produção, ~110 de teste. 3 h.

---

### T10 — dois "Silenciar" a 90 px um do outro · A-8 · **[ESTRUTURAL]**

Medido na foto de hoje, coluna x=1310: o "Silenciar" do microfone ocupa
`y 324-360`, o do alto-falante `y 450-496` — **90 px de vão** entre eles, mesma
coluna, mesma palavra, dois assuntos diferentes. Constantes em
`controller_card.py:468` e `:702`.

A-8 propõe a desambiguação **partindo do léxico que já existe** — os blocos já
se chamam "Microfone" e "Alto-falante", e é de lá que o texto sai. Entrega
proposta + foto offscreen e **para**: é texto reescrito na tela.

**A mordida:** `test_dois_botoes_nao_dizem_a_mesma_palavra` varre a árvore do
card atrás de `Gtk.Button` com rótulo idêntico e exige zero pares. Devolva as
duas constantes iguais: reprova nomeando as duas.

**Custo:** ~10 linhas de produção, ~40 de teste. 1 h + a decisão dela.

---

### T11 — a documentação para de descrever a linha que sumiu · A-7 · **[SEM TELA]**

`docs/usage/interface.md:100` descreve a linha "No jogo agora: …" como sendo da
aba Status. Ela não está lá desde 17/08. O parágrafo é **substituído** pelo que
a foto mostra, e a promessa das threads (linha seguinte) é ajustada ao que T8
entregar — nem antes, nem em promessa.

**A mordida:** o portão de referências e o de acentuação já rodam; o que falta
é a foto. `retratar_abas.py` roda **depois** desta onda inteira, uma vez, e as
imagens do `README.md` e do `interface.md` passam a ser a tela de hoje.

**Custo:** ~15 linhas de documentação. 30 min.

---

### T12 — a bateria para de afirmar o que foi rebaixado a inferência · A-8 · **[ESTRUTURAL]**

`status_actions.py:968-988`, `_set_battery_text`. A barra escreve um número
exato ("80 %", na foto). O mapa registra, na linha `energia.bateria.percentual`
do DualSense, que em **15/08/2026 (D-14)** o `de_onde_sei` foi **rebaixado de
`medido` para inferência de código** — *"a evidência registrada descreve LEITURA
DE FONTE (arquivo, linha, grep), não medição no aparelho"*. E hoje o daemon
publica `battery_pct: 75` com **zero** controles no sistema (§2.4).

Não é para tirar o número. É para o número parar de aparecer quando a fonte não
existe — a Z5 é quem entrega a régua de "quem está na mesa", e esta tarefa a
consome. **É a afirmação mais silenciosa e mais crível da aba**, e por isso a
mais cara quando erra.

**A mordida:** `test_a_bateria_cala_com_a_mesa_vazia` alimenta o estado exato
medido em §2.4 (topo `connected:true, 75%`, `controllers[0].connected:false`) e
exige que a barra **não** mostre porcentagem. Arranque a checagem: volta a
"75 %" com a mesa vazia, e o teste reprova citando o payload.

**Custo:** ~20 linhas de produção, ~60 de teste. 2 h.

---

### T13 — "Controle 4 · Jogador 1" · A-8 · **[ESTRUTURAL]**

`controller_card.py:1018-1037`. O título carrega **dois** números que não são o
mesmo (`player_slot` e `player`) e **nenhum** dos dois é a posição do card na
tela — o que §2.2 mede. Depois de T4 a posição e o `player_slot` coincidem, e
sobra o par `4 · 1`.

Junto, dois rótulos crus que a foto mostra: **`#ff79c6`** abaixo da Lightbar
(`controller_card.py:3216`, `:4530`) e o sufixo **"acordado"**
(`:880`), que é jargão do WirePlumber num card lido por quem quer jogar.

E o carimbo do mapa: `luz.led_jogador.leitura` é **`parcial` nos dois
transportes**, com a ressalva *"Fonte de INTENÇÃO, nunca de estado. Não existe
report de entrada nem feature que devolva o padrão que o FIRMWARE está
exibindo"*. O título afirma "· Jogador N" como fato observado; é intenção.

A-8 entrega proposta de texto e para.

**A mordida:** `test_o_titulo_nao_afirma_o_que_o_mapa_chama_de_intencao` lê a
linha do CSV e, enquanto `aciona` for `parcial`, exige que o título **não**
apresente o número de jogador como leitura — a mesma régua-que-lê-o-mapa da T6.

**Custo:** ~25 linhas de produção, ~70 de teste. 2 h + a decisão dela.

---

### T14 — o portão que falta na casa inteira: "existe chamador de PRODUÇÃO?" · A-10 · **[SEM TELA]**

Nenhum portão desta casa faz esta pergunta, e ela é a forma da F2. Escopo
**desta aba** (a generalização é da Onda 12): um `scripts/` que, para uma lista
declarada de símbolos de `app/ipc_bridge.py` e de `app/widgets/`, exige pelo
menos um chamador fora do arquivo de definição e fora de `tests/`.

Alvos de estreia, todos medidos em §2.1, §2.7 e §2.10: `mic_set_detalhado`,
`mic_volume_set_detalhado`, `speaker_set_detalhado`, `_verdade_label`,
`_motion_label` e `_speaker_rota_slot` — este último na variante do portão que
importa aqui: **o atributo tem leitor em outro arquivo e nunca recebe valor**.

**A mordida:** o portão roda contra a árvore de **hoje** e **reprova**,
nomeando os cinco. É essa reprovação que o valida. Depois de T2 e T7 ele fica
verde; devolva qualquer um dos cinco ao estado de hoje e ele reprova de novo.

**Custo:** ~120 linhas de script, ~40 de teste. 3 h.

---

### T15 — os quinze atributos mudos · A-10 · **[SEM TELA]**

§2.11. A varredura não distingue peso morto de contrato entre arquivos — um
dos dezessete são contrato vivo. A-10 classifica os quinze restantes um a um,
**com o `grep` ao lado de cada um**, e remove só os que nenhum arquivo do
repositório (produção **ou** teste) lê. Os que ficam ganham uma linha dizendo
quem os lê.

**A mordida:** o portão de T14, ampliado para atributos `self._` do
`ControllerCard`. Devolva um dos removidos: ele reprova.

**Custo:** ~60 linhas removidas, ~30 de portão. 2 h.

---

## 6. O QUE O BLUETOOTH BLOQUEIA

D2: o mapeamento de rádio é trilha **dela** com o assistente, na mesa do specs.
Esta aba **não pode afirmar na tela** o que estas cinco perguntas não
responderem. Enquanto elas estiverem abertas, o texto é de recusa, nunca de
promessa.

| pergunta aberta | o que a aba NÃO pode afirmar | o que o mapa registra hoje |
|---|---|---|
| **o alto-falante emite por rádio?** | nada no bloco Alto-falante: nem volume, nem rota, nem "Silenciar" (T6) | `audio.alto_falante` do DualSense: `radio_aciona=não`. Ressalva de 11/08: por cabo é placa **USB Audio Class**, não HID — *"assimetria dura, e do aparelho, não do produto"* |
| **existe fonte de captura de microfone por rádio?** | que o medidor de nível mede alguma coisa; "Sem sinal" é indistinguível de "não existe fonte" | `audio.microfone`: `radio_aciona=parcial`. Daemon agora: `bt_mic = {enabled:false, running:false, uniqs:[]}` |
| **qual a taxa real do mudo por rádio?** | número nenhum de taxa de sucesso | os percentuais estão **declarados caducos no próprio CSV**; `audio.microfone.mudo` no rádio é `parcial`, e a ressalva diz que *"um `mic unmute` evapora no próximo handle novo, em silêncio"* |
| **a bateria lida por rádio bate com o aparelho?** | porcentagem exata como fato observado (T12) | `energia.bateria.percentual`: `de_onde_sei` **rebaixado para inferência de código em 15/08 (D-14)** |
| **o LED de jogador pega por rádio?** | "· Jogador N" como leitura do aparelho (T13) | `luz.led_jogador.leitura`: `parcial` nos dois — *"fonte de INTENÇÃO, nunca de estado"* |

**A sexta, e é de vocabulário, não de rádio:** o mapa **não tem linha** para o
ganho de captura no PipeWire, que é o que o controle deslizante do microfone
move (§2.6). Enquanto ela não existir, ninguém consegue auditar aquele controle
contra o specs — e é exatamente o buraco que a PAREAMENTO-01 fecha.

---

## 7. AS SPRINTS ABSORVIDAS

| sprint | o que ela contribui | morre ao fim desta? |
|---|---|---|
| [PAINEL-DA-VERDADE-01](2026-08-01-PAINEL-DA-VERDADE-01-a-aba-status-diz-o-que-chega-ao-jogo.md) | a linha do que chega ao jogo, e o hertz dentro dela — é a origem do defeito de T1/T2 | **sim**, com T2 |
| [MESA-CHEIA-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | a fita do alvo por cor; é a metade que T4 tem de casar com os cards | **sim**, com T4 |
| [SOM-DE-CADA-JOGADOR-01](2026-08-15-SOM-DE-CADA-JOGADOR-01-o-botao-que-nunca-funcionou-com-a-mesa-cheia.md) | o botão de som com a mesa cheia — o berço da T9 | **sim**, com T9 |
| [QUATRO-MICROFONES-01](2026-08-22-QUATRO-MICROFONES-01-a-ponte-esta-desligada-e-a-conta-diz-que-cabe.md) | a ponte de mic por rádio desligada — hoje `bt_mic.enabled=false` | **não**: a ponte é medição dela (D2). Fica a barreira de tela (T6) |
| [TRES-MODOS-DO-SOM-01](2026-08-16-TRES-MODOS-DO-SOM-01-o-que-sai-onde-e-quem-escolhe.md) | as três rotas e quem escolhe — o seletor "Sons do jogo"/"Todo o som do PC" | **não**: a rota 2 nunca foi exercida (ressalva do CSV). Fica aberta em §9 |
| [ESTADO-QUE-MENTE-01](2026-08-03-ESTADO-QUE-MENTE-01-o-daemon-afirma-controle-conectado-com-a-mesa-vazia.md) | o defeito de §2.4, reproduzido hoje sem alteração | **não**: a cura é da Z5. Esta onda a consome |
| [MESA-CHEIA-11](2026-08-13-MESA-CHEIA-11-a-janela-conta-um-quando-sao-quatro.md) | a contagem que a janela faz — `_dualsense_count`, que a Configurações e a Início consomem | **sim**, com T4 |
| [JANELA-CORTADA-01](2026-08-17-JANELA-CORTADA-01-o-rodape-que-o-gtk-diz-que-cabe.md) | o orçamento de altura — os 555 px de vão e os 2055 px de mesa cheia | **não**: o teto de altura de página segue aberto no SPRINT_ORDER |
| [STATUS-SIMETRIA-01](2026-07-26-STATUS-SIMETRIA-01-a-aba-que-era-pra-mexer.md) | o lugar do microfone à direita dos analógicos | **sim** |
| [STATUS-SIMETRIA-02](2026-07-27-STATUS-SIMETRIA-02-distanciar-nao-e-organizar.md) | a moldura por assunto, e o "distanciar não é organizar" que T1 obedece | **sim** |
| [ALINHA-DUAS-LINHAS-01](2026-08-01-ALINHA-DUAS-LINHAS-01-a-aba-status-que-ela-chamou-de-feia.md) | as duas metades nomeadas e o alinhamento do giroscópio — o desenho que T1 não pode quebrar | **sim** |
| [PLAYER-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | `_por_numero_de_identidade`, a ordenação que **só a fita usa** | **sim**, com T4 |

---

## 8. O ACEITE

**Baseline primeiro.** A-1 roda a lista inteira **antes** de tocar em qualquer
arquivo e registra os números; sem isso ninguém distingue o que esta onda
quebrou do que já estava vermelho.

```bash
git add -A                                  # os portões não veem arquivo novo
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
python3 scripts/validar-palavra-de-tela.py
python3 scripts/check_paridade_transporte.py
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
```

E o que é **desta** onda:

1. **`grep -rn "compact=True" src/`** → zero fora de docstring (T5).
2. **`grep -rn "_detalhado" src/ | grep -v ipc_bridge.py`** → pelo menos um
   chamador para cada uma das três (T7).
3. **O portão novo de T14 roda e passa** — e há um commit anterior em que ele
   **reprova nomeando os seis**, que é a prova de que ele morde.
4. **Onze mordidas novas verdes**, e cada uma com registro de que foi vista
   **reprovando** com a cura arrancada: T1, T2, T4, T5, T6, T7, T8, T9, T10,
   T12, T13. Três delas (T2, T9 e a de T14) já reprovam contra a árvore de
   **hoje** — é essa reprovação, registrada antes do conserto, que as valida.
5. **A foto:** `scripts/gui-captura/retratar_abas.py` roda **uma vez**, ao fim
   da onda inteira, e as onze saem juntas. O `--mesa-cheia` roda também: é a
   única prova possível de T4 sem quatro controles na bancada.
6. **A palavra dela** nas oito tarefas **[ESTRUTURAL]** — T2, T4, T6, T7, T9,
   T10, T12, T13 —, com foto antes e depois, na regra da
   [PROVA-DE-TELA-01](2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md).
7. **A Onda 4 roda depois, com o mesmo agente-dono.**

---

## 9. O QUE FICA ABERTO, E DE QUEM É

**Dela (D2 — a mesa do specs):**

* as cinco perguntas de rádio da §6. Enquanto não houver medição, T6 mantém o
  bloco de som fechado por rádio — e essa é a resposta certa, não um contorno;
* a **rota 2** do alto-falante ("Sons do jogo", L→fone e R→alto-falante): o
  CSV registra que **só a rota 3 foi exercida**. O seletor a oferece.

**Da Z5 (Onda 0), e esta onda a consome sem poder curá-la:** as duas fontes de
`connected` no mesmo payload (§2.4). T12 depende dela; se a Z5 escorregar, T12
escorrega junto e a barra de bateria continua afirmando 75 % de ninguém.

**Da Z6 / PAREAMENTO-01:** a linha que falta no mapa para o ganho de captura no
PipeWire (§2.6). Sem ela, o controle deslizante do microfone é a única peça
desta aba que **não dá para auditar** contra o specs.

**Da Onda 12:** generalizar o portão de T14 para as onze abas. Aqui ele nasce
com cinco alvos; a F2 do diagnóstico lista pelo menos mais seis fora desta aba
(`set_mask`/`clear_mask`, `suspend_vpads_for_steam_input`,
`prontuario_dos_jogos.py`, e as chaves publicadas sem leitor).

**Aberto e sem dono, e é o mais barato de perder:** os 555 px de vão com um
controle contra os 2055 px que quatro pedem (§2.1). Não é defeito hoje; é o
número que decide se a aba rola ou espreme quando a mesa enche, e o
SPRINT_ORDER já registra "o teto de altura de uma página de aba" como aberto.

---

## A regra que fica

**Widget desempacotado continua sendo alimentado, e o código continua parecendo
vivo.** `_verdade_label` recebe texto a cada tique, chama `show()`, tem teste
verde e classe própria — e não existe na tela desde 17/08. Nenhum portão desta
casa pergunta *"isto tem pai?"* nem *"isto tem chamador de produção?"*, e é
essa a mordida que faltava. Quando uma leva desempacotar um widget, ela tem de
dizer **o que mais aquele widget era o único a carregar** — aqui era o número
que ela pediu em 01/08 e que ninguém viu sumir por sete dias.
