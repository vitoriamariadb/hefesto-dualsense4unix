---
sprint: LUZ-DO-MIC-01
estado: feita
---

# LUZ-DO-MIC-01 — a luz do microfone diz QUEM TE ESCUTA

> **ESTADO 06/09/2026: feita** — a régua é `tests/unit/test_a_luz_do_mic_diz_quem_te_escuta.py`.

> **Decisão dela, 02/09/2026, e ela nasceu de uma medição no aparelho.**
> A luz do botão de mudo deixa de ser um espelho do mudo e passa a responder
> uma pergunta que ninguém conseguia responder olhando a tela: *alguém está
> me ouvindo agora?*

## 0. O QUE FOI MEDIDO, e é o que torna isto possível

Até 02/09/2026 esta casa nunca tinha escrito no `common[8]` nada além de 0 e 1,
porque o driver só escreve `ds->mic_muted`, que é `bool`
(`assets/dkms/hid-playstation/hid-playstation.c:1540`). A coluna de valores da
referência canônica estava **em branco**.

Medido no aparelho, com o olho dela, **nos dois transportes**:

| `common[8]` | a luz |
| --- | --- |
| `0` | apagada |
| `1` | acesa, fixa |
| `2` | **piscando** |
| `3` | **piscando, mais lento** |
| `4`, `64`, `255` | apagadas |

**A faixa válida é `0..3`.** O `255` é o que decide a forma: `255 & 0x03 = 3`,
que deveria piscar lento, e apaga — logo o firmware **valida a faixa**, não
mascara bits.

**Não existe controle de brilho por este byte.** Era a hipótese que motivou a
medição e ela caiu. O PWM existe no aparelho (o pisca RAMPA — observação dela ao
vivo), mas nenhum campo conhecido o expõe. Isso é pergunta em aberto.

Provas: `docs/protocol/dualsense-referencia-canonica.md` §8.1 ·
`docs/data/ensaios.csv` (`led-mic-nivel-cabo-1`, `led-mic-faixa-cabo-2`,
`led-mic-nivel-radio-1`) · instrumento `scripts/ensaios/nivel_do_led_do_mic.py`
· mordida em `tests/unit/test_o_led_do_mic_e_um_enum_de_quatro_estados.py`.

## 1. O CONTRATO — os quatro estados têm dono

```
apagado (0)      = MUDO, ou ninguém ouvindo.  OS DOIS SÃO A MESMA LUZ.
aceso fixo (1)   = algum app está com o microfone deste controle aberto
piscando (2)     = e está entrando som AGORA
pisca lento (3)  = está entrando som, E a bateria deste controle < 30%
```

**Por que mudo e apagado são sinônimos** — palavra dela: *"confuso mudo e
apagado tem que ser sinonimos aqui"*. A razão é física e ela está certa: luz
apagada = ninguém te escuta, por qualquer motivo. Separar "mudo" de "ocioso" em
duas luzes obrigaria a decorar uma diferença que não muda nada para quem joga.

**Por que o pisca é atividade** — palavra dela: *"piscando seria quando tá
captando o audio do ambiente? Seria legal né?"*. É a única informação que muda o
tempo todo e que não dá para ver de outro jeito.

**Por que o quarto estado é a bateria** — palavra dela: *"pisca lento, se a
bateria do controle tiver abaixo de 30% e o mic ligado captando som, aí ele
pisca lento ao captar audio"*. O pisca DESACELERA quando a bateria cai: não é
um símbolo novo para decorar, é o mesmo sinal, cansado.

### 1.1 A precedência, e ela não é ambígua

```
mudo no firmware                         -> 0
captando + bateria < 30%                 -> 3
captando                                 -> 2
algum app com o microfone aberto         -> 1
resto                                    -> 0
```

**Bateria baixa SEM captação não acende nada.** A luz é sobre quem te escuta; a
bateria só modula o aviso quando há aviso a dar.

### 1.2 A mesa é de QUATRO, e cada controle responde por si

O modelo é um canal por controle. Vários podem estar vivos ao mesmo tempo, e a
luz de cada controle fala **daquele** microfone — nunca do sistema. Duas luzes
piscando ao mesmo tempo é estado válido, não defeito.

