---
sprint: MIGRA-GATILHOS-06
estado: absorvida
onda: MIGRA-GATILHOS
posse:
  M6:
    - src/hefesto_dualsense4unix/interface/aba03.py
cria:
  - tests/unit/test_migra_gatilhos_a_caixa_de_ajustes_cabe_onze.py
bancada: false
depois_de:
  - MIGRA-GATILHOS-02
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/interface/aba03.py com as de baixo.
  - MIGRA-GATILHOS-04
  - MIGRA-GATILHOS-05
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/trigger_specs.py
  - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 03). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA GATILHOS · 06 — a caixa de ajustes cresce até onze

**O defeito em uma frase:** a caixa de ajustes é uma grade de altura **FIXA** —
quatro linhas no L2 e três no R2 (`aba03.py:310-311`) — e **cinco dos 19 modos
pedem mais**. No mockup isso nunca aparece porque a cena é estática; na aba viva
é **o primeiro clique** de quem for explorar os modos.

## A medição, e um fato errado que sai daqui

`.venv/bin/python -c "from hefesto_dualsense4unix.app.actions.trigger_specs import PRESETS; ..."`,
rodado hoje:

| modo | barras | cabe na caixa? |
|---|---|---|
| Galope | 5 | não |
| Metralhadora | 6 | não |
| Montar do zero | 8 | não |
| Curva de força | 10 | não |
| **Vibração por posição** | **11** | não |

**FATO ERRADO, E ELE ESTÁ NA LEGENDA QUE ELA APROVOU.** `aba03.py:397` diz
*"Vibração por posição 10"*. São **11**: `MultiPositionVibration` monta
`_frequency(40)` **mais** as dez posições (`trigger_specs.py:235-247`). Por ser
fato errado — não decisão medida —, ele **sai e é substituído em todos os
lugares onde aparece**, e não só onde foi notado: a legenda da aba, a linha da
conta (`10 * ALT_BARRA` e `20 * ALT_BARRA`, `:397-398`), e qualquer sprint que
o repita.

A conta certa, com o `ALT_BARRA = 23` do próprio arquivo: onze barras pedem
**253px** numa linha, e as duas linhas somariam **506px** — contra os
**454px** que a grade inteira tem (`TETO_DA_GRADE`, `:299`), com o chip, os
quatro campos e o botão **dentro** deles.

A legenda diz *"Não cortei nada"* e deixa a pergunta aberta (`:399-402`):

> *"O que falta decidir é onde as dez posições se desenham — provavelmente uma
> janela própria, que é o que o nome **Montar do zero** já promete."*

## Por que isto não é o mesmo problema de antes

Na tela de **duas** colunas havia 109px de trilho e uma coluna larga. Com
**quatro**, cada coluna tem 220px de conteúdo e 80px de trilho
(`aba03.py:410-412`). **O espaço piorou, e o número de barras não mudou.**

E o gerador **já reprova alto** se alguém passar do teto — `SystemExit`
(`:300-302`). Isso protege o mockup e **não protege a aba viva**: lá quem escolhe
o modo é ela, em tempo de execução, e não há `SystemExit` que a impeça.

## O que entrega

Uma das três saídas abaixo, **desenhada e gerada**, para as onze barras terem
onde caber sem o quadro rolar por dentro. Quadro que rola é conteúdo que ninguém
sabe que existe — é a razão do teto existir.

| saída | o que custa | o que ela ganha, e o que perde |
|---|---|---|
| **(a) janela própria** para os cinco modos grandes | um diálogo novo, e o `retratar_dialogos.py` para fotografá-lo | é o que o nome *Montar do zero* promete; e as onze barras ganham largura de verdade. Perde: a curva sai da tela onde as outras três colunas estão |
| **(b) a caixa rola por dentro**, só ela | CSS | barato e honesto se a barra de rolagem for **visível**. Perde: `olhar.py` levanta o Chrome com `--hide-scrollbars`, então **a foto não a mostra** — a régua fica cega exatamente onde o defeito mora |
| **(c) a coluna cresce e as outras acompanham** | a grade passa a ter altura por LINHA calculada do maior modo escolhido nas N colunas | nada some. Perde: escolher *Vibração por posição* numa coluna empurra as outras três para baixo, e o quadro passa dos 454px |

**Esta sprint não escolhe.** Ela mede as três, desenha a que ela apontar, e
regenera o `03-gatilhos.html` para ela ver no `ver.py`.  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_a_caixa_de_ajustes_cabe_onze.py`:

1. **A régua LÊ a quantidade de barras do produto.** Para cada um dos 19 modos,
   `len(get_spec(name).params)` — e nenhum número desses 19 aparece digitado no
   arquivo de teste. **A mordida:** troque `_frequency(40)` por nada em
   `MultiPositionVibration` e o teste tem de mudar de resposta sozinho. Se não
   mudar, a régua está digitando.
2. **Onze barras não fazem o quadro rolar.** Gere a página com o pior caso —
   *Vibração por posição* (11) no L2 e *Curva de força* (10) no R2, nas N
   colunas — e meça: a altura da grade ≤ 454px, ou a saída escolhida está lá
   (o diálogo existe, ou o rolador da caixa é visível). Volte à grade fixa de 4
   e 3 e o teste reprova.
   **A armadilha, medida em 27/08:** o `scrollIntoViewIfNeeded` do Playwright
   **rola antes de medir** e cega toda medição de layout feita depois — foi
   assim que um portão deu verde sobre uma linha fora da caixa. Esta régua mede
   **sem hover e sem rolagem programática**, e o comentário no teste diz isso.
3. **O 11 substituiu o 10 em todo lugar** — `grep -rn "Vibração por posição 10"`
   no repositório devolve zero, e a legenda gerada diz 11. Devolva o 10 e
   reprova.
4. **O `SystemExit` do gerador continua vivo** — ele é a rede que impede o
   mockup de nascer com o quadro rolando. Esta sprint muda o teto, não o
   apaga. Apague-o e a régua reprova.

## O que é dela decidir

**Onde as onze barras se desenham.** É a pergunta que a legenda que ela aprovou
deixou aberta com todas as letras. As três saídas estão na tabela acima, com o
preço de cada uma.

**E há uma quarta pergunta, mais barata, que pode dispensar as três:** a
*Metralhadora* do P1 mostra **quatro** barras (Força, Frequência, Início do
curso, Fim do curso) e o produto lista **seis** com outros nomes (Início, Fim,
Amplitude A, Amplitude B, Frequência, Período). O gerador declara a divergência
e a mantém de propósito (`aba03.py:169-174`), porque o P1 é a cena que ela
aprovou:

> *"**Uma das duas está errada** — e a escolha é sua."* — `aba03.py:408-409`

Se a resposta for *"o produto é que tem parâmetro demais"*, cinco dos 19 modos
encolhem e o problema desta sprint muda de tamanho. Se for *"o desenho é que
simplificou"*, a tabela acima vale como está.
