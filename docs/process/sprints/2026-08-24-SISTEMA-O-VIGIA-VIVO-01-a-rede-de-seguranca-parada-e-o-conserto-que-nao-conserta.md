---
sprint: SISTEMA-O-VIGIA-VIVO-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# SISTEMA — O VIGIA VIVO 01: a rede de segurança parada, e o conserto que não conserta

| | |
|---|---|
| **Escrita em** | 23/08/2026, 21h50–22h20. Para executar em 24/08, branch `dev` |
| **Grau** | **MEDIDO** onde há comando ao lado (§2.1 a §2.8, tudo remedido depois dos commits das 21h48). **COMPILAÇÃO** (leitura de código com endereço, sem execução) nas tarefas T-08, T-10, T-11 e T-14. **DESENHO** na coreografia e no custo |
| **Aba** | **Sistema — a 8ª da tira.** A ordem real é `Início · Status · No jogo · Gatilhos · Lightbar · Rumble · Perfis · **Sistema** · Emulação · Navegação · Configurações` (conferida no `main.glade`) |
| **Onda** | **11 de 12** |
| **Depende de** | Z0 (foto), Z1 (a ponte que sabe dizer não), Z5 (uma régua só para quem está na mesa), Z6 (comunhão com o specs), Z7 (o ambiente presumido) — e do **balde de instalação da Onda 12** |
| **Régua de tela** | [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md) · foto de hoje: `docs/usage/assets/readme_sistema.png` (regerada às 21h12, commit `3de95ff`) |

**O que esta sprint fecha:** as quinze tarefas de §5, e com elas as dez sprints
de §7.

**O que ela NÃO faz:**

* **não mapeia Bluetooth** — é trilha dela com o assistente (D2). O que a
  medição de BT bloqueia nesta aba está em §6, e é regra para o executor, não
  conselho;
* **não mexe no `install.sh` além da linha 3504**, nem em `build_deb.sh` além
  do bloco dos scripts. O resto do instalador é a Onda 12;
* **não decide sozinha o que desta aba entra no perfil** (T-14 é dela);
* **não conserta nenhuma outra aba.** O que vaza para Início, Perfis e Emulação
  está em §5.16, como gancho.

**Por que ela é a última das abas.** Esta é a aba que declara *"a máquina está
saudável para jogar"*, e essa frase só é verdadeira depois que o ambiente
presumido (Z7) e o balde de instalação (Onda 12) existirem. E é a **única cuja
superfície inteira está fora do mapa de canais** — medido em §2.6: nenhuma das
308 linhas fala de Steam, Proton, wrapper, camada, serviço ou detector de
janela. Nenhum portão de paridade a alcança, e **qualquer frase dela passa
livre**. É o motivo de T-13 existir.

---

## 1. O defeito, em uma frase

**A aba que existe para dizer "está tudo saudável?" tem a própria rede de
segurança caída desde as 04h11 de hoje, avisa corretamente sobre isso, manda
rodar o conserto — e o conserto não conserta.**

E o botão que ela oferece como conserto **perde metade do trabalho, em silêncio,
em cinco dos seis formatos em que este produto é instalado**.

---

## 2. O que está medido

Tudo abaixo foi **remedido depois dos commits das 21h48** (`f7b54e6`, `3de95ff`,
`fc735c7`), na árvore de trabalho de agora. Régua declarada em cada bloco.

### 2.0 O que caiu entre a primeira medição e esta — e substitui o que estava escrito

A primeira passada nesta aba foi às 18h31/19h15. **Dois achados dela morreram às
21h48**, e a regra da casa manda **substituir**, não empilhar:

| achado de 18h31 | estado agora | régua |
|---|---|---|
| *"`storm_doctor._allowlist_path` ignora `XDG_CONFIG_HOME`; o cartão lê um arquivo e o botão escreve outro"* | **CURADO** em `f7b54e6`. `storm_doctor.py:38-67` delega em `steam_launch_options.steam_input_allowlist_path()`. Com `XDG_CONFIG_HOME=/tmp/…` os dois devolvem **o mesmo caminho** | `XDG_CONFIG_HOME=/tmp/xdgtest .venv/bin/python -c "…"` |
| *"não existe `_montar_aba_sistema`; a foto do README é a aba nos primeiros 200 ms"* | **CURADO** em `3de95ff`. `scripts/gui-captura/retratar_abas.py:1582` monta a aba com estado de bancada, e a foto de 21h12 mostra a saúde, o log e o detector | `grep -n "def _montar_aba" scripts/gui-captura/retratar_abas.py` |

O que sobra dos dois é **mordida**, não conserto: T-15 e o item de foto do
aceite. Nada mais desta sprint depende deles.

### 2.1 O vigia está parado, e o instrumento está certo

```sh
$ systemctl --user show hefesto-steam-input-guard.timer \
    -p ActiveState -p LastTriggerUSec -p NextElapseUSecMonotonic
ActiveState=active
LastTriggerUSec=Sun 2026-08-23 04:11:10 -03
NextElapseUSecMonotonic=infinity          # ← nunca mais dispara

$ systemctl --user show hefesto-steam-input-guard.service \
    -p ActiveState -p ActiveEnterTimestamp
ActiveState=inactive
ActiveEnterTimestamp=                     # ← VAZIO: OnUnitActiveSec não tem de onde contar

$ systemctl --user show hefesto-steam-input-guard.path -p ActiveState
ActiveState=active
```

`ActiveState=active` e `next_elapse=infinity` ao mesmo tempo, **17 horas depois
do último disparo**. O cartão da aba imprime `[WARN] Steam Input: a rede de
segurança consta ligada, mas não tem próximo disparo` — **o instrumento está
certo**, e é a [ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md)
que já tinha medido que quem responde é o `NextElapse*`, não o `ActiveState`.

A metade `.path` (a que reage à gravação do `localconfig.vdf`) segue viva. A
periódica é que morreu.

### 2.2 O botão principal do cartão perde metade em cinco formatos de pacote

Os dois botões de topo do cartão rodam dois scripts de shell
(`daemon_actions.py:961-962` e `:1361`), achados por
`_find_repo_file` (`:822-837`), que procura em três bases: a raiz do checkout,
`/usr/share/hefesto-dualsense4unix` e `/usr/local/share/…`.

```sh
$ for a in disable_steam_input.sh fix_wireplumber_default_source.sh; do
    for f in scripts/build_deb.sh flatpak/io.github.hefesto_team.hefesto_dualsense4unix.yml \
             scripts/build_appimage_gui.sh scripts/build_appimage.sh \
             packaging/arch/PKGBUILD packaging/fedora/*.spec packaging/nix/*.nix; do
      printf '%-34s %-46s %s\n' "$a" "$f" "$(grep -c "$a" "$f")"; done; done
```

