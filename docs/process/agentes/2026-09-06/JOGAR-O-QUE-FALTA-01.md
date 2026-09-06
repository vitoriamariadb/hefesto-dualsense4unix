# JOGAR-O-QUE-FALTA-01 — quem é o primário, o que a máscara guarda, e a tela que para de afirmar

**06/09/2026 · árvore `hefesto-voo/hefesto-voo/JOGAR-O-QUE-FALTA-01-E` · branch
`voo/JOGAR-O-QUE-FALTA-01-E`, nascida de `onda/atual-0609` (`98f2a6a4`).**

---

## [!] O QUE QUEM COSTURA PRECISA SABER, EM QUATRO LINHAS

1. **UM ARQUIVO FORA DA MINHA POSSE FOI TOCADO, e está declarado:**
   `src/hefesto_dualsense4unix/interface/pacotes/perfil.py` — o módulo
   compartilhado de *gravar e aplicar perfil*, onde `gravar_e_reaplicar` e
   `com_a_carona` já moram pela mesma razão. Ele **não** está no meu `nao_toca`
   e **nenhuma sprint aberta o declara na posse** (conferido com
   `check_colisao_de_sprints.py --abertas`, 42 abertas). Duas funções novas no
   fim do arquivo; nada existente foi mexido.
2. **`tests/unit/test_todo_gesto_que_grava_esta_protegido.py` ganhou UM nome em
   `ESCREVEM`** (`gravar_o_modo_no_ativo`) — é o procedimento que o próprio
   arquivo manda seguir (*"se o nome for novo, acrescente-o a `ESCREVEM`"*), e
   sem ele três gestos desta aba passariam a escrever no perfil dela sem
   proteção.
3. **A ABA 01 ENTROU EM `mockup/DIVERGENCIAS.md`** — dois endereços novos por
   cartão, os dois invisíveis na página parada. **Não publiquei.**
4. **O PASSO 5 TEM METADE COM ENDEREÇO EM OUTRA POSSE** — uma linha em
   `hefesto_vivo.py` (`ONDA5-P-01`). Está na §5.

---

## 1. O QUE MUDOU, passo a passo

### Passo 1 — o modo/máscara clicados entram na seção `mode` do perfil ativo

Linha 5 do CSV. O veredito de lá: *"nada. `_ESCOLHA`/`_ROTULO` são dicionários
de módulo lidos só dentro do próprio arquivo"*, e a consequência: *"ela escolhe
'Xbox' na 01, clica em 'Salvar Perfil' na 10, e o perfil grava a máscara que
estava no disco — a escolha dela não entra."*

| camada | onde | o que |
| --- | --- | --- |
| regra | `interface/pacotes/perfil.py:408` (`secao_do_modo`) | `"none"` REMOVE a seção; a máscara é zerada fora do modo jogo e **preservada** dentro dele |
| escritor | `interface/pacotes/perfil.py:446` (`gravar_o_modo_no_ativo`) | resolve o ativo pelo dono, compara, grava só o que mudou, **nunca levanta** |
| gesto | `interface/pacotes/a01_jogar.py:1396` (`_gravar_o_modo`) e `:1414` (`_gravar_o_modo_do_chip`) | chamados por `hefesto`, `modo-dualsense`, `modo-xbox` e `modo-navegacao`, **depois** do `_aplicar` |
| proteção | `@gesto(…, grava="gravar_o_modo_no_ativo")` nos três primeiros | o quarto já declarava por frase e está em `FORA_DA_ARVORE` |

**UM DONO, DUAS TELAS.** A regra da seção é a de
`profiles_actions._mode_section_from_editor` (a janela GTK) e a mesma que
`a10_perfis.editor_modo` aplica na aba Perfis. Escrevê-la dentro de `a01_jogar`
faria a **terceira** cópia; por isso ela mora no módulo compartilhado.

**O QUE ESTA GRAVAÇÃO NÃO FAZ, e é escolha declarada:** ela **não recusa
dizendo** (o `editor_modo` da aba 10 recusa quando o valor já é o mesmo, porque
lá o clique É o ato; aqui a gravação é efeito colateral de uma troca de modo que
já foi ao daemon), e **não reaplica o perfil** (`gravar_e_reaplicar` mandaria
`profile.switch` + `launch_env.refresh`, reenviando gatilho, luz, vibração e
atalhos por causa da troca de um chip).

**CONSEQUÊNCIA QUE QUEM COSTURA PRECISA LER:** a partir daqui, **clicar o
interruptor ou um chip da fileira Modo na aba Jogar ESCREVE no `.json` do perfil
ativo dela**. É o que a linha 5 do CSV pede e o que a D1/D2 desta casa manda
(*clicar já aplica e já grava*), e é reversível pelo quadro «Modo» da aba 10.

### Passo 2 — a linha "Ponte com o jogo": **JÁ ESTAVA FECHADA**

