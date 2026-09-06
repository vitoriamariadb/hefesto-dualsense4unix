---
sprint: ONDA0-P-O-PILOTO-01
estado: feita
posse:
  P:
    - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
    - src/hefesto_dualsense4unix/gui/ponte_da_tela.py
    - src/hefesto_dualsense4unix/app/theme.py
cria:
  - scripts/ensaios/a_tela_nao_fica_nua.py
  - tests/unit/test_o_pintor_marca_o_checkbox.py
  - tests/unit/test_a_barra_da_janela_segue_o_sistema.py
  - tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py
bancada: true
depois_de: [MIGRA-CONTROLES-03]
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/onde.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - docs/data/paridade-gtk-html.csv
---

> **ESTADO 06/09/2026: feita** — S-01 FEITA e a T-01 fechada (índice da ONDA QUATRO; plano das 24 horas, §1).

# ONDA0-P · O PILOTO — a tela que não fica nua, e o canal que só sabia recusar

**Você é dono do piloto das dez abas.** Nenhuma das dez frentes de aba pode
tocar o `hefesto_vivo.py` — elas esperam por você. O que você entregar aqui faz
as dez seguintes custarem metade; é a mesma lição dos quinze defeitos de forma
de 23/08, em que consertar aba por aba pagaria quinze vezes o mesmo preço.

**Leia antes de tocar em código:**
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) §4
(a onda) e §1 (os sete conflitos — três deles caem no seu trabalho) ·
[COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md), obrigatório: o seu trabalho é
a tela inteira.

---

## 1. T-01 · A TELA NUA — é o único defeito VIVO, e vem primeiro

A sprint inteira, com a foto dela, as quatro hipóteses e a mordida, está em
[A-TELA-NUA-01](2026-09-04-A-TELA-NUA-01-a-interface-perdeu-o-estilo-sozinha.md).
**Faça-a antes das outras quatro.** Ela viu acontecer; as outras são features.

O que fica, independente da causa:

* o piloto ouve `web-process-terminated` e **recarrega** a página à vista, com
  recado no stderr e no cartão;
* `scripts/ensaios/a_tela_nao_fica_nua.py` — 20 minutos `--oculta`, lendo
  `getComputedStyle(document.body).backgroundColor` a cada minuto. **A régua
  tem de viver no tempo**: a regressão de 29/08 só aparecia aos 181 segundos.

**A mordida:** mate o `WebKitWebProcess` FILHO do piloto — **por PID conferido
com `ps -o pid,ppid,cmd`, nunca por padrão de nome.** Um `pkill -f` já derrubou
o compositor dela em 04/09, e a conversa morreu com ele.

## 2. S-01 · O CANAL DE RECADO DE SUCESSO (D-01)

**Decisão dela:** *"No próprio cartão, como a recusa."*

Hoje o piloto só carrega ao cartão a frase de **recusa** — o depósito por
controle, a poda por tempo e a pintura já existem (`_recusou_dizendo`). Falta o
caminho do **sucesso**, e ele é uma peça só que fecha cinco linhas do CSV, em
cinco abas (02, 03, 05, 06 e 09).

Regras que vêm dela e não se negociam:

* **é aviso, não estado** (palavra dela, 02/09): nasce, vive poucos segundos e
  some sozinho. A recusa vive 30 s; o sucesso é mais curto de propósito.
* pousa **na coluna do controle em que ela clicou**, como a recusa.
* o caso da D-12 tem frase própria e ela já está escrita:
  *"o microfone ligou, mas o canal dele está mudo no sistema"* — meia-verdade
  não é sucesso.

**Três conflitos do PO caem aqui, e os três dizem a mesma coisa:** as listas
das abas 03 e 05 propunham um segundo canal de sucesso (o campo que pisca, a
faixa embaixo da grade). **Não construa nenhum dos dois.** É um fato, um sinal;
a decisão dela é o cartão, e ele vale para as cinco abas.

## 3. T-07 · O DÉCIMO ALVO, `marcado`

A sprint está em
[PINTOR-MARCADO-01](2026-09-04-PINTOR-MARCADO-01-o-decimo-alvo.md).
Decisão dela: `5-a`. O pintor ganha `data-hef-alvo="marcado"`, que escreve
`el.checked`, e a régua de alvos ganha a linha.

**A metade do endereço é da aba 02, não sua.** Você constrói o alvo e prova que
ele escreve; quem põe o `data-hef-alvo="marcado"` no checkbox do acordeão é a
frente da aba 02, na Onda 2. **Relate isso na entrega** — é a R1 da casa:
quando o conserto pede arquivo alheio, relate em vez de editar.

## 4. T-05 · A BARRA DA JANELA (decisão dela: `1-a`)

A sprint está em
[BARRA-DA-JANELA-01](2026-09-04-BARRA-DA-JANELA-01-os-botoes-do-lado-do-sistema.md).
Só a janela do Hefesto: o produto pede ao GTK, dentro do próprio processo, ao
lado de onde ele já pede o tema (`app/theme.py`,
`adotar_o_tema_da_sessao`). **Nenhuma linha na configuração dela.**

É a mesma forma da cura do tema de 04/09: o produto **pergunta** a sessão e se
ajusta, em vez de exigir que a sessão se ajuste a ele.

## 5. O ESTADO "EM VOO" DO BOTÃO (`09` [03], decidido pelo PO)

Não existe estado "em voo" em nenhuma das dez abas, e há um gesto que fica
**nove segundos e meio calado**. Decidido: **o botão diz que está
trabalhando** — o rótulo troca enquanto o gesto está no ar e volta sozinho.

Fala **durante** a espera, no lugar exato do clique. É peça do piloto porque
vale para os gestos das dez abas, não só para o da 09.

---

## A MORDIDA, e ela é de VOCÊ, não do conferente

Cinco entregas, cinco mordidas:

| o que | arranque isto | e veja reprovar |
| --- | --- | --- |
| tela nua | o `reload` do `web-process-terminated` | o ensaio de 20 min acusa o minuto em que a folha morreu |
| recado de sucesso | o caminho do sucesso no depósito | o teste vê o cartão mudo depois de um gesto que deu certo |
| alvo `marcado` | a linha do `el.checked` | o teste vê o checkbox nascer sempre fechado |
| barra da janela | a chamada do `set_property` | o teste vê o `gtk-decoration-layout` da sessão dela |
| estado em voo | a troca do rótulo | o teste vê o rótulo igual durante o gesto |

**Régua que passa com a cura arrancada não mede nada.** E a lição de 04/09, que
custou quatro verdes falsos numa madrugada: **quando o instrumento e o aparelho
discordam, o aparelho ganha.**

## A TELA

Foto `--oculta` antes e depois — **sempre `--oculta`: ela tem UMA tela**, e
janela que nasce na frente dela quebra o que ela está fazendo. Clique o que
mudou e mostre a resposta. Botão que você acrescentou e nunca clicou não está
entregue.

## A BANCADA

`bancada: true`, mas o seu uso é de **leitura**: o piloto pinta com o daemon
vivo. **Não pare o daemon e não escreva no aparelho** — quem escreve nesta leva
é a frente do motor, e a bancada é dela. Rode `scripts/bancada.sh exigir` antes
de qualquer caminho que fuja disso, e se der `rc=1`, **espere e diga que está
esperando**.
