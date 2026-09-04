# ONDA2-03 · A aba GATILHOS — a descrição que sumiu e o reenvio que não existia

**04/09/2026** · sprint `ONDA2-03-GATILHOS-01` · agente **A3** ·
árvore `hefesto-voo/ONDA2-03-GATILHOS-A3`, branch `voo/ONDA2-03-GATILHOS-A3`.

As QUATRO decisões da aba estão fechadas, e a linha de MOTOR que sobra está
declarada com a razão. Uma quinta coisa fechou de graça no caminho, e ela é do
tipo que esta casa prefere achar cedo: **a primeira versão da minha própria cura
prometia na tela um caminho que a lista não abre** — quem a derrubou foi a
mordida.

---

## O que mudou

| arquivo | o quê |
| --- | --- |
| `src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py` | a `DICA_DO_MODO` mudou de casa (era do gerador), `descricao_do_modo`, `dica_do_pronto`, `destinos_do_campo_de_pronto`, `SEM_APARELHO_AQUI`, `_assunto`, `_recibo`; o tique passa a emitir quatro endereços novos por coluna; o gesto **`reenviar`**; os quatro gestos devolvem `recado`; `PISO_DA_ABA` 4 → 5 e uma `PROVA` a mais |
| `src/hefesto_dualsense4unix/interface/aba03.py` | os dois `<select>` de cada gatilho ganham EMBRULHO com `title` pintável e perdem o `title` próprio; o botão `↻` na faixa `--r-acao`; o CSS dele e a trava do lugar vazio; quatro conferências novas no `_conferir`; a legenda (duas frases dela ficaram falsas) |
| `mockup/03-gatilhos.html` | regerado. **Não publiquei** — ver §"o que sobrou" |
| `tests/unit/test_a_aba_03_gatilhos_fecha_as_linhas.py` | **novo**, 25 testes |
| `tests/unit/test_a_aba_gatilhos_nao_deixa_o_mockup_na_tela.py` | uma igualdade de conjunto virou a pergunta que ela veio fazer — ver §"o que medi" |

### [01] a descrição do modo escolhido — **fechada**

