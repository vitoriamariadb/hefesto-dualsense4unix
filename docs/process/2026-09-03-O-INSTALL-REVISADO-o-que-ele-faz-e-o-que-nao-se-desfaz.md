# O install revisado — o que ele faz, o que não se desfaz, e o ensaio que nasceu

**03/09/2026.** Pedido dela, antes de rodá-lo: *"antes revisa o install. não roda
agora."* E o alcance, dela também: *"pode mexer no arquivo da steam. reinstalar
drivers e tudo mais."*

O `install.sh` tem 3.4 mil linhas e mexe em `/etc/udev/rules.d`, em
`/etc/sudoers.d`, no cmdline do kernel, em três módulos DKMS, num serviço de
SISTEMA e nos arquivos da conta Steam de quem instala — **e não havia forma de
ver isso antes de deixar acontecer.** A peça que este documento entrega é essa
forma.

```bash
./install.sh --dry-run            # o plano, e nada acontece
sudo -v && ./install.sh --dry-run # o plano COMPLETO (os passos de root aparecem)
```

Sem credencial de `sudo` em cache o ensaio **não pede senha** — um modo que
promete não tocar em nada e abre um prompt de root já quebrou a promessa. Os
passos que precisam de root aparecem então como pulados, que é o que
aconteceria de verdade, e a linha acima diz como ver o plano inteiro.

Medido nesta bancada: **83 mudanças planejadas, 29 delas com root**, num
`--dry-run` sem flag nenhuma.

Régua: `tests/unit/test_o_ensaio_do_install_nao_escreve.py` — 16 testes, e
nenhum deles lê a palavra "dry-run" no arquivo: eles RODAM o ensaio num lar de
mentira, com todo binário de sistema dublado, e conferem o **ato**.

---

## 1. O que NÃO se desfaz — e o que o `uninstall.sh` desfaz

A simetria é boa: quase tudo tem contrapartida, e as exceções são **decisões
declaradas**, não esquecimentos. As três que sobram estão marcadas.

| o install faz | o uninstall desfaz? | onde |
| --- | --- | --- |
| regras udev + `modules-load.d` | sim, por padrão | `uninstall.sh:619` |
| `/etc/modprobe.d/hefesto-dualsense-storm.conf` | sim | `uninstall.sh:636` |
| `/etc/modprobe.d/hefesto-btusb-no-autosuspend.conf` | sim | `uninstall.sh:590` |
| `/etc/modprobe.d/hefesto-hid-nintendo.conf` · `-playstation.conf` | sim | `:1013` · `:1101` |
| `/etc/bluetooth/main.conf` (FastConnectable, JustWorksRepairing) | sim, com backup | `scripts/bluez_config.sh remover` |
| broker de sistema (`/usr/local/lib/…` + 2 units) | sim, só o que o install registrou | `uninstall.sh:907-943` |
| resiliência do bluetoothd (8 roteiros, drop-in, 4 units) | sim | `uninstall.sh:706-755` |
| `/etc/sudoers.d/49-hefesto-bt-ponte` + o helper | sim | `uninstall.sh:743-747` |
| `hefesto-bt-agent.service` | sim | `uninstall.sh:887-891` |
| `/etc/NetworkManager/conf.d/hefesto-wifi-powersave.conf` | sim | `uninstall.sh:1140` |
| os três módulos DKMS | sim (`dkms remove --all`) + initramfs | `uninstall.sh:1125-1134` |
| cmdline do kernel | **só o que ele registrou como nosso** | `cmdline-owners.conf` |
| units `--user`, ícones, `.desktop`, glifos, `.mo`, perfis, fontes | sim | vários |
| Proton pinado (trava do `config.vdf`) | sim (`--unlock`) | `uninstall.sh:1527` |
| Proton EXTRAÍDO em `compatibilitytools.d` | **não** — é dado da usuária | declarado |
| backport do BlueZ | **não, por padrão** — decisão dela, 02/08 | `BLUEZ-PADRAO-INVERTIDO-01` |
| pacote do teclado na tela (`wvkbd`/`onboard`) | **não** — é pacote do sistema | `uninstall.sh:1493` |
| Steam Input `PSSupport` | **não restaura: desliga de novo** | declarado no cabeçalho |
| extensão AppIndicator do GNOME | **não** | — |

### As três que ficam, e por que é o certo

1. **O backport do BlueZ fica.** Desinstalar o Hefesto não pode piorar o
   Bluetooth de quem o desinstalou — o 5.72 do noble tem crash medido comendo
   bonds. `--restore-bluez` desfaz, e avisa que é destrutivo.
2. **O Steam Input fica desligado.** Sem o daemon domesticando o DualSense,
   `PSSupport=2` reproduz na hora os três sintomas que levam a pessoa a
   desinstalar. `bash scripts/disable_steam_input.sh --restore` devolve.
