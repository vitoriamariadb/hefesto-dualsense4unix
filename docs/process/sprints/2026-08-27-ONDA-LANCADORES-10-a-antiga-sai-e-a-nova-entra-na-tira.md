---
sprint: ONDA-LANCADORES-10
estado: absorvida
onda: ABA-LANCADORES
posse:
  L10:
    - src/hefesto_dualsense4unix/gui/main.glade
    - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
    - src/hefesto_dualsense4unix/app/app.py
    - src/hefesto_dualsense4unix/app/actions/lancadores_actions.py
cria:
  - docs/process/sprints/2026-08-27-ONDA-LANCADORES-10-a-antiga-sai-e-a-nova-entra-na-tira.md
  - tests/unit/test_portao_nada_se_perdeu_da_emulacao.py
bancada: false
depois_de:
  - ONDA-LANCADORES-02
  - ONDA-LANCADORES-03
  - ONDA-LANCADORES-04
  - ONDA-LANCADORES-05
  - ONDA-LANCADORES-06
  - ONDA-LANCADORES-07
  - ONDA-LANCADORES-08
  - ONDA-LANCADORES-09
  # A BANCADA DO `gui/main.glade` — XML único, sem seções nomeadas: conflito de
  # merge nele é irrecuperável na prática (SPRINT_ORDER.md §1.1, trava 2). Vinte
  # sprints o abrem, e por R5 elas correm EM SÉRIE, na ordem das ondas de
  # SPRINT_ORDER.md §1.2. As linhas abaixo são a fila inteira que vem ANTES desta:
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - ONDA-JOGAR-09
  - ONDA-VIBRACAO-02
  - ONDA-SISTEMA-01
  - ONDA-SISTEMA-02
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-SISTEMA-07
  - ONDA-ILUMINACAO-04
  - ONDA-ILUMINACAO-10
  - ONDA-GATILHOS-02
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-07
  - ONDA-NAVEGACAO-08
  - ONDA-NAVEGACAO-09
  - ONDA-PERFIS-01
  - ONDA-CONTROLES-02
  - ONDA-LANCADORES-01
  # SÉRIE, por R5: esta sprint divide src/hefesto_dualsense4unix/app/app.py
  # com as de baixo, e quem divide arquivo executa EM SÉRIE. A ordem é a
  # fila das dez ondas de SPRINT_ORDER.md §1.2 e, dentro da onda, o número.
  - ONDA-VIBRACAO-06
  - IDENTIDADE-01  # fechou em 54b7ffd2 (o app-id e a migração); a série é nominal
  - LEVA-1  # fechou no merge f56d75c7 (as vinte e seis frentes); a série é nominal
nao_toca:
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** O redesenho de 27/08 mirava a janela GTK; a tela é o HTML desde 02/09, e o que desta sprint ainda falta está como linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# ONDA LANÇADORES · 10 — a Emulação sai, e a Lançadores entra na tira

**O defeito, em uma frase:** enquanto as duas abas existirem, a mesma coisa se
escolhe em dois lugares — e a duplicação já está **confessada no código**: os três
botões de modo da Emulação chamam o mesmo `_apply_mode`
(`app/actions/emulation_actions.py:1540`, chamado por `:1568`, `:1576`, `:1583`)
que a aba Início chama, com vocabulário diferente para o mesmo estado.

## O que entrega

1. **A página Emulação sai do Glade** — `gui/main.glade:3106-3654`, incluindo o
   rótulo da aba (`:3652-3654`) — e com ela os handlers órfãos de
   `emulation_actions.py` (2.197 linhas hoje; sai o que não tiver dono novo).
2. **`tab_lancadores` fica visível.** É aqui que a decisão do placeholder se
   cumpre, e não antes: *"ela só passa a existir quando tiver todas as features no
   projeto integrando e funcionando"* (D-A-ABA-LANCADORES-NASCE-PLACEHOLDER).
3. **O portão do "Nada se perdeu"**, que é o que autoriza 1 e 2.

## O portão — as dezesseis linhas, uma a uma

`tests/unit/test_portao_nada_se_perdeu_da_emulacao.py` exige, **item a item**, que
cada feature da Emulação de hoje tenha destino **vivo** antes da página sumir.
Nove mudam de aba, seis saem por decisão registrada, e uma vira o `?` da aba nova:

| Linha da Emulação | Destino | Como o portão confere |
|---|---|---|
| Testar o controle virtual (`emulation_actions.py:1011`) | Sistema | o widget existe na página da Sistema |
| Atualizar (relê o daemon) | Sistema | idem |
| Suspender mouse e teclado | Navegação | idem |
| Sair do modo jogo | Navegação | idem |
| Microfone: **modo** | Conexões | idem |
| Microfone: **volume e mudo** | Controles (card do controle) | idem |
| Controles detectados (copiável) | Sistema | idem |
| UINPUT / Device / Código do fabricante | Sistema | idem |
| Próximo / Anterior (PS+↑, PS+↓) e o quadro que os ensina | Navegação | idem |
| Buffer: 150 | Navegação, como **dica** | o número deixa de ser exibido |
| Desligado / DualSense / Xbox 360 | **sai** (modo na Jogar, máscara na Jogar e Perfis) | nenhum `on_emulation_gamepad_*` sobra |
| Verificar (Steam Input) | **sai** (mede o mesmo do cartão de saúde) | — |
| Desligar Steam Input | **sai** (metade do "Consertar problemas conhecidos") | — |
| Gamepad para os jogos | **sai** (é a máscara) | — |
| Passthrough em emulação | **sai** (decisão travada, não é ajuste) | — |
| A lápide do "Ver daemon.toml" | **sai** com o Glade da aba | — |
| Parágrafo de ajuda (~840 caracteres) | vira o `?` da Lançadores | o `?` existe (sprint 01) |

**Se um destino ainda não existe, a página antiga FICA.** O portão nomeia o item
sem dono e reprova — é a diferença entre migrar e perder.

## A mordida

1. **Arranque um destino:** comente o widget de "Testar o controle virtual" na
   página da Sistema. O portão reprova **nomeando** esse item. Devolva → verde.
   (Sem esse passo, o portão é uma lista que só sabe passar.)
2. Nenhum handler `on_emulation_*` continua referenciado no Glade — a régua lê o
   XML e cruza com os métodos vivos. É a mesma classe da lápide do
   `on_emulation_open_toml`, cujo botão saiu e cuja sobra ficou documentada em
   `main.glade:3357-3378`.
3. `tab_lancadores` com `visible=True` **só passa** se 1 e 2 estiverem verdes.

## O que é dela decidir

- **Quando a aba passa a existir é dela, e ela decide vendo** (PROVA-DE-TELA-01,
  e *"decide vendo, não lendo"*). Quem coordena fotografa as dez abas com
  `scripts/gui-captura/retratar_abas.py` e leva a foto — o portão verde é
  condição, não é a palavra final.
- **Quem coordena** acrescenta a `depois_de` as sprints das ondas que **recebem**
  as nove linhas (Sistema, Navegação, Conexões, Controles). Esta sprint não pode
  fechar antes delas, e os ids delas não existiam quando esta foi escrita.
