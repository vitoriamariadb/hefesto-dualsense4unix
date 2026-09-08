<!-- ENTRADA DESTE AGENTE, movida da raiz para cá em 06/09/2026 pela
     A-VALIDACAO-DOS-QUATRO-01. Dois motivos: `docs/process/agentes/` é
     onde a saída bruta de agente mora nesta casa, e a raiz do repositório
     não é lugar de arquivo de trabalho. UMA alteração de conteúdo, e ela
     está declarada: o U+26A1 do croqui da §1 virou a palavra `carreg.`,
     porque o ADR-011 proíbe emoji de apresentação e o portão `glifos` o
     reprova. Nenhuma outra letra foi tocada — as citações dela são
     literais, e corrigir a grafia de uma citação é falsificá-la. -->

# A MESA DE MEDIÇÃO — a página onde ela e o Claude medem os quatro DualSense

**06/09/2026.** Encomenda dela, e a razão dela vem primeiro porque é ela que
decide tudo o que se segue:

> *"no passado faziamos isso e o claude fable chegava no limite da sessao e
> **nao salvava nenhum dos testes nem como ele conseguia tal resultado**. a
> nossa mesa de medição html é pra isso."* <!-- noqa-acento: citação literal dela -->

**O defeito que esta página existe para matar não é de código: é de memória.**
A medição acontecia, o resultado aparecia na conversa, a sessão morria, e no dia
seguinte ninguém sabia nem o que deu nem *como se chegou lá*. Toda decisão de
desenho abaixo se justifica por essa frase.

O resto da encomenda, verbatim:

> *"a ideia é termos uma página pra medirmos o que falta no specs. mas deve-se
> usar esses arquivos na hora de vc criar os testes e criar a nossa página de
> leitura de mesa. cada uma das coisas que temos que medir, vc pode usar os
> mapas do controle pra pintar os svgs e identificar os 4 controles conectados
> pra que vc sempre saiba qual é o controle que recebeu tal teste e via
> interface web vc e eu possamos ir medindo, eu registro lá que tal controle
> ficou x com o teste y clico em avançar, o novo teste inicia eu relato o estado
> dos 4 controles ou cada um dos 4 controles podendo conter tal teste x e
> afins. (…) lá tem o led do player, o led que fica aceso tambem e afins."*

E a regra do começo de cada teste:

> *"antes de aplicar tal teste na página temos que ter um botão de iniciar. Ele
> mostra o que observar e o que aocontecer e mostra um timer pra antes de
> aplicar tal coisa."* <!-- noqa-acento: citação literal dela -->

---

## 0. O QUE ELA MEDE

Duas coisas, na mesma página, porque para ela é um trabalho só:

1. **As células que o `specs.html` ainda não sabe** — as `nao-medido` e as de
   grau fraco de `docs/data/mapa-controles.csv`, com o gesto que fecha cada uma;
2. **As 21 linhas do roteiro da MESA-DE-QUATRO-01**, que são a aceitação do
   produto.

Os testes **saem dos arquivos**, nunca de uma lista escrita à mão nesta página.
Mudou o CSV, mudou a mesa.

---

## 1. A CENA DE UM TESTE, e ela tem TRÊS TEMPOS

O botão de iniciar é o que separa o tempo 1 do tempo 2, e ele é dela.

### Tempo 1 — ANTES (a página está parada, nada aconteceu)

```
┌───────────────────────────────────────────────────────────────────────┐
│  teste 12 de 47      ·      LUZ · a barra obedece no rádio            │
├───────────────────────────────────────────────────────────────────────┤
│  O QUE VAI ACONTECER                                                   │
│  O Controle 3 (rádio) vai receber uma cor na barra de luz.             │
│  Os outros três não recebem nada.                                      │
│                                                                        │
│  O QUE OBSERVAR EM CADA UM                                             │
│   P1 cabo   — nada muda                                                │
│   P2 cabo   — nada muda                                                │
│   P3 rádio  — a barra acende VERDE  ← este                             │
│   P4 rádio  — nada muda                                                │
│                                                                        │
│  A CÉLULA QUE ISTO FECHA:  luz.lightbar.cor @ rádio                    │
│  hoje: aciona=sim · de_onde_sei=inferido-do-codigo · MONTOU            │
│                                                                        │
│                                    [ ▶ INICIAR ]                       │
└───────────────────────────────────────────────────────────────────────┘
```

### Tempo 2 — O TIMER (ela clicou; ainda dá tempo de olhar para o aparelho)

