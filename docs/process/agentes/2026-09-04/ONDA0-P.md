# ONDA0-P · O PILOTO — a tela que não fica nua, e o canal que só sabia recusar

**Sprint:** `docs/process/sprints/2026-09-04-ONDA0-P-O-PILOTO-01-a-tela-que-nao-fica-nua-e-o-canal-de-sucesso.md`
**Árvore:** `hefesto-voo/ONDA0-P-O-PILOTO-01-P` · branch `voo/ONDA0-P-O-PILOTO-01-P`
**Posse:** `interface/hefesto_vivo.py` · `gui/ponte_da_tela.py` · `app/theme.py`
**Bancada:** LIVRE o tempo todo; **uso de LEITURA apenas** — nenhuma escrita no
aparelho, o daemon nunca foi parado, e `scripts/bancada.sh` não precisou ser
reservado.
**Portões:** `TODOS VERDES — 36 portões` · `rc=0`, com o cabeçalho conferido
(`python` na venv da árvore principal, `PYTHONPATH` na minha).
**Testes do escopo:** 1.421 verdes em quatro lotes (98 arquivos).

---

## O que mudou

### T-01 · A TELA NUA — o único defeito VIVO, e ele foi MEDIDO antes de curado

`gui/ponte_da_tela.py` passa a ouvir **`web-process-terminated`** e a
**recarregar** a página à vista; `interface/hefesto_vivo.py` passa a **pausar a
pintura** e a **dizer** na tela que isso aconteceu.

* `JanelaDaAba` ganha `ao_morrer_a_pagina`, `mortes`, `recargas` e
  `_morreu_a_pagina` / `_recarregar`. A recarga tem **teto** (3 seguidas,
  zerado por 60 s de página viva): uma página que matasse o processo web a cada
  carga viraria laço infinito, e um laço comendo CPU na máquina dela é pior que
  a tela congelada.
* `Piloto._a_pagina_morreu` põe `self.pronto = False` e deposita o aviso na
  **chave vazia** — a tarja de rodapé, que é o endereço honesto: um processo que
  morre não é de controle nenhum.
* **A cura mora na JANELA, não no piloto**, e isso cura **seis** pilotos de uma
  vez: `controles_vivos`, `jogar_vivo`, `conexoes_vivas`, `perfis_vivos`,
  `sistema_viva` e o `hefesto_vivo` herdam sem uma linha.
* Nasce `scripts/ensaios/a_tela_nao_fica_nua.py` — 20 minutos `--oculta`, uma
  leitura por minuto, com `--matar-aos` e `--sem-cura` (as duas mordidas
  embutidas).

### S-01 · O canal de recado de SUCESSO (D-01: *"No próprio cartão, como a recusa"*)

O depósito `_recados` passa a guardar **`(frase, quando, tom)`**, e o tom é
`recusa` ou `sucesso`. Um dicionário separado para o sucesso seria a segunda
cópia da mesma regra — a poda, a tradução `uniq → pref`, a sobrevivência à
repintura — e a segunda divergiria.

* `_depositar(uniq, frase, tom)` é o canal, e os dois desfechos atravessam ele;
* `_deu_certo_dizendo(pagina, nome, uniq, resposta)` **embrulha** o `_deu_certo`
  (que fica intacto, com a régua que já tinha) e deposita o recibo;
* a **frase é do dono do assunto**: um gesto que devolva `{"recado": "…"}` manda
  a própria, e o `recado` é retirado da carga antes da pintura. É onde a D-12
  pousa. Sem isso vale `FRASE_DE_SUCESSO = "Pronto."` — **a palavra que a janela
  GTK desta casa já usa** (`app/actions/daemon_actions._SYSTEMCTL_OK_MSG`), e não
  uma invenção;
* `SEGUNDOS_DO_RECADO_DE_SUCESSO = 6.0` contra os 30 s da recusa: recibo é aviso,
  não estado;
* no BOOTSTRAP, `COR_DO_SUCESSO` reusa `--green` da paleta das dez páginas, e o
  estilo **se refaz quando o tom muda** — a chave é o controle, não o desfecho.

