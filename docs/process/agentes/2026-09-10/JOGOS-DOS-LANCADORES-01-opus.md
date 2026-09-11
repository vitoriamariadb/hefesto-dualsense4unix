# JOGOS-DOS-LANCADORES-01 — os jogos dos lançadores chegam ao campo do jogo

| | |
| --- | --- |
| **árvore** | `hefesto-voo/JOGOS-DOS-LANCADORES-01-opus`, branch `voo/JOGOS-DOS-LANCADORES-01-opus`, nascida de `dev` em `315d912b` |
| **portões** | `bash scripts/portoes.sh` — **54 de 56 verdes**. Os DOIS vermelhos são HERDADOS de `dev` e não são meus: ver «O vermelho que veio de `dev`», abaixo |
| **bancada** | LIVRE, e **não foi reservada**: nada aqui para o daemon, escreve no aparelho ou chama `systemctl`. A leitura da biblioteca dela foi *read-only*; a prova de tela rodou em lar de mentira |
| **a tela dela** | nenhuma janela nasceu nela — piloto sempre `--oculta`, `Gtk.OffscreenWindow` |

---

## O que mudou

**A sprint começou medindo de novo, como o topo dela mandava — e a premissa caiu.**

Ela deixou um jogo baixando (*"deixei baixando um jogo já"*). <!-- noqa-acento: citação literal dela -->
Medido no disco dela em 10/09/2026, com o jogo instalado:

| a sprint dizia (09/09) | o disco diz (10/09) |
| --- | --- |
| *"campos com `exe`/`executable`/`launch`/`binar`: **NENHUM**"* | `install.executable = "retail/gotg.exe"`, no próprio `legendary_library.json` |
| *"`is_installed: False` nos 35 da Epic"* | **1 instalado** — `Marvel's Guardians of the Galaxy`, e o binário está em `~/Games/Heroic/MarvelGOTG/retail/gotg.exe` |
| *"dos 37, um é `gog-redist` … São **36** jogos"* | **8** acessórios (7 DLC da Epic + o `gog-redist`), e sobram **29** |
| *"Lutris · RetroArch · Dolphin · mGBA: `nunca_aberto` nos quatro"* | os quatro têm pasta. RetroArch: **7 ROMs**; Dolphin: 1 pasta de ISOs; Lutris e mGBA vazios |
| *"o `GamesConfig/` do Heroic: dois arquivos, e os dois são `.log`"* | nasceu o `63a665…json` do jogo instalado |

**A chave que a §2 dizia não existir EXISTE**, e é o basename do executável:
`gotg.exe` — a mesma forma que o `MatchCriteria(window_class=[…])` guarda, e a
mesma que o botão «Detectar» grava. **Ela existe antes de ela abrir o jogo uma
vez, desde que o jogo esteja instalado.**

### As quatro curas, todas dentro da `posse:`

**1. `censo_dos_lancadores` — o acessório sai, e o filtro é um CAMPO declarado.**
`install.is_dlc` já vem na biblioteca, nas duas lojas: os sete DLC da Epic e o
*Galaxy Common Redistributables* da GOG têm `is_dlc: true`. Não há lista de
nomes a manter — que é a diferença desta régua para a
`jogos_locais.e_ferramenta_da_steam`, onde campo não existe. O cartão da aba
Lançadores passa de **37 jogos · 2 instalados** para **29 jogos · 1 instalado**.

**2. `censo_dos_lancadores` — a CHAVE.** `JogoDoLancador` ganha `executavel`,
`dlc` e a propriedade `classe_de_janela` (o basename). `jogos_com_chave_de_janela`
devolve só quem tem endereço, e `assinatura_das_bibliotecas` é o freio barato
da releitura — **separado** de `assinatura_da_biblioteca`, que é da Steam: somar
os dois faria a semeadura varrer 33 `.acf` toda vez que o Heroic escrevesse um log.

**3. `jogos_locais` — a segunda origem.** `JogoLocal` ganha `lancador` e `chave`
(com default, então nada de fora quebrou), mais `valor` e `forma`. Nasce
`jogos_dos_lancadores()` e `ofertas_do_campo_do_jogo()`. **`catalogo_de_jogos`
NÃO foi alargado**, e é decisão de contrato: ele promete *"sem appid repetido"*
e `nomes_por_appid` indexa por appid — os jogos de lançador colapsariam numa
entrada de chave vazia, e a mudança vazaria para `profiles_actions`, que não é
desta sprint.

