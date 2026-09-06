---
sprint: DAEMON-ACORDADO-01
estado: aberta
onda: G
posse:
  E2:
    - src/hefesto_dualsense4unix/core/escritor_cru.py
    - src/hefesto_dualsense4unix/integrations/steam_launch_options.py
bancada: false
depois_de: []
nao_toca: []
---

> **ROTA CORRIGIDA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** **O que falta é a E2, item 1, e ela já tem desenho** (última seção desta sprint): o
`pids_da_steam` do `escritor_cru` é a cópia que ficou de fora da troca `pgrep -f` → varredura
nativa de `/proc` que o `PERF-PROC-SCAN-01` fez em `steam_launch_options.py:749`. Usar a
varredura que já existe (ou o cache de 5 s do sentinela). O item 2 fechou em 25/08 (portão que
CONTA em `test_daemon_acordado_01_o_laco_que_valida_quatro_vezes.py`). A cadência de leitura do
controle **não se toca**. A medição com `ptrace_scope` é do coordenador, se sobrar tempo — não
é pré-requisito.

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.6 — o Passo 4 da A-TELA-SAMBA-01 mede o custo de `profile.list` (33 perfis com `FileLock` a cada ~3 s) e pode fechar parte disto.

# DAEMON-ACORDADO-01 — quinze por cento de um núcleo sem ninguém jogando

**23/08/2026.** Achado lateral da investigação do engasgo do Sackboy: ao medir
o que competia com o jogo, o daemon apareceu gastando CPU **sem jogo, sem
janela e com os quatro controles parados na mesa**.

## O que foi medido

Máquina dela, `hefesto-dualsense4unix.service` ativo desde 00:38, nenhum jogo,
janela do Hefesto fechada, quatro DualSense ligados por rádio e imóveis.

| régua | valor |
|---|---|
| janela cronometrada de 60 s | **15,2 % de um núcleo** (9,137 s de CPU) |
| janela cronometrada de 30 s, repetida depois | **14,6 % de um núcleo** |
| média da vida inteira (`CPUUsageNSec` ÷ tempo de vida) | **18,2 %** — 17,42 min de CPU em 95,9 min |

Duas janelas independentes e a média de vida concordam na ordem de grandeza. A
média é maior que as janelas porque inclui o arranque e o período em que a
janela esteve aberta.

**O que ele faz nesses 15 %**, pelo `/proc/<pid>/io` na mesma janela de 30 s:

| contador | por segundo, em repouso |
|---|---|
| `syscr` (chamadas `read`) | **6.393** |
| `rchar` | **910 KB/s** |
| `syscw` (chamadas `write`) | **904** |
| threads vivas | **27** |

## A pista, e ela é só pista

Os quatro controles juntos emitem cerca de **2.400 relatórios/s** — pela medição
de 22/08 (QUATRO-MICROFONES-01, o achado do relógio do aparelho): ~800/s por
adaptador, repartidos entre os controles que ele hospeda, e a mesa dela tem três
adaptadores com 2, 1 e 1 controle.

O daemon faz **6.393 `read()`/s** para consumir 2.400 relatórios — cerca de
**2,7 chamadas por relatório**. `rchar` ÷ `syscr` dá 142 bytes por chamada, e o
relatório por rádio tem 78.

**GRAU: MEDIDO** para os números. **GRAU: SUSPEITA COM MECANISMO** para a
leitura: ou o mesmo relatório é lido por mais de um consumidor, ou há laço não
bloqueante colhendo `EAGAIN` — as duas explicam a razão, e as duas se separam
com um `strace -c -f` de dez segundos, que é o primeiro passo desta sprint e
não precisa dela.

E o número não desce sozinho: as seis threads mais quentes estão em `ep_poll` e
`poll_schedule_timeout` — nenhuma delas presa em espera ocupada óbvia, o que
empurra a explicação para o **volume** de trabalho e não para uma thread doente.

## Por que importa, e o que o silêncio custa

1. **É a máquina dela, e a queixa que abriu a madrugada era de engasgo.** O
   daemon foi **eliminado** como causa do engasgo do Sackboy pelo teste mais
   forte que existe — relato dela: *engasga com o Hefesto desligado*. Isto aqui
   **não reabre** aquela suspeita. É outro custo, no mesmo lugar.
2. **Ele roda o tempo todo.** 15 % de um núcleo é o preço de existir, pago 24 h
   por dia por quem instalar o produto — inclusive em máquina mais fraca que a
   dela, onde 15 % de um núcleo de Ryzen 5800X é uma fração bem maior.
