# ONDA2-07 · A aba LANÇADORES — o reparo manual ganhou caminho, e uma suposição minha caiu

**04/09/2026** · sprint `ONDA2-07-LANCADORES-01` · agente **A7** ·
árvore `hefesto-voo/ONDA2-07-LANCADORES-A7`, branch `voo/ONDA2-07-LANCADORES-A7`.

**Três das quatro decisões fecharam inteiras; a [02] fechou pela METADE, e a
metade que falta não é de escolha — é de POSSE.** As três linhas de MOTOR estão
declaradas com a razão, e nenhuma delas cabia sem tocar arquivo de outra frente.

**A interface nova ganhou o seu primeiro botão de copiar.** Até hoje o cartão da
Steam escrevia *"N jogos com a linha intocável — só reparo manual"* e a frase da
sentinela terminava em *"Reparo manual."* — e `grep -rn WRAPPER_LAUNCH
src/hefesto_dualsense4unix/interface/` devolvia **zero**. A tela mandava fazer à
mão e não dava a mão.

---

## O que mudou

| arquivo | o quê |
| --- | --- |
| `src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py` | `COPIAR`, `COPIAR_ROTULO`, `linha_do_wrapper_html`, o campo `Leitura.linha`, o ramo *"os dois, só quando faz falta"* em `cartao_da_steam`, e as três palavras da decisão [04] |
| `src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py` | `para_a_area_de_transferencia`, o gesto **`copiar-a-linha`**, `COPIADO`, `SEGUNDOS_PARA_COPIAR`, `calados()`, `linha=slo.WRAPPER_LAUNCH` na leitura, `PISO_DA_ABA` 10 → 11, `SEM_ECO` |
| `src/hefesto_dualsense4unix/interface/aba07.py` | a regra `.linha-do-wrapper` na folha da aba |
| `mockup/07-lancadores.html` | regerado — **22 linhas, todas de CSS**. Não publiquei (ver §"o que sobrou") |
| `mockup/DIVERGENCIAS.md` | a seção da 07, com as duas alturas medidas |
| `tests/unit/test_a_aba_07_lancadores_fecha_as_linhas.py` | **novo**, 13 testes |
| `tests/unit/test_a_aba_lancadores_diz_a_verdade.py` | o piso subiu para 11 e o gesto novo entrou na lista dos que só existem na fileira PINTADA |
| `scripts/ensaios/o_botao_copiar_a_linha_no_webkit.py` | **novo** — clica o botão no WebKit vivo e lê a área de transferência de volta |

**TRÊS DELES ESTÃO FORA DA LISTA LITERAL DE `posse:`, e digo qual é a razão de
cada um — a regra é relatar, não esconder:**

| fora da lista | por que mesmo assim |
| --- | --- |
| `interface/desenho_dos_lancadores.py` | é o desenho **exclusivo desta aba**, e as decisões [01] e [04] são texto e botões do cartão, que moram nele. Medido: `grep -rn desenho_dos_lancadores --exclude-dir=.git .` só acha `aba07.py`, `a07_lancadores.py`, as réguas da 07 e um ensaio da 07 — **nenhuma outra frente da ONDA 2 o toca**, e nenhuma sprint desta leva o declara em `posse:` nem em `nao_toca:`. Sem ele, as decisões [01] e [04] não têm onde acontecer |
| `tests/unit/test_a_aba_lancadores_diz_a_verdade.py` | é a **régua desta aba**, e ela reprovaria a cura: o piso de gestos é cravado em `10` e a lista dos gestos que só existem na fileira PINTADA não conhecia o `copiar-a-linha`. Deixá-la de fora entregaria a árvore vermelha |
| `mockup/DIVERGENCIAS.md` | a própria sprint manda escrever a seção (§"as três coisas que você não faz", item 3) |

### [01] o reparo manual sem caminho — **fechada**

*"Os dois, só quando faz falta"* — o botão **«Copiar a linha»** E a linha à
mostra, e **só** no estado em que o cartão já diz «linha intocável».

