---
sprint: ONDA0-Z1-A-PONTE-QUE-SABE-DIZER-NAO-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# ONDA0-Z1 — a ponte que sabe dizer não

**24/08/2026. GRAU: MEDIDO**, exceto onde a linha diz DESENHO, HIPÓTESE ou NÃO
VERIFICADO. Árvore de referência: `dev`, commit `c111d74`. Bancada viva às 22h35
de 23/08 — daemon ativo, **mesa VAZIA** (zero DualSense físico), as medições
abaixo tiradas nessa condição.

Frente **Z1** da **Onda 0** ([SPRINT_ORDER.md](../SPRINT_ORDER.md), §0.2). Cura o
defeito de forma **F1** da §0.1 — o mesmo que o diagnóstico de 23/08 chamava de P1 — do
[diagnóstico de 23/08](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md).

**O que esta frente fecha**

1. A ponte já entrega a resposta do daemon e **nenhuma aba a pede**: dos dez
   `*_detalhado` públicos, **oito têm ZERO chamador de produção**; os dois
   leitores do corpo (`destinos_da_aplicacao`, `alvo_honrado`) têm **ZERO**.
2. As abas que decidem "aplicado" x "guardado" o fazem por **heurística do
   estado da janela**, que não cobre o caso medido — mesa vazia com o alvo em
   "Todos" — e cai justamente onde o daemon responde `aplicado_em: []`.
3. Duas rotas onde é o **daemon** que joga a razão fora: o desfecho `EMU_*` do
   gamepad virtual, colapsado num `bool`; e o `status` do Proton, colapsado em
   `errors: 0|1`.
4. Um erro de parâmetro do cliente volta como `-32603 erro interno` **em 8,5 s**
   — acima de todos os tetos da janela, que o lê como "daemon desligado".
5. O portão da família, que o [ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md)
   pediu na E7 e ninguém escreveu.

**O que esta frente NÃO faz**

- **Não inventa um segundo contrato.** O caminho aditivo do F1 já existe
  (`app/ipc_bridge.py`, provado por `tests/unit/test_p1_a_resposta_do_daemon_atravessa_a_ponte.py`,
  29 testes). Toda tarefa abaixo **estende** aquilo. Dois contratos para a mesma
  coisa é o defeito que esta casa mais paga.
- **Não mede Bluetooth.** É trilha dela (D2). O que esta frente não pode afirmar
  na tela até a medição existir está na seção 7.
- **Não toca o alvo de edição.** `_edit_target_uniq` é da Z2, e as duas correm
  em paralelo justamente porque os arquivos são disjuntos (ponte × alvo). Onde
  esta frente encosta na heurística de alvo, ela a **rebaixa a "não sei"** em vez
  de reescrevê-la — ver T5.
- **Não redesenha layout.** Só duas tarefas põem texto novo na tela (T5 e T10) e
  as duas estão carimbadas ESTRUTURAL.

---

## 1. O defeito, em uma frase

**O Hefesto pergunta ao aparelho, o aparelho responde "não fiz nada e este é o
motivo", e a janela apaga a resposta antes de ler — então ela comemora igual
quando funcionou e quando não funcionou.**

---

## 2. O que está MEDIDO

Cada bloco traz o comando que o produz. Tudo abaixo foi rodado em 23/08/2026
entre 22h28 e 22h40, com o daemon vivo e a mesa vazia. **O daemon não foi parado
em momento nenhum** (regra R3).

### 2.1 A prova que é a frente inteira, em cinco linhas

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.app import ipc_bridge as b
print('_call_checked         ->', b._call_checked('trigger.set',{'side':'left','mode':'Rigid','params':[5,200]}))
ok,mot,corpo = b.trigger_set_detalhado('left','Rigid',[5,200])
print('trigger_set_detalhado ->', ok, mot, corpo)
print('destinos_da_aplicacao ->', b.destinos_da_aplicacao(corpo))
print('mic_volume_set (bool) ->', b.mic_volume_set(50))
print('mic_volume_detalhado  ->', b.mic_volume_set_detalhado(50))"
```

```
_call_checked         -> (True, None)
trigger_set_detalhado -> True None {'status': 'ok', 'aplicado_em': [], 'guardado_em': []}
destinos_da_aplicacao -> ([], [])
mic_volume_set (bool) -> False
mic_volume_detalhado  -> {'status': 'sem_fonte', 'fonte': None, 'volume': None}
```

**A verdade está na terceira linha e a aba usa a primeira.** `_call_checked` diz
`(True, None)` — a aba Gatilhos escreve *"aplicado"*. A irmã detalhada, no mesmo
instante e no mesmo daemon, diz que **zero controles** receberam alguma coisa. E
o microfone: `False` é o mesmo valor que a ponte devolve com o daemon desligado,
enquanto o corpo diz `sem_fonte` — que é o daemon VIVO explicando que não há
fonte de captura.

Confirmação nas outras duas rotas, mesma sessão:

```
led.set        -> {'status': 'ok', 'aplicado_em': [], 'guardado_em': []}
led.player_set -> {'status': 'ok', 'bits': [...], 'aplicado_em': [], 'guardado_em': []}
trigger.reset  -> {'status': 'ok', 'aplicado_em': [], 'guardado_em': []}
```

### 2.2 O censo: a ponte foi construída e ninguém a atravessa

```bash
.venv/bin/python - <<'EOF'
import re, pathlib
src = pathlib.Path("src/hefesto_dualsense4unix")
b = (src/"app/ipc_bridge.py").read_text()
nomes = re.findall(r'"([^"]+)"', re.search(r"__all__ = \[(.*?)\]", b, re.S).group(1))
alvos = [n for n in nomes if n.endswith("_detalhado")] + [
    "destinos_da_aplicacao", "alvo_honrado", "aplicacao_confirmada"]
texto = {p: p.read_text() for p in src.rglob("*.py") if p.name != "ipc_bridge.py"}
for n in alvos:
    hits = [p for p, t in texto.items() if n in t]
    print(f"{n:32s} {len(hits)}  {[str(p).split('4unix/')[1] for p in hits]}")
EOF
```

| símbolo da ponte | chamadores de PRODUÇÃO |
|---|---|
| `apply_draft_detalhado` | 1 arquivo (`app/actions/lightbar_actions.py`) |
| `machine_declare_detalhado` | 1 arquivo (`app/actions/footer_actions.py`) |
| `aplicacao_confirmada` | 1 arquivo (`app/actions/lightbar_actions.py`) |
| `led_set_detalhado` | **0** |
| `player_leds_set_detalhado` | **0** |
| `mic_set_detalhado` | **0** |
| `mic_volume_set_detalhado` | **0** |
| `rumble_policy_set_detalhado` | **0** |
| `speaker_set_detalhado` | **0** |
| `trigger_set_detalhado` | **0** |
| `trigger_reset_detalhado` | **0** |
| `destinos_da_aplicacao` | **0** |
| `alvo_honrado` | **0** |

**É a forma exata do F2** — a cura escrita e nunca ligada — dentro da frente que
existe para curar o F1. E o registro de lacunas do portão
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1024-1095` **já traz as
sete entradas com a linha que cada uma fecha**, escritas pela leva do F1. Esta
frente é a execução daquele registro; as tarefas abaixo copiam os endereços de
lá e os **reconferiram contra a árvore de hoje** (2.7).

### 2.3 Onde a ponte ainda estreita, hoje

Duas funções, e as duas continuam sendo o caminho que as abas usam:

