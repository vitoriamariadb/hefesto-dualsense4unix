# MIC-OS-QUATRO-01 — os quatro microfones ganham NOME e o CABO ganha canal

**Árvore:** `hefesto-voo/MIC-OS-QUATRO-01-opus` · branch `voo/MIC-OS-QUATRO-01-opus`
· base `e5f4b3da` (= `dev`) · **bancada: não usei** (`bancada: false`, e a prova
de aparelho fica para a MESA-DE-QUATRO-01).

## O que mudou

Três defeitos, e os três foram **medidos nesta árvore antes de escrever a cura**.

### 1. O rótulo do nó dizia o TRANSPORTE e publicava o ENDEREÇO dela

`integrations/dualsense_bt_audio.py:1176` batizava o canal do microfone com

```python
descricao = f"Microfone DualSense BT ({self.no.uniq or self.no.caminho})"
```

Duas coisas erradas numa linha:

* **o nome do transporte.** O nome INTERNO do nó já tinha sido curado em 06/09
  (`hefesto_mic_<hex6>`, o mesmo no cabo e no rádio); o **rótulo legível** — o
  que ela lê no seletor de microfone de qualquer aplicativo — não veio junto, e
  continuava dizendo *"DualSense BT"*. Trocar o fio pelo rádio continuava
  trocando o nome do microfone daquele controle na cara de quem olha;
* **o MAC do controle dela** na lista de dispositivos de áudio da máquina. A
  máscara da casa cobre arquivo versionado; esta linha escapava por não ser
  arquivo — ela nascia em tempo de execução, no `device.description` do nó.

**Agora o nó se chama «Microfone do Controle N»** — decisão dela de 09/09
(`D-0909-OS-NOS-SE-CHAMAM-ALTO-FALANTE-E-MICROFONE-DO-CONTROLE-N`, palavra dela:
*"4a"*), com o número do ASSENTO, como na tela. O par foi para
`docs/A-LINGUA-DESTA-CASA`, que era a condição que ela pôs: *"o par vai para a
LÍNGUA DESTA CASA antes de nascer na lista do sistema"*.

O assento vem por **gancho**, do mesmo desenho dos três que já existiam
(`registrar_pedidor_de_canal`, `registrar_dizedor_do_no_ar`): quem SABE o
assento é o daemon, quem BATIZA é a integração, e o gancho junta os dois sem
inverter a camada. Quem o instala é `BtMicSubsystem.start`, e ele lê
`describe_controllers()` — **a mesma lista que desenha os cards**.

**NÃO é `coop.resolve_player_numbers`, e a razão é medida:** com o co-op
desligado aquela função responde `1` para todos os controles conectados
(`coop.py:2200`). Batizar por ela poria quatro «Microfone do Controle 1» na
lista dela — um rótulo repetido que mente sobre qual é qual.

### 2. A palavra dela sobre o microfone de um controle no CABO evaporava

`BtMicSubsystem._esquecer_quem_saiu_da_mesa` recebia `nos_dualsense_bluetooth()`
— **só o rádio** — e tratava *"não está no rádio"* como *"saiu da mesa"*.
Medido nesta árvore, com o registro em mãos:

```
sub.no_ar("aa:bb:cc:00:00:01", True)          # ela aperta o botão do mic
  depois do botao      : {'aabbcc000001': True}  pedidos: ['aabbcc000001']
sub._esquecer_quem_saiu_da_mesa([<só o do rádio>])
  depois da varredura  : {}                      pedidos: []
```

E não é *"até a próxima varredura de 5 s"*: `dizer_no_ar` toca a `novidade`, que
**acorda o laço na hora**. Um controle no fio com o microfone aceso perdia a
palavra dela imediatamente. Quem lê essa palavra é `hotkey._metade_do_canal`
(o desfazer de um ato recusado, a sexta porta de 08/09) — que passava a
desfazer no escuro.

A mesa passou a ser **o rádio MAIS o backend**: `do_radio | uniqs_na_mesa()`. A
união, e não a troca — um nó de BT pode existir sem que o backend tenha handle
aberto para ele, e trocar uma leitura pela outra derrubaria a ponte de quem o
backend ainda não enxerga.

### 3. No CABO ninguém erguia o canal com nome de controle

