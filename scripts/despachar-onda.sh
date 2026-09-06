#!/usr/bin/env bash
# despachar-onda.sh — um LOTE de sprints vira N worktrees e UM arquivo de argumentos.
#
# POR QUE ELE EXISTE (06/09/2026, o plano para o Opus): despachar dezesseis
# sprints à mão são dezesseis vezes a mesma sequência — exigir, criar a árvore,
# copiar o CLAUDE.md, guardar o preâmbulo, montar o prompt — e a sequência à mão
# errou em 25/08 (oito agentes sem CLAUDE.md) e em 06/09 (worktree nascida da
# base errada). Aqui a sequência é UMA, e o que sai é o `args.json` que o
# workflow do orquestrador lê verbatim.
#
# Uso:
#   scripts/despachar-onda.sh <LOTE> <sprint> [<sprint>...]
#
#   HEFESTO_BASE   de onde as árvores nascem (padrão: onda/atual-0609)
#   HEFESTO_LOTES  onde os lotes moram (padrão: ../_lotes, ao lado da árvore de integração)
#
# O que sai, em ${HEFESTO_LOTES}/<LOTE>/:
#   <SPRINT>.preambulo.md   o preâmbulo do despachante, um por sprint
#   <SPRINT>.prompt.md      o prompt do agente, um por sprint
#   args.json               [{sprint, worktree, branch, sprint_arquivo, entrega, prompt_arquivo}]
#
# RECUSA ANTES DE CRIAR QUALQUER ÁRVORE: se UMA sprint do lote não está
# `estado: aberta`, nada é despachado — a metade de um lote em voo com a outra
# metade recusada é o que faz quem coordena perder a conta.
set -euo pipefail

RAIZ="$(git rev-parse --show-toplevel)"
LOTE="${1:?uso: despachar-onda.sh <LOTE> <sprint>...}"; shift
[ $# -gt 0 ] || { echo "ERRO: nenhuma sprint no lote ${LOTE}." >&2; exit 2; }
BASE="${HEFESTO_BASE:-onda/atual-0609}"
LOTES="${HEFESTO_LOTES:-$(dirname "$RAIZ")/_lotes}"
PASTA="${LOTES}/${LOTE}"
AGENTE="opus"
HOJE="$(date +%F)"

for SPRINT in "$@"; do
  python3 "$RAIZ/scripts/check_colisao_de_sprints.py" --exigir "$SPRINT" >/dev/null 2>&1 \
    || { echo "ERRO: '${SPRINT}' não está aberta ou não declara posse — lote ${LOTE} NÃO despachado." >&2; exit 1; }
done
git -C "$RAIZ" rev-parse --verify -q "$BASE" >/dev/null \
  || { echo "ERRO: a base '${BASE}' não existe." >&2; exit 1; }

mkdir -p "$PASTA"
: > "$PASTA/args.jsonl"
for SPRINT in "$@"; do
  PRE="$PASTA/${SPRINT}.preambulo.md"
  HEFESTO_BASE="$BASE" bash "$RAIZ/scripts/despachar-agente.sh" "$SPRINT" "$AGENTE" > "$PRE"
  WT="$(sed -n 's/^Você trabalha em: //p' "$PRE" | head -1)"
  BRANCH="$(sed -n 's/^Branch: //p' "$PRE" | head -1)"
  ARQ="$(sed -n '/^## A SUA SPRINT/{n;p;}' "$PRE" | head -1)"
  ARQ="${ARQ#"$RAIZ/"}"   # relativo: o agente lê o DELE, o costurador lê o daqui
  ENTREGA="docs/process/agentes/${HOJE}/${SPRINT}-${AGENTE}.md"
  PROMPT="Você é o agente da sprint ${SPRINT} do Hefesto (lote ${LOTE}). Trabalhe SÓ em ${WT}, branch ${BRANCH}.
1. Leia INTEIRO o preâmbulo em ${PRE} — é a sua árvore, a ordem de precedência (aparelho > mapa > sprint), a tela dela e a bancada. Depois \`cd ${WT} && source .envrc-voo\`.
2. Leia a sprint inteira: ${WT}/${ARQ}. A nota **ROTA CORRIGIDA** no topo vence o corpo dela. Confira que a sua árvore nasceu de ${BASE}: \`git log -1 --format=%h\` tem de ser o mesmo de \`git rev-parse --short ${BASE}\`.
3. Execute a sprint conforme docs/process/COMO-EXECUTAR-UMA-SPRINT.md. Regras que não se negociam: célula atrasada do mapa NÃO veta (você constrói, mede e relata pela \`chave\`); \`bancada: true\` não é licença — sem \`bash scripts/bancada.sh exigir\` com rc=0 você usa dublê e deixa a prova de aparelho para a MESA-DE-QUATRO-01; nunca install.sh, nunca sudo, nunca MAC real nem serial em arquivo; saída de comando em arquivo; janela sempre \`--oculta\`; texto de tela vem de docs/A-LINGUA-DESTA-CASA-o-glossario-que-a-tela-e-o-codigo-falam.md e a palavra \"mesa\" não entra na tela.
4. Feche: \`git add -A && bash scripts/portoes.sh > /tmp/portoes-${SPRINT}.txt 2>&1\` (tem de terminar TODOS VERDES); escreva a entrega em ${ENTREGA} com os quatro cabeçalhos \`## O que mudou\`, \`## Qual mordida prova\`, \`## O que NÃO verifiquei\`, \`## O que sobrou para o próximo\`; mude \`estado: aberta\` para \`estado: feita\` no arquivo da sprint com uma linha \`> **ESTADO ${HOJE}: feita** — <entrega>\`; commite NA SUA BRANCH (mensagem \`tipo(escopo): frase\`, sem trailer). Não faça merge, não toque em dev nem em ${BASE}.
5. A sua resposta final é SÓ o objeto JSON do esquema (sem prosa): sprint, commit (sha curto do último commit seu), portoes (verde|vermelho|nao-rodei), entrega (o caminho), mediu (lista de {chave, transporte, ate_onde_foi, viu} para toda célula do mapa que você exercitou), caiu_da_sprint (linhas do enunciado que o mapa ou o aparelho derrubaram), esperou_bancada (true se ficou sem aparelho), pergunta (UMA frase se ficou algo que só ela decide; senão vazio)."
  printf '%s\n' "$PROMPT" > "$PASTA/${SPRINT}.prompt.md"
  jq -cn --arg s "$SPRINT" --arg w "$WT" --arg b "$BRANCH" --arg a "$ARQ" --arg e "$ENTREGA" --arg p "$PASTA/${SPRINT}.prompt.md" \
     '{sprint:$s, worktree:$w, branch:$b, sprint_arquivo:$a, entrega:$e, prompt_arquivo:$p}' >> "$PASTA/args.jsonl"
  echo "  ${SPRINT} → ${WT}"
done
jq -s '.' "$PASTA/args.jsonl" > "$PASTA/args.json" && rm -f "$PASTA/args.jsonl"
echo "lote ${LOTE}: $# sprint(s) despachada(s) de ${BASE}."
echo "args: ${PASTA}/args.json"
