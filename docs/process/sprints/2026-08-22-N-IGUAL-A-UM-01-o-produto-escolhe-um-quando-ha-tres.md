---
sprint: N-IGUAL-A-UM-01
estado: absorvida
---

> **ESTADO 06/09/2026: absorvida** — pela regra da §3 do `SPRINT_ORDER.md`
> (*"história — não remedidas desde 27/08; o resto, se ainda faltar, é linha do
> CSV"*): o que desta sprint ainda faltar é linha de `docs/data/paridade-gtk-html.csv`
> ou célula de `docs/data/mapa-controles.csv`, e é lá que se cobra. **Se você achar
> aqui um defeito vivo que não está em nenhum dos dois, ele é seu: abra a linha.**

# N-IGUAL-A-UM-01 — o produto escolhe UM quando há três

**22/08/2026.** Auditoria pedida por ela, na frente **N=1**:

> *"todas as nossas soluções provavelmente foram tão fechadas a ponto de
> considerarmos somente os nossos componentes locais, talvez apenas o nosso
> primeiro adaptador bt (...) vai ficar pra sempre naquela de 'poxa, não sei pq
> não deu certo no seu pc, no meu funciona de boa'."*

**Estado:** ABERTA — duas curas entraram (E1), o resto é decisão dela.

Territórios varridos: `scripts/`, `src/`, `assets/`. A pergunta aplicada a cada
linha: *isto quebraria na máquina de outra pessoa, ou só é feio?*

---

## O defeito, em uma linha

**O produto pergunta ao PRIMEIRO adaptador e responde pelo RÁDIO INTEIRO.** Onde
a operação é sobre "o adaptador que hospeda o controle", escolher o primeiro é
escolher o errado com a maior confiança do mundo — e o doctor, que olha para o
mesmo primeiro, confirma a escolha errada como saudável.

---

## A bancada, MEDIDA em 22/08/2026

Três adaptadores, cinco controles, todos no rádio. Endereços com a máscara da
casa (octetos 4 e 5 zerados):

| `hciN` | Endereço | Alias no BlueZ | Quem hospeda |
|---|---|---|---|
| `hci0` | `D8:44:89:00:00:C4` | **`Nintendo MeowSystem`** | 1 DualSense. **Nintendo nenhum.** |
| `hci1` | `AC:A7:F1:00:00:CE` | `MeowSystem #2` | 1 DualSense **+ o Pro Controller** (`E0:F6:B5:00:00:53`) |
| `hci2` | `AC:A7:F1:00:00:41` | `MeowSystem #3` | 2 DualSense |

A árvore de bonds diz o mesmo, e diz ANTES de o controle conectar:
`/var/lib/bluetooth/AC:A7:F1:00:00:CE/E0:F6:B5:00:00:53/`.

**O prefixo `Nintendo` está no único adaptador que não precisa dele.**

---

## Os achados, em ordem de custo do silêncio

Grau: **MEDIDO** (rodei e vi) · **LIDO** (está no código, não exercitei) ·
**SUSPEITO**.

### ● A1 — `scripts/bt_active_mode.sh:75` (`_adaptador`) e `:139` · MEDIDO

`_adaptador()` devolve o primeiro `hci*` do glob do sysfs e sai (`return 0` na
primeira volta); o D-Bus, plano B, faz `sort -u | head -1` na linha 86. O
`ADAPTER_OBJ` da linha 139 é esse único adaptador, e é nele que o alias
`Nintendo *` é escrito.

**A metade (1) do `BT-NINTENDO-ACTIVE-01` está armada no alvo errado nesta
bancada** — e não uma vez: `bt_health_watchdog.sh:240` reexecuta o script a cada
2 min, o drop-in `bluetooth-dropin-10-hefesto-resilience.conf:128` o roda em todo
start do serviço, e `install.sh:1127` o roda na instalação. **A escolha errada é
reafirmada a cada dois minutos, para sempre.**

- **com UM adaptador:** correto, sempre. É por isso que nunca apareceu.
- **com TRÊS (a mesa dela):** 1 acerto em 3, e o acerto de hoje é zero.
- **com CINCO:** 1 em 5.
- **com um adaptador só que enumerou como `hci1`:** ainda correto — o glob pega
  o que existe. O `hciN` como identidade não é o defeito **aqui**; o defeito é a
  cardinalidade.

**O que eu NÃO medi:** o efeito na estabilidade do Pro. Provar exigiria renomear
o `hci1` dela e rodar um A/B sob carga na bancada viva — é gesto que muda a mesa
dela, e não é meu para dar. A cadeia causal (nome sem `Nintendo*` → sniff frágil
→ queda sob carga) é **LIDA**, das três fontes de 22/07 e do A/B de 23/07.

**Hipótese contra o que JÁ funcionava:** o Pro dela está de pé agora, sem o
prefixo. Isso não derruba o achado — derruba a leitura preguiçosa dele. Quem o
segura é a metade (2), o no-sniff por conexão, que **está aplicada**: medido,
`hcitool lp E0:F6:B5:00:00:53` devolve `RSWITCH` sozinho, sem `SNIFF`. O produto
está de pé com uma perna. A pesquisa de 22/07 já dizia que só o nome não basta;
esta bancada mostra o simétrico — só o no-sniff aguenta, até não aguentar.

### ● A2 — `scripts/doctor.sh:3066` (era 3048 antes da E1) · MEDIDO — **o mais caro dos oito**

```bash
_hci="$(_bt_adaptadores | head -1)"
```

O doctor confere o alias, o SNIFF do adaptador e o no-sniff do Pro. Os dois
primeiros ele confere **no primeiro adaptador**; o terceiro, na conexão do Pro —
que está em outro. Reproduzi o trecho, linha por linha, contra o D-Bus vivo:

```
[doctor] _hci escolhido = hci0
[doctor] alias=Nintendo MeowSystem lp=SNIFF pro_lp=sem-sniff
VEREDITO: PASS  -> modo ativo p/ Nintendo (nome 'Nintendo MeowSystem' + SNIFF + no-sniff no Pro)
REALIDADE: o Pro está em /org/bluez/hci1, cujo Alias é "MeowSystem #2"
```

**O instrumento e o produto erram juntos, porque olham para o mesmo primeiro.**
Nenhuma execução do doctor jamais encontraria A1. Este é o padrão que ela já
nomeou — *o instrumento mente mais que o produto* — na forma mais cara dele: um
`[ OK ]` verde por cima de uma cura desarmada.

Custo do silêncio: máximo. As outras sete linhas desta lista alguém encontra
lendo o código; esta impede que se encontre.

### ● A3 — `scripts/doctor.sh:2734` (antes da E1) · MEDIDO · **CURADO nesta leva**

```bash
disc="$(_dbus_bt_prop /org/bluez/hci0 org.bluez.Adapter1 Discovering)"
```

`hci0` literal no caminho de execução. O aviso existe porque *"inquiry contínuo
rouba banda dos links dos controles"* — e a busca só rouba banda do rádio em que
ela acontece. Quatro dos cinco controles dela estavam fora do radar deste aviso.
Numa máquina de **um** adaptador que enumerou como `hci1`, o aviso é no-op MUDO.

É a mesma cicatriz que `scripts/bt_health_watchdog.sh:158` já carrega — *"Concatenar
'hci0' fazia a vigia virar no-op MUDO num adaptador hci1"*. E o próprio
`doctor.sh` **a cita pelo nome** trinta linhas abaixo, no comentário do A5
(`WATCHDOG-HCI-HARDCODE-01: hci1 já aconteceu nesta máquina, e ali o check
virava no-op mudo`) — cita, e não a aplica na linha de cima. A casa sabia.

### ● A4 — `scripts/doctor.sh:2728` (antes da E1) · MEDIDO · **CURADO nesta leva**

A linha de cura do `BT-SDP-VAZIO-01` mandava a pessoa copiar:

```
busctl call org.bluez /org/bluez/hci0 org.bluez.Adapter1 RemoveDevice o /org/bluez/hci1/dev_...
```

O adaptador vem fixo, o device vem certo. Em `hci1`, o `RemoveDevice` devolve
`InvalidArgs` e não apaga nada. **Um comando de cura que falha na mão dela é pior
que nenhum:** ela conclui que o diagnóstico estava errado, e o bond quebrado fica.

### ● A5 — `scripts/doctor.sh:2771` (era 2753 antes da E1) · MEDIDO

```bash
_adp="$(_bt_adaptadores | head -1)"
```

Contadores de erro RX/TX do primeiro adaptador, e a frase que sai é
`adaptador BT sem erros de RX/TX (0/0)` — sem número, sem nome, falando pelo
rádio inteiro. Medido hoje: `hci0 0/0`, `hci1 0/0`, `hci2 0/0` — **hoje ninguém
mentiu**, mas a estrutura é de falso `[ OK ]`: basta o rádio sujo ser o `hci2`.

**`_bt_adaptadores` é uma função PLURAL — devolve um adaptador por linha — e os
seus DOIS únicos chamadores a singularizam com `head -1`** (linhas 2771 e 3066).
A resposta certa já estava no arquivo.

### ● A6 — `scripts/bt_active_mode.sh:196` · LIDO

```bash
elif ! hciconfig "${HCI}" lp 2>/dev/null | grep -q 'SNIFF'; then
```

A devolução do SNIFF default — a que o 8BitDo precisa para probar — só acontece
no primeiro adaptador. Medido: os três estão com `RSWITCH HOLD SNIFF PARK`
(default do kernel), então **hoje não há efeito**. O modo de falha é o histórico:
uma versão anterior deixou um adaptador sem SNIFF e o clone não completa a probe
nele — e o reparo automático nunca chega ali. Não medi porque não vou tirar o
SNIFF de um adaptador dela para ver.

### ● A7 — `scripts/medir_w3_coex.sh:46` · LIDO

```bash
HCI=hci0
```

Instrumento, não produto — e é exatamente por isso que conta. Ele mede o delta de
contadores HCI para decidir se o Wi-Fi está sujando o rádio dos controles; nesta
bancada mediria o adaptador com **um** controle e ficaria cego aos dois que têm
quatro. Não há `--hci`. O cabeçalho do próprio script já ensina a regra que ele
não cumpre: *"Δ ausente = medida ausente, não rádio limpo"*. Aqui o Δ não é
ausente — é de outro rádio, que é pior, porque parece resposta.

### ● A8 — `scripts/fix_wireplumber_default_source.sh:617` e `:673` · LIDO

`pick_dualsense_source_id()` devolve `first` — a primeira fonte de captura cujo
nome casa `DualSense`. O chamador da linha 673 promove esse id a fonte padrão e
diz `mic do DualSense promovido a fonte padrão (id N)`, **sem dizer de qual
controle**. Com dois DualSense no cabo, promove um arbitrário e chama de sucesso.

O contraste é dentro de casa: `src/hefesto_dualsense4unix/app/mic_monitor.py:305`
resolve o MESMO problema e **recusa adivinhar** — só faz o um-para-um quando há
exatamente uma fonte e exatamente um controle com áudio, porque *"exibir o mic do
controle errado é pior que não exibir nenhum"*. A regra existe, escrita, a um
módulo de distância do script que a viola.

**Não medi o efeito:** os cinco controles dela estão no rádio, e por rádio não
existe fonte ALSA para promover. `wpctl status` hoje lista uma fonte só, e não é
de controle.

---

## Reportado, NÃO editado (arquivos de outra leva)

- **`src/hefesto_dualsense4unix/integrations/apelido_do_dongle.py:338`** — a
  função `adaptadores_com_nintendo()` **já existe** e responde exatamente a
  pergunta que o `bt_active_mode.sh` não faz: quais adaptadores hospedam
  linhagem Nintendo, lendo `HID_PHYS` do sysfs, sem root. Ela é usada para
  PROTEGER o prefixo em quem já o tem, nunca para PÔ-LO em quem precisa. É o
  padrão que ela já nomeou: *a casa sabe e o produto não faz*.
- **`scripts/bt_ponte_privilegiada.sh:91`** — o comentário já registra o fato:
  *"O prefixo 'Nintendo ' continua sendo posto pelo `bt_active_mode.sh` no
  PRIMEIRO adaptador"*. Estava escrito como realidade ambiente, não como defeito.

---

## Os descartes — dezoito candidatos que NÃO são defeito

Sem esta seção a auditoria não filtrou nada. Cada linha abaixo casa o padrão que
eu estava caçando e **não** é defeito, com o motivo:

| Onde | Por que NÃO é defeito |
|---|---|
| `scripts/bt_active_mode.sh:216` — `hcitool lp "${MAC}"` | **MEDIDO:** o `hcitool` acha o adaptador da conexão sozinho (`hci_for_each_dev`). Com `${HCI}=hci0`, `hcitool lp` no Pro de `hci1` devolveu `RSWITCH`. A metade (2) é multi-adaptador de graça. |
| `scripts/bt_health_watchdog.sh` inteiro | A cura da cicatriz **foi** aplicada aqui: usa a árvore D-Bus inteira, sem `head`. O defeito é a lição não ter viajado. |
| `scripts/bt_bonds_snapshot.sh` e `scripts/bt_bonds_restore.sh` | Iteram TODOS os adaptadores (`find -print0`). Exemplares. |
| `src/.../integrations/mesa_de_radio.py`, `radio_da_mesa.py`, `exame_da_mesa.py` | Nascidos plurais (22/08): `sorted(listar(...))` e laço, nunca `[0]`. |
| `src/.../core/evdev_reader.py:465` — `sorted(nodes)[0]` | Um device HID tem um nó `hidraw`. O diretório nunca tem dois. |
| `src/.../core/backend_pydualsense.py:2248` — `next(iter(...))` | É a eleição do **primário**, documentada, e a operação é singular por definição. Quem quer outro controle passa `uniq`. |
| `src/.../app/actions/status_actions.py:2207` — `conectados[0]` | Guardado por `if contagem.adotados == 1`. |
| `src/.../app/app.py:134` — `wids[0]` | Trazer ao foco a janela do predecessor. Um app, uma janela. |
| `src/.../app/app.py:1280` — `get_primary_monitor() or get_monitor(0)` | Já tenta `get_monitor_at_window` primeiro. Multi-monitor correto. |
| `src/.../app/constants.py:29` — `candidates[0]` | Ícone: dois caminhos candidatos, um resultado. Singular de verdade. |
| `assets/84-nintendo-pro-variant.rules:63` — `SYMLINK+="hefesto/nintendo-pro"` | Nome fixo para device plural, **mas** o limite está declarado no cabeçalho e **nenhum código do produto consome o symlink** (só a documentação). |
| `scripts/disable_steam_input.sh` / `steam_launch_options.pastas_steamapps` / `storm_doctor.find_localconfig_vdfs` | Todos plurais: glob de `userdata/*`, `libraryfolders.vdf` lido, laço em `VDFS`. |
| `src/.../integrations/steam_input_ponte.py:303` — `com_a_chave[0]` | Só devolve com `len(...) == 1`; **recusa** quando há duas árvores. É a forma certa. |
| `scripts/install_usb_quirk.sh:84` — um token `usbcore.quirks=` | A singularidade é do kernel, não nossa, e o script AVISA em vez de sobrescrever. |
| `daemon/subsystems/coop.py` | N controles = N jogadores, identidade por MAC. Nenhum teto escondido. |
| `scripts/build_*.sh`, `medir_steam_virtual_gamepad.sh:46`, `doctor.sh:2947`, `doctor.sh:4380` | `head -1` sobre coisa genuinamente única: um wheel de build, uma variável de ambiente de um PID, o `ExecStart` de um serviço, a existência das nossas regras. |
| `hci0` em COMENTÁRIO (`bt_active_mode.sh:33`, `:72`; `storm_watch.sh:167`; `doctor.sh:2610`; vários `.md`) | Texto. Não executa. |
| `scripts/gui-captura/retratar_abas.py:909` — `"hci0": ...` | Dado de mentira para a foto da aba. Não é caminho de execução. |

---

## Entregas

### E1 — o doctor pergunta ao adaptador que hospeda o controle ● FEITA

`scripts/doctor.sh`, dentro de `check_bt_radio`: o conjunto de adaptadores com
controle conectado é colhido do próprio caminho D-Bus de cada device
(`${p%/*}`), e o `Discovering` é perguntado a **cada um deles**, nomeando qual.
A linha de cura do `BT-SDP-VAZIO-01` passa a citar o adaptador do device.

Teste que morde:
`tests/unit/test_o_doctor_olha_o_adaptador_que_hospeda_o_controle.py` — `busctl`
FAKE com o controle em `hci1` e a busca ligada em `hci1`. **Arranquei a cura: as
duas asserções reprovam** (o aviso some, e a cura volta a citar `hci0`).
Devolvida: 2 verdes. Os 87 testes irmãos do doctor seguem verdes.

**Custo:** 12 linhas em um arquivo, 1 teste novo. Nada de comportamento de
produto muda — muda o que o diagnóstico enxerga.

### E2 — `bt_active_mode.sh` aplica o alias em TODO adaptador que hospeda Nintendo

Não fiz: **muda comportamento de produto e cruza com a leva do `apelido_do_dongle`.**
O caminho é curto e a fonte da verdade já está medida — a árvore de bonds:

```
/var/lib/bluetooth/<MAC_DO_ADAPTADOR>/<MAC_DO_CONTROLE>/
```

O script já roda como root, então lê a árvore 700 sem pedir nada a ninguém. E a
árvore responde **antes** de o controle conectar, que é quando importa: o Pro lê
o nome do host no momento do link, e um prefixo aplicado depois chega tarde.
Isto é o que `adaptadores_com_nintendo()` (que lê o sysfs vivo) **não** consegue
fazer sozinha.

**Custo:** ~20 linhas de shell, um laço no lugar de um escalar, e um teste com
uma árvore `HEFESTO_BT_LIB` de mentira — o gancho já existe.

### E3 — o doctor confere TODOS os adaptadores, não o primeiro

`_bt_adaptadores` já é plural. Trocar os dois `| head -1` (2771 e 3066) por um
laço, e as frases por frases que nomeiam o adaptador:
`adaptador hci2 sem erros de RX/TX (0/0)`. Enquanto A2 estiver de pé, **E2 não
tem como ser conferida**.

**Custo:** ~25 linhas, e a saída do doctor cresce uma linha por adaptador.

### E4 — o portão contra a classe inteira

Um teste que varre `scripts/` e reprova `hci0` literal fora de comentário, e
`_adaptador`/`_bt_adaptadores` seguido de `head -1`. É a mesma forma do
`check_anonymity.sh`: barato, e mata a reincidência em vez do caso.

**Custo:** ~40 linhas de teste, mais o trabalho de lidar com os falsos positivos
listados abaixo (a lista de exceções tem de nascer junto, ou o portão morre no
primeiro dia).

### E5 — `--hci` no `medir_w3_coex.sh`, e aviso quando há mais de um

**Custo:** ~10 linhas. Instrumento, não produto — pode ficar por último, mas
enquanto não for feito nenhuma medição de coexistência desta casa vale para uma
mesa com mais de um adaptador.

---

## Decisão dela

**D1 — o prefixo vai em quais adaptadores?** Em TODOS (mais simples, e o A/B de
23/07 mediu que o alias não atrapalha o clone) ou só nos que hospedam Nintendo?
**Recomendo "só nos que hospedam"**, e o motivo não é técnico: a leva do
`apelido_do_dongle` esconde o prefixo na tela **apenas** em adaptador com
Nintendo, e nunca subtrai. Pôr `Nintendo` em todos vazaria a palavra para dentro
dos nomes que ela escreveu — `Nintendo Sofá` — de forma permanente.

**D2 — bond ou rádio vivo?** O bond acerta antes do link (é o que o Pro precisa)
mas precisa de root; o sysfs vivo dispensa root e chega tarde. Os dois lugares
que fazem a pergunta são diferentes: o script é root, a GUI não. Talvez a
resposta seja "cada um com a sua fonte", e não uma só.

**D3 — o alias que o produto puser conta como nome dela?** Se o produto prefixar
o `hci1`, a tela da aba passa a mostrar `MeowSystem #2` sem o `Nintendo` (é o que
`limpar_o_nome` faz). Ela precisa saber que o produto escreveu ali, ou é costura
invisível como a do rename?

---

## O que este achado ensina

**Um `head -1` não é defeito; um `head -1` sobre uma função PLURAL é.** O
`_bt_adaptadores` do doctor devolve um adaptador por linha e tem dois
chamadores — os dois cortam no primeiro. Quem escreveu a função já sabia a
resposta certa; quem a chamou jogou fora.

E a lição irmã: **a cicatriz local não vira regra sozinha.** O
`WATCHDOG-HCI-HARDCODE-01` está escrito desde 23/07, com journal e tudo, e o
`hci0` literal seguiu vivo a vinte linhas dele, no mesmo arquivo, por um mês.
Cicatriz que não vira portão é cicatriz que a casa relê e não aplica.
