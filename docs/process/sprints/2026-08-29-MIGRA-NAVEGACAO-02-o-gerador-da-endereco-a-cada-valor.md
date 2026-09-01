---
sprint: MIGRA-NAVEGACAO-02
onda: MIGRA-NAVEGACAO
posse:
  NAV6-GERADOR:
    - layout/_ferramentas/aba06.py
    - layout/06-navegacao.html
cria:
  - tests/unit/test_migra_navegacao_02_todo_valor_tem_endereco.py
bancada: false
depois_de: []
nao_toca:
  - src/
  - layout/_ferramentas/monta.py
  - layout/_ferramentas/aba01.py
  - layout/_ferramentas/aba02.py
  - layout/_ferramentas/aba03.py
  - layout/_ferramentas/aba04.py
  - layout/_ferramentas/aba05.py
  - layout/_ferramentas/aba07.py
  - layout/_ferramentas/aba08.py
  - layout/_ferramentas/aba09.py
  - layout/_ferramentas/aba10.py
---

# MIGRA NAVEGAÇÃO · 02 — O gerador dá endereço a cada valor, e os sessenta selects param de sair brancos

**A sprint que destrava as outras catorze.** Sem endereço, o Python não alcança
nada: `run_javascript` precisa de um `id` ou de um `data-` para pintar, e
`register_script_message_handler` precisa saber qual gesto chegou.

## O defeito

**O desenho já tem endereço; os controles, não.** Medido hoje em
`06-navegacao.html`:

| atributo | quantos | de onde vem |
|---|---|---|
| `data-entrada` | 76 | do SVG (`assets/control-svg/dualsense.svg`) |
| `data-feature` | 48 | idem |
| `data-controle` / `data-modelo` / `data-posicao` / `data-colorway` | 4 cada | idem |
| `data-clique` | 8 | idem |
| `id=` em elemento que NÃO é peça do SVG | **3** — `st-modo`, `remapeamento`, `point-and-click` | escritos à mão |

Ou seja: **os 90 valores da tela e os 90 gestos que ela oferece chegam a três
endereços.** Os 60 `<select>`, os quatro campos de número com `−`/`+`, o
interruptor de status, as 42 linhas das duas pop-ups, as cinco linhas de gesto e
os quatro cartões da mesa não têm nome nenhum.

**Segundo defeito, e é de motor.** O WebKitGTK relata as cores do autor e
desenha o **tema do sistema** nos `<select>`: eles saem como caixa **branca**
com texto quase invisível. A cura (`select{appearance:none}`) existe e é
aplicada **por fora**, numa folha de usuário do `ver.py`  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
(`layout/_ferramentas/ver.py`, o segundo `UserStyleSheet`). Uma cura que  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
mora no visualizador não viaja com a página. **Esta aba tem 60 dos 117 selects
das dez** — 51% da dívida — e nunca foi exercitada nessa densidade: as duas
pop-ups têm 21 selects cada, dentro de um corpo com rolagem interna.

**Terceiro defeito, e ele é visível.** `06-navegacao.html` traz
`url(&quot;#outline-filter-1&quot;)` quatro vezes e `url(&quot;#outline-filter-2&quot;)`
oito — **doze referências mortas** nos quatro desenhos da mesa. A causa está em
`layout/_ferramentas/monta.py:437`: o prefixador reescreve `url(#id)` e
**não** reescreve a forma com aspas escapadas, que é a que o desenho usa. O
Chrome ignora e desenha assim mesmo; o WebKit segue o SVG 1.1 e **não desenha**.
O contorno do touchpad nunca apareceu — em motor nenhum.

## O que entrega

1. **Um vocabulário de endereço, e ele já existe.** O SVG chama a peça de
   `data-entrada`; a página passa a chamar o valor de `data-valor` e o gesto de
   `data-gesto`, com o mesmo id que o produto já usa do outro lado do fio:
   - `data-valor="mouse.enabled"`, `mouse.speed`, `mouse.scroll_speed`,
     `mouse.device_ativo`, `mouse.bloqueio` (as chaves do
     `_mouse_emulation_payload`, `daemon/ipc_handlers.py:2157`);
   - `data-valor="teclado.enabled"`, `teclado.bloqueio`, `teclado.osk_disponivel`
     (as chaves do `_keyboard_emulation_payload`, `:2025`);
   - `data-valor="gesto.<id>"` para as cinco linhas de combo;
   - `data-valor="botao.<peca>"` nas 21 linhas de cada pop-up, onde `<peca>` é o
     **id do mapa** (`docs/data/pecas-do-dualsense.csv`) — nunca um índice de
     linha, que muda quando o mapa ganha uma peça.
   **Não se inventa nome novo**: quem já tem dono no `state_full` viaja com o
   nome do `state_full`. Nome que não deriva do léxico existente é sinal de
   conceito errado.
