# SISTEMA — O VIGIA VIVO 01 · agente B2

| | |
|---|---|
| **Árvore** | `hefesto-voo/SISTEMA-O-VIGIA-VIVO-B2`, branch `voo/SISTEMA-O-VIGIA-VIVO-B2` |
| **Base** | `72bc0b7` |
| **Fechou** | **D-TROCA-DE-PERFIL-CEGA** (prioridade máxima), **T-03**, **T-04**, **T-06**, **T-07** (a metade que é minha), **T-08**, **T-09**, **T-10** (a metade que é minha), **T-12**, **T-14**, **T-15**, **T-02(b)** |
| **Não fez** | T-01 (bancada, ordem do regente), T-02(a) (empacotamento, fora da posse), T-05 (**já estava curada**), T-11 e T-13 (dependem de decisão dela / de arquivo alheio) |
| **Instrumento** | `PYTHONPATH` da própria árvore, conferido no §1 do protocolo. `python -c 'import hefesto_dualsense4unix'` → `…/SISTEMA-O-VIGIA-VIVO-B2/src/…` |

---

## O que mudou

### D-TROCA-DE-PERFIL-CEGA — as duas metades, e o que a medição de 23/08 já não descrevia

A decisão citava 60 `x11_connect_failed` em 30 min e `window_detect_healthy=true`.
**Duas das três causas já tinham sido curadas em 24/08 pela ONDA0-Z7**, e a
regra da casa manda substituir, não repetir:

| o que a decisão dizia | estado real em 25/08 | onde |
|---|---|---|
| o `healthy` nasce `true` por presunção | **CURADO** pela T-01 da Z7: a semeadura exige `conexao_provada() is True` | `autoswitch.py` |
| sonda o X morto a cada 30 s para sempre | **CURADO** pela T-03 da Z7: backoff dobra até 300 s | `window_backends/xlib.py` |
| o daemon fica preso no X11 numa sessão Wayland | **VIVO** — e é o que esta frente fechou | abaixo |

**O que ainda estava quebrado, e agora não está:**

1. **O XWayland morto não tinha saída.** `detect_window_backend()` escolhe
   `xlib` sempre que `DISPLAY` existe — preferência CERTA enquanto o XWayland
   está vivo, porque é o único backend que resolve `exe_basename`
   (PROCESSO-CEGO-01). Com ele morto, `maybe_recover()` só resgatava o
   `NullBackend`, e a cascata Wayland — que o COSMIC atende por `wlrctl` —
   ficava ao lado, **nunca tentada**. Agora `precisa_de_resgate()` conhece o
   segundo caso cego (`xlib` + conexão PROVADA morta + `WAYLAND_DISPLAY`
   presente) e `maybe_recover()` troca o backend em-place pela cascata.
   *(`integrations/window_detect.py`, `daemon/subsystems/autoswitch.py`)*

   A troca é de mão única no episódio e **declarada**: a cascata é cega ao
   nome do processo, então perfis que casam por `process_name` seguem sem
   casar — mas eles já não casavam com o `xlib` morto, que não devolvia
   janela nenhuma. Enxergar `wm_class` e título é estritamente mais do que
   enxergar nada, e o `window_detect_backend` publicado no `state_full`
   continua dizendo qual backend está valendo.

2. **A presunção do `healthy` sobreviveu num segundo lugar.** A T-01 da Z7
   curou a semeadura inicial e deixou intacta a **re-semeadura do resgate**
   (AUTOSWITCH-HEAL-01), 40 linhas abaixo no mesmo arquivo, que seguia
   fazendo `healthy=(nome == "xlib")` — presunção pura, a mesma que a T-01
   derrubou. É a correção pela metade que a regra da casa existe para matar.
   As duas passaram a chamar `_saude_com_prova()`.

   **A prova de que estava viva não é argumento: é um teste da casa.**
   `test_diag_reader_recupera_no_poll` exigia `("xlib", True)` com
   `DISPLAY=":9"`, e o log da própria suíte imprimia
   `x11_connect_failed err='Can't connect to display ":9"'` — a mesma forma
   do defeito da máquina dela (`Can't connect to display :1`), verde havia
   um dia.

