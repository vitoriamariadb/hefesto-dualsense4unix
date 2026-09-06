---
sprint: ONDA-PERFIS-02
estado: absorvida
# onda: PERFIS
posse:
  P2:
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - src/hefesto_dualsense4unix/profiles/simple_match.py
    - src/hefesto_dualsense4unix/profiles/loader.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-PERFIS-02-funciona-em-qual-ambiente.md
  - tests/unit/test_ambiente_do_perfil_tem_cinco.py
  - tests/unit/test_migracao_dos_ambientes_aposentados.py
bancada: false
depois_de:
  - ONDA-PERFIS-01          # main.glade e profiles_actions.py: a casca vem antes
  - LEVA-2  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - assets/profiles_default/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 10). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA PERFIS · 02 — "Funciona em qual ambiente?", com cinco

**O defeito em uma frase:** o seletor se chama "Aplica a" e oferece **sete**
contextos, três dos quais são listas de programas desta bancada que ninguém
mais tem — e o desenho aprovado tem **cinco**, com nome de pergunta.

Hoje: `profiles_actions.py:128-136`

```python
_APLICA_A_ITEMS = [("any","Qualquer"), ("steam","Steam"), ("browser","Navegador"),
                   ("terminal","Terminal"), ("editor","Editor"),
                   ("game","Jogo"), ("steam_game","Jogo da Steam")]
```

Alvo: `10-perfis.html:584-589` — **Todos · Steam · Estilo de Jogo · Jogo ·
Jogo da Steam**, sob o rótulo *"Funciona em"*.

## Por que os três saem, com a palavra dela

- **Navegador** — D-NAVEGADOR-SAI-DO-SELETOR: *"não precisamos de um perfil pra
  navegação ali. Temos isso na guia status e temos o navegação (aqui se meu
  perfil atual mortal kombat tiver com controle e mouse ativado ele vai se
  comportar dessa forma ao usar o controle)."* Sai o **ambiente**, não o perfil
  `navegacao.json`, que tem decisão em contrário (D-PERFIL-NAVEGACAO: *manter e
  renomear*).
- **Editor** — D-APLICA-A-VIRA-AMBIENTE, escrito.
- **Terminal** — a lista nova não o traz e a decisão escreveu o motivo só do
  Editor. **É pergunta dela** (ver o fim).

E o preço de mantê-los já está medido no próprio código
(`simple_match.py:44-64`): as três listas somavam doze programas, os **desta
bancada em julho**. Onze programas comuns — `ptyxis`, `foot`, `wezterm`,
`xterm`, `vivaldi`, `zen`, `org.gnome.Epiphany`, `gedit`, `org.kde.kate`,
`emacs`, `vim` — reprovavam, e o perfil nascia **nunca casando, em silêncio**.

## O que entrega

1. **Cinco itens, com os ids que o disco já entende**: `any` → **Todos**,
   `steam` → **Steam**, `estilo` → **Estilo de Jogo** (novo id, cujo conteúdo é
   da ONDA-PERFIS-04), `game` → **Jogo**, `steam_game` → **Jogo da Steam**.
   O rótulo do campo vira `Funciona em`.
2. **"Jogo" é o caminho principal, Steam é atalho** (D-A-INTERFACE-E-UNIVERSAL-
   NAO-SO-STEAM). Na ordem do mockup, e o `Jogo` é o que o perfil novo escolhe
   quando o Detectar acha jogo fora da Steam (ONDA-PERFIS-03).
3. **`simple_match.py` perde `_NAVEGADORES`, `_TERMINAIS` e `_EDITORES`** e as
   entradas correspondentes de `SIMPLE_MATCH_PRESETS`.
4. **Migração para o disco dela, em `loader.py`** — irmã das que já existem
   (`migrate_coop_local_match:270`, `migrate_profiles_coop_default:349`,
   `migrate_modo_jogo_nos_presets:416`). Perfil salvo com o preset de navegador,
   terminal ou editor **não pode virar `MatchAny` nem sumir**: ele guarda hoje
   um `MatchCriteria` com a lista de `window_class` já expandida, e essa regra
   continua válida — o que sai é o **botão**, não a regra gravada. A migração
   apenas garante que o editor abra esse perfil sem inventar valor: sem item
   correspondente, o seletor mostra `Todos` e a regra do disco é preservada
   pelo `_regra_do_disco` que já existe (`profiles_actions.py:1287`).
5. **A explicação de cada ambiente vira dica**, não texto na tela
   (D-TUDO-QUE-EXPLICA-VIRA-DICA). O `?` do quadro já traz o parágrafo
   (`10-perfis.html:110-121`).

## Como se prova (o teste que morde)

`tests/unit/test_ambiente_do_perfil_tem_cinco.py`:

1. `_APLICA_A_ITEMS` tem **exatamente cinco** ids, nesta ordem:
   `any, steam, estilo, game, steam_game`. Mordida: devolva `browser` à lista e
   veja reprovar dizendo qual sobrou.
2. Nenhum dos ids aposentados aparece em `SIMPLE_MATCH_PRESETS`.
3. `from_simple_choice("estilo", ...)` sem estilo escolhido **recusa com frase
   de gente** — a mesma disciplina do R-12 que já vale para `game` e
   `steam_game` (`simple_match.py:26-38`), senão o perfil nasce catch-all e
   entra na disputa. Mordida: faça a função devolver `MatchAny()` e veja
   reprovar.

`tests/unit/test_migracao_dos_ambientes_aposentados.py`: escreve num `tmp_path`
um perfil com a regra de navegador que o produto gravava, roda a migração, e
exige que **os `window_class` continuem byte a byte os mesmos**. Mordida: faça
a migração reescrever o match e veja reprovar.

## O que é dela decidir

1. **"Terminal" sai junto com "Editor"?** A lista nova não o traz; a decisão
   escreveu o motivo só do Editor (redesenho, "O que ainda falta decidir" §1 da
   aba Perfis). Esta sprint assume que **sai** e a migração preserva a regra de
   quem já salvou — reversível numa linha.
2. **Um perfil salvo como "Navegador" deve ganhar nome novo na lista?** Ele
   passa a aparecer como `Todos` ou como `Só neste programa`, sem dizer que já
   foi um ambiente com nome.
