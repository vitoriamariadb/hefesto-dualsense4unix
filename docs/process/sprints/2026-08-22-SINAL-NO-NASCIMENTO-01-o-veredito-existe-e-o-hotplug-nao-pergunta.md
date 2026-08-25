# SINAL-NO-NASCIMENTO-01 — o veredito existe, e o hotplug não pergunta

```yaml
posse:
  D1:
    - src/hefesto_dualsense4unix/integrations/sinal_da_barra.py
    - src/hefesto_dualsense4unix/daemon/connection.py       # só o bloco do carimbo
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py     # só `_nascimento_para`
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
cria:
  - tests/unit/test_a_porta_do_veredito_de_nascimento.py
bancada: false        # nenhuma medição de rádio; o sysfs do cabo basta
depois_de: [BARRA-MUDA-01]
nao_toca:
  - src/hefesto_dualsense4unix/integrations/mesa_de_radio.py
  - src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
  - src/hefesto_dualsense4unix/app/widgets/external_card.py
  - src/hefesto_dualsense4unix/daemon/lifecycle.py
  - docs/data/decisoes-dela.csv
```

<!-- 25/08/2026: o bloco acima NÃO existia quando esta frente foi despachada, e
     o recado da leva dizia que existia. Escrito aqui pelo executor, com a posse
     REAL do trabalho que ele fez. -->

**22/08/2026.** Continuação direta da
[BARRA-MUDA-01](2026-08-22-BARRA-MUDA-01-a-lampada-nao-se-le-o-nascimento-sim.md),
que entregou o módulo e declarou o que faltava ligar. Metade foi ligada no mesmo
dia, algumas horas depois — esta sprint é a outra metade.

**Estado:** E1, E2 e E3 ENTREGUES; a E4 ENTREGUE PELA METADE, com a outra
metade declarada aberta e o motivo abaixo.

> **▲ 25/08/2026 — A E1 ESTAVA ENTREGUE E NÃO RODAVA.** O filtro de "só os
> controles NOSSOS" comparava o `uniq` do sysfs (`aa:bb:cc:…`, COM os
> dois-pontos) com a chave do backend (`aabbcc…`, sem — `_key_to_uniq` passa por
> `norm_mac`). A comparação não casa nunca: a lista de instâncias saía vazia e o
> tique devolvia **zero carimbos**, de 22/08 até hoje. MEDIDO no `uevent` do
> DualSense que está no cabo desta máquina. O que escondia era o fixture, que
> falava a grafia do sysfs onde o produto lê a do backend. Curado em `116525b`;
> a régua nova está em `TestOEnderecoCasaAsDuasGrafias`.

---

## O defeito, em uma linha

**O produto sabe dizer se uma conexão nasceu condenada, e não pergunta na hora
em que ela nasce.**

## O que já está ligado, e o que não está — medido em 22/08

```
grep -rn 'Disconnect(' src/
  → integrations/gesto_de_reconexao.py:234

grep -rn 'limpo_para_conectar\|sinal_da_barra' src/ | grep -v integrations/sinal_da_barra.py
  → app/actions/config/secao_controles.py:280   (instancias_dualsense)
  → app/actions/config/secao_controles.py:1105  (limpo_para_conectar)
```

| Ponto de chamada da BARRA-MUDA-01 §7 | Estado hoje |
|---|---|
| o **botão de reconectar** consultar `limpo_para_conectar` antes de oferecer a cura | **LIGADO** — `secao_controles.py:1110`, no botão "A luz não acende" (`8b167cc`) |
| o **tique de hotplug** carimbar o veredito no nascimento | **LIGADO** na E1 — `daemon/connection.py::reconnect_loop`, no mesmo tique do `vigiar_escritor_cru` |

E `sinal_da_barra.ler_a_mesa()` — a metade de **diagnóstico** do módulo, a que
responde *"esta instância nasceu limpa?"* — estava com **zero chamadores em
`src/`**. O que aparecia na varredura é `mesa_de_radio.ler_a_mesa`, que é outra
função com o mesmo nome (ver "O que NÃO é"). **A E1 fechou isso:** o chamador é
`daemon/connection.py::carimbar_o_nascimento`.

