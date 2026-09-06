---
sprint: ONDA5-10-03
estado: absorvida
decisoes: 10-Q6
posse:
  10-Q6:
    - docs/data/paridade-gtk-html.csv
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba10.py
  - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/app/actions/profiles_actions.py
depois_de: [ONDA1-X-OS-FATOS-01, ONDA4-S10-O-TRANSPORTE-01, ONDA5-04-01]
---

> **ABSORVIDA — 06/09/2026.** Esta sprint tinha DUAS metades e elas foram por
> caminhos diferentes. **A de tela fechou na `PERFIL-MODO-01`** (ONDA D): as duas
> frases do modo **não nascem** no quadro do perfil, por decisão dela (`10-Q6`),
> e a régua que o garante **não digita a frase** — lê do dono. O mecanismo ficou,
> que era o ponto inteiro.
>
> **A metade que sobra é o CSV**, que é a única coisa na `posse:` deste arquivo,
> e ela vive agora na **`PARIDADE-REMEDIR-01`** — a sprint que remede as linhas
> `FALTA` envelhecidas por esta leva, com estas duas na lista de partida.
> Relatório da metade fechada: `docs/process/agentes/2026-09-06/PERFIL-MODO-01.md`.

> **06/09/2026, costura da ONDA A — O PASSO 3 FECHOU; a sprint continua
> `aberta`.** As duas linhas do CSV (*O preço da máscara* e *O aviso de rádio
> frágil*) ganharam a nota datada da 10-Q6 e deixaram de ser dívida de TEXTO
> para ser dívida de MECANISMO. Quem fez foi o coordenador, porque o CSV tem um
> dono por leva e nesta leva é ele.
>
> **Os Passos 1 e 2 não têm o que fazer ainda**, e a própria sprint diz por quê
> (§3): *o quadro Modo NÃO EXISTE na aba 10*. Eles fecham junto com a
> **PERFIL-MODO-01** (onda D), que é quem constrói o quadro — e ela nasce com a
> ordem de não construir as duas frases, escrita no §3 dela.

# ONDA5-10-03 · DEFEITO — as duas frases do Modo somem, e o que fica no lugar é mecanismo

> **A pergunta, 10-Q6:** *"Quando o quadro de Modo do perfil nascer nesta aba,
> onde ficam as duas frases que a janela antiga tem — o preço do Xbox (o que ele
> não faz) e o aviso de que o rádio pode não aguentar a Conexão Nativa?"*
>
> **Ela não marcou nenhuma das três opções. Digitou:**
>
> ***"É pra tudo funcionar independente do modo, mascarou forma de conexão.
> Essas frases devem sumir."***
>
> **E o esclarecimento de hoje MANDA:** as duas frases somem; o princípio é que
> **o Hefesto cria mecanismo em vez de descrever limitação**.

Eu ofereci três lugares para as frases morarem. **A pergunta estava errada** —
é a terceira vez em três semanas que ela recusa as três opções e a hipótese
certa não é que falta uma quarta.

**O PRINCÍPIO TEM DONO, E NÃO É ESTA SPRINT.** A mesma palavra dela, no mesmo
dia, produziu
[A MÁSCARA NÃO CUSTA FEATURE](../2026-09-05-A-MASCARA-NAO-CUSTA-FEATURE-o-principio-e-o-que-ele-cobra.md),
que carrega o enunciado e **o inventário medido do que a máscara Xbox custa
hoje**. Leia-o antes deste. Aqui está só o que a decisão 10-Q6 cobra da **aba
10** — e nada é redigitado de lá.

---

## 1. O QUE ELA MEDIU SEM ABRIR O CÓDIGO

As duas frases descrevem o mesmo tipo de coisa: **uma escolha da usuária que
custa uma capacidade do aparelho**.

**O preço do Xbox** — `app/actions/home_actions.py:377-382`:

> *"Nesta máscara o jogo não recebe giroscópio, acelerômetro nem touchpad — o
> controle de Xbox não tem esses três, então não há onde eles caberem. Vibração,
> microfone e alto-falante continuam funcionando. Escolha DualSense se o jogo usa
> mira por movimento ou o touchpad como botão."*

