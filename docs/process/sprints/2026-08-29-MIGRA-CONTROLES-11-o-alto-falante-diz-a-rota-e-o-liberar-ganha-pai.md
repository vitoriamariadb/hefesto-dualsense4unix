---
sprint: MIGRA-CONTROLES-11
estado: absorvida
onda: MIGRA-CONTROLES
posse:
  MC11:
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
    - src/hefesto_dualsense4unix/app/actions/controles_web.py
cria:
  - tests/unit/test_migra_controles_11_a_rota_em_vigor.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-06
  - MIGRA-CONTROLES-08
  # SÉRIE: divide `controller_card.py` com esta.
  - MIGRA-CONTROLES-10
  # SÉRIE por R5, e a ONDA-CONTROLES-05 é a sprint que esta SUBSTITUI:
  # o diagnóstico dela sobrevive, a entrega em GTK não.
  - ONDA-CONTROLES-05
  # COLISÃO DE ARQUIVO DECLARADA: `controller_card.py`.
  - LEVA-3
  - ONDA-CONTROLES-01
  - ONDA-CONTROLES-03
  - ONDA-CONTROLES-04
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-09
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/core/
  - src/hefesto_dualsense4unix/gui/main.glade
  - docs/data/mapa-controles.csv
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 02). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA CONTROLES · 11 — O alto-falante diz a rota, e o "Liberar" ganha pai

**Esta sprint substitui a
[ONDA-CONTROLES-05](2026-08-27-ONDA-CONTROLES-05-o-seletor-que-nunca-soube-a-rota.md).**
O diagnóstico dela continua inteiro e não se repete aqui; o que caducou é a
entrega, que era consertar widgets GTK que vão deixar de existir.

## O defeito

Três, no mesmo bloco, e os três continuam vivos na árvore de 29/08.

### 1. O seletor nunca pinta a rota em vigor

`_speaker_canal_pintando` nasce `False` (`app/widgets/controller_card.py:2388`)
e é **lido** em `:4085` — e **não vira `True` em lugar nenhum da árvore**.
Ele é a guarda que existiria para impedir o eco ao *popular* o seletor com o
estado do daemon; como ninguém popula, ela nunca precisou disparar.

**Consequência: o seletor nasce sem nada marcado.** A tela mostra dois botões e
não diz qual está valendo.

### 2. O seletor só existe no cartão de UM controle

Ele é criado e conectado em `:3773-3774`, dentro do ramo **não compacto** — o
cartão de um controle só. Com dois ou mais na mesa, `self._compact` é verdadeiro
e **não há seletor de rota nenhum**. O mockup desenha os dois botões
("Sons do jogo" / "Todo o som do PC") nos **quatro** cartões.

### 3. O "Liberar" é criado, tem sensibilidade calculada, e não tem pai

- criado em `:3577`, com o `clicked` ligado em `:3578`;
- empacotado **só** em `:3668` — dentro do ramo `if self._compact:` (`:3625`);
- no ramo não compacto, em `:3776`, **só `botao_mudo` é empacotado**;
- e mesmo assim ele é mantido em `self._speaker_botao_devolver` (`:3817`) e tem
  a sensibilidade recalculada a cada tique (`:5114`, `:5152`).

**Ou seja: o produto liga e desliga, dez vezes por segundo, um botão que a tela
de um controle nunca mostra.**

E há uma afirmação errada **no próprio código**, que é o que fez isto durar: o
comentário de `:3660-3662` diz *"No card de um controle — a tela que ela usa com
um DualSense — os dois rótulos aparecem inteiros sempre que há posse"*. **O
segundo botão não aparece ali de jeito nenhum.** Por ser fato errado, o
comentário se substitui junto com a cura.

## O que a tela vai poder dizer, e o mapa manda calar metade

`docs/data/mapa-controles.csv`, DualSense — e as três linhas **não dizem a mesma
coisa**, o que é exatamente o ponto:

| chave | cabo | rádio |
|---|---|---|
| `audio.alto_falante` (som saindo) | **parcial** | **não** |
| `audio.alto_falante.rota` (`OUTPUT_PATH_SEL`, `common[7]` bits 4-5) | sim | **sim** |
| `audio.alto_falante.volume` (`common[5]`) | sim | **sim** |

**No rádio o produto escreve o byte e nenhum som sai.** É o padrão
`O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO` em forma pura, e a tela
não pode desenhar o bloco do som igual nos quatro cartões — dois deles são BT.
**Como a aba mostra isso é da
[MIGRA-CONTROLES-13](2026-08-29-MIGRA-CONTROLES-13-o-que-o-mapa-desmente-nao-se-pinta-como-vivo.md);
esta sprint entrega o dado que aquela precisa.**

## O que entrega

1. **A rota em vigor vira dado publicado**, ao lado de `volume` e `muted`, e
   com a **procedência**: lida do controle, ou apenas o último pedido do
   Hefesto. Hoje o `state_full` só traz `speaker {volume, muted}`, e **só
   quando o Hefesto tem a posse do registrador**
   (`daemon/ipc_handlers.py:3345`) — sem posse, a tela não sabe nada e tem de
   dizer que não sabe.
2. **Os dois botões de rota existem em TODO cartão**, com o em vigor marcado. No
   HTML isso é de graça: a limitação que criou o ramo compacto era de **largura
   de widget GTK**, e ela não existe mais.
3. **O "Liberar" volta com pai** — ou sai, se ela mandar (ver abaixo). O que não
   pode continuar é a terceira via de hoje: existir, ser calculado e não ser
   mostrado.
4. **O comentário errado de `:3660-3662` se substitui** pelo que a tela nova
   fizer.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_11_a_rota_em_vigor.py`:

- **a rota em vigor chega marcada**: com o estado dizendo "Todo o som do PC", é
  esse botão que nasce aceso. **Arranque a pintura e veja os dois nascerem
  apagados** — que é o estado de hoje, e o teste tem de reprová-lo;
- **sem posse do registrador, a tela não afirma**: nem "Sons do jogo" nem "Todo
  o som do PC" acesos; a dica diz que o Hefesto não tem a posse. Faça a tela
  chutar um dos dois e veja reprovar. **Este é o teste central**: o defeito
  antigo não era o seletor errado, era o seletor **mudo**, e trocar mudez por
  chute é piorar;
- **quatro cartões, quatro seletores**: com quatro controles, cada bloco tem o
  seu par. Restaure o ramo compacto e veja reprovar;
- **o "Liberar" ou tem pai ou não existe**: nenhum botão criado, mantido em
  atributo e com sensibilidade recalculada sem estar na tela. **Devolva o
  estado de hoje e veja reprovar** — esta régua vale para o produto inteiro e é
  barata de generalizar depois;
- **pintar não dispara gesto**: popular o seletor com o estado do daemon não
  posta rota nenhuma de volta. Arranque a guarda `_speaker_canal_pintando` e
  veja o eco aparecer — é para isso que ela foi escrita, e é a primeira vez que
  ela vai valer.

## O que é dela decidir

- **Os dois "Liberar" voltam, viram dica, ou saem?** (pergunta 3 do índice da
  ONDA-CONTROLES). O contrato do redesenho os mantém; o mockup não os desenha.
  O do microfone é a **terceira ação do mesmo ícone** (`Silenciar` / `Ativar` /
  `Liberar`, `controller_card.py:1980-1988`), e o do alto-falante é o botão
  descrito acima.
- **A rota no rádio.** Se o byte é escrito e som nenhum sai, o par de botões
  aparece nos cartões BT? Esta sprint publica o dado com a procedência; **quem
  decide o que a tela faz com ele é você**, e a MIGRA-CONTROLES-13 é onde a
  decisão vira desenho.
