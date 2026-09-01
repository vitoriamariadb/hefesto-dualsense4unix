---
sprint: MIGRA-JOGAR-11
onda: MIGRA-JOGAR
posse:
  J11:
    - src/hefesto_dualsense4unix/integrations/uinput_gamepad.py
    - src/hefesto_dualsense4unix/app/actions/home_actions.py
cria:
  - tests/unit/test_migra_jogar_11_a_mascara_nintendo_pro.py
bancada: false
depois_de:
  - ONDA-JOGAR-01
  - ONDA-SISTEMA-01
  # SÉRIE: a 01 também abre `app/actions/home_actions.py` (o poller e o
  # `ABA_INICIO`). Aqui só se toca `_FLAVOR_ITEMS`, mas é o mesmo arquivo.
  - MIGRA-JOGAR-01
nao_toca:
  - src/hefesto_dualsense4unix/daemon/subsystems/external_mask.py
  - src/hefesto_dualsense4unix/integrations/virtual_pad.py
  - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA JOGAR · 11 — a terceira máscara, Nintendo Pro

**Por que esta sprint existe, e por que ela é a décima primeira de uma onda que o
censo contou em dez:** o desenho aprovado põe um bloco `.mascara` com **três**
chips em cada um dos quatro cartões (`layout/01-jogar.html:1073`, `:1466`,
`:1859`, `:2252`; o terceiro chip está em `:1076`, `:1469`, `:1862` e `:2255`), e
o catálogo do produto tem **duas** entradas (`integrations/uinput_gamepad.py:115`,
`FLAVORS`): `dualsense` e `xbox`. Uma busca em `docs/` por `MÁSCARA-NINTENDO-01`
— **o nome que o próprio mockup dá à sprint** (`01-jogar.html:2377`) — **não
devolve um arquivo**. Sem ela, a aba
nasce com um chip que não clica em nada.

## O que já está pronto, e é boa parte

`mascaras_validas()` (`daemon/subsystems/external_mask.py:201`) **deriva do
catálogo**, e o docstring diz por quê: *"uma máscara nova (digamos, um terceiro
sabor) passa a ser aceita aqui sem uma linha de edição — e, o que importa mais,
não existe aqui uma lista que possa divergir daquela."* Logo, **o disco e o
portão do IPC aceitam a terceira sem edição**.

## O que falta, e é onde mora o risco

1. **O descritor `uinput`** — ZL/ZR **digitais** (o Pro não tem gatilho
   analógico), e **−** e **+** no lugar de Criar e Opções.
2. **O VID/PID.** E há um invariante duro:

   > **O PID NÃO pode ser o `057e:2009` do Pro físico.** VPAD-04 — vpad e
   > aparelho real com o mesmo VID/PID **somem juntos da Steam**, e o jogo fica
   > com zero controles.

   O par do Pro está em `core/linhagem_nintendo.py:89` (`VIDPID_PRO =
   frozenset({"057e:2009"})`), e é de lá que a régua o lê. É a mesma armadilha
   que já obrigou a entrada `dualsense` a usar o Edge (`0x0df2`) e **nunca** o
   `0x0ce6` do físico — está escrito acima do próprio `FLAVORS`
   (`uinput_gamepad.py:113-114`) e no invariante **VPAD-06**, *"vpad nunca divide
   VID/PID com o físico"* (`uinput_gamepad.py:66-70`).
3. **O vocabulário, em quatro superfícies de uma vez.** `_FLAVOR_ITEMS`
   (`app/actions/home_actions.py:164`) é a frase-dona; a aba Perfis
   (`app/actions/profiles_actions.py`, `_MODE_KIND_ITEMS`) e o applet do COSMIC
   (`packaging/cosmic-applet/src/app.rs`) repetem os mesmos rótulos, e
   `tests/unit/test_vocabulario_das_quatro_superficies.py` **reprova quem mudar
   um lado só**.
