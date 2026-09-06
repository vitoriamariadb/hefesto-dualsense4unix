---
sprint: PARIDADE-REMEDIR-01
estado: aberta
decisoes: [D-0609-A-UNICA-FILA-E-A-PARIDADE]
posse:
  PARIDADE:
    - docs/data/paridade-gtk-html.csv
depois_de: [ONDA4-S10-O-TRANSPORTE-01, ONDA5-10-03, LUZES-01, STEAM-INPUT-01, SISTEMA-STEAM-01, CONTROLES-VERDADE-01, NAVEGACAO-TECLAS-01, PERFIL-MODO-01, CONEXOES-LIGAR-TUDO-01, MIC-VIRTUAL-02]
nao_toca:
  - src/
  - tests/
  - scripts/
  - mockup/
---

# PARIDADE-REMEDIR-01 · A régua para de medir o mundo de ontem

> **A fila desta casa é UMA, e é o CSV da paridade** (decisão de coordenação de
> 06/09). Sprint antiga não se despacha pelo id: **se o que ela pedia ainda
> falta, é linha do CSV.**
>
> **Esta sprint é do COORDENADOR e roda em SÉRIE**, na onda D, depois de A–C
> costuradas. Ela não é de agente: quem a executa precisa ter lido todos os
> relatórios da leva ao mesmo tempo.

---

## 1. POR QUE ELA EXISTE — o CSV já sabe que envelheceu, em dois lugares

O CSV **não é desleixado** — ele registra as próprias dúvidas. Duas linhas da
aba 04 dizem, no campo `porque`:

* *"**FATO DERRUBADO em 04/09/2026**: a linha do publicado é hoje `<input
  type="color" class="livre" value="#0000ff" data-gesto="cor"` — **igual à do
  mockup**"*;
* *"**FATO DERRUBADO em 04/09/2026**: `grep -c 'data-campo="hex"'` dá **18 nos
  DOIS**. **VEREDITO A REVER**"*.

**O veredito continua `FALTA_NO_HTML` nas duas.** É a régua medindo o mundo de
ontem — e o custo é direto: uma sprint escrita sobre essas linhas mandaria
**construir o que existe**.

**A régua que fecha o dia é esta.** O número da §7 do plano (`FALTA ≤ 60`) só
vale se as linhas disserem a verdade.

---

## 2. O TRABALHO — quatro leituras, em ordem

### 2.1 As que A–C fecharam

Cada sprint da leva **RELATA** o veredito novo com o endereço lido. **Leia os
relatórios em `docs/process/agentes/2026-09-06/`** e aplique.

### 2.2 As que 05/09 e as decisões D1/D2/D3 envelheceram

Linhas escritas antes das decisões dela sobre o perfil (clicar já aplica e já
grava; cinco coisas ficam globais). O que elas cobram pode ter deixado de ser
dívida por decisão, não por código.

### 2.3 As duas do `↻` — 106 e 108

**Decisão dela, 06/09:** o `↻` de reenvio da aba 03 **SAI**. As duas linhas
fecham como **DIFERENTE decidido** — não como FALTA, e não como IGUAL.

### 2.4 As que as decisões de 06/09 tiraram de cena

Editor avançado de regra (10-Q2), "Mapear Entrada a Entrada" (08), o custo da
máscara antes do clique (10-Q6), Liberar/Devolver do som (02-Q6), controles
externos. **Nenhuma delas é FALTA**: são **decisão**, e o campo `porque` diz
qual, com a data.

---

## 3. A REGRA QUE NÃO SE NEGOCIA

> **Nenhuma linha vira IGUAL sem endereço lido no código.**

Não basta o relatório de um agente afirmar. **Abra o arquivo, leia a linha, e
cole o endereço no CSV.** Foi assim que as duas linhas da 04 puderam registrar
o próprio erro em vez de o esconder — e é a diferença entre uma régua e uma
opinião.

**E a régua de IGUAL é mais dura que a de FALTA:** `check_paridade_gtk_html.py`
exige **sinal PRESENTE e endereço**. Se o sinal não estiver lá, o veredito
certo é `DIFERENTE`, não `IGUAL`.

---

## 4. O QUE ESTA SPRINT NÃO FAZ

* **Não toca em uma linha de código.** `src/`, `tests/`, `scripts/` e `mockup/`
  estão no `nao_toca`. Se uma linha do CSV só puder ser resolvida mexendo no
  produto, **ela não se resolve aqui**: vira sprint, com posse.
* **Não apaga linha.** Fato errado se **substitui**; decisão medida ganha
  **nota datada**. O teste que separa os dois está no `CLAUDE.md`: *apagar isto
  faria alguém repetir um trabalho ou pagar um custo já pago?*

## 5. O QUE SE MEDE, E ENTRA NO HANDOFF

```
check_paridade_gtk_html.py --tabela
```

**Hoje:** 396 feats · 119 IGUAL · 125 DIFERENTE · **89 FALTA** · 59 SÓ-HTML ·
4 ? · **30 %**.

**Meta das 24 horas:** **FALTA ≤ 60**, e o terceiro número sobe — **a régua diz
quanto**, não a expectativa.

**E o número tem de ser HONESTO.** Um FALTA que virou IGUAL sem endereço lido é
pior que um FALTA que ficou: ele fecha a fila sobre trabalho que ninguém fez.
