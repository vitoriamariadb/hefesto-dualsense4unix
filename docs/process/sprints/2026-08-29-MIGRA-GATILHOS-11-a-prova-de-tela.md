---
sprint: MIGRA-GATILHOS-11
onda: MIGRA-GATILHOS
posse:
  M11:
    - docs/usage/assets/readme_gatilhos.png
cria: []
bancada: true
depois_de:
  - MIGRA-GATILHOS-01
  - MIGRA-GATILHOS-02
  - MIGRA-GATILHOS-03
  - MIGRA-GATILHOS-04
  - MIGRA-GATILHOS-05
  - MIGRA-GATILHOS-06
  - MIGRA-GATILHOS-07
  - MIGRA-GATILHOS-08
  - MIGRA-GATILHOS-09
  - MIGRA-GATILHOS-10
  # SUBSTITUÍDAS por esta onda (ver o índice, "As sete sprints ONDA-GATILHOS").
  # Ficam aqui porque enquanto elas estiverem no disco a posse é real, e
  # silêncio não é declaração.
  - ONDA-GATILHOS-07
nao_toca:
  - src/
  - tests/
  - novo-layout/
---

# MIGRA GATILHOS · 11 — a prova de tela

**Zero código.** É de quem coordena, roda com a onda fechada, e é o que
efetivamente encerra a aba: **interface só fecha com o olho dela**
(`PROVA-DE-TELA-01`).

## Por que ela é uma sprint, e não um item de checklist

Porque o selo que esta aba carrega **caducou**, e a lição está escrita:

> *"aba gatilhos perfeita. Parabéns."* — 27/08

Aquele elogio valia para o desenho de **duas** colunas. **O gerador virou quatro
em 28/08 com o selo ainda colado**, e a própria
`novo-layout/_ferramentas/CORRECOES-DELA.md:118-121` registra a lição em 29/08:

> *"a lição de 28/08 é que um selo colado sem data acompanha um desenho que muda
> por baixo: o 'aba gatilhos perfeita' era de 27/08 e valia para o desenho de
> duas colunas, e o gerador virou quatro colunas no dia seguinte com o selo
> ainda colado."*

**Nenhuma sprint desta onda deveria executar antes de ela olhar as quatro
colunas no `ver.py`** — e esta é a que garante que ela olhe de novo **depois**,
com a aba viva.

## O que entrega

1. **A foto de antes**, tirada **antes** da primeira sprint da onda:

   ```bash
   scripts/gui-captura/retratar_abas.py     # um PNG por aba em docs/usage/assets/
   ```

2. **A foto de depois**, com a onda inteira integrada, pelo mesmo comando —
   nunca por clique. *"Não tente clicar por coordenada para focar a janela — já
   caiu noutro aplicativo duas vezes."*

3. **O confronto com o mockup.** `novo-layout/_ferramentas/ver.py 03` abre a
   página aprovada na mesma janela GTK3; a aba viva do produto abre ao lado. As
   duas telas, lado a lado, na mesa dela.

4. **Os estados que a foto do estado inicial NÃO mostra**, e que régua nenhuma
   desta casa mede, porque régua nenhuma clica. Fotografar um a um:

   | estado | por que ele escapa |
   |---|---|
   | a lista dos 19 modos **aberta** | é popup; só existe depois do clique — e a sprint **01** pode tê-la trocado por outra coisa |
   | um modo de **11 barras** escolhido | a cena estática nunca o mostra (sprint **06**) |
   | mesa com **um** controle, e com **zero** | o mockup só desenha quatro (sprint **04**) |
   | um chip **cinza** (plástico desconhecido) | metade da mesa dela é rádio, e a cor não chega por lá |
   | "Meus efeitos" com **uma** curva salva | não existe até a sprint **10** correr |
   | o recibo de uma **recusa** por parâmetro (*Fim ≤ Início*) | precisa de um gesto errado de propósito |

5. **A memória, medida com a janela aberta nesta aba.** O aditivo custou
   62 → ~285 MiB PSS; o substitutivo foi medido na sprint **03**. O número final
   entra aqui, porque é o que ela aceitou ou não.

## Como se prova (a mordida)

A mordida de uma conferência é **ela apontar um defeito que as réguas deixaram
passar** — e nesta casa isso já aconteceu tantas vezes que virou regra
(*"ela lê o aparelho melhor que eu leio o código"*).

Concretamente, o que **reprova** esta sprint:

1. **Uma foto do "depois" idêntica à do "antes"** — a onda mudou a aba inteira
   de motor; foto igual significa que o `retratar_abas.py` fotografou a página
   antiga, ou que o enxerto não pegou. É o mesmo sinal que derrubou a rota do
   emissor GTK em 29/08: *mudou-se uma linha do mockup e a foto saiu
   byte-idêntica*.
2. **Qualquer um dos seis estados da tabela sem foto.** Um estado não
   fotografado é um estado não conferido.
3. **A tela dizendo "confirmado no aparelho"** em qualquer lugar.
   `gatilho.leitura` é `não`/`não` nos dois transportes no
   `docs/data/mapa-controles.csv`. O verbo é **escrito**.
4. **Qualquer um dos 19 modos desenhado como se agisse sem que o mapa o
   sustente.** `gatilho.modos_firmware@dualsense` é `parcial`/`parcial`, e a
   ressalva é nominal — ver *"O que esta sprint leva para a bancada"*, abaixo.
   `scripts/check_paridade_transporte.py` reprova afirmação forte sem teste que
   a sustente, e ele é portão.

## O que esta sprint leva para a bancada — e é a divergência mais séria da aba

**O mapa de canais desmente DOIS dos 19 modos, e ninguém mediu.** Célula literal
de `docs/data/mapa-controles.csv`, `gatilho.modos_firmware@dualsense`, nos dois
transportes:

> *"DIVERGÊNCIA VIVA: `weapon()` manda PULSE_B = 0x06 (Simple_Vibration legado) e
> `vibration()` manda PULSE_A = 0x22 (Bow). Confirmado no código hoje
> (trigger_effects.py:461 e :474). Ficaram fora do grupo dos SETE curados e do
> dos CINCO travados por sensação — **ninguém mediu se fazem alguma coisa**."*

Conferido de novo em 29/08 no fonte: `core/trigger_effects.py:461-466`
(`weapon` → `TriggerMode.PULSE_B`) e `:469-481` (`vibration` →
`TriggerMode.PULSE_A`).

A aba desenha *Disparo (Weapon)* e *Vibração* como modos vivos, com barras de
ajuste e valores. **Mostrar como ativo o que o mapa desmente é exatamente o que
o portão existe para reprovar.**

**A medição é dela, pelo tato**, como foi a de 01/08 que curou os sete: escolher
os dois modos, sentir o gatilho, e dizer se acontece alguma coisa. Se não
acontecer, os dois saem da lista ou ganham um aviso — e isso é sprint nova, fora
desta onda.

## Antes de fechar a onda

```bash
scripts/gui-captura/retratar_abas.py    # as fotos acompanham a versão
git add -A                              # os portões são cegos a arquivo novo
bash scripts/portoes.sh                 # os 26 portões, ~2 min
python3 scripts/check_colisao_de_sprints.py
```

E a suíte em **oito lotes**, no fim, com a máquina livre — nunca num processo
só, que morre no meio sem traceback e sem sumário. **Ela cria nós uinput de
verdade**: 1289 num dia derrubaram a sessão gráfica dela.

## O que é dela decidir

**A aba inteira.** Aprovar o mockup não é aprovar a tela, e o selo de 27/08 já
provou que aprovar um desenho não é aprovar o desenho seguinte.