> **DEPENDÊNCIA MEDIDA em 03/09/2026, e ela é dura:** com dois controles na
> mesa, o PipeWire publica **UM** canal de DualSense — o do cabo. O do rádio não
> publica nenhum, porque duas travas nossas o exigem declarado à mão. Enquanto
> isso valer, o estado `aceso` desta luz **nunca acende para quem está no
> rádio**: não há canal para app nenhum abrir. Quem cura isso é a
> `2026-09-03-CANAL-POR-CONTROLE-01-quatro-controles-quatro-canais.md`, e ela
> nasceu da decisão dela de que quatro controles têm quatro canais.

## 2. O DEFEITO QUE ESTA SPRINT TAMBÉM FECHA

Medido em 02/09/2026, com ela olhando: **devolver a posse deixa a luz presa no
último valor que escrevemos.** Ela disse, com os dois controles na mesa:
*"ambos tão ligados. e ficaram."*

A causa está no contrato do kernel e é conhecida: ele escreve
`mute_button_led = ds->mic_muted` **na borda do botão físico**, não
continuamente (`hid-playstation.c:1538-1540`). Então largar o byte com a luz
acesa deixa a mentira no ar até ela apertar o botão.

**Requisito:** devolver a posse tem de REPINTAR o estado real antes de soltar —
escrever o valor que corresponde ao mudo de fato, e só então limpar o bit `0x01`
do flag1. Vale para o `mic led-release` do CLI, para o `mic.led.set {aceso:
null}` do IPC e para o desligamento do daemon.

## 3. AS QUATRO PEÇAS, divididas POR ARQUIVO

Cada peça é de um dono. Elas não se cruzam em arquivo nenhum — é o que permite
construí-las ao mesmo tempo.

### PEÇA A — `integrations/quem_ouve_o_microfone.py` (NOVO)

Responde: *quais aplicativos têm a fonte de captura deste controle aberta?*

- Fonte da verdade: o PipeWire. A casa já sabe listar as fontes de DualSense
  (`integrations/eleicao_de_microfone.py:580`, `fontes_de_captura_agora`) e já
  sabe casar controle com dispositivo (`:588`, `casamento_usb_agora`). **Reuse,
  não reimplemente.**
- A leitura tem de EXCLUIR o stream do próprio Hefesto (ver a PEÇA B): se o
  nosso medidor de nível contar como ouvinte, a luz acende sozinha e a peça
  mente. Este é o risco central desta peça.
- Custo alvo: leitura de ~1 Hz, sem processo permanente.
- Devolve estrutura, não texto: `{uniq: [nomes dos clientes]}`.
- Toda não-resposta é resposta: sem `pactl`, saída ilegível, fonte ausente →
  `None`/vazio, nunca um chute.

### PEÇA B — `integrations/nivel_do_microfone.py` (NOVO)

Responde: *está entrando som neste microfone agora?*

- É a peça CARA, e a spec reconhece isso. Precisa de captura própria com RMS.
- **Antes de escrever o stream, meça o custo e relate**: quantos por cento de
  uma CPU por canal, e o que acontece com quatro. Se o custo for proibitivo,
  **diga e proponha o degrau menor** (amostrar por janelas curtas, ou só no
  controle primário) em vez de entregar algo que derruba a máquina dela.
- Contrato de saída: um booleano por `uniq`, com histerese. Sem histerese o
  pisca vira estroboscópio em cada sílaba — a luz tem de acompanhar a fala, não
  a forma de onda.
- O stream tem de ser identificável para que a PEÇA A o exclua.

### PEÇA C — `daemon/subsystems/luz_do_mic.py` (NOVO)

O laço que DECIDE e ESCREVE. Molde: `daemon/subsystems/mic_da_mesa.py`, que tem
a forma certa (`mic_da_mesa_loop` em `:96`, `start_mic_da_mesa` em `:163`).

- **Escreve só na MUDANÇA.** Reafirmar o mesmo valor a 20 Hz por cima do kernel
  é literalmente o defeito do commit `3d9bb7e`, no byte vizinho.
- Escreve pelo caminho do produto: `backend.set_mic_led(..., uniq=)` e
  `set_microphone_led`, nunca um `open()` do hidraw. O daemon reafirma o report
  de saída continuamente, então escrita crua por fora é sobrescrita em
  milissegundos — armadilha nº 3 do `CLAUDE.md`.
- **Não toca o `common[9]`.** O mudo é campo separado, com bit de autorização
  separado, e as três recusas medidas (BT-E-VPAD-01, MIC-BT-DONO-01,
  MIC-DOIS-DONOS-01) são todas sobre ele.
