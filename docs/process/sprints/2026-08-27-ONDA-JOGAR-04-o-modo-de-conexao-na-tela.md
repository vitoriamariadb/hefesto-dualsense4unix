---
sprint: ONDA-JOGAR-04
posse:
  J4:
    - src/hefesto_dualsense4unix/app/actions/jogar/modo_de_conexao.py
cria:
  - tests/unit/test_jogar_modo_de_conexao_na_tela.py
bancada: false
depois_de:
  - ONDA-JOGAR-01
  - ONDA-JOGAR-03
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
  - src/hefesto_dualsense4unix/integrations/ponte_escada.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
---

# ONDA JOGAR · 04 — o Modo de conexão na tela

**Onda:** JOGAR (aba 1).

## O defeito, em uma frase

A escada que decide **por onde o jogo recebe o controle** está construída,
roda sozinha e responde ao `PS + R3` desde 19/08 — e **não tem uma linha de
tela**: quem joga não sabe que ela existe, em que degrau está, nem que pode
escolher.

## O que ela pediu, literal

> *"calma na real misturou duas coisas ali. A primeira ali que temos automático
> não deveria estar aí. Essa parte é só a Máscara Deixa Xbox e Dualsense.
> **Aí ao clicarmos em jogar pelo hefesto não abre apenas a máscara mas abre
> também a seção de Modo de Conexão. Ai Nela o automático, Sony, tudo o que
> combinamos de aparecer no modo ps + r3.**"*

> *"Modo de conexão PS + R3 gira entre eles, no meio da partida ? **isso aqui só
> no tooltip**"*

E, sobre o carimbo que hoje mora na aba Perfis:

> *"◆ este jogo já sabe por onde entra... **Isso sai. Isso tá na aba Jogar.**"*

**Isto DERRUBA a D-A-MASCARA-GANHA-O-AUTOMATICO** (`/tmp/coleta/decisoes.md:213`),
que punha o Automático como terceiro botão de máscara. A máscara fica com dois
botões; o Automático é o topo da escada. O projeto é vivo — precedente é custo
medido, não veto.

## O que existe hoje

| Peça | Onde | Estado |
|---|---|---|
| A escada e a ordem | `integrations/ponte_escada.py:253` | pronta; ganha o quinto degrau na ONDA-JOGAR-03 |
| Quem sobe degrau | `integrations/ponte_tentativa.py` | pronto (lançamento + `PS + R3`) |
| O carimbo publicado pelo daemon | `daemon/ipc_handlers.py:1999` (`pontes_confirmadas`) | publicado desde 19/08 |
| A frase do carimbo | `app/actions/profiles_actions.py:981` (`frase_da_ponte_confirmada`) | função pura, pronta, **e a aba Perfis a mostra hoje** (`:2655`) |
| Tela do Modo de conexão | — | **não existe** |

## O que esta sprint entrega

1. **A sub-seção "Modo de conexão", dentro do quadro *Quando o jogo abrir*, e
   só com `Jogar pelo Hefesto` escolhido** — o mesmo gate que já esconde a
   fileira de máscara (o `opts` de `home_actions.py:2065`).

2. **A escada desenhada, lendo `ponte_escada.ESCADA`** — nunca uma lista
   copiada. Um item `Automático` na frente e um por degrau, numerados 1..5,
   com o rótulo vindo do mesmo vocabulário da fileira de modo (P5: um fato,
   um dono).

3. **O degrau DE PÉ aparece marcado**, do estado vivo do daemon. Sem daemon é
   *"não sei"*, nunca *"nenhum"* — a disciplina que `texto_da_ponte` já
   escreveu (`home_actions.py:1128`) e que sobrevive à morte daquela linha.

4. **O carimbo "Este jogo já sabe por onde entra"** aparece aqui, chamando
   `frase_da_ponte_confirmada` — **sem duplicar a função.** Silêncio quando
   não há carimbo, que é o contrato dela (`profiles_actions.py:983`).

5. **O `?` do quadro carrega o resto**, com o texto do mockup: a ordem tem
   razão medida (dez recursos só chegam pelo primeiro degrau); e o
   `PS + R3` pula para o próximo sem largar o controle.

## Como se prova — o teste que MORDE

`tests/unit/test_jogar_modo_de_conexao_na_tela.py`

1. **A seção só existe sob `Jogar pelo Hefesto`.** Troque para `Controlar o PC`
   e ela some — mas o **espaço reservado fica** (P8, e a régua de altura da
   ONDA-JOGAR-01 continua verde).
2. **A tela desenha um degrau por item de `ESCADA`, na mesma ordem.** O teste
   monkeypatcha `ESCADA` com uma tupla de dois e exige **dois** degraus na
   tela. É a mordida contra a lista copiada: quem escrever os cinco rótulos à
   mão passa no caso ingênuo e reprova neste.
3. **O degrau de pé é o que o daemon diz.** Com o estado dizendo degrau 3, o
   item 3 aparece marcado e nenhum outro; com `state=None`, **nenhum** item
   marcado e o texto de "não sei" — nunca o `Automático` marcado por omissão,
   que seria afirmar o que não se sabe.
4. **O carimbo do `big_walk.json` aparece com as palavras da função pura.** O
   teste compara com `frase_da_ponte_confirmada(...)` chamada diretamente:
   se alguém reescrever a frase aqui, os dois textos divergem e reprova.
   Dois perfis dela já têm carimbo no disco — `big_walk.json` e
   `duskfade.json` — então há dado real, sem fixture inventada.
5. **Sem carimbo, nenhuma linha.** Nada de *"ponte desconhecida"*.

## O que é dela decidir

1. **Clicar num degrau ESCOLHE, ou só mostra?** Esta sprint entrega a
   **leitura**. A escrita — fixar um degrau no perfil — é a ONDA-JOGAR-05,
   e depende de decisão dela.
2. **O rótulo do quinto degrau**, ver ONDA-JOGAR-03.
3. O carimbo sai da aba Perfis (palavra dela: *"Isso sai"*). **A remoção é da
   onda PERFIS** — esta sprint declara `nao_toca: profiles_actions.py` de
   propósito, e as duas não podem fechar sem se falar, ou o mesmo fato fica
   em dois lugares.

## Fontes

- `/tmp/coleta/hoje.md`, falas [30] e [31]; `/tmp/coleta/correcoes.md`, aba Perfis.
- `novo-layout/01-jogar.html`, `.sub-secao` *Modo de conexão*.
- `/tmp/coleta/decisoes.md:210` (D-O-QUINTO-DEGRAU-DA-RODA) e `:213`
  (D-A-MASCARA-GANHA-O-AUTOMATICO — **derrubada pela fala [30]**).
