---
sprint: LANCADORES-ZERO-01
estado: aberta
posse:
  LANCADORES-ZERO-01:
    - src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py
    - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - src/hefesto_dualsense4unix/integrations/jogos_locais.py
cria:
  - src/hefesto_dualsense4unix/integrations/censo_dos_lancadores.py
bancada: false
depois_de: []
---

# LANCADORES-ZERO-01 — a aba ACHA os seis e não identifica nenhum: o censo por lançador

**Reportado por ELA em 08/09/2026, à noite, com o produto instalado e um print.**
Palavras dela: *"a aba lançadores tá identificando nada."* E, com o print:
*"todos esses apps tão instalados agora no meu pc. pq não identificou? se é um
problema com o ambiente flatpak construir o identificador é parte da solução a
ser implementada. É nesse tipo de coisa que eu quero que vc note e construa as
sprints."*

## §1 — O que o print mostra, e ele derruba a primeira leitura

| cartão | selo | corpo |
| --- | --- | --- |
| Steam | **CHEGAM** | 23 jogos instalados · o atalho de inicialização em 64 jogos · «Desligado — tudo certo» |
| Heroic (Epic · GOG) | **NÃO SEI** | *Achei este lançador aqui* (`…/flatpak/exports/share/applications/com.heroicgameslauncher.hgl.desktop`) |
| Lutris · RetroArch · Dolphin · mGBA | **NÃO SEI** | *Achei este lançador aqui* (o `.desktop` do flatpak de cada um) |
| Flatpak | **NÃO SEI** | *Achei este lançador aqui* (`/usr/bin/flatpak`) |

E o cabeçalho: **«6 encontrados · 0 com impedimentos»**.

**O produto ACHOU os seis.** A busca por `.desktop` e por `PATH`
(`a07_lancadores._onde_estao_os_lancadores`, `:367`) funciona, o ambiente do
processo dela enxerga as pastas do flatpak (lido em `/proc/<pid>/environ`), e a
hipótese *"a lista não cobre o flatpak"* está morta duas vezes.

**O que ela chama de «identificar» é o que o cartão da Steam faz e os outros
cinco não fazem:** ler a biblioteca, contar os jogos, dizer se os controles
chegam neles e consertar quando não chegam. Para os cinco, o produto responde
literalmente **«NÃO SEI»** — `cartao_sem_censo` (`desenho_dos_lancadores.py:1454-1509`)
dá esse selo a todo lançador **achado**, porque o selo responde *«sei ler a
biblioteca dele?»*, e a resposta honesta hoje é não. A tela está certa sobre o
produto e errada sobre o que ela precisa: um selo grande e negativo sobre um
lançador instalado lê-se como *"não identificou"*.

## §2 — O que «identificar» exige, peça por peça — o modelo é a Steam

O cartão da Steam tem três coisas que os outros não têm, e os três já têm dono:

| peça | na Steam | nos outros cinco |
| --- | --- | --- |
| **a biblioteca** (quais jogos existem, quais estão instalados) | `steam_launch_options.py` lê o `localconfig.vdf` e os `appmanifest_*.acf` | **ninguém lê nada** — `grep -rl "heroic\|lutris\|retroarch" src/` só acha prosa |
| **o veredito** (os controles chegam? o que impede?) | `sentinela_do_wrapper.censo_do_wrapper` + `prontuario_dos_jogos.py` (impedimento NOMEADO, nunca «funciona») | não existe |
| **a cura** (o caminho até o jogo) | `hefesto-launch %command%` na opção de inicialização, por `SteamAppId` | não existe — e o wrapper de hoje **não serve** para eles, ver §4 |

## §3 — Onde a biblioteca de cada um MORA, medido na máquina dela em 08/09

Um flatpak guarda tudo em `~/.var/app/<app-id>/` — `config/` faz as vezes de
`~/.config` e `data/` de `~/.local/share`. O nativo guarda em `~/.config` e
`~/.local/share`. **O censo lê os dois lugares, e o `.desktop` achado diz qual
é o caso** (o caminho do flatpak tem `flatpak/exports` nele).

