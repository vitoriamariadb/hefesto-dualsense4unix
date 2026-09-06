# GTK-2 — os leitores do glade ganham dono no motor

**06/09/2026 · árvore `hefesto-voo/GTK-2-C-GTK-2`, branch `voo/GTK-2-C-GTK-2`,
nascida de `onda/atual-0609` em `3f6855a6` (conferido: `git log --oneline -1`).**

> **A decisão dela** (`D-0609-GTK-LEVA-INTEIRA`): *"a ideia sempre foi
> reaproveitar o que fiz no gtk e não apontar nada mais pra lá mas pro html"*.
> **O motor fica; a janela sai.**

**O QUE ESTA SPRINT ENTREGA, em uma frase:** o `gui/main.glade` pode ser
apagado — e está PROVADO apagando, não argumentado.

---

## 0. AS DUAS CORREÇÕES DE ENUNCIADO, e as duas são entrega

### 0.1 São DOIS textos de tela na aba 05, não três

A sprint (§1.1, §2 Passo 1) e o nome do arquivo de teste que a posse pedia
(`test_os_tres_textos_da_vibracao_tem_dono.py`) dizem **três**. Medido: são
**dois**. A terceira era *"Espera 5 segundos antes de trocar de faixa"*, que
explicava o Modo Auto — e o Auto saiu desta tela em **05/09/2026**, por decisão
dela (*"segue os três modos sempre"*). A árvore já sabia disso: o cabeçalho de
`tests/unit/test_a_05_vibracao_diz_a_forca_que_ela_escolheu.py:307` diz
*"as frases que a janela estável tem — **DUAS** desde 05/09/2026"*.

Por isso o arquivo de régua **não** leva o número no nome: ele se chama
`tests/unit/test_os_leitores_do_glade_tem_dono.py`, e cobre os três LEITORES
(que continuam sendo três), não os textos.

### 0.2 O `i18n_extract.sh` NÃO "extraía menos e não reclamava"

A sprint (§1.3) diz: *"Sem o glade, ele extrai menos e não reclama."* **Medido,
o comportamento é outro — e o estrago é em dois lugares, não um:**

```
$ rm src/hefesto_dualsense4unix/gui/main.glade
$ bash scripts/i18n_extract.sh
[1/3] extraindo strings Python...
[2/3] extraindo strings do Glade...
xgettext: não foi possível ler .../main.glade: failed to load external entity
rc=1
```

O `set -euo pipefail` mata o script no passo [2/3]. Ele não extrai menos: ele
**para**. O que é calado é o que sobra:

| o que fica calado | medida |
| --- | --- |
| o `po/*.pot` fica com o conteúdo **de ontem** — segue publicando as frases de uma janela que já não existe | **413 msgid**, dos quais **317 referências apontam para o `main.glade`** |
| o `rm -f` do passo [3/3] nunca roda: o parcial fica no `po/` | `po/hefesto-dualsense4unix.pot.python`, 17 KB |
| a mensagem que se vê é do gettext e não nomeia nem a causa nem a decisão | `failed to load external entity` |

**77% do catálogo é a janela que está saindo** (só o Python dá 114 msgid).

---

## 1. O QUE FECHOU

### Passo 1 — as duas frases da vibração mudaram de dono

| | antes | depois |
| --- | --- | --- |
| dono | `gui/main.glade`, lido por `aba05._do_glade` (`:273`) | `app/telas/vibracao.py` |
| a aba 05 | abria o XML no corpo do módulo e casava `re.search` por âncora | **lê** do dono novo, pelo `import` que já existia (`aba05.py:67`) |

O bloco `_GLADE` + `_do_glade` + as duas chamadas saiu de `aba05.py`; as duas
constantes entraram em `vibracao.py` com o comentário inteiro (a razão de 26/08
**não se revoga**: muda o dono, não a regra). Os nomes públicos são os mesmos
(`DICA_DO_TETO_DA_MESA`, `DICA_DOS_VALORES_QUE_PASSAM`), então os nove
chamadores em `aba05.py` e as duas réguas de fora não mudaram uma linha.

