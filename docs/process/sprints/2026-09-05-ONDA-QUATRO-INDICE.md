# ONDA QUATRO — as treze sprints das dezesseis decisões, medidas uma a uma

**05/09/2026.** Ela escolheu a fila das dezesseis decisões como a próxima onda.
Este índice mediu o que já existe antes de escrever qualquer coisa, e o
resultado inverte o enunciado do trabalho:

> **Doze das treze estão FEITAS. Uma está aberta. Nenhuma outra precisa de
> documento novo.**

A fila é a §2 de
[AS DEZESSEIS DECISÕES](../2026-09-04-AS-DEZESSEIS-DECISOES-DELA-e-as-sprints-que-nascem.md).
Ela foi executada entre 04 e 05/09 dentro das ondas 0, 1 e 2 desenhadas em
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) §4
— por isso doze delas **não têm documento com o próprio número**: elas foram
lotes dentro das frentes por POSSE DE ARQUIVO, que era a divisão certa.

**O que este índice acrescenta**, e é o que faltava: a prova de cada uma, lida
no código; a única que sobra, com sprint escrita; e **duas correções de fato**
que a medição derrubou.

---

## 1. AS TREZE, COM A PROVA

Toda prova abaixo é **arquivo:linha lido em 05/09/2026** nesta árvore. Nenhum
teste foi executado — esta é uma medição de existência, não de verde.

| # | o que fecha | estado | a prova, lida |
| --- | --- | --- | --- |
| **S-01** | O canal de recado no cartão (D-01) | **FEITA** | `interface/hefesto_vivo.py:2218` `_deu_certo_dizendo` · `:158` `FRASE_DE_SUCESSO` · `:2317` o recibo vive menos que a recusa · régua: `tests/unit/test_o_recado_de_sucesso_pousa_no_cartao.py` |
| **S-02** | A linha de ressalva condicional (D-02) | **FEITA** | `interface/monta.py:1356` `def ressalva` · `:1297` `NADA_A_DIZER` · em uso na 04 (`interface/aba04.py:1136`), na 05 (`interface/pacotes/a05_vibracao.py:250`) e na 02 (`interface/pacotes/a02_controles.py:2129`) · régua: `tests/unit/test_a_linha_de_ressalva_so_nasce_quando_ha.py` |
| **S-03** | O botão cinza com a razão na dica (D-03) | **FEITA** | `interface/monta.py:1300` `def botao_cinza` — e a razão é o PARÂMETRO que decide o cinza (`:1313`), então não há caminho no código que pinte um sem o outro · régua: `tests/unit/test_o_botao_cinza_diz_a_razao.py` |
| **S-04** | Os lugares de aviso e as três frases órfãs (D-09, D-10) | **FEITA** | `interface/pacotes/a01_jogar.py:112` `AVISOS_VIVOS = 6` · `:124` `AVISOS_NA_COLUNA = 3` · `:147` `ORDEM_DA_GRAVIDADE` · `:161` a linha do `+N` · `:652` a frase da ponte · `:450` o cadeado · `:148` o selo `PAUSA` · régua: `tests/unit/test_a01_a_coluna_atencao_acende_o_mais_grave.py` |
| **S-05** | O microfone é um ato só (D-12) | **FEITA** | `interface/pacotes/a02_controles.py:2710` traz a D-12 por extenso e `:2738` a frase da meia-verdade · `:2289` a condição deixou de ser "só no rádio" · réguas: `tests/unit/test_a02_mic_e_um_ato_so_nos_dois_transportes.py`, `tests/unit/test_o_microfone_e_um_estado_so.py` |
| **S-06** | Deslizante de volume nos dois (D-08) | **FEITA** | `interface/pacotes/a02_controles.py:3030` `@gesto("02-controles.html", "volume")` · `:2259` registra que os dois ganharam peça e dono · `:3094` `mic_volume_set_detalhado` · réguas: `tests/unit/test_mic_volume_01_o_slider_que_faltava.py`, `tests/unit/test_a_aba_02_controles_fecha_as_linhas.py` |
| **S-07** | O interruptor do automático, gravando a cor (D-13) | **FEITA** | `interface/pacotes/a04_iluminacao.py:2529` `@gesto("04-iluminacao.html", "auto-cores")` · `:2606-2614` grava a cor de cada CONECTADO **antes** de desligar, que é a ordem da GTK · `interface/aba04.py:1191` o interruptor no topo · régua: `tests/unit/test_a_aba_04_iluminacao_fecha_as_linhas.py` |
| **S-08** | A linha de estado da vibração (D-14) | **REVOGADA POR ELA** | ver §3 |
| **S-09** | O veredito do Check-up e a quarta cor (D-16) | **FEITA** | `interface/pacotes/a08_conexoes.py:801` `_veredito_do_exame` · `:794-797` as QUATRO cores, com `veredito-nao-sei` entre elas · `:866` o pior achado decide · régua: `tests/unit/test_a08_o_veredito_e_a_mesa_de_radio_dela.py` |
| **S-10** | "cabo"/"rádio" pela função dona (D-05) | **ABERTA** | ver §2 |
| **S-11** | Casco fora, luz viva dentro (D-06) | **FEITA** | `interface/aba02.py:232` `.ctl.card > .anel-vivo` · `:206` a decisão dela verbatim · `:228` o raio 7 porque o anel mora dentro dos 2px do casco · régua: `tests/unit/test_a_aba_02_controles_fecha_as_linhas.py` |
| **S-12** | A frase da mesa vazia e o `+N` do quinto (D-07) | **FEITA** | `interface/pacotes/a01_jogar.py:180` `MESA_VAZIA` · `:445` o endereço `mesa-frase` · `:57` o endereço declarado · `:164` o `+N` · régua: `tests/unit/test_a01_a_mesa_vazia_fala.py` |
| **S-13** | Corrigir o CSV: o touchpad nunca foi conflito (D-15) | **FEITA** | `docs/data/paridade-gtk-html.csv:215` — a célula agora abre com *"NÃO HAVIA CONFLITO"*, cita a palavra dela e marca **FATO ERRADO SUBSTITUÍDO** |

