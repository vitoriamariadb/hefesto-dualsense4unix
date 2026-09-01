---
sprint: MIGRA-GATILHOS-09
onda: MIGRA-GATILHOS
posse:
  M9:
    - src/hefesto_dualsense4unix/profiles/schema.py
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
    - layout/_ferramentas/aba03.py
cria:
  - tests/unit/test_migra_gatilhos_o_efeito_pronto_tem_nome.py
bancada: false
depois_de:
  - MIGRA-GATILHOS-05
  - MIGRA-GATILHOS-07
  # SÉRIE, por R5: divide layout/_ferramentas/aba03.py com a 02 e a 04, e
  # src/hefesto_dualsense4unix/app/actions/triggers_actions.py com a 03 e a 04.
  - MIGRA-GATILHOS-02
  - MIGRA-GATILHOS-03
  - MIGRA-GATILHOS-04
  # SÉRIE, por R5: divide triggers_actions.py, draft_config.py e schema.py
  # com as de baixo. A ordem é a fila das ondas de SPRINT_ORDER.md §1.2.
  - MIGRA-GATILHOS-06
  - MIGRA-GATILHOS-08
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  # SÉRIE, por R5: divide profiles/schema.py e app/draft_config.py com estas.
  # Acréscimo de campo, cada onda no seu bloco: serializar basta.
  - EMULACAO-UM-DONO-SO-01
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  - ONDA-NAVEGACAO-05
  - ONDA-PERFIS-09
  # SUBSTITUÍDAS por esta onda (ver o índice, "As sete sprints ONDA-GATILHOS").
  # Ficam aqui porque enquanto elas estiverem no disco a posse é real, e
  # silêncio não é declaração.
  - ONDA-GATILHOS-01
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
  # AS OUTRAS ONDAS MIGRA, escritas no MESMO DIA e ainda em voo. A lista foi
  # medida em 29/08 com `check_colisao_de_sprints.py`; ela é um retrato, não
  # um contrato — quem coordena reconfere no despacho, porque as irmãs ainda
  # estavam sendo escritas quando esta linha foi tirada.
  - MIGRA-VIBRACAO-04
  - MIGRA-VIBRACAO-05
  - MIGRA-VIBRACAO-06
  - MIGRA-CONEXOES-06
nao_toca:
  - src/hefesto_dualsense4unix/profiles/trigger_presets.py
  - src/hefesto_dualsense4unix/profiles/curva_propria.py
  - src/hefesto_dualsense4unix/core/trigger_effects.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

# MIGRA GATILHOS · 09 — o "Efeito pronto" ganha nome, e sentido nos 19 modos

**O defeito em duas frases:** o perfil **não guarda o nome** do efeito escolhido —
grava os dez números e a aba reabre sempre em *"Personalizar"*. E o desenho
aprovado mostra o campo nos **19** modos, quando ele só tem significado em
**dois**.

## A medição

**Não guarda o nome.** `profiles/schema.py:197-203` — `TriggerConfig` tem `mode`
e `params`, e **nada mais**, com `extra="forbid"`. `app/draft_config.py` —
`TriggerDraft` idem. E `_populate_preset_combo` termina **sempre** em
`combo.set_active_id("custom")` (`triggers_actions.py:471`): mesmo que o disco
trouxesse a curva exata do *Plateau central*, a tela abre dizendo
"Personalizar".

**Só existe em dois modos.** `_MODES_COM_PRESET = {"MultiPositionFeedback",
"MultiPositionVibration"}` (`triggers_actions.py:101`), e
`_update_preset_row_visibility` (`:441-450`) esconde a linha nos outros
**dezessete**. Se alguém escolher um efeito pronto num modo fora dos dois,
`_on_preset_changed` faz `return` **mudo** (`:409-415`) — nem aplica, nem
recusa, nem explica.

**E a cena aprovada faz exatamente isso.** O P2 esquerdo mostra
*"Arma semi-automática"* com *"Stop hard"* selecionado (`aba03.py:189`). Hoje
esse par é um `return` calado.

## O que entrega

### Parte A — o nome passa a existir (não depende de decisão dela)

1. **`TriggerConfig` ganha `preset: str | None = None`.** Campo novo com padrão
   é **aditivo**: não quebra o `extra="forbid"` na leitura dos perfis que já
   estão no disco dela, e um perfil antigo abre com `None` — que é exatamente o
   que ele significa hoje.
