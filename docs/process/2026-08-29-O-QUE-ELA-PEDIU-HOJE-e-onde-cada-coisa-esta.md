---
cria: nenhum módulo — este documento rastreia, não constrói
---

# O QUE ELA PEDIU HOJE — e onde cada coisa está

> **O estado medido do projeto cabe em cinco minutos:**
> [O QUE É VERDADE HOJE](2026-08-29-O-QUE-E-VERDADE-HOJE.md). Leia-o antes deste arquivo se o que você
> precisa é o que é fato, o que é dívida e o que já foi curado.

**29/08/2026.** Pedido dela, com todas as letras:

> *"não esqueça de ir lançando agentes, validando o trabalho deles e garantindo
> que tudo que falei hoje vai ser realizado."*

Este arquivo é a garantia. **Ele é a lista fechada do que ela pediu nesta
conversa**, e cada linha tem um estado que só muda contra o disco. Se a sessão
morrer, quem assumir lê isto e continua sem perguntar nada a ela.

**Como manter:** ao fechar uma onda, confira o que ela afirma **contra o disco**
e mude o estado aqui. Estado não muda por relato de agente — muda por medição.

---

## 1. A INTERFACE — a aba Controles, que ela está olhando

| # | O que ela pediu | Estado | Onde conferir |
|---|---|---|---|
| 1 | Os sete ajustes (mic, analógicos, som, sensores, LED do jogador, título) | **FEITO** | o `or 128` que fazia `0` virar `128` foi curado e a cura arrancada para provar; a geometria saiu de assimétrica (−43,5/+52,5) para simétrica (−48/+48) |
| 2 | A coluna esquerda vira **três campos**, o LED do jogador sai de dentro da Barra de luz | **EM VOO** | `wf_bbc80263-c53` |
| 3 | O bloco dos sensores vira **três blocos**, sem vão | **EM VOO** | idem — o vão medido era 95px (mesa de 4) e 181px (a dela) |
| 4 | **O acelerômetro FUNCIONA** — correção dela: *"não era pra ele sair, era pra ele funcionar"* | **EM VOO** | `wf_5aa18557-224`, frente 4 · a sprint `ONDA-CONTROLES-04` orça 4 degraus |
| 5 | A cor do plástico para de dizer **"Não sei"** | **EM VOO** | `wf_bbc80263-c53` · causa medida: o produto abre `/dev/hidraw` direto e leva negação; o ensaio lê pela porta do broker com `SCM_RIGHTS` |
| 6 | **A frase falsa sai da tela** (*"o aparelho não o entrega"*, 4 ocorrências) | **PENDENTE** | `aba02.py:815`, gerado em `02-controles.html:1136,:1348,:1560,:1772` — só depois que a onda 2/3 soltar o arquivo |

## 2. O APP — dois Hefestos convivendo

| # | O que ela pediu | Estado | Onde conferir |
|---|---|---|---|
| 7 | Um `.sh` **`interface`** na raiz do `-dev`, para ela clicar | **FEITO** | `hefesto-dualsense4unix-dev/interface`, executável |
| 8 | A **logo do app na dock** | **EM VOO** | `wf_5aa18557-224`, frente 1 |
| 9 | As janelas extras (Navegação, Conexões) na **mesma instância** | **EM VOO** | idem, frente 2 · três janelas soltas já localizadas |
| 10 | **Instalação separada**, o app de dev com identidade própria | **EM VOO** | idem, frente 3 |
| 11 | **Desligar o estável por completo e religar**, sem manchar o novo | **EM VOO** | idem — 8 pontos de colisão a separar, e o crítico é quem pega o hidraw |

## 3. O CONHECIMENTO — que ela não quer perder de novo

| # | O que ela pediu | Estado | Onde conferir |
|---|---|---|---|
| 12 | Coluna no CSV dizendo **de qual repo veio** a informação e se **validaram na mesa** | **FEITO** | `mapa-controles.csv` ganhou `fonte_externa` (coluna 44); 24 linhas preenchidas; `provado_por` já dizia `aparelho`/`olho-dela` |
| 13 | Quatro agentes buscando (projeto, Steam/SDL, Sony/HID, GitHub) | **FECHOU** | achou que o acelerômetro está medido nos dois transportes e é a **única** das 308 linhas com `so-ela-decide` dos dois lados |
| 14 | **Materializar esta conversa** no repo, substituindo o que está errado | **EM VOO** | `wf_147f63b4-4ec` — 11 fatos, e a porta de entrada que encurta a leitura |
| 15 | Registrar que **o rádio é estado, não veredicto** (o PS5 faz tudo por BT) | **FEITO** | `D-O-RADIO-NAO-E-VEREDICTO-E-ESTADO` |
| 16 | Registrar que **a régua é qualquer mesa**, não a dela (GPL3, acessibilidade) | **FEITO** | `D-A-REGUA-E-QUALQUER-MESA-NAO-A-DELA` |
| 17 | Registrar a ideia do Fable: **áudio virtual** (alto-falante e mic como o vpad) | **FEITO** | `D-O-SOM-DO-CONTROLE-VIRA-DISPOSITIVO-VIRTUAL-DO-SISTEMA` — e metade já é produto |
| 18 | Registrar a **memória por identidade** dentro do perfil de jogo | **FEITO** | `D-O-CONTROLE-E-LEMBRADO-POR-IDENTIDADE-DENTRO-DE-CADA-PERFIL` + sprint `QUEM-E-QUEM-01` |
| 26 | **Materializar a ponte JS** (a interface virou dirigível por dentro) e ter no gancho **algo que induza validação via interface** | **FEITO**, e mora em `interface/nova` — chega aqui no merge | a biblioteca `scripts/regua_de_tela.py` · 17 casos na aba Controles (`tests/unit/test_regua_de_tela_a_aba_controles.py`) · o portão `scripts/check_regua_de_tela.py` no `pre-commit`, grau 1 (avisa, não segura) · o manual `docs/process/2026-08-29-A-REGUA-DE-TELA-como-se-prova-a-interface.md`, com os sete defeitos de tela já pagos virando caso de régua. **Mordidas remedidas:** o `or 128` de volta → 3 vermelhos; o `translate(-50%,-50%)` arrancado → 3, com −43,50/+52,50 px medidos de volta pela tela <!-- ref-externa: os quatro arquivos nascem na branch `interface/nova` e só existem nesta árvore depois do merge; citá-los é o assunto da linha --> |

