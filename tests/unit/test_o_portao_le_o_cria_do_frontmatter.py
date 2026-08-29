"""O portão de referências aceita o que a PRÓPRIA sprint declara em `cria:`.

Decisão dela, 29/08/2026. `scripts/validar-referencias-docs.py` era o único
vermelho dos 28 portões: das 125 linhas que acusava, **116 eram arquivos que a
própria sprint declara criar** no `cria:` do frontmatter -- testes e módulos
que só nascem quando aquela sprint for executada. O portão cobrava do futuro o
presente.

A cura tem uma fronteira, e ela é o assunto deste arquivo: vale o `cria:` **da
mesma sprint**, e só. Ler o `cria:` de qualquer sprint viraria licença geral --
bastaria uma sprint em qualquer canto declarar um nome para autorizar esse nome
na árvore inteira, e a regra 1 morreria calada.

Por isso os três testes que a frente exigiu, e que são o contrato:

1. token no `cria:` da própria sprint -> PASSA;
2. o MESMO token, numa sprint que não o declara -> REPROVA;
3. token que ninguém declara -> REPROVA.

Provado por arrancamento em 29/08/2026: removidas as duas consultas a
`declarados_aqui` de `varrer_documento`, os três testes de "passa" caem
(`rc=1` onde se espera 0) e nenhum dos de "reprova" muda -- que é a assinatura
de um teste que morde o comportamento novo sem depender dele para reprovar.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import pytest

RAIZ_REAL = Path(__file__).resolve().parents[2]
SCRIPT = RAIZ_REAL / "scripts" / "validar-referencias-docs.py"

#: O arquivo que NENHUMA sprint deste repositório falso tem no disco. Ele é o
#: caso inteiro: existe só como promessa no frontmatter.
PROMETIDO = "tests/unit/test_a_promessa_da_sprint.py"
NOME_SOLTO = "test_a_promessa_da_sprint.py"

#: E este ninguém promete em lugar nenhum -- é o controle negativo.
FANTASMA = "test_ninguem_prometeu_este.py"


def rodar(raiz: Path) -> subprocess.CompletedProcess[str]:
    """Varre o repositório falso inteiro e devolve o processo terminado."""
    return subprocess.run(
        [sys.executable, str(SCRIPT), "--root", str(raiz), "--all"],
        capture_output=True,
        text=True,
        check=False,
    )


@pytest.fixture
def repo(tmp_path: Path) -> Path:
    """Repositório mínimo com a pasta de sprints e nada mais.

    Sem `src/` e sem `ipc_server.py` de propósito: as regras 2 e 3 se desligam
    sozinhas quando os índices delas vêm vazios, e o que se mede aqui é a
    regra 1 pura.
    """
    (tmp_path / "docs" / "process" / "sprints").mkdir(parents=True)
    return tmp_path


def sprint(raiz: Path, nome: str, frontmatter: str, corpo: str) -> None:
    """Escreve uma sprint com frontmatter em `docs/process/sprints/`."""
    caminho = raiz / "docs" / "process" / "sprints" / nome
    caminho.write_text(f"---\n{frontmatter}---\n\n{corpo}\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# 1. O token no `cria:` da própria sprint passa.
# ---------------------------------------------------------------------------


def test_arquivo_no_cria_da_propria_sprint_passa(repo: Path) -> None:
    sprint(
        repo,
        "2026-08-29-PROMESSA-01.md",
        f"sprint: PROMESSA-01\ncria:\n  - {PROMETIDO}\n",
        f"Esta sprint vai escrever `{NOME_SOLTO}` quando for executada.",
    )

    proc = rodar(repo)

    assert proc.returncode == 0, (
        "a sprint declarou o arquivo no próprio `cria:` e mesmo assim foi "
        f"reprovada:\n{proc.stdout}{proc.stderr}"
    )


def test_o_caminho_inteiro_tambem_passa(repo: Path) -> None:
    """A citação pode vir encurtada OU completa -- as duas são a promessa."""
    sprint(
        repo,
        "2026-08-29-PROMESSA-02.md",
        f"sprint: PROMESSA-02\ncria:\n  - {PROMETIDO}\n",
        f"O teste novo é o `{PROMETIDO}`.",
    )

    proc = rodar(repo)

    assert proc.returncode == 0, f"{proc.stdout}{proc.stderr}"


def test_lista_inline_no_cria_tambem_conta(repo: Path) -> None:
    """`cria: [a.py]` é forma viva nesta árvore, não hipótese de teste."""
    sprint(
        repo,
        "2026-08-29-PROMESSA-03.md",
        f"sprint: PROMESSA-03\ncria: [{PROMETIDO}]\n",
        f"Sai daqui o `{NOME_SOLTO}`.",
    )

    proc = rodar(repo)

    assert proc.returncode == 0, f"{proc.stdout}{proc.stderr}"


# ---------------------------------------------------------------------------
# 2. O MESMO token, numa sprint que não o declara, reprova.
#    Esta é a fronteira: sem ela, a cura vira licença geral.
# ---------------------------------------------------------------------------


def test_o_mesmo_arquivo_numa_sprint_que_nao_declara_reprova(repo: Path) -> None:
    """A vizinha declara; esta cita sem declarar. Tem de continuar caindo.

    É o caso REAL que sobrou na árvore em 29/08: nove citações a arquivo que
    OUTRA sprint promete criar. Se este teste passar a dar verde, alguém
    ampliou a régua para "qualquer sprint" -- e essa ampliação é decisão dela,
    não efeito colateral.
    """
    sprint(
        repo,
        "2026-08-29-PROMESSA-01.md",
        f"sprint: PROMESSA-01\ncria:\n  - {PROMETIDO}\n",
        "Eu é que crio o arquivo.",
    )
    sprint(
        repo,
        "2026-08-29-VIZINHA-01.md",
        "sprint: VIZINHA-01\ncria: []\n",
        f"Eu só consumo o `{NOME_SOLTO}` que a outra cria.",
    )

    proc = rodar(repo)

    assert proc.returncode == 1, (
        "sprint citou arquivo declarado por OUTRA sprint e passou -- a régua "
        f"virou licença geral:\n{proc.stdout}"
    )
    assert "VIZINHA-01" in proc.stdout
    assert "PROMESSA-01" not in proc.stdout, (
        "quem declarou o arquivo foi acusada junto; a fronteira está no lado "
        f"errado:\n{proc.stdout}"
    )


def test_declaracao_em_outra_chave_do_frontmatter_nao_vale(repo: Path) -> None:
    """Só o `cria:` promete criação. `posse:` e `nao_toca:` falam do que EXISTE.

    Sem esta separação, declarar um arquivo inexistente em `posse:` -- que é
    erro de digitação comum -- passaria a se autoautorizar.
    """
    sprint(
        repo,
        "2026-08-29-POSSE-01.md",
        f"sprint: POSSE-01\nposse:\n  A1:\n    - {PROMETIDO}\ncria: []\n",
        f"Mexo no `{NOME_SOLTO}`.",
    )

    proc = rodar(repo)

    assert proc.returncode == 1, (
        f"caminho listado em `posse:` autorizou a citação:\n{proc.stdout}"
    )


def test_sprint_sem_frontmatter_continua_reprovando(repo: Path) -> None:
    """Sem frontmatter não há promessa, e a regra 1 fica como sempre foi."""
    caminho = repo / "docs" / "process" / "sprints" / "2026-08-29-SEM-FM-01.md"
    caminho.write_text(f"# Sem frontmatter\n\nCito o `{NOME_SOLTO}`.\n", encoding="utf-8")

    proc = rodar(repo)

    assert proc.returncode == 1, f"documento sem frontmatter passou:\n{proc.stdout}"


# ---------------------------------------------------------------------------
# 3. O token que ninguém declara reprova -- a mordida original, intacta.
# ---------------------------------------------------------------------------


def test_arquivo_que_ninguem_declara_reprova(repo: Path) -> None:
    sprint(
        repo,
        "2026-08-29-PROMESSA-01.md",
        f"sprint: PROMESSA-01\ncria:\n  - {PROMETIDO}\n",
        f"Crio o `{NOME_SOLTO}`, e cito de passagem o `{FANTASMA}`.",
    )

    proc = rodar(repo)

    assert proc.returncode == 1, (
        f"arquivo que ninguém prometeu criar passou:\n{proc.stdout}"
    )
    assert FANTASMA in proc.stdout
    assert NOME_SOLTO not in proc.stdout, (
        f"o arquivo prometido foi acusado junto com o fantasma:\n{proc.stdout}"
    )


# ---------------------------------------------------------------------------
# A borda: o `cria:` não inventa leniência nova, entra nas duas conferências
# que já existiam.
# ---------------------------------------------------------------------------


def test_link_que_sobe_ate_o_arquivo_prometido_passa(repo: Path) -> None:
    """A conferência POSICIONAL também consulta o `cria:`.

    `[…](../../../tests/unit/x.py)` resolve para o caminho exato, e o exato é
    justamente o que a sprint prometeu.
    """
    sprint(
        repo,
        "2026-08-29-PROMESSA-04.md",
        f"sprint: PROMESSA-04\ncria:\n  - {PROMETIDO}\n",
        f"O teste fica em [aqui](../../../{PROMETIDO}).",
    )

    proc = rodar(repo)

    assert proc.returncode == 0, f"{proc.stdout}{proc.stderr}"


def test_link_que_sobe_para_pasta_errada_reprova_mesmo_prometido(repo: Path) -> None:
    """Promessa não apaga a posição: o link afirma onde, e o onde está errado.

    A sprint promete `tests/unit/…`; o link aponta para `tests/…`. Não é o
    caminho prometido, e a leniência de sufixo não socorre link de subida --
    regra de 07/08/2026, que esta cura não afrouxa.
    """
    sprint(
        repo,
        "2026-08-29-PROMESSA-05.md",
        f"sprint: PROMESSA-05\ncria:\n  - {PROMETIDO}\n",
        f"O teste fica em [aqui](../../../tests/{NOME_SOLTO}).",
    )

    proc = rodar(repo)

    assert proc.returncode == 1, (
        f"link de subida para a pasta errada passou pela promessa:\n{proc.stdout}"
    )
