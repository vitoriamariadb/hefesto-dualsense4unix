---
sprint: MIGRA-LANCADORES-01
estado: caducou
onda: MIGRA-LANCADORES
posse:
  ML1:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
    - tests/unit/test_migra_lancadores_01_o_enxerto_substitutivo.py
cria:
  - src/hefesto_dualsense4unix/app/telas/lancadores.py
  - tests/unit/test_migra_lancadores_01_o_enxerto_substitutivo.py
bancada: true
depois_de:
  # O PILOTO, e é ele quem mede o que esta sprint repete: o enxerto SUBSTITUTIVO.
  # O provado em 29/08 foi ADITIVO (o webview como 12ª página do `Gtk.Notebook`,
  # 376 objetos em 56 ms). Trocar uma página ninguém mediu, e é onde reaparecem
  # as 60.862 linhas que hoje chegam aos widgets por `builder.get_object()`.
  # Ele também cria `gui/webview_de_aba.py`, que esta sprint só consome.  <!-- ref-externa: nasce na MIGRA-CONTROLES-01, ainda não executada -->
  - MIGRA-CONTROLES-01
  # A CASA DAS DEZ PÁGINAS (o `gui/telas/` e o `scripts/telas/`) — sem ela o
  # `load_uri` aponta para um arquivo que o pacote não tem.
  - MIGRA-CONTROLES-02
  # QUEM RECOLHE O QUE MORAVA NA ABA EMULAÇÃO. Esta sprint APAGA a página; se ela
  # correr antes, o conteúdo some sem dono e a fonte de três outras sprints
  # desaparece. Os destinos estão no contrato do redesenho, seção 10,
  # bloco "Nada se perdeu".
  - ONDA-SISTEMA-02    # o diagnóstico e o autoteste do gamepad virtual
  - ONDA-CONEXOES-06   # o modo do microfone
  - ONDA-NAVEGACAO-01  # os combos e o "Sair do modo jogo"
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 1). As dez
  # sprints de enxerto correm EM SÉRIE, na ordem da tira (§1.2), e esta é a
  # SÉTIMA.
  - MIGRA-JOGAR-01
  - MIGRA-GATILHOS-03
  - MIGRA-ILUMINACAO-02
  - MIGRA-VIBRACAO-01
  - MIGRA-NAVEGACAO-01
  # A FILA QUE JÁ ESTAVA NA BANCADA ANTES DAS DEZ ONDAS DE MIGRAÇÃO. Dezoito das
  # 90 sprints de 27/08 declaram posse do `main.glade`, e por R5 correm EM SÉRIE
  # na ordem das ondas de SPRINT_ORDER.md §1.2. Nenhuma delas some por causa da
  # troca de motor: o XML continua sendo um só.
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - IDENTIDADE-01
  - LEVA-1
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-CONEXOES-06
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-JOGAR-09
  - ONDA-GATILHOS-02
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-PERFIS-01
  - ONDA-CONTROLES-02
  # SÉRIE por R5: dividem `app/app.py` ou `app/actions/emulation_actions.py`.
  - ONDA-VIBRACAO-06
  - MIGRA-GATILHOS-07
  - MIGRA-ILUMINACAO-07
  - MIGRA-NAVEGACAO-05
  # AS DUAS QUE ESTA AQUI SUBSTITUI — ver a tabela do índice. Ficam declaradas
  # para o portão enxergar decisão onde há substituição, e não descuido.
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-10
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/profiles/
  - novo-layout/
  - scripts/telas/
---

> **ESTADO 06/09/2026: caducou.** O enxerto da página dentro da janela GTK morreu: o produto é a janela HTML (`interface/hefesto_vivo.py`), e a janela GTK sai nas 24 horas (D-19, liberada por ela em 06/09). Fica como registro do que se mediu.

# MIGRA LANÇADORES · 01 — o enxerto substitutivo: a Emulação sai, e a 07 entra escondida

**Esta é a sprint que troca o motor da aba 07.** Sai a página GTK da Emulação do
`Gtk.Notebook`; entra o `WebKit2.WebView` com `07-lancadores.html`.

E ela tem uma diferença que **nenhuma das outras nove ondas tem**: a página entra
**sem aparecer na tira**. Decisão dela, `D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`:

> *"essa aba em si só vamos desenhar e deixar placeholder mesmo. E ela só passa a
> existir quando tiver todas as features no projeto integrando e funcionando."*

Enxertar cedo e revelar tarde é o que dá às sprints 03-09 um lugar onde pintar,
sem pôr na frente dela uma aba que ainda mente. **A revelação é a MIGRA-LANÇADORES-10**,
e ela espera a palavra dela com a foto na mesa (`PROVA-DE-TELA-01`).

## O defeito

