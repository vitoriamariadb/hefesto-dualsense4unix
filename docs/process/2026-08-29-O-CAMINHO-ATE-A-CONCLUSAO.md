# O CAMINHO ATÉ A CONCLUSÃO — 29/08/2026

**Este documento existe porque ela pediu, e o pedido tem duas metades:**

> *"materializar tudo em sprints.md mesmo da migração de interface e próximas
> etapas também até a conclusão do projeto como um todo (...) sinto que nada tá
> dentro do chrono imaginado."*

A primeira metade é disco: uma conversa acaba, um arquivo fica. A segunda é uma
**queixa de prazo**, e ela tem uma seção inteira aqui (§3) — não uma nota de
rodapé.

**Para quem chega agora e não leu nada:** leia a §1 e a §3. Elas cabem em cinco
minutos e dizem onde o projeto está e por que a fila parece maior do que é. O
resto é referência.

**O que este documento NÃO é:** ele não detalha a migração da interface. Essa
fila está sendo escrita em `docs/process/sprints/2026-08-29-MIGRA-*` por outra
leva; aqui ela aparece **como uma etapa entre as outras**, posicionada e com as
suas dependências (§2, Etapa 3).

**Método.** Cada número abaixo foi medido hoje, contra o disco, contra o
`git`, contra o journal dela ou contra a própria máquina — e o comando está
junto. Onde não consegui medir, está escrito **NÃO MEDIDO**, com o que faltaria
para saber. Prazo inventado é pior que prazo nenhum.

---

## 1. ONDE O PROJETO ESTÁ — cinco linhas

