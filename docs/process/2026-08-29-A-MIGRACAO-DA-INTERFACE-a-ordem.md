# A MIGRAÇÃO DA INTERFACE — a ordem

**29/08/2026.** Escrito para quem chega sem ter lido nada.

Este documento existe por um pedido dela, e o pedido tem um medo dentro:

> *"salvar nossa conversa no novo repo pq agora por exemplo tá em 99% do
> contexto, pelo que o projeto andou acho que vamos perder tudo (...)
> materializar tudo em sprints.md mesmo da migração de interface e próximas
> etapas também até a conclusão do projeto como um todo."*

O medo é legítimo, e a resposta é **disco**. Uma conversa acaba; um arquivo fica.
O que esta sessão mediu está aqui em números, não em memória.

**Onde está o resto:**

| Documento | O que é |
|---|---|
| **este** | a **ordem** da migração da interface: quem vai primeiro, e por quê |
| `docs/process/sprints/2026-08-29-MIGRA-*-INDICE.md` | **dez índices**, um por aba — as sprints, o grafo interno, o que é dela |
| [`2026-08-29-O-CAMINHO-ATE-A-CONCLUSAO.md`](2026-08-29-O-CAMINHO-ATE-A-CONCLUSAO.md) | o projeto **inteiro** até a 1.0 — as onze etapas, os cortes possíveis e o preço de cada um |
| [`2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md`](2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md) | o que está **em voo agora**, e o que fazer se o contexto sumir |
| [`2026-08-26-O-REDESENHO-as-dez-abas.md`](2026-08-26-O-REDESENHO-as-dez-abas.md) | o **contrato** de cada aba — o "Nada se perdeu", onde toda linha é requisito |

Nada aqui se repete daqueles. Onde eles já dizem, este aponta.

---

## 1. A DECISÃO, e o que ela substitui

**A interface nova é o mockup HTML rodando dentro da janela do produto**, num
`WebKit2.WebView` enxertado no `Gtk.Notebook` que já existe. O desenho deixa de
ser especificação a reproduzir e **passa a ser a tela**.

Está gravada em `docs/data/decisoes-dela.csv:119`
(`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`), com a palavra dela:
*"sem impeditivo então. manda ve em tudo."*

### As duas rotas, e o número que decidiu

Foram construídas e medidas **com a mesma régua**. A diferença que decidiu **não
foi fidelidade** — foi **acompanhar**.

| | Rota 3 — o gerador emitindo GTK | Rota WebKit — o mockup dentro da janela |
|---|---|---|
| fidelidade do desenho | 0,4% de tinta perdida, 0 de 28 regiões erradas | `.quadro` e rodapé iguais ao Chrome **ao pixel**, nas dez abas |
| **acompanhar uma mudança** | mudou-se **uma linha** do mockup e a foto GTK saiu **byte-idêntica** | 105,5 → 109,8 px, igual ao Chrome a **0,1 px** em 8 medidas |
| reuso entre abas | **0%, 0% e 8,9%** nas três extensões tentadas | — |
| custo | **500 a 700 linhas POR ABA** | **31 linhas de ponte, uma vez** + **55 por aba** (medido) |
| cobertura | 7 das 10 abas nunca encostadas; a 01 fora **por construção** | as **dez** carregam |
| gesto vivo | zero fotos de `:hover`, com 91 ocorrências no CSS | `:hover`, `Tab` e `Enter` reais fotografados |

**Por que a rota 3 foi reprovada, em uma frase:** ela acerta o retrato e erra o
espelho. Três números estavam **digitados** dentro do emissor. Um desenho que não
acompanha o desenho não é o desenho — é uma cópia que envelhece sozinha, e esta
casa já pagou por isso onze vezes num dia só.

### O preço, medido e aceito

- **Memória: 62 → ~285 MiB PSS** (4,6×). Ela viu o número e aceitou.
- **Peso de pacote no Flatpak: ZERO byte.** O `org.gnome.Platform//47` que ela já
  usa traz a biblioteca e o typelib.
- A convivência foi medida no produto **real**: GTK 3.24.41 + WebKit2 4.1 no
  mesmo processo, com o webview enxertado no `main.glade` de verdade — **376
  objetos em 56 ms**, virando a 12ª página do `Gtk.Notebook`. On-screen custa o
  mesmo que offscreen, e nem com compositing forçado nasce um terceiro processo.
- `install.sh:476-488` já declara a dependência nas três famílias de distro
  (`gir1.2-webkit2-4.1` / `webkit2gtk4.1` / `webkit2gtk-4.1`).

### FATO CORRIGIDO — o enxerto substitutivo **já foi medido**

O enunciado desta leva, e a própria linha do `decisoes-dela.csv:119`, dizem que
*"o enxerto SUBSTITUTIVO ainda não foi medido"*. **Foi**, em 29/08 às 15h43, com
a página **Rumble** como cobaia, em **cinco modos**. Os números estão na §5.6, e
o resultado é grave o bastante para mudar a ordem: **trocar uma página não
estoura — desliga em silêncio, e um gesto mente ao aparelho.**

