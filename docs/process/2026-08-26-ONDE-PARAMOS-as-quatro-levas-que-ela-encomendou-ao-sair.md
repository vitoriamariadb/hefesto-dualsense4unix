# ONDE PARAMOS — as quatro levas que ela encomendou ao sair

**26/08/2026.** Ela saiu por sete horas e delegou tudo: *"estude todos os
projetos ativos e toque via agentes todas as sprints possíveis de serem tocadas
sem a necessidade de um humano. ao final das ondas dê merge na dev... faça 4
levas, decida por mim, vc é po e orquestrador e atualmente dono."*

Foi feito. **Vinte e seis frentes, quatro levas, 122 commits, tudo em `dev`.**

## O que mudou do lado de quem joga

| o que doía | o que faz agora |
|---|---|
| Um controle cai no rádio e o motor do dela **fica vibrando** até um teto de 3 s cortar — quatro vezes em 28 s na sessão dela, uma delas em (230,230) | O motor **para** antes de o vpad morrer |
| Com o vpad do Jogador 1 morto, o jogo vê os controles 2, 3 e 4 **dobrados** | Cada secundário é reescondido pelo vpad **dele** |
| Desligar o Modo Nativo não devolvia a vibração ao jogo | O sétimo applier entrou na volta |
| **Segurar o PS para religar o controle abria a Steam** | Teto de 700 ms: o hold de 5 s deixa de ser toque |
| A Lightbar dizia "Cor enviada" por adivinhação da janela | Ela pergunta ao daemon, que já sabia o destino |
| Fora do checkout (Flatpak, AppImage, Arch, Fedora, Nix) os botões não faziam nada | Cinco listas de caminho viraram uma; os botões funcionam |
| Três frases mandavam rodar `./install.sh` para quem nunca clonou | O conselho nomeia o gesto do formato (`flatpak update`, `pacman -Syu`, …) |
| O exame saía `[OK]` em dois lugares onde não mediu | A ausência do drop-in 51 deixou de ter duas origens numa só; o veredito do hide conta os físicos, não os escondidos |
| As doze frases de diagnóstico diziam o quê e o porquê, nunca **o que fazer** | As doze no molde `O que fazer:`, e onde o gesto é botão da tela, o botão é apontado |
| O card de ordem de serviço não tinha resposta | `[Já movi — reexaminar]` e `[Ignorar]` |
| A fábrica embarcava 12 perfis; ela mantinha 9 | `bow`, `coop_local` e `sackboy_nativo` saíram — **é o "manter só os ativos" dela** |
| Entrada USB vazia não tinha como ser ensinada | Nasceu a janela de calibrar entradas |

## Os dois buracos que ninguém tinha visto

Achados pela **conferência**, não pelo executor — o padrão desta casa se repetiu.

1. **O SVG era esconderijo nas TRÊS réguas de anonimato ao mesmo tempo**, a
   autoritativa inclusive. Um serial de fábrica dentro de um `<text>` de SVG
   **commitado** saía rc=0; o mesmo conteúdo num `.md`, rc=1. São 49 SVGs
   versionados, todos texto puro. Três réguas com o mesmo ponto cego é
   exatamente o que "duas réguas independentes" existe para impedir.
2. **Um endereço em TEXTO dentro de um `.gz` não era visto por portão nenhum.**
   A cura estava **escrita desde 23/08**, no comentário do próprio
   `check_anonymity.sh`: *"A cura NÃO é acrescentar '.gz' ao PULA... A cura é
   olhar o CONTEÚDO."* O irmão descomprimia; este pulava. E a segunda régua não
   cobria: o `check_anonymity.sh` descomprime, mas só procura OUIs em **bytes
   crus**.

Os dois eram **latentes** — os cinco `.csv.gz` versionados foram descomprimidos
e conferidos: zero endereços. Hoje têm mordida que reprova nos dois casos.

## A frente que foi DEVOLVIDA, e por quê

