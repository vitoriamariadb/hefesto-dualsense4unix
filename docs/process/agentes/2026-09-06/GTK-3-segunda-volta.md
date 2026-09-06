# GTK-3 · SEGUNDA VOLTA — a que REMOVE

**06/09/2026 · árvore `hefesto-voo/hefesto-voo/GTK-3-E2`, branch `voo/GTK-3-E2`,
nascida de `onda/atual-0609` (`f0aafa74`) e adiantada até `98f2a6a4`.**

> **A decisão dela** (`D-0609-GTK-LEVA-INTEIRA`): *"a ideia sempre foi
> reaproveitar o que fiz no gtk e não apontar nada mais pra lá mas pro html"*.
> **O motor fica; a janela sai.**

**O QUE ESTA VOLTA FEZ, em uma linha:** apagou o `gui/main.glade` (292 KB),
`app/app.py`, `app/main.py`, `scripts/portao_alvo_tem_dono.py` e os cinco
arquivos de `scripts/gui-captura/`; apagou oito testes que só existiam para a
janela e operou vinte e três; e devolveu ao `palavra-de-tela`, ao
`paridade-gtk-html`, ao `nada-aponta-para-a-janela` e ao `referencias-docs` o
alcance que a remoção lhes tiraria. **17 arquivos apagados, 3 nascidos, 54
editados — 74 no total: +2.092 / −15.360 linhas.**

**A sprint fecha aqui** — `estado: aberta` → `estado: feita` no mesmo commit.

---

## 1. O PRODUTO FICA DE PÉ SEM A JANELA — a prova, e ela é de três partes

Nada disto foi lido em código: foi rodado com a janela **já fora do disco**.

### 1.1 As dez páginas abrem, e o retratista as fotografa

```
src/hefesto_dualsense4unix/interface/olhar.py --todas --publicado --doc
→ 10 abas retratadas · 1180x777 cada · docs/usage/assets/aba-NN-*.png
```

As dez saíram **byte a byte idênticas** às commitadas — `git status --porcelain
-- docs/usage/assets` devolveu zero linha e o sha256 das dez bate. **É o que
esta leva tinha de provar:** apagar a janela não move um pixel da tela dela,
porque a tela é HTML e o motor que a pinta ficou inteiro. Eu abri a
`aba-09-sistema.png` e olhei: cabeçalho, tira das dez abas, os cartões de
Sistema, tudo renderizado.

A declaração está em `docs/usage/assets/CONFERIDO-EM.txt`, com os dez sha256.

### 1.2 O piloto sobe, com o daemon vivo e um controle na mesa

```
interface/hefesto_vivo.py --oculta --segundos 6 --foto
→ rc=0 · 60 voltas · 01-jogar.html: 60 tiques · 2 pinturas · 36 valores
→ hidraw_broker_lease_open · hidraw_broker_fd_recebido node=/dev/hidraw7 state=hidden
→ custo do tique: mediana 2,76 ms · max 11,87 ms (teto 100 ms)
```

**Rodado sob `HOME` e os quatro `XDG_*` desviados para um lar de mentira**, e a
razão é a cicatriz desta casa: *rodar o piloto dispara as migrações one-shot no
`~/.config` REAL dela*. A foto foi lida e a tela está pintada com dado vivo.

`--oculta` sempre. Nenhuma janela nasceu na tela dela.

### 1.3 O que o alcance perdeu, medido — não estimado

O `portao_a_casa_sabe_e_o_produto_nao_faz` calcula o fecho de import a partir
dos pontos de entrada. Rodei o mesmo cálculo numa **worktree destacada em
`98f2a6a4`** e nesta árvore:

| | módulos alcançáveis |
| --- | ---: |
| `98f2a6a4` (antes) | **264** |
| esta árvore | **260** |

Os quatro que saíram, e só eles: `app.app`, `app.main`, `app.compact_window`,
`app.tray`. **Nenhum módulo de motor caiu do alcance.**

