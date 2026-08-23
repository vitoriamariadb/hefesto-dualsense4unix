# ENGASGO-VULKAN-01 — sessenta quadros por segundo, setenta engasgos por minuto

**23/08/2026.** Ela relatou que o Sackboy engasga **e que mexer no controle não
corrige** — o que tirou a queixa do território do Hefesto e a jogou no da
apresentação de quadro.

> # CORREÇÃO — 23/08/2026, contra os dados crus: o A/B DERRUBA a hipótese
>
> Os cinco logs por quadro entraram na árvore
> ([dados](../estudos/dados/2026-08-23-frametime-sackboy/LEIA.md), 267.465
> linhas) e foram conferidos por uma passagem de auditoria. **Metade dos
> números desta página estava atribuída à sessão ERRADA, e o A/B, quando
> finalmente lido, aponta para o lado contrário do que esta sprint conclui.**
>
> ## O que se sustenta
>
> | afirmação | medido |
> |---|---|
> | mediana de 16,6 ms a sessão inteira | **16,64 ms** (camada ligada) — confirmado |
> | metrônomo de 1,021 s | **1,019 s** de mediana entre picos — confirmado |
> | solto do relógio de parede | **qui-quadrado 0,8** com 9 g.l. — confirmado, e mais forte do que o relatado |
> | ~70 quadros longos por minuto | **68 a 72/min** no regime estável (min. 19 a 30) — confirmado |
> | 3.597 quadros/min | é o **melhor minuto**; a média da sessão é 3.533/min |
>
> ## O que NÃO se sustenta
>
> **A rampa do p99 é da sessão com a camada DESLIGADA.** Os números que esta
> página usa como assinatura do defeito — *"131,8 ms no minuto 28"*, *"~4 ms por
> minuto"* — saem do arquivo `01-15-43`, que é o **controle** do A/B:
>
> | | camada **LIGADA** (`00-39-24`) | camada **DESLIGADA** (`01-15-43`) |
> |---|---|---|
> | inclinação do p99 (do min. 3) | **+2,28 ms/min** | **+4,19 ms/min** |
> | p99 no minuto 28 | **70,1 ms** | **130,5 ms** |
> | p99 no último minuto | 73,4 ms (min. 30) | 161,8 ms (min. 36) |
> | quadros/min no fim | 3.419 | **2.491** |
> | picos ≥47 ms na janela estável | 893 | **3.630** |
> | período entre picos | 1,019 s | **0,505 s** |
>
> **Sem a camada, tudo piora:** a rampa é quase o dobro mais íngreme, há quatro
> vezes mais picos, e eles vêm com o dobro da frequência.
>
> **E as duas sessões rampam.** Essa é a consequência que mais dói: a rampa do
> p99 **não é assinatura da camada Vulkan**, porque acontece igual sem ela. O
> argumento central desta sprint — *"a camada embrulha a apresentação do quadro,
> e isso explica cada observação de uma vez"* — perde a observação que era a
> mais convincente.
>
> ## O que isto NÃO prova
>
> **Não prova que a camada é inocente**, e o A/B continua sem fechar — por um
> motivo novo, além da contaminação já declarada: **as duas sessões não são
> comparáveis**. O próprio `LEIA.md` diz que a `01-15-43` foi *"com ela
> jogando"*, e a `00-39-24` não. Carga de jogo diferente explica sozinha uma
> diferença desse tamanho. Um A/B de verdade é a mesma fase do jogo, duas vezes.
>
> **O que fica de pé sem depender de nenhuma hipótese:** o defeito existe, tem
> forma medida, a mediana é sã, e **a rampa do p99 acontece com e sem a camada**
> — logo há uma segunda coisa acontecendo, que nada nesta página explica, e que
> é o que a próxima investigação tem de perseguir.
>
> **Consequência para o produto:** a cura que esta leva entregou (o botão, o
> gancho, o censo) **não está errada** — desligar camada implícita que ninguém
> pediu é bom independentemente. O que não se pode é vendê-la como cura do
> engasgo dela. A página já dizia "hipótese forte, não confirmada"; passa a
> dizer **hipótese com evidência contrária**.

