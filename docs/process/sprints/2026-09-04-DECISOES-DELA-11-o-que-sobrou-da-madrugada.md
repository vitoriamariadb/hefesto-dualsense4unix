# Decisões dela — o que sobrou da madrugada das quinze queixas

**04/09/2026, meio-dia.** Ela pediu: *"manda as duvidas em opções"*. São as <!-- noqa-acento: citação literal dela -->
cinco que a madrugada deixou esperando a palavra dela, no formato das dez listas
por aba: opções, custo em linhas de tela, recomendação primeiro.

**RESPONDIDAS NA MESMA TARDE**, no chat, em uma mensagem: `1-a`, a 2 e a 3
com um conceito próprio — **fora das opções, e nas duas a pergunta é que
estava errada** —, `4 tudo`, `5-a`. Cada resposta está no fim da sua
pergunta, com a sprint que nasceu. O que ela JÁ decidiu ao meio-dia — o microfone
como um estado só, e o alto-falante com os dois canais da GTK — **não está aqui**:
virou sprint direto (`MICROFONE-UM-ATO-01`, `ALTO-FALANTE-DOIS-CANAIS-01`) e está
na fila do [`SPRINT_ORDER.md`](../SPRINT_ORDER.md), §-1.

**5 decisões · 2 de peso alto**

---

## [01] A barra da janela: mudo só o Hefesto, ou a sessão inteira?

**Peso:** média

Os botões fechar/maximizar/minimizar estão à ESQUERDA porque a configuração
dela diz `gtk-decoration-layout=close,maximize,minimize:` — e o que vem antes
dos dois-pontos vai para a esquerda. Isso vale para todo aplicativo GTK da
sessão, e as janelas nativas do COSMIC põem os botões à direita. O handoff da
madrugada deixou as duas linhas para ela rodar; havia uma terceira saída que
não foi oferecida.

| opção | o que acontece | custo |
| --- | --- | --- |
| **Só a janela do Hefesto** | O produto pede ao GTK, dentro do próprio processo, `Gtk.Settings.get_default().set_property("gtk-decoration-layout", ":minimize,maximize,close")` — ao lado de onde ele já pede o tema (`app/theme.py`, `adotar_o_tema_da_sessao`). Nenhum outro aplicativo muda. | Uma linha no código, zero na configuração dela. Se um dia ela mudar a sessão inteira, a janela do Hefesto já está igual. |
| **A sessão inteira, pelas duas linhas** | `sed` no `~/.config/gtk-3.0/settings.ini` e `gsettings set org.gnome.desktop.wm.preferences button-layout` — as duas do handoff, §4. Todo GTK da sessão passa a ter os botões à direita. | Dois comandos dela, reversíveis. Muda janelas de programas que não são este. |
| **Fica como está** | Os botões continuam à esquerda no Hefesto e em todo GTK. | Zero. A queixa 2 fica aberta. |

**Minha recomendação:** Só a janela do Hefesto — resolve a queixa dela sem tocar
em programa que não é nosso, e é a mesma forma da cura do tema: o produto
PERGUNTA a sessão e se ajusta, em vez de exigir que a sessão se ajuste a ele.

**Fecha:** a queixa 2 da madrugada, a única das quinze que ficou aberta.

**ELA DECIDIU:** `1-a` — só a janela do Hefesto. Sprint: [BARRA-DA-JANELA-01](2026-09-04-BARRA-DA-JANELA-01-os-botoes-do-lado-do-sistema.md), destravada.

---

## [02] As barras de motor da vibração: uma barra manda o par, ou viram leitura?

**Peso:** alta · **Depende de:** nada no motor — `rumble.set {weak, strong}` já existe pela ponte (`app/telas/vibracao.py:155`).

