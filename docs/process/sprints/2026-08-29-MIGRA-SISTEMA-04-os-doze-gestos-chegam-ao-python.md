---
sprint: MIGRA-SISTEMA-04
# onda: MIGRA-SISTEMA (a aba 09, no motor novo)
posse:
  M4:
    - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
cria:
  - tests/unit/test_migra_sistema_04_a_ponte_de_gestos.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-PILOTO
  - MIGRA-MOLDURA-01
  - MIGRA-SISTEMA-01
  - MIGRA-SISTEMA-02
  - MIGRA-SISTEMA-03
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
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - novo-layout/
---

# MIGRA SISTEMA · 04 — Os doze gestos chegam ao Python

**O defeito:** depois da 01 a aba é a página dela, e depois da 03 ela diz a
verdade — **e nada nela faz nada.** Doze gestos desenhados, zero chegando ao
Python. Os treze handlers `on_*` de `daemon_actions.py` continuam existindo e
**ninguém mais os chama**: quem os chamava era o `connect_signals`
(`app/app.py:350`) sobre o XML que a 01 removeu.

E **um deles nunca foi de `daemon_actions`**: o botão "Tirar o que faz
engasgar" (`btn_camadas_engasgo`, `main.glade:3044`) vivia dentro do
`storm_card`, dentro do `daemon_box`, **com o handler em
`emulation_actions.py:2075`** (`on_camadas_engasgo`) e o motor em
`integrations/camadas_vulkan.py`. Quem desmontar a Emulação leva o handler junto
sem perceber.

## Os doze, e onde cada um cai

| gesto na tela | handler de hoje | estado |
|---|---|---|
| **Retomar** | **não existe** | o IPC `daemon.resume` (`daemon/ipc_server.py:121` → `ipc_handlers.py:2293`) tem **um chamador só: `cli/app.py:421`** |
| Reiniciar o Hefesto | `on_daemon_service_restart:2264` | existe |
| Atualizar | `on_daemon_refresh:2254` | existe |
| Desligar o Hefesto | `on_daemon_stop:2221` | existe |
| Ligar junto com o computador (a chave) | `on_daemon_autostart_toggled:2385` | existe |
| O perfil da mesa (o `<select>`) | `secao_orcamento._ao_escolher:468` | existe, e **muda de endereço na MIGRA-SISTEMA-08** |
| Refazer os consertos automáticos | `on_storm_fix_safe:1218` | existe |
| Refazer a fixação do Proton | `on_proton_lock:1793` | existe |
| Procurar sobreposição de novo | **`on_camadas_engasgo`, em `emulation_actions.py:2075`** | existe, **e mora na aba que morre** |
| Restaurar de fábrica | `on_restore_default` (`footer_actions.py:1477`) | existe, **no rodapé** — muda de lugar na MIGRA-SISTEMA-10 |
| Ver os plugins carregados | **não existe** | o IPC existe (`plugin.list`/`plugin.reload`), só a CLI chama (`cli/cmd_plugin.py:43` e `:77`) — MIGRA-SISTEMA-09 |
| Ver detalhes | `on_daemon_view_logs:2374` | existe, **e mostra outra coisa** — MIGRA-SISTEMA-10 |

**Handlers que sobram sem gesto na tela nova:** `on_daemon_start:2215`,
`on_daemon_migrate_to_systemd:2396`, `on_steam_ready:1586`,
`on_steam_game_broken:1717`, `on_storm_copy_launch:1318` e
`on_steam_apply_launch:1360`. Os quatro últimos têm decisão escrita dela (saem
ou fundem, `ONDA-SISTEMA-05`); **os dois primeiros não têm** — ver o fim.

## O que entrega

1. **A ponte de gestos, com UM despachante.** O
   `register_script_message_handler` (**um argumento** na série 4.1; dois só na
   6.0) recebe `{gesto: "<nome>", valor: <opcional>}` e despacha por uma tabela
   `nome → método`. **A tabela é a régua**: um gesto na página sem entrada na
   tabela, ou uma entrada sem gesto na página, tem de reprovar.
2. **Nasce o "Retomar", e `daemon.resume` ganha o segundo chamador.** O botão só
   aparece com `paused=True` — que a MIGRA-SISTEMA-03 já traz. **Este é o gesto
   que muda a vida dela:** a pausa fica gravada em disco e sobrevive a desligar
   o computador; até hoje a única saída era o terminal.
