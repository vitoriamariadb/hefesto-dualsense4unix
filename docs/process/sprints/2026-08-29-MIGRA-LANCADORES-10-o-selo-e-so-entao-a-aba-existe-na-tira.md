---
sprint: MIGRA-LANCADORES-10
onda: MIGRA-LANCADORES
posse:
  ML10:
    - src/hefesto_dualsense4unix/app/telas/lancadores.py
    - tests/unit/test_migra_lancadores_10_o_selo_e_a_tira.py
cria:
  - tests/unit/test_migra_lancadores_10_o_selo_e_a_tira.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-01
  # O ENXERTO DESTA ABA: é ele quem cria `app/telas/lancadores.py`,  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
  # que da 05 à 10 é escrito EM SÉRIE por ser um arquivo só.
  - MIGRA-LANCADORES-01
  - MIGRA-LANCADORES-02
  - MIGRA-LANCADORES-03
  - MIGRA-LANCADORES-04
  - MIGRA-LANCADORES-05
  - MIGRA-LANCADORES-06
  - MIGRA-LANCADORES-07
  - MIGRA-LANCADORES-08
  - MIGRA-LANCADORES-09
nao_toca:
  # ESTA SPRINT NÃO ABRE O GLADE, e é de propósito. A página da Emulação já saiu
  # na MIGRA-LANCADORES-01, e o "escondido" mora em `VISIVEL_NA_TIRA`, dentro do
  # módulo da aba — não num `visible=False` do XML. Assim a revelação não precisa
  # esperar a bancada, que é o recurso mais disputado da casa.
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/daemon/
  - scripts/telas/aba07.py
  # A LINHA DA TIRA É DA MOLDURA (um arquivo, dez páginas). Esta sprint PEDE; a
  # MIGRA-CONTROLES-02 acrescenta, com a palavra dela.
  - scripts/telas/topo.html
---

# MIGRA LANÇADORES · 10 — o selo, e só então a aba existe na tira

**O defeito:** o selo tem três estados e o produto sabe medir **um**.

`SELOS = {"ok": "CHEGAM", "warn": "NÃO CHEGAM", "off": "NÃO ACHEI"}` (no
gerador). Medido:

- **`NÃO ACHEI`** — a **04** responde, com evidência.
- **`NÃO CHEGAM`** — só para a Steam, e só pelos impedimentos que o disco
  consegue nomear (a **07**).
- **`CHEGAM`** — **nenhuma linha do produto mede isso**, em lançador nenhum.

E o mapa de canais **não socorre**: `docs/data/mapa-controles.csv` tem 308 linhas
em 11 famílias (`audio`, `combinacao`, `energia`, `entrada`, `gatilho`,
`identidade`, `luz`, `movimento`, `plataforma`, `toque`, `vibracao`) e responde
por **peça** e por **transporte**. *"O controle chega no lançador"* não é canal do
aparelho — é a linha de inicialização, a exceção do Steam Input, a permissão de
aparelho. Nenhuma chave com `lancador`, `wrapper` ou `steam`.

**Consequência dupla, e é a razão de esta aba ser a de menor rede da casa:**
(a) a aba não se divide por transporte, e por isso a fita nasce esmaecida
(`fita_viva=False`); (b) `scripts/check_paridade_transporte.py` **não protege uma
única afirmação desta tela**. Toda a proteção nasce aqui.

Sem régua, `CHEGAM` sai por **ausência de impedimento** — e ausência de notícia
lida como sucesso é exatamente o padrão que
`O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO` registra.

## O que entrega

1. **Um quarto estado: `NÃO SEI`.** Ele não é derrota — é a única forma de o selo
   não mentir enquanto a régua não existe. `CHEGAM` passa a exigir **evidência
   positiva**, nunca a falta de evidência negativa.
2. **A régua que existe, para a Steam:** o `hefesto-launch` na `LaunchOptions`
   (`Prontuario.tem_wrapper`, `prontuario_dos_jogos.py:395`), a exceção do Steam
   Input (`steam_input_ligado`, `:403`) e o carimbo de ponte confirmada
   (`Censo.com_ponte_confirmada`, `:569`) — que é o único apoio que **não** vem
   do disco: alguém confirmou, com o jogo aberto, que aquela combinação pegou
   (`:122-135`).
