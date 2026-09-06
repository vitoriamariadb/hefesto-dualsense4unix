# NAVEGACAO-TECLAS-01 — a tecla que ela escreve chega ao perfil, e o ↺ é de UMA linha

**Agente C-NAVEGACAO-TECLAS-01 · árvore
`hefesto-voo/NAVEGACAO-TECLAS-01-C-NAVEGACAO-TECLAS-01` · branch
`voo/NAVEGACAO-TECLAS-01-C-NAVEGACAO-TECLAS-01` · base `onda/atual-0609`
(`3f6855a6`, a costura da ONDA B).**

Bancada: **não reservada** — nenhum caminho parou o daemon nem escreveu no
aparelho. O daemon ficou VIVO e só foi LIDO. Tela: **aberta, oculta**
(`Gtk.OffscreenWindow` + o Xvfb da guarda TELA-DELA), com `HOME` e os quatro
`XDG_*` desviados para um lar de mentira, com uma CÓPIA dos perfis dela — o
"Guardar" desta aba grava no perfil ativo.

---

## 1. O que fechou

### Passo 1 — a tela de escolher a tecla

**`Teclas do teclado`**, uma pop-up nova na aba Navegação, com **um campo de
texto por botão do `DOMINIO_DO_TECLADO`** (oito: `create`, `l1`, `l3`,
`options`, `r1` e as três regiões do touchpad). Ela digita `Ctrl + W`,
`Alt + Shift + Tab`, `F5`, **qualquer combinação** — não uma vigésima sétima
opção na lista de 26.

**Nenhuma tabela de nomes de tecla nasceu aqui.** São QUATRO donos, e cada um
responde o que só ele sabe:

| dono | o que ele responde |
| --- | --- |
| `input_actions.humanize_binding` | token cru → o que ela lê no campo |
| `input_actions.dehumanize_binding` | o que ela digita → token cru |
| `keyboard_mappings.parse_binding` | a FORMA (`KEY_*` ou `__…__`), e recusa |
| `uinput_keyboard.SUPPORTED_KEYS` | o que o device virtual **sabe emitir** |

**O quarto é o que faltava, e sem ele a tela aceitaria calada.**
`parse_binding` confere só o PREFIXO — `KEY_BANANA` passa por ele — e o device
(`uinput_keyboard._emit_sequence_press`) faz `getattr(u, key_name, None)` e
**pula em silêncio** o que não conhece. Uma tecla inventada seria gravada no
perfil, apareceria no campo e não digitaria nada.

**O domínio é de oito porque o produto é de oito**, e é perguntado
(`acoes_de_botao.DOMINIO_DO_TECLADO`, derivado dos quatro mapas). Oferecer
campo nos outros catorze gravaria no disco uma escolha que o `resolver()` não
lê — a ausência de dado, que se lê como *"a mudança não pegou"*.

### Passo 2 — "Voltar ao padrão" para de apagar o que ela escreveu

* **O ↺ de CADA linha** (`padrao-da-tecla`): devolve **aquela** linha ao de
  fábrica e não encosta nas outras. Era o caminho que não existia — até hoje,
  voltar uma linha custava o "Voltar ao padrão" da tela inteira, que zera
  `key_bindings` **e** `button_actions` de uma vez.
* **`guardar-teclas` preserva o que está fora do alcance dele.** O dicionário
  de partida é o do perfil; só as oito chaves do domínio são reescritas. O
  `Ctrl + W` que ela escreveu no Cross pela janela antiga sobrevive.
* **`atalhos_que_param_de_valer` parou de mentir por excesso.** A
  `ONDA3-MOTOR-01` fez o `resolver()` herdar `key_bindings`; o chamador desta
  aba continuava chamando `resolver(button_actions)` com um argumento só. Com o
  campo passado, a tira deixa de nomear como perdidos os oito do domínio (que
  agora sobrevivem) e nomeia **só os que ainda se perdem**: os de fora dele.
* **A confirmação do "Voltar ao padrão" da tela aponta a saída menor** —
  *"Para voltar uma linha só, use o ↺ dela em Teclas do teclado."*

### Passo 3 — o botão PS na lista

**Já estava feito pela `ONDA5-06-02`**, e é o que a sprint mandava conferir
antes de acrescentar. Conferido e guardado por régua: `ps` está em
`acoes.BOTOES`, a página tem **uma** linha `data-linha="ps"`, e o rótulo é o do
dono (`input_actions._BUTTON_LABELS["ps"] == "Botão PS"`). **Nada foi
acrescentado** — duas linhas `ps` era o defeito que a sprint previa.

