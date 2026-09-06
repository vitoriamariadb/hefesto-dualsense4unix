---
sprint: ONDA2-02-CONTROLES-01
estado: feita
posse:
  A02:
    - src/hefesto_dualsense4unix/interface/aba02.py
    - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
    - mockup/02-controles.html
    - src/hefesto_dualsense4unix/interface/paginas/02-controles.html
cria:
  - tests/unit/test_a_aba_02_controles_fecha_as_linhas.py
bancada: true
depois_de: [A-PORTA-DA-ABA-CONTROLES-01, ONDA0-F-A-FOLHA-01, ONDA0-P-O-PILOTO-01, ONDA1-D3-O-SENSOR-01]
nao_toca:
  - src/hefesto_dualsense4unix/interface/monta.py
  - src/hefesto_dualsense4unix/interface/onde.py
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/daemon/ipc_handlers.py
  - src/hefesto_dualsense4unix/app/ipc_bridge.py
  - docs/data/paridade-gtk-html.csv
  - src/hefesto_dualsense4unix/interface/aba01.py
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

# ONDA2-02 · A ABA CONTROLES — vinte decisões, e o motor do som já está pronto

**Você é dono de QUATRO arquivos e mais nada** — o gerador `aba02.py`, o pacote `a02_controles.py`, o desenho `mockup/02-controles.html` e a página publicada. As outras nove frentes desta onda rodam ao mesmo tempo, e nenhuma toca os seus.

**É a aba que mais esperava pela palavra dela: 20 das 34 linhas eram `DESENHO`.** Nenhuma espera mais — as dez decisões desta aba estão tomadas. E o motor do microfone e do alto-falante **já foi entregue** pela ONDA1-D1: o que falta aqui é a tela LER o que ele publica.

**A fonte das decisões abaixo é**
[O PO DECIDE AS 54](../2026-09-04-O-PO-DECIDE-as-54-e-os-sete-conflitos.md) — §2, aba `02-controles`. Onde há a marca de um **conflito C-n**, a recomendação escrita na lista da aba propunha o CONTRÁRIO de uma decisão que ela já tinha tomado; **siga o que está aqui**, e a §1 daquele documento diz por quê.

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

### [01] onde aparece a cor viva

**A PERGUNTA MORREU** — conflito C-1. A **D-06** dela já deu lugar à cor viva: *"Casco borda externa lightbar borda interna"*. **Não faça o pingo no cabeçalho** — seria um segundo sinal para o mesmo fato.

### [02] o travessão da barra de luz

**Palavra curta no lugar do travessão, frase inteira no hover.** As quatro palavras são dela: `Jogo` · `Steam` · `Não sei` · `Apagada`.

### [03] o selo ATIVO/MUDO do microfone

**O selo diz o estado COMPOSTO** — conflito C-2, pela **D-12**. ATIVO só quando as quatro faces concordam. A ONDA1-D1 entregou as quatro: `mic_mudo_desejado` · `mic_mudo` · `mic_da_mesa.eleito` + `recados` · `canal_ativo`/`canal_mudo`. **Chave ausente é "ainda não perguntamos", nunca `false`** — e a D1 mediu `mic_da_mesa.eleito` MENTINDO: use `canal_ativo`.

### [04] o botão avisa antes do clique

**O botão apaga e a dica diz por quê** — a **D-03**, com a peça da ONDA0-F (`monta.botao_cinza`).

### [05] mexer no volume por esta tela

**A barra pintada vira clicável.** Zero pixel de desenho novo, e destrava o botão do alto-falante, que hoje não tem como sair do cinza num controle cujo volume nunca foi escrito.

### [06] o alto-falante ganha 'Devolver'

**Fica fora, e a dica diz o preço.** É a decisão dela de 31/08 sobre o gêmeo (o 'Liberar' do microfone), e aqui o preço é menor.

### [07] a degradação do gamepad virtual

**Uma marca na palavra e o motivo no hover.** O ajudante que monta o motivo já existe em `pacotes/__init__.py` e **nenhum dos dez pacotes o chama** — não falta código, faltava onde pousar a frase.

### [08] o mudo que caiu no controle errado

**Vira aviso no cartão, como as recusas.** O gesto passa a ler o TERCEIRO estado da resposta (`ipc_bridge.alvo_honrado`) em vez de tratá-la como sim/não.

### [09] onde a tela mostra o alto-falante mudo

**O botão do alto-falante ACENDE**, por leitura, e o campo invisível `alto-estado` sai do desenho. A ONDA1-D1 entregou o `audio_saida.RotaDasDuasCamadas`; `rota_na_tela` a monta e devolve `.botao_aceso`.

### [10] o clique do analógico

**Fica `[L3]`.** É o sinal que não depende de contraste nenhum.

---

## O QUE MAIS FECHA AQUI

### D-06 / S-11 — casco fora, luz viva dentro

As duas cores, cada uma no seu anel: o desenho do controle guarda o plástico, o anel interno segue a luz que o aparelho mostra AGORA. É o que faz reconhecer de relance qual cartão é qual na mesa de quatro.

### S-05 — o botão do microfone liga o microfone E o canal (D-12)

A metade de motor está pronta. Aqui: o gesto `mudo` troca `p.mic_set(...)` por `p.mic_canal_set(ligado=…, uniq=…)`, e a recusa pinta com `frase_do_ato_do_microfone`. **O ato já roda hoje** (o `mic_set_detalhado` delega) — o que falta é a FRASE.

### T-07 — o endereço do décimo alvo

A ONDA0-P construiu o alvo `marcado` no piloto; **o endereço é seu**: `data-hef-alvo="marcado"` no checkbox do acordeão. E o `interface/regua_do_mockup.py` precisa do ramo `marcado` quando esta aba publicar — **relate**, o arquivo não é seu.

---

## AS LINHAS DE `MOTOR` DESTA ABA

Código novo, e nenhuma espera decisão. Faça as que couberem no seu fôlego e **declare as que não couberem, com a razão** — declarar é o que separa dívida de esquecimento:

* Touchpad — o pontinho e a POSIÇÃO do dedo
* Analógicos — a posição do ponto e os números X/Y
* Microfone — o medidor de onda ao vivo
* Alto-falante — 'Sons do jogo' e 'Todo o som do PC' (a leitura vem da D1)
* Anotar no rascunho do perfil o que o gesto de som fez

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

`docs/process/agentes/2026-09-04/ONDA2-02.md` <!-- ref-externa: esta sprint CRIA o relatório; ele nasce no fim da frente --> , com quatro cabeçalhos:
**o que mudou** · **como provei (a mordida colada)** · **o que medi e derrubou
uma suposição** · **o que sobrou para o próximo** — e, separada, **a lista das
linhas do CSV que você fechou**, que é o que a ONDA1-X vai lançar.
