# STEAM-INPUT-01 — o Hefesto desliga o que a Steam põe no meio

**06/09/2026 · árvore `STEAM-INPUT-01-C-STEAM-INPUT-01` · branch
`voo/STEAM-INPUT-01-C-STEAM-INPUT-01`, nascida de `3f6855a6` (a costura da
ONDA B).** Última sprint despachada da onda C, por ordem dela.

Decisão dela, `D-0609-STEAM-DIVIDIDO`: **Steam Input e a lista de exceções
ficam na aba 07; "Consertar", "Restaurar de fábrica" e "Aplicar aos jogos"
ficam na 09.**

---

## 0. O ESTADO EM UMA LINHA

Os **três botões do Steam Input** nasceram no cartão da Steam, a **linha de
estado** entrou no corpo do cartão, e o **lembrete ganhou a quarta condição que
lhe faltava**. **43 dos 44 portões verdes**; o único vermelho é
`paridade-gtk-html`, e ele é vermelho **por desenho** — ver §7.

---

## 1. O QUE FECHOU

### Passo 1 — conferir e desligar o Steam Input

**O "conferir" deixou de ser um botão, e isso é o produto, não um atalho.** Na
janela velha o `check` existe porque a etiqueta dela não se atualiza sozinha;
aqui a `_Vigia` relê o disco a cada 20 s e o "Procurar de novo" a invalida no
clique. Então o estado **é pintado**: `_ler_do_disco` passou a perguntar ao dono
(`emulation_actions.markup_status_steam_input`, mais os três estáticos de
`EmulationActionsMixin`), e a frase entra no corpo do cartão pela
`Leitura.steam_input`.

**Nenhuma palavra da tela é minha.** A frase inteira sai do dono; o que a aba faz
é **traduzir de marcação**: o dono devolve markup do *Pango*
(`<span foreground="#…">`), que um navegador não entende — um `foreground=` não
pinta nada no WebKit e ficaria como atributo morto na tela dela. As tarjas saem,
o texto volta a ser texto, e quem pinta é `.lanc-diz b`, o laranja que a própria
aba já tem. O `<b>` cobre **só a primeira tarja**, que é exatamente a que o dono
pinta de laranja; a segunda (a contagem da lista de exceções) é cinza lá e sai
sem peso aqui.

**E o tom não se lê pelo hexadecimal, de propósito:** `#ffb86c` está escrito
dentro do dono, sem nome. Digitá-lo aqui seria uma régua de cor — verde no dia
em que ele mudasse de tom, com a ênfase indo para a tarja errada, calada.

O **"Desligar o Steam Input"** é gesto, e a ordem dos portões é a do dono
(`emulation_actions._steam_input_decidir`), medida no clique e não na
`PORTOES` (que é de até 20 s atrás):

| estado | o que acontece |
| --- | --- |
| jogo aberto | **RECUSA**, com a frase do dono. `steam -shutdown` mataria o jogo |
| só a Steam aberta | **pergunta** — o 1º clique arma e devolve o recado; o 2º fecha a Steam por ~20 s, aplica e reabre, tudo por `with_steam_closed` |
| Steam fechada | **aplica direto** — não há consentimento a pedir quando não há o que fechar |

### Passo 2 — "Este jogo não funciona"

Gesto `este-jogo-nao-funciona`: acha o jogo pela **escada de três evidências que
a aba já tinha** (`a_escada_do_jogo`), escreve na lista de exceções
(`add_appid_to_steam_input_allowlist`) e **manda `launch_env.refresh` ao
serviço** para a marca valer AGORA.

**Sem consentimento, e isso é do motor:** o ato não fecha nada, não edita arquivo
da Steam e é reversível. Pedir consentimento para um ato reversível ensina que
todo botão pede consentimento — e aí o que importa deixa de ser lido.

**Esta é a primeira vez que a aba 07 fala com o serviço.** `PONTE` e `METODOS`
eram vazios com a razão medida escrita ao lado; a razão caducou para UM gesto e
está substituída no arquivo, com os outros dez declarados como continuam.

### Passo 3 — "Deixar tudo pronto", com UM consentimento

Gesto `deixar-tudo-pronto`: mede os jogos **dentro da janela e antes do script**
(ordem do dono, `D-33` — é o último instante em que o arquivo ainda diz de qual
jogo se fala), roda o script e aplica o atalho a todos, **numa janela só** de
`with_steam_closed`.

