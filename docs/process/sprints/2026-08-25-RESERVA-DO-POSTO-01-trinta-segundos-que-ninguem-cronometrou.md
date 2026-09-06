---
sprint: RESERVA-DO-POSTO-01
estado: aberta
posse:
  # A constante e o caderno. `backend_pydualsense.py` colide com a
  # COOP-QUE-NAO-DESMONTA-01, que é quem a criou hoje — o `depois_de` abaixo
  # serializa em vez de proibir. A posse aqui é de LINHA, não de arquivo:
  # esta sprint mexe em `PRIMARIO_RESERVA_SEC`, nos dois `logger.debug` da
  # reserva e em nada mais. Precisou de outra linha, RELATA (R1).
  RESERVA-1:
    - src/hefesto_dualsense4unix/core/backend_pydualsense.py
    - tests/unit/test_coop_bancada_de_queda_do_primario.py
  RESERVA-2:
    - docs/data/ensaios.csv
    - docs/data/mapa-controles.csv
cria:
  - tests/unit/test_reserva_do_posto_de_primario.py
nao_toca:
  - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
  - src/hefesto_dualsense4unix/daemon/connection.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/
depois_de:
  - COOP-QUE-NAO-DESMONTA-01
  - MESA-DE-QUATRO-01
bancada: true
---

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.1 — família do co-op; a MESA-DE-QUATRO-01 (FECHO, com ela) diz o que ainda está vivo; não se despacha pelo id antes dela.

# RESERVA DO POSTO-01 — trinta segundos que ninguém cronometrou

**25/08/2026. GRAU: MEDIDO** onde a linha traz âncora de arquivo:linha;
**INFERIDO DO CÓDIGO** onde diz; **NÃO MEDIDO** onde diz.

**Índice:** o balde de co-op da [SPRINT_ORDER §frente 14](../SPRINT_ORDER.md).

**Por que ela nasce.** A frente BG-01 de hoje curou o Jogador 2 que morria a
cada piscada do primário no rádio, e para isso teve de escolher **por quanto
tempo o posto de Jogador 1 fica guardado para quem caiu**. Escolheu 30 s, e
**declarou a escolha como dela, não como medição do gesto dela**
([BG-01](../agentes/2026-08-25/BG-01.md)). A decisão dela, hoje: **ela mede
antes de eu fixar.** Fica em 30 s até lá.

Esta sprint é o roteiro dessa medição — e o conserto do instrumento que hoje
não deixa fazê-la.

---

## 1. O defeito, em uma frase

**O produto decide quem é o Jogador 1 com um prazo de 30 s que ninguém
cronometrou contra o controle dela, e o journal de hoje não consegue
cronometrá-lo — ele é cego exatamente às voltas que estouram o prazo.**

## 2. O que está medido

### 2.1 O número existe, tem razão escrita, e a razão não é uma medição da volta

`core/backend_pydualsense.py:301` — `PRIMARIO_RESERVA_SEC: float = 30.0`.

O comentário que o acompanha (`:282-300`) dá duas justificativas, e as duas são
**analogia**, não cronometragem:

| justificativa | o que ela é de fato |
|---|---|
| "a MESMA janela que o `reconnect_loop` já usa" (`daemon/connection.py:58`, `RECONNECT_ONLINE_CHECK_INTERVAL_SEC = 30.0`) | dois prazos coincidirem não torna nenhum dos dois medido |
| "as duas piscadas medidas do journal foram 8 s e 27 s" | **duas** amostras, de um journal de 02/08 lido para outro fim, e a de 27 s encosta no teto |

**A segunda é a que preocupa.** 27 s de 30 s é 90% do prazo. Uma amostra de duas
não diz se a distribuição tem cauda; diz que ela pode ter.

### 2.2 O mecanismo, e onde ele decide

Três funções, todas sob o `_io_lock` do backend:

- `:2414-2422` `_reservar_o_posto_de_primario` — o posto é guardado nos DOIS
  caminhos de queda (`_close_handles` e o `disconnect()` do `reconnect()`);
- `:2424-2442` `_posto_reservado_de_volta` — **é aqui que a reserva caduca**:
  `self._relogio() - quando >= PRIMARIO_RESERVA_SEC` esquece o posto;
- `:2443-2480` `_recompute_primary` — a única exceção à regra da 1ª chave: o
  deposto que volta dentro da janela **retoma o posto mesmo já havendo outro
  sentado nele**.

