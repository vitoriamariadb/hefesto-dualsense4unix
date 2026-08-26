# LEVA-1-A — a borda de queda: o motor para, e os secundários continuam escondidos

Árvore `/mnt/Apate/Desenvolvimento/hefesto-voo/LEVA-1-A`, branch `voo/LEVA-1-A`.
Duas frentes fundidas (BQ-1 + BQ-3), dois commits, em série.

## O que mudou

### (1) O motor para antes de o vpad morrer — BQ-1

**`daemon/subsystems/coop.py`** — `_teardown_player` ganhou **uma linha**, e ela
está numa posição, não em qualquer posição:

```python
self._zerar_rumble_do_jogador(identity)
if player.vpad is not None:
    with contextlib.suppress(Exception):
        player.vpad.stop()
```

O defeito medido na sessão dela: com dois ou mais no rádio, um cai e o motor
fica vibrando até o teto de 3 s do relógio cortar — quatro vezes em 28 s, uma
delas em (230, 230). O `_teardown_player` fazia pop do jogador,
`_broker_restore_player`, `set_grab(False)`, `reader.stop()`,
`motion_reader.stop()`, `vpad.stop()`, `_revert_single_player_led` e
`_materialize_launch_env` — e **nenhuma linha zerava o rumble**. A cura de 02/08
só trata o caso em que o JOGO manda parar; aqui o device sumiu debaixo do jogo, e
o FF que o kernel já entregou ao firmware fica de pé porque ninguém mais manda
report por aquele caminho.

O helper novo, `_zerar_rumble_do_jogador`, é best-effort de três jeitos, e
nenhum deles aborta o teardown (um nó físico 0600 sem dono é pior que um motor
preso):

- backend sem a API (`FakeController` do smoke, legado) → no-op;
- identidade sem MAC (`path:*`, externo) → **no-op de propósito**: sem endereço,
  a única chamada possível seria o broadcast, e ele emudeceria o motor de quem
  continua jogando. Este é o caso em que o relógio
  (`uhid_gamepad._expirar_rumble_preso`) segue sendo o cinto;
- falha do backend → `logger.warning("coop_rumble_stop_na_borda_falhou")`, nunca
  exceção.

O relógio ficou onde estava. Ele é o segundo cinto, não o primeiro.

**`core/backend_pydualsense.py`** — `force_rumble_stop` ganhou o parâmetro
`uniq: str | None = None`. Sem ele, o broadcast do HARM-16 continua exatamente
como era (saída de modo alcança a mesa inteira); com ele, o alvo é UM handle,
endereçado pelo mesmo `_casar_key` do `enviar_release_leds` — que aceita o MAC
12-hex e a key crua. Alvo que não casa handle nenhum é no-op silencioso: o
controle já saiu da mesa, e não há nada a parar.

O parâmetro existe porque **a borda de um jogador de co-op não é saída de modo**:
o jogador 3 cai e os outros três continuam jogando. Parar a mesa inteira ali
seria trocar um motor preso por três motores mudos no meio da partida.

`scripts/check_broadcast_proibido.py` segue verde e a exceção deliberada dele
continua valendo: a frase que o `_EXCECOES_DELIBERADAS` indexa — *"Broadcast
deliberado (ignora o seletor de alvo): sair de modo para TODO mundo"* — está
intacta no docstring, porque continua sendo a verdade do caminho sem `uniq`.

### (2) Os secundários ficam escondidos sem o P1 — BQ-3

**`daemon/subsystems/gamepad.py`** — `rehide_physical_hidraw` tinha
`if not _vpad_vivo(daemon): return` no **topo** (era a linha 1076; o laço dos
secundários só começava na 1090), e `_vpad_vivo` olha **só**
`daemon._gamepad_device` — o vpad do Jogador 1. Com o uhid do P1 derrubado por
UHID_STOP de um probe, a função inteira devolvia antes de chegar aos jogadores
2..4.

O preço: cada replug/wake BT recria o nó físico VISÍVEL (rule 70 + uaccess do
udev), e a reconciliação online — que existe justamente para reesconder — ficava
muda. O jogo passava a ver o físico E o vpad de cada secundário: os **controles
duplicados**, o defeito histórico mais caro desta casa.

O gate desceu para dentro do ramo do P1:

```python
nodes: set[str] = set()
if _vpad_vivo(daemon):
    node = hidraw_fn()
    ...
```

O laço dos jogadores 2..4 passa a rodar sempre, cada um guardado por
`vpad_vivo(player.vpad)` — o gate por jogador do Achado Onda S #1, que **não foi
afrouxado**: secundário com vpad morto continua sem autorizar hide do próprio
nó. Os três gates de mesa inteira (Modo Nativo, emulação ligada, backend com
`hidraw_path`) continuam cortando antes de tudo.

