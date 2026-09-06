---
sprint: MIGRA-NAVEGACAO-08
estado: absorvida
onda: MIGRA-NAVEGACAO
posse:
  NAV6-GESTOS-ESCRITA:
    - src/hefesto_dualsense4unix/app/telas/navegacao/gestos.py
cria:
  - tests/unit/test_migra_navegacao_08_os_gestos_ficam_trocaveis.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-07  # mesmo arquivo — série por R5
  - ONDA-NAVEGACAO-03   # ela é quem cria o catálogo e a recusa do daemon
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA NAVEGAÇÃO · 08 — Os cinco gestos ficam trocáveis, e dois deles não

**Espera a palavra dela** — é a pergunta 4 do contrato da aba, e continua aberta.

## O defeito

O mockup abre um dropdown em **todas as cinco** linhas de gesto
(`aba06.py`, `linha_combo` → `drop(ACOES_GESTO, faz)`), e a dica do mesmo quadro
avisa o contrário:

> *"**Ressalva:** o **PS + R3** e o **PS + Options** são as duas saídas de
> emergência quando o jogo não responde — trocar o que eles fazem tira essa
> saída."*

**A tela oferece e a dica desaconselha.** Ou os dois são travados na tela
(`disabled`), ou a dica sai. Hoje ela pede à pessoa que se autocontrole, que é
a forma de defeito que a `PALAVRA-01` existe para pegar.

E a razão da ressalva é medida, não estilística. O `build_next_bridge_callback`
(`daemon/subsystems/hotkey.py:433`) é o único caminho de volta pelo controle
quando o jogo deixou de responder — a própria docstring diz, em `:490`, que
entrar em Modo Nativo *"mataria o próprio gesto: não haveria porta de volta pelo
controle. Beco sem saída não entra em ciclo."*

## O que entrega

1. **O dropdown escreve, pelo caminho do daemon.** A escolha viaja por IPC e a
   resposta é lida: sucesso, **recusa com motivo**, ou "ninguém respondeu". As
   três saídas são as mesmas do mouse (N6). Um toast no pretérito sobre uma
   escrita que não aconteceu é o mal-entendido que a §6 manda tirar.
2. **Travado é travado NOS DOIS LADOS.** O select nasce `disabled` na tela **e**
   o daemon recusa a troca com motivo — a régua da `ONDA-NAVEGACAO-03` já pede
   isso ("régua que só sabe passar não é régua"). Travar só na tela é convite ao
   primeiro caminho alternativo que aparecer.
3. **A lista de ações é a do catálogo, não a do mockup.** `ACOES_GESTO` de
   `aba06.py` é desenho; a lista viva é `core/gestos_do_controle.py`. Onde as  <!-- ref-externa: nasce em ONDA-NAVEGACAO-03, ainda não executada -->
   duas divergirem, **o catálogo manda** e a geração para (a régua da sprint 02
   já para o gerador quando o desenho promete o que o dado não tem).
4. **[Aplicar] e [Salvar Perfil] têm falas diferentes.** `D-APLICAR-NAO-SALVA`:
   [Aplicar] vale agora e não grava; [Salvar Perfil] aplica e grava. A tela diz
   **qual dos dois falta** — é o item do "Nada se perdeu" que fecha o
   mal-entendido das três ações do teclado.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_08_os_gestos_ficam_trocaveis.py`:

1. **Trocar a ação de um gesto livre muda o que dispara.** O `HotkeyManager` com
   o catálogo editado chama o callback novo. **Morde:** arranque a leitura do
   catálogo e reprova.
2. **Trocar um travado é recusado, com motivo, e o gesto continua fazendo o que
   fazia.** **Morde:** as duas metades: aceite a troca → reprova; recuse em
   silêncio → reprova também. Recusa sem motivo é o defeito da
   `RECUSA_SEM_MOTIVO` do mouse, e a constante dela já existe.
3. **O select travado nasce `disabled` no HTML pintado.** **Morde:** deixe-o
   sensível e reprova — a tela e o daemon têm de dizer a mesma coisa.
4. **A lista da tela é a do catálogo.** Toda opção do select existe no catálogo,
   e todo item não-travado do catálogo tem opção. **Morde:** acrescente
   "Religar o controle" só no desenho e reprova nomeando a ação.
5. **O latch não vaza.** O teste do vazamento de combo
   (FEAT-HOTKEY-COMBO-NO-LEAK-02, `hotkey_daemon.py`) continua verde com o par
   reconfigurado: soltar o PS antes do segundo botão não pode virar um tap.
   **Morde:** é a régua que protege o R3, que **tem outros donos** — clique do
   meio no mouse emulado (`integrations/uinput_mouse.py:93`) e fechar o teclado
   virtual (`core/keyboard_mappings.py:39`).

## O que é dela decidir

**A pergunta 4 do contrato, e ela trava esta sprint inteira:**

> *Quais combos ela pode reconfigurar, e para quais ações? Travar PS+R3 e
> PS+Options e liberar só o PS+↑/↓, ou abrir todos com uma lista curta de ações
> permitidas?*

A proposta desta onda é a que o mockup desenhou **menos a contradição**: PS+R3 e
PS+Options **travados**, PS+↑ / PS+↓ e o toque curto no PS **livres**, com a
lista curta de ações. Confirmar ou trocar.

**Duas perguntas de segunda ordem, que a resposta dela decide junto:**

- **O par de botões também se troca, ou só a ação?** O mockup mostra o combo
  como desenho fixo e o dropdown só na ação. Trocar o par é a feature maior, e
  ninguém pediu.
- **Onde a escolha grava: no perfil ou na máquina?** O gesto de *trocar de
  perfil* configurado **dentro de um perfil** é um argumento forte para a
  máquina. É a mesma família de pergunta que o microfone abriu na onda Conexões,
  e há quatro precedentes medidos e nenhuma regra geral.
