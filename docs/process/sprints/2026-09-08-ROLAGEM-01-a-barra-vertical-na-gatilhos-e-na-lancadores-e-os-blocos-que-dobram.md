---
sprint: ROLAGEM-01
estado: aberta
posse:
  ROLAGEM-01:
    - src/hefesto_dualsense4unix/interface/aba03.py
    - src/hefesto_dualsense4unix/interface/aba07.py
    - src/hefesto_dualsense4unix/interface/topo.html
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
bancada: false
depois_de: [TELA-TRES-01, LANCADORES-ZERO-01]
---

# ROLAGEM-01 — a barra vertical que nasceu na Gatilhos e na Lançadores, e os blocos que dobram

**Achado por ELA em 08/09/2026, com o produto instalado e maximizado.** Palavras
dela: *"outro bo desde que alteramos a altura e largura geral. duas paginas ficaram com barra de navegação vertical. tipo a gatilhos e lançadores. E tava pensando pra gatilhos talvez fosse interessante colocar a seção do r2 e l2 dentros de blocos de expansão igual fizemos na aba controles o que vc acha?"* <!-- noqa-acento: citação literal dela, palavra por palavra -->

São **duas coisas**: um defeito (a barra) e uma proposta de desenho (os blocos).
A proposta pode até curar o defeito — mas só depois de a causa estar medida,
senão dobra-se a aba e a barra continua lá.

## §1 — O que já está medido, e o que ISSO exclui

A mudança de 08/09 foi UMA linha (`topo.html:187`, commit `d63bbd73`):
`width:1180px` → `width:min(100%,1600px)`. **A altura não mudou**:
`--alt-janela:777px` (`topo.html:701`, *"a MESMA altura nas dez abas"*), e a
`.janela` é `overflow:hidden` — ela própria **não rola**.

Medido em 08/09 à noite, Chrome headless, as dez páginas PUBLICADAS
(`interface/paginas/`), em 1180, 1600 e 1900 de largura:

| o que | resultado |
| --- | --- |
| algum elemento dentro da `.janela` com `overflow:auto/scroll` e conteúdo maior que a caixa | **nenhum** na 03 nem na 07, nas três larguras. Só a 10 (`div.rolo`, 475/383 px), por desenho |
| conteúdo da `.janela` | 775 px nas dez |
| o que há ABAIXO da `.janela` no `body` | `div.nota` (a legenda) em todas: 1016 px na 03, 1007 na 07 — e 3093 na 02, 271 na 04 |

**O que isso exclui:** a causa não está no HTML publicado nem na largura. Se a
legenda fosse a causa, as dez rolariam — a 02 mais que todas — e ela viu duas.

**O que sobra, e é onde medir:** o que difere entre a minha medição e a tela
dela é **WebKit + dado vivo + a janela GTK**. Os candidatos, em ordem:

1. **a caixa que cresce com os quatro controles vivos.** A 03 desenha uma
   coluna por controle (`aba03.coluna`, `:883`), com o bloco do L2, o do R2 e
   a linha «Guardar / Todos» — com dado vivo cada coluna pode ficar mais alta
   que no publicado (o publicado tem as quatro colunas, mas com o desenho, não
   com os efeitos dela). A 07, com os seis cartões achados e o Steam com 63
   jogos, idem;
2. **a janela GTK** — `gui/ponte_da_tela.py:168-169` pede `1212 × (809 + 46)`
   (`set_size_request`, `:511`) e `set_default_size(TAMANHO_NA_TELA)` (`:493`).
   Maximizada, a `WebView` é maior que a `.janela`; NÃO maximizada, é a
   `.janela` que pode não caber;
3. **o `div.nota`** — só se o WebKit o mostrar e o Chrome não; improvável, pela
   conta das dez.

## §2 — A medição que decide, e ela roda NO WEBKIT

A sonda é a mesma que eu rodei no Chrome, mas dentro do piloto, com o daemon
dela e os quatro na mesa:

```js
(() => { const out=[]; for (const el of document.querySelectorAll('*')) {
  const cs = getComputedStyle(el);
  if ((cs.overflowY==='auto'||cs.overflowY==='scroll') && el.scrollHeight>el.clientHeight+1)
    out.push([el.tagName, el.id, el.className, el.scrollHeight, el.clientHeight]); }
  out.push(['DOC', document.documentElement.scrollHeight, document.documentElement.clientHeight]);
  return JSON.stringify(out); })()
```

Rode pela ponte JS do piloto (`hefesto_vivo.py --oculta --abre 03-gatilhos.html`
e o mesmo para a 07), **nas duas larguras**: a janela do `TAMANHO_NA_TELA`
(1212) e a maximizada (~1900). O que a lista devolver É a causa; escreva os
números aqui antes de mexer.

**Duas armadilhas já pagas:** o piloto dispara as migrações one-shot no
`~/.config` real de quem o roda — confira antes que elas já rodaram na máquina
dela (memória `rodar-o-piloto-migra-o-perfil-real-dela`); e `--oculta` sempre —
ela tem UMA tela.

## §3 — A proposta dela, e a minha opinião: SIM, com três condições

O modelo é o da aba Controles: a linha `.ctl` que se clica (`aba02.py:255-260`)
e o corpo fechado `.corpo-cx{height:0;overflow:hidden;visibility:hidden}`
(`:354`) — e a razão de ser `height:0` e não `display:none` está escrita ali:
a régua de alturas mede o corpo fechado por dentro, e `display:none` a cegaria.

**A mesma gramática serve para a Gatilhos**, com estas condições:

1. **A linha fechada DIZ o estado.** O que se dobra é o EDITOR (a lista de 19
   modos, as barras de posição e força); o que fica à vista, na linha, é
   *«L2 · Arma · 40 %»*. Regra dela de 07/09: *o que a pessoa precisa para
   executar não pode custar um clique* — e saber o que o gatilho está fazendo
   é executar.
2. **Dobra por LINHA, não por coluna.** As quatro colunas partilham a altura
   das linhas (`grid-template-rows`, `aba03.py:61`). Se o L2 do P1 abre e o do
   P2 fica fechado, as colunas desalinham e o R2 de cada uma cai numa altura
   diferente. O «L2» abre e fecha nas quatro colunas de uma vez, como o «Todos»
   da Controles rola as quatro de uma vez.
3. **«Guardar / Todos» fica fora das dobras.** É a linha que age sobre o PAR
   L2+R2 da coluna; dentro de um dos dois blocos ela ficaria escondida metade
   do tempo.

**O que a dobra NÃO faz:** curar a barra se a causa da §1 for a janela (item 2)
ou outra caixa. Por isso ela é a §3 e não a §1 — e por isso a Lançadores está
nesta sprint pela BARRA e não pela dobra: lá não há L2/R2 a dobrar, e a cura é
o que a sonda disser.

**É decisão de tela.** O desenho vai para o `mockup/` primeiro
(`interface/aba03.py` → `mockup/03-gatilhos.html`, e
`scripts/check_o_desenho_aprovado.py --publicar 03` leva ao produto), e publica-se com
o OK dela — a direção é `mockup/` → produto, nunca o contrário.

## §4 — O que MORDE

* a sonda da §2, com os quatro na mesa, devolve **lista vazia** (nenhuma caixa
  rolando) na 03 e na 07, nas duas larguras — e continua vazia nas outras oito;
* forçar `--alt-janela:500px` e a sonda tem de acusar a caixa que passou a
  rolar, nomeando-a. Régua que passa com a janela encolhida não mede altura;
* com as dobras: fechar o L2 e a linha continua dizendo o modo e a força
  (ler o texto computado da linha, não o gerador); abrir o L2 do P1 abre o das
  quatro colunas — medir a altura da linha nas quatro, iguais.

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo / BT | é tela: a sonda da §2 roda com os quatro na mesa, dois em cada transporte, e a barra não pode depender de qual está no rádio |
| no perfil | —; se os blocos dobrados guardarem estado (aberto/fechado), ele é da TELA, não do perfil |
| por controle | a dobra é por LINHA (as quatro colunas juntas), de propósito — §3 |