`grep -rn "canal_do_microfone" src/` devolvia **UM** chamador de `abrir`, e era
a ponte de rádio (`dualsense_bt_audio.py:1297`). O controle do rádio ganhava o
`hefesto_mic_<hex6>` de graça; o do cabo, nunca. **Sem isso a mesa não chega a
quatro por construção**, e o "um nome só nos dois transportes" só valia de um
lado.

`BtMicSubsystem` ganhou um supervisor do cabo (`_reconciliar_o_cabo`), com
quatro travas, cada uma por um defeito conhecido:

| trava | o que ela impede |
| --- | --- |
| só sobe para `uniq` que **PEDIU** (`no_ar(uniq, True)` — o [mic] da tela e a borda do botão do plástico) | o *"liga sozinho"*: um canal do cabo carrega um `module-pipe-source` **e um `parec` lendo o microfone dela** |
| **quem está no rádio não é daqui**, e a régua é o NÓ do sysfs, não a ponte de pé | os dois transportes publicam o MESMO nome de nó, e quem carrega um `module-pipe-source` com nome que já existe **derruba o de pé como órfão** (`SourceVirtualPipeWire.iniciar`) — é o MIC-RADIO-ORFAO-01 (zeros perfeitos) voltando por outra porta |
| roda **ANTES** do `gerenciador.reconciliar` no laço | a troca fio→rádio vira passagem de mão: o nó do cabo já saiu quando a ponte tenta subir o dela |
| só fecha o que **ele** abriu (`_canais_do_cabo`), e nunca sobe um nome que `de_pe()` já tem | derrubar o canal da ponte pelas costas do dono |

**A regra 0 de `escolher_fonte` é RECUSADA aqui, e a recusa é na ENTRADA:** o
supervisor tira os `hefesto_mic_*` da lista **antes** de perguntar. As outras
seis chamadoras querem *"qual é o microfone deste controle"*; ele quer *"de
onde eu LEIO para encher o nó"*, e alimentar o canal com ele mesmo poria um
`parec` lendo o nó que ele enche. (Descartar a resposta DEPOIS daria o mesmo
veredicto só quando o canal é a única resposta; nos outros casos a regra 0
responde primeiro e as regras do cabo nunca correriam.)

O censo de chamadoras de `escolher_fonte` **passou de seis para sete** e a
régua que o vigia pegou a entrada sozinha, na primeira corrida — foi ela que me
obrigou a escrever a dirigida 7/7.

### O que NÃO mudou, de propósito

* **Nenhuma frase nova de tela.** As recusas continuam palavra por palavra;
  o único texto novo é o rótulo do nó, que é decisão dela já tomada.
* **A eleição não mudou.** `canal_ativo` continua sendo *"sou o padrão do
  sistema"* — ver «o que caiu da sprint».
* **`canal_do_microfone.py` não foi tocado** (não está na minha posse). Ele é
  chamado, nunca editado.

## Qual mordida prova

`tests/unit/test_os_quatro_microfones_tem_nome_de_controle.py` — 13 réguas.
As três curas foram **arrancadas uma a uma** e as três reprovaram:

**Mordida 1 — devolvi a f-string de antes de 09/09** (`return f"Microfone
DualSense BT ({uniq})"`):

```
E   assert <a f-string velha> == 'Microfone do Controle 2'
E     - Microfone do Controle 2
E     + Microfone DualSense BT (aa:bb:cc:00:00:02)
FAILED ...::test_o_rotulo_do_no_e_microfone_do_controle_n
FAILED ...::test_o_rotulo_nunca_carrega_o_endereco_do_controle
FAILED ...::test_sem_assento_sabido_nao_se_inventa_numero
FAILED ...::test_a_ponte_do_radio_batiza_o_no_com_o_nome_dela
FAILED ...::test_o_toque_dela_ergue_o_canal_do_cabo_com_o_no_alsa
FAILED ...::test_o_gancho_do_assento_sobe_e_desce_com_o_subsystem
6 failed, 7 passed in 0.36s
```

**Mordida 2 — a mesa voltou a ser só o rádio** (`esquecer_ausentes(do_radio)`):

```
E   assert {} == {'aabbcc000001': True}
[info] bt_mic_pedidos_esquecidos  uniqs=['aabbcc000001']
FAILED ...::test_a_palavra_dela_sobre_o_mic_do_cabo_sobrevive_a_varredura
1 failed, 12 passed in 0.35s
```

