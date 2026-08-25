# CONEXÕES · MAPA 2D 01 — o gabinete que o produto não enxerga

**24/08/2026. GRAU: MEDIDO**, exceto onde a linha diz **DESENHO** ou
**NÃO VERIFICADO**.
Frente A da leva que redefine a **0.9.5** — *"o rádio para de mentir"*, na
metade que é da aba: **a aba para de esconder o que sabe.**

**Escopo da leva: só o DualSense** (decisão dela, 24/08). O Pro Controller e o
8BitDo voltam na 1.0. Nada aqui é específico de DualSense — o mapa é do
gabinete, não do controle —, mas a prova de tela sai com DualSense.


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


---

## O que esta sprint fecha

1. O produto sabe o **caminho de barramento** de cada rádio (`3-1.1.4`) e não
   sabe o **número da porta** que ela enxerga no gabinete (`15a`). Toda frase de
   diagnóstico da aba nasce em jargão por causa disso.
2. `vizinhancas_apertadas` acerta o par e o **nomeia por ordinal da lista da
   tela** ("vizinho do adaptador 3"), que não é achável no metal.
3. A ancoragem que existe hoje entre adaptador e mesa é o **`vid:pid`**, e os
   três adaptadores desta bancada têm o **mesmo `vid:pid`** — medido abaixo. A
   chave não distingue os três aparelhos que a aba inteira existe para
   distinguir.
4. O **extensor é invisível por física** e hoje o produto mente sobre onde o
   dongle está: ele o coloca na porta do hub.
5. O `censo_do_barramento` lê energia, hub em comum e cadeia de hubs, e **nada
   disso chega à tela**.

## O que ela NÃO faz

