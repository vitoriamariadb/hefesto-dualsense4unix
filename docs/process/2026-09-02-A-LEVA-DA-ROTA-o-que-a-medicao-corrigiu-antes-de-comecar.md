# A leva da rota — o que a medição corrigiu ANTES de começar

**02/09/2026, madrugada.** Este documento existe porque a regra desta casa é
*fila combinada vira arquivo no mesmo dia* — e porque, ao conferir o plano antes
de despachá-lo, **três afirmações caíram**. Duas delas estavam no enunciado do
próprio trabalho.

---

## 1. O "36%" ESTAVA SUBESTIMADO — o número é 61%, e faltam 40 campos, não 66

A régua do plano conta, para cada `data-campo` do HTML publicado, se o nome do
campo aparece no `aNN_*.py` daquela aba. **Ela não conta o DONO COMPARTILHADO.**

`interface/pacotes/__init__.py:topo()` pinta `conta`, `conta-b` e `perfil` nas
DEZ abas — e o comentário em `a01_jogar.py:67` diz isso com todas as letras:

> *"`perfil`, `conta` e `conta-b` NÃO saem daqui: são do cabeçalho, que é das dez
> abas, e o dono deles é `pacotes.topo()`."*

Medido na ponta de `dev` (2b219284):

```
   só o pacote da aba : 37/103 = 36%   <- o número do plano
 + o dono compartilhado: 63/103 = 61%   <- o número REAL
   ainda faltam        : 40 campos      <- não 66
```

**E a distribuição muda a fila, não só o total:**

| aba | campos | pelo pacote | pelo comum | **faltam** |
| --- | --- | --- | --- | --- |
| `03-gatilhos` | 25 | 1 | 2 | **22** |
| `09-sistema` | 10 | 2 | 2 | **6** |
| `05-vibracao` | 9 | 2 | 3 | **4** |
| `04-iluminacao` | 12 | 6 | 2 | **4** |
| `01-jogar` | 11 | 6 | 3 | **2** |
| `02-controles` | 12 | 7 | 3 | **2** |
| `06-navegacao` | 7 | 4 | 3 | **0** |
| `07-lancadores` | 3 | 0 | 3 | **0** |
| `08-conexoes` | 11 | 8 | 3 | **0** |
| `10-perfis` | 3 | 1 | 2 | **0** |

**Quatro das dez abas não têm campo faltando.** O `SPRINT_ORDER` as listava com
3, 3, 3 e 2 campos de trabalho — e o trabalho delas é OUTRO: gestos, não campos.
A fase 1 não é "escrever 66 campos"; é 40 campos, e **mais da metade deles numa
aba só**.

## 2. E MESMO ESSA RÉGUA AINDA É PRESENÇA DE STRING

É prima do erro que produziu o 77% falso. O passeio real (`--passear`, 03:26 de
02/09, janela oculta, dois controles na mesa) mostra a distância:

```
aba                    pinturas  valores   campos que o HTML tem
01-jogar.html                 2        9   11
02-controles.html             1       13   12
03-gatilhos.html              1        8   25
04-iluminacao.html            1        9   12
05-vibracao.html              1       13    9
06-navegacao.html             1        3    7   <- MENCIONA 7, PINTA 3
08-conexoes.html              1       17   11
09-sistema.html               1        5   10
10-perfis.html                1       74    3
07-lancadores.html      não foi visitada — não tem pacote
```

`06-navegacao` está em 100% pela régua de string e em 43% pela pintura. **Essa
aba virou uma frente própria desta leva, com o enunciado de descobrir POR QUÊ** —
é o melhor lugar da casa para isolar o defeito, porque ali ele está sozinho.

**A conclusão que fica, e é a terceira vez que esta casa a escreve:** a única
régua honesta compara o que está NA TELA com o que está no HTML cravado. Ela não
existia; construí-la virou a terceira frente de fundação desta leva.

## 3. O `player` NÃO VOLTA `None` "NO RÁDIO" — volta no NÃO-PRIMÁRIO

O MAPA e a ROTA-C afirmam: *"No cabo coincidem; no rádio o `player` volta `None`
e o `player_slot` continua certo."* Medido às 03:20, com os dois controles dela:

```
uniq 444648000003 · transport bt  · player 1    · player_slot 1 · is_primary TRUE
uniq d42f4b0000d8 · transport usb · player None · player_slot 2 · is_primary false
```

**Quem volta `None` é o não-primário — e aqui ele está no CABO.** O transporte
não é a variável. A correção, com a condição real lida em
`daemon/ipc_handlers.py`, é entrega da frente A+C desta leva, e sai de todos os
lugares onde a afirmação antiga aparece.

Isto não invalida o defeito D2 — ele continua real e a cura é a mesma (ler as
duas chaves, na ordem da GTK). O que muda é **o caso de teste**: uma régua
escrita para "rádio" passaria verde sobre esta mesa.

---

## 4. AS TREZE FRENTES, e por que a divisão é POR ARQUIVO

As oito ondas (A–H) do plano colidiam: A e C escrevem no mesmo
`pacotes/__init__.py`; D mexe em gestos espalhados pelos dez pacotes; H divide o
`hefesto_vivo.py` com o instrumento. Redividido por ARQUIVO, sem colisão:

| # | frente | território exclusivo |
| --- | --- | --- |
| 1 | **B1 — o inventário do motor** | nenhum `.py` de produção; escreve um documento |
| 2 | **A+C — os donos de fato** | `daemon/ipc_handlers.py` · `integrations/cor_do_plastico.py` · `pacotes/__init__.py` |
| 3 | **O instrumento** | `interface/hefesto_vivo.py` · `scripts/abrir_interface.py` |
| 4–13 | **uma por aba** (01…10) | `pacotes/aNN_*.py` · `interface/aba*.py` |

**A onda D foi dissolvida de propósito.** Os dezesseis "aplicado que não aplica"
não são uma coisa só: sete deles são **falso negativo do instrumento** (o clique
automático não passava alvo, e a recusa era o comportamento CORRETO). O conserto
do instrumento é da frente 3; a classificação dos gestos foi para a aba dona de
cada um, que é quem sabe se o daemon ecoa aquilo.

**A prova de clique NÃO é das frentes.** Treze worktrees, um daemon, dois
controles na mesa dela: um `--prova-no-aparelho` de qualquer uma delas mudaria o
aparelho debaixo das outras doze — e já mudou uma vez hoje (a prova da aba Jogar
clicou `modo-xbox` e deixou os dois controles em `uinput`). A prova de clique é
do orquestrador, serializada, depois da integração.

## 5. A ORDEM DE INTEGRAÇÃO

Merge um por vez, com os 30 portões entre cada, na árvore
`hefesto-voo/_integra-rota` (branch `onda/rota-html`) — **a árvore dela não é
tocada**; ela recebe tudo no fim, de uma vez, pelo merge em `dev`.

```
1. B1            (só documento — não conflita com nada)
2. A+C           (cria os donos que as abas vão chamar)
3. o instrumento (a régua com que as outras se medem)
4. as dez abas   (território exclusivo entre si)
5. o microfone   POR ÚLTIMO — ver abaixo
```

**A onda do microfone entra por último, e a razão é medida.** Ela está parada e
salva em `worktree-wf_01bb9c2c-3c4-7` (`d6506b23`, 48 arquivos, +3401/−567),
passou por cinco lentes, o planejador e o executor, e **NÃO passou pela
auditoria**. Ela toca `daemon/ipc_handlers.py` (que a frente A+C está mudando),
`interface/pacotes/a02_controles.py` (que a frente da aba 02 está mudando) e
`profiles/schema.py` (que o commit `11fa3e8b`, posterior à branch dela, mudou).
Integrá-la antes obrigaria as treze frentes a rebasear sobre código não auditado.

## 6. O QUE ESPERA A PALAVRA DELA — nada disto bloqueia a leva

| assunto | a pergunta |
| --- | --- |
| o texto da prioridade em Perfis | *"esse texto em perfis nem faz sentido"* — a frase nova nasce marcada `PROVISÓRIO — decisão dela` |
| publicar HTML novo | o que os campos com endereço não cobrem. Junta-se numa leva de publicação só |
| `novo-hub` | a onda devolveu `viavel: false`, *"a razão não é técnica"* |
| a validação final | palavra dela: *"Ao final eu faria apertando os botões."* É a fase 5, e não bloqueia nada antes dela |
