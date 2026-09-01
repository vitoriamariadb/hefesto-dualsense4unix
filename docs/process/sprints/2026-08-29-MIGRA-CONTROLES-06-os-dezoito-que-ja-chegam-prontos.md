---
sprint: MIGRA-CONTROLES-06
onda: MIGRA-CONTROLES
posse:
  MC6:
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
cria:
  - src/hefesto_dualsense4unix/app/actions/controles_web.py
  - tests/unit/test_migra_controles_06_os_dezoito_ja_prontos.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  - MIGRA-CONTROLES-03
  - MIGRA-CONTROLES-05
  # SÉRIE por R5: dividem `controller_card.py` e/ou `status_actions.py`, os dois
  # arquivos sem seções nomeadas (5.783 e 3.164 linhas). Paralelizar aqui compra
  # conflito de merge, não velocidade — está escrito no índice da ONDA-CONTROLES.
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-CONEXOES-05
  - ONDA-CONEXOES-08
  # COLISÃO DE ARQUIVO DECLARADA: `controller_card.py` (5.783 linhas) e
  # `status_actions.py` (3.164), os dois sem seções nomeadas.
  - LEVA-3
  - LEVA-4
  - ONDA-CONTROLES-01
  - ONDA-CONTROLES-02
  - ONDA-CONTROLES-03
  - ONDA-CONTROLES-05
  - ONDA-CONTROLES-09
  - ONDA-ILUMINACAO-03
  - ONDA-VIBRACAO-06
  - ONDA-CONTROLES-04
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/telas/
  - novo-layout/
---

# MIGRA CONTROLES · 06 — Os dezoito que já chegam prontos

**Esta é a aba mais barata das dez em dado.** Das 29 leituras que a tela pede,
**18 já chegam prontas** do `daemon.state_full`, e o `controller_card.py` (5.783
linhas) já as pinta hoje. **A sprint LIGA — ela não reescreve.**

## O defeito

Não há defeito no dado: há defeito no destino. Depois do enxerto, o pintor de
hoje escreve em widgets que não existem mais. Cada família abaixo tem uma origem
viva e um pintor vivo, e as duas coisas continuam certas — o que muda é a última
linha de cada uma.

| família | de onde vem | quem pinta hoje |
|---|---|---|
| identidade (jogador · plástico · transporte) | `core/backend_pydualsense.py:5100-5115`; enriquecido em `daemon/ipc_handlers.py:3176`; jogador de `daemon/subsystems/coop.py::resolve_player_numbers`, aplicado em `ipc_handlers.py:2494-2501` | `app/widgets/controller_card.py:1047-1053` |
| bateria | `backend_pydualsense.py:5112` | `controller_card.py:4756` |
| analógicos, 16 botões, L2/R2 | `ipc_handlers.py:3300` (primário) e `:3302` (secundários), definidos em `:3584` e `:3600` | `:4662`, `:4702`, `:2964` |
| giroscópio e touchpad | `daemon/sensor_hub.py:100` (leitura por demanda, TTL de 5 s), mesclados em `ipc_handlers.py:3316` | `:3066`, `:3230` |
| microfone (selo e medidor) | **PipeWire**, não o daemon: `app/mic_monitor.py:103` (`LeituraMic`) | `app/widgets/sensor_widgets.py:423` |
| mudo do firmware | `ipc_handlers.py:3345` (`_merge_audio`) | `controller_card.py:1978` |
| alto-falante (volume, estado) | `ipc_handlers.py:3345`, e **só quando o Hefesto tem a posse do registrador** | `controller_card.py:1905-1925`, `:2431` |
| barra de luz | `ipc_handlers.py:3293-3296` (`lightbar_rgb`, `lightbar_on`, `lightbar_source`, `lightbar_disputada`) | `:3433` |

## O que entrega

1. **Um módulo `app/actions/controles_web.py`**: recebe o `state_full`, monta o
   objeto de um tique e chama a ponte **uma vez**. Ele não fala com o daemon
   (quem fala é `app/ipc_bridge.py`) e não sabe desenhar — ele **traduz**.

