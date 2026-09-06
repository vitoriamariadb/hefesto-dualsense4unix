---
sprint: ONDA-SISTEMA-05
estado: absorvida
# onda: SISTEMA
posse:
  S5:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/gui/theme.css
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/app/actions/footer_actions.py
cria:
  - tests/unit/test_onda_sistema_05_os_botoes_que_nao_cabiam.py
bancada: false
depois_de:
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
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/daemon/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 09). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA SISTEMA · 05 — Os botões que não cabiam, e o registro técnico ao lado

**O defeito:** a fileira "Avançado" tem cinco botões lado a lado somando
**1230 px** numa janela que abre com **1180** e cuja política horizontal é
`never` — não há barra para onde fugir; e os textos que explicam cada botão
comem a tela em vez de morar na dica.

## A dívida, medida e já escrita no Glade

`gui/main.glade:2990-2996` (comentário LARGURA-01/E3, 26/08/2026):
*"A linha 'Avançado' tem CINCO botões lado a lado e um GtkBox horizontal pede
a SOMA dos mínimos: 1230px contra os 1180px com que a janela abre"*. O remendo
de 26/08 foi `wrap` no rótulo — a cura é o layout, e é esta sprint.

O que muda de forma:

| Hoje | Alvo (mockup) |
|---|---|
| `steam_simples_box` (`:2909`) + fileira de 5 (`:2982`) | **duas listas verticais**: "Preparar os jogos" (7 botões) e "Avançado" (3) |
| `steam_avancado_label` (`:2975`) com *"— só se você quiser controlar cada passo"* | título curto **Avançado**; a explicação vai para o "?" do quadro |
| "Detalhes técnicos" abaixo de tudo (`:3057`, `daemon_status_text:3087`) | **à direita dos botões de Avançado**, em grade de duas colunas |
| "Voltar ao padrão" no rodapé (`:4269`, `btn_footer_restore_default`, handler `on_restore_default`) | **"Restaurar de fábrica"**, no quadro Avançado, com confirmação |

**A palavra dela**, em `src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md`, aba
Sistema: *"todos os valores de preparar os jogos ao lado dos botões são
valores que aparecem se deixarmos o mouse sobre o botão. Em avançado a mesma
coisa. E subir a detalhes técnicos pra ficar a direita dos botões de avançado.
Altura e largura dos blocos O Hefesto e Gamepad virtual são iguais"*.

Mockup: `layout/09-sistema.html`; gerador `aba09.py:64` (`item()`, que é
literalmente *"o que antes era texto ao lado do botão vira TOOLTIP dele"*),
CSS `.lista` em `aba09.py:34` e `.avancado` em `:43`.

## O que entrega

1. **"Preparar os jogos"** — lista vertical, 7 botões, rótulo à esquerda,
   largura 100%: Consertar problemas conhecidos (destacado) · Deixar tudo
   pronto · Este jogo não funciona · Copiar opções para os jogos · Aplicar aos
   jogos da Steam · Fixar a versão que funciona · Tirar o que faz engasgar.
   **Os cinco de Steam ficam aqui** — decisão dela, contra a recomendação de
   quem coordenou: *"E OS CINCO BOTÕES DE STEAM FICAM NA SISTEMA"*
   (`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`, `/tmp/coleta/decisoes.md:237`).
   A pergunta 1 do "falta decidir" (redesenho, linha 592) **está respondida**;
   não a reabra.
2. **"Avançado"** — lista vertical de 3: Restaurar de fábrica (vermelho) · Ver
   os plugins carregados (o botão nasce **inerte**, com dica dizendo por quê —
   quem o liga é a ONDA-SISTEMA-07) · Ver detalhes.
3. **`tooltip-text` em cada um dos dez botões**, com a frase que hoje mora ao
   lado. Nenhuma frase se perde: ela muda de lugar.
4. **"Detalhes técnicos" à direita**, grade `246px | 1fr`, com a borda
   esquerda separando (o `.col-log` do mockup).
5. **Restaurar de fábrica chega**: o botão do rodapé sai do Glade e nasce
   aqui, **ligado ao mesmo handler** `on_restore_default`
   (`app/actions/footer_actions.py:1487`, registrado em `app/app.py:466`),
   que **já pergunta antes** — não escreva um segundo restauro, e não escreva
   um segundo diálogo. `D-APLICAR-NAO-SALVA`: *"o restaurar de fábrica passa a
   morar na aba Sistema, que é onde gesto raro e perigoso deve ficar"*.
6. **Os dois quadros do topo com a mesma altura e largura** (pedido literal
   dela): `.dupla.igual` do mockup — grade de duas colunas iguais com
   `align-items: stretch`.

## Como se prova (a mordida)

`tests/unit/test_onda_sistema_05_os_botoes_que_nao_cabiam.py`, sob
`Gtk.OffscreenWindow`:

- **a largura**: `get_preferred_width()` da aba Sistema inteira **<= 1180**,
  com o cartão de saúde carregado no pior caso conhecido (a linha de Steam
  Input com dois jogos). Devolva a fileira horizontal e veja voltar aos
  ~1230 px — a reprovação que prova a régua;
- **nenhuma fileira horizontal de botões sobrou**: os dez botões estão em
  `GtkBox` de orientação `vertical`;
