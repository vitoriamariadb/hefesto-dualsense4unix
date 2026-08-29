---
sprint: MIGRA-CONTROLES-05
onda: MIGRA-CONTROLES
posse:
  MC5:
    - scripts/telas/aba02.py
    - src/hefesto_dualsense4unix/gui/telas/02-controles.html
cria:
  - tests/unit/test_migra_controles_05_a_mesa_e_a_real.py
bancada: false
depois_de:
  # SÉRIE: dividem o gerador e a página.
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-04
  # A ponte é quem clona o molde com o dado vivo.
  - MIGRA-CONTROLES-03
nao_toca:
  - scripts/telas/monta.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA CONTROLES · 05 — A mesa é a dela, e zero é um estado

**Ordem dela, 29/08:** *"o layout se adapta a medida dos controles que eu tenho
(…) e se eu comprar outros dualsense eles aparecem também seguindo a lógica que
montamos no `mapa-do-controle.html`."*

## O defeito

**A mesa está escrita à mão, e ela tem dois controles.** `monta.MESA`
(`novo-layout/_ferramentas/monta.py:138-147`) é uma lista literal de **quatro**:
Cosmic Red USB, Starlight Blue BT, Galactic Purple BT e White USB, cada um com
jogador, cor, transporte e máscara digitados.

O produto já sabe a mesa de verdade, e sabe há muito tempo:

| o que | onde |
|---|---|
| a lista dos controles | `daemon.state_full → controllers[]`, montada em `core/backend_pydualsense.py:5100-5115` (`index`, `connected`, `transport`, `is_primary`, `uniq`, `battery_pct`) e enriquecida em `daemon/ipc_handlers.py:3176` |
| o número do jogador | `daemon/subsystems/coop.py::resolve_player_numbers`, aplicado em `ipc_handlers.py:2494-2501` |
| a contagem, já usada na janela | `app/mesa.py:28` (`controles_conectados`) e `:83` (`contagem_de_controles`) |

### E há um teto que ninguém escreveu em prosa: **a mesa para em quatro**

A aritmética do acordeão é um portão dentro do gerador
(`novo-layout/_ferramentas/aba02.py:803-810`):

```
PARA_O_CARD = 461 − 24 − (N−1)×34 − (N−1)×9  =  437 − 43×(N−1)
assert PARA_O_CARD >= 301   # o card aberto não encolhe
```

Resolvendo: **N ≤ 4.** Com cinco controles sobram **265 px** para um card que
precisa de **301**, e o gerador **PARA** — que é o comportamento certo (ele foi
escrito para não entregar tela que esconde controle calada), mas quer dizer que
*"se eu comprar outros DualSense eles aparecem também"* **não é verdade a partir
do quinto** com a geometria de hoje.

### E zero não para: zero entrega absurdo

Com a mesa vazia, `FECHADOS = len(MESA) − 1` vale **−1**, o `assert` passa com
folga sobrando, e a página sai com um quadro vazio e uma fita com o chip
"Todos" sozinho. **A conta não quebra — ela mente.** Zero controles é estado
legítimo (ela desliga os dois e a janela continua aberta), e o mockup não o
desenha.

## O que entrega

1. **A página passa a ter MOLDE, não elenco.** O artefato versionado carrega:
   - um `<template>` com **um** cartão, com todos os endereços da
     [MIGRA-CONTROLES-04](2026-08-29-MIGRA-CONTROLES-04-cada-valor-da-tela-ganha-endereco.md);
   - o estado de **mesa vazia**, escrito na página (não montado em código);
   - a fita e o acordeão preparados para N chips.

   A ponte clona o molde uma vez por controle presente e preenche. **O mockup
   com os quatro continua saindo do MESMO gerador**, para a bancada e para o
   olho dela — e um portão confere que o cartão do molde e o cartão do mockup
   são a mesma marcação, senão as duas divergem na primeira mudança.

2. **A identidade no DOM não é o MAC.** O `uniq` é endereço de rádio, e esta
   casa tem duas réguas independentes contra endereço em arquivo versionado
   (`tests/unit/test_docs_mac_anonimato.py` e `scripts/check_endereco_de_radio.py`).
   O `data-ctl` recebe um **identificador de sessão** — o `index` do
   `controllers[]`, ou uma alça opaca —, e o `uniq` fica só do lado do Python.
   A página é artefato versionado e as fotos de `retratar_abas.py` também: um
   MAC no DOM é um MAC a um `title=` de distância de virar pixel.

3. **A aritmética vira função de N**, e o portão do gerador continua sendo um
   portão: com N acima do teto ele **para**, dizendo o número — nunca entrega
   uma tela que esconde um controle.

4. **O estado de mesa vazia diz o que fazer.** Regra desta casa: *toda frase de
   diagnóstico diz o quê, por quê e o que fazer.* O texto é dela (ver abaixo).

## Como se prova (a mordida)

`tests/unit/test_migra_controles_05_a_mesa_e_a_real.py`:

- **um `state_full` com DOIS controles produz DOIS cartões**, com o rótulo, o
  transporte e o número de jogador vindos do dado — nada digitado. **Troque o
  `state_full` para três e veja o teste exigir três**;
- **zero controles produz o estado vazio**, e ele é **visível**: nem quadro em
  branco, nem fita com "Todos" sozinho. **Arranque o estado vazio e veja a
  régua reprovar o quadro mudo** — é este o teste que o defeito de hoje pede,
  porque hoje zero não levanta nada;
- **um controle não desenha "Todos"**: abrir os "todos" de um só é gesto sem
  função;
- **o teto é medido, não suposto**: um teste que sobe N até o gerador parar e
  afirma **onde** ele para. Se alguém mudar `ALTURA_DO_CARD` ou `VISIVEL`, o
  número muda e o teste conta a verdade nova em vez de repetir "4";
- **o molde e o mockup são a mesma marcação**: comparação estrutural do cartão
  do `<template>` com o primeiro cartão do mockup de quatro. **Mude um dos dois
  e veja reprovar** — é a régua que impede a divergência que a mesa escrita à
  mão criou;
- **nenhum endereço de rádio na página nem na foto**: `check_endereco_de_radio.py`
  sobre o `.html` versionado, e o teste de anonimato sobre o PNG que
  `retratar_abas.py` gerar. Ponha um `uniq` num `title=` e veja reprovar.

**O daemon vivo é mais velho que o código.** Com install editable, campo novo no
`state_full` só existe no próximo `start` — e o sintoma é a **AUSÊNCIA de dado**,
não um erro. Quem testar sem reiniciar o daemon vai ver a mesa vazia e concluir
que a ponte quebrou. Já aconteceu nesta casa.

## O que é dela decidir

- **O que a aba diz com a mesa vazia** — a frase e o desenho. É a pergunta 2 do
  índice da ONDA-CONTROLES e continua aberta.
- **Cinco controles é caso a servir?** Com a geometria aprovada, o quinto não
  cabe. As saídas custam coisas diferentes e todas mexem no que ela aprovou: o
  card aberto encolher (ela já reprovou encolher: *"as cinco colunas param todas
  em ~225 px de conteúdo natural"*), a caixa rolar também no estado de abertura,
  ou o quinto entrar sempre fechado. **Não escolha por ela.**
- **O que aparece de um controle que a mesa conhece e que está DESLIGADO.**
  `controles_conectados` filtra por `connected`; o mockup só desenha presentes.
  Some da tela, ou aparece apagado com a última bateria conhecida?