3. **Todo gesto devolve recibo, inclusive o "não deu".** Nenhum verde mudo: o
   handler que falha põe na tela **o quê, por quê e o que fazer** — é regra
   desta casa, e o caminho contrário já custou caro aqui (o clique que dispara
   `systemctl` de verdade, o `rc=0` e a tela confirmando trabalho que não
   houve, `_aplicar_sensibilidade_ligar_desligar:1982`).
4. **O que está cinza continua cinza, e diz por quê.** A matriz de sensibilidade
   de `_aplicar_sensibilidade_ligar_desligar` não morre com o Glade: ela passa a
   pintar `disabled` no botão da página, **com o tooltip do motivo**. Botão
   cinza sem explicação manda a pessoa procurar defeito onde não há.
5. **O handler do engasgo troca de dono, no mesmo commit em que o gesto muda de
   casa.** `on_camadas_engasgo` vem de `emulation_actions.py` para
   `daemon_actions.py`. **Não duplique**: o motor (`camadas_vulkan.py`) não se
   move, e o achado "Nenhuma sobreposição picotando o jogo" (MIGRA-SISTEMA-06)
   depende dele.

## Como se prova (a mordida)

`tests/unit/test_migra_sistema_04_a_ponte_de_gestos.py`:

- **os doze chegam.** Para cada um: injete a mensagem que a página mandaria e
  veja o método certo ser chamado, com um dublê que conta. **Arranque uma
  entrada da tabela e veja reprovar dizendo qual gesto ficou órfão**;
- **a tabela e a página não divergem.** O teste lê os `data-gesto` do HTML
  gerado e compara com as chaves da tabela, **nos dois sentidos**. É a mesma
  disciplina do `test_portao_a_lista_de_portoes_e_uma_so.py`. *Enquanto o HTML
  for `.gitignore:108`, este teste tem de **falhar** quando não achar o arquivo
  — nunca `skip`. Um skip aqui é a régua cega de novo;*
- **o Retomar não aparece sem pausa.** `paused=False` → o gesto `retomar` não
  existe na página. `paused=True` → existe **e** chama `daemon.resume`. Devolva
  o botão sempre visível e veja reprovar;
- **o resume tem dois chamadores, e um é a GUI.** `grep` por `daemon.resume` em
  `src/` devolve `cli/app.py` **e** `daemon_actions.py`. Arranque a chamada e
  veja reprovar;
- **o "não deu" chega à tela.** Force o `systemctl` a falhar e prove que a
  página recebeu a frase de erro — não um silêncio, não um "Pronto.";
- **um gesto não pinta a tela sozinho.** Depois de cada gesto, a repintura passa
  pela ponte de leitura da MIGRA-SISTEMA-03. Escrever direto no DOM a partir do
  handler cria o segundo escritor que a 03 proíbe.

## O que é dela decidir

- **O BOTÃO DE LIGAR SUMIU, e ninguém decidiu isso.** Com o Hefesto desligado, a
  tela nova não tem como ligá-lo — sobra "Reiniciar o Hefesto", cujo rótulo
  mente sobre o estado. O produto tem `on_daemon_start:2215` pronto. **Opções:**
  (a) o quarto botão vira **Ligar/Desligar** conforme o estado, um só;
  (b) nasce um quinto botão, e a coluna passa a ter cinco;
  (c) fica como o desenho está, e ligar o Hefesto passa a ser só pelo terminal.
- **"Corrigir modo de execução" (`btn_migrate_to_systemd`) sumiu junto.** Ele só
  aparece em `online_avulso` (`_apply_daemon_view:1963`) — é o botão que
  conserta o estado em que o daemon está vivo fora do systemd. Some de vez, ou
  volta como botão condicional (o mesmo princípio do "me mostra o erro")?
- **A trava do "Desligar".** Hoje `on_daemon_stop` arma `_user_stopped_daemon`
  para que o `ensure_daemon_running` não ressuscite o daemon na próxima
  abertura. Isso continua valendo na tela nova — e vale a pena ela ver a frase
  que explica isso, porque é a diferença entre "desliguei" e "desliguei até eu
  mandar de novo".
