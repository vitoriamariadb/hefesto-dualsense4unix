---
sprint: MIGRA-GATILHOS-INDICE
onda: MIGRA-GATILHOS
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-GATILHOS-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# MIGRA GATILHOS — o índice

**A aba 03 muda de motor.** Sai a página de widgets GTK montada no
`gui/main.glade`; entra a **página HTML aprovada por ela, rodando num
`WebKit2.WebView` dentro da janela GTK3** — decisão dela de 29/08,
`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`
(`docs/data/decisoes-dela.csv:119`), com a palavra literal:
*"sem impeditivo então. manda ve em tudo."*

> ## A EXECUÇÃO ESPERA A PALAVRA DELA
>
> A aba **Controles** está sendo feita viva AGORA, como **piloto** do enxerto.
> A palavra dela foi literal:
>
> > *"Depois dou o ok pra seguirmos materializando a ordem pra fazermos todas as
> > abas funcionarem no novo motor."*
>
> **As onze sprints desta onda SÃO ESCRITAS. Nenhuma executa antes do ok dela
> sobre o piloto** — com uma exceção nomeada: a **01** é medição de bancada com
> zero código de produto, e quanto antes correr, melhor, porque ela pode
> derrubar o desenho desta aba e mais 101 campos das outras nove.

**Alvo:** `novo-layout/03-gatilhos.html` (gerador:
`novo-layout/_ferramentas/aba03.py`).
**Contrato:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 3
(linhas 242-303) — toda linha do "Nada se perdeu" é requisito.
**O antes:** `docs/usage/assets/readme_gatilhos.png`.

## Onze, e a conta mudou

O censo desta aba disse **nove**. São **onze**, por dois motivos escritos:

1. **"O efeito pronto e Meus efeitos" é uma linha no censo e duas sprints na
   realidade.** A 09 é um campo de schema, aditivo e barato, e trava numa
   decisão dela sobre o SIGNIFICADO do campo. A 10 é um catálogo com lugar para
   morar no disco dela, um byte de modo que falta no formato, duas lápides no
   portão e bancada obrigatória. Donos diferentes
   (`schema.py`/`draft_config.py` × `curva_propria.py`/`xdg_paths.py`), travas
   diferentes, tamanhos diferentes. Juntas, seriam uma sprint que ninguém
   consegue despachar.
2. **A prova de tela é sprint nesta casa** (`PROVA-DE-TELA-01`), e a onda
   anterior já a tinha como 07. Aqui ela vale ainda mais: o selo
   *"aba gatilhos perfeita"* é de 27/08 e valia para o desenho de **duas**
   colunas — o gerador virou **quatro** no dia seguinte com o selo ainda colado.

## As onze

| # | sprint | camada | trava |
|---|---|---|---|
| 01 | [o popup do `<select>` na COSMIC](2026-08-29-MIGRA-GATILHOS-01-o-popup-do-select-na-cosmic.md) | medição | **bancada** · pode derrubar o desenho |
| 02 | [os endereços que a página não tem](2026-08-29-MIGRA-GATILHOS-02-os-enderecos-que-a-pagina-nao-tem.md) | desenho | — |
| 03 | [o enxerto substitutivo](2026-08-29-MIGRA-GATILHOS-03-o-enxerto-substitutivo.md) | frontal | **Glade** · e o **onde mora o HTML** |
| 04 | [a mesa real desenha as colunas](2026-08-29-MIGRA-GATILHOS-04-a-mesa-real-desenha-as-colunas.md) | ambas | **palavra dela** (1, 2 ou 5 controles) |
| 05 | [os dezenove modos têm um dono só](2026-08-29-MIGRA-GATILHOS-05-os-dezenove-modos-tem-um-dono-so.md) | ambas | **palavra dela** (as 19 frases) |
| 06 | [a caixa de ajustes cresce até onze](2026-08-29-MIGRA-GATILHOS-06-a-caixa-de-ajustes-cresce-ate-onze.md) | desenho | **palavra dela** (onde cabem 11 barras) |
| 07 | [o rascunho e a escrita, por coluna](2026-08-29-MIGRA-GATILHOS-07-o-rascunho-e-a-escrita-por-coluna.md) | frontal | **palavra dela** (o "Todos" que some) |
| 08 | [a trava manual vezes oito](2026-08-29-MIGRA-GATILHOS-08-a-trava-manual-vezes-oito.md) | frontal | **palavra dela** (o toque ao vivo) |
| 09 | [o "Efeito pronto" ganha nome e sentido](2026-08-29-MIGRA-GATILHOS-09-o-efeito-pronto-ganha-nome-e-sentido.md) | ambas | **palavra dela** (2 modos ou 19) |
| 10 | ["Meus efeitos" ganham tela](2026-08-29-MIGRA-GATILHOS-10-meus-efeitos-ganham-tela.md) | ambas | **bancada** |
| 11 | [a prova de tela](2026-08-29-MIGRA-GATILHOS-11-a-prova-de-tela.md) | conferência | **bancada** · zero código |

