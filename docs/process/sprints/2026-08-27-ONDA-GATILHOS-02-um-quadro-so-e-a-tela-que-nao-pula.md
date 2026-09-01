---
# onda: GATILHOS
sprint: ONDA-GATILHOS-02
posse:
  G2:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/gui/theme.css
    - src/hefesto_dualsense4unix/app/actions/triggers_actions.py
    - src/hefesto_dualsense4unix/app/widgets/segmented_selector.py
    - tests/unit/test_gatilho_palavra_rotulos.py
    - tests/unit/test_triggers_actions.py
cria:
  - tests/unit/test_gatilhos_um_quadro_so.py
bancada: false
depois_de:
  - ONDA-GATILHOS-01
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/trigger_specs.py
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/profiles/
---

# ONDA GATILHOS · 02 — um quadro só, e a tela que não pula

**O defeito em uma frase:** a aba de hoje são **duas molduras**, quatro botões
que o mockup apagou, e um vazio de mais de 300 px por coluna entre a grade e o
pé — e trocar de modo faz a tela pular.

A foto de hoje é `docs/usage/assets/readme_gatilhos.png`: dois `GtkFrame` ("L2
(gatilho esquerdo)" / "R2 (gatilho direito)"), grade de 19 modos em **três**
colunas, a frase em itálico *"Sem resistência."* numa linha própria, e no pé
"Aplicar em L2" + "Desligar". O alvo é `layout/03-gatilhos.html`.

**`main.glade` é recurso de bancada** (uma sprint por vez): esta é a **única**
da onda que o abre. As sprints 03, 04 e 05 só tocam Python, e é por isso que ela
cria aqui todos os buracos de que elas precisam.

## O que entrega

**1 · Um quadro só.** As duas molduras viram um `GtkFrame` com o título que ela
deu — **"Seleção de Gatilho"** (`layout/_ferramentas/aba03.py:107`) — e
dentro dele duas colunas separadas por um filete, com os títulos
*"Gatilho esquerdo `L2`"* e *"Gatilho direito `R2`"* (`aba03.py:78`).

Ela nomeou o que saiu:

> *"O título é "Seleção de Gatilho" — "Quanta força o gatilho faz na mão" era
> nome ruim e saiu."* — `aba03.py:120`

**2 · Os quatro botões saem.** `trigger_left_apply`, `trigger_right_apply`,
`trigger_left_reset`, `trigger_right_reset` (`gui/main.glade:936, 950, 1091,
1105`) e os quatro handlers públicos que os serviam. O motivo, dela:

> *"Saiu "Mandar de novo para o controle" — o Aplicar do rodapé já faz isso."*
> *"Saiu o "Desligar" de cada coluna — Desligado é o primeiro dos 19 modos."*
> — `aba03.py:122-124`

O "Aplicar" do rodapé já manda o rascunho inteiro, gatilhos incluídos
(`app/actions/footer_actions.py:715` → `profile.apply_draft`), e o "Desligado"
já solta a trava desde a 01. Nada se perde. `_apply_trigger` e `_reset_trigger`
**continuam existindo** como métodos — quem os chama é o live-preview e o modo
Desligado, não mais um botão.

**3 · A grade vira duas colunas.** `_WRAP_COLUNAS` em
`app/widgets/segmented_selector.py:32` é `3`; o mockup usa
`grid-template-columns:1fr 1fr` (`aba03.py:14`) — 19 modos em 10 linhas.

**Trava medida, e ela é obrigatória:** `tests/unit/test_gatilho_palavra_rotulos.py:120`
carrega `LIMITE_DE_CARACTERES = 22` com o aviso *"Medido no piso de 1040px com a
grade de três colunas. Se um dia o piso passar a ter quatro colunas, este número
tem de ser REMEDIDO, não deduzido."* Duas colunas dão **mais** largura por
botão, não menos — mas o número continua tendo de ser **remedido**, não
deduzido, e o mesmo arquivo lista as três armadilhas de medição já pagas em
07/08 (quebra é por palavra, medir um lado só mente, `apply_theme` compounda).

**4 · A caixa de ajustes ganha altura fixa.** É o item do contrato:

> *"A tela para de pular. A caixa de ajustes ganha altura fixa e a linha "Efeito
> pronto" ocupa o lugar dela sem brotar."*
> — `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:257`

O mockup fixa `min-height:132px` (`aba03.py:26`) e, quando o modo não tem
parâmetro, escreve no lugar **"Este modo não tem o que ajustar."**
(`aba03.py:75`) em vez de deixar o vazio.

**5 · A frase em itálico sai da tela.** `trigger_<side>_desc`
(`gui/main.glade:874, 1034`) some: a descrição de cada modo já é a **dica** do
botão dele desde a T8 de 25/08 (`triggers_actions.py:116-131`), lida **antes**
do clique — e clicar já manda o efeito para a mão dela.

**6 · O "?" do quadro nasce.** Ao lado do título, um ícone sensível com o texto
que ela aprovou (`aba03.py:109-117`): o que é gatilho adaptativo, o aviso de que
passar o mouse é de graça e clicar não é, e a ressalva que não pode sumir —
*"O controle não responde de volta (...) esta tela diz o que o Hefesto
**escreveu**, nunca o que o aparelho confirmou."*

Trava do GTK3, registrada no contrato (P3): **widget insensível não dispara
tooltip** — por isso a explicação mora num ícone sensível ao lado do título, não
no widget apagado.

**7 · Os buracos para as sprints seguintes**, vazios e nomeados:

| id novo no Glade | quem preenche |
|---|---|
| `trigger_<side>_pronto_slot` (linha "Efeito pronto:", **sempre** presente) | 04 |
| `trigger_<side>_ajustes_moldura` (a caixa de altura fixa) | esta |
| `trigger_<side>_ajustes_vazio` (o rótulo "Este modo não tem o que ajustar.") | esta |
| `trigger_recibo` (a linha de recibo no pé do quadro) | 03 |
| `trigger_guardar_efeito` (botão "Guardar esse efeito") | 05 |

Nascem com `visible=False` os dois últimos, e a sprint dona os acende. Slot
vazio na tela é defeito; slot vazio **declarado** é a costura desta casa
(`trigger_left_mode_slot` é o precedente, `main.glade:837`).

## Os arquivos que toca

- `src/hefesto_dualsense4unix/gui/main.glade` — faixa **776–1135** (a página
  `tab_triggers_box` inteira). Nenhuma outra linha do XML.
- `src/hefesto_dualsense4unix/gui/theme.css` — a coluna, o filete, a altura fixa.
- `src/hefesto_dualsense4unix/app/actions/triggers_actions.py` — os handlers dos
  quatro botões saem; `_rebuild_params` para de escrever em `..._desc` e passa a
  acender/apagar o rótulo do vazio.
- `src/hefesto_dualsense4unix/app/widgets/segmented_selector.py` — `_WRAP_COLUNAS`.
- `tests/unit/test_gatilho_palavra_rotulos.py` — o limite **remedido**.
- `tests/unit/test_triggers_actions.py` — o que apontava para os botões que saíram.

## Como se prova (o teste que morde)

`tests/unit/test_gatilhos_um_quadro_so.py` — leitura do Glade como XML, sem GTK,
mais um teste de geometria sob `Gtk.OffscreenWindow` (**nunca `Gtk.Window`**: sob
Xvfb não há gerenciador de janelas e ela fica 1x1 para sempre —
`docs/process/COMO-OLHAR-A-TELA.md`).

1. **um `GtkFrame` na página, não dois**, e o rótulo dele é "Seleção de
   Gatilho". Arranque a cura (devolva as duas molduras) e o teste reprova
   dizendo `2`;
2. **os quatro ids não existem mais** no XML, e **nenhum `<signal>` órfão** ficou
   apontando para handler removido — é o erro que só aparece quando a janela
   abre;
3. **a altura da caixa de ajustes é a MESMA** com "Desligado" (zero barras) e
   com "Metralhadora" (quatro barras). Este é o teste que morde de verdade:
   arranque o `min-height` e a diferença volta a ser de centenas de pixels.
   Meça com `size_request`/`get_allocation` depois de um `check_resize()` — sem
   ele o widget injetado mede 1x1 (armadilha registrada em
   `test_gatilho_palavra_rotulos.py:52`);
4. **o modo sem parâmetro mostra a frase** "Este modo não tem o que ajustar." e
   o modo com parâmetro **não** a mostra;
5. **nenhum rótulo de modo quebra em duas linhas** com a grade de duas colunas,
   no piso de 1040 px, com **uma medição por processo** (`apply_theme` compounda
   — `app/theme.py:154`);
6. **a dica de cada um dos 19 botões continua sendo a `description` do `PRESETS`**
   — a T8 não pode morrer na mudança de moldura.

## O que é dela decidir

1. **A fita, esmaecida ou viva nesta aba?** O comentário do mockup diz
   *"A fita fica ESMAECIDA aqui: nada nesta aba ajusta por controle"*
   (`layout/03-gatilhos.html:431`), mas o markup logo abaixo (`:435`)
   **não** aplica a classe `inerte`, e o produto de hoje já manda o gatilho por
   MAC (`triggers_actions.py:_persist_params_to_draft`, PERFIL-04/05). O
   comentário e o desenho discordam. Esta sprint segue o **markup** (fita viva)
   e marca o ponto: *PROVISÓRIO — decisão dela*.
2. **Ler um modo custa aplicá-lo na sua mão.** Pergunta 1 do contrato
   (`O-REDESENHO:299`), ainda sem resposta: o clique nos 19 botões manda o
   efeito 300 ms depois. O mockup mantém o toque ao vivo e explica isso na dica
   do "?" — esta sprint **não muda** o live-preview. Se ela quiser o contrário,
   é outra sprint.
