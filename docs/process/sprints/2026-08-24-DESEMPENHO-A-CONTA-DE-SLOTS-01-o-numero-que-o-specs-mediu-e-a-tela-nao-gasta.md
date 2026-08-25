# DESEMPENHO · A CONTA DE SLOTS-01 — o número que o specs mediu e a tela não gasta

**24/08/2026. Frente C da leva "Configurações fecha a 0.9.5".
GRAU: MEDIDO**, exceto onde a linha diz **DESENHO** ou **NÃO VERIFICADO**.

```yaml
posse:
  DESEMP: [src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py]
cria:
  - src/hefesto_dualsense4unix/integrations/plano_de_radio.py
  - tests/unit/test_a_conta_de_slots_por_adaptador.py
  - tests/unit/test_o_teto_da_mesa_diz_o_que_faz.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/integrations/mesa_de_radio.py
  - src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
  - src/hefesto_dualsense4unix/core/rumble.py
  - src/hefesto_dualsense4unix/utils/maquina.py
```

Três arquivos alheios entram por necessidade e estão declarados na seção 8:
`secao_controles.py` (a caixinha do microfone SAI dele), `app/ipc_bridge.py`
(uma linha de rótulo) e os quatro testes que fixam a palavra "Orçamento".


> **▲ DUAS DECISÕES FECHARAM DEPOIS QUE ESTA SPRINT FOI ESCRITA, e elas mandam
> nela.** Leia antes de executar qualquer tarefa — o corpo abaixo ainda não foi
> reescrito por inteiro, e nos pontos de conflito **a decisão vence o texto**.
>
> 1. **`D-A-PALAVRA-ENTRADA`** (`docs/data/decisoes-dela.csv`): a tela diz
>    **"entrada"**, nunca "porta". Sai da frase dela: *"o número da entrada usb
>    salvaria muito como coluna"*. Vale para **todo texto de tela e toda
>    asserção de teste sobre texto de tela**; identificador de código pode
>    continuar `porta`. A varredura completa é da **CONFIGURACOES-O-LEXICO-01**,
>    que é a dona única do texto desta aba — não a faça aqui, ou duas frentes
>    editam a mesma frase.
> 2. **`D-PERFIL-DE-DESEMPENHO`**: os cinco degraus do "Orçamento" **não viram
>    três botões de teto**. Viram **um perfil** — `Tudo ligado` / `Bateria
>    longa` / `Eu escolho` — e o **microfone sai do perfil**, para linha própria,
>    porque é o único que capta a sala. Migração sem perda: `economia` →
>    Bateria longa; `balanceado`/`max`/`auto`/vazio → Tudo ligado; `custom` →
>    Eu escolho.


---

## O que esta sprint fecha

1. A seção passa a responder **a pergunta que decide o produto**: *cabem quatro
   controles com todas as features no rádio, nesta máquina?* Hoje ela não
   pergunta, não responde e não sabe que a pergunta existe.
2. **Quatro dos cinco botões da seção não fazem nada**, e um deles promete na
   dica um comportamento que este clique não produz. Medido na seção 3.
3. A caixinha "Microfone" muda de casa: sai de "Os controles" e vira
   **declaração por controle dentro do Desempenho**, alimentando a conta
   (`D-MICROFONE`).
4. O selo passa a dizer a verdade inteira: **1600 fatias é especificação**, os
   **260,4/276,7 por controle são medição de UM controle**, e a **soma de N
   controles nunca foi medida nesta casa** — o maior ensaio foi dois.
5. "Orçamento" → **"Desempenho"**, e o renome tem quatro pontas, não uma.

## O que ela NÃO faz

- **Não mede Bluetooth.** É trilha dela (D2, `SPRINT_ORDER.md` §0.7). A seção 7
  diz o que a tela não pode afirmar até lá — e a resposta é: **nenhuma pergunta
  de Bluetooth trava esta sprint**, porque tudo que ela desenha ou já está
  medido ou nasce carimbado como derivado.
- **Não renomeia nada além de Orçamento → Desempenho.** O resto do léxico é da
  Frente D.
- **Não desenha o mapa 2D** (Frente A) nem a ordem de serviço de porta
  (Frente B). Esta sprint **emite** uma ordem de redistribuição como dado puro;
  quem a desenha é a Frente B (tarefa `DESEMP-6`).
- **Não toca a barra "Rádio em uso" da seção Conexões.** Ela fica onde está e é
  da Frente B. A regra que impede duas verdades está na seção 5.3.
- **Não muda o esquema do disco.** `OrcamentoDeclarado.teto`
  (`utils/maquina.py:223`) e `ControleDeclarado.microfone`
  (`utils/maquina.py:208`) ficam como estão, letra por letra.

---

## 1. O defeito, em uma frase

**O produto mediu quanto do rádio cada controle gasta, sabe qual controle está
em qual adaptador, e a tela que se chama "Orçamento" não gasta esse número em
nada — ela oferece cinco botões dos quais quatro têm efeito idêntico: nenhum.**

---

## 2. O que está medido

Régua: o `src/` da árvore de hoje. Cada afirmação abaixo tem âncora
`arquivo:linha` ou comando.

### 2.1 A conta existe, é derivada de medição, e tem dono único

`integrations/radio_da_mesa.py` já é o dono dos números:

| constante | valor | procedência |
|---|---|---|
| `SLOTS_POR_SEGUNDO` em `radio_da_mesa.py:111` | 1600 | **especificação** do Bluetooth Classic (625 µs por fatia) |
| `SLOTS_POR_RELATORIO` em `radio_da_mesa.py:116` | 1 | **decisão R1** do PO — a metade de baixo da conta não existe na árvore |
| `HZ_INPUT_SEM_MIC` em `radio_da_mesa.py:127` | 260,4 | **medido**, A/B de 25/07/2026 |
| `HZ_INPUT_COM_MIC` em `radio_da_mesa.py:133` | 170,5 | **medido**, mesmo A/B |
| `HZ_AUDIO_COM_MIC` em `radio_da_mesa.py:138` | 106,2 | **medido**, mesmo A/B |

Os três medidos têm dono único desde a Z6-08: a tupla
`NUMEROS_MEDIDOS_NO_MAPA` em `radio_da_mesa.py:153-157` amarra cada constante à
célula `radio_ressalva` de `audio.microfone@dualsense` no
`docs/data/mapa-controles.csv`, e `scripts/validar-fala-de-tela.py` reprova
quando divergirem.

Os dois cortes das três palavras: `CORTE_FOLGADA` = 0,60 em
`radio_da_mesa.py:160` e `CORTE_APERTADA` = 0,85 em `radio_da_mesa.py:164`.

### 2.2 O produto sabe qual controle está em qual adaptador — confirmado no código

`adaptador_por_uniq` (`radio_da_mesa.py:265`) varre `/sys/class/hidraw/*/device/uevent`
e devolve `{uniq: HID_PHYS}`. Que o `HID_PHYS` seja o MAC **do adaptador** não é
inferência desta sprint: o próprio broker decide por ele, e o comentário é
literal em `hidraw_broker.py:281` — *"BT real tem HID_PHYS = MAC do adaptador"*.

