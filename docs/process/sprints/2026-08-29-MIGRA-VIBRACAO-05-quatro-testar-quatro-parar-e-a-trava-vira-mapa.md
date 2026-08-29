---
sprint: MIGRA-VIBRACAO-05
onda: MIGRA-VIBRACAO
posse:
  MV5:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/daemon/ipc_rumble_policy.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - src/hefesto_dualsense4unix/app/telas/vibracao.py
    - src/hefesto_dualsense4unix/profiles/schema.py
cria:
  - tests/unit/test_migra_vibracao_05_quatro_travas.py
  - tests/unit/test_migra_vibracao_05_a_aba_nao_troca_o_alvo_global.py
bancada: true
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-VIBRACAO-01
  - MIGRA-VIBRACAO-03
  - MIGRA-VIBRACAO-04
  # SÉRIE por R5 — donos declarados dos mesmos arquivos, medido em 29/08
  - LEVA-3
  - LEVA-DE-BACKGROUND-01
  - EMULACAO-UM-DONO-SO-01
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-GATILHOS-04
  - ONDA-GATILHOS-05
  - ONDA-JOGAR-05
  - ONDA-LANCADORES-06
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  - ONDA-NAVEGACAO-05
  - ONDA-PERFIS-03
  - ONDA-PERFIS-09
  - ONDA-SISTEMA-07
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  # AS OUTRAS ONDAS DA MESMA LEVA que reivindicam os mesmos arquivos.
  # Lista de 29/08, e ela SE MOVE: as dez ondas estavam sendo escritas ao
  # mesmo tempo. Quem coordena reconfere com `check_colisao_de_sprints.py`
  # antes de despachar.
  - MIGRA-CONTROLES-09
  - MIGRA-GATILHOS-09
  - MIGRA-ILUMINACAO-11
  - MIGRA-JOGAR-10
  - MIGRA-NAVEGACAO-07
  - ONDA-VIBRACAO-04
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
  - src/hefesto_dualsense4unix/core/backend_pydualsense.py
  - novo-layout/
---

# MIGRA VIBRAÇÃO · 05 — quatro "Testar", quatro "Parar", e a trava vira mapa

**O defeito em uma frase:** a tela tem **quatro** pares Testar/Parar e o daemon
tem **uma** trava para a mesa inteira.

## O que está medido

O par travado é **um só**: `daemon_cfg.rumble_active` e
`daemon_cfg.rumble_active_uniq` (`daemon/ipc_handlers.py:4214-4215`), com o dono
congelado no gesto por `uniq_do_alvo_de_output`
(`daemon/ipc_rumble_policy.py:112`, `MESA-CHEIA-05`). O `state_full` os publica
em `:3164-3169` (`rumble_passthrough` = `rumble_active is None`).

Com quatro botões "Parar" sobre uma trava só, clicar no do P2 apaga a vibração
do P1 — **e a tela não tem como dizer isso**, porque cada coluna afirma ser a
sua peça.

E o esquema já registrou a consequência, por escrito
(`profiles/schema.py:766-775`):

> *"`passthrough` FICA DE FORA, e a ausência é a entrega. (…) Duas unidades
> pedindo passthrough diferente no mesmo perfil não têm resposta honesta
> **enquanto a trava for uma só**."*

## A saída óbvia é PROIBIDA, e a proibição é medida

Trocar o alvo com `controller.target.set` antes de cada teste **parece** a saída
fácil. **Não é.** Está escrito no docstring de `core/backend_pydualsense.py:4768`
(`set_rumble_for`):

> *"PERFIL-01: substitui o flip transitório do `_output_target_key` que o
> `apply_game_rumble` fazia — com o estado desejado keyed pelo alvo lido de um
> global mutável, a corrida com o executor multi-thread (`max_workers=2`)
> persistiria config no controle errado."*

**A rota certa já está pronta do lado do hardware:** `set_rumble_for(uniq, weak,
strong)` mira a peça sem tocar o seletor global e **já escala por peça** —
`_escalar_rumble` (`:3797`), chamado em `:4789`.