A aba 05 desenha duas barras por controle, uma para cada motor (fraco e forte),
e as duas são só leitura: `SEM_DONO["barra:motor"]`
(`interface/pacotes/a05_vibracao.py:64`). A razão está escrita no dono da GTK:
*"o par é da MESA, e os dois valores viajam JUNTOS: não há como mandar um lado
só"*. Arrastar a barra do motor fraco mandaria `rumble.set` com o forte em
que valor? A pergunta é essa, e ela é de desenho.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Cada barra manda o par, com o outro lado no valor que está** | Arrastar o fraco manda `{weak: novo, strong: o que a tela mostra}`. As duas barras ganham dono, e o par viaja inteiro. | Zero linha nova. O valor "que está" tem de vir do último `rumble.set` que o Hefesto mandou — o daemon não lê o motor de volta. Um `rumble.stop` do jogo entre o olhar e o arrastar mandaria um forte velho. |
| **Uma barra só, que manda os dois iguais** | As duas barras viram uma, "Vibrar a", e o arraste manda `{weak: v, strong: v}`. É o que o botão Testar já faz com um valor fixo. | Uma barra a menos por card (ganha ~20px). Perde a leitura separada dos dois motores. |
| **As duas ficam leitura, e é isto** | Nada muda. As barras mostram o que o Hefesto mandou por último; quem quer sentir o motor usa Testar. | Zero. O `SEM_DONO` fica declarado com a razão, como está. |

**Minha recomendação:** Cada barra manda o par, com o outro lado no valor que
está — é a única em que a tela faz o que o desenho promete (duas barras que se
arrastam), e o risco do "forte velho" se cobre com a régua que já existe para
o Testar.

**Fecha as linhas:** *As barras de motor — `SEM_DONO["barra:motor"]`* · a linha
"barra:motor" do `paridade-gtk-html.csv`.

**ELA DECIDIU — fora das três:** *"os slcers do botão esquerdo e direito (forte e fraco) se multiplicam (interagem com os botões economia, moderado,máximo, se eu tiver 150% do perfil de vibração e as duas linhas estiverem 100 entao a vibração dos 2 será 150%, mas se so a do motor fraco tiver 100 e a outrqa 50% então será 150 em um e 75% no outro entende?"* <!-- noqa-acento: citação literal dela -->

A barra não manda `rumble.set` — **é política**: um multiplicador por motor que compõe com o degrau. A pergunta "manda agora ou vira leitura" estava errada. Sprint: [VIBRACAO-POR-MOTOR-01](2026-09-04-VIBRACAO-POR-MOTOR-01-as-duas-barras-multiplicam-o-degrau.md).

---

## [03] O botão de sensor da aba 02: vira leitura, ou sai da tela?

**Peso:** alta

Os botões Giroscópio e Acelerômetro de cada card são interruptores — e não há
interruptor: `daemon.metodos()` não traz `sensor.*`, o `sensor_hub` só LÊ, e o
`profiles/schema.py` diz que os dois estão *"fora por ausência, não por
decisão"*. Desde a madrugada eles **recusam dizendo** (gesto `sensor`,
`interface/pacotes/a02_controles.py:1861`), em vez de falhar no stderr. O
`title` deles já diz o que são de verdade: *"Ligado: o jogo recebe o giro deste
controle"* — uma leitura.

| opção | o que acontece | custo de tela |
| --- | --- | --- |
| **Vira leitura: um selo "no ar" / "parado"** | O mesmo lugar, sem clique. Aceso quando o `sensor_hub` está entregando dado daquele controle, apagado quando não. A moldura Giroscópio três linhas abaixo já mostra o valor; o selo diz se ele está chegando. | Zero linha nova: troca `<button>` por `<span>` no gerador e uma publicação da 02. O gesto `sensor` e a recusa dele morrem. |
| **Sai da tela** | Os quatro botões somem. A moldura com os eixos fica. | Ganha uma linha por card. Perde o único lugar que diz "este controle está publicando giro" sem ler número. |
| **Vira interruptor de verdade** | O daemon ganha `sensor.set {uniq, giroscopio, acelerometro}`: com o sensor desligado, o `sensor_hub` para de abrir o reader daquele controle e o vpad deixa de publicar o nó de movimento. | Motor novo no daemon (um método, um flag por controle no perfil, o `sensor_hub` obedecendo). É a única das três em que o botão faz o que o desenho promete. |

**Minha recomendação:** Vira leitura — é o que o `title` já promete e é o que o
produto sabe fazer hoje. Se um dia o desligar tiver razão de existir (um jogo que
enlouquece com giro), a terceira volta como sprint com o motivo medido.