* o botão entra na fileira do cartão da Steam — **três** botões no estado
  medido (biblioteca em ordem + um intocável), **quatro** quando também há jogo
  reparável, porque aí o `Consertar` e o `Ver o que impede` estão na fileira;
* o bloco `<div class="linha-do-wrapper"><code>…` entra no fim do corpo;
* o gesto põe `steam_launch_options.WRAPPER_LAUNCH` na área de transferência,
  **confere lendo de volta**, e devolve `{"recado": …}` — o canal de sucesso da
  D-01. A tarja diz *"Copiado! Cole em: Steam → jogo → Propriedades → Opções de
  inicialização."*, a palavra que a decisão escreveu;
* quando a leitura de volta não confirma, ele **recusa dizendo** e manda ela ao
  bloco que está logo acima do botão. É por isso que a decisão pediu OS DOIS.

**A LINHA NÃO É REDIGITADA EM LUGAR NENHUM.** Ela é a constante do motor — a
mesma que o `apply_wrapper_to_all_games` grava no vdf e a mesma que o botão da
janela velha copia. O desenho a recebe pelo contrato frio (`Leitura.linha`),
porque `desenho_dos_lancadores` **não importa nada do produto**; sem ela, o
cartão **cala** em vez de oferecer um botão que copiaria o vazio.

**A CONFIRMAÇÃO NÃO É ZELO.** `daemon_actions.on_storm_copy_launch` envolve o
`set_text` num `contextlib.suppress(Exception)` e conclui `copied = True` por
**não ter levantado** — que é outra pergunta: o `set_text` não devolve nada e
ninguém consulta o ambiente. Aqui a leitura de volta é
`request_text` (assíncrono): o irmão dele, `wait_for_text`, **bloqueia rodando
um laço aninhado**, e chamá-lo de dentro de um `idle_add` reentraria no laço da
janela dela no meio da pintura.

### [02] a frase que manda a um botão inexistente — **FECHADA PELA METADE**

A metade que é minha está feita e tem régua: **esta aba não escreve uma segunda
frase** — o texto vem, palavra por palavra, de `home_actions.wrapper_banner_text`.

**A metade que falta é UMA linha, e ela não é desta posse.** Está em
`src/hefesto_dualsense4unix/app/actions/home_actions.py:559-562`:

```python
WRAPPER_MISSING_TEXT = (
    "O jogo está rodando sem o hefesto-launch — controles podem duplicar. "
    "Copie as opções na aba Sistema."          # <- a oração que sai
)
```

A decisão `07[02]` manda a frase **parar de nomear lugar**: fica só o fato, e
quem diz o que fazer é o botão ao lado — em cada tela. A régua que segura o
literal antigo é `tests/unit/test_wrapper_banner.py:84`
(`assert "aba Sistema" in WRAPPER_MISSING_TEXT`), e ela muda no mesmo commit.

**Por que não fiz:** o texto tem UM dono para as DUAS janelas. Escrevê-lo aqui
seria a opção *"duas frases, uma por tela"* — a que a decisão recusa com todas
as letras. E o arquivo não está na minha posse.

**O botão ao lado já existe nesta tela**: com o aviso aceso, o cartão da Steam
oferece o «Consertar» (quando há o que repor), o «Não perguntar para este jogo»
e, no estado intocável, o «Copiar a linha» que nasceu hoje. Do lado da GTK o
botão dela continua onde sempre esteve.

### [03] de onde o aviso some — **FECHADA PELA METADE, e a outra metade é de outra aba**

No cartão está fechada: `calados(lida)` soma as DUAS listas — `dispensados`
(«Não perguntar para este jogo») e `recusados` («Não usar neste jogo», o
`jogos_sem_wrapper.txt`) — e `aviso_do_jogo_aberto` cala para os dois.

