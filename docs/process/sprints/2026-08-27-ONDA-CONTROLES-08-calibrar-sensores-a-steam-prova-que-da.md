---
sprint: ONDA-CONTROLES-08
# onda: CONTROLES (ver a nota de frontmatter da ONDA-CONTROLES-01)
posse:
  CTRL08:
    - src/hefesto_dualsense4unix/core/backend_pydualsense.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/app/ipc_bridge.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
    - docs/data/mapa-controles.csv
cria:
  - docs/protocol/calibracao-de-sensores.md
  - tests/unit/test_controles_calibrar_sensores.py
bancada: true
depois_de:
  # A faxina de 27/08 apagou daqui: CONFIGURACOES-O-LEXICO-01. Para onde cada uma foi, veja 2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md.
  - BATERIA-PARADA-01
  - COOP-NA-CONEXAO-NATIVA-01
  - COOP-QUE-NAO-DESMONTA-01
  - LEVA-1
  - LEVA-2
  - LEVA-3
  - LEVA-4
  - LEVA-DE-BACKGROUND-01
  - ONDA-CONTROLES-02
  - ONDA-CONTROLES-07
  - ONDA-ILUMINACAO-03
  - ONDA-JOGAR-05
  - ONDA-PERFIS-03
  - ONDA-SISTEMA-07
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  - RESERVA-DO-POSTO-01
  - SPECS-A-PROCEDENCIA-01
nao_toca:
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/schema.py
---

# ONDA CONTROLES · 08 — calibrar sensores, e a Steam é a prova de que dá

**O defeito, numa frase:** o giroscópio sai de fábrica com desvio, ela pediu um
botão que *"deixa o controle parado e ele calibra os eixos novamente"*, e o
produto **não tem uma linha** que toque calibração de sensor.

## O que ela decidiu, e como derrubou a pergunta

`D-CALIBRAR-SENSORES-NO-NATIVO`. Ofereci três saídas — recusar com motivo,
avisar o alcance, sumir no Nativo — e ela derrubou as três com um fato:

> *"Vamos fazer esse modo funcionar assim também. escreve a spec e olha o csv de
> specs e marca lá também pra fazermos. **Na steam isso existe então é possível
> o caminho.**"*

E a tarefa que ela nomeou junto: **investigar como a Steam faz, escrever a spec,
e marcar a linha em `docs/data/mapa-controles.csv`.**

O pedido original, com o gesto descrito (26/08):
> *"calibrar Sensores (deixa o controle parado e ele calibra os eixos
> novamente) e isso vai passar a ser reconhecido tanto pelo jogo quanto pela
> steam."*

## O que está medido

- **Zero cobertura.** Nem `ipc_handlers.py` nem `backend_pydualsense.py` têm um
  método de calibração. A própria decisão registra: *"nenhum dos métodos do IPC
  toca sensor"*.
- **O feature report da calibração JÁ é lido**, para outra coisa:
  `uhid_gamepad.py:488` — *"Tamanho do feature 0x05 (calibração da IMU)"*, e
  `:799`: *"feature 0x05 lido do controle FÍSICO... o `hid_playstation` do vpad
  (e o SDL) calibram o motion com o 0x05 que o vpad responde no probe"*.
  **A casa já sabe ler a calibração de fábrica**; o que falta é o zero dela.
- **O ponto de comparação é a Steam**, e ela apontou: o Steam Input calibra no
  modo nativo, logo o caminho existe.

## O que esta sprint entrega

**Primeiro a medição, depois o código** — nesta ordem, e a inversão é o que
produz alarme convincente e falso.

1. **`docs/protocol/calibracao-de-sensores.md`**, com o **grau de confiança de
   cada linha**, no molde das quatro referências de driver desta casa. Ele
   responde: o que o feature 0x05 traz, o que a Steam grava e onde, se a
   correção mora no aparelho (firmware) ou no consumidor (SDL/driver), e o que
   sobra para nós. **Se a resposta for "a Steam corrige no consumidor, não no
   aparelho", isso vai escrito** — e muda o que o botão pode prometer.
2. **A linha no `docs/data/mapa-controles.csv`**, com o canal e o transporte,
   porque nesta casa o CSV é **portão, não documentação**
   (`scripts/check_paridade_transporte.py` reprova afirmação forte sem teste que
   a sustente). Sem teste no cabo **e** no rádio, a linha nasce fraca.
3. **`sensors.calibrate` no IPC** e o método no backend: o gesto é *deixar
   parado e medir* — coleta uma janela de amostras com o controle em repouso,
   confere que **é repouso mesmo** (variância abaixo do piso) e grava o
   deslocamento de zero por controle.
4. **O botão "Calibrar sensores"** do topo, que nasceu insensível na
   ONDA-CONTROLES-02, passa a mandar — com **contagem regressiva na tela** e
   recusa dita quando o controle se mexe no meio.

**A recusa é entrega, não falha.** Se a investigação mostrar que o caminho não
existe no Modo Nativo, o botão **recusa com motivo escrito** e a spec diz por
quê — o que a casa não faz é imprimir "aplicado" sem ter aplicado
(`test trigger --raw`, a terceira armadilha do `COMO-OLHAR-A-TELA.md`).

## Bancada

`bancada: true`, e é obrigatório: escrever no `hidraw`, medir repouso e
conferir que o jogo **e a Steam** passam a ver o eixo corrigido só se faz com o
controle na mesa. `scripts/bancada.sh exigir` antes de qualquer caminho que
escreva no aparelho; `rc=1` significa **esperar e dizer que está esperando**.

## Como se prova (o teste que morde)

`tests/unit/test_controles_calibrar_sensores.py` (sem aparelho, com dublê):

1. **Repouso de verdade.** Uma janela de amostras com variância alta é
   **recusada** com motivo; uma janela parada é aceita e produz o deslocamento
   certo. Arranque a guarda de variância e veja o dublê que treme ser aceito.
2. **O zero é por controle.** Duas peças, dois deslocamentos, e nenhum vaza para
   o outro.
3. **O IPC sabe recusar.** `sensors.calibrate` sem `uniq` com dois controles na
   mesa recusa em vez de escolher sozinho.
4. **A leitura sai corrigida.** Com o deslocamento aplicado, o mesmo dado cru
   produz eixo em zero.

E, **na bancada**, a prova que nenhum dublê dá: o controle parado na mesa antes
e depois, com a leitura do card do lado, mais a conferência de que a Steam
concorda. Foto antes e depois — `PROVA-DE-TELA-01`.

## O que é dela decidir

1. **Onde mora o botão** — a pergunta 1 do contrato da aba, que
   `D-CALIBRAR-SENSORES-NO-NATIVO` deixou aberta: *no card do controle, ou na
   aba Conexões junto do exame?* **O mockup aprovado já responde**: no topo do
   quadro da aba Controles, ao lado dos dois interruptores, no lugar do "Ouvir
   no controle" — palavra dela em 27/08. Fica registrado que a pergunta do
   contrato foi respondida pelo desenho.
2. **A calibração é do aparelho ou do perfil?** Se o zero vive no perfil, cada
   jogo pode ter o seu — e isso é errado: o desvio é da peça, não do jogo.
   **PROVISÓRIO — decisão dela:** vive por controle, fora do perfil, junto do
   que a casa já guarda por `uniq`.
