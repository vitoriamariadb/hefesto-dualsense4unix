---
sprint: LANCADOR-LOCALIZAR-01
estado: feita
posse:
  LANCADOR-LOCALIZAR-01:
    - src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py
    - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
    - src/hefesto_dualsense4unix/interface/aba07.py
    - src/hefesto_dualsense4unix/integrations/cura_por_estrada.py
    - tests/unit/test_a_aba_lancadores_diz_a_verdade.py
    - tests/unit/test_a_cura_por_estrada_e_a_caixa_do_flatpak.py
    - tests/unit/test_todo_gesto_que_grava_esta_protegido.py
    - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
    - mockup/07-lancadores.html
bancada: false
depois_de: []
---

> **ELA COBROU DE NOVO EM 11/09/2026, e a cobrança acrescenta METADE:**
> *"essa página continua com os botões de consertar ( não aparece verde os*  <!-- noqa-acento: citação literal dela -->
> *localizados"*  <!-- noqa-acento: citação literal dela -->
>
> São duas coisas, e a segunda é nova nesta sprint: **o botão sai** (o que já
> estava escrito aqui) **e o cartão localizado fica VERDE** — hoje ele não se
> distingue do que ainda não foi localizado, e é por isso que ela continua
> vendo «Consertar» como se nada tivesse acontecido. O verde é o mesmo sinal
> que a casa já usa para «isto está de pé»; a piscada verde de deu-certo tem
> outro dono (`hef-deu-certo`) e **não é este** — aqui o verde é ESTADO, não
> resposta a gesto.
>
> A segunda metade da frase dela — *"e os jogos deles tem que ter o perfil por*  <!-- noqa-acento: citação literal dela -->
> *jogo tambem"* — **é da `JOGOS-DOS-LANCADORES-01`**, e não desta.  <!-- noqa-acento: citação literal dela -->

> *"na real não faz sentido. Digo se tenho tudo instalado e tá pra ser*  <!-- noqa-acento: citação literal dela -->
> *identificado não tem pq ter o botão de consertar. Ou no Máximo Localizar o*  <!-- noqa-acento: citação literal dela -->
> *lançador. aí eu mesmo abro a tela e procuro o .desktop."*  <!-- noqa-acento: citação literal dela -->


> **DECIDIDO POR ELA, 09/09/2026: a opção (C) — «Campo + botão que abre o
> seletor».** Ela aponta o `.desktop` com o mouse pelo seletor do sistema (a
> estrada já existe: `ponte.escolher_arquivo` → `hefesto_vivo._escolher_arquivo`,
> com precedente vivo no `Importar` do rodapé), **e o campo de texto FICA** —
> ele é o único caminho para um AppImage solto, que não tem `.desktop`, e o
> próprio cartão promete cobrir esse caso.
>
> Os quatro preços medidos na §3 valem e entram na sprint: o seletor só resolve
> nas quatro pastas XDG; a pasta de partida precisa ser posta (duas delas ficam
> dentro de `~/.local`); com `--oculta` não há diálogo, logo o gesto entra em
> `PERIGOSOS` e é mordido por dublê; e é a metade que muda a PÁGINA, logo pede
> o `--publicar 07`, que é ato dela.

# LANCADOR-LOCALIZAR-01 — o «Consertar» sai do cartão que já foi localizado

