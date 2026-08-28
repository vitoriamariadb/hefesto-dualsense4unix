---
sprint: ONDA-CONEXOES-02
posse:
  A2:
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
cria:
  - tests/unit/test_conexoes_o_inventario_da_mesa.py
bancada: false
depois_de:
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - MOTOR-DO-ARRANJO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
  - src/hefesto_dualsense4unix/integrations/mesa_de_radio.py
  - src/hefesto_dualsense4unix/integrations/radio_da_mesa.py
  - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
  - src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
---

# ONDA CONEXÕES · 02 — o inventário físico da mesa

**O defeito, numa frase:** a seção "Conexões" é o saco que sobrou — ela mede o
rádio uma segunda vez, pergunta duas coisas que são do exame, oferece um segundo
botão de reexaminar, e desenha os quatro rádios vizinhos como uma tabela de
205 px que o mockup faz em 108.

Fonte: `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8;
`novo-layout/_ferramentas/aba08.py:330-372` (o quadro "Conexões" do mockup).

## O que entrega

**Fica** — inventário físico, e só isso:

* **a tabela de adaptadores com TRÊS colunas**: `Nome · Adaptador · Onde está`,
  mais a ação `renomear` no fim da linha. Hoje o cabeçalho tem duas
  (`secao_mesa.py:1037`, `["Adaptador", "Onde está"]`) e o nome é um campo
  livre solto (`_COLUNA_NOME`, `:260`);
* **"Desenhar a minha mesa"** e **"Ensinar as minhas entradas"**, que já existem
  e já abrem (`:1613` `JanelaDeCalibrarEntradas`, `:1631` a janela do mapa);
* **os rádios vizinhos**, agora **sem tabela**: um rótulo e um seletor por
  rádio, dois por linha. O seletor tem as sete respostas do mockup
  (`aba08.py:23`, `VIZINHOS`) e **"Outro" reabre o campo de texto**, que foi
  cortado por falta de altura.

**Sai:**

* **"Reexaminar a mesa"** (`secao_mesa.py:711`) — funde com "Examinar de novo"
  da seção do exame. Os dois releem a mesma coisa; dois botões para um gesto é o
  que a `D-TUDO-QUE-EXPLICA-VIRA-DICA` chama de verbosidade paga em altura.
  O método `_reexaminar_a_mesa` que o `_REFRESH_POR_ABA` procura **continua
  existindo** — sai o botão, não a fiação;
* **as barras "Rádio em uso"** (`_medidores_da_mesa`, `:2077`; `_rotulo_do_medidor`,
  `:2125`) — a conta do rádio passa a ser **uma só**, na seção Desempenho
  (ONDA-CONEXOES-07). Hoje a barra daqui e o texto de lá medem as mesmas 1.600
  fatias por dois módulos diferentes, uma abaixo da outra (`D-AS-ABAS-CONVERSAM`);
* **as duas perguntas de rádio** (`_PERGUNTA_DA_ALTURA`, `:335`, e a da linha de
  visada) — vão para a terceira coluna do exame, que é onde elas respondem
  (ONDA-CONEXOES-03). A gravação delas (`altura_da_antena`, `linha_de_visada`,
  `:508-509`) **não muda de chave**;
* **o "Corrigir" da coluna "O que é"** como botão separado: os quatro rádios
  passam a ter o mesmo seletor, e mudar a resposta já é corrigi-la. É a regra
  dela do campo de opções fixas aplicada até o fim.

**A precedência de três degraus continua inteira** (`secao_mesa.py`, cabeçalho):
a correção dela vence o kernel, o kernel vence o vazio. O que muda é a forma do
widget, nunca quem manda.

## Como se prova — o teste que morde

`tests/unit/test_conexoes_o_inventario_da_mesa.py`:

* a seção monta com censo vazio, mapa vazio e mesa vazia **sem levantar** — é o
  contrato de toda seção desta aba (`montar`, `:398`);
* a tabela publica os três cabeçalhos, nessa ordem;
* **nenhum widget da seção tem o rótulo "Reexaminar a mesa"**, e
  `host._reexaminar_a_mesa` continua chamável;
* **nenhum medidor**: a seção não produz rótulo que comece por "Rádio em uso";
* escolher "Outro" num vizinho revela um campo de texto editável;
* as duas perguntas de rádio não estão mais aqui, e as **chaves de disco
  continuam as mesmas** — o teste grava por `_mesa_declarada` e lê
  `altura_da_antena` / `linha_de_visada` de volta.

**A mordida:** devolva o botão "Reexaminar a mesa" e a chamada de
`_medidores_da_mesa`; rode e veja as duas asserções reprovarem. Depois arranque
a migração das chaves e veja a última reprovar — é ela que impede que "mudou de
lugar na tela" vire "mudou de lugar no disco", que apagaria declaração dela.
Cole as duas saídas.

## O que é dela decidir

1. **O "corrigir" dos vizinhos volta?** O mockup o eliminou como botão e ela já
   foi avisada: *"se você quiser o 'corrigir' de volta, ele volta"*
   (`aba08.py`, "Escolhas que precisam do seu aval").
2. **Onde estas declarações gravam**, agora que "Aplicar" não salva
   (`D-APLICAR-NAO-SALVA`). Está na ONDA-CONEXOES-09 e é palavra dela.
