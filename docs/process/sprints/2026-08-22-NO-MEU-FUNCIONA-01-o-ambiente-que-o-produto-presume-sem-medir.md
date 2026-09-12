---
sprint: NO-MEU-FUNCIONA-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# NO-MEU-FUNCIONA-01 — o ambiente que o produto presume sem medir

**22/08/2026.** Auditoria pedida por ela, com estas palavras:

> *"todas as nossas soluções provavelmente foram tão fechadas a ponto de
> considerarmos somente os nossos componentes locais (...) vai ficar pra sempre
> naquela de 'poxa, não sei pq não deu certo no seu pc, no meu funciona de
> boa'."*

**Frente desta página:** o **ambiente** — compositor, X11 contra Wayland,
systemd, Steam nativa contra Flatpak, kernel/DKMS, e as ferramentas externas.
Levantamento puro: nada foi consertado.

**Estado:** ABERTA

---

## A régua de cada linha

*Ausente esta coisa, o produto DIZ que está sem ela, ou finge que está tudo
bem?* Silêncio é o defeito; degradar com voz é entrega.

Grau de cada achado: **MEDIDO** (rodei e vi), **LIDO** (está no código, não
exercitei), **SUSPEITO**.

**Oito achados: quatro MEDIDOS (A1–A4) e quatro LIDOS (A5–A8)**, sustentados
por nove medições rodadas nesta bancada. A ordem é por **custo do silêncio** —
o que quebra calado primeiro.

---

## A boa notícia, medida primeiro

A hipótese dela é verdadeira em pedaços do produto, **e falsa em outros**, e a
diferença importa porque diz onde NÃO gastar tempo:

| Área | O que achei |
|---|---|
| Gerenciador de pacotes | `install.sh` cobre apt/dnf/pacman desde a DEPS-UNIVERSAIS-01 e **reconfere pelo EFEITO** (`install.sh:770-779`) — nome de pacote errado não passa por instalado |
| Teclado na tela | escolhe o binário **pela sessão viva**, e um L3 sem teclado vira notificação, não silêncio (`daemon/subsystems/keyboard.py:84-108`) |
| Detector de janela cego | tem frase em português na aba Sistema, com o motivo traduzido (`app/actions/daemon_actions.py:117`) |
| DKMS | headers ausentes, Secure Boot e `/usr/src` intocável viram aviso e o in-tree continua |
| Sem systemd | escopo declarado (ADR-009), e o erro nomeia a ADR (`daemon/service_install.py:196-200`) |
| Saída traduzida do `pactl` | `LC_ALL=C` em todos os quatro pontos |

O que segue são os buracos.

---

## A1 — a Steam Flatpak: o produto afirma o CONTRÁRIO da verdade ● MEDIDO

**O achado mais caro da varredura**, porque a Steam Flatpak é a Steam padrão de
Fedora Silverblue, Bazzite e boa parte de Fedora/Arch — e porque a resposta do
produto não é omissão, é afirmação falsa.

Montei uma casa com **só** a Steam Flatpak (`/tmp/fpk/.var/app/com.valvesoftware.Steam/…`)
e apertei o caminho do botão "Aplicar aos jogos da Steam":

```
resultado : {'applied': [], 'skipped': [{'vdf': '…/localconfig.vdf',
                                         'appid': '', 'reason': 'sandbox'}],
             'errors': []}

TOAST     : Nada a mudar — os jogos já abrem pelo hefesto-launch (ou não
            encontrei jogos da Steam neste computador). 1 jogo(s) ficaram
            como estavam.
```

O `reason: "sandbox"` — o ÚNICO fato que explica tudo — é jogado fora por
`format_apply_wrapper_result` (`app/actions/daemon_actions.py:222-231`), que só
conta quantos. A pessoa lê **"os jogos já abrem pelo hefesto-launch"**, que é o
oposto do que aconteceu. E "1 jogo(s) ficaram como estavam" conta uma
BIBLIOTECA inteira como um jogo (o item pulado tem `appid` vazio).

**O mesmo texto, o mesmo defeito, na lane do Proton:**
`app/actions/daemon_actions.py:642-646` — *"Nada a mudar — os jogos já estão no
Proton validado"*.

**Três elos silenciosos por baixo:**

