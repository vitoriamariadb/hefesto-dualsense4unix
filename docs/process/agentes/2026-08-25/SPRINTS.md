# SPRINTS — as duas sprints que as decisões dela abriram

**25/08/2026.** Árvore `hefesto-voo/CONEXOES-MAPA-2D-01-PAR`, branch
`voo/CONEXOES-MAPA-2D-01-PAR`. **Esta frente não tocou código.** Dois documentos
em `docs/process/sprints/` e este relatório. **Não commitei.**

Nada do que a frente PAR deixou na árvore foi desfeito ou tocado.

## O que mudou

Dois arquivos novos, os dois em `docs/process/sprints/`:

| arquivo | o que é |
|---|---|
| `2026-08-25-RESERVA-DO-POSTO-01-trinta-segundos-que-ninguem-cronometrou.md` | a reserva do posto de primário: quanto tempo? |
| `2026-08-25-COOP-NA-CONEXAO-NATIVA-01-o-modo-mais-fiel-e-o-unico-sem-jogador-2.md` | o co-op no Modo Nativo — desenho, com os caminhos e o preço |

As duas com frontmatter de posse no topo, no formato de
`scripts/check_colisao_de_sprints.py`.

### RESERVA-DO-POSTO-01 — e o achado que ela carrega

A tarefa pedia o roteiro de bancada. **Ele não era executável como o produto
está hoje, e essa é a parte mais importante da sprint.**

Medido lendo o código:

| evento | nível | o que significa |
|---|---|---|
| `primario_deposto_reservado` (`backend_pydualsense.py:2422`) | **DEBUG** | o `t0` da queda — **mudo** |
| `primario_reserva_caducou` (`:2437`) | **DEBUG** | a volta estourou o prazo — **mudo** |
| `primario_retomou_o_posto` (`:2473`) | INFO | a volta coube no prazo |

O nível padrão é `INFO` (`utils/logging_config.py:56`). **Logo o journal dela
registra a volta SÓ quando ela já coube nos 30 s** — medir a distribuição com
esse instrumento é medir apenas as amostras que confirmam o número que se quer
justificar. A sprint põe a subida dos dois eventos para INFO como tarefa 1, e
com mordida.

Segundo buraco, também medido: com dois controles na mesa, a queda de um **não**
produz `controller_disconnected` — o probe consulta `is_connected()`, que é
`any(handle.connected)` sobre todos os handles
(`core/backend_pydualsense.py:2712-2718`). A queda de UM controle não tem linha
em INFO em lugar nenhum.

A sprint também acha **onde o dado mora**: `docs/data/mapa-controles.csv`, linha
`combinacao.slot_jogador.estabilidade@dualsense` — `cabo_aciona: parcial`,
medido em 12/08; **`radio_aciona` VAZIO**. É a coluna que a bancada preenche.

E o risco que a tarefa pediu está na §6, com um agravante que eu não esperava e
que saiu da leitura: **plugar o controle descarregado no cabo para carregar
conta como "voltou"** (o `norm_mac` é estável entre USB e BT), então a reserva
tomaria o Jogador 1 de quem está jogando. É INFERÊNCIA do código, está marcada
como tal, e virou o exercício RESERVA-5 + uma pergunta para ela.

### COOP-NA-CONEXAO-NATIVA-01 — o desenho, e o que ele mudou de premissa

A premissa da tarefa era "co-op no Modo Nativo = zero jogadores". **Ela está
certa sobre o PRODUTO e pode estar errada sobre o JOGO**, e a distinção muda o
tamanho de tudo:

- **o produto**: `should_be_active()` exige `_gamepad_device` (`coop.py:320-326`)
  e o Modo Nativo o zera (`lifecycle.py:1168-1169` →
  `gamepad.py:2132-2136`). Confirmado, sem caminho de escape;
