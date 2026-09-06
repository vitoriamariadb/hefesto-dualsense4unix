---
sprint: ONDA-CONEXOES-09
estado: absorvida
posse:
  A9:
    - src/hefesto_dualsense4unix/app/actions/config/secao_exame.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
    - src/hefesto_dualsense4unix/app/actions/config/secao_orcamento.py
    - src/hefesto_dualsense4unix/integrations/lugar_declarado.py
cria:
  - tests/unit/test_conexoes_grava_na_hora_com_recibo.py
bancada: false
depois_de:
  - ONDA-CONEXOES-02
  - ONDA-CONEXOES-03
  - ONDA-CONEXOES-04
  - ONDA-CONEXOES-05
  - ONDA-CONEXOES-06
  - ONDA-CONEXOES-07
  - LEVA-4  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
  - MOTOR-DO-ARRANJO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
  - ORDEM-DE-SERVICO-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/footer_actions.py
  - src/hefesto_dualsense4unix/utils/maquina.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  # O portão da dívida é de QUEM COORDENA, e não desta onda: cada sprint
  # entrega o MANIFESTO do que ligou, e quem coordena aplica todos num
  # commit só. Está decidido desde 25/08 em
  # 2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md
  # ("cinco frentes o tocariam; cada uma entrega um manifesto").
  - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONEXÕES · 09 — a declaração grava na hora, com recibo

**O defeito, numa frase:** cor, microfone, perguntas de rádio, tipo dos rádios
vizinhos e perfil de Desempenho **só chegam ao disco pelo "Aplicar" do rodapé** —
e a `D-APLICAR-NAO-SALVA` diz que o "Aplicar" passa a aplicar **sem gravar**.
Sem esta sprint, nada do que ela declara nesta aba fica — e a cor que o produto
**lê** do aparelho não chega ao disco nem por aí.

## O QUE FALTA DELA — só a redação do recibo

**O "gravam na hora?" já está decidido, e não se reabre.**
`docs/data/decisoes-dela.csv:87` registra `D-A-CONEXOES-GRAVA-NA-HORA-E-LEMBRA`
como **decidida em 26/08/2026**, com a palavra dela: *"aplicar e salvar, além de
gravar na hora e lembrar se não salvar."* A razão é a mesma que esta sprint já
propunha — são **fatos da sala**, não ajuste de perfil: uma cor de plástico não é
opinião que se aplica e se descarta; é o que aquele aparelho **é**. A mesma linha
guarda o que ela lembrou junto: o mapeador via USB depende deste gravar-na-hora
para funcionar com o daemon parado.

