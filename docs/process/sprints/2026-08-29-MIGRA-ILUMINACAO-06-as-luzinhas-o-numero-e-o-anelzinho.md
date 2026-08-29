---
sprint: MIGRA-ILUMINACAO-06
onda: MIGRA-ILUMINACAO
posse:
  IL6:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_migra_iluminacao_06_as_luzinhas_e_o_numero.py
bancada: false
depois_de:
  - LEVA-1
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - ONDA-ILUMINACAO-07
  - ONDA-ILUMINACAO-08
  - ONDA-ILUMINACAO-09
  # A FILA INTEIRA que vem antes desta, e ela é longa de propósito: nove das doze
  # abrem `app/actions/lightbar_actions.py` e cinco abrem `_ferramentas/aba04.py`.
  # Quem divide arquivo executa EM SÉRIE (R5), e o portão de colisão não faz fecho
  # transitivo — por isso a fila se escreve inteira, como na ONDA-SISTEMA-02.
  - MIGRA-ILUMINACAO-01
  - MIGRA-ILUMINACAO-03
  - MIGRA-ILUMINACAO-11
  - MIGRA-ILUMINACAO-02
  - MIGRA-ILUMINACAO-04
  - MIGRA-ILUMINACAO-05
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA ILUMINAÇÃO · 06 — As luzinhas, o número e o anelzinho

## O defeito

Quatro valores por coluna que **o Python não pinta em lugar nenhum hoje**:

1. **o desenho das cinco lâmpadas** no SVG daquela coluna;
2. **o `P{n}`** do rótulo (`aba04.py:310`);
3. **qual botão de número fica `on`** (`aba04.py:293`);
4. **o anelzinho de cada botão** — a cor do plástico de **quem tem aquele número
   hoje** (`DONO`, `aba04.py:47`; o anel, `aba04.py:283-284`). É ele que faz o
   botão dizer **com quem** a troca acontece.

O resolvido existe, mas escreve num rótulo de TEXTO: `texto_do_desenho_aceso`
(`app/actions/lightbar_actions.py:303`), chamado por
`_atualizar_estado_das_luzes` (`:718`), que escreve em `player_leds_estado` — um
`GtkLabel` que a `MIGRA-ILUMINACAO-02` apaga.

O padrão canônico já é do produto e o gerador já o importa: `PADRAO_JOGADOR` em
`monta.py:64-67` deriva de `core/led_control.py:122 player_led_pattern`.
**Nenhum padrão é digitado no desenho** — e isso foi caro: a tabela era digitada
e o jogador 3 estava escrito `"234"` até 27/08, quando o canônico é `135` (as
duas pontas e o centro).

## O que entrega

1. **As cinco lâmpadas de cada coluna acendem pelo `player_leds` efetivo do
   `uniq` daquela coluna**, pela classe `led-on` no
   `id="{pref}-led-jogador-{n}"` — **o mesmo caminho que o gerador usa**
   (`monta.py:463-479`), agora feito por JS em vez de por texto.
2. **O `P{n}` do `.ctrl-rot`** sai de `state_full.controllers[].player_slot`
   (`daemon/ipc_handlers.py:3290`), que a aba Status já mantém.
3. **Qual botão fica `on` e o anelzinho de cada um** saem do **mesmo** mapa
   dono → número. Um laço, uma fonte.
4. **O co-op manda, e a coluna diz isso.** Com `_coop_ligado` (mantido pela
   Status, consumido em `:718`), quem decide as luzinhas é o jogo, não a escolha
   dela. A frase já existe e tem dono: `coop_manda_nas_luzes`
   (`app/textos_de_aplicacao.py`). **Não a reescreva.**

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_06_as_luzinhas_e_o_numero.py`:

- **o padrão é o do produto, e o teste NÃO o digita.** Com o número 3, as
  lâmpadas acesas são as de `player_led_pattern(3)` — o teste chama a função.
  Escreva `"135"` no teste e ele deixa de morder no dia em que o produto mudar,
  que é o defeito que a tabela do `monta.py` já cometeu uma vez.
- **acender é acender a âncora que existe.** Arranque a âncora
  `id="{pref}-led-jogador-{n}"` (renomeie-a) e veja o teste reprovar.
  **Uma troca de texto que não casa devolve o texto intacto e não avisa** — foi
  assim que `svg(jogador=N)` nunca acendeu uma lâmpada em aba nenhuma, em TODAS
  as abas, até 27/08. Cinco agentes acharam o mesmo defeito no mesmo dia.
- **a classe FUNDE, não duplica.** A lâmpada nasce com `class="peca"`; um
  SEGUNDO atributo `class` faz o navegador ignorar o segundo, **sem erro e sem
  aviso**. O teste lê o `classList` do motor, não o HTML. (A primeira versão
  dessa cura, em 27/08, trocou um defeito silencioso por outro exatamente
  assim.)
- **quatro colunas, quatro padrões.** Uma mesa com os números 1, 2, 3 e 4 acende
  1, 2, 3 e 4 lâmpadas — e nos padrões certos, não em quantidades certas.
- **o anelzinho segue o dono.** Troque quem tem o número 2 e o anel do botão 2
  muda de plástico **em todas as colunas**, não só na do controle que mudou.
- **as luzinhas são INTENÇÃO, nunca estado.** `luz.led_jogador.leitura` no
  `docs/data/mapa-controles.csv` é `parcial` nos dois transportes, e a célula é
  literal: *"a leitura NÃO ENXERGA LÂMPADA NENHUMA — uma escrita que falhou com
  -110 continua sendo lida como acesa"*; *"Não existe report de entrada nem
  feature que devolva o padrão que o FIRMWARE está exibindo"*. E
  `luz.led_jogador.escrita_hefesto` é `radio_aciona = parcial`: *"Sem nó de
  sysfs gravável, o rádio fica SEM escrita de LED de jogador"*.
  **O teste exige que nenhuma frase da coluna afirme estado.**

## O que é dela decidir

**O `title` da moldura.** O mockup diz, palavra por palavra (`aba04.py:307`):

> *"O {nome} **agora**: a barra na cor do Player {j}, e as cinco lâmpadas no
> padrão dele."*

**"agora" é afirmação de estado, e o produto não tem como sustentá-la** — nem
para a barra (que por rádio aceita e ignora) nem para as lâmpadas (que não têm
leitura). A frase honesta é sobre o que o Hefesto **pediu**.

Trocá-la é mudar texto que ela aprovou, e por isso é dela. **E a mesma decisão
vale para o `title` do bloco "Disposição de LEDs"** (`aba04.py:326`), que diz *"O
{nome} aceso"*.
