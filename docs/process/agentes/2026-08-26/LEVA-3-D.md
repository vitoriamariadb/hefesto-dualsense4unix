# LEVA-3-D — a tela deixa de dizer "pronto" no que não sabe

**26/08/2026.** Dois commits. O primeiro é a cura pedida. O segundo é uma
MEDIÇÃO que derrubou a ordem do segundo — e a medição vale mais que a cura que
ela impediu.

## O que mudou

### 1. `c60e7b64` — o microfone do vizinho para de entrar no perfil dela

`src/hefesto_dualsense4unix/app/widgets/controller_card.py`.

Com dois DualSense no cabo há DUAS placas de som, e o `mic.volume.set` que não
consegue mirar o controle escolhido cai na rota GLOBAL, que pega a PRIMEIRA — o
microfone de outra pessoa. O daemon responde `por_uniq` desde 23/08 justamente
para a tela poder saber; a tradução já existia em `ipc_bridge.alvo_honrado`
(três estados de propósito) com **zero** chamadores.

- `_enviar_volume_do_mic` passou de `mic_volume_set` (invólucro `bool`) para
  `mic_volume_set_detalhado` — o `bool` colapsava "mexi no que você escolheu" e
  "mexi no microfone de outra pessoa" no mesmo `True`;
- `_mic_confirmado_pelo_daemon` lê o corpo com `alvo_honrado` e **não grava no
  rascunho quando o alvo não foi honrado**. `None` (daemon calado) continua
  gravando: "não sei" não é "não honrei", e recusar por ausência de notícia
  inventaria um defeito;
- `sem_fonte` também deixou de gravar — o pedido não ficou de pé, e o rascunho
  descreve o que está de pé;
- o gesto do MUDO (`mic.set`) continua no `bool`, e o **mesmo** callback atende
  os dois. Há teste para isso, porque é assim que a cura de um lado quebra o
  outro;
- a CONFISSÃO na tela: `TEXTO_MIC_ALVO_NAO_HONRADO` + `frase_do_alvo_do_mic`
  (função pura, três estados) + `_dizer_alvo_do_mic`, pendurado num `GtkLabel`
  irmão do `_audio_aviso`, no CORPO do card, com `no_show_all` — no caso normal
  custa ZERO pixel, pela mesma medição já paga pelo aviso vizinho.

> **PROVISÓRIO — decisão dela.** A frase é
> *"O volume foi para o microfone de OUTRO controle: o Hefesto não conseguiu
> mirar este, e o pedido caiu no controle PRIMÁRIO. O perfil deste controle não
> mudou."*
> Ela é a do MEIO das três que a lápide previa. As outras duas — separar
> `sem_fonte` de "daemon offline" — pedem um ESTADO NOVO na tela (controle
> insensível com a dica), e isso é desenho: **não entrou, e está relatado abaixo.**

### 2. `9fb987b2` — a medição que derrubou a ordem das três frases do ambiente

A ordem era pendurar `descrever_teclado_na_tela` na legenda do L3 e
`descrever_display_grafico` perto do cartão de ambiente gráfico. **Nenhuma das
duas foi pendurada, e as duas razões são medidas.**

**A frase do teclado lê a chave no NÍVEL ERRADO.** Ela procura `osk_disponivel`
no TOPO do `state`; o daemon publica DENTRO do bloco `keyboard_emulation`
(`_keyboard_emulation_payload`). Contra os `state_full` reais desta bancada —
capturados com a máquina TENDO teclado na tela — ela responde *"não consegui
ler — o Hefesto pode estar desligado"*. Pendurá-la seria pôr uma frase FALSA na
tela dela:

```
== state_full_quatro_controles.json
  osk no topo?       False
  osk aninhado?      True -> True
  teclado: Teclado na tela: não consegui ler — o Hefesto pode estar desligado.
== state_full_cinco_controles.json
  osk no topo?       False
  osk aninhado?      True -> True
  teclado: Teclado na tela: não consegui ler — o Hefesto pode estar desligado.
```