- **Não escreve a ordem de serviço** ("mova o Wi-Fi da porta 11 para a traseira
  4"). É a **Frente B**. Esta sprint entrega os **números** que aquela frase
  precisa e para aí.
- **Não toca a conta de slots** nem o medidor (`integrations/radio_da_mesa.py`).
  É a **Frente C**.
- **Não renomeia "A mesa" para "Conexões"** nem mexe em tooltip. É a **Frente
  D**. Este documento já chama a seção de "Conexões" no texto para não escrever
  o nome caduco, e **não muda `TITULO` em `secao_mesa.py`**.
- **Não mede Bluetooth.** A bancada é dela. A única medição que falta está na
  §7, com o comando pronto e **não executado**.
- Não decide "está bom" nem "está ruim" sobre disposição nenhuma.

---

## 1. O defeito, em uma frase

**Ela numerou as portas do gabinete numa foto para poder falar comigo; o
produto continua falando `3-1.1.4`, e por isso não consegue dizer a ninguém —
nem a ela — onde encostar a mão.**

---

## 2. O que está medido

Régua: `.venv/bin/python` importando `src/` direto, **uid 1000, sem root, sem
sudo, sem `busctl`, sem tocar o daemon**. Kernel `7.0.11-76070011-generic`,
24/08/2026. Nenhum comando desta seção abre `/dev` ou fala com o Bluetooth.

### 2.1 O barramento inteiro, como o produto já o lê

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.integrations.censo_do_barramento import ler_o_barramento
for a in ler_o_barramento().conectados():
    print(a.nome_do_kernel, a.vid+':'+a.pid, a.especie, a.atras_de_hub, repr(a.painel))"
```

| `nome_do_kernel` | `vid:pid` | espécie | atrás de hub | `painel` |
|---|---|---|---|---|
| `1-3` | `25a7:fa07` | Mouse | não | `right` |
| `3-1` | `05e3:0610` | Hub | não | `""` |
| `3-1.1` | `05e3:0610` | Hub | sim | `""` |
| `3-1.1.4` | `2357:0604` | Bluetooth | sim | `""` |
| `3-1.2` | `2357:0604` | Bluetooth | sim | `""` |
| `3-1.4` | `3554:fa09` | Teclado | sim | `""` |
| `3-3` | `2357:0604` | Bluetooth | não | `""` |
| `3-4` | `046d:08e5` | Câmera | não | `""` |
| `4-1` | `05e3:0626` | Hub | não | `""` |
| `4-1.1` | `05e3:0626` | Hub | sim | `""` |
| `4-1.1.2` | `2357:012d` | Não identificado | sim | `""` |

> **ESTA TABELA ENVELHECEU EM DUAS HORAS, e a nota é a lição.** Ela é a leitura
> de **24/08 às ~21h**, e às **22h50** a mantenedora moveu três aparelhos —
> executando a ordem de serviço que esta mesma leva produziu. A leitura de agora:
>
> | aparelho | era | virou | o que ela fez |
> |---|---|---|---|
> | Wi-Fi | `4-1.1.2` (no hub) | **`4-2`** | tirou do hub |
> | teclado | `3-1.4` (no hub) | **`1-3`** | tirou do hub |
> | 3º Bluetooth | `3-3` (traseira) | **`3-1.1.1`** | pôs no hub |
> | webcam | `3-4` | **`1-4`** | — |
> | mouse | `1-3` | **`1-6`** | — |
>
> Os outros três (`3-1`, `3-1.2`, `3-1.1.4`) ficaram. **Quem executar esta
> sprint use a tabela desta nota, não a de cima** — e o exemplo de `maquina.json`
> mais abaixo carrega os caminhos velhos pelo mesmo motivo.
>
> **Por que a tabela velha FICA, em vez de sair:** ela é o par "antes" de um
> ensaio real, e as duas leituras juntas são a prova de que o produto reconhece
> um aparelho movido pelo **serial**, que não muda, e não pelo caminho, que
> muda. Apagar o "antes" apagaria a medição. É a regra da casa: fato errado
> sai, **medição datada leva nota**.

### O custo de energia de cada entrada — medido, e ela pediu

Ela, no turno em que descreveu a aba: *"pra vermos o custo energético e do bt"*.
O barramento já responde, sem root, em `bMaxPower`:

| entrada | aparelho | pede | velocidade |
|---|---|---|---|
| `1-3` | receptor 2,4 GHz | **98 mA** | 12M |
| `3-1` / `3-1.1` | os dois chips do hub | 100 mA cada | 480M |
| `3-1.1.4` | TP-Link UB500 | **500 mA** | 12M |
| `3-1.2` | TP-Link UB500 | **500 mA** | 12M |
| `3-1.4` | receptor 2,4 GHz | 100 mA | 12M |
| `3-3` | TP-Link UB500 | **500 mA** | 12M |
| `3-4` | Webcam C920 | **500 mA** | 480M |
| `4-1` / `4-1.1` | hub, lado 3.0 | 0 mA (alimentado) | 5000M |
| `4-1.1.2` | Archer T3U | **504 mA** | 5000M |

**O que isto ensina, e a tela deve dizer:** uma entrada USB 2.0 de placa entrega
**500 mA**; três UB500 pedem 500 mA cada. **Três dongles num hub sem fonte
externa estouram o orçamento da entrada que o alimenta** — e o sintoma é
desconexão aleatória que não aparece em log nenhum. O hub dela **tem** fonte de
30 W, e é por isso que funciona.

`power/control` está em `on` em todos os nove — economia de energia desligada,
que é o que o exame já confere.

**Uma porta em onze responde `physical_location`** — a `1-3`, e ela diz
`right`, não "frente". O mapa 2D **não pode ser deduzido**; tem de ser
declarado. Isto confirma por leitura o que o briefing mediu por `cat` em todas
as onze.

### 2.2 A chave de hoje não distingue os três adaptadores — MEDIDO

`MesaDeclarada.radios` é indexado por `vid:pid`
(`src/hefesto_dualsense4unix/utils/maquina.py:_CHAVE_DE_RADIO`, regex
`^[0-9a-f]{4}:[0-9a-f]{4}$`), e a tabela acima mostra `2357:0604` **três
vezes**. Declarar "isto é um adaptador Bluetooth" numa linha declara nas três;
declarar em qual porta ele está é impossível.

Isto **não é defeito daquele campo** — `RadioDeclarado.tipo` responde *"que
espécie de aparelho é este modelo"*, e para essa pergunta `vid:pid` é a chave
certa. É a prova de que **a pergunta "onde ele está" precisa de outra chave**, e
é essa chave que esta sprint cria.

### 2.3 A âncora existe, é determinística e já é lida

O `nome_do_kernel` (`censo_do_barramento.py:210-215`) é
`f"{busnum}-{devpath}"`, o nome do diretório em `/sys/bus/usb/devices`. Ele é
determinístico pelo **soquete físico**: `3-3` é a traseira 5 desta máquina
enquanto o cabo não mudar de buraco. `mesa_de_radio.Adaptador` tem as duas
metades (`busnum:137`, `devpath:138`) e **não expõe o caminho montado** — é a
única peça que falta para os dois módulos falarem do mesmo aparelho com a mesma
palavra.

### 2.4 `hciN` não é identidade, e agora está medido dos dois lados

```bash
.venv/bin/python -c "
from hefesto_dualsense4unix.integrations.mesa_de_radio import adaptadores_bluetooth
for a in adaptadores_bluetooth(): print(a.interface, f'{a.busnum}-{a.devpath}')"
```

```
hci0 3-1.2      hci1 3-1.1.4      hci2 3-3
```

O serial `ACA7F1…41` era o **`hci1`** na decisão `D-HCI1-BLOQUEADO`
(`docs/data/decisoes-dela.csv:3`, 23/08) e hoje é o **`hci0`**. O número é a
vaga; o aparelho é outro. **O caminho de barramento não se mexeu.**

### 2.5 O serial USB do adaptador **é o endereço Bluetooth dele** — e isso é uma
### descoberta com dois lados

```bash
for n in 1-3 3-1.1.4 3-1.2 3-1.4 3-3 3-4 4-1.1.2; do
  printf '%-10s %s\n' "$n" "$(cat /sys/bus/usb/devices/$n/serial 2>/dev/null || echo -)"; done
```

| nó | serial |
|---|---|
| `3-1.1.4` | `D84489…C4` (mascarado) |
| `3-1.2` | `ACA7F1…41` (mascarado) |
| `3-3` | `ACA7F1…CE` (mascarado) |
| `4-1.1.2` (Wi-Fi) | `123456` |
| mouse, teclado, webcam, hubs | **vazio** |

Cruzando com `D-HCI1-BLOQUEADO`, que registra o endereço mascarado
`AC:A7:F1:00:00:41`: **os doze hex do serial USB são os seis octetos do endereço
Bluetooth**. E `d8:44:89` está em `_OUIS_REAIS_OCTETOS`
(`tests/unit/test_docs_mac_anonimato.py:94-103`) — é OUI de fabricante de
verdade, não número de série arbitrário.

**Lado bom.** Esta é a ponte que faltava entre `radio_da_mesa`, que chaveia por
**endereço do adaptador** (`ocupacao_por_adaptador`,
`integrations/radio_da_mesa.py:323`), e `mesa_de_radio`, que sabe **onde o
adaptador está** e não sabe o endereço — a ausência está escrita e medida no
cabeçalho do módulo (`mesa_de_radio.py:24-33`: *"`/sys/class/bluetooth/hci0/`
não tem arquivo `address`"*). Com ela, e **sem root, sem `busctl`, sem D-Bus de
sistema e sem Flatpak reclamar**, o produto passa a poder dizer *"o Jogador 2
está no adaptador da porta 15a"*.

**Lado ruim, e ele manda no desenho.** O serial **é dado pessoal pela régua
desta casa** — a própria `check_anonymity.sh:333` escreve que *"o serial
identifica a unidade dela tão bem quanto o MAC"*. Logo: **o serial nunca vai
para a tela, nunca vai para o `maquina.json`, nunca aparece num PNG do
retrato.** Ele vive em memória, só para casar duas leituras, e some.

**NÃO VERIFICADO:** que serial-é-endereço valha fora destes TP-Link. O Wi-Fi
desta mesma bancada responde `123456`, o que já prova que **não é regra
universal**. O uso tem de ser: *casar quando o serial tem doze hex E bate com um
endereço que o BlueZ já reportou; nos outros casos, dizer "não sei em qual
porta"*. Adivinhar aqui é a classe de erro do
`O-AGENTE-AFIRMA-COM-CONFIANCA-O-QUE-NAO-EXISTE`.

### 2.6 O que a aba diz hoje, e por que a palavra dela é exata

`_onde_esta_o_adaptador` (`src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py:1433`)
monta `"Barramento 3, porta 1.1.4 · Em hub"`. E `_avisos_de_vizinhanca`
(`:1589`) nomeia o par por **ordinal da lista da tela**. Palavra dela:

> *"vizinhança das portas, qual porta?"*
> *"o barramento sem me permitir entender se tá em hub ou não e sem permitir
> selecionar ou visualizar nada tá péssimo"*

Ela não está pedindo outra redação. Está dizendo que **o produto não tem o
número que ela usa**.

### 2.7 A altura já está no vermelho

A aba pede **2465 px numa janela de 1080** (`CONFIGURAÇÕES-FECHA-01` §2.4, foto
`readme_configuracoes_inteira.png`). Qualquer desenho de mesa **dentro** da
seção nasce abaixo da dobra. Isto não é preferência de layout: é o número que
escolhe o lugar do mapa (§4).

### 2.8 A casa não tem um único arrastar-e-soltar

```bash
grep -rn "drag_source_set\|drag_dest_set\|TargetEntry\|DragAction" src/   # ZERO
grep -rln "Gtk.Grid" src/                                                # 10 arquivos
```

`Gtk.Grid` é vocabulário corrente da casa (`secao_exame.py`,
`secao_orcamento.py`, `external_card.py`, `controller_card.py`, …). Arrastar não
existe em lugar nenhum. Isto entra no preço do §4, não como veto.

---

## 3. O esquema — onde o mapa é gravado

**Vai para o `maquina.json`, no campo novo `mapa`, e a `version` NÃO sobe.**

### 3.1 Por que não subir a versão — e isto é o item de migração inteiro

`gravar_maquina_com_descartes` (`src/hefesto_dualsense4unix/utils/maquina.py`)
recusa gravar quando a `version` em disco não é a nossa, e `carregar_maquina`
devolve documento **vazio** no mesmo caso. Trocar `MAQUINA_SCHEMA_VERSION` para
`2` faria, na máquina de quem já declarou:

- toda leitura devolver "não sei" em mesa, controles e orçamento;
- toda gravação devolver `gravou=False`, e o rodapé dizer *"não gravei"* para
  sempre.

O caminho de baixo custo **já está construído no módulo**, e nos dois sentidos:

- **arquivo antigo lido por código novo** — `mapa` ausente cai no
  `default_factory`, e todas as afirmações novas voltam ao texto de hoje. Nada
  se perde;
- **arquivo novo lido por código antigo** — `_so_o_que_o_schema_conhece` tira
  `mapa` da validação, e o `documento = {campo: valor … if campo not in
  MaquinaConfig.model_fields}` de `gravar_maquina_com_descartes` **copia `mapa`
  verbatim** de volta para o disco. Uma versão velha lê, grava e **não destrói**
  o mapa;
- **`mapa` corrompido por edição à mão** — `_o_que_ainda_vale` valida campo de
  topo por campo de topo: o estrago para em `mapa`, e mesa/controles/orçamento
  sobrevivem. `_guardar_os_bytes_recusados` já grava o `.invalido`.

Campo novo sem bump de versão é a migração. **Não há passo de migração a
escrever.**

### 3.2 O esquema

```
MapaDaMesa
  faces:  list[FaceDeclarada]          # a ORDEM é a ordem do desenho
  portas: dict[str, PortaDeclarada]    # chave = o número que ELA escreveu

FaceDeclarada
  nome:   str                          # "Frente", "Traseira", "Hub", "Esquerda"
  portas: list[str]                    # os números daquela face, na ordem

PortaDeclarada
  caminho:   str | None                # "3-1.1.4" — a âncora do §2.3
  filha_de:  str | None                # "15" — a porta que hospeda o extensor
```

Três regras de validação, cada uma com o defeito que ela fecha:

| regra | o que ela impede |
|---|---|
| `caminho` casa `^[0-9]+-[0-9]+(\.[0-9]+)*$` | chave de dicionário sem validador é como `radios` herdou lixo (`_CHAVE_DE_RADIO`, mesmo módulo) |
| número de porta casa `^[0-9]{1,3}[a-z]?$` | a porta-filha é `15a` e nada mais; sem teto, um arquivo torto vira uma grade de mil quadrados |
| no máximo 8 faces e 64 portas | o mesmo |

**Sem acento por construção**, pela regra do cabeçalho de `utils/maquina.py`:
`filha_de` e não `mae` — "mãe" escrito sem acento dentro de string é exatamente
o que `validar-acentuacao.py` reprova. `caminho`, `faces`, `portas`, `nome`: nem
um acento a mascarar.

**Um dono para cada fato.** A face lista os números; a porta guarda a
amarração. A face **não** repete o caminho e a porta **não** repete a face —
essa duplicação é a classe de defeito que a `ABAS-01` curou, e é a mesma razão
pela qual `numero de jogador`, `máscara` e `tamanho do texto` ficaram fora
deste arquivo (cabeçalho de `utils/maquina.py`).

**Porta vazia não tem entrada.** `_podar` já tira `None` e `{}` do documento
antes de escrever; ausência é a resposta "aqui não tem nada", e é a mesma
gramática de "não sei" que o arquivo inteiro usa.

### 3.3 A mesa dela, preenchida

Da foto numerada dela de 24/08, cruzada com a tabela do §2.1:

```json
{
  "version": 1,
  "mapa": {
    "faces": [
      { "nome": "Frente",   "portas": ["1", "2"] },
      { "nome": "Traseira", "portas": ["3", "4", "5", "6", "7", "8"] },
      { "nome": "Hub",      "portas": ["9", "10", "11", "12", "13", "14", "15"] }
    ],
    "portas": {
      "1":   { "caminho": "1-3" },
      "4":   { "caminho": "3-1" },
      "5":   { "caminho": "3-3" },
      "6":   { "caminho": "3-4" },
      "9":   { "caminho": "3-1.2" },
      "11":  { "caminho": "4-1.1.2" },
      "13":  { "caminho": "3-1.4" },
      "15a": { "caminho": "3-1.1.4", "filha_de": "15" }
    }
  }
}
```

Oito entradas para quinze portas. As sete que faltam estão vazias no gabinete, e
o arquivo diz isso não dizendo nada. **Nenhum serial, nenhum endereço** — a
âncora é o caminho, e o caminho não identifica ninguém.

**Um teste de coerência sai de graça deste desenho:** a face "Hub" tem o cabo
dela na porta 4 (`3-1`), e os caminhos das portas 9, 11, 13 e 15a têm de
**pendurar** em `3-1`. Aqui um não pendura: `4-1.1.2`, o Wi-Fi, é do
barramento 4. Isso não é erro dela — é o **hub dual-bus**, cujo lado USB 3.0
enumera em `4-1`/`4-1.1` enquanto o lado 2.0 enumera em `3-1`/`3-1.1`. O produto
tem de **saber disso e não acusar**, e é a tarefa `MAPA-6`.

---

## 4. O desenho — como o 2D nasce em GTK3 sem virar um projeto de meses

### 4.1 Onde ele mora: **janela própria**, não dentro da seção

O número do §2.7 decide: 2465 px numa janela de 1080. Três faces de quadrados
mais a lista de aparelhos são mais uns 350 px, e nasceriam abaixo da dobra —
seria construir a feature e escondê-la, que é a
`A-CASA-SABE-E-O-PRODUTO-NAO-FAZ` de novo.

Dentro de "Conexões" fica **uma linha e um botão**:

```
Mesa: 3 faces, 15 portas, 7 aparelhos colocados.   [Desenhar a minha mesa]
```

e, quando ela nunca desenhou:

```
Você ainda não desenhou a sua mesa. Enquanto isso o Hefesto diz o
caminho do sistema (3-1.1.4) em vez do número da sua porta.
                                          [Desenhar a minha mesa]
```

### 4.2 O gesto: **clique-em-clique**, e a recomendação é essa

O desenho é um `Gtk.Grid` de `Gtk.ToggleButton` por face (uma linha de
quadrados por face), ao lado de uma lista dos aparelhos que o censo achou. O
gesto tem dois tempos: **clico no aparelho, clico no quadrado.** Clicar num
quadrado cheio oferece "Tirar daqui".

**Os dois caminhos, com o preço de cada um:**

| | clique-em-clique | arrastar-e-soltar |
|---|---|---|
| código | 2 sinais (`toggled`, `clicked`), estado num dicionário | 4 sinais (`drag-begin`, `drag-data-get`, `drag-data-received`, `drag-drop`), `Gtk.TargetEntry`, ícone de arrasto |
| precedente na casa | `Gtk.Grid` em 10 arquivos (§2.8) | **zero** (§2.8) |
| teclado | Tab + Enter, de graça | inutilizável sem mouse |
| foto | estados contáveis: nada escolhido · aparelho escolhido · porta cheia · porta em conflito | um arrasto pela metade **não é um estado**, e o retrato não fotografa |
| desfazer | um clique | precisa de gesto próprio |
| como se parece | funcional | **é o que ela pediu com a palavra "arrastado"** |

**RECOMENDO clique-em-clique**, e o motivo que pesa mais é o quarto: a regra
desta casa é *"conte estados, não diálogos"*, e a prova de tela de um arrastar
não existe. Mas a decisão `D-MAPA-2D` diz **"desenhado e arrastado por ela"**, e
eu não troco a palavra dela por conta própria — vira a pergunta 1 da §7.

**O que NÃO fazer, e o preço está medido:** um `Gtk.DrawingArea` com posição
livre. A casa tem seis (`sensor_widgets.py`, `button_glyph.py`,
`stick_preview_gtk.py`), e todos **pintam**; nenhum recebe clique com
teste de acerto. Canvas significa escrever à mão hit-test, anel de foco,
contraste dos dois temas e navegação por teclado — semanas, para trocar uma
fileira de quadrados por uma fileira de quadrados desenhada.

### 4.3 O que o desenho mostra em cada quadrado

Cada quadrado carrega **três coisas e não mais**: o número (grande), o que está
lá (ícone de espécie do censo — `Aparelho.especie` já traz "Mouse", "Teclado",
"Bluetooth", "Câmera"), e a moldura de estado. Nada de velocidade, nada de
miliamperes, nada de caminho — isso é o corpo do tooltip.

**Porta-filha:** o `15a` desenha **dentro** do quadrado `15`, encostado no canto,
com a legenda "por extensão". Não ganha quadrado próprio na fileira, senão a
fileira de sete portas do hub vira oito e o desenho deixa de bater com o metal.

---

## 5. O que fica sabido depois — as afirmações NOVAS

Cada linha diz de que ela precisa. As que dependem de outra frente estão
marcadas, e **nenhuma frase de tela desta lista é escrita aqui**: esta sprint
entrega o número.

| afirmação nova | do que precisa | quem escreve a frase |
|---|---|---|
| "O adaptador está na **porta 9**" (em vez de "Barramento 3, porta 1.2") | mapa | **desta sprint** (`MAPA-7`) |
| "As portas **10, 12 e 14** estão livres" | mapa | **desta sprint** (`MAPA-7`) |
| "As portas **9 e 11** são vizinhas" (em vez de "vizinho do adaptador 3") | mapa + `vizinhancas_apertadas` | **Frente B** (a ordem de serviço) |
| "O Jogador 2 está no adaptador da **porta 15a**" | mapa + o casamento do §2.5 + `ocupacao_por_adaptador` | **Frente C** (o medidor por adaptador) |
| "O Wi-Fi da **porta 11** e o Bluetooth da **15a** pendem do mesmo hub" | mapa + `hub_em_comum` (`censo_do_barramento.py:355`) — **existe e não tem consumidor** | **Frente B** |
| "As portas **5, 9 e 15a** pedem 500 mA cada, e três das quatro estão atrás do hub da porta 4" | mapa + `Energia.corrente_pedida_ma` (`censo_do_barramento.py:179`) — **existe e não tem consumidor** | **Frente B** |
| "Tem porta livre na **traseira**; este dongle está no hub" | mapa | **Frente B** (é a matéria-prima da ordem de serviço) |
| "Você declarou o hub na porta 4, e o aparelho da porta 9 não pendura nele" | mapa + `cadeia_de_hubs` (`:331`) | **desta sprint** (`MAPA-6`) |
| "O aparelho que estava na porta 9 sumiu" / "chegou um aparelho na porta 12" | mapa + censo | **desta sprint** (`MAPA-7`) |

Três dessas leituras — `hub_em_comum`, `cadeia_de_hubs`, `Energia` — nasceram em
22/08 e **nunca tiveram um consumidor em `app/`**. O mapa é o consumidor que
faltava.

---

## 6. O extensor

**Não tem conserto por leitura, e a sprint diz isso em voz alta.** Cabo de
extensão passivo não tem descritor USB: o dongle na ponta enumera como se
estivesse na porta do hub. Nenhuma leitura de `/sys`, hoje ou nunca, distingue
os dois casos.

**Como ela declara:** no quadrado da porta 15, um botão **"Tem uma extensão
aqui"** cria a porta-filha `15a`. Depois ela põe o dongle no `15a` como põe em
qualquer outra porta. O arquivo grava
`"15a": {"caminho": "3-1.1.4", "filha_de": "15"}`.

**Como o produto sabe:** porque **ela disse**. Não há detecção, não há palpite,
e o tooltip do quadrado escreve isso — é a mesma disciplina do selo
`(você disse)` que a coluna "O que é" já usa (`secao_mesa.py:180`).

**E a porta-filha muda o cálculo de vizinhança, que é o ponto todo.** Hoje
`_portas_vizinhas` (`mesa_de_radio.py:366`) diz que `1.1.4` e `1.1.3` são
vizinhas — verdade no soquete, **falsa a três metros de cabo**. Com o mapa, uma
porta declarada como filha **deixa de ser vizinha física** de quem está na
fileira, e passa a ser vizinha de quem estiver na mesma extensão. Sem isso o
produto pinta de laranja um par que está do outro lado da sala — que é
literalmente o defeito que a `PORTAS-DA-CASA-01` §1.3 mediu do outro lado (o
teclado **de cabo** contado como rádio).

---

## 7. O caso do notebook

O alvo declarado por ela: *"alguém que não tem PS5, jogando jogo grátis na
Steam e na Epic, no Linux"*. Isso é notebook com duas ou três portas, sem
traseira, talvez um hub barato. Quatro regras, e cada uma nasce de recusar uma
presunção:

1. **Nenhuma face nasce sozinha.** O produto **nunca** cria "Frente" e
   "Traseira" por conta própria. Um notebook declara "Esquerda: 1, 2" e
   "Direita: 3", e ponto. Face inventada é a presunção que a
   `ONDA0-Z7 · O AMBIENTE PRESUMIDO` existe para caçar.
2. **O rádio embutido não é uma porta.** Adaptador sem nó USB já é lido
   (`mesa_de_radio.py:248-251`: `Adaptador(interface=nome)` e nada mais) e já
   tem palavra de tela (`_nome_do_adaptador`, `:1419`: "Adaptador embutido").
   No desenho ele é um quadrado **fixo, sempre presente, nunca editável**, fora
   das faces, com o rótulo "Dentro da máquina". Sem ele o dono do notebook abre
   o mapa, não acha o Bluetooth dele em porta nenhuma e conclui que o produto
   está quebrado — e é o caso **mais comum lá fora**, como o cabeçalho de
   `mesa_de_radio.py:42-49` já registra.
3. **Zero portas declaradas é um estado legítimo**, e a tela diz o que ainda
   dá para dizer (§4.1). Nada regride: sem mapa, a aba fala como fala hoje.
4. **O hub do notebook é uma face**, exatamente como o dela. A regra é a mesma:
   uma face por conjunto de portas que a pessoa enxerga junto.

**NÃO VERIFICADO:** que o caminho de barramento continue estável num notebook
depois de desencaixar e reencaixar uma dock. Aqui é PC de mesa, e não há dock
para medir. A afirmação "declarado uma vez, vale para sempre" fica **restrita ao
soquete fixo** até alguém medir, e a tela não promete mais que isso.

---

## 8. As tarefas

Custo em linhas é **DESENHO**, não medição.

### MAPA-1 — o esquema, sem bump de versão

**Arquivo:** `src/hefesto_dualsense4unix/utils/maquina.py`
**O que muda:** três modelos (`FaceDeclarada`, `PortaDeclarada`, `MapaDaMesa`),
`mapa: MapaDaMesa = Field(default_factory=MapaDaMesa)` em `MaquinaConfig`, os
três validadores do §3.2. `MAQUINA_SCHEMA_VERSION` **não é tocado**, e a linha
que diz por quê fica no módulo. ~90 linhas.

**A MORDIDA:** `tests/unit/test_mapa_da_mesa_sobrevive_a_versao.py` <!-- ref-externa: nasce nesta sprint, ainda não existe -->
::`test_o_codigo_antigo_preserva_o_mapa` — grava um documento com `mapa`
preenchido, roda a gravação **filtrando `mapa` de `MaquinaConfig.model_fields`**
(simulando o binário que não conhece o campo), relê e afirma que `mapa` está
byte a byte igual.
**Arrancada a cura** (subindo `MAQUINA_SCHEMA_VERSION` para `2`): o teste
irmão ::`test_documento_da_v1_continua_sendo_lido` vê `carregar_maquina()`
devolver `MaquinaConfig()` vazio sobre um arquivo com `version: 1` e mesa
declarada, e reprova nomeando `mesa.altura_da_antena` como o campo perdido.

### MAPA-2 — o caminho de barramento vira propriedade

**Arquivo:** `src/hefesto_dualsense4unix/integrations/mesa_de_radio.py`
**O que muda:** `Adaptador.caminho` e `RadioUsb.caminho` como `@property`
devolvendo `f"{busnum}-{devpath}"` (`""` quando falta qualquer metade — o
embutido), e nada mais. É a palavra comum com `censo_do_barramento.nome_do_kernel`
(§2.3). ~12 linhas.

**A MORDIDA:** `tests/unit/test_mapa_da_mesa_fala_a_mesma_lingua.py` <!-- ref-externa: nasce nesta sprint, ainda não existe -->
::`test_o_caminho_do_adaptador_bate_com_o_do_censo` — sobre a **mesma raiz de
mentira**, roda `adaptadores_bluetooth()` e `ler_o_barramento()` e afirma que
todo `Adaptador.caminho` existe como `Aparelho.nome_do_kernel`.
**Arrancada a cura** (devolvendo `f"{busnum}-{devpath.replace('.','-')}"`, o erro
plausível): a interseção fica vazia e o teste imprime os dois conjuntos.

### MAPA-3 — o módulo de junção

**Arquivo:** `src/hefesto_dualsense4unix/integrations/mapa_das_portas.py` (novo) <!-- ref-externa: nasce nesta sprint, ainda não existe -->
**O que muda:** funções puras, sem GTK, sem IPC, sem `/dev`:
`porta_de(mapa, caminho)`, `caminho_de(mapa, porta)`, `portas_livres(mapa, censo)`,
`vizinhas_de_verdade(mapa, censo)`, `incoerencias(mapa, censo)`, e
`porta_do_adaptador(mapa, adaptadores, enderecos_do_bluez)` — este último é o
casamento do §2.5, e ele **recebe** os endereços em vez de ir buscá-los, para
que `integrations/` não passe a depender de D-Bus. ~170 linhas.

**A MORDIDA:** `tests/unit/test_mapa_das_portas_responde_pela_porta.py` <!-- ref-externa: nasce nesta sprint, ainda não existe -->
::`test_tres_adaptadores_de_mesmo_vid_pid_recebem_portas_distintas` — monta o
mapa do §3.3 e os três `2357:0604` do §2.1 e afirma
`{"9", "5", "15a"}` como resposta, **três valores diferentes**.
**Arrancada a cura** (voltando a chavear por `vid:pid`): as três respostas
colapsam em uma e o teste reprova dizendo qual porta foi devolvida três vezes.
Um segundo caso, ::`test_serial_que_nao_e_endereco_nao_casa`, dá o serial
`123456` do Wi-Fi e afirma **`None`**, não um palpite.

### MAPA-4 — a janela de desenhar a mesa

**Arquivo:** `src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py` (novo) <!-- ref-externa: nasce nesta sprint, ainda não existe -->
**O que muda:** a janela do §4 — faces em `Gtk.Grid`, lista de aparelhos do
censo, clique-em-clique, "Tem uma extensão aqui", "Tirar daqui", e o
acréscimo/remoção de face e de porta. Grava por `host._maquina_pendente` e
**não chama `machine.declare`**: o dono do gesto de gravar é o "Aplicar" do
rodapé (`footer_actions.py`, e a razão está em `secao_mesa.py:1279`). ~320
linhas.

**A MORDIDA:** `tests/unit/test_a_janela_do_mapa_coloca_o_aparelho.py` <!-- ref-externa: nasce nesta sprint, ainda não existe -->
::`test_colocar_e_tirar_deixa_o_rascunho_no_estado_anterior` — sob
`Gtk.OffscreenWindow` (nunca `Gtk.Window`: sob Xvfb ela fica 1x1 para sempre,
`COMO-OLHAR-A-TELA.md`), escolhe o aparelho, clica na porta 9, afirma
`host._maquina_pendente["mapa"]["portas"]["9"]["caminho"] == "3-1.2"`, clica em
"Tirar daqui" e afirma que a chave **sumiu** — não que ela virou `None`.
**Arrancada a cura** (gravando direto no disco em vez de no rascunho): o teste
irmão ::`test_desenhar_sem_aplicar_nao_toca_o_disco` vê o `mtime` do
`maquina.json` mudar e reprova.

### MAPA-5 — a linha e o botão dentro de Conexões

**Arquivo:** `src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py`
**O que muda:** a linha-resumo do §4.1 e o botão que abre a `MAPA-4`. **Uma
linha de altura**, e é o teto: a seção já está no vermelho (§2.7). ~40 linhas.

**A MORDIDA:** `tests/unit/test_conexoes_nao_engorda_com_o_mapa.py` <!-- ref-externa: nasce nesta sprint, ainda não existe -->
::`test_a_secao_ganha_no_maximo_uma_linha` — mede
`get_preferred_height()` da moldura de Conexões antes e depois, sob
`Gtk.OffscreenWindow` e com raízes de `/sys` de mentira (o
`CANARIO-FS-01`, `tests/conftest.py:338`, reprova constante de módulo), e
afirma delta ≤ 48 px.
**Arrancada a cura** (pondo a grade de faces dentro da seção): o delta passa de
300 px e o teste reprova imprimindo os dois números.

### MAPA-6 — a incoerência que o hub dual-bus NÃO é

**Arquivo:** `src/hefesto_dualsense4unix/integrations/mapa_das_portas.py` <!-- ref-externa: nasce na MAPA-3 -->
**O que muda:** `incoerencias()` acusa "porta desta face não pendura no
caminho declarado para a face" **exceto** quando os dois caminhos diferem
**apenas no barramento** e os dois barramentos pendem do mesmo controlador PCI
— que é a assinatura do hub dual-bus dela (§3.3: `3-1` e `4-1`, mesmo aparelho
de metal, dois barramentos). `controlador_pci` já é lido nos dois módulos
(`mesa_de_radio.py:141`, `censo_do_barramento.py:233`). ~45 linhas.

**A MORDIDA:** `tests/unit/test_o_hub_de_dois_barramentos_nao_e_incoerencia.py` <!-- ref-externa: nasce nesta sprint, ainda não existe -->
::`test_o_wifi_no_lado_usb3_do_mesmo_hub_nao_acusa` — mapa do §3.3, censo do
§2.1, afirma `incoerencias() == ()`.
**Arrancada a cura** (a comparação de prefixo crua): sai uma incoerência
apontando a porta 11, e o teste reprova com a frase que a tela mostraria — que
seria uma acusação falsa contra a mesa dela.
Um segundo caso, ::`test_aparelho_que_de_fato_nao_pendura_acusa`, move o
caminho da porta 9 para `1-3` e afirma que **acusa** — senão a cura seria
"nunca acusar nada", que passa e não mede.

### MAPA-7 — o número da porta chega ao texto que já existe

**Arquivo:** `src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py`
**O que muda:** `_onde_esta_o_adaptador` e `_onde_esta_o_radio` passam a
perguntar ao mapa antes de montar a frase. **Com** mapa: `"Entrada 9"`. **Sem**
mapa: exatamente o texto de hoje, sem uma vírgula de diferença. ~35 linhas.

**A MORDIDA:** `tests/unit/test_a_porta_dela_chega_na_frase.py` <!-- ref-externa: nasce nesta sprint, ainda não existe -->
::`test_com_mapa_a_frase_traz_o_numero_dela` afirma que a frase do adaptador em
`3-1.2` **contém `"Entrada 9"` e NÃO contém nem `"Porta"` nem `"Barramento"`** — a asserção guarda as DUAS palavras recusadas; e
::`test_sem_mapa_a_frase_e_a_de_hoje` afirma a string de hoje, literal.
**Arrancada a cura**: o primeiro vê "Barramento 3, porta 1.2" e reprova. O
segundo é a mordida que importa mais — ele reprova se alguém "melhorar" o texto
de quem nunca desenhou a mesa, que é a regressão silenciosa desta tarefa.

### MAPA-8 — a medição de bancada, e ela é DELA

**NÃO EXECUTADA.** Pergunta: **o serial USB é o endereço Bluetooth em algum
adaptador que não seja TP-Link?** O §2.5 mede três TP-Link e um contraexemplo
(o Wi-Fi, `123456`). Sem um quarto aparelho de outro fabricante, o casamento
fica sustentado por uma marca só.

```bash
# Com o adaptador de outro fabricante plugado, e SEM sudo:
for n in /sys/bus/usb/devices/*/serial; do
  d=$(dirname "$n")
  printf '%-40s %-12s %s\n' "$d" "$(cat "$d/idVendor" 2>/dev/null)" "$(cat "$n")"
done
# e, do lado do BlueZ, o endereço que ele reporta para o mesmo aparelho.
```

**O que a resposta muda:** se casar, a afirmação "o Jogador 2 está na porta 15a"
sai para todo mundo. Se não casar, ela sai **só quando o serial bate**, e nos
outros casos o produto diz "não sei em qual porta" — que já é o desenho da
`MAPA-3`, e por isso **esta medição não trava nada**.

---

## 9. Prova de tela (D3), por tarefa

| tarefa | carimbo | por quê |
|---|---|---|
| `MAPA-1` | **não toca a tela** | esquema em disco |
| `MAPA-2` | **não toca a tela** | propriedade derivada |
| `MAPA-3` | **não toca a tela** | funções puras |
| `MAPA-4` | **precisa do olho dela ANTES** | é uma janela nova inteira: texto novo, ordem, o que nasce visível. E o gesto ainda é pergunta (§10.1) |
| `MAPA-5` | **precisa do olho dela ANTES** | duas frases novas em "Conexões", e uma delas é o que se vê ao abrir sem ter desenhado nada |
| `MAPA-6` | **não toca a tela** | a frase de incoerência é da Frente B; aqui só o cálculo |
| `MAPA-7` | **precisa do olho dela ANTES** | reescreve texto que ela já lê hoje |
| `MAPA-8` | **não toca a tela** | medição de bancada |

Fotos: `scripts/gui-captura/retratar_dialogos.py` para a `MAPA-4` — **contar
estados**, não diálogos: nada escolhido · aparelho escolhido · porta cheia ·
porta com extensão · mesa vazia (notebook). E `retratar_abas.py` **uma vez só,
no fim da leva, por quem coordena** — quatro frentes em paralelo gravando as
onze fotos por cima uma da outra é o defeito que a regra existe para matar.

---

## 10. Qual pergunta de Bluetooth trava esta sprint

**NENHUMA.** Tudo aqui é `/sys`, sem root, sem `/dev`, sem D-Bus, sem
`bluetoothctl`. A `MAPA-8` é a única medição, é dela, e o §8 já diz que o
desenho funciona nos dois desfechos.

O que trava são **duas perguntas de produto**, e nenhuma é de rádio:

### 10.1 O gesto: arrastar ou clique-em-clique?

`D-MAPA-2D` diz *"desenhado e **arrastado** por ela"*. O §4.2 mede que
arrastar custa quatro sinais, não tem um precedente na casa, é inutilizável por
teclado e **não pode ser fotografado**. Recomendo clique-em-clique. É palavra
dela contra medição minha, e quem decide é ela.
**Preço do outro lado:** clique-em-clique é menos gostoso, e ela pediu
arrastar com essa palavra.

### 10.2 A janela própria, ou espremer dentro da seção?

O §2.7 mede 2465 px numa janela de 1080 e o §4.1 recomenda janela própria. O
preço: mais um lugar para ir, e uma janela a fotografar.
**Preço do outro lado:** inline, o mapa nasce abaixo da dobra — construir e
esconder.

---

## 11. A posse

```yaml
posse:
  MAPA-A: [src/hefesto_dualsense4unix/utils/maquina.py]
  MAPA-B: [src/hefesto_dualsense4unix/integrations/mesa_de_radio.py]
  MAPA-C: [src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py]
cria:
  - src/hefesto_dualsense4unix/integrations/mapa_das_portas.py
  - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
  - tests/unit/test_mapa_da_mesa_sobrevive_a_versao.py
  - tests/unit/test_mapa_da_mesa_fala_a_mesma_lingua.py
  - tests/unit/test_mapa_das_portas_responde_pela_porta.py
  - tests/unit/test_a_janela_do_mapa_coloca_o_aparelho.py
  - tests/unit/test_conexoes_nao_engorda_com_o_mapa.py
  - tests/unit/test_o_hub_de_dois_barramentos_nao_e_incoerencia.py
  - tests/unit/test_a_porta_dela_chega_na_frase.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
  - src/hefesto_dualsense4unix/integrations/exame_da_mesa.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_janela.py
  - src/hefesto_dualsense4unix/app/actions/config/secoes.py
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - docs/data/decisoes-dela.csv
```

### Colisões declaradas — as quatro frentes correm juntas

| arquivo | com quem | resolução |
|---|---|---|
| `app/actions/config/secao_mesa.py` | **Frente D** troca `TITULO = "A mesa"` por `"Conexões"` e mexe em tooltip; **Frente B** escreve a ordem de serviço aqui | **serializar por região.** D toca só as constantes de topo (`TITULO`, `DICA`, `_DICA_*`); esta sprint toca só `_onde_esta_o_adaptador`, `_onde_esta_o_radio` e a montagem em `_PainelDaMesa.montar`; B acrescenta um bloco novo. Se o executor preferir garantia, D entra **primeiro** (é a menor) e esta sprint rebasa. |
| `utils/maquina.py` | **Frente C** move a caixinha "Microfone" para uma declaração por controle dentro de Desempenho, e pode querer campo novo | **sem colisão de linha, colisão de versão.** Os dois acrescentam campo **sem bump** (§3.1). O executor que chegar depois confere que `MAQUINA_SCHEMA_VERSION` continua `1`. |
| `integrations/censo_do_barramento.py` | **Frente B** vai querer `Energia` e `hub_em_comum` na tela | **não colide:** esta sprint **lê** e não altera. Está fora do `posse:` de propósito. |
| `integrations/mesa_de_radio.py` | **Frente B** pode querer mudar `vizinhancas_apertadas` para nomear as portas | **colide de verdade.** A `MAPA-6` muda o comportamento da vizinhança para porta-filha. Proposta: **a vizinhança fica com esta frente**, e a Frente B consome `mapa_das_portas.vizinhas_de_verdade` em vez de mexer no módulo. |
| `docs/data/decisoes-dela.csv` | **todas** as frentes vão querer registrar decisão | **ninguém escreve nele.** Quem coordena consolida no fim; as perguntas da §10 vão no retorno da frente, não no CSV. |
| `docs/usage/assets/*.png` | **todas** | **ninguém roda `retratar_abas.py`.** Uma execução, no fim, por quem coordena (§9). |

---

## 12. O que sobrou para o próximo

- **A ordem de serviço** (Frente B) é quem transforma estes números em frase com
  selo de procedência. Esta sprint não escreve uma.
- **"Onde seria melhor alocar o quê"** — palavra dela. Precisa do mapa **e** da
  regra de decisão, e a regra é derivada do guia do André, que é **hipótese, não
  lei**. Fica para depois de a `MAPA-8` e as medições dela dizerem o que se pode
  afirmar.
- **A cor da moldura do quadrado por estado** (livre · ocupado · em conflito ·
  por extensão) — decidida junto com a `MAPA-4`, mas o catálogo de cor de estado
  desta casa mora no `theme.css` e merece uma passada única, não uma por frente.
- **Editar a face por arrastar a ordem das portas.** Fora do MVP: a ordem é a
  ordem da lista, e reordenar se faz apagando e pondo de novo.
- **Exportar o mapa para o `doctor`.** O mapa é exatamente o que falta num
  relatório de suporte — e é também onde o §2.5 volta a morder: **o relatório
  não pode levar serial**.
- **Pro Controller e 8BitDo** entram na 1.0, e o mapa já serve os dois sem uma
  linha a mais: ele é do gabinete, não do controle.
