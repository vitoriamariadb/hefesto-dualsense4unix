---
sprint: COOP-NA-CONEXAO-NATIVA-01
estado: aberta
posse:
  # A tela. É aqui que mora a maior parte do trabalho — o mecanismo (§3 e o fim
  # do §6) diz que o produto não tem como CRIAR jogador na Conexão Nativa; o
  # que ele tem de fazer é dizer a verdade e oferecer a saída.
  NATIVA-1:
    - src/hefesto_dualsense4unix/app/widgets/painel_no_jogo.py
    - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
    - src/hefesto_dualsense4unix/gui/main.glade
  # O número sem vpad. Posse de FUNÇÃO, não de arquivo: `resolve_player_numbers`
  # e nada mais. `coop.py` colide com COOP-QUE-NAO-DESMONTA-01 e
  # BORDA-DE-QUEDA-01 — o `depois_de` serializa.
  NATIVA-2:
    - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
  NATIVA-3:
    - docs/data/ensaios.csv
    - docs/data/mapa-controles.csv
cria:
  - tests/unit/test_coop_na_conexao_nativa.py
nao_toca:
  # O contrato de ZERO ESCRITA no Modo Nativo é regra DELA, literal, e está
  # soldado no `_output_mute` do backend. Nenhuma tarefa desta sprint o abre
  # sem a decisão do §10.
  - src/hefesto_dualsense4unix/core/backend_pydualsense.py
  - src/hefesto_dualsense4unix/daemon/lifecycle.py
  - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
  - src/hefesto_dualsense4unix/daemon/subsystems/identity.py
  - install.sh
depois_de:
  - MESA-DE-QUATRO-01
  # A faxina de 27/08 apagou daqui: NAVEGACAO-UM-CONTROLE-SO-01. Para onde cada uma foi, veja 2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md.
  - COOP-QUE-NAO-DESMONTA-01
  - BORDA-DE-QUEDA-01
  - EMULACAO-UM-DONO-SO-01
  - RESERVA-DO-POSTO-01
  # A NAVEGACAO-UM-CONTROLE-SO-01 reivindica a PASTA
  # `daemon/subsystems/` inteira; a colisão com `coop.py` é real e fica
  # serializada, como já fazem as outras quatro sprints de co-op.
bancada: true
---

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.1 — família do co-op; a MESA-DE-QUATRO-01 (FECHO, com ela) diz o que ainda está vivo; não se despacha pelo id antes dela.

# CO-OP NA CONEXÃO NATIVA-01 — o modo mais fiel é o único sem Jogador 2

**25/08/2026. GRAU: MEDIDO** onde a linha traz âncora de arquivo:linha;
**INFERIDO DO CÓDIGO** onde diz; **NÃO MEDIDO** onde diz.

**Índice:** [SPRINT_ORDER §frente 14](../SPRINT_ORDER.md) — o balde de co-op.
**A linha 613 daquele arquivo registrou este buraco e disse "não proponho sprint
nova; fica nomeado aqui para a frente 14 não fechar sem alguém decidir se
materializa".** Ela decidiu hoje: **materializar.** Esta é a sprint.

**Ela pede DESENHO antes de código, e é o que este documento é.** As opções vêm
com o preço; a escolha é dela.

---

## 1. O defeito, em uma frase

**Quem escolhe a Conexão Nativa (Sony) — o modo mais fiel ao controle — perde o
co-op inteiro por construção, e a tela desse modo diz textualmente que "está
tudo certo".**

## 2. O que está medido

### 2.1 O co-op exige vpad, e o Modo Nativo apaga o vpad

```
coop.py:320-326   should_be_active() -> config.coop_enabled AND _gamepad_device is not None
coop.py:621-626   sync(): gate falso -> disable() e return. Zero secundários.
```

E o que o Modo Nativo faz ao entrar (`daemon/lifecycle.py:1168-1169`,
`_release_controller_to_game`): `set_gamepad_emulation(False, origin="profile")`
→ `stop_gamepad_emulation` (`daemon/subsystems/gamepad.py:2132-2136`) zera
`daemon._gamepad_device`.

**Logo, na Conexão Nativa `should_be_active()` é False sempre. Não há caminho em
que não seja.**

### 2.2 A regra que liga o co-op sozinho também é desligada, e com nome

`daemon/lifecycle.py:1812-1813`:

```python
if self._native_mode or self.store.native_mode_active:
    return self._log_gamepad_multi(IGNORADO_GESTO_DELA, "modo_nativo", 0)
```

A AUTO-01.1 — *"dois controles na mesa ligam a emulação sozinhos"* — tem uma
exceção explícita para o Modo Nativo. Ela está certa como código (ligar o vpad
desfaria o modo que ela pediu) e é a segunda porta fechada.

### 2.3 A tela não numera ninguém, e a docstring diz que é de propósito

`coop.py:1895-1896`, em `resolve_player_numbers`:

```python
if getattr(daemon, "_gamepad_device", None) is None:
    return [None] * len(controllers)
```

A docstring acima (`:1881-1886`) lista os três casos de "este controle não é um
jogador agora", e o primeiro é: *"sem gamepad virtual (modo desktop/nativo): não
existe jogador — o controle mexe no PC ou fala direto com o jogo"*.

**Não é bug: é uma premissa escrita.** Curar isto é derrubar a premissa, e por
isso é decisão dela e não conserto de agente.

### 2.4 E a tela afirma que está tudo bem

`app/widgets/painel_no_jogo.py:317` — a lista dos três casos sem vpad abre com:

> *"**Conexão Nativa (Sony)** — não há nada nosso no meio, e está tudo certo"*

E o texto que a pessoa lê (`:197-201`, `TEXTO_NATIVO`):

> *"Não há controle virtual nenhum neste modo: o jogo abre o controle físico e
> fala direto com ele. Movimento, toque, vibração e som saem do próprio
> DualSense, e por isso não há aqui o que medir."*

**A frase é verdadeira sobre tudo o que ela enumera, e cala sobre a única coisa
que muda de comportamento: quantos jogadores existem.** Idem
`app/actions/emulation_actions.py:1452-1454` e `:1472-1474`.

### 2.5 Ela decidiu, duas vezes, que co-op não é opção

Lápide de `gui/main.glade:248-259` (COOP-SEM-INTERRUPTOR-01, 06/08/2026), com a
frase dela literal:

> *"todos e tudo no Hefesto tem que tá com o permitir co-op ligado (...) se eu
> conecto 4 controles no PC eu espero, com 4 pessoas jogando, que cada um
> controle o próprio personagem"*

O piso do daemon nasce ligado, e **`coop.set {enabled:false}` recusa em voz
alta**. Ou seja: **o produto recusa desligar o co-op por gesto e o desliga em
silêncio por modo.** É a contradição inteira, em duas linhas.

### 2.6 O contrato de ZERO ESCRITA, que limita metade das saídas

Regra dela, literal, em `core/backend_pydualsense.py:3147-3152`:

> *"no modo nativo devolvemos o controle pra steam e no modo conexão também,
> todo o resto é o hefesto"*

O portão é o `_output_mute`, e ele é **total**: a rota sysfs de LED fica
desabilitada, o `_pintar_por_hidraw_bt` é pulado e o `report_thread` não escreve
nada (`:4376-4381`). O aviso de modo é no-op declarado (`:3255`, `:3267`).

**Consequência dura, e ela fecha um caminho inteiro:** o LED de jogador do co-op
sai por `set_coop_outputs` → camada do backend (`coop.py:1392-1394`). **Em
Conexão Nativa essa camada não chega ao aparelho, mesmo que o portão do §2.1
fosse aberto.** Acender o número no controle exige abrir uma exceção à regra
dela — e isso é dela, não meu.

## 3. Onde a premissa "um jogador é um vpad" está soldada

Lido hoje, em ordem de quão fundo está:

| onde | o que solda |
|---|---|
| `coop.py:320-326` `should_be_active` | **o gate**. Sem vpad, o subsistema inteiro se desliga |
| `coop.py:227-264` `_SecondaryPlayer` | o dataclass do jogador **tem um campo `vpad`**, e o ciclo de vida gira em torno dele (`vpad is None` = "aguardando grab") |
| `coop.py:792-836` `_spawn_player` | jogador nasce de `EvdevReader` + `EVIOCGRAB` + vpad. **O grab é o mecanismo**: o físico deixa de falar com o jogo para falar com o vpad |
| `coop.py` `forward_all` | bombeia físico → vpad e o FF de volta. Sem vpad não há para onde bombear |
| `coop.py:1895-1896` `resolve_player_numbers` | **o número na tela**, gateado no vpad do P1 |
| `coop.py:135-197` `identidade_do_vpad` / `_item_da_mesa` | cada item da `mesa` carrega `vpad_backend`/`vpad_uniq`/`vpad_nome`/`vpad_indice` |
| `coop.py:1384-1422` `_apply_coop_player_leds` | só roda no ramo ativo do `sync()`, e escreve pela camada do backend (§2.6) |
| `daemon/launch_env.py:1571-1580` `_snapshot` | a decisão do `SDL_..._IGNORE_DEVICES` conta **backends de vpad**, e um jogador sem vpad não entra na conta |

