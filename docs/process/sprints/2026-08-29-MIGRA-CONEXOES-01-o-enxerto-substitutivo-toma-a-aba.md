---
sprint: MIGRA-CONEXOES-01
onda: MIGRA-CONEXOES
posse:
  M1:
    - src/hefesto_dualsense4unix/app/actions/config/mixin.py
    - src/hefesto_dualsense4unix/app/actions/config/secoes.py
    - src/hefesto_dualsense4unix/app/actions/config/moldura.py
    - src/hefesto_dualsense4unix/app/actions/config/__init__.py
cria:
  - src/hefesto_dualsense4unix/app/actions/config/pagina.py
  - tests/unit/test_migra_conexoes_o_enxerto_substitutivo.py
bancada: false
depois_de:
  # O PILOTO. A aba Controles cria `gui/webview_de_aba.py` (a 01 dela) e  <!-- ref-externa: módulo do piloto (MIGRA-CONTROLES-01 e -03); a ausência é o assunto -->
  # `gui/ponte_da_tela.py` (a 03 dela)  <!-- ref-externa: os dois são `cria:` da onda Controles -->
  # — as duas pontes: pintar por
  # `run_javascript`, receber por `register_script_message_handler`. Esta sprint
  # CONSOME os dois e não escreve uma linha deles. E a execução espera o ok dela
  # sobre o piloto.
  - MIGRA-CONTROLES-01
  - MIGRA-CONTROLES-03
  # A MOLDURA DAS DEZ: onde as páginas moram dentro de `src/`, e a linha do
  # `install.sh` e do `pyproject.toml` que as copia. Ela é a MIGRA-CONTROLES-02;
  # as outras oito ondas a chamam de `MIGRA-MOLDURA-01`, e a reconciliação de
  # ids está no índice do piloto.
  - MIGRA-CONTROLES-02
  # SÉRIE por arquivo (R5): a MIGRA-CONEXOES-02 traz a página para o repositório
  # e esta a carrega; e a ONDA-CONEXOES-01 possui os mesmos quatro módulos.
  - MIGRA-CONEXOES-02
  - ONDA-CONEXOES-01
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - src/hefesto_dualsense4unix/daemon/
---

# MIGRA CONEXÕES · 01 — o enxerto substitutivo toma a aba

**O defeito:** `install_config_tab` (`app/actions/config/mixin.py:41-63`) monta
**cinco** `Gtk.Frame` dentro do `tab_config_box` e chama cinco `montar()`. Sob a
`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK` (29/08) o container
recebe **uma página** num `WebKit2.WebView`. É o enxerto **SUBSTITUTIVO**, e o
que foi provado em 29/08 foi **ADITIVO** — o webview como 12ª página do
`Gtk.Notebook`, 376 objetos em 56 ms. **Ninguém mediu trocar uma página.** Esta
sprint é a primeira de todas porque é a que mede.

## O que a medição de hoje já corrigiu no enunciado

O risco herdado dizia que aqui reapareceriam *"as 60.862 linhas que chegam aos
widgets por `builder.get_object()`"*. **Nesta aba, não.** Medido em 29/08 na
árvore `dev`:

```
grep -c "self\._get(\|builder.get_object" src/hefesto_dualsense4unix/app/actions/config/*.py
```

devolve **1** em `mixin.py` (a linha 48, `self._get(ABA_CONFIG)`) e **0** nos
outros oito arquivos. A aba alcança o Glade **uma vez**, para pegar o container.

O custo dela é o **inverso**, e também está contado: **108** chamadas a `Gtk.`
espalhadas em `moldura.py` (20), `secao_mesa.py` (44), `secao_exame.py` (17),
`secao_orcamento.py` (9), `secao_controles.py` (9), `secao_janela.py` (8) — isto
é **construção** de widget, não **busca** de widget. Pelo critério do builder
esta é a aba mais barata do produto para o enxerto; pelo critério do widget
construído em código, a mais cara. Quem for medir tem de saber qual dos dois
está medindo.

## A armadilha do container, lida do XML

`gui/main.glade:4171-4185`:

```xml
<object class="GtkScrolledWindow" id="scroll_tab_config_box">
  <property name="propagate-natural-height">True</property>
  <property name="propagate-natural-width">True</property>
  <child><object class="GtkBox" id="tab_config_box"> … </object></child>
```

