---
sprint: MIGRA-JOGAR-03
estado: absorvida
onda: MIGRA-JOGAR
posse:
  J3:
    - src/hefesto_dualsense4unix/interface/aba01.py
    - layout/01-jogar.html
    - src/hefesto_dualsense4unix/gui/telas/01-jogar.html
cria:
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/gui/telas/01-jogar.html
  - tests/unit/test_migra_jogar_03_os_enderecos_da_aba.py
bancada: false
depois_de:
  # SÉRIE, por R5: as duas abrem `src/hefesto_dualsense4unix/interface/aba01.py`, que a 02
  # cria. Ordem: a 02 dá o gerador, a 03 põe os endereços dentro dele.
  - MIGRA-JOGAR-02
nao_toca:
  - src/
  - tests/unit/test_migra_jogar_02_a_pagina_que_o_produto_carrega.py
  - src/hefesto_dualsense4unix/interface/monta.py
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 01). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA JOGAR · 03 — cada valor da tela ganha endereço

**O defeito:** no motor novo o Python **alcança a tela por endereço**, e a página
não tem nenhum. Uma varredura por `id=` em `layout/01-jogar.html` devolve
**só** `<linearGradient>`, `<filter>`, `<defs>`, `<pattern>` e `<style>` — todos
de dentro do SVG, todos gerados pelo `src/hefesto_dualsense4unix/interface/monta.py`. **Nem
um id de dado.** Sem esta sprint, as sete que vêm depois não têm por onde pegar.

E há um segundo defeito no mesmo lugar: **o desenho inlina o SVG inteiro por
cartão** — quatro cópias de ~50 KB, ~202 KB numa página de 258 KB. Isso foi
correto no mockup, onde a cena é estática e quatro é quatro. Na aba viva a mesa
tem **0, 1, 2 ou N** controles, e o cartão precisa **nascer**, não estar
desenhado. Ela tem **dois** controles hoje, e o desenho tem quatro.

## O que entrega

1. **Um endereço por valor**, no gerador. **Mudar atributo não muda pixel** — e é
   por isso que esta sprint é barata e a régua dela é dura: o desenho tem de sair
   idêntico.

| Endereço | O que é | Onde está hoje |
|---|---|---|
| `#jg-conectado` | *"4 controles: 2 USB · 2 BT"* | `01-jogar.html:555` |
| `#jg-fita`, `#jg-perfil-ativo` | a fita de alvo e o crachá do perfil | `:566-585` |
| `[data-chip-alvo]` | cada chip da fita, pelo `uniq` do controle | `:568-573` |
| `#jg-modos`, `button[data-modo]` | a fileira de modos | `:617-622` |
| `#jg-conexao` | a sub-seção *"Modo de conexão"* | `:632` |
| `#jg-escada`, `.degrau[data-degrau]` | os cinco degraus | `:640-646` |
| `#jg-pecas` | a grade de cartões | `:685` |
| `#jg-modelo-cartao` | **`<template>` novo**: o molde de um cartão | não existe |
| `[data-uniq]`, `[data-bateria]`, `svg[data-colorway]` | dentro do cartão | `:686-…` |
| `.mascara .chip[data-mascara]` | os três chips de máscara | `:1073`, `:1466`, `:1859`, `:2252` |
| `#jg-atencao-conta`, `#jg-atencao-lista` | a coluna Atenção | `:2264`, `:2266-2269` |
| `#jg-modelo-aviso` | **`<template>` novo**: o molde de um aviso | não existe |
| `#jg-pendente` | a linha laranja tracejada | `:2280-2283` |
| `#jg-reconectar` | *"Reconectar Controles"* | `:2284` |
| `#jg-recibo`, `#jg-aplicar`, `#jg-salvar`, `#jg-importar`, `#jg-exportar` | o rodapé | `:2297-2301` |

   O prefixo `jg-` é o que o gerador já usa dentro do SVG (`jg-p1-…`, `jg-p4-…`):
   um prefixo só na página inteira, e nenhum id nasce igual a um id de `<filter>`.

2. **O `<template id="jg-modelo-cartao">`, com o SVG UMA vez.** O cartão sai da
   página como molde e é **clonado** pelo Python, um por controle presente. O
   desenho vem de `assets/control-svg/dualsense.svg` — que é **versionado**
   (94.712 B) e já traz `<style id="cores-do-dualsense-folha">` com 28 seletores
   `svg[data-colorway=…]`, gerados de `docs/data/cores-do-dualsense.csv`. **Pintar
   um cartão passa a custar um atributo** (`data-colorway="cosmic-red"`), não 50
   KB de SVG.
3. **O mesmo para o aviso** (`#jg-modelo-aviso`): a coluna Atenção mostra de zero
   a N, e o desenho mostra um.
4. **O canal do gesto, e ele é UM.** Todo elemento clicável ganha
   `data-gesto="…"`, e a página tem **um** ouvinte que despacha para
   `window.webkit.messageHandlers.<nome>.postMessage({gesto, alvo, valor})`. Um
   ouvinte por botão é como esta janela ganharia trinta e um donos para trinta e
   um gestos.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_03_os_enderecos_da_aba.py`:

- **o contrato de endereços está completo.** A lista da tabela acima vive **no
  código**, num só lugar, e o teste varre a página exigindo cada um.
  **A mordida:** apague um `id` do gerador — o teste reprova **nomeando** o que
  sumiu. Sem isso, um endereço perdido só aparece quando a tela fica muda;
- **o desenho não mudou.** Foto antes e foto depois, comparadas pixel a pixel.
  **A mordida:** mude uma largura no gerador junto com os ids — o teste reprova.
  **Cuidado medido em 27/08:** o `scrollIntoViewIfNeeded` do Playwright **rola
  antes de medir** e cega toda medição de layout feita depois. Fotografe sem
  rolar, ou role de propósito e declare a posição;
- **o SVG aparece uma vez.** Conte os `<svg data-colorway=…>` no HTML servido:
  **1**, dentro do `<template>`. **A mordida:** volte a inlinar os quatro — o
  teste reprova, e o tamanho da página diz o preço;
- **o molde produz o cartão aprovado.** Clone o `<template>`, preencha com os
  valores do mockup (P1 Cosmic Red USB, P2 Starlight Blue BT, P3 Galactic Purple
  BT, P4 White USB) e compare a foto com a página aprovada. **A mordida:**
  arranque uma classe do molde — o teste reprova. *Esta é a régua que impede o
  molde de ser "quase" o cartão dela*;
- **um ouvinte, e ele chega ao Python.** Clique sintético em cada
  `[data-gesto]`; cada clique tem de virar **uma** mensagem, com o gesto certo.
  **A mordida:** tire o `data-gesto` de um botão — o clique deixa de chegar, e o
  teste reprova em vez de o botão ficar inerte na mão dela.

**A régua LÊ a página, nunca digita a lista.** Se o teste carregar uma cópia da
tabela escrita à mão, ele mede o que alguém digitou — que é a forma exata das
**onze réguas** que em 26/08 reprovaram a melhora em vez do defeito.

## O que é dela decidir

- **Nada muda na tela, e é a promessa desta sprint.** Se ao dar endereço aparecer
  um valor que o desenho mostra e o produto não tem como preencher, **isso não se
  resolve aqui**: anota-se como buraco e vai para a sprint dona (04 a 09).
- Um já está anotado, e é o mais visível: **o cartão de zero controles não
  existe no desenho.** A 04 o carrega.
