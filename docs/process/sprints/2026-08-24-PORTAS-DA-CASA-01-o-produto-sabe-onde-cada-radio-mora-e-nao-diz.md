# PORTAS-DA-CASA-01 — o produto sabe onde cada rádio mora, e não diz

**Data:** 24/08/2026 (planejada em 23/08, à noite).
**Grau:** **MEDIDO** para tudo que este documento chama de leitura de `/sys`;
**DESENHO** para as frases de tela e para a ordem das tarefas. Onde não houve
medição, está escrito **NÃO VERIFICADO** — e continua não verificado.

**O que esta leva fecha:** o eixo USB da aba Configurações. O produto passa a
dizer, com o mecanismo lido na frente, **por qual caminho físico cada rádio
chega até a CPU e com quem ele divide esse caminho** — e para de pintar de
laranja um par de portas que não tem rádio nenhum.

**O que esta leva NÃO faz:**

- não afirma culpa ("o Wi-Fi está derrubando seu Bluetooth" não nasce em lugar
  nenhum);
- não cria seção nova na aba Configurações — a altura não existe (§7);
- não toca no medidor de rádio (`integrations/radio_da_mesa.py`), que responde
  outra pergunta e tem outro selo de procedência (§6);
- não mexe no `hciN` de `scripts/medir_w3_coex.sh`, que já é item aberto em
  [N-IGUAL-A-UM-01](2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md);
- não decide a compra de hardware nem reescreve o `GUIA-RADIO-DA-SALA.md` — a
  medição que o corrigiria é a última tarefa, e é dela (PORTA-10).

---

## 1. O defeito, em uma frase que quem usa entenderia

**Hoje, 23/08, a internet dela caiu repetidas vezes e derrubou dez agentes: o
adaptador Wi-Fi USB estava no mesmo caminho de 480 Mb/s que os três dongles
Bluetooth, e o Hefesto tinha esse dado na mão e não disse uma palavra.**

Três agravantes, todos medidos:

1. O erro do kernel era `-71` (`EPROTO`) no `rtw88_8822bu`. A cura foi mover o
   Wi-Fi de barramento. Nada no produto sugeriu isso.
2. Um receptor 2,4 GHz de teclado/mouse estava **dentro do hub**, encaixado
   entre os adaptadores Bluetooth — arranjo que o próprio
   [GUIA-RADIO-DA-SALA.md](../../../GUIA-RADIO-DA-SALA.md) proíbe em dois
   lugares (§4.1, "pule as intermediárias"; §8, "dois rádios 2,4 GHz colados").
3. Ao mesmo tempo, a única linha do exame que fala de portas coladas estava
   **laranja pelo motivo errado**: o par que ela contou é um `Gaming Keyboard`
   **de cabo** colado a um dongle. Um teclado de cabo não irradia nada.

É a `A-CASA-SABE-E-O-PRODUTO-NÃO-FAZ` na forma mais cara: a medição existe,
mora em quatro dataclasses congeladas, e **nenhuma tela a pronuncia**.

---

## 2. O que está MEDIDO

Régua declarada: `.venv/bin/python` importando `src/` direto, **uid 1000, sem
root, sem sudo**; e `cat`/`readlink` em `/sys` para o que o produto ainda não
lê. Kernel `7.0.11-76070011-generic`, 23/08/2026, ~20h30 — **depois** de ela
mexer nos cabos.

```sh
id -u                                   # 1000
.venv/bin/python -c 'from hefesto_dualsense4unix.integrations import censo_do_barramento as c; \
    censo = c.ler_o_barramento(); print(len(censo.aparelhos), len(censo.conectados()))'
cat /sys/bus/usb/devices/usb*/speed
for d in /sys/bus/usb/devices/usb*/*/usb*-port*; do printf '%s peer=%s state=%s panel=%s\n' \
    "${d##*/}" "$([ -e "$d/peer" ] && echo sim || echo AUSENTE)" "$(cat "$d/state")" \
    "$(cat "$d/physical_location/panel" 2>/dev/null || echo AUSENTE)"; done
cat /sys/bus/usb/devices/*/port/over_current_count
cat /sys/bus/usb/devices/3-1/bDeviceProtocol
cat /sys/bus/usb/devices/*/urbnum
```

### 2.1 A árvore desta bancada, agora

```
usb1   pci=0000:02:00.0     480 Mbps
  1-4      2357:0604  e0/01/01  Bluetooth      12 Mb/s   painel=right
  1-6      25a7:fa07  03/01/02  "2.4G Wireless Receiver"  12 Mb/s  painel=right
usb2   pci=0000:02:00.0   10000 Mbps  (vazio)
usb3   pci=0000:0c:00.3     480 Mbps
  3-1      05e3:0610  hub 2.1  bDeviceProtocol=01   (TT ÚNICO)
    3-1.1    05e3:0610  hub 2.1  bDeviceProtocol=01
      3-1.1.3  258a:010c  03/01/01  "Gaming Keyboard"  (DE CABO)
      3-1.1.4  2357:0604  e0/01/01  Bluetooth
    3-1.2    2357:0604  e0/01/01  Bluetooth
usb4   pci=0000:0c:00.3   10000 Mbps
  4-1      05e3:0626  hub 3.1
    4-1.1    05e3:0626  hub 3.1
      4-1.1.1  2357:012d  ff/ff/ff  "802.11ac NIC"  5000 Mb/s  (Archer T3U)
```

### 2.2 Os cinco fatos que decidem o desenho

