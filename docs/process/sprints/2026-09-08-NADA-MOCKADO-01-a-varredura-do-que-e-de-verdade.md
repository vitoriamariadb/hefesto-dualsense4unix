---
sprint: NADA-MOCKADO-01
estado: aberta
posse:
  NADA-MOCKADO-01:
    - tests/unit
    - scripts
bancada: false
depois_de: []
---

# A varredura do que é de verdade

## A palavra dela, e ela é uma PERGUNTA que vira portão

> *"acelerômetro, giroscópio, máscara nintendo e modo (tanto o switch ps + R3)
> quanto o funcionamento mútuo delas estão funcionando? e serão reconhecidos in
> game? Tipo todas as features aqui. **não tem nada rodando em sandbox ou
> mockada, certo?**"*

**Esta pergunta não se responde com uma resposta — ela se responde com um
PORTÃO**, senão a resposta envelhece no dia seguinte. É a mesma forma do
`casa-sabe`, que responde *"o produto FAZ o que a casa diz?"*.

## Por que esta casa não pode responder de cabeça

Está escrito, e é a cicatriz de 03/09: **quatro instrumentos davam verde sobre
nada**. E em 04/09: *"a máscara que NUNCA gravou um byte — o dicionário ia como
`timeout` posicional, e o dublê do teste era mais frouxo que a ponte real"*.

**A máscara Nintendo está nesta lista de cicatrizes.** Ela é uma das sete linhas
da conferência dela justamente por isso, e hoje passa — mas a conferência mede
que `FLAVORS["nintendo"]` anuncia `0x057E:0x2009`, **não** que um jogo a
reconhece.

## O que fazer, e a ordem é a do custo

1. **O INVENTÁRIO**: liste TODA feature que a tela oferece e, para cada uma,
   diga onde ela é provada — régua de árvore (lê o código), régua de dublê
   (exercita com um falso), ou **APARELHO** (toca o hardware). O
   `docs/data/mapa-controles.csv` já tem a coluna `provado_por`: 77 linhas
   respondidas, e **`aparelho` em 44**. Comece por ali, não do zero.
2. **A COLUNA QUE FALTA é "reconhecido no jogo"** — e ela é diferente de "chega
   ao aparelho". Um giroscópio que o daemon publica e que o SDL não expõe não
   está entregue. O caminho é o `vpad`: o que o JOGO lê é o nó uinput/uhid, não
   o DualSense.
3. **O PORTÃO**: toda feature com selo forte na tela tem de ter prova de
   APARELHO ou uma ressalva declarada. Sem isso o selo é desenho fingindo ser
   produto.

## O que MORDE

* uma feature nova com selo forte e sem prova de aparelho → reprova nomeando
  ela;
* uma prova que usa dublê mais frouxo que o real → reprova (é a cicatriz de
  04/09, e o `test_a_ponte_real_e_o_duble_concordam` é o molde);
* a lista de features é LIDA da tela, nunca digitada no teste — senão ela
  envelhece no dia em que nascer a próxima.

## O que já se sabe HOJE, e não é pouco

* **giroscópio e acelerômetro**: os quatro publicam, medido no `state_full` de
  08/09 (`sensores` presente nos quatro, inclusive nos do rádio) — e em 04/09 a
  cura alcançou o não-primário, que era metade da mesa dela;
* **máscara Nintendo**: `FLAVORS["nintendo"] = 0x057E:0x2009`, conferido pela
  régua dela;
* **modo (PS + R3)**: `hotkey.py` responde ao gesto — mas o **funcionamento
  mútuo** que ela pergunta (uma feature ligada quebrando outra) é exatamente o
  que nenhuma régua cobre hoje.
