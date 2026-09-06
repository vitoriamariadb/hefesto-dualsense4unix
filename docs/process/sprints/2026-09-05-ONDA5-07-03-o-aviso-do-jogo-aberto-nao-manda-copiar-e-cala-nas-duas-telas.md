---
sprint: ONDA5-07-03
estado: aberta
decisoes: [07-Q2, 07-Q3]
posse:
  L3:
    - src/hefesto_dualsense4unix/app/actions/home_actions.py
    - src/hefesto_dualsense4unix/app/actions/jogar/painel.py
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - src/hefesto_dualsense4unix/interface/jogar_vivo.py
    - tests/unit/test_wrapper_banner.py
    - tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py
nao_toca:
  - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
  - src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py
  - src/hefesto_dualsense4unix/interface/pacotes/rodape.py
  - src/hefesto_dualsense4unix/integrations/steam_launch_options.py
  - src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
depois_de: [MIGRA-JOGAR-01, MIGRA-JOGAR-11, ONDA-JOGAR-01, ONDA-SISTEMA-01, ONDA2-01-JOGAR-01, ONDA4-S10-O-TRANSPORTE-01, ONDA5-07-02, ONDA5-01-01, ONDA5-01-02]
---

# ONDA5-07-03 · DEFEITO — o aviso do jogo aberto não manda copiar, e cala nas duas telas

> **As decisões dela, verbatim (05/09/2026):**
>
> **07-Q2** — a frase manda a um botão que não existe: *"O produto aplica ela"*
>
> **07-Q3** — as duas recusas calam onde: *"As duas recusas calam tudo"*

Duas decisões, **um aviso**. As duas mordem a mesma função pura
(`home_actions.wrapper_banner_text`) e as mesmas duas telas, e separá-las em
duas sprints seria duas frentes no mesmo arquivo — conflito garantido.

**A regra que a primeira deixa:** *o Hefesto não explica a própria falha, ele a
conserta.* Eu ofereci a ela três redações melhores para uma frase que manda ela
trabalhar à mão; ela respondeu que o trabalho é do produto.

---

## 1. O QUE SE MEDIU — uma frase, um endereço errado, duas telas

```python
WRAPPER_MISSING_TEXT = (
    "O jogo está rodando sem o hefesto-launch — controles podem duplicar. "
    "Copie as opções na aba Sistema."
)
```
— `src/hefesto_dualsense4unix/app/actions/home_actions.py:559-562`

**A aba Sistema da interface nova não copia nada.** Está medido e escrito no
produto (`interface/pacotes/a07_lancadores.py:559-563`), e confere hoje:
`grep -c Copiar src/hefesto_dualsense4unix/interface/paginas/09-sistema.html`
devolve **0**, contra 13 `data-gesto` na mesma página. Na janela estável o
endereço está certo; na nova, ele manda a lugar nenhum.

E a frase tem **quatro leitores**, os quatro pela mesma função:

| tela | quem chama | linha |
| --- | --- | --- |
| Início (janela estável) | `home_actions.py` | `:2688` |
| Status (janela estável) | `status_actions.py` | `:3076` |
| coluna Atenção da aba Jogar (interface nova) | `app/actions/jogar/painel.py` | `:649` |
| cartão da Steam da aba Lançadores | `interface/pacotes/a07_lancadores.py:600` | — |

**A segunda metade: o silêncio existe num lugar só.**

Ela tem dois jeitos de dizer *"eu sei, deixa assim"*, e os dois já gravam em
disco. O cartão da aba Lançadores respeita os dois desde 04/09, e a conta está
escrita, pública, com nome:

```python
def calados(lida: desenho.Leitura | None) -> set[str]:
    ...
    return ({a for a, _ in lida.dispensados} | {a for a, _ in lida.recusados})
```
— `src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py:609-624`