A aba 07 do produto ainda é a **Emulação**: uma aba sobre *emulação de gamepad*
(uinput) — termo técnico que ninguém entende —, cujo conteúdo já foi
**redistribuído para os donos certos** pelas três sprints do `depois_de`. O que
sobra no `main.glade` é uma casca com ids vivos que nada mais pinta.

A cicatriz de que a casca não some sozinha está escrita na sprint que a esvaziou,
`ONDA-SISTEMA-02`, "O que é dela decidir": *"Esta sprint remove só o bloco de
diagnóstico. (…) **Não apague a página**: relate."* Apagá-la é o trabalho desta.

## O que entrega

1. **A página da Emulação sai do `main.glade`**, com todos os ids que ficaram
   órfãos, e a lápide do "Ver daemon.toml" (`glade:3350-3378`, botão já removido)
   sai junto — o contrato do redesenho a nomeia e diz que **não volta**.
2. **Um `WebView` no lugar**, pelo `gui/webview_de_aba.py` que a  <!-- ref-externa: nasce na MIGRA-CONTROLES-01, ainda não executada -->
   MIGRA-CONTROLES-01 criou. **Os quatro pinos de versão são obrigatórios** —
   `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`, `WebKit2 4.1`: com o GTK4 instalado ao
   lado, um `import` de `Gdk` sem pino carrega o 4.0 e mata o Gtk 3.0.
3. **A carga é verificada pelo evento certo.** Escute `load-failed` **antes** de
   `FINISHED`: o WebKit **commita uma página de erro**, e quem escuta só
   `FINISHED` reporta sucesso sobre carga que falhou. E `get_title()` no handler
   de `FINISHED` **devolve vazio** — o título chega depois; não o use como prova
   de nada.
4. **`app/telas/lancadores.py`** — o dono único da aba no motor novo, nascendo
   vazio: ele só sabe carregar a página e responder pela ponte. As sprints 05 a
   09 o enchem, **em série**, porque é um arquivo só.
5. **A página não aparece na tira, e o escondido tem UM lugar.**
   `app/telas/lancadores.py` nasce com `VISIVEL_NA_TIRA = False`, e é ele que
   decide se o rótulo é alcançável — **não o Glade**. No GTK o escondido era
   `visible=False` num widget; pôr essa decisão de volta no XML custaria mais uma
   passagem pela bancada só para virar um booleano, e prenderia a
   **MIGRA-LANÇADORES-10** na fila do XML sem necessidade. A tira do HTML também
   não traz o `<a href="07-lancadores.html">` — a linha é da moldura, e a 10 a
   pede. **Forma diferente, mesma decisão dela.**
6. **O número medido, escrito.** Quanto custa **trocar** esta página — objetos,
   milissegundos e PSS antes/depois — vai para a medição que a MIGRA-CONTROLES-01
   abriu. O preço já aceito por ela é `62 → ~285 MiB PSS` no enxerto **aditivo**;
   o substitutivo pode subir ou descer, e **ninguém sabe para que lado**.

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_01_o_enxerto_substitutivo.py`:

1. **A casca sumiu.** Parse do `main.glade`: nenhum id da página da Emulação
   sobrevive, e `emulation_actions.py` não pede um id que sumiu.
   **Mordida:** deixe um id órfão → reprova nomeando qual. Órfão de Glade não
   levanta erro: `builder.get_object()` devolve `None` e o produto segue calado.
2. **A carga falha alto.** Dublê apontando para um caminho inexistente → quem
   carrega relata **erro**.
   **Mordida:** escute só `FINISHED` → passa a relatar sucesso sobre a página de
   erro, e o teste reprova. Esta é a armadilha nº 2 das medidas em 29/08.
3. **A aba não é alcançável.** A janela montada não oferece caminho para a página
   07 — nem pela tira do HTML, nem pelo rótulo do `Notebook`.
   **Mordida:** revele a aba → reprova, citando a decisão dela. *Este teste é
   temporário por desenho:* na 10 ele inverte, e a inversão é o registro de que
   ela disse sim.
4. **As outras nove abas continuam navegáveis.** Foto da janela depois da troca,
   e a tira responde nas dez posições menos a escondida.
   **Mordida:** troque o widget sem cuidar do id que o poller usa → o efeito
   medido na aba Jogar (`app/actions/home_actions.py:76`,
   `ABA_INICIO = "tab_home_box"`) é o poller **parar em silêncio**. Silêncio é o
   que este teste existe para pegar.

## O que é dela decidir

Nada aqui, e é de propósito: a decisão que governa esta sprint já foi tomada em
26/08 (`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`). O que espera a palavra dela é a
**revelação**, na 10.

## Colisão declarada

`gui/main.glade` é **recurso de bancada — uma sprint por vez em toda a casa**, e
`app/app.py` é disputado por quase todas as ondas. As dez sprints de enxerto
correm em série pela ordem da tira. Quem coordena serializa; **não resolva
conflito de Glade sozinho.**
