# ONDA5-MIC-VIRTUAL-01 — passos 2, 3 e 4

Agente MIC da leva de 06/09/2026. Árvore
`/mnt/Apate/Desenvolvimento/hefesto-voo/ONDA5-MIC-VIRTUAL-01-MIC`, branch
`voo/ONDA5-MIC-VIRTUAL-01-MIC`, nascida de `onda/atual-0609` (`ec6811aa`).
O Passo 1 já estava fechado em `44eafced`.

---

## O QUE SE MEDIU

Tudo abaixo foi medido na máquina dela em 06/09/2026, com PipeWire 1.6.8, um
DualSense no cabo e a bancada LIVRE (`bash scripts/bancada.sh exigir` → rc=0).
**A origem de áudio das provas é SINTÉTICA** — um `module-null-sink` com um tom
de 440 Hz dentro. **Nada do microfone dela foi lido em nenhum momento**, e o
`default-source` dela foi conferido antes e depois de cada prova: sempre
intacto, sempre sem módulo residual.

### 1. O Passo 2 exigia uma medição ANTES do código, e ela é decisiva

*"Meça se um link do grafo do PipeWire basta ou se é preciso um leitor."*

```
pw-link -i | grep <o nó>   →  (NENHUMA PORTA DE ENTRADA)
pw-link -o | grep <o nó>   →  <o nó>:capture_FL
                              <o nó>:capture_FR
pw-dump                    →  media.class = Audio/Source
                              PORT dir=output  capture_FL
                              PORT dir=output  capture_FR
```

**Um `module-pipe-source` não tem porta de entrada.** As duas portas apontam
para fora, para quem grava. Não existe no grafo nada a que ligar o nó do cabo:
`pw-link` não tem alvo. **A única entrada é o fifo — logo é preciso um LEITOR.**

### 2. TODO `module-pipe-source` NASCE MUDO — e era isto que calava o canal

```
module-pipe-source recém-carregado, nome hefesto_mic_000001      → Mute: yes
module-pipe-source com um nome SORTEADO, que nunca existiu       → Mute: yes
app gravando do canal, com o mudo de fábrica   → 192000 bytes, pico 0
o MESMO canal, depois de `pactl set-source-mute … 0`
                                               → 192000 bytes, pico 20000
```

Não é estado restaurado (`~/.local/state/wireplumber/` não guarda o nome, e um
nome sorteado nasce mudo igual): é como a versão publica o nó.

**O sintoma é o pior possível: mudo ele entrega BYTES, não silêncio.** 192 KB de
zeros passam por qualquer régua que conte bytes, e do lado de fora aquilo se lê
como *"a ponte está decodificando e não sai áudio"* — que é exatamente o sintoma
que o cabeçalho da ponte de rádio atribui ao WirePlumber parado.

### 3. O `source_properties` perde tudo depois do primeiro espaço

```
A) source_properties=priority.session=7                        → prio 7     CHEGOU
B) …description='canal medicao' priority.session=7 …           → prio 2000  PERDIDO
C) source_properties="…=7 hefesto.papel=… hefesto.uniq=…"       → tudo       CHEGOU
```

Só entre **aspas duplas** as propriedades sobrevivem inteiras. O caso B é
exatamente como a ponte de rádio monta a chamada hoje — e medido no nó vivo:

```
Description: Microfone            ← era "Microfone do controle 1"
priority.session = "2000"         ← o PRIORIDADE_SESSAO_DA_PONTE = 1500
                                    NUNCA CHEGA AO NÓ
```

### 4. O `parec` nasce com um fragmento de quase QUATRO segundos

```
parec sem --latency-msec     → primeiro byte aos 1,982 s
parec com --latency-msec=40  → primeiro byte aos 0,088 s
```

`pulse.attr.fragsize = 384000`. Dois segundos de silêncio depois de ela apertar
o botão do microfone se leem como *"não funcionou"*, e o fragmento gigante
chegaria de uma vez a um fifo de 8 KiB, onde quase tudo viraria descarte.

### 5. O nó novo não chegava à lista de fontes

`hefesto_mic_000001` não contém NENHUM dos `MARCADORES_DUALSENSE` — o nome da
ponte de rádio contém, porque tem a palavra `dualsense` dentro:

```
fontes_dualsense(<as quatro linhas>)  →  só os dois nós ALSA
escolher_fonte(…, P1, …)              →  alsa_input…-00.iec958-stereo
escolher_fonte(…, P2, …)              →  alsa_input…-00.2.iec958-stereo
```

Sem a entrada por identidade, a regra 0 do Passo 3 seria **código morto que dá
verde** — instrumento falso, na forma que esta casa já nomeou.

### 6. A REGRESSÃO QUE ESTA SPRINT CRIOU, medida antes de curar

Batizar o nó de `hefesto_mic_<hex6>` põe a palavra `hefesto` na linha de comando
de **todo app dela que grave dele**:

```
app de terceiro que NOMEIA o nó novo (obs --record --device=hefesto_mic_000001):
   e_stream_do_hefesto = True    ← o Hefesto se confunde com o app DELA
o MESMO app no nó ALSA (o mundo de antes):
   e_stream_do_hefesto = False   ← a resposta certa
```

`True` quer dizer que o ouvinte de verdade sai da conta e **a luz vermelha nunca
acende para o canal que a sprint inteira existe para construir.**

### 7. E o que NÃO leva a palavra do nó

Medido, e é o que manteve a cura estreita: o nome do nó vaza para
`target.object`, mas **não** para `application.name`, `node.name` nem
`media.name`. Só a regra de `/proc` precisava de poda.

---

## O QUE MUDOU

### Passo 2 — o cabo entra no nó, e o Hefesto não conta como ouvinte

`src/hefesto_dualsense4unix/integrations/canal_do_microfone.py`

* **`_Alimentador`** — o leitor (`parec`) mais o bombeador. Ele **não escreve no
  fifo direto**: entrega o PCM a `SourceVirtualPipeWire.escrever`, que é a porta
  PÚBLICA do mecanismo e a mesma pela qual a ponte de rádio entrega os quadros
  dela. Um nó, uma entrada, dois transportes — é o que permite a MIC-VIRTUAL-02
  ligar o rádio sem reabrir esta peça.
* **`argv_do_alimentador`** — `parec` e não `pw-cat`, e não é gosto: o nome que
  este módulo tem em mãos é nome de `pactl` (quem lista é `fontes_dualsense`,
  que lê `pactl list sources short`), e `--property=CHAVE=VALOR` é **um argv por
  propriedade**, imune ao buraco do `source_properties`. A taxa e os canais vêm
  do NÓ (`source.taxa_hz`/`canais`), não de constante deste arquivo.
* **`--latency-msec=40`**, com a medição do §4 escrita ao lado do número.
* **`desmutar`** — o `set-source-mute … 0` logo depois do `iniciar`. **Não é o
  mudo dela**: o nó nasceu neste instante, com um nome que só nós escrevemos.
  O mudo do microfone dela continua sendo o do firmware, que este módulo não
  toca.
* **`propriedades_do_canal`** deixou de ser função sem uso: ela é o que o
  alimentador declara em `hefesto.papel`/`hefesto.uniq`, e é por isso que ele
  não conta como ouvinte. **Elas vão no STREAM, não no nó** — quem conta
  ouvintes lê blocos de `pactl list source-outputs`, que são streams.
* **`alimentando()`** — `{uniq: nó de onde o áudio vem}`. Separado de `de_pe()`
  de propósito: um canal publicado e MUDO é estado legítimo (o do rádio), e
  colapsar os dois faria *"o nó existe"* parecer *"o microfone está entrando"*.
* `fechar` **mata o alimentador ANTES** de derrubar o nó: um `parec` vivo sem nó
  para onde mandar continua gravando ela. E mata **pelo processo que nós
  lançamos** (`Popen.terminate`), nunca por padrão.

`src/hefesto_dualsense4unix/integrations/quem_ouve_o_microfone.py`

* **`_sem_os_nossos_nomes_de_no`** — a poda que cura a regressão do §6. Os dois
  prefixos são lidos do dono (`fontes_de_captura`), nunca digitados. O que a
  poda **não** alcança, de propósito: qualquer outra ocorrência de `hefesto` na
  linha de comando (o binário, o `parec` que a janela lança, as propriedades
  `hefesto.` do alimentador) continua valendo.

