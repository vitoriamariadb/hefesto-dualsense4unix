# LEVA-1-E — os botões que não fazem nada fora do checkout, e o conselho impossível

**26/08/2026.** Frente E da LEVA 1 (BG-BASES-01 + BG-INSTALL-01, fundidas;
BG-05b descartada como duplicata exata de BG-BASES-01). Árvore
`hefesto-voo/LEVA-1-E`, branch `voo/LEVA-1-E`, quatro commits.

| commit | o que fecha |
|---|---|
| `93127b61` | `fix(bases): as cinco listas de "onde estão os scripts" viram uma` |
| `13224793` | `fix(instalação): as três frases fora do checkout param de mandar rodar ./install.sh` |
| `25f468fa` | `fix(teste): o parâmetro "funcao" vira "resolvedor"` (o portão de acentuação) |
| este | `docs(LEVA-1-E): a entrega da frente` |

## O que mudou

### 1. As cinco listas de "onde estão os scripts" viraram uma

`utils/repo_files.py` nasceu em 25/08 para ser a resposta única e ficou com
**um** consumidor (`cli/cmd_doctor.py`). Os quatro resolvedores que restavam
passaram a chamar `encontrar_arquivo_do_repo()`:

| resolvedor | tinha | e não conhecia |
|---|---|---|
| `daemon_actions.DaemonActionsMixin._find_repo_file` | 4 bases | `sys.prefix/share`, `share/` do usuário |
| `emulation_actions…._mic_script` | 3 bases | as duas acima **e `/app/share`** |
| `emulation_actions…._steam_input_script` | 3 bases | as mesmas três |
| `cli.cmd_mic._find_script` | 3 bases | as mesmas três |

Do lado de quem usa: quem instalou por **Flatpak** clicava em "Verificar" ou
em "Desligar Steam Input" na aba Emulação e ouvia *"Não encontrei o script…"*
— com o `disable_steam_input.sh` instalado em
`/app/share/hefesto-dualsense4unix/scripts/` pelo próprio manifesto. Quem
instalou por **AppImage, Nix, venv ou `pip --user`** ouvia o mesmo em "Aplicar
correções". O arquivo estava na máquina; o produto olhava na lista curta.

**`BASES_DE_INSTALACAO` sobreviveu, DERIVADA.** É
`= bases_de_instalacao()` — nunca escrita à mão, zero literais. Ela ficou de
pé por um motivo concreto: **sete testes de 25/08 a monkeypatcham**
(`test_t03_o_conselho_que_serve_para_esta_instalacao.py`,
`test_bg06_o_grau_e_o_conselho_que_serve_para_esta_instalacao.py`) e esses
arquivos **não estão na minha posse** (R-A). Ver *"o que sobrou"*.

### 2. O conselho de atualizar mudou de casa, e as três frases o chamam

`esta_instalacao_e_um_checkout()` e `como_atualizar_esta_instalacao()`
nasceram na T-03 dentro de `app/actions/daemon_actions.py`, com **oito
chamadores, todos dentro do próprio arquivo**. Passaram para
`utils/repo_files.py`, porque uma das três frases que precisavam delas está em
`integrations/storm_doctor.py` e **`integrations/` importar de `app/`
inverteria a camada**.

O texto passou a morar num lugar só — `repo_files.FRASE_DE_ATUALIZAR` —, que é
o que o portão do `doctor.sh` compara palavra por palavra
(`test_bg06…::test_a_frase_de_fora_do_checkout_e_a_mesma_nos_dois_lugares`).
`daemon_actions` ficou com dois delegadores de três linhas, e **não reescreve
nenhuma das duas frases** (há teste para isso).

### As três frases, antes e depois — **PROVISÓRIO, decisão dela** (R-E)

O carimbo é herdado da T-03: o ramo de fora do checkout usa o *mínimo
aceitável* que aquela sprint redigiu — honesto e universal, mas não nomeia o
gesto do formato (um `flatpak update`, um `apt upgrade`). Nomear é texto novo
de tela.

