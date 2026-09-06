---
sprint: A-TRAVA-DO-LED-NAO-SOLTA-01
estado: aberta
onda: G
posse:
  LED:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/daemon/state_store.py
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
cria:
  - tests/unit/test_toda_categoria_de_trava_tem_par.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba04.py
  - mockup/
---

> **ROTA CORRIGIDA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** **A E1 continua aberta** (remedido em 06/09): `grep -rn clear_manual_trigger_active src/`
dá zero chamada com `"led"`; a única menção é a docstring de `state_store.py:410`. Abrir no
daemon o caminho que solta SÓ `"led"` (rota nova, ou parâmetro em `_handle_led_set`
`ipc_handlers.py:1408` / `_handle_lightbar_reset` `:4655`) e ligá-lo ao gesto `auto` de
`a04_iluminacao.py:2462` — **`a04_iluminacao.py` entrou na posse por isso.** Todos os
`depois_de` antigos estão `absorvida`/`feita`; a lista foi limpa.

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.6 — não remedida desde 29/08 (`daemon/ipc_handlers.py` continua sem `clear` para `led`).

# A TRAVA DO LED NÃO SOLTA · 01 — arma em dois lugares e não solta em nenhum

**O defeito, numa frase:** mudar a cor da barra de luz **arma** a trava que cala
a troca automática de perfil, e **nenhum gesto do produto a solta** — nem o
"Voltar ao automático", que é exatamente o gesto que significa *"pode voltar a
mandar"*.

## O que está medido — 29/08/2026, contra o disco

`grep -rn 'mark_manual_trigger_active\|clear_manual_trigger_active' src/`:

| categoria | arma em | solta em |
|---|---|---|
| `trigger` | `ipc_handlers.py:1240` | `ipc_handlers.py:1298` (`trigger.reset`) |
| `rumble` | `:4222` e `:4329` | `:4302` e `:4370` |
| **`led`** | **`:1369` (`led.set`) e `:1425` (`led.player_set`)** | **nenhum** |
| **`audio`** | **`:4674` (`speaker.set`)** | **nenhum** |

As quatro categorias estão em `MANUAL_OVERRIDE_CATEGORIES`
(`daemon/state_store.py:58-60`), e **enquanto QUALQUER uma estiver armada o
`AutoSwitcher` não reaplica o perfil** (docstring de `:316-327`). Duas das quatro
não têm par.

**A metade `audio` já tem dona:** é a E1 da
[ÁUDIO-QUE-TRANCA-01](2026-08-03-AUDIO-QUE-TRANCA-01-um-toque-no-volume-congela-a-troca-de-perfil.md).
Esta sprint é a metade `led` e a régua que impede a terceira.

## Por que o "Voltar ao automático" não solta

`app/actions/lightbar_actions.py:1141`, `on_lightbar_auto_reset_target`: ele
**só edita o rascunho** (`with_controller_fields_cleared`) e mostra um toast.
Nenhuma linha dele fala com o daemon, logo a trava armada pelo `led.set`
sobrevive ao gesto que a devolveria. O mesmo vale para
`on_lightbar_auto_reset_all` (`:1175`).

**A saída de hoje é ela trocar de perfil na mão** — o `profile.switch` limpa
tudo (`ipc_handlers.py:822`), a hotkey também (`hotkey.py:732`) e o autoswitch
também (`autoswitch.py:907`). Ou seja: existe saída, e ela é um gesto que a
pessoa não tem como saber que precisa fazer.

**O tamanho real do sintoma, medido no journal dela:** 4 episódios de
`autoswitch_suppressed_by_manual_override` em 7 dias, e o desvio do perfil de
jogo **nunca precisou agir** (0×). Não é *"trava o produto"* — é **armar sem
soltar**, e o preço aparece no dia em que o desvio precisar agir.

## O que entrega

1. **O gesto de devolver a luz solta a categoria.** O "Voltar ao automático" —
   um botão só depois da ONDA-ILUMINACAO-06 — passa por uma rota IPC que chama
   `clear_manual_trigger_active("led")`, **e só ela**: soltar as quatro apagaria
   um gatilho ou uma vibração deliberada de outra aba, que é a razão escrita da
   assinatura por categoria (`state_store.py:331-343`).
2. **A régua do par, e ela é lida, não digitada.** Um teste percorre
   `MANUAL_OVERRIDE_CATEGORIES` — a constante, nunca uma lista à mão — e exige
   que **toda** categoria tenha pelo menos um chamador de `mark` e um de `clear`
   em `src/`, por AST. Categoria nova sem par nasce vermelha. A única exceção é
   a `audio`, que tem dona (ÁUDIO-QUE-TRANCA-01/E1) e entra como **lápide viva**
   no molde da casa — `xfail(strict=True)` com a razão e o endereço, de forma
   que **no dia em que aquela E1 fechar o marcador reprove e alguém o apague**.
3. **O motivo da trava vai ao log da supressão.** O episódio já é registrado
   (`autoswitch_suppressed_by_manual_override`); passa a dizer **quais**
   categorias estão armadas. Sem isso, o próximo diagnóstico recomeça do zero.

## Como se prova (a mordida)

`tests/unit/test_toda_categoria_de_trava_tem_par.py`:

- **o par existe para as quatro.** A régua lê `MANUAL_OVERRIDE_CATEGORIES` e
  varre `src/` por AST. **A mordida:** apague a linha do `clear("led")` e veja
  reprovar **dizendo "led"**; escreva a lista das quatro à mão dentro do teste e
  veja o teste de meta-régua reprovar — *régua que digita o que devia LER é a
  forma exata das onze de 26/08*;
- **solta só a sua.** Arme `led`, `trigger` e `rumble`; o gesto de devolver a luz
  deixa `trigger` e `rumble` armadas. **A mordida:** troque por
  `clear_manual_trigger_active()` sem argumento e veja reprovar — é a regressão
  que a assinatura por categoria existe para impedir;
- **e o autoswitch volta a agir.** Com só `led` armada e depois solta, uma troca
  de janela reaplica o perfil. **A mordida:** deixe a trava armada e veja o teste
  reprovar por `ignorado_trava_manual` — o estado que a
  PERFIL-REESCRITO-NA-PARTIDA-01 já publica.

## Nada se perdeu

- as três saídas globais continuam existindo e continuam limpando tudo
  (`profile.switch`, a hotkey de ciclo, a ativação de perfil de jogo): a
  categoria única é ACRÉSCIMO, não troca;
- a razão de o `led.set` armar continua válida e não é revogada aqui — sem a
  trava o `AutoSwitcher` reescrevia a cor no tique seguinte de troca de foco
  (ONDA-U, causa A, citada em `ipc_handlers.py:1365-1368`);
- a metade `audio` continua sendo a E1 da ÁUDIO-QUE-TRANCA-01, com o
  `release` que **arma** (`ipc_handlers.py:4670-4674`) como parte do escopo de
  lá — esta sprint não a executa e não a apaga: ela vira a lápide viva da régua,
  que é o jeito desta casa de uma dívida não envelhecer calada.

## O que é dela decidir

**Nada de tela.** O gesto que solta já existe no mockup aprovado
(`layout/04-iluminacao.html`, "Voltar ao automático"), e o que esta sprint
faz é ligá-lo ao que ele já promete por escrito.
