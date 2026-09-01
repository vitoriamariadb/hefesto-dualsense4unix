---
sprint: MIGRA-JOGAR-07
onda: MIGRA-JOGAR
posse:
  J7:
    - src/hefesto_dualsense4unix/app/actions/jogar/escada.py
    - src/hefesto_dualsense4unix/integrations/ponte_escada.py
cria:
  - src/hefesto_dualsense4unix/app/actions/jogar/escada.py
  - tests/unit/test_migra_jogar_07_a_escada_na_tela.py
bancada: false
depois_de:
  - ONDA-JOGAR-03
  - ONDA-NAVEGACAO-02
  - MIGRA-JOGAR-03   # sem `#jg-escada` não há degrau a pintar
  - MIGRA-JOGAR-04   # a 04 cria o pacote `app/actions/jogar/`
  - MIGRA-JOGAR-06   # a escada só aparece com "Jogar pelo Hefesto" escolhido
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/integrations/ponte_tentativa.py
  - novo-layout/
---

# MIGRA JOGAR · 07 — a escada do código na tela

**O defeito é de tradução, e traduzir errado aqui não muda um rótulo: muda a
ordem em que o produto tenta.**

**O código tem QUATRO degraus** (`integrations/ponte_escada.py:294`, `ESCADA`):

| # | Ponte | Por quê, no próprio código |
|---|---|---|
| 1 | `Ponte(KIND_GAMEPAD, MASCARA_DUALSENSE)` | *"Dez linhas do `mapa-controles.csv` só chegam ao jogo por `uhid` (…) Errar aqui custa um aperto de botão; errar para Xbox custa as dez, e custa em silêncio."* |
| 2 | `Ponte(KIND_GAMEPAD, MASCARA_XBOX)` | *"o piso mais largo que existe (…) Não carrega nenhuma das dez linhas `uhid`."* |
| 3 | `Ponte(KIND_NATIVE)` | — |
| 4 | `Ponte(KIND_GAMEPAD, MASCARA_DUALSENSE, steam_input=True)` | exige fechar a Steam |

**A tela desenha CINCO** (`layout/01-jogar.html:640-646`): *Automático*,
*Hefesto*, *Sony (nativo)*, *Steam Input*, *Teclado + Mouse*. Ou seja, o mockup
**colapsa os degraus 1 e 2 num só** (*"Hefesto"*) e **acrescenta um que não
existe** (*"Teclado + Mouse"*).

E há três coisas escritas que nunca chegaram a esta aba:

- **a escada nunca teve tela na Jogar.** Ela roda desde 19/08
  (`integrations/ponte_tentativa.py` é quem sobe; o gesto **PS + R3** é
  `integrations/hotkey_daemon.py:25`);
- **o carimbo é publicado e ninguém o lê.** `pontes_confirmadas` sai no
  `state_full` desde 19/08 e a busca em `app/` devolve **dois hits, os dois em
  comentário** — a medição está escrita em
  `app/actions/profiles_actions.py:934-948`. *"Zero leitores."*
- **`POR_ESCOLHA_DELA` (`ponte_escada.py:174`) e `CONFIRMADA_POR_ESCOLHA`
  (`profiles/schema.py:628`) têm zero escritores.** O valor existe para *"ela já
  sabe e escolhe direto"*, e o único caminho que confirma ponte sempre usa
  `POR_SILENCIO`. **É a cura escrita e nunca ligada** — o defeito mais caro desta
  casa.

## O que entrega

