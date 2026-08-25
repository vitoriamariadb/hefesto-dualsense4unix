"""O PORTÃO DA COSTURA — ela serializa, e o conflito é BARULHENTO.

Duas réguas, e a segunda é a que separa este desenho de um merge automático.

1. **A SERIALIZAÇÃO.** Medido em 24/08/2026, três processos concorrentes num
   ciclo ler-modificar-gravar::

       com flock -> 3 linhas de 3 sobreviveram
       sem flock -> 1 linha  de 3 sobreviveu   (duas perdidas em SILÊNCIO)

   É a Falha 1 renascida na integração, e é o mesmo experimento. Aqui ele roda
   com duas costuras de verdade, concorrentes, num repositório dublê: as duas
   têm de aparecer em ``onda/atual``.

2. **O CONFLITO add/add.** Dois worktrees criam o MESMO arquivo com conteúdos
   diferentes -- o caso literal de PAREAMENTO x Z6. A segunda costura tem de
   sair **rc=1 nomeando o arquivo**. **Se ela "resolver sozinha", reprova**:
   conflito barulhento é o produto desejado, e é a Falha 3 deixando de ser
   silenciosa. Pôr um ``-X ours`` no merge faz esta régua reprovar dizendo que a
   costura escolheu um lado sem avisar.

E a entrega é CONDIÇÃO, não cortesia: em 23/08 foram 189 agentes, 124
relatórios, e ``docs/process/agentes/`` recebeu ZERO arquivos. Ela não apodreceu
por desleixo -- nasceu sem gatilho. Aqui o gatilho está no DESEJO do agente (que
a obra dele entre), não na disciplina dele.

TUDO RODA EM REPOSITÓRIO DUBLÊ, em tmp. Uma costura de verdade mexeria em
``onda/atual`` do repositório compartilhado com sete agentes em voo, que é a
falha que esta leva existe para matar.
"""

from __future__ import annotations

import os
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

import pytest

RAIZ = Path(__file__).resolve().parents[2]
COSTURAR = RAIZ / "scripts" / "costurar.sh"
SANITIZADOR = RAIZ / "scripts" / "sanitizar_saida_de_agente.py"

_HOJE = date.today().isoformat()

_ENTREGA_BOA = """# a entrega dublê

## O que mudou
uma linha.

## Qual mordida prova
arranquei a cura e vi reprovar.

## O que NÃO verifiquei
nada além disto.

## O que sobrou para o próximo
nada.
"""

# Um portão dublê que sabe passar E sabe reprovar -- os dois lados exercitados,
# porque régua que só sabe passar não é régua.
_PORTAO_VERDE = "#!/usr/bin/env bash\necho 'portões dublê: todos verdes'\nexit 0\n"
_PORTAO_VERMELHO = "#!/usr/bin/env bash\necho 'portões dublê: VERMELHO' >&2\nexit 1\n"


def _git(*argv: str, cwd: Path, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, check=check)


@pytest.fixture
def casa(tmp_path: Path) -> Path:
    repo = tmp_path / "casa"
    (repo / "scripts").mkdir(parents=True)
    (repo / "src").mkdir()
    (repo / "src" / "inicial.txt").write_text("nada ainda\n", encoding="utf-8")
    (repo / ".gitignore").write_text("__pycache__/\n", encoding="utf-8")
    shutil.copy(COSTURAR, repo / "scripts" / "costurar.sh")
    shutil.copy(SANITIZADOR, repo / "scripts" / "sanitizar_saida_de_agente.py")
    # o sanitizador carrega o detector de emoji de dentro do validar-glifos.py
    shutil.copy(RAIZ / "scripts" / "validar-glifos.py", repo / "scripts" / "validar-glifos.py")
    # o sanitizador importa a lista de OUIs do dono único dela
    (repo / "tests" / "unit").mkdir(parents=True)
    for pedaco in ("tests/__init__.py", "tests/unit/__init__.py"):
        (repo / pedaco).write_text("", encoding="utf-8")
    shutil.copy(
        RAIZ / "tests" / "unit" / "test_docs_mac_anonimato.py",
        repo / "tests" / "unit" / "test_docs_mac_anonimato.py",
    )
    (repo / "scripts" / "portoes.sh").write_text(_PORTAO_VERDE, encoding="utf-8")
    (repo / "scripts" / "portoes.sh").chmod(0o755)

    _git("init", "-b", "main", cwd=repo)
    # O DUBLÊ NÃO HERDA OS GANCHOS DA MÁQUINA. Os ganchos globais dela cobram
    # identidade e formato de mensagem, e um dublê que os herda mede a config da
    # máquina em vez de medir a costura — o instrumento mentindo mais que o
    # produto, de novo. Uma pasta vazia é o desligamento honesto.
    (tmp_path / "sem-ganchos").mkdir(exist_ok=True)
    _git("config", "core.hooksPath", str(tmp_path / "sem-ganchos"), cwd=repo)
    _git("config", "user.email", "duble@exemplo.invalido", cwd=repo)
    _git("config", "user.name", "dublê", cwd=repo)
    _git("config", "commit.gpgsign", "false", cwd=repo)
    _git("add", "-A", cwd=repo)
    _git("commit", "-m", "a casa dublê", cwd=repo)
    _git("branch", "dev", cwd=repo)
    _git("branch", "onda/atual", "dev", cwd=repo)
    return repo


