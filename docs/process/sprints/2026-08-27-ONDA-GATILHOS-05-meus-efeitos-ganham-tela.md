---
# onda: GATILHOS
sprint: ONDA-GATILHOS-05
posse:
  G5:
    - src/hefesto_dualsense4unix/profiles/curva_propria.py
    - src/hefesto_dualsense4unix/utils/xdg_paths.py
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
    - src/hefesto_dualsense4unix/app/gui_dialogs.py
cria:
  - src/hefesto_dualsense4unix/profiles/catalogo_de_curvas.py
  - tests/unit/test_gatilhos_meus_efeitos_ganham_tela.py
bancada: false
depois_de:
  - ONDA-GATILHOS-04
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/triggers_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-GATILHOS-01
  - ONDA-GATILHOS-02
  - ONDA-GATILHOS-03
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - scripts/gerar-tabela-de-curvas.py
  - docs/data/curvas-proprias.json
  - src/hefesto_dualsense4unix/profiles/schema.py
  # O portão da dívida é de QUEM COORDENA, e não desta onda: cada sprint
  # entrega o MANIFESTO do que ligou, e quem coordena aplica todos num
  # commit só. Está decidido desde 25/08 em
  # 2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md
  # ("cinco frentes o tocariam; cada uma entrega um manifesto").
  - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
---

# ONDA GATILHOS · 05 — "Meus efeitos" ganham tela

**O defeito em uma frase:** o formato do efeito próprio, com proveniência
obrigatória, está escrito e validado desde julho — e **nenhum módulo de `src/` o
importa**: é o defeito mais caro desta casa, *A CASA SABE E O PRODUTO NÃO FAZ*.

O contrato nomeia os dois botões com o arquivo e a linha:

> *"**Meus efeitos** (na mesma lista, abaixo dos prontos) — Reusa uma curva que
> ela mesma montou e nomeou · **existe no código e nunca teve tela**
> (`profiles/curva_propria.py:259`, `CatalogoCurvasProprias`)"*
> *"**Guardar este efeito com um nome** — (…) **existe no código e nunca teve
> tela** (`profiles/curva_propria.py:97`)"*
> — `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:271-272`

E o mockup:

> *"**"Meus efeitos" na mesma lista dos prontos** — `profiles/curva_propria.py`
> existe desde julho e nunca teve tela."*
> *"**Só "Guardar esse efeito"** sobrou de botão, como você pediu."*
> — `src/hefesto_dualsense4unix/interface/aba03.py:130-131`

## A medição

`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1557` e `:1567` já
registram as duas como dívida:

> *"MEDIDO em 22/08/2026: NENHUM módulo de `src/` importa
> `profiles/curva_propria.py`. (…) O QUE FECHA: a CR-04, que põe a mão dela no
> gatilho e produz a primeira curva; enquanto não houver curva, não há de onde
> carregar o catálogo."*

