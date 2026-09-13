# MIC-O-CANAL-DO-OUTRO-01 — o canal do outro, o órfão sem dono e o `pactl` mudo

**Árvore:** `hefesto-voo/MIC-O-CANAL-DO-OUTRO-01-opus` · branch
`voo/MIC-O-CANAL-DO-OUTRO-01-opus` · base `4b3b6879` (= `dev`) · **aparelho: não
usei.** Tudo aqui é dublê ou leitura do sistema dela sem mexer em nada (journal,
`/proc`); a prova de aparelho fica para a MESA-DE-QUATRO-01.

O despacho mandava ler uma nota «ROTA CORRIGIDA» no topo da sprint. **Ela não
existe** — nem nesta árvore nem na principal. Valeu o corpo.

## O que mudou

### Defeito 1 — o nome de outro controle diz NÃO

`integrations/fontes_de_captura.py`. As regras 0, 1 e 2 de `escolher_fonte` liam
de QUEM é um nó e só usavam a leitura para dizer SIM. Agora
`identidade_no_nome(fonte)` devolve o pedaço do endereço que o nome carrega
(canal por controle, MAC do `bluez`, rabo do MAC da ponte) e
`e_de_outro_controle(fonte, uniq)` diz quando ele é de outro. As regras 3 (USB)
e 4 (um para um) nunca devolvem esse nó.

A cura mora dentro de `escolher_fonte`, então alcança todos os chamadores de uma
vez: a eleição, a luz, o nível, o volume, o «quem ouve», o `mic_monitor` e o
canal do cabo. **O cabo não muda:** nó ALSA não tem identidade no nome, e o
`hefesto_dualsense_bt_hidraw3` (ponte sem `HID_UNIQ`) também não.

### Defeito 2 — o canal órfão sai, e SÓ ele

`daemon/subsystems/bt_mic.py` ganhou `VarredorDeCanaisOrfaos`, chamado no fim de
cada volta do `_loop` (depois do `reconciliar`, que é quem derruba pelo dono o
que tem dono). `integrations/dualsense_bt_audio.py` ganhou as três perguntas ao
servidor: `modulos_de_captura_da_casa`, `alguem_escreve_no_fifo` e
`descarregar_modulo`.

**A cura da sprint, ao pé da letra, derrubaria canal vivo** — e isso foi medido
antes de escrever. Lendo `/proc` na máquina dela às ~02:45 de 13/09, com o canal
vivo `hefesto_mic_000003` publicado pelo daemon:

```
hefesto-hefesto_mic_000003.fifo  daemon          flags=02104001  O_WRONLY
hefesto-hefesto_mic_000003.fifo  pipewire-pulse  flags=02104002  O_RDWR
```

Um processo que não é o daemon — a suíte rodando nesta máquina, ou o `mic bt`
do CLI ao lado do daemon — vê esse módulo fora da própria tabela e sem pedido.
«Prefixo `hefesto_mic_` e controle não pedido» o derrubaria. Por isso **um módulo
só sai com as quatro provas**:

1. não está de pé neste processo (tabela de `canal_do_microfone`, pontes vivas,
   canais do cabo);
2. o controle do nome não está pedido (procura, declaração ou env);
3. **ninguém segura o fifo em `O_WRONLY`** — o servidor segura em `O_RDWR` e não
   conta. Os processos ilegíveis do mesmo usuário são pulados: eram quatro na
   mesma leitura — `(sd-pam)`, dois `ssh-agent` e um `pw-record` —, nenhum
   rodando código desta casa. Tratá-los como «não sei» desligaria a varredura;
4. a mesma resposta em duas varreduras seguidas, com o mesmo id de módulo.

Os dois prefixos entram (`hefesto_mic_` e `hefesto_dualsense_bt_`): o caminho de
volta da ponte pelo nome do transporte nasce órfão pela mesma porta (ver o
defeito 3). **O varredor de verdade só nasce no `start()` junto com o
gerenciador de verdade** — sem injeção, laço de teste não varre o servidor de
som da máquina onde a suíte roda.

### Defeito 3 — o `pactl` mudo ganha RECUO, e não laço fixo

