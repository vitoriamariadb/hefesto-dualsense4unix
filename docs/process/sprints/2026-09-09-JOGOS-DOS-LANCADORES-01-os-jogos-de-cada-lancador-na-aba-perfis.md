---
sprint: JOGOS-DOS-LANCADORES-01
estado: aberta
posse:
  JOGOS-DOS-LANCADORES-01:
    - src/hefesto_dualsense4unix/profiles/loader.py
    - src/hefesto_dualsense4unix/integrations/censo_dos_lancadores.py
    - src/hefesto_dualsense4unix/integrations/jogos_locais.py
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - src/hefesto_dualsense4unix/interface/aba10.py
bancada: true
depois_de: []
---

> *"aí a ideia é cada um dos lançadores passarem a ter os jogos com perfis
> dentro da aba perfis."* <!-- noqa-acento: citação literal dela -->


> **A PREMISSA DA PERGUNTA CAIU — 09/09/2026, e foi ela quem a derrubou:**
> *"deixei baixando um jogo já"*. <!-- noqa-acento: citação literal dela -->
>
> A §3 oferecia (A) mostrar os 36 do Heroic desde já e (B) só depois de ela
> abrir uma vez, e as duas nasciam do mesmo fato medido: **`is_installed:
> False` nos 35 da Epic**, nenhum binário no disco, nenhum campo com executável
> nas 37 entradas da biblioteca. Com um jogo do Heroic INSTALADO, esse fato
> deixa de valer para ele — e é a primeira vez que esta casa pode olhar a
> biblioteca do Heroic com um jogo de verdade dentro.
>
> **ENTÃO A SPRINT COMEÇA MEDINDO DE NOVO, e a decisão espera essa medição:**
> quando o jogo terminar de baixar, releia a biblioteca e responda —
> `is_installed` virou `True`? Nasceu campo de executável, de prefixo ou de
> caminho de instalação? O que o Heroic passa a entregar que não entregava?
> **Se nascer um executável, a pergunta (A) contra (B) pode nem se fazer**: o
> jogo instalado dá a chave que faltava, e o perfil casa como o da Steam casa.
>
> Ela pediu, ao decidir: *"seguinte só materializa as spRinTs certinho tá
> bom?"* <!-- noqa-acento: citação literal dela -->

# JOGOS-DOS-LANCADORES-01 — os jogos de cada lançador na aba Perfis, e a chave que só a Steam tem

## §1 — O que ela viu, e o que está MEDIDO

**O que ela pediu já existe — para UM lançador.** A aba Perfis não tem uma
lista de jogos ao lado da lista de perfis: **a lista de perfis É a lista de
jogos**, porque `profiles/loader.semear_perfis_dos_jogos` cria um perfil por
jogo da biblioteca Steam, sozinho, a cada carga de perfis
(`_talvez_semear_jogos`, chamado de `load_all_profiles`).

Medido no disco dela em 09/09/2026, com o daemon vivo:

| o que | número |
| --- | --- |
| perfis no disco dela | **26** — 25 na forma «Jogo da Steam», 1 «Sempre» (`Personalizado`) |
| o que o semeador diz na carga | `perfis_de_jogo_semeados jogos=23 criados=[] desfechos={'ja_semeado': 23}` |
| `jogos_locais.catalogo_de_jogos()` | **23**, e `Counter({'steam': 23})` — nenhum de outro lançador |
| `<option>` no `<datalist data-hef="editor.jogo.lista">`, no produto vivo | **23** |
| `censo_dos_lancadores.biblioteca_de("Heroic")` | **37** na biblioteca, **0 instalados** |
| Lutris · RetroArch · Dolphin · mGBA | `nunca_aberto` nos quatro — a pasta de configuração não existe |

Então a frase dela, traduzida para o que o produto faz hoje: **estender o
semeador, o catálogo e o campo «Nome do Jogo» aos outros cinco lançadores.**
Não é uma lista nova numa aba; é a mesma lista, com mais origens.

### A hipótese do enunciado CAIU, e a medição é curta

O enunciado desta sprint dizia: *"o wrapper: quem faz o perfil ENTRAR quando o
jogo abre. Para a Steam é o `hefesto-launch` com `SteamAppId`; para os outros
cinco é a `cura_por_estrada.py`"* — e daí concluía que a saída da estrada (a
sprint irmã, LANCADOR-LOCALIZAR) era **o nó** desta sprint.

