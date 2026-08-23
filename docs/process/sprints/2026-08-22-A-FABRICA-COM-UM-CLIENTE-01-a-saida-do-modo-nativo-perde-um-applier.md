# A-FÁBRICA-COM-UM-CLIENTE-01 — a saída do Modo Nativo perde um applier

**22/08/2026.** A fábrica `gerente_do_daemon` nasceu em `62d092a` justamente
para que uma rota nova não montasse o `ProfileManager` com a própria lista de
appliers. Ela tem **um** cliente. As outras doze construções continuam à mão, e
uma delas já divergiu.

**Estado:** ABERTA

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
`reapply_speaker_on_connect`, que existe para reaplicar o alto-falante na
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

Uma linha, no molde das outras seis (`getattr`, como as irmãs). O embrulho do
`mode_applier` que já está ali **fica** — ele é a nota datada da
FEAT-PROFILE-MODE-01 e continua verdadeiro.

**Prova:** desligar o Modo Nativo com um perfil que tenha
`rumble.passthrough = False` e ver o passthrough voltar ao que o perfil pede, e
não ao que o jogo deixou.

### E2 — as rotas de ativação passam a vir da fábrica

As seis que hoje passam os sete appliers à mão viram chamadas a
`gerente_do_daemon`. É mecânico e é o que a fábrica prometia. A rota da E1 entra
junto — e aí o applier que falta não é acrescentado à mão: ele vem porque a
fábrica o traz.

**Cuidado medido:** `62d092a` mostrou que existe um caso em que o gerente nasce
DE PROPÓSITO com `mode_applier=None` (o ramo da allowlist do Steam Input). A
fábrica tem de aceitar esse par explícito, e o teste tem de guardá-lo — senão a
cura vira defeito.

### E3 — o portão da classe

Um teste que leia a árvore de sintaxe de `src/` e reprove **construção direta de
`ProfileManager` com um subconjunto PARCIAL dos appliers**: zero é legítimo,
sete é legítimo, e um subconjunto declarado (como o `speaker_applier` sozinho
do `reapply_speaker_on_connect`) precisa estar numa lista curta de exceções com
razão escrita.

A régua é o dataclass, **nunca a tupla `APPLIERS_DO_DAEMON`**: em `62d092a` a
primeira versão do teste iterava `APPLIERS_DO_DAEMON` para conferir
`APPLIERS_DO_DAEMON` e passava com um par arrancado. Contagem independente ou
não é régua.

---

## Como morde

Arranque o applier da E1 e o teste da E1 reprova pelo efeito, não pela
construção. Arranque um applier de qualquer rota de ativação e o portão da E3
reprova nomeando o arquivo, a linha e o applier ausente.

## O que este achado ensina

**Uma fábrica com um cliente não é uma fábrica — é mais um call site.** Ela só
começa a impedir a divergência quando as rotas passam por ela; até lá, ela
documenta a intenção e não a garante. E a divergência que já existia estava
descrita, com nome e data, num comentário dentro do próprio arquivo: a casa
sabia, e o produto não fazia.
