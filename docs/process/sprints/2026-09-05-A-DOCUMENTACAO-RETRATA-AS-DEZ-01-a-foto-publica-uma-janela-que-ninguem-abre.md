---
sprint: A-DOCUMENTACAO-RETRATA-AS-DEZ-01
estado: feita
posse:
  D18:
    - README.md
    - docs/usage/AS-DEZ-ABAS-o-que-cada-uma-faz.md
    - tests/unit/test_as_fotos_acompanham_a_versao.py
    - tests/unit/test_a_documentacao_conhece_todas_as_abas.py
    - scripts/check_fotos_da_tela.py
cria:
  - scripts/gui-captura/retratar_as_dez.py
  - docs/usage/assets/aba-01-jogar.png
  - docs/usage/assets/aba-02-controles.png
  - docs/usage/assets/aba-03-gatilhos.png
  - docs/usage/assets/aba-04-iluminacao.png
  - docs/usage/assets/aba-05-vibracao.png
  - docs/usage/assets/aba-06-navegacao.png
  - docs/usage/assets/aba-07-lancadores.png
  - docs/usage/assets/aba-08-conexoes.png
  - docs/usage/assets/aba-09-sistema.png
  - docs/usage/assets/aba-10-perfis.png
nao_toca:
  - docs/usage/interface.md
  - docs/usage/A-JANELA-ANTIGA-o-que-mudou-de-lugar.md
  - scripts/gui-captura/retratar_abas.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/app/
---

> **ESTADO 06/09/2026: feita** — as dez fotos existem e o README mostra o produto (05/09).

# D-18 · A documentação passa a retratar as DEZ abas novas

> **Ela decidiu, 05/09/2026:** a documentação retrata as dez abas da interface
> nova. As fotos publicadas hoje são de uma janela que **nenhum lançador abre**
> — e uma delas é de uma aba que uma decisão dela matou há dez dias.

**METADE DISTO JÁ ESTÁ NA ÁRVORE, e não é desta sprint.** Uma frente paralela
fechou o TEXTO no mesmo dia: a página nova das dez, o de-para da janela antiga,
a nota datada no `interface.md` e os ponteiros do `README.md` (ver a §1). Ela
deixou dez marcadores de imagem esperando e escreveu por quem: *"a frente que
fotografa as abas"*.

**Esta sprint é essa frente, e ela é só a FOTO e os PORTÕES.** Quem executá-la
não reescreve uma linha de prosa daquelas páginas.

---

## 1. O QUE SE MEDIU

### O retratista fotografa a janela velha, e diz isso na primeira linha

```
"""Retrata as ONZE abas da janela, com o card do controle vivo dentro.
```
— `scripts/gui-captura/retratar_abas.py:1`

Ele monta `src/hefesto_dualsense4unix/gui/main.glade` (`:196`) numa
`Gtk.OffscreenWindow` e grava em `docs/usage/assets` (`:201`), com os nomes
declarados em `NOMES` (`:261-273`). O nono deles:

```python
    "readme_emulacao",
```
— `retratar_abas.py:270`

**Essa aba morreu por decisão dela em 26/08/2026:**

> | **Abas** | 11 | **10** | **a Emulação morre** e a No jogo funde com a Status |
>
> — `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md:17`

E o retratista tem função dedicada a montá-la: `_montar_aba_emulacao`
(`retratar_abas.py:1870`), 80 linhas alimentando um host de mentira para
publicar *"Device: Microsoft X-Box 360 pad"* e *"Buffer: 150"*.

### A documentação publica essas fotos como se fossem o produto

| onde | o que diz |
| --- | --- |
| `README.md:51-61` | onze imagens `readme_…png` de `docs/usage/assets/`, sob o título **"## A janela"** |
| `README.md:59` | `[![Emulação](docs/usage/assets/readme_emulacao.png)]` |
| `docs/usage/interface.md:575-577` | a seção `## Emulação` e a foto dela |

As seções de `interface.md` são catorze `##`, e onze são abas da janela GTK:
Início · Status · No jogo · Gatilhos · Lightbar · Rumble · Perfis · Sistema ·
Emulação · Navegação · Configurações.

### E A METADE DE PROSA JÁ ESTÁ NO DISCO — medido em 05/09/2026, na árvore dela

**Uma frente paralela fechou o texto no mesmo dia, e esta sprint NÃO o
reescreve.** O que já está na árvore (`git status --short`, não commitado):

