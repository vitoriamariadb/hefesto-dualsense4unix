---
sprint: ONDA2-01-JOGAR-01
estado: feita
posse:
  A01:
    - src/hefesto_dualsense4unix/interface/aba01.py
    - src/hefesto_dualsense4unix/interface/pacotes/a01_jogar.py
    - mockup/01-jogar.html
    - src/hefesto_dualsense4unix/interface/paginas/01-jogar.html
cria:
  - tests/unit/test_a_aba_01_jogar_fecha_as_linhas.py
bancada: true
depois_de: [MIGRA-JOGAR-02, ONDA0-F-A-FOLHA-01, ONDA0-P-O-PILOTO-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/onde.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - docs/data/paridade-gtk-html.csv
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/aba05.py
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba08.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/aba10.py
---

> **ESTADO 06/09/2026: feita** — a leva de 04/09 entrou (as réguas que ela cria existem no `dev`); o que sobrou da aba está na ONDA CINCO e no CSV.

# ONDA2-01 · A ABA JOGAR — dezoito linhas que só esperam alguém ler

**Você é dono de QUATRO arquivos e mais nada** — o gerador `aba01.py`, o pacote `a01_jogar.py`, o desenho `mockup/01-jogar.html` e a página publicada. As outras nove frentes desta onda rodam ao mesmo tempo, e nenhuma toca os seus.

**Ela é a aba com a melhor razão entre trabalho e ganho de todo o inventário: 18 das 30 linhas abertas são do balde `LIGAR`** — o daemon já publica o dado e a página já tem onde pousá-lo. Nenhuma delas precisa de decisão, de desenho novo ou do aparelho na mão.

**A fonte das decisões abaixo é**
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) — §2, aba `01-jogar`. Onde há a marca de um **conflito C-n**, a recomendação escrita na lista da aba propunha o CONTRÁRIO de uma decisão que ela já tinha tomado; **siga o que está aqui**, e a §1 daquele documento diz por quê.

---

## O QUE A ONDA 0 E A ONDA 1 JÁ PUSERAM DE PÉ — use, não reinvente

**As peças da ONDA0-F (`interface/monta.py`), e nenhuma aba escreve CSS:**

```python
monta.botao_cinza(rotulo, campo, tom=…, razao=…, extra=…)
monta.ressalva(campo, texto)
```

* **UM CAMPO SÓ alimenta o botão e a dica.** O pacote emite a **RAZÃO** naquele
  `data-campo` — vazia quando não há — e manda a chave **em todo tique**; sem
  razão, manda `monta.NADA_A_DIZER`. Com dois campos seria possível pintar um
  botão cinza sem razão, ou uma razão sem botão cinza.
* O `extra` é onde entra o `data-gesto` do clique, que é da aba e não da peça.
* O botão apagado **não** emite `disabled`: ele responde ao clique, por decisão
  do PO sobre a aba 09. A tinta é classe, e o piloto a acende por leitura.
* A `ressalva` quer viver numa coluna com `gap`.

**As peças da ONDA0-P (`interface/hefesto_vivo.py`):** o canal de recado de
**SUCESSO** (D-01) — mesmo depósito da recusa, com tom verde e vida de 6 s
contra os 30 s dela; o décimo alvo **`marcado`**; e o estado **"em voo"** do
botão. O alvo `classe` agora veste junto o `data-hef-atributo`, na língua do
ARIA.

---

## AS TRÊS COISAS QUE VOCÊ NÃO FAZ

1. **Não toca em `interface/monta.py`, `interface/onde.py` nem em
   `interface/hefesto_vivo.py`.** São da ONDA 0, e já fecharam. Se a sua aba
   precisar de mudança neles, **RELATE** — a edição some em silêncio no merge.
2. **Não toca em `docs/data/paridade-gtk-html.csv`.** Ele tem UM dono nesta
   leva (a ONDA1-X), e dez agentes editando linhas do mesmo arquivo é conflito
   por linha. **Liste na entrega as linhas que você fechou**, e ela as lança.
3. **Não publica desenho novo.** O que precisar de endereço que não existe vai
   para `mockup/NN-*.html` **com a seção declarada em `mockup/DIVERGENCIAS.md`**,
   e **para ali**. A publicação é uma leva só, para o olho dela — é a
   `PROVA-DE-TELA-01`, e ela é a regra mais velha desta casa.

---

## AS DECISÕES DESTA ABA, e elas estão TOMADAS

