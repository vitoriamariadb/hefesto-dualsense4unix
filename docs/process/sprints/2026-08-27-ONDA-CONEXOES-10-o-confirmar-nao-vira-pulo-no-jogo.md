---
sprint: ONDA-CONEXOES-10
estado: absorvida
posse:
  A10:
    - src/hefesto_dualsense4unix/daemon/subsystems/gamepad.py
    - src/hefesto_dualsense4unix/app/widgets/calibrar_entradas.py
cria:
  - tests/unit/test_a_posse_da_calibracao_atravessa_o_ipc.py
bancada: true
depois_de:
  - ONDA-CONEXOES-04
  - ONDA-CONEXOES-09
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - JOGADOR-3-FANTASMA-01  # sprint antiga ainda aberta: a onda vem depois, em série (R5)
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/app/actions/config/secao_mesa.py
  - src/hefesto_dualsense4unix/daemon/lifecycle.py
  - src/hefesto_dualsense4unix/app/widgets/mapa_da_mesa.py
  # O portão da dívida é de QUEM COORDENA, e não desta onda: cada sprint
  # entrega o MANIFESTO do que ligou, e quem coordena aplica todos num
  # commit só. Está decidido desde 25/08 em
  # 2026-08-25-LIGAR-OS-MODULOS-A-TELA-INDICE-dez-frentes-em-quatro-ondas.md
  # ("cinco frentes o tocariam; cada uma entrega um manifesto").
  - tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 08). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA CONEXÕES · 10 — o confirmar da calibração não vira pulo no jogo

**O defeito, numa frase:** ela abre "Ensinar as minhas entradas", pluga o
controle, aperta **X** para confirmar a entrada — e o **X** também chega ao jogo
aberto atrás da janela.

A peneira que impede isso existe, está testada, e **não tem chamador**:
`app/widgets/calibrar_entradas.py:399`, `botoes_para_o_jogo`. A própria docstring
declara: *"Quem chama isto em produção ainda não existe... o gate do despacho
mora em `daemon/lifecycle.py`, que não é posse desta frente (R-A). A janela
declara a posse; o daemon é quem tem de perguntar."*

O registro desta casa concorda, e nomeia o dono
(`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1162`): *"o despacho hoje
manda os botões CRUS ao gamepad virtual gateado só pelos 0,3 s de grace e
sobrevive de propósito ao `daemon.pause` e ao modo jogo... DONO: a Onda do
daemon, ou quem coordena a leva seguinte."*

**Esta é a leva seguinte.** O contrato da aba pede a peneira com todas as letras:
*"a calibração ganha a peneira que impede o confirmar de virar pulo no jogo
aberto"* (`docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`, seção 8).

## A metade que o registro NÃO viu, e é a difícil

**`POSSE` é um objeto de processo, e são DOIS processos.** `POSSE.tomar()` roda
no processo da **janela** (`calibrar_entradas.py:1114`); `dispatch_gamepad` roda
no processo do **daemon**. Um `if not POSSE.dono` dentro do daemon lê um objeto
que ninguém tomou, devolve a identidade, e a peneira fica **verde e inerte** —
que é exatamente a família de defeito que esta sprint fecha.

**Logo a posse tem de atravessar o IPC**, e isso é backend novo, não uma linha
no despacho. É a parte que a estimativa tem de carregar.

## O que entrega

1. **A posse viaja.** A janela anuncia ao daemon que tomou e que soltou; o
   daemon guarda o dono no seu próprio estado. Contrato mínimo: **quem toma,
   solta**, e o daemon solta sozinho quando quem tomou some — a mesma disciplina
   da bancada, onde o teto de tempo é a rede e não o `finally`
   (`COMO-EXECUTAR-UMA-SPRINT.md`, §3). Uma posse que não volta trava o controle
   dela para sempre, e isso é pior que o defeito que curamos.
2. **O despacho pergunta.** `dispatch_gamepad` (`daemon/subsystems/gamepad.py:2225`)
   subtrai `VOCABULARIO_DA_CALIBRACAO` (`cross`, `circle`, `dpad_up`,
   `dpad_down`) enquanto a posse estiver viva. **Sem posse, nada muda** — é a
   identidade, e é o que garante custo zero nos 99,9% do tempo em que a janela
   está fechada.
3. **`botoes_para_o_jogo` continua a régua única.** O despacho chama a função,
   não recopia a lista de quatro botões. Duas listas divergem no primeiro dia em
   que a cerimônia ganhar um gesto.
4. **A lápide sai do registro.**

## Como se prova — o teste que morde

`tests/unit/test_a_posse_da_calibracao_atravessa_o_ipc.py`:

* **o teste que o registro pedia**: com a posse tomada **do outro lado da
  ponte**, `dispatch_gamepad` recebe `{"cross","l1"}` e o gamepad virtual vê
  **só** `l1`. Sem posse, vê os dois;
* **a posse é de processo cruzado, e o teste prova isso**: tomar a posse
  mexendo só no `POSSE` local do processo de teste **não** pode filtrar nada no
  daemon. Se filtrar, a régua está medindo o objeto errado — e é este caso que
  separa uma cura de verdade de uma cura que só funciona no teste;
* **a posse volta sozinha**: com quem tomou dado como morto, o despacho volta a
  entregar os quatro botões. Sem esta asserção a cura troca "pulo no jogo" por
  "controle morto até reiniciar";
* `daemon.pause` e o modo jogo **não** derrubam a peneira — ela é ortogonal aos
  dois, que é o que o registro diz que o grace de 0,3 s não faz;
* o portão `portao_a_casa_sabe_e_o_produto_nao_faz` fica verde sem a lápide de
  `calibrar_entradas.py::botoes_para_o_jogo`.

**A mordida:** arranque a subtração no despacho e veja a primeira asserção
reprovar. Depois troque a posse cruzada pelo `POSSE` local e veja a segunda
reprovar — é ela, e só ela, que pega a cura inerte. Cole as duas saídas.

## Bancada

**`bancada: true`.** A prova final é com o controle na mão dela: janela de
calibração aberta, um jogo aberto atrás, apertar X e ver que **nada acontece no
jogo**. Nenhum teste de unidade prova isso — eles provam o caminho, ela prova o
efeito. `scripts/bancada.sh exigir` antes, teto de uma hora, e libere ao
terminar.

## O que é dela decidir

1. **Nada.** O comportamento é o que ela já pediu ao aprovar a calibração
   (`D-CALIBRAR-AS-ENTRADAS`, 25/08, palavra dela: *"aprovado"*). O que precisa
   dela é a **bancada**, não a decisão.
