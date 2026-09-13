# SOM-RECUO-01 — o som e o volume param de martelar o servidor mudo

**Árvore:** `hefesto-voo/SOM-RECUO-01-opus` · branch `voo/SOM-RECUO-01-opus` · base
`846a10e5` (= `onda/1309`, com a MIC-O-CANAL-DO-OUTRO-01 costurada) · **aparelho:
não usei.** Tudo aqui é dublê. O único contato com o sistema dela foi LER o
journal do daemon. Nenhum teste e nenhum comando meu falou com o servidor de som:
toda corrida de pytest desta sprint rodou com um `PATH` cujo `pactl` e `wpctl`
são dublês que saem com rc=0 sem conectar em nada.

A sprint não traz nota «ROTA CORRIGIDA». Valeu o corpo.

## O que mudou

### O que o journal diz, lido sem mexer

`journalctl --user -u hefesto-dualsense4unix`, de 01:53:30 a 02:42:30 de 13/09:

```
291  som_load_module_falhou      (cada um seguido de som_no_nao_subiu)
232  bt_mic_load_module_falhou
715  audio_fonte_do_uniq_falhou
```

O som falhou a cada 10 s exatos (01:53:54,47 · 01:54:04,48 · 01:54:14,50…), que é
`RECONCILIA_S` (5 s) mais o prazo do `load-module` (5 s). Então, naquele
incidente, nenhuma leitura do `rota_do_no` estourou antes do `load-module`: o
controle era o do rádio. As leituras entram na cura mesmo assim (ver o item 2),
porque no cabo e na fonte «mix» elas vêm antes do `load-module` a cada ciclo.

### 1. Um recuo só — e ele não mudou de módulo

`RecuoDoPactl` / `PACTL` / `pactl_mudo()` continuam em `dualsense_bt_audio.py`. A
sprint mandava mover o recuo se houvesse ciclo ou peso de import, e foi medido
antes de decidir: `alto_falante_bt` já importava `dualsense_bt_audio` no topo, e o
import preguiçoso a partir do `audio_control` custa **12,5 ms uma vez por
processo** (`python -X importtime`), sem ciclo. O módulo pequeno não foi preciso.

No `RecuoDoPactl`, tudo no fim do módulo:

* `perguntar(runner, argv)` virou o dono único do contrato do runner — o
  `_com_recuo` do microfone passou a chamá-lo, e o som usa o mesmo;
* `zerar()` volta ao estado de nascença sem escrever no log uma volta que não
  houve (é o que a suíte chama);
* os eventos passaram a `pactl_mudo` / `pactl_voltou`. O `bt_mic_` do nascimento
  ficou falso quando o som e o volume começaram a estourar o prazo ali.

### 2. O som — `integrations/alto_falante_bt.py`

* `_rodar` anota no recuo o prazo estourado de um `pactl`, e rc=0 o zera;
* `SinkVirtualPipeWire.runner` passa por `_com_o_recuo` (o mesmo `perguntar`);
* `iniciar()`: sem `pactl`, com o recuo em curso, ou com um recuo vencido cuja
  sondagem (`pactl info`) não respondeu, **nada sai**. Sem recuo nenhum não há
  sondagem: o caminho de todo dia não ganhou pergunta;
* `_ligar_a_rota()`: o primeiro `module-loopback` que estoura o prazo para a rota
  inteira;
* `estado()`: em recuo, «não sei» sem perguntar;
* `sink_do_controle()` e `monitor_da_saida_padrao()`: em recuo, `""` sem
  perguntar — o mesmo `""` que o prazo estourado já devolvia, só que na hora.

**`parar()` NÃO passa pelo recuo, e é decisão desta sprint.** O microfone deixa o
módulo para o `VarredorDeCanaisOrfaos` quando o servidor está mudo; o som não tem
varredor, e um `module-null-sink` deixado para trás é o fantasma de 07/09. O
descarregamento paga o prazo uma vez por queda, não por ciclo. Está escrito na
docstring de `_o_servidor_atende`.

O código novo mora no fim do módulo. As mudanças acima das âncoras (`:268`,
`:455` e `:523` do mapa, `:1516` do `ensaios.csv`) têm saldo zero.

### 3. O volume — `integrations/audio_control.py`

