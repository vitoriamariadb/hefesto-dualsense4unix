---
sprint: COR-NO-DISCO-01
estado: feita
posse:
  COR-NO-DISCO-01:
    - src/hefesto_dualsense4unix/interface/pacotes/a04_iluminacao.py
decisoes: []
bancada: true
---

# COR-NO-DISCO-01 — a cor escolhida sobrevive, e o trilho para de escurecer

**A queixa dela, na bancada de 09/09/2026:**

> *"o controle branco fica oscilando entre a cor que eu seleciono e a cor azul.
> fora que o slicer tá estranho ainda"* <!-- noqa-acento: citação literal dela -->

Ela contou como uma coisa. Eram duas, com **a mesma raiz**.

## §1 — O que o disco dela dizia

O override do controle branco, inteiro, medido no `personalizado.json` daquele
dia (endereço omitido — é identidade real):

```json
{"leds": {"lightbar_brightness": 0.49}}
```

**A cor que ela tinha escolhido não estava ali.** Não estava em lugar nenhum.

`_escrever_a_cor` — o caminho ÚNICO de escrita de cor da aba — mandava a cor ao
daemon por `led_set_detalhado` e parava. O daemon a guarda na camada VIVA
por-uniq, que some no primeiro evento que faça o resolvedor reler o perfil:
replug, `profile.switch`, reaplicação. O que sobra embaixo é a camada
automática (`player_slot_color(1)` = `#0000FF`) ou o global dela (`#2850B4`).
**Os dois são azuis.**

`_com_a_cor_gravada` já existia desde 08/09 e já carimba a procedência que
`cores_sem_colisao` lê. Tinha **um** chamador: desligar o automático. A escolha
de um tom nunca passou por ele.

## §2 — E o trilho era a mesma raiz

Sem cor no disco, o gesto `brilho` só podia adivinhar a cor pela luz **acesa** —
que vem pós-escala (D8) — e `cor_escolhida` só sabe desfazer a escala dos
catorze tons da guia. Toda cor fora deles voltava inteira e era escalada por
cima de si mesma.

Medido no aparelho dela, com `#2850B4` e o trilho **subindo**:

| arraste | acesa antes | acesa depois |
| --- | --- | --- |
| 80% → 60% | `(32,64,144)` | `(19,38,86)` |
| 60% → **70%** | `(19,38,86)` | `(13,26,60)` |
| 70% → **80%** | `(13,26,60)` | `(10,20,48)` |

**Subindo o brilho, a cor escurecia.** Em oito arrastes a barra morre no preto —
e "cor desconhecida" é justamente o estado em que `_a_cor_de_agora` cai para a
cor do slot. O azul de novo, pela outra porta.

O mesmo trilho com um tom da guia (`#FF8000`) funcionava perfeitamente, nas
mesmas condições. *Foi por isso que o defeito atravessou a bancada inteira sem
ninguém ver: quem testa com um dos catorze tons não o alcança.*

## §3 — A cura, e ela é uma pedra nas duas

1. **`_escrever_a_cor` grava a escolha dela** (`_guardar_a_cor_no_perfil`), nos
   dois atos em que ela decide sobre a cor: escolher um tom (`cor`, `reenviar`)
   e desligar a barra (`apagar`). O `brilho` passa por fora — ele não escolhe
   cor, e gravar ali congelaria uma cor que ela não pediu.
2. **O gesto `brilho` ganhou o primeiro degrau da escada:** cor GUARDADA → luz
   acesa invertida → cor do slot. Só o primeiro não adivinha.

**E a gravação não pode derrubar o gesto.** O `active_profile` pode nomear um
perfil que o disco não tem; a cor já chegou ao plástico dela, e levantar ali
poria um cartão de recusa sobre um ato que aconteceu. O `except` é `OSError` e
só — um `except Exception` engoliria um perfil malformado e a cor sumiria em
silêncio, que é o defeito que esta sprint mata.

## §4 — A medição depois da cura, no aparelho dela

| | 60% | 70% | 80% | 30% |
| --- | --- | --- | --- | --- |
| `#2850B4` (fora da guia) | `(24,48,108)` | `(28,56,125)` | `(32,64,144)` | `(12,24,54)` |
| `#FF8000` (tom da guia) | `(153,76,0)` | `(178,89,0)` | `(204,102,0)` | `(76,38,0)` |

Monotônico nas duas linhas. A cor no disco depois do primeiro clique:
`(40,80,180)` e `(255,128,0)` — antes da cura, `None`.

## §5 — A régua, e as três mordidas

`tests/unit/test_a_cor_escolhida_vai_ao_disco_e_o_trilho_nao_reescala.py`,
nove testes. As mordidas, provadas uma a uma:

| arrancar | reprova |
| --- | --- |
| a chamada de `_guardar_a_cor_no_perfil` | 4 de 9 |
| `_a_cor_guardada` do começo da escada | 2 de 9 |
| o `try/except OSError` | 1 de 9 |

A fixture usa `#2850B4` **de propósito**: um tom da guia daria verde sobre o
defeito.

## §6 — A regra que isto deixa

*Um gesto que só escreve na camada viva não escreveu.* A camada viva do daemon é
para o INSTANTE; o que a usuária escolhe tem de ir ao disco no mesmo ato, ou o
produto desfaz o gesto dela sozinho — e o que ela vê é o produto "oscilando".

E a segunda, que é de instrumento: *toda régua de escala tem de medir um valor
FORA do conjunto que a inversão conhece.* Os catorze tons eram o único caso em
que o defeito não aparecia, e era com eles que se testava.
