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
jogo_da_janela('retroarch')     →  RetroArch (Instalado aqui)
jogo_da_janela('SUPERZSNES')    →  Super ZSNES (Instalado aqui)
jogo_da_janela('steam_app_3357650') → None   (tem dono, e é o appid)
jogo_da_janela('unknown') / ('') / (None)    → None   (as recusas honestas)
```

---

## A PONTA NA TELA — são DUAS linhas, e estão medidas

`a10_perfis.py` está em `nao_toca` desta sprint. As duas linhas, com o número
que elas têm na árvore `onda/0911`:

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
3. **A aba 10 na tela.** `a10_perfis.py` é `nao_toca`; não abri o piloto e não
   publiquei HTML nenhum. A prova das duas linhas é em memória, com as funções
   reais — não é a foto.
4. **`Rare` entra na lista como jogo.** O `.desktop` dele declara só
   `Categories=Game;` (sem `PackageManager`), e não há campo que o separe de um
   jogo. Deixei entrar e declarei: para o «Detectar» isso é **certo** — se ela
   está com o Rare em foco, responder "Rare" é melhor que responder nada.

---

## O que sobrou para o próximo

1. **As duas linhas da tela**, acima, para quem costura — depois da
   `PERFIS-A-TELA-01`.
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
