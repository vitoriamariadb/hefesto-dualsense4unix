# CONEXOES-LIGAR-TUDO-01 — as dezesseis linhas da aba 08, nas três famílias

> **Decisão dela, 04/09/2026, tarde:** *"tudo"* — as três famílias (fôlego,
> desenho, IPC), não só as de fôlego que eu recomendei.

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
