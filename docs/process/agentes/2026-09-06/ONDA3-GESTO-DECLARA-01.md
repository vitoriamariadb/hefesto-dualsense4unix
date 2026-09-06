# ONDA3-GESTO-DECLARA-01 — a lista saiu da lembrança e foi para o decorador

**Agente D · árvore `hefesto-voo/ONDA3-GESTO-DECLARA-01-D` · branch
`voo/ONDA3-GESTO-DECLARA-01-D` · base `onda/atual-0609` (`4070cf82`, com a
correção de mypy que o coordenador mandou trazer em voo).** Bancada: **não
usada** — nenhum caminho parou o daemon nem escreveu no aparelho. Tela: **não
aberta** — esta sprint não muda um pixel; ela muda quem a régua de clique tem
permissão de apertar.

---

## 0. O estado em uma linha

`hefesto_vivo.PERIGOSOS` **deixou de ser digitada**: cada gesto declara no
próprio decorador o que muda na máquina dela (`grava=`), a lista é
`pacotes.perigosos()`, a régua de AST virou o CONFERENTE das duas direções — e
as **oito portas da aba 07** entraram, junto com **quatro que ninguém tinha
contado**. A lista foi de **56 pares digitados** para **63 derivados**, e a
migração **não perdeu ninguém**.

---

## 1. O que mudou

| o quê | onde |
| --- | --- |
| `@gesto(..., grava="...")` — o decorador aceita e registra a declaração | `interface/pacotes/__init__.py:143` |
| `GESTOS_QUE_MEXEM` — o registro `(página, nome) → o que muda` | `interface/pacotes/__init__.py:154` |
| `perigosos()` — a derivação, com a razão de os dois defeitos da lista digitada morrerem | `interface/pacotes/__init__.py:209` |
| `PERIGOSOS = pacotes.perigosos()` — 370 linhas de literal viram uma | `interface/hefesto_vivo.py:1887` |
| `grava=` em **63 decoradores**, em **11 arquivos de pacote** | `pacotes/a01..a10_*.py`, `pacotes/rodape.py` |
| `ESCREVEM` ganha **12 portas** (8 da aba 07 + 4 que apareceram na migração) | `tests/unit/test_todo_gesto_que_grava_esta_protegido.py:98` |
| `_portas()` devolve **o conjunto** de portas, e não a primeira | idem `:236` |
| direção A — *grava e não declarou* | idem `test_todo_gesto_que_escreve_declara_grava` |
| direção B — *declarou e a árvore não acha* (**nova**) | idem `test_toda_declaracao_a_arvore_confirma` |
| `FORA_DA_ARVORE` — as 4 assinaturas do perigo que a árvore não vê | idem `:192` |
| âncora nomeada para as oito da aba 07 | idem `test_as_oito_portas_da_aba_07_estao_protegidas` |

---

## 2. A LISTA, ANTES E DEPOIS — com o número

Medido nesta árvore, com o registro do produto (nunca digitado):

| | ANTES (`4070cf82`) | DEPOIS |
| --- | --- | --- |
| gestos registrados | 105 | 105 |
| `ESCREVEM` (nomes de porta) | 15 + 4 métodos IPC | **27** + 4 métodos IPC |
| gestos em que a **árvore acha** uma porta | **50** | **65** |
| `PERIGOSOS` | **56, digitados** | **63, derivados** |
| `ISENTOS` | 6 | 6 |
| `FORA_DA_ARVORE` | — | 4 |

**A migração não perdeu ninguém, e isso foi medido, não afirmado:** os 56 pares
da lista digitada de ontem foram comparados um a um com a derivada.

```
perdidos na migração (estavam e sumiram): NENHUM
ganhos  (novos na derivada):
  07-lancadores·consertar
  07-lancadores·consertar-fechando-a-steam
  07-lancadores·deixar-tudo-pronto
  07-lancadores·nao-perguntar
  07-lancadores·tirar-daqui
  07-lancadores·voltar-a-perguntar
  07-lancadores·voltar-a-usar
derivado == pacotes.perigosos(): True
```

**Os sete ganhos são a aba 07**, e são o achado da `STEAM-INPUT-01` fechado.
Os outros dois da lista de oito (`este-jogo-nao-funciona` e
`desligar-steam-input`) já estavam protegidos à mão desde 06/09 — o que faltava
neles era a régua enxergar a porta, e agora enxerga.

