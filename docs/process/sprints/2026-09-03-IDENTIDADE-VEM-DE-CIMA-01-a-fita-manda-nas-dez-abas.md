# IDENTIDADE-VEM-DE-CIMA-01 — a fita manda nas dez abas

> **A lei, e ela é dela (03/09/2026):**
>
> *"se no topo tá mostrando controle white player 1, então cada aba vai usar os
> controles lá de cima. Não mistura com a info dos mockups. Cada feature faz
> referencia ao controle conectado. Por isso temos o mapa pra servir como <!-- noqa-acento: citação literal dela -->
> variável de identificação"*

## 0. O QUE ELA VIU, e é o que originou a lei

Com os dois controles dela na mesa, na mesma tela, com três centímetros entre
uma coisa e outra:

```
fita do topo (lida do APARELHO)   P1 · White · USB       P2 · Galactic Purple · BT
cabeçalho do card (do MOCKUP)     Cosmic Red · USB       P2 · Starlight Blue · BT
```

Nenhuma das duas cores do card é do controle dela. A fita foi consertada pela
ONDA-CONEXOES-11 e **ninguém percebeu que as dez abas abaixo dela continuavam
mostrando o controle do desenho.**

Palavra dela sobre o que a cor deve ser: *"se identificou o controle como modelo
White a cor do card em volta tem que ser branco. Temos isso no mapa."* E sobre o
que o número do jogador é: *"O p1 ou p2 reflete o player do jogador."* São
coisas diferentes: a COR é do aparelho, o NÚMERO é da posição na mesa.

## 1. O TAMANHO, medido em 03/09/2026

| | publicado | bancada |
| --- | --- | --- |
| valores de identidade congelados | **150** | **134** |

A pior é a `04-iluminacao` (55 publicados) — numa aba cujo assunto inteiro é a
cor do controle.

## 2. A RÉGUA QUE JÁ HAVIA ESTAVA CEGA PARA ISTO

`interface/regua_do_mockup.py` mede bem, mas só enumera elementos que **já têm
endereço**: `ATRIBUTOS_DE_CAMPO = ("data-campo", "data-papel", "data-hef")`. Um
valor congelado **sem endereço nenhum** não é um campo para ela — não aparece
como `MOCKUP`, não aparece como `INDECIDÍVEL`, não é contado.

Ela dizia `283 PRODUTO · 53 MOCKUP · 0 INDECIDÍVEL` no mesmo dia em que havia
150 congelados fora do alcance dela. **As duas réguas não se sobrepõem:** uma
mede o que tem endereço, a outra acha o que não tem. É a regra desta casa, e ela
já foi paga três vezes — duas réguas independentes é o que revela.

A régua nova: **`scripts/check_identidade_vem_de_cima.py`**.

    scripts/check_identidade_vem_de_cima.py                    # o publicado
    scripts/check_identidade_vem_de_cima.py --bancada          # `mockup/`
    scripts/check_identidade_vem_de_cima.py --bancada --aba 04 # só a sua aba

**A mordida dela está provada:** dar UM endereço ao chip do P1 na `09-sistema`
derruba a conta de 6 para 3; arrancá-lo devolve as 3. Um endereço cura o
`--plastico`, o nome na dica e o nome no texto — que é o formato de um conserto
de verdade.

E ela nasceu com um defeito que a própria mordida pegou, antes de qualquer
agente sair: a primeira versão localizava a tag mais próxima à esquerda, e por
isso **acusava texto já curado** que vinha depois de um `</span>`. Acusar quem
está certo é o pior defeito de uma régua — ela manda consertar o que funciona.
Hoje ela percorre a PILHA de ancestrais com um parser.

## 3. O CONTRATO

1. **A fita do topo é a única fonte de identidade.** Cor do plástico, transporte
   e modelo vêm do aparelho, pela leitura que a fita já faz.
2. **O número do jogador é ESTRUTURA**, não identidade. `P1`…`P4` são a posição
   na mesa e continuam no desenho. A régua não os acusa, de propósito.
3. **A cor se mostra como COR**, não como palavra escrita à mão. A borda do card
   já é `border:2px solid var(--plastico)` — o que falta é o `--plastico` ser
   escrito pelo pacote com o que se leu, em vez de vir cravado do mockup.
4. **O mapa é o dono do nome e do tom.** `docs/data/cores-do-dualsense.csv` tem
   28 modelos e 10 zonas. Ninguém digita um `#hex` de plástico em página nenhuma.

## 4. COMO SE CONSERTA UMA ABA

1. Dar ENDEREÇO ao elemento no gerador (o gerador da aba (`src/hefesto_dualsense4unix/interface/aba04.py` e os nove irmãos)):
   `data-campo` + `data-hef-alvo` (`cor`, `texto`, `classe`…).
2. O pacote da aba (`interface/pacotes/aNN_*.py`) passa a ESCREVER aquele campo
   com o que leu do daemon.
3. Rodar o gerador: sai o `mockup/NN-*.html` novo.
4. Declarar a divergência em `mockup/DIVERGENCIAS.md`.
5. **NÃO PUBLICAR.** Publicar é ato dela. A régua com `--bancada` é a prova do
   trabalho; a página publicada fica verde no minuto em que ela mandar.

## 5. PRONTO É, por aba

1. `check_identidade_vem_de_cima.py --bancada --aba NN` devolve **zero**.
2. A mordida provada: arranque um endereço que você deu, veja a régua acusar de
   novo, devolva. As duas saídas no relatório.
3. O pacote realmente escreve — não basta o endereço existir. Prove com o piloto:
   `hefesto_vivo.py --oculta --abre NN-*.html --segundos 6 --foto`, e leia a foto.
4. Nenhum arquivo de outra aba tocado.
5. 30 portões verdes.

## 6. AS ARMADILHAS

1. **Não invente cor.** Se a leitura não veio, o campo não mostra nada — é a
   regra dela: campo sem informação não mostra nada.
2. **Não toque no número do jogador.** Ele é estrutura e já está certo.
3. **Não publique.**
4. **Saída de comando vai para arquivo**, nunca crua no terminal dela.
5. **Não rode a suíte inteira** — ela toca nós uinput e já derrubou a sessão
   gráfica dela. Rode os seus arquivos de teste.
6. O `P1 ·` que some no card aberto **não é defeito**: mora num
   `<span class="so-fechado">`. Custou uma acusação falsa em 03/09.
