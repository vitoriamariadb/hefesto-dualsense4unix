---
sprint: MIGRA-SISTEMA-INDICE
posse:
  COORDENA:
    - docs/process/sprints/2026-08-29-MIGRA-SISTEMA-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# MIGRA SISTEMA — o índice

**A aba 09 no motor novo.** O mockup `novo-layout/09-sistema.html` deixa de ser
desenho e passa a ser **a aba**, rodando num `WebKit2.WebView` dentro da janela
GTK3 — decisão dela de 29/08,
`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`
(`docs/data/decisoes-dela.csv:119`): *"sem impeditivo então. manda ve em tudo."*

> ## A EXECUÇÃO ESPERA A PALAVRA DELA
>
> A aba **Controles** está sendo feita viva agora, como **piloto** do enxerto.
> Palavra dela: *"Depois dou o ok pra seguirmos materializando a ordem pra
> fazermos todas as abas funcionarem no novo motor."*
>
> **As dez sprints desta onda SÃO ESCRITAS. Nenhuma executa antes do ok dela
> sobre o piloto.** E `PROVA-DE-TELA-01` continua valendo: interface só fecha
> com o olho dela.

- **Contrato:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, §7 Sistema
  (linhas 506-601) — toda linha do "Nada se perdeu" é requisito.
- **Especificação visual:** `novo-layout/09-sistema.html`, gerado por
  `novo-layout/_ferramentas/aba09.py`.
- **A palavra dela sobre esta aba:**
  `novo-layout/_ferramentas/CORRECOES-DELA.md`, seção "Aba Sistema".
- **Protocolo de quem executa:** `docs/process/COMO-EXECUTAR-UMA-SPRINT.md`.

## Por que DEZ, e o censo dizia sete

O censo desta aba contou **sete** — e contou certo, para a onda antiga. **A
troca de motor redistribuiu o trabalho, não o dobrou:**

| o que mudou | efeito |
|---|---|
| A `ONDA-SISTEMA-02` **está morta** (`D-O-GAMEPAD-VIRTUAL-SAI-DA-INTERFACE`, 28/08) | −1 |
| As `ONDA-SISTEMA-04`, `05` e `07` eram **GTK frontal** (`GtkListBox`, `theme.css`, grade de duas colunas). **No WebKit isso evapora: o mockup É a tela.** O que sobra delas é a **ponte** e o **dado** | −3 desenhos, +0 |
| Nasce o **enxerto substitutivo** (01), que ninguém mediu | +1 |
| Nasce o **endereço** (02): a página não tem por onde ser alcançada | +1 |
| A ponte se parte em **leitura** (03) e **gestos** (04), com posses e mordidas diferentes | +2 |
| O **exame** se parte em *chegar à página* (05) e *as cinco linhas que faltam* (06) | +1 |
| Nasce o **portão do pretérito** (07): a tela não conta conserto que não aconteceu | +1 |
| Sobrevivem, redestinadas: o Perfil de Bateria (08), o ambiente + plugins (09), o registro + Restaurar (10) | +0 |

**Sete viram dez, e as dez são menores.** A maior é a 01, e ela é a mais barata
das dez abas: **nove ids** por `self._get` e **treze handlers** `on_*` — contra
as 60.862 linhas que hoje chegam aos widgets por `builder.get_object()` no
produto inteiro.

## As dez

| # | sprint | camada | trava |
|---|---|---|---|
| 01 | [o enxerto substitutivo](2026-08-29-MIGRA-SISTEMA-01-o-enxerto-substitutivo.md) | motor | **ok dela sobre o piloto** · **onde o HTML mora** |
| 02 | [a página ganha endereço](2026-08-29-MIGRA-SISTEMA-02-a-pagina-ganha-endereco.md) | desenho | — |
| 03 | [os dez valores que o produto já lê](2026-08-29-MIGRA-SISTEMA-03-os-dez-valores-que-o-produto-ja-le.md) | ponte | — |
| 04 | [os doze gestos chegam ao Python](2026-08-29-MIGRA-SISTEMA-04-os-doze-gestos-chegam-ao-python.md) | ponte | **o botão de Ligar** |
| 05 | [o exame em quatro partes, e a contagem derivada](2026-08-29-MIGRA-SISTEMA-05-o-exame-chega-em-quatro-partes-e-a-contagem-e-derivada.md) | ponte | as três linhas apagadas |
| 06 | [as cinco linhas de exame que não existem](2026-08-29-MIGRA-SISTEMA-06-as-cinco-linhas-de-exame-que-nao-existem.md) | backend | quantas linhas cabem |
| 07 | [o pretérito espera o motor](2026-08-29-MIGRA-SISTEMA-07-o-preterito-espera-o-motor.md) | portão | o rótulo do botão |
| 08 | [o perfil de bateria muda de endereço](2026-08-29-MIGRA-SISTEMA-08-o-perfil-de-bateria-muda-de-endereco.md) | ponte | o aviso de bateria |
| 09 | [a linha do ambiente, e os plugins](2026-08-29-MIGRA-SISTEMA-09-a-linha-do-ambiente-e-os-plugins.md) | ambas | o que a linha diz |
| 10 | [o registro técnico, e o Restaurar de fábrica](2026-08-29-MIGRA-SISTEMA-10-o-registro-tecnico-e-o-restaurar-de-fabrica.md) | ambas | **o conteúdo do painel** |