A prova viveu em `/tmp` (`.../scratchpad/o-que-resta/`), que some. **É por isso
que os números dela estão copiados neste arquivo.**

---

## 2. A ORDEM DAS DEZ ABAS

### 2.0 A REGRA QUE MANDA EM TUDO

> # A ABA **CONTROLES** É O PILOTO, E ESTÁ SENDO FEITA AGORA.
> # A EXECUÇÃO DAS OUTRAS NOVE **ESPERA O OK DELA** SOBRE ELE.

Palavra dela, 29/08: *"Depois dou o ok pra seguirmos materializando a ordem pra
fazermos todas as abas funcionarem no novo motor."*

**As 109 sprints estão escritas. Nenhuma das outras nove ondas executa antes
desse ok.** Isto está repetido em cada um dos dez índices, e não é formalidade:
o piloto é quem descobre se a receita transfere. Se ele reprovar, nove ondas
mudam de forma antes de custar uma linha.

### 2.1 O que força a série, medido

Três arquivos são reivindicados por quase todas as ondas:

| arquivo | quantas das dez ondas o abrem |
|---|---|
| `src/hefesto_dualsense4unix/gui/main.glade` | **9** (todas menos Conexões) |
| `src/hefesto_dualsense4unix/app/app.py` | **9** (todas menos Conexões) |
| `src/hefesto_dualsense4unix/daemon/ipc_handlers.py` | 6 |

O `main.glade` é **XML único sem seções nomeadas**: conflito de merge nele é
irrecuperável na prática. Logo **os enxertos correm um de cada vez, em toda a
casa** — é bancada, não fila de preferência.

O `app.py` acompanha porque a página é indexada **por id de widget** em quatro
tabelas (`_REFRESH_POR_ABA:1141`, `_ALVO_POR_ABA:1236`,
`_PAGINAS_COM_TETO_ELASTICO:1366` e o `id_da_pagina`, com oito chamadores). Um
WebView sem `set_name` faz o GtkBuilder inventar um id **pela posição**, e a
página muda de identidade em silêncio.

**A descoberta que abre a fila:** a onda **Conexões não toca o `main.glade`**. A
página dela (`tab_config_box`) é construída em Python, e
`tab_config_box.get_parent()` alcança o `ScrolledWindow` sem uma linha de XML.
**As doze sprints dela saem inteiras da bancada** e correm em paralelo com
qualquer outra coisa.

### 2.2 O custo de cada enxerto, medido página a página

Esta é a superfície real que o enxerto substitutivo atravessa. **Medida no
`main.glade` de hoje, contra o `src/` de hoje** — não estimada:

| # | página do Glade | vira a aba | objetos | ids | ids que o Python toca | pontos de acesso | handlers | **linhas de handler** |
|---|---|---|---|---|---|---|---|---|
| 1 | `tab_home_box` | 01 Jogar | 2 | 2 | 1 | 1 | 0 | **0** |
| 2 | `tab_status_box` | 02 Controles | 23 | 18 | 10 | 22 | 0 | **0** |
| 3 | `tab_no_jogo_box` | *absorvida* pela 02 | 2 | 2 | 0 | 0 | 0 | **0** |
| 4 | `tab_triggers_box` | 03 Gatilhos | 34 | 16 | 0 | 0 | 4 | **8** |
| 5 | `tab_lightbar_box` | 04 Iluminação | 50 | 27 | 8 | 19 | 11 | **182** |
| 6 | `tab_rumble_box` | 05 Vibração | 29 | 17 | 6 | 13 | 9 | **183** |
| 7 | `profiles_paned` | 10 Perfis | 53 | 38 | 18 | 65 | 7 | **357** |
| 8 | `daemon_box` | 09 Sistema | 37 | 27 | 11 | 14 | 12 | **284** |
| 9 | `emulation_box` | 07 Lançadores (**a Emulação SAI**) | 50 | 36 | 14 | 17 | 11 | **138** |
| 10 | `tab_navegacao_dsx` | 06 Navegação | 58 | 21 | 9 | 15 | 7 | **184** |
| 11 | `tab_config_box` | 08 Conexões | 2 | 2 | 0 | 0 | 0 | **0** |
| | **TOTAL** | | **340** | **206** | **77** | **166** | **61** | **1.336** |

**Este total substitui um número que circula errado.** A linha do
`decisoes-dela.csv` fala em *"as 60.862 linhas que hoje chegam aos widgets por
`builder.get_object()`"*. Isso é o **tamanho de `app/`** (60.939 linhas hoje — a
árvore andou), não a quantidade de chamadas. As chamadas que buscam widget por
id são **215**, e as que atravessam o enxerto são **166**, com **1.336 linhas de
handler** atrás delas. O outro lado do custo são as **328** chamadas `Gtk.X()`
que constroem widget em `app/` — 67 delas em `actions/config/` (a Conexões) e 40
em `home_actions.py` (a Jogar), que são as páginas construídas em Python e por
isso quase vazias no XML.

