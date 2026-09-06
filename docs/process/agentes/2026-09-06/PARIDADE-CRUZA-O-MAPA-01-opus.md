# PARIDADE · CRUZA O MAPA — nenhuma linha IGUAL sem o mapa sustentar o transporte

**Agente `opus` · lote LOTE-2 · 06/09/2026 · branch `voo/PARIDADE-CRUZA-O-MAPA-01-opus`**

## §0 — O ESTADO EM UMA LINHA

O portão da paridade passou a **perguntar ao mapa de canais** — 26 pontes
declaradas, o veredito lido do mapa a cada execução —, **duas linhas que
afirmavam paridade sem dizer em que transporte** ganharam a declaração com
endereço no código, **as duas linhas de veredito novo foram remedidas com
medição de hoje** (e as duas continuam `FALTA_NO_HTML`, agora por uma razão
medida em vez de suposta), e o cruzamento deixou **três avisos** que são a
primeira linha da fila da bancada. Nenhuma célula do mapa foi tocada; nenhum
byte foi mandado a aparelho.

---

## O que mudou

### 1. O cruzamento entrou no portão que já existe — e isso foi decisão, não atalho

`scripts/check_paridade_gtk_html.py` ganhou **três regras** (10 `ponte-morta`,
11 `transporte-nao-declarado`, 12 `ponte-encolheu`) e **um canal de aviso** que
nunca muda o `rc`.

**Por que não um script novo em `scripts/`:** um portão novo obrigaria a mexer
no `portoes.sh` **e** no `.github/workflows/ci.yml` — nenhum dos dois na minha
`posse:` — e `tests/unit/test_portao_a_lista_de_portoes_e_uma_so.py` compara as
duas listas nos dois sentidos. O portão da paridade já roda na camada rápida do
`portoes.sh` (linha 93) e no `ci.yml` (linha 313). O cruzamento entrou nele, e a
lista de portões desta casa continua sendo UMA.

### 2. A ponte é declarada; o VEREDITO é lido

Medido hoje, e é o fato que decide a forma: **zero** dos 396 `sinal` da paridade
contém uma das 110 `chave` do mapa, em qualquer forma — substring, segmentos,
com ou sem acento. As duas planilhas não têm uma palavra em comum: o `sinal` é
um símbolo do código (`rumble_ff`, `data-volume="microfone"`), a `chave` é o
endereço de um canal do aparelho (`audio.microfone.mudo`). Uma régua que casasse
as duas por parecença de nome mediria a própria heurística.

Então `PONTES` declara *"esta fatia de tela anda sobre este canal"* — **e só
isso**. O que ela NÃO guarda é o fato: `aciona` e a causa saem do
`mapa-controles.csv` a cada execução, e a palavra *"esta feature é só no cabo"*
não está digitada em lugar nenhum. Três travas impedem a lista de virar
paisagem:

| trava | o que ela impede |
| --- | --- |
| `ponte-morta` (ponta da paridade) | a feature ser renomeada e a ponte virar decoração |
| `ponte-morta` (ponta do mapa) | a chave mudar de lugar e a régua deixar de conferir |
| `ponte-encolheu` (`PISO_DAS_PONTES = 26`, por `>=`) | alguém apagar uma ponte para calar o achado dela |

### 3. A metade que ela mandou existir: o mapa INFORMA, nunca VETA

`D-0609-O-MAPA-INFORMA-NUNCA-VETA`. Todo lado restrito cuja causa é
`nao-medido` sai como **AVISO impresso** e o `rc` continua ZERO. Não é
tolerância: é a leitura correta do dado — a célula está **atrasada**, não
fechada, e quem a remede é a bancada.

O cruzamento de hoje, nesta árvore:

| o que o mapa diz | pontes | o que o portão faz |
| --- | --- | --- |
| sustenta os dois transportes | 16 | nada; a régua se cala |
| restringe um lado, com causa | 7 | exige que a linha diga `cabo` ou `rádio` |
| `nao-medido` nos dois lados | 3 | **AVISO**, e `rc=0` |

### 4. As duas linhas que afirmavam paridade sem dizer onde — curadas com endereço

O portão nasceu **vermelho**, com dois achados reais. Os dois foram fechados
lendo o dono, nunca afrouxando a regra:

| linha | o que faltava | o que entrou, e de onde |
| --- | --- | --- |
| `02-controles` · *Alto-falante — o som de confirmação* | `audio.alto_falante@dualsense` é `cabo=parcial` / `rádio=não (divida)` e a linha não dizia transporte nenhum | **vale no CABO**: `tocar_confirmacao` recusa no degrau 3 sem sink, e o dono escreve a razão em `app/audio_saida.py:526-529` — *"pelo RÁDIO o DualSense não publica placa de som nenhuma (medido 15/08/2026: a placa segue o transporte)"*; `rota_do_no` (`:1622-1634`) recusa por rádio COM A FRASE |
| `02-controles` · *Microfone — o gesto do mudo (mic.set)* | `audio.microfone.mudo@dualsense` é `rádio=parcial (divida)` | vale nos DOIS (o canal é `hidraw` nos dois lados); o que o rádio restringe é a **duração** — `_mic_mute_desejado` é atributo de instância do handle (`core/backend_pydualsense.py:713`, escrito em `:1093`) e `_reapply_desired` (`:3640`) só repende os blocos de gatilho, então um `mic.set` evapora no handle novo, calado |

**As duas são leitura de código, e está dito na própria célula do CSV.** Nada
foi medido em aparelho por esta frente.

### 5. As duas linhas de veredito novo — medidas, e as duas continuam `FALTA_NO_HTML`

**`08-conexoes` · *Ambiguidade fina das ordens*.** Rodei o desenhista do cartão
do HTML com uma `Ordem` de verdade (`a08_conexoes._card_da_ordem`, alvo
`Identidade(vid=2357, pid=0604, caminho=3-1.2, ambigua=True)`):

* **com `destino`**, o cartão imprime `<span class="caixa">3-1.2</span>` — o
  endereço de barramento chega à tela e nomeia o aparelho sem ambiguidade
  possível, porque `caminho` é único por construção;
* **sem `destino`**, a receita inteira não sai e **nada** no cartão diz qual dos
  três `2357:0604` é o alvo.

E o próprio dono escreve que nas DUAS ordens desta máquina o `destino` é vazio
(`a08_conexoes.py:1285-1289`). Então a resposta **não chega à tela hoje**, e por
`D-0609-ADIAMENTO-NAO-E-REMOCAO` (*"se a resposta não chega à tela, é FALTA"*) a
linha continua `FALTA_NO_HTML`. **O que mudou foi a razão publicada**: sai *"a
ordem do HTML pode nomear o errado"* (falso — o `caminho` é único); entra *"o
HTML só nomeia o alvo quando a ordem tem destino, e as desta máquina não têm"*.
A dívida segue condicional — `ambigua` tem UM consumidor em toda a árvore
(`ordens_da_mesa.py:928`, dentro de `resposta_ao_ja_movi`), cujo único chamador
é `secao_exame.py:954`, o botão "Já movi" que ela mandou tirar em 31/08.

