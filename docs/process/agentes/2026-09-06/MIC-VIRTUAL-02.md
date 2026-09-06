# MIC-VIRTUAL-02 — o microfone pelo rádio, e a tela que conta quatro

Agente **C-MIC-VIRTUAL-02** da ONDA C da leva de 06/09/2026. Árvore
`/mnt/Apate/Desenvolvimento/hefesto-voo/hefesto-voo/MIC-VIRTUAL-02-C-MIC-VIRTUAL-02`,
branch `voo/MIC-VIRTUAL-02-C-MIC-VIRTUAL-02`, nascida de `onda/atual-0609`
(`3f6855a6`, conferido no `git log -1` antes da primeira linha).

**Estado na entrega: TODOS VERDES — 44 portões.** Dois commits:
`d8901de0` (a cura) e `16099058` (as consequências de portão).

---

## 0. A LINHA QUE DECIDE ESTE RELATÓRIO

**NÃO HÁ DUALSENSE NO RÁDIO NESTA BANCADA, e por isso a prova que ela pediu —
*dois controles no rádio, os dois com microfone ouvido no canal de cada um* —
NÃO FOI FEITA.** Medido no sysfs antes de qualquer código, e é uma medição, não
uma desculpa:

```
/sys/class/hidraw/hidraw7  HID_ID=0003:0000054C:00000CE6   ← bus 0003 = USB
/sys/class/hidraw/hidraw5  HID_PHYS=hefesto-vpad           ← o vpad do Hefesto
```

`nos_dualsense_bluetooth()` filtra `bus == 0x05` (`BUS_BLUETOOTH`). Com um
DualSense **no cabo** e o vpad, ela devolve `[]`. Não havia o que ligar.

O que ISSO permite e o que não permite está separado nas §3 e §4, e a regra que
o corte respeita é a da sprint: **a ordem é dela e não se inverte — prova em
dois controles ANTES de trocar os chamadores.** Os chamadores **não foram
trocados**: a regra 0 mora dentro de `escolher_fonte` e os seis chamam aquela
função. Nenhum dos seis arquivos mudou de linha.

---

## 1. O QUE FECHOU

### 1.1 O rádio publica `hefesto_mic_<hex6>` — e o defeito era o NOME

A ponte publicava `hefesto_dualsense_bt_<hex6>`: o TRANSPORTE dentro do nome do
microfone. Trocar o cabo pelo rádio trocava o nome do microfone daquele
controle, e todo app que tivesse fixado o device o perdia.

`PonteMicBluetooth._abrir_o_canal_por_controle` passa a pedir o nó ao DONO dele
(`canal_do_microfone.abrir`) e a entregar o PCM decodificado pela MESMA
`SourceVirtualPipeWire.escrever` por onde o cabo entrega o dele. **Um nó, uma
entrada, dois transportes** — o mecanismo não foi reescrito, foi reusado.

**O CAMINHO DE VOLTA FICA INTEIRO**, e é o que torna a troca reversível: sem
`HID_UNIQ` (o BT recém-pareado), ou com o canal recusando subir, a ponte publica
o nó de sempre com o nome de sempre. O rádio nunca fica sem microfone por causa
desta mudança — que era exatamente a razão do corte por REVERSIBILIDADE que a
`ONDA5-MIC-VIRTUAL-01` escreveu.

**E o mudo de fábrica veio de graça**: quem desmuta é `abrir`, do dono do canal.
A ponte não ganhou um segundo `set-source-mute`.

### 1.2 O `0x32` segue o ouvinte da source

Estava escrito no cabeçalho do `daemon/subsystems/bt_mic.py` desde 03/09, no
presente: *"A ponte do rádio não sabe fazer isso: `PonteMicBluetooth.iniciar()`
manda o `0x32` de LIGAR incondicionalmente, e daí o controle transmite áudio o
tempo todo, ouvido ou não."*

Agora `_talvez_seguir_a_source` pergunta ao servidor **tem alguém gravando deste
nó AGORA?** e escreve o 0x32 só na BORDA. Medido na máquina dela:

```
sem ouvinte  -> SUSPENDED
COM ouvinte  -> RUNNING     ← o único estado que quer dizer "tem app gravando"
ouvinte saiu -> IDLE
```

