---
sprint: ONDA-LANCADORES-09
estado: absorvida
onda: ABA-LANCADORES
posse:
  L9:
    - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-09-o-selo-o-controle-chega.md
  - src/hefesto_dualsense4unix/integrations/chegada_do_controle.py
  - tests/unit/test_o_selo_nao_mente.py
bancada: false
depois_de:
  - ONDA-LANCADORES-01
  - ONDA-LANCADORES-03
  - ONDA-LANCADORES-04
  - ONDA-LANCADORES-05
  - ONDA-LANCADORES-06
  - ONDA-LANCADORES-07
  - ONDA-LANCADORES-08
nao_toca:
  - src/hefesto_dualsense4unix/integrations/prontuario_dos_jogos.py
  - src/hefesto_dualsense4unix/integrations/lancadores_instalados.py
  - src/hefesto_dualsense4unix/gui/main.glade
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA LANÇADORES · 09 — o selo "o controle chega", e a régua antes dele

**O defeito, em uma frase:** o selo mais importante da aba não tem medição
nenhuma por trás, e um selo verde sem medição é o instrumento que mente — o
defeito que esta casa mais paga.

O redesenho diz isso sem rodeio no item 5 do "falta decidir": *"Nenhuma linha de
código mede hoje. Precisa de spec antes de virar selo na tela."* E a decisão dela
sobre o placeholder diz o porquê: *"sem forma de medir 'o controle chega nesse
lançador', a coluna vira instrumento que mente"*.

## O que entrega — a spec primeiro, o selo depois

`integrations/chegada_do_controle.py`, com **três estados e a evidência exigida
por cada um**:

| Selo | Só pode sair quando | Fonte |
|---|---|---|
| **CHEGA** | há evidência **positiva** naquele lançador: uma ponte confirmada com o jogo aberto | `PONTE_CONFIRMADA`, `prontuario_dos_jogos.py:126-140` |
| **NÃO CHEGA** | há um estorvo **nomeado** naquele lançador | os cinco de `prontuario_dos_jogos.py:139-143` |
| **NÃO SEI** | o padrão — nenhuma das duas | — |

**A regra que dá o nome à sprint: CHEGA nunca sai por ausência de impedimento.**
O próprio prontuário já recusa esse atalho — `SEM_IMPEDIMENTO_CONHECIDO` *"não é
promessa de que vai funcionar; é a ausência de motivo conhecido para não"*
(`prontuario_dos_jogos.py:19-21`), e o módulo inteiro nasceu porque dois jogos
dela têm assinatura idêntica no disco e um funciona e o outro não.

**A consequência, e é preciso dizê-la em voz alta:** o mockup pinta **cinco** dos
seis cartões como CHEGA. Na primeira versão, quase nenhum terá evidência positiva
— então a tela vai mostrar **NÃO SEI** onde o desenho mostra verde. É mais feio e
é honesto; o contrário é a aba mentindo em cinco linhas de seis no primeiro dia.

## A mordida

`tests/unit/test_o_selo_nao_mente.py` é um **portão**, não um teste de conforto:

1. Censo **sem** ponte confirmada e **sem** estorvo → o selo é **NÃO SEI**.
   Arranque a cura (deixe a ausência de estorvo virar CHEGA) → o teste reprova
   nomeando o lançador que ficaria verde por ignorância.
2. Censo com um estorvo nomeado → **NÃO CHEGA**, e o nome do estorvo viaja junto
   (é o que a 04 mostra).
3. Censo com `PONTE_CONFIRMADA` → **CHEGA**, e só nesse caso.
4. Lançador que o produto não sabe examinar → **NÃO SEI**, nunca CHEGA.

Leia o cabeçalho de `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py` antes
de escrever este: é o molde de portão desta casa.

## O que é dela decidir

1. **Ela aprova esta régua?** É o item 5 do "falta decidir", e é a pergunta que
   trava a aba inteira.
2. **Ela aceita ver "não sei" onde o mockup mostra verde**, até a evidência
   existir? A alternativa — pintar CHEGA por ausência de impedimento — é
   exatamente o que O-PORTAO-QUE-NAO-MEDE-O-QUE-PROMETE registra como o erro mais
   caro daqui.
