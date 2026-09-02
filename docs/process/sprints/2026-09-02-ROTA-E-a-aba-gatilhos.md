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

---

# O QUE FECHOU — 02/09/2026

## O ENUNCIADO DESTA SPRINT ESTAVA ERRADO EM TRÊS NÚMEROS

O que ele dizia, e o que a medição devolveu:

| o enunciado dizia | medido em 02/09, e como |
| --- | --- |
| *"a aba escreve 1 campo de 25 (4%) — a pior das dez"* | **8 de 25**, e a régua do enunciado contava PRESENÇA DE STRING no `.py`. Os endereços da aba são montados por f-string (`f"aj-nome-{sig}-{i}"`), logo nenhum deles aparece literal no arquivo — a régua via só o `perfil`. Contado pelo que o piloto ESCREVE (`--abre 03-gatilhos.html`, saída `valores`): **8 antes, 41 depois.** |
| *"os 22 campos"* / *"25 campos"* | a página tem **25 endereços únicos** e **32 elementos de campo** — o mesmo `data-campo` se repete uma vez por coluna. As barras de ajuste são **11**, não 22: P1 tem 4+2, P2 tem 3+2, P3 e P4 têm zero. |
| *"`_desfecho`, `_padroes`, `_curva` e `_pronto_da_curva` são cópias do motor"* | **as quatro já chamam o motor.** `_padroes` é `preset_to_positional_params`, `_curva` é `resolve_feedback_preset`, `_pronto_da_curva` compara com `FEEDBACK_POSITION_PRESETS`, e `_desfecho` normaliza a FORMA da resposta da ponte (`bool` / `(ok,motivo)` / `(ok,motivo,corpo)`), que não é o que `humanizar_erro_gatilho` faz — aquela traduz o TEXTO da recusa. **O passo zero desta onda já estava dado**, e a frente B1 mediu o mesmo por outro caminho. |

## A CAUSA DO D3, e ela não é "os ajustes não foram ligados"

O pacote pinta os ajustes desde 01/09, e há régua que prova
(`test_o_perfil_chega_na_tela.py`: com `Rigid` no disco, `aj-val-e-1 == 180`).
O que ele pintava eram **as casas que o modo tem**. `Off` tem zero:

```
for i, p in enumerate(spec.params):   # Off -> params = (), zero voltas
```

Zero voltas, zero endereços escritos — e as quatro barras que o desenho deixou
na página **ficam com o que o gerador escreveu**. A regra que isto deixa:

> **Um endereço que a página tem e ninguém escreve continua mostrando o
> desenho.** Não é o pacote que decide quantas casas existem — é a PÁGINA.

`_casas_e_barras()` LÊ a página publicada e conta. Digitar `4` e `2` aqui
criaria a segunda cópia de um número que o gerador já decide.

## A COBERTURA DESTA ABA MENTIA, e o erro é o mesmo do "77%"

Medido contra a mesa dela (dois controles, `meu_perfil`, `Off` nos dois lados):

```
o pacote devolvia .... 20 chaves por controle
o piloto escrevia .....  8 valores
```

As doze restantes — `l2-raw`, `l2-pct`, `r2-raw`, `r2-pct` e o rótulo
`modo-e`/`modo-d` — **não têm endereço na página**. A `cobertura` as contava
como pintura. Agora ela cruza com os `data-campo` do arquivo publicado e
declara o resto em `sem_endereco`.

(O `modo-e` fica: `test_o_perfil_chega_na_tela.py:133` o cobra, e o campo de
escolha casa pelo `value`, que é a CHAVE. Ele existe e não pousa — a diferença
é que agora isso está DITO.)

## O QUE FOI PARA A BANCADA, e por quê

Duas correções de PINTURA, nenhuma de desenho — declaradas em
`mockup/DIVERGENCIAS.md`:

1. **As 11 barras ganharam `data-hef-alvo="largura"`.** Sem ele o
   `escrever()` do piloto escreve o NÚMERO dentro do trilho de 5px e a barra
   fica na largura do mockup. É o mesmo defeito que o `data-hef-alvo="valor"`
   dos `<select>` curou em 01/09, no elemento vizinho. O portão do desenho não
   vê esta linha: `data-hef-alvo` está na lista de `INVISIVEIS` do
   `check_o_desenho_aprovado.py` — ela não muda um pixel.
2. **O lugar vazio deixou de aceitar clique** (`pointer-events:none` em
   `.ctrl[data-conectado="nao"] select, .btn`). O seletor pende do
   `data-conectado`, que o **piloto** reescreve a cada tique — logo a trava
   acompanha a mesa DELA, e um controle ligado no P3 devolve a coluna sem
   ninguém tocar em CSS.

## O QUE NÃO DEU PARA FAZER DAQUI, e onde está o resto

* **A barra chega ao produto só quando ela publicar.** Até lá o pacote pinta o
  nome e o valor certos e a barra fica na largura do desenho. `_casas_e_barras`
  volta a pintar a largura sozinho no dia em que a página vier com o alvo.
* **`blocos:` do piloto é um mecanismo MORTO.** `pacotes.normalizar()` descarta
  toda chave cujo valor é `dict` (`if isinstance(valor, dict): continue`), e
  `blocos` é um `dict` — logo `p.blocos` chega SEMPRE vazio ao JS. A aba
  Conexões o usa (`a08_conexoes.py:763`, o mapa do gabinete e a lista de
  aparelhos) e **não está sendo pintada por ele**. Era a rota natural para os
  ajustes desta aba, cujo número de linhas muda de 0 a 11 com o modo. A cura é
  em `pacotes/__init__.py`, que é território de outra frente.
* **O número de casas do desenho não cabe nos modos.** A página reserva 4 e 2;
  `Machine` tem 6 parâmetros, `Galloping` 5, `MultiPositionVibration` 11. E os
  rótulos do P1 (`Força`, `Frequência`, `Início do curso`, `Fim do curso`) não
  são de modo nenhum do `trigger_specs` — o gerador já declara essa divergência
  na cena literal, que é a que ela aprovou. **Enquanto o `blocos` não voltar a
  funcionar, um modo de mais de 4 ajustes mostra os quatro primeiros e esconde
  o resto** — a tela não mente, mas cala.
