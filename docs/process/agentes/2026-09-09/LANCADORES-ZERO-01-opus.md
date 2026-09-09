# LANCADORES-ZERO-01 — os itens 3 e 4: a cura por estrada e a caixa do Flatpak

**Branch:** `voo/LANCADORES-ZERO-01-opus` · nasceu de `dev` em `e5f4b3da`.

Os itens 1, 2 e 5 da sprint fecharam mais cedo (commit `7dc8af8f`). O que restava
eram os dois que a própria sprint marcou como **não feitos** — a cura por estrada
(§5.3) e a mudança de pergunta do cartão «Flatpak» (§5.4). Os dois estão de pé.

---

## O que mudou

### 1. `integrations/cura_por_estrada.py` — o ambiente entra nos outros lançadores

O atalho de inicialização da Steam (`assets/hefesto-launch.sh`) **não alcança
ninguém mais**: sem `SteamAppId` ele não faz nada, e nenhum jogo do Heroic, do
Lutris, do RetroArch, do Dolphin ou do mGBA tem um. A cura entrega as MESMAS
variáveis por outra estrada.

| cartão | estrada | arquivo |
| --- | --- | --- |
| `heroic` | `defaultSettings.enviromentOptions` | `…/config/heroic/config.json` |
| `lutris` · `retroarch` · `emuladores` | `[Environment]` | `~/.local/share/flatpak/overrides/<app-id>` |
| `flatpak` · `steam` | nenhuma — e por isso **não ganham botão** | — |

Três coisas que o módulo **nunca** faz, e cada uma é uma linha de código:

* **nunca inventa o ambiente.** Ele é o `default.env` que o daemon publicou,
  filtrado pela `ENV_ALLOWLIST` do wrapper. Sem o arquivo, RECUSA dizendo o que
  ligar. Uma segunda conta ao lado da do daemon envelheceria calada;
* **nunca escreve fora da allowlist.** O wrapper `sh` filtra por essa lista
  contra arquivo adulterado; a cura, que escreve em configuração DELA, não pode
  ser mais permissiva que ele;
* **nunca apaga o que é dela.** As duas estradas leem, fundem e regravam — um
  `MANGOHUD` no Heroic e a `[Context]` de um override continuam lá. Escrita
  atômica por temporário vizinho: ou o arquivo velho está inteiro, ou o novo. E
  **quem não sabe ler não escreve**: um arquivo que existe e não abre faz a cura
  RECUSAR, nomeando-o — a conferência é de TODAS as estradas antes da primeira
  escrita, porque meio cartão consertado é pior que nenhum.

O override sai no formato do dono do arquivo — `chave=valor`, sem espaço em
volta do `=`, que é o que `flatpak override --user --env=` escreve e o que o
`GKeyFile` lê. **O produto escreve o arquivo; não chama o binário.**

### 2. `integrations/sandbox_dos_lancadores.py` — o cartão «Flatpak» muda de pergunta

Ele não é lançador: é o runtime dos outros cinco, o censo lhe devolve
`SEM_BIBLIOTECA`, e a linha dele ficava com um travessão. A pergunta que só ele
responde é a da §4 da sprint — **o controle entra na caixa em que o jogo roda?**

A resposta é `[Context] devices=` do `metadata` do pacote, mais os QUATRO
arquivos de override na ordem do Flatpak (`global` e do aplicativo, do lado do
sistema e do lado do usuário), com a negação por `!` — a única forma de a
resposta ficar negativa numa máquina em que o pacote pediu tudo. **Sem
subprocesso**, porque isto roda dentro do tique de uma aba: o que não existe é
pulado por um `is_file()`.

**Medido no disco dela, 09/09/2026:** os cinco lançadores são flatpaks do lado
do usuário (`/var/lib/flatpak/app` nem existe) e os cinco trazem `devices=all`.
A linha do cartão passou de `—` para **«5 lançadores por aqui, e o controle
entra em todos»**.

### 3. O botão «Consertar» nos cinco cartões, e o gesto que o atende

`desenho.CONSERTAR_LANCADOR` no cartão LOCALIZADO que tem estrada;
`a07_lancadores.consertar_lancador` atende, com `grava="escrever_a_estrada"` —
logo ele entra em `pacotes.perigosos()` e a prova automática (`--prova-gesto`)
**não o clica sozinha**. O piso de gestos da aba subiu de 16 para 17.