**Ele só nasce quando os DOIS lados têm trabalho** — falta atalho em algum jogo
E o Steam Input está ligado. É a razão inteira de ele existir; com um lado só
pendente, o botão daquele lado já resolve com um consentimento igual, e um
terceiro botão ali seria escolha oferecida sem diferença.

**A frase do consentimento é a do motor, palavra por palavra**
(`DaemonActionsMixin._STEAM_READY_CORPO`). As quebras de parágrafo viram espaço
porque um recado é uma linha, não uma caixa; **nenhuma palavra muda no caminho**,
e há régua que compara com o dono.

### Passo 4 — o lembrete, e a premissa da sprint que caiu pela metade

**O enunciado dizia `NADA`. Medido, ele já existia — pela metade.** A aba acende
o aviso do jogo aberto sem o atalho desde 03/09 (`aviso_do_jogo_aberto`, do
`wrapper_used` do daemon) e cala nas duas recusas dela desde 04/09
(`calados`). Duas das quatro condições do dono já estavam lá.

**A que faltava era a da EMULAÇÃO, e o buraco é medível:** no Modo Nativo não há
gamepad virtual, logo não há o que duplicar — e a aba avisava assim mesmo, com
um alarme sobre uma duplicação que não pode acontecer. A janela velha nunca teve
esse defeito porque a decisão dela é uma função pura.

**A cura foi IMPORTAR a função**, como a sprint manda, e o que a aba faz é
entregar a evidência que já tem no lugar da que a janela velha vai buscar: o
`vdf_cache` do dono responde *"falta o atalho neste jogo?"*, e aqui quem já
respondeu isso foi o daemon — com evidência **mais forte**, porque o marker diz
se o wrapper de fato RODOU, e não só se a linha está escrita.

O `shown_this_session` vai vazio de propósito: o anti-spam existe porque lá o
lembrete é um DIÁLOGO que rouba o foco. Aqui ele é uma linha dentro do cartão,
que nasce e morre com o jogo aberto — aplicá-lo faria o aviso sumir no segundo
tique e voltar nunca, com o jogo ainda rodando sem o atalho.

### Duas coisas que vieram junto

**1. O consentimento passou a ser do ATO, e não da aba.** Havia UM relógio
(`_ARMADO_ATE`) para o único botão que fechava a Steam. Com três, um relógio só
faria o sim dado a um valer para o outro — clicar em "Posso fechar a Steam?" e
confirmar em "Deixar tudo pronto" rodaria o segundo com o consentimento do
primeiro. Agora o relógio é por gesto, o `data-v` armado é por gesto
(`_confirmo(nome)`), e armar um **desarma** o outro.

**2. O gerador parou de escrever a bancada no import** (achado da costura,
relatado a mim em voo). Tudo do `monta(...)` para baixo em `aba07.py` corria no
nível do módulo: `import aba07` reescrevia `mockup/07-lancadores.html` no disco.
**Medido nesta árvore**, com a mordida colada em §4.

---

## 2. QUAL MORDIDA PROVA CADA CURA

Onze. Cada cura arrancada, uma por vez, a régua rodada, a cura devolvida.
Saída em `STEAM-INPUT-01-*.txt` no scratchpad; o essencial:

| # | o que foi arrancado | o que reprovou |
| --- | --- | --- |
| 1 | `steam_input=`/`steam_input_ligado=` da `Leitura` de `_ler_do_disco` | `test_a_leitura_do_disco_leva_o_steam_input_ate_o_cartao` — o arquivo em disco diz LIGADO e a leitura não conta a ninguém |
| 2 | `diz = diz + steam_input_html(...)` do `cartao_da_steam` | a mesma: a frase está na leitura e não no corpo — pintura perdida |
| 3 | `_este_clique_confirma` devolve `True` sempre | **3 reprovam** — o primeiro clique passa a fechar a Steam dela |
| 4 | `if ainda_ligado is not False: raise` | `test_o_desligar_le_o_arquivo_de_volta_antes_de_dizer_pronto` — a tela diz "Pronto" sobre um no-op |
| 5 | `p.chamar(METODO_DA_RECARGA)` | `test_o_jogo_marcado_chega_na_lista_de_excecoes_e_o_servico_recarrega` |
| 6 | `_confirmo` volta a ser uma constante única | `test_o_consentimento_de_um_ato_nao_vale_para_o_outro` |
| 7 | o botão de desligar aparece sempre | **2 reprovam** — botão que não muda nada é botão que finge |
| 8 | duas janelas de `with_steam_closed` no "Deixar tudo pronto" | `…faz_os_dois_dentro_de_um_consentimento_so` |
| 9 | o markup do Pango passa inteiro | `test_a_tela_diz_coisas_diferentes…` — `<span foreground=…>` na tela |
| 10 | "Deixar tudo pronto" com um lado só | `…so_nasce_quando_os_DOIS_tem_trabalho` |
| 11 | sai a consulta a `wrapper_dialog_decision` | **os 2 casos de modo** voltam a avisar |

