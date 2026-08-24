# TESTE-HONESTO-01 — execução de 24/08/2026 (frente 17, portão e teste)

Agente executor, árvore isolada `hefesto-voo/TESTE-HONESTO-01-exec`, branch
`voo/TESTE-HONESTO-01-exec`, sobre `HEAD 2b0241d` (= `dev` no instante do
branch, sem divergência). `scripts/costurar.sh` e `scripts/bancada.sh`, citados
pelo protocolo em `docs/process/COMO-EXECUTAR-UMA-SPRINT.md`, **não existem
nesta árvore** — a peça de infra ainda não foi costurada. Não improvisei
caminho equivalente; o commit fica só na minha branch, como o preâmbulo de
despacho manda, e este relatório registra a ausência para quem coordena.

Antes de tocar em código: reli a sprint inteira
(`2026-07-31-TESTE-HONESTO-01-os-297-verdes-que-nao-medem-interface.md`) e
conferi o estado real contra o texto, porque parte dela já tinha sido paga
desde 31/07: **E1 lote A** (13/08), **E3** (as 8 fiações de texto — hoje zero
`inspect.getsource` nos três arquivos citados), **E4** (`tests/integration` e
`tests/shell` já não existem — apagados em `74ac0f3`, opção *a*) e **E5**
(`os.fork()` já virou `subprocess` em `test_single_instance.py`). Só **E2**
(a premissa "USB é o mundo") e o resto de **E1** (lotes B/C/D) seguiam abertos.
O `SPRINT_ORDER.md` (linha 847, censo mais recente) confirma: o que falta é
"E2 e os 68 `importorskip` restantes" — o número 68 não bateu com nenhuma
medição minha (ver "o que não verifiquei"), então não o usei como alvo.

## O que mudou

**E2 — o transporte deixa de ser só USB, por comportamento (não por texto):**

1. `tests/unit/test_daemon_connection.py` — `_FakeController` ganhou o
   parâmetro `transport` (antes fixo em `"usb"`); os cinco casos de
   `connect_with_retry` viraram `@pytest.mark.parametrize("transporte", ["usb",
   "bt"])`, e os três que efetivamente conectam conferem que o payload de
   `CONTROLLER_CONNECTED` carrega o transporte de quem conectou, não um valor
   fixo. 9 testes → 14 (5 parametrizados × 2 + 4 de `is_connected`).
2. `tests/unit/test_teste_honesto_01_e2_bt_por_comportamento.py` (novo) —
   prova por comportamento que `native_bt_fragil` no `state_full` (ramo de
   fallback, quando o backend não sabe descrever a mesa — o caso do
   `FakeController`) responde ao transporte: BT + Modo Nativo → `True`; USB ou
   Nativo desligado → `False`. Antes, a única prova era
   `test_dedup_guard.py::test_state_full_publica_native_bt_fragil`, que só
   confere a STRING `'result["native_bt_fragil"]'` na fonte.

O ramo "por controle" de `native_bt_fragil`
(`daemon/ipc_handlers.controles_bt_frageis`) já tinha coberta por
comportamento em `test_mesa_cheia_11_a_janela_conta_quatro.py` — não é
entrega minha, só confirmei que já existia antes de escrever a de cima.

**Achado fora do escopo original da sprint, mas da MESMA classe de defeito
(E1): seis arquivos de teste, criados por outras frentes depois de 31/07,
quebravam a COLETA no CI sem PyGObject.** Medi rodando a simulação que a
própria sprint recomenda (`sitecustomize.py` fora do repositório, bloqueando
`gi`/`cairo` via `sys.meta_path`, com `PYTHONPATH` apontando para lá — a
receita de `TESTE-HONESTO-01` seção "1. Na máquina dela..."):

```
$ pytest tests --collect-only -q --continue-on-collection-errors   (gi/cairo bloqueados)
9887 tests collected, 6 errors
```

Os seis: `test_a_cura_reconhece_o_prefixo_que_ela_desligou_a_mao.py`,
`test_a_luz_nao_acende_o_botao_do_card.py`,
`test_a_mascara_diz_o_preco_dos_dois_lados.py`,
`test_a_mesa_le_o_barramento.py`,
`test_ambiente_presumido_01_a_steam_dos_quatro_layouts.py` e
`test_medidor_de_radio.py`. Nenhum planta stub de `gi` nem tem guarda — cada um
estoura `ImportError` ao importar um módulo de produção que faz `import gi`
incondicional, e isso vira `ERROR` de coleta (não skip), que é o que o passo
"Censo de coleta" do CI reprova (`ci.yml`: `ERROS > 0`).

