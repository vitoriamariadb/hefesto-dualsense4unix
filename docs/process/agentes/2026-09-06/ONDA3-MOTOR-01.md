# ONDA3-MOTOR-01 — o `— Nada —` cala, e o atalho dela sobrevive ao Guardar

**Agente BMOTOR · árvore `hefesto-voo/ONDA3-MOTOR-01-BMOTOR` · branch
`voo/ONDA3-MOTOR-01-BMOTOR` · base `onda/atual-0609` (`eb7b844c`, a costura da
ONDA A).** Bancada: **não usada** — nenhum caminho parou o daemon nem escreveu
no aparelho. Tela: **não aberta** — esta sprint não muda um pixel, e os quatro
arquivos de tela estão no `nao_toca:`.

---

## O que mudou

| o quê | onde |
| --- | --- |
| `_dominio_do_teclado()` + `DOMINIO_DO_TECLADO` — o domínio de `key_bindings`, DERIVADO | `core/acoes_de_botao.py:338`, `:364` |
| `_tabela_efetiva(escolhas, key_bindings)` — as TRÊS camadas na ordem do produto | `core/acoes_de_botao.py:367` |
| **`botoes_calados(escolhas, key_bindings)` — a quinta PORTA** | `core/acoes_de_botao.py:410` |
| `resolver(escolhas, key_bindings=None)` — a herança, sem mexer na aridade do retorno | `core/acoes_de_botao.py:445`, `:485` |
| `set_button_actions(do_mouse, calados=None)` — a sacola que faltava | `integrations/uinput_mouse.py:289`, `:335-338` |
| `apply_button_actions` passa `profile.key_bindings` e a sacola dos calados | `profiles/manager.py:673-680`, `:700` |

### 1 · O `— Nada —` que não calava seis linhas

**A causa, medida:** `do_mouse` **não distingue "não é do mouse" de "foi
calado"**. `set_button_actions` reconstruía os dois mapas do DE FÁBRICA menos
`do_mouse` (`uinput_mouse.py:335-338`), e um botão em `— Nada —` nunca entra em
`do_mouse` — o `resolver()` o pula de propósito. Logo ele não era subtraído e
**voltava ao valor de fábrica**.

Escapavam SEIS dos vinte e dois: as quatro direções do d-pad (`DPAD_TO_KEY`), o
Círculo e o Quadrado (`EDGE_KEY_MAP`).

**A cura explica o que já funcionava.** Os outros dezesseis calavam por outra
via, e a cura não a tocou: `_mapa_botoes` e o `set_bindings` do teclado virtual
são SUBSTITUÍDOS inteiros — o que não está na sacola não está no device. É o que
`test_o_que_ja_calava_continua_calando` cobra, botão a botão.

### 2 · O `resolver()` que não herdava `key_bindings`

**A causa:** `apply_button_actions` roda DEPOIS do `apply_keyboard` e reescreve
o conjunto INTEIRO do teclado virtual com o que o `resolver()` deriva — e o
`resolver()` partia de `padrao()` e **nunca consultava `profile.key_bindings`**.
Um perfil com `button_actions` preenchido apagava, a cada ativação, todo atalho
que ela escreveu à mão na janela antiga. Em silêncio, com os dois campos
continuando a aparecer no arquivo dela.

**A camada do meio**, em `_tabela_efetiva`:

```
1. o de fábrica     derivado dos quatro mapas do produto
2. key_bindings     o que ela escreveu na janela ANTIGA
3. button_actions   o que ela escolheu na tela NOVA
```

`None` HERDA e `{}` ESVAZIA — a mesma distinção do esquema
(`profiles/schema.py:1324-1326`) e a mesma que `resolve_key_bindings`
(`profiles/manager.py:1878`) aplica ao device. **Ela não mescla com o de
fábrica**, e isso é medido e não escolhido: `resolve_key_bindings` devolve só as
chaves do dict, e é ele quem alimenta o device no `apply_keyboard`. Mesclar aqui
faria esta tabela discordar do device que ela mesma reescreve um método depois —
que é o defeito inteiro.

**O `r3` FICA DE FORA sozinho, e é por isso que o domínio é DERIVADO.** Ele está
nos dois lados (`BUTTON_TO_UINPUT` diz `BTN_MIDDLE`, `DEFAULT_BUTTON_BINDINGS`
diz "fechar o teclado na tela") e o produto faz **os dois** — a colisão que
`keyboard_mappings.py:56-62` registra. Perguntar ao de fábrica em vez de digitar
a lista é o que impede a camada de comer o Botão do meio dele. Medido:
`DOMINIO_DO_TECLADO == frozenset(DEFAULT_BUTTON_BINDINGS) - {"r3"}`, oito botões.

**A porta é PORTA, não quarta posição na tupla.** Mesma razão medida da
`acao_do_ps` na ONDA5-06-01: três chamadores desempacotam três sacolas, e
devolver quatro viraria `ValueError: too many values to unpack` na aba que ela
abre hoje. `resolver(escolhas)` sem o segundo argumento é o contrato de antes,
byte a byte — e há régua cobrando isso.

