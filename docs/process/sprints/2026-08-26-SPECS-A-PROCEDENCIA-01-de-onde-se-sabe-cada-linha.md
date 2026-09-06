---
sprint: SPECS-A-PROCEDENCIA-01
estado: aberta
onda: G
posse:
  P1:
    - docs/data/mapa-controles.csv
    - docs/data/ensaios.csv
    - html/specs.html
    - src/hefesto_dualsense4unix/app/fatos_do_mapa.py
    - scripts/eliminacao.py
    - scripts/gerar-mapa.py
cria:
  - tests/unit/test_a_procedencia_da_linha_nao_e_vazia.py
bancada: true
depois_de:
  - A-RECUSA-QUE-CITOU-O-MAPA-01
nao_toca:
  - src/hefesto_dualsense4unix/interface/
  - src/hefesto_dualsense4unix/daemon/
  - mockup/
---

> **ROTA CORRIGIDA — 06/09/2026, arrumação da leva (Fable, PO por delegação).** **O gatilho dela ("depois do redesenho inteiro da interface") FOI ATINGIDO em 06/09:** a
janela GTK saiu, as dez abas estão construídas e o produto roda o HTML. **A P1 abre agora; a P2
(medir no aparelho) continua dela, na MESA-DE-QUATRO-01.** E ela é a sprint que faz o que ela
pediu hoje com todas as letras: *"já validamos via testes individuais mas nunca marcamos num
canto"*. A P1 é dar a cada linha do mapa o ponteiro para a prova que já existe — teste, ensaio,
commit, sprint — nas colunas `*_de_onde_sei`, `provado_em`, `provado_por`, `teste_que_morde`.
**Regras que já custaram:** `radio_ate_onde_foi` tem domínio fechado (MONTOU · SAIU NO FIO · O
APARELHO OBEDECEU · O JOGO RECEBEU · O JOGO REAGIU) — prosa vai em `*_evidencia`;
`teste_que_morde` pede node id completo de pytest; `csv.writer` precisa de `lineterminator="\n"`;
`nao-medido` (06/09) é a palavra para "ninguém olhou" — **nunca promova uma célula sem a prova
apontada.** Entram na P1, com endereço, as **cinco chaves da fila do F-MAPA**
(`docs/process/agentes/2026-09-06/A-TELA-NOVA-ENTRA-NA-REGUA-DO-MAPA-01.md` §3.1) e o que os
relatórios de hoje em `docs/process/agentes/2026-09-06/` mediram e declararam por `chave`.
Regerar `html/specs.html` e `app/fatos_do_mapa.py` (`gerar-mapa.py`, `gerar-fatos-de-tela.py`) —
os dois estão na posse como saída gerada. `ensaios.csv` só ganha linha com ensaio feito; as
linhas da bancada de hoje são da MESA-DE-QUATRO-01.

> **ESTADO 06/09/2026: aberta, fora das 24 horas** — `docs/process/SPRINT_ORDER.md` §2.7 — a condição é dela: depois de a interface estar igual ao desenho e funcionando.

# SPECS · A PROCEDÊNCIA DE CADA LINHA — 01

**26/08/2026. NÃO EXECUTAR AINDA.**

## O gatilho: quando esta sprint acorda

Ela roda **depois do redesenho inteiro da interface**, e a condição é dela, com
as palavras dela:

> *"Tipo a interface ficou igual nos mockups e tudo tá funcionando. Aí agora
> falta concluirmos o specs.html? aí é hora de executar tal sprint."*

Três coisas antes: os mockups aprovados, as dez abas construídas, e o produto
rodando igual ao desenho. **Antes disso, esta sprint não abre.**

## O defeito, medido em 26/08/2026

O `mapa-controles.csv` afirma, para o DualSense, **72 linhas com
`cabo_aceita=sim`**. A coluna que diz *de onde se sabe disso*:

| `ponte_de_onde_sei` | Quantas |
|---|---:|
| **(vazio)** | **62** |
| `inferido-do-codigo` | 10 |

**Sessenta e duas afirmações sem procedência.** Não é que sejam falsas — é que
ninguém sabe se foram medidas no aparelho, lidas no código, ou herdadas de uma
suposição que atravessou seis versões do arquivo.

Palavra dela, e é o diagnóstico:

> *"todas as features do dualsense via cabo, já validamos via testes individuais
> mas nunca marcamos num canto e integramos ao projeto lá, usamos a tentativa e
> erro pra eliminação e equiparar as features do cabo com os canais do bt."*

