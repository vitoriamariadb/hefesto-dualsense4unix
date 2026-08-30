---
sprint: A-COR-PELA-PORTA-DO-BROKER-01
onda: CONEXOES
posse:
  COR-BROKER:
    - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
cria:
  - tests/unit/test_a_cor_entra_pela_porta_do_broker.py
bancada: true
depois_de:
  # SÉRIE por R5: as três dividem `integrations/cor_do_plastico.py`. Esta vem
  # por último de propósito — a 11 muda COMO se lê no rádio, a 12 muda O QUE se
  # sabe, e esta muda POR ONDE se entra. As três seriam a mesma edição se
  # corressem juntas.
  - ONDA-CONEXOES-08
  - ONDA-CONEXOES-11
  - ONDA-CONEXOES-12
nao_toca:
  - scripts/ensaios/cor_do_plastico.py
  - docs/data/cores-do-dualsense.csv
  - docs/data/cores-do-plastico.md
  - src/hefesto_dualsense4unix/broker/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# A COR PELA PORTA DO BROKER · 01 — o ensaio lê, o produto não

**O defeito, numa frase:** o ensaio lê a cor do plástico dos controles dela e o
produto responde *"Não sei"* para os mesmos aparelhos, na mesma máquina, no
mesmo minuto — porque o ensaio entra pela porta do broker e o produto bate no nó
escondido.

## O que está medido — 29/08/2026, na máquina dela

- **`ler_pelo_cabo()` devolve `None` para os DOIS controles.** Não é código
  desconhecido nem aparelho recusando: é permissão.
- **A causa tem endereço.** Os nós hidraw dos DualSense ficam `0600 root:root`
  porque o BROKER-01 os esconde do jogo (`install.sh:56`,
  `broker/hidraw_broker.py:415` — `setfacl -b` + `chmod 0600`), e
  `integrations/cor_do_plastico.py:474` abre `/dev/hidrawN` com `os.open` direto.
  O `except OSError` da linha seguinte engole o erro num `logger.debug`
  (`cor_do_plastico_sem_acesso`) e devolve `None` — que a tela mostra como
  *"Não sei"*.
- **A porta certa já existe nesta casa, e é produção**, não instrumento:
  `integrations/hidraw_broker_client.abrir_hidraw` (`:593`) tenta o broker
  primeiro (fd `O_RDWR` do nó ESCONDIDO por `SCM_RIGHTS`), cai no `open()`
  direto quando o broker não existe (CI, checkout, install antigo) e **diz por
  qual porta entrou** (`PORTA_BROKER` / `PORTA_DIRETA`, `:533-534`). Quando as
  duas falham, levanta `PortaFechadaError` com as duas respostas — nunca um
  `EACCES` pelado.
- **O ensaio já faz certo, e o mapa registra a receita:** a linha
  `identidade.cracha_nos_dois_transportes` do `docs/data/mapa-controles.csv`
  descreve a leitura *"pela porta do broker com SCM_RIGHTS porque os quatro nós
  estão 0600 root:root, com o daemon RODANDO e sem parar nada"*.

**A célula `cabo_aciona = sim` de `identidade.cor_do_aparelho`
(`docs/data/mapa-controles.csv:111`) é verdadeira sobre o ENSAIO e falsa sobre o
PRODUTO.** Corrigir a célula é da frente do mapa; ligar o produto é desta sprint.

## Por que isto não é a CONEXÕES-11 nem a 12

São três defeitos independentes no mesmo módulo, e curar um deixa os outros dois
com o sintoma idêntico — a mesma armadilha dos três portões da CONEXÕES-11:

| sprint | o que ela cura | com ela sozinha |
|---|---|---|
| ONDA-CONEXOES-11 | a semente do CRC e os três filtros que recusam o rádio | o rádio passa a ser possível e continua `None` por permissão |
| ONDA-CONEXOES-12 | 21 modelos viram 28, com as 10 zonas | a tabela fica completa e nunca é consultada |
| **esta** | **a porta** | a cor chega — e só então as outras duas aparecem na tela |

## O que entrega

1. **`_perguntar_ao_hidraw` entra pela porta do broker.** O `os.open` de `:474`
   vira `abrir_hidraw(caminho, escrita=True)`, com o `fd` do `NoAberto` e o
   mesmo `finally` fechando. O `PortaFechadaError` é capturado no mesmo lugar em
   que hoje se captura o `OSError`: **o módulo continua devolvendo `None`, nunca
   levantando** — o contrato dos chamadores não muda.
2. **A porta vai ao log, e o motivo junto.** O `logger.debug` de hoje diz apenas
   que não deu; passa a dizer **por qual porta** e **por quê** (`no.porta`,
   `no.motivo`). Sem isso, a próxima pessoa mede de novo o que esta sprint já
   mediu.
3. **"Não pude ler" deixa de ser "Não sei".** São dois estados diferentes e hoje
   saem iguais: código fora da tabela é resposta legítima; porta fechada é
   defeito nosso. O valor de retorno ganha a distinção que a tela vai consumir
   na ONDA-CONEXOES-09 — que é quem grava a cor lida.

## Como se prova (a mordida)

`tests/unit/test_a_cor_entra_pela_porta_do_broker.py`, com dublê de cliente
(`abrir_hidraw` já tem o ponto de injeção `cliente=`, `:616`):

- **o nó escondido é lido.** Cliente-dublê que devolve um `fd` de um `hidraw`
  falso, `os.open` do caminho **levantando `PermissionError`**: a cor sai. **A
  mordida:** devolva o `os.open` ao lugar do `abrir_hidraw` e veja `None`
  voltar — é o produto de hoje;
- **sem broker, o cabo continua funcionando.** Cliente-dublê que recusa e
  `os.open` que funciona (o CI, o checkout, a máquina sem install): a cor sai
  igual, e o log diz `open() direto`. **A mordida:** faça a queda ser silenciosa
  e veja reprovar — queda calada é o que fez esta casa consertar regra udev que
  estava certa;
- **as duas portas fechadas não derrubam a tela.** `PortaFechadaError` vira
  `None` com motivo no log, e o card mostra o estado de "não pude ler", **nunca**
  uma cor inventada;
- **a régua não é a mesa desta casa.** O teste não usa os MACs nem os hidraw
  dela: dublês. Uma prova que só passa com os dois DualSense daqui não mede a
  cura, mede a bancada.

**O aceite de bancada, e ele é dela:** com o daemon RODANDO e sem parar nada, a
janela mostra a cor dos controles que hoje mostram *"Não sei"*. É o mesmo
protocolo do ensaio, e é o único jeito de saber que a porta abriu na máquina de
verdade.

## Nada se perdeu

- o `open()` direto continua vivo, e é o segundo braço do `abrir_hidraw` — quem
  roda sem broker (CI, checkout) lê como sempre leu;
- o contrato dos chamadores não muda: `cor_do_codigo`, `cor_do_nome` e
  `ler_pelo_cabo` mantêm assinatura e mantêm `None` como resposta válida;
- a decisão de 21/08 (a cor declarada por ela vence a lida) não é tocada aqui —
  ela mora na ONDA-CONEXOES-09 e na ONDA-ILUMINACAO-08.

## O que é dela decidir

Nada de tela nesta sprint. **O que espera a mão dela é o aceite de bancada** — a
foto da janela com a cor dos dois controles, com o daemon rodando.