**`IDLE` não é ouvinte**, e essa distinção é o ponto inteiro: depois que o último
app solta o nó ele fica IDLE e não volta a SUSPENDED. Tratar IDLE como ouvinte
deixaria o microfone dela ligado para sempre depois da primeira gravação — o
defeito de hoje com outro nome.

**"Não sei" nunca muda nada.** Estado ilegível (nó fora da lista, `pactl` mudo,
source injetada que não sabe responder) deixa o pedido como estava; no start
isso é o comportamento de antes, palavra por palavra. Desligar por falta de
instrumento seria o *"silêncio não é sucesso"* com o sinal trocado.

Isso é a **PEÇA C da CANAL-POR-CONTROLE-01** — *"a ponte captura mesmo sem
ouvinte"* — fechada pelo rádio. E fecha a assimetria que o cabeçalho do
subsystem usava para justificar a trava: o canal do rádio agora pode existir sem
capturar, como o do cabo.

### 1.3 A prioridade que NUNCA chegava ao nó

**Isto não estava na sprint. Foi medido, e é o achado mais caro deste dia.**

A `ONDA5-MIC-VIRTUAL-01` relatou (§5 do relatório dela) que o `source_properties`
da ponte de rádio perde tudo depois do primeiro espaço. Confirmado no PipeWire
1.6.8 dela, carregando os dois nós lado a lado e **LENDO O NÓ**:

```
A) como a ponte montava até hoje (sem aspas):
     Description      = Microfone           ← era "Microfone DualSense BT (…)"
     priority.session = 2000                ← o padrão do pipewire-pulse
B) o MESMO, entre aspas duplas:
     Description      = Microfone DualSense BT (aa:bb:cc:00:00:01)
     priority.session = 1500                ← o nosso
```

`PRIORIDADE_SESSAO_DA_PONTE = 1500` carrega a medição de 03/09 na máquina dela,
tem um portão de dois sítios guardando o número contra o drop-in 51 do
WirePlumber, e **nunca chegou ao nó**. O canal do rádio nascia em 2000 —
encostado na captura real da placa (2009, o teto medido) em vez de na faixa que
a MONITOR-QUE-VENCE-01 fixou.

A cura é `propriedades_da_source`, com aspas duplas em volta da lista inteira.
Provado no aparelho: o nó agora nasce com `priority.session = 1500` e a descrição
completa (§3).

### 1.4 O `LC_ALL=C` que faltava em `AudioControl._run`

Medido com o `LANG=pt_BR.UTF-8` dela:

```
pactl set-source-mute <nó> 1 ; pactl get-source-mute <nó>
    sem LC_ALL   ->  Mute: sim
    com LC_ALL=C ->  Mute: yes
desmutado, sem LC_ALL         ->  Mute: não
```

`_query_pactl_muted` responde `"yes" in saida.lower()`. Nem `sim` nem `não`
contêm `yes` — **nesta máquina a leitura devolvia False sempre**, e
`toggle_default_source_mute` afirmava *"o microfone está no ar"* tivesse ele
mutado ou não. O aparelho obedecia; quem mentia era a leitura de volta.

**É DÍVIDA LATENTE, NÃO DEFEITO VIVO, e dizer isso é parte da entrega:** nenhum
caminho de `src/` chama `toggle_default_source_mute` hoje — o botão do microfone
deixou de passar por ele em 01/09, e há régua que reprova se voltar
(`test_bt_e_vpad_01.py`). O que o torna digno de conserto é a causa: **este mesmo
arquivo já registra o defeito duas vezes, por outras duas portas** (15/08/2026,
`fonte_de_captura_do_controle` e `_texto_do_pactl`), e as duas ganharam o
ambiente. Esta ficou de fora — que é a forma desta casa de deixar meia cura viva.
*Quando a cura conhece a causa, ela cobre TODOS os chamadores.*

### 1.5 A régua que CONTA os chamadores — e o enunciado da sprint estava errado

A §1.2 da sprint diz *"os QUATRO chamadores de `escolher_fonte`"*. **São SEIS**,
medidos por AST em 06/09/2026:

| chamador | o que ele pergunta |
| --- | --- |
| `integrations/eleicao_de_microfone.py` | quem vira o padrão do sistema |
| `integrations/audio_control.py` | onde escrever o volume daquele card |
| `integrations/quem_ouve_o_microfone.py` | QUEM te escuta |
| `daemon/subsystems/luz_do_mic.py` | POR ONDE ler o nível |
| `app/mic_monitor.py` | o medidor de cada card |
| `integrations/fontes_de_captura.py` (`escolher_sink`) | delega, e a regra 0 é inerte |

