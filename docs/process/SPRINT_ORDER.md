# SPRINT_ORDER — o que está aberto e em que ordem

> **02/09/2026 — A FILA MUDOU DE DONO.** O que estava aqui era a fila do
> REDESENHO (as 90 sprints de 27/08, uma por aba). Ela cumpriu o papel: as dez
> abas foram desenhadas e ela aprovou. **O que ficou aberto é OUTRO problema** —
> as telas existem e não funcionam. A fila de agora é a
> [ROTA DO HTML](sprints/2026-09-02-ROTA-DO-HTML-INDICE.md), e ela está abaixo.
> A fila do redesenho segue no §2, para quem precisar de uma sprint de desenho.

---

## §0 — A ORDEM, e por que cada posição evita REFAÇÃO

Pedido dela, 02/09/2026: *"ao final de tudo pensando na infra como um todo. sem
mais refação."* <!-- noqa-acento: citação literal dela -->

**A regra que produz esta ordem é uma só:** nada que outra coisa vá reescrever
entra antes dela. Cada posição abaixo tem a razão medida.

### FASE 1 — A FUNDAÇÃO *(as duas rodam JUNTAS, não se tocam)*

| # | onda | por que ANTES de tudo |
| --- | --- | --- |
| 1 | **B — o reuso** ([sprint](sprints/2026-09-02-ROTA-B-o-reuso-que-nao-aconteceu.md)) | Fazer qualquer aba antes dela é escrever campo à mão por cima de função duplicada. Medido: a aba que mais linka o motor entrega 73%; as que reescreveram, 4% e 20%. **Toda onda de aba refaria o trabalho se esta viesse depois.** |
| 2 | **A — a identidade** ([sprint](sprints/2026-09-02-ROTA-A-a-identidade-do-controle.md)) | Quatro abas mostram o nome do controle. Sem fonte, cada uma inventaria a sua — e seriam quatro correções depois, não uma. |

**Prova de que a fase fechou:** o número de imports do motor SUBIU (piso: 24), e
com dois controles cada um mostra o próprio modelo.

### FASE 2 — O QUE FICA CERTO PARA SEMPRE *(as três rodam juntas)*

| # | onda | por que aqui |
| --- | --- | --- |
| 3 | **C — as regressões** ([sprint](sprints/2026-09-02-ROTA-C-as-leituras-que-o-html-perdeu.md)) | Cria o dono de cada leitura de estado. Toda aba passa a ler por ele — se vier depois das abas, cada aba muda duas vezes. |
| 4 | **D — os dezesseis** ([sprint](sprints/2026-09-02-ROTA-D-os-dezesseis-que-nao-aplicam.md)) | Classificar antes de consertar. Se as abas mexerem nos gestos primeiro, a classificação vira arqueologia. |
| 5 | **H — a janela** ([sprint](sprints/2026-09-02-ROTA-H-a-janela-e-o-acabamento.md)) | Não depende de nada e não bloqueia nada. Entra aqui porque é barata e some da lista. |

### FASE 3 — AS ABAS *(cada uma sozinha, na ordem do estrago)*

| # | onda | estado hoje | espera |
| --- | --- | --- | --- |
| 6 | **E — Gatilhos** ([sprint](sprints/2026-09-02-ROTA-E-a-aba-gatilhos.md)) | **1 de 25 campos (4%)** | B |
| 7 | **F — Lançadores** ([sprint](sprints/2026-09-02-ROTA-F-a-aba-lancadores.md)) | **0 gestos, 0 campos** | — |
| 8 | **G — Perfis** ([sprint](sprints/2026-09-02-ROTA-G-a-aba-perfis-e-o-perfil-por-controle.md)) | 1 de 3 campos, e o perfil por controle | A |

### FASE 4 — O QUE SÓ FECHA COM O APARELHO NA MÃO DELA

| # | o quê | por que por último |
| --- | --- | --- |
| 9 | **O microfone como eleição** | Ela decidiu o desenho em 02/09 (o LED inverte e vira aviso de vida; cada controle com canal próprio). Precisa dela apertando o botão. |
| 10 | **A luz que não acende, no rádio** ([sprint](sprints/2026-09-01-LUZ-NO-RADIO-01-a-prova-que-falta-e-de-aparelho.md)) | Não há código a escrever. Falta apertar com um controle no rádio. |
| 11 | **Os graus do `specs.html`** | `luz.led_microfone` é `inferido-do-codigo` nos dois transportes: ninguém acendeu e olhou. |

### FASE 5 — A INTEGRAÇÃO FINAL

| # | o quê |
| --- | --- |
| 12 | **Botão a botão, aba a aba, como usuária**, lendo os outputs — o que ela encomendou. Só faz sentido depois das oito, e é trabalho de quem conversa com ela, na árvore dela. |

---

## §0.1 — A INFRA, olhada como um todo

Também de 02/09, e fora da rota do HTML porque não bloqueia nenhuma onda:

| assunto | estado |
| --- | --- |
| instalador | `install.sh --yes` → rc=0, doctor sem falha, **zero aviso**. Abortava no passo 3g desde 31/08 |
| BlueZ | 5.86 (o nosso backport), **zero crash em 14 dias**; as redes de segurança conferidas uma a uma |
| DKMS | os três instalados no kernel em uso; o `rtw88` revalidado para 7.1.5 |
| áudio | o eleitor do microfone parou de eleger o que a régua proibia; idempotente |
| os quatro legados | install/uninstall · áudio/WirePlumber · DKMS/kernel · BT — 3 agentes cada, **não despachados** |

---

## §0.2 — O QUE NENHUMA ONDA PODE FAZER

1. **Publicar HTML.** Os geradores escrevem em `mockup/`; publicar é ATO DELA.
2. **Rodar `install.sh`.** Reinicia o daemon dela.
3. **Abrir janela visível.** `--oculta` sempre.
4. **Dizer "pronto" sem colar a saída do clique.**

---

## §2 — A FILA DO REDESENHO (27/08), para quem precisar de sprint de desenho

**27/08/2026 — o redesenho virou fila.** As dez abas de
[O REDESENHO](2026-08-26-O-REDESENHO-as-dez-abas.md) viraram **90 sprints
executáveis em dez ondas**, uma onda por aba, mais dez índices. Foram 87 pela
manhã; a medição da cor por rádio daquela noite acrescentou três à onda Conexões
(11, 12 e 13) — ver a nota do §1.5. A faxina apagou
as **28** sprints que elas substituem e reteve três, das quais uma (a CR-03) caiu
dois dias depois com a corrente do clean-room — o manifesto, linha a linha,
está em [A FAXINA](sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md).

Retrato do dia:
[ONDE PARAMOS — o redesenho virou fila](2026-08-27-ONDE-PARAMOS-o-redesenho-virou-fila.md).

> **A fila em ondas de 23/08 CADUCOU e saiu daqui.** Ela numerava **onze** ondas
> sobre a tira antiga, e seis das onze sprints de aba dela estão entre as 28
> apagadas. Está inteira no git —
> `git show a6423e82:docs/process/SPRINT_ORDER.md`. O que ela carregava e
> continua **vivo** foi trazido para a §2: a trilha de Bluetooth (D2), o carimbo
> D3 e os baldes que não são de aba nenhuma. A Onda 0 (invariantes Z0 a Z7)
> fechou em 24/08 e não volta.

---

## 0. O QUE É DELA — antes de qualquer execução

Nada aqui é trabalho. É palavra dela, e sem ela alguém para no meio ou inventa
tela.

### 0.1 As que travam uma sprint com nome

Estas não são refinamento: a sprint da coluna do meio **não começa**.

| A pergunta | Trava | Onde está escrita |
|---|---|---|
| **Qual régua manda no arranjo** quando o juízo por entrada e a receita discordam (`D-QUAL-REGUA-MANDA-NO-ARRANJO`) | CONEXÕES-04 inteira | [índice CONEXÕES](sprints/2026-08-27-ONDA-CONEXOES-INDICE.md); a medição que ela pediu já existe em `tests/unit/test_as_duas_reguas_do_arranjo_divergem_onde.py` |
| ~~**As declarações da aba Conexões gravam na hora, com recibo "Guardado."?**~~ | ~~CONEXÕES-09~~ | **RESPONDIDA em 26/08, e o §0 não tinha visto** — `docs/data/decisoes-dela.csv:87`, `D-A-CONEXOES-GRAVA-NA-HORA-E-LEMBRA`: *"aplicar e salvar, além de gravar na hora e lembrar se não salvar."* Sobra a **redação** do recibo, que não trava nada |
| **O estado do microfone é POR MÁQUINA ou POR PERFIL?** Um jogo em máscara Xbox quer o mic **Emulado**; o de fora quer **Nativo** — o que empurra para *por perfil*, e isso **muda o dono do campo** | CONEXÕES-06 (o seletor de quatro estados) | [ONDA-CONEXOES-06](sprints/2026-08-27-ONDA-CONEXOES-06-o-microfone-muda-de-aba.md); registrada como aberta e dela desde `2026-08-24-EMULACAO-UM-DONO-SO-01`. **Há quatro precedentes medidos e nenhuma regra geral**: o perfil guarda mic/som/touch/giro (`profiles/schema.py:417-424`, palavra dela de 18/08), e a máquina guarda o que é **fato da sala** (`decisoes-dela.csv:87`: *"são fatos da sala, não ajuste de perfil"*) |
| **"Modo que liga" e "O jogo vê o controle como" ficam na aba Perfis?** A legenda do mockup diz que sim (`layout/10-perfis.html:660`); o mockup **não os desenha** (`:569-618`) | PERFIS-01 e PERFIS-09 | [índice PERFIS](sprints/2026-08-27-ONDA-PERFIS-INDICE.md) |
| **A máscara "Automático": A, B ou C.** O censo dos 24 jogos dela mediu que a heurística prometida **erra em 13 de 14** (`integrations/api_de_entrada.py:12-49`) | PERFIS-09 | idem |
| **O conteúdo dos oito Estilos de Jogo novos.** Só o FPS tem conteúdo aprovado por escrito — e o formato que funciona com ela é **ver**, não ler | metade da PERFIS-04 | idem |
| **Como o produto mede "o controle chega lá" por lançador.** Nenhuma linha de código mede isso hoje; sem régua o selo vira instrumento que mente | LANÇADORES-09, e com ela o fim da onda | [índice LANÇADORES](sprints/2026-08-27-ONDA-LANCADORES-INDICE.md) |

### 0.2 As que aparecem em mais de uma aba

Decidir uma vez economiza o trabalho em duas ou três telas. Fonte: O REDESENHO,
"O que ainda falta decidir" (as 43 perguntas). O estado de cada uma foi medido
nas dez ondas.

| A pergunta | Estado |
|---|---|
| **Onde mora "Detectar o jogo que está aberto"** | **A mais cara.** PERFIS-03 e LANÇADORES-06 são a mesma sprint escrita duas vezes, com nome de arquivo idêntico. A Jogar já se retirou (não nasce lá). Uma das duas sai |
| **Onde fica o despausar** | JOGAR-10 o chama "Continuar", SISTEMA-01 "Retomar", NAVEGAÇÃO-06 pergunta se o gesto é dela. Três sprints escritas, um botão |
| **A máscara é da mesa ou de cada jogador** | JOGAR-02 e PERFIS-09. O separador existe (`daemon/subsystems/external_mask.py:642`); o laço do co-op ainda compara contra um valor global |
| **Ligar/Desligar o Hefesto em dois lugares** | SISTEMA-01 propõe dono único; JOGAR-02 espera a resposta para saber o que faz o quarto botão |
| **O botão do mic muda o mudo do PC inteiro?** | CONTROLES-06. O campo existe e o daemon o aplica (`profiles/schema.py:451`), sem nenhuma tela que o escreva |
| **O número do jogador aparece também no card da Conexões?** | ILUMINAÇÃO-03 passa a ser o lugar de escolher; CONEXÕES-05 mostraria o mesmo número como leitura |
| **"Este jogo não funciona" × "Esconder os controles físicos"** marcam o mesmo arquivo | **Aberta, e nenhuma onda mexe nisso.** Fica como está até ela dizer |
| **O aviso e o histórico de bateria** | **Não virou sprint em onda nenhuma** — o mockup aprovado não os desenha, e a regra é não inventar feature. As duas funções estão escritas e nunca são chamadas em produção (`integrations/desktop_notifications.py:272`). Se ela disser sim, nascem duas sprints pequenas |
| **A linha "outro programa está mandando efeito pelo canal DSX"** | **Não virou sprint.** A porta existe (`daemon/udp_server.py`, `127.0.0.1:6969`) e nenhuma tela conta isso. É a explicação que falta quando o gatilho muda sozinho |
| ~~Os cinco botões de Steam: Sistema ou Lançadores~~ | **RESPONDIDA — ficam na Sistema**, contra a recomendação de quem coordena (`D-A-ABA-LANCADORES-NASCE-PLACEHOLDER`). Não reabrir |
| ~~O SVG substitui os 16 quadradinhos~~ | **RESPONDIDA por outro lado**, 27/08: *"Se for pros botões do dualsense acenderem igual temos hoje na aba status ok"* — o mockup manteve os glifos. Segue como preferência, não como pendência |