Três propriedades que a leitura tem e que a conta precisa:

- **sem sudo, sem subprocesso, sem abrir `/dev`** — nada aqui disputa o hidraw
  com o daemon (`radio_da_mesa.py:294-296`);
- **controle no cabo devolve `""`** e não ocupa fatia de ninguém — é controle
  negativo medido nesta bancada em 22/08
  (`radio_da_mesa.py:284-288`, e o nó `test_o_controle_negativo_desta_bancada_e_o_cabo`
  em `tests/unit/test_medidor_de_radio.py:151`);
- **o número do jogador vem de graça**: `player_slot` já viaja em
  `state["controllers"]`, é o mesmo campo que o card lê em
  `secao_controles.py:754`. Não é preciso inventar fonte nenhuma para escrever
  "Jogador 1".

### 2.3 A tabela da conta, calculada com as constantes de hoje

Um adaptador, N DualSense no rádio, com `SLOTS_POR_RELATORIO = 1`:

```bash
python3 -c "
SIN=260.4; COM=170.5+106.2; T=1600
for n in range(1,7):
    for mic in (0,n):
        s=mic*COM+(n-mic)*SIN; f=s/T
        p='Folgada' if f<=0.60 else ('Apertada' if f<=0.85 else 'Cheia')
        print(f'{n} controles, {mic} com mic: {round(s)}/1600 = {f*100:.1f}% -> {p}')"
```

| controles | sem microfone | com microfone em todos |
|---|---|---|
| 1 | 260/1600 · 16,3 % · Folgada | 277/1600 · 17,3 % · Folgada |
| 2 | 521/1600 · 32,5 % · Folgada | 553/1600 · 34,6 % · Folgada |
| 3 | 781/1600 · 48,8 % · Folgada | 830/1600 · 51,9 % · Folgada |
| 4 | **1042/1600 · 65,1 % · Apertada** | **1107/1600 · 69,2 % · Apertada** |
| 5 | 1302/1600 · 81,4 % · Apertada | **1384/1600 · 86,5 % · Cheia** |
| 6 | 1562/1600 · 97,6 % · Cheia | 1660/1600 · 103,8 % · Cheia |

**Dois achados que a tela precisa dizer e não diz:**

1. **Quatro controles num adaptador só já lê "Apertada" SEM microfone nenhum**
   (65,1 %). A mesa cheia desta casa, hoje, com um dongle, já está fora do
   verde. Isso não aparece em lugar nenhum da aba.
2. **O microfone não é o vilão que a intuição sugere.** Ligar os quatro sobe de
   65,1 % para 69,2 % — **4,1 pontos**. Quem enche o adaptador é a quantidade de
   controles, não a ponte de áudio. A frase de capacidade que existe hoje
   (`secao_controles.py:437`, `frase_da_capacidade_do_mic`) diz o custo do
   microfone e **não diz isto**, que é a informação que muda a decisão dela.

### 2.4 O que a seção diz hoje, e é pouco

`secao_orcamento.montar` (`secao_orcamento.py:211-226`) empilha quatro coisas:
a fileira de cinco botões, a frase `QUANDO_VALE` (`moldura.py:65`), a tabela de
**uma linha** (`secao_orcamento.py:313-344`) e a frase `ALCANCE_DE_HOJE`
(`secao_orcamento.py:133-137`).

**Nenhuma delas menciona adaptador, controle, fatia ou rádio.** A seção que se
chama "Orçamento" não conhece o orçamento que o specs mediu.

---

## 3. O "Não sei" — o que os cinco degraus fazem HOJE, lendo o código

Ela: *"O foda ali é só o 'Não sei'. o que isso quer dizer. É desligado ou
automático? confuso."*

**A resposta medida é pior que a pergunta.** O único consumidor de
`orcamento.teto` no produto inteiro é `core/rumble.py:185`, alimentado pela
fonte fiada no boot em `daemon/lifecycle.py:794`
(`grep -rn "orcamento" src/hefesto_dualsense4unix/` devolve, fora do módulo da
seção, só o esquema, essa fonte e a linha da aba Rumble que EXIBE o teto).

E `teto_do_orcamento` (`core/rumble.py:80-84`) devolve teto para **uma** chave:

```python
if orcamento != _ORCAMENTO_COM_TETO:   # core/rumble.py:58 — "economia"
    return None
return RUMBLE_POLICY_MULT[_ORCAMENTO_COM_TETO]   # 0.3
```

| botão da tela | chave gravada | teto que ele impõe | o que ele faz de verdade |
|---|---|---|---|
| Economia | `economia` | 0,3 (`daemon/subsystems/rumble.py:83`) | **é o único que age**: a vibração não passa de 30 % em toda a mesa |
| Balanceado | `balanceado` | `None` | nada |
| Máximo | `max` | `None` | nada — a dica já confessa: *"Hoje faz o mesmo que o Balanceado"* (`secao_orcamento.py:112-115`) |
| Auto | `auto` | `None` | nada — **e a dica promete o que ele não faz**, ver abaixo |
| Não sei | ausência (`None`) | `None` | nada |

**A dica do Auto é fato errado, e sai** (regra dela de 11/08/2026: fato errado
se SUBSTITUI). O texto em `secao_orcamento.py:116-119` diz *"A vibração
acompanha a bateria: cheia joga inteira, pela metade cai para 70%, abaixo de 20%
cai para 30%. Nunca aumenta."* — isso é a escada de `_effective_mult` no ramo
`if policy == "auto"` (`core/rumble.py:195`), e `policy` ali é
`config.rumble_policy`, **a escolha da aba Rumble**. Clicar "Auto" nesta seção
não liga aquela escada, não a desliga, e não muda nada. A tela promete um
comportamento que o clique não produz — é o defeito que esta leva inteira existe
para não cometer.

**Portanto: a seção oferece cinco escolhas onde o produto tem dois estados** —
*com teto de 30 %* e *sem teto*. O "Não sei" não é o problema; ele é o único
botão dos quatro inertes que ao menos **admite** que não sabe.

### A redação — DECIDIDA em 24/08/2026, `D-PERFIL-DE-DESEMPENHO`

> **Este trecho foi SUBSTITUÍDO.** A versão anterior propunha três botões de
> **teto** (`Economia` / `Sem teto` / `Deixa como está`) e era um DESENHO à
> espera da palavra dela. Ela decidiu outra coisa, e maior: os cinco degraus não
> viram três tetos — viram **um perfil**, que governa o que fica ligado, e o
> **microfone sai dele**. O desenho velho sai por inteiro, pela regra de
> 11/08/2026: fato errado se substitui, não se guarda ao lado do certo.

**Um perfil, três escolhas**, e cada uma diz o que liga:

```
Perfil de desempenho
  [ Tudo ligado ]  [ Bateria longa ]  [ Eu escolho ]

  Tudo ligado ..... gatilho adaptativo, vibração no que o jogo pedir,
                    barra de luz, giroscópio e touchpad.
  Bateria longa ... vibração com teto de 30% e barra de luz apagada.
                    Gatilho, giroscópio e touchpad continuam.
  Eu escolho ...... abre os ajustes de cada aba, um por um.
```

**E o microfone NÃO entra no perfil.** Linha própria, logo abaixo:

```
Microfone   [ Desligado ]  [ Ligado ]
  Fica fora do perfil de propósito: é o único que CAPTA A SALA, e o único
  que muda a conta do rádio — 277 em vez de 260 vezes de falar por segundo.
  Nasce desligado, e só você o liga.
```

**Por que fora.** O `mapa-controles.csv` registra que ele nasce desligado por
**privacidade e banda**, não só banda. Perfil que liga microfone sozinho
transforma uma escolha de desempenho numa escolha de privacidade feita pelas
costas — e o público deste produto é quem não tem quem lhe explique isso depois.

**A migração não perde nada, e é 1-para-1:**

| valor no disco hoje | vira | por quê |
|---|---|---|
| `economia` | **Bateria longa** | é o único que impunha teto (0,3) |
| `balanceado`, `max`, `auto`, ausente | **Tudo ligado** | os quatro devolviam `None` — quatro nomes para um comportamento só |
| `custom` | **Eu escolho** | já era a escolha manual |

**O que fica em aberto, e não é desta sprint:** o interruptor de gatilho,
vibração e barra de luz continua existindo até alguém medir quanto ele poupa de
bateria. É a `D-INTERRUPTOR-DE-FEATURE` (estado **aberta**) e a sprint
[O-PRECO-EM-BATERIA-01](2026-08-24-O-PRECO-EM-BATERIA-01-o-botao-que-ninguem-sabe-se-serve.md).

"Deixa como está" no lugar de "Não sei" pela razão de `secao_orcamento.py:79-87`:
o `SegmentedSelector` é grupo de rádio e **ignora o clique no botão já
afundado**, então sem um botão próprio não existe gesto para desfazer uma
declaração feita por engano. O botão tem de continuar existindo; o rótulo é que
muda.

**O custo do colapso, na mesa:** `OrcamentoDeclarado.teto`
(`utils/maquina.py:223`) é um `Literal` que aceita `"auto"`, e o `extra="forbid"`
do pydantic recusa o **documento inteiro** quando não reconhece um valor. Por
isso o esquema **não muda**: quem já tiver `auto` no disco continua sendo lido,
e a tela mostra esse valor afundado em "Sem teto" com uma linha dizendo que
"Auto" saiu e por quê. Tirar `"auto"` do `Literal` transformaria o
`maquina.json` de quem o declarou em "não consegui gravar" — o sintoma errado
para a causa certa, que é o defeito que a `A2` já curou nesta aba.

---

## 4. As tarefas

Prefixo `DESEMP`. Cada uma traz **A MORDIDA**: o teste que reprova se a cura for
arrancada, com nome, afirmação e o que ele vê quando a cura sai.

### DESEMP-1 — "Orçamento" vira "Desempenho", e o renome tem quatro pontas

**O que muda.** `TITULO` em `secao_orcamento.py:58` passa a `"Desempenho"`. E,
porque o rótulo da seção aparece em outro lugar, `_CAMPOS_DA_MAQUINA["orcamento"]`
em `app/ipc_bridge.py:802` passa junto — é a frase que o rodapé usa para nomear
o campo descartado, e ela **nunca pode nomear o campo `orcamento`**. Mais a
docstring de `app/actions/config/__init__.py:23`.

**O que NÃO muda:** o nome do módulo (`secao_orcamento.py`), a chave `orcamento`
do esquema, e a chave `orcamento` do `_CAMPOS_DA_MAQUINA`. Renomear qualquer uma
das duas chaves é renomear campo de disco dela.

**Arquivos:** `secao_orcamento.py`, `app/ipc_bridge.py`,
`app/actions/config/__init__.py`, e os quatro testes que fixam a palavra
(`tests/unit/test_descartados_chegam_ao_rodape.py:71`,
`tests/unit/test_o_rodape_diz_o_que_grava.py`,
`tests/unit/test_a_aba_diz_quando_a_escolha_fica_guardada.py`,
`tests/unit/test_orcamento_dono_unico_do_valor_efetivo.py`).

**A MORDIDA.** Nó novo em `tests/unit/test_o_teto_da_mesa_diz_o_que_faz.py`:  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
`test_o_titulo_da_secao_e_o_rotulo_do_rodape_sao_a_mesma_palavra` — importa
`secao_orcamento.TITULO` e `ipc_bridge._CAMPOS_DA_MAQUINA["orcamento"]` e exige
que sejam a MESMA string. Arrancar a troca de uma das duas pontas: o teste
reprova com `'Desempenho' != 'Orçamento'`, nomeando qual das duas ficou para
trás. É o portão que impede a meia-correção — o defeito que a regra dela de
substituição existe para matar.

**Prova de tela:** COSMÉTICA. Ela ditou a palavra ("Orçamento" → "Desempenho")
nesta sessão; a foto vai DEPOIS, em lote.

### DESEMP-2 — Cada botão do teto diz o que faz, e a tabela mostra as colunas que faltam

**O que muda.**

1. A dica do "Auto" (`secao_orcamento.py:116-119`) **sai** e é substituída pelo
   que o botão faz: nada. Fato errado se substitui, sem nota e sem data.
2. `COLUNAS` (`secao_orcamento.py:123`) ganha as duas colunas que a tabela
   omite hoje — **Auto** e **Deixa como está**. Com as cinco colunas na tela, a
   própria tabela mostra que quatro delas dizem `SEM_TETO`
   (`secao_orcamento.py:128`), e a conversa sobre colapsar cinco em três deixa
   de ser argumento e vira uma imagem.
3. A fileira de botões e os rótulos, **se e quando** ela responder a P1 da
   seção 7.

**Arquivo:** `secao_orcamento.py`.

