---
sprint: MIGRA-JOGAR-10
estado: absorvida
onda: MIGRA-JOGAR
posse:
  J10:
    - src/hefesto_dualsense4unix/integrations/virtual_pad.py
    - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
cria:
  - tests/unit/test_migra_jogar_10_a_mascara_e_de_cada_controle.py
bancada: false
depois_de: [BORDA-DE-QUEDA-01, COOP-NA-CONEXAO-NATIVA-01, COOP-QUE-NAO-DESMONTA-01, JOGADOR-3-FANTASMA-01, LEVA-1, LEVA-DE-BACKGROUND-01, ONDA-CONEXOES-10, ONDA-CONTROLES-07, ONDA-CONTROLES-08, ONDA-JOGAR-05, ONDA-LANCADORES-06, ONDA-PERFIS-03, ONDA-VIBRACAO-04, ONDA-VIBRACAO-05, ONDA-VIBRACAO-06]
nao_toca:
  - src/hefesto_dualsense4unix/daemon/subsystems/external_mask.py
  - src/hefesto_dualsense4unix/integrations/uinput_gamepad.py
  - src/hefesto_dualsense4unix/integrations/uhid_gamepad.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 01). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA JOGAR · 10 — a máscara por controle deixa de ser desenho

**O defeito:** a tela desenha **doze chips** que escolhem a máscara **por
controle** (três em cada um dos quatro cartões), e por baixo deles há um
mecanismo que decide **uma só para a mesa inteira**. É o defeito mais caro desta
casa — a cura escrita e nunca ligada — e este é o exemplar vivo.

**O que já existe desde 15/08**, e não se reescreve:

- o **registro por MAC**, a **herança** (a máscara do jogo é o padrão) e a
  **validação** moram em `daemon/subsystems/external_mask.py`;
- `mascaras_validas()` (`:201`) deriva de `integrations/uinput_gamepad.FLAVORS`
  — não há lista paralela que possa divergir;
- os dois backends **já aceitam** a identidade:
  `UinputGamepad.for_flavor(..., identity=...)` (`uinput_gamepad.py:395-427`) e
  `UhidDualSense.for_flavor(..., identity=...)` (`uhid_gamepad.py:987-1030`).

> **PREMISSA SUPERADA em 29/08/2026, mais tarde no mesmo dia** (`A-MASCARA-POR-CONTROLE-01`): `make_virtual_pad` **ganhou** `identity` (`integrations/virtual_pad.py:153`) e resolve `mascara_efetiva(identity, flavor)` ANTES de escolher o backend; os dois chamadores passam o MAC (`daemon/subsystems/gamepad.py:2108`, `daemon/subsystems/coop.py:990`). Régua: `tests/unit/test_mascara_por_controle_manda_no_vpad.py`, 13 testes. **Não refaça este degrau** — o que sobra é o vpad não ser RECRIADO ao aplicar.
>
> Os três degraus abaixo ficam como REGISTRO do que foi medido pela manhã —
> os endereços deles apodreceram no mesmo dia.

**O que faltava eram três degraus, e o próprio cabeçalho do módulo os nomeia**
(`external_mask.py:46-58`). Medido na MANHÃ de 29/08:

1. **`integrations/virtual_pad.py:150-162` — `make_virtual_pad` não tem parâmetro
   `identity`.** `grep -c identity` no arquivo inteiro devolve **0**. As duas
   chamadas de dentro dele passam sem: `:210`
   (`UinputGamepad.for_flavor(key, rumble_sink=rumble_sink)`) e `:253`
   (`UhidDualSense.for_flavor(flavor, …)`).
2. **`daemon/subsystems/coop.py:972` chama `make_virtual_pad(self._flavor(), …)`
   com o flavor do JOGO** — tendo `player.identity` na linha **955**, logo acima.
3. **`daemon/subsystems/gamepad.py:1963-1967`** resolve o `key` de
   `daemon.config.gamepad_flavor` e nunca do MAC do primário.

Consequência exata: `mascara_efetiva` *"só tem o que responder quando recebe uma
`identity`"*, e **ninguém a passa**. O comportamento é idêntico ao de antes — o
que é de propósito, e está escrito: *"meia cura que muda comportamento é pior que
nenhuma."*

Falta ainda o **lado da escrita**: a rota IPC que grava a escolha dela ainda só
conhece a máscara da sessão.

## A ARMADILHA DO PRIMEIRO DEGRAU — está escrita, e custa o rumble

`external_mask.py:60-68`, em letra:

> `make_virtual_pad` tem de resolver a máscara efetiva **ANTES** de escolher o
> backend, e passar o resultado ao `_try_uhid`. O gate de lá (*"não é dualsense,
> logo não é meu"*) usa a máscara que recebe: se ele continuar recebendo a do
> **jogo**, um jogador que escolheu `dualsense` numa sessão `xbox` tem o uhid
> vetado e cai no `uinput` com máscara DualSense — **que é o par degradado onde a
> vibração do jogo morre** (VPAD-05 / SPRINT-GAME-RUMBLE-01).

A resolução é idempotente (`mascara_efetiva` de uma máscara já efetiva devolve
ela mesma), então resolver na factory e repassar a `identity` aos dois backends é
seguro. **Quem escrever isto na ordem errada entrega um defeito silencioso de
vibração, não um erro.**

## O que entrega

1. **`make_virtual_pad` recebe `identity`** e **resolve a máscara efetiva antes**
   do `_try_uhid`, repassando o resultado aos dois backends.
2. **`coop.py` passa `player.identity`** — o valor já está na linha ao lado —
   tanto na criação quanto no `vpad_ficou_para_tras` do laço de recriação
   (`external_mask.py:669`), senão um vpad criado com a máscara certa é recriado
   com a errada no tique seguinte.
3. **`gamepad.py` passa o MAC do primário.**
4. **A rota IPC de escrita aprende a identidade**, para a escolha dela ir ao
   registro por MAC em vez da sessão. `mascaras_validas()` já aceita o valor sem
   uma linha de edição.
5. **O chip da tela passa a mostrar a máscara VIVA daquele controle** — é o que
   destrava a MIGRA-JOGAR-04 e o que acende a fita desta aba
   (`app/app.py:1231`, hoje `_MOTIVO_ALVO_AINDA_NAO_LIGADO`).

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_10_a_mascara_e_de_cada_controle.py`:

- **a identidade chega, e é a de cada um.** Dublê de dois jogadores com MACs
  diferentes e escolhas diferentes (P1 `dualsense`, P2 `xbox`), sessão em
  `xbox`. Os dois vpads nascem com máscaras **diferentes**. **A mordida:**
  devolva `make_virtual_pad(self._flavor(), …)` a `coop.py` — o teste reprova
  com os dois em `xbox`, que é o comportamento de hoje;
- **a ordem do primeiro degrau.** P1 escolheu `dualsense` numa sessão `xbox`: o
  backend tem de ser o **uhid**, não o `uinput`. **A mordida:** resolva a máscara
  DEPOIS de escolher o backend — o teste reprova, e reprova pelo motivo certo (o
  gate do `_try_uhid` recebeu a máscara do jogo). **Esta é a mordida que importa
  mais**, porque o defeito que ela pega não aparece na tela: aparece como o jogo
  parando de vibrar;
- **a recriação não desfaz.** Rode o laço do co-op **três vezes** depois de o
  vpad estar de pé: a máscara não pode mudar entre os tiques. **A mordida:**
  arranque a `identity` do `vpad_ficou_para_tras` — o teste reprova no segundo
  tique. *Uma régua que roda o tique uma vez mede um instante, não um
  comportamento* — e este é o caso exato em que essa lição foi paga, em 29/08,
  com uma regressão que só aparecia 181 segundos depois e 67 testes verdes;
- **a escrita vai ao registro por MAC.** Grave a escolha pela rota IPC e releia
  do registro: a máscara é daquele MAC, e a da sessão **não** mudou.
  **A mordida:** grave na sessão — o teste reprova, e o defeito volta a ser "uma
  para a mesa";
- **sem `identity`, nada muda.** Chamador que não sabe de quem é o vpad continua
  recebendo a máscara do jogo. **A mordida:** faça `None` cair num padrão — o
  teste reprova. Essa compatibilidade é o que permite ligar isto sem parar o
  resto.

**A suíte toca nós `uinput` de verdade** — 1289 num dia derrubaram a sessão
gráfica dela —, e esta sprint mexe exatamente no caminho que os multiplica. A
suíte roda **no fim, em oito lotes, e com a máquina livre**. Ela é de quem
coordena.

## O que é dela decidir

**A máscara por controle entra antes ou depois da bancada?**

`external_mask.py:74-95` diz com todas as letras que **ninguém mediu** se um jogo
aceita dois vpads com máscaras diferentes ao mesmo tempo, e lista o ensaio que
resolveria: **quatro controles, um jogo com Steam Input aberto, P1 em
`dualsense` e P2 em `xbox`**, olhando três coisas nesta ordem — (1) os quatro
jogadores continuam existindo no jogo; (2) os prompts de cada um saem na máscara
**dele**, e não na do P1; (3) o rumble chega nos quatro.

*"Não prometa que funciona."* Qualquer resposta "não" transforma a escolha por
jogador num recurso **com aviso na tela**, não num defeito a caçar do nosso lado.

Ela disse que já viu funcionar. **O registro não existe** — e é o registro que
destrava, não a lembrança. Três saídas: **(a)** a bancada primeiro; **(b)**
entregar com aviso na tela; **(c)** entregar sem aviso, apostando na lembrança.
A **(c)** é a única que esta casa não sabe pagar se der errado.