| Onde | O que faz | Grau |
|---|---|---|
| `integrations/proton_pin.py:153` (`default_steam_root`) | devolve `~/.steam/steam` **inexistente**; a biblioteca Flatpak não é nem procurada | MEDIDO |
| `integrations/steam_launch_options.py:654` (`appid_needs_wrapper`) | `if not eligible: return False` — sem vdf elegível, o lembrete "1x por jogo" **nunca aparece** | MEDIDO |
| `integrations/steam_launch_options.py:1136` (`nome_do_appid`) | devolve `None`: os jogos ficam sem nome na tela | MEDIDO |

Medido na mesma casa falsa:

```
raiz steam        = /tmp/fpk/.steam/steam | existe: False
pastas_steamapps  = ['/tmp/fpk/.steam/steam/steamapps']
nome_do_appid     = None
appid_needs_wrapper = False
```

**Meia voz existe, e só no terminal.** A sentinela nomeia o pulo:

```
[sentinela-wrapper] vdf sandbox (pulado): …/localconfig.vdf
[sentinela-wrapper] nada a avisar: todo jogo elegível tem o wrapper
```

Ela diz o fato **e** fecha com uma frase que, para quem só tem a Flatpak, é uma
mentira por vacuidade: zero elegíveis, logo "todos" têm o wrapper.

**A doutrina que produz o silêncio está escrita** em
`integrations/sentinela_do_wrapper.py:329-331`: *"vdf de Flatpak/Snap é pulado
inteiro (lá o wrapper do host é invisível, então 'não tem wrapper' é o estado
CERTO, não um defeito)"*. Isso é verdade sobre o ARQUIVO e falso sobre a
PESSOA: para ela o estado certo é *"o Hefesto não alcança a sua Steam"*.

**Isto quebraria na máquina de outra pessoa?** Quebra, e sem ruído: quem instala
por Flatpak nunca fica sabendo que a metade do produto que depende do wrapper e
do Proton pinado não vale para ela.

---

## A2 — a janela some numa bandeja que não existe, fora do COSMIC ● MEDIDO

`app/app.py:491` (`_has_persistent_access`) decide se fechar a janela **esconde**
ou **encerra**. O docstring dele diz o motivo certo: *"sem ele, esconder a
janela deixaria o app inacessível"*. O código só pergunta no COSMIC:

```python
if _desktop_is_cosmic():
    return statusnotifierwatcher_available()
return True                      # app/app.py:508
```

Medido, com o ambiente limpo:

```
probe_gi_availability() = (True, 'ok via AyatanaAppIndicator3')
GNOME, watcher AUSENTE -> _has_persistent_access = True
```

`is_available()` (`app/tray.py:163`) responde *"a biblioteca importa"*, não *"o
ícone aparece"*. No **GNOME de fábrica** — que não tem bandeja sem extensão —, e
em Sway/i3/Hyprland sem módulo de tray, o "X" da janela a esconde num lugar que
não existe. O gate é o mesmo em `app/tray.py:258`: a sonda do watcher e a
notificação que explicaria tudo **só são agendadas no COSMIC**.

Medido com `env -i`, para não contaminar com a sessão viva:

```
         GNOME -> _desktop_is_cosmic = False
  ubuntu:GNOME -> _desktop_is_cosmic = False
           KDE -> _desktop_is_cosmic = False
          sway -> _desktop_is_cosmic = False
        COSMIC -> _desktop_is_cosmic = True
```

**Recuperável, mas por acidente:** relançar a GUI manda `SIGUSR1` ao processo
antigo e a janela volta (`app/app.py:153`). Ninguém disse isso a ela.

A seção "A janela" da aba Configurações (22/08) **já sabe** a frase certa para o
GNOME (`app/ambiente.py:145-151`). Ela só é lida por quem abre aquela aba — e
quem perdeu a janela não tem como abrir aba nenhuma.

---

## A3 — no COSMIC sem XWayland, a janela não abre, e a culpa é da nossa cura ● MEDIDO

`app/main.py:14` (`_force_xwayland_on_cosmic`) força `GDK_BACKEND=x11` em toda
sessão COSMIC, **sem conferir se existe `DISPLAY`**, e roda no topo do módulo
(`app/main.py:105`), antes de qualquer coisa.

Medido em par, com o Wayland vivo desta bancada e sem `DISPLAY`:

```
COSMIC sem XWayland (a cura ligada):  GDK_BACKEND=x11   Gtk.init_check -> False
mesma sessão, com o opt-out ligado:   GDK_BACKEND=None  Gtk.init_check -> True
```

