# A-RECUSA-QUE-CITOU-O-MAPA-01 — a varredura do passado, e os vetos desfeitos

**Agente:** F-VARREDURA · **Onda:** F · **Data:** 06/09/2026
**Árvore:** `voo/A-RECUSA-QUE-CITOU-O-MAPA-01-F-VARREDURA`, nascida de
`onda/atual-0609` · **Bancada:** não usada (`bancada: false`)

---

## §0 — O estado, em uma linha

Varri `docs/process/sprints/` e `docs/process/agentes/` atrás de texto que use o
mapa de canais para **não construir**: **155 ocorrências em 74 arquivos**, das
quais **20 eram veto** (gaveta A) e foram corrigidas com nota datada em 17
arquivos; **as outras 135 não eram**, e o número que prova a triagem é esse.

---

## §1 — OS TRÊS NÚMEROS

| gaveta | o que é | quantas | o que fiz |
| --- | --- | --- | --- |
| **A — VETO** | o mapa foi usado para não construir, e a célula é `divida`, `nao-medido`, `so-ela-decide` ou estava vazia | **20 passagens · 17 arquivos** | corrigi o texto no lugar, com nota datada |
| **B — LEGÍTIMO** | a célula é `nada-a-acionar` (a peça não existe) ou `o-aparelho-recusa` | **2 no net principal** (+ 4 na varredura complementar por "peça que não existe", que não citam o CSV) | nada |
| **C — NÃO É RECUSA** | o texto só cita, descreve, ou proíbe a TELA de AFIRMAR o que ninguém mediu | **133** | nada |

**A conta fecha:** 20 + 2 + 133 = 155. **Oitenta e seis por cento do que a
sondagem trouxe não era recusa** — e isso é o resultado da triagem, não a falha
dela.

### O universo, e como foi construído

Rede de busca sobre os dois diretórios: `não sustenta` · `sem lastro` ·
`não aciona` · `aciona = não` · `o mapa diz` · `escada vazia` · `nada-a-acionar`
· `o-aparelho-recusa` · `nao-medido` · `divida` · `célula/coluna vazia`.
Descontados o ruído do portão `paridade-gtk-html` (`divida-fechada`), o
`--divida` do `check_colisao_de_sprints`, os mockups do mapa 2D das portas
(outro "mapa") e a própria sprint de hoje. **Duas passadas complementares** —
uma por verbos de recusa (`fica de fora`, `cortado`, `adiado`, `não
implementar`) perto do mapa, outra por formas de veto (`não pode ser escrita`,
`não executei`, `nascem insensíveis`) — não acharam nenhum A que a primeira já
não tivesse.

### Um achado do censo, e ele vale para quem ler o mapa amanhã

Rodei o censo das causas nas 265 células `aciona = não` do mapa de hoje:

```
cabo : nada-a-acionar 106 · nao-medido 56 · divida 10 · decisao-tomada 9 · so-ela-decide 1
radio: nada-a-acionar 103 · nao-medido 53 · divida 11 · decisao-tomada 10 · so-ela-decide 1
```

**`o-aparelho-recusa` NÃO APARECE UMA ÚNICA VEZ.** O valor existe no vocabulário
e nenhuma célula o carrega: o único caso que o tinha — a cor do plástico por
rádio — virou `divida` em 29/08/2026, e depois virou `sim`. Ou seja: **em 06/09
não há uma única linha do mapa em que o aparelho recuse alguma coisa.** Toda
recusa registrada hoje é `nada-a-acionar` (a peça não existe naquele controle:
88 no Pro, 83 no 8BitDo, 38 no DualSense) ou causa NOSSA.

---

## §2 — A GAVETA A, UMA A UMA

As vinte passagens caem em **cinco chaves do mapa**. Nenhuma sprint teve o
`estado:` mexido — a troca é do coordenador.

### A.1 — A cor do plástico pelo rádio · 12 passagens em 12 arquivos

**Chave:** `identidade.cor_do_aparelho@dualsense` (`docs/data/mapa-controles.csv:111`)