- `app/ipc_bridge.py:85` — `_safe_call` devolve `(False, None)` para **três
  causas diferentes**: daemon offline, erro de transporte e **erro JSON-RPC do
  servidor** (o daemon vivo recusando). Quem lê o `False` não tem como separá-las.
- `app/ipc_bridge.py:376` — `_call_checked` é hoje um invólucro de
  `_call_checked_detalhado` que faz `ok, motivo, _corpo = …` e **descarta o
  corpo** na linha seguinte. O motivo do erro JSON-RPC atravessa; `aplicado_em`,
  `guardado_em` e `por_uniq` não.

> **Fato errado, SUBSTITUÍDO.** O briefing desta frente e a §0.1 do
> `SPRINT_ORDER.md` citam `ipc_bridge.py:800-804` como o ponto que descarta o
> campo do microfone. **Na árvore de hoje essas linhas são o dicionário
> `_CAMPOS_DA_MAQUINA`** — o endereço envelheceu quando o F1 acrescentou ~500
> linhas ao arquivo. Os endereços vivos são os dois acima, mais
> `app/widgets/controller_card.py:3684`, que é onde o `bool` do microfone é de
> fato consumido. O lado do daemon **não** mudou: `ipc_handlers.py:4517` calcula
> `por_uniq` e `:4538` o publica.

### 2.4 A heurística da janela não cobre o caso medido

`app/textos_de_aplicacao.py` é o dono único do vocabulário do "guardado" (D-9,
14/08). Ele decide entre *aplicado* e *guardado* lendo o **estado da janela**, não
a resposta do daemon:

| função | linha | o que lê |
|---|---|---|
| `alvo_fora_da_mesa` | `app/textos_de_aplicacao.py:85` | `_edit_target_uniq` + `_target_uniq_by_index` |
| `coop_manda_nas_luzes` | `:127` | `_coop_ligado` |
| `modo_nativo_manda_no_output` | `:140` | `_modo_nativo_ligado` |

E `alvo_fora_da_mesa:120-122` sai com `None` — *"a escrita é global, não há alvo
a guardar"* — sempre que o alvo é **"Todos"**. Com a mesa vazia e o alvo em
"Todos", que é o estado de fábrica, o toast de `app/actions/triggers_actions.py:658`
cai no ramo `else` e escreve **"Gatilho esquerdo (L2): Rigid aplicado"** sobre a
resposta `aplicado_em: []` da 2.1.

**As três razões da janela cobrem duas das rotas do daemon e não cobrem a
terceira** — a rota clássica de mesa vazia, que é exatamente a que a bancada
mediu. Não é heurística ruim: é heurística no lugar de uma resposta que já
existe.

### 2.5 Onde é o DAEMON que joga a razão fora

**(a) O desfecho do gamepad virtual.** `daemon/lifecycle.py:1561`
(`set_gamepad_emulation_desfecho`) devolve o vocabulário `EMU_*` — `aplicado`,
`ja_estava`, `bloqueado_por_jogo`, `recusado_steam_input`, `falhou`. A fachada
`set_gamepad_emulation` (`:1511`) o colapsa num `bool`, e
`daemon/ipc_handlers.py:4642` (`_handle_gamepad_emulation_set`) chama a fachada e
responde `{"status": "ok" if ok else "failed", "enabled": …, "flavor": …}` —
**sem campo de motivo**.

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.daemon.subsystems.gamepad import (
    DESFECHOS_EMULACAO_ATIVA, EMU_BLOQUEADO_POR_JOGO, EMU_RECUSADO_STEAM_INPUT)
print(EMU_BLOQUEADO_POR_JOGO in DESFECHOS_EMULACAO_ATIVA)
print(EMU_RECUSADO_STEAM_INPUT in DESFECHOS_EMULACAO_ATIVA)"
# True
# False
```

`EMU_BLOQUEADO_POR_JOGO` está no conjunto de "emulação ativa" — e está certo, a
emulação SEGUE ativa, com a máscara anterior. Mas a consequência é que **o gate
R-04 recusando a troca de máscara com o jogo aberto vira `status: "ok"`** e
atravessa a ponte como sucesso. E `EMU_RECUSADO_STEAM_INPUT` vira `"failed"` sem
uma palavra sobre a allowlist.

Do outro lado, `app/actions/emulation_actions.py:1313` recebe o corpo como
`_res` — **com o sublinhado do descarte** — e chama `self._toast_emulation(msg)`
com a frase de sucesso montada antes da chamada (`:1336`, `:1341`, `:1348`).
`call_async` entrega o corpo ao `on_success` sempre que não houve exceção, então
`status: "failed"` **também** produz o toast alegre.

**(b) O Proton.** `integrations/proton_pin.py:766` documenta quatro status —
`locked`, `noop`, `recusado`, `erro` — e `:901` os traduz para
`"errors": 1 if status == "erro" else 0`, jogando o `reason` fora do contrato.

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.app.actions.daemon_actions import format_proton_lock_result as F
for st in ('recusado','erro','noop'):
    print(f'{st:9s} ->', F({'locked':0,'skipped':0,'errors':1 if st=='erro' else 0,'tool':'Proton-X'}))"
```

```
recusado  -> Nada a mudar — os jogos já estão no Proton validado (Proton-X) …
erro      -> Nenhum jogo foi alterado. Atenção: 1 jogo(s) falharam …
noop      -> Nada a mudar — os jogos já estão no Proton validado (Proton-X) …
```

**`recusado` e `noop` são a mesma frase.** O `recusado` só nasce de um lugar —
`_steam_gate()` em `proton_pin.py:784`, a Steam aberta. Ou seja: **com a Steam
aberta, o botão "Travar Proton validado" responde que os jogos já estão
travados.** O `reason`, que diz por quê, existe e fica dentro de `detail`.

### 2.6 O erro de parâmetro que custa 8,5 segundos e volta como "erro interno"

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.app import ipc_bridge as b
import time
for p in ({'side':'left','mode':'Rigid','params':[]},
          {'side':'left','mode':'Rigid','params':[50,200]},
          {'rgb':[0,0,0,0]}):
    t=time.monotonic()
    try: b._run_call('trigger.set' if 'side' in p else 'led.set', p, timeout=15.0)
    except Exception as e: print(f'{time.monotonic()-t:5.2f}s  {e}')"
```

```
 8.33s  [-32603] erro interno (TypeError)      # params de menos
 0.00s  [-32003] position fora do range 0-9: 50
 0.00s  [-32003] led.set: rgb precisa ser lista com 3 inteiros