4. **Os sinônimos da CLI/IPC** (`uinput_gamepad.py:181`, `FLAVOR_SINONIMOS`) e o
   `normalize_flavor` (`:236`). Cuidado: `:189` diz que *"não entram
   'nintendo'/'switch'/'pro'"* naquele mapa — hoje, porque a máscara não existe;
   quando ela existir, a chave canônica **não entra** ali (o resolvedor consulta
   o `FLAVORS` antes), e os sinônimos, sim.

## O que NÃO entra, e está medido

**Máscara não é adoção.** O mockup já registra o fato, e ele existe para a sprint
não prometer o que o aparelho não tem: o Pro Controller **não tem** microfone,
alto-falante, touchpad, lightbar RGB, gatilho adaptativo nem gatilho analógico —
99 linhas do `docs/data/mapa-controles.csv`. **Nada disso é aviso para esta
tela**: a máscara Nintendo Pro faz o **DualSense dela** aparecer como um Pro para
o jogo; ela não faz o Hefesto adotar um Pro.

Pelo mesmo motivo, esta sprint **não** desenha aviso de perda. A dica da tela já
diz o que muda de verdade: a máscara muda **o que o jogo vê**, e por isso os
botões que ele desenha; a luz, o gatilho e o giroscópio seguem por conta do
Hefesto em qualquer máscara.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_11_a_mascara_nintendo_pro.py`:

- **o PID não é o do aparelho real.** O par `vendor:product` da entrada nova
  **não pode** estar em `core/linhagem_nintendo.VIDPID_PRO` — o teste o lê de lá,
  nunca o digita. **A mordida:** ponha `057e:2009` — o teste reprova nomeando o
  VPAD-04/VPAD-06. Esta é a régua que impede o defeito que faz o jogo ficar
  com zero controles;
- **o disco e o IPC aceitam a terceira sem edição.** `mascaras_validas()` tem de
  conter a chave nova **sem** que o teste a acrescente à mão. **A mordida:**
  escreva a lista de máscaras à mão em `external_mask.py` — o teste reprova, e é
  o que impede a lista paralela que aquele docstring existe para evitar;
- **os botões do Pro estão no descritor.** ZL/ZR **digitais** (nenhum eixo
  analógico de gatilho), e os códigos de **−** e **+** no lugar de Criar e
  Opções. **A mordida:** copie o descritor do Xbox e troque só o nome — o teste
  reprova, porque os gatilhos saem analógicos e os dois botões ficam com o código
  errado. Um vpad que se chama Pro e se comporta como Xbox é a mentira mais fácil
  desta sprint;
- **as quatro superfícies andam juntas.** `test_vocabulario_das_quatro_superficies.py`
  já existe e já reprova; o rótulo novo entra nas quatro de uma vez.
  **A mordida:** acrescente só em `_FLAVOR_ITEMS` — o portão que já existe fica
  vermelho;
- **o vpad sobe e desce.** Criar e destruir com a máscara nova, e conferir que o
  nó `uinput` some. **A mordida:** deixe de destruir — o teste reprova contando
  nós. **1289 nós `uinput` num dia derrubaram a sessão gráfica dela**, e este é o
  caminho que os multiplica: a suíte roda no fim, em oito lotes, com a máquina
  livre.

## O que é dela decidir

- **A terceira máscara entra nesta onda ou depois do piloto?** Ela é backend
  puro e **não depende do ok dela sobre o piloto** — pode correr desde o primeiro
  minuto. Mas ela **cria uma opção nova no produto**, e opção nova é decisão de
  produto, não de execução.
- **O rótulo exato.** O desenho diz *"Nintendo Pro"* (`01-jogar.html:2255`), e
  ele passa a valer nas quatro superfícies.
- **Qual VID/PID.** A escolha tem de ser um par que **não** colida com nenhum
  aparelho que ela possa ligar na mesa — ela tem um Pro Controller e um 8BitDo, e
  os dois estão no `docs/protocol/driver-hid-nintendo-por-dentro.md`.
