# OS-QUATRO-NO-AR-01 — os quatro microfones e os quatro alto-falantes ao mesmo tempo

**Árvore:** `hefesto-voo/hefesto-voo/OS-QUATRO-NO-AR-01-opus` · branch
`voo/OS-QUATRO-NO-AR-01-opus` · base `1ec69f98` (= `onda/1309`, conferido) ·
**aparelho: não usei.** Ela estava jogando com o daemon vivo, e o adendo de quem
coordena proíbe tocar o servidor de som e o hidraw dos controles dela. Nenhuma
prova de aparelho foi tentada, e por isso o `bancada.sh exigir` não foi chamado
(o `status` deu LIVRE na partida). Tudo abaixo é dublê. A prova com dois
controles no rádio fica para a MESA-DE-QUATRO-01.

O despacho mandava ler uma nota «ROTA CORRIGIDA» no topo da sprint. **Ela não
existe**, e valeu o corpo. A decisão citada no topo da sprint é dela; o desenho
do §1 é de quem coordena, por delegação, e é assim que ele está escrito no
código.

## O que mudou

### §1 — perder o padrão não é mais sair do ar

A porta era a que a sprint nomeou: `hotkey._apagar_a_luz_de_quem_perdeu_o_canal`
apagava a luz do ex-dono do padrão e chamava `esquecer_a_palavra`, e o
`bt_mic` escrevia `0x32 ligar=False` no controle dele.

`daemon/subsystems/hotkey.py`:

* **`MicrofonesNoAr`**: quem está no ar, em ordem de chegada, pendurado na
  sessão do daemon (`_no_ar_da_sessao`, no molde do `_eleitor`). Só entra quem
  o ato CONFERIU. A lista não mora no `EleitorDeMicrofone`, porque a eleição
  decide só o padrão (CANAL-POR-CONTROLE-01). Também não é a palavra do
  registro: a palavra é o pedido que a ponte obedece, e esta lista é a
  pós-condição, com a ordem que decide quem herda o padrão. Nada vai ao disco.
* **`_eleger_ou_devolver`** passou a separar os quatro gestos:

  | gesto | o que acontece |
  | --- | --- |
  | liga um apagado | eleição de sempre; se conferida, entra no ar e vira o padrão; os outros no ar ficam |
  | desliga o padrão | o padrão passa ao último ligado que continua no ar (`_passar_o_padrao_ou_devolver`, pela `eleger_o_controle` de sempre); sem ninguém, `devolver_o_microfone` como antes |
  | desliga quem está no ar sem ser o padrão | só ele sai do ar, a luz dele apaga, nenhum `set-default-source`; recado `devolver`, `ok`, sem frase |
  | desliga quem não está no ar nem é o padrão | a recusa de sempre, com o texto de sempre |

  A comparação entre o eleito e quem apertou passou a ser **normalizada**
  (`_mesmo_controle`). A tela manda `aa:bb:…` e o plástico manda `aabb…`, e
  medido com dublê, o eleito que desligava pelo plástico recebia a recusa de
  quem não elegeu.
* **`_apagar_a_luz_de_quem_perdeu_o_canal`** ganhou a guarda: o ex-dono que
  continua em `MicrofonesNoAr` fica com a luz e a palavra.
* **`_conferir_quem_saiu_do_ar`**, no fim de cada volta do
  `canal_do_microfone_loop`, cobre o caso «a ponte de A cai». Tira do ar quem
  saiu DE FATO, com duas leituras seguidas sem canal
  (`LEITURAS_SEM_CANAL_ATE_SAIR = 2`), porque uma só é a janela da reconexão de
  rádio. Um canal lido como publicado prova que está de pé. Sem ele, a pergunta
  vai a `eleicao_de_microfone.canal_publicado`, que separa «não há» (`False`)
  de «não sei» (`None`: `pactl` mudo, ou nó ALSA anônimo sem casamento USB).
  «Não sei» nunca tira ninguém do ar. Quem sai perde a palavra e a luz, e os
  outros não são tocados.