| onde | no checkout (a máquina dela) | fora do checkout (Flatpak, AppImage, Arch, Fedora, Nix) |
|---|---|---|
| `emulation_actions.py:354` — "Desligar Steam Input" sem o script | **IDÊNTICA**: `…nesta instalação — rode ./install.sh para atualizar o Hefesto.` | `…nesta instalação — atualize o Hefesto pelo mesmo caminho por onde você o instalou.` |
| `mouse_actions.py:605` — aba Mouse sem o módulo `uinput` | antes: `Falta um componente do mouse virtual — rode a instalação de novo (./install.sh)` · **agora**: `… — rode ./install.sh para atualizar o Hefesto` | `Falta um componente do mouse virtual — atualize o Hefesto pelo mesmo caminho por onde você o instalou` |
| `storm_doctor.py:334` — laudo do travamento do USB | antes: `cura do travamento do USB AUSENTE — rode ./install.sh e reconecte os controles (…)` · **agora**: `… — rode ./install.sh para atualizar o Hefesto e reconecte os controles (…)` | `… — atualize o Hefesto pelo mesmo caminho por onde você o instalou e reconecte os controles (…)` |

**Duas linhas mudam na tela dela** (as duas últimas), e é isso que espera o
olho dela. A primeira não muda um caractere.

**O cuidado medido de `doctor.sh:167-171` foi respeitado**: o ajudante devolve
o gesto **sem** espaço na frente e **sem** pontuação inicial, e as três frases
o interpolam no meio da oração — nenhuma o cola depois de um `;` ou de um
`—` solto.

## Qual mordida prova

Duas réguas novas, e as duas foram **arrancadas e vistas reprovar**.

### `tests/unit/test_bg05_a_lista_de_bases_e_uma_so.py` (11 testes)

Cura arrancada: `_steam_input_script` devolvido à lista à mão de três bases.

```
E       AssertionError: a lista de bases voltou a ser escrita à mão:
E           emulation_actions.EmulationActionsMixin._steam_input_script (+3): 'parents[' em Path(__file__).resolve().parents[4] / "scripts" / "disable_steam_input.sh",
E           emulation_actions.EmulationActionsMixin._steam_input_script (+4): '/usr/share/' em Path("/usr/share/hefesto-dualsense4unix/scripts/disable_steam_input.sh"),
E           emulation_actions.EmulationActionsMixin._steam_input_script (+5): '/usr/local/share/' em Path("/usr/local/share/…/disable_steam_input.sh"),
E           emulation_actions.EmulationActionsMixin._steam_input_script: não chama `encontrar_arquivo_do_repo` — voltou a resolver o caminho por conta própria
E
E         A resposta é uma só: `utils/repo_files.encontrar_arquivo_do_repo()`.

FAILED …::test_nenhum_resolvedor_a_mao_sobreviveu
FAILED …::test_o_modulo_inteiro_nao_guarda_uma_segunda_lista[app/actions/emulation_actions.py]
FAILED …::test_os_quatro_resolvedores_obedecem_a_busca_unica[…_steam_input_script]
FAILED …::test_o_resolvedor_sabe_recusar
4 failed, 7 passed in 0.52s
```

A terceira falha é a que importa mais, porque **não é de texto**: o teste
planta o script numa base de mentira e o resolvedor da lista à mão devolve o
do checkout.

```
E  assert PosixPath('…/LEVA-1-E/scripts/disable_steam_input.sh')
       == PosixPath('/tmp/…/app-share/scripts/disable_steam_input.sh')
```

Cura devolvida:

```
11 passed in 0.43s
```

### `tests/unit/test_o_conselho_de_atualizar_serve_a_esta_instalacao.py` (9 testes)

Cura arrancada: as três frases devolvidas ao literal.

```
E       AssertionError: frase de tela mandando rodar o instalador:
E           app/actions/emulation_actions.py:354: 'Não encontrei o script que desliga o Steam Input nesta instalação — rode ./install.sh para atualizar o Hefesto.'
E           app/actions/mouse_actions.py:605: '<span foreground="#ff5555">Falta um componente do mouse virtual — rode a instalação de novo (./install.sh)</span>'
E           integrations/storm_doctor.py:334: "cura do travamento do USB AUSENTE — rode ./install.sh e reconecte os controles (…)"

FAILED …::test_fora_do_checkout_ninguem_manda_rodar_install_sh
FAILED …::test_desligar_steam_input_sem_script
FAILED …::test_a_aba_mouse_sem_o_modulo
FAILED …::test_o_laudo_do_quirk
4 failed, 5 passed in 1.30s
```

Cura devolvida:

```
9 passed in 1.31s
```

**As duas réguas sabem RECUSAR**, que é o que separa régua de dublê que só
sabe passar: `test_o_resolvedor_sabe_recusar` exige `None` de um lugar vazio, e
`test_a_regua_sabe_acusar` monta um arquivo de mentira com a frase em
docstring, em comentário e em código, e cobra que **só a de código** seja
acusada. As três frases têm par no checkout
(`…_no_checkout_nao_mudou`), porque a cura não podia piorar o caso que já
funcionava.