> **ESTADO 2026-09-11: feita** — a metade nova (o cartão localizado fica VERDE)
> fechou, e a causa era de 09/09: `SELOS` ganhou a chave `localizado` e **a
> folha nunca soube da classe**. Medido na página viva antes da cura, com a
> grade pintada como o pacote a pinta: o selo da Steam saía
> `background: rgb(80,250,123)` e os CINCO `LOCALIZADO` saíam
> `rgba(0,0,0,0)` — **verde nenhum, não verde fraco**. A regra nasceu dividindo
> o estilo com `ok`, que é o que `MOLDURA` já declarava, e duas réguas novas
> cobram a folha contra `SELOS` e contra `MOLDURA`. **E a aba foi PUBLICADA**
> (`--publicar 07`): sem isso a cor ficaria só na bancada, que foi exatamente o
> que fez a queixa voltar. Entrega:
> `docs/process/agentes/2026-09-11/LANCADOR-LOCALIZAR-01-opus.md`.
>
> **O QUE AINDA NÃO ESTÁ NA TELA DELA, e não é código:** o «Consertar» sai por
> código de produto, e esse código está em `voo/LANCADOR-LOCALIZAR-01-opus`,
> **fora de `onda/0911` e fora de `dev`** — a árvore de 10/09 nasceu de `dev` e
> nunca foi costurada (`git cherry onda/0911 HEAD` → `+`). Enquanto a costura
> não acontecer, ela continua vendo os botões.

> **ESTADO 2026-09-10: feita** — o «Consertar» saiu do cartão LOCALIZADO (o
> botão, o gesto `consertar-lancador` e o `PROVISÓRIO` de dois cliques); o
> «Localizar este Lançador» passou a valer nos SEIS cartões achados, inclusive
> o da Steam; a recusa do botão global parou de confessar *"hoje o cartão não
> tem por onde trocar"*; a caixa de registro ganhou o
> «Escolher o arquivo…» (a opção **C** dela) com gesto, recusa própria e dublê;
> e `cura_por_estrada` ficou com as 26 provas e a dívida declarada em
> `_SEM_CAMINHO_HOJE`, apontando para a LANCADOR-CARONA-01. A metade que muda a
> PÁGINA está na bancada e declarada em `mockup/DIVERGENCIAS.md` — o
> `--publicar 07` é ato dela. Entrega:
> `docs/process/agentes/2026-09-10/LANCADOR-LOCALIZAR-01-opus.md`.

Ela respondeu à pergunta que o próprio código pendurou em 09/09 — o bloco
`PROVISÓRIO` de `a07_lancadores.py:911`, aberto com a palavra dela de horas
antes: *"Preciso vêr como fica e se faz sentido um botão pra isso"*.  <!-- noqa-acento: citação literal dela -->
**A palavra chegou, e ela é a segunda das duas saídas que aquele bloco já
tinha escritas: o botão sai.**

---

## §1 — O que ela viu, e o que está MEDIDO

**A foto é de hoje**, 09/09/2026 às 22h26, janela oculta, aba 07 viva com os
quatro DualSense na mesa
(`scratchpad/CONSERTAR-aba07-hoje.png`). O que a tela mostra:

| cartão | selo | a linha de baixo | os botões |
| --- | --- | --- | --- |
| Steam | **NÃO CHEGAM** | 23 jogos instalados | **Consertar** · Ver o que impede · Abrir o lançador · Este jogo não funciona |
| Heroic (Epic · GOG) | **LOCALIZADO** | 37 jogos na biblioteca · 0 instalados | **Consertar** · Abrir o lançador |
| Lutris | **LOCALIZADO** | Abra Lutris uma vez e o Hefesto lê a biblioteca. | **Consertar** · Abrir o lançador |
| Flatpak | **LOCALIZADO** | 5 lançadores por aqui, e o controle entra em todos | Abrir o lançador |
| RetroArch | **LOCALIZADO** | Abra RetroArch uma vez e o Hefesto lê a biblioteca. | **Consertar** · Abrir o lançador |
| Dolphin · mGBA | **LOCALIZADO** | Abra Dolphin uma vez e o Hefesto lê a biblioteca. | **Consertar** · Abrir o lançador |

**SÃO QUATRO CARTÕES, E NÃO CINCO.** O enunciado que abriu esta sprint dizia
*"os cinco lançadores"*; medido na máquina dela, o «Consertar» por estrada
aparece em **quatro** — o «Flatpak» não ganha o botão porque ele não tem
estrada nenhuma (`cura_por_estrada.estradas_do_cartao("flatpak", …)` devolve
`()`: ele é achado pelo `PATH`, em `/usr/bin/flatpak`, e não tem caixa a
receber ambiente). E o «Consertar» da Steam é **outro gesto e outro ato** —
`consertar` repõe o atalho de inicialização no `localconfig.vdf`; o dos quatro
é `consertar-lancador`, que escreve o **ambiente** na configuração do lançador.

