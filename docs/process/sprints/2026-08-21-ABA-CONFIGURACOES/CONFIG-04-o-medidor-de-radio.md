# CONFIG-04 — o medidor de rádio

**Depende de:** CONFIG-02. *(Era "CONFIG-03", e estava errado: o medidor não lê
uma linha do `maquina.json`. Ele pendura na seção "A mesa" que CONFIG-02
constrói, e as entradas são o estado do daemon e o sysfs. Decisão R6.)*

**Entregue em 22/08/2026.**

## O que entrega

Uma barra de ocupação por adaptador Bluetooth, dentro da seção "A mesa":
**quanto do rádio daquele adaptador já está comprometido.** Duas fatias na mesma
trilha — entrada em roxo, áudio em ciano —, uma palavra de ocupação e o selo
mono `NNN/1600 · derivado da especificação`.

Onde ela mora na tela, de cima para baixo: a tabela de adaptadores, as duas
declarações (altura da antena, linha de visada), **o medidor**, e só então
"Outros rádios que dividem a faixa".

## A aritmética, escrita porque não estava escrita em lugar nenhum

```
fatias de entrada  = (controles sem microfone) x 260,4
                   + (controles com microfone) x 170,5
fatias de áudio    = (controles com microfone) x 106,2
teto               = 1600
ocupação           = (entrada + áudio) / teto
```

**Um relatório consome uma fatia** (decisão R1). É a metade que faltava, e ela
não existe na árvore: `1.600 fatias/s` sai de 625 µs por fatia no Bluetooth
Classic, mas *quantas fatias um relatório HID de 78 B consome* não está no
protocolo nem nos ensaios — grep conferido em 22/08/2026 por `625`, "slot" e
"fatia de tempo" em `src/`, `scripts/`, `docs/protocol/` e `docs/data/`. Um
relatório por fatia é a hipótese conservadora, e é a única que a palavra
"derivado da especificação" consegue defender sozinha. O número real depende do
tipo de pacote que o link negociou (2-DH1, 2-DH3), que o produto não observa.

**Não persiga os `831 / 1600` do mockup.** Eles são ilustração, e o próprio
`mockup/README.md` já diz isso: `32,4% + 19,5% de 1600 = 830,4`, não 831, e os
"3 controles · 2 com microfone" da mesma tabela dariam 601,4 de entrada e 212,4
de áudio.

### As três palavras e os dois cortes

| Ocupação | Palavra | Cor |
|---|---|---|
| até 60 % | **Folgada** | verde `@green` |
| até 85 % | **Apertada** | laranja `@orange` |
| acima | **Cheia** | laranja `@orange` |

Três palavras, **duas cores, e nunca vermelho** (decisão R3). Rádio cheio é
reversível — basta tirar um controle daquele adaptador —, e nesta casa o
vermelho é para o que destrói e não tem volta (`gui/theme.css:13`).

## A honestidade obrigatória

O número de **1.600 fatias/s é derivado da especificação do Bluetooth Classic —
não foi medido nesta máquina.** O medidor diz isso na tela, no selo mono, e a
dica do rótulo repete: *"Aritmética da especificação do Bluetooth, não medição
desta máquina"*.

O que **é** medido vem do A/B de 25/07/2026, e o bloco literal está em
`src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py:76-78` — **não**
em `daemon/subsystems/bt_mic.py`, que só carrega a versão arredondada em prosa
(`:14-21`, "~260", "~170", "~106"):

```
mic DESLIGADO  : input 260.4 Hz   audio   0.0 Hz   total 260.4 Hz
mic LIGADO     : input 170.5 Hz   audio 106.2 Hz   total 276.7 Hz
desligado again: input 274.3 Hz   audio   0.0 Hz   total 274.6 Hz
```

**A terceira linha não é detalhe, e a versão anterior desta sprint a omitia.**
Ela é a prova de que o efeito é de BANDA e não estado preso no firmware — a
recuperação ao desligar é total, e `dualsense_bt_audio.py:86-88` diz isso com
todas as letras. É ela que sustenta o "a soma quase não se move" do aceite: o
crescimento medido é de 276,7 sobre 260,4, **6,3 %**.