3. **O Proton extraído fica.** É download da usuária, não artefato nosso.

### O que é IRREVERSÍVEL de verdade

- **Os bonds Bluetooth, no passo 3f.** Aplicar o backport reinicia o
  `bluetoothd` (quem reinicia é o `postinst` do próprio pacote) e a migração
  **descarta os pareamentos**. Não há backup que devolva: é reparear. O install
  avisa em bloco antes de perguntar, e o ensaio nomeia a consequência.
- **`dist/` e `build/` da árvore**, apagados no passo 1. Um pacote recém-
  construído some. Reconstruir resolve; o ensaio agora avisa quando o
  diretório existe.
- **O `.venv`**, recriado do zero quando o Python do sistema muda de minor
  (`install.sh:1719-1736`). Leva junto **tudo que foi instalado à mão** no
  venv. Foi exatamente o caso do `playwright` — curado neste mesmo dia
  declarando-o no `pyproject.toml`.

---

## 2. O que acontece se cair no meio

O contrato de fundo é bom: quase todo passo é `if`-guardado, best-effort e
idempotente, e a ordem põe as curas de sistema ANTES do daemon. **Três buracos
de `set -e` foram achados nesta revisão e curados**, todos da mesma forma —
comando de escrita sem guarda num passo tardio, derrubando os passos seguintes:

| onde | o que caía junto | estado |
| --- | --- | --- |
| `cp -f "${GLYPHS_SRC}"/*.svg` (4b) | glob sem casar mata o install no passo 4 | curado |
| `bash scripts/install_profiles.sh` (4c) | ele tem `exit 1` próprio; levava daemon, Steam e doctor | curado |
| `install -Dm644` + `sed >` do vigia do Steam (11) | levava 11b, 11b-bis, 11b-ter, 11c e a conferência | curado |
| `cp -f "${ICON_SRC}"` (4) | o próprio comentário do arquivo conta que este caminho já esteve quebrado | curado |

O do passo 11 era o pior dos quatro, e não pelo `set -e`: o `sed asset >
destino` **cria o arquivo de destino antes de o `sed` rodar**. Com o asset
ausente, a unit ficava no disco **vazia** — e uma unit vazia o systemd aceita
sem fazer nada. Era o vigia do Steam Input existindo e não vigiando. Agora o
arquivo final só nasce se o `sed` tiver dado certo.

**Idempotência:** reexecutar é seguro. Os únicos passos que "acumulam" são os
backups dos `.vdf` da Steam — ver abaixo.

---

## 3. Os arquivos da Steam

**Todo caminho de escrita faz backup ao lado, e todos são restauráveis.**
Conferido um a um:

| quem escreve | backup | forma da escrita |
| --- | --- | --- |
| `scripts/disable_steam_input.sh` | `.bak.steam-input-<ts>` | backup → `cat tmp > vdf` |
| `integrations/steam_launch_options.py` | `.bak.hefesto-launch-<ts>` | backup → tmp → `replace` (atômica) |
| `integrations/sentinela_do_wrapper.py` | idem | idem |
| `integrations/proton_pin.py` | `.bak.hefesto-proton-<ts>` | idem |

Três das quatro são atômicas. O `disable_steam_input.sh` escreve no lugar
(`cat tmp > vdf`, `scripts/disable_steam_input.sh:404`) para preservar o inode
— e o backup já existe nesse instante, então uma queda no meio é recuperável.
O backup só é criado quando há mudança de verdade (`cmp -s`, linha 390), então
o backup mais recente é sempre o estado de antes da última mudança real: o
`--restore` é honesto mesmo depois de N reinstalações.

**O que ninguém faz: podar, ou sequer contar.** Medido na máquina dela em
03/09/2026:

```
234 backups do Hefesto ao lado dos .vdf dela — 30 MB
  203 × localconfig.vdf.bak.hefesto-launch-* / .bak.steam-input-*   (28 MB)
   31 × config.vdf.bak.hefesto-proton-*                             ( 2 MB)
```

Nenhum roteiro os conta, nenhum os reporta, nenhum os poda — e eles vivem
DENTRO do diretório de configuração da conta Steam dela. O vizinho
`scripts/bluez_config.sh` já resolveu o mesmo problema do jeito certo: tem um
verbo `podar` que por padrão **só relata** (`--dry-run` é o default dele) e
nunca apaga sozinho. **A lacuna é ter o equivalente do lado da Steam** — e ela
é de quem mantém aqueles roteiros, não do `install.sh`.

---

## 4. As dependências novas