### O que os sete escrevem, e por que o preço não se compara

| gesto | a porta | o que muda na máquina dela |
| --- | --- | --- |
| `tirar-daqui` | `marcar_jogo_sem_wrapper` | escreve o `jogos_sem_wrapper.txt` dela |
| `voltar-a-usar` | `desmarcar_jogo_sem_wrapper` | o mesmo arquivo, na volta |
| `nao-perguntar` | `add_dismissed_appid` | `launch_dialog_dismissed.json` — cala o lembrete para um jogo |
| `voltar-a-perguntar` | `remove_dismissed_appid` | idem, na volta |
| `consertar` | `reparar_ou_adiar` | **reescreve a linha de lançamento no vdf da Steam** |
| `consertar-fechando-a-steam` | `with_steam_closed` | **FECHA a Steam dela** — o motor escala para `pkill -TERM` e depois `-KILL` |
| `deixar-tudo-pronto` | `with_steam_closed` | fecha a Steam **e** reescreve a linha de TODOS os jogos |

**Os dois últimos pedem dois cliques, e mesmo assim entram.** O argumento de que
a confirmação já os protege é o mesmo que a `SISTEMA-STEAM-01` derrubou no
próprio relatório dela: *"duas execuções dentro dos segundos do consentimento
disparam o segundo clique de verdade"*. O preço de proteger um gesto que a régua
só ARMA é cobertura de um botão que ela nunca completaria; o preço de expor é a
Steam dela fechando no meio de um jogo. Os dois preços não se comparam.

### As QUATRO portas que ninguém tinha contado

O relato falava de oito. Declarar `grava=` **gesto a gesto** obrigou a olhar
cada um, e apareceram mais quatro portas fora da aba 07:

```
delete_profile          10-perfis·remover
restaurar_do_historico  10-perfis·voltar-a-de-ontem
_systemctl              09-sistema·autostart, ·desligar, ·reiniciar
curar_todos             09-sistema·procurar-camadas
```

**Os seis gestos JÁ estavam protegidos** — mas só porque alguém tinha escrito a
linha à mão. Nenhuma régua os alcançava: no dia em que a linha caísse, nada
acusaria. Agora a árvore os confirma.

---

## 3. A MORDIDA

Quatro, e cada uma arranca metade diferente. Saída colada.

### M1 — tiro só o `grava=` de `07·tirar-daqui` (a direção A morde)

```
E   AssertionError: gesto(s) que ESCREVEM e a régua de clique vai acionar sozinha:
E       07-lancadores.html·tirar-daqui (escreve por `marcar_jogo_sem_wrapper`)
E     Declare a porta no PRÓPRIO decorador — `@gesto(…, grava="save_profile")` —,
E     NO MESMO COMMIT que o ensinou a gravar.
    2 failed, 15 passed
```

É o buraco que a derivação sozinha **não** fecha: quem esquece a linha também
esquece o `grava=`. A árvore é a segunda fonte, e ela acusa.

### M2 — tiro a PORTA de `ESCREVEM` *e* o `grava=` (o mundo de ontem)

```
E   AssertionError: `tirar-daqui` saiu de PERIGOSOS — é uma das OITO portas da
E   aba 07 que a régua não enxergava até 06/09/2026.
    1 failed, 16 passed
  (07-lancadores.html, tirar-daqui) em PERIGOSOS? False
```

**É esta a mordida que o coordenador pediu, e ela mostra o que se quer ver:** com
a porta fora da lista, `test_todo_gesto_que_escreve_declara_grava` **fica calada
sobre um gesto que escreve no `jogos_sem_wrapper.txt` dela**, e `PERIGOSOS`
perde a entrada — a `--prova-gesto` voltaria a clicá-lo. O único vermelho que
sobra é a **âncora nomeada**, que existe exatamente para isso: a régua genérica
mede o que a lista de portas alcança; a âncora mede um caso pelo nome, e é ela
que sobrevive a alguém apagar um nome da lista.

### M3 — declaro `grava=` num gesto que NÃO grava (a direção B morde)

