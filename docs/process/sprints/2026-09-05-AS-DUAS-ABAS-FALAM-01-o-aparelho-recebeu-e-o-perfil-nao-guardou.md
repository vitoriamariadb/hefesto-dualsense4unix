---
sprint: AS-DUAS-ABAS-FALAM-01
estado: feita
posse:
  D17:
    - src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py
    - tests/unit/test_o_gatilho_aplicado_vai_para_o_perfil.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
  - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/profiles/
depois_de: [ONDA2-03-GATILHOS-01, ONDA4-S10-O-TRANSPORTE-01]
---

# D-17 · Quando o aparelho recebeu e o perfil não guardou, AS DUAS ABAS FALAM

> **ESTADO 06/09/2026: feita.** Os quatro passos entraram, e a frase foi vista
> na tela com o daemon vivo e um DualSense no cabo — janela `--oculta`, `HOME` e
> os quatro `XDG_*` desviados para um lar de mentira, que é o que PRODUZ o
> meio-ato: o daemon publica `active_profile = 'Personalizado'` e esse arquivo
> não existe para o leitor da prova.
>
> **O que a tela disse, no cartão do P1, em VERDE (`tom: sucesso`,
> `rgb(80, 250, 123)`):**
>
> > *Gatilho esquerdo (L2): Rigid aplicado · o efeito FOI para o aparelho, mas
> > não consegui ABRIR o perfil 'Personalizado' para guardá-lo. Ele vale até a
> > próxima troca de perfil — no dia seguinte o gatilho volta a ser o de antes.*
>
> **O aparelho recebeu, e quem diz é o daemon:** o corpo da resposta veio
> `{'status': 'ok', 'aplicado_em': [<o controle>], 'guardado_em': []}` — o mesmo
> campo que `_chegou_ao_aparelho` lê para decidir se grava.
>
> **A soma mora no `_aplicar`, então TRÊS gestos passaram a poder dizê-la** —
> `modo`, `pronto` e `ajuste` — sem que nenhum deles mudasse uma linha. O
> `reenviar` continua sem frase de disco, e há régua que o prova.
>
> **A mordida, na tela:** devolvido o `except Exception: return`, o gesto
> continua saindo `aplicado`, o gatilho continua indo ao aparelho, e a tela diz
> *uma metade só* — `"Gatilho esquerdo (L2): Rigid aplicado"` sobre um perfil
> que não guardou. Nas réguas ela reprova em QUATRO lugares.
>
> **O que a §5 declarou continua aberto:** a aba 02 levanta onde a 03 e a 06
> devolvem frase, e o ramo do `save_profile` desta mesma função continua falando
> pelo laranja. Os dois estão escritos no docstring, com a razão.
>
> O relatório é
> [`docs/process/agentes/2026-09-06/AS-DUAS-ABAS-FALAM-01.md`](../agentes/2026-09-06/AS-DUAS-ABAS-FALAM-01.md).

> **A pergunta, escrita no handoff de hoje**
> (`docs/process/2026-09-05-ONDE-PARAMOS-a-onda-tres-e-as-reguas-que-mediam-o-mundo-de-ontem.md`,
> §5.3): *"Quando o aparelho recebeu e o perfil NÃO guardou: a aba 02 fala …,
> a aba 03 cala. As duas têm razão escrita. **É decisão de produto e ainda não
> foi tomada.**"*
>
> **Ela tomou, 05/09/2026: as duas abas falam.**

O trabalho é de UM arquivo. A aba 02 já fala; o que muda é a 03.

---

## 1. O QUE SE MEDIU — três abas, três respostas para a mesma falha

A falha é sempre a mesma: o `trigger.set`/`mic.set`/`mouse.emulation.set` **deu certo**, o
byte saiu no fio, e o caminho de disco tropeçou depois.

| aba | `load_profile` falha | `save_profile` falha | canal |
| --- | --- | --- | --- |
| **02 Controles** | **fala** — `RuntimeError`, `a02_controles.py:2598-2600` | **fala** — `SOM_SEM_ENDERECO`, `:2639` | cartão em laranja |
| **03 Gatilhos** | **CALA** — `except Exception: return`, `a03_gatilhos.py:2484-2485` | fala — `RuntimeError`, `:2491-2494` | cartão em laranja |
| **06 Navegação** | **fala** — devolve frase, `a06_navegacao.py:1670-1671` | levanta pelo `save_profile` nu, `:1685` | cartão em verde (`{"recado": …}`) |

**Duas linhas, e é o buraco inteiro:**

