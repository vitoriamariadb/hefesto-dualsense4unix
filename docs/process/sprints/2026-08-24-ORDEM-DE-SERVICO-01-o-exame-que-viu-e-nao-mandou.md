---
sprint: ORDEM-DE-SERVICO-01
posse:
  # A chave é o código do agente — o portão recusa lista solta, e com razão:
  # posse sem dono é o defeito que o formato existe para matar.
  ORDEM-B:
    - src/hefesto_dualsense4unix/integrations/exame_da_mesa.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
cria:
  - src/hefesto_dualsense4unix/integrations/ordens_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/portas_do_barramento.py
  - tests/unit/test_ordens_da_mesa.py
  - tests/unit/test_o_selo_de_procedencia_nunca_falta.py
  - tests/unit/test_a_ordem_confirma_que_ela_moveu.py
  - tests/unit/test_o_estado_bom_nao_e_o_estado_vazio.py
  - docs/protocol/por-que-usb3-atrapalha-24ghz.md
nao_toca:
  - src/hefesto_dualsense4unix/integrations/mesa_de_radio.py
  - src/hefesto_dualsense4unix/integrations/censo_do_barramento.py
  - src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - docs/data/mapa-controles.csv
  - GUIA-RADIO-DA-SALA.md
depois_de:
  # A faxina de 27/08 apagou daqui: PORTAS-DA-CASA-01, CONEXOES-MAPA-2D-01. Para onde cada uma foi, veja 2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md.
bancada: false
---

> **▲ DUAS DECISÕES FECHARAM DEPOIS QUE ESTA SPRINT FOI ESCRITA, e elas mandam
> nela.** Leia antes de executar qualquer tarefa — o corpo abaixo ainda não foi
> reescrito por inteiro, e nos pontos de conflito **a decisão vence o texto**.
>
> 1. **`D-A-PALAVRA-ENTRADA`** (`docs/data/decisoes-dela.csv`): a tela diz
>    **"entrada"**, nunca "porta". Sai da frase dela: *"o número da entrada usb
>    salvaria muito como coluna"*. Vale para **todo texto de tela e toda
>    asserção de teste sobre texto de tela**; identificador de código pode
>    continuar `porta`. A varredura completa é da **CONFIGURACOES-O-LEXICO-01**,
>    que é a dona única do texto desta aba — não a faça aqui, ou duas frentes
>    editam a mesma frase.
> 2. **`D-PERFIL-DE-DESEMPENHO`**: os cinco degraus do "Orçamento" **não viram
>    três botões de teto**. Viram **um perfil** — `Tudo ligado` / `Bateria
>    longa` / `Eu escolho` — e o **microfone sai do perfil**, para linha própria,
>    porque é o único que capta a sala. Migração sem perda: `economia` →
>    Bateria longa; `balanceado`/`max`/`auto`/vazio → Tudo ligado; `custom` →
>    Eu escolho.



# ORDEM-DE-SERVIÇO-01 — o exame que viu e não mandou

**24/08/2026. GRAU: MEDIDO**, exceto onde a linha diz DESENHO ou NÃO VERIFICADO.
Frente B da leva Configurações. Só DualSense (escopo do MVP, decisão dela de hoje).

**O que esta sprint fecha**

1. A seção "Está tudo certo?" para de publicar cinco palavras e passa a publicar
   **ordens de serviço**: o que eu vi, por que importa, o ganho esperado, e dois
   botões.
2. **A cura já existe no código e morre num tooltip.** `Item.cura`
   (`integrations/exame_da_mesa.py:98`) é escrita por quatro das cinco checagens
   e só chega à tela dentro de `_dica_do_item`
   (`app/actions/config/secao_exame.py:405`), ou seja: só quem passa o mouse por
   cima descobre o que fazer.
3. **Todo texto de ordem ganha selo de procedência** — `medido aqui` /
   `derivado da conta` / `especificação de terceiro` —, modelado em DADO, não em
   string de tela.
4. O produto passa a ler **três campos de `/sys` que nenhuma linha de `src/` lê
   hoje** (`port/peer`, `port/state`, `port/connect_type`), e é só com o `peer`
   que o arranjo suspeito da máquina dela deixa de ser invisível.
5. O estado bom deixa de ser indistinguível do estado vazio (F7 desta casa).

**O que ela NÃO faz**

- **Não desenha o mapa 2D** — é a Frente A. Esta sprint DEPENDE dela para dizer
  "porta 11" em vez de "o buraco 2 do hub de dentro"; a §7.3 diz o que a ordem
  escreve enquanto o mapa não existe.
- **Não mede Bluetooth.** Nenhuma ordem afirma ganho de rádio. As medições que
  fechariam os `derivado` estão na §9, com comando pronto, e são DELA.
- **Não conserta `vizinhancas_apertadas`** — isso é PORTA-03, de
  [PORTAS-DA-CASA-01](2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md).
  Esta sprint consome o resultado. Ver a colisão na §11.
- **Não toca o medidor de fatias** (`radio_da_mesa.py`) nem a seção Desempenho —
  é a Frente C. O MODELO de ordem é compartilhado; as REGRAS têm dono (§5.4).
- Não renomeia "A mesa" nem "Orçamento" (renomes dela, e são da Frente A e da C).

---

## 1. O defeito, em uma frase

**O produto já escreveu a cura de quatro dos cinco problemas que ele sabe achar,
e a cura só existe se a pessoa passar o mouse por cima da palavra certa — enquanto
isso, a única frase que a tela publica hoje na máquina dela acusa a WEBCAM, e o
aparelho de 5 Gbps encaixado no mesmo chip de hub que um dongle Bluetooth não
gera meia palavra, porque a régua se recusa a atravessar barramento.**

---

## 2. O que está medido

Régua: `.venv/bin/python` importando `src/` direto, **uid 1000, sem root**, mais
`cat`/`readlink` em `/sys` para o que o produto ainda não lê. Kernel
`7.0.11-76070011-generic`, 24/08/2026, ~21h30. Nenhum comando desta seção abriu
`/dev`, tocou o daemon ou falou com o rádio — a bancada é dela e estava em uso.

