# A-TELA-NOVA-ENTRA-NA-RÉGUA-DO-MAPA-01 — a fala de tela só varria `app/`

**Agente F-MAPA · onda F · 06/09/2026 · branch `voo/A-TELA-NOVA-ENTRA-NA-REGUA-DO-MAPA-01-F-MAPA`**

## §0 — O ESTADO EM UMA LINHA

A régua da fala de tela passou a varrer `interface/` além de `app/` — **123
frases de transporte que ela não via entraram no alcance** —, o "quase não
mediu" ganhou piso que reprova quem encolher a régua, e o censo triou as 123
em **13 candidatas a remedição do mapa · 7 com lastro · 103 que não afirmam**.
Nenhuma frase de tela foi curada, nenhuma célula do mapa foi tocada.

---

## §1 — O QUE FECHOU, COM ENDEREÇO

### Passo 1 — a régua enxerga a tela nova

`scripts/validar-fala-de-tela.py`

| o quê | onde |
| --- | --- |
| `INTERFACE_RELATIVO` e `RAIZES_DE_TELA` — as duas raízes, nesta ordem | `:63`, `:89` |
| `descobre_falas_da_tela(raiz)` — `descobre_falas` em toda raiz | logo após `descobre_falas` |
| `descobre_frases_da_tela(raiz)` — o censo de toda raiz | logo após `descobre_frases_de_transporte` |
| `_caminho_da_aba(raiz, relativo)` — `ARQUIVOS_DA_ABA` procura em toda raiz | idem |
| `main()` chama as duas novas, e o censo publica o número **por raiz** | no `main` |

**A forma foi escolhida por medição, e é a que mexe em menos linhas com menos
risco.** `descobre_falas(app_dir, raiz)` e `descobre_frases_de_transporte(app_dir, raiz)`
**mantiveram a assinatura**: `scripts/gerar-mapa.py:833` e
`scripts/gerar-painel.py:210` as chamam com `RAIZ / mod.APP_RELATIVO`, e os dois
carregam a régua por `spec_from_file_location` — uma troca de assinatura os
quebraria em tempo de execução, sem nenhum portão de import para acusar. As
funções novas envolvem as velhas.

`app/` **não** foi trocada por `interface/`: ela continua sendo tela em parte, e
trocar uma pela outra devolveria o mesmo defeito virado para o outro lado.

### Passo 2 — o "quase não mediu" deixa de ser só aviso

| o quê | onde |
| --- | --- |
| `PISO_DA_REGUA = {"raizes": 2, "falas": 1, "numeros": 3, "abas": 0}` — **contado**, não digitado | `scripts/validar-fala-de-tela.py` |
| `valida_piso_da_regua(medido, piso)` — pura, comparação por `>=` | idem |
| `e_a_arvore_do_produto(raiz)` — o piso vale para o produto, e nunca se desliga calado | idem |
| a frase de sucesso passou a dizer o piso e as raízes varridas | `main()` |

**O piso saiu da medição:** `--all` contava, em 06/09/2026, `1 Fala declarada(s),
3 número(s) de tela e 0 aba(s) promovida(s)` com as duas raízes. Esses são os
números travados. **Hoje o portão continua verde, porque hoje É o piso** — o
verde de agora deixou de ser uma promessa e virou um chão. Amanhã, apagar a
única `Fala` do produto (`app/widgets/external_card.py:114`), perder um dos três
números de `NUMEROS_MEDIDOS_NO_MAPA`, despromover uma aba ou encurtar
`RAIZES_DE_TELA` reprova, nomeando o piso e o achado.

**Crescer PASSA.** A comparação é `>=`, e há mordida provando isso: uma régua
por igualdade puniria quem promovesse a primeira aba, que é o defeito que onze
réguas desta casa já tiveram.

