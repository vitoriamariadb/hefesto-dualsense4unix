# O TECLADO QUE SOBREVIVE AO DAEMON · 01 — quem fecha o que o daemon abriu

**Sprint:** `O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01` (lote LOTE-1, onda G)
**Árvore:** `hefesto-voo/O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01-opus`, branch
`voo/O-TECLADO-QUE-SOBREVIVE-AO-DAEMON-01-opus`, nascida de `onda/atual-0609`
(`39fa440d`, conferido).
**Bancada:** LIVRE, e **não foi usada** — a sprint é `bancada: false` e o §4 dela
proíbe janela de verdade nesta medição (ver *O que NÃO verifiquei*).

## O que mudou

Os três defeitos da sprint fecharam, e um quarto apareceu ao medir.

**(1) O `shutdown` fecha o que o daemon abriu** —
`src/hefesto_dualsense4unix/daemon/connection.py`. A função fechava o
`_keyboard_device` e passava direto pelo `_osk_controller`. Agora há o bloco
gêmeo, com `contextlib.suppress`, logo DEPOIS do device: o
`virtual_token_callback` do device aponta para `osk.dispatch_token`, e parar o
device primeiro fecha a porta por onde um token atrasado reabriria o teclado que
acabamos de fechar. É `osk.close()` direto e não `stop_keyboard_emulation`,
como a sprint manda — aquele derruba também o `TouchpadReader` e o device
virtual, que a função já trata do seu jeito.

**(2) e (3) o daemon novo herda o teclado do anterior** —
`src/hefesto_dualsense4unix/daemon/subsystems/keyboard.py`. O `open()` anota o
par **(PID, nome do binário que spawnou)** num arquivo de sessão, e o `close()`
o apaga. `aberto()`, `open()` e `close()` deixaram de perguntar ao
`self._process` — que num controlador recém-criado é SEMPRE `None` — e passaram
todos por um `_pid_vivo()` novo, que olha o processo deste daemon e, na falta
dele, o órfão do anterior. O R3 deixa de ser no-op silencioso e o L3 deixa de
empilhar.

**Onde o arquivo mora, e a escolha é parte da cura:** `runtime_dir()`
(`XDG_RUNTIME_DIR/…/teclado-na-tela.json`), não o `config_dir` que a §3 da
sprint sugeriu pelo `utils/session.py`. O `XDG_RUNTIME_DIR` é varrido a cada
boot, então um PID de outra inicialização não sobrevive para ser confundido com
o de agora; o `config_dir` guarda ESCOLHA dela, que atravessa reboots de
propósito, e um PID atravessando reboot é lixo perigoso. **A razão de não ter
ido para o `utils/session.py` é outra e é de posse:** aquele arquivo não está no
`posse:` desta sprint, e o protocolo manda relatar em vez de editar. As funções
ficaram em `keyboard.py`, que é meu (ver *O que sobrou para o próximo*).

**A adoção é conservadora, e isso era requisito.** `_adotar_orfao()` só devolve
um PID que passa nas três perguntas — (a) está no arquivo que este produto
escreveu e o binário anotado é um candidato que ele conhece, (b) o processo
existe de verdade, (c) o `/proc/<pid>/comm` casa com o binário anotado (truncado
a 15 dos dois lados, que é o `TASK_COMM_LEN` do kernel; `maliit-keyboard` tem
exatamente 15). Falhando qualquer uma, o arquivo é esquecido e a resposta é
`None`. **Matar por nome continua proibido** — o órfão morre por `SIGTERM` no
PID adotado, nunca por padrão.

**(4) O DEFUNTO POR COLHER — a quarta forma de "o PID existe" mentir, e ela não
estava na sprint.** Apareceu medindo: um processo morto cujo pai ainda não
chamou `wait` mantém `/proc/<pid>` e `/proc/<pid>/comm` **intactos**, com o nome
certo do binário. Ele passaria nas três perguntas inteiras, e o produto
concluiria que há teclado aberto onde não há mais nada desenhado — o L3 dela
nunca mais abriria nenhum. `_pid_e_zumbi()` lê o estado no `/proc/<pid>/stat`
(o campo depois do ÚLTIMO `)`, porque o `comm` vem entre parênteses e pode
conter espaços) e a adoção o recusa.

## Qual mordida prova

`tests/unit/test_o_teclado_nao_sobrevive_ao_daemon.py` — **8 casos, verdes.**

**Ela mede com PROCESSO DE VERDADE**, que é a medição do §1 da sprint repetida:
o que se mede é o ciclo de vida do processo, não a janela. O `sleep` faz o papel
do `wvkbd-mobintl` pelo caminho declarado do produto (`_OSK_SPAWN_ARGS` mais o
cache `_resolved_bin`/`_resolved_checked`/`_resolved_em`, os três atributos que o
§4 manda dublar). **Nenhuma janela nasce** — o teclado na tela é `layer-shell` e
apareceria por cima do workspace dela. O que fica real é o que decide: o PID é
do kernel, o `/proc/<pid>/comm` é do kernel, e o `SIGTERM` mata de verdade.

**CINCO ARRANCADAS, cada uma reprovando só o que promete** (`rc=1`, com a cura
devolvida em seguida):

| arranquei | reprovou |
| --- | --- |
| o bloco `osk.close()` do `shutdown` | `test_o_shutdown_do_daemon_fecha_o_teclado_na_tela` — *o processo continua VIVO depois do shutdown* |
| a leitura do arquivo de sessão (`_adotar_orfao` → `None`) | `…_adota_o_orfao_e_o_r3_fecha` e `…_nao_empilha_um_segundo_teclado` — o R3 vira no-op, e dois PIDs vivos onde devia haver um |
| a conferência do `/proc/<pid>/comm` | `test_pid_reciclado_pelo_kernel_nao_e_adotado` **e** `test_o_r3_nao_mata_o_processo_alheio_do_pid_reciclado` |
| o `or _pid_e_zumbi(pid)` da adoção | `test_o_defunto_por_colher_nao_conta_como_teclado_na_tela` |