### 0.3 As de uma aba só

Cada índice traz a lista inteira, com a sprint dona em cada linha. Quantas
esperam ela, por onda:

| Onda | Quantas | Onde ler |
|---|---|---|
| Jogar | 7 | [índice](sprints/2026-08-27-ONDA-JOGAR-INDICE.md), "O que continua sendo dela" |
| Controles | 10 | [índice](sprints/2026-08-27-ONDA-CONTROLES-INDICE.md) |
| Gatilhos | 7 | [índice](sprints/2026-08-27-ONDA-GATILHOS-INDICE.md), "O que espera a palavra dela" |
| Iluminação | 7 | [índice](sprints/2026-08-27-ONDA-ILUMINACAO-INDICE.md) |
| Vibração | 10 | [índice](sprints/2026-08-27-ONDA-VIBRACAO-INDICE.md) |
| Navegação | 10 | [índice](sprints/2026-08-27-ONDA-NAVEGACAO-INDICE.md) |
| Sistema | 3 (de 6 — três já respondidas) | [índice](sprints/2026-08-27-ONDA-SISTEMA-INDICE.md) |
| Conexões | 4 | [índice](sprints/2026-08-27-ONDA-CONEXOES-INDICE.md) |
| Lançadores | 6 | [índice](sprints/2026-08-27-ONDA-LANCADORES-INDICE.md) |
| Perfis | 6 | [índice](sprints/2026-08-27-ONDA-PERFIS-INDICE.md) |

Cada uma está escrita como **provisório marcado** na sprint dona
(`PROVISÓRIO — decisão dela`), nunca como escolha em silêncio.

### 0.4 O que não é decisão, e vale mais por minuto dela

**Uma execução de `scripts/gui-captura/retratar_abas.py` e uma passada de olho.**
As fotos de hoje são o **antes** das dez ondas, e por PROVA-DE-TELA-01 nenhuma
aba fecha sem o olho dela. O carimbo D3 continua valendo: **COSMÉTICA** fecha com
foto depois, em lote; **ESTRUTURAL** — texto novo, ordem das seções, o que nasce
visível — passa por ela **antes**, sem exceção.

---

## 1. A FILA DAS DEZ ONDAS

### 1.1 Antes da primeira sprint: duas travas de partida

Nenhuma é decisão dela. As duas são de quem coordena, e as duas custam minutos.

<!-- TRAVA FECHADA em 27/08/2026, e o fato velho foi SUBSTITUÍDO em vez de
     guardado ao lado do certo (regra da casa). O que esta lista dizia: "o portão
     recusa o campo `onda:`, o que cega o portão inteiro (rc=1 hoje) e faz o
     `despachar-agente.sh` recusar as onze sprints de Lançadores; enquanto isso
     não for feito, nada desta fila é despachável". Das duas saídas propostas, a
     primeira foi tomada: `check_colisao_de_sprints.py:87` agora traz `"onda"` em
     `_CAMPOS_CONHECIDOS`. Medido: o portão inteiro dá **rc=0**, e
     `--exigir ONDA-LANCADORES-07` — uma das onze, que ainda usa `onda:` como
     campo — responde "declara posse". A fila é despachável. -->

1. **`gui/main.glade` é recurso de bancada — uma sprint por vez em toda a casa.**
   XML único, sem seções nomeadas: conflito de merge nele é irrecuperável na
   prática. **Dezoito das 90 sprints declaram posse dele** (Sistema 5,
   Navegação 4, Iluminação 2, Lançadores 2, e uma cada em Jogar, Gatilhos,
   Vibração, Perfis e Controles). É esse número — não a soma das linhas — que
   dita quanto tempo a fila leva.
2. **Duas sprints são a mesma sprint, escritas em ondas diferentes.** Ver §1.4.

### 1.2 A ordem, e a razão de cada posição em uma linha

| # | Onda | Sprints | Glade | Bancada | Por que aqui |
|---|---|---|---|---|---|
| **0** | **JOGAR-09 sozinha, fora da onda** | 1 | 1 | — | é **a moldura das dez abas** (fita com o motivo certo, crachá "Perfil ativo" no topo, rodapé); ela cede para qualquer onda que reivindique `app.py`, então fazer por último é refazer — e o crachá é o que ela nomeou como *"o que faltou"* |
| **1** | **[Vibração](sprints/2026-08-27-ONDA-VIBRACAO-INDICE.md)** | 6 | 1 | 2 | a VIBRAÇÃO-01 cria `app/widgets/desenho_do_controle.py` **e conserta o empacotamento do `assets/control-svg/`** (`install.sh:3053` copia só os glifos — sem isso o desenho nasce vazio na máquina instalada, sem um erro no log); Iluminação, Conexões, Navegação e Controles são consumidoras | <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->
| **2** | **[Sistema](sprints/2026-08-27-ONDA-SISTEMA-INDICE.md)** | 7 | 5 | 0 | é quem **solta** o que os outros pegam: a SISTEMA-02 tira o microfone e o gamepad virtual da aba Emulação antes de CONEXÕES-06 pegá-los (dono duplo é a cicatriz que esta casa já pagou), e a SISTEMA-01 dá dono único ao Ligar/Desligar, que Jogar e Navegação esperam |
| **3** | **[Conexões](sprints/2026-08-27-ONDA-CONEXOES-INDICE.md)** | **13** | **0** | **3** | **a única onda que não abre o `main.glade`** — corre em paralelo com qualquer outra sem disputar a bancada; e a CONEXÕES-08 entrega o **dono único** da borda na cor do plástico mais o portão, que as outras nove telas consomem. **Ela cresceu em 27/08 à noite:** a 11 liga a leitura da cor pelo rádio, a 12 traz os 28 modelos e as 10 zonas ao produto, e a 13 mede o microfone emulado (§1.5) |
| **4** | **[Iluminação](sprints/2026-08-27-ONDA-ILUMINACAO-INDICE.md)** | 10 | 2 | 1 | segunda consumidora do desenho, e fixa **onde se escolhe o número do jogador**; depois dela, Conexões e Jogar só leem esse número em vez de oferecerem a escolha de novo |
| **5** | **[Jogar](sprints/2026-08-27-ONDA-JOGAR-INDICE.md)** | 10 | 0 (a 09 saiu para a posição 0) | 2 | a aba 1 precisa da cor do plástico (Conexões-08) e do dono do Ligar/Desligar (Sistema-01) para não escrever a terceira versão da mesma coisa; o resto dela é independente |
| **6** | **[Gatilhos](sprints/2026-08-27-ONDA-GATILHOS-INDICE.md)** | 7 | 1 | 0 | a aba que ela aprovou sem ressalva (*"aba gatilhos perfeita. Parabéns."*), toca **uma faixa só** do Glade (`776-1135`) e não depende de onda nenhuma — pode entrar em qualquer buraco da fila em que a bancada do XML esteja livre |
| **7** | **[Navegação](sprints/2026-08-27-ONDA-NAVEGACAO-INDICE.md)** | 9 | 4 | 4 | quatro sprints seguidas no Glade e quatro na bancada: é a onda mais cara por turno, e depende de a Sistema já ter respondido onde mora o despausar |
| **8** | **[Perfis](sprints/2026-08-27-ONDA-PERFIS-INDICE.md)** | 9 | 1 | 2 | quase toda serial num arquivo de 4.546 linhas (`profiles_actions.py`, tocado por oito das nove); e é ela quem entrega o **Estilo de Jogo**, que Vibração e Controles consultam — mas duas das suas travas são palavra dela (§0.1) |
| **9** | **[Controles](sprints/2026-08-27-ONDA-CONTROLES-INDICE.md)** | 9 | 1 | 1 | é quem **absorve a aba "No jogo"** e por isso declara colisão com oito das nove outras ondas: mover uma aba para dentro de outra antes de as duas pararem de mudar é refazer duas vezes |
| **10** | **[Lançadores](sprints/2026-08-27-ONDA-LANCADORES-INDICE.md)** | 10 | 2 | 1 | **por ordem dela**: *"essa aba em si só vamos desenhar e deixar placeholder mesmo. E ela só passa a existir quando tiver todas as features no projeto integrando e funcionando."* A LANÇADORES-10 remove a aba Emulação da tira, o que só é seguro depois de Sistema, Conexões e Navegação terem recolhido o que morava lá |

**As dependências que as próprias sprints declararam** (`depois_de`, entre
ondas):

```
VIBRAÇÃO-01 ──► CONEXÕES-05      (o desenho do controle)
VIBRAÇÃO-04/05 ──► CONEXÕES-10   (a força por peça)
SISTEMA-02 ──► CONEXÕES-06       (primeiro o dono antigo solta)
CONEXÕES-01 ──► onda Sistema     ("A janela" muda de aba)
CONEXÕES-08 ──► as outras nove   (a borda na cor do plástico, dono único)
CONEXÕES-08 ──► 11 ──► 12        (as três dividem cor_do_plastico.py)
CONTROLES-02/06/07/08 ──► oito das nove outras ondas (colisão de arquivo)
```

**Onde a fila pode se dobrar sem risco:** Conexões não toca o Glade, e Gatilhos
toca uma faixa isolada dele. As duas cabem em paralelo com qualquer posição
acima, desde que o turno do XML esteja com uma só.

### 1.3 O que fecha cada onda

Toda onda termina em **conferência**, não em código: `retratar_abas.py` reescreve
as dez fotos de uma vez, e **agente executor não o roda**
([COMO-EXECUTAR-UMA-SPRINT.md](COMO-EXECUTAR-UMA-SPRINT.md) §5). A Gatilhos já
tem essa sprint escrita (07); nas outras, é de quem coordena.

### 1.4 As duas sprints que são a mesma sprint

Nenhuma das duas é decisão de arquitetura — é escolha de qual das duas sai, e
quem coordena decide antes de despachar.

1. **JOGAR-03 × NAVEGAÇÃO-02**, as duas chamadas *"o quinto degrau da roda"*: as
   duas reescrevem `integrations/ponte_escada.py:253` para pôr o Teclado + Mouse
   na escada, e as duas declaram posse do arquivo. **O portão as pega, e elas
   estão SERIALIZADAS**: a NAVEGAÇÃO-02 traz `depois_de: [ONDA-JOGAR-03]`. Isso
   satisfaz a régua e a R5, mas **não decide o que quem coordena tem de decidir**
   — série não é o mesmo que duplicata resolvida. Os testes que as duas criam
   ainda têm nomes diferentes (`test_a_escada_tem_cinco_degraus.py` contra <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->
   `test_nav_quinto_degrau_teclado_e_mouse.py`), então duas réguas nasceriam para <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->
   o mesmo degrau. **Uma das duas sai antes do despacho.**
   <!-- FATO SUBSTITUÍDO em 27/08/2026: esta linha dizia "O portão não as pega —
        a Navegação passa `onda:` como comentário e a Jogar não o tem". O motivo
        estava errado nas duas metades: o portão nunca leu `onda:` para cruzar
        posse (ele agrupa, não restringe), e o que o portão cruza é `posse` +
        `cria` — as duas declaram `ponte_escada.py`, então ele SEMPRE as pegaria.
        Hoje não grita porque a série foi declarada, não porque está cego. -->
