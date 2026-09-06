---
sprint: ONDA5-06-01
estado: feita
posse:
  M06:
    - src/hefesto_dualsense4unix/core/acoes_de_botao.py
    - src/hefesto_dualsense4unix/profiles/manager.py
    - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
cria:
  - tests/unit/test_o_ps_digita_e_continua_sendo_a_saida.py
bancada: false
depois_de: [LEVA-3, LEVA-DE-BACKGROUND-01, MIGRA-CONEXOES-11, MIGRA-NAVEGACAO-09, ONDA-NAVEGACAO-03, ONDA1-D1-O-SOM-01, ONDA3-MOTOR-01]
nao_toca:
  - src/hefesto_dualsense4unix/integrations/hotkey_daemon.py
  - src/hefesto_dualsense4unix/daemon/lifecycle.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
  - src/hefesto_dualsense4unix/interface/paginas/06-navegacao.html
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - docs/data/paridade-gtk-html.csv
---

# ONDA5-06-01 · DEFEITO — o PS ganha dono no motor antes de ganhar linha

> **FEITA — 06/09/2026.** O PS é a vigésima segunda linha do produto
> (`core/acoes_de_botao.BOTOES`), tem valor de fábrica derivado do dono
> (`padrao()` → `DaemonConfig.ps_button_action`), porta própria fora das três
> sacolas (`acao_do_ps`), canal do perfil até o subsistema
> (`ProfileManager.ps_action_sink` → `hotkey.definir_acao_do_ps`) e o toque faz
> **as duas coisas, nesta ordem** (`hotkey.build_ps_solo_callback`: a tecla, e só
> depois a Steam). **28 casos novos**, oito mordidas coladas no relatório
> (`docs/process/agentes/2026-09-06/ONDA5-06-01.md`).
>
> **O QUE ELA DEIXA VERMELHO, e é por desenho:** **sete réguas da TELA** dizem
> agora que o produto tem 22 linhas e o desenho tem 21. Elas estão certas — o
> motor andou primeiro, de propósito (§7) — e a cura de todas é a MESMA: a linha
> do PS na aba, que é a `ONDA5-06-02`. Estão nomeadas uma a uma no relatório.
>
> **O QUE MUDOU DE ROTA NO CAMINHO:** a §4-P2 pedia uma QUARTA POSIÇÃO na tupla
> do `resolver()`. Medido, ela quebraria a aba que ela abre — três chamadores
> desempacotam três (`profiles/manager.py` e duas vezes
> `interface/pacotes/a06_navegacao.py`), e um quarto valor viraria
> `ValueError: too many values to unpack` no produto de hoje, para servir uma
> frente que roda depois. A quarta saída existe, e é PORTA (`acao_do_ps`) em vez
> de posição. O destino é o mesmo, e nenhum chamador quebrou.

## 1. A DECISÃO DELA, VERBATIM

Pergunta **06-Q3**, *"O botão PS na tabela de atalhos"*. Ela marcou a terceira
opção:

> **Aparece e você escolhe** — *"O PS ganha a mesma lista das outras 21 linhas;
> se você der uma tecla a ele, ele passa a digitar SEM parar de abrir a Steam, e
> a tabela não avisa isso."*

**Ela escolheu a opção cujo próprio texto declara um custo.** As duas metades da
escolha são requisito, e a ordem entre elas também: *digita* **e** *sem parar de
abrir a Steam*.

**ISTO REVERTE A DECISÃO DE 04/09.** O PO tinha decidido *"fica fora, e a razão
vira dica"*, e a aba foi construída assim — o parágrafo do `?` em
`interface/aba06.py:1640` e a régua
`tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py:221`, que **exige** que
`"ps"` não esteja na lista do produto. A palavra dela vence a opção e vence a
decisão anterior. As duas peças caem nesta leva.

**A terceira metade não é dela, é da casa** — 10-Q6: *a máscara não custa
feature; o Hefesto não descreve limitação, ele constrói o mecanismo que a
remove.* A opção dizia *"e a tabela não avisa isso"*. Esta sprint não constrói
um aviso: constrói o mecanismo que torna a frase verdadeira.

---

## 2. A MEDIÇÃO — o PS é o único botão do controle que a emulação NUNCA vê

### 2.1 Ele não está na lista do produto

`core/acoes_de_botao.py:60` declara as vinte e uma linhas, e `"ps"` não está
entre elas. Três consequências, todas derivadas e todas medidas:

* `padrao()` (`core/acoes_de_botao.py:204`) itera essa tupla em `:221` — sem
  `"ps"`, não há valor de fábrica para o PS;