| formato | leva os dois scripts? | consequência |
|---|---|---|
| checkout (`install.sh`) | sim (é a própria árvore) | funciona |
| **.deb** (`build_deb.sh:234`) | **sim** — o laço `for _s in doctor.sh bluez_config.sh disable_steam_input.sh fix_wireplumber_default_source.sh dsx_recover.sh` | funciona |
| **Flatpak** (`flatpak/io.github.hefesto_team.hefesto_dualsense4unix.yml`) | **não** — leva `dkms_lib.sh` e os sete `bt_*.sh`, e **nenhum destes dois** | perde a perna do script |
| **AppImage** (as duas receitas) | **não** — `scripts/` não é copiado em nenhuma das duas | perde a perna do script |
| **Arch / Fedora / Nix** | **não** — `grep` devolve zero nos três | perde a perna do script |

E há um segundo furo, independente do primeiro: **`_find_repo_file` não conhece
`/app/share`**, que é onde o Flatpak instala. Mesmo que o manifesto passasse a
levar os dois scripts, a janela não os acharia.

```sh
$ grep -rn "/app/share" src/hefesto_dualsense4unix/app/actions/daemon_actions.py
                                                    # ← vazio
```

**E nenhum portão vê isso**, porque o portão declara por escrito que não olha:
`scripts/check_packaging_parity.sh:8` — *"(`scripts/` é ignorado de propósito:
`doctor.sh` cita o nome errado para DETECTÁ-lo.)"*. A exceção foi escrita para
**um** nome de unit e virou cegueira para o diretório inteiro.

**Correção do que o plano trazia:** o plano dizia *"os dois scripts que não
viajam em pacote nenhum"* e *"o botão principal nunca funcionou fora do checkout
dela"*. **É falso para o `.deb`**, que leva os dois desde sempre. O correto é o
que está na tabela: um formato leva, cinco não.

### 2.3 O que a tela diz quando o script falta — e por que a frase não serve

`format_steam_ready_result` (`daemon_actions.py:407`) **é honesta** e trata o
caso em dois ramos:

* `:429-433` — *"Esta instalação está incompleta (faltam as peças que fazem o
  ajuste) — rode `./install.sh` para atualizar o Hefesto."*
* `:449-452` — *"Controle: não encontrei o script desta correção nesta
  instalação (rode `./install.sh`)."*

O defeito não é mentira; é **conselho impossível**. Quem instalou por Flatpak,
AppImage, Arch, Fedora ou Nix **não tem `./install.sh`** — não há checkout na
máquina dele. A janela manda o usuário a um lugar que não existe, e é a única
instrução que ela dá.

### 2.4 "Travar Proton validado" anuncia o que acabou de recusar

```sh
$ .venv/bin/python -c "…format_proton_lock_result({'locked':0,'skipped':0,'errors':0,'tool':'GE-Proton10-34'})"
Nada a mudar — os jogos já estão no Proton validado (GE-Proton10-34)…
```

E `lock_games_to_pinned_proton` com `status='recusado'` produz **exatamente esse
dicionário**, porque `proton_pin.py:901` é literalmente
`"errors": 1 if status == "erro" else 0`. Recusa não é erro para a contagem, e o
ramo `elif errors == 0` de `daemon_actions.py:751-756` comemora. É a família
**F1** na forma mais pura: a verdade já está calculada e a ponte a joga fora.

### 2.5 Uma frase que ela derrubou em 09/08 está sendo pintada agora

```sh
$ grep -rn "entregue pela Steam" src/
storm_doctor.py:244            ← ISTO É PINTADO NA TELA
emulation_actions.py:1538      ← docstring
gui/main.glade:2860            ← o comentário que diz que a frase MORREU
```

A [ESCONDER-EM-VEZ-DE-SAIR-01](2026-08-09-ESCONDER-EM-VEZ-DE-SAIR-01-o-duplicado-cura-pelo-outro-lado.md)
matou o enquadramento: a marca **esconde o controle físico do jogo**; ela não
entrega o controle à Steam. O glade recebeu o recado; o código que pinta, não.
Regra da casa: fato errado sai de **todos** os lugares.

E no mesmo botão, o tooltip (`main.glade:2872`) promete três coisas:

> *"nele os controles físicos ficam escondidos, **o jogo deixa de mostrá-los
> dobrados** e passa a ver só os controles do Hefesto — a sua cor, os seus
> gatilhos, a sua vibração e **os seus jogadores continuam valendo**"*

A primeira foi **medida como falsa hoje**: a
[ESCONDE-SÓ-O-HIDRAW-01](2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md)
mostrou que o `hide` fecha o `hidraw` e deixa `evdev` e `joydev` abertos. A
terceira é a **frase mais forte da aba e a menos sustentada** — a inversão de
09/08 foi medida **no cabo** (§6.2).

### 2.6 A superfície inteira desta aba está fora do mapa de canais

```sh
$ .venv/bin/python - <<'PY'
import csv, collections
rows = list(csv.DictReader(open('docs/data/mapa-controles.csv')))
print('linhas', len(rows), 'colunas', len(rows[0]))
print(collections.Counter(r['familia'] for r in rows).most_common())
alvo = [r['id'] for r in rows if any(k in r['id'].lower() for k in
        ('steam','proton','wrapper','camada','servico','janela','window','daemon'))]
print('ids da superfície da aba Sistema:', alvo)
PY
linhas 308 colunas 49
[('plataforma', 76), ('luz', 48), ('audio', 34), ('combinacao', 27), ('movimento', 24),
 ('vibracao', 21), ('gatilho', 18), ('entrada', 17), ('identidade', 16), ('energia', 15),
 ('toque', 12)]
ids da superfície da aba Sistema: []
```

**Zero.** Onze famílias, 308 linhas, nenhuma sobre o que esta aba faz. O
`check_paridade_transporte.py` não tem o que conferir aqui — e por isso as
promessas de §2.5 e §6 passaram sem resistência.

E a divergência que já está no mapa, sobre o **mesmo wrapper** que os botões
desta aba instalam: `plataforma.mapeamento_posicao@dualsense` diz
`nao-tem/não/não` e `@sn30` diz `tem/sim/sim`. Um dos dois lados está errado e
**ninguém pode saber qual** sem medir.

### 2.7 Código sem chamador, dentro desta aba (família F2)

```sh
$ grep -rn "_query_gamepad_state" src/ tests/
daemon_actions.py:1040:    def _query_gamepad_state(self) -> tuple[str, str]:   # a definição, e só

$ grep -rn "prontuario" src/ scripts/ | grep -v integrations/prontuario_dos_jogos.py
schema.py:668 · ponte_escada.py:123 · steam_input_ponte.py:5 · hotkey.py:458
                                                    # as quatro são comentário

$ grep -rn "_refresh_daemon_tab_on_show" tests/
                                                    # ← vazio
```

