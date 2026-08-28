---
sprint: ONDA-LANCADORES-02
onda: ABA-LANCADORES
posse:
  L2:
    - src/hefesto_dualsense4unix/integrations/lancadores_instalados.py
    - tests/unit/test_lancadores_instalados.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-02-quem-esta-instalado-nesta-maquina.md
  - src/hefesto_dualsense4unix/integrations/lancadores_instalados.py
  - tests/unit/test_lancadores_instalados.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
---

# ONDA LANÇADORES · 02 — quem está instalado nesta máquina

**O defeito, em uma frase:** o produto não sabe dizer que o RetroArch existe.

**Medido hoje** (`grep -rn -i "heroic|lutris|retroarch|mgba|dolphin" src/`): cinco
linhas, **todas prosa em comentário ou docstring** —
`daemon/subsystems/hotkey.py:56`, `daemon/lifecycle.py:2250` e `:4160`,
`profiles/schema.py:1272`, `daemon/subsystems/game_signal.py:97`. RetroArch,
Dolphin e mGBA: **zero**. E o Orpheus dela depende de um emulador nativo de GBC
(D-A-ABA-LANCADORES).

## O que entrega

`integrations/lancadores_instalados.py` — **100% stdlib**, a mesma disciplina do
`prontuario_dos_jogos.py` (roda no `python3` do sistema, sem venv), **sem rede**.

A lista e a ordem são as do mockup, que ela aprovou (*"lançadores perfeito
parabéns"* — `novo-layout/_ferramentas/CORRECOES-DELA.md:59-60`):

    Steam · Heroic (Epic · GOG) · Lutris · Flatpak · RetroArch · Dolphin · mGBA

Para cada um, procura por, e **guarda qual das buscas respondeu**:

- binário no `PATH`;
- `.desktop` nas pastas de atalho — `jogos_locais.pastas_de_atalhos()`
  (`integrations/jogos_locais.py:65`) já resolve o XDG e a deduplicação;
- pacote Flatpak instalado;
- pasta de configuração no `HOME` (`~/.config/retroarch`, `~/.var/app/...`).

Devolve `Lancador(chave, nome, instalado, como_abrir, evidencia)`. **`evidencia`
não é enfeite:** é a frase que diz *por que* ele afirma que está instalado. Um
booleano sem procedência é exatamente o instrumento que esta casa paga caro.

**O que esta sprint NÃO faz, e é de propósito:** não mede se o controle chega
(é a 09) e não conta jogos (é a 03). Módulo que responde três perguntas ao mesmo
tempo esconde qual delas errou.

**Todo subprocesso com teto de tempo.** É a lição do `btmgmt` sem adaptador, que
travava o `install.sh` para sempre em quem não tem Bluetooth.

## A mordida

`tests/unit/test_lancadores_instalados.py`:

1. **Máquina falsa** (`tmp_path` como `HOME`, `PATH` dublado) com RetroArch
   presente e Dolphin ausente → RetroArch volta `instalado=True` **com a
   evidência nomeando qual busca respondeu**; Dolphin volta `False`. Arranque a
   evidência (devolva só o booleano) → o teste reprova.
2. **O subprocesso que trava.** Dublê que levanta `TimeoutExpired` → o detector
   devolve "não sei" para aquele lançador e **segue com os outros**. Arranque o
   `try` → a exceção sobe e derruba a varredura inteira: reprova.

## O que é dela decidir

- O mockup junta os dois ausentes num cartão só (**"Dolphin · mGBA"**,
  `novo-layout/07-lancadores.html:540`). Ausente agrupado é o desenho aprovado —
  mas o agrupamento vale sempre, ou só enquanto forem os dois últimos da lista?
