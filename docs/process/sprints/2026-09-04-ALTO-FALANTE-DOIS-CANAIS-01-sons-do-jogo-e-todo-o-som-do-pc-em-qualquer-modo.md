# ALTO-FALANTE-DOIS-CANAIS-01 — "Sons do jogo" e "Todo o som do PC", em qualquer modo

> **Decisão dela, 04/09/2026, meio-dia:** *"sons do pc e sons do jogo. veja como
> fizemo no gtk. ele tem uma funcionalidade."* <!-- noqa-acento: citação literal dela -->

## 0. COMO A GTK FAZ, e é o que ela mandou copiar

`CANAIS_DO_SPEAKER` (`app/widgets/controller_card.py:686`): um seletor de DOIS
estados, não um botão — *"são dois caminhos independentes, e os dois podem
estar ligados ao mesmo tempo"*.

| canal | o que é | camada |
| --- | --- | --- |
| **Sons do jogo** (padrão) | só o que o jogo mandar ao dispositivo do controle sai nele; a trilha fica na TV. É o byte `OUTPUT_PATH_SEL` = 2 | 2, o firmware |
| **Todo o som do PC** | `pactl set-default-sink` para a placa do controle, E o byte | 1 + 2 |

E a ordem é medida: *"a camada 1 vence a camada 2 — volume e rota perfeitos num
sink mudo é trabalho invisível"*.

## 1. O QUE O HTML JÁ TEM, e o que ainda mente

Os dois botões existem (`interface/aba02.py:1589`) e o gesto `rota`
(`interface/pacotes/a02_controles.py:1756`) manda as duas camadas desde a
madrugada — a ida e a volta. **Três coisas ficaram por fazer:**

1. **A leitura de volta é só do byte.** `alto-rota` acende "Todo o som do PC"
   pelo firmware; ninguém lê o default sink. Em 03/09 o card 2 mostrava o botão
   aceso com o som saindo na TV (`aba02.py:1327`). A tela tem de acender só
   quando **as duas camadas concordam** — `sink_padrao_da_saida` e
   `sink_do_controle` já existem em `app/audio_saida.py:240` e `:971`.
2. **`rota` está em `PERIGOSOS`** — a régua nunca clicou. Precisa de um ensaio
   próprio que vai e VOLTA (troca o sink e o devolve), para não deixar o som
   dela preso no controle.
3. **Em qualquer modo.** Medir `speaker.set` em NATIVO: se o daemon não escreve
   o output report nesse modo, a recusa tem de dizer isso — e não fingir.

## 2. A MORDIDA

* Arrancar `devolver_o_som_do_pc` do gesto → o ensaio reprova (a volta morreu).
* Teste em que o byte diz `pc` e o sink diz TV → `alto-rota` tem de ficar
  apagado e o recado tem de nascer.

## 3. A TELA

Foto `--oculta`; clicar os dois botões no card do cabo (o rádio não publica
placa — a recusa é honesta e fica); ouvir. O ensaio deixa o sink como achou.

## Posse, para o despacho


**Toca:** `src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py` · `src/hefesto_dualsense4unix/app/audio_saida.py` · `src/hefesto_dualsense4unix/interface/hefesto_vivo.py`.

**Cria:** `scripts/ensaios/a_rota_do_som_vai_e_volta.py` · `tests/unit/test_a_rota_do_som_le_as_duas_camadas.py`. <!-- ref-externa: a sprint CRIA este arquivo; ele ainda não existe -->

**Bancada:** sim.
