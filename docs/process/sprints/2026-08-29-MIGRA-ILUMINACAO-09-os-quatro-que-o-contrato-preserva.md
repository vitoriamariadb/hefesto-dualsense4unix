---
sprint: MIGRA-ILUMINACAO-09
onda: MIGRA-ILUMINACAO
posse:
  IL9:
    - novo-layout/_ferramentas/aba04.py
    - scripts/telas/aba04.py   # o mesmo arquivo depois da MIGRA-CONTROLES-02
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_migra_iluminacao_09_os_quatro_do_contrato.py
bancada: false
depois_de:
  - LEVA-1
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - ONDA-ILUMINACAO-07
  - ONDA-ILUMINACAO-08
  - ONDA-ILUMINACAO-09
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
  - MIGRA-ILUMINACAO-07
  - MIGRA-ILUMINACAO-08
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/daemon/
---

# MIGRA ILUMINAÇÃO · 09 — Os quatro que o contrato preserva e o mockup não desenha

## O defeito

O *"Nada se perdeu"* do contrato
(`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:350-368`) manda ficar quatro
coisas. **O mockup tem, em "Opções", dois botões e mais nada** (`aba04.py:331-334`).

| o que o contrato preserva | onde está hoje | quem o pinta |
|---|---|---|
| **"Reenviar ao controle"** | `gui/main.glade:1300` (`lightbar_apply`) | `on_lightbar_apply` (`lightbar_actions.py:870`) |
| **"Cores automáticas por controle"** | `gui/main.glade:1201` (`auto_player_colors_check`) | `on_auto_player_colors_toggled` (`:1107`) — **campo GLOBAL do perfil** |
| **o aviso do estado da barra** | `gui/main.glade:1274` (`lightbar_estado_no_controle`) | `_atualizar_estado_da_barra` (`:643-717`) — **pronto desde 25/08, pela L6** |
| **a linha "de onde veio esta cor"** | não existe em widget nenhum | — |

**O que mais custa perder é o terceiro.** É a **única linha da janela** que
avisa que a Steam segura o hidraw (`lightbar_disputada`), que o Modo Nativo manda
no output, que a fonte é desconhecida, ou que a barra está apagada. Ela sai de
`app/widgets/controller_card.py:1133 rotulo_lightbar` — **a mesma frase dos
cards, com a mesma precedência** —, lendo `lightbar_source` / `lightbar_on` /
`lightbar_disputada` do `state_full` (`daemon/ipc_handlers.py:3293-3296`).

Sem ela, a aba da cor volta a ser **a única do produto que não lê nada do que o
produto já sabe sobre a barra** — que é exatamente o defeito que a L6 curou.

## O que entrega

1. **Uma linha de estado por coluna**, endereçada
   (`data-campo="estado-barra"`), pintada por `_atualizar_estado_da_barra`
   virado laço sobre `_uniqs_conectados()`. **A frase NÃO se reescreve** — o
   dono é o `rotulo_lightbar`. Escrever de novo aqui é criar a segunda verdade
   que a L6 matou.
2. **"Cores automáticas por controle" nasce FORA das colunas.** É campo
   **global** do perfil (`draft.leds.auto_player_colors`, lido em `:581-584`).
   Pô-lo em cada coluna criaria N interruptores para um campo só — e a dica tem
   de dizer, como o contrato manda, que **vale para a mesa inteira**.
3. **"Reenviar ao controle" e "de onde veio esta cor": esta sprint MEDE o espaço
   e leva as duas formas para ela.** Onde entram, quanto custam em altura, e o
   que sai se não couberem. **Não invente o desenho** — o mockup não os tem, e a
   decisão é dela.
4. **O aviso D4 continua sendo linha da própria seção**, não dica: aplicar a
   cor com o automático ligado **desliga o automático**
   (`_persist_leds_update`, `:534-542`, e `_sync_auto_checkbox`, `:1291`), e isso
   é consequência de um clique dela, não explicação.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_09_os_quatro_do_contrato.py`:

- **a frase tem UM dono.** `grep -rln "lightbar_source\|lightbar_disputada\|lightbar_on"`
  em `src/hefesto_dualsense4unix/app/` → **só** `widgets/controller_card.py`.
  Escreva a frase de novo dentro de `lightbar_actions.py` e o teste reprova. (É
  a régua da L6; ela já existe — não a duplique, estenda-a.)
- **N colunas, N estados.** Com um controle disputado pela Steam e outro não, as
  duas colunas dizem **coisas diferentes**. Volte ao valor único e as N ficam
  iguais — reprova.
- **o interruptor global é UM.** Conte `[data-gesto="auto-por-controle"]` no DOM
  → exatamente 1, com qualquer N. Ponha um por coluna e veja reprovar.
- **o silêncio quando está tudo bem.** O contrato manda mostrar o aviso *"quando
  há algo errado (silêncio quando está tudo bem)"*
  (`2026-08-26-O-REDESENHO-as-dez-abas.md:346`). Com a barra sã, a linha some —
  não fica dizendo "tudo certo".
- **o orçamento de altura aguenta.** A linha nova entra sem estourar os 452 px
  do miolo (`aba04.py:88-99`). Se estourar, a aba **rola por dentro**, e
  conteúdo que rola por dentro é conteúdo que ninguém sabe que existe.
  **Meça sem `scrollIntoViewIfNeeded`.**

## O que é dela decidir

**Os quatro, um por um.** Ou o mockup ganha os quatro, ou os quatro saem do
contrato — e nenhuma das duas se decide sem ela.

| o quê | o preço de perder |
|---|---|
| **"Reenviar ao controle"** | depois de reconectar o controle, não há como remandar cor e brilho sem mexer num valor |
| **"Cores automáticas por controle"** | o campo continua no perfil, sem lugar na tela para desligar |
| **o aviso do estado da barra** | **o mais caro.** Sem ele a cor não vai e a janela não diz por quê — Steam, Modo Nativo, ou o rádio que aceita e ignora |
| **"de onde veio esta cor"** | ela não sabe se a cor na tela é escolha dela, do automático, ou do jogo em co-op |