A coluna Atenção da aba Jogar **não consulta lista nenhuma**:
`painel.AVISOS_DA_TELA` (`:645-652`) é uma tupla de funções puras do `state`, e
`avisos_do_estado` (`:655`) chama as seis sem mais nada. O docstring da
`calados` já nomeia o buraco e diz que ele é de outra posse
(`a07_lancadores.py:611-617`) — **esta sprint é essa posse.**

O resultado, na tela dela: ela clica em «Não perguntar para este jogo», o aviso
some do cartão, e continua vivo na aba Jogar toda vez que o jogo abre. **Um
aviso que sobrevive à resposta dela ensina que o botão não obedece.**

---

## 2. O TRABALHO, EM PASSOS

### Passo 1 — a frase para de mandar copiar e passa a dizer o que o produto faz

`WRAPPER_MISSING_TEXT` (`home_actions.py:559-562`) perde a segunda oração e
ganha a promessa que o produto de fato cumpre. A promessa **não é redação nova**:
ela já existe, escrita pelo dono do reparo, para o caso exato de jogo aberto —

```python
        return (
            "Vou repor assim que o jogo e a Steam fecharem — não mexo agora "
            "porque fechar a Steam com um jogo aberto mata o jogo."
        )
```
— `src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py:436-439`

O aviso acende exatamente quando há **jogo aberto** (`wrapper_banner_text` só
responde ao `False` literal de `gamepad_emulation.wrapper_used`,
`home_actions.py:565-586`), então é este o ramo, sempre. A frase fica com o
fato e a promessa, e **não nomeia lugar nenhum** — é a única redação certa nas
duas janelas, e é o que a decisão 07-Q2 pede: quem age é o produto.

**CUIDADO COM A REDAÇÃO DE 04/09, que está anunciada dentro do produto.** O
docstring de `aviso_do_jogo_aberto` (`a07_lancadores.py:559-566`) manda a frase
*"parar de nomear lugar"* e ficar só no fato — era a minha recomendação de
ontem, e **a palavra dela de hoje vai além**: só o fato deixa a tela dizendo o
que está errado sem dizer o que o produto faz a respeito. *"O produto aplica
ela"* é fato **mais** promessa.

**Aquele arquivo não é desta posse** — ele é da `ONDA5-07-01`. **RELATE a linha
exata na entrega**, com a frase nova, para que o docstring pare de apontar para
uma decisão morta. Editá-lo aqui some no merge.

**Não copie o texto do dono para cá.** Uma segunda cópia da mesma promessa
envelhece calada no dia em que a sentinela mudar de compromisso. Se a frase da
sentinela puder ser reusada, reuse; se não puder, escreva a razão de a
constante existir.

**A MORDIDA:** `test_texto_e_pro_leigo_e_aponta_o_caminho`
(`tests/unit/test_wrapper_banner.py:81-87`) reprova na linha `:84`, que exige o
literal `"aba Sistema"`. Reescreva o caso — o nome dele promete "aponta o
caminho", e o caminho agora é o produto, não ela. A guarda de jargão (`:85-87`)
**fica intacta**: `env`, `vdf`, `wrapper_used` e `dedup` continuam proibidos na
frase.

### Passo 2 — quem cumpre a promessa, e por que esta sprint vem DEPOIS da 07-02

Uma promessa sem dono é o defeito mais caro desta casa. Quem repõe quando a
Steam fecha é a vigia, e ela **só nasce de um gesto dela** — nas duas janelas:

* na estável, `_carona_armar_vigia` (`app/actions/carona_do_wrapper.py:417`),
  armada pela carona de um gesto de perfil;
* na nova, `VIGIA_DA_STEAM.armar()` (`interface/pacotes/a07_lancadores.py:1157`
  e `:1482`), armada pelo «Consertar».

Na interface nova, hoje, **três dos quatro botões do rodapé não pegam a carona**
— é a `ONDA5-07-02`. Enquanto ela não fechar, a frase do Passo 1 promete um
reparo que só acontece se ela abrir a aba Lançadores e clicar. Por isso o
`depois_de`.

