# O-ALTO-FALANTE-VIRTUAL-01 — o som do controle ganha o que o gamepad já tem

**Agente:** opus · **Árvore:** `voo/O-ALTO-FALANTE-VIRTUAL-01-opus`, nascida de
`onda/atual-0609` (`39fa440d`) · **Data:** 06/09/2026

## O que mudou

**Um arquivo de produto, um de régua, e uma DECLARAÇÃO fora da posse** (a
terceira está explicada na seção do portão, logo abaixo).
`integrations/dualsense_bt_audio.py` (o `GerenciadorMicBluetooth`) não foi
tocado, como o `nao_toca:` manda.

`src/hefesto_dualsense4unix/app/audio_saida.py` ganhou a seção **O ALTO-FALANTE
VIRTUAL**, que é a **superfície** que a sprint pede: o nome do nó, o id do nó, a
decisão de para onde ele entrega, e o **plano de comandos** que o publica no
PipeWire.

| o que nasceu | o que é |
| --- | --- |
| `nome_do_alto_falante(assento)` | `Alto-falante · P1` … `P4` — o nome que vai na lista de saída do sistema |
| `id_do_alto_falante(assento)` | `hefesto_alto_falante_p1` — o `sink_name`, estável entre transportes |
| `NoDeAltoFalante` | assento · uniq · transporte. `nome` e `id_do_no` **não olham** o transporte |
| `assento_do_controle(entry)` · `no_do_controle(entry)` | o nó de uma entrada de `state_full.controllers`; a máscara não é lida |
| `rota_do_no(...) -> RotaDoNo` | cabo → o sink daquele controle; rádio → a ponte, ou a **frase** |
| `plano_de_publicacao(...) -> PlanoDoNo` | os comandos `pactl` prontos — ou `argv=()` com o motivo |
| `argv_para_publicar_o_no` · `argv_para_ligar_o_no` · `argv_para_retirar_o_no` | `module-null-sink` + `module-loopback` nos canais 1-2 |

**As duas decisões que a sprint deixava para ela estavam tomadas** por
delegação (`docs/data/decisoes-dela.csv`, `D-0609-UM-NO-DE-SOM-POR-CONTROLE`):
um nó por controle, nome pelo assento. Nenhuma foi reproposta.

**AS QUATRO INVARIANTES, e cada uma tem régua:**

1. **o nome e o id não sabem do transporte.** O mesmo controle no cabo e no
   rádio é o mesmo nó;
2. **o sink é resolvido pela IDENTIDADE** — quem decide é o `sink_do_controle`
   que já existia (casamento por dispositivo USB), nunca um casamento de texto;
3. **a máscara não participa.** `flavor` não entra em nenhuma assinatura da
   seção, e há régua por `inspect.signature` que reprova quem o acrescentar;
4. **sem rota, ele DIZ.** `argv=()` e a frase do quê/por quê/o que fazer. O nó
   nunca vira um sink que aceita som e o joga fora.

**O QUE ELA NÃO FAZ, e é decisão declarada:** ela **não carrega módulo nenhum**.
Devolve o plano; quem o executa é o dono da camada 1, na sprint seguinte.
Carregar um `module-null-sink` agora poria um nó na lista de saída DELA, na
sessão viva, sem ela ter pedido — e o aceite pela orelha é o ensaio 1 da
MESA-DE-QUATRO-01, como a ROTA CORRIGIDA manda.

## Qual mordida prova

`tests/unit/test_o_alto_falante_virtual_esconde_o_transporte.py` — **16 testes,
0,60 s, sem áudio real e sem `/sys`** (o censo de USB entra por
`monkeypatch`). Verde com a cura no lugar:

```
$ python -m pytest tests/unit/test_o_alto_falante_virtual_esconde_o_transporte.py -q
................                                                         [100%]
16 passed in 0.60s
```

**AS QUATRO MORDIDAS, arrancadas uma a uma, com a saída da REPROVAÇÃO:**

**1. Derive o id do transporte** (`id_do_no` → `f"{...}_{self.transporte}"`):

```
E       AssertionError: assert 'hefesto_alto_falante_p1_usb' == 'hefesto_alto_falante_p1'
7 failed, 9 passed in 0.68s
```

**2. Case o sink por texto** (`[s for s in sinks if s.startswith("alsa_output.usb-")][0]`),
com DOIS controles no cabo:

```
E       AssertionError: assert 'alsa_output....g-surround-40' == 'alsa_output....g-surround-40'
E         - roller-00.2.analog-surround-40
E         + roller-00.analog-surround-40
FAILED ...::test_dois_controles_no_cabo_e_cada_no_entrega_no_sink_do_seu
1 failed, 15 passed in 0.52s
```

O nó do P2 passou a apontar o sink do P1 — o som do P2 saindo no alto-falante
do P1. É exatamente o defeito nomeado na sprint.

**3. Aceite o áudio e jogue fora** (`PlanoDoNo(True, argv=(argv_para_publicar_o_no(no),))`
no ramo sem rota):

