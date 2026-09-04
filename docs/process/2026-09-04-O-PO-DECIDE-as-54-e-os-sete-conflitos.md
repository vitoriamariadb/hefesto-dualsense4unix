# O PO decide as 54 — e os sete conflitos que só apareceram lendo tudo junto

**04/09/2026, tarde.** Ela disse, com estas palavras:

> *"estude o projeto sozinho. entenda tudo. Depois seja o po e orquestrador e
> todas as sprints restantes"*

É a terceira vez que ela delega decisão, e as três estão escritas:

| quando | palavra dela |
| --- | --- |
| 25/08 | *"vc tem via specs e projeto tudo o que é necessário pra tomar todas as decisões"* |
| 04/09, madrugada | *"não precisa me perguntar mais nada. já sabe o suficiente pra decidir por mim"* |
| 04/09, tarde | *"seja o po e orquestrador"* |

Este arquivo é o exercício desse mandato. **§1 são os sete conflitos** entre as
54 perguntas abertas e as dezesseis que ela já decidiu — o trabalho que nenhuma
das dez listas, sozinha, tinha como fazer. **§2 são as 54, decididas.** **§3 é
um fato que caiu.** **§4 é a fila que sai daqui, por posse de arquivo.**

**A regra que eu segui, e ela é uma só:** onde a recomendação escrita não
contradiz nenhuma decisão dela, eu a adoto sem inventar uma quarta opção — ela
foi escrita por quem mediu a aba. Onde contradiz, **ela ganha**, e eu escrevo o
porquê. Sete vezes contradisse.

---

## 1. OS SETE CONFLITOS

As dez listas nasceram em paralelo, uma por aba, no mesmo dia em que as
dezesseis decisões dela eram escritas. **Nenhuma das dez pôde ler as
dezesseis** — e por isso sete recomendações propõem o contrário do que ela já
tinha escolhido. Achar isso é o trabalho de quem lê as duas fontes ao mesmo
tempo; é o que o `COMO-COORDENAR-UMA-LEVA.md` chama de reconciliar duas
taxonomias que nenhum dos produtores sabia que divergiam.

| # | onde | a recomendação dizia | a decisão dela diz | quem ganha |
| --- | --- | --- | --- | --- |
| C-1 | `02` [01] | um **pingo vivo** no cabeçalho do card | **D-06** — *"Casco borda externa lightbar borda interna"* | **D-06**. A cor viva já ganhou lugar: o anel interno. O pingo seria um segundo sinal para o mesmo fato. |
| C-2 | `02` [03] | um selo só, **e a dica passa a dizer a verdade** (o selo continua sendo o firmware) | **D-12** — *"o botão é pra ligar o microfone e ele ser ouvido no canal específico dele"* | **D-12**. Sob o conceito dela não há duas camadas a conciliar: o selo diz o estado COMPOSTO, e só diz ATIVO quando as quatro faces concordam. É a opção 3, e ela **já está paga** — a `MICROFONE-UM-ATO-01` constrói o leitor de PipeWire que a recomendação dizia não existir. |
| C-3 | `03` [04] | **o campo pisca** (sem palavra) | **D-01** — *"No próprio cartão, como a recusa"* | **D-01**. A aba 03 é uma das cinco que a D-01 fecha *com uma peça só*. Escolher o pisca aqui quebra a peça e deixa a aba sem o canal que as outras quatro terão. |
| C-4 | `04` [02] | o botão **mostra** o estado do automático; mudar continua na aba Perfis | **D-13** — *"Um interruptor no topo da aba Iluminação"*, e *"ok aceito o caminho"* de gravar a cor ao desligar | **D-13**. Ela escolheu o interruptor de verdade e aceitou o custo (~30 px) e a consequência (desligar grava a cor de cada controle no ato). Mostrar sem poder mudar é menos do que ela pediu. |
| C-5 | `05` [03] | uma linha laranja **na faixa embaixo da grade**, só quando travada | **D-14** — *"Uma linha de estado por coluna"* | **D-14**. Por coluna, com os três estados que ela nomeou — inclusive *"o jogo controla"*. Não encolhi a decisão dela para economizar pixel: o custo foi declarado e aceito. |
| C-6 | `05` [04] | o recado de sucesso vai para a **faixa de avisos, embaixo** | **D-01** — no próprio cartão | **D-01**. Mesma peça, mesmo lugar, nas cinco abas. Dois canais de sucesso em duas abas seria a doença que esta casa persegue: duas traduções do mesmo fato. |
| C-7 | `01` [04] | uma frase na **coluna Atenção** quando a mesa passa de quatro | **D-07** — *"O `+N` do quinto entra na mesma linha"* da frase da mesa vazia | **D-07**. A pergunta morre: a S-12 já carrega o `+N`. Abrir um segundo canal para o mesmo fato é o que a C-1 e a C-6 recusam. |

