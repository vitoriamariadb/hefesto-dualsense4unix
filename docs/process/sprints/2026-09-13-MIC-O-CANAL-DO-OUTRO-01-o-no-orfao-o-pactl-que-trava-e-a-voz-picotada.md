---
sprint: MIC-O-CANAL-DO-OUTRO-01
estado: feita
onda: A-FILA-DE-1309
posse:
  MIC-O-CANAL-DO-OUTRO-01:
    - src/hefesto_dualsense4unix/integrations/fontes_de_captura.py
    - src/hefesto_dualsense4unix/integrations/dualsense_bt_audio.py
    - src/hefesto_dualsense4unix/daemon/subsystems/bt_mic.py
cria:
  - tests/unit/test_o_canal_de_outro_controle_nao_e_meu.py
bancada: true
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/integrations/eleicao_de_microfone.py
  - src/hefesto_dualsense4unix/interface/pacotes/a02_controles.py
  - docs/data/mapa-controles.csv
---

> **ESTADO 2026-09-13: feita** — o nó com o nome de outro controle deixou de ser resposta das regras 3 e 4 de `escolher_fonte`; o canal órfão sai pela varredura do supervisor com quatro provas (fora da tabela deste processo, sem pedido, ninguém escrevendo no fifo, duas varreduras); e o `pactl` mudo ganhou recuo crescente, de 5 a 60 s, sem repetir o `load-module` no ciclo seguinte. Sem aparelho: a causa do travamento, a voz picotada e a orelha dela ficam para a MESA-DE-QUATRO-01. A entrega está em `docs/process/agentes/2026-09-13/MIC-O-CANAL-DO-OUTRO-01-opus.md`.

# MIC-O-CANAL-DO-OUTRO-01 — o canal órfão, o `pactl` que trava e a voz picotada

**13/09/2026.** A palavra dela, depois de testar som e microfone em 12/09:

> *"hoje testei eles e não funcionaram como deveriam. acredito que pelas ondas de mic não terem sido concluidas aindas."* <!-- noqa-acento: citação literal dela -->

## §0 — A resposta honesta à hipótese dela

**As sprints de microfone estão `feita` no código.** MIC-OS-QUATRO-01,
MIC-VOLUME-02, MIC-NA-TELA-01, SOM-FIADO-01, SFX-POR-CONTROLE-01,
SOM-NA-TELA-01 e SOM-BOTOES-01 fecharam com régua e dublê. Abertas no tema
sobram só MIC-SEM-FONTE-01 e FONE-01.

**O que não fechou é o aparelho.** Nenhuma delas foi ensaiada com a voz dela —
os gestos G1–G7 e o §4 da MIC-NA-TELA-01 continuam na fila da bancada. E o
journal do teste dela mostra **quatro defeitos que régua nenhuma viu**.

---

## §1 — O que o journal de 12/09 mostra (15:52–17:22)

Três DualSense passaram pelo rádio: `14:3a:9a:00:00:ab`, `44:46:48:00:00:03` e
`d4:2f:4b:00:00:d8`. O daemon reiniciou quatro vezes entre 16:30 e 16:40.

### Defeito 1 — o microfone de um controle é eleito e medido no canal de OUTRO

```
16:35:04  controller_disconnected  reason=alvo_sumiu  uniq=143a9a0000ab
16:35:50  nivel_do_mic_abriu       fonte=hefesto_mic_0000ab  uniq=444648000003
16:40:06  bt_mic_source_publicada  source=hefesto_mic_000003
16:40:06  eleicao_mic_ok           alvo=hefesto_mic_0000ab   ← pedido do 444648000003
16:41:59  nivel_do_mic_abriu       fonte=hefesto_mic_0000ab  uniq=444648000003
```

O controle `…:03` ligou o microfone, e o sistema passou a gravar — e a luz a
medir — o canal do `…:ab`, **que tinha saído da mesa cinco minutos antes**. Voz
nenhuma chega por um canal sem aparelho atrás.

**A causa, no fonte:** a regra 4 de `fontes_de_captura.escolher_fonte` («um
para um»). Com uma fonte na lista e um controle na mesa, a fonte é dele — e só
`CasamentoUSB.veta` pode recusar, e ela não recusa nó sem USB. Mas
`hefesto_mic_0000ab` **carrega no nome a identidade de outro controle**. A regra
0 sabe ler essa identidade e só a usa para dizer SIM; nenhuma regra a usa para
dizer NÃO.

**A cura:** um nó com identidade no nome (regras 0, 1 e 2) que não casa com este
`uniq` **nunca é deste controle** — nem pela regra 3, nem pela 4. Ela mora
dentro de `escolher_fonte`, então alcança todos os chamadores de uma vez: a
eleição, a luz, o nível, o volume e o «quem ouve».

### Defeito 2 — o canal órfão sobrevive ao controle e ao daemon

