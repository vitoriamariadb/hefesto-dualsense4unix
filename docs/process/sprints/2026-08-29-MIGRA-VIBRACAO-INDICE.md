---
sprint: MIGRA-VIBRACAO-INDICE
estado: absorvida
onda: MIGRA-VIBRACAO
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-VIBRACAO-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

> **06/09/2026 — ESTA ONDA FOI ABSORVIDA.** As sprints deste índice estão `estado: absorvida` (as do enxerto na janela GTK, `caducou`): a tela é o HTML desde 02/09, a fila é o `docs/data/paridade-gtk-html.csv` (aba 05) e a ordem de agora é [AS VINTE E QUATRO HORAS](../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md). O que este índice mediu continua valendo como diagnóstico; nada aqui se despacha pelo id.

# MIGRA VIBRAÇÃO — o índice

**A aba 05 no motor novo.** Oito sprints, do enxerto da página até o que a tela
deixou de dizer.

**A EXECUÇÃO ESPERA A PALAVRA DELA.** A aba **Controles** está sendo feita viva
como **piloto** do transplante. Palavra dela, 29/08:

> *"Preciso avaliar como ela se comporta. Depois dou o ok pra seguirmos
> materializando a ordem pra fazermos todas as abas funcionarem no novo motor."*

**As oito SE ESCREVEM agora; nenhuma se executa antes desse ok.**

**A especificação visual é `layout/05-vibracao.html`**, aprovada por ela
com elogio literal (`src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md:39`):

> *"ok, foda. Viu esses detalhes que eu pedi? Eu quero esse refinamento em todas
> as demais agora em diante. Tá fechado essa. Excelente trabalho."*

---

## A CORREÇÃO DE FATO QUE ABRE ESTA ONDA

**O enxerto SUBSTITUTIVO foi medido — e foi medido NESTA aba.**

A decisão `D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK` e o
`2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md` dizem *"ainda não foi
medido"*. Era verdade quando foram escritos; deixou de ser às **17h38 de
29/08**, quando a leva "o que resta" entregou a medição — **em cinco modos, com
a página `Rumble` como cobaia**, dublê de IPC e o `intacto` como base.

| modo | páginas | ordem | pág. 6 | ids ausentes | órfãos | `None` nos gestos | estouros |
|---|---|---|---|---|---|---|---|
| `intacto` (base) | 11 | sim | ScrolledWindow | 0 | 0 | 0 | 0 |
| `orfao` (só `remove_page`) | 11 | sim | **WebView** | 0 | **15** | 0 | 0 |
| **`real`** (XML apagado) | **11** | sim | **WebView** | **15** | 0 | **64** | **0** |
| `mordida-vazio` | 10 | não | — | 0 | 15 | 0 | 0 |
| `mordida-cru` | 11 | sim | ScrolledWindow | 0 | 0 | 0 | 0 |

**A resposta é que nada estoura, e é essa a má notícia.** Treze gestos, zero
exceções, e os treze pedem um id que voltou `None` — porque todo acesso é
guardado (`rumble_actions.py:1185-1186`). Tirar a página **desliga em
silêncio**. E um gesto não fica em silêncio: **o "Aplicar" manda `rumble.set[0,
0]` ao daemon** e confirma na barra de estado, por causa do fallback `else 0` de
`_read_scales` (`rumble_actions.py:1189-1190`). **É a MIGRA-VIBRACAO-01.**

**Os números do custo, medidos nesta aba** (AST, não a olho):

| | |
|---|---|
| morrem em `rumble_actions.py` | **100** linhas (64 de 4 funções só de pintura + 36 de widget em 8 mistas) |
| sobrevivem intactas | **~400** — as funções puras que já viram texto |
| nascem — adaptador **desta** aba | **~55** (30 Python + 25 JS) |
| nascem — transporte genérico, **uma vez para as dez** | **11** |
| saem do `main.glade` | **415 linhas de XML** + 21 dos adjustments; 376 → **343 objetos** |
| memória | intacto 39,2 MiB · aditivo 210,8 · **substitutivo 210,8** — os 33 objetos a menos **não movem o ponteiro** |

**Saldo: −45 linhas de Python nesta aba.** Contra as 500-700/aba da rota do
emissor, é cerca de **10× menos**.

### E DUAS AFIRMAÇÕES CAÍRAM JUNTO — as duas do nosso lado

