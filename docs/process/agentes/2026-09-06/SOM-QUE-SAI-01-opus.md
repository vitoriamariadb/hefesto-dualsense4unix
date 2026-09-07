# SOM-QUE-SAI-01 — o motor do alto-falante virtual

**Árvore:** `hefesto-voo/SOM-QUE-SAI-01-opus` · **branch** `voo/SOM-QUE-SAI-01-opus`
· **base** `ae1c3d82` (o mesmo de `onda/atual-0609`, conferido) · **06/09/2026**

**A rota corrigida no topo da sprint venceu o corpo dela**, e é ela que define o
que D1-D3 são: *"o que falta está nomeado em `radio_codigo_ref`: (1) o ENCODER;
(2) o SINK; (3) o ARRANJO. **Os degraus D1-D3 constroem os três** e mandam o
MESMO PCM pelos DOIS arranjos, cada um com a sua régua; **D4 é o ensaio 1 da
MESA-DE-QUATRO-01**"*.

**A frase que esta entrega não escreve, e o mapa proíbe:** nada aqui afirma que
o áudio por rádio foi descoberto nem que a ponte de saída trabalha. Ninguém
desta casa mandou um byte de áudio por rádio. O honesto é o par: **o canal
responde, e o conteúdo vai pelos dois arranjos candidatos.** A forma de erro
tem nome — FALÁCIA DO CANAL QUE RESPONDE — e há régua nova que a vigia dentro
dos três arquivos criados.

---

## O que mudou

Quatro arquivos NOVOS. Nenhum arquivo existente foi editado — nem a metade de
ENTRADA (`integrations/dualsense_bt_audio.py`, `daemon/subsystems/bt_mic.py`),
nem os dois de `nao_toca:` (`app/audio_saida.py`, `docs/data/mapa-controles.csv`).

### 1. `src/hefesto_dualsense4unix/integrations/alto_falante_bt.py` — as três dívidas do mapa

**(1) O ENCODER.** `CodificadorOpus`, ctypes sobre a MESMA `libopus.so.0` que o
decodificador da entrada já usa — **zero pacote novo**. Handle `CDLL` próprio,
prototipando só os símbolos de encoder, para não escrever por cima dos
`argtypes` do decodificador (que mora em módulo fora da posse).

**A configuração não é gosto, ela é a conta que fecha:** CBR 160 kbps, 10 ms,
48 kHz, estéreo → `160000 × 0,010 ÷ 8 = 200 bytes exatos`, que é o `len` que as
DUAS fontes declaram para o bloco de áudio do `0x39`. **Medido nesta árvore:**
`libopus 1.4`, cinco quadros seguidos de PCM senoidal saem `[200, 200, 200,
200, 200]`. Com o CBR arrancado o mesmo quadro saiu **319 bytes** — o bloco
deixa de fechar.

**(2) O SINK.** `SinkVirtualPipeWire` — um `module-null-sink` por controle,
`s16le`/48 kHz/2 canais, molde do `SourceVirtualPipeWire` da entrada virado ao
contrário. `null-sink` e não `pipe-sink` porque no cabo o monitor pode ser
ligado direto ao sink USB e **nenhum byte de áudio entra no Python**.

**O nome do nó é `hefesto_som_<hex6>`, derivado do `uniq`** — nunca do
transporte, nunca do `hidrawN`. É a sprint inteira: se o nome carregasse o
transporte, tirar o cabo mudaria o nó e a rota sumiria debaixo do jogo, que é o
defeito que se quer matar.

**(3) O ARRANJO — os DOIS, registrados sem escolher.** `Arranjo` é um dataclass
com os offsets e a procedência colada (repositório@commit, arquivo:linha, e
`de_onde_sei = "leitura de fonte externa — NÃO medido nesta bancada"`).
`montar_pelos_dois_arranjos()` recebe o MESMO PCM e devolve os dois reports.

