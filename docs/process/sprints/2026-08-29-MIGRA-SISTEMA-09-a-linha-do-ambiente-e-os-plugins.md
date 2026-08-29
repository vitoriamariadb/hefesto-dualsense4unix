---
sprint: MIGRA-SISTEMA-09
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M9:
    - src/hefesto_dualsense4unix/app/actions/ambiente_na_tela.py
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
cria:
  - tests/unit/test_migra_sistema_09_o_ambiente_e_os_plugins.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-02
  - MIGRA-SISTEMA-03
  - MIGRA-SISTEMA-04
  # A 07 daquela onda é a origem desta: ela já reivindica `ambiente_na_tela.py`
  # e a lista de plugins. Esta a CONSOME na tela nova.
  - ONDA-SISTEMA-07
  # SÉRIE, por R5: dividem `daemon_actions.py` ou `ambiente_na_tela.py`.
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-06
  - MIGRA-SISTEMA-05
  - MIGRA-SISTEMA-06
  - MIGRA-SISTEMA-07
  - MIGRA-SISTEMA-08
  - LEVA-3
  - LEVA-4
  # A BANCADA DO `daemon/ipc_handlers.py` — arquivo enorme e sem seções, tocado
  # por muitas ondas. Esta sprint publica UM campo novo (o protocolo da sessão
  # gráfica); as linhas abaixo são quem mais o abre, pelo portão de hoje.
  - LEVA-1
  - LEVA-DE-BACKGROUND-01
  - MIGRA-ILUMINACAO-11
  - MIGRA-JOGAR-10
  - MIGRA-NAVEGACAO-07
  - MIGRA-VIBRACAO-04
  - MIGRA-VIBRACAO-05
  - MIGRA-VIBRACAO-06
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-JOGAR-05
  - ONDA-LANCADORES-06
  - ONDA-PERFIS-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/config/secao_janela.py
  - novo-layout/
---

# MIGRA SISTEMA · 09 — A linha do ambiente, e os plugins

**As duas coisas que só o terminal alcança**, e as duas estão desenhadas na aba
nova.

## O defeito (a)  —  "Wayland · COSMIC" não existe em payload nenhum

O mockup mostra, na faixa O Hefesto:

> **Como ele enxerga a janela:** `Wayland · COSMIC` (`aba09.py:540`)

**São duas pontas, e nenhuma junta:**

- **o nome do ambiente** existe em `app/ambiente.py` (`AMBIENTES:35`,
  `ambiente_normalizado:66`, `ambiente_efetivo:88`) e é lido hoje **só** por
  `app/actions/config/secao_janela.py:55` — a aba Conexões;
- **o "Wayland" NÃO EXISTE.** `window_detect_backend` devolve
  `portal | wlrctl | xlib | null` (`integrations/window_detect.py`), que é o
  **mecanismo**, não o protocolo. Um `xlib` num Xwayland diz "xlib" e não diz
  Wayland;
- e `app/actions/ambiente_na_tela.descrever_display_grafico:76` — que seria o
  candidato natural — **tem ZERO chamadores** e fala do mecanismo, não do
  protocolo, **por escrito na própria docstring**.

**A linha do mockup, como está, é a junção de dois dados que ninguém junta.**

## O defeito (b)  —  os plugins só existem no terminal

`plugin.list` e `plugin.reload` estão no IPC (`daemon/ipc_server.py:184-185` →
`ipc_handlers.py:5270` e `:5282`), o subsistema sobe em
`daemon/lifecycle.py:3592` (`_start_plugins`), e os **únicos** chamadores são
`cli/cmd_plugin.py:43` e `:77`. O mockup tem o botão *"Ver os plugins
carregados"* com a saída no painel de Detalhes técnicos, e é decisão dela pelo
mockup aprovado.

## O que entrega

1. **O protocolo passa a ser publicado.** `XDG_SESSION_TYPE` (ou o equivalente
   que o daemon já enxerga) entra no `state_full` como campo próprio — **não
   deduzido do backend do detector**. Deduzir protocolo de mecanismo é
   exatamente o erro que `descrever_display_grafico` evita de propósito.
2. **A linha ganha um dono só, e ele é `ambiente_na_tela`.** Uma função nova
   junta protocolo + ambiente e devolve a frase; `descrever_display_grafico`
   **continua existindo** para o que ela já faz (o mecanismo), e ganha o seu
   primeiro chamador ou é declarada como não usada. **Não faça a linha nova
   dentro de `daemon_actions`** — o módulo do ambiente existe para isso.
3. **Ausência é resposta.** Sem `XDG_SESSION_TYPE`, sem ambiente reconhecido,
   com o daemon desligado: a linha diz **o que faltou**, com o que fazer. É a
   disciplina que aquele módulo inteiro já segue.
4. **"Ver os plugins carregados" chama `plugin.list`**, e a saída vai para o
   painel de Detalhes técnicos — sem quadro próprio, como o mockup desenha. O
   botão do mockup também promete **relê** (o `title` diz *"Lista os plugins do
   daemon e relê"*): ou ele chama os dois métodos, ou o `title` muda. **Os dois
   não podem divergir.**
5. **Zero plugins é estado legítimo, e diz isso.** "Nenhum plugin carregado" —
   não um painel vazio.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_09_o_ambiente_e_os_plugins.py`:

- **a linha do ambiente muda com as duas pontas.** Quatro combinações
  (wayland/x11 × dois ambientes) → quatro frases. **Deduza o protocolo do
  `window_detect_backend` e veja reprovar** — é a mordida específica desta
  sprint: um `xlib` sob Xwayland tem de continuar dizendo Wayland;
- **sem o campo, a linha não inventa.** `state_full` sem o protocolo → a frase é
  de "não consegui ler", **nunca** "X11" por padrão. Ponha um padrão e veja
  reprovar;
- **um dono só para a frase.** `grep` prova que quem monta a linha é
  `ambiente_na_tela`, e que `daemon_actions` só a chama;
- **os plugins chegam.** Dublê de IPC devolvendo dois plugins → o painel recebe
  os dois nomes; devolvendo zero → recebe a frase de vazio; estourando → recebe
  o motivo. **Arranque o tratamento do erro e veja reprovar**;
- **o botão faz o que o `title` promete.** Se o `title` diz "e relê", o teste
  exige `plugin.reload` **e** `plugin.list`. Tire uma das duas chamadas e veja
  reprovar. *(Este é o padrão que esta casa já pagou: a tela prometendo um ato
  que o produto não executa.)*

## O que é dela decidir

- **O que a linha diz, exatamente.** `Wayland · COSMIC` é bonito e é o desenho
  aprovado, mas ele **junta duas coisas** que a pessoa usa para fins
  diferentes: o protocolo explica por que o detector de janela às vezes cega; o
  ambiente explica o atalho de teclado e a bandeja. **Opções:** (a) uma linha
  com os dois, como está; (b) duas linhas; (c) uma linha, e o detalhe no `?`.
- **Se a linha some quando o Hefesto está desligado.** Ela é sobre a **sessão
  gráfica**, não sobre o daemon — o Python da janela sabe o ambiente sem
  perguntar a ninguém. Mas o protocolo publicado vem do `state_full`. Vale ler
  o ambiente localmente e só o protocolo pelo daemon? **É decisão de onde a
  verdade mora**, e ela já derrubou uma versão dessa pergunta antes.
