---
sprint: MIGRA-CONTROLES-08
onda: MIGRA-CONTROLES
posse:
  MC8:
    - src/hefesto_dualsense4unix/app/actions/controles_web.py
    - scripts/telas/aba02.py
    - src/hefesto_dualsense4unix/gui/telas/02-controles.html
cria:
  - scripts/telas/regua_que_clica.py
  - tests/unit/test_migra_controles_08_os_gestos_voltam.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-04
  - MIGRA-CONTROLES-06
  - MIGRA-CONTROLES-07
  # SÉRIE: dividem o gerador e a página com esta.
  - MIGRA-CONTROLES-05
  # COLISÃO DE ARQUIVO DECLARADA: o diretório dos geradores e da página, que
  # a MIGRA-CONTROLES-02 cria.
  - MIGRA-CONTROLES-02
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - novo-layout/
---

# MIGRA CONTROLES · 08 — Os gestos voltam, e a régua que clica

## O defeito

**Dois, e o segundo é o que dói.**

### 1. Metade dos controles da tela é desenho, não controle

Medido em 29/08 sobre `layout/02-controles.html`: a página tem **21
`<button>`** e **cinco `<input>`** — e os cinco são os rádios do acordeão
(`c-todos`, `c-p1`..`c-p4`). Não há um único `<input type="range">`.

Os **dois trilhos de volume por cartão** — o do microfone e o do alto-falante —
são `<span class="trilho"><span class="cheio" style="width:N%">`. **São
desenhos.** Quem for ligar a aba tem de **criar** o controle, não só fiá-lo.

E junto com ele vem o "valer ao SOLTAR", que o produto já aprendeu duas vezes,
com razão medida em cada uma:

- `app/widgets/controller_card.py:3573-3574` — o alto-falante liga
  `button-release-event` **e** `key-release-event`, e o `key-` está lá porque
  teclado também arrasta;
- `app/actions/lightbar_actions.py:770` (`_fiar_aplicar_ao_soltar`) — aplicar a
  cada pixel **satura a fila do rádio**, com quatro controles disputando a
  mesma fila dos relatórios de entrada.

### 2. Nenhuma régua desta casa clica

`layout/_ferramentas/olhar.py` faz `goto`, espera, e fotografa
(`:22-35`). Ele **não clica em nada**. Consequência direta: **o estado "Todos" —
os quatro cartões abertos — nunca foi fotografado por régua nenhuma**, e é
justamente o único estado desta aba que rola (o gerador o anuncia:
*"em 'Todos', os N abertos e ROLA_EM_TODOS px de rolagem"*). Nesse estado os
dois últimos cartões nascem com **zero pixel à mostra**.

**FATO CORRIGIDO:** o censo desta aba atribuiu o cegamento a
`--hide-scrollbars` no `olhar.py`. Conferido linha a linha em 29/08: **essa
opção não existe naquele arquivo** — os únicos argumentos são
`["--no-sandbox"]`. O defeito é maior e mais simples do que o censo disse: **a
régua não clica, ponto.** Ela mede um estado só, o inicial.

É a forma exata dos **seis instrumentos falsos em quinze horas** de 29/08: *a
régua desliga onde o defeito mora.*

**E é agora que dá para consertar.** A rota WebKit foi escolhida, entre outras
razões, porque `:hover`, `Tab` e `Enter` **reais** foram fotografados — coisa
que a rota do emissor GTK não entregou em foto nenhuma.

## O que entrega

1. **Os gestos ganham endereço e caminho.** Cada `data-gesto` da
   [MIGRA-CONTROLES-04](2026-08-29-MIGRA-CONTROLES-04-cada-valor-da-tela-ganha-endereco.md)
   posta pela ponte, e o Python o traduz para a chamada que **já existe**:
   `mic.set` e `mic.volume.set` (`daemon/ipc_server.py:156` e `:159`,
   atendidos em `daemon/ipc_handlers.py:4676` e `:4757`), `speaker.set`
   (`ipc_server.py:150`). **Os três já aceitam `uniq`** — o endereçamento por
   peça está no daemon desde antes desta leva, e é a tela que gravava global.
