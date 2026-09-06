---
sprint: MIGRA-LANCADORES-09
estado: absorvida
onda: MIGRA-LANCADORES
posse:
  ML9:
    - src/hefesto_dualsense4unix/app/telas/lancadores.py
    - src/hefesto_dualsense4unix/integrations/abrir_lancador.py
    - tests/unit/test_migra_lancadores_09_os_botoes.py
cria:
  - src/hefesto_dualsense4unix/integrations/abrir_lancador.py
  - tests/unit/test_migra_lancadores_09_os_botoes.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-01
  # O ENXERTO DESTA ABA: é ele quem cria `app/telas/lancadores.py`,  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
  # que da 05 à 10 é escrito EM SÉRIE por ser um arquivo só.
  - MIGRA-LANCADORES-01
  - MIGRA-LANCADORES-02
  - MIGRA-LANCADORES-03
  - MIGRA-LANCADORES-04
  - MIGRA-LANCADORES-05
  - MIGRA-LANCADORES-06
  - MIGRA-LANCADORES-07
  - MIGRA-LANCADORES-08
  # O ATALHO "Detectar o jogo que está aberto" CHAMA A ABA PERFIS, e não define
  # uma segunda detecção: `D-DETECTAR-O-JOGO-MORA-EM-PERFIS` (decisoes-dela.csv:101).
  - ONDA-PERFIS-03  # "detectar o jogo que está aberto" — a dona da detecção
  - MIGRA-PERFIS-04  # o editor de perfil no motor novo, que é quem recebe o atalho
nao_toca:
  - src/hefesto_dualsense4unix/integrations/steam_launcher.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/profiles/
  - scripts/telas/aba07.py
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA LANÇADORES · 09 — os botões que saem da aba

**O defeito:** dos 14 gestos da tela, quatro famílias levam a pessoa para fora da
aba, e **nenhuma delas está ligada**. Uma existe pronta e a janela nunca a chama.

| Gesto | Quantos | Estado hoje |
|---|---|---|
| Abrir o lançador | 5 | `integrations/steam_launcher.py:154` (`open_or_focus_steam`) **existe e funciona** — o único chamador é o botão PS do daemon (`daemon/subsystems/hotkey.py:69`); a **janela nunca o chama**. Para os outros quatro: nada |
| Criar perfil para um jogo | 3 | nada |
| Detectar o jogo que está aberto | 1 | mora na aba **Perfis** por decisão dela (`decisoes-dela.csv:101`) |
| Aplicar o estilo Retrô/Emulador | 1 | **não existe estilo nenhum em código** |

## O que entrega

1. **`integrations/abrir_lancador.py`** — generaliza o que o
   `steam_launcher.py` já sabe fazer: *achar rodando → focar a janela → senão
   abrir*. Ele **não reescreve** o caminho da Steam: para a chave `steam`,
   delega a `open_or_focus_steam`. Para os outros, usa o `como_abrir` que o
   detector da **04** guardou, com a evidência que diz de onde ele saiu.
   **Todo subprocesso com teto de tempo** (a lição do `btmgmt`), e falha **alta**:
   sem binário, a tela diz o que faltou — nunca um verde mudo, que é o defeito
   que `O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO` registra.
2. **"Criar perfil para um jogo"** abre a aba Perfis com o jogo preenchido. No
   motor novo isso é **navegação da tira**, não uma segunda tela: a mensagem que
   sobe pela ponte carrega `{aba:"lancadores", gesto:"criar-perfil",
   alvo:<chave>}` e quem troca de página é a moldura.
3. **"Detectar o jogo que está aberto" é ATALHO, e o produto prova que é.**
   `D-DETECTAR-O-JOGO-MORA-EM-PERFIS` é literal: *"A LANÇADORES-06 sai, e a aba
   Lançadores ganha um atalho que chama a mesma coisa."* Este módulo **não define
   detecção nenhuma** — chama a da Perfis. Era a duplicata mais cara da fila.
4. **"Aplicar o estilo Retrô/Emulador" NÃO NASCE nesta onda, e a razão é
   medida.** `RETRÔ/EMULADOR` é um dos catorze de `D-CATORZE-ESTILOS-DE-FABRICA`
   (`docs/data/decisoes-dela.csv:70`) e **nenhum dos catorze existe em código**:
   `grep -n 'estilo' src/hefesto_dualsense4unix/profiles/schema.py` devolve zero.
   O que há é `trigger_presets.py` (curvas de gatilho) e `gamepad_flavor`
   (`schema.py:585`, `:694`), que é a **máscara** — outra coisa. Depende da
   **ONDA-PERFIS-04** e de `D-OS-OITO-ESTILOS-DE-JOGO-NASCEM-NO-MOCKUP`
   (`decisoes-dela.csv:117`): dependência **entre ondas**.
   Botão desenhado sem estilo por trás é o instrumento que mente, no botão mais
   chamativo da tela. Ele nasce **inerte, com o motivo na dica** — ou não nasce;
   é dela.

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_09_os_botoes.py`:

1. **Cada "Abrir o lançador" abre o seu.** Dublê de `Popen`/`which` por lançador
   → clicar no cartão do Lutris tenta abrir o **Lutris**, não a Steam.
   **Mordida:** faça todos caírem em `open_or_focus_steam` → reprova, e é o erro
   fácil, porque é a única função que existe hoje.
2. **A Steam continua com o dono que já tem.** Dublê que conta chamadas →
   `data-lanc="steam"` chama `open_or_focus_steam`, e não uma cópia nova.
   **Mordida:** reimplemente o caminho da Steam dentro do módulo novo → reprova.
3. **Falha alta.** `which` devolvendo `None` → a tela diz qual binário faltou.
   **Mordida:** engula a falha e devolva `True` → reprova. `open_or_focus_steam`
   nunca levanta (é contrato dele, `:164`), então **silêncio é o desfecho
   natural** se ninguém exigir a mensagem.
4. **Subprocesso com teto.** Dublê que levanta `TimeoutExpired` → aquele botão
   relata "não consegui" e os outros cinco continuam clicáveis.
   **Mordida:** arranque o `timeout` → a janela trava, e é a repetição do
   `btmgmt` sem adaptador.
5. **A detecção tem UM dono.** Grep: `app/telas/lancadores.py` e  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
   `abrir_lancador.py` **não** contêm leitura de `window_detect_*` nem de
   `jogo_steam` (`daemon/ipc_handlers.py:2237` e `:2214`).
   **Mordida:** copie a leitura para cá → reprova, com a citação da decisão dela.
6. **O botão roxo não promete.** Página pintada → `data-acao="estilo-retro"`
   existe **inerte** e com motivo, ou não existe; em nenhum caso ele chama algo
   que aplique um estilo.
   **Mordida:** ligue-o a um `aplicar_estilo` inventado → reprova, porque
   `profiles/schema.py` não tem onde guardá-lo.

## O que é dela decidir

- **Em qual perfil cai o "Aplicar o estilo Retrô/Emulador".** A fita desta aba é
  esmaecida de propósito (`fita_viva=False`, no fim do gerador;
  `D-A-FITA-VIVE-ONDE-A-ABA-AJUSTA-POR-CONTROLE`), então **não há controle
  escolhido** — e o estilo é do perfil, não do controle. Sem essa resposta o
  botão não tem alvo.
- **O botão roxo nasce inerte com motivo, ou não nasce?** As duas são honestas.
  Inerte ensina que a feature vem; ausente não ocupa espaço numa aba que já passa
  da dobra. É desenho, logo é dela.
