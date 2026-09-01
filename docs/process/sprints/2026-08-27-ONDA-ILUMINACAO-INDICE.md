---
sprint: ONDA-ILUMINACAO-INDICE
# onda: ILUMINACAO — índice. Não tem posse: não se executa, se lê.
posse:
  QUEM-COORDENA:
    - docs/process/sprints/2026-08-27-ONDA-ILUMINACAO-INDICE.md
cria:
  - docs/process/sprints/2026-08-27-ONDA-ILUMINACAO-INDICE.md
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# ONDA ILUMINAÇÃO — índice

*Que cor é a minha, e qual número eu sou na mesa.*

Dez sprints levam a aba **Iluminação** do produto de hoje até o mockup que ela
aprovou. **Nada aqui foi executado** — este é o desenho do caminho.

## O que a onda troca

| sai | entra |
|---|---|
| painel "Desenho das 5 luzes" (~278 linhas de glade, 7 botões, 5 caixas) | a escolha do número, com espaço fixo |
| a faixa de número que **brota** no cabeçalho | a seção "Selecione o player" |
| prévia = retângulo pintado à mão | o DualSense desenhado, na cor do plástico |
| dois botões de "voltar ao automático" | um só, que obedece a fita |
| diálogo de cor | guia de oito tons + o livre |
| explicação ocupando a tela | "?" por quadro |
| — | duas peças nunca ficam com a mesma cor |
| — | a linha que diz de onde veio a cor |

## A ordem, e por que ela é essa

```
01 o desenho sai das cinco caixas        ← trava de segurança: sem isto, a 04
 │                                          grava "tudo apagado" no perfil dela
 ├─ 02 o controle desenhado ─────────┐
 │                                   │
 └─ 03 o número desce do cabeçalho ──┤
                                     │
                        04 o painel sai, a grade entra   ← ÚNICA sprint no glade
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
       05 a guia de tons     06 um botão só           (04 libera as duas)
              │                      │
              └──────── 07 duas peças nunca têm a mesma cor
                                     │
                        08 a cor do plástico chega à aba
                                     │
                        09 de onde veio esta cor
                                     │
                        10 só título e estado na tela   ← volta ao glade
```

| # | sprint | camada | tamanho |
|---|---|---|---|
| 01 | o desenho sai das cinco caixas | backend da GUI | ~120 linhas |
| 02 | o controle desenhado no lugar do retângulo | frontal + install | ~350 linhas |
| 03 | a escolha do número desce do cabeçalho | frontal | ~280 linhas |
| 04 | o painel inútil sai, e a grade do mockup entra | frontal (glade) | ~400 linhas (−278) |
| 05 | a guia de tons, o livre e o hexa | frontal | ~220 linhas |
| 06 | um botão só para o automático | ambas | ~180 linhas |
| 07 | duas peças nunca têm a mesma cor | backend + frontal | ~260 linhas |
| 08 | a cor do plástico chega à aba | frontal | ~200 linhas |
| 09 | de onde veio esta cor | frontal | ~190 linhas |
| 10 | só título e estado ficam na tela | frontal (glade) | ~150 linhas |

**Duas regras de ordem, e as duas são medidas:**

1. **A 01 vem antes de tudo.** Os cinco `GtkCheckButton` de
   `gui/main.glade:1478-1482` são hoje **o único armazenamento do desenho na
   GUI**, lidos por `lightbar_actions.py:1466`. Apagá-los antes de mover o estado
   grava `[False]*5` no perfil dela.
2. **`main.glade` é recurso de uma sprint por vez** (XML único, conflito de
   merge irrecuperável). Nesta onda ele é tocado **duas vezes, em série**: a 04 e
   a 10. Nenhuma outra sprint o salva.

## O que já existe e NÃO virou sprint

Medido, para ninguém refazer:

- **o comando que troca o número do controle** — `identity.number.set`
  (`daemon/ipc_server.py:179`, `daemon/ipc_handlers.py:1590+`,
  `app/ipc_bridge.py:712`). Já funciona; a ILUM-03 só o muda de lugar na tela;
