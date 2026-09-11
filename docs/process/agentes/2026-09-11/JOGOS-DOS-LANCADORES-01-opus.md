# JOGOS-DOS-LANCADORES-01 — o «Detectar» ganhou o outro lado do caminho

**11/09/2026 · branch `voo/JOGOS-DOS-LANCADORES-01-opus` · base `onda/0911`**

> **A COBRANÇA DELA, com a foto na mão:** *"em perfil falta detectar os jogos*  <!-- noqa-acento: citação literal dela -->
> *dos demais lançadores. dando exemplo do guardi]ães da galáxia."*  <!-- noqa-acento: citação literal dela -->

Na foto o botão «Detectar», ao lado do campo «Nome do Jogo», responde
`3357650` → **PRAGMATA** para um jogo da Steam, e **não responde nada** para um
que não é da Steam.

**A CAUSA, medida:** o botão nunca deixou de GRAVAR a regra certa para o jogo
de fora da Steam — a forma "janela" existe desde a ONDA5-10-01 e grava
`window_class`, o MESMO campo da Steam. O que faltava era o **NOME**. A ida do
caminho tinha dono (`steam_appid_from_wm_class`: `steam_app_3357650` → `3357650`
→ *PRAGMATA*); **a volta não tinha função nenhuma**. Sem ela o desfecho diz
*"«Perfil» agora vale em: Só neste programa"* sobre uma `wm_class` que ela não
digitou, vinda de uma janela que ela não está mais olhando — que é a mesma
coisa que não achar.

Esta sprint entrega o **MOTOR**. A tela da aba 10 saiu da posse em 11/09 e está
com a `PERFIS-A-TELA-01`; as duas linhas da ponta estão ditas abaixo, com o
número, para quem costura.

---

## O que mudou

### 1. `jogo_da_janela` — a volta do caminho que só a Steam tinha

`integrations/jogos_locais.py`. De uma `wm_class`, **que jogo é**. Pura: recebe
a lista já lida, para que régua nenhuma dependa da biblioteca dela.

A comparação **dobra a caixa dos dois lados**, e isso é medido, não gosto: o
`pga.db` do Lutris guarda `…/GOTG.exe` onde a janela do mesmo jogo pelo Heroic
anuncia `gotg.exe`, e `MatchCriteria.matches` **já** compara `window_class` sem
caixa (`_casa_sem_caixa`, `profiles/schema.py:143`). Exigir caixa igual aqui
faria o produto discordar de si mesmo conforme o lançador por onde ela abriu.

`steam_app_<id>` devolve `None` de propósito: aquele endereço tem dono, e é
`catalogo_de_jogos` pelo appid. Duas respostas para o mesmo endereço é a
segunda verdade que esta casa já pagou.

### 2. O Lutris era lido do arquivo ERRADO — e o sintoma era a AUSÊNCIA de dado

`integrations/censo_dos_lancadores._lutris` lia `games/*.yml` e devolvia o
`stem` como nome. Medido no disco dela hoje:

```
~/.var/app/net.lutris.Lutris/config/lutris  ->  data/lutris   (symlink)
    games/    0 arquivos
    pga.db    tabela `games`, 23 colunas
```

O `games/*.yml` só nasce para jogo com configuração PRÓPRIA; **a biblioteca é a
tabela**. Com a pasta vazia o cartão dizia `LIDO · A biblioteca está vazia` —
que se lê como *"o Lutris está vazio"* e não como *"eu olhei no lugar errado"*.
E o `.yml` **não dá a etiqueta**: um `stem` (`sea-of-stars`) não é a `wm_class`.
O `pga.db` traz `executable`, e o basename dele é a classe — a mesma leitura que
o `install.executable` do Heroic já tinha.

`sqlite3` é biblioteca padrão: nenhuma dependência nova (ao contrário do
`pyyaml` que o leitor antigo recusou, e recusou com razão). Aberto em
`mode=ro`, porque o Lutris dela pode estar aberto com o banco na mão. O `.yml`
continua entrando e só ACRESCENTA o que a tabela não tiver — a leitura nova não
pode ENCOLHER o que já funcionava.

### 3. A terceira origem: o jogo que não é de lançador nenhum

`jogos_diretos_dos_atalhos` — `.desktop` com `StartupWMClass=`, que é o campo da
spec XDG com que o compositor liga uma janela ao atalho que a abriu:
**exatamente a pergunta que o perfil faz**. Medido nas quatro pastas XDG dela:

| | |
| --- | --- |
| `.desktop` nas quatro pastas | **221** |
| com `StartupWMClass` | **59** |
| com `StartupWMClass` **e** `Categories=Game` | **31** |
| desses 31, `meow-steam-*.desktop` dela | **23**, todos `StartupWMClass=steam_app_<id>` |

Os 23 são a prova de que este campo é o MESMO endereço que o perfil da Steam já
guarda, e não um segundo cadastro — e por isso **saem daqui**: a origem deles é
`catalogo_de_jogos`, que tem o nome COMPLETO do `.acf` (o atalho já foi medido
cortando `ORPHEUS: TO HELL AND BACK` em `ORPHEUS`).

Os lançadores saem **pelo que eles mesmos declaram**: `Categories` com
`PackageManager` (Heroic, Lutris). **O emulador FICA** — o RetroArch é UM
processo para todas as ROMs (é o que a §4 da sprint diz), então a linha por
emulador é a única que existe, e é a certa.

### 4. `nomes_das_janelas` — a leitura memoizada que a tela chama

`{wm_class: nome}` das três origens, com o freio de `assinatura_das_janelas`
(`stat()` de diretório, mesmo molde de `assinatura_da_biblioteca`). **Nunca
levanta**: quem a chama é o rótulo ao lado do campo, que é PINTURA — dez vezes
por segundo, sobre um `pga.db` e 221 `.desktop`. Medido: **46 ms** na primeira
leitura, **0,33 ms** nas seguintes.

### O que ISSO responde, no disco dela, hoje

```
jogo_da_janela('gotg.exe')      →  Marvel's Guardians of the Galaxy (Heroic)
jogo_da_janela('GOTG.EXE')      →  Marvel's Guardians of the Galaxy (Heroic)
jogo_da_janela('steam_app_3357650') → None   (tem dono, e é o appid)
jogo_da_janela('unknown') / ('') / (None)    → None   (as recusas honestas)
```

**FATO ERRADO, SUBSTITUÍDO NO REPARO DE 11/09:** estas linhas traziam também
`jogo_da_janela('retroarch')` e `jogo_da_janela('SUPERZSNES')` como **duas das
três provas de que o motor funciona**. Eles não são jogos: são EMULADORES, que
ficam na lista por decisão declarada (a janela deles é a única que existe) e
não por terem sido achados como jogo. **A terceira origem acha ZERO jogos no
disco dela hoje**, e quem prova o motor é o Heroic — que é o exemplo exato da
queixa dela. Ver «O reparo de 11/09», achado 5.

---

## A PONTA NA TELA — são DUAS linhas, e estão medidas

> **ELAS ESTÃO APLICADAS DESDE O REPARO DE 11/09**, com a posse de
> `a10_perfis.py` devolvida — mais DUAS que vieram junto, porque o
> `<datalist>` entrega à mão dela um dado que o produto classificava errado.
> Esta seção fica como o que ela era: a medição que provou as duas antes de
> haver permissão para escrevê-las. Ver «O reparo de 11/09».

As duas linhas, com o número que elas tinham na árvore `onda/0911`:

**Linha 1 — `a10_perfis.py:2225`, dentro de `_jogo_reconhecido`** (é ela que
alimenta o rótulo ao lado do campo E o desfecho do «Detectar»):

```python
-        decisao = frase_do_campo_do_jogo(texto, _nomes_dos_jogos())
+        decisao = frase_do_campo_do_jogo(texto, _nomes_dos_jogos(),
+                                         nomes_das_janelas())
```

(`nomes_das_janelas` entra no `from …jogos_locais import (…)` logo acima, na
mesma lista de `frase_do_campo_do_jogo`.)

**Linha 2 — `a10_perfis.py:2913`, o último `return` de `detectar`**, o ramo do
jogo de fora da Steam:

```python
-    return _dizer(_agora_vale_em(prof),
+    return _dizer(_agora_vale_em(prof, classe),
                   **{"editor.jogo": simple_extra(prof.match) or classe})
```

O comentário logo acima dessa linha explica por que o `texto` era omitido —
*"`_agora_vale_em` usa o texto só para traduzir um NÚMERO DA STEAM em nome de
jogo"*. **Esse fato deixou de valer com esta sprint**, e o comentário sai com a
linha.