### 2.3 A fila

**Faixa 0 — corre AGORA, e não espera nada**

| sprint | por que aqui |
|---|---|
| `MIGRA-CONTROLES-01/02/03` | **o piloto e a moldura**: o módulo de enxerto (`gui/webview_de_aba.py`), a casa das dez páginas (`gui/telas/`, `scripts/telas/`, `install.sh`, `pyproject.toml`) e as duas pontes (`gui/ponte_da_tela.py`). Nada mais existe sem elas | <!-- ref-externa: os dois nascem na onda do PILOTO, e a ausência deles é o assunto -->
| `MIGRA-GATILHOS-01` | **bancada, zero código, e pode DERRUBAR o desenho.** O produto já tirou o popup de escolha desta janela uma vez: `app/widgets/segmented_selector.py:1-6` diz que o cosmic-comp *"rouba o foco no clique e FECHA o popup do combo na hora"*. O desenho traz `<select>` de volta — **16 nesta aba, 117 nas dez**. Se o popup do WebKitGTK morrer igual, o gesto principal da aba não existe. Ela roda com o `ver.py`, que já está no disco |  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
| `MIGRA-JOGAR-02` | a aba 01 **não tem gerador** — `regerar.py:10` diz com todas as letras: *"A Jogar não tem gerador: ela é o esqueleto de referência, mantido à mão."* Escrever o `aba01.py` não toca a bancada e não depende do ok | <!-- ref-externa: o gerador da aba 01 é o que falta, e a falta é o assunto -->

> ## ⟶ A PORTA: **o ok dela sobre o piloto.** Nada abaixo começa antes.

**Faixa 1 — os nove enxertos, EM SÉRIE na bancada (`main.glade` + `app.py`)**

| ordem | onda | acesso + handler | por que nesta posição |
|---|---|---|---|
| **1** | **05 Vibração** | 13 + 183 | **o único enxerto com ensaio de controle já medido** (§5.6), em cinco modos. A receita existe escrita. E ele **carrega uma cura**: hoje o "Aplicar" desta aba manda `rumble.set[0,0]` ao daemon com o toast confirmando o silêncio |
| **2** | **01 Jogar** | 1 + 0 | **o enxerto mais barato da casa**, e é a porta que ela abre. O segundo olhar dela no motor novo cai na tela que a recebe |
| **3** | **03 Gatilhos** | 0 + 8 | a resposta do popup já está na mão desde a Faixa 0. Se ela derrubar o `<select>`, a cura pousa na aba com **menos handlers** para religar |
| **4** | **07 Lançadores** | 17 + 138 | a **Emulação sai** (não migra), e a 07 entra **escondida** — a aba só existe na tira quando ela der o selo |
| **5** | **06 Navegação** | 15 + 184 | a mais cara em tela (90 valores, 90 gestos, 16 sprints), mas o enxerto é mediano |
| **6** | **04 Iluminação** | 19 + 182 | os cinco `GtkCheckButton` do desenho das luzes são o **único armazenamento** dele: sem cura, `get_current_player_leds` passa a devolver `(False,)*5` em silêncio |
| **7** | **09 Sistema** | 14 + 284 | **o 14º handler mora na aba que morre**: `btn_camadas_engasgo` está no `daemon_box`, e `on_camadas_engasgo` está em `emulation_actions.py:2075`. Quem desmontar a Emulação (ordem 4) leva o motor junto — por isso a Sistema vem **depois** dela |
| **8** | **10 Perfis** | **65 + 357** | **o mais caro, por larga margem.** É `Gtk.Paned`, não `Box`; 38 ids; e `install_profiles_tab` tem **três** chamadores (`app.py:1499`, `app.py:1827` e `retratar_abas.py:1039`) |
| **—** | **08 Conexões** | 0 + 0 | **fora da fila**: não abre o `main.glade`. Corre em paralelo com qualquer posição acima, logo depois do ok |

**O critério, dito aberto:** o que pode **vetar o desenho** vai antes e custa
zero (Faixa 0); depois vai o que **já foi medido**; e daí em diante a escada
sobe do barato ao caro, para a receita endurecer antes de encontrar a página de
422 pontos. As posições 4 e 7 estão travadas uma na outra por um handler que
atravessa duas abas, e isso não é preferência — é a ordem que o código impõe.

**Faixa 2 — o resto de cada onda, EM PARALELO**

