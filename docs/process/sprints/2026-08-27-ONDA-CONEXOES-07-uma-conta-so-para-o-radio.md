---
sprint: ONDA-CONEXOES-07
posse:
  A7:
    - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
cria:
  - tests/unit/test_conexoes_uma_conta_so_para_o_radio.py
bancada: false
depois_de:
  - ONDA-CONEXOES-02
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - MOTOR-DO-ARRANJO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/integrations/plano_de_radio.py
  - src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
  - src/hefesto_dualsense4unix/core/rumble.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
---

# ONDA CONEXÕES · 07 — uma conta só para o rádio

**O defeito, numa frase:** a aba mede as mesmas 1.600 fatias **duas vezes**, por
dois módulos diferentes, uma abaixo da outra — e a tabela do Desempenho gasta
cinco linhas para dizer que **quatro delas não fazem nada**.

Fonte: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8, *"As duas
contas do rádio viram uma"* e *"As quatro linhas 'Ainda não tem por onde ser
limitado'"*; `novo-layout/_ferramentas/aba08.py:376-425`. Decisões:
`D-AS-ABAS-CONVERSAM`, `D-O-MIC-LIGADO-VALE-NO-RADIO`, `D-PERFIL-DE-DESEMPENHO`.

**Depende da ONDA-CONEXOES-02**, que tira as barras "Rádio em uso" da seção da
mesa. Esta sprint é o lugar único onde a conta passa a viver.

## O que entrega

**Uma régua por adaptador**, com as 1.600 fatias inteiras na largura
(`aba08.py:397-423`):

* o que está **em uso** vem na **cor do plástico** de quem gastou — a mesma cor
  da tira lá em cima, porque a borda é a identidade da peça;
* o **microfone** é a tampa laranja ao lado, e não some: 16,3 contra 260,4 é 6%,
  e num empilhado simples ele vira fio invisível — a decisão dela (*"ligado, com
  o preço na tela"*) ficaria sem prova;
* as **vagas tracejadas** dizem o que **cada controle a mais custaria**, com o
  total acumulado escrito dentro: `+1 · 553`, `+1 · 830`, `+1 · 1.107`. É a
  imagem que responde de um olhar as três perguntas — quanto já foi, quanto cada
  um custa, quantos ainda cabem;
* **uma pista por adaptador**, inclusive a vazia. É o adaptador vazio que dá
  sentido à ordem de serviço lá em cima.

**Os números são LIDOS, nunca digitados.** 260,4 sem microfone, 276,7 com,
1.600 por adaptador: todos saem de `integrations/plano_de_radio`
(`:49-51` declara a procedência de cada um — as 1.600 são especificação de
terceiro, os outros dois são medição desta casa, A/B de 25/07/2026). Digitar
"276,7" nesta tela é o `HARM-19` de novo.

**A tabela do teto encolhe para UMA linha.** `LINHAS_DO_TETO` já é o dono único
e `alcance_de_hoje()` já DERIVA a frase dela — o que muda é que as quatro linhas
sem ponto de aplicação (Gatilhos, Barra de luz, Microfone por rádio, Giroscópio)
**saem da tabela**. Quatro quintos de uma tabela dizendo que não fazem nada
ensina a ignorar a tabela. Só **Vibração** tem teto real, medido em
`core/rumble.py` (`_ORCAMENTO_COM_TETO` só casa com `economia`).

**O perfil vira seletor**, na linha da régua: `Tudo ligado / Bateria longa / Eu
escolho` — regra dela do campo de opções fixas. A chave de disco **não muda**:
o esquema continua `Literal["economia","balanceado","max","auto"] | None`, e
`PERFIL_POR_TETO` é a migração 1-para-1 que já existe.

**O microfone continua FORA do perfil.** Ele é o único que capta a sala; perfil
que liga microfone sozinho transforma escolha de desempenho em escolha de
privacidade feita pelas costas. O que a seção mostra dele é o **preço**.

## Como se prova — o teste que morde

`tests/unit/test_conexoes_uma_conta_so_para_o_radio.py`:

* **os três números batem com o módulo**: a largura de cada bloco e o texto de
  cada vaga são comparados contra `plano_de_radio`, nunca contra literal
  digitado no teste. Mude a constante no módulo e o teste continua verde; digite
  o número na tela e ele reprova;
* com **um** controle no rádio com microfone, a pista publica `276,7 de 1.600` e
  **três** vagas, e a última diz `1.107` — que é a conta que a
  `D-O-MIC-LIGADO-VALE-NO-RADIO` mandou pôr na tela;
* adaptador **sem controle nenhum** publica a pista vazia com a frase, e
  **nunca** "0/1600" em verde — zero pinta verde, e "0 de 1.600" é afirmação
  numérica sobre o que não se leu (`secao_orcamento.py:567`);
* a tabela do teto tem **uma** linha de recurso;
* **a seção não grava.** O portão `test_o_clique_nao_grava_nada` nomeia a única
  leitura permitida (`daemon.state_full`) e reprova qualquer outra — continua
  valendo palavra por palavra.

**A mordida:** digite `276,7` no lugar da leitura e veja a primeira asserção
reprovar. Devolva as quatro linhas mortas à tabela e veja a quarta reprovar.
Cole as duas saídas.

## O que é dela decidir

1. **Dois controles do mesmo plástico ficam com o mesmo bloco na régua**, além
   da mesma borda. Continua sem resposta (`aba08.py`, "Ainda aberto", item 2).
2. **Prova de tela**: a régua é desenho novo, e o mockup é o alvo — mas a tela
   GTK ainda pede foto antes e depois (`PROVA-DE-TELA-01`).