**A lápide citada acima muda em 29/08/2026, e esta sprint é a razão.** A CR-04
saiu do disco com a corrente do clean-room, por decisão dela
([o manifesto do corte](2026-08-29-O-CORTE-DO-CLEAN-ROOM-o-que-saiu-e-por-que.md))
— não há mais sprint futura esperando pela primeira curva. O texto de
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1557` perde o "O QUE
FECHA: a CR-04" e passa a nomear **esta** sprint, **no mesmo commit** em que as
três saem; esta sprint declara aquele arquivo em `nao_toca:` e por isso não o
conserta sozinha.

Esta sprint **é** o que fecha as duas: dá à mão dela o caminho de produzir a
primeira curva. As duas lápides saem daqui — e não à mão: quem as tira é
`test_nenhuma_lapide_sobreviveu_a_propria_cura`, reprovando se ficarem.

## Os TRÊS buracos de backend, nomeados

**1 · O catálogo não tem onde morar do lado da usuária.** O único caminho que
existe é `docs/data/curvas-proprias.json`, lido por
`scripts/gerar-tabela-de-curvas.py:57` — um arquivo **do repositório**, que a
usuária não tem. `utils/xdg_paths.py:113` já dá `profiles_dir()`; falta o irmão
para as curvas.

**2 · Falta o byte do MODO.** `CurvaPropria.curva` são **sete bytes**
(`CURVA_BYTES = 7`, `curva_propria.py:57`) — a largura do campo `forces` do
report de saída do DualSense, fato do protocolo. Mas o modo *Montar do zero*
(`Custom`) manda **um byte de modo E sete forças**
(`app/actions/trigger_specs.py:253-262`; `core/trigger_effects.py:564`). **Sem o
byte de modo, a curva guardada não se toca de volta.** O campo falta no formato.

O custo de acrescentá-lo é **zero hoje**, pela razão que o próprio módulo dá
(`curva_propria.py:34`): *"não existe nenhuma curva própria no repositório,
então não há nada para migrar. Em seis meses existiria. Decidido agora porque
agora é de graça."*

**3 · Guardar exige proveniência, e a tela não tem onde pedi-la.** O formato
recusa o que não tem `medido_por`, `medido_em`, `controle` e `nota` — e a nota
tem piso de 20 caracteres (`NOTA_MINIMA_DE_CARACTERES`, `:74`), justamente para
recusar preenchimento cerimonial. A `medido_em` não pode ser anterior a
25/07/2026 (`DATA_MINIMA_DE_MEDICAO`, `:70`). E o nome não pode ser um dos doze
nomes prontos do DSX (`_nomes_recusados_do_dsx`, `:82`). Um botão que só grave
"nome" **não instancia** — é o formato funcionando, não um defeito.

## O que entrega

**Backend**

- `profiles/catalogo_de_curvas.py` (novo) — carregar e gravar
  `CatalogoCurvasProprias` no disco da usuária, com o caminho vindo de
  `xdg_paths`. Arquivo ausente = catálogo vazio, nunca erro (é a regra que o
  `gerar-tabela-de-curvas.py:30-34` já fixou). Arquivo presente e inválido
  **reprova alto**;
- `utils/xdg_paths.py` — o caminho do catálogo, irmão de `profiles_dir()`;
- `profiles/curva_propria.py` — o campo do **modo**, obrigatório, com a mesma
  disciplina dos outros: sem ele não instancia.

**Frontal**

- a lista "Efeito pronto" da sprint 04 ganha, **abaixo dos prontos**, um
  separador `──── Meus efeitos ────` e as curvas do catálogo
  (`src/hefesto_dualsense4unix/interface/aba03.py:93-95`);
- escolher uma delas põe modo + sete bytes na coluna e segue o caminho que já
  existe (`_persist_params_to_draft` + live-preview) — nenhuma rota nova para o
  aparelho;
- o botão **"Guardar esse efeito"** (`trigger_guardar_efeito`, criado apagado
  pela sprint 02) acende e abre o diálogo que pede os quatro campos de
  proveniência, com a recusa do formato traduzida para português.

## Como se prova (o teste que morde)

`tests/unit/test_gatilhos_meus_efeitos_ganham_tela.py`:

1. **guardar → reabrir → tocar**: guardar uma curva com nome e proveniência,
   recarregar o catálogo do disco (`tmp_path`, nunca o `$HOME` de verdade) e
   escolhê-la na lista manda ao aparelho **os mesmos oito bytes** (modo + sete
   forças) que estavam na tela. Arranque o campo de modo e o teste reprova: a
   curva volta com o modo errado. Esta é a mordida;
2. **o dublê sabe RECUSAR, quatro vezes** — nota com 19 caracteres, `medido_em`
   em 24/07/2026, nome igual a um dos doze do DSX, e nome repetido no catálogo.
   As quatro levantam, e a mensagem que chega à tela está em português;
3. **catálogo ausente = lista só com os prontos**, sem erro e sem separador
   órfão;
4. **catálogo corrompido reprova alto** — e a aba não abre mentindo lista vazia;
5. **`grep -rn "curva_propria" src/` deixa de dar zero fora do próprio módulo** —
   e as duas lápides de
   `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1557,1567` saem por
   reprovação de `test_nenhuma_lapide_sobreviveu_a_propria_cura`, não por
   apagamento à mão.

## O que é dela decidir

1. **Quem é o `medido_por`?** O formato quer o nome de quem sentou com o
   controle. O diálogo pergunta a cada vez, ou lembra a resposta? Provisório:
   **pergunta e lembra**, editável. *PROVISÓRIO — decisão dela.*
2. **O `controle` vem preenchido?** A janela sabe o modelo e o transporte do
   alvo da fita e pode pré-preencher. Provisório: **pré-preenche, editável.**
3. **Escolher "Meu efeito" TROCA o modo da coluna?** O mockup desenha um efeito
   próprio selecionado com o modo *Metralhadora* aceso
   (`layout/03-gatilhos.html`, coluna esquerda), mas a curva guardada
   carrega o **seu** byte de modo. Provisório: **troca o modo**, e a grade
   acende o modo da curva. *PROVISÓRIO — decisão dela.*
4. **Onde mora o catálogo dela.** Provisório: junto dos perfis
   (`xdg_paths.profiles_dir()`), para viajar com eles no backup. O do
   repositório (`docs/data/curvas-proprias.json`) continua sendo o da casa, e
   esta sprint **não o toca**.
