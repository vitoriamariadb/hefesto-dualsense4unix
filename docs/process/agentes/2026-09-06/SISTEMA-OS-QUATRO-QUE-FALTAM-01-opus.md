# SISTEMA · OS QUATRO QUE FALTAM — `SEM_MOTOR` ficou vazia, e o botão que ela nunca viu nasce escondido

Árvore: `hefesto-voo/SISTEMA-OS-QUATRO-QUE-FALTAM-01-opus`, branch
`voo/SISTEMA-OS-QUATRO-QUE-FALTAM-01-opus`. Nasceu em `c15d2e3e`, que é o mesmo
`git rev-parse --short onda/atual-0609` — conferido antes da primeira linha.

---

## O que mudou

### 0. O estado, em uma linha

**`a09_sistema.SEM_MOTOR` ficou VAZIA** (era cinco em 03/09, um em 06/09) ·
**três gestos novos, os três protegidos pelo decorador no mesmo commit** ·
**dois botões novos na bancada, e o do modo improvisado TROCA DE LUGAR com o
«Reiniciar o serviço»** · **a L323 medida no WebKit nos TRÊS que ninguém tinha
clicado** · **seis mordidas coladas** · **um número de foto remedido e trocado**.

### 1. L315 — "Corrigir modo de execução" (`corrigir-modo`)

A aba RECONHECE o modo improvisado desde 03/09 — a linha "O serviço está"
escreve *"Ligado, em modo improvisado"* em laranja — e **não oferecia saída**.
Quem caía nesse estado era avisado e não tinha botão de conserto.

O gesto faz os TRÊS tempos da janela antiga, na ordem dela, e **nenhum deles é
reescrito aqui**:

| tempo | dono |
| --- | --- |
| ler o pid do Hefesto avulso | `DaemonActionsMixin._read_daemon_pid` |
| pedir que ele saia, e ESPERAR | `a09._o_avulso_saiu` → `utils.single_instance.is_alive` |
| subir a unit | `a09.ativar_o_servico` (o dono único de ligar, com os três portões do produto) |

**A ESPERA NÃO É ZELO:** o terceiro portão de `ativar_o_servico`
(`_daemon_pid_alive`) RECUSA subir a unit enquanto o avulso vive — subir aí
criaria um segundo Hefesto disputando o mesmo `hidraw`, que é a
BUG-MULTI-INSTANCE-01. Chamar os dois sem a espera no meio devolveria *"não
liguei"* sobre um daemon que estava saindo.

**ELE NÃO ESCALA PARA `SIGKILL`**, e é decisão: um daemon que ignora o SIGTERM
está no meio de alguma coisa, e matá-lo à força deixaria os aparelhos dela num
estado que ninguém arrumou. O botão recusa dizendo.

**SEM CONFIRMAÇÃO**, pelo mesmo argumento do "Ativar o serviço" ao lado: pedir
dois cliques para CONSERTAR é uma parede na saída de emergência. Ele só aparece
no estado em que é a única coisa a fazer.

**As duas frases do recibo saíram de dentro do `_on_migrate_done`** e viraram
`daemon_actions.MIGRAR_DEU_CERTO` / `MIGRAR_NAO_DEU` — a janela antiga passou a
lê-las de lá também.

### 2. L340 — "Aplicar aos jogos da Steam" (`aplicar-aos-jogos`)

Era a metade que APLICA o que o «Copiar a linha» da aba Lançadores só entrega
na área de transferência. Motor: `steam_launch_options.apply_wrapper_to_all_games`
DENTRO de uma janela de `with_steam_closed` — o mesmo caminho do "Deixar tudo
pronto" da aba 07, e o mesmo `getattr` defensivo do contrato PATH-06.

**O consentimento em dois cliques é exigência do MOTOR**, não desenho meu:
`with_steam_closed` fecha a Steam dela por uns 20 segundos. A pergunta é a do
diálogo da janela antiga, palavra por palavra — e ela saiu de dentro do
`_build_steam_apply_confirm_dialog` hoje para virar
`DaemonActionsMixin._STEAM_APPLY_CORPO`, ao lado do `_STEAM_READY_CORPO` que já
existia pela mesma razão.

Os três desfechos do motor estão cobertos e nenhuma frase é minha:
`format_steam_janela_recusa` (jogo aberto · a Steam não fechou · resposta
inesperada) e `format_apply_wrapper_result` (quantos mudaram, ficaram, falharam).