**Os dois segundos canais que as listas das abas 03 e 05 propunham (o campo que
pisca, a faixa embaixo da grade) NÃO foram construídos**, e a régua tem um teste
que os nomeia. É a decisão dela nos conflitos C-3 e C-6: um fato, um sinal.

### T-07 · O décimo alvo, `marcado` (decisão dela: `5-a`)

`escrever()` ganha o ramo `if(alvo === 'marcado')` — o único que escreve
`el.checked` —, e o `LER_CAMPOS` ganha o par (`sim` / `""`, nunca
`true`/`false`). Idempotente como os outros nove; vazio e travessão desmarcam;
só a palavra `sim` acende.

### T-05 · A barra da janela (decisão dela: `1-a`)

`app/theme.py` ganha `sessao_e_cosmic`, `lado_dos_botoes_na_sessao`,
`barra_que_o_sistema_usa` e `adotar_a_barra_da_sessao`, chamada pela
`JanelaDaAba` ao lado de `adotar_o_tema_da_sessao`. **Nenhuma linha na
configuração dela** — a cura inteira vive em `Gtk.Settings`, memória do processo.

### O estado "em voo" do botão (`09` [03])

O ouvinte carimba o elemento clicado (`data-hef-voo`), põe a classe
`hef-em-voo` e — quando a página publicar `data-hef-em-voo="…"` — troca o
rótulo, guardando o `innerHTML` original. O piloto devolve o botão nos **três**
desfechos (aplicou, recusou, sem dono), pelo `finally`. A classe mora na
`FOLHA_DA_CASA`, que vale nas dez abas sem republicar desenho.

### EXTRA · A dívida que a ONDA0-F relatou NO MEU ARQUIVO — fechada

A frente da FOLHA construiu o botão cinza da D-03 e parou em:

> *"nenhum alvo do `hefesto_vivo.py` escreve atributo E classe no mesmo
> elemento, e o `aria-disabled` do botão cinza precisa disso"*

Cabia no meu escopo e está fechada. O alvo `classe` passa a vestir também um
atributo, quando o elemento pedir por `data-hef-atributo` — **o mesmo parâmetro
que o alvo `atributo` já usa, com a mesma guarda**. A classe é a fonte; o
atributo é derivado dela na língua do ARIA (`true`/`false`, **nunca a
ausência**: um `aria-disabled` ausente e um `aria-disabled="false"` não são a
mesma coisa para um leitor de tela).

**As duas saídas que NÃO tomei, e a razão:** um alvo composto
(`classe:aria-disabled`) quebraria tudo que lê o alvo por igualdade — o
`LER_CAMPOS`, o `regua_do_mockup._campo`, os `campo.alvo == "…"`; e um segundo
`data-campo` no mesmo botão seria pior, porque dois endereços para o mesmo fato
podem divergir na tela. Régua nova:
`tests/unit/test_o_alvo_classe_tambem_veste_o_aria.py`.

**Para a FOLHA, em uma linha:** ponha `data-hef-atributo="aria-disabled"` ao
lado do `data-hef-alvo="classe"` no botão cinza — nada mais.

---

## Como provei (com a mordida colada)

### T-01 — a mordida é matar o processo web, por PID conferido

**Nunca por padrão de nome:** em 04/09 um `pkill -f 'cosmic-comp'` casou com o
compositor dela, a tela caiu e a sessão morreu. Aqui a régua é o **parentesco**
(`ps -eo pid,ppid,cmd`), e cada PID é conferido com `ps -o pid=,ppid=,cmd= -p`
antes do sinal.

**SEM A CURA** (`--sem-cura` arranca a recarga da janela):

```
[página morreu] o processo web do WebKit terminou (crashed)
[página morreu] 0 recargas seguidas sem a página parar de pé — não recarrego de novo.
[00:20] [mordida] matando o processo web...
[mordida] conferido antes do sinal: 126980  126958 …/webkit2gtk-4.1/WebKitWebProcess 4 45
[00:24] A PÁGINA NÃO RESPONDEU — WebKitJavascriptError: Unsupported result type (601)
[00:36] A PÁGINA NÃO RESPONDEU — WebKitJavascriptError: Unsupported result type (601)
[00:48] A PÁGINA NÃO RESPONDEU — WebKitJavascriptError: Unsupported result type (601)
[01:00] A PÁGINA NÃO RESPONDEU — WebKitJavascriptError: Unsupported result type (601)
VEREDITO: VERMELHO — a página não respondeu em 00:24, 00:36, 00:48, 01:00
```