**A D-04 e a D-11 não geram sprint** e continuam sem gerar: elas confirmam o que
o produto já faz, e o que mudou foi o dono da linha — passou a ser decisão dela,
não dívida.

## 2. A ÚNICA ABERTA — S-10, e ela é a última da fila de propósito

**[ONDA4-S10 · O TRANSPORTE](2026-09-05-ONDA4-S10-O-TRANSPORTE-01-cabo-e-radio-pela-funcao-que-ja-tem-dono.md)**

Ela sobrou porque **não era de nenhuma aba**: a palavra do transporte aparece em
quatro arquivos, e **dois deles são compartilhados pelas dez** —
`interface/mesa_viva.py` e `interface/pacotes/__init__.py`. Nenhuma das dez
frentes da Onda 2 podia tomá-la sem invadir a posse das outras. As doze que
fecharam couberam todas dentro de uma posse; esta não cabe.

**E a medição achou mais do que o enunciado dizia.** A §2 das dezesseis a
descreve como *"1 linha, e mata uma cópia"*. São **quatro cópias, em dois
dialetos** — `interface/mesa_viva.py:343`, `interface/pacotes/__init__.py:895`,
`interface/pacotes/a01_jogar.py:358` e `interface/pacotes/a09_sistema.py:558`,
esta última **já na língua dela**. O próprio código guarda a foto do estrago
(`interface/pacotes/a09_sistema.py:505-538`, mesa dela de 03/09): a fita diz
`P1 · White · USB` e o painel logo abaixo diz `P1 · White · cabo`.

**A armadilha, e ela decide o desenho da cura:** três lugares COMPARAM a palavra
para contar (`interface/mesa_viva.py:369`,
`interface/pacotes/a07_lancadores.py:994`,
`interface/pacotes/a03_gatilhos.py:1811`). Trocar a palavra sem tocar neles faz
o cabeçalho dizer `0 USB · 2 BT` com os dois controles no cabo — errado, e
calado. A sprint separa a palavra da conta antes de trocar a palavra.

## 3. AS DUAS CORREÇÕES DE FATO QUE A MEDIÇÃO DERRUBOU

Esta casa substitui fato errado em vez de guardá-lo ao lado do certo. Duas
afirmações do documento das dezesseis caducaram, e as duas caducaram **por
palavra dela**, não por engano de quem escreveu.

### 3.1 · A D-14 foi REVOGADA por ela, no dia seguinte

A D-14 mandava *"uma linha de estado por coluna"* na aba Vibração. **Ela mudou
de ideia em 05/09/2026**, e a razão está registrada em
`interface/pacotes/a05_vibracao.py:713-716`, com as palavras dela:

> *"pq temos uma linha de estado se o estado em vibração sempre vai ser o jogo mandando os input pro controle e a gnt aumentando eles ou diminuindo? remove ela não faz sentido"* <!-- noqa-acento: citação literal dela -->

O campo `trava` saiu **com o endereço junto**, e a faixa "Estado" da grade saiu
com ele — emitir um campo para uma página sem `data-campo` correspondente é
escrita em lugar nenhum, calada.

**E a medição deu razão a ela pelo caminho que ela usa** (mesma nota, `:718-724`):
os dois estados "travada" exigem `rumble_active` armado, e **os dois gestos
desta aba terminam em `rumble_passthrough(True)`** — `testar` e `parar` —, que o
solta. Nesta tela a faixa dizia sempre *"o jogo controla a vibração"*, menos
pelo meio segundo do "Testar". **A linha por coluna era uma linha que só sabia
dizer uma coisa.**

O que sobra da D-14 é a linha de estado **da MESA**, no rodapé do quadro
(`interface/pacotes/a05_vibracao.py:757`), com a ressalva entrando pelo mesmo
emissor — um dono só para o desenho daquela linha.

