---
sprint: ONDA0-F-A-FOLHA-01
estado: feita
posse:
  F:
    - src/hefesto_dualsense4unix/interface/monta.py
    - src/hefesto_dualsense4unix/interface/onde.py
cria:
  - tests/unit/test_o_botao_cinza_diz_a_razao.py
  - tests/unit/test_a_linha_de_ressalva_so_nasce_quando_ha.py
bancada: false
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/aba05.py
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba08.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/aba10.py
  - docs/data/paridade-gtk-html.csv
---

> **ESTADO 06/09/2026: feita** — S-02 e S-03 FEITAS (índice da ONDA QUATRO).

# ONDA0-F · A FOLHA — o botão cinza, e a linha que só nasce quando há o que dizer

**Você é dono de `monta.py`, e ele é o arquivo mais compartilhado da
interface: 18 módulos importam dele.** Por isso esta frente vem antes das dez
abas, e por isso ela é pequena de propósito — duas peças de CSS que as dez usam.

**Leia antes de tocar em código:**
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) §4 ·
[COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md).

---

## 1. S-03 · O BOTÃO CINZA, COM A RAZÃO NA DICA (D-03)

**Decisão dela:** *"Cinza antes, com a razão na dica."*

**O que está em jogo, medido:** a janela antiga apaga o botão e diz por quê
ANTES; esta deixa clicar e responde DEPOIS. A tela em repouso não distingue o
botão que funciona do que vai recusar. Ela aceitou o custo por escrito: **a
folha desta interface não tem estado apagado para `.btn` — é CSS novo, e mexe
no que ela aprovou.**

Onde ela chega, e são seis abas:

| aba | os botões |
| --- | --- |
| `02` | 🎙 e ♪ — três casos medidos em que parecem clicáveis e não são |
| `06` | o interruptor do mouse fora de "Controlar o PC" |
| `08` | o microfone (quatro condições) e "A luz não acende" (três) |
| `09` | "Retomar", "Reiniciar o serviço", "Ver os plugins carregados" |

**A regra que a folha tem de respeitar, e ela vem de duas decisões do PO:**

* na `09` o botão fica **apagado e ainda assim responde** ao clique — é a única
  forma que diz o porquê sem exigir o rato. Logo o estado apagado é **visual**,
  não `disabled`: `disabled` mata o clique e mata o recado junto.
* na `08` o motivo vira **um `?` ao lado**, e o texto dele é do **produto**,
  nunca do desenho — a frase congelada já mentiu ali ("está no cabo" com o
  controle no rádio).

A página já tem cara de apagado para os botões do seletor (`.seg
button:disabled`) desde 31/08. **Reuse aquela gramática**; não invente uma
segunda.

## 2. S-02 · A LINHA DE RESSALVA CONDICIONAL (D-02)

**Decisão dela:** *"Linha fixa só quando HÁ ressalva."*

No estado normal **não ocupa nada**. No estado estranho nasce uma linha curta
ao lado do valor. É a regra dela de 30/08 (*"texto na interface é zero"*) sem
o preço que ela cobra — o silêncio que engana.

A peça é uma só e as dez abas a usam: o `:empty{display:none}` que a tira de
estados da `06` já tem, **promovido a peça da folha**. Ela fecha ~8 linhas do
CSV, em cinco abas:

| aba | a ressalva |
| --- | --- |
| `04` | a razão do tracejado — Nativo · Steam · fonte desconhecida · apagada |
| `05` | a linha de estado da vibração, **por coluna** (D-14) |
| `06` | o portão de modo, e o custo de desligar o teclado |
| `08` | quatro das cinco curas do Check-up, hoje só dentro do `?` |
| `02` | a confissão de que o mudo caiu noutro controle |

**O que você NÃO faz:** escrever a ressalva de nenhuma aba. Você entrega a
peça e a régua; quem a usa é cada frente de aba, na Onda 2.

---

## A MORDIDA

| o que | arranque isto | e veja reprovar |
| --- | --- | --- |
| botão cinza | a regra de estilo do apagado | a régua vê o botão travado com a mesma cara do clicável |
| linha de ressalva | o `:empty{display:none}` | a régua vê a linha ocupando altura com a ressalva vazia |

**A régua tem de LER, não digitar.** É a família de defeito que esta casa já
pagou onze vezes em 26/08: réguas que reprovavam a melhora porque digitavam o
que deviam ler. A sua régua lê o CSS gerado por `monta.py`, não uma cópia dele.

## A TELA

Como as dez páginas nascem do gerador, a prova é regerar e olhar: foto
`--oculta` antes e depois de **pelo menos duas abas** (a `09`, que tem os três
botões sem trabalho, e a `06`, que tem a tira de estados). **Sempre `--oculta`:
ela tem UMA tela.**

## O QUE VOCÊ RELATA EM VEZ DE EDITAR

Se a peça pedir mudança num `abaNN.py` <!-- ref-externa: molde de nome, não arquivo: são as dez, de aba01.py a aba10.py -->, **relate — não edite**. Aqueles dez
arquivos são das dez frentes da Onda 2, e a sua edição desfaria a delas em
silêncio. É a R1 da casa.
