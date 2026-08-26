# LEVA-2-F — a fábrica encolhe para o que ela mantém ativo

Árvore `/mnt/Apate/Desenvolvimento/hefesto-voo/LEVA-2-F`, branch `voo/LEVA-2-F`.
Cinco frentes fundidas (PERFIS-1, -2, -3, -7, -8), três commits.

## O que mudou

### (1) Os três presets saem da fábrica

`assets/profiles_default/bow.json`, `coop_local.json` e `sackboy_nativo.json`
foram apagados. Palavra dela: *"em termos de perfis de jogo vamos manter os que
temos ativos apenas"* — e o disco já tinha executado o gesto antes da ordem
chegar. Conferido hoje no diretório de perfis dela:

```
$ ls ~/.config/hefesto-dualsense4unix/profiles/*.json | wc -l
29
$ ls ~/.config/hefesto-dualsense4unix/profiles/.historico/ | grep -E 'bow|coop_local|sackboy'
bow                 (26/08 02:03)
coop_local          (26/08 02:02)
sackboy             (26/08 03:58)
sackboy_nativo      (06/08 20:17)
```

Nenhum dos três está entre os 29 ativos. Apagar o arquivo basta nos três
pacotes: os dois semeadores varrem o **diretório** por glob
(`scripts/install_profiles.sh`, `profiles/loader.py`), o empacotamento também
(`scripts/build_appimage_gui.sh`) e o `check_packaging_parity.sh` exclui
`assets/profiles_default/*.json` de propósito. Nada disso encosta no co-op:
desde `COOP-SEM-INTERRUPTOR-01` o campo é aceito e ignorado.

**A fábrica passa de 12 para 9**: `acao`, `aventura`, `corrida`, `esportes`,
`fallback`, `fps`, `meu_perfil`, `navegacao`, `point_and_click`.

### (2) As duas migrações órfãs: APOSENTADAS, e não mudas

Este era o trabalho de verdade, e é o que a poda custava se ninguém olhasse.

`migrate_coop_local_match` (R-12) e o ramo `coop_local` de
`migrate_modo_jogo_nos_presets` (MODO-01) copiam `match` e `priority` **do
asset**, via `_seed_source_file("coop_local.json")`. Sumindo o asset,
`_seed_source_file` devolve `None`, e o código antigo fazia `continue`. As duas
viravam **no-op silencioso**: quem tem um `coop_local` velho no disco (o de
14/07, com `criteria` de campos todos vazios) ficaria preso com um perfil que o
autoswitch **nunca** escolhe, para sempre, e nada em lugar nenhum diria por quê.

A cura **não** é adivinhar o regex perdido — escrever `match` de memória em
perfil de alguém é o produto escolhendo por ela, que é a coisa que a
`MASCARA-QUE-GRUDA-01` existe para impedir. A cura é **relatar**:

```python
def _relatar_migracao_aposentada(migracao: str, arquivo: str) -> None:
    logger.info(
        "migracao_aposentada_sem_asset",
        migracao=migracao,
        arquivo=arquivo,
        motivo="o preset de fábrica foi podado em 26/08/2026",
        efeito="o perfil local fica como está — nada é reescrito",
    )
```

As duas migrações ganharam nota datada no código, com o porquê inteiro e o que
não se perde. Na máquina dela nenhuma das duas chega a rodar: os markers
`.coop_local_match_migrated` (24/07) e `.modo_jogo_nos_presets_migrated` (25/07)
já estão no disco, e o retorno antecipado vem antes de tudo.

### (3) A fonte do 80 caducou junto com o arquivo

`PRIORIDADE_DO_PERFIL_DE_JOGO = 80` vinha comentado como *"80 é o que
`assets/profiles_default/sackboy_nativo.json` — o único preset de fábrica que
mira um jogo — já usa"*. O arquivo não existe mais, e uma citação que não abre
vale o mesmo que citação nenhuma.

O **número** fica: a ordem que o autoswitch precisa não mudou (gênero 55-70,
Navegação 50, jogo 80). O que mudou é que a justificativa está escrita ali
mesmo, em vez de apontar para um arquivo apagado. Duas outras frases do
`loader.py` citavam os presets podados como exemplo (a nota da semeadura em
runtime e a de `_appids_com_dono`); as duas foram acertadas no mesmo commit.

### (4) As réguas que abriam os três assets passam a medir a fábrica inteira

Três testes abriam um dos arquivos apagados. Nenhum foi simplesmente removido —
o que eles guardavam era mais geral que o arquivo, e ficou:

| Onde estava | O que guardava | Onde está agora |
|---|---|---|
| `test_match_sem_caixa_e_sentinel_manual.py::test_coop_local_de_fabrica_segue_alcancavel` | "preset de fábrica que o autoswitch nunca escolhe" | vira `test_nenhum_preset_de_fabrica_ficou_inalcancavel`, sobre a fábrica **inteira** — mede MAIS que antes |
| `test_r12_editor_simples_jogo_steam.py::TestPresetCoopLocalDeFabrica` | cinco fatos do preset (alvo real, não catch-all, casa por título, prioridade, modo) | lápide datada apontando para onde cada um sobreviveu |
| `test_modo01…::test_coop_local_vence_a_navegacao` | a ORDEM (o perfil de jogo vence o genérico de desktop) | `test_o_jogo_vence_a_navegacao`, medindo os cinco de gênero contra `navegacao` e contra `PRIORIDADE_DO_PERFIL_DE_JOGO` |

E o piso de `test_a_fabrica_nao_casa_com_a_loja.py` desce de `>= 10` para
`>= 9`, **no mesmo commit da poda** — senão ela reprovaria tarde, no CI, porque
nem esse teste nem o `test_profiles_preset.py` estão em `portoes.sh`. O piso não
cede sozinho: a contagem EXATA dos nove ficou travada por nome em
`TestOsPodadosNaoVoltam::test_a_fabrica_embarca_nove`.

### (5) Quatro frases de documento que o disco desmente

Nenhuma era decisão a preservar — eram afirmações que a medição derruba, e a
regra manda **substituir**.

1. **`creating-profiles.md`**: *"Arquivo fallback com `match.type = "any"` e
   `priority: 0` é obrigatório para garantir que algum perfil sempre case."*
   Duas medições derrubam: ela roda **29 perfis, zero catch-all** (contado hoje
   pelo mesmo predicado do produto), e `select_for_window` devolve `None` **de
   propósito** quando a janela é um jogo e só há catch-all candidato — veto
   R-21, em `profiles/manager.py`. Ter fallback não muda isso.
2. **A mesma página**: *"Sem fallback, `select_for_window` retorna `None` e
   nenhum perfil é aplicado"*. `None` quer dizer "ninguém opina", e o autoswitch
   **retém o perfil corrente**; não desliga nada.
3. **`cosmic.md`**: *"o autoswitch fica em modo silencioso (sempre usa
   `fallback.json`)"*. É o contrário: a histerese UX-01, em
   `profiles/autoswitch.py`, **pula o tique inteiro** quando não há informação
   de janela e mantém o perfil que está valendo. Tratar leitura cega como
   desktop era o defeito — o perfil do jogo caindo no alt-tab.
4. **`troubleshooting.md`**: *"Espere ou troque para `fallback` para
   destravar"*. Toda troca manual **re-arma** o lock de 30 s
   (`ipc_handlers.py` chama `mark_manual_profile_lock` em todo `profile.switch`):
   o conselho fazia o problema durar mais. E `fallback` é opcional — quem não o
   tem no disco não tinha nem como seguir a instrução.

E o `quickstart.md` listava **sete** presets onde a fábrica embarca **nove**
(doze antes da poda de hoje). Agora diz nove, e nomeia os nove.

### (6) O backup que a `decisoes-dela.csv` cita não existe

A linha `D-STEAM-SAI-DA-NAVEGACAO` afirma que o arquivo vivo dela foi editado
*"com backup em `navegacao.json.antes-de-tirar-steam-20260825`"*. Procurado hoje
no diretório de perfis e sob o `HOME` inteiro: **não existe**.

```
$ find ~ -maxdepth 4 -name '*antes-de-tirar-steam*'
(nada)
```

O que existe é o histórico automático do produto, `.historico/navegacao/`, com
cinco versões datadas — e o `navegacao.json` vivo saiu do diretório dela em
26/08 02:01, para esse mesmo histórico.

**Sobre a coluna `escolha`, e é preciso dizer:** a minha ordem tinha duas
cláusulas que colidem — *"corrija apenas o FATO da linha 29"* e *"a coluna
`escolha` de qualquer linha é intocável"*. O fato errado mora **dentro** da
coluna `escolha`. Segui a cláusula específica, com a menor edição possível: a
escolha dela ("TIRAR `steam` e `Steam` do perfil Navegação") ficou intocada
palavra por palavra, e a correção entrou como nota datada `CORREÇÃO DE FATO
(26/08/2026)` logo depois do fato derrubado. **Se a leitura certa era a outra,
o commit é `4f0f9ef5` e reverter é uma linha.**

## Qual mordida prova

