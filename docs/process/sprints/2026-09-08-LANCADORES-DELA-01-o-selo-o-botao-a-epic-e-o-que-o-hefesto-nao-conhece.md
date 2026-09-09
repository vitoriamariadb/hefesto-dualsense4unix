---
sprint: LANCADORES-DELA-01
estado: feita
posse:
  LANCADORES-DELA-01:
    - src/hefesto_dualsense4unix/utils/maquina.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
---

# LANCADORES-DELA-01 — o selo, o botão, a Epic, e o que o Hefesto não conhece

**Quatro pedidos dela, em 08/09/2026, olhando a aba Lançadores com os quatro
DualSense na mesa.** Verbatim:

> *"ao invés de não achei. Deveria ter Não Localizado e o Botão Abrir o Lançador
> deveria ser o Adicionar Launcher. Seria interessante termos o da Epic Games
> Aqui também não?"*

> *"Pensei em outro botão pra Adicionar novo Emulador Ou novo lançador algo
> assim, pra devs mais experimentais e permitir que o user adicione algo novo"*

> **FEITA em 08/09/2026 — `7b1cdf27` + `d1f17040` + `1bebb847`, em `dev`; o quarto item
> DECIDIDO por ela à noite.** A leva tinha lido uma PERGUNTA dela como decisão; ela
> cobrou — *"como assim caducou por decisão minha?"* — e depois decidiu com uma
> palavra: *"dentro heróic"*. <!-- noqa-acento: citação literal dela -->
>
> | # | o que ficou |
> | --- | --- |
> | 1 | o selo diz **NÃO LOCALIZADO** (`desenho_dos_lancadores.py:64`, `SELOS["off"]`) |
> | 2 | o botão do cartão diz **Localizar este Lançador** — selo e botão falam a mesma palavra; *«Launcher»* saiu da tela, o projeto é em português e há portão |
> | 3 | **DECIDIDO — a Epic fica DENTRO do Heroic** (*"dentro heróic"*, 08/09 à noite). Não há cartão próprio; o Heroic diz `(Epic · GOG)` e, pela LANCADORES-ZERO-01, passa a LER a biblioteca da Epic (35 jogos na máquina dela em 08/09). A frase da tarde (*"melhor deixar so heróic e tirar epic games não?"* <!-- noqa-acento: citação literal dela -->) era pergunta; a decisão é esta |
> | 4 | o botão global diz **Adicionar novo Lançador**; o registro é o `LancadorDeclarado` do `maquina.json` (`utils/maquina.py:581`), com os mesmos três campos do `SemCenso` — um procurador só, como a §3 mandava |
>
> Os três resíduos do conferente (o «Tirar daqui» sem régua, o beco da recusa aberto no
> estado da máquina dela, o campo digitado que o produto descartava calado) fecharam em
> `1bebb847` — está em `docs/process/2026-09-08-ONDE-PARAMOS-as-duas-levas-da-tela-e-os-cem-vermelhos.md` §2.
>
> **O que ela viu DEPOIS disto** — *"a aba lançadores tá identificando nada"* — é a
> [LANCADORES-ZERO-01](2026-09-08-LANCADORES-ZERO-01-a-aba-que-nao-identifica-nada-na-tela-dela.md).

Esta sprint é o registro do pedido e do desenho decidido — o que ela pediu não
pode viver só na conversa. *Regra da casa: fila combinada com ela vira arquivo
no mesmo dia.*

## §1 — Os quatro, com endereço

| # | o quê | onde |
| --- | --- | --- |
| 1 | `NÃO ACHEI` vira `NÃO LOCALIZADO` | `desenho_dos_lancadores.py:50`, `SELOS["off"]` |
| 2 | o botão do cartão não-localizado vira **Adicionar Launcher** | `desenho_dos_lancadores.py:1085` |
| 3 | cartão da **Epic Games** | `desenho_dos_lancadores.py:522-531`, a tupla `SEM_FONTE` |
| 4 | botão global: registrar lançador/emulador que o Hefesto não conhece | novo |

