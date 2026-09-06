# ONDE PARAMOS — as vinte e quatro horas, e a janela que saiu

**06/09/2026.** Ela deu a máquina e o dia: *"senha sudo … 24 horas de trampo. o
pc é seu. pode resetar e fazer o que for necessário para conclusão de tudo. vc
coordena e usa o pc a vontade."* <!-- noqa-acento: citação literal dela -->
O Opus foi PO e orquestrador; ela não foi interrompida uma vez entre o despacho
e o FECHO.

**A senha não está em lugar nenhum deste repositório, e nenhum agente recebeu
sudo.** A decisão está registrada como `D-0609-A-MAQUINA-E-DO-OPUS`, sem ela.

---

## 0. O ESTADO EM UMA LINHA

**A janela GTK saiu do disco e a tela dela não moveu um pixel** — as dez páginas
foram refotografadas com a janela já apagada e saíram byte a byte idênticas. Em
volta disso: **a palavra que ela baniu chegou a zero na tela**, **a interface
parou de sambar**, **a paridade bateu a meta do dia**, e **seis ondas de agentes
entraram sem um conflito de código**.

---

## 1. O QUE FECHOU, ONDA POR ONDA

O plano são cinco ondas por posse de arquivo
([AS VINTE E QUATRO HORAS](2026-09-06-AS-VINTE-E-QUATRO-HORAS-a-ordem-que-o-orquestrador-despacha-e-as-rotas-corrigidas.md),
§5). Saíram **seis** — a última nasceu do estado, não do plano, e a razão está
na §6.

| onda | o que ela era | o que ficou |
| --- | --- | --- |
| **Passo 1** | A-TELA-SAMBA-01, sozinha | **7.100 mutações de DOM por 100 tiques viraram ZERO** na aba Jogar. Era P0 porque um produto que perde cliques invalida toda prova de tela feita sobre ele |
| **ONDA A** · 12 + coord. | a palavra do transporte, o piloto, seis abas, o mic pelo cabo, o registro | o transporte ganhou **um dono só** (cabo · rádio saem da sigla); o Hefesto **parou de mandar ninguém para o terminal** — e eram QUATRO bocas, não três; o **"Salvar Perfil" dela estava RECUSANDO, sem gravar nada** |
| **ONDA B** · 12 | as luzes, o motor, a GTK-1, os perfis, sete abas | o `— Nada —` **cala as vinte e duas linhas** e o `resolver()` herda o `key_bindings` dela; os gêneros viraram **Estilo de Jogo** e saíram da lista de perfis; nasceu o portão *"nada novo aponta para a janela"* |
| **ONDA C** · 10 | as cinco sprints novas de paridade, o mic pelo rádio, a GTK-2 | o **tique da aba 09 caiu de 1.341 ms para 18,6 ms** — e não era o disco, era o GIL; a tela de **escrever a tecla** nasceu; os três botões do **Steam Input**; o giroscópio diz o **hertz medido** |
| **ONDA D** · 3 + coord. | o perfil, o gesto que se declara, a GTK-3 (começa) | `PERIGOSOS` deixou de ser lembrança e passou a ser **derivada do decorador**; o perfil diz o que "Ativar" liga, e o jogo vem **desta** máquina |
| **ONDA E** · 3 | a aba Jogar, a palavra banida, a GTK-3 (termina) | **a janela GTK saiu** — 74 arquivos, +2.092 / −15.360; **a palavra sai da tela**: 34 frases lidas e 23 recados de tique vão a zero |
| **ONDA F** · 3 | o que a lista viva ainda mostrava desbloqueado | ver a §6 |

**As doze levas de portões correram em toda costura**, e o piso subiu de 43 para
**45** no meio do caminho — ver a §4.

---

## 2. O QUE MAIS CUSTOU, E NÃO ESTAVA EM NENHUM ENUNCIADO

### 2.1 O verde que mentia (ONDA F)

