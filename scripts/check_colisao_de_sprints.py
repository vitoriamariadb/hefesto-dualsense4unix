#!/usr/bin/env python3
"""check_colisao_de_sprints.py — a posse tem UM formato, e uma máquina o lê.

O DEFEITO, medido em 24/08/2026 sobre as vinte e três sprints daquele dia
(INFRA-DE-EXECUCAO-01, M10): o mesmo campo aparecia como ``POSSE DE ARQUIVO
(exclusiva)``, ``POSSE EXCLUSIVA``, ``possui, e SÓ``, ``Faixa / arquivo``,
``arquivos que ele toca``, ``com quem colide``, ``faixa``... **dez rótulos, e
nenhuma máquina os lia.** Uma única sprint declarava o que NÃO toca -- e é essa
metade que separa "não citei" de "declarei que não é meu".

O QUE ISSO CUSTOU: quatro colisões de posse em 23/08, nenhuma declarada. Z1 e Z2
reivindicavam **os mesmos quatro arquivos**, e isso só apareceu no conferente
humano, depois de tudo escrito.

O CAMPO CARO É ``cria:``, E É O ÚNICO QUE PEGA A DUPLICATA. Os quatro módulos
que PAREAMENTO-01 e Z6 mandam criar **não existem no disco**, e nenhum ``grep``
na árvore acha colisão em arquivo que ainda não existe. Sem ``cria:``, aquele par
-- que vale dezessete agentes despachados para a mesma obra -- é invisível.

ELE NASCE REPROVANDO ZERO, E É DE PROPÓSITO. Sprint sem frontmatter entra na
**lista de dívida**, não numa reprovação: um portão que reprova as vinte e três
de uma vez é um portão que alguém desliga na segunda-feira, e a primeira reação
seria ``--no-verify``. A pressão fica no DESPACHO (o despachante recusa sprint
sem frontmatter), que é o momento em que alguém já ia ler aquela sprint de
qualquer jeito.

O LIMITE DA RÉGUA, DECLARADO: **frequência de citação não é posse.** Este script
lê o frontmatter e SÓ o frontmatter -- nunca o corpo. Uma régua ingênua que
contasse citações leria a coluna "NÃO toca" da Z7 como reivindicação de
``daemon_actions.py``, e acusaria justamente quem fez a coisa certa.

POR QUE UM ANALISADOR PRÓPRIO E NÃO PyYAML: o formato é pequeno e fechado de
propósito, e um analisador estrito que RECUSA o que não entende (dizendo a linha)
é mais seguro aqui que um permissivo que aceita uma forma que este script depois
lê errado. E sem dependência ele roda no ``python3`` pelado de qualquer máquina,
que é o que permite ao gancho e ao CI chamá-lo sem instalar nada.

O FORMATO
---------
Um bloco entre ``---`` no topo do arquivo de sprint::

    ---
    sprint: INFRA-DE-EXECUCAO-01
    posse:
      A1:
        - scripts/portoes.sh
        - scripts/bancada.sh
    cria:
      - scripts/portoes.sh
    bancada: false
    depois_de: [ONDA0-Z2]
    nao_toca:
      - src/hefesto_dualsense4unix/app/daemon_actions.py
    ---

  posse      quem toca o quê. A chave é o código do agente; o valor, os caminhos.
  cria       o que ainda NÃO existe no disco e vai nascer. O campo caro.
  bancada    precisa de daemon vivo, hidraw, btmon, systemctl? true/false.
  depois_de  as sprints que têm de fechar ANTES. Serializa uma colisão em vez
             de proibi-la.
  nao_toca   o que esta sprint declara que NÃO é seu. É a metade que faltava.

Uso:
    scripts/check_colisao_de_sprints.py                 confere tudo
    scripts/check_colisao_de_sprints.py --divida        só a lista de dívida
    scripts/check_colisao_de_sprints.py --exigir <ID>   rc=1 se ESSA não tem frontmatter
"""

from __future__ import annotations

import argparse
import re
import sys
from itertools import combinations
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
SPRINTS = RAIZ / "docs" / "process" / "sprints"