### Mordida A — a migração aposentada não é muda

`tests/unit/test_profile_loader.py::TestAMigracaoAposentadaNaoEMuda`, três
testes: um por migração, mais o guarda do instrumento.

**Cura arrancada** (as duas chamadas a `_relatar_migracao_aposentada` fora, o
`continue` de volta):

```
$ pytest tests/unit/test_profile_loader.py -q -k AposentadaNaoEMuda
E  AssertionError: a migração virou no-op SILENCIOSO: quem tem um `coop_local`
   velho no disco fica preso com um perfil inalcançável e o journal não diz uma
   palavra sobre isso. Eventos vistos: []
E  AssertionError: o ramo `coop_local` de `migrate_modo_jogo_nos_presets` virou
   no-op silencioso — a prioridade 45 do preset velho fica atrás da Navegação
   para sempre, sem uma linha no journal
   assert []
2 failed, 1 passed, 34 deselected in 0.30s
```

**Cura devolvida:**

```
$ pytest tests/unit/test_profile_loader.py -q -k AposentadaNaoEMuda
...                                                                      [100%]
3 passed, 34 deselected in 0.29s
```

O terceiro (`test_com_asset_presente_a_migracao_continua_migrando`) é o guarda
do instrumento, e ele é o que separa "aposentada" de "esvaziada": se a migração
tivesse sido apenas oca, os dois primeiros passariam igual, e quem ainda tem o
asset (um `.deb` velho, o `/usr/share` de outra versão) perderia a migração de
verdade sem ninguém notar. É a régua que sabe **recusar** e a que sabe
**aceitar**, no mesmo arquivo.

### Mordida B — os podados não voltam

`tests/unit/test_profiles_preset.py::TestOsPodadosNaoVoltam`. **Cura arrancada**
(devolvi o `bow.json` ao diretório de fábrica):

```
$ git show HEAD:assets/profiles_default/bow.json > assets/profiles_default/bow.json
$ pytest tests/unit/test_profiles_preset.py -q -k TestOsPodadosNaoVoltam
E  AssertionError: a fábrica mudou de tamanho sem passar por aqui:
   ['acao.json', 'aventura.json', 'bow.json', 'corrida.json', ...]
FAILED …::test_o_preset_podado_nao_esta_na_fabrica[bow]
FAILED …::test_a_fabrica_embarca_nove
2 failed, 2 passed, 115 deselected in 0.32s
```

**Cura devolvida** (arquivo removido de novo): 4 passed.

### O escopo inteiro, verde

```
$ pytest tests/unit/test_profiles_preset.py tests/unit/test_a_fabrica_nao_casa_com_a_loja.py \
    tests/unit/test_profile_loader.py tests/unit/test_r12_migra_coop_local_match.py \
    tests/unit/test_r12_editor_simples_jogo_steam.py tests/unit/test_coop_default_on_migration.py \
    tests/unit/test_o_preset_nao_escolhe_a_mascara.py tests/unit/test_modo01_o_modo_jogo_liga_sozinho.py \
    tests/unit/test_match_sem_caixa_e_sentinel_manual.py tests/unit/test_migracao_modo_jogo_presets.py \
    tests/unit/test_retrato_dos_dialogos_nao_vaza_dado_real.py -q
279 passed in 2.34s

$ pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
35 passed in 53.63s

$ bash scripts/portoes.sh --rapido
TODOS VERDES — 19 portões.
```

Os 19 já estavam verdes na entrada da árvore (medi antes de tocar em nada), e
continuam.

## O que NÃO verifiquei

- **A bancada.** Não toquei no aparelho, no daemon vivo, no `hidraw` nem em
  `systemctl` — a frente não pedia, e o frontmatter diz `bancada: false`. Que o
  daemon dela, ao reiniciar, não reclame da ausência dos três assets é
  **raciocínio, não medição**: `seed_default_presets` varre o diretório por
  glob e o marker `.seeded_presets` respeita deleção proposital; li o código, não
  rodei o daemon.
- **A tela.** Não rodei `retratar_abas.py` (R-C) e não fotografei nada. A aba
  Perfis vai mostrar nove presets de fábrica em vez de doze para quem instalar do
  zero — **não vi isso acontecer**, deduzi da lista de arquivos.
- **As fotos de diálogo.** Troquei as duas constantes de
  `scripts/gui-captura/retratar_dialogos.py` (ver abaixo), mas **não regerei os
  PNGs**: os diálogos publicados ainda dizem `sackboy_nativo` e `coop_local`.
  Quem fotografar no fim da leva colhe os nomes novos.
