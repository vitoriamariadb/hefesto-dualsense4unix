---
sprint: MIGRA-GATILHOS-05
onda: MIGRA-GATILHOS
posse:
  M5:
    - src/hefesto_dualsense4unix/interface/aba03.py
    - src/hefesto_dualsense4unix/app/actions/trigger_specs.py
cria:
  - tests/unit/test_migra_gatilhos_o_texto_dos_modos_tem_um_dono.py
bancada: false
depois_de:
  - MIGRA-GATILHOS-02
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/interface/aba03.py com as de baixo.
  - MIGRA-GATILHOS-04
  # SÉRIE, por R5: divide src/hefesto_dualsense4unix/app/actions/trigger_specs.py
  - GATILHO-NAO-PERDIDO-01
  # SUBSTITUÍDAS por esta onda (ver o índice, "As sete sprints ONDA-GATILHOS").
  # Ficam aqui porque enquanto elas estiverem no disco a posse é real, e
  # silêncio não é declaração.
  - ONDA-GATILHOS-06
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
  - src/hefesto_dualsense4unix/core/trigger_effects.py
  - src/hefesto_dualsense4unix/profiles/trigger_presets.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

# MIGRA GATILHOS · 05 — os dezenove modos têm um dono só

**O defeito em uma frase:** o gerador do mockup **digitou** 19 rótulos e 19
descrições novas à mão (`aba03.py:138-158`) para os mesmos 19 modos que o
produto já sabe nomear e descrever — e **cortou o inglês de dois rótulos que ela
mandou manter em 07/08**.

Isto é grave por uma razão que o próprio arquivo escreve seis linhas antes,
sobre os PARÂMETROS:

> *"OS PARÂMETROS DE CADA MODO SAEM DO PRODUTO, e não de uma tabela digitada
> aqui. (…) Digitar "Posição, 0 a 9" nesta página seria a segunda verdade que o
> mapa existe para matar."*
> — `aba03.py:11-16`

A regra está certa e o arquivo a aplica aos números (`SPEC`, `:20`, importa
`PRESETS` de verdade). **Ela não foi aplicada ao texto.** É a mesma forma dos
seis instrumentos falsos de 29/08 e das onze réguas de 26/08: *digitavam o que
deviam LER*.

## A medição

**Rótulos.** Dois divergem, e os dois foram decididos por ela:

| produto | mockup | a razão dela, no código |
|---|---|---|
| `Arco de flecha (Bow)` (`trigger_specs.py:135`) | `Arco de flecha` (`aba03.py:146`) | *"'Arco' sozinho é ambíguo em português (arco de círculo, arco elétrico). O `name` em inglês fica"* (`:132-134`) |
| `Disparo (Weapon)` (`trigger_specs.py:200`) | `Disparo` (`aba03.py:152`) | *"'Arma' não separava este modo de 'Arma automática' nem de 'Arma semi-automática' — três botões da mesma grade começavam pela mesma palavra"* (`:196-199`) |

**Descrições.** As 19 são novas. Amostra:

| modo | produto (`TriggerPresetSpec.description`) | mockup (`aba03.py`) |
|---|---|---|
| Desligado | "Sem resistência." | "Sem resistência nenhuma — o gatilho fica solto, como num controle comum." |
| Rígido | "Barreira rígida numa posição fixa." | "Trava dura do começo ao fim do curso. Serve para freio de carro e para arma travada." |
| Metralhadora | "Metralhadora com dois picos de amplitude." | "Batidas rápidas e fortes enquanto apertado. É o padrão do Estilo FPS." |

As do mockup são **melhores** — dizem o que a pessoa vai sentir na mão, e não o
que o firmware faz. Não é isso que está em questão. O que está em questão é
**quantos donos** o texto tem: hoje o produto mostra as 19 curtas nos tooltips
dos botões (`triggers_actions.py:124`, `dicas_dos_modos`) e a página mostra as 19
longas. **Duas versões vivas do mesmo texto é o que a regra do "fato errado se
substitui" existe para matar.**

**A terceira lista, e ela está pior.** O `PRONTOS` do mockup (`aba03.py:160-161`)
tem seis entradas e nenhuma delas casa o produto por inteiro:

- traz 5 dos 6 rótulos de feedback (`FEEDBACK_POSITION_LABELS`,
  `profiles/trigger_presets.py:55-63`) — falta **"Linear médio"**;
