---
sprint: ONDA2-06-NAVEGACAO-01
estado: feita
posse:
  A06:
    - src/hefesto_dualsense4unix/interface/aba06.py
    - src/hefesto_dualsense4unix/interface/pacotes/a06_navegacao.py
    - mockup/06-navegacao.html
    - src/hefesto_dualsense4unix/interface/paginas/06-navegacao.html
cria:
  - tests/unit/test_a_aba_06_navegacao_fecha_as_linhas.py
bancada: true
depois_de: [MIGRA-NAVEGACAO-06, ONDA0-F-A-FOLHA-01, ONDA0-P-O-PILOTO-01]
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
  - src/hefesto_dualsense4unix/interface/aba05.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba08.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/aba10.py
---

> **ESTADO 06/09/2026: feita** — a leva de 04/09 entrou (as réguas que ela cria existem no `dev`); o que sobrou da aba está na ONDA CINCO e no CSV.

# ONDA2-06 · A ABA NAVEGAÇÃO — os dois defeitos que apagam o que ela escreveu

**Você é dono de QUATRO arquivos e mais nada** — o gerador `aba06.py`, o pacote `a06_navegacao.py`, o desenho `mockup/06-navegacao.html` e a página publicada. As outras nove frentes desta onda rodam ao mesmo tempo, e nenhuma toca os seus.

**Esta aba tem DOIS dos seis defeitos que perdem trabalho dela em silêncio, e eles vêm PRIMEIRO — antes de qualquer decisão de tela.** Um perfil com `button_actions` preenchido **apaga o teclado que ela escreveu à mão**, na próxima ativação, sem uma palavra.

**A fonte das decisões abaixo é**
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) — §2, aba `06-navegacao`. Onde há a marca de um **conflito C-n**, a recomendação escrita na lista da aba propunha o CONTRÁRIO de uma decisão que ela já tinha tomado; **siga o que está aqui**, e a §1 daquele documento diz por quê.

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

### [01] o interruptor do mouse fora do modo 'Controlar o PC'

**Apaga o interruptor e escreve ao lado**, na tira de estados que já existe — a **D-03** com a **D-02**. É o único jeito de ela saber antes de gastar o clique.

### [02] as três regiões do touchpad

**Ficam, com a marca de que não disparam.** A **D-15** dela já mandou que ficassem (*"pedi pra tirar o texto não o touch mostrando os toques"*); a marca impede a tela de prometer um clique que o produto não dispara. **A marca nasce FIXA** — a marca VIVA espera o daemon publicar o `ponteiro_do_sistema`, e isso é sprint própria: **relate**.

### [03] o botão PS na tabela

**Fica fora, e a razão vira dica.** O PS é a única saída de emergência (quatro combos e o modo jogo); dar-lhe uma tecla o faria digitar SEM parar de abrir a Steam.

### [04] as três verdades que a tabela esconde

**Uma tira de aviso sob a tabela.** O que está prestes a ser APAGADO não pode morar num hover — ninguém passa o rato onde não sabe que há algo. E a tira só ocupa espaço nos perfis em que há algo a perder.

### [05] o custo de desligar o teclado

**Uma frase permanente enquanto estiver desativado.** É a única que ainda está na tela no dia em que ela estranhar que o L3 não abre mais nada — e não precisa de código novo.

---

## O QUE MAIS FECHA AQUI

### OS DOIS DEFEITOS DA §3, e eles vêm ANTES

**(1)** `resolver()` parte do de fábrica e aplica só `button_actions`; `profile.key_bindings` **nunca é consultado**, e `apply_button_actions` roda depois de `apply_keyboard` reescrevendo o conjunto inteiro. **(2)** 'Voltar ao padrão' zera `key_bindings` inteiro — incluindo o que ela escreveu na janela antiga — e a confirmação **nem usa a palavra 'atalhos'**. Os dois perdem trabalho dela em silêncio, que é a família que esta casa persegue acima de todas.

---

## AS LINHAS DE `MOTOR` DESTA ABA

Código novo, e nenhuma espera decisão. Faça as que couberem no seu fôlego e **declare as que não couberem, com a razão** — declarar é o que separa dívida de esquecimento:

* Editar QUAL TECLA cada botão digita, e remover (deixar sem digitar)
* Velocidade guardada no PERFIL, e a preferência com a emulação desligada
* A convivência entre `key_bindings` e `button_actions` no daemon

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

`docs/process/agentes/2026-09-04/ONDA2-06.md` <!-- ref-externa: esta sprint CRIA o relatório; ele nasce no fim da frente --> , com quatro cabeçalhos:
**o que mudou** · **como provei (a mordida colada)** · **o que medi e derrubou
uma suposição** · **o que sobrou para o próximo** — e, separada, **a lista das
linhas do CSV que você fechou**, que é o que a ONDA1-X vai lançar.
