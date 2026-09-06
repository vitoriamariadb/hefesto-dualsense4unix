# BATERIA-ICONE-01 — o estado de carga virou ícone, e o ícone não pergunta o transporte

**06/09/2026** · árvore `hefesto-voo/BATERIA-ICONE-01-opus`, branch
`voo/BATERIA-ICONE-01-opus`, nascida de `83a9405c`.

**A DECISÃO DELA, verbatim, e ela recusou as três opções como escritas:**

> *"icone mas no radio ele pode tá carregando tambem."* <!-- noqa-acento: citação literal dela -->

São **duas** coisas, e as duas valem:

1. o card diz o estado por **ícone**, não por palavra;
2. **a premissa das opções estava errada** — o estado de carga é INDEPENDENTE
   do transporte. Um DualSense falando por rádio pode estar num cabo de energia.
   O transporte diz por onde o controle **conversa**; a carga diz por onde entra
   **energia**.

---

## O que mudou

### O ACOPLAMENTO FOI PROCURADO ANTES DA CURA, e ele NÃO estava no código

A rota mandava procurar de propósito o `if transport == "usb"` antes de escrever
qualquer coisa. Procurado nos cinco degraus do caminho, e **medido**:

| degrau | o que se mediu | veredito |
| --- | --- | --- |
| a biblioteca | `pydualsense.readInput` faz `states = inReport[1:]` **quando BT** antes de ler `states[53]` — o offset do rádio já é corrigido | limpo |
| o backend | `_detect_transport` lê `conType`; `_read_battery_state_opt` lê `ds.battery` — objetos diferentes, nenhuma consulta cruzada | limpo |
| o IPC | `ipc_handlers` põe `describe_controllers()` em `result["controllers"]` **verbatim** | limpo |
| o piloto | `ctx_conectados` são os dicionários crus do daemon | limpo |
| a aba 02 | lia `battery_pct` e **jogava fora** o `battery_state` — não havia onde pô-lo | o buraco |

**O acoplamento estava na PROSA — nas opções oferecidas a ela —, não no
produto.** Ela o pegou de olho antes que ele descesse para o código. A entrega
principal, então, deixa de ser "arrancar o acoplamento" e passa a ser **trancar
a porta**: a régua nova reprova no dia em que alguém escrever esse `if`.

### O DONO DA PALAVRA — `interface/pacotes/a02_controles.py`

* `estados_de_carga()` **lê** `backend_pydualsense.ESTADO_DE_CARGA`. A lista dos
  cinco estados não é digitada em lugar nenhum novo;
* `_NA_TELA_POR_CARGA` dá a palavra de tela de cada um. Um sexto estado que o
  kernel publique e a tela não conheça **reprova nomeando-o**, em vez de sumir
  calado do card;
* `carga_na_tela(estado)` devolve a palavra ou `""`. **Não há parâmetro por onde
  o transporte entre** — a decisão dela está escrita na assinatura, e há régua
  que mede a assinatura;
* o card emite `bateria-carga`, por dentro do `_so_se_a_pagina_tiver`: enquanto
  a página PUBLICADA não tiver o endereço, o pacote não o emite (emitir para
  endereço ausente é o que vira órfão no casamento). **No dia em que ela
  publicar, liga sozinho.**

### AS QUATRO RESPOSTAS DA TELA, e as duas que ela pediu que fossem decididas

| estado do daemon | na tela | ícone |
| --- | --- | --- |
| `carregando` | **Carregando** | raio, verde |
| `cheio` | **Cheio** | tique, verde |
| `descarregando` | *(nada)* | — |
| `fora_de_faixa` | **Fora de faixa** | triângulo de atenção, laranja |
| `erro` | **Erro de carga** | triângulo de atenção, laranja |
| `None` (ninguém reportou) | *(nada)* | — |

**`descarregando` não ganha ícone, e a ausência é a decisão:** o número ao lado
já diz a carga caindo, e um ícone em todo card o tempo todo é ruído crônico. É a
mesma escolha que o `giro-no-jogo` desta aba já faz — some sem frase, em vez de
acusar "sem giroscópio" nos quatro.

**`fora_de_faixa` e `erro` ganham, e ganham o MESMO ícone. A razão é medida, não
simétrica:** o `hid-playstation` zera a capacidade nesses estados (`0xa`, `0xb`,
`0xf` → `capacity = 0`) enquanto a `pydualsense` continua calculando
`nibble*10+5` do mesmo byte. **O percentual que o card mostra nesses dois
estados é um número que o driver já descartou.** Calar ali deixaria a tela
afirmando uma carga que ninguém sustenta — que é o defeito que a
BATERIA-PARADA-01 curou do outro lado. Um ícone porque a consequência é uma só
(*não confie no número*); duas palavras porque a causa é diferente.

### O NOME ACESSÍVEL, e a forma de dois elementos

O ícone é **dois elementos com o MESMO `data-campo`** — a gramática que o
`giro-no-jogo` e o selo do microfone desta faixa já usam:

* o de fora veste o `title` — o **nome acessível**, e a dica do ponteiro;
* o de dentro veste o `data-carga`, e é ele que a folha lê para escolher a forma.

Valor vazio apaga os dois (o alvo `atributo` do piloto remove o atributo), e sem
`data-carga` nenhuma regra casa: o vão fica vazio. **Dois `data-campo`
diferentes para o mesmo fato foi recusado** — eles poderiam divergir na tela.

**A FOLHA NÃO DIGITA A PALAVRA.** As regras `[data-carga="Carregando"]` são
GERADAS de `carga_na_tela`, no mesmo `python3 aba02.py`. Se a folha digitasse a
palavra, a divergência seria **silenciosa**: uma regra de CSS que não casa não dá
erro nenhum — o ícone sumiria da tela viva e continuaria desenhado no mockup.

### O VÃO É FIXO MESMO SEM ÍCONE

`.carga{flex:0 0 13px}`. O `.bat` tem base fixa e o trilho é o `flex:1`: um ícone
que só às vezes ocupasse deixaria as barras de bateria com larguras diferentes
entre as linhas — que é o defeito que ela mandou curar em 27/08, quando 31%
desenhava mais que 64%. **Medido no motor: trilho de 118,5 px nos cinco casos**,
com ícone e sem.

### A CENA DO MOCKUP É A FRASE DELA DESENHADA

`P1` está no **cabo** e aparece **Cheio**; `P2` está no **rádio** e aparece
**Carregando**. Um desenho em que só o controle do cabo carrega ensinaria de
volta a premissa errada — e há guarda no gerador que reprova se alguém trocar a
cena.

**Não publiquei.** `--publicar` é ato dela, e ela já disse que quer olhar antes.
O portão `desenho-aprovado` está verde.

### Os arquivos

| arquivo | o que ganhou |
| --- | --- |
| `src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py` | `estados_de_carga`, `_NA_TELA_POR_CARGA`, `carga_na_tela`, a emissão de `bateria-carga` |
| `src/hefesto_dualsense4unix/interface/aba02.py` | os três SVGs, `GLIFO_DA_CARGA`, `selo_da_carga`, a folha gerada, a cena, a legenda e quatro guardas novas |
| `mockup/02-controles.html` | o desenho regerado (bancada; **não** publicado) |
| `tests/unit/test_a_bateria_diz_carregando_no_radio.py` | 17 casos, o caminho inteiro |

**Uma correção de fato, colhida no caminho:** o comentário do topo do
`a02_controles.py` citava `aba02.py:1691` para o `hidden` do `alto-estado`. Esse
`<span hidden>` **saiu do desenho em 04/09** e o número apontava para linha em
branco; o portão `citacoes-no-codigo` o pegou. O número foi retirado e a prosa
passou ao passado, com ponteiro para o comentário que registra a saída.

---

## Qual mordida prova

**CINCO mordidas, feitas e devolvidas.** A régua central é
`tests/unit/test_a_bateria_diz_carregando_no_radio.py` (17 casos, verdes).

| # | o que foi arrancado | quem reprovou |
| --- | --- | --- |
| 1 | **o acoplamento POSTO de propósito**: `carga_na_tela(...) if transport == "usb" else ""` no pacote | **4 casos** — `test_o_card_do_radio_carregando_diz_o_icone`, os dois `test_a_palavra_e_a_mesma_no_cabo_e_no_radio[carregando/cheio]`, `test_o_numero_e_o_estado_continuam_sendo_duas_coisas` |
| 2 | uma linha de `_NA_TELA_POR_CARGA` (`"cheio"`) | 4 casos, entre eles `test_todo_estado_do_dono_tem_resposta_na_tela`, que **nomeia o estado órfão** |
| 3 | o `"bateria-carga"` do pacote | 5 casos |
| 4 | o `title` do ícone no gerador | **o próprio gerador recusou** (`ERRO em 02-controles — decisão dela desfeita: o ícone de carregando ficou sem nome acessível`) **e** `test_o_icone_tem_nome_acessivel` |
| 5 | a cena: `P2` no rádio deixou de carregar | **o gerador recusou** (`nenhum controle no RÁDIO aparece carregando`) **e** `test_o_desenho_mostra_um_controle_no_radio_carregando` |

A mordida 1 é a que a rota pedia: **um controle no rádio e carregando** para de
mostrar o ícone no instante em que alguém amarra a carga ao transporte.

### A PROVA NO MOTOR, headless

`prova_do_icone.py` (Chrome do sistema, `launch()` sem `headless=False` — nenhuma
janela nasceu na tela dela) troca o `data-carga` na página e lê o
`getComputedStyle` de cada `<svg>`. Saída completa em
`BATERIA-ICONE-01-prova-no-motor.txt`:

| valor escrito | svg visível | cor | nome no `title` | trilho da barra |
| --- | --- | --- | --- | --- |
| `Carregando` | `g-raio` | `rgb(80, 250, 123)` | Carregando | 118,5 px |
| `Cheio` | `g-cheio` | `rgb(80, 250, 123)` | Cheio | 118,5 px |
| `Fora de faixa` | `g-atencao` | `rgb(255, 184, 108)` | Fora de faixa | 118,5 px |
| `Erro de carga` | `g-atencao` | `rgb(255, 184, 108)` | Erro de carga | 118,5 px |
| *(vazio)* | **nenhum** | — | *(sem title)* | 118,5 px |

Uma forma por valor, nenhuma no vazio, e **a barra com a mesma largura nos
cinco** — que é a decisão de 27/08 conservada.

### Os portões

`git add -A && bash scripts/portoes.sh` → **TODOS VERDES — 45 portões**
(`/tmp/portoes-BATERIA-ICONE.txt`).

---

## O que NÃO verifiquei

* **Não medi no APARELHO.** Não há DualSense nesta árvore de agente, e o daemon
  vivo é o da mesa dela. Tudo acima é dublê, HTML no disco e motor headless. **O
  que fica por medir com o controle na mão é o caso que ela nomeou**: um
  DualSense no rádio, ligado a um cabo só de energia, e o card mostrando o raio.
  O byte foi lido, a tabela é a do driver e o caminho está provado degrau a
  degrau — o que falta é o aparelho confirmar.
* **Não vi o ícone pintar pelo PILOTO vivo.** O `hefesto_vivo.py` precisa do
  daemon e do WebKitGTK, e ele abre a página **PUBLICADA**, que ainda não tem o
  endereço (publicar é ato dela). O que provei foi o motor + o pacote; o elo que
  falta é o `escrever()` do piloto visitando estes dois elementos — e ele é o
  mesmo alvo `atributo` que a aba já usa para o `title` do `giro-no-jogo` e para
  o `data-colorway` do SVG.
* **Não medi o `fora_de_faixa` nem o `erro` no aparelho.** São estados raros
  (tensão/temperatura), e a leitura de que a `pydualsense` continua devolvendo
  `nibble*10+5` enquanto o driver zera a capacidade veio do FONTE das duas — não
  de um controle nessa condição.
* **Não toquei em `layout/` nem publiquei.** Não conferi como o ícone fica na
  página publicada porque ela não tem o elemento.
* **A suíte inteira, oito lotes: 18.361 passaram, 83 reprovaram, 3 erros** — e
  os vermelhos FORAM MEDIDOS CONTRA A BASE, não presumidos. Uma árvore
  descartável em `83a9405c` (`git worktree add --detach`) rodou os 30 arquivos
  vermelhos: **86 casos vermelhos aqui, 85 lá, e a diferença era UM — e era
  meu.** `test_nenhum_escape_novo_sem_razao` pegou um `<!-- noqa-acento -->` sem
  RAZÃO ESCRITA na linha 7 da régua nova: eu o havia encurtado para caber nos
  100 caracteres do `ruff` e, ao encurtar, tirei justamente o que o portão
  cobra. Curado (a razão voltou, a linha quebrou em duas), e a diferença contra
  a base é **zero**.

  Os 85 herdados são as famílias `*_na_foto`, `*_do_cabecalho`, `retratar_abas`
  e afins — o estúdio da **janela GTK**, que saiu do disco na `GTK-3`
  (`D-0609-GTK-LEVA-INTEIRA`). **Não são meus e não os curei.**

* **A lição que isso deixa, e ela é do processo:** os 45 portões ficaram VERDES
  com essa regressão em pé. `test_todo_escape_de_acento_presta_contas.py` não
  está entre eles — quem o pega é a suíte. *Portão verde não é suíte verde*, e
  medir a suíte contra a BASE foi o que separou o meu defeito dos 85 herdados.

---

## O que sobrou para o próximo

1. **O OLHO DELA.** O desenho está na bancada e não foi publicado. Se ela
   aprovar, `scripts/check_o_desenho_aprovado.py --publicar 02` liga o endereço
   e o pacote começa a emitir sozinho — nenhuma linha de código a mais.
2. **A LINHA FECHADA E O CARD ABERTO SÃO O MESMO ELEMENTO**, então o ícone já
   aparece nas duas formas. Nada a fazer, mas vale saber ao mexer no `.faixa`.
3. **A GTK NÃO GANHOU O ÍCONE.** `status_actions._bateria_da_mesa` continua
   devolvendo só `(fração, texto)` — mas a janela saiu inteira na `GTK-3`, então
   isto é registro, não dívida.
4. **O DIÁRIO DA BATERIA JÁ GRAVA O ESTADO E NINGUÉM O LÊ.**
   `daemon/battery_journal.py` guarda `battery_state` por controle desde a
   BATERIA-PARADA-01, e nenhuma aba mostra histórico. É a sprint que a legenda
   da 02 já anuncia (*"Histórico de bateria"*).
5. **O `descarregando` é silêncio hoje.** Se ela pedir depois um sinal para
   bateria BAIXA (que é outra pergunta — nível, não estado), o vão já existe e o
   endereço já é dela; a palavra e o limiar são decisão dela.