- **o desenho do número para 1..8** — `player_led_pattern`
  (`core/led_control.py:122`) e `player_slot_color` (`:158`). O contrato diz que
  o 5º ao 8º "não se perde e não precisa de botão": já está coberto;
- **o aviso do estado da barra em sincronia com as outras abas** — feito em
  25/08 pela L6: a frase sai de `widgets/controller_card.rotulo_lightbar`, a
  mesma dos cards, com a mesma precedência (Modo Nativo → disputa → fonte
  desconhecida → apagada). `lightbar_actions.py:643-717`. **Não refazer;** o
  contrato pede exatamente isto e já está pronto;
- **o envio ao soltar** (cor e brilho) — `_fiar_aplicar_ao_soltar`
  (`lightbar_actions.py:770`). A aba Iluminação já é o precedente que a Vibração
  vai copiar;
- **a leitura da cor do plástico** — `integrations/cor_do_plastico.py`. A
  ILUM-08 **consome, não reescreve** — isso continua. Mas este item é a
  **exceção da lista**: o módulo *tem* trabalho pendente, e ele é de **uma
  sprint própria**, fora desta onda.

  **FATO ERRADO, SUBSTITUÍDO (27/08/2026).** Este item dizia *"com a trava da
  família `0x80`. A ILUM-08 consome, não reescreve"*, e mais nada — sob o
  cabeçalho **"para ninguém refazer"**, sobre o módulo que é exatamente o que
  precisa ser refeito. Um índice que diz "não refazer" tem força de ordem:
  enquanto essa linha viveu, quem fosse investigar a cor no rádio lia a lápide
  de `cor_do_plastico.py:403-418` — *"por rádio o firmware do controle RECUSA o
  `0x80` (…) não é o BlueZ, não é o uhid, não é o kernel, não é o daemon — é o
  aparelho"* —, acreditava, e parava. Foi o custo que esta casa pagou por quatro
  dias. **Não era o aparelho: era o nosso CRC.** A semente do feature que SAI é
  `0x53` (`SET_REPORT|FEATURE`), não `0xA3` (`DATA|FEATURE`); assinar com a
  errada devolve `errno 5`. Com a certa, os quatro DualSense desta bancada
  responderam **pelo rádio** — White `00`, Cosmic Red `02`, Galactic Purple
  `04`, Starlight Blue `05`. A canônica já substituiu:
  `docs/protocol/dualsense-referencia-canonica.md:1630-1663`.

  **O que continua de pé, e não se mexe:** a trava da família `0x80` — um par
  errado **reseta o controle**, e não há desfazer
  (`docs/protocol/dualsense-referencia-canonica.md:1626-1629`).

  **O pendente, para a sprint própria:** a semente do CRC, e o filtro de
  barramento que hoje descarta o rádio antes de tentar —
  `_e_dualsense_no_cabo` em `cor_do_plastico.py:369`, que exige `_BUS_USB`
  (`cor_do_plastico.py:378`) e reprova o nó em `cor_do_plastico.py:445`.

  **A consequência de produto, para quem executar a ILUM-08 e a ILUM-09:** com
  a cor lida nos dois transportes, o campo em que a pessoa **declara** a cor
  deixa de ser o caminho principal e vira **correção** em dois casos: código
  desconhecido (`cor_do_codigo` em `cor_do_plastico.py:204` devolve `None`) e
  quando ela discordar do que o aparelho respondeu. **O controle externo é a
  exceção, e nele o campo NÃO é correção:** sem serial de fábrica Sony, o
  módulo o descarta por VID:PID (`cor_do_plastico.py:419-420`), e o campo é o
  **único** caminho dele — não pode nascer atrás de um "Corrigir". A decisão
  dela de 21/08 já autorizava o rádio e **não precisa ser reaberta**:
  `docs/data/cores-do-plastico.md:15-17`.

## Os dois defeitos de "a casa sabe e o produto não faz"

