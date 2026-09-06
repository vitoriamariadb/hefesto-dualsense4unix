---
sprint: ONDA5-08-01
estado: aberta
decisoes: [08-Q5, 08-Q7]
posse:
  A08:
    - src/hefesto_dualsense4unix/interface/aba08.py
    - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
    - mockup/08-conexoes.html
    - src/hefesto_dualsense4unix/interface/paginas/08-conexoes.html
    - tests/unit/test_a_aba_08_conexoes_fecha_as_linhas.py
nao_toca:
  - mockup/DIVERGENCIAS.md
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
  - src/hefesto_dualsense4unix/integrations/ordens_da_mesa.py
  - src/hefesto_dualsense4unix/utils/maquina.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
depois_de: [ONDA2-08-CONEXOES-01]
---

# ONDA5-08-01 · DEFEITO — a ordem calada fica na tela, e as duas listas que escondem

> **08-Q5, ela marcou "Fica na lista, apagada":**
> *"A recomendação calada continua no lugar dela, em cinza, e o mesmo botão
> desfaz — mas ela segura uma das cinco fatias, e o achado seguinte não
> aparece."*
> A trava que ela leu: *"Hoje não há caminho de volta nenhum."*
>
> **08-Q7, ela marcou "Um mais-N no fim":**
> *"Quando sobra, a lista ganha uma última linha curta: '+1 recomendação não
> coube aqui' — e só no dia em que sobra."*
> A trava que ela leu: *"hoje a sua bancada já perde uma recomendação em
> silêncio."*

**São duas decisões e uma sprint só, porque a segunda é o preço da primeira.**
A linha calada passa a ocupar uma das cinco fatias do exame; sem o `+N`, curar
o botão sem volta faria a tela esconder mais um achado. E as duas reescrevem os
mesmos quatro arquivos — o gerador, o pacote e as duas cópias do HTML, que são
346.900 bytes gerados por uma execução só. Duas frentes aqui é conflito no
arquivo gerado, não no código.

**POR QUE DEFEITO E NÃO DESENHO.** Nenhuma das duas pede frase melhor. A
primeira é uma porta de mão única sobre um clique dela; a segunda é a tela
apagando trabalho do produto. E as duas já estão descritas **por escrito no
código, como limitação**, em vez de curadas:

```python
    # O `+N` CONTINUA FALTANDO, e é o mesmo buraco que `gui.aba_conexoes.
    # sobraram` mede na janela estável: o desenho não tem onde dizer "e mais 2".
```
— `src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py:706-707`

A regra dela de hoje, em 10-Q6, é sobre exatamente isto: **a máscara não custa
feature — o Hefesto não descreve a limitação, ele constrói o mecanismo que a
remove.** O Hefesto não explica a própria falha; ele a conserta.

---

## 1. O QUE SE MEDIU — o que existe hoje, arquivo por linha

### 1.1 A porta de mão única

O `⊘` grava e a linha **some**. O filtro são duas linhas:

```python
        ordem = getattr(item, "ordem", None)
        if ordem is not None and _DISPENSADAS.get(ordem.chave) == ordem.arranjo:
            continue