1. **"As duas pontes = 31 linhas, UMA VEZ."** Contadas: 31 confirmado, **mas 20
   dessas linhas são JS casado por SELETOR com o DOM da aba Vibração** (`.vib
   .ctrl`, `.motor .cheio`, `.seg button`). **Só 11 são "uma vez".** O resto é
   **por aba** — e é por isso que o adaptador desta deu 55, não 31.
2. **"Rumble é a aba mais barata, em 6 de 6."** É uma corrida de dois cavalos:
   ela foi medida só contra a Sistema. Nas onze, **Gatilhos** tem 16 ids, 4
   sinais e 363 linhas — **menor que Rumble em todos os eixos**; Rumble é a **6ª
   de 11** por ids. A extrapolação parte de uma aba **mediana**, não de um piso.

**Onde a prova mora:** a pasta `o-que-resta/` do scratchpad da sessão de 29/08.
Os instrumentos: `enxerto_substitutivo.py`, `r-*.json`, `prova_da_ponte.py`, `ponte.json`, `o_congelamento.py`, `o_peso.py`, `quanto_morre.py`. <!-- ref-externa: nenhum destes existe na árvore, e a ausência é o assunto — foram escritos para medir e não foram commitados. -->
**Nada disso está no repositório**, e quem executar **reconfere os números no
dia**: são de `dev` em 29/08, e esta aba tem sprints em voo.

### A ponte de ponta a ponta já rodou nesta aba, com dado real dela

```
perfil ativo no disco: "Mortal Kombat" · rumble.policy = "max"
Python → tela : acendeu "Máximo" nos 4 cartões · barra 100% · "150%"
tela → Python : click em "Economia" (DOM de verdade)
                → {"gesto":"politica","dado":"economia"}
                → rumble.policy_set("economia", timeout=1.0)
                → rascunho: policy=economia
                → toast: "Intensidade da vibração: Economia"
1.533 ms com carga fria · load-failed: null · sem tocar um widget
```

**O mixin real do produto rodou inteiro pela ponte.** É o que faz esta onda ser
**ligar**, e não reescrever.

---

## As oito

| # | sprint | camada | trava |
|---|---|---|---|
| 01 | [a página troca de lugar, e o "Aplicar" para de mandar (0, 0)](2026-08-29-MIGRA-VIBRACAO-01-a-pagina-troca-de-lugar-e-o-aplicar-para-de-mandar-zero.md) | Glade + frontal | **bancada do XML** |
| 02 | [os quarenta e oito gestos que não têm endereço](2026-08-29-MIGRA-VIBRACAO-02-os-quarenta-e-oito-gestos-que-nao-tem-endereco.md) | gerador | — |
| 03 | [as colunas nascem da mesa dela](2026-08-29-MIGRA-VIBRACAO-03-as-colunas-nascem-da-mesa-dela.md) | gerador + frontal | **palavra dela** (a cor no rádio) |
| 04 | [a força ganha endereço, e o "Auto" sai da coluna](2026-08-29-MIGRA-VIBRACAO-04-a-forca-ganha-endereco-e-o-auto-sai-da-coluna.md) | backend | **bancada** + palavra dela |
| 05 | [quatro "Testar", quatro "Parar", e a trava vira mapa](2026-08-29-MIGRA-VIBRACAO-05-quatro-testar-quatro-parar-e-a-trava-vira-mapa.md) | backend | **bancada** + palavra dela |
| 06 | [os oito interruptores de lado, que não existem em linha nenhuma](2026-08-29-MIGRA-VIBRACAO-06-os-oito-interruptores-de-lado-que-nao-existem-em-linha-nenhuma.md) | esquema + backend | **bancada** + palavra dela |
| 07 | [o desenho treme ao vivo, por lado e por coluna](2026-08-29-MIGRA-VIBRACAO-07-o-desenho-treme-ao-vivo-por-lado-e-por-coluna.md) | frontal | — |
| 08 | [o que a tela deixou de dizer, e o botão que sumiu](2026-08-29-MIGRA-VIBRACAO-08-o-que-a-tela-deixou-de-dizer-e-o-botao-que-sumiu.md) | frontal + gerador | **palavra dela** |

### Por que oito, e o censo dizia sete

O censo desta aba contou **sete**. Mudou por duas medições que chegaram **depois
dele**, e as duas produziram trabalho que não cabia dentro de outra sprint:

* **a 01 nasceu do enxerto medido.** O censo a previa como "trocar a página"; a
  medição achou um **defeito vivo** — o `(0, 0)` mandado em silêncio, mais as
  quatro tabelas chaveadas por id do Glade e as três réguas cegas. Isso é uma
  sprint, não um passo.