### 2.3 O relógio é o do PRODUTO, e isso é um requisito, não um detalhe

`self._relogio = time.monotonic` (seam introduzido pela BG-01), e o prazo corre
a partir do instante em que o **daemon percebeu** a queda — não do instante em
que o controle apagou. **A medição desta sprint tem de usar o mesmo relógio**,
senão escolheríamos a constante com uma régua diferente da que a consome. É a
armadilha nº 1 desta casa, aplicada a um número em vez de a uma feature.

### 2.4 A linha do mapa que espera este ensaio existe, e a metade dela está vazia

`docs/data/mapa-controles.csv`, `combinacao.slot_jogador.estabilidade@dualsense`
— *"O número de jogador se mantém quando outro controle entra ou sai?"*

```
cabo_aciona:     parcial
cabo_de_onde_sei: medido
cabo_evidencia:  o numero NAO se mantem: com a queda de um controle do cabo o
                 daemon renumerou (event29 P4->P3) e devolveu (P3->P4) quando
                 ele voltou. Reversivel e simetrico (olho-dela, 12/08 22:00)
radio_aciona:    (VAZIO)
```

**O cabo foi medido em 12/08; o rádio nunca.** E é no rádio que o defeito vive —
no cabo o primário praticamente não cai. A coluna vazia é o buraco que esta
sprint preenche.

### 2.5 O caderno aceita o dado, e tem uma regra dura

`docs/data/ensaios.csv`: 178 linhas, 14 colunas. **Medido em 25/08/2026:
`linha_id` fora do mapa em 0 de 178, `linha_id` vazio em 0 de 178.** Ou seja,
todo ensaio pendura numa linha do mapa — e a desta medição é a do §2.4. Não
inventar `linha_id` novo: se um ensaio não couber em nenhuma linha do mapa, é a
linha do mapa que falta, e isso é outra tarefa.

## 3. O instrumento não existe ainda — e é cego justamente onde interessa

**Este é o achado desta sprint, e ele vem antes de qualquer bancada.**

O nível de log padrão é `INFO` (`utils/logging_config.py:56` —
`level or os.getenv("HEFESTO_DUALSENSE4UNIX_LOG_LEVEL") or "INFO"`). Contra isso,
os três eventos da reserva:

| evento | nível | quando sai |
|---|---|---|
| `primario_deposto_reservado` (`:2422`) | **DEBUG** — mudo | a queda: o instante `t0` |
| `primario_reserva_caducou` (`:2437`) | **DEBUG** — mudo | a volta demorou MAIS que o prazo |
| `primario_retomou_o_posto` (`:2473`) | INFO | a volta coube no prazo: o instante `t1` |

E `controller_primary_bound` (`:2506`, INFO) sai a cada troca efetiva de
primário, com transporte.

**A consequência, e ela é o motivo desta sprint:** com o daemon como ela o roda,
o journal registra `t1` **só quando a volta coube nos 30 s**. Voltas de 45 s, de
2 min, de "fui buscar o cabo" não deixam rastro nenhum — a reserva caduca em
silêncio e o controle entra no fim do dict.

**Medir a distribuição com este instrumento é medir só as amostras que já cabem
no número que se quer justificar.** É a régua confirmando a si mesma, e nenhuma
quantidade de repetições conserta isso.

**E há um segundo buraco, medido:** com DOIS controles na mesa, a queda de um
deles **não** produz `controller_disconnected` (`daemon/connection.py:575`).
Aquele evento sai na transição online→offline do probe, e o probe pergunta ao
`is_connected()` do backend, que é `any(handle.connected)` sobre TODOS os
handles (`core/backend_pydualsense.py:2712-2718`) — com o outro controle de pé,
a resposta continua `True` e a transição nunca acontece. **A queda de UM
controle não tem linha própria em INFO em lugar nenhum.**

## 4. As tarefas

### RESERVA-1 — os dois eventos da reserva sobem para INFO

`core/backend_pydualsense.py:2422` e `:2437`: `logger.debug` → `logger.info`.

**Por que isto não é ruído.** Os dois eventos saem **uma vez por queda de
primário**, não por tick. O caso mais barulhento já medido nesta casa foram
quatro trocas em 22 minutos (journal dela de 02/08, relatado pela BG-01) — oito
linhas em 22 minutos, contra um journal que já registra `controller_connected` e
`controller_primary_bound` no mesmo evento.