**O `hefesto-launch` não faz perfil nenhum entrar.** Ele exporta variáveis de
ambiente, e são estas seis, lidas da `daemon.launch_env.ENV_ALLOWLIST`:

```
PROTON_DISABLE_HIDRAW · SDL_GAMECONTROLLER_IGNORE_DEVICES
SDL_GAMECONTROLLER_USE_BUTTON_LABELS · SDL_JOYSTICK_HIDAPI
__GL_SHADER_DISK_CACHE · __GL_SHADER_DISK_CACHE_SKIP_CLEANUP
```

**Nenhuma delas é sobre perfil.** As quatro primeiras escondem o DualSense
físico do SDL e do Proton para o jogo enxergar só o controle virtual; as duas
últimas são cache de shader. E no disco dela há **um** arquivo em
`~/.local/state/hefesto-dualsense4unix/launch_env/`: o `default.env`. Nenhum
`steam_app_<id>.env` — logo o ambiente é **o mesmo para todos os jogos**, hoje,
inclusive na Steam.

Quem faz o perfil entrar é o `AutoSwitcher`, lendo a `wm_class` da janela em
foco. Medido, sem estrada nenhuma no caminho:

```
regra = from_simple_choice("janela", "borderlands3.exe")
Profile(...).matches({"wm_class": "borderlands3.exe", ...})  →  True
```

**A estrada e o perfil respondem a perguntas diferentes** — *"o jogo enxerga o
controle?"* e *"o que este jogo guarda de ajuste?"*. A sprint irmã tirar o botão
da estrada não tira nada desta. Por isso o `depois_de` está vazio.

## §2 — A causa, com o número

**A Steam entrega uma CHAVE; os outros cinco entregam um NOME.**

O semeador funciona porque `steam_app_<appid>` é o que a janela vai anunciar, e
a Steam dá o appid **antes de o jogo existir no disco**
(`loader.classes_do_perfil_do_jogo` devolve exatamente `[f"steam_app_{appid}"]`).
O perfil nasce certo sem ninguém abrir o jogo.

Do lado do Heroic não há esse número. Medido, campo a campo, no
`legendary_library.json` dela (35 itens da Epic, 2 da GOG):

```
campos de um item: app_name, title, folder_name, developer, namespace,
                   runner, store_url, save_folder, install, is_installed,
                   is_linux_native, is_mac_native, canRunOffline, ...
campos com "exe" / "executable" / "launch" / "binar":   NENHUM
```

O `app_name` de *Borderlands 3* é `Catnip`. É um identificador da Epic, e
**janela nenhuma o anuncia**. O `folder_name` é `AmnesiaRebirth`,
`BioShock2Remastered` — nome de pasta, não de janela.

E as outras portas estão fechadas também:

| por onde se tentaria achar a chave | medido em 09/09/2026 |
| --- | --- |
| o executável no disco | `is_installed: False` nos **35** da Epic. Não há binário |
| um `.desktop` do jogo (o caminho que a Steam usa) | **0** de **216** `.desktop` nas quatro pastas XDG dela — só os dois dos lançadores |
| o `GamesConfig/` do Heroic | dois arquivos, e os dois são `.log` de redistribuível |
| memória do produto sobre janelas já vistas | não existe: o `StateStore` guarda `window_detect_last_class` e `window_detect_current_class`, **um valor cada** |

**Este é o nó, e não a estrada:** para um jogo do Heroic o produto tem o nome e
não tem a chave, e a chave só existe **depois** de o jogo ter aberto uma vez —
que é exatamente o que o botão «Detectar» já faz, com o jogo em foco
(`a10_perfis.detectar`, o ramo «janela», ONDA5-10-01).

### Três coisas que a medição achou de quebra, e são desta sprint

**1. A coluna «Quando usar» diz a MESMA frase em 25 linhas.** No desenho ela
diz *«Jogo da Steam · 1245620»*, *«Jogo · mk1.exe»* — uma frase por linha. No
produto vivo, contado sobre os 26 perfis dela:

```
25x  'Só neste programa'
 1x  'Sempre'
```

`profiles_actions._match_label` traduz todo `MatchCriteria` pela mesma palavra.
Hoje isso já é uma coluna que não informa; com os jogos de outro lançador
entrando, é a coluna que deveria dizer **de onde vem o jogo** e não diz nada.