**O fio que atravessa cinco dos sete é um princípio só, e vale como regra:**

> **UM FATO, UM SINAL.** Quando a tela já tem onde dizer uma coisa, a resposta
> certa não é um lugar novo — é usar o que existe. C-1, C-3, C-6 e C-7 são
> quatro propostas de segundo canal para um fato que já tem o primeiro.

E os outros dois (C-2, C-4, C-5) têm a forma que ela mesma nomeou em 04/09:
**a recomendação encolheu o que ela pediu para caber no que era barato.** É a
mesma lição da D-12, e ela já custou três vezes num dia.

---

## 2. AS 54, DECIDIDAS

Onde não há nota, a decisão é a recomendação escrita na lista da aba, adotada
sem mudança. Onde há nota, ela diz o que mudou e por quê.

### `01-jogar` — 4

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | as duas frases órfãs (aviso do Nativo, "Ponte com o jogo") | **Na coluna Atenção, só má notícia.** Casa com a D-10, que já mandou as três frases órfãs para lá. |
| 02 | "Player N" num controle que o jogo não recebeu | **"Player N", esmaecido enquanto espera.** A D-04 fixou a palavra; o esmaecido não a toca e mata o único dano — o cartão afirmar um jogador que não existe. |
| 03 | onde fica o interruptor do cadeado | **Volta para a Jogar, embaixo de Modo.** A causa já está na coluna Atenção, a um palmo. |
| 04 | mesa com mais de quatro | **MORREU — C-7.** A D-07 já carrega o `+N` na frase da mesa. |

### `02-controles` — 10

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | onde aparece a cor viva | **MORREU — C-1.** A D-06 dá o anel interno. |
| 02 | o travessão da barra de luz | **Palavra curta no lugar do travessão, frase inteira no hover.** As quatro palavras: `Jogo` · `Steam` · `Não sei` · `Apagada`. |
| 03 | o selo ATIVO/MUDO fala de quê | **O selo diz o estado COMPOSTO — C-2.** ATIVO só quando firmware e canal concordam; a discordância vira o recado da D-01. |
| 04 | o botão avisa antes ou depois | **O botão apaga e a dica diz por quê.** É a D-03 aplicada a esta aba. |
| 05 | mexer no volume por esta tela | **A barra pintada vira clicável.** Não mexe no desenho e destrava o ♪, que hoje não tem como sair do cinza. |
| 06 | o alto-falante ganha "Devolver" | **Fica fora, e a dica do ♪ diz o preço.** É a decisão dela de 31/08 aplicada ao gêmeo. |
| 07 | contar a degradação do vpad | **Uma marca na palavra e o motivo no hover.** |
| 08 | confessar o mudo que caiu noutro controle | **Vira aviso no cartão, como as recusas.** |
| 09 | onde a tela mostra o alto-falante mudo | **O ♪ acende**, e o `alto-estado` invisível sai do desenho. |
| 10 | `[L3]` ou cor | **Fica `[L3]`.** |

### `03-gatilhos` — 4

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | a descrição do modo escolhido | **Dica do campo, com o texto desta tela.** |
| 02 | a curva pronta pode trocar o modo | **Fica como está, e a dica avisa** antes do clique. |
| 03 | botão de reenvio | **Um botão na faixa que já existe** (`--r-acao`), mandando os dois gatilhos da coluna. |
| 04 | a tela avisa quando o efeito chega | **No cartão, pela peça da D-01 — C-3.** Sem pisca: um fato, um sinal. |

