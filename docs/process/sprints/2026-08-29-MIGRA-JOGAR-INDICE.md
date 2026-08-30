---
sprint: MIGRA-JOGAR-INDICE
onda: MIGRA-JOGAR
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-JOGAR-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# MIGRA JOGAR — o índice

**29/08/2026.** A aba **Jogar** (a antiga Início) deixa de ser widget montado em
Python e passa a ser a **página `novo-layout/01-jogar.html` dentro de um
`WebKit2.WebView`**, com o Python pintando valor e recebendo gesto.
`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`
(`docs/data/decisoes-dela.csv:119`).

**ONZE sprints** — o censo desta aba contou dez. A décima primeira é a **máscara
Nintendo Pro**: o desenho aprovado põe o terceiro chip no bloco `.mascara` de
cada um dos quatro cartões (`novo-layout/01-jogar.html:1076`, `:1469`, `:1862`,
`:2255`), o catálogo do produto tem **duas** entradas
(`integrations/uinput_gamepad.py:115`), e uma busca em `docs/` por
`MÁSCARA-NINTENDO-01` — o nome que o próprio mockup dá à sprint — **não devolve
um arquivo**. Sem ela a aba nasce com um chip que não clica em nada.

## A EXECUÇÃO ESPERA A PALAVRA DELA

A aba **Controles** está sendo feita viva agora como **piloto** do enxerto.
Palavra dela, 29/08:

> *"Preciso avaliar como ela se comporta. Depois dou o ok pra seguirmos
> materializando a ordem pra fazermos todas as abas funcionarem no novo motor."*

**As onze sprints desta onda se ESCREVEM. Nenhuma executa antes do ok dela sobre
o piloto.** E `PROVA-DE-TELA-01` continua valendo por cima disso: interface só
fecha com o olho dela, foto antes e foto depois.

## A arquitetura que as onze compartilham — leia uma vez, não se repete adiante

- A aba é uma **página HTML** num `WebKit2.WebView`. O Python **não constrói
  widget**: ele **pinta valores** por `run_javascript` e **recebe gestos** por
  `register_script_message_handler`. As duas pontes custam **31 linhas, uma
  vez**, e o dono delas é o **piloto**: `MIGRA-CONTROLES-01` cria o módulo de
  enxerto (`webview_de_aba`) e `MIGRA-CONTROLES-03` cria as duas pontes.
  **Nenhuma sprint desta onda as reescreve.**
- **Todo valor da tela precisa de endereço** (um `id` ou um `data-`). Dar
  endereço é trabalho, e é a **MIGRA-JOGAR-03**.
- **O que o produto já lê, lê.** Doze dos dezessete valores desta tela já saem do
  `state_full` e já são formatados por `app/actions/home_actions.py`. A sprint
  **liga**; não reescreve leitor.
- **A página nasce da mesa real.** Um cartão por controle presente. **Zero
  controles é estado legítimo** e o desenho não o tem — está escrito na
  **MIGRA-JOGAR-04** como buraco, e é dela decidir o que a tela diz.

### As armadilhas medidas, e todas custaram tempo a alguém em 29/08

Fonte: `docs/process/2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md`, §6.

1. **Quatro pinos de versão são obrigatórios** — `Gtk 3.0`, `Gdk 3.0`,
   `GdkPixbuf 2.0`, `WebKit2 4.1`, e o `Gdk` **depois** do `Gtk`. Com o GTK4 ao
   lado, um `import Gdk` sem pino carrega o 4.0 e mata o Gtk 3.0.
2. **`FINISHED` dispara depois de `load-failed`** — o WebKit commita uma página
   de erro. Quem escuta só o `FINISHED` **reporta sucesso sobre carga que
   falhou**. Toda régua de carga desta onda escuta os dois.
3. **`get_title()` no handler de `FINISHED` devolve vazio** — o título chega
   depois. Nove de dez abas voltaram "sem título" para quem mediu assim.