### Passo 3 — a regra 0, e as outras quatro FICAM

`src/hefesto_dualsense4unix/integrations/fontes_de_captura.py`

* **`PREFIXO_SOURCE_CANAL_DO_MIC`** e **`sufixo_do_canal_do_mic`** — o nome e o
  caminho de volta DESCERAM do `canal_do_microfone` para cá, porque quem lê o
  nome é o resolvedor e pôr o nome lá fecharia um ciclo de importação. É o mesmo
  movimento de `PREFIXO_SOURCE_PONTE_BT`. **Não é cópia:** lá a função não
  existe mais, e há régua que reprova se ela voltar a existir.
* **`fontes_dualsense`** passa a aceitar o nó por IDENTIDADE, além dos
  marcadores — sem isso a regra 0 nunca veria o nó (§5).
* **`escolher_fonte` ganhou a regra 0** — *o nó com identidade vence* — e as
  quatro antigas ficam inteiras: o nó com nome só existe depois que alguém pede
  o canal, e antes disso as quatro são o único caminho, inclusive o da janela
  estável.
* **A regra 0 cobre os QUATRO chamadores de uma vez**, porque a cura está DENTRO
  da função que os quatro chamam. Nenhum dos quatro arquivos foi tocado.
* Em `escolher_sink` a regra 0 é inerte e está declarado por quê: um
  `hefesto_mic_<hex6>` é nó de CAPTURA e `sinks_dualsense` nunca o devolve.

### Passo 4 — o portão do princípio

`tests/unit/test_a_mascara_nao_alcanca_o_microfone.py` já nascera no Passo 1.
Aqui ele **cresceu de sete para oito arquivos**: entrou
`integrations/quem_ouve_o_microfone.py`, que responde a segunda metade da
pergunta (*quem está ouvindo*) e que o Passo 2 passou a mexer. **Ele já estava
limpo quando entrou** — a régua foi ampliada sobre verde, não escrita para caber
num vermelho.

Ficou de fora, declarado: `integrations/nivel_do_microfone.py` tem um `_mascara`
no código (`:734`) que é a MÁSCARA DE EVENTOS do `selectors`, não a máscara
Xbox. Entrar hoje custaria uma isenção por colisão de palavra, e a isenção que
esta régua tinha morreu de propósito quando ela passou a ler por AST.

### A dívida declarada

`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`: a lápide de
`sufixo_do_canal` saiu (o símbolo desceu para produção alcançada); `alimentando`,
`argv_do_alimentador` e `desmutar` entraram; e a razão de `abrir` foi corrigida —
a medição que o Passo 2 exigia FOI feita, e o que falta agora é só o GESTO
(`pedir_canal` chamar `abrir`), que é da MIC-VIRTUAL-02.

---

## A PROVA DE BANCADA

Origem sintética, tom de 440 Hz com amplitude 20000. Nada do microfone dela.

```
default-source ANTES  = alsa_input.usb-…DualSense…-00.iec958-stereo

1) canal.abrir            -> hefesto_mic_000001
   canal.alimentando()    -> {'aa:bb:cc:00:00:01': 'prova_origem_mic.monitor'}
   estado do nó SEM app   -> SUSPENDED   (existir não é capturar)
   Mute do nó             -> Mute: no

2) fontes_dualsense vê o nó -> ['hefesto_mic_000001']
   escolher_fonte (regra 0) -> hefesto_mic_000001

3) UM APP GRAVANDO DO CANAL (2 s):
   bytes colhidos = 192000   pico da amostra = 20000   (o tom vale 20000)
   O MICROFONE É OUVIDO NO CANAL DELE: SIM
   estado do nó COM app   -> IDLE

DESMONTADO — sobrou no PipeWire: nada
default-source DEPOIS = alsa_input.usb-…DualSense…-00.iec958-stereo
MEXEU NO PADRÃO DELA : não
```

E a luz, medida à parte porque o leitor "de terceiro" precisa de uma árvore de
processos que não passe pelo python desta prova — cujo próprio caminho tem a
palavra `hefesto` dentro, e que por isso seria (corretamente) reconhecido como
nosso:

```
A) SÓ o alimentador de pé, ninguém gravando:
   por_uniq = {'aa:bb:cc:00:00:01': []}   sem_canal = ()
   (o alimentador ESTÁ no pactl: ['"hefesto-canal-do-microfone"'])
   A LUZ ACENDE SOZINHA? não

B) um app DE TERCEIRO gravando do canal:
   por_uniq = {'aa:bb:cc:00:00:01': ['gravador-de-terceiro']}
   A LUZ ACENDE PARA O APP DELA? sim
    266188       1 parec --device=hefesto_mic_000001 --raw --format=s16le …
                        --client-name=gravador-de-terceiro

residual: nenhum
```

O caso B é a prova, no aparelho, de que a poda do §6 funciona: a linha de
comando daquele `parec` **tem a palavra `hefesto` dentro**, e ele conta como
ouvinte assim mesmo.

### E sob a máscara Xbox?

**Sim, e ela nem chega perto do caminho.** Nenhum dos oito arquivos do caminho
do microfone lê `native_mode`, `gamepad_emulation_enabled`, `flavor` ou
`mascara` — é o portão do Passo 4, que lê por AST e reprova nomeando arquivo e
linha. As três peças novas (`canal_do_microfone`, a regra 0 de `escolher_fonte`,
a poda de `descende_do_hefesto`) **não recebem estado do daemon em nenhuma
assinatura**: elas falam de `uniq`, de nome de nó e de `/proc`. Não há por onde a
máscara entrar.

---

## A MORDIDA

Sete curas arrancadas, sete vermelhos. **A primeira tentativa da mordida nº 1
FICOU VERDE** e a régua teve de ser consertada: ela punha o `application.name`
junto das propriedades e quem respondia era a regra do nome, não o espaço de
nome. Régua que dá verde com a cura arrancada não mede nada — foi reescrita para
medir o espaço de nome SOZINHO, que é a junta declarada entre as duas peças.

```
===================================================================
MORDIDA — arranquei a regra do ESPAÇO DE NOME de e_stream_do_hefesto
===================================================================
>       assert e_stream_do_hefesto(stream, raiz_proc="/proc/nao-existe") is True
E       AssertionError: assert False is True
E        +  where False = e_stream_do_hefesto(StreamDeCaptura(indice=1, fonte=600,
E            corked=False, props={'hefesto.papel': 'canal-do-microfone',
E            'hefesto.uniq': 'aa:bb:cc:00:00:01'}), raiz_proc='/proc/nao-existe')
FAILED …::test_o_alimentador_nao_conta_como_ouvinte
FAILED …::test_as_propriedades_do_alimentador_sao_as_que_a_outra_peca_reconhece
2 failed, 30 deselected in 0.30s

===================================================================
MORDIDA — arranquei a poda do nome do nó em descende_do_hefesto
===================================================================
>       assert e_stream_do_hefesto(stream, tmp_path) is False, (
E       AssertionError: o Hefesto confundiu o app DELA consigo mesmo, porque o
E       nome do NÓ tem a palavra hefesto dentro — a luz do microfone nunca acenderia
E       assert True is False
FAILED …::test_o_app_dela_no_canal_novo_continua_contando_como_ouvinte
1 failed in 0.27s

===================================================================
MORDIDA — arranquei a REGRA 0 de escolher_fonte
===================================================================
>       assert escolher_fonte(fontes, P1, [P1, P2], usb) == canal.nome_do_canal(P1)
E       AssertionError: assert 'alsa_input.u...iec958-stereo' == 'hefesto_mic_000001'
E         - hefesto_mic_000001
E         + alsa_input.usb-Sony_Interactive_Entertainment_DualSense_Wireless_Controller-00.iec958-stereo
FAILED …::test_a_regra_0_vence_o_no_do_transporte
1 failed in 0.28s

===================================================================
MORDIDA — arranquei a entrada por IDENTIDADE de fontes_dualsense
===================================================================
>       assert canal.nome_do_canal(P1) in fontes_dualsense(saida)
E       AssertionError: assert 'hefesto_mic_000001' in
E         ['alsa_input.usb-Sony_Interactive_Entertainment_DualSense_Wireless_Controller-00.iec958-stereo']
FAILED …::test_o_no_com_identidade_chega_a_lista_de_fontes
1 failed in 0.26s

===================================================================
MORDIDA — arranquei o desmutar do abrir
===================================================================
>       assert ["pactl", "set-source-mute", "hefesto_mic_000001", "0"] in PACTL_PEDIDO, (
E       AssertionError: o canal subiu com o mudo de fábrica: ele entrega 192 KB de
E       ZEROS, e o sintoma se lê como 'a ponte não está entregando áudio'
E       assert ['pactl', 'set-source-mute', 'hefesto_mic_000001', '0'] in []
FAILED …::test_o_canal_nasce_mudo_e_o_produto_desmuta
1 failed in 0.27s

===================================================================
MORDIDA — arranquei o --latency-msec do alimentador
===================================================================
>       assert pedidos, f"o leitor voltou a aceitar o fragmento de 4 s do parec: {argv}"
E       AssertionError: o leitor voltou a aceitar o fragmento de 4 s do parec:
E       ['parec', '--device=alsa_input.usb-…-00.iec958-stereo', '--raw',
E        '--format=s16le', '--rate=48000', '--channels=1',
E        '--client-name=hefesto-canal-do-microfone',
E        '--property=hefesto.papel=canal-do-microfone',
E        '--property=hefesto.uniq=aa:bb:cc:00:00:01']
FAILED …::test_o_leitor_pede_latencia_curta_e_o_numero_e_medido
1 failed in 0.26s

===================================================================
MORDIDA — escrevi um gate de máscara no módulo do canal
  (`if daemon.is_native_mode(): return False`)
===================================================================
E       AssertionError: a régua voltou a medir prosa
E       assert [(596, 'is_native_mode')] == []
FAILED …::test_a_mascara_nao_aparece_no_caminho_do_microfone[integrations/canal_do_microfone.py]
FAILED …::test_a_regua_le_codigo_e_nao_prosa
2 failed, 8 passed in 0.29s
```

