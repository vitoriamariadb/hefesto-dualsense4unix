# BARRA-MUDA-01 — a lâmpada não se lê; o nascimento, sim

**22/08/2026.** Frente E1 da leva da lightbar, sob a pergunta dela:

> *"pq isso não tá impactando e funcionando na interface da gente? o que
> deixamos de fazer na integração?"*

E sob o encargo desta frente: **achar um sinal HONESTO de "a barra está
acesa"** — porque hoje o produto não tem como saber se a luz acendeu, e por
isso não saberia QUANDO aplicar a cura da reconexão. Um produto que reconecta
controle no escuro é pior que um que não reconecta.

**Estado:** ENTREGUE, com uma pendência que só o olho dela fecha (o
experimento está escrito abaixo, um passo por linha).

**Território:** `integrations/sinal_da_barra.py` (novo),
`tests/unit/test_barra_muda_01_o_sinal_que_nao_le_a_lampada.py` (novo), este
documento. **Nada mais foi tocado** — os arquivos de lightbar estão com outra
frente, e os de `launch_env`/`install`/ponte com uma terceira.

---

## A resposta curta

**Não existe sinal de "a barra está acesa". Existe sinal de "esta conexão
nasceu condenada", e ele prevê a lâmpada.**

O sinal é: **outro processo estava segurando o nó `hidraw` deste controle no
instante em que a conexão nasceu?** Se estava, a barra não obedece — e não
volta a obedecer quando esse processo morre. Só a reconexão devolve.

Medido hoje contra o olho dela, seis instâncias, concordância **6 de 6**.

---

## 1. O que eu MEDI

Bancada: quatro DualSense no rádio, três adaptadores Bluetooth, Steam fechada
desde ~19h. O caso do encargo tinha acabado de acontecer, e por sorte a mesa
ficou com **as duas metades vivas ao mesmo tempo** — duas instâncias travadas e
duas sãs, lado a lado. É essa simultaneidade que torna esta medição possível.

### 1.1 As seis instâncias, e o que as separa

`journalctl -k -o short-precise`, linhas `Registered DualSense controller` e
`hidrawN: BLUETOOTH HID`:

| instância | nasceu | adaptador | `hw_version` | barra (olho dela) |
|---|---|---|---|---|
| `.0028` (input259) | 18:05:40.818 | `d8:44:89:00:00:c4` | `0x00000811` | APAGADA |
| `.0029` (input262) | 18:06:02.175 | `ac:a7:f1:00:00:41` | `0x00001111` | APAGADA |
| `.002A` (input266) | 18:06:14.854 | `ac:a7:f1:00:00:41` | `0x00000710` | APAGADA |
| `.002B` (input270) | 18:06:33.066 | `ac:a7:f1:00:00:ce` | `0x00000711` | APAGADA |
| `.0033` (input323) | 19:51:47.499 | `d8:44:89:00:00:c4` | `0x00000811` | **ACENDE** |
| `.0034` (input326) | 19:51:50.197 | `ac:a7:f1:00:00:41` | `0x00000710` | **ACENDE** |

O `hw_version` casa `.0028`→`.0033` e `.002A`→`.0034` **exatamente**: são os
dois controles que ela reconectou, e é a prova de que a tabela é a mesma
bancada em dois instantes. Guarde este campo — ele é a única impressão digital
do PLÁSTICO que sobrevive à reconexão (o MAC da instância muda, o `inputN`
muda, o sufixo muda, o `hw_version` não).

### 1.2 A diferença, e ela é única

`journalctl --user -u hefesto-dualsense4unix.service`, as duas janelas de
nascimento:

**18:05–18:06 (as quatro que travaram)** — uma linha por conexão, 0,64 s a
2,25 s depois do registro no kernel:

```
18:05:43.103  lightbar_escritor_cru_detectado nos=['/dev/hidraw6'] pids=[600105]
18:06:02.847  lightbar_escritor_cru_detectado nos=['/dev/hidraw7'] pids=[600105]
18:06:16.430  lightbar_escritor_cru_detectado nos=['/dev/hidraw8'] pids=[600105]
18:06:34.572  lightbar_escritor_cru_detectado nos=['/dev/hidraw9'] pids=[600105]
```

