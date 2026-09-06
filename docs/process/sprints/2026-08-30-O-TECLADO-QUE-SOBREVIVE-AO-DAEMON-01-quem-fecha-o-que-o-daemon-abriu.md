---
sprint: O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01
estado: feita
onda: G
posse:
  OSK:
    - src/hefesto_dualsense4unix/daemon/connection.py
    - src/hefesto_dualsense4unix/daemon/subsystems/keyboard.py
cria:
  - tests/unit/test_o_teclado_nao_sobrevive_ao_daemon.py
bancada: false
depois_de: []
nao_toca: []
---

> **ROTA CORRIGIDA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** **Vale inteira, sem decisão dela e sem bancada.** Os três defeitos continuam no código
(remedido em 06/09): `connection.py:1286` (`shutdown` não chama `osk.close()`),
`keyboard.py:251` (`close()` volta se `_process is None`) e `:232` (o guarda do `open()` não
conhece o órfão). A cura é um arquivo de sessão com o PID + `/proc/<pid>/comm` para adotar
só o que é nosso. **Dublar o binário** (`_OSK_SPAWN_ARGS` + `_resolved_bin`/`_resolved_checked`/
`_resolved_em`) — o teclado é `layer-shell` e nasce na tela dela; confira o NOME do atributo
antes (o erro de 30/08 está no fim do arquivo). A COOP-QUE-NAO-DESMONTA-01 não toca mais
`connection.py`, então esta sprint não espera ninguém.

> **ESTADO 2026-09-06: feita** — os três defeitos fecharam: o `shutdown` chama
`osk.close()`, e o arquivo de sessão `teclado-na-tela.json` (no `runtime_dir`,
com PID + binário) faz o daemon novo adotar o órfão do anterior, de modo que o
R3 fecha e o L3 não empilha. A adoção é conservadora — arquivo nosso, PID vivo
e `/proc/<pid>/comm` casando — e uma QUARTA forma de mentir apareceu ao medir,
o DEFUNTO por colher, que passaria nas três perguntas com `/proc` intacto. Oito
casos em `tests/unit/test_o_teclado_nao_sobrevive_ao_daemon.py`, cinco
arrancadas provadas. Entrega:
`docs/process/agentes/2026-09-06/O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01-opus.md`.

# O TECLADO QUE SOBREVIVE AO DAEMON · 01 — quem fecha o que o daemon abriu

**O defeito, numa frase:** o daemon abre o teclado na tela e **para sem
fechá-lo**; o daemon seguinte **não sabe que aquele teclado existe**, então o R3
dela não fecha nada e o L3 empilha um segundo por cima do primeiro.

É a forma exata do `[[a-casa-sabe-e-o-produto-nao-faz]]`: **a cura está escrita,
testada e nunca é chamada.** `stop_keyboard_emulation` (`keyboard.py:373`) fecha
o teclado na tela na linha 388 — e o `shutdown` do daemon
(`daemon/connection.py:1286`), que é o que roda no `finally` do `run()`
(`lifecycle.py:993`), **não o chama**. Ele fecha o `_keyboard_device` e passa
direto pelo `_osk_controller`.

## 1. Medido

30/08/2026, sem tocar a tela dela: `sleep` faz o papel do `wvkbd` — o que se mede
é o **ciclo de vida do processo**, não a janela. Caminho público em todos os
passos (`shutdown()` de verdade, `dispatch_token` de verdade).

```
L3 abre o teclado na tela   : pid=2597313 VIVO
o daemon PARA (shutdown)    : VIVO   <- ficou na tela dela
daemon novo, ela aperta R3  : VIVO   <- o R3 não fecha
daemon novo, ela aperta L3  : abriu um SEGUNDO teclado, pid=2597314
```

**Os três defeitos são independentes**, e é por isso que a régua precisa de três
arrancadas:

1. **`shutdown` não fecha** — `daemon/connection.py:1286`, o `_osk_controller`
   não aparece na função.
2. **O daemon novo não adota** — `close()` (`keyboard.py:251`) volta na primeira
   linha quando `self._process is None`, e um `_OSKController` recém-criado tem
   sempre `None`. O R3 é um no-op silencioso.
3. **O L3 empilha** — o guarda do `open()` (`keyboard.py:232`) pergunta pelo
   `self._process` do controlador, que não conhece o órfão. A docstring do
   controlador promete o contrário: *"Abrir quando já há processo ativo é no-op
   (evita stack de janelas sobrepostas)"* — a promessa vale dentro de um daemon
   só.

