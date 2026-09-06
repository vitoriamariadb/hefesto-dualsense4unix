#!/usr/bin/env bash
# despachar-agente.sh — uma árvore de git por agente, e o prompt nasce do disco.
#
# POR QUE ELE EXISTE, e a raiz das três falhas de 23/08/2026 dita ao contrário:
# o contexto do agente morava na cabeça de quem coordenava, e cabeça não
# sobrevive a um `/clear`. Aqui ele é GERADO do disco.
#
# O QUE O WORKTREE RESOLVE, e por construção, não por disciplina:
#   - `git add -A` de um agente NÃO enxerga o índice do outro (índices separados
#     por desenho do git). A falha em que um commit engoliu sete arquivos do
#     vizinho vira impossível.
#   - a suíte de um lê uma árvore que ninguém mais escreve. Não existe "estado
#     transitório do vizinho" para medir — o defeito que produziu 13 vermelhos
#     falsos num relatório de ontem.
#   - colisão de posse degrada de sobrescrita SILENCIOSA para conflito de merge
#     BARULHENTO, que é a diferença entre perder trabalho e ser avisado.
#
# O REGISTRO DO QUE ESTÁ EM VOO É O `git worktree list`, mantido pelo git e
# limpo por `git worktree prune`. Nenhum agente precisa lembrar de liberar nada
# — que era a pergunta sem resposta boa de qualquer desenho com arquivo de lock.
#
# Uso:
#   scripts/despachar-agente.sh <sprint> <agente>   imprime o preâmbulo do prompt
#   scripts/despachar-agente.sh --listar            o que está em voo
#   scripts/despachar-agente.sh --limpar            remove worktrees já integrados
#
# HEFESTO_BASE=<branch>  de onde a árvore do agente NASCE (padrão: `dev`).
#   A segunda onda de uma leva precisa disto: as dez frentes da ONDA 2 usam
#   as peças que a ONDA 0 entregou, e nascer de `dev` as faria regenerar as
#   páginas sem elas — em silêncio.
set -euo pipefail

RAIZ="$(git rev-parse --show-toplevel)"
VOO="${HEFESTO_VOO:-$(dirname "$RAIZ")/hefesto-voo}"

_listar() {
  echo "EM VOO — segundo o git, que é quem mantém este registro:"
  git -C "$RAIZ" worktree list --porcelain \
    | awk '/^worktree /{w=$2} /^branch /{print "  " $2 "  ->  " w}' \
    | grep -v "refs/heads/dev" || echo "  (nenhum)"
}

