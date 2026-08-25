# PERFIS — ABRE O QUE GUARDA 01 · agente B7 · **retomada**

| | |
|---|---|
| **Árvore** | `hefesto-voo/PERFIS-ABRE-O-QUE-GUARDA-B7`, branch `voo/PERFIS-ABRE-O-QUE-GUARDA-B7` |
| **Base da retomada** | `cb7248f` (a leva B+C já integrada) |
| **Fechou ANTES** (a sessão que morreu às 6h10) | **P1**, **P3**, **P3b**, **P5**, **P10** — cinco commits, já integrados |
| **Fechou AGORA** | **P2**, **P7** (a metade que faltava), **P8**, e **o mecanismo real por trás do P9** |
| **Não fez** | **P4** (precisa de UMA linha no `main.glade`, de outra frente — ver abaixo), **P6** (idem, e a busca também), **P9 como escrito** (não reproduz — medido) |
| **Instrumento** | `PYTHONPATH` da própria árvore (`source .envrc-voo`), python de `hefesto-dualsense4unix/.venv` |
| **Portões** | `bash scripts/portoes.sh` → **TODOS VERDES — 23 portões** |

---

## O que resgatei ao chegar

A árvore tinha o **P2 inteiro** sem commit: a cura em `profiles_actions.py` e o
arquivo de teste ainda não rastreado, com **um vermelho**. Não refiz nada —
li, medi o vermelho e o corrigi.

**O teste errado era o teste, não o produto.** Ele exigia
`rotulo.visivel is False` quando não há carimbo, e esse rótulo **já falava**
antes do P2: com um appid fora da biblioteca desta bancada ele diz
`MSG_FORA_DA_MAQUINA`. A prova do silêncio não é "invisível" — é **idêntico ao
de ontem**: uma linha só, e nenhuma palavra sobre ponte. Trocado por isso, mais
um caso novo para o silêncio verdadeiro (campo vazio → rótulo escondido).

---

## O que mudou

### P2 — o carimbo de ponte sai do daemon e chega à tela · `2e47ffe`

O daemon publica `pontes_confirmadas` desde 19/08, e o comentário ao lado diz a
intenção em letra: *"para a janela dizer 'este jogo já sabe por onde entra'"*.
Dois hits no `grep`, **os dois em comentário**. Zero leitores. A aba
**preservava** o carimbo no Salvar e nunca o mostrou.

`frase_da_ponte_confirmada` é pura e fala o **léxico da aba Início**
(`_MODE_KIND_ITEMS`/`_MODE_FLAVOR_ITEMS`). Sem carimbo a linha **não diz nada**
— silêncio, nunca "ponte desconhecida".

**MEDIDO E ABERTO:** `pontes_confirmadas` existe no `daemon.status` e **não** no
`daemon.state_full`, que é o payload do tique. Por isso a busca é por **gesto**
(ao abrir a caixa do jogo), sem somar um segundo poller. Publicá-lo no
`state_full` é o conserto de fundo e mora no `daemon/` — **de outra frente**.
Idem o rótulo próprio no glade que a sprint pede: esta costura entrega o dado
no rótulo que já existe ao lado do campo do jogo, sem tocar o XML.

Dado real, não fixture inventada: o bloco `ponte` de `big_walk.json` dela.

### P7 — Remover diz que é o ativo · `a986529`

Apagar o perfil que está valendo era um clique sem uma palavra. Três frases, na
ordem que a casa exige (o quê, por quê, o que fazer), e **antes** do "permanente
e não pode ser desfeita" — a linha que se aprende a pular não fica na frente da
que muda a decisão.

Quem responde "qual perfil está valendo" é o **dono do §P1**, e o `nao_sei`
**cala**. Compara por **slug**, senão o aviso ficaria mudo justamente no caso
que ele existe para cobrir.

> **A metade do `.lock` JÁ ESTAVA FECHADA, e não por mim.** A Z4/T15 curou em
> 24/08 (`loader.py`, `unlink` fora do `with`), com régua em
> `tests/unit/test_z4_locks_orfaos.py`. **Conferido antes de escrever uma
> linha** — refazer teria dado dois donos ao mesmo conserto.