`integrations/eleicao_de_microfone.py`: `canal_publicado` e
`_fontes_de_captura_ou_nada`. `fontes_de_captura_agora` passou a usar essa
leitura, ficando uma leitura só. Também mudou o docstring de
`esquecer_a_palavra`, para dizer quem chama agora.
`daemon/subsystems/bt_mic.py`: só docstrings, pela mesma razão.

### §1.4 — a aba Controles

**Medido antes de mexer**, pelo caminho do produto (laço do canal →
`IpcHandlersMixin._merge_audio` → `a02_controles.selo_composto`), com o código
da base, depois de ligar P1 e P4:

```
{'aa:bb:cc:00:00:a1': 'MUDO', 'aa:bb:cc:00:00:b7': 'MUDO', 'aa:bb:cc:00:00:d9': 'ATIVO'}
```

O `canal_ativo` só valia para a fonte padrão, e o selo do outro microfone no ar
dizia MUDO. Agora `hotkey._ler_o_canal_deste` acende `canal_ativo` também para
quem está em `MicrofonesNoAr` **e** tem o canal lido. A chave publicada é a
mesma, e o `ipc_handlers.py` não foi tocado. Em `a02_controles.py` mudou só a
linha que documenta a face (`#   canal_ativo …`).

### §2 — o som fechou sem código

Pelo fonte, o `AltoFalanteSubsystem._casar_as_pontes` e o
`GerenciadorDeNosDeSom` constroem um nó e uma `PonteDeSomPorRadio` por `uniq`.
Cada ponte lê o monitor do próprio nó e pergunta pelo microfone do próprio
controle a cada report (`functools.partial(o_microfone_esta_no_ar, uniq)`). Os
globais de `alto_falante_bt.py` são a libopus carregada e o gancho da fonte,
que responde por `uniq`. **Não há regra de um-por-vez.** A régua nova fica
como prova, e nenhum dos três arquivos com a SOM-RECUO-01 em voo foi tocado.

### Réguas antigas que cobravam o um-de-cada-vez (fora da posse; mudaram de contrato)

* `tests/unit/test_o_gesto_dela_poe_o_microfone_no_ar.py`:
  `test_a_luz_do_ex_dono_e_a_palavra_dele_caem_no_mesmo_gesto` passou a se
  chamar `test_perder_o_padrao_nao_apaga_a_luz_nem_a_palavra_do_ex_dono`, e o
  docstring de `test_perder_a_eleicao_esquece_a_palavra_e_nao_a_nega` foi
  ajustado.
* `tests/unit/test_mic_a_recusa_da_eleicao_chega_a_tela.py`:
  `…_j1_apaga_quando_o_gesto_do_j2_tira_o_canal_dela` passou a se chamar
  `…_j1_fica_quando_o_gesto_do_j2_da_o_padrao_a_um_terceiro`, e
  `…_j1_apaga_quando_o_j2_ganha_o_canal_de_verdade` passou a se chamar
  `…_j1_fica_acesa_quando_o_j2_ganha_o_padrao`. As duas levam nota «FATO
  SUBSTITUÍDO».

### Uma citação de linha reapontada

A corrida de escopo pegou `tests/unit/test_portao_o_par_com_metade_ligada.py`:
`daemon/subsystems/__init__.py:53` citava `hotkey.py:2103` para
`HotkeySubsystem`, que desceu para 2372. O arquivo não está no `nao_toca:`, e
a própria régua manda reescrever o número no lugar. O número novo foi medido
pelo símbolo (`grep -n "^class HotkeySubsystem"`).

**As âncoras do mapa não apodreceram.** Os saldos são zero acima de
`hotkey.py:1444`, de `eleicao_de_microfone.py:217` e de `bt_mic.py:501`, e o
código novo foi para o fim. `scripts/validar-citacoes-de-linha.py --all`
confere 3298 citações, zero podres, antes e depois.

## Qual mordida prova