### O que as duas linhas mudam, medido com as funções REAIS da aba

Rodado em processo, sem editar o arquivo — `a10_perfis._agora_vale_em` e
`a10_perfis._jogo_reconhecido` de verdade, com o disco dela:

```
### HOJE (o que ela viu na foto)
  Steam  : “PRAGMATA” agora vale em: Só neste programa · PRAGMATA
  Heroic : “Guardiões da Galáxia” agora vale em: Só neste programa
  rótulo : ('', False)

### COM AS DUAS
  Steam  : “PRAGMATA” agora vale em: Só neste programa · PRAGMATA
  Heroic : “Guardiões da Galáxia” agora vale em: Só neste programa · Marvel's Guardians of the Galaxy
  rótulo : ("Marvel's Guardians of the Galaxy", False)
  rótulo da Steam (não regrediu): ('PRAGMATA', False)
```

---

## Qual mordida prova

Seis, arrancadas uma a uma e devolvidas — a suíte do arquivo tem **17** réguas
e **nenhuma toca a biblioteca dela** (todas passam `lar=tmp_path` e `pastas=`).

| a cura arrancada | o que reprova |
| --- | --- |
| `jogo_da_janela` compara **com** caixa | `GOTG.EXE` do `pga.db` deixa de reconhecer a janela `gotg.exe` do Heroic |
| sai o filtro `steam_appid_de_texto` do jogo direto | os 23 jogos da Steam voltam pela porta dos fundos, com o nome CORTADO do atalho e sem appid |
| sai o freio da assinatura de `nomes_das_janelas` | o segundo `dict` deixa de ser o MESMO objeto — o disco é relido sem nada ter mudado |
| sai o `try/except` de `nomes_das_janelas` | o `OSError` sobe e a aba Perfis inteira para de pintar por causa de um rótulo |
| `_lutris` volta a ler só `games/*.yml` | zero jogos, zero chaves, e o «Detectar» volta a não ter nome para jogo do Lutris |
| `classe_de_janela` devolve o `executavel` inteiro | a regra vira `window_class=["retail/gotg.exe"]`, que nunca casa com janela nenhuma (R-12) |

Mais a régua que guarda a leitura nova de não ENCOLHER a velha: o jogo que só
tem `.yml` continua na biblioteca, e não duplica quando está nos dois.

**Vizinhança medida junto:** `283 passed` nos dez arquivos que tocam o censo, a
aba 07, a aba 10, o campo do jogo e a semeadura de perfil por jogo.

---

## O que NÃO verifiquei

1. **O caminho pelo daemon VIVO com a janela do jogo em foco.** Provar que
   `window_detect_last_class` traz `gotg.exe` exige ela abrir *Guardiões da
   Galáxia* pelo Heroic, com a tela dela. A bancada estava LIVRE (`rc=0`), mas
   **isso não é aparelho: é a tela dela**, e abrir um jogo na frente dela é o
   que este preâmbulo proíbe. É a linha de «cabo» e «BT» do critério de pronto
   da sprint, e fica para a `MESA-DE-QUATRO-01` / para ela.
2. **A `wm_class` real de um jogo do Lutris.** A biblioteca Lutris dela está
   **vazia** (`pga.db` existe, tabela `games` sem linhas) — medido hoje. O
   leitor novo foi provado com dublê de `pga.db` com o esquema de 23 colunas
   dela, copiado do banco real.
3. **A aba 10 na tela.** *(Escrito quando `a10_perfis.py` era `nao_toca`. A
   posse voltou no reparo de 11/09 e as quatro linhas estão aplicadas; o que
   continua sem foto é a tela — ver «O reparo de 11/09», o que continua não
   verificado.)*
4. ~~**`Rare` entra na lista como jogo.**~~ **DECISÃO REVERTIDA NO REPARO DE
   11/09.** Eu escrevi que deixar o Rare entrar era *certo* — *"se ela está com
   o Rare em foco, responder «Rare» é melhor que responder nada"*. Está errado,
   e a razão é medida: a biblioteca que o Rare abre é a MESMA que
   `censo._heroic` já lê pelo `legendary_library.json`, jogo por jogo. Deixá-lo
   entrar oferece a VITRINE da Epic no campo «Nome do Jogo», ao lado dos jogos
   dela. Ele sai por `_CLIENTES_DE_LOJA`, declarado com o `.desktop` citado.