2. **VIBRAÇÃO-01 × ILUMINAÇÃO-02**, o mesmo widget em dois caminhos:
   `app/widgets/desenho_do_controle.py` contra <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->
   `gui/widgets/desenho_do_controle.py`. **O portão fica cego de propósito** — ele <!-- ref-externa: o arquivo é o que a sprint VAI criar; a ausência é o assunto -->
   só grita quando o caminho é escrito igual nos dois frontmatters. Um caminho
   só, e o segundo consumidor importa.

E uma terceira que **espera ela**, não quem coordena: **PERFIS-03 ×
LANÇADORES-06**, as duas *"detectar o jogo que está aberto"*, com o mesmo nome de
arquivo de teste. É a pergunta 1 da §0.2.

### 1.5 As três que a medição da noite de 27/08 acrescentou

**O fato:** a cor do plástico se lê do aparelho **nos dois transportes**. O que
travava o rádio era a semente do CRC — `0x53` (`SET_REPORT|FEATURE`), e não
`0xA3` (`DATA|FEATURE`). Nesta bancada **um** controle respondeu pelo rádio (`hidraw8`, Cosmic
Red `02`) e outro pelo cabo (`hidraw7`, Starlight Blue `05`)
(`docs/protocol/dualsense-referencia-canonica.md:1574-1663`).

**O que isso caducou na fila**, e já foi reescrito na mesma noite:

| onde | o que dizia | o que passou a dizer |
|---|---|---|
| `ONDA-ILUMINACAO-08` | *"No rádio a leitura não acontece — é por isso que existe o 'Corrigir'"*, e uma foto de bancada **provando** que o do rádio cai no Corrigir | o filtro é **nosso**, não do aparelho; a foto tem de mostrar o do rádio **com a cor lida** |
| `ONDA-JOGAR-07`, item 7 | um teste exigindo **zero** comandos `0x80` no rádio | régua que **passa porque a cura não existe**; virou régua de **posse** (um perguntador só), não de ausência |
| `ONDA-ILUMINACAO-INDICE` | *"Medido, para ninguém refazer: a leitura da cor do plástico"* | a linha mais perigosa das dez ondas: mandava não mexer justamente onde a lápide errada mora |
| `ONDA-CONEXOES-05` | o campo de declaração como **par simétrico** da leitura | vira **correção**, em três casos: código desconhecido, controle externo, e discordância dela |
| `ONDA-CONEXOES-09` | oito gestos, todos **dela** | ganha a **nona linha**: a cor **lida**, que hoje é jogada fora |

**E as três sprints novas:**

* **[CONEXÕES-11 — a cor se lê no rádio](sprints/2026-08-27-ONDA-CONEXOES-11-a-cor-se-le-no-radio-e-a-semente-e-0x53.md)**
  (`bancada`). São **três portões independentes** que recusam o rádio, e
  consertar um deixa o sintoma idêntico: o filtro de barramento, a trava que
  exige os bytes `3..63` zerados (o CRC do envelope BT ocupa os quatro últimos —
  ela reprovaria o próprio envelope), e o `transporte != "usb"` da janela.
* **[CONEXÕES-12 — as 28 cores e as 10 zonas chegam ao produto](sprints/2026-08-27-ONDA-CONEXOES-12-as-vinte-e-oito-cores-e-as-dez-zonas-chegam-ao-produto.md)**.
  `docs/data/cores-do-dualsense.csv` tem 28 modelos × 10 zonas; o produto tem 21
  códigos de **uma** zona, e 20 dos 21 hex são aproximados. É "a casa sabe e o
  produto não faz", recém-criado.
* **[CONEXÕES-13 — quanto custa o microfone emulado](sprints/2026-08-27-ONDA-CONEXOES-13-quanto-custa-o-microfone-emulado.md)**
  (`bancada`, `depois_de: []`). Mede as duas ausências que a CONEXÕES-06 declarou
  — a latência do emulado contra o nativo, e o que ele custa nas 1.600 fatias.
  **Enquanto ela não correr, o estado "Automático" do microfone é palpite.**

**O que NÃO foi tocado, e é decisão dela:** a premissa caduca também está viva no
mockup (`src/hefesto_dualsense4unix/interface/aba08.py` e o HTML que ele gera) e no contrato
(`2026-08-26-O-REDESENHO-as-dez-abas.md:330,623`). **Os dois estão em revisão com
ela.** E na tela do produto, em `app/widgets/external_card.py:97-103`
(*"No rádio o controle recusa o pedido da cor"*) — que muda com a CONEXÕES-11,
porque mudar a frase antes da cura seria trocar uma mentira por outra.

---

## 2. O QUE A FILA NOVA NÃO COBRE

As dez ondas são as dez abas. Isto aqui não é de aba nenhuma, e sem isto não há
0.9.5.

### 2.1 A trilha do Bluetooth — DELA, com o assistente (D2)

**Decisão dela: o mapeamento de Bluetooth não é planejado aqui.** É trilha dela
na mesa do specs. O que esta fila carrega é **qual pergunta trava qual tela** —
para o executor saber o que ele **não pode afirmar** até a medição existir.

| Pergunta que falta medir | Abas que ela destrava |
|---|---|
| a vibração do jogo chega ao motor por rádio? (`passthrough` no rádio é `inferido-do-codigo`) | Vibração, Controles, Jogar |
| quantos DualSense por rádio o produto sustenta, e com quantos adaptadores? | Jogar, Controles, Conexões, Iluminação — é a promessa "um jogador para cada controle" |
| o alto-falante emite por rádio? ("zero linhas de implementação") | Controles |
| a barra de luz obedece por rádio, e sob qual regime? (`LIGHTBAR-BT-NEVER-01` e `ROTA-BT-EM-REGIME-01` se contradizem, e uma está velha) | Iluminação, Jogar |
| o gatilho adaptativo funciona por rádio fora do `Rigid`? (sentido em **um** modo, com um jogo de parâmetros) | Gatilhos — trava dezoito dos dezenove botões |
| gatilho e analógico movem o cursor por rádio? (a observação **dela** de 11/08 diz que não) | Navegação (a tabela de Mapeamento) |
| existe fonte de captura de microfone por rádio? (medido em 23/08: **NÃO**) | Controles, Conexões |

**A ordem recomendada de medir é a das ABAS, não a do protocolo** — assim cada
medição destrava uma tela, e não só uma linha do mapa. A tabela está nessa ordem.
**Pré-requisito da trilha inteira:** o `PAREAMENTO-01` de pé; senão cada medição
dela vira faxina manual em N arquivos (em 23/08 foram oito).

Uma oitava pergunta entra **depois** das sete, por pedido dela em 24/08
(*"mapeia isso pra quando terminarmos de medir tudo no bt"*): **gatilho, vibração
e barra de luz custam quanta bateria?** — zero dos 178 ensaios cronometrou
consumo por feature
([O-PRECO-EM-BATERIA-01](sprints/2026-08-24-O-PRECO-EM-BATERIA-01-o-botao-que-ninguem-sabe-se-serve.md)).

### 2.2 As sprints antigas que a faxina reteve — eram três, são duas

O censo mandou apagar; a conferência recusou, com o teste da casa (*se apagar
isto faria alguém repetir um trabalho ou pagar um custo já pago?*). O manifesto
tem a prova de cada uma; em resumo. A terceira, a CR-03, saiu em 29/08 com a
corrente inteira do clean-room (`D-A-CORRENTE-DO-CLEAN-ROOM-SAI`) — a palavra
dela de 29/08 substitui a de 26/08 que a preservava; ver
[o manifesto do corte](sprints/2026-08-29-O-CORTE-DO-CLEAN-ROOM-o-que-saiu-e-por-que.md).

| Sprint | Por que fica |
|---|---|
| [SISTEMA-O-VIGIA-VIVO-01](sprints/2026-08-24-SISTEMA-O-VIGIA-VIVO-01-a-rede-de-seguranca-parada-e-o-conserto-que-nao-conserta.md) | seis das quinze tarefas são `[SEM TELA]`, e redesenho de interface não substitui o que não toca a interface: `install.sh:3504` usa `enable --now`, que não re-arma timer parado; e os dois scripts do botão "Aplicar correções" não viajam em **cinco dos seis** formatos de pacote, com `scripts/check_packaging_parity.sh:8` ignorando `scripts/` em bloco — o portão sai **verde** sobre o buraco |
| [CONFIGURACOES-FECHA-01](sprints/2026-08-24-CONFIGURACOES-FECHA-01-o-aplicar-que-nao-responde-e-o-campo-que-apaga-o-arquivo.md) | dez tarefas `[SEM TELA]`. A ONDA-CONEXOES-09 absorve o `maquina.json`; ficam sem dono as constantes de rádio declararem a célula do CSV, os números caducos saírem de **todos** os lugares, o censo das curas arrancáveis e o portão *"existe chamador de PRODUÇÃO?"* |

### 2.3 Os baldes que não são de aba nenhuma

Herdados da fila de 23/08 e **não absorvidos** pelas dez ondas:

- **daemon e desempenho** — `ESCONDE-SO-O-HIDRAW-01`, `DAEMON-ACORDADO-01`,
  `ENGASGO-VULKAN-01`, `ESPELHO-QUE-NAO-NASCEU-01`. O A/B do Vulkan é dela.
- **co-op e ciclo de vida do jogador (8 sprints, UM mecanismo)** —
  `COOP-QUE-NAO-DESMONTA-01`, `PARTIDA-PICOTADA-01`, `JOGADOR-3-FANTASMA-01`,
  `BORDA-DE-QUEDA-01`, `DUAS-CONTABILIDADES-01`, `QUATRO-NA-MESA-01`,
  `LUGAR-A-MESA-01`, `MONITOR-QUE-VENCE-01`, todas sobre
  `daemon/subsystems/coop.py`. **Dono único, sequencial.** Carrega dois fatos
  medidos que nenhuma tela diz: o co-op **não existe no Modo Nativo**
  (`coop.py:307-313`), e a GUI escreve um teto de 4 jogadores
  (`status_actions.py:1289`) que o daemon não tem.
- **identidade de aparelho (4)** — `IDENT-01`, `IDENTIDADE-DUPLA-01`,
  `UMA-FAIXA-NAO-E-UM-FABRICANTE-01`, `N-IGUAL-A-UM-01`. **Uma medição de dois
  minutos dela** (ligar o 8BitDo em cada modo e anotar o MAC) destrava as quatro.
- **instalação e empacotamento (8, MESMO ARQUIVO — dono único)** —
  `CURA-QUE-FERE-01` vem primeiro, é o portão do padrão. Ver também a §2.2.
- **portão e teste** — `TESTE-HONESTO-01`, `AUDITORIA-DE-PERDA-01`,
  `SUITE-QUE-SUJA-O-JORNAL-01`, `BERCO-DE-TMP-01`, `GATE-EMOJI-01`.
- **documentação** — só **depois** das dez ondas; antes disso documentaria o
  produto de ontem.
- **clean-room (CR-01, CR-02, CR-05 entregues; METODO-01 aberta)** — a corrente
  `CR-03 → CR-04 → CR-06` **saiu em 29/08** (`D-A-CORRENTE-DO-CLEAN-ROOM-SAI`).
  Sobra o METODO-01, **fora da 0.9.5** pela D-J.

---

## 3. Como ler a seção 4

As seis faixas abaixo são **ordenação de custo do silêncio, não medição** — o
censo mediu o estado de cada sprint, não a prioridade entre elas. A faixa 1 é a
régua do alvo dela (cada jogo local jogável no cabo e no rádio); a última é a
que só custa tempo da próxima pessoa.

