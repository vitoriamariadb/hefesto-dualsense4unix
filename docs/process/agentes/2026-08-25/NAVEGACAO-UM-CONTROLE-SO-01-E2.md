# NAVEGAÇÃO — UM CONTROLE SÓ-01 · E2 — os três atalhos que sumiam, e a pergunta do rádio respondida no fonte

Agente E2, 25/08/2026. Árvore `hefesto-voo/NAVEGACAO-UM-CONTROLE-SO-E2`, branch
`voo/NAVEGACAO-UM-CONTROLE-SO-E2`. Quatro commits, `ba94ff1..e909b62`.

Posse do bloco `posse:`: `app/actions/mouse_actions.py`,
`app/actions/input_actions.py`, `daemon/subsystems/`. Nada fora dela foi
tocado.

## O que mudou

### 1. N1 — o gesto para de apagar o que a aba não mostra (`ba94ff1`)

`_persist_key_bindings_to_draft` escrevia a lista da TELA por cima de
`draft.key_bindings`, e a lista só cria linha para botão de `CANONICAL_BUTTONS`.
As três regiões do touchpad saíram dessa lista em 09/08 (TOUCHPAD-DO-SISTEMA-01,
decisão dela) e **continuam** em `DEFAULT_BUTTON_BINDINGS` e nos perfis já
gravados — então o primeiro gesto na aba as descartava, e o "Salvar Perfil"
gravava o rascunho podado por cima do arquivo dela.

O `_persist` passa a FUNDIR, com três regras:

- o que TEM linha na tela vence;
- botão canônico SEM linha continua fora (o "Remover" dela não é desfeito);
- chave sem linha e **fora** de `CANONICAL_BUTTONS` é preservada.

`src/hefesto_dualsense4unix/app/actions/input_actions.py:505-556`.

### 2. N2 — a tela passa a dizer que eles existem (`ba94ff1`)

`frase_dos_atalhos_fora_da_lista`, pura, nomeia na legenda o que o perfil guarda
e a lista não mostra, e diz por que não dispara.

**Escolhi a opção (b) da sprint, e não decidi por omissão.** A sprint pedia levar
a ela duas opções — (a) devolver a linha à lista com um sufixo, (b) a frase
abaixo. A opção (a) é derrubada por uma decisão MEDIDA dela que já está no
código: o comentário de `CANONICAL_BUTTONS`
(`input_actions.py:112-115`) diz, com todas as letras, que *"listar aqui um botão
que o produto não dispara mais é a janela mentindo"*. E ele não dispara — ver a
medição de hoje na seção "A pergunta do rádio". A opção (b) é a única compatível
com a decisão dela de 09/08. **Se ela preferir (a), a troca é o corpo de uma
função pura.**

O texto proposto está abaixo, para a folha:

> **Guardados, sem linha na lista:** Touchpad — lado esquerdo, Touchpad — meio,
> Touchpad — lado direito. O touchpad voltou a ser o mouse do computador, então
> esta versão não dispara esses atalhos. O perfil continua guardando o que você
> escolheu — nada nesta aba os apaga.

### 3. N4 — o interruptor apagado diz por quê (`317bfd1`)

`texto = MODE_GATE_HINT if blocked and mode is not None else ""` deixava o caso
"Hefesto sem resposta" com o interruptor APAGADO e nenhuma palavra ao lado — é o
que a foto oficial das 18h15 de 23/08 mostra. O bloqueio continua certo; o
silêncio sai. A frase é PRÓPRIA: a do modo jogo afirma que há jogo em andamento,
que é justo o que ali não se sabe.

> Não consegui falar com o Hefesto agora, então não sei se ligar o mouse
> derrubaria um jogo em andamento — por isso o interruptor está apagado. Veja
> como está o Hefesto na aba Sistema.

### 4. N6 — recusa não é queda de linha (`317bfd1`)

`_on_ok` desviava toda resposta `status != "ok"` para o `_on_err` do timeout,
cujo texto era *"Falha ao comunicar com o daemon"*: a janela acusando um defeito
de comunicação que não houve. Agora são **três** saídas — ok, recusado (com o
motivo, quando o daemon o der) e sem resposta. A reversão do interruptor é
idêntica nas duas de insucesso (`BUG-MOUSE-TOGGLE-STALE-REVERT-01` intacto): N6
separou os TEXTOS, não o comportamento.

`frase_da_recusa_do_mouse` já entende o `bloqueio` que a N5 vai publicar. Sem
ele, diz que o motivo faltou em vez de inventar um.

### 5. N12, a metade que mora nesta aba (`e909b62`)