1. **O SVG do DualSense** existe desde 11/08 com 32 peças nomeadas, e tem
   **zero consumidores em `src/`** — só dois scripts que geram o `specs.html`.
   É a ILUM-02.

   **FATO ERRADO, SUBSTITUÍDO (27/08/2026).** Esta linha dizia *"`data-colorway`
   para as cinco cores de fábrica"*. Não são cinco, e não é uma cor por modelo:
   a folha dentro do SVG cobre hoje **28 modelos, cada um por zona** — dez
   zonas no CSV, **oito** classes `z-<zona>` no desenho. A casca é **uma peça
   só** (`#corpo`, `class="z-casca"`, `assets/control-svg/dualsense.svg:428`):
   quando as metades diferem — Spider-Man 2 e God of War 20th — ela recebe um
   `linearGradient` de **corte duro**, não duas classes (`ZONAS_DA_CASCA` em
   `scripts/gerar_cores_do_dualsense.py:73`); e `detalhe` é arte impressa, sem
   forma no desenho (`ZONAS_SEM_ALVO` em `:69`). Ela é **gerada**, não escrita à mão — de
   `docs/data/cores-do-dualsense.csv` por `scripts/gerar_cores_do_dualsense.py`,
   com o portão `scripts/check_cores_do_dualsense.py`, que mede por duas réguas
   independentes (a leitura dos CSV e a pintura no Chrome). O atributo continua
   lá: `assets/control-svg/dualsense.svg:2` (`data-colorway`). **31 linhas têm
   `grau` = `SEM-HEX`** — iridescente, camuflado, metálico e arte não cabem num
   `fill`; a receita vem na coluna `nota` (o portão exige em ao menos uma linha
   do modelo, `check_cores_do_dualsense.py:182-197`), o gerador as pinta em
   hachura, e **inventar hex é proibido**.
2. **`on_player_led_toggled`** (`lightbar_actions.py:1383`) é um handler
   registrado **sem ninguém que o chame**, morto desde 22/07. Sai na ILUM-04, sem
   perda.

E um terceiro achado, desta leitura: **`assets/control-svg/` não é instalado.**
`install.sh:3053-3054` copia `assets/glyphs` e mais nada; `control-svg` não
aparece uma vez no arquivo. Um widget que leia só do repositório nasce em branco
na máquina dela — está na ILUM-02, com portão.

## O que é dela, e ninguém decide por ela

Sete perguntas abertas, na ordem em que doem:

1. **Onde ficam os três controles que o contrato preserva e o mockup não
   desenha?** "Reenviar ao controle", a caixa "Cores automáticas por controle" e
   a linha de origem da cor estão no *"Nada se perdeu"*; o mockup aprovado tem em
   "Opções" **dois** botões e mais nada. (ILUM-04, ILUM-06, ILUM-09)
2. **Quantos números a seção mostra?** Cabeçalho 1..4, card de Conexões 1..5,
   produto 1..8, mockup 4. (ILUM-03)
3. **O "Desligar" guarda a cor ou grava preto?** A dica promete uma coisa e
   `lightbar_actions.py:1023-1046` faz a outra. Duas promessas vivas. (ILUM-06)
4. **Quais são os oito tons da guia?** A paleta decorativa do mockup ou a
   canônica do produto, que é a mesma que o automático devolve. (ILUM-05)
5. **O que é "o tom vizinho"**, e ela pode recusar o deslocamento? (ILUM-07)
6. **O número do jogador continua também no card da aba Conexões?** (ILUM-03)
7. **Uma linha ou duas** para "de onde veio a cor" e "as luzinhas mostram o
   número N"? (ILUM-09)

## Fontes desta onda

- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4
  (linhas 303-368);
- mockup aprovado: `layout/04-iluminacao.html`, gerador
  `layout/_ferramentas/aba04.py`;
- correção literal dela: `layout/_ferramentas/CORRECOES-DELA.md`, Aba
  Iluminação — **"— FEITA"**;
- decisões: **D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR**,
  **D-A-BORDA-E-A-IDENTIDADE-DA-PECA**, **D-A-FITA-E-O-UNICO-ALVO**,
  **D-DUAS-PECAS-NUNCA-TEM-A-MESMA-COR**, **D-CADA-JOGADOR-NAVEGA-COM-O-SEU**,
  **D-AS-ABAS-CONVERSAM**, **D-TUDO-QUE-EXPLICA-VIRA-DICA**,
  **D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL**.
