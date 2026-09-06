---
sprint: MIGRA-LANCADORES-INDICE
estado: absorvida
onda: MIGRA-LANCADORES
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-LANCADORES-INDICE.md
cria:
  - docs/process/sprints/2026-08-29-MIGRA-LANCADORES-INDICE.md
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - scripts/
  - novo-layout/
---

> **06/09/2026 — ESTA ONDA FOI ABSORVIDA.** As sprints deste índice estão `estado: absorvida` (as do enxerto na janela GTK, `caducou`): a tela é o HTML desde 02/09, a fila é o `docs/data/paridade-gtk-html.csv` (aba 07) e a ordem de agora é [AS VINTE E QUATRO HORAS](../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md). O que este índice mediu continua valendo como diagnóstico; nada aqui se despacha pelo id.

# MIGRA LANÇADORES — o índice

**29/08/2026.** Dez sprints levam a **aba 07 — Lançadores** do que o produto é
hoje (a aba "Emulação", sobre uinput) até o mockup que ela aprovou sem ressalva
— *"lançadores perfeito parabéns"*
(`src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md:59`) — **rodando num
`WebKit2.WebView` dentro da janela GTK3**
(`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`,
`docs/data/decisoes-dela.csv:119`).

## A execução espera DUAS palavras dela

1. **O ok sobre o piloto.** A aba Controles está sendo feita viva agora, como
   piloto do enxerto substitutivo. Palavra dela, literal: *"Depois dou o ok pra
   seguirmos materializando a ordem pra fazermos todas as abas funcionarem no
   novo motor."* **Estas dez sprints SE ESCREVEM; nenhuma executa antes desse ok.**
2. **A régua do selo** — *como o produto mede "o controle chega lá", por
   lançador*. É a trava do §0.1 do `docs/process/SPRINT_ORDER.md`, e **trava a
   10 e com ela o fim da onda**.

E o desenho já está **selado**: nenhuma sprint desta onda abre uma caixa, move um
bloco ou inventa um botão. A aba **nasce escondida** por ordem dela
(`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`) e só aparece na tira na 10, com a foto
na mesa (`PROVA-DE-TELA-01`).

## As dez

| # | Sprint | Camada | O que resolve |
|---|---|---|---|
| 01 | [o enxerto substitutivo: a Emulação sai, a 07 entra escondida](2026-08-29-MIGRA-LANCADORES-01-o-enxerto-substitutivo-a-emulacao-sai-e-a-07-entra-escondida.md) | bancada · Glade | troca o motor da aba, e cria `app/telas/lancadores.py` |  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
| 02 | [a página muda de casa e passa a viajar](2026-08-29-MIGRA-LANCADORES-02-a-pagina-muda-de-casa-e-passa-a-viajar.md) | empacotamento | `.gitignore:108` — hoje o HTML da aba **não existe no repositório** |
| 03 | [cada valor da tela ganha endereço](2026-08-29-MIGRA-LANCADORES-03-cada-valor-da-tela-ganha-endereco.md) | desenho (atributos) | 35 valores, 14 gestos, **zero** endereços |
| 04 | [quem está instalado nesta máquina](2026-08-29-MIGRA-LANCADORES-04-quem-esta-instalado-nesta-maquina.md) | backend | o produto não sabe dizer que o RetroArch existe |
| 05 | [os cartões nascem da máquina](2026-08-29-MIGRA-LANCADORES-05-os-cartoes-nascem-da-maquina.md) | ponte | os seis cartões são literais no HTML; a conta passa a derivar |
| 06 | [o censo que o produto levanta e joga fora](2026-08-29-MIGRA-LANCADORES-06-o-censo-que-o-produto-levanta-e-joga-fora.md) | ponte | `Censo.como_dicionario()` já é JSON puro e só o `main()` o chama |
| 07 | [os cinco impedimentos ganham tela, e o Heroic para de mentir](2026-08-29-MIGRA-LANCADORES-07-os-cinco-impedimentos-ganham-tela-e-o-heroic-para-de-mentir.md) | ponte | 4 dos 5 nunca foram renderizados; e a causa do Heroic é de Steam |
| 08 | [o "Consertar", que não diz "pronto" sem ter feito](2026-08-29-MIGRA-LANCADORES-08-o-consertar-que-nao-diz-pronto-sem-ter-feito.md) | ponte | `curar_o_que_e_automatico`: **zero chamadores em `src/`** |
| 09 | [os botões que saem da aba](2026-08-29-MIGRA-LANCADORES-09-os-botoes-que-saem-da-aba.md) | ambas | abrir o lançador, criar perfil, o atalho de detectar, e o botão roxo que **não nasce** |
| 10 | [o selo, e só então a aba existe na tira](2026-08-29-MIGRA-LANCADORES-10-o-selo-e-so-entao-a-aba-existe-na-tira.md) | ambas | a régua **antes** do selo, e a revelação da aba |