Depois que o enxerto de uma aba pousa, as demais sprints dela correm junto com
as de outras ondas. **Medido:** com o portão de colisão consertado (§7), sobram
**3** colisões MIGRA × MIGRA em 180 — e duas delas são enxerto contra enxerto,
já serializadas pela bancada. A terceira é `MIGRA-ILUMINACAO-11` ×
`MIGRA-JOGAR-10`, em `daemon/ipc_handlers.py`.

### 2.4 O que cada onda entrega, em uma linha

| aba | sprints | índice |
|---|---|---|
| 01 Jogar | 11 | `2026-08-29-MIGRA-JOGAR-INDICE.md` |
| 02 Controles (**piloto**) | 13 | `2026-08-29-MIGRA-CONTROLES-INDICE.md` |
| 03 Gatilhos | 11 | `2026-08-29-MIGRA-GATILHOS-INDICE.md` |
| 04 Iluminação | 12 | `2026-08-29-MIGRA-ILUMINACAO-INDICE.md` |
| 05 Vibração | 8 | `2026-08-29-MIGRA-VIBRACAO-INDICE.md` |
| 06 Navegação | 16 | `2026-08-29-MIGRA-NAVEGACAO-INDICE.md` |
| 07 Lançadores | 10 | `2026-08-29-MIGRA-LANCADORES-INDICE.md` |
| 08 Conexões | 12 | `2026-08-29-MIGRA-CONEXOES-INDICE.md` |
| 09 Sistema | 10 | `2026-08-29-MIGRA-SISTEMA-INDICE.md` |
| 10 Perfis | 6 | `2026-08-29-MIGRA-PERFIS-INDICE.md` |

---

## 3. A CONTA

### 3.1 O trabalho

| | |
|---|---|
| **sprints escritas** | **109**, em dez ondas, mais 10 índices |
| o censo previa | 96 — a escrita **cresceu 13,5%**, e cada acréscimo está justificado no índice da onda |
| **valores de tela** a alcançar | **364** |
| **já lidos pelo produto hoje** | **190 — 52,2%.** A migração **liga**; não reescreve leitor |
| **gestos** a devolver ao Python | **383** |

### 3.2 A justificativa da decisão, em números

| | rota reprovada (emissor GTK) | rota escolhida (WebKit) |
|---|---|---|
| ponte genérica | — | **31 linhas, uma vez** |
| por aba | **500 a 700 linhas** | **55 linhas** (contadas, não estimadas — o adaptador da aba Rumble, uma aba mediana: 4ª de 11 em linhas de handler, 7ª de 11 em pontos de acesso) |
| **dez abas** | **5.000 a 7.000 linhas** | **31 + 550 = 581 linhas** |

**Entre 9 e 12 vezes mais barata** — e essa é a metade menos importante da conta.
A outra metade é que as 5.000–7.000 linhas **não acompanham**: a prova de que
elas se descolam do desenho já foi feita, e o resultado foi uma foto
byte-idêntica depois de o desenho mudar.

### 3.3 A correção que a medição impôs a esta própria casa

Duas afirmações que circularam hoje, e o que a régua devolveu:

1. *"as duas pontes = 31 linhas, uma vez"* — **só 11 são uma vez.** O resto é
   adaptador por aba, e ele é **casado com o DOM por SELETOR DE CLASSE**
   (`.seg button`, `.motor .cheio`), com ordem **posicional**. **Todo `.seg` que
   o desenho mexer de lugar quebra o adaptador em silêncio**, e nenhum portão de
   hoje enxerga isso. É o custo escondido da rota escolhida, e está aqui para
   ninguém o descobrir de novo.
2. *"Rumble é a aba mais barata"* — é corrida de dois cavalos, e Gatilhos ganha
   em todos os eixos.

---

## 4. O QUE ESPERA A PALAVRA DELA

Consolidado das dez ondas, **sem duplicata**. O detalhe de cada uma está no §0
do índice da sua onda.

### 4.1 A que trava tudo

**O ok sobre o piloto (a aba Controles).** Trava as outras nove ondas inteiras —
**109 menos as 13 do piloto**.

### 4.2 As que travam sprint com nome

