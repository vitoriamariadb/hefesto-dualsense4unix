---
sprint: MIGRA-CONEXOES-05
onda: MIGRA-CONEXOES
posse:
  M5:
    - src/hefesto_dualsense4unix/app/actions/config/secao_controles.py
cria:
  - tests/unit/test_migra_conexoes_a_mesa_e_a_de_verdade.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-01
  - MIGRA-CONEXOES-01
  - MIGRA-CONEXOES-03
  # A 04 é quem tira o `daemon.state_full` de dentro desta seção e o põe no
  # `pagina.py`. Esta sprint escreve o `dados(host, estado)` que ela desenhou.  <!-- ref-externa: o módulo nasce na MIGRA-CONEXOES-01, e a ausência é o assunto -->
  - MIGRA-CONEXOES-04
  # SÉRIE por arquivo (R5): as cinco abaixo também possuem `secao_controles.py`.
  - ONDA-CONEXOES-05
  - ONDA-CONEXOES-06
  - ONDA-CONEXOES-09
  - ONDA-CONEXOES-11
  - ONDA-JOGAR-07
  - LEVA-3
  - LEVA-4
  # A borda com o tom do plástico é da onda Controles, e ela abre a mesma
  # seção: quem dá o contrato vem antes de quem o consome.
  - MIGRA-CONTROLES-12
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/integrations/cor_do_plastico.py
  - src/hefesto_dualsense4unix/app/widgets/external_card.py
  - src/hefesto_dualsense4unix/app/actions/home_actions.py
  - src/hefesto_dualsense4unix/daemon/
---

# MIGRA CONEXÕES · 05 — a página nasce da mesa real

**O defeito:** a página tem **quatro** controles cravados e a mesa dela tem
**dois**. Pedido dela, 29/08: *"o layout se adapta a medida dos controles que eu
tenho"*.

