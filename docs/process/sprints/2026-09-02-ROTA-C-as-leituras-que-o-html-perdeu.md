---
sprint: ROTA-C
estado: feita
---

# ONDA C — as leituras que o HTML perdeu

> **ESTADO 06/09/2026: feita** — fase fechada em 02–03/09 (ONDE PARAMOS de 02/09, fim do dia; a aba 03 em 03/09).

Leia o [índice](2026-09-02-ROTA-DO-HTML-INDICE.md) e
[O MAPA](../2026-09-02-O-MAPA-DA-INTERFACE-medido-clicando-e-as-ondas.md) antes.

## A ASSINATURA A CAÇAR

**O HTML lendo UMA chave onde a GTK lia DUAS.**

O caso que a revelou, medido em 02/09/2026 com um controle no cabo e outro no
rádio:

| | lê |
| --- | --- |
| GTK (`app/actions/base.numero_do_controle`) | `player_slot`, e sem ele `index + 1` |
| GTK (`controller_card.py:1059-1067`) | `player_slot` para "Controle N"; `player` para o sufixo "· Jogador X" |
| HTML (`a01_jogar.py:48`, `a04_iluminacao.py:89-90`) | **só** `player` |
| HTML (`a04_iluminacao.py:221`) | `player_slot or player or 1` — a ordem já é a certa; o `or 1` é POSIÇÃO |

A aba Iluminação escreve `Modelo: P—` no rótulo enquanto deixa o botão `2`
ACESO logo abaixo. A mesma aba discordando de si mesma.

**CORREÇÃO DE FATO (02/09/2026, medida com os dois na mesa):** este documento
dizia *"no rádio o `player` volta `None`"*. **Não é o transporte** — quem cala é
o controle que NÃO é jogador do co-op, e na medição ele estava no CABO:

```
uniq 4446…4203 · bt  · player 1    · player_slot 1 · is_primary TRUE
uniq d42f…46d8 · usb · player None · player_slot 2 · is_primary false
coop.enabled=true · coop.players=1 · coop.mesa tem UMA entrada, a do primário
```

A condição está em `daemon/subsystems/coop.CoopManager.player_indexes`: *"Só
entra quem o jogo enxerga: um secundário ainda aguardando o grab não tem vpad —
reservou o índice, mas não é jogador nenhum até ser promovido."*

**E ELA JÁ DISSE QUE ISTO É REGRESSÃO:** *"por bt só faltava o som e o mic. o
resto já tinhamos mapeado e tava funcionando na interface."*
<!-- noqa-acento: citação literal dela --> Logo tudo o mais que falha no rádio
hoje FUNCIONAVA na GTK. Não é feature ausente; é leitura perdida na migração.

## O TRABALHO

### 1. O levantamento, com os dois grafos

Para cada campo que a interface mostra, comparar o que
`app/widgets/`+`app/actions/` lê do `state_full` com o que
`interface/pacotes/` lê. **É a consulta que os dois grafos servem.**

```bash
fazer_grafos                                                    # esta árvore
cd /mnt/Apate/Desenvolvimento/hefesto-dualsense4unix-estavel && fazer_grafos
```

### 2. Um dono por fato — FEITO em 02/09/2026

Toda leitura com mais de uma chave ganha uma função em
`interface/pacotes/__init__.py`, com a ordem escrita e a razão — **quem chama
não precisa saber que são duas chaves.** Os três donos que nasceram:

| dono | as chaves | o que ele responde |
| --- | --- | --- |
| `jogador_de(c)` | `player_slot` → `player` | o número que a tela mostra, ou `None` |
| `identidade_de(c, mesa)` | `nome_declarado` → `modelo` → a mesa → `transport` | o nome do aparelho, ou o travessão (ROTA-A) |
| `degradacao_de(c)` | `vpad_backend` + `vpad_motivo` | a frase da emulação degradada, ou `""` |

O levantamento das dezoito chaves que o daemon publica por controle, contadas
em `app/{widgets,actions,telas}` contra `interface/pacotes/`, está escrito no
cabeçalho da seção em `pacotes/__init__.py`. O que ele achou de novo:

* `vpad_motivo` — 1 leitura na GTK, **ZERO** no HTML. É a razão pela qual a
  emulação degradou, e sozinho o `vpad_backend` não a separa da máscara Xbox,
  que é `uinput` por design;
* `nascimento` — 2 na GTK, **ZERO** no HTML. É a razão do botão "A luz não
  acende" da aba Conexões. **Fica sem dono de propósito:** é chave ÚNICA, não a
  assinatura de duas, e o consumidor é território de outra onda;
* `connected` — 6 na GTK, ZERO no HTML, e **não é perda**: os pacotes recebem
  `ctx.conectados`, que já filtrou.

### 3. Nenhum pacote lê a chave crua

A régua existe (`tests/unit/test_os_donos_de_fato.py`) e nomeia arquivo e linha.
As abas **ainda não migraram** — dez frentes estão dentro dos `aNN_*.py` neste
momento —, então ela carrega uma lista de exceções DATADA, com a razão de cada
uma, para a próxima leva zerá-la. Há uma segunda régua que reprova exceção
morta: uma lista que mente sobre o tamanho da dívida é pior que dívida nenhuma.

## AS RÉGUAS

1. **A ordem é a mesma da GTK.** Se `app/actions/base.numero_do_controle`
   deixar de ler `player_slot` primeiro, a régua reprova — as duas têm de mudar
   no mesmo commit.
2. **Nenhum pacote lê `.get("player")` direto.** A régua varre `pacotes/*.py` e
   nomeia arquivo e linha.
3. **O caso do NÃO-JOGADOR, escrito sozinho:** `{"player": None,
   "player_slot": 2}` é jogador **2**. É o caso que motivou tudo e não pode se
   perder num `parametrize`. (Ele era chamado de "o caso do rádio" — ver a
   correção de fato acima.)

## COMO SE SABE QUE FECHOU

```
[ ] com um controle no CABO e outro no RÁDIO, os dois mostram jogador
[ ] a lista do levantamento existe, e toda leitura de duas chaves tem dono
[ ] nenhum pacote lê chave crua — régua verde, mordida reprovando
[ ] a saída do `--prova-no-aparelho` colada, antes e depois
```

## O QUE ESTA ONDA **NÃO** FAZ

Não conserta gesto (é a ONDA D), não mexe em HTML, não publica.
