# CONTROLES-VERDADE-01 — a linha que ela mandou tirar, e a que faltava no lugar dela

**06/09/2026** · agente `C-CONTROLES-VERDADE-01`, árvore
`hefesto-voo/CONTROLES-VERDADE-01-C-CONTROLES-VERDADE-01`, branch
`voo/CONTROLES-VERDADE-01-C-CONTROLES-VERDADE-01`.
Nasceu em `3f6855a6` e foi **adiantada para `ec35e970`** no meio do trabalho —
ver §7.

---

## 0. A ENTREGA EM UMA LINHA

**A sprint pedia a LINHA DA VERDADE no cartão. A medição derrubou o pedido: ela
saiu da tela por decisão dela em 17/08/2026.** O que estava faltando no mesmo
lugar era a linha do **giroscópio**, que é a que a GTK dela mostra hoje — e o
que a tela nova mostrava no lugar dela era um **número de catálogo**. Essa é a
entrega, mais **um defeito vivo** que a costura da ONDA B abriu hoje, calado.

---

## 1. O ENUNCIADO ESTAVA ERRADO, E CORRIGI-LO FOI A ENTREGA

A sprint tem cinco linhas no §1. Medidas uma a uma **antes** de escrever código:

| linha da sprint | o que eu medi |
| --- | --- |
| **Linha da verdade** — "o que chega ao jogo" | **NÃO SE CONSTRÓI** — ver abaixo |
| **Título do card** com transporte e jogador | o jogador **saiu do título por pedido dela**; o transporte já fechou em 04/09 — mas havia um **defeito vivo** (§3) |
| **Badge de degradação** | **JÁ ESTAVA FEITO** desde 04/09 (`mascara-degradou` ← `pacotes.degradacao_de`) |
| **Giroscópio ~N Hz** | **ERA A DÍVIDA VIVA**, e é o que entrou |
| **Barra de luz**, as quatro situações | **JÁ ESTAVA FEITO** (`luz-porque` ← `rotulo_lightbar`, decisão [02] de 04/09) |

### A linha da verdade saiu da tela por decisão dela — 17/08/2026

O `porque` da linha 56 do `paridade-gtk-html.csv` diz, e a segunda metade
derruba a primeira:

> *"Falta, mas **NÃO é dívida de migração**: na GTK ela também não está na tela
> desde 17/08/2026, por decisão dela (**"remover guia dos status em tempo
> real"**) — o widget é criado e alimentado e nunca empacotado
> (controller_card.py:2896). **Reconstruí-la no HTML seria reintroduzir o que
> ela mandou tirar.**"*

Conferido no fonte, e o comentário do motor é explícito
(`controller_card.py:2916`):

```
# **A linha da verdade não é empacotada por ninguém, em lugar nenhum.**
# Ela é criada aqui, alimentada por `_update_verdade` e não chega à tela
# desde 17/08/2026, quando a SEM-BARRA-DA-VERDADE-01 a tirou da faixa a
# pedido dela. Quem ocupa a faixa ao lado da bateria é o `_motion_label`.
```

E `controller_card.py:2770`: *"A linha da verdade continua existindo,
alimentada e fora da tela — **é decisão dela de 17/08, e não se apaga**."*

**Quem OCUPA aquele lugar na GTK dela é o `_motion_label`** — a linha do
giroscópio. A sprint mandava dobrá-la para dentro da linha da verdade; o certo
era o contrário.

### A dívida viva era a linha 55, e ela não espera palavra dela

Das quatro linhas dessa família no CSV, **só a 55 e a 56 não têm segunda metade
`||`**. A 44 (título) diz `SAI DO BALDE DESENHO em 04/09 — FECHOU`; a 54
(badge) e a 64 (barra de luz) dizem `DECIDIDO em 04/09 — Não espera mais
palavra dela`. A 56 é a que ela removeu. **Sobra a 55**, e o `porque` dela é:

> *"O número que responde 'o giroscópio está chegando ao jogo AGORA' não existe
> do lado HTML. **O que a tela mostra é um número de catálogo**, igual para todo
> controle e todo momento."*

Medido: a dica do interruptor de Giroscópio, no mesmo cabeçalho, afirma **"No
cabo são 250,0 Hz exatos"** — com o controle dela parado ou fluindo, no cabo ou
no rádio. É exatamente o *"não crave número"* que o Passo 3 da sprint proíbe,
já vivo na tela.

**Foi essa que entrou.**

---

## 2. O QUE FECHOU

### `giro-no-jogo` — o hertz medido, no vão do cabeçalho

`texto_motion` (`controller_card.py:1212`) é o dono, com as **duas exceções**:
Modo Nativo (*"o jogo fala direto com o controle"*) e máscara Xbox 360 (*"a
máscara Xbox 360 não tem giroscópio"*). Sem espelho vivo o dono devolve `None`,
e a linha **some** — o silêncio é a resposta certa, e é decisão medida do motor:
acusar "sem giroscópio" em todo card seria ruído crônico.

**O LUGAR FOI MEDIDO ANTES DE ESCOLHIDO.** Com a janela do produto (1212px)
sobravam **410px** entre o nome da máscara e o par de sensores — o maior vazio
do card, segurado pelo `margin-left:auto` do `.sensores-peca`. Uma linha nova no
CORPO custaria altura, e **a conta não tem folga**: `PARA_O_CARD` (328) menos
`ALTURA_DO_CARD` (304) são **24px**, com um `assert` que é portão. Medido depois:
o card continua com **348px, o mesmo de antes**. Custo de altura: **zero**.

**DOIS ELEMENTOS, UM ENDEREÇO SÓ.** O de fora veste o `title` (alvo `atributo`),
o de dentro recebe o texto. Dois `data-campo` para o mesmo fato podem DIVERGIR
na tela; um `achar()` com o mesmo valor não pode. **E o de fora é quem esconde**:
o alvo `atributo` remove o `title` quando não há frase, e o `:not([title])` da
folha apaga o elemento — o vão volta a ser vão.

### A palavra do transporte, e o defeito vivo que ela cura

`a02_controles.py:1800` usava `VIA_DO_TRANSPORTE` — a sigla de máquina — no
cabeçalho do cartão. O glossário de hoje proíbe `USB`/`BT` em texto de tela; na
tela é **cabo** e **rádio**. Curado com `home_actions.palavra_do_transporte`.

**MAS O ESTRAGO ERA MAIOR QUE A PALAVRA.** Duas linhas abaixo, o campo `peca`
compara `nome_na_tela == via_na_tela` para não escrever o transporte duas vezes
no mesmo cabeçalho. A costura da ONDA B fez `identidade_de` cair na PALAVRA DA
TELA no último degrau — e a comparação passou a ser entre `"rádio"` e `"BT"`,
**que nunca casam.** Medido nesta árvore, antes da cura:

```
transport='usb'   identidade_de='cabo'    via_na_tela='USB'   → peca='cabo'
transport='bt'    identidade_de='rádio'   via_na_tela='BT'    → peca='rádio'
```

O cabeçalho de um controle sem cor lida — **a mesa dela pelo rádio é exatamente
este caso** — lia `P2 • rádio • BT`. O comentário do próprio bloco já nomeava o
defeito (*"o cabeçalho leria `BT • BT`"*), e a guarda que ele descrevia tinha
deixado de valer **no mesmo dia em que foi escrita**.

A cura pergunta ao próprio `identidade_de` qual é o último degrau — a forma que
a `a09_sistema` adotou na ONDA4-S10, e a razão dela vale aqui inteira: *"um
conjunto de palavras é uma cópia da tradução"*.

### O que NÃO construí, e a régua que segura a decisão

`test_a_linha_da_verdade_continua_fora_do_cartao` reprova se qualquer campo do
cartão emitir a frase que ela removeu. É o único aviso que existe contra
desfazer uma decisão dela por leitura de meia célula.

---

## 3. QUAL MORDIDA PROVA CADA CURA — oito, com a saída colada

Log completo em `<scratchpad>/CONTROLES-VERDADE-01/mordidas.txt`.

| # | o que arranquei | o que reprovou |
| --- | --- | --- |
| 1 | a chamada ao dono virou literal no pacote | 5 réguas: *"o cartão parou de ler o dono"*, *"as três situações colapsaram em 1 frase"*, o hertz cravado, as duas exceções |
| 2 | a exceção do **Modo Nativo** do dono | `test_a_excecao_do_modo_nativo_chega_ao_cartao` — o cartão CALA no modo em que o giroscópio chega inteiro |
| 3 | a exceção da **máscara Xbox** do dono | `test_a_excecao_da_mascara_xbox_chega_ao_cartao` — *"a máscara Xbox não mudou uma palavra"* |
| 4 | a sigla de máquina **e** a comparação contra ela (o estado exato de antes) | `'USB' == 'cabo'`, `'BT' == 'rádio'`, e **o defeito vivo**: *"o cartão escreveu 'cabo' como NOME de um controle que só tem transporte — o cabeçalho diria o transporte duas vezes, ao lado de 'USB'"* |
| 5 | emiti no cartão **a linha que ela mandou tirar** | *"a linha que ela mandou tirar em 17/08/2026 voltou ao cartão, em ['luz-porque']"* |
| 6 | o `[title]` da regra do card aberto | *"sem `title` a linha continuou ocupando o cabeçalho"* (`block` ≠ `none`) |
| 7 | o `ellipsis`+`nowrap` | *"a frase mais larga do dono ocupou 3.0 linhas no cabeçalho"* |
| 8 | dei `data-campo` próprio ao elemento de dentro | *"tem 1 elementos com o endereço `giro-no-jogo`; são dois"* |

As mordidas 2 e 3 tocam `controller_card.py`, que **não é desta posse** — foram
temporárias e o arquivo voltou com **0 linhas de diff**, conferido com
`git status` depois de cada uma. A bancada também foi restaurada **byte a
byte** depois das mordidas 6, 7 e 8.

### DUAS RÉGUAS MINHAS NASCERAM FALSAS, e as duas pela mesma forma

**`test_a_frase_mais_larga_do_dono_cabe_em_uma_linha` passou com a cura
arrancada — DUAS VEZES.**

* **Primeira versão:** olhava a ALTURA DA FAIXA e a DIREITA DA CAIXA. As duas
  são seguradas por outra coisa — o `flex:0 0 var(--h-acao)` é altura fixa e o
  `min-width:0` já impede o transbordo lateral. E a sonda usava
  `'x'.repeat(400)`: uma corrida de caracteres **sem espaço não tem onde
  quebrar**, então fica numa linha com ou sem a cura.
* **Segunda versão:** passou a medir LINHAS e a usar a frase mais larga do dono
  — e continuou vazia, porque com os **410px** de hoje aquela frase cabe
  inteira. A cura ficava sem exercício.
* **Terceira:** aperta o vão a 120px antes de medir. Aí ela morde (3,0 linhas
  contra 1,0), e o caso não é hipotético — o vão encolhe com o nome do plástico,
  com a máscara e com a largura da janela dela.

**E uma MORDIDA nasceu falsa**, o que é diferente: a primeira tentativa da
mordida 5 usou um `python -c` cuja âncora não casou, e o "passou" era o teste
medindo código intacto. Refeita com `assert` na âncora, ela reprova.
*Régua que passa com a cura arrancada não mede nada — e mordida que não aplicou
não mordeu.*

---

## 4. A PROVA DE TELA, E A CONTAGEM DE MUTAÇÕES

Tudo headless, Chrome do sistema, `chromium.launch` sem `headless=False`.
**Nenhuma janela nasceu na tela dela**, e o piloto GTK não foi aberto.

### A FOTO — antes e depois, medida

| | antes | depois |
| --- | --- | --- |
| cabeçalho do card aberto | `Cosmic Red • USB · DualSense` | `Cosmic Red • cabo · DualSense · Giroscópio: fluindo para o jogo (~250 Hz)` |
| linha fechada do P2 | `P2 • Starlight Blue • BT` | `P2 • Starlight Blue • rádio` |
| `data-campo="via"` | `['USB', 'BT']` | `['cabo', 'rádio']` |
| altura do card | 348px | **348px** |
| vão livre do cabeçalho | 410px | ocupado pela frase, sem `ellipsis` |

### O CAMPO MUDANDO — o dublê muda, o cartão muda

Não há clique nesta linha (é leitura), então a prova é o campo acompanhando o
dublê: `motion_hz` 250 → 61 muda a frase; `native_mode` e a máscara Xbox trocam
a frase inteira; sem espelho a linha some. As quatro estão nas réguas.

### AS MUTAÇÕES, com o `BOOTSTRAP` do piloto de verdade

100 tiques, o mesmo observador de DOM, a bancada no Chrome:

```
MESA PARADA (o mesmo valor, 100 tiques)      0 mutações,   0 nós
GIROSCÓPIO VIVO (o número muda todo tique)  196 mutações, 198 nós
   99  giro-x:childList
   96  giro-x-pos:attributes/style
SÓ O HERTZ OSCILANDO (a linha nova)         201 mutações, 200 nós
   99  giro-no-jogo:attributes/title
   99  giro-no-jogo:childList
```

**A ABA 02 NÃO SAMBA — e a pergunta do despacho tem resposta medida.** O
despacho perguntava se o `childList` com ~2 nós por mutação era *"a tela
trocando o BLOCO inteiro para mudar um número"*. **Não é:** 198 nós em 99
mutações são **2 nós por mutação** — o nó de texto velho sai, o novo entra, que
é o mínimo que o DOM cobra por um número que mudou. O ramo `texto` do
`escrever()` compara antes de escrever (`hefesto_vivo.py:714`) e o ramo
`largura` também, e é por isso que **a mesa parada dá ZERO**. Não há o que
curar: as 236-273 mutações que o despacho mediu são **movimento real de um
giroscópio e de um acelerômetro vivos**.

**O CAMPO NOVO CUSTA ZERO NA MESA PARADA** e 2 mutações por troca real da frase
(o `title` e o texto, que é o preço do desenho de dois elementos).

---

## 5. O QUE NÃO VERIFIQUEI

1. **Não abri o piloto GTK, e não medi contra o daemon vivo.** Duas razões
   medidas: abrir o piloto dispara as migrações one-shot no `~/.config` real
   dela; e o **daemon instalado é mais velho que esta árvore** — ele responde
   `método desconhecido: state_full` ao IPC, e a mesa está com **zero
   controles** agora. A cadeia foi provada até `window.__hef.pintar` com o
   `BOOTSTRAP` de verdade.
2. **NÃO MEDI SE O HERTZ REAL FAZ A DICA PISCAR**, e é o risco que sobra. O
   `title` só muda quando a frase muda, mas a frase carrega `~{hz:.0f}` — e um
   hertz que oscile em cima de um inteiro trocaria o `title` a cada tique, que
   é o defeito que a `A-TELA-SAMBA-01` curou hoje (*"a dica abria e morria antes
   de ela conseguir ler"*). **Não é a mesma família do NAO-DANCA-01**: aqui a
   frase não pode mover um pixel (`nowrap` + cabeçalho de altura fixa +
   `ellipsis`), então o layout está estruturalmente seguro. O que falta medir é
   só a dica. **O comando é o de sempre, com um DualSense na mesa e o daemon
   desta árvore:** amostrar `rumble_ff.per_vpad[].motion_hz` por 5s e contar
   quantas vezes `f"{hz:.0f}"` troca. Se trocar muito, a cura é do DONO
   (`texto_motion`), não desta aba — e ela é um degrau de arredondamento.
3. **Não publiquei.** `interface/paginas/02-controles.html` está intacto, e
   **isso é dobrado**: o `_so_se_a_pagina_tiver` do pacote pergunta ao
   PUBLICADO, então o campo `giro-no-jogo` **nem é emitido** no produto que ela
   roda hoje. Nada do que fiz alcança a tela dela antes do `--publicar 02`.
4. **Não medi a `fita-via` do topo.** Ela ainda desenha `USB`/`BT` (§6).

---

## 6. O QUE RELATO E NÃO FIZ — com o diff pronto

### 6.1 `mockup/DIVERGENCIAS.md` — texto pronto para colar

O arquivo é **posse declarada do coordenador na costura**. A seção
`## 02-controles.html` ganha:

> - **06/09/2026 — A LINHA DO GIROSCÓPIO ENTROU, E A DA VERDADE NÃO.** O
>   cabeçalho do card aberto ganhou o número que responde *"o giroscópio está
>   chegando ao jogo AGORA?"* — `Giroscópio: fluindo para o jogo (~N Hz)`, do
>   dono `controller_card.texto_motion`, com as duas exceções (Modo Nativo e
>   máscara Xbox 360). O que ele substitui é um **número de catálogo**: a dica
>   do interruptor de Giroscópio afirma *"No cabo são 250,0 Hz exatos"* para
>   todo controle e todo momento.
>
>   **Ela mora no vão do cabeçalho, e custa ZERO altura.** Medido: 410px de
>   vazio entre a máscara e o par de sensores, e o card continua com os mesmos
>   348px. Sem frase, o `title` some e a folha apaga o elemento. A conta do card
>   tem 24px de folga (`PARA_O_CARD` 328 − `ALTURA_DO_CARD` 304), e uma linha no
>   corpo os teria gasto.
>
>   **E O CABEÇALHO PASSOU A FALAR A LÍNGUA DA TELA:** `USB`/`BT` viraram
>   **cabo**/**rádio**, do dono `home_actions.palavra_do_transporte`. Isso curou
>   um defeito vivo aberto pela costura da ONDA B no mesmo dia — um controle sem
>   cor lida (a mesa dela pelo rádio) lia `P2 • rádio • BT`, o transporte duas
>   vezes em dois dialetos.
>
>   **A LINHA DA VERDADE NÃO ENTROU, e é decisão dela:** ela saiu da tela da GTK
>   em 17/08/2026 (*"remover guia dos status em tempo real"*) e continua criada
>   e alimentada fora da tela. Há régua que impede a volta
>   (`test_a_linha_da_verdade_continua_fora_do_cartao`).
>
>   **O que ela vê HOJE, até publicar:** exatamente a aba de ontem. O campo novo
>   não é sequer emitido — o `_so_se_a_pagina_tiver` pergunta ao publicado.
>
>   **O que fecha:** o `--publicar 02` quando ela aprovar a aba.

### 6.2 `docs/data/paridade-gtk-html.csv` — é `nao_toca` nesta sprint

Duas linhas mudam de veredito. **A 55 fechou:**

```
veredito : FALTA_NO_HTML → IGUAL
sinal    : _update_motion → texto_motion
html_onde: src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py:2207 ·
           src/hefesto_dualsense4unix/interface/aba02.py:1228
html_faz : Mostra "Giroscópio: fluindo para o jogo (~N Hz)" no vão do cabeçalho
           do card aberto, com o hertz do `rumble_ff.per_vpad` e as duas
           exceções (Nativo e máscara Xbox). Sem espelho vivo a linha some.
porque   : || FECHOU em 06/09/2026 — CONTROLES-VERDADE-01. O que a tela mostrava
           era o número de catálogo da dica do interruptor ("No cabo são 250,0 Hz
           exatos"), igual para todo controle e todo momento; agora o número é
           lido. A linha mora no vão de 410px do cabeçalho e custa zero altura.
```

**A 56 NÃO fecha e ganha a segunda metade que faltava:**

```
porque   : (…texto atual…) || CONFIRMADO em 06/09/2026 — CONTROLES-VERDADE-01. A
           sprint pedia esta linha e a medição derrubou o pedido: `controller_
           card.py:2916` diz que ela é criada, alimentada e NUNCA empacotada
           desde 17/08, e `:2770` que a decisão é dela e não se apaga. Quem ocupa
           aquele lugar na GTK é o `_motion_label` (linha 55), que foi o que
           entrou. Há régua que impede a volta:
           test_a_linha_da_verdade_continua_fora_do_cartao.
```

**A 44 e a 64 já estão fechadas no código e o veredito envelheceu** — a 44 diz
`FECHOU` na segunda metade e continua `FALTA_NO_HTML`; a 54 (badge) idem. São da
`PARIDADE-REMEDIR-01`.

### 6.3 O glob da guarda do import — o diff que o coordenador pediu

`tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py` não é desta posse.
**`aba02.py` JÁ TEM a guarda** (`if __name__ == "__main__":`, linha 3273),
conferido. O diff que amplia o glob para as dez:

```diff
-    for gerador in sorted(INTERFACE.glob("aba0[45].py")):
+    for gerador in sorted(INTERFACE.glob("aba[01][0-9].py")):
```

### 6.4 O ÚNICO VERMELHO QUE SOBRA É HERDADO

`test_a_palavra_do_transporte_tem_um_dono_so.py:140` —
`N802 Function name test_a_mesa_do_DESENHO_tambem_publica_a_chave_crua should be
lowercase`. Ele **nasceu na base desta branch** (o commit do coordenador que
curou a contagem zerada do cabeçalho) e não toca nenhum arquivo desta posse. O
diff é uma palavra: `_DESENHO_` → `_desenho_`. Medido antes e depois da minha
entrada no índice: **o mesmo, e é o único vermelho da árvore**. Os meus três
`N802` e um `E501` — todos nascidos nesta entrega, por nomes de teste com
palavra em caixa alta — foram curados aqui.

### 6.5 A fita do topo ainda desenha a sigla

`data-campo="fita-via"` no `mockup/02-controles.html` sai `USB`/`BT`, porque a
fita vem de `monta.MESA`, que ainda traz `"via": "USB"` ao lado do `"transporte":
"usb"`. **O produto já escreve `cabo`/`rádio` ali** (o pacote lê
`mesa_viva.via`, que é a palavra do dono desde a costura de hoje) — logo o
DESENHO e o PRODUTO discordam neste endereço, nas dez abas. `monta.py` não é
desta posse. O diff é de três linhas em `monta.MESA`:

```diff
-     "via": "USB", "transporte": "usb",
+     "via": "cabo", "transporte": "usb",
-     "via": "BT",  "transporte": "bt",
+     "via": "rádio", "transporte": "bt",
```

A contagem do topo (`2 USB · 0 BT`, a exceção dela) **não é afetada**: ela já lê
`transporte` desde `monta.py:1581`.

### 6.6 Um `docstring` do `mesa_viva` que a medição contradiz

`mesa_viva._via_do_transporte` afirma *"A AUSÊNCIA CONTINUA DEVOLVENDO `""` — a
tela mostra travessão"*. Medido: o corpo é `return palavra_do_transporte(
transporte)`, e para ausência isso devolve **`"não sei por onde"`**, nunca `""`.
Um fato errado num comentário, e o arquivo não é desta posse.

---

## 7. O QUE ACONTECEU COM A ÁRVORE, E AS ARMADILHAS DO DIA

**A branch nasceu 2 commits atrás e foi adiantada no meio do trabalho.** O
coordenador avisou que `monta.MESA` tinha ganho a chave crua `transporte`;
medido nesta árvore, ela **não tinha** — e `monta.py:1581` já a lia, então toda
página regerada aqui sairia com `0 USB · 0 BT`. `git stash` → `git rebase
onda/atual-0609` → `git stash pop`, e a árvore foi de `3f6855a6` para
`ec35e970`. **Sem isso a bancada teria saído com o cabeçalho zerado e eu teria
caçado o defeito no meu próprio código.**

**A ARMADILHA DE HOJE É A DE ONTEM, e ela me pegou:** escrevi um comentário
para AVISAR que a linha da verdade não deve voltar — e o comentário **soletrou o
nome da função**. O portão `paridade-gtk-html` não distingue prosa de uso:
*"o sinal `resumo_do_que_chega_ao_jogo` APARECEU em interface/aba02.py"*. O
mesmo defeito que o `mesa_viva._via_do_transporte` já registra, na mesma semana.
**O aviso virou o defeito que ele descrevia.** A forma desta casa é citar o
ENDEREÇO (`controller_card.py:1729`), e é o que o comentário faz agora — com a
razão escrita ao lado, para o próximo.

**E o portão `donos-de-comportamento` acusou pela mesma causa**, o que é uma
segunda régua independente vendo o mesmo fato — que é o que esta casa quer.

### A ESPERA POR `pgrep` NASCEU IMORTAL — de novo, e agora com o vizinho junto

A casa já registra que `until ! pgrep -f "<comando>"` casa o próprio laço. Numa
leva de oito agentes ela tem uma SEGUNDA cara, pior: **o padrão casa o
`portoes.sh` DOS OUTROS.** Medido nesta máquina enquanto eu esperava:

```
889233  .../CONTROLES-VERDADE-01-...      ← o meu
891227  .../SISTEMA-STEAM-01-...          ← de outro agente
898338  .../MIC-VIRTUAL-02-...            ← de outro agente
```

Minutos depois eram **quinze** `portoes.sh` de seis árvores diferentes. Uma
espera por padrão nunca termina enquanto a leva estiver viva, e ela some no
meio do relatório — não como erro, como silêncio. **Havia dois laços de OUTROS
agentes já presos ali, dos quais um espera por um arquivo que não é o dele.**

**A regra que sobra:** numa leva, espere pelo **PID** do seu processo ou pela
notificação da tarefa; `pgrep -f` por nome de script é espera pela leva inteira.
E para encerrar, PID conferido com `pwdx` — foi assim que separei os meus dos
dos vizinhos sem tocar em nenhum deles.

---

## 8. OS PORTÕES E OS COMANDOS

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-voo/hefesto-voo/CONTROLES-VERDADE-01-C-CONTROLES-VERDADE-01
source .envrc-voo
PY=/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
$PY -m pytest tests/unit/test_a_aba_02_controles_fecha_as_linhas.py -q   # 68 passed
$PY src/hefesto_dualsense4unix/interface/aba02.py                        # regera a bancada
git add -A && bash scripts/portoes.sh > <scratchpad>/CONTROLES-VERDADE-01-portoes.txt 2>&1
```

O diff são **quatro arquivos, e são exatamente os quatro da posse** —
`aba02.py`, `pacotes/a02_controles.py`, `mockup/02-controles.html` e a régua —
mais esta entrega.
