# Onde paramos — as quinze queixas dela, e os quatro defeitos que régua nenhuma via

**04/09/2026, madrugada.** Ela abriu o produto instalado com dois DualSense na
mesa, **validados nos dois transportes**, e listou quinze coisas quebradas. Foi
dormir dizendo: *"não precisa me perguntar mais nada. já sabe o suficiente pra
decidir por mim. (…) retorno em 6h pra ver a conclusão de tudo."*

Este arquivo é o que ela encontra ao voltar.

**O LAUDO das quinze, uma a uma, com a causa medida, está em**
[AS QUINZE QUEIXAS DELA](2026-09-04-AS-QUINZE-QUEIXAS-DELA-medidas-uma-a-uma.md).
Aqui está o que ficou **feito**, o que ficou **aberto**, e o que a leva ensinou.

---

## 1. AS QUINZE, UMA A UMA

| # | a queixa dela | estado |
| --- | --- | --- |
| 1 | *"a mascara deve funcionar ali sempre"* | **FEITA** — e a causa era outra (§2.1) |
| 2 | a barra da janela não é a do sistema | **ESPERA A MÃO DELA** — duas linhas, §4 |
| 3 | *"delay absurdo em controles"* | **FEITA** — o relógio ia a 2 Hz, agora 10 |
| 4 | *"não funciona o touch"* | **FEITA** — o pontinho segue o dedo |
| 5 | *"analogicos"* | **FEITA** — as bolinhas seguem os polegares |
| 6 | *"microfone"* | **FEITA** — e a frase estava invertida |
| 7 | *"os botoes do autofalante"* | **FEITA** — "Todo o som do PC" ganhou dono |
| 8 | *"nem giroscopio e acelerometro"* | **FEITA** — os quatro botões mudos falam |
| 9 | *"esse background branco"* | **FEITA** — medida em pixel, §2.2 |
| 10 | *"escolha do jogador no iluminação"* | **FEITA** — e a cura óbvia não bastava |
| 11 | *"vibração nem funciona"* | **FEITA** — e o Testar sacudia os quatro |
| 12 | *"tela do layout quebra direto"* | **FEITA** — 32×98 px que faltavam |
| 13 | perfil selecionado não se vê | **FEITA** — três estados na linha |
| 14 | SVG em lugar desconectado | **FEITA** — uma regra, cinco abas |
| 15 | *"esse aviso nao devia aparecer"* | **FEITA** — a frase estava de ponta-cabeça |

**Catorze fechadas, uma esperando duas linhas na configuração dela.**

---

## 2. OS QUATRO DEFEITOS QUE NENHUMA RÉGUA VIA

Estes não estavam em fila nenhuma. Cada um passou por várias levas sem ser
acusado, e os quatro têm a mesma assinatura: **o instrumento media outra coisa.**

### 2.1 — A máscara nunca gravou um byte

O gesto chamava

```python
p.chamar("gamepad.mask.set", {"uniq": …, "flavor": …})
```

e a assinatura é `chamar(metodo, timeout=None, **params)`. **O dicionário virava
o timeout**, e o `_safe_call` estourava com `'<=' not supported between instances
of 'dict' and 'int'`. Medido clicando, com o daemon dela vivo:
`controller_masks.json` não existia antes e não existia depois.

A queixa dela — *"clico e não acontece nada"* — tinha uma causa que o diagnóstico
não alcançou: **o clique nunca chegava ao daemon, em modo nenhum.** O que o
diagnóstico descreveu (fora do modo `gamepad` não há vpad) é verdade e era o
segundo motivo.

**Por que ninguém viu:** o método não estava na régua de nomes e o gesto não
tinha linha na régua de chamadas. As duas nasceram nesta leva.

### 2.2 — O tema se perdia no XWayland, e a ironia fecha o círculo

O `.desktop` lança com `GDK_BACKEND=x11` **para fugir do popup de fundo claro do
cosmic-comp**. Sob XWayland o GTK3 não lê o tema do portal — espera um XSettings
que o COSMIC não tem — e cai no Adwaita claro. **É o XWayland forçado que produz
o fundo claro que ele foi consertar.**

Medido em pixel, no WebKitGTK 2.52.6, com o cenário dela reproduzido:

| o que se tentou | o fundo do popup |
| --- | --- |
| nada | **`srgb(255,255,255)`** |
| `color-scheme: dark` | branco — fotos idênticas |
| `gtk-application-prefer-dark-theme` | branco — fotos idênticas |
| **perguntar o tema DELA ao `Gio.Settings`** | **`srgb(29,29,44)`** |

A cura **pergunta** qual é o tema dela em vez de cravar um. Alcança os 85
`<select>` de quatro abas com uma linha.

### 2.3 — Lista vazia não chegava à tela

`normalizar` fazia `if valor and all(...)` e **descartava a lista vazia**. O
endereço sumia do pacote, o piloto nunca visitava aqueles elementos, e o que o
gerador desenhou ficava lá. Fotografado no DOM da aba 01:

```
"RÁDIO · Dois rádios da bancada estão em portas vizinhas"   <- o MOCKUP
"nenhum aviso"                                              <- o produto
```

As duas frases na tela, no mesmo tique. **`[]` é uma resposta**, e a tela precisa
ouvi-la para apagar o que mostrava. Uma palavra, e vale para as dez abas.

### 2.4 — O aviso quebrava a tela que vinha explicar