O número veio do docstring de `escolher_fonte`, que lista *"a eleição, a luz, o
áudio da janela e o `escolher_sink`"* — e envelheceu duas vezes:
`audio_control.py` entrou em 03/09 (quando `fonte_de_captura_do_uniq` deixou de
ser uma segunda régua) e **a luz virou DOIS** (`quem_ouve_o_microfone` responde
QUEM, `luz_do_mic` responde POR ONDE).

`test_o_censo_dos_chamadores_de_escolher_fonte_nao_envelhece` conta por AST e
reprova nos DOIS sentidos, nomeando quem entrou e quem saiu. É a régua que a
sprint chama de *"a que impede o defeito de 05/09 de acontecer pela terceira
vez"*, e ela não digita o número: mede.

---

## 2. AS MORDIDAS — cada cura arrancada, cada régua vista reprovar

Dez arrancamentos, dez vermelhos. O roteiro está em
`<scratchpad>/C-MIC-VIRTUAL-02-mordidas.sh`; a saída inteira em
`C-MIC-VIRTUAL-02-mordidas.txt`.

```
MORDIDA — arranquei o canal por controle (o rádio volta ao nome do transporte)
E  AssertionError: o rádio publicou 'hefesto_dualsense_bt_000001'. O nome com
   IDENTIDADE é o que faz o microfone daquele controle ser o mesmo nos dois
   transportes — que é o 'Mic virtual' que ela pediu.
FAILED …::test_o_radio_publica_o_no_com_nome_de_controle

MORDIDA — arranquei a alimentação (o PCM decodificado não entra no nó)
E  AssertionError: o PCM não chegou ao outro lado do nó: 0 bytes, e a ponte diz
   ter decodificado 1 quadros
FAILED …::test_o_audio_do_radio_sai_do_outro_lado_do_no

MORDIDA — congelei o 0x32 (liga sempre, como era antes de hoje)
E  AssertionError: a ponte ligou o microfone do controle sem ninguém gravando do
   nó: [3, 2]
FAILED …::test_sem_ouvinte_o_radio_nao_pede_o_microfone

MORDIDA — tratei IDLE como ouvinte (o mic fica ligado depois da 1a gravação)
E  AssertionError: o ouvinte saiu e o microfone continuou no ar: [3, 3]
FAILED …::test_o_ouvinte_que_sai_desliga_o_microfone

MORDIDA — fiz o 'nao sei' virar 'ninguem esta ouvindo'
E  AssertionError: a ponte desligou o microfone porque não conseguiu PERGUNTAR
   quem estava ouvindo: [3, 2]
FAILED …::test_nao_sei_nunca_vira_ninguem_esta_ouvindo

MORDIDA — fiz a ponte fechar o canal que nao era dela
E  AssertionError: a ponte derrubou um canal que não era dela — o microfone de
   quem chegou antes sumiu no `parar()` de outro controle
FAILED …::test_a_ponte_nao_derruba_o_canal_de_quem_ela_nao_abriu

MORDIDA — arranquei as ASPAS do source_properties
E  AssertionError: a prioridade não sobrevive ao parser do servidor: o nó nasce
   com o padrão do pipewire-pulse. O servidor leu {'device.description': 'Microfone'}
FAILED …::test_a_prioridade_chega_ao_no_e_nao_so_ao_argv

MORDIDA — arranquei o LC_ALL do AudioControl._run
E  AssertionError: a leitura do mudo roda no idioma da sessão dela, e o `pactl`
   TRADUZ: a resposta passa a ser sobre o idioma do shell, não sobre o aparelho
FAILED …::test_o_audio_control_le_o_mudo_em_lingua_que_ele_entende

MORDIDA — arranquei a REGRA 0 de escolher_fonte
FAILED …::test_a_regra_0_alcanca_a_eleicao
FAILED …::test_a_regra_0_alcanca_o_volume_por_controle
FAILED …::test_a_regra_0_alcanca_quem_ouve
FAILED …::test_a_regra_0_alcanca_a_luz
FAILED …::test_a_regra_0_alcanca_o_medidor_da_janela
5 failed, 17 deselected

MORDIDA — tirei UM chamador do censo (o da luz)
E  AssertionError: CHAMADOR NOVO de `escolher_fonte`:
   ['daemon/subsystems/luz_do_mic.py']. Ele passa pela regra 0?
FAILED …::test_o_censo_dos_chamadores_de_escolher_fonte_nao_envelhece
```