**O Wayland funcionava.** Quem impede a janela de abrir é o `x11` que nós
escrevemos. A saída existe — `HEFESTO_DUALSENSE4UNIX_NO_XWAYLAND=1` — e não é
nomeada em lugar nenhum do caminho de erro: `app/main.py:256` imprime
`"Falha ao iniciar GUI Hefesto - DualSense4Unix: {exc}"` e mais nada.

**Isto quebraria na máquina de outra pessoa?** Em qualquer COSMIC sem XWayland
instalado ou ligado (NixOS monta assim com facilidade), e em qualquer sessão
onde o XWayland morreu. O sintoma é o pior possível: o produto não tem cara.

---

## A4 — o backend de janela é escolhido pela PRESENÇA de `DISPLAY`, e nunca reconsidera ● MEDIDO

`integrations/window_detect.py:182` (`detect_window_backend`) decide uma vez, por variável de
ambiente. Medido nos quatro casos:

| Ambiente | Backend escolhido |
|---|---|
| `DISPLAY` + `WAYLAND_DISPLAY` | `XlibBackend` |
| só `WAYLAND_DISPLAY` | `_WaylandCascadeBackend` (portal) |
| só `DISPLAY` | `XlibBackend` |
| nenhum | `NullBackend` (avisa uma vez) |

**Consequência (LIDO):** `has_x11` é verdadeiro em TODA sessão Wayland moderna,
porque o XWayland está de pé. Logo o **portal XDG — que é o caminho que
FUNCIONA no GNOME 46+** — nunca é tentado por quem tem GNOME ou KDE em Wayland.
O produto fica vendo só o que passa pelo XWayland, exatamente como aqui.

E não há volta: a auto-cura de `daemon/subsystems/autoswitch.py:122` só dispara
quando o backend é `"null"` — um `xlib` cego há vinte minutos nunca é
reconsiderado. Some-se `daemon/subsystems/autoswitch.py:102`, que nasce declarando
`initial_healthy = initial_backend == "xlib"`.

**Não é silêncio total**, e é justo dizer: `descrever_deteccao_de_janela`
(`app/actions/daemon_actions.py:117`) escreve a frase honesta na aba Sistema, e
o `doctor.sh:2178` dá o veredito *"DEGRADADO — só XWayland"*. O defeito é o
produto **não tentar o caminho que funciona**, não o de não falar.

---

## A5 — a extensão do GNOME que o produto nomeia é só a do Ubuntu ○ LIDO

Seis lugares nomeiam **um** id, e é o da família Ubuntu:

- `install.sh:3257` — `_ext_id="ubuntu-appindicators@ubuntu.com"`
- `app/ambiente.py:148` — a frase da aba Configurações
- `docs/usage/instalacao.md:19`, `docs/usage/interface.md:795`,
  `docs/usage/troubleshooting.md:147`, `docs/usage/troubleshooting.md:154`

Fedora e Arch entregam a extensão de origem
(`appindicatorsupport@rgcjonas.gmail.com`), que **não aparece uma vez** no
repositório. (Do Debian não afirmo nada: não conferi qual das duas ele empacota.) Numa Fedora GNOME com a extensão certa instalada e ligada, o
install avisa *"extension ubuntu-appindicators@ubuntu.com não instalada"* e
manda a pessoa instalar o que ela não precisa.

**Não medi numa Fedora.** É leitura de código somada ao id ser conhecidamente de
pacote Ubuntu/Debian; quem tiver a máquina confirma em trinta segundos com
`gnome-extensions list`.

---

## A6 — "DE X renderiza Ayatana nativamente" é afirmação que ninguém mediu ○ LIDO

`install.sh:3253`:

```
DE %s renderiza Ayatana nativamente — sem ação
```

É verdade no KDE e no COSMIC com o applet ligado. É falso no Sway, no i3, no
Hyprland e no river sem módulo de bandeja. O install afirma sobre o sistema da
pessoa uma coisa que não conferiu — e é exatamente o que `app/ambiente.py:127`
(`mensagem_da_bandeja`) já resolveu do jeito certo, no mesmo dia, três diretórios
adiante: *"neste ambiente o Hefesto não sabe dizer o motivo"*.

---

## A7 — a cura do DKMS fala apt em toda distro ○ LIDO

`scripts/dkms_lib.sh:269` e `scripts/dkms_lib.sh:273`:

```
dkms ausente — … cure com: sudo apt install dkms
headers do kernel … ausentes — … cure com: sudo apt install linux-headers-<kver>
```

O aviso está certo, o fail-safe está certo, e a **instrução manda a pessoa da
Fedora digitar um comando que não existe**. A casa já tem o tradutor — o `comando_manual_pkg` de `install.sh:584` e a
cascata de `doctor.sh:3740-3744` —, e a `dkms_lib.sh` é uma lib solta que não o
alcança.

---

## A8 — `_DIRS_PIPEWIRE` cobre três caminhos e nenhum é ARM ○ LIDO

`integrations/dualsense_bt_audio.py:1243` lista
`/usr/lib/x86_64-linux-gnu/pipewire-0.3`, `/usr/lib64/…` e `/usr/lib/…`. Num
Debian/Ubuntu ARM (Raspberry Pi, e o `install.sh:416` aceita `raspbian`) o
caminho é `/usr/lib/aarch64-linux-gnu/pipewire-0.3`. Custo pequeno — só o campo
`pipe_source` do diagnóstico —, cura de uma linha com glob.

---

## Entregas

Cada uma é independente. A ordem é a do custo.

### E1 — o pulo por sandbox vira frase, nas duas lanes

`format_apply_wrapper_result` e o gêmeo do Proton passam a **ler o `reason`**, e
não só contar. Quando todo vdf foi pulado por `sandbox`, a frase deixa de ser
"Nada a mudar" e passa a dizer que a Steam é Flatpak/Snap e que o wrapper do
host não entra lá.

E `appid_needs_wrapper` deixa de responder `False` para duas perguntas
diferentes ("já tem" e "não alcanço").

**Prova:** teste que morde com a casa falsa de Flatpak — arrancar a leitura do
`reason` faz o teste reprovar.
**Custo:** meia hora. Duas funções puras, já testáveis sem GTK.

### E2 — a bandeja pergunta antes de esconder a janela, em todo ambiente

`_has_persistent_access` deixa de ter caminho que devolve `True` sem perguntar:
a sonda do watcher passa a valer em qualquer ambiente, e o COSMIC continua com o
adiamento dele por causa da corrida do applet. O gate de `app/tray.py:258` sai
junto — a notificação "a bandeja não recebe o ícone" vale no GNOME e no Sway
tanto quanto no COSMIC, e a frase certa já existe em `app/ambiente.py:127`.

**Cuidado medido:** `statusnotifierwatcher_available` custa até 2 s de D-Bus
(`app/actions/config/secao_janela.py:252-254`). No caminho de fechar a janela
isso precisa de cache, não de chamada síncrona.

**Prova:** o teste do E2 chama a função com um watcher ausente declarado e
espera `False` nos quatro ambientes.
**Custo:** duas horas, sendo a maior parte o cache.

### E3 — a cura do XWayland confere se há XWayland

`_force_xwayland_on_cosmic` só força quando `DISPLAY` existe. Sem ele, não
força, loga o motivo, e a sessão sobe em Wayland nativo — que foi medido
funcionando nesta bancada.

**Prova:** o par medido do A3 vira teste (a função com `DISPLAY` ausente não
mexe no `GDK_BACKEND`).
**Custo:** quinze minutos. Três linhas.

### E4 — o detector tenta o portal quando o xlib está cego há tempo demais

Hoje `xlib` é escolha final. A entrega é uma **degradação com volta**: depois de
N segundos sem leitura útil com motivo `sem_foco_x`, o leitor tenta a cascata
portal → wlrctl no mesmo tick e adota quem responder. O `window_detect_backend`
já é dinâmico na cascata; o que falta é o `xlib` poder sair.

**Isto é decisão dela**, e o preço está na mesa: um portal que responde no GNOME
resolve o perfil-por-jogo de quem usa janela nativa; um portal que não responde
custa uma tentativa por ciclo. **Não implementar sem a palavra dela.**
**Custo:** meio dia, e mais um ensaio para escolher o N.

### E5 — a extensão do GNOME passa a ser DUAS, e o install confere as duas

`ubuntu-appindicators@ubuntu.com` e `appindicatorsupport@rgcjonas.gmail.com`,
nos seis lugares. O install dá "já habilitada" se **qualquer uma** das duas
estiver ligada.

**Prova:** portão de redação que cobra os dois ids nos seis arquivos, como o
`check_packaging_parity.sh` já faz com os nomes do teclado na tela.
**Custo:** uma hora, e a maior parte é a documentação.