`DELA` = a sprint não fecha sem a mão, o olho ou a palavra dela.

---

## 4. O QUE ESTÁ ABERTO — 120 sprints, e nenhuma é de aba

> **27/08: saíram daqui as 17 linhas das sprints que a faxina apagou** — o que
> cada uma pedia e quem tomou o lugar dela está no
> [manifesto](sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md). Eram 140.
>
> **A marca `→ Onda N · Aba` que sobrou nas linhas abaixo é da numeração de
> 23/08 e CADUCOU** — aquela fila tinha onze ondas sobre a tira antiga. Quem
> tocar uma dessas linhas troca a marca pela onda da §1, ou tira a marca.

### Faixa 1 — o jogo não anda, ou anda e derruba jogador (40)

| Sprint | O que falta | DELA |
|---|---|---|
| [COOP-QUE-NAO-DESMONTA-01](sprints/2026-08-03-COOP-QUE-NAO-DESMONTA-01-o-jogador-2-que-dura-dois-segundos.md) | ABERTA. E1 a E4: a troca de primário destrói o jogador existente. Causa-raiz provada em três elos, com journal | |
| [PARTIDA-PICOTADA-01](sprints/2026-08-08-PARTIDA-PICOTADA-01-a-caixinha-que-tirava-o-jogador-2-a-cada-piscada.md) | Itens 2, 4, 5 e 6. O portão anti-recriação cobre a camada errada, e a suspensão passa por baixo via `stop_gamepad_emulation` | DELA |
| [JOGADOR-3-FANTASMA-01](sprints/2026-08-08-JOGADOR-3-FANTASMA-01-a-cura-certa-no-momento-errado.md) | Os três primeiros itens da seção 7. O `xfail` é a marca honesta de que o ciclo de vida da dispensa não tem código | DELA |
| [BORDA-DE-QUEDA-01](sprints/2026-08-03-BORDA-DE-QUEDA-01-o-que-fica-para-tras-quando-um-controle-cai.md) | ABERTA. E1 a E5. Sintoma reproduzido pela fala dela: quatro travamentos em 28 segundos | |
| [QUATRO-NA-MESA-01](sprints/2026-08-03-QUATRO-NA-MESA-01-o-que-so-quebra-quando-sao-quatro.md) | ABERTA. Os quatro defeitos. O aceite não pode ser escrito contra o sysfs (nota de 04/08) | DELA |
| [QUATRO-NO-RADIO-01](sprints/2026-08-03-QUATRO-NO-RADIO-01-o-checklist-dos-quatro-controles-por-bluetooth.md) | **→ Onda 12 · BT, trilha DELA.** ABERTA. O aceite inteiro, com jogo aberto. Depende de B1, B2 e B4 caírem antes | DELA |
| [JOGAVEL-EM-TODOS-01](sprints/2026-08-16-JOGAVEL-EM-TODOS-01-o-alvo-dela-e-cada-jogo-nos-dois-transportes.md) | ABERTA. Os quatro ensaios da seção 2, o chamador da allowlist, e o `hidden_count` que conta em vez de nomear | DELA |
| [TRES-PORTOES-01](sprints/2026-08-19-TRES-PORTOES-01-nao-anda-nem-o-microfone.md) | Seção 6 inteira: o `origem=`, a recriação do vpad em slot único, os 26 bytes que o vpad nunca escreve, a cadeia do microfone | DELA |
| [DUAS-CONTABILIDADES-01](sprints/2026-08-07-DUAS-CONTABILIDADES-01-a-lampada-conta-a-mesa-inteira-e-o-coop-so-metade.md) | ABERTA. O protocolo do cabo no meio da partida, e o cruzamento no jogador 1 — que é pior que colisão | DELA |
| [CONTAGEM-E-COOP-01](sprints/2026-07-31-CONTAGEM-E-COOP-01-o-aviso-antes-de-derrubar-tres-jogadores.md) | **→ Onda 5 · Emulação.** Duas peças do aceite da E3: a frase do Modo jogo durante a exceção, e o preço do gesto manual no toast | DELA |
| [POSSE-POR-CONTROLE-01](sprints/2026-08-03-POSSE-POR-CONTROLE-01-a-trava-de-um-controle-congela-os-quatro.md) | **→ Onda 9 · Rumble.** E1 inteira (trava indexada por MAC), o fallback broadcast do rumble em E3, e as quatro bancadas de E4 | DELA |
| [A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01](sprints/2026-08-16-A-MASCARA-QUE-O-PRODUTO-ESCOLHE-01-o-jogo-nao-enxerga-e-a-culpa-nao-e-da-pessoa.md) | **→ Onda 2 · Início.** Os dois ensaios que a seção 8 exige antes de qualquer linha não têm bruto | DELA |
| [MASCARA-01](sprints/2026-07-25-MASCARA-01-como-este-controle-aparece-nos-jogos.md) | **→ Onda 5 · Emulação.** E2, E4 e metade da E3. Pré-requisito da E3/E4 da LUGAR-À-MESA-01, por decisão dela de 07/08 | |
| [MASCARA-POR-JOGADOR-01](sprints/2026-08-15-MASCARA-POR-JOGADOR-01-a-decisao-de-14-08-esbarra-na-de-10-08.md) | **→ Onda 2 · Início. SUBSTITUÍDO em 29/08/2026:** o degrau do `make_virtual_pad` ENTROU (`virtual_pad.py:153`, `gamepad.py:2108`, `coop.py:990`, régua com 13 testes). Sobram o **lado da escrita no IPC** e o **vpad não ser recriado ao aplicar** | |
| [LUGAR-A-MESA-01](sprints/2026-08-06-LUGAR-A-MESA-01-tres-controles-ligados-e-um-jogador-so.md) | **→ Onda 2 · Início.** E3 e E4, presas atrás da MASCARA-01. O grab mais FF em aparelho não-Sony continua sem prova | DELA |
| [JOGO-01](sprints/2026-07-25-JOGO-01-o-jogo-enxerga-quatro-controles.md) | A E2: a frase que distingue os dois estados do opt-in na aba Emulação | |
| [O-WRAPPER-QUE-SUMIU-01](sprints/2026-08-16-O-WRAPPER-QUE-SUMIU-01-uma-variavel-nova-apaga-a-ponte-em-silencio.md) | **→ Onda 11 · Sistema.** E2 (o guard de `LaunchOptions` por merge, no instalador e simétrico no uninstall) e E3 (a fração na aba Sistema) | |
| [WRAPPER-EM-TODOS-01](sprints/2026-08-03-WRAPPER-EM-TODOS-01-a-invariante-duplicado-melhor-que-zero-com-quatro.md) | **→ Onda 11 · Sistema.** E3 e o aceite de campo: a invariante só se prova com quatro controles numa partida de verdade | DELA |
| [STEAM-INPUT-01](sprints/2026-07-26-STEAM-INPUT-01-ela-nunca-mais-precisa-decidir.md) | **→ Onda 11 · Sistema.** E2 e E4 a E8, entre elas a lista por nome de jogo em vez de contagem | DELA |
| [DUPLO-REGISTRO-01](sprints/2026-07-26-DUPLO-REGISTRO-01-o-steam-input-tem-dois-cadastros.md) | **→ Onda 11 · Sistema.** ABERTA. A reconciliação dos dois registros, o grab pendente deixar de ser silencioso, e a leitura do `localconfig.vdf` em runtime | |
| [STEAM-QUE-DECIDE-01](sprints/2026-08-05-STEAM-QUE-DECIDE-01-ela-nao-tem-como-saber-quando-ligar.md) | **→ Onda 11 · Sistema.** E1 (o experimento M-04), E5, a metade honesta da E3, e o M-05 | DELA |
| [JOGOS-QUE-ELA-TEM-01](sprints/2026-08-06-JOGOS-QUE-ELA-TEM-01-escolher-da-biblioteca-em-vez-de-adivinhar-o-numero.md) | **→ Onda 6 · Perfis.** A E4 — perfil por jogo instalado. Nenhum símbolo em `src/` o faz nascer | DELA |
| [CONTROLE-SONY-MEDIDO-01](sprints/2026-08-06-CONTROLE-SONY-MEDIDO-01-o-experimento-que-decide-metade-da-doutrina.md) | A versão do cliente Steam não foi anotada — e é a variável que invalidou o resultado antigo | DELA |
| [AUDIO-QUE-TRANCA-01](sprints/2026-08-03-AUDIO-QUE-TRANCA-01-um-toque-no-volume-congela-a-troca-de-perfil.md) | **→ Onda 6 · Perfis.** ABERTA. **MEDIDA em 29/08:** `mark_manual_trigger_active("audio")` existe (`ipc_handlers.py:4674`) e **não há um único `clear` para `"audio"` nem para `"led"`** — as irmãs `trigger` e `rumble` têm o par. **4 episódios em 7 dias** no journal dela (`autoswitch_suppressed_by_manual_override`), e o desvio do perfil de jogo **nunca precisou agir** (0×). Não é "trava o produto": é **armar sem soltar**, e a única saída é ela trocar de perfil na mão sem saber que precisa | DELA |
| [PERFIL-JOGO-01](sprints/2026-07-26-PERFIL-JOGO-01-as-configs-somem-ao-abrir-o-jogo.md) | **→ Onda 6 · Perfis.** A entrega 1 (rodar o experimento com ela e nomear o sintoma) nunca rodou, e sem ela as 2 a 6 não se sustentam | DELA |
| [PERFIL-NASCE-CERTO-01](sprints/2026-07-26-PERFIL-NASCE-CERTO-01-o-perfil-do-jogo-que-nunca-vence.md) | **→ Onda 6 · Perfis.** E3 e o resto da E4: o detector de sanidade existe e ninguém o dispara | |
| [AUTO-01](sprints/2026-07-25-AUTO-01-um-clique-em-vez-de-dez.md) | Dois catch-all semeados ainda em `match: any`, o `--no-dkms` único, e o critério de aceite nunca medido | DELA |
| [CONECTA-E-DESLIGA-01](sprints/2026-08-07-CONECTA-E-DESLIGA-01-a-regressao-que-ela-relatou-e-a-suspeita-que-recai-sobre-nos.md) | ABERTA. A cura, que ela mandou esperar. E a pergunta do item 2 vem antes dela | DELA |
| [OITO-DEFEITOS-01](sprints/2026-08-08-OITO-DEFEITOS-01-a-fila-que-a-verificacao-adversarial-derrubou-inteira.md) | **→ Onda 9 · Rumble.** 2.5 (o rumble) sem causa provada; 2.3, 2.6 e 2.8 não reconferidos e sem marca na árvore | DELA |
| [ORDEM-DE-CHEGADA-01](sprints/2026-08-15-ORDEM-DE-CHEGADA-01-a-fila-que-ela-pediu-nao-e-a-fila-que-o-produto-guarda.md) | E3 (o gesto `identity.renumber` alcançável de onde ela está), e o item C da frase dela segue não medido | |
| [ESCOLHA-DELA-VENCE-01](sprints/2026-08-01-ESCOLHA-DELA-VENCE-01-a-mascara-do-perfil-e-o-tooltip-do-xbox.md) | **→ Onda 6 · Perfis.** E2 (a máscara sobrevive ao reboot), E3 (a recusa com jogo aberto deixa de reportar sucesso), E5 | DELA |
| [EMULACAO-NO-JOGO-01](sprints/2026-07-29-EMULACAO-NO-JOGO-01-o-r1-troca-de-app-em-vez-de-jogar.md) | **→ Onda 5 · Emulação.** E5, duas peças do aceite da E3 não conferidas, e o cabeçalho desatualizado | DELA |
| [PS-TOQUE-CURTO-01](sprints/2026-08-03-PS-TOQUE-CURTO-01-o-gesto-de-religar-o-controle-abre-a-steam.md) | **→ Onda 11 · Sistema.** ABERTA. E1 a E4, incluindo declarar o `wmctrl` no install ou a dependência morre | |
| [IDENT-01](sprints/2026-07-25-IDENT-01-um-controle-duas-identidades.md) | ABERTA. As quatro entregas. O documento recusa o palpite automático de propósito | DELA |
| [IDENTIDADE-DUPLA-01](sprints/2026-08-04-IDENTIDADE-DUPLA-01-o-8bitdo-ocupa-dois-lugares-na-fila.md) | ABERTA. E1 é o MAC de cada modo, 2 minutos da mão dela. Sem ele, E2 a E4 seriam adivinhação por OUI | DELA |
| [REGRA-NAO-REGISTRO-01](sprints/2026-08-06-REGRA-NAO-REGISTRO-01-o-8bitdo-e-um-so-e-o-defeito-e-de-todo-mundo.md) | ABERTA. Fundir os dois rostos do 8BitDo. Ler antes a nota de `0df6825`: quatro pontos declarados errados, um deles destrutivo | |
| [NOME-HONESTO-01](sprints/2026-08-03-NOME-HONESTO-01-a-tela-chama-de-sony-o-que-o-kernel-ja-sabe-que-nao-e.md) | **→ Onda 2 · Início.** ABERTA. E1 a E5. Nenhuma linha entregue | DELA |
| [CHECKLIST de validação em hardware](sprints/2026-07-25-CHECKLIST-validacao-em-hardware.md) | ABERTA. As 31 caixas. Por construção, só ela pode fechá-las | DELA |
| [MASCARA-QUE-GRUDA-01](sprints/2026-08-22-MASCARA-QUE-GRUDA-01-quatro-perfis-dela-pedem-xbox-e-agora-isso-fica.md) | **FECHADA em 23/08/2026** — o próprio documento diz na linha 7, e a fila não sabia. **Sai da fila.** A E2 e a E3 fecharam em 22/08; a E1 é a remedição dos dois vpads, que virou item da mesa dela | DELA |
| [ELO-MUDO-01](sprints/2026-08-22-ELO-MUDO-01-o-ok-que-nao-sabe-dizer-nao.md) | **→ Onda 1 · Configurações.** E1 feita (`62d092a`) e E2 pela metade (`b68223e`). Faltam E3 a E7: a tela do que está VALENDO, o appid do wrapper como fonte de match, o Proton por jogo, o roteiro do engasgo e o portão da família | DELA |