---

## O que sobrou para o próximo

1. ~~**As duas linhas da tela**, acima, para quem costura.~~ **FEITAS no reparo
   de 11/09** — a posse voltou, e foram quatro.
2. **A pergunta (A)/(B)/(C) da §3 continua dela**, e nada aqui a antecipa:
   nenhuma linha nova nasce na lista de perfis. Isto é o motor do (C) mais o
   que o «Detectar» precisava.
3. **A coluna «Quando usar» ainda diz a mesma frase em 25 linhas** (item 1 da
   §2 da sprint). Ela é de `profiles_actions._match_label`, que não está na
   posse desta sprint.
4. **`perfil_e_regra_de_jogo` continua exigindo `steam_app_<id>`** (item 4 da
   §3): com a trava manual armada, o perfil do jogo do Heroic não entra e o da
   Steam entra. Fica em `daemon/subsystems/autoswitch.py`, fora da posse.
5. **O cartão do Lutris na aba 07 vai mudar de número** quando ela instalar um
   jogo — hoje diz "A biblioteca está vazia" e agora isso é a verdade medida,
   não o arquivo errado.

---

## O reparo de 11/09

A entrega foi **DEVOLVIDA pelo conferente adversarial** com cinco achados. Ele
confirmou o núcleo — os 56 portões, as 17 réguas, as seis mordidas, e que o
motor acha `gotg.exe`/`GOTG.EXE` → *Marvel's Guardians of the Galaxy* no disco
de hoje. Devolveu porque **o motor não alcançava o produto**, e por mais quatro
coisas. As cinco fecharam.

### [ALTA] A queixa dela continuava intacta no produto

**A posse de `a10_perfis.py` foi devolvida** por quem coordena: a
`PERFIS-A-TELA-01` fechou e está costurada em `onda/0911`. O frontmatter da
sprint mudou — `a10_perfis.py` entrou na `posse:` com a razão e a data, e saiu
do `nao_toca` (lá ficou `aba10.py`, que continua sendo de outra).

As duas linhas ditas na entrega foram aplicadas, e **mais duas que vieram
junto** — porque a primeira delas entrega à mão dela um dado que o produto
classificava errado:

| onde | o que mudou |
| --- | --- |
| `_jogo_reconhecido` | `frase_do_campo_do_jogo(texto, _nomes_dos_jogos(), nomes_das_janelas())` |
| `detectar`, o último `return` | `_agora_vale_em(prof, classe)` — e o comentário que explicava a omissão saiu com a linha, porque o fato dele deixou de valer |
| `_html_dos_jogos` | o `<datalist>` volta a oferecer as DUAS origens, por `ofertas_do_campo_do_jogo` |
| `editor_jogo` | a forma da regra sai de `_forma_do_que_ela_escolheu`, e não de `normalize_appid` sozinho |

**A QUARTA LINHA NÃO É ENFEITE.** Com o `<datalist>` oferecendo `gotg.exe`, a
queda de `editor_jogo` (*"appid vira «Jogo da Steam», o resto vira «Jogo (pelo
processo)»"*) gravava `process_name: ["gotg.exe"]` — **outro dado**, o basename
de `/proc/PID/exe`, que o próprio `simple_match` avisa que casa por acaso. Foi
medido na tela viva em 10/09 e a régua o guarda agora.

**O que o produto responde, medido com as funções REAIS da aba, no disco dela:**

```
_jogo_reconhecido('gotg.exe')  →  ("Marvel's Guardians of the Galaxy", False)
_jogo_reconhecido('GOTG.EXE')  →  ("Marvel's Guardians of the Galaxy", False)
_jogo_reconhecido('3357650')   →  ('PRAGMATA', False)        ← não regrediu
_agora_vale_em(prof,'gotg.exe')→  “Perfil” agora vale em: Só neste programa ·
                                  Marvel's Guardians of the Galaxy
_html_dos_jogos()              →  28 <option>, e um deles é
                                  value="gotg.exe" label="…(Heroic)"
_forma_do_que_ela_escolheu     →  gotg.exe: janela · 3357650: steam_game ·
                                  Cyberpunk2077.exe: game
segunda pintura                →  0,82 ms
```