O conhecimento existe. Está em testes, sprints, commits e na cabeça dela. O que
falta é o ponteiro de cada linha para a prova dela.

## Por que isso trava o `specs.html`

O caderno tem **178 ensaios**, e **46 dizem "não obedece"**. Nenhum deles diz por
qual **ponte** foi medido (`ponte` vazia em 178 de 178; `degrau` em 177).

Sem a ponte, "não obedece no rádio" não distingue:

- o rádio não leva aquele canal, **ou**
- a máscara Xbox não tem aquele canal, e a medição foi feita nela

São coisas diferentes e a diferença é o produto inteiro. Metade das linhas
`uhid` do mapa — giroscópio, acelerômetro, os dois pontos do touchpad, o clique,
o rumble — **só existe quando a máscara é a DualSense**
(`integrations/ponte_escada.py`, § *A assimetria, contada no mapa*).

**A regra do vazio já existe e é honesta** (`eliminacao.sustentam_a_ponte`):
ensaio de ponte vazia sustenta afirmação de QUALQUER ponte — porque não se sabe
por onde passou, não se pode negar nenhuma. O vazio não mente; ele confessa. Mas
confissão não fecha o mapa.

## O método, e ele é o desta casa

Palavra dela, sobre como os dois trabalham:

> *"vc geralmente conduz a parte da experiência e isolamento e na sequência eu
> faço a parte que vc não consegue fazer que é usar o controle na vida real"*

### Fase P1 — quem coordena conduz (sem aparelho)

Varrer testes, sprints e commits atrás de **cada uma das 62 afirmações sem
procedência**, e para cada uma escrever de onde ela vem:

- `medido-no-aparelho` + o ensaio que a prova (o `id` no `ensaios.csv`)
- `inferido-do-codigo` + arquivo:linha
- `lido-no-driver` + qual das quatro referências de driver
- **`nao-medido`** — e esta é a entrega mais valiosa da fase

O `nao-medido` é o ponto: hoje o vazio se lê como "sabe-se". Depois desta fase,
o que ninguém provou **diz que ninguém provou**.

Sai também a lista das linhas que a fase P1 conseguiu casar com ensaio existente
mas cujo ensaio não declara a ponte — são candidatas a **retro-preenchimento**,
quando o commit ou a sprint de origem disser qual máscara estava valendo.

### Fase P2 — ela mede (com o controle na mão)

O que sobrar como `nao-medido` vira a fila da bancada. E ela não mede num
Streamlit à parte: mede **na própria aba Controles**, que a essa altura já
registra ensaio com um clique — e a `ponte` e o `degrau` nascem preenchidos,
porque o produto sabe qual está valendo naquele instante
(`D-O-CADERNO-DE-ENSAIOS-ENTRA-NA-ABA-CONTROLES`).

É por isso que esta sprint vem **depois** do redesenho: a ferramenta que a torna
barata nasce lá.

## O que fica de pé quando ela fechar

1. **Nenhuma linha do mapa afirma sem dizer de onde sabe.** Um teste novo
   (`test_a_procedencia_da_linha_nao_e_vazia.py`) reprova a linha que voltar a
   afirmar em branco.
2. **A fila da bancada tem fim** — deixa de ser "falta medir" e passa a ser uma
   lista contável.
3. **O `specs.html` fecha** com cada célula sabendo dizer por qual ponte a
   afirmação vale.

## O alvo, que é dela e é o do projeto

> *"ensaios.csv é o mais valioso do projeto. Depois disso faremos o controle do
> ps5 que faz tudo via bt no ps5 ter o mesmo potencial do pc com o cabo
> conectado. além de ser a fonte da verdade universal do projeto."*

A pergunta do projeto inteiro é uma linha deste caderno: **para cada feature,
ela obedece no rádio, e por qual ponte?** Enquanto a coluna `ponte` estiver
vazia, a pergunta não tem como ser respondida — só estimada.

## O que esta sprint NÃO faz

- **Não toca `src/`.** É trabalho de dado e de régua, não de produto.
- **Não reescreve o `specs.html`** — ele é gerado; o que muda é a fonte.
- **Não mede nada sozinha.** A fase P2 é dela, com o aparelho, e nenhuma linha
  vira `medido-no-aparelho` sem ensaio no caderno.
