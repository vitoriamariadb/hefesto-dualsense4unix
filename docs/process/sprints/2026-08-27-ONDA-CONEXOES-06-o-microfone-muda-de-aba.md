---
sprint: ONDA-CONEXOES-06
estado: absorvida
posse:
  A6:
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
cria:
  - src/hefesto_dualsense4unix/integrations/microfone_do_dualsense.py
  - tests/unit/test_conexoes_o_microfone_muda_de_aba.py
bancada: false
depois_de:
  - ONDA-CONEXOES-05
  - ONDA-SISTEMA-02
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
  - src/hefesto_dualsense4unix/app/mic_monitor.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/app/draft_config.py
  - src/hefesto_dualsense4unix/daemon/ipc_draft_applier.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONEXÕES · 06 — o microfone muda de aba, e o botão dele ganha tela

**Dois defeitos, uma sprint** — porque são o mesmo widget do mockup
(`aba08.py:300-314`):

1. **O modo do microfone mora numa aba que vai deixar de existir.** Ligar e
   desligar o microfone do DualSense para o computador inteiro está na Emulação
   (`emulation_actions.py:1136-1440`, `main.glade:3586-3626`), e a
   `D-A-EMULACAO-MORRE` manda: *"o microfone vai para a Status (volume) e para a
   Conexões (modo)"*.
2. **"O que o botão do mic muda: só o controle ou o PC inteiro" nunca teve
   tela.** O campo existe no perfil (`profiles/schema.py:451`,
   `button_toggles_system`), existe no rascunho (`app/draft_config.py:222`) e o
   aplicador do daemon já sabe recebê-lo (`daemon/ipc_draft_applier.py:565-592`).
   O comentário do rascunho diz com todas as letras: *"Quem lhe der superfície
   escreve `True`/`False` aqui e o gate abre sozinho"*. **Ninguém deu.**

## Onde é a fronteira, e ela é a razão de o modo vir para cá

Aqui é **se o microfone existe para esta máquina** — desligado, nenhum programa
enxerga o microfone de nenhum controle. **Quanto ele capta agora** e o mudo de
cada controle ficam na aba Controles, e o mudo manda na luz vermelha do plástico
(`D-O-BOTAO-DO-MIC-MANDA-NA-LUZ`).

## O que entrega

**Nasce `integrations/microfone_do_dualsense.py`** — o dono único do modo, hoje
espalhado em métodos privados de uma aba que morre. Ele leva, sem reescrever a
lógica: os quatro estados (`MIC_SUPRIMIDO`, `MIC_SEM_PROMOTOR`, `MIC_LIGADO`,
`MIC_SEM_ALVO`), a régua do alvo (`storm_doctor.contar_placas_dualsense`), o
diretório de drop-ins resolvido **na chamada** e nunca no import
(`CANARIO-FS-01`), e a chamada ao `scripts/fix_wireplumber_default_source.sh`.

**A seção "Os controles" da Conexões ganha três linhas** (`aba08.py:300-324`):

* `Microfone do DualSense` — interruptor, com o estado dos quatro;
* `O botão do mic muda` — seletor de duas opções, `só o controle` /
  `o computador inteiro`, escrevendo `button_toggles_system`;
* `Botões do controle externo` — Xbox / Nintendo / Não sei, que a
  ONDA-CONEXOES-05 já trouxe, agora na mesma fileira.

**Quem apaga o bloco da Emulação NÃO é esta sprint.** Os widgets do Glade
(`emulation_mic_box`, `:3586-3626`) e os handlers `on_emulation_mic_on` /
`on_emulation_mic_off` morrem junto com a aba, e a aba é território da onda que
a desmonta (**ONDA-SISTEMA-02**, que já possui `emulation_actions.py` e o
`main.glade`). Por isso esta sprint vem `depois_de` ela: **primeiro o dono
antigo solta, depois o novo pega.** A ordem inversa criaria dono duplo do mesmo
gesto, que é a cicatriz que esta casa já pagou; e entre uma e outra o modo do
microfone fica sem tela — **buraco declarado**, não descuido.

**O aviso do quirk continua inteiro.** Ligar sem o ajuste de áudio USB pode
reabrir o storm -71, e hoje isso vai na mensagem final porque um toast anterior
seria sobrescrito (`emulation_actions.py`, `on_emulation_mic_on`). O texto muda
de aba; a advertência, não.

## Como se prova — o teste que morde

`tests/unit/test_conexoes_o_microfone_muda_de_aba.py`:

* **os quatro estados**, com o diretório de drop-ins e o `/proc/asound/cards`
  injetados: sem placa nenhuma o módulo devolve `MIC_SEM_ALVO` e a tela **não
  escreve "Ligado" em verde** — é o defeito que a `EMULACAO-UM-DONO-SO-01/E3`
  mediu, e ele não pode renascer na aba nova;
* o interruptor chama o módulo, e o módulo chama o script **uma vez**, com a
  flag certa (`--enable-mic` / `--disable-source`). Dublê que sabe **recusar**:
  script ausente devolve erro visível, não silêncio;
* trocar `O botão do mic muda` escreve `mic.button_toggles_system` no rascunho,
  e **`None` continua sendo "sem opinião"** — não tocar no seletor não pode
  mandar a chave;
* **um dono só**: o módulo novo é o único caminho para o script do WirePlumber —
  varredura por AST, e nenhum outro `src/` chama
  `fix_wireplumber_default_source.sh`. É esta asserção que reprova se a
  ONDA-SISTEMA-02 não tiver soltado o gesto antes.

