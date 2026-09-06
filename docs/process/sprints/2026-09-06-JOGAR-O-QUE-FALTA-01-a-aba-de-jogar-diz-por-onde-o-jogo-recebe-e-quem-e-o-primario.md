---
sprint: JOGAR-O-QUE-FALTA-01
estado: aberta
decisoes: [D-0609-PRIORIDADE-TODAS-AS-ABAS, D-0609-EXTERNOS-FORA, 10-Q6]
posse:
  01E:
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/interface/jogar_vivo.py
    - mockup/01-jogar.html
    - tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py
depois_de: [ONDA5-07-03, PERFIL-MODO-01, ONDA5-01-01, ONDA5-01-02, ONDA5-01-03, ONDA4-S10-O-TRANSPORTE-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/paginas/01-jogar.html
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/jogar/
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/daemon/
  - docs/data/paridade-gtk-html.csv
---

# JOGAR-O-QUE-FALTA-01 · PARIDADE — por onde o jogo recebe, quem é o primário, e o que a aba faz com o serviço desligado

> **A decisão dela, 06/09/2026**: todas as abas; **controles externos ficam
> FORA** (`EXTERNOS-01`, depois da bancada dos quatro); e o foco é **quatro
> DualSense, por cabo ou por rádio**.
>
> **A `ONDA5-01-03` está dobrada nesta sprint** — o cadeado já está na tela, e
> o que falta dela é o verde.

A aba 01 tem **14 linhas `FALTA_NO_HTML`** — a maior lista depois da 02.
**Cinco são suas** (§2); as outras nove estão na §3, e três delas ela tirou de
cena.

---

## 1. O QUE SE MEDIU — cinco linhas, e o padrão que as une

| linha do CSV | o dado que existe e ninguém lê | dono no motor |
| --- | --- | --- |
| **O modo/máscara clicados entram na seção `mode` do perfil ativo** | `_ESCOLHA`/`_ROTULO` são dicionários **de módulo**, lidos só dentro do próprio arquivo | `home_actions.py:1763` |
| **A linha "Ponte com o jogo"** — por onde o jogo está recebendo | **nenhum campo de ponte na 01** | `home_actions.py:1121` |
| **O marcador "primário"** | `is_primary` **não é lido** em `interface/pacotes/`; a classe `.cartao.alvo` existe e responde a **outra** pergunta (o alvo de edição da fita) | `home_actions.py:1427` |
| **Banner de degradação do vpad** | o `backend` não é lido pelo pacote da 01 — e **`pacotes.degradacao_de` já existe** (`pacotes/__init__.py:832`) | `home_actions.py:613` |
| **O que a aba faz com o serviço DESLIGADO** | o tique imprime `[daemon mudo] …` no **stderr do processo** e retorna sem pintar nada — **a tela fica com os últimos valores** | `home_actions.py:2469` |

**O padrão é um só, e é o que torna esta sprint barata e perigosa ao mesmo
tempo:** em quatro das cinco, **o dado já chega** e ninguém o lê. Não há IPC
novo. O risco não é construir demais — é **redigitar** o que o motor já sabe.

**A QUINTA É DIFERENTE, e é a mais importante para quem joga:** com o serviço
desligado a tela **mente por omissão**. Ela mostra os últimos valores como se
fossem de agora. Quem olhar vai concluir que os controles estão ligados.

---

## 2. O TRABALHO, EM CINCO PASSOS

### Passo 1 — a escolha entra no perfil ativo

O modo e a máscara clicados na 01 entram na seção `mode` do perfil ativo — **a
mesma seção** que a `PERFIL-MODO-01` constrói na aba 10, e que fecha antes de
você. **Um dono, duas telas.** Se você criar um segundo caminho de gravação, o
que ela escolher numa aba some quando ela mexer na outra.

**A MORDIDA:** clique o modo na 01 e leia o valor na 10 — e vice-versa.
Arranque a gravação e as duas discordam; é isso que a régua tem de pegar.

### Passo 2 — a linha "Ponte com o jogo"

Por onde o jogo está recebendo o controle, lido de `home_actions.py:1121`. É a
frase que responde *"por que o jogo não vê meu controle"* sem abrir terminal.

**A palavra vem do glossário.** `uinput`, `hidraw`, `vpad` e `evdev` são
**proibidos em texto de tela**.

**A MORDIDA:** três dublês, três pontes, três frases; nenhuma com palavra
proibida — e há régua da casa que reprova a palavra (`frases_que_ela_baniu.py`).

### Passo 3 — o marcador "primário"

`is_primary`, do motor. **Cuidado com a classe `.cartao.alvo`**: ela já existe
e significa **outra coisa** (o alvo de edição da fita). Reusá-la faz os dois
significados brigarem no mesmo pixel, e o defeito aparece só quando ela editar
a fita com outro controle primário — tarde.

**A MORDIDA:** dois controles, um primário; troque o primário no dublê e veja o
marcador andar. Prove que o alvo de edição da fita **não** se moveu junto.

### Passo 4 — o banner de degradação do vpad

`pacotes.degradacao_de` **já existe** (`pacotes/__init__.py:832`). Use-o.

**Duas condições**, como no cartão da 02: backend degradado **E** motivo. Uma
só acende alarme sobre nada, e **alarme sem medição é proibido**.

**A MORDIDA:** com motivo vazio o banner **some**.

### Passo 5 — a aba com o serviço desligado (e é o passo que mais vale)

Hoje: `[daemon mudo]` no stderr, e a tela **congelada nos últimos valores**.

A cura é a aba **dizer** que não está falando com o serviço, e **parar de
afirmar** o que não pode afirmar. As duas metades importam: só dizer, deixando
os números velhos na tela, ainda é mentira; só apagar, sem dizer, parece
defeito.

**E o recado vai pelo canal que já existe** — o da `ONDA5-P-01`, terceiro lugar
do recado. Não invente um segundo.

**A MORDIDA:** derrube o serviço no dublê e prove as duas metades: a frase
aparece **e** os valores param de ser afirmados. Devolva o serviço e a aba
volta sozinha, sem clique.

---

## 3. O QUE ESTA SPRINT NÃO CONSTRÓI — e por decisão de quem

* **Os cards dos controles EXTERNOS** (Nintendo Pro, 8BitDo): **fora, decisão
  dela de 06/09** — é a `EXTERNOS-01`, depois da bancada dos quatro.
* **O custo da máscara Xbox dito ANTES do clique**: **fora, decisão dela
  (10-Q6)** — *a máscara não custa feature*; o Hefesto constrói o mecanismo,
  não descreve a limitação.
* **A frase da PAUSA, o aviso do mouse/teclado desligado em Navegação, o aviso
  de grab dobrado, o recibo do "Reconectar" e a dica do "Reconectar" com jogo
  aberto**: são cinco linhas de **recado**, e o canal é da `ONDA5-P-01`. Se ele
  estiver no lugar quando você chegar, **elas cabem aqui** — e aí faça-as, uma
  a uma, com a frase vinda do dono. Se não estiver, **RELATE as cinco** com o
  endereço do dado que ninguém lê.
* **O aviso de divergência de máscara** e **a linha de origem
  ("Nativo/Gamepad ligado pelo perfil ativo")**: mesma regra do item acima.
* **O CSV da paridade**: é da `PARIDADE-REMEDIR-01`.

## 4. NADA SE PERDEU

* **O que a `ONDA5-01-01` e a `ONDA5-01-02` entregaram** — a cura do
  travamento do USB na coluna Atenção (com o selo `CONTROLE`, revisto por ela
  na publicação), e a profecia que um teste prendeu na janela antiga.
* **A `ONDA5-01-03` está dobrada aqui**: o cadeado já está na tela; o que falta
  é **a piscada verde** — e ela é o `hef-deu-certo` de ~1,5 s do glossário §3,
  não uma palavra nova.
* **A coluna Atenção só mostra o que pede ação** (glossário §3). Boa notícia
  **não** é Atenção — nenhuma das cinco linhas novas vira item de Atenção sem
  passar por essa régua.
* **A palavra da tela vem do glossário.** **"mesa" não entra.**

## A PROVA DE TELA — obrigatória

1. **A FOTO** antes e depois, `--oculta`, com **dois controles**.
2. **O CLIQUE**: o modo clicado chegando ao perfil; o primário andando; o
   serviço caindo e a aba dizendo.
3. **A MORDIDA** colada, uma por passo.
4. **NO TEMPO**: a régua de mutações da `A-TELA-SAMBA-01`. A 01 é a aba que ela
   deixa aberta — **é a que mais sofre com repintura**.
