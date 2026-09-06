---
sprint: ONDA4-S10-O-TRANSPORTE-01
estado: aberta
posse:
  T:
    - src/hefesto_dualsense4unix/interface/mesa_viva.py
    - src/hefesto_dualsense4unix/interface/pacotes/__init__.py
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
    - src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py
    - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
    - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
    - docs/data/paridade-gtk-html.csv
cria:
  - tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py
bancada: false
depois_de: [ONDA1-X-OS-FATOS-01, ONDA2-01-JOGAR-01, ONDA2-02-CONTROLES-01, ONDA2-03-GATILHOS-01, ONDA2-07-LANCADORES-01, ONDA2-09-SISTEMA-01, ONDA3-GESTO-DECLARA-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/onde.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/gui/aba_conexoes.py
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/aba05.py
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba08.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/aba10.py
---

# ONDA4-S10 · O TRANSPORTE — "cabo" e "rádio", pela função que já tem dono

**Esta é a ÚNICA das treze sprints da fila das dezesseis que continua aberta.**
As outras doze fecharam entre 04 e 05/09; a prova de cada uma está no
[ÍNDICE DA ONDA QUATRO](2026-09-05-ONDA-QUATRO-INDICE.md).

**Decisão dela (D-05), verbatim:** *"cabo / rádio, pela função que já existe."*

Registrada em
[AS DEZESSEIS DECISÕES](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md)
§1. Não espera mais palavra dela.

---

## 1. O QUE MUDA NA TELA DELA

O cartão da aba Jogar diz **`White · cabo`** onde hoje diz `White · USB`. O
mesmo na fita do topo das dez abas, no cabeçalho do card da aba Controles, no
chip da aba Gatilhos e na frase da aba Lançadores.

**O que NÃO muda: a contagem do cabeçalho.** `● 2 controles: 2 USB · 0 BT`
fica como está, e a razão é gramática — *"2 cabo · 0 rádio"* não é português.
A decisão dela é sobre a palavra que nomeia UM controle; a contagem é outra
frase, ela está no desenho aprovado, e o portão do desenho a defende. **A
consequência de engenharia é o coração desta sprint** e está na §3: se a
contagem fica em `USB`/`BT` enquanto a palavra vira `cabo`/`rádio`, quem conta
**não pode mais comparar a palavra**.

## 2. O QUE ESTÁ EM JOGO, MEDIDO

Existe **uma função dona** da palavra, e ela é da janela estável:

    app/actions/home_actions.py:1338   def palavra_do_transporte(transporte)
    app/actions/home_actions.py:1324   _PALAVRA_DO_TRANSPORTE — usb/cabo, bt/bluetooth/radio → rádio
    app/actions/home_actions.py:1335   PALAVRA_DE_TRANSPORTE_DESCONHECIDO = "não sei por onde"

Ela tem **um terceiro estado honesto** que nenhuma das cópias tem: transporte
ausente vira *"não sei por onde"*, e transporte que o mapa não conhece volta
**cru**, para aparecer na tela em vez de sumir atrás de uma frase genérica. Ela
já tem régua própria: `tests/unit/test_home_a_mesa_inteira_e_a_lingua_do_mapa.py:381-401`.

**E a interface nova escreve a mesma tradução em QUATRO lugares, em DOIS
dialetos.** Medido nesta árvore em 05/09/2026:

| onde | o que está escrito | dialeto |
| --- | --- | --- |
| `interface/mesa_viva.py:343` | `"via": "USB" if transporte == "usb" else "BT"` | jargão |
| `interface/pacotes/__init__.py:895` | `VIA_DO_TRANSPORTE = {"usb": "USB", "bt": "BT"}` | jargão |
| `interface/pacotes/a01_jogar.py:358` | `(c.get("transport") or "").upper()` | jargão |
| `interface/pacotes/a09_sistema.py:558` | `via = "cabo" if str(c.get("transport") or "") == "usb" else "rádio"` | o dela |

**A QUARTA LINHA É A PROVA QUE FECHA O CASO, e ela não é hipótese: está
fotografada no próprio código.** O comentário de
`interface/pacotes/a09_sistema.py:505-538` guarda a foto da mesa dela de
03/09/2026, com o P1 no cabo e o P2 no rádio:

    a fita, no topo      P1 · White · USB
    este painel, abaixo  P1 · White · cabo · <os 17 caracteres>

**O mesmo fato, na mesma tela, em duas línguas** — e nenhuma das duas sai da
função dona. Não é que a interface nova fale só jargão: é que ela já fala as
duas, e a escolha é do arquivo, não do produto.

Há ainda **um quinto e um sexto** na bancada — `interface/aba08.py:2396` e
`:2408` traduzem `via == "USB"` de volta para `"cabo"` na cena do desenho. É a
ida e a volta da mesma tradução para chegar à palavra que a função dona já
produz.

**Fora do escopo, e declarado:** `gui/aba_conexoes.py:210` é a janela GTK
estável. Ela não é desta sprint.

## 3. A ARMADILHA, e é ela que decide o desenho da cura

**Três lugares COMPARAM a palavra em vez de comparar o transporte:**

| `interface/mesa_viva.py:369` | `usb = sum(1 for c in mesa if c.get("via") == "USB")` |
| `interface/pacotes/a07_lancadores.py:994` | `str(c.get("via") or "").strip().upper() == "USB"` |
| `interface/pacotes/a03_gatilhos.py:1811` | `if nome in ("—", via)` |

E um quarto compara o CONJUNTO delas:
`interface/pacotes/a09_sistema.py:489` monta `_NAO_E_NOME` com
`{TRAVESSAO, *VIA_DO_TRANSPORTE.values()}`, para descartar o último degrau de
`identidade_de` quando ele cai no transporte.

**Trocar a palavra sem tocar nestes quatro quebra a contagem em silêncio.** A
tela passaria a dizer `● 2 controles: 0 USB · 2 BT` com os dois no cabo — o
número errado, sem erro, sem log, sem uma linha vermelha. É exatamente a
família de defeito que esta casa persegue: *o mesmo fato com dois donos, e o
segundo envelhece calado.*

**A CURA É A SEPARAÇÃO, e o dado para fazê-la já existe:**
`interface/mesa_viva.py:344` já publica `"transporte": transporte` — a chave
crua, `"usb"`/`"bt"`, ao lado da palavra. **Quem conta passa a ler
`transporte`; quem escreve na tela passa a ler `via`.** Depois disso a palavra
pode mudar sem que uma única conta se mexa, que é a propriedade que falta hoje.

## 4. OS PASSOS, e a MORDIDA de cada um

**Nenhum passo escreve a tradução.** Se você digitar `cabo` ou `rádio` em
qualquer arquivo desta posse, o passo está errado: a palavra vem de
`palavra_do_transporte` e de mais lugar nenhum.

### P1 · As contas soltam a palavra e agarram o transporte

Os quatro comparadores da §3 passam a ler a chave crua. Nada muda na tela;
é o passo que torna os outros seguros.

**A MORDIDA:** troque `_PALAVRA_DO_TRANSPORTE` para devolver qualquer outra
palavra e rode a régua da contagem. Antes de P1 a contagem vira `0 USB · 2 BT`
com dois controles no cabo; depois de P1 ela continua certa. **Régua que passa
com a palavra trocada é a régua que esta sprint existe para escrever.**

### P2 · `mesa_viva` chama a dona

`interface/mesa_viva.py:343` deixa de traduzir e chama `palavra_do_transporte`.

**O custo de importação é ZERO, e está medido:** `mesa_viva.py:38` já importa
`app.actions.base` no topo do módulo, e `actions/base.py:9-12` faz
`gi.require_version("Gtk", "3.0")`. **Este arquivo já paga o GTK.** Não há
dívida nova a declarar.

**A MORDIDA:** arranque a chamada e devolva o `if` inline. A régua tem de ver
`"USB"` chegar à tela onde o produto diz `cabo`.

### P3 · `VIA_DO_TRANSPORTE` morre

`interface/pacotes/__init__.py:895` sai, e `identidade_de` (`:942-943`) cai na
dona. Os três chamadores acompanham: `a02_controles.py:1797`,
`a03_gatilhos.py:1805` e o `_NAO_E_NOME` de `a09_sistema.py:489`.

**A ROTA DE IMPORTAÇÃO É A DAS DEZ ABAS, e tem precedente medido:**
`a01_jogar.py:621`, `:685`, `:875`, `:922` e `:1092` já importam `home_actions`
**dentro da função**, e `pacotes/__init__.py:965` faz o mesmo com
`app.widgets.controller_card`. Siga essa forma; ela existe porque
`pacotes/__init__.py:889` declara, por escrito, que importar GTK no topo deste
módulo é o que se evita aqui.

**A MORDIDA:** devolva a constante e veja a régua acusar **duas** verdades para
o mesmo transporte na mesma árvore.

### P4 · O terceiro dialeto de `a01_jogar` sai

`a01_jogar.py:358` — `(c.get("transport") or "").upper()` — é o degrau de
reserva para quando a mesa não trouxe `via`. Ele deixa de gritar o valor cru em
maiúsculas e passa pela dona, que **para este caso tem resposta melhor**:
`"não sei por onde"` em vez de `""`. O cartão (`:400`) não muda de forma.

**A MORDIDA:** entregue um controle sem `transport` e sem casa na mesa. A régua
tem de ver a frase de "não sei", nunca um `·` seguido de nada.

### P5 · `a09_sistema` para de ter a sua própria versão certa

`a09_sistema.py:558` já diz `cabo`/`rádio` — e é a quarta cópia. Ela cai na
dona como as outras. **Este passo não muda um pixel**, e é o que impede a
próxima pessoa de concluir que "a 09 já estava certa" e deixar a cópia viva.

**A MORDIDA:** troque a palavra na dona. A linha de identidade da 09 tem de
acompanhar; hoje ela não acompanha.

### P6 · A linha 21 do CSV

`docs/data/paridade-gtk-html.csv:21` — *"A palavra do transporte no cartão"*,
hoje `DIFERENTE`. Ela fecha com o endereço lido no código, e a célula registra
**o que a medição acrescentou ao enunciado**: eram quatro cópias e dois
dialetos, não uma cópia; e a contagem fica em `USB`/`BT` por gramática, com a
razão escrita.

**A MORDIDA:** o portão do CSV recusa `IGUAL` sem sinal `PRESENTE` e sem
endereço. Escreva a linha errada de propósito uma vez e veja-o recusar.

## 5. A TELA

Foto **`--oculta`** antes e depois, e o clique. **Ela tem UMA tela**; janela
que nasce na frente dela quebra o que ela está fazendo.

O que fotografar, e são quatro superfícies porque a palavra mora em quatro:

1. **a fita do topo** — o chip de cada controle;
2. **a aba Jogar** — o cartão, `nome · cabo`;
3. **a aba Sistema** — a linha de identidade e a fita **na mesma foto**: é o
   par que estava em dois dialetos, e a foto é a prova de que deixou de estar;
4. **o cabeçalho** — a contagem, para mostrar que ela **não** mudou.

**Com os dois controles na mesa dela, um no cabo e um no rádio.** Uma mesa de
um controle só não distingue as duas palavras, e foi por isso que este defeito
sobreviveu a quatro leituras.

## 6. NADA SE PERDEU

Toda linha aqui é requisito:

* **o terceiro estado continua honesto** — transporte ausente diz *"não sei por
  onde"*, e transporte desconhecido volta **cru** para alguém o ver. As cópias
  que morrem não tinham nem um nem outro: o `else "BT"` de `mesa_viva.py:343`
  afirma rádio sobre qualquer coisa que não seja `usb`, inclusive sobre o vazio;
* **a contagem do cabeçalho não muda** — `X USB · Y BT` fica, e passa a ser
  imune à palavra;
* **`identidade_de` mantém a ordem das quatro fontes** (o que ELA nomeou > o
  modelo decodificado > a mesa > o transporte). Só o último degrau troca de
  língua;
* **o descarte do último degrau continua funcionando** — `a09_sistema.py:489` e
  `a03_gatilhos.py:1811` existem para não escrever `P2 · BT · BT`. Depois desta
  sprint eles impedem `P2 · rádio · rádio` pela mesma regra;
* **a janela GTK estável não é tocada** — ela já fala a língua dela desde
  sempre; é dela que a função dona veio;
* **o desenho aprovado não é republicado.** Nenhum pixel novo, nenhuma altura
  nova, nenhum `--publicar`.

## 7. O QUE ELA DESBLOQUEIA

**Nada espera por esta sprint** — ela é a última da fila das dezesseis, e é por
isso que sobrou. O que ela entrega não é desbloqueio, é **subtração**: três
cópias a menos de uma tradução que tem dono, e a palavra da tela deixando de
estar acoplada à conta da tela.

**O que ela fecha:** a linha 21 do CSV, e o par de dialetos que a foto de
03/09/2026 pegou na mesma tela.

## 8. O QUE VOCÊ RELATA EM VEZ DE EDITAR

* `interface/monta.py:1578-1579` e `:1592` montam a contagem da **bancada** a
  partir de `CONECTADOS`, a cena do desenho, comparando `c["via"] == "USB"`. O
  `monta.py` é o arquivo mais compartilhado da interface — **18 módulos importam
  dele** — e não é desta posse. Se a cena da bancada precisar acompanhar,
  **relate**;
* `interface/aba08.py:2396` e `:2408` retraduzem `via` para `cabo`/`rádio` na
  cena da bancada. Os dez geradores, de `aba01.py` a `aba10.py`, são das frentes de aba. **Relate**;
* `app/actions/home_actions.py` é o dono da função e está em `nao_toca:` de
  propósito: mudar a dona muda a janela estável dela junto, e isso é outra
  decisão.

É a R1 da casa: quando o conserto pede arquivo alheio, relate em vez de editar.
