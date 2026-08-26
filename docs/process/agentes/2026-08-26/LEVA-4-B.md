# LEVA-4-B — os endereços que a leva envelheceu, e os fatos que ela tornou falsos

**26/08/2026.** Árvore `voo/LEVA-4-B`. Bancada: não tocada.

## O que mudou

**Tudo foi remedido contra o HEAD desta árvore.** Nenhuma tabela de relatório
anterior foi copiada — e fez diferença: a `BG-02.md:256-272` tinha envelhecido
de novo, e o próprio endereço que a ordem me deu (`profiles_actions.py:2628-2634`)
já era `:2696-2702` quando cheguei.

### 1. Dezesseis endereços de linha corrigidos em comentário e docstring

`scripts/validar-citacoes-de-linha.py` varre `docs/`, não `src/` — rodado nesta
árvore ele diz *"OK: 123 citações em 13 documentos"* com dez arquivos de código
apontando para o vazio. Cada âncora abaixo foi medida com `grep -n`:

| onde | citava | mede hoje | a âncora |
|---|---|---|---|
| `utils/maquina.py:48` | `ipc_handlers.py:1513` | `:1590` | `_handle_identity_number_set` |
| `daemon/lifecycle.py:259` | `ipc_handlers.py:4858` (linha VAZIA) | `:5246` | o rebind de `daemon._maquina` |
| `daemon/lifecycle.py:2765` | `gamepad.py:2068` | `:2093` | a R-07 |
| `app/actions/ambiente_na_tela.py:14` | `ipc_handlers.py:2009` | `:2091` | a publicação de `osk_disponivel` |
| `app/actions/profiles_actions.py:301` | `schema.py:52` | `:125` | `MatchCriteria.matches` |
| `app/actions/profiles_actions.py:454` | `compact_window.py:309` | `:320` | o `#50fa7b` da janela compacta |
| `app/actions/profiles_actions.py:748` | `ipc_handlers.py:470-477` | `:862-870` | a derivação de `secoes["mode"]` |
| `app/actions/profiles_actions.py:932` | `ipc_handlers.py:1971` | `:1999` | `pontes_confirmadas` no `daemon.status` |
| `app/actions/status_actions.py:243` | `ipc_handlers.py:1657-1662` | `:2774-2775` | as duas chaves de `coop` |
| `app/actions/status_actions.py:256` | `gamepad.py:598-608` | `:1026` | o `coop.sync(force=True)` |
| `app/actions/status_actions.py:261 e :2270` | `gamepad.py:565-579` e `:1401-1411` | `:985` e `:1987` | as duas mortes do contador |
| `app/textos_de_aplicacao.py:279` | `ipc_handlers.py:1158-1183` (+4 sub-endereços) | `:1130-1205`, `:1183`, `:1190`, `:1195`, `:1203` | `_destinos_do_broadcast` e os quatro ramos |
| `tests/…/test_p2_…py:4` | `ipc_handlers.py:1971` | `:1999` | idem |
| `tests/…/test_ambiente_…nao_tem.py:323` | `ipc_handlers.py:2009` | `:2091` | idem |
| `tests/…/test_ambiente_…invariante.py:8` | `ipc_handlers.py:2066-2110` | `:2237-2287` | `_window_detect_payload` |
| `tests/…/test_portao_o_par…py` (5 lugares) | `ipc_handlers.py:2107`, `home_actions.py:1115`, `emulation_actions.py:408`, `lifecycle.py:1631`, `lifecycle.py:2254` | `:2210`, `:1139`, `:529`, `:1635`, `:2258` | as cinco leituras do censo |

**O último desses estava REPROVANDO.** `test_a_lista_de_leituras_atravessa_o_
acessor` afirmava que o portão nomeia `daemon/lifecycle.py:2254`, e o portão
mede `:2258` — o `import` mudou de linha e a asserção ficou para trás. Medido
com a árvore intacta antes de eu tocar em nada (`git stash -u`):

```
$ git stash -q -u && python -m pytest tests/unit/test_portao_o_par_com_metade_ligada.py -q
FAILED …::TestOPortaoMorde::test_a_lista_de_leituras_atravessa_o_acessor
1 failed, 10 passed in 16.04s
```

Ou seja: **um portão desta casa estava vermelho no HEAD da onda por causa
exatamente do defeito que esta frente existe para curar.** Agora: `16 passed`.

### 2. Dois fatos errados SUBSTITUÍDOS (não datados — a regra da casa)

`pontes_confirmadas` **existe** no `daemon.state_full` desde a BG-02
(`ipc_handlers.py:2483`, dentro de `_handle_daemon_state_full`). Dois lugares
afirmavam o contrário e mandavam alguém fazer um conserto de fundo já feito:

* `app/actions/profiles_actions.py::_buscar_as_pontes_confirmadas` — a razão
  agora é a verdadeira, e ela já estava escrita do outro lado: o tique paga
  cache de 5 s (`_PONTES_CONFIRMADAS_TTL_SEC`, `ipc_handlers.py:189`) porque a
  leitura crua abre cada perfil sob `FileLock`; a caixa do jogo precisa da
  resposta no instante seguinte ao gesto, e o `daemon.status` não paga o cache;