Todo `subprocess.run` do módulo passou a `_rodar_pelo_recuo`, uma linha trocada
por uma linha — as âncoras `:250` e `:314` do mapa não se moveram. Em recuo ele
levanta `PactlEmRecuoError`, filha de `subprocess.SubprocessError`, e cada função
devolve NA HORA o «não sei» que já tinha para o prazo estourado (`None`, `False`
ou o último estado conhecido). O prazo estourado entra no recuo; rc=0 zera; rc≠0
não zera (`Connection refused` também é rc≠0). A pergunta que o recuo segurou vira
`debug`, e não `warning`: sem isso a cura trocaria 715 esperas por 715 avisos.

**O `wpctl` ficou fora do recuo, de propósito:** ele fala o protocolo nativo do
PipeWire, não o `pipewire-pulse` que travou (quem coordena mediu o `pw-cli`
respondendo com o `pactl info` em rc=124).

### 4. A suíte — `tests/conftest.py`

* `_nenhum_modulo_de_som_de_verdade` guarda os DOIS `_rodar` que carregam módulo:
  o do `alto_falante_bt` e o do `dualsense_bt_audio`;
* `_recuo_do_pactl_zerado` (autouse, por teste) zera o `PACTL` no lugar, antes e
  depois de cada teste.

### Achado no caminho: dois dublês mais pobres que o `CompletedProcess`

`tests/unit/test_mic_da_mesa_cheia_01.py` e
`tests/unit/test_o_volume_do_mic_nao_cai_no_vizinho.py` dublam `subprocess.run`
com um objeto que só tem `stdout`. A primeira versão de `_rodar_pelo_recuo` lia
`proc.returncode` e derrubou 13 testes deles:

```
13 failed, 1842 passed, 1 xfailed
E       AssertionError: '_Saida' object has no attribute 'returncode'   (13 vezes)
```

Os dois arquivos não são desta posse. O helper lê
`getattr(proc, "returncode", 0)`, com o motivo num comentário ao lado.

## Qual mordida prova

A régua é `tests/unit/test_o_som_e_o_volume_respeitam_o_recuo.py`: 23 testes,
nenhum fala com o servidor de som. Cada cura foi arrancada por um script (troca
exata de um trecho único, pytest da seção, conteúdo original devolvido), e no fim
`md5sum -c` conferiu os quatro arquivos: `SUCESSO` nos quatro.

**1a — a espera e a sondagem do som** (`_o_servidor_atende` reduzido a `return True`):

```
E       AssertionError: ['load-module', 'load-module']
E       assert 2 == 1
E       AssertionError: o load-module saiu sem a sondagem responder
FAILED ...::test_dois_ciclos_com_o_load_module_estourando_fazem_um_load_module
FAILED ...::test_vencido_o_recuo_a_sondagem_vem_antes_do_load
FAILED ...::test_prazo_estourado_no_microfone_cala_o_som_no_ciclo_seguinte
3 failed, 20 deselected in 2.07s
```

**1b — o `_rodar` do som anota o prazo** (`_anotar_o_prazo(argv, exc)` arrancado):

```
E       AssertionError: o prazo estourado no `_rodar` do som não entrou no recuo
FAILED ...::test_o_rodar_do_som_anota_o_prazo_e_a_resposta
1 failed, 22 deselected in 0.31s
```

**1c — a rota para no primeiro prazo** (o `if _o_recuo().mudo()` do gerador arrancado):

```
E       AssertionError: o segundo loopback foi para a fila do servidor mudo
E       assert 2 == 1
1 failed, 22 deselected in 0.31s
```

**1d — o estado em recuo** (`or _o_recuo().mudo()` arrancado):

```
E       AssertionError: o estado perguntou ao servidor em recuo
E         Left contains one more item: ['pactl', 'list', 'sinks', 'short']
1 failed, 22 deselected in 0.30s
```

**1e — as leituras da rota** (as duas recusas de `sink_do_controle` e
`monitor_da_saida_padrao` arrancadas):

```
E       AssertionError: a rota perguntou ao servidor em recuo
E         Left contains 4 more items, first extra item: ['pactl', 'list', 'sinks', 'short']
1 failed, 22 deselected in 0.32s
```