### Por que dez, e não nove

O censo desta aba, feito de manhã, disse **nove**. Ficaram dez por **convergência
com as ondas irmãs**, e a mudança tem custo declarado:

O censo tratava "o enxerto no Glade" e "a página entrar no pacote" como um
trabalho só. As oito ondas escritas em paralelo hoje separaram os dois, e com
razão medida: o `gui/main.glade` é **recurso de bancada** — uma sprint por vez em
toda a casa, porque conflito de merge nele é irrecuperável na prática — enquanto
`gui/telas/` e `scripts/telas/` não disputam bancada nenhuma. Juntar os dois
prenderia o empacotamento na fila do XML sem necessidade. **A separação custa uma
sprint e compra a serialização certa.**

## A ordem, e por quê

```
04  (backend, solta — pode correr do primeiro minuto, sem o ok dela)

MIGRA-CONTROLES-01 (o piloto) ─┐
MIGRA-CONTROLES-02 (a casa)  ──┴─► 01 ─► 02 ─► 03 ─► 05 ─► 06 ─► 07 ─► 08 ─► 09 ─► 10
                                                 ▲
                                            04 ──┘

de fora da onda:  ONDA-SISTEMA-02, ONDA-CONEXOES-06, ONDA-NAVEGACAO-01 ──► 01
                  ONDA-PERFIS-03, MIGRA-PERFIS-04 ──► 09
```

* **04 é a única solta** (`depois_de: []`). Ela não importa nada da janela, é
  100% stdlib e roda no `python3` do sistema. Quanto antes correr, melhor.
* **01 antes de tudo o mais**, porque é ela quem cria `app/telas/lancadores.py`.  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
  E **01 depois das três de fora**: ela **apaga** a página da Emulação, e apagar
  antes de `ONDA-SISTEMA-02` (o diagnóstico), `ONDA-CONEXOES-06` (o microfone) e
  `ONDA-NAVEGACAO-01` (os combos) recolherem o que morava lá faz a fonte de três
  sprints desaparecer.
* **Da 05 à 10 é tudo série**, e o motivo é um só: escrevem no mesmo
  `app/telas/lancadores.py`. Paralelizar aqui compra conflito de merge, não  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
  velocidade.
* **02 e 03 dividem a página e o gerador** — série entre si, e as duas antes da
  05, que precisa dos endereços para pintar.
* **10 por último**, e ela **não abre o Glade**: o "escondido" mora em
  `VISIVEL_NA_TIRA`, dentro do módulo da aba. Pôr esse booleano no XML prenderia
  a revelação na fila da bancada — o recurso mais disputado da casa — para virar
  um `True`. **A 01 é a única desta onda que abre o `main.glade`.**

**Colisões, conferidas com `scripts/check_colisao_de_sprints.py`:** as dez
sprints desta onda somam **ZERO** queixas — nem entre si, nem com as outras
noventa e poucas da casa. As 27 que a bancada do XML gerava estão declaradas em
`depois_de` na **01**, que carrega a fila inteira; as duas sprints de 27/08 que
esta onda substitui (`ONDA-LANCADORES-01/-10` na 01, `ONDA-LANCADORES-02` na 04)
também estão lá, para o portão ver **substituição** onde há substituição, e não
descuido.

## O que é dela decidir

Seis, e o censo mediu cada uma antes de perguntar:

1. **Como o produto mede "o controle chega lá", por lançador.** Trava a **10**.
   Nenhuma linha mede isso hoje, e o `docs/data/mapa-controles.csv` **não
   socorre**: 308 linhas em 11 famílias que respondem por *peça* e por
   *transporte*; nenhuma chave com `lancador`, `wrapper` ou `steam`.
   **E o preço vai junto com a pergunta:** a primeira versão honesta mostra
   **NÃO SEI** onde o mockup que ela aprovou mostra **verde em quatro cartões**.
   É divergência contra desenho fechado, e ela precisa saber **antes** de ver a
   foto.
2. **A aba lista LANÇADORES ou também os JOGOS de fora da Steam?** (06) Muda
   materialmente o tamanho da onda. Medido: o catálogo de hoje só enxerga Steam —
   `jogos_locais.py:119` casa apenas `steam://rungameid/`, e
   `prontuario_dos_jogos.py:755` só lê vdf da Steam. Listar jogo de Heroic,
   Lutris ou Flatpak é **varredura nova**, não é ligar o que existe.
3. **O "Consertar" também fica na aba Sistema, ou só aqui?** (08) Metade da cura
   já roda invisível como carona do Salvar (`carona_do_wrapper.py:300`), e a
   Sistema já tem os cinco botões de Steam que ela decidiu manter lá. Dois
   caminhos para a mesma cura é o **P6** do redesenho.
4. **Em qual perfil cai o "Aplicar o estilo Retrô/Emulador"?** (09) A fita desta
   aba é esmaecida de propósito (`fita_viva=False`), logo não há controle
   escolhido; e o estilo **não existe em código** — depende da `ONDA-PERFIS-04` e
   de `D-OS-OITO-ESTILOS-DE-JOGO-NASCEM-NO-MOCKUP` (`decisoes-dela.csv:117`).
5. **Lançador ausente some ou fica apagado, e o agrupamento vale sempre?** (04,
   05) O mockup junta os dois ausentes num cartão só —
   `layout/07-lancadores.html:648`, opacidade 0,5. Com **três** ausentes o
   desenho aprovado não diz o que fazer.
6. **Quando a aba passa a existir na tira** (10). Ela decide **vendo**.

**Já decidido, não repropor:** os cinco botões de Steam **ficam na Sistema**
(`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`); *"Detectar o jogo que está aberto"*
**mora em Perfis**, e aqui é só um atalho (`D-DETECTAR-O-JOGO-MORA-EM-PERFIS`,
`decisoes-dela.csv:101` — era a duplicata mais cara da fila); a lista e a ordem
dos cartões são as do mockup aprovado; modo e máscara **não** moram aqui.

## O que muda em relação às dez sprints de 27/08

As `ONDA-LANCADORES-01..10` continuam valendo **como diagnóstico** — os endereços
de código foram reconferidos hoje e sobreviveram todos. O que caducou é a
**forma**: elas construíam widget GTK, e a interface nova não constrói widget.

| de 27/08 | virou |
|---|---|
| `ONDA-LANCADORES-01` (a casca nasce escondida) | **01** + **03** — a casca é a página; a "casca escondida" virou o enxerto |
| `ONDA-LANCADORES-02` (quem está instalado) | **04**, quase intacta: o módulo não conhece janela, logo o motor não o toca |
| `ONDA-LANCADORES-03` (a lista real e o "Procurar de novo") | **05** |
| `ONDA-LANCADORES-04` (os cinco impedimentos) | **07** |
| `ONDA-LANCADORES-05` (a cura sem chamador) | **08** |
| `ONDA-LANCADORES-06` (detectar o jogo) | **SAIU** — decisão dela, 29/08 |
| `ONDA-LANCADORES-07` (abrir o lançador e criar perfil) | **09** |
| `ONDA-LANCADORES-08` (o estilo Retrô) | **09**, e o botão **não nasce** |
| `ONDA-LANCADORES-09` (o selo) | **10** |
| `ONDA-LANCADORES-10` (a antiga sai, a nova entra na tira) | **01** (a antiga sai) + **10** (a nova aparece) |
| — | **02** é nova: nasceu do `.gitignore:108`, que no motor GTK não era defeito |