| pergunta | trava | por que não dá para decidir por ela |
|---|---|---|
| **A fita de alvo em UM lugar só** | as **dez** abas | com o enxerto a fita passa a existir **duas vezes**: o produto a desenha na `Gtk.HeaderBar` (`status_actions.py:1702`) e a página a desenha no HTML. É o mesmo defeito que ela pegou em um segundo quando a tira apareceu duplicada no `ver.py` |  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
| **Os 117 `<select>` sobrevivem na COSMIC?** | Gatilhos (16), Navegação (60), Conexões (16) | o produto já os tirou uma vez desta janela por defeito do compositor. `MIGRA-GATILHOS-01` mede |
| **Os 84 filtros mortos** | as cinco abas que os têm (36 na Iluminação, 12 na Vibração, 0 na Gatilhos) | a cura está pronta e **muda 1,09% do desenho que ela aprovou** (o contorno do touchpad, que **nunca apareceu em motor nenhum**) |
| **Troca ou rodízio** (Iluminação) | `MIGRA-ILUMINACAO-11` | a tela promete **troca** em 16 tooltips, o daemon faz **rodízio** (`ipc_handlers.py:1812-1814`), e o contrato diz uma **terceira** coisa. Muda o daemon, não a tela |
| **Qual régua manda no arranjo** | `MIGRA-CONEXOES-08` | `D-QUAL-REGUA-MANDA-NO-ARRANJO`; a medição já existe em `tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py` |
| **As duas pop-ups viram HTML ou ficam GTK?** | `MIGRA-CONEXOES-12` | doze sprints ou catorze. Ficando em GTK, o produto guarda uma inconsistência visível |
| **A régua do selo dos lançadores** | `MIGRA-LANCADORES-10` | **e o preço vai junto com a pergunta**: a primeira versão honesta mostra **NÃO SEI** onde o mockup que ela aprovou mostra verde em quatro cartões |
| **O botão "Deixar o jogo controlar a vibração"** | `MIGRA-VIBRACAO-08` | `grep` nos dez mockups devolve **0**; ele existe hoje (`rumble_actions.py:1092`) e o banner do cabeçalho manda clicar nele **pelo nome**, de qualquer aba. Sem ele a aba nasce com quatro botões que trancam quatro controles e um banner apontando para o nada |
| **O botão "Ligar o Hefesto" sumiu do desenho** | `MIGRA-SISTEMA-01` | com o Hefesto **desligado**, a tela nova não tem como ligá-lo. Ninguém decidiu isso — as outras quatro subtrações da aba têm decisão escrita, esta não |
| **A prioridade do perfil vira desenho** | `MIGRA-PERFIS-02` e `-05` | o mockup desenha `<span class="trilho">`; hoje é uma `Gtk.Scale` real. Ela pediu literalmente *"prioridade é slicer"* |

### 4.3 As que a tela abre e nenhuma sprint fecha sozinha

- **O estado "zero controles"**, que o desenho não tem — e é estado legítimo em
  todas as dez abas.
- **A cor do plástico nos cartões do rádio.** O mapa é portão e diz **não**
  (`mapa-controles.csv`, `identidade.cor_do_aparelho@dualsense`,
  `radio_aciona=não`, e desde 29/08/2026 a causa é `divida`, NÃO `o-aparelho-recusa`:
  em 27/08 mediu-se que a recusa era a semente do nosso CRC, e o aparelho
  responde por rádio). Metade da mesa dela é BT. Três
  saídas, com preços diferentes, na `MIGRA-JOGAR-01` e na `MIGRA-CONTROLES-12`.
- **O quinto degrau da escada de modos.** O código tem **quatro**
  (`ponte_escada.py:294`), o mockup desenha **cinco**. E o quarto degrau não é
  `KIND_STEAM_INPUT` — é `Ponte(KIND_GAMEPAD, MASCARA_DUALSENSE,
  steam_input=True)`. A forma exata da pergunta muda o preço da resposta.
- **A terceira máscara (Nintendo Pro)** está na tela e não existe no produto
  (`FLAVORS`, `uinput_gamepad.py:115`, tem **duas** entradas). O PID forjado
  **não pode** ser o `0x2009` do Pro físico (`core/linhagem_nintendo.py:89`).
- **A máscara por controle antes ou depois da bancada.**
  `external_mask.py:74-95` diz com todas as letras que **ninguém mediu** se um
  jogo aceita dois vpads com máscaras diferentes ao mesmo tempo.
- **O microfone nasce ligado?** A tela diz sim nos quatro; o produto faz o
  contrário **por privacidade e por banda**, com a razão escrita
  (`secao_controles.py:433-437`).
- **As três linhas do exame que o mockup apagou** (energia do rádio, suporte ao
  controle, pareamentos — esta última é a que avisa que o controle vai cair logo
  depois de conectar). **É a única contradição entre dois documentos que ela
  mesma aprovou:** o contrato diz *"cinco linhas — ficam"*, e a tela mostra
  outras cinco.
- **O conteúdo do painel "Detalhes técnicos"**: `systemctl status` (existe,
  barato) ou um método de log (é o que o mockup desenhou, e não há IPC).
- **As seis linhas do "No jogo"** — giroscópio, vibração, gatilho, luz, clique do
  touchpad, som — sumiram inteiras do desenho, e o contrato as mantém. **A aba
  não diz mais nada sobre o que atravessa para o jogo**, e o dado existe e é
  rico (`ipc_handlers.py:3004-3040`).
- **O aviso de bateria acabando.** As duas funções estão escritas, testadas e
  **sem chamador** (`integrations/desktop_notifications.py:272`).

---

## 5. O QUE JÁ ESTÁ MEDIDO — não remeça

