# O QUE FICOU FORA · 01 — o que sessenta agentes mediram e o repositório não guardou

**24/08/2026.** Não é sprint de aba nem de produto: é a **conferência de
cobertura** da leva de 23/08. Nasce do pedido dela, textual:

> *"Por isso eu queria agentes lendo o trabalho dos demais, pra ver se tudo foi
> materializado nas sprints e no sprint order e afins. Pra depois de tudo certo
> no repo, execução."*

E do que ela disse antes:

> *"Não podemos deixar o trabalho dos agentes morrer na pesquisa. Tudo tem que
> ter uso aqui dentro."*

| | |
|---|---|
| **A pergunta** | O que sessenta agentes MEDIRAM em 23/08 e **não** existe no repositório. Achado em relatório é token queimado; achado em disco é trabalho pago. |
| **Grau** | **MEDIDO** em tudo que tem comando ao lado — cada linha do §2 e do §3 foi reproduzida nesta árvore em 24/08, à mão, e não copiada do briefing de auditoria. **NÃO REPRODUZIDO** e **NÃO VERIFICADO** estão declarados no §6, item a item, e três achados de agente foram **DERRUBADOS** ali. |
| **Fecha** | Todo achado de 23/08 tem exatamente um destino declarado: registro datado, tarefa com mordida, linha no painel dela, ou recusa com motivo escrito. Nenhum fica em relatório. |
| **NÃO faz** | **Não toca `src/`, não toca teste, não reescreve sprint de outro agente.** Não conserta os defeitos que nomeia — dá dono a eles. Não escreve as dezoito sprints do §5. |
| **Cura o defeito de forma** | **F11** ganha dono (é o único dos quinze sem nenhum), e o §3.2 acrescenta uma classe nova de portão cego que nenhum F cobria: **o documento órfão de entrada**. |
| **Depende de** | Nada. Todas as tarefas são de disco, e treze das quinze são de minutos. |
| **Origem** | Conferência de 24/08 nesta árvore, sem parar o daemon, sem rodar a suíte e sem escrever byte no aparelho. |

---

## 1. O resultado, em quatro frases

**A fila está inteira.** As 22 sprints de 24/08 estão todas citadas no
`docs/process/SPRINT_ORDER.md` — 22 de 22, conferidas uma a uma pelo nome de
arquivo. Nenhuma sprint desta leva ficou fora da fila.

**O que ficou fora não foi sprint: foi o resto.** Um protocolo de execução que o
git não conhece, um documento de medição que nenhuma página aponta, quatro
defeitos vivos sem dono, três números errados na porta de entrada, e o registro
que a máquina lê com zero decisões dela dentro.

**O padrão é limpo e vale mais que a lista:** *quem mediu e executou,
materializou; quem mediu e planejou, não.* Os agentes que abriram arquivo e
mediram deixaram sprint em disco. Os que sintetizaram plano deixaram o plano no
relatório.

**E o defeito que mais se repete é o mais barato de curar:** o portão é cego a
arquivo novo, e a casa sabe disso — está escrito no `CLAUDE.md`. Duas das quatro
urgências do §2 são exatamente isso, pela segunda leva seguida.

---

## 2. O que ficou fora — a tabela

O que a coluna "por que não chegou" diz é **mecanismo**, não culpa. Cada linha
tem a prova no §3.

| # | O achado | Quem mediu | Por que não chegou ao disco | Onde DEVERIA morar |
|---|---|---|---|---|
| **1** | `docs/process/COMO-EXECUTAR-UMA-SPRINT.md` existe, tem 240 linhas, e **não está no git** | quem coordenou 23/08 | portão é cego a arquivo novo; ninguém rodou `git add` | rastreado, e apontado pelo `CLAUDE.md` e pelo `SPRINT_ORDER.md` |
| **2** | "Aplicar e fechar" **grava e recusa fechar**: o contrato do retorno está invertido | conferência de 24/08 | a cura de 23/08 escreveu o contrato oposto no comentário e o dublê do teste confirmou o comentário | tarefa com mordida — hoje sem dono em sprint nenhuma |
| **3** | **FORMA 3:** entrar no Modo Nativo com alvo que saiu da mesa **não libera ninguém** | dois agentes de 23/08 | a Z3 varre o *fan-out*; este é o inverso — um sítio que passou a não fazer nada | tarefa na Z3, que é a dona da rota de alvo |
| **4** | O `.deb` **mata o daemon no `apt upgrade`** e nada o religa | agente de empacotamento | nenhuma sprint da leva olha `packaging/debian/` | a frente que produzir a 0.9.5, que **não existe** |
| **5** | `check_packaging_parity.sh` testa **1 de 7** empacotadores; os outros 6 são pulados em silêncio | agente de empacotamento | o `|| continue` do portão pula quem não leva `doctor.sh`, que é justamente quem falha | tarefa no balde de instalação e empacotamento |
| **6** | `docs/protocol/onde-a-porta-usb-mora.md` é **órfão de entrada**: 0 referências | agente das portas USB | `validar-referencias-docs.py` vê referência morta de SAÍDA, nunca órfão de ENTRADA | apontado pela PORTAS-DA-CASA-01, que depende dele |
| **7** | `docs/data/LEIA-PRIMEIRO.md` publica **47 colunas, 13 pares, 696.546 bytes**; são **49, 14, 701.611** | agente do mapa | o fato errado foi registrado na FILA e não substituído na FONTE | substituído no próprio arquivo |
| **8** | `CLAUDE.md:113` diz "6645 verdes", e o `CLAUDE.md` **não é versionado** | conferência de 24/08 | `.gitignore:90` | substituído; e a decisão sobre versionar é dela |
| **9** | A cor por rádio (HANDSHAKE 0x04) está em **11 documentos e em 0 linhas do CSV** | agente da cor | o elo medição→CSV→tela não existe (é o F10) | `docs/data/mapa-controles.csv`, que é o portão |
| **10** | `~392 Hz` — a substituição foi escrita no doc e **não desceu para 5 sítios em `src/`** | agente do rádio | correção pela metade | os cinco sítios, e o §1015 do mesmo documento |
| **11** | Não há **versão de protocolo nem de esquema**: a Z1 e a Z4 se desligam sozinhas contra daemon/perfil anterior | dois agentes de compatibilidade | nenhuma das duas sprints tem tarefa de formato | tarefa na Z1 e tarefa na Z4 |
| **12** | Nenhum fato de identidade tem dono: **14 definições independentes** de VID/PID em `src/` | agente da identidade | a sprint que faria a varredura é uma das dezoito não materializadas | balde nomeado na Onda 12 |
| **13** | `docs/process/agentes/` está **vazio para 23/08** — de 60+ agentes, zero saídas salvas | conferência de 24/08 | `COMO-REGER-AGENTES.md` ensina a regra, e a leva não a cumpriu | `docs/process/agentes/2026-08-23/` |
| **14** | **F11 (o léxico) é o único defeito de forma sem dono** — 0 das 23 sprints o reclama | conferência de 24/08 | ficou na §0.1 "para não se perder", que é exatamente onde as coisas se perdem | uma frente Z8, ou um balde da Onda 12 com sprint |
| **15** | `docs/data/decisoes-dela.csv`: **9 abertas, 0 decididas**; as D-A..D-M do SPRINT_ORDER nunca entraram | conferência de 24/08 | três dialetos de decisão com interseção zero | o CSV, que é o único com portão e gerador |