### As tarefas da sprint

* **T-02(b)** — `/app/share/hefesto-dualsense4unix` entrou nas bases do
  `_find_repo_file`, agora numa constante nomeada (`BASES_DE_INSTALACAO`).
* **T-03** — **oito** frases citavam `./install.sh` como única instrução, e
  ele só existe para quem clonou o repositório. Todas passaram por
  `como_atualizar_esta_instalacao()`, que pergunta se há `install.sh` ao lado
  do código. **PROVISÓRIO, aguarda o olho dela:** o ramo de fora do checkout
  usa o *mínimo aceitável* redigido na própria sprint; nomear o gesto
  (`flatpak update`, `apt upgrade`) é mais útil e é texto novo de tela.
* **T-04** — `lock_proton_for_all_games` passou a repassar `status`/`reason`,
  e `format_proton_lock_result` ganhou o ramo de recusa. O vocabulário é o
  que a aba **já falava** em `_frase_steam_input` (*"havia um jogo aberto"*),
  não um novo. **[OLHO DELA]** — texto novo na tela.
* **T-06** — `_apply_daemon_view` cinza o botão sem trabalho a fazer, com
  tooltip dizendo por quê; `_on_systemctl_done` arma `_user_stopped_daemon`
  no **sucesso** do stop (a lição da BUG-HOME-SHUTDOWN-FALSE-OK-01, agora dos
  dois lados). `online_avulso` e `iniciando` contam como LIGADO.
* **T-07 (minha metade)** — a frase que ela derrubou em 09/08 saiu do último
  lugar de `src/` onde ainda era **pintada** (`storm_doctor.py`) e do
  docstring que a repetia (`emulation_actions.py`). A redação nova é a da
  caixinha de Perfis, palavra por palavra.
* **T-08** — `_detalhe_tecnico()` põe a saída crua no painel *antes* do
  toast. **O detalhe é rodapé, não sobrescrita**: o primeiro desenho pintava
  por cima e o `_refresh_daemon_view_async()` que vem logo depois o apagava
  em segundos.
* **T-09** — o gancho de refresh da aba ganhou mordida (detalhe abaixo: a
  medição da sprint caducou pela metade).
* **T-10 (minha metade)** — `prontuario_dos_jogos.py` (1.037 linhas, zero
  chamadores) ganhou **um** chamador de produção: uma linha no cartão "Saúde
  do sistema", **só quando há divergência**, no molde do
  `medir_guarda_do_steam_input`. **[OLHO DELA]** — linha nova no cartão.
* **T-12** — `_query_gamepad_state` apagado (22 linhas), com portão que
  aceita o retorno **desde que venha com chamador**.
* **T-14** — `DONO_DO_GESTO` declara, para cada um dos 14 gestos da aba, se
  o estado é gravado por jogo ou pela máquina, **com a evidência ao lado**.
  A decisão D-A continua dela; o portão só impede que um gesto novo nasça
  sem a pergunta feita.
* **T-15** — a régua que faltava, em três camadas: os resolvedores
  concordam sob `XDG_CONFIG_HOME` e sem ele; **nenhum código Python fora do
  dono monta o caminho**; os dois scripts de shell respeitam a variável.
  Removi de `daemon/launch_env.py` um **sexto resolvedor independente** cuja
  justificativa (*"e não do `Path.home()` fixo do `storm_doctor`"*) caducou
  em 23/08.

---

## Qual mordida prova

Toda cura foi arrancada, vista reprovar e devolvida. Só os pares.

### D-TROCA-DE-PERFIL-CEGA · o resgate para a cascata Wayland

```
# CURA ARRANCADA
FAILED …::test_maybe_recover_troca_xlib_morto_pela_cascata_wayland
FAILED …::test_o_resgate_nao_se_repete_depois_de_trocado
2 failed, 6 passed
# CURA DEVOLVIDA
91 passed
```