**As frases são byte-idênticas às do glade** — conferido pelo próprio padrão do
gerador, e a página gerada saiu igual: o `git diff` do
`mockup/05-vibracao.html` depois de regerar tem **uma linha**, e é a contagem
de transporte que vem do daemon vivo (`1 USB · 1 BT` → `0 USB · 0 BT`) — a
mesma linha que o gerador ANTES da mudança já produzia.

**A recusa não se perdeu, mudou de lugar.** O `_do_glade` derrubava o gerador
com `SystemExit` quando a âncora sumia. Agora quem recusa é
`test_enquanto_o_glade_existir_as_duas_telas_dizem_o_mesmo`, que compara o dono
novo com as âncoras do XML — e que **se cala sozinho** (`skipif`) no dia em que
a `GTK-3` apagar o arquivo, em vez de virar vermelho herdado.

### Passo 2 — o `storm_doctor` parou de mentir quando a fonte some

Ele continua **macio** (a frase nunca some), mas o silêncio acabou:

* `_ROTULOS_DE_RESERVA` registra `{id do widget: rótulo que saiu}`;
* `rotulos_de_reserva()` publica a lista;
* um `warnings.warn` sai na primeira vez, por id;
* **`storm_report()` CONSOME a lista**: se algum check citou um botão cujo nome
  veio da reserva, o laudo ganha uma linha `[INFO]` dizendo isso. É
  **condicional** e hoje nunca aparece — ela nasce no dia em que o XML sair sem
  que ninguém tenha dado dono ao rótulo, e some no dia em que o dono aparecer.

**O instrumento quase nasceu falso, e o caso que o pegou está na régua.** A
primeira versão marcava a reserva com `alvo == se_faltar`. Isso é falso aqui:
hoje o rótulo do `btn_storm_fix_safe` no glade é **palavra por palavra** o
`se_faltar` desta casa (`"Consertar problemas conhecidos"`), então a comparação
acusaria RESERVA sobre uma leitura que deu certo. A marca é uma bandeira
(`lido_da_fonte`), e `test_a_reserva_fica_vazia_quando_a_leitura_acerta` reprova
se alguém a trocar de volta.

### Passo 3 — o `i18n_extract.sh` aponta para a casa nova, ou para

* uma guarda no topo: sem o `$GLADE`, ele **para e explica** — nomeia o
  arquivo, cita a decisão (`D-0609-GTK-LEVA-INTEIRA`), diz que as frases da
  interface nova não têm extrator hoje, diz **por que** não segue sozinho (o
  `msgmerge` comentaria ~299 frases em cada `po/*.po`) e diz como seguir;
* `--sem-a-janela` gera o catálogo só do Python **e diz o tamanho do buraco**;
* um `trap ... EXIT` limpa os parciais em qualquer saída — o
  `po/*.pot.python` não fica mais para trás.

Medido nos três caminhos (saídas em
`<scratchpad>/GTK-2-i18n-{A,B,C}.txt`):

| caminho | rc | `.pot` | `po/*.pot.python` |
| --- | --- | --- | --- |
| com o glade | 0 | 413 msgid | limpo |
| sem o glade, sem bandeira | **1**, com a explicação | **intocado** | limpo |
| sem o glade, `--sem-a-janela` | 0, dizendo o que ficou de fora | 114 msgid | limpo |

---

## 2. QUAL MORDIDA PROVA CADA CURA

**A régua é `tests/unit/test_os_leitores_do_glade_tem_dono.py` — 11 casos, e
nenhum deles mede o texto do fonte.** As cinco mordidas foram feitas na árvore,
uma a uma, com a cura devolvida e o verde reconferido depois de cada uma.

### A MORDIDA FORTE — o `main.glade` apagado, e o produto novo de pé

É a que prova a sprint inteira, e ela é **automática**:
`test_a_aba_05_monta_com_o_glade_apagado` copia `src/` + `docs/data` + `assets/`
para um `tmp_path`, **apaga o arquivo de verdade** (`glade.unlink()`), roda o
gerador em subprocesso com `HEFESTO_BANCADA` desviado e exige `rc=0` **e** as
duas frases na página. Nada é remendado; o arquivo não existe.

Feita também à mão, numa árvore descartável de 112 MB fora do repositório:

```
$ ls .../GTK-2-arvore-descartavel/src/hefesto_dualsense4unix/gui/main.glade
ls: não foi possível acessar ...: Arquivo ou diretório inexistente

$ cd .../interface && PYTHONPATH=.../src python aba05.py
05-vibracao: OK, 59 divs · 2 conectado(s) + 2 lugar(es) vazio(s) ·
             motores do mapa: feat-rumble-esquerdo / feat-rumble-direito
rc=0
$ grep -c -F "O Perfil de Bateria pode impor um teto..." mockup/05-vibracao.html   → 1
$ grep -c -F "Os valores acima ainda passam pela intensidade..."                   → 1
```

**E com a cura ARRANCADA** (o `_GLADE = (…).read_text()` devolvido ao corpo de
`aba05.py`, mesma árvore, mesmo glade apagado):

```
FileNotFoundError: [Errno 2] No such file or directory:
  '.../src/hefesto_dualsense4unix/gui/main.glade'
```

— o gerador morre antes de escrever um byte. É este o defeito que a `GTK-3`
encontraria no dia de apagar.

### As outras quatro

| # | o que arranquei | quem reprovou, e com que frase |
| --- | --- | --- |
| 2 | a bandeira `lido_da_fonte` virou `alvo == se_faltar` | `test_a_reserva_fica_vazia_quando_a_leitura_acerta` — *"o produto declarou RESERVA sobre um rótulo que ele acabou de LER"*; e junto `test_o_produto_nao_publica_nenhum_rotulo_de_reserva` |
| 3 | o registro `_ROTULOS_DE_RESERVA[widget_id] = se_faltar` | `test_sem_a_fonte_a_frase_fica_de_pe_e_o_produto_sabe` reprova **só na segunda metade** — a primeira (a frase não some) continua passando, e é esse o ponto |
| 4 | a guarda do `$GLADE` no `i18n_extract.sh` | `test_sem_o_glade_o_extrator_para_e_diz_o_que_sumiu` — *"o extrator seguiu sem a fonte da janela"*. E o que ele fez sem a guarda foi exatamente o defeito: `rc=0`, catálogo menor, calado |
| 5 | a linha da reserva no `storm_report` | `test_o_laudo_diz_quando_o_nome_do_botao_veio_da_reserva` — *"o produto sabe e cala"* |

**A mordida do Passo 2, inteira, com a fonte fora de alcance:**

```
UserWarning: storm_doctor: o rótulo do botão 'btn_storm_fix_safe' não foi lido
  de lugar nenhum e saiu da RESERVA ('Consertar problemas conhecidos'). …
a frase: cura do travamento do USB AUSENTE — … (o botão 'Consertar problemas
         conhecidos' não instala esta cura).          ← a frase NÃO sumiu
reserva: {'btn_storm_fix_safe': 'Consertar problemas conhecidos'}
                                                       ← e o produto SABE
```

E com o glade no lugar, na mesma máquina: `reserva: {}` — o instrumento não
mente sobre a leitura que deu certo.

---

## 3. O QUE AINDA PRECISA DO GLADE DEPOIS DE MIM

### 3.1 Em RUNTIME — seis endereços, e só um é dívida de verdade

| endereço | o que faz | quem resolve |
| --- | --- | --- |
| `src/hefesto_dualsense4unix/app/app.py:283-285` | `builder.add_from_file(MAIN_GLADE)` — **é a janela** | morre com a `GTK-3` |
| `src/hefesto_dualsense4unix/app/constants.py:12` | `MAIN_GLADE = GUI_DIR / "main.glade"` — o caminho canônico | morre com a `GTK-3` |
| `scripts/gui-captura/retratar_abas.py:209` · `retrato_offscreen.py:32` | fotografam a janela GTK | morrem com a `GTK-3` |
| `scripts/validar-palavra-de-tela.py:132,277,347,802,876` | **é PORTÃO** (`palavra-de-tela`, camada `--rapido`): varre o XML atrás de rótulo banido | **`GTK-3` — e é o maior risco escondido da remoção**, ver §3.3 |
| `scripts/i18n_extract.sh:43` | extrai as strings da janela | **feito aqui**: guarda + `--sem-a-janela` |
| `src/hefesto_dualsense4unix/integrations/storm_doctor.py:105` | lê o rótulo vivo do `btn_storm_fix_safe` | **fica de pé sem o arquivo**, e agora avisa. O rótulo continua sem dono novo — §3.2 |

