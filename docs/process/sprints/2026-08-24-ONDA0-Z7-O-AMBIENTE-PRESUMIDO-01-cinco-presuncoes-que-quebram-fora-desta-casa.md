---
sprint: ONDA0-Z7-O-AMBIENTE-PRESUMIDO-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# ONDA 0 · Z7 — O AMBIENTE PRESUMIDO 01: cinco presunções que quebram fora desta casa

| | |
|---|---|
| **Escrita em** | 23/08/2026, 22h25–23h05. Para executar em 24/08, branch `dev` |
| **Grau** | **MEDIDO** em tudo que tem comando ao lado (§3.1 a §3.7, medido na bancada dela HOJE, depois do commit `c111d74`). **COMPILAÇÃO** (leitura de fonte com endereço, sem execução) em T-06, T-10 e T-13. **DESENHO** na coreografia, no custo e nas frases de tela |
| **Frente** | **Z7 — o ambiente que o produto presume.** Onda 0, a das invariantes. Não é aba: é a régua que vale para as cinco abas de §5 |
| **Corre** | **em paralelo com todas.** Mas **nenhuma onda de aba fecha com "funciona" antes dela** — o que ela mediria é a bancada dela ([SPRINT_ORDER §0.2](../SPRINT_ORDER.md)) |
| **Agentes** | **4**, como a linha da tabela 0.2 manda. Posse de arquivo em §4 |
| **Régua de tela** | [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md). Carimbo de classe (D3) em cada tarefa |
| **Regência** | [COMO-REGER-AGENTES.md](../COMO-REGER-AGENTES.md) — R1 (posse), R2 (a suíte é de quem coordena), R4 (foto e portão no fim) |

**O que esta sprint fecha:** as treze tarefas de §6, e com elas o defeito de forma
**F8** do [ONDE-PARAMOS de 23/08](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md)
(lá chamado **F8**), que aquele documento classifica como *"o defeito que mais
separa o produto da 0.9.5 liberável"*.

**O que ela NÃO faz:**

* **não mede Bluetooth** — trilha dela com o assistente (D2). O que a medição de
  rádio bloqueia nesta frente está em §7, e é regra para o executor;
* **não conserta aba nenhuma.** Z7 entrega funções puras, portões e primitivas.
  A fiação na tela é da onda da aba, e cada gancho está nomeado com arquivo e
  linha em §6;
* **não reescreve `install.sh` nem empacotamento.** O teclado na tela já é
  instalado em todo formato pelo `scripts/install_osk.sh` (medido, §3.6) — isso é
  cura viva e **não se refaz**;
* **não apaga a mesa dela.** Os quatro registros sintéticos achados no
  `controllers.json` de produção (§3.3) são **decisão dela** apagar ou não; Z7
  entrega o portão que impede o próximo.

---

## 1. O defeito, em uma frase

**O Hefesto foi escrito para a máquina de uma pessoa só, e neste instante ele
está quebrado até nela: a janela do programa não abre, a troca de perfil por
jogo está cega, e o produto responde "estou bem".**

---

## 2. Por que esta frente vem antes das abas

Cinco abas dependem de Z7 na tabela 0.3 do `SPRINT_ORDER.md` — **Início,
Emulação, Perfis, Navegação e Sistema**. O que muda em cada uma:

| aba | o que Z7 decide antes de ela poder afirmar qualquer coisa |
|---|---|
| **Início** (Onda 2) | a linha "trocar de perfil ao abrir o jogo" é a promessa central da aba. Hoje o daemon diz `healthy=true` e o detector nunca viu uma janela sequer (§3.1). Sem Z7, a Início escreve a própria versão da frase sobre um valor que mente |
| **Sistema** (Onda 11) | é a aba que declara *"a máquina está saudável para jogar"*. Ela **já** lê o par honesto `seeing`+`reason` — mas quem DECIDE no daemon continua sendo o `healthy` mentiroso. Duas verdades sobre o mesmo fato, na mesma janela |
| **Emulação** (Onda 5) | o cartão da Steam ficou certo com o F8 (§3.4), mas o botão "Travar Proton validado" ainda cala em três dos quatro layouts (§3.5). A aba não pode oferecer um botão que não tem como funcionar sem dizer por quê |
| **Navegação** (Onda 10) | o L3 é o **único** caminho do produto para escrever uma letra. Ele depende de um programa externo, o daemon sabe se ele existe, e **nenhuma tela lê esse campo** (§3.6). A aba não pode montar a legenda antes de saber quais programas o produto conhece |
| **Perfis** (Onda 6) | a pasta de perfis sai de `config_dir()`. Enquanto o `XDG_CONFIG_HOME` for honrado em uns lugares e ignorado em outros (§3.2), "onde meus perfis moram" tem duas respostas |

**E a consequência de ordem que faz Z7 ser Onda 0 e não Onda 13:** as cinco abas
acima levam **texto de tela** sobre o ambiente. Texto de tela é carimbo
estrutural (D3) e precisa do olho dela. Se as cinco escreverem cinco versões da
mesma frase, ela revisa cinco vezes o mesmo assunto — e as cinco divergem, que é
exatamente o defeito **F5** (oito pares de abas com duas verdades).

---

## 3. O que está MEDIDO

Tudo abaixo foi medido **na bancada dela, em 23/08/2026 entre 22h28 e 22h40**,
na árvore de trabalho de agora (`c111d74`). Régua declarada em cada bloco. O
daemon ficou **ligado o tempo inteiro** — nada aqui exigiu pará-lo.

> **A bancada de agora, e ela não é a do briefing.** `controller.list` devolve
> **uma** entrada, `connected: false`. Nenhum DualSense vivo às 22h33. É a mesma
> advertência do `SPRINT_ORDER §0.1`: *"nenhum número desta leva sobre 2 ou 4
> controles é medição viva"*. Nada nesta sprint depende de controle na mesa.

### 3.1 O detector de janela está cego há horas, e o daemon diz que está bem

```sh
$ journalctl --user -u hefesto-dualsense4unix --since "30 min ago" \
    | grep -c x11_connect_failed
60
$ journalctl --user -u hefesto-dualsense4unix --since "6 hours ago" \
    | grep -c x11_connect_failed
716
```

Uma falha a cada 30 s, ininterrupta. O erro literal, do journal das 22h28:

```
[warning] x11_connect_failed  err='Can\'t connect to display ":1": [Errno 111] Conexão recusada'
```

E o que o daemon publica sobre si mesmo, no mesmo instante
(`daemon.status` pelo socket IPC):

