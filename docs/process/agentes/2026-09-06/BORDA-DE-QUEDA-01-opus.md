# BORDA-DE-QUEDA-01 — o restore do Jogador 1 passou a ser POR NÓ

- **Árvore:** `hefesto-voo/BORDA-DE-QUEDA-01-opus` · branch `voo/BORDA-DE-QUEDA-01-opus`
- **Base:** `39fa440d`, o mesmo `git rev-parse --short onda/atual-0609` (conferido)
- **Posse exercida:** `src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py`
- **Bancada:** não pedida e não usada (`bancada: false`; nenhum caminho para o
  daemon, o `systemctl` ou o aparelho). A linha de prova no aparelho fica para a
  MESA-DE-QUATRO-01.

---

## O que mudou

**Uma linha de produto, e é a E2 inteira** — a única entrega que a nota
**ROTA CORRIGIDA** do topo da sprint deixou de pé (as outras três já tinham
fechado em 26/08; ver "o que caiu da sprint", abaixo).

`daemon/subsystems/gamepad.py`, `_broker_sync_grab`, ramo `grab=False` — o
caminho por onde o `stop_gamepad_emulation` do P1 solta o grab:

```python
# antes
else:
    broker_call_nonblocking(daemon, client.restore_all)

# depois
elif isinstance(node := hidraw_fn(), str) and node:  # E2: o nó do P1
    broker_call_nonblocking(daemon, lambda: client.restore(node))
```

**Duas linhas por duas linhas, de propósito** — a cura é rigorosamente
NEUTRA EM NÚMERO DE LINHAS, e as outras duas mudanças no arquivo também são
(3↔3 e 1↔1). Isso não é estética: ver "As duas armadilhas do dia", ao fim.

**Por que a troca é a cura e não um contorno.** `restore_all` não quer dizer
"restaura o que este caminho escondeu": o servidor o executa sobre a **lease
inteira** — `broker/hidraw_broker.py:689-694` percorre `by_conn[conn_id]` — e o
daemon inteiro fala com o broker por **uma conexão só**
(`integrations/hidraw_broker_client.py`, cliente-lease singleton por daemon).
Desligar a emulação do Jogador 1 devolvia à vista o hidraw físico dos QUATRO, e
cada secundário com o vpad DELE bem vivo voltava a aparecer no jogo como físico
**e** virtual. Com um controle só as duas chamadas são indistinguíveis: o
defeito nasce da pluralidade, e é por isso que régua nenhuma o via — as que
existiam exercitavam uma lease com **um** nó.

**A armadilha nomeada pela sprint foi respeitada.** A assimetria é
intencional — *"o restore NÃO tem gate de modo: expor nunca é errado"*,
doutrina *"duplicado é melhor que zero controles"* — e continua de pé: o
restore do P1 roda mesmo em Modo Nativo, e o `restore_all` continua vivo onde
está certo, no EOF/close da lease. **O que se corrigiu é o ALCANCE de uma
chamada, não a política.** Há teste para cada uma dessas duas frases,
justamente para que a próxima pessoa não desfaça a assimetria junto com o
alcance.

**O ramo sem nó resolvível** (controle arrancado da mesa: `hidraw_path()` →
`None`) deixa de desnudar ninguém: não há o que restaurar, o nó velho já não
existe no `/dev`, e a rede continua sendo o EOF da lease no shutdown
(`daemon/connection.py`). É simétrico ao ramo do hide, que também não faz nada
sem nó (`test_primario_sem_no_nao_pede_hide`, que já existia). Há régua para
esse ramo: `test_sem_no_resolvivel_ninguem_e_desnudado`.

**Prosa corrigida no mesmo arquivo** (regra do fato-errado, e as duas eram
afirmações sobre o código de HOJE, não notas datadas do que morreu):
a docstring de `_set_evdev_grab` dizia que o caller chama `restore_all` com
`grab=False`; a de `_broker_sync_grab` não dizia de quem é o nó. As NOTAS
DATADAS de 08–09/08 que citam o `restore_all` da borda antiga ficaram intactas:
elas descrevem, corretamente, comportamento morto.

**O "porquê" longo NÃO está no comentário do código, e é a única coisa nesta
entrega que eu faria diferente se pudesse.** Ele está no docstring de módulo da
régua nova, que é onde esta casa já guarda a prosa mais cuidadosa, e aqui. O
motivo é a armadilha 1, abaixo: um bloco de comentário no site da cura empurra
para baixo tudo o que vem depois, e o que vem depois é citado por linha.

### Testes

- **novo:** `tests/unit/test_borda_de_queda_01_o_restore_do_p1_e_por_no.py` —
  6 testes;