| # | fato medido | consequência |
|---|---|---|
| 1 | **`port/peer` é legível como uid 1000, mas só existe onde o kernel casou um par 2.0/3.0.** Medido: `usb1` **3 de 10**, `usb2` 3 de 4, `usb3` 4 de 4, `usb4` 4 de 4 — e `state` responde nas **22**. `usb1-port5 -> usb2-port1` | onde existe, é o kernel dizendo qual porta 2.0 e qual 3.0 são o **mesmo buraco físico**, e apaga toda inferência. Onde **falta com `state` presente**, o fato é POSITIVO: porta sem gêmea 3.0. "Não sei" só quando `state` também falta |
| 2 | **`bDeviceProtocol` do hub `3-1` e `3-1.1` vale `01` = TT único** (o hub 3.0 vale `03`) | um tradutor carrega **todo** o tráfego full-speed daquele hub: ~12 Mb/s somados, não por porta (USB 2.0 §11.14) |
| 3 | **`over_current_count` = 0 nas 22 portas** desta bancada | o único número desta frente que registra evento que *aconteceu*, não que foi *declarado*. Silêncio por padrão |
| 4 | **`physical_location/` fica no nó da PORTA, responde em porta VAZIA, e traz `panel`, `horizontal_position`, `vertical_position`, `dock`, `lid`.** Medido: `usb1` **10 de 10**, `usb2` 4 de 4, `usb3` **0 de 4**, `usb4` **0 de 4** | `panel` é frente/traseira/lateral e `lid` é *"porta na tampa do laptop"* — o **onde** que falta ao conselho. Mas só a controladora `0000:02:00.0` expõe; a `0000:0c:00.3` (AMD Matisse) não expõe nada. **A resposta é parcial por construção**, e por isso a pergunta do alcance não morre — só encolhe |
| 5 | **`urbnum` mede transação real.** Delta em 2,0 s: Wi-Fi 1347 (673,5/s), teclado 20 (10,0/s), os três Bluetooth 0 | contraponto do medidor de rádio, que é derivado da especificação. Conta URB, não byte — e **exige duas amostras no tempo** |

### 2.3 O FATO ERRADO QUE ESTA LEVA SUBSTITUI

O diagnóstico do incidente de hoje afirma: *"os pares 2.0/3.0 da mesma
controladora compartilham o número da porta — `3-3` e `4-3` são o mesmo
buraco"*.

**Isso é verdade só na `0000:0c:00.3`.** Medido na mesma máquina, na outra
controladora:

```
usb3-port1 -> usb4-port1     usb3-port3 -> usb4-port3     (N <-> N)
usb1-port5 -> usb2-port1     usb1-port6 -> usb2-port2     (N NÃO <-> N)
```

A regra por número de porta **erra nesta máquina, nesta controladora**. A
inferência `mesmo pci + mesmo devpath + busnum diferente` foi escrita e testada:
acerta a `0c:00.3` inteira e diria que `1-6` pareia com `2-6`, que não existe.
**Inferência que acerta metade da máquina é exatamente a gambiarra que a lei
desta casa manda apagar.** A causa raiz é `port/peer`, e a regra por número de
porta não entra em código, em teste nem em documento — se alguém a escrever,
PORTA-01 a derruba.

### 2.4 A segunda substituição: o Wi-Fi não mudou de controladora

O relato de hoje diz que ela moveu o Wi-Fi *para a outra controladora*. O que
está medido é outra coisa: o Archer está em `4-1.1.1` — **mesmo hub, mesmo
controlador PCI `0c:00.3`**, na metade 3.0 dele, a 5000 Mb/s. Mudou o
**barramento** (`3` para `4`), não a controladora.

Isso decide o desenho inteiro de PORTA-05: **a condição é `busnum`, nunca
`controlador_pci`.** Por `busnum` o arranjo de agora está limpo, o que bate com
"os erros pararam"; por `controlador_pci` ele ainda dispararia, e seria alarme
falso sobre um problema já curado. A bancada validou a régua sozinha.

### 2.5 O que a tela mostra hoje, medido com os tradutores reais

```
tabela "Adaptador | Onde está"
  | 2357:0604 | Barramento 3, porta 1.2   · Não sei · Em hub |
  | 2357:0604 | Barramento 1, porta 4     · Direita          |
  | 2357:0604 | Barramento 3, porta 1.1.4 · Não sei · Em hub |

tabela "Aparelho | Onde | O que é"
  | 25a7:fa07 | Direita                          | Mouse   (lido) |
  | 258a:010c | Não sei · vizinho do adaptador 3 | Teclado (lido) |
  | 2357:012d | Não sei                          | O Hefesto não sabe |
```

Quatro defeitos visíveis nessas seis linhas:

1. **A controladora não aparece.** "Barramento 1" é outra controladora física
   (`0000:02:00.0`) e a tela o apresenta na mesma escala de "Barramento 3".
2. **O subcabeçalho mente:** *"Outros rádios que dividem a faixa"* lista um
   teclado de cabo, e chama de "não sei" o único rádio de verdade da mesa.
3. **O aviso de vizinhança aponta para o lugar errado:** o par contado é
   teclado de cabo × dongle; `1-4` (Bluetooth) e `1-6` (receptor 2,4 GHz),
   ambos `panel=right`, `vertical_position=lower`, **não** geram aviso — a
   diferença de porta é 2, e `_portas_vizinhas` (`mesa_de_radio.py:378`) exige
   exatamente 1. **É o arranjo do incidente, e PORTA-03 tem de alcançá-lo.**
4. **Do `Censo` inteiro, a tela consome dois campos.** Varredura em `app/`:
   `barramentos` 0, `velocidade_mbps` 0, `e_hub` 0, `e_raiz` 0, `energia` 0,
   `corrente_pedida_ma` 0, `declaracao_incoerente` 0, `excesso_de_corrente` 0,
   `origem_da_classe` 0, `controlador_pci` 0. Só `especie` e `grau` chegam.

### 2.6 O defeito estrutural, e ele não é caso a acrescentar

`src/hefesto_dualsense4unix/integrations/mesa_de_radio.py`, em
`vizinhancas_apertadas`:

```python
if primeiro.busnum != segundo.busnum:
    continue
```

**O par 2.0/3.0 do mesmo buraco NUNCA tem o mesmo `busnum`.** Consequência
medida: o hub que hospeda os dois Bluetooth (`3-1.1`) e o hub que hospeda o
Wi-Fi (`4-1.1`) são **o mesmo plástico**, e a tela é arquiteturalmente incapaz
de dizer isso. É exatamente o eixo que derrubou a rede dela hoje. **É uma
premissa a derrubar, não um caso a somar.**

---

## 3. O que é HIPÓTESE, e continua sendo

