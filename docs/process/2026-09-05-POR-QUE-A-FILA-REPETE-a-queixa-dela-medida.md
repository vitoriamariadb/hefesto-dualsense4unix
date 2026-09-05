# Por que a fila repete — a queixa dela, medida

**05/09/2026.** Ela respondeu 41 decisões hoje e, ao terminar, escreveu:

> *"pior é que essas dúvidas e decisões já foram tomadas e repetidas várias
> vezes. acho que tem algo no projeto desatualizado. leia o specs.html por
> completo e o mapa do controle"*

**Ela está certa, e o número é redondo: as 41 já estavam decididas — todas as
41, no mesmo arquivo, no mesmo dia.** Não 30, não "quase todas". Quarenta e uma
de quarenta e uma.

E a hipótese dela sobre ONDE está o desatualizado é a única parte que a medição
não confirma: o `specs.html` e o mapa do controle estão em ordem, e não tinham
como responder pergunta nenhuma desta fila. O desatualizado tem outro endereço,
e ele está nomeado na §4.

---

## 1. O placar das 41

Contagem por veredicto, do trabalho das dez frentes que auditaram aba por aba:

| veredicto | quantas | o que significa |
| --- | ---: | --- |
| **REPETIDA** | **40** | já havia decisão registrada, e na maioria já havia CÓDIGO |
| **DADO** | **1** | a pergunta morreu com o fato antes de ser feita (05-Q1) |
| **MEDIÇÃO** | **0** | nenhuma foi classificada assim *pelo veredicto* — ver a ressalva abaixo |
| **NOVA** | **0** | nenhuma das 41 era pergunta inédita |

**A RESSALVA, e ela importa mais que a coluna:** "MEDIÇÃO" não aparece no
veredicto porque as dez frentes classificaram pela ORIGEM (a pergunta já foi
feita antes?) e não pelo DESTINO (quem tinha de responder?). Reparticionadas
por destino — *o que de fato responderia esta pergunta* —, as mesmas 41 dão:

| o que responderia | quantas |
| --- | ---: |
| ler o registro que já existe | **31** |
| a bancada: medir, não perguntar | **9** |
| nada — o fato já respondeu | **1** |

As 9 da linha do meio são as mesmas 9 que estão na §3. Elas não são uma fatia
separada das 41: são nove das quarenta REPETIDAS, contadas de novo por outro
critério, e digo isso aqui para o número não ser lido como 50.

**E dentro das 40 REPETIDAS, o que a resposta de hoje fez com o que já existia:**

| | quantas |
| --- | ---: |
| BATE, sem ressalva — a resposta de hoje é a decisão de ontem, palavra por palavra | 21 |
| BATE em parte — o miolo bate, um detalhe do esclarecimento de hoje diverge | 6 |
| **DIVERGE de frente — o produto fica com DUAS ORDENS** | **13** |

---

## 2. As que DIVERGEM — primeiro, porque são as que fazem o produto ter duas ordens

Ordenadas pelo custo: as que mandam ARRANCAR código entregue vêm antes das que
só acrescentam.

