---
sprint: ONDA5-09-01
decisoes: [09-Q1, 09-Q2, 09-Q3 (a metade de tela)]
posse:
  09A:
    - src/hefesto_dualsense4unix/interface/aba09.py
    - mockup/09-sistema.html
    - tests/unit/test_a_aba_09_sistema_fecha_as_linhas.py
depois_de: [ONDA2-09-SISTEMA-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/gui/aba_sistema.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/interface/paginas/09-sistema.html
  - docs/data/paridade-gtk-html.csv
---

# ONDA5-09-01 · DESENHO — o botão volta a se chamar "Atualizar"

> **A palavra dela, 05/09/2026, sobre a pergunta 09-Q1:**
>
> > *"Segue fazendo os dois. Com mesmo nome"*
>
> **E sobre a 09-Q3:**
>
> > *"Atualizando e funciona em termo de feature"*
> >
> > *(esclarecimento do mesmo dia)* *"o botão diz Atualizando… e no fim o campo
> > pisca em verde — mas o botão tem de realmente fazer o que promete"*

**Esta sprint é a metade de TELA. A metade de mecanismo — *fazer o que promete*
— é a `ONDA5-09-02`, e ela mora noutro arquivo**, para as duas correrem juntas.

---

## 0. A PRIMEIRA COISA A SABER: ISTO É UMA REVERSÃO, E A REVERSÃO É DELA

Em 04/09 a pergunta 09-Q1 foi respondida **por mim, não por ela**, no
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md):

| linha 153 daquele documento | o que virou código |
| --- | --- |
| *"O nome vira o trabalho: **Reaplicar ajustes**."* | `aba09.py:997` · `ROTULO_REAPLICAR = "Reaplicar ajustes"` |

Hoje ela leu a mesma pergunta e escolheu a opção contrária, com as palavras
dela: **segue fazendo os dois, com o mesmo nome.** É a opção 1 da 09-Q1 — *"o
botão continua chamado 'Atualizar' e fazendo as duas coisas; muda só o texto que
aparece ao parar o mouse em cima"*.

**A palavra dela vence a minha recomendação.** É a mesma forma dos oito
conflitos de 04/09, e a regra desta casa já a tinha escrito: *quando ela recusa
a opção que eu ofereço, quem estava errado é a oferta*.

**E metade da opção 1 JÁ ESTÁ FEITA.** A pergunta que ela leu descreve a dica
como *"promete só reler a tela e não mudar nada"* — essa frase morreu em 04/09.
A dica de hoje (`aba09.py:1004-1008`) já diz os dois trabalhos. **O que sobra
desta decisão é o RÓTULO**, e a §3 mostra que ele não é uma linha só.

---

## 1. O QUE SE MEDIU — o botão, hoje, letra por letra

```
<button class="btn" title="Manda o serviço reaplicar a configuração e reescrever
os arquivos de ambiente que a Steam usa para lançar os jogos; no fim, relê o que
esta aba mostra. Leva alguns segundos, e o botão avisa enquanto trabalha."
data-gesto="atualizar" data-hef-em-voo="Reaplicando…">Reaplicar ajustes</button>
```
— `mockup/09-sistema.html:1245`, byte-idêntico a
`src/hefesto_dualsense4unix/interface/paginas/09-sistema.html:1245`

| peça | onde mora | valor de hoje | valor decidido |
| --- | --- | --- | --- |
| rótulo | `aba09.py:997` | `"Reaplicar ajustes"` | **`"Atualizar"`** |
| rótulo da espera | `aba09.py:998` | `"Reaplicando…"` | **`"Atualizando…"`** |
| dica | `aba09.py:1004-1008` | diz os dois trabalhos | **fica, com a §4 por cima** |
| a montagem | `aba09.py:1042` | `item(ROTULO_REAPLICAR, DICA_REAPLICAR, …)` | as constantes trocam de nome junto |
| a régua do gerador | `aba09.py:1657-1686` | **exige** `"Reaplicar ajustes"` | passa a exigir `"Atualizar"` |
| a régua da suíte | `tests/unit/test_a_aba_09_sistema_fecha_as_linhas.py:342-343, 667, 674` | lê as constantes de `aba09` | acompanha sozinha; a prosa dela não |

**As duas réguas leem a constante, não a palavra digitada** — é por isso que
trocar o valor em `aba09.py:997` já vira verde nos dois lados. **E é exatamente
por isso que a §3 é obrigatória:** verde não é o suficiente quando a MENSAGEM de
erro da régua e o comentário que a explica continuam ensinando o contrário.

---

