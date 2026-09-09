---
sprint: CABO-BT-PERFIL-CONTROLE-01
estado: aberta
posse:
  CABO-BT-PERFIL-CONTROLE-01:
    - docs/process/sprints/2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md
cria:
  - scripts/check_cabo_bt_perfil_controle.py
bancada: false
depois_de: []
nao_toca:
  - src/
  - docs/data/mapa-controles.csv
---

# CABO-BT-PERFIL-CONTROLE-01 — a régua de pronto de toda feature da tela

**A palavra dela, 08/09/2026, à noite:** *"Quero que vc modifique elas [as
sprints] pra que tudo na interface seja possível os canais de audio as duas
saidas as entradas, tudo funcionando por cabo ou bt ou tudo funcionando via
perfil e dentro de cada um um setting pra cada controle é assim que eu queria
que sua revisao nos auxiliasse."* <!-- noqa-acento: citação literal dela, palavra por palavra -->

É a definição de pronto de 06/09 dita como RÉGUA: **toda feature que a tela
oferece responde quatro perguntas** —

1. funciona pelo **cabo**?
2. funciona pelo **BT**?
3. fica **no perfil**?
4. e, dentro do perfil, é **por controle**?

Uma feature que não responde as quatro não está pronta, e a resposta tem dono:
**cabo/BT** vêm de `docs/data/mapa-controles.csv` (`cabo_aciona` /
`radio_aciona` e a escada `ate_onde_foi`); **no perfil** e **por controle** vêm
de `profiles/schema.py` (`Profile` e `ControllerOverrides`). Ninguém digita a
tabela: ela é LIDA — e é por isso que esta sprint termina num portão.

## §1 — A tabela, lida em 08/09/2026 (mapa + esquema + os gestos das dez abas)

Legenda: ✓ medido no aparelho · ○ só inferido do código (`MONTOU`) · ✗ não ·
— não se aplica · **?** o mapa diz `nao-medido`.