`hefesto_mic_0000ab` continuou na lista de fontes depois de o controle sair
(16:35:04) e depois de três reinícios do daemon — o nível o abriu às 16:35:50,
16:39:35, 16:39:47 e 16:41:59.

O `iniciar()` do nó de captura em `dualsense_bt_audio.py` derruba órfão **com o
mesmo nome** (MIC-RADIO-ORFAO-01, 07/09). Canal de controle que saiu da mesa não
tem quem o derrube.

**A hipótese de como ele nasceu, e ela é do Passo 1:** entre 16:33 e 16:35 houve
dez `bt_mic_load_module_falhou saida=` com a saída **vazia** — a forma do
`_rodar` devolver `None` por timeout. Um `load-module` que estoura o prazo do
lado do cliente pode ter sido carregado pelo servidor, e aí nasce um módulo que
ninguém guardou o id.

**A cura:** ao subir e a cada reconciliação, `module-pipe-source` com prefixo
`hefesto_mic_` cujo controle não está pedido sai. O argumento é o da
MIC-RADIO-ORFAO-01: o prefixo é desta casa, e órfão é nosso por definição.

### Defeito 3 — o `pactl` parou de responder por 2 min 27 s

```
16:32:31  bt_mic_source_publicada  source=hefesto_mic_0000ab
16:32:36  bt_mic_pedido            ligar=True
16:32:37  audio_fonte_do_uniq_falhou  'pactl list sources short' timed out after 2.0 seconds
   …      30 timeouts e 10 load-module vazios
16:35:04  o último — o daemon já tinha parado às 16:34:59
```

O PipeWire não registrou nada na janela além de `mod.pipe-tunnel: underrun`.
**Causa não medida.** Duas hipóteses, e o Passo 1 separa:

* o servidor travado pelo `pipe-tunnel` (o laço dele parado num FIFO);
* o próprio daemon martelando o servidor — 40 chamadas com teto de 2 s em
  150 s, fora as da luz, da eleição e do nível.

**Uma parte da cura independe da causa:** o supervisor não pode repetir
`load-module` enquanto o `pactl` não responde.

### Defeito 4 — a voz pelo rádio chega picotada

`mod.pipe-tunnel: underrun` mais de cem vezes entre 16:18 e 16:43, sempre com
um `hefesto_mic_*` de pé e o nível lendo (`underrun 0 < 4096` = o FIFO vazio
quando o servidor foi ler). É buraco na voz.

**Não medido com a orelha dela.** Pode ser a mesma causa da F-a da
`A-FILA-QUE-A-ONDA-ABRIU-INDICE` (o microfone por rádio come 34% dos reports de
entrada). O Passo 1 conta quadros escritos por segundo contra os 100 esperados.

---

## §2 — O que NÃO é defeito, e é decisão dela

**Dois microfones não ficam no ar juntos** — a eleição escolhe UM
(`eleicao_de_microfone`, medido em 10/09). A cena dela pede *"cada controle com
seu microfone individual funcionando"*. Esta sprint **não mexe na eleição**
(`nao_toca`): trocar o desenho é a palavra dela, e a pergunta vai no relatório
de quem coordena.

---

## §3 — A ordem

1. **Defeito 1** — sem bancada: régua sobre `escolher_fonte`, e ela morde;
2. **Defeito 2** — régua com `pactl` dublado + dez minutos de bancada;
3. **Passo 1 na bancada** — o `pactl` sob o canal de pé (`time pactl info` em
   laço, `pw-top`) e a contagem de quadros; só então defeitos 3 e 4;
4. **A orelha dela** — um controle, falar e calar, gravando com `parec`.

## §4 — O que morde

* `escolher_fonte(["hefesto_mic_<outro>"], uniq, [uniq])` devolve `None`.
  Arrancar a cura → devolve o nó do outro;
* a mesma régua com o nó **dele** continua devolvendo o nó — a cura não pode
  apagar o microfone de quem tem;
* órfão com prefixo `hefesto_mic_` e sem pedido → `unload-module` na
  reconciliação; nó de controle pedido → intocado;
* `pactl` dublado que estoura o prazo → o supervisor não repete o
  `load-module` no ciclo seguinte.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| pergunta | resposta |
| --- | --- |
| **por cabo** | o nó do cabo é o ALSA casado por USB (regra 3) ou o `hefesto_mic_<hex6>` depois do pedido. A cura do defeito 1 não muda o cabo: nó ALSA não tem identidade no nome |
| **por BT** | pronto = ligar o microfone de um controle no rádio grava o canal DELE, medido no journal (`nivel_do_mic_abriu` com a fonte do próprio `uniq`), com outro controle tendo saído da mesa antes |
| **no perfil** | não se aplica: canal e eleição são estado vivo; o perfil guarda mudo e volume, que esta sprint não toca |
| **por controle** | é o nome da sprint: a identidade no nome do nó passa a dizer NÃO para o vizinho, não só SIM para o dono |