### E duas curas que o Passo 1 OBRIGOU, porque ele as criaria

1. **A tabela das 22 linhas passou a mostrar as TRÊS camadas.**
   `_linhas_dos_botoes` montava o de fábrica com `button_actions` por cima e
   **nunca olhava `key_bindings`** — a mesma cegueira que o `resolver()` tinha,
   um degrau adiante. Um perfil em que ela escreveu `Super` no Options pela
   janela antiga fazia a tabela mostrar o de fábrica sobre um botão que digitava
   outra coisa. Agora quem responde é `acoes._tabela_efetiva`, pelo mesmo
   caminho que alimenta o device.
2. **A tira ganhou a sexta frase, e sem ela o Passo 1 criaria um defeito.** Uma
   combinação livre não tem `<option>` na lista de 26: `acoes.rotulo()` devolve
   o token cru, o `escrever()` do piloto recusa em silêncio o que não casa com
   nenhuma opção, e **o que fica na tela é o rótulo que o DESENHO cravou**. A
   linha passaria a AFIRMAR uma ação que o botão não faz. A tira agora nomeia
   essas linhas — *"A lista não sabe mostrar a tecla destas linhas: Share /
   Create digita Ctrl + W"* — e está na foto.

---

## 2. Qual mordida prova — DEZ, coladas

Cada uma arrancou a cura, viu reprovar e devolveu
(`<scratchpad>/C-NAVTECLAS-mordidas.txt`).

**1 · o Guardar não escreve a tecla** (`atalhos.pop(botao, None)` no lugar do laço):

```
E  AssertionError: o perfil guardou None para o create — ela escreveu 'Ctrl + W',
E  e o dono da tradução é `input_actions.dehumanize_binding`.
```

**2 · a capacidade do device não é perguntada** (`if False:` no bloco do
`SUPPORTED_KEYS`):

```
E  Failed: DID NOT RAISE RuntimeError
```

**3 · o ↺ da linha zera `key_bindings` inteiro** (`"key_bindings": None`):

```
E  AssertionError: o ↺ do l1 apagou o atalho do create: None — é a perda de
E  trabalho dela que este passo existe para fechar.
```

**4 · o Guardar das teclas monta o dicionário do zero** (`atalhos = {}`):

```
E  AssertionError: o Guardar das teclas apagou o cross, que ele nem oferece: None
```

**5 · a tira cala sobre a linha que a lista não mostra** (`if False:`):

```
E  AssertionError: a tira não nomeia o create, cuja tecla a lista não sabe
E  mostrar: '<div><b>Dois donos:</b> …'
```

**6 · a pintura não respeita a trava do campo de texto** (`_MEXENDO.clear()` no
fim de `_o_que_a_tabela_mostra`):

```
E  AssertionError: o tique escreveu 'F11' por cima do que ela está digitando
E  ('Ctrl + ') — o campo é reconstruído sob os dedos dela.
```

**7 · o chamador volta a não passar `key_bindings`** (o argumento a menos em
`atalhos_que_param_de_valer`):

```
E  AssertionError: o create está no domínio de `key_bindings` e a aba ainda o
E  nomeia como perdido: {'create': 'KEY_LEFTCTRL+KEY_W'}
```

**8 · o campo de texto ganha `data-linha`** (a colisão da `forma`):

```
E  AssertionError: voltou um `data-linha` à tela de teclas — ele faria o campo
E  de texto ocupar, na `forma`, a chave da lista de 'o que cada botão faz'.
```

**9 · uma linha do domínio sai da tela** (`and i != 'l1'`):

```
E  AssertionError: a tela oferece campo de tecla para [...]
E  Extra items in the right set: 'l1'
```

**10 · a marca sai de uma região do touchpad** (`+ MARCA_DO_TOUCHPAD` fora):

```
E  AssertionError: achei 2 célula(s) distinta(s) com a marca e as regiões do
E  touchpad são 3 — ou uma perdeu a marca, ou a marca foi parar numa linha que
E  não é região.
```

### A mordida que a MINHA régua não aguentou, e é a mais útil daqui

**A régua do tique passou de primeira, e a culpa era do produto.** O gesto
`tecla_escrita` aparava o texto (`.strip()`) antes de guardá-lo na trava. Com
`Ctrl + ` no campo — o espaço que ela acabou de digitar —, a trava guardava
`Ctrl +`, e a pintura do tique seguinte reescrevia o campo: **o cursor SALTA
para antes do espaço, no meio da combinação.** A régua só apanhou isso porque
compara byte a byte com o que foi digitado. Quem apara agora é a tradução, que
é onde aparar não mexe no que ela vê.

