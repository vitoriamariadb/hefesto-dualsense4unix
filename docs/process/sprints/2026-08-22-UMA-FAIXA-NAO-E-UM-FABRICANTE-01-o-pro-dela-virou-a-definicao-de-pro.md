# UMA-FAIXA-NÃO-É-UM-FABRICANTE-01 — o Pro dela virou a definição de "Pro"

**22/08/2026.** Auditoria pedida por ela, com a pergunta escrita por ela:

> *"todas as nossas soluções provavelmente foram tão fechadas a ponto de
> considerarmos somente os nossos componentes locais (...) vai ficar pra sempre
> naquela de 'poxa, não sei pq não deu certo no seu pc, no meu funciona de
> boa'. Pode mandar agentes verificarem se temos esse tipo de infra no projeto
> como um todo?"*

**Frente desta varredura:** o **hardware dela fixado no código** — `src/`,
`scripts/`, `assets/`, `packaging/`. A pergunta em cada linha foi sempre a
mesma: *o que acontece na máquina de quem não tem este aparelho?*

**Estado:** ABERTA. Nada foi curado aqui — o território era auditar.

**Sprint irmã, na mesma noite:** a
[N-IGUAL-A-UM-01](2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md) cobre a
classe *"um adaptador é tratado como o único"* e já entrou no `scripts/doctor.sh`
durante esta varredura. As duas se completam e não se sobrepõem: aquela conta
**aparelhos**, esta conta **modelos**.

---

## O defeito, em uma linha

**Uma faixa OUI não é um fabricante, e o produto trata as duas coisas como a
mesma.** O Pro Controller dela nasceu na faixa `E0:F6:B5`. A Nintendo tem
**oitenta e duas** faixas registradas. O produto inteiro — daemon, dois scripts
de rádio, uma regra de udev e o `doctor` — decide "é um Pro genuíno?" comparando
com **uma** delas, e chama isso de *"a fonte da verdade"*.

Quem tem um Pro de outra safra recebe, em silêncio: o link caindo sob carga, o
giroscópio morto, o rótulo de clone na tela — e um `doctor` que aprova tudo.

---

## O que foi MEDIDO nesta bancada

Cinco medições, todas de hoje, todas somente leitura. Nenhuma escreveu nada em
adaptador, controle ou serviço.

### M1 — a Nintendo tem 82 faixas; o código conhece 1

Fonte: a cópia local do registro IEEE, `/usr/share/ieee-data/oui.csv`
(`ieee-data`, o mesmo arquivo que `/var/lib/ieee-data/oui.csv` aponta).

```
$ grep -c -i '"Nintendo Co' /usr/share/ieee-data/oui.csv
82
$ grep -i '8bitdo' /usr/share/ieee-data/oui.csv | wc -l
1
```

Oitenta e duas faixas MA-L da `Nintendo Co., Ltd.` — entre elas `98:B6:E9`,
`34:AF:2C`, `7C:BB:8A`, `5C:52:1E`, `98:41:5C`, `04:03:D6`, `58:B0:3E`. E
`E0:F6:B5`, que é a do aparelho desta casa.

A 8BitDo tem **uma** (`E4:17:D8`). É por isso que a tabela de uma linha em
`app/actions/external_controllers.py` está **certa** e a constante de uma linha
do `external_identity.py` está **errada**: lá a lista fechada é a lista
completa; aqui ela é uma amostra de tamanho um.

**O que eu NÃO medi, e é honesto dizer:** quais dessas 82 faixas realmente saem
de fábrica num Switch Pro Controller. Há um Pro nesta bancada e a faixa dele é
`E0:F6:B5`. O que a medição derruba não é "existe um Pro com outra OUI" — é a
frase escrita no código, *"a OUI é a fonte da verdade"*: uma faixa não é um
fabricante, e tratar uma pela outra é uma afirmação forte sem medição que a
sustente.

### M2 — o alias "Nintendo" está no adaptador que não tem Nintendo nenhum

Três adaptadores, cinco controles, distribuídos 1/2/2:

```
/org/bluez/hci0/dev_44_46_48_00_00_03   DualSense Wireless Controller
/org/bluez/hci1/dev_14_3A_9A_00_00_AB   DualSense Wireless Controller
/org/bluez/hci1/dev_E0_F6_B5_00_00_53   Pro Controller
/org/bluez/hci2/dev_A0_FA_9C_00_00_F0   DualSense Wireless Controller
/org/bluez/hci2/dev_D4_2F_4B_00_00_D8   DualSense Wireless Controller
```

