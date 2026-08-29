---
sprint: MIGRA-ILUMINACAO-10
onda: MIGRA-ILUMINACAO
posse:
  IL10:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
    - novo-layout/_ferramentas/aba04.py
    - scripts/telas/aba04.py   # o mesmo arquivo depois da MIGRA-CONTROLES-02
cria:
  - tests/unit/test_migra_iluminacao_10_a_cor_do_plastico_por_coluna.py
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
  - MIGRA-ILUMINACAO-06
  - MIGRA-ILUMINACAO-07
  - MIGRA-ILUMINACAO-08
  - MIGRA-ILUMINACAO-09
  - ONDA-CONEXOES-11
  - ONDA-CONEXOES-12
nao_toca:
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
---

# MIGRA ILUMINAÇÃO · 10 — A cor do plástico chega às colunas, e metade da mesa é rádio

## O defeito

A cor do plástico pinta **três coisas** em cada coluna:

1. **a borda da moldura** — `--plastico`, `aba04.py:307`;
2. **as dez zonas do SVG** — `data-colorway`, uma folha por modelo dentro de
   `assets/control-svg/dualsense.svg` (28 modelos);
3. **o nome do modelo** no rótulo — `aba04.py:310`.

**E ela não chega à aba.** Não está no `state_full`. Quem a lê é a GUI, direto do
cabo, em `app/actions/config/secao_controles.py:916-935` (`_perguntar_as_cores`),
guardada num **dict de instância** — fechou a janela, perdeu.

E é **filtrada por barramento**: `_e_dualsense_no_cabo`
(`integrations/cor_do_plastico.py:369`) exige `_BUS_USB` (`:378`) e reprova o nó
em `:445`.

`docs/data/mapa-controles.csv`, linha `identidade.cor_do_aparelho`:
`cabo_aciona = sim`, `radio_aciona = não`, `o-aparelho-recusa`.

**Essa lápide é FALSA, e a casa já sabe.** Não era o aparelho: era o nosso CRC —
a semente do feature que SAI é `0x53` (`SET_REPORT|FEATURE`), não `0xA3`
(`DATA|FEATURE`), e assinar com a errada devolve `errno 5`. Com a certa, **os
quatro DualSense desta bancada responderam pelo rádio**
(`docs/protocol/dualsense-referencia-canonica.md:1630-1663`).

**Mas o conserto é sprint FORA desta onda** — `ONDA-CONEXOES-11` (a semente e os
filtros de barramento) e `ONDA-CONEXOES-12` (as 28 cores e as 10 zonas chegando
ao produto). **Enquanto elas não fecharem, uma coluna no rádio não tem
plástico** — e na mesa desenhada, **duas das quatro são BT**.

## O que entrega

1. **A cor do plástico deixa de morar num dict de instância** e passa a chegar
   pelo `state_full`, **por controle**, com um campo e um dono. É a mesma forma
   de todo o resto que a aba lê.
2. **Cada coluna pinta `--plastico` e `data-colorway` pelo `uniq` dela.** Um
   laço, endereçado pelo `data-uniq` da `MIGRA-ILUMINACAO-03`.
3. **A declaração dela vence, sempre.** `carregar_maquina().controles[uniq].cor`
   (`utils/maquina.py`, via IPC `machine.declare`) tem precedência sobre o que o
   aparelho respondeu — porque ela pode discordar, e porque o **controle
   externo** não tem serial de fábrica Sony e o campo é o **único** caminho dele
   (`cor_do_plastico.py:419-420`).
4. **A coluna sem cor TEM DESENHO.** Cinza, com a frase que diz **o quê, por quê
   e o que fazer** — nunca uma coluna quebrada, nunca um `KeyError`, nunca a cor
   de outro modelo por engano.

## Como se prova — a mordida

`tests/unit/test_migra_iluminacao_10_a_cor_do_plastico_por_coluna.py`:

- **duas cores, duas colunas.** Dois `uniq` com `colorway` diferente → duas
  bordas e dois `data-colorway` distintos no DOM. **Fixe um só e veja
  reprovar.** E o teste **lê** os hexas esperados de
  `docs/data/cores-do-dualsense.csv`, nunca os digita — é a mesma razão de
  `cor_da_zona` (`monta.py:172-189`) ler a folha do SVG em vez de escrever o
  hexa: foi assim que o Cosmic Red do mockup ficou `#b11f54` enquanto a
  amostragem dizia `#A51C48`.
- **a declaração dela vence.** Com o aparelho dizendo `white` e a declaração
  dizendo `cosmic-red`, a coluna fica Cosmic Red. **Inverta a precedência e veja
  reprovar.**
- **o cinza é estado, não erro.** Com a cor ausente: nenhum toast, nenhuma
  exceção, e a frase na tela. Ela diz o quê, por quê e o que fazer — a regra de
  quem é o usuário desta casa.
- **28 modelos, não 21.** O desenho conhece **28**
  (`docs/data/cores-do-dualsense.csv`; 28 `data-colorway` em
  `assets/control-svg/dualsense.svg`); o produto nomeia **21**
  (`integrations/cor_do_plastico.NOMES_DE_FABRICA`). **Nenhuma régua compara as
  duas hoje.** Um código que o produto não sabe nomear (13, 14, 15, ZC, ZD, ZE,
  ZF) tem de cair no cinza com frase. Passe um deles e veja o que acontece —
  se levantar, reprova.
- **31 linhas do CSV são `SEM-HEX`** — iridescente, camuflado, metálico e arte
  não cabem num `fill`. **Inventar hex é proibido**; o gerador as pinta em
  hachura e o portão `scripts/check_cores_do_dualsense.py` exige a receita na
  coluna `nota`. Uma coluna com um desses modelos tem de sair hachurada, não
  chapada.
- **o rádio é medido, não suposto.** O teste declara qual transporte está
  simulando. `scripts/check_paridade_transporte.py` reprova afirmação forte sem
  teste que a sustente — e enquanto a `ONDA-CONEXOES-11` não fechar, **a
  afirmação forte para o rádio não existe**.

## O que é dela decidir

**Com a mesa dela em dois e a leitura só por cabo, quantas colunas nascem cinza
depende do transporte.** Três saídas, e são dela:

- **(a)** o campo em que ela **declara** a cor vira o caminho principal para o
  rádio, e a leitura do aparelho fica como conveniência do cabo;
- **(b)** a coluna nasce cinza até o controle passar pelo cabo **uma vez**, e o
  produto guarda por MAC;
- **(c)** **esta onda espera a `ONDA-CONEXOES-11`** (a semente `0x53`) — e aí
  nenhuma coluna nasce cinza. **É a saída que resolve, e ela custa uma sprint de
  outra onda.**

**Nota de fato, para não se repetir:** a decisão dela de 21/08 já autorizava a
leitura pelo rádio (`docs/data/cores-do-plastico.md:15-17`) e **não precisa ser
reaberta**. O que continua de pé e não se mexe é a trava da família `0x80`: um
par errado **reseta o controle**, não há desfazer, e ela tem quatro controles sem
reposição (`docs/protocol/dualsense-referencia-canonica.md:1626-1629`).