Uma consequência de tabela: `broker_client_for(daemon)` passou a ser chamado
**depois** de o conjunto de nós ficar pronto, com `if not nodes: return` na
frente. Antes, o cliente/lease era criado mesmo quando não havia nada a
esconder. Nenhuma rota de parada nova; `stop_gamepad_emulation` não foi tocado.

## Qual mordida prova

Duas curas, duas arrancadas, coladas cruas.

### Mordida 1 — a ORDEM, não o efeito

`tests/unit/test_borda_de_queda_01_o_rumble_na_borda.py` monta uma mesa com o
jogador vibrando em (230, 230) e grava uma **fita única** de chamadas
(`reader.stop`, `force_rumble_stop`, `vpad.stop`) na ordem em que acontecem.

**Arrancada A — a linha comentada:**

```
F......                                                                  [100%]
______________ test_o_teardown_zera_o_motor_antes_de_matar_o_vpad ______________
E       AssertionError: o jogador saiu da mesa com o motor em (230, 230) e NADA
        mandou o report de stop — o motor morre vibrando até o teto de 3 s do relógio
E       assert 'force_rumble_stop' in ['reader.stop', 'vpad.stop']
1 failed, 6 passed
```

**Arrancada B — a cura DEVOLVIDA, mas na ordem errada** (depois do
`vpad.stop()`). É a que prova que a régua mede a ordem e não a presença:

```
F......                                                                  [100%]
E       AssertionError: o stop saiu DEPOIS de o vpad morrer: o sink de FF daquele
        jogador já não existe mais e o report não tem por onde sair —
        fita: ['reader.stop', 'vpad.stop', 'force_rumble_stop']
E       assert 2 < 1
1 failed, 6 passed
```

**Curada:** `7 passed`.

O mesmo arquivo mede também: o stop é endereçado a `_MAC` e **não** é broadcast;
backend que explode não aborta o teardown (`_players == {}` no fim); `path:*` é
no-op; backend sem a API é no-op. E o lado do backend: `force_rumble_stop(uniq)`
arma só o alvo (o vizinho fica com `_rumble_stop_pending is False`),
`force_rumble_stop()` sem argumento continua armando todos, e alvo que não casa
handle é no-op.

### Mordida 2 — dois hides sem o P1

`tests/unit/test_borda_de_queda_01_rehide_sem_p1.py`, mesa com P1 morto
(`_started=False`) e jogadores 2 e 3 vivos.

**Arrancada — o gate devolvido ao topo:**

```
F.F..F                                                                   [100%]
________________ test_os_secundarios_sao_reescondidos_sem_o_p1 _________________
E       AssertionError: com o vpad do P1 morto, os nós físicos dos jogadores 2 e 3
        ficaram VISÍVEIS: o jogo vê /dev/hidraw7 e /dev/hidraw9 dobrados
        (físico + vpad de cada um). Escondidos de fato: []
E       assert [] == ['/dev/hidraw7', '/dev/hidraw9']
```

Três reprovam: a mordida, o `secundario_morto_continua_sem_autorizar_o_proprio_no`
e o `externo_sem_mac_nunca_autoriza_hide` — todos os que dependem de o laço
rodar com o P1 morto.

**Curada:** `6 passed`.

### O que mais foi rodado

- os dois arquivos novos juntos: **13 passed**;
- o escopo vizinho inteiro (`coop|rumble|backend|gamepad|broadcast|motion|vpad`,
  68 arquivos): **1107 passed em 69 s** — nenhum verde antigo caiu, incluindo
  `test_hidraw_broker_hooks.py`, `test_backend_keepalive_neutro.py`,
  `test_esconder_em_vez_de_sair_01.py`, `test_p4_alvo_ausente_nao_vira_broadcast.py`;
- `portao_a_casa_sabe_e_o_produto_nao_faz.py`: **35 passed** (não apaguei nem
  editei lápide nenhuma — a cura é aditiva; nenhum símbolo sumiu);
- `scripts/check_broadcast_proibido.py`: **rc=0**;
- `ruff check src/ tests/`: **All checks passed!**;
- **`bash scripts/portoes.sh` inteiro — os 26: 25 verdes.** O único vermelho é o
  `colisao-de-sprints`, e ele já estava vermelho antes de mim (prova no item 1
  de *"o que sobrou"*). `casa-sabe`, `mypy`, `acentuacao`, `shellcheck`,
  `referencias-docs` e `anonimato` passaram.

## O que NÃO verifiquei

1. **Nada disto foi na bancada.** Não toquei aparelho, daemon vivo, hidraw nem
   `btmon`. Que o report de stop com `_rumble_stop_pending` realmente pare um
   motor que o *jogo* deixou vibrando **pelo caminho do co-op** é herdado do
   HARM-16, não remedido aqui. **Uma sessão de dois no rádio com uma queda de
   verdade é o que fecha esta conta**, e ela não foi rodada.