### Faixa 2 — a casa sabe e o produto não faz (14)

| Sprint | O que falta | DELA |
|---|---|---|
| [AUTOMATISMO-MORTO-01](sprints/2026-07-30-AUTOMATISMO-MORTO-01-o-perfil-do-jogo-nunca-entra.md) | **→ Onda 6 · Perfis.** ABERTA. Tudo, a começar pela E0 (a janela dizer POR QUE o perfil não trocou). Duas sprints escreveram a cura, nenhuma a ligou | |
| [JANELA-CEGA-01](sprints/2026-07-28-JANELA-CEGA-01-o-detector-que-nunca-adoece.md) | **→ Onda 11 · Sistema.** A fiação do motivo do autoswitch até o IPC — escrita em duas sprints, ausente do daemon | |
| [SINAL-DE-JOGO-01](sprints/2026-07-31-SINAL-DE-JOGO-01-o-daemon-desiste-do-jogo-antes-do-jogo-acabar.md) | **→ Onda 2 · Início.** E1 (o experimento com o jogo vivo, sem bloco de journal no documento) e E2. E4 e E5 não reconferidas | DELA |
| [MODO-01](sprints/2026-07-25-MODO-01-o-modo-jogo-liga-sozinho.md) | **→ Onda 6 · Perfis.** O B4: o gate de foco cega a detecção. A AUTOMATISMO-MORTO-01 mediu 135 episódios DEPOIS desta sprint | DELA |
| [ENTREGA-QUE-NAO-LIGOU-01](sprints/2026-08-03-ENTREGA-QUE-NAO-LIGOU-01-o-codigo-que-existe-e-ninguem-chama.md) | E3, E4 e E5. Sem prova de nenhuma das três; o defeito 3 não foi conferido | |
| [A-NOITE-DOS-QUATRO-INVENTARIOS-01](sprints/2026-08-09-A-NOITE-DOS-QUATRO-INVENTARIOS-01-o-que-a-casa-sabe-e-o-que-o-produto-faz.md) | F-6(a) confirmado aberto pelo próprio código; F-2 e F-11 abertos e sem marca. F-3, F-7, F-9 e F-10 não reconferidos | DELA |
| [AGORA-E-DEPOIS-01](sprints/2026-08-08-AGORA-E-DEPOIS-01-o-plano-executavel-da-separacao-dos-dois-tempos.md) | **→ Onda 2 · Início.** O passo 6. As três ausências da seção 10 reproduzidas. Cuidado com o falso positivo `MascaraAdiada`, que mora em memória e morre no restart | DELA |
| [BONDS-QUE-SOBREVIVEM-01](sprints/2026-08-04-BONDS-QUE-SOBREVIVEM-01-o-salva-vidas-que-ninguem-aciona.md) | E5 inteira, E3.1, e o cabeçalho — que diz aberta sobre uma sprint de coração de pé desde 15/08 | DELA |
| [SOM-DE-CADA-JOGADOR-01](sprints/2026-08-15-SOM-DE-CADA-JOGADOR-01-o-botao-que-nunca-funcionou-com-a-mesa-cheia.md) | **→ Onda 3 · Status.** E2 — a peça existe desde 20/08 e nunca foi ligada no botão. E3 e as mordidas 1 a 4. O ensaio às cegas do canal 3 não tem bruto | DELA |
| [MIC-BT-DONO-01](sprints/2026-08-03-MIC-BT-DONO-01-a-posse-do-mudo-ganha-dono-e-ciclo-de-vida.md) | ABERTA. Dar ao mudo do mic o tratamento que o LED recebeu. O alvo honesto é 55-75% de mudo, não 0% | |
| [ESTADO-QUE-MENTE-01](sprints/2026-08-03-ESTADO-QUE-MENTE-01-o-daemon-afirma-controle-conectado-com-a-mesa-vazia.md) | **→ Onda 3 · Status.** ABERTA. Derivar o topo do `state_full` da lista de controles. O painel da verdade mostra bateria de controle que não existe | |
| [PERFIL-SEM-RASTRO-01](sprints/2026-08-05-PERFIL-SEM-RASTRO-01-o-perfil-mudava-e-nada-registrava-quem-mudou.md) | A dívida de descoberta (três parágrafos na doc da CLI e uma linha no README), e o `_reject_traversal` nos caminhos de escrita | |
| [PROMESSA-NAO-CUMPRIDA-01](sprints/2026-07-26-PROMESSA-NAO-CUMPRIDA-01-o-que-o-projeto-anuncia-e-nao-entrega.md) | C3 continua verdadeiro e o código o confessa. A2, A3, C2, D, E e F não conferidos item a item | |
| [A-FÁBRICA-COM-UM-CLIENTE-01](sprints/2026-08-22-A-FABRICA-COM-UM-CLIENTE-01-a-saida-do-modo-nativo-perde-um-applier.md) | **→ Onda 9 · Rumble.** NOVA em 22/08. E1 a E3: a saída do Modo Nativo passa 6 dos 7 appliers, e a fábrica `gerente_do_daemon` tem um cliente só | |

### Faixa 3 — o install e o pacote entregam cura morta (10)

| Sprint | O que falta | DELA |
|---|---|---|
| [INSTALL-QUE-NAO-CARREGA-01](sprints/2026-08-07-INSTALL-QUE-NAO-CARREGA-01-as-descobertas-que-nunca-viraram-codigo.md) | L3 aberta e medida hoje: cinco arquivos de `assets/` citam documentos que não existem, e o portão de referências só varre `docs/`. L5 sem resposta | DELA |
| [SIMETRIA-INSTALL-02](sprints/2026-07-31-SIMETRIA-INSTALL-02-o-que-o-install-deixa-para-tras.md) | E3, E4, E6 (decisão dela) e E7. Não reconferido se a E2 fechou ou só foi anotada | DELA |
| [CURA-QUE-FERE-01](sprints/2026-08-04-CURA-QUE-FERE-01-toda-cura-de-systemd-tem-de-provar-o-ciclo-inteiro.md) | **→ Onda 12 · instalação.** E1 a E4: teste de ciclo por unit instalada, o portão da tabela de combinações, unit em failed virar FALHA no doctor, e a tela com o agente morto | |
| [BT-AGENT-TRAVA-O-RESTART-01](sprints/2026-08-04-BT-AGENT-TRAVA-O-RESTART-01-noventa-segundos-de-bluetooth-fora-do-ar.md) | E4 (`flock -n` no `ExecStopPost`) e E5 (`TimeoutStopSec` explícito). E7 é da CURA-QUE-FERE-01 e também segue aberta | |
| [BT-SNAPSHOT-SANDBOX-01](sprints/2026-08-04-BT-SNAPSHOT-SANDBOX-01-o-salva-vidas-que-falhava-so-no-naufragio.md) | O teste que a sprint pediu por escrito (o `ReadWritePaths` cobrir tudo que os `ExecStopPost` escrevem) e a varredura irmã | |
| [DROPIN-AMBIGUO-01](sprints/2026-08-04-DROPIN-AMBIGUO-01-a-ausencia-do-drop-in-e-indistinguivel-de-escolha.md) | ABERTA. E1 a E5. A E4 é decisão a declarar em voz alta | |
| [RADIO-ABERTO-01](sprints/2026-08-04-RADIO-ABERTO-01-o-que-instalamos-por-padrao-anula-a-autenticacao.md) | E2 (agente próprio, que é o que fecha o cenário) e E3. E4 a E6 seguem N/A | |
| [PUBLICACAO-FIEL-01](sprints/2026-07-31-PUBLICACAO-FIEL-01-o-que-a-release-conta-de-errado.md) | E2 (decisão dela) e E3, que não consegui localizar para reconferir. O cabeçalho precisa deixar de dizer que não houve código | DELA |
| [IDENTIDADE-01](sprints/2026-08-21-IDENTIDADE-01-o-projeto-ainda-se-chama-pelo-nome-dele.md) | **→ Onda 12 · instalação.** Fase 2 (renomear o id, os 15 testes, o CI) e Fase 3 (a migração). As duas na mesma leva: id novo sem migração deixa quem já usava sem os perfis | |
| [ARVORE-DIVERGENTE-01](sprints/2026-07-30-ARVORE-DIVERGENTE-01-o-que-esta-na-main-e-nao-roda.md) | Portar E1, E4 (com o co-op desligado, todo controle conectado ainda vira jogador 1) e E5. A tag citada resolve para outro commit | DELA |

### Faixa 4 — a janela mente, corta, ou não deixa ela ver (13)