2. **O cálculo é reaproveitado, nunca copiado.** Onde o pintor de hoje mistura
   conta com widget, a conta se extrai e o widget se descarta. Duplicar o
   cálculo é o defeito que a `D-AS-ABAS-CONVERSAM` existe para matar, e é o
   mesmo passo que a `ONDA-SISTEMA-02` deu com `_refresh_emulation_view`.

3. **`None` continua sendo `None`.** Três casos já estão escritos no código e
   têm de sobreviver à travessia, porque cada um é um estado que a tela precisa
   distinguir:
   - `LeituraMic.nivel = None` **não é** `0.0` — quer dizer *não há captura
     nenhuma*, e o card **apaga o medidor** em vez de desenhar uma barra parada
     no zero fingindo silêncio (`app/mic_monitor.py:103`);
   - `LeituraMic.muted = None` — *a fonte existe e o mute ainda não foi lido*:
     o selo **espera** em vez de chutar "ATIVO";
   - `lightbar_source` diz `sysfs` / `desired` / `desconhecida`, e
     `lightbar_disputada` diz que a Steam está segurando o hidraw. **A tela que
     esconder essa diferença mostra um hexadecimal bonito com a barra
     apagada.**

4. **O pintor velho sai junto.** Os métodos de `controller_card.py` que só
   existiam para montar widget desta aba morrem no mesmo passe — senão ficam os
   dois, e o segundo é o que ninguém lembra de atualizar.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_06_os_dezoito_ja_prontos.py`:

- **as dezoito famílias chegam**, uma asserção por família, a partir de um
  `state_full` de dublê com valores distinguíveis (nada de zeros: zero passa em
  teste que compara com o vazio). **Arranque uma família do tradutor e veja
  exatamente uma reprovar** — se reprovarem duas, os campos estão amarrados e a
  régua está medindo outra coisa;
- **`None` não vira zero**: `nivel=None` produz medidor **ausente**;
  `nivel=0.0` produz medidor **no piso**. Os dois estados têm de sair
  diferentes no objeto do tique. Faça `None` cair em `0.0` e veja reprovar —
  este é o teste que impede a tela de fingir silêncio;
- **`muted=None` não acende selo nenhum.** Chute "ATIVO" e veja reprovar;
- **a barra de luz carrega a procedência**: `lightbar_source` e
  `lightbar_disputada` atravessam. Apague um dos dois e veja reprovar;
- **a conta não foi copiada**: AST — a função de cálculo tem **um** dono, e
  `controles_web.py` a chama em vez de reimplementar. Copie o corpo e veja a
  régua acusar dois donos;
- **uma chamada por tique**: dublê que conta chamadas à ponte; um `state_full`
  com quatro controles custa **1**;
- **o pintor velho não sobrevive**: nenhum dos métodos removidos continua
  referenciado. Devolva uma chamada e veja reprovar.

## O que é dela decidir

- **O hexadecimal ao lado da barra de luz: a cor de TABELA ou a cor VIVA?** O
  mockup escreve `player_slot_color(jogador)` — a tabela que acende as cinco
  lâmpadas (`src/hefesto_dualsense4unix/interface/aba02.py:380-393`). O produto publica
  outra coisa e sabe mais: a cor efetiva, de onde ela veio, e se a Steam está
  disputando. **Com a cor de tabela, a tela mostra um hex bonito com a barra
  apagada e ninguém sabe. Com a cor viva, o hex muda quando o jogo escreve.**
  Qual vai para a tela?
- **Histórico de bateria e o aviso antes de o controle morrer.** O
  `DiarioDaBateria` grava por controle desde sempre (`daemon/battery_journal.py:214`,
  escrito por `daemon/lifecycle.py:695`) e **ninguém lê**; o `notify_battery_low`
  (`integrations/desktop_notifications.py:272`) tem chamador **só em `tests/`**.
  É "a casa sabe e o produto não faz" em estado puro. O índice da ONDA-CONTROLES
  deixou isto fora *até você dizer*, e com quatro na mesa o desenho de hoje já
  mostra um controle em 31%.

## O que esta sprint NÃO cobre

Os **onze** valores restantes das 29. Cada um tem sprint com nome: a máscara
(09), o volume do microfone (10), a rota do alto-falante (11), a cor do plástico
(12), o acelerômetro (`ONDA-CONTROLES-04`) e os interruptores de sensor
(`ONDA-CONTROLES-07`).