```

Repetido duas vezes: 8,33 s e 8,63 s. **MEDIDO:** um `ValueError` volta em
milissegundos com `CODE_INVALID_PARAMS`; um `TypeError` — mesmo erro de cliente,
`build_from_name` chamado com aridade errada em `ipc_handlers.py:1141` — cai no
`except Exception` de `daemon/ipc_server.py:359` e volta como
`-32603 erro interno` depois de oito segundos e meio. Os tetos da janela são
0,25 s (`_safe_call`), 1,5 s (o `apply_draft` do rodapé) e 2,0 s
(`MODE_IPC_TIMEOUT_S`): **a janela desiste antes e diz "o Hefesto pode estar
desligado"**, que é o defeito desta frente na sua forma mais cara — culpar o
daemon vivo.

### 2.7 As âncoras do registro de lacunas, reconferidas HOJE

O registro do portão (`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`)
nomeia a linha que fecha cada lacuna. Conferi as nove, uma a uma, contra
`c111d74`:

| o que o registro diz | confere hoje? |
|---|---|
| `triggers_actions.py:593` (+ `:609`, `:613`, `:618`) — `trigger_set_checked` | **sim**, os quatro |
| `triggers_actions.py:655` — `ok, _motivo = trigger_reset(...)` | **sim** |
| `triggers_actions.py:658` — `_toast_trigger` | **sim** (`def` em `:658`; a chamada do reset em `:656`) |
| `lightbar_actions.py:934` — `_enviar_cor_por_mac` | **sim**; os outros dois `led_set` estão em `:689` e `:801` |
| `lightbar_actions.py:965` e `:969`, dentro de `_enviar_player_leds:938` | **sim**, os três |
| `rumble_actions.py:579` — `rumble_policy_set_checked` | **sim** |
| `controller_card.py:3684` — `mic_volume_set` | **sim** |
| `controller_card.py:3993` — `_mic_confirmado_pelo_daemon` | **sim** |
| `ipc_handlers.py:4538` — `por_uniq` na resposta | **sim** (calculado em `:4517`) |
| `ipc_bridge.py:800-804` (do briefing, não do registro) | **NÃO** — ver 2.3 |

### 2.8 As sete superfícies que dizem "aplicado" sem prova

| # | aba | onde o gesto sai | o que a bancada mediu |
|---|---|---|---|
| 1 | **Gatilhos** | `app/actions/triggers_actions.py:593`, `:655` | `aplicado_em: []`, toast "aplicado" |
| 2 | **Lightbar** | `app/actions/lightbar_actions.py:689`, `:801`, `:934`, `:965`, `:969` | idem, nas duas rotas de LED |
| 3 | **Status** (card, compartilhado com **No jogo**) | `app/widgets/controller_card.py:3684`, `:3186`, `:3792` | `sem_fonte` chega como o `False` de daemon offline |
| 4 | **Rumble** | `app/actions/rumble_actions.py:579` | **sem mentira medida** — o corpo é eco; entra por uniformidade |
| 5 | **Emulação** | `app/actions/emulation_actions.py:1313` | corpo descartado em `_res`; `status: "failed"` toasta sucesso |
| 6 | **Sistema** | `app/actions/daemon_actions.py:725` | `recusado` lê como "já estão travados" |
| 7 | **Início / rodapé** | `daemon/ipc_handlers.py:4642` via `app/actions/mode_transition.py:157` | recusa do gate R-04 vira `status: "ok"` |

**O rodapé é o que está MENOS quebrado, e é o molde.**
`footer_actions.py:585-624` (`_apply_draft_agora`) já separa as duas perguntas —
`aceita` (o daemon respondeu) e `aplicou` (alguma seção entrou) — e a razão está
escrita no comentário APLICAR-VERDADE-02. As seis linhas de cima têm de chegar
onde ele já está.

---

## 3. O que é HIPÓTESE, e o que NÃO foi verificado

- **HIPÓTESE:** que os 8,5 s da 2.6 sejam a renderização do traceback `rich` no
  `logger.exception` de `daemon/ipc_server.py:363`. O journal mostra o traceback
  em caixa formatada, e as duas rotas que voltam por `ValueError` (sem
  `logger.exception`) respondem em 0,00 s — mas eu **não** isolei a variável.
  **O experimento que decide:** rodar o mesmo pedido com o logger em `WARNING`
  sem tracebacks ricos e cronometrar. T15 mede antes de consertar.
- **NÃO VERIFICADO:** que sejam SETE abas, e não seis. A §0.1 do
  `SPRINT_ORDER.md` diz sete, o F1 do diagnóstico diz seis, e eu medi **sete
  superfícies** (2.8) — mas duas delas (Status e No jogo) moram no mesmo arquivo
  e no mesmo widget, então quem contar por ARQUIVO acha seis. Nenhum dos dois
  números está errado; eles contam coisas diferentes. Fica registrado para
  ninguém "corrigir" um pelo outro.
- **NÃO VERIFICADO:** o custo em linhas do estado de tela novo do `sem_fonte`
  (T10). O registro de lacunas o chama de *"a mais cara das sete"* e eu concordo
  pelo desenho, não por medição. T10 mede antes de escrever.
- **DESENHO:** que a cura seja apagar `_call_checked` e `_safe_call`. **Não é.**
  Os dois têm dezenas de chamadores legítimos que só precisam do "deu ou não
  deu" — `daemon.state_full`, `profile.list`, `autoswitch.lock`. O que muda é
  **quem** os chama para um gesto de aplicação. Apagar seria trocar o defeito
  desta frente por uma leva de regressões.
- **NÃO VERIFICADO:** se o applet do COSMIC (Rust, `packaging/cosmic-applet/`)
  fala alguma dessas rotas. O portão de lacunas é cego a Rust e o registro
  manda conferir antes de apagar qualquer símbolo. **Nenhuma tarefa desta frente
  apaga símbolo público** — de propósito.

---

## 4. POR QUE ESTA FRENTE VEM ANTES DAS ABAS

**Nove das onze abas declaram dependência de Z1** na §0.3 do `SPRINT_ORDER.md` —
todas menos Lightbar e Navegação (a Lightbar depende por Z2/Z3, mas consome o
vocabulário desta frente em T6/T7). O que muda em cada uma:

| onda | o que ela NÃO pode escrever antes desta frente |
|---|---|
| 1 · [Configurações](2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md) | a frase do rodapé sobre a declaração gravada precisa saber o que o daemon descartou |
| 2 · [Início](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | o toast da troca de modo, que hoje comemora a recusa do R-04 (2.5a) |
| 3 · [Status](2026-08-24-STATUS-DIZ-O-QUE-VE-01-o-hertz-que-sumiu-e-os-cards-fora-de-ordem.md) | o estado do controle deslizante de microfone com `sem_fonte` |
| 4 · [No jogo](2026-08-24-NO-JOGO-SEM-FALSO-VERDE-01-a-palavra-verde-que-nao-prova-que-chegou.md) | a palavra verde inteira — o nome da onda É este defeito |
| 5 · [Emulação](2026-08-24-EMULACAO-UM-DONO-SO-01-a-mascara-com-cinco-donos-e-o-verde-que-nao-tem-alvo.md) | "o verde que não tem alvo": o `_res` descartado de `:1313` |
| 6 · [Perfis](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | o toast de ativação "reaplicado no controle" sem saber em quais |
| 8 · [Gatilhos](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | **o nome da onda é o aceite desta frente** — é a mais dura das nove |
| 9 · [Rumble](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md) | a política EFETIVA contra a pedida, e a recusa do Modo Nativo |
| 11 · [Sistema](2026-08-24-SISTEMA-O-VIGIA-VIVO-01-a-rede-de-seguranca-parada-e-o-conserto-que-nao-conserta.md) | o toast do Proton (2.5b) e o do vigia |

**A conta do retrabalho evitado, e ela é o motivo da D1 dela.** Cada uma dessas
nove tem pelo menos um toast de aplicação. Sem esta frente, **nove agentes
escrevem nove versões da frase "não deu, e o motivo é X"** — nove vocabulários,
nove regras de quando dizer "guardado", nove leituras do mesmo payload. A casa já
pagou esse preço uma vez e a cura foi `app/textos_de_aplicacao.py`, que existe
justamente para a palavra "guardado" morar num lugar só. Esta frente faz o mesmo
com a palavra "aplicado" — e desta vez a fonte é o daemon, não a janela.

---

## 5. A COREOGRAFIA DOS AGENTES

**CINCO agentes**, como manda a linha desta frente na §0.2. **O agente A corre
SOZINHO e primeiro** — ele produz a função que os outros quatro consomem; sem
ela, cada um escreveria a sua, que é o defeito que a frente cura.

```
    dia 1                      dia 1-2                          fecho
    ┌────────────────┐
    │  A — o         │──── frase_do_desfecho() ──┬──> B  Gatilhos ──┐
    │  vocabulário   │     + o portão            ├──> C  Lightbar ──┤
    │  (SOZINHO)     │                           └──> D  o card ────┤──> aceite
    └────────────────┘                                              │
    ┌────────────────┐                                              │
    │  E — o daemon  │──────────────────────────────────────────────┘
    │  diz não       │   (independente de A: mexe no PRODUTOR, não na frase)
    └────────────────┘