```
E       assert True is False
FAILED ...::test_sem_placa_de_som_no_cabo_o_no_diz_o_que_fazer
FAILED ...::test_no_radio_sem_ponte_o_no_recusa_com_a_frase
FAILED ...::test_um_controle_que_nunca_esteve_aqui_ganha_o_mesmo_no
3 failed, 13 passed in 0.59s
```

**4. Faça o nó depender do `flavor`** (parâmetro novo + recusa fora de
`dualsense`):

```
E       AssertionError: no_do_controle
E       assert 'flavor' not in mappingproxy(OrderedDict({'entry': ..., 'flavor': ...}))
FAILED ...::test_a_mascara_nao_muda_o_no[xbox]
FAILED ...::test_a_mascara_nao_muda_o_no[nintendo]
FAILED ...::test_a_mascara_nao_entra_em_assinatura_nenhuma
3 failed, 13 passed in 0.52s
```

A cura foi devolvida byte a byte depois de cada uma (`diff` limpo), e os 16
voltaram a passar.

**A régua não é a bancada desta casa.** Os endereços são das faixas sintéticas
(`02fe00`, `aabbcc`), o terceiro controle nunca esteve nesta mesa, e o censo de
USB é dublê: nada aqui depende dos DualSense daqui.

**Portões:** `bash scripts/portoes.sh` — ver `## Portões`, no fim.

## O que NÃO verifiquei

- **NENHUM SOM SAIU DE NENHUM ALTO-FALANTE.** O aceite da sprint é a orelha
  dela — um som do sistema escolhido para o `Alto-falante · P1` e ouvido no
  controle. Isso é o **ensaio 1 da MESA-DE-QUATRO-01**, e a ROTA CORRIGIDA já
  o mandava para lá. Não carreguei módulo nenhum no PipeWire vivo dela;
- **o plano nunca foi EXECUTADO.** Que os dois `pactl load-module` produzam um
  nó audível é leitura de comportamento do PipeWire, não medição minha. O que
  medi foi que o plano se monta certo e com o sink certo;