```
— `a08_conexoes.py:687-689`, dentro de `_itens_da_tela` (`:672`)

O gesto que alimenta o filtro é `ignorar` (`:4020`), que grava no disco
(`:4058-4060`) e só então mexe na memória (`:4061`). **Não há gesto de desfazer,
em lugar nenhum desta aba** — medido com `grep` sobre as 4.429 linhas do pacote:
o único escritor de `ordens_dispensadas` é aquele.

E a dica do próprio `⊘` promete o que a decisão dela desfaz:

```
title="Ignora ESTE conselho enquanto os cabos estiverem assim. A recomendação
sai desta lista e volta sozinha se o arranjo dos cabos mudar."
```
— `aba08.py:1707`, com o fim vindo de `ORDEM_IGNORADA_VOLTA` (`aba08.py:1515`).
**"sai desta lista" fica falso no minuto em que esta sprint entrar.**

### 1.2 As três listas, e quantas escondem HOJE

| lista | teto | o que a mesa dela rende | esconde hoje |
| --- | --- | --- | --- |
| exame | **5** blocos (`paginas/08-conexoes.html:2257, 2264, 2271, 2278, 2285`) | **7** itens — cinco conferências e duas ordens | **2** |
| ordem de serviço | **1** card | 2 ordens abertas | 0 — **o `+N` já existe** |
| rádios vizinhos | **4** blocos (`paginas/08-conexoes.html:3128`) | 4 rádios | 0 hoje, 1 no dia em que ela espetar o quinto |

O número **7** não é estimativa: está escrito no comentário que ordenou a tira,
com as duas regras nomeadas (`a08_conexoes.py:697-703`). E é por isso que a
ordenação existe — sem ela, as duas que sobravam eram justamente as duas únicas
que acusam.

### 1.3 O que JÁ está de pé, e não se reinventa

* **`_sobraram(quantos, cabem, um, muitos)`** — `a08_conexoes.py:1322`, com o
  molde `_MAIS_N` em `:1319`. Devolve `""` quando cabe tudo. Dois chamadores
  vivos: as ordens (`:1408`) e as curas (`:1418`).
* **`monta.ressalva(campo, texto)`** — `src/hefesto_dualsense4unix/interface/monta.py:1356`.
  Alvo `html`, e o marcador `NADA_A_DIZER` (`monta.py:1297`) que a folha esconde
  com `.ressalva:has(.nada){display:none}` (`monta.py:1263`). **É a peça da
  linha que só nasce quando há o que dizer** — o `+N` é exatamente isso.
* **O alvo `classe` do piloto** — `hefesto_vivo.py:477-492`, com
  `data-hef-classe` e `data-hef-quando`. As cinco linhas do exame já o usam para
  o selo.
* **O alvo `atributo` sobre `title`** — `hefesto_vivo.py:279` (`ATRIBUTO_A_MAIS =
  ['title']`) e a guarda em `:280`. **Já há botão desta aba que carrega gesto e
  campo ao mesmo tempo**: o "A luz não acende", em
  `paginas/08-conexoes.html:2720`, tem `data-gesto="luz-nao-acende"` e
  `data-campo="luz-dica"`.

**Nenhum passo desta sprint precisa de linha nova em `hefesto_vivo.py`.**

### 1.4 O veredito JÁ sabe ignorar as caladas

`_veredito_do_exame` (`:801`) separa `novas` (`:852`) de `caladas` (`:853`),
monta `mudas` (`:861`) e conta o juízo só sobre os `falantes` (`:862-865`), com
a razão escrita: *"senão uma ordem dispensada prenderia o topo em laranja para
sempre e o `⊘` não faria nada visível — que é a definição de botão morto"*
(`:828-829`). **Isto não muda.** É o que garante que a linha cinza não pinte o
topo.

### 1.5 O ACHADO QUE MUDA O DESENHO DA CURA — desfazer não tem caminho até o disco

`ordens_dispensadas` é `dict[str, OrdemDispensada]`
(`src/hefesto_dualsense4unix/utils/maquina.py:280`), e a gravação é uma **fusão
parcial**:

> *"a fusão desce nos dicionários aninhados … `None` presente na declaração é
> uma escolha e SOBRESCREVE. Só a AUSÊNCIA da chave preserva o que havia."*
> — `utils/maquina.py:647-651`, dentro de `fundir_declaracao` (`:639`)

Disso saem três fatos medidos:

1. **Mandar o dicionário inteiro menos uma chave NÃO apaga a chave** — a fusão
   desce e mantém o que já estava.
2. **Mandar `{chave: None}` não passa** — `MaquinaConfig.model_validate` roda
   **antes** do lock (`utils/maquina.py:772`), e o campo não é opcional.
3. **Logo, `machine.declare` não tem verbo de remoção**, e o handler
   (`daemon/ipc_handlers.py:6381`) não é desta posse.

**A saída está escrita no código, como advertência, desde 04/09:**

```
uma dispensa gravada com `arranjo=""` passaria no esquema e nunca casaria, e a
linha voltaria no tique seguinte.
```
— `a08_conexoes.py:4029-4031`

A propriedade que ali é **defeito** é aqui o **mecanismo**: `ordens_novas`
(`integrations/ordens_da_mesa.py:836`) e `ordens_caladas` (`:854`) comparam
`dispensadas.get(ordem.chave)` com `ordem.arranjo`; um arranjo vazio guardado
não casa com arranjo nenhum, e a ordem volta a falar. **Desfazer é escrever
`arranjo=""` na mesma chave** — uma gravação, schema válido, zero linha no
daemon.

**A borda que isso abre, e ela é sua:** se uma `Ordem` viva chegasse com
`arranjo == ""` (o campo tem esse valor por padrão,
`integrations/ordens_da_mesa.py:258`), a comparação casaria e a ordem nasceria
calada. A guarda desta sprint é local — `and ordem.arranjo` no filtro do
`_itens_da_tela`. **A mesma guarda falta em `ordens_da_mesa.py:850` e `:865`, e
aquele arquivo não é seu: RELATE, não conserte.**

---

## 2. O TRABALHO, EM SETE PASSOS

### Passo 1 — `_itens_da_tela` para de descartar; a calada sai MARCADA

`a08_conexoes.py:687-689`. O `continue` sai. No lugar dele, o item continua na
lista e ganha a marca que a tela vai ler. A comparação passa a exigir arranjo:

```python
calada = bool(ordem is not None and ordem.arranjo
              and _DISPENSADAS.get(ordem.chave) == ordem.arranjo)
