---
sprint: PERFIS-SAO-PERFIS-01
estado: aberta
posse:
  PF:
    - src/hefesto_dualsense4unix/profiles/loader.py
    - assets/profiles_default/
    - tests/unit/test_perfil_padrao_personalizado_01.py
cria:
  - assets/estilos_de_jogo/
  - tests/unit/test_os_generos_nao_sao_perfis.py
bancada: false
depois_de: [ONDA1-X-OS-FATOS-01]
nao_toca:
  - src/hefesto_dualsense4unix/profiles/simple_match.py
  - src/hefesto_dualsense4unix/profiles/manager.py
  - src/hefesto_dualsense4unix/app/actions/perfis_web.py
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/interface/
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
---

# PERFIS-SAO-PERFIS-01 · DEFEITO — os gêneros viram Estilo de Jogo, e os perfis de jogo ficam só com nome e id

> **A palavra dela, 06/09/2026:** *"os perfis que voltaram não fazem sentido.
> ação, aventura, corrida. Isso não é perfil, isso é estilo de jogo."*
>
> Sobre os gêneros: **"somem da lista e da semeadura"** (os arquivos ficam).
> Sobre os 24 perfis por jogo: *"ficam se o sistema antigo tiver sido adaptado
> pro novo sistema de perfis. caso contrário mantemos só o nome e o id pra eu
> reconfigurar um a um."*

**Ela já tinha decidido isto em 03/09** — `D-APLICA-A-VIRA-AMBIENTE`
(`docs/data/decisoes-dela.csv`): *"os gêneros viram Estilo de Jogo"*, e a decisão
8 de `2026-09-03-AS-DOZE-DECISOES-DELA-*.md`: o Estilo de Jogo é **motor a
construir**. O produto não obedeceu: a aba Perfis lista os nove como perfis.

---

## 1. O QUE SE MEDIU NO DISCO DELA (06/09, 02:50 — só leitura)

| o que | número | prova |
| --- | --- | --- |
| perfis em `~/.config/hefesto-dualsense4unix/profiles/` | **33** | `ls` |
| de gênero (`acao`, `aventura`, `corrida`, `esportes`, `fps`, `navegacao`, `point_and_click`, `fallback`) mais `personalizado` | **9**, datados de **29/08 23:02** (não foram ressemeados em 05/09) | `stat` |
| por jogo (`stray`, `pragmata`, `black_myth_wukong`, …), criados por `_talvez_semear_jogos` | **24**, datados de 29/08 23:02 | `stat`, `profiles/loader.py:640-` |
| fonte da semeadura de gênero | `assets/profiles_default/` (9 arquivos), `_DEFAULT_SEED_SOURCE_DIRS` (`loader.py:150-154`), marcador `.seeded_presets` que respeita deleção (`:178-215`) | lido |
| forma de um perfil de jogo (`stray`) | chaves `name · match · priority · leds · rumble · triggers · suppress_desktop_emulation · version`; `match = window_class ["steam_app_1332010"]`; **sem `controllers`, sem `mode`** | `json` |
| o que difere do `personalizado` de hoje | só `priority` e `leds` — o resto é o molde de 29/08 copiado | comparação chave a chave |

**Leitura:** os 24 perfis de jogo são o molde de 29/08 com um `match`. Nenhum
tem a seção por controle do sistema novo; nenhum foi tocado por ela desde que
nasceu (mesma data, mesmo minuto). Pela regra dela: **ficam só com nome e id.**

---

## 2. O TRABALHO

### Passo 1 — os gêneros saem da semeadura e ganham a casa deles

Os oito arquivos de gênero saem de `assets/profiles_default/` para
`assets/estilos_de_jogo/` (a fonte das receitas do motor que a decisão 8 manda
construir). `assets/profiles_default/` fica só com `personalizado.json`.
`seed_default_presets` não muda uma linha: ele copia o que há na pasta.

**A MORDIDA:** `test_os_generos_nao_sao_perfis::test_a_semeadura_so_conhece_o_personalizado`
— com a pasta de fábrica de hoje, semear num diretório vazio produz UM arquivo.

### Passo 2 — os gêneros já semeados saem da lista, sem apagar

Migração one-shot no `loader` (o molde é `migrate_default_profile_name`, com
marcador): os oito arquivos de gênero que estiverem no diretório de perfis e
**forem byte-idênticos ao de fábrica** (ela não os editou) vão para a subpasta
`profiles/estilos-de-jogo/`, que `list_profiles` não varre. Um que ela tenha
editado **fica** — editado é perfil dela, seja qual for o nome — e o relatório
o nomeia.

**A MORDIDA:** ponha um `acao.json` editado e um intocado; a migração move um
e deixa o outro, e a lista da aba 10 (via `profile.list`) mostra só o editado.

### Passo 3 — os perfis de jogo intocados ficam só com nome e id

Para cada perfil cujo `match` é `steam_app_<id>` e cujos campos além de
`name`/`match`/`priority` são iguais ao molde com que `_talvez_semear_jogos` o
gerou, o arquivo passa a conter **só `name`, `match` e `priority`**. O resto
resolve pelo padrão do esquema — **e aqui há uma medição obrigatória antes de
gravar**: confira em `profiles/schema.py` o que um perfil sem `leds`/`rumble`/`triggers`
herda (o padrão do esquema, ou o `Personalizado`?). A decisão D1 dela
(*"o perfil grava o que ela tocou"*) pede que o vazio signifique *"o que o
Personalizado diz"*. Se o esquema não fizer isso hoje, **RELATE** com a
medição: é o `profiles/schema.py`, que não é desta posse.

**A MORDIDA:** um perfil de jogo com um `leds` diferente do molde não é
tocado; um igual ao molde vira três chaves. As duas réguas no mesmo teste.

### Passo 4 — quem semeia jogos passa a semear só nome e id

`_talvez_semear_jogos` deixa de copiar o molde inteiro: o perfil novo de um
jogo nasce com `name`, `match` e `priority`. É o mesmo contrato do Passo 3
aplicado ao futuro.

---

## 3. NADA SE PERDEU

* **Nenhum arquivo é apagado.** Gêneros vão para uma subpasta; jogos perdem
  campos que eram cópia do molde, e o molde continua em `assets/`.
* **O `Personalizado` continua sendo o padrão** (`cb41c851`, 05/09), e o
  backup `meu_perfil.json.antes-de-personalizado` não é tocado.
* **A semeadura continua respeitando deleção** (`.seeded_presets`).
* **O perfil que ela editou fica inteiro**, seja de gênero ou de jogo — a régua
  é byte a byte contra o molde, nunca pelo nome.
* **O Estilo de Jogo continua sendo motor a construir**, não uma lista de
  perfis renomeada. Esta sprint só tira os gêneros de onde não são.

## O QUE VOCÊ RELATA

* o que o esquema faz com seção ausente (Passo 3);
* se a aba 10 (`perfis_web`) tem alguma lista fixa que ainda cite os nove
  nomes — `grep -rn "acao\|aventura\|corrida" src/hefesto_dualsense4unix/app/actions/perfis_web.py`.