| aba | feature (o gesto na tela) | cabo | BT | no perfil | por controle | o que falta |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | Status Ligado/Desligado (`hefesto`) | ✓ | ✓ | — (é do serviço) | — | — |
| 01 | Modo: Hefesto · Nativo · Controlar o PC · Não mexer (`modo-*`) — **uma fileira para a mesa toda**, na aba Jogar | ✓ | ✓ | ✓ `mode.kind` (`gravar_o_modo_no_ativo`) | — **DECIDIDO por ela, 08/09 à noite: um modo para todos** (*"concordo com as 5"*, `D-0809-O-MODO-E-UM-PARA-TODOS-OS-CONTROLES`); o que é por controle é a máscara | — |
| 01 | Máscara: DualSense · Xbox 360 · Nintendo Pro (`mascara`) — **um chip por CARTÃO**, na aba Jogar (`gamepad.mask.set` recebe `uniq`) | ✓ | ✓ | ✓ `mode.gamepad_flavor` — **uma** por perfil | ✓ mas **fora do perfil**: `controller_masks.json` (`external_mask.py:175`, `mascara_efetiva` `:617`) | **DECIDIDO por ela, 08/09 à noite: entra no perfil** (*"pode entrar sim"*) — [MASCARA-NO-PERFIL-01](2026-09-08-MASCARA-NO-PERFIL-01-a-mascara-por-controle-entra-no-perfil.md) |
| 01 | Reconectar Controles · cadeado do perfil | ✓ | ✓ | — | — | JOGAR-02 (a frase) |
| 02 | Microfone: ligar e ser ouvido no canal dele (`mic-modo`) | ✓ um eleito | ✓ com a ponte de pé (07/09) | ✓ `mic` + `ControllerMicOverride` | ✓ campo · **✗ ato** (um eleito por vez) | **quatro microfones VIRTUAIS, um por controle, com nome estável** — MIC-OS-QUATRO-01 (medido 08/09 23h: 2 fontes USB, 0 BT, 0 virtual) |
| 02 | Mudo do microfone (`mudo`) | ✓ | ○ `parcial` | ✓ | ✓ | medir o mudo por BT no aparelho (linha 20 da mesa) |
| 02 | Volume do microfone | ✓ na FONTE do sistema (`mic.volume.set`, MIC-VOLUME-01) · ✗ o byte do aparelho, `decisao-tomada` (06/09) | ✓ idem · ✗ idem | ✓ `ControllerMicOverride.volume` | ✓ | **fato corrigido 09/09:** o campo TEM ato (o ganho da fonte); o que não tem é o byte `common[6]`. **DECIDIDO por ela, 09/09 (*"3-c"*): liga o byte, depois da bancada** — [MIC-VOLUME-02](2026-09-09-MIC-VOLUME-02-o-byte-do-aparelho-medido-e-ligado-ao-campo.md) |
| 02 | Alto-falante — **saída 1**: rota e volume (`rota`, `volume`) | ✓ rota obedeceu (16/08) · ○ volume | **✗** `divida` — seis passadas em silêncio (08/09) | ✓ `speaker` + `ControllerOverrides.speaker` | ✓ | o som por BT — ensaio 13 do índice do rádio; o **nó de som por controle** VIVO na lista (medido 08/09 23h: nenhum «Alto-falante do Controle N» na mesa dela, apesar de duas sprints `feita`); e a **fonte por controle — o mix completo (HDMI) ou só o canal de SFX** — [SOM-POR-CONTROLE-01](2026-09-08-SOM-POR-CONTROLE-01-o-mix-completo-ou-o-canal-de-sfx-caindo-em-cada-controle.md) |
| 02 | Fone — **saída 2** (`audio.jack.volume`, `audio.jack.deteccao`) | ○ `MONTOU` | ○ `MONTOU` | **✗** não há campo: o byte do fone sai com o MESMO valor do alto-falante em todo `set_speaker_volume` (mapa, `audio.jack.volume`) | **✗** | o fone TOCA no cabo (caderno `sfx-o-fone-manda-por-cima`, 15/08); o VOLUME dele nunca foi variado sozinho, e o kernel não define o bit que o autoriza. **DECIDIDO por ela, 09/09 (*"1-b"*): campo próprio, depois da bancada** — [FONE-01](2026-09-09-FONE-01-a-segunda-saida-ganha-volume-proprio-no-perfil-por-controle.md) |
| 02 | Giroscópio / acelerômetro — interruptor (`sensor`) | ✓ | ✓ | ✓ `ControllerSensoresOverride` | ✓ | a ENTREGA ao jogo — SENSORES-NO-JOGO-01 |
| 02 | Touchpad | ✓ até o vpad | ✓ até o vpad · **✗ no jogo** (16/08, sem causa) | — | — | o mesmo degrau dos sensores |
| 03 | Efeito do L2 e do R2 (`modo`, `pronto`) | ✓ obedeceu (11/08) | ✓ obedeceu | ✓ `triggers` + `ControllerOverrides.triggers` | ✓ | «Todos» e herdar (linha 14 da mesa) |
| 04 | Cor da barra (`cor`) | ✓ (12/08) | ✓ (12/08) | ✓ `leds` + `ControllerOverrides.leds` | ✓ | a troca de cor — COR-TROCA-01 |
| 04 | Brilho da barra (`brilho`) | ○ é a cor escalada em Python (o caminho é o da cor, ✓ 12/08; o escuro em si ninguém olhou) | ○ idem | ✓ `lightbar_brightness` | ✓ | **fato corrigido 08/09:** o `nao-medido` do mapa é o brilho de HARDWARE (`luz.lightbar.brilho`, `common[42]`, 3 níveis), outra grandeza — nem o kernel a escreve, e o produto não a oferece. **DECIDIDO por ela, 09/09 (*"2b"*): medir a de hardware na bancada** — [BRILHO-DE-HARDWARE-01](2026-09-09-BRILHO-DE-HARDWARE-01-o-byte-que-nem-o-kernel-escreve-medido-na-bancada.md) |
| 04 | Luzes de jogador · cores automáticas (`player`, `auto-cores`) | ✓ (11/08) | ✓ | ✓ `player_leds`, `auto_player_colors` | ✓ | `release_leds` só BT `parcial` |
| 05 | Força/degrau · barra por motor · testar (`forca`, `intensidade`, `motor`) | ✓ obedeceu (15/08) | ✓ obedeceu | ✓ `rumble` + `ControllerRumbleOverride` | ✓ | a premissa física por motor — VIBRA-MULT-01; haptics VCM `divida` nos dois |
| 06 | Controlar o PC: mouse, teclado, remapeamento, atalhos | ✓ | ✓ | ✓ `mouse`, `key_bindings`, `button_actions`, `teclado_emulado` | — **DECIDIDO por ela, 08/09 à noite: global no perfil** (`D-0809-A-NAVEGACAO-E-GLOBAL-NO-PERFIL`) | — |
| 07 | Lançadores: a biblioteca e «os controles chegam» | — | — | ✓ `match` por jogo (só Steam hoje) | — | os cinco além da Steam — LANCADORES-ZERO-01 |
| 08 | Pareamento · luz que não acende · entradas e hub · teto da vibração | ✓ | ✓ | — (é da máquina: `maquina.json`) | — | LUZ-NO-RADIO-01 (a prova por BT) |
| 09 | Autostart · perfil da mesa · corrigir modo · Proton | — | — | — (é do serviço/máquina) | — | — |
| 10 | Salvar · Importar · Exportar · o perfil vivo sem Salvar | — | — | é o próprio perfil | ✓ `controllers{uniq}` | linha 13 da mesa |