## A ordem, e a razão de cada seta

```
01 ──► 02 ──► 03 ──► 04 ──┬──► 07 ──┐
                   │      │         ├──► 09 ──► 10 ──┐
                   │      └──► 08 ──┘                ├──► 11
                   └──► 05 ──► 06 ───────────────────┘
```

* **01 primeiro, e sozinha.** Ela mede se o popup do `<select>` sobrevive ao
  cosmic-comp. O produto **já tirou** o combo desta janela uma vez, e a razão
  está em `app/widgets/segmented_selector.py:1-6` — *"o cosmic-comp rouba o foco
  no clique e FECHA o popup"*. Esta aba é **16 `<select>`**; as dez são **117**.
  Se a medição reprovar, a **02** e a **06** mudam antes de começar.
* **02 antes de tudo o mais.** No motor novo o Python **pinta valores**, e para
  alcançar um valor ele precisa de endereço. A página tem **zero** `data-*` e
  três `id` — os três são gradientes do SVG da logo.
* **03 é a única que abre o `main.glade`.** Faixa **767-1133**, 367 linhas, a
  menor das onze páginas. XML único sem seções nomeadas: **uma sprint por vez**,
  em série com as outras nove ondas.
* **04 antes de 07** — a 04 diz **quem** são as colunas, a 07 diz **o que** tem
  dentro. Sem a 04, a 07 não tem `uniq` para escrever.
* **05 antes de 06** — mesmo arquivo (`aba03.py`), e a 05 troca o texto que a 06
  vai medir.
* **07 e 08 correm juntas depois da 04**, e **em série entre si**: dividem
  `triggers_actions.py`. A 08 vem primeiro no `depois_de` da 07 porque a
  troca do relógio de `{lado}` para `{(uniq, lado)}` é o alicerce.
* **09 depois de 07** — o campo `preset` entra no rascunho pelo mesmo
  `_persist_params_to_draft` que a 07 acabou de mudar de dono.
* **10 depois de 09** — "Meus efeitos" mora na mesma lista do efeito pronto, e a
  09 é quem decide se aquela lista troca o modo da coluna.
* **11 no fim, com a leva fechada.** `retratar_abas.py` reescreve as onze fotos
  de uma vez, e agente executor não o roda.

**Podem correr assim que o ok dela sair:** 01 (já), 02, e — depois da 02 — a 05
em paralelo com a 03.

## A arquitetura que as onze compartilham

Escrita aqui uma vez, para não viver em onze cópias que divergem.

- **A aba é uma página HTML** num `WebKit2.WebView`. O Python **não constrói
  widget**: ele **pinta valores** por `run_javascript` e **recebe gestos** por
  `register_script_message_handler`. As duas pontes custam **31 linhas, UMA
  VEZ** (medido em 29/08) — e se o piloto da Controles já as entregou, esta onda
  é o **segundo consumidor** e não as reescreve.
