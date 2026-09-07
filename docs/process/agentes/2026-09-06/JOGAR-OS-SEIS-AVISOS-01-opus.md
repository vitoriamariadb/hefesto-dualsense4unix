# JOGAR-OS-SEIS-AVISOS-01 — o que a aba Jogar lia do daemon e parou de ler

**06/09/2026 · branch `voo/JOGAR-OS-SEIS-AVISOS-01-opus` · base `ae1c3d82`
(`onda/atual-0609`, conferida).**

As seis linhas do CSV da paridade que esta sprint fecha tinham todas a mesma
forma, e o enunciado a nomeia: **o daemon publica a chave, ou `home_actions` já
tem a função pura, e o pacote da aba não lê.** Nenhuma delas pediu lógica nova.
As seis pediram um LEITOR — e é só isso que nasceu aqui.

## O que mudou

### As cinco que entraram na coluna Atenção

Quatro por `painel.AVISOS_DA_TELA`, que é o dono desde a ONDA-JOGAR-06 e é onde
a sprint manda pô-las (*"não invente um segundo lugar"*): a tupla foi de **sete**
para **onze** fontes. **A quinta — a divergência de máscara — mora no pacote da
aba, e um PORTÃO decidiu isso**; a §"o que mudou de rota" abaixo tem a medição.

| linha do CSV | selo | quem responde | o que ela lê |
| --- | --- | --- | --- |
| 12 · o "Controlar o PC" que não controla | `MODO` | `home_actions.texto_do_desktop_sem_emulacao` **direto**, sem invólucro | `mouse_emulation.enabled` / `keyboard_emulation.enabled` |
| 17 · o grab dobrado | `GAMEPAD` | `painel.aviso_do_grab_dobrado` → `home_actions.aviso_de_grab` | `primary_grab_state` + `gamepad_emulation.enabled` + o primário conectado |
| 26 · a dica do "Reconectar" com jogo aberto | `JOGO` | `home_actions._reconciliar_gate_text` **direto** | `game_signal.authority`, por `jogo_com_autoridade` |
| 28 · a divergência de máscara | `GAMEPAD` | `a01_jogar._aviso_da_divergencia_de_mascara` → `mascara_divergente_do_daemon` + `texto_da_divergencia` | `gamepad_emulation.mascara_divergente` |
| 35 · a linha de origem | `PERFIL` | `painel.aviso_da_origem_do_modo` | `native_mode` + `native_mode_origin` + `mode_from_profile` |

**NENHUM SELO NOVO, e é escolha medida.** `a01_jogar.ORDEM_DA_GRAVIDADE` põe o
que não está na tupla dela **depois de tudo**, e a coluna mostra três de cada
vez: um selo fora da escada é um selo que a máquina cheia esconde atrás do `+N`.
As cinco entraram nos degraus que já existiam, pelo assunto de cada uma.
Consequência: **`ORDEM_DA_GRAVIDADE`, `AVISOS_VIVOS`, o gerador `aba01.py`, o
`mockup/` e as páginas publicadas não mudaram uma linha.** O desenho é o mesmo;
o que mudou é o que a coluna tem a dizer.

**DUAS DAS CINCO SÃO O DONO DIRETO, sem função nova nenhuma** (linhas 12 e 26):
`texto_do_desktop_sem_emulacao` e `_reconciliar_gate_text` já eram funções puras
de `state`, que é o contrato de `Aviso`. Escrever um invólucro para elas seria a
segunda cópia de uma assinatura que já servia.

#### O que mudou de rota, e quem mandou foi um portão

A divergência de máscara **nasceu em `painel.py` e teve de sair de lá.**
`home_actions.texto_da_divergencia` devolve markup do Pango, e quem sabe tirá-lo
é uma função da janela GTK — apontar de `app/actions/` para lá é uma **citação
nova para a janela que está saindo**, e `nada-aponta-para-a-janela` reprovou,
nomeando arquivo e linha (`painel.py:794`). O inventário
`docs/data/o-que-ainda-aponta-para-a-janela.csv` só encolhe, e declarar a
citação exigiria escrever em `docs/data/`, que é `nao_toca:`.