### 2.1 A cura escrita, e o tooltip que a enterra

`Item` tem cinco campos, e um deles é `cura`
(`src/hefesto_dualsense4unix/integrations/exame_da_mesa.py:86-105`). Quatro
checagens a escrevem:

| checagem | linha | a cura que ela já escreve |
|---|---|---|
| `energia_do_radio` | `exame_da_mesa.py:175` | "Desencaixe e encaixe o adaptador Bluetooth de novo…" |
| `energia_das_portas` | `exame_da_mesa.py:242` | "Rode a instalação do Hefesto de novo…" |
| `pareamentos` | `exame_da_mesa.py:396` | "No Bluetooth do sistema, remova esse controle e pareie de novo…" |
| `suporte_ao_controle` | `exame_da_mesa.py:285` | "Reinicie o computador; se continuar, o kernel pode ser antigo demais." |
| `vizinhanca_das_portas` | `exame_da_mesa.py:487-502` | "Veja a seção A mesa, logo abaixo, e mude um dos dois para uma porta mais longe." |

O único caminho até a tela é
`etiqueta.set_tooltip_text(_dica_do_item(item))`
(`app/actions/config/secao_exame.py:405`, e só ali). **Não há um segundo.** A
grade publica só glifo + rótulo (`secao_exame.py:400-404`).

É a `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ` na forma mais barata de consertar: o dado
está pronto, falta a tela pronunciá-lo.

### 2.2 Hoje, na máquina dela, o único par acusado é a webcam

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.integrations import mesa_de_radio as m
for p in m.ler_a_mesa().apertadas: print(p)"
```

```
('…/usb3/3-3', '…/usb3/3-4')
```

`3-3` é um TP-Link UB500 (Bluetooth). `3-4` é a `HD Pro Webcam C920`, classe
`0e/01/00`, 480 Mb/s. **Webcam de cabo não irradia 2,4 GHz.** É o mesmo falso
positivo que PORTA-03 já foi escrita para matar, com outro aparelho.

E a tela publica isso como `▲ Vizinhança das portas`, mais um sufixo
`vizinho do adaptador 3` na linha da webcam — o `3` é o **ordinal da própria
lista da aba** (`secao_mesa.py:1605`, `enumerate(..., start=1)`), não um
número que exista no gabinete. É F1 (jargão) + F7 (o vazio parecendo resposta)
na mesma frase.

### 2.3 O `peer` prova o hub único, e nenhuma linha de `src/` o lê

```bash
readlink /sys/bus/usb/devices/3-1.1:1.0/3-1.1-port4/peer
readlink /sys/bus/usb/devices/4-1.1:1.0/4-1.1-port2/peer
```

```
../../../../usb4/4-1/4-1:1.0/4-1.1-port4
../../../../usb3/3-1/3-1:1.0/3-1.1-port2
```

O kernel costura, buraco a buraco, o lado USB 2.0 e o lado USB 3.0 do MESMO
soquete físico. Estado dos oito buracos do hub dela, medido agora:

| soquete | lado 2.0 | lado 3.0 | o que está lá |
|---|---|---|---|
| externo 1 | `3-1-port1` configurada | `4-1-port1` configurada | o hub de dentro |
| externo 2 | `3-1-port2` configurada | `4-1-port2` vazia | dongle BT `3-1.2` |
| externo 3 | `3-1-port3` vazia | `4-1-port3` vazia | **livre** |
| externo 4 | `3-1-port4` configurada | `4-1-port4` vazia | teclado `3-1.4` |
| interno 1 | `3-1.1-port1` vazia | `4-1.1-port1` vazia | **livre** |
| interno 2 | `3-1.1-port2` vazia | `4-1.1-port2` **configurada** | o `802.11ac NIC`, 5 Gbps |
| interno 3 | `3-1.1-port3` vazia | `4-1.1-port3` vazia | **livre** |
| interno 4 | `3-1.1-port4` **configurada** | `4-1.1-port4` vazia | dongle BT `3-1.1.4` |

**O aparelho de 5 Gbps e um dongle Bluetooth estão a dois buracos um do outro, no
mesmo chip de hub.** `vizinhancas_apertadas` (`mesa_de_radio.py:336`) não vê:
ela recusa o par no `if primeiro.busnum != segundo.busnum: continue`
(`mesa_de_radio.py:356-357`), e os dois estão em `busnum` 3 e 4.

Nenhuma ocorrência de `port/peer`, `port/state` ou `connect_type` em
`src/hefesto_dualsense4unix/` (grep conferido hoje; os únicos `peer` do produto
são `SO_PEERCRED` no broker, `hidraw_broker.py:919`).

### 2.4 Buraco livre é derivável HOJE, sem campo novo de kernel

`state == "not attached"` nos DOIS lados de um par `peer` é buraco vazio.
`connect_type == "hotplug"` é buraco que uma pessoa alcança — medido: os dez
buracos de `usb1` (controladora `0000:02:00.0`) são `hotplug`, e **nove estão
livres**. Um deles está em `state=default`, transiente: só `not attached` conta.

Isso dá `portas_livres()` sem esperar nada. É o que faz a ordem poder mandar em
vez de sugerir.

### 2.5 O produto NÃO sabe que o aparelho de 5 Gbps é um Wi-Fi

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.integrations import censo_do_barramento as c
a = [x for x in c.ler_o_barramento().conectados() if x.nome_do_kernel=='4-1.1.2'][0]
print(a.vid, a.pid, a.classe, a.especie, a.grau, a.produto)"
```

```
2357 012d ff Não identificado desconhecido 802.11ac NIC
```

Classe `ff` = o fabricante declinou de classificar. O `product` diz
"802.11ac NIC" e **isso não o torna Wi-Fi para o produto** — o cabeçalho do
censo proíbe adivinhar por texto, com a razão escrita
(`censo_do_barramento.py:34-38`). Consequência dura para o desenho:

> **A ordem não pode escrever "Wi-Fi".** Ela escreve "o aparelho de 5 Gbps que
> você ainda não identificou" e empurra para a declaração da seção Conexões.
> Depois que ela declarar (`MesaDeclarada.radios`, `utils/maquina.py:138-151`), a
> ordem passa a chamá-lo pelo nome dela.

### 2.6 A identidade que confirma "já movi" — e as duas armadilhas medidas

```bash
for d in 3-1.2 3-1.1.4 3-3 4-1.1.2; do
  printf "%-9s %s | %s\n" "$d" "$(cat /sys/bus/usb/devices/$d/serial)" \
                                "$(cat /sys/bus/usb/devices/$d/product)"; done
```

```
3-1.2     ACA7F1000041 | TP-Link UB500 Adapter
3-1.1.4   D844890000C4 | TP-Link Bluetooth USB Adapter
3-3       ACA7F10000CE | TP-Link UB500 Adapter
4-1.1.2   123456       | 802.11ac NIC
```

1. **`vid:pid` não identifica**: os três dongles são `2357:0604`. O `serial`
   identifica, e vem de graça no sysfs — **sem BlueZ, sem D-Bus, sem MAC**. De
   quebra: os três serials são exatamente os do briefing, então o vínculo
   `hciN` → aparelho é derivável sem abrir o barramento de sistema.
2. **`serial` também mente**: o Archer declara `123456`. E `product` diverge
   entre dois dongles idênticos ("UB500 Adapter" × "Bluetooth USB Adapter"). A
   identidade é a **tripla `(vid, pid, serial)`**, e quando a tripla é ambígua
   (dois aparelhos com a mesma) o produto **desiste de confirmar** — nunca chuta.
3. **O serial não vai para a tela.** `scripts/check_anonymity.sh:333` diz por
   escrito que *"o serial identifica a unidade dela tão bem quanto o MAC"*, e a
   tela desta aba é fotografada e versionada por
   `scripts/gui-captura/retratar_abas.py`.

### 2.7 As regras que CALAM hoje — e isso é resultado, não ausência

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.integrations import censo_do_barramento as c
for a in c.ler_o_barramento().conectados():
    print(a.nome_do_kernel, a.energia.controle, a.energia.excesso_de_corrente)"
```

Todos `on`, todos `0`. Ou seja: `power/control` em `auto` (regra R5) e
`over_current_count > 0` (R6) **não disparam nesta máquina**. É prova de que o
catálogo é conservador e de que o estado bom precisa saber se dizer — que é o
assunto da §8.

---

## 3. O que é HIPÓTESE, e continua sendo

| afirmação | grau |
|---|---|
| Bluetooth Classic tem 1.600 fatias/s | **especificação de terceiro** (Bluetooth SIG). Já na tela: `secao_mesa.py:285-294` |
| mic custa 277 e não 260 fatias | **medido**, A/B de 25/07 (`radio_da_mesa.py:127-138`) |
| USB 3.0 emite ruído em 2,4 GHz | **especificação de terceiro** — e **NÃO ACHEI a citação nesta árvore**. `mesa_de_radio.py:_VELOCIDADE_USB3` e `secao_mesa.py:269` afirmam sem fonte. ORDEM-7 dá um dono a ela |
| que o aparelho de 5 Gbps esteja degradando o Bluetooth DELA | **NÃO VERIFICADO.** É a medição W1 da §9, e é dela |
| que mover qualquer coisa melhore o rádio nesta máquina | **NÃO VERIFICADO.** Nenhuma ordem afirma ganho |
| portas 1/4/7, 60 mm de separação, altura da antena | **raciocínio do GUIA**, zero medição. Nenhuma ordem cita esses números |

---

## 4. O selo — como ele é modelado em DADO

Três graus, exatamente os que ela aprovou. Chave de máquina em ASCII com hífen
(a convenção de `de_onde_sei` do mapa de canais), texto de tela à parte:

```python
MEDIDO_AQUI = "medido-aqui"                        # → "medido aqui"
DERIVADO_DA_CONTA = "derivado-da-conta"            # → "derivado da conta"
ESPECIFICACAO_DE_TERCEIRO = "especificacao-de-terceiro"  # → "especificação de terceiro"
```

```python
@dataclass(frozen=True)
class Linha:
    """Uma das três frases de uma ordem, com de onde ela veio."""
    texto: str
    selo: str
    fonte: str = ""   # OBRIGATÓRIO quando selo == ESPECIFICACAO_DE_TERCEIRO
```

**Por que vocabulário novo em vez de reusar `de_onde_sei` literalmente.** As duas
respondem perguntas diferentes: o CSV responde *"como sei que este canal
funciona"*, a ordem responde *"como sei que este conselho vale"*. A
correspondência existe onde existe, e o resto não tem par:

| selo da ordem | `de_onde_sei` do mapa | por quê |
|---|---|---|
| `medido-aqui` | `medido` | mesma coisa, um mede o aparelho, o outro mede a máquina |
| `especificacao-de-terceiro` | `afirmado-no-doc` | mesma coisa, e o selo da ordem **exige nomear o terceiro** |
| `derivado-da-conta` | — | não existe lá: o CSV não faz aritmética |
| — | `inferido-do-codigo` | não existe aqui: não há código de que inferir |
| — | `incerto` | uma ordem incerta não nasce. Ela vira medição da §9 |

**A regra que o portão guarda:** `ESPECIFICACAO_DE_TERCEIRO` sem `fonte` não
existe. Autoridade anônima é como raciocínio se veste de medição — o defeito que
esta casa mais combate, e o motivo de o selo existir.

---

## 5. O catálogo de regras

### 5.1 A forma de uma regra

```python
@dataclass(frozen=True)
class Ordem:
    chave: str            # slug da regra — a chave de dispensa e de teste
    acao: str             # o imperativo: "Mova o … da porta X para Y"
    o_que_eu_vi: Linha
    por_que_importa: Linha
    ganho_esperado: Linha
    alvo: Identidade      # (vid, pid, serial) do aparelho a mover
    arranjo: str          # a assinatura do arranjo de AGORA — §7
    destino: str = ""     # "" quando não há buraco livre: a ordem nasce SEM ação