### A MORDIDA QUE MOSTROU QUE TRÊS RÉGUAS MINHAS NÃO MEDIAM NADA

**Na primeira volta, a mordida da regra 0 derrubou só DUAS das cinco réguas
dirigidas.** As outras três — `quem_ouve`, a luz e o medidor da janela — ficaram
VERDES com a cura arrancada, porque eu as escrevi com **um** controle e **uma**
fonte: nessa mesa, quem responde é a regra 4 (*um para um*), não a 0.

Reescritas com DOIS controles e DOIS canais, a regra 4 não pode disparar (ela
exige um único candidato), o casamento por USB não existe (rádio não tem placa)
e a regra 1 não casa (o nome não é `bluez_`). **Só a regra 0 pode responder** —
e as cinco passaram a reprovar. A explicação está no docstring de `_dois_canais`,
para que a próxima pessoa não repita a mesa de um.

*Régua que passa com a cura arrancada não mede nada, e três das minhas eram
assim.*

### E O INSTRUMENTO FALSO DA IRMÃ FOI CONFIRMADO NO APARELHO

Com as aspas arrancadas — o produto voltando a nascer com prioridade 2000 —
`tests/unit/test_o_canal_do_radio_nao_perde_para_um_monitor.py` seguiu **5 passed**.
As quatro réguas daquele arquivo sobre o número continuam verdes sobre um nó que
nasce errado, porque `test_a_prioridade_viaja_de_verdade_no_load_module` (:139)
verifica `"priority.session=1500" in props[0]` — e a string ESTÁ no argv, dentro
do pedaço que o servidor descarta. **A régua mede o TEXTO do comando.** O diff
que a cura está na §6.

---

## 3. O QUE MEDI NO APARELHO

Bancada **LIVRE** (`bash scripts/bancada.sh exigir` → rc=0) antes de cada
medição. Nada parou o daemon, nada escreveu no controle, nada tocou no
`default-source` dela — conferido antes e depois, e sempre intacto.

**A ORIGEM DE ÁUDIO É SINTÉTICA**: tom de 440 Hz com amplitude 20000, gerado em
Python. **Nada do microfone dela foi lido em momento nenhum.**

Roteiro em `<scratchpad>/C-MIC-VIRTUAL-02-prova-de-bancada.py`, com o código
DESTA árvore (`src` conferido no cabeçalho da saída):

```
default-source ANTES = alsa_input.usb-…DualSense…-00.iec958-stereo

1) o NOME que o rádio passa a publicar: hefesto_mic_000001
   canal.de_pe() -> {'aa:bb:cc:00:00:01': 'hefesto_mic_000001'}

2) O QUE CHEGOU AO NÓ (a cura das aspas):
   Description        = Microfone DualSense BT (aa:bb:cc:00:00:01)
   Mute               = no
   priority.session   = 1500          ← a constante é 1500; ANTES chegava 2000

3) O ESTADO SEGUE O OUVINTE:
   sem ouvinte  -> SUSPENDED
   COM ouvinte  -> RUNNING
   ouvinte saiu -> IDLE

4) O ÁUDIO SAI DO OUTRO LADO DO NÓ:
   bytes colhidos = 290816
   pico da amostra = 20000   (o tom sintético vale 20000)
   O ÁUDIO ENTREGUE POR `escrever` É OUVIDO NO CANAL: SIM

DESMONTADO — residual no PipeWire: nada
default-source DEPOIS = alsa_input.usb-…DualSense…-00.iec958-stereo
MEXEU NO PADRÃO DELA : não
```

**UM FATO DA IRMÃ QUE NÃO SE REPRODUZIU, e ele fica registrado sem derrubar a
cura dela.** O relatório da `ONDA5-MIC-VIRTUAL-01` §2 diz que *todo*
`module-pipe-source` nasce `Mute: yes` no PipeWire 1.6.8, inclusive com nome
sorteado. Medido hoje, no mesmo servidor, com quatro nós — dois com nome novo em
folha e um sorteado:

```
module-pipe-source recém-carregado, nome nunca visto  ->  Mute: não
```

Não reproduzi o mudo de fábrica. **Não desfiz nada por causa disso**: a medição
dela é forte (192 KB de zeros contra pico 20000 com a mesma origem), o
`desmutar` é idempotente e barato, e o caminho do rádio agora passa por ele de
graça. O que a divergência diz é que a condição do mudo **não é só a versão** —
alguma outra coisa participa, e ninguém sabe qual. Fica como pergunta aberta,
não como fato corrigido.

### As três falhas do MEU instrumento, na primeira volta

Escrevo porque duas delas produziram respostas convincentes e falsas:

1. **`pactl list sources short` é separado por TAB, e o campo de formato tem
   ESPAÇOS dentro** (`s16le 1ch 48000Hz`). Quebrar por espaço em branco devolve
   `1ch` no lugar do estado — e a primeira medição disse `1ch` para o nó **com
   ouvinte e sem**, o que se lê como *"o estado não segue nada"*.
2. **As aspas do `source_properties` são caracteres do VALOR, não do shell.** Na
   primeira volta pus aspas de shell, e o caso B deu 2000 igual ao A — o que se
   lê como *"a cura da irmã não funciona"*. Ela funciona; o instrumento é que
   estava errado.
3. Um **crase dentro de uma string de aspas duplas** executou um comando no meio
   do relatório do meu próprio script.

---

## 4. O QUE MEDI COM DUBLÊ — e o que o dublê tem de mais fiel

`tests/unit/test_o_microfone_pelo_radio_alimenta_o_no.py`, 22 réguas.

O dublê `_PactlDeMentira` **faz o que o `module-pipe-source` faz**: cria o fifo e
segura a ponta de LEITURA. Sem isso o `os.open(..., O_WRONLY | O_NONBLOCK)` do
produto daria ENXIO, o `iniciar()` recuaria, e a régua mediria o caminho de falha
achando que mede o de sucesso. Com ele, a classe de PRODUÇÃO é exercitada
inteira — do `load-module` ao byte que sai do outro lado — sem falar com o
PipeWire dela.

O que só o dublê alcança, e é o núcleo da sprint:

* **o 0x32 escrito no controle**, lido de um `socketpair` que faz o papel do
  hidraw: quais bytes, em que ordem, e em que borda;
* os **dois valores** do estado e a **transição** entre eles;
* os **quatro controles** com quatro canais de nome próprio;
* a eleição escrevendo o padrão do sistema **sem tocar em canal nenhum**.

---

## 5. O QUE **NÃO** VERIFIQUEI

1. **A PROVA DE APARELHO QUE ELA PEDIU: dois controles no RÁDIO, os dois com o
   microfone ouvido no canal de cada um.** Não havia DualSense no rádio (§0).
   **Nenhum byte de 0x32 foi escrito num controle de verdade nesta sprint** — o
   protocolo continua com a prova de 25/07/2026, que não é minha.
2. **O firmware com o nó novo.** O `hefesto_mic_<hex6>` foi provado no PipeWire
   com PCM sintético; a cadeia completa *quadro Opus do rádio → decodificador →
   `escrever` → nó → app* nunca correu com áudio de verdade.
3. **O ciclo de vida em campo.** `_canal_e_nosso` protege o canal de quem chegou
   antes, e isso está medido no dublê. O caso REAL de colisão — o mesmo controle
   no cabo E no rádio ao mesmo tempo, com dois escritores no mesmo fifo — não foi
   medido nem construído; é o corner que o desenho declara e não resolve.
4. **O custo do `pactl` por segundo com quatro pontes de pé.** `_OLHAR_NA_SOURCE_S
   = 1.0` é um `pactl list sources short` por segundo por controle com ponte. Não
   medi o custo agregado com quatro; a conta que fiz foi de latência (mais lento,
   ela aperta "gravar" e espera), não de carga.
5. **A tela.** Nenhuma página foi aberta: a sprint não toca `interface/paginas/`
   (`nao_toca`) e nenhum campo de tela mudou. O que medi por grep é que **não há
   nenhum limite de UM microfone no meu escopo** — as pontes, os canais e a
   resolução são todos por `uniq`.