**2. O censo conta um redistribuível como jogo.** Dos 37, um é
`gog-redist` — *«Galaxy Common Redistributables»*, com `install: {is_dlc:
true}`. São **36** jogos. O lado Steam já filtra essa classe de coisa
(`jogos_locais.e_ferramenta_da_steam` tira 9 dos 33 manifestos); o censo dos
lançadores não tem o equivalente.

**3. O perfil de jogo de fora da Steam perde duas exceções que o da Steam tem.**
Medido com o mesmo perfil «janela» que casa:

```
perfil_e_regra_de_jogo(...)     → False   (exige steam_app_<id>)
perfil_declara_modo_de_jogo(...)→ False   (perfil semeado não tem seção `mode`)
```

A primeira é a exceção que faz um perfil de jogo **furar a trava manual**
(`autoswitch.py:915`): com um ajuste de gatilho feito na mão, o perfil do jogo
da Steam entra e o do Heroic não. A segunda é a exceção do **cadeado**
(`autoswitch.py:532`) — o cadeado está desligado no disco dela hoje
(`autoswitch_locked.flag` não existe), mas **zero** dos seus 26 perfis declara
`mode.kind`, então no dia em que ela ligar o cadeado o perfil do Heroic congela
e o da Steam continua entrando.

### E o espaço da tela, medido

`div.rolo` da `10-perfis.html` publicada, Chrome sem janela, viewport 1600×900:

```
rolo: 383px à vista · 475px de conteúdo · linha 32px · thead 27,5px
→ 11 linhas à vista, e a lista JÁ ROLA com as 14 do desenho
.campos (o editor, à direita): 383px de conteúdo em 383px — sem folga nenhuma
```

Ela tem 26 perfis hoje. Somando os 36 do Heroic, a lista vai a **62 linhas numa
caixa que mostra 11** — e 61 delas dizendo *«Só neste programa»*.

## §3 — A cura, e a decisão dela

O que é mecânico e não precisa dela:

1. **`censo_dos_lancadores` ganha o filtro de redistribuível**, do mesmo feitio
   declarado de `e_ferramenta_da_steam` — lista com dono e com data, nunca
   adivinhação. Corrige 37 para 36 na tela do cartão também;
2. **`jogos_locais` ganha uma segunda origem.** O `JogoLocal` de hoje exige
   `appid` (Steam); a origem nova traz `(lançador, chave nativa, nome)`. O
   `<datalist>` do campo «Nome do Jogo» passa de 23 para **59** ofertas sem
   custar um pixel — ele já filtra enquanto ela digita;
3. **A coluna «Quando usar» passa a dizer a linha do desenho** — *«Heroic ·
   Borderlands 3»*, *«Jogo da Steam · 1245620»* — em vez da mesma palavra 25
   vezes;
4. **`perfil_e_regra_de_jogo` alcança o jogo de fora da Steam.** A forma
   «janela» com UMA classe e sem regex de título é tão específica quanto a
   `steam_app_<id>`; não alargar aqui é deixar a trava manual apagar o perfil do
   jogo dela por ele não ser da Steam. (O veto R-01 continua fechado: o que ele
   protege é o regex de título solto, e ele fica de fora.)

**O que NÃO é meu decidir, e é uma pergunta só.**

Um jogo do Heroic tem nome e não tem chave até ela abri-lo uma vez. Então uma
linha para ele, antes disso, é uma linha que ainda não reconhece jogo nenhum. As
duas saídas honestas dão telas completamente diferentes — e a diferença é
*quando* ela vai à aba Perfis.

> ### A pergunta
>
> **Você quer ver na aba Perfis os 36 jogos do Heroic desde já — sabendo que
> nenhum deles está instalado —, ou só os que você já abriu pelo menos uma vez?**
>
> **(A) Desde já.** As 36 linhas aparecem na lista com o nome do jogo, e cada
> uma diz o que falta: *«abra uma vez e clique em Detectar»*. Você vê sua
> biblioteca inteira e prepara o que quiser antes de jogar.
> *Custo medido:* a lista vai de 26 para 62 linhas numa caixa que mostra 11, e
> **36 delas são de jogos que não estão no seu disco** (`0 instalados`).
>
> **(B) Depois de abrir.** Você joga Borderlands 3 pelo Heroic; o Hefesto vê uma
> janela que não conhece e a aba Perfis pergunta: *«vi `borderlands3.exe` — que
> jogo é este?»*, com a sua biblioteca do Heroic na lista. Você escolhe, e a
> linha nasce com a chave de verdade, já funcionando.
> *Custo medido:* o produto não guarda memória de janela nenhuma hoje (só o
> último valor); é preciso uma lista pequena de *«janelas que vi e não
> reconheci»*. E ele **pergunta**, nunca adivinha — casar `borderlands3.exe` com
> *Borderlands 3* por parecença é a mesma aposta da máscara «Automático», que
> errou em 13 dos 14 jogos e você mandou sair.
>
> **(C) Nenhuma linha nova.** Os jogos dos cinco lançadores entram só na lista
> de sugestão do campo «Nome do Jogo» (de 23 para 59), e a linha nasce quando
> você criar. A lista de perfis não cresce sozinha.
>
> **Minha recomendação: (B), com o (C) junto** — o (C) é a metade que não custa
> nada e já resolve *"como eu acho o jogo"*; o (B) é o que faz a linha nascer
> **funcionando**, que é a diferença entre um perfil e um perfil que nunca
> entra. O (A) enche a tela com 36 linhas que não reconhecem nada e cujos jogos
> você não tem instalados — e a linha que não funciona é o defeito R-12, que
> esta casa já pagou uma vez.