_CAMPOS_LISTA = ("cria", "depois_de", "nao_toca")
_CAMPOS_CONHECIDOS = ("sprint", "posse", "bancada", *_CAMPOS_LISTA)


class FormatoInvalido(Exception):
    """O analisador RECUSA o que não entende, dizendo a linha. Nunca adivinha."""


def _lista_inline(bruto: str) -> list[str]:
    dentro = bruto.strip()[1:-1].strip()
    if not dentro:
        return []
    return [p.strip().strip("'\"") for p in dentro.split(",") if p.strip()]


def le_frontmatter(texto: str, onde: str = "<texto>") -> dict | None:
    """O bloco entre ``---``, ou ``None`` se a sprint não tem um.

    Estrito de propósito: recuo de dois espaços, listas em bloco (``- x``) ou
    inline (``[x, y]``), e nada mais. Campo desconhecido é erro, não é ignorado
    -- um campo com erro de digitação que passa em silêncio vira posse não
    declarada, que é o defeito inteiro.
    """
    linhas = texto.splitlines()
    if not linhas or linhas[0].strip() != "---":
        return None
    try:
        fim = next(i for i in range(1, len(linhas)) if linhas[i].strip() == "---")
    except StopIteration as exc:
        raise FormatoInvalido(f"{onde}: o frontmatter abre com --- e nunca fecha") from exc

    dados: dict = {}
    chave_atual: str | None = None
    agente_atual: str | None = None

    for n, linha in enumerate(linhas[1:fim], start=2):
        if not linha.strip() or linha.lstrip().startswith("#"):
            continue
        # COMENTÁRIO INLINE, e a ausência disto cegava o portão INTEIRO —
        # medido em 25/08/2026. A linha de comentário SOZINHA já era pulada
        # acima; o `# dona: A` no fim de um caminho, não. O caminho entrava no
        # conjunto COM o comentário grudado, nunca casava com o mesmo arquivo
        # declarado por outra sprint, e a colisão que este script existe para
        # achar ficava invisível. O verde era falso: com quatro caminhos assim
        # na CONFIGURACOES-O-LEXICO-01 — os quatro que ela CEDE, que são
        # exatamente os disputados — o portão dizia "nenhuma colisão não
        # declarada" enquanto duas sprints reivindicavam `secao_mesa.py`.
        #
        # Exige espaço antes do `#`: caminho de arquivo com `#` colado é
        # esquisito mas legal, e recusá-lo seria trocar um erro por outro.
        linha = re.sub(r"\s+#.*$", "", linha)
        if not linha.strip():
            continue
        recuo = len(linha) - len(linha.lstrip())

        if recuo == 0:
            m = re.match(r"^([a-z_]+):\s*(.*)$", linha)
            if not m:
                raise FormatoInvalido(f"{onde}:{n}: não entendi a linha: {linha!r}")
            chave, valor = m.group(1), m.group(2).strip()
            if chave not in _CAMPOS_CONHECIDOS:
                raise FormatoInvalido(
                    f"{onde}:{n}: campo desconhecido {chave!r}. "
                    f"Os que existem são: {', '.join(_CAMPOS_CONHECIDOS)}"
                )
            chave_atual, agente_atual = chave, None
            if valor.startswith("["):
                dados[chave] = _lista_inline(valor)
            elif valor:
                dados[chave] = valor.strip("'\"")
            else:
                dados[chave] = {} if chave == "posse" else []
            continue

        if chave_atual == "posse":
            m = re.match(r"^\s{2}([A-Za-z0-9_.-]+):\s*(.*)$", linha)
            if m:
                agente_atual = m.group(1)
                resto = m.group(2).strip()
                dados["posse"][agente_atual] = (
                    _lista_inline(resto) if resto.startswith("[") else []
                )
                continue
            m = re.match(r"^\s{4}-\s+(.+)$", linha)
            if m and agente_atual:
                dados["posse"][agente_atual].append(m.group(1).strip().strip("'\""))
                continue
            raise FormatoInvalido(f"{onde}:{n}: não entendi a linha de posse: {linha!r}")

        m = re.match(r"^\s{2}-\s+(.+)$", linha)
        if m and chave_atual in _CAMPOS_LISTA:
            dados[chave_atual].append(m.group(1).strip().strip("'\""))
            continue
        raise FormatoInvalido(f"{onde}:{n}: não entendi a linha: {linha!r}")

    for campo in _CAMPOS_LISTA:
        dados.setdefault(campo, [])
    dados.setdefault("posse", {})
    dados.setdefault("bancada", "false")
    return dados