- **o rádio inteiro.** Não implementei uma linha do caminho por rádio, e não
  era meu: a `SOM-QUE-SAI-01` é a dona (`depois_de: [O-ALTO-FALANTE-VIRTUAL-01]`,
  e o `nao_toca:` dela é justamente o meu `app/audio_saida.py`). O mapa **tem**
  os arranjos do payload do degrau `0x39` no `radio_offset` de
  `audio.alto_falante@dualsense` — mas em **DUAS leituras de fonte que divergem
  entre si**, nenhuma medida nesta bancada e nenhuma implementada nesta árvore
  (`audio.saida_dedicada.payload_do_degrau@dualsense`: *"nenhuma linha
  implementada nesta árvore"*). O que entreguei é o encaixe: `ponte_do_radio` é
  um `Callable[[], bool]` que aquela sprint passa, sem reabrir este módulo;
- **o loopback nos canais 1-2.** O `channel_map=front-left,front-right` sai da
  célula `cabo_canal` do mapa (*canais 1-2 do sink `...analog-surround-40`*)
  traduzida para o nome que o PipeWire entende. **Não medi** que esses dois
  canais são os do alto-falante interno — isso é do mapa, e é do mapa que veio;
- **quatro controles.** Medi com UM na bancada e com DOIS no dublê. O caso de
  quatro é da MESA-DE-QUATRO-01;
- **a suíte inteira.** Rodei o meu escopo, como o protocolo manda.

## O que sobrou para o próximo

1. **QUEM EXECUTA O PLANO.** A seção devolve `PlanoDoNo.argv` e ninguém o roda
   ainda. O dono natural é a camada 1 fora da janela — o mesmo lugar de
   `mandar_o_som_do_pc` —, e ele precisa de duas coisas que não são minhas:
   guardar o índice do módulo carregado (para o `argv_para_retirar_o_no`) e
   decidir quando o nó nasce e quando morre;
2. **`numero_do_controle` MORA ATRÁS DO GTK.** `app/actions/base.py` importa
   `gi` no topo, então `assento_do_controle` faz import preguiçoso para não dar
   GTK de graça à interface nova. **A cura certa é descer `numero_do_controle`
   para um módulo sem GTK** — não é da minha posse, e relato em vez de editar;
3. **A CÉLULA DO MAPA para a SPECS-A-PROCEDENCIA-01** — ver `## O que medi`;
4. **O `channel_map` merece uma medição de verdade** quando alguém tiver a
   bancada com o som ligado: se o alto-falante interno não estiver nos dois
   canais da frente da `analog-surround-40`, o `argv_para_ligar_o_no` é a única
   linha a mudar;
5. **A DECISÃO DO CICLO DE VIDA é dela, e não a tomei:** quatro nós fixos na
   lista de saída, ou um nó por controle CONECTADO, que aparece e some? A
   decisão delegada diz *um nó por controle*; ela não diz se o P3 sem controle
   também tem nó. Escrevi a superfície nos dois casos (o nó só nasce quando há
   `entry`), o que é o comportamento conservador — mas é escolha, e está aqui
   marcada como tal.

## O que medi

**Bancada:** `scripts/bancada.sh exigir` → **rc=0** (LIVRE). Havia **um
DualSense no cabo** nesta máquina, e a medição abaixo é **de leitura só**:
`pactl list sinks`, nenhum módulo carregado, nada escrito no aparelho, nada
parado, nenhum `systemctl`.

| chave | transporte | até onde foi | o que vi |
| --- | --- | --- | --- |
| `audio.alto_falante@dualsense` | cabo | **MONTOU** | com um DualSense no cabo, `sink_do_controle` resolveu o sink real do controle (`alsa_output.usb-…DualSense…-00.analog-surround-40`) e `plano_de_publicacao` devolveu `vai_publicar=True` com as DUAS metades: o `module-null-sink` `hefesto_alto_falante_p1` e o `module-loopback` para aquele sink em `front-left,front-right`. **Nada foi carregado** — MONTOU é o degrau honesto, não SAIU NO FIO |
| `audio.alto_falante@dualsense` | rádio | **MONTOU** | o mesmo controle como `transporte=bt`: o nó existe com o MESMO nome e o MESMO id (`Alto-falante · P1` / `hefesto_alto_falante_p1`) e `plano_de_publicacao` devolveu `vai_publicar=False`, `argv=()` e a frase do quê/por quê/o que fazer. A célula `radio_aciona=não` continua certa; o que mudou é que agora a recusa TEM PALAVRA |
| `audio.saida_dedicada@dualsense` | cabo | **MONTOU** | é esta a linha que a superfície preenche: o nome estável na lista de saída deixou de depender do nome do sink, que muda com a máquina e com a porta |
| `audio.saida_dedicada.payload_do_degrau@dualsense` | rádio | — | **não toquei.** Continua não identificado, e é o que faz o ramo do rádio recusar |

O endereço do controle usado na medição, mascarado pela convenção da casa:
`44:46:48:00:00:03`.

## O que caiu da sprint

Duas linhas do enunciado, e as duas por decisão registrada, não por medição:

1. **«O nome que aparece na lista de saída» e «um nó por controle, ou um só que
   segue o jogador 1?» não são mais dela decidir** — a seção *"O que é dela
   decidir"* da sprint está resolvida por `D-0609-UM-NO-DE-SOM-POR-CONTROLE`.
   E a proposta que a sprint carregava, *"Alto-falante do Controle 1"*, **caiu
   pela língua da casa**: o glossário diz `P1`…`P4`, e *"Controle 1"* não é a
   palavra desta casa;
2. **«a ponte da P5 da CONTROLE-INTEIRO-NO-RADIO-01», que o corpo da sprint põe
   como dona do rádio, mudou de dono.** Aquela sprint está **`absorvida`** — e
   não *"não tem arquivo"*, como diz a nota da ROTA CORRIGIDA: o arquivo existe
   (`2026-08-07-CONTROLE-INTEIRO-NO-RADIO-01-...md`) com `estado: absorvida`.
   Quem herdou o rádio é a **`SOM-QUE-SAI-01`**, que está `aberta` e declara
   `depois_de: [O-ALTO-FALANTE-VIRTUAL-01]`. Por isso o encaixe do rádio é um
   `Callable` injetável e não uma dependência de import: as duas sprints se
   encontram sem que nenhuma abra o arquivo da outra.

Nenhuma célula do mapa vetou nada, e nenhum passo parou por causa de célula
atrasada.

## Portões

```
git add -A && bash scripts/portoes.sh
TODOS VERDES — 45 portões.
```

Saída inteira em `/tmp/portoes-O-ALTO-FALANTE-VIRTUAL-01.txt`.

**E UM DELES REPROVOU NA PRIMEIRA VOLTA — o `casa-sabe`, e ele estava certo.**
Ele nomeou três promessas públicas sem chamador em produção:

```
REPROVOU: 1 vermelho(s) de 45 -> casa-sabe
E   estas promessas públicas não têm chamador em produção e ninguém disse o que elas são:
E       app/audio_saida.py::argv_para_retirar_o_no
E       app/audio_saida.py::no_do_controle
E       app/audio_saida.py::plano_de_publicacao
```

**Este é o achado do dia, e ele é sobre a forma da sprint, não sobre um bug:**
uma sprint que entrega SUPERFÍCIE nasce, por construção, com promessa antes de
caminho — e o `nao_toca:` das duas sprints é o que garante isso (o meu cobre o
motor, o da `SOM-QUE-SAI-01` cobre o meu arquivo). O portão oferece quatro
saídas e a honesta aqui é a quarta: **declarar em `_SEM_CAMINHO_HOJE`, com o
endereço de onde o caminho se perde e do que o fecha.** Foi o que fiz, e as três
razões dizem, cada uma, qual sprint fecha e em que arquivo.

**Isso me fez editar um arquivo fora da posse:**
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` — **três entradas
acrescentadas em `_SEM_CAMINHO_HOJE`, e mais nada.** Não é conserto de código
alheio: é a lista de declaração que o próprio portão manda preencher, e
`app/audio_saida.py::estado_do_sono` já morava lá desde 01/09. Registro aqui
porque a regra é relatar, e porque uma colisão nesse arquivo com outra sprint
desta leva sai como conflito de merge — que é o barulho desejado.
