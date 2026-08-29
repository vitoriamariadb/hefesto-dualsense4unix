---
sprint: MIGRA-JOGAR-04
onda: MIGRA-JOGAR
posse:
  J4:
    - src/hefesto_dualsense4unix/app/actions/jogar/mesa.py
cria:
  - src/hefesto_dualsense4unix/app/actions/jogar/__init__.py
  - src/hefesto_dualsense4unix/app/actions/jogar/mesa.py
  - tests/unit/test_migra_jogar_04_a_mesa_real.py
bancada: false
depois_de:
  - ONDA-JOGAR-01
  - MIGRA-JOGAR-01   # o WebView no lugar da página
  - MIGRA-JOGAR-03   # sem endereço não há o que pintar
  - MIGRA-JOGAR-10   # o chip de máscara só mostra escolha que o daemon obedece
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA JOGAR · 04 — a mesa real pinta os cartões

**O defeito:** a página desenha **quatro** cartões fixos. **Ela tem dois
controles.** Palavra dela, 29/08:

> *"o layout se adapta a medida dos controles que eu tenho (…) e se eu comprar
> outros dualsense eles aparecem também seguindo a lógica que montamos no
> `mapa-do-controle.html`."*

E **zero controles é estado legítimo** — o desenho não o tem.

## O que já existe, e esta sprint só liga

Cinco dos seis valores do cartão já saem do `state_full` e já têm quem os
formate. **Não reescreva nenhum.**

| O que | Quem já responde |
|---|---|
| contagem na mesa | `app/actions/home_actions.py:1099` (`controles_na_mesa`) |
| os externos | `:1472` (`externos_na_mesa`) — vêm por `controller.list {external:true}`, porque o `state_full` **não** publica a chave `external` |
| palavra do transporte (USB/BT) | `:1338` (`palavra_do_transporte`) |
| título do cartão (Player N) | `:1571` (`_format_controller_title`); o número nasce em `daemon/subsystems/coop.resolve_player_numbers` |
| subtítulo e bateria | `:1416` (`_format_controller_subtitle`); `battery_pct` nasce em `core/backend_pydualsense.py:5112` |
| o glifo da bateria | `assets/glyphs/bateria.svg`, versionado, e é o mesmo arquivo da aba Controles |
| o desenho, na cor | `assets/control-svg/dualsense.svg`, com `data-colorway` — o molde é o `<template>` da MIGRA-JOGAR-03 |

## O que entrega

1. **Um cartão por controle presente, clonado do `<template>`.** Zero, um, dois
   ou N. O número do jogador é **campo**, não posição na fila — é o que a legenda
   do mockup já promete (`novo-layout/01-jogar.html:2340`).
2. **O cabeçalho conta o que está na mesa.** `#jg-conectado` deixa de dizer
   *"4 controles: 2 USB · 2 BT"* e passa a dizer a repartição real, que é
   aritmética sobre dado já lido.
3. **Clicar num cartão leva a fita para ele** — decisão do mockup, e a mesma
   gramática que ela fixou para o acordeão da Controles. O alvo tem **um dono**:
   `app/alvo_de_edicao.py`. O cartão do alvo leva o mesmo realce do chip
   escolhido (`.cartao.alvo`), para os dois lerem como uma escolha só.
4. **A cor do plástico, com honestidade.** O cartão pinta o que houver; **sem
   cor conhecida, nasce sem cor**, e a dica diz por quê. Esta sprint **não**
   conserta a leitura — ela é de outras duas, e duplicá-la deixaria as duas
   versões vivas:

   - **o mapa é portão e desmente dois dos quatro cartões do desenho.**
     `docs/data/mapa-controles.csv:111`, `identidade.cor_do_aparelho@dualsense`:
     `cabo_aciona=sim`, `radio_aciona=não`, `radio_por_que_nao_aciona=o-aparelho-recusa`.
     O mockup mostra P2 (Starlight Blue, BT) e P3 (Galactic Purple, BT) **com
     cor**. Quem muda isso é a **ONDA-CONEXOES-11**;
   - **a leitura que existe não persiste.** `app/actions/config/secao_controles.py:646`
     guarda em `self._cores`, dict de instância, e `:930` pula tudo que não seja
     `transporte == "usb"`. Fechou a janela, a cor do cabo se perde. O campo de
     disco que resolveria **já existe e ninguém o escreve a partir da leitura**:
     `ControleDeclarado.cor` (`utils/maquina.py:551`), hoje escrito só por
     declaração dela (`app/widgets/external_card.py:526-535`);
   - **o produto conhece 21 cores e o desenho conhece 28.** Quem fecha isso é a
     **ONDA-CONEXOES-12**. Enquanto não fechar, um controle de código `13`, `14`,
     `15`, `ZC`, `ZD`, `ZE` ou `ZF` devolve um serial válido que **o produto não
     sabe nomear e o desenho saberia pintar**. O cartão tem de degradar para
     "sem cor" nesse caso, e **não** para uma cor errada.

