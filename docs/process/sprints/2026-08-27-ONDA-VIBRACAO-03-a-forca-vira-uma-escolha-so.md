---
sprint: ONDA-VIBRACAO-03
# onda: ABA-VIBRACAO
posse:
  V3:
    - src/hefesto_dualsense4unix/app/actions/rumble_actions.py
    - src/hefesto_dualsense4unix/profiles/schema.py
cria:
  - tests/unit/test_a_forca_da_vibracao_e_uma_escolha_so.py
  - tests/unit/test_a_barra_da_forca_aplica_ao_soltar.py
bancada: false
depois_de:
  - ONDA-VIBRACAO-02
  - EMULACAO-UM-DONO-SO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/app/draft_config.py
---

# ONDA VIBRAÇÃO · 03 — a força vira uma escolha só, para em 150, e aplica ao soltar

Três defeitos no mesmo controle. Vão juntos porque são a mesma linha de código.

## Defeito 1 — quatro interruptores independentes, e um quinto estado invisível

`rumble_policy_economia/balanceado/max/auto` são quatro `GtkToggleButton`
soltos (`main.glade:1752-1783`). Mover a barra para fora dos degraus **apaga os
quatro** (`rumble_actions.py:846-853`) e a palavra "personalizado" não existe em
lugar nenhum da tela. A usuária fica olhando quatro botões apagados sem saber
que escolheu algo, nem o quê — está escrito na própria docstring desde 11/08
(`rumble_actions.py:814-824`) e nunca virou tela.

**Entrega:** os quatro viram um `SegmentedSelector`
(`app/widgets/segmented_selector.py`, o widget desta casa — o combo do GTK é
inutilizável na COSMIC, `FEAT-DSX-COMBO-TO-SEGMENTED-01`), e o **quinto estado
ganha nome**: a linha `Personalizado` da coluna da direita acende quando nenhum
dos quatro vale, e apaga quando um vale. **Não há um quinto botão** — o rótulo
`Personalizado` é o título da linha da barra (`hoje.md:319`).

## Defeito 2 — a barra vai até 200 e o Máximo é 150

Palavra dela (`hoje.md:273`):

> *"e tá setado ali em cima como 150% se isso é o máximo então o slicer vai até
> aí apenas."*

Hoje `RUMBLE_CUSTOM_MULT_MAX = 2.0` (`profiles/schema.py:76`) e o `upper` do
`rumble_policy_adj` é 200 (`main.glade:37-43`). O comentário do glade defende os
200 com o preço medido — *"de 170 para cima a conta satura em 255 e um terço da
faixa que o jogo pede vira força constante"*. **É exatamente o argumento dela,
pela outra ponta:** uma faixa cujo terço final não faz diferença é uma faixa que
mente. Precedente não é trava (O-PROJETO-E-VIVO).

**Entrega:** `RUMBLE_CUSTOM_MULT_MAX = 1.5`. O número tem **um dono** e é este —
o handler `rumble.policy_custom`, o `RumbleDraft.custom_mult` e o slider derivam
dele, e `tests/unit/test_rumble_mult_um_dono.py` reprova quem o redigitar
(HARM-19). O `upper=150` do glade é da ONDA-VIBRACAO-02; esta sprint garante que
o portão do dono único fecha com o número novo.

**A compatibilidade é metade da entrega.** Perfis dela com `custom_mult` entre
1,5 e 2,0 **hoje carregam** e passariam a levantar `ValidationError` na borda do
esquema — um perfil dela que deixa de abrir é o defeito da GATILHOS-APLICADO-01
de novo. `RumbleConfig` e `ControllerRumbleOverride` passam a **aparar** o valor
em 1,5 em vez de recusar, com uma linha no log dizendo o que foi aparado. O
comentário de `schema.py:68-76` recebe a nota datada: o 2,0 foi decisão medida e
sai por decisão dela, com data.

## Defeito 3 — um comando por pixel

`on_rumble_policy_slider_changed` está ligado ao `value-changed`
(`main.glade:1851`). Arrastar de 100 a 200 emite **dezenas** de chamadas de IPC
bloqueantes e **dezenas** de toasts em fila.

**Entrega:** o mesmo gesto da Luminosidade da Iluminação, que já resolveu isto —
`lightbar_actions._fiar_aplicar_ao_soltar:770-812`: o `value-changed` só
**marca** (pinta o número, acende o `Personalizado`) e quem escreve é o
`button-release-event`. Copie inclusive a ressalva de lá
(`lightbar_actions.py:836`): devolver `True` num `button-release-event` de
`GtkRange` **rouba o gesto** e a barra trava.

O `teto` (`máx`) da linha continua vindo de `_pintar_a_linha_do_teto:516`, agora
como o sufixo da grade em vez de uma linha própria.

## Como se prova (os testes que MORDEM)

`test_a_forca_da_vibracao_e_uma_escolha_so.py`
- clicar `Máximo` deixa **um** id ativo no seletor e a linha `Personalizado`
  **apagada**; mover a barra para 1,20 deixa **zero** ativos e a linha
  `Personalizado` **acesa com "120%"**. Arranque: volte os quatro toggles soltos
  e veja o teste reprovar com zero ativos nos dois casos.
- `RumbleConfig(policy="custom", custom_mult=2.0)` **carrega** e sai valendo 1,5;
  `custom_mult=1.5` passa intacto. Arranque: troque o aparar por `raise` e veja
  reprovar com `ValidationError`.
- `RUMBLE_CUSTOM_MULT_MAX == 1.5` e `test_rumble_mult_um_dono.py` continua verde.

`test_a_barra_da_forca_aplica_ao_soltar.py`
- vinte `value-changed` seguidos + **um** `button-release-event` produzem
  **exatamente uma** chamada de `rumble_policy_custom` e **um** toast. Arranque:
  religue o `value-changed` ao envio e veja o contador bater 20.
- o handler de `button-release-event` devolve `False` (a ressalva do
  `lightbar_actions.py:836`).

## O que é dela decidir

1. **O `Auto` continua na fileira?** Ele não é um degrau de força: varia com a
   bateria do controle **primário** (`core/rumble.py:_effective_mult`) e por isso
   o esquema o **recusa por unidade** (`schema.py:800-810`). Numa fileira de
   escolha única, ele é o único item cujo alvo é sempre a mesa. Fica, com dica,
   ou vira uma caixa à parte?
2. **Aparar em 1,5 ou avisar?** Um perfil dela com 2,0 vira 1,5 em silêncio. É
   isso, ou a aba diz "este perfil pedia 200% — o máximo agora é 150%"?

## O que esta sprint NÃO faz

Não dá endereço à força (é a 04) e não mexe no glade (é a 02).
