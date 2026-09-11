# CADEADO-E-O-FATO-01 — «Trava o perfil ativo», e a perda que não era

**Árvore:** `/mnt/Apate/Desenvolvimento/hefesto-voo/CADEADO-E-O-FATO-01-opus`
· branch `voo/CADEADO-E-O-FATO-01-opus` · nasceu de `onda/0911b` (`908864de`,
conferido contra `git rev-parse --short onda/0911b`).

**Bancada:** não pedida (`bancada: false`). Nada parou o daemon, nada escreveu
no aparelho, nada chamou `systemctl`. Um DualSense estava na mesa dela pelo
rádio durante a foto (`P1 · Starlight Blue`) e a leitura foi só isso: leitura.

---

## O que mudou

### §1 — o rótulo da caixa, e a palavra é dela

A caixa no canto do bloco **Modo** da aba Jogar passou de
`Não trocar de perfil sozinho ao abrir um jogo` para **«Trava o perfil ativo»**.
Três palavras, como ela escreveu — sem «(opcional)», sem reticências, sem
enfeite.

| onde | o quê |
| --- | --- |
| `interface/pacotes/a01_jogar.py` | `CADEADO_ROTULO` — o dono na tela nova, com a razão da troca escrita acima dele |
| `app/actions/home_actions.py` | o `label=` do `Gtk.CheckButton` — o dono ANTIGO, que a régua lê |
| `app/actions/home_actions.py` | as duas citações em comentário (`TEXTO_DETECTOR_CEGO` e `texto_do_cadeado_cego`) |
| `app/actions/relancar.py` | a citação em comentário do `MUDA_NA_HORA` |
| `interface/aba01.py` | a legenda da página, que agora diz de onde veio o rótulo e para onde foi o mecanismo |
| `interface/pacotes/a01_jogar.py` | a docstring do gesto `cadeado`, que abria citando a frase velha (mesmo arquivo, mesma posse) |
| `docs/data/paridade-gtk-html.csv` linha 30 | dizia *"rótulo e dica copiados palavra por palavra do `Gtk.CheckButton`"* — hoje só a DICA é; o rótulo é palavra dela |

**A `CADEADO_DICA` não foi tocada**, como a sprint mandou: ela é quem explica o
mecanismo agora, e nenhuma palavra dela ficou redundante com o rótulo curto.

**Gerado e PUBLICADO:** `python3 src/hefesto_dualsense4unix/interface/aba01.py`
(`01-jogar: OK, 46 divs`) e `check_o_desenho_aprovado.py --publicar 01`
(`1 página · 1 mudou de fato`). O `git diff` de `mockup/01-jogar.html` e de
`paginas/01-jogar.html` é de **duas linhas cada**: o `<span>` do cadeado e a
linha da legenda. Sem publicar, a tela dela ficaria com a frase velha.

**Nenhuma régua precisou ser editada** — e isso é o desenho funcionando: as
duas LEEM o dono (`CADEADO_ROTULO`) em vez de digitar a frase.

### §2 — o fato errado, substituído em três lugares

A leva de 11/09 declarou uma **«perda de capacidade»** ao tirar o quadro «Modo»
do editor de Perfis. **Ela derrubou o fato no mesmo dia**, e o código concorda
com ela: `a01_jogar._gravar_o_modo_do_chip` → `_gravar_o_modo` →
`interface/pacotes/perfil.gravar_o_modo_no_ativo` grava a seção `mode` do perfil
ativo **no clique do chip**, sem passar pelo «Salvar Perfil». O quadro em Perfis
era duplicata; a retirada desfez a cópia, não a capacidade.