_limpar() {
  git -C "$RAIZ" worktree prune

  # E o que JÁ FOI COSTURADO sai também. Um worktree cuja branch já está inteira
  # dentro de `onda/atual` não guarda trabalho nenhum que o git não tenha: ele é
  # 59 MB e um nome na lista. `--merged` é quem responde, não a nossa memória.
  local integrada wt br
  if git -C "$RAIZ" rev-parse --verify -q onda/atual >/dev/null; then
    while read -r br; do
      case "$br" in refs/heads/voo/*) ;; *) continue ;; esac
      wt="$(git -C "$RAIZ" worktree list --porcelain \
            | awk -v alvo="$br" '/^worktree /{w=$2} $0=="branch "alvo{print w}')"
      [ -n "${wt:-}" ] || continue
      # Trabalho não commitado NUNCA é descartado por este comando: em 05/08 uma
      # leva inteira ficou horas no índice e morreu com a sessão. Sujo fica.
      if [ -n "$(git -C "$wt" status --porcelain 2>/dev/null)" ]; then
        echo "  mantido (tem coisa não commitada): $wt"
        continue
      fi
      echo "  já em onda/atual, removendo: $wt"
      git -C "$RAIZ" worktree remove "$wt" 2>/dev/null || true
    done < <(git -C "$RAIZ" for-each-ref --format='%(refname)' --merged onda/atual refs/heads/voo)
  fi

  echo "worktrees órfãos podados. O que resta:"
  _listar
}

case "${1:-}" in
  --listar) _listar; exit 0 ;;
  --limpar) _limpar; exit 0 ;;
  ""|-h|--help)
    sed -n '2,30p' "$0" | sed 's/^# \?//'
    exit 0 ;;
esac

SPRINT="$1"
AGENTE="${2:?falta o nome do agente}"

# O caminho da sprint tem de EXISTIR, e a recusa tem de NOMEAR ONDE PROCUROU.
# Um caminho morto que passa em silêncio é a cicatriz do
# `validar-acentuacao.py --check-file`, que devolvia rc=0 contra arquivo
# inexistente — portão cego é pior que portão nenhum. E "não achei" sem dizer
# onde procurou faz a próxima pessoa procurar de novo, no mesmo lugar.
#
# A ORDEM IMPORTA: a recusa vem ANTES do `git worktree add`. Criar a árvore e
# só depois descobrir que a sprint não existe custa 59 MB, um nome na lista e um
# agente que descobre sozinho, tarde.
PROCUREI="$RAIZ/docs/process/sprints (maxdepth 2, casando *${SPRINT}*.md)"
# QUEM DECLARA O ID GANHA, e o glob do nome é só o desempate. Medido em
# 06/09/2026: `STEAM-INPUT-01` casa com DOIS arquivos — o de 26/07, sem
# frontmatter, e o de 06/09, que é o que se despacha. O `head -1` pegava o de
# 26/07 e o despacho morria dizendo "não declara posse" sobre o arquivo errado,
# com a sprint certa aberta na lista viva do lado. Casar pelo `sprint:` do
# frontmatter, que é o dono do id, resolve a classe inteira.
#
# O `|| true` NÃO É ENFEITE, e ele é defeito MEDIDO em 06/09/2026: este script
# roda com `set -euo pipefail`, e numa ATRIBUIÇÃO simples o `set -e` mata o
# script quando o comando falha. `grep -rl` devolve 1 quando não acha nada — que
# é exatamente o caso da sprint inexistente —, então o despacho morria MUDO, com
# rc=1 e saída vazia, no lugar de dizer onde procurou. Quatro réguas de
# `test_portao_o_caminho_morto_nomeia.py` acusaram, e é o que elas existem para
# pegar: a recusa tem de NOMEAR.
ARQ_SPRINT="$(grep -rl --include='*.md' -E "^sprint: *${SPRINT} *$" \
              "$RAIZ/docs/process/sprints" 2>/dev/null | head -1 || true)"
[ -n "$ARQ_SPRINT" ] || ARQ_SPRINT="$(find "$RAIZ/docs/process/sprints" -maxdepth 2 -name "*${SPRINT}*.md" 2>/dev/null | head -1)"
if [ -z "$ARQ_SPRINT" ]; then
  {
    echo "ERRO: nenhuma sprint casa com '${SPRINT}'."
    echo "  procurei em: ${PROCUREI}"
    echo "  nenhum worktree foi criado."
    echo "  para ver o que existe: ls ${RAIZ}/docs/process/sprints/"
  } >&2
  exit 1
fi

# E A SPRINT TEM DE DECLARAR O QUE POSSUI. A pressão fica AQUI, no despacho, e
# não numa reprovação de portão: é o momento em que alguém já ia ler aquela
# sprint de qualquer jeito, e uma sprint por vez em vez de vinte e três de uma
# vez -- que seria um portão desligado na segunda-feira.
#
# Sem isto o agente nasce sem saber o que possui, que é a Falha 3 de 23/08
# (quatro colisões de posse, nenhuma declarada) com o desperdício de um worktree
# por cima. `HEFESTO_SEM_POSSE=1` existe só para o dublê do portão.
if [ -z "${HEFESTO_SEM_POSSE:-}" ] && [ -x "$RAIZ/scripts/check_colisao_de_sprints.py" ]; then
  if ! python3 "$RAIZ/scripts/check_colisao_de_sprints.py" --exigir "$SPRINT" >/dev/null 2>&1; then
    {
      echo "ERRO: '${SPRINT}' não declara posse no topo do arquivo."
      echo "  sprint:   ${ARQ_SPRINT}"
      echo "  o formato está no cabeçalho de scripts/check_colisao_de_sprints.py"
      echo "  nenhum worktree foi criado."
      python3 "$RAIZ/scripts/check_colisao_de_sprints.py" --exigir "$SPRINT" 2>&1 | sed 's/^/  /'
    } >&2
    exit 1
  fi
elif [ -z "${HEFESTO_SEM_POSSE:-}" ]; then
  # Ausência NÃO passa em silêncio: portão que some sem dizer é portão cego, e a
  # casa já pagou por um (`validar-acentuacao.py --check-file`, rc=0 contra
  # arquivo inexistente).
  echo "AVISO: scripts/check_colisao_de_sprints.py não está nesta árvore;" >&2
  echo "       a posse desta sprint NÃO foi conferida." >&2
fi

# A BASE DA ÁRVORE — `dev` por padrão, e trocável por onda.
BASE="${HEFESTO_BASE:-dev}"
if ! git -C "$RAIZ" rev-parse --verify -q "$BASE" >/dev/null; then
  {
    echo "ERRO: a base '${BASE}' não existe neste repositório."
    if [ -n "${HEFESTO_BASE:-}" ]; then
      echo "  veio de: HEFESTO_BASE=${HEFESTO_BASE}"
    else
      echo "  veio do padrão do script"
    fi
    echo "  nenhum worktree foi criado."
    echo "  para ver o que existe: git -C ${RAIZ} branch --list"
  } >&2
  exit 1
fi

BRANCH="voo/${SPRINT}-${AGENTE}"
WT="${VOO}/${SPRINT}-${AGENTE}"

if [ ! -d "$WT" ]; then
  mkdir -p "$VOO"
  # A BASE É `dev` POR PADRÃO, E ISSO ESTAVA CRAVADO ATÉ 04/09/2026.
  #
  # O defeito aparece na segunda onda de uma leva: a ONDA 0 entrega as peças de
  # infraestrutura (a folha, o piloto) e as dez frentes da ONDA 2 as USAM. Com a
  # base cravada em `dev`, cada uma das dez nasce SEM as peças, e ou reescreve o
  # que já existe ou regenera as páginas apagando o CSS da onda anterior — em
  # silêncio, porque o gerador não sabe que a peça devia estar lá.
  #
  # A saída não é merge apressado na árvore DELA (a regra de 25/08 é explícita:
  # ela recebe a leva no fim, de uma vez). É poder dizer de onde a onda nasce:
  #
  #     HEFESTO_BASE=onda/po-0409 scripts/despachar-agente.sh <sprint> <agente>
  #
  # A base sai IMPRESSA no preâmbulo, porque agente que não sabe em que chão
  # pisa mede a árvore errada — é a mesma razão do `PYTHONPATH`.
  git -C "$RAIZ" worktree add -b "$BRANCH" "$WT" "$BASE" >/dev/null 2>&1 \
    || git -C "$RAIZ" worktree add "$WT" "$BRANCH" >/dev/null
fi

# A ARMADILHA DO EDITABLE INSTALL, e ela é a F2 ressuscitada dentro da cura.
# Medida em 24/08/2026: o `.pth` do venv carrega o caminho ABSOLUTO da árvore
# principal, então `.venv/bin/python` rodado de dentro do worktree importa o
# código do VIZINHO — o agente testaria o trabalho alheio achando que testa o
# seu. Por isso o PYTHONPATH nasce aqui, e nunca na cabeça de quem escreve o
# prompt.
cat > "$WT/.envrc-voo" <<ENV
export PYTHONPATH="${WT}/src"
export PYTEST_ADDOPTS="-p no:cacheprovider"
ENV

# O `CLAUDE.md` É `.gitignore:90`, LOGO ELE NÃO EXISTE NUMA ÁRVORE DE AGENTE.
# `git worktree add` não copia arquivo ignorado, e isto foi medido em 25/08/2026
# com OITO agentes já em voo mandados ler um arquivo que não estava lá. Copiar à
# mão é lembrança, e lembrança falha; aqui é parte do despacho.
if [ -f "$RAIZ/CLAUDE.md" ] && [ ! -f "$WT/CLAUDE.md" ]; then
  cp "$RAIZ/CLAUDE.md" "$WT/CLAUDE.md"
fi

# O `.envrc-voo` é do worktree e não da árvore: ele mora no `.git/info/exclude`
# LOCAL do worktree, e não no `.gitignore` versionado. Duas razões:
#   - se fosse versionado, entraria na branch e viajaria para o merge;
#   - se ficasse sem ignorar, todo `git status` de agente nasceria sujo, e um
#     agente que faz `git add -A` o commitaria com o caminho absoluto da árvore
#     dele dentro — que é dado da máquina, não do projeto.
_EXCLUDE="$(git -C "$WT" rev-parse --git-path info/exclude)"
mkdir -p "$(dirname "$_EXCLUDE")"
grep -qxF '.envrc-voo' "$_EXCLUDE" 2>/dev/null || echo '.envrc-voo' >> "$_EXCLUDE"

# O ESTADO DA BANCADA QUEM RESPONDE É O SEMÁFORO, não este script lendo o
# arquivo por conta própria. Ler o arquivo direto foi o que este bloco fazia
# até 25/08/2026, e era ERRADO: um arquivo de reserva cujo dono morreu continua
# existindo, e o preâmbulo dizia "OCUPADA" para uma bancada livre. Quem sabe
# ligar PID vivo e teto de tempo é `bancada.sh`, e ele é a única boca.
if [ -x "$RAIZ/scripts/bancada.sh" ]; then
  BANCADA="$(bash "$RAIZ/scripts/bancada.sh" status 2>/dev/null | head -1)"
else
  BANCADA="DESCONHECIDO — scripts/bancada.sh não existe nesta árvore; não toque no aparelho sem perguntar"
fi

cat <<PREAMBULO
=============================================================================
PREÂMBULO DO AGENTE — cole isto no início do prompt dele
=============================================================================

## A SUA ÁRVORE
Você trabalha em: ${WT}
Branch: ${BRANCH}
Nasceu de: ${BASE}

**NÃO edite nada em ${RAIZ}.** Aquela é a árvore dela, e outros agentes têm as
suas. A sua é isolada: o que você escreve aqui não atinge ninguém, e o que os
outros escrevem não atinge você.

## ANTES DE RODAR QUALQUER PYTHON
    cd ${WT} && source .envrc-voo

Sem isso o interpretador importa o código da árvore PRINCIPAL, e você testaria
o trabalho de outra pessoa achando que testa o seu. Foi medido; não é zelo.

## A SUA SPRINT
${ARQ_SPRINT}

Leia-a inteira antes de tocar em código, e siga o protocolo em
docs/process/COMO-EXECUTAR-UMA-SPRINT.md.

## A ORDEM DE PRECEDÊNCIA — quando duas fontes discordam

Regra dela, 06/09/2026: *"se ocorrer um conflito entre a sprint e o mapa dos
controles ou o csv do specs, o csv do specs e o mapa vencem a sprint em termo de
informações precisas. sempre."*

    1. O APARELHO         — o que você mediu nele agora
    2. O MAPA DE CANAIS   — docs/data/mapa-controles.csv (o csv do specs)
    3. A SUA SPRINT
    4. A lembrança de quem coordenou

**2 vence 3, sempre, em informação precisa** — canal, report id, offset,
comando, o que o aparelho aceita e o que ele aciona. O mapa é o DNA do aparelho
e foi construído medindo; uma sprint é um plano, e planos envelhecem. Se a sua
sprint disser um offset, um report id ou um caminho diferente do que está no
mapa, **o mapa está certo e a sprint está velha**: siga o mapa, e diga no
relatório qual linha da sprint caiu.

**1 vence 2** — e as duas metades desta regra são de 06/09. Uma célula do mapa
com \`aciona=não\`, ou com o grau da escada VAZIO, quer dizer **"ninguém remediu"**,
não **"não funciona"**: palavra dela, *"tá desatualizado no sentido de não ter
sido medido. foi e tudo funciona."* **Célula atrasada não veta trabalho.** Você
constrói, mede, e RELATA o que viu com a \`chave\` do mapa ao lado, para a célula
ser marcada — é essa a metade do fluxo que faltava nesta casa.

**O que NUNCA se faz:** parar um passo da sprint citando uma célula do mapa. Se
o que você mediu contradiz o mapa, o aparelho ganha e o mapa se remede.

**Você não edita \`docs/data/mapa-controles.csv\`** a menos que ele esteja na sua
\`posse:\`. Você o cita, e relata.

## A TELA DELA É UMA SÓ — E A SUA JANELA NÃO NASCE NELA

Regra dela, 04/09/2026: *"o app de validação, os testes, a parte de navegar na
interface tem que abrir na área de trabalho OS. Sempre. (…) faz isso pq abrindo
na tela Meow me quebra aqui no serviço."*

Ela está trabalhando no workspace \`Meow\` AGORA. Janela que nasce lá rouba o
foco dela, e o mouse dela passa a brigar com o seu clique.

**DESDE 04/09/2026 HÁ UMA GUARDA AUTOMÁTICA, e ela é a sua primeira linha
de defesa** (TELA-DELA-01 e 02): a suíte e os 21 scripts de \`scripts/\` que
abrem \`Gtk.Window\` desviam a janela para um \`Xvfb\` próprio, sozinhos. Você
não precisa fazer nada para isso funcionar, e verá em stderr:

    [tela] janela desviada para o Xvfb :NN — a tela dela não recebe nada

**NUNCA ponha \`HEFESTO_NA_TELA=1\`.** É o escape da guarda, e ligá-lo devolve
a janela para a sessão viva — a tela dela.

A guarda NÃO cobre o que você inventar: um script novo seu, um \`python -c\`
com GTK, um navegador chamado à mão. Para esses, valem os três passos:

1. **Prefira não abrir janela nenhuma** — \`Gtk.OffscreenWindow\`, \`--oculta\`,
   Playwright \`headless\`, \`scripts/gui-captura/retratar_abas.py\`. É quase
   sempre possível, e aí não há workspace a errar. Se o seu script novo abre
   \`Gtk.Window\`, chame a guarda — há régua que reprova quem não chama:

       from hefesto_dualsense4unix.utils.tela_de_mentira import (
           garantir_tela_de_mentira,
       )

       garantir_tela_de_mentira()
2. **Se a janela for inevitável**, ela nasce no \`OS\`:

       <script-de-workspace> run <comando...>     # roda e move a janela
       <script-de-workspace> browser              # navegador já parqueado
       <script-de-workspace> status               # diagnóstico

   O nome do script está em \`docs/process/COMO-OLHAR-A-TELA.md\`, no topo.

3. **Se o \`park\` recusar, ACEITE e diga na entrega.** Nunca force com
   \`AURORA_CLAUDE_WS_FALLBACK=1\`. E nunca rode \`peek\` nem \`goto\` por conta
   própria: os dois trocam o que ela está vendo.

A íntegra está em \`docs/process/COMO-OLHAR-A-TELA.md\`, no topo.

**E a irmã desta regra:** para matar processo, **PID conferido com
\`ps -o pid,ppid,cmd\`** — nunca padrão de nome. Um \`pkill -f 'cosmic-comp'\`
derrubou o compositor dela em 04/09.

## A BANCADA
Estado agora: ${BANCADA}

Antes de todo caminho que pare o daemon, escreva no aparelho ou chame
\`systemctl\`, rode:

    bash ${WT}/scripts/bancada.sh exigir

rc=1 significa ESPERAR e DIZER na entrega que está esperando — nunca contornar
por outro caminho, que é como se inventa medição falsa. A bancada é dela.

## O QUE A CASA ESPERA DE VOLTA — e é o que o costurador cobra

1. **A entrega** em \`docs/process/agentes/AAAA-MM-DD/<SPRINT>-<AGENTE>.md\`
   com os quatro cabeçalhos (\`## O que mudou\` · \`## Qual mordida prova\` ·
   \`## O que NÃO verifiquei\` · \`## O que sobrou para o próximo\`). Sem ela a
   costura recusa, por posição e não por conteúdo.
2. **Toda medição no aparelho ou no dublê citada pela \`chave\` do mapa**
   (\`docs/data/mapa-controles.csv\`, coluna 1) e pelo transporte, com o degrau da
   escada que alcançou (MONTOU · SAIU NO FIO · O APARELHO OBEDECEU · O JOGO
   RECEBEU · O JOGO REAGIU). É assim que a célula \`nao-medido\` vira medida —
   quem escreve o mapa é a SPECS-A-PROCEDENCIA-01, a partir do seu relatório.
3. **\`bancada: true\` não é licença.** Sem \`scripts/bancada.sh exigir\` com
   rc=0 você constrói com dublê e deixa a linha de prova para a
   MESA-DE-QUATRO-01 (\`D-0609-A-BANCADA-PROVA-NAO-BLOQUEIA\`). Esperar é
   dizer que esperou — nunca inventar a medição.
4. **O que caiu da sprint**, nomeado: toda linha do enunciado que o mapa ou o
   aparelho derrubou, com a célula ao lado. Silêncio aqui vira sprint velha
   despachada de novo.
5. **\`estado: feita\`** no arquivo da sprint, no mesmo commit da entrega.

## AO FECHAR: OS PORTÕES SÃO UM COMANDO SÓ

    cd ${WT} && source .envrc-voo
    git add -A                      # os portões são cegos a arquivo novo
    bash scripts/portoes.sh         # a lista inteira, e ela é a mesma do CI

\`--rapido\` roda só a camada de 5 s enquanto você trabalha. Não monte a sua
própria lista de portão: a que existe é conferida contra o \`ci.yml\` por
\`tests/unit/test_portao_a_lista_de_portoes_e_uma_so.py\`, e foi uma segunda
lista à mão que deixou o \`validar-caducos.py\` atravessar uma leva inteira.

## AO TERMINAR
Commite NA SUA BRANCH (${BRANCH}). Não faça merge, não toque em dev.
Quem coordena integra depois, e um conflito ali é barulho — que é o que se quer.

=============================================================================
PREAMBULO