**`10-perfis` · *A caixinha "tirar este jogo do Steam Input"*.** Medido por
leitura desta árvore: o produto tem as DUAS pontas em
`integrations/steam_launch_options.py` — `add_appid_to_steam_input_allowlist` e
`remove_appid_from_steam_input_allowlist` — e `interface/` chama **só a
primeira**, uma vez, em `a07_lancadores.py:2161` (o gesto "Este jogo não
funciona", `D-0609-STEAM-DIVIDIDO`). A segunda tem **zero** chamadores em
`interface/`. A assimetria que a A-LISTA-QUE-FALTAVA-01 curou em 22/08 está de
volta na metade exata: marcar é um clique, desmarcar não existe. Continua
`FALTA_NO_HTML`, e não há transporte no meio — a lista é arquivo nosso, e o mapa
de canais não tem célula para ela.

### 6. Os arquivos

| arquivo | o que mudou |
| --- | --- |
| `scripts/check_paridade_gtk_html.py` | +291 linhas: `MAPA`, `PONTES`, `PISO_DAS_PONTES`, `sem_acento`, `diz_o_transporte`, `ler_mapa`, `cruzar_com_o_mapa`, `tabela_do_cruzamento`, `--cruzamento`, e o docstring das doze regras |
| `docs/data/paridade-gtk-html.csv` | 4 linhas, só na coluna `porque` — nenhum veredito, nenhum `sinal`, nenhum endereço |
| `docs/process/2026-09-03-O-TERCEIRO-NUMERO-a-paridade-com-a-gtk.md` | a §6.1 (o cruzamento), a tabela das regras e o `--cruzamento` no *Como usar* |
| `tests/unit/test_a_paridade_cruza_o_mapa_de_canais.py` | **nasce** — 27 casos |

---

## Qual mordida prova

**Três mordidas na árvore de verdade**, arrancadas, vistas reprovar e
devolvidas.

### Mordida 1 — apago a declaração de transporte da linha do som de confirmação

```
FALHA: 1 achado(s) em docs/data/paridade-gtk-html.csv.

  transporte-nao-declarado: [02-controles] Alto-falante — o som de confirmação
    veredito DIFERENTE, e o mapa restringe o canal audio.alto_falante@dualsense: cabo=parcial · radio=não (divida).
    A linha não diz 'cabo' nem 'rádio' em lugar nenhum — então ela afirma
    paridade sem dizer ONDE ela vale. Escreva o transporte no `porque`.
```

### Mordida 2 — arranco o escape do `nao-medido`, que é a decisão dela

Trocando `CAUSA_ATRASADA` por uma causa que não existe, o mapa deixa de informar
e passa a vetar. **É a mordida que importa**, porque é a que prova que a decisão
dela está viva no código e não só no comentário:

```
FALHA: 2 achado(s) em docs/data/paridade-gtk-html.csv.
  transporte-nao-declarado: [04-iluminacao] Mostrar o brilho corrente
  transporte-nao-declarado: [04-iluminacao] O BRILHO viaja junto com a cor
```

e, no portão do portão:

```
FAILED ...::test_os_dois_lados_nao_medidos_avisam_duas_vezes_e_nao_reprovam
FAILED ...::test_um_lado_nao_medido_e_o_outro_com_causa_so_cobra_o_segundo
FAILED ...::test_o_cruzamento_roda_verde_nesta_arvore
4 failed, 23 passed
```

### Mordida 3 — apago duas pontes para calar o achado do brilho

```
  ponte-encolheu: a ponte com o mapa tem 24 entrada(s) e o piso é 26.
    Apagar uma ponte é calar o achado dela, não resolvê-lo. Se a feature
    saiu do CSV, a ponte sai junto E o piso desce, no mesmo commit e com a razão escrita.
```

### A cura devolvida

```
portão rc=0
27 passed in 0.49s
```

### E a régua sabe NÃO reprovar — o outro lado da mordida

O portão do portão prova as duas metades. Além das três acima, os casos que
provam que ela **aceita quem está certo** (uma régua que só sabe reprovar é tão
inútil quanto uma que só sabe passar):

* `test_o_mapa_que_sustenta_os_dois_transportes_nao_cobra_nada` — `sim` dos dois
  lados não cobra nada;
* `test_aceita_a_linha_que_nomeia_o_transporte` — `cabo`, `rádio` e `RÁDIO`
  passam. **Acento e caixa não podem desligar a régua**: é o defeito que esta
  casa pagou onze vezes, *a régua desliga exatamente quando alguém escreve bem*;
* `test_crescer_passa_e_o_piso_nao_pune_quem_melhora` — a comparação é `>=`;
* `test_so_quem_afirma_paridade_e_cobrado` — `FALTA_NO_HTML` já é dívida
  declarada; cobrar transporte dela seria acusar duas vezes;
* `test_a_palavra_usb_nao_conta_como_transporte` e
  `test_uma_palavra_que_contem_cabo_nao_declara_nada` — o glossário é
  cabo/rádio, e `acabou` não é `cabo`;
* `test_o_mapa_ausente_e_falha_e_nao_silencio` — régua que se cala quando a
  fonte some é régua que dá verde sobre nada.

---

## O que NÃO verifiquei

1. **Não toquei em aparelho, e não pedi a bancada.** A sprint é `bancada: false`
   e nada aqui escreve num controle. **Toda medição desta entrega é LEITURA DE
   CÓDIGO** — dito na cara porque a diferença importa: eu li o dono e o mapa; eu
   não ouvi o alto-falante nem vi a barra acender.
2. **Não abri janela nenhuma.** Nenhuma foto, nenhum clique, nenhuma ponte JS —
   o trabalho é de duas planilhas e de um portão que não renderiza nada. A tela
   dela não recebeu um pixel desta frente.
3. **Não conferi as 370 linhas restantes da paridade contra o mapa.** A ponte
   tem 26 entradas, e a escolha é declarada: entram as fatias de tela que
   **andam sobre um canal do aparelho**, nunca as que parecem. As outras não
   estão isentas — estão **sem ponte**, e o piso existe para que a lista só
   cresça.
4. **Não medi se as três linhas do brilho funcionam no aparelho.** Elas AFIRMAM
   paridade e a célula `luz.lightbar.brilho@dualsense` diz `aciona=não` nos dois
   lados com causa `nao-medido`. Pela ordem de precedência, o aparelho ganharia
   do mapa — mas eu não perguntei ao aparelho. É aviso, e é fila.
5. **Não conferi as pontes contra `@pro`, `@sn30` ou os outros controles.** Há
   teste exigindo que toda ponte termine em `@dualsense`, e é decisão: a tela
   desta casa é do DualSense.
6. **Não rodei a suíte inteira.** Rodei o meu escopo (os dois arquivos de teste
   da paridade) e os portões.

---

## O que sobrou para o próximo

### Para a SPECS-A-PROCEDENCIA-01 — as células que este cruzamento nomeia

`scripts/check_paridade_gtk_html.py --cruzamento` imprime a ponte inteira. O que
ela pede, por `chave`:

| `chave` do mapa | o que a tela AFIRMA | o degrau que falta |
| --- | --- | --- |
| `luz.lightbar.brilho@dualsense` | três linhas de `04-iluminacao` afirmam paridade: o trilho de 0 a 100 grava o `lightbar_brightness` no perfil em disco e **reenvia a cor com o brilho novo** | `cabo_aciona` e `radio_aciona` estão `não` com causa `nao-medido` nos DOIS lados, e `ate_onde_foi` vazio nos dois. **Ninguém remediu.** O gesto existe e é clicável |
| `audio.alto_falante@dualsense` | duas linhas de `02-controles` (o som de confirmação e "Todo o som do PC") | `cabo=parcial` sem causa e `radio=não (divida)`. O cabo nunca subiu de `parcial`, e o produto toca ali todo dia |
| `audio.microfone.mudo@dualsense` | `IGUAL` no gesto do mudo | `radio=parcial (divida)` por MIC-BT-DONO-01, que segue **proposta**. O defeito é do daemon e alcança os dois lados |

### Para a PARIDADE-REMEDIR-02 — o texto das quatro linhas

Nenhuma das quatro mudou veredito, `sinal`, `sinal_espera`, `sinal_escopo` nem
endereço. **Só a coluna `porque` cresceu**, nas quatro. Se a REMEDIR-02 reescrever
alguma delas, o que não pode se perder é:

* *Alto-falante — o som de confirmação* → a frase **vale no CABO** com o
  endereço `app/audio_saida.py:526-529`;
* *Microfone — o gesto do mudo (mic.set)* → **vale nos dois**, e o rádio
  restringe a DURAÇÃO (`backend_pydualsense.py:713 · :1093 · :3640`);
* *Ambiguidade fina das ordens* → a premissa velha é FALSA e a razão nova é
  medida (`a08_conexoes._card_da_ordem` com e sem `destino`);
* *A caixinha "tirar este jogo do Steam Input"* → o `remove_appid_...` tem ZERO
  chamadores em `interface/`.

### Para quem crescer a ponte

Cada entrada nova de `PONTES` sobe o `PISO_DAS_PONTES` no mesmo commit. Os
candidatos que EU deixei de fora por não ter medido o suficiente para afirmar
que a fatia de tela anda sobre o canal:

* `luz.led_jogador.escrita_hefesto@dualsense` (`cabo=sim`, `radio=parcial`, sem
  causa) → as linhas das cinco luzes de jogador, em `04-iluminacao`;
* `luz.replica_output_jogo@dualsense` (`cabo=sim`, `radio=parcial`) → a réplica
  do output do jogo;
* `plataforma.udev_autosuspend@dualsense` (`cabo=sim`, `radio=não`,
  `nada-a-acionar`) → não achei linha de paridade que ande sobre ele;
* `movimento.giroscopio.taxa@dualsense` (`parcial` nos dois) → a linha do
  giroscópio espelhado *"fluindo para o jogo (~N Hz)"*, que publica um número.

### O que este trabalho NÃO resolve, e é honesto dizer

O portão responde *"a linha DIZ em que transporte ela vale?"*. Ele **não**
responde *"o que ela diz é verdade?"* — para isso é preciso o aparelho, e a
linha de prova é da MESA-DE-QUATRO-01. Uma linha que escrevesse `cabo` errado
passaria por aqui sorrindo. É a mesma fronteira que o cabeçalho do portão já
declarava para o resto dele, e ela não encolheu.
