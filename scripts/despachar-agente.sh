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

# O caminho da sprint tem de EXISTIR. Um caminho morto que passa em silêncio é
# a cicatriz do `validar-acentuacao.py --check-file`, que devolvia zero contra
# arquivo inexistente — portão cego é pior que portão nenhum.
ARQ_SPRINT="$(find "$RAIZ/docs/process/sprints" -maxdepth 2 -name "*${SPRINT}*.md" | head -1)"
if [ -z "$ARQ_SPRINT" ]; then
  echo "ERRO: nenhuma sprint casa com '${SPRINT}' em docs/process/sprints/" >&2
  exit 1
fi

BRANCH="voo/${SPRINT}-${AGENTE}"
WT="${VOO}/${SPRINT}-${AGENTE}"

if [ ! -d "$WT" ]; then
  mkdir -p "$VOO"
  git -C "$RAIZ" worktree add -b "$BRANCH" "$WT" dev >/dev/null 2>&1 \
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

# O `.envrc-voo` é do worktree e não da árvore: ele mora no `.git/info/exclude`
# LOCAL do worktree, e não no `.gitignore` versionado. Duas razões:
#   - se fosse versionado, entraria na branch e viajaria para o merge;
#   - se ficasse sem ignorar, todo `git status` de agente nasceria sujo, e um
#     agente que faz `git add -A` o commitaria com o caminho absoluto da árvore
#     dele dentro — que é dado da máquina, não do projeto.
_EXCLUDE="$(git -C "$WT" rev-parse --git-path info/exclude)"
mkdir -p "$(dirname "$_EXCLUDE")"
grep -qxF '.envrc-voo' "$_EXCLUDE" 2>/dev/null || echo '.envrc-voo' >> "$_EXCLUDE"

BANCADA="livre"
if [ -r "${XDG_RUNTIME_DIR:-/run/user/$(id -u)}/hefesto-bancada.json" ]; then
  BANCADA="OCUPADA — leia o arquivo antes de tocar no daemon ou no aparelho"
fi

cat <<PREAMBULO
=============================================================================
PREÂMBULO DO AGENTE — cole isto no início do prompt dele
=============================================================================

## A SUA ÁRVORE
Você trabalha em: ${WT}
Branch: ${BRANCH}

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

## A BANCADA
Estado agora: ${BANCADA}

Se estiver OCUPADA, você NÃO para o daemon, NÃO escreve no aparelho e NÃO roda
comando de Bluetooth. Ela está medindo, e a bancada é dela.

## AO TERMINAR
Commite NA SUA BRANCH (${BRANCH}). Não faça merge, não toque em dev.
Quem coordena integra depois, e um conflito ali é barulho — que é o que se quer.

=============================================================================
PREAMBULO
