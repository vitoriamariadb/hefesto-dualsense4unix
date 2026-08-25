# DAEMON-ACORDADO-01 — C3, 25/08/2026

Branch `voo/DAEMON-ACORDADO-C3`. Sprint:
[2026-08-23-DAEMON-ACORDADO-01](../../sprints/2026-08-23-DAEMON-ACORDADO-01-quinze-por-cento-de-um-nucleo-sem-ninguem-jogando.md).

Retomada: o agente anterior morreu no limite de sessão às 6h10 com
`core/physical_report_reader.py` modificado e **nada commitado**. O que estava
lá era a camada `_..._com_base` (correta, e os testes passavam) **sem o laço
quente fiado nela** — ou seja, a economia existia e ninguém a usava. Rodei,
commitei, e só então continuei.

## O que mudou

**A base do report resolvida UMA vez** (`core/physical_report_reader.py`).
`_read_until_lost` chamava quatro extratores públicos, e cada um começava
resolvendo `_struct_base` por conta própria. No rádio o `_struct_base` valida
CRC-32 — **quatro CRC-32 por report onde um basta**, mais as três cópias de
buffer que cada `bt_crc32` faz. Agora a base sai uma vez e os quatro
consumidores (clique, jack, bateria, janela de motion) a recebem pronta.

Semântica preservada campo a campo: base `None` (id estranho, tamanho errado,
CRC ruim, ou o report de ÁUDIO do PS-PRESO-01) sai ANTES dos quatro, que já a
tratavam como "não sei"; `bt_drops` conta idêntico. Os quatro extratores
públicos continuam existindo — são a porta de quem tem UM report na mão — e os
três `_observe_*` recebem a base como argumento **opcional**, então a forma de
um argumento que a suíte já usava segue valendo (nenhum teste existente mudou).

Cronômetro, 25/08, Ryzen 5800X / CPython 3.13 / report BT de 78 B, `timeit`,
mínimo de 5 repetições de 200 mil: quatro extratores **3,10 us**;
`_struct_base` sozinho **0,68 us**; base uma vez + os quatro `_com_base`
**1,11 us**. A 2.400 relatórios/s (a mesa dela), 0,74 % de um núcleo contra
0,27 %, e 9.600 validações de CRC/s viradas em 2.400.

**E1 respondida sem `strace`** (seção nova na sprint). `strace` não roda aqui:
`ptrace_scope = 1`. A régua que substituiu: `/proc/<pid>/io` do processo **menos**
a soma de `/proc/<pid>/task/<tid>/io` das threads vivas — o buraco é, por
construção, o que `fork`/`exec` gastou, e ler `/proc` não perturba o que mede.

Janela de 30 s no daemon dela, um DualSense no cabo, sem jogo, **janela do
Hefesto aberta**: processo 2.572,9 read/s e 537,8 KB/s; threads vivas
997,2 read/s e 83,9 KB/s; **buraco 1.575,6 read/s e 453,9 KB/s — 61 % das
leituras e 84 % dos bytes**. São `pgrep`: `daemon/ipc_handlers.py:597` →
`core/escritor_cru.py:137` → `pids_da_steam()`, um par a cada 3,3 s, no ritmo
do `controller.list` da GUI. Esse caminho **não tem cache** — o
`VALIDADE_DO_VEREDITO_S = 5.0` mora no `SentinelaDeEscritorCru`, por onde só
passa o vigia da lightbar (`daemon/connection.py:857`, tique de 30 s).

Um `pgrep` isolado custa **2.533 `read()` e 724 KB**, cobrados ao pai na colheita.

## Qual mordida prova

`tests/unit/test_daemon_acordado_01_o_laco_que_valida_quatro_vezes.py` (12
testes). Ele **conta**, não cronometra: cronômetro em máquina de CI vira teste
frouxo ou instável, e a contagem não muda com a carga. Duas réguas
independentes — `bt_crc32` (o custo real) e `_struct_base` (que ainda pega a
regressão se alguém trocar o CRC por algo mais barato).

Dublê de leitor: `socketpair(AF_UNIX, SOCK_SEQPACKET)`, **não** `os.pipe()` —
o pipe é stream e `os.read(fd, 128)` colaria dois reports de 78 B numa leitura
só, e o teste passaria a medir outra coisa. Há teste que trava isso
(`test_cada_report_escrito_vira_exatamente_uma_leitura`). Relógio injetado
(`time_fn`), laço REAL (`_read_until_lost`), sem thread e sem `sleep`.