**A MORDIDA.** `tests/unit/test_o_teto_da_mesa_diz_o_que_faz.py`:  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
`test_nenhuma_dica_promete_o_que_o_botao_nao_faz` — para cada chave de `CHAVES`
(`secao_orcamento.py:77`), calcula `teto_do_orcamento(chave)`; quando o teto é
`None`, a dica **não pode** conter nenhum verbo de efeito ("cai para", "chega
com", "acompanha", "limita", "reduz"). Devolver o texto de bateria ao `auto`:
o teste reprova apontando a chave `auto`, o teto `None` e a frase
`"acompanha a bateria"`. E
`test_a_tabela_tem_uma_coluna_por_opcao_oferecida` compara `COLUNAS` com
`CHAVES + (ID_DE_NAO_SEI,)`: tirar uma coluna reprova nomeando a que sumiu.

**Prova de tela:** ESTRUTURAL para a dica e para os rótulos (texto reescrito);
COSMÉTICA para as duas colunas novas (a tabela já existe e o formato não muda).

### DESEMP-3 — Nasce `plano_de_radio.py`: a conta por adaptador, com nome de jogador  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**O que muda.** Módulo novo, puro, **sem `gi` e sem varredura própria de
`/sys`** — ele recebe o que `radio_da_mesa` já sabe e responde as três perguntas
que faltam.

**Arquivo:** `src/hefesto_dualsense4unix/integrations/plano_de_radio.py` (novo).  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

```python
@dataclass(frozen=True)
class PlanoDoAdaptador:
    endereco: str                     # "" = não sei de quem é
    jogadores: tuple[int | None, ...] # player_slot de cada controle, na ordem
    com_mic_de_pe: frozenset[str]     # uniq com a ponte SUBIDA (bt_mic.uniqs)
    com_mic_declarado: frozenset[str] # uniq que ELA marcou (maquina.json)
    agora: Ocupacao                   # a conta do que está de pé
    planejada: Ocupacao               # a conta do que ela marcou

def plano_por_adaptador(controles, *, com_ponte_de_mic, mic_declarado, ...) -> dict[str, PlanoDoAdaptador]
def cabe_mais_um(ocupacao: Ocupacao, *, com_mic: bool) -> tuple[bool, Ocupacao]
def ordem_de_redistribuicao(planos) -> Redistribuicao | None
```

Três regras, e as três são de honestidade:

- **`agora` e `planejada` são duas contas, não uma.** `agora` é alimentada por
  `bt_mic.uniqs` — os `uniq` cuja ponte **subiu**, não os que ela pediu
  (`radio_da_mesa.py:346-351`). `planejada` é alimentada pela declaração dela.
  Quando as duas divergem, a tela diz as duas — é a regra do produto responder
  pelo **efeito** e não pelo pedido;
- **`cabe_mais_um` não inventa aritmética**: soma `HZ_INPUT_SEM_MIC` ou
  `HZ_INPUT_COM_MIC + HZ_AUDIO_COM_MIC` sobre a `Ocupacao` que recebeu e
  devolve a palavra por `palavra_da_ocupacao` (`radio_da_mesa.py:252`). Nenhum
  corte novo, nenhuma constante nova;
- **nenhuma palavra de culpa.** O módulo importa `PALAVRAS_DE_CULPA`
  (`radio_da_mesa.py:182`) e o teste varre contra tudo que ele produz. A
  desigualdade de quase o dobro entre dois controles do mesmo adaptador
  continua ABERTA (`radio_da_mesa.py:49-55`), e ocupação não é qualidade.

**A MORDIDA.** `tests/unit/test_a_conta_de_slots_por_adaptador.py`:  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

- `test_dois_controles_no_mesmo_adaptador_viram_um_plano_com_dois_jogadores` —
  dois `controllers` com o mesmo `HID_PHYS` e `player_slot` 1 e 2 produzem UM
  plano com `jogadores == (1, 2)`. Arrancar o agrupamento por endereço: dois
  planos, e o teste reprova mostrando duas barras de 260 onde deveria haver uma
  de 521;
- `test_a_ponte_pedida_e_a_ponte_de_pe_sao_duas_contas` — um controle com a
  ponte declarada e **não** subida: `planejada.slots_audio > 0` e
  `agora.slots_audio == 0`. Arrancar a separação (alimentar as duas com a
  declaração): o teste reprova com `agora.slots_audio == 106.2`, que é o produto
  respondendo pelo pedido;
- `test_cabe_mais_um_com_mic_no_adaptador_de_tres` — três controles sem mic
  (781/1600) mais um com mic devolve `(True, 1058/1600)` e a palavra
  "Apertada"; com cinco já de pé devolve `(False, …)` e "Cheia". Trocar
  `palavra_da_ocupacao` por um corte próprio: reprova nos dois nós;
- `test_o_plano_nao_carrega_palavra_de_culpa` — varre `PALAVRAS_DE_CULPA` sobre
  todo texto que o módulo produz.

**Prova de tela:** não é tela. Sem carimbo.

### DESEMP-4 — "Quem usa microfone" muda de casa

**O que muda.** A caixinha do microfone SAI de "Os controles" e nasce dentro do
Desempenho, no formato que ela aprovou (`D-MICROFONE`).

**O que REMOVER de `secao_controles.py`, item por item:**

| o quê | onde | destino |
|---|---|---|
| `TEXTO_DO_MIC`, `DICA_MIC_NO_RADIO`, `DICA_MIC_NO_CABO`, `DICA_MIC_SEM_ENDERECO` | `secao_controles.py:407-429` | movem para `secao_orcamento.py` |
| `frase_da_capacidade_do_mic` e o `_numero` que ela usa | `secao_controles.py:437` e `:432` | movem, **e a frase é reescrita** (ver DESEMP-5). `_numero` não tem outro consumidor — `grep -n "_numero(" secao_controles.py` devolve só as quatro linhas dela |
| `pode_ligar_o_mic`, `dica_do_microfone` | `secao_controles.py:466` e `:483` | movem inteiras, com as quatro condições |
| `class _BlocoDoMicrofone` | `secao_controles.py:499` | vira `_CaixinhaDoMicrofone` na nova casa — `Gtk.CheckButton` numa grade de dois por dois, não encaixado em card |
| `self._microfones` e `self._mic_declarado` | `secao_controles.py:599` e `:604` | somem daqui |
| a leitura `meu.get("microfone")` | `secao_controles.py:794` | some daqui; a nova casa lê pelo mesmo caminho (`_declaracoes`) |
| `self._pendurar_o_microfone(card, dados)` | `secao_controles.py:954` | some a chamada |
| `_pendurar_o_microfone` | `secao_controles.py:990-1013` | some o método |
| `_ao_alternar_o_microfone` | `secao_controles.py:1017-1032` | move, com o `True if ligado else None` intacto |
| o `pack_start` da frase de capacidade | `secao_controles.py:635` | some daqui |

**As três regras dela de 22/08 viajam junto, e nenhuma se perde:**

1. **por controle** — uma caixinha por DualSense adotado na mesa;
2. **nasce desligado** — desligar grava `None`, nunca `False`
   (`utils/maquina.py:195-200`);
3. **sempre visível, só acionável no rádio** — no cabo a caixinha aparece
   apagada, com `DICA_MIC_NO_CABO` dizendo por quê.

**O que muda de verdade na regra 3:** no card, "sempre visível" queria dizer
"visível naquele card". Na nova casa a lista é a dos controles presentes, então
**controle que não está na mesa não ganha caixinha** — ver P2 da seção 7, que é
onde o desenho dela mostra quatro fixas.

**Arquivos:** `secao_orcamento.py` (recebe), `secao_controles.py` (perde),
`tests/unit/test_o_interruptor_do_microfone_na_aba_configuracoes.py` (viaja com
o código).

**A MORDIDA.** O arquivo de teste **inteiro** viaja e continua mordendo — é o
aceite da mudança de casa. Os quatro nós que não podem afrouxar:
`test_no_cabo_o_interruptor_aparece_apagado` (:169),
`test_o_valor_inicial_nao_declara_nada_sozinho` (:197),
`test_desligar_volta_para_nao_sei_e_nao_grava_um_false` (:288) e
`test_a_secao_nao_manda_ipc_nenhum_no_clique` (:321). Mais um nó novo:
`test_nenhuma_caixinha_de_microfone_sobrou_nos_controles` — anda a árvore de
widgets da seção "Os controles" montada e exige **zero** rótulos iguais a
`TEXTO_DO_MIC`. Deixar o bloco velho no lugar por engano (o defeito clássico de
mudança de casa, que deixa as duas vivas): reprova nomeando o card em que
achou.

**Prova de tela:** ESTRUTURAL. Muda o que se vê ao abrir em DUAS seções.

### DESEMP-5 — A conta chega à tela: por adaptador, quem está nele, quanto sobra

**O que muda.** O Desempenho ganha o bloco que ela aprovou, e ele é a resposta à
pergunta que decide o produto:

```
Desempenho · quem usa microfone
  [x] Jogador 1    [x] Jogador 2
  [ ] Jogador 3    [ ] Jogador 4

  Adaptador "Hub 9"  · Jogadores 1 e 2, com microfone   553/1600  ▓▓▓░░░░░  Folgada
  Adaptador "Hub 15" · Jogadores 3 e 4, sem microfone   521/1600  ▓▓▓░░░░░  Folgada
  Cabe mais um controle com microfone no "Hub 9": sim — ficaria em 830 de 1600.
```

Sete decisões de desenho, cada uma com o motivo:

1. **O nome do adaptador é o nome DELA**, nunca `hciN`. `hciN` é a vaga, não o
   aparelho — medido hoje: o serial `ACA7F1000041`, que a decisão
   `D-HCI1-BLOQUEADO` chamava de `hci1`, **é o `hci0` agora**. A junção
   nome↔endereço já existe em `secao_mesa.py:1541` (`_apelido_por_endereco`);
   esta seção a consome pelo `plano_de_radio`, não a reimplementa.
2. **A caixinha é declaração, a barra é efeito.** Marcar não liga a ponte: quem
   grava é o "Aplicar" do rodapé e quem sobe a ponte é o daemon. A frase
   `QUANDO_VALE` (`moldura.py:65`) fica no pé da seção dizendo isso.
3. **Quando declarado e de pé divergem, aparecem os dois.** Uma segunda linha:
   *"Você marcou o microfone do Jogador 3, e ele ainda não subiu."* Ausência de
   notícia lida como notícia de sucesso é o padrão que a queixa do Sackboy
   revelou.
4. **A conta usa `player_slot`**, o campo que já viaja no estado
   (`secao_controles.py:754`). Controle sem número entra como "Sem número
   ainda" (`secao_controles.py:129`), nunca chutado.
5. **Sem resposta do daemon a barra não diz "Folgada".** É a cura da B1, medida
   em 23/08: com o Hefesto parado as três barras diziam "Folgada", em verde,
   `0/1600` — byte a byte a tela de um rádio vazio. A seção copia o
   `_daemon_respondeu` de `secao_mesa.py:1183-1196` e o teste
   `test_b1_o_medidor_sem_daemon_nao_diz_folgada.py` é o molde.
6. **A frase de capacidade do microfone é reescrita**, e passa a dizer o achado
   de 2.3: *"Ligar o microfone dos quatro sobe o adaptador de 1042 para 1107 das
   1600 fatias — 4 pontos. Quem enche o adaptador é a quantidade de controles,
   não o microfone."* Os números continuam derivados das constantes, nunca
   digitados (é o contrato de `frase_da_capacidade_do_mic`,
   `secao_controles.py:437-463`).
7. **Um pedido de estado próprio**, no molde exato de
   `secao_mesa._pedir_o_estado` (`secao_mesa.py:734-782`): `call_async` com
   `STATE_IPC_TIMEOUT_S`, guarda de `_mesa_leitor` para a bancada do retrato
   (o `state_full` desta máquina traz o MAC dela e nenhum portão de anonimato
   varre imagem), e ponto de injeção `host._desempenho_leitor` para o teste. É
   o **segundo** `state_full` por entrada na aba — dívida declarada, e o
   conserto (um leitor só, compartilhado) está na seção 9.

**Arquivos:** `secao_orcamento.py`; consome `plano_de_radio.py`.  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**A MORDIDA.** Em `tests/unit/test_a_conta_de_slots_por_adaptador.py`:  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

- `test_a_secao_nomeia_o_adaptador_e_nunca_o_hci` — monta a seção com um plano
  cujo apelido é "Hub 9" e varre a árvore de widgets: nenhum texto casa
  `hci\d`. Trocar o rótulo pelo nome da interface: reprova mostrando `hci0`;
- `test_sem_resposta_do_daemon_a_palavra_nao_e_folgada` — molde do
  `test_b1_o_medidor_sem_daemon_nao_diz_folgada`. Arrancar o `_daemon_respondeu`:
  reprova com as duas telas idênticas;
- `test_o_declarado_que_nao_subiu_aparece_na_tela` — declaração com microfone e
  `bt_mic.uniqs` vazio produz a segunda linha. Arrancar: reprova com a linha
  ausente, que é a tela dizendo "está tudo certo" sobre uma ponte no chão;
- `test_a_frase_de_capacidade_continua_derivada` — o nó
  `test_a_frase_de_capacidade_e_derivada_do_medidor`
  (`tests/unit/test_o_interruptor_do_microfone_na_aba_configuracoes.py:390`)
  viaja com a frase. Digitar "1042" à mão: reprova ao mexer em
  `HZ_INPUT_SEM_MIC`.

**Prova de tela:** ESTRUTURAL. É o que nasce visível ao abrir a seção.

### DESEMP-6 — Quando NÃO cabe, a tela manda redistribuir

**O que muda.** Quando um adaptador passa de `CORTE_APERTADA`
(`radio_da_mesa.py:164`, 0,85) **e existe outro adaptador com folga**, a seção
emite uma ordem de serviço no formato `D-ORDEM-DE-SERVICO`:

```
▲ 1 mudança recomendada
  Mova um controle do "Hub 9" para o "Hub 15"
   • O que eu vi aqui: 5 controles no mesmo adaptador,
     1384 de 1600 fatias.                    [derivado da conta]
   • Por que importa: o rádio de um adaptador é uma fila só.
     Passando do teto, os relatórios do controle atrasam.  [especificação]
   • Ganho esperado: o "Hub 9" cairia para 1107 de 1600, e
     o "Hub 15" subiria para 277.            [derivado da conta]
     [Já movi — reexaminar]   [Ignorar]
```

**A fronteira com a Frente B, declarada:** `ordem_de_redistribuicao` devolve
**dado puro** (`plano_de_radio.py`, sem `gi`); quem desenha a caixinha da ordem  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
de serviço é a Frente B, e o contrato é o `dataclass`. Enquanto o desenho dela
não existir, esta seção renderiza as três linhas com `rotulo_de_apoio`
(`moldura.py:294`) e os selos em texto. A troca do renderizador **não muda uma
linha** do dado.

**O caso que a ordem NÃO cobre, e a tela diz:** um adaptador só. Aí não há para
onde mover, e a ordem vira outra frase: *"Todos os controles estão no mesmo
adaptador, e é o único que você tem. Um segundo adaptador dividiria a fila."*
Mandar mover para lugar nenhum seria pior que calar.

**Arquivos:** `plano_de_radio.py`, `secao_orcamento.py`.  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**A MORDIDA.** `test_a_ordem_so_nasce_quando_ha_para_onde_mover` — com um
adaptador em 1384/1600 e nenhum outro, `ordem_de_redistribuicao` devolve `None`
e a tela mostra a frase do adaptador único. Arrancar a guarda: reprova com uma
ordem cujo destino é o próprio adaptador de origem — a tela mandando a pessoa
mover um controle para onde ele já está. E
`test_a_ordem_calcula_o_ganho_e_nao_o_promete` — o "Ganho esperado" nomeia as
duas ocupações depois da mudança e **não** contém adjetivo de resultado; o
`PALAVRAS_DE_CULPA` varre.

**Prova de tela:** ESTRUTURAL. Texto novo e uma caixa que nasce visível.

### DESEMP-7 — O selo diz as três procedências, e confessa o que nunca foi medido

**O que muda.** O selo de hoje é uma frase só: `_SELO_DE_PROCEDENCIA =
"derivado da especificação"` (`secao_mesa.py:294`). Ele defende o 1600 e
**cala sobre o resto**. Na conta do Desempenho o selo passa a ter três partes,
que é a coluna `de_onde_sei` do mapa de canais chegando à tela:

| o quê | selo |
|---|---|
| as 1600 fatias por segundo | **especificação de terceiro** (Bluetooth Classic, 625 µs) |
| 260,4 sem microfone · 276,7 com | **medido aqui** — A/B de 25/07/2026, **um** controle |
| a soma de N controles | **derivado da conta** — e nunca medido |

E, quando o plano tem **três ou mais** controles no mesmo adaptador, uma linha a
mais, porque é aí que a extrapolação começa a doer:

> Esta conta soma o custo medido de **um** controle. O maior ensaio desta casa
> no rádio foi de **dois** — quatro ao mesmo tempo nunca foi medido.

**Isso não é modéstia, é o que a árvore diz.** O cabeçalho de
`radio_da_mesa.py:76-81` registra que a medição de 23/08 releu o denominador:
*"~800 relatórios/s é orçamento do ADAPTADOR, repartido entre os controles que
ele hospeda — não uma taxa por controle. O modelo aditivo de `HZ_INPUT_SEM_MIC`
assume o contrário."* Se aquela leitura estiver certa, o modelo aditivo
**superestima** a ocupação: ele diz 1042 onde o adaptador entregaria ~800
repartidos. Superestimar é o lado seguro — a barra fica laranja antes da hora,
nunca depois —, mas é divergência conhecida, e conhecida sem selo vira medição
aos olhos de quem lê.

**Arquivos:** `plano_de_radio.py` (o texto do selo mora com o número),  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
`secao_orcamento.py`.

**A MORDIDA.** `test_o_selo_nomeia_as_tres_procedencias` — o selo de um plano de
dois controles contém as três palavras-chave (`especificação`, `medido`,
`derivado`). Arrancar qualquer uma: reprova nomeando a que sumiu. E
`test_com_tres_controles_o_selo_confessa_a_extrapolacao` — o plano de três
carrega a frase do ensaio de dois; o de dois, não. Arrancar o corte: reprova com
a frase aparecendo no plano de um controle, onde a conta É a medição.

**Prova de tela:** ESTRUTURAL. Texto novo.

### DESEMP-8 — O teto que só alcança a vibração diz o que muda quando alcançar o resto

**O que muda.** `ALCANCE_DE_HOJE` (`secao_orcamento.py:133-137`) é honesto e
fica — mas hoje ele é uma frase digitada ao lado de uma tabela de uma linha, e
as duas podem divergir sem ninguém notar. A cura é a mesma de toda esta casa:
**um dono só**.

Nasce uma lista `LINHAS_DO_TETO` em `secao_orcamento.py`, com uma entrada por
coisa que o teto **deveria** alcançar, e um campo dizendo se ela **tem ponto de
aplicação**:

| linha | ponto de aplicação | o que a tabela mostra |
|---|---|---|
| Vibração | `core.rumble._effective_mult` (`core/rumble.py:129`) | a célula de hoje, calculada por `celula_do_teto` |
| Gatilhos | nenhum | "ainda não tem por onde ser limitado" |
| Barra de luz | nenhum | idem |
| Microfone por rádio | nenhum | idem |
| Giroscópio | nenhum | idem |

E `ALCANCE_DE_HOJE` **deriva da lista** em vez de repeti-la: *"Por enquanto o
teto alcança a Vibração e nada mais. Gatilhos, Barra de luz, Microfone por rádio
e Giroscópio entram quando ganharem esse ponto."* — os nomes saem da lista.

**Por que isto vale a altura que custa:** com as cinco linhas na tela, a pessoa
vê o que o teto **vai** alcançar e para de precisar da frase para saber. E
quando uma delas ganhar ponto de aplicação, mudar o campo na lista muda a
tabela **e** a frase, de uma vez.

**Arquivo:** `secao_orcamento.py`.

**A MORDIDA.** `test_a_frase_do_alcance_deriva_da_tabela` — acrescenta uma sexta
linha sem ponto de aplicação e exige que a frase a nomeie. Arrancar a derivação
(voltar a frase para um literal): reprova com a tabela mostrando seis e a frase
falando de quatro. E `test_so_a_vibracao_tem_ponto_de_aplicacao_hoje` — para
cada linha marcada com ponto, o módulo nomeado tem de existir e ser importável;
marcar "Gatilhos" como tendo ponto sem que exista reprova nomeando a linha. É o
portão contra a tela prometer teto que ninguém impõe.

**Prova de tela:** ESTRUTURAL para a frase derivada; COSMÉTICA para as quatro
linhas novas da tabela (formato já existente).

### DESEMP-9 — A altura: o que esta seção acrescenta e o que ela devolve

**Por que a tarefa existe.** A aba pede **2465 px numa janela de 1080**
(medição da `CONFIGURACOES-FECHA-01`, item 3 do "O que esta sprint fecha"), e as
três seções que **declaram** já nascem abaixo da dobra. Esta sprint acrescenta:
quatro caixinhas, uma barra por adaptador, uma linha de "cabe mais um", o selo
de três partes, quatro linhas de tabela e, às vezes, uma ordem de serviço.

**O que ela devolve**, e é o argumento que salva o orçamento: a caixinha do
microfone e a frase de capacidade **saem** de "Os controles" — um `CheckButton`
por card (até quatro ou cinco) mais um `rotulo_de_apoio` de ~200 caracteres.

**O que fazer:** medir, não estimar. O nó
`test_nenhuma_aba_isolada_estoura_o_orcamento`
(`tests/unit/test_layout_orcamento_altura.py:296`) já mede a aba isolada com
`GtkOffscreenWindow` e a escala de fonte que de fato sai:

```bash
.venv/bin/python -m pytest -q \
  tests/unit/test_layout_orcamento_altura.py::test_nenhuma_aba_isolada_estoura_o_orcamento \
  tests/unit/test_layout_orcamento_altura.py::test_nenhuma_aba_estoura_a_largura_da_janela
```

**A MORDIDA.** Os dois nós acima **são** a mordida, e eles já existem: se esta
sprint estourar o orçamento, eles reprovam nomeando a aba e o número. A tarefa é
rodá-los **antes e depois**, anotar os dois números no fecho da sprint, e — se
a soma for positiva — decidir o que colapsa (candidato: a tabela de
consequências nasce fechada num `Gtk.Expander`, que é decisão dela, P3 da
seção 7).

**Prova de tela:** COSMÉTICA (altura e quebra estão na classe pré-aprovada).

---

## 5. As três coisas que esta sprint recusa fazer, e por quê

### 5.1 Não duplica a barra "Rádio em uso"

Ela disse as duas coisas, e elas não se contradizem: *"radio em uso é ótimo, mas
deveria ficar ali no nome, adaptador, onde está, a barra, folgada"* (isso é a
**tabela de Conexões**, Frente B) e o `D-MICROFONE`, que põe uma linha por
adaptador dentro do **Desempenho**. São perguntas diferentes:

- **Conexões** responde *"que adaptadores eu tenho e onde eles estão?"* — a
  barra é uma coluna daquela tabela;
- **Desempenho** responde *"cabe o que eu quero fazer?"* — a conta é a seção
  inteira.

**A regra que impede duas verdades:** nenhum número é calculado duas vezes.
`radio_da_mesa` é o dono das constantes e da `Ocupacao`; `plano_de_radio` é o
dono do agrupamento por adaptador; as duas seções **desenham**, não calculam.

**A MORDIDA disso é um portão:** `test_ninguem_em_app_recalcula_a_conta_de_slots`
— molde literal de `test_nenhum_modulo_de_app_recalcula_a_escada`
(`tests/unit/test_orcamento_dono_unico_do_valor_efetivo.py:159`): varre
`src/hefesto_dualsense4unix/app/` por `1600`, `260.4`, `170.5`, `106.2` e por
aritmética sobre eles. Reprova nomeando arquivo e linha.

### 5.2 Não fala com o microfone

A janela **não** chama `integrations/dualsense_bt_audio`. O clique acumula em
`host._maquina_pendente`, o "Aplicar" grava, o daemon sobe a ponte. É o contrato
de `secao_controles.py:1025-1030`, e o susto de 16/08/2026 (`O-PS-PRESO`, em
`docs/process/estudos/`) é o motivo escrito.