---

## 3. A prova de tela — no WebKit, com o daemon vivo

O instrumento é **`scripts/ensaios/a_tecla_livre_no_webkit.py`** (novo). Ele
roda no **WebKitGTK**, com o daemon vivo, e **não no Chrome de uma régua**.

**A página vem da BANCADA, e o desvio está declarado.** O piloto renderiza
`interface/paginas/`, e esta frente **não publica** (a página publicada está no
`nao_toca:` da sprint). O ensaio monta um `paginas/` de mentira num diretório
temporário — cópia de todas as páginas do produto, com a `06` trocada pela da
bancada — e aponta `onde.PUBLICADO` para lá. **O que corre no WebKit é, byte a
byte, o HTML que o `--publicar 06` entregaria.**

```
perfil ativo (segundo o daemon): 'Personalizado'
a linha dela: create · a vizinha: l1
ela escreve: 'Ctrl + W' (fora das 26 opções da lista)

  o perfil ANTES              {'key_bindings': None, 'button_actions': None}
  a tela nasce                8 campos `input:text`, 8 ↺, nenhum com `data-linha`
  ela digita em create        {'agora': 'Ctrl + W'}
  a tela 1,5 s depois         create: 'Ctrl + W'      ← 15 tiques, e não apagou
  clica no Guardar            {'ok': True}
  o perfil DEPOIS do Guardar  create: ['KEY_LEFTCTRL','KEY_W'] · l1: [...'KEY_F']
  clica no ↺ do l1            {'ok': True}
  o perfil depois do ↺        create: ['KEY_LEFTCTRL','KEY_W']  ← a dela FICOU
                              l1:     ['KEY_LEFTALT','KEY_LEFTSHIFT','KEY_TAB']
  ela digita uma inválida     KEY_KP0
  o recado na tela            "Share / Create: o teclado do Hefesto não sabe
                               digitar “KP0” …"
  o perfil depois da inválida create: ['KEY_LEFTCTRL','KEY_W']  ← intacto

  PASSOU  a combinação livre chegou ao perfil
  PASSOU  o ↺ da vizinha NÃO levou a dela
  PASSOU  o ↺ desfez a escrita da vizinha ('Ctrl + Shift + F' saiu)
  PASSOU  o ↺ devolveu a vizinha ao de fábrica
  PASSOU  a inválida foi recusada DIZENDO na tela
  PASSOU  a inválida não encostou no perfil
```

**NO TEMPO — as mutações continuam em ZERO:**

```
MUTAÇÕES DE DOM em 100 tiques (10.1 s) na 06-navegacao.html, com a mesa parada
TOTAL: 0 mutações · 0.0 por tique
```

A medição pré-C era zero e continua zero. A aba passou a pintar **34 valores**
por volta (eram 26): os oito campos novos.

**As fotos** (todas `--oculta`, no scratchpad da sessão):
`C-NAVTECLAS-v2-teclas.png` (a tela nova, com o `Ctrl + W` guardado na linha do
Share) · `C-NAVTECLAS-v2-definicoes.png` (a tela de Definições com o botão novo
no rodapé e a TIRA de três frases, a terceira sendo a nova) ·
`C-NAVTECLAS-recusa.png` (o recado laranja da recusa).

**UMA CORREÇÃO DE DESENHO, medida na foto:** o rodapé da tela de teclas nasceu
com TRÊS botões, e o rótulo *"Definições Controle e Mouse"* **quebrava em duas
linhas** dentro de uma caixa de altura fixa — o mesmo defeito que encurtou o
terceiro botão da fileira da aba em 28/08. O botão saiu; Cancelar fecha, e a
fileira da aba está a um clique.

---

## 4. O que NÃO verifiquei

* **Nada com o aparelho na mão.** O DualSense estava ligado e o daemon vivo,
  mas **não apertei nenhum botão**. O que está provado é o caminho até o disco
  (tela → gesto → Guardar → `Profile.key_bindings`) **e** que o motor entrega:
  `resolver(button_actions, key_bindings)` devolve a combinação na sacola do
  teclado, que é a chamada literal que `apply_button_actions` faz. Que o dedo
  no Share digite `Ctrl + W` no aplicativo em foco é o degrau que falta, e ele
  pede bancada.
