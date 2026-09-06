---
sprint: ONDA-JOGAR-INDICE
estado: absorvida
posse:
cria:
bancada: false
depois_de: []
nao_toca:
  - src/
  - tests/
  - scripts/
  - install.sh
  - novo-layout/
---

> **06/09/2026 — ESTA ONDA FOI ABSORVIDA.** As sprints deste índice estão `estado: absorvida` (as do enxerto na janela GTK, `caducou`): a tela é o HTML desde 02/09, a fila é o `docs/data/paridade-gtk-html.csv` (aba 01) e a ordem de agora é [AS VINTE E QUATRO HORAS](../2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md). O que este índice mediu continua valendo como diagnóstico; nada aqui se despacha pelo id.

# ONDA JOGAR — o índice

**27/08/2026.** A aba **Jogar** (a antiga Início), do que o produto é hoje até
o que o mockup `layout/01-jogar.html` mostra. Dez sprints.

> **O campo `onda:` não está no frontmatter, e não é esquecimento.**
> `scripts/check_colisao_de_sprints.py:141` recusa campo desconhecido, e
> `onda` não está em `_CAMPOS_CONHECIDOS` (`:81`). Enquanto o portão não o
> aceitar, a onda mora no nome do arquivo e nesta linha.

## A ordem, e por que ela é essa

```
   03 ────────────┐
   (quinto degrau)│
                  ▼
   01 ──────────► 04 (modo de conexão)      05 (o degrau vai para o perfil)
   (esqueleto)                                 └── depende só de 03
     ├────────► 02 (o quarto botão)
     ├────────► 06 (a coluna Atenção) ────► 10 (a pausa)
     ├────────► 07 (as peças)
     └────────► 08 (a faixa final)

   09 (a moldura) — independente, e COMPARTILHADA com as outras nove abas
```

**A 01 é a base.** Ela cria `app/actions/jogar/` e os seis módulos-esboço com a
costura pronta; sem isso, seis sprintes disputariam o mesmo `home_actions.py`
— 3369 linhas onde a aba inteira mora hoje. Depois dela, **02, 06, 07 e 08
correm em paralelo**, cada uma no seu arquivo.

**03, 05 e 09 podem começar agora**, antes da 01: são backend e moldura, e não
tocam nada da 01.

| # | Sprint | Camada | Tamanho | Depois de |
|---|---|---|---|---|
| 01 | o esqueleto, e o que ela mandou sair | frontal | ~500 | — |
| 02 | o quarto botão: Desligado entra na fileira | frontal | ~200 | 01 |
| 03 | o quinto degrau da roda | backend | ~80 | — |
| 04 | o Modo de conexão na tela | frontal | ~350 | 01, 03 |
| 05 | o degrau escolhido vai para o perfil | backend | ~180 | 03 |
| 06 | a coluna Atenção que conta | frontal | ~300 | 01 |
| 07 | as peças com a cor do plástico | ambas | ~400 | 01 |
| 08 | a faixa final: o pendente e o Reconectar | frontal | ~180 | 01 |
| 09 | a moldura que a Jogar pede | ambas | ~250 | — |
| 10 | a pausa que só o terminal desfaz | ambas | ~150 | 01, 06 |

## As três sprints de LIGAR

O defeito mais caro desta casa é a cura escrita e nunca chamada. Três das dez
são exatamente isso:

- **05** — `CONFIRMADA_POR_ESCOLHA` (`profiles/schema.py:628`) e
  `POR_ESCOLHA_DELA` (`ponte_escada.py:174`): **zero escritores**. O comentário
  do esquema diz em letra que o valor existe para *"ela já sabe e escolhe
  direto"*, e o único chamador de `confirmar_ponte` é `launch_env.py:1008`,
  sempre com `POR_SILENCIO`.
- **10** — `daemon.resume` (`ipc_server.py:121`): **zero chamadas na janela**.
  A pausa persiste em disco (`utils/session.py:164`) e o daemon nasce pausado
  (`lifecycle.py:770`).
- **04** — a escada (`ponte_escada.py:253`) e o carimbo publicado
  (`ipc_handlers.py:1999`) rodam desde 19/08 e **nunca tiveram tela na Jogar**.

## O que ela derrubou, e não volta

**D-A-MASCARA-GANHA-O-AUTOMATICO** (`/tmp/coleta/decisoes.md:213`) punha o
Automático como terceiro botão de máscara. Ela derrubou com todas as letras:

> *"A primeira ali que temos automático não deveria estar aí. Essa parte é só a
> Máscara Deixa Xbox e Dualsense. Aí ao clicarmos em jogar pelo hefesto não abre
> apenas a máscara mas abre também a seção de Modo de Conexão."*