**"Com microfone" é só a ponte agente por HID** (decisão R4), nunca a placa USB:
por rádio o DualSense não publica placa ALSA nenhuma (medido 15/08/2026,
`src/hefesto_dualsense4unix/integrations/usb_pai.py:38-42`), e o bloco `bt_mic`
do estado é do PROCESSO — com quatro controles e uma ponte ele diz
`running: true` e pintaria áudio nos quatro.

## O risco que precisa estar escrito

Dois controles no **mesmo** adaptador diferiram por quase o dobro na mesma
janela de 20,000 s — **381,54 contra 191,40 Hz**, com a mesa FOLGADA
(`docs/data/ensaios-brutos/2026-08-15-E2-taxa-dos-oito-nos.csv:6` e `:8`). À
noite do mesmo dia, com os braços trocados, a desigualdade **sobreviveu à troca
de unidades**: 279,1 contra 157,8 Hz. O envelope do dia inteiro no rádio foi de
157,8 a 402,9 Hz. `docs/data/ensaios.csv:104` registra o resultado como
`não obedece`, e `docs/data/mapa-controles.csv` registra a causa como **ABERTO**.

**Consequência de projeto, e ela está no código.** O medidor pode dizer *"a mesa
está cheia"* — que é aritmética de especificação. Não pode dizer *"por isso seu
controle está ruim"*, porque a taxa varia por motivo desconhecido mesmo com a
mesa folgada.

A fronteira virou portão: `PALAVRAS_DE_CULPA`, em
`src/hefesto_dualsense4unix/integrations/radio_da_mesa.py`, é a lista que
`tests/unit/test_medidor_de_radio.py` varre contra as três palavras, o rótulo, o
selo e o texto acessível. Acrescentar frase de causa reprova.

**A mesma medição é a razão de o medidor usar o nominal do A/B e não medir ao
vivo** (decisão R2). Uma barra alimentada pelo envelope de 157,8 a 402,9 Hz
oscilaria 2,5 vezes sem ninguém ter mexido em nada, e ensinaria a desconfiar
dela.

## Onde o casamento controle-adaptador acontece

`CONFIG-02-o-que-a-mesa-ja-sabe-dizer.md` escreveu que *"o que amarra controle a
adaptador é o bond, em `/var/lib/bluetooth` — árvore 700, e a GUI é sudo-zero"*.
**O limite é falso, e esta sprint o derruba:** o uevent do nó hidraw publica
`HID_PHYS` = MAC do adaptador para BT real
(`src/hefesto_dualsense4unix/broker/hidraw_broker.py:281`, o comentário literal
que o broker já usa para decidir), e `/sys/class/hidraw/*/device/uevent` abre
como uid 1000 — conferido ao vivo nesta máquina em 22/08/2026, com o broker de
pé e os quatro nós legíveis.

Duas regras de honestidade saem daí, e as duas têm nó de teste:

* controle no **cabo** traz `HID_PHYS` de barramento USB
  (`usb-0000:0c:00.3-1/input3`), não MAC — devolve ausência, porque controle no
  fio não ocupa fatia nenhuma;
* controle em rádio **sem endereço legível** vai para a barra de "Não sei", e
  nunca empresta o adaptador do vizinho.

## O que ficou de fora, e por quê

**A fatia de áudio ainda não acende sozinha.** O que falta é uma linha no
daemon: `daemon/ipc_handlers.py:2937-2940` publica `bt_mic` com `enabled` e
`running`, que são do PROCESSO, e falta a terceira chave — a lista dos `uniq`
com ponte de pé, lida de uma property nova em `daemon/subsystems/bt_mic.py`
(as peças existem: `GerenciadorMicBluetooth.pontes` em
`src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py:1131-1133`, cada
ponte guarda o nó em `:821`, e o `uniq` em `:327`).

