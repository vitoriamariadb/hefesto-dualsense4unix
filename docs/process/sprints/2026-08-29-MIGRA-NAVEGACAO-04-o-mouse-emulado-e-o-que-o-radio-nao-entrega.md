---
sprint: MIGRA-NAVEGACAO-04
estado: absorvida
onda: MIGRA-NAVEGACAO
posse:
  NAV6-EMULACAO:
    - src/hefesto_dualsense4unix/app/telas/navegacao/emulacao.py
    - src/hefesto_dualsense4unix/app/actions/mouse_actions.py
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/emulacao.py
  - tests/unit/test_migra_navegacao_04_o_mouse_emulado.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02
  - ONDA-NAVEGACAO-01  # a ativação por perfil, backend — ela muda QUEM manda no interruptor
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - LEVA-1
  - LEVA-2
  - LEVA-DE-BACKGROUND-01
  - ONDA-NAVEGACAO-06
  - ONDA-NAVEGACAO-09
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/app/actions/input_actions.py
  - src/hefesto_dualsense4unix/app/actions/emulation_actions.py
  - src/hefesto_dualsense4unix/daemon/
  - docs/data/mapa-controles.csv
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA NAVEGAÇÃO · 04 — O mouse emulado, o motivo do bloqueio, e o que o rádio não entrega

## O defeito

O produto já sabe **tudo** o que esta metade da tela precisa, e a página nova
não sabe nada. O bloco `mouse_emulation` do `state_full`
(`daemon/ipc_handlers.py:2157`) publica seis chaves — `enabled`, `speed`,
`scroll_speed`, `device_ativo`, `despachando`, `bloqueio` — e a tela nova nasce
com os números do mockup: `Touch 4 · Analógico 6` e `Dois dedos 4 · Analógico 1`,
escritos em `aba06.py` (`ATIVACAO_DIR`).

**Segundo defeito, e ele é do mapa de canais, que é portão.** A tela mostra
`Velocidade de cursor · Analógico 6` **igual nos dois transportes**. O
`docs/data/mapa-controles.csv` diz outra coisa, pela observação dela de
11/08/2026, na linha `entrada.emulacao_mouse.gatilhos@dualsense` e na
`entrada.emulacao_mouse.analogico@dualsense`:

> *"notei uma coisa o r2 e o l2 quando o teclado tá ativo ele funciona como
> mouse, além do analogico também funcionar como mouse e o touch também, **a
> exceção do touch os demais não funcionam no modo bt**"*

E a linha irmã `toque.touchpad.cursor@dualsense` registra o contraste do outro
lado: *"por Bluetooth o TOUCHPAD move o cursor mas os gatilhos e o analogico
NAO — esta linha e a única das três emulacoes que funciona no radio, segundo o
olho dela. NAO MEDIDO."*

As duas linhas de emulação têm `cabo_aciona` e `radio_aciona` **vazios**: o mapa
registrou a assimetria e nunca a fechou. `scripts/check_paridade_transporte.py`
reprova afirmação forte sem teste que a sustente — e mostrar o analógico como
ativo no rádio é afirmação forte.

> **NOTA DE 06/09/2026 (A-RECUSA-QUE-CITOU-O-MAPA-01) — O MAPA FECHOU A
> ASSIMETRIA, E FECHOU PELO LADO POSITIVO.** As duas células vazias que este
> parágrafo cita eram `nao-medido`, nunca "não funciona" — e hoje
> `entrada.emulacao_mouse.gatilhos@dualsense` e
> `entrada.emulacao_mouse.analogico@dualsense` são **`cabo_aciona = sim` e
> `radio_aciona = sim`, `de_onde_sei = medido` dos dois lados**. A evidência do
> rádio: *"o caminho do mouse emulado não pergunta o transporte"* — ele lê o
> eixo do gamepad já normalizado pelo daemon e escreve no uinput, **o mesmo
> código para cabo e rádio**, e foi *"medido com ela na bancada, nos dois
> transportes, em 05/09/2026"*. Os donos são `daemon/subsystems/mouse.py` e
> `integrations/uinput_mouse.py`; a régua é
> `tests/unit/test_o_mouse_emulado_nao_pergunta_o_fio.py`, e a palavra dela:
> *"hj as máscaras funcionam super legal em tudo o lance do R2 analógico e
> cursor tão medidos"*. <!-- noqa-acento: citação literal dela -->
> **Consequência para a entrega 5 desta sprint:** a marca de transporte nas duas
> velocidades de analógico não tem mais lastro — a tela deixaria de afirmar o
> que o mapa hoje SUSTENTA. A observação dela de 11/08/2026 continua registrada
> no mapa como o que era, uma observação, e foi ela mesma quem a derrubou.

**Terceiro defeito: o portão HARM-05 não pode sumir na troca de motor.**
`mouse_actions._sync_mouse_mode_gate` (`:285`) fecha o interruptor fora do modo
"Controlar o PC", com a frase ao lado, porque ligar o mouse durante "Jogar pelo
Hefesto" **derrubava o vpad e os jogadores do co-op sem aviso**. A exclusão
mútua do daemon é silenciosa; a tela é o único lugar onde ela é visível.

## O que entrega

1. **Os quatro valores da aba chegam do daemon**, pelos endereços que a 02
   criou: `mouse.enabled` no interruptor de status, `mouse.speed` e
   `mouse.scroll_speed` nos campos de número. A leitura é a que já existe —
   `_refresh_mouse_from_daemon_async` (`mouse_actions.py:315`) — e ela **não é
   reescrita**: o que muda é o destino da pintura.
