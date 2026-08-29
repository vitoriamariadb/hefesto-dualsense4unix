---
sprint: MIGRA-LANCADORES-06
onda: MIGRA-LANCADORES
posse:
  ML6:
    - src/hefesto_dualsense4unix/app/telas/lancadores.py
    - tests/unit/test_migra_lancadores_06_o_censo_chega_a_tela.py
cria:
  - tests/unit/test_migra_lancadores_06_o_censo_chega_a_tela.py
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
nao_toca:
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - scripts/telas/aba07.py
---

# MIGRA LANÇADORES · 06 — o censo que o produto levanta e joga fora

**O defeito:** o produto já levanta o censo inteiro da biblioteca e **usa uma
linha dele**.

`app/actions/daemon_actions.py:818` chama `prontuario_dos_jogos.levantar_censo()`
dentro de `medir_prontuario_dos_jogos` (`:807`), e o resultado vai para
`interpretar_prontuario_dos_jogos` (`:757`), que devolve **uma** linha do cartão
"Saúde do sistema" — só quando há `ponte_divergente`. Todo o resto é descartado.

O que é descartado, medido no fonte:

| O que existe | Onde | Chamador em `src/` |
|---|---|---|
| `Censo.como_dicionario()` — `{total, impedidos, curaveis_sozinho, dependem_de_espelho, com_ponte_confirmada, por_api}` em JSON puro | `prontuario_dos_jogos.py:614` | **só o `main()` do próprio módulo**, `:1030` |
| `Censo.com_ponte_confirmada` — o carimbo *"◆ 3 jogos já sabem por onde entrar"* | `:569` | **nenhum** |
| `Censo.frase()` — a linha que **nomeia** em vez de contar | `:579` | nenhum na tela |

`como_dicionario()` é a **forma exata** que a ponte do WebKit pede: JSON puro,
sem GTK, sem widget. O trabalho aqui é ligar um fio, não escrever um modelo.

**E há o buraco, que é do censo e não desta aba:** `levantar_censo` (`:733`) é
**Steam-only por construção** — `:755` só abre `discover_vdfs` e `:781` só itera
`jogos_instalados` (`appmanifest_*.acf`). O catálogo alternativo,
`integrations/jogos_locais.py`, também só enxerga Steam: casa apenas
`steam://rungameid/` (`:119`, `_EXEC_RUNGAMEID_RE`), embora leia os `.desktop`
de **todas** as pastas XDG (`:65`, `pastas_de_atalhos`).

## O que entrega

1. **Um censo, dois consumidores.** O censo passa a ser levantado **uma vez** e
   servir tanto o cartão de saúde da aba Sistema quanto esta aba. A leitura é
   lenta o bastante para nunca rodar na linha do GTK — a própria docstring do
   `:757` diz isso, e é por ela que aquela função nasceu pura.
2. **A contagem de jogos por lançador** chega ao `data-campo="jogos"` de cada
   cartão. **Só a Steam tem número.** Os outros quatro recebem **`—`**, que é o
   que o mockup já desenha para RetroArch e para os ausentes (`:640`, `:652`).
3. **`—` NÃO É `0`, e isso é requisito.** `0 jogos` afirma que o produto olhou o
   Heroic e não achou nada. Ele não olhou. A dica do cartão diz qual é a
   diferença, em português.
4. **O carimbo `◆ N jogos já sabem por onde entrar`** sai de
   `Censo.com_ponte_confirmada` (`:569`) e aparece no cartão da Steam, na fileira
   dos botões — que é onde o desenho aprovado o pôs, e por medição: como linha
   própria ele custava 21 px que **só** o cartão da Steam pagava, e a fileira
   dele nascia 21 px abaixo da do Heroic ao lado (medido em 28/08, o comentário
   está no gerador). Sem jogo carimbado, o carimbo **não aparece** — não vira
   `◆ 0`.

**O que esta sprint NÃO faz:** não varre Heroic, Lutris nem Flatpak. Isso é
**varredura nova**, não é ligar o que existe, e é decisão dela (abaixo).

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_06_o_censo_chega_a_tela.py`:

1. **O carimbo sai do censo.** Censo dublê com 3 jogos de `ponte_confirmada` → o
   cartão da Steam mostra `◆ 3 jogos já sabem por onde entrar`; com 0, o carimbo
   **não existe** no HTML pintado.
   **Mordida:** crave `3` no módulo → o segundo caso reprova. O teste **lê** o
   valor pintado; nunca compara contra um número digitado nele.
2. **`—` e `0` são coisas diferentes.** Máquina sem Steam instalada → o cartão da
   Steam mostra `—`, não `0 jogos`.
   **Mordida:** troque o `—` por `len(censo.jogos)` → reprova, porque sem Steam o
   censo devolve zero jogos e a tela passaria a afirmar que olhou.
3. **Um levantamento, não dois.** Dublê que conta chamadas de `levantar_censo` →
   abrir a aba com o cartão de saúde já pintado chama **uma** vez.
   **Mordida:** chame o censo também dentro da aba → reprova, e o custo é real:
   é varredura de disco da biblioteca inteira.
4. **Não roda na thread do GTK.** Dublê que dorme 2 s → a pintura retorna antes,
   com o campo em "medindo…".
   **Mordida:** chame direto no handler → reprova por tempo.

## O que é dela decidir

- **A aba lista LANÇADORES ou também os JOGOS de fora da Steam?** É a pergunta
  que muda materialmente o tamanho desta onda, e ela está aberta desde 26/08
  (`O REDESENHO`, "o que ainda falta decidir", item 2). Medido: hoje **nada** no
  produto lê catálogo de Heroic, Lutris ou RetroArch. Se a resposta for "também
  os jogos", nasce uma sprint nova de varredura por lançador, com a mesma
  disciplina de `evidencia` da 04 — não cabe aqui.
- **A redação do `—`.** É texto de tela num cartão que ela já aprovou com `—`
  (RetroArch, `:640`); o que muda é a **dica** que explica a diferença entre "não
  olhei" e "olhei e é zero".