Um `WebView` **não tem altura natural** — ele aceita o que lhe derem. Posto
dentro de um `ScrolledWindow` que propaga altura natural, o resultado é um dos
dois, e os dois são defeito visível:

* o WebView nasce com **0 px** e a aba fica branca; ou
* a página rola **por dentro** e o `ScrolledWindow` rola **por fora** — duas
  barras para o mesmo conteúdo, que é o defeito que a aba 08 menos pode ter
  (ela já esconde 286 px por dentro, e 406 no estado "Todos").

**A cura não abre o Glade — e esta onda é a única das dez em que isso é
verdade.** A `MIGRA-JOGAR-01`, a `MIGRA-CONTROLES-01` e as outras sete declaram
posse de `gui/main.glade` e correm em série atrás umas das outras. Aqui não é
preciso: a aba já é **inteira montada em código** por decisão antiga, e o pai do
container é alcançável em código:
`tab_config_box.get_parent()` devolve o `scroll_tab_config_box`. O enxerto tira
o `Gtk.Box` de dentro dele e põe o `WebView` no lugar, ou desliga a propagação e
a política de rolagem do próprio `ScrolledWindow`. **Qual das duas é decisão da
medição desta sprint**, e as duas se fazem sem uma linha de XML — que é o que
mantém esta onda fora da fila de vinte sprints que disputam o `main.glade`.

## O que entrega

1. **`config/pagina.py`** — a casa da aba no motor novo. Ele:
   * pega o container por `mixin.ABA_CONFIG` (o id do Glade, **nunca** o número
     da página — EST-10, e o comentário de `mixin.py:23-26` diz por quê);
   * pede o `WebView` a `gui/webview_de_aba.py` e as pontes a  <!-- ref-externa: módulo do piloto (MIGRA-CONTROLES-01 e -03); a ausência é o assunto -->
     `gui/ponte_da_tela.py` — os dois módulos do piloto, que ainda não existem  <!-- ref-externa: módulo do piloto (MIGRA-CONTROLES-01 e -03); a ausência é o assunto -->
     nesta árvore  <!-- ref-externa: são `cria:` da MIGRA-CONTROLES-01 e da -03 -->
     —, aponta-o para `gui/telas/08-conexoes.html`, e **não constrói widget
     nenhum** além dele;
   * expõe `pintar(payload: dict)` e `ao_gesto(nome, dados)` sobre as duas
     pontes do piloto. **Esta sprint não reescreve as pontes** — 31 linhas
     escritas uma vez é o preço da rota, e pagá-lo dez vezes seria desfazê-la.
2. **`install_config_tab` vira o enxerto.** Os cinco `moldura_de_secao()` saem;
   entra o webview. `SECOES_DA_ABA` (`secoes.py`) deixa de ser a lista de quem
   **monta** e passa a ser a lista de quem **dá dado** — a ordem da tela agora
   está no HTML, e a lista continua sendo a única lista.
   `secao_janela` **sai da lista**: "A janela" muda-se para a aba Sistema
   (contrato, seção 8) e nada nela tem lugar no mockup desta aba.