| Sprint | O que falta | DELA |
|---|---|---|
| [NAVEGA-PELO-CONTROLE-01](sprints/2026-08-15-NAVEGA-PELO-CONTROLE-01-quem-tem-o-foco-decide-o-que-o-R1-faz.md) | **→ Onda 10 · Navegação.** ABERTA. Seções 4 a 8 inteiras, a pergunta única da seção 9, e a prova de tela | DELA |
| [NAVEGAR-ESTA-JANELA-01](sprints/2026-08-15-NAVEGAR-ESTA-JANELA-01-a-decisao-ja-esta-tomada-e-o-dado-ja-esta-no-fio.md) | **→ Onda 10 · Navegação.** ABERTA. A entrega inteira, as duas perguntas da seção 8, e a prova de tela | DELA |
| [FIACAO-QUE-FALTA-01](sprints/2026-08-05-FIACAO-QUE-FALTA-01-o-verificador-que-ela-nao-tem-como-ver.md) | E1 (o verificador na janela), E4.1, E4.3, E5, E6 (texto de interface, palavra dela) e E3b | DELA |
| [JANELA-FIEL-01](sprints/2026-07-31-JANELA-FIEL-01-a-janela-que-para-de-reconciliar-e-o-botao-morto-no-pacote.md) | E5 (TUI) e E6 (bandeja), mais o aceite dela: a janela não trocar sozinha o que está na tela, e o Restaurar Padrão achar o arquivo | DELA |
| [JANELA-CORTADA-01](sprints/2026-08-17-JANELA-CORTADA-01-o-rodape-que-o-gtk-diz-que-cabe.md) | **→ Onda 3 · Status.** O item 2 — o selo Saída muda dentro do bloco, com bancada fiel à largura real do card | DELA |
| [RADAR-01](sprints/2026-07-31-RADAR-01-as-tres-superficies-que-ninguem-nunca-olhou.md) | E1, E2, E3 e o D1. O applet que ela usa TODO DIA continua sem o olho dela por cima | DELA |
| [BOTAO-QUE-NAO-MENTE-01](sprints/2026-07-26-BOTAO-QUE-NAO-MENTE-01-clico-e-nao-acontece-nada.md) | **→ Onda 8 · Gatilhos.** E5 (a regra de informar quantos controles cada sprint de interface adiciona ou remove) e E6. E1 e E3 não reconferidas | DELA |
| [PERFIL-SALVA-TUDO-01](sprints/2026-07-29-PERFIL-SALVA-TUDO-01-salvei-todas-as-abas-e-so-parte-ficou.md) | **→ Onda 6 · Perfis.** E5 e E6, nenhuma provável na árvore. E o cabeçalho, que ainda diz que E1 e E2 estão abertas — as duas estão em código com teste que morde | DELA |
| [PLAYER-LED-01](sprints/2026-07-25-PLAYER-LED-01-o-numero-do-jogo-chega-ao-controle.md) | **→ Onda 7 · Lightbar.** A entrega 5 — o diagnóstico honesto por controle. A entrega 4 tem sucessora própria, sinal de que o buraco não fechou aqui | |
| [FOCO-ERRANTE-01](sprints/2026-08-18-FOCO-ERRANTE-01-o-x-aponta-para-a-steam-e-leva-o-perfil-junto.md) | **→ Onda 6 · Perfis.** Passos 1, 2, 7, 8 e a cura de zero linhas (decisão dela). A ONDA 2 (backend COSMIC) intocada | DELA |
| [PROVA-DE-TELA-01](sprints/2026-07-27-PROVA-DE-TELA-01-dez-minutos-de-olho-antes-de-qualquer-leva.md) | **→ Onda 10 · Navegação.** A folha respondida dentro do documento — o passo 4 do próprio procedimento. Hoje as fotos entram e a folha não | DELA |
| [GATILHO-PALAVRA-01](sprints/2026-07-29-GATILHO-PALAVRA-01-os-dezenove-modos-em-portugues.md) | **→ Onda 8 · Gatilhos.** A escolha das dezenove palavras, que é dela por construção. Amarrada à decisão irmã da CR-SEQUENCIA-01/E5 | DELA |
| [NO-MEU-FUNCIONA-01](sprints/2026-08-22-NO-MEU-FUNCIONA-01-o-ambiente-que-o-produto-presume-sem-medir.md) | **→ Onda 5 · Emulação.** NOVA em 22/08. E1 a E7: a Steam Flatpak, a bandeja fora do COSMIC, a janela que não abre sem XWayland, o backend escolhido pela presença de `DISPLAY` | parte DELA |

### Faixa 5 — o aparelho: luz, som, gatilho, rádio (31)

A maioria destas destranca com a bancada de 22/08 e o controle na mão dela.

| Sprint | O que falta | DELA |
|---|---|---|
| [PROVA-NO-PLASTICO-01](sprints/2026-08-19-PROVA-NO-PLASTICO-01-o-roteiro-de-quarenta-minutos-com-o-controle-na-mao.md) | ABERTA. Bloco A, B2 a B6, e o bloco C inteiro: 20 células que só o olho dela preenche | DELA |
| [O QUE PRECISA DE VOCÊ (19/08)](sprints/2026-08-19-O-QUE-PRECISA-DE-VOCE.md) | O roteiro de 40 min sem o bloco B1, abrir o Grim Fandango uma vez, olhar as cinco cores, e o chamador automático da allowlist | DELA |
| [A-PONTE-UNIVERSAL-01](sprints/2026-08-15-A-PONTE-UNIVERSAL-01-o-cabo-como-pedra-de-roseta.md) | P-1 (o oráculo de transporte pelo `HID_ID`), P-3, E-2, e a Onda 4 inteira | DELA |
| [ESCADA-QUE-RESPONDE-01](sprints/2026-08-15-ESCADA-QUE-RESPONDE-01-do-degrau-que-obedece-ao-conteudo-do-payload.md) | E-2 a E-6: todos escrevem no aparelho e dependem da D-31 e da D-32. E as linhas no caderno com a coluna do degrau preenchida | DELA |
| [A-CADEIA-DE-BLOCOS-01](sprints/2026-08-16-A-CADEIA-DE-BLOCOS-01-o-ensaio-de-quatro-minutos-que-decide-o-som-por-radio.md) | **→ Onda 12 · BT, trilha DELA.** ABERTA. O acréscimo no instrumento, os 6 minutos de olho dela no E-7, e as quatro perguntas da seção 10 | DELA |
| [O-ALTO-FALANTE-POR-RADIO-01](sprints/2026-08-15-O-ALTO-FALANTE-POR-RADIO-01-a-casa-ja-tinha-o-mapa.md) | **→ Onda 12 · BT, trilha DELA.** ABERTA. E1 (montar o `0x39` com o bloco duplo), E2 (o ensaio com a orelha dela) e E3 | DELA |
| [TRES-MODOS-DO-SOM-01](sprints/2026-08-16-TRES-MODOS-DO-SOM-01-o-que-sai-onde-e-quem-escolhe.md) | **→ Onda 3 · Status.** ABERTA. As cinco decisões P-1 a P-5 e as cinco ondas. Não conferido se a ONDA 1.2 caducou por outra via | DELA |
| [E5 — O TERRENO](sprints/2026-08-16-E5-O-TERRENO-o-que-o-E1-mudou-no-caminho-do-som.md) | Duas linhas no caderno de ensaios e o bruto da corrida. As três perguntas da seção 10 são dela | DELA |
| [SOM-ROTA-01](sprints/2026-08-01-SOM-ROTA-01-a-rota-o-preamp-e-o-canal-do-controle.md) | E2, metade da E3, E4 e E5 — dependem do hardware e da mão dela | DELA |
| [PARIDADE-SONY-01](sprints/2026-08-01-PARIDADE-SONY-01-o-que-o-jogo-manda-ao-alto-falante.md) | **→ Onda 4 · No jogo.** A E2 em diante só destranca com medição de jogo real mostrando valores diferentes dos que o sistema escreve | DELA |
| [CONTROLE-INTEIRO-NO-RADIO-01](sprints/2026-08-07-CONTROLE-INTEIRO-NO-RADIO-01-o-mic-e-o-fone-que-nao-atravessam.md) | A metade da SAÍDA (P5 e P6): não há sink virtual nenhum. E o documento precisa de nota datada dizendo que P0 a P3 caíram | |
| [SEM-MICROFONE-NENHUM-01](sprints/2026-08-06-SEM-MICROFONE-NENHUM-01-o-alto-falante-vira-a-entrada-padrao.md) | **→ Onda 5 · Emulação.** ABERTA. A política, e a medição que ela exige: o que o WirePlumber faz sem nenhuma fonte com porta usável. É privacidade | |
| [MIC-BT-01](sprints/2026-07-25-MIC-BT-01-o-medidor-do-microfone-por-bluetooth.md) | **→ Onda 12 · BT, trilha DELA.** Caixa 2 (só reabre com a posse do `/dev/hidraw` arbitrada), e as caixas 3 e 4 não encontradas na árvore | |
| [LIGHTBAR-BT-CULPADO-01](sprints/2026-08-03-LIGHTBAR-BT-CULPADO-01-o-report-que-curava-e-o-que-trava.md) | **→ Onda 12 · BT, trilha DELA.** A E3 e o aceite dela. É a regressão que ela descreve como sempre arrumamos mas sempre volta | DELA |
| [SEGUNDO-ESCRITOR-01](sprints/2026-08-08-SEGUNDO-ESCRITOR-01-o-driver-do-kernel-tambem-escreve-a-barra.md) | **→ Onda 7 · Lightbar.** ABERTA. A medição de contraste dela. Nada virou código, e nada aponta para ela | DELA |
| [A-LUZ-QUE-CUROU-01](sprints/2026-08-07-A-LUZ-QUE-CUROU-01-calar-parou-o-bombardeio-e-voltar-tem-preco.md) | **→ Onda 12 · BT, trilha DELA.** O protocolo da seção 6 nunca rodou, e a pergunta da seção 7 não aparece respondida no painel de decisões dela | DELA |
| [CANETA-NA-MAO-01](sprints/2026-08-12-CANETA-NA-MAO-01-o-suspeito-que-ninguem-olhou-em-dezesseis-dias.md) | Seção 7, itens 1 a 5 e 7: a volta do ensaio da lightbar, o bit de autorização do gatilho, sete dos oito modos, e a PODA | DELA |
| [O-LACO-DE-ESCRITA-01](sprints/2026-08-15-O-LACO-DE-ESCRITA-01-o-suspeito-que-sobrou.md) | **→ Onda 9 · Rumble.** A D-38 (autorização dela) e o E-9. O negativo aposentaria uma justificativa que hoje cobra até 32 ms de latência | DELA |
| [BT-SURDO-01](sprints/2026-08-03-BT-SURDO-01-o-controle-parado-no-radio-nao-recebe-ordem.md) | **→ Onda 12 · BT, trilha DELA.** E2 (o `init()` que deixa thread fantasma), E3 (o ioctl de 5 s segurando o lock central) e E4 | |
| [BT-FURO-FINO-01](sprints/2026-08-03-BT-FURO-FINO-01-os-sete-caminhos-que-so-degradam-no-radio.md) | **→ Onda 12 · BT, trilha DELA.** Os defeitos 2 a 7, sem prova de cura e sem prova de que sigam abertos. O 2 é o outro marcado ALTA | |
| [BT-E-VPAD-01](sprints/2026-08-01-BT-E-VPAD-01-o-que-so-existe-no-cabo-e-os-seis-furos.md) | **→ Onda 5 · Emulação.** Furo 5 (a taxa declarada do Edge), não medido e sem nada na árvore que o meça. O furo 4 tem decisão registrada de não fazer | |
| [RADIO-BOMBARDEADO-01](sprints/2026-08-04-RADIO-BOMBARDEADO-01-quarenta-mil-frames-corrompidos-em-meia-hora.md) | **→ Onda 12 · BT, trilha DELA.** ABERTA. O bloco F inteiro e o A/B de dez minutos. ATENÇÃO: a fixture de 20/08 cortou o amplificador citado, e isso muda a linha de base | |
| [BUSCA-QUE-ESTOURA-01](sprints/2026-08-07-BUSCA-QUE-ESTOURA-01-o-sdp-que-nao-responde-a-tempo.md) | ABERTA. A escolha entre os cinco desenhos é dela. Houve movimento lateral em `7c2fb92`, que não é nenhum dos cinco | DELA |
| [CR-SEQUENCIA-01](sprints/2026-07-31-CR-SEQUENCIA-01-o-que-avanca-sem-a-mao-dela-e-o-que-nao.md) | **Sobra a E5, e só ela**: o `(Rigid)`, o `(Bow)` e o `(Galloping)` dos rótulos ficam, saem ou viram outra coisa — a decisão irmã da GATILHO-PALAVRA-01. E1 (CR-05) e E2 (CR-01/CR-02) fecharam; E3 (a bancada) e E4 caíram com a corrente em 29/08. **Não existe E6** — esta linha o citava, e ele nunca esteve no arquivo | DELA |
| [BARRA-MUDA-01](sprints/2026-08-22-BARRA-MUDA-01-a-lampada-nao-se-le-o-nascimento-sim.md) | **→ Onda 7 · Lightbar.** ENTREGUE, menos o experimento da §6 — o único que fecha a célula do mapa, e só o olho dela o faz | DELA |
| [SINAL-NO-NASCIMENTO-01](sprints/2026-08-22-SINAL-NO-NASCIMENTO-01-o-veredito-existe-e-o-hotplug-nao-pergunta.md) | NOVA em 22/08. E1 a E4: o tique de hotplug carimbar o veredito, a razão aparecer no card, o portão, e a colisão de nome entre `mesa_de_radio` e `sinal_da_barra` | |
| [LUZ-CEGA-01](sprints/2026-08-22-LUZ-CEGA-01-a-barra-apagada-e-o-exame-que-nao-olha-o-radio.md) | **→ Onda 7 · Lightbar.** E1, E2, E7 e metade da E5 fecharam. Faltam E3, E4, E6 e a **E8** — quatro MACs de fixture no `controllers.json` vivo dela | E8 parte DELA |
| [QUATRO-MICROFONES-01](sprints/2026-08-22-QUATRO-MICROFONES-01-a-ponte-esta-desligada-e-a-conta-diz-que-cabe.md) | **→ Onda 3 · Status.** NOVA em 22/08. E1 a E3: o interruptor que `bt_mic_enabled` nunca teve, a frase do medidor, e o ensaio dos quatro ao mesmo tempo | DELA |
| [DOIS-CAIRAM-DE-UMA-VEZ-01](sprints/2026-08-22-DOIS-CAIRAM-DE-UMA-VEZ-01-o-disconnect-que-derrubou-o-controle-do-vizinho.md) | **→ Onda 12 · BT, trilha DELA.** NOVA em 22/08. E1 a E3: reproduzir (ou não), separar as três famílias, e decidir o que o botão faz enquanto não se sabe | |
| [N-IGUAL-A-UM-01](sprints/2026-08-22-N-IGUAL-A-UM-01-o-produto-escolhe-um-quando-ha-tres.md) | E1 e E3 fecharam (`29c8a19`, `b77ed62`). Faltam E2 (o alias em TODO adaptador que hospeda Nintendo), E4 (o portão da classe) e E5 | parte DELA |
| [UMA-FAIXA-NÃO-É-UM-FABRICANTE-01](sprints/2026-08-22-UMA-FAIXA-NAO-E-UM-FABRICANTE-01-o-pro-dela-virou-a-definicao-de-pro.md) | E1 saiu em `e5376a0` (nasceu `core/linhagem_nintendo.py`). Faltam E2 (a regra 84 aprender a dizer "não sei"), E3 e E4 | DELA |