A rota certa já existia ao lado: `_aviso_da_ponte` é a OUTRA fonte desta coluna
que volta em markup, e o arquivo dela tem **uma** citação declarada. Então a
divergência foi para `a01_jogar._aviso_da_divergencia_de_mascara`, vizinha da
ponte, e as duas passam por `_sem_markup` — **uma porta só**, porque o portão
reprova tanto citação nova quanto contagem de par declarado que CRESCE.

**E A ARMADILHA FOI DE PROSA, pela segunda vez nesta casa em dois dias.** O
portão varre o TEXTO do arquivo, não os `import`: o comentário que eu escrevi em
`painel.py` para EXPLICAR por que a função saiu **soletrava o módulo**, e virou
a citação que ele descrevia. O mesmo aconteceu na régua nova, que contava as
ocorrências escrevendo a agulha. As duas foram reescritas para DESCREVER o nome
em vez de cravá-lo — é a lição do `BOOTSTRAP` de 05/09, e ela custou dois
vermelhos aqui.

### A sexta: o recibo do "Reconectar Controles" (linha 25)

`interface/pacotes/a01_jogar.reconectar` era duas linhas de `p.chamar(…)`, e
`chamar` devolve um `bool` que ninguém lia. **Clicar com o serviço fora do ar e
clicar com ele vivo produziam exatamente a mesma tela.**

Agora os dois passos vão por `p.resultado`, que traz o CORPO:

* `coop.sync` → `{status, players, active}`. Falhou? `RuntimeError` com
  `painel.RECONECTAR_SEM_SERVICO` — o canal da recusa laranja no cartão, e o
  segundo passo **não corre**;
* `identity.renumber` → `{ok, renumbered}`. Falhou? o recibo diz *"não consegui
  conferir a numeração"* (`reconciliar_toast` com `None`) e os jogadores
  continuam de pé. **A recusa por jogo aberto não é falha** — é a regra do
  `reported_step_index`, e quem já a implementa é o `reconciliar_toast`;
* o desfecho vira `{"recado": …}`, que é o verde de 6 s no cartão.

`PONTE` ganhou `"resultado"` e a `PROVAS` do gesto passou a exigir
`("resultado", …)` no lugar de `("chamar", …)` — se alguém devolver o `chamar`
para cá, a régua geral dos botões reprova.

### Frases novas, e são duas

As duas nascem em `app/actions/jogar/painel.py`, que é dono em `app/` — a regra
2 da sprint. As duas são **PROVISÓRIAS**: texto de tela é palavra dela.

* `FRASE_DA_ORIGEM_DO_MODO` — *"Quem ligou {modo} foi o perfil ativo, e não um
  gesto seu."* A janela antiga montava `"Nativo ligado pelo perfil ativo"` solto
  dentro do `_render_home`; **`Nativo` e `Gamepad` são palavras da casa**, e na
  tela os modos chamam-se *Conexão Nativa (Sony)* e *Jogar pelo Hefesto*
  (glossário §2). Os rótulos saem de `home_actions._MODE_ITEMS`, nunca digitados.
  A regência é *"Quem ligou … foi"* por causa do GÊNERO: *a* Conexão Nativa e
  *o* Jogar pelo Hefesto, e um particípio erraria um dos dois em toda tela.
* `RECONECTAR_SEM_SERVICO` — a janela antiga dizia *"Não consegui reconciliar —
  o Hefesto pode estar desligado."*, um literal solto dentro do `_sync_fail`,
  sem constante e portanto impossível de importar. **O verbo mudou porque o
  botão mudou**: a legenda desta aba registra que *"'Reconciliar jogadores'
  virou 'Reconectar Controles'"*, e uma recusa com o verbo de um botão que não
  existe mais manda a pessoa procurar o que não está lá. E ela **não afirma que
  nada aconteceu**: um teto estourado é trabalho possivelmente feito sem
  resposta — a cicatriz que a `a09_sistema.SEM_RESPOSTA_DO_SERVICO` já escreve.

## Qual mordida prova

`tests/unit/test_a_aba_jogar_le_os_seis_avisos.py` — **39 testes, verdes**. Toda
comparação é contra a constante do produto (`AVISO_DE_GRAB_LINHA`,
`RECONCILIAR_JOGO_ABERTO_TEXT`, `TEXTO_DESKTOP_SEM_MOUSE_NEM_TECLADO`,
`DIVERGENCIA_DO_PERFIL_PREFIXO`): a régua **não digita nenhuma frase de tela**.

