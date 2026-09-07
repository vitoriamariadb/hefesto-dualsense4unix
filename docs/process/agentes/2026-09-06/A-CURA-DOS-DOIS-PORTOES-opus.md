# A-CURA-DOS-DOIS-PORTOES — os dois vermelhos do LOTE-2, e a régua que confundia a PALAVRA com o ATO

**06/09/2026 · branch `voo/A-CURA-DOS-DOIS-PORTOES-01-opus` · nasceu de `ae1c3d82`**

Os dois portões que o LOTE-2 deixou vermelhos em `onda/atual-0609` não tinham
duas causas. **Tinham uma:** as duas réguas perguntavam se o nome do dono
*aparecia no arquivo* — texto cru, docstring e comentário junto — em vez de
perguntar se ele era **chamado**. É a família de defeito que esta casa mais
paga, e o próprio `paridade-gtk-html.csv` já a tinha registrado **duas vezes**,
com estas palavras: *"A régua leu a palavra e contou como ato."*

**E o enunciado desta tarefa estava errado num ponto, o que é parte da
entrega.** Ele dizia que `paridade-gtk-html` *"se contradiz — o texto diz 'isto
NÃO é rc=1' e o processo sai com 1"*. **O código nunca fez isso.** `avisos`
nunca tocou o `rc`, em nenhuma versão. O que mentia era a **ordem da saída**, e
ela mentiu tão bem que produziu este diagnóstico. Está curada, e a §2 mostra.

| portão | estava | está |
| --- | --- | --- |
| `donos-de-comportamento` | rc=1, e **pelo motivo errado** | rc=0 — e agora pega o que deixava passar |
| `paridade-gtk-html` | rc=1, e **pelo motivo certo, ilegível** | rc=0 — reprovação e aviso não se confundem mais |

---

## O que mudou

### 1. `donos-de-comportamento` — a régua passou a ler o código, e achou o inverso do que acusava

O portão acusava a linha 47 (`migrar_para_systemd`) de *"a tela nova já chama
`on_daemon_migrate_to_systemd`"*. **A tela nova não chama — ela SOLETRA**, em
dois docstrings de `a09_sistema.py` que contam de onde o gesto veio. Medido:
`_referencias()` do arquivo não tem esse nome; `texto` tem.

Então `_cita` deixou de ser `simbolo in texto` e passou a ler o código com o
`ast` (nome, atributo, import — nunca docstring, comentário ou string). **A
mesma troca que apagou o falso vermelho revelou um falso VERDE**, e este é o
achado que não estava no enunciado:

> **`donos-de-comportamento.csv:4` — `transporte.palavra_curta` estava `CURADO`
> sobre uma ponte que tinha CAÍDO.** A costura da ONDA B levou a palavra curta
> para `home_actions.palavra_do_transporte` (decisão D-05 dela), e o CSV
> continuava apontando para `pacotes.VIA_DO_TRANSPORTE`. O portão dava verde
> porque o nome velho sobrevive num **comentário** de `mesa_viva.py:382` que
> conta a história. **É exatamente a regressão que a regra 2 existe para pegar,
> e ela passou por cima.**

O produto já tinha escrito o aviso. O docstring de
`mesa_viva._via_do_transporte` diz, palavra por palavra: *"em 05/09/2026 um
comentário que o soletrou já foi lido como uso"*. **Uma régua que conta prosa
como tráfego pune quem escreve bem** — e esta casa cita endereços de propósito.

**Três mudanças, então:**

* `_referencias()` (com cache por arquivo — sem ele o portão reparsearia
  `interface/` uma vez por linha) e `_cita` em cima dela;
* **linha 4** — dono corrigido para `app/actions/home_actions.py:palavra_do_transporte`,
  que `mesa_viva.py` importa e chama de verdade;
* **linha 47** — `SO-GTK` → `CURADO`, `onde_html` = `a09_sistema.py:corrigir_modo`.

**O dono da 47 NÃO é `on_daemon_migrate_to_systemd`, e a razão é medida:** aquele
símbolo é o **invólucro GTK** do ato — recebe `Gtk.Button`, roda num executor,
responde por `GLib.idle_add` —, e não há como a tela nova o chamar. O que viajou
foi o ato (`corrigir_modo`, os três tempos na ordem da janela antiga, nenhum
reescrito). O que a ponte carrega, e o que alguém **redigitaria** ao recriar
isto, são as duas frases de recibo — `MIGRAR_DEU_CERTO` e `MIGRAR_NAO_DEU` —,
que saíram de dentro do `_on_migrate_done` no mesmo commit justamente para não
haver duas. **É por elas que o portão cobra agora.**

**E uma trava nova, que nasce em zero:** `CURADO` sem `onde_html` reprova. A
regra 2 só corria quando a coluna estava preenchida, então *"curei, e não digo
onde"* era a saída da única régua que cobra a cura. Nenhuma das nove de hoje faz
isso — a trava custa nada agora, e custa caro depois.