| o que o texto dizia | o que a célula diz de verdade, hoje |
| --- | --- |
| `radio_aciona = não`, motivo `divida` — e daí: *"as colunas de BT nascem cinzentas"*, *"esta aba tem de saber viver sem a cor"*, *"os quatro cartões nascem com chip cinzento"* | **`radio_aciona = sim`**, `radio_de_onde_sei = medido`, `radio_ate_onde_foi = SAIU NO FIO`, `radio_por_que_nao_aciona` **vazia** |

**O que mudou, e quando:** a `ONDA-CONEXOES-11` (`estado: feita`) correu em
**02/09/2026**, commit `2e772412`. O produto leu a cor pelo rádio no controle
dela, com o daemon rodando, sem parar nada: `hidraw5` devolveu 64 bytes, eco
`[1, 19, 2]`, código `04` = Galactic Purple, em 13,6 ms — e de novo em 12,7 ms.
A mesma medição fechou que o CRC **não é opcional** no rádio: semente `0x53` é
aceita, `0xA3` devolve `errno 5`.

**A ressalva que sobreviveu, e ela não é de transporte:** a amostra é de **duas
unidades** (`hidraw8` em 27/08, `hidraw5` em 02/09), não das quatro desta
bancada. Se um terceiro controle recusar, o achado é a **assinatura**, não o
transporte — e a leitura já devolve `None` sem levantar, que é "Não sei" na
tela.

Os doze arquivos, com a passagem corrigida:

1. `docs/process/sprints/2026-08-27-ONDA-CONEXOES-05-o-card-vira-tira.md` —
   §"O que esta sprint NÃO toca". **É a pior das doze**, e é de outra natureza:
   ela **manda manter uma lápide falsa** — *"Quem executar esta sprint deixa a
   dica onde está, mesmo sabendo que ela já é falsa"*, sendo a dica *"No rádio o
   controle recusa o pedido da cor"*. **Isso é uma acusação ao aparelho dela por
   um defeito nosso.** Nota registra que a frase saiu em 29/08/2026 (commit
   `091ab2e5`, *"'o aparelho recusa' sai de vinte e cinco lugares"*) e que hoje
   `app/widgets/external_card.py` diz *"O Hefesto ainda não lê a cor por rádio.
   Escolha na lista."*, com `AFIRMA_NADA` e `porque=` — o único par legal quando
   a causa é nossa.
2. `docs/process/sprints/2026-08-29-MIGRA-CONEXOES-05-a-pagina-nasce-da-mesa-real.md`
   — §3, "o espinho vivo". **É o texto que diagnosticou esta varredura antes de
   ela existir:** *"quem executar esta sprint lê a lápide no mapa, acredita e
   para — foi o custo que a casa já pagou por quatro dias"*. Fica escrito, com a
   nota de que o dono (`ONDA-CONEXOES-11`) correu.
3. `docs/process/sprints/2026-08-29-MIGRA-CONEXOES-INDICE.md` — §"o fato errado
   do mapa NÃO virou sprint".
4. `docs/process/sprints/2026-08-29-MIGRA-CONTROLES-12-a-borda-e-a-peca-e-metade-da-mesa-e-radio.md`
   — §1, *"Enquanto a do rádio não fechar…"*.
5. `docs/process/sprints/2026-08-29-MIGRA-GATILHOS-04-a-mesa-real-desenha-as-colunas.md`
   — §"E há um agravante de transporte".
6. `docs/process/sprints/2026-08-29-MIGRA-ILUMINACAO-10-a-cor-do-plastico-nas-colunas.md`
   — §"O CABO chegou a não ler… pelo rádio, não".
7. `docs/process/sprints/2026-08-29-MIGRA-ILUMINACAO-INDICE.md` — item 2.
8. `docs/process/sprints/2026-08-29-MIGRA-JOGAR-04-a-mesa-real-pinta-os-cartoes.md`
   — item 4, *"o mapa é portão e desmente dois dos quatro cartões"*.
9. `docs/process/sprints/2026-08-29-MIGRA-JOGAR-INDICE.md` — a linha 04 da
   tabela das doze.