- **A suíte inteira.** Rodei só o meu escopo, por caminho, como manda o
  protocolo. Não sei o que o resto da árvore faz com a poda além dos arquivos que
  varri por `grep` e rodei um a um (lista abaixo).
- **O `.deb` e o AppImage.** Não construí pacote nenhum. Que apagar o arquivo
  baste nos três caminhos de empacotamento veio de LER
  `install_profiles.sh`, `build_appimage_gui.sh`, o manifesto Flatpak e o
  `check_packaging_parity.sh` — e o portão `packaging-parity` está verde —, não de
  instalar.
- **O texto que escrevi nos documentos.** É prosa de documentação, não texto de
  tela, então não marquei `PROVISÓRIO`. Se alguma dessas frases for lida como
  vocabulário de produto, a palavra é dela.

## O que sobrou para o próximo

### DOIS ARQUIVOS FORA DA MINHA POSSE, e eu os editei — diga se foi errado

A poda deixou **dois testes vermelhos** que a minha posse declarada não cobria.
Nenhum dos dois pertence a outra frente da LEVA 2 (conferi o frontmatter inteiro)
e nenhum está no meu `nao_toca`, então ninguém mais os consertaria. Como eram
colaterais **do meu** commit, consertei — e relato aqui em vez de esconder:

1. **`tests/unit/test_migracao_modo_jogo_presets.py`** —
   `test_coop_local_sai_de_tras_do_perfil_de_navegacao` exigia que a migração
   levasse o `coop_local` de 45 para 75+. Virou
   `test_o_ramo_do_coop_local_esta_aposentado_e_relata`, com nota datada, e
   agora trava o relato em vez do número.
2. **`scripts/gui-captura/retratar_dialogos.py`** — as constantes
   `PERFIL_EDITADO` / `PERFIL_ATIVADO` eram `sackboy_nativo` e `coop_local`, e
   `tests/unit/test_retrato_dos_dialogos_nao_vaza_dado_real.py` exige por AST que
   os nomes fotografados sejam perfis de **fábrica** — é um portão de vazamento
   de dado dela, e a alternativa (afrouxar o portão) enfraqueceria a privacidade.
   Troquei por `fps` e `corrida`, que ficam. **Custo:** `scripts/gui-captura`
   está em `CODIGO_DA_TELA` de `test_as_fotos_acompanham_a_versao.py`, então a
   leva agora **exige** a foto do integrador. As frentes C e E já tocam `app/` e
   `main.glade`, então a foto já era devida — mas o custo é meu, não delas.

### O `html/painel.html` entrou no meu commit sozinho

O gancho `pre-commit` regenera `html/painel.html` **sempre** e faz `git add`.
Como toquei a `decisoes-dela.csv`, o commit `4f0f9ef5` carrega 14 linhas de
`painel.html` que eu não escrevi. Não é escolha minha e não dá para desligar sem
desligar o gancho; **se outra frente também tocou o CSV, o conflito vai aparecer
ali.**

### Restos que não são meus

- **`scripts/faxina-de-testes.py`** lista `coop_local.json` e
  `sackboy_nativo.json` em `NOMES_DA_MIGRACAO` (resíduo que a faxina reconhece).
  Continua **correto** — o marker e o arquivo seguem no disco de quem já rodou a
  versão velha —, mas quem for revisitar aquele arquivo vai querer a nota datada.
- **Cinco módulos citam os podados em comentário histórico**
  (`profiles/schema.py`, `profiles/autoswitch.py`, `daemon/lifecycle.py`,
  `daemon/state_store.py`, `app/actions/footer_actions.py`,
  `app/actions/emulation_actions.py`, `app/app.py`, `scripts/doctor.sh`, o
  manifesto Flatpak). **Não toquei em nenhum**: são narrativa de defeito medido,
  e continuam verdadeiros no passado. Se alguém quiser uma varredura de "nota
  datada em todo lugar que cita um preset podado", é uma frente própria — e vale
  a pena só se ela cortar texto, não se acrescentar.
- **`docs/usage/creating-profiles.md`** ainda mostra o `fallback.json` completo
  como exemplo, e o exemplo ficou. A frase que o chamava de obrigatório é que
  saiu.

### O que a poda não fez, de propósito

`assets/profiles_default/{fallback,meu_perfil,navegacao}.json` continuam na
fábrica: estão no meu `nao_toca`. Vale notar para quem vier depois que o
`navegacao.json` **vivo** dela saiu do diretório em 26/08 — o preset de fábrica
com o mesmo nome segue embarcando, e ninguém mediu se ela quer isso.