* o validador do perfil `profiles/schema.py:1441` recusa
  `button_actions["ps"]` **hoje**, e recusa bem: ele deriva os nomes válidos de
  `core/acoes_de_botao.BOTOES` em vez de guardar uma quarta cópia da lista.
  **Por isso este arquivo não é tocado nesta sprint** — acrescentar `"ps"` ao
  dono já muda o validador;
* o gesto da tela `linha_de_botao` recusa em
  `interface/pacotes/a06_navegacao.py:2284` pela mesma razão.

### 2.2 E o caminho da emulação está fechado para ele — por desenho

`integrations/hotkey_daemon.py:397` late todo membro de um combo PS+X enquanto
o PS estiver pressionado:

    self._combo_latch |= {b for b in combo if b in buttons}

Os quatro combos configurados (`:57`, `:58`, `:121`, `:142`) **contêm todos o
PS**, e o PS é membro de si mesmo nessa expressão. Logo, **com o PS sozinho
pressionado o conjunto latchado é `{"ps"}`**.

E `daemon/lifecycle.py:4778-4780` subtrai exatamente esse conjunto:

    blocked = self._hotkey_manager.combo_buttons_active(buttons_pressed)
    emu_buttons = buttons_pressed - blocked

`emu_buttons` é o que chega ao mouse (`:4804`) e ao teclado (`:4815`). **O PS
nunca chegou a nenhum dos dois, nem uma vez.** Uma linha do PS na tabela, sem
mais nada, seria uma linha que jamais dispara — a tela prometendo o que o
aparelho não recebe.

### 2.3 O PS já tem UM dono — e ele não sobrevive a um reinício

`daemon/lifecycle.py:204` declara

    ps_button_action: Literal["steam", "none", "custom"] = "steam"

com `ps_button_command` em `:205`, e `daemon/subsystems/hotkey.py:54` é quem os
lê: `"none"` sai calado, `"steam"` chama `open_or_focus_steam()`, `"custom"`
dispara o comando.

**Ele tem escritor vivo e nenhum que grave.** `daemon.reload` aceita
`config_overrides` e termina em `ipc_handlers.py:5462-5463` com
`replace(config, **overrides)` + `reload_config(...)` — memória, e nada mais. A
escolha morre no próximo start do daemon.

**São dois donos do mesmo fato**, e o segundo é o que envelhece calado: a
config da máquina (não persistida) e o `button_actions` do perfil (validado e
gravado em disco). É a família que esta casa persegue, e ela já está viva hoje,
antes de qualquer linha nova.

**FATO CORRIGIDO NO CAMINHO:** o cabeçalho de
`interface/pacotes/a06_navegacao.py:11` diz que *"método de IPC nenhum
escreve"* o `ps_button_action`. Escreve — e a nota que corrige isso, mais
abaixo no mesmo arquivo, aponta para `ipc_handlers.py:4556`/`:4567`, que hoje
são o cache de órfãos HID. **As duas citações envelheceram**; os números certos
são `:5450` (a leitura dos overrides) e `:5462-5463` (o que ele faz com eles).
Corrigir o comentário é da frente da tela — ela é dona daquele arquivo. Relate.

### 2.4 O que já está pronto e não se reconstrói

* `app/actions/input_actions.py:146` já traduz `"ps"` → **"Botão PS"**. O nome
  que ela lê existe;
* `core/acoes_de_botao.py:94` já tem os tokens que descrevem o que o PS faz:
  `__STEAM__` ("Abrir a Steam"), `__SAIR_DO_JOGO__` ("Sair do modo jogo") e
  `__PROGRAMA__` ("Escolher um programa…"). **Os três estão em
  `SEM_ATENDENTE` (`:139`)** — a tela os oferece e ninguém os atende;
* o comentário de `SEM_ATENDENTE` diz que `__PROGRAMA__` *"precisa de um
  CAMINHO junto, e campo para esse caminho não existe em perfil nenhum"*. Para
  o PS ele **existe**: é o `ps_button_command` de `lifecycle.py:205`. É meio
  atendente, na máquina e não no perfil, e isso é dívida a declarar, não a
  fechar aqui.

---

## 3. O QUE ESTA SPRINT DECIDE, e por que é decisão de engenharia

**O PS dispara no `ps_solo`, nunca no press.** É o único ponto do produto em
que já se sabe que o toque no PS não é combo, não é long-press e não é o gesto
de religar o controle: `hotkey_daemon.py:270` (`_observe_ps_solo`) só devolve
`"ps_solo"` depois de descartar as três coisas, no release.

Dispachar no press exigiria desmontar o latch de `:397`, e aí um PS+↑ digitaria
a tecla do PS **e** trocaria o perfil. O latch fica, e é ele que torna a linha
do PS segura — está em `nao_toca:` por isso, não por escopo.