| onde | o que passou a dizer |
| --- | --- |
| docstring de `gravar_o_modo_no_ativo` | «O ALCANCE DESTA FUNÇÃO — e ele NÃO é uma perda de capacidade», com a citação dela, a cadeia de chamada e os dois limites como **consequência de decisão dela** |
| `docs/data/paridade-gtk-html.csv:384` | veredito `FALTA_NO_HTML` → **`DIFERENTE`**; `sinal` `_mode_section_from_editor`/`AUSENTE` → **`gravar_o_modo_no_ativo`/`PRESENTE`** em `interface/pacotes/perfil.py`; `html_faz` e `porque` reescritos |
| `PERFIS-A-TELA-01`, §3.1 | de «A PERDA, MEDIDA E DECLARADA» (tabela com **«ninguém»** nas duas primeiras linhas) para «A «PERDA» QUE NÃO ERA», com a correção datada |
| `2026-09-03-O-TERCEIRO-NUMERO…` | tabela **recontada do CSV** + nota de verificação de 11/09 explicando a promoção |

**Os números da tabela publicada, recontados e não escolhidos:**

| linha | antes | depois |
| --- | --- | --- |
| `10-perfis` | 14 IGUAL · **19** DIFER · **8** FALTA | 14 · **20** · **7** |
| `TODAS` | 143 IGUAL · **159** DIFER · **31** FALTA | 143 · **160** · **30** |

A **paridade não se mexe** (36%): nenhuma linha virou `IGUAL`.

**Por que o sinal teve de trocar junto:** `_mode_section_from_editor` é símbolo
da GTK e só serve para cobrar AUSÊNCIA (`usa`, que não conta comentário). Uma
linha que AFIRMA paridade tem de vigiar o que FAZ do lado HTML. O sinal novo é a
`def` de `gravar_o_modo_no_ativo` em `interface/pacotes/perfil.py` — se alguém a
apagar, o portão acusa `sinal-sumiu`.

**Endereços citados por SÍMBOLO, não por linha.** A inserção do comentário do
`CADEADO_ROTULO` empurrou o `a01_jogar.py` em 5 linhas, e os números que a
sprint e o §3.1 traziam (`:1833`, `:2134`, `:2266`, `:2286`, `:2390`) andaram
junto. Em vez de reapontá-los por aritmética — que é como esta casa já errou —
as citações novas vão por símbolo, e o §3.1 diz isso com todas as letras.

---

## Qual mordida prova

**Quatro mordidas, todas com a saída copiada.**

### 1. O par rótulo↔GTK, quebrando o lado da GTK

`label="Trava o perfil ativo"` → `label="Trava o perfil ativo."` (um ponto):

```
FAILED tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py::test_a_palavra_do_cadeado_e_a_que_ela_ja_leu
E  AssertionError: o rótulo 'Trava o perfil ativo' não é o do `Gtk.CheckButton`
   da janela antiga — texto de tela novo é decisão DELA
1 failed, 37 passed in 13.75s
```

### 2. O mesmo par, quebrando o lado do dono (a régua da PÁGINA)

`CADEADO_ROTULO = "Trava o perfil ativo (opcional)"`, sem republicar:

```
FAILED tests/unit/test_o_cadeado_mora_no_canto_do_bloco.py::test_a_palavra_e_a_da_janela_antiga
E  AssertionError: o rótulo na tela é 'Trava o perfil ativo' e o dono diz
   'Trava o perfil ativo (opcional)'
1 failed, 8 passed in 3.76s
```

Devolvidas as duas: `38 passed in 13.67s`.

### 3. O veredito velho de volta na linha 384

`DIFERENTE`/`gravar_o_modo_no_ativo`/`PRESENTE` → `FALTA_NO_HTML`/
`_mode_section_from_editor`/`AUSENTE`:

```
FALHA: 2 achado(s) em docs/data/paridade-gtk-html.csv.
  numero-publicado: …, linha '10-perfis':  publicado: (50,14,20,7,9,0,28)
                                           no CSV:    (50,14,19,8,9,0,28)
  numero-publicado: …, linha 'TODAS':      publicado: (396,143,160,30,59,4,36)
                                           no CSV:    (396,143,159,31,59,4,36)
```

### 4. A mais dura: o veredito velho COM o sinal novo