**Por que é obrigatório antes da bancada.** Sem `primario_deposto_reservado` em
INFO não existe `t0`; sem `primario_reserva_caducou` em INFO não existe a
contagem de quantas voltas ESTOURARAM o prazo — que é a metade da medição que o
instrumento de hoje esconde.

**Acrescentar ao `primario_deposto_reservado` o campo `transporte`** (o
`self._transport` já está à mão): uma queda no cabo e uma no rádio não são a
mesma amostra, e sem o campo o caderno não consegue separá-las depois.

**A mordida.**
`tests/unit/test_reserva_do_posto_de_primario.py::test_a_queda_e_a_caducidade_saem_em_info` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— com o logger capturado em nível INFO, derrubar o primário emite
`primario_deposto_reservado` com `transporte`, e avançar o relógio virtual além
do prazo emite `primario_reserva_caducou`. Arrancada a cura (voltando os dois a
`debug`), o teste reprova dizendo que o journal de INFO não viu a queda —
**que é literalmente o defeito do §3**.

**Prova de tela:** cosmética pré-aprovada (é journal, não tela).

### RESERVA-2 — a janela abre de par em par para a sessão de medição

Sem isto, a bancada só mede as voltas que já cabem (§3).

**Três caminhos, com o preço de cada um. É escolha de produto onde diz que é.**

| caminho | o que custa | superfície nova |
|---|---|---|
| **(a) editar a constante e reiniciar o daemon** | um gesto de dev por sessão, e o reinício é obrigatório — *o daemon vivo é mais velho que o código* (install editable: a cura só vale no próximo `start`) | **nenhuma** |
| **(b) variável de ambiente lida no import** | ela não edita código; mas nasce uma variável que ninguém documenta e que sobrevive à sprint | uma env nova, para sempre |
| **(c) método de IPC + flag no ensaio** | o mais confortável de rodar; **exige handler novo no daemon** | um método de IPC, e ele é público |

**Recomendação com o preço na mesa: (a).** É o único que não deixa superfície
depois que a medição terminar, e o custo — reiniciar o daemon uma vez no começo
da sessão e outra no fim — é um gesto que a bancada já faz por outros motivos.
**Se ela preferir (b) ou (c) pela comodidade, a sprint muda de tarefa e não de
mordida.**

**Durante a sessão, o valor é `3600.0`** (uma hora): grande o bastante para que
NENHUMA volta caduque, e é isso que torna a amostra honesta. **Voltar a
constante ao valor de produção antes de commitar qualquer coisa** — e o teste
abaixo é o que impede esquecer.

**A mordida.**
`tests/unit/test_reserva_do_posto_de_primario.py::test_a_constante_de_producao_nao_saiu_da_bancada` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— afirma que `PRIMARIO_RESERVA_SEC` está no valor de produção e **não** num
valor de sessão de medição (nada acima de 120 s). Arrancada a cura, um `3600.0`
esquecido atravessa a leva e o posto fica pendurado numa hora — o gesto oposto
dela (desligar um controle e seguir com o outro) quebraria pelo resto do boot.

**Prova de tela:** cosmética pré-aprovada.

### RESERVA-3 — o número novo entra, com a medição ao lado

**Só depois de a bancada correr.** A constante recebe o valor que a distribuição
mandar, e o comentário de `:282-300` **substitui** as duas analogias pela
medição — não as guarda ao lado. É a regra desta casa: *fato errado se
SUBSTITUI*, e "escolhi por analogia" caduca no instante em que existe a
cronometragem.

**O que fica escrito no lugar:** quantas voltas, em que transporte, mediana e a
maior; e **o percentil escolhido, com a frase que explica o que se perde acima
dele** — não o número sozinho.

**A mordida.** `::test_o_prazo_cobre_a_volta_medida` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— com as voltas reais do caderno como fixture, o prazo vigente cobre a fração
declarada delas. Arrancado o valor novo (voltando a 30,0 se a medição pedir
mais), o teste reprova nomeando as amostras que passam a não caber.

**Prova de tela:** cosmética pré-aprovada.

### RESERVA-4 — a linha do mapa deixa de ter metade vazia

`radio_aciona` de `combinacao.slot_jogador.estabilidade@dualsense`, com
`radio_de_onde_sei = medido`, `radio_evidencia` = a frase do que se viu, e
`provado_em` / `provado_por` preenchidos.

**A mordida.** `scripts/check_paridade_transporte.py` já é o portão: ele reprova
afirmação forte sem ensaio que a sustente. Preencher `radio_aciona` sem escrever
as linhas no `ensaios.csv` faz ele reprovar — e é exatamente o que se quer.