O seletor de adaptador do `bt_active_mode.sh`, rodado verbatim e sem efeito
colateral:

```
_adaptador() devolve: hci0
```

E o resultado disso, no D-Bus, agora:

```
hci0 alias: "Nintendo MeowSystem"     <- não hospeda Nintendo nenhum
hci1 alias: "MeowSystem #2"           <- é AQUI que o Pro está
hci2 alias: "MeowSystem #3"
```

A cura `BT-NINTENDO-ACTIVE-01` está armada no alvo errado nesta bancada. É a
hipótese dela, medida.

**Por que ninguém notou:** a cura tem duas metades e só uma é por adaptador. A
segunda metade — o `hcitool lp <MAC> RSWITCH` do laço final — anda **por MAC**,
e o `_macs_conectados()` sai da árvore inteira do BlueZ. Essa metade alcança o
Pro em `hci1` normalmente. O produto funcionou pela metade e a metade que
funcionou é a que se nota.

### M3 — o sysfs desta bancada não publica endereço de adaptador

```
$ ls /sys/class/bluetooth/hci0/
device  hci0:1  power  reset  rfkill3  subsystem  uevent
$ cat /sys/class/bluetooth/hci0/address
cat: .../address: Arquivo ou diretório inexistente
```

Vale para `hci0`, `hci1` e `hci2`. Confirma a decisão M1 da aba Configurações
(identidade física em vez de endereço) e confirma que o `belt D4` do
`broker/hidraw_broker.py` fica inerte neste kernel — inerte pelo caminho certo,
sem decidir. Duas afirmações da casa passaram no controle.

### M4 — consultar um adaptador que não existe falha em silêncio

```
$ busctl get-property org.bluez /org/bluez/hci9 org.bluez.Adapter1 Discovering
Failed to get property Discovering ... doesn't exist
```

Com o `2>/dev/null` do `_dbus_bt_prop`, isso vira string vazia, e um
`[[ "${disc}" == "true" ]]` nunca dispara. É o mecanismo pelo qual um `hciN`
literal vira no-op MUDO. **Esta é a única linha desta auditoria que já foi
curada por outro agente hoje** — ver a seção do fim.

### M5 — o caminho absoluto do disco dela só resolve por symlink

`scripts/gui-captura/retrato_offscreen.py:21` traz
`/home/vitoriamaria/Desenvolvimento/hefesto-dualsense4unix` como raiz padrão.
Ele resolve nesta máquina — e resolve porque há um symlink:

```
$ readlink -f /home/vitoriamaria/Desenvolvimento/hefesto-dualsense4unix
/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
```

Fora daqui, o script morre no `Gtk.Builder.add_from_file` do `main.glade`.

---

## Os achados, em ordem de custo do silêncio

O grau é literal: **MEDIDO** = rodei e vi; **LIDO** = está no código, não
exercitei; **SUSPEITO** = nem uma coisa nem outra.

### A1 ● A "linhagem Nintendo" é uma faixa OUI, em cinco caminhos de execução

**Grau: a premissa é MEDIDA (M1); cada consequência é LIDA.**

| Onde | O que a linha faz | O que acontece com um Pro de outra faixa |
|---|---|---|
| `src/hefesto_dualsense4unix/daemon/subsystems/external_identity.py:200` e `:899` | gate do enable-IMU | o giroscópio fica em STANDBY para sempre. Sem log, sem aviso |
| `scripts/bt_nosniff_now.sh:39` e `:56` | no-sniff na borda do connect | `exit 0` mudo — nem a linha de journal que o script escreve quando falha |
| `assets/82-nintendo-pro-nosniff.rules:50-51` | dispara o de cima | a regra não casa; o udev nem chega a chamar |
| `scripts/bt_active_mode.sh:188` e o laço final | no-sniff a cada tick da vigia | `continue` — o Pro fica no sniff e cai sob carga |
| `scripts/doctor.sh:3078` (`_pro_mac`) | conferência do modo ativo | dá `pass` em "modo ativo p/ Nintendo" sem ter olhado o controle |
| `scripts/ver_botao.py:42` | rótulo na tela dela | o Pro genuíno é apresentado como "8BitDo SN30 Pro" |