- **Não pode roubar o botão físico dela.** Enquanto a posse for nossa, o kernel
  não manda na luz; o laço tem de conviver com o gesto de mudo, não competir.
- Devolve a posse no desligamento, repintando (ver §2).
- A bateria já vem pronta: `battery_pct` no `controller.list` / `daemon.state_full`.

### PEÇA D — a devolução que repinta (EDITA o que já existe)

O §2. Toca `core/backend_pydualsense.py` (`set_microphone_led`),
`daemon/ipc_handlers.py` (`_handle_mic_led_set`) e `cli/cmd_mic.py`
(`led-release`). É a única peça que mexe em arquivo existente, e por isso é a
única que não pode rodar junto com outra no mesmo arquivo.

### PEÇA E — o `install.sh` tem de entregar isto pronto

**Exigência dela, 03/09/2026: "tem que tá no install também".** Uma feature que
só funciona em árvore de desenvolvimento não está entregue — a máquina dela roda
o que o instalador deixou.

O que a peça tem de garantir, e cada item é verificável:

1. **A dependência declarada.** Se a PEÇA B precisar de biblioteca nova para o
   RMS, ela entra no `pyproject.toml` — e a lição já está paga nesta casa: o
   `playwright` não é declarado em extra nenhum, e por isso toda árvore nova
   nasce com dois portões vermelhos. Não repita a dívida.
2. **A dependência de SISTEMA declarada.** O `pactl` já é conhecido do
   instalador (`install.sh:504`); qualquer ferramenta nova entra no
   `_DEPS_DE_SISTEMA` (`install.sh:630`), que é o mesmo caminho para as cinco
   famílias de distro do DEPS-UNIVERSAIS-01, não só `apt`.
3. **O `packaging-parity` continua verde.** É portão, e é ele que cobra a
   paridade entre o que o `install.sh` instala e o que os pacotes declaram.
4. **Nada de novo pedir configuração dela.** A luz tem de funcionar depois de um
   `install.sh` limpo, sem passo manual e sem flag.
5. **O instalador NÃO roda nesta sprint.** Ele reescreve `~/.local/bin`, o
   `.desktop` e a unit systemd, e reinicia o daemon que ela está usando. A peça
   entrega a MUDANÇA no `install.sh`; quem o executa é ela, ou quem coordena, no
   fim e com a palavra dela.

## 4. O QUE FICA DE FORA, e é decisão dela

- **O brilho.** Não existe por este byte. Se alguém achar o campo do PWM, isso
  vira sprint nova — não se inventa aqui.
- **Um quinto estado.** A faixa é `0..3`. O produto NÃO deve filtrar a faixa
  (um `clamp` esconderia um pedido errado em vez de deixá-lo aparecer); quem
  filtra é o firmware, e o teste que morde fixa isso.

## 5. PRONTO É

1. Os quatro estados aparecem no controle dela, nos dois transportes, e ela viu.
2. Apertar o botão físico continua funcionando durante e depois.
3. `mic led-release` deixa a luz no estado REAL, não no último escrito.
3b. Um `install.sh` limpo entrega a luz funcionando, sem passo manual dela.
4. Cada peça tem teste que MORDE: arranque a cura, veja reprovar, devolva — e
   registre a data em `mordida_provada_em` no mapa.
5. `bash scripts/portoes.sh` sem argumento: 30 verdes.
6. O custo de CPU da PEÇA B está MEDIDO e escrito, com quatro canais na mesa.

## 6. AS ARMADILHAS DESTE TRABALHO

1. **A suíte inteira derruba a sessão gráfica dela** — ela toca nós uinput de
   verdade. Rode só os SEUS arquivos de teste. A suíte inteira é de quem
   coordena, no fim, em oito lotes.
2. **O `uniq` tem dois formatos.** O daemon devolve sem dois-pontos
   (`143a9a0000ab`); o `scripts/ensaios/comum.py` devolve com
   (`14:3a:9a:00:00:ab`). Pedir com o formato errado não dá erro — dá
   `sem_controle`, que se lê como "não há controle na mesa". Custou tempo em
   02/09.
3. **Inserir linhas em `backend_pydualsense.py` ou `ipc_handlers.py` quebra
   citações de linha** em docs e no mapa. Rode `citacoes-de-linha` e reaponte —
   não apague a afirmação.
4. **Saída de comando vai para arquivo, nunca crua no terminal dela.** O
   terminal é o mesmo em que a conversa acontece.
5. **`install.sh` nunca com `sudo`**, e não o rode nesta sprint.