```
window_detect_backend        = xlib
window_detect_healthy        = True      <- a mentira
window_detect_last_class     = None      <- NUNCA houve leitura útil
window_detect_current_class  = unknown
window_detect_useful_age_sec = None      <- nunca, nem uma vez, desde o boot
window_detect_seeing         = False
window_detect_reason         = sem_conexao_x
```

**`healthy=True` com `useful_age_sec=None`.** Não é uma flag que subiu e não
desceu: é uma flag que **nunca teve o direito de subir**. A causa está escrita
como contrato, em `daemon/subsystems/autoswitch.py:102`:

```python
initial_healthy = initial_backend == "xlib"
```

e o comentário duas linhas acima diz o porquê: *"xlib só é escolhido com DISPLAY
presente"*. A presunção era razoável em 2026-07 e **é falsa nesta máquina**:
`DISPLAY=:1` está presente no ambiente do daemon (medido em `/proc/<pid>/environ`)
e não há nada escutando lá.

```sh
$ ls /tmp/.X11-unix/            # o socket existe...
X0  X1
$ for d in :0 :1; do DISPLAY=$d .venv/bin/python -c \
    "from Xlib import display; display.Display()"; done
Can't connect to display ":0": [Errno 111] Connection refused
Can't connect to display ":1": [Errno 111] Connection refused
$ ps aux | grep "[X]wayland"    # ...e não há processo nenhum atrás dele
(vazio)
```

**Quem consome a mentira:** `game_signal.classify`, via
`Daemon._gather_game_signal_inputs`. Com `healthy=False` e sem evidência de
jogo, a autoridade de exibição vira `unknown`; com `healthy=True`, fica `daemon`.
Ou seja: **a troca de perfil por jogo decide sobre um valor que nunca foi medido.**

> **O que NÃO é defeito, e não se refaz:** a
> [JANELA-CEGA-01](2026-07-28-JANELA-CEGA-01-o-detector-que-nunca-adoece.md)
> já curou a **exibição** — `window_detect_seeing`, `useful_age_sec` e `reason`
> existem por causa dela, a aba Sistema já os lê
> (`app/actions/daemon_actions.py:117`) e as dez frases em português já estão
> escritas (`:66-90`). O `healthy` foi **deixado de propósito** como trinco de
> mão única, e a property no `state_store.py:587` explica que fazê-lo DECAIR
> mudaria a cor do controle dela em silêncio. **Z7 não o faz decair.** Z7 impede
> que ele NASÇA verdadeiro sem prova — que é outra coisa, e não toca o contrato.

### 3.2 A janela do Hefesto não abre nesta máquina, agora

Consequência direta do mesmo ambiente, e é a mais cara:

```sh
$ GDK_BACKEND=x11 .venv/bin/python -c \
    "import gi; gi.require_version('Gtk','3.0'); from gi.repository import Gtk; \
     print(Gtk.init_check([])[0])"
False
$ .venv/bin/python -c \
    "import os; os.environ.pop('GDK_BACKEND',None); \
     import gi; gi.require_version('Gtk','3.0'); from gi.repository import Gtk; \
     print(Gtk.init_check([])[0])"
True
```

Sem `GDK_BACKEND` a GUI sobe (Wayland nativo). Com `GDK_BACKEND=x11` ela **não
sobe**. E `app/main.py:39` grava `os.environ["GDK_BACKEND"] = "x11"`
**incondicionalmente** quando a sessão é COSMIC — sem conferir se há X do outro
lado, sem `init_check`, sem degradação. `grep` por `init_check` em `app/main.py`
e `app/app.py`: **zero ocorrências**. Não há fallback.

A função (`app/main.py:14-41`) tem três saídas antecipadas — opt-out por
`HEFESTO_DUALSENSE4UNIX_NO_XWAYLAND=1`, `GDK_BACKEND` já igual a `x11`, e sessão
não-COSMIC. **Nenhuma delas pergunta se o XWayland existe.**

> **Isto NÃO é motivo para arrancar o XWayland forçado.** O comentário de
> `main.py:16-19` registra por que ele existe: no cosmic-comp os popups de
> `GtkComboBox`/`GtkMenu` abrem com fundo claro, mal posicionados e com grab
> quebrado. É decisão medida, e leva data. O conserto é **conferir antes de
> forçar**, não desfazer.

### 3.3 A faixa sintética de teste vazou para o `config_dir()` de produção

```sh
$ grep -o "aabbcc[0-9a-f]*" ~/.config/hefesto-dualsense4unix/controllers.json
aabbcc000002
aabbcc000001
aabbcc000003
aabbcc000004
```

A mesa dela tem **nove entradas**, e **quatro delas são endereços sintéticos de
teste**, ocupando as posições 2, 3, 4 e 5:

```
rank 1  dualsense  real
rank 2  dualsense  SINTÉTICO aabbcc000002
rank 3  dualsense  SINTÉTICO aabbcc000001
rank 4  dualsense  SINTÉTICO aabbcc000003
rank 5  dualsense  SINTÉTICO aabbcc000004
rank 6  dualsense  real
rank 7  dualsense  real
rank 8  dualsense  real
rank 9  external   real
```

Arquivo com `mtime` de **22/08 19h51**. Os quatro reais dela foram **empurrados
para 1, 6, 7 e 8** por um teste. `grep -rl aabbcc tests/ | wc -l` → **91
arquivos** de teste usam a faixa; qual deles escreveu no disco dela é trabalho
de T-06, não desta seção.

**Por que isto é Z7 e não faxina:** um teste que escreve no `config_dir()` real
prova que a suíte não está isolada do ambiente do usuário. Numa máquina que não
é a dela, o mesmo furo escreve num arquivo que ela nunca vai olhar.

### 3.4 `XDG_CONFIG_HOME`: honrado em oito lugares, ignorado em dois

```sh
$ .venv/bin/python -c "
import os; os.environ.pop('XDG_CONFIG_HOME',None)
from hefesto_dualsense4unix.utils import xdg_paths
print('antes: ', xdg_paths.config_dir())
os.environ['XDG_CONFIG_HOME']='/tmp/zz-outro-lugar'
print('depois:', xdg_paths.config_dir())"
antes:  /home/…/.config/hefesto-dualsense4unix
depois: /tmp/zz-outro-lugar/hefesto-dualsense4unix
```

`config_dir()` honra a variável **em tempo de chamada** (é `platformdirs`, e o
singleton de módulo não congela o valor). Os shells também
(`scripts/disable_steam_input.sh:257`, `scripts/doctor.sh:2195` e `:4069`), e
`service_install.py:35`, `plugins.py:61`, `prontuario_dos_jogos.py:263`,
`steam_launch_options.py:1078` e `:1433`.

