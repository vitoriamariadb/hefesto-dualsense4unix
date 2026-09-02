# O mapa da interface — medido CLICANDO, e as ondas que ele produz

**02/09/2026, madrugada.** Este documento existe porque ela abriu o produto,
olhou, e mediu o que eu tinha errado:

> *"basicamente todas as telas são mockups e estão com informações incorretas ou
> desatualizadas ou não integradas de fato."* <!-- noqa-acento: citação literal dela -->

> *"basicamente nada funciona na interface do programa hoje. Vc não passou e nem
> saiu clicando pelas abas."* <!-- noqa-acento: citação literal dela -->

Ela estava certa nas duas. **Eu tinha reportado 77% medindo presença de string
no código.** O número medido, clicando, é outro — e está abaixo.

---

## 0. O CONTRATO DO PRODUTO — leia antes de qualquer linha de código

**A interface HTML existe para fazer o que a GTK JÁ FAZIA.** Não é um produto
novo: é a mesma casa, com outra sala. Palavra dela:

> *"a nossa versão html tem o objetivo de funcionar como a gtk já funcionava.
> mas adequar a nossa interface, novas features, completar o produto seja via bt
> seja cabo, seja o sistema de perfis personalizados por cada controle."*
<!-- noqa-acento: citação literal dela -->

São **quatro** trabalhos, e confundi-los é o que fez esta madrugada custar caro:

| # | o trabalho | como se sabe que terminou |
| --- | --- | --- |
| 1 | **PARIDADE** — a tela nova faz o que a GTK fazia | comparar com `app/widgets/` e `app/actions/`, campo a campo |
| 2 | **ADEQUAÇÃO** — a tela nova é diferente, e melhor | ela olha e aprova |
| 3 | **COMPLETAR** — o que faltava no produto, no cabo E no rádio | medido no aparelho |
| 4 | **PERFIL POR CONTROLE** — cada controle guarda o seu | o `ControllerOverrides` cresce |

**O QUE ELA JÁ ESCLARECEU E NÃO SE REABRE:**

- **No CABO, tudo funcionava.** *"lembrando que com cabo todas as features
  funcionam."*
- **No RÁDIO, faltavam SOM e MIC — só.** *"por bt só faltava o som e o mic. o
  resto já tinhamos mapeado e tava funcionando na interface. todas as
  features."* <!-- noqa-acento: citação literal dela -->
- **Logo: o que não funciona no rádio HOJE, na tela nova, é REGRESSÃO** — não é
  feature que nunca existiu. Procure o que a GTK lia e a nova não lê.

---

## 1. OS DOIS GRAFOS — use-os para se localizar, não varra arquivo

Construídos em 02/09/2026, um em cada árvore, e é a ferramenta que responde
"quem chama isto" em segundos:

| árvore | onde | arquivos | nós | arestas |
| --- | --- | --- | --- | --- |
| **esta** (`dev`, a interface nova) | `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix` | 1405 | 32.596 | 227.832 |
| **a estável** (o GTK que funcionava) | `/mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-estavel` | 1304 | 30.911 | 216.323 |

**COMO ISSO ENCURTA O SEU TRABALHO:** a pergunta central deste projeto é *"o que
a GTK fazia e a HTML não faz?"*. Com os dois grafos, ela vira consulta em vez de
arqueologia. Reconstruir: `fazer_grafos` na raiz de cada árvore (~1 min). Os
dois são derivados e estão no `.gitignore`.

**O que o grafo NÃO responde:** se o produto FAZ. Todo achado deste documento
saiu de CLICAR, não de consultar. O grafo diz quem chama quem.

---

## 2. A MEDIÇÃO, e ela tem três números

### 2.1 Os campos: 36% escritos pelo produto

Dos 103 `data-campo` das dez abas, o pacote da aba escreve **37**. Os outros 66
mostram o valor cravado no HTML do mockup — e **120 dos 183 campos do HTML
nascem com valor cravado**.

| aba | campos | escritos | |
| --- | --- | --- | --- |
| `03-gatilhos` | 25 | **1** | **4%** |
| `09-sistema` | 10 | 2 | 20% |
| `05-vibracao` | 9 | 2 | 22% |
| `10-perfis` | 3 | 1 | 33% |
| `04-iluminacao` | 12 | 6 | 50% |
| `01-jogar` | 11 | 6 | 55% |
| `06-navegacao` | 7 | 4 | 57% |
| `02-controles` | 12 | 7 | 58% |
| `08-conexoes` | 11 | 8 | 73% |
| `07-lancadores` | 3 | **0** | **0%** |

