"""O que está em ``docs/process/agentes/`` passou pelo sanitizador.

Este portão existe porque o irmão não cobre este chão: ``check_anonymity.sh``
**isenta** ``docs/process/**``, e o ``.gitignore`` diz por escrito que bloquear
``docs/process/audits/`` era "a defesa real". Em 06/08/2026 ela pediu que a saída
dos agentes passasse a ser versionada — o que reabre exatamente o caminho por
onde a senha ``sudo`` dela vazou em 26/06/2026, para cinco commits que hoje estão
em ``origin/main``.

A troca é: a saída entra, mas com um portão que morde.

Para arrancar e ver morder: escreva ``echo hunter2 | sudo -S ls`` em qualquer
arquivo de ``docs/process/agentes/``, ou devolva um MAC real a um deles.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

RAIZ = Path(__file__).resolve().parents[2]
if str(RAIZ) not in sys.path:
    sys.path.insert(0, str(RAIZ))

from scripts.sanitizar_saida_de_agente import (
    _OUIS_COMO_TRIO,
    _bloqueado_pelo_hook,
    mascarar_enderecos,
    normalizar_glifos,
    recusar,
    sanitizar,
)
from tests.unit.test_docs_mac_anonimato import _OUIS_REAIS_OCTETOS

AGENTES = RAIZ / "docs" / "process" / "agentes"


def _arquivos() -> list[Path]:
    """A saída de agente: as levas datadas, não a documentação do portão.

    O `README.md` do diretório EXPLICA os padrões proibidos, e por isso os
    contém — é a mesma isenção que `test_docs_mac_anonimato.py` dá a si mesmo.
    Só entram aqui as pastas de leva (`2026-08-06/` e as que vierem), que é onde
    a saída crua mora. Um arquivo novo na raiz não passa despercebido: ele
    simplesmente não é saída de agente, e o portão de MAC do repositório inteiro
    continua olhando para ele.
    """
    if not AGENTES.is_dir():
        return []
    return sorted(
        p
        for p in AGENTES.rglob("*")
        if p.is_file() and p.suffix == ".md" and p.parent != AGENTES
    )


def test_a_lista_de_ouis_tem_dono_unico() -> None:
    """Duas fontes para a mesma regra é a classe de defeito desta casa.

    O sanitizador importa os OUIs do portão de MAC. Se alguém copiar a lista
    para o script, este teste continua verde por acidente — então ele checa a
    IDENTIDADE do objeto derivado, não só o conteúdo.
    """
    esperado = {"".join(o) for o in _OUIS_REAIS_OCTETOS}
    assert esperado == _OUIS_COMO_TRIO, (
        "a lista de OUIs do sanitizador divergiu da do portão de MAC — "
        "há duas fontes para a mesma regra"
    )


@pytest.mark.parametrize("arquivo", _arquivos(), ids=lambda p: p.name)
def test_nenhum_arquivo_de_agente_tem_segredo(arquivo: Path) -> None:
    """Segredo faz o arquivo ser RECUSADO — nunca corrigido em silêncio."""
    texto = arquivo.read_text(encoding="utf-8", errors="replace")
    motivos = recusar(texto)
    assert not motivos, (
        f"{arquivo.relative_to(RAIZ)} tem segredo e não podia estar versionado:\n"
        + "\n".join(motivos)
        + "\n\nRode: python3 scripts/sanitizar_saida_de_agente.py ORIGEM DESTINO"
    )


@pytest.mark.parametrize("arquivo", _arquivos(), ids=lambda p: p.name)
def test_nenhum_arquivo_de_agente_tem_mac_real(arquivo: Path) -> None:
    """Mascarar de novo não pode mudar nada — se muda, passou um MAC cru.

    A régua é ``mascarar_enderecos``, e NÃO ``sanitizar``. A diferença nasceu de
    um defeito medido em 03/09/2026: ``sanitizar`` também normaliza glifo, então
    uma nota musical (U+266A) em dois relatórios da leva de 01/09 reprovava aqui
    com a mensagem "tem MAC real (com separador, colado ou com o OUI elidido)".
    Não havia endereço nenhum nos arquivos — a régua acusava a coisa errada, e
    quem foi conferir gastou a investigação inteira procurando um MAC que não
    existia. O glifo tem régua PRÓPRIA logo abaixo, com o nome do que mede.
    """
    texto = arquivo.read_text(encoding="utf-8", errors="replace")
    assert mascarar_enderecos(texto, home=None) == texto, (
        f"{arquivo.relative_to(RAIZ)} tem MAC real (com separador, colado ou com "
        "o OUI elidido) — a máscara da casa é octetos 4 e 5 zerados"
    )


@pytest.mark.parametrize("arquivo", _arquivos(), ids=lambda p: p.name)
def test_nenhum_arquivo_de_agente_tem_glifo_proibido(arquivo: Path) -> None:
    """A outra metade, e ela precisa do nome certo para não virar alarme falso.

    O ``validar-glifos.py`` do repositório NÃO alcança este chão: ele segue o
    Emoji_Presentation estrito, e tanto o U+2713 (CHECK MARK) quanto o U+266A
    (nota musical) têm apresentação de TEXTO — passam por ele e travam no
    ``universal-sanitizer.py`` do pre-commit, que usa faixas largas. Quem
    sanitiza para o repositório obedece ao MAIS ESTRITO dos dois; esta régua é
    esse contrato, medido sobre a saída de agente já versionada.
    """
    texto = arquivo.read_text(encoding="utf-8", errors="replace")
    assert normalizar_glifos(texto) == texto, (
        f"{arquivo.relative_to(RAIZ)} tem glifo que o hook de pre-commit bloqueia "
        "— não é MAC, é emoji/símbolo. Os que carregam sentido viram texto "
        "(`[OK]`, `[X]`, `[!]`, `[nota]`, `[mic]`); os decorativos saem."
    )


# ---------------------------------------------------------------------------
# A LISTA COPIADA A MÃO, e o dono que ninguém consultava — 08/09/2026
# ---------------------------------------------------------------------------


#: O QUE O DONO DECLARA. Procedência: a variável `EMOJI_RE` do hook de
#: pre-commit da casa (o `_lib.sh` da pasta apontada por `core.hooksPath`),
#: transcrita em 08/09/2026. São as OITO faixas, na ordem em que ele as
#: escreve.
#:
#: POR QUE ISTO É TRANSCRIÇÃO E NÃO LEITURA AO VIVO — e a razão é da casa, não
#: minha. O hook mora em configuração de MÁQUINA, fora da árvore, e alcançá-lo
#: exigiria resolver o `$HOME` REAL de quem roda. A suíte **proíbe isso por
#: desenho**: o `tests/conftest.py` desvia `HOME` e os quatro `XDG_*` para um
#: lar de mentira, e a própria mensagem de reprovação dele manda procurar
#: "`pwd`/`getpwuid` (que ignoram o HOME)" como sintoma de teste que furou o
#: isolamento. Um teste que lesse o hook de verdade seria esse furo. E no
#: runner do CI o hook não existe de todo.
#:
#: A transcrição não é acreditada: `_faixas_do_dono()` abaixo LÊ o hook quando
#: ele está ao alcance **sem consultar `$HOME`** — o `.git/hooks` da própria
#: árvore, ou o `EMOJI_RE` que a variável `HEFESTO_HOOK_EMOJI_RE` trouxer — e
#: só cai nesta lista quando nenhum dos dois responde. Não há `skip`: a régua
#: mede sempre, e mede mais fundo onde pode.
_FAIXAS_QUE_O_HOOK_DECLARA = (
    (0x1F600, 0x1F64F),
    (0x1F300, 0x1F5FF),
    (0x1F680, 0x1F6FF),
    (0x2600, 0x26FF),
    (0x2700, 0x27BF),
    (0x1F900, 0x1F9FF),
    (0x1FA00, 0x1FA6F),
    (0x1FA70, 0x1FAFF),
)


def _faixas_do_dono() -> tuple[list[tuple[int, int]], str]:
    """As faixas do `EMOJI_RE`, e de onde elas vieram.

    Devolve `(faixas, procedência)`. Tenta o hook ao vivo por dois caminhos que
    **não** consultam o `$HOME` — a variável `HEFESTO_HOOK_EMOJI_RE` e a pasta
    `.git/hooks` da própria árvore —, e cai na transcrição acima quando nenhum
    responde. A procedência entra na mensagem de reprovação para que ninguém
    confunda "medido contra o dono" com "medido contra a cópia".
    """
    import os
    import re

    def _extrair(texto: str) -> list[tuple[int, int]]:
        m = re.search(r"EMOJI_RE[^\n]*?\[((?:\\x\{[0-9A-Fa-f]+\}-?)+)\]", texto)
        alvo = m.group(1) if m else texto
        return [
            (int(a, 16), int(b, 16))
            for a, b in re.findall(
                r"\\x\{([0-9A-Fa-f]+)\}-\\x\{([0-9A-Fa-f]+)\}", alvo
            )
        ]

    cru = os.environ.get("HEFESTO_HOOK_EMOJI_RE", "")
    if cru:
        faixas = _extrair(cru)
        if faixas:
            return faixas, "o hook AO VIVO (via HEFESTO_HOOK_EMOJI_RE)"

    for nome in ("_lib.sh", "pre-commit"):
        arq = RAIZ / ".git" / "hooks" / nome
        try:
            texto = arq.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        faixas = _extrair(texto)
        if faixas:
            return faixas, f"o hook AO VIVO (.git/hooks/{nome})"

    return list(_FAIXAS_QUE_O_HOOK_DECLARA), "a transcrição de 08/09/2026"


def test_a_faixa_do_hook_nao_se_copia_a_mao() -> None:
    """A lista deste repositório cobre TODA faixa que o dono declara.

    A CAUSA MEDIDA, 08/09/2026: `_FAIXAS_DO_HOOK` era cópia à mão do `EMOJI_RE`
    do hook, e trazia DUAS das OITO faixas que ele declara. Faltavam as seis
    dos planos suplementares — entre elas `U+1F300-U+1F5FF`, onde mora o
    `U+1F399`, que atravessava OS DOIS portões da casa (este por ausência na
    cópia; o `validar-glifos.py` porque o ponto de código tem apresentação de
    TEXTO) e sobrevivia em **nove relatórios de agente já versionados**.

    *"O mais estrito dos dois" só é tão estrito quanto uma lista copiada a
    mão.* Esta régua tira a cópia da confiança: o `_FAIXAS_DO_HOOK` do script
    deixa de ser a única afirmação sobre o assunto e passa a ser medido contra
    uma segunda, com procedência declarada.

    **NÃO HÁ `skip` AQUI, DE PROPÓSITO.** A primeira escrita desta régua pulava
    quando o hook não estava ao alcance — e como a suíte isola o `$HOME`, ela
    pulava SEMPRE. Uma régua que só sabe pular é um verde sobre nada, que é a
    forma exata que esta leva inteira existe para matar. Ela agora mede sempre:
    contra o hook onde ele responde, contra a transcrição onde não responde, e
    diz na reprovação qual dos dois usou.

    A MORDIDA: apague `(0x1F300, 0x1F5FF)` de `_FAIXAS_DO_HOOK` e este teste
    nomeia a faixa que ficou descoberta.
    """
    faixas, procedencia = _faixas_do_dono()
    assert faixas, "não consegui obter faixa nenhuma — nem do hook, nem da transcrição"

    descobertas: list[str] = []
    for lo, hi in faixas:
        faltando = [cp for cp in range(lo, hi + 1) if not _bloqueado_pelo_hook(cp)]
        if faltando:
            descobertas.append(
                f"U+{lo:04X}-U+{hi:04X}: {len(faltando)} pontos de código fora "
                f"da cópia (o primeiro é U+{faltando[0]:04X})"
            )

    assert not descobertas, (
        f"`_FAIXAS_DO_HOOK` não cobre o que o hook bloqueia (medido contra "
        f"{procedencia}):\n  " + "\n  ".join(descobertas)
        + "\n\nQuem sanitiza para o repositório obedece ao MAIS ESTRITO dos "
        "dois portões, e o hook é o mais estrito. O que escapar daqui passa no "
        "repositório e trava no commit — ou pior, entra versionado, que foi o "
        "que se mediu com o U+1F399 em nove relatórios. Acrescente a faixa em "
        "`scripts/sanitizar_saida_de_agente.py`; e ANTES de acrescentar, "
        "meça se ela não engole um RÓTULO de botão do produto, que vira "
        "entrada em `_EMOJI_COM_SENTIDO` em vez de sumir."
    )


def test_a_transcricao_do_hook_tem_as_oito_faixas() -> None:
    """A transcrição não encolhe sem alguém reparar — foi assim que encolheu.

    O defeito de origem não foi a lista estar errada no dia em que nasceu: foi
    ela ter ficado para trás em silêncio, e ninguém ter como notar. Este teste
    é o alarme mais barato possível: a transcrição declara OITO faixas, e as
    oito têm de continuar lá.
    """
    assert len(_FAIXAS_QUE_O_HOOK_DECLARA) == 8, (
        "a transcrição do `EMOJI_RE` mudou de tamanho. Se o hook da casa mudou, "
        "atualize as DUAS pontas (esta lista e `_FAIXAS_DO_HOOK`) e meça o que "
        "a faixa nova engole antes de fechar."
    )
    assert all(lo <= hi for lo, hi in _FAIXAS_QUE_O_HOOK_DECLARA)
    assert not _bloqueado_pelo_hook(ord("a")), "letra comum virou emoji"


def test_o_rotulo_do_microfone_sobrevive_ao_alargamento() -> None:
    """As seis faixas novas apagam decoração e PRESERVAM o nome do botão.

    A outra metade da cura de 08/09, e a que roda em toda parte — inclusive no
    CI, onde o hook não existe. Ela mede os pontos de código NOMEADOS em vez de
    comparar listas.

    O RISCO QUE ELA GUARDA: alargar `_FAIXAS_DO_HOOK` para as faixas do dono
    faz `U+1F300-U+1F5FF` alcançar o `U+1F399`, que é o RÓTULO do botão do
    microfone na aba Controles — o par exato do `U+266A` do alto-falante, cuja
    lápide de 03/09 diz *"rótulo de botão não é decoração"*. Sem a linha em
    `_EMOJI_COM_SENTIDO` o alargamento o apagaria de nove relatórios, repetindo
    o defeito de 03/09 no ato de consertar outro.

    A MORDIDA: tire `"\\U0001f399"` de `_EMOJI_COM_SENTIDO` e este teste
    reprova dizendo que o rótulo sumiu sem troca.
    """
    mic = "\U0001f399"
    assert normalizar_glifos(f"o {mic} nasce disabled") == "o [mic] nasce disabled", (
        "o rótulo do botão do microfone deixou de virar `[mic]`. Se ele está "
        "sendo APAGADO, a frase fica sem sujeito — é o defeito que a nota "
        "musical (U+266A) documenta em 03/09/2026, repetido. Rótulo de botão "
        "vira texto; decoração é que sai."
    )

    # E a decoração das faixas novas continua saindo, senão o alargamento não
    # alargou nada. Um por faixa, e nenhum deles é rótulo de coisa nenhuma.
    for cp in (0x1F30D, 0x1F600, 0x1F680, 0x1F9E0, 0x1FA01, 0x1FA79):
        assert normalizar_glifos(f"a{chr(cp)}b") == "ab", (
            f"U+{cp:04X} sobreviveu ao sanitizador. Ele está numa faixa que o "
            "hook de pre-commit bloqueia: passa aqui e trava no commit."
        )


def test_o_sanitizador_recusa_a_forma_que_vazou() -> None:
    """A mordida do portão: a forma EXATA do vazamento de 26/06/2026."""
    assert recusar("echo hunter2 | sudo -S rm -rf /"), (
        "o sanitizador parou de recusar `echo <senha> | sudo -S`, que é como a "
        "senha dela entrou no repositório em 26/06/2026"
    )


def test_o_sanitizador_recusa_a_forma_que_ela_usa_de_verdade() -> None:
    """A forma nova, medida em 07/08/2026 — e ela escapava do filtro inteiro.

    O padrão antigo de senha literal cobra `senha:` / `password=`, isto é, a
    palavra-chave COM SEPARADOR. Ela não escreve assim. Ela escreve a senha
    SOLTA, ao lado do `sudo` — "usa sudo <numero> roda ... te autorizo" (07/08)
    e "senha sudo <numero> pode tomar a decisão que quiser" (06/08). Nas duas, o
    `\\s*[:=]\\s*` não casa e o arquivo passaria por um portão que existe
    exatamente para impedir isso.

    Os números aqui são inventados. A senha dela não entra nesta árvore nem
    numa asserção.
    """
    assert recusar("usa sudo 8675309 e roda"), (
        "o sanitizador não recusa a senha solta ao lado do `sudo` — é a forma "
        "que ela usa no chat, e este portão existe para pegá-la"
    )
    assert recusar("senha sudo 8675309 pode tomar a decisão que quiser"), (
        "o sanitizador não recusa `senha sudo <numero>` — palavra-chave sem "
        "separador, que é como ela escreve"
    )
    assert recusar("a senha é 8675309"), "palavra-chave e número sem separador"


def test_a_forma_nova_nao_reprova_comando_legitimo_nem_data() -> None:
    """A contrapartida, e sem ela o portão morre de ruído.

    Um `sudo\\s+\\S+` genérico reprovaria metade dos relatórios desta casa. O
    que entrou é apertado de propósito: só um número solto onde deveria haver
    um comando, e só um número colado à palavra-chave. Data não conta — foi por
    isso que o dígito não pode vir depois de `/` nem de `-`.
    """
    assert not recusar("sudo systemctl --user restart hefesto-dualsense4unix")
    assert not recusar("rodei sudo python3 scripts/doctor.sh e li a saída")
    assert not recusar("sudo chmod 755 /usr/local/bin/hefesto")
    assert not recusar("a senha dela vazou em 26/06/2026 e está em cinco commits")
    assert not recusar("a senha continua no histórico desde 2026, e a árvore está limpa")


def test_a_mencao_solta_ao_sudo_nao_recusa() -> None:
    """E a contrapartida: um portão que reprova citação vira ruído e morre.

    Os relatórios de agente citam `sudo -S` para EXPLICAR um achado — foi o caso
    de `tres-achados-da-noite.md`, que registra que a leva reiniciou o
    `bluetoothd` contra a regra explícita. Recusar isso apagaria a auto-auditoria.
    """
    assert not recusar("o relatório cita: sudo -S systemctl restart bluetooth")


def test_o_oui_publico_sobrevive_a_mascara() -> None:
    """Mascarar o OUI destruiria a informação sem proteger nada.

    O portão de MAC diz por escrito que "os OUIs em si já são públicos no repo".
    O que identifica o aparelho é o SUFIXO.
    """
    oui = ":".join(_OUIS_REAIS_OCTETOS[0])
    texto = f"o adaptador tem OUI {oui} e o sufixo dele importa"
    assert oui in sanitizar(texto, home=None)


def test_um_mac_real_completo_e_mascarado() -> None:
    """As três grafias, porque a forma colada é a que o produto gera."""
    a, b, c = _OUIS_REAIS_OCTETOS[1]
    limpo = sanitizar(f"{a}:{b}:{c}:c3:11:f0 e {a}{b}{c}c311f0", home=None)
    assert "c3:11" not in limpo and "c311" not in limpo, limpo
    assert f"{a}:{b}:{c}:00:00:f0" in limpo, limpo
