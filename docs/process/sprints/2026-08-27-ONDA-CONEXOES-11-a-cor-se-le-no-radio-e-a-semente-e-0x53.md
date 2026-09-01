---
sprint: ONDA-CONEXOES-11
onda: CONEXOES
posse:
  A11:
    - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
    - src/hefesto_dualsense4unix/app/widgets/external_card.py
cria:
  - tests/unit/test_a_cor_se_le_nos_dois_transportes.py
bancada: true
depois_de:
  # SÉRIE, por R5: as quatro dividem `integrations/cor_do_plastico.py` ou
  # `secao_controles.py`, e quem divide arquivo executa EM SÉRIE. Esta vem por
  # último de propósito: ela é a única que muda o COMPORTAMENTO da leitura, e as
  # três de cima desenham a tela que vai consumi-la.
  - ONDA-CONEXOES-05
  - ONDA-CONEXOES-06  # também possui secao_controles.py; a série é do arquivo
  - ONDA-CONEXOES-08
  - ONDA-CONEXOES-09
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/ensaios/cor_do_plastico.py
  - docs/data/cores-do-dualsense.csv
---

# ONDA CONEXÕES · 11 — a cor se lê no rádio, e a semente é `0x53`

**O defeito, numa frase:** o produto recusa ler a cor de todo controle que está
no rádio — e a razão escrita no código para isso é um **fato que a medição de
27/08/2026 derrubou**.

## O que caducou, e por quê

**FATO ERRADO, JÁ SUBSTITUÍDO (27/08/2026, à noite).** O docstring de
`no_do_controle` (`src/hefesto_dualsense4unix/integrations/cor_do_plastico.py`)
dizia, sobre o primeiro dos três filtros: *"**cabo**: por rádio o firmware do
controle RECUSA o `0x80`. Medido em 23/08/2026 (…) Não é o BlueZ, não é o uhid,
não é o kernel, não é o daemon — **é o aparelho**."*

**A frase já saiu do código**, e não esperou esta sprint: a regra da casa é que
fato errado se substitui em todos os lugares, e este custou **quatro dias** — o
executante lia a lápide, acreditava, e parava. O que ficou no lugar dela diz a
medição certa e **aponta para esta sprint**, porque o filtro continua ali: quem
tirou a frase não tirou o comportamento, e escrever que o rádio funciona com o
filtro no lugar seria trocar uma mentira por outra.

**Não era o aparelho: era o nosso CRC.** As sementes desse CRC são o byte de
cabeçalho da transação HIDP, e há uma **por sentido**. O ensaio de 23/08 assinou
um `SET_REPORT` com a semente de `DATA|FEATURE`:

| semente | transação HIDP | resultado em 27/08 |
|---|---|---|
| `0xA3` | `DATA` \| `FEATURE` — o feature que **chega** | `errno 5` (a falha de 23/08, reproduzida) |
| `0xA2` | `DATA` \| `OUTPUT` | `errno 5` |
| **`0x53`** | **`SET_REPORT` \| `FEATURE` — o que SAI** | **aceito** |

**FATO ERRADO, SUBSTITUÍDO (27/08/2026, à noite).** Esta linha dizia *"os quatro
DualSense desta bancada responderam pelo rádio: White `00`, Cosmic Red `02`,
Galactic Purple `04`, Starlight Blue `05`"*. **Foram dois, e só um pelo rádio.**
A canônica é explícita — *"as **duas** medições desta bancada"* — e o cabeçalho
do ensaio repete a mesma tabela:

| alvo | transporte | serial | código | cor |
|---|---|---|---|---|
| `hidraw7` | cabo | `M65A05…` | `05` | Starlight Blue |
| `hidraw8` | **rádio** | `F55602…` | `02` | Cosmic Red |

Os quatro códigos `00/02/04/05` existem, mas são de **15/08** e vieram **pelo
cabo** (`docs/protocol/dualsense-referencia-canonica.md:1665-1670`, "quatro
unidades de quatro cores diferentes"). Ler aquela tabela como prova do rádio é o
erro que esta nota existe para não deixar passar de novo — e é uma amostra de
**um**, o que a prova de bancada desta sprint precisa levar em conta.

A canônica está corrigida em
`docs/protocol/dualsense-referencia-canonica.md:1574-1663`, com as duas leituras
de bancada na tabela de `:1613-1616`.

**A decisão dela não precisa ser reaberta.** `docs/data/cores-do-plastico.md:15-17`,
21/08/2026: *"o padrão é leitura automática (pelo cabo hoje, **pelo rádio quando a
ponte existir**), e a pessoa pode escolher a cor — a escolha dela vence a
tabela."* A ponte existe desde 27/08. O que **continua** sendo dela é a
autorização da **escrita** nos controles dela (ressalva 1 da canônica, `:1623-1625`) —
e isso está em "O que é dela decidir", abaixo.

## Os TRÊS portões que recusam o rádio, e eles são independentes