**Por que o piso não vale para toda árvore:** as árvores de mentira da suíte
montam três arquivos num `tmp_path` para exercer UMA regra. `e_a_arvore_do_produto`
responde pelo disco (o mapa existe? as raízes de tela existem?), nunca por um
caminho gravado — a árvore do produto viaja em `git worktree`, e uma régua presa
a `/mnt/…/hefesto-dualsense4unix` mediria a árvore de outra pessoa. Quando ela
diz não, o `main()` **imprime a razão**: `PISO NÃO APLICADO: …`. E há teste que
reprova se a árvore real deixar de ser reconhecida — é a trava contra o
desligamento silencioso.

### A régua INFORMA, e não VETA — correção de rumo dela, 06/09/2026

> *"Esse mapa é funcional e real. tá desatualizado no sentido de não ter sido
> medido. foi e tudo funciona."*
> <!-- noqa-acento: citação literal dela -->

Uma célula em `aciona=não` quer dizer **ninguém escreveu a medição de volta**,
não *o aparelho não faz*. Nada do que entrou aqui reprova frase de tela por
causa de célula atrasada: o piso mede o tamanho do que a régua declara, e o
censo é **relatório**. O que a tela afirma vira **pista do que medir**, não
acusação.

---

## §2 — AS MORDIDAS, COM O QUE REPROVOU

Arrancadas uma a uma no roteiro real, vistas reprovar, e devolvidas.
`tests/unit/test_a_fala_de_tela_alcanca_a_interface_nova.py` — **11 casos,
todos verdes com a cura no lugar.**

| # | a cura arrancada | o que reprovou |
| --- | --- | --- |
| 1 | `INTERFACE_RELATIVO` apontado para `app` (a raiz da tela nova perdida) | 5 casos, e a mensagem NOMEIA o tamanho: *"a régua deixou de ver **123 frase(s)** de transporte, por raiz: `{'…/interface': 123}`"* |
| 2 | `RAIZES_DE_TELA` de volta a uma raiz só | `test_o_alcance_da_regua_so_cresce` (a catraca) + `test_a_raiz_unica_reprova_pelo_piso_do_alcance` (`raizes: a régua mede 1 e o piso é 2`) |
| 3 | `encolheu = valida_piso_da_regua(...)` trocado por `encolheu = []` | `test_a_raiz_unica_reprova_pelo_piso_do_alcance`, `test_despromover_uma_aba_reprova_dizendo_o_piso` **e**, de graça, o portão irmão `test_toda_fala_declarada_chega_a_tela::test_toda_checagem_do_portao_e_chamada_pelo_main` |
| 4 | o piso comparado por `==` em vez de `>=` | `test_promover_mais_uma_aba_passa_e_o_piso_nao_pune` — a régua passou a punir quem melhora, e o caso pegou |
| 5 | `e_a_arvore_do_produto` apontada para um mapa que não existe (o desligamento silencioso) | `test_a_arvore_de_mentira_nao_e_o_produto_e_a_de_verdade_e` + `test_o_portao_de_hoje_esta_no_piso_e_diz_qual_e` (`PISO NÃO APLICADO` na saída do produto) |

**As duas mordidas que a sprint pede, nominalmente:**

* *tire uma aba declarada* → `test_despromover_uma_aba_reprova_dizendo_o_piso`:
  `rc=1`, `abas: a régua mede 1 e o piso é 2 — aba(s) promovida(s) (ABAS_COM_FALA_DECLARADA)`.
* *acrescente uma* → `test_promover_mais_uma_aba_passa_e_o_piso_nao_pune`:
  `rc=0`, `3 aba(s) promovida(s)`, sem uma linha de `ENCOLHEU`.

**O número que a mordida 1 nomeia é medido, nunca digitado:** o teste roda uma
cópia do roteiro com as raízes literais DELE forçadas (o que a régua *deveria*
ver) contra o roteiro real (o que ela vê) e reprova pela diferença. Um literal
`123` ali envelheceria e puniria quem curasse uma frase.

---

## §3 — O CENSO DOS TRÊS BALDES