**4. `a10_perfis` — o `<datalist>`, o rótulo, e o defeito que o clique revelou.**
O campo «Nome do Jogo» passa a oferecer as duas origens; o rótulo ao lado
responde com o nome do jogo de lançador (a quinta resposta de
`frase_do_campo_do_jogo`); e a queda de `editor_jogo` ganhou a terceira perna —
ver a mordida 6, que é o achado do dia.

### O que a §3 propunha e NÃO foi feito, com o motivo

* **os 36 do Heroic no campo** — viraram **1**. A oferta é de quem tem chave.
  Uma linha sem endereço é uma linha que nunca reconhece jogo nenhum: o R-12
  que a própria §3 manda não repetir. Os 28 restantes continuam CONTANDO na
  biblioteca (o cartão diz os dois números) e entram na oferta no dia em que
  ela os baixar, sem ninguém mexer em código;
* **os três emuladores não ganham linha por ROM.** RetroArch, Dolphin e mGBA
  são **um processo para todas** — a janela é a do emulador. Sete perfis
  mirando `240pSuite.sfc` seriam sete regras que nunca casam.

---

## Qual mordida prova

`tests/unit/test_os_jogos_dos_lancadores_chegam_ao_campo.py` — **14 casos**,
todos com lar de mentira (`lar=tmp_path`); nenhum lê a biblioteca dela.
Conferido por sonda dentro da suíte: sob o `pytest` o `HOME` desviado **não tem
`.var`**, então o Heroic sai `nunca_aberto` — a §4 da sprint exige isso, e aqui
está medido em vez de prometido.

Cada linha abaixo foi arrancada, rodada, e devolvida.

| # | cura arrancada | o que reprovou |
| --- | --- | --- |
| 1 | `if jogo.e_acessorio: continue` em `_heroic` | `test_o_dlc_e_o_redistribuivel_saem_da_contagem` · `test_o_redistribuivel_da_gog_cai_pela_mesma_regua` |
| 2 | o basename em `classe_de_janela` (devolver `retail/gotg.exe` inteiro) | 3 casos, entre eles `test_a_chave_de_janela_e_o_basename_do_executavel` |
| 3 | `and jogo.classe_de_janela` em `jogos_com_chave_de_janela` | `test_quem_nao_tem_chave_nao_e_oferecido_mesmo_instalado` · `test_o_emulador_nao_finge_ter_uma_janela_por_rom` |
| 4 | a segunda origem em `_html_dos_jogos` | `test_a_lista_da_aba_traz_as_duas_origens` |
| 5 | o ramo `do_lancador` em `frase_do_campo_do_jogo` | `test_o_rotulo_diz_o_nome_do_jogo_do_lancador` |
| 6 | a terceira perna de `_forma_do_que_ela_escolheu` | `test_a_forma_da_regra_segue_a_oferta_e_nao_o_formato_do_texto` |

Com as seis no lugar: `14 passed`. E as réguas vizinhas continuam verdes —
`test_o_censo_dos_lancadores_le_a_biblioteca` ·
`test_a_lista_de_jogos_desta_maquina_oferece_sem_recusar` ·
`test_a_aba_lancadores_diz_a_verdade` · `test_o_perfil_chega_na_tela`:
**108 passed**.

### E a mordida na TELA, que é a que fecha a entrega

Piloto `--oculta`, WebKitGTK, daemon vivo, num `HOME` de mentira com a
biblioteca do Heroic plantada com a forma EXATA do disco dela. A ponte JS da
casa (`gui/ponte_da_tela.perguntar`) foi chamada pelo gancho que o piloto já
agenda quando a PÁGINA confirma — nenhum instrumento novo no repositório.

**A FOTO** — a aba pintou inteira, sem regressão visual.

**O CLIQUE** — três perguntas ao DOM vivo:

```
ANTES  · {"opcoes":1,"campo_consulta":"jogos-desta-maquina","campo_livre":"text",
          "de_lancador":[["gotg.exe","Marvel's Guardians of the Galaxy (Heroic)"]]}
CLIQUE · escolhi gotg.exe no campo
DEPOIS · {"campo":"gotg.exe","rotulo":"Marvel's Guardians of the Galaxy"}
```

E o perfil que o clique gravou no disco:

```json
"match": {"type": "criteria", "window_class": ["gotg.exe"], "process_name": []}
```

**O MESMO CAMPO da Steam**, que é o critério de pronto *"no perfil"* da sprint.