**S-08 não tem trabalho a fazer, e não terá.** Não é dívida esquecida: é
decisão dela, com a medição atrás.

### 3.2 · A D-09 mediu QUATRO lugares; hoje a página tem SEIS

A §D-09 das dezesseis fecha o argumento com um `grep` que devolveu `4` para
`data-campo="aviso-selo"` em `interface/paginas/01-jogar.html`, e concluiu
*"zero pixel novo"*. **O mesmo `grep` devolve 6 hoje.**

O produto declara os dois números de propósito, e a distinção está escrita em
`interface/pacotes/a01_jogar.py:117-123`: `AVISOS_VIVOS = 6` é quantas linhas a
PÁGINA publica (endereço não move pixel) e `AVISOS_NA_COLUNA = 3` é quantas ela
ACENDE — que é a decisão dela, *"até três linhas, o mais grave em cima"*, com o
`+N` na terceira quando passar.

**A conclusão do documento continua de pé; o número que a sustentava, não.** O
argumento certo é o par de constantes, não o `grep`.

## 4. A ORDEM, E O QUE PODE CORRER EM PARALELO

**Não há ordem a executar: há uma sprint.** Este parágrafo existe porque a
próxima leva vai perguntar, e a resposta tem de estar escrita.

### O que S-10 possui, e por que ninguém corre ao lado dela

| arquivo | quem mais o abre | consequência |
| --- | --- | --- |
| `interface/pacotes/__init__.py` | **as dez abas** importam dele | **serializa tudo.** Nenhuma frente de aba pode correr enquanto S-10 estiver em voo |
| `interface/mesa_viva.py` | o piloto e as abas 01, 03, 07, 09 leem a mesa que ele monta | serializa as quatro |
| `interface/pacotes/a01_jogar.py` · `a02_controles.py` · `a03_gatilhos.py` · `a07_lancadores.py` · `a09_sistema.py` | posse das frentes ONDA2-01, 02, 03, 07 e 09 | por isso o `depois_de:` da sprint nomeia as cinco — **a colisão se serializa, não se proíbe** |
| `docs/data/paridade-gtk-html.csv` | toda frente que fecha linha | uma frente por vez neste arquivo, sempre |

**A regra que isso aplica é a mesma de 04/09:** a divisão é por POSSE DE
ARQUIVO, e duas frentes no mesmo arquivo é conflito garantido. `monta.py` é o
extremo — **18 módulos importam dele** —, e é por isso que ele está em
`nao_toca:` da S-10 mesmo tendo, ele também, uma cópia da contagem
(`interface/monta.py:1578-1579`). O que a S-10 encontrar lá, **ela relata**.

### As esperas do plano

**Uma só, e ela já está paga:** S-10 espera as cinco frentes de aba cujos
arquivos ela entra, e as cinco fecharam em 04/09. **A sprint está livre para
correr agora.**

**Não há espera de publicação.** Nenhum pixel novo, nenhuma altura nova,
nenhum `--publicar`, nenhum mockup a republicar — foi assim que ela sobrou
sendo, das treze, a mais barata de desenho e a mais cara de leitura.

### Se a leva for maior que esta sprint

Uma segunda frente pode correr em paralelo **desde que não abra
`interface/pacotes/__init__.py` nem `interface/mesa_viva.py`**. Na prática isso
exclui as dez abas e o piloto, e sobra o que vive fora da interface: o daemon,
o motor, os documentos. A fila de onde tirar isso é a das **54 decisões que ela
ainda não viu** (`2026-09-04-DECISOES-DELA-01-jogar.md` até
`2026-09-04-DECISOES-DELA-10-perfis.md`), e ela é da conversa com ela, um ponto
por vez — não de agente.

## 5. ANTES DE FECHAR

```bash
git add -A                       # os portões são cegos a arquivo novo
bash scripts/portoes.sh          # sem argumento; o --rapido não roda os que pegam isto
```

E a validação de tela, que não é opcional quando o trabalho toca a interface:
**foto `--oculta` antes e depois, o clique, e a mordida.** Ela tem UMA tela.
O contrato está em [COMO-OLHAR-A-TELA.md](../COMO-OLHAR-A-TELA.md); o papel de
quem reger a leva, em
[COMO-COORDENAR-UMA-LEVA.md](../COMO-COORDENAR-UMA-LEVA.md).

**O estado em que este índice foi escrito:** a onda 3 fechou no mesmo dia e
deixou 24 testes vermelhos, cujas famílias estão em
[ONDE PARAMOS · a onda três](../2026-09-05-ONDE-PARAMOS-a-onda-tres-e-as-reguas-que-mediam-o-mundo-de-ontem.md).
**Eles não são desta onda**, e a S-10 não os toca — mas quem rodar a suíte vai
encontrá-los, e é melhor saber disso antes do que depois.