`--censo-de-transporte`, com o alcance novo, em 06/09/2026:

```
  src/hefesto_dualsense4unix/app:        47 frase(s) em 14 arquivo(s).
  src/hefesto_dualsense4unix/interface: 123 frase(s) em 18 arquivo(s).

170 frase(s) de transporte em 32 arquivo(s).
```

**As 123 de `interface/`, triadas:**

| balde | quantas |
| --- | --- |
| **1 · AFIRMA algo que a célula do mapa ainda não registra** — candidata a REMEDIÇÃO | **13** frases · **5** chaves |
| **2 · AFIRMA e o mapa sustenta** — nada a fazer | **7** |
| **3 · NÃO AFIRMA** — comentário, prosa do mockup, pedaço de f-string, fala do hospedeiro | **103** |

**A sprint media 227 e a régua conta 123, e as duas estão certas.** A conta de
227 é de todo literal com mais de 25 caracteres, docstring incluída (recontada
hoje: 231 em `interface/`, 163 em `app/`). A régua tira docstring, exige 12
caracteres e um espaço, e ignora o que já está dentro de uma `Fala(...)`. A
diferença é a blindagem declarada dela, não desacordo.

### §3.1 — BALDE 1: a fila de remedição do mapa

**Não é acusação à tela, e não é ordem de apagar frase.** É a lista de células
que precisam ser medidas de novo e marcadas, com o que a tela já afirma como
pista do que medir. **O `mapa-controles.csv` não foi tocado** — ele é `nao_toca`
desta sprint.

#### `identidade.cor_do_aparelho@dualsense` — 3 frases

Mapa hoje: `existe=tem` · cabo `sim/medido` · rádio `sim/medido`, os dois com
`ate_onde_foi = SAIU NO FIO`. A `radio_ressalva` diz que a leitura por rádio
está provada para **duas** unidades (hidraw8 em 27/08, hidraw5 em 02/09), não
para as quatro da bancada.

| onde | o que a tela afirma |
| --- | --- |
| `interface/aba09.py:1168` | *"· cor de fábrica só no cabo"* |
| `interface/aba08.py:3577` | *"os controles no rádio são os de borda neutra, porque o Hefesto **ainda não pergunta a cor pelo rádio** (ONDA-CONEXOES-11)"* |
| `interface/aba06.py:2691` | *"`hefesto_vivo._fita` DESISTE quando um controle da mesa não tem cor lida, que é **o caso do rádio hoje**"* |

**O que teria de ser medido:** se o PRODUTO pergunta a cor pelo rádio hoje. A
célula mede o CANAL (o aparelho responde — saiu no fio, duas unidades); as três
frases falam do produto (o Hefesto não pergunta). São dois fatos diferentes com
uma coluna só, e é isso que a remedição tem de separar: ou o produto passa a
perguntar e as três frases caem, ou a célula ganha a distinção escrita.

#### `identidade.cracha_nos_dois_transportes@dualsense` — 1 frase

Mapa hoje: cabo `sim/medido`, rádio `sim/medido`, `n = 4` unidades, `SAIU NO
FIO` nos dois. O rótulo da linha é literalmente *"O crachá que serve nos DOIS
transportes sem escrita (a pergunta dela)"*.

| onde | o que a tela afirma |
| --- | --- |
| `interface/pacotes/a09_sistema.py:559` | *"o serial só é lido no cabo"* |

**E a mesma árvore afirma o contrário**, com lastro (balde 2):
`interface/aba10.py:1505` — *"O endereço de rádio do controle… não muda quando
você troca o cabo pelo rádio"*. **O que teria de ser medido:** se "serial de
fábrica de 17 caracteres" (o que carrega a cor, `cabo_detalhe` da cor) e o MAC
do crachá são o mesmo objeto — a frase da aba Sistema pode estar falando do
primeiro e a célula do segundo.

#### `audio.microfone@dualsense` — 4 frases