**Prova de tela:** cosmética pré-aprovada (o `specs.html` é gerado, e a mudança
é de dado).

## 5. O roteiro de bancada — é DELA

**Precisa:** dois DualSense, os dois **no rádio**, e o daemon rodando com a
RESERVA-1 e a RESERVA-2 já dentro.

**Antes de começar**, com o daemon já reiniciado:

```bash
# 1. o daemon vivo é o daemon novo? (sem isto a sessão inteira mede o código velho)
journalctl --user -u hefesto-dualsense4unix -n 5 --since '-2 min'

# 2. a janela está aberta de par em par?
#    (a linha da constante, na árvore que gerou o daemon que está rodando)
grep -n 'PRIMARIO_RESERVA_SEC' src/hefesto_dualsense4unix/core/backend_pydualsense.py
```

**A volta, uma vez** (repetir, ver §5.1):

1. os dois controles ligados, no rádio, e o co-op de pé — confira na tela que
   há **Jogador 1 e Jogador 2** antes de derrubar nada;
2. anote qual dos dois é o Jogador 1. **É esse que cai.**
3. derrube o Jogador 1 **do jeito que ele cai de verdade**. As três quedas não
   são a mesma coisa e têm de ser anotadas separadas:
   - **PS longo** (desligar pelo botão) — o gesto dela;
   - **sair de alcance** (levar o controle para outro cômodo e voltar);
   - **bateria acabando** — não se provoca; se acontecer, é a amostra mais
     valiosa da sessão, anote;
4. **cronometre nada.** O relógio é o do daemon (§2.3) — o cronômetro dela
   mediria outra coisa;
5. religue o controle e espere ele voltar sozinho;
6. **quando a tela mostrar o Jogador 1 de volta no controle certo**, a volta
   terminou.

Depois de cada volta, a leitura do relógio do produto:

```bash
journalctl --user -u hefesto-dualsense4unix --since '-10 min' \
  | grep -E 'primario_deposto_reservado|primario_retomou_o_posto|primario_reserva_caducou|controller_primary_bound'
```

`t1 - t0` entre `primario_deposto_reservado` e `primario_retomou_o_posto` **é a
volta**. Se aparecer `primario_reserva_caducou` no meio, a janela da sessão
estava pequena — pare, conserte a §RESERVA-2 e recomece; a amostra está perdida.

### 5.1 Quantas vezes, e por que não "algumas"

**Mínimo 10 por tipo de queda**, e a razão é aritmética, não gosto: com duas
amostras (o que existe hoje) não há cauda a observar. Com dez, a maior das dez
já é um piso honesto para o percentil.

**Se as dez couberem folgadas em 30 s, a sessão terminou e o número fica.** Esse
é um resultado, e dos bons: confirma a escolha da BG-01 com medição em vez de
analogia. **Não é fracasso da sprint — é o objetivo dela.**

### 5.2 O que anotar, coluna por coluna

Uma linha em `docs/data/ensaios.csv` por volta:

| coluna | o que vai |
|---|---|
| `id` | `reserva-primario-N` (N sequencial) |
| `linha_id` | `combinacao.slot_jogador.estabilidade@dualsense` |
| `transporte` | `radio` |
| `quando` | ISO do `primario_deposto_reservado` |
| `suspeito` | o tipo de queda: `ps-longo`, `fora-de-alcance`, `bateria` |
| `presente` | `sim` |
| `resultado` | `retomou` ou `caducou` |
| `observado_por` | `olho-dela` |
| `fonte` | `RESERVA-DO-POSTO-01` |
| `nota` | **o número em segundos**, e o que ela viu na tela |

**`degrau` e `ponte` ficam vazias** — estão vazias em 178 de 178 e não é esta
sprint que muda isso.

**Nunca escrever MAC no caderno.** O que identifica o controle na anotação é
"o que era Jogador 1", não o endereço.

## 6. O risco que o número grande carrega — e ele é o outro lado da mesma moeda

**O gesto oposto é dela também:** desligar um controle **de propósito** e seguir
jogando com o outro. Por `PRIMARIO_RESERVA_SEC` inteiros, o produto ainda guarda
o posto do que ela desligou.

**O que acontece nesse intervalo, lido no código** (`:2443-2480`, **INFERIDO DO
CÓDIGO**, não medido na bancada):