O daemon publica `keyboard_emulation.osk_disponivel` desde 10/08 e
`grep -rn "osk_disponivel" src/hefesto_dualsense4unix/app/` devolvia **vazio**.
A legenda recitava `onboard` e `wvkbd-mobintl` como texto fixo sem nunca dizer se
algum estava instalado — e o L3 é o ÚNICO caminho do produto para escrever texto.

`_anotar_teclado_na_tela` lê o bloco no `state_full` que a aba já pedia e repinta
a legenda por um gancho opcional. O estado é **tri**: `None` = ainda não sei, e
ele não vira `False` — sem resposta, a tela fica exatamente como estava.

Na frase de "não tem", `wvkbd-mobintl` vem **antes** de `onboard`: o onboard
digita por XTEST e não alcança cliente Wayland nativo, então recomendá-lo
primeiro faz o teclado ABRIR e não DIGITAR. Mesma ordem do `_osk_candidatos` do
daemon.

### 6. Correção de fato na docstring do subsistema (`67c3212`)

`start_keyboard_emulation` dizia que o nó evdev do touchpad podia faltar
*"(controle BT, kernel velho)"*. A metade BT é **falsa**, e a casa já tinha a
medição — ver a seção seguinte. Fato errado se substitui.

---

## A pergunta do rádio, respondida no fonte (e uma correção à premissa)

Quem coordena pediu: *"no rádio, os dois nós evdev chegam os dois? Se sim, o
conserto é de CÓDIGO, não de texto."* **Chegam os dois.** Três provas
independentes:

1. **Não há filtro de transporte em lugar nenhum da descoberta.**
   `discover_dualsense_evdevs` casa por vendor/product + caps de gamepad;
   `_discover_dualsense_por_nome("Touchpad")` casa por vendor/product + marcador
   de nome (`core/evdev_reader.py:1715-1759`). Nenhuma das duas lê `bustype`.
2. **O kernel entrega tudo no mesmo report.** Por rádio o `hid_playstation` lê o
   `0x31` de 78 bytes, e o corpo é o MESMO struct do cabo, deslocado de 1 byte —
   analógicos, gatilhos e os dois pontos de toque lado a lado
   ([driver-hid-playstation.md](../../../protocol/driver-hid-playstation.md), §1.1).
   Não existe estado em que o nó de touchpad exista e o de gamepad não.
3. **A casa já mediu o nó de touchpad NO RÁDIO**, em 21/07/2026: o cabeçalho de
   `assets/76-dualsense-touchpad-libinput-ignore.rules` registra que por BT/uhid
   o input *"chama só `DualSense Wireless Controller Touchpad`"* — o BlueZ o
   batiza sem o prefixo do fabricante, e era isso que fazia o casamento por nome
   exato falhar. O nó existe; o nome é que era outro.

Medição minha de hoje, **leitura-só, com o DualSense do CABO desta bancada**
(o daemon dela não foi tocado):

```
gamepad  : {'a0fa9c…': '/dev/input/event21'}
touchpad : {'a0fa9c…': '/dev/input/event23'}
  a0fa9c… /dev/input/event23  LIBINPUT_IGNORE=False  -> ponteiro_do_sistema=True
```

### E aqui está a correção à premissa da sprint

**"O touchpad funciona no rádio" NÃO é prova de que o Hefesto funciona no
rádio.** Desde 09/08 o touchpad físico é ponteiro do SISTEMA — a medição acima o
confirma no nó vivo — e, com isso, o próprio produto se cala nos dois caminhos
do touchpad:

- `TouchpadReader._acumula_agora()` devolve False quando `ponteiro_do_sistema`,
  então `emit_touchpad_move` **nunca é alimentado**
  (`core/evdev_reader.py:2025-2035`);
- `_combine_with_touchpad` devolve os botões sem as regiões pela mesma razão
  (`daemon/subsystems/keyboard.py:415-437`).

Quem move o cursor com o dedo dela hoje é o **libinput**, em qualquer transporte
e **com o Hefesto parado**. Logo a observação dela de 11/08 — *"a exceção do
touch os demais não funcionam no modo bt"* — lida com o código na mão diz uma
coisa mais forte que a sprint supôs: **por rádio, a emulação do Hefesto pode não
estar contribuindo com NADA.** O que ela viu funcionando é a única parte que não
precisa do Hefesto.

### O mecanismo que produz exatamente esse sintoma, e como medi-lo em um comando