### Faixa 6 — documentação, portões e instrumento (12)

| Sprint | O que falta | DELA |
|---|---|---|
| [MAPA-QUE-VIRA-PORTAO-02](sprints/2026-08-11-MAPA-QUE-VIRA-PORTAO-02-o-que-entrou-e-o-que-continua-sendo-dela.md) | Itens 2 a 5. O 4 caducou pela metade: as três colunas cobrem menos de um quinto das linhas. O item 3 não reconferido | DELA |
| [DOC-QUE-NAO-MENTE-03](sprints/2026-08-03-DOC-QUE-NAO-MENTE-03-a-foto-vazia-a-env-negada-e-a-tag-velha.md) | E2 a E6. A doc de métricas ainda afirma zero ocorrências onde há 4, e os IDs órfãos seguem sem documento nem lápide | |
| [DOC-QUE-NAO-MENTE-04](sprints/2026-08-03-DOC-QUE-NAO-MENTE-04-os-nove-mecanismos-e-os-seis-portoes.md) | Os portões A, C, D e E. Sem eles, as duas mentiras da sprint seguem sem quem as pegue | |
| [DOC-VERDADE-02](sprints/2026-07-31-DOC-VERDADE-02-a-recontagem-e-as-quatro-mentiras-novas.md) | E7 é a única provada aberta por texto vivo. E1 a E4 e E6 não reconferidas | |
| [DOC-VERDADE-01](sprints/2026-07-26-DOC-VERDADE-01-a-documentacao-descreve-outro-programa.md) | e1 (a varredura nos quatro documentos de protocolo e em seis ADRs) e e6 (a colisão de nomes com os modos HID) | |
| [ROTULOS-DE-SPRINT-01](sprints/2026-08-09-ROTULOS-DE-SPRINT-01-entregue-no-codigo-nao-e-validado-por-ela.md) | A regra 4 do portão continua PROPOSTA. O portão de referências tem só as regras 1, 2 e 3 | DELA |
| [A-LINHA-QUE-DISPENSA-01](sprints/2026-08-15-A-LINHA-QUE-DISPENSA-01-o-defeito-mora-onde-a-autora-escreveu-que-nao-precisava-olhar.md) | E1, E2 e E3 — a E3 é a que teria pego quatro das seis. Cinquenta minutos ao todo | DELA |
| [TRES-REFUTADAS-01](sprints/2026-08-15-TRES-REFUTADAS-01-o-que-a-terceira-rodada-de-ceticismo-deixou-de-pe.md) | 1.5 (E1 e E3), 1.4 (E1 a E4) e o teste permanente das quatro conjunções nuas de 1.11 | DELA |
| [TESTE-HONESTO-01](sprints/2026-07-31-TESTE-HONESTO-01-os-297-verdes-que-nao-medem-interface.md) | **→ Onda 12 · portão.** E2 (a fixture de captura de Bluetooth) e os 68 `importorskip` restantes | |
| [SUITE-QUE-SUJA-O-JORNAL-01](sprints/2026-08-04-SUITE-QUE-SUJA-O-JORNAL-01-os-testes-escrevem-no-journal-do-sistema.md) | E4 (o portão) — exatamente o que a sprint previu. E o cabeçalho, que diz aberta sobre uma sprint majoritariamente paga | |
| [BERCO-DE-TMP-01](sprints/2026-08-07-BERCO-DE-TMP-01-a-suite-nao-suja-a-config-dela-suja-o-tmp.md) | Quatro dos sete declarados. Rodar a faxina no `/tmp` dela é palavra dela | DELA |
| [GATE-EMOJI-01](sprints/2026-07-27-GATE-EMOJI-01-o-higienizador-apaga-o-que-o-adr-protege.md) | E1: colar um emoji, salvar pelo editor dela, e ver se os 238 glifos do ADR-011 sobrevivem. Só a máquina dela responde | DELA |

---

## 5. BURACOS DE TEXTO — atacados em 22/08, e o que ficou

Os oito buracos de código desta lista foram para a fila da §1. Ficam aqui os
oito de texto: **todos foram atacados na leva de 22/08 e nenhum fechou por
completo**. Um cético mediu o que sobrou de cada um, e é só isso que vale ler —
a correção original saiu, porque já foi feita.

| Onde | O que foi atacado em 22/08 | O que FALTA |
|---|---|---|
| `docs/data/LEIA-PRIMEIRO.md` | Os quatro buracos da porta de entrada das specs (o mapa 302x45, as tabelas de 616 e 604, as quatro colunas do eixo de ponte, o parágrafo do `mapa-resumo.csv`). O arquivo de hoje tem 99 linhas e os números novos | A frase da "cura de raiz", no fim da seção 1, diz que o `Resumo do censo` do `scripts/check_paridade_transporte.py` "já imprime quase todos os contadores das seções 1 a 3". MEDIDO em 22/08, rodando o portão: o resumo imprime 18 números, e **11** deles aparecem nessas seções (308, 616, 124, 64, 14, 36, 177, 16, 4 e dois zeros). Continuam digitados à mão os bytes dos 10 arquivos, as 47 colunas, os 13 pares, o `existe`, as duas réguas por valor e as 20 casas do cruzamento. Trocar "quase todos" pelo que é: os do censo do mapa, e só |
| `docs/usage/metrics.md` | A negativa caduca na doc de uso e no `README.md`; o `docs/adr/016-prometheus-metrics.md` ganhou nota datada | O valor antigo sobreviveu no lugar de onde a próxima pessoa copia o fato como medido: `tests/unit/portao_a_casa_sabe_e_o_produto_nao_faz.py`, linhas 360 e 458, ainda afirmam que "a única ocorrência fora de src/" é o changelog do pacote Fedora. Trocar pelo par medido usado em `metrics.md`, e o ponteiro `spec:420` (morto) por `spec:459`. Modelo pronto na entrada irmã da linha 446, que já usa a redação escopada |
| `docs/usage/cli.md` | O bloco do aviso de falha conhecida (defeito corrigido em 25/07) saiu, e o corpo ganhou os comandos e ações que faltavam | (1) A frase nova de 353-355 diz "outras marcas", e `discover_external_gamepads` exclui por VID/PID de DualSense e Edge — um DualShock 4 cai como externo; e os externos ENTRAM em "controles na mesa". (2) A linha 335 e a nota de 06/08 ensinam a saída `jogadores ativos: 1`, que a CLI não produz mais — a nota fica, com uma linha dizendo o que mudou. (3) O `help=` e o docstring de `.../cli/cmd_test.py` contradizem a seção nova: é produto, e o `--help` é a primeira boca. (4) `docs/protocol/trigger-modes.md`, linhas 111 e 118, ainda mandam a linha que a DOC-QUE-NAO-MENTE-04 classificou como mentira em 03/08. (5) Menor: `cli/app.py` na linha 126 faz o comando de produto `led` chamar `cmd_test.cmd_led` |
| `docs/usage/hotkeys.md` | A linha do gesto na tabela, o parágrafo do R3 e a ressalva de prova de plástico | "e o jogo passou a andar" não tem prova: o journal sustenta a troca de máscara e o vpad Xbox subindo com o jogo aberto, e a escada encerrou por `jogo_fechou` sem carimbo. A condição "só com jogo na mão" vale para o aviso de RISCO, não para a sequência de FALHA. O parágrafo da escada precisa da ressalva: sem carimbo, o degrau só vence o ciclo quando o próximo é alcançável ao vivo. Ainda contradizem a página: `docs/process/METODO-DE-ISOLAMENTO.md` (973-976) e `sprints/2026-08-19-O-QUE-PRECISA-DE-VOCE.md` (29). E a bancada de 19→20/08 não está em `docs/data/ensaios.csv` — sem ela, a linha do verde entre as cinco cores fica travada. Nit herdado: `#ffb86c` é "laranja" aqui e "âmbar" em dois documentos |
| `docs/usage/jogos-e-mascaras.md` | O caminho real para desfazer a exceção do Steam Input, mais os dois comandos de CLI, com teste novo que reprova a volta da mentira | A página promete um diálogo que o código não faz nascer: `.../app/actions/profiles_actions.py`, por volta de 1918, não relê o sinal ao vivo antes de perguntar. Ou chamar `_ha_jogo_aberto_agora()` ali (uma linha, com teste que MORDA), ou qualificar a frase. Dentro da mesma função, a docstring de 1877-1880 ainda abre com "Sem diálogo", refutada pelo bloco abaixo dela. Fora dela: `.../integrations/steam_launch_options.py` (1256-1258) repete a frase que a página marca como REFUTADA e que o `gui/main.glade` já corrigiu; `2026-08-07-PAINEL-as-nove-decisoes-que-esperam-ela.md` (25) caducou em 07/08; e `docs/usage/interface.md` (447) precisa espelhar |
| `docs/usage/creating-profiles.md` | A seção `ponte` entrou na doc de perfis, e o gesto na doc de gestos | O gesto está invertido: ele diz "esta ponte NÃO serve" e move a escada; quem carimba é o SILÊNCIO, uma vez só, pelo tique de 1 Hz em `.../daemon/launch_env.py`. Hoje o único caso aparece como secundário. `confirmada_por` promete `gesto` e `escolha_dela`, e nenhum dos dois tem escritor em `src/` — o único chamador grava `silencio`. O mesmo fato errado está no comentário de `.../daemon/ipc_handlers.py` (1897-1901), que é provavelmente a fonte: a varredura do valor antigo não pode parar em `docs/`. E o `volume` do mic não entra em TODA ativação: a trava manual de áudio vence o perfil (`profiles/manager.py`, 822-827) |
| `.../integrations/prontuario_dos_jogos.py` | As três frases falsas (o doctor e a GUI que não consomem, e o "não escreve em lugar nenhum" que caducou em 19/08) | O `COMO-EXECUTAR.md` da sprint da aba Configurações cita a docstring apagada palavra por palavra, nas linhas 2000 e 3090, e manda "copiar a forma" de um padrão que declara existir TRÊS vezes. MEDIDO: são DUAS (`scripts/doctor.sh` nas linhas 1613 e 3235); o prontuário não é consumido por ninguém, e é justamente o terceiro exemplo. Corrigir a citação, o número e o ponteiro `:505`, que hoje é `:519` |
| `.../core/rumble.py` | O número do dono declarado: Máximo vale 1,5, e nunca valeu 2.0 | BLOQUEANTE: `tests/unit/test_politica_de_vibracao_a_escada_que_amplifica.py` diz "200%" na linha 236 e "1,5" na linha 8 — o arquivo se contradiz consigo mesmo. Mesma regra, mesmo tratamento: número errado sai, sem nota nem data. Menor, herdado: o empate do degrau 1.0 do automático com o Balanceado veio de o BALANCEADO subir de 0,7 para 1,0 em `496ba05`, não de o Máximo subir. Menor: a linha 89 continua importando a tabela de `daemon/lifecycle.py` (re-export), não do dono declarado `daemon/subsystems/rumble.py` |

