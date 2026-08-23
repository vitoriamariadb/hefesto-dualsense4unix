# LUZ-CEGA-01 — a barra apagada, e o exame que não olha o rádio

**22/08/2026.** Auditoria do caminho da luz sob a pergunta dela:

> *"todas as nossas soluções provavelmente foram tão fechadas a ponto de
> considerarmos somente os nossos componentes locais (...) vai ficar pra sempre
> naquela de 'poxa, não sei pq não deu certo no seu pc, no meu funciona de
> boa'."*

E sob a queixa que abriu a leva:

> *"estranho que mesmo o lightbar que mapeamos tudo (...) o lightbar no modo BT
> deveria ser sempre aceso. Mas os 4 controles o lightbar tá apagando."*

**Estado:** ABERTA. Fechadas: E1, E2, E7 e a METADE segura da E5 — todas com
teste que morde. Abertas: E3, E4, E6 e E8 (as três primeiras dependem do olho ou
da palavra dela; a E6 esbarrou numa decisão medida, ver a nota lá embaixo).

**Território:** `core/led_control.py`, `core/sysfs_leds.py`,
`core/lightbar_gatilho.py`, `core/lightbar_reset.py`,
`daemon/ipc_handlers.py` (o bloco de lightbar), `daemon/subsystems/identity.py`,
`scripts/doctor.sh`. **Não tocados** (outra leva na árvore):
`daemon/launch_env.py`, `install.sh`, `uninstall.sh`,
`scripts/bt_ponte_privilegiada.sh`, `integrations/censo_do_barramento.py`,
`integrations/apelido_do_dongle.py`.

---

## Como isto foi medido

Três instrumentos, e nenhum deles é o próprio produto — a casa já pagou caro por
régua que mente:

1. **`btmon`** — os bytes no fio, decodificados contra o layout do
   `dualsense_output_report_common` (`common[1]` = valid_flag1,
   `common[43]` = número do jogador, `common[44..46]` = cor). É a única régua
   deste caminho que não é o registrador que o próprio produto escreveu.
2. **`fuser` em `/dev/hidraw*`** — quem SEGURA cada nó, medido fora do produto.
3. **O sysfs cru** (`/sys/class/leds/*:rgb:indicator/multi_intensity`) lido lado
   a lado com o `daemon.state_full`, para separar o que o produto afirma do que
   o kernel guarda.

**776 reports `0x31` capturados no fio** em quatro janelas, incluindo um
restart completo do daemon com a adoção dos quatro controles.

---

## A resposta curta às cinco perguntas

| Pergunta | Resposta | Grau |
|---|---|---|
| O que `disputada=True` significa, e quem é o disputante? | A Steam SEGURA os oito `hidraw` (4 físicos + 4 vpads). O campo está certo sobre o `fd` — e induz a conclusão errada sobre a ESCRITA. | MEDIDO |
| Quem escreve a luz por rádio, e por qual rota? | **Nós.** Duas rotas: sysfs (kernel monta o `0x31`) e hidraw avulso (`lightbar_gatilho`). Nas duas, `valid_flag1` liga só o bit da cor. | MEDIDO |
| A cura é por adaptador ou global? | **Nem uma nem outra: é por CONTROLE, endereçada por MAC.** O caminho da luz NÃO tem a doença do `hci0`. | MEDIDO |
| O sysfs tem os nós dos quatro? | Tem os nós de OITO — os quatro dela e os quatro do nosso próprio vpad. | MEDIDO |
| A luz apaga sozinha com o tempo? | **Não consegui medir** (ver §"o que não deu para medir"). | — |

---

## O que a medição derrubou logo de cara

**A Steam não está repintando a barra em regime.** Ensaio de eliminação, com o
`btmon` rodando e a Steam viva o tempo todo:

| Janela de 32 s | Reports de saída no fio |
|---|---|
| daemon **parado** | **1** |
| daemon **rodando** | **426** (81 de cor, 288 de número, 57 outros) |

Quem inunda o rádio somos nós, numa proporção de 426 para 1. A hipótese
"a Steam apaga a barra" explica mal o que já funcionava: com a Steam aberta o
dia inteiro, a barra passa horas acesa. A hipótese que explica os dois lados é
a que a própria casa mediu em 22/07 e escreveu no
`backend_pydualsense.py:2390-2394` — **reengatar a máquina de estados da
lightbar EM REGIME trava a exibição no firmware: "o registrador aceita a cor, o
sysfs mostra, a barra fica apagada"**. É a descrição literal do que ela está
vendo, e a variável que mudou desde então é o VOLUME de escrita.