- **o jogo**: na Conexão Nativa **nada esconde os físicos do SDL** —
  `launch_env.py:1497-1498` (*"Modo Nativo: expõe o físico — sem DISABLE, sem
  IGNORE"*), `gamepad.py:1065-1066` (o re-hide retorna), `gamepad.py:578-582`
  (recusa com `motivo="modo_nativo"`), e o grab do físico é solto
  (`gamepad.py:2140-2141`). **Se o jogo faz co-op local contando gamepads, ele
  tem dois para contar.**

**Isso é INFERÊNCIA do código, NÃO MEDIDO**, e virou o exercício NATIVA-0, que é
a bancada dela e decide o resto da sprint.

Duas descobertas que mudam o desenho:

1. **O número já existe sem vpad.** O `identity_registry` roda antes do gate de
   conexão no poll loop (`lifecycle.py:4421-4423`) e **nada no caminho de
   identidade consulta `is_native_mode()`**. Metade do que se quer entregar já
   está calculado e só não é publicado.
2. **O LED de jogador não pode acender na Conexão Nativa sem quebrar uma regra
   DELA.** O contrato de zero escrita (`backend_pydualsense.py:3147-3152`, com a
   frase dela literal) é imposto pelo `_output_mute`, e ele é total — a camada
   do co-op não chegaria ao aparelho nem com o gate do §2.1 aberto. Virou um
   caminho com o preço na mesa, não uma recomendação.

Quatro caminhos com preço (A dizer a verdade · B numerar sem vpad · C acender o
LED · D oferecer a troca de modo), e **um quinto que declarei que NÃO EXISTE**:
"co-op sem vpad" no sentido de o Hefesto criar dois jogadores sem se pôr no
meio. O mecanismo do co-op é o grab + o vpad; pôr-se no meio é justamente o que
a Conexão Nativa dispensa. Escrevi isso em vez de prometer.

## Qual mordida prova

**Documento não tem mordida.** O que se pode provar aqui é que as duas sprints
passam nos portões que valem para elas, e que **cada exercício delas traz a sua
mordida escrita**:

```
$ .venv/bin/python scripts/check_colisao_de_sprints.py
OK: 22 sprint(s) anotada(s), nenhuma colisão não declarada.

$ .venv/bin/python scripts/validar-referencias-docs.py <as duas>
OK: 2 documento(s) sem referência morta.

$ .venv/bin/python scripts/check_endereco_de_radio.py
OK: nenhum endereço de rádio real em arquivo versionado.

$ .venv/bin/python scripts/validar-glifos.py --all      # verde
$ .venv/bin/python scripts/validar-caducos.py --all     # verde
```

**A colisão de posse foi declarada, não escondida.** O portão reprovou uma vez —
`NAVEGACAO-UM-CONTROLE-SO-01` reivindica a pasta `daemon/subsystems/` inteira, e
a `COOP-NA-CONEXAO-NATIVA-01` toca `coop.py`. Entrou no `depois_de`, como já
fazem as outras quatro sprints de co-op.

As mordidas que as sprints MANDAM escrever, uma por exercício:

| exercício | o que a mordida arranca, e o que reprova |
|---|---|
| RESERVA-1 | volta os dois eventos a `debug`: o journal de INFO deixa de ver a queda |
| RESERVA-2 | um `3600.0` de sessão esquecido na constante atravessa a leva |
| RESERVA-3 | o prazo velho deixa de cobrir as voltas medidas, e o teste nomeia as que não cabem |
| RESERVA-4 | `check_paridade_transporte.py` reprova coluna forte sem ensaio |
| RESERVA-5 | caracterização: a volta pelo cabo retoma o posto? (o fato vai para a pergunta dela) |
| NATIVA-0 | é ensaio, e o portão é o `check_paridade_transporte.py` |
| NATIVA-1 | volta a frase de hoje, que enumera movimento/toque/vibração/som e cala sobre jogador |
| NATIVA-2 | `resolve_player_numbers` volta a `[None, None]`; **e a contraprova**: em "Controlar o PC" tem de continuar `[None, None]` |
| NATIVA-4 | um automatismo tira o modo que ela pediu |

## O que NÃO verifiquei

- **Nada sobre o aparelho.** A bancada está sem DualSense conectado. **Toda
  afirmação sobre o que o jogo vê, sobre quanto tempo um controle demora a
  voltar e sobre o LED em Conexão Nativa é inferência de leitura de código**, e
  está marcada assim nas duas sprints.
- **Não rodei a suíte** nem `retratar_abas.py` (regra da leva).
- **Não abri nenhum jogo.** A NATIVA-0 existe exatamente porque essa medição não
  pode ser substituída por leitura.
- **`validar-acentuacao.py --all` está VERMELHO na árvore, e não é meu**: 8
  violações, todas em `docs/process/2026-08-25-AS-FRASES-DE-TELA-QUE-ESPERAM-ELA.md`
  e `scripts/gerar-frases-de-tela.py` (o gerador escreve `sugestão nao` /
  `sugestão media` sem acento, e o documento herda). **Zero delas nos meus dois
  arquivos** — conferi por `grep`. Não editei: não é minha lista (R1).
- **Não conferi se `PRIMARIO_RESERVA_SEC` tem outro consumidor** além dos três
  pontos do backend e do teste da BG-01. O `grep` achou só esses; não fui atrás
  de leitura indireta por `getattr`.

## O que sobrou para o próximo

- **`docs/process/SPRINT_ORDER.md:613-616` caducou hoje.** Ele diz *"não
  proponho sprint nova; fica nomeado aqui para a frente 14 não fechar sem
  alguém decidir se materializa"* — ela decidiu, e a sprint existe. A linha
  precisa apontar para a `COOP-NA-CONEXAO-NATIVA-01`. **Não editei: o arquivo
  não é meu.**
- **Nenhuma lápide ficou obsoleta por esta frente.** A da
  `COOP-SEM-INTERRUPTOR-01` (`gui/main.glade:248-259`) continua válida, e virou
  a evidência do §2.5 da sprint 2 — é ela que registra a frase dela.
- **As duas sprints entram na fila em ordem:** a `RESERVA-DO-POSTO-01` primeiro
  (a `COOP-NA-CONEXAO-NATIVA-01` a declara em `depois_de`, porque as duas
  escrevem no `ensaios.csv`).
- **A `RESERVA-DO-POSTO-01` tem uma tarefa que não é dela e não é minha:** se a
  medição pedir um prazo diferente, alguém tem de decidir se
  `RECONNECT_ONLINE_CHECK_INTERVAL_SEC` acompanha. A sprint diz que **não**
  acompanha (os dois valerem 30 s é coincidência de origem), mas isso é uma
  afirmação minha e não uma medição.
- **Duas perguntas para ela, escritas nas sprints e repetidas aqui**, porque são
  as que travam trabalho:
  1. *quando o controle derrubado volta **pelo cabo** (para carregar), ele deve
     retomar o Jogador 1?* (RESERVA, §7);
  2. *o LED de jogador é exceção ao "no modo nativo devolvemos o controle pra
     Steam"?* (NATIVA, §10).
