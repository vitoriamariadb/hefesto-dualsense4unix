---
sprint: TELA-CALADA-03
estado: feita
onda: A-FILA-DE-1309
posse:
  TELA-CALADA-03:
    - src/hefesto_dualsense4unix/interface/pacotes/a09_sistema.py
    - src/hefesto_dualsense4unix/interface/pacotes/a08_conexoes.py
cria:
  - tests/unit/test_sistema_e_conexoes_perguntam_e_nao_narram.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/interface/aba09.py
  - src/hefesto_dualsense4unix/interface/paginas/09-sistema.html
  - src/hefesto_dualsense4unix/app/actions/daemon_actions.py
---

# TELA-CALADA-03 — Sistema e Conexões perguntam, e não narram

> **ESTADO 2026-09-13: feita** — `docs/process/agentes/2026-09-13/TELA-CALADA-03-opus.md`.
> A pergunta do «Aplicar aos jogos» vai ao painel pelo pacote (medido: antes o
> primeiro clique não mostrava nada); os quatro segundos cliques limpam o painel
> e levam o recibo ao diário; o ramo do serviço parado apaga o registro, o exame
> e a contagem do desenho; e o fim da espera do «A luz não acende» sai do
> cartão, com a contagem intacta. Piloto oculto antes e depois, cinco mordidas.

**13/09/2026.** A mesma palavra dela da TELA-CALADA-01:

> *"essas frases de status que aparecem no rodapé isso não deveria estar aparecendo. também. preciso que remova isso tambem."* <!-- noqa-acento: citação literal dela -->
>
> *"em todas as abas da interface"*

**Entra no `dev` junto com a TELA-CALADA-01** — o item 1 abaixo é a pergunta
que a TELA-CALADA-01 deixa sem lugar.

## A régua

A **pergunta** de um gesto em dois tempos fica (sem ela o segundo clique não
tem instrução). O **recibo** depois do gesto sai. Conteúdo que ela pediu
(«Ver detalhes», «Ver plugins») fica.

## §1 — O que muda (endereços do mapa de 13/09, sobre `71c69c57`)

1. **A pergunta do «Aplicar aos jogos da Steam» sem lugar.** O ramo sem
   `_confirmado(o, "aplicar-aos-jogos")` devolve a pergunta só por
   `recado`. Desde `71c69c57` a 09 não tem cartão nem faixa e ela não
   aparece; com a TELA-CALADA-01 o recado de sucesso some de vez. Meça no
   piloto que hoje o primeiro clique não mostra nada; mude a pergunta para o
   painel (`_para_o_painel` / `registro-texto`), como já fazem os primeiros
   cliques de «Refazer os consertos automáticos» e de «Tirar a sobreposição
   Vulkan».
2. **Os recibos do painel.** No ramo confirmado de refazer-consertos,
   refazer-proton e procurar-camadas, devolva só `blocos` e **limpe o
   painel** — senão a pergunta do primeiro clique fica lá, velha.
3. **O registro inventado pelo mockup.** No retorno de erro de
   `_tela.pacote` (serviço parado), emita também `REGISTRO` vazio e
   `exame-lista` vazio, como o ramo já faz com `blocos`. Hoje a aba mostra
   «[23:41:09] perfil "Mortal Kombat" aplicado aos 2 …», que é texto do
   desenho.
4. **Conexões, «A luz não acende».** `linha_da_espera`: depois da espera,
   devolva `_sem_valor()` também quando há `recado` («O controle não chegou
   a cair do rádio…»). **Durante** a espera, o «▲ aperte o PS · procurando…
   38s» FICA: é o segundo tempo do gesto.

## §2 — O que morde

* 09: primeiro clique de «Aplicar aos jogos» → `registro-texto` com a
  pergunta; segundo clique → painel vazio. Mordida: devolver a pergunta ao
  `recado` → reprova.
* 09 com o serviço parado → nem o registro nem o exame do mockup no DOM.
* 08: espera acabada com recado → `luz-espera` vazio; durante a contagem →
  a instrução continua.
* Piloto `--oculta` na 09 e na 08: foto antes e depois, clique nos gestos.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| pergunta | resposta |
| --- | --- |
| **por cabo** | «A luz não acende» é do rádio; por cabo não se aplica |
| **por BT** | o item 4 é medido com dublê da espera; a prova no aparelho fica para a MESA-DE-QUATRO-01 |
| **no perfil** | nada muda no disco |
| **por controle** | a contagem continua no cartão do controle que esperou |
