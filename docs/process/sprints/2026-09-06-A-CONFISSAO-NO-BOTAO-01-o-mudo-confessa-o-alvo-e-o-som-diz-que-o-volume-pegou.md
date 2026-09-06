---
sprint: A-CONFISSAO-NO-BOTAO-01
estado: feita
onda: F
decisoes: 02-Q8
posse:
  CONFISSAO:
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
    - src/hefesto_dualsense4unix/interface/pacotes/ponte.py
    - tests/unit/test_a02_som_e_sensor_falam_quando_recusam.py
    - tests/unit/test_a02_mic_e_um_ato_so_nos_dois_transportes.py
cria:
  - tests/unit/test_a02_o_botao_confessa_o_alvo_e_o_som_confirma.py
bancada: false
depois_de: [ONDA1-D1-O-SOM-01, ONDA2-02-CONTROLES-01, PARIDADE-REMEDIR-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/paginas/
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - mockup/
  - src/hefesto_dualsense4unix/app/
  - docs/data/paridade-gtk-html.csv
---

# A-CONFISSAO-NO-BOTAO-01 — o mudo confessa o alvo, e o som diz que o volume pegou

> **ESTADO 06/09/2026: feita** — os dois passos entraram, com as mordidas e a
> prova de tela em
> [`docs/process/agentes/2026-09-06/A-CONFISSAO-NO-BOTAO-01.md`](../agentes/2026-09-06/A-CONFISSAO-NO-BOTAO-01.md).
> **Duas coisas que esta sprint afirmava caíram na medição, e ficam aqui:** o
> corpo de `mic.canal.set` **não traz `por_uniq`** (só o `mic.volume.set` traz),
> então a confissão do Passo 1 entrou como trava armada e calada, com
> régua-estopim; e a frase *"o registrador de volume do DualSense não tem
> leitura"* virou **"não há leitura de volta hoje"** — `audio.leitura_de_volta`
> é `existe=desconhecido` no `docs/data/mapa-controles.csv`, com as duas colunas
> esperando a palavra dela. A condição de parada do Passo 2 foi medida e **não
> se aplicava**: o gesto já roda fora do tique.

**06/09/2026, ONDA F.** As duas metades nasceram do laudo da
`PARIDADE-REMEDIR-01`, que as achou fora da posse dela e não tocou em nenhuma.
São as duas linhas mais caras da aba 02 **para a bancada dos quatro desta
noite**, e é por isso que esta sprint existe hoje e não na fila de depois.

---

## 1. O QUE FOI MEDIDO, ANTES DE UMA LINHA SER ESCRITA

### 1.1 O deslizante do microfone confessa. O botão de mudo, não.

`a02_controles.py:3200`, no gesto `volume`, faz a coisa certa e escreve por quê:

```python
confissao = frase_do_alvo_do_mic(alvo_honrado(corpo))
if confissao:
    raise RuntimeError(confissao)
```

O `RuntimeError` é o único caminho que deposita frase no cartão **daquele**
controle, e é a decisão dela de 04/09 com todas as letras: *"vira aviso no
cartão, como as recusas"*.

**O gesto `mudo` não faz isso.** O ramo do microfone
(`a02_controles.py:2786-2818`) confere `corpo is None` e depois
`frase_do_ato_do_microfone(corpo)` — que é outra pergunta: ela separa *"o canal
foi eleito e o firmware ficou represado"* de *"o firmware obedeceu e não há
canal"*. **Nenhuma das duas é `alvo_honrado`.** Passadas as duas metades, o
gesto grava no perfil e devolve sucesso.

**O que isso vale na mesa cheia, e é a razão de a linha 58 do CSV existir:** um
mudo que caiu na rota global calou o microfone de OUTRA pessoa, e a tela pinta o
selo do cartão certo. *Aparece como sucesso.* Com um controle na mesa ninguém
percebe; com quatro, é a pessoa errada que fica muda e ninguém sabe por quê.

### 1.2 O alto-falante não tem leitura, e o som era o que dizia que pegou

A GTK toca `audio_saida.tocar_confirmacao(sink, saida_muda=…)`
(`app/widgets/controller_card.py:4599` e `:4628`) dentro do mesmo trabalho do
IPC, com três camadas anti-rajada. **O HTML não toca nada.**

**Não é enfeite, e a razão é do aparelho:** o registrador de volume do DualSense
**não tem leitura**. O número que a tela mostra é o que NÓS mandamos — não o que
o controle tem. Sem o som, ela arrasta o deslizante e **não tem como saber se a
mudança valeu**. É ideia dela, e o motor já existe: `app/audio_saida.py:505`,
com as recusas em degrau (desligado · ocupado · sem sink), a última das quais é
a única cara.

**A linha 88 ficou MAIS cara nesta leva, não menos:** o deslizante do
alto-falante nasceu agora (linha 82 do CSV, `data-volume="alto-falante"`), então
existe pela primeira vez um arrasto que não tem como se confirmar.

---

## 2. OS DOIS PASSOS

### Passo 1 — o `mudo` confessa o alvo, com a frase do dono

No ramo do microfone do gesto `mudo`, **depois** de `frase_do_ato_do_microfone`
e **antes** de `_lembrar_do_som`, perguntar ao mesmo dono que o `volume` já
pergunta: `frase_do_alvo_do_mic(alvo_honrado(corpo))`, e subir pelo canal da
recusa.

**A ordem não é livre, e o `volume` já escreve o motivo:** gravar antes da
confissão poria no `controllers[este]` um estado que este controle nunca teve.

**Zero texto de tela novo.** A frase é a do dono — se você digitar uma, a régua
da palavra reprova, e com razão.

- **A MORDIDA:** arranque a confissão e faça o daemon devolver o corpo com o
  alvo NÃO honrado. O teste tem de reprovar dizendo que o gesto voltou como
  sucesso.
- **A SEGUNDA MORDIDA, e é a que separa a cura da superstição:** faça o daemon
  devolver `alvo_honrado` **verdadeiro** e também **desconhecido** (`None`). O
  gesto **não pode** recusar em nenhum dos dois — `frase_do_alvo_do_mic`
  devolve `""` para os dois de propósito, e *"não sei" não é "não honrei"*.
  Inventar a confissão por ausência de notícia acusa o produto de um erro que
  ninguém mediu.

### Passo 2 — o som de confirmação volta, e o dono é o motor

Reusar `app/audio_saida.tocar_confirmacao` — **não reescrever**. O que esta
sprint constrói é o caminho até ele: quem sabe o sink daquele controle, e onde a
chamada entra sem segurar o tique de 100 ms.

**MEÇA ANTES DE ESCREVER**, e são três perguntas, nesta ordem:

1. **De onde vem o sink deste controle?** A GTK o tem à mão; o piloto não
   necessariamente. Se a resposta exigir um método novo na `ponte.py`, ele é seu
   — a `ponte.py` está na sua posse.
2. **Onde a chamada entra?** `tocar_confirmacao` é **bloqueante de propósito** —
   a docstring dele diz que quem chama é `ipc_bridge.run_in_thread`. **O tique
   do piloto é de 100 ms**, e uma chamada bloqueante dentro dele trava a tela
   dela. Se não houver caminho fora do tique, **PARE E RELATE** — meia cura aqui
   é pior que nenhuma.
3. **A chave dela desliga isso?** `tocar_confirmacao` já sai calado quando a
   chave está desligada. Respeite-a; não invente uma segunda.

- **A MORDIDA:** arranque a chamada e o teste reprova.
- **A SEGUNDA MORDIDA:** ponha `tocar_confirmacao` para levantar. **A gravação
  do volume não pode cair junto** — o som é confirmação, não pré-requisito, e um
  alto-falante mudo que impedisse o volume de mudar seria o defeito trocado de
  lugar.
- **A TERCEIRA:** desligue a chave dela. O som **não** toca, e o gesto **não**
  recusa.

---

## 3. NADA SE PERDEU

| o que existe hoje | continua valendo |
| --- | --- |
| o `mudo` é UM gesto para o 🎙 e o ♪ (o mesmo `data-mudo`) | sim — não separe em dois nomes |
| `mic.set` é o mudo do FIRMWARE e `speaker.set` manda ZERO guardando o volume | sim — trocar um pelo outro cala a coisa errada |
| `mic_set(False)` **não** devolve a posse ao `hid-playstation` | sim — o "Liberar" ela mandou tirar em 30/08 |
| `audio.mic_mudo` é LEITURA; `speaker.muted` é o que nós mandamos | sim — guardar o enviado como lido é o que *"fez a tela parecer mentirosa quando ela nunca mentiu"* |
| a escala do mic é 0-100 e a do alto-falante é 0-255 | sim — `volume_do_percentual` é a curva medida |

---

## 4. A PROVA DE TELA

Foto `--oculta` antes e depois, o clique de verdade nos dois botões, e a
mordida. **A recusa do mudo tem de aparecer no cartão DAQUELE controle** — é
para isso que ela sobe como recusa, e uma foto que não mostre em qual cartão a
frase pousou não prova o que a sprint pede.

**O que esta sprint NÃO faz:** não mexe no desenho (a `aba02.py` e as páginas
estão no `nao_toca`), não publica, não toca o CSV da paridade — as linhas 58 e
88 são de quem remede, e a remedição desta leva já passou.