1. **A tela mostra a escada QUE EXISTE.** Enquanto ela não decidir o quinto
   degrau, `#jg-escada` é pintada a partir de `ponte_escada.ESCADA` — quatro
   degraus mais o *Automático* por cima, que é o topo e não um degrau (é o que a
   própria dica do mockup já diz: *"tenta na ordem abaixo e para quando
   acerta"*). **O número em cada degrau vem do índice na `ESCADA`, nunca digitado
   na página.**
2. **O quinto degrau fica desenhado e inerte**, com o motivo na dica, até ela
   responder. `KIND_DESKTOP` **existe** (`ponte_escada.py:169`) e **não é degrau
   da `ESCADA`** — a diferença entre essas duas frases é a sprint inteira.
3. **O carimbo aparece.** *"Este jogo já sabe por onde entra"* passa a ser lido de
   `state_full.pontes_confirmadas`. **A remoção do mesmo carimbo da aba Perfis é
   da onda Perfis** — palavra dela: *"Isso sai. Isso tá na aba Jogar."* As duas
   não podem fechar sem se falar, ou o mesmo fato fica em dois lugares.
4. **Escolher um degrau escreve `POR_ESCOLHA_DELA`.** É para isso que o valor
   existe, e é a ponta que falta. Dois perfis dela já têm carimbo no disco
   (`big_walk.json`, `duskfade.json`), o que dá dado real para provar contra sem
   inventar fixture.
5. **O que esta sprint NÃO fecha, e declara:** `SUBIR_REABRINDO_O_JOGO`
   (`ponte_escada.py:190`) não tem executor — a escada **nunca arma** o Nativo
   nem o Steam Input sozinha. Fechar isso mexe no ramo *"o perfil manda"* e está
   registrado como aberto em `docs/process/2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md` §5.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_07_a_escada_na_tela.py`:

- **a tela é a `ESCADA`, e não uma cópia.** `len(#jg-escada .degrau[data-degrau])`
  tem de ser `len(ponte_escada.ESCADA)` (+1 pelo *Automático*), e os rótulos e a
  ordem têm de sair de lá. **A mordida:** acrescente ou remova um degrau da
  `ESCADA` — o teste reprova. Uma escada digitada na página passaria, e é
  exatamente por isso que o mockup pôde desenhar cinco;
- **o degrau vivo é o carimbado.** Dublê com `pontes_confirmadas` para um appid;
  o `.on` cai no degrau daquele carimbo. **A mordida:** apague a leitura do
  carimbo — o teste reprova, e a tela volta a mostrar sempre o *Automático*, que
  é o estado de hoje;
- **escolher grava com a origem certa.** Clique num degrau; o que vai ao disco
  tem de ter `POR_ESCOLHA_DELA`, nunca `POR_SILENCIO`. **A mordida:** troque a
  constante — o teste reprova. Hoje `POR_ESCOLHA_DELA` tem **zero** escritores, e
  este é o teste que o transforma em cura ligada;
- **o quinto degrau não promete.** Enquanto `KIND_DESKTOP` não estiver na
  `ESCADA`, clicar em *Teclado + Mouse* não pode disparar tentativa nenhuma, e a
  dica tem de dizer o porquê. **A mordida:** ligue-o a `KIND_DESKTOP` sem
  acrescentá-lo à `ESCADA` — o teste reprova, porque a ordem de tentativa
  passaria a ter um degrau que a escada não conhece;
- **a régua roda o tique mais de uma vez.** O carimbo muda por fora (outro jogo
  abre); a tela acompanha no tique seguinte.

## O que é dela decidir

1. **O quinto degrau: "Teclado + Mouse" (mockup) ou "Controlar o PC"
   (`home_actions.py:154`)?** E a pergunta é **material, não de rótulo**: se ele é
   o modo desktop, a `ESCADA` ganha um degrau novo com `KIND_DESKTOP` e a ordem
   inteira volta à mesa; se é outra coisa, é **escada nova**.
2. **Os degraus 1 e 2 continuam colapsados em "Hefesto"?** O código os separa por
   uma razão medida — **dez recursos do controle** só chegam ao jogo pelo
   primeiro, e a própria dica da tela diz que errar ali custa os dez **em
   silêncio**. Um botão que esconde essa diferença esconde o custo.
3. **A escolha de degrau vale agora ou no próximo jogo?** E ela entra pelo
   `Aplicar`, como os modos, ou vale no clique?