A **L3-E** passou pelo executor e a conferência a derrubou com duas regressões:

1. `"Nada foi aplicado ao controle."` virou **código morto** — a janela voltaria
   a comemorar depois de nada ter chegado ao controle. É o defeito que estas
   sprints existem para matar, renascido dentro da cura.
2. Três alto-falantes caídos viravam **um rótulo só** — dois controles sumiam da
   mensagem —, contra a decisão escrita 16 linhas acima do ponto que a ordem
   citava.

**Nenhum teste da suíte pegava isso**: `test_aplicar_verdade_02` monta o payload
à mão e nunca passa pela costura. A costura não tinha régua; agora tem.

## O padrão que dominou o dia: a régua confunde a PALAVRA com o ATO

**Onze réguas** reprovaram a MELHORA em vez do defeito, todas pela mesma forma:
elas **digitavam** o que deviam **ler**.

- Um teste exigia que segurar o PS por 2 s **abrisse a Steam** — travando a
  ausência do teto que era a cura.
- Três réguas prendiam o rótulo `"Aplicar correções"` letra por letra, e o botão
  foi renomeado para o texto que diz o que ele faz.
- Uma prendia `"A mesa"` e `"Orçamento"` enquanto a seção era renomeada para o
  léxico dela.
- Uma exigia a frase fixa do selo enquanto o selo passava a **contar**.
- Uma tinha piso de 8 parágrafos de apoio enquanto a frente **tirava quatro de
  propósito**, a pedido dela.

Todas foram consertadas **pelo vínculo, não pela palavra**: leem o `TITULO` da
seção, o rótulo vivo do `main.glade`, a dona atual da regra. Assim não
envelhecem de novo.

E uma frase do produto foi pega mandando a pessoa clicar num botão **que não
existia mais** — pela régua `test_steam_input_ponteiros.py`, que compara a frase
com os rótulos vivos da janela. É a régua fazendo exatamente o trabalho dela.

## O defeito de tela que a leva criou, e curou

A aba Sistema **estourou a largura da janela**: 1284px contra os 1180px com que
ela abre, e a política é horizontal `never` — sem barra para onde fugir. A causa
foi o renomeio do botão (17 → 30 caracteres) numa fileira de cinco botões, onde
o `GtkBox` horizontal pede a **soma** dos mínimos.

Curado com quebra de linha no rótulo do botão mais largo: **1284 → 1118px**. Em
tela larga fica idêntico ao de antes, numa linha só. **Não** foi usado
`GtkFlowBox`: a casa já tentou no rodapé e ele dropou 3 dos 4 botões
(FIX-GUI-COSMIC-REMEDIATION-01).

## Perfis de jogo — o que decidi, e o que NÃO decidi

Ela pediu *"manter os que temos ativos apenas"*. A fábrica encolheu de 12 para 9.

**Saíram:** `bow`, `coop_local`, `sackboy_nativo` — os três já estavam no
`.historico/` do disco dela (26/08, 02:02-02:03), e nenhum era usado.

**FICARAM, e a escolha é dela:**

- **`fallback.json`** — é a rede da primeira hora de quem instala. Tirá-lo deixa
  quem chega **sem perfil ativo** até abrir um jogo com nome nas listas de
  regex. O disco dela não serve de prova: ela é a única pessoa que não sente a
  rede sumir, porque tem 23 perfis por jogo construídos num mês.
- **`meu_perfil.json`** — um **botão vivo** do rodapé das onze abas o lê
  (`footer_actions.py`, `_meu_perfil_asset()`). Sem o asset, o botão responde
  para sempre com um aviso de indisponível, e botão que existe e nunca funciona
  é pior que botão nenhum. São três saídas possíveis, e todas mudam texto de tela.