### A MORDIDA QUE DECIDE — e ela é o ARQUIVO, lido de volta

`test_o_desligar_le_o_arquivo_de_volta_antes_de_dizer_pronto` monta um
`localconfig.vdf` de mentira num `HOME` de mentira, com um appid sintético
(`9990001`), e roda o gesto **duas vezes**:

```
1. o script NÃO escreve nada (rc=0, sem tag)
   → o arquivo continua "UseSteamControllerConfig"  "2"
   → a tela RECUSA, com a frase do dono para "rodou e continua ligado"

2. o script de fato desliga
   → o arquivo passa a "UseSteamControllerConfig"  "0"
   → a tela diz "Pronto — Steam Input desligado"
```

**Era exatamente assim que a janela velha mentia antes da
`HONESTIDADE-STEAM-01`:** *"Steam Input desligado"*, incondicional, sobre um
no-op. Com o `if ainda_ligado is not False` arrancado, o caso 1 volta a dizer
que deu certo.

E a do Passo 2 tem as duas metades cobradas: o appid lido de volta **pelo leitor
do produto** (`parse_steam_input_allowlist`, nunca um `in` no texto — um appid
comentado passaria por substring e não vale como marca) e o `launch_env.refresh`
contado numa ponte de mentira.

---

## 3. A PROVA DE TELA

Janela `--oculta` (`Gtk.OffscreenWindow`), daemon vivo, um DualSense no cabo.
**Nada do disco dela foi tocado:** um driver no scratchpad desvia `HOME` e os
quatro `XDG_*` para um lar de mentira, planta o `localconfig.vdf` e o marker do
último jogo lá dentro, e **força `steam_running`/`steam_game_running`** — sem
isso o gesto de desligar acharia a Steam DELA em `/proc`. O
`with_steam_closed` e o `stop_steam` são substituídos por uma função que
LEVANTA: se qualquer caminho tentasse fechar a Steam dela, a prova morreria em
vez de acontecer.

### A FOTO — antes e depois, com o MESMO lar de mentira

| | o que se viu no cartão da Steam |
| --- | --- |
| **antes** (cura arrancada) | com o Steam Input LIGADO no arquivo, o cartão **não diz uma palavra sobre ele** e não oferece botão nenhum. Quatro botões: Consertar · Ver o que impede · Abrir o lançador · Posso fechar a Steam por uns 20 segundos? |
| **depois** | a linha laranja *"Ligado para appid 9990001 — o Hefesto desliga no próximo ciclo, porque esse jogo não está na sua lista de exceções"*, e mais três botões: **Este jogo não funciona · Desligar o Steam Input · Deixar tudo pronto** |

### O CLIQUE — os dois caminhos acionados, com a resposta na tela

**«Este jogo não funciona»**, clicado pela `--prova-clique`:

```
[gesto] 07-lancadores.html · este-jogo-nao-funciona → aplicado, e a resposta foi para a tela
gestos: 1 · aplicados: 1 · sem dono: 0

o arquivo, lido de volta:
  # marcado pela tela: 'este jogo não funciona'
  9990001
```

E a MESMA tela mudou junto, sem outro clique: a linha passou a
*"Desligado — tudo certo · Exceção por jogo: 1 jogo(s) — só valendo durante o
jogo"*, e os botões **"Desligar o Steam Input" e "Deixar tudo pronto"
sumiram** — não há mais o que desligar. O recado verde traz a frase inteira do
dono (`format_game_broken_result`).

**«Desligar o Steam Input»**, primeiro clique:

```
[gesto] 07-lancadores.html · desligar-steam-input → aplicado, e a resposta foi para a tela

o botão trocou de cara:  "Desligar o Steam Input"  →  "Fechar e continuar" (verde)
o recado, no rodapé:     "Posso fechar a Steam por uns 20 segundos?"
o vdf de mentira:        "UseSteamControllerConfig"  "2"   — INTACTO
```

**O primeiro clique não fecha nada, e o arquivo prova.**

### NO TEMPO — a régua de mutações da `A-TELA-SAMBA-01`

```
ANTES (medição pré-C que eu herdo)   0 mutações · custo do tique mediana 1,28 ms
DEPOIS                               0 mutações em 100 tiques · mediana 1,39 ms
```

**A aba continua em ZERO com a mesa parada.** O `if extras:` de
`com_o_que_o_daemon_diz` não é estilo: sem ele o `acoes is steam.acoes` de baixo
nunca mais casaria (desempacotar uma tupla cria outra), e o cartão passaria a ser
reconstruído em TODO tique — o segundo dono do samba, pela porta que a
`A-TELA-SAMBA-01` acabou de fechar nesta aba.

**A leitura do disco custou 4,1 ms a mais** (64,6 → 68,7 ms) e roda na thread da
vigia, fora do tique.

**As fotos ficam no scratchpad e NÃO entram no repositório** — elas trazem a
fita com a identidade viva do controle dela.

---

## 4. A MORDIDA DO GERADOR — e o achado da costura confirmado nesta árvore

```
com a cura (a guarda `if __name__ == "__main__":`)
  $ python -c "import aba07"        md5 do mockup: 3885d2d7…  (INALTERADO)

com a cura ARRANCADA
  $ python -c "import aba07"        md5 do mockup: d6eb1d34…  (MUDOU)
  $ git diff mockup/07-lancadores.html
  -  <b data-campo="conta-b">1 USB · 1 BT</b>
  +  <b data-campo="conta-b">0 USB · 0 BT</b>
```

**A segunda linha confirma o segundo achado da costura:** esta árvore ainda não
tem a chave crua `transporte` em `monta.MESA`, então regerar a 07 aqui produz o
cabeçalho zerado. **Por isso o `mockup/07-lancadores.html` NÃO foi regerado**, e
ele sai desta frente byte a byte como entrou (md5 `3885d2d7…`, idêntico ao
publicado).

**O diff que amplia o glob da régua**, para quem o aplicar na costura
(`tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py`, **fora da minha
posse**):

```diff
-    aba0[45].py
+    aba0[457].py
```

---

## 5. O QUE ESTA FRENTE **NÃO** VERIFICOU — e a Steam DELA está separada

* **A Steam dela nunca foi fechada, nem sondada num caminho que agisse.** Todo
  gesto que fecha a Steam foi provado com dublê ou no lar de mentira; o
  `with_steam_closed` real **nunca rodou** nesta frente. O que isso deixa **não
  medido**: o desfecho `nao_fechou` e o `jogo_aberto` do `with_steam_closed`
  vivo, e o `disable_steam_input.sh` de verdade sobre um `localconfig.vdf` de
  verdade.
* **O Steam Input da máquina dela está DESLIGADO** (medido: `_steam_input_is_on()
  → False`), então os três botões **não aparecem na tela dela hoje**. A prova de
  tela é toda no lar de mentira, e é por isso que ela existe.
* **`git status` da Steam dela:** o `localconfig.vdf`, o `steam_input_apps.txt` e
  o `launch_env` dela **não foram escritos por esta frente**. As duas leituras
  que tocaram o disco dela foram LEITURAS (`_steam_input_is_on`,
  `rotulo_do_jogo` do appmanifest), e estão nas saídas do scratchpad.
* **`launch_env.refresh` chegou ao daemon vivo uma vez**, no clique do lar de
  mentira. Ele rematerializa o ambiente de inicialização com a allowlist REAL
  dela, que não mudou — é o mesmo aviso que a janela velha manda depois de toda
  escrita na lista, e é idempotente aqui.
