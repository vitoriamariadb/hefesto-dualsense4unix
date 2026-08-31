# A lista dela — o mockup vai ser CONCLUÍDO antes de virar interface

**31/08/2026, 20h.** Palavra dela, e ela reorienta tudo:

> *"primeiro **nunca terminamos o mockup**, por isso não era pra ser feito no
> layout final. **Vamos concluir lá e depois seguimos pra interface.**"*
>
> *"não é pra vc fazer. faz uma to do list pro claude e pra ele ir fazendo ponto
> a ponto comigo. Eu ir dando o ok quando ele terminar nos mockups e ele ir me
> mostrando a to do list atualizada. (…) sem usar agentes e usando o navegador."*

## AS QUATRO REGRAS DELA

1. **UM ponto por vez.** Termine, mostre, **espere o OK dela**. Só então o próximo.
2. **SEM AGENTES.** Trabalho de quem conversa com ela. Despachar agente aqui é
   desobedecer uma ordem direta.
3. **COM O NAVEGADOR.** Abra, olhe, clique, meça. `cd layout/_ferramentas &&
   python3 olhar.py NN-*.html` fotografa em Chrome headless — **e a foto é para
   VOCÊ ler**, não só para gerar. **Nunca abra janela na frente dela: ela tem
   UMA tela.**
4. **A cada ponto entregue, mostre ESTA LISTA atualizada.** Marque `[x]` só
   depois do OK **dela**, nunca depois do seu próprio verde.

## COMO O TRABALHO FLUI — decidido por ela em 31/08

```
layout/_ferramentas/abaNN.py    ← VOCÊ EDITA AQUI (os geradores ficam onde estão)
          │
          ▼  python3 abaNN.py
mockup/NN-*.html                ← O DESENHO sendo concluído. É o que ela olha.
          │
          ▼  só quando ela aprovar
layout/NN-*.html                ← publicado. É o que o produto renderiza.
```

**A direção é mockup → produto, e não o contrário.** O
`scripts/check_o_desenho_aprovado.py --aprovar` que nasceu hoje faz o inverso
(copia `layout/` → `mockup/`) e **está errado para este fluxo**.

- [ ] **0. Inverter o fluxo do portão.** O `--aprovar` vira `--publicar`
      (`mockup/` → `layout/`), e o portão passa a reprovar quando o **produto**
      está atrás do **desenho**. Os geradores passam a escrever em `mockup/`.
      *Uma sessão de trabalho; faça ANTES do ponto 1, senão todo desenho novo
      cai direto no produto.*

---

# ABA POR ABA

## `01` JOGAR

### [ ] 1.1 — o Point And Click sai da fileira de modos

> *"nos mockups tira o point and click e deixa só o navegação."*

**Decisão dela, confirmada em 31/08: sai SÓ da fileira.** O perfil de fábrica
`assets/profiles_default/point_and_click.json` **continua existindo**, e o
`Estilo Point-and-click` da aba Navegação **continua lá**. É só o modo que some.

**Antes** — cinco chips dentro do Hefesto Ligado:
```
Sony DualSense · Xbox · Steam Input · Point And Click · Navegação
```
**Depois** — quatro:
```
Sony DualSense · Xbox · Steam Input · Navegação
```

**Onde mexer:** `layout/_ferramentas/aba01.py`, lista `MODOS` (~linha 175) —
apague o dicionário com `"chave": "pointclick"`.

**O que isso arruma de brinde:** o `pointclick` era o **único** chip marcado
`sem_dono: True`, com borda tracejada. Com ele fora, **nenhum chip da fileira
fica sem dono** — a marca de tracejado deixa de ser usada, e a regra CSS
`.degrau.sem-dono` fica órfã. **Decida:** apagar a regra ou deixá-la para o
futuro, com o motivo escrito.

**O que também precisa acompanhar** (fora do mockup, mas relate a ela):
`src/hefesto_dualsense4unix/app/actions/jogar/painel.py`, `CHIPS_DA_ESCADA` —
tem cinco `Chip`, e `chips_sem_dono()` devolve `('pointclick',)`. O teste
`tests/unit/test_o_botao_de_ligar_funciona_e_se_lembra.py` conta os chips e vai
reprovar.