## A ordem

```
  02 ──┐
       ├──► 01 ──► 03 ──► 04 ──► 05 ──► 06 ──► 07 ──► 08 ──► 09 ──► 10
       │                    │
       └─ (solta desde o    └─ 08, 09 e 10 só precisam de 01+02+03+04;
          primeiro minuto)     a fila delas é por dividirem daemon_actions.py
```

* **02 é solta e pode correr do primeiro minuto** — ela só toca
  `novo-layout/_ferramentas/aba09.py`, que nenhuma outra sprint desta casa abre.
  **É a única que não espera nada além do ok dela.**
* **01 antes de tudo o mais**: enquanto a página for widget, não há onde pintar.
* **03 antes de 04**: a ponte de gestos repinta pela ponte de leitura. Ligar
  gesto primeiro cria o segundo escritor que a 03 proíbe.
* **05 a 10 são uma fila quase linear, e o motivo é um arquivo:**
  `app/actions/daemon_actions.py` (2.794 linhas, sem seções). **Nove das dez o
  abrem.** O `depois_de` **serializa** em vez de proibir — que é o que o
  `check_colisao_de_sprints.py` aceita como declaração.
* **O `depois_de` repete a fila inteira, e não só o antecessor**, porque
  `check_colisao_de_sprints.py:237` compara **par a par** e não fecha
  transitivamente.

## As três coisas que mudaram debaixo das sprints de 27/08

Quem for executar **tem de saber destas três antes de abrir o índice antigo**
(`2026-08-27-ONDA-SISTEMA-INDICE.md`):

1. **A `ONDA-SISTEMA-02` ESTÁ MORTA, e o índice antigo não sabe.** A
   `D-O-GAMEPAD-VIRTUAL-SAI-DA-INTERFACE` (28/08,
   `decisoes-dela.csv:91`) a derrubou com todas as letras — *"o bloco sai; a
   ONDA-SISTEMA-02 é redestinada, não apagada às cegas"* — e o índice de 27/08
   **continua listando** "02 — O gamepad virtual muda-se da Emulação" na tabela e
   no ordenamento, com a 04/05/06 declarando-a em `depois_de`. **Quem ler o
   índice e não o CSV constrói um bloco que ela mandou sumir.**
   **E há um fio solto declarado no próprio CSV:** a `CONEXÕES-06` depende da 02
   (*"primeiro o dono antigo solta"* o microfone do Glade da Emulação). **Matar
   a 02 sem redestinar esse pedaço deixa a CONEXÕES-06 sem antecessor** — e o
   pedaço é o **microfone**, não o gamepad virtual. É trabalho de quem coordena,
   não desta onda.
2. **Três ponteiros de decisão apontam para o vazio.** O índice de 27/08 e a
   `ONDA-SISTEMA-02` citam `/tmp/coleta/decisoes.md:174` e `:237` como endereço
   de `D-A-EMULACAO-MORRE` e `D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`.
   **`/tmp/coleta` não existe** (conferido em 29/08). As duas decisões estão
   **vivas** em `docs/data/decisoes-dela.csv`, linhas **59** e **80** — o
   endereço é que caducou. Um `/tmp` num documento de sprint não sobrevive a um
   boot.
3. **As `ONDA-SISTEMA-04`, `05` e `07` eram desenho de GTK.** No WebKit o
   desenho é o mockup. **O diagnóstico delas sobrevive; a entrega de tela, não.**
   As três continuam no disco e continuam declarando posse — por isso as dez
   sprints desta onda as listam em `depois_de`. **Quem coordena decide se elas
   se apagam** (a regra dela: *sprint velha se APAGA — o git guarda*); esta onda
   não apaga nada.