**ATENÇÃO DO REGENTE:** este commit toca **`app/gui_dialogs.py`**, que não está
na minha posse **nem na lista de ninguém**, e que o §P7 da minha sprint nomeia
como arquivo dela. A mudança é **aditiva e mínima**: um parâmetro opcional
`aviso: str | None = None` em `confirm_delete_profile`, com teste travando que
`None` deixa o diálogo **byte a byte** o de ontem. `git log` desde 24/08 18h
não mostra ninguém tocando o arquivo esta noite. Se colidir, é conflito de uma
assinatura só.

### P8 — o aviso de rádio frágil chega à aba que OFERECE o Modo Nativo · `7dec4ee`

`native_bt_fragil` tinha leitor em **um arquivo só** (`home_actions.py`), e é
esta aba que oferece "Conexão Nativa (Sony)" como um dos quatro botões —
inclusive num perfil de co-op.

**A frase é a mesma, e isso é o ponto.** `texto_do_radio_fragil` foi extraído de
`vpad_degradation_text` e virou **dono único**; as duas abas o chamam. O teste
afirma **igualdade de string**, não semelhança — e a mordida que *reescreve* a
frase reprova. O banner da Início não mudou; ele só parou de ser o dono, e há
teste travando isso.

**Sem tocar o `main.glade`:** a seção "Modo" inteira é montada em código (o
preço da máscara ao lado nasceu assim). E o `state_full` é buscado por **gesto**,
quando ela escolhe o Nativo.

### P9 — a sprint supôs um mecanismo; medi outro, e o outro é pior · `9ea07ac`

**O que a sprint dizia:** trocar o "Aplica a:" de "Jogo da Steam" para "Steam"
deixaria a lista de outros marcados mostrando N-1.
**NÃO REPRODUZ.** `profile_steam_input_outros` é **filho** de
`profile_steam_input_box`, e a troca de escolha chama
`_mostrar_caixa_do_steam_input(False)`, que **esconde o pai inteiro**. A lista
desatualizada existe e ninguém a vê. *(A linha que faltava em `:2181` é, pelo
mesmo motivo, defensiva: o caminho do campo já ressincroniza os dois. Não a
acrescentei — seria linha sem defeito e teste sem mordida.)*

**O que reproduz, e é pior: o esconder não dura.** Os widgets que esta aba
revela fazem `set_no_show_all(False)` para aparecer — a cura da
CAMPO-QUE-NAO-NASCIA-01 — e **nunca rearmavam**. O desarme é permanente, e
`app.py:show_window()` (bandeja, notificação, `kill -USR1`) chama
`window.show_all()`, que reexibe todo widget sem `no_show_all` armado.

**O gesto que reproduz:** escolher "Jogo da Steam", voltar para "Sempre", e
trazer a janela pela bandeja → a caixinha do Steam Input **reaparece sob um
"Aplica a:" que não é jogo da Steam**, com a lista de outros marcados de outra
escolha e o rótulo de exigência vazio.

O molde certo já estava no mesmo arquivo, uma seção acima:
`_sync_mode_options_visibility` faz `set_no_show_all(not is_gamepad)` — **arma e
desarma**. O glade também já dizia a intenção. Faltava rearmar, nos quatro
widgets escondíveis desta aba (o aviso do §P8 nasceu com a cura, não sem). E há
teste travando a metade que **não** pode ser desfeita: voltar para "Jogo da
Steam" tem de revelar a caixinha.

---

## As mordidas, com as duas saídas

| conserto | cura arrancada | saída |
|---|---|---|
| **P2** leitor | `frase_da_ponte_confirmada` → `None` | **8 failed**, 11 passed |
| **P2** costura | `do_carimbo = None` no rótulo | **2 failed**, 17 passed |
| **P2** devolvido | — | **19 passed** |
| **P7** leitor | `frase_da_remocao_do_perfil_ativo` → `None` | **4 failed**, 8 passed |
| **P7** costura | `aviso = None` em `on_profile_remove` | **1 failed**, 11 passed |
| **P7** diálogo | `gui_dialogs` joga o `aviso` fora | **1 failed**, 11 passed |
| **P7** devolvido | — | **12 passed** |
| **P8** leitor | `frase_do_radio_fragil_no_modo` → `None` | **5 failed**, 10 passed |
| **P8** reuso | frase **reescrita** em vez de reusada | **4 failed**, 11 passed |
| **P8** costura | `frase = None` no rótulo | **2 failed**, 13 passed |
| **P8** devolvido | — | **15 passed** |
| **P9** os quatro rearmes | `set_no_show_all(True)` → `(False)` | **4 failed**, 1 passed |
| **P9** devolvido | — | **5 passed** |

