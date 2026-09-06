---
sprint: ONDA5-10-01
estado: feita
decisoes: 10-Q2
posse:
  10-Q2:
    - src/hefesto_dualsense4unix/profiles/simple_match.py
    - src/hefesto_dualsense4unix/app/actions/perfis_web.py
    - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - src/hefesto_dualsense4unix/interface/aba10.py
    - tests/unit/test_a_aba_10_perfis_fecha_as_linhas.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/carona_do_wrapper.py
  - docs/data/paridade-gtk-html.csv
depois_de: [MIGRA-PERFIS-01, MIGRA-PERFIS-03, MIGRA-PERFIS-04, MIGRA-PERFIS-05, MIGRA-PERFIS-06, ONDA-PERFIS-01, ONDA-PERFIS-02, ONDA-PERFIS-03, ONDA-PERFIS-04, ONDA-PERFIS-05, ONDA-PERFIS-06, ONDA-PERFIS-08, ONDA-PERFIS-09, ONDA2-10-PERFIS-01]
---

# ONDA5-10-01 · DEFEITO — o Hefesto não manda ninguém para o terminal

> **ESTADO 06/09/2026: feita.** Os quatro passos entraram, e as QUATRO bocas
> caíram — as três da tabela do §1 mais uma quarta que a sprint não previa
> (`perfis_web.GESTOS_SEM_MOTOR["voltar-a-de-ontem"]`, *"só a linha de comando
> sabe restaurar. Falta a tela."* — e a tela existia desde 03/09).
>
> **A PROVA, medida no WebKit vivo** com
> `scripts/ensaios/o_detectar_grava_o_jogo_de_fora_da_steam.py` (perfil num lar
> de mentira, ponte dublada, `--oculta`):
>
> ```
> a classe em foco    'GrimFandango' (NÃO é da Steam)
> a regra ANTES       {'tipo': 'any',      'window_class': [],               'preset': 'any'}
> a regra DEPOIS      {'tipo': 'criteria', 'window_class': ['GrimFandango'], 'preset': 'janela'}
> [gesto] 10-perfis.html · detectar → aplicado, e a resposta foi para a tela
> BANCADA reaberta:   o campo mostrou 'Jogo (pela janela)' · cadeado APAGADO
> ```
>
> **O que ficou para ela:** o desenho da aba 10 andou (uma opção a mais no
> seletor) e o publicado não — `--publicar 10` é ato dela, e a divergência está
> declarada em `mockup/DIVERGENCIAS.md` **com o custo medido**: no publicado a
> pintura escreve 2 de 3 valores e o campo fica com o "Jogo" do desenho.
>
> **§5.1 confirmado no disco:** os sete perfis de fábrica continuam travados —
> nenhum tem `window_class` de UM elemento.

> **A decisão dela, 05/09/2026, decisão 10-Q2.**
> Pergunta: *"Depois que a tela avisar que não sabe mostrar a regra do perfil,
> ela te dá algum caminho para mudar essa regra por aqui, ou só explica e
> para?"*
> Ela marcou **"Só o aviso, sem conserto"** e digitou:
>
> ***"Isso é erro do produto."***

A opção diz que a tela não ganha editor avançado. **A palavra dela diz outra
coisa, e vence a opção**: mandar alguém para a linha de comando não é o
acabamento honesto de uma limitação — é a limitação com um bilhete em cima.

**A regra desta casa, e ela é o corpo desta sprint:** *o Hefesto não explica a
própria falha — ele a conserta.*

---

## 1. O QUE SE MEDIU — TRÊS bocas mandam ela para o terminal, e uma delas quebra uma promessa escrita na mesma tela

| # | onde | o que diz |
| --- | --- | --- |
| 1 | `app/actions/perfis_web.py:233-237` | *"…o seletor fica travado para que salvar não a rebaixe. **Para editá-la, use `hefesto-dualsense4unix profile` na linha de comando.**"* |
| 2 | `interface/pacotes/a10_perfis.py:648-651` | *"Esta tela não mostra esses campos; para vê-los e mudá-los, **use `hefesto-dualsense4unix profile` na linha de comando.**"* |
| 3 | `interface/pacotes/a10_perfis.py:2519-2523` | *"…para jogo de fora da Steam, **a regra ainda se escreve pela linha de comando** (`hefesto-dualsense4unix profile`)."* |

A boca 1 ainda fala uma quarta vez, por outra porta: os dois gestos do editor
levantam com ela quando o perfil está travado —
`a10_perfis.py:2170` (`editor.ambiente`) e `a10_perfis.py:2453` (`editor.jogo`).

**A TERCEIRA É A PIOR, e é a que decide esta sprint.** O botão que a recusa
carrega, no desenho, uma promessa literal:

```html
<button class="btn roxo" data-hef-gesto="detectar"
        title="Pega o jogo que está rodando atrás desta janela e monta a regra
               — funciona com jogo de qualquer lugar, não só da Steam.">Detectar</button>
```
— `src/hefesto_dualsense4unix/interface/aba10.py:1168`

**A tela promete "qualquer lugar" e o produto entrega Steam.** O próprio
docstring do gesto já escrevia o porquê, e escrevia também que a saída era o
terminal (`a10_perfis.py:2486-2494`):

> *"**jogo de fora da Steam** — RECUSA DIZENDO a classe que viu. … o detector
> entrega uma **wm_class**, e o produto só sabe guardá-la como
> `MatchCriteria(window_class=…)`, que é uma regra que este editor não sabe
> MOSTRAR — o perfil abriria travado, com a frase de usar a linha de comando.
> Gravar isso a partir de um botão seria empurrar o perfil dela para fora da
> tela."*

O raciocínio está certo e a conclusão não segue. **Se gravar a regra empurra o
perfil para fora da tela, o conserto é a tela aprender a regra — não o botão
desistir.**

---

## 2. A CAUSA, MEDIDA NOS NOVE ARQUIVOS — e ela derrubou a hipótese barata

`_ambiente_do_perfil` (`perfis_web.py:321-342`) declara **duas portas** para o
seletor travado:

1. o preset é `browser`/`terminal`/`editor` — existe no produto
   (`profiles_actions._APLICA_A_ITEMS:130-138` tem sete) e não no desenho
   (`aba10.AMBIENTES:750` tem cinco, e uma delas é falsa);
2. `detect_simple_preset` devolveu `None`.

**A hipótese barata era fechar a porta 1** — três rótulos no seletor, zero
motor. Medi os nove perfis de fábrica um a um, lendo o `match` de cada arquivo
em `assets/profiles_default/`:

| perfil | forma do `match` | preset detectado |
| --- | --- | --- |
| `acao`, `aventura`, `corrida`, `esportes`, `fps` | `window_title_regex` + 9 a 12 `process_name` | `None` — **travado** |
| `navegacao` | 10 `window_class` | `None` — **travado** |
| `point_and_click` | 2 `window_class` (`GrimFandango`, `grim`) | `None` — **travado** |
| `fallback`, `personalizado` | `MatchAny` | `any` → "Todos" |

**A porta 1 fecha ZERO dos sete.** O `navegacao.json` parecia o caso dela — e
não é: a lista dele **mistura navegadores e terminais**
(`firefox`, `Navigator`, …, `gnome-terminal`, `gnome-terminal-server`), e
`_criteria_equal` compara conjunto por igualdade exata contra `_NAVEGADORES`
(`simple_match.py:157-163`). Ele cai na porta 2 como os outros seis.

**Os sete travados são a porta 2, e são duas formas só:** cinco por título de
janela, dois por lista de classes.

**E há uma TERCEIRA forma, que não está nos nove e é a que o `Detectar`
produz:** uma classe de janela SÓ. `from_simple_choice` sabe escrever
`process_name` com um nome (`"game"`, `simple_match.py:244-247`) e
`window_class` com um `steam_app_<id>` (`"steam_game"`, `:234-243`) — e não sabe
escrever `window_class` com uma classe qualquer. **É o buraco exato entre o que
o detector entrega e o que o editor guarda.**

---

## 3. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — a sexta forma nasce no dono das formas

`profiles/simple_match.py`. Uma classe de janela só, simétrica ao `"game"` que
já existe para o nome de programa:

* `from_simple_choice("janela", classe, …)` → `MatchCriteria(window_class=[classe])`,
  com a mesma recusa falante do `"game"` quando `classe` vem vazia
  (`MSG_JOGO_SEM_NOME` tem irmã a escrever);
* `detect_simple_preset` (`:251-301`) reconhece `window_class` com **exatamente
  um** elemento, sem `process_name` e sem `window_title_regex` — o espelho da
  detecção do `"game"` em `:294-301`. **Depois do `_detect_steam_appid`**, que
  já roda em `:282-283`: um `steam_app_<id>` é um `window_class` de um elemento e
  tem de continuar saindo como `steam_game`, ou o round-trip do R-12 quebra;
* `simple_extra` (`:305-322`) devolve a classe, pelo mesmo caminho que hoje
  devolve o `process_name[0]` em `:315-321`.

**O nome do preset não é gosto:** `"janela"` porque é o que o dado é. `"app"` ou
`"programa"` colidiria com o `"game"`, que é outro campo do esquema — e o
docstring do `detectar` já mediu que confundir os dois casa por acaso
(`a10_perfis.py:2492-2494`).

**A MORDIDA:** devolva `detect_simple_preset` ao corpo de antes e
`test_a_classe_de_uma_janela_fecha_o_round_trip` (novo, §4) reprova: escrever
`"janela"` e reabrir devolve `None`, que é o perfil travado de volta.

### Passo 2 — os TRÊS seletores ganham a sexta opção, ou o perfil nasce fora da tela

Gravar a forma nova sem ensiná-la aos seletores é o estrago que o docstring do
`detectar` previu. São três lugares, e nenhum pode ficar para trás:

| arquivo:linha | o que muda |
| --- | --- |
| `app/actions/perfis_web.py:218-223` | `AMBIENTE_DO_PRESET["janela"] = "Jogo (pela janela)"` |
| `interface/aba10.py:750` | `AMBIENTES` ganha o mesmo rótulo, na mesma ordem |
| `app/actions/profiles_actions.py:130-138` e `:85` | `_APLICA_A_ITEMS` ganha a linha **e `_IDS_COM_CAMPO_LIVRE` também** |

**O `:85` não é zelo.** `_populate_editor` faz `self._select_radio(preset_key)`
(`profiles_actions.py:3993`) com o que `detect_simple_preset` devolver; um
`"janela"` sem radio na janela GTK é um `select` sobre um id que não existe. E
sem a entrada em `_IDS_COM_CAMPO_LIVRE` (`:3999`) o campo livre abre **vazio**
sobre um perfil que tem classe — o defeito que o R-12 já cobrou uma vez do
`steam_game`.

**A MORDIDA:** tire a linha de `_APLICA_A_ITEMS` e
`test_toda_forma_que_o_produto_escreve_tem_rotulo_nas_duas_telas` (novo, §4)
reprova nomeando a forma órfã. Tire só a de `_IDS_COM_CAMPO_LIVRE` e ela reprova
pela segunda asserção — a do campo que volta vazio.

### Passo 3 — o `Detectar` para de recusar o que a tela dele promete

`a10_perfis.py:2519-2523`. Com a forma nova de pé, o ramo do `appid is None`
deixa de ser recusa e passa a gravar `from_simple_choice("janela", classe, …)`
— **quando há classe**. A recusa continua existindo, e continua sendo a única
honesta: **nenhuma janela em foco** (`classe` vazia ou `"unknown"`), que é o
caso em que o detector não viu nada.

O desfecho continua sendo o de hoje (`_dizer(_agora_vale_em(prof, …), …)`,
`:2532-2533`) — e agora `_agora_vale_em` tem o que dizer: `_match_label` nomeia
a regra nova.

**A MORDIDA:** devolva o `raise` do ramo com classe e
`test_o_detectar_cumpre_o_que_o_title_promete` (novo, §4) reprova — ela dá ao
dublê uma `wm_class` que não é da Steam e cobra que o perfil saia com ela no
disco. **Ela é a régua que amarra o `title` ao gesto:** lê o texto do botão em
`aba10.py:1168`, acha o *"qualquer lugar"*, e exige que o gesto não levante.

### Passo 4 — as duas frases param no FATO, e não apontam para fora

É aqui que a escolha dela — *"Só o aviso, sem conserto"* — se cumpre ao pé da
letra: **a frase diz o que a regra é, e para.**

* `perfis_web.py:233-237`: some *"Para editá-la, use `hefesto-dualsense4unix
  profile` na linha de comando."* O que fica é a primeira metade mais o
  parêntese que `_ambiente_do_perfil:342` já monta com `_como_e_a_regra`
  (`:345-366`) — *"casa por título de janela e 9 nome(s) de programa"*.
* `a10_perfis.py:648-651` (`FIM_DA_EXIGENCIA_AQUI`): a mesma poda. O que sobra é
  o fato: **esta tela não mostra esses campos.**

**O que NÃO se toca:** `simple_match.CAMINHO_DA_JANELA_GTK` (`:440`) e o
`FIM_DA_EXIGENCIA_NA_GTK` (`a10_perfis.py:647`). A frase *"Ligue o Modo avançado
para ver e mudar"* **é verdadeira na janela GTK** — o `main.glade:2275` tem o
interruptor com esse nome. Podar lá seria trocar um defeito por outro, e a
separação entre o FATO (do matcher) e o CAMINHO (de cada tela) foi feita em
05/09 exatamente para isto.

**A MORDIDA:** devolva o fim ao `FIM_DA_EXIGENCIA_AQUI` e
`test_a_tela_nao_manda_ela_para_fora_do_produto` (novo, §4) reprova nas duas
frases de uma vez — ela varre as duas constantes atrás de `"linha de comando"`.

---

## 4. AS RÉGUAS, e o arquivo que já existe tem DUAS que precisam ser relidas

**Não faça substituição em massa em
`tests/unit/test_a_aba_10_perfis_fecha_as_linhas.py`.** Duas réguas dele falam
do fim da frase, e as duas **continuam verdes** com o Passo 4 — porque comparam
contra a CONSTANTE, não contra o texto:

* `test_o_modo_avancado_nao_chega_a_esta_tela` (`:428-447`) — asserta
  `frase.endswith(a10_perfis.FIM_DA_EXIGENCIA_AQUI)`. Passa. **O docstring dela
  é que caduca**, e tem de ganhar a data: ele argumenta que a frase precisa de
  um fim que "esta tela alcança", e a decisão de hoje diz que o fim é o fato.
* `test_o_matcher_nao_nomeia_botao_de_tela_nenhuma` (`:450-495`) — mesma coisa,
  e o comentário do fim dela (*"sem isto o aviso vira beco sem saída: ela lê que
  falta um campo e não lê onde mexer"*) é a frase que a decisão de hoje
  substitui. Reescreva-o, não o apague: ele é decisão medida e leva data.

`test_nenhuma_pagina_desta_interface_oferece_o_modo_avancado` (`:498-514`) fica
intocada — ela mede as páginas publicadas, e nenhum passo daqui as muda.

**As quatro réguas novas, e cada uma morde num passo diferente:**

1. `test_a_classe_de_uma_janela_fecha_o_round_trip` — escreve, relê, e exige
   `"janela"` de volta com a classe em `simple_extra`. **E exige que um
   `steam_app_<id>` continue saindo como `steam_game`** — a asserção que
   protege o R-12 da ordem do Passo 1.
2. `test_toda_forma_que_o_produto_escreve_tem_rotulo_nas_duas_telas` — para cada
   chave de `SIMPLE_MATCH_PRESETS` mais `"game"`, `"steam_game"` e `"janela"`,
   cobra rótulo em `AMBIENTE_DO_PRESET` **ou** declaração de ausência. É a régua
   que impede a próxima forma de nascer órfã, e ela **reprova hoje, antes do
   Passo 2** — `browser`, `terminal` e `editor` estão órfãos e são dívida
   declarada, não achado novo (`perfis_web.py:214-217`).
3. `test_o_detectar_cumpre_o_que_o_title_promete` — a do Passo 3, e ela LÊ o
   `title` do botão em vez de digitar a promessa.
4. `test_a_tela_nao_manda_ela_para_fora_do_produto` — varre
   `AMBIENTE_QUE_A_TELA_NAO_MOSTRA` e `FIM_DA_EXIGENCIA_AQUI` atrás de
   `"linha de comando"` e de `"hefesto-dualsense4unix profile"`.

**E cuidado com o dublê.** O `detectar` lê `ctx.state["window_detect_last_class"]`
(`a10_perfis.py:2513-2514`); um dublê que devolva `"steam_app_123"` mede o ramo
velho e dá verde sobre o Passo 3 inteiro. **Use uma classe que não é da Steam** —
`"GrimFandango"` serve, e é a de um perfil de fábrica de verdade.

---

## 5. O QUE ESTA SPRINT **NÃO** DECIDE

1. **Os sete perfis de fábrica continuam travados.** Nenhum deles é
   `window_class` de um elemento: cinco são título de janela mais lista de
   programas, dois são lista de classes. Destravá-los é o editor avançado, e ela
   o recusou hoje com todas as letras. **O que muda para eles é só a frase** —
   ela diz o que a regra é e não manda ninguém para fora.
2. **Os três presets órfãos ficam órfãos.** `browser`, `terminal` e `editor`
   existem no produto e não no desenho, e a razão está medida e é dela: são duas
   decisões do MESMO dia que se contradizem
   (`docs/data/decisoes-dela.csv:55` fecha em cinco; `:84` diz cinco mais
   "Programas"), sem lápide dizendo qual caducou. **A régua nova os declara em
   vez de os esconder** — é a diferença entre dívida e esquecimento.
3. **O `point_and_click` continua travado** mesmo com a forma nova: duas classes,
   não uma. Declarado aqui para ninguém medir de novo.

---

## 6. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois:

* **O seletor nunca REBAIXA a regra dela.** É o R-12, e é a razão de a válvula
  existir (`perfis_web.py:224-232`). Nenhum passo daqui aceita uma troca que
  substitua regra fina por "Todos": `_pergunta_antes_de_rebaixar`
  (`a10_perfis.py:2172`) e as duas guardas de `ambiente_travado`
  (`:2169-2170`, `:2452-2453`) ficam onde estão.
* **A LEITURA continua tolerante.** `_PRESETS_HISTORICOS`
  (`simple_match.py:179-182`) faz um "Terminal" de julho continuar abrindo na
  página simples. A forma nova entra DEPOIS dele (`:291-293`), nunca antes.
* **O `steam_game` vence o `janela`.** `_detect_steam_appid` roda em
  `simple_match.py:282-283`, antes de tudo, e continua rodando.
* **O cadeado e o ponto de alerta continuam acendendo pelo mesmo par de
  endereços** — `editor.ambiente.travado`/`editor.ambiente.recado` e
  `editor.jogo.exige`/`editor.jogo.exigencia`, por `aba10.marca_com_dica:687`.
  A frase encurta; a marca não muda de dono.
* **A exigência escondida continua nomeando o que o perfil exige** —
  `test_a_exigencia_do_pragmata_chega_a_esta_tela` (`:409-423`) cobra
  `"PRAGMATA.exe"` dentro da frase, e a poda do Passo 4 é do FIM.
* **O `Detectar` continua recusando quando não há janela nenhuma**, e continua
  nomeando o que viu (`a10_perfis.py:2519-2523`, a metade que fica).
* **A janela GTK continua abrindo os mesmos perfis.** O Passo 2 acrescenta
  linha, nunca troca nem tira — `_APLICA_A_ITEMS` mantém as sete de hoje.

---

## A PROVA DE TELA

O seletor ganha uma opção e o `Detectar` passa a gravar. **Botão que você
acrescentou e nunca clicou não está entregue:** foto antes e depois, o clique no
`Detectar` com uma janela que não é da Steam em foco, e a mordida colada.

**A janela não nasce na tela dela.** `--oculta` sempre — ela tem UMA tela.