| # | pergunta | onde já tinha sido decidida | a de hoje | o que colide |
| --- | --- | --- | --- | --- |
| 1 | **03-Q4** · a tela avisa que o efeito chegou | **POR ELA**, 04/09, D-01: *"No próprio cartão, como a recusa."* — `docs/process/2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md:29` | *"o campo pisca em verde"* | O pisca foi recusado **em nome dela** no conflito C-3 (`2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md:41`) porque a D-01 fecha CINCO abas com uma peça só (02, 03, 05, 06, 09). A peça está viva em `src/hefesto_dualsense4unix/interface/hefesto_vivo.py:2218` (`_deu_certo_dizendo`), e `hefesto_vivo.py:2230-2232` carrega a ordem por escrito: *"Não construa nenhum dos dois."* Adotar o pisca só na 03 dá dois canais para o mesmo fato |
| 2 | **05-Q4** · a tela confirma o clique | idem D-01, e a faixa embaixo da grade foi recusada como conflito **C-6** (`O-PO-DECIDE:44`) | *"Linha embaixo da grade"* | É a mesma colisão da linha 1, pela outra ponta. As duas juntas perguntam uma coisa só: **a D-01 cai nas cinco abas, ou continua valendo?** |
| 3 | **03-Q3** · botão para mandar o efeito de novo | **POR ELA**, 27/08: *"Saiu 'Mandar de novo para o controle' — o Aplicar do rodapé já faz isso."* (`docs/process/sprints/2026-08-27-ONDA-GATILHOS-02-um-quadro-so-e-a-tela-que-nao-pula.md:69`); e ela aprovou a aba sem ele em 28/08 (`docs/data/decisoes-dela.csv:93`, *"a aba gatilhos atual é perfeita"*) | *"Nada novo"* | O botão foi **recriado por delegação** em 04/09 (`decisoes-dela.csv:142`) e está no disco: `interface/aba03.py:915`, quatro cópias no mockup aprovado, o gesto em `interface/pacotes/a03_gatilhos.py:2929`, e um portão que reprova a AUSÊNCIA em `aba03.py:1364`. Atender "nada novo" é arrancar código entregue e virar o portão do avesso. **Três ordens sobre um botão só, e a do meio não é dela** |
| 4 | **09-Q1** · o que o botão Atualizar passa a ser | por delegação, 04/09: *"O nome vira o trabalho: 'Reaplicar ajustes'"* (`decisoes-dela.csv:171`) | *"Segue fazendo os dois. Com mesmo nome"* | O botão **já não se chama "Atualizar"**: `interface/aba09.py:997` e `interface/paginas/09-sistema.html:1245` dizem "Reaplicar ajustes", no ar desde o commit `a45b7799`. A frase de hoje é ambígua entre *"com o nome Atualizar"* (rollback) e *"com um nome só"* (concordância), e o campo `escolha` do payload veio vazio |
| 5 | **07-Q1** · o cartão promete reparo manual | **POR ELA**, 27/08: o copiar manual SAI porque o automático cobre (`docs/process/sprints/2026-08-27-ONDA-SISTEMA-05-os-botoes-que-nao-cabiam.md:149-152` e `:164`) | *"Deve aplicar automaticamente como era no gtk"* | Em 04/09 decidiu-se o contrário por delegação e o botão manual foi embarcado: `interface/desenho_dos_lancadores.py:909`, gesto em `interface/pacotes/a07_lancadores.py:1667`. **E há um fato que a pergunta escondeu:** o caso exato é o dos jogos INTOCÁVEIS, que o motor proíbe tocar por construção — `integrations/sentinela_do_wrapper.py:202-209` e `:425-427` (*"remover só o trecho do Hefesto deixaria um fragmento que impede o jogo de abrir"*). A própria janela GTK não aplica neles, ela copia (`app/actions/launch_wrapper_dialog.py:434`) |
| 6 | **10-Q6** · os dois avisos do Modo | **POR ELA**, 31/08: *"independente do modo, todas as features vão funcionar. Então o tooltip falando o contrário é sem nexo."* (`mockup/TODO-DELA.md:129`) | *"Essas frases devem sumir"* | A frase foi tirada em 31/08 (`docs/data/paridade-gtk-html.csv:9` registra a ordem) e **recolocada por decisão em 04/09** (`O-PO-DECIDE:166`, `paridade-gtk-html.csv:385-386`) citando um pedido dela de **01/08** como se ainda valesse. As duas ordens convivem no MESMO CSV. A de hoje é a terceira vez que ela manda a mesma coisa |
| 7 | **10-Q5** · a tira corta o aviso | por delegação, 04/09: *"A tira ganha uma segunda linha"* (`decisoes-dela.csv:178`) | *"Encurtar as frases longas"* | A segunda linha está publicada: `mockup/10-perfis.html:1086-1091` e `interface/paginas/10-perfis.html:1086-1091`. E a opção escolhida é a que o próprio enunciado de 04/09 descreve como a que **apaga o aviso** (`sprints/2026-09-04-DECISOES-DELA-10-perfis.md:98`) |
| 8 | **06-Q3** · o botão PS na tabela | por delegação, 04/09: *"Fica fora, e a razão vira dica"* (`decisoes-dela.csv:156`) | *"Aparece e você escolhe"* | O produto **explica na tela por que o PS não entra** (`interface/aba06.py:1645`), e a resposta de hoje manda apagar essa frase. Aqui a de hoje VENCE sem conflito de autoridade — a anterior não era dela — e o dado a favor dela é forte: a janela GTK já oferece o `ps` (`app/actions/input_actions.py:100`) e `paridade-gtk-html.csv:214` ainda conta a linha como falta. **Falta nascer junto o aviso do duplo dono**, que não existe em lugar nenhum |
| 9 | **04-Q4** · o que dizer quando o brilho não acende | por delegação, 04/09: *"Uma frase curta. O silêncio está fora de questão."* (`O-PO-DECIDE:104`) | *"O Hefesto não pode ter essa falha. Isso tem que aplicar, não justificar a falha"* | A frase está no código: `interface/pacotes/a04_iluminacao.py:2444`, com régua em `tests/unit/test_a_04_o_trilho_de_brilho_grava.py:476`. **Ela recusou as TRÊS opções** — e a resposta de hoje é a regra DELA de 01/09 (*"clicar na cor já deveria aplicar a cor no controle"*), que o próprio arquivo do gesto cita duas vezes (`a04_iluminacao.py:2035` e `:2347`) e depois contraria no desfecho |
| 10 | **01-Q3** · onde fica o interruptor do cadeado | **POR ELA**, 26/08: *"some — o perfil ativo já diz isso"* (`docs/data/decisoes-dela.csv:81`) | *"Na aba Jogar, sob Modo"* | A caixa foi trazida de volta por delegação (`decisoes-dela.csv:128`) e está publicada: `interface/paginas/01-jogar.html:1840-1843`. **E a pergunta de hoje afirmou um fato errado:** `sprints/2026-09-04-DECISOES-DELA-01-jogar.md:56` diz que a caixa *"saiu do desenho por escolha minha"* — o registro diz que a ordem foi DELA. Ela foi consultada como se estivesse desfazendo uma escolha minha, quando estava desfazendo a própria. **São QUATRO ordens sobre uma caixa só:** ela pediu a caixa em 23/07 (mesma linha `:56`), mandou tirá-la em 26/08, a delegação a repôs em 04/09, e hoje ela a confirma de volta. Só a terceira não é dela, e nenhuma das quatro tem lápide |
| 11 | **05-Q2** · as duas explicações | por delegação, 04/09: *"Só a nota do Testar sobe para a tela"* (`decisoes-dela.csv:149`) | *"As duas na dica"* | A nota subiu e está publicada (`interface/paginas/05-vibracao.html:3223`, commit `38cdde70`, 00:59 de hoje). Aqui **quem divergiu dela foi a decisão delegada**: a de hoje repõe a regra dela de 30/08 (*"texto na interface é zero… se for de média importância vira tooltip"*). E metade da pergunta já não existe — o "Automático" saiu desta aba por ordem DELA às 00:59 |
| 12 | **02-Q8** · mudo que caiu no controle errado | por delegação, 04/09: *"Vira aviso no cartão, como as recusas"* (`decisoes-dela.csv`, `O-PO-DECIDE:84`) | *"Esse erro não deveria acontecer. (…) Parece um bug"* | Ela tem razão e a casa já lhe deu razão: a rota por controle é lei desde 20/08 (`tests/unit/test_mic_da_mesa_cheia_01.py`, cura em `daemon/ipc_handlers.py:5977-5985`) e o botão de mudo já vai por `uniq`. **Perguntar a forma do aviso foi transferir a ela uma pergunta de bancada** — está também na §3 |
| 13 | **10-Q4** · onde a tela responde ao número do jogo | por delegação, 04/09: *"Só a tira, e o campo se corrige"* (`decisoes-dela.csv:177`) | *"Rótulo ao lado, ao vivo"* | **É a única divergência que ACRESCENTA em vez de desfazer** — a própria decisão de 04/09 previa: *"o rótulo ao vivo pode vir depois sem desfazer nada"* (`sprints/2026-09-04-DECISOES-DELA-10-perfis.md:82`). O risco é alguém ler "rótulo ao vivo" como "o campo não se corrige mais" |

