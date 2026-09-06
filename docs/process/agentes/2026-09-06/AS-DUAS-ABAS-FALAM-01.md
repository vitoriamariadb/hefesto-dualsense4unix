# AS-DUAS-ABAS-FALAM-01 — o aparelho recebeu, e o perfil não guardou

**06/09/2026 · árvore `AS-DUAS-ABAS-FALAM-01-BDUAS` · branch
`voo/AS-DUAS-ABAS-FALAM-01-BDUAS` · base `eb7b844c`**

Decisão dela, 05/09/2026, sobre a divergência que o handoff mediu entre as abas
02 e 03: **as duas abas falam**. A aba 03 era a que calava — e calava no ramo
em que o gatilho FOI para o aparelho e o perfil NÃO guardou.

## O que mudou

**Um arquivo de produto, quatro passos, e a frase é do dono do assunto.**

**1. `_guardar_no_perfil` devolve frase em vez de sumir.** A assinatura passou
de `-> None` para `-> str`, a mesma de `a06_navegacao._guardar_no_perfil`: `""`
quando gravou (e quando não havia perfil ativo, que continua calado por decisão
dela), e a frase quando havia perfil NOMEADO e o arquivo não abriu. As duas
linhas que sumiam viraram a frase que o ramo irmão já escrevia, com o verbo
trocado:

```
o efeito FOI para o aparelho, mas não consegui ABRIR o perfil 'Personalizado'
para guardá-lo. Ele vale até a próxima troca de perfil — no dia seguinte o
gatilho volta a ser o de antes.
```

**2. `_aplicar` carrega a frase até o recibo, e é ELE quem soma.** O terceiro
elemento da tupla vira `recibo · frase`, pelo `_E_TAMBEM` que o `reenviar` já
usava. A soma mora no `_aplicar` de propósito — **três gestos passaram a poder
dizer a frase sem que nenhum deles mudasse uma linha**: `modo`, `pronto` e
`ajuste`. Uma cura escrita dentro de um gesto cobriria um terço, que é o defeito
que esta casa pagou duas vezes em 05/09.

A segunda metade vem **depois** do recibo, nunca antes: a frase abre pelo que
ela fez.

**3. O `_E_TAMBEM` subiu de junto do `reenviar` para acima do `_aplicar`**, com
o comentário reescrito para nomear os dois donos. Ele já era referenciado de
cima por resolução em tempo de chamada; agora é lido antes do primeiro
chamador.

**4. O canal é o do `recado` verde, e não o do `RuntimeError`.** Um gesto que
fez o que prometeu no aparelho não é recusa — é a mesma escolha que a aba 06
tinha feito, com a razão escrita lá. Medido na tela: `tom: "sucesso"`, cor
`rgb(80, 250, 123)`.

**5. O parágrafo que argumentava pelo silêncio ficou, partido em dois**
(`_guardar_no_perfil`). A metade que vale é **não levanta** — e é ela que
escolhe o canal. A que caducou é **não fala**, com a data e a decisão. O
docstring também declara, e não esquece, a divergência que sobra: o ramo de
ABRIR devolve frase (verde) e o de GRAVAR continua levantando (laranja).
Alinhá-los é outra sprint.

## Qual mordida prova

**MORDIDA 1 — devolvido o `except Exception: return ""`** (o que o código fazia
até hoje). Ela morde em QUATRO lugares:

```
E  AssertionError: a frase não diz as DUAS metades — «o aparelho recebeu · o
   perfil não guardou» é o contrato da D-17, e esta diz:
   'Gatilho esquerdo (L2): Rigid aplicado'
E  AssertionError: o gesto 'modo' calou a segunda metade: …
E  AssertionError: o gesto 'pronto' calou a segunda metade: …
E  AssertionError: o gesto 'ajuste' calou a segunda metade: …
4 failed, 13 passed in 0.58s
```