### 2. `paridade-gtk-html` — o portão era honesto; a ORDEM da saída é que mentia

Medido antes de acreditar no enunciado: `avisos` é uma lista à parte, `falhas` é
a que devolve `1`, e as duas nunca se tocam. **O `rc=1` vinha de dois achados
`divida-fechada` legítimos**, impressos vinte e cinco linhas abaixo do aviso.

O que o `portoes.sh` mostrava era isto, nesta ordem:

```
paridade-gtk-html      VERMELHO rc=1   228 ms
    AVISO: 6 célula(s) …
           … isto NÃO é rc=1.
```

**A leitura óbvia — e a que foi feita, e escrita nesta tarefa — é que o portão
reprova pelo próprio aviso que ele declara não ser reprovação.** Um portão
honesto que se lê como desonesto gasta o mesmo tempo de quem o audita. Curado:

* a **FALHA fala primeiro** e declara `ISTO é o rc=1 deste portão`;
* o **AVISO fala por último**, e acrescenta `Nenhuma linha abaixo entra no rc`;
* e uma linha final diz de onde o `rc` veio:
  `rc=1 por 3 FALHA(s); os 6 AVISO(s) acima não contam.`

**Os dois achados eram verdadeiros, e as duas dívidas fecharam mesmo** (06/09,
`SISTEMA-OS-QUATRO-QUE-FALTAM-01`). Remedidas e reescritas para `DIFERENTE`:

| linha | fechou como | e o sinal |
| --- | --- | --- |
| `:315` "Corrigir modo de execução" | `corrigir_modo:2473` — lê o pid, ESPERA o avulso sair, sobe a unit | era `on_daemon_migrate_to_systemd`, **que só existe em docstring ali** → passa a `corrigir_modo`, que é uma `def` |
| `:343` "Restaurar de fábrica" | `restaurar_de_fabrica:2581`, e `SEM_MOTOR` ficou vazia | fica `_meu_perfil_asset` e troca de lado — desta vez ele **aparece em código**, na chamada da linha 2632 |

A `:315` é a **terceira vez** que uma leitura de palavra derruba essa linha (as
outras duas estão no `porque` dela, de 03/09). Agora a causa está curada do lado
do dono: o sinal deixou de ser o nome do invólucro e passou a ser o ato.

A frase *"os onze `@gesto` foram lidos um a um e nenhum é este"*, escrita em
06/09 pela `PARIDADE-REMEDIR-01`, **caducou no mesmo dia em que foi escrita**: o
décimo segundo é.

E a regra 8 cobrou o resto, como devia — a tabela publicada em
`2026-09-03-O-TERCEIRO-NUMERO` foi atualizada (`09-sistema` e `TODAS`):
**33 `FALTA_NO_HTML` · 156 `DIFERENTE`**, a paridade fica em 36%.

### 3. As treze `SO-GTK`, uma a uma — o enunciado mandou conferir, e mandou bem

Eram 13. **Uma era mentira (a 47) e as outras doze continuam verdade.** Medido
contra a página publicada e o pacote da aba, não só contra a chamada do dono —
um comportamento pode ter sido **recriado** sem ninguém chamar o dono, e é isso
que o portão não sabe ver:

| # | comportamento | ainda é `SO-GTK`? |
| --- | --- | --- |
| 37 | `jogo.o_que_chega` | sim — nada equivalente em `interface/` |
| 38 | `mascara.custo` | sim, **e por decisão dela** (10-Q6, 05/09: as frases de limitação saem) |
| 39 | `mascara.divergencia` | sim |
| 40 | `grab.aviso` | sim |
| 42 | `reconciliar.recado` | sim — a 01 tem `reconectar`, não `reconciliar` |
| 43 | `speaker.devolver_posse` | sim, **e por decisão dela** (31/08 tirou o botão) |
| 45 | `exame.ver_o_que_foi_calado` | sim |
| 46 | `exame.ordem_ja_movi` | sim |
| **47** | **`migrar_para_systemd`** | **NÃO — virou `CURADO`** |
| 48 | `perfil.editor.modo` | sim — o editor tem 5 campos, nenhum é o modo |
| 49 | `perfil.editor.avancado` | sim — nem `window_class`, nem `window_title_regex`, nem `process_name` |
| 50 | `perfil.renomear_ou_copiar` | sim, **com um fato substituído** ↓ |
| 51 | `perfil.queda_de_prioridade` | sim |