**Isto quebraria na máquina de outra pessoa, ou só é feio?** Quebra. E quebra
da pior maneira: o sintoma (link caindo com quatro jogadores, gyro que não
existe) é exatamente o sintoma que a casa já gastou duas ondas curando, e o
`doctor` responde que a cura está aplicada.

**A casa já escreveu a cura, no módulo mais novo, e não a generalizou.**
`src/hefesto_dualsense4unix/integrations/apelido_do_dongle.py:394-400` decide a
mesma pergunta por **OUI *ou* nome**:

```python
def _e_da_linhagem_nintendo(*, nome: str, uniq: str) -> bool:
    """Este controle é da linhagem que lê o nome do host? OUI ou nome bastam."""
    endereco = uniq.strip().lower()
    if any(endereco.startswith(oui) for oui in OUIS_NINTENDO):
        return True
    minusculo = nome.strip().lower()
    return any(marca in minusculo for marca in NOMES_NINTENDO)
```

com o comentário que é, sozinho, o diagnóstico desta sprint: *"Existem além das
OUIs porque OUI é lista fechada e nome é o que o kernel deduziu do driver: um
aparelho novo do mesmo firmware entra por aqui sem ninguém precisar descobrir a
OUI dele primeiro."*

Esse arquivo é trabalho não commitado de outra leva. **Não toquei nele** —
mas ele é a prova de que a resposta certa já existe escrita nesta árvore, e é o
padrão *"a casa sabe e o produto não faz"*.

**O que a cura precisa cuidar, e por isso não é `s/uma OUI/lista de OUIs/`:** o
8BitDo em modo Switch mente VID, PID, serial e `HID_NAME` — a OUI dele
(`E4:17:D8`) é o único sinal honesto. Uma regra por nome sozinha promoveria o
clone a genuíno e o A/B de 23/07 diz o que isso custa (probe morrendo em
`ret=-110`). A forma que aguenta as duas pontas é a do `apelido_do_dongle`
invertida: **`E4:17:D8` é clone; qualquer outra faixa da Nintendo com
`HID_NAME` de Pro é genuíno.** A negativa é a lista fechada de verdade, porque
a 8BitDo tem uma faixa só e isso está medido (M1).

### A2 ● O eixo do ADAPTADOR é da sprint irmã — e a medição M2 é dela também

**Grau: MEDIDO (M2). Achado JÁ RELATADO por outra sprint, não é meu.**

A [N-IGUAL-A-UM-01](2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md)
levantou, no mesmo dia e melhor do que eu levantaria, a classe inteira: o
`_adaptador()` do `bt_active_mode.sh`, o SNIFF default no primeiro adaptador, os
dois `head -1` que sobraram no `doctor` e o `HCI=hci0` do `medir_w3_coex.sh`. A
minha M2 chegou ao mesmo lugar por outro caminho e serve como **segunda régua
independente** para o achado mais caro dela — que é exatamente o que a casa
cobra depois da [PORTÕES-EM-SÉRIE](2026-08-19-TRES-PORTOES-01-nao-anda-nem-o-microfone.md):
duas medições feitas por quem não combinou entre si.

**O que fica desta sprint sobre aquele eixo, e não está lá:** a E2 daquela
sprint quer aplicar o alias *"em todo adaptador que hospeda Nintendo"*, e quem
responde "hospeda Nintendo?" é o predicado do A1. **Enquanto o predicado for uma
faixa OUI, a cura de lá herda o defeito de cá**: numa mesa de três adaptadores
com um Pro de outra safra, `adaptadores_com_nintendo()` devolve lista vazia e o
alias não vai a lugar nenhum — agora com um laço, e ainda em nenhum adaptador. As
duas curas têm de sair na ordem A1 depois E2, ou juntas.

### A3 ● O `bcdDevice` de UMA unidade de cada separa genuíno de clone

**Grau: LIDO.**
`assets/84-nintendo-pro-variant.rules` — oito linhas, todas com
`bcdDevice=="0210"` (genuíno) ou `bcdDevice=="0200"` (clone).