---

## `02` CONTROLES

### [ ] 2.1 — o "Desativado" do Microfone sai; os dois botões descem

> *"na aba controle, remove o desligado (fica desligado com slicer no zero). Os 2
> botões ficam abaixo do slicer."*

**Confirmado por ela em 31/08:** é o **`Desativado` da fileira do Microfone**.

**Antes:**
```
Microfone [ATIVO] (?)  Virtual  Desativado  Nativo
▂▄▆█▆▄▂▆█▄▂▆▄  ──────────●──── 80  🎙

Alto-falante · 100% · Acordado (?)
▂▄▆█▆▄▂▆█▄▂▆▄  ──────────●──── 100  ♪
[Sons do jogo]  [Todo o som do PC]        ← hoje ao LADO
```
**Depois:**
```
Microfone [ATIVO] (?)  Virtual  Nativo
▂▄▆█▆▄▂▆█▄▂▆▄  ──────────●──── 80  🎙
   (arrastar o slider até 0 é o que desliga)

Alto-falante · 100% · Acordado (?)
▂▄▆█▆▄▂▆█▄▂▆▄  ──────────●──── 100  ♪
[Sons do jogo]                            ← ABAIXO do slider
[Todo o som do PC]
```

**Onde mexer:** `layout/_ferramentas/aba02.py`, o bloco do som dentro do
`.ctl.card`. Procure por `mic-modo` e pela fileira de rota do alto-falante.

**Meça a altura antes e depois.** Os dois botões descendo custam altura, e o
card aberto mede **308px sem rolar** — se passar, o quadro rola e a aba quebra.
O gerador imprime o diagnóstico ao rodar; obedeça.

**Pergunte a ela:** os dois botões descem **lado a lado numa linha** ou **um
embaixo do outro**? O desenho acima assume um embaixo do outro; lado a lado
custa menos altura.

### [ ] 2.2 — a ordem dos cartões segue os controles CONECTADOS

> *"a ordem dos campos expandidos vão de acordo com a ordem dos controles
> conectados. O que não tiver conectado não aparece ali."*

**Hoje** o mockup desenha sempre quatro cartões (`class="ctl card"`), P1 a P4,
em ordem fixa. Com quatro na mesa isso coincide — **com dois, sobra desenho de
controle que não existe**.

**Depois:** os cartões nascem na ordem em que os controles estão conectados, e
**controle desconectado não aparece**.

**Onde mexer:** `layout/_ferramentas/aba02.py` — a fonte da mesa é
`monta.MESA`. Confira se ela já carrega ordem de conexão ou se é lista fixa.

**Isto é o mesmo assunto do 3.1** (a fita que só acende com controle) e do
**ponto 2.3 abaixo** — os três são *"a tela mostra o que está lá, não o que
poderia estar"*. **Faça os três juntos, ou pelo menos na mesma conversa com
ela**, porque a decisão de como mostrar "mesa vazia" vale para os três.

### [ ] 2.3 — como o mockup mostra uma mesa com MENOS de quatro

**Isto não é pedido dela — é a pergunta que 2.2 e 3.1 abrem, e você precisa
levá-la a ela antes de desenhar.**

O mockup é **estático**: ele desenha um estado. Se a regra agora é "só aparece
quem está conectado", o desenho precisa dizer **qual estado ele está
mostrando** e, provavelmente, mostrar mais de um.

**Opções para levar a ela, em foto:**
- a aba nasce com a mesa cheia (como hoje) e o **rodapé** mostra o estado vazio;
- a aba nasce com **dois** controles, que é a mesa real dela mais comum;
- uma aba de exemplo com a mesa **vazia**, para o estado desligado ficar visível.

---

## `03` GATILHOS · `04` ILUMINAÇÃO · `05` VIBRAÇÃO

### [ ] 3.1 — as bordas das três tabelas continuam sobrando e sem respiro

> *"as bordas das 3 paginas de tabelas gatilhos iluminação e vibração tao
> sobrando de um jeito feio e tão sem dar respiro."*

**ATENÇÃO — ISTO É REINCIDÊNCIA, e por isso não repita a abordagem de hoje.**