| afirmação | estado |
|---|---|
| que o Wi-Fi no mesmo barramento **causou** as quedas de Bluetooth dela | **NÃO VERIFICADO.** Correlação forte (mover curou), mecanismo plausível, medição de causa nunca feita. A tela nunca vai dizer isto |
| que o TT único engasga os três dongles com cinco controles e microfone | **NÃO VERIFICADO.** É a medição de PORTA-10, e só a bancada dela a faz |
| que porta vizinha no `sysfs` é porta vizinha **no metal** | palpite, conservador e antigo. Vira leitura onde `physical_location/` responde nos dois lados — medido na mesma máquina: **14 de 14** portas da `02:00.0`, **0 de 8** da `0c:00.3` |
| que `state`/`peer` existem em kernel antigo | **NÃO VERIFICADO** fora desta máquina. Ausente vira "não sei", e o conselho nasce sem ação (§8) |
| que um aparelho 3.0 rebaixado a 480 mantém `bos_descriptors` | **NÃO VERIFICADO.** Por isso o conselho "seu aparelho 3.0 está numa porta 2.0" **não entra nesta leva** |
| que `chassis_type` do DMI diz se é laptop | **NÃO VERIFICADO** — não foi lido. Medir antes de decidir se vira pergunta |
| que `journalctl -k` responde sem root em outra máquina | **NÃO VERIFICADO.** Aqui responde (grupo do journal); `dmesg` **não** (`kernel.dmesg_restrict=1`). Nenhuma tarefa desta leva depende de log do kernel |

---

## 4. A CHOREOGRAFIA DOS AGENTES

**Oito agentes, em quatro ondas.** O que corre em paralelo nunca abre o mesmo
arquivo.