- **inventa "— Nenhum —"**, que não existe em chave nenhuma do produto;
- **perde "Personalizar"**, que é o `custom` e é o estado em que a aba abre hoje
  (`_populate_preset_combo:471`);
- **os SEIS de vibração não aparecem** (`VIBRATION_POSITION_LABELS`, `:66-72`:
  Pulso crescente, Machine gun, Galope, Senoide, Vibração final, Personalizar).

## O que entrega

1. **`aba03.MODOS` morre.** O gerador passa a montar as 19 opções de
   `trigger_specs.PRESETS` — `label` no texto da `<option>`, `name` no `value`,
   `description` no `title`. Uma linha de importação a mais e uma tabela a
   menos, no mesmo arquivo que já importa `PRESETS` para os parâmetros.
2. **`aba03.PRONTOS` e `aba03.MEUS` morrem do mesmo jeito** — vêm de
   `FEEDBACK_POSITION_LABELS` e `VIBRATION_POSITION_LABELS`, e "Meus efeitos"
   vem do catálogo (sprint **10**; até lá, lista vazia e o separador some).
3. **As 19 descrições longas substituem as curtas EM `trigger_specs.py`**, e não
   ao lado delas. É a regra dela de 11/08, reforçada em 21/08: *"provou que uma
   info tá errada, substituímos ela pela certa em todos os lugares"*. O texto
   passa a ter **um dono** — e o dono é o produto, que é quem a aba, o tooltip e
   a página leem.
   **O teto de 22 caracteres do `label` não muda** e continua sendo cobrado por
   `tests/unit/test_gatilho_palavra_rotulos.py` (`trigger_specs.py:89-97`). A
   `description` não tem teto: ela vive em `title`, não em botão.
4. **Os dois parênteses voltam** — `Arco de flecha (Bow)` e `Disparo (Weapon)`,
   como ela decidiu em 07/08. **Ou saem do produto**, se ela mudar de ideia; o
   que não pode é a página dizer um e a janela dizer outro.

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_o_texto_dos_modos_tem_um_dono.py`:

1. **A página não tem texto de modo digitado.** Para cada `<option>` de
   `select[data-papel=modo]` no HTML gerado, o texto está em
   `{p.label for p in PRESETS}` e o `title` em `{p.description for p in PRESETS}`.
   **A mordida:** troque um caractere de um rótulo no `trigger_specs.py` e o
   teste reprova **na página**, sem ninguém tocar no gerador. Devolva a tabela
   `MODOS` ao `aba03.py` e ele reprova de novo, nomeando as 19.
2. **A régua LÊ, não digita.** Esta é a armadilha nomeada: onze réguas de 26/08
   reprovaram a melhora em vez do defeito porque comparavam contra números
   escritos à mão. Esta compara **HTML gerado contra `PRESETS` importado** — os
   19 nomes não aparecem no arquivo de teste. Se alguém colar a lista lá dentro,
   a régua morre; escreva o comentário que diz isso.
3. **Os dois nomes em inglês estão na página** — busca literal por
   `Arco de flecha (Bow)` e `Disparo (Weapon)` no HTML. Corte um parêntese e
   reprova.
4. **A lista de efeito pronto casa o produto** — as opções de
   `select[data-papel=pronto]` são exatamente
   `FEEDBACK_POSITION_LABELS.values()` no modo de feedback e
   `VIBRATION_POSITION_LABELS.values()` no de vibração. Nenhum `"— Nenhum —"`
   sobrevive. **Este é o segundo controle negativo, e ele reprova hoje.**
5. **As 19 descrições longas estão em `trigger_specs.py`** e as curtas sumiram —
   `grep "Sem resistência."` em `src/` devolve zero. É a metade que uma
   substituição pela metade esquece.

## O que é dela decidir

**As 19 frases novas.** Elas são texto de tela, e texto de tela é dela
(PROVA-DE-TELA-01). A sprint escreve as 19 como **PROVISÓRIO — decisão dela** e
o que ela decidir vira o texto do produto, não só o da página. As três opções:

- **as longas substituem as curtas** (o que esta sprint propõe): a pessoa lê o
  que vai sentir, e a janela e a página dizem a mesma coisa;
- **as curtas ficam e a página as usa**: menos texto, e a página perde o que a
  torna melhor;
- **duas frases por modo, uma curta e uma longa**, com campo próprio: são 19
  frases novas de manutenção, e o precedente contra isso está escrito em
  `trigger_specs.py:18-31` — o `help_text` viveu com 73 vazios e zero leitores
  até ser podado em 25/08.
