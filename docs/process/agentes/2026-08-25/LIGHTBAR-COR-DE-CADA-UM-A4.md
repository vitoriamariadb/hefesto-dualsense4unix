# LIGHTBAR — COR DE CADA UM-01 · agente A4 · 25/08/2026

Árvore: `hefesto-voo/LIGHTBAR-COR-DE-CADA-UM-A4`, branch
`voo/LIGHTBAR-COR-DE-CADA-UM-A4`. Sprint:
`docs/process/sprints/2026-08-24-LIGHTBAR-COR-DE-CADA-UM-01-a-aba-mais-vazia-e-o-aceso-agora-que-nao-volta.md`.

Régua declarada: interpretador da `.venv` da árvore principal com
`PYTHONPATH` apontado para o `src/` **desta** árvore (conferido: o
`hefesto_dualsense4unix.__file__` sai em `hefesto-voo/…-A4`). GUI sob
`xvfb-run -a --server-args="-screen 0 1920x1080x24"`, com `Gtk.OffscreenWindow`.
Nenhum controle na mesa, nenhum byte escrito em aparelho, daemon não tocado.

---

## O que mudou

**Fecharam sete tarefas: L4, L5, L6, L7, L8, L9 e a metade de L12 que não
depende da resposta dela. L1, L2 e L3 já vinham da Onda 0** (Z2 e Z4) — conferi
no código e as guardo com mordida em vez de refazê-las. **L10 e a outra metade
de L12 ficaram abertas**, com o motivo em "o que sobrou para o próximo".

### L7 — a prévia deixou de depender do português da fita

`app/actions/lightbar_actions.py` · `_auto_preview_slot`

A cura de 17/07 descobria o número do controle com
`re.search(r"Controle\s+(\d+)", _edit_target_label)`, e esse rótulo é
`translatable="yes"`. Em inglês ele vira "Controller 2", a busca falha, a função
devolve `None` e a prévia volta a pintar a cor MANUAL — **o defeito exato que a
cura existia para matar, ressuscitado por um idioma**. Agora o número vem de
`_edit_target_slot`, o número canônico que a aba Status mantém do `state_full` e
que este mesmo arquivo já usava sete linhas abaixo, em
`_atualizar_estado_das_luzes`. O `getattr` defensivo ficou: sem slot, `None`,
como antes.

### L4 — o rótulo do desenho parou de mentir depois de uma recusa

`app/actions/lightbar_actions.py` · `_set_player_leds`, `on_player_leds_apply`

`_set_player_leds` persistia, enviava, mostrava o toast com o resultado e então
chamava `_atualizar_estado_das_luzes(bits)` **sem olhar o `ok`**. Com a mesa
vazia o envio recusa (`_AVISO_SEM_DESTINATARIO`), o toast dizia que não deu — e
o rótulo três centímetros acima passava a anunciar o desenho do P2. Duas
afirmações contraditórias, na mesma aba, do mesmo clique.

**Decisão que tomei:** na recusa o rótulo **mantém o que estava**, em vez de
ganhar uma frase "não foi aplicado". A sprint deixava as duas em aberto; escolhi
a que não inventa texto de tela, porque texto novo é dela e ela não está. O que
o rótulo mostra continua verdade: é o último desenho que o produto de fato
mandou.

