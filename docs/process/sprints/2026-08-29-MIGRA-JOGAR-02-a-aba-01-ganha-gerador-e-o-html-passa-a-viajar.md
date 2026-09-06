---
sprint: MIGRA-JOGAR-02
estado: absorvida
onda: MIGRA-JOGAR
posse:
  J2:
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/interface/regerar.py
    - layout/01-jogar.html
    - src/hefesto_dualsense4unix/gui/telas/01-jogar.html
cria:
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/gui/telas/01-jogar.html
  - tests/unit/test_migra_jogar_02_a_pagina_que_o_produto_carrega.py
bancada: false
depois_de: []
nao_toca:
  - pyproject.toml
  - install.sh
  - scripts/check_packaging_parity.sh
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/fim.html
  - src/hefesto_dualsense4unix/gui/main.glade
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 01). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA JOGAR · 02 — a aba 01 ganha gerador, e o HTML passa a viajar

**O defeito, em três fatos medidos:**

1. **A Jogar é a única das dez sem gerador.** `src/hefesto_dualsense4unix/interface/` tem
   `aba02.py` … `aba10.py`. **Não existe `aba01.py`.** As outras nove nascem de
   Python; esta é editada à mão.
2. **O rodapé dela é cópia gêmea, e o próprio arquivo declara o arranjo.**
   `layout/01-jogar.html:2294-2296`: *"Esta aba é mantida à MÃO: a cópia
   gêmea está no `src/hefesto_dualsense4unix/interface/fim.html`, e as duas mudam juntas."* **Não há
   régua que compare as duas.** Toda mudança de moldura é feita duas vezes, e a
   segunda é a esquecível.
3. **A página não existe fora da máquina dela.** `novo-layout/` é
   `.gitignore:108` — não viaja em `git worktree add`, não está no pacote
   (`pyproject.toml:84-93` inclui `gui/*.glade` e `gui/assets/*.png`, e nada mais
   de desenho) e o `install.sh` não a copia. **Com o WebKit, a aba INTEIRA é o
   HTML**: a falha deixa de ser um desenho faltando e passa a ser a aba não
   existir, sem um erro no log.

E há um agravante de processo já visto: a árvore
`/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-dev` recebeu a pasta
**copiada à mão**. Duas levas editando o mesmo mockup em árvores diferentes
divergem **sem conflito de merge**, porque o git não vê nenhuma das duas — e aqui
o arquivo é a **especificação aprovada por ela**.

## O que entrega

1. **`src/hefesto_dualsense4unix/interface/aba01.py`**, no molde dos outros nove, emitindo
   **byte a byte** a página que ela aprovou. A régua de aceite é essa: gerar e
   comparar com a cópia de hoje. Diferença é defeito do gerador, nunca "melhoria"
   — **interface só fecha com o olho dela**, e esta sprint não tem permissão de
   mudar um pixel.
2. **O rodapé passa a sair de `src/hefesto_dualsense4unix/interface/fim.html`**, e a cópia
   gêmea morre. O comentário `:2294-2296` sai junto: ele descreve um arranjo que
   deixa de existir.
3. **A página chega ao produto.** O endereço é
   `src/hefesto_dualsense4unix/gui/telas/01-jogar.html`, ao lado do
   `gui/main.glade`, e é para lá que o `WebView` da MIGRA-JOGAR-01 aponta. **O
   `novo-layout/` continua sendo onde ela olha e onde o desenho se gera**; o
   `gui/telas/` é a cópia que o produto carrega, e ela é **gerada**, nunca
   editada.
4. **Uma régua que reprova a divergência entre as duas**, e é o coração desta
   sprint: se a página que o gerador emite e a página que o produto carrega
   diferirem em um byte, o portão fica vermelho. Sem isso, o `gui/telas/`
   envelhece calado — que é exatamente o defeito 2 mudando de endereço.

**O que esta sprint NÃO decide:** `pyproject.toml`, `install.sh` e
`scripts/check_packaging_parity.sh` são a **moldura das dez abas** e estão no
`nao_toca`. As dez páginas entram no pacote de uma vez, por uma sprint só; dez
sprints editando `pyproject.toml` é a colisão que este campo existe para evitar.
Esta sprint entrega a Jogar **no endereço** que a moldura fixar, e a régua do
passo 4 é quem reprova se ela não estiver lá.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_02_a_pagina_que_o_produto_carrega.py`:

- **o gerador reproduz o aprovado.** Rode `src/hefesto_dualsense4unix/interface/aba01.py` e
  compare a saída com `layout/01-jogar.html`. Igualdade byte a byte.
  **A mordida:** mude uma linha do gerador — o teste reprova, dizendo qual byte;
- **o rodapé tem UM dono.** Mude `src/hefesto_dualsense4unix/interface/fim.html` e regenere:
  a página tem de mudar junto. **A mordida:** devolva a cópia gêmea ao HTML e
  desligue o gerador do `fim.html` — o teste reprova, porque a mudança no dono
  não chega à página. **Este é o teste que hoje não existe**, e é por isso que a
  cópia gêmea sobreviveu;
- **a página que o produto carrega é a que o gerador emite.** Compare
  `src/hefesto_dualsense4unix/gui/telas/01-jogar.html` com a saída do gerador.
  **A mordida:** edite uma linha só do arquivo do produto — o teste reprova. É a
  régua que impede a segunda cópia de nascer no lugar da primeira;
- **o arquivo existe onde o produto o procura.** O caminho vem de uma constante
  do código, não digitado no teste. **A mordida:** apague o arquivo do
  `gui/telas/` — o teste reprova em vez de o produto abrir uma aba em branco.

**Cuidado de instrumento:** os portões são **cegos a arquivo novo**. Rode-os
**depois** do `git add`, senão o `gui/telas/01-jogar.html` recém-criado passa por
todos eles sem ser olhado.

## O que é dela decidir

Nada nesta sprint — e é de propósito. Ela é a única da onda que **não pode**
mudar o que está na tela: gerar o que já foi aprovado é toda a entrega.

Se ao escrever o gerador aparecer diferença que não seja erro de transcrição — um
número, um espaço, uma cor —, **pare e mostre a ela**. Diferença aqui não é
detalhe: é o desenho que ela aprovou mudando sem que ninguém tenha pedido.