4. **Os `<select>` saem como caixa branca** no WebKitGTK, que relata as cores do
   autor e desenha o tema do sistema. A cura é `select{appearance:none}` e já
   está no `novo-layout/_ferramentas/ver.py`. São 117 nas dez abas — **nenhum  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
   nesta**, e é por isso que a Jogar é barata de moldura.
5. **84 filtros mortos no SVG** (`novo-layout/_ferramentas/monta.py` prefixa os
   ids e não reescreve o `url()`, porque o desenho usa aspas escapadas). O
   contorno do touchpad **nunca apareceu, em motor nenhum**. A cura está pronta,
   muda 1,09% do desenho que ela aprovou e **é dela** — não entra em sprint desta
   onda.
6. **Uma régua que roda o tique UMA VEZ mede um instante, não um
   comportamento.** Foi assim que uma leva de 29/08 introduziu uma regressão que
   só aparecia 181 segundos depois, com 67 testes verdes.
7. **O `scrollIntoViewIfNeeded` do Playwright ROLA antes de medir** e cega toda
   medição de layout feita depois. Foi assim que um portão deu verde sobre uma
   linha fora da caixa.

## As onze

| # | sprint | camada | trava |
|---|---|---|---|
| 01 | [a página entra no lugar da `tab_home_box`](2026-08-29-MIGRA-JOGAR-01-a-pagina-entra-no-lugar-da-tab-home-box.md) | moldura | **o ok dela sobre o piloto** |
| 02 | [a aba 01 ganha gerador, e o HTML passa a viajar](2026-08-29-MIGRA-JOGAR-02-a-aba-01-ganha-gerador-e-o-html-passa-a-viajar.md) | mockup | — |
| 03 | [cada valor da tela ganha endereço](2026-08-29-MIGRA-JOGAR-03-cada-valor-da-tela-ganha-endereco.md) | mockup | — |
| 04 | [a mesa real pinta os cartões](2026-08-29-MIGRA-JOGAR-04-a-mesa-real-pinta-os-cartoes.md) | ambas | **palavra dela** (o zero, e a cor no rádio) |
| 05 | [a coluna Atenção que conta](2026-08-29-MIGRA-JOGAR-05-a-coluna-atencao-que-conta.md) | frontal | — |
| 06 | [o quarto botão Desligado na fileira de modos](2026-08-29-MIGRA-JOGAR-06-o-quarto-botao-desligado-na-fileira-de-modos.md) | ambas | **palavra dela** |
| 07 | [a escada do código na tela](2026-08-29-MIGRA-JOGAR-07-a-escada-do-codigo-na-tela.md) | ambas | **palavra dela** (o quinto degrau) |
| 08 | [a faixa final e o rodapé](2026-08-29-MIGRA-JOGAR-08-a-faixa-final-e-o-rodape.md) | frontal | — |
| 09 | [a pausa que só o terminal desfaz](2026-08-29-MIGRA-JOGAR-09-a-pausa-que-so-o-terminal-desfaz.md) | ambas | **palavra dela** (o desenho não a tem) |
| 10 | [a máscara por controle deixa de ser desenho](2026-08-29-MIGRA-JOGAR-10-a-mascara-por-controle-deixa-de-ser-desenho.md) | backend | **palavra dela** (antes ou depois da bancada) |
| 11 | [a terceira máscara — Nintendo Pro](2026-08-29-MIGRA-JOGAR-11-a-terceira-mascara-nintendo-pro.md) | backend | — |

## A ordem, e por quê

```
   (o piloto entrega o enxerto e as duas pontes: MIGRA-CONTROLES-01 e -03)
                     │
   02 ──► 03 ──┬───► 04 ──► 05        (02→03 dividem `aba01.py`: SÉRIE)
               │      │
   01 ─────────┘      ├──► 08
   (o enxerto)        └──► 09

   06   07   (esperam a palavra dela; não dividem arquivo com as de cima)

   10 ──► (nada)      11 ──► (nada)   (backend, soltas, e paralelas entre si)
   10 ──► 04          (o cartão só mostra máscara viva depois da 10)
```