**O QUE ELA NÃO VÊ EM CARTÃO NENHUM: o «Localizar este Lançador».** Ele existe
desde 08/09 (`desenho_dos_lancadores.ADICIONAR_ROTULO`), com gesto próprio
(`adicionar-lancador`), tela de registro, recusa escrita e régua — e **aparece
só no estado `off`**, o `NÃO LOCALIZADO`. Os seis cartões dela estão
localizados, então o botão que ela pede *"no Máximo"* está no produto e não  <!-- noqa-acento: citação literal dela -->
alcança nenhum dos cartões dela.

**O que a cura escreveria, se ela clicasse duas vezes em cada um dos quatro** —
medido hoje, leitura pura:

```
heroic       →  ~/.var/app/com.heroicgameslauncher.hgl/config/heroic/config.json
lutris       →  ~/.local/share/flatpak/overrides/net.lutris.Lutris
retroarch    →  ~/.local/share/flatpak/overrides/org.libretro.RetroArch
emuladores   →  ~/.local/share/flatpak/overrides/org.DolphinEmu.dolphin-emu
             →  ~/.local/share/flatpak/overrides/io.mgba.mGBA
```

Cinco arquivos de OUTROS programas, em quatro cartões, com as cinco variáveis
que `cura_por_estrada.ambiente_da_ponte()` lê do `default.env` do daemon —
`PROTON_DISABLE_HIDRAW`, `SDL_GAMECONTROLLER_IGNORE_DEVICES`,
`SDL_GAMECONTROLLER_USE_BUTTON_LABELS`, `__GL_SHADER_DISK_CACHE` e
`__GL_SHADER_DISK_CACHE_SKIP_CLEANUP`.

### E UM DELES JÁ FOI ESCRITO — hoje, 09/09/2026 às 22h12

O `config.json` do Heroic **dela** está com as cinco variáveis dentro de
`defaultSettings.enviromentOptions`, gravadas às `22:12:04` (permissão `0644`
preservada, que é a assinatura de `cura_por_estrada._escrever_atomico`). O
relato da sprint que criou o botão declara que a validação rodou num lar de
mentira e que *"o disco dela não mudou"* — e isso valia quando foi escrito. **A
escrita de 22h12 é posterior a ele.** O botão que ela manda tirar já agiu uma
vez na máquina dela, e §3.5 diz o que fazer com o que ficou lá.

---

## §2 — A causa, com o número

### 2.1 O botão nasceu pendurado no estado POSITIVO

`desenho_dos_lancadores.cartao_sem_censo` desenha três estados, e o «Consertar»
foi posto no terceiro:

| `onde` | selo | moldura | a frase do corpo | ganha «Consertar»? |
| --- | --- | --- | --- | --- |
| `None` | `nao_sei` — NÃO SEI | `ausente` | — | não |
| `""` | `off` — NÃO LOCALIZADO | `ausente` | *"Não localizei este lançador nesta máquina."* | não |
| um caminho | `localizado` — **LOCALIZADO** | **`chega`** | *"**Achei este lançador aqui** (…). O perfil casa pelo nome do processo e pela janela, então **um jogo aberto por aqui entra pelo mesmo caminho de qualquer outro**."* | **SIM** |

A moldura `chega` é **a mesma** do selo `ok`/CHEGAM da Steam — `MOLDURA` dá o
mesmo tom aos dois, e o próprio comentário diz por quê: *"as duas dizem 'este
está aqui e não há impedimento a agir'"*.

**Então a leitura dela é a leitura CERTA do cartão como ele está pintado.** O
selo diz que está tudo bem; a moldura diz que está tudo bem; a última oração da
frase diz, com todas as letras, que **o jogo daquele lançador entra pelo mesmo
caminho de qualquer outro**. E embaixo disso o produto oferece *consertar*. A
palavra dela — *"se tenho tudo instalado e tá pra ser identificado não tem pq  <!-- noqa-acento: citação literal dela -->
ter o botão de consertar"* — é a descrição exata do que a tela mostra.  <!-- noqa-acento: citação literal dela -->

