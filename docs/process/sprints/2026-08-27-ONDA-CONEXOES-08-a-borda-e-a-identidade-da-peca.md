---
sprint: ONDA-CONEXOES-08
estado: absorvida
posse:
  A8:
    - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
cria:
  - tests/unit/test_a_borda_e_a_identidade_da_peca.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/app/widgets/controller_card.py
  - src/hefesto_dualsense4unix/app/widgets/external_card.py
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/lightbar_actions.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONEXÕES · 08 — a borda é a identidade da peça

**O defeito, numa frase:** `tom_para_a_borda` resolve o caso difícil (Midnight
Black, que pintado cru some no fundo escuro) e tem **um chamador só** — esta
aba —, então em todo o resto da interface a cor da peça e o estado de seleção
brigam pelo mesmo espaço visual.

Fonte: `D-A-BORDA-E-A-IDENTIDADE-DA-PECA`. Palavra dela: *"a borda do controle
sempre tem a cor do plástico... e quando selecionado o interior segue [a cor de
seleção] mas a borda grossa é a cor do controle."* Medido na própria decisão:
*"`tom_para_a_borda` já existe e já resolve o caso difícil, e tem UM chamador só
— a aba Configurações."*

Conferido hoje: os usos vivos são `cor_do_plastico.py:240` (a definição) e
`app/actions/config/secao_controles.py:71, 954, 1586, 1589`. Nenhum outro.

## A regra, em duas frases

**A BORDA diz QUAL peça é** — identidade, invariante.
**O INTERIOR diz se está selecionada** — estado. A cor de seleção continua
**lilás**; ela disse "verde" de memória e corrigiu: *"Deixa lilás. Confundi."*

## O que esta sprint entrega — o contrato e a régua, não a edição de sete telas

A regra vale para *"chips da fita, cards da Status, cards da Início, SVGs"*. Esses
widgets são de outras ondas, e **editá-los daqui criaria dois donos da mesma
tela**. O que falta para a regra valer não é uma edição — é um **dono único com
contrato declarado e um portão que reprova quem não o usar**.

1. **`integrations/cor_do_plastico` vira a peça compartilhada, e diz isso.**
   `tom_para_a_borda` (`cor_do_plastico.py:240`) deixa de ser função de uma aba e
   passa a declarar, no próprio cabeçalho, o contrato das duas metades — borda =
   identidade, interior = estado — e a razão de contraste (`RAZAO_DA_BORDA`) num
   lugar só. A conta não muda; muda quem ela diz que a chama.

   **E declara QUAL zona é a borda: `casca_esq`.** A função recebe **um tom por
   controle**, e desde 27/08 a fonte da verdade diz que o DualSense **não é de
   uma cor só**: `docs/data/cores-do-dualsense.csv:42-50` declara **dez zonas**
   por modelo, e em Spider-Man 2 (`cores-do-dualsense.csv:235-236`) e God of War
   20th (`cores-do-dualsense.csv:274-275`) `casca_esq` e `casca_dir` são cores
   **diferentes**. Sem declarar a
   zona, o contrato do dono único nasce ambíguo — dois chamadores passam tons de
   zonas distintas e a borda deixa de significar a mesma coisa em duas telas. É
   `casca_esq` por três razões: está nos **28 modelos** do CSV (só ela e `painel`
   estão em todos); é o que a pessoa vê primeiro ao segurar o controle; e é a
   única escolha que **não obriga a função a saber de gradiente**. A zona entra
   na assinatura e no cabeçalho, não em regra oral.

   **Casca partida não vira borda partida.** A borda é **uma** cor — a de
   `casca_esq`. A segunda metade é problema do desenho, que tem as dez zonas e o
   gradiente de corte duro que `scripts/gerar_cores_do_dualsense.py` gera; a
   borda do card não é o lugar de contar isso.
