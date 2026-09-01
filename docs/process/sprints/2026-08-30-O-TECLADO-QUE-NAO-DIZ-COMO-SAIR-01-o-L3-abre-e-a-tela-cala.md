---
sprint: O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01
onda: MIGRA-NAVEGACAO
posse:
  TECSAI:
    - src/hefesto_dualsense4unix/daemon/subsystems/keyboard.py
    - src/hefesto_dualsense4unix/integrations/desktop_notifications.py
cria:
  - tests/unit/test_o_teclado_avisa_como_sair.py
bancada: false
depois_de:
  # SÉRIE por R5 — `daemon/subsystems/keyboard.py` e
  # `integrations/desktop_notifications.py` são os dois arquivos disputados.
  # Esta sprint não tem dependência de CONTEÚDO com ninguém — o que ela precisa
  # já está no `dev`; o que há é disputa de POSSE do `keyboard.py`, com três.
  #
  # As duas últimas entraram em 31/08/2026: a conferência que o comentário
  # original mandava fazer ("Confira no DESPACHO quem mais os tem em posse")
  # nunca aconteceu — a sessão de 30/08 morreu antes. O
  # `check_colisao_de_sprints.py` acusou seis colisões, todas destas duas
  # sprints; os nomes abaixo saem do próprio portão.
  - O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01
  - ONDA-NAVEGACAO-01            # daemon/subsystems/keyboard.py
  - MIGRA-NAVEGACAO-12           # daemon/subsystems/keyboard.py
nao_toca:
  - src/hefesto_dualsense4unix/core/keyboard_mappings.py   # mudar o default é decisão dela (§4)
  - novo-layout/
  - layout/
  - docs/usage/
---

# O TECLADO QUE NÃO DIZ COMO SAIR · 01 — o L3 abre, e a tela cala

**O defeito, numa frase:** um clique no analógico esquerdo põe um teclado na tela
dela, **nada na tela diz o que abriu nem como fechar**, e a saída existe só num
arquivo de documentação que ninguém lê com o teclado tapando a barra de tarefas.

## 1. O que aconteceu, medido no relógio dela

30/08/2026. Ela abriu a sessão com uma pergunta: *"pq tem um teclado virtual
aberto? pode me ajudar a remover ele?"* — com a foto da tela.

O `journalctl --user` responde por que, em três linhas:

```
ago 30 00:29:23  osk_opened                binary=wvkbd-mobintl pid=2544963
ago 30 00:29:23  key_binding_virtual_emit  button=l3 phase=press   tokens=['__OPEN_OSK__']
ago 30 00:29:23  key_binding_virtual_emit  button=l3 phase=release tokens=['__OPEN_OSK__']
```

**O produto funcionou exatamente como desenhado.** O que falhou foi o resto:

| | |
|---|---|
| o teclado abriu às | **00:29:23** |
| ela perguntou o que era às | **00:49** — *vinte minutos depois* |
| o que a tela disse nesse intervalo | **nada** |
| o que a tela oferecia para fechar | **nada** |

O gesto é **clicar o analógico esquerdo** — o botão que se aperta sem querer com
o controle na mesa, no colo, ou num jogo que usa L3 para correr. E o gesto de
saída (R3) só existe em `docs/usage/hotkeys.md:114` e `:223`.

## 2. O que NÃO é defeito — duas afirmações minhas, derrubadas pela medição

Escrito aqui para ninguém reabrir. **As duas foram afirmadas por quem coordena
antes de medir, e as duas caíram.**

### (a) *"o L3 abre mas não fecha — não é toggle"* — é DESENHO, não defeito

`hotkeys.md:114` diz *"L3 / R3 — Abre / fecha o teclado na tela"*, e o mockup
aprovado por ela trata as duas como **ações separadas**: o seletor de cada botão
da aba Navegação (`layout/06-navegacao.html`) oferece **"Abrir o teclado na
tela"** e **"Fechar o teclado na tela"** como itens distintos, e a tabela de
`Telas Hefesto.dc.html:474-475` dá L3 a um e R3 ao outro.

Trocar isso por um toggle **contraria a especificação aprovada em nove arquivos**
(`hotkeys.md`, `quickstart.md`, `interface.md`, `troubleshooting.md`,
`instalacao.md`, `flatpak.md`, `versoes-validadas.md` e os dois do mockup). Vira
decisão dela — está no §4, com o preço.

### (b) *"o `close()` deixa processo zumbi"* — não deixa. Medido.

