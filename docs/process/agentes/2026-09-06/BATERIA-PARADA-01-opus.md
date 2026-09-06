# BATERIA-PARADA-01 — o número que nunca muda

**06/09/2026 · árvore `hefesto-voo/BATERIA-PARADA-01-opus` · branch
`voo/BATERIA-PARADA-01-opus`, nascida de `onda/atual-0609` em `39fa440d` e
reassentada em `ea9268f4`, a ponta da branch ao fechar — o commit que entrou
no meio é só de documento (`docs/data/decisoes-dela.csv` e o plano dos quatro
lotes) e não toca nenhum arquivo desta sprint.**

A queixa dela, de 26/08, era *"o percentual de bateria do controle nunca é
atualizado"*. **O percentual estava certo; o que faltava era a outra metade.**
O produto lia o NÚMERO do byte de bateria e jogava fora o ESTADO que vinha no
mesmo byte — e "100%" mudo é indistinguível de uma barra travada.

E havia um segundo defeito, pior: **dois dos nós de bateria do sysfs eram
nossos**, e o número deles nunca muda porque não vem de bateria nenhuma.

---

## O que mudou

### B1 — o estado de carga atravessa até o payload

| arquivo | o que entrou |
| --- | --- |
| `core/backend_pydualsense.py` | `ESTADO_DE_CARGA` (a tabela do nibble alto), `_read_battery_state_opt` e `_carga` — o par `battery_pct` + `battery_state` que o `describe_controllers` publica; e o campo nos dois `ControllerState` do `read_state` |
| `core/controller.py` | `ControllerState.battery_state: str \| None = None` |

O dado **já vinha** e ninguém o lia: o `report_thread` da pydualsense escreve
`battery.State` e `battery.Level` do mesmo `states[53]` na mesma linha (nibble
alto = carga, nibble baixo = nível). A leitura nova é do mesmo tipo da que já
existia — só getattrs, sem HID I/O, segura fora do `_io_lock`.

**A tradução é a do DRIVER, não a da biblioteca**, e as duas discordam num
ponto: a `BatteryState` da pydualsense chama `0xB` de
`POWER_SUPPLY_STATUS_NOT_CHARGING`, e o `hid-playstation` diz tensão ou
temperatura fora de faixa em `0xa` E `0xb`
(`docs/protocol/driver-hid-playstation.md`, §"A tradução de bateria" — a mesma
tabela que `core/physical_report_reader.py` já aplicava). A ordem de
precedência desta casa é o aparelho antes da biblioteca, então o nome que sai é
o do driver: `descarregando · carregando · cheio · fora_de_faixa · erro`.

**A guarda do `Level`, e ela não é zelo.** `DSBattery.__init__` nasce com
`Level = 0` e `State = 0`, e `0x0` é DESCARREGANDO na tabela do kernel — sem
guarda, um controle recém-plugado anunciaria "descarregando" antes do primeiro
report. O discriminador é EXATO: um report de verdade dá `nibble*10+5`, cujo
mínimo é 5, então `Level == 0` só existe antes do primeiro report.

**As duas metades nascem juntas.** `_carga(handle, connected)` devolve
`battery_pct` e `battery_state` no mesmo dicionário, e o `describe_controllers`
o desempacota. Não é enfeite: a queixa dela era exatamente a metade que
faltava, e um par que se calcula em dois lugares se separa no terceiro.

**Como o campo chega à janela sem handler novo:** o `controller.list` repassa o
dicionário do `describe_controllers` VERBATIM em `result["controllers"]`
(`daemon/ipc_handlers.py`). O campo entrou no **FIM** do `ControllerState` de
propósito — um campo intercalado trocaria o sentido de todo
`ControllerState(...)` construído por POSIÇÃO, e a casa tem dezenas deles.

**A leitura do nó do kernel NÃO entrou no `describe_controllers`**, e é
decisão: ela é I/O de arquivo e aquele método roda no caminho quente do FF do
jogo — o próprio handler já declara essa regra. Quem confronta as duas réguas é
o journal, no tique lento.

