# ONDA B — o reuso que não aconteceu

**A pergunta dela, 02/09/2026, e ela reordenou o plano inteiro:**

> *"cara a gnt tá recriando os meus codigos do zero ao invés de usar o que eu já <!-- noqa-acento: citação literal dela -->
> havia feito e linkar tudo? Isso tá ocorrendo mesmo?"*
<!-- noqa-acento: citação literal dela -->

**A resposta medida é SIM, em parte — e a medição diz exatamente onde.**

## A CORRELAÇÃO, e ela é o achado desta onda

**A TABELA ABAIXO FOI REMEDIDA PELA B1 EM 02/09/2026, e cinco células estavam
erradas** — a régua velha não contava `profiles/`, que é de onde as abas Perfis
e Gatilhos tiram quase tudo. Os números que valem:

| pacote | linhas | módulos do legado | campos escritos |
| --- | --- | --- | --- |
| `a08_conexoes.py` | 1790 | **11** | **8/11 (73%)** |
| `a10_perfis.py` | 932 | **6** | 1/3 (33%) |
| `a01_jogar.py` | 434 | 3 | 6/11 (55%) |
| `a02_controles.py` | 509 | 3 | 7/12 (58%) |
| `a03_gatilhos.py` | 632 | 3 | **1/25 (4%)** |
| `a06_navegacao.py` | 673 | 3 | 4/7 (57%) |
| `a05_vibracao.py` | 385 | 2 | 2/9 (22%) |
| `a09_sistema.py` | 399 | 2 | 2/10 (20%) |
| `a04_iluminacao.py` | 273 | **1** | 6/12 (50%) |

**A aba que mais REUSA é a que mais FUNCIONA** — no topo, e só no topo. `a08` e
`a10` pintam 100% dos campos que têm. Mas **a correlação NÃO é monótona**:
`a03_gatilhos` alcança três módulos e pinta 1 de 25. **Reuso não é pintura**, e
tratar um pelo outro foi o que produziu as cinco células erradas.

No total: **6.027 linhas nos nove pacotes, 34 módulos do legado alcançados**
(não 24), 20 chamadas de IPC cru. Contra **415 defs públicas** em `app/actions/`
+ `app/widgets/` + `gui/ponte_da_tela.py`, das quais **314 atravessam para
HTML** — e a interface nova chama cerca de treze.

A régua que produz estes números, e o inventário inteiro, estão em
[2026-09-02-ROTA-B1-o-inventario-do-motor.md](2026-09-02-ROTA-B1-o-inventario-do-motor.md).

## O EXEMPLO QUE ESTE DOCUMENTO DEU, e a B1 DERRUBOU

Este texto dizia que `a03_gatilhos.py` reescreve quatro funções do motor. **Três
não são reescrita: já chamam o motor**, e o docstring de uma delas diz "NÃO SE
DIGITA NENHUM NÚMERO". A acusação foi feita por nome, sem ler o corpo.

| o que este documento acusava | o que a função faz, lida no fonte |
| --- | --- |
| `_padroes(nome)` `:330` | chama `trigger_specs.preset_to_positional_params` |
| `_curva(chave)` `:361` | chama `trigger_presets.resolve_feedback_preset` |
| `_pronto_da_curva()` `:96` | compara com `trigger_presets.FEEDBACK_POSITION_PRESETS` |
| `_desfecho(resposta)` `:315` | normaliza a FORMA da resposta da ponte — não é o trabalho de `humanizar_erro_gatilho`, que traduz o TEXTO da recusa |

**O defeito real é o inverso do acusado:** `humanizar_erro_gatilho` existe, foi
testado, e **nenhum pacote o chama** — a recusa do daemon chega crua na tela
dela. É função não alcançada, não segunda verdade.

**A duplicata que EXISTE está noutro lugar**, e tem três grafias:
`core/sysfs_leds.norm_mac` × `pacotes/__init__.py:272 _so_hex` ×
`pacotes/a08_conexoes.py:290 _so_hex`. As três discordam em 3 de 5 entradas
medidas. A prova está na B1.