---

## 3. A separação — e ela é o valor deste documento

Três coisas se confundem em relatório de agente e não podem se confundir em
disco. **Medição** vira registro datado, porque as specs são a memória externa
dela. **Defeito** vira tarefa com mordida, porque teste que passa com a cura
arrancada não testa nada. **Decisão dela** vai para o painel, porque ela decide
vendo, e o que decidiu tem de sobreviver ao `/clear`.

### 3.1 MEDIÇÃO — o que precisa virar registro datado

#### (a) O CSV do mapa não recebeu a cor por rádio

```bash
$ grep -c "HANDSHAKE 0x04" docs/data/mapa-controles.csv
0
$ grep -rl "HANDSHAKE 0x04" docs/ | wc -l
11
$ sed -n '111p' docs/data/mapa-controles.csv | cut -c1-70
identidade.cor_do_aparelho,dualsense,...,divida,...
```

Onze documentos carregam a medição de 23/08. A linha do CSV ainda diz `divida`,
com a evidência de 15/08. **É o F10 na sua forma mais pura**: o elo medição →
CSV → `specs.html` → tela não existe, e o que chega à tela chega por alguém
lembrar. Este é o nono sítio invisível da mesma medição.

#### (b) A porta de entrada do mapa publica três números errados

```bash
$ head -1 docs/data/mapa-controles.csv | tr ',' '\n' | wc -l
49
$ wc -c docs/data/mapa-controles.csv
701611 docs/data/mapa-controles.csv
$ grep -n "47 colunas\|13 pares\|696.546" docs/data/LEIA-PRIMEIRO.md
29: ... 308 linhas x 47 colunas ...  | 696.546 |
43: ... as 47 colunas, os 13 pares ...
63: 26 das 47 colunas vêm em pares ... (13 pares)
```

São **49 colunas, 14 pares (28 colunas), 701.611 bytes**. O par que sumiu da
conta é `cabo_por_que_nao_aciona` / `radio_por_que_nao_aciona` — **a porta de
entrada esqueceu a coluna porque nada nunca a mostra**, que é a mesma causa da
alínea (a).

**Ressalva honesta:** o `SPRINT_ORDER.md` **já registra** que estes números
estão errados, no balde "documentação". O que falta não é o registro: é a
substituição na FONTE. Pela regra da casa, fato errado sai de TODOS os lugares
onde aparece, e o lugar onde ele engana é o `LEIA-PRIMEIRO.md`, que é o primeiro
arquivo que alguém abre.

#### (c) A régua da suíte, no primeiro arquivo que todo mundo lê

```bash
$ grep -n "6645" CLAUDE.md
113:.venv/bin/python -m pytest -q               # 6645 verdes em 01/08
$ grep -rhoE "^\s*def test_" tests/ | wc -l
9468
$ grep -n "CLAUDE.md" .gitignore
90:CLAUDE.md
```

**A régua de disco SUBCONTA** (não expande parametrizado), então 9.468 é piso, e
mesmo assim o erro é de ~43%. Quem chega calibra "a suíte está inteira?" pelo
número errado. Junto: o portão de entrada do projeto **não viaja com o
produto** — quem clona não recebe o `CLAUDE.md`.

#### (d) A correção do teto do rádio parou no documento

```bash
$ grep -rn "392" src/hefesto_dualsense4unix/ | grep -v color_contrast | grep -v led_control
core/physical_report_reader.py:59:  ... A faixa registrada é "entre ~55 e ~392 Hz" (:902).
core/physical_report_reader.py:63:  ... O teto (~392 Hz) é o mesmo nas duas. Quem citar
core/physical_report_reader.py:225:#: registra o rádio sustentando "entre ~55 e ~392 Hz"
daemon/subsystems/bt_mic.py:26:   ~392 Hz" com o mic DESLIGADO, p95 de intervalo em 187 ms
daemon/subsystems/bt_mic.py:28:   que oscila 55 a 392 não perde resolução ...
$ sed -n '838p' docs/protocol/driver-hid-playstation.md
> **NOTA DATADA — 23/08/2026: os ~392 Hz não são do CONTROLE, são da METADE de ...
```

