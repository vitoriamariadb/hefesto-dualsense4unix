# ONDE PARAMOS — o fim de 02/09, e as dez frentes que sobram

**Escrito a pedido dela ao desligar a máquina:** *"documenta o resto pro Claude
poder seguir seu trabalho."*

Este documento é o HANDOFF. Ele diz onde a árvore está, com que número, o que
falta, em que ordem, e as armadilhas que custaram este dia — inclusive a que
quebrou a sessão no fim.

---

## 0. OS SEIS COMANDOS DE QUEM CHEGA

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
source .envrc-voo                          # PYTHONPATH desta árvore
git log --oneline -1                       # tem de ser 70b58116 ou depois
git log --since=midnight --oneline | wc -l # o que a casa fechou hoje
git add -A && bash scripts/portoes.sh      # os 30, ~2 min
git worktree list                          # o que há em voo
```

**E LEIA ISTO ANTES DE RODAR QUALQUER COISA:** §5, a armadilha que quebrou a
sessão. Ela é sobre COMO você roda, não sobre o quê.

---

## 1. O ESTADO, medido em 02/09/2026 no fim do dia

| o quê | estado |
|---|---|
| branch | `dev`, árvore **limpa**, commit `70b58116` |
| commits no dia | **55** |
| portões | **30 verdes** |
| bancada × produto | as **13 páginas** batem — `o produto está atrás . 0` |
| suíte | 44 falhas nos 14 arquivos que falham, **IDÊNTICAS antes e depois da leva** — dívida herdada, ver §5.6 |
| daemon dela | vivo, perfil `meu_perfil`, modo DualSense, sem pausa |
| mesa | dois controles: um no rádio (`4446…`, primário) e um no cabo (`d42f…`) |

### O que entrou hoje

1. **A leva das treze frentes** — ligar a interface ao motor, território
   exclusivo por arquivo. Ver
   [a leva das treze frentes](2026-09-02-ONDE-PARAMOS-a-leva-das-treze-frentes.md).
2. **A onda do microfone**, com a auditoria que ela nunca tivera — três lentes
   adversárias, sete achados, sete curados. Dois eram de COMPORTAMENTO e iam
   direto para a mesa dela.
3. **A publicação das sete abas**, por ordem dela: *"publica as sete abas e
   continua as levas."*

---

## 2. A RÉGUA QUE DECIDE — e é a única honesta

```bash
.venv/bin/python -u src/hefesto_dualsense4unix/interface/hefesto_vivo.py \
    --oculta --prova-de-mockup --voltas-por-aba 8 --sem-cor > /tmp/regua.txt 2>&1
sed -n '/A RÉGUA DO MOCKUP/,/TODAS/p' /tmp/regua.txt
```

Ela abre cada aba OCULTA, retrata o DOM **virgem** antes de qualquer pintura,
deixa a pintura correr oito voltas (ela vive no TEMPO), lê a tela de novo e
compara com o valor **cravado no arquivo publicado**. Três montes:

| | o que significa |
| --- | --- |
| **PRODUTO** | o valor mudou — alguém pintou. É o número que sobe |
| **MOCKUP** | idêntico ao cravado, e ninguém o declara. **É o trabalho** |
| **INDECIDÍVEL** | o valor do produto COINCIDE com o do desenho. A régua prefere dizer quantos são a inventar certeza |

### O NÚMERO DE HOJE, e a série inteira para não repetir os erros

```
        régua                        diz              erra porque
  o plano (36%)                  37 de 103      presença de string no aNN_*.py
  a correção do orquestrador     63 de 103      conta o dono comum, ainda string
  a régua do mockup, ANTES      162 PRODUTO · 78 MOCKUP · 47 INDECID, de 287
  a régua do mockup, DEPOIS     188 PRODUTO · 69 MOCKUP · 73 INDECID, de 330