| onda | agente | papel | arquivos exclusivos | devolve |
|---|---|---|---|---|
| **0** | **A1 — o leitor** | PORTA-01 e PORTA-02: `state`, `peer`, `connect_type`, `physical_location/{panel,lid}`, `maxchild`, `bDeviceProtocol`; expõe `portas_livres()` e `tradutor_unico()` | `integrations/censo_do_barramento.py` + testes novos | os campos novos com fixture sintética; nenhum consumidor ainda |
| **1** (paralelo, 3) | **B1 — o falso positivo** | PORTA-03 e PORTA-04: a cura do que já mente na tela hoje | `integrations/mesa_de_radio.py`, `app/actions/config/secao_exame.py` | o exame verde nesta bancada, pelo motivo certo |
| | **B2 — a controladora e as órfãs** | PORTA-07: coluna de controladora, linha de resumo do hub em comum, e a **saída das duas entradas de `_SEM_CAMINHO_HOJE`** | `app/actions/config/secao_mesa.py`, `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | `hub_em_comum` e `filhos_de` com chamador em produção |
| | **B3 — cabo ou antena** | PORTA-09: separar "de cabo" de "sem fio" nas opções da coluna "O que é" | `utils/maquina.py` (esquema da declaração de rádio) | o vocabulário que PORTA-03 consome |
| **2** (paralelo, 2) | **C1 — o conselho** | PORTA-05 e PORTA-06: a linha nova do exame e o excesso de corrente | `integrations/exame_da_mesa.py` | as duas linhas, com o teste que É o incidente |
| | **C2 — o alcance** | PORTA-08: lê `panel`/`lid`, e só pergunta onde eles não respondem | `app/actions/config/secao_mesa.py` (depois de B2), `utils/maquina.py` (depois de B3) | a pergunta que desarma três ações cegas |
| **3** (série) | **D1 — o fotógrafo** | `scripts/gui-captura/retratar_abas.py` nas onze abas, antes e depois | `docs/usage/assets/` | as fotos para o olho dela |
| | **D2 — os portões** | roda a lista de aceite inteira (§9) e conserta só o que ela acusar | nenhum de produto | verde, ou a lista do que falta |

> **ORDEM CONTRA A LEVA QUE ESTÁ RODANDO.** A
> [CONFIGURACOES-FECHA-01](2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md)
> **está em execução agora** e escreve `utils/maquina.py`,
> `app/actions/config/secao_mesa.py`, `app/actions/config/secao_controles.py`,
> `app/widgets/external_card.py` e — pela frente E, que varre
> `app/actions/config/*.py` — também `secao_exame.py`. O território exclusivo
> desta leva **não é exclusivo enquanto aquela não fechar**.
>
> - **Podem correr já** (arquivo que só esta leva toca): **A1**
>   (`censo_do_barramento.py`), **C1** (`exame_da_mesa.py`) e a metade de **B1**
>   que é PORTA-03 (`mesa_de_radio.py`).
> - **Esperam a `CONFIGURACOES-FECHA-01` fechar**: a metade de **B1** que é
>   PORTA-04 (`secao_exame.py`), **B2** (`secao_mesa.py`), **B3**
>   (`utils/maquina.py`) e **C2** (`secao_mesa.py` + `utils/maquina.py`).
>
> Quem abrir um desses cinco arquivos antes disso vai reescrever por cima de
> trabalho em curso, e o conflito aparece no merge, não no teste.

**Regras de trânsito.** B2 e C2 tocam `secao_mesa.py`: C2 só entra depois de B2
fechar. B3 e C2 tocam `utils/maquina.py`: mesma regra. C1 depende de A1 (usa
`portas_livres()` e `tradutor_unico()`). **D1 é sempre a última antes de D2** —
`tests/unit/test_as_fotos_acompanham_a_versao.py` compara topologia de commits:
o commit que toca `app/` ou `gui/` tem de ser ancestral do que toca
`docs/usage/assets`.

---

## 5. AS TAREFAS

Custo em linhas é estimativa de desenho; tempo é de agente, não de pessoa.

### PORTA-01 — o censo lê a porta, não só o aparelho
**Onde:** `src/hefesto_dualsense4unix/integrations/censo_do_barramento.py`,
ao lado de `_ler_um` (`:422`) e `_montar` (`:477`).
**Conserto:** ler os nós `usbN-portM`: `state`, `peer`, `connect_type`,
`physical_location/{panel,lid}` e `maxchild` do hub. Expor
`portas_livres(censo)`, e **o "não sei" é por campo, nunca por nó**:

- `peer` presente: livre só se **ela e o `peer` dela** estão `not attached`;
- **`peer` ausente com `state` presente é fato POSITIVO** — porta sem gêmea
  3.0, livre se `state == not attached`. Medido: 7 das 10 portas de `usb1` não
  têm `peer`, e as 22 têm `state`. Tratar essa ausência como "não sei" mataria
  o conselho na maioria das portas 2.0, que é onde ele serve;
- só quando **`state` também falta** a porta vira "não sei".

**A mordida:** fixture com `usb4-port1` em `not attached` e `usb3-port1` em
`configured` — **não** é porta livre; arrancar o `and peer` faz reprovar.
Segunda: fixture com `state = not attached` e **sem** `peer` **é** porta livre,
e nomeia o painel se `physical_location` responder; devolvê-la como "não sei"
faz reprovar. Terceira: fixture sem `state` devolve "não sei", nunca lista
vazia. Quarta: fixture sem `physical_location` devolve porta livre **sem**
painel — a ausência tira o *onde*, não a porta.
**Custo:** ~180 linhas de produto, ~230 de teste. Meia sessão.
**Classe de tela:** não toca a tela.

### PORTA-02 — o censo lê o tradutor do hub
**Onde:** o mesmo arquivo.
**Conserto:** ler `bDeviceProtocol` do hub e expor `tradutor_unico(censo, no)`.
`01` é TT único, `02` é multi-TT, `00` é hub 1.1.
**A mordida:** fixture com `02` e três full-speed abaixo devolve falso; com
`01` e os mesmos três, verdadeiro. Fixture com o campo ausente devolve `None`,
e `None` não é falso.
**Custo:** ~50 de produto, ~80 de teste. Duas horas.
**Classe de tela:** não toca a tela.

### PORTA-03 — o par só conta se os dois lados irradiarem
**Onde:** `src/hefesto_dualsense4unix/integrations/mesa_de_radio.py`,
`vizinhancas_apertadas` (o `continue` de `busnum`, e o filtro que falta).
**Conserto:** três coisas, e a ordem importa.

**(a) Um lado só entra no par se irradia:** adaptador Bluetooth (`e0/01/01`),
OU declarado por ela como sem fio (PORTA-09), OU `speed >= 5000` (ruído de
banda larga do USB 3.x, que é regra física e independe de antena).

**(b) O corte por `busnum` deixa de ser recusa cega:** dois nós em `busnum`
diferentes que apontam para o mesmo buraco por `peer` **são o mesmo lugar**, e
é assim que o Wi-Fi em `4-1.1` volta a ser comparável com os dongles em
`3-1.1`.

**(c) A janela deixa de ser "vizinho imediato" e passa a ser "mesmo hub"** —
mesmo pai imediato, com `peer` costurando as duas metades. **Sem isto a leva
não fecha o incidente que a gerou:** `1-4` (Bluetooth) e `1-6` (receptor
2,4 GHz) diferem por 2, `_portas_vizinhas` exige 1, e o arranjo que o
`GUIA-RADIO-DA-SALA.md` proíbe em dois lugares continuaria invisível na bancada
dela depois da leva inteira.

**O preço, na mesa:** a janela larga gera mais pares. Duas coisas o pagam. O
filtro (a) já matou o falso positivo medido — o par é teclado de cabo × dongle,
e ele morre por (a), não pela janela. E **dois adaptadores Bluetooth entre si
NÃO formam par**: o guia da própria casa manda comprar três e pô-los no mesmo
hub, o medidor de rádio já responde por eles, e o produto não avisa contra o
hardware que ele recomenda (§6, item 6). O par nasce entre um adaptador
Bluetooth e um rádio **não-Bluetooth**. Nesta bancada isso dá exatamente **um**
par — o do incidente.
**A mordida:** fixture com teclado de cabo colado a um dongle — o exame tem de
ficar **verde**. Hoje fica laranja: **o teste nasce reprovando**, e é assim que
se sabe que ele morde. Segunda: fixture com Wi-Fi 3.0 em `4-1.1.1` e dongle em
`3-1.1.4` sob o mesmo hub físico — o par **aparece**; arrancar a leitura de
`peer` faz sumir. Terceira, e é o incidente: fixture com Bluetooth em `1-4` e
receptor 2,4 GHz em `1-6` — o par **aparece**; devolver a janela para
`abs(...) == 1` faz sumir. Quarta: fixture com os três dongles no mesmo hub
fica **verde** — o arranjo que o guia manda comprar não vira aviso.
**Custo:** ~120 de produto, ~260 de teste. Uma sessão.
**Classe de tela:** **estrutural** — muda o que se vê ao abrir (laranja vira
verde nesta bancada).

### PORTA-04 — a dica do exame para de afirmar o que não mediu
**Onde:** `secao_exame.py`, o dicionário `DICAS_DAS_LINHAS` (`:146`).
**São DOIS fatos errados, não um.**

1. `vizinhanca_das_portas` (`:159`): *"Há um Wi-Fi USB 3.0 na porta ao lado de
   um adaptador Bluetooth."* Dica **fixa** — aparece em toda máquina, sempre —
   e nesta bancada o vizinho do dongle é um teclado de cabo. A linha de baixo
   diz "1 par" e a de cima nomeia um aparelho que não está ali.
2. `energia_das_portas` (`:151`): *"Nenhuma porta está entregando menos
   corrente do que o aparelho pede."* **A dica afirma corrente; a função mede
   sono** — `exame_da_mesa.py:192-243` lê `power/control == "auto"`, que é
   autosuspend. Nenhuma corrente é lida nessa linha.

**Fato errado se substitui, em todos os lugares** — não ganha nota datada.
**Conserto:** cada dica passa a descrever o que a **função daquela chave** mede.
`vizinhanca_das_portas` vira "aparelho encaixado na porta colada à de um rádio";
`energia_das_portas` vira "porta autorizada a dormir para poupar energia, e o
que estiver nela cai sem aviso". O **caso concreto** vem do resultado da rodada,
que `_dica_do_item` (`:196`) já cola embaixo do texto fixo.
**A mordida — e o portão mudou de forma.** Portão por padrão de texto ("não
nomear aparelho") **não pega a segunda**: ela não nomeia aparelho nenhum. O
portão passa a ser **comparação por chave**: para cada chave de
`DICAS_DAS_LINHAS`, a dica tem de descrever o que a função homônima de
`exame_da_mesa` mede — o vocabulário da dica (corrente, sono, pareamento,
vizinhança) tem de bater com os campos que a função lê. O portão reprova as
duas linhas de hoje.
**Custo:** ~25 de produto, ~110 de teste. Duas horas.
**Classe de tela:** **estrutural** (texto reescrito), mas é substituição de
fato errado, que a casa manda fazer.

### PORTA-05 — a linha `caminho_ate_o_radio`
**Onde:** `src/hefesto_dualsense4unix/integrations/exame_da_mesa.py` (item
novo) e `secao_exame.py:295` (a lista de linhas).
**Conserto:** uma linha nova de exame que junta dois conselhos:

- **o caminho de 480 Mb/s está dividido** — existe adaptador Bluetooth em
  `busnum B`, o barramento raiz de `B` tem `speed == 480`, e existe outro
  aparelho em `B` cuja espécie lida é Rede / Sem fio não-BT / Imagem / Câmera /
  Armazenamento / Áudio, **ou** declarado por ela como Wi-Fi, webcam ou caixa
  de som. Frase: *"O adaptador Bluetooth e o {Wi-Fi} chegam ao computador pelo
  mesmo caminho de 480 Mb/s."*
- **os adaptadores dividem um tradutor único** — dois ou mais aparelhos com
  `speed <= 12` no mesmo hub com `tradutor_unico`. Frase: *"Os {3} adaptadores
  dividem um único tradutor dentro do hub: para o computador eles somam um
  barramento de 12 Mb/s, não três."*

**A ação só existe se `portas_livres()` disser que há buraco livre E o alcance
(PORTA-08) estiver RESPONDIDO e não for `so_a_frente`.** `None` é ausência de
resposta, não permissão: com `None` a frase aparece **sem** ação e empurra para
a pergunta. É a mesma doutrina de "campo ausente vira não sei" que esta leva
herda — aplicada também ao campo novo. E, onde `physical_location` responde, a
ação diz **onde**: *"há uma porta livre na frente"* em vez de *"troque de
porta"*, que é meio conselho. E se ela ainda não declarou o que é o aparelho, a linha não o nomeia:
vira empurrão para a declaração — *"um aparelho que o Hefesto não reconheceu
divide o caminho; diga o que ele é na seção A mesa"* — nunca chute.
**A mordida — o teste É o incidente:** fixture com o Archer em `3-*`/480 fica
**laranja**; fixture com ele em `4-*`/5000 fica **verde**. Trocar `busnum` por
`controlador_pci` faz a segunda reprovar, porque nas duas fixtures o PCI é o
mesmo (§2.4). Terceira mordida: fixture sem porta livre nenhuma faz a linha
nascer **sem** ação. Quarta: fixture com porta livre e `alcance = None` também
nasce **sem** ação — trocar a condição para "não disser que não" faz reprovar.
**Custo:** ~220 de produto, ~320 de teste. Uma sessão e meia.
**Classe de tela:** **estrutural** — linha nova, texto novo.

### PORTA-06 — a porta que já reclamou de corrente
**Onde:** `integrations/exame_da_mesa.py`, dentro da linha
`energia_das_portas` (`:192-243`) — **não** em `vizinhanca_das_portas`.
**Por que nesta linha:** `over_current_count` é corrente de verdade, e é aqui
que a pessoa procura corrente. Pendurá-lo na vizinhança produziria a tela
exatamente errada — *a linha que promete corrente medindo sono, e a linha de
vizinhança reportando corrente* —, que é a amplificação do defeito que PORTA-04
existe para matar. O custo de pixel é zero nas duas, então não há troca a fazer:
a linha certa é de graça. Com esta tarefa, a linha passa a medir sono **e**
corrente, e a dica de PORTA-04 pode dizer as duas coisas com verdade.
**Conserto:** `Energia.excesso_de_corrente` (`port/over_current_count`) maior
que zero em porta com aparelho vira laranja: *"A porta em que {o adaptador}
está encaixado já reclamou de corrente {N} vez(es) desde que o computador
ligou."* Ação: *"Se ele está num hub, ligue a fonte do hub; ou encaixe o
adaptador direto no computador."*
**Por que isto e não "o hub tem fonte?":** duas medições independentes já
derrubaram as duas fontes candidatas — os três TP-Link declaram `autoalimentado`
**e** pedem 500 mA no mesmo descritor. Nenhum descritor sabe se há fonte. Este
contador sabe quando faltou corrente, e é evento real.
**A mordida:** fixture com `over_current_count=3` fica laranja **nomeando a
porta**; zerar o campo devolve o verde. E o portão de PORTA-04 tem de aceitar a
dica só depois que ela mencionar as duas metades — sono e corrente. Fixture com o arquivo ausente fica em
silêncio, não em "não sei" — porta que não expõe o contador não é porta com
problema.
**Custo:** ~70 de produto, ~110 de teste. Três horas.
**Classe de tela:** **estrutural**.

### PORTA-07 — a controladora na tela, e as duas órfãs ganham caminho
**Onde:** `src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py` (a
tabela dos adaptadores, `:844`, e a de aparelhos, `:938`).
**Conserto, três partes:**

1. **A coluna "Onde está" ganha a controladora.** Hoje "Barramento 1" e
   "Barramento 3" aparecem na mesma escala e são **controladoras diferentes**.
   Uma palavra a mais na célula que já existe.
2. **Uma linha de resumo acima da tabela**, alimentada por
   `censo_do_barramento.hub_em_comum` — *"os três estão no mesmo hub"* — e
   estendida por `filhos_de` com **quem mais está nele**. É o que separa "três
   adaptadores num hub sobrando" de "três adaptadores num hub com webcam e HD
   externo". Quando `hub_em_comum` devolve vazio, a linha diz que estão
   espalhados, e isso também é resposta.
3. **O subcabeçalho "Outros rádios que dividem a faixa" para de mentir.**
   `radios_do_barramento` inclui todo USB que não é hub, não é adaptador BT e
   não tem VID de fabricante de controle — pen drive, webcam de cabo, teclado
   de cabo. Ou o título passa a dizer o que a lista é ("outros aparelhos no
   mesmo caminho"), ou a lista passa a ser só de quem irradia. **A escolha é
   dela**, e vai para a foto.

> **ARMADILHA REAL, e ela morde de volta.** `hub_em_comum` e `filhos_de` estão
> declaradas hoje em `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`, na
> tabela `_SEM_CAMINHO_HOJE` (`:785-...`), com a razão escrita e com o que as
> fecharia — que é literalmente esta tarefa. **No dia em que o caminho nascer,
> a entrada deixa de bater com a árvore e o portão cobra que ela seja
> APAGADA** (`test_a_lista_de_lacunas_nao_envelhece_calada`). Quem fechar
> PORTA-07 **tem de remover as duas entradas na mesma leva**, senão a suíte
> reprova por sucesso. É o teste mordendo o conserto, e é assim que ele deve
> ser.

**A mordida:** a suíte inteira, com as duas entradas removidas, tem de passar —
e, com elas removidas mas sem o chamador em `app/`, o portão
`promessa-sem-caminho` tem de reprovar. Rode as duas metades.
**Custo:** ~160 de produto, ~140 de teste, menos 2 entradas de tabela. Uma
sessão.
**Classe de tela:** **estrutural** para o resumo e para o subcabeçalho;
**cosmética, pré-aprovada** para a palavra a mais na célula "Onde está".

### PORTA-08 — o produto LÊ onde a porta está, e só pergunta o que sobra
**Onde:** `secao_mesa.py` e `utils/maquina.py` (campo em `MesaDeclarada`, ao
lado de `altura_da_antena` e `linha_de_visada`). Consome o
`physical_location/{panel,lid}` que PORTA-01 lê.
**Conserto, nesta ordem — ler primeiro, perguntar depois:**

1. **Onde `physical_location` responde, não há pergunta.** `panel` é
   literalmente frente/traseira/lateral, `lid` é literalmente *"é um laptop com
   a porta na tampa"*, e os dois respondem **em porta vazia**. Medido: `usb1`
   10/10, `usb2` 4/4.
2. **Onde não responde, aí sim a pergunta.** `alcance_das_portas:
   Literal["todas", "so_a_frente"] | None`, nascendo em `None`. Medido: a
   `0000:0c:00.3` desta mesma máquina não expõe nada (0 de 8) — **a leitura é
   parcial por construção, e a pergunta não morre, só encolhe.** Nenhum campo
   do sysfs sabe se a traseira do gabinete está contra a parede.

**A ação de trocar de porta exige alcance RESPONDIDO** — pela leitura ou pela
pergunta. `None` não é "pode": é ausência de resposta, e com ele a linha nasce
sem ação, empurrando para a pergunta. A proteção que se alegava — *"num laptop
quase sempre não há portas livres"* — **não está medida e é provavelmente
falsa**: laptop com três USB e um dongle tem duas livres. Sem isto, num laptop
recém-instalado o produto mandaria trocar de porta sem saber nada.
**A mordida:** com `panel=front` lido, a pergunta **não aparece** na tela, e a
ação de PORTA-05 nomeia a frente; arrancar a leitura faz a pergunta voltar. Com
`physical_location` ausente e `alcance = None`, a ação **não nasce** — trocar a
condição para "não disser que não" faz reprovar. Com `alcance = "so_a_frente"`,
os dois conselhos de PORTA-05 nascem **sem** ação.
**Custo:** ~110 de produto, ~160 de teste. Meia sessão.
**Classe de tela:** **estrutural**, e é a única que custa altura: **+44 px**
(medido pelo passo das duas perguntas que já existem — 37 px de tela ~ 44 px na
foto de 1920).

### PORTA-09 — cabo não é antena
**Onde:** `utils/maquina.py` (as opções de `RadioDeclarado`) e `secao_mesa.py`
(a coluna "O que é").
**Conserto:** a coluna hoje pergunta a **espécie** — e "Teclado" não responde se
o aparelho irradia. Medido: `1-6` é um *"2.4G Wireless Receiver"* e `3-1.1.3` é
um *"Gaming Keyboard"* de cabo, **e os dois são classe `03`**. O kernel
classifica pelo que o aparelho *faz*, não pelo que ele *tem*. Não existe campo,
e por isso é pergunta legítima. As opções passam a separar "de cabo" de "sem
fio".
**A mordida:** um aparelho declarado "de cabo" não entra em nenhum par de
PORTA-03, mesmo colado a um dongle. Arrancar a leitura da declaração faz o par
voltar.
**Custo:** ~80 de produto, ~110 de teste. Meia sessão.
**Classe de tela:** **estrutural** — texto de opção reescrito.

### PORTA-10 — a medição que só a bancada dela faz
**Não é código.** Com a mesa cheia montada: A/B de reports por segundo, três
dongles no hub × dois no hub e um direto numa porta da máquina, cinco controles
e microfone ligado. A referência de comparação é a do
[GUIA-RADIO-DA-SALA.md](../../../GUIA-RADIO-DA-SALA.md) §8: *"se cair muito
abaixo dos ~170 Hz que a medição de referência registra com mic ligado, o
piconet daquele adaptador está cheio"*.
**Por que importa mais do que parece:** o guia compra três dongles para somar
4.800 slots/s e os põe **todos no mesmo hub**. A conta de slots do rádio está
certa; o caminho USB até eles tem um funil de 12 Mb/s que o guia não considerou
(§2.2, fato 2). **Este número pode corrigir o `GUIA-RADIO-DA-SALA.md`** — e,
se corrigir, corrige por medição, com nota datada.
**A mordida:** não há. É medição, e o resultado é o que for.
**Custo:** ~40 minutos com o controle na mão. Dela.

---

## 6. O que o Bluetooth bloqueia — o que a tela NÃO pode afirmar

O eixo USB e o eixo Bluetooth respondem perguntas diferentes, e juntá-los numa
barra só destruiria a procedência que a casa gastou um cabeçalho inteiro para
proteger.

| eixo | pergunta | denominador | selo |
|---|---|---|---|
| `integrations/radio_da_mesa.py` | quantas fatias do rádio **daquele adaptador** já estão comprometidas | 1.600 slots/s, da especificação | `derivado da especificação` |
| esta leva | qual caminho físico este adaptador atravessa até a CPU, e com quem o divide | leitura de `/sys` | `(lido)` |

**A fronteira, em uma frase: o eixo Bluetooth diz quando o rádio está cheio; o
eixo USB diz quando trocar de porta ajuda.**

O que a tela **não pode dizer** enquanto a medição não existir:

1. **Que o Wi-Fi está derrubando o Bluetooth dela.** Não medido, e insultuoso
   quando errado. A regra que impede a astrologia: **a frase cita o mecanismo
   lido, nunca o efeito.**
2. **Que o TT único está engasgando alguma coisa.** É PORTA-10. Até lá a frase
   diz o que o tradutor **é**, não o que ele **faz** com a mesa dela.
3. **Que um aparelho 3.0 caiu para uma porta 2.0.** Depende de `bos_descriptors`
   sobreviver ao rebaixamento, e isso não foi medido. Fica fora.
4. **Que a pessoa tem controles demais para os adaptadores.** O medidor de
   rádio já diz, com número e procedência; e a ação ("redistribua") o produto
   não sabe executar — o bond prende o controle ao adaptador em que nasceu.
5. **Que o hub tem ou não tem fonte externa.** Nenhum descritor sabe. Só o
   evento de PORTA-06 sabe quando faltou corrente.
6. **Que hub encadeado em hub é problema.** Medido: `3-1 -> 3-1.1` e
   `4-1 -> 4-1.1`; **todo** hub de 7 portas é dois de 4 encadeados, inclusive
   o UH700 que o guia da própria casa manda comprar. O conselho dispararia no
   hardware recomendado pelo projeto. Zero informação.
7. **"Mude para uma porta traseira."** Só onde `panel`/`lid` respondem ou a
   pergunta de PORTA-08 foi respondida — e num laptop não existe traseira. Pior: contraria o guia, que põe o hub no alto do rack
   de propósito. **Nenhum conselho desta leva manda tirar o adaptador do hub
   alto.**

E se o eixo USB adotar `urbnum` um dia, ele ganha uma barra **medida** ao lado
de uma barra **derivada** — e as duas precisam de selos diferentes, ou a
procedência se perde. `urbnum` também **exige duas amostras no tempo**, o que
colide com a regra escrita no censo (*"chamada ao entrar na aba e no botão de
reexame, nunca em tique"*). **Não entra nesta leva.** Fica registrado para
quem decidir.

---

## 7. A altura, que é o motivo de não haver seção nova

Medido: `docs/usage/assets/readme_configuracoes_inteira.png` = **1920 × 2377**,
conteúdo até ~2150 px; a janela dá **1080**. A seção "A mesa" começa em
~1000 px — só o cabeçalho e duas linhas dela ficam acima da dobra. **Seção nova
está fora de questão.**

Três encaixes no que já existe:

1. **O exame tem uma célula vazia, e ela é de graça.** `secao_exame.py:172` usa
   `COLUNAS = 2`: cinco itens dão três fileiras, e a terceira tem **uma célula
   vazia**. O sexto item custa **zero pixel**; o sétimo custaria uma fileira
   (~26 px na foto). Cabem exatamente dois conselhos, e é o limite de graça:
   `vizinhanca_das_portas` (já existe) recebe PORTA-03; `energia_das_portas`
   (já existe) recebe PORTA-06; `caminho_ate_o_radio` (nova) ocupa a célula
   vazia com PORTA-05. **Corrente vai para a linha de energia, não para a de
   vizinhança** — o motivo está em PORTA-06, e não é pixel.
2. **O detalhe vai para a dica**, que `_dica_do_item` já cola embaixo do texto
   fixo. Zero altura.
3. **O "onde" vai para a coluna "Onde está"** da seção A mesa, que já escreve
   "colado no vizinho". Uma palavra na mesma célula. Zero altura.

**Custo total: 0 px**, mais **+44 px** se PORTA-08 entrar.

---

## 8. A PROVA DE UNIVERSALIDADE

*"Quero que funcione pra mim obviamente, mas pra qualquer outra pessoa, com
qualquer outro adaptador, outros hubs, outros Linux, outros kernel."*

**A regra única que carrega a tabela inteira: campo ausente vira "não sei", e
conselho sem campo não nasce.** Já é a doutrina dos dois módulos de integração
— esta leva a herda, não a inventa.

| cenário | PORTA-05 (caminho) | portas livres | PORTA-03 (coladas) | PORTA-06 (corrente) | tradutor único |
|---|---|---|---|---|---|
| **uma controladora só** | funciona: a régua é `busnum`, e uma controladora publica **dois** barramentos (medido: `02:00.0` dá `usb1` 480 + `usb2` 10000) | funciona | funciona | funciona | funciona |
| **nenhum hub** | funciona | funciona: a raiz tem `usbN-portM` | funciona | funciona: a raiz tem o contador | **cala** — e calar é a resposta certa |
| **laptop, portas soldadas** | a frase dispara; a **ação** só nasce com o alcance RESPONDIDO — por `lid` lido ou pela pergunta. `None` = sem ação | as livres são contadas normalmente. *"Num laptop quase sempre não há porta livre"* NÃO está medido e é provavelmente falso: três USB e um dongle dão duas livres — por isso a trava é o alcance, nunca a contagem | idem | continua útil: a ação é "tire o hub", não "troque de porta" | continua útil |
| **USB4 / Thunderbolt** | **NÃO VERIFICADO.** Um dock expõe um xHCI inteiro por PCIe e `busnum`/`speed` devem seguir valendo. Default seguro: `speed` de raiz fora de 480/5000/10000 não afirma nada | idem | idem | idem | o hub interno do dock pode ser multi-TT; a leitura não muda |
| **kernel antigo sem o campo** | `speed` e `busnum` são antigos: seguro | **é o risco desta leva.** Quem manda é `state`: presente, a porta responde mesmo **sem** `peer` (medido: 7 das 10 de `usb1`). Só sem `state` vira "não sei", e aí PORTA-05 nasce **sem ação** | `devpath` é antigo: seguro | `over_current_count` é mais novo; ausente, a linha cala | `bDeviceProtocol` é descritor: existe sempre |
| **Flatpak / contêiner sem `/sys`** | tudo cala; `ESTADO_NAO_SEI` já cobre | idem | idem | idem | idem |
| **zero adaptador Bluetooth** | cala | cala | cala | cala | cala |
| **`physical_location/` ausente** | a frase não nomeia painel e a ação perde o **onde**; PORTA-08 volta a ser pergunta, e sem resposta a ação não nasce. **Medido: acontece dentro desta casa** — a `0c:00.3` não expõe nada | inalterado: quem responde por porta livre é `state` | o palpite de adjacência continua declarado como palpite | — | — |

Duas provas concretas que o aceite cobra:

- **nenhum teste desta leva lê `/sys` da máquina em que roda.** Bancada
  sintética, sempre. Motivo medido: entre a manhã e a noite de 23/08 os nós
  desta casa mudaram de `3-3` para `3-1`, e um dongle mudou de controladora.
  Teste amarrado à mesa dela envelhece em horas.
- **nenhum conselho casa por texto de `product`.** Medido nesta bancada: o
  `product` do `3-1.2` chega corrompido como `'TP-(UBk UB500 Adapter'`. É a
  prova viva da recusa a heurística por nome que o censo já declara.

---

## 9. O ACEITE

```bash
git add -A                                  # os portões não veem arquivo novo
.venv/bin/python -m pytest -q
.venv/bin/ruff check src/ tests/
python3 scripts/validar-acentuacao.py --all
python3 scripts/validar-glifos.py --all
python3 scripts/validar-referencias-docs.py --all
bash scripts/check_anonymity.sh
.venv/bin/python scripts/check_version_consistency.py
bash scripts/check_packaging_parity.sh
bash scripts/check_test_data.sh
.venv/bin/mypy src/hefesto_dualsense4unix
```

E o que é específico desta leva:

```bash
# 1. as duas órfãs ganharam caminho e SAÍRAM da tabela de dívida
.venv/bin/python -m pytest tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py -q
grep -c "hub_em_comum\|filhos_de" tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py

# 2. cada dica fixa descreve o que a função daquela chave mede (PORTA-04)
.venv/bin/python -m pytest tests/unit/ -q -k dicas_das_linhas

# 3. o exame desta bancada fica verde, e pelo motivo certo
.venv/bin/python -c 'from hefesto_dualsense4unix.integrations import exame_da_mesa as e; \
    print(e.vizinhanca_das_portas())'

# 4. as fotos das onze abas acompanham a versão
scripts/gui-captura/retratar_abas.py
```

**Verde não basta.** O aceite tem quatro itens que não são comando:

1. **Cada mordida foi arrancada e vista reprovar.** Um teste que passa com a
   cura arrancada não testa nada. As de PORTA-03 e PORTA-04 **nascem
   reprovando** contra o código de hoje: se passarem de primeira, estão erradas.
2. **A foto antes e depois das onze abas**, e a palavra final é dela
   (PROVA-DE-TELA-01). Quase tudo aqui é **estrutural**.
3. **Nenhuma linha nova afirma efeito.** Leia as frases uma a uma procurando um
   verbo de causa. Se achar, corrija.
4. **Nenhum teste lê o `/sys` da máquina.** `grep -rn "/sys/bus/usb" tests/`
   só pode achar caminho de fixture.

---

## 10. O QUE FICA ABERTO, E DE QUEM É

**Dela:**

- **PORTA-10** — a medição do TT único com a mesa cheia. É a única que pode
  corrigir o `GUIA-RADIO-DA-SALA.md`, e só a bancada dela a faz.
- **A escolha de PORTA-07 item 3** — o subcabeçalho "Outros rádios que dividem
  a faixa" muda de título, ou a lista muda de conteúdo? As duas são defensáveis
  e a tela é dela.
- **O olho nas onze fotos.**

**De quem executar, e que esta leva NÃO fecha:**

- **`urbnum`** — medição real, legível sem root, e exige duas amostras no
  tempo, o que colide com a regra de "nunca em tique" do censo. Decisão de
  desenho, com preço na mesa.
- **`physical_location/{horizontal,vertical}_position` e `removable`** —
  `panel` e `lid` entram nesta leva (PORTA-01 lê, PORTA-08 consome); os dois
  eixos de posição e o `removable` ficam lidos e não usados. Transformariam o
  palpite de adjacência em leitura **onde a ACPI responde** — medido: 14 de 14
  portas da `02:00.0`, 0 de 8 da `0c:00.3`.
- **O teto de ruído da janela "mesmo hub"** (PORTA-03, parte c) só está medido
  nesta bancada, onde dá **um** par. Em mesa com muitos rádios não-Bluetooth
  num hub só, a linha pode ficar falante. Se ficar, o corte é por contagem, e
  a medição vem antes da regra.
- **`chassis_type` do DMI** — **NÃO VERIFICADO**. Se responder, "é um laptop?"
  deixa de ser pergunta e vira leitura.
- **`bos_descriptors` num aparelho 3.0 rebaixado** — sem essa medição, o
  conselho "seu 3.0 está numa porta 2.0" é chute com cara de leitura.
- **A ordem contra a `CONFIGURACOES-FECHA-01`** (§4). Cinco arquivos são
  compartilhados com uma leva em execução; quatro dos oito agentes esperam.
- **`scripts/medir_w3_coex.sh:46`** — `HCI=hci0` cravado. É instrumento, não
  produto, e numa mesa de três ele mede o adaptador errado em dois terços dos
  casos. Já aberto em
  [N-IGUAL-A-UM-01](2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md);
  registrado aqui só para não sumir.
- **Os docstrings do censo citam nós que não existem mais** (`1-3`, `3-3`,
  `3-3.1.1`, `4-3`). Estão **datados de 22/08/2026**, então pela regra da casa
  **não se apagam** — são medição, não fato errado. O que esta leva acrescenta
  é o aviso: exemplo de bancada desta família envelhece em **horas**, e a
  entrada de `_SEM_CAMINHO_HOJE` que cita `usb3/3-3` foi medida na manhã de
  23/08 e já era `usb3/3-1` à noite.

**O que continua NÃO VERIFICADO e ninguém deve repassar como fato:** que o
Wi-Fi no mesmo barramento causou as quedas dela; que o TT único limita a mesa
dela; que `state`/`peer` existem em kernel antigo; e que a regra "mesmo número
de porta = mesmo buraco" vale em alguma máquina — **nesta ela erra em uma das
duas controladoras**, e `port/peer` é a resposta certa.