2. **Os dois trilhos viram controle de verdade**, com o "valer ao soltar" de
   fábrica, pela razão da fila do rádio.
3. **Todo gesto tem recibo.** Aceito diz o que mudou; recusado diz o que **não**
   aconteceu e por quê. Ausência de notícia é lida como sucesso — é o padrão
   `O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO`, e esta aba manda para
   o rádio, onde metade das escritas é `parcial` ou `não` no mapa de canais.
4. **Uma régua que clica**, `scripts/telas/regua_que_clica.py`: ela **exercita**
   os estados que só existem depois de um gesto — o acordeão em cada cartão, o
   "Todos", o hover das dicas, a navegação por `Tab` — e fotografa cada um.
   É a régua que a aba nunca teve.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_08_os_gestos_voltam.py`:

- **cada gesto chega no controle CERTO**: clicar no mudo do cartão do P2 chama
  `mic.set` com o `uniq` do P2. **Faça a chamada sair sem `uniq` e veja
  reprovar** — a escrita global no cartão de uma peça é o defeito histórico
  desta aba, e é o teste que o impede de voltar;
- **o volume vale ao SOLTAR, e só**: arrastar o trilho de 0 a 100 tem de
  produzir **uma** chamada, não cem. Arranque o "ao soltar" e veja o contador
  ir a cem — é a saturação da fila do rádio, reproduzida em teste;
- **a régua que clica vê o que a de hoje não vê**: com os quatro cartões
  abertos, ela afirma que os cartões 3 e 4 **existem e estão fora da vista**, e
  quanto a caixa rola. **Volte a régua para o `goto`+`screenshot` de hoje e veja
  a asserção ficar impossível de escrever** — essa impossibilidade é o defeito;
- **o recibo de recusa diz o que não aconteceu**: com o daemon recusando,
  a tela **não** mostra o valor novo. **Arranque o recibo e veja a tela
  afirmar uma mudança que não houve** — é a cicatriz da `LIGHTBAR-BT-RESET-01`
  (330 mil escritas ignoradas com a barra apagada, e ela passou dias
  acreditando que a cor tinha ido porque a janela dizia que sim);
- **a conta dos gestos é LIDA, não digitada**: o número de `data-gesto` na
  página tem de casar com a tabela do gerador — nas duas direções. O censo de
  29/08 contou **42** com a mesa de quatro; **esse número não entra no teste
  como constante**, porque a mesa agora é a real e o número muda com ela. Uma
  régua com o 42 escrito à mão reprova a mesa dela, que tem dois controles.

## O que é dela decidir

- **Os dois "Liberar" não estão no mockup, e um deles é inalcançável hoje.** O
  do alto-falante é criado em `controller_card.py:3577` e empacotado só em
  `:3668` — o ramo de **dois ou mais** cartões; **no cartão de UM controle, que
  é a tela mais comum dela, ele não tem pai.** O do microfone é a terceira ação
  do mesmo ícone (`Silenciar` / `Ativar` / `Liberar`, `:1980-1988`). Eles voltam
  como ícone, viram dica, ou saem? (pergunta 3 do índice da ONDA-CONTROLES)
- **O ícone do microfone carrega três ações no mesmo botão.** Ele cicla as três,
  ou o "Liberar" ganha ícone próprio? (pergunta 4)
- **`button_toggles_system`** — o botão do microfone do controle muda o mudo do
  PC inteiro. O campo existe (`profiles/schema.py:451`) e o daemon já o aplica
  (`daemon/ipc_draft_applier.py:565-592`); **nenhuma tela o escreve.** É
  trabalho quase pronto. Entra como caixa no bloco Microfone desta aba, ou vai
  para a Conexões junto do modo do microfone? (pergunta 5)
