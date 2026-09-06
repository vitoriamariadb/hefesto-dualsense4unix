---
sprint: BATERIA-PARADA-01
estado: aberta
posse:
  B1:
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
    - src/hefesto_dualsense4unix/core/backend_pydualsense.py
  B2:
    - src/hefesto_dualsense4unix/daemon/battery_journal.py
cria:
  - docs/process/sprints/2026-08-26-BATERIA-PARADA-01-o-numero-que-nunca-muda.md
  - tests/unit/test_a_bateria_diz_se_esta_carregando.py
  - tests/unit/test_a_bateria_nao_le_o_no_do_vpad.py
bancada: true
depois_de:
  - LEVA-1                   # ela fechou hoje e tocou os dois arquivos
  - LEVA-2                   # idem
  - LEVA-4                   # lifecycle.py: fechou hoje, na mesma leva
  - COOP-QUE-NAO-DESMONTA-01 # backend_pydualsense: chegou antes
  - RESERVA-DO-POSTO-01      # idem
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - docs/data/
---

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.1 — a bancada dos quatro remede (o CSV diz IGUAL para a bateria no cartão; o que ela viu foi o número parado no tempo).

# BATERIA PARADA · 01 — o número que nunca muda

**26/08/2026.** Queixa dela, e ela estava certa:

> *"sinto que o percentual de bateria do controle inclusive nunca é atualizado
> enquanto o controle tá conectado seja por cabo seja por bt"*

Medido no mesmo minuto, com os dois controles dela no cabo. **São dois defeitos
distintos, e o segundo é pior.**

## Defeito 1 — o `status` chega VAZIO ao produto

Três leituras do daemon vivo, com sete segundos entre elas:

```
21:38:21  444648000003  bat=100  status=None  usb
21:38:29  444648000003  bat=100  status=None  usb
21:38:36  444648000003  bat=100  status=None  usb
```

E o kernel, no mesmo instante, **sabe**:

```
/sys/class/power_supply/ps-controller-battery-44:46:48:00:00:03/status  ->  Full
/sys/class/power_supply/ps-controller-battery-02:fe:00:00:00:01/status  ->  Charging
```

O produto lê o NÚMERO e joga fora o ESTADO. A tela nunca diz "carregando" nem
"cheia" — e é isso que faz a barra parecer congelada: ela mostra 100% parado,
sem contar que está carregando. **A informação existe no kernel e morre no
caminho.**

`battery_journal.py:160` já lê `(capacity, status)` do nó do sysfs — a função
está escrita. O que chega à tela vem de outro caminho
(`backend_pydualsense.get_battery`, que devolve `int`), e esse não carrega o
estado.

## Defeito 2 — há QUATRO nós de bateria e DOIS controles

```
02:fe:00:00:00:01   Charging   <- gamepad VIRTUAL do Hefesto
02:fe:00:00:00:02   Charging   <- gamepad VIRTUAL do Hefesto
44:46:48:00:00:03   Full       <- controle dela
d4:2f:4b:00:00:d8   Full       <- controle dela
```

**Os dois `02:fe:*` são os gamepads virtuais que o próprio Hefesto cria**, e o
nó de bateria deles diz `Charging` para sempre — é valor inventado pelo uhid,
não medição de aparelho nenhum.

Qualquer leitura que case pelo nó errado devolve um número que **nunca muda**,
porque não vem de bateria de verdade. O prefixo `02:fe:` é a marca do vpad
(a mesma faixa que o produto usa para o endereço sintético), e nenhuma régua
hoje exclui esses nós da varredura de bateria.

## O que fechar

**B1 — o estado atravessa até a tela.**
O `status` (`Charging` / `Discharging` / `Full` / `Not charging`) vira dado de
primeira classe ao lado do percentual, e a tela passa a dizer "100% ·
carregando" em vez de "100%" mudo. É o que separa "a barra congelou" de "a
bateria está cheia porque está no cabo".

**B2 — a varredura ignora o vpad.**
Nó de bateria cujo endereço é da faixa sintética do Hefesto NÃO é bateria: sai
da varredura, e sai NOMEANDO — se um dia o prefixo mudar, o portão avisa em vez
de voltar a ler o nó errado em silêncio.

## A mordida

- `test_a_bateria_diz_se_esta_carregando.py` — com o sysfs dublê dizendo
  `Charging`, o estado que chega à tela carrega o status. Arrancada a cura, ele
  volta a `None` e o teste reprova imprimindo o que o kernel dizia.
- `test_a_bateria_nao_le_o_no_do_vpad.py` — quatro nós no dublê, dois deles
  `02:fe:*`. A varredura tem de devolver DOIS controles, não quatro. Devolvendo
  a varredura antiga, ela acha quatro e o teste reprova nomeando os intrusos.

## O que esta sprint NÃO faz

Não mexe na tela (`main.glade` está no `nao_toca`): o redesenho decide COMO o
"100% · carregando" aparece no card. Aqui o dado passa a existir; lá ele ganha
forma.

E não liga o aviso de bateria fraca nem o histórico — os dois estão decididos
para o redesenho (`notify_battery_low` e `battery_journal.DiarioDaBateria`,
ambos escritos e sem chamador), e dependem deste dado chegar certo primeiro.