* **A suíte inteira não foi rodada** — ela é de quem coordena. Rodei o escopo:
  `test_a_aba_07_lancadores_fecha_as_linhas`, `test_a_aba_lancadores_diz_a_verdade`,
  `test_a_aba07_le_o_que_o_daemon_ja_dizia`, `test_a_vigia_da_steam_repoe_sozinha_07`,
  `test_o_botao_abrir_o_lancador_07`, `test_a_dispensa_cala_as_quatro_telas`,
  `test_os_botoes_tem_dono`, `test_todo_gesto_que_grava_esta_protegido`,
  `test_a_prova_nao_grava_no_perfil_dela`, `test_a_tela_nao_samba`,
  `test_o_despachante_serve_as_dez`, `test_o_casamento_das_dez`.
* **A bancada não foi exigida** (`scripts/bancada.sh exigir` não foi chamado)
  porque nada aqui parou o serviço, escreveu no aparelho ou chamou `systemctl`.

---

## 6. O QUE MEXI FORA DA POSSE — os três diffs exatos

### 6.1 `src/hefesto_dualsense4unix/interface/hefesto_vivo.py` — `PERIGOSOS` +2

**Deliberado, e pelo motivo que a `LUZES-01` registrou no mesmo arquivo horas
antes:** sem estas linhas a `--prova-gesto` mexe na máquina DELA, e o dano é
dela, não da régua. As duas entram **no mesmo commit** que ensinou os gestos a
escrever, que é o que a própria lista pede.

```diff
     ("07-lancadores.html", "copiar-a-linha"),
+    ("07-lancadores.html", "desligar-steam-input"),
+    ("07-lancadores.html", "este-jogo-nao-funciona"),
```

* `desligar-steam-input` — **com a Steam FECHADA ele age no PRIMEIRO clique** e
  reescreve os arquivos de configuração da Steam dela. Só o caminho da Steam
  aberta passa pelos dois cliques;
* `este-jogo-nao-funciona` — não pede confirmação de propósito, e por isso age no
  primeiro clique: escreve o appid na lista de exceções.

O **`deixar-tudo-pronto` fica de fora**, e é a mesma razão do
`consertar-fechando-a-steam`, que também não está lá: ele SEMPRE passa pelos dois
cliques, e o segundo exige um `data-v` que só existe no cartão já armado.

### 6.2 `tests/unit/test_a_aba_lancadores_diz_a_verdade.py` — o piso e a lista

O piso **só sobe**: 11 → 14, com os três gestos novos. E os três entram na
mesma categoria do `copiar-a-linha` na régua dos gestos: só nascem no cartão de
quem já teve a biblioteca lida, e o HTML estático nasce em `cartoes(None)`.

```diff
-def test_o_piso_de_gestos_da_aba_e_onze(a07):
+def test_o_piso_de_gestos_da_aba_e_catorze(a07):
-    assert quantos >= a07.PISO_DA_ABA == 11, (
+    assert quantos >= a07.PISO_DA_ABA == 14, (

     assert com_dono - no_html <= {…, "copiar-a-linha",
+                                  "desligar-steam-input",
+                                  "este-jogo-nao-funciona",
+                                  "deixar-tudo-pronto"}, (
```

### 6.3 `tests/unit/test_a_aba07_le_o_que_o_daemon_ja_dizia.py` — o armamento

Quatro testes cutucavam `a07._ARMADO_ATE`, o float que virou dicionário. Trocado
pela API, o que os deixa **independentes da forma do armazenamento**:

```diff
-    monkeypatch.setattr(a07, "_ARMADO_ATE", 0.0)
+    a07._desarmar()
-    monkeypatch.setattr(a07, "_ARMADO_ATE", time.monotonic() + 30)
+    a07._armar(a07.FECHAR)
```

---

## 7. OS PORTÕES — 43 de 44, e o vermelho é O HANDOFF

```
git add -A && bash scripts/portoes.sh
  → paridade-gtk-html  VERMELHO rc=1
      divida-fechada: paridade-gtk-html.csv:251
        o sinal 'add_appid_to_steam_input_allowlist' APARECEU em
        src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py.
        O CSV diz FALTA_NO_HTML e o lado HTML passou a ter o símbolo.
```