```

| agente | possui, e SÓ | o que entrega | o que devolve ao maestro |
|---|---|---|---|
| **A — o vocabulário** | `src/hefesto_dualsense4unix/app/textos_de_aplicacao.py`, `src/hefesto_dualsense4unix/app/ipc_bridge.py`, o portão da família (arquivo novo em `tests/unit/`) | T1, T2, T3 | a assinatura de `frase_do_desfecho`, a lista de rotas que o portão novo acusa **hoje**, e a prova de que ele reprova quando a cura sai |
| **B — Gatilhos** | `src/hefesto_dualsense4unix/app/actions/triggers_actions.py` e os testes novos dele | T4, T5 | a frase exata do toast em cada um dos quatro estados, para a mesa dela |
| **C — Lightbar** | `src/hefesto_dualsense4unix/app/actions/lightbar_actions.py` e os testes novos dele | T6, T7 | idem, mais o que muda no caminho "Todos" |
| **D — o card** | `src/hefesto_dualsense4unix/app/widgets/controller_card.py` e os testes novos dele | T8, T9, T10 | o custo medido do estado `sem_fonte`, e a proposta de redação para o olho dela |
| **E — o daemon diz não** | `src/hefesto_dualsense4unix/daemon/ipc_handlers.py`, `src/hefesto_dualsense4unix/daemon/ipc_server.py`, `src/hefesto_dualsense4unix/integrations/proton_pin.py`, `src/hefesto_dualsense4unix/app/actions/emulation_actions.py`, `src/hefesto_dualsense4unix/app/actions/daemon_actions.py`, `src/hefesto_dualsense4unix/app/actions/rumble_actions.py` | T11 a T15 | o contrato novo de resposta das duas rotas, e a medição do experimento dos 8,5 s |

**As regras desta coreografia, e cada uma tem cicatriz:**

1. **A é serial e vem antes.** Se B, C e D começarem junto com A, os três
   escrevem a decisão "aplicado x guardado x nada" por conta própria e a frente
   nasce com quatro donos — a §0.1 chama isso de *"onze dialetos do mesmo erro"*.
2. **Ninguém encosta em `app/textos_de_aplicacao.py` além de A.** É o dono único
   por decisão de 14/08 e continua sendo. B, C e D **chamam**; quando a frase
   não serve, **relatam a A** em vez de editar (R1 de
   [COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md)).
3. **E não toca `app/textos_de_aplicacao.py` nem `ipc_bridge.py`.** As três telas
   que E consome (Emulação, Sistema, Rumble) recebem a razão que E fez o daemon
   publicar; a REDAÇÃO delas usa a função de A, ou fica provisória e marcada.
4. **E é o único que pode reiniciar o daemon**, e só depois de avisar. As
   mudanças de E são no daemon, e o install desta casa é editable: **cura de
   daemon só vale no próximo start**. Se ela estiver medindo Bluetooth, E
   **espera e diz que está esperando** (R3).
5. **Ninguém roda a suíte inteira** (R2) nem `scripts/gui-captura/retratar_abas.py`
   (R4). Quem precisar de foto no meio do trabalho passa um diretório como
   argumento — está em [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md).
6. **D compartilha arquivo com as Ondas 3 e 4.** `app/widgets/controller_card.py`
   é o widget que Status e No jogo dividem, e a §0.3 já registra a restrição
   dura. **Enquanto Z1 roda, nenhuma das duas ondas abre esse arquivo.**

---

## 6. AS TAREFAS

Carimbo de classe de tela (D3, decisão dela de 23/08): **[COSMÉTICA]** =
pré-aprovada, foto depois em lote · **[ESTRUTURAL]** = precisa do olho dela
ANTES · **[SEM TELA]** = não toca a interface.

### Agente A — o vocabulário

#### T1 — a frase sai do CORPO do daemon; o estado da janela vira o "não sei" · **[SEM TELA]**

Em `src/hefesto_dualsense4unix/app/textos_de_aplicacao.py`, uma função nova ao
lado das que já existem:

```python
def frase_do_desfecho(assunto: str, corpo: object, host: object) -> str: ...
```

A ordem de decisão, e ela é a entrega:

1. `_recusa_no_corpo(corpo)` (`app/ipc_bridge.py:566`) — o daemon recusou e
   explicou. A frase é o motivo dele, não a nossa;
2. `destinos_da_aplicacao(corpo)` — se `aplicado_em` tem alguém, é **aplicado**,
   e a frase nomeia quantos; se só `guardado_em` tem alguém, é **guardado**, e
   as razões da janela (co-op, Modo Nativo, alvo fora) entram como o PORQUÊ;
3. as duas listas vazias com `status: "ok"` — **nada aconteceu**, e é a frase
   nova de T5;
4. corpo ausente (`None`) — aí sim, e só aí, a heurística de hoje
   (`alvo_fora_da_mesa` e irmãs) responde, porque não há resposta a ler.

**A inversão é o coração da tarefa:** hoje a janela deduz e o daemon é ignorado;
depois, o daemon manda e a janela só preenche o silêncio. As três funções de
leitura de host **continuam existindo e continuam sendo chamadas** — mudam de
autoridade para explicação, e é por isso que esta frente não precisa da Z2.

**A mordida:** um dublê de corpo que responde `{"status":"ok","aplicado_em":[],
"guardado_em":[]}` com um host que jura que o alvo está NA mesa. Hoje a
heurística ganharia e diria "aplicado". Depois da cura, a frase tem de dizer que
nada aconteceu. **Arranque o passo 2** e veja voltar a "aplicado" — se não
voltar, o teste está medindo outra coisa.
**E o dublê tem de saber recusar** (armadilha A2 de
[COMO-REGER-AGENTES](../COMO-REGER-AGENTES.md)): o mesmo teste, com
`{"status":"recusado","motivo":"…"}`, tem de produzir o motivo do daemon.

**Custo:** ~70 linhas de produto, ~120 de teste, 3 h.

#### T2 — o portão da família · **[SEM TELA]**

A E7 do [ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) o
pediu em 22/08 e ninguém o escreveu. Arquivo novo em `tests/unit/`, irmão de
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`:

> **Gesto de aplicação da janela que decide a frase do toast sem ler o corpo da
> resposta reprova, nomeando arquivo, linha e o literal.**

Medir pelo **par (chamada da ponte, decisão de frase)** na AST, não por nome de
símbolo — senão perdoa quem renomear, que é o erro que o próprio registro de
lacunas documenta em `:1024`. O portão nasce com um registro de exceções escrito,
no mesmo molde do `_SEM_ESCRITOR_HOJE`: cada rota que ainda não foi fiada entra
com a razão e a linha que a fecha, e **sai do registro quando a tarefa fecha**.