### A mordida de código, em três partes — uma por rota

**1. Arranquei as quatro fontes novas de `AVISOS_DA_TELA`** — `7 failed, 32
passed`:

```
FAILED test_as_cinco_de_coluna_entraram_em_avisos_da_tela
FAILED test_o_desktop_sem_mouse_nem_teclado_fala
FAILED test_o_grab_dobrado_diz_a_linha_e_o_porque
FAILED test_com_jogo_em_cena_a_dica_do_reconectar_aparece
FAILED test_o_nativo_ligado_pelo_perfil_se_declara
FAILED test_o_gamepad_ligado_pelo_perfil_se_declara
FAILED test_as_duas_origens_cabem_na_mesma_linha
```

**2. Desliguei a divergência de máscara do `_avisos`** — `1 failed, 38 passed`:

```
FAILED test_a_divergencia_de_mascara_chega_a_coluna
```

**3. Devolvi o `reconectar` para os dois `p.chamar`** — `4 failed, 33 passed`:

```
FAILED test_o_recibo_diz_quantos_voltaram_e_o_que_a_numeracao_fez
FAILED test_a_recusa_por_jogo_aberto_nao_e_falha
FAILED test_o_acabamento_mudo_nao_derruba_o_gesto
FAILED test_sem_o_primeiro_passo_o_botao_recusa_dizendo
```

Devolvidas as três curas: `39 passed in 0.64s`.

**E DUAS RÉGUAS NOVAS GUARDAM A ROTA, não o conteúdo:**
`test_a_divergencia_nao_aponta_de_app_para_a_janela` reprova se alguém devolver
a citação para `app/actions/`, e `test_a_porta_do_markup_e_uma_so` reprova se
nascer um segundo `import` do módulo que tira markup. As duas dizem no texto da
falha **por que** — para a próxima pessoa não redescobrir o portão pelo vermelho.

**E a mordida do VIZINHO está lá também**, que é a metade que separa medir de
passar: cada linha tem o `state` que ACENDE e o que muda **um** termo e a faz
CALAR — cinco vizinhos para o grab (`off`, `pending`, sem gamepad, controle
desconectado, não-primário), cinco para a dica do Reconectar, quatro para a
origem, e as duas pontas da divergência.

### A prova de tela — e ela foi CLICADA

Sem daemon na máquina (`systemctl --user is-active` → `inactive`) e **sem tocar
a bancada**: subi um **dublê do daemon no socket unix**, num
`XDG_RUNTIME_DIR`/`HOME` próprios e com `HEFESTO_DUALSENSE4UNIX_FAKE=1`, que é o
isolamento que o próprio `xdg_paths.ipc_socket_name()` oferece. O piloto real
(`interface/hefesto_vivo.py`), WebKit real, DOM real. **`--oculta` em todas as
execuções — nenhuma janela nasceu na tela dela.**

| foto | o que se vê |
| --- | --- |
| `…-depois-a-coluna-com-o-grab-e-a-mascara.png` | `GAMEPAD` o grab dobrado · `GAMEPAD` a divergência nomeando o perfil "Pragmata" · `MODO` · `+2` |
| `…-depois-o-modo-sem-controle-e-a-origem.png` | `MODO` o "Controlar o PC" sem mouse nem teclado · `PONTE` · `PERFIL` *"Quem ligou Jogar pelo Hefesto foi o perfil ativo…"* · **3 avisos** |
| `…-depois-a-dica-do-reconectar.png` | `JOGO` a dica, **logo acima do botão "Reconectar Controles"** — o mesmo lugar da janela antiga |
| `…-depois-o-recibo-do-reconectar.png` | **refotografada depois da mudança de rota** — o recibo VERDE no cartão do P1 (*"Jogadores reconciliados — 3 jogador(es). Numeração compactada em 2 controle(s)."*) com as mesmas três linhas da coluna e o `+2` |
| `…-mordida-a-coluna-com-a-cura-arrancada.png` | **a mesma cena da primeira**, com a cura fora: **"1 aviso"** e o botão piscando verde sem uma palavra |

O clique foi de verdade, pela ponte JS (`--prova-clique reconectar`), e o dublê
registrou o que chegou nele — na ordem, uma vez cada:

```
[gesto] 01-jogar.html · reconectar → aplicado
gestos: 1 · aplicados: 1 · sem dono: 0

  ->  coop.sync
  ->  identity.renumber
```

**A mordida de tela é a prova mais dura desta entrega:** o mesmo `state` que
acende cinco linhas volta a dizer *"1 aviso"*, e o botão volta a responder
calado. É o defeito da linha 25 fotografado.

### O que mais rodou verde

`ruff check src/ tests/` · `mypy` nos dois arquivos · e as réguas vizinhas dos
dois lados: `test_a01_a_coluna_atencao_acende_o_mais_grave`,
`test_a01_a_ponte_entra_na_coluna`, `test_a_aba01_le_o_estado_em_vez_de_cravar`,
`test_a_aba_01_jogar_fecha_as_linhas`, `test_os_botoes_tem_dono`,
`test_o_coop_vive_na_conexao_nativa`, `test_a_faixa_de_pendencia_da_jogar`,
`test_painel_da_verdade_01`, `test_simbolico_do_painel` — **206 passed, 2
skipped**; e do lado do dono, `test_modo_que_nao_controla_01`,
`test_home_para_de_afirmar_o_que_nao_sabe`, `test_home_ponte_e_divergencia`,
`test_home_render_state`, `test_o_recado_de_sucesso_pousa_no_cartao`,
`test_a_palavra_mesa_nao_chega_a_tela` — verdes.

## O que NÃO verifiquei

**1. NENHUM APARELHO FOI TOCADO, e a sprint é `bancada: false`.** A bancada
estava LIVRE e eu **não a reservei**: nada nesta entrega para o daemon, escreve
no aparelho ou chama `systemctl`. O daemon da máquina está `inactive`, e o deixei
assim. Toda medição de tela é contra um **dublê de socket**, dito acima. A prova
com dois DualSense na mesa — que é onde `primary_grab_state="failed"` e
`mascara_divergente` acontecem de verdade — é da **MESA-DE-QUATRO-01**.

**2. AS CINCO CONDIÇÕES NUNCA FORAM VISTAS ACESAS NUM DAEMON VIVO.** A sprint já
o dizia de duas delas, e continua verdade: hoje `primary_grab_state='off'`,
`mascara_divergente: null`, `native_mode_origin=None` e `mode_from_profile`
ausente. **Nem a janela antiga diria nada hoje.** O que esta entrega prova é que
a tela nova PASSA A TER onde dizer, com a mesma condição e a mesma frase do dono.

**3. O AVISO DO "Controlar o PC" PODE PISCAR na transição, e o preço está
medido.** `texto_do_desktop_sem_emulacao` aceita `modo_mudou_agora=` justamente
para não julgar a emulação no mesmo tique em que o modo mudou — o
`mouse.emulation.restore` é o ÚLTIMO dos três IPCs. **Uma fonte desta coluna é
função pura de `state`, e o tique da interface nova não tem memória do tique
anterior**, então o argumento não tem de onde vir. Janela: até ~2 s (o teto de
`ponte.TETOS` para os três métodos). Não medi na tela quantos tiques ele fica
aceso; a cura, se ela incomodar, é o pacote lembrar do modo do tique passado, e
isso é um dono novo que não abri.

**4. A FRASE DA LINHA 12 MANDA PARA ROTULOS QUE A TELA NOVA NÃO TEM.** Ela diz
*"Ligue os dois na aba Navegação"*, e a `06-navegacao` **tem** a aba mas os
interruptores chamam-se **"Status do Modo"** e **"Função do teclado"** — nunca
"Emular mouse"/"Emular teclado", que são os nomes da janela GTK. Medido:
`grep -c 'Emular mouse' interface/paginas/06-navegacao.html` → 0. **Não curei
porque `home_actions.py` está no `nao_toca:`** — está na §"o que sobrou".

**5. O `AVISOS_VIVOS = 6` continua bastando, mas ninguém remediu o teto.** A
coluna acende três mais a linha do `+N`; a página publica seis lugares. Com doze
fontes, uma máquina em pane pode ter mais avisos que lugares — e a conta ao lado
(`atencao-conta`) diz o TOTAL, então nada se esconde calado. Não mexi:
`AVISOS_VIVOS` é lido pelo gerador, e mexer nele obriga a republicar
`interface/paginas/`, que está no `nao_toca:`.