O gesto do cadeado da aba Jogar **jogava fora a resposta do serviço**. Com o
Hefesto parado, a ponte devolve `None`, o gesto voltava calado, o piloto anotava
*"aplicou"* — e a caixa **piscava VERDE sobre escrita que não aconteceu**, para
desmarcar sozinha 100 ms depois, no tique seguinte.

A sprint tinha sido escrita para **construir** esse verde, e o verde já existia:
quem o acende é o pouso do piloto, no próprio elemento clicado. *O que faltava
não era o sinal — era o sinal ser verdade.*

### 2.2 A régua que apontava para a tela que estava SAINDO

Na costura da ONDA C, a régua dos ponteiros apontava para a janela GTK enquanto
a GTK-3 a apagava. Nove vermelhos atravessaram a costura como se fossem nove
defeitos; eram **UM**, e era de quem coordena.

### 2.3 A régua da aba 02 estava morta havia uma semana

`test_regua_de_tela_a_aba_controles.py` pulava desde 31/08, quando
`layout/_ferramentas/` foi aposentada — **treze testes medindo nada**, e o
`skip` escondia. Pior: a mordida mostrou que o `except Exception` vestia um
**defeito do gerador** de *"falta ambiente"*.

### 2.4 A bancada da aba Jogar conferia o vazio

Ela abria um arquivo que não existe desde a mudança para `src/`, imprimia
**"ERRO DE CARGA"**, marcava `voltas: 0` — e **saía com `rc=0`**.

---

## 3. AS ARMADILHAS DESTE DIA

**1. O comentário que vira o defeito que descreve — pela quinta e pela sexta
vez.** Um comentário dentro de `_LISTA()` citando `bash scripts/portoes.sh` foi
lido como linha de portão; e um comentário meu, explicando a cura do aviso do
microfone, continha exatamente a frase que a condição do `xfail` procura. A
segunda foi **medida antes de eu entrar** — e é por isso que a régua nova do
funil da palavra banida anda por `ast`, não por texto: o comentário do `_json`
cita o nome da função que ele chama, e um `grep` daria verde com a chamada
arrancada.

**2. O despachante morria mudo.** `set -euo pipefail` mais
`VAR="$(grep … | head -1)"` sai no `rc=1` do `grep`. O agente não era
despachado, e ninguém sabia por quê. Curado com `|| true`.

**3. A espera por `pgrep` nasce imortal.** `until ! pgrep -f "scripts/portoes.sh"`
casa a **própria linha de comando** do laço. Dois shells ficaram presos; mortos
por PID conferido, nunca por `pkill -f`.

**4. O piso dos portões tinha um buraco.** `validar-citacoes-de-linha.py --all`
só varre `docs/`. **Sete endereços mortos em `src/` atravessaram uma leva
inteira com 44 verdes.** O piso é 45 desde 13h06.

**5. A fila oferecia trabalho já feito.** Oito sprints entregaram, com relatório
e commit na costura, e ninguém trocou o `estado:` delas. O despachante recusa o
que não está `aberta` — então o custo do erro é o inverso do que parece: **a
lista viva convidava o próximo agente a refazer o que já estava pronto.**

---

## 4. O QUE ESPERA A PALAVRA DELA — e são quatro atos, todos no FECHO

1. **Publicar, numa volta só.** A bancada está adiante do produto em **nove**
   das treze páginas, e `--publicar NN` é ato dela. As dez fotos `--oculta`
   estão em `docs/usage/assets/`.
2. **Dar a palavra para o `install.sh`.** O Opus roda `./install.sh --yes` na
   árvore dela, e só com essa palavra — nunca por agente, nunca antes.
3. **A bancada dos quatro** (`MESA-DE-QUATRO-01`), com o ensaio 1 do som por
   rádio dentro. **A MIC-VIRTUAL-02 devolveu uma prova em falta**, e é honesta:
   *não há DualSense no rádio nesta bancada*, medido no sysfs. A prova é dela.
4. **Abrir pelo `.desktop` e jogar.** Ninguém substitui.

---