`read_state` tem dois ramos (`core/backend_pydualsense.py:2608-2661`): com
`self._evdev.is_available()` os analógicos/gatilhos/botões vêm do nó de gamepad;
**sem** ele, cai no fallback pydualsense, cujo próprio comentário diz que *"em
runtime com hid_playstation ativo os valores não atualizam"* — analógicos presos
em 128, gatilhos em 0, botões vazios. Isso mata, de uma vez, **as oito linhas da
moldura Mapeamento**, e não toca no cursor do sistema.

E o produto já registra o veredito, com esta assinatura exata
(`backend_pydualsense.py:2352-2366`):

```
controller_primary_bound  with_evdev=False
  hint="input pode ficar zerado se kernel hid_playstation capturar evdev"
```

**A medição que fecha a pergunta custa um grep, no dia em que o adaptador
voltar, com o controle no rádio:**

```bash
journalctl --user -u hefesto-dualsense4unix.service -g controller_primary_bound -n 5
```

`with_evdev=false` por rádio e `true` por cabo prova que o conserto é de
**código**. `with_evdev=true` nos dois derruba esta hipótese e o rumo passa a ser
o conteúdo do snapshot, não a existência do nó. **Não afirmei nada disso na tela**
— é hipótese com mecanismo, não medição.

---

## As mordidas, arrancadas e devolvidas

Todas por LINHA (`sed -i '<n>d'`), com `__pycache__` limpo entre arrancar e
devolver.

### N1 — a fusão (`input_actions.py:545-548`)

```
=== SEM A CURA ===
E  AssertionError: um gesto na aba apagou atalho que o perfil dela guardava e a
   lista nunca mostrou: ['touchpad_left_press', 'touchpad_middle_press',
   'touchpad_right_press']
3 failed, 4 passed
=== COM A CURA ===
7 passed
```

### N2 — a frase na legenda (`input_actions.py:411`)

```
=== SEM A CURA ===
E  AssertionError: assert 'Guardados, sem linha na lista' in '<b>Como funciona…'
1 failed, 6 passed
=== COM A CURA ===
7 passed
```

### N4 — a frase do modo desconhecido (`mouse_actions.py:200-205`)

```
=== SEM A CURA ===
E  AssertionError: assert '' == 'Não consegui falar com o Hefesto agora…'
1 failed, 21 passed
=== COM A CURA ===
22 passed
```

### N6 — o desvio da recusa (`mouse_actions.py:290`)

```
=== SEM A CURA (return _on_err(RuntimeError(...)) de volta) ===
E  At index 0 diff: 'Não obtive resposta do Hefesto…' != 'O Hefesto recusou: o
   modo jogo está suspendendo mouse e teclado…'
1 failed, 9 passed
=== COM A CURA ===
10 passed
```

### N12 — a leitura do `osk_disponivel` (`mouse_actions.py:266`)

```
=== SEM A CURA ===
E  AssertionError: assert 'Neste computador' in ''
2 failed, 10 passed
=== COM A CURA ===
12 passed
```

### Dois testes que trancavam o comportamento antigo

Os dois ganharam **nota datada**, não remoção, e a asserção que cada um existia
para fazer continua palavra por palavra:

- `test_input_actions.py::test_persist_serializa_store_em_dict` exigia igualdade
  EXATA com a store — era essa igualdade que trancava a poda de N1;
- `test_harmonia_mouse_um_dono.py::..._com_daemon_offline_e_sem_texto` exigia
  `hint.text == ""` — era a mudez de N4. Renomeado para `..._diz_por_que`;
- `test_mouse_actions_gui_sync.py` conferia `any("Falha" in t ...)`, e aquela
  palavra vinha do texto único que servia às DUAS saídas de insucesso.

---

## Portões

```
bash scripts/portoes.sh --rapido   ->  TODOS VERDES — 18 portões
ruff check src/ tests/             ->  All checks passed!
mypy src/hefesto_dualsense4unix    ->  Success: no issues found in 221 source files
```

Escopo no pytest (a suíte inteira é de quem coordena — R2):

```
tests/unit/test_atalho_fora_da_lista_nao_some.py        7 passed  (novo)
tests/unit/test_recusa_nao_e_queda_de_linha.py         10 passed  (novo)
tests/unit/test_teclado_na_tela_que_a_janela_nao_le.py 12 passed  (novo)
tests/unit/test_input_actions.py + _gtk, test_o_teclado_que_nao_digita.py,
test_mouse_actions_gui_sync.py, test_harmonia_mouse_um_dono.py,
test_modo_que_nao_controla_01.py, test_origem_que_mente_01.py,
test_palavra_a_janela_fala_a_lingua.py, test_gui_draft_reconcilia_perfil_ativo.py,
test_z4_matriz_widget_deposito.py, test_por_unidade_01_todas_as_abas.py,
test_ipc_apply_draft.py, test_profiles_preset.py, test_osk_handler.py,
test_emulacao_no_jogo_teclado.py                      todos verdes
```