**19:51 (as duas que acenderam)** — nenhuma. Contado:

```
$ journalctl --user -u hefesto-dualsense4unix.service \
    -S "2026-08-22 19:45:00" -U "2026-08-22 20:05:00" | grep -c escritor_cru_detectado
0
```

**O pid 600105 era a Steam, e isso é medido, não suposto:** a linha
`escritor_cru_detectado` é alimentada por `core.escritor_cru.holders_de_hidraw`,
que **só varre os PIDs devolvidos por `pids_da_steam()`**. Nenhum outro processo
pode aparecer ali. O pid está morto desde então (`ps -p 600105` → nada), o que
fecha a janela: a Steam estava aberta às 18h e fechada às 19h51.

### 1.3 O fato que muda o desenho do produto

**As duas instâncias sujas continuam travadas AGORA**, com a Steam morta há uma
hora e o daemon parado durante o ensaio dela. Matar o culpado não cura. O
defeito é gravado no nascimento e persiste na instância.

Corolário, e é ele que explica o alerta dela de 12/08 (*"não é só instância de
conexão, se escavar o projeto vai ver que isso é um falso positivo
recorrente"*):

> **Reconectar só cura se a mesa estiver limpa NA HORA.** Com a Steam aberta, a
> instância nova nasce suja igual à velha, e a cura parece ter parado de
> funcionar. É a mesma cura e é a mesma doença — o que muda é uma condição que
> ninguém estava medindo.

Ela estava certa que "reconectar cura" é falso positivo recorrente. A causa não
é a conclusão estar errada: é a conclusão estar **incompleta**.

### 1.4 A varredura histórica

Quinze dias de diário (`journalctl --user`, 88.808 linhas), cruzando cada
`conexao_bt_nova` com `escritor_cru_detectado` na janela de 5 s. O detector de
escritor só existe desde 16/08, então o recorte útil é 16/08 → 22/08:

```
TOTAL desde 16/08 14:15 -> com escritor cru no nascimento: 5 | sem: 15
```

As cinco: as quatro de hoje 18:05–18:06, e uma em 16/08 20:37 — que é a noite
do `ESCRITOR-CRU-01`, quando ela relatou as barras apagadas com a Steam aberta.
Consistente.

**O limite desta varredura, dito na cara:** ela mede a CO-OCORRÊNCIA, não a
acurácia. O veredito dela (barra acesa ou não) só existe para as seis de hoje e
para o par de 12/08. Vinte pontos com rótulo em seis não é base para
`validade_dias` no mapa de canais, e por isso não preenchi célula nenhuma lá.

### 1.5 A bateria não serve — e é definitivo

O `ps-controller-battery` do `hid-playstation` registra **quatro** atributos:

```
capacity present scope status
```

Não há `current_now`, não há `voltage_now`, não há `power_now`. Não é ruído
demais: **o arquivo não existe.** Medido nos quatro nós. E `capacity` sai em
degraus de 5 % (o `nibble*10+5` da canônica), que não veria uma barra de LED
nem se existisse. Caminho 4 do encargo: **morto, e sem volta.**

### 1.6 O módulo, rodado contra a bancada viva

```
$ .venv/bin/python -m hefesto_dualsense4unix.integrations.sinal_da_barra
▲ d4:2f:4b:00:00:d8 (.0029): nasceu com 1 processo(s) segurando o nó do
  controle — nesta condição a barra não obedece, e só a reconexão devolve
▲ 14:3a:9a:00:00:ab (.002B): nasceu com 1 processo(s) segurando o nó do
  controle — nesta condição a barra não obedece, e só a reconexão devolve
● 44:46:48:00:00:03 (.0033): nasceu com o nó livre — nenhuma disputa
  registrada no nascimento
● a0:fa:9c:00:00:f0 (.0034): nasceu com o nó livre — nenhuma disputa
  registrada no nascimento

2 conexão(ões) suspeita(s).
```

**Bate com o olho dela nas quatro.** As duas `▲` são as que não obedecem ao
ciano; as duas `●` são as que obedeceram e devolveram a cor original.

---

## 2. O que eu LI e não medi

- **O report de ENTRADA do DualSense não carrega estado de LED.** Lido em
  `docs/protocol/driver-hid-playstation.md`, que por sua vez leu o fonte C:
  `dualsense_parse_report` toca sticks, botões, mudo do mic, jack, IMU,
  touchpad e bateria, e nada mais. E `ps_lightbar_register` **sequer instala um
  `brightness_get`** — crava `led_cdev->brightness = 255` e pronto;
- **Nenhum dos dezessete feature reports lidos em 14–15/08 devolve estado de
  LED.** Lido em `core/escritor_cru.py`, que já tinha percorrido este caminho e
  registrado o resultado. **Eu não repeti a leitura, e a decisão foi
  deliberada** — ver §4;
- **`LIGHTBAR-BT-CULPADO-01`** (`core/backend_pydualsense.py:2069`): o `0x08`
  dentro da janela de ~3,4 s pós-conexão trava a barra, 7 de 7. Foi REMOVIDO em
  03/08. Li, não remedi;
- **`LIGHTBAR-BT-RESET-01`** (mesmo arquivo): acusa as *feature reads* da adoção
  de derrubarem o claim no firmware. Essa acusação **nunca foi eliminada por
  medição** — a de 03/08 isolou o `0x08`, não as leituras.

---

## 3. As hipóteses que a minha medição DERRUBOU

Esta seção é obrigatória, e três das quatro eram minhas.

### 3.1 "O adaptador Bluetooth é o culpado" — DERRUBADA

O adaptador `ac:a7:f1:00:00:41` tem, na mesma mesa e ao mesmo tempo, **uma
instância travada (`.0029`) e uma sã (`.0034`)**. Um controle sadio e um doente
no mesmo rádio matam a hipótese sem precisar de segundo ensaio.

### 3.2 "Nascer junto com outra conexão causa o travamento" — DERRUBADA, e a correlação é INVERSA

Era a hipótese mais plausível, e vinha do próprio mapa (a nota de 12/08 diz que
a `.0016` travada nasceu *"com outra conexão subindo junto"*). Os intervalos
medidos:

| par | intervalo | resultado |
|---|---|---|
| `.0028` → `.0029` | 21,4 s | as duas travadas |
| `.0029` → `.002A` | 12,7 s | as duas travadas |
| `.002A` → `.002B` | 18,2 s | as duas travadas |
| `.0033` → `.0034` | **2,7 s** | **as duas sãs** |

As duas que nasceram mais perto uma da outra são justamente as que acenderam.
A simultaneidade de 12/08 era **coincidência com a Steam aberta**, não causa.

### 3.3 "O carimbo de tempo do sysfs serve de relógio de nascimento" — DERRUBADA, e por pouco

Esta quase virou o alicerce do módulo. Um `ls -la /sys/devices/virtual/misc/uhid/`
devolveu, às 19h59:

```
.0029  ago 22 18:06     .0033  ago 22 19:51
```

Que **bate exatamente** com o log do kernel. Convincente. Sete minutos depois,
um `os.stat()` nos mesmos quatro diretórios:

```
0029  22/08 19:59:07.662
002B  22/08 19:59:07.662
0033  22/08 19:59:07.662
0034  22/08 19:59:07.662
```

Os quatro idênticos. **Os carimbos do sysfs são artefato do cache de inode do
VFS, não data de nascimento** — o dentry é recriado sob demanda e o carimbo
nasce de novo com ele. Um instrumento que dá a resposta certa uma vez e mente
depois é exatamente o que a `O-INSTRUMENTO-MENTE-MAIS-QUE-O-PRODUTO` descreve.
O relógio de nascimento tem de vir do log do kernel, e vem.

### 3.4 "O produto já não causa mais o travamento, então a causa é outra coisa nova" — DERRUBADA

O `0x08` saiu em 03/08 e as barras continuaram travando — o que me fez procurar
uma causa nova. Não há causa nova: há uma causa **externa** que a casa já
conhecia por outro nome. O `ESCRITOR-CRU-01` (16/08) mediu a Steam apagando a
barra e chamou aquilo de disputa de escrita ("ganha quem escreve por último").
É o mesmo agente com um efeito **maior** do que o registrado: aberta no
NASCIMENTO da conexão, a Steam não disputa a barra — ela a condena, e a
condenação sobrevive à morte dela.

---

## 4. Os cinco caminhos do encargo, e o que cada um custa

| # | caminho | veredito | custo |
|---|---|---|---|
| 1 | **A instância** | **É ESTE.** Não a instância em si — a CONDIÇÃO DE NASCIMENTO dela | zero: só leitura de sysfs e do diário |
| 2 | **O relógio da conexão** | Meio certo. Existe janela, mas o gatilho não é o tempo: é o processo | zero, e já embutido no (1) pela janela de 5 s |
| 3 | **O que o controle responde** | Morto por leitura, e **não reaberto de propósito** | ver abaixo |
| 4 | **A corrente** | Morto por medição: o arquivo não existe | zero |
| 5 | **Perguntar a ela** | Necessário, e o roteiro está no §6 | dois minutos dela |

**Por que NÃO sondei os feature reports, tendo permissão e a senha:** a
`LIGHTBAR-BT-RESET-01` acusa as *feature reads* da adoção de causarem o
travamento, e essa acusação nunca foi eliminada — a medição de 03/08 isolou o
`0x08`, não as leituras. Sondar as duas instâncias SÃS para comparar teria
risco real de destruí-las, e elas são metade da única bancada A/B que existe.
Sondar só as travadas não compara nada. Somado a `core/escritor_cru.py` já
registrar que nenhum dos dezessete reports lidos devolve estado de LED, o
retorno esperado não paga o risco. **Se alguém quiser reabrir, o desenho certo
é: um controle só, já travado, com a bancada A/B desfeita.**

E não gastei nenhum dos dois `Disconnect` autorizados: o experimento que
falta (§6) precisa do olho dela de qualquer jeito, e gastar o gesto dela antes
de ela estar na frente da tela seria desperdiçar o recurso mais caro da mesa.

---

## 5. A entrega

`src/hefesto_dualsense4unix/integrations/sinal_da_barra.py` — somente leitura,
sem root, 100 % stdlib, **e nada nele toca o aparelho**.

Duas perguntas, **duas funções, e nunca a mesma**:

- **`ler_a_mesa()` — DIAGNÓSTICO:** *"esta instância que já existe nasceu
  limpa?"* Responde `limpa` / `suspeita` / `nao_sei`, reconstruindo o
  nascimento de duas réguas independentes: o instante vem do KERNEL, o escritor
  vem do DAEMON;
- **`limpo_para_conectar()` — PROGNÓSTICO:** *"se um controle conectar AGORA,
  nasce limpo?"* **É esta que tem de guardar o botão de reconectar.** Oferecer a
  cura com a mesa suja gasta o gesto do botão PS dela para produzir outra
  instância travada.

Confundir as duas é o defeito que o produto cometeria por conta própria: agora
mesmo a sonda ao vivo diz "mesa limpa" enquanto o diagnóstico diz "duas
conexões nasceram sujas". **As duas estão certas.**

### O que o módulo se proíbe

Ele **nunca** diz "acesa" nem "apagada", e há teste que reprova se alguma frase
passar a dizer. Não existe leitura da lâmpada nesta casa:
`multi_intensity` mentiu nos dois sentidos (16/08), o report de entrada não
carrega LED, e nenhum feature report devolve estado. O módulo fala do
NASCIMENTO, que é o que foi medido.

### Os testes

`tests/unit/test_barra_muda_01_o_sinal_que_nao_le_a_lampada.py` — 27 verdes.
**Mordida arrancada e conferida**, três mutações:

| mutação | reprova |
|---|---|
| `nao_sei` passa a devolver `limpa` | 1 de 27 — `test_sem_diario_o_veredito_e_nao_sei` |
| o veredito passa a dizer "a barra está apagada" | 2 de 27 — as duas da classe `TestOModuloNaoLeALampada` |
| o casamento ignora o nó e olha só a janela | 1 de 27 — `test_o_no_errado_nao_suja_ainda_que_a_hora_bata` |

A terceira guarda uma armadilha real: **números de `hidraw` são reciclados.** O
`hidraw6` foi da `.0028` às 18:05 e da `.0033` às 19:51 do mesmo dia. Casar
escritor com instância só pelo nó contamina a instância sã com o pecado da que
morreu — e o casamento por nó **e** janela é o que impede.

---

## 6. O experimento que só ela pode fazer

É o que fecha a célula. Cinco passos, dois minutos, e **o valor está em fazer o
passo 4 com a Steam ABERTA** — é ele que separa a minha hipótese de uma
coincidência de um dia.

1. Abra a Steam e espere ela terminar de carregar.
2. Rode `.venv/bin/python -m hefesto_dualsense4unix.integrations.sinal_da_barra --agora`
   e confira que ele responde `suspeita` (mesa suja).
3. Escolha um controle cuja barra esteja ACESA agora, e me diga qual é.
4. Eu derrubo esse controle pelo BlueZ; você aperta o botão PS para ele voltar.
5. **Olhe a barra dele.** Se ela voltar APAGADA — com a Steam aberta, num
   controle que estava aceso — a hipótese está provada e a cura ganha a
   condição que faltava.

O controle negativo já está feito: foi o ensaio de hoje às 19h51, com a Steam
fechada, e as duas barras voltaram acesas.

**Se voltar ACESA**, a hipótese cai, e o que sobra é que a Steam precisa estar
segurando o nó por algum tempo antes — o que também é medível, e aí o roteiro
muda.

---

## 7. O que ficou aberto

1. **O sinal não está ligado em lugar nenhum.** O módulo existe e tem CLI; o
   daemon e a janela não o chamam. É a
   `A-CASA-SABE-E-O-PRODUTO-NAO-FAZ` de novo, e eu a estou declarando em vez de
   escondê-la: o território desta frente eram o módulo, os testes e este
   documento, e os arquivos de lightbar e de interface estão com outras duas
   levas na árvore agora. **O primeiro trabalho da próxima onda é chamar isto**,
   em dois lugares: o tick de hotplug do daemon (para carimbar o veredito no
   nascimento, sem depender do diário) e o botão de reconectar da janela (que
   tem de consultar `limpo_para_conectar` ANTES de oferecer a cura);
2. **`Disconnect` do BlueZ continua com zero chamadores em `src/`** — conferido
   hoje (`grep -rn "Disconnect" src/` → nada; só `exame_da_mesa.py` e
   `apelido_do_dongle.py` falam com o `org.bluez`, e nenhum dos dois derruba
   nada). A cura foi medida em 12/08 e nunca foi ligada;
3. **O `hw_version` é impressão digital de plástico e ninguém o usa.** Ele casa
   instâncias através da reconexão sem depender de MAC, o que é exatamente o
   que a `O-ALVO-POR-MAC-E-BURACO-DE-TODAS-AS-ABAS` pede. Não propus mudança
   nenhuma nas abas — só registro que a chave existe;
4. **Um fato do encargo continua SEM EXPLICAÇÃO, e registro como pedido:** o
   `Disconnect` num controle derrubou DOIS, e o segundo estava em OUTRO
   adaptador (`.0028` em `d8:44:89:00:00:c4` e `.002A` em `ac:a7:f1:00:00:41`).
   Nada que eu medi hoje explica isso, e eu não fui atrás — não é E1;
5. **Nenhuma célula do mapa de canais foi preenchida.** A varredura histórica
   dá co-ocorrência, não acurácia; o rótulo do olho dela existe para seis
   instâncias. Preencher `provado_em` com isso destruiria o valor do arquivo.
   O que fecha a célula é o §6.
