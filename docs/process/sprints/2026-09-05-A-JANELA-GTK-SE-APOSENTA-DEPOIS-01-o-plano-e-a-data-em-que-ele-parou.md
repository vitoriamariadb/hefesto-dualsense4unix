---
sprint: A-JANELA-GTK-SE-APOSENTA-DEPOIS-01
estado: aberta
posse:
  PLANO:
    - docs/process/sprints/2026-09-05-A-JANELA-GTK-SE-APOSENTA-DEPOIS-01-o-plano-e-a-data-em-que-ele-parou.md
depois_de:
  - A-DOCUMENTACAO-RETRATA-AS-DEZ-01
nao_toca:
  - src/
  - tests/
  - scripts/
---

# D-19 · A janela GTK se aposenta DEPOIS, em leva própria

> **LIBERADA POR ELA EM 06/09/2026 — a leva INTEIRA, nas 24 horas.** Palavra
> dela: *"a ideia sempre foi reaproveitar o que fiz no gtk e não apontar nada
> mais pra lá mas pro html. só que o claude opus fez o contrário e isso foi
> ficando aqui"*. <!-- noqa-acento: citação literal dela --> Os cinco passos abaixo viram
> três sprints do orquestrador (GTK-1 inventário + portão "nada aponta para a
> janela"; GTK-2 os dois leitores do glade ganham dono no motor; GTK-3 os 62
> testes um a um, a remoção, `pyproject`/`packaging`/`install.sh`), na ordem de
> `docs/process/2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md`.
> **O motor (`app/actions/`, `app/widgets/`, `app/telas/`) fica: é reuso.**
> A nota de 05/09 abaixo é história do porquê a ordem é esta.
>
> *(05/09/2026: parada por decisão dela; ninguém executava nada deste arquivo.)*

**Por que ela não morre junto com a D-18:** nenhum lançador a abre, mas
`app/actions/` é o **motor que a interface nova chama**. São coisas diferentes
no mesmo lugar, e apagar a pasta pelo nome derrubaria as dez abas novas.

---

## 1. O QUE JÁ ESTÁ DECIDIDO, e está no `pyproject.toml`

A decisão de **tirar o lançador** é de 01/09 e é dela:

> *"a versão antiga não segue disponivel, vai gerar confusão nos agentes. So a
> nova esta disponivel e deve ser integrada."* <!-- noqa-acento: citação literal dela -->
> — `pyproject.toml:100-102`

E a linha seguinte, escrita no mesmo lugar, é exatamente o que a D-19 confirma:

> *"A JANELA GTK NAO SOME DO CODIGO: app/main:main continua importavel, e os
> 74 handlers de `app/actions/`, o `app/ipc_bridge.py` e as camadas de
> `app/telas/` são o MOTOR que a interface nova chama. **O que saiu e o
> LANCADOR.**"*
> — `pyproject.toml:104-106`

```toml
hefesto-dualsense4unix-gui = "hefesto_dualsense4unix.interface.hefesto_vivo:main"
```
— `pyproject.toml:107`

E o lançador instalado sobrescreve até isso, para desprender a janela do
terminal (`install.sh:2852-2860`): `.desktop` → `interface.sh` → `run.sh --gui`
(`run.sh:100`) → `scripts/abrir_interface.py` → `interface/hefesto_vivo.py`.

**Nenhum caminho de usuária chega a `app/main.py`.**

---

## 2. O QUE SE MEDIU — os números que dizem por que é leva própria

### O motor é chamado por quem fica

| medida | número |
| --- | --- |
| módulos em `src/hefesto_dualsense4unix/app/actions/` | **24** (mais o `__init__.py`) |
| destes, importados por `src/hefesto_dualsense4unix/interface/` | **20** |
| arquivos de `tests/` que importam `hefesto_dualsense4unix.app.actions` | **265** |
| arquivos `.py` sob `src/hefesto_dualsense4unix/app/` | **65** |
| arquivos `.py` sob `src/hefesto_dualsense4unix/gui/` | **6** |

Os vinte que a interface nova importa, medidos com
`grep -rho 'from hefesto_dualsense4unix\.app\.actions\.[a-z_]*' src/hefesto_dualsense4unix/interface/`:

```
ambiente_na_tela · base · config · daemon_actions · emulation_actions
external_controllers · home_actions · input_actions · jogar · lightbar_actions
mode_transition · mouse_actions · profiles_actions · profile_writer · relancar
rumble_actions · status_actions · triggers_actions · trigger_specs
```

— dezenove por `from … import`, mais **`perfis_web`**, importado por
`interface/perfis_vivos.py:69` (`from hefesto_dualsense4unix.app.actions import
perfis_web`), que é o pacote inteiro da aba 10.

**Sobram quatro sem chamador na interface nova:** `carona_do_wrapper`,
`contrato_da_mascara`, `footer_actions` e `launch_wrapper_dialog`. **Não conclua
daí que são da janela** — o `carona_do_wrapper` tem régua própria
(`tests/unit/test_carona_do_wrapper_01_salvar_repoe_o_que_a_steam_comeu.py`) e o
`footer_actions` é o rodapé, que a interface nova reescreveu em
`interface/pacotes/rodape.py`. **Quem é de quem é a primeira medição da leva**,
e ela não está feita aqui.

### `app.main` — seis arquivos de teste, e só UM o importa

| arquivo | como depende |
| --- | --- |
| `tests/unit/test_ambiente_presumido_01_o_display_que_nao_existe.py:25` | **importa de verdade** — `from hefesto_dualsense4unix.app import main as app_main`, e exercita `_x11_alcancavel` (`:143-155`) |
| `tests/unit/test_packaging_ativacao_deb.py:260` | a STRING `"hefesto_dualsense4unix.app.main"` no empacotamento `.deb` |
| `tests/unit/test_single_instance.py:228,:233` | a linha de comando `python3 -m hefesto_dualsense4unix.app.main` num dublê de `cmdline` |
| `tests/unit/test_identidade_do_aplicativo_01.py:45-49` | o caminho `src/hefesto_dualsense4unix/app/main.py` numa tabela de responsabilidades |
| `tests/unit/test_loader_svg_nos_empacotamentos.py:18` | citação do BUG-TRAY-ICONE-INVISIVEL-01 |
| `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:270,:410,:576` | a tabela do que a casa sabe; `:410` já registra *"Aqui havia `python3 -m …app.main`, a janela GTK velha."* |

**O `_x11_alcancavel` é a armadilha desta linha:** é código de AMBIENTE morando
no arquivo da janela. Se `app/main.py` sair sem que ele mude de casa, some com
ele a única régua que mede o display inalcançável.

### `main.glade` — 62 arquivos de teste, e dois leitores FORA da janela

`src/hefesto_dualsense4unix/gui/main.glade` tem **4305 linhas** e é citado por
**62 arquivos de `tests/`**. Fora da janela GTK, quatro programas o abrem:

| quem | linha | o que faz |
| --- | --- | --- |
| `app/app.py` | `:284` | monta a janela — é a janela |
| `app/constants.py` | `:12` | `MAIN_GLADE`, o caminho |
| `scripts/gui-captura/retratar_abas.py` | `:196` | fotografa a janela — sai com ela |
| `scripts/i18n_extract.sh` | `:22` | extrai as strings para tradução |
| **`integrations/storm_doctor.py`** | `:69` | **lê o RÓTULO VIVO de um botão** |
| **`interface/aba05.py`** | `:273` | **a interface NOVA lê três textos de tela** |

**Os dois de baixo são o nó desta sprint, e nenhum é da janela.**

```python
_GLADE = (DADOS_DO_REPO.parent.parent / "src/hefesto_dualsense4unix/gui/main.glade").read_text()
```
— `interface/aba05.py:273`, **no corpo do módulo**, com a razão escrita logo
acima (`:262-267`): *"ELAS SÃO LIDAS DO GLADE, NÃO REDIGITADAS. … o que tem dono
não se digita. Uma segunda cópia de um texto de tela diverge na primeira
edição."* E `_do_glade` (`:276-288`) faz `SystemExit` quando a âncora some.

**Consequência medida: apagar o `main.glade` quebra a aba Vibração da interface
NOVA, na importação, com `SystemExit` — não com um texto faltando.** É o oposto
do esperado de uma remoção de código morto.

O `storm_doctor.rotulo_do_botao` (`:54-70`) é mais macio — devolve o `se_faltar`
quando o glade não está ao alcance, *"uma frase que some é pior que uma frase
com um nome velho"* — mas passa a publicar o nome de reserva para sempre, sem
nada acusando.