**O que SOBREVIVE INTACTO, e é bom:** a `ONDA-SISTEMA-03` (o exame em quatro
partes) e a `ONDA-SISTEMA-06` (os dois motores sem chamador) são **backend
puro** — as duas declaram `nao_toca: app/`. **A troca de motor não as toca.**
As MIGRA-05 e MIGRA-07 as **consomem**; não as reescrevem.

## O que já está pronto e só falta ligar — e vale ouro

Esta aba é, de longe, a que tem mais cura escrita e nunca ligada. É **o defeito
mais caro desta casa** (`A-CASA-SABE-E-O-PRODUTO-NAO-FAZ`), e aqui ele está em
sete exemplares:

| o que | onde | quem chama hoje |
|---|---|---|
| `daemon.resume` | `daemon/ipc_server.py:121` | **só o terminal** (`cli/app.py:421`) |
| `paused` no `state_full` | `daemon/ipc_handlers.py:2002` | duas abas — **nunca esta** |
| `plugin.list` / `plugin.reload` | `daemon/ipc_server.py:184-185` | **só a CLI** (`cli/cmd_plugin.py:43`, `:77`) |
| `descrever_display_grafico` | `app/actions/ambiente_na_tela.py:76` | **zero chamadores** |
| `curar_o_que_e_automatico` | `integrations/prontuario_dos_jogos.py:885` | **no registro da casa-sabe** |
| `steam_root_ou_recusa` | `integrations/proton_pin.py:184` | **no registro da casa-sabe** (`:1623`) |
| `camadas_vulkan.py` inteiro | `integrations/camadas_vulkan.py` | um gesto só, **na aba que morre** |

E o **Perfil de Bateria não é trabalho novo — é mudança de endereço**:
`secao_orcamento.py` já tem os três rótulos, a tradução perfil→disco, o degrau
derivado de `RUMBLE_POLICY_MULT` e a frase de `alcance_de_hoje()`. O mockup lê
tudo isso **por AST**, justamente para não digitar.

## As armadilhas medidas — não as repita

**Do motor (WebKit 4.1, a série do GTK 3):**