**O aviso do rádio frágil** — `home_actions.texto_do_radio_fragil:589-610`, que a
aba Perfis já consome por `profiles_actions.frase_do_radio_fragil_no_modo:162-186`.

**A frase dela nomeia as duas de uma vez:** *"mascarou forma de conexão"*. A
máscara é escolha de como o JOGO vê o controle; a Conexão Nativa é escolha de
como o CONTROLE fala com a máquina. As duas frases dizem *"você escolheu, e por
isso perdeu"* — e é isso que ela recusa.

---

## 2. ELA JÁ TINHA DITO ISSO UMA VEZ, E O PRODUTO OBEDECEU

Não é um princípio novo desta madrugada. Em **04/09/2026** ela respondeu à mesma
espécie de recomendação — eu havia proposto a saída barata, virar leitura e pôr
um selo — com estas palavras, que estão no cabeçalho do módulo que nasceu delas:

> *"ele tem que funcionar de verdade. ambos independente do modo e da mascara."*
> — `src/hefesto_dualsense4unix/core/virtual_motion.py:1-7`

E o produto construiu o mecanismo: **dois braços**, porque medir mostrou que
nenhum sozinho servia — o do report (`core/virtual_motion.py`, que zera os seis
bytes do sensor desligado) e o do evdev (`daemon/sensor_hub.py`, o `EVIOCGRAB` no
nó "Motion Sensors"). O módulo escreve inclusive **o que nenhum dos dois
alcança** (`virtual_motion.py:58-62`), que é a forma honesta de descrever
limitação: depois de tentar.

**A decisão de hoje é a mesma decisão, aplicada às frases que sobraram.**

---

## 3. O QUE SE MEDIU NA ABA 10 — o quadro Modo NÃO EXISTE, e isso é a sorte desta sprint

```
grep -rn "ProfileModeConfig\|with_mode\|mode_kind" src/hefesto_dualsense4unix/interface/
→ zero ocorrências
```

**Nenhuma linha desta interface escreve a seção `mode` do perfil.** O valor do
disco sobrevive só por herança. Na janela GTK ele existe e tem quatro botões —
`profiles_actions._MODE_KIND_ITEMS:147-155`: *Não mexer no modo · Controlar o PC
· Jogar pelo Hefesto · Conexão Nativa (Sony)*.

**Quer dizer que não há nada a APAGAR na aba 10** — há uma coisa a **não
construir**. É por isso que esta sprint não tem passo de código na `aba10.py` nem
no `a10_perfis.py`, e é por isso que ela é curta.

---

## 4. O TRABALHO, EM TRÊS PASSOS

### Passo 1 — o quadro Modo nasce SEM as duas frases, e a razão fica escrita nele

Quando a linha *"A seção 'Modo' do perfil (o que ATIVAR este perfil liga)"* sair
da fila, ela entrega os quatro botões e **nada mais**. Nem linha condicional para
o rádio, nem dica de hover com o preço do Xbox — que foram as duas coisas que eu
recomendei em 04/09 e que ela derrubou hoje.

O comentário que nasce junto com o quadro é a decisão datada, e ele tem de dizer
as duas metades:

* **as frases somem** — decisão dela, 05/09/2026, 10-Q6;
* **o que entra no lugar** — nada, até que exista mecanismo. Uma linha vazia
  reservada "para quando a frase voltar" seria a frase esperando a vez.

**A MORDIDA:** quando o quadro existir, `test_o_quadro_do_modo_nao_descreve_o_que_perde`
(novo) varre o HTML gerado da aba 10 atrás de `TEXTO_CUSTO_MASCARA_XBOX` e do
retorno de `texto_do_radio_fragil`, e reprova se qualquer uma das duas aparecer.
**Ela LÊ as constantes de `home_actions`** — digitar o texto aqui a faria
desligar sozinha no dia em que a frase mudasse uma vírgula.

### Passo 2 — o que fica no lugar das frases, e quem é dono disso

**O inventário das parcelas é do documento do princípio, e ele já as separou.**
Esta sprint não o repete — repetir seria o segundo dono da mesma medição, que é
o defeito que esta casa nomeia toda semana.