* **02 antes de 03** — as duas abrem `novo-layout/_ferramentas/aba01.py`, que a  <!-- ref-externa: nasce na MIGRA-JOGAR-03, ainda não executada -->
  02 cria. Quem divide arquivo executa **em série** (R5).
* **03 antes de 04, 05, 08 e 09** — sem endereço o Python não alcança valor
  nenhum. A 03 é a que mais destrava por linha escrita.
* **01 é independente de 02/03** — ela é a moldura da janela, não a página, e
  pode correr em paralelo. O piloto mede o custo do enxerto substitutivo em
  geral; a **01 mede o desta aba**, que é o pior caso da casa: 3.369 linhas de
  montagem de widget saem de uma vez, e um poller que reconhece a página pelo id
  do Glade cala em silêncio se esse id sumir.
* **10 e 11 são backend puro** e não tocam a página. Podem correr desde o
  primeiro minuto, antes do ok dela sobre o piloto — são as duas únicas da onda
  que não dependem dele. **10 antes de 04** só para o cartão não mostrar uma
  escolha que o daemon ignora.
* **06 e 07 esperam a palavra dela**, e as duas perguntas estão no §0.2 do
  `docs/process/SPRINT_ORDER.md`. Escrevê-las agora é o trabalho; executá-las
  sem a resposta é inventar tela.

## O que é dela decidir, e nenhuma sprint decide sozinha

| # | A pergunta |
|---|---|
| 01 | **A fita fica em quantos lugares?** O produto a desenha na `Gtk.HeaderBar` (`app/actions/status_actions.py:1702`) e o desenho a desenha dentro da página (`novo-layout/01-jogar.html:567`). Com o enxerto as duas ficam na tela ao mesmo tempo — o mesmo defeito que ela viu em um segundo quando a tira apareceu duas vezes |
| 04 | **Zero controles.** O desenho não tem esse estado. O que a tela diz quando não há nada na mesa é dela |
| 04 | **A cor do plástico nos cartões do rádio.** O mapa é portão e diz **não** (`docs/data/mapa-controles.csv:111`, `radio_aciona=não`, motivo `divida` desde 29/08/2026, quando a lápide `o-aparelho-recusa` caiu; `cabo_aciona=sim`, e a leitura pelo cabo só passou a acontecer de verdade em 29/08, com a porta do broker). Três saídas, de preços diferentes: **lembrar** o que se leu no cabo (`ControleDeclarado.cor`, `utils/maquina.py:551`), **nascer sem cor**, ou **ela declarar à mão**, que é o que o produto já permite |
| 06 | **O quarto botão "Desligado" vale no clique ou espera o `Aplicar`?** E de quem é o gesto — a Jogar ou a Sistema? (`SPRINT_ORDER.md` §0.2, "Ligar/Desligar o Hefesto em dois lugares") |
| 07 | **O quinto degrau: "Teclado + Mouse" (desenho) ou "Controlar o PC" (`home_actions.py:154`)?** E antes disso: se ele é o modo desktop, a escada ganha um degrau novo; se é outra coisa, é **escada nova** e a ordem inteira volta à mesa |
| 09 | **O despausar tem botão nesta aba?** O desenho não o desenha. Três sprints já o batizaram de três jeitos — "Continuar", "Retomar", e um gesto na Navegação (`SPRINT_ORDER.md` §0.2) |
| 10 | **A máscara por controle entra antes ou depois da bancada?** `daemon/subsystems/external_mask.py:74-95` diz com todas as letras que **ninguém mediu** se um jogo aceita dois vpads com máscaras diferentes ao mesmo tempo, e lista o ensaio que resolveria |
| 11 | **A Nintendo Pro entra nesta onda ou depois do piloto?** Ela não é desenho: é descritor `uinput` novo e um PID que **não pode** ser o `0x2009` do Pro físico (VPAD-04) |