**6. Não rodei a suíte inteira** — é de quem coordena, e ela toca `uinput` de
verdade.

## O que sobrou para o próximo

### 0. OS PORTÕES — 43 de 45 verdes, e os DOIS vermelhos são de `docs/data/`

**A base `ae1c3d82` já vinha com TRÊS vermelhos**, e eu fechei um: o
`citacoes-no-codigo` era um alarme de ESTADO da máquina (FAIXA-NO-BERCO-01
apontando o `~/.config` real dela), e voltou verde sozinho na segunda execução —
não é código, e não é meu.

Ficam dois, **os mesmos dois da base, pela mesma causa**: uma dívida fechada
obriga a reescrever uma linha em `docs/data/`, que esta sprint tem em
`nao_toca:`. Nenhum portão NOVO ficou vermelho por minha causa.

```
REPROVOU: 2 vermelho(s) de 45 -> paridade-gtk-html donos-de-comportamento

  paridade:  csv:28  [01-jogar]  ← MINHA (a divergência de máscara)
             csv:315 csv:343 [09-sistema]  ← já estavam na base
  donos:     csv:39 csv:40 csv:42  ← MINHAS
             csv:47  ← já estava na base
```

O texto pronto das sete linhas está abaixo, e é a regra 4 da sprint cumprida.


### A. OS DOIS CSV DE `docs/data/` — e eu não podia editá-los

`nao_toca: docs/data/`, e a regra 4 da sprint manda entregar o texto pronto aqui.
**Os dois portões que os medem já estavam VERMELHOS na base `ae1c3d82`**, pela
mesma causa (a aba 09 fechou dívidas na leva anterior e o CSV não foi junto).

#### A.1 `docs/data/donos-de-comportamento.csv` — TRÊS linhas a reclassificar

O portão `donos-de-comportamento` nomeia as três, e são minhas:

```
csv:39 mascara.divergencia : SO-GTK, mas a tela nova já chama `mascara_divergente_do_daemon` em interface/pacotes/a01_jogar.py
csv:40 grab.aviso          : SO-GTK, mas a tela nova já chama `aviso_de_grab` em app/actions/jogar/painel.py
csv:42 reconciliar.recado  : SO-GTK, mas a tela nova já chama `reconciliar_toast` em a01_jogar.py, painel.py
```

O veredito das três passa a **`CURADO`**, e a coluna `onde_html` recebe:

| linha | `veredito` | `onde_html` |
| --- | --- | --- |
| 39 `mascara.divergencia` | `CURADO` | `interface/pacotes/a01_jogar.py:_aviso_da_divergencia_de_mascara` |
| 40 `grab.aviso` | `CURADO` | `app/actions/jogar/painel.py:aviso_do_grab_dobrado` |
| 42 `reconciliar.recado` | `CURADO` | `app/actions/jogar/painel.py:recibo_do_reconectar` |

(O portão de `CURADO` confere que o arquivo de `onde_html` cita o símbolo do
dono — os três citam.) A quarta queixa, `csv:47 migrar_para_systemd`, é da aba 09
e **já estava na base**.

#### A.2 `docs/data/paridade-gtk-html.csv` — SEIS linhas, e a régua NÃO as viu

**ESTE É O ACHADO QUE MAIS IMPORTA DESTA ENTREGA, e é sobre um instrumento.**
`check_paridade_gtk_html.py` vê **UMA** das seis dívidas que fechei — a 28, que
um portão obrigou a mudar de arquivo. As outras cinco ele não vê, e a causa é
estrutural: as duas réguas desta casa **discordam sobre onde fica "a tela
nova"**.

| régua | o que ela chama de tela nova |
| --- | --- |
| `check_donos_de_comportamento.TELA_NOVA` | `interface/`, `app/actions/perfis_web.py`, **`app/actions/jogar`** |
| `check_paridade_gtk_html.SO_HTML` | `interface/`, `app/telas/`, `mockup/` — **`app/actions/jogar` conta como lado GTK** |