def _agente(casa: Path, tmp_path: Path, nome: str, *, entrega: str | None = _ENTREGA_BOA) -> Path:
    """Um worktree de agente, com branch voo/* e (talvez) a entrega dentro."""
    wt = tmp_path / "voo" / nome
    _git("worktree", "add", "-b", f"voo/{nome}", str(wt), "dev", cwd=casa)
    if entrega is not None:
        pasta = wt / "docs" / "process" / "agentes" / _HOJE
        pasta.mkdir(parents=True)
        (pasta / f"{nome}.md").write_text(entrega, encoding="utf-8")
    return wt


def _costura(wt: Path, casa: Path, *extra: str) -> subprocess.CompletedProcess[str]:
    env = dict(os.environ)
    env["HEFESTO_INTEGRACAO"] = str(casa.parent / "arvore-onde-a-costura-funde")
    return subprocess.run(
        ["bash", str(wt / "scripts" / "costurar.sh"), *extra],
        cwd=wt, capture_output=True, text=True, env=env,
    )


def _entrou(casa: Path, branch: str) -> bool:
    """A branch entrou por um merge VISÍVEL, e não por já ser ancestral.

    `git branch --merged` diria "sim" para uma branch recém-criada de `dev`,
    que não costurou nada — um verde falso que faria toda régua daqui passar.
    O que se procura é o commit de merge, que `--no-ff` garante existir.
    """
    saida = _git("log", "--merges", "--oneline", "onda/atual", cwd=casa).stdout
    return branch in saida


# ---------------------------------------------------------------------------
# A entrega é condição
# ---------------------------------------------------------------------------


def test_sem_entrega_a_costura_recusa_dizendo_o_caminho(casa: Path, tmp_path: Path) -> None:
    wt = _agente(casa, tmp_path, "SEM-ENTREGA-A1", entrega=None)
    r = _costura(wt, casa)
    assert r.returncode == 1, r.stdout + r.stderr
    assert f"docs/process/agentes/{_HOJE}/SEM-ENTREGA-A1.md" in r.stderr
    assert "## O que NÃO verifiquei" in r.stderr, "não ensina os quatro cabeçalhos"
    assert not _entrou(casa, "voo/SEM-ENTREGA-A1")


def test_entrega_sem_um_cabecalho_e_recusada_nomeando_o_que_falta(
    casa: Path, tmp_path: Path
) -> None:
    capada = _ENTREGA_BOA.replace("## O que NÃO verifiquei\nnada além disto.\n", "")
    wt = _agente(casa, tmp_path, "CAPADA-A1", entrega=capada)
    r = _costura(wt, casa)
    assert r.returncode == 1
    assert "## O que NÃO verifiquei" in r.stderr, (
        "recusou mas não nomeou o cabeçalho que falta:\n" + r.stderr
    )
    assert "## O que mudou" not in r.stderr.split("obrigatório(s):")[1].split("em:")[0]
    assert not _entrou(casa, "voo/CAPADA-A1")


def test_segredo_na_entrega_faz_a_costura_recusar_e_nao_mascarar(
    casa: Path, tmp_path: Path
) -> None:
    """Foi por `docs/process/**` — isento do portão de anonimato — que a senha
    sudo dela entrou no repositório e chegou a cinco commits públicos."""
    com_segredo = _ENTREGA_BOA + "\npassword: naoDeviaEstarAqui123\n"
    wt = _agente(casa, tmp_path, "SEGREDO-A1", entrega=com_segredo)
    r = _costura(wt, casa)
    assert r.returncode == 1, r.stdout + r.stderr
    assert "RECUSOU" in r.stderr, r.stderr
    assert not _entrou(casa, "voo/SEGREDO-A1")
    # e o segredo continua onde estava: mascarar segredo não é o contrato
    assert "naoDeviaEstarAqui123" in (
        wt / "docs" / "process" / "agentes" / _HOJE / "SEGREDO-A1.md"
    ).read_text(encoding="utf-8")