`_OSKController.close()` (`keyboard.py:251`) faz `terminate()` e **descarta a
referência** (`self._process = None`). O `Popen.__del__` do CPython colhe o
filho. Medido com o mesmo par de chamadas do produto:

```
depois do close():  sem zumbi
1,5 s depois     :  sem zumbi
após outro Popen :  sem zumbi
```

O zumbi que apareceu na mesa dela em 00:51 (`2544963 ZN <defunct>`) foi criado
por **quem coordena matando o processo por fora** — o daemon segurava a
referência viva e não tinha motivo para chamar `poll()`. Não é caminho do
produto. **Não há sprint aqui.**

## 3. A cura

**Uma notificação de desktop ao abrir**, na forma que a casa já usa para este
mesmo subsistema: `notify_teclado_na_tela_ausente`
(`integrations/desktop_notifications.py:359`) ganha irmã, e o `open()`
(`keyboard.py:232`) a dispara **no sucesso**, ao lado do `logger.info` que já
está lá.

A frase segue a regra desta casa — *toda frase de diagnóstico diz o quê, por quê
e o que fazer* (`[[quem-e-o-usuario-e-por-que-a-aba-ensina]]`):

> **Teclado na tela aberto**
> Você clicou o analógico esquerdo (L3). Clique o analógico direito (R3) para
> fechar.

**Só no sucesso.** O caminho da ausência já tem dono e já avisa; um segundo aviso
no mesmo gesto seria ruído.

## 4. O que é dela decidir — e o preço de cada um

Nenhum destes entra sem a palavra dela. **A cura do §3 não depende de nenhum**, e
é por isso que ela pode ir sozinha.

1. **O L3 vira toggle?** Preço: contraria o mockup aprovado em nove arquivos
   (§2a) e apaga a distinção abrir/fechar que o seletor da aba Navegação oferece.
   *Recomendação: não.* O caminho barato que resolve o mesmo problema é somar um
   **terceiro** item ao seletor — *"Abrir/fechar o teclado na tela (alternar)"* —
   sem tirar os dois que existem, e ela escolhe clicando.
2. **O gesto de fábrica passa a exigir combo (`PS + L3`)?** Mataria a abertura
   acidental de vez. Preço: o `PS + R3` já é a troca de ponte
   (`hotkeys.md:171`), então o polegar esquerdo passa a ter um combo e o direito
   dois — e o L3 sozinho fica sem função, que é regressão para quem usa o teclado
   na tela todo dia.
3. **A notificação do §3 é texto de tela**, logo passa pela PROVA-DE-TELA-01: a
   palavra final sobre a frase é dela.

## 5. A MORDIDA

Régua nova: `tests/unit/test_o_teclado_avisa_como_sair.py`. Caminho **público** —
`dispatch_token(TOKEN_OPEN_OSK, "press")` (`keyboard.py:265`), que é o que o L3
do controle chama.

O que ela tem de provar, e o que cada arrancada faz aparecer:

| a régua exige | arranque isto | tem de reprovar com |
|---|---|---|
| abrir notifica | a chamada da notificação no `open()` | nenhuma notificação emitida no press de L3 |
| a frase diz **R3** | o `R3` do texto | a frase não ensina a saída |
| **não** notifica quando já está aberto | o `return` do `open()` já-aberto | dois avisos para um teclado só |
| **não** notifica quando não há binário | o `_avisar_ausencia()` | os dois avisos no mesmo gesto |

**Nada de janela de verdade.** O teclado na tela é `layer-shell`: ele aparece
**por cima de todos os workspaces**, inclusive o dela. Quem executar dubla o
binário (`_OSK_SPAWN_ARGS`, mais o cache `_resolved_bin`/`_resolved_checked`/
`_resolved_em` do `_resolve`) — foi assim que a medição do §2b e a da sprint
irmã rodaram sem tocar a tela dela.

<!-- ERRO DE QUEM COORDENOU, 30/08/2026, escrito porque o processo é a entrega:
     a primeira tentativa de medição setou um atributo `_resolved` que NÃO
     EXISTE — o cache é `_resolved_bin` — o `_resolve()` correu de verdade,
     achou o wvkbd, e ABRIU UM TECLADO NA TELA DELA por ~20 s no meio da noite.
     A regra global é que nada meu nasce na frente dela; um `layer-shell` não
     tem workspace para ser parqueado, então aqui a única proteção é dublar o
     binário, e dublar exige conferir o NOME do atributo de cache antes. -->
