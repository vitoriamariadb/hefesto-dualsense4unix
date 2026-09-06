# CONEXOES-LIGAR-TUDO-01 · As dezesseis linhas da 08, e a régua que a costura apagou

**Sprint:** `docs/process/sprints/2026-09-04-CONEXOES-LIGAR-TUDO-01-as-dezesseis-linhas-nas-tres-familias.md`
**Árvore:** `hefesto-voo/CONEXOES-LIGAR-TUDO-01-C-CONEXOES-LIGAR-TUDO-01` · branch
`voo/CONEXOES-LIGAR-TUDO-01-C-CONEXOES-LIGAR-TUDO-01` (de `onda/atual-0609`, `3f6855a6`
— a costura da ONDA B).
**Posse:** `interface/pacotes/a08_conexoes.py` · `interface/aba08.py` ·
`daemon/ipc_handlers.py` · `tests/unit/test_a_aba_08_conexoes_fecha_as_linhas.py`.
**Bancada:** LIVRE o tempo todo, e **não precisei dela**. Nenhuma escrita no
aparelho, nenhum `systemctl`, nenhum pareamento tocado, o daemon nunca parado —
a única conversa com ele foi UM `daemon.state_full`, que é leitura.
`scripts/bancada.sh` não foi reservado.

**`daemon/ipc_handlers.py` NÃO FOI TOCADO** (`git diff` vazio nele), e é decisão
medida — ver §6. As duas citações a `ipc_handlers.py:6435` que o despacho
protege continuam apontando para `_handle_machine_declare`, na linha 6435.

**Portões:** `bash scripts/portoes.sh` → **43 VERDES de 44**, e o único vermelho
é `paridade-gtk-html`, que **é a régua acusando que a dívida FECHOU**:

```
FALHA: 4 achado(s) em docs/data/paridade-gtk-html.csv.
  divida-fechada: :275 [08-conexoes] O hub em comum acima de todos os adaptadores
  divida-fechada: :276 [08-conexoes] As contagens do gabinete
  divida-fechada: :290 [08-conexoes] Alvo de saída — LER DE VOLTA qual é o alvo agora
  divida-fechada: :306 [08-conexoes] Aviso "controle ligado que o sistema não entregou"
```

**O CSV está no `nao_toca:` do meu frontmatter e é do coordenador** (decisão de
coordenação 3 de 06/09). As cinco linhas prontas, com o endereço novo lido no
código, estão na §7.1 — e a quinta (`radio-fragil`) o portão nem vê, porque o
`sinal` dela media a outra cura possível.

**Testes do escopo:** o meu arquivo fecha **45** (eram 32; **nasceram 13**), e os
**55 arquivos** que citam `a08_conexoes`, `aba08`, `08-conexoes`,
`ordens_da_mesa` ou `exame_da_mesa` rodaram juntos. **Não rodei a suíte
inteira** — é de quem coordena. Com a árvore parada: **10 vermelhos, 784 verdes, 7 pulados**, e os dez
estão triados na §10.1.

---

## 0. O ESTADO EM UMA LINHA

Das dezesseis do balde `LIGAR` desta aba, **cinco já estavam fechadas** antes
desta frente, **cinco fecharam aqui**, **uma estava fechada e o CSV não sabia**,
e as cinco que sobram estão nomeadas na §6 com o que as segura. No caminho caiu
**um defeito vivo que a costura de hoje introduziu na minha posse**: a régua de
Desempenho passou a mostrar ZERO controle no rádio com o controle no rádio.

---

## 1. AS DEZESSEIS, REMEDIDAS

A sprint manda remedir (*"a lista é a de partida, não o estado"*). Medido em
06/09 contra o CSV e contra o fonte:

| # | a linha | antes | agora |
| --- | --- | --- | --- |
| 1 | Exame da mesa — quantas conferências rodam, e quando | `DIFERENTE` | **JÁ ESTAVA FECHADA** — ver §5 |
| 2 | Ambiguidade fina das ordens | `FALTA_NO_HTML` | **NÃO TEM SUPERFÍCIE** — ver §5 |
| 3 | Tabela de adaptadores Bluetooth | `IGUAL` | fechou em 04/09 |
| 4 | O hub em comum acima de todos os adaptadores | `FALTA_NO_HTML` | **FECHOU** |
| 5 | As contagens do gabinete | `FALTA_NO_HTML` | **FECHOU** |
| 6 | Medidor de rádio / Desempenho | `DIFERENTE` | **estava QUEBRADO; consertado** — §3 |
| 7 | Rádios vizinhos — a coluna "Onde" | `IGUAL` | fechou em 04/09 |
| 8 | Alvo de saída — LER DE VOLTA | `FALTA_NO_HTML` | **FECHOU** (o `PINTOR-MARCADO-01` desbloqueou) |
| 9 | Microfone — quanto custa de rádio | `IGUAL` | fechou em 04/09 |
| 10 | "A luz não acende" — a RAZÃO | `DIFERENTE` | espera decisão dela — §6 |
| 11 | Aviso da mesa suja | `IGUAL` | fechou em 04/09 |
| 12 | Contagem da seção Gestão de Controles | `DIFERENTE` | é de `gui/aba_conexoes.py` — §6 |
| 13 | Controles EXTERNOS na lista | `FALTA_NO_HTML` | espera o daemon — §6 |
| 14 | Aviso "controle ligado que o sistema não entregou" | `FALTA_NO_HTML` | **FECHOU** |
| 15 | Aviso do Bluetooth nativo frágil | `FALTA_NO_HTML` | **FECHOU** |
| 16 | Ocupação de rádio por adaptador | `IGUAL` | fechou em 04/09 |

---

## 2. O QUE MUDOU — as cinco linhas fechadas

### 2.1 · A 8 — o alvo de saída, LIDO DE VOLTA

**O DEFEITO:** ela clicava "só este" no P2, o gesto chamava
`controller.target.set`, o daemon obedecia — e no tique seguinte a tela
continuava apontando o P1. O `checked` era o do desenho, cravado no HTML.

