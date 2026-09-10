# SOM-POR-CONTROLE-01 — o nó ganhou ROTA, ganhou o NOME dela, e ficou órfão por três linhas

**Árvore:** `hefesto-voo/SOM-POR-CONTROLE-01-opus` · branch
`voo/SOM-POR-CONTROLE-01-opus` · base `1a1409b2` (= `dev`) · **bancada: não
reservei** (`scripts/bancada.sh status` = LIVRE; não chamei `exigir` porque não
precisei parar o daemon nem escrever em aparelho nenhum — ver «o que NÃO
verifiquei»).

---

## A MEDIÇÃO PRIMEIRO, como a sprint mandou

`scripts/ensaios/os_nos_de_som_por_controle.py` (leitura pura), 09/09/2026 às
19h55, com os **QUATRO DualSense na mesa dela** — dois no cabo, dois no rádio:

```
saída padrão .... alsa_output.pci-…hdmi-stereo
controle      transp.  placa USB  alto-falante virtual  mic virtual   fonte
…:f0          rádio    —          NÃO EXISTE            NÃO EXISTE    sfx
…:ab          cabo     sim        NÃO EXISTE            NÃO EXISTE    sfx
…:03          rádio    —          NÃO EXISTE            NÃO EXISTE    sfx
…:d8          cabo     sim        NÃO EXISTE            NÃO EXISTE    sfx
rc=1  ·  `pactl list short modules | grep -c loopback` = 0
```

**Zero nós, com DUAS sprints marcadas `feita`** — a §1 da sprint estava certa, e
com quatro controles em vez dos dois de 08/09. As duas causas foram medidas
nesta árvore ANTES de eu escrever uma linha de cura, e **nenhuma era "faltou
código"**:

1. **o `AltoFalanteSubsystem` é órfão.** `grep` por `alto_falante` em
   `daemon/subsystems/__init__.py`, `daemon/lifecycle.py` e
   `daemon/connection.py` devolve **zero**. E ele era órfão *de propósito*: o
   próprio `subsystems/__init__.py` escreve a razão — sem `module-loopback` o nó
   publicado é um sumidouro, e `test_o_no_de_som_nao_nasce_sumidouro.py` trava
   esse par;
2. **e o nome não era o dela.** Mesmo ligado, o nó nasceria `Alto-falante · P1`
   com `sink_name=hefesto_alto_falante_p1` — enquanto o instrumento (e a LÍNGUA
   DESTA CASA, escrita pela MIC-OS-QUATRO-01 no mesmo dia) procura «Alto-falante
   do Controle N» e `hefesto_som_<hex6>`. **Eram DOIS `sink_name` para o mesmo
   nó**, um em `app/audio_saida.py` e outro em `integrations/alto_falante_bt.py`,
   e o que o produto de fato publica é o segundo.

Esta sprint mata a causa 1 e a causa 2. **A terceira não estava na minha posse**
— ver «o que sobrou para o próximo», e é por isso que o instrumento **continua
saindo `rc=1`** na mesa dela ao fim do trabalho.

---

## O que mudou

### 1. O nome é o dela, e o `sink_name` ficou UM só

`nome_do_alto_falante` devolvia `Alto-falante · P1` — decisão de 06/09 tomada
**por delegação**. Ela decidiu (*"4a"*,
`D-0909-OS-NOS-SE-CHAMAM-ALTO-FALANTE-E-MICROFONE-DO-CONTROLE-N`): o rótulo é
**«Alto-falante do Controle N»**, par de «Microfone do Controle N», com o número
do ASSENTO. **Fato substituído em todos os lugares** — o código, as duas réguas
que o mediam, e as três MORDIDAS que diziam *"troque o rótulo por «Alto-falante
do Controle N»"*: o que era a mordida virou o produto.

O rótulo com número vem de `alto_falante_bt.descricao_do_alto_falante(uniq)`,
**gêmeo palavra por palavra** de `dualsense_bt_audio.descricao_do_microfone` — o
assento sai do MESMO numerador, pelo MESMO gancho
(`registrar_numerador_de_assento`). Escrever um segundo numerador poria o mesmo
aparelho no assento 2 na lista de entrada e no 3 na de saída.

E `NoDeAltoFalante.id_do_no` passou a ser `nome_do_sink(uniq)` —
`hefesto_som_<hex6>`, o do APARELHO. `hefesto_alto_falante_<assento>` e
`PREFIXO_DO_NO` e `id_do_alto_falante` **morreram**. A razão é o gesto que a
seção existe para não quebrar: ela troca o P2 de assento com o P3 e o jogo
continua com a saída que escolheu. **O rótulo segue o assento; o nome interno
segue o aparelho** — é exatamente a gramática do `hefesto_mic_<hex6>`.