```python
    try:
        prof = perfil._com_o_src().load_profile(nome)
    except Exception:
        return
```
— `src/hefesto_dualsense4unix/interface/pacotes/a03_gatilhos.py:2482-2485`

O ramo irmão, uma linha abaixo, já sabe falar:

```python
        raise RuntimeError(
            f"o efeito FOI para o aparelho, mas não consegui guardá-lo no "
            f"perfil {nome!r}: {erro}. Ele vale até a próxima troca de perfil — "
            f"no dia seguinte o gatilho volta a ser o de antes.")
```
— `a03_gatilhos.py:2491-2494`

**A mesma função diz as duas metades num ramo e some no outro.**

---

## 2. POR QUE A RAZÃO DO SILÊNCIO NÃO VENCE

O docstring de `_guardar_no_perfil` argumenta pelo silêncio, e o argumento está
escrito (`a03_gatilhos.py:2464-2477`):

> *"**NÃO ABRIU O PERFIL, NÃO GRAVA — E NÃO LEVANTA.** … o nome que o daemon
> publica não existe para ESTE leitor. O segundo não é hipótese: as réguas
> desta aba rodam com `active_profile` de mentira, e na máquina dela o daemon
> pode nomear um perfil que a pasta lida aqui não tem (apagado, renomeado,
> outra pasta). Nos dois, o gatilho FOI para o aparelho e o `_RASCUNHO` o
> segura na tela — **levantar diria "não deu" sobre um efeito que ela está
> sentindo na mão.**"*

**Ele é verdadeiro sobre o CANAL e falso sobre o SILÊNCIO — são duas coisas, e
o docstring as trata como uma.**

1. **A frase não diz "não deu". Diz as duas metades.** O que o argumento recusa
   é uma frase que negue o efeito, e ninguém está propondo essa frase. A que
   entra é a que a própria função já escreve no ramo vizinho: *o aparelho
   recebeu · o perfil não guardou*. Só a primeira metade esconderia o defeito;
   só a segunda a mandaria procurar no aparelho um efeito que está lá — é o
   critério que `test_a_falha_de_disco_diz_as_duas_metades` já cobra
   (`tests/unit/test_o_gatilho_aplicado_vai_para_o_perfil.py:384-411`).
2. **O caso que ele usa para justificar o silêncio é justamente o caso em que
   ela precisa saber.** *"O daemon nomeia um perfil que este leitor não acha"*
   quer dizer, na mesa dela: o perfil foi apagado, renomeado, ou está noutra
   pasta — e **cada gatilho que ela ajustar a partir daí morre na próxima troca
   de perfil, sem uma palavra.** É o defeito exato que a decisão D2 veio matar,
   com a agravante de o produto SABER e não dizer.
3. **A régua de mentira não é argumento de produto.** As quatro réguas que
   rodam com `active_profile="régua"` reprovavam porque a primeira versão da
   cura escolheu o canal do `RuntimeError` — que é recusa. Trocar o canal
   resolve as quatro sem calar a mesa dela. *Régua que obriga o produto a calar
   está medindo o dublê, não o produto* — a regra que este dia já deixou.

**O canal é o do `recado`, e não o do `RuntimeError`.** O piloto tem dois tons e
só dois (`hefesto_vivo._depositar`, `:2201`): `"recusa"` (laranja, 30 s) e
`"sucesso"` (verde, 6 s). Um gesto que fez o que prometeu no aparelho **não é
recusa**. A aba 06 já pousou nessa decisão e escreveu a razão:

> *"POR QUE UMA FRASE E NÃO UM `RuntimeError`: o aparelho JÁ mudou quando esta
> função é chamada … Levantar aqui pintaria o cartão laranja da RECUSA sobre um
> gesto que fez metade do que prometeu, e ela leria *"não deu"* sobre um cursor
> que acabou de ficar mais rápido."*
> — `a06_navegacao.py:1648-1653`

---

## 3. O TRABALHO, EM QUATRO PASSOS

### Passo 1 — `_guardar_no_perfil` devolve frase em vez de sumir

`a03_gatilhos.py:2449`. A assinatura passa de `-> None` para `-> str`: `""`
quando gravou (e quando não havia o que gravar), a frase quando **havia perfil
nomeado e o disco não recebeu**. É a mesma assinatura que `a06_navegacao.py:1638`
já tem, e usar a mesma não é gosto: são os dois únicos escritores de perfil por
clique que não podem levantar.

A frase, e ela é a do ramo vizinho com o verbo trocado:

```
o efeito FOI para o aparelho, mas não consegui ABRIR o perfil 'meu_perfil'
para guardá-lo. Ele vale até a próxima troca de perfil — no dia seguinte o
gatilho volta a ser o de antes.
```

