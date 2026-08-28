---
# onda: GATILHOS
sprint: ONDA-GATILHOS-04
posse:
  G4:
    - src/hefesto_dualsense4unix/profiles/schema.py
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
cria:
  - tests/unit/test_gatilhos_o_efeito_pronto_tem_nome.py
bancada: false
depois_de:
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/triggers_actions.py
  # e src/hefesto_dualsense4unix/app/draft_config.py
  # e src/hefesto_dualsense4unix/profiles/schema.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-GATILHOS-01
  - EMULACAO-UM-DONO-SO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/trigger_presets.py
  - src/hefesto_dualsense4unix/core/trigger_effects.py
  - src/hefesto_dualsense4unix/profiles/curva_propria.py
---

# ONDA GATILHOS · 04 — o "Efeito pronto" não brota, e passa a ter nome

**O defeito em uma frase:** a linha "Efeito pronto" **nasce escondida**, brota em
2 dos 19 modos e empurra a tela — e o nome do efeito escolhido nunca é gravado,
então o perfil reabre sempre em *"Personalizar"*, sem dizer de onde vieram os
dez números.

Os dois itens do contrato, literais:

> *"**Efeito pronto** no L2 e no R2 — fica, e passa a guardar o nome da curva
> escolhida."*
> *"'Efeito pronto' nascendo sempre em 'Personalizar' — **sai**: o nome passa a
> ser guardado."* — `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:287,292`

## A medição

**Brota.** `gui/main.glade:848` (`trigger_left_preset_row`) nasce
`visible=False` + `no-show-all=True`, e `triggers_actions.py:435`
(`_update_preset_row_visibility`) só a acende quando o modo está em
`_MODES_COM_PRESET = {"MultiPositionFeedback", "MultiPositionVibration"}`
(`:106`). Dois modos em dezenove. A linha aparecendo e sumindo é metade do
"pula" que a sprint 02 mata na caixa de ajustes.

**Não guarda o nome.** `profiles/schema.py:198` — `TriggerConfig` tem `mode` e
`params`, e **nada mais**. `app/draft_config.py:42` — `TriggerDraft` idem. O
`_populate_preset_combo` (`triggers_actions.py:449`) termina sempre em
`combo.set_active_id("custom")` (`:469`): mesmo que o disco trouxesse a curva
exata do *Plateau central*, a tela abre dizendo "Personalizar".

## O que entrega

**1 · A linha fica sempre no mesmo lugar.** O `trigger_<side>_pronto_slot` que a
02 criou é **sempre visível**. Nos 17 modos que não têm efeito pronto ela fica
**insensível**, com o texto que já existe no mockup — `— nenhum —`
(`novo-layout/_ferramentas/aba03.py:88`). Nada brota, nada empurra.

Trava do GTK3 (contrato, P3): **widget insensível não dispara tooltip**. A
explicação de por que a lista está cinza naquele modo mora no **"?" do quadro**
(sprint 02), não num tooltip da lista apagada.

**2 · O nome viaja até o disco.** `TriggerConfig` e `TriggerDraft` ganham um
campo de nome do efeito, opcional e com padrão vazio.

- **Não há migração a fazer, e isso é medido:** um campo novo com padrão não
  quebra `extra="forbid"` na leitura — os 29 perfis do disco continuam abrindo,
  simplesmente sem nome. Só o `docs/data/mapa-controles.csv` e o `specs.html`
  precisam saber que o campo existe, se a linha do gatilho os citar.
- **Quem escreve o nome:** `_on_preset_changed` (`:392`), no mesmo tique em que
  já popula os sliders e chama `_persist_params_to_draft`.
- **Quem o apaga:** `_update_preset_to_custom` (`:503`) — mover uma barra
  desmancha o efeito pronto, e o nome sai junto. Nome que sobrevive ao ajuste
  manual é nome mentindo.

**3 · A tela reabre no nome, não em "Personalizar".**
`_refresh_triggers_from_draft` (`:166`) passa a restaurar o efeito escolhido a
partir do campo gravado; `_populate_preset_combo` só cai em `custom` quando o
perfil não trouxe nome.

## Os arquivos que toca

- `src/hefesto_dualsense4unix/profiles/schema.py` — `TriggerConfig`.
- `src/hefesto_dualsense4unix/app/draft_config.py` — `TriggerDraft` e os dois
  conversores (`_triggers_config_to_draft` e o caminho de volta).
- `src/hefesto_dualsense4unix/app/actions/triggers_actions.py` — visibilidade,
  gravação e restauração do nome.

## Como se prova (o teste que morde)

`tests/unit/test_gatilhos_o_efeito_pronto_tem_nome.py`:

1. **a linha existe nos 19 modos** — percorre `PRESETS` e afirma que o slot está
   visível em todos, e **insensível** nos 17 sem efeito pronto. Arranque a cura
   e o teste reprova em 17 modos;
2. **ida e volta pelo disco**: escolher *Plateau central*, salvar o perfil, ler
   do disco e reabrir devolve **Plateau central** na tela — não "Personalizar".
   Arranque o campo do schema e o teste reprova aqui. Esta é a mordida cara;
3. **mover uma barra apaga o nome** — e o perfil salvo depois disso não carrega
   nome nenhum;
4. **perfil velho continua abrindo** — um JSON sem o campo (cópia de um dos 29
   do disco, com MAC mascarado na forma da casa: octetos 4 e 5 zerados) carrega
   sem levantar, e a tela mostra "Personalizar". O dublê que sabe recusar é o
   par deste: um JSON com o campo de tipo errado **tem** de levantar;
5. **os dez números continuam intactos** — o nome é anotação, não substituto: os
   `params` gravados são byte a byte os mesmos de antes desta sprint.

## O que é dela decidir

1. **Nos 17 modos sem efeito pronto, a lista fica cinza ou some?** O mockup
   desenha a lista **presente e ativa** na coluna do L2 com o modo
   *Metralhadora* selecionado (`novo-layout/03-gatilhos.html`, coluna esquerda)
   — mas os cinco prontos desenhados ali (*Rampa crescente… Stop macio*) são,
   no código, os do `MultiPositionFeedback`
   (`profiles/trigger_presets.py:55-63`), que **não existem** para
   *Metralhadora*. Esta sprint escreve o provisório **presente e insensível**, e
   marca: *PROVISÓRIO — decisão dela*.
2. **"Stop hard" e "Machine gun" continuam em inglês?** São rótulos de hoje
   (`profiles/trigger_presets.py:59,67`) e o mockup os repete tal e qual. A casa
   escreve em português; o mockup é o desenho aprovado. Não mexemos sem a
   palavra dela — e é a mesma pergunta da sprint 06, por outro caminho.
