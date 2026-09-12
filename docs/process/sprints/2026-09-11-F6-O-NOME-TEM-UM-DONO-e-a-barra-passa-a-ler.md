---
sprint: F6-O-NOME-TEM-UM-DONO
estado: feita
onda: A-FILA-DE-0911
posse:
  F6-O-NOME-TEM-UM-DONO:
    - src/hefesto_dualsense4unix/utils/identidade.py
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
    - src/hefesto_dualsense4unix/interface/ver.py
    - src/hefesto_dualsense4unix/app/tray.py
    - src/hefesto_dualsense4unix/integrations/tray.py
    - src/hefesto_dualsense4unix/integrations/desktop_notifications.py
    - src/hefesto_dualsense4unix/tui/app.py
    - src/hefesto_dualsense4unix/cli/cmd_status.py
    - src/hefesto_dualsense4unix/cli/cmd_profile.py
    - scripts/check_a_grafia_do_nome.py
    - scripts/aplicar_a_grafia_do_nome.sh
    - scripts/preview_glyphs.py
    - tests/unit/test_portao_a_grafia_do_nome_morde.py
cria:
  - scripts/check_a_grafia_do_nome.py
  - scripts/aplicar_a_grafia_do_nome.sh
  - tests/unit/test_portao_a_grafia_do_nome_morde.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
  - src/hefesto_dualsense4unix/interface/calibrar.py
  - src/hefesto_dualsense4unix/interface/mapa.py
---

# F6 — O NOME TEM UM DONO, e a barra passa a ler

**11/09/2026.** O produto se chama **`DualSense4Unix`**: o `S` é do DualSense,
o aparelho que lhe dá nome. `utils/identidade.py` escrevia esse `S` em
minúscula, e a grafia errada se repetiu em **427 linhas de 174 arquivos** —
tela, documento, comentário, `.desktop`, AppStream, `.po`.

Ordem dela: *"ok"*.

---

## §1 — O NÚMERO, e ele se divide em duas naturezas

| | linhas | o que é |
| --- | ---: | --- |
| **viraram `DualSense4Unix`** | **226** | o nome do produto **em texto** |
| **ficaram com a grafia velha** | **201** | **identificador técnico** — alguém de fora casa letra por letra |

As 201 que ficaram — 169 de `wm_class`/app-id, 28 de nó uinput e 4 isenções declaradas — se dividem em quatro, e **cada uma tem o estrago medido**.
Nenhuma dá erro se trocada: dá **silêncio**, que é o que esta casa mais paga.

| o quê | onde vive | o que quebraria |
| --- | --- | --- |
| `Hefesto-Dualsense4Unix` (hífen, sem espaço) | `identidade.wm_class`, `StartupWMClass=` e `Icon=` do `.desktop` **já instalado na máquina dela**, `last_class` no estado do daemon, `window_class` nos perfis de jogo, nomes de `.AppImage`/`.png`/`.flatpak` | o ícone some da dock (o `StartupWMClass` deixa de casar o que a janela publica), o **perfil por janela para de trocar sozinho**, e o `park` de janela erra o alvo |
| `com.vitoriamaria.HefestoDualsense4Unix` | app-id do Flatpak, nome-base do `.desktop` e do ícone no `hicolor` | id novo = **outro app**: a atualização do Flatpak instalado quebra e os perfis dentro do sandbox mudam de pasta |
| `… pad (Hefesto - Dualsense4Unix virtual)` e o Pro Controller | o nome que o nó **uinput** publica no kernel | **jogos sob Proton casam por SUBSTRING do nome** (é a razão escrita em `test_a_marca_do_vpad_no_nome_e_a_de_hoje.py`): as amarrações que a pessoa já salvou por nome de aparelho, em Steam e em cada jogo, deixam de casar |
| `Hefesto - Dualsense4Unix Virtual Keyboard` · `… Virtual Mouse+Keyboard` | os dois nós uinput de teclado e mouse | o compositor guarda configuração **por nome de dispositivo**: a dela volta ao padrão, sem aviso |

**É a ordem dela que decide as quatro:** *"a ideia é que todas as features mesmo
do app funcionem nao so pra mim mas pra qualquer outro user"*. <!-- noqa-acento: citação literal dela -->
Uma renomeação dessas não quebra quem instala hoje — quebra **quem já tem**, e
em silêncio. Por isso o passo 1 foi medir, não trocar.

**E duas coisas ficaram de fora por não serem o nome do produto:**
`LinuxAudio4Dualsense5` e `Pico_W-Dualsense` são **projetos de outras pessoas**;
as citações literais dela (*"Modo Nativo (Dualsense da Forma como veio ao
Mundo)"*) não se limpam, que é a regra da casa. <!-- noqa-acento: citação literal dela -->

## §2 — O DONO, e a barra passou a perguntar

`identidade.HEFESTO.nome_longo` virou **`Hefesto — DualSense4Unix`** — com
travessão, que é a string **exata** que a barra mostra e que o `<h1>` das dez
páginas já dizia. O dono carrega o que a tela precisa, inteiro; quem mostra
**lê**.