def cobre(declarado: str, alvo: str) -> bool:
    """Um caminho terminado em ``/`` é PASTA e cobre tudo que está dentro dela.

    Sem isto, "não toco em ``src/hefesto_dualsense4unix/``" -- que é a
    declaração natural de uma sprint de infra -- não casaria com arquivo nenhum,
    e a régua leria a declaração mais forte da lista como se não existisse.
    """
    if declarado == alvo:
        return True
    if declarado.endswith("/") and alvo.startswith(declarado):
        return True
    return alvo.endswith("/") and declarado.startswith(alvo)


def reivindicacao(dados: dict) -> set[str]:
    """O que a sprint DIZ que é seu: posse + cria, menos o que ela renega.

    ``nao_toca`` vence: declarar que não é seu é uma afirmação mais forte que
    tê-lo citado numa lista de posse por descuido.
    """
    reivindica: set[str] = set(dados.get("cria", []))
    for arquivos in dados.get("posse", {}).values():
        reivindica |= set(arquivos)
    renegado = dados.get("nao_toca", [])
    return {a for a in reivindica if not any(cobre(n, a) for n in renegado)}


def _comuns(uma: set[str], outra: set[str]) -> set[str]:
    return {a for a in uma if any(cobre(a, b) for b in outra)} | {
        b for b in outra if any(cobre(b, a) for a in uma)
    }


def _id_da_sprint(caminho: Path, dados: dict) -> str:
    return str(dados.get("sprint") or caminho.stem)


def confere(anotadas: dict[Path, dict]) -> list[str]:
    """As queixas. Lista vazia significa nenhuma colisão não declarada."""
    queixas: list[str] = []

    for caminho, dados in sorted(anotadas.items()):
        contradiz = _comuns(reivindicacao(dados), set(dados.get("nao_toca", [])))
        if contradiz:
            queixas.append(
                f"{_id_da_sprint(caminho, dados)}: declara os mesmos arquivos em "
                f"posse/cria E em nao_toca: {', '.join(sorted(contradiz))}"
            )

    for (ca, da), (cb, db) in combinations(sorted(anotadas.items()), 2):
        comuns = _comuns(reivindicacao(da), reivindicacao(db))
        if not comuns:
            continue
        ida, idb = _id_da_sprint(ca, da), _id_da_sprint(cb, db)
        if idb in da.get("depois_de", []) or ida in db.get("depois_de", []):
            continue  # colisão SERIALIZADA, e declarada. É decisão, não descuido.
        so_no_papel = sorted(f for f in comuns if not (RAIZ / f).exists())
        aviso = ""
        if so_no_papel:
            aviso = (
                "  <- e "
                + str(len(so_no_papel))
                + " destes NÃO EXISTEM no disco: nenhum grep os acharia. "
                "É o campo `cria:` fazendo o trabalho dele."
            )
        queixas.append(
            f"{ida} x {idb}: reivindicam os mesmos "
            f"{len(comuns)} arquivo(s) sem `depois_de` nem `nao_toca`: "
            + ", ".join(sorted(comuns))
            + aviso
        )
    return queixas


def carrega(pasta: Path) -> tuple[dict[Path, dict], list[Path], list[str]]:
    anotadas: dict[Path, dict] = {}
    divida: list[Path] = []
    erros: list[str] = []
    for caminho in sorted(pasta.rglob("*.md")):
        rel = caminho.relative_to(RAIZ)
        try:
            dados = le_frontmatter(caminho.read_text(encoding="utf-8"), str(rel))
        except FormatoInvalido as exc:
            erros.append(str(exc))
            continue
        if dados is None:
            divida.append(rel)
        else:
            anotadas[rel] = dados
    return anotadas, divida, erros