O `bcdDevice` é o número de revisão do dispositivo no descritor USB: ele **muda
com o firmware**. Um Pro genuíno atualizado que reporte `0211`, ou um 8BitDo com
outro firmware, não casa nenhuma das duas linhas: sem
`HEFESTO_CONTROLLER_VARIANT`, sem `/dev/hefesto/nintendo-pro`, sem
`/dev/hefesto/8bitdo-pro-clone`.

**E aí o diagnóstico mente.** O próprio comentário da regra diz: *"a AUSÊNCIA do
link é ela mesma o sinal de que a cura ainda não pegou"* — referindo-se ao patch
DKMS `usb_cmd_pad_to_report`. Quem tiver a revisão desconhecida vai ler
"o patch DKMS não pegou" quando o que aconteceu foi "a regra não conheceu o seu
aparelho".

**Isto quebraria na máquina de outra pessoa, ou só é feio?** Quebra o
diagnóstico, não o produto — a regra "só nomeia", como ela mesma diz, e a
energia e os LEDs pegam os dois controles por VID. Por isso está aqui embaixo e
não no topo.

**O tamanho da cura:** uma terceira linha por subsistema, sem `bcdDevice`, com
`ENV{HEFESTO_CONTROLLER_VARIANT}="nintendo-pro-desconhecido"` — a regra passa a
saber dizer *"é um `057E:2009` que não é nenhum dos dois que eu conheço"*, que é
a informação que falta. Alternativa mais forte, se alguém medir: a faixa
`bcdDevice >= 0210`.

### A4 ● O único caminho absoluto do disco dela na árvore

**Grau: MEDIDO (M5).**
`scripts/gui-captura/retrato_offscreen.py:21`.

Há escape (`HEFESTO_RAIZ`) e a falha é barulhenta. Mas é ferramenta de casa —
`docs/process/COMO-OLHAR-A-TELA.md` manda rodar o retrato antes de commitar
interface —, e quem clonar o repo e seguir o `CLAUDE.md` bate nisto na primeira
tentativa.

**O tamanho da cura:** uma linha.
`_RAIZ_PADRAO = Path(__file__).resolve().parents[2]`. O arquivo está três níveis
abaixo da raiz (`scripts/gui-captura/`), e o `retratar_abas.py` ao lado já não
tem caminho absoluto nenhum — é só copiar o vizinho.

### A5 ● A conf de WiFi tem justificativa de um chip e escopo de todos

**Grau: LIDO.**
`assets/NetworkManager/hefesto-wifi-powersave.conf`.

O cabeçalho é explícito sobre o alvo: *"em dongles Realtek USB (RTL8822BU) o PS
do firmware tem histórico de 'failed to leave lps state'"*. A regra que ele
escreve é `match-device=type:wifi` — **todo** WiFi. Num Intel `iwlwifi` de
notebook, desligar o power save do rádio custa bateria e não cura nada, porque
o defeito medido é do firmware Realtek.

**Isto quebraria na máquina de outra pessoa, ou só é feio?** Nem uma coisa nem
outra: é **opt-in** atrás de `--wifi-powersave-off` e o `install.sh` só o instala
com a medição A/B do `scripts/medir_w2_lps.sh` na mão. Fica registrado porque a
distância entre a justificativa e o escopo é o começo de todo defeito desta
classe, e porque o dia em que a evidência virar default (o próprio arquivo diz
que essa é a intenção) o escopo passa a importar. O `match-device` do
NetworkManager aceita `driver:`, e é ali que o alvo caberia.

### A6 ● Um fato de bancada errado dentro de um módulo bom

**Grau: MEDIDO (M2 contra o texto).**
`src/hefesto_dualsense4unix/integrations/mesa_de_radio.py:49` afirma, com data
de hoje: *"a mais comum de todas: esta bancada tem ZERO adaptadores
(`/sys/class/bluetooth` vazio, medido em 22/08/2026)"*.

Esta bancada tem três, medidos hoje (M2). A frase que a envolve — que lista
vazia é resposta legítima e que zero adaptadores é o caso comum lá fora — é
verdadeira e vale a pena; o parêntese que a apresenta como medição desta mesa
não é. Pela regra da casa (*fato errado se SUBSTITUI*), o parêntese sai ou
ganha a condição em que foi medido.

Não é caminho de execução. Está aqui porque é o tipo de linha que a próxima
pessoa cita como prova.

---

## O que outro agente já curou durante esta varredura

**Não é achado meu, e registrar isso é metade do valor de uma auditoria.**

