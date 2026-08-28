---
# onda: NAVEGACAO  (o campo `onda:` não existe no analisador de
# `scripts/check_colisao_de_sprints.py:80` — vai como comentário até ele existir)
sprint: ONDA-NAVEGACAO-09
posse:
  NAV-I:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
    - src/hefesto_dualsense4unix/app/actions/input_actions.py
cria:
  - tests/unit/test_nav_a_tela_promete_o_que_cumpre.py
bancada: true
depois_de:
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
  - ONDA-GATILHOS-02
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-2  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - LEVA-DE-BACKGROUND-01  # fechou no merge 27e6c4a6 (as sete frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/app/app.py
---

# ONDA NAVEGAÇÃO · 09 — A tela promete o que cumpre

## O defeito, em uma frase

As três ações do teclado só mexem no rascunho e o **toast fala no pretérito**, as
duas barras trocam de destino conforme o mouse esteja ligado ou não, e o que
vinha da Emulação ("Suspender mouse e teclado", "Sair do modo jogo") chega sem
dono — a aba diz mais do que faz.

## O que está medido

- `app/actions/input_actions.py:552` `_persist_key_bindings_to_draft` — as três
  ações gravam no **rascunho**; nada vai para o disco até o rodapé. O toast, no
  entanto, é escrito no pretérito (`_toast_input`, `:606`).
- `app/actions/mouse_actions.py:495` `on_mouse_speed_changed` e `:508`
  `on_mouse_scroll_speed_changed` → `:523` `_send_mouse_param_async`: com o mouse
  ligado o valor vai **ao daemon agora**; desligado, fica no rascunho. Mesmo
  gesto, duas promessas, e a tela não diz qual.
- `app/actions/mouse_actions.py:579` `_refresh_mouse_view` — a linha de estado do
  mouse virtual (verde/laranja/vermelho, com o defeito nomeado e o gesto de
  conserto) **já existe e está boa**. Fica como está.
- `app/actions/mouse_actions.py:209` `_anotar_teclado_na_tela` +
  `input_actions.py:265` `frase_do_teclado_na_tela` — o estado do teclado na tela
  já existe; o que muda é que a **receita de instalação** (`wvkbd-mobintl`,
  `onboard`) vira dica e o estado fica.
- `gui/main.glade:3513` e `:3526` — "Suspender mouse e teclado" e "Sair do modo
  jogo", hoje na Emulação, com `emulation_gamemode_status_label` (`:3483`).

Decisão dela: **D-APLICAR-NAO-SALVA** (`/tmp/coleta/decisoes.md:187`) —
*"Aplicar aplica naquele momento pra aquele perfil mas não salva nada... Aí
Salvar Perfil aplica agora E salva."*

## O que entrega

1. **Todo toast desta aba fala no tempo certo.** O que só mexe no rascunho diz o
   que falta: *"vale ao clicar [Aplicar]; para guardar, [Salvar Perfil]"*. O que
   já foi ao controle diz que foi. Nenhum pretérito sobre coisa que não aconteceu.
2. **As duas barras têm uma promessa só.** Mesmo gesto, mesma frase — e a tela
   diz qual dos dois botões do rodapé falta, em vez de mudar de comportamento em
   silêncio.
3. **"Sair do modo jogo"** vem para o rodapé do quadro, ao lado do "Configurar o
   estilo Point-and-click" (é onde o mockup o põe). Ele é a saída de emergência
   de quem caiu no modo jogo pelo combo, e a linha de estado do modo jogo vem
   junto — botão sem estado ao lado não diz se há de onde sair.
4. **A frase "Guardados, sem linha na lista"** (as três regiões do touchpad)
   fica, como o mockup a põe: dentro da dica do teclado na tela. É o único aviso
   de que o perfil guarda algo que a tela não mostra, e some no dia em que a
   decisão 3 da ONDA-NAVEGACAO-04 fechar.
5. **A frase "Sem tecla (não digitam nada) — 10 deles já são do mouse"**
   (`input_actions.py:222` `frase_dos_botoes_sem_tecla`, `:431`
   `_atualizar_legenda`) vira **dica do rodapé da tabela**; a contagem continua
   viva, não vira texto morto.

## Como se prova (o teste que morde)

`tests/unit/test_nav_a_tela_promete_o_que_cumpre.py`:

1. **Nenhum pretérito falso:** para cada ação que só toca o rascunho, o toast
   contém a palavra que aponta o rodapé e **não** contém verbo no pretérito. A
   régua lista as ações; ação nova sem entrada reprova.
2. **A barra promete igual nos dois estados:** mover a velocidade do cursor com o
   mouse ligado e desligado produz a **mesma** frase de estado na tela.
3. **A régua sabe recusar:** um toast escrito corretamente no pretérito, para uma
   ação que de fato chegou ao daemon, **passa** — a régua não pode ser "proibido
   pretérito".
4. **O botão tem estado ao lado:** "Sair do modo jogo" só fica sensível quando o
   modo jogo está ligado, e o rótulo de estado diz qual é.
5. **A dica carrega a receita, a tela carrega o estado:** "wvkbd-mobintl" não
   aparece em rótulo visível e aparece na dica; a frase de estado do teclado na
   tela continua visível.
6. **A mordida:** devolver o toast antigo de uma das três ações do teclado e ver
   1 reprovar; devolver a bifurcação da barra e ver 2 reprovar. Colar as saídas.

## A prova de tela

`retratar_abas.py` antes e depois, e `retratar_dialogos.py` para a confirmação do
"Voltar ao padrão" (memória: *fotografar diálogo tem ferramenta* — conte
estados, não diálogos).

## O que é dela decidir

1. **"Suspender mouse e teclado" (o botão) vem?** (pergunta 2 do contrato). O
   mockup traz só o "Sair do modo jogo". O outro é o PS + Options, que já tem
   linha na área que ensina — trazer o botão é a mesma decisão em dois lugares.
2. **A frase das três regiões do touchpad fica na dica ou na tela?** Ela fica
   porque é a única confissão de que o perfil guarda algo invisível; a dúvida é
   se uma confissão dentro de um "?" ainda é confissão. A ressalva já registrada
   nesta casa (`/tmp/coleta/decisoes.md:127`) diz que o texto curto **tem de
   dizer que há mais**, senão a correção some para quem não passa o mouse.
</content>