### D-TROCA-DE-PERFIL-CEGA · a presunção do `healthy` na re-semeadura

```
# CURA ARRANCADA (healthy=(nome == "xlib"))
E   AssertionError: assert ('xlib', False) in [('null', False), ('xlib', True)]
FAILED …test_d_troca_de_perfil_cega…::test_resgate_para_xlib_morto_nao_semeia_saudavel
FAILED …test_autoswitch_flood_fix.py::test_diag_reader_recupera_no_poll
2 failed, 14 passed
# CURA DEVOLVIDA
91 passed
```

### T-12 · o portão sabe recusar **e** aceitar

```
# código morto reposto SEM chamador
E   AssertionError: `_query_gamepad_state` voltou a `src/` sem nenhum chamador.
1 failed
# o MESMO código, agora COM chamador
1 passed
# apagado (estado de hoje)
1 passed
```

### T-09 · duas mordidas, e uma correção de fato

```
# MORDIDA A — trocar o NOME do refresher no mapa
FAILED …::test_entrar_na_aba_sistema_chama_o_refresher_dela
1 failed, 14 passed
# MORDIDA B — tirar o detector do refresher
E   Right contains one more item: '_refresh_window_detect_diag'
FAILED …::test_o_refresher_da_aba_sistema_rele_as_tres_coisas_que_ela_mostra
1 failed, 14 passed
# CURAS DEVOLVIDAS
15 passed
```

### T-15 · os dois lados

```
# MORDIDA A — repor o `.config` cravado no storm_doctor
FAILED …::test_com_xdg_config_home_os_dois_apontam_para_o_mesmo_arquivo
FAILED …::test_so_o_dono_escreve_o_nome_do_arquivo_em_codigo
2 failed, 5 passed
# MORDIDA B — o sexto resolvedor de volta no launch_env
E   src/hefesto_dualsense4unix/daemon/launch_env.py:627: 'steam_input_apps.txt'
1 failed, 6 passed
# CURAS DEVOLVIDAS
7 passed
```

### T-06 · sensibilidade e o flag do desligamento

```
# MORDIDA A — arrancar a chamada de sensibilidade
6 failed, 13 passed   (os quatro estados da matriz + os dois tooltips)
# MORDIDA B — arrancar o armar do flag no stop
FAILED …::test_desligar_com_sucesso_arma_o_flag_que_impede_a_ressurreicao
1 failed, 18 passed
# CURAS DEVOLVIDAS
19 passed
```

### T-04 · a recusa que virava comemoração

```
# MORDIDA A — arrancar o ramo de recusa da frase
5 failed, 3 passed
# MORDIDA B — a ponte volta a jogar status/reason fora
FAILED …::test_o_tradutor_repassa_status_e_reason
1 failed, 7 passed
# CURAS DEVOLVIDAS
8 passed  ·  regressão proton: 100 passed
```

### T-03 / T-02(b)

```
# MORDIDA A — repor um ./install.sh cravado
FAILED …::test_format_steam_ready_result_nao_cita_install_sh_fora_do_checkout[False-True]
FAILED …::test_nenhuma_frase_do_modulo_crava_install_sh
2 failed, 8 passed
# MORDIDA B — tirar /app/share das bases
FAILED …::test_app_share_esta_entre_as_bases
1 failed, 9 passed
# CURAS DEVOLVIDAS
10 passed
```

### T-07 · a frase derrubada

```
# CURA ARRANCADA
E   src/hefesto_dualsense4unix/integrations/storm_doctor.py:261: "ex.: jogos cujo DualSense é entregue pela Steam)"
FAILED …::test_frase_derrubada_nao_e_pintada_na_tela[entregue pela Steam]
FAILED …::test_o_lexico_novo_e_o_mesmo_da_caixinha_de_perfis
2 failed, 2 passed
# CURA DEVOLVIDA
12 passed
```

### T-08 · o painel que recebe o motivo