O que a sessão de 29/08 pagou para descobrir sobre **o motor**, **o mockup** e as
**seis réguas falsas em quinze horas** está em
[`O-POSTO-DE-COMANDO`, §6](2026-08-29-O-POSTO-DE-COMANDO-o-que-esta-em-voo.md).
**Leia aquilo antes de escrever a primeira linha de código.** Aqui ficam as
cinco coisas que só existem neste arquivo.

### 5.1 As quatro armadilhas do WebKit que custam régua falsa

1. **Quatro pinos obrigatórios** — `Gtk 3.0`, `Gdk 3.0`, `GdkPixbuf 2.0`,
   `WebKit2 4.1`, e o `Gdk` **depois** do `Gtk`. Com o GTK4 ao lado, um
   `import Gdk` sem pino carrega o 4.0 e **mata o Gtk 3.0**.
2. **`FINISHED` dispara depois de `load-failed`** — o WebKit commita uma página
   de erro. Quem escuta só o `FINISHED` **reporta sucesso sobre carga que
   falhou**. Toda régua de carga tem de escutar os dois.
3. **`get_title()` no handler de `FINISHED` devolve vazio.** Nove de dez abas
   voltaram "sem título" para quem mediu assim.
4. **Os `<select>` saem como caixa BRANCA** — o WebKitGTK relata as cores do
   autor e desenha o tema do sistema. A cura é `select{appearance:none}` e já
   está no `ver.py:83-86`. **E o `<input type=range>` tem o mesmo problema.**  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->

### 5.2 O `novo-layout/` não viaja

É `.gitignore:108`. Logo: **não existe numa árvore de agente** (`git worktree
add` não copia arquivo ignorado), **não vai no pacote**, e **portão nenhum
enxerga a especificação aprovada por ela**. É o que a `MIGRA-CONTROLES-02`
conserta, mudando o HTML para `gui/telas/` e os geradores para `scripts/telas/`.
O `pyproject.toml:84-93` hoje leva só `gui/*.glade`, `gui/assets/*.png` e os
`.mo`.

### 5.3 Nove dos treze widgets congelados morrem com a migração, em silêncio

`FROZEN_WIDGET_IDS` (`footer_actions.py:115-131`) tem **13** ids. Deles, **9
pertencem a páginas que a migração apaga**: 2 da Iluminação, 2 dos Gatilhos, 2
da Vibração, 3 da Navegação. Só os 4 botões do rodapé sobrevivem.

E `_freeze_ui` diz na própria docstring (`:172`): *"Widgets ausentes no builder
são ignorados **silenciosamente**."* Logo o "Aplicar" vai deixando de congelar a
tela, aba por aba, **sem uma linha de erro**.

**A régua que deveria pegar isso está morta:**
`tests/unit/test_footer_actions.py:105` afirma
`widget_mock.set_sensitive.call_count == len(FROZEN_WIDGET_IDS)` com um builder
de mentira que devolve widget para **todo** id. **Ela compara a lista com ela
mesma** e fica verde por mais widgets que sumam. É o padrão desta casa: *a régua
digita o que devia LER.*

**Isto não tem dono em nenhuma das dez ondas.** É trabalho de quem coordena, e
tem de nascer **antes do segundo enxerto**.

### 5.4 O adaptador é casado por seletor, e nada vigia isso

Ver §3.3. A ordem dos botões dentro de `.seg` é **posicional**. É a dívida
estrutural da rota escolhida.

### 5.5 O que o Glade não deixa fazer

- `Gtk.ScrolledWindow.add(webview)` **não entrega o webview** — o WebKit2 4.1
  não é `Gtk.Scrollable`. Sete das onze páginas estão dentro de um
  `ScrolledWindow`.
- `tab_config_box` é `GtkBox` dentro de `GtkScrolledWindow` com
  `propagate-natural-height/width=True` (`main.glade:4171-4185`). **WebView não
  tem altura natural** → ou nasce com 0 px, ou aparecem duas barras de rolagem.
- **Ninguém mediu se um WebView pinta dentro de `Gtk.OffscreenWindow`.** Sem
  isso, a `PROVA-DE-TELA-01` — *interface só fecha com o olho dela* — **não
  existe** para as dez abas novas, e o `retratar_abas.py` falha **macio** (dois
  `except Exception` que devolvem "aba não montada").

### 5.6 O ENXERTO SUBSTITUTIVO, medido — a página Rumble, cinco modos

**Este é o achado mais caro do dia, e vivia só em `/tmp`.**

| modo | o que foi feito | resultado |
|---|---|---|
| `intacto` | nada removido | 11 páginas, 376 objetos, 56,7 ms, 0 ausentes, 0 Nones |
| **`real`** | **os 20 ids da página apagados do XML e a página trocada pelo WebView** | 343 objetos, 53,6 ms · **11 páginas na ordem certa** · a 6ª é `WebView` · **as outras dez de pé** · **15 ids ausentes** · **0 exceções** · **64 `None`** · **o "Aplicar" mandou `(0, 0)` ao daemon** |
| `orfao` | widgets vivos, mas sem pai | 0 ausentes — o defeito **não** aparece |
| `mordida-cru` | enxerto sem trocar a página | reprova: *"a página 6 não é o webview"* |
| `mordida-vazio` | página removida sem enxertar | reprova: 10 páginas, rótulos fora de ordem |