**A 50 tinha um fato caduco, e ele foi substituído, não anotado ao lado.** A
razão dizia *"não há como pedir uma cópia mantendo o antigo"* — e há: o gesto
`duplicar` (`a10_perfis.py:3046`) copia o perfil inteiro por `model_copy`. **O
veredito não muda**: o que continua só na janela é a **desambiguação no
Salvar** (o R-10), que é o que evita os dois arquivos ficarem no disco com o
mesmo `match` e a mesma prioridade, disputando as mesmas janelas. Duplicar é
outro caminho, num outro momento.

---

## Qual mordida prova

**`donos-de-comportamento` — três mordidas, três vermelhos, `rc=1` conferido.**

| arranco | o que o portão diz |
| --- | --- |
| dono da linha 4 volta a `VIA_DO_TRANSPORTE` | `:4 transporte.palavra_curta: CURADO, mas interface/mesa_viva.py não cita mais 'VIA_DO_TRANSPORTE' — a ponte para o dono caiu de novo` |
| dono de uma `SO-GTK` apontado para um símbolo **realmente chamado** | `:38 mascara.custo: marcado SO-GTK, mas a tela nova já chama 'palavra_do_transporte' em … — reclassifique` (`rc=1`) |
| `onde_html` de uma `CURADO` apagado | `:47 migrar_para_systemd: CURADO sem 'onde_html' — não há o que conferir, e a cura fica sem régua` |

A segunda é a que importa: **endurecer a régua não a fez parar de morder.** Ela
deixou de acusar prosa e continua acusando chamada.

E a prova de que o endurecimento mudou o veredito, e não só o texto — as duas
execuções sobre o **mesmo CSV de partida**:

```
régua velha (texto) → VERMELHO na linha 47   ← prosa lida como chamada
régua nova  (ast)   → VERMELHO na linha  4   ← a ponte que tinha caído
```

**`paridade-gtk-html` — os dois lados, porque um portão que deixa de reprovar é
pior que um que reprova demais.**

| lado | o quê | resultado |
| --- | --- | --- |
| **A** | o estado curado, com os **6 avisos legítimos** impressos | **`rc=0`** — o aviso não derruba |
| **B1** | desfaço a cura da `:315` (volta a `FALTA_NO_HTML`) | **`rc=1`**, 3 achados, e a última linha: *"rc=1 por 3 FALHA(s); os 6 AVISO(s) acima não contam"* |
| **B2** | a mordida do próprio cabeçalho — troco `CAUSA_ATRASADA` | **`rc=1`** — as células de aviso viram FALHA, o escape do `nao-medido` está vivo |

O lado A é a resposta ao enunciado, em uma linha: **seis avisos impressos, `rc=0`.**

---

## O que NÃO verifiquei

* **Não endureci a régua de `paridade-gtk-html`,** e é decisão, não esquecimento.
  Ela procura o sinal em `.py`, `.html`, `.glade`, `.css`, `.js` e aceita
  endereços de tela (`data-campo="fragil"`): **o `ast` não é o instrumento
  desse domínio**, e trocar substring por AST ali silenciaria as linhas
  não-Python — que é o defeito pior. Ela continua podendo ler prosa como ato,
  e o `porque` de `:315` agora carrega essa cicatriz pela terceira vez. **É a
  dívida mais clara que esta tarefa deixa.**
* **Não abri a tela.** Nada aqui muda produto — mexi em duas réguas e em três
  planilhas de laudo. Nenhum pixel, nenhum gesto, nenhum `data-campo`.
* **Não conferi as 12 `DUPLICATA` nem as 16 `DIVERGE`** do mapa dos donos. O
  enunciado pediu as `SO-GTK`, e o teto da dívida (2.397) continua intacto.
* **Não remedi as 6 células de aviso** do mapa de canais. São da bancada
  (`SPECS-A-PROCEDENCIA-01`), e o mapa informa, nunca veta.
* **Não reancorei endereços históricos** das colunas `gtk_onde` além do único
  que reescrevi (`daemon_actions.py:2409` → `:2452`, onde o handler está hoje).

## O que sobrou para o próximo

1. **A régua da paridade ainda confunde palavra com ato** (acima). A forma que
   sobrevive ao domínio poliglota provavelmente não é AST, é **ignorar
   docstring, comentário e string por lexer** antes de procurar o sinal — e aí
   ela cobre `.py` e `.html` com a mesma lente.
2. **As doze `SO-GTK` continuam sendo a fila da §4 do laudo dos donos**: *migra,
   ou morre com a janela*. Duas já têm decisão dela para **morrer** (38 e 43) e
   nunca foram escritas como tal — hoje elas se leem como trabalho pendente. Um
   veredito `SAI-POR-DECISAO-DELA` tiraria as duas da fila sem apagar a medição.
3. **Cinco das doze são do editor de perfis** (48–51 mais a 50), e uma delas —
   `perfil.editor.avancado` — **fecha a porta para 7 dos 9 perfis de fábrica**.
   É a maior das que sobram, e não é desenho: são três campos que não existem.