- **`navegacao.json`** — **contradiz decisão dela de anteontem**
  (`D-PERFIL-NAVEGACAO`, 25/08: *"MANTER E RENOMEAR… é HOMONÍMIA, e homônimo se
  resolve com nome, não com remoção"*), e a `D-STEAM-SAI-DA-NAVEGACAO` foi
  executada nesse arquivo no mesmo dia. Há fato novo (ela o apagou do disco dela
  hoje às 02:01) e *"o projeto é vivo — precedente não é trava"*: a escolha pode
  mudar, mas quem muda é ela.

## O que espera ela

**Vinte e seis relatos**, e a maioria é texto de tela marcado
`PROVISÓRIO — decisão dela` no código, esperando o carimbo (PROVA-DE-TELA-01).
A lista completa está nas entregas de `docs/process/agentes/2026-08-26/`.

Os que **não** são texto e precisam da palavra dela:

1. **Qual das duas réguas do arranjo manda.** A medição que a
   `D-QUAL-REGUA-MANDA-NO-ARRANJO` exigia **está feita** e roda com um comando;
   os quatro casos estão na entrega da L1-G. Trava a G5.
2. **A ordem de serviço manda mover de "Adaptador sem nome" para "Adaptador sem
   nome"** — dois dongles sem apelido caem no mesmo rótulo, e a tela manda mover
   sem dizer para onde. Defeito VIVO.
3. **"cabe?" tem duas respostas hoje.** `PlanoDosControles.cabe` usa teto de
   100% e `palavra_da_ocupacao` usa corte de 85%: numa mesa de 1.562,4 de 1.600
   a tela diz "Cheia" e o motor diz `cabe=True`.
4. **"Voltar ao padrão" existe DUAS vezes na janela** (atalhos de fábrica e
   `meu_perfil` de fábrica).
5. **A bancada.** Nada foi ao aparelho: as curas do rumble na borda de queda e
   do sétimo applier estão provadas em teste, não no plástico.

## Como isto foi feito

Um censo de 7 batedores + 3 lentes céticas + 1 sintetizador dono único mediu 76
frentes brutas, 64 abertas, **40 tocáveis sem humano**, e escolheu 26. O critério
de corte foi um só: **precisa da PALAVRA, do OLHO ou da MÃO dela? então não
entra.**

Cada frente rodou numa **árvore de git própria** (`git worktree`), com a posse
declarada por máquina e conferida pelo `check_colisao_de_sprints.py` — 43
colisões com sprints antigas foram declaradas antes do despacho. **A árvore dela
ficou em `dev` o tempo todo**, e recebeu tudo no fim, de uma vez, como ela pediu.

Cada entrega foi **conferida por um segundo agente**, que refez a mordida com as
próprias mãos: arrancou a cura, viu reprovar, devolveu. Foi assim que a L3-E foi
devolvida.

## Os números

```
26 frentes · 4 levas · 122 commits · 26 merges, zero conflitos
26 portões verdes · 13.755 testes em oito lotes, zero reprovações
```

## Os erros de quem coordenou, porque o processo é a entrega tanto quanto o código

1. **Li o `rc` do `grep` em vez do `rc` do script** e declarei o
   `colisao-de-sprints` verde quando ele estava vermelho. Quem me corrigiu foi o
   executor da primeira frente, e ele estava certo — provou com `git stash`.
2. **Escrevi sete isenções de acentuação que passavam de 100 colunas** e
   quebraram o `ruff`, travando a costura das SETE frentes da Leva 3. O agente
   que reportou tinha medido certo; o erro era meu.
3. **Costurei três frentes sem conferência** porque o limite semanal matou os
   conferentes. Relancei as três a medir contra `onda/atual` — e foi uma delas
   que achou os dois buracos de anonimato. Se eu tivesse deixado passar, os dois
   continuariam abertos.
4. **Rodei `--rapido` achando que era o portão.** Dois agentes me avisaram, com
   a mesma frase: `--rapido` (19) não cobre `acentuacao`, `mypy`, `shellcheck`,
   `anonimato` nem `casa-sabe`. **A camada completa é a que decide.**