## O que foi medido, e o que caiu

O jogo entrega **3.597 quadros por minuto (60 fps de média perfeita)** com
**~70 quadros longos por minuto** — de 47 a 91 ms, contra os 16,7 ms do ritmo.
Não é lentidão: é **ritmo de apresentação desigual**, um quadro por segundo
levando 3 a 5 vezes o tempo e os vizinhos correndo para compensar.

O metrônomo tem **período de 1,021 s** e é **solto do relógio de parede** (fase
uniforme dentro do segundo: qui-quadrado 1 contra 9 graus de liberdade). Período
que não se prende ao relógio nasce **dentro do laço de quadro do jogo**, não de
temporizador do sistema.

A eliminação, linha por linha, cada uma medida:

| suspeito | como caiu |
|---|---|
| GPU / VRAM / térmico | 51% de uso, 65 °C, todos os `Clocks Event Reasons` em `Not Active`, 3 de 8 GB |
| versão do Proton | oito jogos dela no mesmo GE-Proton10-34; só um engasga |
| daemon do Hefesto | **ela**: engasga com o Hefesto desligado |
| varredura de aparelhos de entrada | **ela**: engasga com um jogador só |
| Denuvo / DRM | **ela**: Mortal Kombat e Wukong no ultra, lisos |
| os medidores do investigador | 69,9/min com eles, 70,7/min sem — idêntico |
| temporizador do sistema | fase uniforme: não está preso ao relógio |

## A causa, e a varredura que a apontou

O overlay do **Epic Online Services** se registra como **camada Vulkan
implícita** dentro do prefixo Wine do jogo, no `system.reg`:

```
[Software\\Khronos\\Vulkan\\ImplicitLayers]
"C:\\Program Files (x86)\\Epic Games\\...\\EOSOverlayVkLayer-Win64.json"=dword:00000000
```

Camada implícita **embrulha a chamada de apresentação do quadro**, o que explica
cada observação de uma vez: média intacta, CPU firme, GPU sem estrangulamento,
período solto do relógio e "só neste jogo".

**A varredura dos 27 prefixos `compatdata` dela:** 26 têm só `winevulkan.json`
(o driver Vulkan do Wine, obrigatório, e que mora em outra chave). **Um único**
tem camada a mais — o do Sackboy — e é o único que engasga.

**A varredura foi REFEITA pelo próprio produto**, 23/08/2026, e é o instrumento
independente que a casa cobra: `camadas_vulkan.censo()` achou as duas
bibliotecas (`~/.steam/steam` e `/mnt/Mnemosyne/SteamLibrary`), **29 prefixos,
28 com `system.reg`**, e devolveu **um** com camada implícita registrada — o
`1599660`, com `EOSOverlayVkLayer-Win64.json` e `-Win32.json`. A conta é maior
que a da madrugada porque ela instalou jogos no meio; a proporção não mudou. E
o censo leu certo o estado da medição em curso: as duas camadas saem
`ligada=True, presente=False` — vivas no registro, com o arquivo renomeado à
mão. Chamá-las de "ligadas" seco seria o instrumento mentindo.

> **Grau de confiança: ~~FORTE, ainda não confirmado por A/B~~ → HIPÓTESE COM
> EVIDÊNCIA CONTRÁRIA.** Assim que esta leva foi escrita o A/B ainda não tinha
> sido lido. Foi lido em 23/08 contra os 267.465 quadros crus, e **a sessão sem
> a camada é PIOR em todas as réguas** — ver a correção no topo desta página. O
> produto continua não prometendo cura: promete dizer o que tirou, e isso segue
> valendo.

## O que ela pediu

> *"por favor faz uma cura universal e coloca isso naqueles botões do emulação
> tipo travar próton e coloca essa cura contra o vulcan em todos os jogos"*

