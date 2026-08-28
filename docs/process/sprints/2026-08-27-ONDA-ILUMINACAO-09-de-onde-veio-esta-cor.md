---
sprint: ONDA-ILUMINACAO-09
# onda: ILUMINACAO (ver a nota de frontmatter da ONDA-ILUMINACAO-01)
posse:
  ILUM09:
    - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
cria:
  - tests/unit/test_ilum_09_de_onde_veio_esta_cor.py
bancada: false
depois_de:
  - ONDA-ILUMINACAO-07
  - ONDA-ILUMINACAO-08
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-ILUMINACAO-01
  - ONDA-ILUMINACAO-02
  - ONDA-ILUMINACAO-03
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-05
  - ONDA-ILUMINACAO-06
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/core/led_control.py
---

# ONDA ILUMINAÇÃO · 09 — De onde veio esta cor

**O defeito, em uma frase:** a cor muda sozinha na barra e a tela não diz por
quê — ela não escolheu aquele tom, e não há uma linha que conte quem escolheu.

## Onde está hoje, medido

A aba sabe distinguir os casos, mas **nenhum deles chega à tela como origem**:

- a cor automática por número: `player_slot_color`
  (`core/led_control.py:158`), consumida em `_refresh_lightbar_from_draft`
  (`lightbar_actions.py:602-604`) por `_auto_preview_slot` (`:415`);
- a cor escolhida à mão: o override por controle no rascunho;
- o co-op, que sobrescreve: `_coop_ligado` (`status_actions.py:433`), e a única
  frase que hoje o conta é a do **desenho**, não a da cor
  (`texto_do_desenho_aceso`, `lightbar_actions.py:303`);
- o deslocamento por colisão: nasce na ILUM-07;
- **o Estilo de Jogo não existe no código.** `grep -rln 'estilo_de_jogo\|EstiloDeJogo'
  src/` devolve **zero**. Ele é decisão dela
  (**D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL**, **D-CATORZE-ESTILOS-DE-FABRICA**)
  e mora noutra onda.

## O que entrega

**Uma linha só, na seção da cor**, dizendo de onde veio o que está aceso — e
apenas quando ela **não** escolheu à mão:

| origem | a linha |
|---|---|
| escolha dela | *silêncio* — o quadradinho marcado já diz |
| automática por número | "Esta cor é a do Controle 2." |
| Estilo de Jogo | "Esta cor veio do Estilo de Jogo *Terror*." |
| co-op | "O co-op está mandando a cor agora." |
| deslocada (ILUM-07) | "O Controle 2 já estava neste tom — usei o vizinho." |

Regras de construção, e as três são medidas:

1. **Uma função pura decide a frase** — entradas: rascunho, `state_full`,
   resultado do deslocamento. Nada de leitura de widget. É o que permite a
   mordida sem GTK;
2. **A ordem de precedência é única e declarada**: co-op → deslocamento →
   escolha dela → Estilo de Jogo → automática. Duas ordens no mesmo produto é o
   defeito que a L6 já pagou uma vez (`lightbar_actions.py:643-665`);
3. **Sem Estilo de Jogo no disco, a linha degrada** para a origem seguinte, e
   **não** inventa nome. A dependência é declarada, não fingida.

## A mordida

`tests/unit/test_ilum_09_de_onde_veio_esta_cor.py`, tudo sobre a função pura:

- **um caso por origem**, cada um com a frase exata;
- **silêncio quando ela escolheu**: a função devolve `None`, e o rótulo
  **esconde** — aviso sem conteúdo é ruído (mesma disciplina de
  `_atualizar_estado_da_barra`, `:670-676`);
- **a precedência**: co-op ligado **e** cor automática juntos ⇒ a frase é a do
  co-op. Inverta a ordem e reprova;
- **sem Estilo de Jogo**: com o campo ausente do rascunho, a frase é a da origem
  seguinte e **a palavra "Estilo de Jogo" não aparece**.

Arranque a precedência do co-op e o terceiro caso reprova dizendo "Esta cor é a
do Controle 2" enquanto o co-op manda.

## O que é dela decidir

1. **Esta linha é a mesma do "as luzinhas mostram o número N"?** São dois fatos
   (a cor e o desenho) com a mesma estrutura. O mockup traz a segunda embaixo dos
   botões de player (`novo-layout/04-iluminacao.html:719`) e **não desenha a
   primeira**. Duas linhas ou uma?
2. **O nome do estilo aparece em itálico**, como no contrato ("Estilo de Jogo
   *Terror*")? Texto de tela é dela.

## Dependência declarada, fora desta onda

O ramo "Estilo de Jogo" só acende quando a onda que constrói o Estilo de Jogo
fechar. Até lá a linha existe, funciona nas outras quatro origens, e o ramo fica
escrito com `PROVISÓRIO — depende do Estilo de Jogo`. **Não é motivo para
segurar a sprint** — as outras quatro origens já são reais hoje.

## Fontes

- contrato: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 4 — *"Uma
  linha nova diz de onde veio a cor"*;
- decisões: **D-ESTILO-DE-JOGO-E-UM-PRESET-UNIVERSAL**, **D-CATORZE-ESTILOS-DE-FABRICA**.