E a aba 06 cita o glade como **fonte da faixa numérica** em prosa
(`interface/pacotes/a06_navegacao.py:2197` e `:2230`, `main.glade:79` e `:87`),
com `scripts/validar-referencias-docs.py` aceitando o sufixo (`:30-31`) — 334
citações de caminho já foram migradas uma vez nesta casa, e essas reprovam.

### E `app/telas/`, `app/widgets/` e os dois módulos de `gui/`

`app/telas/vibracao.py` é a camada que a aba 05 nova consome (a linha de
estado); `app/widgets/` tem nove arquivos (`controller_card.py`,
`mapa_da_mesa.py`, `painel_no_jogo.py`, `sensor_widgets.py`…) e `gui/` tem
`aba_conexoes.py`, `aba_sistema.py` e `ponte_da_tela.py` além do glade e do
`theme.css`. **Cada um precisa da mesma pergunta: quem chama isto hoje.** O
`fazer_grafos` responde em segundos e é o instrumento certo para esta leva.

---

## 3. A ORDEM, e cada passo é uma sprint

**Nenhum destes passos abre hoje.** A ordem é o produto deste arquivo.

### Passo 0 — a D-18 fecha primeiro

`A-DOCUMENTACAO-RETRATA-AS-DEZ-01`. Enquanto o `README.md` publicar as onze
fotos da janela, apagá-la deixa a vitrine do produto mostrando o que não existe.

**E há uma dependência mais dura, que é do portão:**
`tests/unit/test_a_documentacao_conhece_todas_as_abas.py` deriva a lista de abas
do **próprio `main.glade`** (`GLADE`, `:57`). Apagar o glade com esse portão
como está o deixa sem fonte — e um portão sem fonte não fica vermelho, fica
CEGO, que é pior. A D-18 é quem lhe dá dono novo.

**O que a D-18 já NÃO precisa fazer:** o `docs/usage/interface.md` foi declarado
registro datado da janela aposentada em 05/09/2026 (`:3-27`), com o de-para em
`docs/usage/A-JANELA-ANTIGA-o-que-mudou-de-lugar.md`. **Essa página sobrevive à
remoção da janela** — ela descreve um produto que existiu, e é assim que esta
casa trata documento inteiro que envelheceu: nota, não sumiço.

### Passo 1 — o INVENTÁRIO, e ele é só medição

Uma sprint que **não apaga uma linha**. Ela responde, arquivo por arquivo de
`app/`, `gui/` e `app/widgets/`: *quem chama isto — a janela, a interface nova,
ou os dois?* Saída: uma tabela versionada, com o comando de medição ao lado de
cada linha.

**A MORDIDA de uma sprint de inventário é o CONTRAEXEMPLO:** para cada arquivo
marcado *"só a janela"*, arranque-o (renomeie) e rode os lotes que tocam
`interface/`. Se ficarem verdes, a marcação está certa. Se um vermelho aparecer,
a marcação estava errada — e é esse vermelho a entrega.

### Passo 2 — desatar os DOIS leitores de glade que ficam

Antes de qualquer remoção:

* **`interface/aba05.py:273`** — os três textos precisam de dono novo. Ele não
  pode ser *"digitar de volta na aba"*: a razão contra isso está escrita ali e
  já custou uma vez (`rumble_actions.BTN_GIVE_BACK_TO_GAME`, RUM-01). O dono
  natural é o módulo que já é a fonte da linha de estado desta aba,
  `app/telas/vibracao.py`.
* **`integrations/storm_doctor.py:69`** — o rótulo do `btn_storm_fix_safe` e
  irmãos. O `storm_doctor` é integração, não janela; ele fica.

**A MORDIDA:** apague o `main.glade` numa árvore descartável e rode os lotes. A
aba 05 tem de continuar montando, e o `storm_doctor` tem de continuar dizendo o
nome CERTO do botão — não o de reserva. Um `se_faltar` que passa a valer para
sempre é o defeito silencioso desta sprint.

### Passo 3 — mudar de casa o que não é da janela

O `_x11_alcancavel` de `app/main.py`, e o que mais o inventário do Passo 1 achar. Cada
mudança leva a régua junto — `test_ambiente_presumido_01` acompanha o código,
não o arquivo.

