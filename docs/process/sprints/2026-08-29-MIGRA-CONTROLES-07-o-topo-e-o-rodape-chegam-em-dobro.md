---
sprint: MIGRA-CONTROLES-07
onda: MIGRA-CONTROLES
posse:
  MC7:
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - src/hefesto_dualsense4unix/app/alvo_de_edicao.py
    - scripts/telas/topo.html
    - scripts/telas/fim.html
cria:
  - tests/unit/test_migra_controles_07_o_topo_nao_vem_em_dobro.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  - MIGRA-CONTROLES-03
  - MIGRA-CONTROLES-05
  # SÉRIE por R5: dividem `status_actions.py`.
  - MIGRA-CONTROLES-06
  # A MOLDURA DAS DEZ ABAS de 27/08: a fita com o motivo certo, o crachá
  # "Perfil ativo" no topo e o rodapé são dela, e ela cede para quem
  # reivindicar `app.py` (SPRINT_ORDER.md §1.2, posição 0).
  - ONDA-JOGAR-09
  # COLISÃO DE ARQUIVO DECLARADA: `status_actions.py` e o diretório dos
  # geradores, que a MIGRA-CONTROLES-02 cria.
  - MIGRA-CONTROLES-02
  - LEVA-4
  - ONDA-CONTROLES-02
  - ONDA-ILUMINACAO-03
  - ONDA-VIBRACAO-06
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA CONTROLES · 07 — O topo e o rodapé chegam em dobro

**Isto não é hipótese: ela já viu acontecer.** Do posto de comando de 29/08, §4:
*"Um `WebView`, uma `HeaderBar`, e **nada de `Gtk.Notebook`** — a primeira versão
punha um por cima e **ela viu as abas duas vezes na hora**."*

O `ver.py` resolveu tirando o `Gtk.Notebook`. **O produto não pode tirar** — o
Notebook é como se troca de aba nas outras nove.

## O defeito

A janela GTK **já tem** tudo o que o `topo.html` e o `fim.html` desenham. Depois
do enxerto, os dois aparecem juntos:

| o que | onde está no produto | onde está na página |
|---|---|---|
| a tira das dez abas | `Gtk.Notebook` do `gui/main.glade` | `<a href="NN-*.html">`, o mesmo elemento que faz o `ver.py` navegar |
| **Perfil ativo** | `header_bar`, ao lado da fita | `scripts/telas/topo.html`, `.perfil-ativo` |
| a fita **Ajustes vão para:** | `app/actions/status_actions.py:1678-1702` — montada e **empacotada no `header_bar`**, não na página | `topo.html`, `.fita`, com os chips |
| a contagem "N controles: X USB · Y BT" | `app/mesa.py:83` (`contagem_de_controles`) e `:91` (`texto_de_contagem`) | `topo.html`, `.conectado` |
| Aplicar · Salvar Perfil · Importar · Exportar | `footer_box` do glade, com `app/actions/footer_actions.py` | `scripts/telas/fim.html:6-9` |

**A fita é o caso mais grave**, porque não é só desenho repetido: ela é o **alvo
de edição**, e `_ALVO_POR_ABA[ABA_STATUS] = None` (`app/app.py:1226`) diz que
nesta aba ela está **viva**. Duas fitas na tela são dois lugares de escolher a
mesma coisa, e nada as mantém de acordo.

### E há três coisas no `header_bar` que a página NÃO tem, e não podem sumir

Todas nasceram do mesmo motivo — **quem está jogando não tem a aba aberta**:

- o crachá **"Editando: Controle N"** (`status_actions.py:1712`);
- o aviso de **vibração travada** (`:1727`): o "Parar" sobrevive a troca de
  perfil, reconexão e abertura de jogo, e sem o aviso a pessoa conclui que a
  vibração quebrou;
- o aviso de **co-op derrubado pelo jogo** (`:1738`).

Elas são de **toda** a janela, não desta aba. Sumir com elas ao trocar a página
é perder o que a `RUM-01` e a `CONTAGEM-E-COOP-01` pagaram para pôr lá.

### O gesto que a página dá sozinha, sem ninguém clicar

O acordeão é CSS puro, e o cartão do alvo nasce com o rádio **`checked`**
(`novo-layout/_ferramentas/aba02.py`, `bloco()`: `{" checked" if c["alvo"]}`).
Se a ponte ler o estado inicial do rádio como escolha, **a aba define o alvo ao
abrir, sem gesto de ninguém** — que é exatamente o defeito que
`status_actions.py:1629` já curou, com a frase no código: *"montar a aba não é
escolher 'Todos' — é ainda não saber"*.

## O que entrega

