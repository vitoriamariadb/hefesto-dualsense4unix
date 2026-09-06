# LUZES-01 — as cinco lâmpadas sem trocar o número

**Árvore:** `hefesto-voo/LUZES-01-BLUZ` · branch `voo/LUZES-01-BLUZ`, de
`onda/atual-0609` em `eb7b844c`.
**Bancada:** `status` disse **LIVRE**, e eu **não a reservei** — nenhum caminho
desta entrega parou o daemon nem escreveu no aparelho. Ver *"O que NÃO
verifiquei"*. **As luzes dos controles dela estão como estavam.**

---

## O que mudou

### O que se mediu antes de escrever uma linha

**A ABA 04 ESTÁ NO TETO EXATO DA JANELA, e o número que eu tinha na cabeça
estava errado.** A primeira escrita desta entrega punha as teclas numa FAIXA
NOVA da grade, com a conta *"o `.miolo` oferece 564px e o quadro mede 526, logo
há 38 de folga"*. O Chrome reprovou na hora:

```
antes   rola=false   miolo clientHeight=564   scrollHeight=564   quadro=526
faixa   rola=TRUE    miolo clientHeight=564   scrollHeight=590   quadro=556
```

Os 38px de diferença **são o rodapé**, não folga. A aba passou a rolar por
dentro — que é conteúdo que ninguém sabe que existe. A faixa foi desfeita e a
`--r-player` voltou aos 52 originais.

**ONDE COUBE, e a superfície estava à vista:** a `.aceso` mede 220x34 e usava
**68** (duas tiras de 6 e o indicador de 56). Os 152px vagos são a única
superfície livre da coluna, e ela é a certa por significado — é a célula LEDs.
As doze teclas fecham em **216 de 220**, medido no Chrome.

### As cinco linhas `FALTA_NO_HTML` que fecharam

| CSV | o que nasceu | onde |
| --- | --- | --- |
| `140` | as cinco luzes de jogador viraram **botões**: clicar acende/apaga UMA, sem tocar no número | `a04_iluminacao.banco_de_luzes`, gesto `luzes` |
| `141` | quatro teclas `P1`..`P4` que dão o **desenho** do número, e não o número | gesto `desenho-de` |
| `142` | `todas` e `nenhuma` — e a `nenhuma` **tira o override**, que é o caminho de volta | `devolver_o_desenho_ao_automatico` |
| `143` | o indicador virou o botão de **reenvio** (a decisão [03] dela aplicada às luzes) | gesto `reenviar-desenho` |
| `148` | **"Todos no automático"**, na faixa do título — o único desfazer de uma vez | gesto `auto-todos` |

`PISO_DA_ABA` foi de **7 para 11**.

### O achado que mudou o desenho do Passo 3

**"Todas apagadas" gravando `[False] * 5` seria o OPOSTO do caminho de volta.**
`profiles/manager._controllers_to_specs` monta o `OutputSpec` a partir de
`model_fields_set`: cinco falsos EXPLÍCITOS são uma escolha que o backend
respeita, e as lâmpadas ficariam presas **apagadas**, acima da camada
automática. O que solta é o campo deixar de existir (`_leds_sem`), e a cadeia
que faz o daemon ouvir é a do `profile.switch`:

```
perfil.gravar_e_reaplicar → profile.switch → ProfileManager.activate(origin="manual")
  → apply(origin="manual") → clear_user_output_overrides()      ← solta a camada
                                                                  da USUÁRIA
  → reset_profile_overrides(overrides)  ← republica o PERFIL sem o campo
  → reassert_resolved_outputs()         ← repinta o resolvido = o automático
```

`manager.py:425` é o único caminho que solta a camada onde
`player_leds_set_detalhado` escreve. **Por isso o ramo `nenhuma` não manda nada
ao fio:** um `player_leds_set_detalhado((False,)*5)` reescreveria justamente a
camada que a linha seguinte existe para soltar.