**O que sobra da pergunta 1 da aba**
(`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8) é a **redação do
recibo** — a palavra `Guardado.` é proposta desta sprint, não decisão dela. Isso
não trava a execução: o mecanismo é o `RECIBO_GUARDADO` de `config/moldura.py`, e
trocar o texto depois é uma constante.

## O que entrega

**O chamador que falta** para `integrations/lugar_declarado.declarar_a_mesa`
(`:95`), que nasceu em 25/08 e está no registro
`portao_a_casa_sabe_e_o_produto_nao_faz.py:1080` com a razão exata: *"hoje o
ÚNICO escritor do `maquina.json` é o IPC `machine.declare`, logo com o daemon
parado nada do que ela declara chega ao disco."*

Cada gesto que produz um fato da sala, nas quatro seções, passa a gravar na hora:

| gesto | seção | porta |
|---|---|---|
| cor do plástico (declarada ou corrigida) | Os controles | `declarar_a_maquina` |
| **cor do plástico (lida do aparelho)** | **Os controles** | **`declarar_a_maquina`** |
| microfone pelo rádio, por controle | Os controles | `declarar_a_maquina` |
| o botão do mic muda | Os controles | rascunho + `declarar_a_maquina` |
| as duas perguntas de rádio | Está tudo certo? | `declarar_a_mesa` |
| o que é cada rádio vizinho | Conexões | `declarar_a_mesa` |
| nome do adaptador | Conexões | `declarar_a_mesa` |
| ordem de serviço ignorada | Está tudo certo? | `declarar_a_mesa` |
| perfil de desempenho | Desempenho | `declarar_a_maquina` |

**A segunda linha é nova, e é a que faltava.** As outras oito são gestos **dela**;
esta é o que o **produto leu** do aparelho, e hoje ela é jogada fora: o
`_chegou_a_cor` de `secao_controles.py:936` só repinta a borda e o nome do card
(`:954-955`) e nunca grava. Desde 27/08 a leitura chega **nos dois transportes** —
cabo e rádio (`docs/protocol/dualsense-referencia-canonica.md:1574-1663`) — então
o que se perde por sessão deixa de ser um caso de canto.

**Por que ela entra AQUI, e não na ONDA-JOGAR-07:** a JOGAR-07 quer exatamente
esse dado no disco — é o entregável 2 dela
(`docs/process/sprints/2026-08-27-ONDA-JOGAR-07-as-pecas-com-a-cor-do-plastico.md:132`).
Ou a 09 abre esta linha, ou a JOGAR-07 grava por um caminho próprio e nascem
**dois escritores do `maquina.json`** — que é o defeito que
`integrations/lugar_declarado.py` existe para não repetir, e que o registro do
portão descreve com todas as letras
(`portao_a_casa_sabe_e_o_produto_nao_faz.py:1080`).

**As duas portas não são dois donos**, e a distinção é do próprio módulo:
`declarar_a_mesa` é escopada à seção `mesa` e grava **uma resposta por vez**;
`declarar_a_maquina` recebe o documento inteiro. Mandar o documento pela porta
estreita **perderia calado** `mapa`, `controles` e `orcamento` — o defeito que o
módulo existe para não repetir. Escolha a porta pelo escopo do gesto, nunca pela
conveniência. **A linha nova obedece a mesma regra:** a cor lida mora em
`controles`, fora da seção `mesa`, logo a porta é `declarar_a_maquina` — por
ESCOPO, e não porque a outra estivesse à mão.

**O recibo é o que cura o sintoma dela.** *"janela ok, muito bom mas os botões
não funcionam"* — os handlers sempre estiveram lá; faltava a tela dizer que o
gesto chegou. O molde já existe e é desta casa: `RECIBO_GUARDADO` em
`config/moldura.py`, um rótulo vazio que ganha `Guardado.` em verde no instante
do gesto (`secao_janela.py`, decisão 4). **Reusar, não reinventar.**

**Com o daemon parado grava do mesmo jeito** — é o ponto todo do módulo: não há
caminho de IPC nele.

## Como se prova — o teste que morde

`tests/unit/test_conexoes_grava_na_hora_com_recibo.py`:

* **com o daemon morto**, cada um dos nove gestos acima escreve no
  `maquina.json` de teste e devolve `Recibo(gravou=True)`. Sem IPC nenhum;
* **um gesto não apaga o vizinho**: declarar a cor logo depois de responder uma
  pergunta de rádio deixa as **duas** no arquivo. É a fusão aninhada, e é ela que
  impede a perda calada;
* **a cor lida não apaga a cor declarada**: com a cor corrigida por ela no disco,
  a leitura do aparelho chega **depois** com outro código e o arquivo continua
  com a **dela**. A declaração vence a leitura — é a precedência que a
  ONDA-ILUMINACAO-08 fixa
  (`docs/process/sprints/2026-08-27-ONDA-ILUMINACAO-08-a-cor-do-plastico-chega-a-aba.md:78`)
  e a decisão dela de 21/08
  (`docs/data/cores-do-plastico.md:15-17`, *"a escolha dela vence a tabela"*).
  Esta asserção é a que pega a perda calada do caminho novo: sem ela, a leitura
  automática sobrescreve a correção da pessoa em silêncio, e **nenhum `grep`
  acha**;
* **o recibo aparece e some**: o rótulo ganha `Guardado.` no gesto e volta a
  vazio depois. Recibo grudado ensina que a tela travou;
* **a régua sabe recusar**: com o disco em modo somente-leitura,
  `Recibo(gravou=False)` chega à tela como frase de erro **visível**, nunca
  silêncio. Dublê que só sabe aceitar não é dublê;
* o portão `portao_a_casa_sabe_e_o_produto_nao_faz` fica verde com a lápide de
  `lugar_declarado.py::declarar_a_mesa` **removida**.

**A mordida:** troque `declarar_a_maquina` por `declarar_a_mesa` no gesto da cor
e veja a segunda asserção reprovar — é ela que pega a perda calada, que nenhum
`grep` acha. Arranque a precedência (deixe a leitura escrever por cima sem olhar
o que ela declarou) e veja a terceira reprovar nomeando as duas cores. Depois
faça a gravação falhar em silêncio e veja a quinta reprovar. Cole as três saídas.

## O que é dela decidir

1. **A redação do recibo.** `Guardado.` é proposta desta sprint. O gravar-na-hora
   já é decisão dela (`docs/data/decisoes-dela.csv:87`, 26/08), então esta é a
   única palavra que falta — e ela não bloqueia a execução: o texto é uma
   constante em `config/moldura.py`.