Uma contagem visível antes de qualquer coisa acontecer. **Ela tira os olhos da
tela e põe nos controles.** Sem isso, a coisa acontece enquanto ela ainda lê, e
a medição se perde — que é o mesmo defeito da sessão que morre, em pequeno.

O timer também **conta durante** o que dura: um teste de vibração de 2 s mostra
os 2 s correndo, e um teste de "volte nisto aos 20 minutos" (linha 10 do
roteiro) mostra os 20 minutos.

### Tempo 3 — DEPOIS (ela registra)

```
├───────────────────────────────────────────────────────────────────────┤
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                      │
│   │[SVG P1]│  │[SVG P2]│  │[SVG P3]│  │[SVG P4]│                      │
│   │        │  │        │  │ barra  │  │        │                      │
│   │        │  │        │  │ ACESA  │  │        │                      │
│   └────────┘  └────────┘  └────────┘  └────────┘                      │
│   Cosmic Red   Starlight   Midnight    Nova Pink                      │
│   cabo · 87% carreg.  cabo · 64%  rádio · 41% rádio · 92%[OK]                   │
│   P1 · lâmpada 1  P2 · lâmpada 2  P3 · lâmpada 3  P4 · lâmpada 4      │
│                                                                        │
│   ( )obedeceu   ( )obedeceu   (•)obedeceu  ( )obedeceu                │
│   (•)nada       (•)nada       ( )não obed. (•)nada                     │
│   ( )não vi     ( )não vi     ( )não vi    ( )não vi                  │
│   ( )inesperado ( )inesperado ( )inesper.  ( )inesperado              │
├───────────────────────────────────────────────────────────────────────┤
│  o que eu vi: [ acendeu na hora, cor certa                          ]  │
│                          [ ← voltar ]  [ salvar e avançar → ]          │
└───────────────────────────────────────────────────────────────────────┘
```

**As quatro respostas por controle**, e a quarta é a que salva medição:
`obedeceu` · `nada aconteceu` · `não consegui ver` · **`aconteceu outra coisa`**.
A última abre o campo de texto, porque *o inesperado é o achado* — foi assim que
esta casa descobriu metade do que sabe.

---

## 2. O DESENHO DOS QUATRO — o que brilha, e de onde vem

**Nada se digita.** Três arquivos mandam, e a página lê:

| o que | dono | o que dá |
| --- | --- | --- |
| a forma e as 28 peças | `interface/ds_limpo.svg` + `docs/data/pecas-do-dualsense.csv` | o desenho, com id por peça |
| a cor do plástico | `docs/data/cores-do-dualsense.csv` | **28 modelos × 10 zonas** |
| que peça um teste toca | a coluna `peca` de `docs/data/mapa-controles.csv` | o que acender |

**A cor é por ZONA, nunca uma só.** O cabeçalho do CSV dela é explícito: *"o
desenho pintava o controle inteiro de uma cor, e o DualSense NÃO é de uma cor
só — no Cosmic Red a casca é carmim, o painel central é preto e os analógicos
são pretos."* Publique a folha dos **28 modelos inteira** e escolha por
`data-colorway`; uma folha podada é uma escolha cravada, e há portão
(`scripts/check_a_cor_vem_do_aparelho.py`, hoje em ZERO — **não o faça subir**).

**Modelos que não têm hexa** (iridescente, camuflado, arte) vêm com `SEM-HEX` na
coluna `grau` e **não se inventa um fill**: use o que `monta.cor_de_css` já faz.
Quatro modelos têm menos zonas que as dez (Ghost of Yotei tem 4, Marathon e
Genshin 3, 007 First Light 2) — decida o recuo e **declare na entrega**.

### O que acende, por teste

O gancho existe e **três dos quatro caminhos já vivem** (`interface/monta.py:1456`):

* `luz=` pinta a barra — **vivo**
* `jogador=` acende as lâmpadas do jogador — **vivo**
* `acesos=` acende as cinco peças invisíveis: giroscópio, acelerômetro, bateria
  e os **dois motores de vibração** — **vivo**
* `apertados=` marca qualquer uma das 28 peças — **ÓRFÃO**: escreve
  `class="marcada"` e não existe regra CSS nas dez abas. **Curar isso é parte do
  trabalho**, e o CSS de referência está em `scripts/gerar-mapa.py:389-390`.

**O mapa do controle já demonstra o realce inteiro, em CSS puro** — `mapa.py:613-633`
gera uma regra por peça, e ela mediu isso na tela: passar no "motor de vibração
esquerdo" acende **a metade esquerda do casco**. Reuse esse gerador trocando o
gatilho de `:hover` para uma classe que o teste aplica.

