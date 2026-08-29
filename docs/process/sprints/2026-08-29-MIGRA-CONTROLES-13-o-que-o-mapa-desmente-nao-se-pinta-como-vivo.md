---
sprint: MIGRA-CONTROLES-13
onda: MIGRA-CONTROLES
posse:
  MC13:
    - src/hefesto_dualsense4unix/app/actions/controles_web.py
    - scripts/telas/aba02.py
    - src/hefesto_dualsense4unix/gui/telas/02-controles.html
cria:
  - scripts/check_a_tela_nao_promete_o_que_o_mapa_nega.py
  - tests/unit/test_migra_controles_13_a_tela_nao_promete.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-06
  - MIGRA-CONTROLES-11
  # SÉRIE: dividem o gerador, a página e o tradutor.
  - MIGRA-CONTROLES-08
  - MIGRA-CONTROLES-12
  # O acelerômetro só deixa de ser afirmação vazia quando esta existir.
  - ONDA-CONTROLES-04
  # SÉRIE INTERNA: divide o gerador e a página com a 04 e a 05, e o tradutor
  # com a 11 e a 12. É a última da onda.
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-04
  - MIGRA-CONTROLES-05
nao_toca:
  - docs/data/mapa-controles.csv
  - scripts/check_paridade_transporte.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/gui/main.glade
  - novo-layout/
---

# MIGRA CONTROLES · 13 — O que o mapa desmente não se pinta como vivo

**A regra é da casa e é antiga:** *"Antes de afirmar que uma feature funciona
num transporte, olhe a linha dela no `docs/data/mapa-controles.csv`."* Esta aba
a quebra em **três** lugares, no desenho aprovado.

## O defeito

### As três afirmações que o mapa desmente

| o que a aba desenha nos quatro cartões | o que o mapa diz |
|---|---|
| o bloco inteiro do alto-falante (medidor de 14 barras, volume, "Acordado", os dois botões de rota) | `audio.alto_falante@dualsense`: `cabo_aciona = parcial`, **`radio_aciona = não`** |
| o medidor de nível do microfone, 14 barras | vem do PipeWire, e **no rádio não há placa de som atribuível**: `LeituraMic.sink = ""` é, no próprio módulo, *"o caso do controle no RÁDIO, que não publica placa de som"* (`app/mic_monitor.py:118-127`), e `nivel = None` faz o card **apagar o medidor** |
| os três eixos do acelerômetro em `g` | `movimento.acelerometro@dualsense`: `cabo_aciona = não`, `radio_aciona = não`, com `so-ela-decide` nos dois |

Dois dos quatro cartões do mockup são BT (P2 e P3). **A mesa dela tem dois
controles**, e a chance de um deles estar no rádio é grande — é assim que ela
joga.

O acelerômetro é caso à parte e tem cura com nome: o nó evdev **já está aberto**
e os `ABS_X/Y/Z` dele **são** o acelerômetro (`core/evdev_reader.py:2092-2093`
diz isso com todas as letras). Quem o liga é a
[ONDA-CONTROLES-04](2026-08-27-ONDA-CONTROLES-04-o-acelerometro-esta-no-mesmo-node.md),
que atravessa a troca de motor intacta. **Enquanto ela não fechar, os três eixos
na tela são número inventado.**

### E a régua que deveria pegar isso NÃO EXISTE

