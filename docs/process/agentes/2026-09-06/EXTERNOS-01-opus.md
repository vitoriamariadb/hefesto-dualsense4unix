# EXTERNOS-01 — o Nintendo Pro e o 8BitDo nos cards e na lista

**06/09/2026 · branch `voo/EXTERNOS-01-opus` · nasceu de `onda/atual-0609` (`39fa440d`)**

As duas linhas que a sprint promete fechar diziam a mesma coisa por dois lados:

| CSV | o que dizia |
| --- | --- |
| `paridade-gtk-html.csv:16` (01-jogar) | *"com dois DualSense e um 8BitDo na mesa a aba dizia '2 controles' ao lado de três cards noutra tela"* |
| `paridade-gtk-html.csv:305` (08-conexoes) | *"uma aba chamada Conexões que não lista metade dos controles conectados"* |

E o `porque` das duas era **um grep**: *"não é ausência de dado —
`controller.list {external:true}` responde; **ninguém pergunta**"*. Esta sprint
faz alguém perguntar.

---

## O que mudou

### 1. O contexto ganhou um campo PRÓPRIO — e a rota da sprint diz por quê

`pacotes.Contexto` tem agora `externos: list[dict]`, **nunca dentro de
`conectados`**. Os três campos que já existiam são os ASSENTOS: quem tem `pref`
(`p1`..`p4`), quem o co-op numerou, quem a fita escolhe como alvo de edição. Um
externo não tem nada disso — o Hefesto não o adota, não lhe monta vpad e não
escreve nele. Somá-lo a `conectados` custaria **três defeitos por uma lista só**:
o cabeçalho contando jogador que não existe, a fita oferecendo um alvo que nenhum
gesto alcança, e `apagar_os_lugares_sem_dono` disputando um cartão que não é dele.

### 2. O piloto passou a perguntar — no tique LENTO, em thread, com teto próprio

`hefesto_vivo._talvez_ler_os_externos()`, chamado de `_contexto()`. **Os dois
números são os da janela antiga, e não escolhas minhas:**

| | valor | de onde |
| --- | --- | --- |
| entre leituras | 4,0 s | `HomeActionsMixin.EXTERNOS_THROTTLE_S` |
| espera pela resposta | 3,0 s | o `timeout_s` de `_maybe_fetch_externos` |

Eles são **atributos de classe do `Piloto`**, e não constantes de módulo ao lado
do `TIQUE_MS` — ver a armadilha nº 2 abaixo. A forma passou a ser a MESMA do dono
na janela antiga, que também os guarda como atributo de classe.

**Por que não no tique**, e o custo está medido no dono
(`ipc_handlers._handle_controller_list`): a enumeração de `/dev/input` mais a
sonda de holders custa **10-40 ms e um subprocess** — foi por isso que o daemon a
deixou fora do `state_full` e atrás de um opt-in. Num orçamento de 100 ms,
pedi-la a cada tique comeria até 40% do laço para receber a mesma resposta.

**Três guardas, e cada uma fecha um defeito que a GTK já pagou:** uma pergunta de
cada vez; o teto de tempo; e **o relógio anda ANTES da thread sair** — uma chamada
que nunca responde deixaria a bandeira levantada para sempre, e a lista
congelaria calada.

**E a resposta ruim NÃO apaga a boa.** `ponte.resultado` levanta quando o daemon
não atende; um `except` que zerasse a lista transformaria *"não consegui
perguntar"* em *"não há controle nenhum"* — a *ausência de notícia lida como
sucesso*. Quem mastiga o payload é o DONO, `home_actions.externos_na_mesa`.

### 3. As duas abas desenham — e nenhuma palavra nova entra na tela

`a01_jogar._html_dos_externos` (cartões) e `a08_conexoes._html_dos_externos`
(linhas). **As três frases têm dono na janela antiga**, e é por passarem pelo
mesmo dono que as duas abas não podem discordar sobre o mesmo aparelho:

- `home_actions._format_external_title` — *"Controle 3 — 8BitDo"*. O número é o
  **slot global de co-op**, o mesmo que o Hefesto escreve no LED de player do
  aparelho; a marca vem de `external_controllers.brand_of`, a única função da
  casa que desmente o VID mentido por um clone em modo DualShock4 (o OUI do MAC
  vence, e é o único sinal que os separa);