Em 31/08 já houve uma leva inteira nessas três: nasceu a variável
`--linha:#53576f` no `topo.html` (contraste 2,01:1, o meio exato em luminância
entre dois valores que ela mesma julgou), cinco bordas duplicadas foram
eliminadas, e a Iluminação caiu de **470 para 326** bordas visíveis.

**Ela olhou DEPOIS disso e ainda achou feio.** Então o problema não era só
contraste — e a hipótese mais forte é que seja **respiro**, o mesmo assunto do
ponto 6.1, não a cor da linha.

**O que fazer, nesta ordem:**
1. **Meça o que sobrou.** Censo das bordas nas três: seletor, cor, espessura,
   e para que serve (estrutural / estado / cor do plástico).
2. **Meça o RESPIRO**: a folga acima e abaixo do conteúdo de cada célula, em
   cada uma das três. A aba Vibração recebeu hoje um `--r-ar:5px` que resolveu
   exatamente isso — **veja se Gatilhos e Iluminação têm o equivalente**, e é
   provável que não.
3. **Mostre a ela uma proposta em FOTO, numa aba só, antes de aplicar nas três.**
   Aplicar nas três de uma vez e errar custa três desfazimentos.

**Nunca toque na cor do plástico** — `.chip.plastico`, `.moldura`, `.dono`, a
barrinha da tabela. É dado com dono e portão (`scripts/check_cores_do_dualsense.py`),
e apagá-la apaga a informação de qual controle é qual.

**Nunca toque na borda de ESTADO** — `.on`, `.aba.ativa`, `:hover`,
`select.modo`. É a única coisa que diz o que está ligado.

---

## `06` NAVEGAÇÃO

*Sem ponto dela nesta aba.* O `Estilo Point-and-click` **fica** (ver 1.1).

---

## `07` LANÇADORES

*Sem ponto dela nesta aba.* Palavra dela, registrada no rodapé da própria aba:
*"essa aba em si só vamos desenhar e deixar placeholder mesmo"*.

---

## `08` CONEXÕES

### [ ] 6.1 — os campos que expandem não têm respiro

> *"o nome dos campos que expandem não tem respiro isso **todas as abas** que tem
> esses campos que expandem."*

**Ela mandou duas fotos desta aba**, uma com o Check-up aberto e outra com os
três fechados. O rótulo do acordeão está **colado na borda da faixa**.

**MEDIDO: só a Conexões tem acordeão de verdade.** Os três são
`▸ Check-up`, `▸ Gestão Controles`, `▸ Rádio e adaptadores`
(`input class="abre"` em `aba08.py:1891`, `:1980`, `:2016`).

**Mas ela disse "todas as abas que tem esses campos"** — então **faça o censo
das dez** antes de concluir que é só uma. Procure por qualquer coisa que abra e
feche: `input.abre`, `<details>`, `:has(> input.abre)`, e também o **cartão que
abre** da aba Controles (`.ctl.card`, quatro deles), que é campo que expande
mesmo sem ser acordeão.

**A cura tem de ser uma variável no `topo.html`**, não conserto por aba — senão
a próxima aba que ganhar acordeão nasce apertada. O precedente é o `--r-ar` da
Vibração, de hoje.

### [ ] 6.2 — o vão embaixo, com as seções fechadas

**Isto não é pedido dela — é o que eu vi na foto e trago para ela decidir.**

Com os três acordeões fechados, sobram **~220px de vazio** entre a última faixa
e o rodapé. É a mesma família dos 58px que ela reclamou no Perfil de Bateria
hoje (*"tá destacando negativamente"*).

Pode ser de propósito — os acordeões abrem e preenchem. **Mostre a foto a ela e
pergunte**, antes de mexer.

---

## `09` SISTEMA

### [ ] 7.1 — Perfil de Bateria vira três botões

> *"perfil da bateria transforma em três botões lado a lado com escolha única e
> tira o 'O perfil da mesa' pronto isso resolve."*