### 3.2 O RÓTULO AINDA NÃO TEM DONO — e o defeito já é VIVO, não futuro

Medido hoje, e **não estava em nenhum arquivo da leva**:

> A frase do `storm_doctor` manda clicar em **`'Consertar problemas
> conhecidos'`** *"na aba Sistema"*. Esse rótulo **não existe na interface que
> ela usa.** Na aba Sistema nova o botão se chama **"Refazer os consertos
> automáticos"** (`interface/paginas/09-sistema.html:1379`,
> `interface/aba09.py:1126`), e `grep -r "Consertar problemas conhecidos"
> src/hefesto_dualsense4unix/interface/` devolve **zero**.

E a frase CHEGA nessa tela: `interface/pacotes/a09_sistema.py:361` chama
`_exame.storm_report(...)` e pinta as linhas na lista do exame. **É o defeito
de 26/08 repetido, com o lado invertido:** naquele dia a frase apontava um nome
que a janela já não tinha; hoje ela aponta o nome que **só** a janela tem.

**Não curei aqui, e a razão é medida, não zelo:** trocar o rótulo faz
`tests/unit/test_steam_input_ponteiros.py` reprovar em dois casos
(`test_botao_citado_pelo_diagnostico_existe_na_janela` e
`test_aba_citada_e_a_aba_onde_o_botao_mora`), porque essas réguas conferem o
rótulo **contra o `main.glade`** — e o arquivo está fora da minha posse. A cura
é de um par (`storm_doctor` + aquela régua), e cabe à `GTK-3` ou a uma sprint
própria. **O diff exato está na §6.**

### 3.3 O PORTÃO `palavra-de-tela` LÊ O GLADE — e ninguém tinha medido

`scripts/validar-palavra-de-tela.py` roda na camada `--rapido` (`portoes.sh:69`)
e a linha `:876` faz `achados.extend(conferir(GLADE))`. Apagar o arquivo faz o
portão **medir uma tela a menos** — e ele é o guarda das palavras banidas. Isto
não aparece em nenhuma linha do plano D-19 nem do inventário da `GTK-1`, porque
o CSV classifica a citação e não pergunta se o citador é portão.

### 3.4 Em TESTE — 64 arquivos de `tests/unit/` citam o `main.glade`

É a conta da `GTK-3` (as 57 linhas `SAI-COM-A-JANELA` do CSV mais as mistas).
Nenhum deles é meu, e a régua que nasce aqui é a única que **quer** o arquivo
apagado: ela o apaga numa cópia.

---

## 4. O QUE NÃO VERIFIQUEI

* **Não abri a tela e não há foto.** Nenhuma frase de tela mudou — as duas
  orações da aba 05 são byte-idênticas às de antes, e a prova disso é o
  `git diff` de uma linha na bancada regerada (e essa linha é do daemon vivo,
  não do meu diff). Não havia mudança visual a fotografar, e não inventei uma.
* **Não rodei a suíte inteira** (regra da casa: é de quem coordena, e roda no
  fim). Rodei os 44 portões e **342 testes** do meu escopo — as 18 réguas de
  vibração, `test_steam_input_ponteiros`, `test_steam_input_d33_nomeia_o_jogo`,
  `test_emulation_mic_quirk`, `test_nada_novo_aponta_para_a_janela`,
  `test_rumble_mult_um_dono` — todos verdes.
* **Não medi o que a remoção do glade faz aos 64 arquivos de teste.** É da
  `GTK-3` e não me cabia.
* **Não toquei em `tests/unit/test_a_05_vibracao_diz_a_forca_que_ela_escolheu.py`**,
  que continua lendo o XML direto (`:337,:352`) para comparar com a bancada.
  Ele passa hoje; quando o glade sair, esses dois casos precisam apontar para
  `app/telas/vibracao`. Está fora da posse — o diff está na §6.
* **Não rodei `--podar`** no CSV do inventário: ele é do coordenador. Os números
  exatos estão na §5.
