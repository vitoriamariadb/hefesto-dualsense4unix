# A-PERNA-QUE-FALTA-01 — quatro chamadores perguntam o perfil ativo a uma perna só

**Branch:** `voo/A-PERNA-QUE-FALTA-01-opus` · nascida de `onda/0911b` (`7aa7ca68`)
**Bancada:** não pedida, não usada — nada desta leva toca o aparelho.

---

## O que mudou

**Os QUATRO chamadores curados, e mais DOIS que o levantamento da §3 achou.**

| # | onde | antes | agora |
| --- | --- | --- | --- |
| 1 | `pacotes/rodape.py:365` · `aplicar` | `str(ctx.state.get("active_profile") or "")` | `perfil.nome_do_ativo(ctx.state)` |
| 2 | `pacotes/rodape.py:388` · `salvar` | idem | idem |
| 3 | `pacotes/rodape.py:418` · `exportar` | idem | idem |
| **4** | `daemon/ipc_handlers.py` · `_mascara_no_perfil` | `getattr(self.store, "active_profile", None)` | `self._perfil_que_grava()` |
| 5 | `daemon/ipc_handlers.py` · `_handle_rumble_motores_set` | idem | idem |
| 6 | `daemon/ipc_handlers.py` · `_handle_sensor_set` | idem | idem |

**A segunda perna do daemon é `_perfil_que_grava` (`ipc_handlers.py:5243`)**, e ela
não inventa política: pergunta a `utils/session.resolve_boot_profile()` — **o
mesmo resolvedor que `daemon/connection.py:275` usa para restaurar o perfil ao
ligar**. Curar o quarto devolve ao gesto a simetria que o boot já tinha.
`utils/session.py` está em `nao_toca` e não foi tocado: ele é chamado.

**E ela CONFIRMA o nome antes de devolvê-lo.** A docstring do resolvedor avisa
que ele *"só resolve NOMES — não valida se o perfil carrega"*; sem a
confirmação, um marker órfão (perfil renomeado ou apagado) trocaria o
`sem_perfil` calado de hoje por um `FileNotFoundError` no meio de um gesto dela.
Piorar não é curar.

**A §4 — o motivo que morria na ponte.** `ponte.chamar_detalhado` passou a juntar
**as duas formas de o daemon dizer não**: `_call_checked_detalhado` +
`_recusa_no_corpo`, que é o padrão que `trigger_set_detalhado` e
`trigger_reset_detalhado` já usam no `ipc_bridge`. E
`a01_jogar.mascara_do_controle` deixou de chamar `ponte.chamar` (que devolve
`bool`) — hoje ele lê o `motivo` e o traduz para o cartão.

**As três frases, e nenhuma nomeia o estado interno** (ordem dela de 07/09,
*"o layout não informa os nossos defeitos"*). Elas dizem **as duas metades**
(`AS-DUAS-ABAS-FALAM-01`) e o que ELA faz a seguir:

```
sem_perfil    A máscara vale agora, mas não ficou guardada: escolha um perfil
              na aba Perfis e ela passa a ser lembrada nele.
sem_endereco  A máscara vale agora, mas o perfil recusou guardá-la só para este
              controle: ele não se identifica de um jeito que o perfil saiba mirar.
(desconhecido) A máscara vale agora, mas não consegui guardá-la no perfil.
sem_mudanca   (silêncio — o perfil JÁ guardava essa máscara; quem responde é a piscada)
```

**O CENSO DA §3 — todo leitor de `store.active_profile` no `ipc_handlers`, e a
separação é o produto:**

| função | classificação | por quê |
| --- | --- | --- |
| `_perfil_que_grava` | **GRAVA** | é o dono; os TRÊS gravadores passam por ele e nenhum lê o store por conta própria |
| `_handle_profile_switch` | só relata | devolve `profile.name` do perfil que ACABOU de trocar |
| `_handle_daemon_status` | só relata | `snap.active_profile` — quem pergunta ao daemon quer saber o que o DAEMON sabe |
| `_handle_daemon_state_full` | só relata | idem |

**Não se curou por simetria.** Para os três de baixo, `null` quando o daemon não
sabe é a **resposta certa**; curar custaria trocar "o daemon não sabe" por "o
disco acha", que é outra afirmação. Quem tinha de cair no disco é quem GRAVA,
porque aí o `null` custa dado dela. O censo tem régua
(`test_o_censo_dos_leitores_do_store_no_ipc_handlers`): **um leitor novo do store
que ninguém classificar reprova** — é assim que "quatro pernas" para de crescer
em silêncio.

**Dois fatos velhos SUBSTITUÍDOS** (regra da casa, não apagados por gosto):
`a01_jogar.METODOS` declarava uma dívida que já estava paga dos dois lados —
`gamepad.mask.set` tem teto em `ponte.TETOS` desde 04/09, e o gesto passou a ler
o retorno hoje.

---

## Qual mordida prova

Régua nova: `tests/unit/test_a_perna_que_falta_01_a_segunda_perna_do_perfil_ativo.py`
— **14 testes, e todo caminho de escrita termina num `json.load` do arquivo do
perfil**. O que decide esta sprint é o BYTE, não o retorno: um handler pode
devolver `gravado: True` sem ter escrito nada, e foi essa a folha corrida da
máscara em 04/09.