| | (A) DS5Dongle | (B) Senshi |
| --- | --- | --- |
| AudioControl | tag `0x91` em [2], `len` **6** | tag `0x91` em [2], `len` **7** |
| háptico | `0xD2` em [10], corpo [12..139] | `0xD2` em [413], corpo [415..542] |
| áudio | `0xD3` em [140], 2×200 B em [142..541] | `0xD3` em [11], 2×200 B em [13..412] |
| CRC-32 | [543..546] | [543..546] |

**A escada é uma TABELA, e nunca aritmética.** `TAMANHO_DO_DEGRAU` traz os nove
números lidos do descritor (e corroborados pelo `hid-tools` do kernel).
`degrau_para_payload()` devolve o **menor** id cujo orçamento comporta o
payload, lendo a tabela.

### 2. `src/hefesto_dualsense4unix/daemon/subsystems/alto_falante.py`

`AltoFalanteSubsystem` + `GerenciadorDeNosDeSom` + `controles_na_lista()`.
Espelho do `bt_mic.py`. Faz as três decisões dela de
`D-0609-O-NO-DE-SOM-VIVE-COM-O-CONTROLE`: o nó vive só enquanto há controle
(tirar um da lista derruba o dele e deixa os outros de pé); ele não vira saída
padrão; e ele **não escreve no rádio**, logo não escolhe degrau — a escolha
`0x32`/`0x39` é do D5.

`controles_na_lista()` vê os DOIS transportes (a entrada só precisa do rádio) e
exclui o nosso próprio vpad pelo `HID_PHYS`, que é a única rede que sobra sem o
filtro de bus.

### 3. `scripts/ensaios/o_som_que_sai.py`

`--motor` (padrão, não toca em nada de fora), `--sink` (carrega, LÊ do servidor
e descarrega) e `--escrever` (a porta do ensaio de bancada, que **recusa** sem
`--exigir-mac` conferido, sem o aparelho no rádio, e para antes de escrever).
Declara a procedência de cada biblioteca pelo CAMINHO. Não abre janela.

### 4. `tests/unit/test_o_som_que_sai_do_sink_ao_byte.py` — 67 testes

---

## Qual mordida prova

**Seis curas arrancadas, seis vermelhos, e as curas devolvidas.** Saída em
`/tmp/mordidas-1a3.txt` e `/tmp/mordidas-4a6.txt`.

### 1. A tabela vira aritmética (`78 + 64 * (id - 0x31)`)

```
FAILED ...::TestAEscadaEhTabelaENuncaAritmetica::test_o_ultimo_passo_da_escada_e_de_21_e_nao_de_64
FAILED ...::TestAEscadaEhTabelaENuncaAritmetica::test_os_oito_primeiros_passos_sao_de_64
FAILED ...::TestAEscadaEhTabelaENuncaAritmetica::test_o_orcamento_e_derivado_do_envelope_do_common_e_do_crc
FAILED ...::TestOMenorDegrauQueComporta::test_acima_do_teto_nao_cabe_em_degrau_nenhum
FAILED ...::TestOsDoisArranjosVaoJuntosENenhumEhEscolhido::test_os_dois_tem_547_bytes_e_o_id_do_degrau
5 failed, 62 passed
```

O `0x39` sai **590 contra 547** — 43 bytes a mais, o CRC-32 fora do lugar, e o
firmware descartando calado.

### 2. Arrancado o CBR (`OPUS_SET_VBR(0)`)

```
>               assert len(quadro) == af.BYTES_POR_QUADRO_OPUS
E               AssertionError: assert 319 == 200
1 failed, 3 passed
```

**É a mordida mais informativa das seis:** sem CBR o quadro sai 319 bytes e o
bloco de 200 do `0x39` não fecha em nenhum dos dois arranjos.

### 3. O nome do nó passa a carregar o transporte