```

### 5.2 As sete regras, com gatilho e âncora

| # | chave | gatilho (condição medida) | onde o dado já é lido / o que falta | dispara hoje? |
|---|---|---|---|---|
| R1 | `radio_largo_no_mesmo_hub` | aparelho com `velocidade_mbps >= 5000` num soquete do MESMO hub físico que um adaptador Bluetooth | censo lê a velocidade (`censo_do_barramento.py:209-243`); **falta `port/peer`** para casar os dois lados do hub — ORDEM-1 | **sim** (`4-1.1.2` × `3-1.1.4`) |
| R2 | `dois_radios_colados` | par de `vizinhancas_apertadas` em que **os dois lados irradiam** | `mesa_de_radio.py:336` + o filtro de PORTA-03 | não (a webcam sai pelo filtro) |
| R3 | `dongle_atras_de_hub` | `Adaptador.atras_de_hub` e existe soquete `hotplug`+`not attached` numa controladora diferente | `mesa_de_radio.py` já tem `atras_de_hub`; **falta `portas_livres()`** — ORDEM-1 | **sim** (hci0 e hci1) |
| R4 | `teclado_so_no_hub` | zero aparelhos de classe `03/01/01` fora de hub, havendo hub na cadeia | `censo_do_barramento.py` (classe da interface 0) | **sim** (`3-1.4` é o único teclado, e está no hub) |
| R5 | `dongle_dorme` | `Energia.controle == "auto"` num aparelho de classe `e0` | `censo_do_barramento.py:515` | não (tudo `on`) |
| R6 | `porta_reclamou_de_corrente` | `Energia.excesso_de_corrente > 0` no soquete de um adaptador | `censo_do_barramento.py:515` | não (tudo `0`) |
| R7 | `adaptador_cheio` | `Ocupacao.fracao_total > CORTE_APERTADA` | `radio_da_mesa.py:164` e `:252` — **é da Frente C**, não desta sprint | — |

### 5.3 As três linhas de cada regra, com o selo de cada uma

**R1 — o rádio de banda larga no mesmo hub.** O texto exato, no formato dela:

```
▲ 1 mudança recomendada
  Mova o aparelho de 5 Gbps para uma entrada do computador
   • O que eu vi aqui: um aparelho que você ainda não
     identificou negocia 5 Gbps a dois buracos de um
     adaptador Bluetooth, no mesmo hub.        [medido aqui]
   • Por que importa: USB 3.0 emite ruído bem em cima da
     faixa de 2,4 GHz, que é a faixa dos controles.
                        [especificação de terceiro · Intel]
   • Ganho esperado: não medido nesta máquina.
                                   [derivado da conta]
     [Já movi — reexaminar]   [Ignorar]
```

`derivado da conta` na terceira linha porque é o que ela aprovou: o selo diz de
onde vem a EXPECTATIVA, e o texto diz que o número não foi medido aqui. As duas
metades juntas são a frase honesta; separadas, qualquer uma mente.

**R3 — o dongle atrás do hub.**

- `O que eu vi aqui`: "dois dos três adaptadores Bluetooth chegam ao computador
  por dentro do hub, e há {N} entradas livres no próprio computador."
  `[medido aqui]`
- `Por que importa`: "tudo que passa pelo hub divide o mesmo caminho de
  480 Mb/s com o que mais estiver lá." `[medido aqui]` — é `speed` do sysfs,
  não especificação.
- `Ganho esperado`: "não medido nesta máquina." `[derivado da conta]`
- **Contra-regra obrigatória:** três adaptadores no mesmo hub é o arranjo que o
  próprio `GUIA-RADIO-DA-SALA.md` manda comprar. R3 só nasce quando há buraco
  livre em **outra controladora PCI**, e nunca acusa um dongle de atrapalhar
  outro.

**R4 — o teclado só no hub.**

- `O que eu vi aqui`: "o único teclado da casa depende do hub." `[medido aqui]`
- `Por que importa`: "se o hub sair da tomada, você fica sem teclado antes do
  Linux abrir." `[derivado da conta]` — sai da contagem, não de terceiro.
- `Ganho esperado`: **não existe** — R4 não promete rádio. É a única regra do
  catálogo que não fala de rádio, e o texto da terceira linha diz isso:
  "isto não muda o rádio; é sobre você conseguir ligar o computador."
  `[derivado da conta]`

**R5** e **R6** herdam texto de `energia_do_radio` e `energia_das_portas`, que
já existem; o que muda é a moldura (viram cards com selo) e o `Por que importa`
ganhar selo `medido aqui`.

**R2** herda o texto de PORTA-03/PORTA-04. Esta sprint não o reescreve.

### 5.4 A fronteira com a Frente C

O **modelo** de ordem é um só: uma `Ordem`, um selo, uma lista, um lugar que
decide o cabeçalho. As **regras** têm dono:

- topologia USB (R1–R6) → este módulo, `integrations/ordens_da_mesa.py`; <!-- ref-externa: nasce nesta sprint, ainda não existe -->
- ocupação de fatias (R7 e o que vier) → Frente C, e ela **importa** a `Ordem`
  daqui em vez de inventar a segunda.

Duas listas de ordens na mesma janela seriam o `verde-em-cima-de-vermelho` de
16/08 outra vez, em outra roupa.

---

## 6. Onde a ordem mora — e por que não dentro do exame

**Módulo novo: `src/hefesto_dualsense4unix/integrations/ordens_da_mesa.py`.** <!-- ref-externa: nasce nesta sprint, ainda não existe -->
100% stdlib, somente leitura, sem root, toda raiz por argumento (`CANARIO-FS-01`,
`tests/conftest.py`), pelas mesmas quatro razões do cabeçalho de
`exame_da_mesa.py:24-38`.

`exame_da_mesa.py` continua sendo a casa das **checagens**. Ele ganha um campo:

```python
@dataclass(frozen=True)
class Item:
    ...
    ordem: Ordem | None = None