Era metade de um par quebrado: a lista `jogos_sem_wrapper.txt` é respeitada pelo
produto **inteiro** no reparo (`reparar_ou_adiar` passa `excluir=censo.recusados`)
e **não calava tela nenhuma**. Ela tirava o jogo de propósito e a tela reclamava
dele toda vez que ele abrisse.

**A coluna Atenção da aba Jogar continua avisando**, e é o que falta:
`src/hefesto_dualsense4unix/app/actions/jogar/painel.py:649` monta
`Aviso("JOGO", home_actions.wrapper_banner_text, …)`, e `wrapper_banner_text` é
função pura do `state` — não consulta lista nenhuma. Deixei a conta pronta e com
nome (`a07_lancadores.calados`) para a outra metade **não a redigitar**; a
leitura das duas listas tem de vir de vigia em segundo plano, como a decisão
declara, e esta aba já tem uma (`a07_lancadores._Vigia`).

### [04] os dois números do cartão da Steam — **fechada**

O corpo passa a dizer *"…está no lugar em N jogos da sua biblioteca **(instalados
ou não)**"*. Três palavras, zero linha nova, nenhum botão. As duas contagens
continuam sendo as que o produto mediu — o que mudou é que a tela agora diz que
elas contam conjuntos diferentes.

---

## Qual mordida prova

**SETE mordidas, e as sete reprovaram.** Com a cura no lugar:
`13 passed` na régua nova, `180 passed` nas sete réguas da aba somadas.

```
1 · o ramo "só quando faz falta" arrancado de cartao_da_steam
    E  AssertionError: o cartão com jogo intocável não traz o botão
       'copiar-a-linha'. O carimbo dele já diz 'só reparo manual' e a tela
       continuaria sem oferecer um caminho para fazê-lo.
    1 failed, 12 passed

2 · o mesmo ramo tornado INCONDICIONAL  (o erro na direção oposta)
    E  AssertionError: o «Copiar a linha» apareceu numa biblioteca em ordem —
       a decisão é «só quando faz falta»
    1 failed, 1 passed

3 · `linha=slo.WRAPPER_LAUNCH` arrancado de `_ler_do_disco`
    E  AssertionError: `_ler_do_disco` devolveu linha=''. Ela tem de ser a
       constante do motor: é a MESMA que o reparo grava no vdf e a MESMA que o
       botão da janela velha copia.
    1 failed, 3 passed

4 · `para_a_area_de_transferencia` passa a dizer sim sempre
    E  AssertionError: copiar o vazio não é copiar
    E  assert True is False
    1 failed, 6 passed

5 · `lida.recusados` fora da conta dos calados
    E  AssertionError: o aviso sobreviveu ao «Não usar neste jogo»:
       '<b>O jogo está rodando sem o hefesto-launch — controles podem
       duplicar. Copie as opções na aba Sistema.</b><br>'. Um aviso que
       sobrevive à resposta dela ensina que o botão não obedece.
    1 failed, 8 passed

6 · o corpo do cartão para de nomear o conjunto
    E  AssertionError: o corpo não nomeia o conjunto: 'Os controles chegam. O
       atalho de inicialização está no lugar em 5 jogos da sua biblioteca.'
    1 failed, 12 passed

7 · a aba passa a redigir a PRÓPRIA frase do aviso  (a régua da [02])
    E  AssertionError: a aba escreveu um aviso que não é o da função dona. O
       dono diz 'O jogo está rodando sem o hefesto-launch — controles podem
       duplicar. Copie as opções na aba Sistema.' e a tela mostra '<b>O jogo
       aberto agora nao passou pelo hefesto-launch. Clique em Consertar.</b>'
    1 failed, 12 deselected
```

**E O ENSAIO TEM MORDIDA PRÓPRIA** (`--sem-cura`, a leitura sem a `linha`):

```
  antes    botões no cartão: ['Abrir o lançador', 'Criar perfil para um jogo']
           «Copiar a linha» no DOM: 0
           bloco à mostra: 'None'
  clique   {'clicou': False}
  área     'None'
OK (mordida): sem a linha, o cartão não oferece o botão nem o bloco — o desenho
cala em vez de inventar.
```