E não é uma lista: **tudo** nesta aba deriva da `MESA` do gerador
(`scripts/telas/monta.py`, a `MESA` de exemplo) — a conta do topo ("4 na mesa • 2  <!-- ref-externa: o gerador comum das dez, que a MIGRA-CONTROLES-02 traz para cá -->
no cabo • 2 no rádio"), as quatro linhas do acordeão, os blocos e as **vagas** da
régua de rádio, o `TODOS_COM_MIC`, a legenda, e até **as regras de CSS do
acordeão**, uma por estado, geradas da `MESA`. Uma aba que nasce com quatro
linhas fixas é a primeira coisa que ela vê errado, e é a mesma classe de defeito
do "jogador 3 fantasma".

## O que o produto já lê, e a sprint só liga

| o que a linha mostra | de onde vem hoje |
|---|---|
| quantos, jogador, transporte, bateria | o payload único que a `MIGRA-CONEXOES-04` monta a partir de UM `daemon.state_full`. Campos `controllers[].uniq`, `.player_slot`, `.transport`, `.battery_pct` |
| os que o Hefesto só vê (não adotados) | `controller.list {external: true}` |
| a cor do plástico e o tom da borda | `integrations/cor_do_plastico`: `ler_pelo_cabo`, `cor_do_nome`, `tom_para_a_borda`, importados em `secao_controles.py:68-72`; chegam ao card por `DadosDoControle.cor_lida` e `.tom` (`app/widgets/external_card.py:203-207`) |
| a barra de luz do desenho | `core/led_control.player_slot_color` — a cor canônica do **jogador**, que não é a cor do plástico |
| o microfone daquele controle | `daemon.state_full` → `bt_mic.uniqs`; superfície em `secao_controles.py:446` (`TEXTO_DO_MIC`), com o gate `pode_ligar_o_mic:520` |
| a máscara ("Vê como X") | `app/actions/home_actions.py:916` (`mascara_viva`) e `:953` (`mascara_do_aparelho`) — **da mesa, não por controle**. Aqui é **leitura** vinda da Jogar; escrevê-la nesta aba criaria a segunda verdade |

## O que entrega

1. **A `MESA` fixa morre.** O gerador passa a emitir a **forma** (uma linha, o
   corpo dela, as regras de CSS por estado) a partir de um `<template>` ou de um
   protótipo repetido, e o `pagina.py` **clona por controle** do payload. O  <!-- ref-externa: o módulo nasce na MIGRA-CONEXOES-01, e a ausência é o assunto -->
   contador do topo, a legenda e as vagas passam a ser conta sobre o payload.
2. **Zero controles é estado legítimo, e a página tem de dizê-lo.** Hoje o
   mockup não desenha esse estado — nem o de **um** só, nem o de **cinco**
   (`player_slot` vai até 5, e a escolha "Jogador: 1 2 3 4 5" existe). Sem
   desenho, a sprint **declara o buraco** e não inventa: ver "o que é dela
   decidir".
3. **A borda só é pintada de quem foi LIDO.** Quem não foi fica com a neutra do
   CSS, e a razão está na tela — o `?` do quadro já diz *"pelo rádio ele ainda
   não pergunta"*. **Esta regra tem um espinho vivo**, e ele não é desta sprint:
   `docs/data/mapa-controles.csv`, linha `identidade.cor_do_aparelho@dualsense`,
   diz `radio_aciona=não`, e desde 29/08/2026 com motivo `divida`, não
   `o-aparelho-recusa` — e a medição
   desta bancada em 27/08 derrubou isso (quem recusava era a semente do **nosso**
   CRC, `0x53` e não `0xA3`; `docs/protocol/dualsense-referencia-canonica.md:1645-1659`).
   Medido em 29/08: `grep -c '0x53' docs/data/mapa-controles.csv` devolve **0**.
   O dono da substituição é a `ONDA-CONEXOES-11`, que **não correu**. Enquanto
   isso, quem executar esta sprint lê a lápide no mapa, acredita e para — foi o
   custo que a casa já pagou por quatro dias.
4. **A fita atravessa o vidro.** No mockup, clicar numa linha muda os chips da
   fita — em CSS puro, por `<input type=radio>`. No produto a fita é widget
   **GTK** do cabeçalho (`_target_strip`), e o acordeão é **HTML**. Logo o gesto
   sobe (`data-g="controle.escolher"` → `pagina.ao_gesto`) e o estado desce
   (Python → `run_javascript` marca o rádio certo). **A fita continua sendo o
   único lugar onde se escolhe o alvo** (`D-A-FITA-E-O-UNICO-ALVO`) — a linha
   aberta é reflexo dela, nunca uma segunda escolha.
5. **`montar(host, caixa)` sai; entra `dados(host, estado) -> dict`.** As nove chamadas a
   `Gtk.` deste módulo somem; os leitores ficam onde estão. A sprint **liga**,
   não reescreve.

## Como se prova (a mordida)

`tests/unit/test_migra_conexoes_a_mesa_e_a_de_verdade.py`, com payload de dublê
(sem daemon, sem uinput — a suíte já cria nós de verdade demais):

* **N linhas para N controles.** Payloads com **0, 1, 2, 4 e 5** controles; o
  DOM resultante tem exatamente esse número de `.gc-item`, e o contador do topo
  diz o mesmo número por extenso. **Mordida:** devolva a `MESA` de quatro ao
  gerador e o teste reprova em quatro dos cinco casos.
* **zero é estado, não erro.** Com a lista vazia a página não levanta, não fica
  branca, e mostra a frase do vazio. **Mordida:** troque a frase por um `return`
  precoce e veja a aba nascer em branco.
* **a borda de quem não foi lido é neutra.** Um controle sem `cor_lida` sai sem
  `--plastico`. **Mordida:** pinte-a com a cor declarada e o teste reprova —
  borda colorida é a promessa de que alguém leu.
* **nada endereçado por posição.** Nenhum `data-v`/`data-g` da linha contém
  `p1`..`p5`; a chave é o `uniq`. **Mordida:** troque uma chave e veja reprovar.
* **a fita e a linha não divergem.** Gesto de escolher o Controle 2 → o estado
  que desce marca a linha 2 **e** a fita aponta para o 2. **Mordida:** arranque a
  descida e veja as duas discordarem.
* **o MAC não vaza.** O `uniq` é MAC. Nenhum endereço, log ou fixture desta
  sprint carrega MAC real — máscara da casa, octetos 4 e 5 zerados. Os **dois**
  portões valem (`tests/unit/test_docs_mac_anonimato.py` e
  `scripts/check_endereco_de_radio.py`), e eles medem coisas diferentes de
  propósito.

## O que é dela decidir

* **O MICROFONE NASCE LIGADO?** O mockup mostra "Microfone Ligado" em **todas**
  as linhas, inclusive nas dos controles no cabo. O produto faz o **contrário**,
  e a razão está escrita em `secao_controles.py:433-437`: nasce **desligado**,
  por opt-in, por privacidade **e** por banda. Ligar por padrão não é ajuste de
  tela — é trocar o padrão de privacidade do produto, **e acende um caminho que
  já derrubou controle nesta bancada**: medido em 16/08, duas rodadas
  (`docs/data/mapa-controles.csv`, `audio.microfone`, `radio_ressalva`), três
  minutos depois de a ponte subir o botão PS passou a disparar sozinho várias
  vezes por segundo e o controle caiu inteiro. A decisão de 25/08 (mic ativo em
  todo jogo) e a de 28/08 (o mic segue o transporte) apontam para o mockup; o
  código aponta para o contrário. **Uma frase sua fecha.**
* **Zero, um e cinco controles não têm desenho.** Com cinco, o acordeão passa de
  339 px (quatro abertos) e o terceiro quadro, que hoje mostra 75, some de vez.
  Com zero, não há o que mostrar. **O desenho é dela**, e esta sprint não o
  inventa.
* **Dois controles do mesmo plástico ficam com a borda idêntica** — e agora
  também com dois blocos idênticos na régua do rádio. Segue aberto desde 26/08.
