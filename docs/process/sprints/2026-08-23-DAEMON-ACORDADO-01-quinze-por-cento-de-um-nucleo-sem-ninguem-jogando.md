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