A substituição está escrita em `driver-hid-playstation.md:838-856`. Não desceu
para cinco sítios em `src/`, **nem para a linha :1015 do próprio documento**, que
repete a redação velha. **A constante `MOTION_EMIT_MAX_HZ` não muda** — o que
caducou é a justificativa ao lado dela, e é ela que a próxima pessoa vai ler.

#### (e) A dívida de processo que ninguém declarou

```bash
$ ls docs/process/agentes/
2026-08-06
README.md
```

`COMO-REGER-AGENTES.md:186-189` manda a saída bruta de agente para
`docs/process/agentes/<data>/`, via `scripts/sanitizar_saida_de_agente.py`, que
existe desde 07/08. De 60+ agentes de 23/08, **nenhuma saída salva**. O
documento ensina a regra que a própria leva não cumpriu — e é por isso que esta
conferência teve de reconstruir os achados a partir dos `journal.jsonl` em vez
de os ler prontos.

### 3.2 DEFEITO — o que precisa virar tarefa com mordida

#### (a) "Aplicar e fechar" grava e depois RECUSA fechar

**O defeito mais caro deste documento, porque está no fluxo diário dela e foi
criado pela cura de ontem.**

`_gravar_declaracao_de_maquina` é `-> str | None`
(`src/hefesto_dualsense4unix/app/actions/footer_actions.py:272`). Os quatro
retornos, medidos:

| linha | caso | devolve |
|---|---|---|
| `:304` | nada declarado | `None` |
| `:317` | sucesso com descartes | a frase dos descartes |
| `:321` | **sucesso** | `_("Configurações gravadas.")` |
| `:323` | fracasso | `motivo` |

Ou seja: `None` significa *"não havia o que declarar"*, e **string significa
sucesso OU fracasso, indistintamente**.

Do outro lado, `src/hefesto_dualsense4unix/app/app.py:619-628`:

```python
# `_gravar_declaracao_de_maquina` devolve `None` no sucesso e a FRASE
# do motivo no fracasso (contrato de `footer_actions`). Recusa segura
# a janela: ...
recado = self._gravar_declaracao_de_maquina()
if recado is not None:
    with contextlib.suppress(Exception):
        self._footer_toast(recado)
    return False
```

O comentário afirma o contrato **oposto ao que o código do outro lado
implementa**, com todas as letras. O efeito na tela dela: ela declara na aba
Configurações, clica "Aplicar e fechar", **o arquivo É gravado**, a janela **não
fecha**, e o rodapé exibe *"Configurações gravadas."* como se fosse o motivo da
recusa.

A cura de 23/08 estava certa no princípio (recusa tem de segurar a janela) e
errada no contrato. **A mordida:** um teste que grave com sucesso pela porta do
"Aplicar e fechar" e exija `True`. O dublê atual passa `recusa=None` no caminho
feliz — a régua fala um dialeto que o produto não fala, que é o F15 exato.

**Não tem dono.** A `CONFIGURACOES-FECHA-01` cita
`_gravar_declaracao_de_maquina` uma vez (`:146`), e o assunto lá é o texto da
dica do botão, não o contrato do retorno.

#### (b) FORMA 3 — a cura do alvo tornou o release do Modo Nativo um no-op

`_release_controller_to_game`
(`src/hefesto_dualsense4unix/daemon/lifecycle.py:1150`) neutraliza a saída do
Hefesto para entregar o controle ao jogo. A primeira coisa que ele faz:

```python
off = build_from_name("Off", [])
self.controller.set_trigger("left", off)
self.controller.set_trigger("right", off)
```

`set_trigger` cai em `_for_each`
(`src/hefesto_dualsense4unix/core/backend_pydualsense.py:2698`), cujo docstring
diz, palavra por palavra:

> *"alvo presente aplica SÓ nele, sem alvo aplica em todos, e **alvo ausente não
> aplica em ninguém** (o broadcast histórico daquele caso caducou)"*

e, logo abaixo:

> *"`broadcast=True` IGNORA o seletor (broadcast real — o caminho do perfil, que
> não pode ser sequestrado pelo alvo da GUI)"*

**O release não passa `broadcast=True`.** Entrar no Modo Nativo com um alvo
apontado para um controle que saiu da mesa **não libera ninguém** — os gatilhos
seguem impostos em todos —, onde antes de `fc735c7` liberava todos. E o
argumento que justifica o `broadcast=True` do perfil vale idêntico aqui: entregar
o controle ao jogo **não é um gesto mirado da usuária**, é uma mudança de regime.

**Por que a Z3 não pega:** o §2.4 dela e a tarefa Z3-0c varrem *fan-out fora de
`_resolver_escopo`* — sítios que espalham demais. Este é o inverso: um sítio que
passa POR `_resolver_escopo` e agora não faz nada. Uma varredura de fan-out não
o encontra, porque ele não faz fan-out nenhum. **A Z3 é a dona certa; a tarefa é
nova.**

#### (c) O `.deb` mata o daemon no `apt upgrade` e nada o religa

```bash
$ grep -n pkill packaging/debian/prerm
15:        pkill -TERM -f 'hefesto_dualsense4unix\.app\.main' ...
16:        pkill -TERM -f 'hefesto-dualsense4unix daemon start' ...
   # o `case` acima cobre remove|upgrade|deconfigure
$ grep -n systemctl packaging/debian/postinst
31:        echo "  systemctl --user enable --now hefesto-dualsense4unix.service"
$ grep -nE "Restart|SuccessExitStatus" assets/hefesto-dualsense4unix.service
23:Restart=on-failure
27:SuccessExitStatus=143 SIGTERM
```