2. **O caso mais provável na sessão dela pode ser exatamente o caso em que a
   cura é no-op.** Se o controle sumiu porque o *rádio* caiu, o handle do
   backend também morreu — `force_rumble_stop(uniq)` não acha handle e devolve
   em silêncio, e quem para o motor continua sendo o firmware (ou nada). A cura
   morde de fato nas quedas em que o *jogador* sai e o *controle fica*: retry de
   grab, respawn por troca de node, `stop_all`/`disable`, cessão ao primário,
   jogo fechando. **Não medi qual dos dois é o das quatro ocorrências em 28 s
   do journal dela** — o log que eu teria de olhar (`coop_player_removed` colado
   a um `backend_hotplug_reconcile`) é da bancada.
3. **A ordem que provei é a das CHAMADAS, não a dos BYTES no fio.** O teste
   afirma que `force_rumble_stop` é chamado antes de `vpad.stop()`. Que o report
   chegue ao firmware antes de o uhid morrer depende do `sendReport`/keepalive
   do backend, que não é exercitado por dublê nenhum aqui.
4. **Não rodei a suíte inteira** (regra da casa: ela é de quem coordena, no fim,
   em oito lotes). Rodei 1107 testes do escopo vizinho; um verde que dependa
   destes três módulos e viva fora desse recorte não foi medido por mim.
5. **Não olhei a tela.** Nada aqui a alcança, e por isso não abri
   `COMO-OLHAR-A-TELA.md` nem fotografei aba nenhuma (R-C).

## O que sobrou para o próximo

1. **`colisao-de-sprints` está VERMELHO, e não sou eu.** Provado: `git stash -u`
   na minha árvore, script rodado sem nenhuma mudança minha → **rc=1 igual**. O
   vermelho é o frontmatter da própria `2026-08-26-LEVA-1-*.md` colidindo com
   **dezesseis** sprints antigas, três delas nos meus arquivos:
   - `BORDA-DE-QUEDA-01 x LEVA-1` → `daemon/subsystems/coop.py`
   - `COOP-QUE-NAO-DESMONTA-01 x LEVA-1` → `coop.py` + `core/backend_pydualsense.py`
   - `JOGADOR-3-FANTASMA-01 x LEVA-1` → `daemon/subsystems/gamepad.py`
   - `VPAD-SUSPENSO-MORTO-01 x LEVA-1` → `gamepad.py`
   - `NAVEGACAO-UM-CONTROLE-SO-01 x LEVA-1` → `coop.py` + `gamepad.py`
   - `COOP-NA-CONEXAO-NATIVA-01 x LEVA-1` → `coop.py`
   - `RESERVA-DO-POSTO-01 x LEVA-1` → `backend_pydualsense.py`

   O conserto é no **frontmatter da sprint da leva** (`depois_de:` ou
   `nao_toca:`), que não é da minha posse — R-A: relato, não escrevo. As outras
   nove colisões são das frentes B..G. `scripts/check_colisao_de_sprints.py` é
   posse da **L1-G**; o arquivo de sprint é de quem coordena.

2. **A bancada é o que fecha o item 1 do "não verifiquei".** Uma sessão de dois
   no rádio, uma queda de verdade, e o olho dela no motor. Se a queda for por
   perda de rádio (item 2 acima), a conclusão pode ser que **o conserto de
   verdade é o relógio** — hoje um teto de 3 s, e três segundos de motor a
   (230, 230) na mão dela é muito. Baixar esse teto é decisão dela, e
   `uhid_gamepad.py` está fora da minha posse.

3. **`stop_all` / `disable` herdam a cura — isto eu MEDI.** `disable()` é
   `for key in list(self._players): self._teardown_player(key)`, e
   `stop_all = disable` é alias literal. Nenhuma rota de desmonte própria,
   nenhum buraco paralelo. O efeito de tabela: um `disable` de mesa cheia agora
   manda N stops endereçados em vez de zero. É o que se quer, e é barato — um
   report por handle.

4. **Duas afirmações de documento ficaram FALSAS agora, e as duas estão fora
   da minha posse.** Regra da casa: fato errado se SUBSTITUI, e em todos os
   lugares — relato para quem for dono:
   - `docs/protocol/paridade-bluetooth-versus-cabo.md`, linha 194: *"cai; a
     primitiva existe (`force_rumble_stop`) e não é chamada ali."* Agora é
     chamada.
   - `docs/process/sprints/2026-08-03-BORDA-DE-QUEDA-01-o-que-fica-para-tras-quando-um-controle-cai.md`,
     linha 187, que descreve o mesmo buraco como aberto.

5. **`docs/data/mapa-controles.csv`, linha 293** documenta a API do rumble como
   `force_rumble_stop()`. A assinatura mudou para `force_rumble_stop(uniq=None)`.
   Fora da minha posse; relato.

6. **Nenhum texto de tela novo.** Nada aqui chega à interface: as duas curas são
   de daemon. Sem R-E, sem `PROVISÓRIO — decisão dela`, e nenhuma foto de aba
   precisa ser refeita por causa desta frente (R-C não me alcança).