### `04-iluminacao` — 4

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | a razão do tracejado | **Uma linha só quando há ressalva.** É a D-02, e a peça é a mesma. |
| 02 | o automático do perfil | **Interruptor de verdade na aba — C-4**, com a gravação da cor ao desligar, como a D-13 mandou. |
| 03 | reenviar uma cor de fora da guia | **A caixa do hexadecimal vira o botão.** |
| 04 | o brilho guardado com a barra que não acende | **Uma frase curta.** O silêncio está fora de questão. |

### `05-vibracao` — 6

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | publicar a barra que arrasta | **JÁ FOI — §3.** As treze páginas foram publicadas na madrugada. |
| 02 | as duas explicações | **Só a nota do Testar sobe para a tela.** A do Auto fica no `?`. |
| 03 | avisar a vibração travada | **Uma linha de estado POR COLUNA — C-5**, com os três estados da D-14. |
| 04 | confirmar o clique | **No cartão, pela peça da D-01 — C-6.** |
| 05 | os dois donos da força | **Uma linha de MESA embaixo da grade.** Devolve o caminho para pôr a mesa em Auto, perdido em 03/09, e faz "herdado" ficar óbvio sem palavra. |
| 06 | o clique que a interface não entende | **As duas frases que já existem sobem para o cartão.** |

### `06-navegacao` — 5

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | o portão de modo | **Apaga o interruptor e escreve ao lado**, na tira de estados. É a D-03 com a D-02. |
| 02 | as três regiões do touchpad | **Ficam, com a marca de que não disparam.** A D-15 já mandou que ficassem; a marca impede a tela de prometer. **A marca nasce FIXA** — a viva espera o daemon publicar `ponteiro_do_sistema`, e isso é sprint própria. |
| 03 | o botão PS na tabela | **Fica fora, e a razão vira dica.** O PS é a saída de emergência. |
| 04 | as três verdades escondidas | **Uma tira de aviso sob a tabela.** O que vai ser APAGADO não mora num hover. |
| 05 | o custo de desligar o teclado | **Uma frase permanente enquanto estiver desativado.** |

### `07-lancadores` — 4

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | o reparo manual sem caminho | **Os dois, só quando faz falta** — botão e linha à mostra, só no estado de linha intocável. |
| 02 | a frase que manda a um botão inexistente | **A frase para de nomear lugar.** Uma frase, um dono, certa nas duas telas. |
| 03 | de onde o aviso some | **As duas recusas calam tudo.** Aviso que sobrevive à resposta dela ensina que o botão não obedece. |
| 04 | 63 e 22 na mesma tela | **O corpo nomeia o conjunto** — "da sua biblioteca (instalados ou não)". |

### `08-conexoes` — 8

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | o veredito do Check-up | **No cabeçalho, ao lado de "Examinado".** É a D-16. |
| 02 | publicar os treze endereços | **JÁ FOI — §3.** |
| 03 | o "o que fazer" das curas | **Cartão de cura na coluna da direita.** |
| 04 | o selo de procedência | **Só nas frases que não foram medidas aqui.** |
| 05 | reabrir uma ordem ignorada | **A linha fica na lista, apagada**, e o mesmo ⊘ desfaz. |
| 06 | botão travado | **Apaga, e o motivo vira um `?` ao lado.** D-03, com o texto vindo do produto e nunca do desenho. |
| 07 | o que não cabe na tela | **Um "+N" no fim de cada lista.** A diferença entre não mostrar e esconder. |
| 08 | a frase do rodapé do Mapa | **Trocar pela verdade.** |

### `09-sistema` — 3

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | "Atualizar" faz dois trabalhos | **O nome vira o trabalho: "Reaplicar ajustes".** A metade barata já roda sozinha a cada 2 s. |
| 02 | botão sem trabalho a fazer | **Apagado e ainda assim responde.** É a única forma que diz o porquê sem exigir o rato, e é a D-03 com a resposta ao clique por cima. |
| 03 | nove segundos e meio calado | **O botão diz que está trabalhando** — "Reaplicando…". Fala DURANTE a espera, no lugar exato do clique. |