**O que a tabela diz em uma frase:** as seis famílias que ela nomeia —
gatilho, luz, vibração, som, microfone, sensores — **já são por controle no
esquema** (`ControllerOverrides`, `schema.py:1305-1310`). O que falta é de
três tipos, e cada um tem uma cura diferente:

| tipo | quais | cura |
| --- | --- | --- |
| **transporte** | alto-falante por BT · mic (os quatro) · touchpad no jogo por BT | bancada + ensaio; são as sprints MIC-OS-QUATRO-01, o índice do rádio e SENSORES-NO-JOGO-01 |
| **campo que não existe ou mora fora** | fone (sem campo — **decidido 09/09: ganha**, FONE-01) · máscara por controle (fora do perfil — **decidido: entra**) · volume do mic (o byte do aparelho quieto — **decidido 09/09: liga**, MIC-VOLUME-02) | as três sprints, com a bancada antes do campo |
| **decisão de produto** | modo por controle · navegação por controle | **decididas em 08/09 à noite: nenhuma das duas** — um modo para todos, navegação global (*"concordo com as 5"*) |

## §2 — O que esta sprint entrega

1. **`scripts/check_cabo_bt_perfil_controle.py`** — o portão que GERA a
   tabela acima e reprova toda feature da tela sem as quatro respostas. As
   fontes: os `data-gesto` das dez páginas publicadas (é a lista de features,
   lida, nunca digitada), o mapa (cabo/BT) e o esquema (perfil/por controle).
   Entra no `portoes.sh` e no `ci.yml`. O que hoje é `nao-medido` ou `✗`
   reprova com o nome da feature e a coluna.
2. **Todas as sprints abertas ganham o bloco «Critério de pronto — por cabo ·
   por BT · no perfil · por controle»** — feito em 08/09 à noite, nas onze.
   Uma sprint que fecha uma feature sem as quatro colunas não fecha.
3. **As decisões dela.** Uma já está tomada (08/09 à noite): **a máscara por
   controle entra no perfil** — [MASCARA-NO-PERFIL-01](2026-09-08-MASCARA-NO-PERFIL-01-a-mascara-por-controle-entra-no-perfil.md). As outras duas também (08/09 à noite, *"concordo com as 5"*): o modo é
   um para todos os controles; a navegação é global no perfil. As três
   menores também, em 09/09 de madrugada (*"1-b;2b;3-c;4a"*): o fone ganha
   campo, o brilho de hardware se mede, o byte do mic liga — item 4.
4. **As sprints que nascem da tabela**: [SOM-POR-CONTROLE-01](2026-09-08-SOM-POR-CONTROLE-01-o-mix-completo-ou-o-canal-de-sfx-caindo-em-cada-controle.md) (nasceu em 08/09, do recado dela: o mix completo ou o canal de SFX, por controle, cabo e BT); e as três que ela decidiu em 09/09: [FONE-01](2026-09-09-FONE-01-a-segunda-saida-ganha-volume-proprio-no-perfil-por-controle.md)
   (a saída 2 ganha campo próprio, depois de a orelha dela ouvir o byte);
   [BRILHO-DE-HARDWARE-01](2026-09-09-BRILHO-DE-HARDWARE-01-o-byte-que-nem-o-kernel-escreve-medido-na-bancada.md)
   (o byte de 3 níveis, medido com e sem o bit); [MIC-VOLUME-02](2026-09-09-MIC-VOLUME-02-o-byte-do-aparelho-medido-e-ligado-ao-campo.md)
   (o byte do aparelho, medido e ligado ao campo que já age na fonte).

## §3 — O que MORDE

* tirar `speaker` de `ControllerOverrides` no esquema → o portão reprova
  «alto-falante: por controle ✗», nomeando a aba e o gesto;
* trocar `radio_aciona` de `luz.lightbar.cor@dualsense` para `não` → reprova
  «cor: BT ✗»;
* acrescentar um `data-gesto` novo numa página sem linha na tabela → reprova
  «feature sem as quatro respostas». **É a mordida que importa:** a próxima
  feature nasce com a régua em cima dela, e não com a tabela envelhecendo.
