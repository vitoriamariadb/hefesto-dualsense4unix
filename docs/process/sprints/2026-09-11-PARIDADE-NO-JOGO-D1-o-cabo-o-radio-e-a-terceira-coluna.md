---
sprint: PARIDADE-NO-JOGO-D1
estado: feita
onda: A-LINGUA-DA-TELA
posse:
  PARIDADE-NO-JOGO-D1:
    - docs/process/agentes/2026-09-11/PARIDADE-NO-JOGO-D1-opus.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
  - docs/data/mapa-controles.csv
  - install.sh
---

> **ESTADO 12/09/2026: feita** — medido com `git cherry` contra
> `onda/0911c`: `voo/PARIDADE-NO-JOGO-D1-opus` não tem um único commit fora da costura.
> O carimbo não é de quem entregou; é da MEDIÇÃO. Quatro irmãs desta
> mesma leva continuam `aberta` justamente por falharem nela.

# PARIDADE-NO-JOGO-D1 — o cabo, o rádio e a terceira coluna que ninguém mediu

Nasce da **A SEGUNDA LISTA DELA** (11/09/2026).

> *"agora que finalmente deixamos o modo BT totalmente pareado com o modo cabo.*  <!-- noqa-acento: citação literal dela -->
> *Incluindo até os sons e mic (o que antes o fable dizia ser impossível de*  <!-- noqa-acento: citação literal dela -->
> *conseguirmos construir e fazer funcionar) e se essas features vão funcionar*  <!-- noqa-acento: citação literal dela -->
> *nos jogos. Preciso de uma auditoria nesse sentido pra procurar por falhas de*  <!-- noqa-acento: citação literal dela -->
> *conexões e afins"*  <!-- noqa-acento: citação literal dela -->

---

## §1 — O QUE ESTA AUDITORIA MEDE, e a terceira coluna é o ponto inteiro

`docs/data/mapa-controles.csv` **já responde cabo × rádio**, linha a linha, com
o grau de confiança de cada célula. Repetir isso seria copiar o mapa.

**O que o mapa NÃO responde é a pergunta dela:** *"se essas features vão
funcionar nos jogos"*. A tabela desta auditoria tem TRÊS colunas:

| feature | no cabo | no rádio | **DENTRO DO JOGO** |

A terceira coluna é a que não existe em lugar nenhum desta casa.

## §2 — O QUE ENTRA NA TABELA

As features que ela nomeou, mais as que o cartão do controle mostra:

giroscópio · acelerômetro · touchpad · microfone (virtual **e** nativo) ·
alto-falante (as três rotas) · gatilhos adaptativos · vibração · barra de luz ·
LED de jogador · bateria

**E o «dentro do jogo» tem QUATRO caminhos, não um** — cada um pode quebrar a
feature de um jeito diferente:

1. **jogo nativo** lendo `/dev/input` direto;
2. **jogo da Steam com Steam Input ligado** — a Steam reescreve o controle;
3. **jogo da Steam com Steam Input desligado** — passa direto;
4. **jogo por Proton/Wine** (Heroic, Lutris) — o wrapper e o `hidraw`.

Para cada célula, o **grau**, na escala desta casa:
`MONTOU` (o produto montou o report) · `SAIU NO FIO` · `O APARELHO OBEDECEU` ·
`CHEGOU AO JOGO`. **`MONTOU` não é «funciona»** — toda afirmação forte diz o
degrau.

## §3 — AS DUAS ARMADILHAS QUE ESTA AUDITORIA TEM DE EVITAR

**1. A FALÁCIA DO CANAL QUE RESPONDE.** De um canal aceitar bytes não se
conclui que ele FAZ o que se esperava. Esta casa mirou no report errado por
semanas porque o aparelho respondia de bom grado — e o som só saiu quando
alguém mediu o fio.

**2. O INSTRUMENTO BRIGANDO COM O PRODUTO.** `test trigger --raw` disputa o
`hidraw` com o daemon e imprime «aplicado» sem ter aplicado. Todo instrumento
desta auditoria declara **o que ele está medindo e contra o quê**.

## §4 — O QUE É DELA, E VOCÊ SEPARA ISSO NO RELATÓRIO

Metade desta auditoria **não se fecha sem a mão e o ouvido dela** — um jogo
aberto, um controle no cabo e outro no rádio, alguém escutando. Sua entrega é
**dizer exatamente o que falta medir e como**, na forma de um roteiro que ela
possa executar em minutos:

* o gesto exato, passo a passo, na língua dela;
* o que tem de acontecer para passar;
* a armadilha de cada teste.

O molde está em
`docs/process/sprints/2026-09-07-O-COMO-DO-MAPA-o-gesto-das-178-celulas.md` —
siga-o.

## §5 — O QUE NÃO FAZER

* **Não escreva no `mapa-controles.csv`.** Ele tem dono e grau; mudar célula
  dele é outra sprint. Se você achar linha errada, diga qual e por quê.
* **Não afirme sem medir.** Uma célula que você não conseguiu medir escreve
  `não medido`, e isso é resposta legítima.
* **Não toque em `src/`.** Esta é auditoria, não conserto.

---

## O QUE VALE PARA TODA FRENTE DESTA ONDA

1. A tela dela é UMA SÓ e ela está usando a máquina. `--oculta` em toda janela.
2. Uma branch sua, árvore própria. Não toque em `dev`, não faça merge, não rode
   `install.sh`, nunca com sudo.
3. **Nunca rode o piloto contra o `~/.config` real dela.**
4. `git add -A` e `bash scripts/portoes.sh` antes de fechar.
5. Saída de comando vai para arquivo, nunca crua.
6. O índice da onda:
   `docs/process/sprints/2026-09-11-A-SEGUNDA-LISTA-DELA-a-lingua-da-tela-e-a-paridade-INDICE.md`
