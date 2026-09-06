---
sprint: MIGRA-NAVEGACAO-05
estado: absorvida
onda: MIGRA-NAVEGACAO
posse:
  NAV6-TECLADO:
    - src/hefesto_dualsense4unix/app/telas/navegacao/emulacao.py
    - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
cria:
  - tests/unit/test_migra_navegacao_05_o_teclado_mora_no_perfil.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02
  - MIGRA-NAVEGACAO-04  # mesmo arquivo (emulacao.py) — série por R5
  - ONDA-NAVEGACAO-01   # ela é quem liga `resolver_teclado_emulado` ao carregador de perfil
  - ONDA-SISTEMA-02     # ela desmonta o bloco de diagnóstico da Emulação, no mesmo arquivo
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - EMULACAO-UM-DONO-SO-01
  - COOP-NA-CONEXAO-NATIVA-01
  - LEVA-1
  - ONDA-LANCADORES-10
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
  - src/hefesto_dualsense4unix/app/actions/input_actions.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA NAVEGAÇÃO · 05 — O teclado emulado, e a "Função do teclado" que passa a morar no perfil

## O defeito

**O interruptor do teclado mora nesta aba e o handler dele mora em outra.** O
widget é `gui/main.glade:4030` (`keyboard_emulation_toggle`), dentro do bloco da
Navegação; quem o pinta e quem o escuta é
`app/actions/emulation_actions.py:1661` (`_refresh_keyboard_switch`) e `:1706`
(`on_keyboard_toggle_set`) — o mixin da aba **Emulação**, que vai deixar de
existir. Migrar a aba sem resolver isso deixa o gesto órfão.

**Segundo defeito, e é o mais caro desta casa: cura escrita e nunca ligada.**
`Profile.teclado_emulado` existe (`profiles/schema.py:979`) e
`resolver_teclado_emulado` existe, está no `__all__` e é testada
(`:1300`, `:1345`) — e **nenhum caminho de produção a executa**. A dívida está
registrada com endereço em
`tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py:1199`: *"está no `__all__`
(:1345), o próprio módulo a cita em comentário (:972), e nenhum caminho de
produção a executa."* Hoje o liga/desliga é só a flag global
`keyboard_emulation.flag` (`utils/session.py`) — enquanto o **mouse vizinho, na
mesma aba**, mora no perfil desde a FEAT-POINT-AND-CLICK-01.

O contrato manda fechar isso: *"«Emular teclado» passa a morar no perfil, como o
mouse vizinho já mora. Hoje dois interruptores lado a lado guardam em lugares
opostos e nada na tela conta isso"* (redesenho §6, `D-AS-ABAS-CONVERSAM`).

**Terceiro defeito: o mockup trocou o interruptor por três degraus.** A
`ATIVACAO_ESQ` de `aba06.py` desenha **Função do teclado** com
*Ligada — atalhos e teclado na tela* · *Só fora do jogo* · *Desligada*. O
segundo degrau **não existe no produto**: hoje "fora do jogo" é o
`suppress_desktop_emulation` (`profiles/schema.py:998`), que é outro eixo — ele
cala mouse **e** teclado juntos.

## O que o produto já publica, e a tela não lê

`_keyboard_emulation_payload` (`daemon/ipc_handlers.py:2025`) devolve cinco
chaves: `enabled`, `device_ativo`, `despachando`, `bloqueio` e
`osk_disponivel` — a última desde 10/08. A janela lê **uma**
(`mouse_actions._anotar_teclado_na_tela:209`, e ela mora no mixin do mouse
porque é lá que o `state_full` chega).

## O que entrega

1. **O gesto muda de casa junto com o widget.** `on_keyboard_toggle_set` e
   `_refresh_keyboard_switch` saem de `emulation_actions.py` e passam a ser da
   tela desta aba. **O corpo não é reescrito** — o que muda é o dono e o destino
   da pintura. Reescrever é como as duas versões de uma verdade nascem.
