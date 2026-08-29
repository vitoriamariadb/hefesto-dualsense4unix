---
sprint: MIGRA-SISTEMA-03
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M3:
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
cria:
  - tests/unit/test_migra_sistema_03_a_ponte_de_leitura.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-02
  # SÉRIE, por R5: dividem `daemon_actions.py` com esta.
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-06
  - ONDA-SISTEMA-07
  # SÉRIE: também reivindica `daemon_actions.py`.
  - LEVA-1
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA SISTEMA · 03 — Os dez valores que o produto já lê

**O defeito:** depois da MIGRA-SISTEMA-01 a aba é a página aprovada por ela —
e ela mostra a **cena do mockup**, não a máquina. "O Hefesto está **Ligado**",
"Pausado: **Sim, e volta pausado**", "Os **4** controles" são literais do
gerador (`aba09.py:537-540`). Com o Hefesto desligado, a tela continua dizendo
Ligado.

**Dos 19 valores da tela, DEZ o produto já lê hoje.** Esta sprint **liga**, não
reescreve — a regra da onda: *o que o produto já lê, lê.*

## O que já existe, e por onde chega

| valor da tela | quem já lê, hoje |
|---|---|
| **O Hefesto está** | `_refresh_daemon_view_async:1923` (`systemctl is-active`) → `_apply_daemon_view:1944` → `_set_daemon_status_markup`. Quatro estados em `_daemon_status:2475` |
| **Ligar junto com o computador** | o mesmo par: `systemctl is-enabled` → `daemon_autostart_switch` |
| **Trocar de perfil ao abrir o jogo** | `_refresh_window_detect_diag:1174` → `descrever_deteccao_de_janela:123`, sobre o bloco `window_detect_*` do `state_full` (`daemon/ipc_handlers.py:2237`) |
| **Pausado** | `state_full["paused"]` (`ipc_handlers.py:2002`). **Publicado, e esta aba nunca o leu** — os dois únicos leitores em `app/` são `home_actions.py:237` e `emulation_actions.py:1500` |
| **os três achados do exame que existem** | `storm_doctor.storm_report:755` → `_refresh_storm_diag:1109` → `_apply_storm_diag:1166`. São `check_authorized_rule:536`, `check_steam_input:413` e `check_snd_audio_healthy:691` |
| **Vale para: Os N controles** | `state_full["controllers"]` (`ipc_handlers.py:2491`), já consumido por `storm_doctor.controles_no_cabo:640`, chamado de `daemon_actions.py:1127` |
| **as três linhas do Perfil de Bateria** | `app/actions/config/secao_orcamento.py` — `PERFIS:118`, `ROTULOS_DOS_PERFIS:125`, `TETO_POR_PERFIL:137`, `LINHAS_DO_TETO:206`, `alcance_de_hoje:267`, `orcamento_na_tela:326`. **É a MIGRA-SISTEMA-08 que muda o endereço deles**; esta sprint só prova que a ponte os alcança |

**O gancho de disparo já existe e não muda:** `app/app.py:1114` →
`_refresh_daemon_tab_on_show` (`daemon_actions.py:2244`), que já chama os três
refreshers ao entrar na aba.

## O que entrega

1. **Uma função de pintura, e uma só.** Os três refreshers deixam de mirar
   `Gtk.Label` e passam a entregar um **dicionário de valores** a um único
   ponto, que faz `run_javascript` sobre os `data-id` da MIGRA-SISTEMA-02.
   **Um ponto, e não três**, porque três escritores para a mesma página são três
   chances de a tela ficar meio velha — é a forma do defeito que a
   `D-AS-ABAS-CONVERSAM` existe para matar.
2. **A pausa chega à tela pela primeira vez.** `paused` vira a linha "Pausado",
   e o texto da linha diz **o que ela é**: a pausa fica gravada em disco e
   **sobrevive a desligar o computador**. Sem essa frase, "Pausado: Sim" lê como
   estado do momento.
3. **Nenhum número digitado no Python.** A contagem de controles sai do
   `state_full`; os rótulos do perfil saem de `secao_orcamento`. Se um deles
   sumir do produto, a ponte tem de **reprovar em voz alta** — é a mesma cura
   que o gerador já tem (`_constantes` levanta `SystemExit` quando uma constante
   some, `aba09.py:114`).
4. **A ausência de dado é um valor, não um branco.** Daemon desligado, IPC
   estourado, `systemctl` ausente: cada linha diz **o que faltou**, nunca fica
   com o literal do mockup. Já é a disciplina dos módulos de hoje
   (`descrever_deteccao_de_janela` devolve a frase de "não consegui ler").
5. **Zero controles é estado legítimo.** "Vale para: **Nenhum controle na
   mesa**" — a página nasce da mesa real, e a mesa dela tem **dois**, não os
   quatro do desenho.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_03_a_ponte_de_leitura.py`, com um `WebView`
dublê que **grava o JavaScript recebido** (a ponte é testável sem tela):

- **cada um dos dez valores muda quando a fonte muda.** Para cada valor: mude a
  fonte (o `state_full` falso, o retorno do `systemctl` falso), repinte, e o JS
  emitido tem de conter o valor novo. **Arranque a linha da pintura de UM valor
  e veja reprovar dizendo qual** — é a mordida, e ela tem de ser por valor, não
  por bloco;
- **a régua LÊ, não digita.** Ela compara o que a ponte emitiu com o que a
  fonte devolveu, **nunca com uma string escrita no teste**. Foi assim que onze
  réguas desta casa reprovaram a melhora em vez do defeito, em 26/08: *digitavam
  o que deviam LER*;
- **com o daemon desligado, nenhuma linha fica com o literal do mockup.**
  Monte a página, não pinte nada, e o teste tem de reprovar sobre "Ligado" —
  este é o defeito mais caro possível aqui: a tela nova afirmando o estado do
  desenho;
- **o `paused` chega.** `state_full` com `paused=True` → a linha "Pausado" diz
  sim **e** diz que sobrevive ao boot. Devolva o `False` fixo e veja reprovar;
- **um escritor só.** Conte os pontos que emitem `run_javascript` para a página
  da aba Sistema: exatamente **1**. Acrescente um segundo e veja reprovar;
- **o refresh ao entrar na aba continua ligado.** `_REFRESH_POR_ABA["daemon_box"]`
  continua apontando para `_refresh_daemon_tab_on_show`, e ele chama a pintura.

## O que é dela decidir

- **"ÁUDIO DOS 4 CONTROLES ROTEADO" com dois no rádio — o mapa de canais
  desmente.** `docs/data/mapa-controles.csv`: `audio.alto_falante` e
  `audio.saida_dedicada` têm `radio_aciona = não`; `audio.microfone` tem
  `parcial`. **O produto HOJE é honesto**: `check_snd_audio_healthy` conta
  contra `controles_no_cabo` e diz *"áudio presente nos N controles no cabo"*.
  **O mockup perdeu a qualificação ao encurtar a frase.** Ou a linha volta a
  nomear o cabo, ou a aba nova afirma no rádio o que o transporte não entrega —
  e `scripts/check_paridade_transporte.py` reprova afirmação forte sem teste que
  a sustente. **Esta sprint mantém a frase do produto** e marca a do mockup como
  `PROVISÓRIO — decisão dela`.