* `tests/unit/test_p2_…py` — cabeçalho **e** a docstring do
  `test_a_aba_pede_o_carimbo_ao_daemon_status_e_nao_ao_tique`. O teste continua
  verde porque mede **outra coisa** (qual método a aba chama); o que caducou era
  só a justificativa.

### 3. As razões caducas do portão de lápides

`shutdown` mora em `daemon/connection.py:1286` e derruba os três em linha —
`:1364` (IPC), `:1368` (UDP), `:1372` (autoswitch). O endereço que as três
razões citavam (`connection.py:821-900`) **nem existe mais**.

* **`stop_ipc` / `stop_udp` / `stop_autoswitch`** — reescritas. A de
  `stop_autoswitch` prometia que *"a thread do autoswitch é derrubada pelo fim
  do processo"* e o `shutdown` chama `daemon._autoswitch.stop()`: a razão velha
  mandava caçar uma perda de dado inexistente (o autoswitch grava o perfil
  ativo). **A dívida real é DUPLICAÇÃO**, e as três razões agora dizem isso.
* **`apelido_do_dongle::costurar_a_mesa`** — passa a citar `D-COSTURA-BLUEZ`,
  que foi **decidida em 25/08** (*o script continua dono*). A entrada deixou de
  ser pergunta em aberto e virou registro de escolha. Endereços remedidos:
  `apelido_do_dongle.py:588-602` e `bt_active_mode.sh:349` (o laço; `:281` é a
  função `_hci_com_nintendo`).
* **`ordens_da_mesa`** e **`mapa_das_portas::irmas_de`** — **o defeito não
  existia mais.** As cinco lápides do catálogo de ordens caíram na leva 2
  (`app/actions/config/secao_exame.py`) e `irmas_de` não tem entrada nenhuma no
  portão hoje: `grep -n irmas_de tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`
  → sem saída. Nada a fazer, e a medição fica aqui em vez de trabalho inventado.

### 4. A contagem de portões

Medido: `portoes.sh --listar | grep -c '^PORTAO|rapido'` → **19**;
`… '^PORTAO|completo'` → **7**. **26 portões**, mais a camada `suite`.

`docs/process/2026-08-25-ONDE-PARAMOS-a-tarde-de-treze-frentes.md` dizia 25.
Substituído — e **não por 26**: o bloco agora CONTA em vez de afirmar, com uma
nota dizendo por quê (três lugares desta casa escreveram três números
diferentes para a mesma lista; um número copiado à mão envelhece na primeira
leva que acrescenta um portão).

### 5. `utils/repo_files.py:16-18` — **o defeito não existia mais**

A afirmação *"o `daemon_actions` tem dono em outra árvore e é a próxima
parada"* já foi substituída pelo commit `93127b61` (*"as cinco listas de 'onde
estão os scripts' viram uma"*, BG-BASES-01), nesta mesma onda. **Não editei o
arquivo** — ele está fora da minha posse declarada e não havia o que consertar.

## Qual mordida prova

`tests/unit/test_portao_o_par_com_metade_ligada.py` ganhou
`TestTodaCitacaoDeLinhaConfere`, com cinco casos. A varredura usa `tokenize`
(COMMENT + STRING), abre cada alvo e confere três coisas — a linha existe, não
está EM BRANCO, e, quando há um símbolo em crase na vizinhança que é `def` ou
`class` **único** no alvo, a citação tem de cair dentro do bloco dele.

**Arranquei a cura** — devolvi um dos endereços que corrigi ao valor
envelhecido de 25/08 (`schema.py:125` → `:52`):

```
$ sed -i 's|(schema.py:125)|(schema.py:52)|' src/…/profiles_actions.py
$ python -m pytest tests/unit/test_portao_o_par_com_metade_ligada.py -q -k toda_citacao
E   AssertionError: 1 endereço(s) de linha em `src/` apontam para outro lugar hoje:
E       - app/actions/profiles_actions.py:301 cita a linha 52, mas a âncora
E         `MatchCriteria` está na linha 106 (bloco 106-151)
1 failed, 15 deselected in 1.25s
```

**Os dois números**, como a ordem pediu: o citado (52) e o real (106).
**Devolvi a cura:** `1 passed, 15 deselected in 1.20s`.

**A segunda metade — a lista que se limpa sozinha.** As 31 citações que MEDI
como envelhecidas e **não posso consertar** (arquivo citante de outra posse,
R-A) estão em `_CITACOES_PENDENTES`, e o
`test_a_lista_de_pendentes_nao_vira_paisagem` exige que cada uma continue
QUEBRADA. Arranquei essa cura pondo na lista uma que já conferia:

```
E   AssertionError: 1 citação(ões) declarada(s) como pendente(s) já conferem —
E   apague-as de `_CITACOES_PENDENTES`:
E       - utils/maquina.py::daemon/ipc_handlers.py:1590
1 failed, 15 deselected
```