### Nenhum teste alheio ficou vermelho

```
tests/unit/test_o_conselho_de_atualizar_serve_a_esta_instalacao.py
tests/unit/test_bg05_a_lista_de_bases_e_uma_so.py
tests/unit/test_t03_o_conselho_que_serve_para_esta_instalacao.py
tests/unit/test_bg06_o_grau_e_o_conselho_que_serve_para_esta_instalacao.py
tests/unit/test_bg05_o_python_procura_onde_o_pacote_poe.py
tests/unit/test_steam_input_ponteiros.py  test_steam_input_honestidade.py
tests/unit/test_steam_modo_simples.py     test_cmd_mic.py
tests/unit/test_daemon_status_initial.py
  -> 170 passed in 4.34s

tests/unit/test_a_aba_emulacao_*.py  test_bg02_*.py  test_emulation_mic_quirk.py
tests/unit/test_harmonia_mouse_um_dono.py  test_mouse_actions_gui_sync.py
tests/unit/test_storm_doctor.py  test_storm_launch_options.py
tests/unit/test_emulation_actions_modo_jogo.py  test_contagem_emulacao_conta_aparelho.py
  -> 141 passed in 2.20s

tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py  -> 35 passed in 53.62s
```

### Os portões

`bash scripts/portoes.sh` (os 26) → **1 vermelho: `colisao-de-sprints`, e ele
é PRÉ-EXISTENTE.** Provado, não afirmado: com `git stash push -u` (a árvore em
HEAD, sem uma linha minha) ele reprova igual. A queixa é entre **documentos de
sprint** (`LEVA-1` × onze sprints de 24/08 reivindicando os mesmos arquivos sem
`depois_de`/`nao_toca`), e `docs/process/sprints/` não está na minha posse.

`--rapido` (19) roda antes do `acentuacao`, e foi ele que pegou o único
vermelho meu da leva: `funcao -> sugestão função` em
`test_bg05_a_lista_de_bases_e_uma_so.py:255`. Identificador Python não recebe
acento, então o parâmetro virou `resolvedor` (commit `25f468fa`). **Lição para
quem executa: `--rapido` não cobre `acentuacao`, `shellcheck`, `mypy` nem
`casa-sabe` — rode a lista inteira antes de fechar.**

## O que NÃO verifiquei

- **Nada disto foi exercido dentro de um Flatpak, AppImage ou Nix de
  verdade.** Que o `disable_steam_input.sh` esteja em `/app/share/…` é leitura
  do manifesto; que `sys.prefix` seja `/app` dentro da sandbox é inferência com
  mecanismo herdada da BG-05, **não medição minha**. O que eu medi é que os
  quatro resolvedores obedecem à lista de bases que se planta neles.
- **Não abri a janela.** As três frases foram exercidas pela função pura
  (`format_steam_input_result`), pelo laudo (`check_snd_quirk`) e por
  `_refresh_mouse_view` com um `Gtk.Label` dublê — **não** vi o texto renderizado
  na tela. A largura da frase nova de `mouse_actions` num rótulo estreito é
  desconhecida; ela cresceu de 43 para 42/56 caracteres conforme o ramo.
  R-C: não rodei `retratar_abas.py`.
- **`BASES_DE_INSTALACAO` congela no import.** Que `sys.prefix` e
  `XDG_DATA_HOME` não mudem no meio de um processo é raciocínio, não medição.
  Em produção não vejo como quebrar; se quebrar, é aqui.
- **Não medi o `.deb`, o Arch nem o Fedora rodando.** As seis bases são leitura
  das receitas de empacotamento, herdada da BG-05.
- **Não toquei a bancada.** Nada desta frente encosta no aparelho: é resolução
  de caminho de arquivo e texto de tela.
- **Não rodei a suíte inteira** (R do CLAUDE.md: ela é de quem coordena, em
  oito lotes). Rodei os 346 testes do meu escopo, por caminho.

## O que sobrou para o próximo

### 1. `BASES_DE_INSTALACAO` pode morrer — mas o preço é de arquivo alheio

O nome ficou de pé **só** porque estes dois arquivos, que não são meus (R-A),
o monkeypatcham ou o leem:

| arquivo | linhas | o que faz |
|---|---|---|
| `tests/unit/test_t03_o_conselho_que_serve_para_esta_instalacao.py` | 67, 183, 194, 216 | `monkeypatch.setattr(da, "BASES_DE_INSTALACAO", …)` e três asserções sobre o conteúdo |
| `tests/unit/test_bg06_o_grau_e_o_conselho_que_serve_para_esta_instalacao.py` | 528 | `da.BASES_DE_INSTALACAO[0].name != "src"` |