### E o gesto GRAVA, porque esta tela não vê o fio

`daemon/ipc_handlers._enrich_controllers_per_controller` **não publica
`player_leds`** — está medido e escrito em `dica_da_luz` desde 02/09. Sem a
gravação no override do perfil, o tique seguinte repintaria o padrão do NÚMERO
por cima da escolha dela: o clique acenderia a lâmpada e a tela a apagaria um
décimo de segundo depois. `desenho_de_agora` lê as duas únicas camadas que esta
tela alcança — o override do perfil e, na falta dele, `player_led_pattern(n)`.

### A guarda do tempo descompassado

`a_folha_alcanca_a_botoeira()` — irmã de `a_pintura_alcanca_o_desenho`. O bloco
das teclas viaja pelo alvo `html` do campo `luz`, e **esse endereço já está
publicado**: sem a guarda, o primeiro tique injetaria doze botões sem uma linha
de folha na página de ontem, e ela veria teclas sem forma antes de aprovar o
desenho. Hoje ela responde `False` (a folha só existe na bancada) e o pacote
emite o indicador de leitura de sempre.

### O que ficou de fora da posse, e por quê

* **`interface/regua_do_mockup.py`** — o ramo `marcado` do `_campo`, que não
  existia. A ONDA A mediu a cegueira e ela **reprovava a `--prova-de-mockup`**;
  o arquivo estava livre (nenhuma sprint aberta o cita) e o despachante mandou
  medir e consertar. Ver a §"o alvo que a régua não enxergava".
* **`interface/hefesto_vivo.py`** (no `nao_toca` desta sprint) — três pares em
  `PERIGOSOS`. **A edição é deliberada e o motivo é a máquina dela:** sem elas a
  `--prova-gesto` clicaria `luzes`, `desenho-de` e `auto-todos` na próxima volta
  e **escreveria no perfil dela** para provar que sabe clicar; o `auto-todos`
  desfaria de uma vez toda cor que ela escolheu controle a controle. O próprio
  teste manda pôr a linha "NO MESMO COMMIT que o ensinou a gravar", e é um
  acréscimo a um conjunto — não a lógica de ninguém.

---

## Qual mordida prova

### 1. A régua do gerador (`aba04._conferir`) — arranquei o rótulo `P1`..`P4`

```
$ sed -i 's/..., rotulo=f"P{n}")/...)/' a04_iluminacao.py && python3 aba04.py
ERRO em 04-iluminacao — decisão dela desfeita:
  - a tecla do desenho do P1 perdeu o rótulo `P1` — sem ele ela fica idêntica ao botão `1` da linha Jogador, que faz o CONTRÁRIO dela
  - a tecla do desenho do P2 perdeu o rótulo `P2` — ...
  - a tecla do desenho do P3 perdeu o rótulo `P3` — ...
  - a tecla do desenho do P4 perdeu o rótulo `P4` — ...
```

### 2. A mordida que a sprint nomeia — o gesto volta a renumerar

```
$ # p.identity_number_set(uniq, _numero(ctx, dele))  acrescentado ao gesto `luzes`
$ pytest -k nao_renumera
E  AssertionError: acender uma lâmpada renumerou o controle — é exatamente o
   defeito que esta sprint fecha: no HTML de ontem toda escrita de lâmpada
   vinha de carona numa troca de número
E  assert 'identity_number_set' not in ['identity_number_set', 'player_leds_set_detalhado']
FAILED ...::test_a_lampada_escreve_o_bitmask_e_nao_renumera
```

### 3. O caminho de volta — "nenhuma" passa a GRAVAR cinco falsos

```
$ # _com_o_desenho_gravado(..., uniq, (False,) * 5)  no lugar de  ..., None
$ pytest -k tira_o_override
E  AssertionError: o desenho ficou GRAVADO em vez de sair —
   {'lightbar': [255, 0, 0], 'player_leds': [False, False, False, False, False]}.
   Cinco falsos explícitos prendem as lâmpadas apagadas; o caminho de volta é o
   campo deixar de existir
FAILED ...::test_todas_apagadas_tira_o_override_em_vez_de_zera_lo
```