* **a 02 saiu de dentro das outras.** O censo dava o endereço como parte de cada
  sprint; o adaptador medido mostrou que o casamento de hoje é **posicional**
  (`.seg button[j] → POLITICAS[j]`) e quebra **em silêncio**. Endereço é
  pré-requisito das seis seguintes, e sprint que seis outras esperam tem de ter
  nome próprio.

---

## A ordem, e a razão de cada posição

```
01 ──► 02 ──► 03 ──► 04 ──► 05 ──► 06 ──► 07
                │                    │      │
                └────────────────────┴──────┴──► 08
```

* **01 primeiro, e sozinha no Glade.** É a única desta onda que abre o
  `main.glade`, e o XML é bancada: uma sprint por vez.
* **02 antes de tudo o que pinta.** Sem endereço, o Python alcança por posição —
  e a pintura passa a escrever no controle errado no dia em que alguém trocar
  duas linhas do gerador.
* **03 antes de 04, 05 e 06.** O `data-uniq` da coluna é o endereço que as três
  usam. Sem a mesa real, o endereço é um número de cena.
* **04 → 05 → 06 em SÉRIE, por R5.** As três dividem `ipc_handlers.py`,
  `schema.py`, `draft_config.py` e os dois subsistemas de rumble. Não é gosto: é
  o que impede duas levas de colidirem num arquivo só.
* **07 depois de 03 e 06.** Ela acende o desenho por lado, e o lado só tem
  sentido depois de os interruptores existirem.
* **08 por último, e ela toca `aba05.py` (série com 02 e 03).** É a que **muda o
  desenho aprovado**, e por isso vai à mesa dela junto com a 01.

**Podem correr juntas:** nenhuma. Esta onda é serial de ponta a ponta — a 01
está no Glade, e as sete restantes formam uma corrente por arquivo compartilhado.
**Isso é a onda dizendo o seu preço**, não um descuido.

---

## O que a onda velha vira

As seis sprints de `ONDA-VIBRACAO-*` (27/08) foram escritas para uma aba GTK.
**Três dissolvem e três sobrevivem em substância:**

| velha | o que acontece |
|---|---|
| `ONDA-VIBRACAO-01` — o desenho que nunca teve tela | **dissolve na 03/07.** O mockup **já é** a tela e já desenha o controle por coluna. O que **não** dissolve é a trava de empacotamento que ela achou: `assets/control-svg/` não é instalado, e agora a página inteira tem o mesmo buraco → **`MIGRA-MOLDURA-01`** |
| `ONDA-VIBRACAO-02` — a aba vira um quadro só | **dissolve.** O quadro único é o desenho aprovado; ninguém constrói XML para chegar nele |
| `ONDA-VIBRACAO-03` — a força vira escolha só, para em 150, aplica ao soltar | **sobrevive fora desta onda.** O `RUMBLE_CUSTOM_MULT_MAX` continua **2.0** (`schema.py:76`) e baixá-lo para 1,5 é decisão dela, com o aparo dos perfis que já estão acima. Nada disso é de motor |
| `ONDA-VIBRACAO-04` — a força ganha endereço | **vira a MIGRA-VIBRACAO-04.** O diagnóstico sobrevive **inteiro** e não se reescreve; muda o endereço: era a fita, é a coluna |
| `ONDA-VIBRACAO-05` — os dois motores ligam por lado | **vira a MIGRA-VIBRACAO-06.** O fato medido (`weak`=`common[2]`=direito) sobrevive; o gesto passa a ser por coluna |
| `ONDA-VIBRACAO-06` — o desenho treme ao vivo | **vira a MIGRA-VIBRACAO-07**, e **encolhe**: o par por vpad já sobe (`rumble_no_fisico`) e já tem leitor público e testado (`motores_no_fisico`). A pergunta "o desenho apaga sozinho?" **já está respondida** por `ATIVIDADE_FRESCA_S` |

**Apagar as seis é de quem coordena, com manifesto** — regra dela, 27/08:
*sprint velha se APAGA, o git guarda*. Não apague antes de a decisão do §"o que
é dela decidir" estar tomada: a `ONDA-VIBRACAO-03` ainda carrega uma pergunta
aberta que nenhuma das oito herdou.

---

## O que é dela decidir — a lista inteira da onda

