# PERFIL-MODO-01 — o perfil diz o que "Ativar" liga, e o jogo vem desta máquina

**Árvore:** `hefesto-voo/hefesto-voo/PERFIL-MODO-01-D` · branch
`voo/PERFIL-MODO-01-D`, nascida de `onda/atual-0609` e **adiantada para
`4070cf82`** no meio do trabalho (recado do coordenador; o vermelho de `mypy`
em `monta.py` era herdado e veio curado).

---

## [!] O QUE QUEM COSTURA TEM DE APLICAR, E NÃO É MEU

**UMA LINHA, e ela protege o perfil DELA.** O gesto `editor.modo` nasceu hoje e
GRAVA no disco. `tests/unit/test_todo_gesto_que_grava_esta_protegido.py` está
**VERMELHO na minha branch de propósito**, com a mensagem dele:

```
gesto(s) que ESCREVEM e a régua de clique vai acionar sozinha:
  10-perfis.html·editor.modo (escreve por `_gravar`)

Acrescente cada um a `hefesto_vivo.PERIGOSOS`, NO MESMO COMMIT que o
ensinou a gravar. Sem isso, a próxima volta da régua escreve no perfil
dela para provar que sabe clicar.
```

A cura é **uma linha**, ao lado das quatro que a aba 10 já tem
(`hefesto_vivo.py`, no bloco `PERIGOSOS`):

```python
    ("10-perfis.html", "editor.modo"),
```

**NÃO A APLIQUEI, e a razão é o contrato:** `interface/hefesto_vivo.py` está no
`nao_toca` do meu frontmatter **e** é posse declarada da `ONDA3-GESTO-DECLARA-01`
(que está EM VOO, com o arquivo modificado na worktree dela). Editá-lo seria
"a última a gravar vence" no arquivo que aquela sprint está reescrevendo.

**E ISTO É A QUARTA VEZ.** A `ONDA3-GESTO-DECLARA-01` existe porque o mesmo
defeito aconteceu TRÊS vezes em 04/09, e o diagnóstico dela é literalmente o meu
caso: *"as duas listas moram longe do gesto, em posses que a sprint da aba
declara no `nao_toca`. **Quem escreve o gesto não pode fechar o próprio
contrato.**"* Quando aquela sprint fechar, o `editor.modo` fica coberto sozinho
— ele grava pelo funil `_gravar`, e é só declarar `grava=` no decorador, que é
posse minha.

**A ordem de preferência para quem costura:** se a `ONDA3` entrar primeiro,
acrescente `grava="save_profile"` ao `@gesto("10-perfis.html", "editor.modo")`
em `a10_perfis.py:2441`. Se não, a linha acima em `PERIGOSOS`.

---

## O que mudou

### Passo 1 — a seção "Modo" do perfil (linha 384 do CSV, `FALTA_NO_HTML`)

O veredito era o mais duro da aba: *"NÃO EXISTE — nem na página, nem no
pacote"*. Agora existe nas três camadas:

| camada | onde | o que |
| --- | --- | --- |
| dado | `app/actions/perfis_web.py:273` | `MODO_DO_PERFIL`, que é `dict(_MODE_KIND_ITEMS)` — os quatro rótulos DELA, perguntados ao dono |
| dado | `app/actions/perfis_web.py:504` | `_pacote_do_editor` passa a emitir `"modo"`, o **id** (não o rótulo) |
| desenho | `interface/aba10.py:885` (`botoes_do_modo`) e `:1496` | os quatro `<button>` com `data-hef="editor.modo"` + `data-hef-alvo="classe"` + `data-hef-quando=<id>` + `data-modo=<id>` |
| motor | `interface/pacotes/a10_perfis.py:2442` (`editor_modo`) | grava `ProfileModeConfig`; `"none"` **remove** a seção |