### As seis que batem em parte, e onde o esclarecimento de hoje morde

| pergunta | o que bate | o que diverge |
| --- | --- | --- |
| **01-Q1** · o aviso do Modo Nativo | *"Não me lembro disso acontecer. E não deveria."* é a razão dela de 31/08 | *"Mas caso ocorra na coluna atenção"* admite a frase literal que ela **baniu**: `interface/frases_que_ela_baniu.py:38` lista `"derrubam o controle"` em `FRASES_BANIDAS`, lida por duas guardas e por uma lápide em `tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py:411`. Leitura que concilia: a coluna Atenção pode dizer o **estado medido**, não a profecia |
| **02-Q9** · onde se vê o alto-falante mudo | *"O botão de som acende"* é a decisão de 04/09, já na tela | *"borda VERDE se ligado, ÂMBAR se desligado"* é NOVO: hoje há UM estado pintado, borda VERMELHA quando mudo (`interface/paginas/02-controles.html:1420` e `:2159`) |
| **06-Q1** · o interruptor do mouse fora do modo | "apagado antes do clique" é a D-03 dela | *"Sem clicar"* contradiz uma escolha deliberada: `interface/aba06.py:706` — *"E ELE CONTINUA RESPONDENDO (…) nada aqui é `disabled` nem `pointer-events:none`"* — e essa é a lei da peça compartilhada `monta.botao_cinza`, que a aba 09 também usa. E "mostra o estado real" só se cumpre pela metade: `aba06.py:720-721` vence `.tog.ligado .pino` (`aba06.py:677`) por especificidade, e sob o portão ligado e desligado ficam idênticos |
| **06-Q2** · as três regiões do touchpad | a marca fixa é a decisão de 04/09, palavra por palavra | ela já mandou DUAS vezes que as três regiões **disparem** (`decisoes-dela.csv:83` e `:113`, esta com *"eu mudei de ideia"*), e o portão continua em `daemon/subsystems/keyboard.py:461-465`. Aprovar a marca congela na tela o descumprimento de duas decisões dela |
| **08-Q4** · o selo de procedência | bate com a de 04/09 | diverge da **D-ORDEM-DE-SERVICO** dela de 24/08 (`decisoes-dela.csv:16`), que manda o selo nas TRÊS linhas — que é a opção recusada hoje. A janela GTK obedece àquela (`app/actions/config/secao_exame.py:353-371`, sem condição); a interface nova, a esta |
| **09-Q3** · a tela avisa durante os nove segundos | "o botão diz que está trabalhando" é a decisão de 04/09, construída | a palavra é *"Reaplicando…"* (`aba09.py:998`), não "Atualizando…" — filha da 09-Q1; e o *"pisca em verde"* é o mesmo mecanismo recusado no C-3, com o recibo verde já existindo (`hefesto_vivo.py:158`, `FRASE_DE_SUCESSO = "Pronto."`) |