**Confira antes de entregar**, e é uma leitura de duas linhas: com a 07-02 no
lugar, um «Salvar» no rodapé arma a vigia. Se não armar, **a frase do Passo 1
está mentindo** e a entrega é relatar isso, não publicar a frase.

### Passo 3 — o filtro do silêncio mora na função dona, e cobre TODOS os chamadores

`avisos_do_estado` (`app/actions/jogar/painel.py:655`) ganha um parâmetro
nomeado — os appids sobre os quais ela já respondeu — e **filtra o aviso do selo
`JOGO`** quando o jogo em foco está entre eles. O appid sai de
`launch_wrapper_dialog.extract_steam_appid` (`:77`), que é o dono da tradução do
`window_detect_last_class` e a mesma função que o cartão da aba Lançadores usa
(`a07_lancadores.py:525-541`) — **importada dentro da função**, como lá, porque
o módulo dela carrega Gtk no topo.

**O padrão é `frozenset()` vazio**, e isso não é comodidade: é o que faz os
outros chamadores continuarem exatamente como estão até alguém decidir o
contrário.

**Este passo é o que faz a cura cobrir todos os chamadores de uma vez** — a
regra que esta casa pagou duas vezes em 05/09. Curar dentro de `a01_jogar._avisos`
deixaria a bancada (`interface/jogar_vivo.py:770` e `:844`) medindo outra coisa
que não o produto, que é como três instrumentos falsos nasceram em 04/09.

**A MORDIDA:** com o appid do jogo em foco na lista, `avisos_do_estado` devolve
cinco avisos em vez de seis; arranque o filtro e a régua nova reprova. E o caso
irmão, que é o que impede a cura de calar demais: **com a lista vazia, os seis
continuam** — sem ele, um filtro invertido passaria verde.

### Passo 4 — a aba Jogar entrega a lista, e o disco não entra no tique

`_avisos` (`interface/pacotes/a01_jogar.py:585`) passa a levar a lista na
chamada de `:618`. A lista sai de onde ela já é lida:

```python
a07_lancadores.calados(a07_lancadores.VIGIA.agora())
```

`VIGIA.agora()` **nunca bloqueia e nunca levanta** — devolve `None` na primeira
volta e dispara a releitura numa thread quando o dado passa do TTL
(`a07_lancadores.py:217-222`), e `calados(None)` devolve o conjunto vazio
(`:622-623`). Na primeira volta a coluna mostra o aviso e na seguinte ele some;
meio segundo, e é o preço de não pôr disco na thread da janela.

**O CUSTO ESTÁ MEDIDO, e declare-o no docstring:** a aba Jogar passa a esquentar
a vigia da aba Lançadores mesmo que ela nunca abra a 07. São
`censo_do_wrapper()` 26 ms e `jogos_instalados()` 12 ms a cada `TTL_S = 20.0`
(`a07_lancadores.py:144-146` e `:170`), **numa thread de fundo**. O `levantar_censo`
de 13,5 s não entra — ele só sai do lugar quando ela clica em «Ver o que impede».

**A MORDIDA:** troque a `VIGIA` por um dublê que devolva uma `Leitura` com o
appid do jogo em foco nos `dispensados`, e a coluna perde o aviso do selo
`JOGO`; arranque a passagem da lista em `:618` e a régua reprova. O arquivo de
régua já sabe trocar o painel inteiro
(`tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py:273-305`) — o caso
novo entra ao lado, e **leia os dois casos vizinhos antes de escrever o seu**.

### Passo 5 — a bancada acompanha, em duas linhas

`interface/jogar_vivo.py:770` e `:844` chamam `avisos_do_estado` sem a lista.
Passe a mesma que a aba passa, ou **declare por escrito** que a bancada mede sem
o silêncio e por quê. As duas respostas são aceitáveis; o que não é aceitável é
a bancada e o produto discordarem sem ninguém saber — foi assim que um dublê
mais frouxo que a função real envenenou outro arquivo por ordem de teste, em
04/09.

