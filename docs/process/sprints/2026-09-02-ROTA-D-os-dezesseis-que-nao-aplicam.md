# ONDA D — os dezesseis que dizem "aplicado" e não aplicam

## O QUE FOI MEDIDO

Com `--prova-no-aparelho`, dois controles na mesa, em 02/09/2026 — o próprio
instrumento marca *"sem efeito e sem `SEM_ECO`"*: o gesto clicou, respondeu
`aplicado`, o estado do daemon **não mudou**, e ele não está declarado como
gesto sem eco.

```
01-jogar       hefesto · reconectar
03-gatilhos    guardar
04-iluminacao  cor · player
06-navegacao   guardar-definicoes · padrao-definicoes · teclado
08-conexoes    escolher-aparelho · escolher-entrada · luz-nao-acende ·
               nova-entrada · nova-extensao · nova-face · tirar-daqui
10-perfis      ativar
```

**Isto é o "responde calado", o defeito mais caro desta casa.**

## O PASSO 1 É CLASSIFICAR, NÃO CONSERTAR

Os dezesseis não são a mesma coisa, e tratar como se fossem produziria conserto
errado. São TRÊS montes:

| monte | como se reconhece | o que fazer |
| --- | --- | --- |
| **(a) recusou com razão** | o log traz a frase da recusa | **corrigir o INSTRUMENTO**, não o gesto |
| **(b) o daemon não ecoa** | o gesto faz, mas o `state_full` não publica aquilo | **declarar em `SEM_ECO`**, com a razão escrita |
| **(c) mentiu mesmo** | disse aplicado, não fez nada | consertar o gesto |

**Os que JÁ SE SABE serem do monte (a)**, medidos: em `08-conexoes`, o
`luz-nao-acende` recusou porque *"este controle está no cabo"*; o
`escolher-aparelho`, `escolher-entrada`, `nova-entrada`, `nova-extensao`,
`nova-face` e `tirar-daqui` recusaram porque **o clique automático não disse o
alvo** — a recusa é o comportamento CORRETO, e o instrumento é que precisa saber
passar alvo.

**O monte (b) tem precedente escrito:** gatilho é comando de ida, e o
`state_full` não o publica. Por isso `modo` e `pronto` já estão no `SEM_ECO` da
aba 03. O `guardar` da mesma aba provavelmente é o mesmo caso — **confira, não
suponha.**

## AS RÉGUAS

1. **A lista de "sem efeito e sem `SEM_ECO`" fica VAZIA.** É a régua que fecha
   a onda, e ela roda com o daemon vivo.
2. **Toda entrada nova em `SEM_ECO` tem a razão escrita.** Sem razão, é lápide
   para esconder defeito.
3. **O instrumento passa alvo.** Um `--prova-no-aparelho` que não sabe clicar um
   botão que exige `uniq` produz falso negativo — e foi o que aconteceu com
   Vibração (`parar` e `testar` recusaram por falta de alvo, corretamente).

## COMO SE SABE QUE FECHOU

```
[ ] os 16 classificados em (a)/(b)/(c), com a prova de cada classificação
[ ] a lista de "sem efeito e sem SEM_ECO" vazia na saída do instrumento
[ ] cada SEM_ECO novo com razão
[ ] a saída literal colada
```
