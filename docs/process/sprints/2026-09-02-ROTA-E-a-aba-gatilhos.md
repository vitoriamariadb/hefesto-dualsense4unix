# ONDA E — a aba Gatilhos

**ESPERA A ONDA B.** Sem ela, esta aba escreve 24 campos à mão por cima de
quatro funções duplicadas — e a segunda verdade fica embaixo.

## O QUE FOI MEDIDO

A aba escreve **1 campo de 25 (4%)** — a pior das dez. E o que ela mostra é
mockup: com o perfil ativo dizendo `L2: modo='Off' params=[]` e `R2: modo='Off'
params=[]`, a tela exibe para P1 `Força 7 · Frequência 4 · Início 25 · Fim 230`
e para P2 `Início 3 · Fim 6 · Força 5`.

**Contradição dentro da própria tela:** o HTML escreve *"Este modo não tem o que
ajustar"* nas colunas P3/P4 e mostra quatro ajustes nas P1/P2 — que também
dizem `Desligado`.

**Agravante:** P3 e P4 dizem `Desconectado` e os campos continuam ATIVOS, com o
botão "Guardar esse efeito" clicável.

## O REUSO, PRIMEIRO — o motor já tem

```
app/actions/trigger_specs.py       as especificações de cada modo e seus defaults
app/actions/triggers_actions.py    humanizar_erro_gatilho, _rotulo_do_param
```

E `a03_gatilhos.py` reescreveu por conta: `_desfecho`, `_padroes`, `_curva`,
`_pronto_da_curva`. **Trocar cópia por chamada é o passo zero desta onda** — é
literalmente o trabalho da ONDA B aplicado aqui.

## DE ONDE VEM A VERDADE

**O daemon NÃO ecoa gatilho** — é comando de ida, e isso é decisão medida (por
isso `modo` e `pronto` estão no `SEM_ECO` desta aba). **A fonte é o PERFIL**:
`profile.triggers` para o global e `profile.controllers[uniq].triggers` para o
override por controle, que entrou em 01/09/2026.

## OS PASSOS

1. **Trocar as quatro cópias por chamadas ao motor** (o passo zero).
2. **O pacote passa a escrever os 25 campos**, lendo o perfil: modo, efeito
   pronto, e cada ajuste com seu rótulo e faixa vindos de `trigger_specs`.
3. **Coluna desconectada fica INERTE** — campos desabilitados, botão sem gesto.
4. **Os ajustes só aparecem quando o modo os tem.** A regra já está escrita no
   HTML ("Este modo não tem o que ajustar"); ela vale para as quatro colunas.

## AS RÉGUAS

1. **O que a tela mostra bate com o perfil**, campo a campo, com o perfil real
   no disco.
2. **Modo sem ajustes não mostra ajuste.** Arranque e a régua reprova.
3. **Coluna desconectada não aceita clique.**
4. **Nenhuma função duplica `trigger_specs`.**

## COMO SE SABE QUE FECHOU

```
[ ] 25 de 25 campos escritos pelo pacote (hoje: 1)
[ ] a tela bate com `profile.triggers` e com o override por controle
[ ] P3/P4 inertes
[ ] foto antes e depois, e a saída do clique colada
```