### B2 — a varredura ignora o vpad, e ignora NOMEANDO

Em `daemon/battery_journal.py`: `PREFIXO_DO_VPAD` e `e_no_do_vpad()`;
`ler_no_do_kernel` recusa endereço de vpad; o `observar` não abre curva para
ele; e `estado_handle` passa a sair na linha do journal ao lado do `status` do
kernel — as duas réguas do ESTADO na mesma linha, como já valia para o
percentual.

O `e_no_do_vpad` compara os **últimos 12 dígitos** hex, e isso é medido: o nome
do nó é `ps-controller-battery-<mac>` e o próprio prefixo tem letras a-f
("controller" dá `c`,`e`; "battery" dá `b`,`a`,`e`) — filtrar o nome inteiro e
olhar o COMEÇO leria `cebae…` e nunca casaria.

**O "sai NOMEANDO" do enunciado virou portão.** O prefixo `02fe` está espelhado
em três módulos (cada um explica por que não importa o do vizinho: peso de
import, e o broker é stdlib autocontido). `TestOEspelhoNaoDiverge` confronta as
três cópias com o `player_mac()` que forja o endereço de verdade — no dia em
que o prefixo mudar, ele nomeia a cópia que saiu da linha.

---

## Os dois recuos deste trabalho, e os dois são de instrumento

**1. Uma função pública nasceu sem chamador, e o portão a pegou pelo nome.**
Escrevi `varrer_nos_de_bateria()` — a enumeração de `/sys/class/power_supply`
que a frase "a varredura tem de devolver DOIS controles" sugere. Nada em
produção a chamava, e `portao_a_casa_sabe_e_o_produto_nao_faz` acusou:

```
E  estas promessas públicas não têm chamador em produção e ninguém disse o que elas são:
E      daemon/battery_journal.py::varrer_nos_de_bateria
```

Das quatro saídas que ele oferece, escolhi a segunda (APAGUE) e não a quarta
(declarar como dívida): **a varredura desta casa é o `observar` + o
`ler_no_do_kernel`**, e é lá que a exclusão precisa morar. Declarar como dívida
uma função que eu mesmo tinha acabado de escrever seria fabricar a lápide junto
com o corpo. O teste passou a cobrar os "quatro nós, dois controles" pelo
caminho do PRODUTO — quatro entradas no `observar`, duas curvas abertas — que é
o que se queria medir desde o começo.

**2. O código teve de crescer PARA BAIXO, e não por estética.** A primeira
versão punha `ESTADO_DE_CARGA` no alto do `backend_pydualsense.py` e uma seção
nova no docstring do `battery_journal.py`. Resultado:

```
REPROVOU -> citacoes-de-linha
26 citação(ões) de linha podre(s) em 21 documento(s) e 9 planilha(s)
```

Onze símbolos deste backend e dois do journal são citados por `arquivo:linha`
em `docs/data/mapa-controles.csv` e na referência canônica — e `docs/data/`
está no `nao_toca` desta sprint, então consertar as citações não era uma opção
que eu tivesse. A cura foi **não empurrar ninguém**: a tabela foi para o fim do
módulo (com a razão escrita ao lado dela), a prosa do journal desceu para as
funções novas, e as três edições que tinham de acontecer acima da última
citação (`:5451`, `_key_to_uniq`) ficaram **net zero em linhas** — o
`**self._carga(...)` no lugar da linha do `battery_pct`, e os dois kwargs numa
linha só no `read_state`. As onze citações abrem hoje no que prometem, e o
portão está verde.

---

## Qual mordida prova

Cinco mordidas, cada uma arrancada do arquivo de produção, vista reprovar e
devolvida. Saída inteira em `/tmp/mordidas-final.txt`.

**1. O filtro do vpad, arrancado dos dois pontos** (`ler_no_do_kernel` e
`observar`) — e ele reprova NOMEANDO, que é o que o enunciado pedia:

```
E  AssertionError: a varredura tem de devolver DOIS controles, não quatro — os
   dois `02fe:` são gamepads VIRTUAIS nossos, e o nó deles diz Charging/100 para sempre
E  assert 4 == 2
E  AssertionError: assert (100, 'Charging') == (None, None)
E  AssertionError: o vpad não pode abrir curva nenhuma
3 failed, 14 passed
```

O `(100, 'Charging')` do meio **é o defeito inteiro numa linha**: é o número que
nunca muda, lido de um aparelho que não existe.

**2. O espelho do prefixo, torcido para `"02ff"`** — o portão nomeia a cópia:

```
E  AssertionError: daemon/battery_journal.PREFIXO_DO_VPAD = '02ff' não é mais o
   prefixo que player_mac() forja ('02fe00000001') — a varredura de bateria
   voltaria a ler o nó do vpad, e ele diz Charging/100 para sempre
9 failed, 8 passed
```

**3. A guarda do `Level`, arrancada** — o controle sem report volta a mentir:

```
E  AssertionError: assert 'descarregando' is None
   where 'descarregando' = _read_battery_state_opt(namespace(battery=namespace(Level=0, State=0)))
```

**4. O par desfeito** — `battery_state` fora do `_carga`: `KeyError:
'battery_state'` no payload de `describe_controllers`.

**5. O campo tirado do `ControllerState`:**

```
E  TypeError: ControllerState.__init__() got an unexpected keyword argument 'battery_state'
E  AttributeError: 'ControllerState' object has no attribute 'battery_state'
E  AssertionError: assert 'buttons_pressed' == 'battery_state'
3 failed, 14 passed
```

**Com as curas de volta:** `34 passed`.

### O aparelho, lido ao vivo — e ele confirma o enunciado

Leitura **somente de leitura** de `/sys/class/power_supply` em 06/09/2026: nada
parado, nada escrito no aparelho, `systemctl` não chamado. Por isso a bancada
NÃO foi exigida — nenhum dos três caminhos que pedem `bancada.sh exigir` foi
tomado. Endereços na máscara da casa, pela própria função do produto:

```
02:fe:00:00:00:01    vpad=True   produto_le=(None, None)
44:46:48:00:00:03    vpad=False  produto_le=(100, 'Full')
```

O nó do vpad diz `Charging`/`100` com o controle dela `Full` e parado no cabo —
**o "número que nunca muda" está no disco dela agora**, e `ler_no_do_kernel` é
a primeira régua desta casa que o recusa.

---

## O que NÃO verifiquei

- **`ds.battery.State` com o aparelho vivo.** Não medi o handle da pydualsense
  com o daemon de pé: isso pede a bancada (parar/disputar o hidraw), e a prova
  de aparelho desta sprint é da MESA-DE-QUATRO-01 por decisão de rota
  (`D-0609-A-BANCADA-PROVA-NAO-BLOQUEIA`). **Há uma dúvida REAL a medir lá, e
  ela não é formalidade:** o comentário do ramo de fallback do `read_state`
  afirma que *"em runtime com hid_playstation ativo os valores não atualizam"*.
  Se isso valer também para `battery.State`, o campo novo nasce correto e MUDO
  no produto instalado, e a rota que responde de verdade é a do nó do kernel —
  que o journal já lê e que a tela ainda não recebe (ver abaixo). **O ensaio
  que decide é curto:** com um DualSense no cabo, comparar
  `controller.list → controllers[i].battery_state` com o `status` do nó do
  kernel do mesmo endereço, e depois tirar o cabo. Se o campo não se mexer
  quando o nó se mexe, a rota do handle é decorativa e a B1 precisa da rota 2.
- **A tela.** Nada de interface foi tocado, então não há foto nem clique: esta
  sprint faz o dado existir, e o redesenho decide como "100% · carregando"
  aparece no card.
- **A suíte inteira.** Rodei o meu escopo, a vizinhança de bateria e os 30
  arquivos que exercitam `describe_controllers` (874 testes verdes depois do
  ajuste da §"fora da posse"), mais a varredura de 2.588 testes que achou o
  portão da promessa solta. A suíte inteira é de quem coordena.
