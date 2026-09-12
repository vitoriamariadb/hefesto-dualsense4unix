---
sprint: OS-QUATRO-ORFAOS-DE-1009
estado: aberta
onda: A-FILA-DE-0911
posse:
  COORDENA:
    - docs/process/sprints/2026-09-12-OS-QUATRO-ORFAOS-DE-1009-a-costura-que-regride-a-tela.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
---

# Os quatro órfãos de 10/09 — costurados, medidos, e devolvidos à fila

**12/09/2026, 02h40.** Ela mandou juntar: *"Sim, junta e reinstala"*, e os
quatro órfãos estavam na lista. **Eles foram costurados, medidos e retirados** —
e o motivo é medição, não cautela.

| branch | commit |
| --- | --- |
| `voo/ALTURA-DA-VISTA-01-opus` | `87de2f54` |
| `voo/DICA-DA-COR-01-opus` | `65838cf4` |
| `voo/SENSORES-NO-JOGO-01-opus` | `8d5eddc9` |
| `voo/TOUCHPAD-NO-3DS-01-opus` | `a2fcd275` |

## §1 — O NÚMERO, e ele foi medido em três pontos

| árvore | vermelhos nos seis arquivos que os tocam |
| --- | ---: |
| `ca83c8e1` — antes desta madrugada | **0** de 68 |
| `5acf0afd` — as três frentes novas dentro | **2** de 68 |
| `fee23e35` — os quatro órfãos também | **7** de 68 |

**Os quatro acrescentam cinco vermelhos.** As duas de `5acf0afd` são das frentes
novas e foram curadas na hora (as citações do mapa e o gesto das duas células
do volume do microfone). As cinco dos órfãos não.

## §2 — A CAUSA, e ela é a armadilha que esta casa já tem escrita

**Estas branches nasceram em 10/09, antes da onda das 352.** É exatamente o que
o `ONDE PARAMOS` de 05/09 nomeia: *a worktree do agente pode nascer commits
atrás do `dev`*, e um patch traz de volta o que foi podado depois.

Três dos cinco vermelhos têm UMA causa só, e é de régua:

> A `ALTURA-DA-VISTA-01` embrulhou a fita numa linha nova — `<div
> class="fita-linha">`, que carrega marca, fita, contagem e perfil ativo. Três
> réguas ancoravam no PREFIXO `class="fita`, e o prefixo passou a casar com o
> EMBRULHO. O recorte começava no `.fita-linha` e acabava no primeiro `</div>`
> de dentro dele — muito antes de a fita terminar.

O efeito é o pior tipo: **a régua parou de pular a fita que ela mandava pular**,
e acusou os chips do esqueleto como se fossem cor cravada da aba. *A régua
digitava um prefixo e devia ler o elemento.*

**Esta parte já está curada, e a cura ficou na árvore** mesmo sem os órfãos: as
três réguas passaram a casar `<div class="fita"` e `<div class="fita inerte"`,
com as aspas, que é o que `monta.fita()` escreve. Quando os quatro voltarem,
estas três não reprovam mais.

## §3 — OS DOIS QUE SOBRAM, e eles precisam da janela aberta

`test_a_dica_da_casa_abre_com_o_ponteiro` reprova duas vezes: a dica abre com
**37 px de largura mostrando `L2`**, quando o esperado era a frase do elemento
que a régua escolheu (*"Abre os ajustes deste gatilho…"*).

A régua escolhe o PRIMEIRO elemento da página com dica longa o bastante e
tamanho suficiente, e depois leva o ponteiro às coordenadas dele. A
`ALTURA-DA-VISTA-01` mudou as alturas (a faixa de cabeçalho saiu, o rodapé
encolheu 12 px) — **as coordenadas deixaram de cair no mesmo elemento.**

Isto **não se diagnostica sem abrir a janela**: ou a régua escolhe frágil, ou a
dica realmente deixou de abrir naquele elemento. As duas hipóteses mudam a cura,
e nenhuma se decide lendo fonte.

## §4 — E UMA RAZÃO QUE NÃO É DE RÉGUA

A `ALTURA-DA-VISTA-01` **muda as proporções da interface dela** — tira a faixa
de cabeçalho, encolhe o rodapé, e o miolo passa de 564 para 666 px na vista de
840. É trabalho bom, e é a metade que falta do item 3 da segunda lista dela
(*"não conseguimos centralizar a interface?"*) — a horizontal já fechou com a
`ESQUELETO-C2`, e é a VERTICAL que está torta.

**Mas ela nunca viu.** A regra da casa é de 27/07 e não tem exceção: *interface
só fecha com o olho dela* — foto antes e depois, e a palavra final é dela.
Empurrar isso num install de madrugada é a única parte desta noite que ela não
poderia conferir de manhã.

## §5 — O QUE A PRÓXIMA LEVA FAZ

1. **Adiantar as quatro branches** para o `dev` de hoje — `git rebase` ou
   `cherry-pick`, nunca `git apply` cego, que é a regra de 05/09.
2. **Regerar as dez páginas** dos geradores e publicar: os mockups das branches
   são de 10/09 e não têm as 352.
3. **Abrir a janela** e medir a dica com a ponteira, nos dois sentidos: a régua
   escolhendo certo, e o elemento que ela escolhe abrindo a dica que promete.
4. **Mostrar a ela** a foto antes/depois da altura — é decisão dela, e é a única
   coisa desta lista que nenhum agente pode fechar sozinho.

## §6 — O QUE FOI PARA O PRODUTO NESTA NOITE

As três frentes novas, que nasceram sobre o `dev` de hoje e não regridem nada:
o **volume do microfone** ganhando endereço (a outra metade do item 16 dela), o
**`common[6]`** ganhando dono nos dois chamadores, e as **três contas do
«Controle N»** virando uma. Mais as duas escolhas dela de 12/09: o 🎙 em verde
fixo e a fileira do som quebrando em vez de cortar.