**Os dois que ignoram** — e são o **mesmo caminho, escrito duas vezes**:

```
src/hefesto_dualsense4unix/integrations/storm_doctor.py:252
    Path.home() / ".config" / "wireplumber" / "wireplumber.conf.d"
src/hefesto_dualsense4unix/app/actions/emulation_actions.py:1003
    return Path.home() / ".config" / "wireplumber" / "wireplumber.conf.d"
```

O WirePlumber **honra** `XDG_CONFIG_HOME`. Quem o move leva o drop-in do
microfone junto — e o Hefesto escreve e confere no lugar errado, calado.

> **O que já foi curado, e substitui o que a fila dizia.** O `F8` do ONDE-PARAMOS
> e o `§2.0` da [SISTEMA-O-VIGIA-VIVO-01](2026-08-24-SISTEMA-O-VIGIA-VIVO-01-a-rede-de-seguranca-parada-e-o-conserto-que-nao-conserta.md)
> registram *"`storm_doctor` ignora `XDG_CONFIG_HOME` (o cartão lê um arquivo, o
> botão escreve outro)"*. **Isso é da allowlist do Steam Input, e está CURADO**
> em `f7b54e6`: `storm_doctor.py:38-67` delega em
> `steam_launch_options.steam_input_allowlist_path()`. O que sobra é o
> WirePlumber, acima — outro caminho, no mesmo arquivo.

### 3.5 A Steam mora em quatro lugares, e duas réguas ainda conhecem dois

O F8 curou o cartão da aba, o catálogo de jogos e a allowlist. Linha de base de
hoje:

```sh
$ .venv/bin/python -m pytest \
    tests/unit/test_ambiente_presumido_01_a_steam_dos_quatro_layouts.py -q
33 passed in 0.43s
```

`steam_launch_options.RAIZES_STEAM_RELATIVAS` (`:121-126`) é a lista única, com
os quatro layouts, e `storm_doctor.py:167-170` a importa. **O que ficou de fora:**

| lugar | layouts que conhece | consequência |
|---|---|---|
| `integrations/proton_pin.py:153-167` (`default_steam_root`) | 2 — `.steam/steam`, `.local/share/Steam` | **é decisão, não descuido**: o docstring diz que Flatpak/Snap ficam fora porque o Proton do host é invisível dentro da sandbox. O defeito é a tela **calar**: "Travar Proton validado" não tem como funcionar e não diz isso |
| `scripts/doctor.sh:3488-3489` | 2 | procura o `config.vdf` só nos dois nativos |
| `scripts/doctor.sh:4159-4161` | 2 | lê o `localconfig.vdf` só nos dois nativos |
| `scripts/doctor.sh:1865-1868` | **4** | a mesma busca, no mesmo arquivo, feita certo |

**Duas réguas de Steam dentro do MESMO script**, discordando. É a família do
defeito **F6**, na escala de um arquivo.

### 3.6 O teclado na tela: o daemon sabe, e nenhuma tela lê

```sh
$ for b in onboard wvkbd-mobintl squeekboard maliit-keyboard corekeyboard; do
    printf '%-18s %s\n' "$b" "$(command -v $b || echo AUSENTE)"; done
onboard            AUSENTE
wvkbd-mobintl      /usr/bin/wvkbd-mobintl
squeekboard        AUSENTE
maliit-keyboard    AUSENTE
corekeyboard       AUSENTE
```

**A instalação está CURADA e não se refaz:** `install.sh:138-151` documenta o
`scripts/install_osk.sh`, que escolhe pela sessão e roda em todo formato; o
`.spec` do Fedora traz `Recommends: wvkbd` / `Suggests: onboard`, o PKGBUILD do
Arch traz os dois em `optdepends`, o Flatpak compila o wvkbd v0.14.3 dentro da
sandbox e o `package.nix` embrulha o PATH. Isso é cura viva.

**O que sobra são duas coisas.** Primeira: o produto conhece **dois** programas
e só dois (`daemon/subsystems/keyboard.py:52-53`, `:65`, `:83-107`). Quem está
numa sessão GNOME móvel (`squeekboard`) ou Plasma Mobile (`maliit-keyboard`) tem
teclado na tela instalado e o Hefesto responde que não há nenhum.

Segunda, e é a que morde: o daemon **publica a resposta** e ninguém a lê.

```sh
$ grep -rn "osk_disponivel" src/hefesto_dualsense4unix/app/ src/hefesto_dualsense4unix/gui/
(vazio)
```

`ipc_handlers.py:2009` publica `osk_disponivel` no `state_full` — **zero leitores
em `app/` e em `gui/`**. É a família **F2** (a cura escrita e nunca ligada), e
está na lista de chaves órfãs do `SPRINT_ORDER §0.1`, que a chama de
`osk_instalado`.

> **Correção de fato para o dono do `SPRINT_ORDER.md`** (R1: relato, não edito):
> a chave publicada chama-se **`osk_disponivel`**, não `osk_instalado`. Conferido
> em `daemon/ipc_handlers.py:1953` e `:2009`. Quem for editar aquele arquivo
> substitua o nome — procurar `osk_instalado` na árvore devolve zero.

Hoje a única resposta ao aperto do L3 sem teclado instalado é uma notificação de
desktop (`integrations/desktop_notifications.py:359-385`), best-effort: sem
jeepney ou sem servidor de notificações ela devolve `False` e **o gesto some
inteiro**.

### 3.7 O `maquina.json` nunca nasceu no disco dela

```sh
$ ls ~/.config/hefesto-dualsense4unix/maquina.json
ls: não foi possível acessar '…/maquina.json': Arquivo ou diretório inexistente
```

Nove arquivos na pasta, e este não. `utils/maquina.py` tem 470 linhas, schema
versionado, gravação atômica com preservação do que não entende, e recusa por
versão que volta como motivo para a tela — **e um único escritor**:
`app/actions/footer_actions.py:305`, o "Aplicar" do rodapé da aba Configurações,
via `machine.declare` (`daemon/ipc_handlers.py:4826`).