O ramo do `save_profile` (`:2490-2494`) **continua levantando por ora** — ver a
§5. O que este passo fecha é o ramo que cala.

**A MORDIDA:** devolva o `except Exception: return` e
`test_a_falha_de_abrir_o_perfil_diz_as_duas_metades` (novo, §4) reprova com o
`recado` sem a segunda metade.

### Passo 2 — `_aplicar` carrega a frase até o recibo

`a03_gatilhos.py:2440-2446`. A chamada em `:2444` passa a guardar o retorno, e
ele entra no terceiro elemento da tupla junto do recibo, pelo separador que já
existe:

```python
_E_TAMBEM = " · "
```
— `a03_gatilhos.py:2926`, hoje usado por `reenviar` para somar as duas metades
do recibo (`:3018-3019`).

**Este passo é o que faz a cura cobrir TODOS os chamadores de uma vez** — a
regra que esta casa pagou duas vezes em 05/09. Os três gestos que gravam
(`modo` `:2712`, `pronto` `:2762` e `:2814`/`:2830`, `ajuste` `:2841`) já
devolvem `{"recado": recibo}`; nenhum deles precisa mudar uma linha.

**A MORDIDA:** arranque a soma em `_aplicar` (devolva só o recibo) e as três
réguas de gesto do §4 reprovam — uma por gesto. Se só uma reprovar, a cura
entrou no gesto e não no `_aplicar`, que é o defeito que este passo evita.

### Passo 3 — `reenviar` continua intocado, e há régua que o prova

`reenviar` passa `guardar=False` (`:2994`), então `_guardar_no_perfil` nem é
chamado e a frase é sempre `""`. Isso não é sorte: `test_reenviar_nao_grava`
(`:271`) já existe. **Confira que ele continua verde** — é a prova de que o
Passo 2 não vazou disco para um gesto cujo contrato diz *"ELE NÃO GRAVA NADA NO
DISCO DELA"*.

### Passo 4 — a razão fica escrita onde o argumento contrário estava

Reescreva o parágrafo **"NÃO ABRIU O PERFIL, NÃO GRAVA — E NÃO LEVANTA"**
(`:2464-2477`). Não o apague: ele é decisão medida, e a metade dele que
sobrevive é a que importa — **não levanta**. Deixe as duas metades separadas,
com a data:

* **não levanta** — vale, e a razão é a dele: o efeito está na mão dela;
* **não fala** — caducou em 05/09/2026, decisão D-17, e a razão é a de cima.

---

## 4. AS RÉGUAS, e o cuidado com o arquivo que já existe

`tests/unit/test_o_gatilho_aplicado_vai_para_o_perfil.py` **tem um caso que
asserta o silêncio**, e ele reprova de propósito quando esta sprint entrar:

```python
def test_perfil_que_nao_abre_aplica_e_nao_levanta(pac, monkeypatch) -> None:
```
— `:350-381`. Ele asserta três coisas, e **duas continuam valendo**:

| asserção | linha | depois de D-17 |
| --- | --- | --- |
| `p.enviados` — o gatilho chegou ao aparelho | `:375` | **continua** |
| `gravados == []` — não gravou num perfil que não abriu | `:376` | **continua** |
| `saida and "recado" in saida` — não virou erro | `:377` | **continua** — e agora o `recado` diz mais |

**Nenhuma das três precisa cair.** O que muda é o docstring dele, que hoje
argumenta pelo silêncio, e o nome, que promete menos do que o caso mede. O
trabalho é: manter o teste, reescrever o docstring com a decisão datada, e
**acrescentar a asserção que falta** — que o `recado` diga as duas metades.

Não faça substituição em massa neste arquivo. *"Substituição em massa sobre uma
régua é edição cega; cada uma tem de ser lida"* — a lição das dezoito réguas de
hoje, e duas delas foram devolvidas por isso.

**As réguas novas, e as três mordem em lugares diferentes:**

1. `test_a_falha_de_abrir_o_perfil_diz_as_duas_metades` — o dublê faz
   `load_profile` levantar `FileNotFoundError`; o gesto **não** levanta, o
   `recado` traz *aparelho* e *perfil*, e o nome do perfil aparece nele. Espelha
   o `test_a_falha_de_disco_diz_as_duas_metades` que já existe (`:384`), que é o
   irmão do outro ramo.
2. `test_os_tres_gestos_que_gravam_carregam_a_frase` — parametrizado em `modo`,
   `pronto` e `ajuste`, com o mesmo dublê. **É esta que prova o Passo 2:** uma
   cura escrita dentro de um gesto passa em um terço dela.