### 2.2 Os gestos: 48 clicados, 36 aplicados

Medido com `--prova-no-aparelho`, DOIS controles na mesa (um no cabo, um no
rádio), a janela oculta:

| aba | gestos | aplicados |
| --- | --- | --- |
| `01-jogar` | 5 | 5 |
| `02-controles` | 3 | 2 |
| `03-gatilhos` | 3 | 2 |
| `04-iluminacao` | 4 | 4 |
| `05-vibracao` | 3 | 1 |
| `06-navegacao` | 7 | 7 |
| `07-lancadores` | **0** | — |
| `08-conexoes` | 16 | 8 |
| `09-sistema` | 5 | 5 |
| `10-perfis` | 2 | 2 |

### 2.3 O pior: DEZESSEIS gestos dizem "aplicado" e não mudam nada

São os que o próprio instrumento marca como *"sem efeito e sem `SEM_ECO`"* —
clicaram, responderam `aplicado`, o estado do daemon não mudou, e eles NÃO estão
declarados como gestos sem eco:

```
01-jogar       hefesto · reconectar
03-gatilhos    guardar
04-iluminacao  cor · player
06-navegacao   guardar-definicoes · padrao-definicoes · teclado
08-conexoes    escolher-aparelho · escolher-entrada · luz-nao-acende ·
               nova-entrada · nova-extensao · nova-face · tirar-daqui
10-perfis      ativar
```

**Isto é o "responde calado", que é o defeito mais caro desta casa.** Alguns
deles TÊM explicação legítima (o `luz-nao-acende` recusou porque o controle está
no cabo; vários de Conexões recusaram por falta de alvo no clique automático) —
e é por isso que a onda A começa SEPARANDO os três casos, não consertando.

---

## 3. OS DEFEITOS NOMEADOS, com a prova

### D1 — A IDENTIDADE DO CONTROLE NÃO TEM FONTE *(a raiz de metade do resto)*

`Cosmic Red` e `Starlight Blue` estão **cravados no HTML — 170 vezes nas dez
abas** (54 só na Iluminação). O daemon publica `uniq`, `transport`,
`battery_pct`, `player`, `lightbar_rgb`… e **nada que identifique o aparelho**:
sem `model`, sem `serial`, sem `name`.

**O sintoma que ela viu:** com UM controle o USB era "Starlight Blue"; com DOIS
o mesmo USB virou "Cosmic Red". **O nome vem da POSIÇÃO.** E na aba Jogar a
MESMA TELA chama o mesmo controle de `P1 · Cosmic Red · USB` no chip e
`Starlight Blue · USB` no card.