**Os quatro acendem ao mesmo tempo, com papéis diferentes:** o que DEVE reagir e
o que NÃO PODE reagir precisam de sinais distintos. Um teste em que os quatro
brilham igual não diz nada.

---

## 3. QUEM É QUEM — os quatro, identificados sem escrever no aparelho

Fonte: `daemon.state_full` pelo socket unix (`utils/xdg_paths.py:152`), cliente
pronto em `cli/ipc_client.py:40`. Por controle vêm `uniq`, `transport`,
`battery_pct`, `battery_state`, `player_slot`, `modelo`, `nome_declarado`,
`lightbar_rgb`, `inputs`, `audio`.

**A precedência do nome tem dono e não se reinventa** —
`interface/pacotes/__init__.py:1025` `identidade_de`: `nome_declarado` (o nome
que ELA deu, de graça) > `modelo` (decodificado do serial) > o nome da mesa >
o transporte sozinho. **Sem modelo publicado, travessão — nunca um colorway
escolhido.**

**A página não escreve NADA no aparelho para saber quem é quem.** O degrau
`modelo` custa um `SET_FEATURE 0x80`, e quem o paga é o daemon, uma vez por
controle por sessão. A página lê o que ele já publicou.

**A luz de jogador entra na identificação** (pedido dela: *"lá tem o led do
player, o led que fica aceso também"*): o desenho mostra qual lâmpada está acesa
em cada um, e é assim que ela casa o cartão da tela com o plástico na mesa.

---

## 4. O REGISTRO — e o "COMO", que é o ponto inteiro

Cada resposta grava, **na hora do clique**, em disco:

* o teste (id, título, a célula do mapa ou a linha do roteiro);
* a resposta **por controle**, mais o texto livre;
* **o estado dos quatro no instante**: `uniq` mascarado, transporte, bateria,
  modelo, slot, o que a barra dizia;
* **o COMO**: o gesto exato que foi aplicado — o comando, o report, o byte, o
  arquivo e a linha de quem o executou. É isto que se perdia quando a sessão
  morria, e sem isto o resultado não vale nada seis horas depois.

Sai daqui, sem ninguém redigitar:

1. as linhas de `docs/data/ensaios.csv` do que a bancada mediu;
2. a atualização das células do mapa (`de_onde_sei`, `ate_onde_foi`,
   `provado_em`, `provado_por`) — respeitando os domínios do portão;
3. `docs/process/2026-09-07-A-MESA-DE-QUATRO-o-que-a-bancada-mediu.md`.

**MAC mascarado sempre** (octetos 4 e 5 zerados). Dois portões reprovam MAC
real, e um pega por FORMA.

---

## 5. O ÍNDICE

No fim, por seção, com o número do teste e o estado de cada um: **não feito ·
obedeceu · falhou · parcial**. As seções saem das famílias do mapa e das seções
do roteiro, não de uma lista escrita aqui.

---

## 6. COMO SOBE

`./validar.sh` na raiz. Ele confere quem está na mesa, sobe um servidor local
mínimo (biblioteca padrão, **sem dependência nova** — a dívida do `playwright` já
ensinou o preço) e abre a página na tela dela. `--sem-abrir` para a régua.

**A janela é DELA e para ELA:** aqui não vale `--oculta`. As réguas automáticas,
essas sim, rodam headless.

---

## 7. A PROVA

Playwright dirigindo a página, provando **no mínimo**:

1. os testes saem dos CSV — **mordida:** mude uma linha do mapa e a página muda;
   se não mudar, ela copiou;
2. o botão de iniciar existe em todo teste, e **nada acontece antes dele**;
3. o timer conta antes de aplicar;
4. avançar e voltar andam; a última avança para o índice;
5. uma resposta gravada **sobrevive a recarregar** — e está **em disco**, não só
   no navegador;
6. os quatro desenhos aparecem com transporte, modelo e lâmpada de jogador certos;
7. **a peça acende, e na peça certa** — mordida: troque a `peca` da linha no mapa
   e veja o brilho mudar de lugar;
8. o índice tem as seções e cada número leva ao teste;
9. **o "como" é gravado**: arranque a gravação do gesto e veja a régua reprovar.

---

## 8. FORA DO ESCOPO

* **A página não aciona o aparelho nesta volta** (decidido, e ela confirmou:
  *"ok mas é essa a ideia mesmo"*). Ela diz o que fazer; quem faz é ela, no
  produto. O campo do "como" registra o gesto de qualquer jeito.
* **Só DualSense.** O Nintendo Pro e o 8BitDo são outra frente — ela já disse
  como: agentes lendo os repositórios de driver, como se fez com o DualSense.