**A escolha mora em `Profile.button_actions`, e a config é o degrau abaixo.**
O perfil é o que ela salva e o que sobrevive ao reinício; `ps_button_action`
continua sendo o padrão da máquina para o perfil que não diz nada. Um fato, uma
precedência escrita — e não dois donos empatados.

**O valor de fábrica do PS é o que ele FAZ, e o dono responde.** Hoje isso é
`"Abrir a Steam"`, porque `lifecycle.py:204` diz `= "steam"`. `padrao()` passa a
perguntar ao dono em vez de cravar `__NADA__`. É a regra desta casa: *quando um
valor tem dono, a régua PERGUNTA ao dono.*

---

## 4. OS PASSOS, E A MORDIDA DE CADA UM

### P1 · O PS entra na lista do produto

`core/acoes_de_botao.py:60` ganha `"ps"` — depois de `create` e antes das três
regiões do touchpad, que é a ordem do aparelho e a ordem em que a tela mostra.
`padrao()` (`:204`) passa a responder pelo PS lendo `config.ps_button_action`,
com `"steam"` → `TOKEN_STEAM`, `"none"` → `TOKEN_NADA`, `"custom"` →
`TOKEN_PROGRAMA`.

**A prosa acompanha ou vira mentira.** O docstring de `:204` diz *"cada um dos
21 botões"* e o de `:57` diz *"AS VINTE E UMA LINHAS"*. A regra da casa é que
fato errado se substitui **em todos os lugares**; os desta posse são estes dois.
O comando que acha o resto, e ele é de quem lê e não desta sprint:

    grep -rn "21 linhas\|21 botões\|vinte e uma" src/ tests/

**A MORDIDA:** tire o `"ps"` da tupla e rode a régua nova. Ela tem de reprovar
dizendo que o botão que a tela oferece não é botão do produto — que é a mesma
frase que `profiles/schema.py:1464` levanta, e é a prova de que o validador
seguiu o dono sem ninguém editá-lo.

### P2 · O `resolver()` para de chamar o PS de órfão

`core/acoes_de_botao.py:244` separa as escolhas em três sacolas, e `:296` joga
todo `SEM_ATENDENTE` na terceira. Com o PS na lista e `__STEAM__` de fábrica, o
PS cairia em `sem_dono` — a tela diria *"não acende nada hoje"* sobre o botão
que abre a Steam há meses.

O PS ganha destino próprio: uma quarta saída, `do_ps`, com o token escolhido.
`SEM_ATENDENTE` **continua valendo para os outros vinte e um** — para eles nada
mudou, e mudar seria a segunda cura escondida dentro da primeira.

**A MORDIDA:** devolva o PS para a terceira sacola e chame `resolver()` com
`{"ps": "__STEAM__"}`. A régua tem de acusar o PS listado como sem dono, que é
literalmente o que `profiles/manager.py:605` registra no journal como
`button_actions_sem_atendente` — e o que a tira da aba escreveria na tela dela.

### P3 · O perfil empurra a escolha do PS até quem a atende

`profiles/manager.py:570` (`apply_button_actions`) hoje entrega a dois devices:
`set_button_actions(do_mouse)` em `:618` e `set_bindings(...)` logo abaixo. O PS
não tem device — quem o atende é o callback do `ps_solo`. A quarta sacola do P2
vai para o subsistema de hotkey, **em memória**, pelo mesmo método.

**EM MEMÓRIA, E NÃO POR LEITURA DE DISCO:** o `_on_ps_solo` roda inline no poll
loop, e o comentário de `daemon/subsystems/hotkey.py:56-62` proíbe trabalho
bloqueante ali com um número — um `pgrep` travava input, IPC e co-op por até
2 s. `daemon.store.active_profile` (usado em `hotkey.py:748`) devolve só o
NOME; carregar o perfil dali seria disco dentro do laço. Quem já leu o perfil é
o `apply_button_actions`, e é ele que empurra.

**A MORDIDA:** arranque o empurrão e ative um perfil com
`button_actions={"ps": "KEY_F11"}`. O PS tem de voltar a abrir a Steam e não
digitar nada — a régua reprova nomeando o token que o perfil guardava e que
ninguém recebeu.

### P4 · O `ps_solo` faz as duas coisas, nesta ordem

`daemon/subsystems/hotkey.py:52` (`_on_ps_solo`) passa a emitir a ação escolhida
**e** a manter o que já fazia. As três guardas de hoje ficam inteiras, e cada
uma tem razão escrita no arquivo:

* `:54` — `ps_button_action == "none"` sai antes de tudo. **Esta é a
  armadilha:** se o `"none"` continuar sendo a primeira porta, um perfil que
  escolheu `Enter` para o PS fica mudo por causa de uma config de máquina que
  ela nunca viu. A precedência da §3 tem de estar **antes** desse `if`, não
  depois;