**FATO CORRIGIDO.** O censo desta aba escreveu que
`scripts/check_paridade_transporte.py` *"reprova afirmação forte sem teste que a
sustente"* e concluiu que ele alcançaria estas três. **Ele não alcança.** Lido
em 29/08: ele mede o **mapa contra a suíte** — *"célula que afirma `aciona =
sim` com `de_onde_sei = medido` e `teste_que_morde` vazio"* —, e o próprio
cabeçalho declara o limite: *"Este arquivo mede AUSÊNCIA, e só."*

Ele nunca leu uma tela. **Nenhuma régua desta casa compara o que a interface
mostra com o que o mapa afirma**, e é por isso que as três atravessaram o
desenho, a aprovação e o censo sem ninguém tropeçar nelas.

## O que entrega

1. **Todo valor da tela carrega o transporte da peça a que pertence** — o
   `data-ctl` já diz de quem é o cartão, e o tradutor já sabe o `transport`
   (`controllers[].transport`). O que falta é a tela **usar** essa informação
   em vez de desenhar igual.
2. **Um estado visual para "aqui isto não vale", e ele explica.** Não é apagar:
   apagar some com a informação de que a peça **tem** aquilo. É esmaecer com a
   frase que diz **o quê, por quê e o que fazer** — regra desta casa para toda
   frase de diagnóstico.
3. **Um portão novo, `check_a_tela_nao_promete_o_que_o_mapa_nega.py`.** Ele lê a
   tabela de valores do gerador (a mesma da
   [MIGRA-CONTROLES-04](2026-08-29-MIGRA-CONTROLES-04-cada-valor-da-tela-ganha-endereco.md)),
   casa cada família com a sua chave no `mapa-controles.csv`, e **reprova valor
   pintado como vivo num transporte cujo `aciona` é `não`**.

   **Ele é a segunda régua, e é de propósito.** É regra desta casa: duas réguas
   independentes é o que revela, e o `check_paridade_transporte.py` continua
   fazendo a dele (o mapa contra a suíte). Esta faz a que faltava: **a tela
   contra o mapa.**
4. **A tabela do gerador ganha a chave do mapa por família.** Sem isso o portão
   teria de adivinhar, e portão que adivinha é o próximo instrumento falso.

## Como se prova (a mordida)

`tests/unit/test_migra_controles_13_a_tela_nao_promete.py`:

- **o portão pega as três de hoje**: rodado contra a página como ela está, ele
  acusa **exatamente** o alto-falante no rádio, o medidor de microfone no rádio
  e o acelerômetro nos dois transportes. **Se acusar menos, ele não vê o
  defeito; se acusar mais, ele vai reprovar quem estiver certo** — e o primeiro
  caso é o que fez seis instrumentos falsos em quinze horas em 29/08;
- **e ele desliga sozinho quando o fato muda**: com a `ONDA-CONTROLES-04`
  fechada e `movimento.acelerometro` virando `aciona = sim`, o portão **para**
  de acusar o acelerômetro, sem uma linha de edição. Deixe a lista das três
  escrita à mão dentro do portão e veja o teste reprovar — **régua que digita o
  que devia LER é a forma exata das onze de 26/08**;
- **o cartão no cabo continua inteiro**: esmaecer no rádio não pode esmaecer no
  cabo. Um controle USB e um BT lado a lado, e o teste afirma que os dois blocos
  saem **diferentes**;
- **a frase existe e diz as três coisas**: o quê, por quê, o que fazer.
  Esmaeça sem a frase e veja reprovar — um bloco cinza sem explicação é a
  janela dizendo "não" sem dizer nada;
- **`parcial` não é `não`**: `audio.alto_falante` é `parcial` no cabo, e
  `parcial` **não** esmaece — ele pede a ressalva do mapa na dica. Trate os dois
  igual e veja reprovar.

## O que é dela decidir — e é a decisão inteira

**O bloco do som nos cartões de rádio: esmaece com a frase, some, ou fica como
está?** Isto não é detalhe de desenho. É a regra do mapa de canais aplicada à
tela mais vista do produto, e as três saídas dizem coisas diferentes a quem
olha:

| saída | o que ela diz | o que ela custa |
|---|---|---|
| **esmaecer com a frase** | *"este controle tem alto-falante, e por aqui ele não toca"* | o cartão fica com duas caras, e ela já reprovou tela que muda de forma sem motivo |
| **sumir** | nada — e a pessoa conclui que o controle não tem a peça | o bloco reaparece ao trocar de cabo, e reaparecimento sem aviso lê como defeito |
| **ficar como está** | *"funciona"*, que é falso | é a queixa histórica dela: *"tínhamos algo para o cabo e na hora do vamos ver a versão de BT não funcionava"* |

**A terceira é a única que já sabemos estar errada.** As outras duas são dela.

E vale para as três afirmações, não só para o som: o medidor do microfone no
rádio e o acelerômetro seguem a mesma escolha, **ou não seguem** — e se não
seguirem, a aba passa a ter três gramáticas para a mesma ideia, que é a cicatriz
que o redesenho inteiro existe para fechar.
