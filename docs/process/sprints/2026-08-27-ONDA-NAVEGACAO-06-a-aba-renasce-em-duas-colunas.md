---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-06
estado: absorvida
posse:
  NAV-F:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
    - src/hefesto_dualsense4unix/app/app.py
cria:
  - tests/unit/test_nav_aba_em_duas_colunas.py
bancada: true
depois_de:
  - ONDA-NAVEGACAO-01
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-GATILHOS-02
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/app.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-06
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-2  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/app/actions/input_actions.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA NAVEGAÇÃO · 06 — A aba renasce em duas colunas, e a ativação toma o lugar dos interruptores

## O defeito, em uma frase

A aba tem **37 textos fixos para 8 widgets**, dois interruptores que guardam em
lugares opostos sem contar isso a ninguém, e **35% a 45% da altura em branco**.

## O que está medido

- `gui/main.glade:3656-4146` — a aba `tab_navegacao_dsx`, com `tab_mouse` e
  `tab_keyboard` em duas colunas. Os dois interruptores:
  `mouse_emulation_toggle` (`:3731`) e `keyboard_emulation_toggle` (`:4030`).
- `app/app.py:1236` — `"tab_navegacao_dsx": _MOTIVO_ALVO_AINDA_NAO_LIGADO`, a
  frase **provisória** ("Esta aba não usa o controle escolhido aqui"). O motivo
  certo já existe ao lado, na linha da Configurações:
  `MOTIVO_ALVO_NAO_SE_APLICA` (`app.py:1229`).
- `app/actions/mouse_actions.py:285` `_sync_mouse_mode_gate` — o gate HARM-05,
  que some junto com o interruptor.

Palavra dela, 27/08 (`/tmp/coleta/hoje.md:262`):
> "ativar mouse e emulação somem. aquela parte de roda dos pontos some também.
> nesse espaço era pra termos as opções de ativação que conversamos."

## O que entrega

A aba do mockup `layout/06-navegacao.html`, na ordem em que ele a desenha:

1. **O quadro "Os gestos do controle"** no topo — a moldura entra aqui; o
   conteúdo dela é a ONDA-NAVEGACAO-08.
2. **O quadro "O controle fora do jogo"**, com:
   - o **dropdown de ativação** ("Quando o controle vira mouse e teclado") com as
     cinco opções da ONDA-NAVEGACAO-01, **no lugar dos dois interruptores**;
   - a linha de estado embaixo dele, dizendo qual perfil está valendo;
   - as **duas colunas** ("O controle como mouse" / "O controle como teclado"),
     com as duas barras de velocidade em moldura própria e as tabelas na moldura
     de baixo — as seções da aba instalada, na disposição do mockup;
   - a **sub-seção do Point-and-click** no rodapé do quadro.
3. **Os 37 textos viram ~12.** Ficam: os dois títulos de coluna, os rótulos dos
   quatro botões, o número de cada barra, a linha de estado do mouse virtual, a
   tabela de atalhos, os oito pares do Mapeamento e os nomes dos gestos.
   Vão para o "?" do quadro ou para a dica do widget: o itálico do uinput/udev, a
   receita de instalar `wvkbd-mobintl`/`onboard`, o buffer de 0,15 s, o porquê de
   cada degrau da roda, e as ~840 caracteres de ajuda herdadas da Emulação
   (D-TUDO-QUE-EXPLICA-VIRA-DICA).
4. **A fita do topo:** `app.py:1236` troca de `_MOTIVO_ALVO_AINDA_NAO_LIGADO`
   para `MOTIVO_ALVO_NAO_SE_APLICA` — o PC tem um cursor e um foco de teclado só,
   e isso não é "ainda não ligamos o leitor" (D-A-FITA-E-O-UNICO-ALVO).
5. **O vão acaba:** a área que ensina ocupa a altura que sobrava.

## Como se prova (o teste que morde)

`tests/unit/test_nav_aba_em_duas_colunas.py` — sobre o XML do Glade e sobre a
janela offscreen (`Gtk.OffscreenWindow`; sob Xvfb não há gerenciador de janelas e
uma `Gtk.Window` fica 1x1 para sempre — `docs/process/COMO-OLHAR-A-TELA.md`):

1. **Os dois interruptores sumiram:** `mouse_emulation_toggle` e
   `keyboard_emulation_toggle` não existem mais no `main.glade`.
2. **O dropdown tem os cinco:** o combo de ativação lista exatamente os cinco
   estados da ONDA-NAVEGACAO-01, nesta ordem.
3. **A conta dos textos:** os rótulos visíveis da aba são ≤ 14 — hoje são 37, e o
   teste imprime os dois números. Um parágrafo que volte para a tela reprova.
4. **A fita diz "não se aplica":** `_ALVO_POR_ABA["tab_navegacao_dsx"]` é
   `MOTIVO_ALVO_NAO_SE_APLICA`.
5. **O vão acabou:** na altura de abertura da janela, a fração da página sem
   widget cai abaixo de 15% (hoje 35–45%).
6. **A mordida:** devolver um interruptor ao Glade e ver 1 reprovar; devolver o
   parágrafo do uinput e ver 3 reprovar. Colar as duas saídas.

## A prova de tela

PROVA-DE-TELA-01: `scripts/gui-captura/retratar_abas.py` **antes e depois**, e a
palavra final é dela. A aba nova tem de ler como as vizinhas — mesma gramática de
`Gtk.Frame`, mesmos títulos de seção (memória: *aba nova copia a gramática visual
das antigas*).

## O que é dela decidir

1. **"Suspender mouse e teclado" e "Sair do modo jogo" vêm mesmo para cá?**
   (pergunta 2 do contrato). O mockup traz só o "Sair do modo jogo", ao lado do
   botão do Point-and-click. O outro é o próprio PS + Options, que já tem linha
   no quadro dos gestos — pôr o botão também é repetir a mesma decisão em dois
   lugares, que é o defeito que a D-AS-ABAS-CONVERSAM nomeia.
2. **Cada jogador navegar a interface com o próprio controle**
   (D-CADA-JOGADOR-NAVEGA-COM-O-SEU) nasce sempre ligado, ou é um interruptor
   desta aba? (pergunta 5 do contrato). O mockup não desenhou nenhum — ou seja,
   a proposta em cima da mesa é "sempre ligado".
3. **O despausar** (pergunta 3 do contrato) — o redesenho já o manda para a
   Sistema ("Nasce Retomar"), e o texto da aba Jogar que ensina duas saídas
   falsas ("PS + Options ou a aba Emulação") continua errado até alguém trocá-lo.
   Esta sprint **não** o toca; fica registrado para quem tocar a Jogar.
</content>
