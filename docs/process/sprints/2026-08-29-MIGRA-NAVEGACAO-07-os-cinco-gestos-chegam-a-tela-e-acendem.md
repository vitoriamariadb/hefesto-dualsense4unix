---
sprint: MIGRA-NAVEGACAO-07
estado: absorvida
onda: MIGRA-NAVEGACAO
posse:
  NAV6-GESTOS:
    - src/hefesto_dualsense4unix/app/telas/navegacao/gestos.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/gestos.py
  - tests/unit/test_migra_navegacao_07_os_gestos_chegam_a_tela.py
bancada: false
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02
  - MIGRA-NAVEGACAO-03  # o desenho que acende é o do controle que navega
  - ONDA-NAVEGACAO-03   # ela cria `core/gestos_do_controle.py`, o catálogo  <!-- ref-externa: nasce em ONDA-NAVEGACAO-03, ainda não executada -->
  # SÉRIE, por R5: esta sprint divide `daemon/ipc_handlers.py` com as de baixo.
  # A ordem é a fila das dez ondas (SPRINT_ORDER.md §1.2) e, dentro da onda, o número.
  - ONDA-JOGAR-05
  - ONDA-CONTROLES-04
  - ONDA-CONTROLES-05
  - ONDA-CONTROLES-06
  - ONDA-CONTROLES-07
  - ONDA-CONTROLES-08
  - ONDA-GATILHOS-01
  - ONDA-ILUMINACAO-03
  - ONDA-VIBRACAO-04
  - ONDA-VIBRACAO-05
  - ONDA-VIBRACAO-06
  - ONDA-CONEXOES-09
  - ONDA-LANCADORES-06
  - ONDA-PERFIS-03
  - COOP-QUE-NAO-DESMONTA-01
  - DAEMON-ACORDADO-01
  - LEVA-3
  - LEVA-DE-BACKGROUND-01
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - MIGRA-CONTROLES-09
  - MIGRA-ILUMINACAO-11
  - MIGRA-JOGAR-10
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/integrations/hotkey_daemon.py
  - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
  - novo-layout/
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 06). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA NAVEGAÇÃO · 07 — Os cinco gestos chegam à tela, e o desenho acende

## O defeito

**Os cinco gestos que valem sem largar o controle nunca foram publicados.** Eles
existem, funcionam, e vivem em constantes de módulo que **nenhuma tela leu**:

| gesto | constante | onde |
|---|---|---|
| Suspender mouse e teclado | `DEFAULT_COMBO_GAMEMODE = ("ps", "options")` | `integrations/hotkey_daemon.py:121` |
| Próximo perfil | `DEFAULT_COMBO_NEXT = ("ps", "dpad_up")` | `:57` |
| Perfil anterior | `DEFAULT_COMBO_PREV = ("ps", "dpad_down")` | `:58` |
| Sobe um degrau na roda | `DEFAULT_COMBO_PONTE = ("ps", "r3")` | `:142` |
| Toque curto no PS → abre e foca a Steam | `build_ps_solo_callback` | `daemon/subsystems/hotkey.py:38` |
| a janela de 0,15 s | `DEFAULT_BUFFER_MS = 150` | `hotkey_daemon.py:56` |

`HotkeyConfig` (`hotkey_daemon.py:146`) **aceita** tuplas configuráveis, e quem o
monta passa só os defaults (`daemon/subsystems/hotkey.py:781`). Nada persiste,
nada publica no `state_full`, nada escreve. O PS+R3 é o caso extremo: funciona
desde 19/08, foi pedido por ela, e **só um comentário de código o conhecia**
(`D-O-PS-R3-CHEGA-A-TELA`).

**Segundo defeito, e ele é fato errado no contrato.** A tabela da §6 do
redesenho diz: *"Toque curto no PS — abre/foca a Steam; **segurar mais de 0,7 s
é outro gesto (religar o controle)**"*. Medido: os 700 ms são o **teto do toque
curto** (`hotkey_daemon.py:91`, `DEFAULT_PS_TOQUE_CURTO_TETO_MS`), e acima dele
**nada dispara**. O número existe justamente porque segurar o PS por cinco
segundos para religar um controle no rádio **abria a Steam duas vezes em 45 s**
na sessão dela. O long-press que existe alterna o **modo jogo**
(`daemon/subsystems/hotkey.py:86`) e nasce **desligado**
(`DEFAULT_PS_LONG_PRESS_MS = 0`, `hotkey_daemon.py:65`, por causa do modo-jogo
acidental). Propagar a frase do contrato para a tela seria o produto prometendo
um gesto que ele não tem. É a mesma armadilha de 27/08 — *o enunciado também
carrega fato errado*.

## O que entrega

