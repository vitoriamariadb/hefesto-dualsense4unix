# A-FÁBRICA-COM-UM-CLIENTE-01 — a saída do Modo Nativo perde um applier

**22/08/2026.** A fábrica `gerente_do_daemon` nasceu em `62d092a` justamente
para que uma rota nova não montasse o `ProfileManager` com a própria lista de
appliers. Ao ser diagnosticada, ela tinha **um** cliente; as outras doze
construções eram à mão, e uma delas já tinha divergido.

**Estado:** E2 e E3 ENTREGUES em 22/08. **E1 continua ABERTA** — ver abaixo.

---

## O defeito, em uma linha

**Applier ausente não levanta: a seção é ignorada em silêncio** — e a rota que
desliga o Modo Nativo passa **6 dos 7** appliers.

## O que foi MEDIDO em 22/08

Varredura por árvore de sintaxe sobre `src/`, contando as chamadas a
`ProfileManager(...)` e os kwargs terminados em `_applier`:

```
appliers declarados no ProfileManager: 7
  mouse · suppression · mode · rumble_policy · rumble_passthrough · speaker · mic

daemon/subsystems/ipc.py:37         appliers=7
daemon/subsystems/ipc.py:98         appliers=7
daemon/subsystems/autoswitch.py:170 appliers=7
daemon/subsystems/autoswitch.py:244 appliers=7
daemon/subsystems/hotkey.py:614     appliers=7
daemon/connection.py:261            appliers=7
daemon/lifecycle.py:1164            appliers=6   <-- FALTA rumble_passthrough_applier
daemon/connection.py:150            appliers=1   (deliberado, ver abaixo)
cli/cmd_profile.py:142              appliers=0
daemon/launch_env.py:992            appliers=0
daemon/launch_env.py:1730           appliers=0
daemon/lifecycle.py:4080            appliers=0
profiles/manager.py:1698            appliers=0   (é a própria fábrica)

gerente_do_daemon chamada em: daemon/launch_env.py:936   (uma vez)
```

**`lifecycle.py:1164` é `_reapply_last_profile`** — a rota que roda ao
**desligar o Modo Nativo**. É exatamente a rota que a
`PERFIL-REESCRITO-NA-PARTIDA-01` (leva de 05/08, item 6) corrigiu, e o comentário
dela está ali, no fonte, contando o efeito que ela sentia:

> *"esta rota era a única das quatro que montava o manager sem elas, e o efeito
> é o que ela sente ao desligar o Modo Nativo: gatilhos e LEDs voltam, mas a
> máscara do vpad, a política de rumble e o volume do alto-falante do perfil
> ficam como o jogo os deixou."*

Três foram acrescentados naquela leva. O `rumble_passthrough_applier` **existe
desde 14/07** (`4820cc5`) e é passado em seis outras construções — nesta, não.

**`connection.py:150` com um applier só é deliberado e não é defeito:** é o
`reapply_speaker_after_connect`, que existe para reaplicar o alto-falante na
conexão e nada mais.

## Por que importa

`profile.rumble.passthrough` decide se a vibração que o **jogo** manda atravessa
até o controle. Ao sair do Modo Nativo, o perfil é reaplicado — e essa seção
não é. O sintoma é a família inteira que esta casa já nomeou: **o produto
responde pelo transporte e nunca pelo efeito**. O perfil "foi reaplicado", e uma
seção dele ficou como o jogo a deixou.

E o custo maior não é este caso: é que **a próxima rota nasce com o mesmo
buraco**. Foi para impedir isso que a fábrica existe.

## O que NÃO é

- **Não é obrigar toda construção a usar a fábrica.** As cinco com zero
  appliers são legítimas: listar perfis, carimbar ponte, a própria CLI. Elas não
  ativam nada.
- **Não é a ELO-MUDO-01/E2.** Aquela faz o relatório NOMEAR as seções aplicadas;
  esta faz a seção ser aplicada. As duas juntas é que fecham o buraco — hoje,
  com a E2 no lugar, a seção ausente sairia do relatório sem chave nenhuma, que
  é ausência de notícia de novo.