Sete testes ao todo. **Todos passam hoje** — eu desenhei a cura para isso.
Quem coordena pode fechar o assunto num commit só:

1. `test_t03…` — `TestOFlatpakEntrouNaListaDeBases` (três testes) vira
   duplicata do meu `TestAListaDeBases` e pode **sair**; os dois
   `monkeypatch.setattr(da, "BASES_DE_INSTALACAO", …)` viram
   `monkeypatch.setattr(repo_files, "bases_de_instalacao", lambda: …)`;
   a string permitida `'BASES_DE_INSTALACAO[0] / "install.sh"'` (linha 164) já
   não é usada por nada e pode sair da lista.
2. `test_bg06…:528` — aponta para `repo_files.bases_de_instalacao()[0]`.
3. `daemon_actions` — apaga a constante e os dois delegadores; os chamadores
   passam a importar de `utils/repo_files` direto.

**Enquanto isso não for feito, o produto está correto** — a constante é
derivada e não pode divergir. O que sobra é peso, não defeito.

### 2. Uma lápide de `check_packaging_parity.sh` virou fato errado — e não é minha

`scripts/check_packaging_parity.sh:1626` declara, em
`_PRODSCRIPT_LACUNAS_HOJE`:

> *"25/08/2026 — LEVAR NÃO É ACHAR. `BASES_DE_INSTALACAO` conhece quatro bases
> […] A cura é uma base derivada de `sys.prefix`, num arquivo que a frente
> BG-04 não possui."*

**A cura foi feita hoje**: `bases_de_instalacao()` deriva de `sys.prefix`, e os
quatro resolvedores a consomem. O próprio portão previu a morte da lápide
(`:1636-1639`), mas ela **não disparou**, e o motivo é mecânico: ele faz
`sed -n '/^BASES_DE_INSTALACAO/,/^)/p'` e procura a string `sys.prefix` no
bloco. A constante hoje é uma linha só (`= bases_de_instalacao()`) e não
contém a string — o `grep` cala, o portão fica verde e a lápide sobrevive
**dizendo algo que já não é verdade**.

`scripts/check_packaging_parity.sh` não está na minha posse. **Relato, não
edito** (R-A). O conserto é apagar a entrada de `_PRODSCRIPT_LACUNAS_HOJE` e
apontar o gatilho de morte para `utils/repo_files.py` em vez de
`daemon_actions.py`.

### 3. As duas frases de tela que mudaram esperam o olho dela

`mouse_actions.py:605` e `storm_doctor.py:334` (tabela acima). Entram na fila
de `docs/process/2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md`, que não é
minha para editar. A frase de `emulation_actions.py:354` **não** entra: no
checkout ela é idêntica à de ontem.

### 4. A COSTURA ESTÁ BLOQUEADA, e não por nada desta frente

`scripts/costurar.sh --seco` **recusa**, com a última linha:

```
REPROVOU: 1 vermelho(s) de 26 -> colisao-de-sprints
ERRO: portão vermelho. A costura não passa por cima de portão.
```

O vermelho é o pré-existente da seção dos portões, e ele **bloqueia as SETE
frentes da LEVA 1 do mesmo jeito** — não é meu, não é de código, e o conserto
está no frontmatter de `docs/process/sprints/2026-08-26-LEVA-1-*.md`, que não é
posse de frente nenhuma: declarar `depois_de:` ou `nao_toca:` nos doze pares
que o portão nomeia (`LEVA-1` × onze sprints de 24/08 + `INFRA-DE-EXECUCAO-01`).

**A branch `voo/LEVA-1-E` está pronta e limpa**, com os quatro commits e a
árvore sem nada por commitar. Assim que o frontmatter for declarado, a costura
passa sem que eu precise voltar.

### 5. O portão `colisao-de-sprints` continua vermelho no `dev`

Pré-existente e de documento de sprint, não de código (prova na seção dos
portões). Ele nomeia doze pares — `LEVA-1` × onze sprints de 24/08 — e o
conserto que ele mesmo sugere é declarar `depois_de:` ou `nao_toca:` no
frontmatter de quem não é dona. Não é frente nenhuma da LEVA 1.

### 6. Nenhuma lápide desta frente

`pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q` → 35 passed.
Esta frente não liga nem apaga chave nenhuma da lista (R-B).