**Se a resposta for (A) ou (B), a lista passa dos 11 que a caixa mostra.** Aí
nasce uma segunda pergunta, e ela é de desenho: a lista se agrupa por lançador
(*Steam 23 · Heroic 36*) ou ganha um campo de busca? Não a faço agora — ela só
faz sentido depois de a primeira estar decidida.

## §4 — O que MORDE

* **arrancar o filtro de redistribuível** → a régua reprova: o cartão do Heroic
  volta a dizer 37 e a lista traz *«Galaxy Common Redistributables»* como jogo;
* **arrancar a segunda origem do catálogo** → o `<datalist>` volta a 23
  `<option>` e a régua conta 59;
* **arrancar a linha nova da coluna «Quando usar»** → a régua reprova ao contar
  frases DISTINTAS entre os perfis de jogo: com a cura arrancada há **1**
  frase para 25 linhas, e a régua exige uma por origem;
* **arrancar o alargamento do `perfil_e_regra_de_jogo`** → a régua reprova: com
  a trava manual armada e a janela `borderlands3.exe` em foco, o perfil do jogo
  NÃO entra, e o mesmo ensaio com `steam_app_1971870` entra;
* **arrancar a memória de janelas não reconhecidas** (se ela escolher (B)) → a
  aba não oferece nada depois de a janela ter aparecido e sumido;
* **a régua da lista tem de rodar com a biblioteca DELA e com um lar de
  mentira.** O `censo_dos_lancadores` já aceita `lar=`; nenhuma régua desta
  sprint pode depender de a máquina ter Heroic instalado.

**E a mordida que esta sprint não pode dispensar:** a linha nova tem de ser
provada com o jogo ABERTO, na tela, pelo piloto com `--oculta`. Uma lista de
jogos que ninguém clicou é a mesma classe de defeito que o `--prova-gesto` que
dava verde sobre dois botões mortos.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| | |
| --- | --- |
| **cabo** | não se aplica ao que a lista MOSTRA — a origem do jogo não muda com o transporte. Vale na hora de ATIVAR: pronto = o perfil do jogo do Heroic entra com o controle no cabo, e o que ele guarda (gatilho, luz, vibração) chega ao aparelho |
| **BT** | o mesmo pelo rádio, e o ensaio é o que separa esta linha da de cima: o perfil entra pela janela, que é igual nos dois — se algo divergir, a causa é do transporte e não desta sprint, e a linha do caderno diz qual |
| **no perfil** | ✓ é o assunto inteiro. `match` na forma «janela» para os cinco lançadores, `steam_app_<id>` para a Steam — **o MESMO campo**, nunca um campo novo. Perfil velho carrega igual; perfil de jogo do Heroic tem de sobreviver a um Salvar sem perder a classe da janela |
| **por controle** | ✓ herdado, e não há nada a fazer: o perfil de jogo guarda `controllers[<uniq>]` como qualquer outro. Pronto = P1 e P2 com ajuste próprio dentro do perfil de um jogo do Heroic, os dois ao mesmo tempo |

**Por que `bancada: true`:** as duas primeiras linhas exigem ela abrir um jogo
de outro lançador com o controle na mão — e hoje **ela não tem nenhum
instalado** (`0` dos 35 da Epic). O passo dela é instalar um jogo do Heroic e
abri-lo uma vez; sem isso a chave não existe e a sprint não fecha, por mais
verde que a suíte esteja.
