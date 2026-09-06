---
sprint: MIGRA-PERFIS-03
estado: absorvida
onda: PERFIS
posse:
  MP3:
    - src/hefesto_dualsense4unix/app/actions/perfis_web.py
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
cria:
  - tests/unit/test_migra_perfis_03_a_lista_chega_viva.py
bancada: false
depois_de:
  - MIGRA-PERFIS-01   # ela cria o módulo da ponte e a página vazia
  - MIGRA-PERFIS-02   # sem endereço não há o que pintar
  # A ONDA PERFIS de 27/08: oito das nove reivindicam `profiles_actions.py`, e
  # quem divide arquivo corre EM SÉRIE (R5). O índice desta onda diz o que
  # sobra de cada uma depois da decisão do WebKit.
  - ONDA-PERFIS-01
  - ONDA-PERFIS-02
  - ONDA-PERFIS-03
  - ONDA-PERFIS-04
  - ONDA-PERFIS-05
  - ONDA-PERFIS-06
  - ONDA-PERFIS-08
  - ONDA-PERFIS-09
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 10). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA PERFIS · 03 — a lista de perfis chega viva

**O defeito:** depois da **01** o bloco da esquerda existe e está vazio. Os
perfis dela estão no disco e o produto já sabe lê-los — o que morreu foi o
`Gtk.TreeView` que os mostrava.

**Esta aba é a MENOS dependente do daemon das dez.** O que ela pinta sai do
**disco**, não do IPC:

| O quê | De onde | Estado |
|---|---|---|
| a lista inteira | `profiles/loader.py:1157` (`load_all_profiles`), chamado **em thread** por `profiles_actions.py:3772` (`_reload_profiles_store`) e pintado em `:3797` (`_populate_profiles_store`) | **existe** |
| o perfil ativo | IPC `daemon.state_full` / `daemon.status`, campo `active_profile` — `daemon/ipc_handlers.py:1986` e `:2404` | **existe** |
| a linha verde, e o ativo em primeiro | `profiles_actions.py:1804` (`_sync_selection_with_active_profile`), `:3871` (`_mark_active_profile_row`), `:3908` (`_levar_o_ativo_para_o_topo`), `:466` (`realce_do_perfil_ativo`) | **existe** |
| a ordem da lista | `profiles_actions.py:664` (`ordem_de_exibicao`) — **pura** | **existe** |
| a coluna "Quando usar" | `:292` (`_match_label`), `:380` (`rotulo_quando_usar`) — **puras** | **existe** |
| a dica da linha (a disputa) | `:355` (`perfis_em_disputa`), `:360` (`vencedor_da_disputa`), `:403` (`explicacao_da_disputa`) — **puras** | **existe** |

**O IPC `profile.list` (`daemon/ipc_handlers.py:886`) NÃO serve esta aba** — ele
devolve só `name`/`priority`/`match_type`. Quem for ligar por ali vai descobrir
tarde que falta a regra inteira.

## O que entrega

1. **`ordem_de_exibicao`, `rotulo_quando_usar` e `explicacao_da_disputa`
   atravessam a ponte sem uma linha nova.** São funções puras sobre objetos
   `Profile` e continuam onde estão. A sprint **liga, não reescreve** — o que
   muda é o destino: em vez de `Gtk.ListStore`, um JSON que o
   `run_javascript` entrega ao `<tbody data-hef="perfis.lista">`.
2. **O realce do ativo deixa de ser `Pango.AttrList`.**
   `realce_do_perfil_ativo` (`:466`) tem um consumidor só e morre com o
   `TreeView`; o mockup já traz a classe `.ativo` na `<tr>`. **Menos código, não
   mais:** apague a função e o import de Pango que só ela usava.
3. **A pintura acontece na thread principal.** `_reload_profiles_store` já roda
   o disco em thread e devolve pela `GLib.idle_add`; `run_javascript` tem a
   mesma exigência. Herde o caminho que existe em vez de abrir um segundo.