3. **Para os outros quatro, `NÃO SEI`, com a dica dizendo o que faltaria.**
4. **A aba entra na tira, e é o último ato.** Decisão dela:
   `D-A-ABA-LANCADORES-NASCE-PLACEHOLDER` — *"ela só passa a existir quando tiver
   todas as features no projeto integrando e funcionando."* No GTK isso era
   `visible=False` num widget; **no WebKit é a tira do HTML não trazer o
   `<a href="07-lancadores.html">`** — forma diferente, mesma decisão. A linha da
   tira mora na moldura das dez páginas, não aqui: esta sprint **pede**, e a
   moldura acrescenta, com a palavra dela.
5. **A revelação, não o enxerto.** A página já está no `Gtk.Notebook` desde a
   **MIGRA-LANÇADORES-01**, e a Emulação já saiu lá. O que esta sprint faz é
   **tirar o escondido**: `VISIVEL_NA_TIRA` passa a `True` em
   `app/telas/lancadores.py`, e a moldura acrescenta o  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
   `<a href="07-lancadores.html">` na tira das dez. **Nenhuma linha de Glade** —
   a revelação não precisa da bancada.
6. **O portão do "Nada se perdeu".** Cada feature da aba Emulação de hoje tem
   dono nomeado no contrato (`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`,
   seção 10, o bloco "Nada se perdeu"). O portão exige que **nenhuma** saia sem
   endereço — nem a lápide do "Ver daemon.toml", que sai com o glade e não volta.

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_10_o_selo_e_a_tira.py`:

1. **`CHEGAM` exige evidência positiva.** Lançador sem régua e sem impedimento →
   selo `NÃO SEI`.
   **Mordida:** arranque o quarto estado → o selo cai em `CHEGAM` por ausência de
   impedimento, que é o defeito inteiro, e o teste reprova.
2. **A Steam usa a régua que tem.** Censo com wrapper posto e exceção gravada →
   `CHEGAM`; tire o wrapper → `NÃO CHEGAM` com a causa da **07**; tire a Steam da
   máquina → `NÃO ACHEI`.
   **Mordida:** faça o selo sair de `estado != "impede"` → o terceiro caso
   reprova.
3. **A aba não está na tira antes da palavra dela.** Enquanto a decisão não
   virar linha, a página não é alcançável pela tira, e há um teste que o afirma.
   **Mordida:** acrescente o `<a href>` → reprova, citando a decisão. *Este teste
   é temporário por desenho:* quando ela disser sim, ele inverte, e a inversão é
   o registro de que ela disse.
4. **O "Nada se perdeu" fecha.** Parse do contrato + grep na árvore: cada uma das
   dezesseis linhas do bloco tem dono nomeado, e nenhuma feature da Emulação
   ficou sem endereço.
   **Mordida:** apague o destino de uma linha → reprova nomeando qual. A 01
   provou que os **ids** sumiram do Glade; este teste prova que as **features**
   não sumiram do produto — são duas perguntas diferentes, e a segunda é a que
   ela vai fazer.
5. **A foto, antes e depois.** `scripts/gui-captura/retratar_abas.py`, e a aba
   nova aparece onde a Emulação estava, com as outras nove navegáveis.
   **Mordida:** não é teste — é `PROVA-DE-TELA-01`, e a palavra é dela.

## O que é dela decidir

- **Como o produto mede "o controle chega lá", por lançador.** É a trava do §0.1
  do `docs/process/SPRINT_ORDER.md`, e **trava esta sprint e com ela o fim da
  onda**. Nenhuma linha mede isso hoje, e o mapa de canais não responde por
  lançador.
  **E o preço vai junto com a pergunta:** a primeira versão honesta mostra
  **NÃO SEI** onde o mockup que ela aprovou mostra **verde em quatro cartões**.
  É divergência contra desenho fechado, e ela precisa saber **antes**, não ao ver
  a foto.
- **Quando a aba passa a existir na tira.** Ela decide **vendo** — foto na mesa,
  `PROVA-DE-TELA-01`. Aprovar o mockup não é aprovar a tela.

## Colisão declarada

`gui/main.glade` é **recurso de bancada — uma sprint por vez em toda a casa**.
`app/app.py` é disputado por quase todas as ondas. `scripts/telas/topo.html`
(a tira das dez, movida pela MIGRA-CONTROLES-02) é da moldura e está em `nao_toca`. Quem coordena serializa os
três; não resolva conflito de Glade sozinho.
