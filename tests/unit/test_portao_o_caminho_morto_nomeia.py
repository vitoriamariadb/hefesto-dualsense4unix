"""O PORTÃO DO CAMINHO MORTO — despachar sprint que não existe sai rc=1 NOMEANDO.

A CICATRIZ: ``validar-acentuacao.py --check-file`` devolvia **rc=0 em silêncio**
contra arquivo que não existe. Portão cego é pior que portão nenhum, porque
ensina a próxima pessoa a acreditar num verde que não mediu nada.

Um despachante com o mesmo defeito é pior ainda: ele criaria um worktree de
59 MB para uma sprint que ninguém escreveu, e o agente descobriria sozinho,
tarde -- depois de ler o preâmbulo, entrar na árvore e procurar um arquivo que
não está lá.

E "não achei" sem dizer ONDE procurou não é recusa útil: faz a próxima pessoa
procurar de novo, no mesmo lugar. Por isso a régua cobra três coisas, e não uma:

  1. rc=1;
  2. a saída NOMEIA o caminho que foi procurado;
  3. **nenhum worktree foi criado** -- a recusa vem ANTES do `git worktree add`.

A MORDIDA: arranque o bloco ``if [ -z "$ARQ_SPRINT" ]`` de
``scripts/despachar-agente.sh``. O teste reprova vendo o worktree órfão
aparecer, que é o custo concreto do portão cego. Está exercitada aqui em
``test_a_regua_ve_o_worktree_orfao_aparecer``, sobre uma CÓPIA do script -- a
régua tem de saber recusar, ou não é régua (armadilha A2).

Tudo roda num REPOSITÓRIO DUBLÊ em tmp. Rodar o despachante contra a árvore de
verdade criaria branch e worktree no repositório compartilhado, com sete agentes
em voo — o que é a Falha 1 que esta leva inteira existe para matar.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
from pathlib import Path

import pytest

RAIZ = Path(__file__).resolve().parents[2]
DESPACHANTE = RAIZ / "scripts" / "despachar-agente.sh"
BANCADA = RAIZ / "scripts" / "bancada.sh"
COLISAO = RAIZ / "scripts" / "check_colisao_de_sprints.py"

_SPRINT_DUBLE = "2026-08-25-SPRINT-DUBLE-01-a-que-existe.md"
_NOME_DA_SPRINT = "SPRINT-DUBLE-01"
_SPRINT_SEM_POSSE = "2026-08-25-SPRINT-SEM-POSSE-01-a-que-ninguem-anotou.md"


def _git(*argv: str, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *argv], cwd=cwd, capture_output=True, text=True, check=True
    )


@pytest.fixture
def casa(tmp_path: Path) -> Path:
    """Um repositório dublê com uma sprint de verdade e o despachante dentro."""
    repo = tmp_path / "casa"
    (repo / "docs" / "process" / "sprints").mkdir(parents=True)
    (repo / "scripts").mkdir()
    (repo / "src" / "pacote").mkdir(parents=True)
    # A sprint dublê nasce COM frontmatter de posse, porque é isso que o
    # despachante exige antes de criar árvore nenhuma (I16).
    (repo / "docs" / "process" / "sprints" / _SPRINT_DUBLE).write_text(
        "---\nsprint: SPRINT-DUBLE-01\nposse:\n  A9:\n    - docs/x.md\n---\n\n"
        "# a sprint dublê\n",
        encoding="utf-8",
    )
    (repo / "docs" / "process" / "sprints" / _SPRINT_SEM_POSSE).write_text(
        "# a sprint que ninguém anotou\n", encoding="utf-8"
    )
    shutil.copy(DESPACHANTE, repo / "scripts" / "despachar-agente.sh")
    shutil.copy(BANCADA, repo / "scripts" / "bancada.sh")
    shutil.copy(COLISAO, repo / "scripts" / "check_colisao_de_sprints.py")
    (repo / "scripts" / "check_colisao_de_sprints.py").chmod(0o755)

    _git("init", "-b", "main", cwd=repo)
    _git("config", "user.email", "duble@exemplo.invalido", cwd=repo)
    _git("config", "user.name", "dublê", cwd=repo)
    _git("add", "-A", cwd=repo)
    _git("commit", "-m", "a casa dublê", cwd=repo)
    # `dev` existe e NÃO está em check-out: é a mesma forma da árvore de verdade,
    # e é o que permite `git worktree add ... dev`.
    _git("branch", "dev", cwd=repo)
    return repo


def _despacha(
    casa: Path, sprint: str, agente: str, voo: Path,
    script: str | None = None, sem_posse: bool = False,
):
    env = dict(os.environ)
    env["HEFESTO_VOO"] = str(voo)
    if sem_posse:
        # a régua do caminho morto é a de cima; esta chamada não está medindo a
        # exigência de posse, e misturar as duas faria a reprovação ambígua
        env["HEFESTO_SEM_POSSE"] = "1"
    env.pop("HEFESTO_BANCADA_ARQ", None)
    env["HEFESTO_BANCADA_ARQ"] = str(voo / "bancada-inexistente.json")
    return subprocess.run(
        ["bash", script or str(casa / "scripts" / "despachar-agente.sh"), sprint, agente],
        cwd=casa,
        capture_output=True,
        text=True,
        env=env,
    )


def _quantos_worktrees(casa: Path) -> int:
    saida = _git("worktree", "list", "--porcelain", cwd=casa).stdout
    return saida.count("worktree ")


# ---------------------------------------------------------------------------
# A recusa
# ---------------------------------------------------------------------------


def test_sprint_inexistente_sai_rc1_nomeando_onde_procurou(casa: Path, tmp_path: Path) -> None:
    antes = _quantos_worktrees(casa)
    r = _despacha(casa, "SPRINT-QUE-NAO-EXISTE", "A1", tmp_path / "voo")
    tudo = r.stdout + r.stderr

    assert r.returncode == 1, "despachou sprint que não existe:\n" + tudo
    assert "docs/process/sprints" in tudo, "a recusa não diz ONDE procurou:\n" + tudo
    assert "SPRINT-QUE-NAO-EXISTE" in tudo, "a recusa não repete o que foi pedido:\n" + tudo
    assert _quantos_worktrees(casa) == antes, (
        "a recusa saiu rc=1 mas um worktree ficou para trás — a checagem está "
        "DEPOIS do `git worktree add`, e o custo do portão cego foi pago mesmo assim"
    )
    assert not (tmp_path / "voo").exists() or not any((tmp_path / "voo").iterdir())


def test_a_recusa_nao_escreve_nada_no_stdout(casa: Path, tmp_path: Path) -> None:
    """A recusa é erro, e erro vai para stderr — o stdout é o preâmbulo colável."""
    r = _despacha(casa, "SPRINT-QUE-NAO-EXISTE", "A1", tmp_path / "voo")
    assert r.stdout.strip() == "", "a recusa vazou para o stdout: " + r.stdout


# ---------------------------------------------------------------------------
# O caminho vivo, para que a régua não seja só um "sempre reprova"
# ---------------------------------------------------------------------------


def test_sprint_que_existe_nasce_com_arvore_e_com_o_pythonpath(casa: Path, tmp_path: Path) -> None:
    voo = tmp_path / "voo"
    r = _despacha(casa, _NOME_DA_SPRINT, "A9", voo)
    assert r.returncode == 0, r.stdout + r.stderr

    wt = voo / f"{_NOME_DA_SPRINT}-A9"
    assert wt.is_dir(), "o worktree não nasceu:\n" + r.stdout + r.stderr
    assert _quantos_worktrees(casa) == 2

    envrc = (wt / ".envrc-voo").read_text(encoding="utf-8")
    assert f'PYTHONPATH="{wt}/src"' in envrc, (
        "o .envrc-voo não aponta para a árvore do próprio agente:\n" + envrc
    )
    assert "no:cacheprovider" in envrc

    # o preâmbulo é o produto: ele tem de dizer as cinco coisas
    for pedaco in (str(wt), "voo/", "source .envrc-voo", "bancada", "portoes.sh"):
        assert pedaco in r.stdout, f"o preâmbulo não diz '{pedaco}':\n" + r.stdout

    _git("worktree", "remove", "--force", str(wt), cwd=casa)


# ---------------------------------------------------------------------------
# A régua sabe RECUSAR — o custo do portão cego, medido sobre uma cópia
# ---------------------------------------------------------------------------


def test_a_regua_ve_o_worktree_orfao_aparecer(casa: Path, tmp_path: Path) -> None:
    """Com a checagem arrancada, a sprint inexistente ganha uma árvore de 59 MB.

    Não é um teste do produto: é o teste DA RÉGUA. Se este passar com a cura
    arrancada, a régua acima não está medindo o que diz medir.
    """
    cego = casa / "scripts" / "despachar-agente-cego.sh"
    texto = (casa / "scripts" / "despachar-agente.sh").read_text(encoding="utf-8")
    sem_checagem = re.sub(
        r'if \[ -z "\$ARQ_SPRINT" \]; then.*?\nfi\n',
        "ARQ_SPRINT=/caminho/que/nao/existe.md\n",
        texto,
        flags=re.S,
    )
    assert sem_checagem != texto, "a mordida não achou o bloco para arrancar"
    cego.write_text(sem_checagem, encoding="utf-8")

    antes = _quantos_worktrees(casa)
    r = _despacha(
        casa, "SPRINT-QUE-NAO-EXISTE", "A1", tmp_path / "voo",
        script=str(cego), sem_posse=True,
    )
    assert r.returncode == 0, "sem a checagem, esperava-se que passasse"
    assert _quantos_worktrees(casa) == antes + 1, (
        "sem a checagem o worktree órfão NÃO apareceu — então a régua de cima "
        "não está medindo o custo que diz medir"
    )
    _git(
        "worktree", "remove", "--force",
        str(tmp_path / "voo" / "SPRINT-QUE-NAO-EXISTE-A1"), cwd=casa,
    )


# ---------------------------------------------------------------------------
# `--limpar` — quem responde por "já foi costurado" é o git, não a memória
# ---------------------------------------------------------------------------


def test_limpar_remove_o_que_ja_entrou_em_onda_atual_e_poupa_o_sujo(
    casa: Path, tmp_path: Path
) -> None:
    voo = tmp_path / "voo"
    despachante = str(casa / "scripts" / "despachar-agente.sh")
    _despacha(casa, _NOME_DA_SPRINT, "A9", voo)
    wt = voo / f"{_NOME_DA_SPRINT}-A9"

    # a branch do agente entra em onda/atual: daqui em diante ele não guarda
    # nada que o git já não tenha
    _git("branch", "onda/atual", "dev", cwd=casa)
    _git("update-ref", "refs/heads/onda/atual", f"refs/heads/voo/{_NOME_DA_SPRINT}-A9", cwd=casa)

    env = dict(os.environ)
    env["HEFESTO_VOO"] = str(voo)
    r = subprocess.run(
        ["bash", despachante, "--limpar"], cwd=casa, capture_output=True, text=True, env=env
    )
    assert r.returncode == 0, r.stdout + r.stderr
    assert not wt.exists(), "o worktree já costurado sobreviveu ao --limpar:\n" + r.stdout

    # e o SUJO não é descartado: em 05/08 uma leva inteira morreu no índice
    _despacha(casa, _NOME_DA_SPRINT, "A8", voo)
    wt8 = voo / f"{_NOME_DA_SPRINT}-A8"
    (wt8 / "trabalho-nao-commitado.txt").write_text("horas de trabalho\n", encoding="utf-8")
    _git("update-ref", "refs/heads/onda/atual", f"refs/heads/voo/{_NOME_DA_SPRINT}-A8", cwd=casa)
    r = subprocess.run(
        ["bash", despachante, "--limpar"], cwd=casa, capture_output=True, text=True, env=env
    )
    assert wt8.exists(), (
        "o --limpar removeu um worktree com trabalho não commitado dentro:\n" + r.stdout
    )
    assert "não commitada" in r.stdout, "removeu nada mas não DISSE por quê:\n" + r.stdout
    _git("worktree", "remove", "--force", str(wt8), cwd=casa)


# ---------------------------------------------------------------------------
# I16 — a pressão fica no despacho, não numa reprovação de portão
# ---------------------------------------------------------------------------


def test_sprint_sem_posse_declarada_e_recusada_sem_criar_arvore(
    casa: Path, tmp_path: Path
) -> None:
    """A Falha 3 de 23/08: agente que nasce sem saber o que possui.

    A recusa é no DESPACHO, e uma por vez -- nunca um portão reprovando as
    vinte e três sprints de uma vez, que é portão desligado na segunda-feira.
    """
    antes = _quantos_worktrees(casa)
    r = _despacha(casa, "SPRINT-SEM-POSSE-01", "A1", tmp_path / "voo")
    tudo = r.stdout + r.stderr
    assert r.returncode == 1, "despachou agente para sprint sem posse:\n" + tudo
    assert "posse" in tudo, "a recusa não diz o que falta:\n" + tudo
    assert "check_colisao_de_sprints.py" in tudo, (
        "a recusa não diz ONDE está o formato a seguir:\n" + tudo
    )
    assert _quantos_worktrees(casa) == antes, "criou o worktree mesmo recusando"


def test_sem_o_conferente_na_arvore_o_despachante_avisa_em_vez_de_calar(
    casa: Path, tmp_path: Path
) -> None:
    """Portão que some sem dizer é portão cego — a cicatriz do --check-file."""
    (casa / "scripts" / "check_colisao_de_sprints.py").unlink()
    r = _despacha(casa, "SPRINT-SEM-POSSE-01", "A1", tmp_path / "voo")
    assert "AVISO" in r.stderr, "o conferente sumiu e ninguém foi avisado:\n" + r.stderr
    assert "foi conferida" in r.stderr
    _git(
        "worktree", "remove", "--force",
        str(tmp_path / "voo" / "SPRINT-SEM-POSSE-01-A1"), cwd=casa,
    )