### 3. L343 — "Restaurar de fábrica" (`restaurar-de-fabrica`)

O botão estava na página desde que ela nasceu, vermelho, prometendo *"Pergunta
antes"* — e o clique caía em `gesto_da_pagina() -> None`, imprimindo
`[gesto sem dono]` no terminal de quem lançou a janela.

O que o segurava **não era o motor** (medido desde 04/09): é a REDE DE
SEGURANÇA — um gesto que grava restauraria o perfil DELA quando a prova botão a
botão o acionasse. Com a `ONDA3-GESTO-DECLARA-01` a rede mora no decorador, e
este gesto a declara no mesmo commit em que nasce.

Os três tempos são os de `pacotes.perfil.gravar_e_reaplicar` (disco →
`profile.switch` → `launch_env.refresh`), e a identidade é decidida AQUI
(PERFIL-PADRAO-PERSONALIZADO-01): o asset pode ser o de uma versão anterior, e
gravar o nome que veio dele recriaria o catch-all que ela mandou aposentar.

**O `era=` é o que faz ele ADOTAR COMO ATIVO.** `gravar_e_reaplicar` só manda
`profile.switch` quando o perfil gravado é o que está valendo; passar o nome que
está valendo AGORA faz a comparação casar. Sem ele, o `.json` mudaria no disco e
o controle continuaria com o perfil anterior — o sintoma que ela leu como *"não
está salvando"*.

**E UMA DÍVIDA DA RÉGUA DA PALAVRA MORREU JUNTO.** A recusa deste caminho era
dev-fala desde 23/08 — *"Asset 'personalizado.json' não encontrado — Restaurar
Default indisponível."* — e estava declarada em
`validar-palavra-de-tela.DIVIDA_DA_PALAVRA_01_PY`. Ela virou
`footer_actions.frase_do_preset_ausente()`, dono único dos DOIS chamadores, e a
entrada saiu da lista — que é o que o próprio portão manda fazer quando a frase
é trocada.

### 4. L323 — o recibo do gesto: MEDIDO, e não afirmado

O enunciado dizia *"`retomar`, `atualizar`, `autostart` e `reiniciar` agem e o
sucesso é mudo — ligue-os à piscada verde"*. **A piscada já os alcançava** — ela
mora no `finally` do piloto e vale para qualquer elemento clicado —, e o que
faltava era alguém MEDIR. O `test_a_aba_09_sistema_fecha_as_linhas` provava UM
botão, o `atualizar`. Os outros três nunca tinham sido clicados por régua
nenhuma, e **`autostart` não é sequer um `<button>`**: é a `.chave` do
interruptor, e a folha da casa pinta `outline`, que qualquer elemento aceita.

Medido no WebKit, com o piloto do produto e dublês registrados em
`pacotes.GESTOS` (nada foi ao daemon de quem roda a suíte):

```
retomar    verde=True   em_voo=False
reiniciar  verde=True   em_voo=False
autostart  verde=True   em_voo=False     ← e ele é um <span>, não um botão
atualizar  verde=False               ← o dublê RECUSOU, e ele não pode piscar
```

**Nenhuma linha de código foi escrita para esta linha do CSV** — o que ela
ganhou foi a prova. É o oposto do padrão que esta casa persegue (o instrumento
respondendo sobre outra coisa que não o produto), e por isso está escrito aqui
em vez de virar uma cura sobre um defeito que não existia mais.

### 5. A TROCA DE LUGAR, e ela nasceu de uma medição que derrubou o desenho óbvio

O desenho óbvio — o botão novo AO LADO dos quatro da coluna do serviço —
**rola a aba**:

```
os cinco na coluna ......... a coluna vai a 194px (o irmão, Perfil de Bateria, tem 156)
                             e o miolo ROLA 38px por dentro     ← medido no WebKit
a troca com o «Reiniciar» .. rola 0px
```

E a troca não é só de pixel. **No modo improvisado o «Reiniciar o serviço» é
justamente o clique que NÃO funciona:** `systemctl restart` sobe a unit, a unit
encontra o Hefesto avulso segurando a instância única e não sobe — e
`aba_sistema.travas()` **não o tranca nesse estado** (medido: em `online_avulso`
ela só tranca o `retomar`). Pôr no lugar do clique que falha o clique que
conserta é o que a decisão faz.

