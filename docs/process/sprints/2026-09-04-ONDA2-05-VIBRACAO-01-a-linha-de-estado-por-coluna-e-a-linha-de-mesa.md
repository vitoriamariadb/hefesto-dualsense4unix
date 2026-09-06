---
sprint: ONDA2-05-VIBRACAO-01
estado: feita
posse:
  A05:
    - src/hefesto_dualsense4unix/interface/aba05.py
    - src/hefesto_dualsense4unix/interface/pacotes/a05_vibracao.py
    - mockup/05-vibracao.html
    - src/hefesto_dualsense4unix/interface/paginas/05-vibracao.html
cria:
  - tests/unit/test_a_aba_05_vibracao_fecha_as_linhas.py
bancada: true
depois_de: [MIGRA-VIBRACAO-03, MIGRA-VIBRACAO-08, ONDA0-F-A-FOLHA-01, ONDA0-P-O-PILOTO-01, ONDA1-D2-A-VIBRACAO-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/onde.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - docs/data/paridade-gtk-html.csv
  - src/hefesto_dualsense4unix/interface/aba01.py
  - src/hefesto_dualsense4unix/interface/aba02.py
  - src/hefesto_dualsense4unix/interface/aba03.py
  - src/hefesto_dualsense4unix/interface/aba04.py
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba08.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/aba10.py
---

> **ESTADO 06/09/2026: feita** — a leva de 04/09 entrou (as réguas que ela cria existem no `dev`); o que sobrou da aba está na ONDA CINCO e no CSV.

# ONDA2-05 · A ABA VIBRAÇÃO — a linha de estado por coluna, e a mesa que sumiu

**Você é dono de QUATRO arquivos e mais nada** — o gerador `aba05.py`, o pacote `a05_vibracao.py`, o desenho `mockup/05-vibracao.html` e a página publicada. As outras nove frentes desta onda rodam ao mesmo tempo, e nenhuma toca os seus.

**Espera a ONDA1-D2 entregar o multiplicador por motor** — o conceito é dela e veio fora das minhas opções: a barra não manda `rumble.set`, ela é POLÍTICA que compõe com o degrau. O resto desta aba não espera nada.

**A fonte das decisões abaixo é**
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) — §2, aba `05-vibracao`. Onde há a marca de um **conflito C-n**, a recomendação escrita na lista da aba propunha o CONTRÁRIO de uma decisão que ela já tinha tomado; **siga o que está aqui**, e a §1 daquele documento diz por quê.

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

### [01] publicar a barra que arrasta

**JÁ FOI.** As treze páginas foram publicadas na madrugada de 04/09 — `check_o_desenho_aprovado.py` responde `o produto está atrás: 0`.

### [02] as duas explicações

**Só a nota do Testar sobe para a tela.** Ela é a única que explica um resultado que a própria tela produz. A dos 5 s do Auto fica no `?`.

### [03] avisar que a vibração está travada

**Uma linha de estado POR COLUNA** — conflito C-5, pela **D-14**, com os TRÊS estados que ela nomeou: *'o jogo controla'* / *'travada em silêncio'* / *'travada em fraca=X, forte=Y'*. A recomendação escrita propunha uma faixa única embaixo da grade, e eu **não encolhi a decisão dela para economizar pixel** — o custo foi declarado e aceito.

### [04] confirmar o clique

**No cartão, pela peça da D-01** — conflito C-6. **Não use a faixa de avisos:** dois canais de sucesso em duas abas é duas traduções do mesmo fato.

### [05] os dois donos da força

**Uma linha de MESA embaixo da grade.** Ela devolve o caminho perdido em 03/09 (pôr a mesa inteira em Auto) e faz 'herdado' ficar óbvio sem palavra nova: a coluna sem ajuste próprio deixa de acender degrau e passa a apontar para essa linha.

### [06] o clique que a interface não entende

**As duas frases que já existem sobem para o cartão.** Elas foram escritas para quem está com o controle na mão, e o caso que importa — *'o controle caiu'* — só tem resposta se a frase aparecer.

---

## O QUE MAIS FECHA AQUI

### S-08 — a linha de estado da vibração

É a mesma peça da decisão [03], e usa a `ressalva` da ONDA0-F.

---

## AS LINHAS DE `MOTOR` DESTA ABA

Código novo, e nenhuma espera decisão. Faça as que couberem no seu fôlego e **declare as que não couberem, com a razão** — declarar é o que separa dívida de esquecimento:

* As duas barras de motor como AJUSTE (o motor vem da ONDA1-D2)
* Testar / Aplicar / 'Deixar o jogo controlar'
* Zerar weak/strong e o passthrough no rascunho ao parar ou devolver

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

`docs/process/agentes/2026-09-04/ONDA2-05.md` <!-- ref-externa: esta sprint CRIA o relatório; ele nasce no fim da frente --> , com quatro cabeçalhos:
**o que mudou** · **como provei (a mordida colada)** · **o que medi e derrubou
uma suposição** · **o que sobrou para o próximo** — e, separada, **a lista das
linhas do CSV que você fechou**, que é o que a ONDA1-X vai lançar.