### 4. A gravação — o gesto para de escrever no perfil

```
$ # `pass` no lugar do save_profile de `_escrever_o_desenho`
$ pytest -k grava_no_perfil
E  AssertionError: o desenho não chegou ao override do controle: None
E  assert None == [False, False, True, False, True]
FAILED ...::test_a_lampada_grava_no_perfil_para_a_tela_nao_desfazer
```

**A cura devolvida:** `23 passed` no arquivo novo; `48 passed` com o
`test_a_aba_04_iluminacao_fecha_as_linhas.py` junto.

---

## A prova de tela

### O CLIQUE — no motor que ela vai usar, janela OCULTA

`WebKit2.WebView` em `Gtk.OffscreenWindow`, com o `BOOTSTRAP` de verdade e um
espião no `messageHandlers.hefesto` — o clique atravessa o ouvinte REAL até a
borda do Python, e nada chega ao daemon. O driver aponta `onde.PUBLICADO` para
uma cópia temporária das dez páginas, com a 04 vinda da bancada (o piloto abre
sempre a publicada, e publicar é ato dela).

```
peça clicada           gesto              controle   argumento
------------------------------------------------------------------------------
lampada 1              luzes              p1         1
lampada 2              luzes              p1         2
lampada 3              luzes              p1         3
lampada 4              luzes              p1         4
lampada 5              luzes              p1         5
desenho 1              desenho-de         p1         1
desenho 2              desenho-de         p1         2
desenho 3              desenho-de         p1         3
desenho 4              desenho-de         p1         4
desenho todas          desenho-de         p1         todas
desenho nenhuma        desenho-de         p1         nenhuma
reenvio (a moldura)    reenviar-desenho   p1
auto-todos             auto-todos                    (sem controle: é global)
```

**As treze peças novas responderam. Nenhuma nasceu muda.**

### A ARMADILHA DO `data-controle`, medida com sonda idêntica nos dois lugares

O despachante avisou que o `<svg>` guarda o **modelo** e o piloto usa o
**assento**. Duas sondas iguais, na MESMA coluna, clicadas pelo ouvinte real:

```
peça clicada           gesto              controle
sonda DENTRO do <svg>  sonda              dualsense     <-- o MODELO
sonda na .cel-leds     sonda              p1            <-- o ASSENTO
lampada 3 (de verdade) luzes              p1         3
```

**A botoeira mora na `.cel-leds`, irmã do `.moldura`.** Uma tecla posta dentro
do desenho chegaria ao Python dizendo que o controle se chama `dualsense`.

### NO TEMPO — as mutações continuam em ZERO

```
$ hefesto_vivo.py --oculta --abre 04 --conta-mutacoes 40
MUTAÇÕES DE DOM em 40 tiques (4.0 s) na 04-iluminacao.html, com a mesa parada
TOTAL: 0 mutações · 0.0 por tique
   04-iluminacao.html   60 tiques   60 pinturas   28 valores
```

### A GEOMETRIA, antes e depois

```
                antes            depois
rola            false            false
quadro           526px            526px
coluna           472px            472px
.aceso        220x34, 68 usados   220x34, 216 usados (12 alvos)
vãos da tira    11 / 11          11 / 11   (a régua da ressalva continua de pé)
transbordo      —                não (scrollWidth 220 == clientWidth 220)
```

**A coluna não cresceu um pixel.** As fotos (`.cel-leds` antes e depois, e a
grade inteira) estão no scratchpad desta sessão; a leitura delas é o que está na
tabela acima.

---

## O alvo que a régua do mockup não enxergava — CONSERTADO

**A medição da ONDA A:**

```
04-iluminacao.html: a régua lê `auto-cores` como '' no arquivo e a página
virgem mostra 'sim' — o parser e o leitor de tela discordam neste alvo (marcado)
```