### 2. A pergunta *«onde este nó entrega?»* passou a ter UM dono, e ele mudou de camada

Ela tinha duas respostas escritas — `app/audio_saida.rota_do_no` e o
`GerenciadorDeNosDeSom`, que não fazia nenhuma das duas coisas. Agora a resposta
mora em **`integrations/alto_falante_bt`** (`rota_do_no`, `sink_do_controle`,
`argv_das_rotas`, `RotaDoNo`, as três frases de recusa), e `app/audio_saida`
**reexporta**. O molde é o `app/usb_pai.py` → `integrations/usb_pai.py`, e a
razão é de camada, medida e escrita: **o daemon não importa nada de `app/`**
(`integrations/fontes_de_captura.py` escreve a régua). Deixar a resposta em
`app/` obrigaria o subsystem a escrever a segunda.

`SinkVirtualPipeWire` recebe a `RotaDoNo` e sobe os `module-loopback` junto com o
`module-null-sink`; `parar()` derruba **a rota antes do nó**, e só a que ele
subiu. Um loopback que não sobe **não derruba o nó** — um controle mudo ainda é
o dispositivo que o jogo escolheu.

### 3. A FONTE — «mix» ou «sfx», por controle, do perfil até o `pactl`

`ProfileSpeakerConfig` ganhou `fonte: Literal["mix","sfx"] | None`, aditivo e sem
bump de versão, com a MESMA regra de serialização da `rota`: **sem opinião a
chave nem aparece no arquivo**, senão um hefesto anterior a hoje (`extra=
"forbid"`) recusaria o perfil inteiro e *"voltar uma versão"* viraria *"todos os
perfis com som quebrados"*.

* `mix` = o *«HDMI completo»* dela: um `module-loopback` do monitor da SAÍDA
  PADRÃO **para** o nó;
* `sfx` = o nó fica livre para a corrente do jogo, e é o **padrão**
  (`D-0809-NO-CABO-O-PADRAO-DO-SOM-E-SFX`, *"concordo com as 5"*).

`monitor_da_saida_padrao()` devolve `""` quando o `pactl` não responde, e `""` é
recusa: um `source=` vazio é a cicatriz do `paplay --device=` que este módulo já
registra — o comando é ACEITO e o som vai para a TV dela.

### 4. O nó VIVE SEMPRE — e a metade da invariante 4 que ela NÃO derrubou

`D-0809-O-NO-DE-SOM-POR-CONTROLE-VIVE-SEMPRE`: *"nó que some quebra o jogo que o
escolheu"*. A invariante 4 dizia *"sem rota não se carrega módulo nenhum"*, e ela
valia sob a decisão de 06/09 — **por delegação, declarada reversível numa frase.
Ela reverteu.** `plano_de_publicacao` agora sai com `vai_publicar=True` **e**
`motivo` cheio, e `PlanoDoNo` ganhou `tem_rota`, porque publicar e entregar
viraram perguntas diferentes. O que sobra da invariante, e é o que as réguas
travam: **um nó sem rota tem de DIZER**.

### 5. O DEFEITO QUE A PASSADA SECA REVELOU, e ele era meu, de meia hora antes

Com as quatro peças ligadas, rodei o caminho do daemon **contra a mesa REAL
dela** com o `runner` injetado (nada escrito no PipeWire dela). Os dois
controles do RÁDIO recebiam a frase do CABO:

> *"o sistema ainda não publicou a placa de som deste controle (…) **Reconecte o
> cabo do controle**."*

— mandando ela mexer num cabo que não existe. A causa: **duas palavras para o
mesmo transporte**. `ControleNaLista.transporte` diz `"rádio"` (a palavra da
TELA, com acento) e `app/audio_saida` diz `"bt"` (a do `state_full`); o
`rota_do_no` comparava com UMA delas e o rádio caía no ramo do cabo, **em
silêncio**. Curado por `alto_falante_bt.e_radio`, que peneira as quatro grafias
(`bt`, `radio`, `rádio`, `bluetooth`) — e a régua morde nas três que a
comparação de texto perdia. *A frase é metade do valor de um nó sem rota, e uma
comparação de igualdade a trocava sem ninguém notar.*

### 6. Os cinco endereços de linha que o campo novo deslocou — CORRIGIDOS, não empurrados