Mais a regra dela de 14/08/2026, que é quem decide o desenho: **receita por
appid deixa todo jogo novo desprotegido.**

## O que entrou

### 1. O produto enxerga as camadas

`src/hefesto_dualsense4unix/integrations/camadas_vulkan.py` — 100% stdlib, no
molde do `proton_pin`, para o `install.sh` poder materializá-lo e o gancho de
lançamento poder executá-lo com o `python3` do sistema.

Três decisões, cada uma justificada no docstring:

- **De onde saem os prefixos:** `pastas_compatdata` **reusa**
  `steam_launch_options.pastas_steamapps`, que já é o dono do formato VDF nesta
  casa e já resolve a biblioteca em outro disco e a `steamapps` que chega por
  dois caminhos de texto (BIBLIOTECA-DOBRADA-01). Zero parser novo.
- **`dword:00000000` significa LIGADA.** O número é a flag de *desabilitar* do
  carregador Vulkan: zero = "não desabilite". É o contrário da intuição, está
  escrito no docstring, na constante `_LIGADA` e no comentário do
  `hefesto-launch.sh`, porque ler ao contrário inverte a cura inteira.
- **A régua é lista de PRESERVADOS**, não de conhecidos-ruins. Uma lista com
  `EOSOverlay` seria a regra dela de 14/08 com outro nome: o overlay da Ubisoft,
  o da EA, o da Rockstar exigiriam mexer no código de novo, e quem paga é quem
  instalou o jogo de amanhã. A lista de preservados é limitada e muda devagar (é
  o que alguém instala de propósito: MangoHud, gamescope, ReShade, DXVK,
  vkBasalt, OBS, **a sobreposição da Steam**), e erra para o lado seguro: uma
  ferramenta nova pode ser desligada, e o preço é "sumiu meu medidor" com o
  produto dizendo o nome e um clique para devolver — contra "o jogo engasga e
  ninguém sabe por quê".

  **A sobreposição da Steam está preservada por decisão de produto**: é ela que
  dá o Shift+Tab, a captura de tela e a tela de configuração de controle. Um
  produto de controle que a desliga se auto-sabota.

### 2. O botão: "Tirar o que faz engasgar"

Na fileira **Avançado** da aba Sistema, ao lado do "Travar Proton validado" —
mesma natureza, mesma gramática (verbo na frente), mesmo alcance.

**O nome é a queixa, não o remédio.** Molde do "A luz não acende": ninguém
procura por "camada Vulkan implícita"; procura por "o jogo engasga", que é a
palavra dela. Há teste que reprova se o jargão vazar para o rótulo ou para a
dica.

**O diálogo É o relatório** (ELO-MUDO-01): lista jogo por jogo o que existe, com
o estado de cada camada — inclusive *"pendurada, mas o arquivo não está no
disco"*, que é exatamente o estado em que a máquina dela estava. Chamar isso de
"ligada" seco seria o instrumento mentindo.

**Reversível no mesmo gesto, e é por isso que é um botão só.** "Devolver" mora
dentro do diálogo e só aparece quando há o que devolver. Um segundo botão
permanente na fileira seria no-op em 99% dos dias — e botão que não faz nada
ensina que a tela é enfeite.

### 3. Os jogos de amanhã

`assets/hefesto-launch.sh` ganhou `curar_camadas_vulkan`, chamada com `|| true`
ao lado do `enter_game_mode`. Roda em **todo jogo lançado**.

**Por que no prefixo e não por variável de ambiente:** medido nesta madrugada,
`MANGOHUD=1` exportado pelo wrapper **não** aparece no `environ` do processo do
jogo; só funciona quando a Steam inteira nasce com a variável. Uma camada Vulkan
tem de ser desarmada onde o jogo a lê — o prefixo —, e não por env.