* `_query_gamepad_state`: 22 linhas, uma chamada IPC, **zero chamadores**;
* `prontuario_dos_jogos.py`: **1037 linhas, zero chamadores de produção** — e o
  portão de órfãos da casa **perdoa** o módulo numa lista de exceções
  (`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1231`);
* o gancho que atualiza esta aba ao entrar nela (`app.py:1041` →
  `daemon_actions.py:1912`) **não tem um teste**. Arrancar a entrada do mapa não
  deixa nada vermelho, e a aba passaria a mostrar a foto do bootstrap para
  sempre.

### 2.8 A troca de perfil por jogo está cega agora — e esta aba é o único lugar que conta

```sh
$ .venv/bin/python -c "…daemon_state_full()…"
window_detect_backend = xlib
window_detect_seeing  = False
window_detect_reason  = sem_conexao_x
window_detect_healthy = True      # ← o trinco diz que está bem
```

```sh
$ .venv/bin/python -c "…descrever_deteccao_de_janela(daemon_state_full())…"
'<b>Trocar de perfil ao abrir o jogo:</b> <span foreground="#ffb86c">sem ver a
 janela agora</span> — o Hefesto não conseguiu falar com o XWayland. Enquanto
 está assim, o perfil não troca sozinho.'
```

**Correção do que o diagnóstico holístico trazia (F8).** Ele diz *"a troca
automática de perfil por jogo está cega e o produto responde 'estou bem'"*. A
primeira metade é verdade e está acontecendo. A segunda **não vale para esta
aba**: a linha desta tela é a única do produto que **confessa a cegueira**, com
a palavra certa e em laranja. Quem responde "estou bem" é o campo
`window_detect_healthy` do `state_store`, cujo contrato é *"≥ 1 leitura útil
desde o boot"* (`daemon/state_store.py:401` e `:628`, que a
[JANELA-CEGA-01](2026-07-28-JANELA-CEGA-01-o-detector-que-nunca-adoece.md) já
documenta). **Não conserte esta linha: ela é o modelo para as outras.**

---

## 3. O que é hipótese, e é ela que manda na T-01

**`bash install.sh` não conserta o vigia.** O sintoma é fato medido (§2.1); a
causa proposta é que `install.sh:3504` usa

```sh
systemctl --user enable --now hefesto-steam-input-guard.path hefesto-steam-input-guard.timer
```

e `enable --now` é **no-op numa unidade já `active`** — não re-arma cronograma
nenhum. O próprio instalador já sabe disso noutro lugar (`install.sh:2613`:
*"`enable --now` NÃO tira uma unit do estado `failed`"*).

**Ninguém rodou `bash install.sh`** — mudaria a máquina dela, e planejador não
conserta. **A T-01 começa transformando esta hipótese em medição**, e se ela
morrer, a T-01 vira só a mensagem.

---

## 4. O que continua NÃO VERIFICADO

Isto é informação, não lacuna. Repasse assim.

1. **Se `bash install.sh` conserta o vigia** (§3).
2. **Nenhum teste foi mutado.** Onde se lê *"arrancar X não reprova"*, a prova é
   ausência de referência em `tests/` por `grep`, não execução.
3. **A janela real não foi aberta.** Toda leitura de tela veio da foto de 21h12
   e do `main.glade`, a 1920x1080.
4. **Nada aqui foi medido com N=4, nem com N=1.** A bancada mudou três vezes
   hoje: 2 DualSense no rádio às 18h15; **zero** às 19h29 e 20h45; às 21h57,
   `controllers` traz **uma** entrada com `connected:false, transport:null` e o
   `/sys/class/hidraw` tem cinco nós, nenhum DualSense. **Todo número desta
   sprint sobre 2 ou 4 controles é leitura de código.**
5. **A divergência das três réguas da mesa (F6) não reproduziu às 21h57:** o
   topo do `state_full` devolveu `connected:None`, não `connected:true, bt,
   75%`. O daemon foi reiniciado às 21h48; o estado velho pode ter sido limpo.
   **Quem executar a Z5 remede antes de escrever a cura** — a medição de 20h45
   continua valendo como fato daquela hora, não como estado de agora.
6. **Que o `_steam_gate` do Proton recuse pelo ramo `jogo_da_steam_aberto` com o
   cliente Steam fechado.** A mentira do toast (§2.4) está provada; a
   probabilidade do caminho que chega nela é argumento.
7. **O cenário "8BitDo no cabo derruba o cartão de áudio" NÃO reproduz.** As
   funções puras contam diferente, mas `describe_controllers`
   (`core/backend_pydualsense.py:4661`) só descreve `self._handles`, que são
   DualSense — o caminho vivo não alimenta o falso alarme. Fica como fragilidade
   de contrato, **não** como defeito. (Quase virou defeito confirmado: é a
   armadilha do agente que afirma com confiança o que não existe.)

---

## 5. A coreografia dos agentes — **8 agentes**

Três rodadas. **A é o único que abre `install.sh`, `build_deb.sh`, `flatpak/` e
`packaging/`. F é o único que abre `profiles/`. H é o único que abre
`scripts/gui-captura/`.** Ninguém mais toca esses três territórios.

```
  RODADA 1 (paralelo, 3) — o que está QUEBRADO agora
  ┌────────────────────┬────────────────────┬────────────────────┐
  │ A · pacote e vigia │ B · proton         │ C · botões e fita  │
  │ T-01 T-02 T-03     │ T-04               │ T-05 T-06          │
  └────────────────────┴────────────────────┴────────────────────┘
        ↓ A devolve o veredito do `enable --now`; B devolve o vocabulário de recusa
  RODADA 2 (paralelo, 3) — o que MENTE na tela
  ┌────────────────────┬────────────────────┬────────────────────┐
  │ D · frases         │ E · painel         │ F · perfil         │
  │ T-07               │ T-08               │ T-14 T-10 T-11     │
  └────────────────────┴────────────────────┴────────────────────┘
        ↓ F devolve a PERGUNTA para ela ANTES de escrever qualquer linha
  RODADA 3 (paralelo, 2) — a régua, o código morto e a mordida
  ┌────────────────────┬────────────────────┐
  │ G · specs          │ H · mordidas       │
  │ T-13 T-12 T-15     │ T-09 + a foto      │
  └────────────────────┴────────────────────┘
```

