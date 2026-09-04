---
sprint: ONDA2-09-SISTEMA-01
posse:
  A09:
    - src/hefesto_dualsense4unix/interface/aba09.py
    - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
    - mockup/09-sistema.html
    - src/hefesto_dualsense4unix/interface/paginas/09-sistema.html
cria:
  - tests/unit/test_a_aba_09_sistema_fecha_as_linhas.py
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
  - src/hefesto_dualsense4unix/interface/aba10.py
---
# ONDA2-09 · A ABA SISTEMA — o botão que mente o nome, e os nove segundos calados

**Você é dono de QUATRO arquivos e mais nada** — o gerador `aba09.py`, o pacote `a09_sistema.py`, o desenho `mockup/09-sistema.html` e a página publicada. As outras nove frentes desta onda rodam ao mesmo tempo, e nenhuma toca os seus.

**Três decisões, e as três são sobre o mesmo botão.** A dica dele diz *'Relê tudo o que esta aba mostra. Não muda nada.'* e a segunda frase é **falsa**: ele manda o Hefesto reaplicar a configuração e reescrever os arquivos de ambiente da Steam — 9,5 s medidos.

**A fonte das decisões abaixo é**
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) — §2, aba `09-sistema`. Onde há a marca de um **conflito C-n**, a recomendação escrita na lista da aba propunha o CONTRÁRIO de uma decisão que ela já tinha tomado; **siga o que está aqui**, e a §1 daquele documento diz por quê.

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

### [01] o botão faz dois trabalhos com um nome só

**O nome vira o trabalho: 'Reaplicar ajustes'.** A metade barata (a releitura, 4 ms) **já acontece sozinha a cada 2 s** — nomear o botão pela metade que só ele faz é a única forma que para de mentir sem gastar linha de tela.

### [02] o botão sem trabalho a fazer

**Apagado e ainda assim RESPONDE.** É o único que diz o porquê sem exigir o rato. Use `monta.botao_cinza` da ONDA0-F, que emite tinta e **não** `disabled` — `disabled` mataria o clique e o recado junto. Alcança 'Retomar', 'Reiniciar o serviço' e 'Ver os plugins carregados'.

### [03] os nove segundos e meio calados

**O botão diz que está trabalhando** — 'Reaplicando…'. Fala DURANTE a espera, no lugar exato do clique. A ONDA0-P entregou o estado 'em voo' no piloto; aqui é só usá-lo.

---

## AS LINHAS DE `MOTOR` DESTA ABA

Código novo, e nenhuma espera decisão. Faça as que couberem no seu fôlego e **declare as que não couberem, com a razão** — declarar é o que separa dívida de esquecimento:

* Botão 'Corrigir modo de execução' (migrar para systemd)
* Steam — 'Copiar opções para os jogos' e 'Aplicar aos jogos da Steam'
* 'Restaurar de fábrica' (devolver o meu_perfil ao asset original)

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

`docs/process/agentes/2026-09-04/ONDA2-09.md` <!-- ref-externa: esta sprint CRIA o relatório; ele nasce no fim da frente --> , com quatro cabeçalhos:
**o que mudou** · **como provei (a mordida colada)** · **o que medi e derrubou
uma suposição** · **o que sobrou para o próximo** — e, separada, **a lista das
linhas do CSV que você fechou**, que é o que a ONDA1-X vai lançar.