```
E             'bt' is contained here:
E               hefesto_som_bt_000001
FAILED ...::TestONomeDoNoNaoCarregaOTransporte::test_o_mesmo_controle_da_o_mesmo_no_nos_dois_transportes
FAILED ...::TestONomeDoNoNaoCarregaOTransporte::test_o_nome_nao_tem_palavra_de_transporte_dentro
2 failed, 8 passed
```

### 4. Tiradas as aspas de `sink_properties=`

```
>       assert any(a.startswith('sink_properties="') for a in argv)
E       assert False
FAILED ...::test_as_propriedades_viajam_entre_aspas_num_argumento_so
FAILED ...::test_o_load_module_leva_o_argumento_inteiro
2 failed, 1 passed
```

É a lição paga do lado da ENTRADA em 06/09: sem aspas o parser do
`pipewire-pulse` corta no primeiro espaço e a `priority.session` **nunca chega
ao nó** — e lá a régua dava verde porque lia o argv em vez do nó.

### 5. O nó deixa de morrer com o controle

```
FAILED ...::TestONoViveEnquantoHaControle::test_tirar_um_da_lista_derruba_o_dele_e_deixa_o_outro_de_pe
FAILED ...::TestONoViveEnquantoHaControle::test_lista_vazia_derruba_todos
2 failed, 4 passed
```

### 6. O arranjo do Senshi copia o do DS5Dongle

```
>       assert senshi[13:213] == marca_a
E       AssertionError: assert b'\x00\x00\x0...' == b'\xa1\xa1\xa...'
1 failed, 6 passed
```

### As curas devolvidas

```
tests/unit/test_o_som_que_sai_do_sink_ao_byte.py .................. [100%]
67 passed in 0.50s
```

### E o que NÃO é dublê: três medições de verdade