- **toda frase que saiu da tela está numa dica**: para cada um dos dez botões,
  `get_tooltip_text()` não vazio; e o texto que hoje aparece ao lado **não**
  aparece mais como label visível. Mover, não duplicar;
- **os dois quadros do topo**: mesma altura e mesma largura alocadas, com
  conteúdos de tamanhos diferentes nos dois. Com o conteúdo igual, um layout
  errado passaria — por isso os tamanhos têm de ser diferentes no teste;
- **o gesto raro mudou de lugar e não de dono**: `btn_footer_restore_default`
  não existe mais no Glade; existe **exatamente um** botão com
  `handler="on_restore_default"`, e ele está dentro do quadro Avançado. A
  suíte que já mede o gesto (`tests/unit/test_footer_restore_default.py`)
  continua verde **sem edição** — se você precisou editá-la, reimplementou o
  restauro em vez de movê-lo.

## O que é dela decidir

- **A ordem dos sete botões de "Preparar os jogos"** — está como no mockup
  aprovado. Não reordene.
- **O rótulo "Restaurar de fábrica"** (era "Voltar ao padrão"): vem do
  redesenho e do mockup.

## Colisão declarada

`footer_actions.py` é do rodapé, disputado pela onda **Perfis**. Esta sprint
toca **só** a remoção do botão e nada mais; se a outra onda estiver em voo,
quem coordena serializa.

## O QUE ELA CORTOU DEPOIS, olhando o mockup (27/08/2026, à noite)

Ela abriu a aba pronta e perguntou: *"falando a real, quais desses botões ainda
fazem sentido existir na interface?"* — apontando o **Este jogo não funciona**.
Medido antes de responder, e ela mandou aplicar:

### SAI — "Este jogo não funciona"
O daemon **já faz isso sozinho**. `daemon/subsystems/gamepad.py:517` chama
`esconder_o_fisico_para_o_jogo(daemon, appid=appid)` assim que a exceção do
Steam Input fica ativa. O botão é gatilho manual do que já é automático.

E o nome mente duas vezes: ele não conserta jogo nenhum, e o que ele faz —
esconder os controles físicos — não está escrito nele.

**Cuidado ao apagar:** a caixinha *"Esconder os controles físicos neste jogo"*
da aba Perfis marcava o MESMO arquivo, e já saiu por ordem dela na
`ONDA-PERFIS-01`. Com as duas fora, **o gesto manual deixa de existir** — o que
é o certo, porque o automático cobre. Se a medição mostrar um caso que o
automático não pega, ele volta com o nome honesto, e não com este.

### SAI — "Copiar opções para os jogos"
É a versão braçal do **Aplicar aos jogos da Steam**, que faz o mesmo em todos os
jogos instalados e com cópia de segurança. Oferecer o trabalho manual ao lado do
automático é pedir que ela escolha entre duas formas do mesmo gesto.

### FUNDEM — "Deixar tudo pronto" + "Consertar problemas conhecidos"
A diferença real entre os dois é UMA: um pede senha e pode fechar a Steam, o
outro não. Isso é uma **confirmação**, não um segundo botão. Fica um só, que
pergunta *"posso fechar a Steam?"* quando o conserto precisar disso — e não
pergunta quando não precisar.

### FICAM TRÊS — e eles passam a RODAR SOZINHOS
**Consertar problemas conhecidos · Fixar a versão que funciona · Tirar o que faz
engasgar.**

**DECIDIDO POR ELA em 27/08/2026, à noite:** os três **rodam sozinhos no exame**,
e o botão serve só para **refazer**. Sai da §0 da fila.

O que isso muda para quem executar:

1. **O exame passa a agir, não só a julgar.** Hoje o cartão de saúde diz "o
   Steam Input está ligado em 2 jogos" e espera que alguém clique. Passa a
   consertar o que é automático e a dizer **o que já fez**.
2. **A linha de saúde muda de tempo verbal.** De *"está ligado em 2 jogos"* para
   *"estava ligado em 2 jogos — desliguei"*. Quem lê descobre o que aconteceu,
   não o que falta fazer.
3. **O botão vira "refazer", e só aparece quando há o que refazer.** Mesmo
   princípio do "Corrigir modo de execução" e do "Testar o controle virtual"
   condicionado da `ONDA-SISTEMA-02`: botão de conserto nasce no estado que o
   conserto resolve.
4. **O que NÃO é automático continua pedindo permissão.** O conserto que precisa
   de senha ou de fechar a Steam pergunta — é a confirmação que sobrou da fusão
   com o "Deixar tudo pronto". Rodar sozinho não pode significar rodar por cima
   dela.

**A régua que prova:** com o Steam Input ligado em dois jogos, o exame roda e a
linha de saúde tem de vir **verde e no pretérito**, sem clique nenhum. Se ela
ainda vier amarela esperando botão, a cura não entrou.

**O motor já existe e nunca teve chamador:** `integrations/prontuario_dos_jogos.py:885`
(`curar_o_que_e_automatico`). É `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ` — a cura
escrita e nunca ligada, o defeito mais caro desta casa.

### A conta
Sete botões viram **três**. A fileira que não cabia em 1180 px passa a caber com
folga, e o problema de layout que dá nome a esta sprint deixa de existir por
subtração, não por rearranjo.