6. **A suíte inteira em doze lotes.** É de quem coordena, e roda no fim. Rodei o
   escopo do microfone (100 arquivos, **1457 testes**, §7).

---

## 6. O QUE É FORA DA POSSE — os diffs, para quem costurar arbitrar

### 6.1 APLIQUEI (e são consequência mecânica da cura, não desenho novo)

Três arquivos fora da posse ficaram VERMELHOS por causa das minhas linhas.
Entregar 41/44 dizendo *"alguém conserta o que eu quebrei"* seria pior; então
apliquei o mínimo e declaro aqui, para o costureiro descartar se colidir.

**a) `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` — 14 lápides
apagadas.** O portão exige: *"APAGUE a entrada. A cura chegou e a lápide ficou."*
Conferido que na base `3f6855a6` o portão está VERDE — as 14 caíram por minha
causa.

* **as SEIS do `canal_do_microfone`**: a lápide de `abrir` PREVIU o próprio fim,
  com endereço, dizendo que quem daria o gesto seria a ONDA5-MIC-VIRTUAL-02. Deu
  — pelo RÁDIO, e não pelo CABO como ela apostava. `alimentando` **FICA**: o
  rádio não usa alimentador nenhum.
* **as OITO da PEÇA A (`quem_ouve_o_microfone`)**: caíram por um motivo que **não
  é o que a lápide previa**, e a nota que escrevi diz isso com todas as letras.
  Elas esperavam fechar quando alguém provasse que o import de `luz_do_mic.py:333`
  pode ser estático — **ninguém provou, e o import de lá continua dinâmico**. O
  que aconteceu foi outro: `canal_do_microfone` importa uma constante deste
  módulo estaticamente, e com a ponte chamando `abrir` o módulo inteiro entrou no
  fecho de import. A pergunta que a lápide fazia — *o que acontece com o daemon
  se o `pactl` sumir da máquina* — **continua sem instrumento e sem dono.**
  Há precedente idêntico duas notas abaixo, de 05/09 (`ondas_de_som.py`).

**b) `docs/data/mapa-controles.csv` — cinco endereços `arquivo:linha`
reapontados.** Só números de linha que as minhas edições moveram; **nenhuma
afirmação mudou**:

```
dualsense_bt_audio.py:558 -> :579   (_MODULO_PIPE_SOURCE)     2 células
dualsense_bt_audio.py:248 -> :269   (montar_pedido_de_mic)    1 célula
dualsense_bt_audio.py:226 -> :247   (BLOCO_SPEAKER)           2 células
bt_mic.py:173             -> :181   (habilitado_por_env)      1 célula
audio_control.py:283      -> :314   (fonte_de_captura_do_uniq) 1 célula
```

**c) `html/specs.html`** — regerado por `scripts/gerar-mapa.py`, que é o que o
portão `mapa-de-canais` manda fazer quando o CSV muda.

### 6.2 NÃO APLIQUEI — o diff exato, para quem tiver a posse

**a) O INSTRUMENTO FALSO com endereço**, herdado da irmã e agora CONFIRMADO no
aparelho: `tests/unit/test_o_canal_do_radio_nao_perde_para_um_monitor.py:139`,
`test_a_prioridade_viaja_de_verdade_no_load_module`. Ele mede o argv; o nó nascia
com 2000. Com a cura arrancada ele fica VERDE (medido hoje: `5 passed`).

```diff
-    props = [a for a in argv if a.startswith("source_properties=")]
-    assert props, "o `load-module` foi montado sem `source_properties`"
-    assert f"priority.session={bt.PRIORIDADE_SESSAO_DA_PONTE}" in props[0], (
-        f"o argv leva {props[0]!r}, e a constante diz "
-        f"{bt.PRIORIDADE_SESSAO_DA_PONTE}. A régua estaria medindo uma constante "
-        "que o produto não usa."
-    )
+    props = [a for a in argv if a.startswith("source_properties=")]
+    assert props, "o `load-module` foi montado sem `source_properties`"
+    # LER COMO O SERVIDOR LÊ, e não como o texto do comando parece. Medido em
+    # 06/09/2026: sem ASPAS DUPLAS em volta do valor inteiro, o parser do
+    # `pipewire-pulse` descarta tudo depois do primeiro ESPAÇO — e a string
+    # "priority.session=1500" está justamente no pedaço descartado. O nó nascia
+    # com o 2000 padrão do servidor enquanto esta régua dava verde.
+    valor = props[0].split("=", 1)[1]
+    assert valor.startswith('"') and valor.endswith('"'), (
+        f"o `source_properties` não vem entre aspas duplas: {props[0]!r}. Sem "
+        "elas o servidor corta no primeiro espaço e a prioridade não chega ao nó."
+    )
+    assert f"priority.session={bt.PRIORIDADE_SESSAO_DA_PONTE}" in valor[1:-1], (
+        f"o argv leva {props[0]!r}, e a constante diz "
+        f"{bt.PRIORIDADE_SESSAO_DA_PONTE}."
+    )
```

