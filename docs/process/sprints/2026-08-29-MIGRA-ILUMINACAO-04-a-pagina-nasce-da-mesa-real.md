---
sprint: MIGRA-ILUMINACAO-04
estado: absorvida
onda: MIGRA-ILUMINACAO
posse:
  IL4:
    - src/hefesto_dualsense4unix/interface/aba04.py
    - scripts/telas/aba04.py   # o mesmo arquivo depois da MIGRA-CONTROLES-02
cria:
  - tests/unit/test_migra_iluminacao_04_a_mesa_real.py
bancada: false
depois_de:
  # A FILA INTEIRA que vem antes desta, e ela é longa de propósito: nove das doze
  # abrem `app/actions/lightbar_actions.py` e cinco abrem `src/hefesto_dualsense4unix/interface/aba04.py`.
  # Quem divide arquivo executa EM SÉRIE (R5), e o portão de colisão não faz fecho
  # transitivo — por isso a fila se escreve inteira, como na ONDA-SISTEMA-02.
  - MIGRA-ILUMINACAO-01
  - MIGRA-ILUMINACAO-03
  - MIGRA-ILUMINACAO-11
  - MIGRA-ILUMINACAO-02
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 04). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA ILUMINAÇÃO · 04 — A página nasce da mesa real

**Palavra dela, 29/08:** *"o layout se adapta a medida dos controles que eu tenho
(…) e se eu comprar outros dualsense eles aparecem também seguindo a lógica que
montamos no `mapa-do-controle.html`."*

## O defeito

**Ela tem dois controles. A página desenha quatro.**

`MESA`, em `src/hefesto_dualsense4unix/interface/monta.py:138-147`, é uma lista **literal de
quatro**. Dela saem:

- as quatro colunas (`aba04.py:426`, o laço `coluna(c) for c in MESA`);
- a grade, com `repeat(4,1fr)` **cravado** (`aba04.py:93`);
- os números que a fileira oferece (`NUMEROS`, `aba04.py:57`);
- o mapa dono → número, que pinta o anelzinho de cada botão (`DONO`,
  `aba04.py:47`);
- a contagem do cabeçalho (`monta.py:539-545`);
- e o exemplo da troca da legenda (`TEM_O_1` / `QUER_O_1`, `aba04.py:70-71`).

O gerador **já deriva tudo da MESA** — nada aqui está escrito com o nome de um
controle, e isso é mérito de quem o escreveu. **O que falta é a MESA vir de
fora.**

## O que entrega

1. **A mesa deixa de ser literal.** A página nasce de um **molde de coluna** que
   o produto clona por controle presente — a lista é `_uniqs_conectados()`
   (`app/actions/lightbar_actions.py:378`), que sai do `_target_uniq_by_index`
   que a aba Status recalcula do `state_full` a cada tique.
   **Duas rotas servem** — o gerador emitir N colunas a partir de uma mesa
   passada por parâmetro, ou a página trazer um molde que o JS clona. **Quem
   executar escolhe; a mordida é a mesma nas duas.**
2. **`repeat(4,1fr)` vira `repeat(var(--n),1fr)`**, e o `--n` é escrito por quem
   sabe quantos são.
3. **Zero controles é estado legítimo, e tem desenho.** Nem coluna vazia, nem
   quatro fantasmas: uma frase que diz **o quê, por quê e o que fazer** — a aba
   Conexões é onde se liga um. `_uniqs_conectados()` devolver lista vazia
   significa *"a janela ainda não sabe quem está na mesa"*, e os chamadores de
   hoje já tratam isso como escopo desconhecido, nunca como broadcast
   disfarçado.
4. **A fileira de números segue a mesa.** Ela oferece os **ocupados**, que é
   consequência da decisão dela (troca só existe entre dois que existem) e bate
   exatamente com o portão do daemon: `numero > len(presentes)` →
   `numero_fora_da_mesa` (`daemon/ipc_handlers.py:1808`).
5. **O orçamento de altura é por LINHA, e não pode estourar.** As sete alturas
   somam 146+16+44+26+62+34+72 = 400, mais seis passos de 8 = 448, e o miolo dá
   452 (`aba04.py:88-99`). **Mudar N muda a LARGURA, não a altura** — e o
   gerador tem de provar isso, não supor. Quadro que rola por dentro é conteúdo
   que ninguém sabe que existe.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_04_a_mesa_real.py`:

- **N controles, N colunas.** Rode com mesas de 1, 2, 3, 5 e 8 e conte
  `[data-uniq]` no DOM. **Volte a `MESA` literal de quatro e veja reprovar em
  todas menos numa** — a que tem quatro, que é a que engana. Essa é a razão de o
  teste ter cinco mesas e não uma.
- **zero controles não é erro.** Com a mesa vazia: nenhuma coluna, a frase na
  tela, **nenhum toast de recusa e nenhuma exceção**. Uma aba que levanta com a
  mesa vazia é a aba que ela vê quando desliga os dois controles para carregar.
- **a largura não estoura.** Com 5 e com 8, no `WebView`:
  `document.documentElement.scrollWidth <= clientWidth`. **Meça SEM
  `scrollIntoViewIfNeeded`** — ele rola antes de medir e cega toda medição de
  layout feita depois (27/08).
- **a altura não estoura.** A soma das sete linhas continua ≤ 452 px com
  qualquer N. Aumente uma linha sem tirar de outra e veja reprovar.
- **os números da fileira são os ocupados.** Com uma mesa de 2, a fileira tem 2
  botões — e o daemon recusaria o 3 de qualquer jeito
  (`ipc_handlers.py:1808`). Ofereça 1..4 fixo e veja reprovar.
- **a régua LÊ a mesa, não a digita.** Os `uniq` esperados saem da mesma fonte
  que a página usou. Digitar quatro MACs no teste é a forma das onze réguas que
  em 26/08 reprovaram a melhora em vez do defeito.

## O que é dela decidir

- **Com UM controle só, a coluna ocupa a largura inteira, ou fica com 208 px e o
  resto vazio?** O mockup nunca desenhou esse estado, e ele é o estado dela
  quando um dos dois está carregando.
- **Acima de quantos a grade quebra em duas fileiras?** A mesa dela é 2; o
  produto cobre 8 (`core/led_control.py:105-114`). Oito colunas de 208 px não
  cabem em 1180.
- **O exemplo da troca da legenda com dois controles.** Ele é derivado
  (`TEM_O_1`/`QUER_O_1`) e continua funcionando, mas com dois na mesa o "antes e
  depois" fica com duas linhas de dois — e nesse tamanho **rodízio e troca dão o
  mesmo resultado**, que é justamente o que escondeu a divergência da
  `MIGRA-ILUMINACAO-11`.