`integrations/dualsense_bt_audio.py`: `RecuoDoPactl` com o singleton `PACTL` e
`pactl_mudo()`. Um prazo estourado põe o `pactl` em recuo de 5 s, e cada novo
estouro dobra a espera até 60 s (5 → 10 → 20 → 40 → 60). Qualquer resposta zera
o recuo. O `_rodar` anota o prazo, e o `runner` de toda `SourceVirtualPipeWire`
passa por `_com_recuo`. Durante o recuo:

* `iniciar` não carrega nada. Vencido o recuo, o `list modules short` que ele já
  fazia é a sondagem, e o `load-module` só sai se ela responder;
* `estado()` responde «não sei» sem perguntar;
* `parar()` deixa o módulo para a varredura;
* o supervisor não abre canal de cabo (`_abrir_os_canais_do_cabo`) nem varre.

**A conta que o journal fecha:** a cada volta, a ponte tentava o canal por
controle (`list` + `load`, 5 s de prazo cada) e depois o nome do transporte
(mais 5 + 5 s). Nos últimos 40 minutos daquela janela foram 192
`bt_mic_load_module_falhou` para 96 `bt_mic_canal_nao_subiu` — exatamente o
dobro —, com pares a 10 s e 15 s até o próximo par. Com o recuo, dois ciclos
travando no `load-module` fazem **um** `load-module`, não quatro (régua abaixo).

**O mapa não envelheceu.** O `docs/data/mapa-controles.csv` cita linhas destes
três arquivos. As mudanças acima das âncoras são de saldo zero, e o código novo
foi para o fim dos módulos. As âncoras com nome continuam onde estavam
(`montar_pedido_de_mic` :319, `dizer_o_pedido_dela` :1205,
`_talvez_seguir_a_source` :1451, `escolher_fonte` :192,
`habilitado_por_env` :182). Uma primeira versão pôs um `import` acima da `:182`,
e `scripts/validar-citacoes-de-linha.py --all` reprovou. Hoje ele passa:
3298 citações, zero podres.

### Achado medido por quem coordena (13/09/2026), registrado a pedido

Cadeia no journal do daemon (`journalctl --user -u hefesto-dualsense4unix`):

```
01:53:43  bt_mic_hidraw_perdido (Errno 5, /dev/hidraw5) — o controle BT caiu e voltou como hidraw6
01:53:44  som_ponte_derrubada · som_sink_removido sink=hefesto_som_<hex6> · som_no_derrubado
01:53:48  bt_mic_write_falhou (Errno 19) · bt_mic_source_removida source=hefesto_mic_<hex6>
01:53:49  som_radio_ponte_de_pe (a ponte 0x35 sobe de novo no nó novo)
01:53:54  PRIMEIRO `pactl list sources short` timed out after 2.0 s + som_load_module_falhou saida=''
```

De 01:53 até 02:40: 699 prazos de `pactl` estourados e 509 `load_module_falhou`
(o som a cada 10 s, o microfone a cada ~15 s). O `pipewire-pulse` parou de
atender clientes por 47 minutos. O `pw-cli` respondia e o `pactl info` dava
rc=124; o processo tinha 38 fds, 18 conexões no socket e as três threads em
`ep_poll`. A última linha dele antes disso foi `mod.pipe-tunnel: underrun`, às
01:52:56. Na máquina dela, o VLC recusava conexão de áudio e a Steam não abria.

**Correção de quem coordena, no mesmo dia:** reiniciar SÓ o `pipewire-pulse`
(02:42:06) não devolveu o `pactl` — rc=124 três segundos depois. Ele voltou com
`pipewire`, `pipewire-pulse` e `wireplumber` reiniciados juntos (rc=0 às
02:42:18). Logo depois, a fonte padrão passou a ser a `hefesto_mic_<hex6>` do
daemon.

A hipótese de quem coordena é esta: descarregar o `module-pipe-sink` ou o
`module-pipe-source` logo depois de o controle sumir deixa o servidor sem
atender. **Medido com dublê, o que o NOSSO código manda ao servidor nessa
queda** (`GerenciadorMicBluetooth` e `PonteMicBluetooth` de verdade, todo `pactl`
dublado, controle caindo de hidraw5 para hidraw6):

```
    0.08 ms  list modules short
    0.11 ms  load-module module-pipe-source source_name=hefesto_mic_00005c file=… …
    0.20 ms  set-source-mute hefesto_mic_00005c 0
    0.21 ms  list sources short
  300.45 ms  --- o controle caiu e voltou como /dev/hidraw6 ---
  300.66 ms  unload-module 536870931
  300.80 ms  list modules short
  300.83 ms  load-module module-pipe-source source_name=hefesto_mic_00005c file=… …
  300.88 ms  set-source-mute hefesto_mic_00005c 0
```