## 4. O QUE AINDA NÃO TEM ONDA — e é dívida de quem coordena

| # | O trabalho | Por que ainda não | O endereço |
|---|---|---|---|
| 19 | **O alto-falante virtual** (a metade que falta da ideia do Fable) | sprint não escrita | `audio.alto_falante`: "zero linhas de implementação", canal medido (escada `0x31`=77 B … `0x39`=546 B) |
| 20 | **As sete cores** que o produto não sabe nomear | proposta feita, não executada | `NOMES_DE_FABRICA` (21) deve derivar de `cores-do-dualsense.csv` (28) |
| 21 | **O `clear` do "audio" e do "led"** — armam e nada solta | sprint escrita, não executada | `A-TRAVA-DO-LED-NAO-SOLTA-01`. Endereço remedido em 29/08: `ipc_handlers.py:4729` arma "audio" (1 mark, 0 clears); "led" tem 2 marks (`:1369`, `:1425`) e 0 clears |
| 22 | **A máscara por controle** — a um parâmetro | **FEITO** (o parâmetro; sobra recriar o vpad) | `A-MASCARA-POR-CONTROLE-01`: `virtual_pad.py:153` tem `identity`; `coop.py:990` e `gamepad.py:2108` passam o MAC; 13 testes em `test_mascara_por_controle_manda_no_vpad.py` |
| 23 | **As features por controle no perfil** (mic, máscara, giro, accel, touch) | sprint escrita, não executada | `QUEM-E-QUEM-01` — 4 de 9 prontas |
| 25 | **A troca de player à mão** — a seção "Selecione o player" da aba Iluminação tem de funcionar | **SEM ONDA** | o IPC existe (`identity.number.set`); o desenho está em `04-iluminacao.html`; falta ligar |
| 24 | **Persistir a cor lida** | sprint não escrita | `ControleDeclarado.cor` (`utils/maquina.py:551`) existe e nada escreve |
| 27 | **O CI, que é a outra metade do *"e os testes automáticos funcionam"*** | achado ao medir a frente 26; sprint não escrita | **A suíte funciona** (8 lotes, 13.839 verdes, 11 min 16 s — o `CLAUDE.md` publica 13.133 e 13.381, os dois velhos). **O CI não:** última corrida em `dev` foi 26/08 e deu `failure`; há 13 commits locais não empurrados. E o job `anonymity` (`ci.yml:34-44`) só faz `checkout` — sem `setup-python` e sem `pip install` —, mas ganhou dois passos que importam `playwright`/`structlog` **depois** daquela corrida (`c4a8f88d`, 27/08 e `e3c2d2bf`, 28/08). Reproduzido com o `python3` do sistema: `ModuleNotFoundError` nos dois. Ele reprova na primeira vez que rodar |

---

## 5. AS CORREÇÕES DELA, e elas valem como regra

Três vezes hoje ela corrigiu quem coordena, e as três mudaram o trabalho:

1. **A REGRA AUTOMÁTICA da numeração não muda; a TROCA À MÃO tem de funcionar.**
   Quem coordena errou DUAS vezes aqui, e as duas foram generalização. Primeiro
   propôs inverter a regra automática (identidade em vez de chegada), e ela
   recusou com a razão medida: *"antes eu sempre conectava o controle branco e
   mesmo não tendo nenhum outro controle ele era sempre o player 3. E o jogo de um
   player só não entendia."* Depois escreveu que *"nenhuma sprint pode tocar na
   numeração"* — e ela corrigiu: *"o nosso layout é pra permitir a troca do player
   de cada controle. No novo layout temos uma seção pra isso e ela tem que
   funcionar."* A seção é **"Selecione o player"**, na aba **Iluminação**, e o
   desenho já diz a semântica: *"dar um número ocupado é uma TROCA, não uma fila"*.
   O IPC existe (`identity.number.set`, `ipc_handlers.py:1590`).
2. **O acelerômetro era pra funcionar, não pra sair.**
3. **O mapa que importa era o `mapa-do-controle.html`**, não o `mapa-controles.csv`
   — e ela já tinha dito que o `specs.html` era importante, e quem coordena não
   tinha lido.
