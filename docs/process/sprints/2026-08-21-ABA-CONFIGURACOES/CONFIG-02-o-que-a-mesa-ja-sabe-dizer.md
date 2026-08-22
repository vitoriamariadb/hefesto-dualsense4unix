# CONFIG-02 — o que a mesa já sabe dizer

Seção "A mesa" em **somente leitura**, mais as duas declarações que barramento
nenhum responde. Entregue em 22/08/2026.

**Depende de:** CONFIG-01.

## O que entrega

- `src/hefesto_dualsense4unix/integrations/mesa_de_radio.py` — o leitor de
  sysfs: funções de módulo, raízes injetáveis, sem root, sem subprocesso, sem
  IPC.
- Lista de adaptadores Bluetooth com **onde cada um está** — barramento, porta,
  painel do gabinete e hub.
- Lista dos outros rádios de 2,4 GHz do barramento USB, sem hubs e sem os
  controles.
- Aviso, em laranja, quando dois rádios estão colados, e quando um rádio está
  na porta ao lado de um adaptador.
- Os segmentados "Altura da antena" e "Linha de visada" (a persistência é de
  CONFIG-03).
- O botão "Reexaminar a mesa", e a mesma leitura ao ENTRAR na aba
  (`_REFRESH_POR_ABA`), nunca em tique.

## A decisão de fonte

Três caminhos, e o dossiê elimina dois:

| Fonte | Veredito |
|---|---|
| `bluetoothctl list` | **Não serve.** Está mudo nesta máquina desde o BlueZ 5.86 one-shot |
| Chamar `scripts/doctor.sh` | **Não serve como está.** Ele tem `hci0` fixo em três pontos (`:2555`, `:2563`, `:2823`) e mente numa mesa de dois ou três dongles. Além disso os testes fazem *grep de texto* na saída dele, então mudá-lo é caro |
| Ler `sysfs` direto da GUI | **É o caminho.** `/sys/class/bluetooth/*`, `/sys/bus/usb/devices/*` — sem root, sem subprocess, sem IPC novo |

**E o nome do adaptador é a IDENTIDADE FÍSICA, não o endereço.** O sysfs não
entrega o MAC: medido em 22/08/2026, kernel 7.0.11-76070011-generic,
`/sys/class/bluetooth/hci0/` não tem arquivo `address`, e
`broker/hidraw_broker.py:165` (`_adapter_addresses`) devolve `set()` sobre
`/sys`. O endereço existe pelo BlueZ no D-Bus de sistema, que o produto não
abre em lugar nenhum e que o `flatpak/br.andrefarias.Hefesto.yml` não permite
(sem `--socket=system-bus`).

Isso não é uma perda: VID:PID mais barramento, porta e painel cumpre o aceite
melhor que o MAC — é estável entre boots, ao contrário de `hciN`, e ainda
responde "onde está", que é a pergunta da seção. É a decisão M1 de
[DECISOES-DA-EXECUCAO.md](DECISOES-DA-EXECUCAO.md).

**Detectar hub é viável e preferível a perguntar:** `bDeviceClass == 09` no
sysfs. Onde a leitura acerta, ela pré-preenche — é a salvaguarda 2 de
[D-A1](DECISOES-ABERTAS.md).

## A bancada de hoje não é a do roteiro

Medido em 22/08/2026, na máquina de quem implementou:

- **`/sys/class/bluetooth` está VAZIO.** Não há `hci0`; o
  `ls /sys/class/bluetooth/hci0/` da prova de trabalho original falha com
  "arquivo ou diretório inexistente". `btusb` carregado com 0 refs, nenhum
  rfkill de Bluetooth. **Zero adaptadores é o estado real desta mesa**, e o
  desenho não o previu.
- O barramento tem quatro aparelhos e quatro hubs-raiz: `1-3` (`25a7:fa07`,
  painel `right`), `1-4` (`3554:fa09`, painel `right`), `3-1` e `3-4`
  (`054c:0ce6`, os dois DualSense no cabo) e `4-3` (`2357:012d`, Wi-Fi,
  `speed=5000`).
- O par colado desta mesa é `1-3`/`1-4` — mesmo `busnum`, `devpath` 3 e 4,
  mesmo controlador `0000:02:00.0`.

Três consequências entraram no código, e cada uma tem teste:

1. **o painel tem sete valores, não três.** O kernel entrega
   `top`/`bottom`/`left`/`right`/`front`/`back`/`unknown`, e esta bancada mede
   `right`. Com o mapa de três do roteiro, o único aparelho da casa que SABE
   onde está cairia em "Não sei" (M2);
2. **os controles não são rádios concorrentes.** A regra crua do roteiro
   ("dispositivo USB que não é hub e não é o adaptador") lista os dois
   DualSense do cabo — o produto acusando os próprios controles. Filtra por VID
   de controle (M4);
3. **hub nenhum entra na tabela de rádios, nem o de raiz.** Medido antes de
   existir a guarda: os quatro `usbN` entraram como se fossem antenas.

## O que NÃO entra

- **As colunas "Firmware" e "Em uso".** Não há check por adaptador em
  `scripts/doctor.sh`, e o que amarra controle a adaptador é o *bond*, em
  `/var/lib/bluetooth` — árvore `700`, e a GUI é **sudo-zero por doutrina**. A
  metade derivável de "Em uso" vira o medidor de CONFIG-04 (M3).
- **"Em hub, COM FONTE".** `bMaxPower` não distingue hub alimentado — medido, o
  hub USB 3.1 com fonte reporta `0mA` e o USB 2.1 sem fonte reporta `100mA`, o
  oposto do palpite. A célula diz "Em hub" e a dica perdeu a promessa de fonte.
- **RSSI / força de sinal.** Via D-Bus ele só existe durante *discovery*, e
  manter discovery ligado rouba banda do rádio dos controles. Medir pioraria
  exatamente o que a aba quer melhorar.
- **Qual controle está em qual dongle.** Mesmo motivo da coluna "Em uso". Fica
  registrada como limite, não como tarefa.

## Duas divergências do desenho, e o porquê

- **A tabela é uma grade de rótulos, não um `GtkTreeView`.** O portão de
  redação da aba (`tests/unit/test_config_a_palavra_de_tela_da_aba_montada.py`)
  anda a árvore de widgets; cabeçalho de coluna de `TreeView` não é widget da
  árvore e nasceria fora do alcance dele. Tabela pequena e em somente leitura
  não precisa de modelo — precisa de estar sob o portão.
- **"Reexaminar a mesa" fica DENTRO da seção**, não no rodapé da aba: o rodapé
  é do "Aplicar" da janela, e um botão que só relê a mesa se explica melhor
  colado na mesa que releu.

## Prova de trabalho

```bash
.venv/bin/python -m pytest tests/unit/test_a_mesa_le_o_barramento.py -q
xvfb-run -a --server-args="-screen 0 1920x1080x24" .venv/bin/python -m pytest \
  tests/unit/test_config_01_a_aba_nasce_vazia.py \
  tests/unit/test_config_a_palavra_de_tela_da_aba_montada.py -q
GDK_PIXBUF_MODULE_FILE=/usr/lib/x86_64-linux-gnu/gdk-pixbuf-2.0/2.10.0/loaders.cache \
  xvfb-run -a --server-args="-screen 0 1920x1080x24" \
  .venv/bin/python scripts/gui-captura/retratar_abas.py /tmp/config02 --mesa-cheia
grep -rn '054c\|0ce6\|25a7\|3554\|2357\|0000:0c:00\|0000:02:00' /tmp/config02/   # vazio
```

O último `grep` é o que protege a foto: a aba montada para a captura lê uma
bancada de mentira (`_mesa_leitor`), nunca `/sys`. Sem isso o PNG versionado
carregaria o barramento dela, e nenhum portão desta casa varre imagem.

**Aceite.** A mesa desta bancada tem ZERO adaptadores, e é assim que a tela tem
de se comportar: uma linha de texto no lugar da tabela — *"Nenhum adaptador
Bluetooth encontrado. Os controles no cabo continuam funcionando."* — e não uma
tabela em branco, que parece defeito (M5). As mesas de um e de dois adaptadores
estão provadas nos testes, com sysfs injetado, porque nenhum fixture as
substitui aqui: quem tiver um dongle confere que a lista nomeia cada um pela
identidade física, nunca por `hciN`, que inverte entre boots. Desplugar o
receptor de `1-3` e clicar "Reexaminar a mesa" encolhe a lista de rádios sem
reiniciar a janela, e o aviso laranja entre `1-3` e `1-4` some junto. A leitura
não roda no tique rápido: acontece ao abrir a aba e no botão.