É o irmão CSS das duas caras que o botão «Parar o serviço»/«Ativar o serviço» já
tem por decisão dela de 03/09 — e aqui sai de graça, porque
`.so-avulso.mostra + .acao{display:none}` alcança o vizinho seguinte, que é
exatamente o `.acao` do Reiniciar.

### 6. O preço do quarto botão dos gestos raros, pago em pixel

O "Aplicar aos jogos da Steam" foi para a coluna **Avançado**, e não para
"Preparar os jogos". A razão está escrita na própria dica da aba: *"os três
botões à direita **já rodaram sozinhos neste exame**"* — e este nunca rodou.
Ele é raro e destrutivo, como o "Restaurar de fábrica" ao lado.

O quarto botão custou 26px, e eles foram pagos assim:

| o que mudou | quanto | por quê |
| --- | --- | --- |
| `.lista{gap:4px}` → `gap:0` | 12px | a MESMA gramática que `.exame .col-acao` já usa nesta página |
| `.sec-alta{margin-top:10px}` → `8px` | 4px (×2 faixas) | o corte é no vão ENTRE as faixas — nenhum bloco encolhe |

**Nenhum bloco encolheu e nenhum texto mudou de tamanho.** A página fecha em
**530px de conteúdo para 530px de espaço útil**, sem rolar.

### 7. UM NÚMERO DE FOTO ESTAVA ERRADO, e foi substituído

`aba09.MIOLO_H, ALTURA` dizia **`544, 542`** — 2px de folga. Medido de novo no
Chrome, pelo mesmo caminho de sempre: **o miolo tem 564 e o conteúdo tinha
508**. A folga real era de 22px, não de 2 (o número velho contava dentro os 34px
de recuo do miolo).

**O número errado custou nesta própria sprint:** com ele, o quarto botão dos
gestos raros parecia impossível antes de alguém abrir o navegador. Trocado por
`564, 530`, com a data e a conta.

### 8. Os arquivos

| arquivo | o que entrou |
| --- | --- |
| `interface/pacotes/a09_sistema.py` | os três gestos; `SEM_MOTOR` vazia; `DESTRUTIVOS` +1; `CAMPO_DO_MODO_AVULSO`; a emissão em todo tique nos DOIS ramos do `pacote()`; `_rotulo_do_desenho` com a bancada como segunda fonte; `PISO_DA_ABA` 9→12; `PONTE`/`METODOS` |
| `interface/aba09.py` | `item_escondido()`; os dois botões; o CSS da troca; `_N_BTN` deixando de contar o que está fora do fluxo; `MIOLO_H, ALTURA` remedidos; a dica do Avançado |
| `app/actions/daemon_actions.py` | `MIGRAR_DEU_CERTO` / `MIGRAR_NAO_DEU`; `_STEAM_APPLY_CORPO`; `frase_sem_aplicacao_em_massa()` (era literal em dois lugares) |
| `app/actions/footer_actions.py` | `frase_do_preset_ausente()` e `frase_do_restauro()`, donos únicos dos dois chamadores |
| `mockup/09-sistema.html` | a bancada regerada |
| `mockup/DIVERGENCIAS.md` | a terceira divergência da 09, com a medição da troca |
| `tests/unit/test_os_quatro_gestos_da_aba_sistema_que_faltavam.py` | 27 casos em três camadas |

**E DOIS ARQUIVOS FORA DA MINHA POSSE, os dois nomeados aqui em voz alta:**

* **`gui/aba_sistema.py`** — DUAS chaves acrescentadas a `GESTOS`
  (`corrigir-modo` e `aplicar-aos-jogos`). Não é escolha: `aba09._gesto()`
  **recusa gravar a página** com um `data-gesto` cujo dono não está declarado
  ali (*"um gesto sem dono declarado é um botão que mente"*). Sem as duas
  linhas a sprint não tem como existir. A mudança é aditiva — duas chaves num
  dicionário — e o conflito, se houver, é de uma linha;