Como `painel.py` é `app/actions/jogar/`, uma dívida fechada por ele é invisível
para a paridade: o `sinal` continua "ausente do lado HTML" e a linha segue
`FALTA_NO_HTML` com o portão VERDE. **A prova está nesta própria entrega:** a
linha 28 só apareceu como `divida-fechada` depois de a função mudar de arquivo
por causa de OUTRO portão. Se ela tivesse ficado onde nasceu, seriam seis
dívidas fechadas e zero achados. **É o padrão que esta casa persegue — verde
sobre nada** — e ele vai repetir em toda sprint que use `painel.AVISOS_DA_TELA`,
que é justamente o caminho que as sprints mandam usar. A cura é da
**PARIDADE-REMEDIR-02** e é de uma linha: `SO_HTML` tem de incluir
`src/hefesto_dualsense4unix/app/actions/jogar/`. Enquanto não incluir, **não
confie no verde dessa régua para esta aba**.

**E A ORDEM IMPORTA: a régua tem de ser curada ANTES das linhas.** Cinco das
seis apontam `html_onde`/`sinal_escopo` para `app/actions/jogar/painel.py`, e
enquanto `SO_HTML` não o incluir a própria régua reprova quem escrever a
verdade — com `lado-trocado` (*"html_onde cita …, que é do lado GTK"*) e com
`sinal-sumiu`. Escrever as linhas primeiro troca dois achados por outros dois.

O texto pronto das seis linhas (as demais colunas ficam como estão):

| linha do arquivo | `veredito` | `sinal` (código, nunca prosa) | `sinal_espera` | `sinal_escopo` | `html_onde` | `html_faz` |
| --- | --- | --- | --- | --- | --- | --- |
| 12 | `IGUAL` | `texto_do_desktop_sem_emulacao` | `PRESENTE` | `src/hefesto_dualsense4unix/app/actions/jogar/painel.py` | `src/hefesto_dualsense4unix/app/actions/jogar/painel.py:917` | A coluna Atenção chama a MESMA função pura da janela antiga, com o selo `MODO`. O terceiro argumento (`modo_mudou_agora`) fica de fora — uma fonte desta coluna é pura, e o preço (o aviso pode piscar por até 2 s na transição) está declarado no relato. |
| 17 | `IGUAL` | `aviso_do_grab_dobrado` | `PRESENTE` | `src/hefesto_dualsense4unix/app/actions/jogar/painel.py` | `src/hefesto_dualsense4unix/app/actions/jogar/painel.py:938` | `painel.aviso_do_grab_dobrado` lê `primary_grab_state`, o gamepad e o primário CONECTADO do `state` e chama `home_actions.aviso_de_grab` — a condição não foi reescrita. A linha e o porquê viajam juntos: a coluna tem um campo de texto por aviso, não um `hover` por linha. |
| 25 | `IGUAL` | `recibo_do_reconectar` | `PRESENTE` | `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py` | `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:2406` | O gesto passou de dois `p.chamar` para dois `p.resultado`: `coop.sync` falho vira `RuntimeError` (recusa laranja) e não corre o segundo passo; o desfecho vira `{"recado": …}` montado por `home_actions.reconciliar_toast`. Os quatro desfechos da janela antiga chegam à tela. |
| 26 | `IGUAL` | `_reconciliar_gate_text` | `PRESENTE` | `src/hefesto_dualsense4unix/app/actions/jogar/painel.py` | `src/hefesto_dualsense4unix/app/actions/jogar/painel.py:944` | A função pura do dono entra em `AVISOS_DA_TELA` DIRETO, com o selo `JOGO`, e a frase é a dele sem prefixo nosso. Fotografada logo acima do botão "Reconectar Controles". |
| 28 | `IGUAL` | `_aviso_da_divergencia_de_mascara` | `PRESENTE` | `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py` | `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:1067` | Lê o ALARME que o daemon publica (`gamepad_emulation.mascara_divergente`) por `mascara_divergente_do_daemon` e escreve com `texto_da_divergencia`, fonte `FONTE_PERFIL` — nomeia o perfil, nunca um gesto dela. O markup do Pango sai por `sem_markup`. A lista irmã (jogo fechado) continua de fora, de propósito. |
| 35 | `IGUAL` | `aviso_da_origem_do_modo` | `PRESENTE` | `src/hefesto_dualsense4unix/app/actions/jogar/painel.py` | `src/hefesto_dualsense4unix/app/actions/jogar/painel.py:949` | `painel.aviso_da_origem_do_modo` lê `native_mode` + `native_mode_origin` + `mode_from_profile` e monta com os RÓTULOS DA TELA (`home_actions._MODE_ITEMS`), não com as palavras da casa. Selo `PERFIL`. |