---

## 3. As de MEDIÇÃO — nove perguntas de bancada transferidas a ela

Estas nove chegaram como *"onde ponho a frase?"*. Nenhuma era pergunta de
desenho: em todas, quem responde é o aparelho, o código ou uma medição que já
existe. Em quatro delas ela **recusou todas as opções** e disse, com as próprias
palavras, que a pergunta estava errada.

| pergunta | o que foi perguntado | o que de fato responderia | a prova de que é bancada |
| --- | --- | --- | --- |
| **02-Q8** | em que canal confessar que o mudo caiu no controle errado | medir se ainda cai | A rota por controle é lei desde 20/08 (`daemon/ipc_handlers.py:5977-5985`); o gesto de mudo chama `mic.canal.set` por `uniq` (`interface/pacotes/a02_controles.py:2646`), sem rota global. Palavra dela: *"Parece um bug"* |
| **04-Q4** | qual frase dizer quando o brilho guardado não acende | medir se ele PODE acender nesses estados | Dois dos quatro estados são nossos (cor desconhecida, apagada) — `app/widgets/controller_card.py:1181-1191`. E o mesmo arquivo traz medição CONTRÁRIA à premissa do terceiro: `controller_card.py:1164-1170`, *"Segurar não é escrever — 32 s com o daemon vivo deram 426 reports de saída contra 1 com ele parado, a Steam aberta nos dois lados"*. Palavra dela: *"Isso tem que aplicar, não justificar a falha"* |
| **05-Q6** | onde pousa o recado do clique que a interface não entende | consertar a causa | A causa foi curada às 01:32 de hoje (`390302ea`, *"a coluna que perde o dono AO VIVO para de oferecer controles"*), e as duas frases já pousam no cartão desde 04/09 (`interface/pacotes/a05_vibracao.py:911-918`). Palavra dela: *"Parece erro. Não deveria ocorrer ajuste de gambiarra sobre falha de produto nosso"* |
| **06-Q2** | como redigir o aviso de que o touchpad não dispara | executar a decisão dela | O portão está em `daemon/subsystems/keyboard.py:461-465`, e a sprint que o removeria (`sprints/2026-08-29-MIGRA-NAVEGACAO-12`) nunca foi executada. Ela mandou disparar em 26/08 e de novo em 29/08 |
| **07-Q1** | como oferecer o reparo manual | medir por que o automático não alcança | Ele alcança, menos nos INTOCÁVEIS, e ali aplicar é proibido por construção: `integrations/sentinela_do_wrapper.py:202-209` e `:425-427`. O automático já roda no exame (`interface/aba09.py:1120`) |
| **09-Q3** | como avisar durante os nove segundos e meio | medir por que são nove segundos e meio | A janela CONGELA ~8,4 s: `_tique` chama `mesa_viva.estado_do_daemon()` de forma síncrona, e a chamada continua lá — `interface/hefesto_vivo.py:2456`. Com a janela congelada o "Reaplicando…" pode nem ser repintado. Palavra dela: *"mas o botão tem de realmente fazer o que promete"* |
| **10-Q2** | a tela avisa ou deixa mudar | consertar a frase | A frase mandava ligar um "Modo avançado" que ela mesma tirou da interface em 26/08 (`decisoes-dela.csv:47`); a remenda saiu em 05/09 (`interface/pacotes/a10_perfis.py:677`). Palavra dela: *"Isso é erro do produto."* |
| **10-Q6** | onde pôr as frases do custo da máscara | medir o custo, ou parar de afirmá-lo | Sob a máscara Xbox o jogo não recebe giro, acelerômetro nem touchpad — `app/actions/home_actions.py:377-382`, e a medição anotada em `paridade-gtk-html.csv:9` (*"uinput_gamepad.py declara 8 eixos, nenhum IMU"*). *"A frase some"* e *"o mecanismo existe"* são duas entregas, não uma |
| **01-Q1** | em que canal entra o aviso do Modo Nativo | medir, ou enterrar a frase | *"alguns jogos derrubam o controle"* é afirmação forte e **ensaio nenhum desta casa a mede**. A própria dúvida dela hoje (*"Não me lembro disso acontecer"*) é a bancada respondendo, não a PO |