---

## As três mordidas, coladas

**1 · Tirar o `and b not in mudos` das duas compreensões de
`set_button_actions`.** Reprovam 7 casos, e cada um nomeia o botão E a tecla que
continuou saindo:

```
E  AssertionError: circle está em “— Nada —” e o device emitiu
E  [('KEY_ENTER', 1), ('KEY_ENTER', 0)]: a escolha dela foi confirmada na tela
E  e o botão continuou fazendo o que fazia
E  AssertionError: dpad_down está em “— Nada —” e o device emitiu
E  [('KEY_DOWN', 1), ('KEY_DOWN', 0)]: …
7 failed, 8 passed
```

**2 · Apagar o bloco `if key_bindings is not None:` de `_tabela_efetiva`.**

```
E  AssertionError: o atalho que ela escreveu à mão não chegou ao device:
E  ('KEY_LEFTMETA',)
E  assert ('KEY_LEFTMETA',) == ('KEY_F1',)
E  AssertionError: ela esvaziou o teclado na janela antiga e o `button_actions`
E  ressuscitou ['create', 'l1', 'l3', 'options', 'r1', 'touchpad_left_press',
E  'touchpad_middle_press', 'touchpad_right_press']
3 failed, 12 passed
```

**3 · Tirar `profile.key_bindings` e a sacola da chamada em
`apply_button_actions`** — o elo, e ele é o que ela sente:

```
E  AssertionError: o `apply_button_actions` apagou o atalho que ela escreveu à
E  mão: options virou ('KEY_LEFTMETA',)
1 failed, 14 passed
```

**A RÉGUA MEDE O APARELHO, NÃO A TELA** — e é a exigência da sprint. Ela emite
evento num `UinputMouseDevice` de verdade com o `uinput` dublado e lê **o que
saiu**; uma régua que lesse a tela daria VERDE, porque a tela já dizia a verdade
sobre os dois defeitos. O dublê do `uinput` só conhece `KEY_*`, `BTN_*` e
`REL_*`: um objeto que respondesse a qualquer atributo imitaria um device que
sabe tudo.

---

## O que eu medi e derrubou uma suposição

**A régua da aba 06 continua VERDE — e é porque ela chama o método antigo.**
`test_a_aba_06_navegacao_fecha_as_linhas.py::test_o_que_o_nada_nao_cala_e_dito_e_o_produto_e_quem_decide`
chama `UinputMouseDevice.set_button_actions(device, do_mouse)` com um argumento
só, então o device dela não sabe dos calados e o `ainda_falam` continua com os
seis. **Ela passou a medir o mundo de ontem no instante da cura** — não por erro
de quem a escreveu (ela prevê a cura, e tem a asserção pronta para o dia), mas
porque o caminho de verdade ganhou um argumento que ela não passa.

**E a tela dela vai OVER-AVISAR até a frente da 06 fechar.**
`a06_navegacao._mapas_que_sobrevivem_ao_nada()` (`:1120`) devolve
`frozenset(DPAD_TO_KEY) | frozenset(EDGE_KEY_MAP)` — uma **cópia da regra**, não
uma pergunta ao device. Com a cura, os seis calam e a tira continua dizendo que
não calam. É prosa errada, não comportamento errado, e o lado seguro: avisar de
uma perda que não acontece mais é melhor que perder calado.

---

## O que sobrou para o próximo — e a §1 é para a NAVEGACAO-TECLAS-01

### 1 · O que a NAVEGACAO-TECLAS-01 pode contar

**O motor guarda e aplica o que a tela gravar em `button_actions["<botão>"]`
para as vinte e duas linhas, e `— Nada —` agora CALA as vinte e duas — inclusive
as quatro direções do d-pad, o Círculo e o Quadrado.** E `Profile.key_bindings`
deixou de ser apagado pelo Guardar: as três camadas são o de fábrica, os atalhos
da janela antiga e a escolha da tela nova, nessa ordem, e a última vence.

Endereços: `core/acoes_de_botao.resolver(escolhas, key_bindings)` e
`core/acoes_de_botao.botoes_calados(escolhas, key_bindings)`. Quem já chama
`resolver(escolhas)` com um argumento não muda de resposta.

### 2 · Os três lugares de outra posse que a cura tornou fecháveis

| onde | o que fazer, medido |
| --- | --- |
| `interface/pacotes/a06_navegacao.py:1120` `_mapas_que_sobrevivem_ao_nada` | passa a devolver `frozenset()` — ou, melhor, morre junto com a frase "ainda não cala" da tira e com o `teimosos` de `_linhas_que_nao_acendem` (`:1139`) |
| `interface/pacotes/a06_navegacao.py:1188` `atalhos_que_param_de_valer` | `acoes.resolver((p or {}).get("button_actions"))` → `acoes.resolver((p or {}).get("button_actions"), (p or {}).get("key_bindings"))`. **A prosa do `:1179` diz que esta função "morre sozinha" quando o `resolver()` herdar — ela NÃO morre**: o chamador é que precisa passar o campo. Fato a substituir |
| `docs/data/paridade-gtk-html.csv:213` | a linha `06-navegacao,Convivência entre key_bindings (GTK) e button_actions (HTML)` está **fechável**: o achado que ela guarda era exatamente esta cura. O endereço novo é `core/acoes_de_botao.py:367` (`_tabela_efetiva`) e `profiles/manager.py:679` |

