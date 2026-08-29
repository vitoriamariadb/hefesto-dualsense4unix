---
sprint: MIGRA-ILUMINACAO-07
onda: MIGRA-ILUMINACAO
posse:
  IL7:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
    - src/hefesto_dualsense4unix/app/app.py
cria:
  - tests/unit/test_migra_iluminacao_07_o_gesto_carrega_o_uniq.py
bancada: false
depois_de:
  - IDENTIDADE-01
  - LEVA-1
  - MIGRA-JOGAR-01
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - ONDA-ILUMINACAO-07
  - ONDA-ILUMINACAO-08
  - ONDA-ILUMINACAO-09
  - ONDA-JOGAR-09
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
  - ONDA-NAVEGACAO-06
  - ONDA-SISTEMA-02
  - ONDA-VIBRACAO-06
  # A FILA INTEIRA que vem antes desta, e ela é longa de propósito: nove das doze
  # abrem `app/actions/lightbar_actions.py` e cinco abrem `_ferramentas/aba04.py`.
  # Quem divide arquivo executa EM SÉRIE (R5), e o portão de colisão não faz fecho
  # transitivo — por isso a fila se escreve inteira, como na ONDA-SISTEMA-02.
  - MIGRA-ILUMINACAO-01
  - MIGRA-ILUMINACAO-03
  - MIGRA-ILUMINACAO-11
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-04
  - MIGRA-ILUMINACAO-05
  - MIGRA-ILUMINACAO-06
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA ILUMINAÇÃO · 07 — Os gestos ganham o `uniq` da coluna, e a fita esmaece na mesma sprint

**As duas metades não se separam.** Esmaecer a fita antes de os gestos ganharem
o `uniq` da coluna deixa a aba bonita e **muda**.

## O defeito, e ele tem duas metades

### (a) Os seis gestos apontam todos para o mesmo controle

Os **64 gestos** da tela nova (32 tons, 4 livres, 4 trilhos, 16 números, 4
"Voltar ao automático", 4 "Desligar", numa mesa de quatro) são de **seis tipos**,
e **todos os seis já têm handler vivo hoje — nenhum é feature nova**:

| gesto | handler de hoje |
|---|---|
| tom / livre | `on_lightbar_color_set` (`lightbar_actions.py:852`) + `_on_lightbar_cor_solta` (`:814`) |
| brilho | `on_lightbar_brightness_changed` (`:995`) + `_on_lightbar_brilho_solto` (`:830`) |
| número | `ipc_bridge.identity_number_set` (`app/ipc_bridge.py:712`), já chamado de `app/actions/status_actions.py:2050` e de `app/actions/config/secao_controles.py:1174` |
| Voltar ao automático | `on_lightbar_auto_reset_target` (`:1141`) |
| Desligar | `on_lightbar_off` (`:1023`) |

Todos endereçam **o alvo único da fita**, por `self._edit_uniq()` (`:402`). E
`_persist_leds_update` (`:450`) o lê **por dentro** (`:512`), então nem passar o
`uniq` aos handlers basta: a gravação no rascunho também tem de aceitá-lo.

### (b) A fita viva é o que hoje AUTORIZA a escrita

`app/app.py:1228` diz `"tab_lightbar_box": None` — e `None`, naquele mapa,
significa **a fita fica viva** (`app.py:1271-1277`: `motivo is None` →
`inativar(False)`).

O mockup a quer **inerte** (`fita_viva=False`, `aba04.py:535`), por decisão dela
de 28/08: *"em Gatilhos, Iluminação e Vibração os quatro ficam lado a lado,
sempre visíveis, e a fita do topo fica esmaecida"*.

**Mas trocar o `None` por um MOTIVO faz `_edit_uniq().desconhecido` virar
verdadeiro**, e a partir daí **cada um dos seis gestos recusa com toast** —
Z2-1 e Z2-2, em `:512` (`_persist_leds_update` devolve `False` sem escrever
nada) e `:1027` (`on_lightbar_off` toasta e sai).

**Logo: as duas metades viajam na mesma sprint, ou a aba fica muda.**

## O que entrega

1. **`_persist_leds_update(update, uniq=...)`** e os cinco handlers passam a
   receber o `uniq` como parâmetro. O `uniq` chega do JS, dentro da mensagem do
   gesto, lido do `data-uniq` da coluna (`MIGRA-ILUMINACAO-03`).
