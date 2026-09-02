# ONDA C — as leituras que o HTML perdeu

Leia o [índice](2026-09-02-ROTA-DO-HTML-INDICE.md) e
[O MAPA](../2026-09-02-O-MAPA-DA-INTERFACE-medido-clicando-e-as-ondas.md) antes.

## A ASSINATURA A CAÇAR

**O HTML lendo UMA chave onde a GTK lia DUAS.**

O caso que a revelou, medido em 02/09/2026 com um controle no cabo e outro no
rádio:

| | lê |
| --- | --- |
| GTK (`app/widgets/controller_card.py:1059-1065`) | `player_slot` **e depois** `player` |
| HTML (`a01_jogar.py:48`, `a04_iluminacao.py:89-90`) | **só** `player` |
| HTML (`a04_iluminacao.py:221`) | `player_slot or player` — **já certo** |

No cabo as duas chaves coincidem. **No rádio o `player` volta `None` e o
`player_slot` continua certo** — e a aba Iluminação escreve `Modelo: P—` no
rótulo enquanto deixa o botão `2` ACESO logo abaixo. A mesma aba discordando de
si mesma.

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

### 2. Um dono por fato

Toda leitura com mais de uma chave ganha uma função em
`interface/pacotes/__init__.py`, com a ordem escrita e a razão. O modelo é o do
`jogador_de` abaixo — **quem chama não precisa saber que são duas chaves**:

```python
def jogador_de(c: dict) -> int | None:
    """Que jogador é este controle — o NÚMERO que a tela mostra, ou None.

    O daemon publica DUAS chaves: `player_slot` (a posição, que o produto
    decide) e `player` (o LED que o aparelho mostra). No cabo coincidem; no
    rádio o `player` volta None. A GUI GTK sempre leu as duas, nesta ordem
    (`controller_card.py:1059-1065`).
    """
    for chave in ("player_slot", "player"):
        valor = c.get(chave)
        if valor is None:
            continue
        try:
            n = int(valor)
        except (TypeError, ValueError):
            continue
        if n > 0:
            return n
    return None
```

### 3. Nenhum pacote lê a chave crua

Trocar todos os leitores pelo dono, e escrever a régua que proíbe a volta.

## AS RÉGUAS

1. **A ordem é a mesma da GTK.** Se `controller_card.py` mudar a ordem dele, a
   régua reprova — as duas têm de mudar no mesmo commit.
2. **Nenhum pacote lê `.get("player")` direto.** A régua varre `pacotes/*.py` e
   nomeia arquivo e linha.
3. **O caso do rádio, escrito sozinho:** `{"player": None, "player_slot": 2}`
   é jogador **2**. É o caso que motivou tudo e não pode se perder num
   `parametrize`.

## COMO SE SABE QUE FECHOU

```
[ ] com um controle no CABO e outro no RÁDIO, os dois mostram jogador
[ ] a lista do levantamento existe, e toda leitura de duas chaves tem dono
[ ] nenhum pacote lê chave crua — régua verde, mordida reprovando
[ ] a saída do `--prova-no-aparelho` colada, antes e depois
```

## O QUE ESTA ONDA **NÃO** FAZ

Não conserta gesto (é a ONDA D), não mexe em HTML, não publica.
