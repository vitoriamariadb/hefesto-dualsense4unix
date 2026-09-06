#!/usr/bin/env bash
# costurar-onda.sh — traz para a árvore de integração o que um LOTE entregou.
#
# RODA NA ÁRVORE DE INTEGRAÇÃO (a branch-alvo em check-out aqui), e para cada
# sprint do lote faz, em ordem:
#   1. acha a branch `voo/<SPRINT>-opus` e os commits que ela tem a mais;
#   2. `git cherry-pick` deles — nunca `git apply` cego (regra dela, 05/09);
#      conflito PARA o script NOMEANDO os arquivos, e a resolução é humana;
#   3. confere que a entrega e o `estado: feita` vieram; se o agente esqueceu o
#      estado, marca aqui, no mesmo commit;
#   4. no fim, `git add -A && bash scripts/portoes.sh` para arquivo; verde
#      commita a costura, vermelho para e mostra a cauda.
#
# É reentrante: rodar de novo pula o que já está costurado (`git cherry` compara
# por patch-id, então commit já colhido aparece como `-`).
#
# Uso:
#   scripts/costurar-onda.sh <LOTE>            costura o lote inteiro
#   scripts/costurar-onda.sh <LOTE> --seco     só lista o que faria
#   HEFESTO_LOTES  onde os lotes moram (padrão: ../_lotes, ao lado da árvore de integração)
set -uo pipefail

RAIZ="$(git rev-parse --show-toplevel)"
LOTE="${1:?uso: costurar-onda.sh <LOTE> [--seco]}"; shift
SECO=""; [ "${1:-}" = "--seco" ] && SECO="sim"
LOTES="${HEFESTO_LOTES:-$(dirname "$RAIZ")/_lotes}"
ARGS="${LOTES}/${LOTE}/args.json"
[ -r "$ARGS" ] || { echo "ERRO: ${ARGS} não existe — o lote não foi despachado por despachar-onda.sh." >&2; exit 1; }
ALVO="$(git -C "$RAIZ" rev-parse --abbrev-ref HEAD)"
case "$ALVO" in onda/*) ;; *) echo "ERRO: '${ALVO}' não é branch de integração (onda/*)." >&2; exit 1 ;; esac
[ -n "$SECO" ] || [ -z "$(git -C "$RAIZ" status --porcelain)" ] || { echo "ERRO: a árvore de integração está suja — commite antes de costurar." >&2; exit 1; }
HOJE="$(date +%F)"
SAIDA="${LOTES}/${LOTE}/costura-${HOJE}.txt"
COSTURADAS=(); SEM_ENTREGA=(); VAZIAS=()

while IFS=$'\t' read -r SPRINT BRANCH ARQ ENTREGA; do
  if ! git -C "$RAIZ" rev-parse --verify -q "$BRANCH" >/dev/null; then
    echo "  ${SPRINT}: branch ${BRANCH} não existe — o agente não commitou nada."; VAZIAS+=("$SPRINT"); continue
  fi
  NOVOS="$(git -C "$RAIZ" cherry "$ALVO" "$BRANCH" | awk '$1=="+"{print $2}')"
  if [ -z "$NOVOS" ]; then
    echo "  ${SPRINT}: nada a mais em ${BRANCH} (já costurada, ou sem commit)."; VAZIAS+=("$SPRINT"); continue
  fi
  N="$(echo "$NOVOS" | wc -l)"
  if [ -n "$SECO" ]; then echo "  ${SPRINT}: ${N} commit(s) a colher de ${BRANCH}"; continue; fi
  # os commits em ordem de história, e um a um — para o conflito nomear o commit
  for SHA in $(echo "$NOVOS" | tac); do
    if ! git -C "$RAIZ" cherry-pick -x "$SHA" >>"$SAIDA" 2>&1; then
      {
        echo "CONFLITO em ${SPRINT} (${SHA}). Arquivos:"
        git -C "$RAIZ" diff --name-only --diff-filter=U | sed 's/^/    /'
        echo "  Resolva pela posse da sprint (${ARQ}), depois:"
        echo "    git add <arquivos> && git cherry-pick --continue"
        echo "    scripts/costurar-onda.sh ${LOTE}      # retoma; o que já entrou é pulado"
      } >&2
      exit 1
    fi
  done
  [ -r "$RAIZ/$ENTREGA" ] || SEM_ENTREGA+=("$SPRINT")
  if grep -q '^estado: aberta' "$RAIZ/$ARQ"; then
    sed -i '0,/^estado: aberta/s//estado: feita/' "$RAIZ/$ARQ"
    awk -v nota="> **ESTADO ${HOJE}: feita** — entrega em \`${ENTREGA}\`, costurada em \`${ALVO}\` pelo lote ${LOTE}." \
        'BEGIN{n=0} {print} /^---$/{n++; if(n==2){print ""; print nota}}' "$RAIZ/$ARQ" > "$RAIZ/$ARQ.tmp" && mv "$RAIZ/$ARQ.tmp" "$RAIZ/$ARQ"
  fi
  COSTURADAS+=("$SPRINT"); echo "  ${SPRINT}: ${N} commit(s) costurado(s)."
done < <(jq -r '.[] | [.sprint, .branch, .sprint_arquivo, .entrega] | @tsv' "$ARGS")

[ -n "$SECO" ] && exit 0
[ ${#COSTURADAS[@]} -gt 0 ] || { echo "nada costurado no lote ${LOTE}."; exit 0; }
[ ${#SEM_ENTREGA[@]} -eq 0 ] || echo "AVISO: sem entrega em docs/process/agentes/: ${SEM_ENTREGA[*]} — cobre do relatório JSON antes de seguir."
[ ${#VAZIAS[@]} -eq 0 ] || echo "AVISO: sem commit: ${VAZIAS[*]} — continuam abertas; redespache ou feche à mão."

cd "$RAIZ" || exit 1
# shellcheck disable=SC1091
[ -r .envrc-voo ] && source .envrc-voo
git add -A
if bash scripts/portoes.sh > "${LOTES}/${LOTE}/portoes-${HOJE}.txt" 2>&1; then
  git commit -q -m "costura(${LOTE}): ${#COSTURADAS[@]} sprint(s) — ${COSTURADAS[*]}" \
    && echo "lote ${LOTE}: costurado e commitado em ${ALVO} ($(git rev-parse --short HEAD)); portões TODOS VERDES."
else
  echo "PORTÕES VERMELHOS depois da costura — a costura está no índice, NÃO commitada. Cauda:" >&2
  tail -25 "${LOTES}/${LOTE}/portoes-${HOJE}.txt" >&2
  echo "  cure, \`git add -A && bash scripts/portoes.sh\`, e commite: costura(${LOTE}): ..." >&2
  exit 1
fi