Mapa hoje: cabo `sim/medido`, rádio **`parcial`/`medido`** com
`por_que_nao_aciona = divida`, `ate_onde_foi = MONTOU`. **O `radio_detalhe` da
própria célula diz `IMPLEMENTADO POR INTEIRO`** e cita a CANAL-POR-CONTROLE-01
de 03/09/2026 — o veredito da célula ficou atrás do detalhe dela mesma.

| onde | o que a tela afirma |
| --- | --- |
| `interface/pacotes/a08_conexoes.py:2261` | *"O microfone deste controle chega **pelo rádio**: o DualSense não tem A2DP nem HFP, então o áudio vem em Opus dentro do relatório HID e o Hefesto publica uma fonte de captura do PipeWire com ele."* |
| `interface/pacotes/a02_controles.py:2994` | *"no rádio, é o canal do microfone que **ainda não está de pé**"* |
| `interface/aba02.py:2079` (tooltip do modo Virtual) | *"É o que faz o mic soar **igual no cabo e no rádio**."* |
| `interface/aba02.py:2081` (tooltip do modo Nativo) | *"Pelo rádio isso depende do perfil que o adaptador negociou."* |

**Duas telas do mesmo produto se contradizem**: a Conexões diz que o microfone
chega pelo rádio e a Controles diz que o canal não está de pé. **O que teria de
ser medido:** o microfone por rádio, com o canal por controle de 03/09, nos
quatro aparelhos — e o resultado escrito em `radio_aciona`. A quarta frase pede
uma medição própria: o `radio_detalhe` de `audio.alto_falante@dualsense` diz que
o controle **não anuncia perfil de áudio Bluetooth padrão**, o que torna
duvidoso o *"depende do perfil que o adaptador negociou"*.

#### `luz.lightbar.release_leds@dualsense` — 3 frases

Mapa hoje: cabo `não`/`medido` com `por_que_nao_aciona = decisao-tomada`, rádio
`parcial`/`medido`, com a ressalva *"INSTRUMENTO, não cura. Só sai por gesto
explícito. Custo colateral MEDIDO: o 0x08 APAGA os player-LEDs sempre, e eles
não voltam sozinhos."*

| onde | o que a tela afirma |
| --- | --- |
| `interface/aba08.py:1904` | *"Só funciona com o controle no rádio: a cura é derrubar a conexão Bluetooth para você apertar PS. Este controle está no cabo, onde a barra de luz não depende de reconexão nenhuma."* |
| `interface/aba08.py:1907` | *"Derruba este controle do rádio para você apertar PS e a barra de luz voltar a obedecer."* |
| `interface/pacotes/a08_conexoes.py:4924` | a mesma cura, no recado |

**O que teria de ser medido, e primeiro há uma pergunta de DONO:** a tela
descreve um gesto de produto (derrubar a conexão) e a célula descreve um
comando do aparelho (`RELEASE_LEDS 0x08`) — pode ser que a dona certa seja
`plataforma.diagnostico_morte_radio@dualsense` (cabo `não`, rádio `parcial`).
A remedição começa por decidir qual das duas linhas responde pelo gesto, e
então medir o gesto nos dois transportes.

#### `plataforma.taxa_relatorios@dualsense` — 2 frases

Mapa hoje: `existe=parcial`, cabo `parcial/medido`, rádio `parcial/medido`. A
`radio_ressalva` fala do **teto de 250 Hz** e derruba os `~765 Hz` que os
comentários repetiam. **Nenhum dos dois números que a tela publica está na
célula.**

| onde | o que a tela afirma |
| --- | --- |
| `interface/aba02.py:1102` | *"No cabo são **250,0 Hz exatos**, e três fontes independentes concordam: o relógio do host, o relógio do controle e o descritor USB (bInterval = 6)."* |
| `interface/aba02.py:1105` | *"No rádio não há taxa típica. Medido em cinco janelas de 8 a 10 s no mesmo controle: a média foi de **38 a 392 Hz** entre janelas consecutivas… Os **1000 Hz** que o SDL declara para Bluetooth **não aparecem em janela nenhuma**."* |