**COM A CURA**, mesma mordida, mesmo relógio:

```
[página morreu] o processo web do WebKit terminou (crashed)
[página morreu] crashed — a pintura pausou até a página voltar
[página morreu] recarregando (1/3)
[00:24] 03-gatilhos.html  fundo=rgb(17, 18, 26)  padding=16px  style=1 letras=64910 folhas=2 campos=30 hef=True
[00:36] 03-gatilhos.html  fundo=rgb(17, 18, 26)  padding=16px  style=1 letras=64910 folhas=2 campos=30 hef=True
[00:48] 03-gatilhos.html  fundo=rgb(17, 18, 26)  padding=16px  style=1 letras=64910 folhas=2 campos=30 hef=True
[01:00] 03-gatilhos.html  fundo=rgb(17, 18, 26)  padding=16px  style=1 letras=64910 folhas=2 campos=30 hef=True
mortes da página    : 1 ['crashed']
recargas            : 1
VEREDITO: VERDE — 6 leituras, a folha viva em todas
```

E no `stderr` do produto: **76 linhas** de `[03-gatilhos.html] a pintura falhou`
antes da cura, **zero** depois.

### S-01 e o estado em voo — `tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py`

Piloto real, WebKit real, clique no botão do produto (`data-mudo="microfone"`)
com um dublê que faz o `mic.set` **passar** — o caminho do sucesso, que nunca
tinha sido medido.

**Cura arrancada 1** — `_deu_certo_dizendo` trocado por `_deu_certo` no `_gesto`:

```
FAILED test_a_frase_de_sucesso_chega_ao_dom
FAILED test_a_frase_pousa_no_cartao_de_quem_foi_clicado
FAILED test_o_aviso_sobrevive_aos_tiques
FAILED test_o_sucesso_e_verde_e_a_recusa_e_laranja
FAILED test_a_frase_do_dono_vence
5 failed, 9 passed in 17.72s

AssertionError: o piloto ignorou a frase que o gesto devolveu e disse a dele: [].
```

**Cura arrancada 2** — `const voo = em_voo(alvo)` trocado por `const voo = ''`:

```
FAILED test_o_botao_diz_que_esta_trabalhando
FAILED test_o_rotulo_publicado_entra_no_lugar
2 failed, 12 passed in 17.72s

AssertionError: o rótulo em voo não entrou: '🎙'
```

**Curas devolvidas:** `14 passed in 17.73s`.

### T-07 — `tests/unit/test_o_pintor_marca_o_checkbox.py`

**Cura arrancada 1** — o ramo `marcado` do `escrever()`:

```
FAILED test_o_checkbox_acende
FAILED test_o_radio_tambem
FAILED test_a_leitura_fala_a_lingua_da_escrita
3 failed, 5 passed in 1.06s

AssertionError: {'saida-aberta': '', 'rota-fone': '', 'ja-aceso': 'sim'}
assert '' == 'sim'
```

**Cura arrancada 2** — `el.checked ? 'sim' : ''` trocado por `el.checked` no
`LER_CAMPOS`:

```
FAILED test_o_radio_tambem
FAILED test_o_travessao_apaga
FAILED test_a_leitura_fala_a_lingua_da_escrita
FAILED test_o_que_ja_nascia_aceso_continua_aceso
4 failed, 4 passed in 1.07s
```

**Curas devolvidas:** `8 passed in 1.05s`.

### T-05 — `tests/unit/test_a_barra_da_janela_segue_o_sistema.py`

**Curas arrancadas** — o `set_property("gtk-decoration-layout", …)` do
`theme.py` **e** a chamada `tema.adotar_a_barra_da_sessao()` da `JanelaDaAba`:

```
FAILED test_a_barra_da_janela_fica_do_lado_do_sistema
FAILED test_a_janela_do_produto_ja_nasce_com_a_barra_certa
2 failed, 4 passed in 0.37s

AssertionError: a `JanelaDaAba` não chama a cura da barra.
```

**Curas devolvidas:** `6 passed in 0.31s`.

E em voo, no log do produto ao abrir a janela:

```
[info] barra_da_sessao_adotada  layout=:minimize,maximize,close  sessao_dizia=close,maximize,minimize:
```

### EXTRA · A dívida da ONDA0-F — `tests/unit/test_o_alvo_classe_tambem_veste_o_aria.py`

**Cura arrancada** — o bloco `if(junto && atributo_escrevivel(junto))` do ramo
`classe`:

```
FAILED test_a_classe_e_o_aria_andam_juntos
FAILED test_apagar_diz_false_e_nao_some
2 failed, 4 passed in 1.07s

AssertionError: o botão voltou a funcionar e o `aria-disabled` virou None
```

**Cura devolvida:** `6 passed in 1.04s`.

### A prova de tela

Fotos `--oculta` em `/tmp/onda0-p/` (a janela nasce numa `Gtk.OffscreenWindow`;
**nada apareceu na tela dela em nenhum momento desta frente**), com o clique no
botão do produto e a leitura do DOM ao lado:

| foto | o que ela mostra | medido no DOM |
| --- | --- | --- |
| `01-antes.png` | a aba 02 em repouso | `recados: []`, botão `🎙`, opacidade 1 |
| `02-em-voo.png` | o botão **durante** um gesto de 2,5 s | texto `Calando…`, `em_voo: true`, opacidade `0.6`, cursor `progress` |
| `03-sucesso.png` | o recibo no cartão do p1 | `"Pronto."`, tom `sucesso`, `rgb(80, 250, 123)` |
| `04-recusa.png` | a recusa no mesmo cartão | tom `recusa`, `rgb(255, 184, 108)` |

O clique é `b.click()` no `[data-controle="p1"] [data-mudo="microfone"]` — o
botão do produto, com o atributo que a página publicada traz. **Clicar por
coordenada é a armadilha que esta casa já pagou duas vezes.**

---

## O que medi e derrubou uma suposição

### 1. A premissa da `BARRA-DA-JANELA-01` estava errada, e seguir a sprint teria deixado a queixa dela ABERTA

A sprint mandava *"ler `org.gnome.desktop.wm.preferences button-layout`; se a
sessão não disser, cair em `:minimize,maximize,close`"* — supondo que só o
`settings.ini` dela carregasse o valor errado. Medido na máquina dela:

```
$ cat ~/.config/gtk-3.0/settings.ini
gtk-decoration-layout=close,maximize,minimize:
$ gsettings get org.gnome.desktop.wm.preferences button-layout
'close,maximize,minimize:'
```

**As duas fontes dizem ESQUERDA**, que é exatamente a queixa. Uma cura que
"pergunta à sessão" devolveria a resposta que produziu o defeito, passaria no
teste com um dublê mudo e deixaria a janela dela igual — o verde sobre defeito
vivo que esta casa pagou quatro vezes numa madrugada.

Quem é o dono da resposta certa é o **compositor**, e ele não tem chave:
`~/.config/cosmic/` inteiro não guarda uma linha sobre lado de botão. Por isso o
produto usa a constante do COSMIC, e **só sob COSMIC**.

### 2. A H1 da `A-TELA-NUA-01` explica um defeito VIVO — mas não a NUDEZ da foto

Matei o `WebKitWebProcess` filho por PID conferido e medi o que a tela vira:

| depois da morte do processo web | o que acontece |
| --- | --- |
| a `WebView` | fica **congelada** no último quadro — não fica nua |
| todo `evaluate_javascript` | `Unsupported result type (601)`, **para sempre** |
| o piloto | imprime "a pintura falhou" a cada 100 ms e **não sabe de nada** |
| `web-process-terminated` | **dispara**, com `crashed` — o sinal existia o tempo todo |