**Fecha as linhas:** *O botão de sensor é interruptor de coisa sem interruptor*
(handoff da madrugada, §5).

**ELA DECIDIU — a terceira, e mais:** *"ele tem que funcionar de verdade. ambos independente do modo e da mascara."* <!-- noqa-acento: citação literal dela -->

Interruptor de verdade, cada sensor por si, em Nativo e Virtual, com ou sem máscara. Sprint: [SENSOR-DE-VERDADE-01](2026-09-04-SENSOR-DE-VERDADE-01-giro-e-acelerometro-desligam-em-qualquer-modo.md) — que começa MEDINDO por onde o jogo lê o giro em cada modo.

---

## [04] As nove linhas LIGAR da aba 08 que não fecharam: fôlego, desenho, ou IPC?

**Peso:** média

Das 16 linhas do balde LIGAR da `08-conexoes`, a onda da madrugada fechou 7. As
outras 9 estão no `a08_conexoes.py` com a razão de cada uma, e as razões são de
três tipos: **fôlego** (o dado existe nos dois lados, faltou tempo), **desenho**
(a página não tem onde escrever — precisa de endereço novo e publicação), e
**IPC** (o daemon não publica o dado no `state_full`).

| opção | o que acontece | custo |
| --- | --- | --- |
| **Só as de fôlego, agora** | Uma onda de uma pessoa, sem decisão nenhuma dela, fecha as que só precisam ler e endereçar. | Zero tela nova. As de desenho e IPC ficam declaradas. |
| **Fôlego + desenho, com a 08 republicada uma vez** | As de desenho ganham endereço no mockup, ela aprova uma vez, e as duas famílias fecham juntas. | Uma publicação da 08 para ela olhar. |
| **As três famílias, com os métodos novos no daemon** | Inclui o `state_full` publicando o que falta. A aba 08 fecha inteira no balde LIGAR. | Código no daemon e `install.sh` para valer. |

**Minha recomendação:** Só as de fôlego, agora — é trabalho, não decisão, e não
deve esperar as outras duas.

**Fecha as linhas:** *9 das 16 linhas do balde LIGAR da aba 08* (handoff, §5).

**ELA DECIDIU:** *"tudo"* — as três famílias. Sprint: [CONEXOES-LIGAR-TUDO-01](2026-09-04-CONEXOES-LIGAR-TUDO-01-as-dezesseis-linhas-nas-tres-familias.md).

---

## [05] O alvo de saída do alto-falante não é lido de volta: alvo novo no pintor, ou o acordeão muda?

**Peso:** média

O acordeão da aba 02 é CSS puro: abre com um `<input type="checkbox">` e o
piloto **recusa** escrever `checked` — não é nenhum dos nove alvos do pintor
(texto·largura·fundo·valor·html·classe·cor·plastico·atributo). Resultado: o
que o daemon diz sobre a saída do alto-falante não tem como chegar ao
acordeão, e ele nasce sempre fechado.

| opção | o que acontece | custo |
| --- | --- | --- |
| **Décimo alvo: `marcado`** | O pintor ganha `data-hef-alvo="marcado"`, que escreve `el.checked`. Vale para todo checkbox e radio das dez abas. | Umas 5 linhas no `hefesto_vivo.py`, e a régua de alvos ganha uma linha. |
| **O acordeão vira classe** | Sai o checkbox; abre/fecha por `classe`, que o pintor já escreve. | Muda o CSS do acordeão na 02 e uma publicação. Não resolve o próximo checkbox. |
| **Fica fechado** | Nada muda. | Zero. O estado da saída continua sem chegar à tela por ali. |

**Minha recomendação:** Décimo alvo `marcado` — é o único que paga uma vez e
vale para as dez abas.

**Fecha as linhas:** *O alvo de saída não é lido de volta* (handoff, §5).

**ELA DECIDIU:** `5-a` — o décimo alvo `marcado`. Sprint: [PINTOR-MARCADO-01](2026-09-04-PINTOR-MARCADO-01-o-decimo-alvo.md).