`FALTA_NO_HTML` + `gravar_o_modo_no_ativo`/`AUSENTE` — a linha afirmando que o
lado HTML não faz o que ele faz:

```
divida-fechada: paridade-gtk-html.csv:384  [10-perfis] A seção "Modo" do perfil
    o sinal 'gravar_o_modo_no_ativo' APARECEU em …/interface/aba10.py.
    O CSV diz FALTA_NO_HTML e o lado HTML passou a ter o símbolo.
```

Devolvido: `OK: 396 features conferidas — 143 IGUAL · 160 DIFERENTE · 30
FALTA_NO_HTML · 59 SO_NO_HTML · 4 NAO_DA_PARA_SABER (36% de paridade)`, `rc=0`.

### A tela, medida e clicada — as três coisas, e nenhuma na tela dela

**A FOTO, nos DOIS motores.** No `WebKit2.WebView` dentro de uma
`Gtk.OffscreenWindow` — que é o motor que ela usa —
`interface/jogar_vivo.py --oculta --segundos 4 --foto …`: a caixa aparece
escrita **«Trava o perfil ativo»** no canto do bloco Modo, com `28 valores
escritos por pintura` e `0 gestos`. E no Chrome headless, o par antes/depois da
mesma página publicada.

**O CLIQUE.** No rótulo (não na caixinha — clicar na caixinha passaria mesmo com
a associação `<label>`/`<input>` quebrada): `checked` **false → true**. A caixa
encurtou e continua sendo área de clique inteira.

**A MEDIDA EM PIXELS, que é o que a §4 pediu:**

| | antes | depois |
| --- | ---: | ---: |
| largura do `label.cadeado` | 254,1 px | **116,0 px** |
| altura | 17 px | 17 px |
| largura da linha `.quadro-topo` | 1528 px | 1528 px |
| altura da linha | 28 px | 28 px |
| folga livre na linha | 1219,9 px | 1358,0 px |

**A frase curta NÃO fica solta, e a razão é medida:** a caixa é ancorada à
**direita** da linha do título e a linha nunca foi preenchida — já sobravam
1219,9 px dos 1528 px antes da troca. Encurtar 138,1 px move a caixa para a
direita e não abre buraco nenhum: a linha não quebrou, a altura não mudou, e
`Modo` + `?` continuam colados à esquerda. **Não reescrevi a frase para
preencher espaço**, como a sprint proibiu.

---

## A ARMADILHA DESTE TRABALHO, e ela é de aritmética de linha

**Encurtar uma frase encurtou um ARQUIVO, e duas âncoras de linha caíram no
vazio.** O `label=` do `Gtk.CheckButton` vinha quebrado em três linhas porque a
frase antiga era longa; a frase nova cabe numa só, e eu a colapsei. Resultado
medido pelo portão `citacoes-no-codigo` (camada `completo`, que o `--rapido`
**não** roda):

```
AssertionError: 2 endereço(s) de linha em `src/` apontam para outro lugar hoje:
  - app/actions/footer_actions.py:516 cita a linha 2654, que está EM BRANCO
  - interface/pacotes/a01_jogar.py:1566 cita a linha 2648, que está EM BRANCO
```

**A cura não foi reapontar os dois números — foi não mover o arquivo.** O
literal voltou às três linhas, e o `home_actions.py` voltou a ter exatamente
3586 linhas, como em `HEAD`. As duas razões:

1. **`app/actions/footer_actions.py` não é da minha posse.** Reapontá-lo seria
   editar arquivo alheio para consertar estrago meu — quando o estrago tem cura
   na minha própria posse.
2. **Reapontar por aritmética é como esta casa já errou.** O número certo se
   mede; mas aqui não havia número a medir: bastava o arquivo não encolher.

**O aviso ficou onde quem vai trocar a palavra lê**: no comentário do
`CADEADO_ROTULO`, que é o dono, e que manda trocar o `label=` junto e manter a
quebra de três linhas.