3. **É consumo em repouso.** Nenhum dos 6.393 `read()`/s está servindo a alguém:
   não há jogo lendo, não há janela desenhando, não há gesto.

## Entregas

### E1 — separar as duas hipóteses, com dez segundos de instrumento

`strace -c -f -p <pid>` por dez segundos, em repouso, e a conta de quantos
`read` voltaram com dado e quantos com `EAGAIN`. **Não precisa dela e não toca
o produto.** É o que decide se a E2 é "colher menos" ou "colher uma vez só".

**Validação da régua, que esta casa exige:** o total de `read` do `strace` tem
de bater com o delta de `syscr` do `/proc/<pid>/io` na mesma janela. Duas
contagens independentes antes de acreditar em qualquer uma.

### E2 — o teto, depois de E1

Fica sem desenho de propósito: escolher entre "um leitor por nó" e "recuar a
cadência quando nada muda" sem saber qual dos dois é o gasto seria projetar no
escuro.

**A restrição que já se conhece e que a E2 tem de respeitar:** recuar cadência
não pode atrasar o primeiro relatório depois de um gesto. Controle que responde
tarde é pior que controle que gasta CPU, e essa é decisão dela.

### E3 — o número na tela — **É DELA**

Se ela quer ver isto. Já existe superfície onde caberia (a aba Configurações
tem medidor de rádio); e já existe precedente contra encher a tela de número que
ninguém pediu. **Não fazer** é resposta legítima.

## O que esta página NÃO afirma

* **Não afirma que 15 % é demais.** Afirma que é o número, que ninguém o
  conhecia, e que ele é pago em repouso. Se é caro ou barato é decisão de
  produto;
* **não reabre a suspeita do daemon no engasgo do Sackboy** — ver §1 acima;
* **não afirma que os 2,7 `read()` por relatório são desperdício.** Pode haver
  razão; é isso que a E1 mede.

## Como reproduzir

```bash
# a taxa instantânea, em repouso
python3 - <<'EOF'
import subprocess, time
c = lambda: int(subprocess.run(["systemctl","--user","show",
    "hefesto-dualsense4unix.service","-p","CPUUsageNSec","--value"],
    capture_output=True, text=True).stdout)
a = c(); t = time.monotonic(); time.sleep(60); b = c(); dt = time.monotonic() - t
print(f"{100*(b-a)/1e9/dt:.1f} % de um núcleo")
EOF

# o que ele faz
pid=$(systemctl --user show hefesto-dualsense4unix.service -p MainPID --value)
cat /proc/$pid/io          # syscr/rchar, duas leituras separadas por 30 s
ps -L -o tid,pcpu,wchan:24 -p $pid
```

---

# E1 RESPONDIDA — 25/08/2026, e por régua que a sprint não previa

A E1 pedia `strace -c -f -p <pid>` por dez segundos. **`strace` não roda aqui:**
`/proc/sys/kernel/yama/ptrace_scope` está em `1`, e sem `ptrace` não há `strace`
nem `/proc/<tid>/syscall`. Isso não bloqueou a entrega — bloqueou METADE dela.

## A régua que substituiu o `strace`, e por que ela é honesta

`/proc/<pid>/io` **não é** a soma das threads vivas. Ele soma também o que
threads mortas e **filhos já colhidos** gastaram. Logo:

```
BURACO = syscr do PROCESSO − Σ syscr de /proc/<pid>/task/<tid>/io
```

é, por construção, o que saiu por `fork`/`exec` — sem `ptrace`, sem parar nada,
sem perturbar o que se mede. **Duas réguas independentes**, como a casa exige:
o buraco, e uma amostragem de `/proc` a ~1 ms contando filhos do daemon.

## O que elas dizem — janela de 30 s, 25/08/2026

Daemon dela vivo, **um** DualSense no cabo, sem jogo, **janela do Hefesto
ABERTA** (e isto importa; ver a ressalva abaixo):

| | read/s | rchar |
|---|---|---|
| processo | 2.572,9 | 537,8 KB/s |
| threads VIVAS | 997,2 | 83,9 KB/s |
| **buraco (`fork`/`exec`)** | **1.575,6** | **453,9 KB/s** |

**61 % das leituras e 84 % dos bytes do daemon não são do controle.**

As duas réguas fecham em **4 %**: a amostragem viu 18 `pgrep` em 30 s
(0,60/s → 1.520 read/s previstos) contra 0,62 `pgrep`/s deduzidos do buraco.

**O custo de UM `pgrep`, medido isolado nesta máquina: 2.533 `read()` e 724 KB
de `rchar`**, cobrados ao pai quando o filho é colhido. Ele lê `/proc` inteiro.

