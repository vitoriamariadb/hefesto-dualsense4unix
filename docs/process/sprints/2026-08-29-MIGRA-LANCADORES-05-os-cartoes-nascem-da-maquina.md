---
sprint: MIGRA-LANCADORES-05
estado: absorvida
onda: MIGRA-LANCADORES
posse:
  ML5:
    - src/hefesto_dualsense4unix/app/telas/lancadores.py
    - tests/unit/test_migra_lancadores_05_os_cartoes.py
cria:
  - tests/unit/test_migra_lancadores_05_os_cartoes.py
bancada: false
depois_de:
  - MIGRA-CONTROLES-02
  - MIGRA-CONTROLES-01
  # O ENXERTO DESTA ABA: é ele quem cria `app/telas/lancadores.py`,  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
  # que da 05 à 10 é escrito EM SÉRIE por ser um arquivo só.
  - MIGRA-LANCADORES-01
  - MIGRA-LANCADORES-02
  - MIGRA-LANCADORES-03
  - MIGRA-LANCADORES-04
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/daemon/
  - src/hefesto_dualsense4unix/integrations/
  - scripts/telas/aba07.py
  - install.sh
---

> **ESTADO 06/09/2026: absorvida.** A migração de 29/08 virou a ROTA DO HTML (02/09) e a paridade (04/09); o que desta sprint ainda falta é linha do `docs/data/paridade-gtk-html.csv` (aba 07). Não se despacha pelo id — ver `docs/process/SPRINT_ORDER.md` §3.

# MIGRA LANÇADORES · 05 — os cartões nascem da máquina

**O defeito:** os seis cartões são **literais no HTML**
(`layout/07-lancadores.html:586-657`). Numa máquina sem Heroic instalado, a
aba afirma *"Heroic (Epic · GOG) — 28 jogos"*, e o cartão dela é o único laranja
da tela.

E há um segundo literal, no cabeçalho: `:576` diz *"5 encontrados · 1 com
impedimento"*. Esse número **já se contradisse uma vez** — era digitado
`6 encontrados`, contando os seis cartões, inclusive o `Dolphin · mGBA` que o
próprio cartão carimba **NÃO ACHEI**. A cicatriz está escrita no gerador
(`aba07.py`, o comentário acima de `LANCADORES`), e a cura foi tirar o número do
teclado. **No produto a conta tem de sair da MESMA lista que pinta os cartões,
nunca de um segundo cálculo.**

## O que entrega

`app/telas/lancadores.py` — o módulo desta aba no motor novo. Ele  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
**não constrói widget**: monta um JSON e pinta.

1. **Uma passada.** `run_javascript("hefesto.pintarLancadores(<json>)")`, com a
   função que a **03** pôs na página. O JSON traz uma entrada por cartão:
   `{chave, nome, estado, selo, jogos, diz, carimbo, acoes}`.
2. **A lista vem do detector da 04**, não do HTML. Lançador ausente entra com
   `estado="ausente"`; o agrupamento dos ausentes num cartão só é o do desenho
   aprovado, e fica **isolado numa função** para o dia em que ela decidir outra
   coisa (a pergunta está na 04).
3. **A conta deriva.** `id="lanc-conta"` é escrito a partir da mesma lista —
   `encontrados = os com estado != "ausente"`, `com impedimento = os com
   estado == "impede"`. **Zero literal.**
4. **"Procurar de novo" é uma chamada só.** Os dois botões da tela (`:582` e
   `:656`) chegam pelo mesmo `data-acao="procurar"` e caem na mesma função, que
   revarre e repinta.
5. **A varredura sai da linha do GTK.** O detector chama subprocesso; a aba não
   pode congelar. Enquanto ela corre, a conta mostra *"procurando…"* — nunca um
   número velho passando por novo.
6. **Zero lançadores é estado legítimo.** A grade fica vazia com uma frase, e a
   conta diz `0 encontrados`. **O mockup não desenha esse estado** — ver "o que é
   dela decidir".

**O que esta sprint NÃO faz:** não conta jogos por lançador nem mostra o carimbo
(é a 06), não mostra impedimento (07), não conserta (08) e não abre nada (09). O
`diz` de cada cartão, nesta sprint, é o texto do desenho aprovado; a **07** é
quem o troca por causa medida.

## Como se prova — a mordida

`tests/unit/test_migra_lancadores_05_os_cartoes.py`:

1. **Máquina falsa com só RetroArch** → o JSON tem **um** cartão `chega`/`ok` e
   os outros como ausentes; nenhum cartão de Heroic com `28 jogos`.
   **Mordida:** volte a servir a lista literal do HTML → reprova.
2. **A conta deriva da lista.** Duas máquinas falsas diferentes (3 instalados; 5
   instalados) → a conta acompanha, e o teste **lê** o valor pintado em
   `#lanc-conta` em vez de comparar com um número escrito no teste.
   **Mordida:** crave `5 encontrados` no módulo → reprova.
   *E esta é a régua que mais precisa de cuidado nesta casa:* em 26/08, **onze
   réguas reprovaram a melhora em vez do defeito**, todas pela mesma forma —
   *digitavam o que deviam LER*.
3. **Um "Procurar de novo", não dois.** Dublê que conta chamadas: clicar nos dois
   botões chama **a mesma** função.
   **Mordida:** dê uma segunda função ao botão do cartão dos ausentes → reprova,
   com a frase do P6.
4. **Zero lançadores não quebra.** Detector devolvendo os sete ausentes → a aba
   pinta a frase de vazio e `0 encontrados`, sem exceção no log.
   **Mordida:** deixe o caminho vazio sem tratamento → o `pintarLancadores` recebe
   lista vazia, a grade some sem explicação, e o teste reprova.
5. **A varredura não roda na thread do GTK.** Dublê que dorme 2 s no detector →
   a chamada que pinta retorna antes.
   **Mordida:** chame o detector direto no handler → reprova por tempo.

## O que é dela decidir

- **A frase do estado vazio.** O mockup não desenha "nenhum lançador encontrado",
  porque a máquina dela tem cinco. É texto novo em tela, logo é **ESTRUTURAL**
  pelo carimbo D3 e passa por ela **antes** — não fecha com foto depois.
- **Se lançador ausente some ou fica apagado**, e se o agrupamento vale com três
  (herdada da 04).

## Colisão declarada

Da **05** à **10** todas escrevem em `app/telas/lancadores.py`. A  <!-- ref-externa: nasce na MIGRA-LANCADORES-01, ainda não executada -->
serialização está em `depois_de`, que é o que o `check_colisao_de_sprints.py`
aceita como decisão em vez de descuido. **O diretório do módulo é o que o piloto
da Controles fixar** — se ele criar `app/telas/`, esta onda muda de pasta em
bloco, e a mudança é de uma linha de `posse` por sprint.