**O contraste que prova:** no cartão da Steam o mesmo verbo tem antecedente. O
selo é `NÃO CHEGAM`, a moldura é `impede`, e a frase logo acima do botão nomeia
o defeito e o jogo — *"1 jogo perdeu as Opções de Inicialização do Hefesto na
Steam: PRAGMATA (appid 3357650) … Posso repor agora"*. Ali o «Consertar»
responde a uma frase. Nos quatro, ele não responde a nada: **nenhuma palavra do
cartão diz que alguma coisa está quebrada.**

*Uma cura oferecida onde a tela não declarou defeito nenhum lê-se como cura de
coisa nenhuma.*

### 2.2 A causa mais funda: o desenho dela de 16/08 já dizia isto

E ela não está estreando a regra hoje. `app/actions/carona_do_wrapper.py:7`
guarda a palavra dela sobre o **mesmo ato** — repor o que faz o controle chegar
ao jogo:

> *"nem precisa ter um botão na gui, mas ele se auto corrigir ao clicarmos em
> aplicar ou salvar o perfil seja dentro ou fora da guia de perfis."*

E a razão que o arquivo escreveu ao aceitá-la: *"um botão novo é mais uma coisa
para lembrar de apertar, e quem não souber que precisa apertar continua
quebrado. A correção passa a ser EFEITO COLATERAL do gesto que já existe."*

**A cura por estrada nasceu como botão justamente onde o desenho dela já era
sem botão.** Para a Steam a casa honrou a carona — `interface/pacotes/perfil.py`
`com_a_carona()`, chamada pelo «Aplicar» e pelo «Salvar» do rodapé e pelos
gestos de perfil da aba 10. Para os outros lançadores, não: a cura ganhou um
botão em quatro cartões.

**Isto explica o que já funcionava**, que é a régua desta casa para hipótese: a
carona da Steam funciona há semanas, sem botão, e ninguém reclamou dela. O que
ela recusa não é a cura — é o vaso.

### 2.3 O que a régua NÃO via, e é o instrumento falso deste dia

`test_a_aba_lancadores_diz_a_verdade.py` cobre o gesto, e as 26 provas de
`test_a_cura_por_estrada_e_a_caixa_do_flatpak.py` cobrem a escrita. **Nenhuma
das duas pergunta se o cartão que oferece a cura declarou o defeito.** As
réguas medem que o botão funciona; a pergunta dela é se ele deveria existir
naquele estado — e essa é uma pergunta sobre o PAR selo↔botão, que régua
nenhuma desta aba faz hoje. §4 a transforma em régua.

---

## §3 — A cura, e as opções se houver decisão dela a tomar

### 3.1 O botão sai — e ele custa UMA linha, com zero byte de página

Em `cartao_sem_censo`, o ramo `consertar = ((Acao(CONSERTAR_LANCADOR_ROTULO, …)`
sai do `return` do estado `localizado`. É a segunda das duas saídas que o
próprio bloco `PROVISÓRIO` já deixava escritas.

**MEDIDO: a página publicada e o mockup não mudam um byte.**

```
grep -c 'data-gesto="consertar-lancador"'  src/…/interface/paginas/07-lancadores.html  →  0
grep -c 'data-gesto="consertar-lancador"'  mockup/07-lancadores.html                   →  0
diff mockup/07-lancadores.html  src/…/interface/paginas/07-lancadores.html             →  idênticos (1579 linhas)
```

A razão é estrutural e vale para toda esta sprint: a página estática é
`cartoes(None)` — a **primeira meia volta**, em que os seis cartões saem
`nao_sei` e só têm «Abrir o lançador». O «Consertar» **só existe na pintura
viva**, na troca da grade. Tirá-lo é mudança de PRODUTO, não de desenho.