### [01] as duas frases órfãs

**Na coluna Atenção, só má notícia.** O aviso do Modo Nativo enquanto ele vigora, e a linha 'Ponte com o jogo' só nos dois desfechos ruins. Casa com a **D-10**, que já mandou as três frases órfãs para lá.

### [02] 'Player N' num controle que o jogo não recebeu

**'Player N', esmaecido enquanto espera.** A **D-04** fixou a palavra e o esmaecido não a toca; o dano que ele mata é o cartão afirmar um jogador que o jogo ainda não tem.

### [03] o interruptor do cadeado

**Volta para a Jogar, embaixo de Modo.** É a única em que a frase que explica (já na coluna Atenção) e o botão que resolve ficam na mesma tela. O escritor já existe na ponte.

### [04] mesa com mais de quatro

**A PERGUNTA MORREU** — conflito C-7. A **D-07** já manda o `+N` do quinto para a mesma linha da frase da mesa vazia. **Não abra um segundo canal para o mesmo fato.**

---

## O QUE MAIS FECHA AQUI

### S-04 — os QUATRO lugares de aviso que a página JÁ TEM (D-09, D-10)

A medição que fecha esta sprint antes de ela começar: `grep -c 'data-campo="aviso-selo"'` na página publicada dá **4**. Três nascem vazios. O defeito nunca foi falta de lugar — é o piloto escrever só no primeiro. **Zero pixel novo, zero risco de vão, e o mockup NÃO é republicado.** O mais grave em cima, `+N` no quarto.

### S-12 — a frase da mesa vazia e o `+N` do quinto (D-07)

Com zero controles a aba mostra quatro lugares apagados e nenhuma palavra. Os lugares FICAM (decisão dela de 31/08: *"o lugar apagado ensina que ali cabe um"*); o que muda é o estado vazio deixar de ser mudo. O `+N` entra na mesma linha.

---

## AS LINHAS DE `MOTOR` DESTA ABA

Código novo, e nenhuma espera decisão. Faça as que couberem no seu fôlego e **declare as que não couberem, com a razão** — declarar é o que separa dívida de esquecimento:

* O modo e a máscara escolhidos entram no perfil que ela salva

---

## A MORDIDA É OBRIGATÓRIA, E É SUA

Para cada linha que você fechar: **arranque a cura, veja a régua REPROVAR,
devolva, veja passar** — e cole a saída dos dois estados na entrega. Régua que
passa com a cura arrancada não mede nada.

**E a régua tem de LER, não digitar.** Esta casa pagou onze vezes em 26/08 por
réguas que digitavam o que deviam ler: elas reprovavam a melhora em vez do
defeito. Aconteceu de novo em 04/09, na integração desta leva.

**Quando o instrumento e o aparelho discordam, o aparelho ganha.** Quatro vezes
numa madrugada uma régua deu verde sobre defeito vivo, e nas quatro quem
revelou foi arrancar a cura e olhar de novo.

**E confira a ASSINATURA do que você chama, não só o nome.** Duas vezes em
04/09 um gesto passou VERDE sem gravar um byte: uma porque o dicionário ia como
`timeout` posicional, outra porque `_run_blocking` não aceita keywords e o
`TypeError` morria num `suppress`. **Nos dois casos o dublê do teste era mais
frouxo que a ponte real.**

## A PROVA DE TELA

Foto **antes e depois**, o clique no que mudou com a resposta mostrada, e a
mordida. **Botão que você acrescentou e nunca clicou não está entregue.**

**A JANELA NÃO NASCE NA TELA DELA.** Ela tem UMA tela e está trabalhando no
workspace `Meow` agora. Prefira não abrir janela nenhuma (`--oculta`,
`Gtk.OffscreenWindow`, Playwright `headless`, `retratar_abas.py`); se for
inevitável, ela nasce no `OS`, por `aurora-claude-workspace.sh run`. O preâmbulo
do despacho traz a regra inteira.

## O RELATÓRIO FINAL

`docs/process/agentes/2026-09-04/ONDA2-01.md` <!-- ref-externa: esta sprint CRIA o relatório; ele nasce no fim da frente --> , com quatro cabeçalhos:
**o que mudou** · **como provei (a mordida colada)** · **o que medi e derrubou
uma suposição** · **o que sobrou para o próximo** — e, separada, **a lista das
linhas do CSV que você fechou**, que é o que a ONDA1-X vai lançar.