## O que esta onda NÃO faz, e de quem é

| O quê | Quem |
|---|---|
| As 28 cores e as 10 zonas chegarem ao produto. **RECONTADO em 29/08/2026: não são "sete de divergência", são sete AUSÊNCIAS mais três NOMES divergentes (`Z1` Ragnarok/Ragnarök, `Z2` Spider-Man 2/Marvel's Spider-Man 2, `ZB` Limited/Special) e os 21 hexas divergindo 21 de 21, quatro deles invertendo claro e escuro** | **ONDA-CONEXOES-12** |
| A cor se ler pelo rádio (a semente `0x53`, e os três portões que hoje recusam) | **ONDA-CONEXOES-11** |
| O módulo de enxerto (`webview_de_aba`) | **MIGRA-CONTROLES-01** |
| As duas pontes (`run_javascript` e `register_script_message_handler`) | **MIGRA-CONTROLES-03** |
| Onde o HTML das dez abas passa a morar no pacote | a **moldura** da leva; a 02 entrega a Jogar no endereço que a moldura fixar |
| Os 84 filtros mortos do SVG | **dela** — muda 1,09% do desenho aprovado |
| O carimbo "este jogo já sabe por onde entra" sair da aba Perfis | a onda **Perfis**; a 07 o **traz** para cá |

## As colisões, medidas

`python3 scripts/check_colisao_de_sprints.py`, com as dez ondas MIGRA no disco:

| | |
|---|---|
| colisões no total | **538** |
| **colisões que não envolvem uma sprint MIGRA** | **0** |
| colisões que envolvem esta onda | 60 |
| **colisões ENTRE duas sprints desta onda** | **0** |

Leia a segunda e a quarta linha juntas: **a onda está inteiramente serializada
contra si mesma**, e as 538 nasceram todas hoje, quando as dez ondas chegaram ao
disco de uma vez. Isso é **decisão de quem coordena, não de quem escreveu a
onda** — o `depois_de` serializa uma colisão, e a ordem entre dez ondas não se
decide de dentro de uma delas.

As 60 são de três famílias:

1. **`gui/main.glade` — recurso de bancada, uma sprint por vez em toda a casa.**
   XML único, sem seções nomeadas: conflito de merge nele é irrecuperável na
   prática (`SPRINT_ORDER.md` §1.1). Nesta onda **uma só sprint o abre — a 01** —,
   e ela corre **em série** com a sprint de enxerto das outras nove, porque as dez
   trocam páginas do **mesmo** `Gtk.Notebook`.
2. **`app/app.py` e `app/actions/home_actions.py`** — também só da **01** (a 11
   toca o `_FLAVOR_ITEMS` do `home_actions.py`, e por isso já vem serializada
   atrás dela). As sprints 04, 05, 08 e 09 nascem em módulos novos sob
   `app/actions/jogar/`, cada uma no seu arquivo, exatamente para não disputarem
   as 3.369 linhas do `home_actions.py`.
3. **`daemon/subsystems/coop.py`, `gamepad.py` e `ipc_handlers.py`** — a
   **MIGRA-JOGAR-10** os divide com sprints de levas anteriores
   (`COOP-QUE-NAO-DESMONTA-01`, `JOGADOR-3-FANTASMA-01`, `BORDA-DE-QUEDA-01`,
   `LEVA-1`) e com `ONDA-CONTROLES-07`. Quem coordena serializa; a 10 não
   resolve isso de dentro.

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje, antes e depois
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo só,
que morre no meio sem traceback. Ela toca nós `uinput` de verdade, e **duas
sprints desta onda (10 e 11) mexem exatamente em `make_virtual_pad`**, que é o
caminho que multiplica esses nós.