| # | agente | tarefas | o que devolve |
|---|---|---|---|
| **A** | **o pacote e o vigia** | T-01, T-02, T-03 | O **veredito medido** de §3 (roteiro na T-01); o diff de `install.sh:3504`; os dois scripts nos cinco formatos que não os levam; `/app/share` no `_find_repo_file`; e a prova do ciclo `uninstall→install` que a [CURA-QUE-FERE-01](2026-08-04-CURA-QUE-FERE-01-toda-cura-de-systemd-tem-de-provar-o-ciclo-inteiro.md) exige |
| **B** | **o botão que anuncia o que recusou** | T-04 | O ramo de recusa e a frase em português; e o **vocabulário de recusa** que a Z1 padronizou, para A, D e E copiarem em vez de inventar |
| **C** | **um dono para ligar/desligar, e a fita que cala** | T-05, T-06 | A matriz de sensibilidade por estado + a entrada de `daemon_box` no conjunto de abas sem alvo. **Não** decide as outras cinco abas da fita (D-2, §9) |
| **D** | **a frase que ela derrubou** | T-07 | Duas linhas de `storm_doctor.py` e o tooltip reescritos com o léxico da caixinha de Perfis, + a regra no `validar-palavra-de-tela.py`. **Traz duas redações para ela** |
| **E** | **o painel que a frase promete** | T-08 | Um helper `_detalhe_tecnico(texto)` e os workers que passam a chamá-lo; e a contagem de quantas das 14 menções viram verdade |
| **F** | **o que desta aba é do jogo** | T-14, T-10, T-11 | Primeiro a **pergunta para ela** (o censo "perfil ou máquina" dos sete gestos); só depois o cartão de divergência do prontuário e o rastro do clique |
| **G** | **o mapa não conhece esta aba** | T-13, T-12, T-15 | A proposta de família nova do CSV (com a divergência do `mapeamento_posicao` **posta na mesa, não resolvida**), o apagamento do código morto e o portão do caminho da allowlist |
| **H** | **as mordidas que faltam** | T-09 + o item de foto do aceite | O teste do gancho de refresh e a conferência da foto pós-Z0 |

**Regra que vale para os oito:** cada um roda a mordida da sua tarefa **com a
cura arrancada primeiro**, cola a saída vermelha no relato, devolve a cura e cola
a verde. Relato sem o par vermelho/verde não fecha tarefa.

---

## 6. As tarefas

Carimbo de tela (D3): **[COSMÉTICA]** = pré-aprovada, foto depois em lote ·
**[OLHO DELA]** = precisa do olho dela **antes** · **[SEM TELA]**.

### T-01 — o vigia parado, e a linha do instalador que não o levanta

* **Onde:** `install.sh:3504`; `assets/hefesto-steam-input-guard.timer`; a
  mensagem em `app/actions/daemon_actions.py:594-597`.
* **Antes de tudo, a medição que falta:** numa **cópia** do ambiente de unidades
  (`XDG_RUNTIME_DIR`/`systemd --user` de teste, **nunca** a sessão dela), plantar
  um timer no estado de §2.1 e rodar só o bloco `install.sh:3497-3506`. Anotar o
  `NextElapseUSecMonotonic` antes e depois. **Se `enable --now` re-armar, a
  hipótese de §3 morre e esta tarefa vira só a mensagem.**
* **Conserto:** trocar `enable --now` por `enable` seguido de `restart` nas duas
  unidades — `restart` re-arma o cronograma, `enable` não. A mensagem do achado
  passa a mandar o gesto que funciona.
* **A mordida:** teste que planta uma unidade com
  `NextElapseUSecMonotonic=infinity`, roda o passo do instalador e exige que o
  próximo elapse **deixe de ser infinito**. Arranque o `restart` → reprova.
  Somada à mordida da CURA-QUE-FERE-01: ciclo `uninstall→install` inteiro.
* **Custo:** ~6 linhas no `install.sh` + 1 na mensagem; **40 min**.
* **[COSMÉTICA]** — a mensagem muda de gesto, não de enquadramento.

### T-02 — os dois scripts não viajam em cinco dos seis formatos

* **Onde:** `flatpak/io.github.hefesto_team.hefesto_dualsense4unix.yml`, `scripts/build_appimage.sh`,
  `scripts/build_appimage_gui.sh`, `packaging/arch/PKGBUILD`,
  `packaging/fedora/*.spec`, `packaging/nix/package.nix`;
  `app/actions/daemon_actions.py:822-837` (`_find_repo_file`);
  `scripts/check_packaging_parity.sh:8`.
* **Conserto, em três partes:** (a) os cinco formatos passam a instalar
  `disable_steam_input.sh` e `fix_wireplumber_default_source.sh` no mesmo lugar
  que o `.deb` já usa; (b) `_find_repo_file` ganha `/app/share/hefesto-dualsense4unix`
  como quarta base; (c) o portão de paridade deixa de ignorar `scripts/` em
  bloco — a exceção volta a valer só para o nome de unit que a criou.
* **A mordida:** o portão passa a enumerar os scripts que a GUI busca por
  `_find_repo_file` e exigir que **cada formato** os leve. Tire um do
  `build_deb.sh` → reprova. Hoje, com cinco formatos sem nenhum dos dois, o
  portão sai verde.
* **Custo:** ~12 linhas de receita + 1 linha na GUI + ~30 no portão; **2h**.
* **[SEM TELA]**

### T-03 — a janela manda rodar um `./install.sh` que aquele usuário não tem

* **Onde:** `app/actions/daemon_actions.py:429-433` e `:449-452`
  (`format_steam_ready_result`); o irmão em `format_fix_safe_result`.
* **Conserto:** a frase deixa de citar `./install.sh` fixo e passa a dizer o que
  serve para **aquela** instalação. O produto já sabe distinguir (o caminho de
  onde o módulo carregou, e a base que o `_find_repo_file` achou ou não).
  Mínimo aceitável: *"Esta instalação não trouxe as peças deste ajuste —
  atualize o Hefesto pelo mesmo caminho por onde você o instalou."*
* **Depende de:** T-02. Com T-02 fechada, esta frase deve ficar **rara**, não
  frequente — e é justamente por isso que ela precisa estar certa.
* **A mordida:** teste que chama `format_steam_ready_result(script_ok=False)` e
  exige que a frase **não** contenha `./install.sh`. Reponha → reprova.
* **Custo:** ~8 linhas + 2 testes; **40 min**.
* **[OLHO DELA]** — texto reescrito na tela.

### T-04 — "Travar Proton validado" diz "já estão travados" depois de recusar

* **Onde:** `integrations/proton_pin.py:901`;
  `app/actions/daemon_actions.py:751-756`; `proton_pin.py:746-752`
  (`_steam_gate`).