```

A ordenação de `:714` **não muda** — `sorted` é estável e as ordens continuam
vindo antes das conferências, calada ou não. Uma ordem calada que fosse para o
fim seria a mesma tela que esconde, com outro nome.

**A MORDIDA:** devolva o `continue` e
`test_a_ordem_calada_continua_na_tira` (novo, §3) reprova — a tira volta a ter
seis itens onde havia sete.

### Passo 2 — `_exame()` passa a filtrar, porque o contrato é de OUTRA ABA

`a08_conexoes.py:1530` é `return [_linha(i) for i in _itens_da_tela()]`, e o
docstring dele começa com **"ESTE NOME É CONTRATO"** (`:1510`): quem o consome é
`a01_jogar._do_exame` (`interface/pacotes/a01_jogar.py:551`, chamada em `:582`),
e a coluna **Atenção** da aba Jogar leva tudo o que for `grave` (`:643`).

**Sem este passo, o Passo 1 põe na aba Jogar um alarme que ela já calou aqui.**
`_exame()` passa a descartar as caladas antes de devolver; a pintura desta aba
não passa por ele (`pacote()` chama `_itens_da_tela()` direto, `:2784`), então a
aba 08 continua vendo tudo e a 01 continua vendo só o que fala.

**É isto que faz a cura cobrir todos os chamadores sem tocar em arquivo de outra
posse** — a regra que esta casa pagou duas vezes em 05/09.

**A MORDIDA:** tire o filtro de `_exame()` e
`test_a_aba_jogar_nao_recebe_a_ordem_calada` (novo) reprova, com a ordem calada
aparecendo na lista que a Jogar consome.

### Passo 3 — `_linha` emite `calada`, e o `pacote` a distribui

`_linha` (`a08_conexoes.py:1448`, o dicionário em `:1474-1506`) ganha
`"calada": "sim" ou ""`. O `pacote` a manda como lista, ao lado das que já
existem (`"achado"` em `:3097`, `"achado-explica"` em `:3103`):

```python
        "exame-calada": [i["calada"] for i in itens],
        "ignorar-dica": [i["dica-do-ignorar"] for i in itens],