O `prerm` manda SIGTERM no ramo `upgrade`. O `.service` declara SIGTERM como
**saída de sucesso**, e `Restart=on-failure` não respawna sucesso. O `postinst`
não sobe nada: a única menção a `systemctl` está **dentro de um `echo`**.

O `install.sh` tem a cura, e o porquê está escrito ao lado (`:3200-3205`):

> *"`restart` e não `start`: numa reinstalação por cima, o daemon em memória é o
> binário ANTIGO — sem isso a pessoa roda o install, vê 'sucesso' e segue usando
> o código anterior até relogar."*

O `.deb` não herdou. Quem der `apt upgrade` cai **exatamente no pior modo de
falha já medido nesta casa** — o F7, tela em verde sobre daemon morto.

#### (d) O portão de paridade de empacotamento testa 1 de 7

`scripts/check_packaging_parity.sh:882` faz `grep -qF 'doctor.sh' <<< "$_bt_codigo" || continue`
antes de cobrar o par `bluez_config.sh`. Reproduzindo a lógica exata do portão,
com os comentários descartados como ele descarta:

```bash
$ for f in scripts/build_deb.sh flatpak/br.andrefarias.Hefesto.yml \
           scripts/build_appimage.sh scripts/build_appimage_gui.sh \
           packaging/fedora/hefesto-dualsense4unix.spec \
           packaging/arch/PKGBUILD packaging/nix/package.nix; do
    c=$(grep -v '^[[:space:]]*#' "$f")
    echo "$f doctor=$(grep -cF 'doctor.sh' <<< "$c") bluez=$(grep -cF 'bluez_config.sh' <<< "$c")"
  done
scripts/build_deb.sh                    doctor=1  bluez=1
flatpak/br.andrefarias.Hefesto.yml      doctor=0  bluez=0
scripts/build_appimage.sh               doctor=0  bluez=0
scripts/build_appimage_gui.sh           doctor=0  bluez=0
packaging/fedora/hefesto-dualsense4unix.spec  doctor=0  bluez=0
packaging/arch/PKGBUILD                 doctor=0  bluez=0
packaging/nix/package.nix               doctor=0  bluez=0
```

**Seis dos sete empacotadores caem no `continue` e nunca são testados.** O
portão passa `[ OK ]` afirmando "dono empacotado com o doctor" sobre uma amostra
de um.

E o buraco real é maior que o do par: Fedora e Arch **empacotam os ajudantes de
Bluetooth** e não empacotam nem o `doctor.sh` nem o `bluez_config.sh`:

```bash
$ grep -nE 'bt_[a-z_]*\.sh' packaging/arch/PKGBUILD | head -3
239:        scripts/bt_nosniff_now.sh \
240:        scripts/bt_active_mode.sh \
241:        scripts/bt_ponte_privilegiada.sh \
```

**FATO ERRADO A SUBSTITUIR:** o `SPRINT_ORDER.md:364` publica que os dois
scripts do botão "Aplicar correções" não viajam em pacote nenhum, *"provado para
o PKGBUILD e o `install.sh`; **forte suspeita, não provado, para o `.deb`**"*. A
medição acima **derruba a suspeita**: o `.deb` é o único que leva os dois
(`scripts/build_deb.sh:234`). O buraco é Fedora, Arch, Nix, Flatpak e os dois
AppImage.

A tarefa tem duas metades, e **curar só a primeira deixa a regressão voltar**:
levar os scripts nos seis, e **inverter o gate** para que "não leva `doctor.sh`"
seja falha, não isenção.

#### (e) A Z1 e a Z4 se desligam sozinhas em quem atualizou

```bash
$ grep -rnE "schema_version|protocol_version|ipc_version|PROTO_VER" src/ | wc -l
0
```

Não existe versão de protocolo nem de esquema em lugar nenhum de `src/`.

* **Z1** depende de um campo NOVO do daemon para provar que o gesto chegou.
  Contra um daemon velho, o `getattr(..., None)` do lado da janela devolve
  `None` e a tela **volta a dizer "aplicado" sem prova** — a cura se desliga
  sozinha, em silêncio, exatamente no usuário que atualizou pela metade. E este
  não é um risco hipotético: o daemon vivo desta casa **já é mais velho que o
  código** por instalação editable, e o sintoma é a AUSÊNCIA de dado.
* **Z4** acrescenta campos a submodelos de perfil com `extra="forbid"`. Um perfil
  novo aberto por um Hefesto anterior é recusado **inteiro** — com os perfis dela
  como corpo de prova.

Nenhuma das duas sprints tem tarefa de compatibilidade de formato. **Custo
agora: um campo. Custo depois: os perfis dela recusados inteiros.**

#### (f) O documento órfão de entrada — e a classe de portão cego que ele revela

```bash
$ git ls-files --error-unmatch docs/protocol/onde-a-porta-usb-mora.md
docs/protocol/onde-a-porta-usb-mora.md
$ grep -rn "onde-a-porta-usb-mora" --exclude-dir=.git . \
    | grep -v "^./docs/protocol/onde-a-porta-usb-mora" | wc -l
0
```

Rastreado, 16.504 bytes de medição ACPI feita ontem, e **inalcançável por
navegação**: nem o `CLAUDE.md`, nem o `SPRINT_ORDER.md`, nem a
`PORTAS-DA-CASA-01` — **que depende dele** — o apontam.

`scripts/validar-referencias-docs.py` reprova documento que CITA arquivo
inexistente. Ele é estruturalmente cego ao inverso: **arquivo que existe e
ninguém cita.** É uma classe inteira que nenhum dos quinze defeitos de forma
cobre, e o custo dela é o custo de sempre nesta casa — a próxima sessão remede o
que já está medido.