1. **O botão "Deixar o jogo controlar a vibração" volta, ou o "Parar" devolve?**
   (**08**) Ele **não existe em nenhum dos dez mockups** (grep: 0), existe hoje
   (`rumble_actions.py:1092`), e **o banner do cabeçalho manda clicar nele pelo
   nome, de qualquer aba** (`status_actions.py:2262`). Sem decisão, a aba nasce
   com quatro "Parar" que trancam quatro controles e um banner apontando para o
   nada — **que é o RUM-01 de volta, literal**.
2. **O "Auto" fica na fileira das colunas?** (**04**) O esquema o **recusa por
   unidade**, com validador e mensagem dedicados (`schema.py:798-811`), e a
   razão é medida: ele escala pela **bateria do controle primário**. O mockup
   desenha o P3 em Auto, com 70%. As três saídas estão na sprint.
3. **O "Parar" é da coluna ou da mesa?** (**05**) Se for da mesa, o desenho tem
   quatro botões que fazem a mesma coisa quatro vezes.
4. **O lado desligado vale por peça ou pela mesa — e vale para o JOGO, ou só
   para o teste?** (**06**) Se for acessibilidade (é o que a dica da aba diz),
   tem de valer para o jogo, e entra em `apply_game_rumble`. Se for bancada,
   custa um terço.
5. **A cor do plástico pelo RÁDIO.** (**03**) O mapa diz `radio_aciona = não`,
   `divida` desde 29/08/2026 (era `o-aparelho-recusa` — a recusa era do nosso CRC),
   e duas colunas do mockup são BT. Declaração dela, ou
   "Não sei" com a borda neutra? **É a mesma pergunta das dez abas.**

   > **NOTA DE 06/09/2026 (A-RECUSA-QUE-CITOU-O-MAPA-01) — a pergunta encolheu,
   > porque o `não` caiu.** A `ONDA-CONEXOES-11` correu em 02/09/2026 (commit
   > `2e772412`): `identidade.cor_do_aparelho@dualsense`
   > (`docs/data/mapa-controles.csv:111`) hoje é **`radio_aciona = sim`**,
   > `radio_de_onde_sei = medido`, `radio_ate_onde_foi = SAIU NO FIO`. A
   > declaração dela continua valendo como recurso, mas **não é mais o único
   > caminho para as colunas de BT terem cor**.
6. **Os 12 filtros mortos desta aba.** (**02**) 12 `filter: url()` contra 12
   `<filter>` — nenhum casa. O Chrome ignora e desenha; **o WebKit segue o SVG
   1.1 e não desenha**, e o WebKit é o motor escolhido. A cura está pronta e
   muda **1,09%** do desenho que ela aprovou (o contorno do touchpad).
7. **Onde a área de aviso mora**, já que ela aprovou uma tela sem ela. (**08**)
   O preço de cada posição é em **altura**, e a janela tem 757 px.

---

## Os riscos que valem para a onda inteira

1. **`novo-layout/` é `.gitignore:108`** — não viaja em worktree, não entra no
   pacote (`install.sh:3103` copia só `assets/glyphs`). Com o WebKit a falha
   deixa de ser "um desenho faltando" e passa a ser **a aba não existir, sem um
   erro no log**. Dono: `MIGRA-MOLDURA-01`.
2. **Divergência viva entre as ondas paralelas:** a `MIGRA-GATILHOS-02` escreve
   o gerador em `src/hefesto_dualsense4unix/interface/`; a `MIGRA-LANCADORES-01` já
   reivindica `src/hefesto_dualsense4unix/gui/telas/07-lancadores.html` e um
   gerador em `scripts/telas/`. <!-- ref-externa: os dois caminhos são o que
   aquela sprint VAI criar; a ausência é o assunto. -->
   **Esta onda segue a primeira** e declara a
   divergência; escolher é da moldura. *(O candidato tem apoio: o
   `pyproject.toml:85` já empacota `src/hefesto_dualsense4unix/gui/*.glade`, e
   um irmão para `gui/telas/*.html` é uma linha.)*
3. **Três fontes remotas.** O mockup carrega Space Grotesk e JetBrains Mono de
   `fonts.googleapis.com`. Sem internet o WebKit cai no `system-ui`, as métricas
   mudam, **e o que ela vê deixa de ser o desenho que ela aprovou** — e uma
   régua que comparar com o Chrome online passa a medir contra a fonte errada,
   que é a armadilha nº 1 desta casa.