| lançador | onde está a biblioteca (flatpak) | o que havia lá em 08/09 |
| --- | --- | --- |
| **Heroic** — **a Epic fica aqui dentro, decisão dela de 08/09** (*"dentro heróic"*) | `config/heroic/store_cache/legendary_library.json` (`library`, Epic) · `gog_library.json` (`games`) · `nile_library.json` (Amazon) · `*_install_info.json` (os instalados) · `GamesConfig/<app>.json` (config por jogo) | **35 jogos da Epic e 2 da GOG na biblioteca, 0 instalados, 0 `GamesConfig`** |
| **Lutris** | `config/lutris/games/*.yml` (um por jogo) e `data/lutris/pga.db` | nunca aberto — não há `config/` |
| **RetroArch** | `config/retroarch/playlists/*.lpl` (as listas de ROM) | nunca aberto |
| **Dolphin** | `config/dolphin-emu/Dolphin.ini` (`ISOPath0..N`) e o cache de jogos | nunca aberto |
| **mGBA** | `config/mgba/` (recentes e pastas) | nunca aberto |
| **Flatpak** | não é lançador: é o **runtime** dos outros cinco. O cartão dele responde outra pergunta (§5) | — |

**«Nunca aberto» é uma resposta, e é melhor do que «NÃO SEI»:** o cartão diz
*"abra o Lutris uma vez e eu leio a biblioteca"* — sem confessar dívida, porque
não é dívida: não há o que ler.

## §4 — «Os controles chegam»: o que o wrapper faz, e por que ele não alcança o sandbox

`assets/hefesto-launch.sh` (instalado em `~/.local/share/hefesto-dualsense4unix/bin/`)
é **ambiente e só ambiente**: lê o `SteamAppId`, abre
`~/.local/state/hefesto-dualsense4unix/launch_env/steam_app_<id>.env` (escrito
pelo daemon, `daemon/launch_env.py`), confere que o daemon está vivo, e exporta
`SDL_GAMECONTROLLER_IGNORE_DEVICES`, `SDL_JOYSTICK_HIDAPI`,
`SDL_GAMECONTROLLER_USE_BUTTON_LABELS`, `PROTON_DISABLE_HIDRAW` e as duas do
cache de shader. **Sem `SteamAppId` ele não faz nada** — e nenhum dos cinco
tem um.

Então «chegar» a um jogo de outro lançador é **entregar as mesmas variáveis por
outra estrada**, e a estrada existe para cada um:

| lançador | como o ambiente entra | por jogo? |
| --- | --- | --- |
| Heroic | `GamesConfig/<app>.json` tem `enviromentOptions` (e `wrapperOptions`, que NÃO serve: o binário do host não existe dentro do sandbox) | sim |
| Lutris | o `.yml` do jogo tem `system: env:` | sim |
| RetroArch · Dolphin · mGBA | o emulador é UM processo para todos os jogos: `flatpak override --user --env=NOME=VALOR <app-id>` — e o perfil casa pelo nome do processo, que já é o que o cartão promete | por emulador |
| qualquer flatpak | o vpad é um nó do kernel (`/dev/input`, `/dev/hidraw`) e os cinco têm `devices=all` (medido: `flatpak info --show-permissions`) — **o jogo dentro do sandbox VÊ o controle virtual**; o que falta é o ambiente | — |

**O daemon já sabe calcular o ambiente por ponte** (`launch_env.py`: máscara
DualSense esconde o físico por `IGNORE_DEVICES`; Xbox e Nintendo desligam o
HIDAPI). O que não existe é a chave: o `.env` é por `steam_app_<id>`. Para os
outros, a chave é o jogo do lançador (Heroic `app_name`, Lutris `slug`) ou o
`app-id` do emulador — e ela vira `match` de perfil como qualquer outro.

## §5 — O que esta sprint entrega, na ordem

1. **`integrations/censo_dos_lancadores.py`** — um leitor por lançador, com o
   MESMO contrato do prontuário da Steam: devolve jogos (nome, instalado?,
   caminho) e **nunca diz «funciona»**; diz `IMPEDIDO` com a cura ao lado,
   `SEM_IMPEDIMENTO_CONHECIDO`, ou `NUNCA_ABERTO`. Lê `~/.var/app/<id>/…` e o
   caminho nativo, pelo que o `.desktop` achado disser.