4. **Zero perfis é estado legítimo** e não é tabela vazia: a frase honesta no
   lugar da lista, e o bloco da direita apagado. É o mesmo contrato de "zero
   controles" que vale para toda aba desta leva.

## O perigo que o GTK não tinha: o nome do perfil é DADO DELA dentro de uma página

Num `Gtk.TreeView`, um perfil chamado `<b>x</b>` é o texto `<b>x</b>`. **Numa
página, ele é markup.** Os nomes vêm de arquivo em disco — dela, importados, ou
gerados pelo "Detectar" a partir do **título de uma janela de jogo**, que é
texto que ninguém desta casa controla.

**Nenhum valor pintado por esta aba pode chegar à página como HTML.** Nem nome,
nem "Quando usar" (que carrega `mk1.exe` e o título da janela), nem a dica da
disputa. Use a atribuição de texto do nó, nunca a de markup; e o mesmo vale para
o JSON que atravessa a ponte.

## Como se prova (a mordida)

`tests/unit/test_migra_perfis_03_a_lista_chega_viva.py`:

- **três perfis entram, três linhas saem**: dublê com três `Profile` e um
  `active_profile`; o JavaScript que a ponte emitiu (capturado do dublê de
  `WebView`) contém os três nomes, as três prioridades e os três rótulos de
  "Quando usar". Tire um perfil e o teste conta dois.
- **o ativo é o primeiro e é o verde**: a linha do ativo tem `class="ativo"` e é
  a **primeira** do `<tbody>`. Arranque a chamada a `ordem_de_exibicao` e veja
  reprovar — sem ela a ordem é a do disco, e o ativo cai no meio.
- **A MORDIDA DA INJEÇÃO, e ela é nova nesta rota:** um perfil chamado
  `<img src=x onerror=alert(1)>` e outro com aspas e acento
  (`Perfil "do Jorge" — ação`). Os dois têm de aparecer **literais** no texto da
  linha, e o HTML resultante não pode conter um `<img` que a página não tinha.
  Arranque o escape e o teste reprova. **Sem esta régua, a rota inteira ganha um
  buraco que o GTK não tinha** — e o dado que passa por ele é o dela.
- **zero perfis não é tabela vazia**: com a lista vazia, a página mostra a frase
  e **não** mostra cabeçalho de tabela sozinho. Devolva a tabela vazia e
  reprova.
- **o disco não bloqueia a janela**: `load_all_profiles` continua sendo chamado
  fora da thread principal e a pintura, dentro dela. Arranque a `idle_add` e o
  teste vê a pintura fora da principal.
- **a foto não vaza os perfis dela**: `retratar_abas.py:868` (`_PERFIS_DA_FOTO`)
  continua sendo a fonte da imagem versionada — três perfis **inventados**, com
  o motivo escrito no próprio arquivo (*"os portões de anonimato não varrem
  imagens"*). Ligue `load_all_profiles` no retrato e o teste reprova.

## O que é dela decidir — e o que NÃO é desta sprint

- **A coluna "Quando usar" muda de FORMA, e isso é a `ONDA-PERFIS-06`.** Hoje
  `_MATCH_LABELS` (`profiles_actions.py:282`) devolve **"Só neste programa"**
  para *todo* `criteria` — catorze perfis diferentes com a mesma frase. O mockup
  mostra `Jogo · mk1.exe`, `Jogo da Steam · 1245620`, `Estilo de Jogo · Terror`.
  **Mesma fonte, forma nova.** Esta sprint pinta o que a função devolver; quem
  troca a função é a `ONDA-PERFIS-06`, e as duas dividem
  `profiles_actions.py` — logo correm **em série**, nesta ordem ou na
  inversa, nunca juntas.
- **A dica da linha continua sendo dica.** `explicacao_da_disputa` já é o
  tooltip hoje e o mockup a mantém no `title` da `<tr>`. Mas o `title` do
  WebKit é a **caixa do sistema**, não a `.dica` estilizada da moldura — as duas
  convivem na mesma página com aparências diferentes. Se isso incomodar ela, a
  cura é da moldura (uma dica só para as dez abas), não daqui.