Consertei **quatro** deles, os que legitimamente precisam de GTK real para
fazer sentido (o módulo importado constrói widget de verdade —
`emulation_actions.py`, `home_actions.py`, `profiles_actions.py`,
`secao_controles.py` — todos com `import gi`/`Gtk.Box(...)` no próprio corpo):
acrescentei `exigir_gi_real(<motivo>)` no topo, mesmo padrão do lote A pago em
13/08. Confirmado: os quatro continuam passando na máquina com GTK real (75
passed) e agora PULAM honestamente sem PyGObject (4 skipped) em vez de
estourar erro de coleta.

**Os outros dois (`test_a_mesa_le_o_barramento.py`,
`test_medidor_de_radio.py`) eu NÃO consertei — de propósito.** Ver "o que
sobrou para o próximo": a causa ali não é falta de guarda no teste, é um
defeito de produção fora do meu território.

Depois da correção dos quatro, a mesma simulação:

```
$ pytest tests --collect-only -q --continue-on-collection-errors   (gi/cairo bloqueados)
9887 tests collected, 2 errors
```

## Qual mordida prova

Cada mordida: escrevi o teste, arranquei a cura em produção (nunca no teste),
rodei e vi reprovar, devolvi a cura, rodei e vi passar. As saídas:

**E2 — `native_bt_fragil` (o alvo original da E2, a proibição de assert de
texto):**

Sabotagem em `daemon/ipc_handlers.py` — troquei
`result["native_mode"] and result["transport"] == "bt"` por só
`result["native_mode"]` (a checagem de transporte some):

```
FAILED test_native_bt_fragil_por_transporte_com_native_ligado[usb-False]
AssertionError: transporte='usb' ... esperava native_bt_fragil=False, veio True
1 failed, 2 passed in 0.35s

# o teste ANTIGO, de texto, continua verde com a MESMA sabotagem:
$ pytest tests/unit/test_dedup_guard.py -k native_bt_fragil -q
1 passed, 15 deselected
```

Prova exatamente o que a sprint media: o assert de texto não pega a troca de
condição; o novo, por comportamento, pega. Cura devolvida, `git diff` vazio,
suíte volta a 3 passed.

**E2 — reconexão por transporte:**

Sabotagem em `daemon/connection.py` — `transport = daemon.controller.get_transport()`
virou `transport = "usb"` fixo:

```
FAILED test_connect_with_retry_sucesso_primeira_tentativa[bt]
FAILED test_connect_with_retry_backoff_exponencial[bt]
FAILED test_connect_with_retry_backoff_com_teto[bt]
3 failed, 11 passed in 1.86s
```

Os três que reprovaram são exatamente os três casos `bt` que chegam a
conectar; os `usb` (inertes à sabotagem) e os dois que nunca conectam ficaram
verdes, como esperado. Cura devolvida, `git diff` vazio, 14 passed.

**Os quatro `exigir_gi_real()` novos** não têm mordida de sabotagem de
produção (são guarda de AMBIENTE, não de comportamento) — a prova é o par
diferencial de ambiente: com GTK real, os 75 testes passam; com `gi`/`cairo`
bloqueados, os quatro módulos SKIPAM (não erram). É o mesmo par que o lote A
já usava, e é o par que a `test_guarda_gi_falso_precisa_de_exigir_gi_real.py`
(que continua com os mesmos 11 nomes da allowlist — não toquei nela, esta
entrega não é sobre `DIVIDA_GI_FALSO`) não cobre, porque estes seis nunca
plantaram stub — a classe de defeito é irmã, não idêntica.

## O que NÃO verifiquei

- **O número "68 `importorskip` restantes"** do `SPRINT_ORDER.md:847`. Contei
  104 `importorskip("gi")` em `tests/unit`, das quais só 1 arquivo não chama
  `exigir_gi_real` depois; contei 143 `importorskip` de todo tipo em `tests/`.
  Nenhuma dessas contagens bate com 68. Não sei de onde saiu o número — pode
  ser de uma régua diferente (por exemplo, só os que ficam de fora do job
  `gtk-real`) que eu não reproduzi. Registro a divergência em vez de decidir
  qual está certa.
- **A "Suspensão/wake" da E2** (o fluxo ponta-a-ponta com
  `FakeController(transport="bt")` atravessando `PyDualSenseController.connect()`
  até `should_reclaim_on_wake`). Não escrevi. Motivo: o próprio código, em
  `core/backend_pydualsense.py` por volta da linha 2245-2262, já documenta que
  esse gate (RESET-02) está **morto em regime** — a condição
  `current_sysfs_rgb == KERNEL_DEFAULT_BLUE` nunca casa, medido em 03/08
  (LIGHTBAR-BT-CULPADO-01). Escrever uma integração cara para um caminho que o
  próprio time já mediu como inerte pareceu gastar tempo no lugar errado;
  fica como pendência explícita, não como esquecimento.
