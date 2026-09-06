---
sprint: ONDA2-10-PERFIS-01
estado: feita
posse:
  A10:
    - src/hefesto_dualsense4unix/interface/aba10.py
    - src/hefesto_dualsense4unix/interface/pacotes/a10_perfis.py
    - mockup/10-perfis.html
    - src/hefesto_dualsense4unix/interface/paginas/10-perfis.html
cria:
  - tests/unit/test_a_aba_10_perfis_fecha_as_linhas.py
bancada: true
depois_de: [ONDA0-F-A-FOLHA-01, ONDA0-P-O-PILOTO-01]
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
  - src/hefesto_dualsense4unix/interface/aba06.py
  - src/hefesto_dualsense4unix/interface/aba07.py
  - src/hefesto_dualsense4unix/interface/aba08.py
  - src/hefesto_dualsense4unix/interface/aba09.py
---

> **ESTADO 06/09/2026: feita** — a leva de 04/09 entrou (as réguas que ela cria existem no `dev`); o que sobrou da aba está na ONDA CINCO e no CSV.

# ONDA2-10 · A ABA PERFIS — a regra que a tela não sabe mostrar, e a coluna que mente

**Você é dono de QUATRO arquivos e mais nada** — o gerador `aba10.py`, o pacote `a10_perfis.py`, o desenho `mockup/10-perfis.html` e a página publicada. As outras nove frentes desta onda rodam ao mesmo tempo, e nenhuma toca os seus.

**A aba com mais `MOTOR` do inventário (12), e a que carrega a maior ausência isolada: a seção `mode` do perfil é inalcançável.** Um perfil criado pelo HTML não pode dizer *"quando eu entrar, ligue o modo jogo com máscara DualSense"*.

**A fonte das decisões abaixo é**
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) — §2, aba `10-perfis`. Onde há a marca de um **conflito C-n**, a recomendação escrita na lista da aba propunha o CONTRÁRIO de uma decisão que ela já tinha tomado; **siga o que está aqui**, e a §1 daquele documento diz por quê.

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

### [01] a regra maior do que a tela mostra

**Cadeado no campo, frase no hover.** Sete dos nove perfis de fábrica casam por uma regra que o seletor 'Funciona em' não sabe descrever, e hoje o seletor fica IDÊNTICO a um destravado — só reclama depois do clique. O canal de hover já existe nesta página.

### [02] para onde a tela manda quem quer mudar a regra

**A tela avisa e para por aí.** Fecha hoje o buraco que existe — a tela afirmando uma regra que não é a regra — sem esperar motor. **E as duas frases prontas mandam a lugares que não existem aqui**: uma cita a linha de comando, a outra um 'Modo avançado' que não tem uma ocorrência nesta interface. Isso é fato errado e **se substitui**.

### [03] a frase da Prioridade que ela aprovou

**A frase dela entra no desenho — e vão as DUAS**, a dela primeiro (*'Quando dois perfis servem ao mesmo tempo, o de número maior entra.'*), seguida da explicação do Universal em zero, que o texto de hoje tem e o dela não.

### [04] o que a tela responde ao número do jogo

**Só a tira, e o campo se corrige:** depois que ela sai do campo, o endereço colado vira o número na frente dela. O rótulo ao vivo pode vir depois sem desfazer nada.

### [05] a tira que corta o fim da frase

**A tira ganha uma segunda linha.** A metade que AVISA está no fim da frase (a carona da Steam sozinha tem 218 caracteres e a linha comporta ~200), e é a única opção em que ela chega sem gesto e sem a lista pular.

### [06] os dois avisos do quadro Modo

**Preço no hover, aviso do rádio em linha** — como ela pediu por escrito. **ESPERA o quadro Modo existir**, e ele é o item de motor abaixo.

---

## O QUE MAIS FECHA AQUI

### T-04 — a coluna 'Ajuste próprio' acende o que o disco não guarda

A tela afirmando o que não é. A medição está inteira; o diagnóstico não. É curta e não espera nada.

### O DEFEITO DA §3 desta aba

**A seção `mode` do perfil é inalcançável** — `ProfileModeConfig`, `with_mode` e `mode_kind` não têm uma ocorrência na pasta da interface. O valor do disco sobrevive só por herança: ninguém escreve nele.

---

## AS LINHAS DE `MOTOR` DESTA ABA

Código novo, e nenhuma espera decisão. Faça as que couberem no seu fôlego e **declare as que não couberem, com a razão** — declarar é o que separa dívida de esquecimento:

* A seção 'Modo' do perfil (o que ATIVAR este perfil liga)
* Selecionar, ativar e salvar um perfil pela aba; o Salvar fundindo o rascunho
* O campo Nome / renomear, e a lista suspensa com os jogos DESTA máquina

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

`docs/process/agentes/2026-09-04/ONDA2-10.md` <!-- ref-externa: esta sprint CRIA o relatório; ele nasce no fim da frente --> , com quatro cabeçalhos:
**o que mudou** · **como provei (a mordida colada)** · **o que medi e derrubou
uma suposição** · **o que sobrou para o próximo** — e, separada, **a lista das
linhas do CSV que você fechou**, que é o que a ONDA1-X vai lançar.