#### (g) O protocolo do executor que o `/clear` apaga

```bash
$ git status --short
?? docs/process/COMO-EXECUTAR-UMA-SPRINT.md
$ wc -l docs/process/COMO-EXECUTAR-UMA-SPRINT.md
240 docs/process/COMO-EXECUTAR-UMA-SPRINT.md
$ grep -rn "COMO-EXECUTAR-UMA-SPRINT" --exclude-dir=.git . \
    | grep -v "^./docs/process/COMO-EXECUTAR" | wc -l
0
```

Duzentas e quarenta linhas que abrem dizendo *"Você é o agente executor. Este
arquivo é o seu protocolo, do começo ao fim"* e *"cada linha aqui é um defeito
real de 23/08/2026 — três falhas de processo, remendadas à mão por uma pessoa
que um `/clear` apaga."*

**O arquivo que existe para impedir que o conhecimento morra no `/clear` morre
no `/clear`.** Nenhum portão o pega: a regra está escrita no `CLAUDE.md` —
*"Portões são cegos a arquivo novo: rode-os depois do `git add`"* — e é a
repetição exata do defeito da véspera, quando cinco scripts não rastreados eram
anunciados como entregues.

A `INFRA-DE-EXECUCAO-01` **não o cobre**: a única ocorrência de "COMO-EXECUTAR"
nela (`:1117`) aponta o `COMO-EXECUTAR.md` da aba Configurações, que é outro
arquivo.

#### (h) O léxico é o único defeito de forma sem dono

Cruzando **F1..F15** contra as 23 sprints de 24/08, pelo número:

```bash
$ for f in docs/process/sprints/2026-08-24-*.md; do
    printf "%-46s %s\n" "$(basename "$f" | cut -c12-46)" \
      "$(grep -oE '\bF1[0-5]\b|\bF[1-9]\b' "$f" | sort -u | tr '\n' ' ')"
  done
```

Todo F aparece em pelo menos uma sprint — **F11 aparece em zero.** As sete
ocorrências dele em `docs/` são: duas sobre a tecla F11 do teclado, três sobre a
renumeração F/P, e duas que são a própria linha da lista. E essa linha confessa:

> *"Herdado do desenho das 19h30 e **NÃO remedido nesta síntese** — fica na
> lista para não se perder"*

`docs/process/SPRINT_ORDER.md:164` é, aliás, **a única linha da tabela dos
quinze que não está em negrito** — a tipografia já marcava o órfão.

Não tem balde na Onda 12, não tem sprint, e `docs/data/glossario.csv` não
existe. <!-- ref-externa: o assunto do parágrafo é exatamente a ausência deste arquivo -->

**O cruzamento que morde:** o único defeito de forma sem dono é exatamente o que
as sprints não materializadas do §5 cobririam. E o motivo de a Onda 0 existir é
que invariante sem dono vira onze implementações — **um léxico sem dono vira
onze léxicos**, escritos em paralelo pelas onze ondas, esta semana.

#### (i) Dado sem dono declarado, e é o F5 na sua forma mais crua

```bash
$ grep -rnE '^_?[A-Z_]*(VENDOR|PRODUCT|VID|PID)[A-Z_]* = 0x' src/ | wc -l
14
$ grep -c "hefesto-dualsense4unix" install.sh uninstall.sh
install.sh:55
uninstall.sh:98
```

Catorze definições independentes dos mesmos quatro números de identidade, sem
módulo dono. O sintoma de esquecer uma é o `SDL_GAMECONTROLLER_IGNORE_DEVICES`
escondendo o controle errado — a queixa mais cara que já chegou aqui. E onde o
dono **existe** (`APP_ID`), ele é contornado: 98 literais contra 9 usos da
constante no `uninstall.sh`.

**Nenhuma das 23 sprints reclama isto** (`grep -l "APP_ID" docs/process/sprints/2026-08-24-*.md`
não devolve nada), e a sprint de varredura que o faria é uma das dezoito do §5.

### 3.3 DECISÃO DELA — o que precisa ir para o painel

O registro que a máquina lê tem **nove decisões e zero decididas**:

```bash
$ python3 -c "
import csv; r=list(csv.DictReader(open('docs/data/decisoes-dela.csv')))
print(len(r), {x['estado'] for x in r},
      'com escolha:', sum(1 for x in r if x['escolha'].strip()))"
9 {'aberta'} com escolha: 0
```