```

**A tela tem 330 campos, não 103.** Os dois primeiros números contavam NOMES
ÚNICOS de `data-campo`; o mesmo endereço se repete uma vez por coluna de
controle, e a `10-perfis` endereça por `data-hef`, que aquela régua nem olhava.

**O total SUBIU de 287 para 330 na publicação** porque as abas 06 e 07 ganharam
endereço onde não havia. O desenho não mudou um pixel — o portão
`desenho-aprovado` compara `o_que_se_ve()`, o HTML sem os endereços de pintura.

### Por aba, o retrato de agora

```
aba                     campos  PRODUTO  MOCKUP  INDECID
01-jogar.html               14        9       0        5
02-controles.html           23       14       1        8
03-gatilhos.html            52       41       8        3
04-iluminacao.html          15        7       3        5
05-vibracao.html            43       20      21        2
06-navegacao.html           29        3       0       26
07-lancadores.html          29        7      15        7
08-conexoes.html            32       22       3        7
09-sistema.html             12        7       0        5
10-perfis.html              81       58      18        5
TODAS                      330      188      69       73
```

**NÃO LEIA "PRODUTO" COMO "CERTO".** A régua conta se o valor MUDOU em relação
ao cravado — ela não sabe distinguir *pintar certo* de *destruir*. Foi assim que
a Vibração aparecia com 15 PRODUTO escrevendo a palavra `balanceado` DENTRO dos
quatro botões de degrau, e a Perfis com 75 escrevendo a contagem dentro do
`<tbody>` que continha a tabela. **Quando o número CAIR, pergunte se ele caiu
porque alguém parou de escrever errado.**

---

## 3. AS DEZ FRENTES QUE SOBRAM — divididas POR ARQUIVO

A divisão por arquivo é o que permite rodá-las juntas, cada uma na sua worktree,
e integrar por merge. **Duas frentes não podem tocar o mesmo arquivo.**

### FASE 1 — a frente que destrava as outras três

| # | frente | território exclusivo | por quê primeiro |
|---|---|---|---|
| 1 | **O PINTOR ganha `classe` e `cor`** | `interface/hefesto_vivo.py` (o `escrever()` do BOOTSTRAP) · `interface/regua_do_mockup.py` | **três frentes esperam por ela** |

`hefesto_vivo.escrever()` conhece **cinco** alvos — `texto`, `largura`, `fundo`,
`valor`, `html` — e **classe não é um deles**. Isso trava, hoje, medido:

```
05-vibracao   degrau-aceso   QUAL dos quatro degraus está aceso é a classe `on`
05-vibracao   mult-teto      o rótulo `Máx` que só existe quando está no teto
04-iluminacao player-1..4    qual botão de jogador acende (foram REMOVIDOS da
                             página porque nunca poderiam ser pintados)
02-controles  L3 / R3        na GTK o clique do analógico é COR, não texto —
                             hoje é `[L3]` por falta do alvo `cor`
