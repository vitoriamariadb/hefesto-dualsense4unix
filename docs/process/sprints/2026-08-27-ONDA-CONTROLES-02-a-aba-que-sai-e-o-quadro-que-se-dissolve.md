---
sprint: ONDA-CONTROLES-02
# onda: CONTROLES (ver a nota de frontmatter da ONDA-CONTROLES-01)
posse:
  CTRL02:
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - src/hefesto_dualsense4unix/gui/main.glade
cria:
  - tests/unit/test_controles_a_tira_perde_a_no_jogo.py
bancada: false
depois_de:
  - COOP-NA-CONEXAO-NATIVA-01
  - EMULACAO-UM-DONO-SO-01
  - LEVA-4
  - ONDA-CONEXOES-01
  - ONDA-CONTROLES-01
  - ONDA-GATILHOS-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-JOGAR-09
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-PERFIS-01
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-VIBRACAO-02
  - ONDA-VIBRACAO-06
nao_toca:
  - src/hefesto_dualsense4unix/app/widgets/painel_no_jogo.py
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
---

# ONDA CONTROLES · 02 — a aba que sai e o quadro que se dissolve

**O defeito, numa frase:** o quadro "Estado" some **justamente com um controle
só** — a tela mais comum —, e a aba "No jogo" existe para responder metade de
uma pergunta que o card já responde inteira.

## O que está medido

- `status_actions.py:1416`, `_set_frame_estado_visivel(compact or not keys)`
  — com **um** controle o frame inteiro se esconde. Com nenhum ou com dois ou
  mais, volta. Três telas, três respostas diferentes para o mesmo fato.
- `status_actions.py:112`, `ABA_NO_JOGO = "tab_no_jogo_box"`; a página no glade
  em `main.glade:733-751`. Toda a montagem é `_sync_paineis_no_jogo`
  (`status_actions.py:540+`).
- `main.glade:538`, `btn_som_no_controle` — o botão **"Ouvir no controle"**,
  que mora dentro do frame "Estado".
- `status_actions.py:1419`, `_alojar_botao_da_rota` — a docstring dele já
  registra que o comando **nasce no seletor de canal do card** desde 02/08
  (`SOM-CANAL-01/E3`), e que o botão isolado ficou no berço.

## O que esta sprint entrega

1. **A tira perde a aba "No jogo".** A página sai do glade e a montagem sai do
   código. Onze abas viram dez com esta e a Emulação (que é de outra onda).
   `D-A-NO-JOGO-FUNDE-COM-A-STATUS`, `D-AS-DEZ-ABAS-E-SEUS-NOMES`.
2. **O quadro "Estado" se dissolve.** Sai do glade. O que era dele é da faixa de
   cada card (ONDA-CONTROLES-01); o que é da mesa fica no cabeçalho.
   `_set_frame_estado_visivel` (`:3001`) e `_espelhar_estado_global_nos_cards`
   (`:2980`) morrem junto, e `_set_estado_global` (`:2960`) deixa de ter dois
   destinos: **um dono só**, por construção, que é o que `D-AS-ABAS-CONVERSAM`
   pede.
3. **"Ouvir no controle" sai.** Palavra dela, 27/08: *"inclusive tirar o
   famigerado ouvir no controle"*; e em 26/08, com o motivo: *"o botão ouvir no
   controle não deveria existir, afinal ele nem funciona pra ser clicado e não
   faz sentido já que temos a área do microfone e do alto-falante"*.
   **Nada se perde:** a função dele é o estado *"Todo o som do PC"* do seletor
   de canal desde 02/08, e é a própria docstring do `_alojar_botao_da_rota` que
   diz isso. Saem o objeto do glade, os quatro `self._get("btn_som_no_controle")`
   (`:483`, `:1059`, `:1106`, `:1448`) e o alojamento.
4. **No lugar dele, no topo do quadro "Os controles da mesa"**, os três que ela
   pediu: **Giroscópio · Acelerômetro · Calibrar sensores**. Palavra dela:
   *"Talvez no local de ouvir no controle poderíamos colocar dois botões pra
   ativar giroscópio e acelerômetro e calibrar Sensores"*, e em 27/08,
   perguntada onde ficam: *"Na aba Controles onde ficavam ouvir no controle no
   topo"*. **Aqui nasce só a fileira, insensível e com a dica que explica.**
   Quem os liga é a ONDA-CONTROLES-07 (os dois interruptores) e a
   ONDA-CONTROLES-08 (a calibração) — um botão que faz nada é melhor que um
   botão que **jura** fazer, e é a regra desta casa desde a
   NO-JOGO-SEM-FALSO-VERDE-01.

## O que esta sprint NÃO faz

**A faixa "Número deste controle: [1][2][3][4]" e o crachá "Editando: Controle
N" NÃO são desta onda.** Eles moram em `status_actions.py:1707-1708` e
`:1903-1937`, e quem os move para a Iluminação é a **ONDA-ILUMINACAO-03**, que
possui este arquivo antes de mim (`D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR`).
Daí o `depois_de`: a colisão é real e está **serializada**, não ignorada.

## Como se prova (o teste que morde)

`tests/unit/test_controles_a_tira_perde_a_no_jogo.py`:

1. **A tira tem dez abas**, e `tab_no_jogo_box` não está entre elas. Arranque a
   cura (devolva a página ao glade) e veja reprovar em onze.
2. **O frame "Estado" não existe em nenhuma das três contagens de mesa** — zero,
   um e dois controles. Hoje ele aparece em duas das três; o teste que morde é
   o que exige as **três**.
3. **`btn_som_no_controle` não existe**, nem no glade nem como `_get` no código.
   Grep no fonte, no molde do
   `test_o_botao_da_rota_nao_migra_mais_para_o_card`.
4. **Os três botões novos nascem, e nascem insensíveis**, com dica. Um teste que
   só contasse os botões passaria com eles sensíveis e mudos — a asserção é
   sobre `get_sensitive()` **e** sobre a dica não estar vazia.

## O que é dela decidir

1. **O que sobra no cabeçalho da aba.** Sem o frame "Estado", os fatos da mesa
   (bateria agregada, "nenhum controle conectado") ficam sem casa. *Sobem para o
   cabeçalho da janela, ou o quadro "Os controles da mesa" ganha uma linha?*
2. **A mesa vazia.** Com zero controles não há card, e portanto não há faixa —
   a tela fica sem uma palavra. *O que a aba diz quando não há nada na mesa?*