**A MORDIDA NA TELA, duas vezes:**

```
arrancando a segunda origem   ANTES · {"opcoes":0, "de_lancador":[]}
arrancando a terceira perna   o clique grava  "process_name": ["gotg.exe"]
com as duas de volta          "opcoes":1  ·  "window_class": ["gotg.exe"]
```

### O DEFEITO QUE O CLIQUE REVELOU, e ele nasceu com esta sprint

**Na primeira volta na tela, o perfil nasceu com `process_name: ["gotg.exe"]`.**

A queda de `editor_jogo` tinha duas pernas — *appid vira «Jogo da Steam», o
resto vira «Jogo (pelo processo)»* — e ela estava certa **enquanto a lista só
oferecia appid**. Com o `<datalist>` oferecendo uma `wm_class`, o produto passou
a **entregar à mão dela um texto que ele mesmo classificava errado**.
`process_name` é o basename de `/proc/PID/exe`, outro dado, e o próprio
`simple_match` avisa que confundir os dois faz o perfil *"casar por acaso"*.

A terceira perna **pergunta ao catálogo** (`JogoLocal.forma`), e não a um regex:
adivinhar por `.exe` no fim erraria nos dois sentidos — um jogo nativo do Lutris
não termina em `.exe`, e um `process_name` legítimo pode terminar.

*Uma cura que entrega dado novo à tela tem de conferir quem o classifica do
outro lado.* Régua nenhuma via isto; quem viu foi o clique.

### O vermelho que veio de `dev`, e ele NÃO é meu

`bash scripts/portoes.sh` termina com **2 de 56 vermelhos**, os dois pela mesma
linha e no mesmo arquivo:

```
mac-por-oui     tests/unit/test_o_no_do_radio_conta_como_placa.py:26 e :28
                «MAC de hardware REAL com sufixo exposto»
mac-de-fixture  as MESMAS duas linhas — «fora das faixas sintéticas»
```

(os dois valores não são repetidos aqui de propósito: a régua
`saida-de-agente` varre este arquivo, e ela está certa — relatório de agente é
por onde endereço vaza. Quem for consertar lê as duas linhas no arquivo.)

**Medido, e a prova é de uma linha:** o arquivo entrou em `315d912b`, que é
exatamente a base desta árvore, e
`git diff dev -- tests/unit/test_o_no_do_radio_conta_como_placa.py` sai **vazio**
— a cópia daqui é byte a byte a de `dev`. **A árvore nasceu vermelha nestes
dois.** Eu não o toquei, e ele não está na minha `posse:`.

O que o autor quis foi *OUI real + faixa sintética colada atrás*, e as duas
réguas pedem coisas diferentes **de propósito** (é a razão declarada no
`CLAUDE.md` de haver DUAS): a de OUI quer **os octetos 4 e 5 zerados**; a de
fixture quer o token inteiro dentro de uma das faixas da casa (`02:fe`,
`aa:bb:cc`, `e8:47:3a`). Os dois `uniq` são constantes de teste e **não precisam
do OUI real para nada** — reescrevê-los inteiros dentro da faixa `02:fe` fecha
as duas de uma vez. **Não fiz: não é meu arquivo, e outro agente deste lote pode
estar nele agora.**

**Todos os meus vermelhos fecharam**, e dois deles eram achado do portão:

* `casa-sabe` acusou `ofertas_do_campo_do_jogo` **sem chamador em produção** — e
  tinha razão: eu havia escrito a junção duas vezes, uma na função e outra
  dentro de `_html_dos_jogos`. A cura foi a função virar a junção PURA (recebe
  as duas listas) e a aba passar a chamá-la — um dono só, que era o ponto;
* `mypy` pegou `Returning Any` porque o memo dos lançadores estava tipado
  `list[Any]`. Agora é `list[JogoLocal]`, com o import só sob `TYPE_CHECKING`
  para não trazer `integrations/` ao topo de `interface/`.

### E `dev` andou enquanto eu trabalhava

A árvore nasceu em `315d912b` (conferido no Passo 2, igual a `dev` na hora).
Ao fechar, `dev` está em `9d3eb2d3` — duas commits de som à frente
(`21a1853e`, `9d3eb2d3`). **Não rebaseei nem fundi nada**, como o despacho
manda; a costura pega os seis arquivos desta branch, e nenhum deles é tocado
pelas duas commits novas.

---

## O que NÃO verifiquei

