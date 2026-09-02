# ONDA B — o reuso que não aconteceu

**A pergunta dela, 02/09/2026, e ela reordenou o plano inteiro:**

> *"cara a gnt tá recriando os meus codigos do zero ao invés de usar o que eu já <!-- noqa-acento: citação literal dela -->
> havia feito e linkar tudo? Isso tá ocorrendo mesmo?"*
<!-- noqa-acento: citação literal dela -->

**A resposta medida é SIM, em parte — e a medição diz exatamente onde.**

## A CORRELAÇÃO, e ela é o achado desta onda

| pacote | linhas | imports do motor GTK | campos escritos |
| --- | --- | --- | --- |
| `a08_conexoes.py` | 1790 | **14** | **8/11 (73%)** |
| `a01_jogar.py` | 434 | 2 | 6/11 (55%) |
| `a05_vibracao.py` | 385 | 2 | 2/9 (22%) |
| `a09_sistema.py` | 399 | 2 | 2/10 (20%) |
| `a02_controles.py` | 509 | 1 | 7/12 (58%) |
| `a06_navegacao.py` | 673 | 1 | 4/7 (57%) |
| `a10_perfis.py` | 932 | 1 | 1/3 (33%) |
| `a03_gatilhos.py` | 632 | **1** | **1/25 (4%)** |
| `a04_iluminacao.py` | 273 | **0** | 6/12 (50%) |

**A aba que mais REUSA é a que mais FUNCIONA.** As que reescreveram são as que
estão em 4% e 20%.

No total: **6.027 linhas nos dez pacotes, 24 imports do motor, 20 chamadas de
IPC cru.** O motor tem 23 módulos de ação, 9 widgets e a `gui/ponte_da_tela` — e
a interface nova alcança uma fração deles.

## O EXEMPLO QUE PROVA, medido

`a03_gatilhos.py` importa `trigger_specs` (certo — as especificações dos modos
vêm de lá) e reescreve por conta própria:

| a aba escreveu | o motor já tinha |
| --- | --- |
| `_desfecho(resposta)` | `app/actions/triggers_actions.py:humanizar_erro_gatilho` |
| `_padroes(nome)` | os defaults por modo, dentro de `trigger_specs` |
| `_curva(chave)` / `_pronto_da_curva()` | as curvas prontas |

Duas grafias do mesmo fato é o defeito-mãe desta casa. E aqui ele tem um custo
que se vê: a aba entrega **1 campo de 25**.

## O TRABALHO — e ele NÃO é reescrever de novo

**A regra desta onda: para cada função dos pacotes, perguntar "isto já existe no
motor?" antes de tocar em qualquer linha.** Os dois grafos respondem em segundos:

```bash
fazer_grafos                      # nesta árvore
# e a estável, que é o GTK funcionando:
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-estavel && fazer_grafos
```

### Passo 1 — o inventário do que existe e não é usado

Para cada um dos 23 módulos de `app/actions/`, os 9 de `app/widgets/` e a
`gui/ponte_da_tela`: listar as funções públicas, e marcar quais a interface nova
já chama. **O resultado é a lista de reuso disponível.**

### Passo 2 — o inventário do que foi reescrito

Para cada função dos dez pacotes, procurar equivalente no motor. Onde houver
duas grafias do mesmo fato, a do MOTOR vence — ela é a que a GTK provou.

### Passo 3 — ligar, não reescrever

Trocar a cópia pela chamada, uma de cada vez, com régua. **Cada troca é um
commit próprio**, para o merge poder recuar uma sem perder as outras.

## O QUE **NÃO** REUSAR, e a razão é medida

Nem tudo do motor serve — e forçar reuso é o erro oposto:

- **O que desenha GTK** (`Gtk.Widget`, `set_label`) não atravessa para HTML.
  Reusar aqui é impossível, não é preguiça.
- **O que fala com a tela GTK** (`ponte_da_tela`) atravessa PARCIALMENTE: a
  parte que decide o QUE mostrar serve; a que mexe em widget não.
- **A divisão certa é: LÓGICA reusa, DESENHO não.** Se a função responde "qual é
  o valor?", reusa. Se ela responde "onde ponho na tela?", é da aba.

## AS RÉGUAS

1. **Nenhuma função de pacote duplica uma do motor.** A régua compara os dois
   lados e reprova a duplicata nomeando as duas.
2. **A frase de erro tem um dono.** `humanizar_erro_gatilho` existe; um
   `_desfecho` paralelo é a segunda verdade.
3. **Os defaults por modo têm um dono.** `trigger_specs`, e mais nenhum.

## COMO SE SABE QUE FECHOU

```
[ ] a lista do passo 1 existe, escrita, com o que é reusável e o que não é
[ ] toda duplicata do passo 2 virou chamada OU ganhou a razão escrita de não ser
[ ] o número de imports do motor SUBIU, e está no relatório
[ ] os campos escritos subiram — medido pelo comando do índice
[ ] a saída do `--prova-no-aparelho` colada, antes e depois
```

## POR QUE ESTA ONDA VEM ANTES DAS OUTRAS

Porque consertar a aba Gatilhos (ONDA D) **sem** fazer isto primeiro significa
escrever mais 24 campos à mão, com as mesmas quatro funções duplicadas embaixo.
O trabalho dobraria, e a segunda verdade ficaria.

**Ela reordena o plano: A e B primeiro. As outras depois.**