`scripts/doctor.sh` mudou às 19:43 de hoje, no meio desta varredura, sob o
apelido **N-IGUAL-A-UM-01 (22/08/2026)**. Duas coisas que eu tinha na mão
saíram curadas antes de eu escrever:

- o `/org/bluez/hci0` literal do check de `Discovering` virou um laço sobre os
  adaptadores **que hospedam controle**, montado em `check_bt_radio`;
- a mensagem de cura do bond sem SDP deixou de mandar a pessoa colar
  `busctl call org.bluez /org/bluez/hci0 ...` e passa a montar o caminho a
  partir do objeto do device (`${p%/*}`).

O comentário que entrou junto nomeia a mesma cicatriz que eu ia nomear
(`WATCHDOG-HCI-HARDCODE-01`, `bt_health_watchdog.sh:158`) e diz que ela *"está
escrita vinte linhas acima e não tinha sido generalizada"*.

**O que isso muda para esta sprint:** o eixo do adaptador saiu daqui e virou o
A2, que é uma referência à sprint irmã em vez de um achado repetido. O que fica
sendo meu é o eixo do MODELO — quem é "um Pro" —, e ele é o que amarra a E2 de
lá: um laço sobre adaptadores que pergunta "hospeda Nintendo?" com um predicado
de uma faixa só continua sem achar o Pro que importa.

---

## Entregas

Ordenadas por custo do silêncio, não por tamanho.

### E1 — a linhagem Nintendo deixa de ser uma faixa

Trocar o predicado nos cinco caminhos do A1 por um só, e por **negativa**:
`E4:17:D8` é clone; `057E:2009` com `HID_NAME` de Pro e qualquer outra faixa é
genuíno. A forma já existe em
`integrations/apelido_do_dongle.py` (`_e_da_linhagem_nintendo`); o que falta é
uma casa para ela que o `daemon/`, os dois `.sh` e a regra de udev possam usar —
os quatro hoje repetem a constante e se citam mutuamente como "mesma fonte da
verdade", que é a assinatura de uma fonte que não existe.

**O ponto delicado, e é onde a cura pode piorar as coisas:** a regra de udev
casa por `ENV{HID_UNIQ}`, e casar "qualquer OUI da Nintendo" ali significa ou
82 linhas geradas, ou tirar o filtro da regra e pô-lo no helper — que é o que o
helper já faz (`bt_nosniff_now.sh:56` revalida). A segunda opção troca 82 linhas
por um `RUN+=` em todo device HID de Bluetooth. **É decisão dela**: custo de
manutenção contra custo de execução.

**Custo:** médio no daemon e nos scripts (o predicado é pequeno, os testes é que
são o trabalho: precisa de um Pro de faixa desconhecida e de um 8BitDo em
fixture, e o teste tem de reprovar quando a lista voltar a ter uma OUI só).
Alto na regra de udev, pela decisão acima.

### E2 — a regra 84 aprende a dizer "não sei"

Uma linha por subsistema em `assets/84-nintendo-pro-variant.rules` para o
`057E:2009` que não é `0210` nem `0200`. O valor a entregar é o "desconhecido",
não um palpite.

**Custo:** baixo. E paga sozinho na primeira revisão de firmware que aparecer,
porque converte um diagnóstico errado ("o DKMS não pegou") em um certo.

### E3 — a raiz do retrato sai do `$HOME` dela

Uma linha em `scripts/gui-captura/retrato_offscreen.py`.

**Custo:** trivial. Sem teste próprio: o portão é o próprio uso, e o vizinho
`retratar_abas.py` já mostra a forma.

### E4 — o parêntese errado do `mesa_de_radio` sai

`src/hefesto_dualsense4unix/integrations/mesa_de_radio.py:49`.

**Custo:** trivial.

---

## O que é decisão DELA

1. **A regra de udev 82: 82 linhas ou zero filtro?** (E1) Manter o filtro na
   regra custa manutenção e uma lista que envelhece; tirá-lo custa um `RUN+=`
   em todo device HID de Bluetooth, com o helper decidindo. Eu não escolho isso
   sozinho.
2. **Todos os adaptadores viram "Nintendo", ou só os que hospedam um?** (E2 da
   N-IGUAL-A-UM-01, que só fecha depois da E1 daqui) O
   nome aparece na tela de Bluetooth do sistema dela. É a mesa dela que fica
   com três aparelhos com nome de console.