```

e `como_dicionario()` ganha a chave `ordem` (aditivo — o `doctor.sh --censo`
só ganha campo). **`veredito()` não muda uma linha**: um segundo lugar decidindo
a cor do topo é exatamente como o verde volta a conviver com o vermelho
(`exame_da_mesa.py:557-585`, cicatriz de `6c86e295`).

Um `Item` com `estado != certo` **e** `ordem is not None` é o que a tela desenha
como card. Um `Item` sem ordem continua sendo uma linha.

---

## 7. "Já movi — reexaminar"

### 7.1 O que o botão faz

Roda o mesmo `reexaminar()` que já existe (`secao_exame.py:310-358`, worker +
`GLib.idle_add`, nunca na thread do GTK) e compara o **arranjo**.

`arranjo` é a assinatura do que a regra viu, e é escrita quando a ordem nasce:
o caminho de barramento do alvo mais o do vizinho que a acusou —
`4-1.1.2|3-1.1.4` para R1 hoje. Não carrega serial, não carrega MAC (§2.6).

### 7.2 As três respostas, e nenhuma delas é repetir a ordem

| o que a nova leitura diz | a tela |
|---|---|
| a regra não dispara mais | `● Confirmei: o aparelho de 5 Gbps saiu de perto do adaptador.` — **verde, e fica visível até ela sair da aba** |
| dispara com arranjo DIFERENTE | `▲ Você moveu, e continua apertado:` + o card novo, com o novo `O que eu vi aqui` |
| dispara com o MESMO arranjo | `○ Não vi mudança: o aparelho continua no mesmo buraco.` — o card **fica**, com essa linha somada |
| a tripla `(vid,pid,serial)` do alvo ficou ambígua | `○ Não consegui confirmar: há dois aparelhos iguais na mesa.` — **nunca "confirmei"** |

**Por que o "Confirmei" precisa ficar na tela:** um card que simplesmente some é
indistinguível de um card que nunca foi desenhado. É o F7 aplicado ao próprio
gesto dela — ela apertou um botão e precisa ver o que ele fez.

### 7.3 Enquanto o mapa 2D da Frente A não existe

A ordem cita **buraco**, não porta: "a segunda entrada de baixo do hub" não
existe como frase honesta sem o mapa. Sem mapa declarado, o texto é:

> `Mova o aparelho de 5 Gbps para uma entrada do próprio computador — há 9
> livres. Desenhe suas entradas na seção Conexões para eu dizer qual.`

Com mapa declarado, vira o que ela aprovou:
`Mova o Wi-Fi da porta 11 → traseira 4`.

**A dependência é dura e está declarada no `depois_de`.** A ordem funciona sem o
mapa; ela só não sabe apontar o dedo.

---

## 8. "Ignorar", e o estado "está tudo certo mesmo"

### 8.1 Onde a dispensa é gravada

`maquina.json`, dentro de `MesaDeclarada` (`utils/maquina.py:154`), porque
dispensar uma ordem é uma afirmação sobre a topologia **desta casa** — o mesmo
assunto de `radios` e `altura_da_antena`. `gui_preferences.json` é da JANELA, e
dar dois donos possíveis ao mesmo fato é o defeito que a T2 da
CONFIGURAÇÕES-FECHA-01 acabou de curar (`utils/maquina.py:235-243`).

```python
class OrdemDispensada(BaseModel):
    model_config = ConfigDict(extra="forbid")
    quando: str     # data ISO, só a data
    arranjo: str    # a assinatura do arranjo no momento da dispensa