**A mordida:** o portão tem de **nascer reprovando** as sete superfícies da 2.8.
Rodá-lo antes de qualquer conserto e ver os sete nomes é a prova de que ele
enxerga; um portão que nasce verde nunca foi visto acertando
([AUDITORIA-DE-PERDA-01](2026-08-23-AUDITORIA-DE-PERDA-01-tres-portoes-verdes-que-nao-medem-nada.md)
mediu três portões cegos num dia).

**Custo:** ~150 linhas de teste, 4 h.

#### T3 — as sete lacunas saem do registro quando ganham chamador · **[SEM TELA]**

`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1024-1095` carrega sete
entradas do bloco ELO-MUDO-01/F1. Cada tarefa desta frente fecha uma ou mais;
**a entrada tem de sair do registro no mesmo commit que a fecha**, ou a lacuna
vira dívida documentada de algo que já existe — que é o inverso do que o portão
mede.

`rumble_policy_set_detalhado` é o caso de fronteira, e o registro já diz isso por
escrito: *"ou APAGAR, se até lá o corpo continuar sendo um eco"*. **T14 decide**;
A executa a saída do registro conforme a decisão de E.

**A mordida:** com a entrada removida e o chamador de produção ausente, o portão
tem de acusar de novo. Se não acusar, foi a entrada que estava segurando o
portão, não o chamador que o satisfez.

**Custo:** ~20 linhas, 40 min.

### Agente B — Gatilhos

#### T4 — os cinco pontos de chamada passam a pedir o corpo · **[SEM TELA]**

Em `src/hefesto_dualsense4unix/app/actions/triggers_actions.py`:

| linha | hoje | passa a ser |
|---|---|---|
| `:593` | `trigger_set_checked(side, preset_id, args, uniq=uniq)` | `trigger_set_detalhado(...)` |
| `:609`, `:613`, `:618` | `trigger_set_checked(...)` dentro de `_send_trigger_named` | idem, e a função devolve a 3-tupla |
| `:655` | `ok, _motivo = trigger_reset(side, uniq=uniq)` | `trigger_reset_detalhado(...)` |

O import de `:25` muda junto. **Nada mais neste arquivo muda nesta tarefa** — o
`_toast_trigger` é T5, e separá-las é de propósito: T4 tem de passar com o toast
antigo, provando que a 3-tupla não quebrou nada.

**A mordida:** um teste que exige que `_aplicar_preset` chame a função
**detalhada** e não a `_checked` — com um dublê que conta as chamadas de cada
uma. Devolva `trigger_set_checked` e veja reprovar.

**Custo:** ~25 linhas de produto, ~60 de teste, 1 h 30.

#### T5 — o toast decide pelas listas · **[ESTRUTURAL]**

`app/actions/triggers_actions.py:658` (`_toast_trigger`) passa a receber o corpo
e a chamar `frase_do_desfecho` de T1. Os quatro estados que a aba passa a saber
distinguir:

| estado | o que o daemon respondeu | a frase (PROVISÓRIA, para a mesa dela) |
|---|---|---|
| aplicado | `aplicado_em: [mac]` | *"Gatilho esquerdo (L2): Rigid aplicado"* — a de hoje, intacta |
| guardado | `guardado_em: [mac]` | as frases de `textos_de_aplicacao.py`, intactas |
| **nada** | `aplicado_em: []` e `guardado_em: []` | **texto novo** — *"Gatilho esquerdo (L2): nenhum controle recebeu — não há controle na mesa"* |
| recusado | `status: "recusado"` com `motivo` | o motivo do daemon |

**[ESTRUTURAL] por causa da terceira linha, e só dela.** As outras três reusam
palavra já aprovada. A frase nova vai à mesa dela **antes** do commit; enquanto
não voltar, fica marcada como provisória no código, como o rodapé já faz em
`footer_actions.py:318`.

**A mordida:** com a mesa vazia e o alvo em "Todos" — o caso medido em 2.1 e 2.4
— o toast **não pode** conter a palavra "aplicado". Arranque a leitura das listas
e veja voltar. E a mordida gêmea, a que prova que a cura não foi longe demais:
com um MAC em `aplicado_em`, o toast tem de continuar dizendo "aplicado" **byte a
byte igual ao de hoje**.

**Custo:** ~40 linhas de produto, ~90 de teste, 2 h 30 + o tempo dela.

### Agente C — Lightbar

#### T6 — o funil de cor e o de LED de jogador pedem o corpo · **[SEM TELA]**

`src/hefesto_dualsense4unix/app/actions/lightbar_actions.py`:

- `:934`, dentro de `_enviar_cor_por_mac` — é o funil por onde passam os três
  chamadores de `led_set` (`:689`, `:801`, `:934`). Trocar por
  `led_set_detalhado` e devolver o corpo em vez do `bool`;
- `:965` e `:969`, dentro de `_enviar_player_leds:938` — o mesmo com
  `player_leds_set_detalhado`.

Cuidado com o **laço sobre `alvos`** das duas linhas (`:934` e `:969`): a
resposta passa a ser uma **lista de corpos**, um por alvo, e a frase tem de
somar os destinos de todos — não pegar o primeiro. É o caso "Todos" com quatro
controles, e é o que a Z3 vai medir depois.

**A mordida:** dois alvos, um com `aplicado_em` cheio e outro vazio; a soma tem
de dizer **um** aplicado, não dois e não zero. Devolva o `bool` e veja reprovar
os dois lados.

**Custo:** ~45 linhas de produto, ~90 de teste, 2 h.

#### T7 — "Aplicar no controle" com a mesa vazia diz que não fez · **[ESTRUTURAL]**

O gesto de `:675`/`:785` já lê a resposta pela via certa
(`apply_draft_detalhado` + `aplicacao_confirmada`) — **é o único da casa que já
está de pé**, e por isso não se mexe nele. O que muda é o toast dos **dois
caminhos de LED direto** (`:689` e `:801`), que hoje viram `bool`.

**[ESTRUTURAL]** pela mesma razão da T5: a frase de "nenhum controle recebeu" é
texto novo. Use **a mesma frase** que B levar à mesa dela, com o assunto trocado
— duas frases diferentes para o mesmo estado em duas abas é o F5 nascendo de
novo. Se B e C divergirem, quem desempata é A.

**A mordida:** o teste da queixa real — um pixel de arrasto no brilho com a mesa
vazia (o defeito de 23/08 que apagava os overrides do perfil dela) tem de
produzir uma frase que **não** contenha "enviada ao controle". Arranque e veja
voltar ao singular mentiroso.

**Custo:** ~30 linhas de produto, ~70 de teste, 2 h + o tempo dela.

### Agente D — o card

#### T8 — o microfone pede o corpo · **[SEM TELA]**

`src/hefesto_dualsense4unix/app/widgets/controller_card.py:3684` troca
`ipc_bridge.mic_volume_set` por `mic_volume_set_detalhado`. O corpo traz três
coisas que o `bool` apagava, e as três estão medidas na 2.1 e no docstring de
`ipc_bridge.py:1134`: o `status` (`ok` x `erro` x `sem_fonte`), o `volume` LIDO
DE VOLTA, e o `por_uniq`.

**A mordida:** um dublê que responde `sem_fonte` e outro que não responde nada
(daemon offline). Hoje os dois produzem `False`; depois da cura os dois têm de
produzir estados **distintos** no card. Um teste que passa com os dois dublês
não separou nada.

**Custo:** ~20 linhas de produto, ~60 de teste, 1 h 30.

#### T9 — o rascunho não guarda o que não foi honrado · **[SEM TELA]**