2. **Sem cor conhecida, sem borda inventada.** Controle cuja cor o produto não
   leu nem ela declarou fica com a borda neutra. Borda colorida chutada é pior
   que borda neutra: afirma identidade que ninguém mediu. Isso vira parte
   explícita da assinatura, não regra oral. **A frequência mudou em 27/08, o
   contrato não:** com a cor legível também pelo rádio
   (`docs/protocol/dualsense-referencia-canonica.md:1574-1663`), a população "sem
   cor conhecida" encolhe para dois casos — código desconhecido
   (`cor_do_plastico.py:204`) e controle externo, filtrado por VID:PID
   (`cor_do_plastico.py:378`) —, e o caminho neutro continua obrigatório, só
   passa a ser raro.
3. **Nasce o portão.** `tests/unit/test_a_borda_e_a_identidade_da_peca.py`
   varre `src/` por AST e **reprova toda pintura de borda que use o tom cru do
   plástico** em vez de `tom_para_a_borda`. É ele que faz a regra alcançar as
   telas das outras ondas sem esta sprint tocar em nenhuma delas: quem pintar
   errado descobre no portão, não na foto dela.

**Por que portão e não sete edições:** esta casa já mediu que consertar aba por
aba paga o mesmo preço N vezes (`2026-08-23-ONDE-PARAMOS`, os quinze defeitos de
forma nas onze abas). E a regra ainda não está em nenhuma dessas telas — um
portão que nasce vermelho é dívida honesta, e cada onda o fecha na sua vez.

## Como se prova — o teste que morde

* **Midnight Black é o caso que morde**: o tom devolvido por `tom_para_a_borda`
  tem contraste mínimo contra o fundo escuro, e o tom **cru** não tem. É este
  par que a função existe para separar, e é ele que uma implementação ingênua
  reprova;
* **um dono só da conta**: nenhum outro módulo de `src/` reimplementa a razão de
  contraste (varredura por AST, no molde do
  `portao_a_casa_sabe_e_o_produto_nao_faz.py`);
* **sem cor conhecida**, a função devolve a neutra — e o teste confere que ela
  **não é** a de nenhuma das 21 de fábrica, comparada contra `NOMES_DE_FABRICA`
  e nunca contra literal digitado no teste;
* **o portão da borda sabe recusar**: dado um módulo de dublê que pinta borda
  com `cor.tom` cru, ele reprova, e nomeia o arquivo e a linha. Régua que só
  sabe passar não é régua.

**A mordida:** troque `tom_para_a_borda` por `cor.tom` no dublê e veja o portão
reprovar; troque de volta e veja passar. Depois arranque o ajuste de contraste
da função e veja o caso do Midnight Black reprovar. Cole as quatro saídas.

## O que fica combinado com quem coordena

O portão **nasce vermelho para as telas que ainda pintam errado**, ou nasce com
elas declaradas numa lista de dívida datada — a mesma disciplina do
`portao_a_casa_sabe_e_o_produto_nao_faz`. Qual das duas formas é decisão de quem
rege a leva, e depende de quantas ondas fecham no mesmo dia. **O que não pode é
o portão nascer verde sobre telas que não obedecem** — verde falso é o defeito
que esta casa mais pagou em agosto.

## O que é dela decidir

1. **Dois controles do mesmo plástico ficam com a borda idêntica.** A regra
   "duas peças nunca com a mesma cor" é da lightbar; a cor do plástico é física
   e não pode deslocar (`D-DUAS-PECAS-NUNCA-TEM-A-MESMA-COR` × esta). Está
   aberta desde o mockup, e é a mesma pergunta da ONDA-CONEXOES-05 e da 07.

   **Medição de 27/08 que muda a probabilidade, não a pergunta:** o caso ficou
   **mais provável**. Antes, dois controles do mesmo plástico só colidiam se os
   dois estivessem no cabo — um deles no rádio caía no neutro e a colisão não
   aparecia. Com a cor lida também pelo rádio
   (`docs/protocol/dualsense-referencia-canonica.md:1574-1663`), os dois vêm
   coloridos e a colisão é a regra, não o azar. A resposta continua sendo dela.