```
# MORDIDA A — o painel volta a ser pintado por cima
FAILED …::test_o_detalhe_do_erro_aparece_no_painel
FAILED …::test_o_detalhe_sobrevive_ao_refresh_que_vem_logo_depois
FAILED …::test_o_painel_continua_sem_escapes_ansi
3 failed, 21 passed
# MORDIDA B — o callback para de escrever o motivo
FAILED …::test_a_falha_poe_o_motivo_no_painel_antes_do_toast
FAILED …::test_falha_sem_saida_crua_ainda_diz_alguma_coisa
2 failed, 22 passed
# CURAS DEVOLVIDAS
48 passed
```

### T-10 · o órfão ganha chamador

```
# MORDIDA A — arrancar a chamada do cartão
FAILED …::test_o_cartao_de_saude_consulta_o_prontuario
1 failed, 9 passed
# MORDIDA B — o cartão volta a falar quando está alinhado
FAILED …::test_tudo_alinhado_fica_calado
FAILED …::test_jogo_sem_os_atributos_nao_levanta
2 failed, 8 passed
# CURAS DEVOLVIDAS
10 passed
```

### T-14 · o gesto sem dono

```
# CURA ARRANCADA (a declaração de um gesto some)
E   AssertionError: gesto da aba Sistema sem dono declarado: btn_camadas_engasgo
E   AssertionError: declaração sem gesto correspondente no Glade: btn_camadas_engasgo_XX
FAILED …::test_todo_gesto_da_aba_declara_de_quem_ele_e
# CURA DEVOLVIDA
19 passed
```

### Duas mordidas que reprovaram a MINHA régua, e é por isso que valem

1. **`test_format_steam_ready_result_…` só sabia passar.** Chamei
   `format_steam_ready_result(janela="fechada", …)` e
   `format_steam_janela_recusa` cortava a função no começo — o ramo de
   instalação incompleta **nunca era exercitado**. Só apareceu quando arranquei
   a cura e o vermelho não veio. Corrigido para `janela="ok"`, com uma asserção
   que exige que o ramo tenha sido alcançado.
2. **O portão da T-07 perdoava comentário de fim de linha.** Arranquei a cura
   com `# CURA ARRANCADA` no fim da linha, e o `tokenize` marcava a linha
   inteira como "explicação". Um `#` no fim não transforma o código que vem
   antes em comentário — a régua passou a exigir que a linha **comece** com `#`.

### Uma armadilha de instrumento que quase me enganou

O `__pycache__` guardou bytecode velho e uma mordida saiu **verde** quando
devia sair vermelha. A partir daí passei a rodar
`find . -name __pycache__ -prune -exec rm -rf {} +` antes de cada par
vermelho/verde. **Vale para quem vier**: o `PYTEST_ADDOPTS=-p no:cacheprovider`
do `.envrc-voo` desliga o cache do pytest, **não** o do Python.

---

## O que NÃO verifiquei

1. **Nada rodou na bancada.** Nenhum `systemctl`, nenhum daemon reiniciado,
   nenhum controle na mesa. Todo par vermelho/verde é de teste unitário.
2. **A janela real não foi aberta.** Não rodei `retratar_abas.py` (é de quem
   coordena) e **não commitei PNG nenhum**. Tudo que muda a tela — T-03, T-04,
   T-07, T-08, T-10 — **aguarda o olho dela**.
3. **O resgate para a cascata Wayland nunca rodou numa sessão COSMIC viva.**
   O teste prova a decisão (`xlib` provado morto + Wayland → cascata) com
   `DISPLAY=":9"`. **Não medi** se o `wlrctl` responde na máquina dela, nem
   quanto tempo o resgate leva no primeiro tick. **É a próxima medição, e ela
   precisa da bancada.**
4. **Não medi o preço de perder o `exe_basename`.** A troca para a cascata
   cega o `process_name` (PROCESSO-CEGO-01) — cinco perfis dela casam por esse
   campo. O argumento de que "cego para o nome do processo é melhor do que
   cego para tudo" é **desenho**, não medição.
