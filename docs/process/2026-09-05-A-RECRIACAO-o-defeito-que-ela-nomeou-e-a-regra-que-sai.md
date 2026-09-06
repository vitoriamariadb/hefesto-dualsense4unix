# A recriação — o defeito que ela nomeou, e a regra que sai dele

**05/09/2026.** Ela disse, depois de ver a terceira coisa ser perguntada como se
fosse nova quando já estava pronta:

> *"a parte de recriarmos cada script ao invés de adaptar o que já temos pronto
> do gtk, isso eu havia pedido e sempre repetia, mas tá sendo recriado tudo
> sempre e sempre passando por cima das decisões e indo pelo caminho mais longo
> ao invés de aproveitar os dois mapas, specs e o mapa do controle e ao invés de
> aproveitar o do gtk e adaptar ele pra funcionar no html. estamos recriando um
> produto que estava praticamente pronto pro gtk. e isso é total sem
> necessidade."*

**Ela tem razão, e o número é este.**

## 1. A MEDIÇÃO

| camada | linhas | arquivos |
| --- | ---: | ---: |
| `app/actions/` — a lógica do GTK, que funciona | **34.930** | 32 |
| `interface/pacotes/` — a lógica da tela nova | **27.689** | 10 |

A camada nova tem **79% do tamanho** da que já existia. Ela importa do `app/`
entre 6 e 40 vezes por aba, então não é cópia pura — mas 27,7 mil linhas não são
fiação.

**O que é legítimo, e precisa ficar separado do que não é:**

| o quê | linhas | veredito |
| --- | ---: | --- |
| os geradores de `aba01.py` a `aba10.py` — geram o HTML (13 mil delas são literais de HTML/CSS) | 20.477 | **justo** — o GTK não tem HTML |
| motor: piloto do WebView, ponte JS, `monta`, `onde` | 15.995 | **justo** — infraestrutura que só a tela nova precisa |
| `pacotes/aNN` — a lógica de tela | **27.689** | **é aqui que mora a recriação** |

## 2. POR QUE ACONTECEU, e não é falta de aviso

O `CLAUDE.md` já manda ler o GTK. As sprints já citam `app/actions`. O que
faltava era **régua**: nada no projeto reprova quem recalcula o que já tem dono.
Um agente recebe a sprint, escreve em `pacotes/`, os portões ficam verdes — e a
duplicação entra sem ninguém ver.

É a mesma assinatura que esta casa já nomeou três vezes: *o `CLAUDE.md` já
descrevia o risco e o `portoes.sh` já AVISAVA — e nenhum dos dois curava. Aviso
no cabeçalho de um comando que termina verde ninguém lê.*

## 3. A REGRA QUE SAI — decisão dela, 05/09/2026

**Portão de dono único por comportamento.** Escolha dela entre quatro caminhos,
com estas palavras dela sobre o que o portão precisa fazer: *"me perguntar sobre
como vamos organizar o projeto pra evitar isso"*.

Cada comportamento de tela — ler a bateria, aplicar uma cor, decidir um selo,
formatar uma frase de estado — passa a ter **UM dono nomeado**, e a régua reprova
quem calcular de novo:

```
docs/data/donos-de-comportamento.csv
  comportamento,dono,quem_usa
  bateria.ler,app/actions/status.py:88,"a02,a08,GTK"
  cor.aplicar,app/actions/lightbar.py:412,"a04,GTK"
```

O portão lê `pacotes/aNN` e, se achar CÁLCULO onde devia haver CHAMADA, reprova
**dizendo o endereço do dono**. Ele não move código: congela o crescimento, e a
duplicação existente é puxada aba por aba, medindo.

**Por que este e não a arrumação grande:** mover `app/actions/` para uma camada
neutra é a arrumação certa no fim, mas é uma leva inteira antes de qualquer
feature — 32 arquivos e as duas telas. O portão custa um arquivo e pára a
sangria hoje.

## 4. O QUE NÃO É PRIORIDADE — dito por ela no mesmo dia

**A tradução sai da fila.** *"não são prioridades a parte da tradução e afins."*
Fica registrado o que a medição achou, para quando voltar a ser: o catálogo tem
413 entradas, **317 do `main.glade` e ZERO da interface nova**, e as dez abas têm
~40.000 palavras de tela com 18 marcações de tradução. Traduzir hoje o produto
que ela usa é impossível — não há de onde extrair.

**A exceção que ela nomeou: o Fable.** A ideia do alto-falante e do microfone
como dispositivos virtuais do sistema, ao estilo do gamepad virtual, **não é
recriação** — não existe em lugar nenhum. Medido: zero `module-null-sink`, zero
`pw-loopback` no repositório inteiro. O CONTROLE do alto-falante existe e
funciona (volume, rota e preamp: `sim` no cabo e no rádio); o que falta é
expô-lo ao sistema.

## 5. AS DUAS DECISÕES DE TELA DO MESMO DIA

| id | pergunta | decisão dela |
| --- | --- | --- |
| **02-Q9** | a borda verde/âmbar do som convive com o vermelho de hoje? | **substitui o vermelho.** Passa a haver um estado só, em duas cores: verde ligado, âmbar desligado |
| **06-Q1** | o botão cinza para de responder ao clique? | **não — a razão vai para a dica.** Ele continua respondendo, como `aba06.py:707` já manda por escrito, e a lei da peça compartilhada `monta.botao_cinza` fica intacta (a aba 09 usa a mesma) |