### 1.4 O que se PERDE de verdade, escrito porque se perde mesmo

Três capacidades da janela não têm dono na interface nova. Elas não são dívida
inventada por mim — são o que a remoção torna visível:

| o que era | onde morria | hoje |
| --- | --- | --- |
| `window-state-event` — minimizar matava a captura do microfone | `app/app.py` | **sem chamador.** Minimizar a interface nova não para captura nenhuma |
| `acquire_or_bring_to_front` — o segundo clique no ícone trazia a janela | `utils/single_instance.py` | **sem chamador.** Dois cliques podem abrir duas janelas |
| SOM-03: *"a escala tem cerca de 30 pixels de largura, é só a bolinha"* | `Gtk.Scale` do `controller_card.py` | o trilho é `<input type="range">` e **nenhuma régua desta casa mede a largura dele** |

As três estão escritas no lugar onde alguém vai procurar: as duas primeiras em
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` (`_SEM_CAMINHO_HOJE`,
com razão), a terceira no cabeçalho de
`tests/unit/test_status_som_02_controle_de_volume.py`.

---

## 2. A MORDIDA — a régua repontada ainda reprova quando o MOTOR quebra

**É a pergunta que a sprint faz e a única que importa:** uma régua que media a
JANELA e foi repontada para o HTML — ela virou enfeite, ou continua mordendo?

Nove mordidas, todas com o registro do antes / durante / depois.

### 2.1 A palavra de tela (`palavra-de-tela`) — o corpo 1 trocou de tela

O portão lia o `gui/main.glade` para colher os rótulos. Agora lê as dez
`interface/paginas/*.html` (novo `_ColheitaDaPagina(HTMLParser)`), e reprova se
achar menos de dez páginas publicadas.

```
ANTES                                                          rc=0
MORDIDA: dois termos banidos no <h1> da 09-sistema             rc=1
  09-sistema.html:1168: o rótulo 'Gamepads: daemon offline —' contém
  o jargão 'daemon offline', aposentado pela E3 da PALAVRA-01.
DEVOLVIDA                                                      rc=0
```

**Morde na tela viva, não no XML morto.**

### 2.2 O berço da aba Configurações — e ele nasceu FROUXO, e a medição pegou

A aba Configurações **nunca morou no glade**: o XML só reservava o container
(`tab_config_box`) e as cinco seções nascem em `app/actions/config/`, que é
motor e fica. Três réguas abriam o glade **só para pegar a caixa vazia**. O
berço `tests/unit/aba_config_sem_a_janela.py` faz essa caixa em código.

A primeira versão devolvia só a caixa. Medido contra o `main.glade` restaurado
do git e montado no MESMO processo:

```
com o glade   5 seções · 196 textos
com a caixa   5 seções · 193 textos      ← TRÊS A MENOS, em silêncio
```

`secao_janela._linha_do_espelho` devolve `None` sem o `daemon_autostart_switch`
e a linha inteira some **sem levantar**. É a cicatriz literal desta casa —
*"três dublês eram mais frouxos que o daemon vivo"* (05/09). O berço passou a
declarar o interruptor, e nasceu a régua que cobra as frases pelo NOME:

```
ANTES                                                          4 passed
MORDIDA: o berço deixou de entregar o daemon_autostart_switch  1 failed
  AssertionError: a linha do espelho sumiu da aba: 'Ligar junto com o
  computador' não foi colhida.
DEVOLVIDO                                                      4 passed
```

**E A CONTAGEM ABSOLUTA NÃO SERVE DE RÉGUA**, e isso também foi medido: a mesma
aba colhe **199** textos num processo solto e **196** sob a suíte — três frases
leem o DMI da placa e o `conftest` desvia o `HOME`. Um número cravado ali
mediria a BANCADA, que é a família de defeito que esta casa persegue. Por isso
a régua cobra `FRASES_DO_ESPELHO` e um `PISO_DA_COLHEITA = 190`, nunca a
igualdade.

### 2.3 As quatro funções de ambiente — `app/arranque.py`

`app/main.py` levava quatro coisas que **não montavam janela**: `x11_alcancavel`,
`forcar_xwayland_no_cosmic`, `sanear_loaders_do_gdk_pixbuf` e
`de_outro_confinamento`. Mudaram de casa. Os 18 testes de
`test_ambiente_presumido_01` foram repontados e continuam mordendo:

```
ANTES                                                          18 passed
MORDIDA: arrancada a conferência de X vivo                     1 failed
  assert True is False — forcar_xwayland_no_cosmic()
DEVOLVIDA                                                      18 passed
```

O docstring do módulo registra o que ninguém deve remedir: **hoje nada os
chama** — `run.sh:63-68` e `:82-86` fazem a versão grosseira —, e fechar essa
distância é trabalho de `scripts/abrir_interface.py`.

### 2.4 A paridade GTK↔HTML — o mecanismo APOSENTADOS, e ele morde nos dois lados

126 endereços do `paridade-gtk-html.csv` apontavam para arquivos apagados. A
cura NÃO foi apagar linha: cada linha é uma medição de paridade que continua
valendo. Nasceu `APOSENTADOS` — o arquivo saiu por decisão, e endereço
aposentado **só vale em `gtk_onde`** (o lado histórico), nunca no `html_onde`.

```
ANTES                       396 features · 34% de paridade
MORDIDA 1: o glade VOLTA à árvore
  aposentado-vivo: gui/main.glade está declarado em APOSENTADOS e o
  arquivo EXISTE. Ou a remoção foi desfeita, ou alguém recriou o que a
  decisão dela mandou apagar.
MORDIDA 2: endereço aposentado no lado HTML
  endereco-morto: [01-jogar] … html_onde: gui/main.glade:10 — o arquivo
  foi APOSENTADO, e endereço aposentado só vale em gtk_onde.
DEVOLVIDO                   396 features · 34% de paridade
```

Uma linha morta de verdade sobrou e foi **repontada, não apagada**:
`profile_save_button` → `on_profile_save`.

### 2.5 O portão da janela — `alvos_cumpridos()`

`check_nada_aponta_para_a_janela.py` existia para impedir que a janela CRESÇA
enquanto sai: *"a lista só diminui"*. Com o arquivo apagado, toda nota datada de
quem apagou virava "citação nova" — 22 reprovações sobre a própria cura.
`alvos_cumpridos()` lê o DISCO: alvo cujo artefato não existe sai das duas
regras, porque `from hefesto_dualsense4unix.app import app` já é
`ModuleNotFoundError` e nenhuma régua precisa proibir o que o interpretador
recusa.

```
ANTES                       226 pares · 470 citações declaradas
MORDIDA: o gui/main.glade VOLTA ao disco
  FALHA: 15 problemas — nada novo aponta para a janela.
DEVOLVIDO                   225 pares · 473 citações · 3 alvos CUMPRIDOS
                            (241 citações são prosa datada; 104 pares
                             continuam vigiados)
```

**Se um deles voltar ao disco, volta às regras sozinho.** É a garantia
anti-apodrecimento: o alvo cumprido não é uma isenção permanente.

### 2.6 As 783 citações de `docs/` — e eram 721 na conta da sprint

```
ANTES DA CURA   783 referência(s) morta(s) em 851 documento(s)
DEPOIS          OK: 851 documento(s) sem referência morta.
```

Mesmo mecanismo, mesma régua dupla:

```
MORDIDA 1: o glade VOLTA ao disco
  APOSENTADO-VIVO: gui/main.glade está declarado em APOSENTADOS e EXISTE.
MORDIDA 2: referência morta NOVA num caminho de gui/
  1 referência(s) morta(s): COMO-OLHAR-A-TELA.md:668:
  src/hefesto_dualsense4unix/gui/janela_de_mentira.py [arquivo]
DEVOLVIDO       OK: 851 documento(s) sem referência morta.
```

A segunda mordida teve de ser **refeita**: a primeira tentativa inventou um
caminho fora de `gui/` e o validador o ignorou por outra regra — a régua estava
certa e a MORDIDA é que media outra coisa. Registrado porque é exatamente o
defeito que esta casa persegue.

### 2.7 A paridade de empacotamento — a regra virou EFEITO, não texto

`check_packaging_parity.sh` cobrava *"`app/main.py` pede o ícone"*. Repontado
para `scripts/abrir_interface.py`, e a regra deixou de ser "cite o arquivo":
passou a cobrar que o nome venha de `utils/identidade.py`, que é o dono.

```
ANTES                                                 rc=0
MORDIDA: literal cravado no set_default_icon_name     rc=1
  [FAIL] scripts/abrir_interface.py passa um LITERAL a set_default_icon_name
         o nome tem de vir de utils/identidade.py, que é o dono.
DEVOLVIDO                                             rc=0
```

### 2.8 A tabela do primeiro arquivo que se manda ler

`test_a_tabela_dos_scripts_de_tela.py` listava `scripts/gui-captura/` e
perguntava *"está tudo na tabela?"*. A pasta morreu; **o defeito que a régua
pega não morreu junto** — *o primeiro arquivo que se manda ler nomeia uma
ferramenta que não existe*. Ela passou a cobrar três coisas com dono: todo
caminho citado existe, o retratista está nomeado, e o número no título bate.

```
ANTES                                          3 passed
MORDIDA: a linha do retratista sai da tabela   2 failed
  não cita interface/olhar.py, que é o retratista das dez páginas
  o título diz 'Os quatro instrumentos…' e a tabela tem 3 linhas (três)
DEVOLVIDA                                      3 passed
```

**O primeiro defeito desta reescrita foi meu e é o mesmo de sempre:** varrer
toda linha que começa com `|` colhia **23** linhas — as tabelas das réguas que
mentiram, a dos zeros da GPU. O instrumento medindo outra coisa. Escopado pelo
título da seção.

### 2.9 O `prerm` do `.deb` — a régua passou a PERGUNTAR ao dono

`packaging/debian/prerm` matava `hefesto_dualsense4unix\.app\.main`, que
deixaria de casar. Repontado para `scripts/abrir_interface\.py`. E o teste que o
vigiava **digitava** o padrão; agora ele pergunta a
`utils.identidade.atual().padroes_de_matanca`, que é o dono da lista.

---

## 3. OS 44 PORTÕES — três voltas, e o que cada vermelho era

`git add -A` antes de cada volta (portões são cegos a arquivo novo).

| volta | resultado | o vermelho |
| --- | --- | --- |
| 1ª | `REPROVOU: 2 de 44` | `referencias-docs` · `acentuacao` |
| 2ª | `REPROVOU: 1 de 44` | `acentuacao` |
| 3ª | `REPROVOU: 1 de 44` | `ruff` |
| 4ª | `TODOS VERDES — 44 portões.` | — |
| 5ª | **`TODOS VERDES — 44 portões.`** — a última, já com o relatório, o `estado: feita` e as duas substituições de fato de `run.sh` e `interface.md` no índice | — |

**`referencias-docs` — 783 referências mortas em 851 documentos.** Toda citação
de `docs/` aos quatro artefatos apagados. Curado com `APOSENTADOS` (§2.6), não
com apagamento: cada citação é nota datada de uma decisão medida.

**`acentuacao` — 3 e depois 4 violações.** Todas na PROSA que eu escrevi
justificando a remoção: o verbo `media` (imperfeito de *medir*, sem acento) que
o validador lê como `média`, três vezes, e `paginas` uma vez — este último num
caminho de pasta no disco, onde o acento seria erro. Marcados com
`# (noqa-acento: …)` nas linhas exatas. **A quarta apareceu porque a cura da
terceira introduziu a palavra de novo** — o aviso virou o defeito que descrevia,
que é a armadilha nomeada no `CLAUDE.md` de 05/09.

**`ruff` — E501, uma linha de 116 colunas.** E a causa é a mesma: o marcador
`# (noqa-acento: …)` que curou o `acentuacao` **estourou o limite de coluna do
ruff**. Duas réguas em desacordo sobre a mesma linha. Curado trocando o verbo
(`media` → `mediu`), que dispensa marcador e encurta a linha — a cura que não
precisa de exceção nenhuma.

**Um vermelho a mais, que NÃO é portão e era HERANÇA:**
`test_as_fotos_nao_ficam_atras_do_codigo_da_tela` já reprovava em `98f2a6a4`
antes de eu editar um byte — medido numa worktree solta no próprio commit
(`1 failed, 6 passed`). A leva anterior mexeu em `interface/` e `app/` sem
refotografar. Fechado pela porta que o próprio teste descreve: a declaração em
`CONFERIDO-EM.txt`, com os dez sha256 idênticos (§1.1).

---

## 4. O QUE SOBRA DE `gui/` — arquivo por arquivo, e por que

**4.573 linhas, e nenhuma delas é a janela.**

| arquivo | linhas | por que fica | quem chama |
| --- | ---: | --- | --- |
| `ponte_da_tela.py` | 732 | **`nao_toca` meu, e é o coração da interface nova**: é o `WebKit2.WebView` que renderiza as dez páginas | `interface/perfis_vivos.py`, `sistema_viva.py`, `controles_vivos.py` |
| `aba_conexoes.py` | 1.114 | **medido pela GTK-1 como FICA E MUDA DE CASA**: é motor de Conexões, não janela | `interface/conexoes_vivas.py:48` (`import` vivo) |
| `aba_sistema.py` | 692 | idem — `GESTOS` e o contrato que a aba 09 lê | `interface/sistema_viva.py:57`, `interface/aba09.py:168` |
| `theme.css` | 1.401 | **é o léxico visual da casa**, e a interface nova lê dele: os vinte `@define-color` | `app/theme.py:37`, `integrations/cor_do_plastico.py`, `daemon/subsystems/hotkey.py` |
| `widgets/button_glyph.py` | 352 | `Gtk.DrawingArea` que desenha glifo de botão | `app/widgets/controller_card.py:138` (`app/widgets/` é `nao_toca`) |
| `widgets/stick_preview_gtk.py` | 262 | idem, para o analógico | idem |
| `widgets/__init__.py` | 20 | o pacote | — |
| `assets/logo.png` | — | a logo do cabeçalho **não é a janela**; `app/constants._resolve_icon_path` a procura ali primeiro no cenário `.deb`/flatpak/wheel | `app/constants.py:27` |

**O que saiu de `gui/`: um arquivo, `main.glade`.** A pasta não é a janela —
essa foi a medição da GTK-1, e ela se confirmou linha a linha.

**Fora de `gui/`, o que saiu:** `app/app.py` (o `HefestoApp` que montava a
janela), `app/main.py` (o entry point), `scripts/portao_alvo_tem_dono.py` (que
importava o `HefestoApp` e por isso não sobreviveria), e os cinco de
`scripts/gui-captura/` — o estúdio de fotografia das ONZE abas da janela.

**`app/constants.py`:** `MAIN_GLADE` saiu com nota datada; `GUI_DIR` fica, por
causa do `logo.png`.

---

## 5. `install.sh` E `packaging/` — linha por linha

> **`install.sh` eu EDITEI e NÃO RODEI**, nem com `--yes`, nem em dry-run.
> Nenhum comando com `sudo` foi executado nesta volta.

**A descoberta que encurtou este item:** o lançador **já não abria a janela GTK**
— foi repontado em 01/09/2026 por ordem dela (*"tudo tem que apontar pro nosso
lancher html"*). O `.desktop` versionado traz `Exec=@RAIZ@/interface.sh`, e
`interface.sh` → `run.sh --gui` → `scripts/abrir_interface.py`. **Então nenhuma
linha executável precisou mudar.** O que mudou foi endereço de comentário — e
comentário que aponta para arquivo que não existe é exatamente o que faz a
próxima pessoa parar de procurar.

| arquivo:linha | de | para |
| --- | --- | --- |
| `install.sh:525` | `BUG-TRAY-ICONE-INVISIVEL-01, app/main.py` | `…, app/arranque.py` |
| `packaging/debian/prerm:20` | `pkill -f 'hefesto_dualsense4unix\.app\.main'` | `pkill -f 'scripts/abrir_interface\.py'` **(executável — o único)** |
| `packaging/debian/control:43` | `descrito em app/main.py` | `descrito em app/arranque.py` |
| `packaging/arch/PKGBUILD:39` | `descrito em app/main.py` | `descrito em app/arranque.py` |
| `packaging/arch/PKGBUILD:124` | `app/main.py (set_default_icon_name)` | `scripts/abrir_interface.py (set_default_icon_name)` |
| `packaging/fedora/…spec:49` | `descrito em app/main.py` | `descrito em app/arranque.py` |
| `packaging/fedora/…spec:143` | `app/main.py set_default_icon_name` | `scripts/abrir_interface.py set_default_icon_name` |
| `packaging/nix/package.nix:24` | `descrito em app/main.py` | `descrito em app/arranque.py` |
| `packaging/nix/package.nix:177` | `app/main.py set_default_icon_name` | `scripts/abrir_interface.py set_default_icon_name` |
| `packaging/hefesto-dualsense4unix.desktop:26` | `Gdk.set_program_class em app/main.py e em scripts/abrir_interface.py` | só `scripts/abrir_interface.py`, com a nota datada |
| `scripts/build_deb.sh:140` | `app/main.py (set_default_icon_name)` | `scripts/abrir_interface.py (set_default_icon_name)` |
| `pyproject.toml:112` | `include = ["…/gui/*.glade", …]` | linha removida, com a razão. **`gui/assets/*.png` FICA** |
| `pyproject.toml:104` | *"`app/main:main` continua importavel"* | **fato errado, substituído**: os dois módulos foram apagados; o motor é que ficou |

**A regra que atravessa a tabela:** o `BUG-TRAY-ICONE-INVISIVEL-01` está descrito
em prosa longa, e a prosa mudou de casa junto com as quatro funções de ambiente
— por isso `app/arranque.py`, e não `scripts/abrir_interface.py`, é o endereço
certo nas seis linhas de dependência SVG.

**Fora do `packaging/`, na mesma família — três fatos errados, substituídos:**

* **`utils/identidade.py:padroes_de_matanca`** — o dono da lista de padrões de
  morte. Segundo padrão repontado de `hefesto_dualsense4unix\.app\.main` para
  `scripts/abrir_interface\.py`. É ele que o `prerm` do `.deb` passou a
  perguntar, em vez de digitar.
* **`run.sh:73`** dizia *"app/main.py também faz isto"* sobre a força do
  XWayland no COSMIC — e o "também" era a garantia de que o bloco de shell era
  redundante. **Não é mais.** A versão fina (a que confere se há X VIVO) mudou
  de casa para `app/arranque.forcar_xwayland_no_cosmic`, **que hoje ninguém
  chama**, e este bloco passou de garantia grossa a ÚNICA cura. Escrito lá,
  onde quem for mexer vai ler.
* **`docs/usage/interface.md:34`** prometia que as capturas da janela
  *"acompanham a versão"* e que *"quem mexe na interface roda o script antes de
  commitar"*. **Deixou de ser verdade no minuto em que `scripts/gui-captura/`
  saiu**, e contradizia a nota do topo da própria página, duas telas acima.

---

## 6. O QUE EU **NÃO** VERIFIQUEI

1. **A suíte inteira.** Rodei os 23 arquivos de teste que toquei mais os dois
   portões-teste da janela: **317 passed · 3 skipped**. A suíte completa, em
   doze lotes, é de quem coordena e roda no FECHO — regra da casa.
2. **`install.sh` executado.** Por ordem expressa: nem `--yes`, nem dry-run.
   Ele reescreve `~/.local/bin`, o `.desktop`, a unit systemd e **reinicia o
   serviço que ela está usando agora**. Nada em `packaging/` foi construído:
   nenhum `.deb`, `.rpm`, AppImage ou derivação Nix saiu desta árvore.
3. **A wheel construída.** Tirei `gui/*.glade` do `include`, mas não rodei
   `hatch build` para conferir que a roda ainda carrega o `logo.png`. O que
   medi foi que `app/constants._resolve_icon_path` continua procurando em
   `GUI_DIR/assets/logo.png` e que `gui/assets/*.png` continua no `include`.
4. **O applet COSMIC** (`packaging/cosmic-applet/`, Rust). Ele chama
   `hefesto-dualsense4unix-gui`, que é console script de
   `interface/hefesto_vivo:main` desde 01/09 — não tocava `app.main`. Não
   compilei.
5. **A janela GTK aberta lado a lado com a interface nova.** Não dava: a janela
   não existe mais. A comparação de rótulos que ela substituiria está feita de
   outro jeito — o berço da §2.2 foi medido contra o `main.glade` restaurado do
   git antes de o arquivo sair.
6. **`integrations/storm_doctor.py` continua com um leitor do glade** (`:194`),
   e ele agora cai sempre no `except OSError`. **Medido, não presumido:**
   `rotulo_do_botao("btn_storm_fix_safe", …)` devolve
   `'Refazer os consertos automáticos'` **da página viva**, sem aviso e sem
   entrar em `_ROTULOS_DE_RESERVA` — a fonte 1 (a tela publicada) responde. O
   docstring dele já previa este dia. **Não é meu escopo e não toquei**, mas
   para ids que não estejam na tela viva a resposta passou a ser o `se_faltar`
   mais um `warnings.warn`, que é o desenho declarado.
7. **A poda do CSV da janela.** `check_nada_aponta_para_a_janela.py` avisa que
   *"a lista encolheu: 49 pares sumiram e 17 tiveram menos ocorrências. Rode
   `--podar`"*. **Não podei de propósito:** a lista só diminui, e podar agora
   apagaria o registro de onde a janela ainda estava citada no dia em que saiu.
   É trabalho de quem fecha a onda, com o CSV inteiro à vista.
8. **As catorze `readme_*.png` da janela antiga.** Ficam no disco como registro
   datado de `docs/usage/interface.md`. **Ninguém mais as tira** — o estúdio
   saiu. Elas não entram em `CODIGO_DA_TELA` nem no `README.md`, que publica só
   as dez novas.

---

## 7. O QUE A PRÓXIMA PESSOA PRECISA SABER

**A armadilha desta volta, e ela custou 89 testes:** a primeira volta (e a
GTK-1) censaram quem citava a string `"main.glade"`. **Dezessete arquivos não
citavam** — eles importavam `MAIN_GLADE` de `app.constants`. A coleta do pytest
não os acusa: eles quebram em tempo de execução, um a um. **Quem apagar um
arquivo nesta casa procura pelo NOME e pela CONSTANTE que o guarda.**

**A regra que sobra:** um alvo cumprido não é uma referência morta. Três portões
ganharam o mesmo mecanismo (`APOSENTADOS` / `alvos_cumpridos()`), e os três
reprovam se o arquivo VOLTAR ao disco. Uma isenção que não sabe expirar é uma
isenção que apodrece.
