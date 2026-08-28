# O hub caiu inteiro, seis segundos depois do cabo do controle

**25/08/2026, 02h36. GRAU: MEDIDO** — o log do kernel e o `/sys` foram lidos às
02h50, quinze minutos depois do evento, com a máquina ainda no estado em que
ficou. Onde a linha diz **HIPÓTESE**, é hipótese.

**Ela não estava na frente da máquina** (saiu às ~02h30, delegando a execução da
madrugada). O evento aconteceu sozinho, e o produto não disse uma palavra sobre
ele — que é o defeito que a `PORTAS-DA-CASA-01` e a `ORDEM-DE-SERVICO-01`
existem para fechar.

---

## 1. O que aconteceu, em uma frase

**Ela mudou o cabo do DualSense de entrada; seis segundos depois o hub externo
inteiro caiu do barramento com erro de protocolo, levando os três adaptadores
Bluetooth junto — e a máquina ficou sem NENHUM Bluetooth.**

## 2. A sequência, do log do kernel

```
02:36:25  usb 3-1.2: USB disconnect, device number 5      # o DualSense sai do hub
02:36:34  usb 1-4: new high-speed USB device number 4 using xhci_hcd
02:36:37  usb 1-4: Product: DualSense Wireless Controller # e reaparece na outra controladora
02:36:43  usb 3-1.1: clear tt 1 (9082) error -71
02:36:43  usb 3-1.1: clear tt 1 (9072) error -71
02:36:43  usb 3-1:     USB disconnect, device number 2    # o hub, lado 2.0
02:36:43  usb 3-1.1:   USB disconnect, device number 4    # o segundo chip
02:36:43  usb 3-1.1.1: USB disconnect, device number 6    # TP-Link UB500
02:36:43  usb 3-1.1.4: USB disconnect, device number 7    # TP-Link UB500
02:36:43  usb 4-1:     USB disconnect, device number 2    # o MESMO plástico, lado 3.0
02:36:43  usb 4-1.1:   USB disconnect, device number 7
02:36:43  rtw88_8822bu 4-4:1.0: rtw_usb_reg_sec: reg 0x4e0, usb write 1 fail, status: -71
02:36:43  usb 4-4: reset SuperSpeed USB device number 4 using xhci_hcd
```

**Cinco erros `-71` na árvore inteira desde 24/08 — todos os cinco neste
segundo.** Não é ruído crônico; é um evento único.

## 3. O estado agora

| o quê | antes (02h30) | agora |
|---|---|---|
| adaptadores Bluetooth | 3 | **0** — `/sys/class/bluetooth/` está VAZIO |
| hub externo | `3-1` + `3-1.1` / `4-1` + `4-1.1` | **ausente do barramento** |
| Wi-Fi | `4-4`, 5000 Mb/s | `4-4`, **depois de um reset** — voltou |
| DualSense | `3-1.2` (no hub) | `1-4`, por cabo |
| teclado / mouse | `1-3` / `1-6` | inalterados (outra controladora) |
| `over_current_count` | 0 nas 22 entradas | **0 nas 22 entradas** |

**A consequência que ela vai sentir:** enquanto o hub não voltar, **nenhum
controle conecta por rádio.** Só cabo.

## 4. O que isto diz, e o que NÃO diz

**Diz:** o `-71` (`EPROTO`) não foi só do adaptador Wi-Fi em 23/08. Aqui ele
apareceu no **tradutor de transação do hub** (`clear tt`, duas vezes) e, no
mesmo segundo, numa escrita de registrador do Wi-Fi que está numa **entrada de
raiz diferente** — `4-4`, não no hub. Dois aparelhos, dois caminhos, o mesmo
segundo, o mesmo erro. `over_current_count` continua zero nas 22 entradas, então
**o kernel não viu excesso de corrente em entrada nenhuma.**

**RESOLVIDO POR ELA, 25/08 às 03h05, e a palavra dela fecha a questão:** *"pera
o hub tá desconectado de fato."* **O cabo do hub está fora.** Foi desencaixe
físico, não evento de controladora — as duas hipóteses que este documento
carregava por quinze minutos morrem aqui, e a mais simples era a certa.

**O que sobra a explicar, e a explicação é barata:** por que o Wi-Fi, que NÃO
pende do hub, falhou uma escrita de registrador com `-71` no mesmo segundo. A
resposta provável é colateral, não causa — o desencaixe de uma árvore inteira no
meio de uma transação faz o `xhci` engasgar, e as duas raízes (`usb3` e `usb4`)
são da MESMA controladora `0000:0c:00.3` que hospeda o `4-4`. O kernel resolveu
sozinho: `reset SuperSpeed USB device` e o Wi-Fi voltou. **NÃO VERIFICADO** que
seja essa a mecânica; o que está medido é que aconteceu uma vez, se curou
sozinho, e não voltou.

**O que NÃO era:** a conta de corrente do `CONEXOES-MAPA-2D-01` §2.1 registra
três UB500 pedindo 500 mA cada num hub que **tem** fonte de 30 W — o orçamento
cabia, e `over_current_count` é zero nas 22 entradas. O arranjo dela não é o
culpado.

## 5. O que fazer, e por que eu não fiz

**O conserto é físico e é dela:** reencaixar o cabo do hub — ela confirmou às
03h05 que ele está fora. Nenhum comando traz de volta um aparelho que saiu do
barramento.

O único caminho por software seria forçar a re-enumeração desligando e religando
a controladora (`unbind`/`bind` do `xhci_hcd` em `0000:0c:00.3`). **Não fiz, e a
razão não é zelo:** o Wi-Fi dela mora nessa mesma controladora, e derrubá-lo
derruba a rede — inclusive a leva de agentes que está rodando agora. O risco é
concreto e o ganho é incerto.

**O que resta, agora que ela confirmou o desencaixe:** reencaixar o cabo do hub e
conferir com `ls /sys/class/bluetooth/` que os três `hciN` voltaram. Enquanto
isso não acontecer, **toda tarefa de rádio desta madrugada está bloqueada por
ausência de aparelho** — não por decisão e não por defeito.

## 6. O que este evento prova sobre o produto

**Duas coisas, e as duas já têm sprint aberta:**

1. **O Hefesto tinha o dado e não disse nada.** Três adaptadores Bluetooth
   sumiram de uma vez e a tela não tem uma frase para isso. É a
   `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ` na forma mais cara — e é exatamente a
   afirmação *"o aparelho que estava na entrada 9 sumiu"* que a
   `CONEXOES-MAPA-2D-01` (MAPA-7) entrega.
2. **A mesa dela mudou três vezes em vinte e quatro horas** — 24/08 às 21h, 24/08
   às 22h50, e agora. Qualquer desenho que guarde *"a entrada 9 tem um
   Bluetooth"* nasce errado. O que sobrevive é o modelo do mockup: **a entrada 9
   É o caminho `3-1.2`**, e o que está lá é derivado da leitura de agora.

Ver: [CONEXOES-MAPA-2D-01](../sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md),
[PORTAS-DA-CASA-01](../sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md),
[ORDEM-DE-SERVICO-01](../sprints/2026-08-24-ORDEM-DE-SERVICO-01-o-exame-que-viu-e-nao-mandou.md).