### 3.2 O «Localizar este Lançador» passa a valer no cartão LOCALIZADO

É o *"no Máximo"* dela, e **não é botão novo**: é `acao_de_localizar(chave)`,  <!-- noqa-acento: citação literal dela -->
que já existe, já é uma função (e não uma linha copiada — foi por ser linha que
ele faltou na Steam em 08/09), já abre a tela de registro por `:target` e já
tem a recusa e a régua de pé. **A cura é mudar o ESTADO em que ele aparece**:
hoje só no `off`, passando a valer também no `localizado`.

**E isso FECHA UMA FRASE QUE CONFESSA DÍVIDA NOSSA NA TELA.** Medido em
`a07_lancadores._recusa_de_quem_ja_tem_cartao`, terceiro ramo — o que responde
ao botão global quando o cartão já foi achado:

> *"… o Hefesto já o achou sozinho nesta máquina. Não há o que apontar … Se o
> que ele achou não é o que você quer, me diga — **hoje o cartão não tem por
> onde trocar**."*

Essa oração é o produto contando à usuária um buraco nosso, que é o que a
decisão dela de 07/09 proíbe. Com o «Localizar» no cartão localizado, o buraco
some e a frase perde a razão de existir: ela passa a mandar clicar num botão
que ESTÁ lá — que é o que aquela função inteira já faz nos outros dois ramos,
lendo os rótulos do cartão em vez de digitá-los.

**Também não muda a página estática**, pela mesma razão da §3.1: o estático é
`nao_sei`.

### 3.3 A DECISÃO DELA — o campo de texto, ou o seletor de arquivo?

Ela escreveu *"aí eu mesmo abro a tela e procuro o .desktop"*. Há duas leituras,  <!-- noqa-acento: citação literal dela -->
e as duas são defensáveis. **Quem decide é ela, e a §3.2 vale nas duas.**

**(A) A tela que já existe.** «Localizar este Lançador» abre a caixa de
registro de 08/09, com dois campos de TEXTO — *"Como ele se chama"* e *"Onde
ele está"*, este último aceitando o comando (`ryujinx`), o caminho inteiro
(`/opt/Ryujinx/Ryujinx`) ou o nome do atalho (`org.ryujinx.Ryujinx`). Custo:
**zero**. Preço: ela **digita** o `.desktop`, e o verbo dela foi *"procuro"*.

**(B) O seletor de arquivo do sistema.** O botão abre um
`Gtk.FileChooserDialog` e ela aponta o `.desktop` com o mouse. **A estrada já
existe e tem dono** — `pacotes/ponte.escolher_arquivo`, um ponto de extensão
que o piloto preenche ao subir (`hefesto_vivo.py:2405`,
`ponte.escolher_arquivo = self._escolher_arquivo`), com precedente vivo em
`rodape.importar`, que abre o seletor com `padrao="*.json"`. **Não é capacidade
nova; é ligar o que já está no produto.** As quatro coisas medidas que essa
opção custa:

1. **`onde_isso_esta` aceita o caminho inteiro de um `.desktop` — mas só nas
   quatro pastas XDG.** Medido hoje:

   | o que o seletor devolveria | resposta |
   | --- | --- |
   | `/usr/share/applications/btop.desktop` | `('atalhos', 'btop', '/usr/share/applications/btop.desktop')` |
   | `~/.local/share/flatpak/exports/share/applications/org.libretro.RetroArch.desktop` | `('atalhos', 'org.libretro.RetroArch', '…')` |
   | `/usr/bin/flatpak` | `('comandos', '/usr/bin/flatpak', '/usr/bin/flatpak')` |
   | um `.desktop` **fora** das quatro pastas | `('', '', '')` → o gesto **recusa** |

   As quatro pastas dela são `~/.local/share/applications`,
   `~/.local/share/flatpak/exports/share/applications`,
   `/usr/local/share/applications` e `/usr/share/applications` — que é onde
   `.desktop` mora. A recusa fora delas está certa (um atalho que a busca nunca
   acharia viraria um cartão que mente para sempre), mas a **frase** da recusa
   hoje fala de `PATH` e de pastas de aplicativos, e não de "este arquivo está
   fora das pastas em que eu procuro". Isso é texto de tela a escrever.