**Numa mesma passada saem o `unload-module` e, 0,17 ms depois, o `load-module`
com o MESMO `source_name` e o MESMO caminho de fifo.** No aparelho, antes disso
ainda há o `0x32` escrito num fd morto (o Errno 19 do journal). Se é essa
sequência que trava o servidor, dublê nenhum responde.

### O que eu medi sem mexer

* **Journal de 12/09, 15:52–17:22:** 10 `bt_mic_load_module_falhou`, 30
  `audio_fonte_do_uniq_falhou` (o prazo de 2 s é o de
  `integrations/audio_control.py`, não o do microfone, que é 5 s), 5
  `bt_mic_subsystem_iniciado` e 4 `daemon_stopped`. No journal do PipeWire da
  mesma janela: 152 linhas `mod.pipe-tunnel`, 149 delas `underrun`.
* **Journal de 13/09, os 40 minutos até 02:42:** 593 `audio_fonte_do_uniq_falhou`,
  192 `bt_mic_load_module_falhou` e 96 `bt_mic_canal_nao_subiu`; a cadência está
  descrita no defeito 3.
* **Três `pactl info` meus caíram no segundo do reinício de quem coordena**
  (10,02 s rc=124; 0,09 s e 7,07 s com «Connection terminated»). Não servem de
  prova de nada, e ficam registrados só para ninguém os achar depois e
  confundir.

## Qual mordida prova

A régua é `tests/unit/test_o_canal_de_outro_controle_nao_e_meu.py` — 30 testes,
nenhum fala com o servidor de som. Cada cura foi arrancada por patch (`git apply`),
a seção rodou, e o patch foi desfeito com `md5sum -c` conferindo os três arquivos.

**Defeito 1** — `usb.casar(fontes, …)` no lugar de `sem_nome_alheio`, e o
`if not sem_nome_alheio: return None` comentado:

```
FAILED ...::test_o_no_do_vizinho_sozinho_na_lista_nao_e_dele[hefesto_mic_00009e]
FAILED ...::test_o_no_do_vizinho_sozinho_na_lista_nao_e_dele[hefesto_dualsense_bt_00009e]
FAILED ...::test_o_no_do_vizinho_sozinho_na_lista_nao_e_dele[bluez_input.E8_47_3A_00_00_9E.0]
FAILED ...::test_o_casamento_usb_nao_entrega_no_com_nome_alheio
FAILED ...::test_a_eleicao_pede_o_canal_dele_em_vez_de_eleger_o_do_vizinho
E       AssertionError: o um-para-um entregou hefesto_mic_00009e ao controle errado
5 failed, 6 passed, 19 deselected in 0.36s
```

**Defeito 2, o laço** — `self._varrer_os_orfaos(nos)` trocado por `pass`:

```
E       AssertionError: o laço do supervisor não varre: o canal do controle que saiu fica para sempre
E       assert [] == ['536870939']
1 failed in 0.33s
```

**Defeito 2, a prova do escritor** — o `if alguem_escreve(...) is not False`
trocado por `if False`:

```
FAILED ...::test_canal_com_escritor_fica_mesmo_sem_pedido
FAILED ...::test_nao_sei_nunca_derruba
E       AssertionError: derrubou um canal que alguém estava enchendo
2 failed in 0.33s
```

**Defeito 3, o recuo antes do `load-module`** — os dois `pactl_mudo()` de
`_orfaos_se_o_pactl_responde` trocados por `False`:

```
FAILED ...::test_load_module_que_estoura_o_prazo_nao_se_repete_no_ciclo_seguinte
FAILED ...::test_vencido_o_recuo_a_sondagem_vem_antes_do_load
FAILED ...::test_o_supervisor_nao_repete_o_load_module_no_ciclo_seguinte
E       AssertionError: o ciclo seguinte perguntou ao servidor mudo
E       assert 4 == 2
3 failed in 0.36s
```

**Defeito 3, o canal do cabo** — o `if pactl_mudo()` de
`_abrir_os_canais_do_cabo` trocado por `False`:

```
E       AssertionError: o supervisor perguntou ao servidor mudo pelo canal do cabo
E       assert ['fontes'] == []
1 failed in 0.34s
```