3. **O `bcdDevice >= 0210` vale como regra?** (E2) Isso exige medir um segundo
   Pro genuíno, e ela é quem tem o aparelho. Enquanto não houver medição, a
   entrega é o "desconhecido", que não afirma nada.
4. **A conf de WiFi vira default algum dia?** (A5) Se virar, o escopo
   `type:wifi` passa a importar e a pergunta é se o alvo deve ser `driver:`.

---

## Os falsos positivos, e por que cada um caiu

Esta seção é a maior de propósito. Nesta frente quase tudo que o `grep` acha é
vocabulário, fixture ou método da casa.

**Vocabulário de protocolo (descartado sem hesitar).** Os `054c`, `057e`,
`2dc8`, `045e`, `28de`, `20d6`, `0f0d` e `02fe` que aparecem em `src/`. Levantei
o histograma de todos os literais de quatro hexadecimais na árvore e não sobrou
nenhum que não fosse fabricante de controle ou o vpad da casa.

**`assets/81-hefesto-usb-power.rules`.** O `2357:0604` do dongle dela aparece —
**dentro de um comentário**. A regra casa `ATTR{bDeviceClass}=="e0"`, que é
classe USB, não fabricante. É o exemplo certo do que a auditoria procurava: a
medição do aparelho dela ficou registrada e o casamento ficou universal.

**`scripts/gui-captura/retratar_abas.py:830-910`.** Parece a mesa dela em
memória e não é: os aparelhos são sintéticos (`0a12:0001`, `05e3:0608`,
`0bda:8771`, `046d:c52b`), a raiz é `/bancada/...`, nada de `/sys` é aberto, e o
retrato chama a função de **produção** (`ler_a_mesa`) com as raízes trocadas em
vez de copiar a lógica. É fixture, e é fixture bem feita.

**`src/hefesto_dualsense4unix/integrations/cor_do_plastico.py`.** O único módulo
que **escreve** no aparelho é o único que confere para quem está escrevendo:
`_VID_SONY`/`_PID_DUALSENSE` antes do `SET_FEATURE 0x80`, mais o filtro do vpad
por `hefesto-vpad`/`02fe`. Um `SET_FEATURE 0x80` num Pro Controller seria o pior
achado possível desta auditoria, e ele não existe.

**`broker/hidraw_broker.py`, o `belt D4`.** A guarda é
`adapters is not None and adapters and phys not in adapters` — conjunto vazio
não decide. Medi (M3) que neste kernel o `address` não existe em nenhum dos três
adaptadores, ou seja, o belt está inerte aqui e só acorda num kernel que o
publique, onde ele está certo. Degradação feita direito.

**`assets/dkms/rtw88-usb/dkms.conf`.** Tem o kernel exato dela pinado
(`BUILD_EXCLUSIVE_KERNEL="^7\.0\.11-76070011-"`) e essa é a **resposta certa**,
não o defeito: os headers privados do rtw88 estão vendorados, o layout de
`struct rtw_dev` está congelado neles, e compilar contra outro kernel poderia
linkar limpo e corromper memória. O pino faz o DKMS **pular** a máquina de todo
mundo, e o in-tree assume. Fail-safe, documentado, com o motivo escrito.

**`scripts/doctor.sh:4626` (`HEFESTO_DKMS_KERNEL_TESTED`).** O kernel dela como
constante. Cheguei nele achando que ia avisar 100% dos usuários; fui ler as duas
chamadas (`:4737` e `:4797`) e o aviso só sai **dentro do ramo em que o módulo
foi construído para o kernel atual**. Quem não tem o DKMS nunca vê a linha. O
instrumento estava certo e eu estava errado.

**`hid-nintendo` e `hid-playstation` sem `BUILD_EXCLUSIVE_KERNEL`.** Diferente
do vizinho, os dois compilam contra qualquer kernel que aceite o `.c` de 7.0.11
— e aí mascaram um in-tree mais novo. Não é descuido: o comentário `T-2/PKG-1`
em `scripts/doctor.sh` descreve exatamente esse cenário e escolhe o caminho do
aviso em vez do pino, porque esses dois são autocontidos e o rtw88 não é.
Decisão datada, com o preço na mesa. Fica registrada aqui como coisa vista e
deixada de pé, não como achado.