O `fonte` custa +31 linhas em `profiles/schema.py`, e cinco citações
`arquivo:linha` em `src/` envelheceram (`app/draft_config.py`,
`gui/aba_conexoes.py` ×2, `interface/aba10.py`,
`interface/pacotes/a08_conexoes.py`). **Os cinco arquivos são de outra posse** e
o portão oferece a saída declarada (`_CITACOES_PENDENTES`) — eu a usei primeiro,
e ela **reprovou noutro portão**: duas das cinco são da janela GTK, e
`nada-aponta-para-a-janela` recusa citação nova para ela
(`D-0609-GTK-LEVA-INTEIRA`). Reescrevi os cinco números no lugar. É UMA linha de
comentário em cada, a âncora de todas continua onde a frase promete, e fui eu
quem os envelheceu.

---

## Qual mordida prova

**`tests/unit/test_o_som_por_controle_cai_em_cada_um.py` — 34 réguas**, e ONZE
curas foram arrancadas uma a uma. As onze reprovaram:

| # | cura arrancada | o que caiu |
| --- | --- | --- |
| 1 | `nome_do_alto_falante` volta a `Alto-falante · {P}` | **9** (2 arquivos) |
| 2 | `iniciar()` não chama `_ligar_a_rota` | 2 |
| 3 | `FONTE_PADRAO = FONTE_MIX` | 4 |
| 4 | `plano_de_publicacao` volta a `PlanoDoNo(False, argv=())` sem rota | 5 |
| 5 | `id_do_no` volta a `hefesto_alto_falante_{assento}` | 9 |
| 6 | `_construir` volta a `SinkVirtualPipeWire(uniq=uniq)` | 3 |
| 7 | `numero_do_assento` conta por `index` (o handle desligado entra) | 1 |
| 8 | `argv_para_ligar_o_mix` troca `source=` por `sink=` | 2 |
| 9 | o serializer para de omitir `fonte` sem opinião | 1 |
| 10 | o rótulo inventa o assento 1 quando o numerador diz `None` | 1 |
| 11 | `e_radio(transporte)` volta a `transporte == TRANSPORTE_RADIO` | 3 |

Saída da 11, que é a do defeito de §5 — as três grafias que a igualdade perdia:

```
FAILED ...::test_a_palavra_do_transporte_nao_troca_a_frase[radio]
FAILED ...::test_a_palavra_do_transporte_nao_troca_a_frase[r\xe1dio]
FAILED ...::test_a_palavra_do_transporte_nao_troca_a_frase[BLUETOOTH]
3 failed, 31 passed
```

Com as onze curas devolvidas: **34 passed**; com a vizinhança do som inteira,
**134 passed**.

**A RÉGUA QUE TRAVA A DÍVIDA QUE EU NÃO PUDE PAGAR**, e é a que mais importa
aqui: `test_o_assento_do_alto_falante_e_o_mesmo_do_microfone` alimenta
`AltoFalanteSubsystem.numero_do_assento` **e** `BtMicSubsystem.numero_do_assento`
com a MESMA mesa, em quatro formas (inclusive o handle DESLIGADO, que é o caso
que engana), e reprova a divergência. São duas implementações da mesma regra
porque `daemon/subsystems/bt_mic.py` não está na minha posse — e o que segura o
par é régua, não boa vontade.

**A PROVA SECA, com a mesa REAL dela e nada escrito no PipeWire** (runner
injetado; `pactl list short sinks | grep -c hefesto` = **0** antes e depois):

```
--- assento 1 (rádio)  rota=False
    FRASE: o som do PC ainda não chega a este controle pelo rádio — …
    load-module module-null-sink sink_name=hefesto_som_c311f0
        …device.description='Alto-falante do Controle 1' priority.session=10
--- assento 2 (cabo)   rota=True
    load-module module-null-sink sink_name=hefesto_som_13ebab  …'Alto-falante do Controle 2'
    load-module module-loopback source=hefesto_som_13ebab.monitor sink=…Controller-00.analog-surround-40
    load-module module-loopback source=…hdmi-stereo.monitor     sink=hefesto_som_13ebab
--- assento 3 (rádio)  rota=False   (mesma frase do rádio)
--- assento 4 (cabo)   rota=True
    …sink=…Controller-00.2.analog-surround-40   ← a placa do OUTRO controle
```

Os dois do cabo casam **placas USB diferentes** (`-00` e `-00.2`) pela
identidade, que é a invariante 2 — e é o único jeito de o som do P4 não sair no
alto-falante do P2.

**Portões:** `bash scripts/portoes.sh` → **TODOS VERDES — 56 portões**.

---

## O que NÃO verifiquei