3. `test_o_reenviar_nao_ganhou_frase_de_disco` — com o mesmo dublê que faz o
   `load_profile` explodir, o `recado` do `reenviar` **não** menciona perfil.
   Sem ela, o Passo 2 poderia somar frase num gesto que por contrato não toca o
   disco, e ninguém veria.

**E cuidado com o dublê.** Três dos vermelhos de hoje eram dublê mais frouxo que
o real (§2 do handoff). O `PonteDeMentira` deste arquivo devolve `(True, "", {})`
e por isso `_fala_de_destino` (`a03_gatilhos.py:2504`) responde `False` e o
recibo sai na forma curta — **conte com o recibo curto nas asserções**, ou a
régua passa a medir o tradutor em vez da frase.

---

## 5. O QUE ESTA DECISÃO **NÃO** DECIDE

1. **"Não há perfil ativo" continua calado nas duas.** É estado, não evento, e a
   razão está medida e é dela: *"é aviso, não estado"* — `_PERFIL_E_ESTADO_NAO_E_AVISO`
   (`a02_controles.py:2443-2464`), com OITO réguas que reprovaram a primeira
   versão daquela cura. O chip `Perfil ativo` do cabeçalho já mostra isso o
   tempo todo, e repeti-lo a cada clique faz ela parar de ler recado. Na aba 03
   quem já cobre esse caso é o gesto `guardar` (`:3101-3104`), com frase própria
   e outro assunto.
2. **A aba 06 fala pelo verde e a 02 pelo laranja, para a MESMA falha.** É uma
   terceira divergência, medida aqui e não resolvida aqui: `a02_controles.py:2598`
   levanta onde `a06_navegacao.py:1670` devolve frase. A D-17 alinha a 03 com a
   06 porque é o canal honesto para um gesto que funcionou; **alinhar a 02 é
   outra sprint, e ela precisa das oito réguas da 02 relidas uma a uma.**
   Declarado, não esquecido.

---

## 6. NADA SE PERDEU

O que existe hoje e tem de continuar existindo depois:

* **O gatilho chega ao aparelho mesmo sem perfil.** Nenhum passo pode pôr o
  disco antes do fio: `test_sem_perfil_ativo_aplica_e_nao_levanta` (`:335`) e
  `test_perfil_que_nao_abre_aplica_e_nao_levanta` (`:350`).
* **O clique num lado não dá dono ao outro** — `_com_os_gatilhos` recebe um
  dicionário de um item só, e `test_o_clique_num_lado_nao_da_dono_ao_outro`
  (`:219`) e `test_a_secao_global_do_perfil_fica_intacta` (`:254`) guardam isso.
* **Nada mudou, nada grava** — `test_nada_mudou_nada_grava` (`:298`).
* **O aparelho recusou, o disco não guarda** — `test_o_aparelho_recusou_o_disco_nao_guarda`
  (`:323`). A guarda é `ok and _chegou_ao_aparelho(corpo)` (`:2440`), e ela vem
  ANTES de tudo o que esta sprint toca.
* **`reenviar` não grava** — `test_reenviar_nao_grava` (`:271`), e o contrato
  escrito no docstring dele.
* **O `_RASCUNHO` continua sendo a memória dos 500 ms** entre o clique e o
  tique. Ele não é o disco e não vira o disco (`:2441-2442`).
* **O recibo de sucesso continua nomeando o gatilho** —
  `test_o_gesto_devolve_o_recado_que_o_piloto_leva_ao_cartao`
  (`tests/unit/test_a_aba_03_gatilhos_fecha_as_linhas.py:492-517`) asserta
  `NOME_DO_LADO[...] in fora["recado"]`. **A asserção é por `in`**, então somar
  uma segunda metade não a quebra — mas some **depois** do recibo, nunca antes,
  ou a frase deixa de abrir pelo que ela fez.
* **O `_gravar_so_o_gatilho` e não `perfil.gravar_e_reaplicar`** — reaplicar o
  perfil inteiro acende de volta a barra de luz que ela desligou noutra aba
  (`:2489`, e `tests/unit/test_o_guardar_do_gatilho_nao_reaplica_o_perfil_inteiro.py`).

---

## A PROVA DE TELA

O `recado` novo é texto que ela lê. Ele pousa no cartão daquele controle, em
verde, por 6 s — e **nunca foi visto por ela**. Vale a `PROVA-DE-TELA-01`:
foto antes e depois, o clique que produz a frase, e a mordida colada.

**A janela não nasce na tela dela.** `--oculta` sempre — ela tem UMA tela.