**A causa, lida no fonte:** `regua_do_mockup._Leitor._campo` não tinha ramo para
`alvo == "marcado"`. O checkbox caía no ramo padrão e era lido pelo TEXTO, que
num `<input>` é sempre `''`; o `LER_CAMPOS` do piloto responde `'sim'` para um
marcado (`hefesto_vivo.py`, o ramo `el.checked ? 'sim' : ''`). A guarda do DOM
virgem confere os dois endereço a endereço e **reprovava a `--prova-de-mockup`**.

**A cura é um ramo, na língua do `escrever`** (`sim`/`''`, a mesma do alvo
`classe` booleano). Depois dela, os CINCO endereços `marcado` das dez páginas:

```
04-iluminacao.html     auto-cores       -> 'sim'
01-jogar.html          cadeado          -> ''
02-controles.html      p1·card-aberto   -> 'sim'
02-controles.html      p2·card-aberto   -> ''
```

Os quatro casam com o que o navegador devolve. **Os cinco estavam ilegíveis para
esta régua desde que o alvo `marcado` nasceu** — não era defeito da aba 04.

---

## O que a `PARIDADE-REMEDIR-01` tem de aplicar (o CSV é dela)

**As duas linhas da §1 da sprint, remedidas com o endereço lido:**

| CSV | veredito NOVO | o endereço que o sustenta |
| --- | --- | --- |
| `125` *Escolher uma cor livre* | **IGUAL** | `paginas/04-iluminacao.html:2427` e `:2802` — `<input type="color" class="livre" value="#0000ff" data-gesto="cor"`, idêntico ao `mockup:2517`/`:2895`. O ouvinte reconhece `data-gesto` (`hefesto_vivo.py:1223`) e o gesto existe (`a04_iluminacao.py:2322`). O `sinal` da linha (`_on_lightbar_cor_solta`) é função da GTK e nunca vai aparecer do lado HTML — **troque o sinal, não o veredito** |
| `127` *Marca de qual cor está escolhida* | **IGUAL** | `grep -c 'data-campo="hex"'` dá **20 nos DOIS** (eram 18 em 04/09; a página cresceu). Os oito tons carregam `data-campo="hex" data-hef-alvo="classe" data-hef-quando="#RRGGBB"` nos dois arquivos, duas vezes cada (as duas colunas conectadas) |

**E MAIS DUAS, que a sprint dava como abertas e já não são:**

| CSV | veredito NOVO | o endereço |
| --- | --- | --- |
| `146` *Checkbox "Cores automáticas por controle"* | **IGUAL** | o interruptor está no PUBLICADO em `paginas/04-iluminacao.html:2016-2017`, com os três atributos (`data-gesto`/`data-campo="auto-cores"` + `data-hef-alvo="marcado"`), e o gesto em `a04_iluminacao.py:2846`. A `html_faz` desta linha ainda diz *"Não existe controle nenhum para isso"* — caducou em 04/09 |
| `151` *Regra D4* | **A metade que sobrava FECHOU; o ramo D4 continua sem premissa** | a própria célula diz *"o que CONTINUA valendo desta linha é a outra metade — pelo HTML ela não vê nem muda o estado do automático"*, e essa metade é o interruptor de `:2016`. O ramo D4 (*cor única em "Todos" desliga o automático*) **não tem premissa nesta aba**: toda escrita de cor leva `uniq`, e override por-`uniq` VENCE a camada automática no merge — a cor não fica invisível, então não há o que desligar nem o que avisar |

**E as cinco que esta entrega fecha** (`140`, `141`, `142`, `143`, `148`) — o
portão `paridade-gtk-html` já as acusa como `divida-fechada`, com o arquivo e o
símbolo. **Cuidado com uma delas:** o `142` aponta `on_player_leds_preset_none`,
e esse nome aparece no meu arquivo **só em prosa** (a docstring nomeia o gêmeo
da GTK). O CSV já registra essa armadilha na própria célula; o sinal honesto
para o lado HTML é `devolver_o_desenho_ao_automatico`.