**Então o crash produz CONGELAMENTO, não nudez.** A cura vale — e vale muito,
porque o estado "congelada e mandando JS para o vazio para sempre" é um defeito
vivo que nenhuma régua desta casa via — mas **eu não reproduzi a foto dela**.

### 3. H3 e H4 caíram, e ficam medidas para ninguém as remedir

* **H3 (a folha do Google travando a renderização):** matei o
  `WebKitNetworkProcess` e recarreguei. A página volta **inteira** —
  `rgb(17, 18, 26)`, `padding 16px`, 2 folhas. A `<style>` é inline; o `<link>`
  só traz fonte.
* **H4 (a página reescrita no disco no meio da leitura):** na árvore dela,
  `src/…/paginas/03-gatilhos.html` tem mtime **04/09 02:54:49** — nove horas
  antes da foto das 12h15. Nenhuma das dez páginas publicadas foi tocada naquele
  dia depois das 03:43.
* **H2 (um `escrever()` de alvo `html` pousando sobre o `<style>`):** os quatro
  alvos `html` da 03 são `chip-do-controle`, dentro da `.cabeca`; o `.fita` casa
  **um** elemento (o `fita-linha` não tem a classe `fita`); e os seletores de
  `blocos` que os pacotes emitem são `#vib-estado`, `.mm-faces`,
  `SECAO_DA_TROCA`, `SELETOR_DA_GRADE` e `SELETOR_DA_FITA` — **nenhum alcança o
  `<head>`**. Não achei o caminho, e não o declaro fechado.

### 4. Não dá para medir o lado dos botões pelo pixel sem pôr uma janela na tela dela

| como montei a `Gtk.HeaderBar` com `set_show_close_button(True)` | botões que nascem |
| --- | --- |
| `set_titlebar(barra)` numa `Gtk.OffscreenWindow` | **zero** — e a barra aloca **1 px** |
| `pack_start` num `Gtk.Box` | **zero** — a barra aloca 600 px |

Os botões de decoração só existem quando a barra É a titlebar de uma janela
decorada, e offscreen não há gerenciador de janelas. Por isso a régua é
`gtk-decoration-layout`, que é o canal por onde o GTK decide — medir ali é medir
o que o produto faz.

### 5. Duas réguas minhas nasceram falsas, e as duas mediam o lugar errado

* `test_nada_e_escrito_na_configuracao_dela` procurava `"settings.ini"` no
  **texto** do `theme.py` e reprovava a própria MEDIÇÃO: o docstring que explica
  *por que* a cura não lê aquele arquivo cita o nome dele. Reescrita por **AST**,
  cobrando código e não prosa — é a família que o `validar-palavra-de-tela` já
  nomeia: *régua que casa um token em qualquer lugar do texto, em vez do campo
  que o significa*.
* `test_sem_data_hef_atributo_nada_muda` lia o botão **no fim** do roteiro, com
  os três já apagados, e acusava o alvo `classe` de não acender. Mediu o
  **instante errado**: o alarme era do instrumento. A leitura passou para o
  momento aceso.

### 6. O `cursor:progress` do botão em voo estava MORTO, e a foto mostrou

Medido na foto `--oculta` da aba 02: `cursor` saía **`pointer`**, não
`progress`. A causa é do cascade — uma folha de **usuário** perde para o autor em
declaração normal, e as dez páginas declaram `cursor:pointer` nos botões. Só o
`!important` do usuário vence, que é o que o `.nota{display:none !important}`
da mesma folha já carrega desde sempre. Curado; a foto seguinte devolve
`progress`.

### 7. O rótulo em voo NÃO CABE em botão de ícone

Publiquei `data-hef-em-voo="Calando…"` num 🎙 de 20 px para medir, e o texto
**transborda**. Não é defeito do mecanismo: **quem publica o atributo é quem
responde por caber**, e num botão de ícone a resposta certa é não publicar e
deixar o sinal da classe falar. A decisão dela (`09` [03]) é sobre o
"Atualizar", que tem 184 px de coluna. Está escrito no comentário da
`FOLHA_DA_CASA`.

