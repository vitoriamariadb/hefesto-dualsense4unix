---
sprint: MIGRA-NAVEGACAO-03
onda: MIGRA-NAVEGACAO
posse:
  NAV6-MESA:
    - src/hefesto_dualsense4unix/app/telas/navegacao/mesa.py
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/mesa.py
  - tests/unit/test_migra_navegacao_03_a_mesa_e_a_dela.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/app/mesa.py
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA NAVEGAÇÃO · 03 — O cartão nasce da mesa real, e zero controles é estado legítimo

## O defeito

O mockup desenha **quatro** cartões, e são quatro constantes: a `MESA` de
`layout/_ferramentas/monta.py:138` — `p1 cosmic-red USB`,
`p2 starlight-blue BT`, `p3 galactic-purple BT`, `p4 white USB`. **Ela tem
dois.** Palavra dela, 29/08: *"o layout se adapta a medida dos controles que eu
tenho (…) e se eu comprar outros dualsense eles aparecem também seguindo a
lógica que montamos no `mapa-do-controle.html`."*

Migrar a aba sem isto põe na tela dela dois controles que não existem, com cor,
transporte e número inventados — que é a forma mais direta de a janela mentir.

## O que já existe, e a sprint não reescreve

| o que | onde |
|---|---|
| quem está na mesa | `app/mesa.py:30` (`controles_conectados`) — lê `state["controllers"]` do `daemon.state_full` e filtra por `connected` |
| a contagem, com os dois espaços | `app/mesa.py:84` (`contagem_de_controles`) e `texto_de_contagem` |
| o bloco `controllers` | `daemon/ipc_handlers.py:2491`, enriquecido por `_enrich_controllers_per_controller` (`:3176`) com `player_slot`, `lightbar_rgb` e entradas ao vivo |
| quem é o primário | `core/backend_pydualsense.py` (`describe_controllers` → `is_primary`) |

**`app/mesa.py` é dono único e esta sprint só o LÊ** — está no `nao_toca` de
propósito: ele nasceu (ONDA0-Z5/T5) justamente porque a resposta morava dentro
do mixin de uma aba só.

## Quem navega o PC é UM, e isso é medido

O comentário de `NAVEGA` em `aba06.py:81-91` já traz a medição, e ela continua
valendo: o poll loop lê o estado do controle **primário**
(`daemon/lifecycle.py`), e é esse estado, e só ele, que vai para o mouse, para o
teclado e para o `hotkey_manager.observe`. Os secundários do co-op têm **um**
caminho: o gamepad virtual (`daemon/subsystems/coop.py`, `forward_analog` /
`forward_buttons`).

Logo, a coluna "Quem navega" não é escolha de desenho — é o que o produto faz.
Com quatro na mesa, mouse, teclado e os cinco gestos saem de um controle só.

## O que entrega

1. **Um cartão por controle presente**, clonado do `tpl-cartao` que a 02
   entrega, na ordem do `state_full`. A cor do plástico e a borda são da
   sprint 04; aqui o cartão nasce com o **desenho** e o **rótulo**.
2. **O rótulo tem a gramática única da casa** — `P{n} • {plástico} • {via}` na
   forma curta (`monta.rotulo`, decisão dela de 26/08: marca • player •
   plástico • transporte). Cinco gramáticas na mesma janela foi o defeito
   medido em 28/08; a tela nova não recria a sexta.
3. **A bolinha e o "Navega o PC" seguem o primário vivo**, não o índice 1: com o
   P1 desligado e o P2 na mesa, é o P2 que navega, e o cartão dele que ganha a
   marca.
4. **Zero controles é estado legítimo, e tem frase.** A coluna não fica vazia:
   ela diz o que é (nenhum controle na mesa) e o que fazer. Não é erro, e a tela
   não pode desenhá-lo como erro.
5. **Um controle só encolhe o bloco** — e isso é `PROVISÓRIO — decisão dela`
   (ver abaixo).
6. **O `state_full` chega por UMA leitura.** A tela nova tem um dono só para
   "quem está na mesa" nesta aba; nenhuma outra sprint desta onda chama
   `controles_conectados` por conta própria. Duplicar a leitura é o defeito que a
   `D-AS-ABAS-CONVERSAM` existe para matar.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_03_a_mesa_e_a_dela.py` — puro, sem GTK e sem
WebKit: a função sob teste recebe um `state` e devolve **o que seria pintado**.

1. **Dois na mesa desenham dois.** `state` com dois `controllers` conectados
   produz dois cartões, com os dois rótulos certos. **Morde:** troque a leitura
   por um `range(4)` e reprova nomeando o número.
2. **Um desconectado não desenha.** Três no bloco, um com `connected: false` →
   dois cartões. **Morde:** tire o filtro por `connected` e reprova. É o mesmo
   filtro que `app/mesa.py:30` já faz, e o teste existe porque a tela nova
   poderia ter reimplementado.
3. **Zero é estado, não erro.** `controllers: []` → zero cartões **e** a frase.
   `controllers` ausente (daemon velho, sem o bloco) → zero cartões e a frase
   **outra**, a de "não sei", nunca a de "não tem". **Morde:** faça os dois
   caírem na mesma frase e reprova — é a distinção que o `_anotar_mouse_virtual`
   (BG-02) pagou para aprender.
4. **Quem navega é o primário, não o P1.** `state` com o primário no slot 2 →
   a marca no cartão do P2. **Morde:** volte a `min(jogador)` e reprova. É o
   defeito que o mockup carrega hoje, porque na `MESA` fixa os dois coincidem.
5. **Nenhum hex digitado.** Nenhuma string de cor no módulo desta sprint —
   `grep -c '#[0-9a-fA-F]\{6\}'` sobre `mesa.py` devolve zero. **Morde:** cole
   um `#b11f54` e reprova.

## O que é dela decidir

- **Com UM controle na mesa, o bloco "Quem navega" encolhe ou some?** Com um
  DualSense, a coluna fica com um cartão e a resposta "o P1 navega" é óbvia.
  `PROVISÓRIO — decisão dela`: a proposta é **encolher**, não sumir — o cartão
  continua sendo onde ela vê a cor e o transporte, e sumir tiraria a única
  leitura de identidade desta aba.
- **A ordem dos cartões.** Hoje é a ordem do `state_full` (ordem de inserção).
  Por número de jogador seria mais estável quando um cai e volta. Não é
  regressão nenhuma hoje; vira quando a mesa dela encher.

## O que esta sprint NÃO faz

Não pinta cor de plástico (sprint 04), não acende peça no desenho (sprint 07) e
não mexe em `app/mesa.py`. E **não** desenha as cinco lâmpadas do jogador: elas
saíram dos desenhos pequenos por decisão dela de 28/08, medindo 1,90 × 0,64 px —
o grupo inteiro sai do SVG por `svg(lampadas=False)`.