* **Conserto:** `lock_games_to_pinned_proton` passa o `status` para fora;
  `format_proton_lock_result` ganha um ramo de recusa que diz o motivo em
  português (*"havia um jogo da Steam aberto — feche e clique de novo"*). O
  `_steam_gate` recusa por **dois** motivos e o worker da GUI só pré-checa
  `steam_running()`: um jogo Proton que sobrevive ao fechamento do cliente passa
  o portão da janela e cai na recusa muda.
* **Herança:** o contrato de resposta é da **Z1**. Se a Z1 já entregou o
  vocabulário, esta tarefa **usa** o dela em vez de inventar o seu.
* **A mordida:** teste que alimenta `status='recusado'` e exige que a frase
  **não** contenha "já estão travados". Arranque o ramo → reprova.
* **Custo:** ~15 linhas + 2 testes; **45 min**.
* **[OLHO DELA]** — texto novo na tela.

### T-05 — a fita "Ajustes vão para: [Controle 2]" fica viva, e nada aqui obedece

* **Onde:** `app/app.py:1132-1134` (`inativar(nome == ABA_CONFIG)`); a
  implementação em `app/actions/config/mixin.py`.
* **Conserto:** trocar a comparação por **pertinência a um conjunto** de ids de
  aba onde o alvo não vale, e pôr `daemon_box` nele. A decisão dela (23/08) já
  está registrada: **esmaecer, sem rótulo**, para o cabeçalho não pular de
  altura.
* **Escopo travado:** só a Sistema. A
  [MESA-CHEIA-10](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md)
  já classificou esta aba (*"Sistema | daemon_actions.py | NÃO"*); as outras
  cinco esperam a **D-2** dela.
* **A mordida:** teste que troca para `daemon_box` e exige `set_alvo_inativo(True)`.
  Tire o id do conjunto → reprova.
* **Custo:** ~3 linhas + 1 teste; **25 min**.
* **[COSMÉTICA]** — a decisão de forma já é dela.

### T-06 — "Ligar" e "Desligar o Hefesto" nunca ficam cinzas

* **Onde:** `app/actions/daemon_actions.py:1678` (`_apply_daemon_view`), `:1899`
  (`on_daemon_start`), `:1905` (`on_daemon_stop`);
  `app/actions/home_actions.py:2533` e `:2545`.
* **A medição:** `grep -n "set_sensitive" daemon_actions.py` devolve **duas**
  linhas, `:1885` e `:1891`, e as duas são do botão de reiniciar.
  `daemon_start_button` e `daemon_stop_button` **nunca** recebem
  `set_sensitive`. E `on_daemon_start` faz `_user_stopped_daemon = False`
  (`:1902`), mas `on_daemon_stop` **não arma** o flag — só a Início arma
  (`home_actions.py:2533`). Pior: quando o desligamento da Início falha, ela é
  mandada *"tente pela aba Sistema"* — **para o caminho mais fraco dos dois**.
* **Conserto:** (a) `_apply_daemon_view` desabilita "Ligar" quando online e
  "Desligar" quando offline; (b) `on_daemon_stop` arma `_user_stopped_daemon` no
  sucesso, como a Início faz. **Não** mexer na Início: a diferença de
  confirmação é assunto da onda dela.
* **A mordida:** `tests/unit/test_daemon_status_matrix.py` ganha a exigência de
  sensibilidade por estado. Arranque o `set_sensitive` → reprova.
* **Custo:** ~10 linhas + 2 testes; **40 min**.
* **[COSMÉTICA]** — cinza de estado já decidido.

### T-07 — a frase que ela derrubou em 09/08, e o tooltip que promete demais

* **Onde:** `integrations/storm_doctor.py:244`;
  `app/actions/emulation_actions.py:1538` (docstring); `gui/main.glade:2872`
  (tooltip do `btn_steam_game_broken`).
* **Conserto:** reescrever com o vocabulário que a caixinha da aba Perfis já
  usa. **E cortar a promessa que hoje é falsa:** *"o jogo deixa de mostrá-los
  dobrados"* foi medida como falsa em 23/08 — o `hide` fecha o `hidraw` e deixa
  `evdev`/`joydev` abertos. A redação nova **não pode prometer mais do que a
  ESCONDE-SÓ-O-HIDRAW-01 sustenta**. Traga **duas** redações para ela.
* **Cuidado:** *"os seus jogadores continuam valendo"* está bloqueada por BT
  (§7.2) — ou qualifica o transporte, ou cala.
* **A mordida:** regra em `scripts/validar-palavra-de-tela.py` reprovando
  "entregue pela Steam" em `src/`. Reponha a frase → reprova.
* **Custo:** ~4 linhas + 1 regra; **30 min**.
* **[OLHO DELA]**

### T-08 — "veja os 'Detalhes técnicos'" manda para um painel que nunca terá o erro

* **Onde:** `app/actions/daemon_actions.py:2038-2047` (`on_daemon_view_logs`),
  `:2322-2341` (`_journalctl_tail`), `:2288` (`_set_daemon_text`);
  `utils/logging_config.py:62`.
* **A conta:** `grep -c "Detalhes técnicos" daemon_actions.py` → **14**. **Três**
  têm o detalhe naquele painel (`:1985`, `:2001`, `:2232` — as de `systemctl`).
  As outras onze nascem no processo da **janela**, cujo log vai para o `stderr`
  dela e **não** entra na unidade do daemon. O painel mostra `systemctl status`
  do daemon; o erro nasce noutro processo.
* **Conserto:** um helper `_detalhe_tecnico(texto)` que escreve a saída crua no
  `daemon_status_text` **antes** do toast; os workers passam a chamá-lo. A
  alternativa (parar de citar o painel) é pior: o painel já promete pelo nome.
* **A mordida:** teste que força falha do Proton e exige que o buffer do
  `TextView` contenha o motivo. Hoje fica com o `systemctl status` → reprova.
* **Custo:** ~25 linhas + 3 testes; **1h30**.
* **[OLHO DELA]** — muda o que se vê ao abrir o painel.

### T-09 — nenhum teste garante que esta aba se atualiza ao ser aberta

* **Onde:** `app/app.py:1041` (`"daemon_box": ("_refresh_daemon_tab_on_show",)`);
  `app/actions/daemon_actions.py:1912`; `tests/unit/test_notebook_switch_page.py`.
* **A medição:** `grep -rn '_refresh_daemon_tab_on_show' tests/` → **zero**. O
  arquivo cobre a aba unificada, a Perfis e a **ausência** de refresher — nunca
  a Sistema.
* **Conserto:** um teste no molde do
  `test_entrar_na_aba_perfis_rele_a_caixinha_do_steam_input`.
* **A mordida:** arranque a entrada `daemon_box` do mapa → tem de ficar
  vermelho. Hoje **nada** fica, e a aba mostraria a foto do bootstrap para
  sempre.
