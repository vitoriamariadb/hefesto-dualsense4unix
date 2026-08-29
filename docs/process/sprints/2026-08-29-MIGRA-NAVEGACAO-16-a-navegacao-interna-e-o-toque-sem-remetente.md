---
sprint: MIGRA-NAVEGACAO-16
onda: MIGRA-NAVEGACAO
posse:
  NAV6-INTERNA:
    - src/hefesto_dualsense4unix/app/telas/navegacao/interna.py
    - src/hefesto_dualsense4unix/core/events.py
    - src/hefesto_dualsense4unix/daemon/lifecycle.py
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/interna.py
  - tests/unit/test_migra_navegacao_16_o_toque_tem_remetente.py
bancada: true
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02
  - MIGRA-NAVEGACAO-03  # a borda de cada cartão é como cada jogador se reconhece
  - MIGRA-NAVEGACAO-07
  - MIGRA-NAVEGACAO-10  # mesmo arquivo (daemon/lifecycle.py) — série por R5
  - ONDA-CONTROLES-07
  - ONDA-JOGAR-02
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - BATERIA-PARADA-01
  - LEVA-1
  - LEVA-4
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/daemon/subsystems/hotkey.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - novo-layout/
---

# MIGRA NAVEGAÇÃO · 16 — A Navegação Interna, e o toque que não diz de quem veio

## O defeito

A decisão dela existe desde 26/08 (`D-CADA-JOGADOR-NAVEGA-COM-O-SEU`), e é a
mais concreta que ela já escreveu sobre esta aba:

> *"as bordas de ambos os controles devem aparecer marcados na tela como se
> fossem personagem de jogo. to com o controle red e o irmão com o blue. **Com o
> meu controle eu navego a interface e apertando x eu seto a informação no meu
> (borda red) e o meu irmão x seta a config dele no blue.**"*

**O fio não existe, e há uma trava medida no caminho.**
`EventTopic.BUTTON_DOWN` publica `{"button", "pressed"}` e **não carrega
`uniq`** — o barramento não sabe de qual controle veio o toque. Está escrito em
dois lugares do produto, os dois como razão de projeto:

- `daemon/subsystems/hotkey.py:955`, sobre o botão de microfone: *"em co-op
  escreveria no controle **ERRADO**: o `BUTTON_DOWN` não carrega `uniq`, então o
  jogador 2 mutaria o firmware do jogador 1"*;
- `profiles/schema.py:892`, sobre por que `mic.button_toggles_system` não é por
  controle: *"o `EventTopic.BUTTON_DOWN` publica `{"button", "pressed"}` e **não
  carrega uniq**, então o laço do mic não tem como saber de qual peça veio o
  toque"*.

**A Navegação Interna é exatamente a feature que essa trava impede.** Sem
remetente, "o X de cada um grava no controle dele" é impossível — e a dica do
mockup já promete isso (`D_INTERNA`).

E há uma segunda trava, mais funda: o poll loop lê o estado do controle
**primário**, e é esse estado que vai para o `hotkey_manager.observe`. Os
secundários do co-op têm um caminho só, o do gamepad virtual
(`daemon/subsystems/coop.py`, `forward_buttons`). **Hoje o jogador 2 não tem
como falar com a janela.**

## O que entrega

1. **O `BUTTON_DOWN` passa a carregar o remetente.** Um campo `uniq` no evento
   — o tópico mora em `core/events.py` e quem o publica é
   `daemon/lifecycle.py:4767` (`self.bus.publish(EventTopic.BUTTON_DOWN,
   {"button": name, "pressed": True})`), num lugar só. O campo é aditivo,
   e quem não o lê continua funcionando. **Isto destrava três
   coisas de uma vez** — a Navegação Interna, o mudo de microfone por jogador
   (`MIC-DOIS-DONOS-01`, aberto de propósito desde 03/08) e a máscara por
   controle. É a sprint mais barata desta onda em linhas e a mais cara em
   consequência.
2. **A leitura dos secundários chega ao barramento.** Sem ela o campo novo vem
   sempre com o mesmo valor, e a régua passa medindo nada. Esta é a metade que
   pode ser cara e que **ninguém mediu**: quanto custa ler os secundários por
   tique quando eles hoje só encaminham.
3. **A tela responde ao remetente.** O X do jogador 2 grava no cartão do jogador
   2, e a **borda** do cartão é como ele se reconhece — que é a palavra dela,
   literal, e é a mesma borda que o P2 do redesenho já define.
4. **Os três degraus do seletor viram três comportamentos reais**
   (`aba06.py`, `ATIVACAO_ESQ`): *Ligada — cada controle navega o Hefesto* ·
   *Só o Player N navega* · *Desligada*. O do meio é o de hoje, e é o único que
   funciona sem o item 1.
5. **A Navegação Interna é outra coisa que o cursor do PC, e a tela diz isso.**
   A dica do mockup já diz: *"É outra coisa que o cursor do PC: esse é **um só**,
   e sai do controle do Player N."* Confundir os dois é o que faz a pessoa
   esperar dois cursores.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_16_o_toque_tem_remetente.py`:

1. **O evento carrega o remetente.** Um `BUTTON_DOWN` publicado pelo controle 2
   chega com o `uniq` do controle 2. **Morde:** publique sem o campo e reprova.
2. **Aditivo: o assinante velho não quebra.** Um assinante que só lê `button` e
   `pressed` continua funcionando. **Morde:** torne o campo obrigatório e
   reprova — quebraria o laço do mic e o do hotkey de uma vez.
3. **O X de cada um grava no cartão dele.** Dois controles, dois toques, dois
   cartões. **Morde:** ignore o remetente e reprova nomeando o cartão errado.
   Este é o teste que a decisão dela pede, e ele **não pode ser escrito hoje**:
   é por isso que a sprint existe.
4. **"Só o Player N navega" continua sendo o padrão até ela dizer o contrário.**
   **Morde:** faça a Navegação Interna nascer ligada e reprova. Ligar por padrão
   muda o que acontece quando o irmão dela pega o controle, e isso é dela.
5. **O custo por tique está medido e escrito.** A leitura dos secundários tem um
   número, e ele está no arquivo. **Morde:** entregue sem o número e reprova —
   *"não prometa o que não foi medido"* é regra desta casa, e esta é a sprint
   com mais chance de custar caro em silêncio.
6. **A bancada, e é dela:** dois controles, ela e o irmão, cada um mexendo no
   cartão dele ao mesmo tempo. Nenhum teste prova que isso é **usável**.

## O que é dela decidir

- **A Navegação Interna nasce ligada ou é interruptor?** É a pergunta 5 do
  contrato da aba, aberta desde 26/08. O mockup desenhou um seletor de três
  degraus, o que já é uma resposta parcial: **é interruptor**. Falta o padrão.
- **Ela vale só na janela do Hefesto, ou também nos diálogos?** A janela tem
  diálogos próprios, e `retratar_dialogos.py` conta os estados deles.
- **O que acontece quando o jogador 2 desconecta com o cartão dele aberto.** É
  a mesma família da `BORDA-DE-QUEDA-01` (03/08): o que fica para trás quando um
  controle cai.

## Uma nota sobre o tamanho

Esta sprint tem **poucas linhas e muita consequência**. O campo novo no
barramento é pequeno; o que ele destrava — mic por jogador, máscara por
controle, navegação por jogador — são três frentes que hoje estão paradas pela
mesma razão, escrita em dois arquivos do produto. Quem coordena pode preferir
que ela saia desta onda e vire sprint de barramento, servindo as três. **A
medição diz que é a mesma linha de código; a decisão de onde ela mora é de quem
rege a leva.**