**Antes:**
```
Perfil de Bateria (?)
  O perfil da mesa    [ Tudo ligado                    ▾ ]
  ◆ O que ele impõe     Nada é limitado
  ◆ Vale para           Os 4 controles
  ◆ O teto alcança      Vibração
  ◆ Ainda sem teto      Gatilhos, barra de luz, microfone por rádio e giroscópio
```
**Depois:**
```
Perfil de Bateria (?)
  [ Tudo ligado ] [ ........ ] [ ........ ]     ← três botões, escolha única
  ◆ O que ele impõe     Nada é limitado
  ◆ Vale para           Os 4 controles
  ◆ O teto alcança      Vibração
  ◆ Ainda sem teto      Gatilhos, barra de luz, microfone por rádio e giroscópio
```

**Os três nomes NÃO SE INVENTAM.** Eles saem do produto —
`RUMBLE_POLICY_MULT` e `PERFIL_BATERIA_LONGA` em
`src/.../daemon/subsystems/rumble.py` e no `secao_orcamento.py`. Leia de lá e
use os nomes de verdade.

**A gramática dos botões já existe:** é o `.seg` que a aba Vibração usa em
`Economia · Balanceado · Máximo · Auto`. Copie, não invente.

**CUIDADO COM A ALTURA — este bloco tem portão próprio.** O gerador `aba09.py`
ganhou hoje uma régua que **reprova quando o bloco `Perfil de Bateria` e o bloco
`O serviço` deixam de acabar no mesmo y**. Ela nasceu porque havia 58px de vão
ali, que ela viu e reclamou. Rode `python3 aba09.py` e obedeça ao que ele
imprimir.

---

## `10` PERFIS

*Sem ponto dela nesta aba.* A lista `Estilo de Jogo` continua com
`Point-and-click` (ver 1.1).

---

# TODAS AS DEZ ABAS

### [ ] 8.1 — "Ajustes vão para:" vira "Selecione", e só acende com controle

> *"Ajustes vão para: aqui vamos mudar para **Selecione**. E ele só fica ativo se
> surgir Controle naquela área. **Enquanto não surgir controle ele fica desligado
> sem texto e sem identificado.** Aí conectou ele reconhece."*

**Onde:** a fita do topo, em **todas as dez** — `layout/_ferramentas/topo.html`.
Mexer aqui muda as dez de uma vez, então **regere as dez** (`python3 regerar.py`)
e **olhe as dez** antes de mostrar a ela.

**Antes:**
```
Ajustes vão para:  [Todos] [P1·Cosmic Red·USB] [P2·Starlight Blue·BT] …
```
**Depois, COM controle:**
```
Selecione:  [Todos] [P1·Cosmic Red·USB] [P2·Starlight Blue·BT] …
```
**Depois, SEM controle:**
```
Selecione:  (a fita nasce desligada — sem texto, sem identificação)
```

**A parte difícil, e é o que precisa da conversa com ela:** o mockup é estático.
Ele desenha **um** estado. Como mostrar os dois? É a mesma pergunta do **2.3** —
resolva junto.

**Cuidado com um portão:** `layout/_ferramentas/regua.py` mede o alinhamento dos
títulos, e a fita é a régua de x das dez abas. Rode `python3 regua.py NN-*.html`
depois de mexer.

---

# O QUE JÁ ESTÁ FECHADO — não se reabre sem ela

Veio do olho dela **em 31/08** e está no mockup:

| | |
|---|---|
| Jogar | o `Automático` fora da escada · os algarismos fora dos modos · o interruptor **fora** de "Quando o jogo abrir" |
| Controles | `Os controles da mesa` → **Conectados** · o botão **Liberar** do microfone fora |
| Gatilhos | os glifos **L2** e **R2** de volta |
| Sistema | a aba diz **serviço**, e o verbo é **Parar** |

# ONDE OLHAR ANTES DE COMEÇAR

| | |
|---|---|
| o contrato da casa | `CLAUDE.md` |
| fotografar sem atrapalhar ela | `docs/process/COMO-OLHAR-A-TELA.md` |
| o que aconteceu em 31/08 | `docs/process/2026-08-31-O-HANDOFF-*.md` |
| as duas pastas | `mockup/LEIA-PRIMEIRO.md` |
| a gramática do desenho | `layout/_ferramentas/LEIA-ME.md` e `CORRECOES-DELA.md` |