* **Não parei o daemon nem toquei na bancada** (`scripts/bancada.sh exigir` não
  foi preciso: nada aqui escreve no aparelho, para serviço ou chama
  `systemctl`). O único ponto em que a árvore foi tocada e devolvido foi o
  `mockup/05-vibracao.html`, reescrito por importar `aba05` e revertido com
  `git checkout` — e a régua nova **desvia a bancada por `HEFESTO_BANCADA`**
  justamente para não repetir isso.

---

## 5. AS LINHAS DO CSV QUE O MEU TRABALHO MUDA — texto pronto

`docs/data/o-que-ainda-aponta-para-a-janela.csv` é do coordenador. **Fiz UMA
edição nele e ela era inevitável:** declarei o arquivo de régua novo, porque
sem isso o portão `nada-aponta-para-a-janela` fica VERMELHO com
`CITAÇÃO NOVA`, e a entrega pede os 44 verdes. A linha inserida (depois de
`test_o_teto_da_vibracao_e_por_controle.py`) é:

```
tests/unit/test_os_leitores_do_glade_tem_dono.py,1;6;25;56;106;134;149;165;196;245;259;277;338;391,gui/main.glade,código+prosa,14,"quem cita? a régua da GTK-2, que PROVA que o produto novo fica de pé sem o arquivo",MOTOR-MUDA-DE-CASA,"nasceu na GTK-2 (06/09/2026) e cita o alvo de propósito: ela APAGA o `gui/main.glade` numa cópia descartável e exige que a aba 05 continue montando. Enquanto o XML existir, ela também compara as duas telas palavra por palavra; quando ele sair, os três casos que dependem dele se calam por `skipif` e o resto continua medindo o dono novo (`app/telas/vibracao`). A GTK-3 reescreve as âncoras, não apaga o arquivo"
```

**Nada mais foi editado.** As três linhas abaixo mudaram de estado e o texto
está pronto para quem for passar o pente (o portão aceita a diminuição hoje —
ela sai como `(a lista encolheu: … Rode --podar)`, não como vermelho):

**1. `interface/aba05.py` — de 5 citações para 4, e o veredito FECHOU.** A
única citação em CÓDIGO era a `:273`, e ela morreu. As quatro que sobram são
prosa datada (o bloco que conta a história e duas notas na dica):

```
src/hefesto_dualsense4unix/interface/aba05.py,263;275;1761;1779,gui/main.glade,prosa,4,quem cita? a INTERFACE NOVA (prosa),NUNCA-DEVIA-CITAR,"FECHADO NA GTK-2 (06/09/2026): a citação de CÓDIGO (`:273`, o `read_text` do XML no corpo do módulo) saiu — o dono das duas frases é `app/telas/vibracao`. As quatro que sobram são prosa datada, que esta casa não apaga"
```

**2. `interface/pacotes/a01_jogar.py:814` — o número de 0,79 ms.** Ele mede a
PRIMEIRA leitura do glade por `storm_doctor.rotulo_do_botao`. Depois desta
sprint o caminho continua existindo (o `storm_doctor` ainda lê), então **o
número segue válido** — o que muda é que ele passa a ter data de validade
conhecida. Sugestão de acréscimo à razão, sem mudar o veredito:

```
… || GTK-2 (06/09/2026): o caminho continua, e o número continua. Quando a GTK-3 apagar o XML, esta leitura passa a cair na RESERVA — o custo vira ~0 ms e o `storm_report` ganha uma linha [INFO]. Remedir então.
```

**3. `integrations/storm_doctor.py` — 5 citações, e o veredito NÃO mudou.** Ele
continua `MOTOR-MUDA-DE-CASA` e continua precisando de outra fonte: o que
mudou é que **agora ele avisa** em vez de calar. Sugestão de acréscimo:

```
… || GTK-2 (06/09/2026): a leitura continua macia, mas deixou de ser calada (`_ROTULOS_DE_RESERVA` + `rotulos_de_reserva()` + linha [INFO] no `storm_report`). O RÓTULO segue sem dono novo, e o dono certo é a aba Sistema da interface nova — ver GTK-2.md §3.2 e §6.
```

---

## 6. OS DOIS DIFFS QUE NÃO APLIQUEI — fora da posse