10. `docs/process/sprints/2026-08-29-MIGRA-PERFIS-06-o-ajuste-proprio-nasce-da-mesa-dela.md`
    — §"Os dois riscos", risco 1.
11. `docs/process/sprints/2026-08-29-MIGRA-VIBRACAO-03-as-colunas-nascem-da-mesa-dela.md`
    — §"A cor pelo rádio, e por que ela não se inventa".
12. `docs/process/sprints/2026-08-29-MIGRA-VIBRACAO-INDICE.md` — item 5 do "o
    que é dela decidir".

**O que a correção diz, e o que ela NÃO diz:** "sem cor conhecida, nasce sem
cor" continua certo — mas por **unidade que não respondeu**, nunca pelo
transporte inteiro.

### A.2 — O acelerômetro · 2 passagens

**Arquivo:** `docs/process/sprints/2026-08-29-MIGRA-CONTROLES-13-o-que-o-mapa-desmente-nao-se-pinta-como-vivo.md`
(a tabela das três afirmações, e o parágrafo *"Enquanto ela não fechar, os três
eixos na tela são número inventado"*)
**Chave:** `movimento.acelerometro@dualsense` (`docs/data/mapa-controles.csv:175`)

| o que o texto dizia | o que a célula diz de verdade, hoje |
| --- | --- |
| `cabo_aciona = não`, `radio_aciona = não`, *"com `so-ela-decide` nos dois"* | **`cabo_aciona = sim` e `radio_aciona = sim`**, `de_onde_sei = medido` dos dois lados |

**É o caso que dá nome à varredura, e por dois motivos.** Primeiro: `aciona` era
`não` e a causa era `so-ela-decide` — **a palavra DELA, nunca o aparelho**. Ler
só a primeira coluna transformou uma pergunta em impedimento. Segundo: a
`ONDA-CONTROLES-04` fechou em **29/08/2026** (cabo: 30 amostras por controle,
|v| médio de 0,9962 g e 0,9932 g em duas unidades, em inclinações diferentes) e
o rádio em **03/09/2026**, pelo `MotionSensorReader` desta árvore, no nó de
Bluetooth.

**A armadilha que fica, e o mapa a declara:** a célula
`por_que_nao_aciona` **continua escrita `so-ela-decide`** de propósito, ao lado
de `aciona = sim`. É a única linha do mapa nessa forma. Quem ler a causa sozinha
repete o erro. Palavra dela, na ressalva da própria linha: *"não era pra ele
sair. era pra ele FUNCIONAR."*

**Consequência escrita na nota:** o portão que a sprint cria
(`check_a_tela_nao_promete_o_que_o_mapa_nega.py`) **não deve acusar o
acelerômetro** — a própria seção "Como se prova" dela já previa esse
desligamento sozinho, e ele aconteceu.

### A.3 — A emulação de mouse pelo rádio · 2 passagens

**Arquivo:** `docs/process/sprints/2026-08-29-MIGRA-NAVEGACAO-04-o-mouse-emulado-e-o-que-o-radio-nao-entrega.md`
(§"O defeito", segundo defeito; e a entrega 5)
**Chaves:** `entrada.emulacao_mouse.gatilhos@dualsense` e
`entrada.emulacao_mouse.analogico@dualsense`

| o que o texto dizia | o que a célula diz de verdade, hoje |
| --- | --- |
| *"As duas linhas de emulação têm `cabo_aciona` e `radio_aciona` **vazios**: o mapa registrou a assimetria e nunca a fechou"* — e daí a entrega 5, que põe na tela a marca *"o analógico não move o cursor por Bluetooth"* | **`cabo_aciona = sim` e `radio_aciona = sim`, `de_onde_sei = medido` dos dois lados** |

**Célula vazia é `nao-medido`, e ela fechou pelo lado POSITIVO.** Evidência do
rádio, no mapa: *"o caminho do mouse emulado não pergunta o transporte"* — ele
lê o eixo do gamepad já normalizado pelo daemon e escreve no uinput, **o mesmo
código para cabo e rádio**, *"medido com ela na bancada, nos dois transportes,
em 05/09/2026"*, com régua em
`tests/unit/test_o_mouse_emulado_nao_pergunta_o_fio.py` e a palavra dela:
*"hj as máscaras funcionam super legal em tudo o lance do R2 analógico e cursor
tão medidos"*. <!-- noqa-acento: citação literal dela -->

**Quem derrubou a observação dela de 11/08 foi ela mesma, em 05/09.** A entrega
5 desta sprint caducou: pôr a marca hoje seria a tela **negar** o que o mapa
sustenta — o defeito na direção oposta.

### A.4 — A leitura de estado do gatilho · 1 passagem

**Arquivo:** `docs/process/sprints/2026-08-29-MIGRA-GATILHOS-07-o-rascunho-e-a-escrita-por-coluna.md`
(§"O que a tela NÃO passa a dizer")
**Chave:** `gatilho.leitura@dualsense` (`docs/data/mapa-controles.csv:105`)

| o que o texto dizia | o que a célula diz de verdade, hoje |
| --- | --- |
| `cabo_aciona=não` / `radio_aciona=não`, citando *"O offset exato do byte de status não está registrado no código deste projeto — não localizado"*, e concluindo: **"Não existe canal de leitura de estado de gatilho"** | `por_que_nao_aciona = divida` nos DOIS lados — **causa nossa** —, `radio_canal = hidraw`, offset registrado desde 31/08/2026 |

**A citação literal do texto já tinha sido substituída no mapa.** A
`cabo_ressalva` de 03/09/2026 diz, pela lei do fato errado: *"esta célula dizia
«O offset exato do byte de status não está registrado no código deste projeto —
não localizado». O offset está registrado desde 31/08/2026 (…). O que NÃO está
registrado em código nosso é o CONSUMIDOR — ninguém lê os dois bytes."*

**Os dois bytes moram no report de ENTRADA `0x31`, o mesmo que este produto já
abre e decodifica** por `/dev/hidrawN` no rádio, com o CRC-32 conferido, para
outros quatro campos do mesmo payload. *"Não existe canal"* é afirmação sobre o
APARELHO que o mapa não sustenta. **A tela continua certa em não dizer "o
controle confirmou" enquanto ninguém lê** — o que muda é que isso é dívida com
dono, não impossibilidade.

### A.5 — A T6 do som por rádio, e a célula vazia que travou uma tarefa · 3 passagens

**Arquivos:** `docs/process/sprints/2026-08-24-STATUS-DIZ-O-QUE-VE-01-o-hertz-que-sumiu-e-os-cards-fora-de-ordem.md`
(§2.5 e a tarefa T6) e `docs/process/agentes/2026-08-25/STATUS-DIZ-O-QUE-VE-01-A2.md`
(§"O que sobrou para o próximo")
**Chaves:** `audio.alto_falante@dualsense` (`:2`) e
`audio.alto_falante.rota@dualsense` (`docs/data/mapa-controles.csv:8`)

**Duas coisas erradas, e as duas mudam o alcance da tarefa:**

1. **Fato errado, substituído.** A tabela da §2.5 diz três vezes que
   `audio.alto_falante.rota` é `radio_aciona = não`. O mapa diz **`sim`, dos
   dois lados** (cabo `medido` / `O APARELHO OBEDECEU`; rádio
   `inferido-do-codigo` / `MONTOU`). Logo "Sons do jogo", "Todo o som do PC",
   "Silenciar" e o botão da rota **saem** da lista de peças a apagar. O
   conferente já tinha medido isso em 25/08 e o erro sobreviveu doze dias.
2. **A causa é `divida`, e com `divida` não se apaga gesto.** A T6 manda as
   peças *"nascerem insensíveis"* por rádio. Sobra só a chave guarda-chuva
   `audio.alto_falante`, cujo `radio_aciona = não` tem causa `divida` — dívida
   NOSSA. `CAUSA_DE_FORA` (`app/fala_do_mapa.py`) só licencia
   `AFIRMA_NAO_ACIONA` para `nada-a-acionar` e `o-aparelho-recusa`; com `divida`
   a única `Fala` legal é `AFIRMA_NADA` com `porque=` explícito, e a frase
   honesta é *"o Hefesto ainda não faz"*, nunca *"o controle não faz"*.

---

## §3 — A MORDIDA DE AMOSTRA

Uma varredura que põe tudo na gaveta A não triou nada. Aqui está a prova de que
ela discrimina.

### Três da gaveta B — por que NÃO são A

| # | onde | por que é B |
| --- | --- | --- |
| B1 | `docs/process/sprints/2026-08-24-STATUS-DIZ-O-QUE-VE-01-…:668` — *"o alto-falante emite por rádio?"* | A ressalva do mapa que ele cita é **do aparelho, e o mapa diz isso com essas palavras**: *"por cabo o descritor declara UM único OUTPUT, o 0x02 de 47 B (…) o alto-falante no cabo é placa de som USB Audio Class, não HID. **Assimetria dura, e do aparelho, não do produto**"*. Não há dívida nossa a pagar aqui: é o descritor do aparelho. |
| B2 | `docs/process/sprints/2026-08-16-TRES-MODOS-DO-SOM-01-…` §8 — *"nenhum dos três modos existe no rádio"* | A razão que ele dá **não é a célula**: é o ensaio `mic-radio-sem-placa-alsa-0727` (mesa 2+2 dela — os dois do cabo têm `card2`/`card3`, os dois do rádio não têm nenhuma) mais o registro do BlueZ de 07/08 (Class of Device `0x002508`, bit de áudio `0x200000` **ausente**: A2DP e HFP descartados por medição). Camada 1 é sink, e sem placa não há sink. **E ele nomeia o trabalho em vez de fechar a porta:** *"é trabalho novo, não conserto"*. |
| B3 | `docs/process/sprints/2026-08-10-POR-UNIDADE-01-…:148-149` — *"o 8BitDo não tem lightbar de barra nem gatilho adaptativo; o Pro Controller não tem alto-falante"* | É `nada-a-acionar` puro, e é o balde maior do mapa (88 células no Pro, 83 no 8BitDo). Não há o que construir: a peça não existe no plástico. |

### Três da gaveta C — por que NÃO são A

| # | onde | por que é C |
| --- | --- | --- |
| C1 | `docs/process/sprints/2026-08-24-STATUS-DIZ-O-QUE-VE-01-…:287` | **É o modelo da leitura certa, escrito em 24/08:** *"O mapa registra `radio_aciona=não` para o alto-falante com a nota 'zero linhas de implementação' — isso é medição do **nosso código**, não do aparelho obedecendo ou recusando."* Ele lê as duas colunas juntas e não veta nada: classifica como NÃO VERIFICADO. |
| C2 | `docs/process/agentes/2026-08-25/EMULACAO-UM-DONO-SO-01-E1.md:21-33` — a ressalva da vibração | *Não afirmar* não é *não construir*. O agente **não cortou** a vibração: pôs uma ressalva na frase, porque `de_onde_sei` era `inferido-do-codigo` nos dois lados. Estava certo, e **saiu junto com a dívida**: `RESSALVA_DE_TRANSPORTE` de `app/actions/emulation_actions.py` está vazio desde 05/09/2026, quando a bancada dela mediu a vibração nos dois transportes. É o ciclo inteiro funcionando. |
| C3 | `docs/process/sprints/2026-08-29-MIGRA-ILUMINACAO-05-…:109-122` — o rótulo "Brilho" | Cita `luz.lightbar.brilho@dualsense` (`aciona = não` nos dois, causa `nao-medido`) e **não corta nada**: os trilhos de brilho continuam de pé, e o que vai a ela é o **rótulo**. E o `aciona = não` está bem fundado do nosso lado — a evidência mede o nosso código *e* o kernel (*"o campo `led_brightness` existe na struct de saída e o driver nunca o toca; o bit que o autoriza, `valid_flag2` bit0, NÃO ESTÁ NEM DEFINIDO"*). O `nao-medido` é sobre o aparelho, e o mapa já nomeia o trabalho: *"Quem for implementar escreve `common[42]` E inventa o `valid_flag2` bit0."* |

### A mais antiga da gaveta A, seguida até hoje

**É a T6, e o veto NUNCA foi desfeito — doze dias parada.**

```
24/08/2026  A sprint STATUS-DIZ-O-QUE-VE-01 escreve a T6: por rádio, as quatro
            peças de alto-falante "nascem insensíveis com dica única e honesta".
            A dica "vem do CSV, não da cabeça de quem escreve".

25/08/2026  O agente A2 RECUSA executá-la, e escreve a razão:
            "audio.alto_falante@dualsense tem radio_aciona='não' com
             radio_por_que_nao_aciona VAZIO. (…) A T6 não pode ser escrita
             antes de alguém preencher essa célula."
            Somado a: "ela deixa quatro peças de som insensíveis no transporte
            que ela mais usa; a frase é texto novo na tela e ela não está."

25/08→05/09 NINGUÉM preenche a célula. Onze dias.

06/09/2026  A célula é preenchida — junto com outras 264 — e diz `divida`.
            A tarefa continua parada, e agora se sabe por quê.
```

**O que essa linha do tempo prova, e é a razão de a sprint de hoje existir:** a
recusa do A2 **estava certa em substância** — sem causa declarada, a `Fala` não
tinha o que dizer, e ligar texto novo na tela dela em provisório seria decidir
em silêncio. O que ninguém fez foi **fechar o laço**: a célula ficou vazia, e
uma célula vazia é um veto que não vence sozinho. Foi essa metade do fluxo que
`nao-medido` veio consertar em 06/09.

**E a T6 não volta como estava escrita.** Duas coisas mudaram o alcance dela
(§2 A.5): a lista de peças encolhe de quatro para uma, e a causa `divida` proíbe
a frase que a tarefa pedia.

---

## §4 — O QUE VIRA FILA PARA O COORDENADOR

**Não mudei `estado:` de sprint nenhuma, e não toquei em decisão dela.** Nenhuma
sprint `caducou` por causa de um veto do mapa — a única `caducou` que cita o
mapa (`2026-08-24-EMULACAO-UM-DONO-SO-01`) o cita como portão, que é gaveta C.
O que segue é o que a varredura deixa na sua mesa:

1. **A T6 de `STATUS-DIZ-O-QUE-VE-01` está VIVA, parada desde 25/08, e a sprint
   não tem frontmatter.** Ela não aparece em
   `scripts/check_colisao_de_sprints.py --abertas` porque não tem `estado:` — é
   invisível para a fila. **Duas decisões suas:** (a) dar frontmatter a essa
   sprint, para o que sobrou dela entrar na fila como todo mundo; (b) a T6, como
   corrigida na nota, ainda vale a pena? Ela encolheu para **uma** peça
   (`audio.alto_falante`, causa `divida`), e a frase honesta agora é *"o Hefesto
   ainda não faz"*.
2. **A entrega 5 da `MIGRA-NAVEGACAO-04` caducou e está `absorvida`.** Se
   alguma linha de `docs/data/paridade-gtk-html.csv` da aba 06 ainda pedir a
   marca de transporte no analógico, ela pede o oposto do que o mapa sustenta
   desde 05/09. **Não toquei na paridade** (`nao_toca`) — é sua.
3. **O acelerômetro: o portão `check_a_tela_nao_promete_o_que_o_mapa_nega.py`
   nasce (ou nasceu) com uma lista de três, e uma delas caiu.** Se ele existir e
   acusar o acelerômetro, está medindo o mundo de 29/08. Não abri `scripts/`
   (`nao_toca`).
4. **Uma célula do mapa que o texto contradiz, e o dono do mapa decide.**
   `audio.microfone.volume@dualsense` (`:29`) tem causa **`divida`** nos dois
   lados (*"Cura escrita e nunca ligada"*), mas
   `2026-08-29-MIGRA-CONTROLES-10-…:73-82` mostra a decisão DATADA no código —
   `core/backend_pydualsense.py`, `SOM-SEMPRE-01`: *"o volume do MICROFONE
   (`common[6]`) continua FORA da chamada, e isso é decisão, não esquecimento —
   o dono do microfone no Linux é o kernel (AUDIO-OWNER-01)"*. **Se a decisão
   está tomada, a causa é `decisao-tomada`, não `divida`** — e a diferença
   importa, porque `divida` chama alguém para trabalhar e `decisao-tomada` não.
   Não editei o CSV (`nao_toca`).
5. **A armadilha do acelerômetro é estrutural e vai pegar a próxima pessoa.**
   `movimento.acelerometro@dualsense` é a **única** linha do mapa com
   `aciona = sim` e `por_que_nao_aciona` preenchido (`so-ela-decide`). A
   ressalva declara que é de propósito, mas nenhuma régua impede a leitura
   errada. **Sugestão para o dono do `check_paridade_transporte.py`:** uma regra
   que avise quando `aciona != não` e `por_que_nao_aciona` estiver preenchida
   fecharia essa forma de defeito de uma vez — hoje é uma linha; amanhã podem
   ser dez.
6. **Um ponteiro MORTO no mapa, e ele está na evidência mais nova que a linha
   tem.** As duas linhas de emulação de mouse (`docs/data/mapa-controles.csv:308`
   e `:309`) citam, na `radio_evidencia` de 05/09/2026, um módulo que **não
   existe nesta árvore**. Os donos reais são `daemon/subsystems/mouse.py` e
   `integrations/uinput_mouse.py` — que é exatamente o que a régua da própria
   célula varre
   (`tests/unit/test_o_mouse_emulado_nao_pergunta_o_fio.py:108-109`). **O mesmo
   endereço morto está no docstring dessa régua, em `:56`.** Quem o pegou foi o
   portão `referencias-docs`, quando eu citei a célula verbatim numa nota — e é
   a segunda vez nesta casa que uma citação literal vira o defeito que ela
   descrevia. Não editei o CSV nem `tests/` (`nao_toca`).
7. **O `colisao-de-sprints` NASCIA vermelho, e a causa é o frontmatter desta
   sprint.** Medido com `git stash` na base: as **mesmas quatro** colisões, sem
   nenhuma alteração minha. A posse declarada é um DIRETÓRIO inteiro
   (`docs/process/sprints/` e `docs/process/agentes/`), então ela colide com
   toda sprint que declare um arquivo lá dentro. **Fechei pelo caminho que o
   próprio portão indica** — `nao_toca:` com os quatro arquivos nomeados e a
   razão escrita —, porque nenhum deles é tocado por esta varredura e um deles é
   de outro agente em voo nesta leva. **Se a próxima sprint da casa também
   tomar diretório inteiro, o portão vai nascer vermelho de novo**: vale
   decidir se posse de diretório precisa de tratamento próprio na régua.

---

## §5 — OS PORTÕES

```
git add -A && bash scripts/portoes.sh
```

**TODOS VERDES — 45 portões.** O placar está em
`docs/process/agentes/2026-09-06/A-RECUSA-QUE-CITOU-O-MAPA-01-portoes.txt`
(neste mesmo diretório).

**Duas voltas, e os dois vermelhos da primeira estão explicados na §4:**

| portão | por que abriu vermelho | como fechou |
| --- | --- | --- |
| `colisao-de-sprints` | **já era vermelho na base** — medido com `git stash`, as mesmas 4 colisões sem mudança minha. A posse desta sprint é diretório inteiro | `nao_toca:` com os quatro arquivos nomeados e a razão escrita (fila 7) |
| `referencias-docs` | eu citei verbatim a `radio_evidencia` do mapa, e ela aponta para um módulo que não existe nesta árvore | a nota deixou de carregar o endereço morto e passou a nomear os donos reais; o ponteiro morto virou fila 6 |

**Não rodei a suíte** — a sprint é de texto, `bancada: false`, e a suíte é de
quem coordena, no fim.

**Não abri janela nenhuma.** Nada nesta sprint toca a tela: o produto desta é
prosa, e a régua dela é a triagem.
