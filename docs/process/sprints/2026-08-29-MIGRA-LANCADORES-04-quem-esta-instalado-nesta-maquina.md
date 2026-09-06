---
sprint: MIGRA-LANCADORES-04
estado: absorvida
onda: MIGRA-LANCADORES
posse:
  ML4:
    - src/hefesto_dualsense4unix/integrations/lancadores_instalados.py
    - tests/unit/test_lancadores_instalados.py
cria:
  - src/hefesto_dualsense4unix/integrations/lancadores_instalados.py
  - tests/unit/test_lancadores_instalados.py
bancada: false
depois_de:
  # A SPRINT QUE ESTA AQUI SUBSTITUI. A `ONDA-LANCADORES-02` de 27/08 reivindica
  # os mesmos dois arquivos, e o diagnóstico dela sobrevive inteiro — o que
  # caducou é a onda, não a medição. Declarada para o portão ver substituição,
  # e não descuido. Fora isto, esta sprint NÃO DEPENDE DE NADA e pode correr do
  # primeiro minuto: não importa uma linha da janela.
  - ONDA-LANCADORES-02
nao_toca:
  - src/hefesto_dualsense4unix/app/
  - src/hefesto_dualsense4unix/gui/
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
  - src/hefesto_dualsense4unix/integrations/jogos_locais.py
  - scripts/telas/aba07.py
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA LANÇADORES · 04 — quem está instalado nesta máquina

**O defeito, em uma frase:** o produto não sabe dizer que o RetroArch existe.

Medido agora, `grep -rn -iE 'heroic|lutris|retroarch|mgba|dolphin' src/`: **cinco
linhas, todas prosa em comentário** — `daemon/subsystems/hotkey.py:56`,
`daemon/lifecycle.py:2250` e `:4160`, `profiles/schema.py:1272`,
`daemon/subsystems/game_signal.py:97`. RetroArch, Dolphin e mGBA: **zero**. E o
Orpheus dela depende de um emulador nativo de GBC (`D-A-ABA-LANCADORES`).

A única resposta que existe hoje é a da Steam:
`app/actions/emulation_actions.py:410` (`STEAM_NAO_ENCONTRADA`) e `:416`
(`markup_status_steam_input`), que procuram nos quatro lugares de
`integrations/steam_launch_options.py:121` (`RAIZES_STEAM_RELATIVAS`).

**Esta é a sprint mais independente da onda** (`depois_de: []`): o módulo não
importa nada da janela, não conhece WebKit e roda no `python3` do sistema. Pode
correr do primeiro minuto, antes até do ok dela sobre o piloto.

## O que entrega

`integrations/lancadores_instalados.py` — **100% stdlib**, sem rede, a mesma
disciplina do `prontuario_dos_jogos.py`. A lista e a ordem são as do mockup que
ela aprovou:

    Steam · Heroic (Epic · GOG) · Lutris · Flatpak · RetroArch · Dolphin · mGBA

Para cada um, quatro buscas, **e ele guarda qual delas respondeu**:

- binário no `PATH`;
- `.desktop` nas pastas de atalho — `jogos_locais.pastas_de_atalhos()`
  (`integrations/jogos_locais.py:65`) já resolve o XDG e a deduplicação, e já
  alcança `~/.local/share/flatpak/exports/share/applications`;
- pacote Flatpak instalado;
- pasta de configuração no `HOME` (`~/.config/retroarch`, `~/.var/app/…`).

Devolve `Lancador(chave, nome, instalado, como_abrir, evidencia)`. A `chave` é a
mesma do `data-lanc` da **03** — um vocabulário, não dois. O `como_abrir` é o que
a **09** consome.

**`evidencia` não é enfeite.** É a frase que diz *por que* ele afirma que está
instalado, e ela existe porque **a detecção por varredura é fábrica de régua
falsa**: cada uma das quatro buscas pode dizer "instalado" por um arquivo órfão
que ninguém desinstalou. Um booleano sem procedência é o instrumento que esta
casa mais paga — seis falsos em quinze horas em 29/08, cinco deles pegos por quem
escreveu a própria régua.

**Todo subprocesso com teto de tempo.** É a lição do `btmgmt` sem adaptador, que
travava o `install.sh` **para sempre** em quem não tem Bluetooth. O lançador que
estourar vira **"não sei"** e os outros seguem.

**O que esta sprint NÃO faz, e é de propósito:** não conta jogos (é a 06), não
mede se o controle chega (é a 10) e não abre nada (é a 09). Módulo que responde
três perguntas ao mesmo tempo esconde qual delas errou.

## Como se prova — a mordida

`tests/unit/test_lancadores_instalados.py`:

1. **Máquina falsa** (`tmp_path` como `HOME`, `PATH` dublado) com RetroArch
   presente e Dolphin ausente → RetroArch volta `instalado=True` **com a
   evidência nomeando qual busca respondeu**; Dolphin volta `False`.
   **Mordida:** devolva só o booleano → reprova.
2. **Duas buscas respondendo.** RetroArch no `PATH` **e** como Flatpak → a
   evidência nomeia **as duas**, não a primeira.
   **Mordida:** troque o acumulador por um `return` na primeira → reprova.
3. **O subprocesso que trava.** Dublê que levanta `TimeoutExpired` → aquele
   lançador vira "não sei" e a varredura **segue com os outros cinco**.
   **Mordida:** arranque o `try` → a exceção sobe e derruba a varredura inteira.
4. **Zero lançadores é resposta legítima.** `HOME` vazio e `PATH` vazio → lista
   com os sete, todos `instalado=False`, sem exceção e sem lista vazia.
   **Mordida:** faça o módulo devolver `[]` quando não acha nada → reprova, e a
   tela perderia a diferença entre "procurei e não achei" e "não procurei".

## O que é dela decidir

- **Lançador ausente some da tela ou fica apagado, e o agrupamento vale sempre?**
  O mockup junta os dois ausentes num cartão só — *"Dolphin · mGBA"*,
  `layout/07-lancadores.html:648`, com opacidade 0,5. Com **três** ausentes
  o desenho aprovado não diz o que fazer. Esta sprint devolve os sete
  separados e deixa o agrupamento para a **05**, que é quem pinta; marcado
  `PROVISÓRIO — decisão dela`.