**A leitura honesta disso:** o vpad não é um detalhe de implementação do co-op —
**ele é o mecanismo**. O co-op desta casa é "pego o físico com grab e devolvo N
dispositivos distintos ao jogo". Tirar o vpad não deixa um co-op mais simples;
deixa **nenhum intermediário**, que é a definição da Conexão Nativa.

## 4. O que NÃO está soldado — e muda o tamanho de tudo

### 4.1 O número de cada controle já existe sem vpad

`daemon/subsystems/identity.py` — o registro MAC→lugar na fila. E o
`_sync_identity_registry` roda **antes** do gate de conexão no poll loop
(`daemon/lifecycle.py:4421-4423`, a cada 2 s), **sem consultar modo nenhum**.

**Medido: nada no caminho de identidade olha para `is_native_mode()`.** O
"Controle 1 / Controle 2" já é calculado corretamente na Conexão Nativa; o que
não existe é o "Jogador 1 / Jogador 2", que é outro conceito e mora no co-op.

**Isto é o ativo mais importante desta sprint:** metade do que se quer entregar
já está calculado e só não é publicado.

### 4.2 Na Conexão Nativa, o jogo enxerga TODOS os físicos

Três âncoras, medidas hoje:

```
launch_env.py:1497-1498   # Modo Nativo: expõe o físico — sem DISABLE, sem IGNORE
gamepad.py:1065-1066      rehide_physical_hidraw: if daemon.is_native_mode(): return
gamepad.py:578-582        esconder_o_fisico_para_o_jogo: recusa com motivo="modo_nativo"
```

E o grab do físico é solto ao entrar (`gamepad.py:2140-2141`,
`_set_controller_grab(daemon, False)`).

**Ou seja: com dois DualSense na Conexão Nativa, nada do Hefesto impede o jogo
de enumerar os dois.** Se o jogo faz co-op local por contagem de gamepads, ele
tem dois gamepads para contar.

**GRAU: INFERIDO DO CÓDIGO, NÃO MEDIDO.** Nenhum jogo foi aberto com dois
controles na Conexão Nativa nesta casa — nem hoje, nem antes. **A §5 é a
medição que decide o resto desta sprint, e ela é da bancada dela.**

## 5. A pergunta que muda o tamanho de tudo

> **Com dois DualSense na Conexão Nativa, um jogo de co-op local vê dois
> jogadores?**

**Se SIM** — o produto não está tirando co-op de ninguém. Está **calando** sobre
ele: o jogo tem dois jogadores e a tela do Hefesto diz que não há jogador
nenhum. O trabalho vira "dizer a verdade", que é barato e cabe nas tarefas
NATIVA-1 e NATIVA-2.

**Se NÃO** — o co-op de verdade exige o intermediário, e o produto não tem como
criá-lo sem sair do modo. O trabalho vira "oferecer a saída com o preço", que é
a NATIVA-4.

**Não dá para desenhar as duas metades antes de saber qual é.** Por isso a §5 é
o exercício 1, e as tarefas abaixo declaram de qual ramo dependem.

### NATIVA-0 — a medição que decide (BANCADA, DELA)

**Precisa:** dois DualSense (rádio ou cabo, e anotar qual), a Conexão Nativa
ligada, e um jogo com co-op local de sofá.

1. Ligue a Conexão Nativa com **um** controle. Abra o jogo. Confirme que ele
   responde — é o controle base.
2. Sem fechar o jogo, ligue o segundo controle. **O jogo mostra um segundo
   jogador / pede "aperte um botão para entrar"?**