2. **Os três degraus chegam ao dado, ou o do meio sai.** *Ligada* e *Desligada*
   mapeiam em `Profile.teclado_emulado` (`True`/`False`), e o `None` continua
   sendo "sem opinião" — é o contrato que `resolver_teclado_emulado` já
   implementa. *Só fora do jogo* **não tem campo**: ou ele vira o
   `suppress_desktop_emulation` (e então o mesmo degrau existe do lado do mouse,
   e a tela tem de dizer isso), ou ele **sai do desenho**. Ver "o que é dela".
3. **A lápide fecha, com prova.** A entrada de
   `portao_a_casa_sabe_e_o_produto_nao_faz.py:1199` **sai do registro** quando
   o carregador de perfil passar a chamar `resolver_teclado_emulado` — e quem o
   liga é a `ONDA-NAVEGACAO-01`, que é dona do `schema.py`. Esta sprint é o
   **consumidor**: se a 01 não tiver ligado, esta reprova e diz por quê, em vez
   de gravar por outra porta.
4. **A frase do teclado na tela vem do daemon.** `osk_disponivel` pinta o
   *"Neste computador: …"* (`input_actions.frase_do_teclado_na_tela:265`), e o
   tri-estado é preservado: `None` devolve `""` e a tela fica como estava. A
   janela **não** faz `shutil.which` por conta própria — num Flatpak ela olharia
   o sandbox e responderia sobre uma máquina que não é a dela.
5. **O bloqueio do teclado ganha rótulo, como o do mouse.** Os quatro valores de
   `_bloqueio_da_emulacao_de_desktop` chegam à tela com texto próprio; nenhum
   deles cai em silêncio.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_05_o_teclado_mora_no_perfil.py`:

1. **O perfil vence a flag.** `resolver_teclado_emulado(perfil_com_False, True)`
   → `False`; `resolver_teclado_emulado(perfil_None, True)` → `True`.
   **Morde:** a segunda linha é a que morde — inverta a precedência e o perfil
   sem opinião passa a APAGAR a flag, que é a proteção do `mic.muted`
   (MIC-GRAVACAO-01) aplicada aqui.
2. **A função é CHAMADA em produção.** Um dublê do carregador de perfil
   registra a chamada. **Morde:** este é o teste que a lápide pedia — arranque
   a chamada e ele reprova nomeando `resolver_teclado_emulado`. Sem ele, tudo o
   mais desta sprint passa com o campo continuando morto.
3. **O gesto tem um dono só.** `grep` por `on_keyboard_toggle_set` em `src/`
   devolve **um** arquivo. **Morde:** deixe a cópia velha em
   `emulation_actions.py` e reprova — dois donos do mesmo gesto é o P6 do
   redesenho.
4. **`osk_disponivel` tri-estado.** `True` → frase de "instalado"; `False` →
   frase de "não há, e por isso não dá para escrever texto"; `None` → `""`.
   **Morde:** faça o `None` cair na frase do `False` e reprova — mandaria ela
   instalar um pacote que talvez já esteja lá.
5. **O degrau do meio não mente.** Se *Só fora do jogo* ficar no desenho, o
   teste exige que escolhê-lo mexa em `suppress_desktop_emulation` **e** que o
   lado do mouse mostre o mesmo estado. **Morde:** grave só do lado do teclado e
   reprova: o campo é um só e cala os dois.

## O que é dela decidir

- **"Só fora do jogo" existe, e o que ele grava?** `PROVISÓRIO — decisão dela`.
  Ele não tem campo próprio. A proposta é **mapear no
  `suppress_desktop_emulation`** e dizer na tela que ele vale para mouse **e**
  teclado — porque é o que o produto faz. A alternativa é tirar o degrau: dois
  estados que a tela oferece e o produto funde é a forma de mentira mais barata
  de produzir e a mais cara de achar.
- **A posse do `emulation_actions.py`.** Ele é reivindicado pela onda
  **Lançadores** (a aba que renasce no lugar da Emulação) e pela `ONDA-SISTEMA-02`.
  Esta sprint tira dois métodos de lá; quem coordena serializa. Não resolver
  conflito de merge nesse arquivo sozinho.