> **CORREÇÃO — 23/08/2026.** Este parágrafo dizia *"o `pressure-vessel` filtra o
> ambiente"* e concluía *"cura por env não serve"*. **A generalização é falsa, e
> de uma variável só.** A cura central deste produto viaja exatamente por env —
> `SDL_GAMECONTROLLER_IGNORE_DEVICES`, `PROTON_DISABLE_HIDRAW`,
> `SDL_JOYSTICK_HIDAPI` — e **funciona**: se não funcionasse, os quatro vpads
> não seriam lidos pelo jogo, e são. O que se mediu foi que a `MANGOHUD`
> especificamente não atravessou, e ela é tratada de forma especial pelo runtime
> da Steam.
>
> **O defeito que resta é outro, e é real:** o wrapper **nunca confere se o jogo
> herdou a env**. Está escrito no próprio `assets/hefesto-launch.sh:66` —
> *"o `dedup_ok` sozinho é falso-tranquilizante"* — e continua sem medição.
> Registrado como E2b da
> [ESCONDE-SÓ-O-HIDRAW-01](2026-08-23-ESCONDE-SO-O-HIDRAW-01-o-jogo-continua-vendo-o-fisico-pelo-evdev.md).

**Custo por lançamento, medido em 23/08/2026** contra os **28 `system.reg`
reais** dos dois discos dela, três repetições por prefixo:

| caso | custo |
|---|---|
| jogo nativo (sem `STEAM_COMPAT_DATA_PATH`) | 0 — sai na primeira linha |
| prefixo sem camada ligada (27 de 28) | **2,1 ms de média** — 2 ms no maior (5,4 MB), 1 ms num de 4,1 MB |
| prefixo já curado | 2 ms — o portão passa batido, medido no registro do Sackboy depois da cura |
| prefixo com camada ligada, **uma vez** | ~120 ms de trabalho (44 ms de leitura + ~75 ms de escrita e backup) no registro de 5,4 MB; **0,13 a 0,6 s** de ponta a ponta com o interpretador e a variação do disco |

O portão do `sh` procura `dword:00000000` **dentro** da seção de camadas
implícitas, não só a seção: sem isso, todo lançamento de um prefixo já curado
pagaria de novo o décimo de segundo do interpretador. O resultado do `grep`
entra numa **variável**, nunca num pipe para `grep -q`
(CORRIDA-DO-PIPEFAIL-01).

**A escolha dela sobrevive.** Estado local em
`~/.local/state/hefesto-dualsense4unix/camadas-vulkan.json`. Duas regras:
camada marcada `manter` nunca é desligada de novo pelo gancho; e camada que NÓS
desligamos e aparece ligada outra vez foi religada por fora — isso vira
`manter`, não vira briga. O clique no botão força (a vontade da GUI prevalece,
regra dela de 09/08/2026); o gancho nunca força.

### 4. Install e uninstall

`install.sh` passo **4b-3**: materializa o módulo em
`~/.local/share/hefesto-dualsense4unix/bin/hefesto-camadas`, ao lado do
`hefesto-launch` e com o mesmo tratamento. **Sem flag** (regra de 08/08/2026), e
há teste que reprova se uma flag aparecer.

`uninstall.sh`: **devolve antes de apagar o curador**, na mesma ordem e pelo
mesmo motivo do strip das Launch Options — o que mexemos no dado dela volta, e
volta enquanto ainda há com o quê. Teste garante a ordem.

### 5. Os portões

- `test_a_cura_do_engasgo_nunca_mira_o_driver_do_wine.py` — o mais importante
  desta leva. Morde em três alturas: classificação, leitura e **escrita**. A
  terceira fabrica uma `Camada` do driver mentindo em todas as propriedades e
  prova que o `system.reg` sai **byte a byte idêntico**.
- `test_a_cura_do_engasgo_alcanca_todos_os_prefixos.py` — as duas bibliotecas,
  reversibilidade byte a byte, a memória da escolha dela, e a **fiação** (gancho,
  install, uninstall), com uma prova de ponta a ponta que roda o
  `hefesto-launch.sh` de verdade contra um prefixo de mentira.
- `test_o_botao_que_tira_o_que_faz_engasgar.py` — o botão no glade, o handler no
  mapa, o jargão fora da tela, as frases, e a recusa com jogo aberto.