5. **`prontuario_dos_jogos.levantar_censo()` nunca rodou contra a biblioteca
   real dela.** Todos os testes usam censo dublê. **Não sei quanto ele custa**
   na máquina dela (o módulo estima ~1 s lendo os `system.reg`); roda em
   worker, não na linha do GTK, mas o número é leitura de código.
6. **T-14: a classificação dos dois gestos em lote é leitura minha.**
   `btn_steam_ready` e `btn_steam_apply_launch` escrevem estado POR JOGO (a
   opção de inicialização de cada um) sem que exista um jogo escolhido. Li
   como **máquina** pelo que fazem hoje, e marquei as duas linhas como
   `PROVISÓRIO — decisão dela` no código.
7. **Não rodei a suíte inteira** (cria nós `uinput` de verdade). Rodei 130
   arquivos escolhidos por citarem os módulos que toquei, excluindo os que
   criam aparelho: **2361 passed, 2 skipped, 2 xfailed**.

---

## O que sobrou para o próximo

### Vermelho HERDADO, que não é meu e vai travar o aceite de todo mundo

**`python3 scripts/validar-referencias-docs.py --all` sai `rc=1` na base**
(`72bc0b7`, antes da minha primeira linha). Nove referências mortas, **todas
do mesmo documento**, que não está na minha posse:

```
docs/process/sprints/2026-08-25-CALIBRAR-AS-ENTRADAS-01-a-entrada-vazia-que-so-a-mao-dela-ensina.md
  :427 src/hefesto_dualsense4unix/integrations/entradas_do_gabinete.py
  :434 tests/unit/test_entradas_do_gabinete.py
  :448 tests/unit/test_a_calibracao_grava_com_o_daemon_morto.py
  :456 src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
  :460 tests/unit/test_a_fase_sentada_resolve_o_hub.py
  :472 tests/unit/test_a_volta_so_visita_o_que_esta_vazio.py
  :486 tests/unit/test_o_botao_de_calibrar_nao_chega_no_jogo.py
  :500 tests/unit/test_a_marreta_respeita_o_silencio.py
  :518 tests/unit/test_o_laudo_confessa_o_que_nao_mede.py
```

São citações de uma sprint **a executar** — os arquivos não existem porque o
trabalho não foi feito. O script tem comentário de isenção para exatamente
este caso, e ele não foi usado. **Conserto de uma linha por citação, e é de
quem escreveu o documento.**

### O portão de órfãos: um vermelho MEU (esperado) e dois herdados

`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` **é da frente A3 — não
o editei.** Medi os dois estados, com e sem a minha cura da T-10:

| falha | com a cura T-10 | sem a cura T-10 | de quem |
|---|---|---|---|
| `test_o_ponto_de_entrada_declarado_e_o_que_abre_o_alcance` | vermelho | **verde** | **minha, e é a mordida dupla que a sprint previu** |
| `test_toda_promessa_solta_esta_classificada` | vermelho | vermelho | **herdado** |
| `test_nenhuma_lapide_sobreviveu_a_propria_cura` | vermelho | vermelho | **herdado** |

**O que A3 (ou quem costurar) precisa fazer, e é pequeno:**

1. As cinco exceções `integrations/prontuario_dos_jogos.py::*` (a partir de
   `:1269`) **estão caducas**: o módulo tem chamador de produção desde a T-10.
   A própria régua chama isso de *"lápide que sobreviveu à própria cura"*.
2. `:2867` — `test_o_ponto_de_entrada_declarado_e_o_que_abre_o_alcance` usa
   `prontuario_dos_jogos.py::Prontuario` como **canário** de "inalcançável".
   Precisa de outro canário: esse deixou de ser órfão.

Os dois herdados citam `app/fala_do_mapa.py::Numero`,
`app/fala_do_mapa.py::formata_pt_br`, `app/textos_de_aplicacao.py::frase_do_desfecho`,
`profiles/schema.py::resolver_teclado_emulado` e
`utils/maquina.py::gravar_maquina` — **nenhum deles está no meu diff**
(`profiles/schema.py` e `utils/maquina.py` inclusive: não toquei em nenhum
dos dois).