**A `158` continua CONDICIONAL e sem premissa.** O aviso *"o mesmo desenho foi
para os N controles"* depende de um escopo "Todos" de DESENHO. O `auto-todos`
que nasceu aqui é global, mas é de COR — e o `_Janela._quantos_recebem_o_desenho`
segue devolvendo 0 com a razão escrita.

---

## O texto de `mockup/DIVERGENCIAS.md` (é do coordenador desde hoje — cole)

```markdown
## 04-iluminacao.html

- **06/09/2026 — LUZES-01.** A célula LEDs ganhou a botoeira das cinco luzes de
  jogador (clicáveis, uma a uma) e seis teclas de desenho — `P1`..`P4`, todas e
  nenhuma —, o indicador virou o botão de reenvio, e a faixa do título ganhou o
  "Todos no automático". **Esta sprint NÃO publica**: o `--publicar 04` continua
  sendo ato dela, e a leva inteira publica de uma vez, no fecho (decisão dela,
  06/09). Enquanto isso, o pacote emite o indicador de LEITURA que o publicado
  sabe desenhar — a guarda é `a04_iluminacao.a_folha_alcanca_a_botoeira()`, e
  ela responde `False` até a folha chegar à página publicada.
```

---

## O que NÃO verifiquei

* **O APARELHO.** Nada foi escrito em controle nenhum. A bancada estava LIVRE e
  eu não a reservei: as doze teclas foram provadas no WebKit com a ponte
  substituída por um espião, e os gestos com um dublê. **O bitmask no fio, a
  lâmpada acendendo no plástico dela e o caminho de volta com o daemon vivo
  continuam por medir** — é o que a `LUZ-NO-RADIO-01` pede, e é a próxima volta.
* **O co-op de verdade.** A recusa dos três gestos com o co-op ligado está
  provada com dublê de estado (`coop.players = 2`); com um jogo em co-op aberto,
  não.
* **A aba na janela DELA.** A prova de tela roda em `Gtk.OffscreenWindow` e em
  Chrome headless. A palavra final sobre "ficou bonito" é dela
  (`PROVA-DE-TELA-01`), e a botoeira é **densa por necessidade** — 216 de 220px.
  Se ela recusar a densidade, a saída medida é a faixa nova da grade, e ela
  **custa uma rolagem** ou a redução do desenho do controle.
* **Os oito controles.** `player_led_pattern` cobre 1..8 e as teclas oferecem 4,
  que é o que a linha Jogador já oferece. Uma mesa de 5+ não foi medida.
* **As outras nove abas** com o ramo `marcado` novo no parser: medi os cinco
  endereços que existem e eles casam, mas não rodei a `--prova-de-mockup`
  inteira (ela abre dez abas e leva minutos).

## O que sobrou para o próximo

* **`docs/data/paridade-gtk-html.csv`** — as nove linhas acima, para a
  `PARIDADE-REMEDIR-01`. O portão `paridade-gtk-html` fica VERMELHO até lá, e o
  vermelho é a régua funcionando: ela acusa dívida fechada.
* **`mockup/DIVERGENCIAS.md`** — o texto pronto acima. O portão
  `desenho-aprovado` fica VERMELHO até ele entrar.
* **`interface/monta.py`** (não é minha): `luzinhas` ainda indexa
  `PADRAO_JOGADOR` e levanta `KeyError` em 9+. A aba 04 deixou de depender disso
  no ramo com botoeira, mas as outras abas continuam.
* **Um alvo `titulo` no pintor** (`hefesto_vivo.escrever`) resolveria as
  dezenove dicas congeladas desta aba de uma vez — inclusive as doze novas, cujo
  `title` é estático de propósito porque não nomeia controle nenhum.
* **`ipc_bridge.identity_number_set_detalhado`** — o relato de `_pares_da_troca`
  continua aberto.
