---
sprint: NADA-MOCKADO-01
estado: feita
posse:
  NADA-MOCKADO-01:
    - tests/unit
    - scripts
bancada: false
depois_de: []
---

# A varredura do que é de verdade

## A palavra dela, e ela é uma PERGUNTA que vira portão

> *"acelerômetro, giroscópio, máscara nintendo e modo (tanto o switch ps + R3)
> quanto o funcionamento mútuo delas estão funcionando? e serão reconhecidos in
> game? Tipo todas as features aqui. **não tem nada rodando em sandbox ou
> mockada, certo?**"*

**Esta pergunta não se responde com uma resposta — ela se responde com um
PORTÃO**, senão a resposta envelhece no dia seguinte. É a mesma forma do
`casa-sabe`, que responde *"o produto FAZ o que a casa diz?"*.

## Por que esta casa não pode responder de cabeça

Está escrito, e é a cicatriz de 03/09: **quatro instrumentos davam verde sobre
nada**. E em 04/09: *"a máscara que NUNCA gravou um byte — o dicionário ia como
`timeout` posicional, e o dublê do teste era mais frouxo que a ponte real"*.

**A máscara Nintendo está nesta lista de cicatrizes.** Ela é uma das sete linhas
da conferência dela justamente por isso, e hoje passa — mas a conferência mede
que `FLAVORS["nintendo"]` anuncia `0x057E:0x2009`, **não** que um jogo a
reconhece.

## O que fazer, e a ordem é a do custo

1. **O INVENTÁRIO**: liste TODA feature que a tela oferece e, para cada uma,
   diga onde ela é provada — régua de árvore (lê o código), régua de dublê
   (exercita com um falso), ou **APARELHO** (toca o hardware). O
   `docs/data/mapa-controles.csv` já tem a coluna `provado_por`: 77 linhas
   respondidas, e **`aparelho` em 44**. Comece por ali, não do zero.
2. **A COLUNA QUE FALTA é "reconhecido no jogo"** — e ela é diferente de "chega
   ao aparelho". Um giroscópio que o daemon publica e que o SDL não expõe não
   está entregue. O caminho é o `vpad`: o que o JOGO lê é o nó uinput/uhid, não
   o DualSense.
3. **O PORTÃO**: toda feature com selo forte na tela tem de ter prova de
   APARELHO ou uma ressalva declarada. Sem isso o selo é desenho fingindo ser
   produto.

## O que MORDE

* uma feature nova com selo forte e sem prova de aparelho → reprova nomeando
  ela;
* uma prova que usa dublê mais frouxo que o real → reprova (é a cicatriz de
  04/09, e o `test_a_ponte_real_e_o_duble_concordam` é o molde);
* a lista de features é LIDA da tela, nunca digitada no teste — senão ela
  envelhece no dia em que nascer a próxima.

## O que já se sabe HOJE, e não é pouco

* **giroscópio e acelerômetro**: os quatro publicam, medido no `state_full` de
  08/09 (`sensores` presente nos quatro, inclusive nos do rádio) — e em 04/09 a
  cura alcançou o não-primário, que era metade da mesa dela;
* **máscara Nintendo**: `FLAVORS["nintendo"] = 0x057E:0x2009`, conferido pela
  régua dela;
* **modo (PS + R3)**: o gesto PS+R3 gira a PONTE (`hotkey.py:633`,
  `FEAT-HOTKEY-PONTE-CYCLE-01`: DualSense/uhid → Xbox → Nativo), e o PS longo
  alterna o modo jogo (`:263`) — mas o **funcionamento mútuo** que ela pergunta
  (uma feature ligada quebrando outra) é exatamente o que nenhuma régua cobre
  hoje. A tabela abaixo é o começo dele.

## A comunhão: máscara × modo × transporte — o que o mapa e o código já dizem

É a pergunta dela (*"o funcionamento mútuo delas"*), respondida com o que está
MEDIDO ou escrito no dono. Onde diz «inferido», ninguém pôs o aparelho na mesa.

| | Jogar pelo Hefesto (`gamepad`) · **DualSense** (`uhid`) | Jogar pelo Hefesto · **Xbox 360** / **Nintendo Pro** (`uinput`) | Conexão Nativa (`native`) | Controlar o PC (`desktop`) |
| --- | --- | --- | --- | --- |
| botões, sticks, gatilhos analógicos | sim | sim | sim (o jogo lê o físico) | vira mouse/teclado |
| giroscópio / acelerômetro | até o vpad: medido 16/08 (rádio) e 19/08 (cabo); **até o jogo: nunca** — e o SDL abriu o vpad por evdev em 04/09 | **não há onde pôr** (pacote fixo do Xbox; o `uhid` só nasce para `dualsense`) | sim, por HIDAPI, medido 04/09 | não |
| touchpad | até o vpad: medido 16/08; **no jogo, no rádio: não responde** (16/08, sem causa) | não há onde pôr | sim | vira cursor |
| vibração (FF do jogo) | sim, pela conta de `_mults_por_motor` | sim, por evdev — *"rumble por evdev que funciona em tudo"* | o jogo escreve direto; o degrau da casa não vale | — |
| gatilho adaptativo do jogo | `vibracao.rumble.passthrough` / `gatilho.adaptativo`: medido no cabo e no rádio | não há onde pôr | sim | — |
| barra de luz do jogo | `luz.replica_output_jogo`: cabo sim, rádio `parcial` | não | sim | — |
| **cabo × rádio** | o transporte foi INOCENTADO no giroscópio (15/08) e na cor (12/08); as assimetrias vivas são as do mapa: `audio.alto_falante` rádio (dívida), `audio.microfone` rádio (só com a ponte), `release_leds` só rádio | idem | idem | idem |