---

## A prova de tela

**Nenhuma janela nasceu na tela dela.** O Chrome roda *headless*; o WebKit do
piloto nasceu no `Xvfb :82` pela guarda TELA-DELA-02 (`[tela] janela desviada
para o Xvfb :82 — a tela dela não recebe nada`). **Não liguei `HEFESTO_NA_TELA`.**

### a foto — antes e depois, medidos

Chrome, 1920×1080, sobre a **bancada**, com a carga que o produto emitiria:

| estado | cartão da Steam | botões | janela | dobra | rolagem lateral |
| --- | --- | --- | --- | --- | --- |
| página estática (`cartoes(None)`) | 144 px | — | 1180×777 | 0 | não |
| **dia bom** (biblioteca em ordem) | **157 px** | Abrir o lançador · Criar perfil | 1180×777 | 0 | não |
| **com jogo intocável** | **231 px** | + **Copiar a linha** | 1180×777 | 0 | não |

O custo da decisão é **74 px, e só naquele estado**. O bloco da linha mede
**523 px** de largura dentro da coluna do cartão, com fundo `rgb(43, 45, 58)`
(o `--elevated` do esqueleto) — sem barra de rolagem lateral em nenhum dos três.

* `ONDA2-07-bancada-dia-bom.png` — o cartão que ela vê no dia bom
* `ONDA2-07-bancada-intocavel.png` — o cartão com o botão e a linha
* `ONDA2-07-webkit-clicado.png` — o **produto vivo**, depois do clique

### o clique — no WebKit vivo, com a área de transferência de verdade

`scripts/ensaios/o_botao_copiar_a_linha_no_webkit.py`:

```
[gesto] 07-lancadores.html · copiar-a-linha → aplicado, e a resposta foi para a tela
  antes    botões no cartão: ['Abrir o lançador', 'Criar perfil para um jogo', 'Copiar a linha']
           «Copiar a linha» no DOM: 1
           bloco à mostra: 'sh -c \'W="$HOME/.local/share/hefesto-dualsense4unix/bin/hefesto-launch'
  clique   {'clicou': True, 'rotulo': 'Copiar a linha'}
  tarja    'Copiado! Cole em: Steam → jogo → Propriedades → Opções de inicialização.'
  área     'sh -c \'W="$HOME/.local/share/hefesto-dualsense4unix/bin/hefesto-launch'

OK: o cartão com linha intocável ofereceu o «Copiar a linha» E o bloco à mostra,
o clique pôs a linha do motor na área de transferência de verdade, e a tarja
disse o que fazer com ela.
```

**A ÁREA DE TRANSFERÊNCIA EXERCITADA É REAL E NÃO É A DELA**, e é a guarda de
tela que torna isso possível: sob o `Xvfb` o `DISPLAY` é próprio, o
`WAYLAND_DISPLAY` sai do ambiente e o `GDK_BACKEND` vira `x11` — a seleção X
daquele servidor é isolada da sessão dela. Nada do que ela tivesse copiado foi
substituído. **É a diferença entre este ensaio e o teste de unidade:** lá a
função é dublê, aqui é a seleção de verdade.

**O que a foto do WebKit mostra e a da bancada não:** a linha aparece **sem a
moldura**, porque a regra `.linha-do-wrapper` está na bancada e a página
publicada ainda não a tem. É a divergência declarada em `mockup/DIVERGENCIAS.md`
— o conteúdo já chega à tela viva (o `-diz` e o `-acoes` são pintados a cada
tique); o que falta até a publicação é só o enquadramento.

---

## O que medi e derrubou uma suposição

**A MINHA PRÓPRIA, e foi o ENSAIO que a derrubou — não o teste.**

