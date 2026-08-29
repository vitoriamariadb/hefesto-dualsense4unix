---
sprint: MIGRA-CONTROLES-10
onda: MIGRA-CONTROLES
posse:
  MC10:
    - src/hefesto_dualsense4unix/app/mic_monitor.py
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
    - docs/data/mapa-controles.csv
cria:
  - tests/unit/test_migra_controles_10_o_volume_do_mic_volta.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-06
  - MIGRA-CONTROLES-08
  # SÉRIE por R5: dividem `app/mic_monitor.py` e/ou `controller_card.py`.
  - ONDA-CONTROLES-06
  - ONDA-CONEXOES-06
  # COLISÃO DE ARQUIVO DECLARADA: `controller_card.py` e a linha do
  # `docs/data/mapa-controles.csv` (o arquivo é um só; as linhas são
  # independentes, mas o portão não sabe disso).
  - COOP-NA-CONEXAO-NATIVA-01
  - LEVA-3
  - ONDA-CONTROLES-01
  - ONDA-CONTROLES-03
  - ONDA-CONTROLES-04
  - ONDA-CONTROLES-09
  - RESERVA-DO-POSTO-01
  - SPECS-A-PROCEDENCIA-01
  - ONDA-CONTROLES-05
  - ONDA-CONTROLES-08
nao_toca:
  - src/hefesto_dualsense4unix/core/backend_pydualsense.py
  - src/hefesto_dualsense4unix/core/ds_output_report.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA CONTROLES · 10 — O volume do microfone volta da escrita cega

**Achado novo de 29/08 — não está no índice da ONDA-CONTROLES.**

## O defeito

**O controle deslizante do volume do microfone manda e nunca relê.** A ida está
inteira; a volta não existe. Medido em 29/08:

| a ida | existe |
|---|---|
| o método IPC | `mic.volume.set` (`daemon/ipc_server.py:159`), atendido em `daemon/ipc_handlers.py:4757` |
| a ponte | `app/ipc_bridge.py:1113` (`mic_volume_set`) e `:1158` (a versão que devolve o corpo da resposta) |
| o gesto | `app/widgets/controller_card.py:3901` (`_enviar_volume_do_mic`) |

| a volta | não existe |
|---|---|
| o campo | `LeituraMic` (`app/mic_monitor.py:129-133`) tem `nivel`, `muted`, `fonte`, `saida_muda` e `sink`. **Volume, não.** |
| o pintor | `app/widgets/controller_card.py:3945` (`_pintar_volume_do_mic`) — **zero chamadores** em `src/`, `tests/` e `scripts/` |

O pintor é o caso mais claro de *"a casa sabe e o produto não faz"* que esta aba
tem: ele **já está pronto e correto** — respeita a mão dela enquanto ela arrasta
(`_mic_arrastando`), evita o eco do próprio pedido (`_mic_pintando`) e só
reposiciona quando o valor mudou. **Faltou alguém chamá-lo.**

O efeito prático: abriu a janela, o cursor nasce onde o desenho manda, não onde
o sistema está. Mudou o volume por fora — pelo mixer do COSMIC — e a janela
continua mostrando o número velho, com confiança.

### A pergunta "qual camada" já está respondida, e não é dela

Não confunda com o volume do **firmware**. `core/backend_pydualsense.py:4118-4121`
tem a decisão datada, escrita no código:

> *"SOM-SEMPRE-01: o volume do MICROFONE (`common[6]`) continua **FORA** da
> chamada, e isso é decisão, não esquecimento — o dono do microfone no Linux é
> o kernel (AUDIO-OWNER-01)."*

`COMMON_MIC_VOLUME` (`core/ds_output_report.py:122`) só é **lido**, em
`integrations/uhid_gamepad.py:2080`. O mapa concorda: `audio.microfone.volume`
do DualSense é `cabo_aciona = não`, `radio_aciona = não`.

**A camada é a 1** — o ganho da fonte de captura no PipeWire, que é justamente o
que `mic_volume_set` já faz, e é universal porque *"o DualSense não expõe
registrador de ganho de microfone — nem no cabo nem no rádio"*
(`app/ipc_bridge.py:1131-1136`).