2. **`_edit_uniq()` deixa de ser a fonte do alvo nesta aba.** O que sobrevive
   dele é a **recusa**: um `uniq` que não está em `_uniqs_conectados()` é escopo
   desconhecido e recusa **com o mesmo texto de sempre**. O caminho global
   ("Todos") não é alcançável por gesto de coluna — uma coluna nunca escreve na
   mesa inteira.
3. **`_ALVO_POR_ABA["tab_lightbar_box"]` troca `None` por
   `MOTIVO_ALVO_NAO_SE_APLICA`** (`app/actions/config/mixin.py:33`) — **não**
   pelo `_MOTIVO_ALVO_AINDA_NAO_LIGADO`. A distinção é a decisão
   `D-A-FITA-E-O-UNICO-ALVO`: nesta aba o alvo **não se aplica**, porque cada
   coluna é o seu próprio alvo. Dizer "ainda não ligado" seria prometer que um
   dia liga.
4. **Uma ponte de gesto só.** Um `register_script_message_handler`, um roteador
   por `data-gesto`. Cinco pontes seriam cinco lugares para errar o `uniq`. (Na
   série 4.1 o `register_script_message_handler` leva **um** argumento; na 6.0
   leva dois.)
5. **A escrita por MAC já existe inteira e não se reescreve:**
   `led_set_detalhado(rgb, brightness, uniq=)` (`app/ipc_bridge.py:539-543`) e
   `player_leds_set_detalhado(bits, uniq=)` (`:937-939`) já aceitam o endereço.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_07_o_gesto_carrega_o_uniq.py`:

- **o gesto da coluna 3 escreve na coluna 3.** Dublê que grava o `uniq` de cada
  `led_set_detalhado`. Dispare os seis tipos de gesto em quatro colunas
  diferentes → **quatro `uniq` distintos**. **Volte `self._edit_uniq()` no lugar
  do parâmetro e os quatro viram um** — o teste reprova. Devolva.
- **e a gravação no rascunho também.** O mesmo, mas conferindo
  `draft.controllers[uniq].leds`: quatro overrides, um por MAC. Sem o `uniq` em
  `_persist_leds_update`, os quatro caem no mesmo.
- **as duas metades juntas, e ESTA é a mordida que a onda existe para escrever.**
  Três montagens:

  | fita | gesto | o que tem de acontecer |
  |---|---|---|
  | viva (`None`, hoje) | sem `uniq` | passa — **é o produto de hoje** |
  | **inerte** (motivo) | **sem `uniq`** | **RECUSA com toast** — é o defeito |
  | inerte (motivo) | com `uniq` | passa, na coluna certa — é a cura |

  Uma régua que só medisse a terceira linha ficaria verde com a segunda viva.
  **É a segunda linha que prova que a sprint precisa das duas metades.**
- **a fita fica inerte de verdade.** Ao entrar na aba, `set_alvo_inativo` é
  chamado com `(True, MOTIVO_ALVO_NAO_SE_APLICA)`, e o widget nunca fica
  sensível. O portão da Z2-9 já reprova módulo de aba ausente do mapa — não o
  quebre.
- **uma ponte só.** Conte os `register_script_message_handler` do módulo →
  exatamente 1. Some um segundo e veja reprovar.
- **um `uniq` que saiu da mesa recusa.** Desligue o controle entre o desenho da
  página e o clique: o gesto recusa com motivo, **nunca escreve global**, e
  **nunca fica em silêncio**.

## O que é dela decidir

- **O número, e ele está travado.** Enquanto a `MIGRA-ILUMINACAO-11` não fechar,
  o gesto de número faz **rodízio** no daemon
  (`daemon/ipc_handlers.py:1812-1814`) e a tela promete **troca** (16 tooltips e
  a legenda). **Esta sprint liga o gesto ao `uniq` da coluna e nada mais** — não
  toca o daemon. Se a 11 não tiver corrido, a coluna promete o que o produto não
  faz.
- **Ajustar os N de uma vez.** Sem alvo único, um "aplicar a todos" teria de ser
  botão próprio — e ele não existe. O próprio mockup registra isso em "Ainda
  aberto".

## Colisão declarada

Esta sprint e a `MIGRA-ILUMINACAO-02` são as **duas** desta onda que abrem
`app/app.py`, e por isso correm em série (R5). Toda sprint de qualquer onda que
abra `app.py` entra na mesma fila — quem coordena serializa.