### 5.3 Não muda o esquema nem a chave de disco

`orcamento.teto` continua `orcamento.teto`; `controles[*].microfone` continua
onde está. O que muda é **onde a pessoa clica** e **o que a tela diz**.

---

## 6. Prova de tela — o resumo por tarefa

| tarefa | classe | por quê |
|---|---|---|
| DESEMP-1 | **COSMÉTICA** | ela ditou as duas palavras nesta sessão |
| DESEMP-2 | **ESTRUTURAL** (dica e rótulos) · COSMÉTICA (colunas) | texto reescrito |
| DESEMP-3 | — | não é tela |
| DESEMP-4 | **ESTRUTURAL** | muda o que se vê ao abrir, em duas seções |
| DESEMP-5 | **ESTRUTURAL** | é o bloco novo que nasce visível |
| DESEMP-6 | **ESTRUTURAL** | texto novo e caixa que nasce visível |
| DESEMP-7 | **ESTRUTURAL** | texto novo |
| DESEMP-8 | **ESTRUTURAL** (frase) · COSMÉTICA (linhas) | frase reescrita |
| DESEMP-9 | **COSMÉTICA** | altura e quebra, classe pré-aprovada |

A foto sai de `docs/usage/assets/` **no turno desta frente**, e quem executa lê
os PNGs antes de dizer que fechou. **A captura é uma só para a leva inteira** —
`scripts/gui-captura/retratar_abas.py` reescreve as onze de uma vez, e duas
frentes rodando em paralelo gravam por cima uma da outra. Quem coordena decide o
turno.