A dica do campo *Modo* deixou de ser fixa (*"os 19 modos, com a descrição de
cada um"*) e passou a ser a explicação do modo **escolhido**, reescrita a cada
tique. Zero linha de tela: o `title` vive no `<div>` que embrulha o `<select>`,
pelo alvo `atributo`.

**Por que no embrulho e não no campo:** um elemento tem UM `data-hef-alvo`, e o
do `<select>` já é `valor` — sem ele a primeira pintura faria
`select.textContent = "Rígido"` e apagaria as 19 opções. O navegador mostra o
`title` do ancestral mais próximo quando o elemento sob o rato não tem o seu, e
por isso **o `<select>` perdeu o dele**: um `title` próprio venceria o do
embrulho e a explicação congelaria na frase da cena. As duas metades são a mesma
cura, e a régua cobra as duas.

O texto é o **desta tela** (a concreta: fala de freio de carro e de espingarda),
por decisão do PO. Ele saiu do gerador e foi para o pacote — quem reescreve a
cada tique é o produto. A **guarda de conjunto contra o `PRESETS` ficou no
gerador**, que é onde ela morde: lá o `PRESETS` é importado no topo e um modo
novo reprova a geração alto.

### [02] a curva pronta que troca o modo — **fechada, e a cura mudou no meio**

A dica do campo *Efeito pronto* avisa antes do clique, com o modo de agora e o
destino. **A primeira versão dizia "as curvas de força vão para «Curva de força»
e as de vibração para «Vibração por posição»" — e era falso.** Medido: com o
gatilho em `Rigid` o campo oferece SÓ as seis curvas de feedback
(`_tabela_que_o_campo_mostra`), então `Vibração por posição` não é alcançável
dali. A tela descreveria um caminho que a lista não abre.

A cura não foi escolher melhor as palavras: foi **perguntar à lista**.
`destinos_do_campo_de_pronto()` lê o que o campo oferece naquele modo e resolve
cada curva pela tabela em que ela mora. Se um dia o campo passar a oferecer as
onze, a dica nomeia as duas sozinha.

### [03] o reenvio — **fechado**

Um botão por coluna, na faixa `--r-acao` que já existia (34 px, aprovada), com o
glifo `↻` (U+21BB, bloco Arrows — o ADR-011 o preserva). Ele manda os **dois**
gatilhos daquela coluna, cada um pela porta do seu modo (`Off` por
`trigger.reset`, a R-19).

**Ele manda o que está na TELA**, recolhida por `data-hef-forma="@controle"` —
e é nisso que difere do "Aplicar" do rodapé, que manda o que está no disco. É a
única fonte possível: o DualSense não devolve o modo em que está.

**A conta do glifo é medida, não estética.** A faixa tem 202 px na coluna de
228, e "Guardar esse efeito" (texto dela) gasta 123. A palavra "Reenviar" mede
~62 px com padding e deixaria o campo do nome com 6 px. Com o glifo o botão
custa 26 e o campo fica com 42 — que é o que "Nome" ocupa a 11 px. Sem trilha
nova, sem rolagem lateral, sem rolagem do miolo, coluna ainda em 453 px de 477.

### [04] a tela avisa quando o efeito chega — **fechada, pela peça da D-01**

`modo`, `pronto`, `ajuste` e `reenviar` devolvem `{"recado": …}`, e o piloto o
leva ao cartão daquele controle, em verde, por 6 s. **Nenhum canal novo** — é o
conflito C-3: a lista desta aba propunha *o campo que pisca*, e ela escolheu o
cartão. Um segundo canal quebraria a peça que fecha cinco abas de uma vez.

A frase é do dono do assunto (`app/textos_de_aplicacao.frase_do_desfecho`, a
mesma da barra da GTK), e por isso ela sabe dizer *"aplicado em 2 controles"* em
vez de um "aplicado" que não conta.

---

## Qual mordida prova

Oito mordidas, cada uma arrancando UMA cura. **A saída dos dois estados está
colada abaixo; o roteiro está em
`/tmp/claude-1000/…/scratchpad/A3/morder.py`.** Com as oito curas no lugar:

```
$ python -m pytest tests/unit/test_a_aba_03_gatilhos_fecha_as_linhas.py -q
.........................                                                [100%]
25 passed in 0.56s
```

| # | cura arrancada | o que a régua disse |
| --- | --- | --- |
| 01 | a dica do modo vira a frase fixa de antes | `a dica do lado 'e' não é a do modo 'Rigid' que a MESMA carga pinta no campo` |
| 02 | os 19 modos caem no mesmo ramo do aviso | `a dica promete a mesma coisa nos dois casos, e eles são opostos` |
| 02b | o aviso anuncia um destino a mais | `a lista deste campo leva a ['MultiPositionFeedback'] e a dica nomeia ['MultiPositionFeedback', 'MultiPositionVibration']` |
| 03 | o reenvio manda só um lado | `o reenvio chamou ['trigger_set_detalhado'] — esperava um envio por gatilho, e o Off pela porta do reset (R-19)` |
| 04 | o gesto `modo` volta a devolver `None` | `o gesto 'modo' devolveu None — sem a chave recado o piloto deposita a frase genérica` |
| 05 | o recibo chama `frase_do_desfecho` sem a guarda de destino | `o recibo de SUCESSO diz 'Gatilho esquerdo (L2): Rigid — nenhum controle recebeu' sobre um corpo que não fala de destino nenhum` |
| 06 | o `<select>` volta a ter `title` próprio | `um <select> voltou a ter title próprio — ele sombreia a dica que o produto reescreve a cada tique` |
| 07 | o reenvio lê o disco em vez da coluna | `o reenvio chamou ['trigger_set_detalhado', 'trigger_set_detalhado']` (o `Off` da tela sumiu) |

**A MORDIDA 02 REPROVOU A PRIMEIRA VERSÃO DA MINHA RÉGUA, e é o achado de
processo desta frente.** A régua comparava os NOMES dos modos citados na dica —
e o nome muda sempre, por construção. Com a cura arrancada ela deu **verde sobre
defeito vivo**. A régua nova apaga todos os rótulos do `PRESETS` da frase antes
de comparar: o que sobra é a PROMESSA, e aí ela morde.

### A prova de tela

**Antes** · `docs/process/agentes/2026-09-04/ONDA2-03-antes-a-faixa-sem-reenvio.png`
**Depois** · `docs/process/agentes/2026-09-04/ONDA2-03-depois-a-faixa-com-reenvio.png`
(Chrome do sistema, Playwright *headless*, 1920×1080, a bancada `mockup/`.)

Medido nas duas: `rolagem_lateral: false`, miolo rola `0`, coluna 453 px de 477.
Na faixa: `↻` 26 px · `Nome` 42 px · `Guardar esse efeito` 123 px, em 202.

**O clique, no WebKit vivo, com o daemon dela e um DualSense na mesa** — a
bancada foi reservada (`bancada.sh reservar … --horas 1`) e liberada no fim:

```
[gesto] 03-gatilhos.html · reenviar → aplicado
gestos: 1 · aplicados: 1 · sem dono: 0
```

E o DOM, lido depois do clique (o ensaio está no scratchpad,
`A3/a03_no_dom_vivo.py`, com `--oculta` e a guarda de tela — a janela nasceu num
`Xvfb` próprio, e o stderr o anunciou):

```
recados: [["<uniq do controle>",
           "Gatilho esquerdo (L2): Off aplicado · Gatilho direito (R2): Off aplicado",
           "verde"]]
```

**Um clique, os dois gatilhos, e a frase nomeia os dois.** A foto está em
`docs/process/agentes/2026-09-04/ONDA2-03-o-recibo-no-cartao.png`.

As dezesseis dicas também foram lidas no DOM vivo, todas com o selo da visita
(`data-hef-visto="1"`):

```
p1 dica-modo-e   "Sem resistência nenhuma — o gatilho fica solto, como num controle comum."
p1 dica-pronto-e "Este gatilho está em «Desligado». Escolher uma curva pronta TROCA o modo
                  dele para «Curva de força» na hora — é um clique, e já vai ao controle. …"
p3 dica-modo-e   "Nenhum controle neste lugar."
```

---

## O que NÃO verifiquei

* **O tooltip APARECENDO.** Provei que o `title` está no embrulho, pintado a
  cada tique, com o selo da visita — e que o `<select>` não tem `title` próprio
  para sombreá-lo. Não provei que o WebKitGTK **desenha** o balão do ancestral
  ao parar o rato sobre um `<select>`: um `title` nativo não é DOM e não há como
  lê-lo por `run_javascript`. A herança de `title` é comportamento padrão de
  HTML e esta casa já depende dela (o `mic-dica` da `08-conexoes` embrulha o
  `<b>` do estado), mas **isso é precedente, não medição**. Se ela parar o rato
  no campo e não vir nada, o caminho é este parágrafo.
* **O reenvio com o gatilho em algo que não `Off`.** A mesa tinha um controle
  com os dois gatilhos em `Desligado` (perfil "Navegação"), então o clique vivo
  exercitou a rota `trigger.reset` nos dois lados. A rota `trigger.set` do
  reenvio está provada por dublê e pela `PROVA` do pacote, não no aparelho.
* **A aba com QUATRO controles.** A mesa tinha um.
* **A suíte inteira.** Rodei o meu escopo e as doze réguas vizinhas da aba 03,
  do despachante e dos dois mundos (183 + 52 verdes). A suíte é de quem
  coordena, e roda no fim.

---

## O que medi e derrubou uma suposição

1. **A minha própria dica prometia demais.** Está na §[02]. A suposição era
   *"fora dos dois modos por posição, qualquer curva pode ser escolhida"* — e o
   campo oferece uma tabela só de cada vez. Derrubada pela mordida, não pela
   leitura.
2. **A régua que media o nome em vez da promessa** (mordida 02). Segunda vez no
   mesmo dia que um instrumento meu apontou para outra coisa.
3. **A recusa do reenvio não nomeava o gatilho.** `_na_lingua_da_tela` devolve a
   frase traduzida do daemon (*"Fim (3) precisa ser maior que Início (5)"*) e ela
   **não nomeia lado nenhum**. Num clique que manda os DOIS, isso deixa ela sem
   saber qual recusou. Achado pelo teste `um_lado_que_recusa_nao_cala_o_outro`,
   que reprovou na primeira execução. Curado no `reenviar` (o assunto vai na
   frente). **Os gestos de um lado só — `modo`, `pronto`, `ajuste` — continuam
   com a recusa crua do daemon sem o nome do gatilho**; ali não é ambíguo,
   porque o clique foi naquele campo, e mexer nisso é fora das quatro decisões.
   Fica declarado.
4. **Uma régua vizinha reprovava quem estava certo.** O
   `test_o_lugar_vazio_recebe_desligado_e_nenhum` congelava o conjunto INTEIRO
   de campos da coluna vazia numa igualdade, e a própria mensagem dela diz que o
   que ela veio impedir é **emitir `aj-*` no vazio**. Ela reprovou as quatro
   dicas já nascendo certas (com o lugar vazio dizendo "Nenhum controle neste
   lugar."). Troquei a igualdade pela pergunta que ela veio fazer, com a razão
   escrita no lugar. **É arquivo fora da minha posse; está listado abaixo.**
5. **O portão de glifos leu o meu exemplo do proibido.** Eu citei o emoji
   U+1F504 num comentário para dizer que ele seria barrado — e ele foi barrado,
   em três arquivos. O portão lê o texto, não a intenção. Agora o exemplo é
   `chr(0x1F504)`, e o comentário do CSS diz por que não o escreve.
6. **`interface/frases_que_ela_baniu.py` NÃO EXISTE nesta árvore.** O despacho o
   cita como guarda de execução (*"o `_json` do piloto LEVANTA se uma delas for
   para a tela"*); `grep` em `src/`, `tests/`, `scripts/` e `docs/` não acha o
   arquivo nem o mecanismo. Ou ele está numa frente ainda em voo, ou a
   afirmação caducou. **Nenhuma frase minha é alarme:** as duas dicas dizem o
   estado medido (o modo de agora, os destinos que a lista abre) e o recibo diz
   o que o daemon respondeu.
7. **O P2 sem controle fica sem dica**, e é consequência aceita. Com um controle
   na mesa, o P2 é um lugar que a PÁGINA dá por conectado: o pacote não pode
   emitir `colunas` para ele sem custar o `data-conectado="nao"` que segura o
   `pointer-events:none` (a razão inteira está no `pacote()`). O piloto apaga os
   campos daquela coluna, e o alvo `atributo` **remove** o `title` no vazio — o
   que é honesto (nada a dizer) mas diverge do P3/P4, que dizem "Nenhum controle
   neste lugar.". Medido no DOM vivo.

---

## O que sobrou para o próximo

| o quê | por quê | de quem |
| --- | --- | --- |
| **`mockup/03-gatilhos.html` NÃO foi publicado** | o botão `↻` é pixel novo, e publicação é o olho dela (`PROVA-DE-TELA-01`). A seção `## 03-gatilhos.html` **já existe** em `mockup/DIVERGENCIAS.md` (a folha da ONDA0-F), então o portão `desenho-aprovado` está VERDE — mas o texto da seção fala só da folha, e não das quatro decisões. Quem publicar atualiza a razão | quem coordena |
| **A linha de MOTOR "Editar em 'Todos'" NÃO foi feita** | ela pede um controle VISÍVEL que não existe (a GTK tem um alvo de três estados, `app/alvo_de_edicao.py`) e muda o DESTINO da gravação — de `controllers[uniq].triggers` para a seção global do perfil, apagando os overrides do lado editado. Nenhuma das quatro decisões desta aba fala de onde a aba grava, e inventar a forma seria desenho novo sem o olho dela. **É sprint própria**, e o custo real está na linha do CSV: sem ela, um TERCEIRO controle herda a global que esta aba nunca escreveu | o PO |
| **`_na_lingua_da_tela` não nomeia o gatilho** nos gestos de um lado só | ver §"o que medi", item 3 | frente futura da aba 03 |
| **O recibo diz `Rigid`, não `Rígido`** | `_assunto` usa a chave de disco, e é a MESMA construção que `triggers_actions._toast_trigger` usa na barra da GTK. Trocar aqui criaria duas verdades entre as duas telas; trocar nos dois é uma frente de paridade. É a família da TRG-01, pela outra porta | frente de paridade |
| **`test_a_aba_gatilhos_nao_deixa_o_mockup_na_tela.py`** | editado por mim (32 linhas), fora da posse de quatro arquivos. Ele não está no `nao_toca` e nenhuma outra frente da onda toca a aba 03, mas está declarado | quem costura |
| **A janela do `reenviar` na `hefesto_vivo.PERIGOSOS`: NÃO é necessária** | o gesto **não grava no disco dela**. Ele reenvia ao APARELHO exatamente o que já está na tela — idempotente, nenhum valor novo, nenhum byte a mais do que o `modo` e o `pronto` já mandam a cada clique (e esses dois também não estão na lista). O vizinho `guardar` está lá porque escreve em `meu_perfil.json`. **Conferido, e a linha não existe de propósito** | — |

### As linhas do CSV que este trabalho mexeu

**Não toquei em `docs/data/paridade-gtk-html.csv`** — o portão
`paridade-gtk-html` está VERMELHO com dois achados, e os dois são meus de
relatar:

| linha | aba | o que o portão diz | o veredito |
| --- | --- | --- | --- |
| **97** | `03-gatilhos` — *Descrição visível do modo ESCOLHIDO (sem passar o mouse)* | o sinal `spec.description` apareceu em `pacotes/a03_gatilhos.py` | **REMEDIR e reescrever.** A explicação do modo escolhido passou a existir e a acompanhar o modo, mas **na dica** — que é a forma que o PO decidiu, contra o "sem passar o mouse" do enunciado. O sinal novo é `descricao_do_modo`, em `src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py:497`, com escopo `src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py`. O `spec.description` que o portão achou está numa DOCSTRING (a queda da função), não em código — e é o velho ponto cego do `check_paridade_gtk_html.py`, que não separa código de prosa |
| **130** | `04-iluminacao` — *Botão de reenvio explícito da cor ('Aplicar no controle')* | o sinal `data-gesto="reenviar"` apareceu em `interface/aba03.py` | **FALSO POSITIVO.** A linha é da aba 04 e o `sinal_escopo` dela é `LADO-HTML` — o lado HTML inteiro. O `data-gesto="reenviar"` que o portão achou é o botão da aba **03**. A linha da 04 continua aberta. O conserto é estreitar o escopo para `src/hefesto_dualsense4unix/interface/aba04.py` |

Outras linhas da aba 03 que este trabalho move, e que a régua **não** acusou
porque o sinal delas já estava presente:

| linha | feature | o que mudou |
| --- | --- | --- |
| 96 | *Dica (tooltip) por modo, com a descrição do que ele faz* | continua DIFERENTE por decisão (o texto tem donos diferentes nos dois lados), e agora a dica do CAMPO diz a mesma frase que a da opção. A decisão está registrada na própria linha |
| 102 · 104 | *Quando o campo "Efeito pronto" aparece* · *As curvas de VIBRAÇÃO* | continuam DIFERENTE por decisão, e **a dívida medida delas fechou**: "a tela não avisa que o modo vai mudar" deixou de ser verdade |
| 106 | *Aplicar o efeito no aparelho* | o `↻` é o botão que faltava. Sinal novo: `data-gesto="reenviar"` em `src/hefesto_dualsense4unix/interface/aba03.py` e o gesto `reenviar` em `pacotes/a03_gatilhos.py` |
| 113 | *Dizer na tela o desfecho* | **a metade que faltava fechou**: o sucesso fala. Sinal novo: `_recibo`, em `pacotes/a03_gatilhos.py` |

---

## O estado da árvore

```
$ bash scripts/portoes.sh
REPROVOU: 1 vermelho(s) de 40 -> paridade-gtk-html
```

O único vermelho é o do CSV, com os dois achados da tabela acima — um pede
remedição da linha 97, o outro é ponto cego de escopo na linha 130. Os 39
restantes, verdes.