## Os riscos desta aba, medidos hoje

1. **É a aba com MENOS rede de portão da casa.** O `mapa-controles.csv` não tem
   linha para ela, logo `scripts/check_paridade_transporte.py` **não reprova uma
   única afirmação desta tela**. Toda a proteção nasce com a onda — e a régua do
   selo é justamente a que ainda não existe.
2. **O cartão do Heroic carimba causa de Steam, e é o único cartão colorido.**
   `Sem wrapper` nasce de `Prontuario.tem_wrapper` (`prontuario_dos_jogos.py:395`)
   lendo a `LaunchOptions` do `localconfig.vdf`. **Não há uma linha no produto que
   leia config do Heroic.** É a sprint **07**, e é o lugar em que ela vai olhar
   primeiro.
3. **A mesa é de DOIS e o texto do cartão diz QUATRO.** *"Os 4 controles chegam"*
   sai de `len(MESA)` no gerador, e a `MESA` do mockup tem quatro. Ela tem
   **dois**. A fonte certa (`controller.list`, `daemon/ipc_handlers.py:3983`) já
   é lida em três lugares do app (`status_actions.py:1826`,
   `home_actions.py:2389`, `config/secao_controles.py:766`) — é a **05** que a
   liga, e sem isso a aba mente para ela na primeira abertura.
4. **"Consertar" pode dizer "pronto" sem ter feito nada.** `CURA_ADIADA` é o
   caminho **mais comum** (ela clica enquanto joga). É exatamente o defeito que
   `HONESTIDADE-STEAM-01` já curou uma vez no toast do "Aplicar correções".
5. **A detecção por varredura é fábrica de régua falsa**, e a casa pagou por
   **seis instrumentos falsos em quinze horas** em 29/08. Por isso a **04** exige
   `evidencia` em vez de um booleano.
6. **Subprocesso sem teto de tempo trava o produto inteiro** — a lição do
   `btmgmt` sem adaptador, que travava o `install.sh` **para sempre** em quem não
   tem Bluetooth.
7. **Dois botões "Procurar de novo" na mesma tela.** No desenho aprovado é o
   mesmo rótulo, logo tem de ser a mesma chamada, ou é o **P6** se repetindo.
8. **Endereço de código envelhece calado, e esta onda é a DÉCIMA da fila.** Quem
   executar estas dez o fará muito depois de elas terem sido escritas. Os
   endereços aqui (`:139-143`, `:395`, `:569`, `:614`, `:733`, `:879`, `:885`)
   foram conferidos no fonte em **29/08/2026** e precisam ser **reconferidos no
   dia**, não confiados.

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py   # a foto de hoje, antes e depois
git add -A                             # os portões são cegos a arquivo novo
bash scripts/portoes.sh                # os 26 portões
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo só,
que morre no meio sem traceback.

**A palavra final é dela**, com a foto na mesa. Aprovar o mockup não é aprovar a
tela.

## Nota de reconciliação de ids

Duas sprints do piloto são citadas por toda esta onda:

- **`MIGRA-CONTROLES-01`** — o **enxerto substitutivo**, que é a primeira sprint
  de todas as dez ondas e a única que ainda **mede** alguma coisa. Ela cria
  `gui/webview_de_aba.py`.  <!-- ref-externa: nasce na MIGRA-CONTROLES-01, ainda não executada -->
- **`MIGRA-CONTROLES-02`** — a **casa das dez páginas**: fixa
  `src/hefesto_dualsense4unix/gui/telas/NN-<aba>.html` e `scripts/telas/abaNN.py`,  <!-- ref-externa: `abaNN` é NOTAÇÃO — o NN é o número da aba, não um arquivo -->
  edita o `pyproject.toml` e o `install.sh`, e cria o
  `scripts/check_a_pagina_e_a_do_gerador.py`. Algumas ondas irmãs a citam pelo  <!-- ref-externa: nasce na MIGRA-CONTROLES-02, ainda não executada -->
  apelido **`MIGRA-MOLDURA-01`**; é a mesma sprint.

Se a onda do piloto tiver batizado qualquer das duas com outro número, quem
coordena corrige a linha: **a dependência é o trabalho, não o nome.**