**Os rótulos não estão digitados em lugar nenhum desta entrega.** O gerador
`aba10.py` os LÊ de `profiles_actions._MODE_KIND_ITEMS` por árvore de sintaxe
(`_lista_de_pares`, `aba10.py:35`), e **não** por `import` — a razão é medida:
`profiles_actions.py` faz `import gi` no topo, `aba10.py` é um gerador que
QUATRO fixtures de teste importam, e o CI tem um job sem PyGObject. O precedente
de forma é o `aba09._constantes`.

**A máscara nunca é inventada.** Este quadro não tem a linha da máscara (fora de
escopo por decisão da sprint), então o gesto só ZERA o `gamepad_flavor` fora do
modo jogo — a mesma regra de `_mode_section_from_editor` (*"JSON limpo, sem
sobras"*) e de `manager.alinhar_o_modo_com_a_ponte`. É a cicatriz do `or "xbox"`
que fazia salvar um perfil passar a EXIGIR Xbox (ESCOLHA-DELA-VENCE-01/E1).

**As DUAS frases não nasceram** (10-Q6, encomenda da `ONDA5-10-03`), e há régua
que LÊ as constantes de `home_actions` em vez de digitá-las.

### Passo 2 — o "Ativar" reflete nas outras abas (linha 358, `FALTA_NO_HTML`)

**A causa que o CSV supunha estava errada, e a medição está colada abaixo.** O
CSV diz *"nenhum tique relê o perfil do disco"*. Os pacotes das outras abas
RELEEM: `a03_gatilhos:1893`, `a04_iluminacao:1717`, `a06_navegacao:1713`,
`a08_conexoes:3426` chamam `perfil.ativo(ctx.state.get("active_profile"))`, e
`perfil.ativo` abre o `.json` a cada chamada. **O que não acontecia era o outro
lado: o NOME nunca chegava.**

Medido em 06/09/2026, com um perfil no disco e o daemon respondendo
`active_profile: null` — o estado que `perfil_que_esta_valendo` descreve como
*"o estado da máquina dela hoje"*:

```
COM NOME  : régua
SEM NOME  : {}                                        <- o que as outras abas viam
DONO P1   : PerfilQueVale(nome='régua', fonte='disco')
```

O dono do §P1 (`profiles_actions.perfil_que_esta_valendo:574`) já sabia a
resposta desde 24/08. As abas novas liam o campo CRU.

**A cura é do dono do estado**, `interface/pacotes/perfil.py`:

* `nome_do_ativo(state)` (`:93`) — pergunta ao §P1: daemon primeiro, marcador em
  disco depois. Nunca levanta;
* `ativo(nome)` (`:140`) — nome vazio deixa de ser `{}` e passa a cair no dono.

**Isso cobre TODOS os chamadores diretos com uma mudança só** — a03, a04, a06,
a08 e a10 — sem tocar num único arquivo de outra frente. E o «Ativar» passa a
chegar às outras abas porque o `profile.switch` grava os dois marcadores manuais
(`session.json` + `active_profile.txt`), que é justamente a segunda perna do
dono.

**UM chamador NÃO é alcançado, e ele está fora da minha posse — RELATO:**

```
src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py:247
    return _perfil.ativo(nome) if nome else {}      <- a guarda decide ANTES
    return _perfil.ativo(nome)                      <- a cura, uma linha
```

Com o daemon calado, a aba Vibração continua vendo `{}` — o teto por controle e
a ressalva da mesa em travessão. A régua
`test_o_perfil_ativado_chega_nas_outras_abas.py::test_todo_pacote_que_le_o_perfil_passa_pelo_dono`
varre a pasta `pacotes/` por AST e **declara este caso**; um segundo aparecer é
dívida nova e reprova.

**E o SEGUNDO lugar que lê o campo cru é o cabeçalho das DEZ abas — RELATO:**

```
src/hefesto_dualsense4unix/interface/pacotes/__init__.py:765   (pacotes.topo)
    ativo = str(ctx.state.get("active_profile") or "")
```

É o chip "Perfil ativo" do `topo.html` e as duas dicas do rodapé. Com o daemon
calado, as dez abas mostram `—` sobre um perfil que está valendo.
`pacotes/__init__.py` é **posse declarada da `ONDA3-GESTO-DECLARA-01`**, que
está em voo. A cura é uma linha: `ativo = perfil.nome_do_ativo(ctx.state)`.

### Passo 3 — a lista com os jogos DESTA máquina (linha 378, `FALTA_NO_HTML`)

O campo era texto livre e pedia *"o único dado que ninguém tem em mãos"*.

| camada | onde | o que |
| --- | --- | --- |
| desenho | `interface/aba10.py` (o `.campo` do "Nome do Jogo") | `<datalist id="jogos-desta-maquina">` VAZIO + `list=` no `<input>` |
| motor | `a10_perfis.py:1120` (`_html_dos_jogos`) | as `<option>` do catálogo, pelo `blocos` (`SELETOR_DOS_JOGOS`, `:912`) |

**`<datalist>` e não `<select>`**, e é o enunciado dela: *"uma lista que recusa
o que ela sabe que existe é pior que campo livre"*. O campo continua aceitando
qualquer texto — inclusive o appid de um jogo que ela ainda vai comprar, que é o
caso que `MSG_FORA_DA_MAQUINA` já cobre.

`value=appid` e `label="Nome (appid N)"` — a MESMA divisão das duas colunas do
`Gtk.EntryCompletion` da janela GTK, e pelo mesmo motivo escrito lá: gravar o
nome faria nascer um `steam_app_Sea of Stars`, que nunca casa com janela
nenhuma. O catálogo sai de `_nomes_dos_jogos()`, que já era memoizado pela
assinatura da biblioteca — nenhuma leitura de disco a mais por tique.

### §4.2 — a carona nos NOVE gestos que gravam o perfil inteiro

O que a `ONDA5-07-02` mediu e deixou escrito no relatório dela. A carona entrou
em `a10_perfis._gravar` (o funil dos oito — nove, com o `editor.modo` de hoje) e
em `voltar_a_de_ontem`, que tem funil próprio. A notícia **não se perde**:
`_gravar` guarda o que a carona disse em `_CARONA_PENDENTE` e o `_dizer` do
gesto a gruda no desfecho, com o `·` no meio.

**Ela NÃO foi para `perfil.gravar_e_reaplicar`**, e a razão está escrita lá: SEIS
chamadores em CINCO abas, ação imediata — seria uma varredura do
`localconfig.vdf` por clique, que é a opção que o dono da carona recusou.

`GESTOS_DA_INTERFACE_NOVA` do portão passou a cobrar os dois funis. **Cobra o
FUNIL e não os oito gestos** de propósito: um gesto novo que grave perfil nasce
coberto, em vez de esperar alguém lembrar da nona cópia da mesma linha.

### §4.3 — o `"janela"` em `_IDS_COM_CAMPO_LIVRE`, decidido com os olhos abertos

**DECIDI NÃO REPLICAR** o `_prefill_modo_de_jogo` da janela GTK (que
pré-seleciona o modo jogo num perfil NOVO cujo "Aplica a" seja jogo/janela).

A razão é a forma desta interface: aqui **não existe "perfil em edição"** — o
clique já grava. Uma pré-seleção escreveria `mode.kind = "gamepad"` no `.json`
dela sem ela ter escolhido nada, e o quadro passaria a afirmar um modo que o
perfil não pediu. Na GTK a pré-seleção é reversível antes do Salvar; aqui não há
Salvar. *"Não mexer no modo" é a verdade de um perfil sem a seção `mode`*, e é o
que o quadro mostra.

---

## Qual mordida prova

### A FOTO

| | arquivo | o que se vê |
| --- | --- | --- |
| **antes** (o que ela vê HOJE) | `PERFIL-MODO-01-antes.png` | a página PUBLICADA: cinco campos, sem Modo |
| **depois** | `PERFIL-MODO-01-depois.png` | a BANCADA: a fileira Modo com os quatro botões, «Não mexer no modo» aceso, e a tabela «Ajuste próprio» inteira |
| **depois, com a tira acesa** | `PERFIL-MODO-01-depois-com-a-tira.png` | os quatro cliques dados, o desfecho na tira, e a tabela com BARRA em vez de corte |

As três saíram com `--oculta`, num Xvfb próprio
(`[tela] janela desviada para o Xvfb :83 — a tela dela não recebe nada`).

### O CLIQUE

`scripts/ensaios/o_quadro_do_modo_grava_pelo_webkit.py` — abre a bancada no
`WebKit2.WebView`, clica os quatro como o navegador clica
(`MouseEvent('click', {bubbles:true})`) e lê o `.json` do outro lado:

```
  o modo ANTES        None
  --- BANCADA, antes do primeiro clique ---
    botões no desenho  ['none', 'desktop', 'gamepad', 'native']
    aceso pela pintura ['none']
    a pintura escreveu 3 valor(es)
    o campo consulta a lista?  True
    opções da lista    ['1245620|ELDEN RING (appid 1245620)', '851100|Sea of Stars (appid 851100)']
  --- OS QUATRO CLIQUES ---
    desktop  achou=True texto='Controlar o PC'        -> disco {'kind': 'desktop', 'gamepad_flavor': None}
    gamepad  achou=True texto='Jogar pelo Hefesto'    -> disco {'kind': 'gamepad', 'gamepad_flavor': None}
    native   achou=True texto='Conexão Nativa (Sony)' -> disco {'kind': 'native',  'gamepad_flavor': None}
    none     achou=True texto='Não mexer no modo'     -> disco None
  aceso no fim         ['none']
  --- PUBLICADO, a mesma pintura ---
    botões do modo     0
    o campo consulta a lista?  False

APROVA: os quatro cliques chegaram, os quatro gravaram o que prometem, «Não
mexer no modo» removeu a seção, e o campo do jogo consulta a lista desta
máquina no motor que ela usa.
```

**O `campoLigado: True` é a metade que só o motor dela responde:** `input.list`
resolvendo para o `<datalist>` **no WebKitGTK 2.52**, não no Chrome da bancada.
Era a única dúvida real do Passo 3, e ela está medida.

### A MORDIDA

Cada uma foi arrancada, rodada, colada e devolvida. As saídas abaixo são as
DESTA árvore, em 06/09/2026.

**Passo 1 — a gravação do modo arrancada.** `a10_perfis.editor_modo`, trocando
`prof.mode = ProfileModeConfig(**campos)` por `pass`:

```
E  AssertionError: o modo `desktop` não gravou a seção `mode` — o perfil
   continua sem dizer o que ativar ele liga
E  AssertionError: o modo `gamepad` não gravou a seção `mode` — …
E  AssertionError: o modo `native`  não gravou a seção `mode` — …
E  AssertionError: assert (ProfileModeConfig(kind='gamepad',
   gamepad_flavor='dualsense') is not None and 'gamepad' == 'native'
     - native
     + gamepad)
FAILED test_cada_modo_grava_o_kind_no_perfil[desktop]
FAILED test_cada_modo_grava_o_kind_no_perfil[gamepad]
FAILED test_cada_modo_grava_o_kind_no_perfil[native]
FAILED test_a_mascara_nunca_e_inventada_pelo_gesto
4 failed, 7 passed
```

Devolvida: `15 passed`. **A quarta linha é o bônus da mordida**: arrancar a
gravação também derruba a régua da máscara, porque o perfil fica com o
`dualsense` de antes — que é exatamente o que a régua persegue pelo outro lado.

**Passo 2 — a releitura do dono arrancada.** `perfil.ativo`, trocando o
`nome = nome_do_ativo(None)` por `return {}`:

```
E  AssertionError: com o daemon calado, as outras abas não leem perfil nenhum
   — é a AUSÊNCIA de dado, que se lê como «a mudança não pegou»
E  assert None == 'Perfil de ontem'
E  assert None == 20
FAILED test_com_o_daemon_calado_as_outras_abas_leem_o_perfil_do_disco
FAILED test_o_ativar_troca_o_que_as_outras_abas_mostram
2 failed, 4 passed
```

Devolvida: `6 passed`.

**Passo 3 — o escape do nome arrancado.** `_html_dos_jogos`, trocando
`_atr(...)` por interpolação crua, com um jogo chamado `A & B <b>"C"</b>`:

```
E  AssertionError: o rótulo de `999001` chegou cortado: 'A & B <b>'
E  assert 'A & B <b>' == 'A & B <b>"C"...appid 999001)'
     - A & B <b>"C"</b> (appid 999001)
     + A & B <b>
FAILED test_o_nome_do_jogo_dela_nunca_vira_marcacao
1 failed, 7 passed
```

Devolvida: `8 passed`. O `"` do nome fechou o `label=` e o navegador leu metade.

**Passo 3 — o `list=` arrancado** e **10-Q6 — a frase devolvida ao quadro**, na
mesma volta. O `_conferir` do próprio gerador recusou ANTES dos testes, que é o
degrau mais barato:

```
ERRO em 10-perfis — decisão dela desfeita:
  - o quadro Modo passou a descrever o que se perde ('giroscópio') — as duas
    frases saíram por decisão dela (10-Q6), e o aviso pertence ao canal de recado
  - o campo do jogo perdeu o `list=` — a lista continua no HTML e nenhum campo
    a consulta, que é o silêncio que esta casa lê como sucesso
```

E as duas réguas, sobre a página gerada assim mesmo:

```
E  AssertionError: o campo do jogo não consulta a lista — o `<datalist>` existe
   e ninguém o lê
E  AssertionError: o quadro Modo carrega `home_actions.TEXTO_CUSTO_MASCARA_XBOX`
   — a decisão 10-Q6 dela tirou as DUAS frases, e o aviso pertence ao canal de
   recado. A frase continua certa onde ela mora (a janela GTK); errada é a tela.
FAILED test_o_campo_do_jogo_consulta_a_lista_e_continua_livre
FAILED test_o_quadro_do_modo_nao_descreve_o_que_perde[bancada]
2 failed, 9 passed, 1 skipped
```

Devolvidas: `9 passed, 1 skipped`. **A régua da 10-Q6 não digitou a frase** —
ela a pediu a `home_actions` e a achou dentro do `title` que a mordida plantou.

**§4.2 — a carona arrancada.** Tirando o `_com_a_carona("")` do fim de
`_gravar`:

```
E  AssertionError: interface/pacotes/a10_perfis.py: ['_gravar'] não pega(m) a
   carona — um gesto que aplica ou grava perfil ficou sem repor o atalho de
   inicialização que a Steam come
E  assert not {'_gravar'}
FAILED test_a_interface_nova_tambem_pega_a_carona
1 failed, 26 passed
```

Devolvida: `27 passed`. **Ela NOMEIA o funil**, que é o endereço da cura — é o
que a `ONDA5-07-02` desenhou o portão para fazer.

### NO TEMPO

Uma régua que roda o tique UMA vez mede um instante, não um comportamento — em
29/08 uma leva introduziu uma regressão que só aparecia aos 181 segundos. O
ensaio pinta a MESMA carga **100 vezes** e conta o que foi escrito:

```
  --- NO TEMPO (100 pinturas da MESMA carga) ---
    a primeira escreveu 0 valor(es)
    as outras somaram   0
```

**Zero em 100 voltas.** Os dois caminhos novos são idempotentes por construção,
e agora está medido: o alvo `classe` compara antes de mexer
(`hefesto_vivo.escrever`) e o `blocos` só reescreve quando o `innerHTML`
diverge. O `<datalist>` com 2 opções e os 4 botões do quadro **não repintam a
cada tique** — que é o defeito que já custou dois dias a esta casa (o
`editor.prioridade` somando +1 por tique com um `'—%'` inválido).

O `--conta-mutacoes` do piloto NÃO serve aqui, e a razão é a mesma que segura o
resto: ele abre a página PUBLICADA, onde o quadro ainda não existe — mediria
zero mutações sobre um quadro ausente, que é verde sobre nada.

---

## Os 44 portões

`git add -A && bash scripts/portoes.sh` → **43 verdes, 1 vermelho.**

### O vermelho: `paridade-gtk-html`, e ele é a ENTREGA aparecendo

```
divida-fechada: paridade-gtk-html.csv:384  [10-perfis] A seção "Modo" do perfil
  o sinal '_mode_section_from_editor' APARECEU em
  src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py.
  O CSV diz FALTA_NO_HTML e o lado HTML passou a ter o símbolo.
```

**O CSV está no meu `nao_toca`** e a sprint manda escrever o texto pronto aqui.
Ele é da `PARIDADE-REMEDIR-01`. **Os endereços abaixo foram lidos no código de
hoje, não copiados de outro relatório.**

**Linha 384** — `veredito` `FALTA_NO_HTML` → **`DIFERENTE`**;
`sinal_escopo` `LADO-HTML` → `src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py`;
`html_onde`:

```
src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py:2442 · src/hefesto_dualsense4unix/app/actions/perfis_web.py:504 · src/hefesto_dualsense4unix/interface/aba10.py:885 · mockup/10-perfis.html:1803
```

`html_faz`:

> Quadro "Modo" com as MESMAS quatro escolhas, lidas de `_MODE_KIND_ITEMS` (o gerador as lê por AST, não por import: `profiles_actions` puxa `gi` e o gerador roda sem GTK). O clique já aplica e já grava (D1/D2), e "Não mexer no modo" REMOVE a seção. `gamepad_flavor` é PRESERVADO no gamepad e zerado fora dele — o quadro nunca escolhe máscara.

`porque`:

> DIFERENTE e não IGUAL, e a diferença é de FORMA e de ESCOPO. FORMA: lá é um `SegmentedSelector` numa fileira, aqui os quatro botões repartem a coluna e o rótulo quebra em duas linhas dentro do botão — medido, quatro rótulos numa fileira somam 563px e o `.val` tem 412. ESCOPO: a janela GTK abre a linha da máscara ("O jogo vê o controle como:") com "Jogar pelo Hefesto" e este quadro não a tem — decisão de escopo da PERFIL-MODO-01, e o valor do disco atravessa intacto. As DUAS frases do modo não nascem, por decisão dela (10-Q6, ONDA5-10-03), com régua própria. **O desenho espera o `--publicar 10`, que é ato dela** (`mockup/DIVERGENCIAS.md`).

**Linha 358** — `veredito` `FALTA_NO_HTML` → **`DIFERENTE`**; `html_onde`:

```
src/hefesto_dualsense4unix/interface/pacotes/perfil.py:93 · src/hefesto_dualsense4unix/interface/pacotes/perfil.py:140 · src/hefesto_dualsense4unix/app/actions/profiles_actions.py:574
```

`html_faz`:

> As outras abas relêem o perfil do DISCO a cada tique e o nome passou a vir do DONO: `pacotes/perfil.nome_do_ativo` pergunta a `perfil_que_esta_valendo` (daemon primeiro, marcador em disco depois) em vez de ler `state["active_profile"]` cru. Cobre a03, a04, a06, a08 e a10 de uma vez. **Não pergunta sobre trabalho pendente** — aqui não há rascunho a perder: o clique já grava.

`porque`:

> A causa que esta linha supunha estava errada, e a medição está em `docs/process/agentes/2026-09-06/PERFIL-MODO-01.md`: os tiques SEMPRE reliam o disco; o que faltava era o NOME chegar. Com o daemon respondendo `active_profile: null` — o caso vivo da máquina dela — `perfil.ativo(None)` devolvia `{}` e gatilho/brilho/atalhos viravam travessão em TODA aba, ativando ou não. DIFERENTE e não IGUAL porque a GTK ainda faz uma coisa a mais: PERGUNTA por diálogo antes de descartar edição pendente (`confirm_discard_pending_edits`). **DOIS chamadores ficam fora da cura e estão relatados:** `a05_vibracao.py:247` (guarda `if nome` antes do dono) e `pacotes/__init__.py:765` (o chip do topo, posse da ONDA3-GESTO-DECLARA-01).

**Linha 378** — `veredito` `FALTA_NO_HTML` → **`DIFERENTE`**; `html_onde`:

```
src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py:1120 · src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py:912 · mockup/10-perfis.html
```

`html_faz`:

> `<datalist>` no campo do jogo, enchido pelo `blocos` com `catalogo_de_jogos()` — `value` = appid (o que o campo grava), `label` = "Nome (appid N)" (o que ela lê), a MESMA divisão das duas colunas do `Gtk.EntryCompletion`. Teto de 500 entradas, e o campo continua aceitando texto livre.

`porque`:

> DIFERENTE e não IGUAL porque a mecânica é outra: a GTK filtra por `match_func` a cada tecla (casa por PEDAÇO do nome e por começo do número, `jogos_locais.casa_com_o_que_ela_digitou`), e o `<datalist>` usa o filtro do próprio navegador — que casa por PREFIXO de `value`/`label`. A escolha do `<datalist>` sobre um `<select>` é o enunciado dela: *"uma lista que recusa o que ela sabe que existe é pior que campo livre"*. Medido no WebKitGTK 2.52: `input.list` resolve e as opções chegam. **Espera o `--publicar 10`.**

### Os verdes que importam

`desenho-aprovado` verde com a divergência declarada em `mockup/DIVERGENCIAS.md`;
`palavra-de-tela`, `a-frase-banida`, `acentuacao`, `casa-sabe`, `anonimato`,
`ruff`, `mypy`, `shellcheck` — todos ok.

### Fora dos portões: UM teste vermelho, e UM erro herdado

**Vermelho meu:** `test_todo_gesto_que_grava_esta_protegido.py` — ver o bloco
[!] no topo. É **uma linha**, em arquivo de outra posse.

**Erro HERDADO, e não é meu:**
`test_regua_de_tela_a_aba_controles.py::test_o_gesto_do_som_tem_dono_declarado`
erra no `setup` quando roda EM LOTE, dentro de `controles_vivos.html_da_mesa` ->
`aba02.bloco`. Medido nos dois sentidos:

```
sozinho, COM as minhas mudanças   -> 1 skipped
sozinho, com `git stash` (a base) -> 1 skipped
em lote (2887 testes)             -> 1 error
```

Não toquei a aba 02 nem o `controles_vivos.py`. É contaminação por ORDEM — a
mesma família que o `CLAUDE.md` já nomeia (*"nunca rodar pytest junto com a
suíte"*), e já aparecia na primeira volta do lote nesta árvore.

**A batelada:** `pytest tests/unit -k "perfil or perfis or a10 or aba10 or
carona or gesto or modo or jogo"` -> **2884 passed, 2 skipped, 2 xfailed, 1
failed (o meu, declarado), 1 error (o herdado)**, em 153 s.

---

## O que NÃO verifiquei

* **O `--conta-mutacoes` do PILOTO, na página publicada.** Medi 100 pinturas
  na BANCADA, dentro do ensaio (zero mutações). Não rodei o comando do piloto
  porque hoje ele mediria a publicada, onde o quadro não existe. **Quem publicar
  a aba deve rodar `--conta-mutacoes 100` e conferir que o número não subiu.**
* **A lista de jogos com a biblioteca REAL dela.** Todos os ensaios e réguas
  usam catálogo de mentira, por escolha: um instrumento não lê a `steamapps`
  dela. Não sei quantos jogos ela tem hoje nem se algum nome estoura a largura
  do popup do `<datalist>` (que é do navegador, e eu não estilizo).
* **O filtro do `<datalist>` no WebKit.** Provei que o `<input>` acha a lista e
  que as opções chegam ao DOM. **Não** provei como o WebKit filtra enquanto ela
  digita (prefixo de `value`? de `label`? dos dois?) — isso pede um teclado
  sintético e um popup nativo, que a foto não captura.
* **O «Ativar» de ponta a ponta com o daemon vivo.** A bancada estava LIVRE e eu
  não a reservei: o caminho passa por `profile.switch`, que escreve no aparelho
  dela. O que medi foi a leitura — o dublê do marcador em disco, no lugar do que
  o `profile.switch` grava. A cadeia do daemon (`set_active_profile`) está lida
  no código (`daemon/state_store.py:282`), não exercida por mim.
* **A janela em 940x809 e 1212x620 com a TIRA acesa.** A régua mede as três
  janelas em repouso; eu medi a tira só no tamanho do desenho. A barra do
  `.guarda` cobre os três casos por construção, mas o número não foi tirado.
* **Se `<datalist>` tem cara boa no tema escuro dela.** O popup é do navegador e
  não recebe o CSS da página.

---

## O que sobrou para o próximo

1. **A linha em `hefesto_vivo.PERIGOSOS`** (ou o `grava=` quando a ONDA3
   fechar) — bloco [!] no topo. É a única coisa que impede um portão de ficar
   vermelho, e a única que protege o perfil dela da régua de clique.
2. **`a05_vibracao.py:247`** — `return _perfil.ativo(nome) if nome else {}` →
   `return _perfil.ativo(nome)`. Uma linha, e a aba Vibração passa a ver o
   perfil com o daemon calado.
3. **`pacotes/__init__.py:765`** (`pacotes.topo`) —
   `ativo = str(ctx.state.get("active_profile") or "")` →
   `ativo = perfil.nome_do_ativo(ctx.state)`. Uma linha, e o chip "Perfil ativo"
   das DEZ abas para de dizer `—` sobre um perfil que está valendo. **Posse da
   `ONDA3-GESTO-DECLARA-01`.**
4. **As três linhas do CSV da paridade** (384, 358, 378), com o texto pronto
   acima. É da `PARIDADE-REMEDIR-01`.
5. **O `--publicar 10`**, quando ela aprovar a aba. Duas coisas de desenho
   esperam por isso, e o custo da espera está medido em `mockup/DIVERGENCIAS.md`.
6. **O aviso do rádio frágil e o preço da máscara** — as duas frases que saíram
   do quadro pertencem ao canal de recado, e a aba onde a escolha do modo
   VIVO acontece é a Jogar. **RELATO para a `JOGAR-O-QUE-FALTA-01`.**
7. **"O Salvar funde o que as outras abas editaram (o rascunho)"** — é do
   rodapé, e o rodapé é da `ONDA5-07-02` (feita). **RELATO**, como a sprint
   pediu: não construí.
8. **"Tirar este jogo do Steam Input"** — da `STEAM-INPUT-01`. Não construí a
   segunda.
9. **A colisão que a costura vai ver:** a worktree da `ONDA3-GESTO-DECLARA-01`
   tem `a10_perfis.py` modificado (ela põe `grava=` nos decoradores de todas as
   abas). O conflito ali é esperado e é barulho útil.
10. **`ONDA5-10-02` diz `estado: aberta` no frontmatter e o trabalho dela já
    está na base** (commit `77971616`, "o nome do jogo ao lado do campo"). Ou o
    `estado:` ficou para trás, ou sobrou coisa naquela sprint — quem coordena
    decide.