---

## O que fica aberto, e para quem

### Aguarda o olho dela (código e teste prontos, prova de tela não fecha hoje)

Quatro textos novos, todos em `[estrutural]`: a frase de N2, a de N4, as de N6
(`RECUSA_SEM_MOTIVO`, `SEM_RESPOSTA_DO_HEFESTO`, a tabela
`BLOQUEIO_DO_MOUSE_EM_PORTUGUES`) e as duas de N12. Nenhum PNG foi commitado.

### Fora da minha posse — registrado, não editado

- **N5 — o payload do mouse aprende a dizer não.**
  `daemon/ipc_handlers.py:2468-2472` (o bloco `mouse_emulation`, hoje três
  números). O molde é `_keyboard_emulation_payload`, no mesmo arquivo: **a
  conjunção já está escrita lá** (`enabled` → `"desligada"`; `_keyboard_device is
  None` → `"sem_device"`; `_emulation_suppressed` → `"modo_jogo"`; senão
  `_jogo_no_controle_do_desktop()`), trocando `_keyboard_device` por
  `daemon._mouse_device` e `keyboard_emulation_enabled` por
  `mouse_emulation_enabled`. As chaves a acrescentar são `device_ativo`,
  `despachando` e `bloqueio`. E, para a N6 fechar de ponta a ponta,
  `_handle_mouse_emulation_set` (`:4692-4698`) precisa devolver `bloqueio` junto
  do `{"status": "failed"}`. **A janela já sabe traduzir tudo isso** —
  `frase_da_recusa_do_mouse` usa exatamente essas chaves.
  `ipc_handlers.py` está no `posse:` de três outras sprints; não encostei.
- **N8 — o veredito de uinput é relido ao entrar na aba.** Uma linha:
  `app/app.py:1139-1140`, a tupla de `tab_navegacao_dsx`, ganha
  `"_refresh_mouse_view"`. Hoje ela tem `_refresh_mouse_tab` e
  `_refresh_key_bindings_from_draft`, e nenhum dos dois relê o rótulo de
  permissão — consertar na aba Sistema e voltar aqui não muda o texto.
  `app.py` não é meu.
- **N3, N10, N14** — `main.glade`, escritor único (A4). N3 depende ainda do dono
  do fato "perfil ativo".
- **N7** — precisa de `emulation_actions.py` (`nao_toca`) e `main.glade`.
- **N9, N11** — N9 precisa de um widget novo no Glade e N11 de
  `core/backend_pydualsense.py`. **Não escrevi a função pura de N9 de
  propósito:** sem widget que a chame, ela seria "cura escrita e nunca ligada",
  que é o defeito mais caro desta casa.
- **N13** — `docs/data/mapa-controles.csv` não está na minha posse, e mexer nele
  puxa `gerar-mapa.py` (que reescreve o `specs.html` de 1,3 MB) no meio de uma
  leva paralela.

### Para quem escrever N14 — o texto tem de mudar mais do que a sprint supôs

A moldura Mapeamento (`main.glade:3729-3845`) **não cita o touchpad**: ela promete
Cruz/L2, Triângulo/R2, R3, direcionais, Círculo, Quadrado e os dois analógicos.
Pela leitura acima, se a observação dela estiver certa, **as oito linhas** caem no
rádio, não três — todas passam pelo mesmo `dispatch_mouse`, e todas dependem do
mesmo `_evdev`. Uma ressalva que cubra só L2/R2/analógico deixaria as outras
mentindo.

### Dela

Nada novo além do que a §9 da sprint já listava. A trilha do Bluetooth ganhou um
comando barato (o grep de `controller_primary_bound`) que responde a primeira das
cinco perguntas sem bancada de medição — só um controle no rádio e o journal.

---

## O que NÃO fiz, e por quê

- **Não medi nada de rádio.** `/sys/class/bluetooth/` está vazio (o hub USB dela
  saiu às 02:36). Tudo acima sobre rádio é leitura de fonte e citação de medição
  antiga da casa, e está marcado como tal.
- **Não parei o daemon dela, não rodei `systemctl`, não escrevi no aparelho.** A
  medição do cabo é `os.stat` + leitura de `/run/udev/data` + `InputDevice` em
  leitura.
- **Não rodei `retratar_abas.py`** (R4) nem commitei PNG.
- **Não rodei a suíte inteira** (R2).
- **Não escolhi o texto de N2 sozinho** — apliquei uma decisão dela que já estava
  no código, e deixei as duas opções na mesa acima.