### 8. A minha própria régua era frágil em lote — e o defeito era a bomba conhecida

`test_o_recado_de_sucesso_pousa_no_cartao` fecha em 17,7 s e passa nos catorze
testes **sozinha**; rodada no lote com 24 vizinhos, morria com *"o roteiro não
chegou ao fim"*, faltando **só o último passo**. É a bomba que esta casa já
documentou: um `Gtk.main_quit` pendente de outro teste de GUI do mesmo processo
cai dentro do `Gtk.main()` e o encerra no meio. Um `timeout_add` **não** morre
com o `main_quit`, então o laço passou a **reentrar** até o roteiro acabar, com
o relógio de parede como teto real.

---

## O que NÃO verifiquei

* **A foto dela não foi reproduzida.** Não sei o que deixou a `03-gatilhos` sem
  estilo em 04/09 às 12h15. As quatro hipóteses da sprint: H3 e H4 **caídas com
  medição**, H2 sem caminho encontrado, H1 explica um defeito vivo mas produz
  congelamento, não nudez.
* **A janela na TELA dela** — nunca abri uma. Tudo foi `Gtk.OffscreenWindow`, e
  por isso a barra de título com os três botões **não foi vista por mim**: o que
  provei é a propriedade que os posiciona.
* **A suíte inteira.** Rodei os **98** arquivos de teste que citam
  `hefesto_vivo`, `ponte_da_tela` ou `app.theme`, em quatro lotes — **1.421
  testes verdes** (302 · 340 · 435+4 xfail · 344). A suíte completa é de quem
  coordena.
* **O aviso do BERÇO-DE-TMP-01** apareceu nos lotes (`hefesto-berco-…`,
  `hefesto-lar-de-sessao-…` em `/tmp`). Ele diz que **não é portão**, e é
  anterior a esta frente — não investiguei.
* **O alvo `marcado` numa página publicada.** Nenhuma das dez publica
  `data-hef-alvo="marcado"` hoje; provei o alvo numa página de ensaio.
* **O `--prova-de-mockup` com o alvo novo.** `regua_do_mockup._campo` não conhece
  `marcado` (ver abaixo).

---

## O que sobrou para o próximo (arquivo alheio incluído)

### Arquivo alheio — EDITADO, e digo exatamente o quê

**Sete linhas de comentário, em quatro arquivos, e nada mais**: os números de
citação que **eu** envelheci ao acrescentar linhas ao `hefesto_vivo.py`. O
portão `test_portao_o_par_com_metade_ligada::…_citacao_de_linha…` **passava no
HEAD limpo** (medido: restaurei os três arquivos meus, rodei, `5 passed`) e
reprovava com o meu trabalho — logo o vermelho era meu, e o conserto que a
própria régua manda é *"meça com `grep -n` e reescreva o número"*.

| arquivo | citação | de → para |
| --- | --- | --- |
| `pacotes/a03_gatilhos.py:1292` | `_fita` | `860` → `1054` |
| `pacotes/a06_navegacao.py:67` e `:102` | `_recusou_dizendo` | `1549` → `1798` |
| `pacotes/a10_perfis.py:1019` | `_recusou_dizendo` | `1549` → `1798` |
| `pacotes/a06_navegacao.py:2229` | o rótulo *"disse aplicado e nada mudou"* | `2255` → `2707` |
| `pacotes/a06_navegacao.py:297` | *"trocar de aba já recarrega"* | `1818` → `1966` |
| `pacotes/a09_sistema.py:1534` | `[gesto sem dono]` | `1018` → `1690` |

**As duas últimas já estavam ERRADAS antes de mim** — apontavam para linhas sem
relação com o que a frase diz (`1818` era um comentário sobre lugares vazios;
`1018` era o `LER_CAMPOS`). A régua só reprova quando a linha citada fica
**vazia**, e foi o meu deslocamento que as tornou vazias. Apontei-as para o
lugar certo em vez de só deslocá-las.

**Para quem integra:** se uma frente da Onda 2 reescrever qualquer desses
quatro arquivos, o conflito é de UMA linha de comentário e a resolução é
sempre "ficar com o número maior". Nenhum comportamento mudou.