A linha que decide se «funciona de fato» é a segunda, e ela é a
[SENSORES-NO-JOGO-01](2026-09-08-SENSORES-NO-JOGO-01-o-giroscopio-e-o-acelerometro-provados-ate-o-jogo.md).
As células de máscara Xbox/Nintendo não são dívida: são o aparelho que a
máscara imita — e vão para o mapa como DECISÃO, porque a tela não confessa.

## O mapa NÃO é lido pelo produto — medido em 08/09/2026

Ela mandou conferir *"se o mapa do specs .csv tá sendo lido de fato"*. Está — por
**réguas e scripts**, e por NENHUMA linha do produto em execução:

| leitor | quem chama |
| --- | --- |
| `interface/pacotes/mapa.py` — `canal()`, `da_familia()`, `confere()`, `sem_dono()`, escrito em 01/09 para *"o valor da tela CITAR a linha"* | **zero chamadores** em `src/`, `tests/` e `scripts/` |
| `app/fatos_do_mapa.py` — GERADO do CSV, `FATOS[id]` | **zero importadores** fora da própria docstring |
| `scripts/check_paridade_transporte.py`, `gerar-mapa.py`, `mesa_de_medicao.py`, `bancada.py` e ~100 arquivos de teste | é aqui que o CSV é lido |

Então a promessa de `mapa.py` — *"todo valor que a tela AFIRMA tem de ter linha
aqui, ou dizer que não tem dono"* — não acontece em tempo de execução: a
conferência é feita pelas réguas, uma vez, e a tela não pergunta ao mapa. O
inventário do item 1 tem de saber disso: **um selo forte na tela hoje não foi
conferido contra o mapa por ninguém no produto** — foi conferido por um teste,
se houver teste. Decidir se `mapa.py` passa a ser chamado ou sai é da
[TUDO-FUNCIONA-01](2026-09-08-TUDO-FUNCIONA-01-o-que-falta-para-nada-ser-de-brinquedo.md).

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo / BT / perfil / controle | o inventário do item 1 usa as QUATRO colunas da [CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md) — a tabela lida do mapa e do esquema, nunca digitada. Uma feature com selo forte na tela e uma coluna em ✗ ou `nao-medido` é o que este portão reprova |


---

## O PORTÃO NASCEU — 09/09/2026

`tests/unit/test_portao_nada_e_afirmado_sem_prova.py`, declarado em
`scripts/portoes.sh` (camada **rápida** — lê um CSV, custa milissegundos) e no
`ci.yml`. São **52 portões** agora.

**A pergunta dela não se responde com uma resposta — ela se responde com um
portão**, senão a resposta envelhece no dia seguinte.

### O inventário, medido nas 311 linhas do mapa

```
afirmações fortes (aciona = sim)         208
sem `provado_por`                        104
  dessas, COM ressalva declarada          68
  dessas, sem prova E sem ressalva        36   <- a dívida travada
```

Das 104 sem prova, **81 dizem `de_onde_sei = inferido-do-codigo`**: o mapa
afirma que o aparelho aciona porque alguém LEU o código. *Ler o código e tocar
o aparelho são coisas diferentes, e esta casa tem quatro cicatrizes provando
isso.*

### O que o portão faz, e por que é teto e não exigência

Exigir prova de aparelho nas 104 hoje pararia a casa — e o item 1 desta sprint
diz o contrário: *"comece por ali, não do zero"*. O portão **trava a dívida
onde ela está**: uma linha NOVA que afirme forte tem de trazer `provado_por` ou
ressalva, e os números só descem. É o mesmo desenho das listas de isenção
declarada dos outros portões.

**E o teto não pode sobrar:** há uma régua que reprova se a dívida cair e
ninguém baixar a constante. *Régua com folga acumulada dá verde sobre o defeito
seguinte* — é a cicatriz de 03/09.

### Um achado ao escrever o portão, e um erro meu

**Vinte linhas dizem `de_onde_sei = medido` e deixam `provado_por` em branco**
— o mapa discordando de si: as duas colunas respondem perguntas diferentes
(*"de onde eu sei?"* e *"quem provou?"*), mas `medido` só pode vir de um dos
quatro jeitos que `provado_por` lista. Ganhou teto próprio.

**O erro:** na primeira volta contei **seis**, que é o subconjunto sem
ressalva. As outras catorze têm ressalva e continuam sem dizer quem provou —
uma ressalva não responde *"quem mediu?"*. *Contar o subconjunto e chamá-lo do
conjunto é a mesma família do número que envelhece calado.*

### A mordida

Uma linha nova no mapa com `cabo_aciona=sim`, sem `provado_por` e sem
`cabo_ressalva`, reprova **três** das quatro réguas.

### O que fica

Os itens 1 e 3 estão feitos — o inventário existe (é o próprio mapa, com a
coluna que já havia) e o portão o guarda. **O item 2, "reconhecido no jogo",
continua sendo a [SENSORES-NO-JOGO-01](2026-09-08-SENSORES-NO-JOGO-01-o-giroscopio-e-o-acelerometro-provados-ate-o-jogo.md)** — e ela é de bancada: precisa de um jogo
e da mão dela.