As duas linhas que a onda da língua curou hoje nasceram com o nome DIGITADO, e
a dívida estava escrita ao lado: *ler do dono poria a grafia errada na barra
dela*. Fechada a grafia, as duas passaram a ler:

| antes | agora |
| --- | --- |
| `ponte_da_tela.py:422` `titulo: str = "Hefesto — DualSense4Unix"` | `titulo: str = _CASA.nome_longo` |
| `ver.py:194` `barra.set_title("Hefesto — DualSense4Unix")` | `barra.set_title(identidade.atual().nome_longo)` |

**E mais nove lugares que digitavam em vez de perguntar** passaram a ler:
bandeja (`app/tray.py`, `integrations/tray.py`), notificação de desktop, a TUI
(título e cabeçalho), as duas tabelas da CLI (`status`, `profile`) e o
`preview_glyphs.py`.

**O QUE **NÃO** PASSOU A LER, e a razão é do gettext:** os quatro literais
dentro de `_()` em `app/tray.py` continuam literais — o `msgid` é a **chave** de
tradução, e `xgettext` só extrai constante. Trocá-los por uma expressão
apagaria as traduções. Os `.po`/`.pot` foram corrigidos junto, msgid e msgstr, e
os `.mo` recompilados por `scripts/i18n_compile.sh`.

## §3 — O PORTÃO, e ele tem DUAS peneiras de propósito

`scripts/check_a_grafia_do_nome.py` — `rapido|grafia-do-nome`, no `portoes.sh` e
no `ci.yml`.

1. **A GRAFIA.** Nenhuma ocorrência da grafia errada em arquivo versionado,
   fora dos quatro identificadores técnicos e das isenções declaradas com a
   razão. A listagem é `git ls-files --cached --others --exclude-standard`:
   portão é cego a arquivo novo, e esta casa já pagou por isso.
2. **O DONO.** A moldura (`ponte_da_tela.py`, `ver.py`) tem de **ler**
   `nome_longo`. Um literal do nome dentro de `set_title`/`set_subtitle`
   reprova **mesmo com a grafia certa** — porque a grafia certa digitada em dois
   lugares é a próxima divergência esperando acontecer. **Foi assim que esta
   casa chegou aos 427.**

**Uma sozinha daria verde sobre o defeito da outra.**

**A MORDIDA** — `tests/unit/test_portao_a_grafia_do_nome_morde.py`, 8 nós:
a grafia errada reprova; o arquivo **novo sem `git add`** reprova; a moldura que
DIGITA o nome reprova com a grafia certa; a moldura que **some** reprova (régua
que mede arquivo inexistente mede o mundo de ontem); e — a metade que uma régua
barulhenta erraria — **os seis identificadores técnicos passam**. Uma régua que
reprovasse o `wm_class` empurraria a próxima pessoa a sumir com o ícone da dock.

## §4 — A CURA É REPRODUTÍVEL, e isso é para quem costura

Quatro frentes editavam a árvore ao mesmo tempo que esta, e a grafia está em
174 arquivos: é certo que a costura traga texto novo com a grafia velha. Por
isso a cura é **versionada e idempotente**:

```bash
bash scripts/aplicar_a_grafia_do_nome.sh      # a segunda corrida não muda um byte
python3 scripts/check_a_grafia_do_nome.py     # e confere
```

Ela é uma expressão só, e cada guarda protege **um** identificador técnico:

```
perl -CSD -pi -e 's/(?<![-\w])Dualsense4Unix(?! Virtual )(?! virtual\))/DualSense4Unix/g'
        │                      │              │
        │                      │              └─ o nó uinput do gamepad e do Pro Controller
        │                      └──────────────── os nós uinput de teclado e mouse
        └─ `Hefesto-Dualsense4Unix` (wm_class, arquivos) e `HefestoDualsense4Unix` (app-id)
```

A régua e a cura usam **a mesma expressão**, de propósito: se discordassem sobre
o que é texto e o que é endereço, uma das duas estaria medindo outra coisa.

## §5 — A PROVA

* **A barra, aberta e fotografada** — `Gtk.Window` + `HeaderBar` num `Xvfb`
  próprio (`tela_de_mentira`; a tela dela não recebeu nada). Os dois caminhos —
  o de `ver.py` e o de `JanelaDaAba` — devolvem, do widget VIVO,
  `'Hefesto — DualSense4Unix'`, e o `<h1>` da página dentro da janela diz o
  mesmo. **Lido do widget, não do fonte.**
* **59 portões verdes**, com `git add -A` antes.
* `bash scripts/aplicar_a_grafia_do_nome.sh` rodado duas vezes: zero diferença
  na segunda.

## §6 — O QUE VI E NÃO CUREI

Nada de lógica foi tocado nos arquivos das outras quatro frentes — só a grafia,
como a coordenação mandou. Nenhum defeito novo apareceu no caminho.