**E o defeito que ela existia para curar já tinha fechado, por outro caminho.**
A premissa da ordem — *"ficou órfão de leitor por duas semanas"* — caducou em
25/08 (`e909b62`, N12): `mouse_actions._anotar_teclado_na_tela` lê a chave do
lugar certo e `input_actions.frase_do_teclado_na_tela` a transforma na frase da
legenda, **no gancho exato que a lápide nomeava**. Pendurar as duas poria dois
textos sobre o mesmo fato na mesma legenda, um deles falso.

```
$ grep -rn "osk_disponivel" src/hefesto_dualsense4unix/app/
app/actions/ambiente_na_tela.py  (a órfã)
app/actions/mouse_actions.py:230   bloco.get("osk_disponivel")   <- lê do state
app/actions/input_actions.py:449   frase_do_teclado_na_tela(...)  <- pendurada
```

**A frase do display, ao contrário, lê as chaves CERTAS**
(`_window_detect_payload` as publica no topo) e responde a verdade contra os
três fixtures. O que falta é só o chamador — e ele mora fora da minha posse: o
cartão é o `storm_card` do `gui/main.glade:2823`, pintado por
`app/actions/daemon_actions.py:1160 _refresh_window_detect_diag`, e uma frase a
mais ali pede um `GtkLabel` novo no Glade (recurso de bancada). **Relatado, não
escrito.**

A terceira, `descrever_steam_encontrada`, ficou de fora como a ordem já previa:
ela lê `steam_layout_achado`, chave que ninguém publica, e publicá-la exigiria
`daemon/ipc_handlers.py`.

As **duas lápides do meu bloco** em `portao_a_casa_sabe_e_o_produto_nao_faz.py`
passaram a dizer isso — fato errado se substitui, e a razão antiga mandava fazer
o que a medição proíbe.

## Qual mordida prova

### A do microfone — `tests/unit/test_a_janela_sabe_de_quem_e_o_microfone.py` (novo, 12 testes)

**Cura devolvida — verde:**

```
$ pytest tests/unit/test_a_janela_sabe_de_quem_e_o_microfone.py -q
............                                                             [100%]
12 passed in 0.46s
```

**Arrancada 1** (`if aceito and honrado is not False:` → `if aceito:`):

```
2 failed, 10 passed
FAILED ...::test_alvo_nao_honrado_nao_grava_no_rascunho
FAILED ...::test_o_gesto_inteiro_recusa_o_alvo_do_vizinho

E   AssertionError: o daemon não honrou o alvo aa:bb:cc:00:00:f0 e o volume 62
    foi gravado no rascunho DELA assim mesmo
E   assert 62 is None
E    +  where 62 = MicDraft(..., volume=62, muted=None, dirty=True, ...).volume
```

**Arrancada 2** (`mic_volume_set_detalhado` → `mic_volume_set`, a rota velha):

```
2 failed, 10 passed
FAILED ...::test_o_gesto_inteiro_recusa_o_alvo_do_vizinho
FAILED ...::test_o_gesto_inteiro_registra_quando_o_alvo_e_honrado

E   AssertionError: assert ([{'ROTA_VELHA': {'volume': 62, 'uniq': 'aa:bb:cc:00:00:f0'}}]
    and 'ROTA_VELHA' not in {'ROTA_VELHA': {...}})
```

A régua **sabe recusar dos dois lados**: há contrapeso para alvo honrado (grava,
e a tela fica calada) e para o daemon calado (grava). Sem eles, uma condição
"nunca grava" passaria na mordida e mataria o salvamento do microfone dela — o
defeito de 18/08 ressuscitado.

### A da medição — `TestOQueEstaFraseNaoAlcancaNoStateFullDeVerdade` (3 testes)