A máscara fica com dois botões; o Automático é o topo da escada (ONDA-JOGAR-04).
E a medição sustenta a decisão dela: `integrations/api_de_entrada.py`, no
próprio cabeçalho, se recusa a decidir a máscara — o censo de 16/08 mostrou que
**a heurística erraria em 13 dos 14** jogos do mesmo balde.

## Quatro coisas que o redesenho propunha e ela cortou

| O que era | A palavra dela |
|---|---|
| Botão **"Detectar o jogo que está aberto"** | *"pode remover esse botão, esse também Detectar o jogo que está aberto ›"* |
| Botão **"Ver na aba Conexões ›"** | *"pode remover esse botão"* |
| Linha **"Ponte com o jogo"** | *"quando vi o tooltip ele não faz sentido podemos remover ele"* […] |
| **"2 controles = 2 jogadores"** | *"vamos remover... já que temos ● 2 controles: USB + USB"* |

Nenhuma delas vira sprint. **Não inventar feature vale nos dois sentidos.**

## As perguntas do redesenho que o mockup já respondeu

1. *Card por controle ou só a contagem?* → **só a contagem e as peças**
   (legenda do mockup; sprint 07).
2. *"Reconciliar jogadores" — qual é o nome?* → **Reconectar Controles**
   (sprint 08).
3. *O "Detectar o jogo" nasce aqui?* → **não nasce** (acima).

## O que continua sendo dela, e está em cada sprint

Uma lista curta do que nenhuma sprint decide sozinha:

- **02** — o `Desligado` vale no clique ou espera o `Aplicar`; a ordem dos
  quatro modos; Ligar/Desligar também na Sistema.
- **03/04** — o nome do quinto degrau: *"Teclado + Mouse"* (mockup) ou
  *"Controlar o PC"* (`_MODE_ITEMS`). **Dois nomes para o mesmo fato é como
  esta casa ganhou os oito pares.**
- **05** — a escolha de degrau vale agora ou no próximo jogo; entra pelo
  `Aplicar`; e se ela escreve também o `Profile.mode`.
- **06** — o texto dos onze selos; o teto de itens visíveis.
- **07** — onde a cor do plástico é gravada (proposta: fora do perfil — a cor é
  da peça, não do perfil).
- **09** — o que o `Exportar` exporta; para onde vai o "Voltar ao padrão".
- **10** — entra um botão de **pausar** também, ou só o **Continuar**?

## O que o portão de colisão aponta, e não é defeito desta onda

`scripts/check_colisao_de_sprints.py` acusa **39 colisões** envolvendo a JOGAR —
e **nenhuma é entre duas sprints desta onda**. Todas são os quatro arquivos que
as dez ondas dividem:

| Arquivo | Quem mais o reivindica |
|---|---|
| `gui/main.glade` | CONEXÕES, CONTROLES, GATILHOS, ILUMINAÇÃO, NAVEGAÇÃO, PERFIS, SISTEMA, VIBRAÇÃO |
| `app/app.py` | NAVEGAÇÃO, SISTEMA, VIBRAÇÃO, IDENTIDADE-01 |
| `daemon/ipc_handlers.py` | CONTROLES, PERFIS, VIBRAÇÃO, LEVA-DE-BACKGROUND-01 |
| `install.sh`, `scripts/check_packaging_parity.sh` | ILUMINAÇÃO, VIBRAÇÃO, MOTOR-DO-ARRANJO-01, LEVA-1, LEVA-4 |

**Isso é decisão de quem coordena, não de quem escreveu a onda** — o
`depois_de` serializa uma colisão, e a ordem entre dez ondas não se decide de
dentro de uma delas. As sprintes 05, 07 e 09 são as expostas.

## Duas fronteiras declaradas

1. **A ONDA-JOGAR-09 mexe na moldura das dez abas** (`app.py`, `main.glade`,
   `mesa.py`). Se outra onda reivindicar esses arquivos, a 09 **cede** e vira
   dependência dela.
2. **O carimbo "Este jogo já sabe por onde entra" sai da aba Perfis** — palavra
   dela: *"Isso sai. Isso tá na aba Jogar."* A ONDA-JOGAR-04 o **traz**; a
   remoção é da **onda PERFIS**. As duas não podem fechar sem se falar, ou o
   mesmo fato fica em dois lugares.

## Antes de fechar a onda

```bash
git add -A                       # os portões são cegos a arquivo novo
bash scripts/portoes.sh
scripts/gui-captura/retratar_abas.py   # a aba mudou: as fotos acompanham
```

E a regra que fecha qualquer coisa que toque a tela: **a palavra final é dela**
(PROVA-DE-TELA-01) — foto antes e depois.