**A frase que resume:** *tirar a página não quebra — desliga em silêncio, e um
gesto mente ao aparelho.* Zero exceções, e o toast confirmando um silêncio.

**A ponte foi provada de ponta a ponta**, e com mordida:

| | íntegra | com a mordida (o casamento JS não injetado) |
|---|---|---|
| pintura | os quatro botões acendem em "Máximo" (o disco diz `max`) | acendem os quatro nomes diferentes — **não pintou** |
| clique na tela → Python | chegou (`politica: economia`) | **não chegou** |
| IPC emitido | `rumble.policy_set("economia")` | **nenhum** |
| rascunho | gravou `economia` | ficou em `max` |
| toast | *"Intensidade da vibração: Economia"* | nenhum |
| tempo | 1.533 ms | — |

**A mordida derruba as quatro coisas de uma vez.** É a régua que esta casa exige,
e ela já está escrita.

**Um controle negativo pronto, de graça:** tirar a página do Glade **sem** tirar
`install_triggers_tab` **não abre a janela** — `_rebuild_params` faz
`box.get_children()` sem guarda (`triggers_actions.py:508-513`) e `app.py:1496`
o chama sem `try`, antes do `show_all()`. `AttributeError: 'NoneType' object has
no attribute 'get_children'`.

---

## 6. O QUE FICA FORA DESTA MIGRAÇÃO

O redesenho é do `Gtk.Notebook`. **Três superfícies do produto não estão nele, e
a migração não as alcança:**

| superfície | tamanho | estado |
|---|---|---|
| **o applet do COSMIC** | 1.877 linhas de Rust, `packaging/cosmic-applet/` | **medido em 29/08: não está mais no painel dela.** Uma pergunta de uma linha decide se vira 1.0 ou some |
| **a bandeja** | 574 linhas, `app/tray.py` | não aparece na máquina dela **por configuração do painel**, não por defeito nosso. Espera uma decisão de uma palavra |
| **a janela compacta** | 338 linhas, `app/compact_window.py` | o código está certo; **a documentação mente** (`docs/usage/troubleshooting.md:122-128` e `:136` ensinam três coisas erradas a ela) |

**O tratamento completo das três, com o que fazer em cada uma, está em
[`O-CAMINHO-ATE-A-CONCLUSAO`, §6](2026-08-29-O-CAMINHO-ATE-A-CONCLUSAO.md).** Não
se repete aqui.

**O que é desta migração, e só aparece aqui:** a WebView acrescenta um **quinto
autor de texto** ao produto — o HTML do mockup. O portão que trava o vocabulário
compartilhado (`tests/unit/test_vocabulario_das_quatro_superficies.py`) lê o
`main.glade`, o `app.rs` do applet e o Python — **e não lê HTML**. Enquanto isso
não for curado, uma palavra pode divergir entre a tela nova e o applet **sem que
régua nenhuma acuse**. É dívida que a migração cria, e ela nasce no primeiro
enxerto.

---

## 7. NOTAS DE COORDENAÇÃO

### 7.1 O portão de colisão estava morto, e foi consertado agora

`docs/process/sprints/2026-08-29-MIGRA-SISTEMA-05-*.md` tinha o frontmatter
embaralhado — um comentário engoliu um `nao_toca:`, que virou escalar e depois
recebeu itens de lista. O `check_colisao_de_sprints.py:177` **estourava**
(`AttributeError: 'str' object has no attribute 'append'`) **antes de conferir
uma colisão sequer**, e levava junto a leitura da pasta inteira.

**Cinco das dez ondas relataram isso e nenhuma tocou o arquivo** — cada uma o
tratou como território de irmã em voo. Consertado nesta leva (só o frontmatter;
o corpo da sprint não foi tocado).

**Consequência que precisa ser dita:** todo *"portão verde"* relatado hoje sobre
colisão de sprints foi relatado por uma régua **que não rodava**. Com ela de pé:

```
FALHA: 180 colisão(ões) de posse não declarada(s)
  MIGRA-ILUMINACAO: 130   MIGRA-JOGAR: 48   MIGRA-SISTEMA: 5
  MIGRA × MIGRA: 3    MIGRA × onda anterior: 177
  arquivos: lightbar_actions.py 90 · main.glade 41 · app.py 23 · ipc_handlers.py 19
```

**As 177 são dívida, não defeito** — o portão as chama assim, e são pagas uma a
uma no despacho de cada sprint. As 130 da Iluminação são quase todas o mesmo par
(`lightbar_actions.py` contra `LEVA-1` e `ONDA-ILUMINACAO-01`) e fecham com uma
linha de `depois_de` em cada sprint da onda.