**MORDIDA 2 — arrancada a soma do `_aplicar`** (devolvendo só o recibo): as
mesmas quatro reprovam, `4 failed, 13 passed`.

**MORDIDA 2b — a cura que alcança só PARTE dos chamadores.** Com a soma
restrita a `lado == "left"`:

```
FAILED …::test_os_tres_gestos_que_gravam_carregam_a_frase[pronto-clique1]
1 failed, 16 passed in 0.52s
```

**É esta que dá valor à parametrização:** uma cura parcial passa em dois terços
da régua, e o que reprova NOMEIA o gesto que ficou de fora.

**MORDIDA 3 — trocado o `guardar=False` do `reenviar` por `True`.** Duas
reprovam, e a segunda mostra o defeito literal na tela:

```
E  AssertionError: o reenviar gravou 2 vez(es) no perfil dela.
E  AssertionError: o reenviar ganhou uma frase de disco: "Gatilho esquerdo (L2):
   Rigid aplicado · o efeito FOI para o aparelho, mas não consegui ABRIR o
   perfil 'Personalizado' … · Gatilho direito (R2): Off aplicado · o efeito FOI
   para o aparelho, mas não consegui ABRIR o perfil 'Personalizado' …"
2 failed, 15 passed in 0.54s
```

Sem a régua 3, o Passo 2 poderia somar uma queixa de disco num gesto cujo
contrato diz *"ELE NÃO GRAVA NADA NO DISCO DELA"* — e ninguém veria, porque o
recibo dele **já é** uma soma pelo mesmo separador.

**MORDIDA NA TELA — a mesma cura arrancada, com a janela oculta e o DualSense
no cabo.** O gesto continua saindo `aplicado`, o gatilho continua indo ao
aparelho, e a tela diz **uma metade só**:

```
[depois] {"recados":[{"texto":"Gatilho esquerdo (L2): Rigid aplicado",
                      "tom":"sucesso","cartao":"p1"}], "modo_na_tela":"Rigid"}
```

É o defeito inteiro numa linha: quem lê conclui que o perfil guardou.

## A prova de tela

Janela `--oculta` (`Gtk.OffscreenWindow`), daemon vivo, **um DualSense no cabo**,
bancada reservada e liberada. **Nada do disco dela foi tocado:** `HOME` e os
quatro `XDG_*` desviados para um lar de mentira no scratchpad, com
`HEFESTO_DUALSENSE4UNIX_SKIP_PRESET_SEED=1`.

