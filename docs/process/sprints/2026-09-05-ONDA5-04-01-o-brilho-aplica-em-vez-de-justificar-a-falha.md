---
sprint: ONDA5-04-01
decisoes: [04-Q3, 04-Q4]
posse:
  A04:
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
    - tests/unit/test_a_04_o_trilho_de_brilho_grava.py
    - docs/data/paridade-gtk-html.csv
depois_de:
  - ONDA2-04-ILUMINACAO-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/paginas/04-iluminacao.html
  - mockup/04-iluminacao.html
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/app/textos_de_aplicacao.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
depois_de: [ONDA1-X-OS-FATOS-01, ONDA2-04-ILUMINACAO-01, ONDA4-S10-O-TRANSPORTE-01, ONDA5-10-03]
---

# ONDA5-04 · DEFEITO — o brilho APLICA, e a tela para de justificar a falha

> **A palavra dela, 05/09/2026, sobre a pergunta 04-Q4** (*"que frase o produto
> deve mostrar quando o brilho não acende?"*):
>
> **"O Hefesto não pode ter essa falha. Isso tem que aplicar, não justificar a
> falha."**

**Ela recusou as TRÊS opções.** Eu ofereci a frase inteira, a frase curta e o
silêncio — três maneiras de escrever a mesma desculpa. É o padrão que esta casa
já nomeou: *quando ela recusa todas as opções, o que falta não é uma quarta — a
pergunta está errada.* A pergunta certa não era *que frase*, era *por que o
produto não aplica*.

**E é a SEGUNDA vez que ela responde esta pergunta.** Em 04/09 a mesma pergunta
saiu com três frases e ela escolheu a curta; a decisão está escrita no docstring
que esta sprint vai reescrever (`a04_iluminacao.py:2389-2395`). Hoje ela leu o
comportamento em vez da frase, e derrubou o comportamento.

O trabalho é de **um arquivo de produto**, mais a régua que hoje tranca o
defeito e uma linha de CSV que o descreve como se fosse desenho.

---

## 0. A DECISÃO 04-Q3 JÁ ESTÁ FEITA — e não há trabalho nela

Ela escolheu **"O código da cor clica"**, e isso foi entregue em 04/09 como
decisão [03] da `ONDA2-04-ILUMINACAO-01`. Medido agora, nas quatro camadas:

| camada | endereço | o que está lá |
| --- | --- | --- |
| o gesto | `src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py:2123` | `@gesto("04-iluminacao.html", "reenviar")` |
| a escrita | `a04_iluminacao.py:2168` | `_escrever_a_cor(ctx, p, uniq, hex_to_rgb(escrito))` — o mesmo caminho único dos outros três |
| o gerador | `src/hefesto_dualsense4unix/interface/aba04.py:1111` | `<span class="hex reenvia" data-campo="hex" data-gesto="reenviar"` |
| a folha | `aba04.py:717-719` e `:725` | o cursor, a borda roxa no `:hover`, e o `pointer-events:none` na coluna sem controle |
| a página publicada | `src/hefesto_dualsense4unix/interface/paginas/04-iluminacao.html:2437` e `:2812` | a caixa das duas colunas, com o gesto |
| a régua do gerador | `aba04.py:1663-1672` | reprova a caixa sem `data-gesto="reenviar"`, e reprova se ela ganhar `data-hex` |
| a prova botão a botão | `a04_iluminacao.py:2895-2897` | o clique de prova manda `{"texto": "#12AB34"}` e espera `led_set_detalhado((18, 171, 52))` |

**O que ela pediu existe e morde.** Não escreva nada aqui.

**O que sobra da trava de 04-Q3** — *"conferir se a cor chegou ao controle
continua sendo um truque"* — **não é desta aba.** O "deu certo" é a decisão
03-Q4 de hoje (*o campo pisca em verde por ~1,5 s, sem palavra nova na tela*),
e ela é uma peça só para as dez abas, no piloto. O campo que esta aba precisa
que pisque já tem endereço: `data-campo="hex"`, o mesmo do reenvio. Nada a
construir aqui, e nada a inventar: quem constrói o pisca-verde é a frente do
piloto.

**Cuidado, e ele é medido:** `hefesto_vivo._deu_certo_dizendo`
(`src/hefesto_dualsense4unix/interface/hefesto_vivo.py:2218-2255`) hoje deposita
um cartão VERDE com `FRASE_DE_SUCESSO` em **todo** gesto que volta sem levantar,
e o docstring dele diz, com todas as letras, que *o campo que pisca* foi
recusado por ela em 04/09 (`:2230-2233`). Isso caducou hoje. **Não é esta
sprint que troca**, mas não escreva nada que dependa do cartão verde continuar
existindo.

---

## 1. O QUE SE MEDIU — cinco gestos no mesmo arquivo, e só um recusa

O caminho de escrita de cor desta aba é **um só**, e ele tem nome:
`_escrever_a_cor` (`a04_iluminacao.py:1942`). Cinco gestos chamam:

| gesto | linha da chamada | consulta a ressalva antes? |
| --- | --- | --- |
| `cor` | `:2096` | **não** |
| `apagar` | `:2120` | **não** |
| `reenviar` | `:2168` | **não** |
| `auto` | `:2235` | **não** |
| `brilho` | `:2445` | **SIM — e é o único** |

A guarda inteira são três linhas:

```python
    if recado is not None or not pedida:
        porque = recado or "o produto não sabe de que cor ela está"
        return {"recado": f"Guardei {pct}%. A barra não mudou agora: {porque}."}
```
— `a04_iluminacao.py:2442-2444`

O `recado` vem de `rotulo_lightbar(dele, ctx.state)` (`:2434`), que é o motor dos
cards da janela GTK (`src/hefesto_dualsense4unix/app/widgets/controller_card.py:1145`).

**Na mesa dela isso é uma tela que se contradiz na mesma célula:** sob a Steam,
clicar num dos oito tons pinta a barra; arrastar o trilho quatro centímetros ao
lado devolve uma frase dizendo que a barra não muda. Os dois botões estão a um
dedo de distância, no mesmo cartão, no mesmo controle.

**E é a inversão que esta casa já matou uma vez.** `frase_do_desfecho` existe
para isso, e o docstring dela diz o que a `ELO-MUDO-01` custou:

> *"**A inversão é o coração da tarefa**: antes a janela deduzia e o daemon era
> ignorado; agora o daemon manda e a janela só preenche o silêncio quando ele
> não respondeu."*
> — `src/hefesto_dualsense4unix/app/textos_de_aplicacao.py:330-332`

O gesto `brilho` **deduz** — ele lê a ressalva da TELA e conclui que a escrita
vai falhar, sem tentar. O daemon publica `aplicado_em`/`guardado_em` em toda
resposta de `led.set`
(`src/hefesto_dualsense4unix/daemon/ipc_handlers.py:1476-1480`), e ninguém
pergunta a ele.

---

## 2. OS QUATRO ESTADOS, UM A UM — e nenhum sustenta a recusa

`rotulo_lightbar` devolve ressalva em quatro casos
(`controller_card.py:1182-1190`). O docstring de hoje trata os quatro como *"não
há cor a reescalar, e mandar preto APAGARIA a barra"* (`a04_iluminacao.py:2383-2387`).
**Medidos um a um, a frase é falsa em três e desnecessária no quarto.**

### A — "Lightbar: apagada" (`:1189-1190`)

Ela apertou **Desligar**. `cor_do_swatch` devolve `(0, 0, 0)`, e `cor_escolhida`
(`a04_iluminacao.py:502-510`) devolve `(0, 0, 0)` de volta — a tupla é
verdadeira, então `not pedida` é **falso**, e quem barra é o `recado`.

**Mandar a cor aqui NÃO apaga nada — ela já está apagada, e a conta prova:**
`int(0 * b) == 0` para qualquer `b`. Está escrito no gesto vizinho, que depende
disso:

> *"O BRILHO VIAJA JUNTO E NÃO MUDA NADA AQUI — `int(0 * b)` é `0` para qualquer
> `b`."*
> — `a04_iluminacao.py:2112`

Aplicar mantém a barra apagada, grava o número, e o brilho novo é o que vale
quando ela reacender. **Não há nada a confessar, então não há frase.**

### B — "Lightbar: cor desconhecida" (`:1187-1188`)

Aqui `pedida` é vazia de verdade. **E a cura já existe neste mesmo arquivo,
escrita por ela:**

> *"deixa em uma das cores default se o jogo não escolher ou não tiver
> rodando."*
> — palavra dela, citada em `a04_iluminacao.py:2190-2194`

O gesto `auto` já faz exatamente isso (`:2235-2236`), e a função
`_a_cor_de_agora` (`:2449`) tem a mesma queda com a razão escrita:

> *"A QUEDA É A COR DO SLOT, e ela é a resposta CERTA e não um remendo: nos
> quatro estados em que o motor não afirma cor (…) o que o automático estava
> dando àquele controle era exatamente `player_slot_color(numero)`."*
> — `a04_iluminacao.py:2459-2464`

**Dois gestos desta aba já sabem o que fazer quando não há cor. O terceiro
escreve uma frase.**

### C — a Steam segurando o `fd` (`:1184-1185`)

**Este é o pior, porque o arquivo que devolve a ressalva já mediu que a escrita
passa:**

> *"Segurar não é escrever — e a frase antiga mandava a pessoa procurar o defeito
> na Steam, onde ele não está. (…) no fio, 32 s com o daemon vivo deram **426**
> reports de saída contra **1** com ele parado, a Steam aberta nos dois lados."*
> — `controller_card.py:1166-1170`

E o mesmo docstring diz o que a ressalva É:

> *"é um aviso sobre a CONFIANÇA no valor, não sobre o valor"*
> — `controller_card.py:1157-1158`

O gesto `brilho` lê um aviso sobre **leitura** e o usa como veto de **escrita**.
São duas coisas diferentes, e a segunda nunca foi medida como impedida — foi
medida como possível, no fio, com a Steam aberta.

### D — Modo Nativo (`:1182-1183`)

O único em que o produto realmente largou o LED, e por escolha dela. **Aqui
também não se deduz:** quem sabe o desfecho é o daemon, que devolve as duas
listas, e quem o traduz é `frase_do_desfecho`, que conhece as quatro razões e
tem uma frase própria para este caso (`NADA_ACONTECEU_NATIVO`,
`textos_de_aplicacao.py:295` e `:394-395`). Escrever e repetir o que o daemon respondeu
é o contrato desta casa; adivinhar antes de escrever é o que ela derrubou.

**E a razão do estado JÁ ESTÁ NA TELA, o tempo todo, sem clique nenhum:** a
linha de ressalva é escrita em todo tique, do mesmo `rotulo_lightbar`, no
endereço `luz-ressalva` (`a04_iluminacao.py:582` e `:1643`), junto com a tira
tracejada (`:561`, `:1630`). A frase do cartão é a **segunda cópia** dessa razão
— e é a cópia que só aparece quando ela arrasta o trilho.

---

## 3. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — a guarda sai, e a queda entra

`a04_iluminacao.py:2442-2445`. As três linhas da guarda saem. No lugar, a cor a
mandar é a pedida **ou a do slot** quando não há pedida — a mesma queda de
`_a_cor_de_agora:2479` e do gesto `auto:2236`:

```python
    alvo = tuple(pedida)[:3] if pedida else player_slot_color(_numero(ctx, dele))
    _escrever_a_cor(ctx, p, uniq, alvo, brilho=_fracao_do_disco(pct))
    return None
```

`_numero` é `:759` e já tem dono único (`app/actions/base.numero_do_controle`);
`player_slot_color` já é importado neste arquivo em três lugares (`:461`,
`:2221`, `:2472`). **Não escreva uma quarta regra de número nem uma segunda
paleta** — a terceira e a quarta cópia da regra de número já custaram um defeito
fotografado nesta aba (`:768-772`).

`rotulo_lightbar` deixa de ser chamado por este gesto; a importação em
`:2423-2426` fica só com `cor_do_swatch`.

**A MORDIDA:** devolva a guarda e `test_o_brilho_aplica_sob_ressalva` (novo, §4)
reprova nos quatro estados — `p.chamadas` volta vazio. Devolva só metade dela
(o `recado is not None`) e o caso da cor desconhecida reprova sozinho, que é a
prova de que a queda entrou.

### Passo 2 — a ordem dos três tempos não muda

`:2433-2440` fica como está, e **isto é requisito, não acaso**. Os três tempos
estão medidos no docstring (`:2353-2362`): a cor pedida sai com o brilho
**velho** (`:2433`, `:2435`), o disco recebe o **novo** (`:2437-2440`), e só
então o aparelho recebe a cor com o brilho novo passado no parâmetro. Inverter
qualquer par devolve uma cor que ela nunca pediu, ou faz um disco cheio apagar a
barra dela.

**A MORDIDA:** `test_a_cor_pedida_sai_do_brilho_velho`
(`tests/unit/test_a_04_o_trilho_de_brilho_grava.py:361`) e
`test_o_aparelho_recebe_a_cor_pedida_com_o_brilho_novo` (`:338`) já existem e já
mordem. **Confira que continuam verdes** — são a única coisa entre esta sprint e
uma cor escurecida duas vezes.

### Passo 3 — o docstring conta a decisão nova, e não apaga a velha

`:2383-2395`. O parágrafo **"SEM COR CONHECIDA, GUARDA E DIZ"** e o
**"A FRASE ENCOLHEU — 04/09/2026, decisão [04] dela"** descrevem um
comportamento que deixou de existir. **Não os apague:** eles são decisão medida,
e a regra da casa é a nota datada. Deixe as duas metades separadas:

* **o número vai para o disco** — vale, e continua sendo a promessa do gesto;
* **e o cartão diz que a barra não mudou** — caducou em 05/09/2026, palavra
  dela: *"Isso tem que aplicar, não justificar a falha."* A causa continua na
  tela, na linha de ressalva, em todo tique.

E escreva a regra que sobra, porque ela vale além desta aba: **o Hefesto não
explica a própria falha — ele a conserta.**

**A MORDIDA:** o portão `acentuacao` e o `casa-sabe` rodam sobre este arquivo;
um parágrafo que afirme o comportamento velho como se fosse o de hoje é
exatamente o que o `casa-sabe` existe para pegar. Rode
`bash scripts/portoes.sh` inteiro, não o `--rapido` — o `casa-sabe` é da
camada `completo` (`scripts/portoes.sh:115`) e o `--rapido` não o roda.

### Passo 4 — a linha 134 do CSV para de descrever o defeito como desenho

`docs/data/paridade-gtk-html.csv:134` (`04-iluminacao,Ajustar o brilho da barra
(0–100%)`) traz, na coluna de nota:

> *"Duas diferenças menores, medidas: (…) e ele **DIZ quando não há cor a
> reacender em vez de mandar preto**."*

Isso deixa de ser verdade, e a casa não guarda fato errado ao lado do certo.
Reescreva a célula com **FATO SUBSTITUÍDO — 05/09/2026**, a palavra dela, e o
que passa a valer: *aplica nos quatro estados, com a cor do slot quando o motor
não afirma cor; a razão do estado continua na linha de ressalva, em todo tique.*

**ESTE ARQUIVO É DE UMA FRENTE POR VEZ** — a regra está escrita em
`docs/process/sprints/2026-09-05-ONDA-QUATRO-INDICE.md:132`. Quem coordena
serializa; não edite em paralelo com outra frente.

**A MORDIDA:** o portão `paridade-gtk-html` lê `caminho:linha` e reprova
endereço morto (`scripts/check_paridade_gtk_html.py`, regra `endereco-morto`).
O Passo 1 **encurta** `a04_iluminacao.py`, então os endereços da linha 134 —
`a04_iluminacao.py:2169` entre eles — podem passar a apontar para outra coisa.
Rode o portão depois do `git add` e conserte os números que ele acusar. Não
conserte "por precaução" os que ele não acusar.

---

## 4. AS RÉGUAS — e a que hoje tranca o defeito

**`tests/unit/test_a_04_o_trilho_de_brilho_grava.py:443` asserta o defeito.**
`test_sem_cor_conhecida_guarda_e_diz` roda com `native_mode=True` e exige três
coisas (`:476-480`):

| asserção | linha | depois desta sprint |
| --- | --- | --- |
| o `recado` traz `"Guardei 30%"` | `:476-477` | **cai** — não há mais frase |
| `not p.chamadas` — não escreveu no aparelho | `:478` | **inverte** — tem de escrever |
| o disco recebeu `0.3` | `:479-480` | **continua**, intacta |

Ele não é um teste ruim: ele é a régua fiel de uma decisão que ela derrubou.
**Reescreva-o, não o apague** — o caso que ele guarda (o disco recebe mesmo com
ressalva) é o que sobra da decisão de 04/09 e continua sendo requisito. Troque
o nome para `test_sem_cor_conhecida_guarda_e_APLICA`, reescreva o docstring com
a data e a palavra dela, e inverta a segunda asserção.

**Não faça substituição em massa neste arquivo.** *"Substituição em massa sobre
uma régua é edição cega; cada uma tem de ser lida"* — a lição das dezoito réguas
de 05/09, e duas foram devolvidas por isso.

**As réguas novas, e as três mordem em lugares diferentes:**

1. **`test_o_brilho_aplica_sob_ressalva`** — parametrizado nos quatro estados,
   montados pelo `state`/`entry` que `rotulo_lightbar` lê: `native_mode=True`;
   `lightbar_disputada=True`; `lightbar_source="desconhecida"`; e
   `lightbar_on=False`. Nos quatro, `p.chamadas` tem **uma** escrita e o disco
   tem o número. *É esta que prova o Passo 1 nos quatro, e não em um.*
2. **`test_sem_cor_conhecida_a_barra_acende_a_cor_do_numero`** — com
   `lightbar_source="desconhecida"`, o RGB que chega ao dublê é
   `player_slot_color(n)` daquele controle, **não** preto e **não** branco.
   Sem ela, o Passo 1 pode cair num `(0, 0, 0)` que apaga a barra dela — que é
   o medo escrito no docstring de hoje, e o único legítimo dos quatro.
3. **`test_a_barra_apagada_continua_apagada`** — com `lightbar_on=False`, a
   escrita acontece e o RGB é `(0, 0, 0)`. **É a régua que impede a cura de
   virar o defeito oposto:** um arraste de brilho que reacende a barra que ela
   desligou é o mesmo estrago que o docstring deste gesto já nomeia ao recusar
   `perfil.gravar_e_reaplicar` (`a04_iluminacao.py:2369-2374`).

**E cuidado com o dublê**, que é a armadilha número um de 05/09 — três dos
vermelhos daquele dia eram dublê mais frouxo que o real. O `PonteDeMentira`
deste arquivo está em `:99`, e ele **já** devolve o corpo do caminho feliz —
`{"aplicado_em": [UNIQ], "guardado_em": []}` (`:108`). Não o troque por um
`True`: `_escrever_a_cor:2022-2028` levantaria, e a régua passaria a medir a
frase em vez do ato.

---

## 5. O QUE ESTA SPRINT **NÃO** DECIDE

1. **O tom do cartão quando o daemon diz "guardado" ou "nada aconteceu".**
   `_escrever_a_cor` levanta `RuntimeError` quando a frase do daemon não é a
   feliz (`:2027-2028`), e o `RuntimeError` é o canal da RECUSA — laranja, 30 s.
   Para um gesto que já gravou no disco, o tom é grande demais. **A causa está
   medida e o dono é outro arquivo:** o próprio docstring relata que falta um
   segundo retorno de `frase_do_desfecho` dizendo *qual dos quatro destinos
   venceu* (`:2005-2007`), e que isso é `app/textos_de_aplicacao.py`, fora do
   território desta aba. Declarado, não esquecido — e não é desculpa para
   deduzir de novo deste lado.
2. **O pisca-verde do "deu certo"** (03-Q4). É peça do piloto, uma para as dez
   abas. Ver §0.
3. **Modo Nativo continua sendo dela.** Nada aqui liga ou desliga o Modo Nativo
   para conseguir aplicar. *"A máscara não custa feature"* vale para limitação
   do aparelho, não para uma escolha dela que está na tela.

---

## 6. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois:

* **O número vai para o disco, sempre** — é a promessa inteira do gesto, e a
  decisão dela de 03/09 (*"Grava na hora"*).
  `test_o_arraste_grava_no_override_daquele_controle` (`:243`) e
  `test_o_que_o_disco_grava_e_o_que_a_coluna_le` (`:272`).
* **A gravação é POR CONTROLE e por CAMPO** — gravar o brilho não pode apagar a
  cor própria daquele controle: `_com_o_brilho_gravado` (`:2288`) e
  `test_gravar_o_brilho_preserva_a_cor_propria_daquele_controle` (`:294`).
* **Arrastar para o mesmo lugar não regrava** — `test_arrastar_para_o_mesmo_lugar_nao_regrava` (`:318`).
* **O `click` que segue o `change` não é um segundo pedido** — `_so_abriu_o_seletor`
  (`:2412-2413`) e `test_o_clique_que_segue_o_change_nao_grava_de_novo` (`:389`).
  Sem ele, um clique na pista manda DUAS escritas ao rádio.
* **As três recusas que continuam recusas**, e nenhuma delas é a que esta sprint
  tira: sem controle no clique (`:2410-2411`), valor fora de 0–100 (`_pct_pedido`,
  `:2239`, com a faixa lida do esquema e não digitada), sem perfil ativo
  (`:2417-2420`) e controle fora da mesa (`:2429-2432`). As réguas são `:413`,
  `:421`, `:434` e `:483`.
* **O trilho continua em `PERIGOSOS`** — `hefesto_vivo.py:1773`, com a razão em `:1766-1772`, e
  `test_o_trilho_e_perigoso_para_a_prova_automatica` (`:496`). Ele grava no
  perfil ATIVO; a prova botão a botão não pode arrastá-lo. **Esta sprint faz o
  gesto ESCREVER MAIS**, não menos — tirá-lo de `PERIGOSOS` agora mandaria a
  régua repintar a barra dela a cada volta.
* **`PISO_DA_ABA = 7` não muda** (`:2883`). Nenhum gesto nasce aqui, e o piso só
  sobe.
* **A linha de ressalva continua dizendo a razão em todo tique** — `:1643`, com
  `NADA_A_DIZER` quando não há. Ela é o que fica quando a frase do cartão sai, e
  é o que torna a saída dela honesta. Se alguém mexer nela, esta sprint deixa a
  tela muda sobre o estado.
* **A tira tracejada continua marcando a incerteza** — `ENDERECO_DA_INCERTA`
  (`:561`, `:1630`), `"sim"`/`""` e nunca um booleano.
* **`reenviar`, `cor`, `apagar` e `auto` não mudam uma linha.** Se um deles
  mudar, a cura entrou em `_escrever_a_cor` e não no gesto `brilho` — e aí ela
  alcançou quatro gestos que não estavam quebrados.

---

## A PROVA DE TELA

O que muda é o que a barra dela FAZ, e isso não se prova lendo código. O
instrumento é `src/hefesto_dualsense4unix/interface/controles_vivos.py`, que
dirige o WebKitGTK por dentro com o daemon vivo — `--oculta`
(`controles_vivos.py:1656`) e `--prova-gesto` (`:29`).

1. **A FOTO** — antes e depois, `--oculta` sempre. Ela tem UMA tela.
2. **O CLIQUE** — com a Steam aberta em cima de um dos controles (é o estado C,
   o mais fácil de reproduzir na mesa), arraste o trilho e **veja a barra
   escurecer**. Hoje ela não escurece e um cartão explica por quê.
3. **A MORDIDA** — devolva as três linhas da guarda (`:2442-2444`), arraste de
   novo, e veja o cartão voltar com a barra parada. Régua que passa com a cura
   arrancada não mede nada.

E o caso B tem prova própria: com `lightbar_source` desconhecida, a barra tem de
acender **na cor do número daquele controle** — não em preto, não em branco.