- **Cada valor da tela precisa de endereço.** Onde o mockup não tem, **dar
  endereço é parte da sprint** — e mudar atributo não muda pixel, mas é mudança
  no gerador e tem de estar declarada. É a sprint **02**.
- **O que o produto já lê, lê.** A sprint **liga**, não reescreve. Nesta aba são
  **11 das 17 famílias de valor** já lidas hoje: oito pelo próprio
  `triggers_actions.py` e três pelo `status_actions.py`.
- **A página nasce da mesa real** — um cartão por controle presente, e **zero
  controles é estado legítimo**. Vale para toda aba que mostre controle.
- **Os quatro pinos de versão, nesta ordem:** `Gtk 3.0`, `Gdk 3.0`,
  `GdkPixbuf 2.0`, `WebKit2 4.1`. Com o GTK4 instalado ao lado, um import de
  `Gdk` sem pino carrega o 4.0 e mata o Gtk 3.0.

## As armadilhas medidas — e quais NÃO tocam esta aba

Todas custaram tempo a alguém em 29/08. As quatro primeiras valem aqui:

1. **`FINISHED` dispara depois de `load-failed`** — o WebKit commita uma página
   de erro. Quem escuta só `FINISHED` **reporta sucesso sobre carga que
   falhou**. Sprint 03.
2. **`get_title()` no handler de `FINISHED` devolve vazio** — o título chega
   depois. Confirme a página por um valor do DOM.
3. **Os `<select>` saem como caixa BRANCA** no WebKitGTK: ele relata as cores do
   autor e desenha o tema do sistema. Cura: `select{appearance:none}`. **16
   nesta aba**, 117 nas dez.
4. **`novo-layout/` é `.gitignore:108`** — nem a página nem os geradores viajam
   em worktree nem no pacote, e o `install.sh` não os copia (ele copia
   `assets/glyphs`, `:3103`, e mais nada de desenho). **Duas levas editando o
   mesmo mockup em árvores diferentes divergem SEM conflito de merge**, porque o
   git não vê nenhuma das duas.

**E uma que NÃO toca esta aba, dito porque a lista geral a carrega:** os **84
filtros mortos no SVG** (o `monta.py` prefixa os ids e não reescreve o `url()`).
Contado hoje em `03-gatilhos.html`: **zero `filter:url(` e zero `<filter>`**. Os
três `<svg>` da página são a logo e os dois glifos `l2`/`r2`. Esta aba não
desenha o controle, então a cura de 1,09% de tinta — que é dela decidir — não
muda um pixel aqui.

## O que espera a palavra dela

| onde | a pergunta |
|---|---|
| **antes de tudo** | **o selo caducou.** *"aba gatilhos perfeita"* é de 27/08 e valia para DUAS colunas; o gerador virou QUATRO em 28/08. Ela precisa olhar as quatro no `ver.py 03` |
| 01 | se o popup não sobreviver: lista desenhada **dentro** da página, volta aos botões sempre visíveis, ou só teclado? |
| 04 | a tela com **1, 2 ou 5** controles — as colunas esticam, sobra vazio, ou a área rola? |
| 05 | **as 19 descrições novas** substituem as do produto, ou o produto vence? E o inglês de *Arco de flecha (Bow)* e *Disparo (Weapon)*, que ela mandou ficar em 07/08 e o mockup cortou |
| 06 | **onde as onze barras se desenham** — janela própria, caixa que rola, ou coluna que cresce? E a *Metralhadora* com quatro barras contra as seis do produto: qual das duas está errada |
| 07 | **sem a fita, some o jeito de editar "Todos"** — volta como botão, como chip vivo, ou acaba? Um controle que não está na mesa agora deixa de poder ser configurado |
| 08 | **o toque ao vivo de 300 ms, agora vezes oito** — fica, some, ou vira um botão por coluna? |
| 09 | **o "Efeito pronto" nos 19 modos**: vira *efeito salvo* que troca o modo (sprint de schema), ou continua curva de posição e fica cinza nos 17 (uma linha de CSS)? |
| 10 | quem é o `medido_por`, onde mora o catálogo dela, e o piso de 20 caracteres da nota |
| 11 | **a aba inteira** |