### E um endereço do mapa envelheceu calado

`docs/data/mapa-controles.csv`, linha `audio.microfone.volume@dualsense`, aponta
`cabo_codigo_ref` e `radio_codigo_ref` para
**`core/backend_pydualsense.py:644-672 (sem chamadores)`**. Aquelas linhas hoje
são `_suppress_leds` e o comentário do latch da barra de luz — **outro assunto
inteiro**.

**O fato continua certo** (o byte do firmware não é escrito, por decisão); **o
ponteiro, não.** Quem for executar pelo endereço lê o arquivo errado e conclui
que o fato caiu. Por ser fato errado, o ponteiro **se substitui**, e nesta
sprint, porque é ela que possui a linha.

## O que entrega

1. **`LeituraMic` ganha `volume`**, lido da mesma fonte de captura de onde já
   saem `nivel` e `muted`. Nenhum segundo leitor de PipeWire na janela — o
   módulo já é o dono desse papel, e diz por quê (`app/mic_monitor.py:118-127`:
   publicar o `sink` ali é *"o que evita um SEGUNDO leitor de PipeWire na
   janela"*).
2. **`None` é um estado, e não é zero.** Sem fonte de captura — o caso do rádio
   sem a ponte de áudio de pé — o volume é **desconhecido**, o controle
   deslizante fica insensível e a dica diz por quê. É a mesma disciplina que
   `nivel=None` já tem: *"um controle cinza não promete nada; um controle que
   aceita o gesto e não faz nada é a tela mentindo"* (`ipc_bridge.py:1143-1145`).
3. **O pintor ganha chamador** — no tique que já pinta o resto do cartão.
4. **O ponteiro do mapa se corrige**, e vai para onde o fato mora hoje:
   `core/backend_pydualsense.py:4118-4121` (a decisão) e
   `core/ds_output_report.py:122` (o byte).

## Como se prova (a mordida)

`tests/unit/test_migra_controles_10_o_volume_do_mic_volta.py`:

- **o pintor tem chamador**: AST sobre `src/` — `_pintar_volume_do_mic` é
  chamado em pelo menos um lugar fora da própria definição. **Arranque a
  chamada e veja reprovar.** É a régua que impede a cura de voltar a ser
  escrita-e-desligada;
- **mudar por fora chega à tela**: a fonte muda de 40 para 80 sem passar pela
  janela; o próximo tique põe o cursor em 80. **Arranque o campo de `LeituraMic`
  e veja o cursor ficar em 40** — é o defeito de hoje, reproduzido;
- **a mão dela ganha**: com `_mic_arrastando`, o tique **não** mexe no cursor.
  Arranque a guarda e veja o controle pular para trás no meio do arrasto;
- **sem eco**: pintar não dispara um novo `mic.volume.set`. Arranque
  `_mic_pintando` e veja o teste flagrar o pedido em looping;
- **sem fonte é insensível, nunca zero**: com o daemon respondendo `sem_fonte`,
  o controle fica cinza com o motivo. **Faça `None` cair em `0` e veja
  reprovar** — um volume zero afirma silêncio; um controle cinza afirma
  desconhecimento, e são coisas diferentes;
- **o firmware não é tocado**: nenhuma escrita a `COMMON_MIC_VOLUME` nasce desta
  sprint. Escreva o byte e veja reprovar contra a decisão `SOM-SEMPRE-01`;
- **o ponteiro do mapa aponta para o que existe**: o `codigo_ref` da linha
  resolve para linhas que **falam do volume do microfone**. Ponha um endereço
  qualquer e veja reprovar. `scripts/check_paridade_transporte.py` continua
  verde: o fato não mudou, só o endereço.

## O que é dela decidir

Nada de tela. **O desenho já tem o controle deslizante e o número**
(`novo-layout/02-controles.html`, bloco Microfone: o trilho com `mic_vol`), e o
que muda é ele passar a dizer a verdade. Se o número que o sistema devolver
divergir do que o desenho mostra hoje, **é o desenho que está certo e o produto
que estava calado** — não o contrário.