## O que entrega

1. **`rumble.set` e `rumble.stop` aceitam `uniq` opcional** e roteiam por
   `set_rumble_for`. **Sem `uniq` = a mesa, exatamente como hoje** — a CLI não
   muda.
2. **`daemon_cfg.rumble_active` vira MAPA** `{uniq: (weak, strong)}`, e
   `rumble_active_uniq` some: a informação passa a estar na chave. O
   `state_full` publica o formato novo **e o antigo** enquanto houver leitor
   velho — e a régua diz **quando** o antigo pode sair, para o par não virar
   dívida permanente.
3. **O poll loop reafirma POR DONO**, não para a mesa.
4. **`rumble.passthrough` (`ipc_handlers.py:4335`) segue a mesma chave**: soltar
   um controle não solta os outros.
5. **A razão escrita do `ControllerRumbleOverride` CADUCA, e ganha nota
   datada.** Com a trava sendo um mapa, `passthrough` por unidade passa a ter
   resposta honesta. **Não se apaga decisão medida** — o docstring de
   `schema.py:766-775` recebe a data e o que mudou; aceitar o campo no override
   é decisão à parte, e não é desta sprint.

## Como se prova (a mordida)

`tests/unit/test_migra_vibracao_05_quatro_travas.py`

- **P1 travado em (160, 220), P2 com o jogo controlando: o poll loop reafirma só
  o P1.** *Arranque:* volte o par único e veja o P2 travar junto — que é o
  produto de hoje.
- **"Parar" na coluna do P2 não muda o par do P1.** *Arranque:* faça o stop
  zerar o mapa inteiro e veja reprovar.
- **`rumble.set` sem `uniq` continua sendo da mesa** — a rota antiga não pode
  quebrar.
- **`uniq` que não casa: descartado com log, nunca broadcast.**
- **Perfil e config antigos, com `rumble_active` no formato de par, carregam** e
  saem valendo para a mesa. Um perfil dela que deixa de abrir é a
  `GATILHOS-APLICADO-01` de novo.
- **A régua roda o tique MAIS DE UMA VEZ** — três reafirmações do poll loop, e
  o P2 continua livre nas três. Uma régua que roda o tique uma vez mede um
  instante, não um comportamento (medido em 29/08, com uma regressão que só
  aparecia 181 s depois passando com 67 testes verdes).

`tests/unit/test_migra_vibracao_05_a_aba_nao_troca_o_alvo_global.py` — **a régua
da proibição**

- **Nenhum caminho desta aba chama `controller.target.set` nem escreve
  `_output_target_key`.** A régua varre o adaptador `app/telas/vibracao.py` <!-- ref-externa: o adaptador nasce na MIGRA-VIBRACAO-01 --> e
  os handlers de `rumble.*`. *Arranque:* ponha o flip de volta antes do teste e
  veja reprovar. A régua **cita a medição da `PERFIL-01` pela linha**
  (`backend_pydualsense.py:4770-4774`), para quem a ler daqui a seis meses saber
  que a proibição tem causa e não é gosto.

**Bancada:** dois controles na mesa dela, os dois tremendo, um "Parar" clicado —
e a palavra dela sobre **qual** parou. Sem isso a prova é só de dublê.
`scripts/bancada.sh exigir` antes.

## O que é dela decidir

**O "Parar" é da coluna ou da mesa?** Se for da mesa, o desenho tem quatro
botões que fazem a mesma coisa quatro vezes — e é melhor um só, acima da grade.
Se for da coluna (que é o que o desenho promete), esta sprint é o que ele custa.

E a pergunta gêmea, que a **08** carrega: **com quatro "Parar" e nenhum
antídoto, quatro controles ficam trancados em silêncio sem volta pela janela.**
O botão "Deixar o jogo controlar a vibração" não existe em nenhum dos dez
mockups.