O que a aba 10 acrescenta ao inventário é **uma parcela só**, e é a que a
pergunta 10-Q6 trouxe: **o aviso do rádio frágil**, que não é da máscara — é do
transporte. Ela o nomeou na mesma frase (*"mascarou forma de conexão"*), e o
princípio o alcança pelo mesmo corolário.

**Então esta sprint NÃO promete mecanismo nenhum.** Ela promete que **a tela não
descreve a limitação enquanto o mecanismo não existe** — que é o que ela pediu —
e manda a parcela do rádio para o inventário que tem dono.

**A MORDIDA:** não há. Este passo é declaração, e declaração não tem régua. **É
por isso que ele é um passo separado** — misturá-lo com o Passo 1 faria a sprint
parecer entregar mecanismo que não entrega.

### Passo 3 — as linhas do CSV que esta decisão fecha, e o que elas passam a dizer

Duas linhas da paridade morrem como dívida de TEXTO e renascem como dívida de
MECANISMO:

* *O preço da máscara (o que o Xbox custa)*
* *O aviso de rádio frágil quando ela escolhe o Modo Nativo*

**Não as apague.** A regra desta casa separa os dois casos, e este é o primeiro:
apagar faria a próxima pessoa reabrir a pergunta em três semanas. Elas ganham a
nota datada — *"decisão dela, 05/09/2026: a frase não entra na aba 10; o que
falta é mecanismo, não texto"*.

**O CSV tem UM dono por leva.** Liste as duas linhas na entrega em vez de as
editar, se a leva tiver dono declarado para ele.

---

## 5. O QUE ESTA SPRINT **NÃO** DECIDE

1. **As duas frases continuam vivas na janela GTK e na aba 01.** Medido, os
   leitores são cinco fora do dono: `profiles_actions.py:28-29`, `:271`,
   `:1533-1535`; `app/actions/jogar/painel.py:648`;
   `app/widgets/painel_no_jogo.py:452`; `app/widgets/controller_card.py:1439`.
   **Matá-las lá é outra sprint, e precisa da palavra dela sobre aquelas telas** —
   a pergunta que ela respondeu era sobre o quadro Modo da aba 10, e uma decisão
   sobre onde uma frase mora não se estende sozinha a telas que ela não viu.
2. **A aba 10 não importa nenhuma das duas hoje** — `grep` em
   `interface/pacotes/a10_perfis.py` e em `interface/aba10.py` dá zero para
   `texto_do_custo_da_mascara` e `texto_do_radio_fragil`. **Nada regride** com o
   Passo 1: ele impede uma importação que ainda não aconteceu.
3. **O mecanismo do touchpad e o do movimento sob XInput.** Medidos como
   ausentes, declarados no Passo 2, não prometidos aqui.

---

## 6. NADA SE PERDEU

* **O aviso de rádio frágil continua chegando por onde já chega.** Ele tem UM
  dono (`home_actions.texto_do_radio_fragil:589`), extraído em 25/08 justamente
  para não ser escrito duas vezes, e a aba 01 o mostra
  (`app/actions/jogar/painel.py:648`). O que esta decisão recusa é ele nascer uma
  terceira vez na aba 10.
* **A seção `mode` do perfil continua intacta no disco.** Ninguém desta interface
  escreve nela hoje, e este documento não muda isso: o valor sobrevive por
  herança, como sobrevive desde sempre.
* **Os quatro rótulos do Modo continuam sendo os dela** —
  `_MODE_KIND_ITEMS:147-155`, com o "Conexão Nativa (Sony)" que ela renomeou em
  06/08/2026. Quando o quadro nascer na aba 10, os rótulos vêm de lá; escrever
  outros seria o segundo dono da mesma palavra.
* **`core/virtual_motion.py` e `daemon/sensor_hub.py` ficam como estão.** Esta
  sprint os CITA como precedente; não os toca.

---

## A PROVA DE TELA

**Esta sprint não muda um pixel hoje** — o quadro Modo não existe. A prova de
tela é do dia em que ele nascer, e ela é a régua do Passo 1: o HTML da aba 10 não
contém nenhuma das duas frases.

Enquanto isso, o que esta sprint entrega é a frase que sobra de tudo, e ela vale
para as dez abas:

> **O Hefesto não descreve a limitação. Ele constrói o mecanismo que a remove —
> e, enquanto não constrói, cala.**