O `on_player_leds_apply` ganhou o mesmo tratamento (a sprint pede "o mesmo
tratamento" para os outros dois caminhos que compartilham `_enviar_player_leds`):
ele passa a acompanhar o rótulo **quando deu certo**, o que fecha a divergência
"toast diz aplicado, rótulo mostra outra coisa".

### L5 — o rótulo parou de afirmar uma leitura que não existe

`app/actions/lightbar_actions.py` · `_PREFIXO_DESENHO`, `texto_do_desenho_aceso`;
`gui/main.glade` · `player_leds_estado`

`texto_do_desenho_aceso` é função PURA do rascunho: nada nela consulta o
aparelho. E o mapa mede que consultar não é possível —
`luz.led_jogador.leitura@dualsense` tem `cabo_aceita = não` e
`radio_aceita = não`. O prefixo **"Aceso agora:"** saiu das quatro bifurcações e
do texto de espera do XML.

**Decisão que tomei — e é vocabulário de tela, então aguarda o olho dela:** o
prefixo novo é **"Desenho que mandamos:"**. Não é palavra inventada; é a que a
casa já usa para separar o pedido do efeito — `_TOAST_COR_ENVIADA` diz *"Cor
enviada ao controle"* e nunca "acesa", e o `lightbar_source == "desired"` do
daemon significa literalmente *a última cor que mandamos*, que é a expressão que
a própria sprint usa no L6. O texto de espera do glade virou
**"Desenho que mandamos: lendo o perfil…"** (o "consultando…" também prometia
uma consulta que não existe).

O que a linha MEDE não mudou: qual desenho, e por ordem de quem (co-op, escolha
dela, automático).

### L6 — a aba da barra passou a ler o que o daemon sabe da barra

`app/actions/lightbar_actions.py` · `_atualizar_estado_da_barra`,
`_texto_do_estado_da_barra`; `gui/main.glade` · `lightbar_estado_no_controle`

Reconferi a medição do M5 nesta árvore:

```
$ grep -rln "lightbar_source\|lightbar_disputada\|lightbar_on" \
    src/hefesto_dualsense4unix/app/
src/hefesto_dualsense4unix/app/widgets/controller_card.py
```

Um leitor só, e era o card — que mora na Status, na Início e na "No jogo". Quem
estava na aba da COR era justamente quem não era avisado de que a Steam segura o
`hidraw` deste controle.

A aba ganhou um rótulo que nasce OCULTO e só aparece quando há aviso a dar. A
frase vem de `widgets/controller_card.rotulo_lightbar` — **importada, não
recopiada**: duas semânticas para `lightbar_source` no mesmo produto seria o F5
nascendo dentro da cura, e a sprint avisa isso com todas as letras. A ordem de
precedência é a do card (Modo Nativo → disputa → fonte desconhecida → apagada).

O rótulo SOME quando não há aviso: alvo em "Todos", alvo desconhecido, daemon
mudo, controle fora do bloco `controllers`, ou cor conhecida e acesa (aí a
prévia ao lado já diz). Um "não sei" não vira aviso.

**Decisão que tomei sobre a FONTE do dado:** a leitura é uma chamada síncrona a
`ipc_bridge.daemon_state_full()` de dentro de `_refresh_lightbar_from_draft`,
que roda ao ENTRAR na aba (`app._REFRESH_POR_ABA`), ao trocar de alvo, ao trocar
de perfil e na transição do co-op — **nunca por tique**. O caminho natural seria
a aba Status publicar o dado, como ela já faz com `_coop_ligado`
(`status_actions._sync_coop_governa_luzes`), mas `status_actions.py` é território
da frente A2 nesta leva. O precedente da chamada síncrona é
`daemon_actions._query_gamepad_state`. **Se a costura preferir o caminho do
publicador, a troca é de dez linhas e está isolada em
`_texto_do_estado_da_barra`.**

### L8 — os ~600 px mortos

`gui/main.glade` · as duas molduras de `tab_lightbar_box`

`tab_lightbar_box` é uma `GtkBox` horizontal, e numa box o `valign` padrão dos
filhos é `fill`: cada moldura esticava até o fim da página e desenhava borda em
volta de vazio. `valign = start` nas duas. Medido nesta árvore, com a cura
arrancada: a coluna esquerda pede 381 px e recebia 1056 px — **675 px de
moldura em volta de nada**, o número do M10 confirmado.

Carimbo da sprint: COSMÉTICA, pré-aprovada pela D3. A foto vai no lote de quem
integra.

### L9 — os presets saem da tabela canônica

`app/actions/lightbar_actions.py` · `aplicar_desenho_do_jogador` e os quatro
`on_player_leds_preset_p1..p4`

Os quatro botões traziam o padrão escrito à mão
(`[False, True, False, True, False]` e companhia) enquanto
`core/led_control.player_led_pattern` já é a tabela que o DAEMON usa para
acender, cobre 1..8 (R-25) e tem overflow para ≥9 — e o MESMO arquivo já a lia
em `nome_do_desenho` para BATIZAR o desenho. **A aba nomeava por uma fonte e
pintava por outra**, e nada amarrava as duas.

Entreguei só a FIAÇÃO, e o glade continua com quatro botões: **quantos botões
aparecem é escolha dela** (§8 da sprint). Com a fiação, as duas respostas
possíveis custam uma linha cada. Carimbo: não toca a tela.

### L12 (metade) — a tela parou de esconder que o clique vai para todos

`app/actions/lightbar_actions.py` · `_AVISO_MESMO_DESENHO_NOS_QUATRO`,
`_quantos_recebem_o_desenho`, `_msg_do_desenho`

O conserto do M7 **não** foi feito: as duas respostas possíveis são dela. O que
entreguei é o que a sprint manda entregar antes da resposta — a mordida vermelha
(abaixo) e o texto que para de esconder o efeito. Hoje nada avisava que um
clique em "Desenho do P2" com o alvo em "Todos" ia para os quatro controles; o
toast passa a contar em quantos ele pegou. **É texto de tela, aguarda o olho
dela, e sai junto com a resposta dela, seja qual for.**

Re-apontei `tests/unit/test_lightbar_todos_por_mac_r14.py` com **nota datada**,
separando na docstring e no corpo as duas coisas que ele mede: que o automático
NÃO é desligado (decisão medida do U9/R-14 — fica) e que o P3 vai igual para os
dois (incidental — é o defeito do M7, e sai com a resposta dela). Nenhuma
asserção foi apagada.

### A contradição de rádio que me pediram para resolver

**Veredito: a afirmação "`LIGHTBAR-BT-NEVER-01` e `ROTA-BT-EM-REGIME-01` se
contradizem e uma está velha" é o FATO ERRADO. As duas políticas estão vivas e
falam de rotas diferentes.** Nenhuma das duas é velha.

Evidência, e ela já estava reconciliada no mapa desde **16/08/2026**:

- `docs/data/mapa-controles.csv`, `luz.lightbar.cor@dualsense`, célula
  `radio_comando`, literal: *"DUAS rotas, e as duas saem: (1) sysfs
  multi_intensity … e (2) o 0x31 AVULSO escrito no hidraw pelo
  `_pintar_por_hidraw_bt` (ROTA-BT-EM-REGIME-01, 12/08/2026) … O que segue
  SUPRIMIDO por BT é o FLUXO do report_thread (`handle._suppress_leds`), nunca a
  escrita avulsa … SUBSTITUIU, em 16/08/2026, 'ÚNICA rota: sysfs'"*;
- o código diz o mesmo, e no mesmo parágrafo:
  `core/backend_pydualsense.py:3341` em diante (`_pintar_por_hidraw_bt`)
  documenta que o fallback da pydualsense é código morto por rádio **porque**
  `_suppress_leds` é True para todo handle BT (`LIGHTBAR-BT-NEVER-01`,
  `:2451`) — e que por isso a segunda rota é uma escrita AVULSA, fora do fluxo.

Ou seja: `LIGHTBAR-BT-NEVER-01` proíbe o FLUXO do `report_thread`;
`ROTA-BT-EM-REGIME-01` acrescenta uma escrita avulsa que aquela proibição nunca
cobriu. Não há contradição a desempatar, e a Onda 7 não precisava reabrir isso.

**Onde o fato errado ainda está publicado — e nenhum destes arquivos é meu nesta
leva, então declaro em vez de editar:**

| arquivo:linha | o que diz |
|---|---|
| `docs/process/SPRINT_ORDER.md:254` | *"**`LIGHTBAR-BT-NEVER-01` e `ROTA-BT-EM-REGIME-01` se contradizem e uma está velha**"* |
| `docs/process/SPRINT_ORDER.md:392` | *"(`LIGHTBAR-BT-NEVER-01` e `ROTA-BT-EM-REGIME-01` se contradizem)"* |
| `docs/process/sprints/2026-08-24-ONDA0-Z3-BROADCAST-PROIBIDO-01-…md:596` | *"a barra tem **duas sprints que se contradizem**"* |
| `docs/process/sprints/2026-08-24-NO-JOGO-SEM-FALSO-VERDE-01-…md:436` | *"**duas sprints se contradizem** sobre o rádio, uma delas velha"* |
| `docs/process/sprints/2026-08-24-NO-JOGO-SEM-FALSO-VERDE-01-…md:518` | *"que já tem `LIGHTBAR-BT-NEVER-01` × `ROTA-BT-EM-REGIME-01` para desempatar"* |

Substituto sugerido, em uma linha: *"as duas rotas de LED por rádio saem juntas
— o `LIGHTBAR-BT-NEVER-01` suprime o FLUXO do `report_thread`, e o
`ROTA-BT-EM-REGIME-01` acrescenta o `0x31` avulso por hidraw; reconciliado no
mapa em 16/08/2026"*. **A pergunta que continua ABERTA é outra, e o §5 da
sprint a nomeia:** com outro processo segurando o `hidraw`, a rota avulsa
`0x31` por rádio ACENDE? Ninguém viu.

---

## Qual mordida prova

Todas arrancadas e conferidas nesta árvore, com a saída LITERAL do pytest.
Comando comum:

```
PYTHONPATH=…/LIGHTBAR-COR-DE-CADA-UM-A4/src \
xvfb-run -a --server-args="-screen 0 1920x1080x24" \
  .venv/bin/python -m pytest <arquivo> -q
```

### L4 — `tests/unit/test_lightbar_onda7_as_mordidas.py::test_envio_recusado_o_rotulo_nao_afirma_o_desenho`

Arranque: trocar `if ok:\n    self._atualizar_estado_das_luzes(bits)` por
`self._atualizar_estado_das_luzes(bits)` (as duas ocorrências).

```
E       AssertionError: o rótulo anunciava um desenho que o produto acabou de declarar que não conseguiu enviar
E       assert 'P2' not in 'Desenho que...escolha sua.'
E         'P2' is contained here:
E           Desenho que mandamos: desenho do P2 — escolha sua.
1 failed, 9 passed in 0.34s
```

Com a cura devolvida: `15 passed in 0.34s`.

### L5 — `tests/unit/test_lightbar_lexico_sem_leitura.py`

Arranque: `_PREFIXO_DESENHO = "Aceso agora"`.

```
E       AssertionError: o texto de espera do glade ('Desenho que mandamos: lendo o perfil…') divergiu do prefixo que o Python escreve ('Aceso agora') — a mesma linha da tela passaria a dizer duas coisas conforme quem a escreveu por último
FAILED …::test_nenhuma_frase_do_desenho_afirma_estado_da_barra
FAILED …::test_o_proprio_prefixo_nao_afirma_estado
FAILED …::test_o_texto_de_espera_do_glade_obedece_a_mesma_regra
3 failed, 2 passed in 0.35s
```

Com a cura devolvida: `5 passed in 0.31s`.

### L6 — cinco casos em `test_lightbar_onda7_as_mordidas.py`

Arranque: apagar a chamada a `self._atualizar_estado_da_barra()` de
`_refresh_lightbar_from_draft`.

```
FAILED …::test_fonte_desconhecida_o_rotulo_nao_nomeia_cor_nem_diz_aceso
FAILED …::test_a_disputa_da_steam_aparece_na_aba_da_cor
FAILED …::test_sem_aviso_a_dar_o_rotulo_da_barra_some
FAILED …::test_alvo_em_todos_nao_inventa_estado_de_barra
FAILED …::test_daemon_mudo_nao_derruba_a_aba
5 failed, 5 passed in 0.35s
```

Com a cura devolvida: `15 passed in 0.34s`.

### L7 — três casos, em dois arquivos

Arranque: devolver o `re.search(r"Controle\s+(\d+)", label)` no lugar da leitura
de `_edit_target_slot`.

```
E       assert 2 is None
FAILED tests/unit/test_lightbar_onda7_as_mordidas.py::test_a_previa_da_paleta_sobrevive_a_traducao_da_interface
FAILED tests/unit/test_lightbar_auto_colors.py::TestPreviaHonestaAuto::test_o_idioma_da_fita_nao_decide_a_previa
FAILED tests/unit/test_lightbar_auto_colors.py::TestPreviaHonestaAuto::test_sem_slot_conhecido_o_defensivo_sobrevive
3 failed, 38 passed in 0.50s
```

Com a cura devolvida: `41 passed`.

### L8 — `tests/unit/test_lightbar_vao_vertical.py`

Arranque: apagar as DUAS linhas `<property name="valign">start</property>` das
molduras da Lightbar (só elas — o glade tem quatro no total, e as outras duas
são de outras abas; apagar por `str.replace(..., 2)` acerta as erradas e o teste
passa em falso — caí nisso uma vez e refiz por número de linha).

```
E       AssertionError: a coluna “Lightbar (barra de LED)” pede 381px e recebeu 1056px — 675px de moldura desenhada em volta de nada. É o vão vertical da VAO-01: as colunas têm de parar na altura natural (`valign = start`), não esticar até o fim da página.
E       assert 675 <= 32
1 failed, 1 passed in 0.39s
```

Com a cura devolvida: `2 passed in 0.37s`.

### L9 — `test_cada_botao_de_desenho_sai_da_tabela_canonica[2]`

Arranque em DUAS metades, porque o defeito tinha duas: devolver o literal
escrito à mão ao `on_player_leds_preset_p2` **e** trocar um bit em
`_PLAYER_LED_PATTERNS[2]` — que é exatamente o estado de 24/08, duas cópias
independentes.

```
E       AssertionError: o botão P2 pintou um desenho que a tabela canônica não produz — o daemon acenderia outra coisa
E         At index 0 diff: (False, True, False, True, False) != (False, True, True, True, False)
1 failed, 14 passed in 0.34s
```

Com a cura devolvida: `15 passed in 0.33s`.

**Medição que corrige a expectativa da sprint:** ela previa que trocar um bit da
tabela SOZINHO faria o botão reprovar. Depois do L9 isso já não acontece — e é
a cura funcionando: com uma fonte só, ela não tem como divergir de si mesma. O
arranque que morde é o que RECRIA a segunda cópia. Está escrito na docstring do
teste.

### L10 — `tests/unit/test_lightbar_handler_tem_chamador.py`

Arranque: esvaziar `DIVIDA_DECLARADA`.

```
E       AssertionError: handler(es) de produção sem quem os dispare na aba Lightbar: on_player_led_toggled (está no dicionário de sinais de app.py, não tem <signal> no main.glade e ninguém o chama em app/). Ou ligue o handler a um gesto real, ou remova-o junto com a entrada dele no dicionário de sinais de app/app.py.
1 failed, 2 passed in 0.28s
```

O portão enxerga o handler morto e o nomeia. A remoção em si ficou aberta (ver
abaixo). Com a dívida declarada: `3 passed in 0.27s`.

### L12 (texto) — `test_a_tela_para_de_esconder_que_o_clique_vai_para_todos`

Arranque: apagar o bloco de `_msg_do_desenho` que consulta
`_quantos_recebem_o_desenho`.

```
E       AssertionError: o clique pegou em dois controles e o toast não contou
E       assert 'os 2 controles da mesa' in 'Desenho das luzes atualizado — LEDs acesos: 2 e 4'
1 failed, 2 passed, 2 xfailed in 0.33s
```

### L12 (comportamento) — a mordida VERMELHA, declarada

`tests/unit/test_lightbar_todos_o_desenho_de_cada_um.py::test_todos_nao_pode_pintar_o_numero_de_um_no_outro`
é `xfail(strict=True)`: hoje reprova de propósito, porque o defeito está lá. No
dia em que qualquer uma das duas respostas dela entrar, o pytest acusa **XPASS**
— que também é vermelho — e obriga quem implementou a trocar o `xfail` pela
asserção definitiva. Um TODO em comentário não faz isso.

```
XFAIL …::test_todos_nao_pode_pintar_o_numero_de_um_no_outro
XFAIL …::test_o_perfil_nao_pode_guardar_o_numero_do_vizinho
3 passed, 2 xfailed in 0.32s
```

### L1, L2 e L3 — a cura é da Onda 0; a mordida passou a morar aqui

Os três já estavam curados quando cheguei (Z2 e Z4). Escrevi mordida para os
três mesmo assim, e arranquei a cura ALHEIA para conferir que a régua morde —
a sprint desta aba é quem paga o preço quando qualquer uma delas cair.

**L1 e L2** — arranque em `app/alvo_de_edicao.py`: fazer o
`if not hasattr(host, ATRIBUTO_LEGADO_UNIQ)` devolver `TODOS` em vez de
`ALVO_DESCONHECIDO`, que é a confusão que a Z2 desfez.

```
E       AssertionError: nenhum gatilho pode ser escrito às cegas
E       assert [('left', None)] == []
FAILED …::test_mesa_desconhecida_a_cor_recusa_e_a_paleta_sobrevive
FAILED …::test_gatilhos_sem_o_mixin_da_lightbar_recusam_em_vez_de_escrever_global
2 failed, 13 passed in 0.37s
```

**L3** — arranque em `app/draft_config.py:1428`: trocar
`return {} if self.controllers_esvaziados_nesta_edicao else None` por
`return None`.

```
E       AssertionError: a seção tem de viajar VAZIA — `None` faz o applier sair antes de chamar `reset_output_overrides`, e a cor antiga fica no controle
E       assert None == {}
1 failed, 14 passed in 0.35s
```

**Registro de instrumento:** o primeiro arranque que tentei para o L3 —
`"controllers_esvaziados_nesta_edicao": not novo` → `False` — **não** fez
reprovar, porque o caminho que o teste exercita passa por outra linha
(`:1393`). Um arranque que não reprova não prova que a régua é fraca: prova que
eu arranquei a coisa errada. Fui ao ponto de emissão e a régua mordeu.

---

## O que NÃO verifiquei

- **NÃO VERIFICADO — nada com o plástico na mão.** Zero controles na mesa, zero
  bytes escritos, daemon não tocado. Todo `ok` aqui significa "o dublê aceitou",
  nunca "a barra acendeu". A bancada é dela.
- **NÃO VERIFICADO — o L6 contra um daemon vivo.** O leitor foi exercitado só
  com `state_full` de dublê. Ninguém viu a frase "A Steam tem este controle
  aberto" aparecer na aba da cor com a Steam de verdade segurando o `hidraw`.
  **É a prova mais barata que sobrou desta tarefa** e leva dois minutos com um
  controle na mesa.
- **NÃO VERIFICADO — o custo real da chamada síncrona do L6.** `daemon.state_full`
  na thread da GUI ao entrar na aba: o precedente existe
  (`daemon_actions._query_gamepad_state`), mas eu não medi o tempo desta chamada
  com daemon vivo e mesa cheia. Se travar a troca de aba, o caminho é o
  publicador da Status (dez linhas, isolado).
- **NÃO VERIFICADO — a aba com o olho dela.** L4, L5, L6 e a metade de L12 são
  ESTRUTURAIS pela D3, e a D3 não fecha nesta madrugada. Nenhuma foto foi
  gerada por mim (o `retratar_abas.py` é de quem integra) e nenhuma aprovação
  foi inventada.
- **NÃO VERIFICADO — o M2 com o daemon na ponta.** Continua aberto e sem dono,
  como a sprint já declarava: a cadeia está provada no interpretador; ninguém
  viu o controle continuar com a cor antiga depois de um Aplicar real.
- **NÃO MEDIDO — a suíte inteira.** Rodei o subconjunto do meu escopo, por
  regra da casa (nós `uinput` de verdade). O que rodei: todos os arquivos que
  leem o `main.glade` (943 testes), mais o `-k "lightbar or player_led or
  player01 or mesa_cheia or p10 or coop_player or layout_orcamento or alvo or
  z4 or broadcast or trigger"` (1189 testes).

---

## O que sobrou para o próximo

### Aberto porque o arquivo é de OUTRA frente nesta leva

**1. L10 — a remoção do handler morto.** É costura de DOIS arquivos e um deles
não é meu:

- `src/hefesto_dualsense4unix/app/actions/lightbar_actions.py` — apagar
  `on_player_led_toggled` (o método inteiro, ~27 linhas);
- `src/hefesto_dualsense4unix/app/app.py:372` — apagar a linha
  `"on_player_led_toggled": self.on_player_led_toggled,`.

**Tem de ser no MESMO commit:** remover só o método faz a janela morrer no boot
com `AttributeError`, porque o Builder resolve o dicionário na construção. As
CAIXAS `player_led_1..5` do glade **ficam**, e isso é medição, não esquecimento
(`get_current_player_leds` as lê por id; sumir com elas faria "Aplicar o
desenho" apagar as cinco luzes e gravar "tudo apagado" no perfil dela).

O portão já está no lugar e já sabe cobrar: assim que a costura acontecer, tire
`on_player_led_toggled` de `DIVIDA_DECLARADA` em
`tests/unit/test_lightbar_handler_tem_chamador.py` — e se esquecerem, o
`test_a_divida_declarada_nao_apodrece` reprova sozinho.

**2. L5 (metade de doc) — `docs/usage/interface.md:271-272`**, que é da frente
A2 nesta leva. Ele publica o fato errado:

> *"A linha **"Aceso agora:"** diz o que está aceso neste instante."*

Substituto (é fato errado, não decisão medida — sai, não leva nota):

> *"A linha **"Desenho que mandamos:"** diz qual desenho o Hefesto está
> mandando para este controle, e por ordem de quem — sua escolha, o número
> automático ou o co-op. Ela **não** diz o que está aceso: o DualSense não
> devolve o desenho das 5 luzes em transporte nenhum."*

**3. `scripts/gui-captura/retratar_abas.py`** cita o texto antigo em comentário
e docstring (`:1391`, `:1481`, `:1501`: *"Aceso agora: consultando…", que é o
texto de espera do glade*). O arquivo não é meu e o protocolo proíbe rodá-lo.
Só o comentário caducou; o código não depende do literal (conferi: nenhuma
comparação de string).

### Aberto porque é DELA

**4. A pergunta que trava o L12:** "Todos" + "Desenho do P2" — **recusar**
(resposta a, e `_enviar_player_leds` já sabe recusar) ou **dar a cada um o
desenho do próprio número** (resposta b, e `player_led_pattern(slot)` já sabe
produzir)? "Todas acesas"/"Todas apagadas" ficam fora da pergunta, e há teste
guardando isso. A mordida vermelha das duas respostas está pronta; o `xfail`
sai junto com a cura.

**5. Quantos botões de desenho aparecem** (L9): sempre oito, ou só até o maior
número vivo na mesa? A fiação já alcança 1..8; o glade continua com quatro.

**6. O olho dela em L4, L5, L6 e no texto do L12.** Foto de antes e de depois no
lote de quem integra, e a palavra final é dela.

### O que as próximas ondas HERDAM de mim

**Onda 8 · Gatilhos.** O que ela precisava daqui **já estava feito pela Z2** e
eu o guardo com mordida: `_edit_uniq` não é mais propriedade privada desta aba,
e `triggers_actions.py` já lê `alvo_de_edicao(self)` nos dois pontos (`:593` e
`:666`), sem `getattr` com default silencioso. O teste
`test_gatilhos_sem_o_mixin_da_lightbar_recusam_em_vez_de_escrever_global` monta
um host **sem** o `LightbarActionsMixin` e cobra a recusa — é a régua contra a
regressão da ABAS-06 voltar por um refactor de outra aba. **Se a Onda 8 mexer
no caminho do alvo, este teste é o que grita.**

**Onda 6 · Perfis.** Herda três coisas:

- a seção `controllers` do `to_ipc_dict` viaja **vazia** quando ela limpa o
  último override (Z4), e a mordida disso agora também mora nesta aba;
- `_persist_leds_update` continua gravando o MESMO `player_leds` no override de
  cada MAC em "Todos" — é o defeito do M7, e o perfil dela guarda assim. **Se a
  Onda 6 tocar a gravação por controle, a resposta dela ao item 4 muda o que
  ela tem de gravar**;
- o `xfail(strict=True)` do L12 vai virar XPASS na cara de quem implementar a
  resposta dela, venha ela de que onda vier.

### Portões — o que rodei e o que reprovou

| portão | resultado |
|---|---|
| `ruff check src/ tests/` | **OK** ("All checks passed!") |
| `mypy src/hefesto_dualsense4unix` | **OK** (212 arquivos) |
| `validar-acentuacao.py --all` | **OK** |
| `validar-glifos.py --all` | **OK** |
| `validar-referencias-docs.py --all` | **OK** (434 documentos) |
| `check_anonymity.sh` | **OK** |
| `check_version_consistency.py` | **OK** (12 alvos em 0.9.4.5) |
| `check_packaging_parity.sh` | **OK** |
| `check_test_data.sh` | **OK** |
| `check_endereco_de_radio.py` | **NÃO EXISTE nesta árvore** — ver abaixo |
| `validar-caducos.py --all` | **REPROVOU — e é vermelho HERDADO** |

**`scripts/check_endereco_de_radio.py` não existe nesta worktree.** Ele é o
portão novo de 24/08 que o `CLAUDE.md` manda rodar; na árvore dela o arquivo
está ADICIONADO ao índice e ainda não commitado, então a minha branch nasceu
sem ele. Não é omissão minha e não dá para suprir daqui. **Quem integra tem de
rodá-lo na árvore principal**, onde ele existe. Nada do que escrevi contém
endereço de rádio: os MACs dos meus testes são `aa:bb:cc:00:00:01` e
`aa:bb:cc:00:00:02`, a faixa forjada da casa, e o `check_anonymity.sh` passou.

**`validar-caducos.py --all` reprova, e o vermelho é anterior a mim:**

```
FALHA: 1 publicação(ões) de fato caduco:
  docs/protocol/paridade-bluetooth-versus-cabo.md:276: publica o literal
  caduco '40% do sinal' — declarado caduco em 2026-08-07 (audio.microfone@dualsense)
```

Não toquei nesse arquivo. `git log -1` nele aponta `cf78346`
(*"merge(onda0): CONFIGURACOES-FECHA"*). E o caso é fino: a linha 276 está
DENTRO de uma nota *"Fechado em 24/08/2026 (T6, CONFIGURAÇÕES-FECHA-01)"* que
**cita** o número errado para explicar que ele foi substituído. O validador não
tem exceção para literal citado-e-declarado-morto. Duas saídas, e a escolha é
de quem coordena: ou a nota parafraseia em vez de citar, ou o validador aprende
a diferença entre publicar e sepultar. **Isto é da frente da CONFIGURACOES-FECHA,
não minha.**

### Vermelhos de layout que encontrei, medi, e NÃO são meus

Rodando o escopo largo apareceram oito reprovações de geometria. **Medi as duas
pontas**: revertendo o meu `main.glade` e o meu `lightbar_actions.py` para o
`HEAD` da branch, os números saem **idênticos**. São herdados, e ficam ditos
para não virarem surpresa na integração:

```
tests/unit/test_layout_orcamento_altura.py — 6 reprovações
  abas acima do teto de 644px: Emulação (806px)
  abas mais largas que os 1180px: Lightbar (1289px), Sistema (1307px)
  o conteúdo pede 1309px de largura e a janela abre com 1180px
  o card pede 472px e a aba Status só tem 446px de faixa
  com UM controle o card pede 548px e a aba Status só tem 446px
tests/unit/test_status_som_02_controle_de_volume.py — 1
tests/unit/test_status_faixa_blocos.py — 1
  o card de um controle passou a pedir 1106px de MÍNIMO (o piso é 1040px)
```

**O meu glade somou ZERO pixel a esses números** — o rótulo novo do L6 nasce
`visible=False`/`no-show-all`, e o `valign` do L8 só mexe em altura ALOCADA,
nunca em largura pedida. Os 1289px da Lightbar já estavam lá antes de eu tocar
no arquivo. Cinco dos oito acusam a aba Status e o card do controle, que é
território da frente A2 nesta leva.