1. **Um bloco `gestos` no `state_full`**, lendo o catálogo que a
   `ONDA-NAVEGACAO-03` cria (`core/gestos_do_controle.py`): por gesto, o `id`, o  <!-- ref-externa: nasce em ONDA-NAVEGACAO-03, ainda não executada -->
   par de botões **efetivo** (não o default), o rótulo em português, se é
   travado, e a ação que está valendo. Mais a janela de combo em ms.
   **A janela não lê as constantes por conta própria** — num Flatpak ela leria o
   módulo dentro do sandbox e responderia sobre uma configuração que pode não
   ser a que o daemon está rodando. É a mesma disciplina do `osk_disponivel`.
2. **As cinco linhas da tabela vêm do bloco**, com os glifos do mapa
   (`docs/data/pecas-do-dualsense.csv`) — que é como o mockup já as monta
   (`aba06.py`, `linha_combo`). Nenhum símbolo digitado: `X O Quadrado Triângulo ↑` saíram da
   tela em 27/08 por pedido dela, e não voltam por uma ponte de leitura.
3. **A janela de 0,15 s vira dica, com o número do daemon.** O mockup já a
   traduziu (*"apertar os dois em até 0,15 s conta como combo"*); a dica passa a
   **derivar** de `buffer_ms`, para o dia em que ele mudar.
4. **O realce acende sem uma linha de script.** `aba06.py:549` (`_realce`) já
   gera o CSS `:has(.gN:hover)` que pinta as peças da linha no desenho do
   controle que navega — e a cura de três partes dele (o `!important` na peça, o
   **glifo** junto, e nunca tocar a peça `sem-tinta`) é medida: sem ela, as
   linhas 1 e 5 não acendiam **nada**, e o PS não acendia em nenhuma. Esta
   sprint só garante que o `pref` do CSS acompanha o controle que navega de
   verdade — no mockup ele é o `p1` fixo.
5. **O toque no PS chega à tela com o que ele FAZ, e o teto com o que ele
   IMPEDE.** A linha 5 diz "Abre e foca a Steam"; a dica diz que segurar acima
   de 0,7 s **não dispara nada**, e por quê. A frase do contrato sobre "religar
   o controle" **não vai para a tela**, e o contrato ganha a nota datada.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_07_os_gestos_chegam_a_tela.py`:

1. **O bloco publica os cinco, com o par EFETIVO.** `HotkeyConfig` com
   `next_bridge=("ps","l3")` publica `ps+l3`, não `ps+r3`. **Morde:** publique a
   constante em vez do config e reprova. Um teste que compara com
   `DEFAULT_COMBO_PONTE` passaria com a cura arrancada.
2. **A tela lê o bloco, não o módulo.** `grep -n "hotkey_daemon" ` sobre
   `app/telas/navegacao/gestos.py` devolve **zero**. **Morde:** importe a
   constante na janela e reprova — é o molde do Flatpak, e ele já custou duas
   sprints (BG-02 e N12).
3. **Os glifos saem do mapa.** Cada linha cita uma peça que existe em
   `docs/data/pecas-do-dualsense.csv`. **Morde:** invente `ps_button` e reprova;
   `scripts/check_pecas_do_dualsense.py` reprova junto.
4. **O realce segue quem navega.** Com o primário no slot 2, o CSS gerado
   faz referência a `#p2-…`, não `#p1-…`. **Morde:** fixe `p1` e reprova.
5. **A tela não promete o gesto que não existe.** Nenhum texto da página contém
   "religar o controle" como AÇÃO do PS segurado. **Morde:** cole a frase do
   contrato e reprova, nomeando `DEFAULT_PS_TOQUE_CURTO_TETO_MS` e a medição dos
   5.038 ms do journal dela. Esta régua é a que impede a propagação do fato
   errado — e ela reprova a MELHORA se for escrita ao contrário, então o teste
   procura a frase, não a ausência dela.
6. **A dica deriva do número.** `buffer_ms = 200` produz "0,2 s" na dica.
   **Morde:** digite "0,15 s" e reprova.

## O que é dela decidir

- **A ação "Religar o controle" fica no dropdown?** `ACOES_GESTO` de `aba06.py`
  a oferece, e **ela não existe como ação** em lugar nenhum: religar é o que a
  pessoa faz com o botão físico. `PROVISÓRIO — decisão dela`: a proposta é
  **tirar da lista** — oferecer uma ação que o produto não executa é a janela
  mentindo, e é o mesmo motivo pelo qual as três regiões do touchpad saíram em
  09/08.
- **A nota datada no contrato.** A tabela da §6 fica com o fato errado até
  alguém a corrigir. Pela regra da casa, fato errado se **substitui** — o
  número certo é o teto de 700 ms, e o que ele faz é **impedir**, não disparar.

## O que esta sprint NÃO faz

Não deixa nenhum dropdown escrever — é a sprint 08, que espera a palavra dela
sobre quais gestos são trocáveis. Aqui os cinco selects nascem **inertes**, com
a ação que está valendo selecionada.