**Correção ao briefing desta conferência:** o CSV **tem** as colunas `escolha`,
`decidida_em` e `estado`, e `scripts/gerar-painel.py:369` já separa abertas de
`decidida`, com teste que morde
(`tests/unit/test_o_painel_encabeca_as_decisoes_dela.py:114`, *"a decidida
continua na página"*). **A estrutura existe.** O que falta é conteúdo: nenhuma
decisão que ela já tomou foi escrita ali.

E as decisões que ela tomou vivem em **três espaços de nomes disjuntos**:

| dialeto | onde | quantos | interseção |
|---|---|---|---|
| `D-<NOME>` | `docs/data/decisoes-dela.csv` | 9, todas abertas | — |
| `D-A` .. `D-M` | `docs/process/SPRINT_ORDER.md` | 12 | **0** com o CSV |
| `D1`, `D2`, `D3` | `2026-08-23-ONDE-PARAMOS` | 3 | **0** com os dois |

**Esta sprint materializa o terceiro dialeto**, que é o que estava mais perto de
se perder: D1, D2 e D3 entram no CSV como `estado=decidida`, com o texto dela
preservado e a procedência apontando para a prosa de origem. Ver §4.

As D-A..D-M ficam para a tarefa T14 — são doze, e reconciliá-las exige ler o
`SPRINT_ORDER.md` inteiro, que está em movimento agora.

---

## 4. O que ESTA sprint já materializou

Duas ações, dentro do que lhe foi autorizado — nada em `src/`, nada em teste,
nenhuma sprint de outro agente tocada.

**(1) Três decisões dela entraram no painel.** Acrescentadas a
`docs/data/decisoes-dela.csv` como `estado=decidida`, com `decidida_em=2026-08-23`:

| id | o que ela decidiu | prosa de origem |
|---|---|---|
| `D-ORDEM-DAS-ONDAS` | transversal primeiro: Onda 0 = invariantes, 1..11 = abas, 12 = o resto | ONDE-PARAMOS 23/08 §5 (D1); `SPRINT_ORDER.md:72` |
| `D-BLUETOOTH-E-TRILHA-DELA` | o mapeamento de BT não é planejado no plano; cada sprint declara qual pergunta de BT a bloqueia | ONDE-PARAMOS 23/08 §5 (D2); `SPRINT_ORDER.md:360` |
| `D-CLASSE-COSMETICA` | classe cosmética pré-aprovada sem o olho dela; texto, ordem de seções e o que nasce visível esperam por ela | ONDE-PARAMOS 23/08 §5 (D3) |

**(2) Um ponteiro no `SPRINT_ORDER.md`.** A `INFRA-DE-EXECUCAO-01` era a única
sprint desta leva **fora da fila** (22 de 24/08 citadas, ela não), e os dois
artefatos não rastreados do §3.2(g) e §3.2(f) não tinham porta de entrada.
Acrescentado um bloco curto que aponta os três e esta conferência.

---

## 5. O que NÃO vale materializar — e por quê

**Esta seção é metade do valor do documento.** Nem todo achado merece disco:
opinião de agente, resumo do que já está escrito, e coisa que outro documento já
cobre custam atenção de quem lê e contexto de quem processa, que é o preço que
ela pediu para cortar duas vezes.

### 5.1 Achado de agente DERRUBADO pela conferência — não entra, e o registro é a derrubada

| o que o agente afirmou | o que a medição diz |
|---|---|
| *"co-op sempre ligado é falso na Conexão Nativa e **nenhum registro existe**"* | **Existe.** `SPRINT_ORDER.md:364` traz o fato, com a âncora `coop.py:307-313`, dentro do balde de co-op. A régua do agente procurou o nome da função (`should_be_active`), não o fato. **Ausência de grep não é ausência de registro** — e este é o terceiro caso deste tipo nesta leva. |
| *"`bash i18n_extract.sh` destrói tradução feita à mão"* | **Falso como escrito.** `scripts/i18n_extract.sh:65-70` roda `msgmerge --update --backup=none` sobre cada `po/*.po`, que é o comando do gettext cuja função é **preservar** tradução. O comentário no próprio script diz *"Atualiza .po existentes preservando traduções"*. Sem uma medição por mordida, não entra. |
| *"o buraco de empacotamento é do `.deb`"* (`SPRINT_ORDER.md:364`, "forte suspeita") | **Derrubado**, e a substituição está no §3.2(d): o `.deb` é o único que leva os dois scripts. |

### 5.2 Medição NEGATIVA — vale UMA linha cada, e nada mais

Duas medições de 23/08 cujo valor inteiro é **impedir que uma leva futura faça
fogueira inútil**. Não viram tarefa; ficam aqui como registro datado:

* **A prosa do `src/` não é dívida.** Ela é ~62% do custo por token, mas dez de
  dez parágrafos de uma amostra aleatória **pagam o teste da casa** (*"apagar
  isto faria alguém repetir trabalho?"*). **Não cortar.** Quem propuser "enxugar
  os comentários" está propondo apagar decisão medida.
* **`plataforma.udev_autosuspend` é assimetria legítima**, não buraco de
  paridade. Sai de toda lista de dívida onde aparecer.

### 5.3 As dezoito sprints e os dez artefatos dos sintetizadores — a LISTA entra, as sprints não

Dois agentes sintetizadores desenharam dezoito sprints e prescreveram dez
artefatos. **Os dez foram conferidos um a um, e os dez estão AUSENTES:**
<!-- ref-externa: o assunto deste parágrafo é exatamente a ausência destes dez arquivos -->

* `scripts/portoes.sh` — um só ponto de entrada para todos os portões <!-- ref-externa: a ausência é o assunto -->
* `scripts/gerar-fila.py` — a fila gerada em vez de mantida à mão <!-- ref-externa: a ausência é o assunto -->
* `scripts/check_identidade_unica.py` — o portão do VID/PID com dono <!-- ref-externa: a ausência é o assunto -->
* `scripts/check_casa_unica.py` — o portão do `APP_ID` sem literal <!-- ref-externa: a ausência é o assunto -->
* `scripts/check_paridade_de_portoes.py` — cada portão com a sua régua <!-- ref-externa: a ausência é o assunto -->
* `scripts/check_caminho_de_entrada.py` — o portão do órfão do §3.2(f) <!-- ref-externa: a ausência é o assunto -->
* `core/identidade_do_aparelho.py` — o dono dos quatro números do §3.2(i) <!-- ref-externa: a ausência é o assunto -->
* `docs/data/donos-unicos.csv` — quem é dono de qual fato <!-- ref-externa: a ausência é o assunto -->
* `docs/data/glossario.csv` — o léxico do F11 <!-- ref-externa: a ausência é o assunto -->
* `Makefile` — os comandos da casa num lugar só <!-- ref-externa: a ausência é o assunto -->

**Escrever as dezoito agora seria planejar sobre um produto que a Onda 0 vai
mudar** — e a Onda 0 existe justamente porque as invariantes mudam o que cada
aba tem de fazer (D1, dela). O que se materializa é **a lista, num lugar só**,
para que a pesquisa não seja refeita. Os itens dela que já viraram tarefa aqui
(o léxico, a identidade, o caminho de entrada) estão no §3 com dono; o resto
espera a Onda 0 rodar.

### 5.4 O que já tem dono e não se repete aqui

O co-op no Modo Nativo (balde de co-op do `SPRINT_ORDER.md`), o teto de 4
jogadores da GUI (mesmo balde), o `x11_connect_failed` (F8, `D-TROCA-DE-PERFIL-CEGA`
e `SISTEMA-O-VIGIA-VIVO-01`), o `hci1` bloqueado (`D-HCI1-BLOQUEADO`), e as
medições de porta USB (`PORTAS-DA-CASA-01`). **Registrado que foram conferidos;
não reescritos.**

---

## 6. NÃO VERIFICADO — e continua não verificado

Curto de propósito, e cada linha diz o que faltou.

1. **Não rodei a suíte, `mypy`, nem portão pesado.** Três frentes escrevem nesta
   árvore agora; medir árvore em movimento produz alarme convincente e falso, e
   `pytest` cria nós uinput reais que já derrubaram a tela dela. **A contagem de
   9.468 `def test_` é régua de disco, não `pytest --collect-only`** — subconta
   parametrizado, e serve só para provar que 6645 está errado, nunca para dizer
   qual é o número certo.
2. **Não abri os transcritos de 81 MB.** Trabalhei sobre o que os agentes
   devolveram e **conferi contra a árvore**. Achado que um agente mediu e não pôs
   no retorno final não aparece aqui.
3. **Não conferi as 22 sprints tarefa a tarefa.** Cruzei por FATO
   (`arquivo:linha`, número medido, nome de função) e por sigla F1..F15. Uma
   sprint pode cobrir um achado com palavras que meu `grep` não alcançou — foi
   assim que o co-op do §5.1 quase virou achado falso.
4. **Não fotografei tela.** Todo achado de interface aqui é leitura de fonte. O
   "Aplicar e fechar" do §3.2(a) está confirmado pelos quatro `return` e pelo
   `if`, **não por execução da GUI** — e a execução é a única forma de fechá-lo
   com certeza. É da bancada dela.
5. **O tamanho do F11 eu não reproduzi.** O agente relatou ~650 strings de tela
   contra 389 no `.pot`. O que medi: **390 `msgid` no `.pot`**, 103 chamadas
   `_("` em `src/` e 319 marcas `translatable` no `main.glade` — que não fecham a
   conta dele em nenhuma direção óbvia. **O que está provado é que F11 não tem
   dono**, não o tamanho dele.
6. **Não conferi a bancada viva** — o `rfkill` do `hci1`, os três adaptadores, o
   A/B de pacotes por segundo. Verifiquei a consequência em disco, não a
   medição.
7. **Não decidi se a dívida do alvo por caminho** (receiver de 2,4 GHz sem MAC
   estável) é absorvida pela Z3. Herdada e declarada duas vezes, continua sem
   dono claro, e não a listei como achado por isso.
8. **Ninguém rodou a suíte inteira em 23/08** — foram os testes do dia mais os
   modificados. **Não se sabe se há regressão fora deles, e essa ressalva não
   está no `CHANGELOG.md` nem na ONDE-PARAMOS.** É a maior incógnita da leva, e
   não é desta sprint fechá-la.

---

## 7. As tarefas

Ordem por custo de NÃO fazer, não por tamanho. **T1 a T4 são minutos e travam a
execução que começa agora.**

| # | Tarefa | Dono | Mordida |
|---|---|---|---|
| **T1** | `git add` no `COMO-EXECUTAR-UMA-SPRINT.md`, e ponteiro a partir do `CLAUDE.md` | quem despachar a Onda 0 | `git ls-files --error-unmatch` no arquivo passa; e um `grep` por ele fora dele próprio devolve ≥ 1 |
| **T2** | Ponteiro de entrada para `onde-a-porta-usb-mora.md` a partir da `PORTAS-DA-CASA-01` | PORTAS-DA-CASA-01 | o `grep` por órfão de entrada devolve ≥ 1 |
| **T3** | Substituir o fato errado do `SPRINT_ORDER.md:364` pelo medido no §3.2(d) | esta fila | o texto novo nomeia Fedora, Arch, Nix, Flatpak e AppImage, e não o `.deb` |
| **T4** | A porta de entrada do dia (`2026-08-23-ONDE-PARAMOS`) cita só a Z0; acrescentar as outras seis Z e as sprints de 24/08 | quem reger a leva | as 22 sprints citadas por nome de arquivo |
| **T5** | **O contrato do "Aplicar e fechar"** — §3.2(a) | uma tarefa nova na `CONFIGURACOES-FECHA-01` | teste que grave com SUCESSO pela porta do "Aplicar e fechar" e exija a janela fechar. Arrancar a cura tem de reprovar |
| **T6** | **FORMA 3: `broadcast=True` no release** — §3.2(b) | tarefa nova na Z3 | teste com alvo apontado para um `uniq` ausente: entrar no Modo Nativo tem de escrever `Off` nos gatilhos de TODOS |
| **T7** | Dar dono ao **F11** — frente Z8 ou balde da Onda 12 com sprint | a fila | `grep -l "\bF11\b"` nas sprints devolve ≥ 1, e o dono nomeia `docs/data/glossario.csv` <!-- ref-externa: o artefato que a tarefa propõe criar --> |
| **T8** | Tarefa de **versão de formato** na Z1 e na Z4 — §3.2(e) | Z1 e Z4 | teste que abra um perfil da versão nova com o esquema anterior e exija recusa NOMEADA, não recusa do arquivo inteiro |
| **T9** | Substituir os três números do `LEIA-PRIMEIRO.md` (49 / 14 pares / 701.611) | quem tocar o mapa | os três batem com a medição do §3.1(b) |
| **T10** | Substituir o `6645` do `CLAUDE.md`; e a decisão sobre versioná-lo é dela | ela + quem tocar o `CLAUDE.md` | o número bate com `pytest --collect-only` rodado numa árvore parada |
| **T11** | Descer a substituição dos `~392 Hz` para os 5 sítios de `src/` e para `driver-hid-playstation.md:1015` | quem tocar o rádio | `grep -rn 392` em `src/` não devolve a justificativa velha |
| **T12** | A cor por rádio (HANDSHAKE 0x04) entra na linha `identidade.cor_do_aparelho` do CSV | Z6, que é a dona do elo | `grep -c "HANDSHAKE 0x04"` no CSV devolve ≥ 1 |
| **T13** | O `.deb` religa o daemon no `apt upgrade` — §3.2(c) | a frente da 0.9.5, que **não existe e é pré-requisito da entrega** | ciclo `apt install` → `apt upgrade` com o daemon no ar: ele volta sem gesto humano |
| **T14** | Reconciliar os três dialetos de decisão num só; as D-A..D-M entram no CSV | quem reger, depois que o `SPRINT_ORDER.md` parar de se mover | interseção não vazia entre os identificadores dos três lugares |
| **T15** | Salvar as saídas de agente de 23/08 em `docs/process/agentes/2026-08-23/`, se ainda houver `journal.jsonl` | quem reger | o diretório existe e não está vazio |

**Uma classe nova de portão, que nasce do §3.2(f) e não tem tarefa aqui de
propósito:** `validar-referencias-docs.py` é cego a documento órfão de entrada.
Curar isso é escrever uma régua nova, e régua nova nesta casa mente mais que o
produto — precisa de mordida própria e de uma contagem independente. **Fica
declarado, sem dono, até que alguém possa medi-lo direito.**

---

## 8. O aceite

Esta sprint fecha quando **todas** valerem:

1. **T1 a T4 feitas** — os quatro são de minutos, e enquanto não estiverem
   feitos a execução roda sem protocolo, sobre uma medição inalcançável e um
   fato errado na própria fila.
2. **T5 e T6 têm dono nomeado dentro da `CONFIGURACOES-FECHA-01` e da Z3** —
   não precisam estar consertados; precisam estar escritos como tarefa com a
   mordida do §7. São defeitos vivos criados ou expostos pela véspera, e
   entregar a 0.9.5 com regressão de véspera é o pior desfecho disponível.
3. **F11 tem dono** — uma frente ou um balde com sprint. Enquanto ele estiver só
   na §0.1 "para não se perder", as onze ondas escrevem onze léxicos em paralelo.
4. **O CSV das decisões tem pelo menos uma linha `decidida`** — feito no §4, e o
   aceite é o `painel.html` mostrar as três esmaecidas, não somem.
5. **Nenhum item do §5 foi materializado.** Se alguém escrever as dezoito
   sprints, ou "enxugar a prosa do `src/`", ou reabrir o co-op do Modo Nativo
   como achado novo, esta sprint falhou no que ela tinha de mais difícil: dizer
   não.

**A régua final, e é a dela:** *tudo tem que ter uso aqui dentro.* Um achado
desta leva está fechado quando é possível apontar a linha de disco onde ele
mora — ou o parágrafo do §5 que explica por que ele não merece uma.

---

## 9. Referências

* [SPRINT_ORDER.md](SPRINT_ORDER.md) — a fila; as 22 de 24/08 estão todas lá
* [2026-08-23-ONDE-PARAMOS](../2026-08-23-ONDE-PARAMOS-os-defeitos-de-forma-e-a-regencia.md)
  — os quinze defeitos de forma e as três decisões de processo dela
* [ONDA0-Z3-BROADCAST-PROIBIDO-01](2026-08-24-ONDA0-Z3-BROADCAST-PROIBIDO-01-o-pulso-do-jogador-2-na-mao-dos-outros.md)
  — dona da rota de alvo; recebe a T6
* [CONFIGURACOES-FECHA-01](2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md)
  — dona do rodapé da aba; recebe a T5
* [PORTAS-DA-CASA-01](2026-08-24-PORTAS-DA-CASA-01-o-produto-sabe-onde-cada-radio-mora-e-nao-diz.md)
  — recebe a T2
* [ONDA0-Z6-COMUNHAO-COM-O-SPECS-01](2026-08-24-ONDA0-Z6-COMUNHAO-COM-O-SPECS-01-a-medicao-chega-a-tela-por-alguem-lembrar.md)
  — dona do elo medição→CSV→tela; recebe a T12
* [INFRA-DE-EXECUCAO-01](2026-08-24-INFRA-DE-EXECUCAO-01-o-registro-do-que-esta-em-voo.md)
  — a infra que executa as outras; estava fora da fila e entrou no §4
* [decisoes-dela.csv](../../data/decisoes-dela.csv) — o painel dela, agora com
  três decididas
* [LEIA-PRIMEIRO.md](../../data/LEIA-PRIMEIRO.md) — recebe a T9
* [driver-hid-playstation.md](../../protocol/driver-hid-playstation.md) — a nota
  datada dos `~392 Hz`, que precisa descer para `src/` (T11)
* [onde-a-porta-usb-mora.md](../../protocol/onde-a-porta-usb-mora.md) — o órfão
  de entrada do §3.2(f)