**A régua que pegou isto é `completo`, não `rapido`.** Quem fechar uma leva só
com `--rapido` não vê este defeito — e a frase de tela mudada é exatamente o
tipo de mudança que parece não precisar do portão inteiro.

---

## O que NÃO verifiquei

1. **Não cliquei o cadeado na ponte WebKit viva.** O gesto `cadeado` está em
   `hefesto_vivo.PERIGOSOS` (derivado do `grava="autoswitch_lock_set"`) porque
   clicá-lo **grava preferência dela no disco**. O clique que provei é o do
   motor, no Chrome headless, sobre a página publicada — que é o que a régua
   `test_o_cadeado_responde_ao_clique_no_rotulo` também mede. Quem provar o
   caminho até o daemon tem de reservar a bancada.
2. **Não fotografei o ANTES no WebKit.** O par antes/depois é do Chrome headless
   (a página de `HEAD` contra a de agora); o DEPOIS existe nos dois motores.
3. **Não medi na vista dela** (`--vista dela`). As medidas acima são de uma
   janela de 1600×1000; a proporção da folga é o que decide, e ela é de 80% da
   linha nos dois casos.
4. **Não rodei a suíte inteira** — é de quem coordena, e roda no fim. Rodei os
   dois arquivos de régua do escopo e os portões.

---

## O que sobrou para o próximo

1. **`src/hefesto_dualsense4unix/interface/fim.html:65`** repete a legenda com a
   frase VELHA (*"A caixa «Não trocar de perfil sozinho» está no canto do bloco
   Modo"*). Ele **não está na minha posse** e é o rodapé ÚNICO das dez abas —
   medido: a legenda dele não alcança nenhuma das dez páginas publicadas (a 01
   carrega a própria, de `aba01.py`), então isto é citação velha e não tela
   errada. **Relatado, não editado.**
2. **O nome da feature na linha 30 do CSV** ainda cita a frase velha
   (*"O cadeado 'Não trocar de perfil sozinho ao abrir um jogo'"*). Ele é
   IDENTIFICADOR — três documentos fora da minha posse o citam
   (`2026-09-04-AS-232-LINHAS-ABERTAS`, `agentes/2026-09-04/ONDA2-01.md`,
   `sprints/2026-09-04-DECISOES-DELA-01-jogar.md`) — e renomeá-lo os deixaria
   apontando para uma linha que não existe. O que era FATO dentro da célula foi
   corrigido; o nome fica, e quem o renomear leva os três junto.
3. **`prosa_do_codigo.usa` conta STRING LITERAL como uso.** A mordida 4 acusou
   `divida-fechada` apontando `interface/aba10.py`, e lá o símbolo só aparece
   **num comentário e dentro de uma string de mensagem do `exigir(...)`** — não
   há chamada. A régua acertou o veredito pela razão errada. É o mesmo par de
   armadilhas que a `D-0609-O-SINAL-DA-PARIDADE-NAO-E-PROSA` nomeia, agora com o
   sinal trocado: `usa()` tira comentário e docstring, mas não tira literal de
   mensagem. **Não é meu** (`scripts/prosa_do_codigo.py` está fora da posse), e
   não muda nada nesta entrega — a linha 384 passa por `ocorre` sobre a `def`
   real, não por `usa`.
4. **A pergunta da §5 da `PERFIS-A-TELA-01` continua dela**, e agora com a
   premissa corrigida: não é «o que se perdeu», é «o alcance fica assim?» — só o
   perfil ATIVO recebe, e «Não mexer no modo» não é emitido pela Jogar.

---

## A tela dela

Nenhuma janela nasceu na sessão viva. O `jogar_vivo.py` rodou com `--oculta`
(`Gtk.OffscreenWindow`) e o Playwright em Chrome headless. Não chamei `peek`,
`goto` nem `install.sh`; não usei `sudo`; não toquei em `dev` nem em
`onda/0911b`. Saída de comando foi para arquivo, nunca crua no terminal dela.
