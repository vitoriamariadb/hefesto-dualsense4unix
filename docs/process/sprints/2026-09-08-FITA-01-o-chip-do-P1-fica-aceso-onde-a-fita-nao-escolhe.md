---
sprint: FITA-01
estado: feita
posse:
  FITA-01:
    - src/hefesto_dualsense4unix/interface/monta.py
bancada: false
depois_de: []
---

# FITA-01 — o chip do P1 fica aceso nas abas em que a fita não escolhe nada

> **FEITA em 08/09/2026 — `d63bbd73`, e a 07 em `1bebb847`.** A terceira regra passou a
> dizer o mesmo que as duas de cima: `.fita.inerte .chip.on{border-color:var(--border-sutil);
> background:transparent}` (`topo.html:285`, com a razão escrita em `:258-284`). As três
> abas que ESCOLHEM (`01`, `02`, `08`) saíram byte-idênticas — a cura é só da fita inerte,
> como a §2 mandava. A 07 ficou de fora na primeira leva por ser posse de outra frente e
> entrou regerada em `1bebb847`. A régua é `tests/unit/test_a_fita_inerte_nao_acende_ninguem.py`.

**Achado por ELA em 08/09/2026, na aba Gatilhos.** Palavras dela: *"o player 1
tipo no caso cosmic red - cabo, fica sempre selecionado com borda diferente mesmo
nas abas que cada player tem sua propria config. conseguimos deixar ele cinza  <!-- noqa-acento: citação literal dela, palavra por palavra -->
como os demais?"*

## §1 — A causa, medida, e ela NÃO é a que parece

A hipótese óbvia — *"a aba Gatilhos está na lista das que escolhem"* — está
ERRADA, e conferir isso primeiro economiza a sprint inteira:

```
monta.ABAS_QUE_ESCOLHEM = {"01-jogar", "02-controles", "08-conexoes"}
```

A Gatilhos não está lá. A fita dela **já nasce `inerte`**, e o `title` já explica
que a aba não usa o controle escolhido. O produto está certo nessa parte.

**O DEFEITO É DE CSS, em `interface/topo.html:204-208`:**

```css
.fita.inerte .chip{border-color:var(--border-sutil);background:transparent;
.fita.inerte .chip.plastico{border-color:var(--border-sutil);border-width:1px}
.fita.inerte .chip.on{border-color:var(--comment);background:transparent;
```

As duas primeiras linhas apagam o chip na fita inerte — é o que ela quer. **A
terceira desfaz as duas** para o chip `.on`, devolvendo uma borda própria
(`--comment`) ao que está marcado. Numa fita que não escolhe nada, "o marcado"
não quer dizer coisa nenhuma para quem olha — e é exatamente o que ela leu como
*"fica sempre selecionado"*.

## §2 — O QUE ESTA SPRINT ENTREGA

1. Na fita **inerte**, o chip `.on` fica igual aos outros. A decisão dela é
   textual: *"conseguimos deixar ele cinza como os demais?"*
2. **ANTES DE APAGAR, MEÇA O QUE O `.on` SIGNIFICA.** Ele pode carregar mais de
   uma coisa (o alvo escolhido, o controle conectado, o primário) — e apagá-lo
   sem olhar pode tirar informação que a fita ATIVA precisa. A cura é só para
   `.fita.inerte`; a fita que escolhe não muda.
3. Confira nas SETE abas de fita inerte, não só na Gatilhos. Curar uma e deixar
   seis é a forma de defeito que esta casa mais paga.

## §3 — A MORDIDA

Devolva a regra `.fita.inerte .chip.on` e a régua tem de REPROVAR, medindo a
COR COMPUTADA da borda na página publicada — não o texto do CSS. Régua que lê o
próprio arquivo que a cura editou não mede a tela.
