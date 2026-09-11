---
sprint: A-LISTA-DELA-DE-0911-INDICE
estado: aberta
onda: A-LISTA-DE-0911
posse:
  COORDENA:
    - docs/process/sprints/2026-09-11-A-LISTA-DELA-DE-0911-INDICE.md
cria: []
bancada: false
depois_de: []
nao_toca:
  - src/
---

# A LISTA DELA DE 11/09 — o índice da leva

**Ela abriu o produto com um DualSense na mesa e listou NOVE coisas**, em cinco
mensagens e seis fotos, e fechou com a ordem de processo:

> *"Vai botando agentes pra executar. um pra cada task. siga o padrão de*  <!-- noqa-acento: citação literal dela -->
> *trabalho como po e orquestrador do plano de 24 h."*  <!-- noqa-acento: citação literal dela -->

> *"manda geral ficar com uma branch e vc vai integrando tudo."*  <!-- noqa-acento: citação literal dela -->

> *"materializa tudo em sprints antes de despachar eles."*  <!-- noqa-acento: citação literal dela -->

**Este arquivo é o cumprimento da terceira ordem.** Nenhum agente foi despachado
antes dele.

---

## §0 — AS NOVE QUEIXAS, e onde cada uma foi parar

| # | o que ela disse | sprint |
| --- | --- | --- |
| 1 | o «Consertar» continua no lançador já localizado, e o localizado não fica verde | **LANCADOR-LOCALIZAR-01** (aberta desde 09/09, com adendo de 11/09) |
| 2 | os jogos dos lançadores têm de ter perfil por jogo | **JOGOS-DOS-LANCADORES-01** (aberta desde 09/09, com adendo) |
| 3 | o «Detectar» não acha jogo de fora da Steam (Guardiões da Galáxia) | **JOGOS-DOS-LANCADORES-01** — é o mesmo motor, e a foto dela deu o alvo |
| 4 | auditoria de áudio e giroscópio, por controle e dentro de Steam · Heroic · jogo direto | **AUDITORIA-SOM-GIRO-01** (nova) |
| 5 | em Perfis, as linhas dos controles e o «Ajuste próprio» quebram | **PERFIS-A-TELA-01** (nova) |
| 6 | em Perfis ainda aparece «Modo» — isso é da aba Jogar | **PERFIS-A-TELA-01** — mesma aba, mesmo arquivo, um agente só |
| 7 | o som funciona, mas os botões parecem errados | **SOM-BOTOES-01** (nova) |
| 8 | a Iluminação perde o seletor livre e três tons (um azul, um rosa, o preto) | **ILUMINACAO-PALETA-01** (nova) |
| 9 | vão horizontal nos blocos, e o P2 sai `—` em vez de `P2 • Desconectado` | **GATILHOS-VAO-01** (nova) |

E a décima, que é de medição e fecha a leva:

| 10 | maximizar a tela, fotografar as dez abas e validar | **PRINTS-DAS-DEZ-01** (nova) |

## §1 — AS DUAS ONDAS, e a razão de serem duas é POSSE

**Nenhuma sprint desta leva divide arquivo com outra da mesma onda** — o portão
`colisao-de-sprints` confere isso, e ele está verde com as dez dentro.

### ONDA 1 — seis agentes, em paralelo

| sprint | escreve em |
| --- | --- |
| PERFIS-A-TELA-01 | `aba10.py` · `a10_perfis.py` · `mockup/10` |
| ILUMINACAO-PALETA-01 | `aba04.py` · `a04_iluminacao.py` · `mockup/04` |
| GATILHOS-VAO-01 | `aba03.py` · `a03_gatilhos.py` · `mockup/03` |
| SOM-BOTOES-01 | `aba02.py` · `a02_controles.py` · `mockup/02` |
| LANCADOR-LOCALIZAR-01 | `aba07.py` · `a07_lancadores.py` · `desenho_dos_lancadores.py` · `cura_por_estrada.py` · `mockup/07` |
| AUDITORIA-SOM-GIRO-01 | só um documento novo |

### ONDA 2 — dois agentes, depois da costura da onda 1

| sprint | por que espera |
| --- | --- |
| JOGOS-DOS-LANCADORES-01 | a tela da aba 10 é da PERFIS-A-TELA-01; esta entrega o MOTOR e a ponta entra sobre a aba já costurada |
| PRINTS-DAS-DEZ-01 | fotografa o RESULTADO; antes da costura, fotografaria a tela de ontem |

**E duas sprints de 09/09 foram serializadas para depois da lista dela**, porque
disputavam arquivo com esta leva: `ALTURA-DA-VISTA-01` (depois da
GATILHOS-VAO-01, no `aba03.py`) e `DICA-DA-COR-01` (depois da
ILUMINACAO-PALETA-01, no `aba04.py`). A queixa viva vem primeiro; medir a altura
ou escrever a dica sobre a guia de ontem seria medir o mundo de ontem.

## §2 — O QUE VALE PARA TODO AGENTE DESTA LEVA

1. **Uma branch por agente** (`voo/<SPRINT>-opus`), árvore própria. Ninguém toca
   em `dev`, ninguém faz merge. Quem integra é quem coordena, em `onda/0911`.
2. **A tela dela é uma só, e ela está usando a máquina agora.** `--oculta` em
   toda janela. O portão `a-tela-dela` reprova quem esquecer.
3. **Nunca `install.sh`, nunca `sudo`.** A instalação é um ato só, no fim, e é
   de quem coordena.
4. **Curar o mockup não cura o produto:** o gerador escreve em `mockup/`, e sem
   `--publicar NN` a tela dela não muda. Queixa de tela que não publica volta.
5. **`MONTOU` não é «funciona».** Toda afirmação forte diz o degrau.
6. **A mordida é entrega**, não enfeite: arranque a cura, veja a régua reprovar,
   devolva.

## §3 — O FECHO, que é de quem coordena

Costura em `onda/0911` → `bash scripts/portoes.sh` TODOS VERDES → a suíte por
`scripts/rodar-a-suite.sh` → merge em `dev` → `install.sh` com a senha que ela
liberou. Nessa ordem, e o `install.sh` só depois do merge.
