---
sprint: VAO-DO-ESQUELETO-01
estado: aberta
onda: A-LISTA-DE-0911
posse:
  VAO-DO-ESQUELETO-01:
    - src/hefesto_dualsense4unix/interface/topo.html
    - src/hefesto_dualsense4unix/interface/monta.py
cria: []
bancada: false
# AS DUAS JÁ REIVINDICAM O `topo.html`, e as três não podem correr juntas nele:
# a ALTURA-DA-VISTA mexe na ALTURA da janela, que é a outra metade desta conta
# (o vão é o que sobra dentro dela). Esta vem DEPOIS por dois motivos — o
# arquivo é o mesmo, e a §4 aqui espera a palavra dela.
depois_de:
  - ALTURA-DA-VISTA-01
  - DICA-DA-COR-01
  # SERIALIZADA PARA DEPOIS DA SEGUNDA LISTA DELA — 11/09/2026, e é o
  # mesmo precedente da lista anterior: a queixa VIVA vem primeiro. As
  # frentes abaixo reescrevem o TEXTO dos arquivos que esta sprint
  # também toca; medir ou desenhar sobre a prosa de ontem seria medir o
  # mundo de ontem — e a costura viraria «a última a gravar vence».
  - ESQUELETO-C2
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/aba08.py
---

# VAO-DO-ESQUELETO-01 — a faixa vazia de três páginas, e a decisão dela de 27/08

> **ELA VÊ ANTES DE ALGUÉM EXECUTAR.** Esta sprint nasce MEDIDA e PARADA: o que
> a GATILHOS-VAO-01 tratava como defeito é, no disco, **uma escolha dela** — e
> desfazê-la sem a palavra dela devolveria exatamente o que ela recusou em
> 27/08/2026. A §4 é a pergunta.

Nasceu da GATILHOS-VAO-01 (11/09/2026), §2, que mandou medir o vão nas dez
páginas e, *"se for de várias"*, deixar a cura para o esqueleto.

---

## §1 — A QUEIXA, e o que ela disse

> *"tem uma falha horizobntal nos blocos das páginas (…)"*  <!-- noqa-acento: citação literal dela -->

Na foto da Gatilhos o quadro «Seleção de Gatilho» termina e sobra uma faixa
vazia até o rodapé. O quadro não cresce para ocupá-la.

## §2 — A MEDIÇÃO, nas dez páginas publicadas

Chrome headless, 1920x1080, moldura de 1600px, sem janela na tela dela. A medida é
a distância entre o fim do último elemento visível do `.miolo` e o fundo útil
dele (descontado o `padding-bottom`):

| página | vão | último elemento |
| --- | ---: | --- |
| `08-conexoes.html` | **163 px** | `quadro` |
| `03-gatilhos.html` | **161 px** | `quadro` |
| `01-jogar.html` | **142 px** | `quadro` |
| `05-vibracao.html` | 24 px | `quadro` |
| `06-navegacao.html` | 23 px | `quadro` |
| `04-iluminacao.html` | 4 px | `quadro luzes` |
| `07-lancadores.html` | 0 px | `quadro estica` |
| `09-sistema.html` | 0 px | `quadro` |
| `10-perfis.html` | −20 px | `tab` (passa do fundo) |
| `02-controles.html` | −267 px | `card-corpo` (passa do fundo) |

**São TRÊS páginas com faixa grande, não uma.** O comando que mede está na
entrega da GATILHOS-VAO-01.

## §3 — O ESQUELETO JÁ SABE ESTICAR, e quem não estica são as abas

`topo.html:352` traz `.miolo > .quadro.estica{flex-grow:1;…}`, e as três
páginas com vão ZERO ou negativo são as que a usam. **O mecanismo existe e
funciona** — o que falta é as três abas pedirem, e isso é uma linha em cada
gerador.

Logo **a cura NÃO é técnica**. É a §4.

## §4 — A PERGUNTA, E ELA É DELA — porque a resposta já foi dela uma vez

O `topo.html` guarda a razão, com a palavra dela de 27/08/2026:

> *"O QUADRO NÃO ESTICA POR PADRÃO. Ele já esticou: com a altura da janela fixa,
> o último quadro de toda aba encostava no rodapé, e nas abas curtas isso virou
> um quadro cinza gigante e vazio. Ela, 27/08: «nessa aba encurtar verticalmente
> o bloco cinza então»."*

E a decisão vizinha, da altura única das dez abas, tem a outra metade:

> *"Ela, 27/08: «sair clicando entre as abas causa muito desconforto, pq muda
> tudo». (…) com 1048 a Iluminação ficava com 518px de quadro vazio. Ela:
> «iluminação, jogar e outras abas tão muito ruins com esse super espaço vazio
> na parte inferior»."*

**As duas falas dela são sobre a MESMA sobra**, e apontam para lados opostos:
ela não quer o quadro cinza gigante, e não quer a faixa vazia. O desenho de hoje
escolheu a faixa; a queixa de 11/09 é sobre essa escolha.

Os três caminhos, com o preço medido de cada um:

| caminho | o que muda | o que custa |
| --- | --- | --- |
| **a) o quadro estica** nas três (`estica` em `aba01`, `aba03`, `aba08`) | a faixa some | volta o quadro cinza com 163px de nada dentro — o que ela recusou em 27/08 |
| **b) a janela encolhe por aba** | a faixa some sem caixa vazia | o rodapé pula ao trocar de aba — o *"muda tudo"* que ela recusou em 27/08 |
| **c) fica como está** | nada | a queixa de 11/09 fica de pé |

**Há um quarto caminho e ele não é nenhum dos três: as três páginas têm pouco
conteúdo porque campos que existem no produto ainda não estão nelas.** Encher a
página é a única saída que não paga nenhum dos dois preços — e é trabalho de
outra fila, não de layout.

## §5 — O QUE ENTREGAR

Nada, até ela responder a §4. Depois:

1. o caminho que ela escolher, aplicado às **três** páginas de uma vez — não
   uma, senão a próxima pessoa remede as outras duas;
2. a régua que mede o vão das dez (o script da entrega da GATILHOS-VAO-01 é o
   molde), com o teto que a resposta dela definir;
3. a foto antes e depois das três, `--oculta`.

**Não toque nos geradores das abas sem a resposta:** a `aba03.py` está na posse
da GATILHOS-VAO-01 e as outras duas têm donos.