2. **`TriggerDraft` ganha o mesmo campo**, e `_persist_params_to_draft` (`:359`)
   passa a gravá-lo junto com `mode` e `params`.
3. **A aba reabre no que ela escolheu.** `_populate_preset_combo` deixa de
   forçar `"custom"` e passa a selecionar o `preset` do rascunho; `"custom"`
   continua sendo o padrão quando não há nome — e continua sendo para onde
   `_update_preset_to_custom` (`:487`) volta quando ela move uma barra, que é
   comportamento correto e não muda.

### Parte B — o campo nos 19 modos (depende da decisão dela, abaixo)

Duas leituras possíveis, e **o trabalho muda inteiro entre elas**:

| leitura | o que é | o que custa |
|---|---|---|
| **(a) o campo vira "efeito salvo"** — nome + modo + params; escolher um **TROCA o modo** da coluna | é o que a cena aprovada mostra (*Stop hard* num *Arma semi-automática*) e é o que o nome "Efeito pronto" promete a quem lê | schema + catálogo; e vira a porta de entrada de "Meus efeitos" (sprint **10**) |
| **(b) continua sendo curva de 10 posições** — e nos 17 modos a lista fica **cinza**, com o motivo no `title` | é o que o produto faz hoje | **uma linha de CSS** e uma frase |

**Esta sprint não escolhe.** Ela entrega a Parte A, escreve as duas como
`PROVISÓRIO — decisão dela`, e **elimina o `return` mudo** em qualquer uma das
duas: escolher um efeito pronto num modo onde ele não vale passa a **dizer por
quê**, nunca a não fazer nada em silêncio. Frase de diagnóstico desta casa diz
**o quê, por quê e o que fazer**.

## Como se prova (a mordida)

`tests/unit/test_migra_gatilhos_o_efeito_pronto_tem_nome.py`:

1. **O nome sobrevive ao disco.** Escolher *Plateau central*, salvar o perfil,
   reler do disco: `triggers.left.preset == "plateau_central"`, e a aba reabre
   com ele selecionado. **A mordida:** devolva o `set_active_id("custom")` de
   `:471` e o teste reprova mostrando *"Personalizar"* sobre a curva certa.
2. **Perfil antigo abre.** Carregar um perfil **sem** o campo `preset` — os 29
   que estão no disco servem — e confirmar que ele valida, abre e salva de
   volta. Ponha o campo sem padrão e o teste reprova com o
   `ValidationError` do `extra="forbid"`. Esta é a régua que impede a Parte A de
   quebrar a gaveta dela.
3. **Mover uma barra volta para "Personalizar"** — e grava `preset=None`, não o
   nome antigo. Um nome que não corresponde mais aos números é pior que nenhum.
4. **Nada é mudo.** Escolher um efeito pronto num modo fora dos dois produz
   **alguma** resposta na tela — a frase da leitura (b), ou a troca de modo da
   (a). Devolva o `return` de `:415` e o teste reprova por ausência de resposta.
   **Ausência de notícia lida como sucesso é o padrão que
   `O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO` registra.**
5. **A lista da página casa o produto** — herdada da sprint **05** e recobrada
   aqui, porque esta sprint mexe no gerador: nenhum `"— Nenhum —"`, e os seis
   rótulos de vibração presentes quando o modo é *Vibração por posição*.

## O que é dela decidir

1. **(a) ou (b)**, na tabela acima. É a pergunta mais cara desta aba: a (a) é
   uma sprint de schema e catálogo, a (b) é uma linha de CSS.
2. **Se for (b): cinza ou some?** A pergunta é de 27/08 e continua aberta. O
   desenho aprovado mostra o campo **sempre**; some seria a tela pulando de
   novo, que é o que o quadro único de 28/08 existe para matar.
3. **"Stop hard", "Machine gun", "Senoide", "Plateau central".** São os rótulos
   do produto (`profiles/trigger_presets.py:55-72`) e três deles não são
   português. Ela já decidiu isso uma vez para os modos (07/08: o inglês
   **fica**, quando o português é ambíguo). Aqui a pergunta é a mesma, e a
   resposta pode ser diferente — estes não têm o problema de ambiguidade que
   *Arco* e *Arma* tinham.