---

## 7. Qual pergunta de Bluetooth trava esta sprint

**NENHUMA.** E isso é afirmação, não alívio.

As sete perguntas da trilha dela (`SPRINT_ORDER.md` §0.7) travam a tela quando
ela **afirma** que uma feature sai pelo rádio. Esta sprint não afirma nada
disso: ela conta fatias, e as fatias têm as três procedências carimbadas na tela
pela DESEMP-7. A pergunta que mais encosta — *"quantos DualSense por rádio o
produto sustenta, e com quantos adaptadores?"* — é exatamente a que o selo
**confessa não ter resposta**: o maior ensaio desta casa foi dois.

**O que a bancada dela fecharia, se ela quiser** (escrito como tarefa, com o
comando pronto — **não executado por esta sprint**):

**BT-D1 — a conta aditiva está certa?** É a medição que decide se a barra desta
seção diz a verdade ou superestima. Com dois DualSense no mesmo adaptador, medir
a taxa **pelo relógio do próprio aparelho** (o carimbo de tempo do sensor, a
régua que em 22/08 deu 398,3/400,2 Hz estáveis, contra 282–357 Hz instáveis do
laço de leitura), primeiro um controle sozinho, depois os dois:

- se a soma dos dois ≈ 2 × o solo → o modelo aditivo está certo, e o selo
  "derivado da conta" pode subir para "medido até dois";
- se a soma dos dois ≈ o solo → o denominador é do **adaptador**, e as
  constantes de `radio_da_mesa.py:127-138` mudam de significado. **É decisão de
  produto (R1/R3 do PO), não conserto de agente.**

**Custo:** dois controles, dois minutos, sem tocar em `hciN`. Fecha também a R4
da 0.9.5 (ensaio de rádio com degrau registrado).

### As perguntas que travam a EXECUÇÃO, e são dela

**P1 — Colapsar cinco botões em três?** — **RESPONDIDA em 24/08, e maior do que a pergunta.** Ela não escolheu três tetos: escolheu **um perfil** (`D-PERFIL-DE-DESEMPENHO`), com o microfone FORA dele. Ver a §"A redação" acima. O texto abaixo fica como o registro do que se mediu para chegar lá.