A régua que MORDE a ponta é
`test_a_aba_perfis_responde_o_nome_do_jogo_do_heroic` (as quatro pontas, uma a
uma) mais `test_o_botao_detectar_nomeia_o_jogo_do_heroic_que_acabou_de_gravar`,
que chama o **GESTO** `a10_perfis.detectar` — o que o dedo dela aciona — e
confere a regra gravada, o campo corrigido e a frase.

### [ALTA] O caderno nunca invalidava para o Heroic

`assinatura_das_bibliotecas` fazia `os.stat()` na RAIZ de configuração, e **o
`mtime` de um diretório não muda quando um arquivo de um SUBdiretório é
reescrito** — a biblioteca do Heroic é `store_cache/legendary_library.json`. O
molde que a docstring dizia copiar, `assinatura_da_biblioteca`, mira a
`steamapps`, que é a pasta que SEGURA os manifestos: **copiei a forma sem a
propriedade que a faz funcionar.**

A cura é `censo_dos_lancadores._FONTES` — o que cada leitor ABRE, assinado um a
um com `(caminho, mtime_ns, tamanho)`:

```
Heroic     store_cache/*_library.json · store_cache/*_install_info.json
Lutris     pga.db · pga.db-wal · games/*.yml
RetroArch  playlists/*.lpl
Dolphin    Dolphin.ini
mGBA       config.ini
```

O `pga.db-wal` entra por medição de contrato: em modo WAL o sqlite escreve as
linhas novas nele e pode não tocar no `pga.db`, e quem lê em `mode=ro` enxerga
os dois. A pasta de configuração continua na impressão — instalar o lançador
depois também é mudança.

**A metade dos `.desktop` fica no `mtime` da PASTA, e isso agora está
declarado**: instalar, desinstalar ou atualizar um programa cria, apaga ou
renomeia arquivo, que é o que um diretório enxerga. O que ela não alcança — um
`.desktop` já existente editado no lugar — custaria 221 `stat()` por tique, dez
vezes por segundo, e está escrito na docstring com o degrau.

### [ALTA] A mordida do freio só media o acerto

Era a assinatura desta casa: *a trava medida contra a própria saída*. A única
asserção era `nomes_das_janelas(...) is chaves` — o caderno BATENDO. Nasceram
duas réguas de INVALIDAÇÃO:

* `test_o_caderno_releu_o_disco_quando_ela_instalou_o_segundo_jogo` — reescreve
  `legendary_library.json` com dois jogos e exige resposta NOVA. **Mordida
  conferida:** com `_FONTES["Heroic"] = ()` ela reprova;
* `test_o_caderno_releu_quando_o_lutris_ganhou_uma_linha_no_banco` — insere no
  `pga.db` com `journal_mode=MEMORY`, **e o modo é a régua**: no modo padrão o
  sqlite cria e apaga um `pga.db-journal` dentro da pasta, o `mtime` do
  diretório muda sozinho, e a régua passaria pelo caminho errado sem medir
  nada. Ela ASSERTA que a pasta não se mexeu. **Mordida conferida:** sem
  `"pga.db"` em `_FONTES` ela reprova.

### [ALTA] A declaração que calou o `casa-sabe` era falsa para dois dos três

As três entradas de `_SEM_CAMINHO_HOJE` saíram: **as três ganharam chamador de
verdade**, que era a saída boa.

| função | chamador |
| --- | --- |
| `nomes_das_janelas` | `a10_perfis._jogo_reconhecido` |
| `ofertas_do_campo_do_jogo` | `a10_perfis._html_dos_jogos` |
| `jogo_da_janela` | `a10_perfis._forma_do_que_ela_escolheu` |

O terceiro é o que o conferente disse que **continuaria sem chamador depois das
duas linhas**, e continuaria mesmo: a ponta passa por `chaves.get(...)`. Ele
ganhou dono onde a pergunta é dele de verdade — *"que jogo é esta classe?"* — e
ali a diferença importa: `jogo_da_janela` dobra a caixa dos dois lados, e um
`dict.get` cru faria a MESMA linha da lista ser classificada diferente conforme
o lançador por onde ela abriu o jogo (`GOTG.exe` do `pga.db` × `gotg.exe` da
janela do Heroic).

O caderno de `jogos_locais` passou a guardar **a lista e o índice**, e
`jogos_de_janela()` é a forma de lista: duas chamadas no mesmo tique custam UMA
leitura de disco, e não há dois caminhos de invalidação para uma verdade só.

