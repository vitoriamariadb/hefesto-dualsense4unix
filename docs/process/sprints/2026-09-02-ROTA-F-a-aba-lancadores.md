# ONDA F — a aba Lançadores

## O QUE FOI MEDIDO

**Zero.** A aba tem `0` gestos e `0` de 3 campos escritos. É desenho inteiro.

## O REUSO, PRIMEIRO — o motor já tem

```
app/actions/carona_do_wrapper.py        2 de 3 funções JÁ alcançadas pela interface
app/actions/launch_wrapper_dialog.py    4 funções, ZERO alcançadas
integrations/steam_launch_options.py    a string canônica do wrapper
assets/hefesto-launch.sh                o wrapper que roda em TODO jogo lançado
```

**A pergunta a responder antes de escrever qualquer linha:** o que a GTK
mostrava nesta tela? Consulte o grafo da árvore estável e o
`launch_wrapper_dialog.py` — ele tem quatro funções que ninguém na interface
nova chama. **É a lista do que ligar.**

## O QUE A ABA PRECISA DIZER

O produto instala `hefesto-launch` e ele já roda em todo jogo lançado pela
Steam. A aba tem de mostrar: quais jogos estão com o wrapper, quais não estão, e
o gesto de pôr/tirar. **`carona_do_wrapper` já sabe responder parte disso** — é
por onde começar.

## AS RÉGUAS

1. **Todo campo tem pintura E gesto.** A regra é do próprio gerador: *"um campo
   com gesto e sem pintura é pior que os dois faltando"*.
2. **A lista de jogos vem do produto**, nunca cravada no HTML.
3. **Nenhuma função duplica `carona_do_wrapper` ou `launch_wrapper_dialog`.**

## COMO SE SABE QUE FECHOU

```
[ ] a aba deixa de ter 0 gestos
[ ] os campos são escritos pelo pacote, não pelo HTML
[ ] a lista de jogos bate com o que `carona_do_wrapper` responde
[ ] foto, clique colado, e a mordida
```