## Por que importa

Sem o carimbo no nascimento, o veredito só existe enquanto o **diário** ainda
tem a linha `lightbar_escritor_cru_detectado`. É frágil por três razões
medidas na BARRA-MUDA-01:

1. o diário rotaciona, e a instância pode viver mais que a janela de retenção;
2. o carimbo de tempo do sysfs **não serve** de relógio de nascimento (derrubado
   com medição: `os.stat()` deu o mesmo instante nos quatro, sete minutos
   depois de um `ls -la` que batia com o kernel);
3. o defeito **persiste na instância** — matar a Steam não cura. Sem carimbo, o
   produto não tem como distinguir "está travada desde que nasceu" de "está
   normal", e é justamente essa distinção que decide se vale oferecer a cura.

O custo do silêncio é a experiência que ela já descreveu em 12/08 e que agora
tem nome: a cura parece **intermitente**. Ela funciona quando a mesa está limpa
na hora, e não funciona quando não está — e sem o carimbo ninguém consegue dizer
qual dos dois casos aconteceu.

## O que NÃO é

- **Não é reconectar sozinho.** O produto derruba e espera o PS dela, por
  decisão registrada: `gesto_de_reconexao` **não tem** função `reconectar` de
  propósito, e cancelar não reconecta. Esta sprint não muda isso.
- **Não é a E1 da LUZ-CEGA-01** (o doctor enxergar o controle no rádio), que
  fechou em `29c8a19`.
- **Não é `mesa_de_radio.ler_a_mesa`.** São duas funções homônimas em módulos
  diferentes: a de `mesa_de_radio` lê ocupação de adaptador para a seção "A
  mesa"; a de `sinal_da_barra` dá o veredito de nascimento. A colisão está
  registrada como achado próprio na E4.

---

## Entregas

### E1 — o tique de hotplug carimba o veredito — **ENTREGUE**

Na conexão de cada controle, chamar o lado de **diagnóstico** do módulo e
guardar o veredito **junto da instância**, não em variável global: a
BARRA-MUDA-01 mediu que instâncias travadas e sãs coexistem na mesma máquina, no
mesmo adaptador, no mesmo minuto.

**Prova:** com a fixture das seis instâncias da BARRA-MUDA-01, quatro nascem
carimbadas como condenadas e duas como sãs, sem ler o diário na hora da
pergunta.

**O que foi ligado:**

| onde | o quê |
|---|---|
| `integrations/sinal_da_barra.py` | `CartorioDoNascimento` + `Carimbo` — a memória do veredito, por instância |
| `daemon/connection.py` | `cartorio_do_nascimento_de(daemon)` e `carimbar_o_nascimento(daemon)` |
| `daemon/connection.py::reconnect_loop` | a chamada, logo depois do `vigiar_escritor_cru`, no mesmo tique |

`sinal_da_barra.ler_a_mesa()` saiu de **zero chamadores em `src/`** para um
chamador no caminho que o daemon roda.

#### A chave de casamento: **não é o `hw_version`**, e a medição é da própria casa