### Passo 4 — os 62 arquivos de teste, um a um

**Não faça substituição em massa.** Esta casa pagou por isso em 05/09: das
dezoito réguas que casavam a tag do chip, **duas foram devolvidas** — uma falava
de um `<span>` que não era o da fita, e a outra teria tido a asserção INVERTIDA.
*Substituição em massa sobre uma régua é edição cega; cada uma tem de ser lida.*

Cada um dos 62 responde a uma de três perguntas: **(a)** mede a janela e sai com
ela; **(b)** mede o motor e fica, com o caminho trocado; **(c)** mede a
interface nova e nunca devia ter citado o glade.

### Passo 5 — a remoção, e o `pyproject.toml` por último

`app/app.py`, `gui/main.glade`, `gui/theme.css`, `scripts/gui-captura/retratar_abas.py`
e o que o inventário marcar. O `pyproject.toml:112` inclui `gui/*.glade` no
wheel; o `packaging/` e o `install.sh` também falam da janela
(`test_packaging_ativacao_deb.py:260`).

**A MORDIDA final é o `install.sh`:** `rc=0` numa árvore limpa, com o `doctor`
sem FALHA, e o lançador abrindo as dez abas. É a prova que esta casa já usa para
fechar dia (`ONDE PARAMOS` de 05/09, §7), e ela mede o produto instalado, não o
repositório.

---

## 4. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois — esta é a lista que a
leva inteira defende:

* **`app/actions/`, os 24 módulos.** Vinte são importados pela interface nova e
  **265 arquivos de `tests/`** os importam. É o motor, e ele não é a janela.
* **`app/ipc_bridge.py`** — `destinos_da_aplicacao` é o dono único da leitura de
  `aplicado_em`/`guardado_em`, e a aba 03 depende dele
  (`interface/pacotes/a03_gatilhos.py:2504-2550`).
* **`frase_do_desfecho`, de `app/textos_de_aplicacao.py`** — a frase do recibo da aba
  03 usa, *"a mesma que a barra da GTK usa"* (`a03_gatilhos.py:2613-2640`).
* **`app/telas/vibracao.py`** — a linha de estado da aba 05 nova.
* **`app/draft_config.py`** — `DraftConfig.from_profile` e os escritores por
  peça; a aba 02 grava som por ele (`a02_controles.py:2572`).
* **`app/constants.py`, `app/ambiente.py`, `app/mesa.py`, `app/theme.py`,
  `app/tray.py`, `app/usb_pai.py`, `app/mic_monitor.py`, `app/audio_saida.py`,
  `app/fatos_do_mapa.py`, `app/fala_do_mapa.py`, `app/alvo_de_edicao.py`** — o
  inventário do Passo 1 decide cada um. **Nenhum sai por presunção.**
* **`integrations/storm_doctor.py`** — integração, não janela. Fica, com outra
  fonte para o rótulo.
* **Os três textos de tela da aba 05.** Eles são a razão de o leitor de glade
  existir; se sumirem, a aba nova volta a deixar a usuária descobrir batendo com
  a cara (`interface/aba05.py:256-267`).
* **`scripts/i18n_extract.sh`** — a extração de tradução. Se o glade sair, ela
  precisa de outra fonte, ou o produto perde as strings traduzíveis da janela
  que ainda estiverem em uso.
* **`test_ambiente_presumido_01`** — a única régua do display inalcançável.
* **A história.** Apagar arquivo não apaga commit. Tudo o que sair é recuperável
  por SHA, e é isso que torna a remoção barata quando ela finalmente acontecer.

---

## 5. O QUE ESTE ARQUIVO **NÃO** É

* **Não é autorização.** A decisão dela, 05/09/2026, é *depois, em leva
  própria*. Este arquivo existe para que a leva não comece do zero quando ela
  disser "agora".
* **Não é o inventário.** O Passo 1 é o inventário, e ele não está feito. As
  quatro linhas de `app/actions/` sem chamador na interface nova estão
  **medidas**, não **classificadas** — e a diferença entre as duas coisas já
  custou a esta casa mais de uma leva.
* **Não mede `app/widgets/`, `app/telas/` nem os três `.py` de `gui/`.** Estão
  nomeados acima com a pergunta que falta, e nada além disso. **Não medido** é a
  resposta honesta hoje.