Ela morde **no sentido contrário**, de propósito: consertando o nível da chave
em `ambiente_na_tela.py`, ela REPROVA e obriga a decisão sobre a duplicata.

**Com o nível consertado:**

```
3 failed, 29 passed
FAILED ...::TestDescreverTecladoNaTela::test_disponivel_true
FAILED ...::TestDescreverTecladoNaTela::test_disponivel_false
FAILED ...::TestOQueEstaFraseNaoAlcancaNoStateFullDeVerdade::test_contra_o_payload_real_a_frase_diz_que_nao_conseguiu_ler

E   AssertionError: `descrever_teclado_na_tela` passou a alcançar
    `keyboard_emulation.osk_disponivel`. Ela agora DIZ a verdade — e por isso
    passa a competir com `input_actions.frase_do_teclado_na_tela`, que ocupa o
    mesmo gancho desde 25/08. ESCOLHA uma das duas e apague a outra
```

**Restaurado — verde:**

```
$ pytest tests/unit/test_ambiente_presumido_01_o_que_a_maquina_nao_tem.py -q
................................                                         [100%]
32 passed in 0.43s
```

### O escopo inteiro

```
$ pytest tests/unit/test_a_janela_sabe_de_quem_e_o_microfone.py \
         tests/unit/test_a_guarda_do_card_sem_endereco.py \
         tests/unit/test_status_cards.py \
         tests/unit/test_perfil_salva_tudo_registrar_nao_e_aplicar.py \
         tests/unit/test_mic_volume_01_o_slider_que_faltava.py -q
98 passed in 2.04s
```

## O que NÃO verifiquei

- **Nada com o aparelho.** A frente é `bancada: false` e não encostei em
  `hidraw`, daemon vivo, `systemctl` nem controle na mesa. **A confissão nunca
  foi vista com dois DualSense de verdade no cabo** — o que foi exercido é o
  corpo do daemon, plantado com a forma que `ipc_handlers._handle_mic_volume_set`
  publica. Que o daemon DE VERDADE devolva `por_uniq: False` no caso da mesa
  cheia é fato de 23/08 que eu **não** remedi.
- **Não olhei a tela.** Não rodei `retratar_abas.py` (R-C) e não fotografei o
  card com a confissão aparecendo. O `GtkLabel` é irmão exato do `_audio_aviso`
  e nasce `no_show_all`+`hide()`, então em tese custa zero — **em tese**: o
  custo de altura quando ele APARECE (o card já pede 463 dos 467 que a aba dá)
  não foi medido. Quem fotografar a leva, olhe este card.
- **`ruff` continua VERMELHO, e era antes de mim.** 3 × E501 em
  `tests/unit/test_o_preset_nao_escolhe_a_mascara.py:63,85` e
  `tests/unit/test_match_sem_caixa_e_sentinel_manual.py:275`, vindos de
  `c165485c`. Provado contra o HEAD, fora da minha árvore de trabalho:
  `git show HEAD:<arquivo> > /tmp/base/... && ruff check /tmp/base/` → `Found 3
  errors`. Não são meus arquivos e não os consertei.
- **Não rodei a suíte inteira** (é de quem coordena, e em oito lotes).
- **Não medi** se a frase da confissão cabe na largura do card em tela de
  1180px, nem como ela quebra no card compacto.

## O que sobrou para o próximo

### 1. DUAS entradas do portão, no bloco `app/ipc_bridge.py`, que é da L3-C

O portão `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` está **VERMELHO
por causa da minha cura**, com dois vermelhos e nenhum deles no meu bloco de
linha (R-B). **Não editei**, e o texto pronto está aqui:

```
FAILED ...::test_nenhuma_lapide_sobreviveu_a_propria_cura
  - _SEM_CAMINHO_HOJE: app/ipc_bridge.py::alvo_honrado

FAILED ...::test_toda_promessa_solta_esta_classificada
  - app/ipc_bridge.py::mic_volume_set
```