---

## 3. O QUE ESTA SPRINT **NÃO** DECIDE

1. **O banner das abas Início e Status da janela estável.** `home_actions.py:2688`
   e `status_actions.py:3076` chamam `wrapper_banner_text` e não consultam lista
   nenhuma. A decisão 07-Q3 fala das duas telas da interface nova; estender o
   silêncio à janela velha é uma linha em cada arquivo e **não foi decidido**.
   Declarado, medido, não fechado — a janela estável tem o próprio diálogo de
   dispensa (`app/actions/launch_wrapper_dialog.py:213`), e juntar as duas
   políticas sem medir é como se ganha uma terceira.
2. **Desfazer continua onde está.** «Voltar a perguntar» e «Voltar a usar» são da
   aba Lançadores e não se movem. Sem eles o silêncio seria um caminho só de ida,
   e é por isso que a decisão dela pôde ser "as duas calam tudo".
3. **A ordem dos seis avisos.** `AVISOS_DA_TELA` (`painel.py:645-652`) fica na
   ordem em que está; um filtro não reordena nada.

---

## 4. NADA SE PERDEU

* **Só o `False` literal acende o aviso.** `None` ou chave ausente = sem jogo
  aberto, ou daemon velho — **nunca alarme falso por payload incompleto**
  (`home_actions.py:565-586`), com os casos em
  `tests/unit/test_wrapper_banner.py:80-84`.
* **Sem appid, o aviso continua.** É decisão escrita
  (`a07_lancadores.py:592-598`): `wrapper_used is False` é o daemon afirmando
  que HÁ jogo aberto sem o atalho. Calar porque a `window_detect_last_class`
  ainda não casou trocaria um aviso verdadeiro por silêncio. **O filtro do Passo
  3 só age quando há appid.**
* **Uma fonte que levanta não derruba a coluna** — o `except` largo de
  `avisos_do_estado` vira um aviso com selo `ERRO`
  (`painel.py:664-678`). O parâmetro novo não pode passar na frente dele: uma
  lista que não veio é lista vazia, nunca uma coluna a menos.
* **As seis fontes continuam seis** — `painel.AVISOS_DA_TELA` (`:645-652`), com
  a régua que exige que a coluna venha de lá
  (`tests/unit/test_a_aba01_le_o_estado_em_vez_de_cravar.py:273-286`).
* **A guarda de jargão da frase** — `env`, `vdf`, `wrapper_used`, `dedup` fora do
  texto (`tests/unit/test_wrapper_banner.py:85-87`). O estudo mandou esconder
  isso do leigo, e a decisão continua valendo.
* **As duas listas continuam sendo DUAS.** `jogos_sem_wrapper.txt` diz *"não
  ponha o atalho neste jogo"* e o dispensado diz *"não me lembre deste jogo"* —
  juntá-las num arquivo só apagaria a diferença que faz ela entender o que
  pediu (`interface/desenho_dos_lancadores.py:762-765`). O que esta sprint junta
  é o **efeito** na tela, não os arquivos.

---

## A PROVA DE TELA

Duas coisas mudam para o olho dela, e as duas pedem a `PROVA-DE-TELA-01`:

1. **A frase**, nas duas janelas. Foto antes e depois.
2. **O silêncio.** Clique em «Não perguntar para este jogo» na aba Lançadores,
   vá à aba Jogar, e mostre a coluna Atenção **sem** a linha do selo `JOGO` —
   com a contagem do canto acompanhando (`texto_da_conta`, `painel.py:681`).
   Depois clique em «Voltar a perguntar» e mostre o aviso de volta. **O desfazer
   faz parte da prova:** um silêncio só de ida é pior que nenhum.

**A janela não nasce na tela dela.** `--oculta` sempre — ela tem UMA tela.
