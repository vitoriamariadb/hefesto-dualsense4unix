---
sprint: MIGRA-VIBRACAO-08
estado: absorvida
onda: MIGRA-VIBRACAO
posse:
  MV8:
    - src/hefesto_dualsense4unix/interface/aba05.py
    - src/hefesto_dualsense4unix/app/telas/vibracao.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
cria:
  - tests/unit/test_migra_vibracao_08_o_banner_aponta_para_um_botao_que_existe.py
  - tests/unit/test_migra_vibracao_08_a_coluna_nao_afirma_o_que_o_mapa_desmente.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-VIBRACAO-01
  - MIGRA-VIBRACAO-04
  - MIGRA-VIBRACAO-06
  - MIGRA-VIBRACAO-02   # mesmo arquivo (`aba05.py`): série por R5
  - MIGRA-VIBRACAO-03   # idem
  - MIGRA-VIBRACAO-05
  - MIGRA-VIBRACAO-07
  # SÉRIE por R5 — donos declarados de `status_actions.py`, medido em 29/08
  - LEVA-3
  - LEVA-4
  - ONDA-CONTROLES-02
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-ILUMINACAO-03
  - ONDA-VIBRACAO-06
  # AS OUTRAS ONDAS DA MESMA LEVA que reivindicam os mesmos arquivos.
  # Lista de 29/08, e ela SE MOVE: as dez ondas estavam sendo escritas ao
  # mesmo tempo. Quem coordena reconfere com `check_colisao_de_sprints.py`
  # antes de despachar.
  - MIGRA-CONTROLES-01
  - MIGRA-CONTROLES-06
  - MIGRA-CONTROLES-07
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/core/
  - src/hefesto_dualsense4unix/profiles/schema.py
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 05). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA VIBRAÇÃO · 08 — o que a tela deixou de dizer, e o botão que sumiu

**O defeito em uma frase:** a página aprovada não tem **onde** o produto avise.

Medido no HTML: **zero `.avisos`, zero `.estado`, zero `.pendente`** na janela
da 05. Somem **quatro** canais de verdade — e um deles é um botão que o resto do
produto cita **pelo nome**.

## 1. O botão que não existe em nenhum dos dez mockups

`grep "Deixar o jogo" novo-layout/*.html` → **0 ocorrências, nos dez arquivos.**

Ele existe hoje: `rumble_actions.py:1092` `on_rumble_passthrough`,
`gui/main.glade:2028`. É o **antídoto do "Parar"** — o "Parar" trava (0, 0) e o
poll loop **re-afirma** o silêncio; o passthrough zera `rumble_active` e o jogo
volta a mandar. O próprio docstring conta por que ele nasceu:

> *"Sem este botão, depois de 'Parar' só dava pra devolver o rumble pela CLI — a
> auditoria flagou a lacuna de auto-suficiência."*

**E o banner do cabeçalho, visível de QUALQUER aba enquanto ela joga, manda
clicar nele pelo nome** — `status_actions.py:2260-2262`:

> *"A vibração está travada pela aba Rumble e o jogo não consegue mexer nela.
> Para devolver ao jogo: aba Rumble → “{BTN_GIVE_BACK_TO_GAME}”."*

**Entregar a aba assim é a repetição literal do RUM-01**, o defeito que esta
casa já pagou: *o texto mandava clicar "Devolver ao jogo" — botão que NÃO
existia*. A cura de então foi dar **um dono** ao rótulo
(`BTN_GIVE_BACK_TO_GAME`, `rumble_actions.py:108`) para as duas telas não
divergirem. **O dono continua correto; é a TELA que some.** Com quatro "Parar" e
nenhum antídoto, quatro controles ficam trancados em silêncio **sem volta pela
janela**.

*(E o mesmo texto ainda diz "aba Rumble", que passa a ser "Vibração" — a frase
tem um dono, e ele muda uma vez.)*

## 2. A linha de estado

Três verdades que somem: **travada em N/N**, **o jogo controla**, **o jogo ainda
não pediu**. Vêm de `rumble_passthrough` e `rumble_active`
(`daemon/ipc_handlers.py:3164-3169`) e são pintadas por
`rumble_actions.py:1221` `_update_rumble_state_label`. Com a trava virando mapa
(**05**), passam a ser **por coluna**.

## 3. O teto do orçamento, que apara a força em silêncio

O **"Bateria longa"** da aba Conexões limita em `0,3` **por `min`, nunca por
produto** (`core/rumble.py:58-102`, `_ORCAMENTO_COM_TETO` / `_sob_o_teto`), e é
a **única** linha daquela tabela com teto real. **A coluna vai mostrar "Máximo,
150%" enquanto o motor recebe 30%.**

A frase que conta isso **já existe e tem dono**:
`rumble_actions.py:291 texto_do_alcance_da_intensidade` e `:370
texto_do_teto_do_orcamento`, hoje pintadas no rótulo
`gui/main.glade:1916 rumble_policy_aviso` — **que sai com a página, na 01**.

## 4. A recusa do Modo Nativo