E uma que **não é de tela e é a mais séria**: **o mapa de canais desmente dois
dos 19 modos.** `gatilho.modos_firmware@dualsense` é `parcial`/`parcial`, com a
ressalva nominal — `weapon()` manda `PULSE_B` (Simple_Vibration legado) e
`vibration()` manda `PULSE_A` (Bow), *"ninguém mediu se fazem alguma coisa"*
(conferido no fonte hoje: `core/trigger_effects.py:461-466` e `:469-481`). A aba
desenha os dois como vivos. **A medição é dela, pelo tato**, como foi a de 01/08
que curou os sete. Está na sprint **11**.

## As sete sprints ONDA-GATILHOS de 27/08

**O diagnóstico sobrevive; as citações, não.** Medido em 29/08:

| velha | o que aconteceu |
|---|---|
| `ONDA-GATILHOS-01` (o "Desligado" que não desliga) | **absorvida pela 08.** O diagnóstico está inteiro lá. A citação `aba03.py:145` está **caduca**: a linha 145 de hoje é a descrição do modo *Resistência*, e a frase *"Saiu o 'Desligar' de cada coluna"* não existe mais no gerador |
| `ONDA-GATILHOS-02` (um quadro só, e a tela que não pula) | **morre.** Ela era ~450 linhas de Glade para reconstruir o desenho em widgets. No motor novo o desenho **já é** a página; o que sobra é o enxerto (**03**) e a caixa de ajustes (**06**). Cita `03-gatilhos.html:431` e `:435` para uma discórdia sobre a fita que a decisão de 28/08 (`fita_viva=False`) já resolveu |
| `ONDA-GATILHOS-03` (o recibo dos dois lados) | **morre como sprint, sobrevive como requisito.** O desenho de 28/08 tirou o recibo do quadro: *"o recibo saiu do pé do quadro e virou a própria coluna"* (`aba03.py:362-364`) — com uma coluna por controle, a pergunta "em qual controle escreveu" já não se faz. O que fica é a barra da janela, e o vocabulário continua sendo de `frase_do_desfecho` |
| `ONDA-GATILHOS-04` (o efeito pronto tem nome) | **vira a 09**, com a pergunta dos 19 modos acrescentada |
| `ONDA-GATILHOS-05` ("Meus efeitos") | **vira a 10.** As duas lápides do portão passam a nomeá-la |
| `ONDA-GATILHOS-06` (os dois nomes em inglês) | **absorvida pela 05** — é o mesmo defeito (a página como segundo dono do vocabulário) e o mesmo arquivo |
| `ONDA-GATILHOS-07` (a prova de tela) | **vira a 11** |

**Reaproveitar as sete sem reconferir é propagar afirmação falsa** — o defeito
que `O-AGENTE-AFIRMA-COM-CONFIANCA-O-QUE-NAO-EXISTE` registra. Quem coordena
decide se elas saem do disco (o git guarda; foi o que ela decidiu na faxina de
27/08) ou ficam com nota. **Esta onda não as apaga.**

## Um fato errado que sai daqui, e sai de todo lugar

`aba03.py:397` diz *"Vibração por posição **10**"*. São **11**:
`MultiPositionVibration` monta `_frequency(40)` **mais** as dez posições
(`trigger_specs.py:235-247`), e a conta bate rodando o produto. Não é decisão
medida a preservar — é um número errado, e por isso **é substituído em todos os
lugares onde aparece**. Sprint **06**.

## As colisões, e quem as resolve

**Estado medido em 29/08, depois de escrever as onze:**
`scripts/check_colisao_de_sprints.py` acusava **65** colisões desta onda com
sprints de fora e **9** internas. As 65 e as 9 estão **todas declaradas** no
`depois_de` de cada sprint, com o motivo por cima. O que sobra são **19
colisões com as outras nove ondas MIGRA**, escritas no mesmo dia por levas
irmãs — e essas **não são desta onda resolver**: são três arquivos que as dez
ondas dividem, e quem coordena serializa.