### B. A frase da linha 12 manda para botões que não existem

`home_actions.TEXTO_DESKTOP_SEM_MOUSE` / `_SEM_TECLADO` / `_SEM_MOUSE_NEM_TECLADO`
dizem *"Ligue 'Emular mouse' na aba Navegação"*. Na interface nova aqueles dois
interruptores chamam-se **"Status do Modo"** e **"Função do teclado"**
(`interface/paginas/06-navegacao.html:3311-3312`). O glossário proíbe *"qualquer
frase que mande a pessoa procurar um botão ou uma janela que não existe"*. **Três
constantes, um arquivo** (`app/actions/home_actions.py`, que é `nao_toca:` desta
sprint) — e a cura tem de cobrir as três, não uma.

### C. `interface/hefesto_vivo.py` — a linha do serviço calado continua sem
chegar à tela viva

Herdado da JOGAR-O-QUE-FALTA-01 e conferido de novo aqui: o piloto imprime
`[daemon mudo]` e `return True` sem chamar o pacote, então
`_aviso_do_servico_calado` só acende no dublê. **Fotografei a tela do serviço
desligado e ela mostra a linha** — porque o piloto, ao abrir a aba com o socket
ausente, pinta uma vez. Quem for à `ONDA5-P-01` fecha isto com uma linha.

### D. A palavra "reconciliar" na casa e "reconectar" na tela

`RECONCILIAR_LABEL`, `RECONCILIAR_JOGO_ABERTO_TEXT`, `reconciliar_toast` e o
texto que eles devolvem (*"Jogadores reconciliados — N jogador(es)"*) usam o
verbo do botão ANTIGO. A tela diz "Reconectar Controles". **Não é frase banida e
não a mudei** — reescrever a frase do dono é o que a regra 1 proíbe —, mas é
divergência de língua e a decisão é dela.

### E. O QUE CAIU DA SPRINT — os DEZESSEIS endereços de linha do §1

O enunciado dá, para cada uma das seis, um `O dono na GTK (reuse, não
reescreva)` com dois ou três `home_actions.py:NNNN`. **Conferi os dezesseis, um
a um, e NENHUM aponta para o que a sprint diz.** Amostra:

```
:1381  DESFECHO_BLOQUEADO = "bloqueado_por_jogo"      (a sprint diz: o aviso de grab)
:2992  "por convenção — não há frase a escrever…"     (idem)
:2179  "# frase 'O que o controle faz agora'…"        (a sprint diz: a linha de origem)
: 821  (linha em branco)                              (a sprint diz: o recibo)
```

Os endereços VIVOS, medidos nesta árvore, e é o que os substitui:

| linha | o dono de verdade |
| --- | --- |
| 12 | `home_actions.py:919` `texto_do_desktop_sem_emulacao` (as frases em `:902`, `:907`, `:912`) |
| 17 | `home_actions.py:1551` `aviso_de_grab` · chamador em `:3149` · textos em `:1538`/`:1542` |
| 25 | `home_actions.py:978` `reconciliar_toast` · encadeamento em `:3269` |
| 26 | `home_actions.py:844` `jogo_com_autoridade` · `:864` `_reconciliar_gate_text` · `:837` o texto |
| 28 | `home_actions.py:1146` `mascara_divergente_do_daemon` · `:1173` `texto_da_divergencia` |
| 35 | **não há função** — a regra vive solta em `HomeActionsMixin._render_home`, `home_actions.py:2884-2892` |

**A linha 35 é a que mais importa desta lista**, e ela mudou o trabalho: a
sprint a descreve como se houvesse um dono a reusar, e não há. Foi por isso que
`aviso_da_origem_do_modo` nasceu em `painel.py` — não por escolha de arquitetura,
mas porque não havia nada para importar.

**A MESMA DÍVIDA ESTÁ NO CSV DA PARIDADE**, na coluna `gtk_onde` das seis
linhas: os números de lá são os mesmos do enunciado. Quem for reescrever essas
linhas (§A.2) leva a tabela acima junto — senão troca um veredito certo por um
endereço morto.