- **ajustados ao mundo novo:** `test_hidraw_broker_hooks.py` (3 asserções +
  docstring do módulo), `test_esconder_em_vez_de_sair_01.py` e
  `test_r06_allowlist_steam_input.py` (os dublês ganharam `restore`),
  `test_coop_nao_cai_em_silencio.py` (idem).

O ajuste dos dublês não é cosmético: sem `restore`, a chamada nova morreria em
`AttributeError` dentro do `contextlib.suppress` e a asserção `restores == 0`
daria **verde por engolimento**, não por ninguém ter exposto nada. Era o
"dublê que só sabe passar" que o protocolo §4 nomeia.

---

## Qual mordida prova

**A régua nova usa o broker DE VERDADE, e é esse o ponto.** Um dublê de cliente
responderia "`restore_all` foi chamado" — mas a frase que interessa é sobre o
estado do **servidor**: *quais nós continuaram escondidos*. Quem sabe isso é o
broker, e o alcance de `restore_all` mora nele. Então o teste sobe o `Broker`
real numa thread, em socket unix real, com o `HidrawBrokerClient` real por cima
e quatro nós numa lease só (P1 + três secundários). Só o sistema de arquivos é
dublado (`FakeOps`) — nenhum `/dev` real, nenhum `chmod`, nenhum aparelho. É o
arranjo que a E5 pedia ("o broker real sobre um tmpfs com quatro char devices
falsos, com o cliente único do daemon"), no que ele pode dar sem bancada.

**A cura arrancada** — `broker_call_nonblocking(daemon, client.restore_all)` de
volta no lugar:

```
FAILED tests/unit/test_borda_de_queda_01_o_restore_do_p1_e_por_no.py::test_o_stop_do_p1_restaura_so_o_no_do_p1
FAILED tests/unit/test_borda_de_queda_01_o_restore_do_p1_e_por_no.py::test_o_ramo_do_ungrab_pede_restore_de_um_no_so
FAILED tests/unit/test_borda_de_queda_01_o_restore_do_p1_e_por_no.py::test_o_restore_do_p1_continua_sem_gate_de_modo_nativo
FAILED tests/unit/test_borda_de_queda_01_o_restore_do_p1_e_por_no.py::test_sem_no_resolvivel_ninguem_e_desnudado
FAILED tests/unit/test_hidraw_broker_hooks.py::TestGrabP1::test_stop_com_release_restaura_o_no_do_p1
FAILED tests/unit/test_hidraw_broker_hooks.py::TestGrabP1::test_restore_nao_tem_gate_de_modo
FAILED tests/unit/test_hidraw_broker_hooks.py::TestBrokerForaDoEventLoop::test_sync_grab_restore_agenda_e_nao_bloqueia
7 failed, 44 passed in 1.00s
```

E a asserção que **nomeia o estrago**, dita pelo servidor:

```
E   AssertionError: parar o Jogador 1 desnudou o hidraw de quem não é ele: escondidos=[]
```

Quatro nós escondidos, o P1 parou, **zero** continuaram escondidos. Esse `[]` é
o defeito inteiro numa linha.

**A cura devolvida:**

```
tests/unit/test_borda_de_queda_01_o_restore_do_p1_e_por_no.py .....  6 passed
```

E o escopo inteiro — os 15 arquivos de teste que citam
`stop_gamepad_emulation`, `_broker_sync_grab` ou `broker_client_for`, mais o
protocolo do broker e as três réguas irmãs da BORDA-DE-QUEDA-01:

```
317 passed, 1 warning in 11.27s
```

Saídas em `/tmp/bq01-mordida.txt` (a reprovação) e `/tmp/bq01-escopo.txt`.

### O que a régua NÃO prova, de propósito

Que a política mudou — ela não mudou. Dois dos seis testes existem só para
travar isso: `test_o_restore_do_p1_continua_sem_gate_de_modo_nativo` e
`test_o_eof_da_lease_continua_restaurando_a_mesa_inteira`. E um terceiro,
`test_com_um_controle_so_o_efeito_e_o_mesmo_de_antes`, existe para provar que a
cura não trocou um defeito de pluralidade por um defeito de solidão.

---

## O que NÃO verifiquei

- **O APARELHO.** Nenhum DualSense foi tocado. `bancada: false`, e nenhum passo
  desta entrega para o daemon, escreve no controle ou chama `systemctl` — então
  `scripts/bancada.sh exigir` não foi chamado, e não havia por que chamá-lo. O
  degrau alcançado é **SAIU NO FIO**: o comando `restore` viajou o protocolo
  JSON-por-linha por um socket unix real até um `Broker` real, que decidiu o
  alcance e chamou o `FsAclOps`. Quem chama o `chmod`/ACL de verdade num
  `/dev/hidrawN` de verdade é o `FsAclOps` real, e **isso eu não exercitei**.
- **A CENA DELA, com quatro controles no rádio.** A frase de aceite da sprint —
  *"parar a emulação do P1 não altera o estado de exposição dos nós dos
  secundários"* — está provada contra o broker; não está provada contra o jogo
  dela vendo (ou não vendo) oito controles. **É essa a linha que sobra para a
  MESA-DE-QUATRO-01.**
- **O caminho do co-op.** O hide dos secundários entra no teste pelo cliente
  direto, não por `coop.py::_broker_hide_player` — `coop.py` está em
  `nao_toca:`. O estado de servidor resultante é o mesmo (quatro nós, uma
  lease), que é o que a régua mede; a rota real do hide de um secundário não
  foi exercitada por mim.
- **A suíte inteira.** Rodei o escopo (317 testes nos arquivos que tocam o
  caminho alterado), não a suíte — regra da casa: a suíte é de quem coordena, e
  em oito lotes.
- **A tela.** Esta sprint não toca interface: nenhuma janela nasceu, nenhuma
  foto foi tirada, nenhum workspace foi trocado.

---

## O que sobrou para o próximo

1. **`daemon/connection.py:1354` tem um comentário que envelheceu com esta
   mudança.** Ele diz *"o `stop_gamepad_emulation` acima já pediu restore_all"*
   — e agora o stop pede `restore` do nó do P1. **O raciocínio do comentário
   continua certo** (o `close` da lease logo abaixo é que restaura o resto, por
   EOF), só a chamada citada mudou de nome e de alcance. **Não editei porque
   `daemon/connection.py` está na `posse:` da
   O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01, do mesmo lote.** Quem costurar, ou
   aquela sprint, troca duas palavras.
2. **A prova de aparelho, para a MESA-DE-QUATRO-01:** com quatro DualSense no
   rádio e o co-op de pé, desligar a emulação do P1 pela interface e conferir
   que os jogadores 2, 3 e 4 **não** duplicam no jogo. Célula do mapa a marcar:
   `plataforma.adocao` (dualsense), cujo `cabo_ate_onde_foi` e
   `radio_ate_onde_foi` estão **vazios** — não medidos. Esta entrega alcança
   **SAIU NO FIO** nos dois transportes por construção (o caminho não tem gate
   de transporte: é o mesmo `_broker_sync_grab` no cabo e no rádio); o degrau
   **O JOGO REAGIU** é o que falta, e só a mesa dela dá.
3. **A E5 completa continua aberta.** A bancada que a sprint desenhou (o
   enumerador com roteiro, compartilhado com a COOP-QUE-NÃO-DESMONTA-01) não
   nasceu aqui: eu construí só a fatia que a E2 precisava — broker real, quatro
   nós, uma lease. As outras três asserções da E5 (rumble na borda, re-hide sem
   P1, áudio por MAC) já têm régua própria, das entregas de 26/08:
   `test_borda_de_queda_01_o_rumble_na_borda.py`,
   `test_borda_de_queda_01_rehide_sem_p1.py` e
   `test_borda_de_queda_01_audio_por_mac.py`.
4. **O que a sprint deixou explicitamente aberto e ninguém fechou:** por que os
   readers reiniciaram às 21:52:06 na sessão de 02/08. O log mostra o efeito,
   não a causa; a `BT-QUE-NÃO-CAI-01` é quem investiga.

---

## O que caiu da sprint — as linhas que o disco derrubou

A nota **ROTA CORRIGIDA** já avisava que a E2 mora em `gamepad.py`, não em
`coop.py`. Conferindo o disco antes de tocar em código, **três das cinco
entregas do corpo da sprint já estavam feitas** — em 26/08/2026, creditadas à
própria BORDA-DE-QUEDA-01, e o corpo do enunciado nunca foi atualizado:

| entrega | o que o enunciado dizia | o que está no disco hoje |
| --- | --- | --- |
| **E1** — rumble zerado na borda | "quatro pontos onde o device desaparece" | **feita nos dois pontos que eu conferi**, e não nos quatro: o teardown do co-op (`coop.py:1387` e `:1405` — "o motor para ANTES de o vpad morrer", com `tests/unit/test_borda_de_queda_01_o_rumble_na_borda.py`) e a destruição do vpad do P1 (`zero_motors_on_mode_exit` no `stop_gamepad_emulation`, que a HARM-16 já pusera lá). Os pontos 3 (`UHID_STOP` do kernel) e 4 (`_close_handles` do físico) **eu NÃO conferi** — `coop.py` está em `nao_toca:` e `backend_pydualsense.py` é da BATERIA-PARADA-01 |
| **E3** — re-hide refém do vpad do P1 | "o `if not _vpad_vivo(daemon): return` de `gamepad.py:656-657` roda antes do laço" | **feita.** `gamepad.py:1083` — o gate do P1 guarda só o nó do P1, e cada secundário é guardado pelo vpad dele. `tests/unit/test_borda_de_queda_01_rehide_sem_p1.py` |
| **E4** — reaplicação de áudio a todos | "`connection.py:88-131` chama sempre com `uniq=None`" | **feita.** `connection.py:230` e `:269` passam `uniq=`; `backend_pydualsense.py:3930` aceita o alvo. `tests/unit/test_borda_de_queda_01_audio_por_mac.py` |

**Os endereços do corpo da sprint estão todos velhos** — `gamepad.py:217`,
`:279` e `:656-657`, `coop.py:905`, `connection.py:88-131`. O endereço vivo da
E2 é o que a ROTA CORRIGIDA dá (`_broker_sync_grab`, ramo `grab=False`), e foi
o que segui.

**Nenhuma célula do mapa derrubou nada.** `plataforma.adocao` — a chave desta
sprint, cujo `codigo_ref` aponta exatamente para `gamepad.py:153, :207`, as
funções de grab/hide do primário — tem `cabo_aciona=sim` e `radio_aciona=sim`
para o DualSense, e os dois `ate_onde_foi` **vazios**. Célula atrasada não
veta: construí, medi, e relato acima com a chave ao lado.

---

## As duas armadilhas do dia

**1. Editar `gamepad.py` acima da linha 1292 REPROVA dois portões, e a saída
não diz por quê.** A primeira versão desta cura trazia trinta linhas de
comentário explicando o defeito. Os portões voltaram com:

```
REPROVOU: 2 vermelho(s) de 45 -> citacoes-de-linha citacoes-no-codigo
  docs/data/mapa-controles.csv:305 (vibracao.rumble.passthrough@dualsense): `daemon/subsystems/gamepad.py:1292`
    -- a faixa não contém `apply_game_rumble`, que a citação promete
  docs/data/mapa-controles.csv:172 (luz.replica_output_jogo@dualsense): `...gamepad.py:1400`
    -- a faixa não contém `apply_game_lightbar`
  app/actions/emulation_actions.py:560 cita a linha 797, que está EM BRANCO
```

Nada disso é sobre o que eu escrevi: é **deriva de linha**. O comentário
empurrou `apply_game_rumble` de 1292 para 1312 e `apply_game_lightbar` de 1400
para 1420, e três células do mapa mais um comentário em `app/` passaram a
apontar para o lugar errado. **O baseline estava verde**, conferido com
`git stash` (`OK: 3028 citações`).

**E o conserto óbvio é proibido de dois jeitos.** Reapontar os quatro endereços
funciona — eu fiz, e os dois portões ficaram verdes —, mas: (a) o preâmbulo diz
*"você NÃO edita `docs/data/mapa-controles.csv` a menos que ele esteja na sua
`posse:`"*, e não está; (b) editar o CSV põe `html/specs.html` **em atraso**, e
o portão `mapa-de-canais` reprovou pedindo `python3 scripts/gerar-mapa.py` —
que a §5 do protocolo proíbe rodar sem `--check`, por ser artefato
compartilhado. Um vermelho vira dois vira três.

**A saída foi tirar a causa:** a cura passou a ser rigorosamente neutra em
número de linhas (`6 6` no `git diff --numstat`) — o `else:` de duas linhas
virou um `elif` com walrus de duas linhas, e as duas correções de docstring
trocam 3 por 3 e 1 por 1. Zero deriva, zero portão tocado, zero conflito com a
SPECS-A-PROCEDENCIA-01 e com quem quer que regenere o `specs.html`.

**A regra que isso deixa, e ela é para toda sprint que possua um arquivo grande
de `src/`:** *o número da linha é interface pública nesta casa.* Antes de
escrever prosa no meio de um arquivo citado, meça o custo — `bash
scripts/portoes.sh --rapido` já pega o `citacoes-de-linha` em 200 ms, e ele
sabe dizer quantas linhas você derivou. Prosa no fim do arquivo, ou no teste,
não custa nada; prosa no meio custa quatro endereços e um artefato de 1,7 MB.

**2. Um dublê sem o método novo dá verde por AttributeError, não por acerto.**
Três dublês de broker desta suíte tinham `hide` e `restore_all`, e nenhum tinha
`restore`. Com a cura no lugar, a chamada nova morre em `AttributeError` dentro
do `contextlib.suppress` que protege o caminho inteiro — e a asserção
`restores == 0` continua **verde**, dizendo "ninguém expôs nada" quando o que
houve foi "ninguém conseguiu chamar nada". É o "dublê que só sabe passar" do §4
do protocolo, na forma mais silenciosa: o `suppress` que existe para honrar
*"duplicado > zero controles"* engole também o erro do instrumento. Os três
ganharam `restore`.