5. **A máscara do chip é a máscara VIVA**, e é por isso que esta sprint vem
   depois da MIGRA-JOGAR-10. Mostrar três chips por cartão sobre um mecanismo que
   decide **um só para a mesa** é desenhar uma escolha que o daemon ignora.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_04_a_mesa_real.py`:

- **a mesa manda no número de cartões.** Quatro cenários de `state_full`: zero,
  um, dois e quatro controles. Conte `#jg-pecas > [data-uniq]` **na página**.
  **A mordida:** troque o laço por um `range(4)` — o teste reprova em três dos
  quatro cenários, e é exatamente o defeito de hoje;
- **o cartão do zero.** Sem controle nenhum, a página não pode mostrar cartão
  nenhum **nem ficar em branco muda**. O que ela diz é decisão dela (abaixo);
  o teste exige que **algo** diga, e que não seja um cartão vazio;
- **cada valor vem de quem já o responde.** Dublê que devolve um `state_full`
  conhecido; os textos da página têm de bater com o que
  `home_actions._format_controller_title` e `_format_controller_subtitle`
  devolvem para o mesmo dado. **A mordida:** mude o formato numa dessas funções —
  o teste reprova, porque a página tem de seguir o dono, não uma segunda cópia;
- **a cor degrada, e não mente.** Controle por rádio, sem cor lida: o cartão sai
  **sem** `data-colorway` e a borda cai no `--border-forte`. **A mordida:** faça
  o cartão herdar a cor do vizinho ou cair num padrão — o teste reprova. Um
  cartão com a cor errada é pior que um sem cor: a borda é a identidade da peça;
- **o clique move a fita, e o alvo é um só.** Clique num cartão; o alvo em
  `app/alvo_de_edicao.py` tem de virar aquele `uniq`, e o realce tem de estar no
  mesmo cartão. **A mordida:** guarde o alvo numa variável própria do módulo —
  o teste reprova quando a fita e o cartão discordam. É a segunda variável que
  produziu a queixa *"clico em salvar e ele salva com nome de outro perfil"*;
- **a régua não digita a mesa.** Nenhum "4" escrito no teste: a contagem vem do
  `state_full` do dublê.

**O daemon vivo é mais velho que o código.** Com install editable, cura de daemon
só vale no próximo `start`, e o sintoma é a **ausência de dado**. Quem testar a
mão sem reiniciar o daemon vai ver o cartão sem cor e concluir que a ponte do
WebKit quebrou.

## O que é dela decidir

1. **Zero controles — o que a tela diz.** O desenho não tem esse estado. É a
   primeira coisa que alguém vê ao abrir o Hefesto sem nada ligado, e não se
   inventa aqui.
2. **A cor do plástico nos cartões do rádio.** Três saídas, de preços
   diferentes: **(a)** *lembrar* — gravar em `ControleDeclarado.cor` o que foi
   lido pelo cabo, e o cartão do rádio herda; **(b)** o cartão do rádio nasce sem
   cor; **(c)** ela declara à mão, que é o que o produto já permite. A **(a)** é
   a única que faz a mesa de quatro parecer com o mockup **sem mentir** — e ela
   deixa de ser necessária se a **ONDA-CONEXOES-11** fechar antes.
3. **Quantos cartões cabem numa fileira** quando a mesa passar de quatro. O
   desenho é `repeat(4,1fr)` numa fileira de 1163 px (`01-jogar.html:243`);
   cinco controles não cabem, e a régua de "os quatro num relance" foi escolha
   dela.