### As tarefas que registrei como abertas, e por quê

| tarefa | por que não fiz | o que ela precisa |
|---|---|---|
| **T-01** | ordem do regente: é bancada, exige `sudo` e o ciclo `uninstall`→`install` na máquina viva dela | o comando exato está abaixo |
| **T-02(a)** | `flatpak/`, `packaging/`, `scripts/build_appimage*.sh` **não estão na minha posse** | ~12 linhas de receita em 5 formatos + o portão parar de ignorar `scripts/` em bloco |
| **T-05** | **JÁ ESTAVA CURADA.** A Z2-8 (24/08) generalizou o `_ALVO_POR_ABA` e `daemon_box` está lá (`app.py:1227`), com portão em `test_z2_fita_declara_quem_obedece.py:44` | nada — **a sprint está desatualizada neste ponto** |
| **T-07** (tooltip) | `gui/main.glade` é da frente A4 | cortar *"o jogo deixa de mostrá-los dobrados"* (medida FALSA em 23/08) e qualificar o transporte em *"os seus jogadores continuam valendo"* (bloqueada por BT) |
| **T-07** (validador) | `scripts/validar-palavra-de-tela.py` não está na minha posse | a régua que escrevi vive em `tests/unit/test_t07_…` e roda na suíte; migrar é opcional. **A lista `FRASES_DERRUBADAS` é o formato certo, e não é a mesma coisa que `JARGAO_BANIDO`** — uma é jargão, a outra é afirmação que a medição derrubou |
| **T-10** (portão) | `tests/unit/portao_a_casa_sabe…` é da A3 | as duas linhas acima |
| **T-11** | `profiles/manager.py` fora da posse, e **o desenho é decisão dela** | o clique diz *"não funcionou"*; carimbar ponte **confirmada** seria mentira. O que cabe é registrar a **tentativa descartada** (`ponte_escada`/`ponte_tentativa` já têm vocabulário) |
| **T-13** | `docs/data/mapa-controles.csv` é da frente do Rumble | a família nova do CSV, e **qual lado do `plataforma.mapeamento_posicao` é verdade** |

### O comando da T-01, para ela rodar na máquina dela

A hipótese de §3 (`enable --now` é no-op numa unidade já `active` e não
re-arma cronograma) **continua sem medição**. O roteiro, sem `sudo`:

```bash
# 1. o estado de HOJE, antes de mexer
systemctl --user show hefesto-steam-input-guard.timer \
  -p ActiveState -p LastTriggerUSec -p NextElapseUSecMonotonic

# 2. o gesto que o produto manda hoje
bash install.sh --yes          # NUNCA com sudo — o HOME vira /root

# 3. o mesmo comando de (1). Se NextElapseUSecMonotonic continuar
#    'infinity', a hipótese está PROVADA e a T-01 troca
#    `enable --now` por `enable` + `restart` em install.sh:3504.
#    Se voltar a ter data, a hipótese morre e a T-01 vira só a mensagem.
```

### O que o Bluetooth continua bloqueando

O hub externo dela saiu do barramento às **02:36:43** e
`/sys/class/bluetooth/` está vazio — **nenhuma medição de rádio é executável
nesta madrugada**. Nada do que entreguei depende de BT, mas duas frases desta
aba continuam bloqueadas por ele (§7 da sprint): *"os seus jogadores continuam
valendo"* e qualquer promessa de co-op no rádio.

### Um aviso do conftest que apareceu na minha varredura e não é meu

`tests/unit/test_jogador_3_fantasma_01.py::test_a_dispensa_morre_quando_o_jogo_sai_da_frente`
cria um `evdev.UInput` **de verdade**. O guarda do conftest o denuncia (o
teste passa), mas é o padrão que custou 1.289 nós num dia e a tela cheia dela
no meio do jogo. **Não é meu escopo; fica registrado para não virar paisagem.**