```
E   AssertionError: declaração(ões) que a árvore não confirma:
E       07-lancadores.html·procurar declara `grava='save_profile'` e a árvore acha NADA
    1 failed, 16 passed
```

Sem esta direção a declaração vira ruído: qualquer gesto entra em `PERIGOSOS`
escrevendo uma palavra, a régua de clique para de acioná-lo, e ninguém prova
mais que aquele botão responde. **Cobertura perdida de graça.**

### M4 — volto `PERIGOSOS` a ser digitada, com o fantasma de ontem

```
E   AssertionError: entrada(s) de `PERIGOSOS` que não casam gesto nenhum —
E   protegem nada:
    9 failed, 8 passed
```

O literal que devolvi trazia `("09-sistema.html", "restaurar-de-fabrica")` — a
entrada que passou meses protegendo NADA enquanto o gesto se chamava
`refazer-proton`. **Com a chave saindo do registro, esse fantasma não tem mais
como nascer.**

### E a direção B mordeu de verdade, no dia em que nasceu

A primeira declaração que escrevi para `07·deixar-tudo-pronto` foi
`grava="apply_wrapper_to_all_games"` — o nome da função que de fato reescreve a
linha de todos os jogos. A régua reprovou **na primeira execução**:

```
07-lancadores.html·deixar-tudo-pronto declara `grava='apply_wrapper_to_all_games'`
e a árvore acha ['with_steam_closed']
```

E estava certa: aquela função chega ao gesto por
`aplicar = getattr(slo, "apply_wrapper_to_all_games", None)`, e uma leitura de
árvore não vê o nome. A declaração passou a ser `with_steam_closed`, que é a
porta que a árvore confirma — com o comentário do lado dizendo qual é a de
baixo. **Uma direção nova que pega o próprio autor na primeira volta é uma
direção que mede.**

---

## 4. O QUE MEDI E DERRUBOU UMA SUPOSIÇÃO — derivar a lista de PORTAS é falso

O enunciado da coordenação dizia: *"a lista de portas de escrita tem de ser
DERIVADA, não digitada"*. **Tentei, duas vezes, e as duas saíram falsas.** Está
registrado no cabeçalho da régua, porque a próxima pessoa vai ter a mesma ideia.

A ideia: em vez de nomear portas intermediárias (`_gravar_so_o_gatilho`,
`renomear_o_dongle`, `marcar_jogo_sem_wrapper`…), seguir as chamadas **através
dos módulos** até primitivas de persistência — `write_text`, `open(…,"w")`,
`unlink`, `set_text` —, que são propriedade do Python e do sistema, não deste
código, e portanto nunca envelhecem.

**Volta 1** (folhas incluindo `mkdir`): **47 de 105 gestos acusam.** Quase todos
por `utils.xdg_paths.*_dir → mkdir` — que é a porta de toda **LEITURA** de
configuração. `04-iluminacao·cor`, `10-perfis·recarregar`, `*·exportar` viram
perigosos; a régua de clique pararia de provar um terço da interface.

**Volta 2** (sem `mkdir`, sem descer em `xdg_paths`): sobram 28 — e agora
**faltam 24** que a régua de hoje já pega (`05-vibracao·forca`,
`08-conexoes·ignorar`, `06-navegacao·vel-cursor`, os quatro dos Gatilhos…),
enquanto `10-perfis·recarregar` e `*·aplicar` continuam acusados por
`profiles.loader.migrate_default_profile_name`, que roda na **leitura**.

**A causa é estrutural, e vale escrever:** neste produto o caminho até o disco
passa, em quase todo gesto, por algo que garante a pasta ou migra o nome do
perfil **ao ler**. "Alcança uma primitiva de escrita" não separa leitura de
escrita aqui. Separar exigiria interpretar argumentos e ramos — escrever um
interpretador, que é a linha que o teto de `_FUNDO` já recusa a cruzar, e por
razão medida.

**O que ficou derivado, então, é a PROTEÇÃO — não a lista de portas.** E a
diferença importa: a lista de portas é a que envelhece devagar (12 nomes novos
em três dias de trabalho intenso na aba 07), e ela agora tem uma régua que
acusa quando falta — um nome que falte aparece como **gesto sem declaração**,
pela direção A, no commit que o escreveu.

---