2. **As duas travas de escrita continuam de pé, e por escrito.** A releitura
   desiste de sobrepor quando há edição pendente (`draft.mouse.dirty`) ou seção
   de perfil (`in_profile`) — as duas são medidas
   (BUG-MOUSE-SLIDER-PREF-LOSS-01 e BUG-MOUSE-OVERLAY-CLOBBERS-SECTION-01), e
   perdê-las na migração devolve a perda de preferência dela.
3. **A escrita passa pelo mesmo funil.** O gesto na página chama
   `mouse.emulation.set` com `origin: "manual"` — o mesmo caminho de
   `on_mouse_toggle_set` (`:401`), com as três saídas que a N6 separou: sucesso,
   **recusa com motivo** e **ninguém respondeu**. Um "aplicado" mudo é o defeito
   que `O-PRODUTO-RESPONDE-PELO-TRANSPORTE-E-NAO-PELO-EFEITO` registra.
4. **O portão HARM-05 chega à página.** Fora do modo desktop o interruptor nasce
   **inerte** e a frase do motivo aparece — `MODE_GATE_HINT` quando o modo é
   conhecido, `MODO_DESCONHECIDO_HINT` quando o Hefesto não respondeu (N4). As
   duas constantes vêm de `mouse_actions.py:33` e `:50` e **não são reescritas**.
5. **A tela para de afirmar sobre o rádio o que o mapa não sustenta.** As duas
   velocidades de **analógico** ganham a marca do transporte: com o controle que
   navega no rádio, a linha diz que o analógico não move o cursor por Bluetooth,
   citando que a fonte é observação dela e **não** ensaio. A do **touch** não
   ganha marca: essa funciona nos dois, e é a única das três que o mapa dá como
   `sim`/`sim`.

   > **06/09/2026 (A-RECUSA-QUE-CITOU-O-MAPA-01): esta entrega CADUCOU, e a
   > marca não se põe.** Desde 05/09/2026 as TRÊS emulações são `sim`/`sim` no
   > mapa, medidas na bancada com ela — não só o touch. Pôr a marca hoje seria
   > a tela negar o que o mapa sustenta, que é o defeito na direção oposta. Ver
   > a nota em "O defeito", acima.
6. **O que quatro velocidades pedem do perfil fica DECLARADO, não inventado.**
   `ProfileMouseConfig` (`profiles/schema.py:361`) tem **um** `speed` (1-12) e
   **um** `scroll_speed` (1-5); o mockup pede **quatro** números. Quem alarga o
   schema é a sprint 14, que é dona do Point-and-click e do mesmo campo. Até lá
   a tela mostra dois números do perfil e dois **desligados com o motivo** —
   nunca dois números que ninguém grava.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_04_o_mouse_emulado.py`:

1. **Os quatro valores saem do bloco, não do mockup.** `state_full` com
   `speed: 11` pinta 11. **Morde:** troque a leitura por uma constante e o teste
   nomeia o valor. Um teste que digita `6` e compara com `6` passaria com a cura
   arrancada — é a forma dos seis instrumentos falsos de 29/08, e por isso o
   valor do fixture é **11**, que não é o default de lugar nenhum.
2. **`bloqueio` manda no rótulo.** Os cinco valores de `_bloqueio_do_mouse`
   (`desligada`, `sem_device`, `modo_jogo`, `vpad_suspenso_pelo_steam_input`,
   `null`) produzem cinco estados distintos de tela. **Morde:** faça dois deles
   caírem no mesmo texto e reprova.
3. **Fora do modo desktop o interruptor é inerte.** `mode != desktop` → inerte
   **e** com frase. `mode is None` → inerte **e** com a frase PRÓPRIA.
   **Morde:** deixe o interruptor sensível com o modo desconhecido e reprova.
   Esta é a régua do HARM-05, e ela é a mais cara desta sprint: sem ela o clique
   que derruba o co-op volta em silêncio.
4. **A edição pendente não é sobreposta.** `draft.mouse.dirty = True` + estado
   vivo diferente → a tela mantém o dela. **Morde:** tire a guarda e reprova.
5. **A recusa tem texto próprio.** `mouse.emulation.set` respondendo
   `status != "ok"` produz a frase de recusa, e a exceção de transporte produz a
   de "ninguém respondeu". **Morde:** una as duas e reprova — foi a N6 que as
   separou, porque a janela acusava a rede por um defeito que não houve.
6. **O rádio, e ela é a régua do portão.** Com o controle que navega em
   `BT`, a linha do analógico **não** afirma que funciona. **Morde:** apague a
   marca e rode `scripts/check_paridade_transporte.py` — ele reprova a afirmação
   forte sem teste que a sustente.

## O que é dela decidir

- **O que a tela diz sobre o analógico no rádio: marcar, esmaecer ou avisar?**
  `PROVISÓRIO — decisão dela`. A proposta é **avisar sem esmaecer**: esmaecer
  diria "o Hefesto desligou", e não foi o Hefesto — é observação dela, de 11/08,
  ainda **não medida em ensaio**. A frase tem de dizer as duas coisas.
- **O ensaio que fecha as duas células do mapa é bancada dela**, e não é desta
  sprint: um DualSense no rádio, o mouse emulado ligado, o analógico e os
  gatilhos. Enquanto ele não correr, esta aba não pode dizer nada forte sobre
  mouse no rádio — e o portão a segura.

## O que esta sprint NÃO faz

Não toca o `mapa-controles.csv` (está no `nao_toca`): fechar uma célula do mapa
sem o ensaio seria escrever medição que ninguém fez. Não toca o teclado — é a
sprint 05, que divide este mesmo arquivo e corre em série.