1. ela desliga A, que era o Jogador 1;
2. B é promovido e vira o Jogador 1 — é ele que ela está segurando;
3. **se A voltar dentro da janela**, A retoma o posto e B **volta a ser o
   Jogador 2**, no meio do jogo. Do ponto de vista dela, o personagem trocou de
   mão sem ninguém pedir.

**E há um jeito de A voltar que não é "ela mudou de ideia":** **plugar o
controle descarregado no cabo para carregar.** O `norm_mac` é estável entre USB
e BT (`daemon/subsystems/identity.py`, cabeçalho), então o handle que nasce no
cabo é do MESMO controle — a reserva não distingue "voltou para jogar" de
"voltou para carregar". Plugar o controle morto na tomada durante a partida
tomaria o Jogador 1 de quem está jogando.

**Isto é INFERÊNCIA a partir do código, e é a segunda coisa a medir na
bancada** — exercício RESERVA-5, abaixo. Se a bancada mostrar que acontece,
**a pergunta vai para ela e não se resolve aqui**: §7.

### RESERVA-5 — a volta pelo cabo é a mesma volta?

**Roteiro:** dois controles no rádio, derrube o Jogador 1, jogue com o outro, e
**dentro da janela** plugue o derrubado no cabo. Anote se o Jogador 1 voltou
para o controle plugado.

**A mordida.**
`tests/unit/test_reserva_do_posto_de_primario.py::test_a_volta_pelo_cabo_retoma_o_posto` <!-- ref-externa: nasce nesta sprint; a ausência é o trabalho -->
— na bancada de queda programável (`tests/unit/test_coop_bancada_de_queda_do_primario.py`),
o deposto volta com transporte `usb` dentro da janela: o teste afirma o que o
produto FAZ hoje, seja retomar ou não. **É teste de caracterização, e é de
propósito** — sem ele a pergunta da §7 vai para ela sem o fato ao lado.

**Prova de tela:** cosmética pré-aprovada.

## 7. O que precisa DELA

1. **O número, depois da bancada.** A sprint não fixa nada antes de a §5 correr;
   30 s continua valendo até lá.
2. **A escolha da §RESERVA-2** — (a), (b) ou (c). Recomendação (a), com o preço
   dos três na mesa.
3. **E a pergunta do §6, se a RESERVA-5 confirmar:** *quando o controle
   derrubado volta **pelo cabo**, ele deve retomar o Jogador 1?* Os dois lados
   têm razão, e por isso não decido:
   - **retomar** é coerente — é o mesmo controle, e a reserva existe justamente
     para que a piscada não embaralhe ninguém;
   - **não retomar** é o que ela esperaria de plugar na tomada — carregar não é
     entrar no jogo.

   Uma terceira saída, se ela quiser: **retomar só se voltar pelo MESMO
   transporte em que caiu.** Preço: o produto passa a ter uma regra a mais para
   explicar, e quem cai no rádio e volta no cabo de propósito perde o posto.

## 8. O que esta sprint NÃO faz

- **Não mexe no mecanismo da reserva.** A eleição, o aviso e a cessão do node
  são da `COOP-QUE-NAO-DESMONTA-01`, que fechou hoje. Aqui se mede um prazo.
- **Não mexe em `RECONNECT_ONLINE_CHECK_INTERVAL_SEC`.** Os dois valerem 30 s
  hoje é coincidência de origem, não acoplamento — e se a medição pedir outro
  número para a reserva, o do `reconnect_loop` **fica onde está**.
- **Não toca em `coop.py`.** O número do jogador exibido é de lá; o posto de
  primário é do backend.
- **Não transforma o prazo em opção de configuração.** O comentário de `:299-300`
  já diz por quê, e continua verdade: *"é o prazo de um mecanismo interno, e a
  usuária não tem como saber que ele existe"*.

## 9. O que sobrou para o próximo

- **A queda por bateria nunca foi provocada nesta casa**, e é a que mais
  demora a voltar (achar o cabo, plugar, esperar o link). É a amostra que mais
  moveria o número, e a única que não se agenda.
- **Quatro controles no rádio ao mesmo tempo nunca foi medido aqui** — o maior
  ensaio foi de dois. Com quatro, uma queda de primário reordena três postos, e
  nada disso foi observado.
- **NÃO VERIFICADO:** se a volta demora mais no rádio quando há mais controles
  na mesa disputando o mesmo adaptador. A conta de slots
  (`daemon/subsystems/bt_mic.py`, A/B de 25/07) é sobre banda, não sobre tempo
  de reassociação, e não responde isto.