**Mordida 3 — arranquei o corpo que ergue o canal do cabo**:

```
E   assert {} +  where {} = <BtMicSubsystem ...>._canais_do_cabo
FAILED ...::test_o_toque_dela_ergue_o_canal_do_cabo_com_o_no_alsa
FAILED ...::test_o_canal_do_cabo_cai_quando_ela_desliga
FAILED ...::test_o_canal_do_cabo_passa_de_mao_quando_o_controle_vai_para_o_radio
3 failed, 10 passed in 0.35s
```

Com as três curas devolvidas: **13 passed**.

**As réguas que existem para a cura não virar defeito** (e passam nas três
mordidas, porque medem a outra metade):

* `test_quem_sai_da_mesa_de_verdade_continua_sendo_esquecido` — a cura 2 não
  pode virar *"o pedido nunca morre"*, que é o `liga sozinho`;
* `test_sem_toque_dela_nenhum_canal_do_cabo_sobe` — a privacidade do cabo é a
  mesma do rádio;
* `test_o_supervisor_do_cabo_nao_encosta_em_quem_esta_no_radio` — a disputa do
  nome de nó;
* `test_sem_assento_sabido_nao_se_inventa_numero` — inclui `True`, que é `int`
  em Python e viraria o assento 1 calado, e um numerador que explode.

E a dirigida nova no arquivo do dono do censo:
`test_o_microfone_pelo_radio_alimenta_o_no.py::test_a_regra_0_e_recusada_no_supervisor_do_cabo`
(chamadora 7/7). **Ela mordeu enquanto era escrita**: a primeira versão da cura
descartava a resposta da regra 0 na SAÍDA, e a régua provou que só funciona na
entrada.

## O que NÃO verifiquei

* **NADA NO APARELHO.** `bancada: false`; não chamei `scripts/bancada.sh`, não
  parei o daemon, não escrevi em `hidraw` nenhum, e **nenhum `pactl` de verdade
  correu**: os dois donos (`canal_do_microfone.abrir`/`fechar`) entram dublados.
  Tudo aqui é medição de código e de contrato.
* **Os quatro nós na lista viva** — `pactl list short sources` com quatro
  «Microfone do Controle N», dois no cabo e dois no rádio. É o item 1 do «O que
  MORDE» da sprint, é `scripts/ensaios/os_nos_de_som_por_controle.py`, e é da
  bancada dela. **Eu não o rodei** (`scripts/` é posse da TUDO-FUNCIONA-01).
* **A voz dela saindo no canal de cada um** — teste de orelha, dela.
* **Dois no RÁDIO ao mesmo tempo**, que a sprint diz que nunca foi feito.
  Continua sem ser feito.
* **O `parec` do cabo entregando byte** — o alimentador do canal do cabo já
  existia e é do `canal_do_microfone`; o que é novo é QUEM o manda subir. Que
  ele encha o fifo com voz está medido desde 06/09 no dono, não por mim.
* **O rótulo chegando ao nó através do `pactl`** — a régua mede a descrição com
  que a ponte PEDE o canal. Que ela sobreviva ao parser do `pipewire-pulse` já é
  medido por `test_a_prioridade_chega_ao_no_e_nao_so_ao_argv` (as aspas duplas
  de `propriedades_da_source`), e é por isso que um rótulo com ESPAÇOS — que é o
  caso de «Microfone do Controle N» — não é cortado. **Não remedi isso.**
* **O assento no nó envelhece.** A descrição é gravada no `load-module` e não
  se reescreve; se ela tirar um controle da mesa, o nó de outro pode ficar com
  o número do assento de antes até o canal ser reerguido. Ver «o que sobrou».

### Célula do mapa que este trabalho toca

| chave | transporte | até onde foi | o que vi |
| --- | --- | --- | --- |
| `audio.microfone@dualsense` | cabo | **MONTOU** (dublê, sem PipeWire) | o canal por controle passa a ser ERGUIDO no cabo, sob o pedido dela, alimentado pelo nó ALSA que `escolher_fonte` resolve. Nenhum byte medido no fio |
| `audio.microfone@dualsense` | rádio | **MONTOU** (dublê, sem PipeWire) | o nó da ponte passa a nascer «Microfone do Controle N», sem o endereço. O caminho do áudio não foi tocado |