**A RÉGUA MENTIU UMA VEZ, e o registro fica porque a forma é conhecida.** A
primeira versão do caso do PID reciclado anotava `"wvkbd-mobintl"` no arquivo —
e a `mesa` tinha acabado de tirar esse nome do `_OSK_CANDIDATES` para pôr o
dublê no lugar. A adoção recusava pelo guarda do **binário desconhecido** e
nunca chegava à comparação de `comm`: **arranquei a conferência do `/proc`
inteira e os seis casos ficaram VERDES.** O instrumento respondia sobre outra
coisa que não o produto. Curado anotando o dublê, e o caso agora afirma antes de
medir que o `comm` do processo alheio difere do binário anotado.

**E o caso do reciclado é DOIS casos de propósito.** Num teste só, a asserção da
recusa dispara primeiro e o estrago — *o R3 matou processo alheio* — nunca chega
a ser medido, que é como uma cura pela metade atravessaria o vermelho.

Regressão: **110 verdes** nos vizinhos (`test_o_l3_alterna_o_teclado_na_tela`,
`test_osk_handler`, `test_emulacao_no_jogo_teclado`,
`test_ambiente_presumido_01_o_que_a_maquina_nao_tem`,
`test_teclado_na_tela_no_install`, `test_daemon_shutdown` e a régua nova).

## O que NÃO verifiquei

- **Nenhum `wvkbd-mobintl` de verdade abriu, e nenhum DualSense foi tocado.** A
  bancada estava LIVRE, mas a sprint é `bancada: false` e o §4 dela proíbe
  janela de verdade nesta medição, pelo motivo da tela dela. O que ficou por
  medir no aparelho é o par de gestos físicos: **o L3 e o R3 apertados num
  DualSense**, com um `wvkbd` real na tela, através de um `shutdown` de verdade.
  Fica para a `MESA-DE-QUATRO-01`, e a célula do mapa é `entrada.botoes` /
  `dualsense`.
- **Não medi o caminho do systemd.** A §2 da sprint diz que o
  `KillMode=control-group` cobre o defeito (1) por acidente na instalação dela;
  não reconferi isso, e não chamei `systemctl` (a sprint não pede, e o preâmbulo
  exige `bancada.sh exigir` antes de qualquer `systemctl`).
- **Não medi o `onboard` sob X11**, nem `squeekboard`/`maliit-keyboard`. A cura
  é agnóstica ao binário — ela compara o `comm` com o nome que ela mesma
  spawnou —, mas os quatro candidatos não foram exercitados um a um.
- **Não medi a corrida de dois daemons subindo ao mesmo tempo.** O arquivo é
  escrito com `mkstemp` + `os.replace` (atômico), mas dois daemons vivos
  simultâneos não é cenário que este trabalho tenha exercitado.
- **Não abri a interface.** Este trabalho não toca a tela: nada aqui muda gesto,
  texto de tela ou default, como a §5 da sprint declara.

## O que sobrou para o próximo

- **O `utils/session.py` continua sem saber do teclado na tela.** A §3 da sprint
  mandava pôr o arquivo lá, ao lado do `save_paused_state` e do
  `load_gamepad_emulation`; ele **não está no `posse:` desta sprint**, então
  relatei em vez de editar. As três funções (`_sessao_do_teclado`,
  `_gravar_sessao`, `_esquecer_sessao`) vivem hoje em `keyboard.py`. Quem tiver
  `utils/session.py` na posse pode mudá-las de casa sem tocar na lógica — mas
  **o destino tem de continuar sendo o `runtime_dir`**, e não o `config_dir` que
  as vizinhas de lá usam, pela razão do reboot descrita acima.
- **O `starttime` do `/proc/<pid>/stat` (campo 22) fecharia a última fresta.** A
  conferência de hoje é `comm`; um PID reciclado que por acaso rode um binário
  de MESMO NOME seria adotado. Gravar o `starttime` junto do PID e compará-lo
  torna a identificação exata. Não entrou porque a sprint pede três perguntas e
  eu não queria um ramo sem mordida — e a janela de erro que sobra é estreita.
- **A célula `entrada.botoes` / `dualsense` do mapa continua com o
  `cabo_ate_onde_foi` e o `radio_ate_onde_foi` VAZIOS**, e este trabalho não os
  preenche: o que exercitei foi o `dispatch_token` com dublê, não o botão no
  aparelho. Quem escreve o mapa é a `SPECS-A-PROCEDENCIA-01`.
- **A sprint irmã continua aberta:**
  [O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01](../../sprints/2026-08-30-O-TECLADO-QUE-NAO-DIZ-COMO-SAIR-01-o-L3-abre-e-a-tela-cala.md)
  — o que a tela diz quando o teclado abre. Aquela encosta nela; esta não.
- **Uma nota de rota para quem despachar:** a nota **ROTA CORRIGIDA** manda
  conferir o nome do atributo do cache do `_resolve` e diz que *"o erro de 30/08
  está no fim do arquivo"*. **Não há nada no fim do arquivo da sprint** — ela
  termina na §5. Os três nomes citados na nota (`_resolved_bin`,
  `_resolved_checked`, `_resolved_em`) conferem com o código, e foram esses os
  usados.