As réguas são `tests/unit/test_os_quatro_microfones_ficam_no_ar.py` (11 testes)
e `tests/unit/test_os_quatro_alto_falantes_tocam_juntos.py` (4). O ato é o do
produto (`hotkey.ligar_o_microfone`), com o `EleitorDeMicrofone`, o registro da
palavra, o `BtMicSubsystem` e as pontes de som do produto (secas). Nas duas, uma
fixture troca `subprocess.run` e `subprocess.Popen` por uma recusa, e nenhum
`pactl` chega ao servidor.

**Com o código da base** (a régua escrita antes da cura): `11 failed in 0.69s`.
Entre as falhas estão `ligar o segundo microfone tirou o primeiro do ar:
{'aabbcc0000d9': True}`, a recusa de sempre ao desligar quem estava no ar, e o
selo MUDO acima.

**Cada cura arrancada** (troca exata no fonte, pytest, devolução conferida por
md5; o script ficou no scratchpad como `OS-QUATRO-morder_todas.py`):

| mordida | o que arranquei | reprovou |
| --- | --- | --- |
| B1 | a guarda `_no_ar_da_sessao(daemon).esta(dono_antes)` | 9 failed: `ligar o segundo microfone tirou o primeiro do ar: {'aabbcc0000d9': True}` (e as três réguas antigas reescritas) |
| B2 | os candidatos de `_passar_o_padrao_ou_devolver` | 2 failed: `assert None == 'aa:bb:cc:00:00:b7'` |
| B3 | o ramo «fora do padrão e no ar» | 2 failed: `o microfone da mesa está com outro controle: só quem elegeu pode devolvê-lo…` |
| B4 | a comparação normalizada | 1 failed: `assert 'aa:bb:cc:00:00:a1' is None` |
| B5 | a chamada a `_conferir_quem_saiu_do_ar` no laço | 1 failed: `assert ['aa:bb:cc:00…:cc:00:00:d9'] == ['aa:bb:cc:00:00:d9']` |
| B6 | `canal_publicado` devolvendo `False` com `rc != 0` | 1 failed: `assert [] == ['aa:bb:cc:00…:cc:00:00:d9']` |
| B7 | uma leitura sem canal bastando | 1 failed: `uma leitura sem canal tirou A do ar — a reconexão de rádio derrubaria o microfone dela` |
| B8 | o `canal_ativo` de quem está no ar | 1 failed: `{'aa:bb:cc:00:00:a1': 'MUDO', …, 'aa:bb:cc:00:00:d9': 'ATIVO'}` |
| B9 | entrar no ar sem o ato conferido | 1 failed: `assert ['aa:bb:cc:00…:cc:00:00:d9'] == ['aa:bb:cc:00:00:a1']` |
| B10 | o `com_microfone=` da ponte de som (`alto_falante.py`, devolvido) | 2 failed: `{'aa:bb:cc:00:00:a1': False} != {'aa:bb:cc:00:00:a1': True}` |
| B11 | cada ponte lendo o monitor do nó do primeiro controle | 2 failed: `uma ponte ficou com o monitor do nó de outro controle: [('aa:bb:cc:00:00:a1', 'hefesto_som_0000a1'), ('aa:bb:cc:00:00:d9', 'hefesto_som_0000a1')]` |

A B10 reprovou primeiro por `KeyError: 'com_microfone'` no dublê. O motivo era
errado, e o dublê passou a usar o padrão lido da assinatura da ponte do
produto. Aí ela reprovou pelo bit, que é o que está na tabela.

**Com as curas no lugar:** `11 passed` + `4 passed`. A corrida de escopo tinha
78 arquivos de `tests/unit/`, todos os que importam `hotkey`, `bt_mic`,
`luz_do_mic`, `mic_da_mesa`, `recado_do_microfone`, `alto_falante`,
`eleicao_de_microfone` ou `a02_controles`. Ela deu `1 failed, 1488 passed in
301.54s`, e a falha única era a citação acima. Depois de reapontar: `78
passed` na régua da citação, nas duas novas e nas duas reescritas. Ruff limpo
em `src/` e nos testes tocados, e mypy limpo em `hotkey.py` e
`eleicao_de_microfone.py`.