**(i) O nó CARREGA nesta máquina, e a prioridade CHEGA nele.** O mapa listava
isto como NÃO MEDIDO (*"module-null-sink e module-pipe-sink carregam nesta
máquina — medido só que os NOMES existem"*). Rodado com a bancada conferida
livre (`scripts/bancada.sh exigir`, rc=0), com MAC sintético, e descarregando no
mesmo gesto — saída em `/tmp/ensaio-sink.txt`:

```
O NÓ — nome derivado do controle, nunca do transporte: hefesto_som_000001
  module id            536870919
  estado (do servidor) SUSPENDED
  priority.session     10  (pedimos 10)
  saída padrão antes   alsa_output.pci-0000_0a_00.1.hdmi-stereo
  saída padrão agora   alsa_output.pci-0000_0a_00.1.hdmi-stereo
  virou a saída padrão? não
  a prioridade CHEGOU ao nó? sim
  o nó saiu ao descarregar? sim
  saída padrão no fim   alsa_output.pci-0000_0a_00.1.hdmi-stereo
  MEDIDO
```

A leitura é do **nó**, perguntada ao servidor — não do argv.

**(ii) A semente de CRC do DS5Dongle é o nosso `bt_crc32`, e é a mesma conta.**
O mapa registra que o DS5Dongle semeia com `0xEADA2D49` (`src/utils.h:126-137`).
Conferido aqui: `zlib.crc32(b"\xa2") = 0xEADA2D49`, e `BT_CRC_SEED = 0xA2`. As
duas implementações são a mesma, e não foi preciso reimplementar tabela nenhuma.

**(iii) As prioridades reais desta máquina, com dois DualSense no cabo**
(`LC_ALL=C pactl list sinks`): HDMI 696, IEC958 736, os dois DualSense 1109. O
menor sink REAL é 696, e o nó virtual nasce com 10.

---

## O que NÃO verifiquei

* **NÃO mandei um byte de áudio para aparelho nenhum.** Nada aqui mede que som
  saiu, e o `--escrever` do ensaio **para antes de escrever**, de propósito: é
  o ensaio 1 da MESA-DE-QUATRO-01 e precisa da orelha dela.
* **NÃO sei qual dos dois arranjos é o certo** — e o módulo não escolhe. As duas
  fontes divergem, e o Senshi nem é testemunha independente (cita o DS5Dongle).
* **NÃO medi o custo de banda de escrever em regime** (o D5). Continua NÃO
  MEDIDO, e a escolha `0x32`/`0x39` continua depois dele por decisão dela.
* **NÃO liguei o monitor do nó ao sink USB do controle no cabo** (o link de
  `module-loopback` + casamento por dispositivo USB). O `.so` do loopback existe
  nesta máquina — medido —, mas o link exige `fontes_de_captura.escolher_sink` e
  `usb_pai`, os dois fora da posse.
* **NÃO exercitei o mapa de canais do cabo** (só o canal 1 alcança o
  alto-falante interno; os 3-4 são voice-coil). Sem o link, não há onde aplicar.
* **NÃO toquei a regra do nó que não dorme** (drop-in 54): ela mora em
  `app/audio_saida.py`, que está em `nao_toca:`.
* **NÃO registrei o subsystem no daemon.** Ele existe e não é chamado por
  ninguém — declarado no próprio cabeçalho dele, e detalhado abaixo.
* **NÃO rodei a suíte inteira** (é de quem coordena, e ela toca nós uinput). O
  escopo rodou: 67 testes.
* **NÃO abri janela nenhuma.** Nada neste trabalho tem tela.

---

## O que sobrou para o próximo

1. **REGISTRAR O SUBSYSTEM — e ele nasce órfão de propósito.** Ligar um
   subsystem exige DOIS lugares, e os dois estão fora da posse:
   `src/hefesto_dualsense4unix/daemon/subsystems/__init__.py` (a lista
   declarativa) e `src/hefesto_dualsense4unix/daemon/lifecycle.py` (o
   `_safe_start`, que é quem de fato sobe). O próprio `__init__.py` avisa que
   *"acrescentar um subsystem aqui NÃO o liga"* — foi assim que o
   `BtMicSubsystem` nasceu órfão em 25/07. **A diferença é que este está
   declarado**, aqui e no cabeçalho do módulo.
2. **O LEITOR DO NOME NÃO CONHECE O NÓ NOVO.**
   `integrations/fontes_de_captura.sinks_dualsense()` casa por
   `MARCADORES_DUALSENSE` e **nunca devolverá `hefesto_som_<hex6>`**; a *regra
   0* de `escolher_fonte` conhece `hefesto_mic_` e não conhece o prefixo de
   saída. O prefixo tem dono no meu módulo (`PREFIXO_SINK_DO_SOM`) porque
   `fontes_de_captura.py` está fora da posse — a regra da casa diz que **o nome
   mora com quem o LÊ**, então quando o leitor aprender o nó, o dono do prefixo
   deve descer para lá e o meu módulo passa a importar. Junto vem
   `sufixo_do_sink_do_som()`, que já está escrito e testado.
3. **O RÓTULO DA TELA É DA `O-ALTO-FALANTE-VIRTUAL-01`.**
   `DESCRICAO_PROVISORIA = "Alto-falante do controle"` está marcado
   **PROVISÓRIO — decisão dela** no código. O *"nome de gente"* é daquela sprint.
4. **O D5 E O D6 CONTINUAM ABERTOS**, e nesta ordem: o custo de banda em regime
   (três minutos por patamar, nunca um tique) e a máquina de estados da troca de
   rota ao vivo. O D6 precisa da frase de tela para *"não tem para onde ir"*, que
   é palavra dela (§6.4 da sprint).
5. **PARA A `SPECS-A-PROCEDENCIA-01`, o que medi com a chave do mapa ao lado**
   está na seção seguinte. Eu não editei `docs/data/mapa-controles.csv`.

---

## O que caiu da sprint, nomeado

| linha do enunciado | quem derrubou | o que fica |
| --- | --- | --- |
| **D2 do corpo** — *"no cabo, o monitor é ligado ao sink do controle, no canal certo"* | a **ROTA CORRIGIDA** no topo, que redefine D1-D3 como *"constroem os três: encoder, sink, arranjo"* | o link continua aberto, e agora com o `.so` do loopback medido como presente. Ver *o que sobrou*, item 2 |
| **D3 do corpo** — *"o nó não dorme, e ele não publica mudo"* (drop-in 54 + posse do volume) | a mesma rota corrigida, **e** o `nao_toca:` — a regra e o dono do volume moram em `app/audio_saida.py` | continua aberto, e o dono não é esta sprint |
| **D4** — *"o PORTÃO: o excedente do degrau tem forma?"* | a rota corrigida: *"D4 é o ensaio 1 da MESA-DE-QUATRO-01"* | não é mais desta sprint. O `--escrever` do ensaio está escrito e **para antes de escrever** |
| **§2.1** — *"o `module-pipe-source` é o que a entrada já carrega… um `load-module` no D1, com `unload` no mesmo gesto"* listado como NÃO MEDIDO | **o aparelho/a máquina**: o `--sink` rodou e mediu | a célula deixa de ser NÃO MEDIDA. O `module-null-sink` carrega, a prioridade chega ao nó, e ele não vira padrão |
| **§2.1** — *"MONO, 48 kHz"* (a canônica, sobre a porta dedicada do PS5) | **o mapa**, ressalva (a) de `audio.alto_falante@dualsense`: o alto-falante interno é mono **por medição de 16/08**, e o encoder do DS5Dongle é ESTÉREO e serve à tag de FONE (`0x16`) | o encoder nasce estéreo (a rota 2 exige) **e a tag é argumento** — a escolha da saída é do ensaio, não do encoder |
| **§2.2** — *"o payload mora entre `report[50]` e o CRC"* (orçamento de 493 no `0x39`) | **o mapa**, `audio.saida_dedicada@dualsense`.radio_offset: *"as duas gramáticas conhecidas não podem ser a mesma"* — na do `common` sobram 493; na TLV dos dois arranjos **não há `common`** e o corpo usa [3..542] | as duas convivem no módulo: `orcamento_do_degrau()` é da gramática do `common`; os `Arranjo` são da TLV. Nenhuma foi escolhida |

---

## As medições, pela `chave` do mapa

Para a `SPECS-A-PROCEDENCIA-01`. **Nenhuma delas é escrita no aparelho** —
todas são desta máquina, com dublê ou com o servidor de som.

| chave | transporte | até onde foi | o que vi |
| --- | --- | --- | --- |
| `audio.alto_falante@dualsense` | rádio | **MONTOU** | os DOIS arranjos do `0x39` montam do MESMO PCM: 547 B, id `0x39`, CRC nos quatro últimos, corpos DIFERENTES. `BLOCO_SPEAKER = 0x13` ganhou o primeiro caminho de escrita desde 25/07 — em montagem, não em envio. Nada foi ao aparelho |
| `audio.saida_dedicada@dualsense` | cabo | **MONTOU** | `module-null-sink` **CARREGA nesta máquina** (era NÃO MEDIDO): nó `hefesto_som_000001`, `SUSPENDED`, `priority.session` 10 chegando ao nó, saída padrão intacta antes/durante/depois, nó removido sem lixo. Prioridades reais medidas: HDMI 696, IEC958 736, dois DualSense no cabo 1109 |
| `audio.saida_dedicada.payload_do_degrau@dualsense` | rádio | **MONTOU** | o encoder existe: `libopus 1.4`, CBR 160 kbps, 10 ms, estéreo → **200 B exatos**, o `len` que as duas fontes declaram. Sem CBR: 319 B. `zlib.crc32(b"\xa2") = 0xEADA2D49` = a semente do DS5Dongle. **Continua NÃO IDENTIFICADO o que o aparelho faz com esses bytes** |
| `plataforma.escada_de_output@dualsense` | rádio | **MONTOU** | a escada em tabela: nove degraus, oito passos de +64 e **um de +21**. A aritmética `78 + 64*(id-0x31)` dá 590 no `0x39` contra 547 — 43 bytes de erro, CRC fora do lugar, descarte calado |

---

## Duas armadilhas deste trabalho, para quem vier

1. **A RÉGUA DA FRASE PROIBIDA MORDEU A SI MESMA.** A primeira versão do portão
   que impede afirmar o que ninguém mediu era um `frase not in texto` — e
   reprovou os três arquivos novos, **não por afirmarem nada, mas por CITAREM a
   proibição do mapa palavra por palavra**. É a família exata do defeito de
   05/09, em que um comentário escrito para AVISAR sobre o `BOOTSTRAP` citou o
   padrão e virou a primeira ocorrência do arquivo. A cura foi a régua
   distinguir CITAR de AFIRMAR (janela de 300 bytes atrás procurando marca de
   proibição), e ela agora exercita as duas respostas.
2. **UMA MORDIDA QUE SÓ REORDENA LINHAS DEIXA `.pyc` VELHO DE PÉ.** A mordida 6
   trocou a ordem dos campos do `ARRANJO_SENSHI` sem mudar o tamanho do arquivo,
   dentro do mesmo segundo. O `.pyc` casa por *(mtime, tamanho)*: os dois
   bateram, o restaurar não invalidou nada, e a suíte **continuou reprovando com
   a cura já devolvida** — o instrumento medindo o mundo de dois minutos atrás.
   Quem arrancar cura assim: `find src tests -name __pycache__ -exec rm -rf {} +`
   antes de acreditar no verde.

---

## Os portões — e DOIS vermelhos que já estavam lá

`bash scripts/portoes.sh` → `/tmp/portoes-SOM-QUE-SAI-01.txt`

```
REPROVOU: 2 vermelho(s) de 45 -> paridade-gtk-html donos-de-comportamento
```

**Os dois são HERDADOS da base, e isso foi MEDIDO, não suposto.** Com a minha
árvore inteira em `git stash -u`, em `ae1c3d82` limpo — o mesmo commit de
`onda/atual-0609`:

```
árvore limpa em ae1c3d82
  paridade-gtk-html      VERMELHO rc=1
    divida-fechada: paridade-gtk-html.csv:315  [09-sistema] Botão "Corrigir modo de execução"
    divida-fechada: paridade-gtk-html.csv:343  [09-sistema] "Restaurar de fábrica"
  donos-de-comportamento VERMELHO rc=1
    donos-de-comportamento.csv:47 migrar_para_systemd: marcado SO-GTK, mas a tela
    nova já chama `on_daemon_migrate_to_systemd` em interface/pacotes/a09_sistema.py
REPROVOU: 2 vermelho(s) de 28 -> paridade-gtk-html donos-de-comportamento
```

Os três achados são a **mesma dívida fechada e não reescrita** na aba 09
(migração para systemd e restaurar de fábrica). Não são desta sprint, não tocam
áudio, e os dois CSVs estão fora da posse — **relatei em vez de editar**, que é
o que o protocolo manda. **Quem coordena precisa saber que a ponta de
`onda/atual-0609` está vermelha nesses dois.**

**O terceiro vermelho ERA MEU e fechou:** `casa-sabe` acusou as vinte promessas
públicas novas sem caminho. Das vinte, duas saíram por outro caminho que o
próprio portão oferece — `so_hex` **já tinha dono** em
`integrations/fontes_de_captura.py` e virou import em vez de cópia, e
`silencio_de_um_quadro` nasceu sem chamador nenhum e foi **apagada**. As
dezoito restantes estão declaradas em `_SEM_CAMINHO_HOJE`, cada uma com onde o
caminho se perde (o subsystem não registrado, e os dois arquivos que o
registrariam) e o que o fecharia.