**A régua não escreve no `~/.config` dela, e há trava:** a fixture confere que
`profiles_dir()` **não** cai sob o lar real, lido do `passwd` e **não do
`$HOME`** — perguntar ao `$HOME` seria medir o desvio com o próprio desvio,
que é a armadilha de 07/09 (*a trava que se mede contra a própria saída*). As
duas primeiras versões da guarda caíram, e a razão está escrita na fixture.

### 1 — a perna do rodapé, arrancada

As três linhas voltaram a `str(ctx.state.get("active_profile") or "")`:

```
FAILED ... ::test_o_salvar_grava_com_o_daemon_calado
FAILED ... ::test_o_aplicar_e_o_exportar_atravessam_com_o_daemon_calado
2 failed, 12 passed
```

### 2 — a perna do daemon, arrancada · e o JSON fica byte-idêntico

`_perfil_que_grava` sem a perna do disco:

```
FAILED ... ::test_o_daemon_calado_cai_no_marcador_do_proprio_boot
FAILED ... ::test_a_mascara_entra_no_perfil_com_o_daemon_calado
FAILED ... ::test_a_barra_de_motor_tambem_esperava_a_segunda_perna
3 failed, 11 passed
```

E a mensagem da segunda é o ponto inteiro — **a chave `controllers` não existe
no arquivo**:

```
assert depois["controllers"][P1_CHAVE]["mascara"] == "xbox"
E   KeyError: 'controllers'
```

### 3 — `chamar` de volta no lugar de `chamar_detalhado`

```
FAILED ... ::test_a_recusa_do_corpo_vira_frase_no_cartao
FAILED ... ::test_um_motivo_desconhecido_nao_chega_cru_ao_cartao
2 failed, 12 passed
```

E a irmã dela, arrancando a leitura da recusa NO CORPO da ponte
(`_call_checked` sozinho de volta):

```
FAILED ... ::test_a_ponte_junta_as_duas_formas_de_o_daemon_dizer_nao
1 failed, 13 passed
```

### 4 — a que morde mais: o store calado E o `session.json` valendo

Com a cura **arrancada**, o MESMO clique, em dois lares separados:

```
store='bancada'  gravado=True   motivo=None         controllers={'aabbcc000001': {'mascara': 'xbox'}}  byte-identico=False
store=None       gravado=False  motivo='sem_perfil' controllers=None                                   byte-identico=True
```

**É a prova de que só a combinação revela o defeito** — e a razão de nenhuma
régua desta casa o ter visto: todas davam ao dublê de store um perfil que o
daemon sabia. Com a cura devolvida, os 14 passam.

### 5 — os dublês que eram mais frouxos que o produto

Três `_Ponte` de teste só tinham `chamar` e o `PonteDeMentira` de
`test_os_botoes_tem_dono` respondia `True` a **qualquer** nome — um
`ok, motivo = …` estouraria só na mão dela. Os quatro foram apertados para a
assinatura real (`chamar_detalhado(metodo, **params) -> (ok, motivo)`, **sem**
`timeout`, que a ponte real não tem). É a cicatriz de 04/09 com a máscara e a de
05/09 com o co-op, pela terceira vez.

### A TELA — o piloto de verdade, janela OCULTA, zero contato com o daemon dela

`hefesto_vivo.Piloto` com `oculta=True` (Xvfb próprio), `HOME` e os cinco `XDG_*`
desviados, `mesa_viva` e `ponte` dublês. O clique é no chip **Xbox 360** do
cartão do P1, pelo `data-gesto`, no WebKit do produto sobre a página PUBLICADA:

```
[gesto] 01-jogar.html · mascara → aplicado
DOM (motivo="sem_perfil"): [{"texto":"A máscara vale agora, mas não ficou guardada:
   escolha um perfil na aba Perfis e ela passa a ser lembrada nele.",
   "tom":"sucesso","lugar":"faixa","pai":"recibo-do-reconectar",
   "caixa":{"x":539,"y":523,"w":638,"h":30}, "vis":"hidden"}]
DOM (motivo=None):         []        <- silêncio, como manda a 03-Q4
```

**A foto revelou um defeito que não é meu, e ele é da tela — ver a §4 abaixo.**

---

## O que NÃO verifiquei

* **O degrau SAIU NO FIO ficou para a bancada, e não foi medido.** Nenhum byte
  desta leva atravessou o socket: `gamepad.mask.set` chegando ao daemon vivo, o
  vpad nascendo com a máscara que o perfil guarda, e o `045e:028e` do P2 na mesa
  — nada disso foi exercitado. Tudo aqui é **dublê + byte no arquivo**. A prova
  de aparelho é da `MESA-DE-QUATRO-01`.
* **Nenhuma célula do `mapa-controles.csv` foi exercitada** — esta sprint é de
  perfil em disco e de tela, e não toca canal, report id nem offset. Não há
  `chave` a relatar, e por isso o mapa não é citado: citar uma célula que não se
  mediu é o que faz o mapa envelhecer com procedência falsa.