`controller_card.py:3993` (`_mic_confirmado_pelo_daemon`) grava o volume no
rascunho dela. Com `por_uniq: False` o daemon mexeu no microfone de **outra
pessoa** — a rota global devolve a primeira placa de som, e com a mesa cheia há
uma por controle. Gravar aquilo no rascunho do controle escolhido é escrever no
perfil um fato que não aconteceu.

Ler com `alvo_honrado` (`ipc_bridge.py:1002`), que devolve `None` para "o daemon
não se pronunciou" — e **`None` não é `False`**: sem pronunciamento, o
comportamento de hoje continua valendo. É a regra da casa: ausência de informação
se declara, nunca vira ação padrão silenciosa.

**A mordida:** dublê com `por_uniq: False` — o rascunho tem de sair intacto.
Troque para `True` e o rascunho tem de mudar. Um teste que só exercita um dos
dois lados não vale nada aqui.

**Custo:** ~15 linhas de produto, ~70 de teste, 1 h 30.

#### T10 — `sem_fonte` vira estado de tela · **[ESTRUTURAL]**

A promessa está escrita no produto desde 16/08 e nunca teve como se cumprir —
`ipc_bridge.py:1089` diz: *"Sem fonte, o daemon responde `sem_fonte` e o controle
deslizante fica insensível com a dica dizendo por quê. Um controle cinza não
promete nada; um controle que aceita o gesto e não faz nada é a tela mentindo."*
A frase é do produto; o estado nunca chegou à tela porque nenhum código de janela
recebia a palavra.

**Esta é a tarefa mais cara das quinze**, e é a única desta frente que pede
desenho de verdade: um controle deslizante insensível com dica é estado NOVO no
card. **Medir antes de escrever**, e levar à mesa dela a foto do antes e a
proposta — não o código.

**A ressalva de rádio é obrigatória aqui, e é da seção 7:** por Bluetooth **não
existe fonte de captura** (medido em 23/08 — zero sources com dois controles no
rádio). Então o estado `sem_fonte` é o estado NORMAL de quem joga no rádio, e a
dica não pode sugerir defeito.

**A mordida:** com o dublê em `sem_fonte`, o widget tem de responder `False` a
`get_sensitive()` **e** ter dica não vazia. Arranque um dos dois e veja
reprovar — insensível sem explicação é pior que o de hoje.

**Custo:** NÃO MEDIDO. Estimativa de desenho: ~60 linhas de produto, ~80 de
teste, 3 a 4 h + a mesa dela. **T10 mede primeiro e relata o número real.**

### Agente E — o daemon diz não

#### T11 — o gamepad virtual publica o desfecho e o motivo · **[SEM TELA]**

`src/hefesto_dualsense4unix/daemon/ipc_handlers.py:4642`
(`_handle_gamepad_emulation_set`) passa a chamar
`set_gamepad_emulation_desfecho` (`daemon/lifecycle.py:1561`), que **já existe e
já devolve a verdade inteira** desde a VERDADE-01 de 18/08, e a publicar:

```
{"status": …, "desfecho": "<EMU_*>", "motivo": "<legível>", "enabled": …, "flavor": …}
```

O molde é o `rumble.set` do mesmo arquivo (`:3897`), que já responde
`{"status":"recusado","desfecho":…,"motivo":…}` — **copiar a forma, não inventar
uma segunda**. E `EMU_BLOQUEADO_POR_JOGO` deixa de sair como `"ok"`: ele é
recusa, mesmo com a emulação seguindo ativa com a máscara anterior.

**Cuidado de compatibilidade, e é medido:** `enabled` e `flavor` continuam onde
estão. A CLI e o applet leem esses campos, e o applet é Rust fora do alcance dos
portões desta casa. **Campo novo, nunca campo trocado.**

**A mordida:** um `daemon` dublê cujo `set_gamepad_emulation_desfecho` devolve
`bloqueado_por_jogo` — a resposta **não** pode ter `status: "ok"` e **tem** de
ter motivo. Devolva a fachada `bool` e veja o `ok` mentiroso voltar.

**Custo:** ~35 linhas de produto, ~80 de teste, 2 h.

#### T12 — a Emulação para de descartar a resposta · **[ESTRUTURAL]**

`src/hefesto_dualsense4unix/app/actions/emulation_actions.py:1313` —
`def _on_ok(_res: Any)`. O sublinhado é o defeito. Passa a ler o corpo de T11 e,
na recusa, a dizer o motivo em vez da frase de sucesso montada em `:1336`,
`:1341` e `:1348`.

E **registrar o modo no rascunho só quando o daemon aplicou**: `:1317`
(`registrar_modo_no_rascunho`) roda hoje em cima de qualquer resposta, então uma
troca de máscara recusada pelo R-04 entra no rascunho dela como se tivesse
valido. É o mesmo dano da T9, num campo mais caro.

**[ESTRUTURAL]** por causa da frase de recusa. Enquanto ela não vir, use o
`motivo` cru do daemon — é feio e é honesto, e o feio se conserta com uma
palavra dela.

**A mordida:** dublê de `call_async` que entrega `{"status":"recusado", …}` — o
toast **não** pode conter "ligado" e o rascunho tem de sair intacto. Devolva o
`_res` e veja os dois voltarem.

**Custo:** ~30 linhas de produto, ~70 de teste, 2 h + o tempo dela.

#### T13 — o Proton para de chamar recusa de sucesso · **[ESTRUTURAL]**

Duas metades, nos dois lados da fronteira:

1. `src/hefesto_dualsense4unix/integrations/proton_pin.py:901` — o contrato
   `{locked, skipped, errors, tool}` ganha `status` e `reason`, que já existem no
   `result` e hoje só sobrevivem dentro de `detail`. **`errors: 0|1` não é
   contagem de jogo**; é um `status` disfarçado, e foi assim que `recusado` virou
   `noop`;
2. `src/hefesto_dualsense4unix/app/actions/daemon_actions.py:725`
   (`format_proton_lock_result`) ganha o ramo do `recusado`, com a frase do
   `_steam_gate` — que é *feche a Steam*, uma instrução acionável, contra o
   "nada a mudar" de hoje, que não é.

