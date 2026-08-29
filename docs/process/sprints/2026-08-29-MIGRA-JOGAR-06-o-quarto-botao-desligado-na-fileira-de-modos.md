---
sprint: MIGRA-JOGAR-06
onda: MIGRA-JOGAR
posse:
  J6:
    - src/hefesto_dualsense4unix/app/actions/jogar/modo.py
    - src/hefesto_dualsense4unix/app/actions/mode_transition.py
cria:
  - src/hefesto_dualsense4unix/app/actions/jogar/modo.py
  - tests/unit/test_migra_jogar_06_o_quarto_botao.py
bancada: false
depois_de:
  - MIGRA-JOGAR-03   # sem `#jg-modos` não há botão a pintar
  - MIGRA-JOGAR-04   # a 04 cria o pacote `app/actions/jogar/`
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA JOGAR · 06 — o quarto botão "Desligado" na fileira de modos

**O defeito, medido:** o modo tem **três** valores no código e a tela desenha
**quatro**.

- `app/actions/mode_transition.py:51` — `MODES = (MODE_DESKTOP, MODE_GAMEPAD,
  MODE_NATIVE)`;
- `app/actions/home_actions.py:153` — `_MODE_ITEMS` traz os mesmos três, com os
  rótulos que o desenho já usa: *Controlar o PC*, *Jogar pelo Hefesto*,
  *Conexão Nativa (Sony)*;
- `novo-layout/01-jogar.html:617-622` — quatro botões, e o primeiro é
  **Desligado**.

**"Desligado" não é modo hoje.** É botão de energia, e tem **dois** caminhos
distintos: `home_actions.py:3170` (`_on_home_power_clicked`) e `:3190`
(`_on_home_shutdown_clicked`). E tem um irmão na aba Sistema, com outro nome.

Promovê-lo a modo sem decidir o dono cria a **terceira** versão da mesma coisa —
que é exatamente o que `docs/process/SPRINT_ORDER.md` §0.2 já registra como
contradição aberta (*"Ligar/Desligar o Hefesto em dois lugares"*).

**Esta sprint não decide isso.** Ela escreve o mecanismo e para na porta dela.

## O que entrega

1. **A fileira lê o modo vivo.** `#jg-modos` pinta o `.on` sobre o modo que
   `mode_transition.mode_of_state` (`:200-212`) resolve de
   `state_full.native_mode` / `gamepad_emulation.enabled`. Os rótulos são os de
   `_MODE_ITEMS` — **um dono só**: `test_vocabulario_das_quatro_superficies.py`
   já reprova quem mudar um lado só, e as quatro superfícies são a Jogar, a aba
   Perfis (`app/actions/profiles_actions.py`, `_MODE_KIND_ITEMS`), o applet
   (`packaging/cosmic-applet/src/app.rs`) e a CLI.
2. **O clique escreve pelo caminho que já existe.** `plan_mode_transition`
   (`mode_transition.py:54`) devolve a sequência IPC (`native.mode.set` +
   `gamepad.emulation.set`); a página só manda o gesto. **Nada de rota nova.**
3. **O quarto botão nasce DESLIGADO de verdade, ou não nasce.** Duas condições, e
   as duas são obrigatórias:
   - se ele for promovido a **modo**, `MODES` ganha o quarto valor e ele passa a
     valer para as quatro superfícies de uma vez — o vocabulário tem um dono;
   - se ele continuar sendo **energia**, ele não pertence à fileira `.seg` e não
     pode levar o `.on` de modo: um botão que aparenta ser irmão dos outros três
     e faz outra coisa é a forma pela qual esta janela ganhou pares.

   **Enquanto ela não responder, o botão fica na página desenhado e INERTE, com
   o motivo na dica.** Botão que não faz nada e não diz por quê é pior que botão
   ausente.
4. **A ordem dos quatro é da tela, e está marcada como provisória.** O mockup pôs
   *Desligado* primeiro — *"é o 'menos'"*, diz a legenda (`:2358`) — e a própria
   legenda oferece o inverso. `PROVISÓRIO — decisão dela`.

## Como se prova (a mordida)

`tests/unit/test_migra_jogar_06_o_quarto_botao.py`:

- **a fileira é o catálogo, não uma cópia.** Os botões de `#jg-modos` têm de
  bater **um a um** com `home_actions._MODE_ITEMS` (mais o quarto, se ele for
  promovido). **A mordida:** acrescente um item a `_MODE_ITEMS` — o teste reprova
  porque a página ficou com um a menos. Uma lista digitada na página passaria;
- **o `.on` segue o estado, e não o clique.** Dublê com `state_full` em cada um
  dos três modos; o `.on` cai no botão certo nos três. **A mordida:** faça a
  página marcar o `.on` no clique em vez de na releitura — o teste reprova no
  cenário em que o daemon **recusa** a transição, que é onde a tela mentiria;
- **o gesto vira o plano que já existe.** Clique em cada modo; a sequência IPC
  tem de ser **byte a byte** a de `plan_mode_transition`. **A mordida:** escreva
  a sequência à mão no módulo novo — o teste reprova ao primeiro passo divergente;
- **o quarto botão não mente.** Enquanto `MODES` tiver três valores, o botão
  *Desligado* **não pode** receber `.on` em nenhum `state_full`, e clicar nele
  não pode disparar `native.mode.set`. **A mordida:** ligue-o ao
  `_on_home_power_clicked` sem promovê-lo a modo — o teste reprova, porque a
  fileira passaria a ter dois significados;
- **a régua roda o tique mais de uma vez.** O estado muda por fora (o daemon
  cai, o modo volta); a fileira tem de acompanhar no tique seguinte. Uma régua
  que roda o tique uma vez mede um instante, não um comportamento.

## O que é dela decidir

1. **"Desligado" é modo ou é energia?** Se for modo, `MODES` vai a quatro e as
   quatro superfícies mudam juntas. Se for energia, ele sai da fileira `.seg`.
2. **Vale no clique ou espera o `Aplicar`?** Os outros três esperam
   (`D-APLICAR-NAO-SALVA` já está implementada, e a linha laranja é a prova de
   que o `Aplicar` ainda deve). Um "Desligado" que vale no clique é uma quarta
   gramática na mesma fileira.
3. **De quem é o gesto — Jogar ou Sistema?** A Sistema tem o mesmo gesto com
   outro nome, e `SPRINT_ORDER.md` §0.2 registra a contradição em aberto. **Dois
   nomes para o mesmo fato é como esta casa ganhou os oito pares.**
4. **A ordem dos quatro.** *Desligado* primeiro, como o mockup pôs, ou por último.