Escrevi no gesto que o `gi.require_version("Gdk", "3.0")` era a cura de um
defeito vivo: *"sem esta linha o gesto recusaria SEMPRE, porque o gi escolhe o
GDK 4 e ali `SELECTION_CLIPBOARD` não existe"*. **Medido, arrancando a linha e
rodando o ensaio inteiro: o gesto passa igual** — `rc = 0`, a área de
transferência com a linha, a tarja no lugar. A razão é que `hefesto_vivo`
importa `Gtk` 3.0, o que já carrega o Gdk 3.0 no repositório, e um
`from gi.repository import Gdk` sem versão resolve para o que está lá.

**Mas a linha fica, e agora com o motivo certo escrito:** a falha existe *fora*
do piloto — num processo que chegue ao Gdk **antes** do Gtk, o gi escolhe o mais
novo instalado. Foi exatamente o que este ensaio fez na primeira volta, no
`import` do próprio módulo:

```
gi.RepositoryError: Requiring namespace 'Gdk' version '3.0', but '4.0' is already loaded
```

O comentário do produto foi reescrito com as duas medições — a afirmação que
caiu não ficou ao lado da certa.

**A segunda coisa que a medição corrigiu**, e é do mesmo tipo: escrevi na folha
da aba que o `user-select:text` era obrigatório porque *"o `topo.html` desliga a
seleção na janela inteira"*. `grep user-select src/…/interface/topo.html` devolve
**ZERO**. A regra saiu, e o comentário passou a dizer o que foi medido. No mesmo
passo caiu um `var(--app-bg-2)` que eu tinha escrito: essa variável **não existe**
no `:root` do esqueleto — as três que ficaram (`--elevated`, `--border-sutil`,
`--texto-suave`) foram conferidas antes de escritas.

**A terceira:** a primeira versão do meu instrumento de foto pintava a grade com
`outerHTML` e o piloto usa `innerHTML` (`hefesto_vivo.py:801`). O resultado era
um cartão de **1084 px** de largura — a grade tinha sido destruída, e eu ia
medir o custo da decisão numa página que o produto nunca desenha.

---

## O que sobrou para o próximo

### fora da minha posse — **RELATADO, não editado**

| onde | o quê |
| --- | --- |
| `src/hefesto_dualsense4unix/app/actions/home_actions.py:559-562` | **a decisão `07[02]`**: tirar *"Copie as opções na aba Sistema."* de `WRAPPER_MISSING_TEXT`. A frase fica só com o fato |
| `tests/unit/test_wrapper_banner.py:84` | a régua que exige o literal `"aba Sistema"` — muda no mesmo commit |
| `src/hefesto_dualsense4unix/app/actions/jogar/painel.py:649` | **a outra metade da `07[03]`**: o `Aviso("JOGO", home_actions.wrapper_banner_text, …)` da coluna Atenção não consulta lista nenhuma. A conta já existe pronta em `a07_lancadores.calados(lida)`; falta a vigia em segundo plano do lado da Jogar |
| `src/hefesto_dualsense4unix/interface/hefesto_vivo.py`, no `PERIGOSOS` | **a linha exata:** `("07-lancadores.html", "copiar-a-linha"),`. O gesto **não grava em disco** — mas SUBSTITUI o que ela tiver na área de transferência, e a `--prova-gesto` clica todo `[data-gesto]` que acha |
| `tests/unit/test_todo_gesto_que_grava_esta_protegido.py`, no `ESCREVEM` | a régua está **cega para a área de transferência**: ela só conhece portas de disco, então **não acusou** o meu gesto. Quem acrescentar a porta tem de acrescentar a linha do `PERIGOSOS` no mesmo commit, senão a árvore fica vermelha |
| `src/hefesto_dualsense4unix/app/actions/daemon_actions.py:1355` | a frase *"Copiado! Cole em: …"* é um literal **solto dentro do método**, sem nome. Enquanto for, ela existe duas vezes (lá e em `a07_lancadores.COPIADO`). Extrair a constante na GTK e importá-la daqui apaga a segunda cópia |

### as linhas do CSV que o meu trabalho fechou — **para a ONDA1-X lançar**