### `10-perfis` — 6

| # | a pergunta | DECIDIDO |
| --- | --- | --- |
| 01 | a regra maior que a tela | **Cadeado no campo, frase no hover.** |
| 02 | a tela manda você para onde | **A tela avisa e para por aí.** O editor avançado é motor, e volta como sprint quando houver razão medida. |
| 03 | a frase da Prioridade | **A frase dela entra no desenho — e vão as DUAS**, a dela primeiro, seguida da explicação do Universal em zero, que o texto de hoje tem e o dela não. |
| 04 | o campo do jogo | **Só a tira, e o campo se corrige** — o endereço colado vira o número na frente dela. |
| 05 | a tira que corta o fim | **A tira ganha uma segunda linha.** A metade que avisa está no fim da frase. |
| 06 | os dois avisos do Modo | **Preço no hover, aviso do rádio em linha** — como ela pediu por escrito. **Espera o quadro Modo existir**, e ele é a maior ausência isolada do inventário. |

---

## 3. UM FATO QUE CAIU, e ele encurta a fila

**O balde `PUBLICAR` está VAZIO.** O documento das 232 linhas diz que seis
features estão prontas no `mockup/` e param numa palavra dela. Medido agora:

```
$ .venv/bin/python scripts/check_o_desenho_aprovado.py
desenho: 13 página(s) na bancada `mockup/`
  o produto já tem ..... 13
  o produto está atrás . 0  (0 em trabalho)
```

As treze páginas foram publicadas na madrugada de 04/09 (commit `2a9cfa49` e os
dois anteriores). **Nada espera o `--publicar` dela.** Isso mata a pergunta
`05` [01], a `08` [02], e a espera declarada em `10` [06] sobre o slider da
prioridade.

**E o número da fila envelheceu junto.** A régua de paridade hoje:

```
DIFERENTE 125 · FALTA_NO_HTML 101  ->  226 abertas, não 232
IGUAL 107 · SO_NO_HTML 59 · NAO_DA_PARA_SABER 4  ->  170 fechadas
```

Descontando os 52 que não são dívida, **a fila real é 174**, e ela agora tem
esta forma:

```
   0  PUBLICAR   ← morreu: publicado na madrugada
  43  LIGAR      ← trabalho mecânico, nenhuma decisão
  74  DESENHO    ← DECIDIDAS neste arquivo. Deixam de esperar.
  57  MOTOR      ← código novo
```

**As 74 do balde `DESENHO` eram 41% da fila e o único bloqueio que restava.**
Com as 54 decididas, **nada na fila espera por ela** até a validação final —
que continua sendo dela, e continua sendo a última (`SPRINT_ORDER.md` §0, FASE
5: *"Ao final eu faria apertando os botões."*).

---

## 4. A FILA QUE SAI DAQUI — quatro ondas, por POSSE DE ARQUIVO

A ordem não é por peso: é por **quem escreve qual arquivo**. Medido nesta
árvore, três arquivos são o gargalo da interface inteira:

| arquivo | quantos o abrem | quem pode |
| --- | ---: | --- |
| `interface/monta.py` | **18** módulos importam dele | um agente só, e antes das abas |
| `interface/hefesto_vivo.py` | o piloto das dez abas | um agente só, e antes das abas |
| `daemon/ipc_handlers.py` | T-02, T-08, T-09, T-10 | um agente só |

Por isso as duas primeiras ondas são pequenas e as abas vêm depois: **sem
isso, dez agentes disputam três arquivos**, e a colisão vira conflito de merge
em cima do trabalho de todos.

### ONDA 0 — A INFRA DE TELA · 2 frentes, posse disjunta

| frente | possui | fecha |
| --- | --- | --- |
| **P · O PILOTO** | `interface/hefesto_vivo.py` · `gui/ponte_da_tela.py` · `app/theme.py` | **T-01** a tela nua (ouvir `web-process-terminated` e recarregar; o ensaio que vive 20 min) · **T-05** a barra da janela · **T-07** o décimo alvo `marcado` · **S-01** o canal de recado de SUCESSO · o estado "em voo" do botão (`09` [03]) |
| **F · A FOLHA** | `interface/monta.py` · `interface/onde.py` | **S-03** o botão cinza com a razão na dica (CSS + o alvo, uma vez para as dez) · **S-02** a peça da linha de ressalva condicional (`:empty{display:none}`) |

