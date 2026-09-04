# 03/09/2026 — A LISTA DELA: os pontos que esperam a sua palavra

> **Este arquivo nasceu de um defeito de processo, e a regra que o criou é
> dela:** *"fila combinada com ela vira arquivo no mesmo dia"*. Dez frentes
> fecharam paridade em paralelo e cada uma nomeou o que NÃO podia decidir. Se
> isso ficasse só na conversa, morreria com a sessão — foi o que aconteceu em
> 02/09, quando ela perguntou *"e a onda 5?"* e a numeração já não existia.

**Como usar:** cada ponto é uma pergunta fechada. Responder um libera trabalho
que já está desenhado e medido — nenhum deles precisa de investigação nova.

---

## O QUE MUDOU HOJE, para dar contexto às perguntas

| | antes | depois |
| --- | ---: | ---: |
| paridade com a janela GTK | 14% | **25%** (100 de 396 features) |
| cor cravada nas páginas | 360 pontos | **0** |
| chips de máscara na aba Jogar | 6 (dois cartões) | **12** (os quatro) |
| lugares de controle endereçados | p1 e p2 em 3 abas | **p1..p4 nas sete** |
| portões | 30 | **36, todos verdes** |

---

## §1 — AS TRÊS PÁGINAS QUE ESPERAM O SEU OK PARA PUBLICAR

O `--publicar-enderecos` levou ao produto tudo o que **não muda um pixel** e
RECUSOU estas três, porque nelas o desenho mudou. Publicar é ato seu.

| aba | o que muda | por que vale |
| --- | --- | --- |
| **03-gatilhos** | 16 rótulos + `Linear médio` em 8 campos + 1 legenda | a desambiguação que **você** pediu em 07/08. A largura não muda: `Arco de flecha (Bow)` tem os mesmos 20 caracteres de `Arma semi-automática`, e a coluna mediu 453px de 477 — os mesmos 24px de folga |
| **04-iluminacao** | ver §2, ponto 1 | depende da sua resposta sobre o trilho |
| **08-conexoes** | ver §2, ponto 8 | depende da sua resposta sobre o selo |

**A 03 é a mais barata das três:** a sua tela JÁ mostra o texto certo, porque o
pacote pousa as listas a cada tique. Publicar só alinha o arquivo.

    scripts/check_o_desenho_aprovado.py --publicar 03

---

## §2 — AS PERGUNTAS, na ordem do que elas destravam

### 1. O trilho de brilho (Iluminação) — **a que destrava mais**

O trilho já é DESENHADO como slider (tem um knob de 12px na ponta) e **não faz
nada**: você vê 100%, arrasta, e nada acontece.

A pergunta que só você responde: **mexer no brilho grava o perfil NA HORA, ou
espera o "Salvar Perfil"?**

Por que é sua: a janela antiga guarda a intenção num rascunho, e a interface
nova **não tem rascunho** — decisão sua de 01/09: *"clicar na cor já deveria
aplicar a cor no controle"*. Sem gravar, o trilho volta sozinho ao valor velho
no tique seguinte, e o gesto vira mais um botão que aceita o toque e não age.

### 2. A prioridade dos perfis — o único campo sem caminho de escrita

A prioridade decide qual perfil vence quando dois servem ao mesmo tempo, e é o
**único campo do editor que a interface nova não sabe escrever**. Você já disse
como quer, em 27/08: *"prioridade é slicer"*. Falta aprovar o pixel.

### 3. A vibração: dois botões que o produto NOMEIA e não existem

O produto tem uma frase que manda você clicar em **"Deixar o jogo controlar a
vibração"** — e o botão não existe em aba nenhuma. A instrução é impossível de
seguir. O mesmo vale para "Aplicar" (fixar a vibração num valor).

E a barra "Personalizado" **recusa o clique em silêncio** — sem um controle
arrastável não há ajuste fino entre 0 e 200%.

### 4. A confirmação antes de apagar — o mecanismo JÁ EXISTE

Cinco gestos destrutivos da aba Sistema não confirmam nada. O fato novo: **a
aba Lançadores já confirma, em produção, com DOIS CLIQUES** — o primeiro arma e
troca o botão, o segundo só vale com o valor que o cartão armado carrega. Sem
diálogo, sem primitiva nova.

Então não falta mecanismo. Falta o **desenho** dos botões da Sistema quando
armados.

### 5. O botão "Ligar o Hefesto"

Com o serviço parado, a interface nova não tem como religá-lo — só o terminal.
O motor existe (`_systemctl("start")`); falta o botão.

### 6. O selo do microfone pode ganhar COR? (Controles)

Hoje a palavra muda ("MUDO") e a cor não: o selo do P1 fica verde com o
microfone calado. Um elemento aceita UM alvo de pintura, então dar cor exige um
`<span>` aninhado ou uma regra de CSS nova — zero pixel de diferença, mas é
desenho.

### 7. O interruptor de Navegação é dos DOIS, e isso tem consequência

Decisão sua de 27/08: o "Status do Modo" liga mouse **e** teclado juntos. A
consequência medida: partindo de *mouse desligado · teclado ligado*, dois
cliques deixam o **teclado desligado** ao fim. A janela antiga tem dois
interruptores independentes. Desacoplar é palavra sua.

### 8. Conexões: o kernel diz "Câmera", a sua lista diz "Webcam"

São a mesma coisa? A resposta permite a tela parar de perguntar o que o kernel
já respondeu — mas a linha precisa de uma marca `(lido)` e de um botão
"Corrigir", que são caixa nova.

### 9. A bateria desconhecida: `—` ou `— %`?

A janela antiga escreve `— %`. Eu escrevi `—` seco, para casar com os vizinhos
do mesmo cartão e com a sua regra de *"campo sem informação não mostra nada"*.
Se preferir a paridade literal, é uma linha.

### 10. O "Estilo de Jogo" está desenhado e não tem motor

Dezesseis opções, o campo mais aceso do painel, e nada atrás. Hoje ele recusa
dizendo — antes, aceitava a escolha e não gravava. Construir o motor é
trabalho; decidir se vale é seu.

---

## §3 — O QUE **NÃO** ESPERA VOCÊ, e está na fila

Nada aqui precisa de decisão — é trabalho medido, com endereço:

* **121 features ainda faltam no HTML** e **112 estão diferentes**. As piores
  abas agora são a **08-conexoes (14%)** e a **01-jogar (17%)**;
* **`rumble.passthrough` e `mic.button_toggles_system` por controle** exigem
  construir a trava por unidade primeiro — a de hoje é uma só para o daemon;
* **o mecanismo das 28 cores tem cinco cópias** (`aba01`, `aba04`, `aba05`,
  `aba06`, `aba08`) e pede um dono em `monta.py`. Dívida nomeada, não paga.

---

## §4 — O QUE NINGUÉM MEDIU, e só você pode medir

**Um jogo aceita dois vpads com máscaras diferentes ao mesmo tempo?** O
`external_mask` escreve isso desde 15/08 e a frase dele é *"não prometa que
funciona"*. O registro guarda a escolha; se o jogo embaralhar os jogadores, isso
vira um aviso na tela, não um defeito a caçar.

O ensaio, com a mesa cheia: quatro controles, um jogo com Steam Input aberto, P1
em `dualsense` e P2 em `xbox`. Então olhar, nesta ordem: (1) os quatro jogadores
continuam existindo no jogo; (2) os prompts de cada um saem na máscara dele; (3)
o rumble chega nos quatro.