Isso não é prova. É a hipótese que sobra depois da eliminação, e o E3 abaixo é
o ensaio que a fecha ou a derruba.

---

## Os achados, em ordem de custo do silêncio

### F1 ● MEDIDO — o exame de LED se declarava cego em toda mesa de rádio

`scripts/doctor.sh:596` (antes da cura):

```bash
[[ "${dev_real}" == */devices/virtual/* ]] && continue   # vpad do daemon
```

O critério era o CAMINHO. E o caminho não separa nada: o BlueZ moderno entrega
HID por `uhid`, que é um `misc` **virtual**. Um DualSense de Bluetooth mora em

```
/sys/devices/virtual/misc/uhid/0005:054C:0CE6.0028/leds/input259:rgb:indicator
```

byte a byte na mesma forma do nosso vpad
(`.../uhid/0003:054C:0DF2.002F/leds/input289:rgb:indicator`).

**Medido nesta bancada, com QUATRO DualSense no rádio e os quatro
`multi_intensity` graváveis:**

```
       sem DualSense físico com nó de LED agora (só o controle virtual, ou nenhum)
       — pulo o teste de gravabilidade; conecte o controle p/ validar a regra 77
```

Zero de quatro. **Quem usa cabo via este check rodar; quem usa rádio, nunca** —
e a cor é justamente o que falha no rádio. Ela abre o doctor exatamente quando a
luz não sai, e o único check que olha o LED respondia "não tem controle aqui".

*Isto quebraria na máquina de outra pessoa?* Quebra na de **toda** pessoa cujo
BlueZ usa `uhid`, que é o default moderno — e quebra em silêncio, com uma frase
que parece benigna.

**Curado nesta leva (E1).** O critério passou a ser a IDENTIDADE:
`HID_PHYS=hefesto-vpad`, a mesma marca que `broker/hidraw_broker.py:91`,
`integrations/cor_do_plastico.py:176` e `integrations/uhid_gamepad.py:576` já
usam. Depois:

```
[ OK ] nó de LED do DualSense físico GRAVÁVEL pelo usuário (input259:rgb:indicator
       input262:rgb:indicator input266:rgb:indicator input270:rgb:indicator)
```

Quatro de quatro.

**Nota de método, que é o achado dentro do achado:** o teste que já cobria esta
função (`tests/unit/test_doctor_nao_afirma_efeito.py:120`) montava a cena com o
device sob `pci0000:00` — ou seja, **só exercitava o cabo**. O ponto cego estava
nos dois lados, e é por isso que sobreviveu.

---

### F2 ● MEDIDO — o produto responde pelo que ESCREVEU, e a tela nomeia o culpado errado

O `state_full` afirmava os quatro acesos, com `lightbar_disputada=True` nos
quatro. Os dois campos estão tecnicamente corretos e juntos contam uma mentira.

**`disputada=True` está certo.** Medido com `fuser`:

```
/dev/hidraw6..9   (os quatro DualSense)  steam(600105)  hefesto-dualsen(833705)
/dev/hidraw11..14 (os quatro vpads)      steam(600105)
```

A Steam segura os oito. O critério de `daemon/ipc_handlers.py:3214` não é largo
demais — são quatro disputantes de verdade, e o mesmo processo.

**O que a tela conclui disso está errado.** `app/widgets/controller_card.py:1137`
traduz o booleano para *"a Steam também escreve"*. Segurar não é escrever, e a
medição de 426-contra-1 acima diz que quem escreve somos nós. A pessoa lê "a
Steam roubou a luz", vai mexer na Steam, e o defeito não está lá.

O campo `lightbar_source="sysfs"` completa o serviço: ele é definido como "a
leitura da classe LED é a verdade", e o próprio `core/sysfs_leds.py:92-104`
explica, por extenso, que `multi_intensity` é **o último valor escrito via
classe LED**, nunca o aceso.

*Isto quebraria na máquina de outra pessoa?* Quebra em qualquer uma — e F6
mostra que na máquina SEM Steam ele quebra do jeito oposto, mudo.