**O que estas nove têm em comum:** a pergunta oferecia três formas de DIZER e
nenhuma de FAZER. É a armadilha que o `CLAUDE.md` já nomeia — *quando ela recusa
todas as opções que eu ofereço, a hipótese certa não é que falta uma quarta, é
que a pergunta está errada* — e hoje ela caiu quatro vezes, em quatro abas
diferentes.

---

## 4. O desatualizado, com endereço

### 4.1 De onde vieram as 41

Todas as 41 nasceram em `docs/process/sprints/2026-09-04-DECISOES-DELA-<aba>.md`,
dez arquivos escritos na madrugada de 04/09 (commit `d514d65a`, 01:24). O
cabeçalho dos dez é idêntico, e diz como foram levantadas:

> *"Levantadas por um agente que leu as linhas abertas desta aba no
> `docs/data/paridade-gtk-html.csv` e as transformou em escolhas."*
> — `sprints/2026-09-04-DECISOES-DELA-01-jogar.md:3-4`, e igual nos outros nove

**Ou seja: a fonte foi o CSV de PARIDADE, que lista o que falta.** As decisões
anteriores não foram consultadas — e o próprio cabeçalho admite que sabia disso,
porque manda conferir à mão:

> *"**ELAS NÃO ESTÃO RESPONDIDAS.** São a fila da próxima conversa (…) As
> dezesseis que ela JÁ respondeu estão em `AS-DEZESSEIS-DECISOES-DELA` — confira
> lá antes de perguntar de novo."*

Um ponteiro para UM documento, a ser seguido por quem lembrar. Não é régua.

**Os dez arquivos nunca foram tocados depois** — `git log` sobre eles devolve
dois commits, os dois de 04/09, o último às 03:11 (`2a7d6583`). E às 13:50 do
mesmo dia as 54 foram decididas (`47d0fe97`), às 14:38 o CSV de paridade foi
carimbado (`c034d4c9`), e à noite a ONDA2 embarcou o código. Ninguém voltou.
**Os dez ainda dizem "ELAS NÃO ESTÃO RESPONDIDAS" agora**, e são exatamente as
dez abas da fila de hoje.

### 4.2 Existe fonte da verdade — e ela estava completa

**Existe, e é `docs/data/decisoes-dela.csv`.** Medido por mim nesta árvore,
hoje:

| medida | valor |
| --- | ---: |
| linhas de dado | **178** |
| `estado = decidida` | 177 (a outra é `caduca`) |
| ids no padrão `D-NNX-*`, as 54 de 04/09 | **54** |
| **das 41 perguntas de hoje, quantas têm linha nesse arquivo** | **41 — todas** |
| dessas 41, quantas com `estado = decidida` e `decidida_em = 2026-09-04` | **41** |
| dessas 41, quantas ausentes | **zero** |