### 4. Um fato errado, substituído

`a07_lancadores.SEM_DONO["heroic"]` afirmava que *"nenhuma função de `src/` abre
o catálogo do Heroic, do Lutris, do RetroArch, do Dolphin ou do mGBA, e por isso
o cartão do que foi achado continua dizendo NÃO SEI"*. **As três afirmações
morreram no commit anterior desta mesma sprint** e a linha ficou. Saiu, com a
data e o motivo no lugar dela.

E a régua `test_o_piso_de_gestos_da_aba_e_catorze` chamava-se `catorze` com o
piso em **16**: um nome com número dentro é um fato a manter em dois lugares, e
ele envelheceu duas vezes em três dias. Passou a `..._so_sobe`, que diz a regra.

### 5. DOIS VERMELHOS herdados — um fechei, o outro é de quem o escreveu

A primeira corrida saiu **`REPROVOU: 2 vermelho(s) de 54`**, e os dois já
estavam na minha base. **Os dois moram na camada COMPLETA**, que o `--rapido`
não roda — é a armadilha que o `CLAUDE.md` nomeia com todas as letras
(*"`--rapido` NÃO é o portão: sem `acentuacao`, `mypy`, `shellcheck`,
`anonimato` nem `casa-sabe`"*), e ela pegou de novo.

#### `citacoes-no-codigo` — FECHADO

```
interface/monta.py:291 cita a linha 878, que está EM BRANCO
— âncora em linha vazia não ancora nada
```

Medido: `git show e5f4b3da:.../aba03.py | sed -n '878p'` sai em branco, e a linha
que o comentário descreve (`c["via"] if c.get("conectado", True) else ""`) estava
em 878 **antes** do commit `8404faf8` — o acordeão dos ajustes da ROLAGEM-01, que
empurrou o arquivo. Hoje ela é a **960**, medida com `grep -n`, e é o que o
comentário passou a citar. `monta.py` não é posse de sprint nenhuma deste lote e
a mudança é de um número em comentário. **O portão ficou VERDE na corrida
seguinte** (89 s).

#### `acentuacao` — CONTINUA VERMELHO, e NÃO É MEU

`scripts/validar-acentuacao.py --all` na minha árvore: **20 violações, em TRÊS
arquivos, e nenhum é meu.** Os três são **byte-idênticos à base** — `git diff
e5f4b3da --stat` sai vazio para os três:

| arquivo | quantas | de quem |
| --- | --- | --- |
| `scripts/check_cabo_bt_perfil_controle.py` | 12 | CABO-BT-PERFIL-CONTROLE-01 (`7b16a76e`) |
| `tests/unit/test_portao_a_regua_das_quatro_respostas.py` | 7 | a mesma |
| `scripts/ensaios/a_janela_cabe_no_que_ela_ve.py:83` | 1 (`media` → `média`) | ROLAGEM-01 (`8404faf8`) |

**A ACUSAÇÃO ESTÁ ERRADA NAS 19 PRIMEIRAS, e o literal está certo:** `nao` ali é
o VALOR cru do mapa, que a régua imprime como veio
(`check_cabo_bt_perfil_controle.py:321` monta
`f"rádio: {radio}" if radio in ("nao", "sem linha")`). Acentuá-lo faria a
comparação deixar de casar com a saída do produto. **O conserto é a isenção da
casa — `# noqa-acento:` com a razão na linha** —, e a de `:83` é a única que
pede acento de verdade (`media` é prosa).

**EU CHEGUEI A CONSERTAR UMA E DESFIZ, e a razão é de processo.** Pus o
`noqa-acento` na linha 158 do teste, e a corrida seguinte mostrou que o vermelho
tinha **vinte** linhas, não uma — eu tinha lido só o fim da saída do portão.
Consertar uma em arquivo de OUTRA sprint não apaga o vermelho e cria conflito de
merge para quem o possui: **`scripts/` é posse da TUDO-FUNCIONA-01, que está em
voo agora**, e os dois arquivos do meio nasceram hoje. *Correção pela metade em
arquivo alheio é o pior dos dois mundos.* Desfiz, e a linha fica aqui com o
conserto escrito para quem o possui aplicar.

**A REGRA QUE OS DOIS DEIXAM, e ela é de processo:** *uma sprint que fecha no
`--rapido` deixa vermelho no `dev` para a próxima pessoa achar.* E a irmã dela,
que me pegou: *ler só a última linha de um portão vermelho é medir uma parte do
vermelho.*

---

## Qual mordida prova

`tests/unit/test_a_cura_por_estrada_e_a_caixa_do_flatpak.py` — **23 casos, lar
de mentira em todos**. Cinco curas arrancadas, cinco reprovações copiadas:

```
########## arranco o ramo do '!' em permissao_de
E   AssertionError: o pacote pede `all`, ela fechou com `!all`, e o produto
    ainda diz que o controle entra — verde sobre uma caixa fechada à mão
    assert 'entra' == 'nao_entra'
FAILED ...::test_o_override_dela_soma_e_o_com_exclamacao_tira

########## app_ids_do_cartao devolve só o .desktop achado
E   assert '2 lançadores...' == '3 lançadores...'
FAILED ...::test_um_cartao_pode_ser_dois_programas_e_os_dois_contam
FAILED ...::test_o_cartao_localizado_ganha_o_consertar_e_o_flatpak_muda_de_pergunta

########## tiro o filtro da allowlist
E   AssertionError: assert 'LD_PRELOAD' not in {'MANGOHUD': '1',
    'LD_PRELOAD': '/tmp/algo-que-o-wrapper-nao-exporta.so', …}
FAILED ...::test_o_ambiente_e_o_do_daemon_filtrado_pela_allowlist
FAILED ...::test_a_cura_do_heroic_escreve_e_preserva_o_que_e_dela

########## arranco o botão Consertar e a pergunta do Flatpak
E   AssertionError: o cartão «Dolphin · mGBA» está LOCALIZADO, tem por onde
    receber o ambiente e não oferece o Consertar: ['abrir-lancador']
FAILED ...::test_o_cartao_localizado_ganha_o_consertar_e_o_flatpak_muda_de_pergunta

########## tiro a conferência de legibilidade de escrever_a_estrada
E   AssertionError: a cura reescreveu um arquivo que ela não conseguiu ler —
    a configuração dela foi para o lixo com uma piscada verde por cima
E   AssertionError: o Dolphin foi ajustado e o mGBA não — meio cartão
    consertado, e a tela dizendo só que falhou
FAILED ...::test_arquivo_ilegivel_recusa_e_nao_e_reescrito
FAILED ...::test_a_recusa_de_um_programa_nao_deixa_o_outro_escrito

########## DEVOLVIDO
23 passed
```

**A QUINTA GUARDA NASCEU DE UMA RELEITURA, e o defeito era o pior de todos:**
um `config.json` truncado (o Heroic morreu no meio de um `write`) não abre — e
a primeira versão caía para `{}` e **reescrevia o arquivo** com o nosso ambiente
dentro. A biblioteca dela, o caminho do Wine e tudo o mais iam para o lixo, com
uma piscada verde por cima. *Quem não sabe ler não escreve* — e a conferência é
de TODAS as estradas ANTES da primeira escrita, porque um cartão pode ser dois
programas e meio cartão consertado é pior que nenhum.

**A PRIMEIRA MORDIDA NÃO MORDEU, e é o achado de processo do dia.** Com o ramo
do `!` arrancado, `test_o_override_dela_soma_e_o_com_exclamacao_tira` **passou**:
o caso punha `devices=dri` no pacote nos dois cenários, então o `!all` entrava
como texto literal, `all` continuava fora e o teste dava verde sobre a cura no
chão. **O caso da negação só morde com o pacote pedindo `all`** — é ele que a
negação tem de TIRAR. Com a base certa, a régua reprova (saída acima).

*Uma régua que mede o caso fácil não mede a cura; mede o caminho por onde a cura
não passa.*

### A tela viva — foto, clique e mordida

Tudo no piloto `--oculta`, com **lar de mentira que espelha o disco dela** (os
cinco `metadata`, os cinco `.desktop`, o `config.json` e o `store_cache` do
Heroic, o `default.env` do daemon). Nada foi escrito no `$HOME` real — conferido
no fim: `enviromentOptions: []` no `config.json` dela e os seis overrides dela
intactos.

| foto | o que mostra |
| --- | --- |
| antes | os cinco cartões sem «Consertar»; «Flatpak» com `—` |
| depois | «Consertar» nos cinco, «Flatpak» com a contagem |
| recibo | a tarja verde do clique |
| recusa | a mordida: sem `default.env`, a tarja laranja |

**AS FOTOS NÃO ENTRAM NO REPOSITÓRIO, e o comando entra no lugar delas** — um
PNG envelhece calado e ninguém sabe de que dia ele é. Este refaz as quatro, num
lar de mentira montado do disco dela (copie os cinco `metadata`, os cinco
`.desktop`, o `config.json` + `store_cache` do Heroic e o `default.env`):

```bash
env HOME=$LAR XDG_CONFIG_HOME=$LAR/.config XDG_DATA_HOME=$LAR/.local/share \
    XDG_STATE_HOME=$LAR/.local/state XDG_CACHE_HOME=$LAR/.cache \
  .venv/bin/python src/hefesto_dualsense4unix/interface/hefesto_vivo.py \
    --abre 07 --oculta --segundos 5 --foto /tmp/x.png \
    --prova-clique consertar-lancador --incluir-perigosos
```

**O CLIQUE, no WebKit vivo** (`--prova-clique consertar-lancador
--incluir-perigosos`): `enviromentOptions` foi de `[]` para as **cinco
variáveis do `default.env`**, e `language` e `version` do arquivo continuaram
lá. Tarja:

```
Heroic (Epic · GOG): ajustei para o jogo enxergar o controle pelo Hefesto
— 5 ajustes. Feche e abra o lançador para valer.
```

**A MORDIDA NA TELA:** tirei o `default.env` do lar de mentira e cliquei de
novo. Tarja laranja, e nada foi escrito:

```
O serviço ainda não publicou o ambiente desta sessão. Ligue o Hefesto,
conecte um controle e tente de novo.
```

### O que a tela viva DERRUBOU — duas versões minhas, na mesma tarde

1. **O recibo não cabe no corpo do cartão.** A primeira versão escrevia a frase
   no `diz`, como o `ver-o-que-impede` faz com o da Steam. **Fotografada 1,6 s
   depois do clique, ela já não estava lá:** o tique repinta o corpo a partir do
   disco dez vezes por segundo, e o recibo vivia 100 ms. Quem tem prazo próprio
   é o canal de `recado` (6 s, D-01 dela) — depósito DO PILOTO, não valor da
   página. `_com_a_frase_do_cartao` nasceu e morreu no mesmo dia.
2. **A tarja dizia a chave interna:** *"Ajustei o ambiente de heroic"*, com o
   `data-lancador` na frente dela, e a contagem duas vezes (`(5): 5 ajustes`). A
   frase passou a sair do NOME do cartão, sem artigo — a razão de não adivinhar
   gênero já estava medida em `NOVO_PARA_O_CARTAO` — e a palavra do fato é a do
   glossário: *"para o jogo enxergar o controle pelo Hefesto"*.

### A rolagem não piorou

`scripts/ensaios/a_janela_cabe_no_que_ela_ve.py 07`, antes e depois da cura:
**`DIV.miolo 627>564` nos dois**. O botão entra numa fileira que já existia e a
linha do censo já tinha lugar. O 627 é o número herdado que a ROLAGEM-01 tem em
mão.

---

## O que NÃO verifiquei

* **NENHUM JOGO ABRIU.** A escada parou em **SAIU NO FIO**: provei que o arquivo
  certo recebe os bytes certos, no formato que o dono do arquivo lê. Não provei
  «O JOGO RECEBEU» nem «O JOGO REAGIU» — a biblioteca do Heroic dela tem **37
  jogos e ZERO instalados**, e não há o que abrir. **Isto é o que falta para
  fechar o item 3 de verdade**, e é bancada: um jogo instalado num dos cinco
  lançadores, aberto depois do «Consertar», com o controle na mão;
* **não medi se o Heroic RESPEITA o `enviromentOptions` num jogo Proton.** A
  chave é a que o Heroic publica e usa; que ele a passe intacta ao processo do
  jogo é afirmação dele, não medição minha;
* **não medi o Lutris nem os três emuladores em uso** — o Lutris nunca foi
  aberto no disco dela (`~/.var/app/net.lutris.Lutris` não existe) e os outros
  três também não;
* **não toquei na bancada.** `bancada: false` no frontmatter, e nenhum caminho
  desta sprint para o daemon, escreve no aparelho ou chama `systemctl`. A
  bancada estava LIVRE e continua;
* **não rodei a suíte inteira** (é de quem coordena). Rodei o escopo: as réguas
  da aba 07 e do censo (133 casos), a régua nova (23) e o portão `casa-sabe`
  isolado (42), que é o que costuma acusar código sem chamador;
* **não publiquei página nenhuma.** O HTML estático nasce de `cartoes(None)` — o
  estado *"ainda não procurei"* —, que não tem botão nem contagem; nada mudou em
  `mockup/` nem em `interface/paginas/`, e `git status` o confirma.

---

## O que sobrou para o próximo

1. **A PROVA DE APARELHO do item 3** (acima). É o degrau que falta, e é dela ou
   da MESA-DE-QUATRO-01: instalar um jogo num dos cinco, clicar «Consertar»,
   abrir e ver o controle chegar. **Só isso fecha a §6 da sprint na coluna «no
   perfil»**;
2. **O LUTRIS POR JOGO CAIU DA SPRINT, e a razão é medida.** A §4 previa
   `system: env:` no `.yml` de cada jogo. Duas coisas o derrubaram: **não há
   dependência de YAML nesta casa** (o `pyproject.toml` não declara `pyyaml`, e
   o `censo_dos_lancadores` já tinha recusado importá-la só para ler um nome de
   arquivo), e **o Lutris nunca foi aberto no disco dela** — não há `.yml` em
   que escrever. O override do Flatpak alcança o mesmo destino, por lançador em
   vez de por jogo, **e por jogo não faria diferença: a conta é a mesma para
   todos, porque o ambiente vem da ponte e não do título**. Se um dia um jogo
   precisar de ambiente próprio, a estrada por jogo volta a fazer sentido — e aí
   a dependência de YAML tem de ser declarada, com a razão;
3. **O `match` de perfil por jogo de outro lançador NÃO FOI FEITO** (§6, coluna
   «no perfil»). Hoje o perfil casa pelo nome do processo do lançador — que é o
   que o cartão promete e o que basta para os emuladores. Um jogo do Heroic com
   perfil PRÓPRIO precisa de `MatchCriteria` por `app_name`, e isso é
   `profiles/schema.py`, que **não é posse desta sprint**;
4. **A ROLAGEM DA 07 continua em `627>564`** e é da ROLAGEM-01. Esta leva não a
   piorou em um pixel (medido antes e depois), mas quem for fechá-la vai
   encontrar um botão a mais por cartão — a fileira, não a altura;
5. **O `pyproject.toml` continua sem `playwright`**, dívida herdada e já
   descrita no `CLAUDE.md`. Não é desta sprint e não foi tocada.

---

## Células do mapa que exercitei

**NENHUMA.** Este trabalho não toca canal, report id, offset nem comando do
aparelho: ele lê e escreve arquivos de configuração de programas de terceiros e
pinta uma aba. `docs/data/mapa-controles.csv` não foi lido nem editado, e não há
linha a marcar. O único ambiente que a cura escreve é o que o daemon já publicou
— e quem mede aquele é o `launch_env.py`, que não mudou.

## O que caiu da sprint

* **§4, «Lutris — o `.yml` do jogo tem `system: env:` · por jogo»** — caiu, com
  a razão no item 2 acima. A estrada dele é o override do Flatpak.
* **§5.3, «Heroic … por jogo (`GamesConfig/<app>.json`)»** — caiu para
  `config.json` / `defaultSettings.enviromentOptions`. Medido no disco dela em
  09/09/2026: `GamesConfig/` tem **dois arquivos de log e nenhuma configuração
  de jogo**, porque há **zero jogos instalados** — escrever por jogo não teria
  onde pousar. O `defaultSettings` é global, vale para todo jogo que ela
  instalar depois, e a chave já existia lá (vazia).
* **§5.4, «lendo as permissões … de cada flatpak achado»** — cumprido, com uma
  correção: a lista não sai só do `.desktop` achado. **Um cartão pode ser DOIS
  programas**, e por isso a conta dizia *4* numa máquina com *5*.
