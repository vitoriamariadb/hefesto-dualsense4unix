---
sprint: ONDA-LANCADORES-INDICE
onda: ABA-LANCADORES
posse:
  COORDENA:
    - docs/process/sprints/2026-08-27-ONDA-LANCADORES-INDICE.md
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-INDICE.md
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# ONDA LANÇADORES — índice

**27/08/2026.** Dez sprints levam a aba **Lançadores** do que o produto é hoje
(uma aba "Emulação" sobre uinput) até o que o mockup mostra — o mockup que ela
aprovou sem ressalva: *"lançadores perfeito parabéns."*
(`novo-layout/_ferramentas/CORRECOES-DELA.md:59-60`).

**A aba nasce escondida e só aparece na 10.** É decisão dela, e a razão é a
mesma que atravessa esta onda inteira:

> *"essa aba em si só vamos desenhar e deixar placeholder mesmo. E ela só passa a
> existir quando tiver todas as features no projeto integrando e funcionando."*
> — D-A-ABA-LANCADORES-NASCE-PLACEHOLDER

## As dez

| # | Sprint | Camada | O que resolve |
|---|---|---|---|
| 01 | [a casca nasce, escondida](2026-08-27-ONDA-LANCADORES-01-a-casca-da-aba-nasce-escondida.md) | frontal | a página, o quadro, o `?`, a fita esmaecida e o widget do cartão |
| 02 | [quem está instalado](2026-08-27-ONDA-LANCADORES-02-quem-esta-instalado-nesta-maquina.md) | backend | o detector dos sete lançadores, com evidência por resposta |
| 03 | [a lista real e o "Procurar de novo"](2026-08-27-ONDA-LANCADORES-03-a-lista-real-e-o-procurar-de-novo.md) | ambas | os cartões de verdade, a contagem, a conta e o carimbo |
| 04 | [os cinco impedimentos ganham tela](2026-08-27-ONDA-LANCADORES-04-os-cinco-impedimentos-ganham-tela.md) | ambas | **ligar**: `prontuario_dos_jogos.py:139-143` |
| 05 | [a cura sem chamador](2026-08-27-ONDA-LANCADORES-05-consertar-a-cura-sem-chamador.md) | ambas | **ligar**: `curar_o_que_e_automatico`, `:885` |
| 06 | [detectar o jogo que está aberto](2026-08-27-ONDA-LANCADORES-06-detectar-o-jogo-que-esta-aberto.md) | ambas | publicar o nome e o executável da janela ativa, e criar o perfil |
| 07 | [abrir o lançador e criar perfil](2026-08-27-ONDA-LANCADORES-07-abrir-o-lancador-e-criar-perfil.md) | ambas | generalizar o `open_or_focus_steam` para os sete |
| 08 | [o Estilo Retrô na linha do emulador](2026-08-27-ONDA-LANCADORES-08-o-estilo-retro-na-linha-do-emulador.md) | frontal | o botão roxo — e a regra de não desenhá-lo sem estilo por trás |
| 09 | [o selo "o controle chega"](2026-08-27-ONDA-LANCADORES-09-o-selo-o-controle-chega.md) | ambas | a régua **antes** do selo: CHEGA nunca sai por ausência |
| 10 | [a antiga sai, a nova entra na tira](2026-08-27-ONDA-LANCADORES-10-a-antiga-sai-e-a-nova-entra-na-tira.md) | ambas | o portão das dezesseis linhas do "Nada se perdeu" |

## A ordem, e por que ela é quase toda serial

```
02 (backend, sozinho) ─┐
                       ├─> 03 ─> 04 ─> 05 ─> 06 ─> 07 ─> 08 ─> 09 ─> 10
01 (casca, sozinha) ───┘
```

**01 e 02 correm em paralelo**: uma é a tela vazia, a outra é o módulo que não
importa nada da janela. Da 03 em diante todas escrevem no mesmo
`app/actions/lancadores_actions.py` — a serialização está declarada em
`depois_de`, que é o que o `check_colisao_de_sprints.py` aceita como decisão em
vez de descuido.

**`gui/main.glade` só aparece em duas** (01 cria a página, 10 remove a antiga), e
elas já estão serializadas. Fora desta onda ele é **recurso de bancada**: uma
sprint por vez em toda a casa.

## O que é dela, e trava o fim da onda

1. **A régua do selo "o controle chega"** (sprint 09) — é o item 5 do "falta
   decidir" da aba, e sem ela a coluna vira instrumento que mente. Junto vem o
   preço: a primeira versão mostra **NÃO SEI** onde o mockup mostra verde.
2. **A aba lista lançadores, ou também os jogos de fora da Steam?** (03) — o
   catálogo de hoje só enxerga Steam (`jogos_locais.py:119`); o resto é varredura
   nova.
3. **Onde mora "Detectar o jogo que está aberto"** (06) — aqui, na Perfis, ou nos
   dois.
4. **O "Consertar" também fica na Sistema?** (05).
5. **Em qual perfil cai o Estilo Retrô** (08), já que a fita desta aba é
   esmaecida de propósito.
6. **Quando a aba passa a existir** (10) — ela decide vendo a foto.

**Já decidido, não repropor:** os cinco botões de Steam **ficam na Sistema**
(ela, contra a recomendação de quem coordena, em D-A-ABA-LANCADORES-NASCE-PLACEHOLDER);
a lista e a ordem dos cartões são as do mockup aprovado; modo e máscara **não**
moram aqui (D-A-MASCARA-GANHA-O-AUTOMATICO); o quadro dos combos vai para a
Navegação (D-A-AREA-QUE-ENSINA-VAI-PARA-A-NAVEGACAO).

## As três costuras que esta onda divide com as outras nove

Conferido com o `check_colisao_de_sprints.py` (com o `onda:` removido, ver
abaixo): **dentro desta onda não há uma única colisão não declarada.** As 51 que
aparecem são todas com **outras ondas**, e todas nos mesmos três arquivos:

| Arquivo | Quem toca aqui | Nota |
|---|---|---|
| `gui/main.glade` | 01 (cria a página), 10 (remove a antiga) | **recurso de bancada**: uma sprint por vez em toda a casa. Conflito de merge nele é irrecuperável na prática (COMO-EXECUTAR-UMA-SPRINT §2) |
| `app/app.py` | 01 (liga o mixin), 10 (desliga o da Emulação) | duas linhas cada |
| `daemon/ipc_handlers.py` | 06 (duas chaves no payload da janela) | disputado com Jogar, Perfis e Vibração |

Quem coordena serializa os três — não há como uma onda declará-lo sozinha.

## Antes de despachar

`scripts/check_colisao_de_sprints.py` **não lê o campo `onda:`** —
`_CAMPOS_CONHECIDOS` (`:81`) tem seis campos e esse não está entre eles, então
toda sprint desta onda cai em "não consegui ler o frontmatter" e o
`despachar-agente.sh` recusa despachá-las. **O conserto é uma palavra** na lista
daquele script, e ele está fora do que esta onda pode tocar.