Arranquei a cura (o laço devolvido aos quatro extratores públicos) e limpei
`__pycache__` e `.pyc` entre arrancar e devolver.

**SEM a cura — 3 reprovados, 9 passaram:**

```
E  AssertionError: 40 validações de CRC-32 para 10 reports de rádio — são 4
   por report. O laço voltou a resolver a base uma vez por consumidor
   (DAEMON-ACORDADO-01).
E  assert 40 == 10
E  assert 40 == 10          (a 2ª régua, `_struct_base`, no caminho do cabo)
E  assert 20 == 5           (5 reports corrompidos: 4 CRC cada)
FAILED ...::test_bt_valida_o_crc_uma_vez_por_report
FAILED ...::test_usb_resolve_a_base_uma_vez_por_report
FAILED ...::test_report_corrompido_tambem_valida_uma_vez_so
3 failed, 9 passed in 0.26s
```

**COM a cura de volta:** `12 passed in 0.23s`.

O contrapeso, que uma contagem sozinha não daria: contar validações aceitaria
uma "otimização" que não entrega nada. `TestOsQuatroCamposContinuamChegando`
roda os mesmos reports no cabo e no rádio e cobra o que o JOGO veria — clique
por borda, jack, bateria e as três janelas de motion, do mesmo report.
`TestOReportDeAudioNaoViraInput` cobra que o PS-PRESO-01 atravessou a mudança:
report de áudio com CRC válido não entrega nada em nenhum dos quatro canais.

Regressão do arquivo inteiro: **200 testes** dos nove arquivos que tocam este
reader, verdes. `bash scripts/portoes.sh`: **23 verdes**.

## O que NÃO verifiquei

**Nada rodou contra aparelho.** O achado do `pgrep` foi medido no daemon VIVO
dela, mas só por leitura de `/proc` — não parei o daemon, não rodei
`systemctl`, não escrevi no aparelho, não anexei `strace`.

**A janela dela estava ABERTA durante a minha medição**, e a de 23/08 foi feita
com ela FECHADA. Por isso o achado do `pgrep` **não explica os 15,2 %** — está
escrito assim na sprint, e não deve ser reescrito de outro jeito.

**A repartição das 997 read/s entre as threads vivas** (qual fd cada uma lê)
não saiu: `/proc/<tid>/syscall` exige `ptrace`, recusado pelo
`ptrace_scope = 1`. Mesma barreira do `strace`.

**Não medi o ganho do laço na máquina dela.** O cronômetro é desta bancada; o
portão que fica é de contagem, não de tempo.

**Prova de tela: não se aplica** — nada aqui toca a interface.

## O que sobrou para o próximo

1. **O `pgrep` do caminho da janela — não é meu arquivo.**
   `daemon/ipc_handlers.py` é de B5 e `core/escritor_cru.py` não está na minha
   posse. **Não editei.** O que ele precisa, exatamente: `holders_de_hidraw()`
   (`core/escritor_cru.py:137`) chama `pids_da_steam()` direto, sem cache, e é
   chamado por `_steam_hidraw_holders` (`daemon/ipc_handlers.py:597`) a cada
   `controller.list` da GUI. Duas saídas, e a primeira já existe pronta: o
   `PERF-PROC-SCAN-01` (12/08/2026) trocou exatamente este `pgrep` por uma
   varredura nativa de `/proc` em `integrations/steam_launch_options.py:749`,
   **medindo o mesmo defeito e escrevendo a mesma conta** — o `escritor_cru`
   é a cópia que ficou de fora daquela troca. A outra: dar ao caminho da janela
   o mesmo cache de 5 s que o `SentinelaDeEscritorCru` já tem.
2. **A remedição de 30 s com a janela FECHADA e os quatro controles no rádio.**
   É o que separa, de vez, o custo da GUI do custo de existir. O script que
   usei está descrito na sprint; roda sem `sudo`.
3. **A repartição por thread**, com o `ptrace_scope` baixado por um minuto — o
   comando exato está na sprint.
4. **E3 (o número na tela) segue sendo dela**, e "não fazer" continua legítimo.

## Nota de processo

A R5 (*a mordida é destrutiva enquanto dura, e por isso a árvore tem UM
escritor*) valeu literalmente aqui: a mordida deste portão reescreve
`core/physical_report_reader.py` por ~40 s. Guardei a cura fora da árvore antes
de arrancar, e restaurei por cópia — não por `git checkout`, que perderia
qualquer edição não commitada que estivesse junto.