* **NENHUM SOM.** Não escrevi um byte de PCM, não carreguei um único módulo no
  PipeWire dela e não toquei em aparelho nenhum. Que o alto-falante do P2 toque o
  que entrou no nó do P2 é **a orelha dela**, e é a linha de prova da
  MESA-DE-QUATRO-01. Tudo aqui é medição do NOSSO lado, com dublê.
* **A bancada: não reservei.** `scripts/bancada.sh status` disse LIVRE; não
  chamei `exigir` porque nenhum caminho meu para o daemon, o `systemctl` ou o
  `hidraw`. **Não esperei por bancada** — o código não dependia dela.
* **O ENSAIO 13 (o envelope do som por rádio) não foi rodado.** É a metade de
  bancada, é dela, e o instrumento
  (`scripts/ensaios/o_envelope_do_som_no_radio.py`) já existia na minha base.
* **O nó VIVO na lista dela.** O instrumento continua `rc=1` ao fim do meu
  trabalho, e a razão é a de baixo — não é que a cura não pegou.
* **`fonte=mix` no P2 e o tocador NÃO saindo no P3.** É o item 2 do «O que
  MORDE» da sprint, e é teste de orelha na bancada. O que medi é que os dois
  planos divergem nos comandos e nos sinks.
* **Tirar o cabo e o nó continuar na lista** (`--observar 60`): não rodei,
  porque não há nó na lista para observar até o registro existir.
* **A tela da aba 02** — ver a próxima seção; não toquei em
  `interface/pacotes/a02_controles.py`.
* **Quatro testes vermelhos na vizinhança NÃO SÃO MEUS**, e conferi por
  `git diff --cached --stat 1a1409b2`: não toquei nenhum dos arquivos
  envolvidos. Eles já vinham do `1a1409b2`:
  `test_som_02_devolucao_da_posse.py::TestPonteDaJanela` ×2 (`TypeError:
  <lambda>() got an unexpected keyword argument 'timeout'`, em
  `app/ipc_bridge.py:348`); `test_o_mapa_separa_divida_de_decisao.py::
  test_a_populacao_nao_depende_da_coluna_que_ela_confere` (o retrato de 07/09
  tinha 43 células e a árvore tem 45); e `test_os_donos_de_fato.py::
  test_a_lista_datada_nao_guarda_fantasma` (duas exceções de `_do_vpad` que já
  morreram). **Um quinto era meu e está curado** — ver abaixo.

### Célula do mapa que este trabalho toca

| chave | transporte | até onde foi | o que vi |
| --- | --- | --- | --- |
| `audio.alto_falante@dualsense` | cabo | **MONTOU** (dublê + leitura viva do `pactl`, sem carregar módulo) | com a mesa REAL dela (2 no cabo, 2 no rádio), o caminho do daemon monta, POR CONTROLE, o `module-null-sink` com o rótulo «Alto-falante do Controle N» e os dois `module-loopback` — a saída para a placa USB **daquele** controle (`-00` e `-00.2`, separadas por identidade) e, em `fonte=mix`, o monitor da saída padrão. Nenhum byte de áudio medido |
| `audio.alto_falante@dualsense` | rádio | **NÃO MONTOU, e a recusa é a certa** | os dois do rádio recusam COM A FRASE do rádio (`MOTIVO_NO_SEM_PONTE_NO_RADIO`) e publicam o nó assim mesmo, por decisão dela de 08/09. Nada foi escrito no aparelho |
| `audio.saida_dedicada.payload_do_degrau@dualsense` | rádio | **não tocado** | continua como está: a escolha do arranjo é dela, pela orelha, no ensaio 1 da MESA-DE-QUATRO-01 |

---

## O que sobrou para o próximo

### 1. AS TRÊS LINHAS DO REGISTRO — é isto, e só isto, que falta para o nó existir na mesa dela

O `AltoFalanteSubsystem` **continua órfão**, e agora por uma razão só: ninguém o
liga. As duas razões de 07/09 para não ligá-lo caíram nesta sprint (a rota existe;
o rótulo é próprio). **A receita tem TRÊS metades, e o `subsystems/__init__.py`
avisa que fazer duas é como o `BtMicSubsystem` nasceu órfão em 25/07:**

| arquivo | o que falta |
| --- | --- |
| `daemon/subsystems/__init__.py` | a classe na `SUBSYSTEM_REGISTRY` (declarativo — **não liga nada sozinho**) |
| `daemon/lifecycle.py` | o `_safe_start(AltoFalanteSubsystem())` no `run()` |
| `daemon/connection.py` | o `_stop_*` no `shutdown()` — **sem ele o nó fica na lista de saída dela depois de o daemon morrer** |