- **`alvo_honrado`: APAGUE a entrada.** A cura chegou — é literalmente o que a
  razão dela mandava fazer (*"O QUE A FECHA: `controller_card.py:3684`, trocando
  `mic_volume_set` por `mic_volume_set_detalhado`, e `_mic_confirmado_pelo_daemon`
  deixando de gravar o volume no rascunho dela quando o alvo não foi honrado"*).
- **`mic_volume_set`: ficou órfão**, e é o SEXTO invólucro `bool` da mesma
  família que a L3-C está podando (`apply_draft`, `rumble_policy_set`,
  `mouse_emulation_set`, `trigger_reset`, `led_set`, `player_leds_set`). O
  último chamador de produção era o card, e passou para a rota detalhada. **Ele
  é resto**: ou sai junto com os outros cinco, ou ganha lápide.

O portão é da camada `completo`, não da `rapido` — o `--rapido` fecha em 18/19,
com o único vermelho sendo o `ruff` pré-existente acima.

### 2. Editei UM arquivo fora da posse declarada, e digo qual

`tests/unit/test_a_guarda_do_card_sem_endereco.py` — o espião de `_espiar_o_ipc`
apontava para `ipc_bridge.mic_volume_set`, e com a troca de rota ele deixava de
ver o pedido: `test_com_endereco_os_seis_gestos_chegam_e_miram_este_controle`
reprovava com *"At index 1 diff: 'speaker.set' != 'mic.volume.set'"*. Renomeei o
espião para `mic_volume_set_detalhado` (o corpo devolvido é o de alvo honrado). O
que aquela guarda mede — o `uniq` que sai no pedido — é idêntico nas duas rotas.
Nenhuma outra frente da LEVA-3 tem esse arquivo na posse. **Se a costura preferir
o contrário, o conserto é de uma linha.**

### 3. O estado NOVO na tela, que é desenho e é dela

Separar `sem_fonte` (Bluetooth sem a ponte de áudio) de "daemon offline" pede
**controle deslizante insensível com a dica dizendo por quê** — a promessa que
`ipc_bridge.mic_volume_set` escreve no docstring desde 16/08 e que nunca teve
como se cumprir. **Foto antes e depois, e a palavra é dela.** A cura desta frente
já faz a palavra `sem_fonte` chegar ao callback; falta o que a tela faz com ela.

### 4. A DECISÃO sobre `descrever_teclado_na_tela`

Duas funções sobre o mesmo fato, e a casa não deixa duas versões vivas:

- `app/actions/input_actions.py:265 frase_do_teclado_na_tela` — **viva,
  pendurada, e melhor**: é aditiva (`""` com `None`, a tela fica como estava) e
  o texto dela diz o que INSTALAR;
- `app/actions/ambiente_na_tela.py descrever_teclado_na_tela` — **órfã e com o
  nível da chave errado**.

A saída barata é apagar a segunda (o portão oferece isso como opção 2: *"APAGUE
— se outro caminho já a substituiu, ela é resto"*). **Não apaguei** porque a
poda tocaria `tests/unit/test_ambiente_presumido_01_o_que_a_maquina_nao_tem.py`
inteiro e `tests/unit/test_lingua_do_produto_01_o_convite_a_traduzir.py:279`,
que conta arquivos — e nenhum dos dois é posse desta frente para uma poda.

### 5. A frase do display continua sem pendurar

Chamador em `app/actions/daemon_actions.py:1160 _refresh_window_detect_diag`, +
um `GtkLabel` irmão do `window_detect_diag_label` em `gui/main.glade:2869`. As
chaves já chegam certas; é só fiação. **Onda 11 · Sistema.**

### 6. A frase provisória espera o olho dela

`TEXTO_MIC_ALVO_NAO_HONRADO` entra na fila do
`docs/process/2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md` (60 → 61).