**2 — o compartilhamento** (`alto_falante_bt._o_recuo` e o `PACTL` de
`_rodar_pelo_recuo` trocados por um recuo PRÓPRIO de cada módulo):

```
E       AssertionError: o microfone perguntou ao servidor que o som acabou de ver mudo
E         Left contains 3 more items, first extra item: ['pactl', 'list', 'modules', 'short']
E       AssertionError: o microfone perguntou ao servidor que o volume viu mudo
FAILED ...::test_prazo_estourado_no_som_cala_o_microfone_no_ciclo_seguinte
FAILED ...::test_prazo_estourado_no_volume_cala_o_microfone_e_o_som
2 failed, 1 passed, 20 deselected in 0.33s
```

O que passou é `test_prazo_estourado_no_microfone_cala_o_som_no_ciclo_seguinte`,
e ele tem de passar: o recuo próprio do som está vazio e o microfone ainda escreve
no `PACTL` — quem o derruba é a mordida 1a.

**3 — o `if PACTL.mudo()` do volume** (trocado por `if False`):

```
E       AssertionError: a fonte do uniq esperou 1.00 s pelo servidor em recuo
E       assert 1.0003628529993875 < 0.3
E       AssertionError: fonte_de_captura_do_uniq perguntou ao servidor em recuo
E       AssertionError: fonte_de_captura_do_controle perguntou ao servidor em recuo
E       AssertionError: definir_volume_da_captura perguntou ao servidor em recuo
E       AssertionError: volume_da_captura perguntou ao servidor em recuo
E       AssertionError: AudioControl.fonte_padrao_e_o_controle perguntou ao servidor em recuo
E       AssertionError: AudioControl.toggle_default_source_mute perguntou ao servidor em recuo
E       AssertionError: a pergunta segurada virou aviso
8 failed, 15 deselected in 8.36s
```

**4a — a guarda do `dualsense_bt_audio._rodar`** (a tupla da conftest reduzida a
`(alto_falante_bt,)`):

```
E       AssertionError: a suíte carregou ou descarregou módulo no servidor: [['pactl', 'load-module', 'module-pipe-source', 'source_name=hefesto_mic_00005c', …
E         Left contains 4 more items
FAILED ...::test_a_source_sem_runner_nao_carrega_modulo_no_servidor_de_verdade
1 failed, 22 deselected in 0.30s
```

**4b — o `zerar()` por teste** (os dois `zerar()` da fixture arrancados):

```
E       AssertionError: o recuo sujo do teste anterior chegou a este
E       assert 5.0 == 0.0
FAILED ...::test_e_o_teste_seguinte_nasce_com_o_recuo_zerado
1 failed, 1 passed, 21 deselected in 0.32s
```

**Com as curas devolvidas:**

```
src/hefesto_dualsense4unix/integrations/alto_falante_bt.py: SUCESSO
src/hefesto_dualsense4unix/integrations/audio_control.py: SUCESSO
src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py: SUCESSO
tests/conftest.py: SUCESSO
23 passed in 0.32s
```

**E o que já existia:** os 98 arquivos de `tests/unit/` que citam `audio_control`,
`alto_falante_bt`, `SinkVirtualPipeWire`, `dualsense_bt_audio`, `audio_saida`,
`bt_mic`, `canal_do_microfone`, `eleicao_de_microfone` ou `mic_monitor` rodaram
num processo só, depois da cura dos dublês pobres: `1855 passed, 1 xfailed`. O
CANARIO-FS-01 só AVISOU (não é portão): o `interface.log` e o `kernel.log` do
daemon dela cresceram durante a corrida. `ruff check src/ tests/` limpo; mypy
estrito limpo nos três módulos; `scripts/validar-citacoes-de-linha.py --all`:
3298 citações, zero podres — e nenhuma linha citada dos três módulos mudou de
conteúdo, conferido linha a linha contra `HEAD`.

## O que NÃO verifiquei

* **Nada no aparelho nem no servidor dela.** Nenhum `pactl` travou de verdade
  diante desta cura; a cadência nova (um `load-module`, depois uma sondagem a
  5 → 10 → 20 → 40 → 60 s) é medida com relógio de mentira.