* **A suíte inteira** — é de quem coordena. Rodei o escopo (§7).
* **A página PUBLICADA.** Ela continua a de ontem, sem a tela nova. Declarado em
  `mockup/DIVERGENCIAS.md`.
* **O `Estilo de Jogo` e o teclado na tela** — fora desta sprint.
* **A tela de Remapeamento** não ganhou campo de tecla, e não devia: lá o que se
  troca é um botão por outro, não uma tecla.

---

## 5. O texto pronto para `mockup/DIVERGENCIAS.md`

**Já aplicado** — a seção `## 06-navegacao.html` ganhou a entrada de 06/09 com
a tela nova, por que não publiquei, o que ela vê hoje e o que fecha.

**E o cabeçalho da seção teve de mudar, e é um achado de portão:** ele era
`## 06-navegacao.html — **JÁ PUBLICADA, e ela precisa saber disso**`, e o
`check_o_desenho_aprovado.declaradas()` casa `^##\s+(\S+\.html)\s*$` — **o
adorno fazia a seção NÃO contar como declaração.** O portão não acusou enquanto
a bancada e o publicado eram iguais, e acusou no primeiro dia em que deixaram de
ser. O aviso desceu para uma citação em bloco logo abaixo do título, onde
ninguém o perde.

---

## 6. O texto pronto para o CSV da paridade — **NÃO APLICADO**

**`docs/data/paridade-gtk-html.csv` está no `nao_toca:` desta sprint** (é da
`PARIDADE-REMEDIR-01`), e o despacho pede o texto, não a edição. **Por isso o
portão `paridade-gtk-html` fica VERMELHO nesta branch, com UM achado, e ele é o
achado CERTO:**

```
divida-fechada: paridade-gtk-html.csv:208  [06-navegacao] Editar QUAL TECLA…
  o sinal 'dehumanize_binding' APARECEU em src/…/interface/aba06.py.
  O CSV diz FALTA_NO_HTML e o lado HTML passou a ter o símbolo.
```

*"O caso BOM: alguém trabalhou e o dado ficou velho."* É o que o portão diz de
si mesmo, e é o que aconteceu.

**A linha 208, medida e reescrita** (os endereços foram lidos com `grep -n` no
HEAD desta branch, nunca copiados):

| campo | de | para |
| --- | --- | --- |
| `veredito` | `FALTA_NO_HTML` | **`DIFERENTE`** |
| `sinal` | `dehumanize_binding` | *(igual)* |
| `sinal_espera` | `AUSENTE` | **`PRESENTE`** |
| `sinal_escopo` | `LADO-HTML` | *(igual)* |
| `gtk_onde` | *(igual)* | *(igual)* |
| `html_onde` | `…a06_navegacao.py:1243 · …paginas/06-navegacao.html:3017` | **`src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py:1305 · src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py:2810 · src/hefesto_dualsense4unix/interface/aba06.py:2205`** |
| `gtk_faz` | *(igual)* | *(igual)* |

`html_faz` passa a ser:

> A tela **Teclas do teclado** (pop-up da aba Navegação) tem um campo de TEXTO
> por botão: ela digita `Alt + Tab`, `Ctrl + W`, `F5`, qualquer combinação, e o
> `dehumanize_binding` do MESMO dono da janela antiga traduz. `guardar-teclas`
> grava em `Profile.key_bindings`; cada linha tem um ↺ que devolve **só ela** ao
> de fábrica.

`porque` passa a ser:

> DIFERENTE, e a diferença é o ALCANCE, medida em 06/09/2026: a GTK oferece a
> coluna para os 17 botões de `CANONICAL_BUTTONS`; a tela nova oferece para os
> **oito** de `acoes_de_botao.DOMINIO_DO_TECLADO` — os únicos em que
> `key_bindings` manda depois que `button_actions` existe
> (`acoes_de_botao._tabela_efetiva`). Nos outros nove a escrita iria para o
> disco e o `resolver()` não a leria. A tela nova valida MAIS que a antiga: além
> de `parse_binding` (a forma), ela pergunta a `uinput_keyboard.SUPPORTED_KEYS`
> se o device sabe emitir a tecla — a antiga aceita `KEY_BANANA` e o device a
> pula em silêncio. **NÃO PUBLICADA**: a tela existe na bancada e o produto
> continua sem ela até o `--publicar 06` (`mockup/DIVERGENCIAS.md`).