**`app/actions/external_controllers.py:78-80` (`_BRAND_BY_OUI`).** Uma tabela de
uma linha, `e417d8` para 8BitDo. Ia entrar na lista até a M1: a 8BitDo tem
exatamente **uma** faixa no registro IEEE. Aqui a lista fechada é a lista
completa, e é essa diferença que prova que o problema do A1 não é "usar OUI" —
é usar uma amostra de tamanho um onde a população tem 82.

**`app/main.py` (`_force_xwayland_on_cosmic`).** Contorno específico de COSMIC,
mas condicionado a `XDG_CURRENT_DESKTOP` e com escape por variável de ambiente.
Universal por construção.

**Os `window_backends`.** A cascata portal → `wlrctl` → X11, com degradação
nomeada por compositor e mensagem que diz o que instalar. É o oposto do que esta
auditoria procurava.

**`src/hefesto_dualsense4unix/integrations/mesa_de_radio.py`.** Tem uma seção
inteira chamada `UNIVERSALIDADE`, injeta todas as raízes por argumento com
default do sistema real, e o comentário do `_CONTROLADOR_PCI` recusa
explicitamente portar o `pci_label` do `doctor` porque *"ele traduz dois
endereços PCI de uma máquina específica, e endereço PCI de máquina é o oposto de
universal"*. É o modelo. (O parêntese errado da linha 49 é o A6 e não muda isso.)

**`scripts/medir_w2_lps.sh` e `scripts/medir_w3_coex.sh:46` (`HCI=hci0`).**
Instrumentos de medição, rodados à mão, com o operador escolhendo o alvo. Não
são produto e não viajam nos instaladores.

**Os `usb-0000:0c:00.3-1/input3` de `radio_da_mesa.py` e
`apelido_do_dongle.py`.** É o endereço PCI dela, e está em comentário mostrando
a **forma** de um `HID_PHYS` de cabo. O código casa `_MAC_RE`, não o literal.

**Os `20:15:40`, `06:29:01` e companhia.** Minha regex de MAC os pegou; são
horários de journal. Falso positivo do meu instrumento, não do produto.

**`com.vitoriamaria.HefestoDualsense4Unix` no `packaging/`.** É o app-id em DNS
reverso, um identificador, não hardware. (Que o nome dele seja assunto é a
[IDENTIDADE-01](2026-08-21-IDENTIDADE-01-o-projeto-ainda-se-chama-pelo-nome-dele.md),
e não desta frente.)

---

## Como morde

Cada entrega precisa de um teste que reprove com a cura arrancada. O desenho de
cada um, para quem executar:

- **E1:** um inventário com um `uniq` de faixa Nintendo que **não** seja
  `E0:F6:B5` e `HID_NAME` de Pro. Sem a cura, o enable-IMU não é tentado.
  Contraprova obrigatória no mesmo teste: um `uniq` `E4:17:D8` com o **mesmo**
  nome e o mesmo `057E:2009` **não** pode receber o tratamento — é essa metade
  que impede a cura de virar uma regressão do clone.
- **E2:** `udevadm test` (ou o portão de sintaxe que a casa já usa) com
  `bcdDevice=0211`: sem a cura, nenhuma propriedade sai.

---

## O que este achado ensina

Duas frases, e as duas já estavam escritas nesta casa antes de mim.

**A primeira.** *"Uma faixa OUI não é um fabricante"* é o mesmo erro de forma
que *"o primeiro adaptador não é o único"*: em ambos, uma **amostra de tamanho
um** desta bancada foi promovida a **definição**. O que torna o erro difícil de
ver é que a amostra estava certa — o Pro dela é `E0:F6:B5` mesmo, e o adaptador
dela é `hci0` mesmo. O defeito não está no que foi medido; está na quantificação
que foi escrita em cima.

**A segunda.** Nos dois achados de topo, **a cura já existia escrita na
árvore**: o `_e_da_linhagem_nintendo` para o A1, o `check_bt_radio` de hoje e a
cicatriz do `bt_health_watchdog.sh:158` para o A2. É
*"a casa sabe e o produto não faz"* outra vez — e o remédio contra isso não é
achar a cura, é **generalizá-la no dia em que ela é escrita**, o que custa
minutos, contra encontrá-la de novo meses depois, o que custou esta auditoria.
