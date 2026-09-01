---
sprint: ONDA-JOGAR-03
posse:
  J3:
    - src/hefesto_dualsense4unix/integrations/ponte_escada.py
cria:
  - tests/unit/test_a_escada_tem_cinco_degraus.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/integrations/ponte_tentativa.py
  - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
  - src/hefesto_dualsense4unix/app/
---

# ONDA JOGAR · 03 — o quinto degrau da roda

**Onda:** JOGAR (aba 1). **Backend puro. Não depende de nenhuma outra e
desbloqueia a ONDA-JOGAR-04.**

## O defeito, em uma frase

A roda do `PS + R3` tem **quatro** degraus e o mockup desenha **cinco** — falta
o último recurso, o Teclado + Mouse, que já existe no código como
`KIND_DESKTOP` e ficou de fora da escada.

## O que existe hoje

`integrations/ponte_escada.py:253` — `ESCADA`, quatro degraus, nesta ordem:

| # | Degrau | `Ponte` |
|---|---|---|
| 1 | Hefesto como DualSense | `Ponte(KIND_GAMEPAD, MASCARA_DUALSENSE)` |
| 2 | Hefesto como Xbox 360 | `Ponte(KIND_GAMEPAD, MASCARA_XBOX)` |
| 3 | Conexão Nativa (Sony) | `Ponte(KIND_NATIVE)` |
| 4 | DualSense + Steam Input | `Ponte(KIND_GAMEPAD, MASCARA_DUALSENSE, steam_input=True)` |

E `ponte_escada.py:169` já declara `KIND_DESKTOP = "desktop"`, aceito em
`:334` e `:354` — **o termo existe e nunca virou degrau.**

## A decisão que manda (D-O-QUINTO-DEGRAU-DA-RODA)

> *"ENTRA O QUINTO, NO FIM: Teclado+Mouse (o `KIND_DESKTOP`, que já existe no
> código e ficou de fora da escada). É o último recurso — se nenhum modo de
> gamepad serviu, o jogo provavelmente só aceita teclado e mouse. **A ordem
> existente não muda**."*

E o mockup desenha exatamente isso:

```
[A] Automático  [1] Hefesto  [2] Sony (nativo)  [3] Steam Input  [4] Teclado + Mouse
```

## O que esta sprint entrega

1. **Um quinto `Degrau` no FIM da `ESCADA`**, com `ponte=Ponte(KIND_DESKTOP)` e
   o `porque` escrito com o dado: nenhuma das dez linhas `uhid` do
   `mapa-controles.csv` atravessa por aqui, porque não há gamepad nenhum — é o
   degrau que troca o controle por mouse e teclado, e por isso é o último.
2. **Os três flags do `Degrau` decididos com fonte**, não por analogia:
   - `recria_vpad` — o desktop **derruba** o vpad em vez de recriá-lo
     (`schema.py:573`: *"kind='desktop' — declaração explícita de app de
     desktop: desliga gamepad/nativo/co-op vindos de perfil"*);
   - `exige_reabrir_jogo` — **medir antes de escrever.** Se o jogo já está
     aberto e o vpad cai, o jogo perde o controle sem ganhar teclado; se o
     `KIND_DESKTOP` alcança um processo vivo, o degrau é `ao_vivo` e o gesto
     `PS + R3` pode oferecê-lo no meio da partida. **A medição é o entregável**,
     não o palpite;
   - `exige_fechar_steam` — `False`: nada aqui toca `localconfig.vdf`.
3. **Nada mais muda de ordem.** `indice_do_degrau` e `proximo_degrau`
   (`:315`, `:395`) andam sozinhos com a tupla maior.

## Como se prova — o teste que MORDE

`tests/unit/test_a_escada_tem_cinco_degraus.py`

1. **`len(ESCADA) == 5` e o último é `KIND_DESKTOP`.** Trivial, e é a rede.
2. **Os quatro primeiros não se mexeram** — a lista de `Ponte` dos índices 0..3
   comparada campo a campo com a de hoje, escrita literal no teste. Reordene
   qualquer um e reprova: é a trava da frase *"a ordem existente não muda"*.
3. **A mordida de verdade:** `proximo_degrau` a partir do degrau 4 (Steam
   Input) devolve o Teclado + Mouse; e a partir do quinto devolve `None` — a
   roda **termina**, não dá a volta. Arranque o quinto degrau e o primeiro
   caso reprova; faça a roda circular e o segundo reprova.
4. **`ao_vivo` do quinto degrau bate com o que a medição achou** — o teste
   carrega o valor medido, e quem mudar o flag sem refazer a medição reprova.

## O que é dela decidir

1. **O rótulo na tela.** O mockup escreve *"Teclado + Mouse"*; a aba Jogar
   chama o mesmo modo de *"Controlar o PC"* (`_MODE_ITEMS`,
   `home_actions.py:154`). **Dois nomes para o mesmo fato é como esta casa
   ganhou os oito pares.** Ou a escada usa "Controlar o PC", ou os dois mudam
   juntos.
2. Se o `PS + R3` deve **oferecer** o quinto degrau no meio da partida, caso a
   medição diga que ele alcança processo vivo — trocar o controle por teclado
   com o jogo aberto é surpresa grande.

## Fontes

- `/tmp/coleta/decisoes.md:210-211` — D-O-QUINTO-DEGRAU-DA-RODA.
- `layout/01-jogar.html`, a `escada` do quadro *Modo de conexão*.
- `src/hefesto_dualsense4unix/integrations/ponte_escada.py:167-310`.
