---
sprint: ONDA-CONTROLES-03
# onda: CONTROLES (ver a nota de frontmatter da ONDA-CONTROLES-01)
posse:
  CTRL03:
    - src/hefesto_dualsense4unix/app/widgets/controller_card.py
    - src/hefesto_dualsense4unix/gui/theme.css
cria:
  - tests/unit/test_controles_a_borda_e_a_peca.py
bancada: false
depois_de:
  - LEVA-3
  - ONDA-CONTROLES-01
  - ONDA-GATILHOS-02
  - ONDA-PERFIS-01
  - ONDA-SISTEMA-04
  - ONDA-SISTEMA-05
  - ONDA-VIBRACAO-02
nao_toca:
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
  - src/hefesto_dualsense4unix/app/actions/status_actions.py
---

# ONDA CONTROLES · 03 — a borda é a peça, o interior é a escolha

**O defeito, numa frase:** com a mesa cheia, **quem é qual** e **qual está
escolhido** disputam o mesmo espaço no card — e a regra que ela deu para
resolver isso tem, hoje, **um único chamador em todo o produto**.

## O que está medido

- `integrations/cor_do_plastico.py:240`, `tom_para_a_borda` — a função existe,
  com a razão de contraste da casa.
- `app/actions/config/secao_controles.py:954` — **o único chamador**
  (`card.repintar_a_borda(...)`), nos chips da aba Conexões.
- `app/widgets/external_card.py:561` e `:785` — `repintar_a_borda` existe **nos
  cards de controle externo**. O `ControllerCard` (o do DualSense) **não tem o
  método**.
- `controller_card.py:5395`, `_on_draw_swatch` — o quadradinho de cor ao lado do
  título, que é a única marca de identidade do card hoje.
- **a cor do plástico se lê nos DOIS transportes** desde 27/08/2026 — cabo e
  rádio. O que travava o rádio era a semente do CRC: `0x53`
  (`SET_REPORT|FEATURE`, o feature que SAI), não `0xA3` (`DATA|FEATURE`)
  (`docs/protocol/dualsense-referencia-canonica.md:1630-1663`). **Nada do que
  esta sprint entrega muda por isso** — nenhuma frase daqui cita transporte.
  O que muda é a **ordem das duas perguntas abertas**, no fim.

## A decisão que manda

`D-A-BORDA-E-A-IDENTIDADE-DA-PECA`, com a palavra dela: *"a borda do controle
sempre tem a cor do plástico. tipo o controle ao lado do todos é a borda sempre
cor do plástico e quando selecionado o interior segue"* — **em todo lugar que
mostra um controle**, e o card é o maior deles.

E `D-A-FITA-E-O-UNICO-ALVO`, que decide de onde vem o "escolhido": *"a parte da
seleção no canto superior que escolho se é em todos ou no controle X. Não temos
que duplicar isso em canto algum."* **O card lê o alvo; nunca o escreve.**

## O que esta sprint entrega

1. **`ControllerCard.repintar_a_borda(tom)`**, no molde do `external_card.py`, e
   a borda de 2px na cor do plástico — `border-forte` do mockup vira
   `tom_para_a_borda(cor.tom)`.
2. **O interior lilás do card que é o alvo da fita.** A leitura vem de
   `app/alvo_de_edicao.py:145`, `alvo_de_edicao(host)`, que já responde os três
   estados (`CONTROLE` / `TODOS` / `DESCONHECIDO`) e é a fonte única.
   - alvo `CONTROLE` com o `uniq` deste card → interior lilás;
   - alvo `TODOS` → **nenhum** card lilás (ninguém é o escolhido; todos são);
   - alvo `DESCONHECIDO` → nenhum card lilás, e nada de chute.
3. **O quadradinho de cor funde na borda.** Ele era desenhado duas vezes — no
   card e no painel "No jogo" —, e o painel morreu na ONDA-CONTROLES-02. Uma
   marca só.
4. As duas classes CSS no `theme.css`, no molde do mockup
   (`src/hefesto_dualsense4unix/interface/aba02.py`, `.card` / `.card.alvo`).

## Como se prova (o teste que morde)

`tests/unit/test_controles_a_borda_e_a_peca.py`:

1. **A cor certa na peça certa.** Dois cards, um `Cosmic Red` e um
   `Starlight Blue`; a borda de cada um é o `tom_para_a_borda` do **seu**
   plástico. Arranque a cura (devolva a borda neutra) e veja reprovar.
2. **O lilás segue a fita, nos TRÊS estados.** Com o alvo em `Controle 2`, só o
   card do Controle 2 tem a classe; com `Todos`, **nenhum**; com o alvo
   desconhecido, **nenhum**. As três respostas no mesmo teste — uma régua que só
   verifica o caso `CONTROLE` passa com o produto pintando tudo de lilás.
3. **O card não escreve o alvo.** Nenhum caminho do `ControllerCard` chama
   `definir_alvo`. Grep no fonte: é a mordida que trava
   `D-A-FITA-E-O-UNICO-ALVO` contra a próxima boa ideia.

## O que é dela decidir

**As duas continuam abertas; a ORDEM inverteu em 27/08/2026**, pelo fato medido
acima. Com todo DualSense ganhando cor real nos dois transportes, a pergunta do
controle **externo** passou a ser a principal, e a do plástico desconhecido
deixou de ser o caso comum.

1. **O card do controle externo** (8BitDo, Pro Controller) segue a mesma regra?
   **— a pergunta principal.** O externo é agora o **único aparelho que continua
   sem cor lida, e por construção**: ele não tem serial de fábrica Sony, e o
   módulo o descarta antes de perguntar — a razão está escrita em
   `src/hefesto_dualsense4unix/integrations/cor_do_plastico.py:419-420`
   (*"mandá-lo para o aparelho de outro fabricante é escrever às cegas"*).
   **Consequência para quem desenhar a tela:** para o DualSense o campo em que a
   pessoa declara a cor virou **correção**; para o externo ele **não é
   correção — é o único caminho**, e não pode nascer escondido atrás de um
   "Corrigir". O `external_card.py` já tem o método, e
   `D-A-BORDA-E-A-IDENTIDADE-DA-PECA` diz "em todo lugar" — mas o mockup da aba
   Controles não desenha nenhum card externo, só o **chip** deles na fita.
2. **Plástico desconhecido.** Um DualSense de cor que o produto não conhece
   (`cor_do_codigo` em `cor_do_plastico.py:204` devolve `None`) fica com que
   borda? *A neutra de hoje, ou a cor da barra de luz dele?*
   **PROVISÓRIO — decisão dela:** a neutra de hoje. **Continua válida, e deixou
   de ser o caso comum:** ela cobre agora a edição que a tabela não tem, não
   mais "todo controle no rádio".