## Quem forka, e por que a cada 3,3 s

`daemon/ipc_handlers.py:597` (`_steam_hidraw_holders`) →
`core/escritor_cru.py:137` (`holders_de_hidraw`) → `pids_da_steam()`, que roda
`pgrep -f steamrt64/steam` **e** `pgrep -x steam`.

**Esse caminho não tem cache.** O `VALIDADE_DO_VEREDITO_S = 5.0` mora no
`SentinelaDeEscritorCru`, e quem passa por ele é o vigia da lightbar
(`daemon/connection.py:857`), cujo tique é de 30 s — duas sondas por minuto,
como a docstring dele promete. **O caminho da JANELA não passa pelo sentinela**,
e é ele que forka: um par de `pgrep` a cada 3,3 s, o ritmo do `controller.list`
da GUI.

## A ressalva que impede este achado de virar fato errado

**Isto NÃO explica os 15,2 % de 23/08.** Aquela medição foi feita com a
**janela FECHADA**, e sem GUI não há `controller.list`, logo não há este
`pgrep`. São dois custos diferentes no mesmo lugar. Escrever o contrário seria
a armadilha nº 1 desta casa — medir contra a régua errada e produzir alarme
convincente.

O que o achado faz com a página acima é outra coisa, e é uma correção de fato:

**a pista dos "2,7 `read()` por relatório" não sustenta o peso que a §"A pista"
põe nela.** Com um DualSense no cabo (250 relatórios/s), as threads vivas
fizeram 997 read/s — **4,0 por relatório**, pior que os 2,7 do arranjo de
quatro. Um custo que PIORA quando há menos controles não é custo por relatório:
é custo FIXO do daemon dividido por um denominador menor. Dividir leituras por
relatórios mistura os dois, e nenhuma das duas hipóteses da §"A pista"
("o mesmo relatório lido por mais de um consumidor" / "laço colhendo `EAGAIN`")
é necessária para explicar a razão.

Uma delas já pode ser descartada em parte: `/proc/<pid>/fd` mostrou **um único
fd** no nó hidraw. Dois consumidores do mesmo relatório existiriam se a ponte de
microfone estivesse de pé (`integrations/dualsense_bt_audio.py:950` abre um 2º
fd no MESMO nó e lê TODO report, descartando os de input em `:962`) — e ela
**não estava**: não há `maquina.json` nesta máquina, e `bt_mic_uniqs` ausente é
desligado.

## O que continua sendo bancada dela

A repartição das **997 read/s entre as threads VIVAS** — qual fd cada uma lê.
`/proc/<tid>/syscall` responderia sem perturbar nada, e é recusado pelo
`ptrace_scope`. Comando que ELA roda:

```bash
sudo sysctl -w kernel.yama.ptrace_scope=0     # temporário; volta a 1 no reboot
pid=$(systemctl --user show hefesto-dualsense4unix.service -p MainPID --value)
for t in /proc/$pid/task/*; do echo "$(basename $t) $(cat $t/syscall)"; done
sudo sysctl -w kernel.yama.ptrace_scope=1
```

E a repetição da janela de 30 s acima **com a janela do Hefesto FECHADA e os
quatro controles no rádio** — que é o que separa, de vez, o custo da GUI do
custo de existir.

## O teto (E2), agora com um desenho que não é no escuro

A E2 ficava "sem desenho de propósito" até a E1 dizer o que era. Ela disse:

1. **`pgrep` no caminho da janela** — o maior número da tabela, e o mais barato
   de matar. O `PERF-PROC-SCAN-01` (12/08/2026) já trocou um `pgrep -f` por uma
   varredura nativa de `/proc` em `integrations/steam_launch_options.py:749`,
   **medindo o mesmo defeito e escrevendo a mesma conta**. O `pids_da_steam` do
   `escritor_cru` é a cópia que ficou de fora daquela troca. Duas saídas, e as
   duas são de outra frente: usar a varredura nativa que já existe, ou dar ao
   caminho da janela o mesmo cache de 5 s que o sentinela já tem;
2. **a fatia deste arquivo** — fechada em 25/08: `core/physical_report_reader`
   resolvia a base do report QUATRO vezes por report (um CRC-32 por consumidor
   no rádio). Agora resolve uma. Portão que CONTA em
   `tests/unit/test_daemon_acordado_01_o_laco_que_valida_quatro_vezes.py`.

A restrição da E2 ("recuar cadência não pode atrasar o primeiro relatório
depois de um gesto") **continua intocada por tudo isto**: nenhuma das duas
mexe em cadência de leitura do controle.