**E é esse desvio que PRODUZ o meio-ato**, sem nenhum dublê: o daemon publica
`active_profile = 'Personalizado'` e esse arquivo não existe para o leitor desta
prova — exatamente o caso da §2 da sprint (*"o nome que o daemon publica não
existe para ESTE leitor"*), que na mesa dela é perfil apagado, renomeado ou
noutra pasta.

**O clique é o dela:** um `change` no `<select>` do modo, pela mesma porta que o
`BOOTSTRAP` escuta (`document.addEventListener('change', …, true)`). `el.click()`
num `<select>` não escolhe nada — o dedo dela escolhe uma opção.

| | o que se viu na aba Gatilhos |
| --- | --- |
| **antes** | cartão do P1, L2 e R2 em `Desligado`, **nenhum recado**: `{"recados":[],"modo_na_tela":"Off"}` |
| **o clique** | `[gesto] 03-gatilhos.html · modo → aplicado`; a coluna do L2 abre os Ajustes com `Posição 5 · Força 200` |
| **depois** | recado **VERDE** (`tom: sucesso`, `rgb(80, 250, 123)`) no cartão do P1: *"Gatilho esquerdo (L2): Rigid aplicado · o efeito FOI para o aparelho, mas não consegui ABRIR o perfil 'Personalizado' para guardá-lo. Ele vale até a próxima troca de perfil — no dia seguinte o gatilho volta a ser o de antes."* |
| **desfeito** | último ato manda `Desligado`, que é `trigger.reset` — a porta que LIMPA a trava de troca automática que o `trigger.set` arma |

**O APARELHO RECEBEU, e quem diz é o DAEMON**, não a tela nem o código:

```
SET   ok=True  corpo={'status':'ok','aplicado_em':['<uniq mascarado>'],'guardado_em':[]}
RESET ok=True  corpo={'status':'ok','aplicado_em':['<uniq mascarado>'],'guardado_em':[]}
```

É o mesmo corpo que `_chegou_ao_aparelho` lê para decidir se grava.

**As fotos ficam no scratchpad e NÃO entram no repositório** — elas mostram o
cartão com a identidade do controle dela, e o portão de anonimato não olha
`docs/process/**`.

## A ARMADILHA DE PROCESSO DESTA LEVA: o scratchpad é COMPARTILHADO

Rodei os 43 portões redirecionando a saída para `$SCRATCHPAD/portoes.txt`, que é
o caminho óbvio. **O arquivo que li de volta era de outro agente** — o cabeçalho
dizia `árvore .../PERFIS-SAO-PERFIS-01-BPERF` e `PYTHONPATH .../BPERF/src`, e o
veredito (*"2 vermelhos de 43 → contrato-ipc citacoes-de-linha"*) não era meu.

Medido com `ps`: **quatro agentes desta leva rodando `portoes.sh` ao mesmo
tempo**, e pelo menos três escrevendo em `$SCRATCHPAD/portoes.txt` ou
`portoes.log` — o mesmo diretório, porque o scratchpad é keyed pela SESSÃO e a
leva inteira compartilha uma.

**Se eu tivesse fechado com aquele resultado, teria publicado dois vermelhos
alheios e escondido o meu.** É a armadilha *"medir árvore em movimento"* do
`COMO-EXECUTAR-UMA-SPRINT` §9, com uma causa nova: não é o `PYTHONPATH`, é o
arquivo de saída. **A regra que sobra: o arquivo de saída leva o sufixo do
agente**, como o `BDUAS/` que passei a usar. O mesmo vale para
`/tmp/todos.txt` e `/tmp/lote-*` da receita dos lotes.

## O INSTRUMENTO MEU QUE MEDIU OUTRA COISA

Escrevi no driver da prova uma leitura de `autoswitch_locked` do `state_full`,
para provar pelo daemon que o `trigger.set` tinha rodado — porque
`_handle_trigger_set` termina em `mark_manual_trigger_active("trigger")`.

**Ele ficou `False` nas duas execuções, inclusive com o gatilho comprovadamente
aplicado.** Medido: são DOIS campos diferentes, e o `state_full` publica só um.

* `mark_manual_trigger_active` alimenta `StoreSnapshot.manual_trigger_active`
  (`state_store.py:859`), que **não é publicado** no `state_full`;
* `autoswitch_locked` (`ipc_handlers.py:2229`) é a trava que ELA liga, por
  `set_autoswitch_locked` — outra coisa, com outro dono.

Se eu tivesse escrito "a trava não acendeu, logo o byte não saiu", teria
publicado um achado falso sobre um gesto que funcionou. **Quem respondeu certo
foi o dono do assunto**: o corpo `aplicado_em` da resposta do daemon.

## Os portões

`bash scripts/portoes.sh` na minha árvore, com tudo em `git add`: **1 vermelho
de 43, e ele era meu.**

```
mypy   VERMELHO rc=1
  src/…/pacotes/a03_gatilhos.py:2481: error: Missing return statement  [return]
  Found 1 error in 1 file (checked 302 source files)
```

A assinatura virou `-> str` e o caminho de SUCESSO caía pelo fim da função sem
`return`. **No ato não havia defeito** — `None` é falso e o `if nao_guardou:` do
`_aplicar` o tratava como "nada a dizer" —, mas o contrato estava mentindo. A
cura é a linha explícita, com a razão ao lado: gravou, nada a dizer; quem
responde é a piscada verde da `03-Q4`. Depois dela: `mypy` **Success: no issues
found in 1 source file**, e os 43 fecham verdes.

Os outros 42 passaram nas duas execuções — inclusive `acentuacao` (70 s),
`casa-sabe` (125 s), `anonimato`, `a-tela-dela` e `o-instrumento-e-a-tela`.

## O que NÃO verifiquei

* **A aba 02.** A §5 da sprint mede uma terceira divergência — a 02 levanta
  (`a02_controles.py:2598`) onde a 06 devolve frase — e **não é desta sprint**:
  alinhar a 02 pede as oito réguas dela relidas uma a uma. `a02_controles.py`
  está no meu `nao_toca`.
* **O ramo do `save_profile` desta mesma função.** Ele continua levantando
  `RuntimeError`, isto é, falando pelo canal LARANJA da recusa sobre um gesto
  que funcionou. Está declarado no docstring, com a razão. **Não medi na tela**
  como o cartão dele fica.
* **O `pronto` e o `ajuste` NA TELA.** Os dois têm régua (a parametrizada), mas
  só o `modo` foi clicado na janela — um clique por gesto multiplicaria as
  escritas no aparelho dela sem acrescentar medição sobre a soma, que é do
  `_aplicar` e é a mesma para os três.
* **Dois controles.** A bancada tinha **um** DualSense no cabo, não dois. A
  frase é por cartão (`data-hef-recado` = o controle), e isso a régua cobre;
  **não vi** dois cartões com duas frases ao mesmo tempo.
* **A suíte inteira.** Rodei o meu escopo (95 testes: os seis arquivos que tocam
  a aba 03 e o perfil, mais `test_a_tela_nao_samba.py`). A suíte é de quem
  coordena.

## O que sobrou para o próximo

**1. `mockup/DIVERGENCIAS.md` não é meu — o texto está pronto abaixo.** A frase
nova é texto de tela que o desenho aprovado não tem, e ela nasce do produto, não
do mockup:

```markdown
### 03-gatilhos.html — o recado das duas metades (D-17, 06/09/2026)

O cartão do controle pode mostrar, em VERDE por 6 s, uma frase com duas
metades separadas por `·`:

    Gatilho esquerdo (L2): Rigid aplicado · o efeito FOI para o aparelho, mas
    não consegui ABRIR o perfil 'X' para guardá-lo. Ele vale até a próxima
    troca de perfil — no dia seguinte o gatilho volta a ser o de antes.

O mockup não a desenha porque ela é um DESFECHO, não um elemento: ela só
existe quando o perfil ativo não abre. O canal (`.hef-recado` no cartão) já
está no desenho; o que diverge é o comprimento do texto, que empurra a coluna
do L2 para baixo enquanto vive.

Dono: `interface/pacotes/a03_gatilhos.py::_guardar_no_perfil`.
```

**2. A aba 02 continua levantando onde a 03 e a 06 devolvem frase.** É a §5.2 da
sprint, declarada e não resolvida: `a02_controles.py:2598-2600` levanta
`RuntimeError` no mesmo caso em que a 03 agora fala pelo verde. Depois desta
sprint, **a 02 é a única das três fora do padrão** — e é ela que pinta laranja
sobre um gesto que funcionou.

**3. O ramo do `save_profile` da própria aba 03.** Alinhá-lo ao canal verde é
uma linha; o que custa é reler as réguas do outro ramo
(`test_a_falha_de_disco_diz_as_duas_metades` asserta `pytest.raises`). Fica
junto com o item 2, porque é a mesma decisão.

**4. O `_o_daemon_diz` do driver.** Se alguém precisar provar pelo daemon que um
`trigger.set` rodou, o campo do `state_full` **não serve** — ver a seção do
instrumento acima. O que serve é o `aplicado_em` do corpo da resposta.