**O ACHADO QUE ENCURTOU A CURA PELA METADE:** o docstring do gesto `alvo` dizia
que a fita do topo era problema do PILOTO — *"o piloto único chama
`mesa_viva.mesa_do_estado(st, …)` sem o argumento `alvo`, então a fita aponta
sempre para a posição 1. Quem mudar isso é o piloto, não este pacote"*. **A
metade que importa está errada, e foi substituída no lugar:** o destaque da fita
não vem do `.on` que o piloto escreve — vem das regras
`body:has(#gc-pN:checked) .fita .chip:nth-child(n)` que o próprio `aba08.py`
gera, e o CSS da folha diz isso com todas as letras (*"o destaque estático da
fita perde para o do acordeão"*). **Marcar o rádio certo move o acordeão e a
fita juntos**, e os dois são desta posse.

**A CURA:** os cinco `<input type="radio">` do acordeão ganharam
`data-campo="alvo-aberto" data-hef-alvo="marcado"`, e o pacote emite a lista
`[todos, p1, p2, p3, p4]` a partir de `state["output_target_index"]`.

**A CONVERSÃO É O PONTO INTEIRO, e ela atravessa DUAS ORDENS:** o daemon numera
por posição em `controllers` ("0 = primário"); o desenho endereça por `pref`, que
é a posição na mesa **ordenada por número de identidade**. A ponte entre as duas
é o `uniq` — a mesma armadilha que `_indice` já documentava do lado do gesto.

**Ele só pôde nascer agora:** o alvo `marcado` é o décimo do pintor, de 04/09
(`PINTOR-MARCADO-01`, decisão dela). Antes dele nenhum dos nove tocava
`el.checked` — `valor` num `<input type=radio>` escreve a string `"on"`.

### 2.2 · As 14 e 15 — os dois avisos que a Gestão de Controles não dizia

Os dois têm dono no produto, com a frase pronta, e **zero leitor no HTML**:

* **`sem-driver`** — `status_actions.texto_de_controle_nao_adotado`. O defeito
  que ele cura (dois DualSense ligados, a janela mostrando um, e nenhuma pista
  do porquê) voltava inteiro no HTML.
* **`radio-fragil`** — `home_actions.texto_native_bt_fragil`, **com os números**
  dos controles frágeis. A regra dos dois donos é deles: lista vazia com o
  booleano ACESO quer dizer *"não sei quais"*, não *"nenhum"*, e o aviso acende
  sem nomes.

**O `sem_driver` DE ANTES ERA EMISSÃO MORTA EM DOIS NÍVEIS, e foi SUBSTITUÍDO:**
o pacote emitia `"sem_driver": st.get("controles_sem_driver")`, um `dict` que
`pacotes.normalizar` descarta antes da tela, para um endereço que página nenhuma
tinha. A chave saiu; nenhum outro leitor a citava (`grep` em `src/` e `tests/`).

### 2.3 · As 4 e 5 — o que a tabela de adaptadores levanta e não responde

Debaixo da tabela, na MESMA ordem da janela estável:

* **`hub-em-comum`** — `secao_mesa._frase_do_hub_em_comum`: fato, por quê, e o
  conselho **só quando há para onde mandar**. A coluna "Onde está" escreve "Em
  hub" linha a linha e nunca compara as linhas entre si; quem compara é
  `censo_do_barramento.hub_em_comum`, que sobe a cadeia em vez de olhar o pai.
* **`gabinete-contagens`** — `secao_mesa._linhas_do_gabinete`: o que o firmware
  conta e o que o kernel conta **lado a lado**, mais a pergunta. O produto **não
  escolhe** entre os dois números — escolher desenharia um gabinete que ninguém
  tem.

### 2.4 · AS QUATRO SÃO LINHA DE RESSALVA, e é o que as deixa entrar juntas

As quatro usam `monta.ressalva` (a **D-02** dela). Em repouso a folha as apaga
(`.ressalva:has(.nada){display:none}`) e elas medem **ZERO pixel** — medido no
WebKit, §4. Foi isso que permitiu acrescentar quatro avisos a uma aba cuja
"Nada se perdeu" pede zero pixel a mais.

**Elas vão em TODO tique, inclusive caladas.** `monta.NADA_A_DIZER` é uma
escrita, e é ela que APAGA a linha do tique anterior — a chave que só aparece
quando há o que dizer deixa na tela a tinta de antes.

### 2.5 · O CUSTO POR TIQUE, medido antes de entregar

As quatro frases correm a cada 500 ms. Medido nesta bancada, 200 voltas cada:

```
_frase_do_sem_driver         mediana 0,007 ms   max 0,023 ms
_frase_do_radio_fragil       mediana 0,007 ms   max 0,016 ms
_frases_do_gabinete          mediana 0,007 ms   max 0,016 ms
_frase_do_hub                mediana 0,011 ms   max 0,045 ms
```

E o pior caso do hub — o ramo que conta os buracos livres em outra controladora,
que só corre quando HÁ hub em comum — mediana **0,000 ms**, max 0,008 ms sobre
os 38 nós desta casa.

**AS DUAS LEITURAS NOVAS DE `/sys` FICARAM FORA DO TIQUE**, na mesma regra do
`ler_a_mesa`: `listar_entradas()` custa **6,3 ms** (38 nós) e
`censo_do_gabinete.ler_do_disco()` **0,11 ms**; as duas entram UMA vez e são
renovadas pelo **Examinar Portas**, junto com a mesa de rádio e os apelidos do
BlueZ. Os 6 ms caberiam no tique — e é exatamente o raciocínio que o bloco "O
QUE SE LÊ DA MÁQUINA" deste arquivo proíbe.

---

## 3. O DEFEITO VIVO QUE ESTA FRENTE ACHOU — e ele é da costura de HOJE

**A RÉGUA DE DESEMPENHO MOSTRAVA ZERO CONTROLE NO RÁDIO COM O CONTROLE NO
RÁDIO.** Dois pontos, a mesma causa, os dois na minha posse e nenhum meu:

```python
# a08_conexoes._regua_do_radio, depois da costura da ONDA B
no_radio = [c for c in todos if _e_radio(c)]     # `todos` sai de _da_mesa_para_a_regua
...
    onde = rm.adaptador_por_uniq(
        [str(m.get("uniq") or "") for m in ctx.mesa if m.get("via") == "BT"])
```

1. **`_da_mesa_para_a_regua` nunca carregou `transporte`.** A costura trocou o
   `c["via"] == "BT"` por `_e_radio(c)`, e o `c` de lá é o dicionário que aquela
   função devolve — que só tem a PALAVRA (`via`). `_e_radio` lê a chave crua,
   não achou, e respondeu `False` para todo mundo: **`no_radio` ficava sempre
   vazio**.
2. **A sexta comparação de `via` sobreviveu à costura**, na linha do
   `adaptador_por_uniq`: com a `via` carregando "rádio", a lista nascia VAZIA e
   todos os controles do rádio caíam no grupo sem adaptador.

**É EXATAMENTE O SINTOMA QUE O COMENTÁRIO DA TROCA DIZIA ESTAR PREVENINDO** —
*"sem esta troca, esta aba mostraria ZERO controles no rádio com os dois no
rádio — calado, sem log e sem régua vermelha"*. A cura escreveu o defeito que
descrevia, e foi a segunda vez em dois dias que uma prosa desta casa fez isso.

**QUEM REVELOU FORAM DUAS RÉGUAS QUE JÁ EXISTIAM** e que a costura deixou
vermelhas — `test_a_identidade_da_aba08_vem_da_mesa` e
`test_a_regua_do_radio_da_08_nao_e_um_eixo_sozinho`. Confirmado com `git stash`:
as duas reprovam no `3f6855a6` LIMPO, antes de eu escrever uma linha. **Elas
mediam o produto e estavam certas.**

---

## 4. AS DOZE MORDIDAS, com a saída colada

Cada uma arrancou a cura, rodou a régua e viu reprovar; a cura foi devolvida e
as **45** fecharam verdes (eram 32; **nasceram 13**).

```
MORDIDA 1 · o alvo lido pelo índice CRU, sem passar pelo `uniq`
E   AssertionError: o alvo `index: 0` virou 'p1' e o produto põe aquele controle em 'p2'
E   assert 'p1' == 'p2'

MORDIDA 2 · o `None` do daemon tratado como "não sei"
E   AssertionError: ['', '', '', '', '']   ·   assert '' == 'sim'

MORDIDA 3 · o alvo intraduzível vira "todos"
E   AssertionError: assert 'todos' == ''

MORDIDA 4 · a lista do alvo emitida só quando há alvo
E   AssertionError: o pacote deixou de emitir `alvo-aberto` quando não há alvo — a
    tela fica com a marca do tique anterior, apontando o controle de antes

MORDIDA 5 · o aviso do órfão digitado no pacote
E   assert 'Um controle está ligado e não chegou até aqui.'
        == '2 controles estão ligados, mas o sistema não conseguiu entregá-los ao
            Hefesto — … a próxima tentativa é em até 2 minutos. …'

MORDIDA 6 · o órfão ausente devolvendo `""` em vez do marcador
E   assert '' == '<i class="nada"></i>'

MORDIDA 7 · o frágil aceso pelo TAMANHO da lista, não pelo booleano
E   assert '<i class="nada"></i>' == 'Modo Nativo com o controle em Bluetooth: …'

MORDIDA 8 · o frágil sem a guarda do booleano
E   assert 'Modo Nativo com o controle em Bluetooth: …' == '<i class="nada"></i>'

MORDIDA 9 · o gabinete escolhendo UMA das contagens
E   AssertionError: a linha do gabinete perdeu 'Contando pelo que o sistema enxerga, são 15.'

MORDIDA 10 · a régua do rádio sem a chave crua do transporte
E   AssertionError: a régua do rádio não reconhece o controle que está NO rádio —
    a chave crua não viajou junto com a palavra

MORDIDA 11 · um rádio do acordeão sem endereço (no GERADOR)
    ERRO em 08-conexoes — decisão dela desfeita:
      - são 4 rádios do acordeão com endereço e a mesa tem 4 lugares mais o 'todos'
        — a lista do alvo é distribuída por POSIÇÃO, e um endereço a menos aponta
        o controle errado

MORDIDA 12 · uma das quatro ressalvas fora do desenho (no GERADOR)
    ERRO em 08-conexoes — decisão dela desfeita:
      - a linha de ressalva `hub-em-comum` não está na página — o dono da frase
        existe no produto e a tela volta a não ter onde escrevê-la

A CURA DEVOLVIDA: 45 passed
```

### AS DUAS RÉGUAS MINHAS QUE PASSARAM COM A CURA ARRANCADA — e a lição

**Na primeira volta, as mordidas 1 e 4 NÃO MORDERAM.** As duas por motivos
diferentes, e os dois são de instrumento:

1. **A régua do alvo montava a mesa com `player`, e a identidade é `player_slot`.**
   `actions/base.numero_do_controle` lê o SLOT DE SESSÃO; `player` responde outra
   pergunta ("está jogando agora, e como quem?") e é `None` fora do co-op. Com
   `player` as duas ordens COINCIDIRAM na cena, e a mordida que trocava a
   conversão inteira passou verde. *A cena não exercia o cruzamento que o teste
   diz medir.*
2. **A régua da emissão perguntava ao HELPER, não ao `pacote()`.** Ela chamava
   `_alvo_de_saida(ctx)` direto, e a mordida embrulhava a LINHA do `pacote()` num
   condicional — exatamente onde a chave pode sumir. *Régua que não passa pela
   emissão não mede a emissão.*

As duas foram reescritas e as duas mordidas passaram a morder. Fica escrito
porque é a mesma família dos seis instrumentos falsos de 05/09: **o instrumento
respondia sobre outra coisa que não o produto.**

---

## 5. AS DUAS AFIRMAÇÕES DA SPRINT QUE CAÍRAM — medindo

### 5.1 · A linha 1 (*"Exame da mesa — quantas conferências rodam"*) JÁ ESTAVA FECHADA

O CSV a dá como `DIFERENTE` com a medição de **03/09**: *"o tique roda só TRÊS
conferências … abrir a aba não dispara exame nenhum … DUAS das cinco linhas do
Check-up nascem VAZIAS"*. **A cura entrou no mesmo dia**, pela `MIGRA-08-01`:
`_pedir_o_exame_de_entrada()` existe e é chamado na primeira linha de `pacote()`
(`a08_conexoes.py:3020`), em thread, uma vez, como a `app.py:1180` da GTK faz.

**A linha do CSV é a de ontem.** O texto novo está na §7.

### 5.2 · A linha 2 (*"Ambiguidade fina das ordens"*) NÃO TEM SUPERFÍCIE — e não é dívida

O CSV diz: *"com dois adaptadores do mesmo modelo … a ordem do HTML pode nomear
o errado"*. **Medido, e a premissa cai por duas vias:**

1. **O card nomeia o alvo por `ordem.alvo.caminho`** — o endereço de barramento
   (`3-1.2`), que é único por aparelho por construção. Ele não tem como nomear o
   errado.
2. **`ambigua` tem UM consumidor em toda a árvore**, e é
   `ordens_da_mesa.resposta_ao_ja_movi:911` — a resposta do botão **"Já movi —
   reexaminar"**. Esse botão **ela mandou tirar em 31/08** (*"não faz sentido
   termos o examinar e o reexaminar"*), e o CSV registra a decisão duas linhas
   acima. Chamar `identidades(leitura.censo)` aqui refinaria um campo que tela
   nenhuma lê.

O comando que mede: `grep -rn "ambigua" src/ tests/ --include="*.py"` — os
únicos acertos fora de `ordens_da_mesa.py` são prosa sobre desambiguação de
rótulo, de outras abas.

**A linha não é dívida enquanto o "Já movi" não voltar.** Se ele voltar, ela
volta com ele, e aí a cura é uma linha: guardar `identidades(leitura.censo)` no
`_correr_o_exame_completo` e aplicá-la à ordem antes de pintar.

---

## 6. O QUE **NÃO** FECHOU, e o que segura cada uma

| # | a linha | o que segura |
| --- | --- | --- |
| 6 | O SELO DE PROCEDÊNCIA do medidor de rádio | é decisão dela — a **08-Q4**, e a resposta *"só nas frases que não foram medidas aqui"* foi escrita para as três linhas da ORDEM DE SERVIÇO. Se ela vale para o medidor também, é pergunta, não implementação. **A outra metade daquela célula — o *"não sei"* quando o daemon não respondeu — não fechou aqui e é fôlego puro**: `radio_da_mesa` sabe responder, e a pista hoje mostra `0 de 1.600` onde deveria dizer que não sabe |
| 10 | "A luz não acende" — a RAZÃO numa linha VISÍVEL | a razão JÁ chega à tela, no `title` do botão (fechou em 04/09). O que difere é a SUPERFÍCIE: a GTK escreve numa linha abaixo do botão. **Com a `monta.ressalva` agora usada quatro vezes nesta aba, o custo caiu para uma linha de gerador** — mas *onde* a ressalva mora dentro da linha do controle é desenho, e desenho é dela |
| 12 | Contagem da seção Gestão de Controles | **a cura NÃO é desta posse.** Os dois lados contam por donos diferentes: a GTK por `app/mesa.contagem_de_controles`, esta aba por `gui/aba_conexoes.texto_da_contagem:302`, que refaz a conta a partir de `Controle.pelo_radio`. Unificá-las é de quem for dono do `gui/aba_conexoes.py`, e o CSV já diz isso na segunda metade da célula |
| 13 | Controles EXTERNOS na lista | **é a família IPC, e ela não se prova hoje** — ver abaixo |

### 6.1 · POR QUE O `ipc_handlers.py` NÃO FOI TOCADO, e a decisão é medida

A §1 da sprint põe a família IPC no escopo: *"o `state_full` não publica o dado
… método ou campo novo no daemon, e `install.sh` para valer"*.

**Medido no daemon VIVO desta bancada** (um `daemon.state_full`, leitura):

```
chaves de topo: 52
  output_target_index         = 0
  controles_sem_driver        = {"quantidade": 0, "ids": []}
  native_bt_fragil_controles  = []
  tem "controles_externos"?   False
```

As três chaves que as linhas 8, 14 e 15 precisavam **já estavam publicadas** — e
foi por isso que as três fecharam sem tocar o daemon. A que falta é a 13: os
externos só chegam por `controller.list {external: true}`, que é um MÉTODO, e o
tique só tem o `state_full`.

**As duas rotas, e por que nenhuma se entrega hoje:**

* **publicar `controles_externos` no `state_full`** — é uma linha em
  `_handle_daemon_state_full`, e o daemon VIVO é o instalado. Sem `install.sh` a
  chave nova não chega à tela dela, e a régua de tela mediria a ausência dela.
  **`install.sh` é proibido a todo agente**, e com razão: ele reinicia o daemon
  debaixo da mão dela;
* **o piloto chamar `controller.list` por tique** — é `interface/hefesto_vivo.py`,
  que está no meu `nao_toca`, e ainda seria um IPC a mais a cada 500 ms.

**Entregar um campo novo de `state_full` que não se pode provar na tela é
exatamente o instrumento falso que esta casa mede desde 04/09.** Fica RELATADO,
com o diff pronto, para a costura que puder instalar.

---

## 7. O TEXTO PRONTO — o que é do COORDENADOR

### 7.1 · `docs/data/paridade-gtk-html.csv` — cinco linhas, e o portão está VERMELHO por elas

**A PARIDADE DA 08 SOBE DE 29% PARA 39%** quando as cinco entrarem — medido com
`scripts/check_paridade_gtk_html.py --tabela`, que hoje diz
`08-conexoes 49 feats · 14 IGUAL · 21 DIFER · 12 FALTA · 2 SO_HTML · 29%`. Com
as cinco em `IGUAL`: 19 de 49. (A sprint partia de 27%; a ONDA A já a tinha
levado a 29.)

O portão `paridade-gtk-html` acusa `divida-fechada` em quatro (a quinta ele não
vê porque o `sinal` dela era um `data-campo` que a cura não usa). **O CSV está no
`nao_toca:` do meu frontmatter e é do coordenador** (decisão de coordenação 3 de
06/09), então não escrevi. As cinco, com o endereço novo LIDO no código:

```
linha 275  [08-conexoes] O hub em comum acima de todos os adaptadores
  veredito      IGUAL
  sinal         _frase_do_hub_em_comum        PRESENTE
  sinal_escopo  src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
  html_onde     src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:3256 ·
                src/hefesto_dualsense4unix/interface/aba08.py (a `monta.ressalva("hub-em-comum")`
                debaixo da tabela de adaptadores)
  html_faz      `_frase_do_hub` chama `secao_mesa._frase_do_hub_em_comum(mesa, censo, entradas)`
                e escreve as três frases (fato · por quê · conselho) numa linha de
                ressalva, separadas por `<br>`. Some inteira quando o dono cala.
  porque        FECHOU em 06/09/2026 (CONEXOES-LIGAR-TUDO-01). Os dois lados chamam a
                MESMA função do mesmo dono. A regra opcional do conselho é dele: só
                nasce com buraco livre alcançável em OUTRA controladora. Medido nesta
                bancada em 06/09: os três adaptadores estão em `usb1/1-4`,
                `usb3/3-1/3-1.2` e `usb3/3-1/3-1.4` — não há hub acima dos três, e a
                linha CALA (0 px, medido no WebKit). A `listar_entradas()` que o
                conselho precisa entrou na regra do `ler_a_mesa`: uma leitura, renovada
                pelo Examinar Portas, nunca em tique (6,3 ms, 38 nós).

linha 276  [08-conexoes] As contagens do gabinete (o que o firmware diz × o que o kernel conta)
  veredito      IGUAL
  sinal         _linhas_do_gabinete           PRESENTE
  sinal_escopo  src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
  html_onde     src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:3289 ·
                src/hefesto_dualsense4unix/interface/aba08.py (a
                `monta.ressalva("gabinete-contagens")`, abaixo do hub)
  html_faz      `_frases_do_gabinete` chama `secao_mesa._linhas_do_gabinete(gabinete)` e
                escreve as contagens LADO A LADO mais a pergunta pendente. Nunca escolhe
                uma. Sem `gabinete.json`, silêncio.
  porque        FECHOU em 06/09/2026. O dono é o mesmo dos dois lados, e a regra que
                importa é dele — o produto não escolhe entre o firmware e o kernel.
                Medido nesta bancada: a BIOS conta 5 entradas USB, o barramento conta 15
                buracos, e a terceira frase é a pergunta que só ela responde. A leitura
                (`censo_do_gabinete.ler_do_disco`, 0,11 ms) é renovada pelo Examinar
                Portas.

linha 290  [08-conexoes] Alvo de saída — LER DE VOLTA qual é o alvo agora
  veredito      IGUAL
  sinal         output_target_index           PRESENTE
  sinal_escopo  src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
  html_onde     src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:3057 ·
                :3103 · src/hefesto_dualsense4unix/interface/aba08.py (os cinco
                `<input type="radio" data-campo="alvo-aberto" data-hef-alvo="marcado">`)
  html_faz      `_pref_do_alvo` traduz `output_target_index` (posição em `controllers`)
                para o `pref` do desenho (posição na mesa ordenada por identidade), pela
                ponte do `uniq`, e `_alvo_de_saida` marca o rádio do acordeão pelo alvo
                `marcado`. `index: null` marca o "todos"; um índice que o estado não
                traduz não marca NADA.
  porque        FECHOU em 06/09/2026. A cura alcança as DUAS metades da queixa com um
                endereço só: o destaque do chip da FITA vem das regras
                `body:has(#gc-pN:checked) .fita .chip:nth-child(n)` do gerador, não do
                `.on` que o piloto escreve — o docstring do gesto `alvo` afirmava o
                contrário e foi substituído. Ele dependia do alvo `marcado`
                (PINTOR-MARCADO-01, 04/09). Medido no WebKit em 06/09: com o alvo no
                `index: 0` a tela marca `gc-p2` e acende o chip `P2`; o daemon troca para
                `index: 1` e sem um clique a tela passa a `gc-p1` e ao chip `P1`.

linha 306  [08-conexoes] Aviso "controle ligado que o sistema não entregou ao Hefesto"
  veredito      IGUAL
  sinal         texto_de_controle_nao_adotado PRESENTE
  sinal_escopo  src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
  html_onde     src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:3142 ·
                src/hefesto_dualsense4unix/interface/aba08.py (a
                `monta.ressalva("sem-driver")` no topo da Gestão de Controles)
  html_faz      `_frase_do_sem_driver` devolve a frase do dono, com as três partes
                obrigatórias (o que houve · que o produto tenta sozinho e em quanto
                tempo · a saída manual), numa linha de ressalva que some quando não há
                órfão.
  porque        FECHOU em 06/09/2026, e o que estava aqui era pior do que "falta": o
                pacote emitia `"sem_driver": st.get("controles_sem_driver")` — um `dict`
                que `pacotes.normalizar` descarta antes da tela — para um endereço que
                página nenhuma tinha. Emissão morta em DOIS níveis, substituída pela
                frase do dono. Medido no WebKit: 34 px com dois órfãos, 0 px sem nenhum.

linha 307  [08-conexoes] Aviso do Bluetooth nativo frágil
  veredito      IGUAL
  sinal         texto_native_bt_fragil        PRESENTE
  sinal_escopo  src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
  html_onde     src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:3169 ·
                src/hefesto_dualsense4unix/interface/aba08.py (a
                `monta.ressalva("radio-fragil")`, ao lado da anterior)
  html_faz      `_frase_do_radio_fragil` acende pelo booleano `native_bt_fragil` e nomeia
                os controles com `home_actions.controles_bt_frageis`. Lista vazia com o
                booleano aceso é "não sei quais": o aviso acende SEM nomes, que é a regra
                escrita no dono.
  porque        FECHOU em 06/09/2026. O `sinal` velho (`data-campo="fragil"`) media a
                outra cura possível — um marcador POR CONTROLE —, e ela diria QUAL sem
                dizer O QUE FAZER. A frase do dono diz as duas coisas, e é a mesma que a
                aba Início acende. Medido no WebKit: 17 px com um frágil, 0 px sem.
```

### 7.2 · `mockup/DIVERGENCIAS.md` — a seção `08-conexoes.html` ganha uma entrada

```markdown
- **06/09/2026** — as linhas 4, 5, 8, 14 e 15 do balde `LIGAR`
  (`CONEXOES-LIGAR-TUDO-01`). O desenho ganhou **cinco endereços**: os
  `data-campo="alvo-aberto"` nos cinco rádios do acordeão (que fazem a linha
  aberta e o chip da fita seguirem o alvo de saída do serviço) e quatro linhas
  de ressalva — o controle que o sistema não entregou, o rádio nativo frágil, o
  hub em comum e as contagens do gabinete.

  **Nenhuma delas ocupa um pixel em repouso**: as quatro são `monta.ressalva`, e
  a folha as apaga quando não há o que dizer. Medido no WebKit: a página tem
  **809 px** com as quatro caladas e **809 px** com as quatro falando.

  **O que ela vê HOJE, enquanto não publicar:** a Conexões de ontem. Os cinco
  rádios do acordeão da página publicada não têm endereço — medido —, então a
  linha aberta e o chip da fita continuam onde o desenho os pôs, e não onde o
  serviço está mirando. Os quatro avisos não têm onde aparecer. O serviço
  responde certo; a tela é que não pergunta.

  **O que fecha:** `--publicar 08`, que é ato dela.
```

### 7.3 · `src/hefesto_dualsense4unix/interface/aba03.py:94` — um ponteiro de linha que eu desloquei

O arquivo é de outra posse. **Não apliquei.** O diff:

```diff
-     `aba08.py:701` já usa a mesma classe com TRÊS colunas.
+     `aba08.py` já usa a mesma classe (a regra `.duas-colunas` do CSS da
+     Conexões, e as duas `<div class="duas-colunas">` dos quadros 1 e 3).
```

**A razão de tirar o número, e não de acertá-lo:** é a forma que a `ONDA5-08-02`
estabeleceu hoje — *"guardá-lo é assinar a próxima podridão"*. E o número já
estava errado antes de mim: a linha 701 do `3f6855a6` é prosa sobre o interruptor
do selo do exame, não sobre `.duas-colunas`. A régua
(`test_portao_o_par_com_metade_ligada::TestTodaCitacaoDeLinhaConfere`) só cobra
que a linha citada não esteja EM BRANCO, e por isso o erro de sentido atravessou.

### 7.4 · `tests/unit/test_a_palavra_do_transporte_tem_um_dono_so.py` — o glob que o coordenador pediu

O arquivo não é da minha posse. O diff, para a costura:

```diff
-    for caminho in sorted(INTERFACE.glob("aba0[45].py")):
+    for caminho in sorted(INTERFACE.glob("aba0[458].py")):
```

A `aba08.py` passou a ter a guarda `if __name__ == "__main__":` nesta frente (§8),
e a mordida daquela régua já sabe medi-la.

### 7.5 · `src/hefesto_dualsense4unix/integrations/ordens_da_mesa.py` — a guarda que as DUAS irmãs relataram

Terceiro relato seguido, sem uma linha de mudança desde 05/09. **Não é da minha
posse** e não apliquei:

```diff
 # ordens_da_mesa.py:846-850   ordens_novas
-        if dispensadas.get(ordem.chave) != ordem.arranjo
+        if not ordem.arranjo or dispensadas.get(ordem.chave) != ordem.arranjo
 # ordens_da_mesa.py:861-865   ordens_caladas
-        if dispensadas.get(ordem.chave) == ordem.arranjo
+        if ordem.arranjo and dispensadas.get(ordem.chave) == ordem.arranjo
```

Com o desfazer da `ONDA5-08-01` gravando `arranjo=""`, uma `Ordem` VIVA que
chegue com arranjo vazio (o padrão do campo) casa com o vazio guardado e **nasce
calada** para os dois consumidores daquele módulo — inclusive a janela GTK. O
pacote desta aba já tem a guarda local (`_ordem_calada`), e é por isso que a
tela nova não sofre.

**A régua tem de morder dos dois lados:** uma ordem viva sem assinatura, e uma
ordem realmente dispensada.

---

## 8. OS DOIS ACHADOS QUE A COSTURA MANDOU, e o que eles viraram

### 8.1 · `aba08.py` escrevia a bancada como efeito de IMPORT

Tudo abaixo de `n = monta("08-conexoes", …)` era nível de módulo: um
`import aba08` REESCREVIA `mockup/08-conexoes.html` no disco, com o estado vivo
da mesa dentro. As 160 linhas do fim entraram debaixo de
`if __name__ == "__main__":`, na forma exata da `aba01.py`.

**A prova, com a bancada intacta:**

```
$ md5sum mockup/08-conexoes.html      156e83ff71f8af783aa2e7fcba650715
$ .venv/bin/python -c "import sys; sys.path.insert(0, 'src/…/interface'); import aba08"
  IMPORT OK
$ md5sum mockup/08-conexoes.html      156e83ff71f8af783aa2e7fcba650715
```

O diff do glob que amplia a mordida daquela régua está na §7.4.

### 8.2 · A sexta comparação de `via` — e ela eram NOVE

O coordenador achou UMA (`NO_CABO`, na linha 496). **Medindo, o arquivo tinha
NOVE lugares lendo a `via` da cena**, e três delas PASSAVAM a sigla para funções
do produto que esperam a chave crua (`Controle(via=…)`, `caminho_do_microfone`,
`_do_desenho`). No dia em que a mesa do desenho falar a língua da tela, não
seria só `NO_CABO` a esvaziar.

**A cura é um tradutor só no arquivo** — `transporte_de(c)`, que lê a chave crua
quando ela existir e traduz a sigla enquanto `monta.MESA` não a tiver. **A
palavra desconhecida PARA A GERAÇÃO**, com `SystemExit` dizendo qual chegou: um
`.get` com padrão devolveria "cabo" para tudo e a página sairia errada e verde.

**E ELA ACHOU DUAS VIOLAÇÕES DE GLOSSÁRIO NA BANCADA**, as duas na régua de
Desempenho e as duas invisíveis a olho nu:

```diff
- title="Se o Cosmic Red do Player 1 — hoje no USB — viesse para este rádio…"
+ title="Se o Cosmic Red do Player 1 — hoje no cabo — viesse para este rádio…"
- <span>… Starlight Blue • BT — 260,4</span>
+ <span>… Starlight Blue • rádio — 260,4</span>
```

O produto pinta `cabo`/`rádio` (a `via` da mesa viva é a palavra do dono) e a
bancada dizia a sigla. **São as duas ÚNICAS linhas de texto do diff do
`mockup/`** — e agora as duas páginas dizem a mesma coisa.

---

## 9. A PROVA DE TELA — a aba 08 viva, no WebKit, `--oculta`

Um driver próprio (`T10-prova-de-tela.py`, no scratchpad) monta o `Piloto` numa
`Gtk.OffscreenWindow`, carrega **a bancada** e lê o DOM.

**QUATRO TRAVAS, e cada uma é regra da casa:** janela oculta (ela tem UMA tela);
o daemon NÃO é tocado (`mesa_viva.estado_do_daemon` é dublado — nenhum pedido sai
para o socket dela); `HOME` e os quatro `XDG_*` desviados para um lar de mentira;
e o exame COMPLETO não corre (ele forka `busctl` com teto de 5 s).

**A PÁGINA MEDIDA É A DA BANCADA, e isso teve de ser feito à mão:** o `--abre` do
piloto resolve com `onde.pagina(…, publicado=True)`, e os endereços novos ainda
não foram publicados. Uma prova contra a publicada daria **verde sobre a página
de ontem**.

```
--- ANTES · o serviço mira o `index: 0` (o de `player_slot: 2`) ---
  rádios do acordeão : 5, sem endereço: nenhum
  MARCADO            : ['gc-p2']
  chip 'Todos'       peso=400  fundo=rgb(33, 34, 44)
  chip 'P1 • cabo'   peso=400  fundo=rgb(33, 34, 44)
  chip 'P2 • rádio'  peso=600  fundo=rgba(189, 147, 249, 0.16)   ← o destaque
  ressalva sem-driver         :   0 px  visto=1
  ressalva radio-fragil       :   0 px  visto=1
  ressalva hub-em-comum       :   0 px  visto=1
  ressalva gabinete-contagens :   0 px  visto=1
  altura da página   : 809 px

>>> O SERVIÇO TROCA O ALVO para `index: 1` — nenhum clique na tela

--- DEPOIS ---
  MARCADO            : ['gc-p1']
  chip 'P1 • cabo'   peso=600  fundo=rgba(189, 147, 249, 0.16)   ← o destaque andou
  chip 'P2 • rádio'  peso=400  fundo=rgb(33, 34, 44)
  altura da página   : 809 px

>>> E AGORA O SERVIÇO TEM O QUE DIZER

--- DEPOIS · Gestão de Controles aberta ---
  ressalva sem-driver         :  34 px  '2 controles estão ligados, mas o sistema não…'
  ressalva radio-fragil       :  17 px  'Modo Nativo com o Controle 2 em Bluetooth: …'
  altura da página   : 809 px

--- DEPOIS · Rádio e Adaptadores aberto ---
  ressalva hub-em-comum       :  68 px  'Os 3 adaptadores chegam ao computador por…'
  ressalva gabinete-contagens :  34 px  'A BIOS desta placa conta 4 entradas USB.…'
  altura da página   : 809 px
```

**O que a leitura prova, e régua de Python nenhuma alcançava:** a marca chega ao
`<input>` certo (`gc-p2`, e depois `gc-p1`); **o chip da fita anda junto**, com
peso 600 e o fundo roxo; as quatro ressalvas medem **zero** caladas e crescem
quando o dono fala; o `data-hef-visto=1` diz que o piloto ESTEVE nos quatro
elementos mesmo quando calados — que é o que separa "a linha some" de "o
endereço não existe"; e a **altura da página é 809 px nos quatro estados**, que é
a "Nada se perdeu" medida em vez de argumentada.

**AS DUAS RESSALVAS DO RÁDIO MEDIRAM ZERO NA PRIMEIRA VOLTA, e ler aquilo como
"a linha não cresce" teria sido a régua respondendo sobre outra coisa:** os três
quadros são rádios de mesmo `name` (decisão dela: *abrir uma expansão minimiza a
outra*), e o hub e o gabinete moram no quadro **Rádio e Adaptadores**, que estava
fechado. Foi preciso abri-lo para medir.

### A FOTO "PUBLICADA" É UMA MEDIÇÃO — e é o custo da espera

A mesma corrida contra a página publicada de hoje, com o pacote NOVO:

```
--- O CUSTO DA ESPERA · o que ela vê até publicar ---
  rádios do acordeão : 5, sem endereço: ['gc-todos','gc-p1','gc-p2','gc-p3','gc-p4']
  MARCADO            : ['gc-p1']        ← o `checked` do desenho, não o do serviço
  ressalva sem-driver         : AUSENTE DA PÁGINA
  ressalva radio-fragil       : AUSENTE DA PÁGINA
  ressalva hub-em-comum       : AUSENTE DA PÁGINA
  ressalva gabinete-contagens : AUSENTE DA PÁGINA
```

Na tela dela, hoje, **o alvo de saída continua mentindo sempre que ele não for o
P1** — e continua CERTO por acidente quando for. É a metade-nova-metade-velha
que só o `--publicar` fecha, e ela não é zero.

As fotos `--oculta` ficaram no scratchpad (`T10-aba08-ANTES.png`,
`-DEPOIS.png`, `-RADIO.png`, `-PUBLICADA.png`). **Elas não entram no
repositório**: a tabela de adaptadores mostra os apelidos que ela escreveu no
BlueZ e a fileira de vizinhos mostra os `vid:pid` da mesa dela.

### A TELA NÃO SAMBA — a aba 08 continua em ZERO, nas DUAS páginas

```
$ hefesto_vivo.py --oculta --abre 08-conexoes.html --conta-mutacoes 100
MUTAÇÕES DE DOM em 100 tiques (10.1 s) na 08-conexoes.html, com a mesa parada
TOTAL: 0 mutações · 0.0 por tique
custo do tique: mediana 4.76 ms · max 78.30 ms · teto 100 ms

$ T10-mutacoes-bancada.py 100            # o mesmo observador, sobre a BANCADA
MUTAÇÕES DE DOM em 100 tiques (10.0 s) na BANCADA da 08-conexoes.html
TOTAL: 0 mutações · 0.0 por tique
```

**A segunda corrida é a que decide, e ela teve de ser escrita:** o
`--conta-mutacoes` só sabe abrir a página PUBLICADA, que não tem os endereços
novos — contá-la seria medir a aba de ontem e chamar de "sem regressão". O
driver da bancada abre o quadro **Rádio e Adaptadores** de propósito: é lá que
moram as duas ressalvas mais caras e a régua do rádio, que é o bloco trocado
INTEIRO a cada tique — o mais capaz de sambar.

---

## 10.1 · OS VERMELHOS DE TESTE QUE SOBRAM, triados um a um

| quantos | quais | de quem |
| --- | --- | --- |
| 9 | `test_os_dez_geradores_rodam::test_o_gerador_reproduz_a_bancada[aba01..07, 09, 10]` | **herdados.** Confirmado com `git stash` no `3f6855a6` LIMPO: os mesmos nove reprovam antes de eu escrever uma linha, e **o único que PASSA na base é o `aba08.py`** — o meu. Continua passando |
| 1 | `test_portao_o_par_com_metade_ligada::…::test_toda_citacao_de_linha_em_comentario_de_codigo_confere` | **MEU, e o conserto é de outra posse.** `interface/aba03.py:94` cita `aba08.py:701`, e as minhas 200 linhas novas moveram aquela linha para o branco. O diff está na §7.3. **Ele não é portão** — não roda no `portoes.sh` —, e por isso pode atravessar a integração calado |

### A ARMADILHA QUE EU MESMO ARMEI, e é de PROCESSO

Na primeira volta do lote apareceram **DOIS vermelhos a mais** —
`test_todo_gesto_que_grava_esta_protegido`, dizendo que `08-conexoes·alvo` e
`·escolher-aparelho` passaram a gravar por `machine_declare`. **Eles não
existiam**: aquela régua lê o fonte com `inspect.getsource`, que resolve por
NÚMERO DE LINHA no arquivo em disco — e eu estava editando `a08_conexoes.py`
enquanto o lote corria. O deslocamento fez a régua ler o corpo de outra função.

Passam em isolamento, e passam no lote com a árvore parada. **A regra que isso
deixa: enquanto um lote roda, a árvore não se edita** — e a memória desta casa
já dizia metade disso (*"nunca rode pytest junto com a suíte"*); a metade que
faltava é que **o próprio editor contamina**, sem precisar de um segundo pytest.

---

## 10. O QUE EU **NÃO** VERIFIQUEI

* **Não rodei a suíte inteira** — só o meu escopo e os arquivos que citam esta
  aba. É de quem coordena.
* **Não publiquei.** `interface/paginas/08-conexoes.html` está intocado (`git
  diff` vazio nele): publicar é ato dela.
* **Não toquei o CSV da paridade nem o `DIVERGENCIAS.md`** (os dois no
  `nao_toca:`, e os dois do coordenador). O texto dos dois está na §7.
* **Não toquei `daemon/ipc_handlers.py`**, e a razão medida está na §6.1.
* **Não medi com DOIS controles de verdade na mesa.** A bancada dela hoje tem
  UM, no cabo (medido: `daemon.state_full` devolve um `controllers` de tamanho
  1). A cena de dois controles é dublê; o que a mesa dela renderia com dois no
  rádio **não foi medido nesta frente**.
* **Não medi a linha do hub com um hub em comum REAL.** Os três adaptadores
  dela hoje não têm um, e a linha cala — corretamente. O conteúdo da linha na
  fase 2 da prova de tela veio das CONSTANTES do dono formatadas à mão, e está
  dito lá.
* **Não conferi as quatro linhas novas no tema CLARO.** A `.ressalva` usa
  `var(--texto-mudo)`, que é token, mas ninguém olhou.
* **O texto das quatro linhas não passou pelo olho dela** — nem podia:
  interface só fecha com ela olhando. **As quatro frases são dos donos**, não
  minhas, e é o que reduz o risco.
* **Não medi o tempo longo.** O driver roda ~40 s e o contador de mutações 10 s;
  uma regressão que só aparecesse aos 181 segundos passaria.
* **Não medi a janela em 1180x777.** A "Nada se perdeu" foi medida pela ALTURA
  DA PÁGINA (809 px nos quatro estados), que é o número que importa aqui, mas a
  régua de geometria não foi rodada.

---

## 11. UM FATO MEDIDO SOBRE RODAR O PILOTO, para quem vier depois

A memória desta casa diz que rodar `hefesto_vivo.py` dispara migrações no
`~/.config` REAL dela. **Medido em 06/09, com o inventário de mtimes antes e
depois de um `--conta-mutacoes 100`:**

```
115 arquivos em ~/.config/hefesto-dualsense4unix
mudou: os 25 `profiles/*.json.lock` (0 bytes, só o mtime)
NÃO mudou: nenhum `.json` de perfil, nem `maquina.json`, nem `session.json`,
           nem `active_profile.txt`
```

O que o piloto faz é ABRIR os perfis sob lock. **Nenhum byte de conteúdo dela
foi tocado** — e o desvio de `HOME` continua sendo o certo para todo driver que
alguém escreva, porque uma migração one-shot que ainda não correu escreveria de
verdade.

---

## 12. Anonimato

**Nenhum endereço de rádio, serial ou identificador de aparelho foi escrito em
arquivo versionado por esta frente.** O que entrou é código, prosa em português e
cinco nomes de campo (`alvo-aberto`, `sem-driver`, `radio-fragil`,
`hub-em-comum`, `gabinete-contagens`). Os `uniq` que aparecem nos testes e no
driver são sintéticos e já mascarados na forma da casa
(`aa:bb:cc:00:00:0a`). **As quatro fotos da prova de tela ficaram FORA do
repositório**, no scratchpad, porque mostram os apelidos de BlueZ dela e os
`vid:pid` da mesa dela.

**As palavras da tela seguem o glossário:** as quatro frases novas são dos donos
e falam **cabo**/**rádio**; a única coisa que esta frente mudou no texto da tela
foi TIRAR duas siglas que sobreviviam na bancada (§8.2). `MAC`, `uniq`,
`hidraw`, `uinput` e `env` não aparecem em nenhuma delas, e **"mesa" não entrou
na tela**.