- `test_a_cura_do_engasgo_nao_contamina_a_chave_vizinha.py` — **defeito medido e
  curado**, ver a seção abaixo.
- `test_a_cura_reconhece_o_prefixo_que_ela_desligou_a_mao.py` — o estado REAL da
  máquina dela: manifesto renomeado para `.json.desligado` com a entrada do
  registro ainda em `dword:00000000`. Prova que o produto conta a verdade
  inteira (viva no registro, ausente no disco), que a cura age **só** no
  `system.reg` e não encosta nos arquivos que ela renomeou, e que o lançamento
  seguinte respeita a devolução dela.

### 5b. O defeito que a segunda passada achou (23/08/2026)

**Uma entrada de camada é (CHAVE do registro + caminho), nunca o caminho
sozinho.** As camadas implícitas moram em duas chaves — a de 64 bits e a de 32
— e nada impede o mesmo manifesto de estar registrado nas duas com valores
DIFERENTES. Enquanto o alvo da escrita era só o caminho, `alvos.get(caminho)`
casava a mesma linha nas duas seções. Medido num prefixo de mentira, com 64 em
`dword:00000000` (ligada, candidata) e 32 em `dword:00000003` (já desligada,
que o próprio módulo classificava `e_sobra=False`):

| entrada | original | depois de curar | depois de devolver |
|---|---|---|---|
| `Khronos` (64) | `00000000` | `00000001` | `00000000` |
| `Wow6432Node` (32) | `00000003` | `00000001` | **`00000000`** |