Com as sete curas de volta: `32 passed` na régua do canal, `164 passed` no
escopo inteiro do microfone.

---

## O QUE FICOU PARA OUTRA POSSE

**Para a ONDA5-MIC-VIRTUAL-02** — e nada disto era desta sprint:
`integrations/eleicao_de_microfone.py` e `integrations/dualsense_bt_audio.py`
estão no `nao_toca` do frontmatter.

1. **O GESTO.** `eleicao_de_microfone.pedir_canal` chamar
   `canal_do_microfone.abrir(uniq, descricao, fonte=<o nó ALSA>)` quando o
   transporte for cabo. A `fonte` se resolve por `escolher_fonte` **antes** de o
   canal subir — depois dele a regra 0 responde o próprio canal, que é a
   resposta certa para *"qual é o microfone dele"* e a errada para *"de onde eu
   leio"*. A dívida está declarada no `casa-sabe` com endereço e razão.
2. **O rádio alimentando o mesmo nó**, pela mesma `escrever`, e a aposentadoria
   do prefixo `hefesto_dualsense_bt_`. Os dois prefixos convivem hoje e há régua
   que exige que os dois leitores discriminem.
3. **O alimentador seguindo SUSPENDED/RUNNING da source.** Enquanto ele roda, o
   nó ALSA do cabo fica RUNNING mesmo sem ninguém gravando do canal. É o MESMO
   defeito que a CANAL-POR-CONTROLE-01 nomeou no rádio (*"a ponte captura mesmo
   sem ouvinte"*), e a cura é a mesma peça — junto com o `0x32`. O que segura a
   conta hoje é o ciclo de vida: o canal só nasce sob `pedir_canal`.
4. **O mudo de fábrica na ponte de rádio.** `hefesto_dualsense_bt_<hex6>` sobe
   pelo mesmo `module-pipe-source` e ninguém o desmuta. Medido: 192 KB de zeros,
   com todos os contadores da ponte subindo.
5. **O `source_properties` truncado na ponte de rádio.** `PRIORIDADE_SESSAO_DA_PONTE
   = 1500` **nunca chega ao nó** — ele nasce com o 2000 padrão do
   pipewire-pulse —, e a descrição chega cortada no primeiro espaço. A cura são
   aspas duplas em volta do valor inteiro.

   **E AQUI HÁ UM INSTRUMENTO FALSO COM ENDEREÇO.**
   `tests/unit/test_o_canal_do_radio_nao_perde_para_um_monitor.py` tem quatro
   réguas sobre esse número, e a que se chama
   `test_a_prioridade_viaja_de_verdade_no_load_module` (`:139`) afirma
   exatamente o que não acontece. Ela verifica que
   `"priority.session=1500" in props[0]` — e a string ESTÁ lá, dentro do argv
   único que a ponte monta. O que ela não vê é que aquele argv tem espaços
   dentro e o parser do `pipewire-pulse` descarta tudo depois do primeiro. **A
   régua mede o TEXTO do comando; o nó nasce com 2000.** É a forma de
   instrumento falso que esta casa já nomeou — *a régua respondia sobre outra
   coisa que não o produto* —, e ela até se defende do caso vizinho: o
   docstring dela diz que sem isso *"a régua estaria medindo uma constante"*.
   Ela saiu da constante e parou no argv, a um passo do aparelho.

   Quem curar a ponte cura as duas coisas de uma vez: as aspas duplas, e a
   régua passando a LER o nó (`pactl list sources`) em vez do comando.

**E o que a MIC-VIRTUAL-02 vai encontrar JÁ FEITO** — vale dizer, porque a
sprint dela pede e o arquivo está no `nao_toca` dela:

* a §1.2 (*"os quatro chamadores de `escolher_fonte` passam pela regra 0"*) está
  **estruturalmente satisfeita**: a regra 0 mora DENTRO de `escolher_fonte`, e
  os quatro chamam aquela função. Nenhum dos quatro arquivos precisa mudar — e
  `fontes_de_captura.py` está no `nao_toca` da 02, então nem poderia. **O que
  falta da §1.2 é só a mordida nº 2**: a régua que CONTA os chamadores e nomeia
  o que ficou de fora. Ela é de teste, não de `src/`, e cabe na 02.

**A BASE ANDOU NO MEIO DO TRABALHO, e é a armadilha que a casa já tem escrita.**
Esta árvore nasceu em `ec6811aa`; enquanto o trabalho corria, `onda/atual-0609`
avançou quatro commits até `da54beb5`. Os dois ÚNICOS vermelhos que esta frente
via — `referencias-docs` (7 referências mortas a `scripts/migrar-mapa-v2.py`,
que `4cb7e97d` apagou sem atualizar a prosa) e `acentuacao` (7 violações em
`docs/data/decisoes-dela.csv:200`) — **eram herdados da base velha e já estavam
curados na nova**, por `31e7c5e2` e `eb209f42`. Nenhum dos dois tocava arquivo
desta frente.

O sintoma engana: um vermelho herdado se lê como *"o agente quebrou algo"*.
**O que revela é comparar com a base — e conferir se a base ainda é a que você
tem.** A branch foi adiantada por `git rebase onda/atual-0609`, com ZERO
sobreposição de arquivo (conferido antes), e o resultado é:

```
TODOS VERDES — 43 portões.
```

---

## OS COMANDOS, para quem quiser repetir

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/ONDA5-MIC-VIRTUAL-01-MIC
source .envrc-voo
bash scripts/bancada.sh exigir
/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python -m pytest \
    tests/unit/test_o_canal_do_microfone_tem_nome_de_controle.py \
    tests/unit/test_a_mascara_nao_alcanca_o_microfone.py \
    tests/unit/test_quem_ouve_o_microfone.py \
    tests/unit/test_mic_monitor.py \
    tests/unit/test_mic_captura_e_botao.py \
    tests/unit/test_a_placa_e_o_controle_pelo_usb_pai.py -q
```

**A prova de bancada não está versionada de propósito:** ela carrega e descarrega
módulos no PipeWire da máquina dela, e um script assim no repositório é um
convite a alguém rodá-lo sem ler. O que ela mede está inteiro aqui, e a peça toda
é reprodutível pelas réguas acima, que não tocam em áudio nenhum.
