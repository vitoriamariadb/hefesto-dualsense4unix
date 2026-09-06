# DAEMON-ACORDADO-01 — a última cópia do `pgrep`, e a régua que se escondia atrás de outra

**06/09/2026 · árvore `DAEMON-ACORDADO-01-opus` · branch `voo/DAEMON-ACORDADO-01-opus`**
**Nascida de `onda/atual-0609` em `c15d2e3e`** (conferido: `git log -1` bate com
`git rev-parse --short onda/atual-0609`).

A ROTA CORRIGIDA do topo da sprint venceu o corpo dela, como mandado. O que
sobrava era **a E2, item 1**: o `pids_da_steam` do `escritor_cru` era a cópia de
`pgrep` que a PERF-PROC-SCAN-01 (12/08) não alcançou quando trocou o `pgrep -f`
por varredura nativa em `steam_launch_options.py`. A E1 já estava respondida
(25/08), o item 2 fechado, e **a cadência de leitura do controle não foi tocada**
— a restrição da E2 ("recuar cadência não pode atrasar o primeiro relatório
depois de um gesto") continua intocada, porque nada aqui mexe em cadência.

## O que mudou

**1. `core/escritor_cru.py` — o par de `pgrep` virou varredura de `/proc`.**
`pids_da_steam` rodava `pgrep -f steamrt64/steam` **e** `pgrep -x steam` a cada
3,3 s (o ritmo do `controller.list` com a janela aberta). Agora varre `/proc`
lendo **no máximo dois arquivos por pid**: `comm` primeiro (é o que o `pgrep -x`
compara), e `cmdline` só quando o `comm` não resolveu.

**Não escrevi varredura nova.** `steam_launch_options._cmdline_of` virou a
pública `cmdline_de_pid` e é ela que o `escritor_cru` importa — duas varreduras
de `/proc` no mesmo daemon seriam duas verdades sobre o mesmo `/proc`, que é a
família de defeito que a casa acabou de pagar com o `pgrep`. `_cmdline_of`
continua existindo como nome interno porque o `_ProcContado` da suíte o
monkeypatcha.

**2. A varredura que não termina não carimba a foto.** É correção de
comportamento, e está dita como tal: o `pgrep` que estourava o `timeout`
carimbava assim mesmo, e cinco segundos de "ninguém segura o hidraw" licenciam
repintura da barra por cima da Steam. Ausência ≠ negativo. **O preço**: numa
máquina onde varrer `/proc` passe do orçamento, cada chamada paga o orçamento
inteiro — o teto é 1,0 s contra 3,8 ms medidos, ~260x de folga.

**3. Uma régua que media a PALAVRA passou a medir o ATO.**
`test_a_frase_nomeia_quem_a_sonda_sabe_reconhecer` fazia `inspect.getsource` do
`pids_da_steam` e um `re.findall` atrás de `"pgrep", "-f", ...`. Quando o
`pgrep` saiu, **ela reprovou a melhora e não o defeito** — a forma exata que
esta casa já nomeou onze vezes. Agora lê os critérios que o produto usa
(`_AGULHA_DA_STEAM_NA_CMDLINE`, `_COMM_EXATO_DA_STEAM`). Ela se salvou pelo
desenho: o `assert padroes` dizia *"a régua ficou cega"* em vez de passar em
silêncio, e foi essa linha que apareceu no vermelho.

## O número, e ele é medido

`ptrace_scope=1` continua proibindo `strace`, como a E1 registrou em 25/08.
Usei a régua que a própria sprint inventou: **o delta de `syscr` de
`/proc/self/io`**, que soma o que o filho já colhido gastou — que é justamente
onde o custo do `pgrep` aparece. Cinco execuções de cada forma, nesta máquina,
**430 processos vivos**:

| forma | `read()`/chamada | tempo/chamada |
|---|---|---|
| par de `pgrep` | 3.859 | 20,8 ms |
| varredura nativa | **1.465** | **3,8 ms** |

**2,6x menos `read()` e 5,5x menos tempo de parede**, mais os dois
`fork`/`execve` que deixam de existir.

**UM NÚMERO MEU CAIU NO CAMINHO.** A primeira versão da docstring anunciava
"~5x menos `openat`", por analogia com a PERF-PROC-SCAN-01 e **sem medir**. Nos
`read()` são 2,6x; o 5x só aparece no relógio. Substituído pelo medido, no
código e aqui.

**A equivalência também é medida, e com agulha que ACHA.** Uma régua que só sabe
devolver lista vazia (a Steam fechada nesta máquina) não mede nada — então
comparei a varredura contra o `pgrep` de verdade em **três** agulhas:
`steamrt64/steam`/`steam`, `/usr/lib/systemd`/`systemd` (7 pids) e `zsh`/`zsh`
(6 pids). **Os três conjuntos saíram idênticos** — inclusive sobre a isca, o
processo que casa porque a agulha está na cmdline DELE (o `_STEAM_LAUNCH_RE` já
documenta o risco residual; as duas formas o enxergam igual). Instrumento em
`/tmp/medir-daemon-acordado-01.py`, saída em `/tmp/medida-daemon-acordado-01.txt`.

## Qual mordida prova

`tests/unit/test_daemon_acordado_01_bg03_o_pgrep_que_a_janela_forka.py` — 17
testes. **A metade 1 contava `fork`, e não há mais `fork` que contar**: um dublê
de `subprocess` sobre um produto que não chama `subprocess` conta ZERO para
sempre e passa em tudo. Ela passou a contar `/proc`, como a metade 2 sempre
contou, e ganhou uma asserção que o dublê velho não podia fazer — **quais
arquivos o produto abre por pid**.

Quatro mordidas, arrancadas uma a uma, com a saída de cada reprovação:

| mordida arrancada | quem reprovou |
|---|---|
| **o cache** (`if not forcar` → `if False`) | `3 failed` — `..._varrem_uma_vez` (viu 5), `..._a_foto_vence_a_validade`, `..._o_caminho_da_janela_inteiro` |
| **o `comm` lido** → deduzido do `argv[0]` | `2 failed` — `test_o_comm_e_lido_e_nao_deduzido_do_argv`, `..._a_cmdline_so_e_lida_quando_o_comm_nao_resolveu` |
| **o carimbo da mentira** (foto no `except OSError`) | `1 failed` — `assert 1 == 2`, "um `/proc` ilegível virou negativo carimbado" |
| **a varredura vazia** (`for entrada in []`) | `4 failed`, a começar por `test_a_varredura_acha_a_steam_pelos_dois_criterios` |

E na régua da tela: trocar `_AGULHA_DA_STEAM_NA_CMDLINE` por `"lutris"` faz
`test_a_frase_nomeia_quem_a_sonda_sabe_reconhecer` reprovar — o alarme de "a
sonda aprendeu escritor fora da Steam e a frase do card continua nomeando a
Steam" continua armado.

### A régua que se escondia atrás de outra — e é o achado do dia

A mordida do carimbo **passou verde na primeira volta**. Não era o produto: eu
tinha batizado o teste novo de
`test_proc_ilegivel_nao_vira_cinco_segundos_de_negativo`, **o nome EXATO de um
teste da metade 2** deste mesmo arquivo, sobre o outro produto. Python guarda a
última definição — o meu nunca rodou, e a mordida passou por cima dele.

*Uma régua invisível achada dentro do procedimento que existe para achar
réguas invisíveis*, e ela só apareceu porque as quatro mordidas foram
conferidas UMA A UMA em vez de em lote. Renomeado para
`test_o_proc_ilegivel_do_escritor_cru_nao_vira_negativo_carimbado`, com a
cicatriz escrita na docstring, e o arquivo inteiro varrido atrás de outros
nomes duplicados — **não há mais nenhum**.

**A regra que isso deixa: teste novo em arquivo que já tem testes precisa de
nome conferido contra os que já estão lá.** `def` duplicado não é erro em
Python, é substituição silenciosa — e um arquivo com duas metades sobre dois
produtos é o terreno perfeito para ela.

## O que NÃO verifiquei

- **NÃO medi na máquina dela com o daemon vivo, os quatro controles no rádio e
  a janela fechada** — que é o arranjo dos 15,2 % de 23/08. Medi a FUNÇÃO,
  isolada, contra o `/proc` real desta máquina. **Não afirmo, portanto, quanto
  dos 15,2 % isto derruba**, e a própria sprint já avisava que o `pgrep` da
  janela não explica aquele número (foi medido com a janela FECHADA, e sem GUI
  não há `controller.list`). São dois custos no mesmo lugar; fechei um.
- **NÃO exercitei com a Steam aberta.** Ela não está instalada/aberta nesta
  máquina, então o caminho "achou pids → varre `/proc/<pid>/fd`" foi provado só
  por dublê. A equivalência com o `pgrep` eu cobri por agulha substituta
  (`systemd`, `zsh`), que é o que dava para fazer sem a Steam.
- **NÃO rodei a suíte inteira** (é de quem coordena, e cria nós uinput). Rodei o
  meu escopo e todo arquivo de teste que cita os módulos mudados.
- **NÃO toquei a tela**, e nenhuma janela nasceu: o trabalho é do daemon, e a
  medição é leitura de `/proc`. Nada foi para o workspace dela.
- **NÃO usei a bancada.** Ela estava LIVRE e eu não precisei: nada aqui para o
  daemon, escreve no aparelho ou chama `systemctl`. `bancada: false` na sprint,
  e nenhuma medição de aparelho foi inventada.
- **NÃO medi o caso patológico** do orçamento estourado (varrer `/proc` acima de
  1,0 s). O caminho existe e tem teste de degradação, mas o número que o
  justifica (3,8 ms) é desta máquina.

## Os portões, a suíte, e um vermelho que NÃO é meu

`bash scripts/portoes.sh` → **TODOS VERDES — 45 portões**
(`/tmp/portoes-DAEMON-ACORDADO-01.txt`).

Rodei também **os 38 arquivos de teste que citam os módulos mudados** (962
testes). Eles saem com **6 vermelhos — e os SEIS são de nascença**, em
`onda/atual-0609`, sem uma linha minha:

```
test_o_botao_que_tira_o_que_faz_engasgar.py::test_o_handler_esta_no_mapa_da_janela
test_launch_wrapper_dialog.py::TestFiacaoNoApp::test_app_compoe_o_mixin
test_launch_wrapper_dialog.py::TestFiacaoNoApp::test_render_slow_state_chama_o_super_e_depois_o_lembrete
test_carona_do_wrapper_01_...::test_a_bandeja_tambem_repoe_o_wrapper
test_carona_do_wrapper_01_...::test_a_bandeja_repara_mesmo_com_o_daemon_parado
test_carona_do_wrapper_01_...::test_os_cinco_gestos_chamam_a_carona
```

**Como sei que não são meus, e não é palpite:** rodei a MESMA lista, na MESMA
ordem, com o meu trabalho no `git stash` e sem ele. Os dois lados dão os
mesmos seis nomes; o `diff` das duas listas de `FAILED` sai **vazio**. A única
diferença é que o meu lado tem 4 testes a mais passando (914 contra 910) — os
quatro que a metade 1 ganhou.

### A armadilha que quase me fez confessar cinco vermelhos alheios

A primeira volta desse mesmo comando deu **onze** vermelhos, não seis: os seis
acima mais **cinco de `test_a_aba01_le_o_estado_em_vez_de_cravar.py`**. O
arquivo passa sozinho, e passa ao lado do meu. Fui atrás.

Não era meu, e não era nem do aba01: **`test_o_despachante_serve_as_dez.py` e
`test_o_perfil_chega_na_tela.py` envenenam o aba01 por ordem de execução** —
rodados antes dele, os cinco caem; e caem **igual com o meu trabalho e sem
ele**. O que mudou entre as duas voltas foi só a ORDEM DOS ARQUIVOS: eu montava
a lista com `grep -rln`, que devolve ordem de diretório, e um `git stash` reescreve
arquivo — logo reordena a listagem. Repetido com a lista **ordenada**, o número
é seis dos dois lados, sempre.

**A regra que isso deixa: lista de arquivo para pytest se ORDENA.** Sem `sort`,
duas execuções do "mesmo" comando não são o mesmo comando, e a diferença chega
disfarçada de regressão sua — que é exatamente como se confessa o defeito de
outra pessoa e se some com o dela.

## O que sobrou para o próximo

1. **`PGREP_TIMEOUT_S` é um nome que mente, e eu não pude matá-lo.**
   `daemon/ipc_handlers.py:664` o importa como `_HOLDERS_PGREP_TIMEOUT_SEC`, e
   **`ipc_handlers.py` não é posse desta sprint** — R1 manda relatar em vez de
   editar. Deixei o alias apontando para `ORCAMENTO_DA_VARREDURA_DE_PIDS_S`, com
   o porquê escrito no lugar. Quem tiver o `ipc_handlers` na posse aposenta os
   dois nomes de uma vez; o comentário de `:661` também ainda promete "pgrep com
   timeout curto".
2. **A docstring de `_steam_pids` em `ipc_handlers.py:664`** ainda diz "PIDs do
   processo Steam via pgrep". Mesmo dono, mesma leva.
3. **`steam_running()` (`steam_launch_options.py:906`) continua forkando dois
   `pgrep`** — `-af steamrt64/steam` e `-x steamwebhelper`. É a MESMA troca, no
   mesmo arquivo que já tem a varredura, e ficou de fora porque a sprint pediu o
   `escritor_cru`. Quem for: o `steamwebhelper` casa por `comm`, e `comm` é
   truncado em **15 bytes** — `steamwebhelper` tem 14, passa raspando, e um
   nome mais longo não passaria. Vale medir antes de assumir equivalência.
4. **A repartição das 997 read/s entre as threads vivas continua sendo bancada
   dela** — `/proc/<tid>/syscall` precisa de `ptrace_scope=0`, e o comando que
   ELA roda está na própria sprint. Nada disto mudou.
5. **A E3 (o número na tela) é DELA**, e continua não decidida. "Não fazer" é
   resposta legítima; não escrevi nada de tela.
6. **Seis testes vermelhos de nascença em `onda/atual-0609`** (lista acima), nos
   três arquivos do wrapper/lançador. Não são desta sprint e não os toquei —
   mas alguém os está carregando desde antes desta leva.
7. **Uma poluição por ordem de execução**, medida e nomeada:
   `test_o_despachante_serve_as_dez.py` e `test_o_perfil_chega_na_tela.py`
   deixam `test_a_aba01_le_o_estado_em_vez_de_cravar.py` com cinco vermelhos
   quando rodam antes dele. Reproduz em dois arquivos:
   `pytest tests/unit/test_o_despachante_serve_as_dez.py tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py`.
   O sintoma é a coluna Atenção voltando `['JOGO', 'AJUSTAR', 'AJUSTAR']` onde
   se espera `['JOGO']` — estado global que um dos dois deixa de pé. **Isto é
   um instrumento que mente em lote**, e a suíte em oito lotes pode escondê-lo
   ou revelá-lo conforme o corte cair.
