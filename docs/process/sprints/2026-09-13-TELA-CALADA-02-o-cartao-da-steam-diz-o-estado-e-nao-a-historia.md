---
sprint: TELA-CALADA-02
estado: aberta
onda: A-FILA-DE-1309
posse:
  TELA-CALADA-02:
    - src/hefesto_dualsense4unix/interface/pacotes/a07_lancadores.py
    - src/hefesto_dualsense4unix/interface/desenho_dos_lancadores.py
    - src/hefesto_dualsense4unix/interface/aba07.py
    - mockup/07-lancadores.html
    - src/hefesto_dualsense4unix/interface/paginas/07-lancadores.html
cria:
  - tests/unit/test_o_cartao_da_steam_nao_narra.py
bancada: false
depois_de: []
nao_toca:
  - src/hefesto_dualsense4unix/interface/hefesto_vivo.py
  - src/hefesto_dualsense4unix/integrations/sentinela_do_wrapper.py
  - src/hefesto_dualsense4unix/integrations/carona_do_wrapper.py
---

# TELA-CALADA-02 — o cartão da Steam diz o estado, e não a história

**13/09/2026.** A mesma palavra dela da TELA-CALADA-01:

> *"essas frases de status que aparecem no rodapé isso não deveria estar aparecendo. também. preciso que remova isso tambem."* <!-- noqa-acento: citação literal dela -->
>
> *"em todas as abas da interface"*

A frase que ela colou (*"2 jogos nunca receberam as Opções de Inicialização do
Hefesto na Steam: … Feche a Steam e eu reponho."*) sai por outra porta além
do rodapé: o `data-campo="steam-diz"` do cartão da Steam, **sem clique**, a
cada tique.

## A régua do que fica e do que sai

* **Fica:** rótulo de ESTADO curto — até seis palavras, sem primeira pessoa,
  sem instrução. Ex.: «2 jogos sem o atalho».
* **Sai:** frase que narra gesto, notícia de fundo, instrução ou pedido
  («Feche a Steam e eu reponho», «Reposta a Opção…», «Estou lendo…»).

## §1 — Os quatro canais (endereços do mapa de 13/09, sobre `71c69c57`)

1. **A sentinela no corpo do cartão.** `desenho_dos_lancadores.py`, onde
   `lida.reparaveis` põe `lida.frase` inteira no `diz`. Use a reserva que já
   existe na linha seguinte (a contagem), mantendo o selo `warn` e o botão
   «Consertar».
2. **A notícia da vigia.** `a07_lancadores.py`, a `noticia` somada à
   `cabeca` (vale 45 s). Deixa de somar; `VIGIA.esquecer()` já repinta o
   cartão com o estado reposto.
3. **O aviso do jogo aberto.** `aviso_do_jogo_aberto` (`WRAPPER_MISSING_TEXT`)
   somado à `cabeca`. A frase sai. O botão «Não perguntar para este jogo»:
   meça se ele ainda se explica sozinho sem a frase; se não, troque a frase
   por um rótulo de estado dentro da régua acima e relate a escolha.
4. **«Estou lendo a sua biblioteca da Steam…»** enquanto `VIGIA.agora()` é
   None — no desenho e no literal da página. Fica vazio: o campo `jogos` já
   mostra que está lendo. O literal sai pelo gerador `aba07.py` →
   `mockup/07-lancadores.html` → `scripts/check_o_desenho_aprovado.py
   --publicar 07` (curar o mockup não cura o produto).

## §2 — O que morde

* Censo com dois reparáveis → `steam-diz` não contém «Feche», «reponho» nem
  o nome dos jogos; contém a contagem.
* Vigia com notícia → `cabeca` não a contém.
* **Mordida** de cada item: devolver a frase e ver a régua reprovar.
* Piloto `--oculta` na 07 com a Steam aberta e um jogo sem atalho: foto antes
  e depois; clique em «Consertar» continua chegando à pergunta de fechar a
  Steam.

## Critério de pronto — por cabo · por BT · no perfil · por controle

| pergunta | resposta |
| --- | --- |
| **por cabo** / **por BT** | não se aplica: é o cartão da Steam |
| **no perfil** | nada muda no disco; a carona e a vigia continuam repondo o atalho |
| **por controle** | não se aplica |