`NATIVO-RUMBLE-01` (19/08): a recusa do daemon vem no **corpo** da resposta
(`status`), não como erro JSON-RPC, e chega hoje pelo **toast, com motivo**
(`rumble_actions.py:993-998`). Sem área de aviso, a aba recusa em silêncio — que
é *o produto responde pelo transporte, não pelo efeito*, de volta.

## 5. E a coluna não pode afirmar o que o mapa desmente

`docs/data/mapa-controles.csv`, `vibracao.rumble.passthrough@dualsense`:
`radio_de_onde_sei = inferido-do-codigo`, ressalva *"Implementado sem gate, mas
NÃO MEDIDO por Bluetooth"*. **Duas das quatro colunas do mockup são BT**, e a
coluna vai acender o punho dizendo que o jogo está tremendo aquele controle.

## O que entrega

1. **Uma área de aviso na página, com endereço** (`[data-papel="avisos"]`,
   vocabulário da **02**), e a regra que evita a bagunça: **um aviso na coluna
   quando o motivo é da peça; um aviso da mesa quando o motivo é da mesa.**
2. **A linha de estado por coluna**, com as três frases que já existem.
3. **O sufixo do teto na linha da força**, com a frase que já existe — **um dono
   só**, e o dono é `texto_do_alcance_da_intensidade`. Digitá-la na página seria
   a segunda verdade.
4. **O toast continua sendo toast, e a área NÃO o duplica.** Duas superfícies
   dizendo a mesma coisa é como elas divergem.
5. **O botão**: uma das duas saídas da decisão dela, abaixo. **Nenhuma é do
   executor.**

## Como se prova (a mordida)

`tests/unit/test_migra_vibracao_08_o_banner_aponta_para_um_botao_que_existe.py`

- **Com o daemon travado em silêncio, o banner do cabeçalho cita
  `BTN_GIVE_BACK_TO_GAME` e a página TEM um elemento cujo texto é exatamente
  esse valor.** *Arranque:* tire o botão da página e veja reprovar — é
  literalmente o RUM-01.
  **A régua LÊ a constante do produto; não a digita.** Onze réguas desta casa
  reprovaram a melhora em vez do defeito em 26/08, todas pela mesma forma:
  *digitavam o que deviam LER*.
- **E a régua vale para a outra saída também:** se a decisão dela for "o Parar
  devolve ao jogo", o botão de nome `BTN_GIVE_BACK_TO_GAME` deixa de existir
  **e o banner deixa de citá-lo, na mesma mudança**. A régua exige a coerência,
  não uma das duas telas.
- **Teto:** com `orcamento="economia"`, a coluna em "Máximo" mostra a frase do
  teto **e** o número efetivo. *Arranque:* pinte só o "150%" e veja reprovar.
- **Modo Nativo:** o gesto recusa, o motivo aparece, e **aparece uma vez só** —
  não no toast e na área ao mesmo tempo.
- **A área some quando não há o que dizer**, e a grade não muda de altura por
  isso. As sete alturas de linha da `.vib` são fixas e compartilhadas pelas
  cinco colunas (`aba05.py`, `--r-des` … `--r-acoes`); um aviso que empurra as
  linhas quebra o alinhamento que ela cobrou
  (`O-REFINAMENTO-DE-ALINHAMENTO-QUE-ELA-EXIGE`).

`tests/unit/test_migra_vibracao_08_a_coluna_nao_afirma_o_que_o_mapa_desmente.py`

- **Para um controle no rádio, a coluna não diz "o jogo está tremendo este
  controle"** sem a palavra do mapa. A régua **LÊ** a célula `radio_de_onde_sei`
  de `docs/data/mapa-controles.csv` e reprova afirmação forte sobre um canal
  `inferido-do-codigo`. *Arranque:* troque o texto para uma afirmação forte e
  veja `scripts/check_paridade_transporte.py` reprovar junto — **duas réguas
  independentes é o que revela**, e é regra desta casa.

## O que é dela decidir — e é o maior "dela" desta onda

1. **O botão "Deixar o jogo controlar a vibração" volta à aba, ou o "Parar"
   passa a devolver ao jogo?** As duas consequências, escritas:
   * **(a) o botão volta.** São 4 botões a mais na tela que ela aprovou (um por
     coluna), ou 1 da mesa acima da grade. O desenho muda; `PROVA-DE-TELA-01`.
   * **(b) o "Parar" devolve.** A tela não muda, e o produto perde a distinção
     entre *travar em silêncio* e *devolver ao jogo* — que são coisas
     diferentes: a primeira é o único jeito de calar um controle enquanto um
     jogo insiste em tremê-lo. Se ela escolher esta, o `rumble.stop` e o
     `rumble.passthrough` viram o mesmo gesto na janela, e a nota datada disso
     entra no docstring de `on_rumble_stop`.
   * **A terceira, que não é saída:** entregar sem decidir. Aí a aba nasce com
     quatro botões que trancam quatro controles e um banner apontando para o
     nada.
2. **Onde a área de aviso mora**, já que ela aprovou uma tela sem ela: acima da
   grade (uma linha para a mesa), dentro da coluna (uma oitava linha na grade,
   e as sete alturas mudam), ou no rodapé do quadro. **O preço de cada uma é em
   altura**, e a janela do produto tem 757 px.