2. **A pasta de partida importa.** Duas das quatro pastas dela ficam dentro de
   `~/.local`, que um seletor aberto no `$HOME` com arquivos ocultos desligados
   **não mostra**. O `_dialogo` só faz `set_current_folder` quando recebe
   `sugestao`, e o `_escolher_arquivo` de hoje não passa nenhuma.

3. **Com `--oculta` não há diálogo.** `_dialogo` devolve `None` e imprime no
   `stderr` — é o que impede uma janela de nascer na tela dela. Logo a prova
   botão a botão **não pode** exercitar este gesto, e ele tem de declarar
   `grava=` (entrando em `pacotes.perigosos()` pela derivação) e ser mordido
   por dublê, exatamente como `rodape.importar` já é.

4. **Esta é a única metade que muda a PÁGINA.** A caixa de registro
   (`tela_do_registro_html`) está gravada no HTML estático — linhas 1500-1530 de
   `07-lancadores.html`. Um botão «Procurar…` dentro dela é desenho, e por isso
   entra pelo fluxo `mockup/` → produto (§3.6).

**(C) As duas.** O campo de texto continua (é o único caminho para um AppImage
solto, que não tem `.desktop`) e ganha ao lado um botão que abre o seletor e
**preenche o campo** com o caminho escolhido. Custa (B) mais um endereço de
pintura; não perde nada de (A).

**Recomendação, e a razão é medida:** **(C)**. A frase dela pede o seletor
(*"procuro o .desktop"*), e o campo de texto não pode sair porque o próprio  <!-- noqa-acento: citação literal dela -->
cartão promete cobrir *"um AppImage solto, por exemplo"* — que não tem
`.desktop` para apontar. Tirar o campo fecharia o caso que a frase do cartão
abre.

### 3.4 O que a cura por estrada NÃO é: uma decisão a apagar

**A lacuna que o botão curava continua aberta, e é real.**
`assets/hefesto-launch.sh` só age com `SteamAppId`, e **nenhum jogo do Heroic,
do Lutris, do RetroArch, do Dolphin ou do mGBA tem um**. Medido nesta árvore:
não há segundo caminho — `cura_por_estrada` é o único código que entrega o
ambiente da ponte a um lançador que não é a Steam.

Então esta sprint **não decide que a cura está errada**. Ela decide que o vaso
está errado, e a §2.2 diz qual é o vaso certo pela palavra dela: **a carona**.
`perfil.com_a_carona()` já é o lugar onde "salvar ou aplicar perfil repõe o que
faz o controle chegar", já roda em thread de gesto e já é chamado pelos três
gestos do rodapé e pelos da aba 10.

**Isso é OUTRA sprint, e ela não é esta** — mexer em `perfil.py` e no rodapé é
outra posse, e a cura por estrada escreve em arquivo de outro programa, o que
merece a palavra dela sobre "sem botão, no Salvar" antes de qualquer linha.
Fica nomeada aqui: **LANCADOR-CARONA-01**, e ela depende desta.

### 3.5 O módulo FICA, com a dívida declarada — decidido, e a razão

Tirado o botão e o gesto, `integrations/cura_por_estrada.py` (483 linhas, 13
símbolos públicos) fica **sem um chamador de produção**: `escrever_a_estrada`,
`planejar` e `frase_do_feito` perdem `a07_lancadores.consertar_lancador`, e
`tem_estrada`/`estradas_do_cartao` perdem `desenho.medir_no_disco:1239`, que só
os consulta para preencher `DoDisco.estradas` — o campo que decide o botão.
`sandbox_dos_lancadores` **sobrevive**: o cartão «Flatpak» usa
`app_ids_do_cartao` e `resposta_do_flatpak` para a linha *"5 lançadores por
aqui"*.

O portão `casa-sabe` está VERDE hoje (42 passed, 118 s, medido). Sem chamador,
os símbolos viram acusação e o portão exige classificação.

**DECIDIDO: `_SEM_CAMINHO_HOJE`, e o módulo não sai.** Três razões medidas:

1. **a lacuna é real e continua aberta** (§3.4) — apagar 483 linhas e 26 provas
   que MEDEM um comportamento vivo faria a próxima pessoa remedir tudo, que é o
   custo que a regra desta casa existe para não pagar duas vezes;
2. **o Heroic dela já está curado por ele** (§1) — apagar o módulo deixaria na
   máquina dela uma escrita sem código que a explique nem a desfaça;
3. **`_SEM_CAMINHO_HOJE` é exatamente esta prateleira** — *"é promessa, e o
   caminho não existe. É dívida"* — e o portão cobra que a entrada seja APAGADA
   no dia em que o caminho nascer. Quando a LANCADOR-CARONA-01 fechar, o portão
   avisa sozinho.

A entrada declara a data, a razão e o endereço da sprint que a desfaz. E a
linha `"escrever_a_estrada"` de `test_todo_gesto_que_grava_esta_protegido.py`
sai junto com o `grava=` do gesto — a régua cobra as duas direções, e uma
declaração que a árvore não acha é ruído.

**A dívida vai para o mapa, nunca para a tela** — decisão dela de 07/09.
`docs/data/paridade-gtk-html.csv` é onde ela mora, na aba `07-lancadores`.

### 3.6 O fluxo de tela, e o que é ATO DELA

O desenho vai para a bancada pelo gerador — `python3
src/hefesto_dualsense4unix/interface/aba07.py` escreve em
`mockup/07-lancadores.html` — e o produto **só recebe** por
`scripts/check_o_desenho_aprovado.py --publicar 07`, **que é ato dela**, depois
do OK.

**E nesta sprint quase nada precisa dele.** Medido na §3.1 e na §3.2: tirar o
«Consertar» e pôr o «Localizar» no cartão localizado mudam **zero byte** das duas
páginas, porque o estático é a primeira meia volta. **Só a opção (B)/(C) da
§3.3 muda a página** — o botão «Procurar…` dentro da caixa de registro. Se ela
escolher (A), esta sprint fecha sem `--publicar`.