## 2. A 09-Q2 JÁ ESTÁ DE PÉ — NÃO CONSTRUA NADA

Ela escolheu **"Cinza mas ainda responde"**. Está inteiro, e a trava que a
pergunta declarava (*"a folha de estilo desta página hoje não tem cara de
apagado para esses três botões"*) **caiu em 04/09**:

| a metade | onde está | medido |
| --- | --- | --- |
| a tinta do apagado | `src/hefesto_dualsense4unix/interface/monta.py:1224-1226` | `.btn.apagado` existe, e o `:hover` junto |
| a tinta, publicada | `src/hefesto_dualsense4unix/interface/paginas/09-sistema.html:693-695` | a mesma regra, na página que o produto abre |
| o `?` só quando há razão | `monta.py:1239-1240` | `.btn:not(.apagado) + .ajuda.porque{display:none}` |
| os três endereços | `mockup/09-sistema.html:1243` e a publicada, na mesma linha | `data-campo="retomar-razao"`, e os irmãos `reiniciar-razao` e `ver-plugins-razao` |
| **não** emite `disabled` | `monta.py:1347-1350` | só `aria-disabled`, derivado da mesma classe — o clique sobrevive |
| quem escreve a razão | `src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py:1345` (`razoes_do_cinza`), chamada em `:1163` | um campo por tique, para os três |
| o clique recusando | `a09_sistema.py:1480-1482` (`retomar`), `:1702-1704` (`reiniciar`), `:2162-2164` (`ver-plugins`) | `raise RuntimeError(motivo)` |
| a tarja laranja | `src/hefesto_dualsense4unix/interface/hefesto_vivo.py:2197` | `_depositar(uniq, str(erro), "recusa")` |
| **no rodapé**, e não num cartão | `hefesto_vivo.py:2078` | os gestos da 09 não trazem `uniq`; sem cartão, a frase vira tarja de rodapé — que é o que a opção dela descreve |

**A opção que ela marcou está descrita linha a linha acima. Zero trabalho.** O
que esta sprint deve à 09-Q2 é **não quebrá-la**: ver a §6.

---

## 3. O TRABALHO, EM CINCO PASSOS

### Passo 1 — as duas constantes, e os NOMES delas

`aba09.py:997-998`:

```python
ROTULO_ATUALIZAR = "Atualizar"
EM_VOO_ATUALIZAR = "Atualizando…"
```

**Os nomes trocam junto com os valores, e não é enfeite:** `ROTULO_REAPLICAR`
guardando `"Atualizar"` seria a próxima pessoa lendo o nome e concluindo o
contrário do valor — a mesma espécie de segunda verdade que esta casa persegue
desde 27/08. Alcance medido: `aba09.py:1042`, `:1665`, `:1672`, e
`tests/unit/test_a_aba_09_sistema_fecha_as_linhas.py:342-343`, `:667`, `:674`.

**`"Atualizando…"` é a palavra DELA**, e o gerúndio do rótulo que ela mandou
manter — a mesma gramática que a janela antiga já usa nos recibos dela
(*"Reiniciando o Hefesto…"*,
`src/hefesto_dualsense4unix/app/actions/daemon_actions.py:2293`).

**A MORDIDA:** troque só o valor e deixe o nome `ROTULO_REAPLICAR` — nenhuma
régua reprova, e é o ponto: **este passo não tem régua automática, tem leitura.**
O que se pode morder é o valor: ponha `"Reaplicar ajustes"` de volta e
`aba09.py:1665` reprova na hora do `python3 aba09.py`, com a frase do Passo 3.

### Passo 2 — o comentário que argumenta pelo nome que caiu

`aba09.py:973-996` são 24 linhas defendendo o rótulo `"Reaplicar ajustes"`:

> *"Nomear o botão pela metade que só ele faz é a única forma que para de mentir
> **sem gastar linha de tela** — 17 letras contra as 19 de 'Reiniciar o
> serviço', na mesma coluna de 184px."*

**Ele SAI e não vira nota**, pela regra desta casa: *fato errado se SUBSTITUI*.
O teste que a regra dá — *apagar isto faria alguém repetir um trabalho ou pagar
um custo já pago?* — responde não: nenhuma medição se perde. **A medição que
fica** (a releitura custa 4 ms e o `LENTO_S = 2.0` de `a09_sistema.py:172` já a
refaz a cada 2 s) migra para a nova redação, porque ela é o que sustenta a dica.

O que entra no lugar, em três linhas: *ela leu a pergunta em 05/09 e mandou o
botão seguir fazendo os dois com o mesmo nome; a recomendação de 04/09 propunha
o contrário e perdeu; o que a dica carrega é a verdade dos dois trabalhos.*

**A MORDIDA:** não há régua de prosa. A conferência é humana e é do relatório:
cole o comentário novo na entrega.

### Passo 3 — as três mensagens de erro da régua do gerador

`aba09.py:1665-1671` reprova hoje com esta frase:

> *"o botão do `daemon.reload` diz {…} e o PO decidiu 'Reaplicar ajustes'
> (decisão [01], 04/09/2026)"*

Ela passa a citar **a palavra dela de 05/09**, e a razão do nome deixa de ser *"o
nome vira o trabalho"* e passa a ser *"ela mandou manter"* — que é uma razão
mais forte e mais curta.

`aba09.py:1672-1677` (o `data-hef-em-voo`) fica, trocando só o nome da
constante. **Ela é a régua da 09-Q3 na tela**, e a decisão dela hoje a reforça.

`aba09.py:1678-1686` (a dica que não pode voltar a dizer *"Não muda nada"*)
**fica inteira, e ganha uma correção de citação**: a mensagem aponta para
`daemon/ipc_handlers.py:4823-4832`, e naquele intervalo hoje mora um docstring
sobre o «Parar» da vibração e o seletor. O `_handle_daemon_reload` real é
**`daemon/ipc_handlers.py:5431-5473`**.

**A MORDIDA:** ponha `"Reaplicar ajustes"` em `ROTULO_ATUALIZAR` e rode
`python3 aba09.py` — ele para com `SystemExit` e a frase nova. Ponha
`title="… Não muda nada."` na dica e ele para de novo, na terceira guarda.

### Passo 4 — a dica diz o que foi MEDIDO, não o que se supõe

A dica de hoje (`aba09.py:1004-1008`) promete *"reaplicar a configuração"*. **A
medição diz menos que isso**, e a conta inteira está em
`ONDA5-09-02` §1; em resumo, com o clique mandando `daemon.reload` **sem
`config_overrides`**:

* `daemon/ipc_handlers.py:5450` — `overrides` chega `{}`;
* `:5462` — `new_cfg = replace(self.daemon.config)` é uma cópia de valor igual;
* `daemon/lifecycle.py:1353` e `:1361` — os dois ramos que reaplicam mouse e
  teclado comparam `old` com `new` e **nunca disparam**;
* `lifecycle.py:1366-1370` — `keys_changed` sai `[]` no registro;
* o que ACONTECE de verdade são duas coisas: `lifecycle.py:1351-1352` derruba e
  sobe o leitor de atalhos, e `ipc_handlers.py:5472` reescreve os arquivos de
  ambiente da Steam.

A dica passa a nomear **essas duas**, e continua fechando com a releitura da
aba — que é a metade barata e a que ela quis manter no mesmo botão. **Nenhum
número de tempo entra**: os 9,5 s foram medidos no daemon DELA, e uma tela que
crava tempo de máquina alheia é a espécie de afirmação que esta casa derruba
desde 28/08. *"Leva alguns segundos"* é o que a medição sustenta em qualquer
máquina, e a frase já está escrita assim.

**E A RÉGUA DA DICA ACOMPANHA — é por isso que o arquivo de teste está no
`posse`.** `tests/unit/test_a_aba_09_sistema_fecha_as_linhas.py:355` cobra hoje
`"reaplicar" in dica.lower() and "Steam" in dica`; a segunda metade fica, a
primeira passa a cobrar a palavra que o texto novo trouxer. **`:353` não se
toca**: a frase *"Não muda nada"* é falsa e não volta.

**A MORDIDA:** tire da dica a palavra que a régua nova cobra e veja `:355`
reprovar; devolva e veja passar. **Régua que passa com a cura arrancada não mede
nada.**

### Passo 5 — a bancada, e a publicação que é ATO DELA

`python3 src/hefesto_dualsense4unix/interface/aba09.py` escreve **`mockup/`**, a
bancada — nunca a página publicada
(`src/hefesto_dualsense4unix/interface/onde.py:64-73`). Depois dele,
`mockup/09-sistema.html:1245` diz `Atualizar` e `data-hef-em-voo="Atualizando…"`.

**O publicado NÃO se toca nesta sprint**, e ele está no `nao_toca` do
cabeçalho. Quem o move é
`scripts/check_o_desenho_aprovado.py --publicar 09`, depois do olho dela — é a
`PROVA-DE-TELA-01`, a regra mais velha desta casa. **Dois pixels mudam** (o
rótulo em repouso e o da espera), e os dois são palavra literal dela; ainda
assim quem publica é ela.

Enquanto não publicar, a bancada e o publicado divergem em UMA linha: **declare
a divergência em `mockup/DIVERGENCIAS.md`**, com esta razão, ou
`scripts/check_o_desenho_aprovado.py` reprova a leva inteira.

**A MORDIDA:** rode o gerador e depois
`scripts/check_o_desenho_aprovado.py` sem declarar a divergência — ele reprova
apontando a linha 1245. Declare, e ele passa.

---

## 4. O QUE ESTA SPRINT NÃO CONSTRÓI, E POR QUÊ

**O pisca verde no fim (09-Q3, segunda metade).** A decisão de hoje é das dez
abas — *o "deu certo" é o campo piscando em VERDE por ~1,5 s, sem palavra nova
na tela* (03-Q4) — e a peça é do **piloto**, que está no `nao_toca`.

**E esta aba não precisa de endereço novo para ele.** O piloto já carimba o
elemento clicado no instante do clique (`hefesto_vivo.py:803`,
`el.setAttribute('data-hef-voo', n)`) e o reencontra no pouso
(`hefesto_vivo.py:821`, `voltouDoVoo`). O alvo do pisca é o próprio botão, e o
endereço dele já existe. **Se a frente do piloto escolher outro alvo, ela o
diz** — e aí, e só aí, esta aba ganha um `data-campo`.

**O que existe hoje no lugar do pisca**, medido: um gesto que volta sem levantar
faz o piloto depositar `FRASE_DE_SUCESSO` — *"Pronto."* — em verde
(`hefesto_vivo.py:158`, `:2254`), e sem `uniq` ele vira **tarja de rodapé**. A
decisão 03-Q4 diz *sem palavra nova na tela*; trocar a tarja pelo pisca é a
frente do piloto, nas dez abas de uma vez.

**A dívida declarada, e declarar é o que a separa de esquecimento:** enquanto o
pisca não chega, este botão confirma com a tarja verde de hoje. Ele não fica
mudo em nenhum momento desta sprint.

---

## 5. A PROVA DE TELA — obrigatória, e é sua

1. **A FOTO**, antes e depois, `--oculta`. Ela tem UMA tela.
2. **O CLIQUE**: clique o botão e mostre as três coisas — o rótulo virando
   `Atualizando…`, o rótulo voltando inteiro, e a tarja do desfecho.
3. **A MORDIDA**: `tests/unit/test_a_aba_09_sistema_fecha_as_linhas.py:662-675`
   já mede o rótulo DURANTE a espera e no pouso, num WebKit de verdade. Tire o
   `em_voo=EM_VOO_ATUALIZAR` de `aba09.py:1042` e veja a camada 3 medir o botão
   dizendo `"Atualizar"` a espera inteira.

**A JANELA NÃO NASCE NA TELA DELA.** `--oculta`, `Gtk.OffscreenWindow`,
Playwright `headless`; se for inevitável, ela nasce no `OS`.

---

## 6. NADA SE PERDEU — o que existe hoje e tem de continuar existindo

* **Os QUATRO botões da coluna do serviço**, nesta ordem: Retomar · Reiniciar o
  serviço · Atualizar · Parar o serviço. A 09-Q1 trava o número deles.
* **Os três cinzas inteiros** — a §2. O `?` dentro da `.acao`, e a régua que os
  CONTA (`aba09.py:1638-1648`): um `?` fora do invólucro vira fileira numa
  coluna de flex e as duas colunas irmãs param de acabar no mesmo `y` — o vão de
  58px que ela apontou em 31/08.
* **A dica que não diz mais *"Não muda nada"*** e a guarda literal dela
  (`aba09.py:1678-1686`). A frase é falsa e não volta.
* **O `data-hef-em-voo`**: sem ele o clique some por nove segundos e meio sem uma
  letra na tela, e o segundo clique parece o primeiro.
* **O bloco do endereço da fita**, no fim de `aba09.py` — ele reescreve a saída
  depois do `monta()`, e a âncora dele exige a classe inteira. Mexer no miolo
  sem olhá-lo já apagou o `data-campo="perfil"` do cabeçalho uma vez, em 03/09.
* **`item()` continua sem parâmetro de campo** (`aba09.py:707`). Se alguém for
  acrescentar um, `_id()` (`:192-197`) cobra que o nome esteja em
  `aba_sistema.ENDERECOS` — que é do produto e está no `nao_toca`.
* **A metade barata continua acontecendo sozinha**: `LENTO_S = 2.0`,
  `a09_sistema.py:172`. O botão nunca foi a única forma de reler a aba, e é isso
  que faz o nome dela caber num botão que faz os dois.
