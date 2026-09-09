---
sprint: FONE-01
estado: aberta
posse:
  FONE-01:
    - src/hefesto_dualsense4unix/core/backend_pydualsense.py
    - src/hefesto_dualsense4unix/core/ds_output_report.py
cria:
  - scripts/ensaios/o_fone_tem_volume_proprio.py
bancada: true
depois_de: [SOM-POR-CONTROLE-01, MASCARA-NO-PERFIL-01]
nao_toca:
  - docs/data/ensaios.csv
  - docs/data/mapa-controles.csv
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
---

# FONE-01 — a segunda saída ganha volume próprio no perfil, por controle

**Decisão dela, 09/09/2026 de madrugada** (`D-0909-O-FONE-GANHA-CAMPO-PROPRIO`):
entre *um volume só, com a rota dizendo para onde vai* e *campo próprio de fone
no perfil, por controle, medido com o ouvido*, ela escolheu o campo próprio —
*"1-b"*.

## §1 — O que existe, medido

| | onde | o que diz |
| --- | --- | --- |
| o fone TOCA no cabo | caderno, `sfx-o-fone-manda-por-cima` (15/08, olho dela) | rota 2, canal 1: **com fone, ela ouviu no fone direito; sem fone, no alto-falante**. O fone manda por cima da rota |
| o volume do fone | mapa, `audio.jack.volume@dualsense` — `MONTOU` nos dois transportes | `common[4]`, teto `0x7F`, flag0 `0x10`. **Sai sempre com o MESMO valor do alto-falante**: `set_audio_volumes(headphone=efetivo, speaker=efetivo)` (`backend_pydualsense.py:4651`), e a docstring diz por quê (`:4744-4750`): *«é UM volume só para quem segura o controle, e (…) deixar o fone em zero faria a cura silenciar justamente quem plugasse um headset»* |
| o bit que autoriza | `ds_output_report.py:101`, `VALID_FLAG0_HEADPHONE_VOLUME = 0x10` | **o kernel desta máquina não define bit4** — define os bits 5, 6 e 7 (alto-falante, mic, audio_control). O `0x10` é de comunidade. Ninguém variou `common[4]` sozinho e ouviu |
| no perfil | `ProfileSpeakerConfig` (volume, muted, rota) + `ControllerOverrides.speaker` | **não há campo de fone**; a tela 02 tem o gesto `audio.jack.volume` sem dono no perfil |

**A razão medida do volume único continua valendo e vira o DEFAULT:** o campo
novo nasce `None` = *igual ao alto-falante*. Só um valor explícito faz o fone
divergir — quem pluga um headset nunca cai no silêncio.

## §2 — O que esta sprint entrega, na ordem

1. **A bancada primeiro** (`scripts/ensaios/o_fone_tem_volume_proprio.py`):
   com o fone plugado no P2 (cabo) e depois no P1 (rádio), escrever
   `common[4]` em `0x00`, `0x40` e `0x7F` **com o alto-falante fixo**, flag0
   `0x10` ligado, e ela ouvir. Três respostas possíveis, e cada uma decide o
   resto: o fone obedece ao byte (segue o item 2); obedece só com o bit; ou
   não obedece a nada — e então o campo **não nasce**, a decisão volta a ela
   com o número, e a linha do caderno é o que sobra.
2. **O campo, se o aparelho obedecer:** `ProfileSpeakerConfig.fone_volume:
   int | None` e o mesmo em `ControllerOverrides.speaker` — **o `schema.py` é
   posse da SOM-POR-CONTROLE-01 e da MASCARA-NO-PERFIL-01; esta sprint vem
   depois das duas e escreve o campo ali, na vez dela.** `None` = igual ao
   alto-falante.
3. **O ato:** `set_audio_volumes(headphone=fone_ou_efetivo, speaker=efetivo)`
   — uma linha no `backend_pydualsense.py:4651`, e a docstring de `:4744`
   ganha a nota datada: o volume único virou default, não regra.
4. **A tela 02** liga o gesto `audio.jack.volume` ao campo (a página é posse
   da SOM-POR-CONTROLE-01; entra na vez dela). O `?` da tela explica: *«vazio
   = igual ao alto-falante»*.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| | |
| --- | --- |
| **cabo** | pronto = P2 com fone: alto-falante a 100 % e fone a 0 → silêncio no fone; fone a 100 → som; a rota não muda |
| **BT** | o mesmo com o P1 — `common[4] = report[7]` no `0x31`, flag0 `0x10`; se o rádio não obedecer, o caderno diz e o campo vale só no cabo (a tela diz isso sem confessar dívida) |
| **no perfil** | ✓ `speaker.fone_volume`, `None` por omissão; perfil velho carrega igual |
| **por controle** | ✓ `ControllerOverrides.speaker.fone_volume`; pronto = P2 com fone a 0 e P3 com fone a 100, ao mesmo tempo |

## O que MORDE

* arrancar o `headphone=` próprio e devolver `efetivo` → a régua reprova: o
  ensaio com fone a 0 e alto-falante a 100 ouve som no fone;
* `fone_volume=None` → o byte sai IGUAL ao do alto-falante, byte a byte, como
  hoje (a régua compara o report cru);
* a linha do caderno nasce com `observado_por = olho-dela` (é orelha, mas a
  coluna é essa) — sem linha, a sprint não fecha.