### [MEDIA] A terceira origem achava ZERO jogos — e eu vendi dois como prova

**A afirmação estava errada e sai de todos os lugares.** A entrega publicava
`jogo_da_janela('retroarch')` e `jogo_da_janela('SUPERZSNES')` como duas das
três provas de que o motor funciona. Medido no disco dela em 11/09, os cinco
achados eram `azahar`, `mGBA`, `retroarch`, `SUPERZSNES` — quatro
**EMULADORES** — e `rare`. **Nenhum jogo.** Quem prova o motor é o Heroic, que
é o exemplo exato da queixa dela.

* **o Rare SAI.** Ele declara só `Categories=Game;` e escapava do filtro por
  categoria; o `.desktop` dele foi lido e está citado no fonte
  (`Comment=Open source alternative for Epic Games Launcher, using Legendary`).
  Sai por `_CLIENTES_DE_LOJA`, um filtro POR NOME e DECLARADO — o mesmo
  argumento de `_FERRAMENTA_RE` para a infraestrutura da Steam. O preço de
  deixá-lo entrar era concreto: a biblioteca que ele abre é a MESMA que
  `censo._heroic` já lê jogo por jogo, e ele ofereceria a VITRINE da Epic no
  campo «Nome do Jogo»;
* **o emulador FICA, e agora é decisão com razão escrita** no fonte: ele é UM
  processo para todas as ROMs, então a janela dele é a única que existe. Um
  perfil mirando `SUPERZSNES` é o perfil daquele console. **Isso não os torna
  jogos achados**, e a docstring de `jogos_diretos_dos_atalhos` diz o número
  honesto: zero.

Régua: `test_o_cliente_de_loja_nao_entra_na_lista_de_jogos_e_o_emulador_entra`.
**Mordida conferida.**

### [MEDIA] A etiqueta não foi medida contra uma janela

Verdade, e fica escrito em vez de inventado. A igualdade *basename do
`install.executable` == `wm_class`* é **DERIVAÇÃO**: ela vem de o
`MatchCriteria(window_class=…)` guardar essa forma e de o «Detectar» gravar o
que o compositor anuncia. Ninguém abriu *Guardiões da Galáxia* e leu a classe
da janela viva — abrir um jogo exige a tela DELA.

O degrau está na docstring de `JogoDoLancador.classe_de_janela`, com o comando
e os dois desfechos:

```
daemon_state_full()["window_detect_last_class"]   # com o jogo em foco
  → 'gotg.exe'    a derivação vira medição e a nota sai
  → outra coisa   o `executavel` deixa de ser a chave, e o que sobra é ela
                  clicar «Detectar» uma vez por jogo — o caminho que já existe
```

Nada depende do resultado para funcionar: o «Detectar» grava o que o compositor
disse; esta propriedade só ADIANTA a linha na lista.

### Um defeito que o reparo revelou, e ele não era meu

`test_a_lista_de_jogos_desta_maquina_oferece_sem_recusar` tem uma fixture
`autouse` cujo nome promete *"a biblioteca DELA nunca é lida por uma régua"* —
e ela calava só a origem da Steam. Com a segunda origem ligada, o
`test_com_a_biblioteca_vazia…` passou a ler o Heroic, o Lutris e os 221
`.desktop` **da máquina de quem roda**, e reprovou aqui com três emuladores
dela na lista — enquanto no CI teria passado. *A mesma linha com dois
resultados conforme a máquina.* A fixture agora cala as DUAS.

### O que continua NÃO verificado

1. **O caminho pelo daemon VIVO com a janela do jogo em foco** — é o degrau do
   achado 6, e é dela. Continua valendo o item 1 da lista acima.
2. **A aba 10 na tela, com foto.** Com a posse devolvida eu poderia abrir o
   piloto, mas o preâmbulo desta leva manda não tocar a tela dela e não
   reiniciar nada; a prova aqui é em processo, com as funções e o GESTO reais,
   e a foto fica para a PROVA-DE-TELA dela.
3. A lista do «o que sobrou para o próximo», acima, continua valendo — os itens
   3 e 4 (a coluna «Quando usar» e o `perfil_e_regra_de_jogo` da trava manual)
   seguem fora da posse desta sprint.