### 3.7 A outra metade do recado dela NÃO é desta sprint

Ela escreveu também *"a ideia é cada um dos lançadores passarem a ter os jogos  <!-- noqa-acento: citação literal dela -->
com perfis dentro da aba perfis"*. Isso é outra sprint, de outro agente desta  <!-- noqa-acento: citação literal dela -->
mesma leva, e não se toca aqui.

---

## §4 — O que MORDE

Cinco réguas, e a primeira é a que não existia (§2.3).

1. **O PAR SELO↔BOTÃO, e ela é nova.** Para cada estado de `cartao_sem_censo`,
   um cartão com selo `localizado` ou `ok` **não pode carregar botão de
   conserto**. *Mordida:* devolva o ramo do `consertar` ao estado `localizado`
   e a régua cai nomeando o cartão e o selo. Ela é a régua que impede o defeito
   de voltar num sexto cartão amanhã — que é como o «Localizar» faltou na Steam
   em 08/09, por ser linha e não função.

2. **O «Localizar» está nos SEIS, em `off` E em `localizado`.** Monte uma
   `Leitura` com os seis achados e outra com os seis não achados, e cobre
   `acao_de_localizar` nos doze cartões. *Mordida:* tire o `localizar` de um dos
   dois estados e a régua cai nos seis daquele estado — nunca num só, que é o
   ponto cego que a `_recusa_de_quem_ja_tem_cartao` já pagou (a primeira régua
   dela olhava só o estado `off` e ficava verde sobre um beco aberto nos outros
   dois).

3. **A recusa do botão global perdeu o beco.** O terceiro ramo de
   `_recusa_de_quem_ja_tem_cartao` — o que hoje diz *"hoje o cartão não tem por
   onde trocar"* — passa a mandar clicar no «Localizar» daquele cartão, com o
   rótulo LIDO de `_botoes_do_cartao_agora` e não digitado. *Mordida:* faça a
   frase citar um rótulo digitado à mão e a régua cai quando o rótulo do botão
   mudar.

