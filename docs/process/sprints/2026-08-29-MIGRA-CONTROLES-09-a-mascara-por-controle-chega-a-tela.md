---
sprint: MIGRA-CONTROLES-09
onda: MIGRA-CONTROLES
posse:
  MC9:
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
cria:
  - tests/unit/test_migra_controles_09_a_mascara_chega_ao_state_full.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-06
  # SÉRIE por R5: dividem `daemon/ipc_handlers.py`.
  - ONDA-CONTROLES-04
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  # COLISÃO DE ARQUIVO DECLARADA: `daemon/ipc_handlers.py`. Quem decide a
  # ORDEM entre ondas é quem coordena.
  - LEVA-DE-BACKGROUND-01
  - MIGRA-ILUMINACAO-11
  - MIGRA-JOGAR-10
  - MIGRA-SISTEMA-09
  - ONDA-JOGAR-05
  - ONDA-LANCADORES-06
  - ONDA-PERFIS-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
nao_toca:
  - src/hefesto_dualsense4unix/daemon/subsystems/external_mask.py
  - src/hefesto_dualsense4unix/integrations/uinput_gamepad.py
  - src/hefesto_dualsense4unix/integrations/virtual_pad.py
  - src/hefesto_dualsense4unix/daemon/subsystems/coop.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA CONTROLES · 09 — A máscara por controle chega à tela

**"A casa sabe e o produto não faz", em estado puro — e aqui é meia sprint.**

## O defeito

A linha de identidade de cada cartão diz **"vê como DualSense"**, e o gerador
escreve, no `title`, de onde isso vem: *"A escolha é por controle e mora na aba
Jogar (…) **Aqui é leitura**"*
(`novo-layout/_ferramentas/aba02.py`, `DE_ONDE_VEM_A_MASCARA`).

**Não há de onde ler.** Conferido em 29/08:

- a escolha **existe e sobrevive ao reboot**:
  `daemon/subsystems/external_mask.py` guarda a máscara **por aparelho**, em
  arquivo próprio, chaveada pela identidade da peça — com a decisão datada de
  15/08 escrita no `profiles/schema.py:862-881`: *"a máscara já tem um lugar por
  jogador (…) A máscara passa a ser do JOGADOR, com a do jogo como padrão
  herdado"*;
- **ela não é publicada**: `describe_controllers`
  (`core/backend_pydualsense.py:5100-5115`) não a traz, e
  `_enrich_controllers_per_controller` (`daemon/ipc_handlers.py:3176`) não a
  acrescenta. Uma busca por `external_mask` no `ipc_handlers.py` inteiro devolve
  **um comentário**, na linha 5024 — nenhuma leitura.

Resultado: **a linha mais visível do cartão não tem fonte.** Hoje ela é um texto
digitado no gerador; amanhã, sem esta sprint, ela seria um texto digitado no
Python.

## O que entrega

**Um campo, e nada mais.** `controllers[].mascara` no `daemon.state_full`,
acrescentado em `_enrich_controllers_per_controller`, lido do registro que já
existe:

- o valor vem de `mascara_efetiva`
  (`daemon/subsystems/external_mask.py:617`) — **a função canônica**, que já
  resolve a herança "sem escolha registrada, o jogador herda a do jogo";
- o campo diz **o valor e a procedência**: escolhido para esta peça, ou herdado
  do jogo. São coisas diferentes, e a tela que as confunde diz à pessoa que ela
  escolheu o que nunca escolheu — é o mesmo par `lightbar_rgb` /
  `lightbar_source` que esta aba já publica para a barra de luz;
- `None` continua sendo *"como ele mesmo"* — a **ausência** de máscara, e não um
  terceiro valor. O módulo já escreve por que
  (`external_mask.py:209-212`): *"Um valor para dizer 'sem valor' é a porta pela
  qual o default entra disfarçado de escolha."*

## Como se prova (a mordida)

`tests/unit/test_migra_controles_09_a_mascara_chega_ao_state_full.py`:

- **a máscara escolhida para uma peça aparece NAQUELA peça**: registre `xbox`
  para o segundo controle e afirme que só o segundo `controllers[]` a traz.
  **Publique a máscara do jogo para todos e veja reprovar** — este é o teste
  que separa "por controle" de "uma para a mesa";
- **herdada não é escolhida**: sem registro, o campo traz o valor do jogo **com
  a procedência dizendo que é herança**. Faça as duas procedências virarem uma
  e veja reprovar;
- **sem máscara é `None`, nunca uma string**: um controle sem escolha e sem
  jogo com `flavor` publica ausência. Devolva `"dualsense"` como padrão e veja
  reprovar — o default disfarçado de escolha é exatamente o que o módulo
  recusa;
- **o valor sai do catálogo, não de uma lista nova**: AST — nenhuma lista de
  máscaras escrita neste arquivo; o campo usa `mascaras_validas()`
  (`external_mask.py:201`), que lê `uinput_gamepad.FLAVORS`. **Escreva a lista
  à mão e veja reprovar**;
- **o daemon velho não mente**: com um daemon anterior a esta sprint, o campo
  vem **ausente**, e a tela mostra ausência — não "DualSense". Com install
  editable, cura de daemon só vale no próximo `start`, e o sintoma é a
  **AUSÊNCIA de dado**: quem testar sem reiniciar vai ver a linha vazia e
  concluir que a ponte quebrou.

## O que é dela decidir

**"Nintendo Pro" está na tela e não existe no produto.** O catálogo tem dois
sabores — `integrations/uinput_gamepad.py:114` (`FLAVORS`), e
`profiles/schema.py:585` e `:694` são `Literal["dualsense", "xbox"]`. O mockup
mostra as **três** máscaras ao mesmo tempo (P1 e P3 DualSense, P2 Xbox 360, P4
Nintendo Pro), e o gerador já registra que isso é dívida: *"A Nintendo Pro ainda
não existe no catálogo do produto (…): nasce como sprint, e está dito na
legenda."*

**As duas saídas, com o preço de cada uma:**

- **nasce a máscara nova.** É barato onde ninguém espera —
  `mascaras_validas()` lê `FLAVORS`, então uma entrada nova é aceita **sem uma
  linha de edição** no resto. O que custa é o `FLAVORS` em si (nome, vendor,
  product) e o invariante duro já medido: **o PID forjado não pode ser
  `0x2009`**;
- **a terceira opção sai do desenho até existir.** Custa a lição que o mockup
  ensina com ela — que a linha muda de peça para peça —, e três máscaras iguais
  em quatro cartões não ensinam nada.

**E há uma pergunta maior atrás desta, que NÃO é desta aba e trava a de lá:** a
escolha por controle era cura escrita e nunca ligada. **SUBSTITUÍDO na tarde de
29/08/2026** (`A-MASCARA-POR-CONTROLE-01`): esta passagem dizia que
`virtual_pad.py` não tinha `identity` e que `coop.py` chamava com o sabor do
jogo. **Os dois foram curados** — `virtual_pad.py:153` recebe `identity` e
resolve `mascara_efetiva` antes do backend; `coop.py:990` e `gamepad.py:2108`
passam o MAC. Esta aba **lê**; quem **escolhe** é a onda da aba Jogar, e lá o que
sobra é o vpad não ser RECRIADO ao aplicar.