## ELA FOI PARTIDA EM DUAS — B1 e B2

**Porque como onda única ela colidia com tudo.** Ela mexe nos DEZ pacotes; a
onda F mexe no `a07`, a G no `a10`. Partida, a colisão some e as abas entram na
mesma fase:

| | o que faz | o que toca | quando |
| --- | --- | --- | --- |
| **B1** | o INVENTÁRIO — o que o motor tem, o que a interface duplicou | **NADA. Só lê.** | fase 1, junto com A, F e G |
| **B2** | trocar cópia por chamada | os pacotes que sobraram | fase 2, com a lista da B1 na mão |

**A B1 não conflita com ninguém porque não escreve** — ela produz um documento.
E é o insumo de todas as outras ondas: F e G leem a lista dela para saber o que
ligar em vez de reescrever.

## O TRABALHO — e ele NÃO é reescrever de novo

**A regra desta onda: para cada função dos pacotes, perguntar "isto já existe no
motor?" antes de tocar em qualquer linha.** Os dois grafos respondem em segundos:

```bash
fazer_grafos                      # nesta árvore
# e a estável, que é o GTK funcionando:
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-estavel && fazer_grafos
```

### Passo 1 — o inventário do que existe e não é usado

Para cada um dos 23 módulos de `app/actions/`, os 9 de `app/widgets/` e a
`gui/ponte_da_tela`: listar as funções públicas, e marcar quais a interface nova
já chama. **O resultado é a lista de reuso disponível.**

### Passo 2 — o inventário do que foi reescrito

Para cada função dos dez pacotes, procurar equivalente no motor. Onde houver
duas grafias do mesmo fato, a do MOTOR vence — ela é a que a GTK provou.

### Passo 3 — ligar, não reescrever

Trocar a cópia pela chamada, uma de cada vez, com régua. **Cada troca é um
commit próprio**, para o merge poder recuar uma sem perder as outras.

## O QUE **NÃO** REUSAR, e a razão é medida

Nem tudo do motor serve — e forçar reuso é o erro oposto:

- **O que desenha GTK** (`Gtk.Widget`, `set_label`) não atravessa para HTML.
  Reusar aqui é impossível, não é preguiça.
- **O que fala com a tela GTK** (`ponte_da_tela`) atravessa PARCIALMENTE: a
  parte que decide o QUE mostrar serve; a que mexe em widget não.
- **A divisão certa é: LÓGICA reusa, DESENHO não.** Se a função responde "qual é
  o valor?", reusa. Se ela responde "onde ponho na tela?", é da aba.

## AS RÉGUAS

1. **Nenhuma função de pacote duplica uma do motor.** A régua compara os dois
   lados e reprova a duplicata nomeando as duas.
2. **A frase de erro tem um dono.** `humanizar_erro_gatilho` existe; um
   `_desfecho` paralelo é a segunda verdade.
3. **Os defaults por modo têm um dono.** `trigger_specs`, e mais nenhum.

## COMO SE SABE QUE FECHOU

```
[ ] a lista do passo 1 existe, escrita, com o que é reusável e o que não é
[ ] toda duplicata do passo 2 virou chamada OU ganhou a razão escrita de não ser
[ ] o número de imports do motor SUBIU, e está no relatório
[ ] os campos escritos subiram — medido pelo comando do índice
[ ] a saída do `--prova-no-aparelho` colada, antes e depois
```

## POR QUE A B1 VEM ANTES DE TODAS

Porque consertar a aba Gatilhos **sem** a lista dela significa escrever mais 24
campos à mão, com as mesmas quatro funções duplicadas embaixo. O trabalho
dobraria, e a segunda verdade ficaria.

**E é o princípio dela, dito antes de qualquer medição:** *"minha ideia sempre
foi usar 100% do legado e linkar ele ao html e só depois fazer o resto do
produto."* <!-- noqa-acento: citação literal dela --> O medo estava certo.