Os três estão FORA da posse desta sprint (o frontmatter dá cinco arquivos, e
nenhum é esses). `test_o_no_de_som_nao_nasce_sumidouro.py` **permite** a fiação
agora: ela sempre travou o par *"se subir, tem de ter rota"*, e a rota existe.

### 2. A tela da aba 02 (§3.3 da sprint) — NÃO ENTREGUE, e por decisão declarada

`interface/pacotes/a02_controles.py` está na minha posse e eu **não o toquei**. A
razão: a tela ofereceria à ela um interruptor mix/SFX sobre um nó que **não
existe na lista do sistema** — a própria sprint chama isso pelo nome, *"régua
verde sobre nó que não existe é a assinatura dos instrumentos falsos desta
casa"*, e a casa não põe botão que não faz nada. **A §3.3 depende da §3.1, e a
§3.1 depende do item 1 acima.** Quem fizer o registro fecha as duas no mesmo
gesto: a rota, a fonte e a frase já estão prontas para a tela ler
(`PlanoDoNo.tem_rota`, `.fonte`, `.motivo`).

O que a tela já diz e continua valendo: os dois botões de ROTA («Sons do jogo» /
«Todo o som do PC») são a CAMADA 2, o byte do firmware. A `fonte` é a CAMADA 1, o
PipeWire. São campos diferentes de propósito — fundi-los tiraria dela a escolha
do fone, que ela nomeou com todas as letras.

### 3. As DUAS implementações de `numero_do_assento`

`AltoFalanteSubsystem.numero_do_assento` e `BtMicSubsystem.numero_do_assento` são
a mesma regra escrita duas vezes, porque `daemon/subsystems/bt_mic.py` não está
na minha posse. **A régua que as compara existe** e reprova a divergência
(incluindo o caso do handle desligado), mas o certo é as duas chamarem uma
terceira — o lugar natural é ao lado de `_conectados_da_mesa`, com o dono em
`daemon/`.

### 4. Os cinco endereços de linha e as dez lápides do `casa-sabe`

Reescrevi os cinco números no lugar (§6 de «o que mudou»). E **dez entradas de
`_SEM_CAMINHO_HOJE` saíram**, porque `integrations/alto_falante_bt.py` entrou no
fecho de import da produção: duas ganharam chamador de verdade (`nome_do_sink`,
`propriedades_do_sink`) e **oito entraram pela porta do módulo** — são citadas por
definições de topo dele, e o portão conta isso como alcance. **Elas não ganharam
chamador de produção**, e a dívida que cada nota descrevia (a bomba de rádio, os
dois arranjos, o encoder) continua exatamente onde estava. Ela não se perdeu: foi
para o docstring de `daemon/subsystems/alto_falante.py`, seção *"O ÓRFÃO GANHOU A
ROTA"*, com os três endereços — e a nota de por que as dez saíram está no topo do
registro, no próprio portão.

### 5. O que é DELA, e não se resolve escrevendo código

* **o ensaio 13** (o envelope do som por rádio) — sem ele o nó do rádio continua
  dizendo que não tem para onde ir, e essa frase é a resposta honesta;
* **as seis passadas de 08/09 não têm linha em `docs/data/ensaios.csv`** (§3.5 da
  sprint). O arquivo está no meu `nao_toca:`; **quem coordena a bancada escreve**,
  senão a próxima pessoa repete as seis;
* **a orelha dela** no critério de pronto: o P2 em `mix` e o P3 em `sfx` ao mesmo
  tempo, um tocador na saída padrão saindo num e não no outro.

---

## O que caiu da sprint

* **§3.1 «o nó por controle, VIVO na mesa dela»** — entregue até onde a posse
  alcança (rota, rótulo, ciclo de vida, fonte), e **não alcançável** sem as três
  linhas do registro, que são de outros arquivos. O instrumento sai `rc=1` e isso
  é o retrato honesto;
* **§3.3 «a tela da aba 02 diz as duas coisas»** — não entregue, por depender da
  §3.1 (razão em «o que sobrou», item 2);
* **§3.5 «o negativo do BT vai para o caderno»** — a própria sprint já o põe em
  `nao_toca:`;
* **a nota da SOM-QUE-SAI-01 e a docstring do subsystem diziam *"o nó vive só
  enquanto há controle"*** — caiu por decisão DELA de 08/09, e o fato foi
  substituído nos quatro lugares onde estava escrito;
* **`app/audio_saida.py` dizia que o nome era `Alto-falante · P1` e que
  *"«Controle 1» NÃO é a palavra desta casa"*** — caiu pela decisão dela de
  09/09. Substituído no código e nas três MORDIDAS que o afirmavam.