**Não editei `docs/data/mapa-controles.csv`** — é posse da TUDO-FUNCIONA-01.
A célula `radio_aciona=parcial` continua valendo; nada aqui a contradiz.

## O que sobrou para o próximo

1. **A PROVA NA BANCADA, e ela é o item 1 do «O que MORDE».** Com os quatro na
   mesa: `scripts/ensaios/os_nos_de_som_por_controle.py` tem de contar quatro
   «Microfone do Controle N» — e `--observar 60` diz o que a lista faz quando
   ela tira um cabo. Nada disso rodou aqui.
2. **O assento no rótulo não se reescreve.** A descrição é do `load-module`.
   Duas saídas, e nenhuma é minha: (a) reerguer o canal quando o assento muda
   E a source não está `RUNNING` (o mesmo desenho de `_talvez_seguir_a_source`,
   que já sabe distinguir `RUNNING` de `IDLE`); (b) aceitar que o número
   envelhece até o próximo ciclo e dizê-lo. **Isto é decisão dela** — o custo
   de (a) é o nó sumir por um instante na mão de quem estiver gravando.
   **ESCRITO COMO PENDÊNCIA NA SPRINT em 09/09** (seção «PENDÊNCIA ABERTA — É
   DELA»), com o custo das duas medido e a terceira saída eliminada: o `pactl`
   16.1 desta máquina não tem verbo que reescreva a proplist de uma source
   carregada. Ver «Reparo 09/09 · 4».
