---
sprint: A-TELA-SAMBA-01
estado: aberta
posse:
  P0:
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
    - scripts/abrir_interface.py
    - tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py
cria:
  - tests/unit/test_a_tela_nao_samba.py
bancada: false
depois_de: [MIGRA-CONTROLES-03, ONDA0-P-O-PILOTO-01, ONDA5-03-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - mockup/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/profiles/
---

# A-TELA-SAMBA-01 · DEFEITO VIVO — a interface repinta sem parar, perde cliques e mata a dica

> **A palavra dela, 06/09/2026, 02:50, com o produto aberto na aba Jogar e um
> DualSense no cabo:** *"a interface inteira tá sambando"*. Perguntada o que
> vê, marcou **quatro**: *pisca / repinta sem parar* · *cliques não aplicam ou
> atrasam* · *trava por instantes / layout quebrado* · e escreveu: *"botões não
> funcionam, algo ativa o tooltip mas ele se desativa"*.

**É a primeira sprint das 24 horas, antes de qualquer outra.** Um produto que
perde cliques invalida toda prova de tela feita sobre ele. A `ONDA5-P-01`
espera por esta; as duas são do mesmo arquivo e do mesmo agente.

---

## 1. O QUE SE MEDIU ANTES DE ESCREVER (06/09, 02:50–02:55)

1. **Duas fotos da tela dela com um minuto de intervalo são idênticas** — o
   sintoma não é de layout parado; é de MOVIMENTO entre tiques. Só instrumento
   que conta mutações no tempo o vê.
2. **Três alvos do pintor ESCREVEM antes de comparar.** Em `escrever()`:
   * `atributo` (`hefesto_vivo.py:621-632`) faz `removeAttribute`/`setAttribute`
     a cada tique e só depois compara `getAttribute` com `antes`;
   * `cor` (`:544`) faz `el.style.color = t` e depois compara;
   * `plastico` (`:572`) faz `setProperty`/`removeProperty` e depois compara.
   Os outros (`texto`, `html`, `classe`, `marcado`, `valor`) comparam ANTES.
   **Um `setAttribute('title', igual)` é uma mutação de DOM** — e a dica nativa
   do WebKit fecha na mutação do atributo que a alimenta. As dicas vivas
   (`dica-modo-*` da aba 03, `ignorar-dica` da 08, todo `data-hef-atributo="title"`)
   passam por esse alvo **dez vezes por segundo** (`TIQUE_MS = 100`,
   `hefesto_vivo.py:114`). É a hipótese mais barata para *"algo ativa o tooltip
   mas ele se desativa"*, e é medível em cinco minutos.
3. **Blocos trocam o miolo inteiro quando o HTML difere** (`hefesto_vivo.py:949`):
   um bloco que carregue um valor que muda a cada tique (bateria, contagem,
   hora) é reconstruído dez vezes por segundo — o botão sob o mouse deixa de
   existir entre o `mousedown` e o `click`, e o `hef-em-voo` some com o nó. É a
   hipótese para *"cliques não aplicam"* e *"botões não funcionam"*.
4. **O tique roda no laço do GTK** (`GLib.timeout_add(TIQUE_MS, self._tique)`,
   `hefesto_vivo.py:2497`) e cada tique faz duas viagens de IPC
   (`estado_do_daemon()` + `pacote_da_pagina()`). Do outro lado, o daemon
   responde a `profile.list` abrindo **os 33 perfis do disco dela com
   `FileLock`** (`profiles/loader.py:1268-1272`) — medido: os `.json.lock` de
   todos os perfis avançam o `mtime` a cada ~3 s enquanto a janela está aberta.
   Se uma viagem passar de 100 ms, o tique seguinte já está na fila: é a
   hipótese para *"trava por instantes"*.
5. **A janela lançada pelo `.desktop` não deixa rastro**: `stdout` e `stderr`
   do processo vivo (`abrir_interface.py`, pid da sessão) apontam para
   `/dev/null`. Nenhum dos quatro sintomas tem log.

---

## 2. O TRABALHO, EM CINCO PASSOS — medir primeiro, e cada medida vira régua

### Passo 1 — o instrumento: mutações por tique, por alvo

Um modo `--conta-mutacoes N` no piloto (`--oculta`): um `MutationObserver` na
raiz do documento acumula, por `data-campo` e por tipo (`attributes`,
`childList`, `characterData`), quantas mutações aconteceram em N tiques **com a
mesa parada**. Escreva a tabela no relatório. **O número certo com a mesa parada
é ZERO** para tudo o que não mudou de valor.

**A MORDIDA:** rode com a cura do Passo 2 arrancada e veja o `title` de
`dica-modo-*` mutar dez vezes por segundo.

### Passo 2 — os três alvos comparam ANTES de escrever

`atributo`, `cor` e `plastico` passam a ter a forma dos outros seis: leem,
comparam, e só escrevem se difere. Zero mutação com valor igual.

**A MORDIDA:** `test_a_tela_nao_samba::test_atributo_igual_nao_muta` — um
`title` reescrito com o mesmo valor não dispara o observador. Devolva a forma
de hoje e ele reprova.

### Passo 3 — bloco só troca o que mudou

Para cada `seletor` de `blocos`, o Passo 1 diz se ele muta com a mesa parada.
Cada um que mutar tem um valor por tique dentro do HTML; a cura é do PACOTE
(mover o valor que muda para um `data-campo` próprio) e não é desta posse —
**RELATE por aba**, com o seletor e o campo culpado. O que ESTA sprint faz no
piloto: o bloco só é reescrito se o HTML difere **e** nenhum descendente está
`hef-em-voo` — um botão trabalhando nunca é destruído sob o mouse.

**A MORDIDA:** ponha um elemento em voo dentro de um bloco cujo HTML mudou; o
nó tem de sobreviver ao tique.

### Passo 4 — o tique mede a si mesmo, e o teto é declarado

`_tique` cronometra as duas viagens e o `run_javascript`; passa a registrar
quando a soma passa de `TIQUE_MS`, e a pular o tique seguinte em vez de
enfileirar. O teto e o número medido entram no docstring, como a aba 09 faz
com as leituras lentas. Se a medição mostrar que `profile.list` custa os 33
`FileLock`, **RELATE ao daemon** (não é desta posse): a lista não precisa de
lock para ler, e não precisa ser relida a cada 2 s.

**A MORDIDA:** dublê que atrasa a ponte 300 ms — o piloto não pode acumular
tiques; a régua conta os tiques executados em 3 s.

### Passo 5 — a janela dela passa a deixar rastro

`scripts/abrir_interface.py` redireciona `stderr` para
`~/.local/state/hefesto-dualsense4unix/interface.log` (rotacionado por
tamanho) quando não há terminal. É o mesmo lugar em que a suíte já desvia o
`XDG_STATE_HOME`. Sem isto, o próximo *"sambando"* volta a ser diagnosticado por
foto.

---

## 3. NADA SE PERDEU

* **A piscada da 03-Q4** (`MS_DA_PISCADA`, `hefesto_vivo.py:187`) e o
  `hef-deu-certo` continuam; ela é UMA classe por clique, não é o samba.
* **O `hef-em-voo`** continua vestindo o elemento clicado até o pouso.
* **O `--prova-gesto`, o `PERIGOSOS` e o `--prova-de-mockup`** não mudam.
* **As nove réguas que já existem sobre o pintor** ficam verdes: a cura torna
  os alvos idempotentes, não muda o que eles escrevem.
* **Nenhuma página é regerada.** O que muda é o piloto.

## A PROVA DE TELA

`--oculta`, e desta vez **no tempo**: a tabela de mutações em 100 tiques com a
mesa parada, antes e depois; a dica de modo da aba 03 aberta e **ficando
aberta** por 5 s (foto aos 0 s e aos 5 s); um clique num botão dentro de um
bloco que muda, aplicando na primeira vez.