* **A `sensor.set` foi curada e NÃO tem régua própria aqui.** Ela entra pelo
  censo (que reprova o leitor novo) e pela mesma função-dona, mas a régua de
  byte que escrevi cobre `gamepad.mask.set` e `rumble.motores.set`: exercitar o
  `sensor.set` puxa o hub evdev, e abrir nó de entrada de verdade é o caminho
  que já derrubou a sessão gráfica dela uma vez.
* **A `sem_endereco` e a frase genérica não foram vistas na TELA**, só no gesto:
  a foto foi tirada com `sem_perfil`. As três saem do mesmo `_recado_da_mascara`.
* **A suíte inteira não foi rodada** — é de quem coordena, e roda no fim, com a
  máquina livre. Rodei os lotes vizinhos do que toquei (169 testes) e a régua
  nova.

---

## O que sobrou para o próximo

### 1. A LINHA DE RESSALVA DA ABA 01 ESTÁ CEGA — e ela já engolia o recibo de 09/09

**Medido hoje, com o piloto e o WebKit do produto.** A frase chega ao DOM, no
lugar certo, com a caixa certa — e **`visibility: hidden`**:

```
.faixa-final:not(.ha) .pendente{visibility:hidden}     01-jogar.html:1500
```

A página declara o canal como
`<div class="recibo-do-reconectar" data-hef-recados="sucesso"
data-hef-recado-classe="pendente">`, e o BOOTSTRAP veste o recado com essa
classe. Mas o `.pendente` do seletor acima é **a linha do modo pendente**, e a
regra não distingue os dois: com `.faixa-final` sem `.ha` — que é o caso comum,
*nenhuma troca de modo pendente* — **todo recado de sucesso desta aba fica
invisível**.

**E isto não nasceu comigo.** `reconectar` (`a01_jogar.py:2673`) devolve
`{"recado": recibo}` desde 09/09 e pousa na MESMA faixa: **o recibo do
«Reconectar Controles» é invisível pela mesma regra, e ninguém viu** — porque a
régua daquela entrega leu o DOM, e o DOM está certo. *Quem revelou foi a foto.*

**O conserto é de `interface/aba01.py`, que NÃO está na minha posse** — e mexer
nele muda `mockup/`, cujo `--publicar` é ato dela. A forma provável é estreitar
o seletor para a linha do modo (`.faixa-final:not(.ha) > .pendente[data-campo]`,
ou uma classe própria para o recibo), e a régua que morde é a que escrevi aqui
mais um `getComputedStyle(...).visibility`.

### 2. A régua de tela que falta, e ela é de família

Nenhuma régua desta casa confere que **um recado depositado é VISÍVEL**. As que
existem leem o DOM, e o DOM esteve certo o tempo todo. O par
`texto no DOM` + `visibility/opacity computados` fecha a família — e o defeito
acima é a prova de que a metade que falta é a que decide.

### 3. `sensor.set` merece a régua de byte

Curada junto pela regra de 05/09 (*quando a cura conhece a causa, ela cobre
TODOS os chamadores*), mas sem prova de byte própria. Quem tiver o hub evdev
dublado fecha isso em dez linhas.

### 4. Arquivos alheios que precisei tocar, e o motivo de cada um

**Dublês apertados** — a assinatura do gesto mudou, e eles eram mais frouxos que
o produto: `tests/unit/test_os_botoes_tem_dono.py`,
`tests/unit/test_a01_a_mascara_vale_sempre_que_pode.py`,
`tests/unit/test_a_mascara_e_de_cada_controle.py`. Não é feature nova neles.

**Citações de linha reapontadas** — `_perfil_que_grava` acrescentou 53 linhas ao
`ipc_handlers.py` e **cinco comentários de outros pacotes citavam linhas dele**.
Reapontadas **por SÍMBOLO, nunca por aritmética**, com a régua
`citacoes-no-codigo` de oráculo (ela nomeia os dois números, o citado e o real):

| arquivo | citava | aponta |
| --- | --- | --- |
| `a06_navegacao.py:2090` | `ponte.py:193` | `:221` (`resultado`) |
| `a08_conexoes.py:4590` e `:5163` | `ipc_handlers.py:6713` | `:6770` (`_handle_machine_declare`) |
| `a09_sistema.py:1914` | `ipc_handlers.py:6713` | `:6770` |
| `a02_controles.py:3494` | `ipc_handlers.py:6164` | `:6165` (`_handle_mic_volume_set`) |
| `a02_controles.py:3956` | `ipc_handlers.py:6220` | `:6308` — a linha que PÕE `por_uniq` na resposta |

A última merecia a mudança de alvo: a citada apontava para o `if uniq:` que hoje
caiu numa linha em branco, e o que a frase afirma é que **o campo existe**. O
anzol passou a ser o campo.

**`docs/protocol/ipc-unix-socket.md`** foi reescrito pelo gerador da casa
(`scripts/gerar-contrato-ipc.py`), não à mão — o bloco cita a linha de cada
handler e as 45 se deslocaram junto.

Se houver conflito na costura, é nestas linhas — e todas são de comentário, não
de código.
