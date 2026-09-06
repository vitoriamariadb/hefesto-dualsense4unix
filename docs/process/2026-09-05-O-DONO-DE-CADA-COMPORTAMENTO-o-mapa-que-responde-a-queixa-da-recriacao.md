# O dono de cada comportamento — o mapa que responde à queixa da recriação

05/09/2026. Ela nomeou o defeito com todas as letras:

> *"a parte de recriarmos cada script ao invés de adaptar o que já temos pronto
> do gtk, isso eu havia pedido e sempre repetia, mas tá sendo recriado tudo
> sempre e sempre passando por cima das decisões e indo pelo caminho mais longo
> ao invés de aproveitar os dois mapas, specs e o mapa do controle e ao invés de
> aproveitar o do gtk e adaptar ele pra funcionar no html. estamos recriando um
> produto que estava praticamente pronto pro gtk. e isso é total sem
> necessidade."*

E logo depois, o medo que decide o método:

> *"tenho medo de algo estar sendo recriado sendo que já temos pronto."*

Quando perguntei **como organizar o projeto para evitar isso**, ela escolheu
entre quatro opções a que virou este documento: **portão de dono único por
comportamento**.

---

## 1. O que foi medido, e por quem

Cinco agentes leram as dez abas de `interface/pacotes/` contra a janela GTK
(`app/`, `gui/`, `app/widgets/`), comportamento a comportamento — não arquivo a
arquivo. Mediram **410**. Os **50 que decidem** estão em
[`docs/data/donos-de-comportamento.csv`](../data/donos-de-comportamento.csv),
com o endereço do dono dos DOIS lados.

| veredito | quantos | o que significa |
| --- | ---: | --- |
| `SO-GTK` | 15 | pronto e testado na janela, **ausente** na tela nova |
| `DUPLICATA` (+1 que piorou) | 13 | a tela nova **recalcula** o que o dono já devolve — **2.397 linhas** |
| `DIVERGE*` | 16 | as duas telas **discordam sobre o mesmo fato da máquina** |
| `CURADO` | 6 | os defeitos vivos que fecharam em 05/09 |

**O número que responde à queixa dela é o do meio: 2.397 linhas de código
recriado, declaradas.** Não é estimativa — é a soma, coluna a coluna, de quanto
cada duplicata custa a mais que chamar o dono.

### As três duplicatas mais caras

* **`botoes.tabela`** (aba 06) — 777 linhas contra 243 do
  `input_actions._install_key_bindings_treeview`. É a maior das dez abas, e é
  também a que mais diverge: as duas tabelas escrevem em **campos diferentes do
  mesmo perfil** (`key_bindings` na janela, `button_actions` na tela nova), e o
  Guardar de uma **anula** o que a outra escreveu.
* **`forca.por_controle`** (aba 05) — 410 contra 120. O `with_controller_rumble`
  é chamado; a leitura de volta e a precedência foram reescritas.
* **`exame.coluna_inteira`** (aba 08) — 591 contra 152. O próprio código traz a
  catraca `_dono_sabe_desenhar_a_ordem` que diz quando cobrar.

### A que piorou ao ser recriada

**`daemon.leitura_no_tique`** — 132 linhas de cache e thread em
`interface/hefesto_vivo.py:_tique` existem porque o tique lê o daemon com socket
**bloqueante**. O dono faz o mesmo em 22 linhas, com executor e `idle_add`, e o
`ipc_bridge.call_async` declara não bloquear. É a causa medida do congelamento
de **8,4 s** que ela viu.

---

## 2. O portão, e o que ele deliberadamente NÃO faz

`scripts/check_donos_de_comportamento.py` **não julga se um código recria**.
Julgamento vira laudo, não régua — e régua que tenta julgar dá falso positivo
até alguém aprender a ignorá-la.

O que ele garante é que **o laudo continue verdadeiro**, que é como todo mapa
desta casa morre:

1. **endereço morto** — todo `dono` e todo `onde_html` é o caminho do módulo seguido de dois pontos e do
   nome do símbolo, e tem de resolver. **Por símbolo, nunca por linha**, e a razão é medida: dez
   dos endereços vindos dos laudos já apontavam para outra função **horas
   depois**, porque três funções novas nasceram acima deles;
2. **cura descosturada** — linha `CURADO` cujo arquivo de tela deixou de citar
   o símbolo do dono. É a regressão exata dos seis defeitos vivos de hoje: a
   tela recalculava porque a ponte para o dono **não passava tráfego**;
3. **SO-GTK que já migrou** — no dia em que alguém ligar, o mapa passa a mentir,
   e mentir **para menos**: dizendo que falta trabalho já feito;
4. **a dívida só desce** — `TETO_DE_LINHAS_DUPLICADAS = 2397`. Declarar uma
   duplicata nova é o certo a fazer, e é o que estoura o teto: a decisão passa a
   ser tomada por gente, com data, em vez de a dívida crescer calada. Foi assim
   que 27.689 linhas de `interface/pacotes/` nasceram sem ninguém somar o custo.

**A mordida, cinco vezes, cinco vermelhos.** E ela pegou **duas linhas erradas
no primeiro voo**, antes de qualquer regressão futura:

* `mascara.divergencia` estava marcado `SO-GTK` sobre `mascara_viva` — que a
  aba 02 **já chama**, em `a02_controles.py:1857`. O dono certo era
  `mascara_divergente_do_daemon`;
* `brilho.aplicar_ao_soltar` dizia que a cura costurou o dono do GTK. Não
  costurou: a cura escreve pelo `_escrever_a_cor` **da própria aba**. O mapa
  agora diz a verdade sobre o que aconteceu.

A régua do portão é `tests/unit/test_o_dono_do_comportamento_e_um_so.py`, com
nove mordidas escritas à mão.

---

## 3. O que isto NÃO resolve, e é honesto dizer

O portão vigia o mapa. **Ele não impede a próxima recriação** — nada mecânico
impede, porque "isto recalcula o que aquilo já sabe" é julgamento.

O que muda é o **custo de descobrir**: hoje a resposta a *"isto já existe?"* é
uma consulta de trinta segundos ao CSV, com o endereço do dono. Antes era um
laudo de cinco agentes.

E há uma descoberta dos laudos que muda o alvo da próxima leva: **o degrau do
meio não é GTK**. Entre `interface/pacotes/aNN` e o produto existem
`gui/aba_sistema.py` e `app/actions/perfis_web.py` — nascidos para a rota nova,
e já duplicando. Quem for encurtar a fila olha os três degraus, não dois.

---

## 4. A fila que este mapa deixa

Em ordem de quanto devolve por linha mexida:

1. **`botoes.*` (aba 06)** — 777 linhas, três vereditos ruins numa só aba
   (duas tabelas, o Guardar que anula, as três linhas que prometem o que o
   daemon cala). É a maior dívida e o maior risco de perder trabalho dela;
2. **`daemon.leitura_no_tique`** — é o congelamento de 8,4 s, com a causa e a
   cura medidas;
3. **as 15 `SO-GTK`** — decidir uma a uma: migra, ou morre com a janela. Cinco
   são do editor de perfis, e uma delas (`perfil.editor.avancado`) **fecha a
   porta para 7 dos 9 perfis de fábrica**;
4. **as 16 `DIVERGE`** — quatro delas o **GTK erra**, e a versão certa é a da
   tela nova: promover, não copiar.

---

**Ver também:**
[A RECRIAÇÃO — o defeito que ela nomeou](2026-09-05-A-RECRIACAO-o-defeito-que-ela-nomeou-e-a-regra-que-sai.md)
· [`docs/data/donos-de-comportamento.csv`](../data/donos-de-comportamento.csv)
· `scripts/check_donos_de_comportamento.py`