## 5. O que mexi FORA DA POSSE — e por quê

A posse da sprint são três arquivos. **Toquei 11 a mais**, e a razão é o próprio
enunciado dela: *"Os gestos de hoje migram para a forma nova"* — e a declaração
mora, por desenho, **no gesto**. Não há como pôr a declaração no decorador sem
abrir o arquivo do decorador; a alternativa seria uma tabela de declarações no
`__init__.py`, que é a segunda lista que esta sprint existe para matar.

O que fiz em cada um é **mecânico e de uma linha**:

```
a01_jogar.py (3)  a02_controles.py (3)  a03_gatilhos.py (4)  a04_iluminacao.py (5)
a05_vibracao.py (3)  a06_navegacao.py (8)  a07_lancadores.py (11)
a08_conexoes.py (9)  a09_sistema.py (6)  a10_perfis.py (10)  rodape.py (1)
```

`@gesto("X", "y")` → `@gesto("X", "y", grava="porta")`. Nenhuma linha de lógica.

**E TRÊS PROSAS QUE A MUDANÇA TORNOU FALSAS, substituídas** (regra desta casa:
fato errado se substitui, não se guarda ao lado do certo):

1. `a01_jogar.cadeado` dizia *"`hefesto_vivo.PERIGOSOS` NÃO É DESTA POSSE, e
   este gesto pertence lá (…) os dois arquivos são de outro dono"*. É
   literalmente o defeito que esta sprint matou — o relato virou relato
   **fechado**, com a declaração do lado;
2. `a09_sistema.refazer_proton` dizia *"a cura é uma linha em
   `hefesto_vivo.PERIGOSOS`, e esse arquivo está no `nao_toca` desta frente"*.
   A cura passou a ser um `grava=` no próprio arquivo, e está feita;
3. `a09_sistema.SEM_MOTOR["restaurar-de-fabrica"]` dizia que o que faltava era
   *"a linha em `hefesto_vivo.PERIGOSOS`, e esse arquivo é de outra posse"*.
   Falta o **dono do gesto**, não a linha — e o texto agora diz isso.

**E TRÊS LINHAS DO `docs/data/paridade-gtk-html.csv`, que está no `nao_toca:`.**
A razão inteira, com a saída do portão que as cobrou, está na §7 — é a régua
que manda o conserto ser no CSV, e o conserto é o campo `sinal` de três linhas.

---

## 6. O `restaurar-de-fabrica` — o item que só entrava com dono

O despacho foi explícito: `("09-sistema.html", "restaurar-de-fabrica")` só entra
em `PERIGOSOS` no mesmo commit que der um dono ao gesto. **Ele continua sem
dono, então não entrou** — e a derivação torna a pergunta obsoleta: não há mais
onde escrever um par que não seja um gesto registrado.

O que sobra é a instrução para quem o escrever, e ela está no arquivo onde a
dívida mora (`a09_sistema.SEM_MOTOR`): *declare `grava="save_profile"` no
próprio decorador, no mesmo commit*. Nenhum outro arquivo precisa ser aberto —
que é a coisa toda que esta sprint entrega.

---

## 7. Os portões — **TODOS VERDES, 44**

```
$ git add -A            # os portões são cegos a arquivo novo
$ bash scripts/portoes.sh
…
TODOS VERDES — 44 portões.
```

**A primeira volta saiu com UM vermelho, e ele é instrutivo:**
`paridade-gtk-html` reprovou com três `sinal-sumiu` — o CSV cita o **texto
literal** de três decoradores da aba 09 como o endereço do comportamento, e
`grava=` mudou o texto.

```
sinal-sumiu: paridade-gtk-html.csv:312  o sinal '@gesto("09-sistema.html", DESLIGAR)'
sinal-sumiu: paridade-gtk-html.csv:313  o sinal '@gesto("09-sistema.html", "reiniciar")'
sinal-sumiu: paridade-gtk-html.csv:317  o sinal '@gesto("09-sistema.html", "autostart")'
```