**ELE É VERMELHO POR DESENHO, e a prova está no frontmatter da sprint seguinte:**
`PARIDADE-REMEDIR-01` tem `posse: [docs/data/paridade-gtk-html.csv]`,
`nao_toca: [src/, tests/, scripts/, mockup/]` e
`depois_de: [… STEAM-INPUT-01 …]`. **Ela existe para remedir exatamente as
linhas que esta leva fechou**, roda em série na onda D e é do coordenador. O CSV
está no MEU `nao_toca`, e reescrevê-lo aqui moveria também a tabela publicada em
`docs/process/2026-09-03-O-TERCEIRO-NUMERO-…md` (regra 8 da régua) — dois
arquivos de outra posse, para um vermelho que a sprint seguinte apaga com a
medição na mão.

**Um segundo portão ficou vermelho e EU o curei:** `nada-aponta-para-a-janela`
pegou uma citação nova minha a `gui/main.glade` num comentário de rótulo. A
janela está sendo aposentada (`D-0609-GTK-LEVA-INTEIRA`) e o que se reusa é a
**função dona da palavra**; o ponteiro passou a ser o do motor.

Os outros 42: verdes.

---

## 8. O TEXTO PRONTO PARA O CSV DA PARIDADE (não é desta posse)

### Linha 251 — "Este jogo não funciona" — a que a régua acusou

```
veredito:      FALTA_NO_HTML  →  IGUAL
sinal_espera:  AUSENTE        →  PRESENTE
sinal_escopo:  LADO-HTML      →  src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
html_onde:     src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py:2160 ·
               src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py:2266 ·
               src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py:645
html_faz:      O gesto `este-jogo-nao-funciona` acha o appid pela MESMA escada de três
               evidências (`a_escada_do_jogo`), escreve com
               `add_appid_to_steam_input_allowlist` e manda `launch_env.refresh` ao
               serviço para a marca valer agora. Sem diálogo, porque é reversível. A
               recusa sem jogo é a frase do dono (`format_game_broken_result`).
porque (append com ` || `):
               FECHADA em 06/09/2026 pela STEAM-INPUT-01, decisão dela
               `D-0609-STEAM-DIVIDIDO`. É a PRIMEIRA vez que a aba 07 fala com o
               serviço: `PONTE`/`METODOS` eram vazios com a razão medida ao lado, e a
               razão caducou para este gesto. A prova é o ARQUIVO — a régua lê a lista
               de volta pelo `parse_steam_input_allowlist`, não por substring.
```

### Linha 254 — "Steam Input: conferir se está ligado e desligar"

**A régua NÃO a acusou, e é aí que ela mente:** o `sinal` é
`on_emulation_steam_input_disable`, um nome de método do mixin da GTK que o lado
HTML nunca escreveria — a mesma forma de dado envelhecido que a linha 238 já
registra ("o `sinal` era um atributo INTERNO do mixin"). Ela seguirá
`FALTA_NO_HTML` com a dívida fechada, e nada acusa.

```
sinal:         on_emulation_steam_input_disable  →  format_steam_input_result
veredito:      FALTA_NO_HTML                     →  IGUAL
sinal_espera:  AUSENTE                           →  PRESENTE
sinal_escopo:  LADO-HTML → src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
html_onde:     …/a07_lancadores.py:2099 · …/a07_lancadores.py:415 ·
               …/a07_lancadores.py:2075 · …/desenho_dos_lancadores.py:642
html_faz:      O ESTADO é pintado (a `_Vigia` relê a cada 20 s e o "Procurar de novo" a
               invalida no clique), com a frase do dono `markup_status_steam_input`
               traduzida de Pango para HTML. O DESLIGAR é gesto, com a mesma ordem de
               portões do dono: jogo aberto recusa; Steam aberta pede consentimento em
               dois cliques; Steam fechada aplica. O veredito é a RELEITURA do vdf.
porque (append): FECHADA em 06/09/2026. O "conferir" deixou de ser botão de propósito:
               na janela velha ele existe porque a etiqueta não se atualiza sozinha;
               aqui a vigia relê. O `modo-steam` da aba Jogar continua `SEM_DONO` e a
               razão dele MUDOU — não é "não há IPC", é "o dono do assunto é a 07".
```

### Linha 250 — "Deixar tudo pronto"

Mesma armadilha: o `sinal` é `_build_steam_ready_confirm_dialog`, nome de método
do mixin.