def test_portao_vermelho_impede_a_costura(casa: Path, tmp_path: Path) -> None:
    wt = _agente(casa, tmp_path, "VERMELHO-A1")
    (wt / "scripts" / "portoes.sh").write_text(_PORTAO_VERMELHO, encoding="utf-8")
    _git("add", "-A", cwd=wt)
    _git("commit", "-m", "portão dublê vermelho", cwd=wt)
    r = _costura(wt, casa)
    assert r.returncode == 1
    assert "não passa por cima de portão" in r.stderr
    assert not _entrou(casa, "voo/VERMELHO-A1")


# ---------------------------------------------------------------------------
# 1. A serialização
# ---------------------------------------------------------------------------


def test_duas_costuras_concorrentes_e_as_duas_sobrevivem(casa: Path, tmp_path: Path) -> None:
    """Sem `flock`, 1 de 3 sobrevive. Com ele, as duas aparecem em onda/atual."""
    a = _agente(casa, tmp_path, "PARALELO-A1")
    b = _agente(casa, tmp_path, "PARALELO-A2")
    for wt, nome in ((a, "PARALELO-A1"), (b, "PARALELO-A2")):
        (wt / "src" / f"{nome}.txt").write_text(nome + "\n", encoding="utf-8")
        _git("add", "-A", cwd=wt)
        _git("commit", "-m", f"trabalho de {nome}", cwd=wt)

    with ThreadPoolExecutor(max_workers=2) as pool:
        resultados = list(pool.map(lambda wt: _costura(wt, casa), (a, b)))

    for r in resultados:
        assert r.returncode == 0, r.stdout + r.stderr
    assert _entrou(casa, "voo/PARALELO-A1"), "a costura de A1 sumiu"
    assert _entrou(casa, "voo/PARALELO-A2"), "a costura de A2 sumiu"

    arquivos = _git("ls-tree", "-r", "--name-only", "onda/atual", cwd=casa).stdout
    assert "src/PARALELO-A1.txt" in arquivos
    assert "src/PARALELO-A2.txt" in arquivos


def test_a_trava_e_do_kernel_e_o_arquivo_de_lock_nasce_no_git_comum(
    casa: Path, tmp_path: Path
) -> None:
    """O trinco não pode ser versionado: estado transitório em git vira carona."""
    wt = _agente(casa, tmp_path, "TRINCO-A1")
    assert _costura(wt, casa).returncode == 0
    lock = casa / ".git" / "hefesto-costura.lock"
    assert lock.exists(), "o trinco não foi criado onde o git comum mora"
    assert _git("ls-files", "hefesto-costura.lock", cwd=casa).stdout.strip() == ""


# ---------------------------------------------------------------------------
# 2. O conflito é BARULHENTO — e é o caso literal de PAREAMENTO x Z6
# ---------------------------------------------------------------------------


def test_conflito_add_add_sai_rc1_nomeando_o_arquivo(casa: Path, tmp_path: Path) -> None:
    disputado = "src/fatos_do_mapa.py"
    a = _agente(casa, tmp_path, "COLIDE-A1")
    b = _agente(casa, tmp_path, "COLIDE-A2")
    for wt, corpo in ((a, "# a versão de A1\n"), (b, "# a versão de A2, diferente\n")):
        (wt / disputado).write_text(corpo, encoding="utf-8")
        _git("add", "-A", cwd=wt)
        _git("commit", "-m", "o mesmo módulo, de dois lados", cwd=wt)

    assert _costura(a, casa).returncode == 0, "a primeira costura tinha de entrar"

    r = _costura(b, casa)
    assert r.returncode == 1, (
        "a segunda costura resolveu o conflito SOZINHA — barulho é o produto "
        "desejado, e sobrescrita silenciosa era o defeito:\n" + r.stdout + r.stderr
    )
    assert disputado in r.stderr, "o conflito não nomeia o arquivo:\n" + r.stderr

    # o lado de A1 continua de pé: nada foi escolhido por baixo
    conteudo = _git("show", f"onda/atual:{disputado}", cwd=casa).stdout
    assert conteudo == "# a versão de A1\n", "a costura escolheu um lado sem avisar"

    # e o conflito ficou ESCRITO na entrega, que é onde a decisão vai ser lida
    entrega = (b / "docs" / "process" / "agentes" / _HOJE / "COLIDE-A2.md").read_text(
        encoding="utf-8"
    )
    assert "Conflito na costura" in entrega
    assert disputado in entrega
    assert _git("status", "--porcelain", cwd=b).stdout.strip() == "", (
        "o conflito foi escrito na entrega mas não commitado"
    )


def test_a_costura_recusa_branch_que_nao_e_de_agente(casa: Path, tmp_path: Path) -> None:
    r = subprocess.run(
        ["bash", str(casa / "scripts" / "costurar.sh")],
        cwd=casa, capture_output=True, text=True,
    )
    assert r.returncode == 1
    assert "não é branch de agente" in r.stderr