* **Custo:** ~20 linhas de teste; **20 min**.
* **[SEM TELA]**

### T-10 — o prontuário dos jogos: 1037 linhas, zero chamadores

* **Onde:** `integrations/prontuario_dos_jogos.py:448` (o cálculo da
  divergência), `:1001` (`main`);
  `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1231` (a exceção que
  perdoa o órfão).
* **Conserto:** não é "ligar em qualquer lugar". O lugar é o cartão **"Saúde do
  sistema" desta aba**, no molde do `medir_guarda_do_steam_input`: **uma linha
  só quando há divergência, calada quando está alinhado** — a regra que ela deu
  em 22/08 para o vigia. E aí a exceção do portão sai.
* **A mordida:** teste que planta um perfil com `ponte.steam_input=True` e um
  appid **fora** da allowlist, e exige a linha de WARN. Arranque a chamada →
  reprova, **e o portão de órfãos volta a acusar** (é a mordida dupla: a cura e
  a régua que a mantinha invisível).
* **Custo:** ~40 linhas + 3 testes; **2h**.
* **[OLHO DELA]** — linha nova no cartão.

### T-11 — "Este jogo não funciona" grava a marca e não deixa rastro no perfil

* **Onde:** `app/actions/daemon_actions.py:1451` (`on_steam_game_broken`),
  `:1504` (`_recarregar_apos_allowlist`); `profiles/manager.py`
  (`confirmar_ponte`); `profiles/schema.py:697` (`PonteConfirmada.steam_input`).
* **O cuidado que vale mais que o código:** o clique diz *"não funcionou"*.
  Carimbar uma ponte **confirmada** aqui seria mentira. O que cabe é o oposto —
  registrar a **tentativa descartada**, e `ponte_escada`/`ponte_tentativa` já
  têm vocabulário para isso. **Pergunta para ela antes de escrever.**
* **Nota de estado:** com o daemon **offline** a marca fica gravada e inerte até
  o próximo boot, e a tela **não** diferencia os dois casos. Entra no mesmo
  desenho.
* **A mordida:** teste que exige que o clique deixe **rastro no perfil daquele
  appid**, qualquer que seja o campo escolhido.
* **Custo:** decisão dela + ~20 linhas; **1h**.
* **[OLHO DELA]**

### T-12 — `_query_gamepad_state`: 22 linhas, zero chamadores

* **Onde:** `app/actions/daemon_actions.py:1040-1061`.
* **A medição:** `grep -rn '_query_gamepad_state' src/ tests/` devolve **uma**
  linha: a própria definição. O consumidor plausível, `on_storm_copy_launch`
  (`:1062`), chama `self.compose_launch("", "")` — constantes, não o probe.
* **Conserto:** **apagar.** Não é decisão medida: é o resto de uma época em que
  a opção de inicialização variava por máscara/backend. Hoje é constante.
* **A mordida:** o próprio `grep`, virado portão. Se voltar a ter chamador,
  volta o código.
* **Custo:** 22 linhas a menos; **5 min**.
* **[SEM TELA]**

### T-13 — o mapa de canais não tem uma linha para nada que esta aba faz

* **Onde:** `docs/data/mapa-controles.csv` (308 linhas, zero desta aba);
  `scripts/check_paridade_transporte.py`.
* **Não é "criar 7 linhas".** É decidir se o mapa ganha uma **família nova**
  (`hospedeiro`) ou se a aba Sistema declara noutro lugar — e é a mesma pergunta
  que a **Z6** responde para as onze abas. Esta tarefa entrega a **proposta** da
  família e as linhas da Sistema; **quem aprova o formato é a Z6**.
* **A divergência que já está lá, e é dela:**
  `plataforma.mapeamento_posicao@dualsense` = `nao-tem/não/não` contra `@sn30` =
  `tem/sim/sim`, sobre o **mesmo wrapper** que os botões desta aba instalam.
  Ponha na mesa; **não resolva por conta própria.**
* **O que o mapa sabe e a tela não oferece:**
  `plataforma.diagnostico_morte_radio` (`existe=tem`, só rádio). Quem tem
  controle morrendo no rádio abre esta aba, lê seis linhas sobre Steam e áudio
  USB, e não acha nada sobre o problema dele.
* **A mordida:** o portão da Z6 reprovando promessa de tela sem linha no mapa.
  **Sem ele, esta tarefa é documentação** — e é exatamente por isso que a aba
  chegou até aqui com as promessas de §2.5 intactas.
* **Custo:** decisão + ~7 linhas de CSV; **1h** se ela escolher a família nova.
* **[SEM TELA]**

### T-14 — nada que esta aba oferece entra no perfil do jogo

* **Onde:** `app/actions/daemon_actions.py` (a aba inteira);
  `profiles/schema.py:942` (`class Profile`).
* **A medição:** `schema.py` não tem **nenhum** campo alimentado por esta aba. O
  único ponto de contato é `PonteConfirmada.steam_input` (`schema.py:697`), que
  é **carimbo** e não escolha; quem o escreve é `profiles/manager.confirmar_ponte`,
  e o único chamador real é `daemon/launch_env.py`.
* **Isto é decisão dela antes de ser código.** Os sete gestos vivem em quatro
  gavetas: `steam_input_apps.txt` (global), `config.vdf` da Steam + json local,
  systemd, e o prefixo Wine. **O que é do JOGO** (marca do Steam Input, Proton
  por jogo, camadas por prefixo) tem lugar no perfil; **o que é da MÁQUINA**
  (autostart, WirePlumber, quirk de áudio) não tem. É a **D-A** do plano: se o
  lado "do jogo" entrar, esta aba vira parte da receita do jogo.
* **A mordida:** portão que **enumera** os gestos da aba e exige que cada um
  declare `perfil` ou `máquina`. Acrescente um gesto sem declarar → reprova.
* **Custo:** 30 min de conversa com ela; o código depende do que ela decidir.
* **[OLHO DELA]**

### T-15 — o caminho da allowlist ganha o portão que faltava

* **Onde:** `integrations/storm_doctor.py:38-67`;
  `integrations/steam_launch_options.py:1068`.
* **A cura já entrou** às 21h48 (§2.0): o leitor delega no escritor. O que
  **não** entrou foi a régua que impede a divergência de voltar — e ela já
  voltou uma vez.
* **Conserto:** teste com `monkeypatch` de `XDG_CONFIG_HOME` exigindo que
  `storm_doctor._allowlist_path()` e `steam_input_allowlist_path()` sejam
  **iguais**; e um portão que enumere os cinco leitores da allowlist e exija que
  todos passem pela mesma função.
* **A mordida:** reponha o `.config` cravado no `_allowlist_path` → reprova.
  Hoje, sem o teste, a regressão passa.