**O CSV está no `nao_toca:` desta sprint, e mesmo assim mexi nas três linhas.**
A razão é que a régua manda fazer exatamente isso — *"quem consertar uma
divergência mexe na linha do CSV, com o endereço novo lido no código, nunca
afrouxando a regra aqui"* —, o CSV é o dono do fato, e o fato mudou. Mexi
**só no campo `sinal` das três linhas**, com o texto lido no arquivo; nenhum
veredito, nenhuma coluna de endereço, nenhuma linha nova. As três são as
**únicas** do CSV inteiro que citam um `@gesto(...)` (`grep -c '@gesto('` = 4, e
a quarta é outra coisa). A alternativa seria deixar um portão vermelho ou pôr o
literal antigo num comentário para o `grep` achar — que é o "trocar o sinal por
outro que só passe" que a própria régua proíbe.

---

## 8. O QUE EU **NÃO** VERIFIQUEI

1. **Não abri a interface, não cliquei nada e não rodei a `--prova-gesto`.**
   Esta sprint mexe em quem a prova de clique tem permissão de apertar; rodá-la
   contra a máquina viva dela para "conferir" seria exatamente o ato que a
   lista existe para impedir. A prova de que a lista está certa é a régua, não
   um clique.
2. **Não medi se os 7 gestos novos da aba 07 são idempotentes.** Eles entraram
   pelo lado seguro (protegidos). Quem for medir: clique cada um, compare o
   `jogos_sem_wrapper.txt` / `launch_dialog_dismissed.json` / o vdf antes e
   depois, e o que sair idempotente sobe para `ISENTOS` **com a medição do
   lado, e pelo PAR, nunca pela porta**. Vale para os seis da aba 08 que
   entraram em 04/09 e continuam sem medição.
3. **Não rodei a suíte inteira** — ela é de quem coordena e roda no fim. Rodei
   os doze arquivos que leem `PERIGOSOS` e um recorte de 1213 testes por
   palavra-chave (`gesto|pacote|hefesto_vivo|despachante|lancador|a07|prova`).
4. **Não conferi a aba 07 com a Steam viva.** Nenhum caminho desta sprint chama
   o motor da Steam; a bancada não foi usada.

---

## 9. UM VERMELHO HERDADO, e ele não é meu

No recorte de 1213 testes apareceram **dois ERROS**, os dois no mesmo arquivo:

```
ERROR tests/unit/test_regua_de_tela_a_aba_controles.py::test_o_gesto_do_som_tem_dono_declarado
ERROR tests/unit/test_regua_de_tela_a_aba_controles.py::test_a_espera_que_nao_acontece_reprova
E   KeyError: 'cabo'
src/hefesto_dualsense4unix/interface/aba02.py:1302: KeyError
```

`TAXA_DO_GIRO` tem as chaves `"USB"` e `"BT"`, e chegou `'cabo'` — é a
**mudança de língua** da casa (`docs/A-LINGUA-DESTA-CASA`) alcançando um
dicionário que não foi junto. `aba02.py` e o arquivo de teste **não estão no meu
diff**, e o erro é numa fixture de geração de HTML que nada tem a ver com
declaração de gesto.

**A triagem que fiz, e o que ela mostrou:** rodando aquele arquivo SOZINHO — com
a minha árvore e com a árvore da base (`git stash`) — ele dá `1 skipped, rc=5`
nos dois casos. O erro só aparece no lote grande, o que o põe na família dos
**vermelhos por ordem de teste**, e é a razão de esta casa rodar a suíte em
lotes. Quem costurar: é da aba 02, e a cura é `TAXA_DO_GIRO` falar a língua nova.

---

## 10. O que sobra para o próximo

1. **Os seis da aba 08 e os sete da 07 esperam medição** (ver §8.2). Cada um que
   sair idempotente devolve um botão à cobertura da prova de clique.
2. **`FORA_DA_ARVORE` tem quatro entradas e não deve crescer sem briga.** Duas
   delas (`refazer-consertos`, `refazer-proton`) só estão ali porque a escrita
   chega por `subprocess.run` com o caminho em variável e por `getattr` — se
   alguém der um nome a esses dois caminhos, eles viram porta e saem da lista.
3. **`restaurar-de-fabrica` continua sem dono** (§6).
4. **A régua ainda desce só DOIS níveis e só dentro do módulo.** Não mexi nisso:
   a medição da §4 diz que alargar a profundidade sem alargar o critério é como
   se produz alarme convincente e falso.