**E a linha `:214` (o botão PS) pede uma nota de caducidade, não uma edição:**
ela diz `FALTA_NO_HTML` com a razão *"DECIDIDO em 04/09/2026 — Fica fora"*. A
segunda metade da célula já registra a decisão; **a 06-Q3 dela a REVERTEU** e a
`ONDA5-06-02` pôs o PS na lista. A linha está fechável como `IGUAL`, e é da
`PARIDADE-REMEDIR-01`.

---

## 7. O estado ao fechar

* **`bash scripts/portoes.sh`: 43 VERDES de 44.** O único vermelho é o
  `paridade-gtk-html`, com UM achado, e ele é o achado certo — ver a §6.
* **O escopo, VERDE: 1.246 passaram, 7 pulados, 4 xfail**, em **69 arquivos**
  de `tests/unit/` — todos os que citam `aba06`, `a06_navegacao`,
  `06-navegacao`, `acoes_de_botao`, `button_actions`, `key_bindings`,
  `uinput_keyboard` ou `input_actions`. **Zero vermelhos**, e a base tinha um
  (ver a §8).
* **A régua nova:** `tests/unit/test_a_06_a_tecla_livre_chega_ao_perfil.py`,
  11 casos, e as DEZ mordidas da §2 rodam sobre ela e sobre a régua da aba.
* `ruff check src/ tests/` limpo · `validar-acentuacao.py --all` limpo.

---

## 8. As TRÊS réguas de outra posse que tive de reescrever

**Elas mediam o mundo de antes desta frente, e as três reprovavam a MELHORA.**
Está declarado aqui porque o `posse:` desta sprint não as lista — a decisão de
reescrever é minha, com a razão de cada uma, e nenhuma foi tocada em massa.

| régua | o que ela perguntava | o que ela passou a perguntar |
| --- | --- | --- |
| `test_a_aba_06…::test_a_marca_esta_nas_tres_regioes_do_touchpad_e_so_nelas` | `quantas == 2 * len(REGIOES)` — *"as DUAS telas de botões"* | **as três células com a marca são distintas e aparecem o mesmo número de vezes**. A tela nova é a terceira que lista botões, e a marca foi junto **porque é verdade lá também** |
| `test_a_aba_06…::test_o_guardar_nomeia_os_atalhos_que_param_de_valer` | o recado nomeia o `r1` | o recado nomeia o **`cross`**. O `r1` está no domínio e **sobrevive** desde esta frente; com ele, a régua exigia um recado sobre uma perda que não acontece mais (`DID NOT RAISE`). O `cross` está fora, e ali a perda é real. **Os dois lados são cobrados** — o novo mora na régua desta frente |
| `test_a_06_o_duble…::test_todo_valor_do_duble_existe_como_opcao` | *"há `<select>` ou `<input type=range>` com esse endereço?"* | **e `<input type="text"`**, onde qualquer string cabe. E a contagem passou a ser por MUNDO: a tela nova está na bancada e não no publicado, e um número só para as duas voltas reprovaria a bancada por tê-la |

**E uma quarta, que era VERMELHA NA BASE e não é minha:**
`test_a_06_o_duble…::test_os_sete_campos_de_texto_dizem_o_que_o_duble_diz`
digitava `"USB"`/`"BT"` e o cartão dizia `rádio` — a palavra do transporte mudou
com o glossário da casa (06/09) e a régua não foi junto. **Medido no `3f6855a6`
antes de eu escrever uma linha.** Curei porque a cura é a regra da casa e cabe
em duas linhas: quem responde passou a ser
`home_actions.palavra_do_transporte`, o mesmo dono que a mesa consulta.

---

## 9. O que sobrou para o próximo

### O defeito de ROUND-TRIP no dono, e ele é da JANELA ANTIGA também

**`humanize_binding` e `dehumanize_binding` não são inversas.** Medido em
06/09/2026:

```
humanize_binding("KEY_F5")   -> "F5"          (o ramo de fallback, `tok[4:]`)
dehumanize_binding("F5")     -> "F5"          (não volta a ser tecla)
parse_binding("F5")          -> ValueError
```

`dehumanize_binding` só converte caractere ÚNICO (`W` → `KEY_W`). Alcança
**F1..F12, Home, End, Insert, PageUp, PageDown, Comma, Dot e as três de
volume** — tudo o que o teclado virtual declara e o `_KEY_LABELS` não nomeia.

**Na janela antiga isso é um defeito vivo:** a coluna "Tecla do teclado" MOSTRA
`F5` e RECUSA `F5` quando alguém o digita de volta, com um toast.