**No 1, a armadilha:** a string `NÃO ACHEI` aparece em dezenas de comentários e
docstrings que NARRAM a história da aba. Trocar tudo cegamente reescreve o
registro do passado. Troca-se o VALOR; onde o texto conta o que aconteceu num
dia, ele fica. E as réguas passam a LER `SELOS["off"]` em vez de digitar a
string — *as onze réguas de 26/08 reprovaram a melhora porque digitavam o que
deviam ler.*

**No 2, o sentido:** o cartão já diz *"Instalado de outro jeito (um AppImage
solto, por exemplo) ele não aparece aqui"*. Então "Adicionar Launcher" quer dizer
**"ele está aqui, eu te mostro onde"** — não "instale para mim". E o cartão que
ACHOU continua com "Abrir o lançador": dois estados, dois botões.

## §2 — A Epic, e um fato do Linux que não se contorna

**Não existe Epic Games Launcher nativo no Linux.** Quem fala com a Epic aqui é o
`legendary` (CLI), o **Rare** (GUI do legendary, flatpak
`io.github.dummerle.rare`) e o próprio **Heroic**, que já tem cartão e já diz
"Epic · GOG" no rótulo.

O cartão da Epic existe apontando para os clientes que realmente entregam o jogo.
**O que ele NÃO faz é escrever na tela que "a Epic não tem cliente no Linux"** —
seria confissão, e além disso é falso.

**BANCADA MONTADA NESTA MÁQUINA em 08/09**, a pedido dela (*"Instala nessa
máquina fora do install nosso, os apps, cada um dos que temos aqui e o da epic
games também. Que aí já validamos eu e vc isso à parte"*): os seis instalados por
`flatpak --user`, ~1,3 GB, `rc=0` nos seis — `io.mgba.mGBA`,
`org.DolphinEmu.dolphin-emu`, `io.github.dummerle.rare`, `net.lutris.Lutris`,
`com.heroicgameslauncher.hgl`, `org.libretro.RetroArch`.

**E a detecção foi medida logo depois, com o produto instalado:** os SEIS
acenderam. Os cinco pelo `.desktop` em
`~/.local/share/flatpak/exports/share/applications`, que já está em
`jogos_locais.pastas_de_atalhos()`. O Rare é o único sem cartão — porque a Epic
ainda não está na lista, que é a mudança 3.

## §3 — O desenho do botão global, decidido

Decidido em 08/09 para a frente não re-litigar:

* **Onde mora:** um `LancadorDeclarado` no `maquina.json`, ao lado do
  `ControleDeclarado` (`utils/maquina.py:525`) e do `RadioDeclarado` (`:199`).
  Campos: `rotulo`, `atalhos`, `comandos` — **os mesmos três que o `SemCenso` já
  usa**, para o declarado e o embutido passarem pelo MESMO procurador. Um segundo
  caminho de busca seria a assimetria que esta casa passou o dia arrancando.
* **A busca não muda:** `PROCURADOS` passa a ser os embutidos MAIS os declarados.
* **A porta é uma só:** o "Adicionar Launcher" do cartão e o botão global usam o
  MESMO gesto. O do cartão nasce com a chave preenchida; o global nasce vazio.
* **Recusa o que não existe:** se o que ela deu não está no disco, o recado diz e
  **não grava** — gravar um lançador ausente é fabricar um cartão que mente.
* **Remover também:** o que se acrescenta se tira, senão a lista vira lixo
  permanente.

## §4 — O que esta sprint NÃO fecha

Registrar à mão é a saída de emergência, não a cura. **A cura é a
[LANCADOR-ACHADO-01](2026-09-08-LANCADOR-ACHADO-01-o-produto-so-acha-o-que-a-lista-adivinhou.md)**
— procurar pelo que a coisa É (`Categories=Game`, `MimeType` de ROM) em vez do
nome que alguém adivinhou. Enquanto ela não vier, todo lançador fora dos seis
depende de ela registrar.