3. Feche e reabra o jogo com os dois já ligados. Repita.
4. Repita os passos 1 a 3 **no cabo e no rádio** — são duas linhas do mapa, não
   uma. E anote **quantos adaptadores de rádio** estavam em uso.
5. Contraprova, e ela é obrigatória: repita tudo no **Modo Gamepad** com o
   co-op de pé, para saber como o MESMO jogo se comporta quando o produto está
   no meio. Sem a contraprova, um jogo que simplesmente não tem co-op local
   passaria por prova contra a Conexão Nativa.

**Onde anota:** `docs/data/ensaios.csv`, `linha_id` =
`plataforma.slot_jogador@dualsense`, `transporte` = `cabo` / `radio`,
`observado_por` = `olho-dela`, `fonte` = `COOP-NA-CONEXAO-NATIVA-01`, e a `nota`
diz **o nome do jogo** e o que apareceu na tela do jogo.

**A mordida — e aqui ela é de DADO, não de código.** O mapa
(`docs/data/mapa-controles.csv`) tem hoje `plataforma.slot_jogador@dualsense`
com `existe: desconhecido`, e a `INICIO-NAO-MENTE-01` já registra que a aba
Início *"promete um jogador para cada controle"* apoiada num
`inferido-do-codigo`. Preencher a coluna do transporte sem escrever as linhas do
ensaio faz `scripts/check_paridade_transporte.py` reprovar — é o portão que
transforma esta medição em afirmação que a tela pode usar.

## 6. Os caminhos, com o preço de cada um

**Não são exclusivos** — A é piso de todos; B, C e D somam.

### Caminho A — a tela para de dizer "está tudo certo"

O `TEXTO_NATIVO` e as duas frases de `emulation_actions.py` ganham a linha que
falta: **quantos jogadores existem neste modo, e por quê.** A redação exata sai
da §5 (uma frase se o jogo vê dois, outra se não vê).

| a favor | o preço |
|---|---|
| é o piso de honestidade desta casa: *o produto responde pelo transporte, não pelo efeito*, e hoje ele nem responde | mais uma linha de texto numa aba que já é densa; e **texto novo é olho dela** (PROVA-DE-TELA-01) |
| não escreve um byte no controle: o contrato do §2.6 fica intacto | sozinho, não devolve nada — só para de esconder |

### Caminho B — o número do jogador existe sem vpad

`resolve_player_numbers` deixa de devolver `[None] * N` na Conexão Nativa e
passa a numerar pelo `identity_registry` (§4.1), que já calcula certo.

| a favor | o preço |
|---|---|
| o dado já existe e está correto; é publicar o que a casa já sabe — o defeito mais barato de curar daqui | **derruba uma premissa escrita** (`coop.py:1881-1886`): hoje "sem vpad não existe jogador" é decisão, não descuido |
| o card da mesa deixa de ficar mudo com quatro controles na tela | **e o número pode mentir sobre o jogo**: se a §5 der NÃO, a tela diria "Jogador 2" para quem o jogo não vê. Aí este caminho **só vale junto do A** |

**Depende da §5.** Com SIM, B é a cura. Com NÃO, B sem A é uma mentira nova.

### Caminho C — o LED de jogador acende no aparelho, na Conexão Nativa

| a favor | o preço |
|---|---|
| é o que a pessoa olha para saber quem é quem — a tela está atrás dela | **quebra a regra dela do §2.6, literal.** O `_output_mute` existe para garantir zero escrita, e furá-lo por LED reabre a disputa com o jogo pelo hidraw que o GUERRA-01 já mediu |
| — | e o jogo nativo **também** escreve o LED de jogador: dois donos no mesmo byte é o pisca-pisca que a R-13 já matou uma vez |

**Não recomendo, e não decido: é regra dela e só ela a abre.** Se abrir, tem de
ser exceção **nomeada** (só o LED de jogador, só na Conexão Nativa, e o resto do
mute intacto), nunca um `_output_mute` mais frouxo.

### Caminho D — o produto oferece a troca de modo, com o preço escrito

Se a §5 der NÃO: a tela do modo passa a oferecer *"este jogo precisa do Hefesto
no meio para ter dois jogadores — quer trocar para Jogar pelo Hefesto?"*, e diz
o que se perde na troca (os gatilhos adaptativos nativos, que é o motivo inteiro
de a Conexão Nativa existir).