- **`0xa`, `0xb` e `0xf` num aparelho.** Os três casos de fora-de-faixa/erro
  vêm da tabela do driver e do dublê; nenhum controle desta bancada os produziu.

### O que mudou fora da posse, e por quê

`tests/unit/test_backend_multi_controller.py::TestDescribeControllers::test_descreve_cada_controle`
fixava o dicionário INTEIRO do payload e passou a reprovar com a chave nova.
Acrescentei `"battery_state": None` às duas entradas, com o comentário do
porquê. É consequência direta do contrato que esta sprint muda, não conserto de
trabalho alheio — mas fica declarado.

**`daemon/lifecycle.py` estava na posse e NÃO foi tocado**, e a razão é medida:
o único ponto de bateria dele é o `BATTERY_CHANGE`, cujo payload é um `int` e
cujo `BatteryDebouncer` **já emite a cada 5 s mesmo sem mudança nenhuma**
(`daemon/subsystems/poll.py:46`). Publicar de novo na borda do estado
comunicaria zero aos assinantes — o evento não tem onde carregar a palavra — e
economizaria no máximo 4,9 s. Seria mudança que parece trabalho e não é.

---

## O que sobrou para o próximo

1. **O `daemon.status` não carrega o estado.** `daemon/ipc_handlers.py:2225` e
   `:2630` montam `battery_pct` sozinho, e o arquivo não está na minha posse. A
   CLI (`cli/cmd_status.py`), o tray e a TUI leem dali — os três continuam
   dizendo só o número. O `controller.list` já carrega o campo; falta o irmão.
2. **A tela ainda não mostra.** Quem desenha o card
   (`interface/pacotes/a02_controles.py:1791`, `a08_conexoes.py:3470`,
   `a01_jogar.py:580`, `interface/jogar_vivo.py:858`) lê `battery_pct` e agora
   tem `battery_state` ao lado, de graça. **O texto é decisão dela** — as
   palavras do produto não são minhas para escolher.
3. **DEFEITO ACHADO E NÃO CURADO, e ele é da mesma família:** o docstring do
   `_read_battery_opt` promete preservar *"sem dado ainda (None)"* contra
   *"0%"*, e **não preserva** — `DSBattery.Level` nasce `0`, o `getattr` não vê
   `None` e o payload sai `battery_pct: 0`. Um controle recém-plugado mostra
   **0% falso**, que é exatamente o que aquele docstring diz que não pode
   acontecer. A cura é uma linha (`Level == 0` → `None`, o mesmo discriminador
   que usei no estado), mas ela muda um valor de payload que 147 arquivos de
   teste tocam — não é conserto para se fazer de passagem, no fim de uma
   sprint, sem medir os chamadores um a um.
4. **A varredura do sysfs tem dono futuro, e ele tem nome.** A função que
   apaguei (§"os dois recuos") é o instrumento natural do
   `controles_sem_driver` (`daemon/ipc_handlers.py`): um controle cuja probe
   abortou no kernel não tem handle e some da lista, **mas o nó de bateria dele
   fica no disco**. Quem fechar aquela frente escreve a varredura já com o
   chamador — e `e_no_do_vpad` está de pé, esperando.
5. **A `SPECS-A-PROCEDENCIA-01` tem duas células para marcar**, com o que este
   relatório mediu: `energia.bateria.percentual@dualsense` e
   `energia.bateria.leitura_hefesto@dualsense`. A nota de
   `energia.bateria.percentual` diz *"a cura NÃO entrou — `battery_journal.py`
   não tem uma única menção a `02:fe`, e o teste que a sprint prometeu não
   existe"*. **Entrou, e ele existe.** Os `codigo_ref` das duas linhas apontam
   para `backend_pydualsense.py:5538`, endereço que não é o do
   `_read_battery_opt` — não editei `docs/data/`, que está no meu `nao_toca`.