```

**A segunda metade desta frente é a régua:** os INDECIDÍVEIS subiram de 47 para
**73**, e 26 deles estão na `06-navegacao`. A régua não separa "pintou igual" de
"não pintou". A cura provável: mudar um valor no daemon (ou no perfil) e ver se
a tela ACOMPANHA — o que transforma indecidível em decidido. **Mede-se com
dublê; não mande comando ao aparelho dela.**

### FASE 2 — as nove que rodam juntas

| # | frente | território exclusivo | o que fecha |
|---|---|---|---|
| 2 | **Vibração** | `pacotes/a05_vibracao.py` · `interface/aba05.py` | **21 mockup** — a maior. Espera a frente 1 para o `degrau-aceso` e o `mult-teto` |
| 3 | **Perfis** | `pacotes/a10_perfis.py` · `interface/aba10.py` | **18 mockup** + o PERFIL POR CONTROLE (o trabalho 4 do contrato) |
| 4 | **Lançadores** | `pacotes/a07_lancadores.py` · `interface/aba07.py` | **15 mockup** — a aba nasceu hoje e tem 29 endereços |
| 5 | **Gatilhos** | `pacotes/a03_gatilhos.py` · `interface/aba03.py` | **8 mockup** — e a decisão dela sobre a caixa de ajustes (§4) |
| 6 | **Iluminação** | `pacotes/a04_iluminacao.py` · `interface/aba04.py` | **3 mockup** + os `player-N` que voltam quando a frente 1 entregar |
| 7 | **Navegação** | `pacotes/a06_navegacao.py` · `interface/aba06.py` | os **26 INDECIDÍVEIS** — provar quais pintam e quais só coincidem |
| 8 | **Conexões** | `pacotes/a08_conexoes.py` | **3 mockup** — a melhor aba da casa, mexa pouco |
| 9 | **Controles** | `pacotes/a02_controles.py` | **1 mockup** + o `L3`/`R3` por COR quando a frente 1 entregar |
| 10 | **A recusa chega à tela** | `daemon/subsystems/hotkey.py` · `integrations/eleicao_de_microfone.py` · `daemon/ipc_handlers.py` | achado ANOTADO da auditoria do mic |

**A frente 10, explicada:** `resultado.motivo` — as cinco frases boas que
`eleicao_de_microfone` escreve (*"não há canal de captura atribuível a este
controle"*, *"o WirePlumber reelegeu por cima"*…) — sai **só em `logger.info`**.
Não há chave no `state_full`, nem no `mic.led.set`, nem no card. A regra da casa
é *"recusar dizendo é obrigatório, e a frase VAI PARA A TELA"*.

### O QUE FALTOU E NÃO É FRENTE DE CÓDIGO

**A prova de clique nas dez abas NÃO foi concluída** — a sessão foi interrompida
no meio da aba 03. É trabalho do orquestrador, serializado, e o instrumento
agora sabe passar alvo (a frente do Instrumento consertou isso hoje). Ver §5.1
para como rodá-la sem quebrar o terminal dela, e §5.2 para o que ela MUDA na
máquina.

---

## 4. O QUE ESPERA A PALAVRA DELA

Nada aqui bloqueia as dez frentes.

| # | o quê | por quê é dela |
|---|---|---|
| 1 | **A frase da prioridade em Perfis** | texto de tela. A proposta está marcada `PROVISÓRIO` em `perfis_web.prioridade_dica`: *"Quando dois perfis servem ao mesmo tempo, o de número maior entra."* |
| 2 | **A caixa de ajustes dos gatilhos não cabe** | o desenho reserva 4 casas à esquerda e 2 à direita; o produto tem modos de 5 (`Galloping`), 6 (`Machine`), 8 (`Custom`), 10 e 11 (`MultiPosition*`) parâmetros. É decisão de DESENHO |
| 3 | **PRAGMATA perdeu o wrapper do Hefesto** | a Steam comeu a linha entre duas leituras. Sem ele, no Bluetooth o jogo tende a não enxergar controle nenhum. O reparo escreve no `localconfig.vdf` dela, com a Steam fechada |
| 4 | **Os botões da janela à esquerda** | NÃO é o código: `gtk-decoration-layout = 'close,maximize,minimize:'` em `~/.config/gtk-3.0/settings.ini` e no `gsettings`. Para pôr à direita: `:minimize,maximize,close`. **Ninguém mexeu na configuração dela** |
| 5 | **A onda do microfone nunca foi tocada por ela** | ela entrou com auditoria, mas a parte de TELA continua sem prova de clique, e o LED no aparelho é medição que só ela faz |
| 6 | **`novo-hub`** | a onda devolveu `viavel: false`, *"a razão não é técnica"* |
| 7 | **A validação final** | *"Ao final eu faria apertando os botões."* É a última fase, e não bloqueia nada |

---

## 5. AS ARMADILHAS DESTE DIA

### 5.1 A QUE QUEBROU A SESSÃO — e é sobre COMO você roda

**Palavra dela:** *"para não deu certo. o terminal e nossa conversa tá
quebrando. rodou errado."*

Eu rodei o `--prova-no-aparelho` nas dez abas em sequência e, depois, um script
Python cuja saída trouxe bytes crus. A tela dela encheu de lixo binário e a
sessão teve de ser interrompida no meio de uma leva que ia bem.

**A REGRA QUE ISSO DEIXA — e ela vale para todo comando desta casa:**

```bash
comando_qualquer > /tmp/saida.txt 2>&1        # SEMPRE para arquivo
tail -20 /tmp/saida.txt                        # e leia só o que interessa
```

Nunca `print` de valor cru vindo do daemon ou do disco: serialize com
`json.dumps(..., ensure_ascii=False)` ou passe por `tr -cd '[:print:]'`. O
terminal dela é o MESMO em que a conversa acontece — saída volumosa ou binária
derruba as duas juntas, e o custo não é o comando perdido, é a sessão inteira.

### 5.2 A PROVA DE CLIQUE MUDA A MÁQUINA DELA

Medido hoje, duas vezes. O `--prova-no-aparelho` clicou e deixou:

```
gamepad_emulation.enabled   True  ->  False
gamepad_emulation.flavor    dualsense -> XBOX
mouse_emulation.enabled     False ->  True
```

**Leia o estado ANTES, leia DEPOIS, e devolva o que mudou** — e diga isso no
relatório. Os métodos para devolver:

```python
ponte.chamar("gamepad.emulation.set", enabled=True, flavor="dualsense")
ponte.chamar("mouse.emulation.set", enabled=False)
```

E ela roda numa máquina onde treze worktrees podem estar em voo: **a prova de
clique é do orquestrador, serializada, nunca das frentes.**

### 5.3 O `.envrc-voo` NÃO É VERSIONADO e aponta para a árvore DELA

Ele tem o caminho CRAVADO de `/mnt/Apate/…/hefesto-dualsense4unix/src`. Um
agente que o rode por hábito numa worktree testa o código DELA e lê o silêncio
como sucesso. Na worktree, faça à mão:

```bash
export PYTHONPATH="$PWD/src"
export PYTEST_ADDOPTS="-p no:cacheprovider"
PY=/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
$PY -c "import hefesto_dualsense4unix as h; print(h.__file__)"   # confira o caminho
```

### 5.4 O `portoes.sh` DÁ CINCO FALSOS VERMELHOS EM WORKTREE

Ele cai na venv da árvore PRINCIPAL do `git worktree list` quando não há venv
local — e a principal é a `…-estavel`, cuja venv está **vazia**. Sem isto, cinco
portões reprovam por `ModuleNotFoundError`:

```bash
export HEFESTO_PY=/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin/python
export PATH="/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix/.venv/bin:$PATH"
```

O `PATH` é para o `ruff` e o `shellcheck`, que são BINÁRIOS e não seguem o
`HEFESTO_PY`.

### 5.5 UM BRIEFING QUE TREZE AGENTES LEEM É UM ARQUIVO COM TREZE CÓPIAS

Escrevi os MACs REAIS dos dois controles dela no briefing da leva, e **cinco
frentes os copiaram para arquivos versionados**. A suíte pegou. A regra tem DOIS
níveis e eu tratei como um:

| onde | o que vale |
| --- | --- |
| documento | a **máscara** da casa — octetos 4 e 5 zerados (`d42f4b0000d8`) |
| fixture de teste | **faixa sintética** (`aabbcc`, `02fe00`, `e8473a`) — um MAC mascarado ainda carrega o OUI do aparelho dela |

### 5.6 A SUÍTE TEM 44 FALHAS HERDADAS, E O NÚMERO VARIA COM A ORDEM

Medido nos dois lados, com o MESMO comando: **44 falhas idênticas** antes e
depois de cada leva. Rodando os mesmos 14 arquivos em lotes separados dá 24;
juntos num processo dá 44. **Isso é dependência de ordem entre testes**, e é
dívida herdada — não regressão.

**Como separar o seu do herdado, e faça isso sempre:** rode os arquivos que
falharam contra a ponta de `dev` ANTES da sua leva. Se o número for o mesmo, não
é seu.

### 5.7 NUNCA `git checkout --` PARA DESFAZER UMA MORDIDA

Já custou trabalho quatro vezes nesta casa, e a quarta foi hoje: usei
`git checkout-index -f` para devolver uma cura e ele restaurou a versão do
ÍNDICE — que era a versão SEM a cura, porque eu não tinha feito `git add`.
**Guarde cópia da versão CURADA no `/tmp` antes de morder, e devolva por `cp`.**

### 5.8 O `--publicar` LIMPA O `mockup/DIVERGENCIAS.md`

Quem publicar para MEDIR (e reverter) tem de restaurar **os dois**: as páginas
e as divergências. O caminho seguro:

```bash
cp -r src/hefesto_dualsense4unix/interface/paginas /tmp/paginas-BOM
# … publica, mede …
rm -rf src/hefesto_dualsense4unix/interface/paginas
cp -r /tmp/paginas-BOM src/hefesto_dualsense4unix/interface/paginas
git show HEAD:mockup/DIVERGENCIAS.md > mockup/DIVERGENCIAS.md
```

### 5.9 O DEFEITO QUE UMA FRENTE SOZINHA NÃO PODE CURAR

`pacotes.normalizar()` comia a chave `blocos` — e com ela o mapa do gabinete
dela, montado a cada tique e jogado fora. **Quatro frentes independentes o
mediram**, cada uma pelo seu lado, e **nenhuma tinha território para curá-lo**:
a cura mora no `__init__.py` e as quatro estavam nos `aNN_*.py`.

**A lição de processo:** a divisão por arquivo é o que permite treze frentes sem
conflito — e é também o que produz defeitos que ninguém pode curar. **Quem
coordena tem de ler os relatórios procurando o que se REPETE.** O que aparece em
quatro relatórios diferentes é estrutural, não local.

---

## 6. COMO DESPACHAR A PRÓXIMA LEVA

O molde que funcionou hoje, duas vezes:

```
Fundação (as que outras esperam)  ->  as frentes em paralelo  ->  auditoria
```

**O que fez diferença, medido nas duas levas de hoje:**

- **Território exclusivo POR ARQUIVO, escrito no prompt.** Zero conflito de
  código em treze frentes; o único conflito de merge foi o
  `mockup/DIVERGENCIAS.md`, resolvido por união (cada aba declara a sua seção).
- **Proibir a prova de clique nas frentes.** Um daemon, dois controles, treze
  worktrees.
- **Mandar cada frente dizer QUE FATO a medição dela derrubou.** Trinta e nove
  caíram, e a maioria era de RÉGUA — inclusive um teste cujo título e docstring
  diziam *"0.7 vira 70%"* enquanto a linha exigia `== 0.7`. A tela obedeceu à
  linha.
- **Auditoria adversária com LENTES DISTINTAS, e o direito de aprovar.** Três
  lentes sobre a onda do mic acharam sete defeitos, dois deles de comportamento
  — um tirava o microfone da Jogadora 1 quando o Jogador 2 apertava o botão,
  com o LED dela aceso, no primeiro toque.
- **Mandar o corretivo PROVAR a acusação antes de corrigir.** Conferente também
  erra, e corrigir defeito que não existe é como se introduz um de verdade.
- **Copiar o `CLAUDE.md` para o scratchpad e apontar o caminho absoluto no
  prompt** — ele é `.gitignore:90` e NÃO viaja para worktree.

**A árvore de integração fica em** `/mnt/Apate/Desenvolvimento/hefesto-voo/_integra-rota`
(hoje na branch `onda/microfone`). A árvore dela recebe tudo no fim, de uma vez,
pelo merge em `dev` — e nunca troca de branch.

---

## 7. A REGRA QUE ESTE DIA DEIXA

**A régua que lê a TELA é a única que decide.** Duas vezes hoje um número de
código foi apresentado como se fosse funcionamento: o 77% (presença de string) e
o 61% (presença de string com o dono comum). Os dois estavam errados, e o
segundo era meu, escrito para corrigir o primeiro.

O que mede é abrir, esperar a pintura acontecer, ler o DOM e comparar com o que
o desenho cravou. Tudo o mais é estimativa.