2. **Três templates**, porque a página nasce da mesa real e das listas reais e o
   Python **não constrói widget**:
   - `<template id="tpl-cartao">` — um cartão de controle (o que hoje é o
     `controle(c)` repetido quatro vezes);
   - `<template id="tpl-linha-botao">` — uma linha das pop-ups;
   - `<template id="tpl-linha-gesto">` — uma linha de gesto.
   O que está na página hoje continua lá como **exemplo estático**; o template é
   o molde que o Python clona.
3. **A cura do `select` entra na FOLHA DA PÁGINA.** `select{appearance:none;
   -webkit-appearance:none}` sai do `ver.py` e entra no CSS gerado. O `ver.py`
   pode mantê-la — folha dupla não faz mal —, mas a página deixa de depender
   dele. **Muda pixel**: é a mesma regra que ela já viu aplicada, então não é
   desenho novo; é o desenho que ela aprovou parando de depender do visualizador.
4. **Os doze `url()` mortos ficam VIVOS ou ficam FORA — e é dela.** A cura de
   `monta.py:437` está pronta e muda **1,09%** do desenho aprovado (o contorno
   do touchpad aparece pela primeira vez). Esta sprint **não a aplica**: ela é
   da moldura das dez, e a palavra é dela (`/tmp/filtro-LADO-A-LADO.png`, o
   lado a lado que quem coordena preparou). O que esta sprint faz é **impedir
   que a aba migre com o buraco calado**: um teste conta as doze e reprova
   enquanto elas existirem sem decisão registrada.
5. **O gerador para em vez de deixar a tela mentir.** `aba06.py` já faz isso em
   dois lugares (`SystemExit` quando a nota do touchpad muda de forma, e quando
   `jogador=` colide com `lampadas=False`). Ganha o terceiro: **se algum valor
   da tela ficar sem `data-valor`, a geração para nomeando o elemento.**

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_02_todo_valor_tem_endereco.py` — lê o HTML
gerado, sem abrir motor nenhum:

1. **Todo `<select>`, todo `.campo-num` e todo `.tog-in` tem `data-valor`.**
   Conta e compara com o total encontrado. **Morde:** apague o `data-valor` de
   uma linha do `BOTOES` no gerador e o teste nomeia a peça.
2. **Todo `data-valor` é único**, e nenhum é um número de linha.
   **Morde:** troque `botao.cross` por `botao.1` e reprova.
3. **Os três templates existem e clonam.** Cada `<template>` tem exatamente um
   filho de raiz e nenhum `data-valor` **fixo** dentro (o valor entra no clone).
   **Morde:** deixe um `data-valor="botao.cross"` dentro do template e reprova —
   dois elementos com o mesmo endereço é o defeito que a régua 2 existe para
   pegar, e no template ele nasceria multiplicado por 21.
4. **A cura do select está na página.** O CSS gerado contém
   `select{appearance:none`. **Morde:** tire a regra do gerador e reprova. Este
   teste é a única régua desta casa que enxerga esse defeito: ele **não aparece
   no Chrome**, e todas as fotos do mockup foram tiradas no Chrome.
5. **Os doze filtros mortos estão contados.** O teste conta
   `url(&quot;#outline-filter` no HTML e exige o número **exato** que a decisão
   dela registrar. Enquanto não houver decisão, o número é 12 e o teste
   **passa**; quando ela decidir aplicar a cura, o número vira 0 e quem esquecer
   de regerar reprova. **Morde:** é uma régua de contagem exata, não de "há
   algum" — mudar de 12 para 11 reprova igual.
6. **A prova de motor, e ela é foto.** Uma passada do `regua_popup.py` (ou do
   caminho que o piloto tiver deixado) sobre a página no **WebKit**, com um
   `<select>` das pop-ups aberto: a caixa não pode ser branca. **Morde:** rode a
   mesma foto sem a regra do item 4 e ela reprova. Sem esta metade, a régua mede
   o HTML e não o que ela vê.

## O que é dela decidir

- **Os doze filtros mortos.** A cura muda 1,09% do desenho que ela aprovou e faz
  o contorno do touchpad aparecer pela primeira vez, nos quatro cartões. É a
  mesma decisão que trava as outras quatro abas com o defeito — decidir uma vez
  serve para as cinco.
- **A regra `select{appearance:none}` é do desenho ou do visualizador?** A
  proposta é **do desenho**, porque a página tem de funcionar sem o `ver.py`.  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
  `PROVISÓRIO — decisão dela` se ela preferir a folha de usuário.

## O que esta sprint NÃO faz

Não muda uma palavra, um número, uma cor ou uma posição. **Atributo não é
pixel** — mas é mudança no gerador, e por isso está declarada. As duas exceções
que MUDAM pixel estão nomeadas acima (a cura do select, que é a que ela já vê no
`ver.py`) e a que **não** é aplicada aqui (os doze filtros).  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
