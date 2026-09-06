---
sprint: ONDA-CONEXOES-01
estado: absorvida
posse:
  A1:
    - src/hefesto_dualsense4unix/app/actions/config/secoes.py
    - src/hefesto_dualsense4unix/app/actions/config/mixin.py
    - src/hefesto_dualsense4unix/app/actions/config/moldura.py
    - src/hefesto_dualsense4unix/app/actions/config/__init__.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_janela.py
cria:
  - tests/unit/test_a_aba_conexoes_cabe_na_tela.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONEXÕES · 01 — a moldura que cabe na tela

**O defeito, numa frase:** a aba se chama "Configurações", carrega cinco seções
e mede **2.465 px** numa janela que abre com **1.080** — tudo de "Conexões" para
baixo nasce abaixo da dobra, e três features já foram cortadas por isso.

Fonte: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8, *"A aba
passa a caber na tela"*. Decisões: `D-A-ABA-DO-AMBIENTE-CHAMA-SE-CONEXOES`,
`D-AS-DEZ-ABAS-E-SEUS-NOMES`.

## O que entrega

1. **O nome.** `main.glade:4190` diz `Configurações`; a tira passa a dizer
   `Conexões` — e a troca é **em código**, no `install_config_tab`
   (`mixin.py`), não no XML. Duas razões, e as duas são medidas: o `main.glade`
   é recurso de bancada disputado por toda a leva (conflito de merge nele é
   irrecuperável na prática, `COMO-EXECUTAR-UMA-SPRINT.md` §2), e esta aba já é
   inteira montada em código por decisão antiga — o Glade só reserva o
   container. O id (`tab_config_box`) **não muda**: ele é a chave por onde
   `app/app.py` acha a aba, e EST-10 proíbe alcançar aba por índice.
2. **Quatro seções, não cinco.** `secoes.SECOES_DA_ABA` perde `secao_janela`. A
   ordem final é a do mockup: `secao_exame`, `secao_controles`, `secao_mesa`,
   `secao_orcamento`.
3. **`secao_janela.py` não é apagado — é entregue.** Tamanho do texto e ambiente
   do desktop vão para a aba Sistema (`D-AS-DEZ-ABAS-E-SEUS-NOMES`), e o
   "Ligar junto com o computador" **sai inteiro**: é rótulo espelho de um
   interruptor que já mora lá (`secao_janela.py`, decisão 3 do cabeçalho).
   O módulo fica no disco, com uma nota datada no topo dizendo que não é mais
   montado aqui e quem o recebe. Não se apaga decisão medida.
4. **A régua de altura**, que é o que impede a regressão: um teste que monta a
   aba fora da tela e reprova acima de 1.080 px.

## Como se prova — o teste que morde

`tests/unit/test_a_aba_conexoes_cabe_na_tela.py`, três asserções:

* monta as seções em `Gtk.OffscreenWindow` (**nunca `Gtk.Window`**: sob Xvfb não
  há gerenciador de janelas e a janela fica 1x1 para sempre —
  `docs/process/COMO-OLHAR-A-TELA.md`) e mede o `size_request` da caixa;
* `SECOES_DA_ABA` tem **quatro** módulos, e `secao_janela` não está entre eles;
* depois de `install_config_tab`, o rótulo da página é `Conexões` — lido do
  notebook, não do XML.

**A mordida:** devolva `secao_janela` a `SECOES_DA_ABA` e rode. A altura tem de
estourar o teto e o teste tem de reprovar **por altura**, não só pela contagem
de seções — uma régua que só conta módulos não mede o que promete
(`O-PORTAO-QUE-NAO-MEDE-O-QUE-PROMETE`). Cole as duas saídas na entrega.

## O que é dela decidir

1. **"A janela" vai mesmo para Sistema?** É o único conteúdo desta aba sem dono
   óbvio no desenho novo — não é ambiente de execução do controle, mas também
   não é diagnóstico de máquina. O mockup assumiu que sim e não deixou nada dela
   aqui (`aba08.py`, *"Ainda aberto"*, item 3).
2. **O tamanho do texto leva junto o defeito** de só valer na próxima abertura
   (`secao_janela.py`, decisão 1). Quem receber decide se cura ou se herda.

## O que fica combinado com quem coordena

A aba Sistema é território de outra onda. Esta sprint **tira** e a de lá
**recebe**; entre as duas, o conteúdo de "A janela" não está em tela nenhuma. É
buraco declarado, não descuido — ordenar as duas é do índice da leva.