### 3 · O GÊMEO deste defeito, medido e NÃO curado

Um botão do d-pad, do Círculo ou do Quadrado posto num comando **sem atendente**
(`Abrir a Steam`, `Sair do modo jogo`, `Escolher um programa…`) vai para a
terceira sacola do `resolver()` — e **continua emitindo o de fábrica**, pela
mesma linha de código que este relatório curou. Medido:

```
escolhas = {"dpad_up": "__STEAM__", "circle": "__SAIR_DO_JOGO__"}
sem_dono          = ['circle', 'dpad_up']
_mapa_dpad ainda  = ['dpad_down', 'dpad_left', 'dpad_right', 'dpad_up']
_mapa_tap ainda   = ['circle', 'square']
```

**Não o curei de carona**, e a razão é a regra da casa: seria a segunda cura
escondida dentro da primeira, e ela muda comportamento que a sprint não pediu —
hoje a tira da aba 06 já promete que essas linhas "não acendem nada", então
calá-las alinharia a tela com o produto, mas é decisão de produto e é sprint
própria.

### 4 · Um fato envelhecido em `profiles/schema.py:1326`

O comentário do campo diz `{"triangle": ["KEY_C"]} = override apenas desse
botão; demais seguem default`. **`resolve_key_bindings` não mescla com os
defaults** (`profiles/manager.py:1878-1895`): um dict parcial devolve só as
chaves que estão nele, e é ele quem alimenta o device. As duas afirmações não
cabem juntas; a do código é a que vale. Arquivo de outra posse — listado, não
editado.

---

## O estado ao fechar

* **`bash scripts/portoes.sh`: TODOS VERDES — 43 portões**, `rc=0`.
* **Escopo largo, com a árvore parada: 2.783 verdes, 1 pulado, 4 xfail** em 144
  arquivos de teste (tudo que cita `acoes_de_botao`, `button_actions`,
  `key_bindings`, `uinput_mouse`, `ProfileManager`, `apply_keyboard`,
  `set_bindings`, `a06_navegacao` ou `aba06`). **Não rodei a suíte inteira** — é
  de quem coordena.
* **Os 8 vermelhos do escopo são todos declarados e nenhum é meu:**
  * **7** são as réguas da tela da `ONDA5-06-02`, exatamente a lista que a
    `ONDA5-06-01` deixou escrita — *"o produto tem 22 linhas e o desenho tem
    21"*. Não toquei em nenhuma.
  * **1** é `TestTodaCitacaoDeLinhaConfere`, com **16 endereços deslocados que
    são byte a byte os da base `eb7b844c`** — medidos com os meus três arquivos
    trocados pelos do `HEAD` e comparados linha a linha (`diff` vazio). Os
    **8 que EU desloquei** (+22 linhas em `profiles/manager.py` e em
    `integrations/uinput_mouse.py`) estão fechados: **2 corrigidos no lugar**
    (`core/acoes_de_botao.py`, `manager.py:1856`→`:1878` e
    `uinput_mouse.py:355`→`:377`) e **6 declarados em `_CITACOES_PENDENTES`**
    com o número certo medido, porque moram em arquivo do `nao_toca:` ou de
    outra posse.
* `ruff check src/ tests/` limpo · `mypy src/hefesto_dualsense4unix`: 302
  arquivos sem queixa.

---

## As duas armadilhas deste turno

**1 · O DUBLÊ MAIS ESTREITO QUE A FUNÇÃO REAL DÁ "falhou" EM VEZ DE ERRO.**
`DeviceDeMentira` em `test_o_que_cada_botao_faz_tem_campo.py` tinha
`set_button_actions(self, do_mouse)`. A chamada nova viraria `TypeError` — que o
`apply_button_actions` engole no `except Exception` e relata como `"falhou"`. O
teste não estouraria com traceback: ele diria que o produto falhou ao aplicar. É
a mesma família que a casa já pagou três vezes, e a assinatura do dublê foi
alinhada com a real, com a razão escrita ao lado.

**2 · O PORTÃO DAS CITAÇÕES DE LINHA JÁ ESTAVA VERMELHO NA BASE — com 16.** A
`ONDA5-06-01` o deixou verde e a costura da ONDA A o pôs em 16. Se eu tivesse
lido o vermelho como meu, teria "consertado" endereços de `a10_perfis.py` e de
`aba10.py` que não têm nada com esta sprint. **O jeito de saber é medir a base**:
trocar os arquivos de posse pelos do `HEAD`, rodar o portão e comparar as duas
listas. Só assim os oito que eram meus apareceram.