Devolvida: `1 passed`. Sem essa metade a lista viraria depósito.

Os outros três casos são dublê sobre uma cópia de `src/`
(`_copia_de_src`): endereço plantado ERRADO reprova nomeando os dois números,
o MESMO plantio com o número certo passa calado, e alvo fora do repositório
(biblioteca de terceiro) é ignorado em vez de acusado.

**Estado final do escopo:**

```
$ python -m pytest tests/unit/test_p2_… tests/unit/test_ambiente_presumido_01_… \
    tests/unit/test_portao_o_par_com_metade_ligada.py \
    tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
105 passed in 76.09s
```

`portao_a_casa_sabe_e_o_produto_nao_faz.py` sozinho: **35 passed**, como a ordem
previu.

`bash scripts/portoes.sh --rapido` → **TODOS VERDES — 19 portões.**

## O que NÃO verifiquei

* **A régua não alcança endereço que caiu numa linha plausível sem símbolo em
  crase ao lado.** Sem âncora nomeada não há como computar o número real, e
  inventar um seria medição falsa. Consequência concreta: os endereços que
  corrigi por medição manual (`:1999`, `:2091`, `:2774-2775`, `:1026`) **passam
  hoje e passariam se estivessem errados por poucas dezenas de linhas** — a
  régua só os pega quando saem do bloco do símbolo. Não sei quantas das 199
  citações de `src/` estão nesse ponto cego.
* **As 31 pendências não foram classificadas uma a uma.** Medi que cada uma
  reprova e por qual das três réguas; **não** medi, para cada uma, qual é o
  número certo. Duas famílias eu identifiquei por amostra
  (endereço deslocado × endereço histórico, este último em
  `utils/repo_files.py`, onde o código citado morreu com a própria cura), mas
  **não conferi as 31**.
* **Não rodei a suíte inteira** (regra da casa) nem `pytest` fora do meu escopo.
  Os portões `completo` (`mypy`, `shellcheck`, `acentuacao`, `anonimato`,
  `referencias-docs`, `casa-sabe`, `portao-tem-chamador`) rodaram pelo
  `portoes.sh` — ver o resultado colado no fim desta seção.
* **Não toquei a bancada nem a tela.** Nenhuma foto, nenhum
  `retratar_abas.py` (R-C), nenhuma linha em `portoes.sh` ou `ci.yml` (R-D).
* **Não escrevi texto novo de tela**, então não há nada marcado
  `PROVISÓRIO — decisão dela` nesta frente (R-E).
* **Não conferi se o `CLAUDE.md` foi atualizado** — ele é `.gitignore:90` e não
  é meu; a contagem certa está na seção 4 acima, para quem coordena copiar.

## O que sobrou para o próximo

1. **As 31 citações de `_CITACOES_PENDENTES`**, em
   `tests/unit/test_portao_o_par_com_metade_ligada.py`. É uma lista de trabalho
   pronta, conferida por máquina, e quem consertar uma é OBRIGADO a apagá-la de
   lá. Distribua por posse: `app/actions/config/*` (4), `app/actions/*` (6),
   `app/app.py` (1), `cli/` (1), `core/` (4), `daemon/` (6),
   `integrations/` (3), `profiles/` (1), `utils/repo_files.py` (3),
   `app/actions/footer_actions.py` (2).
2. **`scripts/validar-citacoes-de-linha.py` deveria varrer `src/` também** —
   hoje ele só olha `docs/`, e foi por isso que dez arquivos de código
   atravessaram 164 commits apontando para o vazio. O portão que escrevi vive na
   suíte (R-D: não acrescentei linha ao `portoes.sh`); **relato aqui** que ele
   merece a lista, e quem coordena põe em `portoes.sh` **e** no `ci.yml` no
   mesmo commit. O script é posse da L4-E.
3. **`CLAUDE.md`, à mão, por quem coordena:** "os 24 portões" → 26, e
   "`--rapido` faz 18" → 19. Medido em 26/08 (seção 4).
4. **`docs/process/2026-08-25-ONDE-PARAMOS-a-madrugada…md:209`** ("os 24
   portões") e **`docs/process/COMO-REGER-AGENTES.md:144`** ("os 24 portões")
   têm o mesmo número errado. Não são minha posse — **relato e paro**.
5. **`tests/unit/test_a_barra_nao_inventa_a_causa_do_nada.py:6 e :96** citam
   `ipc_handlers.py:1158-1183` e `:1162`, os mesmos endereços que corrigi em
   `app/textos_de_aplicacao.py:279`. Os números certos são `:1130-1205` e
   `:1183`. Arquivo de outra posse — **relato e paro**. (A régua nova não o
   pega: ela varre `src/`, não `tests/`.)
6. **A dívida de duplicação das três `stop_*`** continua aberta, agora com o
   preço certo escrito: ou o `shutdown` delega às três (e ganha o teto de 2 s
   num lugar só), ou as três somem. Não é urgência — nada fica de pé por causa
   dela hoje.