O recado desta frente pedia `hw_version` e pedia que eu dissesse por quê caso
ele não servisse. **Ele não serve, e quem já tinha derrubado isso é a canônica**
(`docs/protocol/dualsense-referencia-canonica.md`, seção *"O `hardware_version`
do sysfs distingue as unidades, e NÃO é a cor"*, **MEDIDO 15/08/2026**):

> *"Hoje ele separa os quatro **por acaso de lote**; **dois controles da mesma
> cor comprados juntos teriam o mesmo valor**. Serve como chave de diagnóstico
> e não serve como fonte de cor nem como **identidade estável de unidade**."*

`hardware_version` é **revisão de placa**. Dois DualSense do mesmo lote colidem,
e aí o carimbo de um apareceria no card do outro.

**E a premissa que sustentava a proposta é falsa.** A BARRA-MUDA-01 §1.1 diz
que o `hw_version` é *"a única impressão digital do PLÁSTICO que sobrevive à
reconexão (o MAC da instância muda…)"*. O MAC **não** muda — CONFERIDO em
22/08/2026 cruzando duas tabelas independentes, com uma semana de distância:

| `uniq` (mascarado) | `hw_version` — canônica, 15/08 | `hw_version` — bancada, 22/08 |
|---|---|---|
| `14:3a:9a:00:00:ab` | `0x00000711` | `0x00000711` (`.002B`) |
| `44:46:48:00:00:03` | `0x00000811` | `0x00000811` (`.0033`) |
| `a0:fa:9c:00:00:f0` | `0x00000710` | `0x00000710` (`.0034`) |
| `d4:2f:4b:00:00:d8` | `0x00001111` | `0x00001111` (`.0029`) |

Quatro de quatro. Se o MAC trocasse a cada instância, os quatro pares de 15/08
estariam mortos em 22/08.

**A chave que serve, então, são duas, e cada uma responde uma pergunta:**

1. **a chave do VEREDITO é a INSTÂNCIA** (o sufixo `.NNNN`). É o que a medição
   manda: o defeito é da CONEXÃO — matar a Steam não cura, e a mesma peça de
   plástico deu `.0028` travada às 18h06 e `.0033` sã às 19h51. Guardar por
   controle apagaria justamente a distinção que a medição produziu. Não é MAC e
   não é global;
2. **a chave para ACHAR o carimbo na tela é o `uniq`** (`do_uniq`), que é o
   endereço com que o produto inteiro já chama cada controle
   (`nos_hidraw_por_uniq`, `_edit_target_uniq`, os perfis). E isto **não** briga
   com a `O-ALVO-POR-MAC-E-BURACO-DE-TODAS-AS-ABAS`: aquela regra é sobre a tela
   editar **um alvo por vez** — o cartório carimba os N controles ao mesmo
   tempo, um por card, que é exatamente o molde que ela pediu.

O `hw_version` fica no carimbo como chave de diagnóstico, e `do_hw_version`
devolve **lista** — é a colisão de lote em forma executável.

#### Três correções que saíram no caminho, todas medidas

1. **meia régua absolvia.** `nascimentos_pelo_diario` prometia no docstring que
   "o kernel respondeu e o daemon não" viraria `nao_sei`, e o código devolvia
   `limpa` (o `sujo=False` de fábrica). Corrigido com `Nascimento.escritor_conhecido`;
2. **a leitura do diário custava 5,21 s.** MEDIDO na máquina dela, diário de
   quinze dias: `journalctl --user -u …service -o json` leva **5,21 s** sem
   recorte e **0,12 s** com `-S` de seis horas. Cinco segundos sairiam de um dos
   **dois** workers do executor que o daemon divide com o `read_state` — o padrão
   que a `HANG-01` baniu. Entrou `JANELA_DO_DIARIO_S = 6 h`; conexão mais velha
   que isso cai no `nao_sei` de "mais velha que o diário desta sessão";
3. **o Modo Nativo fabricaria "limpa".** Ali o daemon não sonda, por regra dela,
   então o diário **não** ganha a linha `escritor_cru_detectado` — e a ausência
   viraria inocência. O carimbo do Modo Nativo é `nao_sei`, explícito.

#### O custo por tique, e os três portões que o zeram

1. nenhum handle aberto (`nos_hidraw_por_uniq` vazio) → sai antes de tudo;
2. só as instâncias que o backend de fato segura — o sysfs enumera todo
   DualSense da máquina, e carimbar o do vizinho falaria de um controle que a
   tela nem lista;
3. o `journalctl` só roda quando sobrou instância **sem carimbo firme**.

Mesa parada = **zero** subprocessos, tique após tique. Conexão nova = uma
leitura de 0,12 s, e no máximo mais uma no tique seguinte (a janela de
nascimento é de 5 s e o tique online é de 30 s).

### E2 — o veredito aparece na tela — **ENTREGUE (25/08)**

O card de cada controle já tem o botão "A luz não acende". Falta a **razão**:
enquanto o veredito diz que aquela instância nasceu condenada, o card pode dizer
isso — e, quando `limpo_para_conectar` diz que a mesa **não** está limpa agora,
o botão explica por que reconectar não vai adiantar em vez de simplesmente
recusar.

**Regra dela, já valendo:** sempre visível, só acionável no rádio. Botão que
some ensina que a tela é instável.

#### O contrato de leitura, que a E1 já entrega

O widget é da E2; **o que ele lê já existe e não muda**. O carimbo vive no
daemon (`daemon._cartorio_do_nascimento`, criado por
`connection.cartorio_do_nascimento_de`), então falta só a porta de IPC —
`ipc_handlers.py` é território de outra frente e não foi tocado.

O que a tela precisa, por card (um card é um controle, endereçado por `uniq`):

```python
carimbo = cartorio_do_nascimento_de(daemon).do_uniq(uniq)   # Carimbo | None
```

| campo | o que é |
|---|---|
| `None` | **não carimbei** — a tela não afirma nada. Nunca leia isto como "limpa" |
| `carimbo.confianca` | `"suspeita"` / `"limpa"` / `"nao_sei"` |
| `carimbo.pede_reconexao` | `True` só em `suspeita` — é quando a cura se aplica |
| `carimbo.porque` | a frase em português, pronta para a tela. **Ela nunca diz "acesa" nem "apagada"**, e há teste que reprova se passar a dizer |
| `carimbo.instancia` | o sufixo `.NNNN` — a identidade da CONEXÃO |
| `carimbo.hw_version` | revisão de placa. Diagnóstico, nunca identidade |
| `carimbo.firme` | `False` = ainda dentro da janela de nascimento; o veredito pode piorar no tique seguinte |

O molde já existe: a mesma superfície do `SentinelaDeEscritorCru`, que a aba
Status lê pelo `_enrich_controllers_per_controller` **sem tocar em `/proc`**.

**As duas perguntas continuam separadas, e a E2 usa as duas:** o carimbo é o
DIAGNÓSTICO (*"esta conexão nasceu condenada"* — vira a razão no card) e
`limpo_para_conectar` é o PROGNÓSTICO (*"reconectar agora adianta?"* — já guarda
o botão desde `8b167cc`). Confundi-las é o defeito que a BARRA-MUDA-01 §5
descreve.

#### O que foi ligado em 25/08

| onde | o quê |
|---|---|
| `daemon/ipc_handlers.py::_nascimento_para` | a porta: o carimbo vira o campo `nascimento` do payload por controle |
| `daemon/ipc_handlers.py::_enrich_controllers_per_controller` | a chamada, ao lado do `lightbar_disputada` |
| `app/actions/config/secao_controles.py::frase_do_nascimento` | a frase pura — e ela SÓ fala quando o veredito condena |
| `app/actions/config/secao_controles.py::_BlocoDaLuz` | a linha da razão, debaixo do botão que ela explica |
| `app/actions/config/secao_controles.py::_PainelDosControles._aplicar` | o veredito sai do payload e chega ao card, por `uniq` |

**A metade do PROGNÓSTICO já estava ligada** e não precisou de nada: o
`AVISO_DA_MESA_SUJA` entra ANEXADO à dica do botão desde 22/08, e a regra dela
("sempre visível, só acionável no rádio") continua literal — a mesa suja avisa,
nunca trava.

**Os três silêncios são desenho, não omissão.** Sem carimbo, `limpa` e `nao_sei`
não escrevem nada no card: ausência não é inocência E não é acusação; "nasceu
bem" em todo card é ruído crônico; e alarme sem medição atrás treina a pessoa a
ignorar alarmes.

**AGUARDA O OLHO DELA.** Nenhuma foto de aba foi tirada nesta leva, por ordem de
quem coordena. A `PROVA-DE-TELA-01` continua devendo aqui.

### E3 — o portão que impede o módulo de virar enfeite — **ENTREGUE**

O `portao_a_casa_sabe_e_o_produto_nao_faz.py` passou a medir alcance por GRAFO
em `61ba2ab`. Conferir que `sinal_da_barra` está no alcance dos pontos de
entrada declarados **depois** da E1 — e, se não estiver, é porque a E1 não foi
ligada no caminho que roda.

**Medido em 22/08, com a régua do próprio portão** (`modulos_alcancados()` mais
uma varredura das citações resolvidas ao módulo de origem):

```
sinal_da_barra alcancado: True
 CITADO instancias_dualsense <- app.actions.config.secao_controles
 CITADO limpo_para_conectar  <- app.actions.config.secao_controles
 CITADO ler_a_mesa           <- daemon.connection      <- NOVO
 CITADO CartorioDoNascimento <- daemon.connection      <- NOVO
```

O portão continua reprovando três símbolos, e **nenhum é desta frente**:
`apelido_do_dongle::costurar_a_mesa`, `censo_do_barramento::filhos_de` e
`::hub_em_comum` — são da CENTRAL-SEM-TELA-01, e já reprovavam antes desta leva.

**A brecha que este exercício revelou, e que fica registrada:** o portão trata
citação vinda de OUTRO nó de topo do **mesmo módulo** como alcance. Era por isso
que `ler_a_mesa` não estava sendo acusado apesar de ter zero chamadores: o
`main()` da CLI do próprio `sinal_da_barra.py` o chamava. Não é a colisão de
nome da E4 — é uma regra do portão. Quem for endurecer o portão tem aqui o caso
de teste pronto.

### E4 — a colisão de nome sai — **METADE ENTREGUE (25/08)**

`integrations/mesa_de_radio.py` e `integrations/radio_da_mesa.py` coexistem, e
`ler_a_mesa` existe em `mesa_de_radio` e em `sinal_da_barra`. É a colisão de
nome que o portão A-CASA-SABE passou a pegar hoje — aqui ela está no produto.

O trabalho é escolher UM nome por conceito e renomear, com nota datada no que
sair. Não é cosmético: foi essa colisão que fez a primeira varredura desta
sprint parecer dizer que o veredito já estava ligado.

**FEITO em 25/08 — a função.** `sinal_da_barra.ler_a_mesa` virou
`veredito_do_nascimento`: ela nunca leu mesa nenhuma, lê o DIÁRIO e dá um
veredito. A de `mesa_de_radio` fica com o nome, porque nela ele descreve o que a
função faz. **Sem alias de compatibilidade**, de propósito: um manteria a
colisão viva. A nota datada de por que o nome saiu está no docstring do módulo.

**ABERTO — os dois módulos.** `integrations/mesa_de_radio.py` e
`integrations/radio_da_mesa.py` continuam coexistindo com as palavras trocadas.
Não é desta frente resolver HOJE: os dois são posse declarada de outras frentes
nesta leva (`mesa_de_radio` é da CONEXOES-MAPA-2D-01/MAPA-B; `radio_da_mesa`
está no `nao_toca` da DESEMPENHO-A-CONTA-DE-SLOTS-01), e renomear módulo alheio
no meio de uma leva é colisão garantida. Quem for fazer: são 2 arquivos de
`src/` renomeados e 14 citações a reapontar (`grep -rln "mesa_de_radio\|radio_da_mesa" src/ tests/ scripts/ docs/`).

---

## Como morde

`tests/unit/test_o_carimbo_do_nascimento_no_tique_de_hotplug.py` — 25 verdes.
**Doze mutações arrancadas e conferidas**, cada uma com a saída no relatório da
frente:

| mutação | reprova |
|---|---|
| a chamada sai do `reconnect_loop` | `test_o_reconnect_loop_chama_carimbar_o_nascimento` |
| "suspeita" passa a poder ser absolvida por leitura posterior | `test_leitura_posterior_nao_absolve` |
| a sonda ao vivo agrava qualquer instância (ignora a janela e o "sob nossos olhos") | 2 de `TestASondaAoVivoSoAgrava` |
| o cartório para de esquecer a instância morta | `test_a_instancia_que_some_e_esquecida` |
| `do_hw_version` volta a devolver um só | `test_a_busca_por_hw_version_devolve_lista` |
| meia régua volta a absolver | `test_escritor_desconhecido_e_nao_sei` |
| o recorte de seis horas some | 2 de `TestODiarioENoRecorte` |
| o portão do "só os nossos controles" sai | 2 de `TestOCarimboSoFalaDosControlesDoProduto` |
| o Modo Nativo volta a ler o diário | `test_o_modo_nativo_nao_fabrica_limpa` |
| o Modo Nativo agrava com a foto velha do sentinela | `test_o_modo_nativo_nao_agrava_com_foto_velha` |
| a consulta ao carimbo volta a ler o diário | `test_a_pergunta_depois_nao_le_o_diario` |
| nada é "firme" — o tique relê o diário a cada 30 s | `test_o_segundo_tique_nao_le_o_diario_de_novo` |

Uma armadilha, registrada porque ela quase deixou uma mordida passar em branco:
**`carimbar_o_nascimento` é best-effort de ponta a ponta e engole exceção**, então
um teste-bomba (`raise AssertionError` dentro de uma dependência) passa verde.
As mordidas que precisam provar que algo NÃO foi chamado usam contador, não bomba.

## O que ficou aberto depois da E1, da E2, da E3 e de meia E4 (25/08)

1. **A prova de tela.** O código e o teste estão de pé; o olho dela não passou
   por cima. `PROVA-DE-TELA-01`, e ninguém tirou foto de aba nesta leva;
2. **Os dois módulos homônimos** (E4, acima) — posse de outras frentes hoje;
3. **A `BARRA-MUDA-01` §7 tem uma linha caduca**: ela diz que o carimbo no
   nascimento estava por fazer. Está feito desde 22/08 — e desde HOJE está
   funcionando, que não é a mesma coisa;
4. **O `hw_version` viaja no payload e ninguém o lê.** Ele entrou porque o
   contrato de leitura desta sprint o declara, e a tela não usa. Quem for cortar
   verbosidade um dia: é uma chave por controle por segundo, e o motivo de estar
   lá é diagnóstico de suporte, não a tela.

## O que ficou aberto depois da E1 e da E3 (22/08, o registro da época)

1. **A E2 e a E4**, pelas razões acima. O contrato de leitura da E2 está escrito;
2. **A BARRA-MUDA-01 §1.1 carrega um fato derrubado:** *"o MAC da instância
   muda"*. A conferência das duas tabelas (acima) mostra que não muda. Não foi
   corrigido lá porque aquele documento é de outra frente; **o código já foi**
   (o docstring de `sinal_da_barra.Instancia`, que repetia a mesma frase);
3. **A brecha de auto-citação do portão A-CASA-SABE** (ver E3). Não é desta
   frente consertar, mas o caso de teste é este.

## O que este achado ensina

**Uma sprint escrita às 20h38 pode estar defasada às 21h19.** A BARRA-MUDA-01
registrou "zero chamadores" com o comando ao lado, e estava certa no instante em
que foi escrita. Quem for agir sobre o que uma sprint declara aberto **roda o
comando de novo antes**.

**E a régua da casa vence a régua da sprint.** Esta frente recebeu, no recado e
na sprint, a instrução de casar por `hw_version`. A canônica já tinha medido, em
15/08, que ele é revisão de placa e *"não serve como identidade estável de
unidade"* — sete dias antes de a proposta ser escrita. O custo de não conferir
teria sido o carimbo de um controle aparecendo no card de outro, no dia em que
ela comprar dois DualSense iguais.