```

`MesaDeclarada.ordens_dispensadas: dict[str, OrdemDispensada]`, chaveado pelo
slug da regra, com validador de chave no molde de `_chave_de_radio_e_vid_pid`
(`utils/maquina.py:167-177`) — sem ele o disco aceita lixo, porque
`extra="forbid"` não protege chave de dicionário.

### 8.2 Ela volta a aparecer?

**Sim, quando o arranjo muda — e é a única condição.** A dispensa vale para o
arranjo que ela viu; se ela mudar os cabos e a mesma regra disparar com um
arranjo novo, é fato novo e a ordem volta. Se nada mudou, a ordem fica calada e
**contada**:

> `● Nada a mudar. 1 recomendação você dispensou em 24/08.  [Ver]`

Dispensa que some sem deixar marca é a mesma classe de defeito do card que some:
ela deixaria de saber que existe uma decisão dela ali.

### 8.3 Os quatro cabeçalhos, e nenhum deles é "está tudo certo"

Derivados de `veredito()` mais duas contagens — **em uma função só**, no módulo:

| situação | o cabeçalho |
|---|---|
| há ordens | `▲ {N} mudança(s) recomendada(s)` |
| zero ordens, tudo respondeu | `● Nada a mudar. Conferi {N} coisas agora.  [Ver o que conferi]` |
| zero ordens, alguma checagem não soube | `○ Conferi {N} coisas; {M} não deram resposta.  [Ver quais]` — **cinza, nunca verde** |
| zero ordens novas, com dispensa dela | `● Nada novo. {N} recomendação(ões) você dispensou.  [Ver]` |

A queixa dela — *"o 'está tudo certo' não fala nada"* — é curada pelo NÚMERO e
pelo `[Ver]`: o estado bom passa a dizer **quanta coisa** foi conferida e a
abrir a lista. E o terceiro caso deixa de se disfarçar do segundo, que é o F7.

---

## 9. O que a ordem NÃO pode afirmar, e as medições que fechariam cada `derivado`

Cada uma é **dela**. Nenhuma foi executada por quem escreveu isto.

**W1 — o ganho de afastar o rádio de banda larga (fecha o `derivado` de R1).**
A/B no mesmo controle, mesmo adaptador, mesma distância, três janelas:

```bash
# 1. antes — o aparelho de 5 Gbps onde está hoje (soquete interno 2 do hub)
bash scripts/medir_w3_coex.sh
# 2. mova-o para uma entrada da traseira do computador (controladora 02:00.0)
# 3. depois — mesmo comando, mesmo controle, mesma cadeira
bash scripts/medir_w3_coex.sh
```

Enquanto W1 não roda, a terceira linha de R1 diz "não medido nesta máquina" e
**a ordem não promete nada**.

**W2 — quantas fatias custa um relatório (fecha o denominador de R7).**
`SLOTS_POR_RELATORIO = 1` é a hipótese conservadora da decisão R1 do PO
(`radio_da_mesa.py:112-116`). Só um `btmon` observando o tipo de pacote
negociado (2-DH1 / 2-DH3) fecha. **É bancada dela, e é Bluetooth vivo.**

**W3 — o teclado na BIOS (fecha o `derivado` de R4).** Sem comando: tire o hub
da tomada, ligue o computador, tente entrar no setup. Uma observação, e ela vale
mais que qualquer leitura de `/sys`.

**W4 — a citação do USB 3.0** (fecha o `especificação de terceiro` de R1). Não é
bancada: é ORDEM-7, e é achar e citar o documento. Hoje a afirmação está em duas
telas sem dono.

**O que nenhuma ordem pode dizer, com ou sem W1:**

1. que o aparelho de 5 Gbps está derrubando o Bluetooth dela — hipótese;
2. "Wi-Fi", enquanto a classe for `ff` e ela não tiver declarado (§2.5);
3. que um dongle atrapalha outro dongle (§5.3, contra-regra de R3);
4. qualquer número de milímetros, altura ou linha de visada — o guia é
   raciocínio, e ela já disse que não sabe o que essas palavras querem dizer;
5. o serial ou o endereço de nenhum aparelho (§2.6, e a tela vira PNG versionado).

---

## 10. As tarefas

### ORDEM-1 — o produto lê o buraco, não só o aparelho
**Cria:** `src/hefesto_dualsense4unix/integrations/portas_do_barramento.py`. <!-- ref-externa: nasce nesta sprint, ainda não existe -->
**O que muda:** um módulo que lê, por hub, `port/state`, `port/connect_type`,
`port/peer` e `port/over_current_count` de cada `{hub}:1.0/{hub}-portN`, e expõe:

- `soquetes(censo)` → um registro por buraco FÍSICO, já fundindo os dois lados do
  par `peer` (§2.3);
- `portas_livres(censo)` → soquetes `hotplug` com `not attached` nos dois lados;
- `mesmo_soquete_fisico(a, b)` e `mesmo_hub_fisico(a, b)`, que é o que faz R1
  enxergar através do `busnum`.

Módulo separado de `censo_do_barramento.py` **de propósito**: aquele arquivo é
`nao_toca` desta sprint e é território de PORTA-01 na leva vizinha (§11).
**A mordida:** `test_o_peer_costura_os_dois_lados_do_buraco` — fixture com o
lado 2.0 em `busnum` 3 e o lado 3.0 em `busnum` 4, ligados por `peer`;
`mesmo_hub_fisico` devolve `True`. Arrancar a leitura do `peer` faz devolver
`False` e o teste reprova. Segunda: fixture com `state=default` num soquete
vazio — ele **não** conta como livre; tratar `default` como livre reprova.
**Prova de tela:** nenhuma (não tem tela).

### ORDEM-2 — o selo nasce, e não existe linha sem ele
**Cria:** `integrations/ordens_da_mesa.py` — `Linha`, `Ordem`, os três selos e <!-- ref-externa: nasce nesta sprint, ainda não existe -->
`TEXTO_DO_SELO` (§4).
**A mordida:** `test_o_selo_de_procedencia_nunca_falta` varre, **por AST**, todas
as construções de `Linha` do módulo (o molde é `scripts/validar-fala-de-tela.py`,
que lê `NUMEROS_MEDIDOS_NO_MAPA` sem importar o módulo) e afirma: (a) todo `selo`
é um dos três; (b) todo `selo == ESPECIFICACAO_DE_TERCEIRO` traz `fonte` não
vazia. Tirar a `fonte` da linha do USB 3.0 reprova.
**Prova de tela:** nenhuma.

### ORDEM-3 — as seis regras de topologia
**Onde:** `integrations/ordens_da_mesa.py`, uma função pura por regra (R1–R6), <!-- ref-externa: nasce nesta sprint, ainda não existe -->
no molde de uma função por linha de `exame_da_mesa.py`.
**A mordida:** `test_ordens_da_mesa`, uma fixture por regra, e cada uma com o
negativo colado:

| teste | afirma | o que vê com a cura arrancada |
|---|---|---|
| `test_r1_ve_atraves_do_peer` | fixture da mesa dela (5 Gbps em `4-1.1.2`, BT em `3-1.1.4`) gera **uma** ordem R1 | devolver o corte por `busnum` → zero ordens |
| `test_r1_nao_chuta_wifi` | o texto da ordem **não contém** "Wi-Fi" com classe `ff` e sem declaração | ler `product` para nomear → a palavra aparece, reprova |
| `test_r2_nao_acusa_a_webcam` | fixture webcam 480 Mb/s colada ao dongle → **zero** ordens | tirar o filtro de PORTA-03 → uma ordem, reprova |
| `test_r3_nao_acusa_dongle_de_dongle` | três dongles no mesmo hub → zero ordens R3 | comparar dongle com dongle → três, reprova |
| `test_r3_calada_sem_buraco_livre` | fixture sem `hotplug` livre → a ordem nasce com `destino == ""` e **sem ação** | ignorar `portas_livres` → nasce com ação, reprova |
| `test_r4_cala_com_teclado_direto` | fixture com um teclado fora do hub → zero R4 | contar só teclados de hub → uma, reprova |
| `test_r5_r6_calam_nesta_bancada` | fixture com tudo `on` e `over_current_count=0` → zero ordens | inverter a comparação → duas, reprova |

**Prova de tela:** nenhuma (módulo).

### ORDEM-4 — o `Item` carrega a ordem, e o veredito não se move
**Onde:** `integrations/exame_da_mesa.py` — campo `ordem` em `Item`, chave nova
em `como_dicionario()`, e o `exame()` costurando o catálogo.
**A mordida:** `test_exame_da_mesa` ganha
`test_o_veredito_continua_com_um_dono_so` — um `Item` com `ordem` e
`estado=certo` **não** muda o veredito; e a busca por `veredito` fora de
`exame_da_mesa.py` continua devolvendo zero ocorrências em `app/`. Recalcular o
selo na seção reprova.
**Prova de tela:** nenhuma.

### ORDEM-5 — a seção publica cards em vez de cinco palavras
**Onde:** `app/actions/config/secao_exame.py` — a grade de `COLUNAS = 2` (`secao_exame.py:172`) vira
duas zonas: os cards de ordem em cima, a tira do que foi conferido embaixo. O
`_dica_do_item` **para de ser o único caminho da cura** para a tela.
**A mordida:** `test_a_cura_nao_mora_so_no_tooltip` — monta a seção com
`Gtk.OffscreenWindow` (nunca `Gtk.Window`: sob Xvfb ela fica 1×1 para sempre),
aplica um `Item` com `cura` e afirma que o texto da cura aparece em algum
`Gtk.Label` **fora** de qualquer tooltip. Devolver a cura só ao tooltip reprova.
Segunda: `test_a_tela_nao_publica_serial_nem_endereco` varre o markup montado
contra a regex de doze hex — pôr o serial no texto reprova.
**Prova de tela:** **precisa do olho dela ANTES.** Muda o que se vê ao abrir.

### ORDEM-6 — "Já movi" e "Ignorar"
**Onde:** `secao_exame.py` (os dois botões) e `utils/maquina.py`
(`OrdemDispensada` + `ordens_dispensadas` + validador de chave).
**A mordida:** `test_a_ordem_confirma_que_ela_moveu` — três passagens sobre a
MESMA fixture: (1) ordem nasce; (2) arranjo muda → a tela diz "Confirmei" e a
frase **fica**; (3) arranjo igual → diz "Não vi mudança" e o card **fica**.
Fazer o card sumir em silêncio na passagem (2) reprova. Quarta passagem:
duas triplas `(vid,pid,serial)` iguais → "Não consegui confirmar", nunca
"Confirmei". Quinta: `test_a_dispensa_volta_quando_o_arranjo_muda` — dispensa
gravada, arranjo mexido, a ordem reaparece; chavear a dispensa só pelo slug (sem
`arranjo`) reprova.
**Prova de tela:** **precisa do olho dela ANTES** (texto novo, dois botões).

### ORDEM-7 — a citação do USB 3.0 ganha um dono
**Cria:** `docs/protocol/por-que-usb3-atrapalha-24ghz.md` — uma página curta com <!-- ref-externa: nasce nesta sprint, ainda não existe -->
a fonte de terceiro, e o `fonte=` de R1 apontando para ela.
**Hoje a afirmação está em duas telas sem dono:** `mesa_de_radio.py`
(`_VELOCIDADE_USB3`) e `secao_mesa.py:269` (`_DICA_USB3_AO_LADO`).
**A mordida:** o portão de ORDEM-2 já reprova `fonte` vazia; este acrescenta
`test_a_fonte_do_selo_existe_em_disco` — a `fonte` de toda `Linha` com selo de
terceiro tem de ser um caminho que existe na árvore. Apagar a página reprova.
**NÃO ACHEI** a citação nesta árvore hoje; se ela não for encontrada, a linha
inteira sai do texto de R1 em vez de virar autoridade anônima.
**Prova de tela:** nenhuma (documento).

### ORDEM-8 — o estado bom sabe se dizer
**Onde:** `integrations/ordens_da_mesa.py` (a função do cabeçalho) e <!-- ref-externa: nasce nesta sprint, ainda não existe -->
`secao_exame.py` (o selo do topo, que hoje tem quatro frases fixas em
`FRASE_DO_SELO`, `secao_exame.py:78-83`).
**A mordida:** `test_o_estado_bom_nao_e_o_estado_vazio` — quatro fixtures, os
quatro cabeçalhos da §8.3, e a afirmação de que **as quatro frases são
distintas duas a duas** e a do `nao_sei` **não é verde**. Colapsar o terceiro
caso no segundo reprova.
**Prova de tela:** **precisa do olho dela ANTES** (as quatro frases são texto novo).

---

## 11. A posse e as colisões

O frontmatter no topo é o contrato. Cinco colisões, e as cinco são reais.

**C1 — `integrations/exame_da_mesa.py` e `app/actions/config/secao_exame.py`,
com PORTAS-DA-CASA-01 (PORTA-04, PORTA-05, PORTA-06).** É a colisão dura.
PORTA-04 reescreve `DICAS_DAS_LINHAS`, que o meu ORDEM-5 esvazia; PORTA-05 cria
uma sexta LINHA de exame que o meu catálogo modela como ORDEM; PORTA-06 acrescenta
corrente à linha de energia, que é o meu R6.
**Resolução sugerida:** PORTA-01/02/03/07/08/09 seguem com PORTAS-DA-CASA-01 —
elas são leitura e não tela. **PORTA-04, PORTA-05 e PORTA-06 são ABSORVIDAS por
esta sprint** (mesmo conteúdo, casa melhor: viram R2, R1/R3 e R6). Quem coordena
decide; o que **não pode** é as duas levas editarem `secao_exame.py` no mesmo dia.

**C2 — `integrations/censo_do_barramento.py`.** PORTA-01 quer acrescentar
`state`, `peer`, `connect_type`, `maxchild` lá dentro. Eu **não toco** o arquivo:
ORDEM-1 cria `portas_do_barramento.py` ao lado, que só CONSOME o `Censo`. <!-- ref-externa: nasce nesta sprint, ainda não existe -->
**Resolução sugerida:** se PORTA-01 rodar primeiro, ORDEM-1 encolhe para as três
funções de topologia e lê os campos de lá. Se rodar depois, PORTA-01 encontra os
campos já lidos e vira nada. Nos dois caminhos ninguém edita o arquivo do outro.

**C3 — `utils/maquina.py`, e o dono declarado é a Frente A.** A
CONEXÕES-MAPA-2D-01 põe o arquivo no `posse:` dela (MAPA-A); eu preciso de UM
campo lá, `MesaDeclarada.ordens_dispensadas` (§8.1). PORTA-09 quer um terceiro
campo no mesmo esquema (`RadioDeclarado.tipo` separando "de cabo" de "sem fio").
A Frente C declara `utils/maquina.py` em `nao_toca`, então são três e não quatro.
**Resolução sugerida:** **a Frente A escreve o campo**, com o corpo da §8.1 —
são doze linhas e um validador de chave no molde do `_chave_de_radio_e_vid_pid`
que ela já vai estar editando. Se ela recusar, ORDEM-6 faz `Edit` cirúrgico
DEPOIS de MAPA-A fechar. O que **não pode** é dois agentes reescreverem
`MesaDeclarada` inteira no mesmo dia.

**C4 — `integrations/mesa_de_radio.py`, e há DUAS levas o querendo.** A Frente A
o põe no `posse:` (MAPA-B, `vizinhancas_apertadas` para porta-filha) e propõe,
por escrito, que *"a vizinhança fica com esta frente, e a Frente B consome
`mapa_das_portas.vizinhas_de_verdade`"*. PORTA-03 quer o MESMO corpo da mesma
função.
**Resolução sugerida:** **aceito a proposta da Frente A sem ressalva** — eu já
declarei o arquivo em `nao_toca`, e as minhas R1/R2 passam a consumir
`vizinhas_de_verdade`. Mas isso deixa **PORTA-03 e MAPA-6 disputando a mesma
função**, o que é colisão entre duas levas que não se declararam uma à outra.
**É a decisão mais urgente para quem coordena, e não é minha.**

**C5 — `integrations/mapa_das_portas.py` (Frente A) e <!-- ref-externa: nasce nesta leva, ainda não existe -->
`integrations/portas_do_barramento.py` (ORDEM-1) leem o mesmo buraco.** A Frente <!-- ref-externa: nasce nesta leva, ainda não existe -->
A expõe `portas_livres(mapa, censo)`; eu exponho `portas_livres(censo)`. A
diferença é o insumo: a dela precisa do mapa DECLARADO por ela, a minha sai só
do `peer`/`state` do sysfs — e é por isso que R1 dispara hoje, antes de ela
desenhar coisa nenhuma. <!-- ref-externa: nasce nesta sprint, ainda não existe -->
**Resolução sugerida:** duas camadas, uma régua. `portas_do_barramento.py` é a <!-- ref-externa: nasce nesta leva, ainda não existe -->
camada de sysfs; `mapa_das_portas.py` traduz o resultado dela para o número que <!-- ref-externa: nasce nesta leva, ainda não existe -->
ela enxerga, **em vez de reimplementar a contagem**. Duas réguas independentes
para "buraco livre" é `PORTÕES-EM-SÉRIE-ENGANAM` esperando acontecer.

**Sem colisão:** `secao_mesa.py` (Frente A), `secao_orcamento.py` e
`radio_da_mesa.py` (Frente C), `censo_do_barramento.py` (ninguém o tem em
`posse:`).

---

## 12. Qual pergunta de Bluetooth trava esta sprint

**Nenhuma.** Nada aqui abre `/dev`, fala com o daemon, para o daemon, ou toca no
rádio — o catálogo inteiro sai de `/sys`, sem root, e as duas medições de rádio
(W1 e W2) só decidem se a terceira linha de duas ordens deixa de dizer
"não medido nesta máquina". **A sprint entrega inteira sem elas**, e entrega
honesta: uma ordem que não promete ganho é uma ordem, não um palpite.

O que trava é OUTRA coisa, e não é Bluetooth: **o mapa 2D da Frente A**. Sem ele
a ordem manda ("mova para uma entrada do computador") mas não aponta ("porta 4").

---

## 13. As perguntas que só ela responde

1. **PORTA-04/05/06 são absorvidas por esta sprint, ou PORTAS-DA-CASA-01 roda
   primeiro e eu construo em cima?** Trava a §11/C1: as duas levas escrevem
   `secao_exame.py`.
   Caminhos: `absorver aqui` | `PORTAS-DA-CASA-01 primeiro, esta em cima` |
   `PORTAS-DA-CASA-01 perde as três tarefas de tela e fica só com leitura`.
2. **Ordem dispensada por ela volta quando o arranjo muda — ou nunca mais?**
   §8.2 propõe "volta"; é decisão de produto, não de código.
   Caminhos: `volta quando o arranjo muda` | `nunca mais, até ela reativar` |
   `volta depois de N dias`.
3. **A terceira linha ("Ganho esperado: não medido") aparece mesmo quando o
   ganho não foi medido, ou some?** Mostrá-la é honesto e custa uma linha de
   tela em toda ordem.
   Caminhos: `sempre visível` | `só no tooltip enquanto não houver medição` |
   `some, e o selo do card diz "sem medição"`.
4. **R4 (o teclado só no hub) entra?** Ela não fala de rádio nenhum — é a única
   regra do catálogo que fala de ligar o computador.
   Caminhos: `entra` | `fica fora do MVP` | `entra, mas em outra seção`.

---

## 14. O que sobrou para o próximo

- **A regra de ocupação (R7)** — é da Frente C, e ela importa a `Ordem` daqui.
- **A porta-filha do extensor** (`15 → 15a`, decisão dela) — a assinatura de
  `arranjo` vai precisar dela quando o mapa 2D existir, porque hoje o extensor é
  invisível por física e dois dongles no mesmo buraco declarado são
  indistinguíveis para o `arranjo`.
- **O Pro Controller e o 8BitDo** — 1.0, decisão dela de hoje.
- **`hciN` → serial sem D-Bus:** a §2.6 mediu que dá, de graça, e a decisão
  `D-HCI1-BLOQUEADO` (`docs/data/decisoes-dela.csv`) está chaveada pelo número
  que inverte. Rechavear é uma linha, e não é desta sprint.
- **O `location` das portas do hub veio `0x00000000` nas oito** — o hub não
  publica posição. Só reforça o que a Frente A já decidiu: o mapa é declarado,
  não deduzido.