* **`scripts/validar-palavra-de-tela.py`** — a entrada da dívida paga foi
  APAGADA. Também não é escolha: o portão reprova nomeando (*"a dívida … não
  existe mais em `app/` — a frase foi trocada, e é uma boa notícia. APAGUE a
  entrada"*).

### 9. QUATRO ENDEREÇOS QUE O MEU PRÓPRIO COMMIT ENVELHECEU

Acrescentar as três constantes no topo de `daemon_actions.py` empurrou o arquivo
para baixo, e **quatro citações `arquivo:linha` em `src/` passaram a apontar
para linha em branco**. O portão `citacoes-no-codigo` as pegou nomeando os dois
números, o citado e o real:

```
app/actions/config/secao_janela.py:436   daemon_actions.py:1955-1961 -> 1998-2004
daemon/main.py:76                        daemon_actions.py:2162-2176 -> 2192-2206
utils/chave.py:12                        daemon_actions.py:2162-2176 -> 2192-2206
interface/pacotes/a09_sistema.py:385     daemon_actions.py:1136,1145 -> 1175,1185
```

Três dos quatro arquivos citantes são de outra posse. **Não é edição de escopo:
é a limpeza do estrago que este commit fez** — quem empurra as linhas remede as
citações, e a alternativa (`_CITACOES_PENDENTES`) seria declarar como dívida
alheia um número que eu mesmo quebrei.

### 10. A foto e o clique

| | |
| --- | --- |
| antes (o publicado) | `SISTEMA-OS-QUATRO-QUE-FALTAM-01-antes-o-publicado.png` |
| depois (a bancada) | `SISTEMA-OS-QUATRO-QUE-FALTAM-01-depois-a-bancada.png` |
| o modo improvisado | `SISTEMA-OS-QUATRO-QUE-FALTAM-01-o-modo-improvisado.png` |

Na terceira, o «Corrigir modo de execução» está no lugar do «Reiniciar o
serviço» e o miolo mede `rola=0`. As três saíram `--oculta`/headless; **nenhuma
janela nasceu na tela dela.**

O CLIQUE de verdade está na camada 3 da régua nova: o WebKit do produto abre a
bancada, o piloto pinta, a régua clica `retomar`, `reiniciar`, `autostart` e
`atualizar` pelo ouvinte real, e lê o DOM depois do pouso.

---

## Qual mordida prova

Seis, e as saídas estão coladas.

**1 — o consentimento do «Aplicar aos jogos».** `if not _confirmado(...)` → `if False`:

```
E  AssertionError: a Steam dela foi fechada no PRIMEIRO clique — o consentimento sumiu.
   1 failed, 26 deselected
```

**2 — o campo do modo improvisado em TODO tique.** Emitir só quando há modo:

```
E  AssertionError: o pacote não emitiu `corrigir-modo-quando` com o serviço em
   'online_systemd' — o botão fica congelado no estado da volta anterior.
E  AssertionError: … com o serviço em 'offline' — …
```

**3 — a recusa fora do modo improvisado.** `!= "online_avulso"` → `if False`:

```
1 failed, 26 deselected   (Failed: DID NOT RAISE <class 'RuntimeError'>)
```

**4 — o `era=` que adota o perfil como ativo.** Tirado do gesto:

```
E  AssertionError: o perfil foi gravado no disco e o controle não foi avisado —
   [('launch_env.refresh', (), {})]
E  assert ['launch_env.refresh'] == ['profile_switch', 'launch_env.refresh']
```

**5 — a regra que esconde o botão.** Arrancada do CSS, e quem responde é o
GERADOR, antes de qualquer teste:

```
ERRO: há 1 botão(ões) `so-avulso` na coluna do serviço e a folha desta aba não
os esconde mais. Ou a regra `.so-avulso:not(.mostra){display:none}` volta, ou o
botão passa a ocupar linha na cena que ela aprovou — e aí são 30px de coluna a
mais num bloco cuja altura é a promessa desta faixa.
```

**6 — a troca com o «Reiniciar».** `.so-avulso.mostra + .acao{display:none}`
arrancada; a régua da TELA VIVA reprova com o número:

```
E  AssertionError: os dois estão na tela ao mesmo tempo — a coluna cresce, a aba
   rola, e um dos dois cliques não funciona: {'corrigir': {'visivel': True, …},
   'reiniciar': {'visivel': True}, …, 'rola_por_dentro': 38}
E  AssertionError: com-o-modo: o miolo rola 38px por dentro
   2 failed, 25 deselected
```

Com as seis devolvidas: **27 passed**.

E as réguas que já existiam continuam verdes com o trabalho todo dentro:
`test_a_09_sistema_sai_do_desenho.py` + `test_a_aba_09_sistema_fecha_as_linhas.py`
= **66 passed**; `test_todo_gesto_que_grava_esta_protegido.py` +
`test_a_09_sistema_fecha_a_paridade.py` verdes na mesma volta.

---

## O que NÃO verifiquei

* **NADA FOI PROVADO NO APARELHO NEM NA MÁQUINA DELA.** A bancada estava LIVRE e
  eu **não a reservei**: os três gestos param o daemon, fecham a Steam e
  reescrevem o perfil dela, e `bancada: false` no frontmatter diz que esta
  sprint não é de aparelho. Os três motores são dublados no ponto em que
  sairiam do processo — `_invoke_systemctl`, `with_steam_closed`,
  `loader.save_profile`. **A linha de prova de aparelho fica para a
  MESA-DE-QUATRO-01.**
* **O `corrigir-modo` nunca rodou contra um daemon avulso de verdade.** O que
  está medido é o COMANDO que teria ido ao systemd (`reset-failed`, `start`) e a
  ordem dos três tempos. Ninguém pôs esta máquina em `online_avulso` para ver.
* **O `aplicar-aos-jogos` nunca tocou um `localconfig.vdf`.** `with_steam_closed`
  e `apply_wrapper_to_all_games` são dublados; o que está medido é que o
  primeiro clique NÃO os chama e o segundo chama uma vez cada.
* **O `restaurar-de-fabrica` nunca gravou no `~/.config` real.** O preset é o
  arquivo de verdade do repositório copiado para um `tmp_path`, e
  `loader.save_profile` é dublado.
* **Não rodei a suíte inteira** — ela é de quem coordena, e roda no fim, em
  oito lotes. Rodei o meu escopo.
* **Não abri a interface no piloto vivo (`hefesto_vivo.py --oculta`)** fora da
  régua: rodar o piloto dispara as migrações one-shot no `~/.config` real dela.
  A camada 3 da régua nova abre o MESMO WebKit com o `estado_do_daemon` dublado.
* **A troca de lugar entre o «Corrigir modo» e o «Reiniciar» é decisão minha
  como PO por delegação** (§"o que sobrou"). Ela ainda não viu.

---

## O que sobrou para o próximo

### 1. DOIS PORTÕES VERMELHOS, e os dois porque a DÍVIDA FECHOU

**`bash scripts/portoes.sh` fecha em 43 verdes de 45**
(`/tmp/portoes-SISTEMA-OS-QUATRO-QUE-FALTAM-01.txt`). Os dois vermelhos são
REGISTRO que falta, não código — e os dois arquivos são de `docs/data/`, o
`nao_toca:` desta sprint.


Os dois arquivos estão em `docs/data/`, que é o **`nao_toca:` desta sprint**, e a
regra 4 dela manda entregar o texto pronto para a `PARIDADE-REMEDIR-02`
recolher. Estão prontos para colar:

**`paridade-gtk-html.csv:315` — L315, de `FALTA_NO_HTML` para `IGUAL`:**

* `sinal`: **`MIGRAR_DEU_CERTO`** — e a troca do sinal é obrigatória
  (`D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA`). O sinal de hoje
  (`on_daemon_migrate_to_systemd`) casa com a **prosa da minha docstring**, que
  cita o handler da janela antiga: é a mesma armadilha que a própria linha
  descreve desde 03/09 (*"a régua leu a palavra e contou como ato"*).
  `MIGRAR_DEU_CERTO` é CÓDIGO — o gesto o lê como `_daemon.MIGRAR_DEU_CERTO`;
* `html_onde`: `src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py` ·
  `src/hefesto_dualsense4unix/interface/aba09.py`;
* `html_faz`: *"Gesto `corrigir-modo`, no botão que nasce ESCONDIDO e aparece no
  lugar do «Reiniciar o serviço» quando o estado é `online_avulso`. Lê o pid
  (`_read_daemon_pid`), pede que o avulso saia por SIGTERM e ESPERA
  (`single_instance.is_alive`), e sobe a unit pelo dono único de ligar
  (`ativar_o_servico`, com os três portões do produto). As duas frases do recibo
  são `daemon_actions.MIGRAR_DEU_CERTO`/`MIGRAR_NAO_DEU`, que saíram de dentro
  do `_on_migrate_done` no mesmo commit."*

**`paridade-gtk-html.csv:340` — L340, para `IGUAL`:** sinal
**`apply_wrapper_to_all_games`**; `html_onde` idem; `html_faz`: *"Gesto
`aplicar-aos-jogos`, na coluna Avançado por `D-0609-STEAM-DIVIDIDO`. Dois
cliques (o consentimento que `with_steam_closed` EXIGE), corpo da pergunta
palavra por palavra do dono (`DaemonActionsMixin._STEAM_APPLY_CORPO`), e os três
desfechos pelas frases do produto."*

**`paridade-gtk-html.csv:343` — L343, para `IGUAL`:** sinal
**`_meu_perfil_asset`** (agora é CÓDIGO: o gesto o chama); `html_faz`: *"Gesto
`restaurar-de-fabrica`, dois cliques, com os três tempos de
`perfil.gravar_e_reaplicar` e a identidade normalizada para `NOME_DO_PADRAO`. As
duas frases são `footer_actions.frase_do_preset_ausente`/`frase_do_restauro`."*

**`paridade-gtk-html.csv:323` — L323:** a linha fecha **sem código novo**. Sinal
`hef-deu-certo`; `html_faz`: *"Todo gesto que volta sem levantar pisca o campo
clicado em verde por 1,5 s (`hefesto_vivo.voltouDoVoo`, decisão dela na 03-Q4), e
o que traz notícia fala no cartão. Medido no WebKit em 06/09 nos quatro desta
aba — `retomar`, `reiniciar` e `autostart` piscam; o que recusa não pisca."*

**`donos-de-comportamento.csv:47` — `migrar_para_systemd`:** sai de `SO-GTK`
para **`CURADO`**, com o endereço `interface/pacotes/a09_sistema.corrigir_modo`.

### 2. A DECISÃO QUE TOMEI COMO PO, e o registro que não pude escrever

`docs/data/decisoes-dela.csv` está no meu `nao_toca:`. A linha, pronta:

```
D-0609-O-BOTAO-DO-MODO-IMPROVISADO-TROCA-DE-LUGAR ; quem_decidiu=delegacao ; 2026-09-06
```

**A decisão:** o botão "Corrigir modo de execução" nasce escondido e, quando o
serviço está em modo improvisado, **entra no lugar do «Reiniciar o serviço»** —
não ao lado dele. **Reversível numa frase:** apague
`.so-avulso.mostra + .acao{display:none}` do CSS da aba e os dois passam a
aparecer juntos (ao preço de 38px de rolagem, medidos).

**As duas razões, as duas medidas:** com os cinco botões a coluna do serviço vai
a 194px contra 156 do irmão e a aba rola 38px; e no modo improvisado o
«Reiniciar» é o clique que não funciona — `travas()` não o tranca lá, e a unit
não sobe com o avulso vivo.

### 3. O que fica ABERTO, e é dela

* **PUBLICAR a aba 09** (`scripts/check_o_desenho_aprovado.py --publicar 09`).
  Até lá os dois botões só existem na bancada. A divergência está declarada em
  `mockup/DIVERGENCIAS.md` com as três entradas da 09 fechando no mesmo ato;
* **a palavra do botão** — "Corrigir modo de execução" é a do CSV e a do recibo
  do motor (*"Não consegui corrigir o modo de execução"*). É PROVISÓRIO até ela
  olhar;
* **a troca de lugar** (§2). Ela vê e diz.

### 4. Achados que não são meus para curar

* **`aba_sistema.GESTOS["restaurar-de-fabrica"]` cita `main.glade:4272`**, e o
  Glade **não existe mais** (`D-0609-GTK-LEVA-INTEIRA`). Não toquei: a linha é
  prosa de dono, e reescrevê-la junto com as duas chaves que precisei acrescentar
  seria mais mudança do que a sprint autoriza num arquivo alheio. Há mais
  citações do `.glade` vivas nesse dicionário;
* **`aba_sistema.travas()` não tranca `reiniciar` em `online_avulso`**, e ali ele
  é o clique que falha. A troca de lugar cobre a TELA; quem clicar por outro
  caminho (a régua, o teclado) ainda dispara um `restart` que não sobe. A cura é
  uma linha em `gui/aba_sistema.travas()`, que é camada do produto e não é minha.
  É irmã da divergência que `a09.TRAVA_QUE_NAO_VALE_AQUI` já declara;
* **`ALTURA`/`MIOLO_H` das OUTRAS nove abas** são do mesmo tipo do que remedi
  aqui (§7): números de foto sem régua que os cobre. Se um deles estiver errado
  como este estava, a próxima frente que precisar de um pixel vai concluir que
  não há espaço. Um portão que remeça os dez com o Playwright cabe numa sprint
  pequena.