1. **Um dono por coisa, e a página perde os quatro.** A tira, o "Perfil ativo",
   a fita e o rodapé **saem do HTML das dez páginas** (`topo.html` e
   `fim.html`), e quem os desenha continua sendo o GTK — que é onde os três
   avisos do `header_bar` já moram e onde a tira já funciona.

   **A alternativa oposta existe e é maior:** tirar o `Gtk.Notebook`, o
   `header_bar` e o `footer_box` do produto e deixar tudo com o HTML. Ela é
   defensável e **não é desta sprint** — mexe nas dez abas ao mesmo tempo e é
   decisão dela (ver abaixo).

2. **O acordeão fica.** Ele é dela (*"clicar num abre e fecha os outros"*,
   *"CSS puro, sem JavaScript"*, 28/08) e não custa código de produto. O que
   muda é o que ele significa: **abrir um cartão é escolher o alvo**, e a
   escolha vai por gesto para o Python.

3. **O alvo tem UM dono e ele já existe.** `app/alvo_de_edicao.py` tem os três
   estados escritos (`EstadoDoAlvo.DESCONHECIDO`, `TODOS`, `CONTROLE`,
   `:90-100`), e o chip "Todos" mapeia direto em `TODOS`. Não nasce estado
   novo; o que nasce é o caminho de ida e volta:
   - clique no cartão ou no chip → `definir_alvo` (`:165`);
   - alvo mudado **de fora** (outra aba, controle que caiu, `esquecer_alvo`
     em `:179`) → a página repinta o rádio marcado.

4. **A página nasce SEM escolha.** Nenhum rádio `checked` no artefato
   versionado; quem marca é a ponte, depois de ler o alvo vigente. Com
   `DESCONHECIDO`, nenhum cartão abre — e isso é informação, não falta dela.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_07_o_topo_nao_vem_em_dobro.py`:

- **nada aparece duas vezes**: com o `WebView` enxertado, contar na janela
  inteira — uma tira de abas, um "Perfil ativo", uma fita, um rodapé.
  **Devolva o bloco ao `topo.html` e veja reprovar.** Sem este teste o defeito
  volta na primeira regeração do gerador, calado;
- **os três avisos do `header_bar` continuam alcançáveis com a aba Controles à
  vista**: crachá, vibração travada, co-op derrubado. **Arranque um e veja
  reprovar** — é o que impede a travessia de comer o que a `RUM-01` pagou;
- **a página não escolhe sozinha**: carregar a página e afirmar que **nenhum**
  rádio está `checked` e que **nenhum** gesto foi postado. **Devolva o
  `checked` ao gerador e veja o teste acusar um alvo definido sem clique**;
- **o alvo é ida e volta**: clicar no chip do P2 chama `definir_alvo` com o
  `uniq` do P2; e mudar o alvo por fora repinta o rádio. **Arranque a volta e
  veja o teste ficar com a fita mostrando o controle errado** — meia ponte é
  pior que ponte nenhuma, porque a tela passa a afirmar;
- **"Todos" é `EstadoDoAlvo.TODOS`, nunca `DESCONHECIDO`**. A diferença está
  escrita no código (`alvo_de_edicao.py:118`: *"escrita global DELIBERADA —
  'Todos', nunca o fallback do desconhecido"*). Confunda os dois e veja
  reprovar;
- **com a mesa vazia a fita não promete**: `recusa()` (`:132`) devolve a frase
  que diz o que não aconteceu e por quê. Faça a fita ficar clicável com zero
  controles e veja reprovar.

## O que é dela decidir

- **Quem fica com a moldura: o GTK ou o HTML?** Esta sprint propõe o GTK, pelo
  caminho mais curto e porque os três avisos já moram lá. A escolha oposta —
  a janela virar uma casca com uma `HeaderBar` e o HTML desenhando tira, fita e
  rodapé, como o `ver.py` que ela já olhou — **é a que deixa a janela igual ao
  desenho que ela aprovou**. Custa as dez abas de uma vez e não se decide dentro
  de uma onda.
- **A fita esmaecida do mockup contra a fita viva do produto.** O `topo.html`
  desta aba diz *"Esta aba não usa o controle escolhido aqui — os cards são
  leitura"*, e o produto diz o contrário (`_ALVO_POR_ABA[ABA_STATUS] = None`,
  fita **sensível**), com a decisão `D-A-FITA-VIVE-ONDE-A-ABA-AJUSTA-POR-CONTROLE`
  do lado do produto. **São duas afirmações opostas sobre a mesma aba**, e a
  aba passou a ter gesto por controle (os interruptores de sensor, o mudo, a
  rota) desde que aquele texto foi escrito. Uma das duas cai.