Consertar um deixa o sintoma idêntico. Esta casa já pagou por isso
(`memória: portões em série enganam`), e aqui são três:

| # | onde | o que faz | o que muda |
|---|---|---|---|
| 1 | `cor_do_plastico.py:165,369-378,382` | `_e_dualsense_no_cabo` exige `barramento == _BUS_USB` **junto** com VID/PID; `no_do_controle` devolve `None` para quem está no rádio | separar o filtro de **VID:PID** (que continua necessário) do filtro de **barramento** (que a medição derrubou) |
| 2 | `cor_do_plastico.py:331-335` | `conferir_pedido` exige os bytes `3..63` **zerados** | o CRC-32 do envelope BT ocupa os **quatro últimos** bytes do buffer de 64 — a trava reprovaria o próprio envelope, **antes do ioctl** |
| 3 | `app/actions/config/secao_controles.py:930` | `if not uniq or uniq in self._cores or transporte != "usb": continue` | a janela nem chama o leitor para quem está no rádio |

**O portão 2 é o que morde de verdade**, e é o que um `grep` não acha: mesmo com
o filtro de barramento aberto, o pedido por rádio seria recusado pela própria
trava, com a mensagem certa e a conclusão errada. **A cura já está escrita** — o
ensaio a resolveu com um parâmetro que confere o rabo em vez de exigi-lo zerado
(`scripts/ensaios/cor_do_plastico.py`, que esta sprint **lê e não toca**).

## O que entrega

1. **O filtro de barramento sai; o de VID:PID fica.** `no_do_controle` passa a
   aceitar o DualSense nos dois barramentos, e o docstring perde o parágrafo que
   hoje explica **por que o filtro ainda está lá** — ele existe só enquanto o
   filtro existir. Os outros dois filtros
   (VID:PID de fábrica da Sony, e o `vpad`, que forja VID/PID/bus de DualSense no
   cabo) continuam palavra por palavra: sem eles o módulo pediria o serial de
   fábrica ao aparelho de outro fabricante, ou à saída do próprio produto.
2. **`conferir_pedido` aprende o envelope do rádio**, com a mesma disciplina do
   cabo: confere byte a byte, e o que muda é **onde** o buffer pode ter conteúdo,
   nunca **o que** se manda. O par `(1, 19)` continua o único aceito, e
   `PARES_QUE_DESTROEM` continua barrando `[1,1]` (que **reseta o controle**) e
   `[12,1,…]` (que grava calibração na NVS). **Byte errado no payload escreve
   onde não devia, e não há desfazer** — a canônica reconfirma em `:1626-1629`.
3. **`ler_pelo_cabo` vira `ler_do_aparelho`.** O nome público afirma o transporte
   e é lido antes do corpo; mantê-lo obrigaria toda pessoa seguinte a decidir
   entre o nome e o comportamento. Três pontas a acompanhar: o import e a chamada
   em `secao_controles.py:70,933`, e a citação em
   `scripts/gui-captura/retratar_abas.py`.
4. **A janela deixa de filtrar por transporte** (`secao_controles.py:930`), e a
   pergunta continua **uma por endereço e por sessão** — a trava que existe
   porque a família `0x80` é a de fábrica, e ela não afrouxa aqui.
5. **A frase da tela para de mentir.**
   `app/widgets/external_card.py:97-103` traz
   `DICA_DA_COR_NO_RADIO = Fala(… "No rádio o controle recusa o pedido da cor.
   Escolha na lista.")`, escolhida por `dados.no_cabo`. O controle **não recusa**.
   Com a leitura ligada nos dois transportes, a dica separada por transporte
   deixa de existir: fica **uma** frase, a do valor lido, e o "Escolha na lista"
   volta a ser o que a ONDA-CONEXOES-05 desenhou para os três casos de correção.
   A linha do `docs/data/mapa-controles.csv` que sustenta a afirmação acompanha —
   e é o `scripts/check_paridade_transporte.py` que reprova quem esquecer.

## Como se prova — o teste que morde

`tests/unit/test_a_cor_se_le_nos_dois_transportes.py`, tudo com bancada falsa  <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->
(`raiz`, `listar`, `ler` e `perguntar` entram por argumento — regra F4, e o
`CANARIO-FS-01` pega constante de módulo):

1. **O mesmo endereço, nos dois barramentos, devolve o mesmo nó.** Com o uevent
   dizendo `0003:054C:0CE6` e depois `0005:054C:0CE6`, `no_do_controle` acha os
   dois. É a asserção que reprova se alguém devolver o `_BUS_USB` ao filtro.
2. **O VID:PID continua barrando.** 8BitDo e Pro Controller no cabo: `None`. O
   `vpad` (que forja VID/PID/bus de DualSense) no cabo: `None`. **Abrir um filtro
   não pode abrir os outros dois** — é a régua que separa esta sprint de uma
   regressão de segurança.