| a favor | o preço |
|---|---|
| é a única saída que **entrega co-op de fato** quando o jogo não conta dois físicos | a troca de modo **desfaz o que ela pediu**, e um botão que desfaz a escolha da pessoa tem de ser oferta, nunca automatismo |
| o gesto já tem casa: os três modos já vivem na aba Início (`app/actions/home_actions.py:156`) | precisa da frase do que se perde, e essa frase é olho dela |

### O caminho que NÃO existe, e é honesto dizer

**"Co-op sem vpad", no sentido de o Hefesto criar dois jogadores a partir de
dois físicos sem se pôr no meio, não é um caminho.** O mecanismo do co-op é o
grab + o vpad (§3); pôr-se no meio é a definição do que a Conexão Nativa
dispensa. Ou o jogo conta os dois físicos sozinho (§5 = SIM), ou alguém tem de
estar no meio (Caminho D).

**Qualquer proposta que prometa as duas coisas ao mesmo tempo está errada, e
esta sprint diz isso em vez de supor.**

## 7. As tarefas

### NATIVA-1 — a tela diz quantos jogadores existem neste modo

`painel_no_jogo.py` (`TEXTO_NATIVO`, `:197-201`) e as duas frases de
`emulation_actions.py` (`:1452-1454`, `:1472-1474`). **Uma frase, com dono
único** — a mesma situação não pode ter duas redações em duas abas, que é a
disciplina já escrita em `painel_no_jogo.py:173-175`.

**Cuidado de redação, medido nesta casa:** a primeira redação do `TEXTO_NATIVO`
foi **reprovada por um portão** por começar com *"O Hefesto saiu da frente"* —
a construção que a medição dela derrubou em 06/08
(`test_a_frase_refutada_da_allowlist`). A frase nova diz o **mecanismo**, não a
retirada.

**A mordida.**
`tests/unit/test_coop_na_conexao_nativa.py::test_o_texto_do_modo_nativo_fala_de_jogadores` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— com `state_full` em modo `native` e **dois** controles conectados, a frase que
a tela publica menciona o número de jogadores. Arrancada a cura, volta a sair a
frase de hoje — que enumera movimento, toque, vibração e som e cala sobre
jogador — e o teste reprova imprimindo a frase inteira.

**Prova de tela: precisa-do-olho-dela-antes.** É texto novo.

### NATIVA-2 — o número do jogador, se ela escolher o Caminho B

`coop.py:1895-1896` e a docstring de `:1881-1886` — **a premissa muda, e a
docstring muda junto**. Deixar a docstring velha ao lado do código novo é a
correção pela metade que a regra da casa proíbe.

**A mordida.**
`tests/unit/test_coop_na_conexao_nativa.py::test_o_numero_do_jogador_sobrevive_sem_vpad` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— daemon com `_gamepad_device = None`, modo `native`, dois controles com MAC no
`identity_registry`: `resolve_player_numbers` devolve `[1, 2]` na ordem do
registro. Arrancada a cura, devolve `[None, None]` e o teste reprova nomeando os
dois controles que ficaram sem número. **E a contraprova, no mesmo arquivo:**
com o modo `desktop` (Controlar o PC) continua `[None, None]` — ali não há
jogador mesmo, e alargar a cura para os dois modos seria trocar um defeito por
outro.

**Prova de tela: precisa-do-olho-dela-antes** (o card ganha número onde hoje não
tem).

### NATIVA-3 — o mapa deixa de dizer `desconhecido` sobre isto

`plataforma.slot_jogador@dualsense` recebe a coluna do transporte medido na §5,
com `de_onde_sei = medido` e a evidência em frase.

**A mordida.** `scripts/check_paridade_transporte.py`, já descrito na §5.

### NATIVA-4 — a oferta de troca, se a §5 der NÃO e ela escolher o Caminho D

**Não escrevo o desenho desta antes da §5.** O que já se sabe: o gesto tem casa
(a aba Início), a frase do que se perde é olho dela, e **a troca nunca é
automática** — a Conexão Nativa é escolha dela e o produto não desfaz escolha
dela sozinho.

**A mordida.**
`tests/unit/test_coop_na_conexao_nativa.py::test_a_oferta_de_troca_nao_troca_sozinha` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— com dois controles na Conexão Nativa, o produto **publica a oferta** e o modo
continua `native` até alguém clicar. Arrancada a cura, um automatismo tira o
modo que ela pediu, e o teste reprova mostrando o modo antes e depois.