A função já faz a coisa certa quando o corpo é inesperado (*"Resposta fora do
contrato vira recusa honesta, nunca 'Pronto'"*, `:734`). O que falta é o corpo
ESPERADO dizer a verdade.

**A mordida:** a régua da 2.5b, virada teste — os quatro status têm de produzir
**quatro frases distintas**. Hoje `recusado` e `noop` produzem a mesma, byte a
byte; o teste que não compara as quatro entre si passa com o defeito de pé.

**Custo:** ~40 linhas de produto, ~70 de teste, 2 h + o tempo dela.

#### T14 — a política de vibração: mostrar a efetiva, ou apagar a detalhada · **[COSMÉTICA]**

`src/hefesto_dualsense4unix/app/actions/rumble_actions.py:579` chama
`rumble_policy_set_checked`. O registro de lacunas diz, por escrito, que aqui
**não há mentira medida** — o corpo de hoje é `{status: ok, policy: <a pedida>}`
e o daemon só ecoa. **Duas saídas, e E escolhe UMA com a medição na mão:**

- se o daemon puder responder a política EFETIVA (a que ficou depois do teto do
  orçamento, que é a CONFIG-05 da Onda 9), a aba passa a mostrá-la — e aí o
  `_detalhado` ganha o chamador que lhe falta;
- se até aqui continuar sendo eco, **o símbolo sai** e a entrada correspondente
  sai do registro de lacunas junto (T3), com nota datada dizendo por quê.

**[COSMÉTICA]** porque no primeiro caso o texto já existe e só muda o número que
ele mostra; se a decisão for apagar, a tarefa é [SEM TELA].

**A mordida:** no caminho de mostrar — um dublê que responde `policy` DIFERENTE
da pedida, e o rótulo tem de mostrar a do daemon. Se mostrar a pedida, a cura não
existe. No caminho de apagar — o portão de lacunas tem de ficar verde sem a
entrada, e vermelho se alguém devolver o símbolo sem chamador.

**Custo:** 10 min de decisão; ~20 linhas em qualquer dos dois caminhos, 1 h.

#### T15 — erro de cliente volta como erro de cliente, e volta rápido · **[SEM TELA]**

Medido em 2.6: `-32603 erro interno` em 8,5 s onde deveria ser `-32003 invalid
params` em milissegundos. Duas metades, e a ORDEM importa:

1. **medir a hipótese antes de consertar** (seção 3): rodar o mesmo pedido com o
   traceback rico desligado e cronometrar. Se os 8,5 s não caírem, a hipótese
   está errada e o conserto é outro — e é isso que separa esta casa de quem
   conserta por palpite;
2. **o conserto**: `build_from_name` (`ipc_handlers.py:1141`) levanta
   `ValueError` para aridade errada, ou o handler valida a aridade antes de
   chamar. `daemon/ipc_server.py:352-368` fica **intacto** — o `except Exception`
   genérico existe por uma auditoria de vazamento de caminho e não se mexe nele.

**Por que isto é Z1 e não faxina:** a frente se chama *a ponte que sabe dizer
não*, e oito segundos e meio de silêncio seguidos de "erro interno" é a forma
mais cara de não saber. A janela desiste antes (tetos de 0,25 s, 1,5 s e 2,0 s) e
acusa o daemon vivo de estar desligado.

**A mordida:** um teste que chama `trigger.set` com `params: []` e exige código
`-32003` **e** resposta em menos de 1 s. Devolva o `TypeError` e veja os dois
critérios reprovarem — o código e o relógio.

**Custo:** 30 min de medição; ~15 linhas de produto, ~40 de teste, 1 h 30.

---

## 7. O QUE O BLUETOOTH BLOQUEIA

Decisão **D2**: o mapeamento de rádio é trilha dela com o assistente, não se
planeja aqui. O que esta frente carrega é **o que ela não pode afirmar na tela**
até a medição existir — e Z1 é a frente que escreve as frases, então a lista
abaixo é vinculante para B, C, D e E.

| pergunta que falta medir | o que Z1 NÃO pode escrever | tarefa afetada |
|---|---|---|
| existe fonte de captura do microfone por rádio? (**medido em 23/08: NÃO** — zero sources com dois controles no rádio) | nenhuma frase pode tratar `sem_fonte` como defeito ou como estado transitório: no rádio ele é o estado **normal** | **T10**, e a dica de T8 |
| o gatilho adaptativo por rádio funciona fora do `Rigid`? (sentido no plástico em UM modo, com um jogo de parâmetros) | **"aplicado" não pode virar "confirmado"** em nenhuma frase de gatilho. `gatilho.leitura` é `não/não` no mapa: não há consumidor que confirme, por transporte nenhum, que o efeito entrou | **T5** |
| a barra de luz obedece por rádio, e sob qual regime? (duas sprints se contradizem e uma está velha) | a frase de sucesso da Lightbar **não pode afirmar que a cor chegou ao plástico** — só que o byte saiu. E a cor do plástico por rádio foi **medida como RECUSADA pelo firmware** em 23/08 (`HANDSHAKE 0x04`), o que torna a distinção urgente | **T6, T7** |
| a vibração do jogo chega ao motor por rádio? (`passthrough`: rádio em `inferido-do-codigo`) | nenhuma frase de política de vibração pode prometer efeito no rádio | **T14** |
| quantos DualSense por rádio o produto sustenta, e com quantos adaptadores? | a soma de destinos da T6 **não pode** ser apresentada como "os quatro receberam" sem ressalva de transporte | **T6** |

**Regra que fecha a seção, e vale para os cinco agentes:** onde a medição não
existe, a frase descreve **o que o produto fez** (mandou, guardou, recusou), nunca
**o que o aparelho sentiu**. É a lição do padrão que a queixa do Sackboy revelou:
o produto responde pelo transporte, não pelo efeito — e enquanto for assim, ele
tem de DIZER que é assim.

---

## 8. AS DEPENDÊNCIAS

**De quem Z1 depende:** de **ninguém**. Junto com Z0 e Z6, esta é uma das frentes
que podem começar no dia 1. A §0.2 punha Z1 e Z2 em **paralelo** por
"arquivos disjuntos — Z1 mexe na ponte e no rodapé, Z2 mexe no alvo".

> **Fato errado, SUBSTITUÍDO em 24/08.** Os arquivos **não** são disjuntos:
> Z1-A e Z2-C declaram posse exclusiva de `app/textos_de_aplicacao.py`, e
> Z1-B/C e Z2-B declaram posse exclusiva de `lightbar_actions.py`,
> `triggers_actions.py` e `rumble_actions.py` — os mesmos quatro arquivos, nas
> duas sprints. O que separa as duas frentes **não** é a disjunção: é a
> **ordem** — a Z2 espera a Z5, e a Z1 não espera ninguém. Quem despachar as
> duas ao mesmo tempo colhe a R1. A §0.2 foi corrigida junto.

T1 continua sendo o que reduz o atrito onde ele existe: a heurística de alvo é
**rebaixada**, não reescrita.

**Quem depende de Z1**, copiado da §0.3 e conferido linha a linha:

| onda | dependência declarada | dureza |
|---|---|---|
| 1 · Configurações | Z1, Z5, Z0 | normal |
| 2 · Início | Z1, Z2, Z5, Z7 | normal |
| 3 · Status | Z0, Z2, **Z1**, Z5, Z6, Z4 | normal |
| 4 · No jogo | Onda 3, **Z1**, Z5, Z6 | normal |
| 5 · Emulação | Onda 2, **Z1**, Z2, Z5, Z6, Z7 | normal |
| 6 · Perfis | Z4, Z7, Z5, **Z1**, Z0 | normal |
| 8 · Gatilhos | **Z1 (DURA)**, Z2, Z3, Z4 (dura), Z5, Z6 | **dura** |
| 9 · Rumble | Onda 1, **Z1**, Z2, Z3 (dura), Z5, Z6 | normal |
| 11 · Sistema | **Z1**, Z5, Z6, Z7, Z0 | normal |

**Lightbar (Onda 7) e Navegação (Onda 10) não declaram Z1** na §0.3. A Lightbar
mesmo assim recebe T6 e T7 desta frente — porque o defeito está no arquivo dela e
a regra de posse manda o dono ser quem mexe no código. **A Onda 7 não reabre T6
nem T7**; ela consome o que sai daqui, exatamente como a Onda 1 não reabre a
CONFIG-05.

**Colisão de arquivo a declarar no quadro da leva:** `app/widgets/controller_card.py`
(agente D) é o widget das Ondas 3 e 4; `app/actions/emulation_actions.py`
(agente E) é da Onda 5; `app/actions/rumble_actions.py` (agente E) é da Onda 9;
`app/actions/daemon_actions.py` (agente E) é da Onda 11. **Enquanto Z1 roda,
essas quatro ondas não abrem esses arquivos** — e Z1 roda antes delas por
construção.

---

## 9. O ACEITE

O aceite da §0.2 é o **piso**. Ele foi desenhado por quem viu as onze abas de uma
vez, e está reproduzido inteiro aqui porque é o contrato:

> com a mesa VAZIA, "Aplicar em L2", "Testar por 500 ms", o "Aplicar" do rodapé e
> "Travar Proton validado" dizem que NÃO fizeram, **com motivo**; com o jogo
> aberto e o gate R-04 recusando, o rodapé diz recusado em vez de comemorar;
> arrancar a propagação do campo de recusa reprova em **seis** testes de aba
> distintos.

Os comandos, cada um com o resultado esperado:

```bash
# 1. as quatro frases com a mesa vazia — pelo teste, não pela janela
.venv/bin/python -m pytest tests/unit/ -k "z1_" -q

# 2. o portão da família nasce reprovando as sete superfícies (T2),
#    e fica verde ao fim da frente
.venv/bin/python -m pytest tests/unit/portao_a_ponte_sabe_dizer_nao.py -q

# 3. as sete lacunas do bloco ELO-MUDO-01/F1 saíram do registro (T3)
.venv/bin/python -m pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q

# 4. o caminho aditivo do F1 continua íntegro — nada desta frente o substitui
.venv/bin/python -m pytest tests/unit/test_p1_a_resposta_do_daemon_atravessa_a_ponte.py -q
#    hoje: 29 testes

# 5. o erro de cliente volta como erro de cliente (T15)
.venv/bin/python -c "
from hefesto_dualsense4unix.app import ipc_bridge as b
import time
t=time.monotonic()
try: b._run_call('trigger.set',{'side':'left','mode':'Rigid','params':[]},timeout=15.0)
except Exception as e: print(f'{time.monotonic()-t:.2f}s', e)"
#    hoje:    8.33s [-32603] erro interno (TypeError)
#    aceite:  < 1s  [-32003] <mensagem que nomeia o parâmetro>

# 6. os portões da casa, DEPOIS do git add -A
.venv/bin/ruff check src/ tests/
.venv/bin/mypy src/hefesto_dualsense4unix
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-referencias-docs.py --all
```

**As seis mordidas de aba, nomeadas** — é a linha do aceite que mais morde, e é
por isso que a lista existe:

| # | arranque isto | tem de reprovar em |
|---|---|---|
| 1 | a leitura das listas em `_toast_trigger` (T5) | Gatilhos |
| 2 | `led_set_detalhado` em `_enviar_cor_por_mac` (T6) | Lightbar |
| 3 | `alvo_honrado` em `_mic_confirmado_pelo_daemon` (T9) | Status / card |
| 4 | a leitura do `_res` em `_apply_mode` (T12) | Emulação |
| 5 | o ramo do `recusado` em `format_proton_lock_result` (T13) | Sistema |
| 6 | o `desfecho` na resposta de `_handle_gamepad_emulation_set` (T11) | Início / rodapé |

**E o teto acima do piso** — três exigências que o aceite da tabela não pede e
esta frente adiciona, cada uma nascida de um defeito medido nesta casa:

1. **o portão de T2 tem de ser visto reprovando ANTES de qualquer conserto**, com
   os sete nomes na saída. Régua que nunca foi vista acertando não mediu nada;
2. **cada dublê sabe recusar** (armadilha A2). Teste que só exercita o caminho
   feliz é o que deixou passar as sete lacunas do registro;
3. **nenhum símbolo público é apagado nesta frente** sem antes conferir o applet
   do COSMIC, que é Rust e está fora do alcance dos portões. T14 é a única com
   opção de apagar, e ela carrega essa conferência.

---

## 10. O QUE FICA ABERTO, E DE QUEM É

### Dela

1. **As três frases novas** (classe estrutural, D3): a de "nenhum controle
   recebeu" (T5/T7), a de recusa da Emulação (T12) e a do Proton com a Steam
   aberta (T13). As três são a MESMA família e devem sair da mesa dela **de uma
   vez** — três agentes escrevendo três versões é o F5 nascendo dentro da cura do
   F1.
2. **O estado `sem_fonte` no card** (T10): controle deslizante insensível com
   dica é estado novo. A ressalva de rádio da seção 7 muda a redação — no rádio
   isso não é defeito, é como o aparelho é.
3. **A decisão da T14**: mostrar a política efetiva agora, ou apagar o símbolo
   com nota datada. Ela toca a CONFIG-05 (Onda 9), que é dela por outro caminho.

### Do produto, e não é desta frente

- **A rota `mouse.emulation.set`** tem ponte, tem handler fiado e **nenhuma
  superfície a atravessa** (registro de lacunas, `:1007`). É o mesmo defeito de
  forma numa rota que Z1 não abre — é da **Onda 10 · Navegação**.
- **`app/ipc_bridge.py::apply_draft`** (a forma booleana) e
  `::rumble_policy_set` continuam sem chamador de produção. As duas são
  candidatas a apagar e as duas esperam a conferência do applet Rust. **Fora
  desta frente de propósito:** apagar símbolo público é mudança que ninguém
  pediu.
- **A soma de destinos com quatro controles** (T6) é onde a **Z3 — broadcast
  proibido** vai morder. Z1 entrega a soma; Z3 prova que ela não vira broadcast
  quando o alvo sai da mesa.
- **`profile.apply_draft` com `status` fixo em `"ok"`** — o item 1 da E2 do
  [ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md), que
  aquela sprint registrou como **NÃO executável na ordem em que foi escrito**: a
  janela de hoje traduz `status != "ok"` como "daemon offline?", então trocar o
  status exige mudar a janela ANTES. Esta frente muda a janela. **Depois de Z1, o
  item 1 da E2 fica desbloqueado** — e é da Onda 6 · Perfis, que é quem lê o
  relatório de ativação.

### Aberto e MEDIDO por esta frente, sem dono ainda

- **O F6 está acontecendo agora.** Às 22h28 de 23/08, com a mesa vazia,
  `daemon.status` respondeu `connected: True, transport: bt, battery_pct: 75` e
  `controller.list` respondeu `connected: false` — as duas rotas do MESMO daemon,
  no MESMO instante. **É da Z5**, e está registrado aqui só porque foi medido
  neste turno.
- **`window_detect_reason: "sem_conexao_x"` com `window_detect_healthy: true`**,
  na mesma leitura. **É da Z7** (F8), e o mesmo vale: medido aqui, não é daqui.

---

## 11. VER TAMBÉM

- [SPRINT_ORDER.md](../SPRINT_ORDER.md) — §0.1 (por que não se conserta aba por
  aba), §0.2 (a linha desta frente), §0.3 (quem depende dela), §0.7 (a trilha de
  Bluetooth), §0.8 (o carimbo de tela).
- [ONDE PARAMOS — os defeitos de forma](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md)
  — o F1 e o F2, que são as duas metades do que esta frente cura.
- [ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) — a
  origem do padrão, com a medição elo a elo no Sackboy. A **E7** de lá é a **T2**
  daqui.
- [MESA-CHEIA-09](2026-08-13-MESA-CHEIA-09-aplicado-sem-byte-nenhum.md) — de onde
  vêm `aplicado_em` e `guardado_em`.
- [APLICAR-VERDADE-01](2026-08-01-APLICAR-VERDADE-01-o-rodape-nao-mente-mais-a-ponte-ainda-mente.md)
  — a primeira metade desta frente, feita em agosto: o rodapé parou de mentir e a
  ponte não.
- [COMO-REGER-AGENTES.md](../COMO-REGER-AGENTES.md) — as quatro regras e as seis
  armadilhas que a seção 5 aplica.
- [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md) — para as três tarefas com
  carimbo ESTRUTURAL.