**O que teria de ser medido: nada — já foi.** O que falta é escrever de volta:
o 250,0 Hz e as três fontes no `cabo_ressalva`, e a faixa de 38 a 392 Hz mais o
desmentido dos 1000 Hz do SDL no `radio_ressalva`. **E há um caminho pronto para
isso não voltar a divergir:** `NUMEROS_MEDIDOS_NO_MAPA`
(`integrations/radio_da_mesa.py`) já amarra constante e célula, e a régua Z6-08
reprova quando as duas discordam — hoje ele tem três números, todos do
microfone. Estes dois cabem lá.

### §3.2 — BALDE 2: afirma, e o mapa sustenta (7)

| onde | chave que sustenta |
| --- | --- |
| `interface/aba08.py:1892` — *"a cor do plástico que o Hefesto leu do aparelho: este controle está no cabo, e pelo cabo ele pergunta e o aparelho responde"* | `identidade.cor_do_aparelho@dualsense` cabo `sim/medido`, `SAIU NO FIO` |
| `interface/pacotes/a08_conexoes.py:2266` — *"chega pelo cabo, pela placa de áudio USB do próprio aparelho (medido em 15/08/2026)"* | `audio.microfone@dualsense` cabo `sim/medido` |
| `interface/pacotes/a08_conexoes.py:2275` — *"Pelo cabo ele não custa turno de rádio nenhum."* | decorre da mesma |
| `interface/controles_vivos.py:1200` — *"Conecte um pelo cabo ou pelo rádio — ele aparece sozinho"* | `entrada.bruta@dualsense` `sim/medido` nos dois |
| `interface/pacotes/a01_jogar.py:274` — a mesma frase | idem |
| `interface/aba09.py:896` — *"o rádio é onde nascem os engasgos de entrada… dois controles dividem a banda do mesmo adaptador"* | `plataforma.taxa_relatorios@dualsense` rádio `parcial/medido` (*"a variação do rádio é do enlace"*) |
| `interface/aba10.py:1505` — *"O endereço de rádio… não muda quando você troca o cabo pelo rádio"* | `identidade.cracha_nos_dois_transportes@dualsense`, `n=4`, `SAIU NO FIO` nos dois |

### §3.3 — BALDE 3: não afirma (103)

A maior parte, e **isso não é fracasso da medição** — é o preço declarado da
régua, que prefere falso-positivo a falso-negativo (`PALAVRAS_DE_TRANSPORTE`
inclui `usb` de propósito). O que há dentro:

* **45 carregam marcação HTML** e **56 têm menos de 40 caracteres**: pedaços de
  f-string e de bloco HTML que o AST entrega picados (`</b>`, `" data-gesto="…`,
  `controle(s) no rádio`). **Isto é achado, não ruído:** a tela nova é montada
  por concatenação, e a régua só alcança o pedaço literal — uma frase inteira de
  transporte pode atravessá-la partida em três. Quem for promover uma aba de
  `interface/` vai bater nisto antes de qualquer outra coisa.
* **A prosa das "notas" do mockup** (aba01, aba02, aba04, aba08): decisões de
  desenho, medidas em px, citações dela. Cita transporte sem afirmar capacidade.
* **Fala do HOSPEDEIRO, não do aparelho**: adaptador Bluetooth, entrada USB,
  miliampères, vizinhança de 2,4 GHz. O mapa é do DualSense; estas linhas não
  têm célula, e não deveriam ter.
* **5 falsos-positivos de vocabulário**, e valem por serem engraçados e reais: em
  `aba02.py:2566`, `aba02.py:3233`, `aba08.py:3722`, `:3748` e `:3752`, *"rádio"*
  é o `<input type="radio">` do HTML. A fronteira de palavra não separa o rádio
  do controle do rádio do formulário.