### E6 — as duas frases que afirmam sem medir

`install.sh:3253` deixa de dizer que o DE desconhecido renderiza Ayatana e passa
a dizer o que o `mensagem_da_bandeja` já diz. `dkms_lib.sh:269,273` ganham a
cascata apt/dnf/pacman de `doctor.sh:3740-3744`.

**Custo:** vinte minutos as duas.

### E7 — o glob do PipeWire

Uma linha, com `glob("/usr/lib/*/pipewire-0.3")` ao lado dos três fixos.
**Custo:** dez minutos.

---

## O que é decisão dela

1. **A E4** (o detector voltar atrás) — é a única que muda comportamento em
   regime, e o preço é uma tentativa a mais por ciclo.
2. **A Steam Flatpak é escopo?** Hoje o produto a detecta e se recusa a escrever
   nela, e a recusa é a decisão certa (DEDUP-04). A pergunta aberta é outra:
   **dizer**, ou continuar quieto? A E1 assume que é dizer.
3. **O GNOME de fábrica é alvo?** A E2 custa duas horas se for; se não for, a
   resposta honesta é a janela fechar em vez de esconder, o que a E2 também
   entrega.

---

## O que tentei medir e não consegui

- **GNOME, KDE e Sway de verdade.** Não há segunda máquina nem VM nesta bancada.
  Tudo que está marcado MEDIDO foi medido **injetando o ambiente** (variáveis,
  `env -i`, casa falsa em `/tmp`) — o que prova o CAMINHO do código, não a
  sessão inteira. Os graus refletem isso.
- **Fedora com a extensão de origem.** O A5 é leitura; falta a confirmação numa
  máquina Fedora.
- **Distribuição imutável (Silverblue, SteamOS).** Li o caminho do DKMS e ele é
  fail-safe com aviso; não rodei. Fica SUSPEITO até alguém instalar lá.

## Os falsos positivos que descartei

Auditoria sem descarte é auditoria que não filtrou. Estes doze pareciam achado e
não são:

| O que parecia | Por que não é |
|---|---|
| `install.sh` só-apt | falso desde a DEPS-UNIVERSAIS-01: apt/dnf/pacman, e **reconfere pelo efeito** (`install.sh:770-779`), então nome de pacote errado morre com `die` em vez de passar |
| a cura do teclado na tela no `doctor.sh` fala apt | está DENTRO de uma cascata apt/dnf/pacman (`doctor.sh:3740-3744`) |
| `wmctrl` sem guarda | tem `shutil.which` — o meu grep errou porque o nome é constante (`integrations/steam_launcher.py:82`) |
| `xdotool` sem guarda | pega `FileNotFoundError` (`app/app.py:135`) e cai para o SIGUSR1 de `app/app.py:153` |
| `udevadm` em `evdev_reader` | não chama binário nenhum: lê `/run/udev/data` direto, e diz por quê (`core/evdev_reader.py:283-285`) |
| `rfkill` sem guarda em `radio_da_mesa` | o casamento do grep era num comentário |
| saída do `pactl` em português | `LC_ALL=C` nos quatro pontos, e a medição que originou a cura está datada em 15/08 |
| sem systemd | escopo declarado (ADR-009) e o erro **nomeia a ADR** (`daemon/service_install.py:196-200`) |
| teclado na tela presumido | escolhe pela sessão viva, cacheia com prazo e **notifica** quem apertou o L3 sem ter o programa |
| Secure Boot / sem headers / `/usr/src` intocável | os três avisam e seguem com o módulo in-tree |
| `jeepney` ausente vira "sem bandeja" | `jeepney` é dependência declarada (`pyproject.toml:75`) e o install a instala sempre |
| a leitura do ambiente concatena as duas variáveis sem separador (`app/main.py:34-36`, `install.sh:315`) | nenhum par real de valores produz falso casamento, e `app/tray.py:92-97` já une com `:`. **O alarme era do meu instrumento:** medi `KDE -> True` porque o `XDG_SESSION_DESKTOP=cosmic` da sessão viva vazou para o subprocesso. Refeito com `env -i`, dá `False`. Nesta casa o instrumento mente mais que o produto, e mentiu de novo |

---

*"No meu funciona" é sempre verdade. O que o produto precisa é de uma frase para
quando não funciona no da pessoa.*