```
sinal:         _build_steam_ready_confirm_dialog  →  format_steam_ready_result
veredito:      FALTA_NO_HTML                      →  IGUAL
sinal_espera:  AUSENTE                            →  PRESENTE
sinal_escopo:  LADO-HTML → src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
html_onde:     …/a07_lancadores.py:2202 · …/a07_lancadores.py:1057 ·
               …/desenho_dos_lancadores.py:648
html_faz:      Gesto `deixar-tudo-pronto`: mede os jogos DENTRO da janela e antes do
               script (ordem do dono, D-33), roda o script e aplica o atalho a todos —
               numa janela só de `with_steam_closed`. A frase do consentimento é
               `DaemonActionsMixin._STEAM_READY_CORPO`, palavra por palavra, com régua
               que compara com o dono. Só nasce quando os DOIS lados têm trabalho.
porque (append): FECHADA em 06/09/2026. A nota da linha dizia que "esta falta é da aba
               09, não da 07" — CADUCOU pela decisão dela `D-0609-STEAM-DIVIDIDO`, que
               dividiu o assunto: Steam Input e lista de exceções na 07; "Consertar",
               "Restaurar de fábrica" e "Aplicar aos jogos" na 09.
```

### Linha 236 — o lembrete proativo

```
veredito:      FALTA_NO_HTML  →  IGUAL
sinal:         _maybe_prompt_wrapper_dialog  →  wrapper_dialog_decision
sinal_espera:  AUSENTE → PRESENTE
sinal_escopo:  LADO-HTML → src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
html_faz:      `aviso_do_jogo_aberto` acende no tique, sem clique, e desde 06/09 pelas
               QUATRO condições do dono — ele IMPORTA `wrapper_dialog_decision` e lhe
               entrega, no `vdf_cache`, a evidência do daemon (`wrapper_used is False`),
               que é mais forte que a do vdf: o marker diz se o wrapper RODOU.
porque (append): FECHADA PELA METADE EM 03/09 E POR INTEIRO EM 06/09. O `html_faz`
               desta linha dizia "NADA. Não há tique, gatilho nem diálogo equivalente" —
               **estava errado desde 03/09**, e o enunciado da sprint o herdou. O que de
               fato faltava era UMA das quatro condições, a da emulação: no Modo Nativo
               não há vpad e a aba avisava de duplicação assim mesmo. A FORMA continua
               diferente e é decisão: lá é diálogo com anti-spam de 1 por sessão; aqui é
               linha no cartão, permanente enquanto o jogo estiver aberto, com o botão
               que a dispensa ao lado.
```

---

## 9. `mockup/DIVERGENCIAS.md` — texto pronto (não é desta posse)

**Nada a acrescentar.** O desenho não mudou e o `mockup/07-lancadores.html` sai
desta frente byte a byte como entrou.

**E é decisão, não descuido.** Tudo o que esta frente pôs na tela nasce em
estados que uma página estática não tem: o `cartoes(None)` da primeira meia
volta não leu disco nenhum, e sem leitura não há Steam Input a relatar nem botão
a oferecer. É a mesma razão pela qual o `copiar-a-linha` nunca entrou no mockup —
ele é condicional. O caminho até a tela dela é o `blocos:` do piloto, que troca a
grade inteira a cada tique e **alcança a página publicada de hoje sem publicar
nada**.

**Uma escolha de forma que vale registrar para o dia da publicação:** a linha do
Steam Input entra como `<br>` + `<b>`, e não como classe própria. Uma classe nova
só ganharia folha de estilo quando ela aprovasse o desenho, e até lá a linha
nasceria sem regra nenhuma; o `<br>` é a forma que o cartão já usa para o aviso
do jogo aberto, e a cor não se perde porque `.lanc-diz b` já é laranja. **No dia
em que ela aprovar, um `.steam-input{margin-top:6px}` dá respiro à linha** — é
desenho, e é dela.

---

## 10. TRÊS RELATOS DE FORA DA POSSE

### RELATO 1 — a régua dos gestos que gravam é CEGA para a aba 07 inteira

`tests/unit/test_todo_gesto_que_grava_esta_protegido.py` lê a árvore de cada
gesto e pergunta se ele chama uma porta de escrita. **Nenhuma das portas da aba
07 está em `ESCREVEM`**, e por isso ela deu verde sobre os meus dois gestos novos
— e sobre os que já estavam lá:

```
marcar_jogo_sem_wrapper             (07·tirar-daqui)
desmarcar_jogo_sem_wrapper          (07·voltar-a-usar)
add_dismissed_appid                 (07·nao-perguntar)
remove_dismissed_appid              (07·voltar-a-perguntar)
reparar_ou_adiar                    (07·consertar, 07·consertar-fechando-a-steam)
add_appid_to_steam_input_allowlist  (07·este-jogo-nao-funciona)   ← meu
apply_wrapper_to_all_games          (07·deixar-tudo-pronto)       ← meu
with_steam_closed                   (os três que fecham a Steam)
```

O próprio arquivo diz que *"quem ensinar um gesto a escrever acrescenta a porta
AQUI no mesmo commit"* — e nomeia a repetição quatro vezes. **Esta é a quinta**,
e ela é maior que as outras: não é uma porta esquecida, é uma ABA inteira fora do
alcance. Acrescentar os oito nomes exige decidir, um a um, se cada gesto vai para
`PERIGOSOS` ou para `ISENTOS` com a medição do lado — **é trabalho da
`ONDA3-GESTO-DECLARA-01`**, que existe para tirar a lista da lembrança de quem
escreve o gesto e pô-la no próprio decorador. Não o fiz aqui porque mexeria em
seis gestos que não são desta sprint.

### RELATO 2 — `appid` chega à tela pelo dono, e a sprint o proíbe

O enunciado desta sprint diz que *"`vdf`, `env`, `appid` e 'linha de comando'
são proibidos em texto de tela"*. **`appid` já estava lá antes de mim**, e vem do
dono: `steam_launch_options.rotulo_do_jogo` devolve `Sackboy™: A Big Adventure
(appid 1599660)`, e cai para `appid NNNN` quando o manifesto sumiu. Medido na
tela desta frente, em três lugares do cartão da Steam (a linha do Steam Input, a
lista de jogos, o recado do "Este jogo não funciona").

**Nenhum portão o pega** — `check_regua_de_tela.py` e `frases_que_ela_baniu.py`
estão verdes com ele na tela. A cura mora em `integrations/`, alcança a janela
velha junto, e **não é desta posse**. Duas saídas possíveis, e a escolha é dela:
tirar o `(appid N)` do rótulo (perde-se o desempate entre dois jogos de mesmo
nome) ou aceitar o termo no glossário.

### RELATO 3 — `format_steam_input_result` manda a "Detalhes técnicos"

Dois ramos do dono (`rc != 0 | tag == "erro"`, e `ainda_ligado is True`) terminam
em *"veja os 'Detalhes técnicos'"*. **O painel existe na interface nova** — é da
aba 09 —, então a frase não manda a um lugar que não existe; mas ela **não diz
qual aba**, e o recado dela pousa na 07. É o parente pobre da decisão `07[02]`
(*a frase para de nomear lugar*). Deixei a frase do dono intacta, porque
reescrevê-la aqui criaria a segunda redação que aquela decisão existe para
impedir. A linha a mudar é `app/actions/emulation_actions.py`, e ela está no meu
`nao_toca`.

---

## 11. O QUE A SPRINT SEGUINTE PRECISA SABER

1. **A `SISTEMA-STEAM-01` (a metade da aba 09) herda três donos já ligados:**
   `format_steam_input_result`, `format_steam_ready_result` e
   `format_game_broken_result` já têm chamador na interface nova. Se ela precisar
   do consentimento em dois cliques, `a07_lancadores._este_clique_confirma`,
   `_armar`, `_armado_agora` e `_confirmo` são públicos o bastante para
   importar — e `a09_sistema` já importa `SEGUNDOS_PARA_CONFIRMAR` de lá, o que
   faz da 07 o dono da duração.
2. **O "Este jogo não funciona" TIROU o Steam Input do jogo, e a tela muda
   sozinha por causa disso** — os dois botões somem no tique seguinte. Quem
   desenhar a metade da 09 não deve contar com eles de pé.
3. **`relancar.EXIGEM_RELANCAR` lista `steam_input_do_jogo`** como mudança que só
   vale na próxima abertura (a linha 251 do CSV o registra). **Esta frente não
   construiu o diálogo de relançar** — o gesto avisa o serviço e diz o que fez,
   e a frase do dono já explica que é preciso *"fechar e abrir o jogo de novo"*.
   Se o "Jogador 3 fantasma" reaparecer, é aqui que se olha.