---

## §4 — OS PORTÕES

`git add -A && bash scripts/portoes.sh` — resultado em §6 do relatório de
entrega ao coordenador (o arquivo de saída fica no scratchpad da sessão).

O `fala-de-tela` é um dos portões, então **ele mediu quem o mexeu**. Ele
continua **verde**, e isso é o desenho: o alcance novo não reprova nada porque
`ABAS_COM_FALA_DECLARADA` está vazio — nenhuma aba está promovida, e aba livre é
livre nas duas raízes. **A régua passou a VER as 123 frases; ela não passou a
vetar nenhuma.**

Saída de hoje, verbatim:

```
A RÉGUA QUASE NÃO MEDIU: 1 `Fala` declarada(s), 3 número(s) de tela e 0 aba(s)
promovida(s), contra as 308 célula(s) de …/fatos_do_mapa.py, varrendo 2 raiz(es)
de tela (src/hefesto_dualsense4unix/app, src/hefesto_dualsense4unix/interface).
… É O PISO (abas≥0, falas≥1, numeros≥3, raizes≥2): abaixo dele, `rc=1`.
```

---

## §5 — O QUE EU NÃO FIZ, E POR QUÊ

1. **Não curei nenhuma das 13 frases do balde 1.** `interface/` é `nao_toca`
   desta sprint, e a razão é de método: curar frase no mesmo commit em que a
   régua muda impede saber qual das duas coisas quebrou o quê. Dois agentes
   estavam em voo nesses arquivos.
2. **Não toquei em `docs/data/mapa-controles.csv` nem em `paridade-gtk-html.csv`.**
   A fila de remedição está escrita; a remedição é de quem tem a bancada.
3. **Não promovi nenhuma aba.** Promover exige que 100% das frases de transporte
   da aba estejam declaradas ou isentas com razão. As isenções caberiam no meu
   arquivo, mas as declarações não — e isentar em massa o que eu não posso
   declarar seria **vetar pela porta dos fundos** exatamente o que a correção de
   rumo dela proíbe.
4. **Não construí o portão que cruza a paridade com o mapa** (§1.3 da sprint).
   É achado declarado, e vira sprint própria: `docs/data/paridade-gtk-html.csv` e
   `docs/data/mapa-controles.csv` são lidos por **exatamente dois arquivos**
   (`interface/aba02.py` e `interface/mesa_viva.py`), e por nenhum portão.
5. **Não mudei `scripts/gerar-mapa.py` nem `scripts/gerar-painel.py`**, que
   seguem chamando `descobre_falas(RAIZ / APP_RELATIVO, RAIZ)` — a raiz única.
   Hoje isso não muda um caractere da saída dos dois: `interface/` tem **zero**
   `Fala` declarada. No dia em que tiver, os dois passam a publicar uma fila
   incompleta; a troca é de uma linha em cada (`mod.descobre_falas_da_tela(RAIZ)`)
   e está fora da minha posse.

---

## §6 — O QUE A CASA PRECISA FAZER, EM ORDEM

1. **Remedir e marcar as 5 chaves de §3.1.** Duas delas não precisam de bancada:
   `plataforma.taxa_relatorios` só precisa que alguém escreva de volta o que a
   tela já publica, e `audio.microfone` tem o veredito atrás do detalhe da
   própria célula.
2. **Resolver a contradição do microfone entre a Conexões e a Controles** — as
   duas telas do mesmo produto dizem coisas opostas sobre o rádio.
3. **Decidir quem é dona do gesto "derrubar a conexão"** entre
   `luz.lightbar.release_leds` e `plataforma.diagnostico_morte_radio`.
4. **O portão que cruza a paridade com o mapa** (§5.4).
5. **Promover a primeira aba de `interface/`** — e contar com o achado de §3.3:
   a tela nova é montada por concatenação, e a régua alcança pedaços.