```

**A lista vai em TODO tique, inclusive vazia** — é a mesma regra da razão do
botão cinza da ONDA0-F: a chave que só aparece quando há o que dizer deixa na
tela a tinta do tique anterior.

**A MORDIDA:** emita `calada` só quando for `"sim"` e
`test_a_linha_que_voltou_apaga_a_tinta` reprova — a segunda linha continua cinza
depois do desfazer.

### Passo 4 — o desenho: a classe que apaga, e a dica que troca de verbo

`aba08.exame()` (`aba08.py:1626`), no `<div class="exame">` de `:1706`:

* o `<div>` troca `data-campo="exame"` por `data-campo="exame-calada"
  data-hef-alvo="classe" data-hef-classe="apagada" data-hef-quando="sim"` — um
  elemento tem UM `data-campo`, e a troca é segura porque **aquele endereço
  nunca chegou à tela**: o pacote emite `"exame": itens`
  (`a08_conexoes.py:3131`), e `normalizar` **descarta lista de dicionários**
  antes do JS, com a razão escrita — *"ela é estrutura, e escrever `[object
  Object]` numa caixa é pior que nada"* (`interface/pacotes/__init__.py:1015-1017`, e o filtro em `:1038-1041`);
* **a chave `"exame"` do pacote NÃO sai.** Ela tem leitor:
  `interface/conexoes_vivas.py:208` monta a tira da bancada a partir dela. O que
  muda é só o `data-campo` do HTML;
* o `<button class="ignora">` ganha `data-campo="ignorar-dica"
  data-hef-alvo="atributo" data-hef-atributo="title"`, e o `title` cravado passa
  a ser só o de partida. **O texto passa a ser do produto**, com dois verbos:
  *"Ignora ESTE conselho…"* e *"Traz esta recomendação de volta para a lista."*;
* a folha ganha `.exame.apagada` — a mesma família do `.dim-label` da janela: cor
  esmaecida, e **nada de `display:none`**. A linha ocupa a fatia dela, que é o
  que a decisão dela diz com todas as letras.

E `ORDEM_IGNORADA_VOLTA` (`aba08.py:1515`) perde o *"sai desta lista"* da frase
que a embrulha em `:1707`. **Isto é fato errado e se substitui**, não se
guarda ao lado do certo: a linha não sai mais.

**A MORDIDA:** tire o `data-hef-classe="apagada"` do `<div>` e
`test_o_desenho_tem_endereco_para_a_linha_apagada` reprova, lendo o HTML
publicado. Tire o `data-campo` do `<button>` e a dica volta a ser a congelada do
desenho — que é a cicatriz da trava da luz, medida em 04/09.

### Passo 5 — `ignorar` vira interruptor: o mesmo `⊘` desfaz

`a08_conexoes.py:4020`. O gesto passa a olhar o estado antes de escrever:

| estado | grava | memória |
| --- | --- | --- |
| falando | `{"quando": hoje, "arranjo": ordem.arranjo}` | `_DISPENSADAS[chave] = arranjo` |
| calada | `{"quando": "", "arranjo": ""}` | `_DISPENSADAS[chave] = ""` |

**A ORDEM DAS DUAS NÃO SE INVERTE.** `_declarar` levanta quando o daemon recusa
(`a08_conexoes.py:3369-3370`), e a memória só muda depois (`:4061`). Inverter poria a tela num
estado que o disco não tem — e a linha voltaria sozinha no tique seguinte, sem
uma palavra.

**A recusa de conferência continua** (`:4053-4057`): uma conferência não tem
arranjo, e o `⊘` nela recusa dizendo. Nada muda ali.

**O "deu certo" deste clique é a própria linha mudando de cor**, e por isso ele
não usa o pisca-verde de 1,5 s da decisão 03-Q4: aquele existe para o gesto cuja
resposta não se vê. Aqui a resposta É a tela. Se alguma régua pedir canal de
confirmação, o canal é o verde — não uma palavra nova.

**A MORDIDA:** faça o gesto gravar sempre a dispensa (o de hoje) e
`test_o_mesmo_gesto_desfaz` reprova: dois cliques deixam a linha calada em vez
de trazê-la de volta. E arranque a ordem das duas escritas — ponha
`_DISPENSADAS[...]` antes do `_declarar` — e
`test_a_recusa_do_disco_nao_cala_a_linha` reprova com o dublê que levanta.

### Passo 6 — o `+N` do exame e o dos vizinhos

Dois endereços novos, os dois pela peça que já sabe calar:

```python
monta.ressalva("exame-mais", ...)      # no fim de `.col-exame`  (aba08.py:3077)
monta.ressalva("vizinho-mais", ...)    # no fim de `.vizinhos`   (aba08.py:3260)
```

No pacote, os dois valores saem do `_sobraram` que já existe (`:1322`), com os
tetos declarados como constantes ao lado do `_TETO_DE_CURAS` (`a08_conexoes.py:1254`) — **5** e
**4**, lidos de um lugar só, nunca digitados nos dois arquivos.

**A ARMADILHA QUE ESTE PASSO TEM DE DESVIAR, e ela põe um travessão na tela dela
todo dia:** `_sobraram` devolve `""`, e o `escrever()` do piloto traduz vazio em
`—` **antes** de olhar o alvo (`hefesto_vivo.py:289-290`). O que a coluna da
ordem faz hoje só funciona porque `_html_da_ordem` (`:1350`) nunca devolve
vazio. Os dois campos novos têm de mandar `monta.NADA_A_DIZER`
(`monta.py:1297`) no lugar do `""` — é para isso que a peça existe.

**E o import é o de `a10_perfis.py:813`** — `from hefesto_dualsense4unix.interface
import monta` —, **não** o de `a06_navegacao.py:359`, que declara um
`NADA_A_DIZER = '<i class="nada"></i>'` próprio. Aquela é a segunda grafia de uma
constante que já tem dono, e copiá-la aqui faria a terceira.

**A MORDIDA, e ela é DUAS:** (a) mande `""` em vez do `NADA_A_DIZER` e
`test_o_mais_n_do_exame_cala_sem_travessao` reprova, achando `—` sob a quinta
linha; (b) faça o `+N` do exame contar a lista dos vizinhos e
`test_cada_mais_n_conta_a_propria_lista` reprova. Esta segunda é a régua do erro
que esta aba já cometeu uma vez: `gui.aba_conexoes.sobraram` foi tomado por dono
da frase e conta o **acordeão** (`:1310-1313`).

### Passo 7 — a bancada primeiro, e a publicação é o olho dela

O trabalho fecha em `mockup/08-conexoes.html`, com a seção declarada em
`mockup/DIVERGENCIAS.md` no formato que o arquivo define. A publicação é um
comando (`scripts/check_o_desenho_aprovado.py --publicar 08`) e é dela.

**Hoje as duas cópias são byte a byte idênticas** — medido em 05/09: 346.900
bytes cada, `diff` de zero linhas, e nenhuma seção `08-conexoes` no
`DIVERGENCIAS.md`. É desse estado que você parte, e é a ele que a publicação
devolve.

---

## 3. AS RÉGUAS

Todas em `tests/unit/test_a_aba_08_conexoes_fecha_as_linhas.py`, que já tem
dezessete casos e as três decisões irmãs desta aba.

| régua | o que morde |
| --- | --- |
| `test_a_ordem_calada_continua_na_tira` | Passo 1 — o filtro que sumia com a linha |
| `test_a_ordem_calada_com_arranjo_vazio_nao_cala` | Passo 1 — a borda do arranjo vazio |
| `test_a_aba_jogar_nao_recebe_a_ordem_calada` | Passo 2 — o contrato de `_exame()` |
| `test_a_linha_que_voltou_apaga_a_tinta` | Passo 3 — a chave em todo tique |
| `test_o_desenho_tem_endereco_para_a_linha_apagada` | Passo 4 — lê o HTML publicado |
| `test_a_dica_do_ignorar_vem_do_produto` | Passo 4 — a dica congelada |
| `test_o_mesmo_gesto_desfaz` | Passo 5 — o interruptor |
| `test_a_recusa_do_disco_nao_cala_a_linha` | Passo 5 — a ordem disco→memória |
| `test_o_mais_n_do_exame_cala_sem_travessao` | Passo 6 — o `—` na tela dela |
| `test_cada_mais_n_conta_a_propria_lista` | Passo 6 — a conta da lista errada |

**A régua tem de LER, não digitar.** As que olham a tela abrem
`src/hefesto_dualsense4unix/interface/paginas/08-conexoes.html` e procuram lá;
uma que reconstrua a frase a partir da mesma constante que a produziu mede a si
mesma. Esta casa pagou onze vezes por isso em 26/08.

**E confira o dublê.** Três dos vermelhos de 05/09 eram dublê mais frouxo que o
real. O `p._DISPENSADAS` é global de módulo: salve e devolva, como
`tests/unit/test_a08_a_ordem_de_servico_e_a_sala_sao_da_maquina_dela.py:341-350`
já faz.

---

## 4. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois:

* **A dispensa é sobre o ARRANJO, não sobre a palavra.** `OrdemDispensada`
  guarda `arranjo` (`utils/maquina.py:233`), e a ordem volta sozinha quando os
  cabos mudam. O interruptor não pode virar uma dispensa por nome.
* **A calada não pinta o topo.** `_veredito_do_exame` conta só os `falantes`
  (`a08_conexoes.py:862-865`). Se o veredito passar a ver as caladas, o `⊘`
  volta a ser botão morto.
* **As ordens vêm antes das conferências** — `a08_conexoes.py:714`, e
  `test_as_ordens_vem_antes_das_conferencias`
  (`tests/unit/test_a08_a_ordem_de_servico_e_a_sala_sao_da_maquina_dela.py:329`)
  exige sete itens e as duas que acusam entre os cinco primeiros. Ele **não pode
  ficar verde por sorte**: ele zera `_DISPENSADAS`, então continua medindo o
  mesmo de sempre.
* **O `⊘` numa conferência recusa dizendo** — `a08_conexoes.py:4053-4057`.
* **`quando` é só a data** — `OrdemDispensada._so_a_data`
  (`utils/maquina.py:235-241`). O desfazer que escreve `quando=""` passa: o
  validador só cobra a forma do que não é vazio.
* **O `+N` da coluna da ordem e o das curas continuam** — `_sobraram` em `:1408`
  e `:1418`, com `test_o_mais_n_conta_a_ordem_que_nao_coube` (`:184`),
  `test_o_mais_n_cala_quando_tudo_cabe` (`:196`) e
  `test_o_mais_n_concorda_em_numero` (`:202`). Reusar `_sobraram` é o que impede
  a segunda grafia da mesma frase.
* **A quinta linha não nomeia botão morto** — `ORDEM_IGNORADA_VOLTA`
  (`aba08.py:1515`) e `test_o_exame_nao_manda_procurar_um_botao_que_nao_existe`
  (`:253`). O que muda é o *"sai desta lista"*; o *"volta sozinha"* fica.
* **Zero pixel de janela a mais.** A ONDA2-08 mediu `.janela` em 1180x777 antes e
  depois, sem rolagem lateral. O `+N` é linha que só nasce no dia em que sobra, e
  a linha apagada já ocupava a fatia dela.

---

## 5. O QUE VOCÊ NÃO FAZ — e RELATA

1. **`integrations/ordens_da_mesa.py:850` e `:865` precisam da mesma guarda de
   arranjo vazio.** Medido na §1.5. Aquele arquivo tem outro dono e é lido pela
   janela GTK também.
2. **`machine.declare` não sabe remover chave** (§1.5). Esta sprint contorna com
   `arranjo=""` e o contorno é honesto — a marca fica no registro, e a regra é
   quem decide se ela cala. Se algum dia o verbo de remoção existir, o registro
   pode ser podado; não é urgente e **não é seu**.
3. **`hefesto_vivo.py` não recebe linha nenhuma.** Se você achar que precisa,
   pare e relate: os dois alvos de que esta sprint depende já existem (§1.3).

---

## A PROVA DE TELA

Vale a `PROVA-DE-TELA-01` inteira, e ela é obrigatória aqui — **cinco elementos
que ela nunca viu**: a linha cinza, a dica que troca de verbo, os dois `+N` e o
clique que traz de volta.

1. **A FOTO** — antes e depois, `--oculta`.
2. **O CLIQUE** — o `⊘` apertado **duas vezes**, com a resposta das duas. Um
   botão que você acrescentou e nunca clicou não está entregue, e este muda de
   sentido na segunda vez.
3. **A MORDIDA** — colada, dos dois estados.

**A janela não nasce na tela dela.** Ela tem UMA tela.
