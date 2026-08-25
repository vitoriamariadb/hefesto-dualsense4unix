#!/usr/bin/env bash
# costurar.sh — o único caminho da branch de um agente até `onda/atual`.
#
# RODA NO WORKTREE DO AGENTE, e faz quatro coisas em ordem:
#   1. exige a ENTREGA, e a sanitiza ele mesmo;
#   2. roda a camada de portões;
#   3. funde em `onda/atual`, sob `flock`, numa worktree de integração dedicada;
#   4. conflito sai rc=1 NOMEANDO os arquivos, e NÃO é resolvido sozinho.
#
# POR QUE `flock` (medido em 24/08/2026, três processos num ciclo
# ler-modificar-gravar):
#     com flock -> 3 linhas de 3 sobreviveram
#     sem flock -> 1 linha  de 3 sobreviveu   (duas perdidas em SILÊNCIO)
# É a Falha 1 renascida na integração, e é o mesmo experimento.
#
# E O TRINCO NÃO DEIXA ÓRFÃO: o `flock` é solto quando o último descritor fecha,
# e o descritor fecha quando o processo morre — conferido com `kill -9`. Nenhum
# `finally` de agente segura nada aqui. Se a liberação dependesse de um, o
# desenho estaria errado.
#
# POR QUE A ENTREGA É CONDIÇÃO, e é de POSIÇÃO e não de conteúdo: em 23/08 foram
# 189 agentes e 124 relatórios, e `docs/process/agentes/` recebeu ZERO arquivos.
# Ela não apodreceu por desleixo — NASCEU SEM GATILHO: o protocolo mandava rodar
# um sanitizador à mão cuja ORIGEM nem existia como arquivo. Aqui o registro é
# posto no único momento em que o agente quer alguma coisa: que a obra dele
# entre. GATILHO NO DESEJO, NÃO NA DISCIPLINA.
#
# E A SANITIZAÇÃO NÃO É ZELO. O portão de anonimato é ISENTO de `docs/process/**`
# — foi por ali que a senha `sudo` dela entrou no repositório em 26/06 e chegou a
# cinco commits públicos. Segredo faz a costura RECUSAR; não mascara.
#
# CONFLITO É O PRODUTO DESEJADO, não o acidente: nada de `-X ours`. A colisão de
# posse que antes era sobrescrita SILENCIOSA vira barulho nomeado, que é a
# diferença entre perder trabalho e ser avisado.
#
# Uso, de dentro do worktree do agente:
#   scripts/costurar.sh                 exige entrega, portões, e funde
#   scripts/costurar.sh --aceite        idem, e a suíte inteira junto
#   scripts/costurar.sh --seco          faz tudo menos o merge (ensaio)
set -uo pipefail

