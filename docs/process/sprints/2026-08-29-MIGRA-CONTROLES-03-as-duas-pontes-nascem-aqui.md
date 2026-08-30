---
sprint: MIGRA-CONTROLES-03
onda: MIGRA-CONTROLES
posse:
  MC3:
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
cria:
  - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
  - tests/unit/test_migra_controles_03_as_duas_pontes.py
  - docs/process/medicoes/2026-08-29-quanto-custa-pintar-uma-aba-por-run-javascript.md
bancada: false
depois_de:
  # A ponte se acopla ao WebView, e quem o cria é a 01. Módulo PRÓPRIO de
  # propósito: se a ponte morasse dentro do módulo do enxerto, as duas sprints
  # dividiriam um arquivo sem precisar, e as nove ondas que só querem a ponte
  # passariam a depender do enxerto.
  - MIGRA-CONTROLES-01
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/actions/
  - src/hefesto_dualsense4unix/app/widgets/
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA CONTROLES · 03 — As duas pontes nascem aqui

**Dono único para as dez abas.** Medido em 29/08: as duas pontes custam **31
linhas, UMA VEZ** — e é esse número, contra as 500 a 700 linhas **por aba** da
rota que emitia GTK, que decidiu a tecnologia
(`D-A-INTERFACE-NOVA-E-O-MOCKUP-DENTRO-DE-UMA-JANELA-GTK`).

## O defeito

**Não existe canal nenhum entre o Python e a página.**
`novo-layout/_ferramentas/ver.py` (147 linhas) é só **visor**: os quatro pinos  <!-- ref-externa: mora em `novo-layout/`, que é .gitignore e NÃO viaja em worktree -->
(`:28-31`), duas folhas de estilo de usuário (`:68`, `:82`) e `load_uri`
(`:92`). Nenhum `register_script_message_handler`, nenhum `run_javascript`.

Sem as duas pontes, tudo o que as outras doze sprints desta onda entregam não
tem por onde chegar à tela nem por onde voltar. **É a dependência dura da onda
inteira**, e das outras nove.

## O que entrega

Um módulo `gui/ponte_da_tela.py` com **duas funções e um contrato**, e nada
mais. Ele não sabe o que é um controle, uma bateria ou um giroscópio — quem sabe
é quem chama.

1. **A pintura: Python → página.** Uma chamada por **tique**, não por valor.
   O Python monta um objeto com tudo o que mudou e chama `run_javascript` uma
   vez; a página distribui.

   **A razão é uma conta que ninguém fez ainda, e esta sprint tem de fazer:** o
   card pinta a leitura viva **dez vezes por segundo** (é o que a dica do
   mockup promete, `novo-layout/_ferramentas/aba02.py`, bloco do Giroscópio).
   Com 29 valores por controle e quatro controles na mesa, uma chamada por
   valor são **1.160 chamadas por segundo** atravessando a fronteira. **Ninguém
   mediu quanto isso custa**, e a diferença entre uma e outra forma pode ser a
   diferença entre a aba viva e a janela travada. O resultado vai para
   `docs/process/medicoes/2026-08-29-quanto-custa-pintar-uma-aba-por-run-javascript.md`.

2. **O gesto: página → Python.** `register_script_message_handler` — e na série
   **4.1**, que é a de GTK 3, ele leva **um** argumento (na 6.0 leva dois).
   Toda mensagem chega como **texto**, e o módulo:
   - a lê como JSON e **recusa** o que não casar com a forma declarada,
     dizendo o que veio. Nunca `eval`, nunca despacho por nome vindo de fora;
   - devolve à página um **recibo** por gesto — aceito ou recusado, com o
     motivo. É o mesmo princípio do resto do produto: *o produto responde pelo
     transporte, não pelo efeito*, e **ausência de notícia é lida como
     sucesso.**

3. **O valor nunca é interpolado em JavaScript.** Ele é serializado em JSON e a
   página o recebe como dado. Um nome de plástico com apóstrofo — e o CSV tem
   28 modelos — quebraria o script inteiro, calado.

4. **Uma folha de usuário, e ela é do módulo.** `select{appearance:none}`, sem a
   qual o WebKitGTK relata as cores do autor e desenha a caixa **branca** do
   tema do sistema. São **117** `<select>` nas dez abas.
   **Esta aba não tem nenhum** (conferido: os dois `<select>` que aparecem no
   `02-controles.html` estão dentro de comentário de CSS), então aqui a cura não
   se prova pelo olho — ela viaja no módulo pelas outras nove, e a régua dela é
   de quem tiver `<select>` na página.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_03_as_duas_pontes.py`:

- **o gesto malformado é RECUSADO com motivo, nunca engolido**: mande `"{"`,
  `"[]"`, um JSON válido com campo que não existe e um com o tipo errado. Os
  quatro têm de voltar recusados, cada um dizendo o quê. **Arranque a validação
  e veja o teste passar a aceitar `[]` como gesto** — é assim que se sabe que a
  régua mede a recusa e não o caminho feliz;
- **o apóstrofo não quebra a página**: pintar um valor `O'Neill` e afirmar que
  o que chegou ao DOM é a string inteira. **Troque o JSON por interpolação de
  texto e veja reprovar** — este é o teste que impede o defeito calado;
- **uma chamada por tique, não por valor**: dublê que conta chamadas a
  `run_javascript`; pintar 29 valores tem de custar **1**. Devolva o laço por
  valor e veja o contador ir a 29;
- **a assinatura é a da 4.1**: AST — `register_script_message_handler` chamado
  com **um** argumento. Ponha o segundo (a forma da 6.0) e veja reprovar;
- **o recibo existe**: todo gesto aceito devolve confirmação à página. Arranque
  o recibo e veja reprovar — sem ele, a tela mostra o clique como feito antes de
  o produto ter feito, que é o defeito que a `LIGHTBAR-BT-RESET-01` já cobrou
  desta casa;
- **a medição é dupla ou não vale**: o documento tem o custo das duas formas
  (uma chamada por valor e uma por tique), medidas na mesma máquina. Apague uma
  e o teste reprova.

## O que é dela decidir

Nada nesta sprint. Ela não muda um pixel e não muda uma palavra da tela — é
encanamento. **Se a medição do item 1 disser que dez tiques por segundo não
cabem**, aí sim vira pergunta dela: a leitura viva do card desce de frequência,
ou a aba pinta menos coisa por tique?

## Nota de coordenação

**As outras nove ondas esperam este módulo, e o citam por outro nome.** As
sprints `MIGRA-SISTEMA-01`, `MIGRA-LANCADORES-01`, `MIGRA-LANCADORES-02` e
`MIGRA-CONEXOES-01` declaram `depois_de: MIGRA-MOLDURA-01` — que é esta sprint
mais a [MIGRA-CONTROLES-02](2026-08-29-MIGRA-CONTROLES-02-a-pagina-muda-de-casa-e-passa-a-viajar.md).
A reconciliação dos ids é de quem coordena e está descrita no
[índice](2026-08-29-MIGRA-CONTROLES-INDICE.md). **Não escreva uma segunda
ponte**: duas pontes é a cicatriz de dono duplo que esta casa já pagou.