1. **Quatro pinos obrigatórios**: `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
   `WebKit2 4.1` — e o `Gdk` **depois** do `Gtk`. Com o GTK4 ao lado, um import
   de `Gdk` sem pino carrega o 4.0 e mata o Gtk 3.0.
2. **`FINISHED` dispara depois de `load-failed`** — o WebKit commita uma página
   de erro. **Quem escuta só FINISHED reporta sucesso sobre carga que falhou.**
3. **`get_title()` no handler de FINISHED devolve vazio** — o título chega
   depois. Nove de dez abas voltaram "sem título" para quem mediu assim.
4. **`register_script_message_handler` leva UM argumento** na 4.1 (dois na 6.0).
5. **Os `<select>` saem como caixa BRANCA**: o WebKitGTK relata as cores do
   autor e desenha o tema do sistema. Cura: `select{appearance:none}`. **Esta
   aba tem UM `<select>`** (`09-sistema.html:702`) — e a folha vive hoje no
   instrumento (`ver.py`), **não no produto**.
6. **84 filtros mortos no SVG** (`monta.py:439` prefixa os ids e não reescreve o
   `url()`, porque o desenho usa aspas escapadas). **A cura está pronta e NÃO
   foi aplicada** — muda 1,09% do desenho que ela aprovou, e é dela.

**Desta aba:**

7. **O miolo tem DOIS pixels de folga.** `aba09.py:38` grava
   `MIOLO_H, ALTURA = 542, 540`, e cada linha de achado custa 25,5px. **Qualquer
   achado a mais, qualquer rótulo que quebre linha, e a aba volta a esconder
   conteúdo sem dizer que esconde** — que é o defeito de 93px que a rodada de
   28/08 curou.
8. **O exame varia de 6 a 8 e o desenho congelou em 8.** As duas condicionais
   devolvem `None` quando não há divergência, e todo `check_*` pode devolver
   `WARN`. **A contagem tem de ser derivada, e o layout tem de aguentar 6 e 9.**
9. **Um gesto desta aba mora na aba que morre.** `btn_camadas_engasgo` está
   dentro do `daemon_box`, e o handler é `on_camadas_engasgo` em
   `emulation_actions.py:2075`. **Quem desmontar a Emulação leva o handler junto
   sem perceber**, e o achado "Nenhuma sobreposição" perde o motor no mesmo
   commit.
10. **`novo-layout/` é `.gitignore:108`.** Não viaja em `git worktree add`, não
    entra no pacote, e o `install.sh` não o copia. **Enquanto for assim, portão
    nenhum desta casa enxerga a especificação aprovada por ela** — e uma régua
    em `tests/` que a leia passa em branco em toda árvore de agente. É por isso
    que a régua da 02 vive em `novo-layout/_ferramentas/`.
11. **O `scrollIntoViewIfNeeded` do Playwright rola antes de medir**, e cega
    toda medição de layout feita depois. Foi assim que um portão deu verde sobre
    uma linha fora da caixa (27/08).
12. **A suíte não roda num processo só, e esta aba toca o caminho que já
    derrubou a sessão gráfica dela** (nós uinput de verdade). **Oito lotes, no
    fim, com a máquina livre** — e `retratar_abas.py` é de quem coordena, nunca
    dentro da árvore de um agente.

## O que espera a palavra dela

Nenhuma destas é refinamento: sem elas, alguém para no meio ou inventa tela.

| A pergunta | Trava |
|---|---|
| **O ok sobre o piloto** (a aba Controles) | **as dez** |
| **Onde o HTML passa a morar** (hoje `.gitignore:108`) | **01**, e com ela as dez |
| **O botão "Ligar o Hefesto" sumiu do desenho.** Com o Hefesto desligado, a tela nova não tem como ligá-lo — sobra "Reiniciar", cujo rótulo mente sobre o estado. E o "Corrigir modo de execução" sumiu junto | **04** |
| **As três linhas do exame que o mockup apagou** (`check_snd_quirk`, `check_quirk`, `check_wireplumber`): saem de vez, ou voltam como 9ª/10ª/11ª? Com três a mais a aba volta a esconder conteúdo | **05** |
| **Quantas linhas o exame pode ter.** Com os cinco achados novos, ele vai a onze | **06** |
| **O conteúdo do painel de Detalhes técnicos**: fica o `systemctl status` (existe), ou nasce um método de log (é o que o mockup desenhou, e não há IPC) | **10** |
| **"Áudio dos 4 controles roteado" com dois no rádio** — o mapa de canais desmente, e o produto hoje é honesto (*"nos N controles no cabo"*). O mockup perdeu a qualificação ao encurtar | **03** |
| **O interruptor "avisar quando a bateria estiver acabando" mora aqui?** As duas funções estão escritas, testadas e sem chamador. **Não virou sprint** — a regra é não inventar feature | **08**, se ela disser sim |
| **Entra uma linha de saúde para o canal DSX?** A porta `127.0.0.1:6969` aceita gatilho e cor de qualquer programa local e nenhuma tela conta isso. **Não virou sprint** | **06**, se ela disser sim |

## Antes de fechar a onda

```bash
git add -A                                  # os portões são cegos a arquivo novo
bash scripts/portoes.sh                     # os 26 portões, ~2 min
python3 scripts/check_colisao_de_sprints.py
```

E, porque a onda mexe na tela: `scripts/gui-captura/retratar_abas.py` — **por
quem coordena, depois que a leva fechar**, nunca dentro da árvore de um agente.
A suíte em **oito lotes**, no fim, com a máquina livre.

**A palavra final é dela, com a foto na mesa** (`PROVA-DE-TELA-01`). Aprovar o
mockup não é aprovar a tela.

## Nota de formato

`scripts/check_colisao_de_sprints.py` aceita `onda:` como **campo** desde
27/08 (`_CAMPOS_CONHECIDOS`, `:87`), mas as dez sprints desta onda a declaram
como **comentário** (`# onda: MIGRA-SISTEMA`), pela mesma razão das ondas
anteriores: campo desconhecido **cega o portão inteiro**, e o comentário
atravessa qualquer versão do analisador.

Os ids `MIGRA-CONTROLES-PILOTO` e `MIGRA-MOLDURA-01` aparecem no `depois_de`
das dez e **podem não existir com esse nome** quando a onda executar — o
piloto está em voo agora e a moldura ainda não foi escrita. Um id desconhecido
em `depois_de` é inofensivo para o portão (ele só serializa quando casa); **quem
coordena corrige o nome**. O que não muda: **as duas pontes e a casa do HTML
têm um dono só, e não nascem nesta onda.**