- `home_actions._format_external_subtitle` — *"rádio · o Hefesto só vê"*, com a
  palavra do transporte saindo de `palavra_do_transporte` (o §2 do "o que se mede
  antes de escrever" desta sprint);
- `external_controllers.nintendo_bt_warning` — a armadilha do `hid-nintendo`, só
  no VID Nintendo E por rádio. Ela **não acusa o Hefesto nem promete cura**: a
  morte é do driver do kernel, e a saída estável é o cabo.

**O cartão do externo não tem cor de plástico nem bateria.** A folha das 28 cores
é dos DualSense — um 8BitDo não tem linha nela —, e o daemon não lê a carga dele.
Campo sem informação não mostra nada. **E não usa a classe `.cartao`**: reusá-la
daria ao externo `data-controle`, o alvo de edição da fita e uma vaga em
`apagar_os_lugares_sem_dono` — três significados brigando no mesmo pixel, que é o
erro que o `marcador-principal` já pagou nesta aba.

### 4. O endereço nasceu na BANCADA, e a cena que ela aprovou não muda um pixel

`aba01.py` e `aba08.py` emitem **um `monta.ressalva` cada** — `externos` e
`externos-lista`. A peça é a da D-02 dela, e por isso não escrevi nenhuma regra de
estado vazio: `.ressalva:empty` e `.ressalva:has(.nada)` já estão no esqueleto
compartilhado. **Em repouso a seção mede ZERO**, que é o estado desta bancada e o
desta máquina hoje.

**UM endereço, e não o par `pendente`/`pendente-ha`.** Um segundo endereço para
"existe?" reescreveria em Python o que duas regras de CSS já respondem.

`interface/paginas/` é `nao_toca:`, então o produto que ela abre **ainda não
recebeu**: o pacote emite, o `querySelector` cai no vazio, e nada regride
enquanto ela não publicar. É o mesmo desenho do precedente já declarado em
`mockup/DIVERGENCIAS.md` para esta mesma aba.

### 5. Os dois geradores conferem NA SAÍDA, e nos dois sentidos

O endereço tem de existir **e** nenhum aparelho de exemplo pode nascer dentro
dele — um card cravado no desenho afirmaria um 8BitDo na mesa dela que ninguém
mediu.

---

## Qual mordida prova

`tests/unit/test_a_interface_ve_os_controles_que_o_hefesto_so_ve.py` — **21
testes**, com dublê do `controller.list` que **sabe recusar**. Saída da cura no
lugar:

```
..................... [100%]
21 passed in 0.68s
```

### A primeira régua PASSOU com a cura arrancada — e foi o passo 2 que a pegou

Escrevi dezenove testes, rodei os oito arrancamentos, e a **mordida 1 passou**:

```
=== MORDIDA 1 — o piloto não pergunta (`_talvez_ler_os_externos()` comentado) ===
................... [100%]
19 passed in 0.58s
```

A causa é a que o `COMO-EXECUTAR-UMA-SPRINT.md` §9 já nomeia. As dezenove provas
mediam `_talvez_ler_os_externos` de um lado e os pacotes do outro, com um
`Contexto` montado **à mão** no meio — **o FIO não era tocado por nenhuma**.
Bastava `_contexto` não chamar a leitura, ou montá-lo com `externos=[]`, para a
tela voltar a não ver externo nenhum com dezenove testes verdes.

Duas provas novas cobrem o fio (`test_o_contexto_do_tique_carrega_os_externos_lidos`
e `test_o_tique_pergunta_sozinho_pelos_externos`), e o dublê do piloto passou a
**emprestar o método real** em vez de reescrevê-lo — *o dublê mais frouxo que a
função real* é a outra armadilha da mesma lista.

### As DOZE mordidas, depois da correção

| # | o que arranquei | quem reprovou |
| --- | --- | --- |
| 1 | `_contexto` para de chamar a leitura | `test_o_tique_pergunta_sozinho_pelos_externos` |
| 2 | o `Contexto` nasce com `externos=[]` | `test_o_contexto_do_tique_carrega_os_externos_lidos` |
| 3 | a leitura que FALHOU zera a lista | `test_o_daemon_mudo_nao_apaga_a_lista_boa` |
| 4 | some o teto entre leituras | `test_o_piloto_nao_repete_a_pergunta_dentro_do_teto` |
| 5 | a aba 01 emite `""` | 4 testes |
| 6 | a aba 08 devolve `""` sempre | 2 testes |
| 7 | o aviso do `hid-nintendo` cai | `test_a_jogar_avisa_a_armadilha_do_driver_so_no_nintendo` |
| 8 | o campo `externos` some do `Contexto` | 13 testes |
| 9 | o endereço some da bancada da 01 | `test_as_duas_paginas_da_bancada_tem_onde_escrever` |
| 10 | o endereço some da bancada da 08 | a mesma |
| 11 | `aba01.py` para de emitir o container | o `_conferir` do gerador, `rc=1` |
| 12 | `aba08.py` para de emitir a lista | o `_conferir` do gerador, `rc=1` |

As saídas cruas estão em `/tmp/mordidas.txt`, `/tmp/mordidas2.txt` e
`/tmp/mordidas3.txt`.

### E uma régua minha nasceu falsa, e reprovou o próprio remédio

O `_conferir` da `aba08` cobrava `"ext-linha" not in _HTML` — e `_HTML` é o
documento **inteiro**, `<style>` incluído: a régua reprovou a própria regra de
CSS que faz a linha existir. É a armadilha do `COMO-OLHAR-A-TELA.md` (*"régua que
casa um token em QUALQUER lugar do texto"*). As duas passaram a casar a
marcação (`class="ext-linha"`).

### As DUAS armadilhas do dia, e as duas foram achadas por PORTÃO

**1. Eu apontei para a janela que está saindo.** Precisei de um escapador de HTML
e importei `gui.aba_conexoes._e` — que é uma linha de
`html.escape(str(x), quote=True)`. O portão `nada-aponta-para-a-janela` reprovou:
`D-0609-GTK-LEVA-INTEIRA`, **o motor é que se reusa, não a janela**, e aquela
lista só diminui. Curado com o `html.escape` da biblioteca. *A tentação é real e
vai se repetir: quem precisar de um utilitário de UMA LINHA vai achá-lo primeiro
na janela antiga, porque é lá que ele já está escrito.*

**2. Duas constantes no TOPO de um arquivo quebram os comentários de quatro
outros.** Pus os dois tetos ao lado do `TIQUE_MS` — o lugar óbvio — e isso
empurrou ~20 linhas para baixo. O portão `citacoes-no-codigo` reprovou nomeando
QUATRO arquivos de outras posses que citam `hefesto_vivo.py:NNN` em comentário:
`aba02.py:886`, `a02_controles.py:1519`, `a10_perfis.py:1279`, `rodape.py:75`.

**A cura foi mover o meu, não reescrever os deles**, e é o §2 do protocolo:
os tetos viraram atributos de classe do `Piloto` (linha 2155, depois de toda
âncora citada), e o primeiro byte que meu diff toca em `hefesto_vivo.py` passou de
115 para **2126**. Medido:

```
$ diff <(git show HEAD:…/hefesto_vivo.py) …/hefesto_vivo.py | grep -E '^[0-9]'
2126a2127,2157      ← os tetos, agora dentro da classe
2272a2304,2314      ← o estado no __init__
2907a2950,2954      ← a chamada no _contexto
```

E o lugar novo é melhor por si: as constantes ficam coladas no único método que
as lê, na mesma forma do dono na GTK.

---

## O que NÃO verifiquei

**NÃO HOUVE APARELHO. Nenhuma linha desta entrega é prova de aparelho.**
`/sys/bus/hid/devices` em 06/09, leitura crua e sem tocar no daemon dela:

```
0003:054C:0CE6.0009   ← DualSense
0003:054C:0DF2.0006   ← DualSense Edge
0003:25A7:FA07…FA08 · 0003:3554:FA09   ← receptores de teclado/mouse
```

**Não havia Nintendo Pro nem 8BitDo na mesa.** A bancada estava LIVRE e eu **não
a reservei**: sem o aparelho não há o que medir nela, e reservar um recurso dela
para não usá-lo é pior que não reservar. **A prova de aparelho fica inteira para a
`MESA-DE-QUATRO-01`**, como o preâmbulo manda (`D-0609-A-BANCADA-PROVA-NAO-BLOQUEIA`).

O que isso deixa NÃO verificado, nomeado:

1. **o payload real de um externo**. Os dois dublês (`UM_8BITDO`, `UM_PRO`) têm a
   forma que `ipc_handlers._handle_controller_list` publica, lida no fonte — não
   a que um aparelho na mesa produziria. Se o daemon publicar uma chave a menos, o
   cartão mostra travessão e nenhuma régua minha acusa;
2. **o slot que o daemon numera**. `player_slot` vem cravado nos dublês; o
   `external_registry` real pode responder `None` nos primeiros segundos do boot,
   e aí o rótulo cai no ramo sem número de `slot_of`/`slot_label` (NUMA-05) — que
   está escrito no dono e **não foi exercido por mim**;
3. **o efeito colateral da leitura no APARELHO.** `external_identity.py:4` diz que
   `controller.list {external:true}` acende LEDs como efeito colateral de TODA
   leitura. O piloto agora faz essa leitura **a cada 4 s enquanto a janela
   estiver aberta**. Não medi o que isso faz num Pro na mesa — e é a primeira
   coisa a olhar na bancada;
4. **a tela**. Não abri o piloto: sem externo na mesa a seção mede zero, e uma
   foto de uma seção invisível não prova nada. Também não há como VER isto na
   página publicada — o endereço está na bancada, e publicar é ato dela;
5. **o custo do tique com a leitura ligada.** A escolha (thread + cache) é a que
   torna o custo estruturalmente zero no laço, mas não rodei `--passear` para
   publicar a mediana com ela ligada.

**Nenhuma célula do mapa de canais avançou de degrau por mim.** As cinco que este
trabalho toca já estavam em `MONTOU`, e é em `MONTOU` que continuam — construí e
medi o CAMINHO, não o aparelho.

---

## O que sobrou para o próximo

1. **PUBLICAR — e é ato dela.** Os dois endereços vivem em `mockup/`;
   `interface/paginas/` é `nao_toca:` desta sprint. Até ela aprovar, a aba Jogar e
   a Conexões dela continuam sem ver externo nenhum. As duas abas **já estão
   declaradas** em `mockup/DIVERGENCIAS.md` (o portão `desenho-aprovado` está
   verde), mas **não acrescentei o bullet dos dois endereços novos** porque o
   arquivo não está na minha `posse:` e o protocolo manda relatar, não editar.
   **É o primeiro item de quem costurar.**

2. **DOIS ARQUIVOS EDITADOS FORA DA `posse:`, e os dois por exigência de PORTÃO** —
   digo os dois em alto e bom som, porque um deles está em `nao_toca:`:

   | arquivo | quem cobrou | o que fiz |
   | --- | --- | --- |
   | `docs/data/paridade-gtk-html.csv` (**`nao_toca:`**) | `paridade-gtk-html` · `divida-fechada` nas linhas 16 e 305 | reescrevi **só essas duas**, que são as que a sprint promete fechar |
   | `docs/data/donos-de-comportamento.csv:41` | `donos-de-comportamento` · *"marcado SO-GTK, mas a tela nova já chama `externos_na_mesa` — reclassifique"* | `SO-GTK` → `CURADO` |
   | `docs/process/2026-09-03-O-TERCEIRO-NUMERO…md` | `numero-publicado` | as três linhas da tabela (01-jogar, 08-conexoes, TODAS) |

   **A regra do `nao_toca:` e o portão colidiram, e escolhi o portão** porque a
   régua diz literalmente o contrário de contornar: *"Se a dívida fechou, o
   veredito desta linha mudou: meça-a de novo e reescreva-a. (…) nunca afrouxando
   a regra aqui."* A saída alternativa era apagar `hid-nintendo` e
   `_format_external_title` dos meus comentários até a régua calar — e aí o
   produto teria a feature e o CSV diria `FALTA`, que é a mentira que essa
   planilha existe para matar. **Se a costura discordar, o conflito é nessas duas
   linhas e em mais nenhuma.**

3. **O veredito das duas linhas é `DIFERENTE`, e não `IGUAL`** — a diferença é
   medida e está escrita nas duas: a GTK põe o card no MESMO frame dos adotados
   e desenha um CARD na Conexões; aqui é um bloco à parte e uma LINHA fora do
   acordeão `.gc`, pelas razões estruturais do §3 acima. **Fechar para `IGUAL`
   é decisão de desenho, e é dela.**

4. **O SINAL da linha 305 mudou de `hid-nintendo` para `nintendo_bt_warning`**, e é
   um aperto: `hid-nintendo` é nome de driver que casa em **prosa** — um
   comentário meu bastou para a régua dar por fechada uma dívida que ainda estava
   viva. `nintendo_bt_warning` é a **função que o pacote chama**: a régua passa a
   medir o ato.

5. **O efeito colateral nos LEDs (§3 do "não verifiquei") é a pergunta mais séria
   que deixo em aberto.** A janela antiga faz a mesma leitura a cada 4 s e ninguém
   reclamou, o que é evidência boa — mas é evidência de que **ninguém olhou**, não
   de que não acontece. Quem tiver um Pro na mesa: abra o piloto e olhe o LED.

6. **DUAS CITAÇÕES DE OUTRAS POSSES JÁ APONTAVAM PARA O LUGAR ERRADO, e o
   portão não vê.** Achado ao investigar a armadilha nº 2, medido contra o
   `HEAD` — **não é dano meu, é anterior**:

   | quem cita | o que promete | o que havia em `hefesto_vivo.py` naquela linha, ANTES de eu tocar |
   | --- | --- | --- |
   | `a02_controles.py:1519` → `:245` | *"`escrever()` troca vazio por travessão para TODOS os alvos"* | `` #: (`interface/ds_limpo.svg:2`), e ali o valor é o MODELO do aparelho `` |
   | `a10_perfis.py:1279` → `:2117` | *"os gestos rodam em thread"* | `da URI e não de um estado que o piloto guarde` |

   `aba02.py:886` cita o mesmo `:245`. **O portão `citacoes-no-codigo` só reprova
   âncora em linha EM BRANCO** — uma âncora que caiu numa linha qualquer, mas
   não-vazia, passa verde. É a família *régua que dá verde sobre nada* desta casa,
   e ela cobre 4 endereços que eu vi; não contei o resto. **Não corrigi**: os
   arquivos são de outras posses e o dano não é meu (§2 do protocolo). Quem for
   dono deles tem os endereços certos acima — o travessão para todos os alvos está
   hoje em `hefesto_vivo.py:466`/`:515`, e o gesto em thread em `:2459`.

7. **A linha 306 do CSV JÁ ESTAVA `IGUAL`** — ver "o que caiu da sprint".

---

## O que caiu da sprint

**Uma linha do enunciado caiu, e o CSV foi quem a derrubou.** A tabela "O que
fecha" da sprint lista TRÊS linhas; a terceira já estava fechada:

| aba | linha | o que o CSV diz hoje |
| --- | --- | --- |
| 08-conexoes | Aviso *"controle ligado que o sistema não entregou ao Hefesto"* | **`paridade-gtk-html.csv:306` já é `IGUAL`** — o sinal é `texto_de_controle_nao_adotado`, e a ressalva `sem-driver` está na página desde 06/09 (`aba08.py`, `monta_ressalva("sem-driver")`), com a frase vindo de `status_actions`. |

Não toquei nela. Fechá-la de novo seria refazer trabalho pago, e mexer numa linha
`IGUAL` para "confirmar" é como uma régua desta casa vira ruído.

**E uma afirmação da ROTA CORRIGIDA envelheceu entre a escrita e a execução** —
ela mesma avisava (*"a ONDA5-P-01 mexeu no `hefesto_vivo.py` hoje: leia o arquivo
de hoje antes de acreditar num endereço"*):

| a rota dizia | o disco de hoje |
| --- | --- |
| `hefesto_vivo.py:2894-2910` monta o `Contexto` | é **`:2892-2911`** (`_contexto`), e o `Contexto(…)` está em `:2910` |
| `pacotes/__init__.py:86` é onde entra o campo | `:86` é o `conectados`; o campo novo entrou em **`:88`**, depois do `estados` |

Os dois são deslocamento de linha, não erro de rota: o caminho que ela descreve é
o que eu segui, e o campo próprio (*"nunca dentro de `controllers`"*) era a
instrução certa — ver o §1 de "O que mudou".

**Nada mais do enunciado caiu.** O mapa de canais não vetou passo nenhum: as
cinco células que este trabalho toca (`plataforma.inventario@pro`,
`plataforma.inventario@sn30`, `plataforma.slot_jogador@pro`,
`plataforma.slot_jogador@sn30`, `plataforma.distinguir_clone@sn30`) dizem
`aciona=sim` no cabo e no rádio, e todas em `MONTOU` — e **em `MONTOU` continuam**,
porque não houve aparelho.