- **`pactl` e `parec` (a luz do microfone): já entregues.** O censo
  `_DEPS_DE_SISTEMA` do `install.sh` pede o canônico `pactl` com a checagem
  `cmd:pactl,parec` — os DOIS binários, de propósito, porque saem do mesmo
  pacote (`pulseaudio-utils` no apt e no dnf, `libpulse` no pacman) e o dia em
  que uma família os separar é esta linha que grita. Nada a fazer.
- **`playwright`: dívida PAGA hoje.** Dois portões o importam
  (`check_pecas_do_dualsense.py`, `check_cores_do_dualsense.py`) e o
  `pyproject.toml` não o declarava — toda árvore nova nascia com dois portões
  vermelhos. Declarado em `[dev]`, que é o extra que o `install.sh` instala por
  padrão. **Não precisa de `playwright install`**: os dois portões abrem o
  Chrome do sistema por `executable_path`, e há teste que reprova se isso mudar.
  Régua: `tests/unit/test_os_portoes_declaram_o_que_importam.py`, que generaliza
  a regra para `scripts/` inteiro — o próximo `playwright` reprova sozinho.

---

## 5. O que a revisão achou e NÃO curou (não cabia nesta frente)

1. **Dez portões da suíte estão VERMELHOS no `dev`**, medidos antes de eu tocar
   em qualquer arquivo (linha de base rodada com o `install.sh` do `HEAD`):
   - `test_install_respeita_o_nao_e_help_completo::TestPasso7aObedece` (3) — o
     bloco extraído do passo 7a usa `${APP_ID}`, que a chave de 01/09
     introduziu e o preâmbulo do teste não define. Cura: uma linha
     `APP_ID="hefesto-dualsense4unix"` no preâmbulo do teste.
   - `test_o_instalador_que_aprovou_o_monitor::test_install_trata_o_exit_3` — a
     régua procura `"${rc:-0}" -eq 3` e o código virou um `case` em 01/09.
   - `test_portao_reprova_irmao_sem_carona` (6) — o repositório de mentira do
     teste não tem `app/main.py` nem `utils/identidade.py`, e o portão sob
     teste reprova por isso. Nada a ver com o install.
   São arquivos de teste de outra frente; consertá-los aqui seria mexer no que
   não é meu.
2. **`--with-usb-quirk` não é gateado por `--no-udev`, e o passo 3e é.** Os
   dois escrevem o MESMO token no cmdline do kernel, e `--no-udev` está
   documentado como "pula os que tocam `/etc`". `./install.sh --no-udev
   --with-usb-quirk` escreve no bootloader. É explícito o bastante para não ser
   defeito, mas é uma assimetria — e o cabeçalho já diz que a flag é redundante
   com o default.
3. **Os dois portões de `playwright` exigem `/usr/bin/google-chrome`**, que não
   está no censo de dependências e não é empacotado por nenhuma distro. Numa
   máquina sem Chrome eles continuam vermelhos mesmo com o `playwright`
   declarado. A cura honesta é do dono daqueles roteiros (cair para
   `chromium`), não do instalador.
4. **A numeração dos passos diz "N/11" e o install roda mais de quarenta.**
   Entre `3/11` e `4/11` passam treze sub-passos (3b, 3c, 3d, 3d-bis, 3e,
   3e-bis/ter/quater, 3f a 3l). Quem acompanha pela contagem não tem como saber
   quanto falta. É texto que promete uma coisa e faz outra, na categoria mais
   barata; renumerar toca dezenas de réguas que ancoram nesses rótulos, então
   fica registrado em vez de mudado às pressas.

---

## 6. As duas armadilhas que esta frente pagou

Ambas do mesmo feitio, e valem para quem for editar o `install.sh` depois:

**Réguas desta casa acham o corpo de uma cura procurando `nome_host() {` no
texto do `install.sh`.** A primeira versão do ensaio escrevia os dublês assim,
à mão — e SEIS testes passaram a ler o dublê no lugar da cura, reprovando com
"o install parou de conferir o `visudo` antes de gravar o `/etc/sudoers.d`".
Não tinha parado; o texto é que ficou ambíguo. Hoje os dublês nascem de uma
tabela (`_ENSAIO_CURAS_DE_HOST`) por `eval`, e há teste que reprova se alguém
voltar a escrevê-los à mão.

**Réguas ancoram na FORMA da linha, não só no conteúdo.** Trocar
`if bash …/fix_wireplumber_default_source.sh --nunca-dorme` por
`elif bash …` fez o portão do alto-falante dizer que o caminho nativo tinha
perdido a cura; e trocar dois `install -Dm644` literais por um laço com
`${_guard_u}` fez o portão da documentação dizer que o vigia do Steam Input
não instalava mais unit nenhuma. As duas réguas estavam certas. Quando o ensaio
precisa entrar num passo, ele entra **por fora** — `if ensaio; then … else` com
a linha original intacta —, nunca virando o `if` original num `elif`.
