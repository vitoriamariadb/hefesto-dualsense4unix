---
sprint: ONDA-CONTROLES-04
# onda: CONTROLES (ver a nota de frontmatter da ONDA-CONTROLES-01)
posse:
  CTRL04:
    - src/hefesto_dualsense4unix/core/evdev_reader.py
    - src/hefesto_dualsense4unix/daemon/sensor_hub.py
    - src/hefesto_dualsense4unix/app/widgets/sensor_widgets.py
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
cria:
  - tests/unit/test_controles_o_acelerometro_chega.py
bancada: false
depois_de:
  - COOP-QUE-NAO-DESMONTA-01
  - LEVA-3
  - ONDA-CONTROLES-01
  - ONDA-CONTROLES-03
nao_toca:
  - src/hefesto_dualsense4unix/core/physical_report_reader.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

# ONDA CONTROLES · 04 — o acelerômetro está no mesmo node, a uma linha do giro

**O defeito, numa frase:** o card mostra o **giroscópio** e não mostra o
**acelerômetro** — e os dois vêm do **mesmo node evdev**, lidos pelo mesmo
laço, separados por três códigos de eixo.

## O que está medido

- `core/evdev_reader.py:2092-2093`, na docstring do leitor de movimento:
  > *"O eixo é mapeado por `ABS_RX/RY/RZ` (gyro) — `ABS_X/Y/Z` no mesmo node
  > **são o ACELERÔMETRO e não entram aqui**."*

  O node já está aberto, o laço já está rodando, a escala já é lida do
  `absinfo` em `_on_device_opened` (`:2134`). Falta ler três códigos a mais.
- `daemon/sensor_hub.py:118-123` — `out["gyro"] = {x, y, z}`. **Não existe a
  chave `accel`** em lugar nenhum do pacote: `grep -rn '"accel"' src/` devolve
  zero.
- `app/widgets/controller_card.py:1850`, `gyro_do_inputs` — o lado da tela, e o
  molde exato do que falta: `None` quando não há bloco, **nunca `(0,0,0)`**,
  porque *"três barras paradas no centro dizem 'o controle está em repouso', e
  não 'eu não sei'"*.
- `app/widgets/sensor_widgets.py:331`, `GyroBars` — o desenho de três eixos com
  barra bipolar, pronto, com stub sem GTK (`:655`) para os testes.

## O que esta sprint entrega

A cadeia inteira, quatro degraus, cada um no molde do degrau gêmeo do giro:

1. **`evdev_reader.py`** — `AccelSnapshot` e a leitura de `ABS_X/Y/Z` no mesmo
   laço, com a resolução do `absinfo` e o mesmo `_reset_on_disconnect` (o valor
   congelado mente movimento — a cicatriz já está escrita lá).
2. **`sensor_hub.py`** — `out["accel"] = {x, y, z}` **ao lado** de `out["gyro"]`,
   com o mesmo `contextlib.suppress(Exception)`: `state_full` não cai por causa
   de um sensor.
3. **`sensor_widgets.py`** — o desenho, reaproveitando `GyroBars` com a escala
   em **g** em vez de graus/s (o mockup escreve `+0.9` e `(g)`), mais o stub.
4. **`controller_card.py`** — `accel_do_inputs`, o bloco no card e o
   `_update_accel`, imediatamente abaixo do giroscópio, como o mockup desenha
   (`src/hefesto_dualsense4unix/interface/aba02.py`, `acel_html`).

**A escala é declarada, não chutada.** O mockup mostra `Y: +1.0 g` com o
controle parado — que é a gravidade. Se o `absinfo` não trouxer resolução, o
número sai como veio e o rótulo diz `(cru)`, nunca `(g)`: afirmar unidade que
não se sabe é o instrumento mentindo mais que o produto.

## Como se prova (o teste que morde)

`tests/unit/test_controles_o_acelerometro_chega.py`, um teste por degrau, com
dublês — **e cada dublê sabe recusar**:

1. **O leitor.** Um device falso que emite `ABS_X/Y/Z`: o `snapshot()` traz os
   três. Emitindo **só** `ABS_RX/RY/RZ`, o acelerômetro fica no zero e o giro
   anda — prova que os dois eixos não estão trocados, que é o erro que um teste
   ingênuo não pega.
2. **O hub.** `leitura(uniq)` traz `accel` **e** `gyro` quando há reader; traz
   `gyro` **sem** `accel` quando o reader não tem os eixos; e não levanta quando
   o `snapshot()` explode.
3. **A tela.** `accel_do_inputs` devolve `None` sem o bloco — e o bloco **some**
   do card, não fica em três zeros. Arranque a cura (devolva `(0.0, 0.0, 0.0)`
   no lugar do `None`) e veja reprovar.
4. **Desconectou, zerou.** `_reset_on_disconnect` zera os seis eixos, não três.

## O que é dela decidir

Nada de tela: o mockup aprovado já desenha o bloco, com rótulo, unidade e
posição. O que depende dela vem depois, na **ONDA-CONTROLES-07** (o
interruptor) e na **ONDA-CONTROLES-08** (a calibração).

**Uma nota de fato, para quem executar:** este acelerômetro é a **leitura da
interface**, não o que chega ao jogo. Quem alimenta o jogo é o
`physical_report_reader`, que fatia a janela de movimento do report cru e a
repassa **opaca** ao vpad (`core/physical_report_reader.py:7`). São dois
consumidores do mesmo sensor, e esta sprint não toca no segundo.