Dois defeitos num. A cura escreveu numa entrada que ela mesma tinha declarado
fora da mira; e a **reversibilidade byte a byte quebrou** — o valor devolvido
foi `00000000`, que é LIGADA, ou seja, *desfazer ligava* uma camada que estava
desligada. É exatamente a promessa que o botão faz na tela ("o mesmo lugar
devolve") falhando em silêncio.

Curado passando a chave para dentro do alvo de `_reescrever` e para dentro da
memória do estado local, via `chave_de_estado()` — separador `|`, que o Windows
proíbe em nome de arquivo, então a junção nunca fica ambígua. **O estado local
ainda não existia em máquina nenhuma** (conferido: nem
`~/.local/state/.../camadas-vulkan.json`, nem o curador instalado, nem backup
`.bak.hefesto-camadas-*` em nenhum dos 28 prefixos), então não há formato velho
a migrar.

Na máquina dela este defeito estava **latente, não ativo**: os dois manifestos
do Epic têm caminhos diferentes (`-Win64` e `-Win32`), então nunca colidiram.

**As mordidas, 23/08/2026.** Cada cura foi arrancada, o teste rodou, e o
vermelho foi conferido — num espelho da árvore em `/tmp` com o `PYTHONPATH`
apontado para a cópia, para não contaminar quem estava trabalhando ao lado
(ARVORE-CONGELADA-01). Cura devolvida em todas: 41 verdes.

| cura arrancada | reprovou |
|---|---|
| `_e_o_driver` devolvendo `False` | 6 nós, entre eles `test_o_driver_do_wine_nunca_e_sobra` |
| só o cinto da escrita (`_e_o_driver` intacto) | 1: `assert ('winevulkan.json',) == ()` — os dois cintos mordem separado |
| `pastas_compatdata` voltando à receita ingênua (só a biblioteca padrão) | 3, com `KeyError: '333'` no jogo do outro disco |
| `curar_camadas_vulkan \|\| true` fora do `hefesto-launch.sh` | 2, uma delas rodando o wrapper de verdade |
| `_LIGADA = 1` (a leitura invertida que a intuição sugere) | 7 |
| a memória do `manter` fora de `aplicar_no_prefixo` | 1: o gancho desfez a escolha dela |
| o `<child>` do `btn_camadas_engasgo` fora do glade | 3 |
| `slo.steam_game_running()` trocado por `False` | 1: escreveu com jogo aberto |
| a ordem do uninstall invertida | 1: apagaria o curador antes de devolver |

**Segunda passada, mesmo dia — mais cinco mordidas, na árvore de trabalho.**
Cura arrancada, teste rodado, vermelho conferido, cura devolvida. 75 verdes ao
final.

| cura arrancada | reprovou |
|---|---|
| a chave fora do alvo de `_reescrever` (o defeito original) | 2, com o sintoma exato: `At index 430 diff: b'0' != b'3'` |
| `chave_de_estado` devolvendo só o caminho | 2: `assert 1 == 2` — uma linha de estado para duas entradas |
| `_nome_do_arquivo` sem normalizar (nem `strip`, nem `lower`, nem barra normal) | 6, entre elas a que mostra a cura **desligando `WineVulkan.Json`** — o driver |
| `presente` fixo em `True` | 2: a tela achatava "pendurada, mas o arquivo não está no disco" em "ligada" |
| `curar_um_prefixo` passando a forçar | 1: o gancho desfez a devolução dela |

**O instrumento estava mentindo, e a mordida achou.** Rodando a cópia como o
`install.sh` a instala — `bin/hefesto-camadas`, longe do pacote —,
`--relatorio` respondia *"nenhum prefixo com camada Vulkan implícita
registrada"* **e saía com 0**. Era falso: ali o irmão `steam_launch_options`
não está no `sys.path`, `pastas_compatdata` devolvia `[]`, e o que a CLI
deveria dizer é *"não consegui abrir a lista de jogos"*. "Não achei" e "não
consegui olhar" produzem a mesma lista vazia, e só o primeiro é notícia boa —
armadilha número um desta casa. Curado com `sabe_enumerar()`: a CLI agora sai
com 2 e diz a frase certa, a mesma separação chegou ao diálogo
(`frase_do_censo(..., bibliotecas=0)`), e o modo `--prefixo` do gancho
continua inteiro porque nunca enumerou. Dois portões novos, os dois mordidos.

**Uma mordida reprovou o TESTE, não o produto**, e o teste mudou por causa
dela: `test_o_install_materializa_o_curador_sem_flag` era `grep` no
`install.sh` e **passava** com o bloco inteiro trancado atrás de um
`if false` — a linha do `install -Dm755` continuava escrita e inalcançável,
que é o defeito "a casa sabe e o produto não faz" em pessoa. Agora ele recorta
o bloco e o **RODA** com bash num `HOME` de mentira (padrão de
`test_install_broker_step.py`), cobra o arquivo no disco com bit de execução e
byte a byte igual à fonte, e prova que reinstalar atualiza a cópia. Com o
mesmo `if false`: *"o install rodou e o curador não apareceu no HOME"*.

## O que ficou aberto

1. **O A/B do Sackboy.** Os dois manifestos continuam renomeados à mão no
   prefixo dela — a medição em curso não foi tocada. Falta relançar com e sem, e
   escrever o resultado aqui e no `interface.md`.
2. **Instalação por pacote não materializa o curador.** O `.deb`/Arch/Fedora/
   flatpak não copiam nem o `hefesto-launch` nem o `hefesto-camadas` para
   `~/.local/share/…/bin` — é a mesma lacuna, pré-existente, do wrapper. Quem
   instala por pacote e não roda o `install.sh` fica sem o gancho (o botão
   continua funcionando, porque a GUI usa o módulo do pacote).
3. **O `doctor.sh` não confere o curador.** Ele já confere o `hefesto-launch`
   (presente, executável, no PATH); a linha irmã para o `hefesto-camadas` não foi
   escrita — o `doctor.sh` é território de outra frente hoje.
4. **`wineserver` vivo pode desfazer a escrita.** O Wine guarda o registro em
   memória e o regrava ao sair. A interface recusa com jogo aberto e o gancho
   escreve antes de o Proton subir, que é o instante certo; no pior caso a
   mudança se perde e o lançamento seguinte a refaz. Idempotente de propósito.