4. **Quatro pinos de versão são obrigatórios:** `Gtk 3.0`, `Gdk 3.0`,
   `GdkPixbuf 2.0`, `WebKit2 4.1`, **e o `Gdk` depois do `Gtk`**. Com o GTK4
   instalado ao lado, um `import Gdk` sem pino carrega o 4.0 e mata o Gtk 3.0.
5. **`FINISHED` dispara depois de `load-failed`** — o WebKit commita uma página
   de erro. Quem escuta só `FINISHED` **reporta sucesso sobre carga que
   falhou**. E `get_title()` no handler de `FINISHED` devolve **vazio**: o
   título chega depois (`notify::title`).
6. **Os `<select>` saem como caixa BRANCA** no WebKitGTK — ele relata as cores
   do autor e desenha o tema do sistema. A cura é `select{appearance:none}`, já
   aplicada no `ver.py`. **Esta aba não tem `<select>`**, mas a moldura carrega  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
   a regra para as dez.
7. **A vibração por RÁDIO nunca foi medida no aparelho.**
   `vibracao.rumble.passthrough@dualsense`: `radio_de_onde_sei =
   inferido-do-codigo`, com a ressalva *"Implementado sem gate, mas NÃO MEDIDO
   por Bluetooth"*. Duas colunas do mockup são BT. Dono: **08**.
8. **`vibracao.rumble.habilitar` é `parcial` nos DOIS transportes** — dos quatro
   bits, o produto só liga três: o `VALID_FLAG2_COMPATIBLE_VIBRATION2` nunca
   sobe na saída (`backend_pydualsense.py:1200` só sabe **desligar**). É *a casa
   sabe e o produto não faz*, mora **fora** desta aba, e é o chão em que os oito
   interruptores da **06** vão pisar.
9. **Trocar o alvo global para testar por coluna é PROIBIDO por medição** — o
   flip transitório do `_output_target_key` foi removido pela `PERFIL-01` porque
   persistia configuração no controle errado com `max_workers=2`
   (`backend_pydualsense.py:4770-4774`). A rota certa é `rumble.set`/`stop` com
   `uniq`, roteando por `set_rumble_for`.
10. **O daemon vivo é mais velho que o código.** Com install editable, cura de
    daemon só vale no próximo `start`, e o sintoma é a **ausência de dado** —
    quem testar a 04/05/06 sem reiniciar vai ver a coluna vazia e culpar a
    ponte.
11. **A suíte cria nós uinput de verdade** — 1289 num dia derrubaram a sessão
    gráfica dela. A 06 mexe em `apply_game_rumble`, que é caminho de vpad. A
    suíte roda no **fim**, em **oito lotes**, com a máquina livre, e é de quem
    coordena.
12. **Endereço de código envelhece calado.** Os números deste índice são de
    `dev` em 29/08 — e **duas linhas do censo já divergiam ao serem
    reconferidas** (`_cor_na_tela` está em `secao_controles.py:1558`, não
    `:877`; `ControllerRumbleOverride` em `schema.py:762`, não `:760`).
    **Reconfira todo ponteiro no dia da execução**; é mais barato que descobrir
    na costura.

---

## Duas dívidas da LEVA que esta onda não pode pagar sozinha

**1. As dez ondas colidem entre si, e o número é 275.** `check_colisao_de_sprints.py`
acusa 275 colisões não declaradas na pasta inteira — **zero delas envolve esta
onda** (as internas foram serializadas, e as cruzadas estão declaradas no
`depois_de` de cada sprint, com a lista de 29/08). As que sobram são das outras
nove entre si, e da leva antiga com a nova: **dez ondas escritas ao mesmo tempo
não têm como saber os ids umas das outras.** Quem coordena roda o script uma vez
com as dez no disco e fecha a conta; é trabalho de uma passada, não de dez.

**2. Uma sprint da leva não passa no leitor de frontmatter.**
`2026-08-29-MIGRA-SISTEMA-05-…` faz o `check_colisao_de_sprints.py` **estourar**
(`AttributeError: 'str' object has no attribute 'append'`, `:177`) — o portão não
reprova, ele morre, e com ele morre a conferência da pasta inteira. Não é desta
onda, e está aqui porque **quem rodar o portão vai ver o traceback antes de ver
qualquer colisão**.

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje, antes e depois
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh                # linha de base: 1 vermelho (referencias-docs, herdado)
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre.

**A palavra final é dela**, com a foto na mesa (`PROVA-DE-TELA-01`). **A 01 e a
08 vão juntas** — separadas, a primeira entrega uma aba que perdeu três canais
de verdade e um botão que o resto do produto cita pelo nome.