**A lição que custou uma sessão inteira, 22/08/2026:** o commit `c4471a1` curou o
`docs/data/LEIA-PRIMEIRO.md` e, no MESMO commit, escreveu os quatro buracos dele
aqui como abertos. O backlog nasceu defasado, e o agente seguinte gastou a sessão
remedindo buraco já curado. Quem ataca um buraco fecha a linha dele na mesma
leva — esta seção não é registro do que se achou, é fila do que falta.

---

## 5.1. AS 28 PARCIAIS TRIADAS — e por que NENHUMA é barata

Das 87 parciais, 28 não dependem dela. Quatro agentes mediram o custo real de
fechar cada uma, e um cético conferiu as seis que pareciam baratas.

| Classe | Quantas |
|---|---|
| `CONSTRUIR` — falta código de verdade | **12** |
| `SO_TESTE` — a cura existe, falta teste que morda | 5 |
| `NAO_FECHA_SEM_HARDWARE` — o censo não viu que precisa da bancada | 4 |
| `SO_LIGAR` — código pronto, falta chamador | 4 |
| `JA_FECHADA` — o censo teria errado | 2 |
| `SO_DOC` | 1 |

**O cético derrubou as SEIS.** As duas `JA_FECHADA` continuam abertas e as
quatro `SO_LIGAR` não são "só ligar":

| Sprint | Era | É | Por quê |
|---|---|---|---|
| PROMESSA-NAO-CUMPRIDA-01 | `SO_LIGAR` | faxina cara | O item que a sustentava (C1, métricas sem chave) está **fechado desde 01/08**, com código, teste, doc e nota de ADR. A página acusa nove coisas já feitas |
| JOGO-01 | `SO_LIGAR` | **caducada** | `vpad_suspenso` **nunca fica `True`** num daemon de hoje. O dado que se mandaria "ligar" está morto, e o vocabulário foi invertido por decisão dela depois da sprint |
| PERFIL-NASCE-CERTO-01 | `SO_LIGAR` | aberta e cara | O botão existe desde 06/08, mas o **gesto que ele dispara ficou inerte** quando a E2 entrou — e a própria E2 escreveu isso |
| MASCARA-POR-JOGADOR-01 | `SO_LIGAR` | **o código entrou; sobra recriar o vpad** | **SUBSTITUÍDO em 29/08/2026.** Esta célula dizia *"as peças existem; o que falta é decidir, não ligar"* — e o MESMO arquivo, na §4, já dizia o contrário (*"o último degrau da 7.2: `make_virtual_pad` resolver a máscara ANTES de escolher o backend"*). Duas versões vivas no mesmo documento. **O CÓDIGO ENTROU em 29/08/2026, mais tarde no mesmo dia** (`A-MASCARA-POR-CONTROLE-01`): `make_virtual_pad` ganhou `identity` (`integrations/virtual_pad.py:153`) e resolve `mascara_efetiva(identity, flavor)` ANTES de escolher o backend; os dois chamadores passam o MAC (`daemon/subsystems/gamepad.py:2108`, `daemon/subsystems/coop.py:990`). Régua com 13 testes em `tests/unit/test_mascara_por_controle_manda_no_vpad.py`. **O que sobra é o vpad não ser RECRIADO ao aplicar** — ver `sprints/2026-08-29-A-MASCARA-POR-CONTROLE-01-*`. **E a decisão CAIU em 29/08:** `D-A-MASCARA-POR-CONTROLE-VALE-NO-APLICAR` e `D-DOIS-VPADS-COM-MASCARAS-DIFERENTES-JA-FUNCIONOU`, as duas `decidida` em `docs/data/decisoes-dela.csv`. Não há escolha pendente |
| DOC-VERDADE-01 | `JA_FECHADA` | aberta | A régua da classificação estava errada: grepou nome velho e achou zero |
| ORDEM-DE-CHEGADA-01 | `JA_FECHADA` | aberta | Existe **decisão datada de NÃO ligar**, dentro da própria lápide usada como prova a favor |

**A conclusão prática:** não há fruta baixa nas parciais. O que parecia "uma
hora" é faxina documental, feature caducada ou decisão dela. A contagem do
cabeçalho (74/87/40) **não muda** — as duas `JA_FECHADA` foram derrubadas.

**O achado virou sprint:**
[VPAD-SUSPENSO-MORTO-01](sprints/2026-08-27-A-FAXINA-o-que-saiu-e-por-que.md).
Confirmado com o mecanismo exato: `suspend_vpads_for_steam_input()` (que põe
`True`) **não tem nenhuma chamada em `src/`** — só em quatro arquivos de teste —,
enquanto a irmã `resume_vpads_after_steam_input()` é chamada em
`gamepad.py:526`. Existe quem retoma e não existe quem suspende, então a flag só
anda para `False`, e as três leituras de produção relatam sempre o mesmo estado.
A suíte verde é o que esconde: a função é testada, ninguém pergunta quem a
invoca fora dali.

---

## 6. O QUE PRECISA DELA — eram seis, e **ela já respondeu cinco**

> **CORREÇÃO DE 25/08/2026, e ela custou três dias.** Esta seção dizia *"são
> SEIS"* e a [escada de releases](2026-08-24-A-ESCADA-DE-RELEASES.md) somava
> *"6 decisões, de 29 a 39 minutos"* como custo dela para a 0.9.6. **Cinco das
> seis já estavam respondidas** — ela marcou as caixas no `DECISOES.md` no
> commit `4272438`, de **22/08**, e em duas delas escreveu à mão. A resposta
> nunca foi colhida para o `decisoes-dela.csv`, e por isso a casa continuou
> cobrando dela um trabalho já feito.
>
> **Colhidas em 25/08** (`docs/data/decisoes-dela.csv`): `D-LARGURA-APROVADA`,
> `D-E9-LACO-DE-ESCRITA`, `D-VIGIA-DO-STEAM-INPUT`, `D-STEAM-SAI-DA-NAVEGACAO`,
> `D-SEMEAR-SO-OS-QUE-FALTAM`. **Sobra UMA:** a pergunta 1 — *"a janela depois
> dos sete consertos de largura está boa?"*, que é olho na tela e não decisão
> de mesa.
>
> **E a nota manuscrita dela na pergunta 5 abriu uma decisão NOVA**, que estava
> pendurada sem resposta desde 22/08: `D-PERFIL-NAVEGACAO`. Medido em 24/08 —
> o `navegacao.json` não tem seção `mouse` nem `key_bindings`; ele não navega
> nada. É homônimo da aba, não redundante com ela. E a intuição dela achou um
> buraco real: **não existe perfil que transforme o controle em mouse/teclado
> ao sair do jogo**, embora o esquema permita.
>
> **A lição, e ela vale mais que a correção:** o `DECISOES.md` é onde ela
> responde, e o `decisoes-dela.csv` é onde a casa lê. **Sem alguém carregando de
> um para o outro, a resposta dela não existe.** Colher o `DECISOES.md` é passo
> obrigatório de quem coordena, e agora está escrito.

**O documento é [`DECISOES.md`](../../DECISOES.md), na raiz.** Ele tem o print, as
opções e o custo de cada uma. Esta seção não repete o conteúdo dele.

O censo marcou 84 sprints como dependentes dela. Seis agentes leram uma a uma e
extraíram **163 perguntas**; um cético independente conferiu cada uma, com uma
instrução acima das outras: *antes de aceitar, procure se já foi decidida.*

```
163  perguntas extraídas
 23  descartadas: não eram decisão dela, eram trabalho
 54  DERRUBADAS — já tinham resposta, com data e lugar
  6  sobreviveram        (29 a 39 minutos, no total)
```

O projeto carregava um peso falso. As 54 já respondidas estão no fim do
`DECISOES.md`, em tabela, para ninguém reabri-las — e em quatro delas a coluna
de data ficou com travessão, porque a pergunta estava **mal feita**, não
respondida.

Os quatro gestos abaixo continuam descrevendo o TIPO de trabalho que sobra nas
sprints marcadas `DELA` na seção 4 — a maior parte é bancada e olho na tela, que
não são decisão e por isso não entram no `DECISOES.md`:

| Gesto | O que destranca |
|---|---|
| **Controle na mão, com a bancada** | a faixa 5 quase inteira, a CHECKLIST de hardware, a PROVA-NO-PLASTICO-01 e o roteiro de 40 min de 19/08 |
| **Olho na tela, foto antes e depois** | a faixa 4 inteira — por PROVA-DE-TELA-01, interface não fecha sem a palavra dela |
| **Palavra de vocabulário e de texto de interface** | GATILHO-PALAVRA-01 (as dezenove palavras), ONDE-A-COR-MORA-01 (as três perguntas), TRES-MODOS-DO-SOM-01 (P-1 a P-5), a frase do travessão da FIACAO-QUE-FALTA-01 |
| **Decisão de projeto, com o preço na mesa** | BUSCA-QUE-ESTOURA-01 (os cinco desenhos), DROPIN-AMBIGUO-01 (a migração), RADIO-ABERTO-01 e CONECTA-E-DESLIGA-01 (o preço que ninguém perguntou se ela aceitava), IDENTIDADE-DUPLA-01 (o MAC de cada modo, 2 minutos) |

As perguntas já escritas e ainda sem resposta estão em
[AS DECISÕES QUE ESPERAM VOCÊ](2026-08-15-AS-DECISOES-QUE-ESPERAM-VOCE.md) e em
[O QUE PRECISA DE VOCÊ (19/08)](sprints/2026-08-19-O-QUE-PRECISA-DE-VOCE.md).

---

## 7. A regra deste arquivo

Quem fecha uma sprint atualiza aqui, no mesmo commit — tira a linha da seção 4
e corrige a contagem do cabeçalho. Quem abre uma sprint nova põe a linha na
faixa a que ela pertence. Este arquivo não tem portão: ele vale exatamente o
que a última pessoa que o tocou escreveu.

**Três regras a mais, e as três nasceram de defeito:**

1. **Uma sprint tem UMA onda.** Se ela aparecer em duas, a dona é quem mexe no
   código; a outra declara `depois_de`. Hoje há **três pares** assim, e os três
   estão nomeados na §1.4 — nenhum deles é pego pelo portão.
2. **A onda se cita pelo NOME DA ABA** (`ONDA-PERFIS-04`), nunca pelo número
   solto: a fila já foi renumerada duas vezes, e o número velho sobrevive nos
   cabeçalhos.
3. **Quem fecha uma onda risca a marca da sprint que ela absorveu**, ou diz na
   linha o que ficou de fora. **Absorvida não é fechada** — e quando é
   substituída de vez, a linha sai daqui e entra no manifesto da faxina.