**A mordida:** faça o módulo devolver `MIC_LIGADO` com zero placas e veja o
primeiro teste reprovar. Depois faça o seletor escrever `False` na montagem (em
vez de `None`) e veja o terceiro reprovar — é ele que impede que abrir a aba
derrube um `False` escolhido no `DaemonConfig`, que é o defeito nomeado em
`draft_config.py:210-215`. Cole as duas saídas.

## O que é dela decidir

1. **Nada de novo** — o destino do modo é decisão dela já tomada
   (`D-A-ABA-DO-AMBIENTE-CHAMA-SE-CONEXOES`: *"Aqui poderia ir pra lá
   inclusive"*). O que precisa do olho dela é a **tela**.

## O que fica combinado com quem coordena

Esta sprint **não abre o `main.glade`** de propósito — ele é recurso de bancada
disputado por toda a leva. Ela pega o gesto **depois** que a ONDA-SISTEMA-02 o
soltar. Se a ordem inverter, o produto fica com dois interruptores para o mesmo
microfone; se a ONDA-SISTEMA-02 não correr, esta sprint não pode fechar.

## O SELETOR TEM QUATRO ESTADOS, NÃO DOIS (27/08/2026, à noite)

**Esta sprint estava escrita com liga/desliga, e ela pediu quatro.** Palavra dela:

> *"cadê o botão pra escolher como o microfone do DualSense será lido. Se via
> nativa e o jogo reconhece. Se via emulador criando um dispositivo virtual pra
> funcionar mesmo em jogos que exigem modo Steam Input ou Xbox, ou desligado.
> Dessa forma sempre teríamos microfone no PC e nos jogos."*

O mockup `08-conexoes.html` oferece `Ligado` / `Desligado`. **É pouco**, e o que
falta é justamente o estado que resolve o problema real.

### Os quatro estados

| estado | o que faz | quando serve |
|---|---|---|
| **Nativo** | o microfone entra como canal do próprio DualSense; o jogo o enxerga como microfone do controle | o jogo sabe o que é um DualSense e pega o mic sozinho |
| **Emulado** | o Hefesto cria um **dispositivo de captura virtual** e entrega o áudio do controle por ele | **o caso que hoje não tem cura**: o jogo roda em máscara Xbox 360 ou sob Steam Input, não sabe que existe um DualSense, e perde o microfone |
| **Automático** | escolhe entre os dois pelo que o jogo aceita | o padrão que ela vai querer |
| **Desligado** | nenhum programa enxerga o microfone de controle nenhum | ela pedindo silêncio |

### Por que o Emulado é o ponto

Quando o jogo vê o controle como **Xbox 360**, ele não recebe giroscópio,
acelerômetro nem touchpad — isso a aba Controles já diz. **O microfone cai na
mesma vala, e ninguém tinha notado**: máscara Xbox não tem microfone no
protocolo, então o jogo não pergunta por ele.

O mic continua funcionando no PC (o PipeWire o enxerga), mas **some do jogo**. O
estado Emulado existe para essa lacuna: o áudio do controle sai por um
dispositivo que qualquer jogo enxerga, independentemente da máscara.

A frase dela nomeia o alvo: **"sempre teríamos microfone no PC e nos jogos"**.

### O que isso exige, e o que ainda não foi medido

1. **Criar a fonte virtual de captura.** O produto já cria gamepad virtual
   (`integrations/uinput_gamepad.py`) e já mexe no WirePlumber
   (`scripts/fix_wireplumber_default_source.sh`). Fonte virtual de áudio é
   trabalho novo — provavelmente um `module-null-sink` + loopback do PipeWire.
2. **NÃO MEDIDO:** a latência do caminho emulado contra o nativo. Microfone de
   jogo com atraso é pior que microfone ausente, e isso precisa de número antes
   de virar o padrão do Automático.
3. **NÃO MEDIDO:** se o mic pelo rádio aguenta o caminho emulado. Ele já custa
   16,3 fatias do orçamento (`ONDA-CONEXOES-07:42,52` — 260,4 sem microfone,
   276,7 com); o emulado pode custar mais.

   **REFERÊNCIA CORRIGIDA (27/08/2026, à noite):** esta linha apontava para
   `ONDA-CONEXOES-11`, que não existia — a conta do rádio é da
   **ONDA-CONEXOES-07**. A `ONDA-CONEXOES-11` nasceu no mesmo dia, e é outra
   coisa: a leitura da cor do plástico pelo rádio.
4. **Onde o estado mora.** É por máquina (como esta sprint trata o liga/desliga)
   ou por perfil? Um jogo em máscara Xbox quer Emulado; o de fora quer Nativo —
   o que empurra para **por perfil**, e isso muda o dono do campo. **Decisão dela.**

### As duas ausências têm sprint, e ela corre antes desta

**`ONDA-CONEXOES-13 — quanto custa o microfone emulado`** (`bancada: true`,
`depois_de: []`) mede as duas: a latência do emulado contra a do nativo, e o que
o emulado custa no orçamento de 1.600 fatias. Ela não escreve produto — a
medição É o entregável.

**Enquanto ela não correr, o Automático é palpite**, e palpite que vira padrão é
afirmação forte sem teste que a sustente. Quem executar esta sprint antes da 13
entrega os três estados que existem (Nativo, Emulado, Desligado) e deixa o
Automático **declarado como pendente na tela** — buraco declarado, não descuido.

### A régua que prova
Com o jogo em máscara **Xbox 360** e o estado em **Emulado**, o microfone do
controle tem de aparecer para o jogo. Com o estado em **Nativo**, na mesma
máscara, não aparece — e é essa diferença que prova que o caminho emulado existe
de verdade, e não é o nativo com outro nome.