3. **O alimentador do cabo captura mesmo sem ouvinte.** Já está declarado no
   cabeçalho de `canal_do_microfone` (*"o nó ALSA fica em RUNNING mesmo sem
   ninguém gravando"*) e era da ONDA5-MIC-VIRTUAL-02 junto com o `0x32`. **O
   rádio ganhou a cura em 06/09 e o cabo não** — e agora que o cabo ergue canal
   sob o botão dela, a conta passou a ser cobrável: enquanto o microfone dela
   estiver "ligado" num controle do fio, há um `parec` lendo. Arquivo:
   `integrations/canal_do_microfone.py` (fora da minha posse).
4. ~~**`canal_do_microfone.py` guarda um FATO ERRADO.**~~ **CURADO NO REPARO DE
   09/09** — ver «Reparo 09/09 · 1». A frase (*"O caso B é defeito vivo de
   `integrations/dualsense_bt_audio.py` (…) RELATADO, não curado"*) foi
   SUBSTITUÍDA pela verdade, e a posse da sprint foi alargada para
   `canal_do_microfone.py` com a razão escrita no frontmatter. **A decisão de
   apenas RELATAR estava errada**, e a regra que sobra é a que o conferente
   escreveu: *fato errado vivo é pior que posse alargada*.
5. **O ALTO-FALANTE não tem o nome dela.** `alto_falante_bt.DESCRICAO_PROVISORIA`
   ainda é `"Alto-falante do controle"`, sem número, marcado `PROVISÓRIO —
   decisão dela`. A decisão saiu (a mesma de 09/09, o par), e o gancho do
   assento que este trabalho instalou serve aos dois — `numero_do_assento` é
   público em `dualsense_bt_audio`. **É da SOM-POR-CONTROLE-01.**
6. **`interface/monta.py:291` cita `aba03.py:878`, que está EM BRANCO.** Portão
   `citacoes-no-codigo` vermelho — ver abaixo. `aba03.py` é posse da ROLAGEM-01.

## O que caiu da sprint

**«os QUATRO com `canal_ativo=True`» é impossível por construção, e a decisão
dela de 03/09 já dizia isso.** O enunciado da sprint (§«O que MORDE») pede *"os
QUATRO com `canal_ativo=True` e quatro `canal_fonte` distintas"*.
`hotkey._ler_o_canal` calcula `canal_ativo = ativa == fonte`, onde `ativa` é
`pactl get-default-source` — **UM nome**. Quatro `True` ao mesmo tempo não é uma
falta a curar: é uma contradição com o que ela decidiu na CANAL-POR-CONTROLE-01,
escrita no cabeçalho de `eleicao_de_microfone.py` com as palavras dela:

> **TER CANAL** não é escasso. Cada DualSense pode publicar o canal de captura
> DELE, e ninguém precisa tirá-lo de ninguém; **SER O PADRÃO DO SISTEMA** é o
> único recurso genuinamente único.

**O que resta de pronto naquela linha é a segunda metade** — quatro
`canal_fonte` distintas —, e é essa que este trabalho persegue. Não mudei nada
na eleição.

## Os portões

```
git add -A && bash scripts/portoes.sh   ->  REPROVOU: 2 vermelho(s) de 54
                                            -> citacoes-no-codigo  acentuacao
```

**OS DOIS SÃO HERDADOS DO `dev`, e a herança está PROVADA** — não deduzida. Fiz
um `git archive e5f4b3da | tar -x` num diretório limpo e rodei os dois portões
lá:

```
acentuacao no BASE e5f4b3da  ->  rc=1, 20 violação(ões) — a MESMA lista, linha a linha
  scripts/check_cabo_bt_perfil_controle.py (10)   [CABO-BT-PERFIL-CONTROLE-01, de hoje]
  scripts/ensaios/a_janela_cabe_no_que_ela_ve.py:83
  tests/unit/test_portao_a_regua_das_quatro_respostas.py (9)

citacoes-no-codigo no BASE   ->  rc=1, o MESMO único achado
  interface/monta.py:291 cita a linha 878, que está EM BRANCO
  1 failed, 15 passed
```

E `git diff --quiet e5f4b3da -- <cada um dos cinco arquivos>` sai limpo: não
encostei em nenhum. Os três primeiros são posse da TUDO-FUNCIONA-01 (`scripts`)
e do par nascido hoje com a CABO-BT-PERFIL-CONTROLE-01 — que o despacho mandou
não alterar sem razão medida —, e `aba03.py` é posse da ROLAGEM-01. **Relatei
em vez de editar**, que é o §2 do protocolo.

**Os dois vermelhos que eram MEUS eu curei**, e valem como registro:

* `ruff` — quatro achados no arquivo de teste novo (`E501` × 3, `RUF012`,
  depois `N802`). Nota: `ruff check src/ tests/` dava **verde** neles; quem
  pegou foi o comando do portão. É a linha do `CLAUDE.md` — *"`ruff check .` ≠
  `ruff check src/ tests/`"* — cobrando pela enésima vez;
* `citacoes-de-linha` — **e este é o mais instrutivo do dia.** Eu tinha posto o
  bloco do nome no meio de `dualsense_bt_audio.py`, e as 95 linhas novas
  empurraram para baixo duas linhas que o `docs/data/mapa-controles.csv` cita
  por `arquivo:LINHA` (`dizer_o_pedido_dela` e `_talvez_seguir_a_source`, célula
  `audio.microfone@dualsense`). **Código novo acima de uma linha citada
  envelhece a citação inteira** — e a cura não podia ser reapontar o CSV, que é
  posse de outra sprint. O bloco foi para o FIM do módulo, com a razão escrita
  ali para a próxima pessoa não o "arrumar" de volta.

E dois que **este próprio laudo** criou, na volta seguinte — vale como registro
de que a régua alcança a saída de agente: `mac-por-oui` e `saida-de-agente`
reprovaram porque eu colei a saída de pytest **crua**, e o `assert` dela vem
TRUNCADO: o pytest come o miolo da string e deixa as reticências grudadas nos
quatro últimos octetos. O corte do pytest fabrica a forma
*"sufixo com o OUI elidido"*, que é exatamente o que o BURACO-DO-PORTAO-01
existe para pegar — mesmo com o endereço já mascarado. Curado reescrevendo a
linha, e o `sanitizar_saida_de_agente.py` fecha agora como no-op. (O mesmo
passo tirou um emoji de microfone, que o hook de pre-commit bloqueia.)

`mypy`, `shellcheck`, `anonimato`, `casa-sabe`, `referencias-docs`,
`nada-mockado`, `mapa-de-canais`, `endereco-de-radio`, `a-tela-dela` e os
outros 42: **ok**.

Fora dos portões, rodei o escopo: **251 passed, 1 xfailed** nos catorze arquivos
que tocam microfone, canal, eleição e ponte de rádio.

---

## Reparo 09/09

Os três achados do conferente, curados. A quarta linha dele — a pergunta do
rótulo — **não é minha**: está escrita como pendência na sprint, com as duas
saídas e o custo de cada uma.

### 1. O FATO ERRADO VIVO caiu — e ele nasceu errado, não envelheceu

`integrations/canal_do_microfone.py` dizia, no `propriedades_do_canal`:

> *"O caso B é defeito vivo de `integrations/dualsense_bt_audio.py`, que esta
> sprint não toca — está RELATADO, não curado."*

**Nunca foi verdade depois das 07h11 de 06/09.** Medido pelo próprio git:

| | |
| --- | --- |
| a frase entrou | `752d688e`, 06/09/2026 **04h50** |
| a cura entrou | `d8901de0`, 06/09/2026 **07h11** — `propriedades_da_source` passou a devolver o argumento inteiro entre aspas duplas |

Duas horas e vinte e um minutos de distância, e a frase ficou de pé por três
dias porque ninguém releu o outro arquivo. A metade que faltava — o
`device.description` publicando o endereço do controle — foi a desta sprint.

**Por que aleguei posse e não curei da primeira vez, e por que isso estava
errado:** `canal_do_microfone.py` não está no `posse:` da MIC-OS-QUATRO-01, e
eu escrevi o achado no «O que sobrou para o próximo» (item 4) em vez de
consertá-lo. **Fato errado vivo é pior que posse alargada** — a posse existe
para evitar que duas frentes disputem o mesmo arquivo, não para preservar uma
mentira que a próxima pessoa vai ler como verdade. A posse fica alargada, com a
razão, e o texto foi SUBSTITUÍDO — a medição A/B/C fica (é ela que explica por
que estas propriedades vão no STREAM e não no nó), o diagnóstico falso sai.

Conferido que a frase não vive em outro lugar: `grep -rn "defeito vivo"` nos
`integrations/` devolve só a linha nova, que diz o contrário.

### 2. As duas leituras da mesa concordam — e a que estava errada era a do assento

`describe_controllers()` devolve **uma entrada por HANDLE ABERTO**, não por
controle na mesa (está escrito no fonte: *"Uma entrada por handle aberto"*), e o
handle de um controle desligado continua na lista com `connected: False` e
`index` próprio.

| | antes | agora |
| --- | --- | --- |
| `uniqs_na_mesa` | filtrava por `connected` | idem, pelo `_conectados_da_mesa` |
| `numero_do_assento` | **não filtrava**, e lia o `index` do item | enumera `_conectados_da_mesa` |

O defeito era das DUAS pontas, não de uma: com o controle do assento 1
desligado, ele **ganhava** o assento 1 (que a mesa não lhe dava) e **empurrava**
os outros três para 2, 3 e 4 — quando a tela dela já mostrava 1, 2 e 3.

**O assento é o da TELA, e isso foi conferido no produto, não deduzido:**
`interface/hefesto_vivo._contexto` monta `ctx.conectados` com
`[c for c in controllers if c.get("connected", True)]` e numera os cards por
`enumerate` dessa lista; a aba Gatilhos monta o `_target_uniq_by_index` do mesmo
jeito. **Nenhum dos dois lê o `index`** — só o `numero_do_assento` lia.

A invariante que fecha, e ela está escrita na docstring:
`numero_do_assento(u) is not None` **se e somente se** `u in uniqs_na_mesa()`.

**A MORDIDA** — `test_um_controle_desligado_nao_ocupa_assento`, com o P1
desligado numa mesa de quatro. Arrancada a cura (devolvendo o `enumerate` sobre
a lista inteira e a leitura do `index`):

```
FAILED ...::test_um_controle_desligado_nao_ocupa_assento
AssertionError: um controle DESLIGADO ganhou assento na mesa dela
assert 1 is None
 +  where 1 = numero_do_assento('aa:bb:cc:00:00:01')
1 failed, 13 passed
```

Cura devolvida: **14 passed**. O teste cobre as três coisas — o ausente sem
assento, os três presentes em 1·2·3, e a invariante controle a controle.

### 3. Os dois VERMELHOS são HERDADOS — provado, e o dono não sou eu

`.venv/bin/python -m pytest` nos **36 arquivos** de `tests/` que importam
`dualsense_bt_audio`, `canal_do_microfone`, `bt_mic`, `eleicao_de_microfone` ou
`alto_falante_bt`, mais o `test_som_02_devolucao_da_posse.py` que o conferente
nomeou:

```
2 failed, 746 passed, 1 xfailed em 153,49s
FAILED tests/unit/test_som_02_devolucao_da_posse.py::TestPonteDaJanela::test_release_manda_a_chave_e_o_uniq
FAILED tests/unit/test_som_02_devolucao_da_posse.py::TestPonteDaJanela::test_volume_continua_indo_explicito
```

**A prova de que não são meus, e são três provas independentes:**

```
git diff e5f4b3da..HEAD -- tests/unit/test_som_02_devolucao_da_posse.py        → 0 linhas
git diff e5f4b3da..HEAD -- src/hefesto_dualsense4unix/app/ipc_bridge.py        → 0 linhas
```

* os dois arquivos envolvidos não têm **uma linha** de diferença entre a base
  `e5f4b3da` e o meu `HEAD` — nem no commit, nem na árvore de trabalho;
* **reprovam com o arquivo rodando SOZINHO** (`2 failed, 38 passed`), então não
  é contaminação por ordem de teste vinda das minhas réguas;
* `git diff HEAD dev` nos dois arquivos é **vazio**: o `dev` de agora
  (`bb87d7df`) tem os mesmos bytes e o mesmo vermelho.

**A causa, medida:** `TypeError: <lambda>() got an unexpected keyword argument
'timeout'`. `app/ipc_bridge._corpo_do_daemon` ganhou um parâmetro `timeout` em
**`edfcc9b4`** (*"as seis que ela deixou ao desligar — e o teto que fazia a tela
mentir"*), que já estava na minha base. Os dublês de `_safe_call` nesses dois
testes são lambdas de DOIS parâmetros.

**E a docstring cinco linhas acima da assinatura AVISAVA, com o número de
casualidades certo:** *"Sem parâmetro de `timeout`, de propósito. (…) há dublês
de `_safe_call` em testes de outras abas escritos como uma lambda de DOIS
parâmetros, e acrescentar um `timeout=` aqui os quebra sem que nada do produto
tenha mudado (medido em 23/08, **dois testes da SOM-02**)."* O aviso foi lido,
o parâmetro entrou, e os dois testes que ele nomeava caíram. É a armadilha que
esta casa já nomeou — *aviso no cabeçalho que ninguém lê* —, desta vez pelo
avesso: o aviso estava certo e ainda assim não segurou.

**NÃO CUREI, e a razão não é posse — é que a cura é uma ESCOLHA de quem tem o
arquivo.** São duas, e elas se excluem: (a) o dublê da SOM-02 passa a aceitar
`**kwargs` — e aí a docstring do `_corpo_do_daemon` tem de ser substituída,
porque ela ainda afirma que a função **não tem** parâmetro de `timeout`, o que
deixou de ser verdade em `edfcc9b4`; ou (b) as três rotas de áudio param de
passar `timeout=_TETO_DO_ATO_DE_AUDIO` por dentro do `_corpo_do_daemon` e
chamam o `_safe_call` direto, que é o que a própria docstring manda quem precisa
de folga fazer. Escolher por fora seria eu decidir o desenho do teto que aquela
sprint acabou de erguer. **Vai para quem tem `app/ipc_bridge.py`, com o
`edfcc9b4` no endereço.**

### 4. A pergunta do rótulo — ABERTA, e é dela

Está escrita na sprint, seção **«PENDÊNCIA ABERTA — É DELA: o rótulo não se
reescreve quando os assentos andam»**, com as duas saídas e o custo medido de
cada uma.

**A terceira saída não existe, e isso é medição nova de hoje:** o `pactl` desta
máquina é o **16.1** (pipewire-pulse) e a lista de verbos dele não tem
`update-source-proplist` — não há como reescrever a proplist de uma source já
carregada. Pela porta que este código usa, trocar a descrição é derrubar e subir
o nó.

**E o reparo 2 aumentou a aposta, de propósito:** o assento agora anda toda vez
que alguém desconecta um controle (antes o handle desligado segurava o número
dos outros, escondendo o envelhecimento em troca de discordar do card). Seguir a
tela é o certo; o preço é que o rótulo gravado envelhece com mais frequência —
e é por isso que a pergunta não podia ficar sem dono.

### O escopo, no fim do reparo

| | |
| --- | --- |
| arquivos tocados | `daemon/subsystems/bt_mic.py`, `integrations/canal_do_microfone.py` (posse alargada), o teste da sprint, a sprint e este laudo |
| lote dos importadores | **2 failed, 746 passed, 1 xfailed** — os dois vermelhos provados herdados acima |
| o teste da sprint | **14 passed** (13 antes do reparo) |