## O que NÃO verifiquei

* **Nada no aparelho.** Dois controles no rádio com quadros de áudio chegando
  dos dois ao mesmo tempo, o `0x32` dos quatro, e a banda do rádio com quatro
  microfones e quatro alto-falantes juntos (o cabeçalho de `bt_mic.py` mede
  ~106 quadros/s por controle dividindo o link).
* **A luz do plástico em produção.** Quem pinta a luz a 4 Hz é o
  `luz_do_mic`, e ele sobrescreve a escrita da borda no tique seguinte. Medido
  aqui, em `luz_do_mic.decidir`:

  ```
  no ar, sem app ouvindo o canal dele -> 0
  no ar, um app gravando do canal dele -> 1
  no ar, canal sem leitura (None)     -> None
  ```

  Com dois no ar e um app gravando só do padrão, a luz do outro apaga no
  plástico, embora o microfone dele esteja no ar. A sprint pede «aceso = este
  mic está no ar»; o `luz_do_mic` cumpre o contrato da LUZ-DO-MIC-01, «aceso =
  algum app com o microfone deste controle aberto». Não mexi no `luz_do_mic`.
  A pergunta está no fim.
* **A tela de verdade.** Não abri o piloto nem tirei foto: a janela lê o
  daemon vivo dela, que roda o código da árvore dela, e a foto mediria o
  antes. A medida da tela foi pela função do pacote (`selo_composto`),
  alimentada pelo `_merge_audio` do IPC.
* **A janela real da reconexão de rádio.** As duas leituras a cada
  `CANAL_TTL_S` (2 s) não foram confrontadas com uma renumeração de hidraw de
  verdade.
* **A latência da passagem do padrão.** Se o candidato perdeu o canal e o
  laço ainda não viu, `eleger_o_controle` pede o canal e espera até 3 s
  (`ESPERA_DO_CANAL_*`) dentro do toque. Não medi.
* A suíte inteira. Os portões estão no commit.

## O que sobrou para o próximo

1. **MESA-DE-QUATRO-01:** a prova do §3, com `bancada.sh exigir` rc=0: dois,
   depois quatro, no rádio, com quadros dos dois; desligar o padrão e ver o
   `set-default-source` ir ao último no ar; a ponte de um caindo sem apagar a
   luz do outro.
2. **Prosa fora da posse que caducou com esta sprint:**
   * `integrations/dualsense_bt_audio.py:1507` (`_talvez_seguir_a_source`) diz
     que o pedido dela «morre quando ela perde a eleição para outro controle».
     O arquivo está com a SOM-RECUO-01; não toquei.
   * `daemon/subsystems/recado_do_microfone.GESTOS` descreve `devolver` como
     «o ELEITO foi a mudo»; agora ele também é quem sai do ar sem ser o padrão.
   * `tests/unit/test_a_aba_02_controles_fecha_as_linhas.py:164`: a razão
     escrita («não é a fonte ativa») envelheceu, e a asserção continua certa.
   * O nome `canal_ativo` passou a querer dizer «no ar». Renomear exige o
     `ipc_handlers.py`.
3. **O mapa** (SPECS-A-PROCEDENCIA-01): a célula `audio.microfone@dualsense`
   diz que a palavra «morre quando ela perde a eleição para outro controle —
   quem apaga é … (`hotkey.py:1859`, `_apagar_a_luz_de_quem_perdeu_o_canal`)».
   Isso caiu. Hoje ela morre quando o microfone sai do ar de fato
   (`hotkey._conferir_quem_saiu_do_ar`).
4. **O padrão quando o canal DO PADRÃO cai sem gesto.** O conferente tira o
   controle do ar, mas não passa o padrão a ninguém: isso seria escrever a
   fonte padrão do sistema sem toque. O WirePlumber escolhe, e a memória do
   `eleito` fica, como antes desta sprint. Se deve passar ao último no ar é
   decisão de desenho a tomar.