| arquivo | o que é |
| --- | --- |
| `docs/usage/AS-DEZ-ABAS-o-que-cada-uma-faz.md` | 469 linhas, doze `##` — o que cada uma das dez faz, lido das páginas que a janela renderiza. **É a página de hoje.** |
| `docs/usage/A-JANELA-ANTIGA-o-que-mudou-de-lugar.md` | 102 linhas — o de-para das onze antigas, com a Emulação espalhada por cinco donos |
| `docs/usage/interface.md:3-27` | a **NOTA DATADA** que diz *"ESTA PÁGINA DESCREVE A JANELA APOSENTADA … As capturas abaixo são da janela antiga e não serão atualizadas"* |
| `README.md:63-70` | o "aba por aba" repontado para a página nova, e a ressalva *"As imagens acima são da janela antiga … As capturas novas vêm da frente que refotografa as abas"* |

**Isso muda três coisas nesta sprint, e a maior é uma que eu tinha errado:**

1. **As onze fotos velhas NÃO SE APAGAM.** O `interface.md` fica como registro
   datado e continua publicando-as. Apagá-las quebraria a página que a frente
   paralela acabou de declarar registro.
2. **Os nomes dos dez arquivos já estão escritos**, e são os dos marcadores que
   aquela página deixou esperando (`AS-DEZ-ABAS…:21`: *"As imagens ainda não
   estão no disco … esperam a frente que fotografa as abas"*).
3. **`interface.md` não é mais alvo desta sprint.** O que sobra é o `README.md`
   e a página nova.

### O lançador instalado abre OUTRA coisa

```
.desktop → interface.sh → run.sh --gui → scripts/abrir_interface.py
        → src/hefesto_dualsense4unix/interface/hefesto_vivo.py
```

`interface.sh` diz por que passa pelo `run.sh` (*"UM CÉREBRO, UMA CARA … Duas
rotas separadas para a mesma janela é como uma delas fica para trás sem ninguém
ver"*) e `run.sh:100` faz o `exec python3 scripts/abrir_interface.py`. As dez
páginas que ele renderiza estão em
`src/hefesto_dualsense4unix/interface/paginas/01-jogar.html … 10-perfis.html`, e
a lista com os rótulos tem dono:

```python
ABAS = [("Jogar","01-jogar"),("Controles","02-controles"),("Gatilhos","03-gatilhos"),
        ("Iluminação","04-iluminacao"),("Vibração","05-vibracao"),("Navegação","06-navegacao"),
        ("Lançadores","07-lancadores"),("Conexões","08-conexoes"),("Sistema","09-sistema"),
        ("Perfis","10-perfis")]
```
— `src/hefesto_dualsense4unix/interface/monta.py:137-140`

### E os dois portões da foto olham só para a janela velha

```python
CODIGO_DA_TELA = (
    "src/hefesto_dualsense4unix/app",
    "src/hefesto_dualsense4unix/gui",
    "scripts/gui-captura",
)
```
— `tests/unit/test_as_fotos_acompanham_a_versao.py:116-120`, copiado deliberadamente
em `scripts/check_fotos_da_tela.py:93-97` (o gancho de `pre-commit`), com
`test_as_duas_listas_de_codigo_de_tela_sao_a_mesma`
(`tests/unit/test_o_gancho_cobra_a_foto_da_tela.py:277-290`) trancando as duas.

**`src/hefesto_dualsense4unix/interface` NÃO ESTÁ NA LISTA.** Consequência
medida: mexer nas dez abas novas não torna foto nenhuma suspeita, e mexer no
motor VELHO obriga a refotografar a janela velha — o portão cobra a foto errada
e é cego à certa.

**O portão irmão já foi corrigido, e os dois estão a dois dias de distância.**
`scripts/check_regua_de_tela.py:144-160` — o que cobra RÉGUA de tela — recebeu
`"src/hefesto_dualsense4unix/interface"` em 03/09/2026, com a razão escrita:
*"O portão que existe para induzir régua de tela ficava CALADO diante de
qualquer mudança numa página publicada."* O portão da FOTO não foi junto.

### O portão que arrastaria a documentação de volta

`tests/unit/test_a_documentacao_conhece_todas_as_abas.py` deriva a lista de abas
do **próprio glade** (`GLADE`, `:57`) e a lista de fotos do **retratista**, lendo
`NOMES` e `ABAS_ESTICADAS` por `ast`. Ele exige:

* `test_toda_aba_do_glade_tem_secao_no_interface` (`:150`) — cada aba do glade
  tem um `## <rótulo>` no `interface.md`;
* `test_toda_foto_do_retrato_aparece_no_readme` (`:166`) — cada nome de `NOMES`
  citado no `README.md` **e** no `interface.md`.

**Ele conhece exatamente UM produto, e é o aposentado.** As dez abas de hoje
podem nascer, mudar de nome ou sumir sem que ele diga uma palavra; a página nova
que a frente da prosa acabou de escrever não é vigiada por régua nenhuma. É o
instrumento que mede o mundo de ontem, e a assinatura é a mesma das vinte e
quatro vermelhas de hoje.

---

## 2. A ROTA: um retratista NOVO, e o velho fica onde está

**Não se reescreve o `retratar_abas.py`.** Ele tem 2853 linhas, monta o glade,
veste cinco hosts de mentira e tem função por aba da janela GTK — **nada disso
existe numa página WebKit.** Reescrevê-lo no lugar seria um programa novo usando
o nome do velho, e **30 arquivos de `tests/` e `scripts/` o citam** (medido:
`grep -rln retratar_abas tests/ scripts/`), inclusive `test_a_foto_monta_como_o_produto_monta.py`,
`test_p10_a_foto_nao_publica_o_glade_cru.py` e `test_retrato_das_abas_nao_vaza_dado_real.py`.

O retratista das dez **não precisa de nada disso**, porque o piloto já é o
motor: ele abre a página, espera o tique, e fotografa.

```bash
.venv/bin/python src/hefesto_dualsense4unix/interface/hefesto_vivo.py \
    --oculta --abre 03 --segundos 3 --foto docs/usage/assets/aba03-gatilhos.png
```

As quatro chaves existem: `--oculta` (`hefesto_vivo.py:3199`), `--abre`
(`:3211`, aceita `03`, `03-gatilhos` ou o arquivo, e **reprova** em página que
não existe), `--segundos` (`:3202`) e `--foto` (`:3210`).

**`--foto` toma UM caminho** (`:3210`) e `_relatar` dispara uma vez só
(`:3071-3082`), então a primeira versão do retratista novo é **um processo por
aba, dez ao todo** — dirigidos por `scripts/gui-captura/retratar_as_dez.py`, que
lê a lista de `monta.ABAS` e não a digita. Um `--fotos <pasta>` no piloto
economizaria nove carregamentos; **é do dono do piloto (ONDA0-P), está no
`nao_toca` desta sprint, e fica DECLARADO aqui em vez de esquecido.**

---

## 3. O TRABALHO, EM SEIS PASSOS

### Passo 1 — `scripts/gui-captura/retratar_as_dez.py`

Lê a lista de `monta.ABAS` (`interface/monta.py:137`), chama o piloto uma vez
por aba com `--oculta`, e grava em `docs/usage/assets/`. **`--oculta` não é
opção: ela tem UMA tela**, e uma janela que nasce na frente dela quebra o que
ela está fazendo.

Ele expõe `NOMES` como o velho — é dessa constante que o portão da §3/Passo 5 vai
ler a lista, por `ast`, sem importar o módulo.

**A MORDIDA:** aponte o `--abre` para uma aba que não existe (`--abre 11`) e o
retratista tem de sair com erro, não com um PNG a menos e `rc=0`. O piloto já
reprova (`:3066`, *"não existe a página pedida"*); o que se prova aqui é que o
retratista **não engole** essa saída — foi assim que uma leva inteira foi
fotografada sem o objeto que ela mudava (`retratar_abas.py:54-56`).

### Passo 2 — os nomes dos arquivos, e eles JÁ ESTÃO ESCRITOS

**Não invente nome.** A frente da prosa deixou dez marcadores esperando em
`docs/usage/AS-DEZ-ABAS-o-que-cada-uma-faz.md`, e é para eles que o retratista
grava:

```
aba-01-jogar.png       aba-06-navegacao.png
aba-02-controles.png   aba-07-lancadores.png
aba-03-gatilhos.png    aba-08-conexoes.png
aba-04-iluminacao.png  aba-09-sistema.png
aba-05-vibracao.png    aba-10-perfis.png
```

O prefixo `aba-` separa as duas séries dentro da mesma pasta sem ambiguidade
nenhuma: `readme_*` é a janela aposentada, `aba-NN-*` é o produto de hoje.

**Não medido:** se alguma das dez páginas passa de 1080 px e precisa de uma foto
`_inteira`, como a Configurações da janela velha (`ABAS_ESTICADAS`,
`retratar_abas.py:2270`). A Conexões é a candidata — o redesenho mediu **2465 px
numa janela de 1080** para a aba que virou Conexões
(`2026-08-26-O-REDESENHO-as-dez-abas.md:95`). **Meça antes de decidir**, e se
precisar, o nome segue o padrão: `aba-08-conexoes-inteira.png`.

### Passo 3 — as onze fotos velhas FICAM

**Isto inverte o que parecia óbvio, e a razão é do disco.** O
`docs/usage/interface.md` foi declarado **registro datado** pela frente da prosa
(`:3-27`), continua publicando as onze, e a própria nota diz: *"As capturas
abaixo são da janela antiga e não serão atualizadas."*

Apagar os PNGs quebraria a página que acabou de ser declarada registro — e
*"documento inteiro que descreve algo que existiu ganha nota, não sumiço"* é a
frase daquela nota, que é a regra desta casa aplicada ao caso.

**Então nada sai de `docs/usage/assets/`.** As duas séries convivem, e o que as
distingue não é a pasta: é o prefixo do nome e a nota no topo de cada página.

### Passo 4 — o `README.md`, e SÓ ele

**`README.md:46-70`.** A tabela "## A janela" passa às dez, na ordem e com os
rótulos de `monta.ABAS` — lidos de lá, não escritos à mão. E o parágrafo de
ressalva que a frente da prosa deixou (`:66-70`, *"As imagens acima são da
janela antiga … As capturas novas vêm da frente que refotografa as abas"*)
**sai**: ele existe porque a foto faltava, e esta sprint é a foto.

O ponteiro do "aba por aba" (`:63-64`) **já aponta** para
`docs/usage/AS-DEZ-ABAS-o-que-cada-uma-faz.md`. Não mexa.

**`docs/usage/interface.md` está no `nao_toca` desta sprint.** A frente da prosa
é dona dele hoje, e a página não descreve o produto de agora.

**`docs/usage/AS-DEZ-ABAS-o-que-cada-uma-faz.md`** ganha as imagens pelos
marcadores que já tem, e perde a caixa que diz *"As imagens ainda não estão no
disco"* (`:21-23`). **É a única linha a apagar naquele arquivo** — o texto das
dez seções é da outra frente e não se reescreve aqui.

**A MORDIDA deste passo:** apague um dos dez PNGs depois de gerá-los e
`test_toda_foto_do_retrato_aparece_no_readme` (retargetado no Passo 5) tem de
reprovar nomeando o arquivo. Se passar, o portão está lendo a lista velha.

### Passo 5 — os portões passam a vigiar a interface nova

**Três arquivos, e a ordem importa:**

1. `tests/unit/test_as_fotos_acompanham_a_versao.py:116` — acrescente
   `"src/hefesto_dualsense4unix/interface"` a `CODIGO_DA_TELA`.
2. `scripts/check_fotos_da_tela.py:93` — a mesma linha, na cópia deliberada.
   `test_as_duas_listas_de_codigo_de_tela_sao_a_mesma`
   (`test_o_gancho_cobra_a_foto_da_tela.py:277`) reprova se você fizer só uma.
3. `tests/unit/test_a_documentacao_conhece_todas_as_abas.py` — **as DUAS listas
   trocam de dono, e agora são duas séries em vez de uma:**
   * as abas de HOJE vêm de `monta.ABAS`, não do `main.glade` (`GLADE`, `:57`),
     e cada uma tem de ter `## <rótulo>` em
     `docs/usage/AS-DEZ-ABAS-o-que-cada-uma-faz.md`;
   * as fotos de HOJE vêm do retratista novo e têm de aparecer no `README.md`
     **e** naquela página;
   * as onze fotos da janela aposentada continuam sendo cobradas **só no
     `interface.md`**, que é onde elas moram agora. Tirar a cobrança inteira
     deixaria a página do registro apodrecer sem ninguém ver.

   **O argumento do cabeçalho dele continua valendo palavra por palavra** —
   *"uma lista escrita à mão aqui envelheceria junto com a documentação que ela
   deveria vigiar"* —, só muda quais são os donos.

**`check_regua_de_tela.py` NÃO muda:** ele já cita `interface` desde 03/09
(`:156`), e `test_a_tela_deste_portao_contem_a_do_portao_da_foto`
(`test_o_gancho_induz_a_regua_de_tela.py:261-277`) exige que a lista da foto
esteja CONTIDA na dele. Depois do passo 1 as duas coincidem, e o teste passa —
**mas confira**, porque é a única direção que ele mede.

**A ARMADILHA DESTE PASSO, e ela é certa:** no instante em que
`interface` entra em `CODIGO_DA_TELA`, o último commit de tela passa a ser um
commit de `interface/`, que é **muito** mais novo que qualquer foto — e o portão
fica VERMELHO. **É a pressão pretendida**, e a saída é a mesma de sempre: as dez
fotos novas entram no MESMO commit, ou, se elas não mudarem bytes numa execução
seguinte, a linha em `docs/usage/assets/CONFERIDO-EM.txt` nomeando o SHA. Nunca
refotografe só para gerar bytes: *"a foto carrega o estado VIVO da máquina de
quem a tira"* (o texto do próprio portão, `:271-274`).

### Passo 6 — a procedência

`docs/usage/assets/PROVA-DA-FOTO.txt` e `CONFERIDO-EM.txt` descrevem a bancada
do retratista velho. Acrescente a do novo, e **a diferença de risco é a que
importa**: o `retratar_abas.py` promete, com todas as letras, que *"ele nunca
fala com o daemon"* (`:67-70`) — monta o glade do zero e alimenta o card com
dublês de MAC falso.

**O piloto FALA com o daemon.** É a razão de ele existir. Então a foto das dez
carrega o estado vivo da máquina de quem a tira: quantos controles na mesa, a
cor lida de cada um, o nome do perfil ativo, e o que a aba Sistema estiver
mostrando naquele segundo.

**Isso muda a garantia de anonimato**, e o próprio retratista velho escreve a
regra: *"Se algum dia isto mudar, a foto passa a precisar de revisão humana
antes de ir para o repositório."* (`:80-82`). Escreva no `PROVA-DA-FOTO.txt`
qual é a bancada de cada série, e **confira as dez com o olho antes de commitar**
— o `tests/unit/test_docs_mac_anonimato.py` e o
`scripts/check_endereco_de_radio.py` não varrem imagem.

**Não medido, e é o primeiro a medir:** se o piloto aceita mesa de mentira
(estado do daemon vindo de fixture) como o `--mesa-cheia` do velho aceita. Se
aceitar, a foto volta a ser de bancada e a revisão humana deixa de ser
obrigatória — **é a resposta que mais barateia esta sprint, e ela cabe em dez
minutos de leitura do piloto.**

---

## 4. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois:

* **O `retratar_abas.py` inteiro, e os 30 arquivos que o citam.** Ele continua
  fotografando a janela GTK enquanto ela existir. Quem a aposenta é a D-19, e
  esta sprint está no `nao_toca` dele de propósito.
* **Os dois portões da foto continuam sendo DOIS**, com a cópia deliberada e o
  teste que as tranca. Nada aqui os funde.
* **O portão continua sendo de PROCEDÊNCIA, não de conteúdo.** Ele não diz que a
  foto está certa; diz que alguém conferiu depois da última mexida
  (`test_as_fotos_acompanham_a_versao.py:16-25`). A segunda porta, a declaração
  por SHA, continua sendo a saída para quando nada muda.
* **A regra "antes de gerar release, rode de novo"** (`CLAUDE.md`) passa a valer
  para os DOIS retratistas enquanto os dois existirem.
* **`perfis-jogo-da-steam.png`, `social-preview.png` e `dialogos/`** ficam.
  `retratar_dialogos.py` fotografa DIÁLOGO, não aba, e não é assunto desta
  sprint.
* **AS ONZE FOTOS VELHAS FICAM NO DISCO**, e o `interface.md` continua
  publicando-as como registro datado da janela aposentada. Nenhuma sai.
* **As duas páginas que a frente da prosa criou** — `AS-DEZ-ABAS-o-que-cada-uma-faz.md`
  e `A-JANELA-ANTIGA-o-que-mudou-de-lugar.md` — não têm o texto reescrito aqui.
  Esta sprint só põe as imagens nos marcadores da primeira.
* **A tabela "## A janela" continua sendo a primeira coisa que alguém vê no
  `README.md`.** Ela muda de conteúdo, não de lugar nem de propósito.
* **O ponteiro do README para a página nova** (`:63-64`) já existe e fica.

---

## A PROVA DE TELA

Esta sprint **É** prova de tela: a entrega são dez fotos. Elas vão para o olho
dela antes do commit — `PROVA-DE-TELA-01`, a regra mais velha desta casa, e a
palavra final é dela.

**A janela não nasce na tela dela.** `--oculta` em todas as dez execuções, sem
exceção.