* `:67` e `:70` — modo nativo e `_emulation_suppressed` pulam o solo. **Continuam
  pulando**, e agora pulam as duas metades: com o controle dedicado a um jogo,
  digitar seria pior que abrir a Steam;
* `hotkey_daemon.py:345` — o teto do toque curto (PS-TOQUE-CURTO-01, o gesto de
  religar o controle no rádio). Segurar o PS cinco segundos continua não sendo
  toque, e portanto não digita.

**A MORDIDA, e são três:** (1) segure PS+↑ — tem de trocar de perfil e **não**
digitar; (2) segure o PS além do `ps_long_press_ms` — tem de alternar o modo
jogo e **não** digitar; (3) segure o PS além do `ps_toque_curto_teto_ms` — não
pode acontecer nada. Arranque qualquer uma das três guardas e o caso
correspondente reprova.

### P5 · A ordem entre digitar e abrir a Steam

*"SEM parar de abrir a Steam"* é a palavra dela: as duas acontecem. A tecla vai
primeiro — `open_or_focus_steam()` (`hotkey.py:76`) muda o foco da janela, e uma
tecla emitida depois disso chegaria à Steam em vez de chegar ao que estava na
frente.

**A MORDIDA:** inverta a ordem e meça quem recebe a tecla. A régua tem de
reprovar a inversão; um teste que passe nas duas ordens não mede a decisão.

---

## 5. NADA SE PERDEU

Toda linha é requisito, e nenhuma é decoração:

* **os quatro combos continuam ganhando do PS.** `hotkey_daemon.py:262` marca
  `_ps_combo_fired` e o solo é suprimido no release. Nada aqui o afrouxa;
* **o long-press continua alternando o modo jogo** e continua suprimindo o
  solo;
* **o latch de `hotkey_daemon.py:397` fica inteiro.** Ele é o que impede
  `options`→Meta e `dpad`→setas de vazarem para o desktop (FEAT-HOTKEY-COMBO-NO-
  LEAK-01/02), e agora é também o que impede o PS de digitar duas vezes;
* **o gesto de religar o controle no rádio continua não abrindo a Steam** — o
  teto do toque curto é anterior a tudo;
* **`ps_button_action = "custom"` continua disparando o comando dela.** Ele não
  é apagado nem migrado: vira o degrau da máquina, abaixo do perfil;
* **as vinte e uma linhas de hoje continuam resolvendo exatamente como
  resolviam.** O PS é uma sacola nova, não uma regra nova sobre as antigas: o
  `l2`/`r2` continua espelho do `cross`/`triangle` (`:288-291`), os dois eixos
  continuam fora das duas primeiras sacolas, e `__NADA__` continua pulando;
* **o validador do perfil continua derivado.** Ninguém digita uma lista em
  `profiles/schema.py` — se alguém o fizer, esta sprint fracassou no que ela
  tem de mais barato.

---

## 6. O QUE VOCÊ RELATA EM VEZ DE EDITAR

* `interface/aba06.py:1640` — o parágrafo do `?` que explica por que o PS fica
  fora. Ele é da frente da tela (ONDA5-06-02), que roda **depois** desta;
* `tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py:221` —
  `test_a_dica_da_tela_de_botoes_diz_por_que_o_ps_fica_fora` afirma
  `"ps" not in acoes.BOTOES`. **Ele vai ficar vermelho no seu P1, e está
  certo:** é uma régua que mede o mundo de ontem. Quem o aposenta é a frente da
  tela, junto com o parágrafo que ele guarda. **Declare-o no relatório** em vez
  de apagá-lo por conta própria — apagar régua alheia é como se perde a prova
  de que a decisão mudou;
* `interface/pacotes/a06_navegacao.py:11` e a nota das linhas de IPC
  envelhecidas da §2.3. Arquivo da outra frente;
* `docs/data/paridade-gtk-html.csv:207` diz *"21 linhas"* na tabela do que cada
  botão faz. O CSV tem UM dono por leva — liste a linha, não a edite.

É a R1 da casa: quando o conserto pede arquivo alheio, relate em vez de editar.

---

## 7. O QUE ELA DESBLOQUEIA

**A ONDA5-06-02 não sai do lugar sem esta.** O gesto `linha_de_botao`
(`interface/pacotes/a06_navegacao.py:2284`) recusa qualquer botão fora de
`acoes.BOTOES`, e `interface/aba06.py:1449` monta o padrão de cada linha
lendo `padrao()` — uma linha do PS na tela antes do P1 é um `KeyError` na
geração ou um `<select>` que recusa o próprio clique.

Esta sprint não muda um pixel. É o que faz o pixel da outra ser verdade.