* **Preservar:** o docstring do CANARIO-FS-01 (a razão de a resolução ser por
  chamada, e não constante de módulo) **continua valendo** — não apague.
* **Custo:** ~25 linhas de teste; **30 min**.
* **[SEM TELA]**

---

## 7. O que o Bluetooth bloqueia

Trilha **dela** com o assistente, na mesa do specs (D2). Esta sprint não planeja
o mapeamento. O que ela bloqueia, e que **não pode ser afirmado na tela** até a
medição existir:

1. **O wrapper esconde o hidraw físico no rádio como esconde no cabo?** O
   `hidraw_broker` aceita bus `0005` (BT) além de `0003` (USB), mas ninguém
   mediu com o jogo aberto e o controle no rádio. Até lá, "Deixar tudo pronto" e
   "Aplicar aos jogos da Steam" **não podem prometer** *"o jogo deixa de
   mostrá-los dobrados"* sem qualificar o transporte — e a
   ESCONDE-SÓ-O-HIDRAW-01 já mostrou que **nem no cabo** a promessa se sustenta
   inteira.
2. **Com quatro no rádio, "Este jogo não funciona" preserva os quatro
   jogadores?** A inversão de 09/08 foi medida **no cabo**. O tooltip
   (`main.glade:2872`) promete *"os seus jogadores continuam valendo"*: é a
   **frase mais forte da aba e a menos sustentada**. Sem medição no rádio, ela
   qualifica o transporte ou sai.
3. **`plataforma.mapeamento_posicao@dualsense` diz `nao-tem/não/não`.** Se o
   lado do DualSense for verdade, o wrapper que esta aba instala **não entrega
   ordem de jogador por BT** — e nenhuma frase desta aba pode prometer co-op no
   rádio.
4. **O quirk anti-storm (`054c:0ce6`) e a contagem de placas ALSA são do áudio
   USB.** No rádio o mic e o fone não passam por placa ALSA, então o cartão
   acusa **duas ausências irrelevantes** para quem só joga no rádio. Falta a
   medição que diga se essas linhas devem **calar** quando não há ninguém no
   cabo.
5. **`native_bt_fragil` em número.** Antes de o cartão ganhar uma linha de
   rádio, é preciso saber o que "frágil" significa: quantas desconexões, sob
   qual adaptador, em quanto tempo.
6. **O vigia acorda na hora certa por BT?** Ele dispara ao ver a Steam gravar o
   `localconfig.vdf`. Se o ciclo de vida do jogo por rádio for diferente
   (desconexão no meio da partida), a rede de segurança pode estar acordando na
   hora errada.

**Regra para o executor:** onde a medição não existe, a frase de tela qualifica
o transporte ou cala. **Não invente "funciona nos dois".**

---

## 8. As sprints absorvidas

| sprint | o que contribui | morre ao fim desta? |
|---|---|---|
| [STEAM-INPUT-01](2026-07-26-STEAM-INPUT-01-ela-nunca-mais-precisa-decidir.md) | a tese *"ela nunca mais precisa decidir"* — que é exatamente o que o vigia parado quebra | **Sim**, com T-01 |
| [DUPLO-REGISTRO-01](2026-07-26-DUPLO-REGISTRO-01-o-steam-input-tem-dois-cadastros.md) | os dois cadastros do Steam Input; é a raiz da divergência de caminho da allowlist | **Sim**, com T-15 |
| [STEAM-QUE-DECIDE-01](2026-08-05-STEAM-QUE-DECIDE-01-ela-nao-tem-como-saber-quando-ligar.md) | *"ela não tem como saber quando ligar"* — vira a linha calada do cartão da T-10 | **Sim**, com T-10 |
| [ESCONDER-EM-VEZ-DE-SAIR-01](2026-08-09-ESCONDER-EM-VEZ-DE-SAIR-01-o-duplicado-cura-pelo-outro-lado.md) | o enquadramento certo da marca; é o que a T-07 devolve à tela | **Sim**, com T-07 |
| [O-WRAPPER-QUE-SUMIU-01](2026-08-16-O-WRAPPER-QUE-SUMIU-01-uma-variavel-nova-apaga-a-ponte-em-silencio.md) | o apagamento silencioso da ponte; alimenta a nota de estado da T-11 | **Não** — a metade da variável de ambiente é da Onda 12 |
| [SENTINELA-WRAPPER-01](2026-08-16-SENTINELA-WRAPPER-01-a-steam-guarda-uma-linha-por-jogo-e-comeu-a-nossa.md) | a Steam come a linha por jogo — é o **motivo de o vigia existir** | **Não**, enquanto a T-01 não medir o re-arme |
| [WRAPPER-EM-TODOS-01](2026-08-03-WRAPPER-EM-TODOS-01-a-invariante-duplicado-melhor-que-zero-com-quatro.md) | a invariante *"duplicado é melhor que zero com quatro"* — a régua de §7.2 | **Não.** É invariante, e a medição no rádio falta |
| [JANELA-CEGA-01](2026-07-28-JANELA-CEGA-01-o-detector-que-nunca-adoece.md) | o detector que nunca adoece; §2.8 mostra que a **linha desta aba já acertou** e o campo `healthy` é que mente | **Não** — sobrevive como gancho, e vira modelo |
| [PS-TOQUE-CURTO-01](2026-08-03-PS-TOQUE-CURTO-01-o-gesto-de-religar-o-controle-abre-a-steam.md) | o gesto de religar abre a Steam — **PROPOSTA, zero linha tocada**, e a causa está provada. É gesto que nasce nesta aba (Steam) e adoece no `hotkey` | **Não.** Entra na fila desta onda como o achado que **não** foi planejado aqui: precisa de tarefa própria (§10) |
| [TRES-CONTROLES-01](2026-08-10-TRES-CONTROLES-01-o-espelho-do-espelho-no-pragmata.md) | **CONCLUÍDA em código** (`PAR_STEAM_INPUT_VIRTUAL` em `daemon/launch_env.py:140`), aguardando só ela contar os controles no Pragmata | **Não** — o que falta é a contagem dela, não código |

**Também tocadas, e que NÃO morrem aqui:**
[MESA-CHEIA-10](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md)
(T-05 fecha **uma** das seis abas; a D-2 segue dela),
[MESA-CHEIA-11](2026-08-13-MESA-CHEIA-11-a-janela-conta-um-quando-sao-quatro.md),
[ELO-MUDO-01](2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) (T-04 é um
caso; o contrato é da **Z1**),
[CURA-QUE-FERE-01](2026-08-04-CURA-QUE-FERE-01-toda-cura-de-systemd-tem-de-provar-o-ciclo-inteiro.md)
(a mordida da T-01; a regra é permanente),
[ESCONDE-SÓ-O-HIDRAW-01](2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md)
(o teto do que a T-07 pode prometer),
[ENGASGO-VULKAN-01](2026-08-23-ENGASGO-VULKAN-01-sessenta-quadros-por-segundo-e-setenta-engasgos-por-minuto.md)
(o botão "Tirar o que faz engasgar" desenha aqui e mora na Emulação) e
[AUTOMATISMO-MORTO-01](2026-07-30-AUTOMATISMO-MORTO-01-o-perfil-do-jogo-nunca-entra.md).