---

## Entregas

### E1 — a rota da saída do Modo Nativo ganha o applier que falta

**ABERTA.** O conserto mora em `daemon/lifecycle.py::_reapply_last_profile`,
território de outra frente na leva de 22/08 — a mesma que estava reescrevendo o
arquivo naquele momento (QUATRO-MICROFONES-01). Não foi aplicado: tocar arquivo
de outra frente na mesma árvore custa o trabalho dela.

Com a E2 no lugar, o conserto deixou de ser "acrescentar a linha que falta" e
passou a ser trocar a construção inteira pela fábrica:

```python
manager = gerente_do_daemon(
    self,
    store=self.store,
    # O embrulho FICA: `set_native_mode(False)` já zerou `_native_mode`, e um
    # `last_profile` com `mode.kind=native` seria religado no mesmo instante.
    mode_applier=getattr(self, "_mode_applier_ao_sair_do_nativo", None),
)
```

**Prova, e ela já está escrita:**
`tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py::test_sair_do_modo_nativo_devolve_a_vibracao_ao_jogo`,
hoje com `xfail(strict=True)`. O caso é o dela: em Modo Nativo ela testa os
motores pela aba Rumble (o "Aplicar" FIXA a vibração em `config.rumble_active`)
e desliga o Modo Nativo — o perfil pede `rumble.passthrough=True`, o default de
TODO perfil, e a vibração tem de voltar ao jogo.

*(A prova que a sprint propunha — `rumble.passthrough = False` — não mede nada:
`apply_profile_rumble_passthrough` devolve na primeira linha quando o
passthrough é falso. O applier só age no sentido "solta o que a GUI fixou".)*

**Ao aplicar, no MESMO commit:** apague o `xfail` e a entrada
`daemon.lifecycle::_reapply_last_profile` de `_A_MAO_COM_RAZAO`. Os dois
reprovam de propósito quando a cura entra — foi medido: o `xfail` vira XPASS
estrito e o portão diz *"a tabela diz […]; a árvore diz […]. Se a rota foi
consertada, APAGUE a entrada"*.

### E2 — as rotas de ativação passam a vir da fábrica

**ENTREGUE.** Cinco construções em três arquivos viraram chamadas a
`gerente_do_daemon`: `subsystems/ipc.py` (`IpcSubsystem.start` e `start_ipc`),
`subsystems/autoswitch.py` (`AutoswitchSubsystem.start` e `start_autoswitch`) e
`subsystems/hotkey.py` (`build_profile_cycle_callback`). A fábrica passou de um
cliente a seis, e a lista repetida levou 144 linhas embora nos três subsistemas
(110 líquidas, contadas por `git diff --numstat`).

**O desvio virou parâmetro NOMEADO, e o saco genérico saiu.** A fábrica não
aceita mais `**sobrescritas`: um saco ao lado da lista é a lista à mão de volta,
com outro nome. O único desvio declarado é `mode_applier`, com as duas medições
que o justificam no docstring (a allowlist do Steam Input e a saída do nativo), e
a sentinela `HERDA_DO_DAEMON` separa "não informei" de `None`, que é escolha
legítima. Guardado por `test_a_fabrica_nao_tem_saco_generico` e
`test_mode_applier_explicito_vence_o_daemon`.

**Correção do que a sprint dizia:** o par medido em `62d092a` NÃO é
`mode_applier=None` — essa versão foi refutada no mesmo dia (barrava junto o
`gamepad_flavor`, que não é disputa nenhuma) e hoje a allowlist passa um
EMBRULHO. `test_rota_do_lancamento_mantem_o_desvio_da_allowlist` guarda o
embrulho, não o `None`.

**Duas rotas ficaram fora, e não é esquecimento** (`daemon/connection.py`,
território de outra frente na leva de 22/08):

- `reapply_speaker_after_connect` — não é rota de ativação. Um applier só, de
  propósito;
