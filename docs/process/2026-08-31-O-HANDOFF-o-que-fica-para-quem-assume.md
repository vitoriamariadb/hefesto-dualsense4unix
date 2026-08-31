---
sprint: HANDOFF-31-08
bancada: true
---

# O HAND-OFF — 31/08/2026

**Para quem assumir amanhã.** Escrito no fim de uma sessão que bateu o teto de
uso; parte das auditorias que eu tinha despachado **morreu no meio** e está
nomeada abaixo. Nada aqui é presumido: o que não foi medido está marcado como
não medido.

---

## 1. O QUE FICOU FUNCIONANDO, e é o mais importante

**O app de dev anda sozinho.** Ela desinstalou o Hefesto estável e o app parou
na hora — a premissa que o sustentava estava escrita no `install-dev.sh` desde
29/08 e caiu. A camada de máquina virou `scripts/lib/camada_de_maquina.sh`,
sourceada pelos DOIS instaladores, e o `install-dev.sh` ganhou
`--camada-de-maquina`.

Conferido nesta máquina: grupo `hefesto` existe com ela dentro, `/dev/uhid` é
`crw-rw----+ root hefesto` (nascia `crw------- root root`), broker, resiliência
do bluetoothd, ponte privilegiada e agente de pareamento no ar.

**O botão de ligar da tela nova liga de verdade e lembra.** Antes era desenho:
`listeners=0` nos quatro botões da fileira.

**As dez abas do mockup**, validadas clicando: 43 selects exercidos, 278
cliques, zero vazamento antes e depois, zero rolagem lateral, zero erro de JS.

---

## 2. O DEFEITO DE MÉTODO DO DIA, e ele vale mais que qualquer conserto

**Toda correção de hoje parou na fronteira do desenho.** Três auditorias
independentes mediram o mesmo padrão nas onze decisões dela:

> o HTML da aba e o Python do produto foram curados, com lápide datada e bem
> escrita. **Nada da fila de execução foi tocado.**

O resultado é **segunda verdade viva** em documento que ninguém releu:

| decisão dela | tela + código | sprints e docs |
|---|---|---|
| o "Automático" sai da escada | limpo | **6 sprints + 2 docs** ainda o anunciam |
| "Os controles da mesa" → "Conectados" | **1 resíduo** na própria tela | 2 sprints ainda mandam escrever o velho |
| os algarismos saem | limpo | **11 arquivos** ainda prometem a fórmula |
| Point And Click é modo, não perfil | **só em 2 `title=`** | 3 telas vivas dizem o contrário |

**Os dois piores, nomeados:**

- `docs/process/sprints/2026-08-29-MIGRA-JOGAR-07-*.md` — sprint **pendente** que
  carrega as TRÊS versões velhas ao mesmo tempo, com um teste que **exige o
  Automático de volta**. Quem a executar amanhã desfaz a decisão dela.
- `docs/process/sprints/2026-08-29-MIGRA-NAVEGACAO-INDICE.md:169` — registra *"o
  «Automático» do Modo de conexão é outra coisa e **fica**"* dentro da tabela
  **"As que já foram decididas, e não se reabrem"**. Verdade caduca sob selo que
  proíbe reabri-la.

**E o meu próprio erro, do mesmo tipo:** o `ONDE-PARAMOS` de hoje afirma *"a
frase antiga não existe mais em `layout/` nem em `src/`"*. É falsa —
`layout/02-controles.html:1328` ainda diz "os 4 controles da mesa". Conferi a
tela e generalizei para o arquivo sem rodar o `grep`. É o mesmo defeito que a
RETOMADA de 30/08 cometeu com o botão "Liberar", e que este documento diagnostica.

---

## 3. A CONTRADIÇÃO QUE TRAVA QUALQUER AGENTE NOVO

`CLAUDE.md:133` diz: *"`novo-layout/` **não é referência**… ele **é** a
interface. Se você mudar o mockup, mudou o produto."*
O commit `48b4e1a2` diz: *"o produto lê de `layout/`; `novo-layout/` volta a ser
**só referência**."*

O `CLAUDE.md` é `.gitignore:90` — não viaja em worktree, não passa por revisão, e
**é o primeiro arquivo que todo agente lê**. Ele manda mexer no mockup que ainda
tem a escada plana com o "Automático" que ela mandou sair.

**Conserte isto antes de despachar qualquer agente novo.**

---

## 4. A PESQUISA DOS CANAIS DE RÁDIO — o que ficou e o que ela vale

Três workflows, **407 agentes**, **27 fontes externas**, 112 propostas,
**40 sobreviveram** a três céticos. `fonte_externa` no mapa: 5 → 27 linhas.