**Custo da cura:** médio. Não é apagar o campo; é a tela dizer o que ele mede
("a Steam tem o controle aberto") em vez do que ele não mede ("a Steam também
escreve"). Uma linha de texto e o teste que a trava.

---

### F3 ● MEDIDO — cada mudança de cor custa DOIS quadros de rádio; cada número, CINCO

`core/sysfs_leds.py:213-215`:

```python
ok = self._write(self._indicator_brightness, "255")
ok = self._write(self._multi_intensity, f"{r} {g} {b}") and ok
```

Duas escritas na classe LED = **dois output reports** do kernel. E
`core/sysfs_leds.py:229-240` (`set_players`) escreve um nó por lâmpada:
**cinco reports** para acender um número.

Medido no fio, um reassert de rotina em UM controle:

```
t=19.320  hci0  vf1=0x04  RGB=(0,0,153)     <- brightness
t=19.320  hci0  vf1=0x04  RGB=(0,0,153)     <- multi_intensity (idêntico)
t=19.320  hci0  vf1=0x10  player=0x04       )
t=19.320  hci0  vf1=0x10  player=0x04       )  cinco vezes o
t=19.320  hci0  vf1=0x10  player=0x04       )  MESMO byte
t=19.320  hci0  vf1=0x10  player=0x04       )
t=19.323  hci0  vf1=0x10  player=0x04       )
```

Sete quadros onde UM bastaria — e a casa **já tem** o "um": o
`core/lightbar_gatilho.build_bt_lightbar_report` monta cor + número no MESMO
report (`valid_flag1 = 0x04 | 0x10`), e o comentário dele diz por quê: *"fazer
duas seria dobrar a chance de cair no meio de uma rajada nova"*. Medido no fio,
o gatilho gasta exatamente 4 reports para os 4 controles; a rota de rotina gasta
28 pelo mesmo resultado.

*Isto quebraria na máquina de outra pessoa?* **Piora com o tamanho da mesa e com
a qualidade do rádio.** O custo é 7×N quadros por reconciliação. E o rádio dela
já está saturado — o `dmesg` mostra `DualSense input CRC's check failed` nos
quatro, em regime.

**Custo da cura:** médio-alto. Não é trocar `set_rgb`: é decidir se a rota de
rotina passa a usar o report único do gatilho (uma escrita, duas luzes) em vez
da classe LED. Isso mexe na política LIGHTBAR-BT-NEVER-01 e **é decisão dela** —
a classe LED é o que faz a cor funcionar igual em cabo e rádio.

---

### F4 ● MEDIDO — vinte minutos sem perfil nenhum, e a luz mandando ver assim mesmo

Medido às 20:11, com o daemon de pé desde 19:51:

```
active_profile = None
d42f4b0000d8  slot=2  on=True  rgb=[255,   0,   0]  fonte=sysfs
143a9a0000ab  slot=3  on=True  rgb=[  0, 255,   0]  fonte=sysfs
444648000003  slot=1  on=True  rgb=[  0,   0, 255]  fonte=sysfs
a0fa9c0000f0  slot=4  on=True  rgb=[255,   0, 128]  fonte=sysfs
```

Essas quatro cores são o `_PLAYER_SLOT_COLORS` de `core/led_control.py:186-195`
**a brilho 1.0**. O perfil que o autoswitch tinha ativado antes do restart
(`Navegação`) diz:

```json
"lightbar_brightness": 0.4,  "auto_player_colors": false
```

Ou seja: o perfil pede **paleta automática DESLIGADA e brilho 40%**, e o
hardware recebe **a paleta automática a 100%**.

A causa está em duas linhas honestas que se somam mal:
`daemon/subsystems/identity.py:522-524` nasce com
`_auto_colors = True, _auto_brightness = 1.0`, e o único lugar que chama
`configure()` é a ativação de perfil (`profiles/manager.py:502`). Enquanto
nenhum perfil ativar, valem os defaults do construtor — e o boot pulou o
restore de propósito (`last_profile_restore_pulado_perfil_de_janela
name=Sackboy`), porque perfil de janela é do autoswitch.

A janela entre "o daemon subiu" e "o autoswitch viu uma troca de foco" **não tem
teto**. Nela, a luz contradiz todo perfil salvo — e o `state_full` reporta a
cor errada como `fonte=sysfs`, isto é, como verdade.

*Isto quebraria na máquina de outra pessoa?* Sim, e mais nela do que aqui: a
mesa dela tem trocas de foco o tempo todo. Quem liga o PC, não mexe na janela e
olha o controle vê a cor que o produto inventou.

**Custo da cura:** baixo-médio. O caminho de start já sabe qual era o perfil
(ele o nomeia no log para dizer que o pulou); falta `configure()` com os valores
desse perfil mesmo quando a ATIVAÇÃO fica para o autoswitch. **É decisão dela**
se "pular o restore" deve mesmo pular também o brilho e a paleta.

---

### F5 ● MEDIDO — uma cor global apagou a paleta dos quatro, e o sysfs jurou que estava certo

Às 19:48, com os quatro conectados e cada um com a sua cor:

```
input259:rgb:indicator: 0 255 255
input262:rgb:indicator: 0 255 255
input266:rgb:indicator: 0 255 255
input270:rgb:indicator: 0 255 255
```

Quatro controles, quatro cores configuradas, **um ciano idêntico nos quatro**.
Nesse instante o `state_full` teria dito, dos quatro, `fonte=sysfs` — a etiqueta
que significa "esta é a verdade".

É o defeito que o `reassert_resolved_outputs` foi escrito para curar
(`backend_pydualsense.py:4682-4690`: *"a ativação de perfil termina num
broadcast do GLOBAL que pisa a paleta automática"*), aparecendo de novo com o
broadcast chegando por ÚLTIMO.

*Isto quebraria na máquina de outra pessoa?* Sim, e é invisível para quem tem um
controle só — com N=1 "a cor global" e "a cor do controle 1" parecem a mesma
coisa. **Só uma mesa com dois ou mais controles revela.** É o retrato exato da
preocupação dela, invertido: aqui o hardware dela é o que EXPÕE o defeito.

**Custo da cura:** não estimado — não isolei o disparo. É o E4.

---

### F6 ● LIDO — o sentinela só conhece a Steam

`core/escritor_cru.py:54-58`, na letra do autor:

> *"**Só reconhece a Steam.** A varredura é restrita aos PIDs dela (...) Um
> segundo escritor cru — um jogo fora do Steam, outro daemon de controle — passa
> despercebido."*

A limitação está declarada, o que é correto. O problema é o efeito no produto:
numa máquina com **Lutris, Heroic, GOG, itch, um jogo nativo, ou outro daemon de
controle** (`dualsensectl`, `ds4drv`), `lightbar_disputada` é um **False
constante** — e a única explicação que a GUI sabe dar para "minha barra sumiu"
nunca aparece.

Na mesa dela a Steam está sempre aberta, então o campo está sempre certo. É
literalmente o formato "no meu funciona de boa": não é que o código erre aqui —
é que aqui ele nunca é exercitado no ramo em que erra.

`escritor_cru.py:101` também amarra a detecção a `pgrep -f steamrt64/steam` e
`pgrep -x steam`. Steam em **Flatpak** ou **Snap** pode não casar nenhum dos
dois — **SUSPEITO**, não medi (não tenho as duas embalagens nesta máquina).

**Custo da cura:** médio. Não é varrer `/proc` inteiro (caro e indiscreto, e o
autor já explicou por quê). É separar "ninguém segura" de "não sei dizer" — o
mesmo remédio do ELO-MUDO-01, aplicado a um booleano que hoje só sabe dizer sim.

**Não executada nesta leva, e por uma razão de sequência (22/08).** O terceiro
estado não cabe no canal que existe: `lightbar_disputada` é um booleano do
`state_full`, e tanto o campo quanto a frase que o documenta
(`daemon/ipc_handlers.py:2982-2988`, *"hoje só a Steam é reconhecida"*) moram no
handler. Alargar a sonda ANTES disso trocaria uma mentira por outra — a tela
diria "a Steam tem este controle aberto" para quem tem Lutris. A ordem certa é:
primeiro o campo aprende a dizer QUEM (ou "não sei"), depois a sonda aprende
outros escritores. O teste da E2 já é o cão de guarda dessa ordem: ele reprova
se a sonda passar a reconhecer alguém fora da Steam com a frase intacta.

---

### F7 ● MEDIDO — o `discover()` devolve os nós do nosso próprio vpad

`core/sysfs_leds.py:293-320` varre `*:rgb:indicator` e devolve **oito** nós nesta
bancada: os quatro DualSense (`0005:054C:0CE6.*`) e os quatro vpads
(`0003:054C:0DF2.*`, `HID_UNIQ=02:fe:00:00:00:0N`).

No backend isso é inofensivo — `_refresh_sysfs_leds` casa **só por MAC** e o
comentário em `backend_pydualsense.py:2334-2338` diz que o fallback
single-controle foi removido de propósito. **Este é um caso em que a casa já
acertou**, e vale registrar: se o fallback "se só há um nó, é esse" ainda
existisse, uma máquina com UM controle teria DOIS nós (o dele e o do vpad) e o
produto poderia pintar o vpad.

O que sobra: a regra `assets/77-dualsense-leds.rules:32` faz `chmod 0666` também
nos nós do nosso vpad (inócuo), e o doctor caiu (F1).

**Custo da cura:** nenhuma cura necessária. Fica como nota.

---

### F8 ● MEDIDO — quatro MACs de FIXTURE moram no `controllers.json` vivo dela

`~/.config/hefesto-dualsense4unix/controllers.json`, agora:

| rank | addr | |
|---|---|---|
| 1 | `444648000003` | dela |
| 2 | `aabbcc000002` | **fixture** |
| 3 | `aabbcc000001` | **fixture** |
| 4 | `aabbcc000003` | **fixture** |
| 5 | `aabbcc000004` | **fixture** |
| 6 | `d42f4b0000d8` | dela |
| 7 | `143a9a0000ab` | dela |
| 8 | `a0fa9c0000f0` | dela |
| 9 | `e0f6b5000053` | o Pro |

`aa:bb:cc` é a faixa sintética que as regras desta casa mandam usar em fixture.
Quatro controles que nunca existiram ocupam os postos 2 a 5 e empurram os
DualSense reais dela para 6, 7 e 8.

No caminho da luz isso importa porque `player_slot_color` só tem as cores do PS5
em 1..4: **6 = ciano, 7 = laranja, 8 = roxo, ≥9 = BRANCO**
(`core/led_control.py:186-201`). E branco apareceu no fio, nos quatro controles,
durante a adoção — `RGB=(255,255,255)` em `t=51.235` e `t=67.549`.

**A ligação entre as duas coisas é SUSPEITO, não medido**: hoje o `slot_for`
compacta entre os presentes (o `state_full` mostra 1..4), então o branco pode ter
outra origem. O que É medido: os fixtures estão no arquivo dela, e o branco
esteve no fio.

*Isto quebraria na máquina de outra pessoa?* Só se a suíte rodar lá — mas é
exatamente o padrão de "a suíte cria teclados de verdade": **teste escrevendo no
config real da máquina**.

**Correção medida (22/08, execução da leva): a suíte de unidade NÃO é a
suspeita.** `tests/conftest.py:1494-1538` isola `XDG_CONFIG_HOME` (e data/cache/
state) num tmp por teste, `autouse` e sem condição — é a BUG-TEST-CONFIG-LEAK-01,
e ela cobre `identity._path()`, que resolve por `utils.xdg_paths.config_dir()`. E
o `aa:bb:cc` não sai do produto: não existe em `src/` fora de docstrings, então
não é o FakeController. Quem escreveu ainda é desconhecido, e a busca fica com
duas pistas: (1) as ferramentas de shell da suíte ESCAPAM mesmo — o journal dela
tem `hefesto-bt-autorestore[…]: bond de AA:BB:CC:00:00:03 restaurado` em 15/08,
ou seja, teste de script rodando contra o sistema vivo; (2) o `XDG_RUNTIME_DIR`
é deliberadamente NÃO isolado (mesma fixture, linha 1519), então um teste que
não isole o nome do socket IPC fala com o **daemon vivo dela** — e é o daemon
vivo que grava o `controllers.json`.

**Custo da cura:** duas partes. Limpar o arquivo dela é um comando e **é decisão
dela** (é o dado dela). Impedir a reincidência é achar quem escreveu — não
investiguei; está fora do território desta leva.

---

### F9 ● documentação — o `0x08` é "A CURA" num arquivo e "o CULPADO" no outro

Vivos ao mesmo tempo na árvore:

- `core/lightbar_reset.py:12-16` — *"**A CURA** (...): enviar UM report de output
  0x31 bem-formado com `valid_flag1 = 0x08`"*;
- `core/backend_pydualsense.py:2387-2389` — *"o LIGHTBAR-BT-CULPADO-01 (03/08)
  correlacionou 7 de 7 o latch com o `0x08` (RELEASE_LEDS) que NÓS mandávamos na
  janela, e ele saiu do código em `108b711` (04/08)"*.

Medido no fio, como controle desta afirmação: **0 de 776 reports** carregaram
`RELEASE_LEDS` (0x08) ou `LIGHTBAR_SETUP` (valid_flag2 0x02). O código está
coerente com a decisão de 04/08 — quem não está coerente é o texto. Pela regra
dela (*fato errado se SUBSTITUI*), o cabeçalho do `lightbar_reset.py` precisa
dizer que aquilo é a cura MANUAL de último recurso (`hefesto lightbar-reset` /
IPC `lightbar.reset`), e que o envio automático foi medido como nocivo e saiu.

**Custo da cura:** baixo. É um parágrafo, e não custa nada além de escrevê-lo.

---

## O achado NEGATIVO, que é o que ela pediu para saber

### O caminho da luz NÃO tem a doença do `hci0` ● MEDIDO

O `bt_active_mode.sh:86` escolhe UM adaptador com `head -1` e erra a mesa dela.
A pergunta desta leva era se a luz faz o mesmo. **Não faz.**

Medido no fio, num único reassert, os quatro controles nos TRÊS adaptadores
sendo escritos no mesmo milissegundo:

```
t=19.320118  hci2  RGB=(153,   0,   0)
t=19.320460  hci1  RGB=(153,   0,  76)
t=19.320030  hci0  player=0x04
t=19.323286  hci2  RGB=(  0, 153,   0)
```

O endereçamento é por **MAC do controle**, do começo ao fim: `discover()` indexa
por `HID_UNIQ` (`core/sysfs_leds.py:326-345`), `_refresh_sysfs_leds` casa por MAC
normalizado e **recusa o casamento sem MAC de propósito**, e o gatilho itera por
`key`. Não há `hci` nenhum no caminho da luz — nem no código, nem no fio. O
adaptador é escolhido pelo kernel a partir da conexão, que é onde essa escolha
deve morar.

**Uma pessoa com um adaptador, com cinco, ou com um Intel em vez de Realtek
recebe o mesmo comportamento.** O que muda com a mesa é o VOLUME de escrita
(F3), não o endereço.

---

## As entregas

### E1 ● FECHADA — o doctor enxerga o controle do rádio

`scripts/doctor.sh` — o filtro do vpad deixou de ser por caminho
(`*/devices/virtual/*`, que come todo Bluetooth) e passou a ser por identidade
(`HID_PHYS=hefesto-vpad`). A busca do device sem o link `device` passou a usar a
MESMA conta do `core/sysfs_leds.py:discover` (dois `dirname`), de propósito: duas
réguas que discordam sobre onde está o device já custaram caro nesta casa.

**Teste que morde:** `tests/unit/test_o_doctor_enxerga_a_luz_do_radio.py`, cinco
casos, e a mordida foi conferida nos dois sentidos:

| cura arrancada | reprova |
|---|---|
| filtro por caminho de volta | 3 de 5 — e a saída é literalmente a frase que a bancada imprimia |
| filtro removido de todo | 2 de 5 — o vpad volta a ser contado como controle dela |

Antes: `0` de 4 na bancada. Depois: `4` de 4.

**Custo:** pago.

### E2 ● FECHADA — a tela para de acusar a Steam de escrever

F2. O rótulo virou a constante `ROTULO_LIGHTBAR_SEGURADA` em
`app/widgets/controller_card.py`: **"A Steam tem este controle aberto"** — o que
o `fuser` mediu, e nada além.

**Teste que morde:** `tests/unit/test_a_tela_nao_acusa_a_steam_de_escrever.py`,
quatro casos. Devolvendo a frase antiga reprovam 3 (contando o caso irmão em
`test_escritor_cru_01_…`); trocando por um rótulo genérico sem a Steam reprova
1 — o caso que amarra a frase ao ALCANCE da sonda, e que obriga a F6 a trocar as
duas coisas na mesma leva. A régua se valida sozinha: um caso cobra que o
detector de acusação reprove a frase que existiu de verdade.

**Ainda é decisão dela:** a frase. Está escrita num só lugar, e trocá-la é uma
linha.

### E3 ○ ABERTA — o ensaio que fecha ou derruba a hipótese do volume

O experimento é barato e conclusivo, e precisa do olho dela: com os quatro no
rádio, (a) medir o estado; (b) parar o daemon e mandar UM report de cor por
`hidraw` em cada controle; (c) ela olha. Se a barra acende com escrita esparsa e
não acende com o daemon vivo, o culpado é o volume (F3) e o E5 vira prioridade.
**Custo:** ~20 min, e a palavra é dela. **Decisão dela:** quando.

### E4 ○ ABERTA — o global que apaga a paleta dos quatro

F5. Falta isolar o disparo (o ciano nos quatro). **Custo:** não estimado.

### E5 ▲ METADE FECHADA — um quadro a menos por cor, sem trocar de rota

F3. A parte que **não** depende de decisão dela foi entregue: `set_rgb` só
escreve `brightness` quando ele DIVERGE de 255. Os dois quadros que o `btmon`
mediu no mesmo milissegundo eram byte a byte iguais — o output report carrega o
estado inteiro do LED, então o quadro do `brightness` já levava a cor nova.
Cada troca de cor passou de **2 quadros para 1**; com `brightness` divergente
(um terceiro apagou pela classe) ou ilegível (nó sumindo), escreve como sempre e
na mesma ordem. Mesma disciplina do `set_players_verified` (NUMA-03), que já
fazia isto para os LEDs de jogador.

**Teste que morde:** `tests/unit/test_um_quadro_a_menos_por_cor_no_radio.py`,
sete casos — e o que ele trava, além da contagem, é a PARIDADE: o estado que o
kernel enxerga no fim é byte a byte o de antes. Devolvendo a escrita
incondicional reprovam 2; arrancando-a de vez reprovam 2 (a barra apagada por um
terceiro nunca mais reacenderia).

**Continua ABERTA e é decisão dela** a troca de ROTA — a rotina passar a usar o
report único do `lightbar_gatilho` (cor + número num só quadro, 5 quadros de
`set_players` viram 0). Isso mexe na LIGHTBAR-BT-NEVER-01 e tem preço: sair da
classe LED é sair do que faz cabo e rádio se comportarem igual, e é o que
alimenta a leitura `fonte=sysfs` da aba Status.

### E6 ○ ABERTA — o perfil chega ao brilho e à paleta mesmo quando a ativação é do autoswitch

F4. **Custo:** baixo-médio. **Decisão dela:** se "pular o restore de perfil de
janela" deve mesmo pular junto o brilho e a paleta.

**NÃO EXECUTADA, e a razão é uma decisão medida (22/08, execução da leva).** A
cura que esta entrega descreve — `configure()` com os valores do perfil que o
boot PULOU — é literalmente o que a RESTORE-ESCOPO-01 (22/07) proibiu depois de
medir. `daemon/connection.py:196-207`, na letra: *"um perfil de jogo/regex (caso
medido: 'FPS', marker de 19/07) voltava a cada boot/reconexão, **pintava a
lightbar e suprimia a paleta automática** sem NENHUMA janela correspondente
aberta"*. Suprimir a paleta automática a partir de um perfil de janela cuja
janela não existe é o sintoma que aquela decisão existe para impedir — e o
perfil que o boot pulou aqui era o `Sackboy`, de janela.

Vale também corrigir o enquadramento do F4: o brilho 1.0 não é o produto
esquecendo o perfil vigente; **não há perfil vigente** (o próprio falso positivo
2 desta sprint diz isso). O que sobra de verdadeiro é menor e outro: enquanto o
autoswitch não vê a janela, a luz roda nos defaults do construtor e **nada na
tela diz isso** — a aba mostra a cor como `fonte=sysfs`, a etiqueta que
significa "esta é a verdade". A `PERFIL-ADIADO-POR-JANELA-01` já grava o nome do
perfil em espera no store; o caminho honesto é a tela dizer "esperando a janela
de `<perfil>`; a luz está no padrão", não o perfil adiado pintar por baixo.

**A decisão dela, então, é entre três** e não entre duas: (a) manter como está;
(b) deixar o perfil de janela mandar no brilho/paleta antes da janela existir —
o que reabre a RESTORE-ESCOPO-01 e precisa da nota datada; (c) a tela contar
que a luz está no padrão porque o perfil está esperando a janela.

### E7 ● FECHADA — o `lightbar_reset.py` deixa de chamar o `0x08` de cura automática

F9. O cabeçalho de `core/lightbar_reset.py` dizia "A CURA"; agora diz o que é —
o gesto MANUAL de último recurso (`hefesto lightbar-reset` / IPC
`lightbar.reset`) — e registra que o envio automático saiu em `108b711` (04/08)
por ter sido medido como nocivo, com o controle de 22/08: 0 de 776 reports no
fio carregaram `RELEASE_LEDS`.

Conferido nos outros dois lugares onde o assunto aparece, porque fato errado sai
de TODOS: `cli/cmd_lightbar_reset.py` já dizia "ISTO NÃO É CURA" e
`docs/usage/cli.md:404-412` já estava certo. Era só o cabeçalho.

### E8 ○ ABERTA — os quatro fixtures saem do `controllers.json` dela

F8. **Custo:** um comando. **Decisão dela:** é o arquivo dela.

---

## O que NÃO deu para medir, e por quê

- **Se a barra apaga sozinha com o tempo.** É a pergunta 5, e não tenho olho:
  nenhum instrumento desta máquina lê a luz FÍSICA. O `multi_intensity` é o
  pedido, não o aceso — está escrito no próprio `core/sysfs_leds.py:92-104`. O
  que dá para dizer é o entorno: em 20 s de regime **zero** reports saíram no
  fio, e o `multi_intensity` não mudou sozinho em ~40 min. Se a barra apagou
  nesse intervalo, apagou **sem ninguém escrever** — o que aponta para o
  firmware, não para o produto. **Só o olho dela fecha isto** (E3).
- **Se Steam Flatpak/Snap casa o `pgrep` do `escritor_cru`.** Não tenho as duas
  embalagens aqui. Fica SUSPEITO.
- **Se a poluição de fixture (F8) causou o branco no fio.** Medi as duas pontas
  e não medi o meio.

---

## Os falsos positivos que descartei

1. **"A Steam repinta a barra em regime e apaga tudo"** — a hipótese óbvia, e a
   errada. **Derrubada por medição:** 1 escrita em 32 s com o nosso daemon
   parado, contra 426 com ele vivo. O `core/lightbar_gatilho.py` continua
   **certo** sobre a rajada de CONEXÃO (é lá que a Steam repinta); errado seria
   estender isso ao regime.
2. **"O brilho do perfil se perde no restart"** — foi a minha primeira leitura de
   F4, e era rasa. O perfil não perdeu o brilho: **não há perfil nenhum ativo**.
   O defeito verdadeiro é maior e outro, e virou F4 com esse nome.
3. **"A cura da luz está armada no adaptador errado, como no `bt_active_mode`"** —
   era a hipótese que motivou a leva. **Derrubada por medição**: o fio mostra os
   três adaptadores escritos no mesmo milissegundo, e não há `hci` no caminho da
   luz. Virou o achado negativo, que vale tanto quanto um positivo.
4. **"O `discover()` pega o vpad e o backend pinta o controle errado"** — os oito
   nós são reais (medido), mas o casamento é por MAC e o fallback single-controle
   foi removido de propósito. **A casa já tinha curado.** Viraria defeito só se o
   fallback voltasse — e é por isso que F7 fica escrito.
5. **"`disputada=True` nos quatro é critério largo demais"** — hipótese razoável
   e falsa: são quatro disputantes de verdade, medidos com `fuser`. O que está
   errado é a FRASE que a tela deriva do campo, não o campo (F2).
6. **"O `RELEASE_LEDS` (0x08) é a cura escrita e nunca ligada"** — o padrão mais
   caro desta casa, e não é o caso. Medido: 0 de 776 no fio, **e é intencional** —
   saiu em `108b711` (04/08) depois de ser correlacionado 7 de 7 com o travamento.
   Sobra um defeito de TEXTO (F9), não de código.
7. **`external_leds.py:51`, "o hardware medido nesta máquina"** — cheira a
   solução local, e não é: o código lê `os.path.exists(azul_path)` e degrada
   sozinho no controle sem a 5ª lâmpada, com log. A frase descreve de onde veio a
   medição, não uma premissa embutida.

---

## Onde isto encosta em outras levas

- **ELO-MUDO-01** (22/08) — F2, F4 e F6 são a mesma família: o produto responde
  pelo transporte e não pelo efeito, e `False` significa tanto "não" quanto "não
  sei".
- **`o-produto-responde-pelo-transporte-e-nao-pelo-efeito`** (memória do PO) —
  F1 é a versão diagnóstica: um exame que responde "não tem controle" quando há
  quatro.
- **`a-suite-cria-teclados-de-verdade`** (memória do PO) — F8 é o mesmo padrão
  no config em vez do kernel.