3. **Os quatro pinos, na ordem.** `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
   `WebKit2 4.1` — e o `Gdk` **depois** do `Gtk`. Medido em 29/08: com o GTK4
   instalado ao lado, um `from gi.repository import Gdk` sem pino carrega o 4.0 e
   mata o Gtk 3.0 com `ImportError`.
4. **A carga que falhou não pode ser lida como sucesso.** `load-changed`
   dispara `FINISHED` **depois** de `load-failed`, porque o WebKit commita uma
   página de erro. A aba escuta os **dois**, e `FINISHED` sem `load-failed`
   anterior é o único sinal de sucesso. E `get_title()` no handler de `FINISHED`
   devolve **vazio** — o título chega depois; quem quiser conferir a página
   confere pelo DOM, não pelo título.
5. **A folha do `<select>`.** `select{appearance:none;-webkit-appearance:none}`
   como `UserStyleSheet`, pelo motivo medido em `src/hefesto_dualsense4unix/interface/ver.py:77-90`:  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
   o WebKitGTK relata as cores do autor e desenha o tema do sistema, e o campo
   sai **caixa branca com texto quase invisível**. São **16** `<select>` no miolo
   desta aba — a maior concentração das dez. (O número foi medido **duas vezes**:
   um `grep -c '<select'` devolve 19, porque conta três ocorrências dentro de
   comentários de CSS e de HTML. Contar a palavra em vez da coisa é o defeito das
   onze réguas de 26/08, e ele quase entrou nesta sprint.)
6. **A `.nota` não entra.** O caderno de decisões do fim de cada mockup é para
   quem lê o arquivo, não para quem olha a tela: `.nota{display:none}` na mesma
   folha, como `ver.py` e `olhar.py` já fazem.  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
7. **A fita continua inerte.** `set_alvo_inativo(True, MOTIVO_ALVO_NAO_SE_APLICA)`
   (`mixin.py:33`, `:65`) não muda — esta aba se desqualifica do alvo de
   propósito, e o portão da Z2-9 lê exatamente isso para separar "decidiu não
   ler" de "ninguém decidiu nada".
8. **A medição que falta, escrita no fim da sprint** (números, não adjetivos):
   PSS antes e depois do enxerto **substitutivo**; tempo do container vazio até a
   primeira pintura; e se a barra dupla apareceu. O aditivo custou
   **62 → ~285 MiB PSS**; o substitutivo **não tem número**, e quem executar não
   pode inventá-lo.

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_o_enxerto_substitutivo.py` — `Gtk.OffscreenWindow`,
nunca `Gtk.Window` (sob Xvfb não há gerenciador de janelas e a janela fica 1x1
para sempre):

* **o container ficou com UM filho, e ele é o webview.** Percorrer
  `tab_config_box` (ou o pai, conforme a cura escolhida) e contar: zero
  `Gtk.Frame`, um `WebKit2.WebView`. **Mordida:** devolva um
  `moldura_de_secao()` ao `install_config_tab` e o teste reprova.
* **a carga que falha não passa por boa.** Dublê de `WebView` que emite
  `load-failed` e em seguida `FINISHED`. O estado da aba tem de ser *falhou*.
  **Mordida:** arranque o handler de `load-failed` e veja o teste reprovar com o
  sucesso falso — é exatamente o defeito que a armadilha 2 descreve.
* **os quatro pinos estão no módulo, e na ordem.** Ler o fonte de `pagina.py` por
  `ast` e conferir os quatro `gi.require_version` **antes** do primeiro
  `from gi.repository`. **Mordida:** tire o pino do `Gdk` e o teste reprova.
  (Ler por `ast`, não por `import`: importar `gi` numa máquina de CI sem GTK
  derruba a coleta inteira.)
* **a fita continua inerte.** `set_alvo_inativo` foi chamado com
  `MOTIVO_ALVO_NAO_SE_APLICA`. **Mordida:** arranque a chamada e veja reprovar.
* **a régua LÊ, nunca digita.** O número de PSS e o de tempo saem do processo
  medido no momento do teste (ou o teste é `skip` com motivo, sem bancada);
  nenhum literal. É o defeito das onze réguas de 26/08 — *digitavam o que deviam
  LER* — e desta aba não pode sair mais um.
* **`secao_janela` saiu da lista.** `SECOES_DA_ABA` não o contém, e nada em
  `config/` o importa. **Mordida:** devolva-o à tupla e o teste reprova.

## O que é dela decidir

* **A rolagem.** Se a página rolar por dentro, a barra do GTK desaparece desta
  aba — e ela é a única das dez que hoje esconde 286 px. Nenhuma das duas curas
  é melhor no papel: a decisão é olhar a tela. `PROVA-DE-TELA-01`.
* **A aba não cabe, e o número está medido:** 828 px de aba para 542 px de
  miolo. O WebView herda isso inteiro. O que teria de sair, com preço já medido
  em `src/hefesto_dualsense4unix/interface/aba08.py:1247-1253`: **Desempenho** (145 px), a
  **tabela dos adaptadores com os dois botões** (130) ou o quadro **"Está tudo
  certo?"** (204). Na TV dela (1080) sobram 3 px; em qualquer janela menor, não.
  Nenhuma sprint desta onda decide isto sozinha.