### Arquivo alheio — RELATADO, não editado (R1 da casa)

1. **`interface/regua_do_mockup.py` — o ramo do alvo `marcado`.** O `_Leitor` e
   o comparador decidem por `campo.alvo`, e `marcado` cai no ramo de texto. Hoje
   isso não acusa nada, porque **nenhuma página publica o alvo**. No dia em que
   a aba 02 publicar, a régua do mockup passará a comparar `sim` com o texto do
   arquivo e acusará pintura certa. É uma linha em cada lado, e é do dono
   daquele arquivo. **O mesmo vale para o atributo que o alvo `classe` passou a
   vestir** — ele é derivado, e a régua não deve contá-lo como segundo campo.

2. **`interface/aba02.py` + `interface/pacotes/a02_controles.py` — a metade do
   endereço.** O alvo existe e escreve; quem põe `data-hef-alvo="marcado"` no
   checkbox do acordeão do alto-falante é a frente da aba 02, na Onda 2. O
   pacote emite o campo com `'sim'` / `''`.

3. **`gui/ponte_da_tela.AS_QUATRO_ARMADILHAS` — a QUINTA armadilha.** Ela existe
   e está medida (a `WebView` não avisa e não volta quando o processo web
   morre), mas a constante tem régua que exige exatamente quatro
   (`test_ponte_da_tela_a_biblioteca_das_dez_abas.py:249`). Quem quiser
   promovê-la a quinta linha mexe nos dois — a medição inteira está no docstring
   de `JanelaDaAba._morreu_a_pagina`.

### Para as dez frentes de aba (Onda 2)

4. **O canal de sucesso está de pé e espera as frases.** Cada gesto que quiser
   dizer algo além de `"Pronto."` devolve `{"recado": "…"}`. As cinco linhas do
   CSV (abas 02, 03, 05, 06 e 09) fecham escrevendo a frase, não construindo
   canal — e **não se constrói um segundo canal**: os conflitos C-3 (o campo que
   pisca) e C-6 (a faixa embaixo da grade) foram recusados por ela.

5. **O rótulo em voo é `data-hef-em-voo="…"` no botão.** A `09` publica
   `"Reaplicando…"`, junto com o rótulo novo do botão (`"Reaplicar ajustes"`,
   decisão `09` [01]). Sem o atributo o botão ganha só a classe `hef-em-voo` —
   sinal sem palavra inventada. **Não publique em botão de ícone:** medido, o
   texto transborda um 🎙 de 20 px.

6. **O botão cinza da S-03 (frente da FOLHA) já tem o que faltava.** Ponha
   `data-hef-atributo="aria-disabled"` ao lado do `data-hef-alvo="classe"` no
   botão, e o `aria` acompanha a classe sozinho. Nenhum segundo `data-campo`.

### Para quem coordena

6. **A frase `FRASE_DA_PAGINA_QUE_MORREU` é PROVISÓRIA** e está marcada como tal
   no código: *"A tela parou de responder e foi recarregada."* Ela precisava
   existir para o recado existir (a sprint manda dizer no cartão), mas texto de
   tela é decisão dela.

7. **O ensaio de 20 minutos ainda não foi rodado inteiro** — rodei-o em 1,2 e
   1,5 minuto para provar as duas mordidas. Os 20 minutos são para a leva
   parada: `scripts/ensaios/a_tela_nao_fica_nua.py --passear`.

8. **O portão rodava com o PYTHON DE OUTRA ÁRVORE** — alerta do coordenador,
   e o conserto do `portoes.sh` é dele. Rodei **sempre** com o cabeçalho
   conferido:

   ```
   portões — árvore /mnt/Apate/Desenvolvimento/hefesto-voo/ONDA0-P-O-PILOTO-01-P
            python  /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
            PYTHONPATH /mnt/Apate/Desenvolvimento/hefesto-voo/ONDA0-P-O-PILOTO-01-P/src
   ```

   Não houve execução com cabeçalho errado a retratar: a primeira e única
   passada completa já foi com `HEFESTO_PY` e `PATH` apontados.