* **A causa do travamento.** A cura para de agravar; não impede.
* **Que o `wpctl` responda com o `pipewire-pulse` travado.** Quem coordena mediu
  o `pw-cli`; o `wpctl` fala o mesmo protocolo, mas não foi medido.
* **Que um `unload-module` mandado ao servidor travado não piore o travamento.**
  O `parar()` do som continua mandando (ver a decisão no item 2), e a hipótese de
  quem coordena é justamente sobre descarregar módulo na queda.
* **Várias sondagens ao mesmo tempo.** Vencido o recuo, o som, o microfone e o
  volume podem perguntar juntos, cada um com o seu prazo. O recuo não serializa a
  primeira pergunta; o desenho do microfone também não serializava.
* **Os eventos renomeados no journal.** `pactl_mudo` / `pactl_voltou` não
  aparecem em journal nenhum ainda: o daemon dela roda outro código.
* **A suíte inteira** — rodei só os 98 arquivos acima. O resultado de
  `scripts/portoes.sh` está no commit desta entrega.

## O que sobrou para o próximo

1. **MESA-DE-QUATRO-01:** com o servidor travando de verdade, contar no journal os
   `load-module` do som e do microfone por minuto (a conta desta cura é UM, e
   depois uma sondagem por recuo) e os `audio_fonte_do_uniq_falhou` como
   `warning` (a conta é zero enquanto o recuo durar).
2. **Os `pactl` fora desta posse que não passam pelo recuo** (contados por
   `grep '"pactl"'`): `app/audio_saida.py` (16 menções; `rodar_leitura` com 2 s
   de prazo), `app/mic_monitor.py` (5), `integrations/eleicao_de_microfone.py`
   (4), `integrations/quem_ouve_o_microfone.py` (2), `interface/controles_vivos.py`
   (2), `integrations/canal_do_microfone.py` (`_rodar_pactl`, `set-source-mute`),
   `interface/pacotes/a02_controles.py` e `daemon/subsystems/hotkey.py`. O
   `audio_control._rodar_pelo_recuo` é o molde.
3. **O som não tem varredor de órfão.** Um `module-null-sink` ou `module-loopback`
   que fique no servidor (processo morto, descarregamento sem resposta) não sai
   sozinho, e o `iniciar` não pergunta se já há um com o mesmo `sink_name` — o
   microfone pergunta. Com varredor, o `parar()` do som poderia deixar o módulo
   em recuo, como o microfone.
4. **Os dois dublês pobres** (`test_mic_da_mesa_cheia_01.py` e
   `test_o_volume_do_mic_nao_cai_no_vizinho.py`): trocar o `_Saida` por
   `subprocess.CompletedProcess` e tirar o `getattr` de `_rodar_pelo_recuo`.
5. **A frase da rota com o servidor mudo.** No cabo, `rota_do_no` sem resposta do
   servidor devolve `MOTIVO_NO_SEM_PLACA_NO_CABO` — já era assim com o prazo
   estourado, e continua assim em recuo. A frase é falsa nesse caso; texto de
   tela é dela.
6. **O mapa** (para a SPECS-A-PROCEDENCIA-01): `audio.alto_falante@dualsense`,
   `audio.microfone@dualsense` e `audio.microfone.volume@dualsense` — todas
   exercitadas só por dublê, sem degrau nenhum da escada.
7. **Para quem coordena — o scratchpad é COMPARTILHADO entre os agentes da
   sessão, e isso cruzou duas entregas.** Chamado com um ARQUIVO de destino, o
   `scripts/sanitizar_saida_de_agente.py` o trata como PASTA e grava
   `DESTINO/<nome>`: a minha entrega nasceu em
   `…/SOM-RECUO-01-opus.md/SOM-RECUO-01-opus.md`. Dentro dessa pasta apareceu
   também um `FLAKE-DO-PISCA-opus.md` de 03:37 que não é meu, e ele **não é
   cópia da entrega final** daquele agente (md5 `a3d3013f…` contra `dae553eb…`
   da árvore dele e da `_integra-1309`). Não descobri como ele chegou ali. Não
   foi apagado nem commitado: está preservado, com o md5 conferido, no
   scratchpad da sessão como
   `FLAKE-DO-PISCA-opus.md.achado-na-arvore-SOM-RECUO-01-0313`, e saiu da minha
   árvore.
