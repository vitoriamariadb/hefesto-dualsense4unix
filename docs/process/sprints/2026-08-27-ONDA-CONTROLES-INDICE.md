# ONDA CONTROLES — o índice

> **06/09/2026 — ESTA ONDA FOI ABSORVIDA.** As sprints deste índice estão `estado: absorvida`: a tela é o HTML desde 02/09, a fila é o `docs/data/paridade-gtk-html.csv` (aba 02) e a ordem de agora é [AS VINTE E QUATRO HORAS](../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md). O que este índice mediu continua valendo como diagnóstico; nada aqui se despacha pelo id.

**27/08/2026.** As nove sprints que levam a aba **Controles** do produto de hoje
até o mockup que ela aprovou, do frontal ao backend.

- **Contrato da aba:** `docs/process/2026-08-26-O-REDESENHO-as-dez-abas.md`,
  §2 (linhas 166-242).
- **Mockup aprovado:** `layout/02-controles.html`, gerado por
  `src/hefesto_dualsense4unix/interface/aba02.py`. É a especificação visual.
- **Correções literais dela:** `src/hefesto_dualsense4unix/interface/CORRECOES-DELA.md`.
- **Protocolo de quem executa:** `docs/process/COMO-EXECUTAR-UMA-SPRINT.md`.

---

## A ordem, e por que ela é essa

```
01 ─ a faixa do card ──┬─ 02 a aba sai da tira ──┐
                       │                          │
                       └─ 03 a borda e o alvo ── 04 acelerômetro ── 05 o som
                                                                      │
                                                          06 o mic por peça
                                                                      │
                                                   07 interruptores ──┤
                                                                      │
                                                   08 calibração ─────┤
                                                                      │
                                                          09 as dicas ┘
```

| # | sprint | camada | tamanho |
|---|---|---|---|
| 01 | [a faixa que a Steam guardava](2026-08-27-ONDA-CONTROLES-01-a-faixa-que-a-steam-guardava.md) | frontal | ~350 linhas |
| 02 | [a aba que sai e o quadro que se dissolve](2026-08-27-ONDA-CONTROLES-02-a-aba-que-sai-e-o-quadro-que-se-dissolve.md) | frontal | ~400 linhas (a maior parte é **remoção**) |
| 03 | [a borda é a peça, o interior é a escolha](2026-08-27-ONDA-CONTROLES-03-a-borda-e-a-peca-o-interior-e-a-escolha.md) | frontal | ~180 linhas |
| 04 | [o acelerômetro está no mesmo node](2026-08-27-ONDA-CONTROLES-04-o-acelerometro-esta-no-mesmo-node.md) | ambas | ~320 linhas |
| 05 | [o seletor que nunca soube a rota](2026-08-27-ONDA-CONTROLES-05-o-seletor-que-nunca-soube-a-rota.md) | frontal | ~300 linhas |
| 06 | [o microfone não tem endereço](2026-08-27-ONDA-CONTROLES-06-o-microfone-nao-tem-endereco.md) | ambas | ~260 linhas |
| 07 | [os dois sensores ganham interruptor](2026-08-27-ONDA-CONTROLES-07-os-dois-sensores-ganham-interruptor.md) | ambas | ~450 linhas |
| 08 | [calibrar sensores, e a Steam é a prova](2026-08-27-ONDA-CONTROLES-08-calibrar-sensores-a-steam-prova-que-da.md) | ambas · **bancada** | ~500 linhas + a spec |
| 09 | [trinta e cinco frases viram quinze](2026-08-27-ONDA-CONTROLES-09-trinta-e-cinco-frases-viram-quinze.md) | frontal | ~200 linhas |

**Serial de propósito.** Sete das nove tocam `controller_card.py` ou
`status_actions.py` — dois arquivos, 5.783 e 3.164 linhas, sem seções nomeadas.
Paralelizar aqui compra conflito de merge, não velocidade. O `depois_de` de cada
frontmatter declara a serialização em vez de fingir que ela não existe.

**O `depois_de` de cada sprint tem DUAS metades, e elas querem dizer coisas
diferentes:**

- **as `ONDA-CONTROLES-*`** são a ordem interna do desenho acima, e valem como
  precedência de verdade;