### 7.2 Dois ids que 22 e 20 arquivos citam, e não existem

| id citado | onde ele realmente está | quantos arquivos o citam |
|---|---|---|
| `MIGRA-MOLDURA-01` | é `MIGRA-CONTROLES-02` (a casa das páginas) **+** `MIGRA-CONTROLES-03` (as duas pontes) | **22** |
| `MIGRA-CONTROLES-PILOTO` | é a **onda inteira** `MIGRA-CONTROLES` | **20** |

As dez ondas foram escritas **na mesma hora, sem saber os ids umas das outras**.
**Este documento fixa a equivalência acima como canônica.** Quem coordena decide
se troca os ponteiros nos 42 arquivos ou se ensina o portão a resolver o apelido
— mas a equivalência não se rediscute.

### 7.3 Convenções que as dez ondas já convergiram

| coisa | endereço |
|---|---|
| as dez páginas | `src/hefesto_dualsense4unix/gui/telas/NN-*.html` |
| os dez geradores | `scripts/telas/abaNN.py` | <!-- ref-externa: endereços que a MIGRA-CONTROLES-02 cria -->
| o módulo de enxerto | `src/hefesto_dualsense4unix/gui/webview_de_aba.py` | <!-- ref-externa: módulo que a MIGRA-CONTROLES-01 cria -->
| as duas pontes | `src/hefesto_dualsense4unix/gui/ponte_da_tela.py` | <!-- ref-externa: módulo que a MIGRA-CONTROLES-03 cria -->

Todo número de linha citado nas sprints é do arquivo **de hoje**, com o endereço
**de hoje** (`novo-src/hefesto_dualsense4unix/interface/abaNN.py`). Cada sprint manda reconferir <!-- ref-externa: o padrão abaNN.py cobre aba02..aba10, e a 01 é a exceção -->
no dia de execução, e as que abrem gerador declaram **os dois** endereços na
posse.

### 7.4 Existe uma SEGUNDA ordem escrita hoje, e ela diverge desta

`docs/process/sprints/2026-08-29-MIGRA-A-ORDEM-das-dez-abas.md` foi escrito em
paralelo por outra leva, sem que uma soubesse da outra. **Não é redundância
inútil: é a segunda régua que esta casa exige, e ela corrobora.**

**Onde as duas batem** — e por serem medições independentes, isto vale mais do
que qualquer uma sozinha:

- as **180** colisões, as **3** MIGRA × MIGRA, e os mesmos quatro arquivos com
  90 / 41 / 23 / 19 pares;
- as **109** sprints;
- as três primeiras posições: **Controles (piloto) → Vibração → Jogar**, pelos
  mesmos motivos medidos.

**Onde divergem, e o desempate:**

1. **A partir da 4ª posição, aquele documento ordena por NÚMERO DE SPRINTS e
   este ordena por SUPERFÍCIE DO ENXERTO** (a tabela da §2.2). Nos Perfis as
   duas dão respostas opostas: por sprints é *"a menor de todas"* (6) e vai para
   a 3ª posição; por superfície é **a mais cara da casa** — 65 pontos de acesso e
   357 linhas de handler, o dobro da segunda colocada. **O desempate é o que se
   está comprando:** a fila é serializada pela **bancada do `main.glade`**, e o
   que ocupa a bancada é o enxerto, não a contagem de sprints. Uma onda de 6
   sprints cujo enxerto é o mais caro segura a bancada mais tempo que uma de 16
   cujo enxerto é mediano.
2. **Aquele documento dá à Conexões a 8ª posição da fila. Ela não tem posição:**
   é a única das dez que **não abre o `main.glade`** (§2.1), logo não disputa a
   bancada e corre em paralelo com qualquer uma.
3. **Aquele documento repete que *"o enxerto substitutivo ainda não foi
   medido"*.** Foi — §5.6 deste arquivo, com os números. É o mesmo fato vencido
   que está no `decisoes-dela.csv:119`, e sai dos dois lugares pela regra desta
   casa: *fato errado se substitui, e sai de TODOS os lugares onde aparece.*

**Isto é de quem coordena fechar**, e é fechar de verdade: dois documentos vivos
com ordens diferentes é o defeito que a regra existe para matar. O que aquele
documento tem e este não — as três provas de fechamento de uma aba (§4 dele) —
vale e não se rediscute.

---

## 8. O COMANDO QUE NÃO ENVELHECE

Nenhum documento diz o que fechou **hoje**. Só o git diz:

```bash
git log --since=midnight --format='%h %s'      # o que esta casa fechou hoje
ls docs/process/sprints/2026-08-29-MIGRA-*.md | grep -v INDICE | wc -l   # a fila
.venv/bin/python scripts/check_colisao_de_sprints.py                     # quem colide
```