**Com as curas devolvidas:**

```
src/hefesto_dualsense4unix/integrations/fontes_de_captura.py: SUCESSO
src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py: SUCESSO
src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py: SUCESSO
30 passed in 0.42s
```

**E o que já existia:** os 55 arquivos de `tests/unit/` que importam
`fontes_de_captura`, `dualsense_bt_audio`, `bt_mic`, `canal_do_microfone`,
`eleicao_de_microfone` ou `mic_monitor` rodaram num processo só, e deram
`1044 passed, 1 xfailed`. O rc=1 da corrida veio do CANARIO-FS-01, que viu nascer
um instantâneo de histórico de perfil na configuração real dela às 03:06:16.
Nenhum teste da árvore cita aquele perfil, e no mesmo segundo o daemon e a
interface dela estavam escrevendo (`interface.log`, `launch_env/`,
`speaker_volume_set` no journal). Ruff limpo em `src/` e `tests/`; mypy estrito
limpo nos três arquivos.

## O que NÃO verifiquei

* **Nada no aparelho.** Nenhum controle caiu na bancada, ninguém falou no
  microfone, e o critério «por BT» da sprint — `nivel_do_mic_abriu` com a fonte do
  próprio `uniq` depois de outro controle sair — continua sem medida.
* **A causa do travamento do servidor.** Nem as duas hipóteses da sprint nem a de
  quem coordena foram separadas. O recuo e a varredura param de martelar e limpam
  o que sobra; não impedem o travamento.
* **Se o `module-pipe-tunnel` apaga o fifo ao ser descarregado.** Se apagar, a
  sequência de 0,17 ms acima corre o risco de o descarregamento do módulo velho
  apagar o caminho do novo. É hipótese, não medida.
* **O defeito 4 (a voz picotada).** Os quadros por segundo não foram contados;
  só contei os `underrun` no journal.
* **Que o servidor abra o fifo em `O_RDWR` em outras versões do PipeWire.** Medi
  só a desta máquina, e a prova 3 depende disso.
* **A varredura rodando de verdade.** O daemon dela roda o código do `dev`; nenhum
  módulo foi descarregado na máquina dela por mim nem por teste.
* A suíte inteira e os portões fora do `scripts/portoes.sh` — o resultado dos
  portões está no commit.

## O que sobrou para o próximo

1. **MESA-DE-QUATRO-01:** o Passo 1 da sprint (`time pactl info` em laço com o
   canal de pé e o controle caindo), a contagem de quadros e a orelha dela. A
   sequência dublada acima é o roteiro do que observar no servidor na queda.
2. **O som tem a mesma cadência e nenhum recuo.**
   `integrations/alto_falante_bt.py` registrou `som_load_module_falhou` a cada 10 s
   durante os 47 minutos. O arquivo não é desta posse; o recuo pronto é
   `dualsense_bt_audio.pactl_mudo()`, e o `_rodar` de lá é outro.
3. **`integrations/audio_control.py`:** 593 prazos de 2 s em 40 minutos
   (`audio_fonte_do_uniq_falhou`), sem recuo nenhum.
4. **`tests/conftest.py`:** `_nenhum_modulo_de_som_de_verdade` protege só o
   `alto_falante_bt._rodar`. O `dualsense_bt_audio._rodar` não tem guarda para
   `load-module`/`unload-module`, e uma `SourceVirtualPipeWire` construída num
   teste sem `runner` fala com o servidor real. Também convém zerar
   `dualsense_bt_audio.PACTL` por teste: um prazo real estourado durante a suíte
   poria o recuo em quem vem depois.
5. **A eleição** (`nao_toca` aqui): depois do reinício de quem coordena, a fonte
   padrão do sistema virou o canal do daemon, sem ninguém apertar botão.
6. **O mapa:** a célula `audio.microfone@dualsense` já citava endereços velhos
   ANTES desta sprint, e sem nome que o portão leia — `bt_mic.py:179`, `:245`,
   `:260`, `:468`, `:501` e `dualsense_bt_audio.py:1013`, `:1155`. É trabalho de
   reapontar por símbolo, para a SPECS-A-PROCEDENCIA-01.
7. **§2 da sprint:** dois microfones no ar ao mesmo tempo continuam fora — trocar
   a eleição é a palavra dela.