2. **O cartão passa a responder três perguntas, em três lugares:** o selo diz
   **LOCALIZADO / NÃO LOCALIZADO** (uma pergunta só: *"está aqui?"*); a linha
   de baixo diz **«37 jogos na biblioteca · 0 instalados»** (o censo); e o
   veredito **CHEGAM / NÃO CHEGAM** só aparece quando o censo existe — como na
   Steam. **A palavra é dela** (*"Deveria ter Não Localizado"*, 08/09 pela
   manhã — já em `SELOS["off"]`; `D-0809-O-SELO-DOS-LANCADORES-DIZ-LOCALIZADO`):
   o positivo é **LOCALIZADO**, o cabeçalho «6 encontrados» passa a «6
   localizados», e o par vai para a
   [LÍNGUA DESTA CASA](../../A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md)
   antes da tela.
3. **A cura por estrada** (§4): Heroic e Lutris por jogo, emuladores por
   `flatpak override`. É a MESMA conta do `launch_env.py`; muda só a chave e o
   arquivo em que ela é escrita. O botão do cartão que hoje só «Abre o
   lançador» ganha o irmão da Steam: *"Consertar"*, que escreve o ambiente e
   diz o que escreveu.
4. **O cartão «Flatpak» muda de pergunta:** ele não tem biblioteca; o que ele
   sabe dizer é *"o vpad entra no sandbox dos seus lançadores?"* — lendo as
   permissões (`devices=all`) de cada flatpak achado. É o único cartão em que o
   flatpak é o assunto.
5. **`hefesto_vivo.py:123` — `SEM_PACOTE` e os três comentários (`:3071`,
   `:3133`, `:3383`) saem.** Nenhuma linha lê a constante, e a prosa diz que a
   07 não tem pacote — tem (`a07_lancadores.pacote`, `:1491`). Fato errado se
   substitui.

## §6 — Critério de pronto — por cabo · por BT · no perfil · por controle

| | |
| --- | --- |
| **cabo / BT** | não se aplica ao lançador: o que chega ao jogo é o vpad, e o vpad é o mesmo nos dois transportes. O que muda por transporte já está no mapa por feature, não por lançador |
| **no perfil** | o jogo de um lançador ganha `match` como o da Steam (`profiles/schema.py`, `MatchCriteria` por processo e janela) — e a ponte confirmada (`PonteConfirmada`) grava por jogo, não só por `steam_app_<id>` |
| **por controle** | não se aplica: o lançador não sabe de controle. O que é por controle (máscara, luz, gatilho, vibração, som, mic, sensores) vem do perfil que o jogo ativa |

## §7 — O que MORDE

* numa casa de mentira com um `~/.var/app/com.heroicgameslauncher.hgl/config/heroic/store_cache/legendary_library.json`
  de 3 jogos → o cartão diz **3 jogos**, e NÃO diz «NÃO SEI»; sem o arquivo →
  «nunca aberto». Arrancar o censo e a régua reprova nomeando o cartão;
* o `.env` de um jogo do Heroic → o `GamesConfig/<app>.json` ganha as MESMAS
  variáveis que o `steam_app_<id>.env` daquela ponte, byte a byte — e o cartão
  diz o que escreveu;
* um `.desktop` de editor de texto NÃO vira cartão (a mordida da
  LANCADOR-ACHADO-01 continua valendo);
* `grep -n SEM_PACOTE src/` devolve zero linhas;
* a régua lê a página pelo piloto (`--oculta`), nunca o gerador.

## §8 — O que NÃO é desta sprint

A busca por **conteúdo** de `.desktop` (`Categories=Game`, `MimeType` de ROM) é
a [LANCADOR-ACHADO-01](2026-09-08-LANCADOR-ACHADO-01-o-produto-so-acha-o-que-a-lista-adivinhou.md)
— ela acha lançadores que a lista não conhece; esta lê a biblioteca dos que já
foram achados. As duas dividem `jogos_locais.py`: a ACHADO vem depois.