`__pycache__` apagado entre arrancar e devolver, toda vez.

---

## O que fica aberto, e o que exatamente falta

### P4 — o perfil mostra o que guarda por controle

**A Z2 fechou** (`app/alvo_de_edicao.py`), mas ela responde pelo alvo **atual**
(`uniq` + `label`), não traduz um `uniq` arbitrário guardado num perfil para
"Controle 2". O que falta é (a) o catálogo `uniq → número` vindo do
`state_full`, e (b) **uma linha no `main.glade`**, na coluna do editor — arquivo
de outra frente.

**A metade da preservação JÁ TEM RÉGUA, e não é minha:**
`tests/unit/test_gui_salvar_perfil_fonte_e_esparsidade.py` cobre o
`base["controllers"] = source.controllers` **inclusive por leitura do fonte**.
Não escrevi nada ali — seria a segunda régua para a mesma linha.

### P6 — a lista cabe, e ganha busca

Inteiramente em `gui/main.glade` (altura) + widget novo (busca). **Não toquei**:
o arquivo é de outra frente. A altura é cosmética pré-aprovada; a busca espera
o olho dela.

### O rótulo do §P2 e do §P8 no XML

As duas linhas chegam hoje por widgets **já existentes** ou **montados em
código**. Quando o `main.glade` estiver livre, o desenho da sprint (rótulo
próprio abaixo do campo do jogo; rótulo próprio na seção "Modo") é uma melhoria
de layout, **não** um requisito para o dado aparecer.

### `pontes_confirmadas` no `state_full`

Medido: existe no `daemon.status` e não no `daemon.state_full`. Enquanto for
assim, esta aba pergunta por gesto. O conserto de fundo é uma linha no
`daemon/ipc_handlers.py`.

### O par da F5 nº 8 (a redação da caixinha do Steam Input)

**Não mexi**, e aponto: o tooltip de `profile_steam_input_check` no
`main.glade` ainda promete *"o jogo vê só os controles do Hefesto"*, e a
medição de 23/08 (ESCONDE-SO-O-HIDRAW-01) diz que o jogo **continua vendo o
físico pelo evdev**. É fato errado na tela, em arquivo de outra frente, e a
frase irmã mora na aba Sistema. É a **D-D**, e continua aberta.

---

## Aguarda o olho dela (D3)

Três textos **novos nesta aba**, nenhum fotografado (a prova de tela não fecha
nesta madrugada, por ordem do regente):

1. **P2** — a linha do carimbo de ponte, em itálico, abaixo do nome do jogo.
   *Nascer visível ou colapsada é decisão dela.*
2. **P7** — o aviso de remoção do perfil ativo, no diálogo.
3. **P8** — o aviso de rádio frágil na seção "Modo". A frase é **velha na
   Início e nova aqui** — o que espera o olho dela é o lugar, não o texto.

O **P9** não pede olho: ele não muda nenhum estado que ela já visse: só impede
a volta do que a aba mandou sumir.

---

## Bancada — o que eu não pude medir

**Nada de rádio.** O hub USB dela saiu do barramento às 02h36, levando os três
adaptadores Bluetooth; `/sys/class/bluetooth/` está vazio. O §P8 é o conserto
que mais sofre com isso: a frase que ele traz para esta aba fala de **controles
no rádio sob Modo Nativo**, e essa é exatamente a situação que ninguém pôde
observar hoje.

O comando é dela, com o hub de volta e dois controles pareados:

```bash
.venv/bin/python -c "from hefesto_dualsense4unix.app import ipc_bridge as b; \
    s=b.daemon_state_full() or {}; \
    print(s.get('native_bt_fragil'), s.get('native_bt_fragil_controles'))"
```

Com Modo Nativo ligado e os controles no rádio, isso tem de sair
`True [<números>]` — e aí a linha do §P8 acende no editor ao escolher "Conexão
Nativa (Sony)", nomeando os mesmos números.
