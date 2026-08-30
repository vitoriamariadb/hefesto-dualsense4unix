---
sprint: A-PORTA-DA-ABA-CONTROLES-01
onda: A-PORTA-DA-ABA-CONTROLES
posse:
  P1:
    - novo-layout/_ferramentas/aba02.py
---

**ESPERA A TRAVA CAIR.** O `aba02.py` estava travado por uma leva em voo em
29/08 — esta sprint é a linha exata a colar quando ele soltar.

# A PORTA DA ABA CONTROLES — a linha que espera a trava cair

**29/08/2026.** `novo-layout/mapa-do-controle.html` é a **fonte da verdade das
peças** — 28 peças com nome, apelido e glifo, 28 modelos de cor, gerador próprio
(`_ferramentas/mapa.py`) e **dois portões** que o medem
(`scripts/check_pecas_do_dualsense.py`, `scripts/check_cores_do_dualsense.py`).
Ela o fez pensando em todos os usuários, não nos controles dela.

**E ninguém o alcançava.** Medido: `grep -c 'mapa-do-controle' novo-layout/??-*.html`
devolvia **0 nas dez abas**. Só se chegava nele digitando o caminho.

A porta foi aberta na aba **Navegação** (é de lá que saem as 21 linhas das duas
telas de botões, do mesmo `docs/data/pecas-do-dualsense.csv`). **A segunda porta
natural é a aba Controles** — onde o desenho do aparelho está e onde a cor do
plástico se escolhe —, e o `aba02.py` estava travado por uma leva em voo.

## O que colar, quando a trava cair

**1. O CSS.** No fim do bloco `CSS +=` de `aba02.py` (hoje o `f"""` que começa em
`aba02.py:1057`, com `.faixa{{--larg-bateria:…}}`), acrescentar:

```python
# A PORTA PARA O BANCO DE PROVAS — `.porta`, 29/08/2026. Ver a mesma regra em
# `aba06.py` e `aba08.py`: o mapa do controle e o mapa das portas não tinham
# porta em aba nenhuma, e `grep -c` nas dez abas devolvia 0 para os dois.
# A ALTURA DE 17px É MEDIDA, e aqui ela nem morde: o `.quadro-topo` desta aba já
# tem um `.btn` de 34px dentro do `.sensores`, então a porta não muda nada.
CSS += """
  .porta{margin-left:auto;font-size:11px;line-height:17px;height:17px;
    color:var(--texto-mudo);text-decoration:none;white-space:nowrap}
  .porta:hover{color:var(--cyan);text-decoration:underline}
"""
```

**2. O link.** Em `aba02.py`, no `MIOLO`, imediatamente **antes** do
`<span class="sensores">` (hoje `aba02.py:1091`) — o `.sensores` já tem
`margin-left:auto`, então a porta cai à esquerda do botão "Calibrar sensores da
mesa", os dois encostados à direita:

```html
        <a class="porta" href="mapa-do-controle.html" title="Abre o mapa do controle — as {len(PECAS)} peças do aparelho com nome, apelido e glifo, e as cores de fábrica para ver clicando. É a fonte da verdade das peças que este desenho usa.">Banco de provas: o mapa do controle&nbsp;↗</a>
```

Se o `aba02.py` não tiver um `PECAS` carregado do CSV como o `aba06.py` tem,
trocar `{len(PECAS)}` por `28` **não serve** — o número tem de vir do arquivo.
Copiar as três linhas de leitura do `aba06.py:16-18`.

## A prova

Depois de rodar `aba02.py`, medir que **nada se moveu**:

```
grep -o 'class="porta" href="[^"]*"' novo-layout/02-controles.html
```

e comparar a geometria de antes e depois. Foi assim que a primeira volta desta
porta foi reprovada na Navegação: a versão com borda tinha **19px** de altura contra os
**17** do `.quadro-titulo`, e **663 das 733 caixas da aba desceram 2px**. Sem
borda e sem preenchimento, a medição volta a bater caixa a caixa — 0 de 733 na
Navegação e 0 de 861 na Conexões.

## O que já está feito

- **Navegação → mapa do controle**: `aba06.py`, no `.quadro-topo` do quadro
  "Navegação". Medido: 0 de 733 caixas mudaram.
- **Conexões → mapa das portas**: `aba08.py`, no `.quadro-topo` de "Rádio e
  adaptadores". Medido: 0 de 861 caixas mudaram.
