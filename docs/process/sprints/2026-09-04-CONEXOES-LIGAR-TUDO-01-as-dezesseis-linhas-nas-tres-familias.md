---
sprint: CONEXOES-LIGAR-TUDO-01
estado: feita
posse:
  T-10:
    - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
    - src/hefesto_dualsense4unix/interface/aba08.py
    - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
    - tests/unit/test_a_aba_08_conexoes_fecha_as_linhas.py
bancada: true
depois_de: [ONDA5-08-01, ONDA5-08-02, ONDA5-02-01]
nao_toca:
  - docs/data/paridade-gtk-html.csv
  - mockup/DIVERGENCIAS.md
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
---

> **FEITA — 06/09/2026, ONDA C (agente `C-CONEXOES-LIGAR-TUDO-01`).** Das
> dezesseis do balde `LIGAR`, **cinco já estavam fechadas**, **cinco fecharam
> aqui** (o hub em comum, as contagens do gabinete, o alvo de saída lido DE
> VOLTA, o aviso do controle que o sistema não entregou, e o medidor de rádio),
> **uma estava fechada e o CSV não sabia**, e as cinco que sobram estão nomeadas
> com o que as segura. `daemon/ipc_handlers.py` **não foi tocado**, e é decisão
> medida. No caminho caiu um defeito vivo que a costura do dia tinha aberto,
> calado: a régua de Desempenho mostrava ZERO controle no rádio **com o controle
> no rádio**. O arquivo da aba foi de 32 para 45 testes. As linhas do CSV
> estavam no `nao_toca` e foram entregues prontas ao coordenador (a
> `PARIDADE-REMEDIR-01` as recolhe). Relatório: `docs/process/agentes/2026-09-06/CONEXOES-LIGAR-TUDO-01.md`.

# CONEXOES-LIGAR-TUDO-01 — as dezesseis linhas da aba 08, nas três famílias

> **Decisão dela, 04/09/2026, tarde:** *"tudo"* — as três famílias (fôlego,
> desenho, IPC), não só as de fôlego que eu recomendei.

> **UMA VOLTA FEITA — 06/09/2026, ONDA C.** O relatório com as doze mordidas, a
> prova de tela e o texto pronto para o CSV e o `DIVERGENCIAS.md` está em
> [`docs/process/agentes/2026-09-06/CONEXOES-LIGAR-TUDO-01.md`](../agentes/2026-09-06/CONEXOES-LIGAR-TUDO-01.md).
>
> **Fecharam CINCO** — a 4 (hub em comum), a 5 (contagens do gabinete), a 8
> (alvo de saída lido de volta, que o `PINTOR-MARCADO-01` desbloqueou), a 14
> (controle não adotado) e a 15 (rádio nativo frágil). As quatro últimas são
> linha de ressalva e **medem zero pixel em repouso**, medido no WebKit.
>
> **DUAS CAÍRAM MEDINDO, e o enunciado desta sprint estava errado nas duas:**
> a **1** (*exame da mesa*) já fechara em 03/09 pela `MIGRA-08-01` — o CSV é que
> é de ontem; e a **2** (*ambiguidade fina*) **não tem superfície**, porque o
> único consumidor de `ambigua` em toda a árvore é `resposta_ao_ja_movi`, do
> botão "Já movi — reexaminar" que ela mandou tirar em 31/08.
>
> **AS QUATRO QUE SOBRAM, com o que segura cada uma** (§6 do relatório): a **6**
> (selo de procedência do medidor — decisão dela; a metade do *"não sei"* é
> fôlego e continua aberta), a **10** (a razão da luz numa linha VISÍVEL —
> desenho, e desenho é dela), a **12** (contagem da Gestão — a cura mora em
> `gui/aba_conexoes.py`, outra posse) e a **13** (controles EXTERNOS — precisa
> de `controller.list` no tique ou de campo novo no `state_full`, e nenhuma das
> duas se prova sem `install.sh`).
>
> **`daemon/ipc_handlers.py` NÃO FOI TOCADO**, e a razão é medida: as três
> chaves de que as linhas 8, 14 e 15 precisavam **já estavam publicadas** no
> daemon vivo (52 chaves de topo, conferidas em 06/09).

## 0. AS DEZESSEIS

Lista do balde `LIGAR` da `08-conexoes`
(`../2026-09-04-AS-232-LINHAS-ABERTAS-o-que-falta-de-verdade.md`, linhas
130–145). Sete fecharam na madrugada; **quem pegar remede quais**, com
`scripts/check_paridade_gtk_html.py` — a lista é a de partida, não o estado.

| # | a linha |
| --- | --- |
| 1 | Exame da mesa — quantas conferências rodam, e quando |
| 2 | Ambiguidade fina das ordens (quem é quem no barramento) |
| 3 | Tabela de adaptadores Bluetooth (Nome · Adaptador · Onde está) |
| 4 | O hub em comum acima de todos os adaptadores |
| 5 | As contagens do gabinete (o que o firmware diz × o que o kernel conta) |
| 6 | Medidor de rádio / Desempenho (turnos por adaptador) |
| 7 | Rádios vizinhos — a coluna "Onde" e o aviso de vizinhança |
| 8 | Alvo de saída — LER DE VOLTA qual é o alvo agora |
| 9 | Microfone — quanto ele custa de rádio (a frase da capacidade) |
| 10 | "A luz não acende" — a RAZÃO de a cura ser oferecida |
| 11 | Aviso da mesa suja (outro programa segurando o nó do controle) |
| 12 | Contagem da seção Gestão de Controles |
| 13 | Controles EXTERNOS (8BitDo, Pro Controller, Xbox) na lista da mesa |
| 14 | Aviso "controle ligado que o sistema não entregou ao Hefesto" |
| 15 | Aviso do Bluetooth nativo frágil |
| 16 | Ocupação de rádio por adaptador (quem está em qual dongle) |

## 1. AS TRÊS FAMÍLIAS, e a ordem

1. **Fôlego** — o dado existe nos dois lados; falta ler e endereçar. Sem
   decisão, sem publicação. Primeiro.
2. **Desenho** — a página não tem onde escrever. Endereço novo no mockup,
   **uma** publicação da 08 para ela olhar, todas juntas.
3. **IPC** — o `state_full` não publica o dado. O `a08_conexoes.py` já marca
   duas com a razão (`interface/pacotes/a08_conexoes.py:4040`, `:4048`: *"o
   `state_full` não publica quem está declarado"*, *"não publica override"*).
   Método ou campo novo no daemon, e `install.sh` para valer.

A **8** (alvo de saída lido de volta) espera o
[PINTOR-MARCADO-01](2026-09-04-PINTOR-MARCADO-01-o-decimo-alvo.md).

## 2. A MORDIDA

Cada linha fechada ganha a sua na régua `--prova-de-mockup`, e a paridade da
08 no CSV sobe — o número de partida é 27% (`check_paridade_gtk_html.py`).

## Posse, para o despacho

**Toca:** `src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py` · `src/hefesto_dualsense4unix/interface/aba08.py` · `src/hefesto_dualsense4unix/daemon/ipc_handlers.py` · `docs/data/paridade-gtk-html.csv`.

**Bancada:** sim — dois controles, um em cada transporte.
