---
sprint: MIGRA-ILUMINACAO-08
onda: MIGRA-ILUMINACAO
posse:
  IL8:
    - layout/_ferramentas/aba04.py
    - scripts/telas/aba04.py   # o mesmo arquivo depois da MIGRA-CONTROLES-02
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_migra_iluminacao_08_o_trilho_e_o_soltar.py
bancada: false
depois_de:
  - LEVA-1
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - ONDA-ILUMINACAO-07
  - ONDA-ILUMINACAO-08
  - ONDA-ILUMINACAO-09
  # A FILA INTEIRA que vem antes desta, e ela é longa de propósito: nove das doze
  # abrem `app/actions/lightbar_actions.py` e cinco abrem `_ferramentas/aba04.py`.
  # Quem divide arquivo executa EM SÉRIE (R5), e o portão de colisão não faz fecho
  # transitivo — por isso a fila se escreve inteira, como na ONDA-SISTEMA-02.
  - MIGRA-ILUMINACAO-01
  - MIGRA-ILUMINACAO-03
  - MIGRA-ILUMINACAO-11
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-04
  - MIGRA-ILUMINACAO-05
  - MIGRA-ILUMINACAO-06
  - MIGRA-ILUMINACAO-07
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/daemon/
---

# MIGRA ILUMINAÇÃO · 08 — O trilho de brilho vira controle, e o envio espera o soltar

## O defeito, e são dois

### (a) O trilho é um desenho, não um controle

Os `.trilho` do mockup são `<span>` com um `<span class="cheio">` de largura em %
(`layout/_ferramentas/aba04.py:320`; o CSS em `:195-197`). **Conferido no
HTML gerado: o miolo da aba tem quatro `<input>`, e os quatro são
`type="color"`.** Não existe um controle de brilho na página — existe o desenho
de um.

**Quem for ligar a aba tem de CRIAR o controle, não só fiá-lo.**

### (b) O "valer ao soltar" não sobrevive à troca de motor, e ele existe por medição

Hoje o adiamento é `button-release-event` + `key-release-event` no `GtkScale`
(`_fiar_aplicar_ao_soltar`, `app/actions/lightbar_actions.py:770-813`), e a razão
está escrita: aplicar a cada pixel **satura a fila do rádio** — que é a **mesma
fila dos relatórios de entrada**. Com N controles disputando, o preço multiplica
por N.

O `GtkScale` some com a `MIGRA-ILUMINACAO-02`. Se o adiamento não mudar de lugar
junto, cada arraste vira uma rajada de IPC por coluna.

## O que entrega

1. **O `.trilho` vira controle de verdade**, com **teclado**. O WebKit entrega
   `:hover`, Tab e Enter reais — foi fotografado em 29/08.
2. **O adiamento muda de lugar, não de regra.** Na página: `pointermove` pinta,
   `pointerup` / `keyup` / `change` **envia**. Uma mensagem por gesto acabado.
3. **Enquanto arrasta, a tela anda.** O número em %, a largura do `.cheio` e a
   `opacity` das duas tiras mudam a cada passo — só o IPC espera. Uma cura que
   adie TUDO deixa o trilho morto na mão.
4. **O mesmo vale para o `<input type="color">`:** o evento `input` pinta, o
   `change` envia.
5. **Os destinos sobrevivem.** `_on_lightbar_brilho_solto` (`:830`) e
   `_on_lightbar_cor_solta` (`:814`) continuam sendo o fim do caminho, agora com
   o `uniq` da `MIGRA-ILUMINACAO-07`.
6. **A idempotência da fiação continua valendo.** `install_lightbar_tab` tem
   **dois** pontos de chamada em `app.py` (janela normal e janela que nasce
   oculta na bandeja), e é por isso que existe o `_soltar_fiado` (`:376`).
   Conectar duas vezes manda duas escritas por gesto — **o dobro do tráfego que
   o adiamento existe para poupar**.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_08_o_trilho_e_o_soltar.py`:

- **um arraste, um IPC.** Dublê que conta chamadas. Simule 40 passos de arraste
  numa coluna → **exatamente 1** `led_set_detalhado`. **Arranque o adiamento e
  veja 40** — e com quatro colunas, 160. Devolva.
- **a tela anda nos 40 passos.** Leia o `data-campo="brilho-num"` no passo 20:
  ele já mudou. Uma cura que adie a pintura junto com o envio passa no teste
  anterior e reprova neste — **é por isso que os dois testes existem**.
- **o teclado conta como controle.** Tab até o trilho, seta para a direita,
  Enter. Se a régua não medir teclado, ela mede metade do controle — e o produto
  fica inacessível para quem não usa mouse.
- **a fiação não duplica.** Chame `install_lightbar_tab` duas vezes e conte as
  mensagens por gesto → 1. Arranque o `_soltar_fiado` e veja 2.
- **a régua declara o motor.** Ela mede no **WebKitGTK 4.1**, não no Chrome, e
  diz isso no docstring. Os dois desenham controle de faixa de forma diferente,
  e medir no Chrome sobre uma cura do WebKit é a armadilha nº 1 desta casa.

## O que é dela decidir

**Se o trilho vira `<input type="range">`, o desenho dela muda.**

Medido em 29/08: o WebKitGTK **relata as cores do autor e desenha o tema do
sistema** — foi o que fez os `<select>` saírem como caixa branca, e a cura foi
`select{appearance:none}` (`layout/_ferramentas/ver.py:78-88`; são **117**  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
`<select>` nas dez abas). **Um `range` tem o mesmo problema, e a mesma cura
muda o desenho.**

As duas saídas:

- **`<input type="range">` com `appearance:none` e o CSS dela por cima** — o
  teclado vem de graça, o desenho precisa ser reconstruído em CSS e pode não
  ficar idêntico ao que ela aprovou;
- **o `<span>` de hoje, com o teclado feito por nós** (`tabindex`, `role`,
  `aria-valuenow`, as setas) — o desenho fica **intacto**, e o custo é código.

**É escolha dela, porque muda o que ela aprovou** — e a régua da segunda saída
tem de medir a acessibilidade, senão a economia sai da tecla de quem não usa
mouse.
