---
sprint: ONDA-CONTROLES-07
# onda: CONTROLES (ver a nota de frontmatter da ONDA-CONTROLES-01)
posse:
  CTRL07:
    - src/hefesto_dualsense4unix/profiles/schema.py
    - src/hefesto_dualsense4unix/app/draft_config.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/integrations/uhid_gamepad.py
    - src/hefesto_dualsense4unix/app/actions/status_actions.py
cria:
  - tests/unit/test_controles_os_sensores_tem_interruptor.py
bancada: false
depois_de:
  # A faxina de 27/08 apagou daqui: NAVEGACAO-UM-CONTROLE-SO-01, VPAD-SUSPENSO-MORTO-01. Para onde cada uma foi, veja 2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md.
  - COOP-QUE-NAO-DESMONTA-01
  - EMULACAO-UM-DONO-SO-01
  - JOGADOR-3-FANTASMA-01
  - LEVA-1
  - LEVA-4
  - LEVA-DE-BACKGROUND-01
  - ONDA-CONEXOES-10
  - ONDA-CONTROLES-02
  - ONDA-CONTROLES-06
  - ONDA-GATILHOS-04
  - ONDA-ILUMINACAO-03
  - ONDA-JOGAR-05
  - ONDA-NAVEGACAO-01
  - ONDA-NAVEGACAO-04
  - ONDA-NAVEGACAO-05
  - ONDA-PERFIS-03
  - ONDA-PERFIS-09
  - ONDA-VIBRACAO-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
nao_toca:
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/core/physical_report_reader.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

# ONDA CONTROLES · 07 — os dois sensores ganham interruptor, e nascem ligados

**O defeito, numa frase:** ela pediu **dois botões para ligar giroscópio e
acelerômetro**, e não existe no produto nada que os desligue — nem campo no
perfil, nem método de IPC, nem chave na tela.

## O que ela pediu, literal

> *"Talvez no local de ouvir no controle poderíamos colocar dois botões pra
> ativar giroscópio e acelerômetro e calibrar Sensores... **obviamente tudo
> ativo por default em todos os perfis até que eu mude.**"* (26/08)

E `D-AUDIO-E-GIRO-NASCEM-LIGADOS` já fechou o default: nasce **ligado**, e não
"sem opinião" — contrato que ela derrubou em 18/08.

## O que está medido

- **Não há campo.** `grep -n "gyro\|sensor\|motion" profiles/schema.py` devolve
  **uma linha**, e é a citação dela num comentário (`:420`). O `Profile` não tem
  os campos, e a própria `D-CALIBRAR-SENSORES-NO-NATIVO` registra isso:
  *"não existe ainda — nenhum dos métodos do IPC toca sensor; o Profile não tem
  os campos"*.
- **O interruptor físico existe, e é um só.** `subsystems/gamepad.py:1718`,
  `start_motion_reader` / `:1764`, `stop_motion_reader` — o espelho de motion do
  físico para o vpad, já idempotente ("nunca dois readers no mesmo P1").
- **Os dois sensores viajam na MESMA janela**, e é o que torna dois
  interruptores possíveis sem dois caminhos: `uhid_gamepad.py:469-471` —
  `gyro[3]` nos bytes **15-20**, `accel[3]` nos bytes **21-26** de
  `payload[15:40]`; e `_MOTION_NEUTRAL` (`:479`) já é a janela neutra
  byte-a-byte. **Zerar meia janela desliga um sensor sem tocar no outro.**
- **O espelho é do P1.** A docstring do `start_motion_reader` diz *"o espelho de
  motion do P1"*, e ele só existe no caminho **uhid** (`:1721`: *"o uinput não
  tem `forward_motion`"*). Fato duro, e ele muda o que os botões podem prometer.

## O que esta sprint entrega

1. **`ProfileSensorsConfig`** no `schema.py`: `gyro: bool = True`,
   `accel: bool = True`. Aditivo, sem bump de versão, no molde do `mic` e do
   `speaker`. **O default é `True` nos dois** — é a decisão dela, e é o default
   do campo que a garante em perfil que nunca ouviu falar de sensor.
2. **A seção também em `ControllerOverrides`**, pela mesma razão do microfone na
   ONDA-CONTROLES-06: o alvo é a fita, e a fita endereça peça.
3. **`sensors.set` no IPC** (`ipc_handlers.py`), no molde de `mic.set`
   (`:4676`): `gyro`, `accel`, `uniq` opcional, validação estrita, e o estado de
   volta na resposta.
4. **A meia-janela neutra** no `uhid_gamepad`: com `gyro=False`, os bytes 15-20
   saem do `_MOTION_NEUTRAL`; com `accel=False`, os 21-26. Com os dois
   desligados, `stop_motion_reader` — não adianta espelhar janela inteiramente
   neutra a 250 Hz.
5. **Os dois botões do topo passam a mandar** (a fileira nasceu insensível na
   ONDA-CONTROLES-02): acesos quando o sensor está ligado, apagados quando não,
   e o gesto vai para o alvo da fita.

## Como se prova (o teste que morde)

`tests/unit/test_controles_os_sensores_tem_interruptor.py`:

1. **Meia janela, e só ela.** Com `gyro=False` e `accel=True`, os bytes 15-20 do
   payload emitido são os do `_MOTION_NEUTRAL` e os bytes 21-26 são os do
   físico. Depois o inverso. Arranque a cura (neutralize a janela inteira) e
   veja o acelerômetro morrer junto — que é o defeito que este teste existe para
   pegar.
2. **Os dois desligados param o reader.** `stop_motion_reader` é chamado uma
   vez, e chamado de novo não explode (idempotência já contratada).
3. **Nasce ligado.** Um `Profile` **sem** a seção `sensors` responde `True` nos
   dois. É a mordida de `D-AUDIO-E-GIRO-NASCEM-LIGADOS`: arranque o default e
   veja o giroscópio nascer morto num perfil dela de julho.
4. **O IPC sabe recusar.** `sensors.set` com `gyro="sim"` levanta com mensagem;
   com `uniq` inexistente, recusa com motivo. Régua que só sabe passar não é
   régua.
5. **O botão manda pela fita, não pelo card.** Fita em `Controle 2`: a chamada
   leva o `uniq` do Controle 2, com o clique dado em qualquer lugar.

## O que é dela decidir

1. **O espelho de motion é do P1.** Medido acima. *Os dois interruptores
   aparecem nos cards do Controle 2, 3 e 4 — sabendo que hoje não há giroscópio
   chegando ao jogo por lá —, ou nascem desabilitados com a frase que explica?*
   **PROVISÓRIO — decisão dela:** aparecem, e o que eles governam é a **leitura
   da interface** do card; nos cards sem espelho a dica diz que o jogo ainda não
   recebe motion desta peça. Prometer sem entregar é o defeito da
   NO-JOGO-SEM-FALSO-VERDE-01, e a saída é dizer, não esconder.
2. **Desligar o sensor apaga a leitura do card também, ou só o que vai ao
   jogo?** São dois consumidores do mesmo sensor
   (`core/physical_report_reader.py:7`), e a pergunta é de produto.
   **PROVISÓRIO — decisão dela:** só o que vai ao jogo. A leitura do card é
   diagnóstico, e apagá-la tiraria justamente a prova de que o sensor funciona.
3. **A `D-PERFIL-DE-DESEMPENHO` e a `D-AUDIO-E-GIRO-NASCEM-LIGADOS` se
   contradizem**, e a contradição está aberta desde 25/08: um perfil de economia
   que nasce com tudo ligado não economiza nada. *Qual vence?*