<!-- pergunta fechada; não redespachar -->

_(registro)_  A seção 3 mede que quatro dos cinco
fazem a mesma coisa: nada.
- **Colapsar** (recomendado): três botões, cada um com efeito distinto e dito.
  Custo: quem já declarou "Balanceado", "Máximo" ou "Auto" vê o botão dele
  virar "Sem teto" — o valor no disco não muda, a palavra na tela sim.
- **Manter cinco e só corrigir as dicas**: três botões passam a dizer "hoje faz
  o mesmo que o Balanceado", lado a lado. Custo: a tela fica honesta e absurda
  ao mesmo tempo, e ensina que a seção não sabe o que faz.
- **Manter cinco e DAR efeito aos outros**: é construir teto para gatilho, luz e
  giroscópio. Custo: não é esta leva nem esta versão.

**P2 — As caixinhas de microfone são quatro fixas, ou uma por controle presente?** — **RESPONDIDA em 24/08: uma por controle PRESENTE**, mais a linha "cabe mais um com microfone" (`D-MIC-SO-QUEM-ESTA-NA-MESA`). O obstáculo que decidiu: caixinha de controle que nunca esteve na mesa não tem MAC onde ser gravada, e marcar algo que o produto esquece é o F1.

<!-- pergunta fechada; não redespachar -->

_(registro)_
O desenho dela mostra quatro (`[ ] Jogador 3`, `[ ] Jogador 4`), e há um bom motivo:
planejar. A regra da casa puxa para o outro lado: caixinha para um controle que
não está na mesa é promessa que o produto não pode cumprir, e a conta contaria
fantasma.
- **Uma por controle presente** (recomendado), mais a linha *"Cabe mais um
  controle com microfone: sim — ficaria em 830 de 1600"*, que responde a
  pergunta do planejamento **sem** inventar controle. Custo: o desenho dela
  muda.
- **Quatro fixas**: fiel ao desenho. Custo: a conta precisa de duas colunas
  ("agora" e "se você ligar os quatro"), e a caixinha de um controle ausente não
  tem onde ser gravada — sem endereço de doze hexa não há chave no
  `maquina.json` (`secao_controles.py:1043-1048`).

**P3 — A tabela de consequências nasce aberta ou fechada?** Com as cinco linhas
da DESEMP-8 ela cresce, e a aba já pede 2465 px numa janela de 1080.
- **Fechada num `Gtk.Expander`** ("O que o teto faz com cada coisa"): devolve
  altura, e quem quer saber clica.
- **Aberta**: ninguém precisa descobrir que ela existe. Custo: altura, e a seção
  Desempenho empurra as de baixo para mais longe da dobra.

---

## 8. A posse, e as colisões desta leva

**Meu, sem disputa:**

- `src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py`
- `src/hefesto_dualsense4unix/integrations/plano_de_radio.py` (nasce aqui)  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
- `tests/unit/test_a_conta_de_slots_por_adaptador.py` (nasce aqui)  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
- `tests/unit/test_o_teto_da_mesa_diz_o_que_faz.py` (nasce aqui)  <!-- ref-externa: nasce nesta sprint, ainda não existe -->

**Colisões declaradas** — as quatro frentes correm em paralelo:

| arquivo | com qual frente | resolução sugerida |
|---|---|---|
| `secao_controles.py` | **Frente D** (a barra de pesquisa de cor: *"o user começa a escrever o nome do controle dele"*) e quem levar a porta USB ao card (*"eu não trago a informação de qual porta ele tá"*) | minha edição é **só remoção**, e ela é contígua nos blocos listados na DESEMP-4. Entro **primeiro**, num commit que só apaga; as outras frentes rebasam por cima. Se a ordem inverter, a remoção é o commit mais fácil de refazer |
| `secao_mesa.py` | **Frentes A e B** (mapa 2D e Conexões) | **não toco.** A barra "Rádio em uso" fica lá. O que preciso dela — `_apelido_por_endereco` (`secao_mesa.py:1539`) — passa a viver em `plano_de_radio.py`, e a Frente B **importa de lá** em vez de manter a cópia. Sem isso, duas junções nome↔endereço |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| `radio_da_mesa.py` | **Frente B** (a ordem de serviço precisa da conta) | **não toco.** As constantes e a `Ocupacao` ficam intocadas; tudo que é novo nasce em `plano_de_radio.py`, que importa dali |  <!-- ref-externa: nasce nesta sprint, ainda não existe -->
| `app/ipc_bridge.py:802` | **Frente D** (léxico), que renomeia "A mesa" → "Conexões" na linha 800 | duas linhas vizinhas do mesmo dicionário. Combinar quem edita: as duas trocas num commit só, de quem chegar primeiro |
| `docs/data/decisoes-dela.csv` | **todas as quatro** | uma linha por decisão, append no fim, nunca reordenar. Conflito de merge aqui é sempre "fique com as duas" |
| `tests/unit/test_o_interruptor_do_microfone_na_aba_configuracoes.py` | **ninguém, hoje** | viaja comigo (DESEMP-4). Se outra frente mexer nele, aviso antes |

**`depois_de`: nada.** Esta frente não depende de nenhuma outra para começar. A
DESEMP-6 **entrega dado** para a Frente B, não espera por ela.

---

## 9. O que sobrou para o próximo

1. **Um `state_full` por entrada na aba, não dois.** A DESEMP-5 abre o segundo
   (`secao_mesa._pedir_o_estado` é o primeiro). O conserto é um leitor único no
   nível da aba, com assinantes — e ele **toca `secao_mesa.py`**, território da
   Frente B, por isso não está aqui. Enquanto não nascer, os dois pedidos podem
   chegar em ordens diferentes e as duas seções mostrar contas de instantes
   diferentes. **NÃO VERIFICADO:** nunca vi as duas divergirem na tela.
2. **A medição BT-D1** (seção 7) — sem ela o selo "derivado da conta" fica, e
   deve ficar.
3. **O teto que alcança gatilho, luz e giroscópio.** A DESEMP-8 deixa as quatro
   linhas na tela dizendo que não têm ponto de aplicação. Cada uma entra na leva
   que lhe der esse ponto — e agora a tabela é o lugar onde isso se anota.
4. **O Pro Controller e o 8BitDo.** Esta conta é do Bluetooth Classic e o
   DualSense é o único aparelho cujas constantes foram medidas. Ela **tem** os
   dois, e eles voltam na 1.0 (decisão dela, 24/08: *"o negócio nasceu pra fazer
   o dualsense funcionar"*). Quando voltarem, `plano_de_radio` precisa de uma
   constante por família, não de uma só.
5. **`SLOTS_POR_RELATORIO = 1`** (`radio_da_mesa.py:116`) continua sendo a
   hipótese conservadora da decisão R1, e o número real depende do tipo de
   pacote que o link negociou (2-DH1, 2-DH3), que o produto não observa. Mexer
   nele muda a tela inteira e exige medição.