### ONDA 1 — O MOTOR · 2 frentes

| frente | possui | fecha |
| --- | --- | --- |
| **D · O DAEMON** | `daemon/ipc_handlers.py` · `daemon/subsystems/hotkey.py` · `daemon/subsystems/gamepad.py` · `daemon/sensor_hub.py` · `core/evdev_reader.py` · `core/virtual_motion.py` (novo) <!-- ref-externa: a SENSOR-DE-VERDADE-01 CRIA este arquivo; ele ainda não existe --> · `profiles/schema.py` · `app/ipc_bridge.py` · `app/audio_saida.py` | **T-02** `mic.canal.set` — o ato inteiro · **T-08** o multiplicador por motor · **T-09** `sensor.set` de verdade, em qualquer modo e máscara · a metade de motor do **T-03** (as duas camadas do alto-falante) |
| **X · OS FATOS** | `docs/process/2026-09-03-O-TERCEIRO-NUMERO-*.md` · `docs/data/paridade-gtk-html.csv` | **T-06** a prosa que diz 14% sobre uma tabela que diz 27% · a retriagem do CSV com as 54 decididas (o que era `DESENHO` vira trabalho) |

**A ONDA 1 precisa da bancada** (T-02, T-08, T-09) e a bancada é uma só:
`scripts/bancada.sh reservar`, uma frente por vez para a parte do aparelho.

### ONDA 2 — AS DEZ ABAS · 10 frentes em paralelo, zero colisão

Cada frente possui **quatro arquivos e mais nada**: `interface/abaNN.py` <!-- ref-externa: molde de nome, não arquivo: são as dez, de aba01.py a aba10.py --> ·
`interface/pacotes/aNN_*.py` · `mockup/NN-*.html` · `interface/paginas/NN-*.html`.

Cada uma fecha, na sua aba: **as decisões da §2**, **as linhas do balde
`LIGAR`** (18 são da `01`, 16 da `08`) e **as linhas de `MOTOR` que são de
tela**. As três peças da Onda 0 e os métodos da Onda 1 já estão de pé — é o que
faz cada aba custar metade.

### ONDA 3 — O QUE SOBRA

**T-04** (a coluna "Ajuste próprio" que acende o que o disco não guarda) · os
**seis defeitos da §3 das 232 linhas**, que perdem trabalho dela em silêncio ·
e o que as dez abas relatarem como "pediu arquivo alheio".

### E DEPOIS

Publicação numa leva só (o que a Onda 2 desenhar de novo vai para a bancada com
a divergência declarada, e **para**) · os 30 portões depois do `git add -A` · a
suíte em oito lotes com a leva parada · e a FASE 5, que é dela.

---

## 5. O QUE EU **NÃO** DECIDI, e por quê

* **A barra da janela na sessão inteira.** Ela já decidiu `1-a` — só a janela
  do Hefesto. As duas linhas de `~/.config/gtk-3.0/settings.ini` continuam
  sendo dela, e ninguém as roda por ela: mudam programas que não são este.
* **A validação final.** É a FASE 5, e a regra da casa é de 27/07:
  *"interface só fecha com o olho dela"*. Decidir o desenho não é aprovar a
  tela.
* **Publicar desenho NOVO.** O que a Onda 2 criar de endereço novo vai para
  `mockup/` com a seção em `DIVERGENCIAS.md` e **para ali**. O `--publicar` do
  que ela ainda não viu não é decisão de PO — é a mesma porta que a
  `PROVA-DE-TELA-01` fechou.

---

## 6. A REGRA QUE ESTE ARQUIVO DEIXA

**Dez agentes em paralelo produzem dez recomendações coerentes consigo mesmas e
incoerentes entre si.** Sete das 54 contradiziam uma decisão dela que existia,
escrita, no mesmo dia — e nenhuma das dez tinha como saber. A coerência não
emerge da soma: **ela é um trabalho, e ele tem um dono só.**