**O achado maior:** o som no rádio tem causa, em código, no driver que este
produto instala — `hid-playstation.c:1956` cria o evdev do jack só para
`BUS_USB`, com o comentário `/* Bluetooth audio is currently not supported. */`.
Por rádio o kernel **nunca** escreve `audio_control`, `speaker_volume` nem
`audio_control2`. Isso explica as quatro replicações negativas de 16/08 — **e
não derruba a lembrança dela**: prova que o caminho do KERNEL está fechado, não
que o aparelho recuse.

**O que foi materializado** (`docs/process/pesquisas/2026-08-31-canais-de-radio/`):
os três resultados estruturados, os três journals com cada agente, e
`refutadas-r1.md` / `r2.md` / `r3.md` — **as refutações com prova**, que é
conhecimento negativo: *"tentamos, está errado, eis o arquivo:linha"*.

**O que NÃO foi materializado** (o teto de uso cortou): os `fontes-r1/r2/r3.md`
saíram vazios ou incompletos, e o `LEIA-PRIMEIRO.md` da pasta **não foi
escrito**. O bruto está lá; refazer é rodar o workflow salvo em
`~/.claude/.../workflows/scripts/materializar-a-pesquisa-dos-canais-*.js`.

---

## 5. O MEDO DELA, E ELE SE CONFIRMOU

Palavra dela: *"eu tenho medo do trampo dos agentes estarem incorretos… me
referia ao trabalho dos céticos em si."*

A auditoria dos céticos foi despachada com 39 alvos — as 20 células que
sobreviveram com um dissidente e as 19 refutações sem `arquivo:linha`. **Só 3
completaram antes do teto.** Placar dos três:

| | |
|---|---|
| cético CERTO | 1 |
| **cético ERRADO** | **2** |

**Dois de três.** Amostra pequena demais para generalizar — mas prova que o
modo de falha existe, e os dois casos estão detalhados no journal
`wf_cb11befd-79e`. Um deles achou **dois defeitos vivos no CSV hoje**:
`mapa-controles.csv:222` lista `EN_TIMEOUT 0x05` como saindo pelo cabo, e ela
não sai por transporte nenhum; e um `:2848` que deveria ser `:2849`.

**O viés é meu, não deles:** eu instruí cada cético com *"na dúvida,
refutada=true"*. Protege o mapa de célula falsa e produz o erro inverso —
refutar o que era verdade, e o resultado é célula **vazia**, que ninguém
questiona porque vazio parece "ninguém perguntou".

**Medido, dos 335 vereditos:** 210 refutaram, **191 citam `arquivo:linha`
conferível (91%)**, 19 não citam endereço nenhum, argumento mediano de 3.801
caracteres. Os céticos não foram preguiçosos — mas citar endereço não é o
endereço dizer o que se afirma, e **36 dos 39 alvos ficaram sem auditor**.

---

## 6. O QUE FAZER PRIMEIRO, amanhã

1. **Consertar `CLAUDE.md:133`** (§3). Trava tudo mais.
2. **Rodar a auditoria dos céticos que morreu** — o script está salvo:
   `Workflow({scriptPath: "…/auditar-os-ceticos-wf_7dab3899-7aa.js",
   resumeFromRunId: "wf_cb11befd-79e"})`. Os 3 prontos voltam do cache; só os 36
   que faltam rodam.
3. **Os dois defeitos do CSV** que a auditoria achou (§5), que ninguém consertou.
4. **A varredura das sprints** (§2) — as seis que reintroduzem o "Automático".
5. **Os 23 ensaios de bancada**, em
   `docs/process/sprints/2026-08-31-A-BANCADA-QUE-O-RADIO-PEDE-INDICE.md`. As
   quatro primeiras somam **29 minutos** e movem sete células. O #1 é o som no
   rádio, quatro minutos, a orelha dela.

---

## 7. O QUE NÃO ESTÁ LIGADO, e é a resposta à pergunta dela sobre o layout novo

Ela perguntou: *"se eu desligar e pedir depois pros agentes executarem tudo em
termos de ligar e garantir o funcionamento do app, teremos isso pro novo
layout?"*

**Hoje, UM piloto tem lançador:**

| piloto | lançador |
|---|---|
| `controles_vivos.py` | `interface` → `scripts/abrir_interface.py` |
| `jogar_vivo.py` · `conexoes_vivas.py` · `perfis_vivos.py` · `sistema_viva.py` · `mesa_viva.py` | **NENHUM** |

Ou seja: **a aba Controles e o interruptor da Jogar são produto vivo; o resto
das dez é mockup estático.** O piloto instala a ponte de gesto em qualquer
página com `[data-modo]`, e é por isso que o interruptor funciona.

**O caminho existe e está escrito: 120 sprints `MIGRA-*`** em
`docs/process/sprints/`, uma onda por aba, com a ordem em
`2026-08-29-MIGRA-A-ORDEM-das-dez-abas.md`. Não é trabalho de uma tarde, e
**quem executar tem de ler antes o §2 e o §3 deste documento** — porque várias
dessas sprints ainda carregam a versão velha das decisões dela.