RAIZ="$(git rev-parse --show-toplevel)"
COMUM="$(git rev-parse --git-common-dir)"
case "$COMUM" in /*) ;; *) COMUM="$RAIZ/$COMUM" ;; esac
PRINCIPAL="$(git worktree list --porcelain | awk 'NR==1{print $2}')"
ALVO="${HEFESTO_ALVO_DE_COSTURA:-onda/atual}"
LOCK="${COMUM}/hefesto-costura.lock"

CAMADA=""
SECO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --aceite) CAMADA="--aceite"; shift ;;
    --seco)   SECO="sim"; shift ;;
    -h|--help) sed -n '2,40p' "$0" | sed 's/^# \?//'; exit 0 ;;
    *) echo "ERRO: opção desconhecida '$1'. Veja $0 --help" >&2; exit 2 ;;
  esac
done

BRANCH="$(git -C "$RAIZ" rev-parse --abbrev-ref HEAD)"
case "$BRANCH" in
  voo/*) ;;
  *) echo "ERRO: '${BRANCH}' não é branch de agente. A costura só aceita voo/*." >&2
     echo "  (e é assim que a árvore dela nunca é tocada: 'dev' não pode estar" >&2
     echo "   em check-out em duas árvores, e o git é quem recusa)" >&2
     exit 1 ;;
esac
SPRINT_AGENTE="${BRANCH#voo/}"

# --- 1. A ENTREGA ----------------------------------------------------------
HOJE="$(date +%Y-%m-%d)"
ENTREGA="docs/process/agentes/${HOJE}/${SPRINT_AGENTE}.md"
if [ ! -r "$RAIZ/$ENTREGA" ]; then
  {
    echo "ERRO: a entrega não está na árvore, e ela é condição da costura."
    echo "  esperada em: ${RAIZ}/${ENTREGA}"
    echo "  quatro cabeçalhos, nesta ordem:"
    echo "    ## O que mudou"
    echo "    ## Qual mordida prova"
    echo "    ## O que NÃO verifiquei"
    echo "    ## O que sobrou para o próximo"
    echo "  Relatório que só existe no transcrito morre: em 23/08 foram 124"
    echo "  relatórios e ZERO arquivos em docs/process/agentes/."
  } >&2
  exit 1
fi

# OS QUATRO CABEÇALHOS. "O que NÃO verifiquei" é o mais valioso dos quatro, e é
# obrigatório justamente por isso: NÃO VERIFICADO é muito preferível a chute, e
# chute com confiança já custou três achados falsos numa sessão. Cabeçalho vazio
# é uma pergunta feita; cabeçalho ausente é uma pergunta que ninguém fez.
FALTAM=()
while IFS= read -r titulo; do
  grep -qiF "$titulo" "$RAIZ/$ENTREGA" || FALTAM+=("$titulo")
done <<'CABECALHOS'
## O que mudou
## Qual mordida prova
## O que NÃO verifiquei
## O que sobrou para o próximo
CABECALHOS
if [ ${#FALTAM[@]} -gt 0 ]; then
  {
    echo "ERRO: a entrega está sem ${#FALTAM[@]} cabeçalho(s) obrigatório(s):"
    printf '  %s\n' "${FALTAM[@]}"
    echo "  em: ${ENTREGA}"
  } >&2
  exit 1
fi

# --- 2. O SANITIZADOR, chamado por AQUI e não pelo agente ------------------
# Ele nunca precisa saber que o sanitizador existe: o comando manual foi
# exatamente o que matou a pasta de 06/08.
#
# ELE MASCARA MAC E RECUSA SEGREDO — e NÃO é a única régua aqui. O contrato dele
# só entra em vigor quando os três primeiros octetos casam com um OUI real da
# bancada, e isso lhe dá um ponto cego estrutural. Quem pega por FORMA é
# `check_endereco_de_radio.py`, que roda na camada de portões logo abaixo, DEPOIS
# de a entrega estar commitada — porque ele varre o que o `git ls-files` devolve.
# Duas réguas independentes é o que revela; é regra desta casa.
SAN="$RAIZ/scripts/sanitizar_saida_de_agente.py"
if [ -r "$SAN" ]; then
  # O segundo argumento é a PASTA de destino, não o arquivo: passar o mesmo
  # caminho duas vezes estoura com FileExistsError. Sanitizar para a própria
  # pasta é o que deixa a entrega curada no lugar.
  # PYTHONDONTWRITEBYTECODE: o sanitizador importa dois módulos da árvore, e o
  # `__pycache__/` que isso deixa para trás é lixo NA ÁRVORE DO AGENTE, na
  # véspera de uma checagem de "está tudo commitado?". Ferramenta não suja a
  # árvore de quem a chamou.
  if ! SAIDA="$(PYTHONDONTWRITEBYTECODE=1 python3 "$SAN" "$RAIZ/$ENTREGA" "$(dirname "$RAIZ/$ENTREGA")" 2>&1)"; then
    {
      # Recusa e QUEBRA saem as duas rc=1, e a costura para nas duas -- na
      # dúvida não passa, que é a lição de 26/06. Mas elas se DIZEM diferentes:
      # tratar um traceback como "recusa" mandou o autor desta linha procurar um
      # segredo que não existia por vinte minutos.
      if printf '%s' "$SAIDA" | grep -q "^Traceback"; then
        echo "ERRO: o sanitizador QUEBROU — isto não é recusa, é instrumento com defeito."
        echo "      A costura para mesmo assim: na dúvida não passa."
      else
        echo "ERRO: o sanitizador RECUSOU a entrega — e recusar é o contrato dele."
        echo "  Segredo não se mascara automaticamente: foi o 'na dúvida' que"
        echo "  levou a senha sudo dela a cinco commits públicos em 26/06."
      fi
      printf '%s\n' "$SAIDA" | sed 's/^/  /'
    } >&2
    exit 1
  fi
  printf '%s\n' "$SAIDA" | sed 's/^/  sanitizador: /'
else
  echo "AVISO: scripts/sanitizar_saida_de_agente.py não está nesta árvore;" >&2
  echo "       a entrega NÃO foi sanitizada. Portão que some sem dizer é cego." >&2
fi

if [ -n "$(git -C "$RAIZ" status --porcelain -- "$ENTREGA")" ]; then
  git -C "$RAIZ" add "$ENTREGA"
  if ! SAIDA="$(git -C "$RAIZ" commit -q -m "docs(entrega): ${SPRINT_AGENTE} — o relatório, sanitizado na costura" 2>&1)"; then
    # O commit da entrega pode falhar por gancho da máquina (identidade, formato
    # de mensagem). Ignorar isso deixava a árvore suja e a costura reprovava DUAS
    # telas adiante, acusando o agente de não ter commitado — um diagnóstico que
    # aponta a pessoa errada.
    {
      echo "ERRO: não consegui commitar a entrega. O gancho da máquina recusou?"
      printf '%s\n' "$SAIDA" | sed 's/^/  /'
    } >&2
    exit 1
  fi
  echo "  a entrega foi commitada pela costura."
fi

if [ -n "$(git -C "$RAIZ" status --porcelain)" ]; then
  {
    echo "ERRO: a árvore tem coisa não commitada, e a costura leva só o que está no git."
    git -C "$RAIZ" status --short | sed 's/^/  /'
    echo "  Commite à vontade: o índice é seu, e 'git add -A' aqui não alcança"
    echo "  ninguém. Não commitar NÃO é a alternativa segura — em 05/08 uma leva"
    echo "  ficou horas no índice e morreu com a sessão."
  } >&2
  exit 1
fi

# --- 3. OS PORTÕES ---------------------------------------------------------
if [ -x "$RAIZ/scripts/portoes.sh" ]; then
  # shellcheck disable=SC2086
  if ! bash "$RAIZ/scripts/portoes.sh" $CAMADA; then
    echo "ERRO: portão vermelho. A costura não passa por cima de portão." >&2
    exit 1
  fi
else
  echo "AVISO: scripts/portoes.sh não está nesta árvore; NENHUM portão rodou." >&2
fi

[ -n "$SECO" ] && { echo "ENSAIO: tudo pronto para costurar ${BRANCH} em ${ALVO}."; exit 0; }

# --- 4. O MERGE, SOB TRAVA -------------------------------------------------
# A trava é segurada por um descritor deste processo. `flock` sem `-c` NÃO
# forqueia — e foi o `-c` que forqueava que fez as duas primeiras medições desta
# peça mentirem, em 24/08.
exec 9>"$LOCK"
if ! flock -w 600 9; then
  echo "ERRO: dez minutos esperando o trinco da costura. Alguém travou?" >&2
  exit 1
fi
echo "trinco tomado (PID $$) — a costura é serializada, e o kernel a solta se eu morrer."

git -C "$PRINCIPAL" rev-parse --verify -q "$ALVO" >/dev/null \
  || git -C "$PRINCIPAL" branch "$ALVO" dev

# A worktree de integração é DEDICADA: `onda/atual` em check-out aqui e em
# nenhum outro lugar, e a árvore dela nunca é tocada por agente nenhum.
INTEGRACAO="${HEFESTO_INTEGRACAO:-$(dirname "$PRINCIPAL")/hefesto-voo/_costura}"
if [ ! -d "$INTEGRACAO" ]; then
  mkdir -p "$(dirname "$INTEGRACAO")"
  git -C "$PRINCIPAL" worktree add "$INTEGRACAO" "$ALVO" >/dev/null
fi
git -C "$INTEGRACAO" checkout -q "$ALVO"

if git -C "$INTEGRACAO" merge --no-ff --no-edit "$BRANCH" >/dev/null 2>&1; then
  echo "COSTURADO: ${BRANCH} entrou em ${ALVO}."
  git -C "$INTEGRACAO" log --oneline -1 | sed 's/^/  /'
  exit 0
fi

# CONFLITO. Nada de `-X ours`: quem decide o lado é gente, e o conflito vai
# escrito na entrega para que a decisão tenha onde ser lida.
EM_CONFLITO="$(git -C "$INTEGRACAO" diff --name-only --diff-filter=U)"
git -C "$INTEGRACAO" merge --abort 2>/dev/null || true
{
  echo ""
  echo "## Conflito na costura — ${HOJE}"
  echo ""
  echo "\`${BRANCH}\` não entrou em \`${ALVO}\` sozinha. Em conflito:"
  echo ""
  # shellcheck disable=SC2016,SC2086  # a separação em palavras é o que se quer:
  # uma linha por arquivo em conflito, e as crases são markdown, não expansão.
  printf -- '- `%s`\n' $EM_CONFLITO
  echo ""
  echo "Nada foi resolvido automaticamente. Quem decide o lado é quem coordena."
} >> "$RAIZ/$ENTREGA"
git -C "$RAIZ" add "$ENTREGA"
git -C "$RAIZ" commit -q -m "docs(entrega): ${SPRINT_AGENTE} — o conflito da costura, escrito"

{
  echo "ERRO: conflito ao costurar ${BRANCH} em ${ALVO}. NADA foi resolvido sozinho."
  # shellcheck disable=SC2086  # idem: uma linha por arquivo
  printf '  %s\n' $EM_CONFLITO
  echo "  O conflito foi escrito na entrega (${ENTREGA})."
  echo "  Barulho é o produto desejado: sobrescrita silenciosa era o defeito."
} >&2
exit 1