- **as de fora** (`ONDA-VIBRACAO-05`, `ONDA-NAVEGACAO-01`, `LEVA-3`…) são
  **colisão de arquivo declarada**, não juízo sobre quem vem primeiro. Elas
  entram porque `check_colisao_de_sprints.py` só aceita duas respostas para duas
  sprints no mesmo arquivo: `nao_toca` (mentira, eu toco) ou `depois_de`
  (serializa). **Quem decide a ordem entre ondas é quem coordena** — e se a
  outra ponta declarou o mesmo par, o "ciclo" é só as duas dizendo *"este
  arquivo é compartilhado"*, não uma contradição.

**A conferência foi feita na árvore de 27/08 com dez ondas escrevendo ao mesmo
tempo**, e nesse dia `python3 scripts/check_colisao_de_sprints.py` acusava zero
colisão para as nove desta onda. Sprint nova de outra onda no mesmo arquivo
reabre o par: **reconferir antes de despachar** é mais barato que descobrir na
costura.

---

## O que veio de onde

**Já existe e funciona — não virou sprint.** Os 16 glifos com os SVGs de
`assets/glyphs/` (`controller_card.py:4702`), os dois analógicos com X/Y
(`:4662`), o touchpad com o ponto do dedo (`:3230`), a barra de luz (`:3433`), o
giroscópio por eixo (`:3066`), L2/R2 em 0-255 (`:2964`), a bateria por card
(`:4756`), a onda do microfone (`sensor_widgets.py:423`), a fita "Ajustes vão
para" (`status_actions.py:1679`) e os chips de controle externo.

**Existe no código e nunca teve tela — as sprints de LIGAR.** É o defeito mais
caro desta casa, e a aba Controles tem cinco:

| o que a casa sabe | onde | sprint |
|---|---|---|
| o "Liberar" do alto-falante, criado e **nunca empacotado** no card de um controle | `controller_card.py:3577` criado, `:3776` ausente | 05 |
| o seletor de canal **nunca pinta a rota em vigor** — `_speaker_canal_pintando` nasce `False` e jamais vira `True` | `controller_card.py:2388`, lido em `:4085` | 05 |
| o seletor de canal só existe no card de **um** controle | `controller_card.py:3774` | 05 |
| o daemon endereça microfone **por peça** (`mic.set` e `mic.volume.set` aceitam `uniq`) e a tela grava sempre global | `ipc_handlers.py:4676`, `:4757` contra `draft_config.py:1823` | 06 |
| o acelerômetro está **no mesmo node evdev** do giroscópio, já aberto, e ninguém o lê | `evdev_reader.py:2092` | 04 |

**Não existe — as sprints de CONSTRUIR**, com o que falta no backend nomeado:

| o que falta | backend que nasce | sprint |
|---|---|---|
| interruptor de giroscópio e acelerômetro | `ProfileSensorsConfig`, `sensors.set` no IPC, meia-janela neutra no `uhid_gamepad` | 07 |
| calibrar sensores | `sensors.calibrate`, o método no backend, a spec e a linha no `mapa-controles.csv` | 08 |
| override de microfone por controle | `ControllerOverrides.mic` | 06 |

**O que sai** (`D-A-NO-JOGO-FUNDE-COM-A-STATUS`, e a palavra dela de 27/08): a
aba "No jogo", o quadro "Estado", o botão **"Ouvir no controle"**
(`main.glade:538`), o título repetido do painel (`painel_no_jogo.py:512`) e a
"linha da verdade" calculada 10x por segundo e nunca desenhada
(`controller_card.py:2825`).

---

## O que esta onda NÃO toca, e quem toca

| assunto | dono |
|---|---|
| a faixa "Número deste controle" e o crachá "Editando: Controle N", que descem do cabeçalho | **ONDA-ILUMINACAO-03** (`D-A-ESCOLHA-DO-PLAYER-MORA-NA-LIGHTBAR`) |
| o volume do microfone que **duplicava** na aba Emulação, e o modo do microfone que vai para Conexões | quem mata a aba Emulação (`D-A-EMULACAO-MORRE`) |
| o SVG do DualSense na Vibração | **ONDA-VIBRACAO-01** (`D-O-SVG-VIBRA-POR-LADO`) |