Duas seções da aba declaram por escrito que **não** gravam
(`config/secao_mesa.py:1279` e `config/secao_controles.py:1032`: *"Chamar
`machine.declare` daqui criaria um segundo dono do gesto de gravar"*). Está
certo — mas o efeito somado é: **declarar a mesa e fechar o programa sem clicar
"Aplicar" perde tudo, sem aviso.**

### 3.8 Nenhuma linha do mapa de canais alcança esta frente

```sh
$ .venv/bin/python -c "
import csv
r=list(csv.DictReader(open('docs/data/mapa-controles.csv',newline='')))
print(len(r), sorted({x['chave'] for x in r if any(t in x['chave'].lower()
  for t in ('display','janela','teclado','osk','steam','ambiente','proton'))}))"
308 []
```

**Zero das 308 linhas** fala de display, janela, teclado na tela, Steam, Proton
ou ambiente. Nenhum portão de paridade de transporte alcança uma frase de Z7 —
é o mesmo achado que a `SISTEMA-O-VIGIA-VIVO-01` fez para a aba Sistema. Toda
frase nova desta frente passa livre, e é por isso que §7 é regra e não conselho.

---

## 4. A hipótese, separada do medido

Uma só, e ela **não** vira tarefa até ser medida:

* **Hipótese H1 — o XWayland desta sessão morreu e não voltou.** O socket
  `/tmp/.X11-unix/X1` existe, nenhum processo `Xwayland` roda, e a conexão é
  recusada em vez de esperar. Isso é *compatível* com "o cosmic-comp iniciou o
  XWayland, ele morreu, e o socket ficou órfão", mas também com "a ativação
  preguiçosa deste compositor não está armada". **NÃO VERIFICADO.** Nada nesta
  sprint depende de qual das duas é: as treze tarefas curam o produto para os
  **dois** casos, porque em ambos o Hefesto tem de descobrir que não há X e agir
  de acordo. Se alguém quiser fechar a hipótese, a régua é o journal do
  `cosmic-comp`, e o resultado é uma nota nesta seção — não um conserto.

---

## 5. A coreografia dos agentes

**Quatro agentes, todos em PARALELO** — os quatro conjuntos de arquivos são
disjuntos, conferido arquivo por arquivo abaixo. Nenhum depende do resultado do
outro. Mais o **regente**, que não é agente: é quem despacha, junta e fecha.

```
        ┌── Z7-A  o display gráfico          T-01 T-02 T-03 T-04
regente ├── Z7-B  os caminhos da casa        T-05 T-06 T-07
   │    ├── Z7-C  a Steam de quem não é ela  T-08 T-09 T-10
   │    └── Z7-D  o que a máquina não tem    T-11 T-12 T-13
   │
   └─ conferente (REFAZ as treze mordidas) ─> crítico de completude ─> foto + portões
```

| agente | possui, e só | NÃO toca | devolve |
|---|---|---|---|
| **Z7-A**<br>o display gráfico | `app/main.py`<br>`daemon/subsystems/autoswitch.py`<br>`daemon/state_store.py`<br>`integrations/window_backends/xlib.py`<br>`tests/unit/test_ambiente_presumido_01_o_display_que_nao_existe.py` **(cria)** | `app/app.py`, `daemon/ipc_handlers.py`, qualquer `app/actions/**` | o diff, as quatro mordidas refeitas com a saída colada, e a contagem de `x11_connect_failed` antes e depois em 10 min de daemon | <!-- ref-externa: arquivo que ESTA sprint cria -->
| **Z7-B**<br>os caminhos da casa | `utils/xdg_paths.py`<br>`utils/maquina.py`<br>`scripts/check_faixa_sintetica.py` **(cria)**<br>`tests/unit/test_ambiente_presumido_01_os_caminhos_da_casa.py` **(cria)**<br>**posse de LINHA declarada:** `integrations/storm_doctor.py:252` e `app/actions/emulation_actions.py:1003` — **essas duas linhas e mais nada nesses arquivos** | o resto de `storm_doctor.py` e de `emulation_actions.py`; `app/actions/footer_actions.py`; `daemon/ipc_handlers.py` | o diff, as três mordidas, e a lista dos testes que escrevem no `config_dir()` real (T-06) — **sem apagar nada do disco dela** | <!-- ref-externa: arquivo que ESTA sprint cria -->
| **Z7-C**<br>a Steam de quem não é ela | `integrations/proton_pin.py`<br>`scripts/doctor.sh` **(só as linhas 3488-3489 e 4159-4161)**<br>`tests/unit/test_ambiente_presumido_01_a_steam_dos_quatro_layouts.py` **(estende)** | `integrations/steam_launch_options.py` (é a lista única e está certa), `integrations/jogos_locais.py`, `app/actions/emulation_actions.py` | o diff, as três mordidas, e a saída do `doctor.sh` contra um `HOME` dublê que só tem o layout Flatpak |
| **Z7-D**<br>o que a máquina não tem | `daemon/subsystems/keyboard.py`<br>`daemon/service_install.py`<br>`app/actions/ambiente_na_tela.py` **(cria)**<br>`tests/unit/test_ambiente_presumido_01_o_que_a_maquina_nao_tem.py` **(cria)** | `app/actions/input_actions.py` (é da Onda 10), `app/actions/daemon_actions.py` (é da Onda 11), `install.sh`, `flatpak/`, `packaging/` | o diff, as três mordidas, e as frases prontas de T-12 **em texto**, para a regência levar ao olho dela | <!-- ref-externa: arquivo que ESTA sprint cria -->

**As três colisões declaradas, e como não se atropelam:**

1. `emulation_actions.py:1003` é linha do território da **Onda 5**. Z7-B a
   possui **enquanto a Onda 5 não estiver rodando**. Se as duas forem despachadas
   juntas, Z7-B **relata em vez de editar** (R1) e a linha vira gancho.
2. `scripts/doctor.sh` é tocado pela **Onda 11** na seção D do
   [COMO-EXECUTAR](2026-08-21-ABA-CONFIGURACOES/COMO-EXECUTAR.md). Z7-C possui
   **quatro linhas** dele, nomeadas. Fora delas, relata.
3. `app/actions/ambiente_na_tela.py` **nasce vazio de dono** de propósito: é <!-- ref-externa: arquivo que ESTA sprint cria -->
   arquivo NOVO, para que as frases de T-12 existam sem que Z7-D precise entrar
   em `input_actions.py` (Onda 10) nem em `daemon_actions.py` (Onda 11).

**O que nenhum dos quatro faz** (R2/R4): rodar `pytest` sem alvo, rodar
`scripts/gui-captura/retratar_abas.py`, parar o daemon, ou tocar em
`~/.config/hefesto-dualsense4unix/`.

---

## 6. As tarefas

Custo em linhas é do diff de produção, sem teste. Carimbo D3 em cada uma.

### Z7-A — o display gráfico

#### T-01 · `window_detect_healthy` para de nascer verdadeiro por presunção

**Onde:** `daemon/subsystems/autoswitch.py:102` (`initial_healthy = initial_backend == "xlib"`),
`daemon/state_store.py:350` (`set_window_detect_backend`),
`integrations/window_backends/xlib.py:93-135` (`_ensure_connected`).

**O conserto:** o `XlibBackend` ganha `conexao_provada() -> bool | None` —
`True` = conectou, `False` = tentou e o servidor recusou, `None` = ainda não
tentou. O autoswitch **sonda uma vez** antes de semear: `initial_healthy` só é
`True` se a sonda devolver `True`. `set_window_detect_backend` não muda de
assinatura nem de contrato — continua sendo o chamador que decide a presunção,
e agora o chamador tem prova.

**A mordida:** com `DISPLAY` apontando para um socket que recusa, o `state_full`
tem de sair com `window_detect_healthy=False` **e** `reason="sem_conexao_x"`.
Arrancar a sonda (voltar `initial_healthy = initial_backend == "xlib"`) faz o
teste ver `True` e **reprovar**. O dublê tem de saber recusar E aceitar — as
duas respostas exercidas no mesmo arquivo (A2 do COMO-REGER-AGENTES).

**Custo:** ~25 linhas. ~40 min. **Carimbo: nenhum** — não toca tela.

#### T-02 · a janela não morre quando o XWayland não existe

**Onde:** `app/main.py:14-41` (`_force_xwayland_on_cosmic`), `:105`.

**O conserto:** antes de gravar `GDK_BACKEND=x11`, confirmar que há X do outro
lado. A conferência tem de ser **barata e sem abrir janela** — um `connect()` no
socket de `DISPLAY`, com teto de tempo curto. Se não abrir: **não mexer em
`GDK_BACKEND`** e devolver `False` (a GUI sobe em Wayland, com o bug de popup do
cosmic-comp, que é infinitamente melhor que não subir). A função continua
retornando `bool` e `main():218` continua logando o resultado.

**A mordida:** com um dublê de conferência que **recusa**, `os.environ` sai da
função **sem** a chave `GDK_BACKEND`; com um que **aceita**, sai com `"x11"`.
Arrancar a conferência faz o primeiro caso gravar `x11` e **reprovar**. E um
terceiro caso: `DISPLAY` ausente do ambiente → não mexe (é o item literal do
aceite da tabela 0.2).

**Custo:** ~20 linhas. ~40 min. **Carimbo: nenhum** — o efeito é a janela abrir,
não a janela mudar.

> **Armadilha:** `_force_xwayland_on_cosmic()` roda no **topo do módulo**
> (`main.py:105`), antes do import de `HefestoApp`, porque a cadeia de imports
> do `gi.repository` abre um `GdkDisplay` já no import. A conferência tem de
> caber ali — **nada de `gi` dentro dela**, ou o remédio vira a doença.

#### T-03 · o daemon para de encher o journal com a mesma linha

**Onde:** `integrations/window_backends/xlib.py:26` (`_RECONNECT_BACKOFF_SEC = 30.0`),
`:131` (`logger.warning("x11_connect_failed", …)`).

**O conserto:** 716 linhas em 6 h é ruído que esconde notícia. O `warning` vira
**um por episódio** — o mesmo padrão de `_reconnect_pending` e `_missing_warned`
que este arquivo já usa em três lugares — e as repetições caem para `debug`. O
backoff cresce até um teto (30 s → 5 min) enquanto o motivo não mudar. **A
tentativa continua acontecendo**: o XWayland volta e o detector tem de voltar
com ele.

**A mordida:** 40 leituras com display morto → **no máximo 2** linhas de
`warning` e a última tentativa a pelo menos 5 min da primeira. Arrancar o guarda
de episódio devolve 40 e **reprova**.

**Custo:** ~20 linhas. ~30 min. **Carimbo: nenhum.**

#### T-04 · o portão que impede o payload de se contradizer

**Onde:** teste novo, contra `daemon/ipc_handlers.py:2066-2110`
(`_window_detect_payload`) com um `StateStore` real.

**O conserto:** nenhum em `src/`. É a rede que impede T-01 de ser desfeita por
refactor. A invariante: **`healthy=True` com `useful_age_sec=None` e
`seeing=False` é estado impossível** — significa "estou bem" e "nunca vi nada",
ao mesmo tempo.

**A mordida:** montar o store no estado exato medido em §3.1 e exigir que o
teste **reprove**; aplicar T-01 e exigir que passe. Este é o único teste da
sprint que **tem de reprovar contra a árvore de hoje** antes de T-01 — o
executor cola a saída das duas execuções no relatório.

**Custo:** 0 de produção. ~25 min. **Carimbo: nenhum.**

### Z7-B — os caminhos da casa

#### T-05 · `XDG_CONFIG_HOME` vale para os dois caminhos do WirePlumber

**Onde:** `utils/xdg_paths.py` (acrescenta), `integrations/storm_doctor.py:252`,
`app/actions/emulation_actions.py:1003`.

**O conserto:** `xdg_paths.wireplumber_config_dir()` — uma função, um dono, o
mesmo `os.environ.get("XDG_CONFIG_HOME", …)` que os shells da casa já resolvem.
As duas linhas acima passam a chamá-la. **Uma linha em cada arquivo alheio**,
que é o limite da posse declarada em §5.

**A mordida:** com `XDG_CONFIG_HOME=/tmp/…`, as duas chamadas devolvem **o mesmo
caminho, sob o tmp**. Arrancar o helper de qualquer um dos dois lados faz aquele
voltar para `~/.config` e o teste **reprova nomeando o arquivo**.

**Custo:** ~18 linhas. ~30 min. **Carimbo: nenhum.**

#### T-06 · a faixa sintética não mora no `config_dir()` de produção

**Onde:** `scripts/check_faixa_sintetica.py` (novo), mais o teste. <!-- ref-externa: arquivo que ESTA sprint cria -->

**O conserto, em duas metades.** (a) **O portão:** varre o `config_dir()`
resolvido e reprova qualquer ocorrência das faixas sintéticas da casa
(`aabbcc`, `02fe00`, `e8473a`, nas duas grafias — com e sem `:`), nomeando
arquivo, linha e o valor achado. Entra na lista de portões do `CLAUDE.md`.
(b) **A causa:** achar quais dos 91 arquivos de teste escrevem no `config_dir()`
real e trancá-los. A régua é executar cada suspeito com o `config_dir()`
apontado para um tmp e conferir se algo aparece **fora** dele.

**A mordida:** plantar `aabbcc000009` num `config_dir()` dublê → o portão
reprova citando arquivo e linha; tirar a faixa da lista de proibidas → o portão
passa e o **teste do portão** reprova. Régua que só sabe passar não é régua.

**Custo:** ~80 linhas (o portão é novo). ~90 min. **Carimbo: nenhum.**

> **O que o executor NÃO faz:** apagar os quatro registros do `controllers.json`
> dela. É a mesa dela, e a numeração dos quatro DualSense reais muda ao remover.
> A tarefa **relata**, com o `mtime` e as quatro chaves, e a decisão é dela.

#### T-07 · o `maquina.json` sobrevive a fechar o programa

**Onde:** `utils/maquina.py`.

**O conserto:** `gravar_rascunho_da_mesa(declaracao)` — mesma gravação atômica,
mesmo lock (`MAQUINA_FILE_LOCK`), mesma preservação do que não entende, mas
**sem** o gesto de "Aplicar" por trás. A regra do módulo não muda: campo não
declarado continua nascendo em `None`, e um rascunho **nunca** inventa valor de
catálogo.

**A mordida:** gravar um rascunho num `config_dir()` dublê, **matar o processo**
(não fechar bonito: `os._exit`), reabrir noutro processo e ler o campo de volta.
Arrancar a gravação atômica — deixando só o `write_text` — faz o teste que
interrompe no meio **reprovar** com arquivo truncado.

**Custo:** ~35 linhas. ~50 min. **Carimbo: nenhum** — a primitiva não tem tela.

> **O gancho, e ele é da Onda 1 · Configurações (CONFIG-03).** Quem chama
> `gravar_rascunho_da_mesa` quando ela declara e não clica é a aba, em
> `app/actions/footer_actions.py:305` ou vizinho. Z7-B **não entra nesse
> arquivo**. O item de aceite *"declarar a mesa e matar o processo sem 'Aplicar'
> e o `maquina.json` existe"* só fecha quando a Onda 1 ligar o fio — e é por isso
> que ele está em §9 com dono nomeado.

### Z7-C — a Steam de quem não é ela

#### T-08 · o `doctor.sh` para de ter duas réguas de Steam

**Onde:** `scripts/doctor.sh:3488-3489` e `:4159-4161`.

**O conserto:** as duas buscas passam a cobrir os quatro layouts, como
`:1865-1868` já faz. **Copiar a lista de `:1865-1868`, não inventar uma
terceira** — e deixar um comentário de uma linha em cada ponto dizendo que as
três listas do arquivo têm de andar juntas (T-10 é quem cobra).

**A mordida:** `HOME` dublê contendo **só** o layout Flatpak, com um
`config.vdf` e um `localconfig.vdf` plantados → o `doctor.sh` os acha nas duas
seções. Arrancar as duas raízes novas de qualquer uma das seções **reprova
nomeando a seção**.

**Custo:** ~8 linhas. ~35 min. **Carimbo: nenhum** — o `doctor.sh` é terminal.

#### T-09 · "Travar Proton validado" diz por que não pode, em vez de calar

**Onde:** `integrations/proton_pin.py:153-167` (`default_steam_root`) e o ponto
de entrada que a aba chama.

**O conserto:** `default_steam_root` **continua excluindo Flatpak e Snap** — é
decisão medida, e o docstring dela explica o porquê (o Proton do host é invisível
dentro da sandbox). O que muda: uma função irmã, `steam_root_ou_recusa(home)`,
devolve `(raiz | None, motivo | None)`, onde o motivo é do vocabulário da tela —
*"a sua Steam está instalada pela Flatpak, e o Proton que o Hefesto extrai fica
fora da caixa dela"*. **É o formato de recusa da Z1**, e Z7-C tem de usá-lo
igual, não parecido.

**A mordida:** `HOME` dublê só com o layout Flatpak → a resposta é
`(None, motivo)` com o motivo **não vazio**; `HOME` dublê com o layout nativo →
`(raiz, None)`. Arrancar a propagação do motivo faz o primeiro caso devolver
`(None, None)` e **reprovar** — que é exatamente o defeito **F1** ("aplicado" é
palavra sem prova) na sua forma negativa.

**Custo:** ~30 linhas. ~50 min. **Carimbo: estrutural** — o motivo é texto novo
na tela. **A frase vai ao olho dela**, e a fiação é gancho da Onda 5.

#### T-10 · a lista de raízes é uma só, e o portão alcança o `scripts/`

**Onde:** `tests/unit/test_ambiente_presumido_01_a_steam_dos_quatro_layouts.py`
(estende o `test_a_lista_de_raizes_e_uma_so` que já existe).

**O conserto:** o teste passa a ler o `doctor.sh` e a exigir que **toda** lista
de raízes de Steam dele contenha os quatro caminhos de
`RAIZES_STEAM_RELATIVAS`. Um quinto layout que entre no Python sem entrar no
shell reprova.

**A mordida:** tirar `snap/steam/common/.steam/steam` de uma das três listas do
`doctor.sh` → **reprova nomeando a linha**. Devolver → passa. Linha de base a
colar no relatório: **33 passed** hoje.

**Custo:** 0 de produção. ~40 min. **Carimbo: nenhum.**

### Z7-D — o que a máquina não tem

#### T-11 · o teclado na tela conhece mais que dois programas

**Onde:** `daemon/subsystems/keyboard.py:52-53`, `:65-69`, `:83-107`, `:115-132`.

**O conserto:** `squeekboard` (GNOME móvel, Wayland nativo) e `maliit-keyboard`
(Plasma Mobile) entram na lista, com a **mesma regra de ordem que já existe**: em
sessão Wayland os que digitam por protocolo Wayland vêm primeiro; em X11, o
`onboard`. `_OSK_SPAWN_ARGS` ganha o argv de cada um. A cache com prazo
(`_OSK_RESOLVE_TTL_SEG`) não muda — ela existe porque ela instala o programa com
o daemon no ar e aperta o L3 (`keyboard.py:74-79`), e isso continua valendo.

**A mordida:** `PATH` dublê contendo **só** `squeekboard` →
`osk_disponivel_no_sistema()` devolve `True` e `_osk_candidatos()` o coloca
primeiro em sessão Wayland. Arrancar o candidato novo faz devolver `False` e
**reprova**. Um segundo caso, `PATH` vazio → `False` nos dois mundos.

**Custo:** ~20 linhas. ~40 min. **Carimbo: nenhum** — o daemon não tem tela.

#### T-12 · `osk_disponivel` ganha o primeiro leitor, num arquivo próprio

**Onde:** `app/actions/ambiente_na_tela.py` (novo). <!-- ref-externa: arquivo que ESTA sprint cria -->

**O conserto:** funções **puras** — recebem o dicionário do `state_full` e
devolvem markup, no molde de `daemon_actions.descrever_deteccao_de_janela`
(`:117`), que é o exemplo bom desta casa. Três frases, e as três dizem o que
aconteceu com a máquina dela, nunca o nome do mecanismo:

* `descrever_teclado_na_tela(state)` — lê `osk_disponivel`. Ausente do payload é
  um terceiro estado (*"não consegui ler"*), **não** um `False`;
* `descrever_display_grafico(state)` — lê `window_detect_backend` e `reason` e
  diz se a troca por jogo enxerga alguma coisa;
* `descrever_steam_encontrada(state)` — o layout achado, ou onde procurou.

**A mordida:** um portão de completude — **toda chave publicada em
`_state_full` cujo nome esteja na lista de "fatos de ambiente" tem de ter um
leitor em `app/`**. Ele **nasce reprovando `osk_disponivel`** (zero leitores
hoje, medido em §3.6); T-12 o faz passar; arrancar o leitor o faz reprovar de
novo, nomeando a chave. É o formato de mordida que falta em toda a família F2.

**Custo:** ~90 linhas (arquivo novo, três funções e as constantes de frase).
~90 min. **Carimbo: estrutural** — três textos novos. **Vão inteiros ao olho
dela**, em texto, antes de qualquer fiação.

> **O gancho:** quem pendura essas frases é a **Onda 10 · Navegação** (a do
> teclado) e a **Onda 11 · Sistema** (a do display e da Steam). Z7-D **não**
> entra em `input_actions.py` nem em `daemon_actions.py`. E a legenda
> `input_actions.BINDINGS_LEGEND:55-66`, que hoje crava *"`onboard` ou
> `wvkbd-mobintl`"* em texto fixo, passa a derivar da lista de T-11 — **relato
> para a Onda 10**, com a linha exata.

#### T-13 · o systemd de usuário deixa de ser presumido

**Onde:** `daemon/service_install.py:33-45` (`user_unit_dir`), `:130-150`
(`status_text`).

**O conserto:** `user_unit_dir()` chama `mkdir(parents=True)` **como efeito
colateral de perguntar onde é** — numa máquina sem systemd de usuário isso cria
uma pasta inútil e segue como se estivesse tudo bem. Separar: `user_unit_dir()`
só responde o caminho; quem instala é quem cria. E `status_text` ganha o caso
que falta — **`systemctl` ausente do `PATH`, ou sem instância de usuário** —
com a resposta que já existe no próprio arquivo (`:141-145`: *"Para iniciar em
foreground sem systemd"*), em vez de devolver a saída de erro do `systemctl`.

**Por que é Z7 e não Onda 11:** o ONDE-PARAMOS registra que a **Início** manda
*"tente pela aba Sistema"* em caso de falha — **e a Sistema usa o mesmo
mecanismo**. Duas abas apontando uma para a outra em cima do mesmo furo é
invariante, não defeito de aba.

**A mordida:** `PATH` dublê sem `systemctl` → `status_text()` contém o caminho
sem systemd e **não** contém a palavra "systemctl" crua; e `user_unit_dir()`
chamado num `XDG_CONFIG_HOME` dublê **não cria nada**. Arrancar qualquer um dos
dois reprova, cada um no seu teste.

**Custo:** ~25 linhas. ~45 min. **Carimbo: nenhum** — `status_text` já é texto
de terminal, e o texto novo é o que já estava escrito no arquivo.

---

## 7. O que o Bluetooth bloqueia nesta frente

A trilha de rádio é **dela, com o assistente** (decisão **D2**,
[SPRINT_ORDER §0.7](../SPRINT_ORDER.md)). Z7 não mede rádio. E como **nenhuma
das 308 linhas do mapa alcança esta frente** (§3.8), **nenhum portão de paridade
vai barrar uma frase errada de Z7** — a disciplina abaixo é a única rede.

**O que esta frente NÃO pode afirmar na tela até a medição dela existir:**

1. **Nada sobre transporte.** Nenhuma das três frases de T-12 pode conter
   "cabo", "rádio", "Bluetooth" ou "sem fio". Elas falam de display, teclado e
   Steam — coisas do computador, não do controle. Uma frase de ambiente que
   mencione transporte é uma promessa que ninguém mediu.
2. **O motivo de recusa de T-09 não fala do controle.** *"A sua Steam está numa
   caixa"* é sobre a Steam. Qualquer acréscimo sobre o que o controle faz ou
   deixa de fazer sob Proton sai da frase.
3. **`MesaDeclarada.radios` continua sem escritor**, e T-07 não lhe dá um. O
   cabeçalho de `utils/maquina.py:66-71` já registra que a enumeração de rádios
   vizinhos é de outra frente. O rascunho de T-07 grava o campo se ele vier
   preenchido e **nunca** o inventa.
4. **A pergunta que a medição dela abre, e que Z7 deixa em aberto de propósito:**
   se um adaptador Bluetooth some da máquina, o `maquina.json` que a descreve
   fica velho — e quem responde por isso é a frente da mesa, não esta.

---

## 8. As dependências

**Copiadas da tabela 0.2 e conferidas contra a 0.3 em 23/08 às 22h50.**

**De que Z7 depende para EXECUTAR:** de nada. As quatro frentes correm hoje.

**De que Z7 depende para FECHAR:**

* **Z0 — a régua e a foto.** Os dois carimbos estruturais desta sprint (T-09 e
  T-12) precisam de foto para ir ao olho dela, e **cinco abas ainda publicam o
  XML cru**. Enquanto Z0 não fecha, as frases vão a ela **em texto**, e o
  carimbo fica pendente;
* **Z1 — a ponte que sabe dizer não.** T-09 usa o formato de recusa da Z1. Se a
  Z1 fechar primeiro, T-09 importa o formato; se Z7 fechar primeiro, T-09 propõe
  e a Z1 **é a dona da palavra final**;
* **Z6 — comunhão com o specs.** §3.8 mostra que o mapa não alcança esta frente.
  Se a Z6 acrescentar chaves de ambiente ao CSV, T-12 passa a ter portão de
  verdade em vez de disciplina.

**Quem depende de Z7** (tabela 0.3, cinco abas): **Onda 2 · Início**,
**Onda 5 · Emulação**, **Onda 6 · Perfis**, **Onda 10 · Navegação**,
**Onda 11 · Sistema**. As cinco listam `Z7` entre as dependências, e nenhuma
delas pode escrever "funciona" antes desta fechar.

**Z7 não bloqueia Z2, Z3, Z4 nem Z5** — arquivos disjuntos, assunto disjunto.

---

## 9. O aceite

**Os cinco itens da tabela 0.2 são o PISO.** Estão aqui palavra por palavra, com
o comando ao lado. Os três de §9.2 são o que a medição de hoje acrescentou.

### 9.1 O piso — os cinco da tabela

| # | o item, como a tabela o escreve | quem fecha | régua |
|---|---|---|---|
| 1 | *"a suíte roda com `XDG_CONFIG_HOME` em outro lugar e uma Steam Flatpak falsa, e as três abas concordam sobre o MESMO arquivo"* | T-05, T-08, T-10 | as três leituras da allowlist — `storm_doctor` (Sistema), `emulation_actions` (Emulação) e `profiles_actions:1760` (Perfis) — devolvem o mesmo caminho sob `XDG_CONFIG_HOME` dublê, com `HOME` dublê em layout Flatpak |
| 2 | *"`DISPLAY` inválido faz `window_detect_healthy` virar `false`, e arrancar o gate devolve `true` e reprova"* | T-01, T-04 | as duas execuções do T-04 coladas no relatório: reprova antes, passa depois |
| 3 | *"sem `DISPLAY`, `_force_xwayland_on_cosmic` não mexe em `GDK_BACKEND`"* | T-02 | os três casos do teste: sem `DISPLAY`, com `DISPLAY` que recusa, com `DISPLAY` que aceita |
| 4 | *"declarar a mesa e matar o processo sem 'Aplicar' e o `maquina.json` existe"* | T-07 **+ o gancho da Onda 1** | **este item NÃO fecha dentro de Z7.** T-07 entrega a primitiva e a mordida do `os._exit`; a chamada é da **Onda 1 · Configurações (CONFIG-03)**, em `footer_actions.py` ou vizinho. Está declarado em §10 |
| 5 | *"portão contra a faixa `aabbcc` em `config_dir()` de produção"* | T-06 | `scripts/check_faixa_sintetica.py` entra na lista de portões do `CLAUDE.md`, e a mordida das duas direções está no §6 | <!-- ref-externa: arquivo que ESTA sprint cria -->

### 9.2 O que a medição de hoje acrescentou ao piso

| # | item | quem fecha |
|---|---|---|
| 6 | **A janela abre nesta máquina.** Hoje `Gtk.init_check()` devolve `False` sob `GDK_BACKEND=x11`, e o produto o força sem conferir. É a consequência mais grave de F8 e não estava na tabela | T-02 |
| 7 | **`DISPLAY` presente e MORTO conta como inválido.** O item 3 do piso diz "sem `DISPLAY`"; o caso medido na bancada dela é `DISPLAY=:1` **presente** e recusando. Os testes de T-01 e T-02 cobrem os dois | T-01, T-02 |
| 8 | **`osk_disponivel` deixa de ser chave órfã.** O portão de T-12 nasce reprovando e passa a valer para a família F2 inteira | T-12 |

### 9.3 Os comandos, com a leva parada

Rodados **pelo regente**, uma vez, depois que os quatro agentes entregarem
(R2) — nunca por agente, nunca com a árvore em movimento:

```bash
git add -A                                  # os portões não veem arquivo novo
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/python scripts/check_faixa_sintetica.py      # novo, de T-06
.venv/bin/mypy src/hefesto_dualsense4unix
```

E, **só depois** (R4): `scripts/gui-captura/retratar_abas.py`, uma vez, por quem
coordena.

**Durante o desenvolvimento, cada agente roda só o próprio arquivo de teste** —
os quatro nomes estão em §5.

---

## 10. O que fica aberto, e de quem é

| o que | de quem | por quê |
|---|---|---|
| **Os quatro registros sintéticos na mesa dela** (§3.3) | **dela** | apagar renumera os quatro DualSense reais. T-06 relata `mtime` e chaves; a decisão é dela |
| **Ligar o rascunho da mesa ao gesto de declarar** (item 4 do piso) | **Onda 1 · Configurações, CONFIG-03** | Z7-B entrega `gravar_rascunho_da_mesa`; quem chama é a aba, e Z7 não entra em `footer_actions.py` |
| **As três frases de T-12 penduradas na tela** | **Onda 10 · Navegação** (teclado) e **Onda 11 · Sistema** (display, Steam) | arquivo novo com funções puras justamente para não colidir |
| **A legenda de `input_actions.BINDINGS_LEGEND:55-66`** crava os dois nomes de teclado em texto fixo | **Onda 10 · Navegação** | passa a derivar da lista de T-11; relato de Z7-D com a linha exata |
| **O motivo de recusa de T-09 na tela da Emulação** | **Onda 5 · Emulação**, com o formato da **Z1** | Z7-C entrega a função e o motivo; a fiação é da aba |
| **`osk_instalado` × `osk_disponivel` no `SPRINT_ORDER §0.1`** | **quem for editar o `SPRINT_ORDER.md`** | fato errado, e sai de onde estiver. A chave real é `osk_disponivel` (`ipc_handlers.py:2009`) |
| **A hipótese H1** — por que o XWayland desta sessão não está lá | **ninguém, até virar pergunta** | §4. Nenhuma tarefa depende dela |
| **`MesaDeclarada.radios` sem escritor** | **a frente da mesa** (D2 / **D-M**) | `utils/maquina.py:66-71` já registra |

---

## 11. Ver também

* [SPRINT_ORDER.md](../SPRINT_ORDER.md) — **§0.1** (por que não se conserta aba
  por aba), **§0.2** (a tabela desta frente), **§0.3** (as cinco abas que
  dependem daqui), **§0.7** (a trilha do Bluetooth), **§0.8** (o carimbo D3);
* [2026-08-23-ONDE-PARAMOS](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md)
  — o **F8**, que é o diagnóstico que esta sprint executa;
* [COMO-REGER-AGENTES.md](../COMO-REGER-AGENTES.md) — R1 a R4 e as seis
  armadilhas de 23/08. A coreografia de §5 é aquele formato;
* [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md) — a régua de tela e as
  armadilhas de medição;
* [JANELA-CEGA-01](2026-07-28-JANELA-CEGA-01-o-detector-que-nunca-adoece.md) —
  **a metade já curada** de §3.1: `seeing`, `reason` e `useful_age_sec` nasceram
  ali, e não se refazem;
* [COMO-EXECUTAR da aba Configurações](2026-08-21-ABA-CONFIGURACOES/COMO-EXECUTAR.md)
  — o molde de receita desta casa, e o dono do gancho do item 4 do aceite;
* [SISTEMA-O-VIGIA-VIVO-01](2026-08-24-SISTEMA-O-VIGIA-VIVO-01-a-rede-de-seguranca-parada-e-o-conserto-que-nao-conserta.md)
  — a aba que declara "está tudo saudável", e a primeira a herdar esta frente.