def _imprime_divida(divida: list[Path]) -> None:
    if not divida:
        return
    print(f"DÍVIDA — {len(divida)} sprint(s) ainda sem frontmatter de posse:")
    for p in divida:
        print(f"  {p}")
    print("  (dívida NÃO reprova: ela é paga uma a uma, no despacho de cada sprint)")


def _imprime_falha(titulo: str, linhas: list[str], rodape: str = "") -> None:
    """Escreve o bloco de falha de modo que ``grep '^FALHA'`` o encontre.

    O DEFEITO, medido em 26/08/2026: a dívida ia para o ``stdout`` e a falha para
    o ``stderr``. Redirecionados para o mesmo lugar (``> arquivo 2>&1``, que é o
    que o CI e o gancho fazem), o ``stdout`` fica com buffer de bloco e o
    ``stderr`` não: o ``FALHA:`` era escrito no meio de uma descarga parcial do
    buffer e saía **colado no fim de um nome de arquivo** -- linha 269, no meio
    de 276 linhas de dívida. ``grep -c '^FALHA'`` devolvia **zero** sobre uma
    saída que reprovava com rc=1, e o achado era invisível para quem lia a saída.

    As duas metades da cura, e as duas são necessárias:

    1. **descarregar o ``stdout`` antes** de escrever no ``stderr``, para que a
       ordem no arquivo fundido seja a ordem em que se mandou imprimir;
    2. **um ``\\n`` na frente do título**, que garante começo de linha mesmo se
       alguém escrever em ``stdout`` sem terminar a linha.

    E a chamadora imprime a dívida **depois** da falha, nunca em volta dela:
    achado no fim de 276 linhas de contexto é achado que ninguém lê.
    """
    sys.stdout.flush()
    print(f"\nFALHA: {titulo}", file=sys.stderr)
    for linha in linhas:
        print(f"  {linha}", file=sys.stderr)
    if rodape:
        print(f"\n{rodape}", file=sys.stderr)
    sys.stderr.flush()


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__ and __doc__.splitlines()[0])
    ap.add_argument("--divida", action="store_true", help="só a lista de dívida")
    ap.add_argument("--exigir", metavar="ID", help="rc=1 se ESSA sprint não tem frontmatter")
    ap.add_argument("--pasta", default=str(SPRINTS))
    args = ap.parse_args(argv)

    pasta = Path(args.pasta)
    if not pasta.is_dir():
        print(f"ERRO: não existe a pasta de sprints: {pasta}", file=sys.stderr)
        return 1

    anotadas, divida, erros = carrega(pasta)

    if args.exigir:
        casam = [p for p in list(anotadas) + divida if args.exigir in str(p)]
        if not casam:
            print(f"ERRO: nenhuma sprint casa com '{args.exigir}' em {pasta}", file=sys.stderr)
            return 1
        sem = [p for p in casam if p in divida]
        if sem:
            print(
                "ERRO: sprint sem bloco `posse:` no topo — o agente nasceria sem "
                "saber o que possui:\n  "
                + "\n  ".join(str(p) for p in sem)
                + "\n\nO formato está no cabeçalho de scripts/check_colisao_de_sprints.py.",
                file=sys.stderr,
            )
            return 1
        print(f"OK: {args.exigir} declara posse.")
        return 0

    if args.divida:
        _imprime_divida(divida)
        return 0

    achou = False
    if erros:
        _imprime_falha(
            f"{len(erros)} frontmatter(s) que não consegui ler:",
            erros,
        )
        achou = True
    else:
        queixas = confere(anotadas)
        if queixas:
            _imprime_falha(
                f"{len(queixas)} colisão(ões) de posse não declarada(s):",
                queixas,
                rodape=(
                    "O conserto é UM dos três: mover o arquivo para uma sprint só; "
                    "declarar `depois_de:` para serializar; ou declarar `nao_toca:` em "
                    "quem não é dona dele."
                ),
            )
            achou = True

    # A DÍVIDA VEM DEPOIS DA FALHA, NUNCA EM VOLTA DELA. Ver _imprime_falha().
    _imprime_divida(divida)

    if achou:
        return 1

    print(f"OK: {len(anotadas)} sprint(s) anotada(s), nenhuma colisão não declarada.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