---

## 9. Os ganchos entre abas — o que esta sprint **não** conserta

| gancho | o que é | dono |
|---|---|---|
| Sistema → **Perfis** | "Este jogo não funciona" grava o appid; quem desmarca é a caixinha do editor. O elo depende do caminho da allowlist — **T-15** é o portão que o mantém | T-15 aqui; o resto é da onda de Perfis |
| Sistema → **Emulação** | `emulation_actions._steam_input_is_on` lê a mesma allowlist, e o botão "Tirar o que faz engasgar" **desenha aqui e mora lá** | onda de Emulação |
| Sistema ↔ **Início** | mesmo gesto de ligar/desligar, dois contratos, e o forte manda para o fraco — T-06 arruma **só o lado fraco** | T-06 aqui; a frase da Início é da onda dela |
| Sistema ↔ **Início** | `native_bt_fragil` vem no `state_full` e **só a Início lê**. O cartão chamado "Saúde do sistema" não diz uma palavra sobre o rádio | **Z5** |
| Sistema ↔ **Configurações** | **duas "saúdes" que não se conhecem**: a mesa/exame lá, o áudio USB/Steam/WirePlumber aqui. Quem tem problema não sabe qual olhar, e nenhuma cita a outra | fica aberto (§10) |
| Sistema → **No jogo / Perfis** | `_appid_do_jogo_ativo` (`:1411`) resolve *"de qual jogo estamos falando"* por três evidências, com três consumidores — e a linha do detector desta aba é o único lugar da janela que diz quando a resolução está cega | JANELA-CEGA-01 |
| Sistema → **Início / Emulação** | esta aba instala o encanamento da máscara (`hefesto-launch`) e **quem escolhe a máscara é outra aba**. A tela não mostra qual decisão vai sair pelo cano | onda de Início/Emulação |

---

## 10. O aceite

**`git add -A` antes** — os portões são cegos a arquivo novo.

```sh
git add -A
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
```

E, específico desta onda:

```sh
# T-01 — o vigia volta a ter próximo disparo (na CÓPIA do ambiente, nunca na sessão dela)
systemctl --user show hefesto-steam-input-guard.timer -p NextElapseUSecMonotonic
#   tem de deixar de ser 'infinity'

# T-02 — os dois scripts em todos os formatos
for a in disable_steam_input.sh fix_wireplumber_default_source.sh; do
  grep -l "$a" scripts/build_deb.sh flatpak/*.yml scripts/build_appimage*.sh \
               packaging/arch/PKGBUILD packaging/fedora/*.spec packaging/nix/*.nix
done
#   tem de listar TODOS os seis, não só o build_deb.sh
grep -rn "/app/share" src/hefesto_dualsense4unix/app/actions/daemon_actions.py
#   tem de devolver a base nova

# T-07 — a frase morta não volta
python3 scripts/validar-palavra-de-tela.py --all

# T-12 — o código morto foi embora
grep -rn '_query_gamepad_state' src/ tests/        # vazio

# T-09/T-15 — as mordidas que faltavam
.venv/bin/python -m pytest -q tests/unit/test_notebook_switch_page.py
XDG_CONFIG_HOME=/tmp/xdgtest .venv/bin/python -c "…"   # os dois caminhos iguais

# T-13 — a aba entra no mapa
.venv/bin/python scripts/gerar-mapa.py && python3 scripts/check_paridade_transporte.py
```

**A prova de tela**, no fim da onda: rodar
`scripts/gui-captura/retratar_abas.py` **uma vez** e conferir
`readme_sistema.png`. A Z0 já entregou o montador desta aba
(`retratar_abas.py:1582`), então aqui é **conferência**, não trabalho: a foto
tem de mostrar a saúde, o log e o detector — nunca "consultando…".

As mudanças **[COSMÉTICA]** (T-01, T-05, T-06) vão em lote para ela. As
**[OLHO DELA]** (T-03, T-04, T-07, T-08, T-10, T-11, T-14) **não entram sem a
palavra dela antes**.

**Nenhuma tarefa fecha sem o par vermelho → verde da sua mordida colado no
relato.**

---

## 11. O que fica aberto, e de quem é

**Dela:**

1. **D-A — "receita da máquina" ou "perfil do jogo"** (T-14): dos sete gestos
   desta aba, quais são do jogo e quais são da máquina. Sem isso a aba não entra
   em perfil nenhum.
2. **T-11** — o que o clique *"não funcionou"* registra no perfil. Carimbar
   ponte confirmada seria mentira; registrar tentativa descartada é o oposto e
   precisa do aval dela.
3. **T-13** — a família nova do CSV, e **qual lado do
   `plataforma.mapeamento_posicao` é verdade**.
4. **D-2 da MESA-CHEIA-10** — quais das seis abas sem alvo esmaecem a fita. A
   T-05 entrega só a Sistema.
5. **A trilha de Bluetooth inteira** (§7).
6. **A contagem no Pragmata**, que a TRES-CONTROLES-01 espera desde 10/08.

**Da Onda 12 (instalação):** o `install.sh` além da linha 3504, e a metade da
variável de ambiente da O-WRAPPER-QUE-SUMIU-01.

**Das ondas transversais:** Z1 (contrato de resposta — T-03, T-04), Z5
(`native_bt_fragil` e o resto do `state_full` que ninguém lê), Z6 (o portão que
liga o mapa à tela — T-13), Z7 (o ambiente presumido), Z0 (a foto, já entregue).

**Sem dono, e registrado para não virar paisagem:**

* **As duas "saúdes" que não se conhecem** — a da aba Configurações e a desta.
  Quem tem problema não sabe qual das duas olhar, e nenhuma cita a outra.
* **PS-TOQUE-CURTO-01** — o gesto de religar o controle abre a Steam, medido
  duas vezes em 45 segundos em 02/08, causa provada, **zero linha tocada desde
  então**. Esta sprint o absorve como fila, mas **não o planeja**: ele nasce
  nesta aba (Steam) e adoece no `daemon/subsystems/hotkey.py`, que é território
  do daemon e não da janela. Quem reger a Onda 12 decide se ele vira tarefa lá
  ou volta como sprint própria — **o que não pode é ele continuar invisível.**