Enquanto ele não for curado, quem cobre o caso é
`test_o_microfone_pelo_radio_alimenta_o_no.py::test_a_prioridade_chega_ao_no_e_nao_so_ao_argv`,
que quebra o valor com `shlex` do jeito que o servidor quebra.

**b) O GESTO DO CABO — a dívida que a irmã me deixou e que eu DEVOLVO, com a
razão.** `eleicao_de_microfone.pedir_canal` chamando
`canal_do_microfone.abrir(uniq, descricao, fonte=<o nó ALSA>)` quando o
transporte for cabo. `eleicao_de_microfone.py` **é** da minha posse; o que falta
não está nela.

**Por que não fiz:** *ninguém FECHA o canal do cabo.* No rádio a ponte é dona do
ciclo de vida — ela abre no `iniciar()` e fecha no `parar()`, e o `parar()` tem
um chamador de verdade (`GerenciadorMicBluetooth.reconciliar`, quando o controle
sai da mesa). No cabo não existe esse dono: `pedir_canal` só abriria, e cada
toque dela no botão do microfone deixaria um `parec` vivo gravando o microfone
dela **para sempre**, sem nada que o encerrasse. O lugar do fecho é
`daemon/subsystems/hotkey._eleger_ou_devolver`, que está fora desta posse.

**O QUE FECHA:** a mesma leva que der ao cabo um `fechar` com chamador. Sem isso,
o gesto trocaria uma dívida declarada (o canal do cabo não sobe) por um vazamento
calado (o canal do cabo nunca desce) — e a segunda é pior, porque envolve o
microfone dela ligado.

---

## 7. AS RÉGUAS, E O VERMELHO QUE JÁ ESTAVA LÁ

```
44 portões                                            TODOS VERDES
tests/unit/test_o_microfone_pelo_radio_alimenta_o_no  22 passed
o escopo do microfone (100 arquivos)                  1457 passed, 2 skipped,
                                                      1 xfailed, 1 FAILED
```

**O ÚNICO VERMELHO É HERDADO, e medido como tal:**
`tests/unit/test_a_regua_do_radio_da_08_nao_e_um_eixo_sozinho.py::test_com_alguem_no_radio_a_regua_continua_como_era`
reprova (*"a régua deixou de nomear o controle que está NO rádio"* — a pista sai
com `Nenhum controle neste rádio`). **Ele reprova igual em `3f6855a6`**, com a
minha árvore inteira revertida — conferido com `git checkout 3f6855a6 -- src/
tests/`. Não é meu, não toca arquivo meu, e é da aba 08.

É a armadilha que a irmã nomeou hoje de manhã: *um vermelho herdado se lê como
"o agente quebrou algo"*. O que revela é comparar com a base.

---

## 8. O TEXTO PRONTO — `mockup/DIVERGENCIAS.md`

**NADA A ACRESCENTAR, e a razão é do desenho:** esta sprint não mexeu em
`mockup/` nem em `interface/paginas/` (os dois no `nao_toca`), não criou campo,
não criou gesto e não mudou uma palavra de tela. O nome do nó é interno — a tela
nunca mostrou `hefesto_dualsense_bt_<hex6>` nem mostrará `hefesto_mic_<hex6>`, e
`uniq` é palavra proibida em texto de tela pelo glossário.

`scripts/check_o_desenho_aprovado.py` está VERDE sem seção nova, e uma seção
declarando divergência que não existe seria o inverso do que aquele arquivo
existe para guardar.

**O que a próxima frente de TELA vai precisar saber**, se e quando pintar isto:

```
## 02-controles.html
- **DD/MM/AAAA** — o microfone pelo RÁDIO deixou de capturar sem ouvinte
  (MIC-VIRTUAL-02). Se a tela um dia disser "microfone no ar", ela tem de ler o
  ESTADO e não o pedido: a ponte pode estar de pé com o microfone desligado, que
  é o estado certo quando ninguém está gravando. O dono da resposta é
  `dualsense_bt_audio.SourceVirtualPipeWire.estado()`; a palavra da tela é
  "rádio", nunca "bt".
```

## 9. O TEXTO PRONTO — as linhas do CSV da paridade

`docs/data/mapa-controles.csv`, linha `audio.microfone` / `dualsense`. **Não
apliquei** (o CSV é da paridade, fora da posse); as células abaixo estão prontas
e cada afirmação forte tem o teste que a sustenta ao lado, que é o que
`check_paridade_transporte.py` cobra.

| coluna | valor pronto |
| --- | --- |
| `radio_aciona` | `sim` — **e só com a linha `teste_que_morde` abaixo**; hoje está `parcial` |
| `radio_canal` | `hidraw` (inalterado) |
| `radio_ate_onde_foi` | *(hoje vazia)* → `06/09/2026: o canal do rádio passou a ser o nó COM IDENTIDADE do controle (hefesto_mic_<hex6>, integrations/dualsense_bt_audio.py::PonteMicBluetooth._abrir_o_canal_por_controle), o mesmo nó dos dois transportes; e o 0x32 passou a seguir o estado da source (RUNNING liga, o resto desliga), de modo que o controle não captura mais sem ouvinte. NÃO MEDIDO NO APARELHO: não havia DualSense no rádio na bancada de 06/09 — a cadeia foi provada no PipeWire vivo com PCM sintético, e o 0x32 só em dublê.` |
| `radio_ressalva` | **acrescentar ao fim**: ` E DESDE 06/09/2026 o preço só se paga com alguém ouvindo: sem ouvinte o 0x32 fica desligado, então os 106,2 Hz de áudio não ocupam o link.` |
| `radio_codigo_ref` | acrescentar `src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py:1283 (_talvez_seguir_a_source); :1166 (_abrir_o_canal_por_controle)` |
| `teste_que_morde` | acrescentar `tests/unit/test_o_microfone_pelo_radio_alimenta_o_no.py::test_o_radio_publica_o_no_com_nome_de_controle; ::test_o_audio_do_radio_sai_do_outro_lado_do_no; ::test_sem_ouvinte_o_radio_nao_pede_o_microfone; ::test_o_ouvinte_que_sai_desliga_o_microfone` |
| `mordida` | acrescentar `arrancar o `_abrir_o_canal_por_controle` devolve o nome do transporte; congelar o 0x32 em LIGAR faz a régua do "sem ouvinte" reprovar; tratar IDLE como ouvinte faz a do "ouvinte que sai" reprovar` |

**A CÉLULA QUE EU NÃO PREENCHERIA COM "sim" SOZINHA:** `radio_aciona` só sai de
`parcial` quando alguém escrever o 0x32 num DualSense de verdade pelo rádio e
ouvir o áudio. **Esta sprint não fez isso** (§5.1). Enquanto não fizer, a
afirmação forte é sobre o NÓ e o ESTADO — que estão medidos — e não sobre o
firmware.

---

## 10. OS COMANDOS, para quem quiser repetir

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/hefesto-voo/MIC-VIRTUAL-02-C-MIC-VIRTUAL-02
source .envrc-voo
bash scripts/bancada.sh exigir
/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python -m pytest \
    tests/unit/test_o_microfone_pelo_radio_alimenta_o_no.py \
    tests/unit/test_dualsense_bt_audio.py \
    tests/unit/test_o_canal_do_radio_nao_perde_para_um_monitor.py \
    tests/unit/test_o_canal_do_microfone_tem_nome_de_controle.py -q
git add -A && bash scripts/portoes.sh
```

**A prova de bancada não está versionada, pela mesma razão da irmã:** ela carrega
e descarrega módulos no PipeWire da máquina dela, e um script assim no
repositório é um convite a alguém rodá-lo sem ler. O que ela mede está inteiro na
§3, e a peça toda é reprodutível pelas réguas acima, que não tocam em áudio
nenhum.