1. **O produto funciona e ela usa todo dia.** Versão `0.9.4.5`
   (`pyproject.toml:7`), daemon vivo, quatro DualSense no registro dela, perfis,
   gatilhos, luz, vibração, co-op, Steam Input, empacotamento em sete formatos —
   os sete conferidos por portão verde hoje
   (`scripts/check_packaging_parity.sh` → *"PAR doctor+bluez conferido em 7 de 7
   empacotadores"*, `rc=0`).
2. **O que não funciona tem nome e endereço, e três coisas doem de verdade:** o
   detector de janela cega com jogo aberto (**244 episódios em 7 dias, 57 hoje**
   — `journalctl --user -u hefesto-dualsense4unix --since '7 days ago' | grep -c
   x11_focus_gate_no_x_focus`), o co-op desmonta quando um controle cai, e a
   máscara ainda é da mesa e não de cada controle (`daemon/subsystems/coop.py:972` passa
   uma máscara global), o que contradiz o contrato que ela mesma chamou de central
   (`D-O-CONTROLE-CARREGA-A-SUA-SETTING`).
3. **A fila diz 120 sprints abertas em seis faixas e a árvore diz ~106.**
   Medido: `SPRINT_ORDER.md` §4 tem **120 linhas, 79 marcadas DELA (66%)**; seis
   leitores abriram as 120 contra o disco e acharam **14 linhas que já estão
   feitas** e mais sete que encolheram para uma entrega só (§2, Etapa 0).
4. **A interface está em obra, e a tecnologia foi decidida ontem:** o mockup HTML
   roda num `WebKit2.WebView` dentro da janela GTK3
   (`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`). A aba Controles é
   o piloto e **espera o ok dela** para as outras nove andarem.
5. **O que trava a próxima versão não é código — é a mesa dela.** A 0.9.5 é *"o
   rádio para de mentir"* (`D-ESCADA-DE-RELEASES`, 24/08), e ela se mede na
   bancada: **o CHECKLIST de hardware tem 31 caixas, 0 marcadas, e o arquivo não
   é tocado desde 25/07 — 35 dias**; o último ensaio com o olho dela é de
   **16/08, há 13 dias** (`docs/data/ensaios.csv`, coluna `observado_por`).

---

## 2. AS ETAPAS, em ordem

### 2.0 A chave de leitura: são TRÊS trilhas, e elas correm em paralelo

Esta é a coisa mais importante deste documento, e ela muda a resposta a *"quanto
falta"*.

O trabalho que sobra **não é uma fila**. São três trilhas que não disputam
recurso nenhum entre si, e por isso **o calendário é o da trilha mais longa, não
a soma das três**:

| Trilha | Quem move | O que é | Quanto pesa hoje |
|---|---|---|---|
| **A — a mesa** | **só ela** | bancada, controle na mão, olho na tela, palavra de vocabulário | **79 das 120 linhas** da §4, e **97 das 139 filhas** estão na Faixa 5 |
| **B — a tela** | agente | o transplante das dez abas para o WebView | a outra leva; a execução espera o ok dela sobre o piloto |
| **C — o motor** | agente | daemon, co-op, máscara, rádio, install, portões — **nada disso toca um pixel** | ~41 linhas da §4 que não são dela |

**As trilhas B e C colidem em ARQUIVO, e o portão desta casa já conta a colisão.**
Rodado hoje, `bash scripts/portoes.sh --rapido` dá **20 verdes e 1 vermelho**, e
o vermelho é o `colisao-de-sprints`: **304 colisões de posse não declarada**, das
quais **166 no `gui/main.glade`** e **104 no `app/app.py`**. São exatamente os
dois arquivos que a migração vai substituir.

**A consequência prática, e ela é uma regra de ordem:** *toda sprint que escreve
GTK à mão no `main.glade` agora é trabalho com prazo de validade.* A parte de
**daemon** dessas sprints continua; a parte de **tela** espera o transplante.

**A trilha A não anda há 13 dias**, e nenhum agente a move. É essa, e não a
contagem da fila, a resposta honesta para a sensação de atraso (§3).

---

### Etapa 0 — A faxina da fila

**O que fecha.** A fila passa a dizer o que a árvore diz. **Catorze linhas saem
sem um minuto de trabalho** e sete encolhem para uma entrega só. A §4 vai de 120
para ~106.

As catorze, com a prova de cada uma (medida pelos seis leitores, contra o disco):

| Sai | Por quê |
|---|---|
| `MASCARA-QUE-GRUDA-01` | o próprio documento diz **`Estado: FECHADA em 23/08/2026`** na linha 7 — conferido hoje |
| `JOGO-01` | o documento diz que o único resto *"passou a ser rastreado em CONTAGEM-E-COOP-01"*, onde é a E3. Uma sprint, duas linhas |
| `CONECTA-E-DESLIGA-01` | a causa foi isolada em 07/08 e a cura mora na `BUSCA-QUE-ESTOURA-01`, **na Faixa 5**. A mesma cura contada em duas faixas |
| `A-FÁBRICA-COM-UM-CLIENTE-01` | ENTREGUE INTEIRA em 26/08, commit `cba9c7b0` (`daemon/lifecycle.py:1232-1237`) |
| `JANELA-CEGA-01` | a única pendência que a fila lhe atribui entrou em 28/07 (`daemon/subsystems/autoswitch.py:186-192`, commit `3f3fb888`) — **na mesma leva que a declarou fora de escopo** |
| `BT-SNAPSHOT-SANDBOX-01` | o portão pedido entrou em 22/08 e passa (`tests/unit/test_bt_sandbox_cobre_o_que_os_ganchos_escrevem.py`) |
| `IDENTIDADE-01` | Fases 1, 2 e 3 executadas em 25/08; 19 testes passam. As 9 ocorrências restantes do nome velho **são a migração**, não resíduo |
| `BT-AGENT-TRAVA-O-RESTART-01` | E4/E5/E6 fechadas; a E7 que sobra é, **por escrito na própria sprint**, a E1/E2/E3 da `CURA-QUE-FERE-01` |
| `GATILHO-PALAVRA-01` | os 19 rótulos do produto batem com os 19 do mockup aprovado; os dois que divergiam ela decidiu em 29/08 (`D-ARCO-DE-FLECHA-SEM-O-INGLES`) |
| `JANELA-CORTADA-01` | itens 1 e 3 curados com portão que morde; o item 2 é a aba Status, que **deixa de existir** no redesenho |
| `UMA-FAIXA-NÃO-É-UM-FABRICANTE-01` | E2, E3 e E4 no disco desde 22/08 (commits `146b4084` e `6ef3e71f`) |
| `E5 — O TERRENO` | a §9 e a §10 são texto duplicado dentro da `A-CADEIA-DE-BLOCOS-01`, que se declara sucessora por escrito |
| `O QUE PRECISA DE VOCÊ (19/08)` | quatro dos sete itens estão marcados DECIDIDO no próprio arquivo; dois são ponteiro para a `PROVA-NO-PLASTICO-01`. Sobra **um** gesto de 3 minutos |
| `GATE-EMOJI-01` | medido **na máquina dela** hoje, com mordida: os 368 glifos protegidos sobrevivem ao `--fix`, os dois proibidos saem, e o hook global honra o código de saída |

**De que depende.** De nada. É edição de texto no `SPRINT_ORDER.md` §4 mais uma
nota datada no cabeçalho de cada sprint corrigida.

**O que é dela.** Nada.

**Custo.** **MEDIDO na forma, não no relógio:** são catorze linhas de tabela e
~dez notas datadas. É o mesmo gesto que já foi feito na faxina de 27/08. Não
cronometrei.

> **Por que isto é a Etapa 0 e não uma tarefa de limpeza:** a fila é o que faz
> ela sentir o tamanho do projeto. Catorze linhas que cobram trabalho já feito
> não custam trabalho — custam **crença de que há mais trabalho do que há**. É
> literalmente a queixa da §3.

---

### Etapa 1 — A régua da 0.9.5 nasce

**O que fecha.** A versão que dá nome ao próximo lançamento passa a ter um
comando que sai zero. Hoje **não tem**.

A escada de releases (`2026-08-24-A-ESCADA-DE-RELEASES.md:78-127`, decisão dela)
define a 0.9.5 como *"o rádio para de mentir"* e manda nascer
`scripts/check_bancada_de_bt.py` — **e conferido hoje, ele não existe.** <!-- ref-externa: o script não existe ainda; fazê-lo nascer É esta etapa -->
As quatro contagens que ele leria estão assim:

| régua | o que conta | a escada publicou (24/08) | medido hoje |
|---|---|---|---|
| **R1** | célula de rádio que admite não acionar e não nomeia a culpa | 22 | **19** (estrito) **ou 38** (contando `parcial`) — a régua é ambígua |
| **R2** | célula que afirma `sim` no rádio sem `medido` | 30 | **30** — idêntico, cinco dias parado |
| **R3** | perguntas de rádio dela sem `medido` + degrau | 6 de 7 | **não mensurável**: a escada aponta para `SPRINT_ORDER.md §0.7`, e essa seção **não existe mais** (o §0 hoje vai de 0.1 a 0.4; as perguntas foram para o §2.1) |
| **R4** | ensaio de rádio sem `degrau` | 98 de 99 | **98 de 99** — idêntico, e o caderno cresceu de 99 para 178 ensaios no período |
| **R5** | três adaptadores respondendo + ensaio com quatro DualSense no rádio | dois adaptadores, zero ensaios de quatro | **UM adaptador** — `ls /sys/class/bluetooth/` devolve só `hci0` |

Comando que reproduz R1/R2/R4 sem hardware:

```bash
python3 - <<'PY'
import csv
m=[r for r in csv.DictReader(open('docs/data/mapa-controles.csv')) if r['controle']=='dualsense']
print('R1 estrito', sum(1 for r in m if r['radio_aciona']=='não' and not r['radio_por_que_nao_aciona'].strip()))
print('R1 c/parcial', sum(1 for r in m if r['radio_aciona'] in ('não','parcial') and not r['radio_por_que_nao_aciona'].strip()))
print('R2', sum(1 for r in m if r['radio_aciona']=='sim' and r['radio_de_onde_sei']!='medido'))
e=[r for r in csv.DictReader(open('docs/data/ensaios.csv')) if r['transporte']=='radio']
print('R4', sum(1 for r in e if not r['degrau'].strip()), 'de', len(e))
PY
```

**De que depende.** De **uma frase**, dela ou de quem coordena: *`parcial` conta
como "admite não acionar" ou não?* Enquanto a régua for prosa, o portão da versão
dá três números conforme quem lê. A frase vem **antes** do script.

**O que é dela.** A frase acima e o R5, que é bancada.

**Custo.** **NÃO MEDIDO** para o script. O que sei: ele lê só dois CSV, não toca
hardware, e roda no CI — é o desenho mais barato possível para um critério de
release. Para saber o custo, bastaria escrevê-lo; ninguém tentou.

> **O que isto conserta de imediato:** duas das quatro réguas **não se moveram em
> cinco dias**, e a terceira aponta para uma seção apagada. Quem lê a escada hoje
> vê a 0.9.5 mais longe do que ela está — e ler a fila por uma régua quebrada é
> parte de por que o cronograma parece escorregar.

---

### Etapa 2 — A mesa dela

**O que fecha.** A prova. **É a etapa que destranca mais fila por minuto gasto em
todo o projeto**, e é a única que nenhum agente faz.

Três fatos medidos, e os três apontam para o mesmo lugar:

- o **CHECKLIST de validação em hardware** tem **31 caixas e 0 marcadas**, e o
  arquivo não recebe um commit desde **25/07 — 35 dias**
  (`git log -1 -- docs/process/sprints/2026-07-25-CHECKLIST-validacao-em-hardware.md`);
- o leitor da Faixa 1 mediu que **treze das 40 sprints** têm o **mesmo** critério
  de aceite — *quatro controles na mesa e um jogo aberto*. **Não são treze
  sessões de bancada: é UMA**, e o roteiro dela já está escrito, é o CHECKLIST;
- a Faixa 5 carrega **97 das 139 filhas** do projeto, e **22 das suas 31 linhas
  são dela**.

**De que depende.** De **preparação de agente**, e ela não está pronta:

- o instrumento do ensaio de som (`scripts/ensaios/corpo_do_degrau.py`, 290
  linhas) **não tem** os seis acréscimos que a `A-CADEIA-DE-BLOCOS-01` pede — um
  deles obrigatório por escrito: *recusar quando outro processo segura o hidraw,
  nomeando a Steam*. Sem ele o sensor pode estar morto e o ensaio inteiro sai
  falso. **Custo declarado pela própria sprint: 35 minutos de máquina, zero
  dela** — o único custo de agente com número em toda a Faixa 5;
- o **`PAREAMENTO-01`** é declarado pré-requisito da trilha de rádio inteira
  (`SPRINT_ORDER.md:255`) e **não tem uma linha na §4**. Sem ele, cada medição
  dela vira faxina manual em N arquivos — em 23/08 foram oito, e dois ficaram
  para trás sem portão nenhum acusar.

**O que é dela.** Tudo o que produz dado. O roteiro está na §4 deste documento,
com o preço de cada gesto.

**Custo.** **MEDIDO onde há número**, e são poucos: `PROVA-NO-PLASTICO-01` ~30
min (os 40 menos o B1, já feito), `A-PONTE-UNIVERSAL-01` Onda 4 **49 min** (39 se
o E-1 discriminar), `A-CADEIA-DE-BLOCOS-01` **6 min de olho**, `LUZ-CEGA-01/E3`
~20 min, `O-LACO-DE-ESCRITA-01` ~45 min de mesa. **NÃO MEDIDO** em quatro frentes
de bancada — `ESCADA-QUE-RESPONDE-01` (E-2 a E-6), `QUATRO-MICROFONES-01/E3`,
`CANETA-NA-MAO-01 §7` e `O-ALTO-FALANTE-POR-RADIO-01/E2`. Das 31 sprints da
Faixa 5, **treze não trazem uma única menção de tempo no documento inteiro**.

---

### Etapa 3 — O transplante da interface

**Esta etapa é da outra leva.** Aqui ela só é posicionada.

**O que fecha.** As dez abas passam a ser o mockup que ela aprovou, rodando dentro
da janela. A divergência entre desenho e produto deixa de ser possível — que foi a
razão medida da escolha, não a fidelidade: mudou-se **uma linha** do mockup e o
emissor GTK devolveu **foto byte-idêntica**, enquanto o WebKit andou o que o
Chrome andou.

**De que depende, e a ordem importa:**

1. **O ok dela sobre o piloto** (a aba Controles). Palavra dela: *"Preciso avaliar
   como ela se comporta. Depois dou o ok pra seguirmos."* **As sprints das outras
   nove se escrevem; a execução espera.**
2. **O enxerto SUBSTITUTIVO, que ainda não foi medido.** O provado foi
   **aditivo** — uma 12ª página no `Gtk.Notebook`. Ninguém mediu **trocar** uma
   página, e é aí que reaparecem as 60.862 linhas que hoje chegam aos widgets por
   `builder.get_object()`. É a primeira sprint de todas.
3. **A serialização com a trilha C.** Ver §2.0: 166 colisões no `main.glade`.

**O que é dela.** O ok sobre o piloto, e a mesa: *"o layout se adapta à medida dos
controles que eu tenho"* — ela tem **dois** e o mockup desenha quatro.

**Custo.** **MEDIDO no que foi provado:** as duas pontes custam **31 linhas, uma
vez**; a memória vai de **62 para ~285 MiB PSS** (4,6×), preço que ela aceitou; no
Flatpak, **zero byte**. **NÃO MEDIDO:** o enxerto substitutivo, que é o número que
decide o custo real do transplante.

**Onde está a fila desta etapa** (ela cresce enquanto você lê):

```bash
ls docs/process/sprints/2026-08-29-MIGRA-* | wc -l
```

**E o risco de instrumento que esta etapa cria, e que ninguém mediu ainda:** o
`retratar_abas.py` fotografa **arrancando** o `main_notebook` do `root_box` e
renderizando num `Gtk.OffscreenWindow` (`scripts/gui-captura/retratar_abas.py:1058-1060`).
Se um `WebKit2.WebView` não sai nessa foto, a `PROVA-DE-TELA-01` perde o
instrumento **com que toda aba fecha**. Custa uma execução do script contra o
enxerto aditivo que já existe. **Faça isso antes da segunda aba, não depois da
décima.**

---

### Etapa 4 — O co-op que não desmonta, e a máscara que é de cada controle

**O que fecha.** A promessa de co-op inteira, e o contrato que ela chamou de
central. Quem senta na mesa fica sentado: o Jogador 2 deixa de durar dois
segundos, a queda de um controle não derruba os outros três, e o controle azul
dela e o roxo do irmão trazem **cada um a sua máscara**, independentemente da
ordem, da porta e do transporte.

**Esta etapa não toca um pixel** — corre em paralelo com a Etapa 3.

**De que depende.**

- **Serialização, não decisão.** Doze das 40 sprints da Faixa 1 nomeiam
  `daemon/subsystems/coop.py` (1.987 linhas) e dez nomeiam
  `core/backend_pydualsense.py` (5.382 linhas). Merge concorrente aí é o mesmo
  risco do `main.glade`. **Dono único, sequencial.**
- **De UM gesto dela de dois minutos** para o último degrau da máscara: ela disse
  em 29/08 que dois vpads com máscaras diferentes *"já funcionou"*; o registro não
  existe, e o módulo ainda declara o risco como aberto
  (`daemon/subsystems/external_mask.py:71-80`). Ela remede, a lápide entra, o
  bloco anda.

**O que é dela.** Os dois minutos acima, e a bancada de aceite (Etapa 2).

**Custo.** **MEDIDO no estado, não no relógio.** A fila está desatualizada em duas
linhas: da `COOP-QUE-NÃO-DESMONTA-01`, **três das quatro entregas** entraram em
`8d84f495` (25/08) e sobra a **E3**, que é a mais cara e cujo sintoma **ela nunca
relatou**; da `BORDA-DE-QUEDA-01`, duas entregas inteiras fecharam em 26/08. O
último degrau da máscara está exatamente onde a sprint diz: `daemon/subsystems/coop.py:972` chama
`make_virtual_pad(self._flavor(), ...)` — a máscara **global** — e
`integrations/virtual_pad.py:150` não tem parâmetro `identity`. **Tempo: NÃO
MEDIDO — nenhuma das 40 sprints da Faixa 1 declara custo.**

---

### Etapa 5 — O detector cego

**O que fecha.** O perfil do jogo entra sozinho. É a queixa mais antiga dela neste
projeto — *"a config que eu deixo nunca é respeitada"* — e **é o único defeito da
fila que dá para ver acontecendo agora**.

**Quatro sprints apontam para a MESMA linha:**
`integrations/window_backends/xlib.py:319-324`, que devolve `None` e loga
`x11_focus_gate_no_x_focus` quando o compositor entrega o foco a uma superfície
Wayland nativa. `MODO-01` chama isso de B4; `JANELA-CEGA-01` é o instrumento que
o revela; `SINAL-DE-JOGO-01` é o efeito; `AUTOMATISMO-MORTO-01` é a consequência
na tela. **Consertar aba por aba pagaria quatro vezes o mesmo preço.**

**A medição de hoje, no journal dela:** 244 episódios em sete dias, **57 hoje**,
em todos os oito dias. O `profile_autoswitch` aparece 7 vezes em sete dias.

**De que depende.** De uma bancada curta e dela: abrir um jogo, alt-tab para uma
janela Wayland nativa, 90 s parada, e ver a queda no journal com `ps` ao lado. A
própria sprint **proíbe** entregar a cura antes disso, porque a transição
`daemon→unknown` repinta a lightbar dela.

**O que é dela.** Os 90 segundos acima.

**Custo.** **NÃO MEDIDO.** E há uma correção de escopo que barateia a etapa: **as
duas causas que a `AUTOMATISMO-MORTO-01` mediu em 30/07 não existem mais no disco
dela.** Medido hoje: `~/.config/hefesto-dualsense4unix/autoswitch_locked.flag`
**não existe**, e dos **29 perfis** dela, **24 têm `window_class` e ZERO são
catch-all** — nenhum perfil casa com qualquer janela. A migração que a E4 existia
para propor **já aconteceu**.
<!-- FATO CORRIGIDO, 29/08: o relatório da Faixa 2 dizia "29 têm window_class".
     Medido aqui lendo os 29 JSON: são 24 com `match.window_class` preenchido e
     nenhum catch-all. A conclusão não muda; o número, sim. --> O que bloqueia
não é mais a sprint inteira — **é o elo B4, sozinho**.

---

### Etapa 6 — O "ok" que não sabe dizer não

**O que fecha.** Quando o produto não consegue, ele diz por quê — em vez de
responder "aplicado". **Não é uma sprint: é o mesmo defeito em quatro lugares**,
e enquanto ele viver, toda outra cura é indistinguível de não ter sido feita, do
lado de quem joga:

| Onde | O que faz |
|---|---|
| `daemon/lifecycle.py:2458` e `:2515` | descartam o retorno de `set_gamepad_emulation` e devolvem `APLICADO` (`:2460,:2466,:2517`) sem olhar se o gamepad subiu |
| `ELO-MUDO-01` | mediu o mesmo em `profile.apply_draft` |
| `ESCOLHA-DELA-VENCE-01/E3` | pede a mesma cura na recusa com jogo aberto |
| `daemon/ipc_handlers.py:4674` | `mark_manual_trigger_active("audio")` **sem par de limpeza por categoria** — as irmãs têm o par completo (`"trigger"` em `:1298`, `"rumble"` em `:4302`/`:4370`). Um toque no volume congela a troca automática de perfil, e o único jeito de soltar é ela trocar de perfil à mão (`daemon/state_store.py`, linhas 331-349) |

**De que depende.** De nada, para começar. A linha do áudio é a mais barata de
toda a Faixa 1 e é o que trava o produto hoje.

**O que é dela.** Nada, exceto o aceite.

**Custo.** **PARCIALMENTE MEDIDO.** A E1 do áudio é uma linha. Três sprints desta
família têm **código entregue esperando só a palavra dela desde o começo de
agosto** — `STEAM-INPUT-01` (E1, E3, E7, E8, E9 entregues em `e96dea8` e
`c10adaf`), `WRAPPER-EM-TODOS-01` (E1, E2, E4 entregues em `108b711`) — de 21 a
35 dias de trabalho pronto atrás de uma sessão de revisão. **Tempo do que sobra:
NÃO MEDIDO.**

---

### Etapa 7 — O rádio para de derrubar jogador

**O que fecha.** O alvo dela, escrito como diretriz de PO: *cada jogo local
jogável no cabo E no rádio*.

**Diga-se com todas as letras: isto NÃO é a 0.9.5.** A escada é explícita — *"este
degrau não manda construir canal nenhum; manda parar de afirmar o que não se
mediu. Construir é o degrau seguinte."* Esta etapa é o degrau seguinte.

**O que ela contém:** `BT-SURDO-01` (o `init()` abandonado que vira escritor
fantasma; a calibração segurando o lock central durante um ioctl de 5 s),
`BT-FURO-FINO-01`, `RADIO-BOMBARDEADO-01`, `BUSCA-QUE-ESTOURA-01`,
`DOIS-CAIRAM-DE-UMA-VEZ-01`, `A-LUZ-QUE-CUROU-01`, mais o oráculo de transporte.

**O oráculo de transporte é a fundação, e ele mente hoje.** Conferido:
`core/backend_pydualsense.py:5335-5341` — `_detect_transport` devolve `"usb"`
quando `conType is None`. Um controle de rádio cuja `pydualsense` não sabe dizer o
tipo é classificado como **cabo**, e essa linha alimenta cinco leituras de
produção, inclusive o `state_full`, que é o que a tela publica. **Medir o rádio
com essa linha de pé é medir um controle que o produto às vezes acha que está no
cabo.** A régua honesta já está no repositório: o barramento do `HID_ID` (0003
cabo, 0005 rádio), que a bancada já usa em `scripts/ensaios/comum.py`.

**De que depende.** Do oráculo (código, sem ela) e da Etapa 2 para o aceite.
`N-IGUAL-A-UM-01/E3` é pré-requisito escrito do ensaio dos quatro microfones: sem
o `bt_active_mode.sh` desarmado do `| head -1` (`scripts/doctor.sh:2771` e
`:3066`), a cura fica armada no adaptador errado e contamina o resultado.

**O que é dela.** A escolha entre os cinco desenhos da `BUSCA-QUE-ESTOURA-01` —
**e essa pergunta nunca foi formalmente posta**: não há registro dela no
`DECISOES.md` nem no `decisoes-dela.csv`.

**Custo.** **NÃO MEDIDO.** Nenhuma das sete páginas traz estimativa de tempo para
o que falta; três delas não trazem uma única menção de tempo no documento inteiro.

---

### Etapa 8 — O install e o pacote

**O que fecha.** Instalar numa máquina que nunca viu este projeto entrega o mesmo
produto que ela tem, e não uma versão capenga em silêncio. É a **0.9.8** pela
escada — *"quem destrava: agente; ela não entra"*.

**Correção de fato, medida hoje.** A escada descreve a 0.9.8 dizendo que *"o
portão de empacotamento testa 1 de 7 e passa verde"*. **Isso é falso desde
24/08.** Rodado agora, `scripts/check_packaging_parity.sh` sai `rc=0` e imprime
*"PAR doctor+bluez conferido em 7 de 7 empacotadores"*. O `|| continue` que
engolia seis foi curado. **A escada lê pior que a realidade** — e a linha precisa
ser substituída, não anotada ao lado (regra da casa).

**O que sobra de verdade, medido:**

- o ciclo `uninstall` → `install --yes` num `HOME` limpo, **que nunca foi
  executado nesta bancada** — e o motivo não é sprint que falta, é **máquina que
  falta**: rodar aqui derruba o daemon e a janela que ela usa;
- `sudo bash uninstall.sh --yes` ainda roda com `HOME=/root` (`grep -n SUDO_USER
  uninstall.sh` = **zero**): limpa o `/etc`, não tira nada do HOME real dela, e
  imprime *"descontaminação concluída"*;
- `packaging/nix/package.nix:102` ainda traz `sha256 = lib.fakeSha256;` — o `nix
  run` do README **não funciona** sem edição manual, e não há `nix` nesta máquina
  para gerar o hash.

**O item de gravidade máxima desta etapa não bloqueia versão nenhuma, e mesmo
assim eu não o cortaria de release nenhum:** o produto instala **por padrão e sem
flag** um agente de pareamento `NoInputNoOutput`
(`assets/systemd/hefesto-bt-agent.service:23`), que **autoriza qualquer aparelho
que chegar**. A E1 (`JustWorksRepairing = confirm`) já entrou, mas `confirm` só
devolve ao BlueZ a decisão de **perguntar** — quem responde é o agente.

**O que é dela.** Uma decisão de produto (`INSTALL-QUE-NAO-CARREGA-01/L5`: os
presets de fábrica levam a biografia dela — o `meu_perfil.json` com a lightbar
azul dela e o LED de jogador 3) e **dois minutos de administradora**: o único
portão de anonimato server-side desta casa está **desligado desde 21/08**.
Medido hoje:

```bash
gh api repos/Hefesto-Team/hefesto-dualsense4unix/rulesets
# {"name":"main - anonymity check (desativado 21/08)", "enforcement":"disabled", ...}
```

Ele existe, exige exatamente o check certo, e está desarmado com
`bypass_actors: []` — alguém viu que sem bypass de administradora ele virava porta
trancada e o desligou. **`grep -rn ruleset docs/` não acha um único registro dessa
decisão.**

**Custo.** **NÃO MEDIDO** em horas. Medido em escopo: das 10 linhas da Faixa 3,
**três saem** (Etapa 0) e **três encolhem para uma entrega cada** — a faixa é *10
no papel, 4 cheias na árvore*.

---

### Etapa 9 — As superfícies que a migração não alcança

O applet, a bandeja, a janela compacta e a TUI. **A migração não toca nenhuma
delas.** Tem seção própria: §6.

---

### Etapa 10 — A documentação e os portões, por último

**O que fecha.** A documentação passa a descrever o produto que existe.

**Por que por último, e está escrito no `SPRINT_ORDER.md` §2.3:** *"documentação —
só depois das dez ondas; antes disso documentaria o produto de ontem."*

**A exceção que NÃO espera, porque engana ELA:** `docs/usage/troubleshooting.md`,
linhas 122-128 e 136, ensina que a janela compacta é *"default v3.3.0+"*, que o
Hefesto *"detecta automaticamente"* e que `...=0` a desliga. **O código é opt-in
e nasce desligado desde 31/07**, e o próprio cabeçalho dele já foi corrigido
(`app/compact_window.py:1-20`). São **três linhas**, na página exata do problema
que ela tem, abertas há 29 dias.

**O estado real desta faixa, medido pelo leitor da Faixa 6:** das 12 linhas,
**sete estavam erradas**, e o erro é sempre no mesmo sentido — a fila cobra
trabalho já feito. `GATE-EMOJI-01` fecha de vez; `SUITE-QUE-SUJA-O-JORNAL-01`
está praticamente fechada (E4 e cabeçalho pagos em 22/08); `TRES-REFUTADAS-01`
está na faixa errada (é código de produto e texto de tela); `DOC-VERDADE-02` tem
**sete das dez** entregas pagas; `TESTE-HONESTO-01` tem **quatro das cinco**; e a
faxina do `/tmp` que esperava a palavra dela **evaporou** — `scripts/faxina-de-testes.py`
hoje responde *"PROVADO como lixo de teste: nada."*

**A causa estrutural, e ela é a mais importante desta etapa:** o campo `Status:`
de uma sprint é **o único lugar do repositório que afirma o estado de um trabalho
e que nada confere**. A `ROTULOS-DE-SPRINT-01` propõe a regra 4 do
`validar-referencias-docs.py` para curar isso, e é **palavra dela**, porque portão
novo é decisão dela. **Um portão que comparasse `Status:` com a fila teria pego as
catorze linhas da Etapa 0.**

**Custo.** `A-LINHA-QUE-DISPENSA-01` declara **50 minutos** (10 + 20 + 20) e é a
única desta faixa com custo por entrega. O resto: **NÃO MEDIDO**.

---

## 3. A QUEIXA DELA, ENCARADA DE FRENTE

> *"sinto que nada tá dentro do chrono imaginado."*

### 3.1 O fato desconfortável: o trabalho cresceu, e ninguém estava atrasado

O balanço de 28/08, que ela mesma encomendou, mediu o contrário do esperado:

| | Sprints na fila | Filhas previstas | Trabalho total |
|---|---|---|---|
| **ANTES** (26/08) | 140 | 139 | **279** |
| **DEPOIS** (28/08) | 214 | 144 | **358** |
| | **+74** | +5 | **+79 (+28%)** |

As **filhas** são sprints que produzem outras sprints — trabalho que existia e que
ninguém tinha contado. O redesenho **não encurtou a fila**; ela cresceu 28%.

**Ninguém estava atrasado em relação a um plano. O plano é que não conhecia o
tamanho do trabalho.** Medir revelou o trabalho; não o criou.

**E o que o redesenho encurtou é real, só não é a contagem:** 26 das 40 sprints da
Faixa 1 perderam a entrega de **desenho** (foto antes, foto depois, olho dela); 44
das 90 sprints novas nascem com o texto de tela **já aprovado**; 23 das 72
perguntas abertas o mockup respondeu sem uma reunião. É ganho de calendário, não
de contagem.

### 3.2 O segundo fato, e ele é mais duro: **não existe régua de tempo nesta casa**

**Nenhuma sessão deste projeto cronometrou uma frente de ponta a ponta e usou o
número medido como régua.** A evidência é de dois lados: a §6 da escada de
releases (24/08) já registrava *"custo em dias-agente: nenhuma tem estimativa por
sprint — NÃO VERIFICADO"*, e os seis leitores que abriram as 120 sprints desta vez
acharam o mesmo. As poucas que declaram custo declararam-no por **estimativa de
quem escreveu**, não por medição:

| Sprint | O que declara |
|---|---|
| `SOM-DE-CADA-JOGADOR-01` | 4 h 45 (e a entrega mais cara, de 1 h 50, **já está feita** — restam 1 h 55) |
| `TRES-REFUTADAS-01` | 4 h 30 |
| `A-LINHA-QUE-DISPENSA-01` | 50 min |
| `NO-MEU-FUNCIONA-01` | por entrega; as quatro baratas somam ~1 h 15 |
| `A-CADEIA-DE-BLOCOS-01` | 35 min de máquina + 6 min de olho dela |
| `A-PONTE-UNIVERSAL-01` | 49 min dela (39 no melhor caso) |
| `NAVEGA-PELO-CONTROLE-01` | ~610 linhas de produto — **tamanho, não tempo** |

Das 40 sprints da Faixa 1, **nenhuma** declara custo. Das 31 da Faixa 5, **treze
não trazem uma única menção de tempo**.

**Por isso o cronograma "escorrega" sem que ninguém consiga dizer quanto:** existe
uma régua de **escopo** (a fila) e nenhuma régua de **tempo**. A fila mede quanto
falta em unidades de trabalho e não sabe converter isso em dias.

**O que faria essa régua existir, e eu não vou inventá-la:** cronometrar duas ou
três frentes de ponta a ponta — uma de daemon, uma de tela, uma de bancada — e
usar o número medido como régua. É a única proposta honesta que eu tenho, e ela
custa as próprias frentes, não uma sessão extra.

### 3.3 O terceiro fato, e é o que realmente segura o calendário

**A trilha dela não anda há 13 dias.**

- último ensaio com o olho dela: **16/08, 01h05** (`docs/data/ensaios.csv`);
- CHECKLIST de hardware: **0 de 31, intocado desde 25/07 — 35 dias**;
- sprints marcadas `AGUARDANDO A PALAVRA DELA`: **24 hoje**, contra 21 em 24/08 e
  17 em 10/08. `grep -rli 'AGUARDANDO A PALAVRA DELA' docs/process/sprints/*.md | wc -l`.
  **A fila de espera pelo olho dela cresce.**

**79 das 120 linhas da fila são dela (66%).** Cortar escopo não muda esse número —
só **escolher quais dela olhar primeiro** muda.

E há um custo silencioso: **cinco sprints têm código entregue entre 25/07 e 08/08
esperando só a palavra dela** — de 21 a 35 dias de trabalho pronto atrás de uma
sessão de revisão que nunca foi marcada.

### 3.4 O que muda a partir daqui — três coisas, e as três são escolhas dela

1. **Corte.** A §5 lista o que sai e o preço de cada corte. **O maior deles ela
   já fez em 24/08 e a fila não aplicou** (`D-MVP-SO-DUALSENSE`): Pro e 8BitDo vão
   para a 1.0, custo zero, e isso derruba **36 das 61 pendências do mapa** — mais
   três linhas inteiras da fila.
2. **Ordem.** A §4 põe os gestos dela em ordem de quanto cada um destrava.
   **Dezesseis minutos dela, somados, destrancam quatro sprints de identidade, uma
   célula do mapa da barra, uma causalidade de driver e o casamento de um perfil**
   — e esses dezesseis minutos estão hoje enterrados em documentos com outro nome.
3. **Régua.** A Etapa 1 faz nascer o comando que diz se a 0.9.5 acabou. Sem ele,
   *"terminar a 0.9.5"* é opinião — e é exatamente essa a sensação de não haver
   linha de chegada.

**Não dramatizando e não consolando:** o projeto não está parado. Foram **12
commits só hoje**, e há três levas de agente em voo. O que está parado é a
**trilha que só ela move**, e ela é a que define o próximo lançamento.

---

## 4. O QUE SÓ ELA PODE FECHAR

Consolidado das seis faixas, sem duplicata, **em ordem de quanto destrava por
minuto**. O formato que funciona com ela é **ver e fazer** — por isso cada linha
tem o roteiro em uma frase.

### 4.1 Os gestos de dois a cinco minutos

| Gesto — o roteiro em uma linha | Quanto | O que destrava |
|---|---|---|
| **Ligar dois vpads com máscaras diferentes** (um Xbox, um DualSense) e dizer se os dois aparecem certos no jogo | **2 min** | a **máscara por controle** inteira — o contrato que ela chamou de central. Hoje `daemon/subsystems/external_mask.py:71-80` declara o risco como "não medido" e é essa declaração que trava o último degrau |
| **Abrir a Steam, rodar `sinal_da_barra --agora`, escolher um controle aceso; o assistente derruba pelo BlueZ; ela aperta PS e OLHA a barra** | **2 min** | a célula do mapa da barra de luz (`BARRA-MUDA-01 §6`); o controle negativo com a Steam fechada já foi feito |
| **Ligar e desligar o Pro três vezes**, contando as recusas por conexão | **2 min** | `SEGUNDO-ESCRITOR-01` — *"é a única coisa desta sprint que não fecha sozinha"* |
| **O protocolo do clique do 8BitDo** (`BUSCA-QUE-ESTOURA-01 §264`) | **2 min** | separa as três explicações possíveis do clique que faz o aparelho sair do laço de busca |
| **Abrir o Grim Fandango uma vez** e deixar o produto ler a janela | **3 min** | o casamento do perfil aponta hoje para o palpite `steam_app_316790` (o `window_class` do `grim_fandango_remastered.json` na config dela, linha 7), nunca conferido contra a janela viva |
| **Olhar as cinco cores** — 5 cores × 2 transportes × Steam aberta/fechada | **~5 min** | 20 células do mapa (BLOCO C da `PROVA-NO-PLASTICO-01`) |
| ~~Ligar o 8BitDo em cada modo e anotar o MAC~~ | ~~2 min~~ | **CORTADO DE GRAÇA** pela `D-MVP-SO-DUALSENSE`: destravava quatro sprints de identidade que agora são 1.0 |

### 4.2 Os ensaios de bancada, na ordem em que se pagam

| Ensaio — o roteiro em uma linha | Quanto | Por que nesta posição |
|---|---|---|
| **`A-CADEIA-DE-BLOCOS-01/E-7`** — o instrumento monta a cadeia, ela olha a lightbar e diz o que viu | **6 min de olho** | **é o primeiro porque pode ECONOMIZAR uma hora dela**: se ele fechar a porta, o E-5 (uma hora de ouvido) custa **zero**. Depende dos 35 min de máquina da Etapa 2 |
| **`PROVA-NO-PLASTICO-01`** — os blocos B2 a B6 mais o C, com o controle na mão | **~30 min** | fecha o roteiro que já estava escrito e parado; o B1 já foi feito em 19/08 |
| **`LUZ-CEGA-01/E3`** — quatro no rádio, daemon parado, um report de cor por hidraw em cada, e ela olha | **~20 min** | fecha ou derruba a hipótese do volume, e destrava a aba Iluminação |
| **`A-PONTE-UNIVERSAL-01`, Onda 4** — a mesa perecível, ~14 pares | **49 min** (39 se o E-1 discriminar) | **fica no FIM e nada acima dele depende dele** — é a Lei 2 do plano da mesa 2+2 |
| **`O-LACO-DE-ESCRITA-01/P3`** — mil escritas por segundo com a mesa cheia | dentro dos ~45 min do ensaio | **os patamares P0/P1/P2 ela JÁ autorizou sem estar na mesa** (`D-E9-LACO-DE-ESCRITA`, 22/08). Só o P3 a espera |
| **O CHECKLIST de 31 caixas** — quatro controles, dois no cabo e dois no rádio, um jogo de co-op aberto | **horas, NÃO MEDIDO** | é a sessão que fecha **treze sprints de uma vez**; nenhuma das 31 caixas tem estimativa escrita |

**O bloqueio físico do CHECKLIST, medido hoje, e ele NÃO é o que a fila supõe:**

- **os controles não faltam.** O registro dela
  (`~/.config/hefesto-dualsense4unix/controllers.json`) tem **cinco** aparelhos na
  ordem: quatro `dualsense` nos postos 1 a 4 e um `external` no posto 5;
- **os adaptadores faltam.** `ls /sys/class/bluetooth/` devolve **um** (`hci0`). A
  régua R5 da 0.9.5 pede **três**, e o maior ensaio de rádio já feito foi com
  **dois**.

**A sessão de quatro no rádio é hoje fisicamente impossível — por rádio, não por
controle.** Ver o corte 3 da §5.

> **Uma divergência de uma linha, e ela precisa da palavra dela.** O
> [posto de comando](2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md) escreve
> hoje *"ela tem **dois** controles e o mockup desenha quatro"*, e o registro do
> produto lista quatro DualSense. As duas afirmações não podem estar certas.
> Isso muda o desenho da aba (a mesa se adapta ao que ela tem) **e** o tamanho do
> corte 3. Pergunta: *quantos DualSense estão na sua mesa hoje?*

### 4.3 As decisões — palavra, não bancada

| A pergunta, em uma linha | Trava |
|---|---|
| **O ok sobre o piloto** (a aba Controles no motor novo) | a execução das outras nove abas |
| **`parcial` conta como "admite não acionar"?** | a régua da 0.9.5 inteira (Etapa 1) |
| **Os cinco desenhos da `BUSCA-QUE-ESTOURA-01`** — e um deles já vem com o grau *"MEDIDO que funciona: é o que ela já faz"* | o rádio do 8BitDo; **a pergunta nunca foi formalmente posta a ela** |
| **A bandeja continua no produto?** | 574 linhas e a `RADAR-01/E2` (§6) |
| **A TUI mostra gatilho e analógico de verdade, ou mostra só bateria?** | `JANELA-FIEL-01/E5` |
| **Navegar a janela do Hefesto pelo controle continua na 0.9.5?** | duas sprints e ~610 linhas de produto (§5, corte 4) |
| **Os presets de fábrica levam a biografia dela?** (`meu_perfil.json`, a lightbar azul, o LED de jogador 3) | `INSTALL-QUE-NAO-CARREGA-01/L5` |
| **A ordem das duas máscaras** (`RADAR-01/D1`) — hoje três listas discordam entre si | um portão que já existe e congelou a divergência para ela não piorar calada |
| **A regra 4 do portão de rótulos** — o `Status:` de sprint passa a ser conferido? | a causa estrutural de a fila envelhecer (Etapa 10) |

**E dois minutos de administradora**, que não são decisão: religar o ruleset de
anonimato com bypass de admin (§2, Etapa 8).

---

## 5. O QUE DÁ PARA CORTAR, E O PREÇO DE CADA CORTE

Ordem: do mais barato e mais reversível para o mais caro.

### Corte 1 — Pro Controller e 8BitDo saem da 0.9.5 (**ela já cortou; a fila não aplicou**)

- **O que se perde:** nada nesta versão. Os dois **continuam funcionando**; o que
  não vale para eles é a garantia *"o rádio parou de mentir"*.
- **Quem sente falta:** ninguém hoje. Palavra dela: *"o negócio nasceu pra fazer o
  DualSense funcionar. Vamos completar tudo pro DualSense, depois voltamos neles lá
  na versão 1.0."*
- **Reversível?** Sim, por construção — é a 1.0.
- **O que sai:** 36 das 61 pendências do mapa, sem um minuto de bancada; mais
  `IDENTIDADE-DUPLA-01`, `REGRA-NÃO-REGISTRO-01`, a maior parte da
  `NOME-HONESTO-01` (1.020 das 1.698 linhas do bloco de identidade) e a E2 da
  `N-IGUAL-A-UM-01`.
- **Preço real:** **zero.** Isto não é um corte novo — é aplicar à fila um corte
  que ela fez em 24/08 e que só foi aplicado ao mapa de canais.

### Corte 2 — O i18n sai; a **promessa** de i18n não

- **O que se perde:** a construção da tradução. Medido hoje: a **fiação** se
  espalhou — **22 módulos de `src/` importam o `utils/i18n`**, e **10 dos 22
  arquivos de `app/actions/`** — mas os **catálogos continuam vazios**:
  `grep -c '^msgstr ""$' po/*.po` devolve **226 em `pt_BR`** e **222 em `en`**.
  A tubulação foi construída e ninguém traduziu.
  <!-- FATO CORRIGIDO, 29/08: o relatório da Faixa 6 dizia "3 de 22 arquivos de
       app/actions importam gettext, contra 2 de 17 em 31/07", e "236 (pt_BR) e
       237 (en) msgstr vazios". Os dois estão errados, e o primeiro pela régua:
       ele grepou `gettext`, e esta casa importa `utils/i18n`. Com o termo certo
       são 10 de 22, não 3. Medido aqui com os comandos acima. -->
- **Quem sente falta:** ninguém. Ela é a usuária, e ela lê português. A própria
  sprint escreve o critério: *"só quando houver alguém para ler em outra língua"*.
- **Reversível?** Sim.
- **O que NÃO se corta junto, e é o preço:** três páginas **prometem** i18n
  (`.github/CONTRIBUTING.md:149`, `docs/usage/flatpak.md:140-175`,
  `docs/usage/troubleshooting.md:395-420`). A migração para o WebView torna a
  promessa **mais** falsa, não menos. **Cortar a feature sem retratar a promessa é
  o defeito que a regra da casa existe para matar.**

### Corte 3 — A mesa de quatro vira mesa de dois

**Este é o maior ganho de calendário disponível, e é o mais desconfortável.**

- **O que se perde:** a prova de que o produto aguenta **quatro** controles.
  Treze das 40 sprints da Faixa 1 têm o aceite escrito contra *quatro controles +
  jogo aberto*.
- **Quem sente falta:** ela, no dia em que jogar com quatro pessoas.
- **Reversível?** **Sim, e é o ponto:** reescrever o aceite dessas treze para
  **dois** controles e deixar a prova de quatro para a 1.0 converte um gargalo
  **hoje fisicamente impossível** numa sessão de bancada que cabe numa tarde. E o
  impossível é do **rádio**, não do inventário: há quatro DualSense no registro
  dela e **um** adaptador na máquina, contra os três que a R5 exige (§4.2).
- **O que fica de fora do corte:** `QUATRO-NA-MESA-01` e `QUATRO-NO-RÁDIO-01`
  ficam, por definição — o defeito delas **só existe com quatro**. Mas o defeito da
  `COOP-QUE-NÃO-DESMONTA-01` (*"o Jogador 2 que dura dois segundos"*) **reproduz
  com dois**, e é ele que ela relatou.
- **O preço honesto:** a 0.9.7 da escada é literalmente *"ela joga a mesa cheia"*.
  Este corte não a apaga — **adia a prova de quatro para o degrau onde ela já
  mora**, e destrava treze sprints agora.

### Corte 4 — Navegar a janela do Hefesto pelo controle

- **O que se perde:** `NAVEGA-PELO-CONTROLE-01` + `NAVEGAR-ESTA-JANELA-01` —
  ~**610 linhas de produto declaradas** (244 no daemon, 364 na GUI), quatro
  arquivos de teste novos, um método de IPC novo, uma peça de estado no daemon,
  outra na GUI, e dívida de instrumento (o `retratar_abas.py` teria de montar a
  mixin da aba Navegação).
- **O argumento não é meu, é do disco:** o mockup que ela aprovou em 26/08 **não
  desenha essa feature em lugar nenhum** — `grep` de *"Navegar esta janela"* e
  *"carrossel"* nos dez HTML, no contrato das dez abas e nas nove sprints
  `ONDA-NAVEGACAO-*` devolve **zero**. O contrato da aba Navegação redesenhada é
  *"Comandar o PC"*. As decisões que autorizam a feature (D-19 a D-23) são de
  **15/08 — onze dias antes de o redesenho existir**.
- **Quem sente falta:** ela, se ainda quiser. É uma pergunta de uma linha.
- **Reversível?** Sim.
- **Preço:** se sair, a Faixa 4 cai de 13 para 9 linhas.

### Corte 5 — A parte de TELA das sete sprints que escrevem o `main.glade`

- **O que se perde:** nada de função — **adia-se**. `CONTAGEM-E-COOP-01`,
  `STEAM-INPUT-01`, `STEAM-QUE-DECIDE-01`, `JOGOS-QUE-ELA-TEM-01`, `AUTO-01`,
  `OITO-DEFEITOS-01` e `EMULAÇÃO-NO-JOGO-01` nomeiam o `main.glade` (4.288 linhas,
  XML único, conflito de merge irrecuperável).
- **O argumento é o portão:** 166 das 304 colisões de hoje são nesse arquivo.
  Escrever GTK à mão nele agora é trabalho com prazo de validade.
- **A parte de DAEMON dessas sete continua.** Só a de tela espera.
- **Reversível?** Sim — e mais barato depois, porque a tela nova já estará lá.

### Corte 6 — As entregas de polimento, uma por sprint

- **`PS-TOQUE-CURTO-01`, E2 e E4:** a E1 **já está no código**
  (`integrations/hotkey_daemon.py:68,152-155`) e mata o sintoma — o teto de 700 ms
  impede que um hold de 5 s abra a Steam. Fica **uma** linha real: declarar o
  `wmctrl` no `install.sh` (conferido: não está lá), ou a dependência morre em
  silêncio. Cinco minutos.
- **`MIC-BT-DONO-01/E6`** (*"o CLI para de mentir por antecipação"*): é superfície
  de linha de comando, e a usuária desta versão não usa linha de comando. Custa uma
  nota datada.
- **`JANELA-FIEL-01/E5` (a TUI):** a barra de gatilho em zero e o analógico no
  centro **são mentira de tela** (`tui/app.py:163-167` traz `l2=0` e `lx=128` por
  constante, dez vezes por segundo). Mas a alternativa que a própria sprint escreve
  já é honesta: **tirar os quatro widgets** e deixar só a bateria, que é medida.
  Custa menos e não deixa nada mentindo.
- **`E-4` da `ESCADA-QUE-RESPONDE-01` (o `0xF6`):** **morto por medição da própria
  casa** — o censo de 15/08 mediu o `0xF6` vindo vazio e idêntico nos quatro
  aparelhos, e o que decidiria é estímulo por `SET_FEATURE`, **proibido pela D-32,
  decisão dela**. Fecha com lápide, custo zero.
- **`RADAR-01/E2` (a bandeja):** ver §6.
- **Os sete símbolos-lápide** do registro do portão `a-casa-sabe` (`stop_ipc`,
  `stop_udp`, `stop_autoswitch`, `RumbleEngine`, `led_set`, `player_leds_set`,
  `HotkeySubsystem`): **não são cura a ligar, são lápide a apagar** — as próprias
  razões, remedidas em 26/08, dizem isso. Apagá-los tira 7 das 38 acusações **sem
  tocar em comportamento**.

### O que eu NÃO cortaria, e é honesto dizer por quê

- **O agente de pareamento que autoriza qualquer aparelho** (Etapa 8). Não bloqueia
  marco nenhum, e passa por cima de todos.
- **As 79 sprints marcadas DELA.** São 66% da fila e nenhum agente as move. Cortar
  escopo não muda esse número — só a ordem em que ela olha muda.
- **O passo 6 da `AGORA-E-DEPOIS-01`** (a escolha adiada gravada em disco).
  Proponho o corte e **não o executo**: é a Decisão 4 dela, de 08/08, escrita com
  todas as letras. O preço do corte é pequeno e conhecido — sem ele, a máscara não
  pode dizer `guardou=True` e a linha da tela some junto. É uma pergunta de dois
  minutos, não uma frente.

---

## 6. AS TRÊS SUPERFÍCIES ESQUECIDAS

O redesenho das dez abas é do `Gtk.Notebook`. **Estas três não estão nele, e a
migração não as alcança.** A `RADAR-01` sozinha prevê **7 filhas**.

### 6.1 O applet do COSMIC — e há uma medição de hoje que muda a recomendação

**O que é:** 1.877 linhas de Rust em `packaging/cosmic-applet/`, binário instalado
em `/usr/local/bin/hefesto-dualsense4unix-applet` (19/08).

**A `RADAR-01` o descreve como "a superfície que ela usa TODO DIA"**, com base numa
medição de 31/07: rodando no painel dela, quarta posição da asa esquerda do
`plugins_wings`.

**Medido hoje, e não é mais verdade:**

```bash
cat ~/.config/cosmic/com.system76.CosmicPanel.Panel/v1/plugins_wings
# só applets do system76 + NowPlaying. O `com.vitoriamaria.HefestoDualsense4Unix` NÃO está lá.
```

**O que fazer:** **uma pergunta de uma linha para ela, antes de qualquer
trabalho** — *"o applet ainda está no seu painel?"*. Se a resposta for **não**, a
`RADAR-01/E1` (as sete divergências D1 a D7 entre o applet e a janela) deixa de ser
urgente e vira 1.0. Se for **sim**, ela é a única superfície deste projeto que **não
se fotografa** com `Gtk.OffscreenWindow` — quem desenha é o `cosmic-panel` —, e
mexer nela obriga a recompilar e reinstalar em `/usr/local/bin`, que é root, e o
CI não compila o applet.

**Nota de identidade, de passagem:** o id do applet ainda é
`com.vitoriamaria.HefestoDualsense4Unix` — o nome **dela**, num id público. A
`IDENTIDADE-01` renomeou o Flatpak para `io.github.hefesto_team.*` e **não chegou
aqui**.

### 6.2 A bandeja — 574 linhas esperando uma decisão de uma palavra

**O que é:** `app/tray.py`, 574 linhas.

**O fato medido em 31/07 e não contestado:** ela **não aparece** na máquina dela, e
não aparece **por configuração do painel COSMIC**, não por defeito nosso.

**O que fazer:** **não migrar, não polir, perguntar.** *"A bandeja continua no
produto?"* Se **não**: saem 574 linhas e a `RADAR-01/E2` inteira. Se **sim**: ela
vira alvo declarado (GNOME com extensão, KDE, outras distros) e a E2 encolhe para
uma lista de textos com um veredito por linha. **Mantê-la sem decisão é carregar
peso sem dono** — e é o oposto do que a queixa de prazo pede.

### 6.3 A janela compacta — o código está certo, a documentação mente

**O que é:** `app/compact_window.py`, 338 linhas, **opt-in e desligada por
padrão** desde 31/07, com o motivo escrito no próprio cabeçalho (a janela
flutuante sempre-no-topo no COSMIC era intrusiva).

**O defeito vivo não é código, é texto:** `docs/usage/troubleshooting.md:122-128`
e `:136` ensinam a ela que a janela é *"default v3.3.0+"*, que o Hefesto *"detecta
automaticamente"* e que `...=0` a desliga. **As três afirmações estão erradas.**

**O que fazer:** **três linhas de texto, hoje**, mais o teste de coerência que a
própria `RADAR-01` já especifica (o cabeçalho não pode conter "Opt-out"; a seção 3
não pode conter "default ligado"). É a única das três que tem trabalho barato e
certo, e ela engana **ela**, não quem lê código.

### 6.4 A dívida de instrumento que a migração cria nas três

`tests/unit/test_vocabulario_das_quatro_superficies.py` trava o vocabulário
compartilhado lendo `main.glade`, o `app.rs` do applet e Python. **A WebView
acrescenta um QUINTO autor de texto — o HTML do mockup — que esse portão não lê.**
Enquanto isso não for curado, uma palavra pode divergir entre a tela nova e o
applet sem que régua nenhuma acuse.

**E a `RADAR-01/D1` continua de pé:** três listas discordam da ordem das duas
máscaras — a aba Início contra a aba Perfis contra o applet. A remedição de 01/08
achou que **não é o applet contra a janela: é a janela contra si mesma**. O portão
congelou a divergência para ela não piorar calada, e ele **reprova no dia em que as
três se alinharem**, pedindo para virar igualdade. Custa uma frase dela e a
inversão de duas linhas.

---

## 7. COMO ESTE DOCUMENTO NÃO ENVELHECE

Este arquivo é uma **fotografia de 29/08/2026**. Ele não tem portão, e vale o que a
última pessoa que o tocou escreveu. Quem ler daqui a um mês: **remeça antes de
acreditar**, com os comandos abaixo.

### 7.1 O que confiar sem remedir

- **As decisões dela.** `docs/data/decisoes-dela.csv` é onde a casa lê, e o
  `DECISOES.md` da raiz é onde ela responde. **Sem alguém carregando de um para o
  outro, a resposta dela não existe** — foi assim que a casa cobrou dela, por três
  dias, cinco decisões já respondidas.
- **A escada de releases** (`2026-08-24-A-ESCADA-DE-RELEASES.md`) — **exceto** os
  quatro números da 0.9.5 e a linha da 0.9.8 sobre o portão de empacotamento, que
  este documento corrigiu (Etapas 1 e 8).
- **As quatro referências de driver em `docs/protocol/`**, lidas no fonte C em
  11/08. Quando a pergunta é *"o que o aparelho faz de verdade"*, elas vencem
  qualquer outra página.

### 7.2 O que remedir sempre

```bash
# 1. O que esta casa fechou hoje — o único que nunca envelhece
git log --since=midnight --format='%h %s'

# 2. O tamanho real da fila, e quanto dela é dela
python3 - <<'PY'
import re
sec = open('docs/process/SPRINT_ORDER.md').read().split('## 4. O QUE ESTÁ ABERTO')[1].split('## 5. BURACOS')[0]
for b in re.split(r'^### ', sec, flags=re.M)[1:]:
    linhas = [l for l in b.split('\n') if l.startswith('| [')]
    dela = [l for l in linhas if 'DELA |' in l or l.rstrip().rstrip('|').rstrip().endswith('DELA')]
    print(f"{b.splitlines()[0][:52]:52s} {len(linhas):3d} linhas, {len(dela):3d} DELA")
PY

# 3. As quatro réguas da 0.9.5 (o script oficial ainda não existe — ver Etapa 1)
#    o bloco de código completo está na Etapa 1 deste documento

# 4. A régua de bancada R5, que não é de arquivo
ls /sys/class/bluetooth/          # hoje: um adaptador. A 0.9.5 pede três.

# 5. O defeito que dá para ver acontecendo
journalctl --user -u hefesto-dualsense4unix --since '7 days ago' | grep -c x11_focus_gate_no_x_focus

# 6. A fila de espera pelo olho dela — se este número cresce, o gargalo é a §3.3
grep -rli 'AGUARDANDO A PALAVRA DELA' docs/process/sprints/*.md | wc -l

# 7. Os portões. Hoje: 20 verdes e 1 vermelho (colisao-de-sprints, 304 colisões)
bash scripts/portoes.sh --rapido

# 8. A fila da migração da interface, escrita por outra leva
ls docs/process/sprints/2026-08-29-MIGRA-* | wc -l

# 9. O último ensaio com o olho dela — a trilha que define o calendário
python3 -c "import csv;d=[r for r in csv.DictReader(open('docs/data/ensaios.csv')) if r['observado_por']=='olho-dela'];print(max(r['quando'] for r in d))"
```

### 7.3 A régua que falta, e quem a escrever conserta este documento para sempre

**O campo `Status:` de uma sprint é o único lugar do repositório que afirma o
estado de um trabalho e que nada confere.** É a causa estrutural de tudo o que este
documento achou: **catorze linhas da fila cobram trabalho já feito**, e nenhum
portão o disse.

A cura está escrita e é palavra dela: a **regra 4** do
`scripts/validar-referencias-docs.py` (`ROTULOS-DE-SPRINT-01`), que compararia o
`Status:` de cada sprint com o que a fila diz dela. O portão já lê `src/` por AST
para a regra 3; o mecanismo existe.

**Enquanto ela não nascer, a regra desta casa continua sendo a única defesa:** quem
fecha uma sprint atualiza o `SPRINT_ORDER.md` **no mesmo commit**.

---

## 8. PONTEIROS

- **A fila, com a ordem das dez ondas e as seis faixas:** [`SPRINT_ORDER.md`](SPRINT_ORDER.md) — §0 é o que é dela, §1 é a interface, §2 é o que a fila nova não cobre, §4 é a fila
- **A escada de releases, decisão dela:** [2026-08-24-A-ESCADA-DE-RELEASES.md](2026-08-24-A-ESCADA-DE-RELEASES.md)
- **O balanço que mediu o crescimento de 28%:** [2026-08-28-ONDE-PARAMOS](2026-08-28-ONDE-PARAMOS-a-fila-cresceu-e-o-mockup-virou-produto.md)
- **A decisão da tecnologia da interface e as seis réguas falsas:** [2026-08-29-ONDE-PARAMOS](2026-08-29-ONDE-PARAMOS-a-tecnologia-decidida-e-a-cura-que-a-tela-desfazia.md)
- **O que está em voo agora, e o que fazer se o contexto sumir:** [2026-08-29-O-POSTO-DE-COMANDO](2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md)
- **O contrato de cada aba redesenhada:** [2026-08-26-O-REDESENHO-as-dez-abas.md](2026-08-26-O-REDESENHO-as-dez-abas.md)
- **O CHECKLIST de 31 caixas, que fecha treze sprints de uma vez:** [CHECKLIST-validacao-em-hardware](sprints/2026-07-25-CHECKLIST-validacao-em-hardware.md)
- **A regra do olho dela:** [PROVA-DE-TELA-01](sprints/2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md)
- **As decisões dela, onde a casa lê:** `docs/data/decisoes-dela.csv` — 118 linhas hoje

---

## 9. O QUE FICOU NÃO MEDIDO NESTE DOCUMENTO

Escrito porque, nesta casa, a linha em que a autora explica por que não precisava
olhar é onde o defeito mora.

- **Tempo por sprint, em 113 das 120 linhas.** Sete declaram custo, e nenhuma delas
  o mediu com cronômetro — todas estimaram. **Não somei o que ninguém mediu.**
- **Quanto custa escrever o script da régua da 0.9.5.** Não tentei.
- **O custo do enxerto substitutivo da interface.** É a primeira sprint da Etapa 3
  e o número que decide o transplante inteiro.
- **Se o `WebKit2.WebView` sai da foto que o `retratar_abas.py` tira.** Custa uma
  execução, e sem essa resposta a `PROVA-DE-TELA-01` pode perder o instrumento com
  que toda aba fecha.
- **Se as 31 caixas do CHECKLIST cabem numa sessão ou em três.** Nenhuma tem
  estimativa escrita, e o arquivo nunca foi exercitado.
- **Se o applet ainda importa para ela.** Medi que não está no painel; não medi por
  quê. É uma pergunta, não uma investigação.
- **Quantas das sprints em disco estão realmente abertas** (`find docs/process/sprints
  -name '*.md' | wc -l` — o número cresce enquanto a outra leva escreve). A §4 cura 120 à
  mão; a última estimativa da cauda muda (a escada, 24/08) dava de 8 a 47, com
  intervalo largo por causa das mudas. **Não reestreitei.**