| arquivo | quantas ondas MIGRA o abrem | como se resolve |
|---|---|---|
| `gui/main.glade` | CONTROLES, ILUMINAÇÃO, JOGAR, LANÇADORES, SISTEMA, VIBRAÇÃO **e esta** | **uma por vez.** XML único sem seções nomeadas; cada onda toca uma faixa disjunta (a nossa é 767-1133) — se quem coordena preferir faixa declarada a fila, a nossa já está nomeada |
| `app/app.py` | as mesmas, mais NAVEGAÇÃO | o `_ALVO_POR_ABA` e o `_REFRESH_POR_ABA` são dicionários: cada onda muda a **sua** linha, e o merge é local |
| `profiles/schema.py` + `app/draft_config.py` | CONEXÕES e VIBRAÇÃO | acréscimo de campo, cada onda no seu bloco: serializar basta, não há disputa de conteúdo |



| arquivo | nossas | de fora |
|---|---|---|
| `gui/main.glade` | **03** | LANÇADORES, VIBRAÇÃO, NAVEGAÇÃO, SISTEMA — recurso de bancada, uma por vez |
| `app/actions/triggers_actions.py` | **04, 07, 08, 09, 10** | nenhuma de fora — é o arquivo mais nosso da casa |
| `app/app.py` | **03, 07** | ONDA-VIBRACAO-06, ONDA-SISTEMA-02 |
| `profiles/schema.py`, `app/draft_config.py` | **09** | VIBRAÇÃO 03-06, NAVEGAÇÃO 01 — acréscimo de campo, cada onda no seu bloco: serializar basta |
| `novo-layout/_ferramentas/aba03.py` | **02, 04, 05, 06, 09, 10** | **nenhuma proteção de merge existe** — o arquivo é ignorado pelo git. Serializar **à mão** é a única defesa |
| `app/actions/trigger_specs.py` | **05** | nenhuma |
| `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` | **10** o declara em `nao_toca` | é leva-wide: cada sprint entrega o **manifesto** e quem coordena aplica todos num commit só |

## O que esta onda NÃO fecha, e é dependência dura

**A cor e o nome do plástico não têm dono em `src/`.** Medido:
`grep -rl cores-do-dualsense src/` devolve **vazio**; os leitores são
`scripts/gerar_cores_do_dualsense.py` e `scripts/check_cores_do_dualsense.py`. E
há **duas verdades vivas** divergindo em sete — 28 modelos no
`docs/data/cores-do-dualsense.csv` contra 21 em
`integrations/cor_do_plastico.NOMES_DE_FABRICA`.

O chip que encabeça cada coluna é o que diz **de quem é a coluna**
(`D-A-BORDA-E-A-IDENTIDADE-DA-PECA`). Sem essa ponte, as quatro colunas nascem
**cinzentas e indistinguíveis**, e o desenho inteiro perde o sentido. Quem
fecha é a onda **Conexões** (08, 11 e 12). Esta onda desenha o estado cinza
honesto e declara a dependência.

**E o enxerto substitutivo nunca foi medido.** O provado em 29/08 foi
**aditivo** — o webview como 12ª página do `Gtk.Notebook`, 376 objetos em 56 ms,
62 → ~285 MiB PSS. **Trocar** uma página é onde as 60.862 linhas que hoje chegam
aos widgets por `builder.get_object()` reaparecem. Se o piloto da Controles
medir caro, **as sprints desta onda mudam de tamanho antes de começar** — e a
**03** é quem traz o número.

## Nota de formato

`scripts/check_colisao_de_sprints.py` **aceita** o campo `onda:` desde 27/08
(`_CAMPOS_CONHECIDOS` é `sprint, posse, bancada, onda, cria, depois_de,
nao_toca`) — ele agrupa e é ignorado no cruzamento de posse. As onze o usam.
O índice da onda velha diz que o campo é recusado; **aquilo caducou**.