## 8. O que é medível sem bancada, e o que exige controles na mão

**Sem hardware nenhum, hoje** (e foi assim que a §2 foi levantada):

- o gate e as duas portas fechadas (§2.1, §2.2) — leitura de código;
- a mudez da tela (§2.3, §2.4) — leitura de código;
- que a identidade não olha para o modo (§4.1) — leitura de código;
- que nada esconde o físico na Conexão Nativa (§4.2) — leitura de código;
- **todas as mordidas das NATIVA-1, 2 e 4** — são testes de unidade, com daemon
  dublado. Nenhuma abre janela nem toca `/dev`.

**Exige a bancada dela, e não tem substituto:**

- a §5 inteira — **é a pergunta que decide a sprint**, e nenhuma leitura de
  código a responde: quem conta gamepads é o jogo, não o Hefesto;
- **quatro controles**, para saber se o jogo que vê dois também vê quatro. A
  casa nunca mediu quatro no rádio (registrado na `MOTOR-DO-ARRANJO-01`);
- se o Caminho C for aberto: se o LED escrito por nós sobrevive ao jogo nativo
  escrevendo o dele.

## 9. O que esta sprint NÃO faz

- **Não abre o `_output_mute`.** É regra dela (§2.6) e a decisão é da §10.
- **Não mexe no mecanismo do co-op** — o `_spawn_player`, o grab, o teardown e a
  numeração interna são da `COOP-QUE-NAO-DESMONTA-01` e da `BORDA-DE-QUEDA-01`.
- **Não mexe no `identity.py`.** Ele já acerta; esta sprint só o **lê**.
- **Não liga o vpad na Conexão Nativa.** A exceção de `lifecycle.py:1812-1813`
  está certa: ligar o vpad é desfazer o modo.
- **Não decide entre A, B, C e D.** Põe os quatro com o preço; a §10 é dela.

## 10. O que precisa DELA

1. **A medição da §5** — com um jogo de co-op local, dois controles, no cabo e
   no rádio. **É ela que decide o tamanho de tudo o mais.**
2. **Qual caminho.** A é piso e recomendo-o em qualquer cenário (parar de dizer
   "está tudo certo" não depende de escolha nenhuma). B, C e D dependem da §5 e
   do preço que ela aceitar pagar.
3. **E a pergunta do Caminho C, que é sobre a regra dela:** *o LED de jogador é
   exceção ao "no modo nativo devolvemos o controle pra Steam"?* Os dois lados:
   - **não**: a regra vale inteira, e quem quiser saber quem é quem olha a tela.
     Preço: numa sala com quatro pessoas, ninguém olha a tela do PC;
   - **sim, só o LED**: o número acende no aparelho. Preço: reabre a disputa
     pelo hidraw com o jogo, que é a família de defeitos mais cara desta casa.
4. **A redação das frases novas** (NATIVA-1, e a de NATIVA-4 se houver).

## 11. O que sobrou para o próximo

- **A `SPRINT_ORDER.md:613-616` diz "não proponho sprint nova".** Isso caducou
  hoje, com a decisão dela. A linha precisa apontar para esta sprint — **não
  editei: o arquivo não é meu** (R1), e fica relatado.
- **O teto de 4 jogadores da GUI** que o daemon não tem, registrado na mesma
  linha 387 da `SPRINT_ORDER.md`: **NÃO VERIFICADO** com cinco controles, e
  continua não verificado.
- **NÃO VERIFICADO:** se a Conexão Nativa por **rádio** com dois ou mais
  controles se sustenta. A `PERFIS-ABRE-O-QUE-GUARDA-01` já registra a pergunta
  em aberto — *"Modo Nativo com dois ou mais no rádio funciona, e com quantos
  adaptadores?"* — e a §5 desta sprint responde metade dela de graça, se a
  bancada anotar quantos adaptadores estavam em uso.
- **O caminho do Steam Input não foi examinado aqui.** O espelho Xbox que a
  Steam faz de cada controle que enxerga muda a conta de gamepads do jogo, e na
  Conexão Nativa **os físicos estão visíveis para ela**. Se a §5 der um resultado
  estranho — três ou quatro jogadores com dois controles —, a causa provável é
  essa, e é sprint própria.
