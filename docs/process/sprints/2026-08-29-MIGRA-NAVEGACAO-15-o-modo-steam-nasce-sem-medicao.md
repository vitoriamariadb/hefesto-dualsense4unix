---
sprint: MIGRA-NAVEGACAO-15
onda: MIGRA-NAVEGACAO
posse:
  NAV6-STEAM:
    - src/hefesto_dualsense4unix/app/telas/navegacao/modo_steam.py
    - src/hefesto_dualsense4unix/integrations/steam_launcher.py
cria:
  - src/hefesto_dualsense4unix/app/telas/navegacao/modo_steam.py
  - tests/unit/test_migra_navegacao_15_o_modo_steam.py
bancada: true
depois_de:
  - MIGRA-NAVEGACAO-01
  - MIGRA-NAVEGACAO-02
  - MIGRA-NAVEGACAO-10  # ela é quem já mexe no caminho do `open_or_focus_steam`
  - ONDA-SISTEMA-01
  - ONDA-LANCADORES-06
  # A FILA QUE JÁ RECLAMAVA ESTES ARQUIVOS, medida com
  # `scripts/check_colisao_de_sprints.py` em 29/08/2026. Não é escolha de
  # coordenação: quem divide arquivo executa EM SÉRIE (R5). Reconferir no dia
  # do despacho — a fila anda, e endereço de código envelhece calado.
  - ONDA-LANCADORES-07
nao_toca:
  - src/hefesto_dualsense4unix/gui/main.glade
  - src/hefesto_dualsense4unix/app/app.py
  - src/hefesto_dualsense4unix/profiles/schema.py
  - src/hefesto_dualsense4unix/daemon/
  - novo-layout/
---

# MIGRA NAVEGAÇÃO · 15 — O Modo Steam nasce, e ninguém mediu se a Steam obedece

**Decisão dela, 29/08/2026** (`D-O-MODO-STEAM-ENTRA-E-VIRA-SPRINT`), **contra a
recomendação de quem coordena**, que era medir antes:

> *"FICA COMO ESTÁ, E ALGUÉM CONSTRÓI. **RISCO REGISTRADO, e ele é dela agora:**
> ninguém mediu se o Modo Jogo da Steam aceita o gamepad virtual que o Hefesto
> entrega. Se não aceitar, os três degraus da tela não fazem nada — e a sprint
> descobre isso depois de escrita, não antes."*

Esta sprint começa **medindo**, e é por isso que ela é bancada.

## O defeito

**Zero código, em lugar nenhum.** Medido:

```
grep -rln "steam_deck|big_picture|modo_steam|gamepadui" src/   ->  vazio
```

`integrations/steam_launcher.py` só **abre ou foca** (`open_or_focus_steam`). Os
três degraus do seletor do mockup (`aba06.py`, `D_STEAM` e `ATIVACAO_DIR`) são:

1. *Desligado*
2. *Ligado — o controle navega a Steam como num Steam Deck*
3. *Ligado, e a Steam abre em Modo Jogo na próxima vez*

**E o terceiro é diferente dos outros dois.** A dica já diz: *"Esse degrau vale
para a máquina, não só para este perfil."* É o **único valor desta aba que não é
do perfil** — e isso muda o dono do campo.

## O que entrega

### Primeiro, a medição — e ela pode matar a sprint

Antes de uma linha de produto, três perguntas, na bancada dela:

1. **O Modo Jogo da Steam enxerga o gamepad virtual do Hefesto?** Se não, os
   degraus 2 e 3 não fazem nada e o que a tela oferece é fumaça.
2. **Quando o Steam Input está ligado, quem manda?** O guard desta casa
   **desliga** o Steam Input e a allowlist só **preserva** o que já estava
   ligado (`daemon/subsystems/hotkey.py:485`, e o `excecao_inerte` do
   `prontuario_dos_jogos.py`). Um "Modo Steam" que dependa do Steam Input
   contradiz o produto inteiro.
3. **O terceiro degrau existe?** "A Steam abre em Modo Jogo na próxima vez" é
   uma opção do cliente Steam, não nossa. Ou o produto a escreve na configuração
   dela, ou ele só **pede** — e pedir sem poder é o que o produto não faz.

**Se as três respostas forem não, esta sprint entrega a medição e a nota
datada, e a família sai da aba.** Isso não é fracasso: é o que a decisão dela já
previu por escrito.

### Depois, se a medição permitir

4. **O seletor grava, e cada degrau grava no lugar dele** — dois no perfil, o
   terceiro na máquina. A tela **diz qual é qual**; a dica já diz, e a dica
   não pode ser o único lugar onde isso está.
5. **O degrau da máquina tem o mesmo tratamento dos outros fatos da sala**
   (`decisoes-dela.csv`: *"são fatos da sala, não ajuste de perfil"*).
6. **Um botão só.** Ela já corrigiu isso em 27/08: *"o seletor de modo steam tá
   trocado com ativar modo steam Deck. Esses dois botões tem que ser
   Unificados. Deixa Só Modo Steam."* Nasce unificado.

## Como se prova (a mordida)

`tests/unit/test_migra_navegacao_15_o_modo_steam.py`:

1. **A medição está escrita.** O resultado das três perguntas vive num arquivo
   versionado, com data, e o teste **exige que ele exista** antes de qualquer
   asserção de comportamento. **Morde:** apague a medição e o teste reprova
   dizendo que a sprint não pode afirmar nada. É a régua que a decisão dela
   pediu ao aceitar o risco.
2. **O degrau da máquina não vai para o perfil.** Escolher o terceiro degrau
   **não** suja `draft` de perfil nenhum. **Morde:** grave no perfil e reprova —
   seria o valor viajando junto com o jogo, e a próxima troca de perfil o
   apagaria.
3. **A tela não promete o que a medição negou.** Cada degrau que a medição
   reprovar nasce inerte, com o motivo e a data. **Morde:** deixe-o
   selecionável e reprova. É a mesma família do
   `check_paridade_transporte.py`: afirmação forte sem teste que a sustente.
4. **Nada aqui liga o Steam Input.** `grep` por qualquer escrita de Steam Input
   nesta sprint devolve zero. **Morde:** ligue e reprova, citando
   `hotkey.py:485` — *"Nenhuma linha deste repositório liga o Steam Input"*.
5. **Um seletor, não dois.** A página tem **um** endereço para o Modo Steam.
   **Morde:** devolva o segundo botão e reprova citando a fala dela de 27/08.

## O que é dela decidir

- **Nada trava a sprint** — a decisão está tomada e o risco é dela, por escrito.
  O que ela precisa **ver** é a bancada: a Steam em Modo Jogo, o controle na mão,
  e o d-pad andando pelo menu. É a única prova que existe.
- **Se a medição disser não:** a família sai da aba e vira fila própria, e o
  mockup perde o seletor. Isso é decisão dela também, e ela merece o dado antes
  da pergunta.