### 6.1 O rótulo do botão aponta para a tela dela (par obrigatório)

Os dois lados têm de ir juntos; aplicar um só reprova.

**(a) `src/hefesto_dualsense4unix/integrations/storm_doctor.py`** — dois
`se_faltar`, `:477` e `:615`:

```diff
-        f"'{rotulo_do_botao('btn_storm_fix_safe', 'Consertar problemas conhecidos')}' "
+        f"'{rotulo_do_botao('btn_storm_fix_safe', 'Refazer os consertos automáticos')}' "
```

**(b) `tests/unit/test_steam_input_ponteiros.py`** — as três funções de leitura
(`_paginas`, `_aba_do_botao`, `_rotulos_de_botao`) passam a ler os `<button>`
de `src/hefesto_dualsense4unix/interface/paginas/*.html` em vez dos
`GtkButton` do `main.glade`, e `_ABA_CITADA` passa a casar com o nome da aba do
arquivo (`09-sistema.html` → *"Sistema"*). É reescrita, não um `sed`: a
docstring do arquivo (*"o botão é um `GtkButton` do `gui/main.glade`"*) é o
contrato que muda.

**Enquanto o par não for feito, a frase que ela lê na aba Sistema manda clicar
num botão que não está lá.**

### 6.2 A régua da aba 05 que ainda lê o XML

`tests/unit/test_a_05_vibracao_diz_a_forca_que_ela_escolheu.py:314-341` — o
`NO_GLADE` e o `test_as_frases_da_janela_estavel_estao_na_aba`:

```diff
-    glade = (RAIZ / "src/hefesto_dualsense4unix/gui/main.glade").read_text()
-    for nome, padrao in NO_GLADE.items():
-        achado = re.search(padrao, glade, re.S)
-        assert achado, f"{nome} saiu do glade — a âncora do gerador também cai"
-        frase = html.unescape(achado.group(1)).strip()
+    from hefesto_dualsense4unix.app.telas import vibracao
+    for nome in ("DICA_DO_TETO_DA_MESA", "DICA_DOS_VALORES_QUE_PASSAM"):
+        frase = getattr(vibracao, nome)
         assert frase in bancada, (
             f"a aba perdeu {nome}: {frase!r}. Regere com `python3 aba05.py`")
```

`test_a_frase_do_auto_nao_volta_a_aba` (`:345`) **fica como está**: ele confere
que a frase dos 5 s continua no glade e **fora** da aba, e é sobre a janela —
sai com ela.

---

## 7. OS ARQUIVOS DESTA ENTREGA

| arquivo | o quê |
| --- | --- |
| `src/hefesto_dualsense4unix/app/telas/vibracao.py` | **dono novo** das duas frases |
| `src/hefesto_dualsense4unix/interface/aba05.py` | o `_GLADE`/`_do_glade` saiu; lê do dono novo pelo import que já existia |
| `src/hefesto_dualsense4unix/integrations/storm_doctor.py` | a reserva deixou de ser calada, e o `storm_report` a consome |
| `scripts/i18n_extract.sh` | guarda, `--sem-a-janela`, `trap` de limpeza |
| `tests/unit/test_os_leitores_do_glade_tem_dono.py` | **novo** — 11 casos, cinco mordidas |
| `docs/data/o-que-ainda-aponta-para-a-janela.csv` | **uma linha**, a declaração da régua nova |
| `docs/process/agentes/2026-09-06/GTK-2.md` | este relatório |

**`interface/aba05.py` não está na lista `posse` do frontmatter da sprint**, mas
a §2 Passo 1 e a §3 dela o autorizam nominalmente (*"Esta sprint toca a linha
273 e o que ela alcança — nada mais da aba 05"*), e a mordida forte é
impossível sem ele. O diff é o bloco `:256-308` e três linhas no `import` do
`:67`, e nada mais da aba. A `ONDA5-05-03`, dona da aba 05, fechou antes
(`depois_de`).

## Comandos, para refazer

```bash
source .envrc-voo
python -m pytest tests/unit/test_os_leitores_do_glade_tem_dono.py -q
python scripts/check_nada_aponta_para_a_janela.py
bash scripts/portoes.sh
```