**Aqui foi contornado, não curado**, e o contorno está declarado no código
(`a06_navegacao._desfazer_o_humanize`): o ramo de fallback do dono aplicado ao
contrário, com o **device** decidindo (`SUPPORTED_KEYS`). **A cura de verdade é
no dono** — `input_actions.dehumanize_binding` —, que está no `nao_toca:` desta
sprint. É meia dúzia de linhas e fecha os dois lados de uma vez.

### `_tabela_efetiva` merece ser pública

`a06_navegacao._linhas_dos_botoes` chama `acoes._tabela_efetiva` — um privado de
outro módulo (`core/acoes_de_botao.py`, `nao_toca:`). A alternativa era montar
as três camadas de novo na aba, que é a segunda verdade que esta casa persegue.
**O diff é de uma linha**: renomear para `tabela_efetiva` e acrescentá-la ao
`__all__`, com o `_tabela_efetiva` como alias enquanto houver chamador.

### O `r3` aparece na tira depois do primeiro Guardar de teclas, e é honesto

`_atalhos_de_hoje` materializa `key_bindings` a partir de
`DEFAULT_BUTTON_BINDINGS` — **incluindo o `r3`**, que fica fora do
`DOMINIO_DO_TECLADO` por causa da colisão mouse × teclado. Materializar tudo é o
certo (`resolve_key_bindings(None) == dict(DEFAULT)`, medido: não muda nada); o
efeito colateral é que a tira passa a nomear o `r3` como atalho que o "Guardar"
da TABELA faria parar de valer. **É verdade** — o `apply_button_actions`
reescreve o teclado inteiro sem consultar quem está fora do domínio —, e antes
era um silêncio. Fechá-lo é dar ao `r3` um lugar nas duas camadas, e é sprint
própria (é a mesma colisão que `keyboard_mappings.py:56-62` registra).

### Três coisas que a `ONDA3-MOTOR-01` deixou e eu NÃO fiz

1. **`_mapas_que_sobrevivem_ao_nada` continua devolvendo os seis.** A cura dela
   (devolver `frozenset()`) quebra
   `test_a_aba_06…::test_o_que_o_nada_nao_cala_e_dito_e_o_produto_e_quem_decide`,
   que chama `set_button_actions(device, do_mouse)` **com um argumento só** e
   por isso mede o mundo de ontem. A tira over-avisa — *avisar de uma perda que
   não acontece mais é melhor que perder calado* —, e curar os dois lados é uma
   entrega de uma linha de produto e uma régua, que não é desta sprint.
2. **`docs/data/paridade-gtk-html.csv:213`** (a convivência `key_bindings` ×
   `button_actions`) continua fechável, com o endereço novo
   `core/acoes_de_botao.py` (`_tabela_efetiva`) e `profiles/manager.py:679`.
3. **`profiles/schema.py`**, o comentário do campo `key_bindings`, continua
   dizendo que um dict parcial *"segue default nos demais"*. Não segue.

### Uma dúvida de DESENHO, que é dela

**O ↺ é um glifo sem palavra**, na terceira coluna, com o `title` explicando.
As outras telas desta aba não têm coluna de ação por linha — este é o primeiro.
Se ela preferir texto (`Padrão`) ou o botão fora da tabela, é uma linha no
gerador. Está na foto `C-NAVTECLAS-v2-teclas.png` para o olho dela decidir.

---

## 10. A armadilha deste turno

**UMA DECLARAÇÃO DE DIVERGÊNCIA QUE NUNCA CONTOU COMO DECLARAÇÃO.** A seção
`## 06-navegacao.html` existia em `mockup/DIVERGENCIAS.md` desde a costura da
ONDA B, escrita com cuidado e com quatro razões medidas — e o portão do desenho
**nunca a leu**, porque o título carregava um adorno
(`— **JÁ PUBLICADA, e ela precisa saber disso**`) e a régua casa
`^##\s+(\S+\.html)\s*$`. Ninguém viu, porque enquanto a bancada e o publicado
eram idênticos não havia nada a declarar.

*É a forma de sempre nesta casa, com um agravante: a declaração estava lá, e
era boa. O que faltava era ela caber na régua* — e um portão verde sobre uma
seção que ele não enxerga é indistinguível de um portão verde sobre trabalho
feito. **A regra que sobra:** título de seção de `DIVERGENCIAS.md` é o nome do
arquivo e nada mais; o recado vai no corpo.