## 2. O alcance real — e por que o defeito é menor do que parece

**Na instalação dela, o systemd cobre o (1).** O daemon roda como
`hefesto-dev-dualsense4unix.service` / `hefesto-dualsense4unix.service`, com
`KillMode=control-group` (medido em 30/08), e o teclado nasce **dentro do cgroup
do serviço** — parar ou reiniciar pelo `systemctl` leva o teclado junto.

Quem fica descoberto:

- **quem roda o daemon fora do systemd** — `daemon start --foreground` à mão, que
  é como esta casa trabalha o dia inteiro;
- **os (2) e (3), sempre** — eles não dependem de como o daemon morreu. Basta um
  `wvkbd` aberto por outra coisa (o próprio COSMIC, um `wvkbd` que ela abriu à
  mão) para o R3 recusar e o L3 empilhar.

**O preço da rede acidental é que ela some sem aviso**: se um dia a unidade ganhar
`KillMode=process`, ou o produto virar Flatpak com outro modelo de sessão, o (1)
volta e ninguém vai ligar os pontos.

## 3. A cura

### (1) o `shutdown` fecha o que abriu — `daemon/connection.py`

Ao lado do bloco que já fecha o `_keyboard_device` (`connection.py:1356`, o
`if getattr(daemon, "_keyboard_device", None) is not None`), o mesmo padrão para
o `_osk_controller`, com `contextlib.suppress` — a regra desta função é que
limpeza quebrada nunca derruba a parada.

**Não** chamar `stop_keyboard_emulation` inteiro: ele também derruba o
`TouchpadReader` e o device virtual, que o `shutdown` já trata do seu jeito.
Chamar `osk.close()` direto, que é a única parte que falta.

### (2) e (3) o daemon novo herda o teclado do anterior — `keyboard.py`

O PID vai para um arquivo de sessão no `open()` e sai dele no `close()`; o
`_OSKController` lê esse arquivo na primeira vez que precisa saber se há teclado
aberto. **A porta que já existe é `utils/session.py`** — é onde moram o
`save_paused_state` e o `load_gamepad_emulation`, e o teclado na tela é estado de
sessão pela mesma razão que eles.

**A adoção tem de ser CONSERVADORA, e isso é requisito, não detalhe.** Só se
adota um PID que (a) está no arquivo que este produto escreveu, (b) ainda existe,
e (c) tem no `/proc/<pid>/comm` o binário que este produto abre. Sem os três,
esquece o arquivo e segue. **Matar por nome (`pkill wvkbd`) está PROIBIDO**: ela
pode ter um teclado na tela aberto pelo COSMIC ou pela mão dela, e fechar o que
não foi o produto que abriu é estrago, não cura.

## 4. A MORDIDA

Régua nova: `tests/unit/test_o_teclado_nao_sobrevive_ao_daemon.py`. Três
arrancadas, cada uma reprovando **só** o que promete:

| a régua exige | arranque isto | tem de reprovar com |
|---|---|---|
| o `shutdown` fecha o teclado | o `osk.close()` do `shutdown` | o processo continua `VIVO` depois do `shutdown` |
| o daemon novo adota e o R3 fecha | a leitura do arquivo de sessão | o R3 vira no-op e o processo continua `VIVO` |
| o L3 não empilha | o mesmo | dois PIDs vivos onde devia haver um |

E **duas provas de que a adoção não pega o que não é dela**, que são o que separa
esta cura de um `pkill`:

- PID no arquivo que já morreu → nada é adotado, nada estoura, o L3 abre normal;
- PID vivo cujo `/proc/<pid>/comm` **não** é o binário do teclado (um PID
  reciclado pelo kernel) → **não** é adotado, e o R3 não mata o processo alheio.

**Nada de janela de verdade** — o teclado na tela é `layer-shell` e aparece por
cima de todos os workspaces, o dela inclusive. Dublar o binário pelo
`_OSK_SPAWN_ARGS` mais o cache `_resolved_bin` / `_resolved_checked` /
`_resolved_em` do `_resolve`, que é como a medição do §1 rodou.

## 5. O que é dela decidir

Nada aqui muda gesto, texto de tela ou default. **É conserto, não decisão** — o
produto passa a cumprir o que a docstring dele já promete. A pergunta que
encosta nela é outra, e está na sprint irmã
([O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01](2026-08-30-O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01-o-L3-abre-e-a-tela-cala.md)):
o que a tela diz quando o teclado abre.