O arquivo tem superfície publicada: `scripts/gerar-painel.py:132` o lê e o põe no
TOPO de `html/painel.html`, por pedido dela de 23/08 (*"talvez encabeçar isso na
nossa specs pra eu ir vendo junto contigo"*), com uma régua de colunas em
`tests/unit/test_o_painel_encabeca_as_decisoes_dela.py`.

**A resposta à pergunta "as decisões estão espalhadas?" é: sim, e o registro
central existe ao lado da dispersão, sem substituí-la.** A dispersão medida hoje
(padrão: `decisão dela` · `decidido por ela` · `ELA ESCOLHEU` · `palavra dela` ·
`ordem dela` · `ela decidiu` · `verbatim dela`):

- **570** arquivos `.md` em `docs/` — de **991** — contêm uma decisão dela
  marcada como tal;
- mais **468** arquivos fora de `docs/`, em `src/`, `tests/`, `mockup/` e
  `scripts/`: decisões dela vivem também em comentário de gerador e docstring de
  teste, que não são fonte que alguém leia procurando decisão;
- o registro central cobre **178** linhas.

### 4.3 O buraco do registro, e ele é datado

Esta é a medição que muda o diagnóstico. No `decisoes-dela.csv`:

- **108 linhas NÃO são por delegação** — são decisões dela. O `decidida_em`
  dessas 108 vai de **22/08 a 29/08** e **para ali**.
- **As únicas linhas de setembro são as 54 de 04/09 — e as 54 são por
  delegação**, todas com *"DECIDIDA POR DELEGAÇÃO"* na coluna `escolha`.
- **Nenhuma decisão que ela tomou com a própria boca de 30/08 em diante tem
  linha no registro.** As dezesseis da madrugada de 04/09 (D-01 … D-16) não têm
  id no CSV. As de 31/08 (o aviso do Modo Nativo, os tooltips) não têm. As de
  05/09 (a mesa fora da interface, a faixa Estado) não têm.

**Logo: o registro chamado "decisões dela" contém, na última semana, apenas as
decisões tomadas POR ela.** Um agente que o consulte para saber o que ela quer
encontra o que o PO decidiu em nome dela — e é exatamente isso que aconteceu com
o cadeado (01-Q3) e com o botão de reenvio (03-Q3): a ordem DELA de 26/08 e a de
27/08 estão no CSV, a delegada de 04/09 também, e ninguém percebeu que a segunda
revogava a primeira sem lápide.

Isso não é novidade para a casa. O diagnóstico já estava escrito **em 04/09**:

> *"esta decisão de 31/08 não está lá: ela vive numa régua de gerador, que não é
> fonte que se leia procurando decisão. Confirmado: `docs/data/decisoes-dela.csv`
> não tem linha para ela."*
> — `docs/process/agentes/2026-09-04/ONDA2-01.md:236-239`

O diagnóstico foi escrito e a linha nunca foi criada. Um dia depois a pergunta
voltou à mesa dela.

### 4.4 Não há régua nenhuma segurando isso

Conferido nesta árvore:

- os dez `DECISOES-DELA-*.md` **não citam um único id** do registro — `grep -E
  "D-0[0-9][A-Z]"` não casa em nenhum dos dez;
- **nenhum teste e nenhum script** cruza os arquivos de perguntas com o CSV;
- `scripts/portoes.sh` tem **40 portões** e nenhum deles se chama por decisão —
  o mais próximo é `caducos`, que guarda outro livro-caixa;
- `gerar-painel.py --conferir` existe e sabe dizer se o painel publicado está
  velho, mas **não é portão** e não entra na lista dos 40.

### 4.5 O `specs.html` e o mapa não tinham como ajudar — e isso é resposta, não desculpa

Ela mandou lê-los, e a leitura foi feita. O que eles dizem:

- `docs/data/mapa-controles.csv`: **308 linhas de dado, 50 colunas**, no grão
  `controle × feature × transporte`. **Nenhum nome de coluna fala de máscara,
  Xbox ou emulação de gamepad** — logo a única das 41 cujo miolo é fato de canal
  (10-Q6, *"a máscara Xbox custa esta feature?"*) **não tem onde ser respondida
  ali**. As duas únicas linhas cuja `chave` diz "emulacao" são de emulação de
  MOUSE (`entrada.emulacao_mouse.gatilhos` e `.analogico`), nascidas de
  observação dela de 11/08.
- `html/specs.html` abre com: *"44 linhas têm veredicto diferente entre cabo e
  rádio — essa lacuna é a que produziu as regressões."* É verdade e é útil — e
  não toca nenhuma das 41, porque **40 das 41 são desenho de tela**.

**Dois fatos do enunciado deste trabalho ficam corrigidos aqui**, pela regra da
casa de substituir número errado:

| dizia | é |
| --- | --- |
| o mapa tem 40 colunas | **50** (`head -1 docs/data/mapa-controles.csv`) |
| duas linhas do mapa têm veredicto `desconhecido`, as duas de emulação por rádio | as duas linhas de emulação hoje respondem `cabo_aciona = sim` **e** `radio_aciona = sim`, com `radio_de_onde_sei = medido` em 03/09. Não as achei como `desconhecido` |

**A hipótese dela — "tem algo no projeto desatualizado" — está certa. O que ela
apontou não é o lugar.** O desatualizado são os dez arquivos de perguntas, e o
incompleto é o registro.

---

## 5. A causa, nomeada

> **A casa registra a RESPOSTA num arquivo e a PERGUNTA noutro, e só a resposta
> é atualizada — então a pergunta sobrevive à própria morte e volta para a mesa
> dela.**

É a família *"o instrumento apontava para outra coisa"* que este repositório já
nomeou quatro vezes esta semana, na sua forma mais cara: aqui o instrumento
apontava para **o trabalho dela**.

E tem uma segunda camada, que é a que faz o defeito repetir mesmo com registro:

> **"Decisão dela" e "decisão tomada em nome dela" moram na mesma coluna do
> mesmo arquivo, então uma delegação de terça revoga uma palavra dela de
> segunda sem que ninguém veja.**

Foi assim com o cadeado (26/08 → 04/09), com o botão de reenvio (27/08 → 04/09)
e com o preço da máscara Xbox (31/08 → 04/09, citando 01/08). Nos três casos a
palavra dela está no disco, datada, e foi atropelada por uma decisão minha que
tinha o mesmo formato de linha.

---

## 6. O conserto

Quatro peças. Nenhuma depende de alguém lembrar — é a exigência desta casa, e o
molde já existe: `docs/data/caducos.csv` + `scripts/validar-caducos.py`, o
livro-caixa com portão que a casa aceitou em 24/08 para exatamente este problema
noutra matéria.

### C1 · O registro passa a dizer QUEM decidiu

`docs/data/decisoes-dela.csv` ganha **uma coluna**: `quem_decidiu`, com dois
valores — `ela` ou `delegacao`. Hoje isso vive enterrado na prosa da coluna
`escolha` (*"DECIDIDA POR DELEGAÇÃO"*), onde nenhuma régua alcança e nenhum
olho separa.

- **Quem escreve:** quem registra a decisão, na hora.
- **Régua:** linha com `quem_decidiu = ela` **exige** um trecho entre aspas na
  coluna `escolha` — sem verbatim, não é palavra dela. Linha com
  `quem_decidiu = delegacao` **exige** citar qual dos três mandatos a autorizou
  (os três estão tabelados em `2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md:9-14`).
- **A mordida:** trocar `quem_decidiu` de uma linha para `ela` sem aspas na
  `escolha` faz o portão reprovar nomeando a linha.

### C2 · Uma delegação nunca revoga uma palavra dela em silêncio

O registro ganha a coluna `revoga`, que aponta o `id` da decisão anterior.

- **Régua:** se uma linha com `quem_decidiu = delegacao` `revoga` uma linha com
  `quem_decidiu = ela`, o portão **reprova** — a menos que a coluna `revoga`
  traga a razão escrita e a data. Delegação pode revogar palavra dela; o que não
  pode é fazê-lo calada.
- **O que isso teria pego hoje:** as três — o cadeado (`D-O-CADEADO-DO-AUTOSWITCH-SAI`
  → `D-01J-CADEADO-ONDE`), o botão de reenvio, e o preço da máscara Xbox.

### C3 · A pergunta morre no arquivo onde nasceu

Cada pergunta de um `DECISOES-DELA-*.md` passa a carregar, no título, o `id` da
sua linha no registro — hoje **nenhum dos dez carrega um só**.

- **Régua nova, `scripts/validar-fila-dela.py`, no `portoes.sh` como  <!-- ref-externa: a régua ainda não existe; propô-la é o assunto desta linha -->
  `fila-dela`:** varre `docs/process/**/DECISOES-DELA-*.md`; para cada `id`
  citado, lê o registro; **se o `estado` é `decidida`, o arquivo tem de trazer a
  linha `RESPONDIDA em <data> — <id>`**, senão `rc=1` nomeando arquivo, pergunta
  e id. Pergunta sem `id` também reprova: quem escreve uma pergunta sem registrá-la
  está criando fila fora do livro.
- **A mordida:** apagar o carimbo `RESPONDIDA` de uma pergunta decidida faz o
  portão reprovar. Recolocar, passa.
- **Custo de fechar o vermelho de hoje:** dez arquivos, um carimbo de cabeçalho
  em cada, apontando para `2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md`.

### C4 · O que ela decide na conversa vira linha no mesmo dia

O registro está cego para tudo o que ela disse de 30/08 em diante. O conserto
não é uma promessa de disciplina — é um portão que mede a distância:

- **Régua, no mesmo `validar-fila-dela.py`:** varre `docs/process/**/*.md`  <!-- ref-externa: a régua ainda não existe; propô-la é o assunto desta linha -->
  procurando as marcas que a casa já usa para decisão dela (`**ELA ESCOLHEU:**`,
  `ORDEM DELA`, `DECISÃO DELA, <data>, verbatim`), e exige que **cada uma cite um
  `id` do registro**. Marca sem `id` é decisão dela que não virou linha, e o
  portão a nomeia com arquivo:linha.
- **Isenção declarada, como o `anonimato` já faz:** um arquivo pode declarar a
  razão de uma marca não ter id (narrativa histórica, citação de citação). O que
  não pode é a ausência calada.
- **A dívida que este portão vai acusar no primeiro dia:** as dezesseis de 04/09,
  as de 31/08, as de 01/09, as de 05/09 — e é bom que acuse, porque é o tamanho
  real do buraco. O §7 abaixo começa a pagá-la.

### O que NÃO é o conserto

- **Não é um documento novo de "onde paramos".** Já existem dezenove, e a
  informação estava em todos os certos — foi o instrumento que não os leu.
- **Não é mandar o próximo agente "conferir antes de perguntar".** O cabeçalho
  dos dez arquivos já manda exatamente isso, em negrito, e não funcionou. Aviso
  no topo de um comando que termina verde ninguém lê — a casa já aprendeu isso
  em 04/09 e escreveu no `CLAUDE.md`.

---

## 7. O que fica em pé agora, antes de qualquer execução

**Duas perguntas para ela, e só duas** — as outras 39 estão respondidas:

1. **A D-01 cai nas cinco abas?** Hoje ela escolheu o *pisca no campo* (03-Q4) e
   a *linha embaixo da grade* (05-Q4), que são os dois canais recusados em nome
   dela nos conflitos C-3 e C-6, contra a palavra dela de 04/09 (*"No próprio
   cartão, como a recusa"*). O cartão está construído e serve às abas 02, 03,
   05, 06 e 09. Se o pisca vale, ele substitui o cartão **nas cinco**, não numa.
2. **O botão da aba Sistema volta a se chamar "Atualizar"?** Ele hoje se chama
   "Reaplicar ajustes" (`aba09.py:997`), e a resposta de hoje é ambígua entre
   confirmar e reverter.

**E quatro coisas que NÃO se pergunta a ela — mede-se:** o mudo que cai noutro
controle (02-Q8), o brilho que não acende (04-Q4), o touchpad que não dispara
(06-Q2) e o congelamento de 8,4 s da aba Sistema (09-Q3).

**O registro começa a ser recuperado agora**, em
[`DECISOES-DELA-O-REGISTRO.md`](DECISOES-DELA-O-REGISTRO.md) — com o que falta
dito no topo, porque um registro que mente sobre ser completo é pior que um
registro curto.

---

## 8. E a execução já começou — medido na árvore, durante esta auditoria

Enquanto este laudo era escrito, **24 sprints da ONDA5 apareceram no disco**,
ainda não commitadas (`git status --short`, 05/09), escritas a partir das 41
respostas de hoje: `docs/process/sprints/2026-09-05-ONDA5-*.md`.

**Seis delas executam as divergências da §2**, e duas merecem parada antes de
qualquer código:

| sprint | qual divergência executa | o que preocupa |
| --- | --- | --- |
| `ONDA5-03-01-o-campo-que-pisca-e-o-numero-do-voo-que-ja-o-endereca.md` | **03-Q4**, o pisca | A `posse` declarada é `interface/hefesto_vivo.py`, `gui/ponte_da_tela.py` e **`tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py`** — o piloto COMPARTILHADO e a régua da D-01. O pisca entra pela peça que serve às cinco abas |
| `ONDA5-05-03-a-confirmacao-sai-do-cartao-e-vai-para-a-faixa.md` | **05-Q4**, a faixa | Tira a confirmação do cartão **só na aba 05** (`nao_toca` lista o `hefesto_vivo.py`) |

**Somadas, as duas deixam o produto com TRÊS canais para o mesmo fato:** o
pisca no piloto compartilhado (03), a faixa embaixo da grade (05) e o cartão
verde que continua nas abas 02, 06 e 09. É exatamente o desfecho que os
conflitos C-3 e C-6 foram escritos para impedir, um dia atrás, em nome dela
(`2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md:41` e `:44`) — e nenhuma
das duas sprints cita o conflito nem a D-01 no cabeçalho que li.

**As outras quatro** são divergências de rollback, e essas são mais simples de
julgar porque nas quatro a palavra de hoje é dela e a anterior era delegada:
`ONDA5-09-01-o-botao-volta-a-se-chamar-atualizar.md` (09-Q1, e resolve a
ambiguidade a favor do rollback),
`ONDA5-01-03-o-cadeado-ja-esta-na-tela-e-o-que-falta-e-o-verde.md` (01-Q3),
`ONDA5-07-01-a-linha-intocavel-e-aplicada-em-vez-de-explicada.md` (07-Q1 —
**esta esbarra na proibição por construção medida em
`integrations/sentinela_do_wrapper.py:425-427`**) e
`ONDA5-10-03-as-duas-frases-do-modo-somem-e-o-mecanismo-fica.md` (10-Q6).

**A recomendação, e é uma frase:** as duas primeiras da tabela ficam PARADAS
até ela responder a pergunta 1 da §7. As outras 22 podem correr — mas nenhuma
delas fecha sem a nota datada no `decisoes-dela.csv` dizendo qual decisão
anterior está sendo revogada, ou a repetição volta na semana que vem com outro
nome.