---

## O que é dela decidir — a lista inteira da onda

1. **As cinco linhas do "No jogo"** que não couberam na faixa do mockup
   (`giroscópio` está lá; `vibração · gatilho · luz · clique do touchpad · som do
   controle` não). Vão para o `?` da faixa, ou saem? *(01, 09)*
2. **O que sobra no cabeçalho** quando o frame "Estado" se dissolve, e **o que a
   aba diz com a mesa vazia** — sem card não há faixa. *(02)*
3. **Os dois "Liberar" não estão no mockup.** O contrato os mantém; o desenho
   não os desenha. Ficam como ícone, viram dica, ou saem? *(05)*
4. **O ícone do microfone carrega três ações** (`Silenciar` / `Ativar` /
   `Liberar` são o mesmo botão hoje, `controller_card.py:1980-1988`). O ícone
   cicla os três, ou o `Liberar` ganha ícone próprio? *(05)*
5. **`button_toggles_system`** — a pergunta 2 do contrato. O campo existe e o
   daemon o aplica (`profiles/schema.py:451`), sem nenhuma tela que o escreva.
   Entra como caixa no bloco Microfone, ou fica fora do produto? *(06)*
6. **O espelho de motion é do P1** (`subsystems/gamepad.py:1718`). Os
   interruptores aparecem nos cards 2, 3 e 4 mesmo sem o jogo receber motion de
   lá? *(07)*
7. **Desligar o sensor apaga a leitura do card também**, ou só o que vai ao
   jogo? *(07)*
8. **`D-PERFIL-DE-DESEMPENHO` contra `D-AUDIO-E-GIRO-NASCEM-LIGADOS`** — a
   contradição está aberta desde 25/08. Um perfil de economia que nasce com tudo
   ligado não economiza. *(07)*
9. **A calibração vive na peça ou no perfil?** O desvio é da peça; um zero por
   jogo estaria errado. *(08)*
10. **A conta de 15 textos visíveis é teto ou meta?** Teto vira portão. *(09)*

**Duas perguntas do contrato ficaram FORA desta onda de propósito**, porque o
mockup aprovado não as desenha e inventar tela é o que ela proibiu:

- **os 16 quadradinhos viram o desenho do DualSense?** (pergunta 3 do contrato).
  Ela respondeu por outro lado, em 27/08: *"Se for pros botões do dualsense
  acenderem igual temos hoje na aba status ok"* — e o mockup manteve os glifos.
  A pergunta continua aberta como **preferência**, não como pendência.
- **histórico de bateria** (pergunta 4). O diário grava por controle desde
  sempre (`daemon/battery_journal.py:214`) e o aviso de bateria baixa está
  escrito e **nunca é chamado em produção** (`integrations/desktop_notifications.py:272`
  — os únicos chamadores estão em `tests/`). É "a casa sabe e o produto não faz"
  em estado puro, e vira sprint **no dia em que ela disser**.

---

## Uma nota de infra, para quem coordena

O frontmatter destas nove **não traz o campo `onda:`**. Não é esquecimento:
`scripts/check_colisao_de_sprints.py:83` (`_CAMPOS_CONHECIDOS`) conhece seis
campos, e campo desconhecido é **erro duro** no analisador — a sprint inteira
some da conferência de colisão, que é justamente o portão que ela deveria
alimentar. **Onze sprints de outra onda já caíram nisso hoje** (as dez
`ONDA-LANCADORES-*` e o índice delas, todas com `campo desconhecido 'onda'`), e
o efeito é pior que o erro: `main()` reprova nos erros de leitura **antes** de
rodar a conferência de colisão, então enquanto elas estiverem assim **ninguém
está medindo colisão nenhuma** na pasta.

Aqui a onda viaja como **comentário** na primeira linha do bloco (`# onda:
CONTROLES`), que o analisador pula e o `grep` acha. **Acrescentar `"onda"` ao
`_CAMPOS_CONHECIDOS` é uma linha**, e quando alguém a acrescentar, o comentário
vira campo nas nove de uma vez.