**E A CASA JÁ SABE FAZER:** `integrations/cor_do_plastico.py` tem
`cor_do_serial()` (*"A cor escondida nos caracteres 5 e 6 do serial de
fábrica"*) e `decodificar()` (o feature report). A interface chama só
`cor_do_codigo`. A cadeia está cortada em DOIS pontos:

```
firmware → [1] o daemon não publica serial/modelo → [2] a interface não decodifica → HTML cravado
```

**Consequência visual:** na Iluminação a borda do desenho é a cor do PLÁSTICO —
e desenha vermelho no controle azul e azul no vermelho, porque o modelo é
inventado.

### D2 — O JOGADOR: a HTML perdeu o que a GTK lia

O daemon publica DUAS chaves: `player_slot` (a posição, que o produto decide) e
`player` (o LED que o aparelho mostra). No cabo coincidem; **no rádio o `player`
volta `None` e o `player_slot` continua certo.**

| | lê |
| --- | --- |
| GTK (`app/widgets/controller_card.py:1059-1065`) | `player_slot` **e depois** `player` |
| HTML (`a01_jogar.py:48`, `a04_iluminacao.py:89-90`) | **só** `player` |
| HTML (`a04_iluminacao.py:221`) | `player_slot or player` — **já certo** |

**Resultado medido:** a aba Iluminação escreve `Modelo: P—` no rótulo e deixa o
botão `2` ACESO logo abaixo. A mesma aba discordando de si mesma.

**É REGRESSÃO DE MIGRAÇÃO**, e é a assinatura a procurar em todo lugar: a HTML
lendo UMA chave onde a GTK lia DUAS.

### D3 — A ABA GATILHOS MOSTRA AJUSTES DE UM MODO DESLIGADO

Com o perfil ativo dizendo `L2: modo='Off' params=[]` e `R2: modo='Off'
params=[]`, a tela mostra para P1 `Força 7 · Frequência 4 · Início 25 · Fim 230`
e para P2 `Início 3 · Fim 6 · Força 5`. **Todos mockup.**

E há contradição interna: o próprio HTML escreve *"Este modo não tem o que
ajustar"* nas colunas P3/P4 (desligadas) e mostra quatro ajustes nas P1/P2, que
também dizem `Desligado`.

**Agravante:** P3 e P4 dizem `Desconectado` e os campos continuam ATIVOS, com o
botão "Guardar esse efeito" clicável.

### D4 — `07-lancadores` NÃO TEM UM ÚNICO GESTO

Zero `data-gesto` no HTML, zero campos escritos. A aba inteira é desenho.

### D5 — A DECORAÇÃO DA JANELA

Fotografado por ela: os botões de fechar/maximizar/minimizar aparecem à
ESQUERDA e fora de ordem, diferente de toda outra janela da sessão dela.

### D6 — O TEXTO DE PRIORIDADE EM PERFIS NÃO FAZ MAIS SENTIDO

*"Prioridade 1 de 200. O maior vence a disputa quando dois perfis poderiam
entrar."* Ela disse: *"esse texto em perfis nem faz sentido mais fora a tabela
dos controles."* A tabela `Controle / Ajuste próprio / ID da peça` mostra só
`1`, sozinho.

### D7 — SOBREPOSIÇÃO NA ILUMINAÇÃO

O `100` do brilho aparece colado sobre a trilha do slider, e o valor à direita
diz `1`. Nas duas colunas.

### O QUE ESTÁ CERTO, e precisa ser dito

Nem tudo é mockup, e eu já acusei errado uma vez — **`battery_pct` e `player`
vêm do daemon e batem** (95% e 75%; eu tinha lido a chave errada,
`battery_percent`). As cores da lightbar batem: `#0000FF` e `#FF0000` são
exatamente o que o daemon publica. O cabeçalho `2 controles: 1 USB · 1 BT` está
certo. As recusas de Conexões e Vibração são o comportamento CORRETO — o gesto
diz o que falta em vez de fingir.

---

## 4. AS ONDAS — desenhadas para rodarem EM PARALELO

Pedido dela:

> *"pense em estruturar tudo via ondas no final das contas, de forma que
> workflows simples consigam corrigir e avançar o trabalho em paralelo e o opus
> orquestrador vai ver como integrar tudo na nossa dev"*
<!-- noqa-acento: citação literal dela -->

**A REGRA DE OURO DO PARALELISMO AQUI:** duas ondas não podem tocar o mesmo
arquivo. A divisão abaixo foi feita POR ARQUIVO, não por assunto — é o que
permite rodar todas juntas, cada uma na sua worktree, e integrar por merge.

### ONDA A — a identidade do controle *(desbloqueia metade do resto)*

**Arquivos:** `daemon/ipc_handlers.py` (publicar), `integrations/cor_do_plastico.py`
(já pronta), `interface/pacotes/__init__.py` (o dono da leitura).
**Não toca:** nenhum `aNN_*.py`.

Fechar a cadeia dos dois pontos de D1: o daemon passa a publicar
`serial`/`model`, e a interface ganha UM dono que os decodifica. As abas só
consomem — por isso não conflita com as outras ondas.

**Fecha quando:** com dois controles, cada um mostra o próprio modelo, e trocar
a ordem física não troca os nomes.

### ONDA B — as leituras que a HTML perdeu *(a caça à regressão)*

**Arquivos:** `interface/pacotes/*.py` (só leitura de estado).
**Não toca:** daemon, HTML, geradores.

D2 é o primeiro caso; a onda procura os OUTROS com a mesma assinatura —
comparando, campo a campo, o que `app/widgets/` lê e o que `interface/pacotes/`
lê. **Use os dois grafos:** é literalmente a consulta que eles servem.

**Fecha quando:** existe um dono por fato lido (como `jogador_de`), e uma régua
que reprova pacote lendo a chave crua.

### ONDA C — os dezesseis "aplicado" que não aplicam

**Arquivos:** `interface/pacotes/aNN_*.py` (os gestos).
**Não toca:** pintura, daemon, HTML.

**Primeiro CLASSIFICAR os 16 em três montes**, e só depois consertar:
(a) recusou com razão e o instrumento não soube ler — **corrigir o instrumento**;
(b) o daemon não ecoa o que mudou — **declarar em `SEM_ECO`, com a razão**;
(c) **mentiu mesmo** — consertar o gesto.

**Fecha quando:** a lista de "sem efeito e sem `SEM_ECO`" fica vazia, e cada
declaração de `SEM_ECO` tem a razão escrita.

### ONDA D — a aba Gatilhos

**Arquivos:** `interface/aba03.py`, `interface/pacotes/a03_gatilhos.py`, e o HTML
da 03 **na BANCADA**.
**Não toca:** nenhuma outra aba.

D3 inteiro: o pacote passa a escrever os 25 campos (hoje escreve 1), lendo o
PERFIL (o daemon não ecoa gatilho, e isso é decisão medida). Colunas
desconectadas ficam inertes.

### ONDA E — a aba Lançadores

**Arquivos:** `interface/aba07.py`, `interface/pacotes/a07_*.py`, HTML da 07 na
BANCADA. **Não toca:** nada mais.

D4: a aba nasce do zero — 0 gestos, 0 campos.

### ONDA F — a aba Perfis e o texto dela

**Arquivos:** `interface/aba10.py`, `interface/pacotes/a10_perfis.py`, HTML da 10
na BANCADA.

D6 + a tabela de controles quebrada + o sistema de perfil por controle (o
trabalho 4 do §0). **Depende da ONDA A** para nomear os controles na tabela.

### ONDA G — a janela e o acabamento

**Arquivos:** `interface/hefesto_vivo.py`, `scripts/abrir_interface.py`, CSS na
BANCADA.

D5 (decoração) e D7 (sobreposição do brilho).

### A ORDEM, e o que pode rodar junto

São SETE: A, B, C, D, E, F, G. **Seis largam juntas; só uma espera.**

```
  LARGAM AO MESMO TEMPO                      ESPERA A ONDA A
  ─────────────────────                      ───────────────

   A  identidade  ───────────────────────>   F  perfis
   B  regressões                                (a tabela de controles
   C  os dezesseis                               precisa dos NOMES que
   D  gatilhos                                   a onda A vai publicar)
   E  lançadores
   G  janela e CSS

   ^ estas seis não se tocam: cada uma mexe num conjunto
     de arquivos que nenhuma outra abre
```

**A ÚNICA dependência do plano é `A → F`.** Todas as outras podem rodar no mesmo
minuto, em worktrees separadas, e ser integradas na ordem em que voltarem.

**Quem integra:** o orquestrador, por merge em `dev`, uma onda por vez, com os
30 portões entre cada merge. Nenhuma onda mexe na árvore dela.

---

## 5. COMO CADA ONDA SE PROVA — o mesmo ritual para todas

Nenhuma onda fecha sem estas quatro, e é o que faltou nesta madrugada:

1. **A FOTO** — `--oculta --abre NN.html --foto /tmp/x.png`, e LEIA o PNG.
2. **O CLIQUE** — `--prova-no-aparelho`, e cole a saída literal.
3. **A COMPARAÇÃO** — o que o daemon diz × o que a tela mostra, campo a campo.
   Sem isso, ver a tela bonita é o que produziu o 77% falso.
4. **A MORDIDA** — arranque a cura, veja a régua reprovar, devolva por CÓPIA.

**A ARMADILHA QUE EU CAÍ, escrita para você não cair:** medir presença de string
no código (`"o método aparece no arquivo?"`) e chamar isso de funcionamento. Dá
77% onde o produto entrega 36%. **Só clicar mede.**

**E A PROVA DE CLIQUE MUDA A MÁQUINA DELA:** o `--prova-no-aparelho` da aba
Jogar clicou `modo-xbox` e deixou os dois controles em `uinput`. Foi preciso
clicar `modo-dualsense` para devolver. **Confira o estado antes e depois, e
devolva o que mudou.**