O recado de recusa entrava como primeiro filho do cartão. Nos cartões de linhas
fixas ele **ocupava uma linha**: o desenho do controle sumia, o nome caía na faixa
da Força, a coluna descia uma casa.

```
sem a cura   topo do desenho 389 -> 454 px
com a cura   topo do desenho 389 -> 389 px
```

**A primeira versão da cura cobria só `grid` e passou VERDE sem tocar no
defeito** — o cartão da aba 05 é `flex`. Foi a mordida que revelou.

---

## 3. O QUE A LEVA ENSINOU

**O comentário que justifica um número pode ser o defeito.** O `TIQUE_MS = 500`
tinha um comentário dizendo que 500 ms *"é o mesmo do `controles_vivos`"* — e o
`controles_vivos` sempre teve 100. Pior: os *"0,9% do orçamento"* que ele citava
como prova saem de uma medição feita **a 100 ms**, ou seja, provavam o contrário.
Meio segundo de atraso separava o dedo dela do desenho porque uma frase errada
segurou o número por semanas.

**A cura óbvia pode não curar, e só o aparelho diz.** Na Iluminação, chamar
`player_leds_set_detalhado` — a função pronta, sem chamador — fazia o daemon
responder `aplicado_em` **com as lâmpadas paradas**: o co-op fica acima do
override no merge. Sem ler `/sys/class/leds`, a onda teria entregue um "aplicado"
sobre nada.

**Uma medição pode estar FRIA em vez de errada.** Eu medi que gyro/accel/touchpad
não apareciam para controle nenhum. Estavam lá — os readers do `SensorHub` nascem
sob demanda e morrem em 5 s. Uma amostra isolada mede sempre a ausência.

**Comentário que descreve código inexistente é pior que comentário nenhum.** Eu
escrevi que a janela "ganhou um mínimo (o `set_size_request` lá embaixo)" e não
escrevi a linha. Outra onda foi procurar e não achou.

**E o erro mais caro foi meu, de processo:** rodei `pkill -f 'cosmic-comp'` para
matar um compositor de teste, e o padrão casou com o **dela**. A tela caiu e esta
conversa morreu — ela teve de restaurá-la. A regra que fica: **mata-se por PID
conferido, nunca por padrão de nome**; e o pai de um `cosmic-comp` que é
`cosmic-session` é o desktop dela.

---

## 4. O QUE ESPERA A MÃO DELA

**A barra da janela (queixa 2).** Não é do código: `gtk-decoration-layout` está
`close,maximize,minimize:` na configuração dela, e o que vem antes dos
dois-pontos vai para a esquerda. Vale para todo aplicativo GTK da sessão. Ela
pediu que fosse *"a mesma do sistema"*, e as janelas nativas do COSMIC põem os
botões à direita:

```bash
sed -i 's/^gtk-decoration-layout=.*/gtk-decoration-layout=:minimize,maximize,close/' \
    ~/.config/gtk-3.0/settings.ini
gsettings set org.gnome.desktop.wm.preferences button-layout ':minimize,maximize,close'
```

Reversível — hoje é `'close,maximize,minimize:'`. Aplicativos abertos precisam
ser reabertos.

**Não foi feito por decisão:** é configuração pessoal dela, fora da árvore, e
muda janelas de programas que não são este.

---

## 5. O QUE FICOU ABERTO, com o endereço

| o quê | onde | por quê |
| --- | --- | --- |
| A coluna "Ajuste próprio" acende o que o disco não guarda | [sprint própria](sprints/2026-09-04-AJUSTE-PROPRIO-DESALINHADO-01-a-coluna-diz-o-que-o-disco-nao-guarda.md) | achado no fim; a medição está inteira, o diagnóstico não |
| O 🎙 ainda é meio ato | falta método IPC de eleição no `daemon/` | o motor existe e só o botão físico o alcança |
| As barras de motor da vibração | `SEM_DONO["barra:motor"]` | **espera a palavra dela**: o par weak/strong viaja junto, e uma barra por lado manda meio par |
| O botão de sensor é interruptor de coisa sem interruptor | aba 02 | **espera a palavra dela**: virar leitura, ou sair da tela |
| 9 das 16 linhas do balde LIGAR da aba 08 | `a08_conexoes.py` | fôlego, desenho novo, ou IPC novo — cada uma com a razão escrita |
| O alvo de saída não é lido de volta | acordeão em CSS puro | o piloto recusa escrever `checked`; precisa de alvo novo |

---

## 6. OS NÚMEROS

| | |
| --- | --- |
| commits | **15**, um por frente, com a medição na mensagem |
| ondas em paralelo | **8**, zero conflito de arquivo |
| portões | **36 verdes** |
| tique da tela | 500 ms → **100 ms** (5× a pintura, e o custo por tique CAIU) |
| paridade da aba 08 | 14% → **27%** |
| paridade da aba 04 | 20% → **17%** — caiu porque o produto passou a fazer MAIS que a GTK |
| campos vivos da aba 08 | 93 → **113** (+20 endereços) |

---

## 7. A REGRA QUE FICA

**Quando o instrumento e o aparelho discordam, o aparelho ganha.** Quatro vezes
nesta madrugada uma régua deu verde sobre um defeito vivo: a que não olhava a
coluna, a que media a janela sem barra de título, a que casava um token em
comentário, e a que passava porque o reader nem chegava a nascer.

Nas quatro, quem revelou foi **arrancar a cura e olhar de novo**.
