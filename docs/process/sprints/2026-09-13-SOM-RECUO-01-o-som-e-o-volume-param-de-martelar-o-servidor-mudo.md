---
sprint: SOM-RECUO-01
estado: feita
onda: A-FILA-DE-1309
posse:
  SOM-RECUO-01:
    - src/hefesto_dualsense4unix/integrations/alto_falante_bt.py
    - src/hefesto_dualsense4unix/integrations/audio_control.py
    - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
    - tests/conftest.py
cria:
  - tests/unit/test_o_som_e_o_volume_respeitam_o_recuo.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/integrations/fontes_de_captura.py
  - src/hefesto_dualsense4unix/integrations/eleicao_de_microfone.py
  - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
---

# SOM-RECUO-01 — o som e o volume param de martelar o servidor mudo

> **ESTADO 2026-09-13: feita** — som, microfone e volume dividem UM recuo do `pactl`: o `load-module` do som não se repete no servidor mudo e só sai depois de a sondagem responder, a rota e as leituras do `rota_do_no` esperam o recuo, o `audio_control` devolve o «não sei» na hora, e a suíte guarda os dois `_rodar` e zera o recuo a cada teste. Sem aparelho: a prova no servidor travando de verdade fica para a MESA-DE-QUATRO-01. A entrega está em `docs/process/agentes/2026-09-13/SOM-RECUO-01-opus.md`.

**13/09/2026.** Continuação da MIC-O-CANAL-DO-OUTRO-01 (entrega em
`docs/process/agentes/2026-09-13/MIC-O-CANAL-DO-OUTRO-01-opus.md`, §«O que
sobrou», itens 2, 3 e 4). O pedido dela para esta leva foi resolver som e
microfone; o microfone ganhou recuo, **o som e o volume não**.

## §0 — O que foi medido (journal da máquina dela, 13/09)

* 01:53:43 o controle do rádio caiu (`bt_mic_hidraw_perdido`, Errno 5) e voltou
  em outro hidraw; 01:53:54, primeiro `pactl` com prazo estourado.
* De 01:53 a 02:40 o `pipewire-pulse` não atendeu cliente nenhum. Nesse tempo:
  **699 prazos de `pactl` estourados e 509 `load_module_falhou`**: o som
  (`alto_falante_bt`, `som_load_module_falhou`) a cada 10 s e o microfone a cada
  ~15 s. Nos 40 minutos até 02:42 houve ainda **593 `audio_fonte_do_uniq_falhou`**
  (`audio_control.py`, prazo de 2 s). Na máquina dela, a Steam não abria e o VLC
  recusava a conexão de áudio.
* O `pactl` só voltou com `pipewire`, `pipewire-pulse` e `wireplumber`
  reiniciados juntos.

**Esta sprint não cura o travamento** (a causa pede aparelho: MESA-DE-QUATRO-01).
Ela faz o Hefesto parar de agravar: cada chamada presa são 2 a 5 s de prazo, e
elas se empilham.

## §1 — O que muda

1. **Um recuo só para o servidor.** O `RecuoDoPactl` / `PACTL` /
   `pactl_mudo()` já existe em `dualsense_bt_audio.py`. O servidor é um só, e o
   recuo tem de ser um só: um prazo estourado pelo som põe o microfone em recuo
   também, e vice-versa. Se importar `dualsense_bt_audio` a partir de
   `audio_control` ou `alto_falante_bt` criar ciclo ou peso de import, mova o
   recuo para um módulo pequeno e deixe `dualsense_bt_audio` reexportando os
   mesmos nomes. As âncoras do mapa não podem mudar de lugar:
   `scripts/validar-citacoes-de-linha.py --all` tem de continuar sem citação podre.
2. **`alto_falante_bt._rodar`** anota o prazo estourado no recuo. Em recuo, o
   `load-module` do som não sai e o estado responde «não sei» sem perguntar.
   Vencido o recuo, a primeira pergunta é a sondagem, e o `load-module` só sai
   se ela responder — o mesmo desenho do microfone.
3. **`audio_control.py`**: toda chamada `pactl` passa pelo recuo. Em recuo,
   devolve o «não sei» que cada função já tem para o prazo estourado, sem
   esperar 2 s.
4. **`tests/conftest.py`**: a guarda `_nenhum_modulo_de_som_de_verdade` passa a
   cobrir também o `dualsense_bt_audio._rodar` (`load-module` e
   `unload-module`), e o `PACTL` é zerado a cada teste. Um prazo real estourado
   num teste não pode pôr em recuo o teste seguinte.

## §2 — O que morde

* Som: dois ciclos com o `load-module` estourando o prazo → UM `load-module`,
  não dois. Arrancar o recuo → reprova.
* Microfone e som dividem o recuo: prazo estourado no som → o microfone não
  pergunta no ciclo seguinte. Arrancar o compartilhamento → reprova.
* `audio_control`: em recuo, `fonte_de_captura_do_uniq` volta na hora (tempo
  medido no teste) com o «não sei». Arrancar → reprova.
* conftest: um teste que constrói `SourceVirtualPipeWire` sem `runner` não
  chega ao `pactl` real (dublê do `subprocess.run` que conta). Arrancar a
  guarda → reprova.
* Nenhum teste fala com o servidor de som da máquina.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| pergunta | resposta |
| --- | --- |
| **por cabo** | o volume e a fonte do cabo passam pelo mesmo recuo (item 3) |
| **por BT** | som e microfone do rádio dividem o recuo; prova de aparelho fica na MESA-DE-QUATRO-01 |
| **no perfil** | nada vai ao disco |
| **por controle** | o recuo é do servidor, não do controle, e isso é de propósito: o servidor é um só |
