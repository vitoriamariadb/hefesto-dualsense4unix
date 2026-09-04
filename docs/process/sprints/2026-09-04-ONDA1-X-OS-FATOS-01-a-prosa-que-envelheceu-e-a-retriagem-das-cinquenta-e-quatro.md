---
sprint: ONDA1-X-OS-FATOS-01
posse:
  X:
    - docs/data/paridade-gtk-html.csv
    - docs/process/2026-09-03-O-TERCEIRO-NUMERO-a-paridade-com-a-gtk.md
    - docs/process/2026-09-04-AS-232-LINHAS-ABERTAS-o-que-falta-de-verdade.md
bancada: false
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - docs/process/2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md
  - docs/process/SPRINT_ORDER.md
---

# ONDA1-X · OS FATOS — a prosa que envelheceu, e a retriagem das 54

**Você é o único dono de `docs/data/paridade-gtk-html.csv` nesta leva.** Dez
frentes de aba vão fechar linhas dele na Onda 2, e **nenhuma delas o edita** —
elas relatam, e você lança. Um CSV editado por dez agentes em paralelo é um
conflito de merge por linha, num arquivo em que a linha é o dado.

**Você não toca em código.** Se um fato exigir cura de código, **relate** — a
frente dona daquele arquivo a faz.

---

## 1. T-06 · A PROSA DIZ 14% E A TABELA DIZ 27%

A sprint está em
[O-TERCEIRO-NUMERO-ENVELHECEU-01](2026-09-04-O-TERCEIRO-NUMERO-ENVELHECEU-01-a-prosa-diz-14-e-a-tabela-27.md).

É a regra da casa, e ela é dela (11/08): **fato errado se SUBSTITUI, e sai de
TODOS os lugares onde aparece.** Uma correção pela metade deixa as duas versões
vivas, que é o defeito que a regra existe para matar.

**O teste que separa apagar de anotar:** *se apagar isto faria alguém repetir
um trabalho ou pagar um custo já pago?* Se sim, é decisão medida e leva data.
Se não — é só um número errado — sai.

## 2. A RETRIAGEM: as 54 decididas deixam de ser `DESENHO`

**As 54 perguntas das dez abas foram decididas em 04/09**, em
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md).
As 74 linhas do balde `DESENHO` **paravam na palavra dela** e não param mais.

O seu trabalho é a coluna `porque` de cada uma dessas linhas: onde ela diz
*"espera decisão dela"*, ela passa a dizer **o que foi decidido e onde está
escrito**. É o que impede a próxima pessoa de reabrir a pergunta.

**Sete linhas mudam de sinal, não só de texto** — são os sete conflitos da §1
daquele documento, em que a recomendação da lista da aba propunha o contrário
do que ela já tinha decidido. Duas delas (`01`[04] e `02`[01]) **morreram**: a
decisão dela já cobria o fato, e abrir um segundo canal para ele é o que a
regra *um fato, um sinal* recusa. Marque-as como fechadas por decisão, não como
dívida.

## 3. DOIS FATOS QUE CAÍRAM, e os dois encurtam a fila

Medi os dois em 04/09, e os dois estão escritos em documento que **você não
edita** — o seu trabalho é fazer o CSV e o documento das 232 concordarem com
eles:

**O balde `PUBLICAR` está VAZIO.**

```
$ .venv/bin/python scripts/check_o_desenho_aprovado.py
desenho: 13 página(s) na bancada `mockup/`
  o produto já tem ..... 13
  o produto está atrás . 0  (0 em trabalho)
```

As treze páginas foram publicadas na madrugada. As seis features que o
documento das 232 diz esperarem uma palavra dela **não esperam mais**.

**O número 232 envelheceu.**

```
DIFERENTE 125 · FALTA_NO_HTML 101   ->  226 abertas
IGUAL 107 · SO_NO_HTML 59 · NAO_DA_PARA_SABER 4
```

**Confira os dois com as próprias mãos antes de escrever qualquer número** — é
a regra que 03/09 pagou quatro vezes num dia: **ler a linha não é medir o
ato**, e um número herdado de um documento é leitura de segunda mão.

## 4. O QUE FICA PARA UMA SEGUNDA PASSAGEM

Quando a Onda 2 fechar, as dez frentes vão relatar as linhas que fecharam. **A
segunda passagem é sua**, e ela é o lançamento daqueles relatos no CSV. Não
tente antecipá-la: linha marcada como fechada antes de a cura existir é
exatamente o instrumento falso que esta casa achou quatro vezes em 03/09.

---

## A MORDIDA

Um documento não tem mordida de teste — tem **medição refeita**. Para cada
número que você escrever, cole o comando que o produziu, rodado por você nesta
árvore. Número sem comando ao lado é afirmação, e afirmação já derrubou três
diagnósticos meus num dia.

E rode `scripts/check_paridade_gtk_html.py` **antes e depois**: ele é portão, e
ele é quem diz se o CSV continua legível pela máquina que o lê.