**A §1 da sprint descrevia o mundo de antes de 04/09**, e a medição corrige o
enunciado: `a01_jogar._aviso_da_ponte` (`:914`) existe desde 04/09, lê
`home_actions.texto_da_ponte` (`home_actions.py:1266`), decide "é má notícia?"
pela **cor que o próprio produto pinta** e entra na coluna Atenção com o selo
`PONTE`. A régua dela é `tests/unit/test_a01_a_ponte_entra_na_coluna.py`, e a
decisão que a sustenta é `01[01]` de 04/09: **"Na coluna Atenção, só má
notícia."**

**O QUE ESTA SPRINT ACRESCENTOU** foi a mordida que a §2 pede e que não
existia: **as CINCO frases da ponte, uma por dublê**, medidas contra as palavras
proibidas — `test_nenhuma_das_frases_novas_fala_de_maquina`. As cinco, medidas:

```
[sem ponte]   Ponte com o jogo: nenhuma — nenhum jogo está recebendo controle do
              Hefesto. Escolha "Jogar pelo Hefesto" para o jogo ver um controle.
[ponte vazia] Ponte com o jogo: de pé, e vazia — o gamepad do Hefesto está
              montado, e não há nenhum controle na mesa para alimentá-lo. (…)
[ponte boa]   Ponte com o jogo: pelo Hefesto — o jogo recebe o controle do
              gamepad do Hefesto, e o vê como DualSense (botões PlayStation).
[nativo]      Ponte com o jogo: direto (Sony) — o jogo fala com o DualSense sem
              o Hefesto no meio.
[offline]     Ponte com o jogo: não sei — o Hefesto está desligado.
```

**Nenhuma das cinco tem `uinput`, `hidraw`, `vpad` ou `evdev`** — as quatro que
a sprint nomeia. **A SEGUNDA TEM "mesa", e é um ACHADO — ver a §6.**

### Passo 3 — o marcador "primário"

Linha 18 do CSV, cujo SINAL **é o endereço de tela** `data-campo="marcador-principal"`
(trocado pela `ONDA4-S10` em 06/09 justamente porque o anterior era o nome de uma
função de outra feature).

| camada | onde |
| --- | --- |
| leitor | `a01_jogar.py:402` (`_e_o_primario`) — `"1"` só com `is_primary is True` |
| valor | `a01_jogar.py:573`, dentro do cartão |
| palavra | `a01_jogar.py:382` (`MARCA_DO_PRIMARIO = "primário"`), a da janela GTK (`home_actions.py:1573`) |
| desenho | `aba01.py:1087` — `<span class="e-primario" data-campo="marcador-principal" data-hef-alvo="classe" data-hef-classe="ha" title="…">` |
| folha | `aba01.py`, bloco *O MARCADOR "primário"* — `.cartao .e-primario{display:none}` / `.ha{display:inline}` |

**ELE NÃO É A CLASSE `.cartao.alvo`**, e a régua prende os dois em pixels
diferentes: a conferência do gerador conta os cartões com `alvo` e reprova se o
número mudar; o teste conta que o pacote **não emite `alvo` nenhum** (quem o
escreve é o piloto, porque é escolha dela e não fato do serviço).

### Passo 4 — a marca da emulação degradada, por cartão

Linha 32 do CSV. **A metade de PÁGINA já estava fechada** e a medição está
colada na §2: `painel.AVISOS_DA_TELA` traz `vpad_degradation_text`, que lê
`gamepad_emulation.backend` da MÁQUINA e chega à coluna Atenção desde 03/09. O
que faltava é o outro lado — `vpad_backend` + `vpad_motivo` **daquele
aparelho**, que é o que a varredura de 02/09 registrou como *"`vpad_motivo` —
GTK 1, HTML 0, SÓ A GTK LÊ"*.

* valor: `a01_jogar.py:579` — `degradacao_de(c)`, que delega a
  `controller_card.texto_degradacao` (`controller_card.py:1194`), o dono das
  **duas condições** e da tradução do motivo;