O lado da janela **já a lê**, com ausência virando conjunto vazio
(`secao_mesa.py::_aplicar_estado`), de forma que ligá-la é uma linha no daemon e
nenhuma na GUI. Enquanto ela não existe, um controle com a ponte de pé é contado
como sem microfone: a soma erra por 6,3 % e a fatia ciana não aparece. Os dois
arquivos ficaram fora do território desta onda; a pendência está registrada.

## Aceite

### O que fecha a sprint hoje — o CONTROLE NEGATIVO

**Não há adaptador Bluetooth nesta bancada.** Medido em 22/08/2026:
`/sys/class/bluetooth` existe e está vazio, `lsusb` não lista dongle nenhum,
`btusb` está carregado com refcount 0 e o único rfkill é o `wlan`. Com todos os
controles no cabo, **toda barra em zero é resultado válido** — e é o que a foto
mostra (decisão R5).

```sh
# 1. os dois DualSense reais desta bancada trazem caminho de barramento,
#    e não MAC, em HID_PHYS — logo, nenhum medidor sai de zero
for n in /sys/class/hidraw/*; do head -6 "$n/device/uevent"; done

# 2. a suíte do medidor, que é onde as regras mordem
.venv/bin/python -m pytest tests/unit/test_medidor_de_radio.py -q

# 3. a foto da aba, com a bancada de mentira: dois adaptadores,
#    duas barras em zero, o selo em cada uma
scripts/gui-captura/retratar_abas.py /tmp/config04
```

### O ensaio com rádio — PENDÊNCIA DE BANCADA, e ele tem aviso

**LEIA ISTO ANTES DE PEDIR O ENSAIO A ELA.** Com a ponte de microfone de pé, o
botão PS aparece pressionado em pulsos de ~17 ms e o daemon abre a Steam em
laço. Medido duas vezes em 16/08/2026
([O PS PRESO](../../estudos/2026-08-16-O-PS-PRESO-a-ponte-do-mic-e-o-laco-que-abria-a-steam-sozinho.md)),
e o relato foi *"o teclado, o mouse (tava teclando sem parar e o botão direito
do mouse também) ... desliguei o controle e parou"*. A segunda rodada já tinha o
filtro do bit de áudio e travou igual, em 10 segundos.

Cura: Steam FECHADA, janela do Hefesto em foco, dedo no botão de desligar o
controle. **A ponte nunca sobe por padrão, e o gesto não é oferecido na tela.**

```sh
# com UM DualSense no rádio:
# 1. abrir a aba: a barra daquele adaptador mostra folga larga, e o rótulo
#    diz o ENDEREÇO do adaptador — nunca hci0
# 2. as pré-condições, sem subir nada:
HEFESTO_DUALSENSE4UNIX_BT_MIC=1 hefesto-dualsense4unix mic bt-status
# 3. sobe a ponte: a barra do MESMO adaptador passa a mostrar DUAS fatias,
#    a de entrada menor que antes, e a soma quase parada (+6,3%)
HEFESTO_DUALSENSE4UNIX_BT_MIC=1 hefesto-dualsense4unix mic bt
```

O passo 3 só produz duas fatias depois que a terceira chave do bloco `bt_mic`
existir — ver "O que ficou de fora".

## Os arquivos

| Arquivo | O quê |
|---|---|
| `src/hefesto_dualsense4unix/integrations/radio_da_mesa.py` | novo. A conta, o casamento por `HID_PHYS`, as três palavras e a lista de palavras de culpa. Sem GTK, sem IPC. |
| `src/hefesto_dualsense4unix/app/widgets/sensor_widgets.py` | `MedidorDeRadio`, as duas cores e a regra pura de saturação da trilha. |
| `src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py` | o medidor na tela: rótulo, trilha, palavra, selo — e o `daemon.state_full` que o alimenta. |
| `tests/unit/test_medidor_de_radio.py` | novo. 21 nós, puros (nenhum importa `gi`). A mordida está no cabeçalho. |