* **O aparelho.** Nada nesta entrega toca canal, report id ou offset — **nenhuma
  célula de `docs/data/mapa-controles.csv` foi exercitada**, e o mapa não tem
  linha para lista de perfil. As duas primeiras linhas do critério de pronto
  (cabo e BT) exigem ela **abrir o jogo com o controle na mão**, e isso é a
  bancada dela: ficam para a MESA-DE-QUATRO-01, com a chave já pronta.
* **O jogo abrindo de verdade.** Não abri *Marvel's Guardians of the Galaxy* —
  são 82 GB, ela está usando a máquina, e o daemon vivo é dela. **Portanto a
  `wm_class` `gotg.exe` é a que o cadastro do legendary declara, e não a que a
  janela anunciou.** É a hipótese mais forte disponível (é o que o Proton
  anuncia para o basename do binário, e é a forma que o «Detectar» grava), mas
  **não é medição**. Quem a confirma é ela, com o jogo aberto e o «Detectar».
* **A coluna «Quando usar».** O item 3 da §3 mora em
  `app/actions/profiles_actions.py` (`_match_label`/`rotulo_quando_usar`) e em
  `app/actions/perfis_web.py` — **nenhum dos dois está na minha `posse:`**. Não
  toquei. Ver abaixo.
* **`perfil_e_regra_de_jogo`.** O item 4 da §3 mora em `profiles/schema.py` —
  também fora da `posse:`. Não toquei.
* **`loader.py` e `aba10.py`**, que são meus e ficaram intactos: o primeiro
  porque semear linha nova é a decisão (A)/(B) **dela**; o segundo porque o
  desenho já diz a linha certa e não havia o que mudar.
* **A suíte inteira.** Rodei o meu escopo (5 arquivos, 108 casos). A suíte é de
  quem coordena.

---

## O que sobrou para o próximo

1. **A PERGUNTA DA §3 CONTINUA DELA, e a medição de hoje MUDA as opções.** A
   (A) e a (B) nasciam de *"nenhum está instalado, e a chave só existe depois
   de abrir"*. Com um jogo instalado, **a chave existe sem ela abrir nada** — a
   linha do Heroic pode nascer FUNCIONANDO, como a da Steam. A pergunta que
   sobra é mais simples e é só dela: *a lista de perfis deve ganhar sozinha uma
   linha por jogo INSTALADO de outro lançador (hoje: 1), ou só quando você
   criar?* O que esta entrega fez é o **(C)**, que ela já tem e não cria linha
   nenhuma.
2. **A coluna «Quando usar» diz a mesma frase em todas as linhas de jogo** —
   medido, e o dono é `profiles_actions.rotulo_quando_usar`, fora da minha
   posse. O desenho já escreve a linha certa
   (`«Jogo da Steam · 1245620»`, `«Jogo · mk1.exe»`), e agora há de onde tirar
   a origem: `JogoLocal.lancador`. **Sprint própria, com posse em
   `profiles_actions.py` + `perfis_web.py`.**
3. **`perfil_e_regra_de_jogo` continua exigindo `steam_app_<id>`** — com a trava
   manual armada, o perfil do jogo do Heroic não entra e o da Steam entra. Dono:
   `profiles/schema.py`. **Fora da minha posse; relatado, não editado.**
4. **O `QUANDO` de `a10_perfis.py:203` é código morto** — o dicionário existe e
   ninguém o lê; quem manda é `perfis_web`. Deixei como está (apagá-lo é da
   sprint que arrumar o item 2), mas fica anotado: é um segundo dono adormecido
   do vocabulário da coluna.
5. **O Lutris não entrega executável hoje** porque a pasta `games/` dela está
   vazia. O `.yml` de um jogo do Lutris traz `game: exe:`, e ler isso pede
   `pyyaml` — que o `pyproject` não declara. Quando ela instalar um jogo pelo
   Lutris, é a hora de decidir a dependência com a razão escrita, como o próprio
   `_lutris` já diz.
6. **`SPRINT_ORDER` / mapa:** nenhuma célula do mapa de canais foi tocada ou
   medida — não há nada para a SPECS-A-PROCEDENCIA-01 marcar desta sprint.
7. **Os dois vermelhos de MAC em `tests/unit/test_o_no_do_radio_conta_como_placa.py`**
   são de quem fechou o som (`315d912b`), estão vivos em `dev` agora, e o
   conserto é de uma linha cada. Ver a seção acima.