**Não toquei `docs/data/paridade-gtk-html.csv`**, e o portão `paridade-gtk-html`
está VERMELHO por causa das duas linhas abaixo. É o vermelho previsto:

| linha | feature | o que mudou | endereço novo, lido no código |
| --- | --- | --- | --- |
| **237** | `[07-lancadores]` Copiar a linha do wrapper para a área de transferência | **FALTA_NO_HTML → fecha.** O HTML passou a ter o botão, e ele copia a MESMA `WRAPPER_LAUNCH` da GTK. A diferença que sobra é de ALCANCE: a GTK oferece o copiar em dois lugares e sempre; o HTML só no estado de linha intocável, que é a decisão `07[01]` | `interface/pacotes/a07_lancadores.py` — `para_a_area_de_transferencia` · `copiar_a_linha` · `COPIADO`; `interface/desenho_dos_lancadores.py` — `COPIAR` · `linha_do_wrapper_html` · `cartao_da_steam` |
| **339** | `[09-sistema]` Steam — "Copiar opções para os jogos" (a linha de inicialização) | **FALTA_NO_HTML → fecha, mas EM OUTRA ABA.** A decisão `07[02]` diz que quem copia na interface nova é a Lançadores; a Sistema continua sem botão de copiar, e agora **de propósito**. Quem reescrever a linha decide se ela migra de aba ou vira SO_NO_HTML na 07 | `interface/pacotes/a07_lancadores.py` — `para_a_area_de_transferencia` |

| linha | feature | o que mudou |
| --- | --- | --- |
| **240** | `[07-lancadores]` Aviso automático "o jogo aberto agora não passou pelo wrapper" | **continua DIFERENTE, e por menos.** O `html_faz` precisa dizer que agora as DUAS recusas calam (`calados`), não só a dispensa. As duas metades abertas viraram uma: a coluna Atenção da Jogar. A decisão `07[02]` **não** fechou — a frase ainda nomeia a aba Sistema |

### as três linhas de MOTOR da sprint — **declaradas, com a razão**

Nenhuma delas cabia sem tocar arquivo de outra posse:

| linha | por que não |
| --- | --- |
| **'Deixar tudo pronto'** — Steam Input + wrapper com UM consentimento (CSV 250) | O modelo é `daemon_actions._build_steam_ready_confirm_dialog:1590`, um diálogo que encadeia DUAS escritas sob um consentimento só. Numa página, consentimento é o botão que muda de rótulo (o `consertar-fechando-a-steam` já é isso) — mas a metade do Steam Input mora em `on_emulation_steam_input_disable` e a linha 254 do CSV a declara **AUSENTE** no HTML. Ligar as duas antes de a primeira existir seria oferecer meio caminho sob um consentimento inteiro |
| **'Este jogo não funciona'** — a allowlist do Steam Input (CSV 251) | `steam_launch_options.add_appid_to_steam_input_allowlist:1411` existe e é chamável daqui. O que falta é **decisão de tela**, não código: em qual linha da lista o botão entra, e o que ele diz — a lista de hoje tem quatro origens (falta o atalho · intocável · você tirou · você dispensou) e nenhuma delas é *"este jogo não funciona"*. Texto de tela e ordem de seção não são meus |
| **Repor o atalho DE CARONA ao Salvar/Aplicar perfil** (CSV 231) | `carona_do_wrapper.pegar_carona_no_gesto:360` é o dono, e quem teria de chamá-lo é o **rodapé** — `interface/pacotes/rodape.py`, gestos `("*", "salvar")` e `("*", "aplicar")`, que são das DEZ abas e não desta. Chamar daqui não repõe nada no gesto dela |

### o desenho

**Não publiquei.** `mockup/07-lancadores.html` mudou 22 linhas, **todas de CSS**,
e a divergência está declarada em `mockup/DIVERGENCIAS.md` com as duas alturas
medidas. O que ela precisa olhar antes de publicar é **um** estado: o cartão da
Steam com jogo de linha intocável.