- **O acréscimo de `grep -rho 'transport="bt"' tests/ | wc -l`**: continua em
  15 (a sprint pedia ≥ 20). Isto é um artefato da FORMA da minha entrega, não
  do conteúdo: parametrizar com `@pytest.mark.parametrize("transporte", ["usb",
  "bt"])` não produz o literal `transport="bt"` que o grep conta — o "bt" vive
  numa lista, não numa chamada. O objetivo REAL da E2 (par diferencial USB×BT
  provado por comportamento) foi cumprido nos dois fluxos que ataquei; o
  critério de aceite ESCRITO na sprint (o grep) não subiu, e registro isso como
  o critério medindo a coisa errada, não como entrega incompleta.
- **Não rodei a suíte inteira** (proibido pelo protocolo — cria nós `uinput`
  reais). A medição de coleta/erro acima é só `--collect-only`, nunca executa
  um teste de verdade.
- **Não medi cobertura** (`--cov-fail-under=70`) nem o piso de coleta
  (`PISO=8100`) contra o efeito das minhas mudanças — não mexi em
  `DIVIDA_GI_FALSO`, e a coleta total (9887) não mudou com meus quatro
  consertos (eles já contavam como coletados nas máquinas com GTK real; no
  ambiente sem PyGObject eles trocam ERROR por SKIP, o que não muda o
  `TOTAL` de `grep -cE '^tests/.+::'`, só o `ERROS`).
- **`mypy src/hefesto_dualsense4unix`**: não rodei — não toquei nenhum arquivo
  em `src/`.

## O que sobrou para o próximo

**Achado para relatar, não para eu consertar — fora do meu território
(`frente 17` não toca arquivo de produto):**
`src/hefesto_dualsense4unix/app/actions/config/__init__.py:28` importa
`mixin` incondicionalmente, que importa `base.py:9` (`import gi`
incondicional). Isso significa que **qualquer** import de
`hefesto_dualsense4unix.app.actions.config.<qualquer_submódulo>` — mesmo um
submódulo que tome o cuidado de adiar seus próprios imports de `gi` para
dentro de método (é o caso de `secao_mesa.py`, que faz `from gi.repository
import Gtk` local em 14 métodos diferentes, nunca no topo do arquivo,
precisamente para poder ser importado sem GTK) — força a cadeia inteira do
pacote, e portanto `gi`, a carregar mesmo assim. É a razão de
`test_a_mesa_le_o_barramento.py` e `test_medidor_de_radio.py` estourarem erro
de coleta sem PyGObject: os dois só importam funções puras de `secao_mesa.py`
(`_medidores_da_mesa`, `ler_a_mesa`, etc.), e o próprio
`test_medidor_de_radio.py` documenta na abertura que "nenhuma linha importa
gi" — o que é verdade PARA O ARQUIVO, e falso para o PACOTE que o contém.

Não apliquei `exigir_gi_real()` a estes dois de propósito: faria os dois
PULAREM sempre que `gi` não estiver disponível, inclusive na máquina dela —
e são testes de lógica pura que hoje RODAM na máquina dela sem depender de
GTK nenhum. Mascarar o sintoma teria trocado um erro alto (que aparece no
censo) por uma perda silenciosa de cobertura pura, que é exatamente a classe
de defeito que esta sprint existe para impedir. O conserto de verdade é em
`config/__init__.py` (tornar o re-export de `ConfigActionsMixin`/`ABA_CONFIG`
preguiçoso, por exemplo via `__getattr__` de módulo — PEP 562 — em vez de
import no topo), e isso é arquivo de outra frente (Configurações aba).
Relato aqui; não editei.

**`scripts/costurar.sh` e `scripts/bancada.sh` não existem nesta árvore.**
Quem coordena precisa saber disso antes de esperar a fusão automática — o
commit desta entrega fica só na branch `voo/TESTE-HONESTO-01-exec`.

**Dentro da própria sprint, ainda em aberto:**
- **E1, lotes B/C/D** (11 arquivos, ~285 testes, ainda na `DIVIDA_GI_FALSO`).
  Não toquei — a própria sprint marca risco ALTO e pede medição de
  beneficiários por lote antes de pagar, que é trabalho de uma leva própria.
  Os números do `ci.yml` mudaram desde que a sprint foi escrita (piso de
  coleta 5100→8100, cobertura continua em 70) — quem for pagar um lote precisa
  remedir contra os números de HOJE, não os do texto original.
- **O "68 `importorskip` restantes"** do censo do `SPRINT_ORDER.md` — não
  bateu com nenhuma régua minha; fica para quem souber de qual medição saiu
  aquele número.
- **A fixture `hid_capture_bt.bin`** (E2, amarrada à DOC-VERDADE-02/E8):
  continua dependendo do controle dela na mesa. Não mexi.