4. **A TELA VIVA, e ela é obrigatória** (regra dela de 29/08). Foto antes e
   depois, `--oculta`, os quatro na mesa:
   `hefesto_vivo.py --oculta --abre 07 --segundos 6 --foto …`. A de ANTES está
   tirada e é a tabela da §1. A de DEPOIS tem de mostrar os quatro cartões sem
   «Consertar» e com «Localizar este Lançador», e **o cartão da Steam com o
   «Consertar» dele intacto** — são atos diferentes, e tirar os dois seria
   passar do que ela pediu.

5. **Se ela escolher (B) ou (C):** o gesto do seletor declara `grava=`, aparece
   em `pacotes.perigosos()` **pela derivação** (nunca digitado), e a régua o
   morde com um dublê de `ponte.escolher_arquivo` — os quatro casos medidos na
   §3.3.1: `.desktop` numa pasta XDG, `.desktop` fora delas (recusa com frase
   própria), um binário do `PATH`, e o `None` de "ela cancelou", que **não é
   erro nem notícia**. *Mordida:* faça o dublê devolver um `.desktop` de `/tmp`
   e a régua tem de ver a recusa — se o cartão acender, o produto acabou de
   gravar um lançador que a busca nunca vai achar.

**E a mordida do portão:** com o botão fora e a entrada de `_SEM_CAMINHO_HOJE`
posta, apague a entrada e `portao_a_casa_sabe_e_o_produto_nao_faz` tem de ficar
VERMELHO citando os símbolos de `cura_por_estrada`. Se ficar verde, a
declaração não estava medindo nada.

---

## Critério de pronto — por cabo · por BT · no perfil · por controle

É a régua dela de 08/09 ([CABO-BT-PERFIL-CONTROLE-01](2026-09-08-CABO-BT-PERFIL-CONTROLE-01-a-regua-de-pronto-de-toda-feature-da-tela.md)); a sprint só fecha com as quatro respondidas.

| | |
| --- | --- |
| cabo | **não se aplica ao botão, e se aplica à foto**: qual botão o cartão mostra não depende de transporte — ele sai de `estradas_do_cartao`, que só abre disco. A foto da §4.4 roda com dois dos quatro no cabo, para provar que a aba não muda de desenho com a mesa |
| BT | idem: os dois outros no rádio na mesma foto. **O que É de transporte é a lacuna que o botão curava** — sem o ambiente, o jogo ignora o vpad, e a queixa de origem dela era *"funciona no cabo, quebra no rádio"* (`carona_do_wrapper.py:26`). Essa metade é da LANCADOR-CARONA-01, não desta |
| no perfil | **nada entra no perfil, e é de propósito.** O que o Hefesto guarda daqui é ONDE o lançador está (`machine.declare`, no `maquina.json` — que é da MÁQUINA e não do perfil); e o que a cura por estrada escreve é a configuração de OUTRO programa. Nenhum dos dois é campo de perfil |
| por controle | **não se aplica**: o cartão é do lançador, não do controle. O ambiente da ponte é da SESSÃO (`default.env`), igual para os quatro — e é essa a razão de a cura ser por lançador e não por jogo, escrita em `cura_por_estrada` |

---

## O que esta sprint revoga

A **§5.3 da LANCADORES-ZERO-01** (`estado: feita`), que criou o botão
«Consertar» nos cartões sem censo em 09/09/2026. O **módulo e as 26 provas
ficam** (§3.5); o que cai é o botão, o gesto e o `PROVISÓRIO` de dois cliques
que segurava o lugar até a palavra dela. Não se apaga decisão medida: a §5.3
ganha nota datada apontando para cá, e o que ela mediu — as duas estradas, a
grafia `enviromentOptions`, a permissão que volta como estava — continua sendo
o conhecimento que a LANCADOR-CARONA-01 vai usar.