3. **`conferir_pedido` aceita o envelope do rádio e continua recusando o resto.**
   Com o CRC nos quatro últimos bytes: passa. Com um byte sujo **no meio**:
   `PedidoRecusadoError`, nomeando o índice. Com o par `(1, 1)`: recusa dizendo
   que **reseta o controle**. Com `0xF0` no byte 0: recusa por família do
   firmware.
4. **A semente é `0x53` e está declarada, não digitada duas vezes.** O teste lê a
   constante do módulo e confere que ela é `SET_REPORT|FEATURE`; um segundo
   assert confere que `0xA3` **não** é usada para assinar o que sai. Literal
   digitado no teste não vale: seria a segunda verdade que a casa mata.
5. **A janela pergunta para quem está no rádio.** Com dois controles adotados —
   um `usb` e um `bt` —, o leitor injetado é chamado **duas** vezes, uma por
   endereço. Hoje é chamado uma. É esta asserção que reprova se o
   `transporte != "usb"` voltar.
6. **E pergunta UMA vez por endereço e por sessão.** Chamar `_perguntar_as_cores`
   três vezes com o mesmo adotado dá **uma** pergunta. Abrir o filtro não pode
   abrir a torneira.
7. **A declaração dela vence a leitura, inclusive no rádio.** Cor declarada
   `Cosmic Red`, aparelho respondendo `White`: a tela e o disco ficam com o dela.

**A mordida:** devolva `barramento == _BUS_USB` a `_e_dualsense_no_cabo` e veja o
teste 1 reprovar; devolva `transporte != "usb"` a `secao_controles.py:930` e veja
o 5 reprovar; devolva a exigência de bytes zerados a `conferir_pedido` e veja o 3
reprovar **sem** derrubar o 1 nem o 5 — é essa independência que prova que os
três portões são três, e não um escrito em três lugares. Cole as quatro saídas.

## A prova de bancada — e ela é DELA, não do agente

`bancada: true`, e a razão é a ressalva 1 da canônica (`:1623-1625`): **a leitura
exige uma ESCRITA** (`SET_FEATURE 0x80`), e escrita em controle dela é decisão
dela, não do agente. O instrumento que já sabe fazer isso —
`scripts/ensaios/cor_do_plastico.py`, com seis travas e a de última milha que
**mordeu de verdade** em 27/08 — esta sprint **lê e não toca**.

A prova: um controle no cabo e outro no rádio, e a aba mostrando **a cor lida nos
dois**. É o inverso exato da foto que a ONDA-ILUMINACAO-08 encomendava antes de
27/08 — lá a prova pedida era a de que o do rádio caía no "Corrigir", e essa foto
carimbaria como correto um defeito nosso.

**E ela precisa de mais de um controle no rádio.** O ensaio de 27/08 mediu **um**
(`hidraw8`, Cosmic Red), e uma amostra de um não separa "o comando funciona por
rádio" de "aquele aparelho aceitou". A bancada desta sprint fecha isso: os
DualSense dela **no rádio**, um a um, com o serial de cada. Se algum recusar, o
achado é maior que a sprint — e é ele que decide se o produto pergunta sempre ou
pergunta e aceita o silêncio.

E o aparelho continua são depois: `GET_FEATURE 0x20` igual byte a byte antes e
depois, e três reports de entrada — que é como os dois desta bancada foram
conferidos em 27/08.

## O que é dela decidir

1. **A escrita nos controles dela, por rádio.** É a mesma autorização que ela deu
   ao ensaio em 27/08, agora para o produto — e o produto vai fazê-la **sozinho**,
   uma vez por endereço e por sessão, sem ela clicar. É a diferença que precisa da
   palavra dela: o ensaio ela mandou rodar; este pergunta por conta própria.
2. **Se a pergunta automática vale para todo controle da mesa ou só para o alvo.**
   Quatro DualSense no rádio são quatro escritas de família de fábrica por sessão.
   A proposta é: **todo controle adotado**, porque a cor é do aparelho e não da
   escolha — mas o número muda o risco, e o risco é dela.

## O que fica combinado com quem coordena

Esta sprint **fecha o par de afirmações** que a regra do fato errado manda
desempatar, e o fato errado está em **seis lugares**. Três saem com o código
desta sprint (`cor_do_plastico.py:382,400-407`, `external_card.py:97-103`, e o
`docs/data/mapa-controles.csv`); os outros três são de quem coordena, e já foram
reescritos em 27/08 à noite: a `ONDA-ILUMINACAO-08`, a `ONDA-JOGAR-07` e o
`ONDA-ILUMINACAO-INDICE`. Restam os do mockup
(`layout/_ferramentas/aba08.py`, e o HTML que ele gera) e do contrato
(`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`) — **os dois estão em
revisão com ela, e não se tocam sem a palavra dela.**

**Enquanto esta sprint não correr, o executante de qualquer outra lê a lápide,
acredita, e para.** Foi o custo que a casa pagou por quatro dias.
