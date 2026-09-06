# ONDE PARAMOS — o mapa dos donos, e os scripts do GTK que passaram a ver o HTML

**05/09/2026, madrugada de 06.** Ela precisou desligar o computador e voltar na
sequência. Este arquivo é o handoff: **leia-o inteiro antes de tocar em
qualquer coisa**, e a §7 é literalmente o próximo comando.

---

## 0. O ESTADO, EM UMA LINHA

```
árvore: /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix   branch: dev   LIMPA
43 portões VERDES · doze lotes, 17.974 testes, ZERO vermelho
oito commits nesta leva, de 90d4bb84 a bcc3c872
```

Confira com o comando que não envelhece:

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
source .envrc-voo
git status --short          # tem de sair vazio
git log --oneline -8
```

---

## 1. A QUEIXA QUE ORIGINOU TUDO, e ela é dela

> *"a parte de recriarmos cada script ao invés de adaptar o que já temos pronto
> do gtk, isso eu havia pedido e sempre repetia, mas tá sendo recriado tudo
> sempre e sempre passando por cima das decisões e indo pelo caminho mais longo
> ao invés de aproveitar os dois mapas, specs e o mapa do controle e ao invés de
> aproveitar o do gtk e adaptar ele pra funcionar no html. estamos recriando um
> produto que estava praticamente pronto pro gtk."*

E, logo depois, o medo que decide o método:

> *"tenho medo de algo estar sendo recriado sendo que já temos pronto."*

Quando perguntei **como organizar o projeto para evitar isso**, ela escolheu
entre quatro opções: **portão de dono único por comportamento**. Foi o que
nasceu.

E a segunda ordem, no mesmo dia:

> *"termos scripts no repo atual que ou apontam pro gtk ou só funcionam lá (não
> foram migrados) (…) no caso não é remover, o certo é ajustar ele pra comportar
> todas as features do html"*

---

## 2. O QUE FECHOU — os oito commits, um parágrafo cada

### `90d4bb84` · O mapa dos donos, e três scripts do GTK ajustados

**[`docs/data/donos-de-comportamento.csv`](../data/donos-de-comportamento.csv)**
— os 50 comportamentos que decidem a migração, com o endereço do dono dos DOIS
lados, medidos por cinco laudos sobre 410 comportamentos das dez abas.

| veredito | quantos | o que significa |
| --- | ---: | --- |
| `SO-GTK` | 15 | pronto e testado na janela, **ausente** na tela nova |
| `DUPLICATA` (+1 que piorou) | 13 | a tela nova recalcula o que o dono já devolve — **2.397 linhas** |
| `DIVERGE*` | 16 | as duas telas **discordam sobre o mesmo fato da máquina** |
| `CURADO` | 6 | os defeitos vivos que fecharam neste dia |

O portão é `scripts/check_donos_de_comportamento.py`, e **ele não julga se um
código recria** — julgamento vira laudo, não régua. Ele impede o LAUDO de
envelhecer: endereço morto (por SÍMBOLO, nunca por linha), cura descosturada,
`SO-GTK` que já migrou, e a dívida, que só desce (`TETO_DE_LINHAS_DUPLICADAS`).
Régua: `tests/unit/test_o_dono_do_comportamento_e_um_so.py`, nove mordidas.

No mesmo commit, o primeiro script ajustado: **a régua da palavra de tela
vigiava UMA palavra na interface nova e o portão vigiava ONZE, só no GTK.**
Agora `tests/unit/test_a_palavra_de_tela_da_interface_nova.py` importa o
`JARGAO_BANIDO` de `scripts/validar-palavra-de-tela.py` — um dono só, e termo
novo vale nas duas telas no mesmo commit. Medido ao ligar: zero ocorrências dos
onze termos nas dez páginas.

E o retratista: **`src/hefesto_dualsense4unix/interface/olhar.py --todas
--publicado --doc`** fotografa as dez abas do produto. O
`docs/usage/AS-DEZ-ABAS-o-que-cada-uma-faz.md` já pedia `assets/aba-NN-*.png`
nas dez seções e **as dez imagens não existiam** — o documento publicava dez
imagens quebradas desde que foi escrito. O `README.md` trocou as onze fotos da
janela GTK pelas dez do produto.

### `f83df649` · O laudo do mapa, com a fila que ele deixa

**[O DONO DE CADA COMPORTAMENTO](2026-09-05-O-DONO-DE-CADA-COMPORTAMENTO-o-mapa-que-responde-a-queixa-da-recriacao.md)**
— as três duplicatas mais caras, a que PIOROU ao ser recriada (o congelamento
de 8,4 s), o que o portão deliberadamente não faz, e a fila em ordem de quanto
devolve por linha mexida.

### `71e88e6a` · Os portões da foto enxergam a interface nova, e a fila vira uma só

`src/hefesto_dualsense4unix/interface` entrou nas DUAS listas de
`CODIGO_DA_TELA` (o portão da suíte e o gancho de pre-commit). A ausência estava
medida: mexer nas dez abas que o lançador abre não tornava foto nenhuma
suspeita, e mexer no motor VELHO obrigava a refotografar a janela velha.

`tests/unit/test_a_documentacao_conhece_todas_as_abas.py` conhecia UM produto, e
era o aposentado. Agora mede as duas telas, cada uma contra o documento que a
publica.

E o **`SPRINT_ORDER.md` tinha QUATRO "filas de agora" empilhadas**, uma por dia,
nenhuma aposentando a anterior. Agora tem uma.

### `9bf93833` · A piscada verde da `03-Q4`, e o "Pronto." fora da tela

ONDA5-03-01 fechada — a primeira da FAIXA 0, e a que **seis sprints
esperavam**. O campo que ela mexeu ganha borda verde por 1,5 s
(`MS_DA_PISCADA`) e o piloto para de falar quando não tem o que dizer.
`FRASE_DE_SUCESSO` morreu por falta de chamador.

**A ordem contrária estava escrita no piloto**: *"ela recusou o campo que pisca
… não construa nenhum dos dois"*. Era falso — quem recusou foi o PO, lendo a
D-01 como se ela fechasse a forma. Substituído com a data e a atribuição certa.

### `44eafced` · O Mic virtual, Passo 1 — a exceção que ela nomeou

`src/hefesto_dualsense4unix/integrations/canal_do_microfone.py`: o canal de
captura com o nome do CONTROLE (`hefesto_mic_<hex6>`), não o do transporte. Ele
**reusa** `SourceVirtualPipeWire` (o mecanismo da ponte de rádio, de 25/07) e
**lê** a prioridade do dono — não recria nada, que é a ordem dela.

**O Passo 2 não entrou de propósito.** Ele exige medição na bancada antes do
código, e a dívida está declarada em `_SEM_CAMINHO_HOJE` com endereço e razão.

### `8b0d5fc2` · O placar da ONDA CINCO

### `7e823e37` · O comentário que sequestrou seis réguas

**Treze testes caíram com `Unexpected token '.'`, e a causa era de PROSA.** O
comentário de `MS_DA_PISCADA`, escrito para AVISAR que o `BOOTSTRAP` não pode
ganhar um `.replace()` no fecho, citava LITERALMENTE o padrão com que seis
réguas o extraem do fonte — e virou a primeira ocorrência do arquivo. **O aviso
virou o defeito que ele descrevia, na mesma noite.**

Régua nova: `test_o_bootstrap_e_a_primeira_ocorrencia_de_si_mesmo`.

### `bcc3c872` · As quatro últimas citações de linha

---

## 3. O QUE O PRÓXIMO CLAUDE PRECISA SABER, e não está em nenhum outro lugar

1. **O portão da FOTO agora acorda com `interface/`.** Todo commit que tocar
   `src/hefesto_dualsense4unix/interface/` deixa `test_as_fotos_acompanham_a_versao`
   vermelho. A saída honesta é uma das duas:
   - refotografar: `.venv/bin/python src/hefesto_dualsense4unix/interface/olhar.py --todas --publicado --doc`
   - **ou** declarar em `docs/usage/assets/CONFERIDO-EM.txt`, com o SHA e a
     medição (o formato está no fim do arquivo, e a última linha é o exemplo).

2. **`interface/aba02.py` emite comentário CSS dentro da página.** Mexer nele
   obriga a rodar `python3 src/hefesto_dualsense4unix/interface/aba02.py` e a
   bancada muda. **Publicar é ato DELA** — a divergência de uma linha está
   declarada em `mockup/DIVERGENCIAS.md`, e ela some com o `--publicar 02` da
   próxima aprovação. Nada espera por isso.

3. **`hefesto_vivo.py` desloca citações de linha a cada edição.** Nesta leva
   foram **catorze remedidas em três voltas**. Depois de mexer nele, rode
   `tests/unit/test_portao_o_par_com_metade_ligada.py` — o portão `citacoes-de-linha`
   do `portoes.sh` é mais raso e não pega tudo.

4. **O `BOOTSTRAP` é uma string CRUA de aspas triplas e tem de continuar
   sendo.** Seis réguas a extraem do fonte por expressão regular. Nada de
   `.replace()` no fecho, nada de f-string, e **nunca cite o padrão
   literalmente num comentário acima dela** — descreva-o.

5. **A suíte roda em DOZE lotes**, nunca num processo só, e **nunca em paralelo
   com outro pytest** (compartilham o lar de mentira e os nós uinput).

---

## 4. A FILA DE AGORA — o que fazer a seguir, em ordem

A fila viva é **[`docs/process/SPRINT_ORDER.md`](SPRINT_ORDER.md)**, cujo topo
foi refeito nesta leva e agora tem UMA fila. Em resumo:

### 4.1 A ONDA CINCO — 22 das 24 ainda não executadas

**[O índice](sprints/2026-09-05-ONDA-CINCO-INDICE.md)** traz o placar (a §0 diz
o que já fechou) e a ordem. A próxima da FAIXA 0 é
**[AS-DUAS-ABAS-FALAM-01](sprints/2026-09-05-AS-DUAS-ABAS-FALAM-01-o-aparelho-recebeu-e-o-perfil-nao-guardou.md)**
— quando o aparelho recebeu e o perfil não guardou, a tela diz as DUAS coisas.
A 03-02 espera por ela.

### 4.2 A dívida da migração, em ordem de quanto devolve

1. **`botoes.*` (aba 06)** — 777 linhas contra 243, e o Guardar de uma tela
   **anula** o que a outra escreveu. É a maior dívida E o maior risco de perder
   trabalho dela;
2. **`daemon.leitura_no_tique`** — o congelamento de 8,4 s, com causa e cura
   medidas (132 linhas que o dono faz em 22);
3. **as 15 `SO-GTK`** — decidir uma a uma: migra, ou morre com a janela;
4. **as 16 `DIVERGE`** — em quatro delas o **GTK erra**: promover a versão da
   tela nova, não copiar a da janela.

### 4.3 O Mic virtual, Passo 2 — e ele PRECISA DA BANCADA

`ONDA5-MIC-VIRTUAL-02` só começa com a medição que a sprint manda fazer antes do
código: **medir se um link do grafo do PipeWire basta ou se é preciso um
leitor**, com o controle na mesa. Sem isso, qualquer fiação é chute sobre o
áudio dela.

---

## 5. O QUE ELA DECIDIU E NÃO É PRIORIDADE

* **A tradução para o inglês.** Palavra dela: *"não são prioridades a parte da
  tradução"*. O bloqueio está medido de qualquer forma: o catálogo tem 413
  entradas, 317 do `main.glade` e **zero da interface nova**; as dez abas têm
  ~40.000 palavras de tela com 18 marcas `_()`.
* **A janela GTK** continua viva e continua documentada no
  `docs/usage/interface.md`, que é registro datado. As `readme_*.png` ficam.

---

## 6. O QUE SOBROU EM ABERTO, e é honesto listar

* **A quinta mordida da piscada NÃO PEGOU**, e está declarada nos dois arquivos:
  arrancar o `!important` da folha deixa `test_o_sucesso_calado_pisca_e_nao_fala`
  verde, porque o `.mudo-i` apagado que ela clica não declara `border-color`
  própria. Quem declara é `.mudo-i.on` e `select.modo`, fora do caminho daquele
  clique. Quem quiser fechar o buraco mede um dos dois seletores.
* **As fotos das três telas novas** e os cinco gestos de som **ainda não foram
  clicados na bancada** — precisam do aparelho na mesa.
* **`docs/data/donos-de-comportamento.csv` tem 50 linhas de 410 medidas.** As
  360 restantes são as que os laudos consideraram sem consequência; se alguém
  precisar delas, a leva de agentes está nos laudos, não no CSV.

---

## 7. O PRIMEIRO COMANDO DA PRÓXIMA SESSÃO

```bash
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix
source .envrc-voo
git log --oneline -8                       # onde paramos
bash scripts/portoes.sh                    # os 43, ~4 min
```

E o segundo, se for seguir a fila:

```bash
sed -n '1,80p' docs/process/SPRINT_ORDER.md
```

---

**Ver também:** [O DONO DE CADA COMPORTAMENTO](2026-09-05-O-DONO-DE-CADA-COMPORTAMENTO-o-mapa-que-responde-a-queixa-da-recriacao.md)
· [A RECRIAÇÃO — o defeito que ela nomeou](2026-09-05-A-RECRIACAO-o-defeito-que-ela-nomeou-e-a-regra-que-sai.md)
· [ONDA CINCO — o índice](sprints/2026-09-05-ONDA-CINCO-INDICE.md)
· [SPRINT_ORDER](SPRINT_ORDER.md)