- `restore_last_profile` — declara os sete e NEUTRALIZA dois com `None`
  (`mouse_applier` por BUG-BOOT-RESTORE-FLIPS-EMULATION-01, `mode_applier` por
  FEAT-PROFILE-MODE-01: no boot a emulação vem dos flags persistidos). Migrá-la
  pede um `mouse_applier` nomeado na fábrica, pela mesma disciplina do `mode`.

As duas estão classificadas em `_A_MAO_COM_RAZAO`, com data e endereço.

### E3 — o portão da classe

**ENTREGUE:** `tests/unit/test_a_fabrica_do_gerente_e_a_unica_lista_de_appliers.py`.

A régua ficou mais estreita que a proposta: reprova **qualquer** construção
direta que declare applier, e não só o subconjunto parcial. Zero applier
continua legítimo por construção (listar perfis, carimbar ponte, a CLI — não
ativam nada); os sete à mão deixaram de ser legítimos, porque agora existe a
fábrica e passar por ela é a diferença entre uma cópia fiel e a MESMA lista.

O conjunto de acusações é derivado por AST a cada rodada; o que é escrito à mão
é a CLASSIFICAÇÃO, e ela é exaustiva — rota nova reprova por estar SEM
CLASSIFICAÇÃO. E a classificação é conferida contra a árvore: rota consertada
faz a entrada sobrar, e o portão cobra que ela seja apagada.

A régua é o **construtor** (`inspect.signature(ProfileManager)`), conferido
contra `APPLIERS_DO_DAEMON` — nunca a tupla contra ela mesma.

**Reuso, e o que NÃO foi reusado.** O `portao_a_casa_sabe_e_o_produto_nao_faz`
mede alcance por grafo de import a partir dos pontos de entrada declarados
(`61ba2ab`). Aquela máquina responde *"quem chama este símbolo?"*; aqui a
pergunta é *"que FORMA tem esta chamada?"*, e todo sítio de construção é por
definição um chamador — o grafo não mudaria verdicto nenhum sobre a forma. O que
ele responde e este portão precisa é se a rota está VIVA (dívida apontando para
módulo morto é paisagem), então `modulos_alcancados` entra como asserção e nada
mais. MEDIDO: as oito construções de `ProfileManager` que restam moram em CINCO
módulos, e os cinco estão nos 201 alcançados.

**Preço declarado da régua:** contar NOMES de parâmetro não vê um applier
passado como `None` de propósito — `restore_last_profile` declara os sete e
neutraliza dois, e para a varredura ela é "completa". Está escrito no cabeçalho
do portão e na razão da entrada.

---

## Como morde — verificado em 22/08, arrancando cada cura

- laço de injeção da fábrica → `pass`: as CINCO rotas convertidas reprovam
  nomeando a rota e os sete appliers ausentes;
- uma rota volta a montar à mão sem o passthrough: o portão da E3 reprova com
  `daemon.subsystems.hotkey::build_profile_cycle_callback (linha 620)` e a lista
  do que ela declarou;
- o conserto da E1 aplicado: o `xfail(strict=True)` vira XPASS e a tabela cobra
  a entrada que sobrou;
- `**sobrescritas` de volta na assinatura: `test_a_fabrica_nao_tem_saco_generico`
  reprova;
- a fábrica ignora o `mode_applier` explícito: o desvio da allowlist reprova;
- construção viva em módulo que ninguém alcança: o portão a nomeia.

## O que este achado ensina

**Uma fábrica com um cliente não é uma fábrica — é mais um call site.** Ela só
começa a impedir a divergência quando as rotas passam por ela; até lá, ela
documenta a intenção e não a garante. E a divergência que já existia estava
descrita, com nome e data, num comentário dentro do próprio arquivo: a casa
sabia, e o produto não fazia.

**E uma fábrica sem portão volta a ter um cliente.** O que impede a sexta rota
não é a fábrica existir — é o teste que reprova quem não passa por ela.