* desenho: `aba01.py:1087` — `<sup class="degradou" data-campo="degradou-cartao"
  data-hef-alvo="atributo" data-hef-atributo="title">*</sup>`, a **mesma
  gramática do cartão da aba 02** (decisão dela de 04/09: *"uma marca na palavra
  e o motivo no hover"*).

**UM CAMPO FAZ AS DUAS COISAS**, e é por isso que o alvo é `atributo`: sem
motivo o piloto REMOVE o `title` e a folha apaga a marca junto. Com a marca numa
classe e o motivo noutro campo daria para pintar marca sem explicação.

### Passo 5 — a aba com o serviço desligado

Linha 38 do CSV, e é o passo que mais vale.

**A OMISSÃO ERA A MENTIRA, E ELA TINHA NÚMERO.** Medido nesta árvore ANTES da
cura, com o pacote recebendo um estado vazio:

```
atencao-conta = "nenhum aviso"
aviso-selo    = ["", "", "", "", "", ""]
```

*"Nenhum aviso"* é uma AFIRMAÇÃO — quer dizer *"perguntei e não há nada"* — e o
que havia era ninguém para perguntar.

* a décima-primeira fonte da coluna: `a01_jogar.py:866`
  (`_aviso_do_servico_calado`), selo `SERVIÇO` (`:215`), frase `:242`;
* o selo **abre** a `ORDEM_DA_GRAVIDADE`, acima da `PAUSA`, pelo critério
  declarado da escada (*o que invalida o quê*): com o serviço calado, nem a
  pausa se sabe;
* a primeira frase é a da janela GTK, palavra por palavra
  (`home_actions.py:2615`, ramo `offline`), e há régua que lê o fonte de lá.

**A METADE DE APAGAR JÁ EXISTIA E NÃO É DESTA ABA:** `pacotes.pacote_da_pagina`
acrescenta o molde e `pacotes.apagar_os_lugares_sem_dono` escreve travessão nos
quatro lugares. Medido no WebKit (§4): com o estado vazio os cartões passam a
`P1 • Desconectado … —`.

**A OUTRA METADE NÃO É DESTA POSSE, E ESTÁ MEDIDA — ver a §5.**

---

## 2. OS DOIS FATOS DO CSV QUE A MEDIÇÃO DERRUBOU

**Não os corrigi no CSV** — `docs/data/paridade-gtk-html.csv` está no meu
`nao_toca` e é da `PARIDADE-REMEDIR-01`. Ficam aqui com a prova.

| linha | o que o CSV diz | o que se mediu hoje |
| --- | --- | --- |
| **27** (ponte) | *"nada. Nenhum campo de ponte na 01"* | `_aviso_da_ponte` existe desde 04/09 e a régua irmã o cobre. O CSV já traz a decisão `01[01]` no `porque`, mas o `html_faz` ficou no dia anterior |
| **11** (frase da PAUSA) | *"nada na 01. `state['paused']` não é lido por pacote nenhum da aba (…) quem consome `AVISOS_DA_TELA` é a bancada `jogar_vivo.py` (…) e não o produto"* | **falso desde 03/09.** `a01_jogar._avisos` abre com `painel.avisos_do_estado(ctx.state)`. Medido com `paused: True`: `[PAUSA] O Hefesto está em pausa: nada disto está acontecendo agora…`, e `atencao-conta = "1 aviso"` |

---

## 3. A PROVA DE TELA

### A FOTO — antes e depois, `--oculta`, com dois controles

O instrumento é novo e é posse desta sprint:
`scripts/ensaios/a_jogar_diz_quem_e_o_primario.py`. Ele abre a **BANCADA** no
mesmo `WebKit2.WebView` do produto, troca `mesa_viva.estado_do_daemon` por um
dublê, e roda o `Piloto._tique()` **de verdade** — a carga não é remontada à mão.

* **antes** (`--foto-publicado`): a página que o produto renderiza hoje. O
  cartão do P1 diz `Não sei · cabo`;
* **depois** (`--foto-depois`): a bancada. O mesmo cartão diz
  `Não sei · cabo* · primário`, com o `*` laranja e o motivo no ponteiro.

As duas fotos, e a do `jogar_vivo.py --bancada`, estão no scratchpad da sessão
(`fotos/antes.png`, `fotos/depois.png`, `fotos/bancada-jogar-vivo.png`) — não
entram no repositório porque são de dublê, e a imagem que a documentação publica
sai do `retratar_abas.py`.

### O CLIQUE — o chip «Xbox», e o que ele fez

```
js            : {'achou': True, 'texto': 'Xbox'}
IPC do gesto  : chamar('native.mode.set',      {'enabled': False, 'origin': 'manual'})
                chamar('gamepad.emulation.set', {'enabled': True,  'origin': 'manual',
                                                 'flavor': 'xbox'})
modo no disco : {'kind': 'gamepad', 'gamepad_flavor': 'xbox'}
modo pela a10 : 'gamepad'
```

A última linha é a **mordida do Passo 1**: o valor é lido de volta pelo caminho
da **aba Perfis** (`perfis_web._pacote_do_editor`, o que o quadro «Modo» mostra),
e não pelo `.json` direto. Ler o arquivo provaria que alguém gravou; ler por ali
prova que **a outra tela vê**.

**O INTERRUPTOR NÃO FOI CLICADO NO ENSAIO, e é decisão:** o gesto `hefesto`
chama `a09_sistema.ativar_o_servico()`, que roda `systemctl` na máquina dela de
verdade. O caminho dele é medido por régua de unidade.

### O MARCADOR ANDA, e o alvo da fita não

```
cena 1 (is_primary no P1)   p1 primário=True   alvo-da-fita=True
                            p2 primário=False  alvo-da-fita=False
cena 2 (is_primary no P2)   p1 primário=False  alvo-da-fita=True   ← não se moveu
                            p2 primário=True   alvo-da-fita=False
```

### A MARCA SOME SEM MOTIVO

```
cena 1 (uinput + motivo)    p1 degradou='Emulação degradada (uinput): o modo completo…'
cena 3 (uinput, sem motivo) p1 degradou=''      ← o `title` foi REMOVIDO
```

### O SERVIÇO CALADO — as duas metades, medidas no WebKit

```
cena 4  o socket FECHA (estado_do_daemon LEVANTA)   ← o caminho REAL de hoje
   p1 · Não sei · cabo   primário=True   Atenção: conta='nenhum aviso'
   [daemon mudo] dublê: o serviço não respondeu           (no stderr, 25 vezes)
        ↑ a tela CONGELADA afirmando dois controles, sem uma palavra

cena 5  o estado VAZIO chega ao pacote              ← o dublê que a sprint pede
   p1 · P1 • Desconectado   primário=False   Atenção: conta='1 aviso'
   [SERVIÇO] O Hefesto está desligado. Esta tela parou de ler o serviço: o modo,
             os controles e a carga não estão sendo afirmados. Ela volta sozinha
             quando o serviço responder.
```

**A cena 5 acende NAS DUAS PÁGINAS** — bancada e publicada —, porque ela usa os
endereços `aviso-selo`/`aviso-texto`, que o produto já tem. **Este passo não
espera publicação.**

---

## 4. AS MUTAÇÕES POR TIQUE, com a mesa parada

A régua da `A-TELA-SAMBA-01`, uma aba por execução:

```
$ hefesto_vivo.py --oculta --abre 01 --conta-mutacoes 100     # a página PUBLICADA,
                                                              # com o daemon dela vivo
MUTAÇÕES DE DOM em 100 tiques (10.1 s) na 01-jogar.html, com a mesa parada
TOTAL: 0 mutações · 0.0 por tique
voltas: 121 · tiques 121 · pinturas 3 · valores 36
custo do tique: mediana 2.53 ms · max 13.70 ms · teto 100 ms
```

E a mesma medida **na BANCADA**, com os dois endereços novos, dentro do ensaio
(100 repinturas da MESMA carga):

```
MUTAÇÕES com a mesa parada: {'primeira': 0, 'depois': 0, 'voltas': 100}
```

**ZERO nos dois.** Os dois alvos novos (`classe` e `atributo`) comparam antes de
escrever, então uma carga repetida não mexe um nó.

**E o perfil dela não mudou:** `md5sum ~/.config/…/profiles/*.json | md5sum`
deu `7dc31eb50bc00cbef536649eb88378aa` antes e depois da execução do piloto.

---

## 5. O QUE ESTA SPRINT NÃO PODE FECHAR — os relatos, com endereço

### 5.1 A metade do Passo 5 que é do piloto — UMA LINHA

```
src/hefesto_dualsense4unix/interface/hefesto_vivo.py, `_tique`:

    try:
        st = mesa_viva.estado_do_daemon()
    except Exception as e:
        print(f"[daemon mudo] {e}", file=sys.stderr)
        return True          ← sai SEM chamar o pacote
```

Com o socket fechado o pacote da aba **nunca roda**, então a linha do serviço
calado não tem como acender no caminho real — só no dublê de estado vazio.
Medido acima (cena 4 × cena 5).

**A cura é trocar o `return True` por seguir com `st = {}`**, que é o estado que
todas as guardas desta aba já sabem tratar (`_estado_da_tela`, `_frase_da_mesa`,
`_ressalva_da_mascara`, `_pendencia` abrem todas com `if not state`) e que o
molde já converte em travessão. **`interface/hefesto_vivo.py` é `nao_toca` desta
sprint e posse da `ONDA5-P-01`**, que continua `aberta`.

### 5.2 A palavra "mesa" numa frase que a aba 01 põe na tela DELA hoje

```
src/hefesto_dualsense4unix/app/actions/home_actions.py:1342
    "mesa para alimentá-lo. Ligue um controle para o jogo receber "
src/hefesto_dualsense4unix/app/actions/home_actions.py:1697
    return f"{total} controles na mesa: {pelo_hefesto} e {quantos_veem}"
```

A primeira é a ponte *"de pé, e vazia"*, e ela **chega à coluna Atenção da aba
01 desde 04/09** — logo a palavra que ela baniu está na tela dela hoje.

**E QUEM DEVERIA TIRÁ-LA NÃO ALCANÇA:** a `A-PALAVRA-MESA-SAI-01` declara
`src/hefesto_dualsense4unix/app/` no **`nao_toca`** dela, e roda **depois** desta
sprint. Não a curei porque é texto de tela em posse alheia e a frase serve
também à janela GTK — mas o buraco é estrutural e precisa de decisão de quem
coordena: ou aquela sprint ganha `app/actions/home_actions.py` na posse, ou nasce
uma linha para as duas frases.

Minha régua mede a palavra **só nas frases desta posse**, e o comentário dela
carrega este endereço — uma régua vermelha por dívida alheia é a que alguém
desliga.

### 5.3 A frase da PAUSA manda procurar uma aba que não existe

```
"O Hefesto está em pausa: … Para voltar, use o atalho do controle (PS + Options)
 ou a aba Emulação."      ← home_actions.texto_da_pausa
```

**Não há "aba Emulação" na interface nova** (as dez são Jogar, Controles,
Gatilhos, Iluminação, Vibração, Navegação, Lançadores, Conexões, Sistema,
Perfis), e o glossário proíbe *"qualquer frase que mande a pessoa procurar um
botão ou uma janela que não existe"*. A frase chega à coluna Atenção da aba 01
com o daemon pausado — medido nesta árvore. Mesmo dono, mesma posse alheia que
a §5.2.

### 5.4 As CINCO linhas de recado da §3 — o canal não chegou

A `ONDA5-P-01` continua **`aberta`**: `pintar_recados` ainda conhece dois lugares
(cartão e tarja), e não há o terceiro. Então **relato as cinco**, com o endereço
do dado que ninguém lê:

| o que falta | o dado, e onde ele está |
| --- | --- |
| a frase da PAUSA no lugar da promessa do modo | **já chega à coluna** (§2). O que falta é a SUBSTITUIÇÃO que a GTK faz (`home_actions._home_mode_desc`, `:2614`): com a pausa, a descrição do modo SAI da tela em vez de ganhar um vizinho |
| "entrei em Navegação e o mouse/teclado está desligado" | `home_actions.texto_do_desktop_sem_emulacao` (`:907`) — função pura, nenhum pacote a chama |
| aviso de grab dobrado no cartão | `home_actions.aviso_de_grab` (`:1539`), sobre `primary_grab_state`; a condição de três termos já é pura e testável. Medido: `primary_grab_state='off'` hoje |
| o recibo do "Reconectar" | `home_actions.reconciliar_toast` (`:966`). O gesto dispara os dois `p.chamar` sem olhar o retorno; `ponte.chamar_detalhado` devolve `(ok, motivo)` e não é usado |
| a dica do "Reconectar" com jogo aberto | `home_actions.RECONCILIAR_JOGO_ABERTO_TEXT` (`:826`) e `jogo_com_autoridade` (`:832`) — `game_signal` não é lido pelo pacote da aba |

E as duas irmãs da mesma §3:

| o que falta | o dado |
| --- | --- |
| o aviso de divergência de máscara | `gamepad_emulation.mascara_divergente`, que o daemon publica; leitor pronto em `home_actions.mascara_divergente_do_daemon` e frase em `texto_da_divergencia`. Nenhum arquivo de `interface/` lê a chave |
| a linha de origem ("ligado pelo perfil ativo") | `native_mode_origin` e `mode_from_profile` (`home_actions.py:2873`) — não lidos pelo pacote da 01 |

### 5.5 O cartão de um lugar VAZIO não tem endereço nenhum

Medido no WebKit: os cartões `p3` e `p4` do desenho nascem `class="cartao off"`
(`aba01.cartao`, ramo do lugar vazio) e **não têm `data-campo` nenhum** — nem os
antigos (`jogador`, `identidade`, `bateria`), nem os dois novos. Quando um
controle chega no `p3`, o passo `1c` do piloto reabre o cartão e ele continua sem
endereço até a próxima remontagem.

**Não é defeito desta sprint** (vale igual para os sete campos que já existiam) e
não o curei porque muda o desenho do lugar apagado, que é decisão dela de 31/08.
Está aqui porque a **`MESA-DE-QUATRO-01`** vai bater nele.

---

## 6. AS NOVE MORDIDAS — arrancadas, e a saída colada

A árvore voltou byte-idêntica depois de cada uma.

### 1 — o marcador do primário acende sempre

```
$ pytest -k "marcador or true_literal"     → rc=1
E  AssertionError: um cartão que não é o primário acendeu
E  assert '1' == ''
E  AssertionError: sem a chave, o cartão afirmou
2 failed, 23 deselected
```

### 2 — a marca da degradação lê SÓ o backend (a segunda condição arrancada)

```
$ pytest -k degradacao                     → rc=1
E  AssertionError: a marca acendeu com o backend `uinput` e SEM motivo — é a
E  máscara Xbox por desenho, e alarme sem medição é o que ela baniu em 31/08
1 failed, 24 deselected
```

### 3 — o serviço calado deixa de dizer

```
$ pytest -k servico_calado                 → rc=1
E  AssertionError: a coluna Atenção ficou calada com o serviço calado — e a
E  conta ao lado diz 'nenhum aviso', que é a tela afirmando sobre um estado que
E  ninguém leu
E  assert 'SERVIÇO' in ['', '', '', '', '', '']
1 failed, 24 deselected
```

### 4 — a gravação no perfil arrancada do gesto do chip (ela morde DUAS vezes)

```
$ pytest -k "perfil_ativo or declaracao"   → rc=1
E  AssertionError: a aba 10 continua vendo 'none' depois de o chip Xbox ser
E  clicado na 01 — a escolha dela não atravessou as duas telas
E  AssertionError: declaração(ões) que a árvore não confirma:
E    01-jogar.html·modo-xbox declara `grava='gravar_o_modo_no_ativo'` e a
E    árvore acha NADA
2 failed, 1 passed
```

*A segunda é a régua de proteção percebendo que a declaração ficou órfã — é a
DIREÇÃO B, que existe para a declaração não virar ruído.*

### 5 — o marcador perde o alvo de pintura (no GERADOR)

```
$ python3 aba01.py                         → rc=1
ERRO em 01-jogar — decisão dela desfeita:
  - esperava 2 marcadores de primário endereçados (`marcador-principal` com
    alvo `classe`), achei 0
```

### 6 — o marcador REUSA a classe `.cartao.alvo` (o erro que a sprint avisa)

```
$ python3 aba01.py                         → rc=1
ERRO em 01-jogar — decisão dela desfeita:
  - o número de cartões com a classe `alvo` mudou — o marcador do primário não
    pode andar junto com o alvo de edição da fita
```

### 7 — a marca da degradação nasce com o motivo cravado no desenho

```
$ python3 aba01.py                         → rc=1
ERRO em 01-jogar — decisão dela desfeita:
  - a marca de degradação nasce com o motivo cravado — ela acenderia no desenho
    sobre um controle que ninguém mediu   (duas vezes, um por cartão)
```

### 8 — a palavra de máquina na frase de tela

```
$ pytest -k fala_de_maquina                → rc=1
E  AssertionError: a palavra 'uinput' chegou a texto de tela: 'O Hefesto está
E  desligado. Esta tela parou de ler o serviço: o modo, os controles e a carga
E  (uinput) não estão sendo afirmados. (…)'
```

### 9 — a máscara do disco apagada por um clique que não a escolheu

```
$ pytest -k secao_do_modo                  → rc=1
E  AssertionError: a máscara do disco foi apagada por um clique que não a
E  escolheu — é a cicatriz do `or "xbox"` pelo avesso
E  assert ProfileModeConfig(kind='gamepad', gamepad_flavor=None).gamepad_flavor
E         == 'xbox'
```

---

## 7. O TEXTO PRONTO DAS LINHAS DO CSV DA PARIDADE

`docs/data/paridade-gtk-html.csv` está no meu `nao_toca` (é da
`PARIDADE-REMEDIR-01`). **Os endereços abaixo foram lidos no código de hoje,
nesta árvore, um a um** — nenhum veio copiado de outro relatório.

### linha 5 — *O modo/máscara escolhidos entram no perfil que ela salva*

* **veredito:** `IGUAL`
* **sinal:** `gravar_o_modo_no_ativo` · **PRESENTE** · escopo
  `src/hefesto_dualsense4unix/interface/pacotes/perfil.py`
* **html_onde:** `src/hefesto_dualsense4unix/interface/pacotes/perfil.py:408 ·
  src/hefesto_dualsense4unix/interface/pacotes/perfil.py:446 ·
  src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:1396 ·
  src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:1414`
* **html_faz:** o interruptor e os três chips da fileira Modo gravam a escolha
  na seção `mode` do perfil ATIVO, depois de o plano de IPC sair — pelo mesmo
  dono que a aba Perfis usa. `"none"` remove a seção, a máscara é zerada fora do
  modo jogo e preservada dentro dele, e a gravação nunca levanta.
* **porque:** a FORMA difere e a decisão é dela: na GTK a escolha é recolhida no
  "Salvar" (`recolher_escolha_pendente_no_rascunho`); aqui o clique já aplica e
  já grava (D1/D2, 01/09). O DADO passou a ser o mesmo, e a régua mede isso pela
  outra tela — `test_o_modo_clicado_entra_no_perfil_ativo` lê o valor por
  `perfis_web._pacote_do_editor`, que é o que o quadro «Modo» da aba 10 mostra.

### linha 18 — *O marcador 'primário' no card do controle principal*

* **veredito:** `IGUAL`
* **sinal:** `data-campo="marcador-principal"` · **PRESENTE** · escopo `LADO-HTML`
* **html_onde:** `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:402 ·
  src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:573 ·
  src/hefesto_dualsense4unix/interface/aba01.py:1087 · mockup/01-jogar.html:2219`
* **html_faz:** o cartão do primário acende a palavra «primário» na linha
  secundária, com a razão no ponteiro do mouse; `is_primary is True` é a única
  coisa que a acende, e a classe é própria — `.cartao.alvo` continua respondendo
  só pelo alvo de edição da fita.
* **porque:** a palavra é a da janela GTK (`home_actions.py:1573`,
  `_format_controller_subtitle`) e há régua que lê aquele fonte. **ESPERA
  PUBLICAÇÃO:** o endereço vive em `mockup/01-jogar.html`, declarado em
  `mockup/DIVERGENCIAS.md`; a página publicada ainda não o tem.

### linha 32 — *Banner de degradação do vpad*

* **veredito:** `IGUAL`
* **sinal:** `gamepad_emulation.backend` · **PRESENTE** · escopo `LADO-HTML`
* **html_onde:** `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:579 ·
  src/hefesto_dualsense4unix/interface/pacotes/__init__.py:1062 ·
  src/hefesto_dualsense4unix/interface/aba01.py:1087`
* **html_faz:** DOIS lugares, e cada um responde por uma pergunta diferente — o
  da MÁQUINA já chegava à coluna Atenção com o selo `GAMEPAD`
  (`painel.AVISOS_DA_TELA` → `home_actions.vpad_degradation_text`, desde 03/09),
  e o daquele APARELHO nasceu hoje no cartão (`pacotes.degradacao_de`, que
  delega a `controller_card.texto_degradacao`).
* **porque:** o `html_faz` antigo dizia *"nada"* e media só o lado do aparelho —
  a metade de página estava fechada havia três dias. As duas condições (backend
  degradado E motivo) continuam tendo UM dono; a marca some sem motivo, porque
  a máscara Xbox é `uinput` por desenho e não é defeito. **ESPERA PUBLICAÇÃO.**

### linha 38 — *O que a aba faz quando o daemon está DESLIGADO*

* **veredito:** `PARCIAL`
* **sinal:** `O Hefesto está desligado.` · **PRESENTE** · escopo `LADO-HTML`
* **html_onde:** `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:242 ·
  src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:866 ·
  src/hefesto_dualsense4unix/interface/hefesto_vivo.py:2631`
* **html_faz:** com o estado vazio a coluna Atenção acende a linha do selo
  `SERVIÇO`, com a frase da janela GTK, e a aba para de afirmar: interruptor,
  chip, cadeado e frase da mesa saem vazios e os quatro cartões recebem
  travessão pelo molde.
* **porque:** **PARCIAL e não IGUAL**, e a metade que falta tem endereço: o
  `_tique` do piloto imprime `[daemon mudo]` e RETORNA quando
  `mesa_viva.estado_do_daemon` levanta, então o pacote não chega a ser chamado
  no caminho real. `hefesto_vivo.py` é posse da `ONDA5-P-01`, e a cura é trocar
  o `return True` por seguir com `st = {}`. A GTK ainda faz uma coisa a mais que
  esta tela não faz: GUARDAR a escolha pendente para reaparecer quando o daemon
  voltar.

### linha 27 — *A linha 'Ponte com o jogo'*

* **veredito:** `IGUAL`
* **sinal:** `SELO_DA_PONTE` · **PRESENTE** · escopo `LADO-HTML`
* **html_onde:** `src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:914 ·
  src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py:164`
* **html_faz:** a ponte entra na coluna Atenção com o selo `PONTE`, e **só
  quando é má notícia** — quem decide é a COR que o produto pinta
  (`home_actions._COR_AVISO`), não uma segunda lista de perguntas.
* **porque:** fechou em 04/09 pela decisão `01[01]` (*"Na coluna Atenção, só má
  notícia"*), e o `html_faz` do CSV ficou no dia anterior. A régua é
  `test_a01_a_ponte_entra_na_coluna.py`; a mordida das CINCO frases contra as
  palavras proibidas nasceu em 06/09, em
  `test_a_aba_01_jogar_fecha_as_linhas.py`.

---

## 8. O QUE EU **NÃO** VERIFIQUEI, dito por inteiro

* **Não rodei a suíte inteira.** Rodei as réguas desta aba (25), a de proteção
  dos gestos (17) e um recorte largo por palavra-chave (`casamento`, `cobertura`,
  `pacote`, `gesto`, `perfil`, `piloto`, `mockup`): **1835 passaram, 7 skips, 1
  xfail**. A suíte inteira é de quem coordena e roda no fim, em lotes.
* **Não cliquei o interruptor com o daemon vivo.** Ele chama `systemctl` na
  máquina dela; o caminho é medido por régua de unidade e pelo IPC do dublê.
* **Não medi na mesa de QUATRO.** O dublê tem dois controles; havia UM DualSense
  real no cabo durante a sessão (`jogar_vivo --bancada` viu `1 controle(s): P1
  Não sei cabo`). A `MESA-DE-QUATRO-01` é quem mede isso.
* **Não vi a marca do primário com o aparelho real** — o `is_primary` do dublê é
  escrito por mim. A leitura do campo é do daemon e a régua cobre o mapeamento;
  o que não foi visto é a mesa dela com dois controles reais e o primário
  trocando ao vivo.
* **Não publiquei, e não rodei `install.sh`.**
* **Não conferi o custo por tique das duas leituras novas** (`is_primary` e
  `degradacao_de`) isoladamente. O que medi é o agregado: mediana de **2,53 ms**
  por tique contra o teto de 100 ms, e ZERO mutações em 100 tiques.
* **Não sei se ela quer a palavra «primário»** na tela nova. Ela é a que a
  janela antiga já mostra, e há régua que as prende juntas — mas texto de tela é
  palavra dela, e o marcador está declarado em `mockup/DIVERGENCIAS.md`
  esperando o olho dela.
* **Não medi a aba 01 com o `--prova-de-mockup`** nem com o `--prova-gesto` do
  `jogar_vivo`: o primeiro passeia pelas dez abas e o segundo mede a bancada
  antiga, que não pinta os endereços novos.

---

## 9. OS PORTÕES

Rodados com `git add -A` antes, como manda a casa.

```
$ git add -A && bash scripts/portoes.sh
REPROVOU: 1 vermelho(s) de 44 -> paridade-gtk-html
```

**43 verdes. O vermelho é UM, e ele é DESENHADO.**

### `paridade-gtk-html` — VERMELHO, e o motivo é o `nao_toca`

```
FALHA: 3 achado(s) em docs/data/paridade-gtk-html.csv.

  divida-fechada: paridade-gtk-html.csv:18  [01-jogar] O marcador 'primário' no card
    o sinal 'data-campo="marcador-principal"' APARECEU em …/interface/aba01.py.
    O CSV diz FALTA_NO_HTML e o lado HTML passou a ter o símbolo.
  divida-fechada: paridade-gtk-html.csv:32  [01-jogar] Banner de degradação do vpad
    o sinal 'gamepad_emulation.backend' APARECEU em …/interface/pacotes/a01_jogar.py.
  divida-fechada: paridade-gtk-html.csv:38  [01-jogar] O que a aba faz quando o
                                            daemon está DESLIGADO
    o sinal 'O Hefesto está desligado.' APARECEU em …/interface/pacotes/a01_jogar.py.
```

**Os três achados são a entrega funcionando**: o portão viu as dívidas fecharem
e cobra que o CSV seja remedido. `docs/data/paridade-gtk-html.csv` está no
`nao_toca` desta sprint e é da `PARIDADE-REMEDIR-01` — **o texto pronto das
quatro linhas está na §7**, com o endereço lido no código de hoje.

É a mesma forma que a `ONDA3-GESTO-DECLARA-01` deixou hoje de manhã (três
`sinal-sumiu` no mesmo portão, pelo mesmo `nao_toca`): quem costura leva o
vermelho junto e ele fecha quando o CSV for remedido.

### O que passou, e a conta

| camada | verdes |
| --- | --- |
| `--rapido` | 27 de 28 (o `paridade-gtk-html` é o vermelho) |
| completos | 16 de 16 — inclusive `casa-sabe` (105 s), `acentuacao` (65 s), `shellcheck`, `mypy`, `anonimato` e `desenho-aprovado` |

**Três vermelhos nasceram nesta leva e fecharam antes de eu terminar**, e ficam
escritos porque cada um ensina:

1. **`nada-aponta-para-a-janela`** — a minha régua importava
   `gui.aba_sistema.sem_markup` para tirar o markup do Pango das cinco frases da
   ponte. **A janela GTK está sendo aposentada** (`D-0609-GTK-LEVA-INTEIRA`) e
   toda citação nova a ela reprova. A cura foi medir o markup CRU: `<span
   foreground="#50fa7b">` não tem palavra de máquina nenhuma, e quem tira o
   markup no produto é `_aviso_da_ponte`;
2. **`referencias-docs`** — a nota datada que escrevi no frontmatter da sprint
   citava este relatório antes de ele existir. Fechou ao escrever o arquivo;
3. **`acentuacao`** — sete identificadores do ensaio (`primario`, `atencao`,
   `acao`) em chave de JSON e nome de parâmetro. Fechou com `# (noqa-acento)` na
   forma que a casa usa — **entre parênteses, e não `# noqa-acento:`**, porque a
   segunda forma o `ruff` lê como diretiva inválida e avisa.

### A suíte

Não a rodei inteira (é de quem coordena, e roda no fim, em lotes). O que rodei:

```
tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py           25 passed
tests/unit/test_todo_gesto_que_grava_esta_protegido.py      17 passed
tests/unit/test_a01_*.py + as outras nove réguas da aba    119 passed
-k "casamento|cobertura|pacote|gesto|perfil|piloto|mockup" 1835 passed, 7 skipped, 1 xfail
```

