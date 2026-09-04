# ONDA2-01 · A ABA JOGAR — duas decisões fechadas, uma recusada, e um oitavo conflito

**04/09/2026 · agente A1 · árvore `hefesto-voo/ONDA2-01-JOGAR-A1`, branch
`voo/ONDA2-01-JOGAR-A1`.**

**A frase mais curta desta entrega:** das quatro decisões da sprint, **duas
fecharam, uma já estava morta, e a quarta pede na tela uma frase que ELA mandou
tirar em 31/08** — o gerador desta aba tem régua contra essa frase desde então, e
a lista que originou a decisão não podia saber disso. **A frase não foi escrita.**

---

## O que mudou

### 1. [02] O "Player N" esmaece enquanto o jogo não recebeu o controle

**Quatro arquivos, zero pixel de caixa.** O cartão continua dizendo *Player 2* —
a **D-04** dela venceu a minha recomendação e vale (*"Player N, como está
hoje"*). O que sai é o cartão **afirmar** um jogador que o jogo ainda não tem.

O dano é medido, e a medição é de 02/09 na mesa dela:

```
uniq …0003 · bt  · player 1    · player_slot 1 · is_primary TRUE
uniq …00d8 · usb · player None · player_slot 2 · is_primary false   ← "Player 2" assim mesmo
```

| onde | o quê |
| --- | --- |
| `pacotes/a01_jogar.py` | `_jogador_esperando()` — `"1"` só quando `jogador_de` achou número **e** a chave `player` é `None`. Entrou em `POR_CARTAO` como `jogador-espera`. |
| `interface/aba01.py` | o `<b>` do rótulo passou a carregar a CLASSE (`data-campo="jogador-espera"`, alvo `classe`) e o `<span>` de dentro, o TEXTO. Regra de folha `.cartao .rotulo b.espera`. |
| `mockup/01-jogar.html` | regerado. |

**A separação em dois elementos não é gosto:** `escrever()` num elemento com
filho apaga os filhos e força layout — a armadilha medida do piloto da
Controles. E o `player` é lido CRU aqui de propósito: `jogador_de` responde *"que
número o cartão mostra"* (e cai no `player_slot` primeiro); a pergunta desta
função é outra — *"o JOGO já viu este controle?"*.

**Medido na tela**, com o piloto real injetado num Chrome headless:

```
p2_esmaecido      true
p2_texto          "Player 2"          ← a palavra dela FICOU
p2_cor_esmaecida  rgb(154, 158, 184)
p1_cor_normal     rgb(248, 248, 242)
```

### 2. [03] O cadeado da troca automática voltou para a aba Jogar

**Pedido nomeado dela, de 23/07/2026**, que saiu do desenho por escolha minha —
declarada na legenda desta mesma página: *"A caixa saiu — o perfil ativo já diz
isso"*. O que mudou desde então está medido: a coluna **Atenção** passou a ler
`painel.AVISOS_DA_TELA`, e `autoswitch_lock_text` e `texto_do_cadeado_cego` são
duas das seis fontes. **A tela EXPLICA o cadeado e não oferece onde ligá-lo, em
nenhuma das dez abas.**

| onde | o quê |
| --- | --- |
| `interface/aba01.py` | uma `<label class="cadeado">` no rodapé do quadro **Modo**, com `<input type="checkbox" data-gesto="cadeado" data-campo="cadeado" data-hef-alvo="marcado">`. **Fora** das duas seções do interruptor. |
| `pacotes/a01_jogar.py` | `_cadeado()` (leitor) · `@gesto("01-jogar.html", "cadeado")` (escritor) · `PONTE` ganhou `autoswitch_lock_set` · `PISO_DA_ABA` 5 → **6** · uma linha nova em `PROVAS`. |
| `mockup/01-jogar.html` | regerado. |

**O `marcado` é o décimo alvo, da ONDA0-P — e esta é a primeira página a
usá-lo.** Ele é o único que escreve `el.checked`; os outros nove escreveriam a
string `"on"` no `value`, que num checkbox não é o estado.

**O RÓTULO E A DICA SÃO DA JANELA ANTIGA, palavra por palavra** — o
`Gtk.CheckButton` de `home_actions._build_home`. **Não há texto novo de tela
nesta entrega**, e uma régua lê o fonte da GTK e reprova no dia em que as duas
se afastarem.

#### O achado que mudou o desenho do gesto: **um clique chega DUAS vezes**

Medido no navegador, com o `BOOTSTRAP` do piloto injetado e a ponte do WebKit
dublada — um `el.click()` no checkbox produziu **dois** recados:

```
{ "gesto": "cadeado", "tipo": "input", "evento": "click",  "voo": "1" }
{ "gesto": "cadeado", "tipo": "input", "evento": "change", "voo": "2" }
```

O ouvinte único do piloto está em `click` **e** em `change` (o `change` nasceu
para os `<select>` e os campos de texto, que nunca dão clique com o valor novo),
e um `<input type="checkbox">` dispara os dois. **Nenhuma das dez páginas tinha
um checkbox com `data-gesto` até hoje**, então isso nunca tinha aparecido.

Duas consequências, e as duas estão no código:

1. **o valor vai ABSOLUTO, nunca como toggle.** A ponte aceita `locked=None` e o
   daemon inverte sozinho; com dois recados os dois toggles se cancelariam — ela
   clicaria e **nada** aconteceria, que é a queixa dela em estado puro;
2. **o `evento` filtra a segunda entrega**, para o disco dela receber UMA escrita
   por clique (`autoswitch.lock` chama `save_autoswitch_locked`). O `change` é o
   escolhido porque é o único que só dispara quando a caixa de fato MUDOU —
   rótulo, tecla de espaço e `el.click()` sintético passam pelos três caminhos.

**E a verdade volta do daemon:** o alvo `marcado` repinta a caixa a cada tique.
Se a escrita não pegar, a caixa **volta sozinha**. Medido:

```
pintar({mesa:{cadeado:'sim'}})  → caixa marcada
pintar({mesa:{cadeado:''}})     → caixa desmarcada   (1 pintura contada)
```

### 3. [01] fechou pela METADE — e a outra metade **não é minha nem do PO**

A decisão [01] é *"na coluna Atenção, só má notícia: o aviso do Modo Nativo
enquanto ele vigora, e a linha 'Ponte com o jogo' só nos dois desfechos ruins"*.

* **A ponte já estava fechada** antes desta frente (`_aviso_da_ponte`, medida por
  `test_a01_a_ponte_entra_na_coluna.py`). Nada a fazer.
* **O aviso do Modo Nativo NÃO ENTROU, e é decisão dela.** Ver §*O oitavo
  conflito*, abaixo.

### 4. [04] estava morta antes de começar

Conflito **C-7**: a **D-07** já carrega o `+N` na frase da mesa, e
`test_a01_a_mesa_vazia_fala.py` já a mede. Nada a fazer, e nada foi feito — abrir
um segundo canal para o mesmo fato é o que a C-1 e a C-6 recusam.

---

## O OITAVO CONFLITO — e ele não estava na lista dos sete

**A frase que a decisão [01] pede é a que ela mandou tirar desta aba.**

A lista da aba nomeia o texto: *"Alguns jogos derrubam o controle no meio da
partida neste modo"* (`home_actions._MODE_DESCRIPTIONS["native"]`), e argumenta
que *"medido agora, a palavra 'derruba' não aparece uma única vez nas páginas
publicadas"*. **A ausência é a cura, não o defeito.** O gerador desta aba tem
régua contra ela desde 31/08:

```python
# 6-bis. NENHUM ALARME SEM MEDIÇÃO. Ela, 31/08: *"qualquer coisa fora isso
#    tá incorreta"* — a regra do Nativo é só "Desligado põe o Nativo online".
#    As duas frases que caíram alarmavam sobre número que ensaio nenhum deste
#    repositório mede.
for frase in ("derrubam o controle", "resultado é ZERO", "duros como no PS5"):
    exigir(frase not in corpo, f"um texto voltou a alarmar sem medição: {frase!r}")
```

**A forma do conflito é EXATAMENTE a dos sete que o `O-PO-DECIDE-as-54` §1
nomeia:** as dez listas de aba nasceram no mesmo dia que as dezesseis decisões
dela e nenhuma pôde ler as outras. O PO reconciliou as 54 contra **as dezesseis**
— e esta decisão de 31/08 não está lá: ela vive numa **régua de gerador**, que
não é fonte que se leia procurando decisão. Confirmado: `docs/data/decisoes-dela.csv`
não tem linha para ela.

**A regra do próprio documento decide:** *"Onde a recomendação contradiz uma
decisão dela, ela ganha, e eu escrevo o porquê."*

**E havia um caminho para escrever a frase sem a régua ver, o que torna isto uma
armadilha e não um detalhe:** o `_conferir` lê o **HTML estático**, e a coluna
Atenção é escrita em **tempo de execução**. Um agente que cumprisse [01] ao pé da
letra poria na tela dela, em produção, a frase que ela cortou — com o gerador
verde. A régua nova (`test_o_aviso_do_nativo_continua_fora_por_decisao_dela`)
fecha exatamente esse caminho, e ela é uma **lápide com medição**: reprova se a
frase entrar na coluna, e reprova também se a frase sumir da janela antiga (aí a
lápide perdeu o objeto e a decisão precisa ser relida).

**PARA ELA DECIDIR, em uma frase:** *no Modo Nativo, a aba Jogar deve avisar que
alguns jogos derrubam o controle?* Hoje a resposta escrita é **não** — sem
medição, sem alarme.

---

## Qual mordida prova

Sete curas arrancadas, sete reprovações. As saídas, cortadas na linha que
importa.

### 1 · o esmaecido — `_jogador_esperando` → `return ""`

```
E  AssertionError: o cartão do controle que o jogo NÃO recebeu (player=None) não
   esmaece. É o defeito medido em 02/09 na mesa dela: 'Player 2' afirmado com o
   co-op mostrando UM jogador
E  assert '' == '1'
FAILED tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py::test_o_numero_esmaece_so_enquanto_o_jogo_nao_recebeu
```

### 2 · o cadeado com TOGGLE — `locked=None`

Duas réguas independentes, e uma delas é a da casa (`test_os_botoes_tem_dono`):

```
E  AssertionError: cadeado: mandou locked=None, esperava True
FAILED …::test_o_cadeado_manda_o_valor_absoluto_e_nunca_um_toggle
FAILED tests/unit/test_os_botoes_tem_dono.py::test_o_gesto_chama_a_funcao_certa[a01_jogar-cadeado]
```

### 3 · duas gravações num clique — o filtro do `evento` apagado

```
E  AssertionError: o `click` gravou: um clique na caixa grava DUAS vezes no disco dela
E  Left contains one more item: ('autoswitch_lock_set', (), {'locked': True})
FAILED …::test_um_clique_grava_uma_vez_so_no_disco_dela
```

### 4 · o cadeado aninhado numa seção do interruptor — **no HTML**

Esta é a que só o navegador pega: nenhuma contagem de `data-campo` vê a
diferença entre a ordem no arquivo e o aninhamento no DOM.

```
E  AssertionError: o cadeado sumiu com o Hefesto DESLIGADO — ele foi aninhado
   dentro de uma seção do interruptor, e a troca automática de perfil vale nos dois
FAILED …::test_o_cadeado_continua_na_tela_com_o_hefesto_desligado
```

### 5 · o mesmo defeito, **no gerador** — o `_conferir` §11

```
ERRO em 01-jogar — decisão dela desfeita:
  - o cadeado subiu para dentro de uma seção do interruptor — ele sumiria da tela na outra posição
```

### 6 · a lápide do Modo Nativo — a decisão [01] cumprida ao pé da letra

```
E  AssertionError: o aviso do Modo Nativo entrou na coluna Atenção. Ela mandou
   tirá-lo desta aba em 31/08 — 'qualquer coisa fora isso tá incorreta' — e ensaio
   nenhum desta casa mede quantos jogos derrubam o controle. Se a decisão mudou,
   ela muda com o olho DELA, não por baixo do gerador
FAILED …::test_o_aviso_do_nativo_continua_fora_por_decisao_dela
```

### 7 · a folha do esmaecido — a regra `.espera` apagada

A classe acende e **nenhum pixel muda**. É por isso que a medida é `color`, na
tela, e não a presença do atributo:

```
E  AssertionError: o número do jogador ficou na mesma cor com a classe `espera`
   acesa (rgb(248, 248, 242)) — a classe pinta e a folha não responde
```

**Com as sete curas no lugar:**

```
tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py    12 passed
tests/unit/test_os_botoes_tem_dono.py                60 passed
as dez réguas desta aba (test_a01_* · test_a_aba01_* · test_a_aba_01_* ·
test_o_desenho_da_aba01_* · test_a_faixa_de_pendencia_da_jogar)
                                                    104 passed, 1 skipped
com o `test_os_botoes_tem_dono` e o
`test_todo_gesto_que_grava_esta_protegido` juntos  171 passed, 1 skipped
```

O ÚNICO `skipped` É ESPERADO e diz o que estamos fazendo:
*"01-jogar está declarada em trabalho no `mockup/DIVERGENCIAS.md`: o produto
recebe no `--publicar`, que é ato de quem coordena"*.

---

## A prova de tela

**Nenhuma janela nasceu na tela dela.** As duas fotos e o clique saíram de Chrome
headless (`interface/olhar.py` e um script de bancada no scratchpad); o piloto
GTK/WebKit não foi aberto.

| | |
| --- | --- |
| **antes** | `scratchpad/01-jogar-ANTES.png` — `.janela` 1180×777, `passa_da_dobra: 0` |
| **depois** | `scratchpad/01-jogar-DEPOIS.png` — `.janela` **1180×777**, `passa_da_dobra: 0`, sem rolagem lateral |
| **clicado** | `scratchpad/01-jogar-CLICADO.png` — o P2 esmaecido e a caixa do cadeado |

**A caixa da janela não mudou um pixel** com a linha do cadeado dentro: ela coube
na folga que a foto de 04/09 já mostrava embaixo do último quadro.

**O CLIQUE, e ele não é um teste — é o ouvinte do produto:** o `BOOTSTRAP` de
`hefesto_vivo.py` foi injetado no Chrome com a ponte do WebKit dublada, e o
`el.click()` no checkbox produziu os dois recados colados acima, com
`gesto: "cadeado"`. A volta do Python (`window.__hef.pintar`) marcou e desmarcou
a caixa e esmaeceu o P2 sem trocar a palavra.

**POR QUE NÃO PELO PILOTO DE VERDADE:** ele abre a página **PUBLICADA**
(`onde.pagina(..., publicado=True)`), e esta leva **não publica** — a sprint
proíbe, e é a `PROVA-DE-TELA-01`. O `mockup/DIVERGENCIAS.md` declara as duas
mudanças na seção da `01-jogar.html`, com o que ela precisa olhar antes de
publicar.

---

## O que NÃO verifiquei

* **Nada foi clicado contra o daemon vivo.** O gesto `cadeado` grava no disco
  dela (`save_autoswitch_locked`), e clicá-lo de verdade mudaria uma preferência
  dela. **A bancada não foi pedida e não foi usada.** O que está provado é a
  chamada à ponte, com dublê, e o caminho DOM→gesto no navegador — não o
  round-trip até o daemon.
* **Não medi o cadeado na janela publicada**, porque ele não está lá (ver acima).
* **Não medi a aba com CINCO controles nem com a mesa vazia** nesta frente — quem
  responde por esses dois estados é `test_a01_a_mesa_vazia_fala.py`, que já
  existia.
* **Não conferi o esmaecido no cartão que REABRE.** O lugar vazio (`cartao off`)
  não tem `data-campo` nenhum no rótulo — nem `jogador`, nem `identidade`, nem
  `bateria` —, então o `jogador-espera` segue a mesma forma. Ver o relato abaixo.
* **A suíte inteira não foi rodada** — é de quem coordena, e roda no fim.

---

## O que sobrou para o próximo

### RELATOS DE OUTRA POSSE — três, e o primeiro é o mais grave

**1. `hefesto_vivo.PERIGOSOS` precisa de `("01-jogar.html", "cadeado")`** — e
`hefesto_vivo.py` está em `nao_toca`.

O gesto **grava no disco dela**: `autoswitch.lock` →
`utils/session.save_autoswitch_locked` (`ipc_handlers.py:2536`). Sem a linha, a
régua de clique (`--prova-gesto`, `--prova-no-aparelho`) **muda uma preferência
dela para provar que sabe clicar** — que é literalmente o estrago que a lista
PERIGOSOS existe para impedir, e que já ficou para trás de uma cura três vezes em
03/09.

**2. `test_todo_gesto_que_grava_esta_protegido.py` NÃO PEGA ESTA PORTA** — e é a
razão de o item 1 não ter sido acusado por régua nenhuma. As duas listas dela
(`ESCREVEM`, `METODOS_QUE_ESCREVEM`) não conhecem `autoswitch_lock_set` nem
`autoswitch.lock`. **Acrescentar `"autoswitch_lock_set"` a `ESCREVEM` fecha a
lacuna e faz a própria régua acusar o item 1.** O arquivo não é desta posse.

*Enquanto os dois não fecharem, o risco está contido por acidente:* a caixa vive
só na bancada, e o piloto abre o publicado. **Quem publicar a `01` fecha os dois
ANTES.**

**3. `pacotes/ponte.py` — `autoswitch.lock` não tem teto em `TETOS`.** O
`autoswitch_lock_set` do bridge usa `_safe_call` com o padrão de 250 ms, e desde
o `BUG-IPC-READ-NO-TIMEOUT-01` esse teto cobre também a LEITURA da resposta. O
handler grava um arquivo em disco: sob carga, a chamada pode voltar `None` com a
escolha JÁ gravada. **Nesta aba o dano é pequeno** (o gesto não lê o retorno, e o
tique repinta do daemon em 500 ms), mas é a mesma família da dívida que a
`mascara_do_controle` declarou e a ONDA0/ponte fechou com uma linha.

### A LISTA DAS LINHAS DO CSV — para a ONDA1-X lançar

**Não toquei em `docs/data/paridade-gtk-html.csv`**, e por isso o portão
`paridade-gtk-html` está **VERMELHO nesta árvore, por desenho**: ele reprova
justamente quando uma dívida fecha. O achado dele é este, e está correto:

```
divida-fechada: paridade-gtk-html.csv:30  [01-jogar] O cadeado 'Não trocar de perfil sozinho ao abrir um jogo'
  o sinal 'Não trocar de perfil sozinho ao abrir um jogo' APARECEU em
  src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py.
```

| linha | feature | era | vira | o endereço novo |
| --- | --- | --- | --- | --- |
| **30** | O cadeado 'Não trocar de perfil sozinho ao abrir um jogo' | `FALTA_NO_HTML` | **`IGUAL`** ao publicar (hoje: no pacote e na bancada) | `pacotes/a01_jogar.py` (`_cadeado`, `@gesto cadeado`, `CADEADO_ROTULO`) · `mockup/01-jogar.html` (`data-campo="cadeado" data-hef-alvo="marcado"`, `data-gesto="cadeado"`) |
| **19** | O número do jogador no cartão | `DIFERENTE` | **decisão DELA** (como a D-04 e a D-11), não dívida | `pacotes/a01_jogar.py` (`_jogador_esperando`, `POR_CARTAO`) · `interface/aba01.py` (`.cartao .rotulo b.espera`) |
| **10** | A descrição do modo escolhido | `DIFERENTE` | **fica DIFERENTE, e vira decisão dela** — ver *O oitavo conflito*. A metade "Ponte com o jogo" fechou na linha 27; a metade do aviso do Nativo é escolha dela de 31/08 | `interface/aba01.py:_conferir` §6-bis (a régua) · `tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py` (a lápide) |

**A linha 27** (*A linha 'Ponte com o jogo'*) já estava fechada antes desta
frente, por `_aviso_da_ponte` — se ainda estiver como `FALTA_NO_HTML`, é lançamento
atrasado de outra leva, não desta.

### AS LINHAS DE `MOTOR` QUE NÃO COUBERAM, com a razão

**"O modo e a máscara escolhidos entram no perfil que ela salva"** (CSV
`01-jogar`, `FALTA_NO_HTML`) — **NÃO FEITA, e não por fôlego: por POSSE.**

O consumidor é `pacotes/rodape.py` (`_draft_do_ativo`, `rodape.salvar`), que monta
o rascunho do perfil no disco + o que o daemon publica, sem modo nem máscara.
`rodape.py` **não está nos quatro arquivos desta sprint**, e a escolha pendente
(`_ESCOLHA`/`_ROTULO`) é dicionário de módulo lido só dentro do `a01_jogar`.

**A cura é de duas mãos e mora nos dois lados:** o `a01_jogar` expõe a escolha
pendente (uma função pura), e o `rodape._draft_do_ativo` a lê. Uma frente que
possua os dois arquivos fecha isso em poucas linhas. **Escrever metade aqui
deixaria um exportador sem leitor** — que é a "cura escrita e nunca ligada" que
esta casa nomeia como o defeito mais caro depois do instrumento falso.

### O QUE VI E NÃO É DESTA FRENTE

**O cartão que REABRE volta mudo.** O `hefesto_vivo` reabre um lugar vazio
(passo 1c) pondo `data-conectado="sim"` e tirando a classe `off`, mas o rótulo do
`cartao off` do gerador **não tem `data-campo` nenhum** — nem `jogador`, nem
`identidade`, nem `bateria`. Quem ligar um terceiro controle com a aba já aberta
ganha um cartão aceso com três travessões. É a mesma família do defeito que a
régua §7 do `_conferir` fechou para os chips de máscara em 03/09 (*"o lugar vazio
ficava sem endereço de propósito, e no produto o cartão REABRE"*) — e ali a cura
foi cobrar o endereço nos QUATRO lugares. **Não fiz** porque mexer no cartão
vazio muda o desenho dos dois lugares apagados, e isso é desenho para o olho
dela, não endereço invisível. Fica para a frente que reabrir esse assunto com
ela.

---

## Os portões

```
git add -A && bash scripts/portoes.sh
…
REPROVOU: 1 vermelho(s) de 40 -> paridade-gtk-html
```

**39 de 40 verdes**, e o único vermelho é o esperado: `paridade-gtk-html` existe
para acusar quando uma dívida FECHA (*"quando alguém FECHAR uma dívida, ele
reprova para o dado ser atualizado; sem isso o número vira propaganda no dia
seguinte à primeira cura"*). A dívida fechou, e o CSV tem **um dono nesta leva**,
que não sou eu. A linha a reescrever, com o endereço novo lido no código, está em
*A LISTA DAS LINHAS DO CSV*, acima.

Verdes de nota, porque cobrem o que esta frente mexeu: `desenho-aprovado`
(bancada × publicado, com a `01` declarada em `DIVERGENCIAS.md`),
`identidade-de-cima`, `regua-de-tela`, `ruff`, `mypy`, `acentuacao`,
`referencias-docs`, `anonimato`, `casa-sabe` e `citacoes-de-linha`.

**Um detalhe para quem costurar:** o `scripts/costurar.sh` monta o caminho da
entrega a partir da BRANCH (`voo/ONDA2-01-JOGAR-A1` → `ONDA2-01-JOGAR-A1.md`), e
a sprint nomeia este arquivo **`ONDA2-01.md`** — que é o nome que o portão
`referencias-docs` confere, porque a sprint o cita. Mantive o nome da sprint.
Quem rodar a costura precisa saber disso; duplicar o arquivo para agradar aos
dois seria criar a segunda versão viva que esta casa persegue.
